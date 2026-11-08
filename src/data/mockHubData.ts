import {
  HubUser,
  HubJob,
  HubScholarship,
  HubTraining,
  HubPaymentRequest,
  HubChatMessage,
  HubCommunityThread
} from '../types/hub';
import { INITIAL_INTERNATIONAL_TRAININGS } from './internationalTrainingsData';

export function makeAvatarSvg(initials: string, bg = '#E2F5E7', text = '#14532D'): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <rect width="120" height="120" rx="60" fill="${bg}"/>
      <circle cx="60" cy="60" r="54" stroke="#16A34A" stroke-width="3" stroke-opacity="0.35"/>
      <text x="60" y="72" text-anchor="middle" fill="${text}" font-family="Plus Jakarta Sans, sans-serif" font-size="38" font-weight="700">${initials}</text>
    </svg>
  `)}`;
}

export const INITIAL_USERS: HubUser[] = [
  {
    uid: 'user-alex-1',
    name: 'Alex Tariq',
    profilePicUrl: makeAvatarSvg('AT', '#DCFCE7', '#14532D'),
    qualification: 'MSc (Hons.) Food Science & Technology — NIFSAT',
    experience:
      '5+ years in FMCG Dairy & Beverage Quality Assurance. Led 14 zero-non-conformity FSSC 22000 v6 and Halal PS 3733 surveillance audits across aseptic filling plants.',
    currentRole: 'Senior Food Safety & QA Lead',
    company: 'Nestlé Dairy & Nutrition',
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    bio: 'IRCA Certified FSSC 22000 v6 Lead Auditor & Dairy QA Specialist helping aseptic UHT and spray-drying facilities achieve zero-defect compliance.',
    email: 'alex.tariq@foodspecialists.org',
    phone: '+92 300 8429104',
    linkedinUrl: 'https://www.linkedin.com/in/alextariq-fsqa',
    portfolioUrl: 'https://foodspecialists.org/portfolio/alex-tariq',
    skills: ['HACCP', 'ISO 22000', 'QA/QC', 'Dairy', 'Food Safety'],
    specializations: ['Food Safety', 'QA/QC', 'Dairy', 'HACCP', 'ISO 22000'],
    cvUrl: 'Alex_Tariq_FSQA_Lead_Auditor_CV.pdf',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: true,
      phone_public: false,
      hireMe_public: true
    },
    createdAt: '2026-10-15T08:00:00Z',
    isAdmin: true,
    isPaid: true,
    paymentStatus: 'verified',
    paymentMethod: 'EasyPaisa',
    paymentReference: 'EP-99284102',
    paymentAmount: 'PKR 1,500'
  },
  {
    uid: 'user-sara-2',
    name: 'Dr. Sara Mahmood',
    profilePicUrl: makeAvatarSvg('SM', '#D1FAE5', '#065F46'),
    qualification: 'PhD Food Microbiology & Mycotoxin Safety — University of Leeds',
    experience:
      '7 years directing ISO/IEC 17025 accredited food microbiology laboratories, PCR pathogen screening (Salmonella, Listeria), and shelf-life validation trials.',
    currentRole: 'Head of Microbiological QC & Lab Systems',
    company: 'Unilever Foods & Refreshment',
    location: 'Karachi, Pakistan',
    country: 'Pakistan',
    bio: 'Food Microbiologist & ISO 17025 Technical Assessor specializing in rapid PCR pathogen detection, mycotoxin chromatography, and thermal lethality modeling.',
    email: 'sara.mahmood@foodspecialists.org',
    phone: '+92 321 4491022',
    linkedinUrl: 'https://www.linkedin.com/in/drsaramahmood-micro',
    portfolioUrl: 'https://scholar.google.com',
    skills: ['Food Chemistry', 'ISO 22000', 'QA/QC', 'Food Safety'],
    specializations: ['QA/QC', 'Food Safety', 'Food Chemistry', 'ISO 22000'],
    cvUrl: 'Dr_Sara_Mahmood_CV.pdf',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: true,
      phone_public: false,
      hireMe_public: true
    },
    createdAt: '2026-10-18T10:30:00Z',
    isAdmin: false,
    isPaid: true,
    paymentStatus: 'verified',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'HBL-8841209',
    paymentAmount: 'PKR 1,500'
  },
  {
    uid: 'user-usman-3',
    name: 'Engr. Usman Farooq',
    profilePicUrl: makeAvatarSvg('UF', '#E0F2FE', '#075985'),
    qualification: 'BSc (Hons.) Food Engineering — UAF',
    experience:
      '4 years supervising high-speed UHT milk processing, Tetra Pak aseptic homogenizers, CIP chemical optimization, and line OEE improvement.',
    currentRole: 'Aseptic Processing & Production Engineer',
    company: 'FrieslandCampina Engro',
    location: 'Sahiwal, Pakistan',
    country: 'Pakistan',
    bio: 'Thermal Dairy & Aseptic Processing Engineer focused on UHT sterilizer optimization, automated CIP validation, and hygienic equipment design.',
    email: 'usman.farooq@foodspecialists.org',
    phone: '+92 333 9182736',
    linkedinUrl: 'https://www.linkedin.com/in/usmanfarooq-foodeng',
    portfolioUrl: 'https://foodspecialists.org/portfolio/usman-farooq',
    skills: ['Dairy', 'HACCP', 'QA/QC'],
    specializations: ['Dairy', 'HACCP', 'QA/QC', 'Food Safety'],
    cvUrl: '',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: false,
      phone_public: false,
      hireMe_public: false
    },
    createdAt: '2026-10-20T14:15:00Z',
    isAdmin: false,
    isPaid: true,
    paymentStatus: 'verified',
    paymentMethod: 'JazzCash',
    paymentReference: 'JC-77419023',
    paymentAmount: 'PKR 1,500'
  },
  {
    uid: 'user-ayesha-4',
    name: 'Ayesha Siddiqui',
    profilePicUrl: makeAvatarSvg('AS', '#FEF3C7', '#92400E'),
    qualification: 'MSc Human Nutrition & Sensory Science — UVAS',
    experience:
      '3.5 years leading new product development (NPD), sugar-reduction beverage formulation, and accelerated shelf-life sensory panels across MENA markets.',
    currentRole: 'R&D Formulation & Sensory Scientist',
    company: 'PepsiCo International Beverages',
    location: 'Dubai, UAE',
    country: 'UAE',
    bio: 'R&D Beverage & Nutrition Formulation Scientist experienced in clean-label hydrocolloids, natural sweetener systems, and GCC SFDA/Montaji regulatory compliance.',
    email: 'ayesha.siddiqui@foodspecialists.org',
    phone: '+971 50 4829103',
    linkedinUrl: 'https://www.linkedin.com/in/ayeshasiddiqui-rnd',
    portfolioUrl: 'https://foodspecialists.org/portfolio/ayesha-siddiqui',
    skills: ['R&D', 'Nutrition', 'Food Chemistry', 'Bakery'],
    specializations: ['R&D', 'Nutrition', 'Food Chemistry', 'Bakery'],
    cvUrl: 'Ayesha_Siddiqui_RD_CV.pdf',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: true,
      phone_public: false,
      hireMe_public: true
    },
    createdAt: '2026-10-22T09:00:00Z',
    isAdmin: false,
    isPaid: true,
    paymentStatus: 'verified',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'ENBD-552910',
    paymentAmount: 'PKR 1,500'
  },
  {
    uid: 'user-khalid-7',
    name: 'Tariq Al-Mansoor',
    profilePicUrl: makeAvatarSvg('TM', '#E0E7FF', '#1E40AF'),
    qualification: 'MSc Cereal & Bakery Science — King Saud University',
    experience:
      '6+ years managing industrial high-speed biscuit & artisan bakery lines, dough rheology profiling, and BRCGS Issue 9 compliance in Riyadh.',
    currentRole: 'Regional Bakery QA & Technical Manager',
    company: 'Almarai Bakery Division',
    location: 'Riyadh, Saudi Arabia',
    country: 'Saudi Arabia',
    bio: 'Bakery Technologist & BRCGS Lead Auditor specializing in enzyme dough conditioning, mycotoxin control in wheat flour, and allergen management.',
    email: 'tariq.mansoor@foodspecialists.org',
    phone: '+966 55 8192031',
    linkedinUrl: 'https://www.linkedin.com/in/tariq-almansoor-bakery',
    portfolioUrl: 'https://foodspecialists.org/portfolio/tariq-mansoor',
    skills: ['Bakery', 'HACCP', 'ISO 22000', 'Food Safety'],
    specializations: ['Bakery', 'Food Safety', 'HACCP', 'ISO 22000'],
    cvUrl: 'Tariq_AlMansoor_Bakery_QA.pdf',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: true,
      phone_public: false,
      hireMe_public: true
    },
    createdAt: '2026-10-25T11:00:00Z',
    isAdmin: false,
    isPaid: true,
    paymentStatus: 'verified',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'KSA-441029',
    paymentAmount: 'PKR 1,500'
  },
  {
    uid: 'user-hamza-free-5',
    name: 'Hamza Nawaz (Fresh Graduate)',
    profilePicUrl: makeAvatarSvg('HN', '#F3E8FF', '#6B21A8'),
    qualification: 'BS (Hons.) Food Science & Technology — UVAS Lahore',
    experience:
      'Fresh Graduate with 6-month QA & HACCP line hygiene internship in dairy processing.',
    currentRole: 'Junior QA Intern (Seeking Full-Time Role)',
    company: '',
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    bio: 'Motivated Food Science graduate certified in Highfield HACCP Level 3 and ISO 22000 internal auditing.',
    email: 'hamza.nawaz@foodspecialists.org',
    phone: '+92 312 4901823',
    linkedinUrl: 'https://www.linkedin.com/in/hamzanawaz-fst',
    skills: ['QA/QC', 'HACCP', 'Dairy'],
    specializations: ['QA/QC', 'HACCP', 'Dairy'],
    cvUrl: 'Hamza_Nawaz_Fresh_Grad_CV.pdf',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: true,
      phone_public: true,
      hireMe_public: true
    },
    createdAt: '2026-10-30T11:20:00Z',
    isAdmin: false,
    isPaid: false,
    paymentStatus: 'pending',
    paymentMethod: 'EasyPaisa',
    paymentReference: 'TID-883920144',
    paymentAmount: 'PKR 1,500'
  },
  {
    uid: 'user-zainab-free-6',
    name: 'Zainab Raza',
    profilePicUrl: makeAvatarSvg('ZR', '#FCE7F3', '#9D174D'),
    qualification: 'BS (Hons.) Food Science & Technology — Karachi University',
    experience:
      '1.5 years in poultry further-processing IQF line sanitation and pre-operational SSOP compliance.',
    currentRole: 'Hygiene & HACCP Officer',
    company: 'K&N’s Foods',
    location: 'Karachi, Pakistan',
    country: 'Pakistan',
    bio: 'Food Safety & Plant Hygiene Officer experienced in ATP swabbing and cold-chain CCP compliance.',
    email: 'zainab.raza@foodspecialists.org',
    phone: '+92 345 2109832',
    linkedinUrl: 'https://www.linkedin.com/in/zainabraza-haccp',
    skills: ['Food Safety', 'HACCP'],
    specializations: ['Food Safety', 'HACCP'],
    cvUrl: '',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: false,
      phone_public: false,
      hireMe_public: true
    },
    createdAt: '2026-10-31T16:45:00Z',
    isAdmin: false,
    isPaid: false,
    paymentStatus: 'none'
  }
];

export const INITIAL_COMMUNITY_THREADS: HubCommunityThread[] = [
  {
    id: 'thread-1',
    authorName: 'Alex Tariq',
    authorRole: 'Senior Food Safety & QA Lead • Nestlé',
    authorAvatar: makeAvatarSvg('AT', '#DCFCE7', '#14532D'),
    topicTag: 'ISO 22000',
    title: 'Transitioning to FSSC 22000 Version 6: Key Clause 2.5.15 Equipment Management Checklist',
    preview:
      'Sharing our plant-tested hygienic design risk assessment template and environmental monitoring (EMP) zoning map for Zone 1 & Zone 2 aseptic lines...',
    repliesCount: 28,
    likesCount: 64,
    postedAgo: '3h ago'
  },
  {
    id: 'thread-2',
    authorName: 'Dr. Sara Mahmood',
    authorRole: 'Head of Microbiological QC • Unilever',
    authorAvatar: makeAvatarSvg('SM', '#D1FAE5', '#065F46'),
    topicTag: 'Food Chemistry',
    title: 'HPLC vs. Rapid ELISA Validation for Aflatoxin M1 in Raw Bulk Milk Reception',
    preview:
      'Here is how we reduced platform batch release turnaround from 45 minutes to 12 minutes while maintaining ISO/IEC 17025 measurement uncertainty...',
    repliesCount: 19,
    likesCount: 47,
    postedAgo: '6h ago'
  },
  {
    id: 'thread-3',
    authorName: 'Ayesha Siddiqui',
    authorRole: 'R&D Formulation Scientist • PepsiCo Dubai',
    authorAvatar: makeAvatarSvg('AS', '#FEF3C7', '#92400E'),
    topicTag: 'R&D',
    title: 'GCC SFDA & Dubai Municipality Montaji Labeling Updates for High-Intensity Sweeteners',
    preview:
      'A quick breakdown of the latest steviol glycoside and monk fruit declaration rules for low-sugar RTD beverages exported to UAE and Saudi Arabia...',
    repliesCount: 34,
    likesCount: 82,
    postedAgo: '1d ago'
  }
];

export const INITIAL_PAYMENT_REQUESTS: HubPaymentRequest[] = [
  {
    id: 'req-hamza-1',
    uid: 'user-hamza-free-5',
    userName: 'Hamza Nawaz (Fresh Graduate)',
    userEmail: 'hamza.nawaz@foodspecialists.org',
    userPhone: '+92 312 4901823',
    qualification: 'BS (Hons.) Food Science & Technology — UVAS Lahore',
    currentRole: 'Junior QA Intern (Seeking Full-Time Role)',
    paymentMethod: 'EasyPaisa',
    transactionId: 'TID-883920144',
    amount: 'PKR 1,500',
    notes: 'Paid membership fee sent via EasyPaisa. Please verify and add my profile to Communities.',
    status: 'pending',
    submittedAt: '2026-11-01 09:30 AM'
  }
];

export const INITIAL_CHATS: HubChatMessage[] = [
  {
    id: 'chat-1',
    senderUid: 'user-hamza-free-5',
    senderName: 'Hamza Nawaz',
    senderPhone: '+92 312 4901823',
    recipientName: 'Admin Support (Muneeb Khan)',
    chatType: 'admin_support',
    message: 'Assalam-o-Alaikum Sir, mainay EasyPaisa TID-883920144 ke zariye Paid Membership fee bhej di hai. Kindly verify kar ke mera profile Communities may activate kar dein.',
    adminReply: 'Wa-Alaikum-Salaam Hamza! Aapki request Admin Panel may receive ho gayi hai, payment verify hotay hi aapka profile Communities may live ho jayega.',
    createdAt: '2026-11-01 09:35 AM'
  },
  {
    id: 'chat-2',
    senderUid: 'employer-dairy-1',
    senderName: 'HR Manager — Dairy Pure Foods',
    senderPhone: '+92 300 4112233',
    recipientName: 'Dr. Sara Mahmood',
    chatType: 'hiring_contact',
    message: 'Hello Dr. Sara, we reviewed your qualification and ISO 17025 lab experience in the Communities directory and would like to schedule an interview for QA Lead.',
    createdAt: '2026-11-01 10:15 AM'
  }
];

export const INITIAL_JOBS: HubJob[] = [
  {
    id: 'job-1',
    title: 'Lead Food Safety & FSSC 22000 Internal Auditor',
    company: 'Nestlé Nutrition & Dairy Operations',
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    specialization: 'Food Safety',
    experienceRequired: '3–5 Years',
    category: 'Quality & Safety',
    description:
      'Lead plant-wide Food Safety Management System (FSMS) verification across spray-drying and aseptic filling lines. Conduct monthly CCP verification audits, manage Prerequisite Programs (PRPs/OPRPs), and coordinate external surveillance audits under FSSC 22000 v6.',
    requirements:
      '• BSc/MSc in Food Science & Technology, Dairy Technology, or Microbiology\n• IRCA Certified Lead Auditor ISO 22000:2018 / FSSC 22000 v6\n• Minimum 3 years hands-on HACCP & allergen validation experience\n• Strong command of root-cause CAPA investigations and hygienic zoning',
    hrEmail: 'careers.fsqa@nestle.com.pk',
    emailSubject: 'Application: Lead Food Safety & FSSC 22000 Internal Auditor (Ref: NES-PK-204)',
    applicationGuidelines:
      'Send your updated CV and Lead Auditor certificate PDF directly via your personal Gmail/Outlook to the HR email below with the exact subject line, or submit through the official Nestlé Careers portal.',
    applyLink: 'https://www.nestle.pk/jobs',
    tags: ['Food Safety', 'FSSC 22000', 'HACCP', 'Dairy'],
    postedAt: '2 hours ago',
    expiryAt: '2026-11-25',
    isActive: true
  },
  {
    id: 'job-2',
    title: 'Quality Assurance & Analytical Lab Executive (QA/QC)',
    company: 'Unilever Foods & Refreshment',
    location: 'Faisalabad, Pakistan',
    country: 'Pakistan',
    specialization: 'QA/QC',
    experienceRequired: '2–3 Years',
    category: 'Quality & Safety',
    description:
      'Manage physicochemical and microbiological release testing for savory dressings, culinary pastes, and tea blending lines. Maintain ISO/IEC 17025 lab calibration schedules, Brix/pH/viscosity SPC control charts, and SAP QM batch release workflows.',
    requirements:
      '• BS/MS in Food Technology, Analytical Chemistry, or Industrial Biotechnology\n• 2+ years QA/QC laboratory and in-line inspection experience in FMCG\n• Hands-on proficiency with Karl Fischer moisture, HunterLab colorimetry, and SAP QM',
    hrEmail: 'talent.acquisition@unilever.com.pk',
    emailSubject: 'Application: QA & Analytical Lab Executive — Faisalabad Plant',
    applicationGuidelines:
      'Email your resume and academic transcripts directly to Unilever HR using the subject line below, or complete your external profile on the Unilever Careers website.',
    applyLink: 'https://careers.unilever.com',
    tags: ['QA/QC', 'SAP QM', 'ISO 17025', 'HACCP'],
    postedAt: '5 hours ago',
    expiryAt: '2026-11-28',
    isActive: true
  },
  {
    id: 'job-3',
    title: 'R&D Beverage Formulation & Pilot Lab Scientist',
    company: 'PepsiCo International Beverages',
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    specialization: 'R&D',
    experienceRequired: '3+ Years',
    category: 'R&D Lab',
    description:
      'Lead bench-top beverage formulation, sugar-reduction sweetener optimization, and pilot-plant UHT/carbonation scale-up trials. Collaborate with Quality and Regulatory teams to ensure nutritional compliance and thermal lethality validation.',
    requirements:
      '• BSc/MSc in Food Engineering or Food Science & Technology\n• 3+ years R&D product development experience in beverages or liquid dairy\n• Expertise in hydrocolloid stabilization, emulsion science, and thermal processing',
    hrEmail: 'rnd.recruiting@pepsico.com',
    emailSubject: 'Application: R&D Beverage Formulation Scientist (Lahore Concentrate Plant)',
    applicationGuidelines:
      'Apply externally by emailing your CV and formulation project portfolio to the PepsiCo R&D HR mailbox below with the recommended subject line.',
    applyLink: 'https://www.pepsicojobs.com',
    tags: ['R&D', 'Beverage Tech', 'Sensory', 'Nutrition'],
    postedAt: '1 day ago',
    expiryAt: '2026-11-30',
    isActive: true
  },
  {
    id: 'job-4',
    title: 'Aseptic UHT & Spray-Drying Dairy Shift Engineer',
    company: 'FrieslandCampina Engro Pakistan',
    location: 'Sahiwal, Pakistan',
    country: 'Pakistan',
    specialization: 'Dairy',
    experienceRequired: '2–4 Years',
    category: 'Production',
    description:
      'Supervise high-speed UHT milk processing, homogenizer pressure parameters, CIP sanitation cycles, and line OEE targets while maintaining strict zero-contamination hygiene compliance.',
    requirements:
      '• BSc in Food Engineering, Dairy Technology, or Chemical Engineering\n• 2–4 years thermal dairy processing and Tetra Pak aseptic line supervision\n• Strong command of CIP validation, mass-balance yield, and GMP compliance',
    hrEmail: 'careers.pk@frieslandcampina.com',
    emailSubject: 'Application: Aseptic UHT & Spray-Drying Dairy Shift Engineer — Sahiwal',
    applicationGuidelines:
      'Send your CV directly via email to FrieslandCampina HR with the subject line provided below.',
    applyLink: 'https://www.frieslandcampina.com.pk/careers',
    tags: ['Dairy', 'UHT Dairy', 'CIP Validation', 'FSSC 22000'],
    postedAt: '1 day ago',
    expiryAt: '2026-11-26',
    isActive: true
  },
  {
    id: 'job-5',
    title: 'Regional Halal Assurance & Regulatory Specialist',
    company: 'Almarai Food Manufacturing Group',
    location: 'Riyadh, Saudi Arabia',
    country: 'Saudi Arabia',
    specialization: 'Food Safety',
    experienceRequired: '4+ Years',
    category: 'Quality & Safety',
    description:
      'Oversee SFDA regulatory dossier submissions, GSO 2055-1 Halal assurance audits of raw ingredient suppliers, and trace-forward verification for poultry and bakery processing plants across the GCC region.',
    requirements:
      '• Degree in Food Science, Food Technology, or Halal Science\n• Certified Halal Lead Auditor (GSO 2055-1 / MS 1500 / PS 3733)\n• Working fluency in Codex Alimentarius food labeling and additive standards',
    hrEmail: 'gcc.talent@almarai.com',
    emailSubject: 'Application: Regional Halal Assurance & Regulatory Specialist (Riyadh)',
    applicationGuidelines:
      'Email your CV, passport copy status, and Halal Lead Auditor credentials directly to Almarai Recruitment.',
    applyLink: 'https://www.almarai.com/en/careers',
    tags: ['Food Safety', 'Halal GSO 2055', 'SFDA Regulatory', 'ISO 22000'],
    postedAt: '2 days ago',
    expiryAt: '2026-12-02',
    isActive: true
  },
  {
    id: 'job-6',
    title: 'Sensory Evaluation & Nutrition Stability Scientist',
    company: 'Mondelēz International Confectionery R&D',
    location: 'Dubai, UAE',
    country: 'UAE',
    specialization: 'Nutrition',
    experienceRequired: '2–5 Years',
    category: 'R&D Lab',
    description:
      'Design and execute descriptive sensory panels (QDA, triangle tests, consumer hedonic trials), nutritional labeling validation, and accelerated shelf-life testing (ASLT) for chocolate and baked snack reformulations.',
    requirements:
      '• MSc in Food Science, Sensory Science, or Human Nutrition\n• Experience running sensory software and ANOVA statistical modeling\n• Strong understanding of lipid oxidation and water activity (aw)',
    hrEmail: 'mena.rndcareers@mdlz.com',
    emailSubject: 'Application: Sensory Evaluation & Nutrition Stability Scientist — Dubai',
    applicationGuidelines:
      'Submit your CV via email to the Mondelēz MENA R&D talent team using the subject line below.',
    applyLink: 'https://www.mondelezinternational.com/careers',
    tags: ['Nutrition', 'Sensory Panel', 'Shelf-Life ASLT', 'R&D'],
    postedAt: '2 days ago',
    expiryAt: '2026-12-05',
    isActive: true
  },
  {
    id: 'job-7',
    title: 'HACCP & Plant Hygiene Compliance Officer',
    company: 'K&N’s Integrated Poultry Processing',
    location: 'Karachi, Pakistan',
    country: 'Pakistan',
    specialization: 'Food Safety',
    experienceRequired: '1–3 Years',
    category: 'Quality & Safety',
    description:
      'Supervise pre-operational and operational sanitation protocols (SSOPs), ATP bioluminescence swabbing, cold-chain CCP temperature logs, and personnel GMP compliance across IQF lines.',
    requirements:
      '• BS Hons in Food Science & Technology or Microbiology\n• HACCP Level 3 or Level 4 Award in Food Safety Management\n• 1–3 years experience in meat, poultry, or frozen food sanitation validation',
    hrEmail: 'hr.quality@kandns.com',
    emailSubject: 'Application: HACCP & Plant Hygiene Compliance Officer — Karachi',
    applicationGuidelines:
      'Email your CV and Highfield HACCP certificate directly to K&N’s Human Resources.',
    applyLink: 'https://kandns.com/careers',
    tags: ['Food Safety', 'HACCP Level 3', 'ATP Swabbing', 'QA/QC'],
    postedAt: '3 days ago',
    expiryAt: '2026-11-29',
    isActive: true
  },
  {
    id: 'job-8',
    title: 'Bakery & Extruded Snacks Production Line Supervisor',
    company: 'English Biscuit Manufacturers (EBM)',
    location: 'Karachi, Pakistan',
    country: 'Pakistan',
    specialization: 'Bakery',
    experienceRequired: '2–4 Years',
    category: 'Production',
    description:
      'Manage dough rheology consistency, tunnel oven baking profiles, metal detector CCP verification, and high-speed flow-wrap packaging efficiency.',
    requirements:
      '• BSc/MSc in Food Science & Technology or Cereal Science\n• 2+ years production floor experience in biscuits, bakery, or snack extrusion\n• Hands-on knowledge of allergen changeover and waste reduction',
    hrEmail: 'careers@ebm.com.pk',
    emailSubject: 'Application: Bakery & Extruded Snacks Production Line Supervisor',
    applicationGuidelines:
      'Send your CV via email to EBM HR with the recommended subject line or apply via the official EBM careers portal.',
    applyLink: 'https://www.ebm.com.pk/careers',
    tags: ['Bakery', 'BRCGS', 'HACCP', 'Production'],
    postedAt: '3 days ago',
    expiryAt: '2026-12-04',
    isActive: true
  },
  {
    id: 'job-9',
    title: 'BRCGS Issue 9 Food Safety & Supplier Quality Manager',
    company: 'Spinneys Fresh Food Supply Chain',
    location: 'Dubai, UAE',
    country: 'UAE',
    specialization: 'QA/QC',
    experienceRequired: '5+ Years',
    category: 'Quality & Safety',
    description:
      'Manage BRCGS Food Safety Issue 9 certification readiness, Food Defense (TACCP) and Food Fraud Vulnerability Assessments (VACCP) for private-label chilled meals.',
    requirements:
      '• MSc Food Safety Management or Food Technology\n• BRCGS Issue 9 Lead Auditor Certification mandatory\n• Experience with Dubai Municipality Montaji & FoodWatch portals',
    hrEmail: 'quality.recruitment@spinneys.com',
    emailSubject: 'Application: BRCGS Issue 9 Food Safety & Supplier Quality Manager (Dubai)',
    applicationGuidelines:
      'Forward your CV and BRCGS Lead Auditor certificate to Spinneys Recruitment via personal email.',
    applyLink: 'https://www.spinneys.com/en-ae/careers',
    tags: ['QA/QC', 'BRCGS Issue 9', 'TACCP/VACCP', 'Food Safety'],
    postedAt: '4 days ago',
    expiryAt: '2026-12-10',
    isActive: true
  },
  {
    id: 'job-10',
    title: 'Food Microbiology & Pathogen PCR Lab Analyst',
    company: 'SGS Food Testing Laboratories',
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    specialization: 'QA/QC',
    experienceRequired: '1–3 Years',
    category: 'R&D Lab',
    description:
      'Conduct ISO 17025 accredited testing for Salmonella, Listeria monocytogenes, Cronobacter, and Aflatoxin M1/B1 using ELISA, HPLC, and real-time PCR.',
    requirements:
      '• MSc/MPhil in Food Microbiology, Microbiology, or Biotechnology\n• 2+ years experience in an ISO/IEC 17025 accredited food testing lab\n• Proficiency in aseptic media preparation and internal quality control',
    hrEmail: 'pk.foodlabs.hr@sgs.com',
    emailSubject: 'Application: Food Microbiology & Pathogen PCR Lab Analyst — Lahore',
    applicationGuidelines:
      'Send your CV and ISO 17025 lab experience summary directly to SGS Pakistan HR.',
    applyLink: 'https://www.sgs.com/en/our-company/careers',
    tags: ['QA/QC', 'ISO 17025', 'PCR Pathogen', 'Microbiology Lab'],
    postedAt: '4 days ago',
    expiryAt: '2026-12-08',
    isActive: true
  },
  {
    id: 'job-11',
    title: 'Artisan & Industrial Bakery R&D Technologist',
    company: 'National Foods Limited (NFL)',
    location: 'Karachi, Pakistan',
    country: 'Pakistan',
    specialization: 'Bakery',
    experienceRequired: '2–3 Years',
    category: 'R&D Lab',
    description:
      'Formulate premixes, baking improvers, and shelf-stable culinary batters while supervising pilot baking trials and sensory texture profiling.',
    requirements:
      '• BS/MS in Food Science & Technology or Cereal Technology\n• 2+ years R&D or QA experience in bakery premixes or culinary ingredients\n• Familiarity with Farinograph/Extensograph flour testing',
    hrEmail: 'talent@nfoods.com',
    emailSubject: 'Application: Bakery R&D Technologist — Karachi R&D Center',
    applicationGuidelines:
      'Email your resume directly to National Foods Talent Acquisition with the subject line below.',
    applyLink: 'https://www.nfoods.com/careers',
    tags: ['Bakery', 'R&D', 'FSSC 22000', 'Food Safety'],
    postedAt: '5 days ago',
    expiryAt: '2026-12-12',
    isActive: true
  },
  {
    id: 'job-12',
    title: 'Novel Plant-Based Protein & Nutrition R&D Technologist',
    company: 'IFF / DuPont Nutrition & Biosciences',
    location: 'Doha, Qatar',
    country: 'Qatar',
    specialization: 'R&D',
    experienceRequired: '3–5 Years',
    category: 'R&D Lab',
    description:
      'Formulate high-moisture extruded plant proteins, clean-label hydrocolloid binders, and natural flavor masking systems for next-generation meat and dairy alternatives.',
    requirements:
      '• MSc or PhD in Food Science, Biopolymer Science, or Human Nutrition\n• Hands-on pilot extrusion and texture profile analysis (TPA) expertise\n• Strong collaborative track record with B2B food manufacturing clients',
    hrEmail: 'me.biosciences.hr@iff.com',
    emailSubject: 'Application: Novel Plant-Based Protein R&D Technologist — Doha',
    applicationGuidelines:
      'Submit your CV and research summary via email to the IFF Middle East recruitment desk.',
    applyLink: 'https://www.iff.com/careers',
    tags: ['R&D', 'Nutrition', 'Plant Protein', 'Extrusion R&D'],
    postedAt: '6 days ago',
    expiryAt: '2026-12-15',
    isActive: true
  }
];

export const INITIAL_SCHOLARSHIPS: HubScholarship[] = [
  {
    id: 'sch-1',
    title: 'Erasmus Mundus Joint Master in Sustainable Food Systems (FOOD4S)',
    organization: 'European Union Consortium (KU Leuven, UCD, AgroParisTech, Lund)',
    country: 'Europe (EU)',
    specialization: 'Food Safety',
    deadline: '2027-01-15',
    fundingType: 'International',
    degreeLevel: 'MS / MSc (2 Years)',
    description:
      'Prestigious European Union 100% funded 120-ECTS joint Master degree focusing on Quantitative Food Safety Risk Assessment, Novel Food Processing Technologies, and Sustainable Food Value Chains across four partner universities. Includes EUR 1,400/month stipend, full tuition waiver, insurance, and travel allowance.',
    eligibility:
      '• Bachelor degree (16 years education) in Food Science, Food Engineering, or Human Nutrition\n• Minimum CGPA 3.2 / 4.0 (or First Division)\n• IELTS Academic 6.5 overall (no band below 6.0) or TOEFL iBT 90\n• 2 Academic/Industrial recommendation letters and motivation statement',
    hrEmail: 'admissions@food4s.eu',
    emailSubject: 'Scholarship Inquiry & Dossier Submission: Erasmus Mundus FOOD4S 2027 Intake',
    applicationGuidelines:
      'Prepare your academic transcripts, Europass CV, IELTS score report, and 2 reference letters. Submit via the official FOOD4S portal or email the consortium admissions office with the subject line below.',
    applyLink: 'https://www.food4s.eu',
    isActive: true
  },
  {
    id: 'sch-2',
    title: 'Wageningen University (WUR) Food Safety & QA Excellence Scholarship',
    organization: 'Wageningen University & Research',
    country: 'Netherlands',
    specialization: 'QA/QC',
    deadline: '2027-02-01',
    fundingType: 'Grants',
    degreeLevel: 'MSc Food Safety / Quality',
    description:
      'Ranked #1 globally in Agriculture & Food Science, WUR offers full tuition waivers (EUR 21,200/yr) and living grants for outstanding international students specializing in Food Law & Regulatory Affairs, Supply Chain Quality Assurance, or Applied Food Microbiology.',
    eligibility:
      '• BSc Hons in Food Science & Technology, Nutrition, or Biological Sciences\n• Top 10% academic standing in graduating cohort (CGPA >= 3.5/4.0 preferred)\n• Unconditional admission offer to WUR MSc Food Safety or Food Quality Management',
    hrEmail: 'fellowships.msc@wur.nl',
    emailSubject: 'Application: WUR Food Safety Excellence Scholarship (MSc 2027)',
    applicationGuidelines:
      'First apply for admission to the MSc Food Safety program via Studielink, then email your scholarship motivation dossier to the WUR Fellowship Coordinator.',
    applyLink: 'https://www.wur.nl/en/education-programmes/master/scholarships.htm',
    isActive: true
  },
  {
    id: 'sch-3',
    title: 'USDA Norman E. Borlaug International Dairy & Food Safety Fellowship',
    organization: 'United States Department of Agriculture (USDA FAS)',
    country: 'United States',
    specialization: 'Dairy',
    deadline: '2026-12-18',
    fundingType: 'Fellowships',
    degreeLevel: 'Visiting Research Fellowship',
    description:
      'Provides early-to-mid-career food scientists, dairy technologists, and regulatory officers with 12 weeks of intensive 1-on-1 laboratory mentorship at a US Land-Grant university focusing on SPS regulatory compliance and mycotoxin mitigation. Covers round-trip airfare, health insurance, and USD 3,200/mo stipend.',
    eligibility:
      '• MS or PhD in Food Science, Dairy Science, Analytical Chemistry, or Food Toxicology\n• At least 2 years current employment in food regulation, research, or academia\n• Actionable research proposal addressing food safety barriers',
    hrEmail: 'borlaugfellowships@usda.gov',
    emailSubject: 'Application Dossier: USDA Borlaug International Food Safety Fellowship',
    applicationGuidelines:
      'Send your 3-page research proposal, employer endorsement letter, and CV to the USDA FAS Fellowship desk or upload directly via the official portal.',
    applyLink: 'https://www.fas.usda.gov/programs/borlaug-fellowship-program',
    isActive: true
  },
  {
    id: 'sch-4',
    title: 'Commonwealth PhD Fellowship in Human Nutrition & Novel Food R&D',
    organization: 'UK Commonwealth Scholarship Commission (Reading / Leeds)',
    country: 'United Kingdom',
    specialization: 'Nutrition',
    deadline: '2026-12-12',
    fundingType: 'Fellowships',
    degreeLevel: 'PhD / Doctoral (3 Years)',
    description:
      'Full doctoral funding under the Commonwealth theme "Science and Technology for Development" for PhD candidates researching non-thermal food processing (HPP, PEF), clinical human nutrition, or gut microbiome modulation. Includes GBP 1,347/mo stipend, full UK tuition, and airfare.',
    eligibility:
      '• MSc/MPhil in Food Science & Technology, Human Nutrition, or Bioprocess Engineering\n• Confirmed support statement from a UK supervisor at a partner university\n• Citizen of an eligible Commonwealth nation (Pakistan, India, Bangladesh, Nigeria, Kenya, etc.)',
    hrEmail: 'phd.admissions@food.leeds.ac.uk',
    emailSubject: 'Prospective Commonwealth PhD Candidate: Supervisor Support Inquiry (Food Science & Nutrition)',
    applicationGuidelines:
      'Email prospective supervisors at Leeds/Reading with your research synopsis using the subject line below before submitting your final CSC UK online application.',
    applyLink: 'https://cscuk.fcdo.gov.uk/scholarships',
    isActive: true
  },
  {
    id: 'sch-5',
    title: 'IFT Feeding Tomorrow Graduate & Bakery/Protein R&D Science Grant',
    organization: 'Institute of Food Technologists (IFT Foundation)',
    country: 'United States',
    specialization: 'R&D',
    deadline: '2027-01-25',
    fundingType: 'Grants',
    degreeLevel: 'BS / MS / PhD',
    description:
      'Academic research grants ranging from USD 5,000 to USD 15,000 supporting promising BS, MS, and PhD students pursuing research in food quality assurance, cereal/bakery science, novel protein engineering, sensory science, and global food security.',
    eligibility:
      '• Enrolled full-time in an accredited Food Science & Technology degree program\n• Minimum GPA 3.0 / 4.0 and demonstrated leadership in food science projects\n• Endorsement from department head or academic advisor',
    hrEmail: 'feedingtomorrow@ift.org',
    emailSubject: 'Grant Application: IFT Feeding Tomorrow Food Science Research Scholarship',
    applicationGuidelines:
      'Email your academic advisor endorsement and research abstract to the IFT Feeding Tomorrow Foundation or submit via the official IFT portal.',
    applyLink: 'https://www.ift.org/community/students/scholarships',
    isActive: true
  }
];

export const INITIAL_TRAININGS: HubTraining[] = [];


