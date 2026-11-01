import { Opportunity, UserProfile, ComplianceTask, CareerObjective } from '../types';

export const DEFAULT_AVATAR_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none">
  <rect width="240" height="240" rx="120" fill="#E3F2E6"/>
  <circle cx="120" cy="120" r="106" stroke="#229453" stroke-width="8" fill="#F4F9F5"/>
  <text x="120" y="148" text-anchor="middle" fill="#1B432C" font-family="Plus Jakarta Sans, sans-serif" font-size="88" font-weight="700">A</text>
</svg>
`)}`;

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  // ================= 12 FOOD JOBS (Quality & Safety, R&D Lab, Production) =================
  {
    id: 'job-1',
    title: 'Lead Food Safety & FSSC 22000 Internal Auditor',
    organization: 'Nestlé Nutrition & Dairy Operations',
    location: 'Lahore, Pakistan · On-site',
    compensation: 'PKR 240,000 – 310,000 / mo',
    postedDate: 'Today',
    deadline: '2026-11-20',
    category: 'food-safety',
    subCategory: 'Quality & Safety',
    employmentType: 'Full-Time',
    description:
      'Lead plant-wide Food Safety Management System (FSMS) verification across spray-drying and aseptic filling lines. Conduct monthly CCP verification audits, manage Prerequisite Programs (PRPs/OPRPs), and coordinate external surveillance audits under FSSC 22000 v6.',
    requirements: [
      'BSc/MSc in Food Science & Technology, Dairy Technology, or Microbiology',
      'IRCA Certified Lead Auditor ISO 22000:2018 / FSSC 22000 v6',
      'Minimum 3 years hands-on HACCP & allergen validation experience',
      'Strong command of root-cause CAPA investigations and hygienic zoning'
    ],
    applicationUrl: 'careers.nestle.com/food-safety-lead-auditor'
  },
  {
    id: 'job-2',
    title: 'Quality Assurance & Analytical Lab Executive (QA/QC)',
    organization: 'Unilever Foods & Refreshment',
    location: 'Faisalabad, Pakistan · On-site',
    compensation: 'PKR 165,000 – 195,000 / mo',
    postedDate: 'Today',
    deadline: '2026-11-22',
    category: 'food-quality',
    subCategory: 'Quality & Safety',
    employmentType: 'Full-Time',
    description:
      'Manage physicochemical and microbiological release testing for savory dressings, culinary pastes, and tea blending lines. Maintain ISO/IEC 17025 lab calibration schedules, Brix/pH/viscosity SPC control charts, and SAP QM batch release workflows.',
    requirements: [
      'BS/MS in Food Technology, Analytical Chemistry, or Industrial Biotechnology',
      '2+ years QA/QC laboratory and in-line inspection experience in FMCG',
      'Hands-on proficiency with Karl Fischer moisture, HunterLab colorimetry, and SAP QM'
    ],
    applicationUrl: 'careers.unilever.com/qa-qc-executive'
  },
  {
    id: 'job-3',
    title: 'R&D Beverage Formulation & Pilot Lab Scientist',
    organization: 'PepsiCo International Beverages',
    location: 'Lahore, Pakistan · On-site',
    compensation: 'PKR 210,000 – 260,000 / mo',
    postedDate: '1 day ago',
    deadline: '2026-11-30',
    category: 'food-quality',
    subCategory: 'R&D Lab',
    employmentType: 'Full-Time',
    description:
      'Lead bench-top beverage formulation, sugar-reduction sweetener optimization, and pilot-plant UHT/carbonation scale-up trials. Collaborate with Quality and Regulatory teams to ensure nutritional compliance and thermal lethality validation.',
    requirements: [
      'BSc/MSc in Food Engineering or Food Science & Technology',
      '3+ years R&D product development experience in beverages or liquid dairy',
      'Expertise in hydrocolloid stabilization, emulsion science, and thermal processing'
    ],
    applicationUrl: 'pepsicojobs.com/rd-beverage-technologist'
  },
  {
    id: 'job-4',
    title: 'Aseptic UHT & Spray-Drying Production Shift Engineer',
    organization: 'FrieslandCampina Engro Pakistan',
    location: 'Sahiwal, Pakistan · On-site',
    compensation: 'PKR 185,000 – 230,000 / mo',
    postedDate: '1 day ago',
    deadline: '2026-11-26',
    category: 'food-quality',
    subCategory: 'Production',
    employmentType: 'Full-Time',
    description:
      'Supervise high-speed UHT milk processing, homogenizer pressure parameters, CIP sanitation cycles, and line OEE targets while maintaining strict zero-contamination hygiene compliance.',
    requirements: [
      'BSc in Food Engineering, Dairy Technology, or Chemical Engineering',
      '2–4 years thermal dairy processing and Tetra Pak aseptic line supervision',
      'Strong command of CIP validation, mass-balance yield, and GMP compliance'
    ],
    applicationUrl: 'frieslandcampina.com/careers/uht-production'
  },
  {
    id: 'job-5',
    title: 'Regional Halal Assurance & Regulatory Compliance Specialist',
    organization: 'Almarai Food Manufacturing Group',
    location: 'Riyadh, Saudi Arabia · Relocation Provided',
    compensation: 'SAR 14,500 – 18,000 / mo',
    postedDate: '2 days ago',
    deadline: '2026-11-28',
    category: 'food-safety',
    subCategory: 'Quality & Safety',
    employmentType: 'Full-Time',
    description:
      'Oversee SFDA regulatory dossier submissions, GSO 2055-1 Halal assurance audits of raw ingredient suppliers, and trace-forward verification for poultry and bakery processing plants across the GCC region.',
    requirements: [
      'Degree in Food Science, Food Technology, or Halal Science',
      'Certified Halal Lead Auditor (GSO 2055-1 / MS 1500 / PS 3733)',
      'Working fluency in Codex Alimentarius food labeling and additive standards'
    ],
    applicationUrl: 'careers.almarai.com/halal-regulatory-specialist'
  },
  {
    id: 'job-6',
    title: 'Sensory Evaluation & Shelf-Life Stability Scientist',
    organization: 'Mondelēz International Confectionery R&D',
    location: 'Cairo, Egypt / Hybrid',
    compensation: 'USD 2,800 – 3,500 / mo',
    postedDate: '2 days ago',
    deadline: '2026-11-29',
    category: 'food-quality',
    subCategory: 'R&D Lab',
    employmentType: 'Full-Time',
    description:
      'Design and execute descriptive sensory panels (QDA, triangle tests, consumer hedonic trials) and accelerated shelf-life testing (ASLT) for chocolate and baked snack reformulations.',
    requirements: [
      'MSc in Food Science, Sensory Science, or Human Nutrition',
      'Experience running sensory software and ANOVA statistical modeling',
      'Strong understanding of lipid oxidation, water activity (aw), and texture profile analysis'
    ],
    applicationUrl: 'mondelezinternational.com/careers/sensory-scientist'
  },
  {
    id: 'job-7',
    title: 'HACCP & Plant Hygiene Compliance Officer',
    organization: 'K&N’s Integrated Poultry Processing',
    location: 'Karachi, Pakistan · On-site',
    compensation: 'PKR 135,000 – 165,000 / mo',
    postedDate: '3 days ago',
    deadline: '2026-11-18',
    category: 'food-safety',
    subCategory: 'Quality & Safety',
    employmentType: 'Full-Time',
    description:
      'Supervise pre-operational and operational sanitation protocols (SSOPs), ATP bioluminescence swabbing, cold-chain CCP temperature logs, and personnel GMP compliance across IQF lines.',
    requirements: [
      'BS Hons in Food Science & Technology or Microbiology',
      'HACCP Level 3 or Level 4 Award in Food Safety Management',
      '1–3 years experience in meat, poultry, or frozen food sanitation validation'
    ],
    applicationUrl: 'kandns.com/careers/haccp-hygiene-officer'
  },
  {
    id: 'job-8',
    title: 'Bakery & Extruded Snacks Production Line Supervisor',
    organization: 'English Biscuit Manufacturers (EBM)',
    location: 'Karachi, Pakistan · On-site',
    compensation: 'PKR 150,000 – 185,000 / mo',
    postedDate: '3 days ago',
    deadline: '2026-12-01',
    category: 'food-quality',
    subCategory: 'Production',
    employmentType: 'Full-Time',
    description:
      'Manage dough rheology consistency, tunnel oven baking profiles, metal detector CCP verification, and high-speed flow-wrap packaging efficiency.',
    requirements: [
      'BSc/MSc in Food Science & Technology or Cereal Science',
      '2+ years production floor experience in biscuits, bakery, or snack extrusion',
      'Hands-on knowledge of allergen changeover and waste reduction'
    ],
    applicationUrl: 'ebm.com.pk/careers/production-supervisor'
  },
  {
    id: 'job-9',
    title: 'BRCGS Issue 9 Food Safety & Supplier Quality Manager',
    organization: 'Spinneys Fresh Food Supply Chain',
    location: 'Dubai, UAE · Hybrid',
    compensation: 'AED 16,000 – 21,000 / mo',
    postedDate: '4 days ago',
    deadline: '2026-12-05',
    category: 'food-safety',
    subCategory: 'Quality & Safety',
    employmentType: 'Full-Time',
    description:
      'Manage BRCGS Food Safety Issue 9 certification readiness, Food Defense (TACCP) and Food Fraud Vulnerability Assessments (VACCP) for private-label chilled meals.',
    requirements: [
      'MSc Food Safety Management or Food Technology',
      'BRCGS Issue 9 Lead Auditor Certification mandatory',
      'Experience with Dubai Municipality Montaji & FoodWatch portals'
    ],
    applicationUrl: 'spinneys.com/careers/brcgs-manager'
  },
  {
    id: 'job-10',
    title: 'Food Microbiology & Pathogen PCR Lab Analyst',
    organization: 'SGS Food Testing Laboratories',
    location: 'Lahore, Pakistan · On-site',
    compensation: 'PKR 125,000 – 155,000 / mo',
    postedDate: '4 days ago',
    deadline: '2026-12-04',
    category: 'food-quality',
    subCategory: 'R&D Lab',
    employmentType: 'Full-Time',
    description:
      'Conduct ISO 17025 accredited testing for Salmonella, Listeria monocytogenes, Cronobacter, and Aflatoxin M1/B1 using ELISA, HPLC, and real-time PCR.',
    requirements: [
      'MSc/MPhil in Food Microbiology, Microbiology, or Biotechnology',
      '2+ years experience in an ISO/IEC 17025 accredited food testing lab',
      'Proficiency in aseptic media preparation and internal quality control'
    ],
    applicationUrl: 'sgs.com/careers/food-microbiology-analyst'
  },
  {
    id: 'job-11',
    title: 'Sauces & Condiments Thermal Processing Executive',
    organization: 'National Foods Limited (NFL)',
    location: 'Port Qasim, Karachi · On-site',
    compensation: 'PKR 160,000 – 190,000 / mo',
    postedDate: '5 days ago',
    deadline: '2026-12-08',
    category: 'food-quality',
    subCategory: 'Production',
    employmentType: 'Full-Time',
    description:
      'Oversee batch cooking, hot-fill pasteurization CCP temperatures, cap torque integrity, and spice sterilization workflows for export-grade culinary lines.',
    requirements: [
      'BS/MS in Food Science & Technology or Chemical Engineering',
      '2+ years production supervision in culinary sauces, ketchups, or pickles',
      'Familiarity with FDA FSMA acidified food thermal regulations'
    ],
    applicationUrl: 'nfoods.com/careers/thermal-processing-executive'
  },
  {
    id: 'job-12',
    title: 'Novel Plant-Based Protein R&D Technologist',
    organization: 'IFF / DuPont Nutrition & Biosciences',
    location: 'Doha / Dubai · Regional Role',
    compensation: 'USD 3,600 – 4,400 / mo',
    postedDate: '6 days ago',
    deadline: '2026-12-12',
    category: 'food-quality',
    subCategory: 'R&D Lab',
    employmentType: 'Full-Time',
    description:
      'Formulate high-moisture extruded plant proteins, clean-label hydrocolloid binders, and natural flavor masking systems for next-generation meat and dairy alternatives.',
    requirements: [
      'MSc or PhD in Food Science, Biopolymer Science, or Protein Chemistry',
      'Hands-on pilot extrusion and texture profile analysis (TPA) expertise',
      'Strong collaborative track record with B2B food manufacturing clients'
    ],
    applicationUrl: 'iff.com/careers/plant-protein-rd'
  },

  // ================= 5 SCHOLARSHIPS (Fellowships, International, Grants) =================
  {
    id: 'sch-1',
    title: 'Erasmus Mundus Joint Master in Sustainable Food Systems (FOOD4S)',
    organization: 'EU Consortium (KU Leuven, UCD Dublin, AgroParisTech, Lund)',
    location: 'Belgium, Ireland, France & Sweden',
    compensation: 'EUR 1,400 / mo Stipend + 100% Tuition',
    postedDate: '2 days ago',
    deadline: '2027-01-15',
    category: 'scholarship',
    subCategory: 'International',
    employmentType: '2-Year Master Scholarship',
    description:
      'Prestigious European Union fully funded 120-ECTS joint Master degree focusing on Quantitative Food Safety Risk Assessment, Novel Food Processing Technologies, and Sustainable Food Value Chains across four partner universities.',
    requirements: [
      'Bachelor degree (16 years education) in Food Science, Food Engineering, or Nutrition',
      'Minimum CGPA 3.2 / 4.0 (or First Division)',
      'IELTS Academic 6.5 overall (no band below 6.0) or TOEFL iBT 90',
      '2 Academic/Industrial letters of recommendation'
    ],
    applicationUrl: 'erasmus-plus.ec.europa.eu/food4s-scholarship'
  },
  {
    id: 'sch-2',
    title: 'Wageningen University (WUR) MSc Food Safety Excellence Grant',
    organization: 'Wageningen University & Research',
    location: 'Wageningen, Netherlands',
    compensation: 'Full Tuition Waiver (EUR 21,200/yr) + Living Grant',
    postedDate: '3 days ago',
    deadline: '2027-02-01',
    category: 'scholarship',
    subCategory: 'Grants',
    employmentType: '2-Year MSc Grant',
    description:
      'Ranked #1 globally in Agriculture & Food Science, WUR offers full grants for outstanding candidates specializing in Food Law & Regulatory Affairs, Supply Chain Safety, or Applied Food Microbiology.',
    requirements: [
      'BSc Hons in Food Science & Technology, Nutrition, or Biological Sciences',
      'Top 10% academic standing in graduating cohort (CGPA >= 3.5/4.0 preferred)',
      'Unconditional admission offer to WUR MSc Food Safety or Food Quality Management'
    ],
    applicationUrl: 'wur.nl/en/education-programmes/scholarships/food-safety'
  },
  {
    id: 'sch-3',
    title: 'USDA Norman E. Borlaug International Food Safety Fellowship',
    organization: 'United States Department of Agriculture (USDA FAS)',
    location: 'United States Land-Grant Universities',
    compensation: 'Airfare + USD 3,200 / mo Research Stipend',
    postedDate: '4 days ago',
    deadline: '2026-12-18',
    category: 'scholarship',
    subCategory: 'Fellowships',
    employmentType: '12-Week Visiting Fellowship',
    description:
      'Provides early-to-mid-career food scientists, regulatory officers, and university faculty with 12 weeks of intensive 1-on-1 laboratory mentorship at a US university focusing on SPS regulatory compliance and mycotoxin mitigation.',
    requirements: [
      'MS or PhD in Food Science, Analytical Chemistry, or Food Toxicology',
      'At least 2 years current employment in food regulation, research, or academia',
      'Actionable research proposal addressing food safety standards'
    ],
    applicationUrl: 'fas.usda.gov/programs/borlaug-fellowship-program'
  },
  {
    id: 'sch-4',
    title: 'Commonwealth PhD Fellowship in Novel Food Preservation',
    organization: 'UK Commonwealth Scholarship Commission (Reading / Leeds)',
    location: 'United Kingdom · Fully Funded PhD',
    compensation: 'GBP 1,347 / mo Stipend + Full UK Tuition',
    postedDate: '5 days ago',
    deadline: '2026-12-12',
    category: 'scholarship',
    subCategory: 'Fellowships',
    employmentType: '3-Year Doctoral Fellowship',
    description:
      'Full doctoral funding under the Commonwealth theme "Science and Technology for Development" for PhD candidates researching non-thermal food processing (HPP, PEF), active antimicrobial packaging, or gut microbiome modulation.',
    requirements: [
      'MSc/MPhil in Food Science & Technology, Human Nutrition, or Bioprocess Engineering',
      'Confirmed support statement from a UK supervisor at a partner university',
      'Citizen of an eligible Commonwealth nation'
    ],
    applicationUrl: 'cscuk.fcdo.gov.uk/scholarships/commonwealth-phd'
  },
  {
    id: 'sch-5',
    title: 'IFT Feeding Tomorrow Graduate & Undergraduate Food Science Grant',
    organization: 'Institute of Food Technologists (IFT Foundation)',
    location: 'Global / Accredited Food Science Programs',
    compensation: 'USD 5,000 – 15,000 Academic Research Grant',
    postedDate: '1 week ago',
    deadline: '2027-01-25',
    category: 'scholarship',
    subCategory: 'Grants',
    employmentType: 'Annual Academic Grant',
    description:
      'Supports promising BS, MS, and PhD students pursuing research in food quality assurance, novel protein engineering, sensory science, and global food security.',
    requirements: [
      'Enrolled full-time in an accredited Food Science & Technology degree program',
      'Minimum GPA 3.0 / 4.0 and demonstrated leadership in food science projects',
      'Endorsement from department head or academic advisor'
    ],
    applicationUrl: 'ift.org/community/students/scholarships'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  avatarUrl: DEFAULT_AVATAR_SVG,
  fullName: 'Alex Tariq, MSc',
  professionalTitle: 'Food Science • Food Technology Specialist (Lead Auditor ISO 22000)',
  email: 'alex.tariq@foodspecialists.org',
  phone: '+92 300 8429104',
  location: 'Lahore, Pakistan (Open to GCC & EU Relocation)',
  linkedin: 'linkedin.com/in/alex-tariq-fsqa',
  summary:
    'Result-driven Food Safety & Quality Assurance Specialist with 5+ years of progressive FMCG experience across UHT dairy, aseptic beverage, and frozen food manufacturing. IRCA Certified Lead Auditor for ISO 22000:2018 & FSSC 22000 v6.',
  skills: [
    'FSSC 22000 v6 Auditing',
    'HACCP Plan Validation (CCP/OPRP)',
    'BRCGS Food Safety Issue 9',
    'Halal Assurance (PS 3733 / GSO 2055-1)',
    'ISO/IEC 17025 Lab Management',
    'Microbiological Swab & ATP Monitoring',
    'SAP QM Batch Release & SPC',
    'Sensory Panel & Shelf-Life Testing'
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'MSc (Hons.) Food Science & Technology',
      institution: 'National Institute of Food Science & Technology (NIFSAT)',
      graduationYear: '2021',
      cgpa: '3.84 / 4.00'
    },
    {
      id: 'edu-2',
      degree: 'BSc (Hons.) Food Science & Technology',
      institution: 'University of the Punjab, Lahore',
      graduationYear: '2019',
      cgpa: '3.71 / 4.00'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Quality Assurance & Food Safety Executive',
      company: 'Prime Dairy & Nutrition Ltd.',
      sector: 'UHT Dairy & Spray-Dried Infant Formula',
      duration: 'Jan 2023 – Present',
      responsibilities:
        'Lead the plant HACCP & FSSC 22000 v6 Food Safety Team across 4 high-speed aseptic filling lines. Conduct monthly GMP, glass & brittle plastic, and allergen changeover audits.'
    },
    {
      id: 'exp-2',
      jobTitle: 'Quality Control & Microbiological Lab Analyst',
      company: 'Crown Beverage & Juice Industries',
      sector: 'Aseptic Fruit Juices & Carbonated Soft Drinks',
      duration: 'Aug 2021 – Dec 2022',
      responsibilities:
        'Executed online physicochemical testing (Brix, titratable acidity, CO2 gas volume) and 5-stage water treatment microbiological monitoring.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'CIP Chemical & Thermal Cycle Optimization on UHT Pasteurizer #2',
      role: 'Lead QA Process Investigator',
      year: '2025',
      outcomes:
        'Validated ATP bioluminescence and rinse-water conductivity cutoffs, reducing caustic soda consumption by 18% while maintaining 100% zero-coliform swab pass rates.'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'CQI / IRCA Certified ISO 22000:2018 & FSSC 22000 v6 Lead Auditor',
      issuingBody: 'SGS Academy United Kingdom',
      year: '2024',
      credentialId: 'IRCA-FSMS-2024-88912'
    },
    {
      id: 'cert-2',
      name: 'Level 4 Award in Managing HACCP for Food Manufacturing',
      issuingBody: 'Highfield Qualifications (UK)',
      year: '2023',
      credentialId: 'HQ-HACCP4-77410'
    },
    {
      id: 'cert-3',
      name: 'BRCGS Global Standard for Food Safety Issue 9 Lead Auditor',
      issuingBody: 'BRCGS Academy',
      year: '2023',
      credentialId: 'BRCGS-I9-55209'
    }
  ]
};

export const INITIAL_TASKS: ComplianceTask[] = [
  {
    id: 'task-d-1',
    title: 'Verify Cold Storage CCP-1 & Pasteurizer CCP-2 Temperature Charts',
    category: 'HACCP CCP Monitoring',
    horizon: 'daily',
    dueDate: '2026-11-01',
    dueTime: '09:00',
    priority: 'high',
    completed: false,
    notes: 'Confirm chiller stays <= 4.0°C and UHT holding tube >= 138°C for 4 sec.'
  }
];

export const INITIAL_OBJECTIVES: CareerObjective[] = [
  {
    id: 'obj-1',
    year: 2026,
    targetQuarter: 'Q2 2026',
    type: 'certification',
    title: 'Complete FSSC 22000 Version 6 Lead Auditor Upgrade Certification',
    providerOrTarget: 'CQI / IRCA & SGS Academy',
    status: 'achieved',
    notes: 'Passed exam with 92% score.'
  }
];
