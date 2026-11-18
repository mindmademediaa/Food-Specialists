import {
  QaControlledDocMeta,
  QaModuleId,
  QaModulePayloadMap,
  QaWorkspaceCompanyProfile
} from '../types/qaVault';

export interface QaModuleCatalogEntry {
  id: QaModuleId;
  orderCode: string;
  shortTitle: string;
  fullTitle: string;
  group: 'Setup & Control' | 'QMS & PRPs (ISO 9001 / FSSC)' | 'Codex 12-Step HACCP' | 'Monitoring, CAPA & Risk' | 'Classic Forms';
  standardRef: string;
  defaultSuffix: string;
  summary: string;
}

export const QA_MODULE_CATALOG: QaModuleCatalogEntry[] = [
  {
    id: 'company-register',
    orderCode: '00',
    shortTitle: 'Company Setup & Doc Control',
    fullTitle: 'Company Profile & Master Document Control Register',
    group: 'Setup & Control',
    standardRef: 'ISO 9001 Cl. 7.5 · ISO 22000 Cl. 7.5',
    defaultSuffix: 'MDR-00',
    summary:
      'Enter your company name, logo, facility address, certification scope, and document approval authorities to auto-brand every SOP, HACCP plan, checklist, and PDF.'
  },
  {
    id: 'sops',
    orderCode: '01',
    shortTitle: 'SOPs Library & Builder',
    fullTitle: 'Standard Operating Procedures (ISO 9001 & FSSC 22000 PRPs)',
    group: 'QMS & PRPs (ISO 9001 / FSSC)',
    standardRef: 'ISO 9001 Cl. 8.1 · ISO/TS 22002-1',
    defaultSuffix: 'SOP-01',
    summary:
      'Create, customize, and control company SOPs including Document Control, SSOP Sanitation, Allergen Management, Personal Hygiene, Glass/Brittle Plastic, and Recall.'
  },
  {
    id: 'approved-supplier',
    orderCode: '02',
    shortTitle: 'Approved Supplier Program',
    fullTitle: 'Approved Supplier Program (ASP) & Incoming COA Control',
    group: 'QMS & PRPs (ISO 9001 / FSSC)',
    standardRef: 'ISO 9001 Cl. 8.4 · FSSC Cl. 7.1.6 & 2.5.1',
    defaultSuffix: 'ASP-02',
    summary:
      'Complete vendor qualification policy, risk-based audit tiering, GFSI/Halal certificate expiry tracking, and incoming Certificate of Analysis (COA) verification register.'
  },
  {
    id: 'pest-management',
    orderCode: '03',
    shortTitle: 'Pest Management Procedure',
    fullTitle: 'Integrated Pest Management (IPM) Procedure & Station Map',
    group: 'QMS & PRPs (ISO 9001 / FSSC)',
    standardRef: 'FSSC 22000 · ISO/TS 22002-1 Cl. 12',
    defaultSuffix: 'IPM-03',
    summary:
      'Pest prevention SOP, licensed contractor rules, non-toxic internal trap compliance, ILT UV placement, and device-by-device trend monitoring log.'
  },
  {
    id: 'haccp-team',
    orderCode: '04',
    shortTitle: 'Assemble HACCP Team',
    fullTitle: 'Codex Step 1: Assemble Multidisciplinary HACCP Team',
    group: 'Codex 12-Step HACCP',
    standardRef: 'Codex Step 1 · ISO 22000 Cl. 5.3.2',
    defaultSuffix: 'HCP-01',
    summary:
      'Appoint your Food Safety Team Leader (FSTL) and multidisciplinary HACCP team with qualifications, trainings, authorities, and meeting cadence.'
  },
  {
    id: 'product-description',
    orderCode: '05',
    shortTitle: 'Product Desc & Intended Use',
    fullTitle: 'Codex Steps 2–3: Product Description & Intended Use Specification',
    group: 'Codex 12-Step HACCP',
    standardRef: 'Codex Steps 2–3 · ISO 22000 Cl. 8.5.1.2–4',
    defaultSuffix: 'HCP-02',
    summary:
      'Document composition, intrinsic hurdles (pH, aw, Brix), processing, packaging, shelf-life, intended consumers, allergens, and expected mishandling.'
  },
  {
    id: 'flow-diagram',
    orderCode: '06',
    shortTitle: 'Flow Diagram & Verification',
    fullTitle: 'Codex Steps 4–5: Process Flow Diagram & On-Site Verification',
    group: 'Codex 12-Step HACCP',
    standardRef: 'Codex Steps 4–5 · ISO 22000 Cl. 8.5.1.5',
    defaultSuffix: 'HCP-03',
    summary:
      'Build an interactive step-by-step Process Flow Diagram with inputs, rework/waste loops, and vector PDF flowchart, plus live on-site walk-through verification records.'
  },
  {
    id: 'hazard-analysis',
    orderCode: '07',
    shortTitle: 'Hazard Analysis (Prod/Proc)',
    fullTitle: 'Codex Step 6: Hazard Analysis of Raw Materials & Process Steps',
    group: 'Codex 12-Step HACCP',
    standardRef: 'Codex Step 6 · ISO 22000 Cl. 8.5.2',
    defaultSuffix: 'HCP-04',
    summary:
      'Evaluate Biological, Chemical, Physical, Allergen, and Radiological hazards across materials and process steps with Likelihood × Severity risk scoring.'
  },
  {
    id: 'ccp-determination',
    orderCode: '08',
    shortTitle: 'CCP Determination (Tree)',
    fullTitle: 'Codex Step 7: Determination of Critical Control Points (Decision Tree)',
    group: 'Codex 12-Step HACCP',
    standardRef: 'Codex Step 7 · ISO 22000 Cl. 8.5.4.1',
    defaultSuffix: 'HCP-05',
    summary:
      'Apply the 4-question Codex Alimentarius CCP Decision Tree interactively to classify each significant hazard as CCP, OPRP, or PRP with full audit rationale.'
  },
  {
    id: 'critical-limits',
    orderCode: '09',
    shortTitle: 'Critical Control Limits',
    fullTitle: 'Codex Step 8: Determination & Validation of Critical Control Limits',
    group: 'Codex 12-Step HACCP',
    standardRef: 'Codex Step 8 · ISO 22000 Cl. 8.5.4.2',
    defaultSuffix: 'HCP-06',
    summary:
      'Establish scientifically validated numeric Critical Limits (CLs), early-warning operational targets, and regulatory references (Codex/PFA/FDA) for every CCP/OPRP.'
  },
  {
    id: 'monitoring-checklists',
    orderCode: '10',
    shortTitle: 'Monitoring Checklists Suite',
    fullTitle: 'Codex Step 9: Operational & CCP Monitoring Checklists',
    group: 'Monitoring, CAPA & Risk',
    standardRef: 'Codex Step 9 · ISO 22000 Cl. 8.5.4.3',
    defaultSuffix: 'MON-07',
    summary:
      'Customize and record live readings across Thermal CCP, Metal Detector, Cold Chain, Incoming Receiving, Pre-Op SSOP, and Personal Hygiene checklists.'
  },
  {
    id: 'corrective-actions',
    orderCode: '11',
    shortTitle: 'Corrective Actions Form',
    fullTitle: 'Codex Step 10 & ISO 9001: Non-Conformity & Corrective Action Form (CAR)',
    group: 'Monitoring, CAPA & Risk',
    standardRef: 'Codex Step 10 · ISO 9001 Cl. 10.2 · ISO 22000 Cl. 8.9',
    defaultSuffix: 'CAR-08',
    summary:
      'Document CCP deviations and audit non-conformities with immediate containment/disposition, 5-Why root cause analysis, corrective action plan, and closure verification.'
  },
  {
    id: 'verification-form',
    orderCode: '12',
    shortTitle: 'Verification & Audit Form',
    fullTitle: 'Codex Step 11: HACCP & FSMS Verification Schedule & Audit Record',
    group: 'Monitoring, CAPA & Risk',
    standardRef: 'Codex Step 11 · ISO 22000 Cl. 8.8 & 9.1',
    defaultSuffix: 'VER-09',
    summary:
      'Manage calibration traceability, internal audits, environmental/product lab testing, CCP log reviews, mock recall drills, and annual HACCP validation.'
  },
  {
    id: 'risk-assessment',
    orderCode: '13',
    shortTitle: 'Full Risk Assessment (ISO/FSSC)',
    fullTitle: 'Enterprise Risk & Opportunity Assessment (ISO 9001, FSSC, TACCP & VACCP)',
    group: 'Monitoring, CAPA & Risk',
    standardRef: 'ISO 9001 Cl. 6.1 · FSSC Cl. 2.5.3–2.5.4',
    defaultSuffix: 'RSK-10',
    summary:
      'Full 5×5 Inherent & Residual Risk Matrix covering ISO 9001 QMS operational risks, FSSC 22000 Food Safety Culture, TACCP Food Defense, and VACCP Food Fraud.'
  },
  {
    id: 'classic-templates',
    orderCode: '14',
    shortTitle: 'Quick Print Forms Library',
    fullTitle: 'Ready-to-Print Audit & Floor Forms (Classic Vault)',
    group: 'Classic Forms',
    standardRef: 'FSSC v7 · PFA · PSQCA · SFDA',
    defaultSuffix: 'FRM-11',
    summary:
      'One-click printable PDF and Excel/CSV audit worksheets for floor clipboards, allergen matrices, FSSC v7 checklists, and PFA inspection binders.'
  }
];

export function sanitizeDocPrefix(companyName: string): string {
  const words = companyName
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return 'FSP-QMS';
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function buildDefaultCompanyProfile(
  uid: string,
  userName?: string,
  userCompany?: string,
  userEmail?: string,
  userPhone?: string,
  userLocation?: string
): QaWorkspaceCompanyProfile {
  const company = userCompany?.trim() || 'Al-Meezan Food Processing Industries';
  const nowIso = new Date().toISOString().slice(0, 19) + 'Z';
  return {
    uid,
    ownerUid: uid,
    companyName: company,
    industryType: 'Food & Beverage Manufacturing',
    facilityAddress: userLocation?.trim() || 'Plot 14, Industrial Food Zone, Lahore, Pakistan',
    scopeStatement:
      'Receiving, Processing, Pasteurization, Packaging, Cold Storage, and Dispatch of Safe Food Products in compliance with ISO 9001:2015 and FSSC 22000.',
    standards: [
      'ISO 9001:2015',
      'FSSC 22000 v6/v7',
      'ISO 22000:2018',
      'Codex HACCP (CXC 1-1969)',
      'ISO/TS 22002-1 (PRPs)'
    ],
    docCodePrefix: sanitizeDocPrefix(company),
    pfaOrRegNo: 'PFA-LIC-2026-0418 / ISO-QFS-01',
    contactPhone: userPhone?.trim() || '+92 300 0000000',
    contactEmail: userEmail?.trim() || 'qa@companyfoodsafety.com',
    logoUrl: '',
    preparedBy: userName?.trim() || 'QA / Food Safety Manager',
    preparedRole: 'Food Safety Team Leader (FSTL)',
    reviewedBy: 'Production & Operations Manager',
    reviewedRole: 'Head of Manufacturing',
    approvedBy: 'Chief Executive / Plant Director',
    approvedRole: 'Top Management Representative',
    createdAt: nowIso,
    updatedAt: nowIso
  };
}

export function buildDefaultDocMeta(
  moduleId: keyof QaModulePayloadMap,
  prefix: string
): QaControlledDocMeta {
  const entry = QA_MODULE_CATALOG.find((m) => m.id === moduleId);
  const today = new Date().toISOString().slice(0, 10);
  return {
    docCode: `${prefix || 'QFS'}-${entry?.defaultSuffix || 'DOC-01'}`,
    revision: 'Rev 1.0',
    status: 'approved',
    effectiveDate: today,
    reviewCycle: 'Annual (Every 12 Months)',
    standardClause: entry?.standardRef || 'ISO 9001 / FSSC 22000',
    updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
  };
}

export function buildDefaultModulePayloads(
  companyName: string,
  qaLeadName: string
): QaModulePayloadMap {
  const today = new Date().toISOString().slice(0, 10);

  return {
    sops: {
      sops: [
        {
          id: 'sop-doc-ctrl',
          sopCode: 'SOP-QMS-01',
          title: 'Control of Documented Information & Quality Records',
          standardRef: 'ISO 9001:2015 Cl. 7.5 · ISO 22000 Cl. 7.5',
          department: 'Quality Assurance & Management',
          revision: 'Rev 1.0',
          status: 'approved',
          purpose:
            `To establish a standardized method at ${companyName} for creating, reviewing, approving, distributing, revising, and archiving controlled QMS/FSMS SOPs, HACCP plans, and floor logs.`,
          scope:
            'Applies to all internal policies, SOPs, work instructions, HACCP tables, monitoring forms, and external statutory regulations.',
          responsibilities:
            `QA Manager (${qaLeadName}) controls master register & issue stamps; Department Heads ensure point-of-use availability; Top Management approves policy-level revisions.`,
          procedureSteps: [
            '1. Every controlled document is assigned a unique code ([PREFIX]-[DEPT]-[NN]), revision number, and effective date.',
            '2. Draft documents undergo technical review by Process Owner and final approval by Top Management / FSTL prior to floor release.',
            '3. Only current "CONTROLLED COPY" documents are permitted at production stations; obsolete copies are stamped "OBSOLETE" or removed immediately.',
            '4. Quality & CCP monitoring records are retained for minimum Shelf-Life + 1 Year (minimum 3 years for audit trails) in legible, tamper-free binders or cloud backup.'
          ],
          recordsRequired: 'Master Document Control Register, Change Request Log, Distribution Sign-off Sheet.'
        },
        {
          id: 'sop-ssop',
          sopCode: 'SOP-PRP-02',
          title: 'Cleaning, Sanitation (SSOP) & Pre-Operational Line Release',
          standardRef: 'FSSC 22000 · ISO/TS 22002-1 Cl. 11',
          department: 'Sanitation & Production',
          revision: 'Rev 1.0',
          status: 'approved',
          purpose:
            'To prevent microbiological contamination, biofilm build-up, chemical residue, and allergen cross-contact on food contact surfaces (Zone 1) and processing environment.',
          scope:
            'All processing vessels, pipelines (CIP), filling nozzles, conveyors, slicing blades, drains, and cold rooms.',
          responsibilities:
            'Sanitation Supervisor executes cleaning per SSOP matrix; QA Officer verifies ATP / allergen swabs and signs Pre-Op Release prior to start-up.',
          procedureSteps: [
            '1. Dry Clean & Dismantle: Lock-out equipment, remove gross product debris, and cover sensitive electrical panels.',
            '2. Pre-Rinse: Flush lines with potable warm water (40–45°C) until effluent runs visually clear.',
            '3. Detergent Wash / CIP: Circulate 1.5% food-grade alkaline NaOH at 70–75°C for 20 mins (weekly 1.0% HNO3 acid cycle for scale removal).',
            '4. Final Potable Rinse & Sanitization: Rinse to neutral pH (6.8–7.4); sanitize with 200 ppm QAC or 100–200 ppm Peracetic Acid / NaOCl.',
            '5. Pre-Op Verification: QA performs visual inspection + ATP swab (< 150 RLU) and chemical strip test before granting Line Clearance.'
          ],
          recordsRequired: 'Daily SSOP Cleaning Log, CIP Chart Verification, ATP Swab Register.'
        },
        {
          id: 'sop-allergen',
          sopCode: 'SOP-PRP-03',
          title: 'Allergen Management, Scheduling & Label Control',
          standardRef: 'FSSC 22000 Add. Req. 2.5.6 · Codex CXC 1-1969',
          department: 'Production, R&D & QA',
          revision: 'Rev 1.0',
          status: 'approved',
          purpose:
            'To eliminate undeclared allergen cross-contact across storage, scheduling, rework, and finished product packaging.',
          scope:
            'All raw materials, shared lines, color-coded utensils, rework bins, and printed packaging artwork.',
          responsibilities:
            'Procurement verifies supplier allergen questionnaires; Planning schedules allergen-free runs first; QA conducts lateral flow swabbing and 2-person label verification.',
          procedureSteps: [
            '1. Segregation: Store allergenic ingredients on dedicated lower racks in sealed, labeled containers with dedicated blue/orange color-coded scoops.',
            '2. Scheduling: Sequence production from zero-allergen SKUs toward allergen-containing SKUs.',
            '3. Wet Changeover Validation: Execute full wet washdown followed by protein/allergen lateral flow swab (< 2.5–5 ppm LOD) before switching back to allergen-free SKU.',
            '4. Packaging Verification: Two independent staff scan packaging roll SKU & bold allergen statement prior to batch startup.'
          ],
          recordsRequired: 'Allergen Matrix, Line Changeover Clearance Log, Packaging Line Startup Check.'
        },
        {
          id: 'sop-hygiene-glass',
          sopCode: 'SOP-PRP-04',
          title: 'Personal Hygiene, Illness Reporting & Glass/Brittle Plastic Control',
          standardRef: 'ISO/TS 22002-1 Cl. 10.4 & Cl. 13',
          department: 'HR, QA & All Production Staff',
          revision: 'Rev 1.0',
          status: 'approved',
          purpose:
            'To enforce food-handler health fitness, protective workwear, and zero physical foreign-body contamination from glass or brittle plastics.',
          scope:
            'All permanent, temporary, maintenance staff, and plant visitors entering high-care or processing zones.',
          responsibilities:
            'HR maintains 6-monthly medical fitness cards; Shift Supervisors check handwashing & jewelry absence; QA audits the Glass & Brittle Plastic Register weekly.',
          procedureSteps: [
            '1. Health Screening: Food handlers undergo 6-monthly medical exams (Typhoid, Hepatitis A/B, skin/respiratory fitness) and report diarrhea, fever, or infected wounds immediately.',
            '2. Gowning & Handwashing: Clean hairnets, beard snoods, pocketless coats, captive footwear, and 20-second soap + sanitizer wash before entry and after breaks.',
            '3. Glass/Brittle Plastic Ban: No glass bottles, wristwatches, pins, or brittle stationery allowed in open food zones; essential gauges are shatterproof-shielded and logged on the Glass Register.',
            '4. Breakage Protocol: If glass breaks, halt line immediately, quarantine all exposed product within 3 m radius, inspect fragments (100% puzzle reconstruction), and clean with QA sign-off.'
          ],
          recordsRequired: 'Visitor Health Declaration, Daily Hygiene Check, Weekly Glass & Brittle Plastic Audit Register.'
        },
        {
          id: 'sop-recall',
          sopCode: 'SOP-FSMS-05',
          title: 'Product Traceability, Mock Recall & Crisis Withdrawal',
          standardRef: 'ISO 22000 Cl. 8.3 & 8.9.5 · ISO 9001 Cl. 8.5.2',
          department: 'QA, Warehouse & Logistics',
          revision: 'Rev 1.0',
          status: 'approved',
          purpose:
            'To guarantee 100% one-step-back and one-step-forward lot traceability and execute product recall/withdrawal within 4 hours.',
          scope:
            'All incoming raw material lots, packaging batches, WIP/rework, and finished goods dispatched to distributors.',
          responsibilities:
            'Recall Coordinator (FSTL) chairs Crisis Team; Warehouse provides dispatch invoices; Regulatory Lead notifies Food Authority (PFA/PSQCA) if Class I safety hazard occurs.',
          procedureSteps: [
            '1. Lot Coding: Assign unique Batch/Lot ID linking Raw Material GRN -> Mixing/Processing Batch Sheet -> Finished Product Best-Before Date -> Dispatch Note.',
            '2. Recall Trigger: Upon confirmed CCP breach post-dispatch, Class I allergen error, or regulatory alert, convene Crisis Team within 30 minutes.',
            '3. Mass Balance & Quarantine: Reconcile total produced qty vs warehouse stock vs customer shipments (Target: 98–102% accountability within <= 4 hours).',
            '4. Annual Mock Recall: Conduct at least 1 unannounced forward & backward mock recall test annually and document timing and gaps.'
          ],
          recordsRequired: 'Batch Traceability Tree, Annual Mock Recall Report & Mass Balance Sheet.'
        }
      ]
    },

    'approved-supplier': {
      policyObjective:
        `${companyName} procures raw materials, food-contact packaging, and food-grade lubricants exclusively from approved suppliers evaluated on food safety risk, statutory compliance, and quality consistency (ISO 9001 Cl. 8.4 & FSSC 22000 Cl. 7.1.6).`,
      selectionProcedure:
        'High-Risk suppliers (dairy, meat, spices, food-contact primary film) require GFSI certification (FSSC/BRCGS/SQF) or annual on-site QA audit plus Halal compliance certificate. Medium-Risk suppliers undergo self-assessment questionnaire + lab COA trial.',
      incomingCoaRule:
        'Every incoming shipment must arrive with intact tamper-evident truck seals, clean vehicle condition, and lot-specific Certificate of Analysis (COA) matching specification limits prior to QA release.',
      reEvaluationCriteria:
        'Suppliers are re-scored annually based on On-Time Delivery (25%), Incoming COA Defect Rate (40%), CAPA Responsiveness (20%), and Audit/Cert Validity (15%). Score < 70% triggers Conditional Probation or Removal.',
      suppliers: [
        {
          id: 'sup-1',
          supplierName: 'Al-Noor Dairy & Milk Powders Ltd.',
          materialSupplied: 'Skim Milk Powder (SMP) & Cream',
          riskTier: 'High',
          certifications: 'FSSC 22000 v6 · PS 3733 Halal',
          certExpiry: '2027-06-30',
          auditMethod: 'Annual On-Site Audit + COA',
          auditScorePct: 94,
          coaParameters: 'Moisture <= 4.0%, Protein >= 34%, Aflatoxin M1 < 0.05 ppb, Antibiotics Negative',
          approvalStatus: 'Approved',
          nextEvaluationDate: '2027-03-15'
        },
        {
          id: 'sup-2',
          supplierName: 'Crescent Flexible Packaging Corp.',
          materialSupplied: 'Food-Grade Multi-Layer LDPE / Foil Pouches',
          riskTier: 'Medium',
          certifications: 'BRCGS Packaging Issue 6 · ISO 9001',
          certExpiry: '2027-04-20',
          auditMethod: 'Certificate Review + Migration COA',
          auditScorePct: 91,
          coaParameters: 'Overall Migration < 10 mg/dm2 (EU 10/2011), Seal Strength >= 2.5 N/15mm',
          approvalStatus: 'Approved',
          nextEvaluationDate: '2027-02-01'
        },
        {
          id: 'sup-3',
          supplierName: 'Indus Refined Cane Sugars',
          materialSupplied: 'Beverage-Grade Refined White Sugar (< 45 IU)',
          riskTier: 'Medium',
          certifications: 'ISO 22000:2018 · Halal',
          certExpiry: '2027-08-10',
          auditMethod: 'Annual Questionnaire + Lab Lot Check',
          auditScorePct: 88,
          coaParameters: 'ICUMSA <= 45 IU, Polarization >= 99.8 deg Z, Moisture <= 0.04%, SO2 <= 10 ppm',
          approvalStatus: 'Approved',
          nextEvaluationDate: '2027-05-01'
        }
      ]
    },

    'pest-management': {
      contractorName: 'SafeGuard Industrial IPM Services (Licensed)',
      contractorLicenseNo: 'IPM-ENV-LIC-8824',
      procedureSummary:
        `${companyName} maintains a proactive Integrated Pest Management (IPM) program prioritizing structural exclusion (door sweeps <= 6 mm, air curtains, self-closing doors), sanitation discipline, and non-chemical internal monitoring per ISO/TS 22002-1 Clause 12.`,
      chemicalControlRule:
        'ZERO toxic rodenticide bait blocks are permitted inside processing or warehouse buildings. External perimeter stations use locked, anchored, tamper-resistant bait blocks. All approved chemicals require current SDS/MSDS and are applied only by certified technicians during non-production hours.',
      trendReviewRule:
        'Pest activity counts are graphed monthly; >= 2 rodent captures in any zone or spike in flying insect counts triggers immediate root cause investigation, structural sealing, and CAR issuance.',
      devices: [
        {
          id: 'pest-1',
          deviceCode: 'EXT-RBS-01 to 18',
          zoneLocation: 'External Factory Fence & Boundary Wall (Every 15 m)',
          deviceType: 'External Tamper-Resistant Bait Station',
          targetPest: 'Norway Rat / House Mouse',
          inspectionFrequency: 'Bi-Weekly (Every 14 Days)',
          lastActivityCount: 0,
          thresholdTrigger: '> 10% Bait Consumption or Droppings',
          correctiveActionNote: 'Inspect perimeter fence openings & vegetation clearance (1 m gravel strip)'
        },
        {
          id: 'pest-2',
          deviceCode: 'INT-MECH-01 to 12',
          zoneLocation: 'Raw Material & Finished Goods Warehouse Doors (Interior)',
          deviceType: 'Internal Mechanical Trap / Glue Board',
          targetPest: 'Rodents / Crawling Insects',
          inspectionFrequency: 'Weekly',
          lastActivityCount: 0,
          thresholdTrigger: '1 Capture = Immediate Alert',
          correctiveActionNote: 'Audit dock leveler rubber seals & inspect incoming pallets'
        },
        {
          id: 'pest-3',
          deviceCode: 'ILT-UV-01 to 08',
          zoneLocation: 'Production Entry Airlocks & Packaging Hall (Away from open line)',
          deviceType: 'Insect Light Trap (ILT / Shatterproof UV)',
          targetPest: 'Flies, Moths & Flying Insects',
          inspectionFrequency: 'Weekly Catch Count + Annual UV Tube Change',
          lastActivityCount: 2,
          thresholdTrigger: '> 10 Insects/Trap/Week',
          correctiveActionNote: 'Verify air curtain RPM & door auto-closer spring tension'
        }
      ]
    },

    'haccp-team': {
      teamCharterStatement:
        `Top Management of ${companyName} formally appoints the following multidisciplinary Food Safety & HACCP Team with full authority to establish, implement, validate, verify, and update the HACCP Plan, PRPs, and OPRPs in accordance with Codex CXC 1-1969 Step 1 and ISO 22000:2018 Clause 5.3.2.`,
      meetingFrequency: 'Monthly Food Safety Review + Immediate Emergency Convening upon CCP Deviation or Product/Process Change',
      externalConsultants: 'Food Science Portal Advisory Reference / Accredited ISO 17025 Testing Lab (for external validation)',
      members: [
        {
          id: 'tm-1',
          fullName: qaLeadName,
          designation: 'QA / Food Safety Manager',
          department: 'Quality Assurance',
          haccpRole: 'Food Safety Team Leader (FSTL)',
          qualificationAndExp: 'M.Sc. / B.Sc. (Hons.) Food Science & Technology · 6+ Yrs',
          trainingCredentials: 'HACCP Level 4 · FSSC 22000 Lead Auditor',
          assignedResponsibilities:
            'Chairs HACCP meetings, maintains study revisions, verifies CCP logs, leads internal audits & recall drills, reports FSMS performance to Top Management.'
        },
        {
          id: 'tm-2',
          fullName: 'Production Operations Lead',
          designation: 'Production Manager',
          department: 'Manufacturing',
          haccpRole: 'Production Lead',
          qualificationAndExp: 'B.Sc. Food Engineering / Dairy Tech · 5+ Yrs',
          trainingCredentials: 'HACCP Level 3 · GMP & Line Hygiene',
          assignedResponsibilities:
            'Ensures line adherence to process flow, critical limit monitoring by operators, immediate containment on CCP failure, and rework segregation.'
        },
        {
          id: 'tm-3',
          fullName: 'Plant Utilities & Maintenance Lead',
          designation: 'Chief Maintenance Engineer',
          department: 'Engineering',
          haccpRole: 'Engineering & Maintenance',
          qualificationAndExp: 'B.E. Mechanical / Electrical · 7+ Yrs',
          trainingCredentials: 'ISO/TS 22002-1 Hygienic Design & Calibration',
          assignedResponsibilities:
            'Manages preventive maintenance, calibration of CCP sensors/flow diversion valves, food-grade H1 lubrication, and sanitary welding.'
        },
        {
          id: 'tm-4',
          fullName: 'Lab & Microbiologist',
          designation: 'Senior QC Microbiologist',
          department: 'QC Laboratory',
          haccpRole: 'Microbiology / Lab Analyst',
          qualificationAndExp: 'M.Phil. Microbiology / Food Science · 4+ Yrs',
          trainingCredentials: 'ISO/IEC 17025 Lab Practices & Pathogen Verification',
          assignedResponsibilities:
            'Conducts raw material/finished product pathogen testing, ATP/environmental Listeria swabbing, water potability checks, and shelf-life validation.'
        }
      ]
    },

    'product-description': {
      products: [
        {
          id: 'prod-1',
          productCode: 'SKU-01',
          productName: 'Standardized Pasteurized / Processed Food Product (Primary Line)',
          productCategory: 'Ready-to-Consume / Refrigerated or Shelf-Stable Food',
          rawMaterialsAndIngredients:
            'Primary Base Ingredient (Milk / Fruit Pulp / Flour), Potable Treated Water, Food-Grade Sugar/Salt, Approved Stabilizers/Cultures, Food-Grade Packaging Film.',
          intrinsicCharacteristics:
            'Pasteurized Dairy: pH 6.6–6.8, aw >= 0.99 (TCS Refrigerated) | OR High-Acid Beverage: pH <= 4.1, Brix 12–15°.',
          processingMethod:
            'Filtration -> Standardization -> Thermal Heat Treatment (HTST >= 72°C / 15s or >= 85°C Hot-Fill) -> Rapid Cooling -> Aseptic/Hygienic Filling -> Metal Detection.',
          packagingMaterial:
            'Food-grade virgin HDPE bottle / multi-layer laminated carton / LDPE barrier pouch compliant with EU 10/2011 & FDA 21 CFR 177.',
          shelfLifeAndStorage:
            'Chilled: 7–14 Days strictly at <= 4°C (or Ambient Dry <= 25°C / 65% RH for shelf-stable dry goods).',
          distributionMethod:
            'Insulated / Refrigerated GPS temperature-monitored distribution vehicles (<= 4°C for chilled; clean dry enclosed trucks for ambient).',
          intendedUse:
            'Ready-to-consume directly after opening without additional cooking step by consumer.',
          targetConsumerGroup:
            'General public, families, school-age children, and retail foodservice buyers.',
          vulnerableGroupsWarning:
            'Suitable for general consumers; NOT formulated as infant formula (< 12 months). Strict cold chain critical for elderly, pregnant & immunocompromised consumers.',
          allergenDeclaration:
            'Contains: Milk (Lactose/Casein) [Edit per actual SKU: Gluten / Soy / Tree Nuts / Sesame]. Bold allergen box printed on label.',
          labelingAndRegulatoryStandard:
            'PFA Pure Food Regulations 2018, PSQCA Standard, Codex CXS 1-1985 (Batch #, Mfg/Exp Date, Net Wt, Storage Temp, Nutrition Facts, Halal Mark).',
          expectedMishandling:
            'Potential temperature abuse (> 8°C) during retail display or leaving opened container unrefrigerated > 2 hours. Mitigated via clear "Keep Refrigerated <= 4°C & Consume within 48h of opening" label warning.'
        }
      ]
    },

    'flow-diagram': {
      processTitle: `${companyName} — End-to-End Manufacturing Process Flow`,
      scopeBoundary: 'From Raw Material Receiving Gate through Processing, Critical Control Points, Packaging, and Finished Dispatch.',
      steps: [
        {
          id: 'step-1',
          stepNumber: 1,
          stepName: 'Raw Material & Packaging Receiving (GRN)',
          stepCategory: 'Receiving',
          inputsAndIngredients: 'Raw ingredients, COAs, primary packaging',
          wastesAndRework: 'Rejected off-spec lots returned/quarantined',
          equipmentAndParams: 'Weighbridge, calibrated probe, COA check (Temp <= 4°C chilled)',
          controlClassification: 'PRP'
        },
        {
          id: 'step-2',
          stepNumber: 2,
          stepName: 'Dry & Chilled Cold Storage',
          stepCategory: 'Storage',
          inputsAndIngredients: 'Approved raw & packaging stock (FIFO/FEFO)',
          wastesAndRework: 'Damaged cartons segregated',
          equipmentAndParams: 'Dry Store <= 25°C / <65% RH; Chiller 0–4°C',
          controlClassification: 'PRP'
        },
        {
          id: 'step-3',
          stepNumber: 3,
          stepName: 'Filtration, Sieving & Batch Formulation',
          stepCategory: 'Preparation',
          inputsAndIngredients: 'Weighed ingredients, treated potable water',
          wastesAndRework: 'Filter residue disposed; tracked rework <= 2%',
          equipmentAndParams: 'Duplex mesh filter (100 mesh / <= 1.0 mm), mixing tank',
          controlClassification: 'OPRP'
        },
        {
          id: 'step-4',
          stepNumber: 4,
          stepName: 'Thermal Processing / Pasteurization (Kill Step)',
          stepCategory: 'Processing / Kill Step',
          inputsAndIngredients: 'Standardized product mix',
          wastesAndRework: 'Auto-diverted under-pasteurized stream to balance tank',
          equipmentAndParams: 'HTST Plate Heat Exchanger >= 72.0°C for >= 15 sec + FDV',
          controlClassification: 'CCP'
        },
        {
          id: 'step-5',
          stepNumber: 5,
          stepName: 'Hygienic Filling, Sealing & Batch Coding',
          stepCategory: 'Packaging',
          inputsAndIngredients: 'Pasteurized product + sanitized packs/caps',
          wastesAndRework: 'Leaker/underweight packs rejected',
          equipmentAndParams: 'HEPA/laminar filler, ink-jet Batch & Exp coder',
          controlClassification: 'OPRP'
        },
        {
          id: 'step-6',
          stepNumber: 6,
          stepName: 'Inline Metal Detection & Foreign Body Check',
          stepCategory: 'Inspection / CCP',
          inputsAndIngredients: 'Sealed finished packs',
          wastesAndRework: 'Locked red reject bin -> QA investigation',
          equipmentAndParams: 'Metal Detector: Fe <= 1.5 mm, Non-Fe <= 2.0 mm, SS <= 2.5 mm',
          controlClassification: 'CCP'
        },
        {
          id: 'step-7',
          stepNumber: 7,
          stepName: 'Finished Cold Storage & Refrigerated Dispatch',
          stepCategory: 'Dispatch',
          inputsAndIngredients: 'QA Released Pallet Lots',
          wastesAndRework: 'Traceability dispatch manifest',
          equipmentAndParams: 'Pre-cooled reefer trucks <= 4°C, seal # logged',
          controlClassification: 'PRP'
        }
      ],
      verifications: [
        {
          id: 'fv-1',
          verificationDate: today,
          lineAndShift: 'Line 01 — Morning Shift (Live Production Run)',
          checkedDuringLiveRun: 'Yes',
          deviationsObserved: 'All 7 process steps, rework return loop, and drain/airlock boundaries matched live floor piping & conveyor layout.',
          diagramCorrectionsMade: 'Confirmed duplex mesh size (100 mesh) and reject bin lock active.',
          verifiedBy: qaLeadName,
          fstlApproval: `Verified & Signed — ${qaLeadName}`
        }
      ]
    },

    'hazard-analysis': {
      methodologyNote:
        'Risk Score = Likelihood (1–5) × Severity (1–5). Scale: 1–4 Low (PRP), 5–8 Medium (PRP/OPRP), 9–25 Significant High Risk (Requires CCP or OPRP assessment via Codex Decision Tree).',
      significanceThreshold: 9,
      rows: [
        {
          id: 'ha-1',
          stepOrMaterial: 'Step 1: Raw Milk / Liquid Ingredient Receiving',
          hazardCategory: 'Chemical',
          hazardDescription: 'Aflatoxin M1 (> 0.5 ppb) or Veterinary Antibiotic / Pesticide Residues',
          causeOrSource: 'Contaminated farm feed or non-withdrawal veterinary treatment',
          likelihood: 3,
          severity: 4,
          justification: 'Score 12 (Significant): Heat-stable toxins cannot be destroyed by downstream pasteurization.',
          controlMeasures: 'Approved Supplier Program + Mandatory Batch COA & Rapid ELISA/Strip Test prior to unloading.',
          appliedProgram: 'OPRP'
        },
        {
          id: 'ha-2',
          stepOrMaterial: 'Step 3: Filtration & Sieving',
          hazardCategory: 'Physical',
          hazardDescription: 'Coarse stones, fibers, gasket fragments (> 1.0 mm)',
          causeOrSource: 'Raw agricultural debris or wear of pump seals',
          likelihood: 3,
          severity: 3,
          justification: 'Score 9 (Significant): Physical injury risk if mesh tears.',
          controlMeasures: '100-mesh stainless steel strainer inspected pre-op & post-op (OPRP).',
          appliedProgram: 'OPRP'
        },
        {
          id: 'ha-3',
          stepOrMaterial: 'Step 4: Thermal Pasteurization / Cooking',
          hazardCategory: 'Biological',
          hazardDescription: 'Survival of vegetative pathogens (Salmonella, Listeria monocytogenes, E. coli O157:H7, Coxiella)',
          causeOrSource: 'Insufficient pasteurization temperature or holding time failure',
          likelihood: 3,
          severity: 5,
          justification: 'Score 15 (Critical/Significant): Pathogens cause severe foodborne illness if kill step fails.',
          controlMeasures: 'Automated HTST temperature/flow control with calibrated RTD & automatic Flow Diversion Valve (CCP-1).',
          appliedProgram: 'CCP'
        },
        {
          id: 'ha-4',
          stepOrMaterial: 'Step 5: Filling & Packaging Coding',
          hazardCategory: 'Allergen',
          hazardDescription: 'Undeclared allergen due to wrong packaging roll or incomplete changeover wash',
          causeOrSource: 'Operator loading incorrect film or residual allergen in filler hopper',
          likelihood: 2,
          severity: 5,
          justification: 'Score 10 (Significant): Severe anaphylaxis risk for allergic consumers.',
          controlMeasures: 'Wet changeover allergen LFD swab + Dual-person barcode/artwork verification before run.',
          appliedProgram: 'OPRP'
        },
        {
          id: 'ha-5',
          stepOrMaterial: 'Step 6: Inline Metal Detection',
          hazardCategory: 'Physical',
          hazardDescription: 'Ferrous, Non-Ferrous, or Stainless Steel metal fragments (> 1.5–2.5 mm)',
          causeOrSource: 'Wear or breakage of homogenizer/mixer blades, sieves, or maintenance hardware',
          likelihood: 3,
          severity: 5,
          justification: 'Score 15 (Significant): Sharp metal causes internal laceration/choking; final physical barrier.',
          controlMeasures: '100% inline calibrated Metal Detector with automatic pneumatic pusher & locked reject bin (CCP-2).',
          appliedProgram: 'CCP'
        }
      ]
    },

    'ccp-determination': {
      decisionTreeStandard: 'Codex Alimentarius CXC 1-1969 (4-Question CCP Decision Tree)',
      rows: [
        {
          id: 'ccp-dt-1',
          stepName: 'Step 1: Raw Material Receiving (Antibiotic/Aflatoxin)',
          significantHazard: 'Chemical: Aflatoxin M1 / Drug Residues',
          q1ControlMeasureExists: 'Yes',
          q2DesignedToEliminate: 'No',
          q3ContaminationCouldIncrease: 'No',
          q4SubsequentStepEliminates: 'No',
          classification: 'OPRP',
          ccpNumber: 'OPRP-1',
          decisionRationale: 'Incoming screening controls acceptance, managed via OPRP & Approved Supplier Program.'
        },
        {
          id: 'ccp-dt-2',
          stepName: 'Step 4: Thermal Pasteurization / Heat Treatment',
          significantHazard: 'Biological: Salmonella, Listeria, Coxiella survival',
          q1ControlMeasureExists: 'Yes',
          q2DesignedToEliminate: 'Yes',
          q3ContaminationCouldIncrease: 'Yes',
          q4SubsequentStepEliminates: 'No',
          classification: 'CCP',
          ccpNumber: 'CCP-1',
          decisionRationale: 'Q2 = Yes: Step is specifically engineered as the thermal pathogen kill step with no subsequent thermal kill.'
        },
        {
          id: 'ccp-dt-3',
          stepName: 'Step 5: Allergen Label & Artwork Check',
          significantHazard: 'Allergen: Undeclared Milk/Gluten/Nut',
          q1ControlMeasureExists: 'Yes',
          q2DesignedToEliminate: 'No',
          q3ContaminationCouldIncrease: 'No',
          q4SubsequentStepEliminates: 'No',
          classification: 'OPRP',
          ccpNumber: 'OPRP-2',
          decisionRationale: 'Prevented by validated SSOP cleaning + dual-person packaging verification (OPRP).'
        },
        {
          id: 'ccp-dt-4',
          stepName: 'Step 6: Inline Metal Detection',
          significantHazard: 'Physical: Fe / Non-Fe / SS 316 Metal Fragments',
          q1ControlMeasureExists: 'Yes',
          q2DesignedToEliminate: 'Yes',
          q3ContaminationCouldIncrease: 'No',
          q4SubsequentStepEliminates: 'No',
          classification: 'CCP',
          ccpNumber: 'CCP-2',
          decisionRationale: 'Q2 = Yes: Dedicated last-line step designed to detect and reject metallic foreign bodies.'
        }
      ]
    },

    'critical-limits': {
      validationPolicy:
        'Critical Limits are based on Codex, FDA Pasteurized Milk Ordinance / Thermal rules, and PFA standards. Operational Targets include a safety buffer so operators intervene BEFORE breaching a statutory Critical Limit.',
      rows: [
        {
          id: 'cl-1',
          ccpOrOprpNumber: 'CCP-1',
          processStep: 'Thermal Pasteurization (HTST)',
          hazardControlled: 'Vegetative Pathogens (Salmonella, Listeria, Coxiella)',
          criticalLimit: 'Temp >= 72.0°C for >= 15.0 sec; FDV Auto-Divert active below 72.0°C',
          operationalTarget: 'Target 74.5°C +/- 1.0°C (Alert at 73.0°C)',
          scientificValidationBasis: 'Codex CXC 57-2004 / US FDA PMO Grade "A" (>= 6D pathogen log reduction)',
          validationEvidenceRef: 'Annual Holding Tube Salt-Test Report + ISO 17025 RTD Calibration Cert'
        },
        {
          id: 'cl-2',
          ccpOrOprpNumber: 'CCP-2',
          processStep: 'Inline Metal Detection',
          hazardControlled: 'Physical Metal Contamination (Fe, Non-Fe, SS 316)',
          criticalLimit: '100% auto-rejection of Fe 1.5 mm, Non-Fe 2.0 mm, SS 316 2.5 mm certified wands',
          operationalTarget: 'Zero reject-bin jam; air pressure >= 5.5 bar; hourly wand verification',
          scientificValidationBasis: 'GFSI / BRCGS / FSSC 22000 Foreign Body Control Best Practice',
          validationEvidenceRef: 'OEM Metal Detector Annual Sensitivity Certificate + Daily Test Wand Log'
        },
        {
          id: 'cl-3',
          ccpOrOprpNumber: 'OPRP-1',
          processStep: 'Raw Material Receiving Screening',
          hazardControlled: 'Aflatoxin M1 & Antibiotic Residues',
          criticalLimit: 'Aflatoxin M1 <= 0.50 ppb (EU <= 0.05 ppb); Antibiotics Negative; Temp <= 4.0°C',
          operationalTarget: 'Reject tanker immediately if temp > 5.0°C or rapid strip Positive',
          scientificValidationBasis: 'PFA Pure Food Regs 2018 & Codex CXS 193-1995',
          validationEvidenceRef: 'ELISA Validation Protocol & Incoming Lab Register'
        }
      ]
    },

    'monitoring-checklists': {
      checklists: [
        {
          id: 'chk-thermal',
          checklistCode: 'CHK-CCP-01',
          title: 'Thermal Pasteurization / Cooking CCP Monitoring Log',
          standardRef: 'Codex Step 9 · ISO 22000 Cl. 8.5.4.3',
          monitoringDate: today,
          shift: 'Shift A (Morning)',
          lineOrArea: 'Pasteurizer Line 01',
          items: [
            {
              id: 'ti-1',
              checkpointName: 'Flow Diversion Valve (FDV) Cut-in / Cut-out Challenge at Start-up',
              frequency: 'Daily Pre-Startup',
              acceptableLimit: 'Diverts at <= 72.0°C; Forward flow >= 72.2°C',
              actualReading: 'Diverted at 71.9°C / Forward 72.4°C',
              status: 'Pass',
              operatorInitials: 'OP-A',
              remarks: 'Chart recorder synced'
            },
            {
              id: 'ti-2',
              checkpointName: 'Pasteurization Holding Temperature (Hourly Check)',
              frequency: 'Continuous Chart + Hourly Log',
              acceptableLimit: '>= 72.0°C (Target 74.5°C)',
              actualReading: '74.8°C',
              status: 'Pass',
              operatorInitials: 'OP-A',
              remarks: 'Nominal steady run'
            },
            {
              id: 'ti-3',
              checkpointName: 'Chilled Outlet Temperature post-Regeneration/Cooling',
              frequency: 'Hourly',
              acceptableLimit: '<= 4.0°C',
              actualReading: '3.4°C',
              status: 'Pass',
              operatorInitials: 'OP-A',
              remarks: 'Glycol loop stable'
            }
          ]
        },
        {
          id: 'chk-metal',
          checklistCode: 'CHK-CCP-02',
          title: 'Metal Detector & Reject Mechanism Hourly Verification Log',
          standardRef: 'FSSC 22000 · Codex Step 9',
          monitoringDate: today,
          shift: 'Shift A (Morning)',
          lineOrArea: 'Packaging Line End',
          items: [
            {
              id: 'mi-1',
              checkpointName: 'Ferrous (Fe 1.5 mm) Certified Test Wand Rejection',
              frequency: 'Startup + Hourly + After Stoppage',
              acceptableLimit: 'Rejected to locked bin (100%)',
              actualReading: 'Rejected smoothly (Conveyor Pusher)',
              status: 'Pass',
              operatorInitials: 'OP-B',
              remarks: 'Bin lock intact'
            },
            {
              id: 'mi-2',
              checkpointName: 'Non-Ferrous (2.0 mm Brass) Test Wand Rejection',
              frequency: 'Startup + Hourly',
              acceptableLimit: 'Rejected to locked bin (100%)',
              actualReading: 'Rejected cleanly',
              status: 'Pass',
              operatorInitials: 'OP-B',
              remarks: 'Line speed nominal'
            },
            {
              id: 'mi-3',
              checkpointName: 'Stainless Steel (SS 316 2.5 mm) Test Wand Rejection',
              frequency: 'Startup + Hourly',
              acceptableLimit: 'Rejected to locked bin (100%)',
              actualReading: 'Rejected cleanly',
              status: 'Pass',
              operatorInitials: 'OP-B',
              remarks: 'Confirmed fail-safe sensor'
            }
          ]
        },
        {
          id: 'chk-cold',
          checklistCode: 'CHK-PRP-03',
          title: 'Cold Storage, Chiller & Freezer Temperature Checklist',
          standardRef: 'ISO/TS 22002-1 Cl. 16',
          monitoringDate: today,
          shift: 'All Shifts (4-Hourly)',
          lineOrArea: 'Chiller 01 & Deep Freezer 02',
          items: [
            {
              id: 'ci-1',
              checkpointName: 'Finished Goods Chiller Room 01',
              frequency: 'Every 4 Hours',
              acceptableLimit: '0.0°C to +4.0°C',
              actualReading: '2.8°C',
              status: 'Pass',
              operatorInitials: 'WH-1',
              remarks: 'Door curtain closed properly'
            },
            {
              id: 'ci-2',
              checkpointName: 'Frozen Ingredients Deep Freezer 02',
              frequency: 'Every 4 Hours',
              acceptableLimit: '<= -18.0°C',
              actualReading: '-20.2°C',
              status: 'Pass',
              operatorInitials: 'WH-1',
              remarks: 'Zero ice frost buildup'
            }
          ]
        },
        {
          id: 'chk-hygiene',
          checklistCode: 'CHK-PRP-04',
          title: 'Pre-Op Sanitation (SSOP) & Personal Hygiene Floor Checklist',
          standardRef: 'ISO/TS 22002-1 Cl. 11 & 13',
          monitoringDate: today,
          shift: 'Pre-Startup Inspection',
          lineOrArea: 'Processing Hall & Packaging Zone',
          items: [
            {
              id: 'hi-1',
              checkpointName: 'Zone 1 Food Contact Surfaces (ATP Bioluminescence)',
              frequency: 'Daily Pre-Op',
              acceptableLimit: 'ATP < 150 RLU; zero visible soil',
              actualReading: '42 RLU',
              status: 'Pass',
              operatorInitials: 'QA-1',
              remarks: 'Line cleared for startup'
            },
            {
              id: 'hi-2',
              checkpointName: 'Sanitizer Dip / Rinse Concentration Check',
              frequency: 'Pre-Op & Every 4 Hours',
              acceptableLimit: 'QAC 200–400 ppm / NaOCl 100–200 ppm',
              actualReading: '220 ppm QAC',
              status: 'Pass',
              operatorInitials: 'QA-1',
              remarks: 'Verified via strip test'
            },
            {
              id: 'hi-3',
              checkpointName: 'Staff Gowning, Hairnets, Clean Nails, Zero Jewelry',
              frequency: 'Shift Start',
              acceptableLimit: '100% staff compliant',
              actualReading: '24/24 staff compliant',
              status: 'Pass',
              operatorInitials: 'QA-1',
              remarks: 'No illness reported'
            }
          ]
        }
      ]
    },

    'corrective-actions': {
      holdAndReleaseProcedure:
        'When a CCP limit or ISO 9001 requirement is breached: (1) Immediately stop or divert product, (2) Segregate and tag all product since last verified Pass check as "ON HOLD — DO NOT DISPATCH", (3) Perform 5-Why Root Cause Analysis, (4) Implement permanent Corrective Action, and (5) Verify effectiveness before closing CAR.',
      records: [
        {
          id: 'car-1',
          carNumber: 'CAR-2026-001',
          dateRaised: today,
          source: 'CCP Deviation',
          affectedProductBatch: 'BATCH-2611-A (140 Liters)',
          quantityHeld: '140 L (Diverted Automatically)',
          deviationDescription:
            'Pasteurizer inlet steam valve fluctuation caused brief temp dip from 74.5°C to 71.8°C at 10:15 AM; FDV automatically diverted stream.',
          immediateCorrection:
            'Held balance tank contents; cleaned steam trap strainer; re-pasteurized full volume once >= 74.5°C stabilized.',
          productDisposition: 'Reprocess',
          rootCause5Why:
            '1. Temp dropped -> 2. Steam pressure fell -> 3. Steam trap strainer partially clogged with boiler scale -> 4. Quarterly descaling PM overdue by 5 days.',
          correctiveActionPlan:
            'Added weekly boiler condensate strainer blow-down & automated low-steam pre-alarm at 73.2°C before CCP threshold.',
          responsiblePerson: 'Chief Maintenance Engineer',
          targetDate: today,
          effectivenessVerification:
            '3 consecutive production runs monitored with zero pressure dips (< 0.2°C variance). Micro swab & SPC compliant.',
          status: 'Closed'
        }
      ]
    },

    'verification-form': {
      verificationObjective:
        'Objective confirmation that PRPs, OPRPs, HACCP Critical Limits, Instrument Calibrations, and ISO 9001 Quality Objectives are operating effectively in practice (ISO 22000 Cl. 8.8 & 9.1).',
      rows: [
        {
          id: 'ver-1',
          activityName: 'CCP Thermometers, RTDs & Metal Detector Wands Calibration',
          standardClause: 'ISO 9001 Cl. 7.1.5 · ISO 22000 Cl. 8.7',
          frequency: 'Annual External ISO 17025 + Weekly Ice-Point Check',
          methodAndCriteria: 'Traceable reference comparison (Tolerance +/- 0.3°C)',
          lastVerifiedDate: today,
          actualFinding: 'All 4 CCP RTDs within +/- 0.15°C; certs filed',
          verificationStatus: 'Conforming',
          nextDueDate: '2027-11-01',
          verifierName: qaLeadName
        },
        {
          id: 'ver-2',
          activityName: 'Daily CCP Record Review & Trend Audit',
          standardClause: 'Codex Step 11 · ISO 22000 Cl. 8.8',
          frequency: 'Daily (Within 24 Hours by QA Lead)',
          methodAndCriteria: '100% review of operator readings, chart printouts & hold tags',
          lastVerifiedDate: today,
          actualFinding: 'All hourly readings recorded numerically; FDV test signed',
          verificationStatus: 'Conforming',
          nextDueDate: today,
          verifierName: qaLeadName
        },
        {
          id: 'ver-3',
          activityName: 'Finished Product Pathogen & Environmental Listeria Swabbing',
          standardClause: 'FSSC 22000 Add. Req. 2.5.7 (EMP)',
          frequency: 'Monthly (Zones 1–3 Swabs) + Per-Batch Indicator Micro',
          methodAndCriteria: 'ISO 6579 Salmonella / ISO 11290 Listeria Absent/25g; TPC within PFA limit',
          lastVerifiedDate: today,
          actualFinding: 'Zero positives across 12 environmental zones; TPC < 100 CFU/g',
          verificationStatus: 'Conforming',
          nextDueDate: '2026-12-17',
          verifierName: 'QC Microbiologist'
        },
        {
          id: 'ver-4',
          activityName: 'Internal ISO 9001 & FSSC 22000 v7 Audit + Mock Recall Drill',
          standardClause: 'ISO 9001 Cl. 9.2 · ISO 22000 Cl. 8.3 & 9.2',
          frequency: 'Semi-Annual Internal Audit / Annual Mock Recall (<= 4 hrs)',
          methodAndCriteria: 'ISO 19011 clause audit + 98–102% mass balance traceability',
          lastVerifiedDate: today,
          actualFinding: '99.4% batch traceability completed in 2 hrs 10 mins',
          verificationStatus: 'Conforming',
          nextDueDate: '2027-05-15',
          verifierName: qaLeadName
        }
      ]
    },

    'risk-assessment': {
      scoringMatrixRule:
        '5×5 Risk Score = Likelihood (1–5) × Severity (1–5). Rating Zones: 1–4 Low (Accept & Monitor) · 5–9 Medium (Control via PRP/QMS) · 10–15 High (Mandatory Mitigation Plan) · 16–25 Critical (Immediate Stop/Escalation).',
      rows: [
        {
          id: 'rsk-1',
          riskCode: 'RSK-QMS-01',
          domain: 'ISO 9001 QMS (Quality & Process)',
          processOrArea: 'Packaging Artwork & Batch Coding',
          riskOrOpportunity: 'Incorrect expiry date or missing allergen bolding on finished SKU label',
          potentialImpact: 'Regulatory recall, PFA penalty, customer complaint & brand damage',
          inherentLikelihood: 3,
          inherentSeverity: 4,
          existingControls: 'Pre-print artwork approval sign-off',
          mitigationActionPlan: 'Implement dual-person startup sign-off + automated camera vision check on ink-jet date code.',
          owner: 'QA & Packaging Supervisor',
          residualLikelihood: 1,
          residualSeverity: 4,
          targetDate: today,
          reviewStatus: 'Controlled'
        },
        {
          id: 'rsk-2',
          riskCode: 'RSK-FSMS-02',
          domain: 'FSSC 22000 FSMS (Food Safety & Culture)',
          processOrArea: 'Cold Chain Logistics & Shift Turnover',
          riskOrOpportunity: 'Operator bypassing chiller pre-cooling or failing to report temperature spike (Food Safety Culture gap)',
          potentialImpact: 'Microbial spoilage / toxin growth during transit & shelf-life failure',
          inherentLikelihood: 3,
          inherentSeverity: 5,
          existingControls: 'Manual dispatch temp check & SOP',
          mitigationActionPlan: 'Install continuous IoT truck data loggers + monthly anonymous Food Safety Culture survey & toolbox talks.',
          owner: qaLeadName,
          residualLikelihood: 1,
          residualSeverity: 5,
          targetDate: '2026-12-30',
          reviewStatus: 'Controlled'
        },
        {
          id: 'rsk-3',
          riskCode: 'RSK-TACCP-03',
          domain: 'TACCP (Food Defense / Intentional Threat)',
          processOrArea: 'Water Storage Tanks, Mixing Hoppers & Perimeter Access',
          riskOrOpportunity: 'Unauthorized access or intentional chemical/biological tampering of open ingredient tanks',
          potentialImpact: 'Mass public poisoning, plant shutdown & criminal investigation',
          inherentLikelihood: 2,
          inherentSeverity: 5,
          existingControls: 'Security gate log',
          mitigationActionPlan: 'Lockable tank manways with tamper-evident numbered seals, CCTV coverage, visitor escort & keycard access on high-care zones.',
          owner: 'Security & Plant Manager',
          residualLikelihood: 1,
          residualSeverity: 5,
          targetDate: '2026-12-20',
          reviewStatus: 'Controlled'
        },
        {
          id: 'rsk-4',
          riskCode: 'RSK-VACCP-04',
          domain: 'VACCP (Food Fraud / Adulteration)',
          processOrArea: 'High-Value Raw Ingredients (Milk Fat, Spices, Honey, Oils)',
          riskOrOpportunity: 'Economically motivated adulteration (starch/melamine/Sudan dye/vegetable fat substitution) by supplier',
          potentialImpact: 'Halal non-compliance, toxic adulterant hazard & GFSI audit Major NC',
          inherentLikelihood: 3,
          inherentSeverity: 4,
          existingControls: 'Supplier COA check',
          mitigationActionPlan: 'Require tamper-evident truck seals + periodic third-party ISO 17025 authenticity testing (Fatty acid profile, HPLC Sudan dye, ELISA).',
          owner: 'Procurement & QC Lab',
          residualLikelihood: 1,
          residualSeverity: 4,
          targetDate: '2027-01-15',
          reviewStatus: 'Mitigation Open'
        }
      ]
    }
  };
}
