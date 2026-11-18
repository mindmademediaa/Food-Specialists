export type QaModuleId =
  | 'company-register'
  | 'sops'
  | 'approved-supplier'
  | 'pest-management'
  | 'haccp-team'
  | 'product-description'
  | 'flow-diagram'
  | 'hazard-analysis'
  | 'ccp-determination'
  | 'critical-limits'
  | 'monitoring-checklists'
  | 'corrective-actions'
  | 'verification-form'
  | 'risk-assessment'
  | 'classic-templates';

export type QaDocumentStatus = 'draft' | 'in_review' | 'approved';

export type QaStandardScope =
  | 'ISO 9001:2015'
  | 'FSSC 22000 v6/v7'
  | 'ISO 22000:2018'
  | 'Codex HACCP (CXC 1-1969)'
  | 'ISO/TS 22002-1 (PRPs)';

export interface QaControlledDocMeta {
  docCode: string;
  revision: string;
  status: QaDocumentStatus;
  effectiveDate: string;
  reviewCycle: string;
  standardClause: string;
  updatedAt: string;
}

export interface QaWorkspaceCompanyProfile {
  uid: string;
  ownerUid: string;
  companyName: string;
  industryType: string;
  facilityAddress: string;
  scopeStatement: string;
  standards: string[];
  docCodePrefix: string;
  pfaOrRegNo: string;
  contactPhone: string;
  contactEmail: string;
  logoUrl: string;
  preparedBy: string;
  preparedRole: string;
  reviewedBy: string;
  reviewedRole: string;
  approvedBy: string;
  approvedRole: string;
  createdAt: string;
  updatedAt: string;
}

// 1. SOPs Module
export interface QaSopRecord {
  id: string;
  sopCode: string;
  title: string;
  standardRef: string;
  department: string;
  revision: string;
  status: QaDocumentStatus;
  purpose: string;
  scope: string;
  responsibilities: string;
  procedureSteps: string[];
  recordsRequired: string;
}

export interface QaSopsModulePayload {
  sops: QaSopRecord[];
}

// 2. Approved Supplier Program (ASP)
export interface QaApprovedSupplierRow {
  id: string;
  supplierName: string;
  materialSupplied: string;
  riskTier: 'High' | 'Medium' | 'Low';
  certifications: string;
  certExpiry: string;
  auditMethod: string;
  auditScorePct: number;
  coaParameters: string;
  approvalStatus: 'Approved' | 'Conditional' | 'Suspended';
  nextEvaluationDate: string;
}

export interface QaSupplierProgramPayload {
  policyObjective: string;
  selectionProcedure: string;
  incomingCoaRule: string;
  reEvaluationCriteria: string;
  suppliers: QaApprovedSupplierRow[];
}

// 3. Pest Management Procedure & Map
export interface QaPestDeviceRow {
  id: string;
  deviceCode: string;
  zoneLocation: string;
  deviceType:
    | 'External Tamper-Resistant Bait Station'
    | 'Internal Mechanical Trap / Glue Board'
    | 'Insect Light Trap (ILT / Shatterproof UV)'
    | 'Pheromone Moth / Beetle Trap'
    | 'Air Curtain / Exclusion Mesh';
  targetPest: string;
  inspectionFrequency: string;
  lastActivityCount: number;
  thresholdTrigger: string;
  correctiveActionNote: string;
}

export interface QaPestManagementPayload {
  contractorName: string;
  contractorLicenseNo: string;
  procedureSummary: string;
  chemicalControlRule: string;
  trendReviewRule: string;
  devices: QaPestDeviceRow[];
}

// 4. Assemble HACCP Team (Codex Step 1)
export interface QaHaccpTeamMember {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  haccpRole:
    | 'Food Safety Team Leader (FSTL)'
    | 'Assistant FSTL / QA Deputy'
    | 'Production Lead'
    | 'Engineering & Maintenance'
    | 'Microbiology / Lab Analyst'
    | 'Sanitation & PRP Lead'
    | 'Procurement & Warehouse';
  qualificationAndExp: string;
  trainingCredentials: string;
  assignedResponsibilities: string;
}

export interface QaHaccpTeamPayload {
  teamCharterStatement: string;
  meetingFrequency: string;
  externalConsultants: string;
  members: QaHaccpTeamMember[];
}

// 5. Product Description & Intended Use (Codex Steps 2 & 3)
export interface QaProductDescriptionItem {
  id: string;
  productCode: string;
  productName: string;
  productCategory: string;
  rawMaterialsAndIngredients: string;
  intrinsicCharacteristics: string; // pH, aw, Brix, moisture, preservatives
  processingMethod: string;
  packagingMaterial: string;
  shelfLifeAndStorage: string;
  distributionMethod: string;
  intendedUse: string;
  targetConsumerGroup: string;
  vulnerableGroupsWarning: string;
  allergenDeclaration: string;
  labelingAndRegulatoryStandard: string;
  expectedMishandling: string;
}

export interface QaProductDescriptionPayload {
  products: QaProductDescriptionItem[];
}

// 6. Process Flow Diagram & Verification (Codex Steps 4 & 5)
export type QaFlowStepCategory =
  | 'Receiving'
  | 'Storage'
  | 'Preparation'
  | 'Processing / Kill Step'
  | 'Inspection / CCP'
  | 'Packaging'
  | 'Dispatch';

export interface QaFlowStepItem {
  id: string;
  stepNumber: number;
  stepName: string;
  stepCategory: QaFlowStepCategory;
  inputsAndIngredients: string;
  wastesAndRework: string;
  equipmentAndParams: string;
  controlClassification: 'PRP' | 'OPRP' | 'CCP';
}

export interface QaFlowVerificationRecord {
  id: string;
  verificationDate: string;
  lineAndShift: string;
  checkedDuringLiveRun: 'Yes' | 'No';
  deviationsObserved: string;
  diagramCorrectionsMade: string;
  verifiedBy: string;
  fstlApproval: string;
}

export interface QaFlowDiagramPayload {
  processTitle: string;
  scopeBoundary: string;
  steps: QaFlowStepItem[];
  verifications: QaFlowVerificationRecord[];
}

// 7. Hazard Analysis of Products & Process (Codex Step 6)
export type QaHazardCategory = 'Biological' | 'Chemical' | 'Physical' | 'Allergen' | 'Radiological';

export interface QaHazardAnalysisRow {
  id: string;
  stepOrMaterial: string;
  hazardCategory: QaHazardCategory;
  hazardDescription: string;
  causeOrSource: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  severity: 1 | 2 | 3 | 4 | 5;
  justification: string;
  controlMeasures: string;
  appliedProgram: 'PRP' | 'OPRP' | 'CCP';
}

export interface QaHazardAnalysisPayload {
  methodologyNote: string;
  significanceThreshold: number; // e.g. >= 9 or severity >= 4
  rows: QaHazardAnalysisRow[];
}

// 8. Determination of Critical Control Points — Codex 4-Question Decision Tree (Codex Step 7)
export interface QaCcpTreeRow {
  id: string;
  stepName: string;
  significantHazard: string;
  q1ControlMeasureExists: 'Yes' | 'No';
  q1ModifyNeeded?: 'Yes' | 'No';
  q2DesignedToEliminate: 'Yes' | 'No';
  q3ContaminationCouldIncrease: 'Yes' | 'No';
  q4SubsequentStepEliminates: 'Yes' | 'No';
  classification: 'CCP' | 'OPRP' | 'PRP';
  ccpNumber: string;
  decisionRationale: string;
}

export interface QaCcpDeterminationPayload {
  decisionTreeStandard: string;
  rows: QaCcpTreeRow[];
}

// 9. Determination of Critical Control Limits (Codex Step 8)
export interface QaCriticalLimitRow {
  id: string;
  ccpOrOprpNumber: string;
  processStep: string;
  hazardControlled: string;
  criticalLimit: string; // Statutory/safety fail threshold
  operationalTarget: string; // Stricter early-warning target
  scientificValidationBasis: string;
  validationEvidenceRef: string;
}

export interface QaCriticalLimitsPayload {
  validationPolicy: string;
  rows: QaCriticalLimitRow[];
}

// 10. Monitoring Checklists Suite (Codex Step 9)
export interface QaChecklistItemRow {
  id: string;
  checkpointName: string;
  frequency: string;
  acceptableLimit: string;
  actualReading: string;
  status: 'Pass' | 'Fail' | 'N/A';
  operatorInitials: string;
  remarks: string;
}

export interface QaMonitoringChecklistTemplate {
  id: string;
  checklistCode: string;
  title: string;
  standardRef: string;
  monitoringDate: string;
  shift: string;
  lineOrArea: string;
  items: QaChecklistItemRow[];
}

export interface QaMonitoringChecklistsPayload {
  checklists: QaMonitoringChecklistTemplate[];
}

// 11. Corrective Actions Form & Register (Codex Step 10 / ISO 9001 Cl. 10.2)
export interface QaCorrectiveActionRow {
  id: string;
  carNumber: string;
  dateRaised: string;
  source:
    | 'CCP Deviation'
    | 'OPRP Deviation'
    | 'Internal Audit Finding'
    | 'Customer Complaint'
    | 'Supplier Non-Conformance'
    | 'PRP Sanitation Fail';
  affectedProductBatch: string;
  quantityHeld: string;
  deviationDescription: string;
  immediateCorrection: string;
  productDisposition: 'Hold & Test' | 'Reprocess' | 'Reject / Destroy' | 'Released After Review';
  rootCause5Why: string;
  correctiveActionPlan: string;
  responsiblePerson: string;
  targetDate: string;
  effectivenessVerification: string;
  status: 'Open' | 'In Progress' | 'Closed';
}

export interface QaCorrectiveActionsPayload {
  holdAndReleaseProcedure: string;
  records: QaCorrectiveActionRow[];
}

// 12. Verification & Validation Form (Codex Step 11 / ISO 22000 Cl. 8.8 & 9.1)
export interface QaVerificationRow {
  id: string;
  activityName: string;
  standardClause: string;
  frequency: string;
  methodAndCriteria: string;
  lastVerifiedDate: string;
  actualFinding: string;
  verificationStatus: 'Conforming' | 'Action Required' | 'Scheduled';
  nextDueDate: string;
  verifierName: string;
}

export interface QaVerificationPayload {
  verificationObjective: string;
  rows: QaVerificationRow[];
}

// 13. Full Risk & Opportunity Assessment (ISO 9001 Cl. 6.1 + FSSC 22000 Cl. 6.1 + TACCP + VACCP)
export type QaRiskDomain =
  | 'ISO 9001 QMS (Quality & Process)'
  | 'FSSC 22000 FSMS (Food Safety & Culture)'
  | 'TACCP (Food Defense / Intentional Threat)'
  | 'VACCP (Food Fraud / Adulteration)'
  | 'Supply Chain & Regulatory';

export interface QaRiskAssessmentRow {
  id: string;
  riskCode: string;
  domain: QaRiskDomain;
  processOrArea: string;
  riskOrOpportunity: string;
  potentialImpact: string;
  inherentLikelihood: 1 | 2 | 3 | 4 | 5;
  inherentSeverity: 1 | 2 | 3 | 4 | 5;
  existingControls: string;
  mitigationActionPlan: string;
  owner: string;
  residualLikelihood: 1 | 2 | 3 | 4 | 5;
  residualSeverity: 1 | 2 | 3 | 4 | 5;
  targetDate: string;
  reviewStatus: 'Controlled' | 'Mitigation Open' | 'Escalated';
}

export interface QaRiskAssessmentPayload {
  scoringMatrixRule: string;
  rows: QaRiskAssessmentRow[];
}

export type QaModulePayloadMap = {
  sops: QaSopsModulePayload;
  'approved-supplier': QaSupplierProgramPayload;
  'pest-management': QaPestManagementPayload;
  'haccp-team': QaHaccpTeamPayload;
  'product-description': QaProductDescriptionPayload;
  'flow-diagram': QaFlowDiagramPayload;
  'hazard-analysis': QaHazardAnalysisPayload;
  'ccp-determination': QaCcpDeterminationPayload;
  'critical-limits': QaCriticalLimitsPayload;
  'monitoring-checklists': QaMonitoringChecklistsPayload;
  'corrective-actions': QaCorrectiveActionsPayload;
  'verification-form': QaVerificationPayload;
  'risk-assessment': QaRiskAssessmentPayload;
};

export interface QaStoredModuleDoc<K extends keyof QaModulePayloadMap = keyof QaModulePayloadMap> {
  moduleId: K;
  ownerUid: string;
  meta: QaControlledDocMeta;
  payload: QaModulePayloadMap[K];
}
