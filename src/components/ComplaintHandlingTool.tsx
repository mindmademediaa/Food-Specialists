import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Crown,
  Download,
  ExternalLink,
  FileText,
  Filter,
  FolderOpen,
  Loader2,
  Lock,
  Plus,
  QrCode,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { compressImageFile } from '../lib/storage';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import {
  generateQrCodeMatrix,
  resolveOfficialVerificationBaseUrl
} from '../utils/certificatePdfGenerator';
import {
  DEFAULT_COMPLAINT_CATEGORIES,
  ROOT_CAUSE_CATEGORIES,
  downloadFullComplaintDirectoryPdf,
  downloadQrPosterPng,
  downloadSingleComplaintCapaPdf
} from '../lib/complaintPdfGenerator';
import { PublicComplaintIntakeView } from './PublicComplaintIntakeView';
import {
  ComplaintOrganizationProfile,
  ComplaintSeverity,
  ComplaintStatus,
  HubUser,
  OrganizationComplaintRecord,
  OrganizationSectorType
} from '../types/hub';

interface ComplaintHandlingToolProps {
  user: HubUser;
  isUserPaid: boolean;
  hasExpiredPremium: boolean;
  onOpenPremiumModal: () => void;
  onRequireSignIn?: () => void;
}

const SECTOR_OPTIONS: OrganizationSectorType[] = [
  'Restaurant / Cafe',
  'Food Processing / Factory',
  'Bakery & Confectionery',
  'Dairy & Beverages',
  'Catering / Cloud Kitchen',
  'Hotel & Hospitality',
  'Retail / Supermarket',
  'Cold Storage / Logistics',
  'Other Food Business'
];

const GUEST_STORAGE_KEY = 'fsp_guest_complaint_sandbox_v1';

interface GuestSandboxState {
  org: ComplaintOrganizationProfile | null;
  complaints: OrganizationComplaintRecord[];
}

function loadGuestSandbox(): GuestSandboxState {
  if (typeof window === 'undefined') return { org: null, complaints: [] };
  try {
    const raw = window.localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return { org: null, complaints: [] };
    const parsed = JSON.parse(raw) as GuestSandboxState;
    return {
      org: parsed?.org || null,
      complaints: Array.isArray(parsed?.complaints) ? parsed.complaints : []
    };
  } catch {
    return { org: null, complaints: [] };
  }
}

function saveGuestSandbox(state: GuestSandboxState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors
  }
}

function formatShortDate(iso?: string): string {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function StatusBadge({ status }: { status: ComplaintStatus }) {
  if (status === 'closed') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold whitespace-nowrap">
        <CheckCircle2 className="w-3 h-3 shrink-0" />
        <span>Closed</span>
      </span>
    );
  }
  if (status === 'in_progress') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-[#1673B8] text-[11px] font-bold whitespace-nowrap">
        <ClipboardCheck className="w-3 h-3 shrink-0" />
        <span>In Progress</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold whitespace-nowrap">
      <AlertTriangle className="w-3 h-3 shrink-0" />
      <span>Open</span>
    </span>
  );
}

function SeverityBadge({ severity }: { severity: ComplaintSeverity }) {
  const styles: Record<ComplaintSeverity, string> = {
    low: 'bg-slate-100 text-slate-700 border-slate-200',
    medium: 'bg-amber-50 text-amber-800 border-amber-200',
    high: 'bg-orange-50 text-orange-800 border-orange-200',
    critical: 'bg-red-600 text-white border-red-600'
  };
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10.5px] font-bold whitespace-nowrap ${styles[severity] || styles.medium}`}
    >
      {label}
    </span>
  );
}

function sanitizeComplaintOrgForFirestore(
  org: ComplaintOrganizationProfile
): ComplaintOrganizationProfile {
  const payload: ComplaintOrganizationProfile = {
    orgId: org.orgId,
    ownerUid: org.ownerUid,
    companyName: org.companyName.trim().slice(0, 160),
    organizationType: org.organizationType.trim().slice(0, 100) || 'Other Food Business',
    isActive: Boolean(org.isActive),
    createdAt: org.createdAt,
    updatedAt: org.updatedAt
  };
  if (org.logoUrl && org.logoUrl.trim()) {
    payload.logoUrl = org.logoUrl.slice(0, 450000);
  }
  if (org.branchLocation && org.branchLocation.trim()) {
    payload.branchLocation = org.branchLocation.trim().slice(0, 240);
  }
  if (org.contactPhone && org.contactPhone.trim()) {
    payload.contactPhone = org.contactPhone.trim().slice(0, 60);
  }
  if (org.contactEmail && org.contactEmail.trim()) {
    payload.contactEmail = org.contactEmail.trim().slice(0, 200);
  }
  if (org.welcomeNote && org.welcomeNote.trim()) {
    payload.welcomeNote = org.welcomeNote.trim().slice(0, 600);
  }
  if (Array.isArray(org.categories) && org.categories.length > 0) {
    payload.categories = org.categories
      .map((c) => c.trim())
      .filter(Boolean)
      .slice(0, 20);
  }
  return payload;
}

function sanitizeOwnerComplaintForFirestore(
  rec: OrganizationComplaintRecord
): OrganizationComplaintRecord {
  const payload: OrganizationComplaintRecord = {
    id: rec.id,
    orgId: rec.orgId,
    complaintCode: rec.complaintCode.trim().slice(0, 64),
    companyNameSnapshot: rec.companyNameSnapshot.trim().slice(0, 160),
    complainantName: rec.complainantName.trim().slice(0, 120),
    category: rec.category.trim().slice(0, 100),
    severity: rec.severity,
    subject: rec.subject.trim().slice(0, 200),
    description: rec.description.trim().slice(0, 4000),
    status: rec.status,
    createdAt: rec.createdAt
  };
  if (rec.complainantPhone?.trim()) {
    payload.complainantPhone = rec.complainantPhone.trim().slice(0, 60);
  }
  if (rec.complainantEmail?.trim()) {
    payload.complainantEmail = rec.complainantEmail.trim().slice(0, 200);
  }
  if (rec.batchOrOrderRef?.trim()) {
    payload.batchOrOrderRef = rec.batchOrOrderRef.trim().slice(0, 120);
  }
  if (rec.incidentDate?.trim()) {
    payload.incidentDate = rec.incidentDate.trim().slice(0, 64);
  }
  if (rec.evidencePhotoUrl?.trim()) {
    payload.evidencePhotoUrl = rec.evidencePhotoUrl.slice(0, 450000);
  }
  if (rec.rootCauseCategory?.trim()) {
    payload.rootCauseCategory = rec.rootCauseCategory.trim().slice(0, 120);
  }
  if (rec.rootCause?.trim()) {
    payload.rootCause = rec.rootCause.trim().slice(0, 4000);
  }
  if (rec.correction?.trim()) {
    payload.correction = rec.correction.trim().slice(0, 4000);
  }
  if (rec.correctiveAction?.trim()) {
    payload.correctiveAction = rec.correctiveAction.trim().slice(0, 4000);
  }
  if (rec.assignedTo?.trim()) {
    payload.assignedTo = rec.assignedTo.trim().slice(0, 120);
  }
  if (rec.targetClosureDate?.trim()) {
    payload.targetClosureDate = rec.targetClosureDate.trim().slice(0, 64);
  }
  if (rec.verificationNotes?.trim()) {
    payload.verificationNotes = rec.verificationNotes.trim().slice(0, 2000);
  }
  if (rec.closedAt?.trim()) {
    payload.closedAt = rec.closedAt.trim().slice(0, 64);
  }
  if (rec.updatedAt?.trim()) {
    payload.updatedAt = rec.updatedAt.trim().slice(0, 64);
  }
  return payload;
}

export const ComplaintHandlingTool: React.FC<ComplaintHandlingToolProps> = ({
  user,
  isUserPaid,
  hasExpiredPremium,
  onOpenPremiumModal,
  onRequireSignIn
}) => {
  const isSignedIn = Boolean(user?.uid && user.uid.trim().length > 0);
  const canExportPdf = Boolean((isUserPaid && !hasExpiredPremium) || user?.isAdmin);

  const [orgProfile, setOrgProfile] =
    useState<ComplaintOrganizationProfile | null>(null);
  const [complaints, setComplaints] = useState<OrganizationComplaintRecord[]>([]);
  const [loadingOrg, setLoadingOrg] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'directory' | 'setup-qr'>(
    'directory'
  );
  const [isTestingIntakeForm, setIsTestingIntakeForm] = useState(false);

  // Organization Setup Form State
  const [companyName, setCompanyName] = useState(user?.company || '');
  const [organizationType, setOrganizationType] = useState<string>(
    'Restaurant / Cafe'
  );
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [branchLocation, setBranchLocation] = useState(user?.location || '');
  const [contactPhone, setContactPhone] = useState(
    user?.whatsappNumber || user?.phone || ''
  );
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [welcomeNote, setWelcomeNote] = useState(
    'We value food safety and customer satisfaction. Please report any quality, hygiene, or service concern below.'
  );
  const [categoriesText, setCategoriesText] = useState(
    DEFAULT_COMPLAINT_CATEGORIES.join('\n')
  );
  const [isPortalActive, setIsPortalActive] = useState(true);
  const [isSavingOrg, setIsSavingOrg] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Directory Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | ComplaintStatus
  >('all');
  const [severityFilter, setSeverityFilter] = useState<
    'all' | ComplaintSeverity
  >('all');

  // Selected Complaint for CAPA Investigation / Editing
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(
    null
  );
  const [capaStatus, setCapaStatus] = useState<ComplaintStatus>('open');
  const [capaRootCauseCategory, setCapaRootCauseCategory] = useState<string>(
    ROOT_CAUSE_CATEGORIES[0]
  );
  const [capaRootCause, setCapaRootCause] = useState('');
  const [capaCorrection, setCapaCorrection] = useState('');
  const [capaCorrectiveAction, setCapaCorrectiveAction] = useState('');
  const [capaAssignedTo, setCapaAssignedTo] = useState('');
  const [capaTargetDate, setCapaTargetDate] = useState('');
  const [capaVerificationNotes, setCapaVerificationNotes] = useState('');
  const [isSavingCapa, setIsSavingCapa] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Manual Complaint Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCategory, setManualCategory] = useState(
    DEFAULT_COMPLAINT_CATEGORIES[0]
  );
  const [manualSeverity, setManualSeverity] =
    useState<ComplaintSeverity>('medium');
  const [manualBatch, setManualBatch] = useState('');
  const [manualSubject, setManualSubject] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);

  const [banner, setBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [exportingPdfId, setExportingPdfId] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setBanner({ type, text });
    setTimeout(() => {
      setBanner((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  // Sync Firestore when signed in, or LocalStorage sandbox for Guests
  useEffect(() => {
    if (!isSignedIn) {
      const sandbox = loadGuestSandbox();
      setOrgProfile(sandbox.org);
      setComplaints(sandbox.complaints);
      if (sandbox.org) {
        setCompanyName(sandbox.org.companyName);
        setOrganizationType(sandbox.org.organizationType);
        setLogoUrl(sandbox.org.logoUrl || '');
        setBranchLocation(sandbox.org.branchLocation || '');
        setContactPhone(sandbox.org.contactPhone || '');
        setContactEmail(sandbox.org.contactEmail || '');
        setWelcomeNote(sandbox.org.welcomeNote || '');
        if (sandbox.org.categories?.length) {
          setCategoriesText(sandbox.org.categories.join('\n'));
        }
        setIsPortalActive(sandbox.org.isActive);
      } else {
        setActiveTab('setup-qr');
      }
      setLoadingOrg(false);
      return;
    }

    setLoadingOrg(true);
    const orgDocRef = doc(db, 'complaintOrgs', user.uid);
    const unsubOrg = onSnapshot(
      orgDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as ComplaintOrganizationProfile;
          setOrgProfile(data);
          setCompanyName(data.companyName || '');
          setOrganizationType(data.organizationType || 'Restaurant / Cafe');
          setLogoUrl(data.logoUrl || '');
          setBranchLocation(data.branchLocation || '');
          setContactPhone(data.contactPhone || '');
          setContactEmail(data.contactEmail || '');
          setWelcomeNote(data.welcomeNote || '');
          if (data.categories?.length) {
            setCategoriesText(data.categories.join('\n'));
          }
          setIsPortalActive(data.isActive !== false);
        } else {
          setOrgProfile(null);
          setActiveTab('setup-qr');
        }
        setLoadingOrg(false);
      },
      (err) => {
        setLoadingOrg(false);
        handleFirestoreError(err, OperationType.GET, `complaintOrgs/${user.uid}`);
      }
    );

    const complaintsCol = query(
      collection(db, 'complaintOrgs', user.uid, 'complaints'),
      orderBy('createdAt', 'desc')
    );
    const unsubComplaints = onSnapshot(
      complaintsCol,
      (snap) => {
        const list = snap.docs.map((d) => d.data() as OrganizationComplaintRecord);
        setComplaints(list);
      },
      (err) => {
        handleFirestoreError(
          err,
          OperationType.LIST,
          `complaintOrgs/${user.uid}/complaints`
        );
      }
    );

    return () => {
      unsubOrg();
      unsubComplaints();
    };
  }, [isSignedIn, user.uid]);

  const effectiveOrgId = isSignedIn ? user.uid : 'guest_sandbox_org';

  const officialBaseUrl = useMemo(() => resolveOfficialVerificationBaseUrl(), []);
  const liveQrIntakeUrl = useMemo(
    () => `${officialBaseUrl}/?complaintOrg=${encodeURIComponent(effectiveOrgId)}`,
    [officialBaseUrl, effectiveOrgId]
  );

  const qrMatrix = useMemo(
    () => (orgProfile ? generateQrCodeMatrix(liveQrIntakeUrl) : []),
    [orgProfile, liveQrIntakeUrl]
  );

  const stats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter((c) => c.status === 'open').length;
    const inProgress = complaints.filter(
      (c) => c.status === 'in_progress'
    ).length;
    const closed = complaints.filter((c) => c.status === 'closed').length;
    const closurePct = total > 0 ? Math.round((closed / total) * 100) : 0;
    return { total, open, inProgress, closed, closurePct };
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return complaints.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (severityFilter !== 'all' && c.severity !== severityFilter) return false;
      if (!q) return true;
      return (
        c.complaintCode.toLowerCase().includes(q) ||
        c.complainantName.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.batchOrOrderRef || '').toLowerCase().includes(q) ||
        (c.rootCause || '').toLowerCase().includes(q)
      );
    });
  }, [complaints, searchQuery, statusFilter, severityFilter]);

  const selectedComplaint = useMemo(
    () => complaints.find((c) => c.id === selectedComplaintId) || null,
    [complaints, selectedComplaintId]
  );

  const openComplaintInvestigator = (rec: OrganizationComplaintRecord) => {
    setSelectedComplaintId(rec.id);
    setCapaStatus(rec.status);
    setCapaRootCauseCategory(rec.rootCauseCategory || ROOT_CAUSE_CATEGORIES[0]);
    setCapaRootCause(rec.rootCause || '');
    setCapaCorrection(rec.correction || '');
    setCapaCorrectiveAction(rec.correctiveAction || '');
    setCapaAssignedTo(rec.assignedTo || user?.name || '');
    setCapaTargetDate(rec.targetClosureDate || '');
    setCapaVerificationNotes(rec.verificationNotes || '');
    setConfirmDeleteId(null);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const compressed = await compressImageFile(file, 420, 0.82);
      if (compressed.dataUrl.length > 420000) {
        showToast(
          'error',
          'Compressed logo exceeds 420 KB. Please choose a smaller logo image.'
        );
      } else {
        setLogoUrl(compressed.dataUrl);
        showToast('success', 'Organization logo ready! Click Save Organization & Generate QR.');
      }
    } catch {
      showToast('error', 'Failed to read selected logo file.');
    } finally {
      setIsUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCompany = companyName.trim();
    if (!cleanCompany) {
      showToast('error', 'Please enter your Company / Restaurant / Organization Name.');
      return;
    }

    setIsSavingOrg(true);
    const nowIso = new Date().toISOString().slice(0, 19) + 'Z';
    const parsedCategories = categoriesText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);

    const draftOrg: ComplaintOrganizationProfile = sanitizeComplaintOrgForFirestore({
      orgId: effectiveOrgId,
      ownerUid: effectiveOrgId,
      companyName: cleanCompany,
      organizationType,
      logoUrl,
      branchLocation,
      contactPhone,
      contactEmail,
      welcomeNote,
      categories:
        parsedCategories.length > 0
          ? parsedCategories
          : DEFAULT_COMPLAINT_CATEGORIES,
      isActive: isPortalActive,
      createdAt: orgProfile?.createdAt || nowIso,
      updatedAt: nowIso
    });

    try {
      if (!isSignedIn) {
        setOrgProfile(draftOrg);
        saveGuestSandbox({ org: draftOrg, complaints });
        showToast(
          'success',
          'Sandbox Organization & QR generated! Sign in free anytime to activate your live public QR link.'
        );
        return;
      }

      const path = `complaintOrgs/${user.uid}`;
      try {
        await setDoc(doc(db, 'complaintOrgs', user.uid), draftOrg);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
      setOrgProfile(draftOrg);
      showToast(
        'success',
        'Organization setup saved & your unique QR Complaint Portal is now live!'
      );
    } catch {
      showToast('error', 'Could not save organization profile. Please try again.');
    } finally {
      setIsSavingOrg(false);
    }
  };

  const handleSaveCapaAndStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !orgProfile) return;

    setIsSavingCapa(true);
    const nowIso = new Date().toISOString().slice(0, 19) + 'Z';
    const nextClosedAt =
      capaStatus === 'closed'
        ? selectedComplaint.closedAt || nowIso
        : undefined;

    const updatedRecord = sanitizeOwnerComplaintForFirestore({
      ...selectedComplaint,
      status: capaStatus,
      rootCauseCategory: capaRootCauseCategory,
      rootCause: capaRootCause,
      correction: capaCorrection,
      correctiveAction: capaCorrectiveAction,
      assignedTo: capaAssignedTo,
      targetClosureDate: capaTargetDate,
      verificationNotes: capaVerificationNotes,
      closedAt: nextClosedAt,
      updatedAt: nowIso
    });

    try {
      if (!isSignedIn) {
        const nextList = complaints.map((item) =>
          item.id === updatedRecord.id ? updatedRecord : item
        );
        setComplaints(nextList);
        saveGuestSandbox({ org: orgProfile, complaints: nextList });
        showToast(
          'success',
          `CAPA & Status (${updatedRecord.status.replace('_', ' ').toUpperCase()}) updated locally.`
        );
        return;
      }

      const path = `complaintOrgs/${user.uid}/complaints/${updatedRecord.id}`;
      try {
        await setDoc(
          doc(db, 'complaintOrgs', user.uid, 'complaints', updatedRecord.id),
          updatedRecord
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
      showToast(
        'success',
        `Saved CAPA & marked complaint ${updatedRecord.complaintCode} as ${updatedRecord.status.replace('_', ' ').toUpperCase()}.`
      );
    } catch {
      showToast('error', 'Failed to update CAPA record.');
    } finally {
      setIsSavingCapa(false);
    }
  };

  const handleCreateManualComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgProfile) {
      showToast('error', 'Please save your Organization Setup first.');
      return;
    }
    if (!manualName.trim() || !manualSubject.trim() || !manualDescription.trim()) {
      showToast('error', 'Complainant Name, Subject, and Details are required.');
      return;
    }

    setIsSavingManual(true);
    const nowIso = new Date().toISOString().slice(0, 19) + 'Z';
    const rand = Math.floor(1000 + Math.random() * 9000);
    const id = `cmp_${Date.now()}_${rand}`;
    const code = `CMP-${new Date().getFullYear()}-${rand}`;

    const newRecord = sanitizeOwnerComplaintForFirestore({
      id,
      orgId: orgProfile.orgId,
      complaintCode: code,
      companyNameSnapshot: orgProfile.companyName,
      complainantName: manualName.trim(),
      complainantPhone: manualPhone.trim(),
      category: manualCategory,
      severity: manualSeverity,
      batchOrOrderRef: manualBatch.trim(),
      incidentDate: nowIso.slice(0, 10),
      subject: manualSubject.trim(),
      description: manualDescription.trim(),
      status: 'open',
      createdAt: nowIso
    });

    try {
      if (!isSignedIn) {
        const nextList = [newRecord, ...complaints];
        setComplaints(nextList);
        saveGuestSandbox({ org: orgProfile, complaints: nextList });
      } else {
        const path = `complaintOrgs/${user.uid}/complaints/${id}`;
        try {
          await setDoc(
            doc(db, 'complaintOrgs', user.uid, 'complaints', id),
            newRecord
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
        }
      }
      setShowManualModal(false);
      setManualName('');
      setManualPhone('');
      setManualBatch('');
      setManualSubject('');
      setManualDescription('');
      setActiveTab('directory');
      openComplaintInvestigator(newRecord);
      showToast('success', `Complaint ${code} logged in your directory.`);
    } catch {
      showToast('error', 'Could not create complaint record.');
    } finally {
      setIsSavingManual(false);
    }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    try {
      if (!isSignedIn) {
        const nextList = complaints.filter((c) => c.id !== complaintId);
        setComplaints(nextList);
        saveGuestSandbox({ org: orgProfile, complaints: nextList });
      } else {
        const path = `complaintOrgs/${user.uid}/complaints/${complaintId}`;
        try {
          await deleteDoc(doc(db, 'complaintOrgs', user.uid, 'complaints', complaintId));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, path);
        }
      }
      if (selectedComplaintId === complaintId) {
        setSelectedComplaintId(null);
      }
      setConfirmDeleteId(null);
      showToast('success', 'Complaint record removed from directory.');
    } catch {
      showToast('error', 'Could not delete complaint record.');
    }
  };

  const handleCopyQrLink = async () => {
    try {
      await navigator.clipboard.writeText(liveQrIntakeUrl);
    } catch {
      // Ignore clipboard failures
    }
    setCopiedLink(true);
    showToast('success', 'Organization Complaint QR Link copied!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadSinglePdf = async (rec: OrganizationComplaintRecord) => {
    if (!canExportPdf) {
      onOpenPremiumModal();
      return;
    }
    if (!orgProfile) return;
    setExportingPdfId(rec.id);
    try {
      await downloadSingleComplaintCapaPdf(orgProfile, rec, user?.name || '');
      showToast('success', `Downloaded CAPA Report PDF (${rec.complaintCode}).`);
    } finally {
      setExportingPdfId(null);
    }
  };

  const handleDownloadDirectoryPdf = async () => {
    if (!canExportPdf) {
      onOpenPremiumModal();
      return;
    }
    if (!orgProfile) return;
    setExportingPdfId('directory');
    try {
      const label =
        statusFilter === 'all'
          ? 'All Records'
          : statusFilter.replace('_', ' ').toUpperCase();
      await downloadFullComplaintDirectoryPdf(
        orgProfile,
        filteredComplaints,
        label
      );
      showToast('success', 'Downloaded Organization Complaint Directory PDF!');
    } finally {
      setExportingPdfId(null);
    }
  };

  if (loadingOrg) {
    return (
      <div className="bg-white border border-[#D2DEEA] rounded-2xl p-10 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 text-[#1673B8] animate-spin" />
        <p className="text-xs font-bold text-[#1A2138]">
          Loading Your Private Complaint &amp; CAPA Directory...
        </p>
      </div>
    );
  }

  // Inline Preview / Test Customer Intake Form Mode
  if (isTestingIntakeForm && orgProfile) {
    return (
      <PublicComplaintIntakeView
        orgId={orgProfile.orgId}
        demoOrgPreview={!isSignedIn ? orgProfile : null}
        onSubmitDemoComplaint={(rec) => {
          const nextList = [rec, ...complaints];
          setComplaints(nextList);
          saveGuestSandbox({ org: orgProfile, complaints: nextList });
        }}
        onBackToPortal={() => {
          setIsTestingIntakeForm(false);
          setActiveTab('directory');
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Guest Sandbox Notice */}
      {!isSignedIn && (
        <div className="rounded-2xl bg-[#1A2138] text-white p-4 border border-[#1673B8]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
              Guest Sandbox Mode Active
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Test company setup, QR code, intake form &amp; CAPA locally.{' '}
              <strong>Sign in free</strong> to activate your permanent public QR link and isolate complaints strictly inside your Profile.
            </p>
          </div>
          {onRequireSignIn && (
            <button
              type="button"
              onClick={onRequireSignIn}
              className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-bold whitespace-nowrap cursor-pointer shrink-0"
            >
              Sign In Free to Go Live
            </button>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {banner && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 border ${
            banner.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-[#1673B8] border-[#105E9A] text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {banner.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{banner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-[11px] underline cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Header + Privacy Assurance + Primary Actions */}
      <div className="bg-white border border-[#D2DEEA] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={orgProfile?.logoUrl || FS_PORTAL_LOGO_DATA_URI}
                alt={orgProfile?.companyName || 'Organization Logo'}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#1A2138] tracking-tight">
                  {orgProfile?.companyName
                    ? `${orgProfile.companyName} — Complaint & CAPA Directory`
                    : 'Complaint Handling, QR Portal & CAPA Directory'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] text-[10.5px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Private User Isolation</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Configure your organization &amp; logo, generate your scannable QR complaint form, investigate Root Cause, document Correction &amp; Corrective Action, and track Open/Closed status.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border whitespace-nowrap cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-[#1A2138] text-white border-[#1A2138]'
                  : 'bg-[#F8FAFC] text-[#1A2138] border-[#D2DEEA] hover:bg-[#F0F6FC]'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Complaint Directory ({stats.total})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('setup-qr')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border whitespace-nowrap cursor-pointer ${
                activeTab === 'setup-qr'
                  ? 'bg-[#1673B8] text-white border-[#1673B8]'
                  : 'bg-[#F8FAFC] text-[#1A2138] border-[#D2DEEA] hover:bg-[#F0F6FC]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Organization &amp; QR Setup</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA]">
            <div className="text-[11px] font-semibold text-slate-500">
              Total Logged
            </div>
            <div className="text-lg font-bold text-[#1A2138] tabular-nums mt-0.5">
              {stats.total}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-red-50/60 border border-red-200/80">
            <div className="text-[11px] font-semibold text-red-700">Open</div>
            <div className="text-lg font-bold text-red-700 tabular-nums mt-0.5">
              {stats.open}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
            <div className="text-[11px] font-semibold text-[#1673B8]">
              In Progress
            </div>
            <div className="text-lg font-bold text-[#1673B8] tabular-nums mt-0.5">
              {stats.inProgress}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-[11px] font-semibold text-emerald-700">
              Closed
            </div>
            <div className="text-lg font-bold text-emerald-700 tabular-nums mt-0.5">
              {stats.closed}
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#F4F8FD] border border-[#D2DEEA]">
            <div className="text-[11px] font-semibold text-slate-600">
              Closure Rate
            </div>
            <div className="text-lg font-bold text-[#1A2138] tabular-nums mt-0.5">
              {stats.closurePct}%
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: ORGANIZATION SETUP & QR CODE GENERATOR
         ===================================================================== */}
      {activeTab === 'setup-qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Setup Form */}
          <form
            onSubmit={handleSaveOrganization}
            className="lg:col-span-7 bg-white border border-[#D2DEEA] rounded-2xl p-5 space-y-4 shadow-2xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-[#1673B8]" />
                <h2 className="text-base font-bold text-[#1A2138]">
                  Organization Profile &amp; QR Form Branding
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Strict Private Ownership
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Company / Restaurant Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={160}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Al-Noor Foods / Spice Grill"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs sm:text-sm text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Organization Sector <span className="text-red-600">*</span>
                </label>
                <select
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs sm:text-sm text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                >
                  {SECTOR_OPTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Logo Uploader */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white border border-[#D2DEEA] p-1 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={logoUrl || FS_PORTAL_LOGO_DATA_URI}
                    alt="Company logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A2138]">
                    Company / Restaurant Logo
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Appears on QR Standee Poster, Intake Form &amp; PDF Reports
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#1673B8] text-[#1673B8] hover:bg-[#F0F6FC] text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  {isUploadingLogo ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                </button>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="px-2.5 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Branch / City Location
                </label>
                <input
                  type="text"
                  maxLength={240}
                  value={branchLocation}
                  onChange={(e) => setBranchLocation(e.target.value)}
                  placeholder="e.g. Gulberg III, Lahore"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Support Phone
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  maxLength={200}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="qa@company.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A2138] mb-1">
                Welcome Message Shown on QR Form
              </label>
              <textarea
                rows={2}
                maxLength={600}
                value={welcomeNote}
                onChange={(e) => setWelcomeNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A2138] mb-1">
                Complaint Categories (one per line, max 20)
              </label>
              <textarea
                rows={4}
                value={categoriesText}
                onChange={(e) => setCategoriesText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138] font-mono focus:outline-none focus:border-[#1673B8]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA]">
              <div>
                <div className="text-xs font-bold text-[#1A2138]">
                  Accept Public QR Complaints
                </div>
                <div className="text-[11px] text-slate-500">
                  Turn off temporarily to pause incoming customer form submissions.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isPortalActive}
                onClick={() => setIsPortalActive((v) => !v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                  isPortalActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isPortalActive ? 'Active' : 'Paused'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSavingOrg}
              className="w-full py-3 px-5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-60 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {isSavingOrg ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <QrCode className="w-4 h-4" />
              )}
              <span>
                {isSavingOrg
                  ? 'Saving Organization...'
                  : 'Save Organization & Generate QR Code'}
              </span>
            </button>
          </form>

          {/* Live QR Code Card & Poster Export */}
          <div className="lg:col-span-5 bg-white border border-[#D2DEEA] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-2xs">
            {!orgProfile ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F0F6FC] text-[#1673B8] flex items-center justify-center">
                  <QrCode className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#1A2138]">
                  Your Organization QR Code Will Appear Here
                </h3>
                <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                  Enter your Company / Restaurant Name and details on the left and click{' '}
                  <strong>Save Organization &amp; Generate QR Code</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 text-center">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isSignedIn
                        ? 'Live Scannable QR Portal Ready'
                        : 'Sandbox QR Preview Ready'}
                    </span>
                  </div>

                  {/* Branded Mini Poster Preview */}
                  <div className="border border-[#D2DEEA] rounded-2xl overflow-hidden bg-[#F8FAFC]">
                    <div className="bg-[#1A2138] px-4 py-3 text-white flex items-center justify-center gap-2.5 border-b-2 border-[#1673B8]">
                      <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                        <img
                          src={orgProfile.logoUrl || FS_PORTAL_LOGO_DATA_URI}
                          alt={orgProfile.companyName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-xs font-bold truncate">
                          {orgProfile.companyName}
                        </div>
                        <div className="text-[10px] text-sky-200 truncate">
                          {orgProfile.organizationType}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col items-center space-y-2.5">
                      <p className="text-[11px] font-bold text-[#1A2138] uppercase tracking-wide">
                        Scan to Submit a Complaint
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-[#D2DEEA]">
                        {qrMatrix.length > 0 ? (
                          <svg
                            viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                            className="w-44 h-44"
                            aria-label="Organization Complaint QR Code"
                          >
                            <rect
                              width={qrMatrix.length}
                              height={qrMatrix.length}
                              fill="#FFFFFF"
                            />
                            {qrMatrix.map((row, r) =>
                              row.map((cell, c) =>
                                cell ? (
                                  <rect
                                    key={`${r}-${c}`}
                                    x={c}
                                    y={r}
                                    width={1}
                                    height={1}
                                    fill="#1A2138"
                                  />
                                ) : null
                              )
                            )}
                          </svg>
                        ) : (
                          <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                            Generating QR...
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-[#1673B8] break-all px-2">
                        {liveQrIntakeUrl}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => downloadQrPosterPng(orgProfile, liveQrIntakeUrl)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Printable QR Poster (PNG)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopyQrLink}
                      className="py-2.5 px-3 rounded-xl bg-[#F0F6FC] hover:bg-[#E2EEF9] border border-[#D2DEEA] text-[#1A2138] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      {copiedLink ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#1673B8]" />
                      )}
                      <span>{copiedLink ? 'Copied!' : 'Copy QR Link'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsTestingIntakeForm(true)}
                      className="py-2.5 px-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Public Form</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: COMPLAINT DIRECTORY & CAPA WORKFLOW
         ===================================================================== */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {!orgProfile && (
            <div className="bg-white border border-[#D2DEEA] rounded-2xl p-6 text-center space-y-3">
              <Building2 className="w-9 h-9 text-[#1673B8] mx-auto" />
              <h2 className="text-base font-bold text-[#1A2138]">
                Set Up Your Organization to Receive QR Complaints
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Add your Company Name and Logo first so your unique Complaint QR Code and private directory can be activated.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('setup-qr')}
                className="px-4 py-2.5 rounded-xl bg-[#1673B8] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                <span>Configure Organization &amp; QR</span>
              </button>
            </div>
          )}

          {orgProfile && (
            <>
              {/* Toolbar: Search, Filters, Log Walk-in Complaint, Download Directory PDF */}
              <div className="bg-white border border-[#D2DEEA] rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by code, complainant, batch, subject or root cause..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value as 'all' | ComplaintStatus)
                      }
                      className="px-2.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs font-semibold text-[#1A2138]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="open">Open Only</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed Only</option>
                    </select>

                    <select
                      value={severityFilter}
                      onChange={(e) =>
                        setSeverityFilter(
                          e.target.value as 'all' | ComplaintSeverity
                        )
                      }
                      className="px-2.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs font-semibold text-[#1A2138]"
                    >
                      <option value="all">All Severities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsTestingIntakeForm(true)}
                    className="px-3 py-2 rounded-xl bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#D2DEEA] text-[#1673B8] text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Open QR Form</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowManualModal(true)}
                    className="px-3 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Complaint</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadDirectoryPdf}
                    disabled={exportingPdfId === 'directory'}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      canExportPdf
                        ? 'bg-[#1673B8] hover:bg-[#105E9A] text-white'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {exportingPdfId === 'directory' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : canExportPdf ? (
                      <Download className="w-3.5 h-3.5" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {canExportPdf
                        ? 'Export Directory PDF'
                        : 'Directory PDF (Paid)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Split Directory List + CAPA Investigation Workbench */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Directory List */}
                <div className="lg:col-span-5 bg-white border border-[#D2DEEA] rounded-2xl overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
                    <span className="text-xs font-bold text-[#1A2138]">
                      Organization Records ({filteredComplaints.length})
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Click any record for CAPA
                    </span>
                  </div>

                  {filteredComplaints.length === 0 ? (
                    <div className="p-8 text-center space-y-2.5">
                      <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="text-xs font-bold text-[#1A2138]">
                        {complaints.length === 0
                          ? 'No Complaints Received Yet'
                          : 'No Records Match Current Filter'}
                      </div>
                      <p className="text-[11.5px] text-slate-500 leading-relaxed">
                        Share your QR Poster or click <strong>Open QR Form</strong> to test submitting a customer complaint directly into this directory.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
                      {filteredComplaints.map((rec) => {
                        const isSelected = selectedComplaintId === rec.id;
                        return (
                          <button
                            key={rec.id}
                            type="button"
                            onClick={() => openComplaintInvestigator(rec)}
                            className={`w-full text-left p-4 transition-colors cursor-pointer space-y-1.5 ${
                              isSelected
                                ? 'bg-[#EBF4FC] border-l-4 border-l-[#1673B8]'
                                : 'hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-mono font-bold text-[#1673B8] tabular-nums">
                                {rec.complaintCode}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <SeverityBadge severity={rec.severity} />
                                <StatusBadge status={rec.status} />
                              </div>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-[#1A2138] line-clamp-1">
                              {rec.subject}
                            </div>
                            <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span className="font-semibold">
                                {rec.complainantName}
                              </span>
                              <span>·</span>
                              <span>{rec.category}</span>
                              <span>·</span>
                              <span className="tabular-nums">
                                {formatShortDate(rec.createdAt)}
                              </span>
                            </div>
                            {(rec.rootCause || rec.correctiveAction) && (
                              <div className="text-[10.5px] font-semibold text-emerald-700 pt-0.5">
                                CAPA Documented ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right: Selected Complaint Investigation, Root Cause, Correction, CAPA & PDF */}
                <div className="lg:col-span-7 bg-white border border-[#D2DEEA] rounded-2xl p-5">
                  {!selectedComplaint ? (
                    <div className="h-full min-h-[340px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                      <ClipboardCheck className="w-10 h-10 text-slate-300" />
                      <h3 className="text-sm font-bold text-[#1A2138]">
                        Select a Complaint to Investigate &amp; Document CAPA
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                        Review customer evidence, classify Root Cause, enter Immediate Correction &amp; Corrective Action, update Open/Closed status, or export your official CAPA PDF report.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveCapaAndStatus} className="space-y-4">
                      {/* Ticket Header */}
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#1673B8] tabular-nums">
                              {selectedComplaint.complaintCode}
                            </span>
                            <StatusBadge status={selectedComplaint.status} />
                            <SeverityBadge severity={selectedComplaint.severity} />
                          </div>
                          <h2 className="text-base font-bold text-[#1A2138] mt-1">
                            {selectedComplaint.subject}
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Submitted by <strong>{selectedComplaint.complainantName}</strong>
                            {selectedComplaint.complainantPhone
                              ? ` · ${selectedComplaint.complainantPhone}`
                              : ''}
                            {selectedComplaint.complainantEmail
                              ? ` · ${selectedComplaint.complainantEmail}`
                              : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadSinglePdf(selectedComplaint)}
                            disabled={exportingPdfId === selectedComplaint.id}
                            className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                              canExportPdf
                                ? 'bg-[#1A2138] hover:bg-[#1673B8] text-white'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {exportingPdfId === selectedComplaint.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : canExportPdf ? (
                              <FileText className="w-3.5 h-3.5" />
                            ) : (
                              <Crown className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {canExportPdf ? 'Download CAPA PDF' : 'CAPA PDF (Paid)'}
                            </span>
                          </button>

                          {confirmDeleteId === selectedComplaint.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteComplaint(selectedComplaint.id)
                                }
                                className="px-2.5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDeleteId(selectedComplaint.id)
                              }
                              title="Delete Complaint"
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Incident Description & Evidence */}
                      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-2">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-600">
                          <span>
                            <strong>Category:</strong> {selectedComplaint.category}
                          </span>
                          {selectedComplaint.batchOrOrderRef && (
                            <span>
                              <strong>Ref/Batch:</strong>{' '}
                              {selectedComplaint.batchOrOrderRef}
                            </span>
                          )}
                          <span>
                            <strong>Incident Date:</strong>{' '}
                            {selectedComplaint.incidentDate ||
                              formatShortDate(selectedComplaint.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-[#1A2138] leading-relaxed whitespace-pre-line">
                          {selectedComplaint.description}
                        </p>
                        {selectedComplaint.evidencePhotoUrl && (
                          <div className="pt-1.5">
                            <div className="text-[10.5px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              <span>Customer Photo Evidence</span>
                            </div>
                            <img
                              src={selectedComplaint.evidencePhotoUrl}
                              alt="Customer complaint evidence"
                              className="max-h-44 rounded-xl border border-[#D2DEEA] object-contain bg-white"
                            />
                          </div>
                        )}
                      </div>

                      {/* CAPA & Open/Closed Status Form */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#1A2138] mb-1">
                            Complaint Resolution Status
                          </label>
                          <select
                            value={capaStatus}
                            onChange={(e) =>
                              setCapaStatus(e.target.value as ComplaintStatus)
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                          >
                            <option value="open">Open (Needs Action)</option>
                            <option value="in_progress">
                              In Progress (Investigating)
                            </option>
                            <option value="closed">
                              Closed (Verified &amp; Resolved)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1A2138] mb-1">
                            Root Cause Category
                          </label>
                          <select
                            value={capaRootCauseCategory}
                            onChange={(e) =>
                              setCapaRootCauseCategory(e.target.value)
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                          >
                            {ROOT_CAUSE_CATEGORIES.map((rc) => (
                              <option key={rc} value={rc}>
                                {rc}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A2138] mb-1">
                          Root Cause Analysis (Why did this happen?)
                        </label>
                        <textarea
                          rows={2}
                          maxLength={4000}
                          value={capaRootCause}
                          onChange={(e) => setCapaRootCause(e.target.value)}
                          placeholder="Document 5-Why / Ishikawa findings behind this complaint..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A2138] mb-1">
                          Immediate Correction (Containment / Customer Remedy)
                        </label>
                        <textarea
                          rows={2}
                          maxLength={4000}
                          value={capaCorrection}
                          onChange={(e) => setCapaCorrection(e.target.value)}
                          placeholder="e.g. Replaced order, quarantined affected batch, sanitized prep station..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A2138] mb-1">
                          Corrective &amp; Preventive Action (CAPA — Prevent Recurrence)
                        </label>
                        <textarea
                          rows={2}
                          maxLength={4000}
                          value={capaCorrectiveAction}
                          onChange={(e) =>
                            setCapaCorrectiveAction(e.target.value)
                          }
                          placeholder="e.g. Retrained kitchen/line staff on SOP-04, added CCP hourly thermometer check..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#1A2138] mb-1">
                            Assigned Owner (QA / Manager)
                          </label>
                          <input
                            type="text"
                            maxLength={120}
                            value={capaAssignedTo}
                            onChange={(e) => setCapaAssignedTo(e.target.value)}
                            placeholder="e.g. QA Officer / Shift Manager"
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#1A2138] mb-1">
                            Target Closure Date
                          </label>
                          <input
                            type="date"
                            value={capaTargetDate}
                            onChange={(e) => setCapaTargetDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A2138] mb-1">
                          Closure Verification Notes
                        </label>
                        <input
                          type="text"
                          maxLength={2000}
                          value={capaVerificationNotes}
                          onChange={(e) =>
                            setCapaVerificationNotes(e.target.value)
                          }
                          placeholder="Effectiveness check result before closing complaint..."
                          className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs text-[#1A2138]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingCapa}
                        className="w-full py-3 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-60 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        {isSavingCapa ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>
                          {isSavingCapa
                            ? 'Saving Investigation...'
                            : 'Save Root Cause, CAPA & Status'}
                        </span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Manual / Walk-In Complaint Entry Modal */}
      {showManualModal && orgProfile && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D2DEEA] rounded-2xl max-w-lg w-full p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#1A2138]">
                Log Walk-In / Phone Complaint
              </h3>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualComplaint} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A2138] mb-1">
                    Customer / Reporter Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2138] mb-1">
                    Phone / Contact
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="+92..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A2138] mb-1">
                    Category
                  </label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs"
                  >
                    {(orgProfile.categories?.length
                      ? orgProfile.categories
                      : DEFAULT_COMPLAINT_CATEGORIES
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2138] mb-1">
                    Severity
                  </label>
                  <select
                    value={manualSeverity}
                    onChange={(e) =>
                      setManualSeverity(e.target.value as ComplaintSeverity)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Order / Table / Batch Ref
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={manualBatch}
                  onChange={(e) => setManualBatch(e.target.value)}
                  placeholder="Optional reference number"
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Complaint Subject *
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={manualSubject}
                  onChange={(e) => setManualSubject(e.target.value)}
                  placeholder="Short summary of the complaint"
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={4000}
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  placeholder="Full complaint details..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingManual}
                  className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-bold cursor-pointer"
                >
                  {isSavingManual ? 'Saving...' : 'Save Complaint to Directory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
