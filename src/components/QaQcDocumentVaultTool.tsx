import React, { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  ArrowDown,
  ArrowUp,
  Cloud,
  Crown,
  Download,
  FileSpreadsheet,
  Lock,
  Plus,
  Save,
  Trash2,
  Upload
} from 'lucide-react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import {
  db,
  OperationType,
  handleFirestoreError
} from '../lib/firebase';
import { compressImageFile } from '../lib/storage';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import {
  QA_QC_TEMPLATES_VAULT,
  QaQcTemplateDocument
} from '../data/foodSafetyReferenceData';
import {
  buildDefaultCompanyProfile,
  buildDefaultDocMeta,
  buildDefaultModulePayloads,
  QA_MODULE_CATALOG,
  sanitizeDocPrefix
} from '../data/qaVaultDefaults';
import {
  downloadQaControlledModulePdf,
  downloadQaMasterRegisterPdf,
  downloadQaModuleCsv
} from '../lib/qaVaultPdfGenerator';
import {
  QaControlledDocMeta,
  QaDocumentStatus,
  QaFlowStepCategory,
  QaHazardCategory,
  QaModuleId,
  QaModulePayloadMap,
  QaRiskDomain,
  QaWorkspaceCompanyProfile
} from '../types/qaVault';
import { HubUser } from '../types/hub';

interface QaQcDocumentVaultToolProps {
  user: HubUser;
  isUserPaid: boolean;
  hasExpiredPremium: boolean;
  onOpenPremiumModal: () => void;
  onRequireSignIn?: () => void;
}

const GUEST_STORAGE_KEY = 'fsp_qa_vault_guest_v1';

const STANDARD_OPTIONS = [
  'ISO 9001:2015',
  'FSSC 22000 v6/v7',
  'ISO 22000:2018',
  'Codex HACCP (CXC 1-1969)',
  'ISO/TS 22002-1 (PRPs)',
  'HALAL PS 3733 / OIC-SMIIC'
];

const MODULE_IDS: Array<keyof QaModulePayloadMap> = [
  'sops',
  'approved-supplier',
  'pest-management',
  'haccp-team',
  'product-description',
  'flow-diagram',
  'hazard-analysis',
  'ccp-determination',
  'critical-limits',
  'monitoring-checklists',
  'corrective-actions',
  'verification-form',
  'risk-assessment'
];

function buildInitialMetaMap(
  prefix: string
): Record<keyof QaModulePayloadMap, QaControlledDocMeta> {
  const out = {} as Record<keyof QaModulePayloadMap, QaControlledDocMeta>;
  MODULE_IDS.forEach((id) => {
    out[id] = buildDefaultDocMeta(id, prefix);
  });
  return out;
}

function getRiskBand(score: number): { label: string; cls: string } {
  if (score >= 16) return { label: 'Critical', cls: 'bg-rose-50 text-rose-800 border-rose-200' };
  if (score >= 10) return { label: 'High', cls: 'bg-amber-50 text-amber-800 border-amber-200' };
  if (score >= 5) return { label: 'Medium', cls: 'bg-sky-50 text-sky-800 border-sky-200' };
  return { label: 'Low', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
}

function evaluateCodexDecisionTree(
  q1: 'Yes' | 'No',
  q2: 'Yes' | 'No',
  q3: 'Yes' | 'No',
  q4: 'Yes' | 'No'
): 'CCP' | 'OPRP' | 'PRP' {
  if (q1 === 'No') return 'PRP';
  if (q2 === 'Yes') return 'CCP';
  if (q3 === 'Yes' && q4 === 'No') return 'CCP';
  if (q3 === 'Yes' && q4 === 'Yes') return 'OPRP';
  return 'PRP';
}

export const QaQcDocumentVaultTool: React.FC<QaQcDocumentVaultToolProps> = ({
  user,
  isUserPaid,
  hasExpiredPremium,
  onOpenPremiumModal,
  onRequireSignIn
}) => {
  const isSignedIn = Boolean(user?.uid && user.uid !== 'guest');
  const effectiveUid = isSignedIn ? user.uid : 'guest_qa_vault';
  const isUnlocked = Boolean((isUserPaid && !hasExpiredPremium) || user?.isAdmin);

  const [activeModule, setActiveModule] = useState<QaModuleId>('company-register');
  const [company, setCompany] = useState<QaWorkspaceCompanyProfile>(() =>
    buildDefaultCompanyProfile(
      effectiveUid,
      user?.name,
      user?.company,
      user?.email,
      user?.phone,
      user?.location
    )
  );
  const [metaMap, setMetaMap] = useState<Record<keyof QaModulePayloadMap, QaControlledDocMeta>>(() =>
    buildInitialMetaMap(sanitizeDocPrefix(user?.company || 'Food Safety'))
  );
  const [payloads, setPayloads] = useState<QaModulePayloadMap>(() =>
    buildDefaultModulePayloads(
      user?.company || 'Al-Meezan Food Processing Industries',
      user?.name || 'QA / Food Safety Manager'
    )
  );

  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Module-level focused selectors
  const [selectedSopId, setSelectedSopId] = useState<string>('sop-doc-ctrl');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-1');
  const [selectedChecklistId, setSelectedChecklistId] = useState<string>('chk-thermal');
  const [riskDomainFilter, setRiskDomainFilter] = useState<'All' | QaRiskDomain>('All');
  const [classicCategory, setClassicCategory] = useState<string>('All');
  const [selectedClassicDoc, setSelectedClassicDoc] = useState<QaQcTemplateDocument>(
    QA_QC_TEMPLATES_VAULT[0]
  );

  const notify = (type: 'success' | 'error', text: string) => {
    setBanner({ type, text });
    setTimeout(() => {
      setBanner((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  // Load saved Company Workspace & Modules (Firestore for signed-in users, localStorage for guests)
  useEffect(() => {
    let cancelled = false;

    const loadWorkspace = async () => {
      setIsLoadingWorkspace(true);
      const fallbackCompany = buildDefaultCompanyProfile(
        effectiveUid,
        user?.name,
        user?.company,
        user?.email,
        user?.phone,
        user?.location
      );
      const fallbackPayloads = buildDefaultModulePayloads(
        fallbackCompany.companyName,
        fallbackCompany.preparedBy
      );
      const fallbackMeta = buildInitialMetaMap(fallbackCompany.docCodePrefix);

      if (!isSignedIn) {
        try {
          const raw = localStorage.getItem(GUEST_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as {
              company?: QaWorkspaceCompanyProfile;
              metaMap?: Record<keyof QaModulePayloadMap, QaControlledDocMeta>;
              payloads?: Partial<QaModulePayloadMap>;
            };
            if (!cancelled) {
              if (parsed.company) setCompany(parsed.company);
              if (parsed.metaMap) setMetaMap({ ...fallbackMeta, ...parsed.metaMap });
              if (parsed.payloads) setPayloads({ ...fallbackPayloads, ...parsed.payloads });
            }
          } else if (!cancelled) {
            setCompany(fallbackCompany);
            setMetaMap(fallbackMeta);
            setPayloads(fallbackPayloads);
          }
        } catch {
          if (!cancelled) {
            setCompany(fallbackCompany);
            setMetaMap(fallbackMeta);
            setPayloads(fallbackPayloads);
          }
        } finally {
          if (!cancelled) setIsLoadingWorkspace(false);
        }
        return;
      }

      try {
        const wsRef = doc(db, 'qaDocumentWorkspaces', user.uid);
        const wsSnap = await getDoc(wsRef);
        const modsSnap = await getDocs(
          collection(db, 'qaDocumentWorkspaces', user.uid, 'modules')
        );

        if (cancelled) return;

        const loadedCompany = wsSnap.exists()
          ? (wsSnap.data() as QaWorkspaceCompanyProfile)
          : fallbackCompany;
        const nextMeta = buildInitialMetaMap(loadedCompany.docCodePrefix || 'QFS');
        const nextPayloads = wsSnap.exists()
          ? buildDefaultModulePayloads(
              loadedCompany.companyName,
              loadedCompany.preparedBy
            )
          : fallbackPayloads;

        modsSnap.forEach((d) => {
          const mId = d.id as keyof QaModulePayloadMap;
          const mData = d.data() as {
            meta?: QaControlledDocMeta;
            payload?: QaModulePayloadMap[typeof mId];
          };
          if (MODULE_IDS.includes(mId)) {
            if (mData.meta) nextMeta[mId] = mData.meta;
            if (mData.payload) {
              (nextPayloads as Record<string, unknown>)[mId] = mData.payload;
            }
          }
        });

        setCompany(loadedCompany);
        setMetaMap(nextMeta);
        setPayloads(nextPayloads);
      } catch (err) {
        try {
          handleFirestoreError(
            err,
            OperationType.GET,
            `qaDocumentWorkspaces/${user.uid}`
          );
        } catch {
          // Allow local fallback editing even if read failed
        }
      } finally {
        if (!cancelled) setIsLoadingWorkspace(false);
      }
    };

    loadWorkspace();
    return () => {
      cancelled = true;
    };
  }, [
    isSignedIn,
    effectiveUid,
    user?.uid,
    user?.name,
    user?.company,
    user?.email,
    user?.phone,
    user?.location
  ]);

  const persistGuestVault = (
    nextCompany: QaWorkspaceCompanyProfile,
    nextMetaMap: Record<keyof QaModulePayloadMap, QaControlledDocMeta>,
    nextPayloads: QaModulePayloadMap
  ) => {
    try {
      localStorage.setItem(
        GUEST_STORAGE_KEY,
        JSON.stringify({
          company: nextCompany,
          metaMap: nextMetaMap,
          payloads: nextPayloads
        })
      );
    } catch {
      // Ignore storage quota error
    }
  };

  const sanitizeWorkspaceForFirestore = (
    ws: QaWorkspaceCompanyProfile
  ): QaWorkspaceCompanyProfile => {
    const clean: QaWorkspaceCompanyProfile = {
      uid: user.uid,
      ownerUid: user.uid,
      companyName: (ws.companyName || 'Food Organization').trim().slice(0, 160),
      industryType: (ws.industryType || 'Food Manufacturing').trim().slice(0, 120),
      facilityAddress: (ws.facilityAddress || '').trim().slice(0, 300),
      scopeStatement: (ws.scopeStatement || '').trim().slice(0, 1200),
      standards: (ws.standards || []).slice(0, 12),
      docCodePrefix: (ws.docCodePrefix || 'QFS').trim().slice(0, 24),
      pfaOrRegNo: (ws.pfaOrRegNo || '').trim().slice(0, 120),
      contactPhone: (ws.contactPhone || '').trim().slice(0, 60),
      contactEmail: (ws.contactEmail || '').trim().slice(0, 200),
      logoUrl: (ws.logoUrl || '').slice(0, 440000),
      preparedBy: (ws.preparedBy || '').trim().slice(0, 120),
      preparedRole: (ws.preparedRole || '').trim().slice(0, 120),
      reviewedBy: (ws.reviewedBy || '').trim().slice(0, 120),
      reviewedRole: (ws.reviewedRole || '').trim().slice(0, 120),
      approvedBy: (ws.approvedBy || '').trim().slice(0, 120),
      approvedRole: (ws.approvedRole || '').trim().slice(0, 120),
      createdAt: ws.createdAt || new Date().toISOString().slice(0, 19) + 'Z',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    return clean;
  };

  const handleSaveCompanyWorkspace = async (rebrandCodes = false) => {
    if (!company.companyName.trim()) {
      notify('error', 'Please enter your Company / Organization Name first.');
      return;
    }
    setIsSaving(true);
    const nowIso = new Date().toISOString().slice(0, 19) + 'Z';
    const nextPrefix =
      company.docCodePrefix.trim() || sanitizeDocPrefix(company.companyName);
    const updatedCompany: QaWorkspaceCompanyProfile = {
      ...company,
      uid: effectiveUid,
      ownerUid: effectiveUid,
      docCodePrefix: nextPrefix.toUpperCase().slice(0, 24),
      updatedAt: nowIso
    };

    let updatedMetaMap = { ...metaMap };
    if (rebrandCodes) {
      updatedMetaMap = { ...metaMap };
      MODULE_IDS.forEach((mId) => {
        const entry = QA_MODULE_CATALOG.find((c) => c.id === mId);
        updatedMetaMap[mId] = {
          ...updatedMetaMap[mId],
          docCode: `${updatedCompany.docCodePrefix}-${entry?.defaultSuffix || 'DOC'}`,
          updatedAt: nowIso
        };
      });
      setMetaMap(updatedMetaMap);
    }

    setCompany(updatedCompany);

    try {
      if (!isSignedIn) {
        persistGuestVault(updatedCompany, updatedMetaMap, payloads);
        notify(
          'success',
          'Company profile saved locally. Sign in anytime to sync permanently across devices.'
        );
        return;
      }

      const cleanWs = sanitizeWorkspaceForFirestore(updatedCompany);
      const batch = writeBatch(db);
      batch.set(doc(db, 'qaDocumentWorkspaces', user.uid), cleanWs);
      if (rebrandCodes) {
        MODULE_IDS.forEach((mId) => {
          batch.set(doc(db, 'qaDocumentWorkspaces', user.uid, 'modules', mId), {
            moduleId: mId,
            ownerUid: user.uid,
            meta: updatedMetaMap[mId],
            payload: payloads[mId]
          });
        });
      }
      await batch.commit();
      notify(
        'success',
        `Saved ${cleanWs.companyName} QMS/FSMS workspace and synced document headers.`
      );
    } catch (err) {
      try {
        handleFirestoreError(
          err,
          OperationType.WRITE,
          `qaDocumentWorkspaces/${user.uid}`
        );
      } catch {
        notify('error', 'Could not save company workspace to cloud. Please retry.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveActiveModule = async <K extends keyof QaModulePayloadMap>(
    moduleId: K,
    customPayload?: QaModulePayloadMap[K],
    customMeta?: QaControlledDocMeta
  ) => {
    const nowIso = new Date().toISOString().slice(0, 19) + 'Z';
    const nextMeta: QaControlledDocMeta = {
      ...(customMeta || metaMap[moduleId]),
      docCode: ((customMeta || metaMap[moduleId]).docCode || 'QFS-DOC-01').trim().slice(0, 64),
      revision: ((customMeta || metaMap[moduleId]).revision || 'Rev 1.0').trim().slice(0, 32),
      effectiveDate: ((customMeta || metaMap[moduleId]).effectiveDate || nowIso.slice(0, 10)).slice(0, 64),
      updatedAt: nowIso
    };
    const nextPayload = customPayload || payloads[moduleId];
    const nextMetaMap = { ...metaMap, [moduleId]: nextMeta };
    const nextPayloads = { ...payloads, [moduleId]: nextPayload };

    setMetaMap(nextMetaMap);
    setPayloads(nextPayloads);
    setIsSaving(true);

    try {
      if (!isSignedIn) {
        persistGuestVault(company, nextMetaMap, nextPayloads);
        notify('success', `${nextMeta.docCode} saved locally to browser vault.`);
        return;
      }

      const cleanWs = sanitizeWorkspaceForFirestore(company);
      const batch = writeBatch(db);
      batch.set(doc(db, 'qaDocumentWorkspaces', user.uid), cleanWs);
      batch.set(doc(db, 'qaDocumentWorkspaces', user.uid, 'modules', moduleId), {
        moduleId,
        ownerUid: user.uid,
        meta: nextMeta,
        payload: nextPayload
      });
      await batch.commit();
      notify('success', `Saved controlled document ${nextMeta.docCode} (${nextMeta.revision}) to cloud.`);
    } catch (err) {
      try {
        handleFirestoreError(
          err,
          OperationType.WRITE,
          `qaDocumentWorkspaces/${user.uid}/modules/${moduleId}`
        );
      } catch {
        notify('error', 'Failed to save module. Please check your connection and try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const compressed = await compressImageFile(file, 420, 0.84);
      if (compressed.dataUrl.length > 420000) {
        notify('error', 'Compressed logo exceeds 420 KB. Please choose a smaller logo image.');
      } else {
        setCompany((prev) => ({ ...prev, logoUrl: compressed.dataUrl }));
        notify('success', 'Company logo ready. Click Save Company Profile to apply to all PDFs.');
      }
    } catch {
      notify('error', 'Could not read logo image file.');
    } finally {
      setIsUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleExportModulePdf = (moduleId: keyof QaModulePayloadMap) => {
    if (!isUnlocked) {
      onOpenPremiumModal();
      return;
    }
    downloadQaControlledModulePdf(company, moduleId, metaMap[moduleId], payloads[moduleId]);
    notify('success', `Exported controlled PDF: ${metaMap[moduleId].docCode}`);
  };

  const handleExportModuleCsv = (moduleId: keyof QaModulePayloadMap) => {
    if (!isUnlocked) {
      onOpenPremiumModal();
      return;
    }
    const meta = metaMap[moduleId];
    switch (moduleId) {
      case 'sops':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'Standard Operating Procedures',
          ['SOP Code', 'Title', 'Standard', 'Department', 'Revision', 'Status', 'Purpose', 'Steps'],
          payloads.sops.sops.map((s) => [
            s.sopCode,
            s.title,
            s.standardRef,
            s.department,
            s.revision,
            s.status,
            s.purpose,
            s.procedureSteps.join(' | ')
          ])
        );
        break;
      case 'approved-supplier':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'Approved Supplier Register',
          ['Supplier', 'Material', 'Risk Tier', 'Certifications', 'Expiry', 'Audit Method', 'Score %', 'COA Spec', 'Status', 'Next Review'],
          payloads['approved-supplier'].suppliers.map((s) => [
            s.supplierName,
            s.materialSupplied,
            s.riskTier,
            s.certifications,
            s.certExpiry,
            s.auditMethod,
            String(s.auditScorePct),
            s.coaParameters,
            s.approvalStatus,
            s.nextEvaluationDate
          ])
        );
        break;
      case 'pest-management':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'Pest Management Device Register',
          ['Device ID', 'Zone', 'Device Type', 'Target Pest', 'Frequency', 'Last Catch', 'Threshold', 'Action'],
          payloads['pest-management'].devices.map((d) => [
            d.deviceCode,
            d.zoneLocation,
            d.deviceType,
            d.targetPest,
            d.inspectionFrequency,
            String(d.lastActivityCount),
            d.thresholdTrigger,
            d.correctiveActionNote
          ])
        );
        break;
      case 'haccp-team':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'HACCP Team Register',
          ['Name', 'Designation', 'Department', 'HACCP Role', 'Qualification', 'Training', 'Responsibilities'],
          payloads['haccp-team'].members.map((m) => [
            m.fullName,
            m.designation,
            m.department,
            m.haccpRole,
            m.qualificationAndExp,
            m.trainingCredentials,
            m.assignedResponsibilities
          ])
        );
        break;
      case 'product-description':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'Product Description & Intended Use',
          ['Code', 'Product Name', 'Category', 'Intrinsic Factors', 'Processing', 'Packaging', 'Shelf Life', 'Intended Use', 'Allergens'],
          payloads['product-description'].products.map((p) => [
            p.productCode,
            p.productName,
            p.productCategory,
            p.intrinsicCharacteristics,
            p.processingMethod,
            p.packagingMaterial,
            p.shelfLifeAndStorage,
            p.intendedUse,
            p.allergenDeclaration
          ])
        );
        break;
      case 'flow-diagram':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'Process Flow & Verification',
          ['Step #', 'Step Name', 'Category', 'Class', 'Inputs', 'Parameters', 'Wastes/Rework'],
          payloads['flow-diagram'].steps.map((s) => [
            String(s.stepNumber),
            s.stepName,
            s.stepCategory,
            s.controlClassification,
            s.inputsAndIngredients,
            s.equipmentAndParams,
            s.wastesAndRework
          ])
        );
        break;
      case 'hazard-analysis':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'Hazard Analysis Worksheet',
          ['Step/Material', 'Category', 'Hazard', 'Cause', 'Likelihood', 'Severity', 'Risk Score', 'Control Measures', 'Program'],
          payloads['hazard-analysis'].rows.map((r) => [
            r.stepOrMaterial,
            r.hazardCategory,
            r.hazardDescription,
            r.causeOrSource,
            String(r.likelihood),
            String(r.severity),
            String(r.likelihood * r.severity),
            r.controlMeasures,
            r.appliedProgram
          ])
        );
        break;
      case 'ccp-determination':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'CCP Decision Tree',
          ['Step', 'Hazard', 'Q1', 'Q2', 'Q3', 'Q4', 'Classification', 'ID', 'Rationale'],
          payloads['ccp-determination'].rows.map((r) => [
            r.stepName,
            r.significantHazard,
            r.q1ControlMeasureExists,
            r.q2DesignedToEliminate,
            r.q3ContaminationCouldIncrease,
            r.q4SubsequentStepEliminates,
            r.classification,
            r.ccpNumber,
            r.decisionRationale
          ])
        );
        break;
      case 'critical-limits':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'Critical Control Limits',
          ['ID', 'Step', 'Hazard', 'Critical Limit', 'Operational Target', 'Scientific Basis', 'Evidence Ref'],
          payloads['critical-limits'].rows.map((r) => [
            r.ccpOrOprpNumber,
            r.processStep,
            r.hazardControlled,
            r.criticalLimit,
            r.operationalTarget,
            r.scientificValidationBasis,
            r.validationEvidenceRef
          ])
        );
        break;
      case 'monitoring-checklists': {
        const chk =
          payloads['monitoring-checklists'].checklists.find((c) => c.id === selectedChecklistId) ||
          payloads['monitoring-checklists'].checklists[0];
        if (chk) {
          downloadQaModuleCsv(
            company,
            chk.checklistCode,
            chk.title,
            ['Checkpoint', 'Frequency', 'Limit', 'Actual Reading', 'Status', 'Initials', 'Remarks'],
            chk.items.map((it) => [
              it.checkpointName,
              it.frequency,
              it.acceptableLimit,
              it.actualReading,
              it.status,
              it.operatorInitials,
              it.remarks
            ])
          );
        }
        break;
      }
      case 'corrective-actions':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'Corrective Action Register',
          ['CAR #', 'Date', 'Source', 'Batch', 'Qty', 'Deviation', 'Correction', 'Disposition', '5-Why RCA', 'Corrective Action', 'Owner', 'Target', 'Status'],
          payloads['corrective-actions'].records.map((r) => [
            r.carNumber,
            r.dateRaised,
            r.source,
            r.affectedProductBatch,
            r.quantityHeld,
            r.deviationDescription,
            r.immediateCorrection,
            r.productDisposition,
            r.rootCause5Why,
            r.correctiveActionPlan,
            r.responsiblePerson,
            r.targetDate,
            r.status
          ])
        );
        break;
      case 'verification-form':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'Verification Schedule',
          ['Activity', 'Clause', 'Frequency', 'Method/Criteria', 'Last Date', 'Finding', 'Status', 'Next Due', 'Verifier'],
          payloads['verification-form'].rows.map((r) => [
            r.activityName,
            r.standardClause,
            r.frequency,
            r.methodAndCriteria,
            r.lastVerifiedDate,
            r.actualFinding,
            r.verificationStatus,
            r.nextDueDate,
            r.verifierName
          ])
        );
        break;
      case 'risk-assessment':
        downloadQaModuleCsv(
          company,
          meta.docCode,
          'ISO 9001 & FSSC 22000 Risk Assessment',
          ['Risk ID', 'Domain', 'Area', 'Risk/Opportunity', 'Impact', 'Inh L', 'Inh S', 'Inh Score', 'Existing Controls', 'Mitigation Plan', 'Owner', 'Res L', 'Res S', 'Res Score', 'Status'],
          payloads['risk-assessment'].rows.map((r) => [
            r.riskCode,
            r.domain,
            r.processOrArea,
            r.riskOrOpportunity,
            r.potentialImpact,
            String(r.inherentLikelihood),
            String(r.inherentSeverity),
            String(r.inherentLikelihood * r.inherentSeverity),
            r.existingControls,
            r.mitigationActionPlan,
            r.owner,
            String(r.residualLikelihood),
            String(r.residualSeverity),
            String(r.residualLikelihood * r.residualSeverity),
            r.reviewStatus
          ])
        );
        break;
    }
    notify('success', `Downloaded Excel/CSV sheet for ${meta.docCode}`);
  };

  // Classic quick-print template exporter (uses Company Name & QA Lead dynamically)
  const handleClassicPdf = (docItem: QaQcTemplateDocument) => {
    if (!isUnlocked) {
      onOpenPremiumModal();
      return;
    }
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 297, 24, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text(`${docItem.code} — ${docItem.title.toUpperCase()}`, 12, 10.5);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Company: ${company.companyName}  |  Prepared By: ${company.preparedBy}  |  Standard: ${docItem.standardBadge}  |  ${docItem.revision}`,
      12,
      18
    );

    const colWidth = 273 / docItem.columns.length;
    let y = 33;
    pdf.setFillColor(22, 115, 184);
    pdf.rect(12, y - 5, 273, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    docItem.columns.forEach((col, i) => {
      const wrapped = pdf.splitTextToSize(col, colWidth - 3);
      pdf.text(wrapped[0] || col, 13.5 + i * colWidth, y + 1);
    });

    y += 9;
    pdf.setTextColor(20, 28, 45);
    pdf.setFont('helvetica', 'normal');
    docItem.sampleRows.forEach((row) => {
      const cellLines = row.map((cell) => pdf.splitTextToSize(cell, colWidth - 3));
      const maxLines = Math.max(...cellLines.map((l) => l.length), 2);
      const rowHeight = Math.max(12, maxLines * 4.2 + 4);
      pdf.setDrawColor(210, 222, 234);
      pdf.rect(12, y - 3, 273, rowHeight);
      cellLines.forEach((lines, i) => {
        if (i > 0) pdf.line(12 + i * colWidth, y - 3, 12 + i * colWidth, y - 3 + rowHeight);
        pdf.text(lines, 13.5 + i * colWidth, y + 1.5);
      });
      y += rowHeight;
    });

    for (let b = 0; b < 3; b += 1) {
      if (y + 12 > 185) break;
      pdf.rect(12, y - 3, 273, 11);
      for (let i = 1; i < docItem.columns.length; i += 1) {
        pdf.line(12 + i * colWidth, y - 3, 12 + i * colWidth, y + 8);
      }
      y += 11;
    }

    pdf.save(`${docItem.code}-${company.companyName.replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 24)}.pdf`);
    notify('success', `Downloaded controlled form ${docItem.code}`);
  };

  const activeCatalogEntry = useMemo(
    () => QA_MODULE_CATALOG.find((m) => m.id === activeModule) || QA_MODULE_CATALOG[0],
    [activeModule]
  );

  const isManagedDocumentModule = (id: QaModuleId): id is keyof QaModulePayloadMap =>
    id !== 'company-register' && id !== 'classic-templates';

  const moduleGroups = useMemo(() => {
    const order = [
      'Setup & Control',
      'QMS & PRPs (ISO 9001 / FSSC)',
      'Codex 12-Step HACCP',
      'Monitoring, CAPA & Risk',
      'Classic Forms'
    ] as const;
    return order.map((g) => ({
      group: g,
      items: QA_MODULE_CATALOG.filter((m) => m.group === g)
    }));
  }, []);

  // Risk matrix analytics
  const riskSummary = useMemo(() => {
    const rows = payloads['risk-assessment'].rows;
    const countBand = (scores: number[]) => ({
      critical: scores.filter((s) => s >= 16).length,
      high: scores.filter((s) => s >= 10 && s < 16).length,
      medium: scores.filter((s) => s >= 5 && s < 10).length,
      low: scores.filter((s) => s < 5).length
    });
    const inherent = countBand(rows.map((r) => r.inherentLikelihood * r.inherentSeverity));
    const residual = countBand(rows.map((r) => r.residualLikelihood * r.residualSeverity));
    return { total: rows.length, inherent, residual };
  }, [payloads]);

  // Active sub-items
  const activeSop = useMemo(
    () =>
      payloads.sops.sops.find((s) => s.id === selectedSopId) ||
      payloads.sops.sops[0] ||
      null,
    [payloads.sops.sops, selectedSopId]
  );

  const activeProduct = useMemo(
    () =>
      payloads['product-description'].products.find((p) => p.id === selectedProductId) ||
      payloads['product-description'].products[0] ||
      null,
    [payloads['product-description'].products, selectedProductId]
  );

  const activeChecklist = useMemo(
    () =>
      payloads['monitoring-checklists'].checklists.find((c) => c.id === selectedChecklistId) ||
      payloads['monitoring-checklists'].checklists[0] ||
      null,
    [payloads['monitoring-checklists'].checklists, selectedChecklistId]
  );

  const renderDocControlBar = (moduleId: keyof QaModulePayloadMap) => {
    const meta = metaMap[moduleId];
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <div className="text-xs text-slate-500 font-medium">
              {activeCatalogEntry.orderCode}. {activeCatalogEntry.standardRef}
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {activeCatalogEntry.fullTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveActiveModule(moduleId)}
              className="px-4 py-2 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-60 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Document'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleExportModulePdf(moduleId)}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              {isUnlocked ? <Download className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isUnlocked ? 'Export PDF' : 'Unlock PDF (Paid)'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleExportModuleCsv(moduleId)}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              {isUnlocked ? (
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-200">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Document Code
            </label>
            <input
              type="text"
              value={meta.docCode}
              onChange={(e) =>
                setMetaMap((prev) => ({
                  ...prev,
                  [moduleId]: { ...prev[moduleId], docCode: e.target.value }
                }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono tabular-nums font-semibold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Revision
            </label>
            <input
              type="text"
              value={meta.revision}
              onChange={(e) =>
                setMetaMap((prev) => ({
                  ...prev,
                  [moduleId]: { ...prev[moduleId], revision: e.target.value }
                }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono tabular-nums font-semibold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Control Status
            </label>
            <select
              value={meta.status}
              onChange={(e) =>
                setMetaMap((prev) => ({
                  ...prev,
                  [moduleId]: {
                    ...prev[moduleId],
                    status: e.target.value as QaDocumentStatus
                  }
                }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-900"
            >
              <option value="draft">Draft</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Effective Date
            </label>
            <input
              type="date"
              value={meta.effectiveDate}
              onChange={(e) =>
                setMetaMap((prev) => ({
                  ...prev,
                  [moduleId]: { ...prev[moduleId], effectiveDate: e.target.value }
                }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono tabular-nums text-slate-900"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Review Cycle
            </label>
            <input
              type="text"
              value={meta.reviewCycle}
              onChange={(e) =>
                setMetaMap((prev) => ({
                  ...prev,
                  [moduleId]: { ...prev[moduleId], reviewCycle: e.target.value }
                }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Workspace Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
            <img
              src={company.logoUrl || FS_PORTAL_LOGO_DATA_URI}
              alt={company.companyName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-sky-200 truncate">
              {company.companyName} · {company.docCodePrefix} · ISO 9001 &amp; FSSC 22000 Suite
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">
              QA/QC, ISO 9001, FSSC 22000 &amp; HACCP Document Studio
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!isSignedIn && onRequireSignIn && (
            <button
              type="button"
              onClick={onRequireSignIn}
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Sign In for Cloud Sync</span>
            </button>
          )}
          {!isUnlocked && (
            <button
              type="button"
              onClick={onOpenPremiumModal}
              className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Unlock Controlled PDFs</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {banner && (
        <div
          className={`px-5 py-2.5 text-xs font-semibold border-b flex items-center justify-between gap-2 ${
            banner.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <span>{banner.text}</span>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-xs underline cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Mobile Module Switcher */}
      <div className="lg:hidden p-4 border-b border-slate-200 bg-slate-50">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Select QMS / FSMS / HACCP Document Module
        </label>
        <select
          value={activeModule}
          onChange={(e) => setActiveModule(e.target.value as QaModuleId)}
          className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-900"
        >
          {QA_MODULE_CATALOG.map((m) => (
            <option key={m.id} value={m.id}>
              {m.orderCode}. {m.shortTitle}
            </option>
          ))}
        </select>
      </div>

      {/* Two-Column Enterprise Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        {/* Left Navigation Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 border-r border-slate-200 bg-slate-50/70 p-4 space-y-5">
          {moduleGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <div className="px-2 text-[11px] font-bold text-slate-500 tracking-wide">
                {grp.group}
              </div>
              <div className="space-y-0.5">
                {grp.items.map((item) => {
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveModule(item.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#1673B8] text-white font-semibold'
                          : 'text-slate-700 hover:bg-slate-200/70 font-medium'
                      }`}
                    >
                      <span className="truncate">
                        <span className="font-mono tabular-nums mr-1.5 opacity-80">
                          {item.orderCode}.
                        </span>
                        {item.shortTitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Workspace Canvas */}
        <main className="lg:col-span-9 p-4 sm:p-6 space-y-5 overflow-x-hidden">
          {isLoadingWorkspace ? (
            <div className="space-y-3 py-8">
              <div className="h-8 bg-slate-100 rounded-lg w-2/3 animate-pulse" />
              <div className="h-24 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-48 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : (
            <>
              {isManagedDocumentModule(activeModule) && renderDocControlBar(activeModule)}

              {/* ============================================================
                  00. COMPANY SETUP & MASTER DOCUMENT CONTROL REGISTER
                  ============================================================ */}
              {activeModule === 'company-register' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="text-xs text-slate-500 font-medium">
                        ISO 9001:2015 Cl. 7.5 · FSSC 22000 · Isolated Per-Account Binder
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Company Profile &amp; Master Document Control Register
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Configure your organization details, logo, scope, and authorized signatories once. Every SOP, Supplier Program, Pest Procedure, HACCP Plan, Monitoring Checklist, and Risk Assessment automatically inherits this branding.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSaveCompanyWorkspace(true)}
                        className="px-4 py-2 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Saving...' : 'Save & Apply to All Docs'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isUnlocked) {
                            onOpenPremiumModal();
                            return;
                          }
                          downloadQaMasterRegisterPdf(company, metaMap);
                          notify('success', 'Master Document Control Register PDF downloaded.');
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        {isUnlocked ? <Download className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>{isUnlocked ? 'Export Master Register PDF' : 'Unlock Register PDF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Company Details Form */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-8 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Company / Organization / Restaurant Name
                          </label>
                          <input
                            type="text"
                            value={company.companyName}
                            onChange={(e) =>
                              setCompany((prev) => ({
                                ...prev,
                                companyName: e.target.value
                              }))
                            }
                            placeholder="e.g. Al-Meezan Dairy & Food Industries"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Document Code Prefix (Auto-Applied)
                          </label>
                          <input
                            type="text"
                            maxLength={16}
                            value={company.docCodePrefix}
                            onChange={(e) =>
                              setCompany((prev) => ({
                                ...prev,
                                docCodePrefix: e.target.value.toUpperCase()
                              }))
                            }
                            placeholder="AMF"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-semibold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Industry Sector
                          </label>
                          <input
                            type="text"
                            value={company.industryType}
                            onChange={(e) =>
                              setCompany((prev) => ({ ...prev, industryType: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Facility Address &amp; Site Location
                          </label>
                          <input
                            type="text"
                            value={company.facilityAddress}
                            onChange={(e) =>
                              setCompany((prev) => ({ ...prev, facilityAddress: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Food Authority License / Reg #
                          </label>
                          <input
                            type="text"
                            value={company.pfaOrRegNo}
                            onChange={(e) =>
                              setCompany((prev) => ({ ...prev, pfaOrRegNo: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            QA Contact Email
                          </label>
                          <input
                            type="email"
                            value={company.contactEmail}
                            onChange={(e) =>
                              setCompany((prev) => ({ ...prev, contactEmail: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            QMS / FSMS Scope Statement (ISO 9001 Cl. 4.3 &amp; FSSC 22000)
                          </label>
                          <textarea
                            rows={2}
                            value={company.scopeStatement}
                            onChange={(e) =>
                              setCompany((prev) => ({ ...prev, scopeStatement: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Standards Multi-Selector */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-slate-700">
                          Applicable Management Standards
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {STANDARD_OPTIONS.map((std) => {
                            const selected = company.standards.includes(std);
                            return (
                              <button
                                key={std}
                                type="button"
                                onClick={() =>
                                  setCompany((prev) => ({
                                    ...prev,
                                    standards: selected
                                      ? prev.standards.filter((s) => s !== std)
                                      : [...prev.standards, std]
                                  }))
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer whitespace-nowrap ${
                                  selected
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                {std}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Company Logo & Authorization Signatories */}
                    <div className="md:col-span-4 space-y-4">
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                        <div className="text-xs font-bold text-slate-900">
                          Company Logo (Controlled PDF Header)
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white p-1.5 flex items-center justify-center shrink-0">
                            <img
                              src={company.logoUrl || FS_PORTAL_LOGO_DATA_URI}
                              alt="Company logo"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer">
                              <Upload className="w-3.5 h-3.5 text-[#1673B8]" />
                              <span>{isUploadingLogo ? 'Processing...' : 'Upload Logo'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                            </label>
                            {company.logoUrl && (
                              <button
                                type="button"
                                onClick={() => setCompany((prev) => ({ ...prev, logoUrl: '' }))}
                                className="block text-[11px] text-rose-600 hover:underline cursor-pointer"
                              >
                                Remove custom logo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2.5">
                        <div className="text-xs font-bold text-slate-900">
                          Document Authorization Signatories
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-0.5">
                            Prepared By (FSTL / QA)
                          </label>
                          <input
                            type="text"
                            value={company.preparedBy}
                            onChange={(e) =>
                              setCompany((prev) => ({ ...prev, preparedBy: e.target.value }))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-0.5">
                            Reviewed By (Production / Ops)
                          </label>
                          <input
                            type="text"
                            value={company.reviewedBy}
                            onChange={(e) =>
                              setCompany((prev) => ({ ...prev, reviewedBy: e.target.value }))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-0.5">
                            Approved By (Top Management)
                          </label>
                          <input
                            type="text"
                            value={company.approvedBy}
                            onChange={(e) =>
                              setCompany((prev) => ({ ...prev, approvedBy: e.target.value }))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Master Document Control Register Table */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Master Document Control Register ({MODULE_IDS.length} Controlled Modules)
                    </h3>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-900 text-white">
                            <th className="p-2.5 font-semibold">Doc Code</th>
                            <th className="p-2.5 font-semibold">Document Title</th>
                            <th className="p-2.5 font-semibold">Standard Clause</th>
                            <th className="p-2.5 font-semibold">Rev</th>
                            <th className="p-2.5 font-semibold">Status</th>
                            <th className="p-2.5 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {QA_MODULE_CATALOG.filter((m) => isManagedDocumentModule(m.id)).map((m) => {
                            const id = m.id as keyof QaModulePayloadMap;
                            const docMeta = metaMap[id];
                            return (
                              <tr key={id} className="hover:bg-slate-50">
                                <td className="p-2.5 font-mono tabular-nums font-semibold text-[#1673B8] whitespace-nowrap">
                                  {docMeta.docCode}
                                </td>
                                <td className="p-2.5 font-semibold text-slate-900">{m.fullTitle}</td>
                                <td className="p-2.5 text-slate-600">{docMeta.standardClause}</td>
                                <td className="p-2.5 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                                  {docMeta.revision}
                                </td>
                                <td className="p-2.5 capitalize text-slate-700 whitespace-nowrap">
                                  {docMeta.status.replace('_', ' ')}
                                </td>
                                <td className="p-2.5 text-right whitespace-nowrap space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setActiveModule(id)}
                                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold cursor-pointer"
                                  >
                                    Open &amp; Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleExportModulePdf(id)}
                                    className="px-2.5 py-1 rounded bg-[#1673B8] hover:bg-[#105E9A] text-white text-[11px] font-semibold cursor-pointer"
                                  >
                                    PDF
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================
                  01. SOPs LIBRARY & BUILDER
                  ============================================================ */}
              {activeModule === 'sops' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-slate-600">
                      Select an SOP to tailor for {company.companyName}, or create custom ISO 9001 / FSSC 22000 procedures.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = payloads.sops.sops.length + 1;
                        const newId = `sop-${Date.now()}`;
                        const newSop = {
                          id: newId,
                          sopCode: `${company.docCodePrefix}-SOP-0${nextIdx}`,
                          title: 'New Custom Standard Operating Procedure',
                          standardRef: 'ISO 9001 Cl. 8.1 · FSSC 22000',
                          department: 'Quality Assurance & Production',
                          revision: 'Rev 1.0',
                          status: 'draft' as QaDocumentStatus,
                          purpose: `Define controlled execution steps at ${company.companyName}.`,
                          scope: 'All relevant operations and staff.',
                          responsibilities: `${company.preparedBy} verifies compliance; operators execute.`,
                          procedureSteps: [
                            '1. Verify pre-operational readiness and calibrated instruments.',
                            '2. Execute process parameters within specified tolerance limits.',
                            '3. Record readings and escalate deviations immediately.'
                          ],
                          recordsRequired: 'Signed Process Control Log & QA Review Sheet'
                        };
                        setPayloads((prev) => ({
                          ...prev,
                          sops: { sops: [...prev.sops.sops, newSop] }
                        }));
                        setSelectedSopId(newId);
                      }}
                      className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom SOP</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 space-y-2">
                      {payloads.sops.sops.map((sop) => (
                        <button
                          key={sop.id}
                          type="button"
                          onClick={() => setSelectedSopId(sop.id)}
                          className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-colors space-y-1 ${
                            activeSop?.id === sop.id
                              ? 'bg-sky-50 border-[#1673B8]'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-[11px] font-mono tabular-nums font-semibold text-[#1673B8]">
                            {sop.sopCode} · {sop.revision} · {sop.status.toUpperCase()}
                          </div>
                          <div className="text-xs font-bold text-slate-900">{sop.title}</div>
                          <div className="text-[11px] text-slate-500">{sop.department}</div>
                        </button>
                      ))}
                    </div>

                    {activeSop && (
                      <div className="md:col-span-8 border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                          <h3 className="text-sm font-bold text-slate-900">
                            Edit Procedure: {activeSop.sopCode}
                          </h3>
                          {payloads.sops.sops.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const remaining = payloads.sops.sops.filter(
                                  (s) => s.id !== activeSop.id
                                );
                                setPayloads((prev) => ({
                                  ...prev,
                                  sops: { sops: remaining }
                                }));
                                setSelectedSopId(remaining[0]?.id || '');
                              }}
                              className="text-xs text-rose-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete SOP</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              SOP Code
                            </label>
                            <input
                              type="text"
                              value={activeSop.sopCode}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  sops: {
                                    sops: prev.sops.sops.map((s) =>
                                      s.id === activeSop.id ? { ...s, sopCode: e.target.value } : s
                                    )
                                  }
                                }))
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Standard Clause Reference
                            </label>
                            <input
                              type="text"
                              value={activeSop.standardRef}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  sops: {
                                    sops: prev.sops.sops.map((s) =>
                                      s.id === activeSop.id ? { ...s, standardRef: e.target.value } : s
                                    )
                                  }
                                }))
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              SOP Title
                            </label>
                            <input
                              type="text"
                              value={activeSop.title}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  sops: {
                                    sops: prev.sops.sops.map((s) =>
                                      s.id === activeSop.id ? { ...s, title: e.target.value } : s
                                    )
                                  }
                                }))
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        {[
                          { key: 'purpose' as const, label: '1. Purpose', rows: 2 },
                          { key: 'scope' as const, label: '2. Scope', rows: 2 },
                          { key: 'responsibilities' as const, label: '3. Responsibilities', rows: 2 }
                        ].map((fld) => (
                          <div key={fld.key}>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              {fld.label}
                            </label>
                            <textarea
                              rows={fld.rows}
                              value={activeSop[fld.key]}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  sops: {
                                    sops: prev.sops.sops.map((s) =>
                                      s.id === activeSop.id
                                        ? { ...s, [fld.key]: e.target.value }
                                        : s
                                    )
                                  }
                                }))
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            />
                          </div>
                        ))}

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            4. Procedure Steps (one step per line)
                          </label>
                          <textarea
                            rows={6}
                            value={activeSop.procedureSteps.join('\n')}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                sops: {
                                  sops: prev.sops.sops.map((s) =>
                                    s.id === activeSop.id
                                      ? { ...s, procedureSteps: e.target.value.split('\n') }
                                      : s
                                  )
                                }
                              }))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            5. Controlled Records &amp; Forms Required
                          </label>
                          <input
                            type="text"
                            value={activeSop.recordsRequired}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                sops: {
                                  sops: prev.sops.sops.map((s) =>
                                    s.id === activeSop.id
                                      ? { ...s, recordsRequired: e.target.value }
                                      : s
                                  )
                                }
                              }))
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================
                  02. APPROVED SUPPLIER PROGRAM (ASP)
                  ============================================================ */}
              {activeModule === 'approved-supplier' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Policy Objective (ISO 9001 Cl. 8.4 / FSSC Cl. 7.1.6)
                      </label>
                      <textarea
                        rows={2}
                        value={payloads['approved-supplier'].policyObjective}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'approved-supplier': {
                              ...prev['approved-supplier'],
                              policyObjective: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Supplier Selection &amp; Audit Method
                      </label>
                      <textarea
                        rows={2}
                        value={payloads['approved-supplier'].selectionProcedure}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'approved-supplier': {
                              ...prev['approved-supplier'],
                              selectionProcedure: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Incoming COA &amp; Receiving Gate Rule
                      </label>
                      <textarea
                        rows={2}
                        value={payloads['approved-supplier'].incomingCoaRule}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'approved-supplier': {
                              ...prev['approved-supplier'],
                              incomingCoaRule: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Annual Re-Evaluation &amp; Delisting Criteria
                      </label>
                      <textarea
                        rows={2}
                        value={payloads['approved-supplier'].reEvaluationCriteria}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'approved-supplier': {
                              ...prev['approved-supplier'],
                              reEvaluationCriteria: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Approved Supplier Register ({payloads['approved-supplier'].suppliers.length} Vendors)
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setPayloads((prev) => ({
                          ...prev,
                          'approved-supplier': {
                            ...prev['approved-supplier'],
                            suppliers: [
                              ...prev['approved-supplier'].suppliers,
                              {
                                id: `sup-${Date.now()}`,
                                supplierName: 'New Vendor Name',
                                materialSupplied: 'Ingredient / Packaging Item',
                                riskTier: 'Medium',
                                certifications: 'ISO 22000 · Halal',
                                certExpiry: '2027-12-31',
                                auditMethod: 'Questionnaire + COA',
                                auditScorePct: 85,
                                coaParameters: 'Moisture, Micro, Heavy Metals within spec',
                                approvalStatus: 'Approved',
                                nextEvaluationDate: '2027-11-01'
                              }
                            ]
                          }
                        }))
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Supplier</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {payloads['approved-supplier'].suppliers.map((sup) => (
                      <div
                        key={sup.id}
                        className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                          <input
                            type="text"
                            value={sup.supplierName}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'approved-supplier': {
                                  ...prev['approved-supplier'],
                                  suppliers: prev['approved-supplier'].suppliers.map((x) =>
                                    x.id === sup.id ? { ...x, supplierName: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="Supplier Name"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={sup.materialSupplied}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'approved-supplier': {
                                  ...prev['approved-supplier'],
                                  suppliers: prev['approved-supplier'].suppliers.map((x) =>
                                    x.id === sup.id ? { ...x, materialSupplied: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="Material Supplied"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs"
                          />
                          <select
                            value={sup.riskTier}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'approved-supplier': {
                                  ...prev['approved-supplier'],
                                  suppliers: prev['approved-supplier'].suppliers.map((x) =>
                                    x.id === sup.id
                                      ? { ...x, riskTier: e.target.value as 'High' | 'Medium' | 'Low' }
                                      : x
                                  )
                                }
                              }))
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                          >
                            <option value="High">High Risk Tier</option>
                            <option value="Medium">Medium Risk Tier</option>
                            <option value="Low">Low Risk Tier</option>
                          </select>
                          <select
                            value={sup.approvalStatus}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'approved-supplier': {
                                  ...prev['approved-supplier'],
                                  suppliers: prev['approved-supplier'].suppliers.map((x) =>
                                    x.id === sup.id
                                      ? {
                                          ...x,
                                          approvalStatus: e.target.value as
                                            | 'Approved'
                                            | 'Conditional'
                                            | 'Suspended'
                                        }
                                      : x
                                  )
                                }
                              }))
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                          >
                            <option value="Approved">Approved</option>
                            <option value="Conditional">Conditional</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                          <input
                            type="text"
                            value={sup.certifications}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'approved-supplier': {
                                  ...prev['approved-supplier'],
                                  suppliers: prev['approved-supplier'].suppliers.map((x) =>
                                    x.id === sup.id ? { ...x, certifications: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="Certifications (FSSC/Halal)"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs"
                          />
                          <input
                            type="date"
                            value={sup.certExpiry}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'approved-supplier': {
                                  ...prev['approved-supplier'],
                                  suppliers: prev['approved-supplier'].suppliers.map((x) =>
                                    x.id === sup.id ? { ...x, certExpiry: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono"
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={sup.auditScorePct}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'approved-supplier': {
                                  ...prev['approved-supplier'],
                                  suppliers: prev['approved-supplier'].suppliers.map((x) =>
                                    x.id === sup.id
                                      ? { ...x, auditScorePct: Number(e.target.value) || 0 }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Audit Score %"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono tabular-nums"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="date"
                              value={sup.nextEvaluationDate}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'approved-supplier': {
                                    ...prev['approved-supplier'],
                                    suppliers: prev['approved-supplier'].suppliers.map((x) =>
                                      x.id === sup.id
                                        ? { ...x, nextEvaluationDate: e.target.value }
                                        : x
                                    )
                                  }
                                }))
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-mono"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'approved-supplier': {
                                    ...prev['approved-supplier'],
                                    suppliers: prev['approved-supplier'].suppliers.filter(
                                      (x) => x.id !== sup.id
                                    )
                                  }
                                }))
                              }
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                              aria-label="Remove supplier"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={sup.coaParameters}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'approved-supplier': {
                                ...prev['approved-supplier'],
                                suppliers: prev['approved-supplier'].suppliers.map((x) =>
                                  x.id === sup.id ? { ...x, coaParameters: e.target.value } : x
                                )
                              }
                            }))
                          }
                          placeholder="Incoming COA Acceptance Limits"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================
                  03. PEST MANAGEMENT PROCEDURE & STATION MAP
                  ============================================================ */}
              {activeModule === 'pest-management' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Licensed Pest Control Contractor
                      </label>
                      <input
                        type="text"
                        value={payloads['pest-management'].contractorName}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'pest-management': {
                              ...prev['pest-management'],
                              contractorName: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contractor License / Registration #
                      </label>
                      <input
                        type="text"
                        value={payloads['pest-management'].contractorLicenseNo}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'pest-management': {
                              ...prev['pest-management'],
                              contractorLicenseNo: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        IPM Procedure &amp; Structural Exclusion (ISO/TS 22002-1 Cl. 12)
                      </label>
                      <textarea
                        rows={2}
                        value={payloads['pest-management'].procedureSummary}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'pest-management': {
                              ...prev['pest-management'],
                              procedureSummary: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Zero-Toxic-Inside-Plant Chemical Rule
                      </label>
                      <textarea
                        rows={2}
                        value={payloads['pest-management'].chemicalControlRule}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'pest-management': {
                              ...prev['pest-management'],
                              chemicalControlRule: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Trend Analysis &amp; Escalation Trigger
                      </label>
                      <textarea
                        rows={2}
                        value={payloads['pest-management'].trendReviewRule}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'pest-management': {
                              ...prev['pest-management'],
                              trendReviewRule: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Pest Monitoring Station &amp; Bait Map Register
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setPayloads((prev) => ({
                          ...prev,
                          'pest-management': {
                            ...prev['pest-management'],
                            devices: [
                              ...prev['pest-management'].devices,
                              {
                                id: `pest-${Date.now()}`,
                                deviceCode: `DEV-0${prev['pest-management'].devices.length + 1}`,
                                zoneLocation: 'Packaging Dispatch Bay',
                                deviceType: 'Internal Mechanical Trap / Glue Board',
                                targetPest: 'Rodents / Crawling Insects',
                                inspectionFrequency: 'Weekly',
                                lastActivityCount: 0,
                                thresholdTrigger: '1 Capture = Immediate Investigation',
                                correctiveActionNote: 'Inspect dock doors & floor drains'
                              }
                            ]
                          }
                        }))
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Station</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {payloads['pest-management'].devices.map((dev) => (
                      <div
                        key={dev.id}
                        className="border border-slate-200 rounded-xl p-3 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center"
                      >
                        <input
                          type="text"
                          value={dev.deviceCode}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'pest-management': {
                                ...prev['pest-management'],
                                devices: prev['pest-management'].devices.map((x) =>
                                  x.id === dev.id ? { ...x, deviceCode: e.target.value } : x
                                )
                              }
                            }))
                          }
                          className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-mono font-semibold"
                        />
                        <input
                          type="text"
                          value={dev.zoneLocation}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'pest-management': {
                                ...prev['pest-management'],
                                devices: prev['pest-management'].devices.map((x) =>
                                  x.id === dev.id ? { ...x, zoneLocation: e.target.value } : x
                                )
                              }
                            }))
                          }
                          className="sm:col-span-2 px-2 py-1.5 rounded bg-white border border-slate-300 text-xs"
                        />
                        <input
                          type="text"
                          value={dev.deviceType}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'pest-management': {
                                ...prev['pest-management'],
                                devices: prev['pest-management'].devices.map((x) =>
                                  x.id === dev.id
                                    ? {
                                        ...x,
                                        deviceType: e.target.value as typeof dev.deviceType
                                      }
                                    : x
                                )
                              }
                            }))
                          }
                          className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs"
                        />
                        <input
                          type="number"
                          min={0}
                          value={dev.lastActivityCount}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'pest-management': {
                                ...prev['pest-management'],
                                devices: prev['pest-management'].devices.map((x) =>
                                  x.id === dev.id
                                    ? { ...x, lastActivityCount: Number(e.target.value) || 0 }
                                    : x
                                )
                              }
                            }))
                          }
                          title="Last Catch Count"
                          className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-mono tabular-nums"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={dev.inspectionFrequency}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'pest-management': {
                                  ...prev['pest-management'],
                                  devices: prev['pest-management'].devices.map((x) =>
                                    x.id === dev.id
                                      ? { ...x, inspectionFrequency: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            className="w-full px-2 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPayloads((prev) => ({
                                ...prev,
                                'pest-management': {
                                  ...prev['pest-management'],
                                  devices: prev['pest-management'].devices.filter(
                                    (x) => x.id !== dev.id
                                  )
                                }
                              }))
                            }
                            className="p-1 text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================
                  04. ASSEMBLE HACCP TEAM (CODEX STEP 1)
                  ============================================================ */}
              {activeModule === 'haccp-team' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Food Safety Team Charter &amp; Authority Statement (ISO 22000 Cl. 5.3.2)
                      </label>
                      <textarea
                        rows={2}
                        value={payloads['haccp-team'].teamCharterStatement}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'haccp-team': {
                              ...prev['haccp-team'],
                              teamCharterStatement: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Meeting &amp; Review Cadence
                      </label>
                      <input
                        type="text"
                        value={payloads['haccp-team'].meetingFrequency}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'haccp-team': {
                              ...prev['haccp-team'],
                              meetingFrequency: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        External Technical / Lab Support
                      </label>
                      <input
                        type="text"
                        value={payloads['haccp-team'].externalConsultants}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'haccp-team': {
                              ...prev['haccp-team'],
                              externalConsultants: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Multidisciplinary HACCP Team Members ({payloads['haccp-team'].members.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setPayloads((prev) => ({
                          ...prev,
                          'haccp-team': {
                            ...prev['haccp-team'],
                            members: [
                              ...prev['haccp-team'].members,
                              {
                                id: `tm-${Date.now()}`,
                                fullName: 'New Team Member',
                                designation: 'Sanitation / Warehouse Supervisor',
                                department: 'Operations',
                                haccpRole: 'Sanitation & PRP Lead',
                                qualificationAndExp: 'B.Sc. Food Science · 3 Yrs',
                                trainingCredentials: 'HACCP Level 3 · GMP',
                                assignedResponsibilities: 'PRP execution and daily inspection log review.'
                              }
                            ]
                          }
                        }))
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Team Member</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {payloads['haccp-team'].members.map((m) => (
                      <div
                        key={m.id}
                        className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            value={m.fullName}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'haccp-team': {
                                  ...prev['haccp-team'],
                                  members: prev['haccp-team'].members.map((x) =>
                                    x.id === m.id ? { ...x, fullName: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="Full Name"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={m.designation}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'haccp-team': {
                                  ...prev['haccp-team'],
                                  members: prev['haccp-team'].members.map((x) =>
                                    x.id === m.id ? { ...x, designation: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="Designation"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <input
                            type="text"
                            value={m.haccpRole}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'haccp-team': {
                                  ...prev['haccp-team'],
                                  members: prev['haccp-team'].members.map((x) =>
                                    x.id === m.id
                                      ? { ...x, haccpRole: e.target.value as typeof m.haccpRole }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="HACCP Role"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold text-[#1673B8]"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={m.trainingCredentials}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'haccp-team': {
                                    ...prev['haccp-team'],
                                    members: prev['haccp-team'].members.map((x) =>
                                      x.id === m.id
                                        ? { ...x, trainingCredentials: e.target.value }
                                        : x
                                    )
                                  }
                                }))
                              }
                              placeholder="HACCP/ISO Training"
                              className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'haccp-team': {
                                    ...prev['haccp-team'],
                                    members: prev['haccp-team'].members.filter(
                                      (x) => x.id !== m.id
                                    )
                                  }
                                }))
                              }
                              className="p-1 text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={m.qualificationAndExp}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'haccp-team': {
                                  ...prev['haccp-team'],
                                  members: prev['haccp-team'].members.map((x) =>
                                    x.id === m.id
                                      ? { ...x, qualificationAndExp: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Academic Qualification & Experience"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <input
                            type="text"
                            value={m.assignedResponsibilities}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'haccp-team': {
                                  ...prev['haccp-team'],
                                  members: prev['haccp-team'].members.map((x) =>
                                    x.id === m.id
                                      ? { ...x, assignedResponsibilities: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Assigned HACCP Responsibilities"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================
                  05. PRODUCT DESCRIPTION & INTENDED USE (CODEX STEPS 2-3)
                  ============================================================ */}
              {activeModule === 'product-description' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {payloads['product-description'].products.map((prod) => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => setSelectedProductId(prod.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            activeProduct?.id === prod.id
                              ? 'bg-[#1673B8] text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {prod.productCode} · {prod.productName.slice(0, 26)}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      {payloads['product-description'].products.length > 1 && activeProduct && (
                        <button
                          type="button"
                          onClick={() => {
                            const remaining = payloads['product-description'].products.filter(
                              (p) => p.id !== activeProduct.id
                            );
                            setPayloads((prev) => ({
                              ...prev,
                              'product-description': { products: remaining }
                            }));
                            if (remaining[0]) setSelectedProductId(remaining[0].id);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete SKU</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `prod-${Date.now()}`;
                          const nextNum = payloads['product-description'].products.length + 1;
                          setPayloads((prev) => ({
                            ...prev,
                            'product-description': {
                              products: [
                                ...prev['product-description'].products,
                                {
                                  ...prev['product-description'].products[0],
                                  id: newId,
                                  productCode: `SKU-0${nextNum}`,
                                  productName: `Product Line ${nextNum}`
                                }
                              ]
                            }
                          }));
                          setSelectedProductId(newId);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Product SKU</span>
                      </button>
                    </div>
                  </div>

                  {activeProduct && (
                    <div className="border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-white">
                      {[
                        { key: 'productCode' as const, label: 'SKU / Product Code' },
                        { key: 'productName' as const, label: 'Product Name' },
                        { key: 'productCategory' as const, label: 'Food Category' },
                        { key: 'intrinsicCharacteristics' as const, label: 'Intrinsic Hurdles (pH, aw, Brix, Preservatives)' },
                        { key: 'rawMaterialsAndIngredients' as const, label: 'Composition & Raw Materials', area: true },
                        { key: 'processingMethod' as const, label: 'Processing & Preservation Method', area: true },
                        { key: 'packagingMaterial' as const, label: 'Packaging Type & Food-Contact Spec' },
                        { key: 'shelfLifeAndStorage' as const, label: 'Shelf-Life & Storage Temperature' },
                        { key: 'distributionMethod' as const, label: 'Distribution & Cold-Chain Controls' },
                        { key: 'intendedUse' as const, label: 'Intended Use (Step 3)' },
                        { key: 'targetConsumerGroup' as const, label: 'Target Consumer Groups' },
                        { key: 'vulnerableGroupsWarning' as const, label: 'Vulnerable Population Assessment' },
                        { key: 'allergenDeclaration' as const, label: 'Allergens Present & Label Declaration' },
                        { key: 'labelingAndRegulatoryStandard' as const, label: 'Statutory Standard (PFA/PSQCA/Codex)' },
                        { key: 'expectedMishandling' as const, label: 'Reasonably Expected Mishandling & Mitigation', area: true }
                      ].map((field) => (
                        <div key={field.key} className={field.area ? 'md:col-span-2' : ''}>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            {field.label}
                          </label>
                          {field.area ? (
                            <textarea
                              rows={2}
                              value={activeProduct[field.key]}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'product-description': {
                                    products: prev['product-description'].products.map((p) =>
                                      p.id === activeProduct.id
                                        ? { ...p, [field.key]: e.target.value }
                                        : p
                                    )
                                  }
                                }))
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            />
                          ) : (
                            <input
                              type="text"
                              value={activeProduct[field.key]}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'product-description': {
                                    products: prev['product-description'].products.map((p) =>
                                      p.id === activeProduct.id
                                        ? { ...p, [field.key]: e.target.value }
                                        : p
                                    )
                                  }
                                }))
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================
                  06. PROCESS FLOW DIAGRAM & ON-SITE VERIFICATION (STEPS 4-5)
                  ============================================================ */}
              {activeModule === 'flow-diagram' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Process Flow Title
                      </label>
                      <input
                        type="text"
                        value={payloads['flow-diagram'].processTitle}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'flow-diagram': {
                              ...prev['flow-diagram'],
                              processTitle: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Boundary Scope (Inputs to Dispatch)
                      </label>
                      <input
                        type="text"
                        value={payloads['flow-diagram'].scopeBoundary}
                        onChange={(e) =>
                          setPayloads((prev) => ({
                            ...prev,
                            'flow-diagram': {
                              ...prev['flow-diagram'],
                              scopeBoundary: e.target.value
                            }
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  {/* Live Visual Flowchart + Editable Steps */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-5 border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                      <div className="text-xs font-bold text-slate-900 mb-2">
                        Live Visual Process Flowchart (Rendered into PDF)
                      </div>
                      <div className="flex flex-col items-center space-y-1.5">
                        {payloads['flow-diagram'].steps.map((step, idx) => (
                          <React.Fragment key={step.id}>
                            <div
                              className={`w-full p-2.5 rounded-lg border text-left ${
                                step.controlClassification === 'CCP'
                                  ? 'bg-rose-50 border-rose-300'
                                  : step.controlClassification === 'OPRP'
                                  ? 'bg-amber-50 border-amber-300'
                                  : 'bg-white border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                                <span className="font-mono tabular-nums text-slate-700">
                                  Step {step.stepNumber} · {step.stepCategory}
                                </span>
                                <span
                                  className={
                                    step.controlClassification === 'CCP'
                                      ? 'text-rose-700'
                                      : step.controlClassification === 'OPRP'
                                      ? 'text-amber-700'
                                      : 'text-[#1673B8]'
                                  }
                                >
                                  {step.controlClassification}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-slate-900 mt-0.5">
                                {step.stepName}
                              </div>
                              <div className="text-[11px] text-slate-600 mt-0.5">
                                {step.equipmentAndParams}
                              </div>
                            </div>
                            {idx < payloads['flow-diagram'].steps.length - 1 && (
                              <ArrowDown className="w-4 h-4 text-slate-500" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">
                          Edit Process Steps ({payloads['flow-diagram'].steps.length})
                        </h3>
                        <button
                          type="button"
                          onClick={() =>
                            setPayloads((prev) => {
                              const nextNum = prev['flow-diagram'].steps.length + 1;
                              return {
                                ...prev,
                                'flow-diagram': {
                                  ...prev['flow-diagram'],
                                  steps: [
                                    ...prev['flow-diagram'].steps,
                                    {
                                      id: `step-${Date.now()}`,
                                      stepNumber: nextNum,
                                      stepName: `Process Step ${nextNum}`,
                                      stepCategory: 'Preparation',
                                      inputsAndIngredients: 'WIP stream',
                                      wastesAndRework: 'None',
                                      equipmentAndParams: 'Standard parameters',
                                      controlClassification: 'PRP'
                                    }
                                  ]
                                }
                              };
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Process Step</span>
                        </button>
                      </div>

                      {payloads['flow-diagram'].steps.map((step, idx) => (
                        <div
                          key={step.id}
                          className="border border-slate-200 rounded-xl p-3 bg-white space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold text-[#1673B8]">
                              Step {step.stepNumber}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() =>
                                  setPayloads((prev) => {
                                    const arr = [...prev['flow-diagram'].steps];
                                    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                                    return {
                                      ...prev,
                                      'flow-diagram': {
                                        ...prev['flow-diagram'],
                                        steps: arr.map((s, i) => ({ ...s, stepNumber: i + 1 }))
                                      }
                                    };
                                  })
                                }
                                className="p-1 border border-slate-200 rounded disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === payloads['flow-diagram'].steps.length - 1}
                                onClick={() =>
                                  setPayloads((prev) => {
                                    const arr = [...prev['flow-diagram'].steps];
                                    [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                                    return {
                                      ...prev,
                                      'flow-diagram': {
                                        ...prev['flow-diagram'],
                                        steps: arr.map((s, i) => ({ ...s, stepNumber: i + 1 }))
                                      }
                                    };
                                  })
                                }
                                className="p-1 border border-slate-200 rounded disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'flow-diagram': {
                                      ...prev['flow-diagram'],
                                      steps: prev['flow-diagram'].steps
                                        .filter((s) => s.id !== step.id)
                                        .map((s, i) => ({ ...s, stepNumber: i + 1 }))
                                    }
                                  }))
                                }
                                className="p-1 text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={step.stepName}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'flow-diagram': {
                                    ...prev['flow-diagram'],
                                    steps: prev['flow-diagram'].steps.map((x) =>
                                      x.id === step.id ? { ...x, stepName: e.target.value } : x
                                    )
                                  }
                                }))
                              }
                              className="px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                            />
                            <select
                              value={step.stepCategory}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'flow-diagram': {
                                    ...prev['flow-diagram'],
                                    steps: prev['flow-diagram'].steps.map((x) =>
                                      x.id === step.id
                                        ? {
                                            ...x,
                                            stepCategory: e.target.value as QaFlowStepCategory
                                          }
                                        : x
                                    )
                                  }
                                }))
                              }
                              className="px-2 py-1.5 rounded border border-slate-300 text-xs"
                            >
                              {[
                                'Receiving',
                                'Storage',
                                'Preparation',
                                'Processing / Kill Step',
                                'Inspection / CCP',
                                'Packaging',
                                'Dispatch'
                              ].map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                            <select
                              value={step.controlClassification}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'flow-diagram': {
                                    ...prev['flow-diagram'],
                                    steps: prev['flow-diagram'].steps.map((x) =>
                                      x.id === step.id
                                        ? {
                                            ...x,
                                            controlClassification: e.target.value as
                                              | 'PRP'
                                              | 'OPRP'
                                              | 'CCP'
                                          }
                                        : x
                                    )
                                  }
                                }))
                              }
                              className="px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                            >
                              <option value="PRP">PRP</option>
                              <option value="OPRP">OPRP</option>
                              <option value="CCP">CCP</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={step.equipmentAndParams}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'flow-diagram': {
                                    ...prev['flow-diagram'],
                                    steps: prev['flow-diagram'].steps.map((x) =>
                                      x.id === step.id
                                        ? { ...x, equipmentAndParams: e.target.value }
                                        : x
                                    )
                                  }
                                }))
                              }
                              placeholder="Equipment & Process Params"
                              className="px-2 py-1.5 rounded border border-slate-300 text-xs"
                            />
                            <input
                              type="text"
                              value={step.wastesAndRework}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'flow-diagram': {
                                    ...prev['flow-diagram'],
                                    steps: prev['flow-diagram'].steps.map((x) =>
                                      x.id === step.id
                                        ? { ...x, wastesAndRework: e.target.value }
                                        : x
                                    )
                                  }
                                }))
                              }
                              placeholder="Wastes / Rework Control"
                              className="px-2 py-1.5 rounded border border-slate-300 text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 5: On-Site Verification of Flow Diagram */}
                  <div className="border-t border-slate-200 pt-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        Codex Step 5: On-Site Verification of Flow Diagram Log
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          setPayloads((prev) => ({
                            ...prev,
                            'flow-diagram': {
                              ...prev['flow-diagram'],
                              verifications: [
                                ...prev['flow-diagram'].verifications,
                                {
                                  id: `fv-${Date.now()}`,
                                  verificationDate: new Date().toISOString().slice(0, 10),
                                  lineAndShift: 'Line 02 — Afternoon Shift',
                                  checkedDuringLiveRun: 'Yes',
                                  deviationsObserved: 'No pipeline deviations observed.',
                                  diagramCorrectionsMade: 'None required.',
                                  verifiedBy: company.preparedBy,
                                  fstlApproval: `Approved — ${company.preparedBy}`
                                }
                              ]
                            }
                          }))
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Walk-Through Verification</span>
                      </button>
                    </div>
                    {payloads['flow-diagram'].verifications.map((ver) => (
                      <div
                        key={ver.id}
                        className="border border-slate-200 rounded-xl p-3 bg-slate-50 grid grid-cols-1 sm:grid-cols-3 gap-2"
                      >
                        <input
                          type="date"
                          value={ver.verificationDate}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'flow-diagram': {
                                ...prev['flow-diagram'],
                                verifications: prev['flow-diagram'].verifications.map((x) =>
                                  x.id === ver.id
                                    ? { ...x, verificationDate: e.target.value }
                                    : x
                                )
                              }
                            }))
                          }
                          className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-mono"
                        />
                        <input
                          type="text"
                          value={ver.lineAndShift}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'flow-diagram': {
                                ...prev['flow-diagram'],
                                verifications: prev['flow-diagram'].verifications.map((x) =>
                                  x.id === ver.id ? { ...x, lineAndShift: e.target.value } : x
                                )
                              }
                            }))
                          }
                          placeholder="Line & Shift"
                          className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                        />
                        <input
                          type="text"
                          value={ver.verifiedBy}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'flow-diagram': {
                                ...prev['flow-diagram'],
                                verifications: prev['flow-diagram'].verifications.map((x) =>
                                  x.id === ver.id ? { ...x, verifiedBy: e.target.value } : x
                                )
                              }
                            }))
                          }
                          placeholder="Verified By"
                          className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                        />
                        <input
                          type="text"
                          value={ver.deviationsObserved}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'flow-diagram': {
                                ...prev['flow-diagram'],
                                verifications: prev['flow-diagram'].verifications.map((x) =>
                                  x.id === ver.id
                                    ? { ...x, deviationsObserved: e.target.value }
                                    : x
                                )
                              }
                            }))
                          }
                          placeholder="Deviations Observed"
                          className="sm:col-span-2 px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                        />
                        <input
                          type="text"
                          value={ver.diagramCorrectionsMade}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'flow-diagram': {
                                ...prev['flow-diagram'],
                                verifications: prev['flow-diagram'].verifications.map((x) =>
                                  x.id === ver.id
                                    ? { ...x, diagramCorrectionsMade: e.target.value }
                                    : x
                                )
                              }
                            }))
                          }
                          placeholder="Corrections Applied"
                          className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================
                  07. HAZARD ANALYSIS OF PRODUCTS & PROCESS (CODEX STEP 6)
                  ============================================================ */}
              {activeModule === 'hazard-analysis' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-slate-600 max-w-2xl">
                      {payloads['hazard-analysis'].methodologyNote}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setPayloads((prev) => ({
                          ...prev,
                          'hazard-analysis': {
                            ...prev['hazard-analysis'],
                            rows: [
                              ...prev['hazard-analysis'].rows,
                              {
                                id: `ha-${Date.now()}`,
                                stepOrMaterial: 'Step / Raw Material',
                                hazardCategory: 'Biological',
                                hazardDescription: 'Specific hazard description',
                                causeOrSource: 'Source or process failure cause',
                                likelihood: 3,
                                severity: 4,
                                justification: 'Risk score justification',
                                controlMeasures: 'Control measure (PRP/OPRP/CCP)',
                                appliedProgram: 'OPRP'
                              }
                            ]
                          }
                        }))
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Hazard Row</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {payloads['hazard-analysis'].rows.map((row) => {
                      const score = row.likelihood * row.severity;
                      const isSig =
                        score >= payloads['hazard-analysis'].significanceThreshold ||
                        row.severity >= 4;
                      const band = getRiskBand(score);
                      return (
                        <div
                          key={row.id}
                          className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2.5"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                            <input
                              type="text"
                              value={row.stepOrMaterial}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'hazard-analysis': {
                                    ...prev['hazard-analysis'],
                                    rows: prev['hazard-analysis'].rows.map((x) =>
                                      x.id === row.id
                                        ? { ...x, stepOrMaterial: e.target.value }
                                        : x
                                    )
                                  }
                                }))
                              }
                              className="sm:col-span-2 px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                            />
                            <select
                              value={row.hazardCategory}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'hazard-analysis': {
                                    ...prev['hazard-analysis'],
                                    rows: prev['hazard-analysis'].rows.map((x) =>
                                      x.id === row.id
                                        ? {
                                            ...x,
                                            hazardCategory: e.target.value as QaHazardCategory
                                          }
                                        : x
                                    )
                                  }
                                }))
                              }
                              className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                            >
                              {['Biological', 'Chemical', 'Physical', 'Allergen', 'Radiological'].map(
                                (cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                )
                              )}
                            </select>
                            <select
                              value={row.likelihood}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'hazard-analysis': {
                                    ...prev['hazard-analysis'],
                                    rows: prev['hazard-analysis'].rows.map((x) =>
                                      x.id === row.id
                                        ? {
                                            ...x,
                                            likelihood: Number(e.target.value) as 1 | 2 | 3 | 4 | 5
                                          }
                                        : x
                                    )
                                  }
                                }))
                              }
                              className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-mono"
                            >
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                  Likelihood: {n}
                                </option>
                              ))}
                            </select>
                            <select
                              value={row.severity}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'hazard-analysis': {
                                    ...prev['hazard-analysis'],
                                    rows: prev['hazard-analysis'].rows.map((x) =>
                                      x.id === row.id
                                        ? {
                                            ...x,
                                            severity: Number(e.target.value) as 1 | 2 | 3 | 4 | 5
                                          }
                                        : x
                                    )
                                  }
                                }))
                              }
                              className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-mono"
                            >
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                  Severity: {n}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`px-2 py-1 rounded border text-[11px] font-mono tabular-nums font-bold ${band.cls}`}
                              >
                                {score} ({isSig ? 'Significant' : 'Low'})
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'hazard-analysis': {
                                      ...prev['hazard-analysis'],
                                      rows: prev['hazard-analysis'].rows.filter(
                                        (x) => x.id !== row.id
                                      )
                                    }
                                  }))
                                }
                                className="p-1 text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={row.hazardDescription}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'hazard-analysis': {
                                    ...prev['hazard-analysis'],
                                    rows: prev['hazard-analysis'].rows.map((x) =>
                                      x.id === row.id
                                        ? { ...x, hazardDescription: e.target.value }
                                        : x
                                    )
                                  }
                                }))
                              }
                              placeholder="Hazard Description"
                              className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                            />
                            <input
                              type="text"
                              value={row.controlMeasures}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'hazard-analysis': {
                                    ...prev['hazard-analysis'],
                                    rows: prev['hazard-analysis'].rows.map((x) =>
                                      x.id === row.id
                                        ? { ...x, controlMeasures: e.target.value }
                                        : x
                                    )
                                  }
                                }))
                              }
                              placeholder="Control Measures"
                              className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                            />
                            <select
                              value={row.appliedProgram}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'hazard-analysis': {
                                    ...prev['hazard-analysis'],
                                    rows: prev['hazard-analysis'].rows.map((x) =>
                                      x.id === row.id
                                        ? {
                                            ...x,
                                            appliedProgram: e.target.value as 'PRP' | 'OPRP' | 'CCP'
                                          }
                                        : x
                                    )
                                  }
                                }))
                              }
                              className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                            >
                              <option value="PRP">Program: PRP</option>
                              <option value="OPRP">Program: OPRP</option>
                              <option value="CCP">Program: CCP</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================
                  08. CCP DETERMINATION DECISION TREE (CODEX STEP 7)
                  ============================================================ */}
              {activeModule === 'ccp-determination' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-slate-600">
                      Answer Q1–Q4 per Codex CXC 1-1969; classification (`CCP`, `OPRP`, or `PRP`) updates automatically.
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPayloads((prev) => ({
                          ...prev,
                          'ccp-determination': {
                            ...prev['ccp-determination'],
                            rows: [
                              ...prev['ccp-determination'].rows,
                              {
                                id: `ccp-dt-${Date.now()}`,
                                stepName: 'New Process Step',
                                significantHazard: 'Identified Significant Hazard',
                                q1ControlMeasureExists: 'Yes',
                                q2DesignedToEliminate: 'Yes',
                                q3ContaminationCouldIncrease: 'No',
                                q4SubsequentStepEliminates: 'No',
                                classification: 'CCP',
                                ccpNumber: `CCP-${prev['ccp-determination'].rows.length + 1}`,
                                decisionRationale: 'Q2 = Yes: Step engineered to eliminate hazard.'
                              }
                            ]
                          }
                        }))
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Evaluate New Step</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {payloads['ccp-determination'].rows.map((row) => (
                      <div
                        key={row.id}
                        className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={row.stepName}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'ccp-determination': {
                                  ...prev['ccp-determination'],
                                  rows: prev['ccp-determination'].rows.map((x) =>
                                    x.id === row.id ? { ...x, stepName: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={row.significantHazard}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'ccp-determination': {
                                  ...prev['ccp-determination'],
                                  rows: prev['ccp-determination'].rows.map((x) =>
                                    x.id === row.id
                                      ? { ...x, significantHazard: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={row.ccpNumber}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'ccp-determination': {
                                    ...prev['ccp-determination'],
                                    rows: prev['ccp-determination'].rows.map((x) =>
                                      x.id === row.id ? { ...x, ccpNumber: e.target.value } : x
                                    )
                                  }
                                }))
                              }
                              className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-mono font-bold"
                            />
                            <span
                              className={`px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${
                                row.classification === 'CCP'
                                  ? 'bg-rose-100 text-rose-800'
                                  : row.classification === 'OPRP'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {row.classification}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'ccp-determination': {
                                    ...prev['ccp-determination'],
                                    rows: prev['ccp-determination'].rows.filter(
                                      (x) => x.id !== row.id
                                    )
                                  }
                                }))
                              }
                              className="p-1 text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(
                            [
                              { key: 'q1ControlMeasureExists', label: 'Q1: Control Exists?' },
                              { key: 'q2DesignedToEliminate', label: 'Q2: Eliminates Hazard?' },
                              { key: 'q3ContaminationCouldIncrease', label: 'Q3: Could Increase?' },
                              { key: 'q4SubsequentStepEliminates', label: 'Q4: Next Step Removes?' }
                            ] as const
                          ).map((q) => (
                            <div key={q.key}>
                              <label className="block text-[10.5px] font-semibold text-slate-600 mb-0.5">
                                {q.label}
                              </label>
                              <select
                                value={row[q.key]}
                                onChange={(e) => {
                                  const val = e.target.value as 'Yes' | 'No';
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'ccp-determination': {
                                      ...prev['ccp-determination'],
                                      rows: prev['ccp-determination'].rows.map((x) => {
                                        if (x.id !== row.id) return x;
                                        const next = { ...x, [q.key]: val };
                                        next.classification = evaluateCodexDecisionTree(
                                          next.q1ControlMeasureExists,
                                          next.q2DesignedToEliminate,
                                          next.q3ContaminationCouldIncrease,
                                          next.q4SubsequentStepEliminates
                                        );
                                        return next;
                                      })
                                    }
                                  }));
                                }}
                                className="w-full px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                              >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={row.decisionRationale}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'ccp-determination': {
                                ...prev['ccp-determination'],
                                rows: prev['ccp-determination'].rows.map((x) =>
                                  x.id === row.id
                                    ? { ...x, decisionRationale: e.target.value }
                                    : x
                                )
                              }
                            }))
                          }
                          placeholder="Codex Decision Tree Justification"
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================
                  09. DETERMINATION OF CRITICAL CONTROL LIMITS (CODEX STEP 8)
                  ============================================================ */}
              {activeModule === 'critical-limits' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Critical Limit Scientific Validation Policy
                    </label>
                    <textarea
                      rows={2}
                      value={payloads['critical-limits'].validationPolicy}
                      onChange={(e) =>
                        setPayloads((prev) => ({
                          ...prev,
                          'critical-limits': {
                            ...prev['critical-limits'],
                            validationPolicy: e.target.value
                          }
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Validated Critical Limits &amp; Operational Targets ({payloads['critical-limits'].rows.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setPayloads((prev) => ({
                          ...prev,
                          'critical-limits': {
                            ...prev['critical-limits'],
                            rows: [
                              ...prev['critical-limits'].rows,
                              {
                                id: `cl-${Date.now()}`,
                                ccpOrOprpNumber: `CCP-${prev['critical-limits'].rows.length + 1}`,
                                processStep: 'New Critical Step',
                                hazardControlled: 'Biological / Physical Hazard',
                                criticalLimit: 'Numeric threshold (e.g. >= 75°C for 15s)',
                                operationalTarget: 'Buffer limit before fail (e.g. 77°C)',
                                scientificValidationBasis: 'Codex / PFA / FDA Reference',
                                validationEvidenceRef: 'Thermal Validation Report'
                              }
                            ]
                          }
                        }))
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Critical Limit</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {payloads['critical-limits'].rows.map((cl) => (
                      <div
                        key={cl.id}
                        className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                          <input
                            type="text"
                            value={cl.ccpOrOprpNumber}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'critical-limits': {
                                  ...prev['critical-limits'],
                                  rows: prev['critical-limits'].rows.map((x) =>
                                    x.id === cl.id
                                      ? { ...x, ccpOrOprpNumber: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-mono font-bold text-[#1673B8]"
                          />
                          <input
                            type="text"
                            value={cl.processStep}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'critical-limits': {
                                  ...prev['critical-limits'],
                                  rows: prev['critical-limits'].rows.map((x) =>
                                    x.id === cl.id ? { ...x, processStep: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={cl.hazardControlled}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'critical-limits': {
                                  ...prev['critical-limits'],
                                  rows: prev['critical-limits'].rows.map((x) =>
                                    x.id === cl.id
                                      ? { ...x, hazardControlled: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            className="sm:col-span-2 px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={cl.criticalLimit}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'critical-limits': {
                                  ...prev['critical-limits'],
                                  rows: prev['critical-limits'].rows.map((x) =>
                                    x.id === cl.id ? { ...x, criticalLimit: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="Validated Critical Limit (Hard Fail)"
                            className="px-2.5 py-1.5 rounded bg-white border border-rose-200 text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={cl.operationalTarget}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'critical-limits': {
                                  ...prev['critical-limits'],
                                  rows: prev['critical-limits'].rows.map((x) =>
                                    x.id === cl.id
                                      ? { ...x, operationalTarget: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Operational Alert Target"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <input
                            type="text"
                            value={cl.scientificValidationBasis}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'critical-limits': {
                                  ...prev['critical-limits'],
                                  rows: prev['critical-limits'].rows.map((x) =>
                                    x.id === cl.id
                                      ? { ...x, scientificValidationBasis: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Scientific / Regulatory Basis"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={cl.validationEvidenceRef}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'critical-limits': {
                                    ...prev['critical-limits'],
                                    rows: prev['critical-limits'].rows.map((x) =>
                                      x.id === cl.id
                                        ? { ...x, validationEvidenceRef: e.target.value }
                                        : x
                                    )
                                  }
                                }))
                              }
                              placeholder="Validation Evidence File"
                              className="w-full px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'critical-limits': {
                                    ...prev['critical-limits'],
                                    rows: prev['critical-limits'].rows.filter(
                                      (x) => x.id !== cl.id
                                    )
                                  }
                                }))
                              }
                              className="p-1 text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================
                  10. MONITORING CHECKLISTS SUITE (CODEX STEP 9)
                  ============================================================ */}
              {activeModule === 'monitoring-checklists' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {payloads['monitoring-checklists'].checklists.map((chk) => (
                        <button
                          key={chk.id}
                          type="button"
                          onClick={() => setSelectedChecklistId(chk.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            activeChecklist?.id === chk.id
                              ? 'bg-[#1673B8] text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {chk.checklistCode} · {chk.title.slice(0, 22)}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = `chk-${Date.now()}`;
                        const nextIdx = payloads['monitoring-checklists'].checklists.length + 1;
                        setPayloads((prev) => ({
                          ...prev,
                          'monitoring-checklists': {
                            checklists: [
                              ...prev['monitoring-checklists'].checklists,
                              {
                                id: newId,
                                checklistCode: `CHK-CUSTOM-0${nextIdx}`,
                                title: 'Custom Floor Inspection Checklist',
                                standardRef: 'ISO 22000 · FSSC 22000',
                                monitoringDate: new Date().toISOString().slice(0, 10),
                                shift: 'Shift A',
                                lineOrArea: 'Packaging Hall',
                                items: [
                                  {
                                    id: `ci-${Date.now()}`,
                                    checkpointName: 'Verify line clearance & seal integrity',
                                    frequency: 'Hourly',
                                    acceptableLimit: 'Zero leaks; legible batch code',
                                    actualReading: 'Pass',
                                    status: 'Pass',
                                    operatorInitials: 'OP',
                                    remarks: 'Nominal'
                                  }
                                ]
                              }
                            ]
                          }
                        }));
                        setSelectedChecklistId(newId);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Checklist</span>
                    </button>
                  </div>

                  {activeChecklist && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          value={activeChecklist.title}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'monitoring-checklists': {
                                checklists: prev['monitoring-checklists'].checklists.map((c) =>
                                  c.id === activeChecklist.id ? { ...c, title: e.target.value } : c
                                )
                              }
                            }))
                          }
                          className="sm:col-span-2 px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                        />
                        <input
                          type="date"
                          value={activeChecklist.monitoringDate}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'monitoring-checklists': {
                                checklists: prev['monitoring-checklists'].checklists.map((c) =>
                                  c.id === activeChecklist.id
                                    ? { ...c, monitoringDate: e.target.value }
                                    : c
                                )
                              }
                            }))
                          }
                          className="px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono"
                        />
                        <input
                          type="text"
                          value={activeChecklist.lineOrArea}
                          onChange={(e) =>
                            setPayloads((prev) => ({
                              ...prev,
                              'monitoring-checklists': {
                                checklists: prev['monitoring-checklists'].checklists.map((c) =>
                                  c.id === activeChecklist.id
                                    ? { ...c, lineOrArea: e.target.value }
                                    : c
                                )
                              }
                            }))
                          }
                          placeholder="Line / Area"
                          className="px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        {activeChecklist.items.map((it) => (
                          <div
                            key={it.id}
                            className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center"
                          >
                            <input
                              type="text"
                              value={it.checkpointName}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'monitoring-checklists': {
                                    checklists: prev['monitoring-checklists'].checklists.map((c) =>
                                      c.id === activeChecklist.id
                                        ? {
                                            ...c,
                                            items: c.items.map((x) =>
                                              x.id === it.id
                                                ? { ...x, checkpointName: e.target.value }
                                                : x
                                            )
                                          }
                                        : c
                                    )
                                  }
                                }))
                              }
                              className="sm:col-span-2 px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                            />
                            <input
                              type="text"
                              value={it.acceptableLimit}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'monitoring-checklists': {
                                    checklists: prev['monitoring-checklists'].checklists.map((c) =>
                                      c.id === activeChecklist.id
                                        ? {
                                            ...c,
                                            items: c.items.map((x) =>
                                              x.id === it.id
                                                ? { ...x, acceptableLimit: e.target.value }
                                                : x
                                            )
                                          }
                                        : c
                                    )
                                  }
                                }))
                              }
                              placeholder="Limit"
                              className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs"
                            />
                            <input
                              type="text"
                              value={it.actualReading}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'monitoring-checklists': {
                                    checklists: prev['monitoring-checklists'].checklists.map((c) =>
                                      c.id === activeChecklist.id
                                        ? {
                                            ...c,
                                            items: c.items.map((x) =>
                                              x.id === it.id
                                                ? { ...x, actualReading: e.target.value }
                                                : x
                                            )
                                          }
                                        : c
                                    )
                                  }
                                }))
                              }
                              placeholder="Actual Reading"
                              className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-mono"
                            />
                            <select
                              value={it.status}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'monitoring-checklists': {
                                    checklists: prev['monitoring-checklists'].checklists.map((c) =>
                                      c.id === activeChecklist.id
                                        ? {
                                            ...c,
                                            items: c.items.map((x) =>
                                              x.id === it.id
                                                ? {
                                                    ...x,
                                                    status: e.target.value as 'Pass' | 'Fail' | 'N/A'
                                                  }
                                                : x
                                            )
                                          }
                                        : c
                                    )
                                  }
                                }))
                              }
                              className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                            >
                              <option value="Pass">Pass</option>
                              <option value="Fail">Fail</option>
                              <option value="N/A">N/A</option>
                            </select>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={it.operatorInitials}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'monitoring-checklists': {
                                      checklists: prev['monitoring-checklists'].checklists.map((c) =>
                                        c.id === activeChecklist.id
                                          ? {
                                              ...c,
                                              items: c.items.map((x) =>
                                                x.id === it.id
                                                  ? { ...x, operatorInitials: e.target.value }
                                                  : x
                                              )
                                            }
                                          : c
                                      )
                                    }
                                  }))
                                }
                                placeholder="Init."
                                className="w-full px-2 py-1.5 rounded bg-white border border-slate-300 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'monitoring-checklists': {
                                      checklists: prev['monitoring-checklists'].checklists.map((c) =>
                                        c.id === activeChecklist.id
                                          ? { ...c, items: c.items.filter((x) => x.id !== it.id) }
                                          : c
                                      )
                                    }
                                  }))
                                }
                                className="p-1 text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPayloads((prev) => ({
                            ...prev,
                            'monitoring-checklists': {
                              checklists: prev['monitoring-checklists'].checklists.map((c) =>
                                c.id === activeChecklist.id
                                  ? {
                                      ...c,
                                      items: [
                                        ...c.items,
                                        {
                                          id: `ci-${Date.now()}`,
                                          checkpointName: 'New Monitoring Parameter',
                                          frequency: 'Hourly',
                                          acceptableLimit: 'Within validated spec',
                                          actualReading: '',
                                          status: 'Pass',
                                          operatorInitials: '',
                                          remarks: ''
                                        }
                                      ]
                                    }
                                  : c
                              )
                            }
                          }))
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Checkpoint Row</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================
                  11. CORRECTIVE ACTIONS FORM (CAR / NCR)
                  ============================================================ */}
              {activeModule === 'corrective-actions' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Non-Conforming Product Hold &amp; Corrective Action Protocol
                    </label>
                    <textarea
                      rows={2}
                      value={payloads['corrective-actions'].holdAndReleaseProcedure}
                      onChange={(e) =>
                        setPayloads((prev) => ({
                          ...prev,
                          'corrective-actions': {
                            ...prev['corrective-actions'],
                            holdAndReleaseProcedure: e.target.value
                          }
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Corrective Action Request (CAR / NCR) Records ({payloads['corrective-actions'].records.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date().toISOString().slice(0, 10);
                        const num = payloads['corrective-actions'].records.length + 1;
                        setPayloads((prev) => ({
                          ...prev,
                          'corrective-actions': {
                            ...prev['corrective-actions'],
                            records: [
                              {
                                id: `car-${Date.now()}`,
                                carNumber: `CAR-2026-00${num}`,
                                dateRaised: today,
                                source: 'CCP Deviation',
                                affectedProductBatch: 'BATCH-NEW',
                                quantityHeld: '0 kg',
                                deviationDescription: 'Describe deviation from critical limit or SOP...',
                                immediateCorrection: 'Quarantined batch & tagged HOLD...',
                                productDisposition: 'Hold & Test',
                                rootCause5Why: '1. Why -> 2. Why -> Root systemic cause...',
                                correctiveActionPlan: 'Permanent engineering/SOP preventive fix...',
                                responsiblePerson: company.preparedBy,
                                targetDate: today,
                                effectivenessVerification: 'Pending verification...',
                                status: 'Open'
                              },
                              ...prev['corrective-actions'].records
                            ]
                          }
                        }));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Raise New CAR</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {payloads['corrective-actions'].records.map((car) => (
                      <div
                        key={car.id}
                        className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                          <input
                            type="text"
                            value={car.carNumber}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id ? { ...x, carNumber: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-mono font-bold text-[#1673B8]"
                          />
                          <select
                            value={car.source}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id
                                      ? { ...x, source: e.target.value as typeof car.source }
                                      : x
                                  )
                                }
                              }))
                            }
                            className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          >
                            {[
                              'CCP Deviation',
                              'OPRP Deviation',
                              'Internal Audit Finding',
                              'Customer Complaint',
                              'Supplier Non-Conformance',
                              'PRP Sanitation Fail'
                            ].map((src) => (
                              <option key={src} value={src}>
                                {src}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={car.affectedProductBatch}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id
                                      ? { ...x, affectedProductBatch: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Affected Batch"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <select
                            value={car.productDisposition}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id
                                      ? {
                                          ...x,
                                          productDisposition: e.target
                                            .value as typeof car.productDisposition
                                        }
                                      : x
                                  )
                                }
                              }))
                            }
                            className="px-2 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          >
                            <option value="Hold & Test">Hold &amp; Test</option>
                            <option value="Reprocess">Reprocess</option>
                            <option value="Reject / Destroy">Reject / Destroy</option>
                            <option value="Released After Review">Released After Review</option>
                          </select>
                          <div className="flex items-center gap-2">
                            <select
                              value={car.status}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'corrective-actions': {
                                    ...prev['corrective-actions'],
                                    records: prev['corrective-actions'].records.map((x) =>
                                      x.id === car.id
                                        ? {
                                            ...x,
                                            status: e.target.value as 'Open' | 'In Progress' | 'Closed'
                                          }
                                        : x
                                    )
                                  }
                                }))
                              }
                              className="w-full px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-bold"
                            >
                              <option value="Open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Closed">Closed</option>
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'corrective-actions': {
                                    ...prev['corrective-actions'],
                                    records: prev['corrective-actions'].records.filter(
                                      (x) => x.id !== car.id
                                    )
                                  }
                                }))
                              }
                              className="p-1 text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <textarea
                            rows={2}
                            value={car.deviationDescription}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id
                                      ? { ...x, deviationDescription: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Deviation Description"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <textarea
                            rows={2}
                            value={car.immediateCorrection}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id
                                      ? { ...x, immediateCorrection: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Immediate Correction (Containment)"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <textarea
                            rows={2}
                            value={car.rootCause5Why}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id ? { ...x, rootCause5Why: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="5-Why Root Cause Analysis"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <textarea
                            rows={2}
                            value={car.correctiveActionPlan}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id
                                      ? { ...x, correctiveActionPlan: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Corrective Action (Prevent Recurrence)"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={car.responsiblePerson}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id
                                      ? { ...x, responsiblePerson: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Responsible Owner"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <input
                            type="text"
                            value={car.targetDate}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id ? { ...x, targetDate: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="Target Date (YYYY-MM-DD)"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-mono"
                          />
                          <input
                            type="text"
                            value={car.effectivenessVerification}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'corrective-actions': {
                                  ...prev['corrective-actions'],
                                  records: prev['corrective-actions'].records.map((x) =>
                                    x.id === car.id
                                      ? { ...x, effectivenessVerification: e.target.value }
                                      : x
                                  )
                                }
                              }))
                            }
                            placeholder="Effectiveness Verification Evidence"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================
                  12. VERIFICATION & AUDIT SCHEDULE FORM (CODEX STEP 11)
                  ============================================================ */}
              {activeModule === 'verification-form' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      FSMS / HACCP Verification Objective
                    </label>
                    <textarea
                      rows={2}
                      value={payloads['verification-form'].verificationObjective}
                      onChange={(e) =>
                        setPayloads((prev) => ({
                          ...prev,
                          'verification-form': {
                            ...prev['verification-form'],
                            verificationObjective: e.target.value
                          }
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Verification Activities &amp; Audit Records ({payloads['verification-form'].rows.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date().toISOString().slice(0, 10);
                        setPayloads((prev) => ({
                          ...prev,
                          'verification-form': {
                            ...prev['verification-form'],
                            rows: [
                              ...prev['verification-form'].rows,
                              {
                                id: `ver-${Date.now()}`,
                                activityName: 'New Verification Activity',
                                standardClause: 'ISO 22000 Cl. 8.8',
                                frequency: 'Quarterly',
                                methodAndCriteria: 'Lab test / record audit criteria',
                                lastVerifiedDate: today,
                                actualFinding: 'Conforming with no non-conformities',
                                verificationStatus: 'Conforming',
                                nextDueDate: '2027-02-15',
                                verifierName: company.preparedBy
                              }
                            ]
                          }
                        }));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Verification Row</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {payloads['verification-form'].rows.map((v) => (
                      <div
                        key={v.id}
                        className="border border-slate-200 rounded-xl p-3 bg-slate-50/60 space-y-2"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                          <input
                            type="text"
                            value={v.activityName}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'verification-form': {
                                  ...prev['verification-form'],
                                  rows: prev['verification-form'].rows.map((x) =>
                                    x.id === v.id ? { ...x, activityName: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            className="sm:col-span-2 px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={v.frequency}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'verification-form': {
                                  ...prev['verification-form'],
                                  rows: prev['verification-form'].rows.map((x) =>
                                    x.id === v.id ? { ...x, frequency: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <div className="flex items-center gap-2">
                            <select
                              value={v.verificationStatus}
                              onChange={(e) =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'verification-form': {
                                    ...prev['verification-form'],
                                    rows: prev['verification-form'].rows.map((x) =>
                                      x.id === v.id
                                        ? {
                                            ...x,
                                            verificationStatus: e.target
                                              .value as typeof v.verificationStatus
                                          }
                                        : x
                                    )
                                  }
                                }))
                              }
                              className="w-full px-2 py-1.5 rounded bg-white border border-slate-300 text-xs font-semibold"
                            >
                              <option value="Conforming">Conforming</option>
                              <option value="Action Required">Action Required</option>
                              <option value="Scheduled">Scheduled</option>
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                setPayloads((prev) => ({
                                  ...prev,
                                  'verification-form': {
                                    ...prev['verification-form'],
                                    rows: prev['verification-form'].rows.filter(
                                      (x) => x.id !== v.id
                                    )
                                  }
                                }))
                              }
                              className="p-1 text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={v.methodAndCriteria}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'verification-form': {
                                  ...prev['verification-form'],
                                  rows: prev['verification-form'].rows.map((x) =>
                                    x.id === v.id ? { ...x, methodAndCriteria: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="Method & Criteria"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <input
                            type="text"
                            value={v.actualFinding}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'verification-form': {
                                  ...prev['verification-form'],
                                  rows: prev['verification-form'].rows.map((x) =>
                                    x.id === v.id ? { ...x, actualFinding: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="Actual Finding"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                          <input
                            type="text"
                            value={v.verifierName}
                            onChange={(e) =>
                              setPayloads((prev) => ({
                                ...prev,
                                'verification-form': {
                                  ...prev['verification-form'],
                                  rows: prev['verification-form'].rows.map((x) =>
                                    x.id === v.id ? { ...x, verifierName: e.target.value } : x
                                  )
                                }
                              }))
                            }
                            placeholder="Verifier Name"
                            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================
                  13. FULL RISK ASSESSMENT (ISO 9001, FSSC 22000, TACCP, VACCP)
                  ============================================================ */}
              {activeModule === 'risk-assessment' && (
                <div className="space-y-4">
                  {/* Live Risk Matrix Overview Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                      <div className="text-[11px] font-semibold text-slate-500">Total Risks Assessed</div>
                      <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                        {riskSummary.total}
                      </div>
                    </div>
                    <div className="border border-rose-200 rounded-xl p-3 bg-rose-50">
                      <div className="text-[11px] font-semibold text-rose-700">Inherent High / Critical</div>
                      <div className="text-xl font-bold font-mono tabular-nums text-rose-900 mt-0.5">
                        {riskSummary.inherent.critical + riskSummary.inherent.high}
                      </div>
                    </div>
                    <div className="border border-emerald-200 rounded-xl p-3 bg-emerald-50">
                      <div className="text-[11px] font-semibold text-emerald-700">Residual Low / Controlled</div>
                      <div className="text-xl font-bold font-mono tabular-nums text-emerald-900 mt-0.5">
                        {riskSummary.residual.low + riskSummary.residual.medium}
                      </div>
                    </div>
                    <div className="border border-amber-200 rounded-xl p-3 bg-amber-50">
                      <div className="text-[11px] font-semibold text-amber-700">Residual High / Open</div>
                      <div className="text-xl font-bold font-mono tabular-nums text-amber-900 mt-0.5">
                        {riskSummary.residual.critical + riskSummary.residual.high}
                      </div>
                    </div>
                  </div>

                  {/* Domain Filter + Add Risk */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          'All',
                          'ISO 9001 QMS (Quality & Process)',
                          'FSSC 22000 FSMS (Food Safety & Culture)',
                          'TACCP (Food Defense / Intentional Threat)',
                          'VACCP (Food Fraud / Adulteration)',
                          'Supply Chain & Regulatory'
                        ] as const
                      ).map((dom) => (
                        <button
                          key={dom}
                          type="button"
                          onClick={() => setRiskDomainFilter(dom)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                            riskDomainFilter === dom
                              ? 'bg-[#1673B8] text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {dom === 'All' ? 'All Domains' : dom.split(' (')[0]}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const num = payloads['risk-assessment'].rows.length + 1;
                        setPayloads((prev) => ({
                          ...prev,
                          'risk-assessment': {
                            ...prev['risk-assessment'],
                            rows: [
                              ...prev['risk-assessment'].rows,
                              {
                                id: `rsk-${Date.now()}`,
                                riskCode: `RSK-0${num}`,
                                domain: 'ISO 9001 QMS (Quality & Process)',
                                processOrArea: 'Process / Department',
                                riskOrOpportunity: 'Describe risk or improvement opportunity...',
                                potentialImpact: 'Impact on quality, compliance, or food safety',
                                inherentLikelihood: 3,
                                inherentSeverity: 4,
                                existingControls: 'Current SOP / PRP controls',
                                mitigationActionPlan: 'Additional mitigation actions...',
                                owner: company.preparedBy,
                                residualLikelihood: 1,
                                residualSeverity: 4,
                                targetDate: new Date().toISOString().slice(0, 10),
                                reviewStatus: 'Controlled'
                              }
                            ]
                          }
                        }));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Risk Assessment</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {payloads['risk-assessment'].rows
                      .filter((r) => riskDomainFilter === 'All' || r.domain === riskDomainFilter)
                      .map((r) => {
                        const inh = r.inherentLikelihood * r.inherentSeverity;
                        const res = r.residualLikelihood * r.residualSeverity;
                        const inhBand = getRiskBand(inh);
                        const resBand = getRiskBand(res);
                        return (
                          <div
                            key={r.id}
                            className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2.5"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                              <input
                                type="text"
                                value={r.riskCode}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'risk-assessment': {
                                      ...prev['risk-assessment'],
                                      rows: prev['risk-assessment'].rows.map((x) =>
                                        x.id === r.id ? { ...x, riskCode: e.target.value } : x
                                      )
                                    }
                                  }))
                                }
                                className="px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono font-bold text-[#1673B8]"
                              />
                              <select
                                value={r.domain}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'risk-assessment': {
                                      ...prev['risk-assessment'],
                                      rows: prev['risk-assessment'].rows.map((x) =>
                                        x.id === r.id
                                          ? { ...x, domain: e.target.value as QaRiskDomain }
                                          : x
                                      )
                                    }
                                  }))
                                }
                                className="sm:col-span-2 px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                              >
                                {[
                                  'ISO 9001 QMS (Quality & Process)',
                                  'FSSC 22000 FSMS (Food Safety & Culture)',
                                  'TACCP (Food Defense / Intentional Threat)',
                                  'VACCP (Food Fraud / Adulteration)',
                                  'Supply Chain & Regulatory'
                                ].map((dom) => (
                                  <option key={dom} value={dom}>
                                    {dom}
                                  </option>
                                ))}
                              </select>
                              <div className="flex items-center justify-between gap-2">
                                <select
                                  value={r.reviewStatus}
                                  onChange={(e) =>
                                    setPayloads((prev) => ({
                                      ...prev,
                                      'risk-assessment': {
                                        ...prev['risk-assessment'],
                                        rows: prev['risk-assessment'].rows.map((x) =>
                                          x.id === r.id
                                            ? {
                                                ...x,
                                                reviewStatus: e.target
                                                  .value as typeof r.reviewStatus
                                              }
                                            : x
                                        )
                                      }
                                    }))
                                  }
                                  className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                                >
                                  <option value="Controlled">Controlled</option>
                                  <option value="Mitigation Open">Mitigation Open</option>
                                  <option value="Escalated">Escalated</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPayloads((prev) => ({
                                      ...prev,
                                      'risk-assessment': {
                                        ...prev['risk-assessment'],
                                        rows: prev['risk-assessment'].rows.filter(
                                          (x) => x.id !== r.id
                                        )
                                      }
                                    }))
                                  }
                                  className="p-1 text-rose-600 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={r.processOrArea}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'risk-assessment': {
                                      ...prev['risk-assessment'],
                                      rows: prev['risk-assessment'].rows.map((x) =>
                                        x.id === r.id ? { ...x, processOrArea: e.target.value } : x
                                      )
                                    }
                                  }))
                                }
                                placeholder="Process / Area"
                                className="px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                              />
                              <input
                                type="text"
                                value={r.riskOrOpportunity}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'risk-assessment': {
                                      ...prev['risk-assessment'],
                                      rows: prev['risk-assessment'].rows.map((x) =>
                                        x.id === r.id
                                          ? { ...x, riskOrOpportunity: e.target.value }
                                          : x
                                      )
                                    }
                                  }))
                                }
                                placeholder="Risk / Vulnerability Description"
                                className="px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center bg-slate-50 p-2 rounded-lg">
                              <select
                                value={r.inherentLikelihood}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'risk-assessment': {
                                      ...prev['risk-assessment'],
                                      rows: prev['risk-assessment'].rows.map((x) =>
                                        x.id === r.id
                                          ? {
                                              ...x,
                                              inherentLikelihood: Number(
                                                e.target.value
                                              ) as 1 | 2 | 3 | 4 | 5
                                            }
                                          : x
                                      )
                                    }
                                  }))
                                }
                                className="px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-mono"
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <option key={n} value={n}>
                                    Inh L: {n}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={r.inherentSeverity}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'risk-assessment': {
                                      ...prev['risk-assessment'],
                                      rows: prev['risk-assessment'].rows.map((x) =>
                                        x.id === r.id
                                          ? {
                                              ...x,
                                              inherentSeverity: Number(
                                                e.target.value
                                              ) as 1 | 2 | 3 | 4 | 5
                                            }
                                          : x
                                      )
                                    }
                                  }))
                                }
                                className="px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-mono"
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <option key={n} value={n}>
                                    Inh S: {n}
                                  </option>
                                ))}
                              </select>
                              <span
                                className={`px-2 py-1 rounded border text-[11px] font-mono tabular-nums font-bold text-center ${inhBand.cls}`}
                              >
                                Inh: {inh} ({inhBand.label})
                              </span>

                              <select
                                value={r.residualLikelihood}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'risk-assessment': {
                                      ...prev['risk-assessment'],
                                      rows: prev['risk-assessment'].rows.map((x) =>
                                        x.id === r.id
                                          ? {
                                              ...x,
                                              residualLikelihood: Number(
                                                e.target.value
                                              ) as 1 | 2 | 3 | 4 | 5
                                            }
                                          : x
                                      )
                                    }
                                  }))
                                }
                                className="px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-mono"
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <option key={n} value={n}>
                                    Res L: {n}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={r.residualSeverity}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'risk-assessment': {
                                      ...prev['risk-assessment'],
                                      rows: prev['risk-assessment'].rows.map((x) =>
                                        x.id === r.id
                                          ? {
                                              ...x,
                                              residualSeverity: Number(
                                                e.target.value
                                              ) as 1 | 2 | 3 | 4 | 5
                                            }
                                          : x
                                      )
                                    }
                                  }))
                                }
                                className="px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-mono"
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <option key={n} value={n}>
                                    Res S: {n}
                                  </option>
                                ))}
                              </select>
                              <span
                                className={`px-2 py-1 rounded border text-[11px] font-mono tabular-nums font-bold text-center ${resBand.cls}`}
                              >
                                Res: {res} ({resBand.label})
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={r.mitigationActionPlan}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'risk-assessment': {
                                      ...prev['risk-assessment'],
                                      rows: prev['risk-assessment'].rows.map((x) =>
                                        x.id === r.id
                                          ? { ...x, mitigationActionPlan: e.target.value }
                                          : x
                                      )
                                    }
                                  }))
                                }
                                placeholder="Mitigation Action Plan"
                                className="px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                              />
                              <input
                                type="text"
                                value={r.owner}
                                onChange={(e) =>
                                  setPayloads((prev) => ({
                                    ...prev,
                                    'risk-assessment': {
                                      ...prev['risk-assessment'],
                                      rows: prev['risk-assessment'].rows.map((x) =>
                                        x.id === r.id ? { ...x, owner: e.target.value } : x
                                      )
                                    }
                                  }))
                                }
                                placeholder="Risk Owner"
                                className="px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* ============================================================
                  14. CLASSIC QUICK PRINT FORMS LIBRARY
                  ============================================================ */}
              {activeModule === 'classic-templates' && (
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <h2 className="text-lg font-bold text-slate-900">
                      Quick Print Audit Worksheets (Auto-Branded for {company.companyName})
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      One-click floor clipboards for HACCP, SSOP Pre-Op, Allergen Changeover, FSSC v7 Audit, COA Logs, and PFA Inspection Readiness.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'All',
                      'HACCP & Food Safety',
                      'Sanitation & PRP',
                      'Supplier & Audit',
                      'Regulatory Inspection'
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setClassicCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          classicCategory === cat
                            ? 'bg-[#1673B8] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 space-y-2">
                      {QA_QC_TEMPLATES_VAULT.filter(
                        (d) => classicCategory === 'All' || d.category === classicCategory
                      ).map((docItem) => (
                        <button
                          key={docItem.id}
                          type="button"
                          onClick={() => setSelectedClassicDoc(docItem)}
                          className={`w-full text-left p-3 rounded-xl border cursor-pointer space-y-0.5 ${
                            selectedClassicDoc.id === docItem.id
                              ? 'bg-sky-50 border-[#1673B8]'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-[11px] font-mono font-semibold text-[#1673B8]">
                            {docItem.code} · {docItem.revision}
                          </div>
                          <div className="text-xs font-bold text-slate-900">{docItem.title}</div>
                          <div className="text-[11px] text-slate-500">{docItem.standardBadge}</div>
                        </button>
                      ))}
                    </div>

                    <div className="md:col-span-8 border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-mono font-semibold text-[#1673B8]">
                            {selectedClassicDoc.code} · {selectedClassicDoc.standardBadge}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {selectedClassicDoc.title}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleClassicPdf(selectedClassicDoc)}
                            className="px-3.5 py-2 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            {isUnlocked ? (
                              <Download className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                            <span>{isUnlocked ? 'Download PDF' : 'Unlock PDF'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!isUnlocked) {
                                onOpenPremiumModal();
                                return;
                              }
                              downloadQaModuleCsv(
                                company,
                                selectedClassicDoc.code,
                                selectedClassicDoc.title,
                                selectedClassicDoc.columns,
                                selectedClassicDoc.sampleRows
                              );
                            }}
                            className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            {isUnlocked ? (
                              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                            <span>CSV</span>
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead>
                            <tr className="bg-slate-900 text-white">
                              {selectedClassicDoc.columns.map((c) => (
                                <th key={c} className="p-2 font-semibold border-r border-white/15 last:border-0">
                                  {c}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {(isUnlocked
                              ? selectedClassicDoc.sampleRows
                              : selectedClassicDoc.sampleRows.slice(0, 1)
                            ).map((row, idx) => (
                              <tr key={idx}>
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="p-2 text-slate-800 border-r border-slate-200 last:border-0 align-top"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
