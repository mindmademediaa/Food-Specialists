import { HubUser, HubJob, HubScholarship, HubTraining } from '../types/hub';

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
    email: 'alex.tariq@foodspecialists.org',
    phone: '+92 300 8429104',
    skills: ['HACCP', 'ISO 22000', 'FSSC 22000', 'BRCGS', 'ISO 9001'],
    cvUrl: 'Alex_Tariq_FSQA_Lead_Auditor_CV.pdf',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: false,
      phone_public: false
    },
    createdAt: '2026-10-15T08:00:00Z',
    isAdmin: true
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
    email: 'sara.mahmood@foodspecialists.org',
    phone: '+92 321 4491022',
    skills: ['ISO 22000', 'FSSC 22000', 'HACCP', 'ISO 9001'],
    cvUrl: 'Dr_Sara_Mahmood_CV.pdf',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: true,
      phone_public: false
    },
    createdAt: '2026-10-18T10:30:00Z',
    isAdmin: false
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
    email: 'usman.farooq@foodspecialists.org',
    phone: '+92 333 9182736',
    skills: ['HACCP', 'FSSC 22000', 'ISO 9001'],
    cvUrl: '',
    privacySettings: {
      qualification_public: true,
      experience_public: false, // Hidden by member's privacy toggle
      currentRole_public: true,
      location_public: true,
      email_public: false,
      phone_public: false
    },
    createdAt: '2026-10-20T14:15:00Z',
    isAdmin: false
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
    email: 'ayesha.siddiqui@foodspecialists.org',
    phone: '+971 50 4829103',
    skills: ['HACCP', 'BRCGS', 'ISO 22000'],
    cvUrl: 'Ayesha_Siddiqui_RD_CV.pdf',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: false, // Hidden by member's privacy toggle
      email_public: true,
      phone_public: false
    },
    createdAt: '2026-10-22T09:00:00Z',
    isAdmin: false
  },
  {
    uid: 'user-bilal-5',
    name: 'Bilal Ahmed Khan',
    profilePicUrl: makeAvatarSvg('BK', '#DCFCE7', '#166534'),
    qualification: 'MS Food Safety & Halal Regulatory Affairs — IIUM Malaysia',
    experience:
      '6 years auditing slaughterhouses, flavor manufacturers, and GCC retail private-label suppliers against GSO 2055-1, MS 1500, and BRCGS Issue 9.',
    currentRole: 'Regional Halal & BRCGS Lead Auditor',
    company: 'Almarai Food Group',
    location: 'Riyadh, Saudi Arabia',
    email: 'bilal.khan@foodspecialists.org',
    phone: '+966 54 3198201',
    skills: ['BRCGS', 'FSSC 22000', 'ISO 22000', 'HACCP', 'ISO 9001'],
    cvUrl: 'Bilal_Khan_Halal_Auditor_CV.pdf',
    privacySettings: {
      qualification_public: true,
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: true,
      phone_public: true
    },
    createdAt: '2026-10-25T11:20:00Z',
    isAdmin: false
  },
  {
    uid: 'user-zainab-6',
    name: 'Zainab Raza',
    profilePicUrl: makeAvatarSvg('ZR', '#F3E8FF', '#6B21A8'),
    qualification: 'BS (Hons.) Food Science & Technology — Karachi University',
    experience:
      '2 years in poultry further-processing IQF line sanitation, ATP swab verification, and pre-operational SSOP compliance.',
    currentRole: 'Hygiene & HACCP Officer',
    company: 'K&N’s Foods',
    location: 'Karachi, Pakistan',
    email: 'zainab.raza@foodspecialists.org',
    phone: '+92 345 2109832',
    skills: ['HACCP', 'ISO 22000'],
    cvUrl: '',
    privacySettings: {
      qualification_public: false, // Hidden by member's privacy toggle
      experience_public: true,
      currentRole_public: true,
      location_public: true,
      email_public: false,
      phone_public: false
    },
    createdAt: '2026-10-28T16:45:00Z',
    isAdmin: false
  }
];

export const INITIAL_JOBS: HubJob[] = [
  {
    id: 'job-1',
    title: 'Lead Food Safety & FSSC 22000 Internal Auditor',
    company: 'Nestlé Nutrition & Dairy Operations',
    location: 'Lahore, Pakistan',
    experienceRequired: '3–5 Years',
    category: 'Quality & Safety',
    description:
      'Lead plant-wide Food Safety Management System (FSMS) verification across spray-drying and aseptic filling lines. Conduct monthly CCP verification audits, manage Prerequisite Programs (PRPs/OPRPs), and coordinate external surveillance audits under FSSC 22000 v6.',
    requirements:
      '• BSc/MSc in Food Science & Technology, Dairy Technology, or Microbiology\n• IRCA Certified Lead Auditor ISO 22000:2018 / FSSC 22000 v6\n• Minimum 3 years hands-on HACCP & allergen validation experience\n• Strong command of root-cause CAPA investigations and hygienic zoning',
    applyLink: 'https://www.nestle.pk/jobs',
    tags: ['FSSC 22000', 'HACCP', 'ISO 22000', 'Dairy QA'],
    postedAt: '2 hours ago',
    expiryAt: '2026-11-25',
    isActive: true
  },
  {
    id: 'job-2',
    title: 'Quality Assurance & Analytical Lab Executive (QA/QC)',
    company: 'Unilever Foods & Refreshment',
    location: 'Faisalabad, Pakistan',
    experienceRequired: '2–3 Years',
    category: 'Quality & Safety',
    description:
      'Manage physicochemical and microbiological release testing for savory dressings, culinary pastes, and tea blending lines. Maintain ISO/IEC 17025 lab calibration schedules, Brix/pH/viscosity SPC control charts, and SAP QM batch release workflows.',
    requirements:
      '• BS/MS in Food Technology, Analytical Chemistry, or Industrial Biotechnology\n• 2+ years QA/QC laboratory and in-line inspection experience in FMCG\n• Hands-on proficiency with Karl Fischer moisture, HunterLab colorimetry, and SAP QM',
    applyLink: 'https://careers.unilever.com',
    tags: ['SAP QM', 'ISO 17025', 'HACCP', 'QA/QC'],
    postedAt: '5 hours ago',
    expiryAt: '2026-11-28',
    isActive: true
  },
  {
    id: 'job-3',
    title: 'R&D Beverage Formulation & Pilot Lab Scientist',
    company: 'PepsiCo International Beverages',
    location: 'Lahore, Pakistan',
    experienceRequired: '3+ Years',
    category: 'R&D Lab',
    description:
      'Lead bench-top beverage formulation, sugar-reduction sweetener optimization, and pilot-plant UHT/carbonation scale-up trials. Collaborate with Quality and Regulatory teams to ensure nutritional compliance and thermal lethality validation.',
    requirements:
      '• BSc/MSc in Food Engineering or Food Science & Technology\n• 3+ years R&D product development experience in beverages or liquid dairy\n• Expertise in hydrocolloid stabilization, emulsion science, and thermal processing',
    applyLink: 'https://www.pepsicojobs.com',
    tags: ['R&D Formulation', 'Beverage Tech', 'Sensory', 'HACCP'],
    postedAt: '1 day ago',
    expiryAt: '2026-11-30',
    isActive: true
  },
  {
    id: 'job-4',
    title: 'Aseptic UHT & Spray-Drying Production Shift Engineer',
    company: 'FrieslandCampina Engro Pakistan',
    location: 'Sahiwal, Pakistan',
    experienceRequired: '2–4 Years',
    category: 'Production',
    description:
      'Supervise high-speed UHT milk processing, homogenizer pressure parameters, CIP sanitation cycles, and line OEE targets while maintaining strict zero-contamination hygiene compliance.',
    requirements:
      '• BSc in Food Engineering, Dairy Technology, or Chemical Engineering\n• 2–4 years thermal dairy processing and Tetra Pak aseptic line supervision\n• Strong command of CIP validation, mass-balance yield, and GMP compliance',
    applyLink: 'https://www.frieslandcampina.com.pk/careers',
    tags: ['UHT Dairy', 'CIP Validation', 'FSSC 22000', 'Production'],
    postedAt: '1 day ago',
    expiryAt: '2026-11-26',
    isActive: true
  },
  {
    id: 'job-5',
    title: 'Regional Halal Assurance & Regulatory Specialist',
    company: 'Almarai Food Manufacturing Group',
    location: 'Riyadh, Saudi Arabia',
    experienceRequired: '4+ Years',
    category: 'Quality & Safety',
    description:
      'Oversee SFDA regulatory dossier submissions, GSO 2055-1 Halal assurance audits of raw ingredient suppliers, and trace-forward verification for poultry and bakery processing plants across the GCC region.',
    requirements:
      '• Degree in Food Science, Food Technology, or Halal Science\n• Certified Halal Lead Auditor (GSO 2055-1 / MS 1500 / PS 3733)\n• Working fluency in Codex Alimentarius food labeling and additive standards',
    applyLink: 'https://www.almarai.com/en/careers',
    tags: ['Halal GSO 2055', 'SFDA Regulatory', 'ISO 22000'],
    postedAt: '2 days ago',
    expiryAt: '2026-12-02',
    isActive: true
  },
  {
    id: 'job-6',
    title: 'Sensory Evaluation & Shelf-Life Stability Scientist',
    company: 'Mondelēz International Confectionery R&D',
    location: 'Dubai, UAE',
    experienceRequired: '2–5 Years',
    category: 'R&D Lab',
    description:
      'Design and execute descriptive sensory panels (QDA, triangle tests, consumer hedonic trials) and accelerated shelf-life testing (ASLT) for chocolate and baked snack reformulations.',
    requirements:
      '• MSc in Food Science, Sensory Science, or Human Nutrition\n• Experience running sensory software and ANOVA statistical modeling\n• Strong understanding of lipid oxidation and water activity (aw)',
    applyLink: 'https://www.mondelezinternational.com/careers',
    tags: ['Sensory Panel', 'Shelf-Life ASLT', 'R&D Lab'],
    postedAt: '2 days ago',
    expiryAt: '2026-12-05',
    isActive: true
  },
  {
    id: 'job-7',
    title: 'HACCP & Plant Hygiene Compliance Officer',
    company: 'K&N’s Integrated Poultry Processing',
    location: 'Karachi, Pakistan',
    experienceRequired: '1–3 Years',
    category: 'Quality & Safety',
    description:
      'Supervise pre-operational and operational sanitation protocols (SSOPs), ATP bioluminescence swabbing, cold-chain CCP temperature logs, and personnel GMP compliance across IQF lines.',
    requirements:
      '• BS Hons in Food Science & Technology or Microbiology\n• HACCP Level 3 or Level 4 Award in Food Safety Management\n• 1–3 years experience in meat, poultry, or frozen food sanitation validation',
    applyLink: 'https://kandns.com/careers',
    tags: ['HACCP Level 3', 'ATP Swabbing', 'GMP Hygiene'],
    postedAt: '3 days ago',
    expiryAt: '2026-11-29',
    isActive: true
  },
  {
    id: 'job-8',
    title: 'Bakery & Extruded Snacks Production Line Supervisor',
    company: 'English Biscuit Manufacturers (EBM)',
    location: 'Karachi, Pakistan',
    experienceRequired: '2–4 Years',
    category: 'Production',
    description:
      'Manage dough rheology consistency, tunnel oven baking profiles, metal detector CCP verification, and high-speed flow-wrap packaging efficiency.',
    requirements:
      '• BSc/MSc in Food Science & Technology or Cereal Science\n• 2+ years production floor experience in biscuits, bakery, or snack extrusion\n• Hands-on knowledge of allergen changeover and waste reduction',
    applyLink: 'https://www.ebm.com.pk/careers',
    tags: ['Bakery Tech', 'BRCGS', 'HACCP', 'Production'],
    postedAt: '3 days ago',
    expiryAt: '2026-12-04',
    isActive: true
  },
  {
    id: 'job-9',
    title: 'BRCGS Issue 9 Food Safety & Supplier Quality Manager',
    company: 'Spinneys Fresh Food Supply Chain',
    location: 'Dubai, UAE',
    experienceRequired: '5+ Years',
    category: 'Quality & Safety',
    description:
      'Manage BRCGS Food Safety Issue 9 certification readiness, Food Defense (TACCP) and Food Fraud Vulnerability Assessments (VACCP) for private-label chilled meals.',
    requirements:
      '• MSc Food Safety Management or Food Technology\n• BRCGS Issue 9 Lead Auditor Certification mandatory\n• Experience with Dubai Municipality Montaji & FoodWatch portals',
    applyLink: 'https://www.spinneys.com/en-ae/careers',
    tags: ['BRCGS Issue 9', 'TACCP/VACCP', 'Supplier Audits'],
    postedAt: '4 days ago',
    expiryAt: '2026-12-10',
    isActive: true
  },
  {
    id: 'job-10',
    title: 'Food Microbiology & Pathogen PCR Lab Analyst',
    company: 'SGS Food Testing Laboratories',
    location: 'Lahore, Pakistan',
    experienceRequired: '1–3 Years',
    category: 'R&D Lab',
    description:
      'Conduct ISO 17025 accredited testing for Salmonella, Listeria monocytogenes, Cronobacter, and Aflatoxin M1/B1 using ELISA, HPLC, and real-time PCR.',
    requirements:
      '• MSc/MPhil in Food Microbiology, Microbiology, or Biotechnology\n• 2+ years experience in an ISO/IEC 17025 accredited food testing lab\n• Proficiency in aseptic media preparation and internal quality control',
    applyLink: 'https://www.sgs.com/en/our-company/careers',
    tags: ['ISO 17025', 'PCR Pathogen', 'Microbiology Lab'],
    postedAt: '4 days ago',
    expiryAt: '2026-12-08',
    isActive: true
  },
  {
    id: 'job-11',
    title: 'Sauces & Condiments Thermal Processing Executive',
    company: 'National Foods Limited (NFL)',
    location: 'Karachi, Pakistan',
    experienceRequired: '2–3 Years',
    category: 'Production',
    description:
      'Oversee batch cooking, hot-fill pasteurization CCP temperatures, cap torque integrity, and spice sterilization workflows for export-grade culinary lines.',
    requirements:
      '• BS/MS in Food Science & Technology or Chemical Engineering\n• 2+ years production supervision in culinary sauces, ketchups, or pickles\n• Familiarity with FDA FSMA acidified food thermal regulations',
    applyLink: 'https://www.nfoods.com/careers',
    tags: ['Thermal Processing', 'FSSC 22000', 'FDA FSMA'],
    postedAt: '5 days ago',
    expiryAt: '2026-12-12',
    isActive: true
  },
  {
    id: 'job-12',
    title: 'Novel Plant-Based Protein R&D Technologist',
    company: 'IFF / DuPont Nutrition & Biosciences',
    location: 'Doha, Qatar',
    experienceRequired: '3–5 Years',
    category: 'R&D Lab',
    description:
      'Formulate high-moisture extruded plant proteins, clean-label hydrocolloid binders, and natural flavor masking systems for next-generation meat and dairy alternatives.',
    requirements:
      '• MSc or PhD in Food Science, Biopolymer Science, or Protein Chemistry\n• Hands-on pilot extrusion and texture profile analysis (TPA) expertise\n• Strong collaborative track record with B2B food manufacturing clients',
    applyLink: 'https://www.iff.com/careers',
    tags: ['Plant Protein', 'Extrusion R&D', 'Hydrocolloids'],
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
    country: 'Belgium, Ireland, France & Sweden',
    deadline: '2027-01-15',
    fundingType: 'International',
    degreeLevel: 'MS / MSc (2 Years)',
    description:
      'Prestigious European Union 100% funded 120-ECTS joint Master degree focusing on Quantitative Food Safety Risk Assessment, Novel Food Processing Technologies, and Sustainable Food Value Chains across four partner universities. Includes EUR 1,400/month stipend, full tuition waiver, insurance, and travel allowance.',
    eligibility:
      '• Bachelor degree (16 years education) in Food Science, Food Engineering, or Human Nutrition\n• Minimum CGPA 3.2 / 4.0 (or First Division)\n• IELTS Academic 6.5 overall (no band below 6.0) or TOEFL iBT 90\n• 2 Academic/Industrial recommendation letters and motivation statement',
    applyLink: 'https://www.food4s.eu',
    isActive: true
  },
  {
    id: 'sch-2',
    title: 'Wageningen University (WUR) Food Safety Excellence Scholarship',
    organization: 'Wageningen University & Research',
    country: 'Netherlands',
    deadline: '2027-02-01',
    fundingType: 'Grants',
    degreeLevel: 'MSc Food Safety / Quality',
    description:
      'Ranked #1 globally in Agriculture & Food Science, WUR offers full tuition waivers (EUR 21,200/yr) and living grants for outstanding international students specializing in Food Law & Regulatory Affairs, Supply Chain Safety, or Applied Food Microbiology.',
    eligibility:
      '• BSc Hons in Food Science & Technology, Nutrition, or Biological Sciences\n• Top 10% academic standing in graduating cohort (CGPA >= 3.5/4.0 preferred)\n• Unconditional admission offer to WUR MSc Food Safety or Food Quality Management',
    applyLink: 'https://www.wur.nl/en/education-programmes/master/scholarships.htm',
    isActive: true
  },
  {
    id: 'sch-3',
    title: 'USDA Norman E. Borlaug International Food Safety Fellowship',
    organization: 'United States Department of Agriculture (USDA FAS)',
    country: 'United States',
    deadline: '2026-12-18',
    fundingType: 'Fellowships',
    degreeLevel: 'Visiting Research Fellowship',
    description:
      'Provides early-to-mid-career food scientists, regulatory officers, and university faculty with 12 weeks of intensive 1-on-1 laboratory mentorship at a US Land-Grant university focusing on SPS regulatory compliance and mycotoxin mitigation. Covers round-trip airfare, health insurance, and USD 3,200/mo stipend.',
    eligibility:
      '• MS or PhD in Food Science, Analytical Chemistry, or Food Toxicology\n• At least 2 years current employment in food regulation, research, or academia\n• Actionable research proposal addressing food safety barriers',
    applyLink: 'https://www.fas.usda.gov/programs/borlaug-fellowship-program',
    isActive: true
  },
  {
    id: 'sch-4',
    title: 'Commonwealth PhD Fellowship in Novel Food Preservation',
    organization: 'UK Commonwealth Scholarship Commission (Reading / Leeds)',
    country: 'United Kingdom',
    deadline: '2026-12-12',
    fundingType: 'Fellowships',
    degreeLevel: 'PhD / Doctoral (3 Years)',
    description:
      'Full doctoral funding under the Commonwealth theme "Science and Technology for Development" for PhD candidates researching non-thermal food processing (HPP, PEF), active antimicrobial packaging, or gut microbiome modulation. Includes GBP 1,347/mo stipend, full UK tuition, and airfare.',
    eligibility:
      '• MSc/MPhil in Food Science & Technology, Human Nutrition, or Bioprocess Engineering\n• Confirmed support statement from a UK supervisor at a partner university\n• Citizen of an eligible Commonwealth nation (Pakistan, India, Bangladesh, Nigeria, Kenya, etc.)',
    applyLink: 'https://cscuk.fcdo.gov.uk/scholarships',
    isActive: true
  },
  {
    id: 'sch-5',
    title: 'IFT Feeding Tomorrow Graduate & Undergraduate Food Science Grant',
    organization: 'Institute of Food Technologists (IFT Foundation)',
    country: 'Global / United States',
    deadline: '2027-01-25',
    fundingType: 'Grants',
    degreeLevel: 'BS / MS / PhD',
    description:
      'Academic research grants ranging from USD 5,000 to USD 15,000 supporting promising BS, MS, and PhD students pursuing research in food quality assurance, novel protein engineering, sensory science, and global food security.',
    eligibility:
      '• Enrolled full-time in an accredited Food Science & Technology degree program\n• Minimum GPA 3.0 / 4.0 and demonstrated leadership in food science projects\n• Endorsement from department head or academic advisor',
    applyLink: 'https://www.ift.org/community/students/scholarships',
    isActive: true
  }
];

export const INITIAL_TRAININGS: HubTraining[] = [
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
