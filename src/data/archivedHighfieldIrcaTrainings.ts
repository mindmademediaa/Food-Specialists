import { HubTraining } from '../types/hub';

/**
 * ARCHIVED BACKUP: Highfield UK & Lead Auditor (IRCA CQI / Exemplar Global) Trainings
 * ====================================================================================
 * Saved as requested so that whenever the user asks to recover/restore the Highfield
 * and IRCA CQI / Exemplar Global training catalog, settings, and hierarchy,
 * this exact configuration and data can be restored 1:1 immediately.
 */

export const ARCHIVED_LEAD_AUDITOR_STANDARDS: Array<'ISO 9001' | 'FSSC 22000' | 'ISO 14001' | 'ISO 45001'> = [
  'ISO 9001',
  'FSSC 22000',
  'ISO 14001',
  'ISO 45001',
];

export const ARCHIVED_HIGHFIELD_AND_IRCA_TRAININGS: HubTraining[] = [
  // ================= SECTION A: HIGHFIELD TRAININGS (8 Courses) =================
  {
    id: 'tr-hf-haccp-1',
    category: 'Highfield',
    title: 'HACCP Level 1',
    subType: null,
    description:
      'Highfield Level 1 Award in Awareness of Hazard Analysis and Critical Control Points (HACCP). Ideal for new food handlers and entry-level plant personnel.',
    duration: '1 Day (6 Guided Learning Hours)',
    fees: 'PKR 8,500 / USD 45',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20Highfield%20HACCP%20Level%201%20training.',
    isActive: true
  },
  {
    id: 'tr-hf-haccp-2',
    category: 'Highfield',
    title: 'HACCP Level 2',
    subType: null,
    description:
      'Highfield Level 2 Award in HACCP for Food Manufacturing (RQF). Covers Codex 7 principles, prerequisite programs (PRPs), CCP monitoring, and corrective actions.',
    duration: '2 Days (12 Hours)',
    fees: 'PKR 15,000 / USD 75',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20Highfield%20HACCP%20Level%202%20training.',
    isActive: true
  },
  {
    id: 'tr-hf-haccp-3',
    category: 'Highfield',
    title: 'HACCP Level 3',
    subType: null,
    description:
      'Highfield Level 3 Award in HACCP for Food Manufacturing (RQF). Designed for QA/QC Officers, Supervisors, and HACCP Team Members implementing food safety plans.',
    duration: '3 Days (18 Hours)',
    fees: 'PKR 28,000 / USD 135',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20Highfield%20HACCP%20Level%203%20training.',
    isActive: true
  },
  {
    id: 'tr-hf-haccp-4',
    category: 'Highfield',
    title: 'HACCP Level 4',
    subType: null,
    description:
      'Highfield Level 4 Award in Managing HACCP for Food Manufacturing. Advanced qualification for QA Managers, Technical Heads, and Senior Lead Auditors.',
    duration: '5 Days (30 Hours)',
    fees: 'PKR 52,000 / USD 240',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20Highfield%20HACCP%20Level%204%20training.',
    isActive: true
  },
  {
    id: 'tr-hf-fs-1',
    category: 'Highfield',
    title: 'Food Safety Level 1',
    subType: null,
    description:
      'Highfield Level 1 Award in Food Safety in Manufacturing & Catering. Covers personal hygiene, cross-contamination prevention, and basic temperature control.',
    duration: '1 Day (6 Hours)',
    fees: 'PKR 7,500 / USD 40',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20Highfield%20Food%20Safety%20Level%201%20training.',
    isActive: true
  },
  {
    id: 'tr-hf-fs-2',
    category: 'Highfield',
    title: 'Food Safety Level 2',
    subType: null,
    description:
      'Highfield Level 2 Award in Food Safety for Manufacturing (RQF). Essential certification for food production operators, lab technicians, and warehouse staff.',
    duration: '2 Days (12 Hours)',
    fees: 'PKR 14,000 / USD 70',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20Highfield%20Food%20Safety%20Level%202%20training.',
    isActive: true
  },
  {
    id: 'tr-hf-fs-3',
    category: 'Highfield',
    title: 'Food Safety Level 3',
    subType: null,
    description:
      'Highfield Level 3 Award in Supervising Food Safety in Manufacturing. Essential for Hygiene Officers, QA Executives, and GCC Municipality-approved supervisors (PIC).',
    duration: '3 Days (20 Hours)',
    fees: 'PKR 26,000 / USD 125',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20Highfield%20Food%20Safety%20Level%203%20training.',
    isActive: true
  },
  {
    id: 'tr-hf-fs-4',
    category: 'Highfield',
    title: 'Food Safety Level 4',
    subType: null,
    description:
      'Highfield Level 4 Award in Managing Food Safety in Manufacturing. Gold-standard credential for Food Safety Managers, Plant Directors, and Regulatory Specialists.',
    duration: '5 Days (35 Hours)',
    fees: 'PKR 50,000 / USD 230',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20Highfield%20Food%20Safety%20Level%204%20training.',
    isActive: true
  },

  // ================= SECTION B: LEAD AUDITOR TRAININGS (4 Standards x 2 Bodies) =================
  // 1. ISO 9001
  {
    id: 'tr-la-iso9001-eg',
    category: 'Lead Auditor',
    title: 'ISO 9001',
    standardCode: 'ISO 9001',
    subType: 'Exemplar Global',
    description:
      'Exemplar Global Certified ISO 9001:2015 Quality Management Systems (QMS) Lead Auditor Training (AU, TL, QM competency units). Includes live audit simulation, process-based QMS auditing, and non-conformity reporting.',
    duration: '5 Days (40 Hours · Live Online / Classroom)',
    fees: 'PKR 38,000 / USD 180',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20ISO%209001%20Lead%20Auditor%20(Exemplar%20Global).',
    isActive: true
  },
  {
    id: 'tr-la-iso9001-irca',
    category: 'Lead Auditor',
    title: 'ISO 9001',
    standardCode: 'ISO 9001',
    subType: 'IRCA | CQI',
    description:
      'CQI & IRCA UK Certified ISO 9001:2015 QMS Lead Auditor Course (PR328). Globally recognized across multinational FMCGs and third-party certification bodies (SGS, Bureau Veritas, Intertek).',
    duration: '5 Days (40 Hours + Online IRCA Exam)',
    fees: 'PKR 65,000 / USD 295',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20ISO%209001%20Lead%20Auditor%20(IRCA%20%7C%20CQI).',
    isActive: true
  },

  // 2. FSSC 22000
  {
    id: 'tr-la-fssc22000-eg',
    category: 'Lead Auditor',
    title: 'FSSC 22000',
    standardCode: 'FSSC 22000',
    subType: 'Exemplar Global',
    description:
      'Exemplar Global Certified FSSC 22000 Version 6 & ISO 22000:2018 Food Safety Management System Lead Auditor. Covers ISO/TS 22002-1 PRPs, FSSC v6 additional requirements, Food Fraud (VACCP), and Food Defense (TACCP).',
    duration: '5 Days (40 Hours · Intensive Workshop)',
    fees: 'PKR 42,000 / USD 195',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20FSSC%2022000%20Lead%20Auditor%20(Exemplar%20Global).',
    isActive: true
  },
  {
    id: 'tr-la-fssc22000-irca',
    category: 'Lead Auditor',
    title: 'FSSC 22000',
    standardCode: 'FSSC 22000',
    subType: 'IRCA | CQI',
    description:
      'CQI & IRCA UK Approved FSSC 22000 Version 6 Lead Auditor Course (PR359). The premier credential for Food Safety Officers, Supplier Quality Auditors, and GFSI certification specialists.',
    duration: '5 Days (40 Hours + Official CQI/IRCA Exam)',
    fees: 'PKR 72,000 / USD 320',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20FSSC%2022000%20Lead%20Auditor%20(IRCA%20%7C%20CQI).',
    isActive: true
  },

  // 3. ISO 14001
  {
    id: 'tr-la-iso14001-eg',
    category: 'Lead Auditor',
    title: 'ISO 14001',
    standardCode: 'ISO 14001',
    subType: 'Exemplar Global',
    description:
      'Exemplar Global Certified ISO 14001:2015 Environmental Management Systems (EMS) Lead Auditor. Covers food processing effluent treatment, waste valorization, and environmental compliance auditing.',
    duration: '5 Days (40 Hours)',
    fees: 'PKR 38,000 / USD 180',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20ISO%2014001%20Lead%20Auditor%20(Exemplar%20Global).',
    isActive: true
  },
  {
    id: 'tr-la-iso14001-irca',
    category: 'Lead Auditor',
    title: 'ISO 14001',
    standardCode: 'ISO 14001',
    subType: 'IRCA | CQI',
    description:
      'CQI & IRCA UK Certified ISO 14001:2015 EMS Lead Auditor Course (PR315). Equips QHSE and Food Plant Engineers to lead third-party environmental audits.',
    duration: '5 Days (40 Hours + Online IRCA Exam)',
    fees: 'PKR 65,000 / USD 295',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20ISO%2014001%20Lead%20Auditor%20(IRCA%20%7C%20CQI).',
    isActive: true
  },

  // 4. ISO 45001
  {
    id: 'tr-la-iso45001-eg',
    category: 'Lead Auditor',
    title: 'ISO 45001',
    standardCode: 'ISO 45001',
    subType: 'Exemplar Global',
    description:
      'Exemplar Global Certified ISO 45001:2018 Occupational Health & Safety (OH&S) Lead Auditor. Covers industrial food plant safety, boiler/ammonia refrigeration hazard auditing, and LOTO.',
    duration: '5 Days (40 Hours)',
    fees: 'PKR 38,000 / USD 180',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20ISO%2045001%20Lead%20Auditor%20(Exemplar%20Global).',
    isActive: true
  },
  {
    id: 'tr-la-iso45001-irca',
    category: 'Lead Auditor',
    title: 'ISO 45001',
    standardCode: 'ISO 45001',
    subType: 'IRCA | CQI',
    description:
      'CQI & IRCA UK Certified ISO 45001:2018 OH&S Management Systems Lead Auditor (PR357). Ideal for integrated QHSE & Food Safety Leaders.',
    duration: '5 Days (40 Hours + Online IRCA Exam)',
    fees: 'PKR 65,000 / USD 295',
    enrollLink:
      'https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20ISO%2045001%20Lead%20Auditor%20(IRCA%20%7C%20CQI).',
    isActive: true
  }
];
