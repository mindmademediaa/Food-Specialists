import React, { useMemo, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ClipboardCopy,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Linkedin,
  Megaphone,
  MessageSquare,
  Search,
  Share2,
  Sparkles,
  Wrench,
  GraduationCap
} from 'lucide-react';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import { INTERNATIONAL_TRAINING_COURSES } from '../data/internationalTrainingsData';

export type ShareStudioCategory = 'tools' | 'pages' | 'courses';

export interface ShareableTargetItem {
  id: string;
  category: ShareStudioCategory;
  badge: string;
  title: string;
  subtitle: string;
  url: string;
  benefits: string[];
  hashtags: string;
  mockup: {
    headerLabel: string;
    statusLabel: string;
    inputs: Array<{ label: string; value: string }>;
    outputs: Array<{ label: string; value: string; highlight?: boolean }>;
    actionLabel: string;
  };
}

interface AdminSocialShareStudioProps {
  jobsCount: number;
  scholarshipsCount: number;
  trainingsCount: number;
  communityCount: number;
  onSetBanner?: (msg: string) => void;
}

const PORTAL_BASE_URL = 'https://foodscienceportal.com';

export const AdminSocialShareStudio: React.FC<AdminSocialShareStudioProps> = ({
  jobsCount,
  scholarshipsCount,
  trainingsCount,
  communityCount,
  onSetBanner
}) => {
  const [categoryTab, setCategoryTab] = useState<ShareStudioCategory>('tools');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>('tool-pearson-square');
  const [customPostText, setCustomPostText] = useState<string>('');
  const [isPostEdited, setIsPostEdited] = useState<boolean>(false);
  const [copiedType, setCopiedType] = useState<'post' | 'link' | 'image' | null>(
    null
  );
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const previewCardRef = useRef<HTMLDivElement | null>(null);

  const allTargets = useMemo<ShareableTargetItem[]>(() => {
    const toolItems: ShareableTargetItem[] = [
      {
        id: 'tool-hub',
        category: 'tools',
        badge: 'All-in-One Tools Hub',
        title: '16 Industrial Food Science & QA/QC Calculators Hub',
        subtitle:
          'Complete Food Safety, Laboratory, Dairy, Production OEE, Audit Vault & QR CAPA Toolkit.',
        url: `${PORTAL_BASE_URL}/?section=tools`,
        benefits: [
          'Instant browser-based QA/QC, Lab & Dairy batch calculations',
          'ISO 9001, FSSC 22000 & HACCP Company Document Builder Vault',
          'QR Code Customer Complaint Intake & RCA/CAPA Tracking',
          'Food Authority Limits Lookup (PFA, PSQCA, SFDA, Codex)'
        ],
        hashtags: '#FoodScience #QAQC #FoodSafety #HACCP #ISO22000',
        mockup: {
          headerLabel: 'Specialist QA/QC & Lab Suite',
          statusLabel: '16 Live Tools',
          inputs: [
            { label: 'Active Modules', value: '16 Engineering & Lab Tools' },
            { label: 'Compliance Scope', value: 'ISO 9001 · FSSC 22000 · HACCP' }
          ],
          outputs: [
            { label: 'Free Tier Access', value: 'Live Calculation & Preview', highlight: true },
            { label: 'Offline Mode', value: 'Factory Floor Ready' }
          ],
          actionLabel: 'Open 16 Tools Hub'
        }
      },
      {
        id: 'tool-pearson-square',
        category: 'tools',
        badge: 'Dairy & Beverage Batch Tool',
        title: 'Pearson Square & Multi-Industry Batch Standardization',
        subtitle:
          'Standardize Milk Fat & SNF, Juice Brix, Acidity, pH, Ketchup & Mayonnaise batches in seconds.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=pearson-square`,
        benefits: [
          'Eliminates manual dairy cream/skim-milk mixing errors on the floor',
          'Supports Fat%, SNF%, Brix, Titratable Acidity & pH targets',
          'Outputs exact kg & % weights for total production batch size',
          'Export official batch standardization sheets for QA audit files'
        ],
        hashtags: '#DairyTechnology #PearsonSquare #FoodProcessing #QAQC',
        mockup: {
          headerLabel: 'Pearson Square Standardization',
          statusLabel: 'Milk Fat · 1,000 kg Batch',
          inputs: [
            { label: 'High-Fat Cream Fat %', value: '40.0%' },
            { label: 'Skim Milk Fat %', value: '0.1%' },
            { label: 'Target Standardized Milk', value: '3.5% Fat' }
          ],
          outputs: [
            { label: 'Required Cream (40%)', value: '85.2 kg (8.52%)', highlight: true },
            { label: 'Required Skim Milk', value: '914.8 kg (91.48%)' }
          ],
          actionLabel: 'Calculate Batch Mix'
        }
      },
      {
        id: 'tool-templates-vault',
        category: 'tools',
        badge: 'ISO 9001 · FSSC 22000 · HACCP',
        title: 'QA/QC & Audit Document Template Vault (15 Modules)',
        subtitle:
          'Enter your company data once and generate complete ISO 9001, FSSC 22000 & HACCP documentation.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=templates-vault`,
        benefits: [
          'Builds SOPs, Approved Supplier Program & Pest Management Plans',
          'Covers all 12 Codex HACCP steps: Team, Flow Diagram, Hazard & CCP',
          'Includes Critical Limits, Monitoring Checklists, CAPA & Risk Matrix',
          'Outputs company-branded, audit-ready PDF & Word-ready records'
        ],
        hashtags: '#FSSC22000 #ISO9001 #HACCP #FoodSafetyAudit #QAQC',
        mockup: {
          headerLabel: 'Enterprise QA/QC Document Vault',
          statusLabel: '15 Audit Modules',
          inputs: [
            { label: 'Standards Covered', value: 'ISO 9001 + FSSC 22000 + HACCP' },
            { label: 'HACCP Workflow', value: 'Team · Flow · Hazard · CCP · CL' }
          ],
          outputs: [
            { label: 'Company Branding', value: 'Logo + Doc Code + Rev #', highlight: true },
            { label: 'Audit Export', value: 'Instant Print / PDF Package' }
          ],
          actionLabel: 'Build Company QA/QC Docs'
        }
      },
      {
        id: 'tool-complaint-handling',
        category: 'tools',
        badge: 'QR Intake · RCA · CAPA PDF',
        title: 'Organization Complaint Handling & QR CAPA Directory',
        subtitle:
          'Generate a custom QR Customer Complaint Portal with your Company Logo, Root Cause & CAPA sign-off.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=complaint-handling`,
        benefits: [
          'Instant branded QR Code & Public Intake Link per factory/company',
          'Isolated organization records with batch, severity & photo tracking',
          'Guided 5-Why Root Cause Analysis & Corrective/Preventive Action',
          'Generates signed CAPA Closure PDFs naming investigating QA officer'
        ],
        hashtags: '#ComplaintManagement #CAPA #RootCauseAnalysis #FoodSafety',
        mockup: {
          headerLabel: 'QR Complaint & CAPA Workbench',
          statusLabel: 'Isolated Org Portal',
          inputs: [
            { label: 'Intake Mode', value: 'Branded Company QR + Direct URL' },
            { label: 'Investigation', value: '5-Why RCA + CAPA Ownership' }
          ],
          outputs: [
            { label: 'Traceability', value: 'Lot # · Severity · Open/Closed', highlight: true },
            { label: 'PDF Sign-off', value: 'Digital Footer & Investigator Name' }
          ],
          actionLabel: 'Launch QR CAPA Portal'
        }
      },
      {
        id: 'tool-production-floor',
        category: 'tools',
        badge: 'Manufacturing & OEE',
        title: 'Production Floor Net Efficiency (OEE), Syrup Yield & Labor',
        subtitle:
          'Measure 1-Hour & Full-Day Line OEE, CIP/Changeover downtime, Syrup Room yield & worker KPIs.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=production-floor`,
        benefits: [
          'Tracks hourly run rate vs rated machine speed & target efficiency %',
          'Accounts for shift start delays, breaks & CIP/mechanical downtime',
          'Calculates Syrup Room Brix-corrected batch yield and wastage %',
          'Benchmarks shift manpower productivity for plant managers'
        ],
        hashtags: '#FoodManufacturing #OEE #ProductionEfficiency #PlantManagement',
        mockup: {
          headerLabel: 'Production Floor OEE Monitor',
          statusLabel: 'Shift Performance',
          inputs: [
            { label: 'Rated Line Speed', value: '12,000 Bottles / hr' },
            { label: 'Actual Good Output', value: '10,440 Bottles (52 min run)' }
          ],
          outputs: [
            { label: 'Net Line OEE', value: '87.0% Target Met', highlight: true },
            { label: 'Downtime Tracked', value: '8 mins Micro-Stop / CIP' }
          ],
          actionLabel: 'Analyze Shift OEE'
        }
      },
      {
        id: 'tool-nutrition-label',
        category: 'tools',
        badge: 'Packaging Compliance',
        title: 'Nutrition Facts Label Generator (FDA / GCC-SFDA / PSQCA)',
        subtitle:
          'Create export-ready FDA 2020, GCC GSO 2233 Traffic-Light & PSQCA Nutrition Panels in minutes.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=nutrition-label`,
        benefits: [
          'Switches seamlessly between US FDA, Gulf SFDA Traffic-Light & PSQCA',
          'Auto-computes % Daily Value and per-100g / per-serving conversions',
          'Highlights Sugar, Salt & Fat warning colors for GCC export compliance',
          'Ready for packaging artwork verification & regulatory submission'
        ],
        hashtags: '#FoodLabeling #NutritionFacts #SFDA #FDA #FoodExport',
        mockup: {
          headerLabel: 'Multi-Region Nutrition Panel',
          statusLabel: 'FDA · GCC · PSQCA',
          inputs: [
            { label: 'Serving Size', value: '250 ml (1 Pack)' },
            { label: 'Format Standard', value: 'GCC / SFDA Traffic-Light' }
          ],
          outputs: [
            { label: 'Energy / Serving', value: '145 kcal · 7% DV', highlight: true },
            { label: 'Sugar / Fat Status', value: 'Amber Med · Compliant' }
          ],
          actionLabel: 'Generate Packaging Label'
        }
      },
      {
        id: 'tool-authority-limits',
        category: 'tools',
        badge: 'Regulatory Limits Bank',
        title: 'Food Authority Limits Lookup (PFA / PSQCA / SFDA / Codex)',
        subtitle:
          'Instant statutory limit search for Dairy, Aflatoxin M1, Water TDS, Oils, Spices & Microbiology.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=authority-limits`,
        benefits: [
          'Side-by-side statutory thresholds across PFA, PSQCA, SFDA & Codex',
          'Covers Milk Fat/SNF, Mycotoxins, Heavy Metals, Water & Microbiological specs',
          'Pass/Fail quick check helper for incoming raw-material inspection',
          'Ideal pocket reference for Factory QA Officers & Food Inspectors'
        ],
        hashtags: '#FoodRegulations #CodexAlimentarius #PFA #PSQCA #SFDA',
        mockup: {
          headerLabel: 'Regulatory Statutory Lookup',
          statusLabel: '4 Food Authorities',
          inputs: [
            { label: 'Product Matrix', value: 'Pasteurized Whole Milk' },
            { label: 'Parameter', value: 'Milk Fat · SNF · Aflatoxin M1' }
          ],
          outputs: [
            { label: 'PFA / PSQCA Min', value: 'Fat ≥ 3.5% · SNF ≥ 8.5%', highlight: true },
            { label: 'Aflatoxin M1 Limit', value: '≤ 0.5 ppb (Codex / PFA)' }
          ],
          actionLabel: 'Check Statutory Limits'
        }
      },
      {
        id: 'tool-lab-formula',
        category: 'tools',
        badge: 'CIP & Titration Lab',
        title: 'Lab Sanitizer PPM Dilution, Titratable Acidity & Brix:Acid Ratio',
        subtitle:
          'Verify CIP sanitizer concentration (Hypochlorite, QAC, PAA) and juice/dairy titration accuracy.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=lab-formula`,
        benefits: [
          'Exact ml/L dosing for 50–1,000 PPM Food-Grade Sanitizer tanks',
          'Calculates Titratable Acidity (% Citric, Lactic, Acetic, Malic acid)',
          'Computes Brix:Acid Maturity Ratio for beverage & citrus QA release',
          'Prevents chemical under-dosing and sanitizer residue deviations'
        ],
        hashtags: '#FoodLab #CIP #Titration #QualityControl #Sanitation',
        mockup: {
          headerLabel: 'Sanitizer PPM & Titration Suite',
          statusLabel: 'CIP Tank Prep',
          inputs: [
            { label: 'Stock Hypochlorite', value: '12.5% Available Chlorine' },
            { label: 'Target Tank', value: '500 L at 200 PPM' }
          ],
          outputs: [
            { label: 'Chemical Dose Needed', value: '800 ml Stock Solution', highlight: true },
            { label: 'Verification Check', value: '200 ± 10 ppm Test Strip' }
          ],
          actionLabel: 'Compute Lab Dosing'
        }
      },
      {
        id: 'tool-molarity-normality',
        category: 'tools',
        badge: 'Analytical Chemistry',
        title: 'Lab Solution Molarity, Normality & C1V1=C2V2 Dilution Calculator',
        subtitle:
          'Prepare accurate 0.1N NaOH, HCl, H2SO4 & W/V% laboratory reagents without calculation mistakes.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=molarity-normality`,
        benefits: [
          'Supports Molarity (M), Normality (N), W/V % and V/V % preparations',
          'Built-in acid/base purity & specific gravity correction for stock bottles',
          'C1V1 = C2V2 working solution dilution calculator for daily lab benches',
          'Reduces standardization rework in Food Chemistry & Kjeldahl labs'
        ],
        hashtags: '#AnalyticalChemistry #FoodLab #Molarity #Normality #QAQC',
        mockup: {
          headerLabel: 'Reagent Preparation Workbench',
          statusLabel: 'Titration Standard',
          inputs: [
            { label: 'Reagent', value: 'NaOH (MW 40.00 g/mol)' },
            { label: 'Target Solution', value: '0.1 N · 1,000 ml Volumetric' }
          ],
          outputs: [
            { label: 'Solid Weight Needed', value: '4.000 g Analytical Grade', highlight: true },
            { label: 'Dilution Equation', value: 'C1V1 = C2V2 Ready' }
          ],
          actionLabel: 'Prepare Lab Solution'
        }
      },
      {
        id: 'tool-moisture-ash',
        category: 'tools',
        badge: 'Proximate Analysis',
        title: 'Moisture, Total Ash, Dry Matter & Process Yield Calculator',
        subtitle:
          'Compute oven moisture %, wet/dry basis solids, total ash % and cooking/drying yield.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=moisture-ash`,
        benefits: [
          'Direct crucible weight inputs (Empty + Sample + Dried/Ashed)',
          'Auto-computes Wet-Basis Moisture %, Dry Matter % & Total Ash %',
          'Includes mass-balance Process Yield & Shrinkage % calculator',
          'Ideal for Bakery, Milling, Dehydration, Dairy & Meat QC Labs'
        ],
        hashtags: '#ProximateAnalysis #FoodChemistry #MoistureContent #FoodLab',
        mockup: {
          headerLabel: 'Proximate & Process Yield Lab',
          statusLabel: 'AOAC Gravimetric',
          inputs: [
            { label: 'Crucible + Wet Sample', value: '25.420 g (Sample 5.00 g)' },
            { label: 'Post-Oven Weight', value: '24.810 g' }
          ],
          outputs: [
            { label: 'Moisture Content', value: '12.20% (Wet Basis)', highlight: true },
            { label: 'Total Dry Matter', value: '87.80% Solids' }
          ],
          actionLabel: 'Run Proximate Calculation'
        }
      },
      {
        id: 'tool-thermal-aw',
        category: 'tools',
        badge: 'Retort & Shelf-Life',
        title: 'Thermal Processing (F0 / Pasteurization) & Water Activity (aw)',
        subtitle:
          'Evaluate retort sterilization lethality (F0), Pasteurization Units (PU) & microbial aw hurdles.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=thermal-aw`,
        benefits: [
          'Computes F0 lethality against Clostridium botulinum 12D benchmark',
          'Calculates Pasteurization Units (PU) for beer, juice & dairy lines',
          'Maps Water Activity (aw) hurdles against Salmonella, Staphylococcus & molds',
          'Essential tool for Process Authority & Shelf-Life Validation engineers'
        ],
        hashtags: '#ThermalProcessing #FoodMicrobiology #WaterActivity #FoodSafety',
        mockup: {
          headerLabel: 'Lethality F0 & aw Validator',
          statusLabel: '12D Safety Check',
          inputs: [
            { label: 'Retort Core Temp', value: '121.1 °C (Z = 10 °C)' },
            { label: 'Holding Time', value: '4.5 Minutes' }
          ],
          outputs: [
            { label: 'Cumulative F0 Value', value: 'F0 = 4.50 min (Safe ≥ 3.0)', highlight: true },
            { label: 'Microbial Hurdle', value: 'aw < 0.85 Pathogens Inhibited' }
          ],
          actionLabel: 'Validate Thermal Process'
        }
      },
      {
        id: 'tool-e-numbers',
        category: 'tools',
        badge: 'Halal & Codex Status',
        title: 'Halal & Food Additive E-Numbers Instant Finder',
        subtitle:
          'Search E100–E1599 instantly for Halal / Haram / Mushbooh status, function & Codex ADI.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=e-numbers`,
        benefits: [
          'Instant lookup across Colors, Preservatives, Emulsifiers & Stabilizers',
          'Clear Halal / Haram / Mushbooh source verification guidance',
          'Shows Codex INS functional class & Acceptable Daily Intake (ADI)',
          'Helps R&D, Regulatory & Halal Auditors screen ingredient declarations fast'
        ],
        hashtags: '#HalalFood #ENumbers #FoodAdditives #Codex #HalalCompliance',
        mockup: {
          headerLabel: 'Codex & Halal E-Number Finder',
          statusLabel: 'E100 – E1599 Bank',
          inputs: [
            { label: 'Search Additive', value: 'E471 · Mono/Diglycerides' },
            { label: 'Regulatory Filter', value: 'Halal Screening Mode' }
          ],
          outputs: [
            { label: 'Halal Status', value: 'Mushbooh (Verify Plant/Animal)', highlight: true },
            { label: 'Functional Class', value: 'Emulsifier · Stabilizer' }
          ],
          actionLabel: 'Search E-Numbers Bank'
        }
      },
      {
        id: 'tool-exam',
        category: 'tools',
        badge: '2,000+ MCQs Bank',
        title: 'Food Safety, HACCP & Food Science Exam Prep (2,000+ MCQs)',
        subtitle:
          'Practice timed 30-MCQ exams for Food Safety Officer, Highfield HACCP, ISO 22000 & Dairy.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=exam`,
        benefits: [
          '2,000+ specialized Food Science, HACCP & Public Service exam MCQs',
          'Randomized 30-question sessions with instant answer explanations',
          'Score analytics, leaderboard comparison & printable PDF performance report',
          'Built for PPSC/FPSC Food Safety Officer & Highfield exam candidates'
        ],
        hashtags: '#FoodSafetyOfficer #FoodScienceExam #HACCP #ExamPrep',
        mockup: {
          headerLabel: '2,000+ Food Science MCQ Simulator',
          statusLabel: '30-MCQ Mock Test',
          inputs: [
            { label: 'Selected Track', value: 'HACCP · ISO 22000 · Food Micro' },
            { label: 'Session Draw', value: '30 Randomized Questions' }
          ],
          outputs: [
            { label: 'Instant Grading', value: 'Score % + Rationale Shown', highlight: true },
            { label: 'Export Report', value: 'Downloadable Session PDF' }
          ],
          actionLabel: 'Start 30-MCQ Practice'
        }
      },
      {
        id: 'tool-interview',
        category: 'tools',
        badge: '2,000+ Industry Q&A',
        title: 'QA/QC, Production & Food Technologist Interview Prep Bank',
        subtitle:
          'Master real factory interview scenarios, audit defense questions & model technical answers.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=interview`,
        benefits: [
          '2,000+ industry-vetted QA/QC, R&D, Production & Audit questions',
          'Covers Dairy, Beverages, Bakery, Meat, Cold Chain & ISO 22000',
          'Structured model technical answers you can review or download as PDF',
          'Prepares graduates & QA officers for high-paying plant roles'
        ],
        hashtags: '#FoodTechJobs #QAQCInterview #FoodIndustry #CareerPrep',
        mockup: {
          headerLabel: 'Factory Interview Q&A Bank',
          statusLabel: '2,000+ Scenarios',
          inputs: [
            { label: 'Role Track', value: 'QA/QC Officer · Food Safety' },
            { label: 'Scenario Topic', value: 'CCP Deviation & Hold Release' }
          ],
          outputs: [
            { label: 'Model Answer', value: 'Codex + Audit-Grade Response', highlight: true },
            { label: 'Revision Export', value: 'PDF Study Packet Ready' }
          ],
          actionLabel: 'Practice Interview Q&A'
        }
      },
      {
        id: 'tool-citation-generator',
        category: 'tools',
        badge: 'Research · ANOVA · Thesis',
        title: 'Thesis-to-Journal Converter, One-Way ANOVA & Citation Suite',
        subtitle:
          'Format APA/Harvard/IEEE/Vancouver citations, run One-Way ANOVA + Tukey HSD & prep papers.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=citation-generator`,
        benefits: [
          'Instant One-Way ANOVA & Tukey HSD statistical table from treatment replicates',
          'Converts MSc/PhD thesis chapters toward peer-reviewed journal structure',
          'Generates clean APA 7th, Harvard, IEEE & Vancouver reference lists',
          'Saves Food Science researchers hours during thesis & manuscript writing'
        ],
        hashtags: '#FoodResearch #ANOVA #AcademicWriting #MSc #PhD',
        mockup: {
          headerLabel: 'Research ANOVA & Citation Engine',
          statusLabel: 'Statistical Lab',
          inputs: [
            { label: 'Statistical Test', value: 'One-Way ANOVA + Tukey HSD' },
            { label: 'Citation Format', value: 'APA 7th · Elsevier · Springer' }
          ],
          outputs: [
            { label: 'F-Stat / p-Value', value: 'F = 14.82 · p < 0.001 (Sig.)', highlight: true },
            { label: 'Journal Layout', value: 'Abstract · Methods · Tables' }
          ],
          actionLabel: 'Open Research Suite'
        }
      },
      {
        id: 'tool-nutrition',
        category: 'tools',
        badge: 'Clinical Dietetics',
        title: 'Nutrition Facts, BMI/TDEE & Clinical Diet Planning Tool',
        subtitle:
          'Calculate BMR, TDEE, BMI, macro ratios and structured daily meal plans for clients.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=nutrition`,
        benefits: [
          'Accurate Mifflin-St Jeor BMR, activity TDEE & BMI classification',
          'Custom protein/carb/fat macro split + meal calorie logging',
          'Includes ready diet presets & client goal progress tracking',
          'Designed for Human Nutritionists, Dietitians & Wellness Coaches'
        ],
        hashtags: '#HumanNutrition #Dietetics #TDEE #ClinicalNutrition',
        mockup: {
          headerLabel: 'Clinical Nutrition & Meal Planner',
          statusLabel: 'Macro & Energy Suite',
          inputs: [
            { label: 'Profile Input', value: 'Weight · Height · Activity' },
            { label: 'Goal Target', value: 'Lean Maintenance (2,150 kcal)' }
          ],
          outputs: [
            { label: 'Daily Macro Split', value: 'P 135g · C 240g · F 70g', highlight: true },
            { label: 'Meal Log Status', value: 'Client Plan Export Ready' }
          ],
          actionLabel: 'Plan Client Nutrition'
        }
      },
      {
        id: 'tool-job-cover-letter',
        category: 'tools',
        badge: 'Career Application',
        title: 'Food Technologist & QA/QC Cover Letter & Email Generator',
        subtitle:
          'Draft targeted HR application emails & ATS-friendly cover letters in 30 seconds.',
        url: `${PORTAL_BASE_URL}/?section=tools&tool=job-cover-letter`,
        benefits: [
          'Pre-tuned templates for QA/QC, R&D, Production, HACCP & HSE roles',
          'Generates crisp HR email subject line + concise cover letter body',
          'Highlights your ISO 22000, HACCP & laboratory testing skills cleanly',
          '1-click copy or direct email launch for faster job applications'
        ],
        hashtags: '#FoodTechCareers #CoverLetter #QAQCJobs #JobSearch',
        mockup: {
          headerLabel: 'HR Cover Letter Composer',
          statusLabel: 'ATS Ready Copy',
          inputs: [
            { label: 'Target Role', value: 'QA/QC Officer (Dairy Plant)' },
            { label: 'Key Credentials', value: 'HACCP Lv4 · BSc Food Tech' }
          ],
          outputs: [
            { label: 'Email Subject', value: 'Application: QA/QC Officer Role', highlight: true },
            { label: 'Format Ready', value: '1-Click Copy / Mailto Ready' }
          ],
          actionLabel: 'Generate Cover Letter'
        }
      }
    ];

    const pageItems: ShareableTargetItem[] = [
      {
        id: 'page-home',
        category: 'pages',
        badge: 'Main Portal Home',
        title: 'Food Science Portal — Complete Global Hub',
        subtitle:
          '16 QA/QC Calculators, 13 Accredited Certifications, Verified Jobs, Scholarships & Specialist Community.',
        url: `${PORTAL_BASE_URL}/`,
        benefits: [
          'All Food Science tools, trainings, jobs & scholarships in one portal',
          'Geo-aware membership: Rs. 100/mo (Pakistan) or $1/mo (International)',
          'Offline-ready Factory Floor mode & official QR-verified certificates',
          'Built for Food Technologists, QA Managers, Auditors & Students'
        ],
        hashtags: '#FoodSciencePortal #FoodTechnology #QAQC #FoodSafety',
        mockup: {
          headerLabel: 'Food Science Portal Hub',
          statusLabel: 'Live Platform',
          inputs: [
            { label: 'Engineering Tools', value: '16 Live Calculators & Vaults' },
            { label: 'Verified Opportunities', value: `${jobsCount} Jobs · ${scholarshipsCount} Grants` }
          ],
          outputs: [
            { label: 'Academy Tracks', value: `${trainingsCount} Accredited Courses`, highlight: true },
            { label: 'Specialist Directory', value: `${communityCount} Verified Profiles` }
          ],
          actionLabel: 'Explore Food Science Portal'
        }
      },
      {
        id: 'page-jobs',
        category: 'pages',
        badge: `${jobsCount} Active Jobs`,
        title: 'Food Science, QA/QC, Production & Nutritionist Jobs Portal',
        subtitle:
          'Daily verified vacancies across Dairy, Beverages, FMCG, Poultry, Labs & Gulf Food Plants.',
        url: `${PORTAL_BASE_URL}/?section=jobs`,
        benefits: [
          'Curated QA/QC, R&D, Production, Food Safety & Nutritionist vacancies',
          'Direct WhatsApp, Email & HR application links with deadline counters',
          'Filter instantly by role tag, city/country & hiring status',
          'Includes 1-click Cover Letter Generator & application tracking'
        ],
        hashtags: '#FoodScienceJobs #QAQCJobs #FoodTechnologist #FMCGCareers',
        mockup: {
          headerLabel: 'Verified Industry Jobs Board',
          statusLabel: `${jobsCount} Live Vacancies`,
          inputs: [
            { label: 'Key Disciplines', value: 'QA/QC · R&D · HACCP · Production' },
            { label: 'Regions Covered', value: 'Pakistan · UAE · KSA · UK · EU' }
          ],
          outputs: [
            { label: 'Direct HR Apply', value: 'Email / WhatsApp Links Included', highlight: true },
            { label: 'Updated Daily', value: 'Live Admin Verification' }
          ],
          actionLabel: 'Browse Open Vacancies'
        }
      },
      {
        id: 'page-scholarships',
        category: 'pages',
        badge: `${scholarshipsCount} Funded Grants`,
        title: 'Fully Funded Food Science, Agriculture & Nutrition Scholarships',
        subtitle:
          'Erasmus Mundus, DAAD, CSC, Fulbright, Commonwealth & Global MSc/PhD Fellowships.',
        url: `${PORTAL_BASE_URL}/?section=scholarships`,
        benefits: [
          'Fully funded MSc, PhD & Postdoc programs in Food Science & Nutrition',
          'Organized by Fellowships, International & Research Grants',
          'Tracks application deadlines, eligibility & official university links',
          'Save target scholarships & generate academic research citations'
        ],
        hashtags: '#FoodScienceScholarships #ErasmusMundus #PhDGrants #MScFunding',
        mockup: {
          headerLabel: 'Global Scholarships Directory',
          statusLabel: `${scholarshipsCount} Active Grants`,
          inputs: [
            { label: 'Funding Types', value: 'Full Tuition + Monthly Stipend' },
            { label: 'Programs', value: 'Erasmus · DAAD · CSC · Fulbright' }
          ],
          outputs: [
            { label: 'Deadline Alerts', value: 'Countdown Days Remaining', highlight: true },
            { label: 'Direct Portal Links', value: 'Verified University Calls' }
          ],
          actionLabel: 'View Funded Scholarships'
        }
      },
      {
        id: 'page-trainings',
        category: 'pages',
        badge: `${trainingsCount} Certifications`,
        title: 'Accredited HACCP, ISO 22000, FSSC v7 & BRCGS Issue 9 Trainings',
        subtitle:
          'Free online study modules + 40-MCQ examination with QR-verified international certificates.',
        url: `${PORTAL_BASE_URL}/?section=trainings`,
        benefits: [
          '13 Complete Courses: HACCP Lv 3 & 4, FSSC 22000 v7, BRCGS Issue 9, ISO 9001',
          'Study all modules & attempt the 40-MCQ assessment online 24/7',
          'Official QR-scannable PDF certificate verification for employers',
          'Transparent regional fee: Rs. 1,000 (PK) or $10 USD (International)'
        ],
        hashtags: '#HACCPTraining #ISO22000 #FSSC22000 #BRCGS #FoodSafetyCertification',
        mockup: {
          headerLabel: 'Accredited Certifications Academy',
          statusLabel: `${trainingsCount} Courses`,
          inputs: [
            { label: 'Standards', value: 'HACCP · ISO 9001/22000 · BRCGS' },
            { label: 'Exam Engine', value: '5 Study Modules + 40-MCQ Exam' }
          ],
          outputs: [
            { label: 'Verification', value: 'Public QR Certificate Portal', highlight: true },
            { label: 'Study Access', value: '100% Free Online Modules' }
          ],
          actionLabel: 'Start Free Training Study'
        }
      },
      {
        id: 'page-verify-portal',
        category: 'pages',
        badge: 'HR & Auditor Lookup',
        title: 'Official Certificate Verification Portal',
        subtitle:
          'Verify any Food Science Portal certificate code or QR scan instantly with employer trust.',
        url: `${PORTAL_BASE_URL}/?section=trainings&tab=verify-portal`,
        benefits: [
          'Instant validation by Certificate Code (e.g. FSP-2026-XXXX) or QR URL',
          'Confirms Graduate Name, Course Title, Score & Issue Date publicly',
          'Helps HR Managers & ISO Auditors authenticate candidate credentials',
          'Zero forgery risk — backed directly by live Firestore records'
        ],
        hashtags: '#CertificateVerification #HRVerification #FoodSafetyCredentials',
        mockup: {
          headerLabel: 'Employer Certificate Verification',
          statusLabel: 'Instant QR Lookup',
          inputs: [
            { label: 'Lookup Code', value: 'FSP-CERT-2026-VERIFIED' },
            { label: 'Verification Source', value: 'Live Official Registry' }
          ],
          outputs: [
            { label: 'Status Result', value: 'Authentic · Validated Record', highlight: true },
            { label: 'Details Shown', value: 'Holder Name · Track · Date' }
          ],
          actionLabel: 'Verify Certificate Now'
        }
      },
      {
        id: 'page-custom-trainings',
        category: 'pages',
        badge: 'Live Corporate Workshops',
        title: 'Custom Industrial Workshops & Corporate Audit Trainings',
        subtitle:
          'Register individuals or factory QA teams for live instructor-led ISO, FSSC & HACCP workshops.',
        url: `${PORTAL_BASE_URL}/?section=trainings&tab=custom-trainings`,
        benefits: [
          'Live practical workshops tailored to factory audit & compliance gaps',
          'Includes editable corporate training tracks & transparent PK/USD fees',
          'Fast online seat registration with direct Admin confirmation',
          'Ideal for dairy, beverage, bakery & food export QA teams'
        ],
        hashtags: '#CorporateTraining #FoodSafetyWorkshop #IndustrialQA #FSSC22000',
        mockup: {
          headerLabel: 'Custom Live Workshops',
          statusLabel: 'Corporate Enrollment',
          inputs: [
            { label: 'Delivery Mode', value: 'Live Online / Plant Hybrid' },
            { label: 'Target Teams', value: 'QA/QC · Audit · Production' }
          ],
          outputs: [
            { label: 'Registration', value: 'Instant Seat Request Form', highlight: true },
            { label: 'Certification', value: 'Workshop Completion Record' }
          ],
          actionLabel: 'View Custom Workshops'
        }
      },
      {
        id: 'page-communities',
        category: 'pages',
        badge: `${communityCount} Specialists`,
        title: 'Verified Food Science & QA/QC Specialists Community Directory',
        subtitle:
          'Discover verified Food Technologists, QA Managers, Lead Auditors & Nutritionists ready to hire.',
        url: `${PORTAL_BASE_URL}/?section=communities`,
        benefits: [
          'Search verified Food Science specialists by role, company or country',
          'Includes qualification, work experience, skills & Hire Me availability',
          'Direct WhatsApp, Email & CV download access for Premium recruiters',
          'Admin-curated verified network built specifically for the food sector'
        ],
        hashtags: '#FoodScienceCommunity #FoodTechnologists #QANetwork #Hiring',
        mockup: {
          headerLabel: 'Specialist Community Directory',
          statusLabel: `${communityCount} Active Members`,
          inputs: [
            { label: 'Filter By', value: 'Name · Role · Country · Hire Me' },
            { label: 'Profiles Include', value: 'Bio · Experience · Skills · CV' }
          ],
          outputs: [
            { label: 'Verified Talent', value: 'Admin-Reviewed Specialists', highlight: true },
            { label: 'Direct Connect', value: 'LinkedIn · Email · WhatsApp' }
          ],
          actionLabel: 'Explore Specialist Network'
        }
      },
      {
        id: 'page-search',
        category: 'pages',
        badge: 'Global Search',
        title: 'Universal Search — Tools, Jobs, Courses & Specialists',
        subtitle:
          'Search across every calculator, job post, funded scholarship, course & community member.',
        url: `${PORTAL_BASE_URL}/?section=search`,
        benefits: [
          'Unified instant search across all 5 core modules of Food Science Portal',
          'Jump directly from keyword to calculator, vacancy or course exam',
          'Zero page reloads — instant live client filtering'
        ],
        hashtags: '#FoodScience #FoodSafety #QAQC #SearchPortal',
        mockup: {
          headerLabel: 'Universal Portal Search',
          statusLabel: 'All Sections Indexed',
          inputs: [
            { label: 'Query Example', value: '"HACCP" or "Dairy QA"' },
            { label: 'Indexes', value: 'Tools · Jobs · Grants · Courses' }
          ],
          outputs: [
            { label: 'Instant Results', value: 'Categorized Deep Links', highlight: true },
            { label: 'Direct Launch', value: '1-Click Tool & Page Open' }
          ],
          actionLabel: 'Search Full Portal'
        }
      }
    ];

    const courseItems: ShareableTargetItem[] = INTERNATIONAL_TRAINING_COURSES.map(
      (c) => ({
        id: `course-${c.id}`,
        category: 'courses',
        badge: c.code || 'Accredited Track',
        title: c.title,
        subtitle: `${c.accreditationStandard} · ${c.modules.length} Structured Modules + ${c.totalExamQuestions}-MCQ Assessment (${c.passPercentage}% Pass)`,
        url: `${PORTAL_BASE_URL}/?section=trainings&course=${c.id}`,
        benefits: [
          `Complete ${c.modules.length}-module industrial curriculum (${c.duration})`,
          `Standard aligned: ${c.accreditationStandard}`,
          `${c.totalExamQuestions}-MCQ online certification assessment (${c.passPercentage}% passing benchmark)`,
          'Free online study access + QR-verifiable official certificate option'
        ],
        hashtags: `#${(c.code || 'FoodSafety').replace(/[^a-zA-Z0-9]/g, '')} #FoodSafetyTraining #Certification #QAQC`,
        mockup: {
          headerLabel: `${c.code || 'Certification'} Course`,
          statusLabel: `${c.modules.length} Modules · ${c.totalExamQuestions} MCQs`,
          inputs: [
            { label: 'Standard', value: c.accreditationStandard.slice(0, 36) },
            { label: 'Study Access', value: '100% Free Online Reading' }
          ],
          outputs: [
            { label: 'Pass Requirement', value: `${c.passPercentage}% Score in ${c.totalExamQuestions} MCQs`, highlight: true },
            { label: 'Credential', value: 'QR-Verified PDF Certificate' }
          ],
          actionLabel: 'Open Course & Exam'
        }
      })
    );

    return [...toolItems, ...pageItems, ...courseItems];
  }, [jobsCount, scholarshipsCount, trainingsCount, communityCount]);

  const filteredTargets = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allTargets.filter((item) => {
      if (item.category !== categoryTab && !q) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.benefits.some((b) => b.toLowerCase().includes(q))
      );
    });
  }, [allTargets, categoryTab, searchTerm]);

  const selectedItem = useMemo<ShareableTargetItem>(() => {
    return (
      allTargets.find((t) => t.id === selectedId) ||
      filteredTargets[0] ||
      allTargets[0]
    );
  }, [allTargets, filteredTargets, selectedId]);

  const buildDefaultPostText = (item: ShareableTargetItem): string => {
    const bulletLines = item.benefits.map((b) => `✅ ${b}`).join('\n');
    return `${item.title}\n\n${item.subtitle}\n\nKey Benefits for Food Science & QA/QC Professionals:\n${bulletLines}\n\n🚀 Try the live interface directly here:\n${item.url}\n\n${item.hashtags}`;
  };

  const activePostText = isPostEdited
    ? customPostText
    : buildDefaultPostText(selectedItem);

  const handleSelectItem = (item: ShareableTargetItem) => {
    setSelectedId(item.id);
    setCustomPostText(buildDefaultPostText(item));
    setIsPostEdited(false);
  };

  const copySilently = (text: string, type: 'post' | 'link') => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 2200);
        if (onSetBanner) {
          onSetBanner(
            type === 'post'
              ? `Copied full post + benefits & link for "${selectedItem.title}".`
              : `Copied direct interface link: ${selectedItem.url}`
          );
        }
      })
      .catch(() => {});
  };

  // Render high-resolution 1200x630 Canvas card containing BOTH Tool Interface Mockup + Logo + Key Benefits + Deep Link
  const renderCardToCanvas = async (
    item: ShareableTargetItem
  ): Promise<HTMLCanvasElement> => {
    const W = 1200;
    const H = 630;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    const drawRoundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const wrapLines = (
      text: string,
      maxWidth: number,
      font: string,
      maxLines = 3
    ): string[] => {
      ctx.font = font;
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let current = '';
      for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && current) {
          lines.push(current);
          current = word;
          if (lines.length >= maxLines) break;
        } else {
          current = test;
        }
      }
      if (current && lines.length < maxLines) lines.push(current);
      if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
        lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, -3)}...`;
      }
      return lines;
    };

    // 1. Deep Professional Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0C182D');
    bgGrad.addColorStop(0.55, '#13284A');
    bgGrad.addColorStop(1, '#105E9A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle geometric accent grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let gx = 40; gx < W; gx += 48) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }
    for (let gy = 40; gy < H; gy += 48) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }

    // 2. Top Brand Row (Food Science Portal Logo + Domain)
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(52, 40, 56, 56, 14);
    ctx.fill();

    await new Promise<void>((resolve) => {
      const logoImg = new Image();
      logoImg.onload = () => {
        ctx.save();
        drawRoundRect(56, 44, 48, 48, 10);
        ctx.clip();
        ctx.drawImage(logoImg, 56, 44, 48, 48);
        ctx.restore();
        resolve();
      };
      logoImg.onerror = () => resolve();
      logoImg.src = FS_PORTAL_LOGO_DATA_URI;
    });

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('Food Science Portal', 124, 65);
    ctx.fillStyle = '#93C5FD';
    ctx.font = '700 14px system-ui, -apple-system, sans-serif';
    ctx.fillText(item.badge, 124, 88);

    // 3. Left Column: Tool / Page Headline & Benefits
    const titleLines = wrapLines(
      item.title,
      580,
      '800 34px system-ui, -apple-system, sans-serif',
      3
    );
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 34px system-ui, -apple-system, sans-serif';
    titleLines.forEach((line, idx) => {
      ctx.fillText(line, 52, 152 + idx * 42);
    });

    const afterTitleY = 152 + titleLines.length * 42 + 8;
    const subLines = wrapLines(
      item.subtitle,
      580,
      '500 16px system-ui, -apple-system, sans-serif',
      2
    );
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '500 16px system-ui, -apple-system, sans-serif';
    subLines.forEach((line, idx) => {
      ctx.fillText(line, 52, afterTitleY + idx * 23);
    });

    // Benefits checklist
    let benefitY = afterTitleY + subLines.length * 23 + 30;
    ctx.fillStyle = '#38BDF8';
    ctx.font = '800 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('KEY BENEFITS & FEATURES', 52, benefitY);
    benefitY += 26;

    item.benefits.slice(0, 4).forEach((benefit) => {
      // Check circle
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(62, benefitY - 5, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(57.5, benefitY - 5);
      ctx.lineTo(61, benefitY - 1.5);
      ctx.lineTo(67, benefitY - 8.5);
      ctx.stroke();

      const bLines = wrapLines(
        benefit,
        545,
        '600 16px system-ui, -apple-system, sans-serif',
        2
      );
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '600 16px system-ui, -apple-system, sans-serif';
      bLines.forEach((bl, bIdx) => {
        ctx.fillText(bl, 82, benefitY + bIdx * 21);
      });
      benefitY += bLines.length * 22 + 12;
    });

    // Bottom Left URL Strip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    drawRoundRect(52, 548, 590, 44, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#E0F2FE';
    ctx.font = '700 15px monospace';
    const shortUrl = item.url.replace('https://', '');
    ctx.fillText(
      shortUrl.length > 56 ? `${shortUrl.slice(0, 53)}...` : shortUrl,
      70,
      575
    );

    // 4. Right Column: Crisp Tool / Page Interface Card Mockup
    const MX = 680;
    const MY = 48;
    const MW = 468;
    const MH = 534;

    // Outer white frame
    ctx.fillStyle = '#FFFFFF';
    drawRoundRect(MX, MY, MW, MH, 20);
    ctx.fill();

    // Browser / Tool header bar
    ctx.fillStyle = '#F0F6FC';
    drawRoundRect(MX, MY, MW, 74, 20);
    ctx.fill();
    ctx.fillRect(MX, MY + 44, MW, 30);

    ctx.strokeStyle = '#D2DEEA';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(MX, MY + 74);
    ctx.lineTo(MX + MW, MY + 74);
    ctx.stroke();

    ctx.fillStyle = '#1A2138';
    ctx.font = '800 18px system-ui, -apple-system, sans-serif';
    ctx.fillText(item.mockup.headerLabel.slice(0, 32), MX + 24, MY + 36);
    ctx.fillStyle = '#1673B8';
    ctx.font = '700 13px system-ui, -apple-system, sans-serif';
    ctx.fillText(item.mockup.statusLabel, MX + 24, MY + 58);

    // Live Inputs Panel
    let curY = MY + 98;
    ctx.fillStyle = '#64748B';
    ctx.font = '800 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('LIVE INTERFACE PARAMETERS', MX + 24, curY);
    curY += 14;

    item.mockup.inputs.forEach((inp) => {
      ctx.fillStyle = '#F8FAFC';
      drawRoundRect(MX + 24, curY, MW - 48, 56, 12);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '700 12px system-ui, -apple-system, sans-serif';
      ctx.fillText(inp.label, MX + 40, curY + 21);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(inp.value.slice(0, 36), MX + 40, curY + 43);
      curY += 66;
    });

    // Live Output Results Panel
    curY += 8;
    ctx.fillStyle = '#64748B';
    ctx.font = '800 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('LIVE OUTPUT & VERIFICATION RESULT', MX + 24, curY);
    curY += 14;

    item.mockup.outputs.forEach((out) => {
      ctx.fillStyle = out.highlight ? '#EBF4FC' : '#F1F5F9';
      drawRoundRect(MX + 24, curY, MW - 48, 60, 12);
      ctx.fill();
      ctx.strokeStyle = out.highlight ? '#1673B8' : '#CBD5E1';
      ctx.lineWidth = out.highlight ? 2 : 1;
      ctx.stroke();

      ctx.fillStyle = out.highlight ? '#105E9A' : '#475569';
      ctx.font = '700 12px system-ui, -apple-system, sans-serif';
      ctx.fillText(out.label, MX + 40, curY + 22);

      ctx.fillStyle = out.highlight ? '#0C4A6E' : '#0F172A';
      ctx.font = '800 17px system-ui, -apple-system, sans-serif';
      ctx.fillText(out.value.slice(0, 34), MX + 40, curY + 46);
      curY += 70;
    });

    // Interface Bottom CTA Mockup
    const btnGrad = ctx.createLinearGradient(MX + 24, 0, MX + MW - 24, 0);
    btnGrad.addColorStop(0, '#1A2138');
    btnGrad.addColorStop(1, '#1673B8');
    ctx.fillStyle = btnGrad;
    drawRoundRect(MX + 24, MY + MH - 66, MW - 48, 44, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const labelW = ctx.measureText(item.mockup.actionLabel).width;
    ctx.fillText(
      item.mockup.actionLabel,
      MX + (MW - labelW) / 2,
      MY + MH - 38
    );

    return canvas;
  };

  const handleDownloadCardPng = async () => {
    setIsDownloadingPng(true);
    try {
      const canvas = await renderCardToCanvas(selectedItem);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `foodscienceportal-${selectedItem.id}-card.png`;
      link.href = dataUrl;
      link.click();
      if (onSetBanner) {
        onSetBanner(
          `Downloaded 1200×630 PNG Preview Card ("${selectedItem.title}") — attach directly to LinkedIn/Facebook posts.`
        );
      }
    } catch {
      if (onSetBanner) {
        onSetBanner('Could not render PNG preview card in this browser.');
      }
    } finally {
      setIsDownloadingPng(false);
    }
  };

  const handleCopyCardImage = async () => {
    setIsDownloadingPng(true);
    try {
      const canvas = await renderCardToCanvas(selectedItem);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (
        blob &&
        typeof ClipboardItem !== 'undefined' &&
        navigator.clipboard?.write
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedType('image');
        setTimeout(() => setCopiedType(null), 2400);
        if (onSetBanner) {
          onSetBanner(
            `Copied Tool Interface Card image to clipboard! Press Ctrl+V directly inside LinkedIn or Facebook composer.`
          );
        }
      } else {
        await handleDownloadCardPng();
      }
    } catch {
      await handleDownloadCardPng();
    } finally {
      setIsDownloadingPng(false);
    }
  };

  const linkedInShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
    activePostText
  )}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    selectedItem.url
  )}&quote=${encodeURIComponent(activePostText)}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    activePostText
  )}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${selectedItem.title} — ${selectedItem.benefits[0]}`
  )}&url=${encodeURIComponent(selectedItem.url)}`;

  return (
    <div className="space-y-5">
      {/* Studio Header */}
      <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D2DEEA] pb-3.5">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-[#1A2138] flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#1673B8]" />
              <span>Social Media Tool &amp; Page Publisher Studio</span>
            </h2>
            <p className="text-xs text-[#4A5568] font-medium">
              Select any calculator, audit tool, portal page, or course below to preview its live interface card &amp; key benefits, download the 1200×630 LinkedIn/Facebook card, and publish directly.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F0F6FC] border border-[#D2DEEA] rounded-xl">
            {(
              [
                {
                  id: 'tools',
                  label: '16 Tools & Hub',
                  icon: Wrench
                },
                {
                  id: 'pages',
                  label: 'Website Pages',
                  icon: Globe
                },
                {
                  id: 'courses',
                  label: '13 Courses',
                  icon: GraduationCap
                }
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setCategoryTab(tab.id);
                    const firstInCat = allTargets.find(
                      (t) => t.category === tab.id
                    );
                    if (firstInCat) handleSelectItem(firstInCat);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                    categoryTab === tab.id
                      ? 'bg-[#1673B8] text-white shadow-2xs'
                      : 'text-[#1A2138] hover:bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT: Tools / Pages Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#4A5568] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter tool, page, or standard..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
              />
            </div>

            <div className="max-h-[600px] overflow-y-auto space-y-2 pr-1">
              {filteredTargets.map((item) => {
                const isSelected = selectedItem.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-[#EBF4FC] border-[#1673B8] ring-1 ring-[#1673B8]'
                        : 'bg-[#F8FAFC] border-[#D2DEEA] hover:border-[#1673B8]/60 hover:bg-white'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-[#1673B8]">
                      {item.badge}
                    </div>
                    <div className="text-xs font-extrabold text-[#1A2138] leading-snug">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#4A5568] line-clamp-2 leading-snug">
                      {item.subtitle}
                    </div>
                  </button>
                );
              })}
              {filteredTargets.length === 0 && (
                <div className="p-4 text-center text-xs font-semibold text-[#4A5568] bg-[#F8FAFC] rounded-xl border border-[#D2DEEA]">
                  No tools or pages match your filter.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Live Visual Interface Card Preview + Post Composer + Social Buttons */}
          <div className="lg:col-span-8 space-y-4">
            {/* LIVE VISUAL INTERFACE + BENEFITS CARD (Mirrors the 1200x630 PNG output) */}
            <div
              ref={previewCardRef}
              className="rounded-[20px] overflow-hidden border border-[#105E9A] bg-gradient-to-br from-[#0C182D] via-[#13284A] to-[#105E9A] p-5 sm:p-6 text-white shadow-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                {/* Left Info + Benefits */}
                <div className="md:col-span-7 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={FS_PORTAL_LOGO_DATA_URI}
                        alt="Food Science Portal Logo"
                        className="w-10 h-10 rounded-xl bg-white p-1 object-contain shrink-0"
                      />
                      <div>
                        <div className="text-sm font-extrabold text-white">
                          Food Science Portal
                        </div>
                        <div className="text-[11px] font-bold text-sky-300">
                          {selectedItem.badge}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                      {selectedItem.title}
                    </h3>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {selectedItem.subtitle}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-extrabold text-sky-300 tracking-wide">
                        Key Benefits
                      </div>
                      <ul className="space-y-1.5">
                        {selectedItem.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-slate-100 font-medium leading-snug"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-3 py-2 rounded-xl bg-white/10 border border-sky-200/30 text-[11px] font-mono text-sky-100 truncate">
                    {selectedItem.url}
                  </div>
                </div>

                {/* Right Live Interface Mini-Mockup */}
                <div className="md:col-span-5 bg-white text-[#1A2138] rounded-2xl border border-[#D2DEEA] overflow-hidden flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="bg-[#F0F6FC] border-b border-[#D2DEEA] px-3.5 py-2.5">
                      <div className="text-xs font-extrabold text-[#1A2138] truncate">
                        {selectedItem.mockup.headerLabel}
                      </div>
                      <div className="text-[10.5px] font-bold text-[#1673B8]">
                        {selectedItem.mockup.statusLabel}
                      </div>
                    </div>

                    <div className="p-3 space-y-2.5">
                      <div className="space-y-1.5">
                        {selectedItem.mockup.inputs.map((inp, idx) => (
                          <div
                            key={idx}
                            className="px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]"
                          >
                            <div className="text-[10px] font-bold text-slate-500">
                              {inp.label}
                            </div>
                            <div className="text-[11.5px] font-extrabold text-[#1A2138] tabular-nums">
                              {inp.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        {selectedItem.mockup.outputs.map((out, idx) => (
                          <div
                            key={idx}
                            className={`px-2.5 py-1.5 rounded-lg border ${
                              out.highlight
                                ? 'bg-[#EBF4FC] border-[#1673B8]'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="text-[10px] font-bold text-[#105E9A]">
                              {out.label}
                            </div>
                            <div className="text-[11.5px] font-extrabold text-[#1A2138] tabular-nums">
                              {out.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-3 pb-3">
                    <a
                      href={selectedItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#1A2138] to-[#1673B8] text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5"
                    >
                      <span>{selectedItem.mockup.actionLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic Card Export Actions */}
            <div className="flex flex-wrap items-center gap-2.5 bg-[#F0F6FC] border border-[#D2DEEA] rounded-2xl p-3">
              <button
                type="button"
                onClick={handleDownloadCardPng}
                disabled={isDownloadingPng}
                className="px-4 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {isDownloadingPng
                    ? 'Generating 1200×630 Card...'
                    : 'Download Interface + Benefits Card (PNG)'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleCopyCardImage}
                disabled={isDownloadingPng}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedType === 'image' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Card Image Copied!</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5 text-[#1673B8]" />
                    <span>Copy Card Image (Paste in LinkedIn/FB)</span>
                  </>
                )}
              </button>

              <a
                href={selectedItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1673B8] text-xs font-extrabold inline-flex items-center gap-1.5 ml-auto"
              >
                <span>Open Live Interface</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Editable Social Post Copy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-extrabold text-[#1A2138] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1673B8]" />
                  <span>
                    Ready-to-Post Social Caption (Benefits + Direct Interface Link)
                  </span>
                </label>
                {isPostEdited && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPostEdited(false);
                      setCustomPostText(buildDefaultPostText(selectedItem));
                    }}
                    className="text-[11px] font-bold text-[#1673B8] hover:underline cursor-pointer"
                  >
                    Reset Default Benefits Copy
                  </button>
                )}
              </div>

              <textarea
                rows={7}
                value={activePostText}
                onChange={(e) => {
                  setIsPostEdited(true);
                  setCustomPostText(e.target.value);
                }}
                className="w-full p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs font-medium text-[#1A2138] leading-relaxed focus:outline-none focus:border-[#1673B8] focus:bg-white"
              />
            </div>

            {/* Direct 1-Click Publish Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => copySilently(activePostText, 'post')}
                className="px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>Post on LinkedIn</span>
              </a>

              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => copySilently(activePostText, 'post')}
                className="px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#0D65D9] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share on Facebook</span>
              </a>

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => copySilently(activePostText, 'post')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </a>

              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => copySilently(activePostText, 'post')}
                className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Post on X</span>
              </a>

              <button
                type="button"
                onClick={() => copySilently(activePostText, 'post')}
                className="px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] hover:bg-[#DCE9F6] border border-[#D2DEEA] text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedType === 'post' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Post Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="w-3.5 h-3.5 text-[#1673B8]" />
                    <span>Copy Post Text</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => copySilently(selectedItem.url, 'link')}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedType === 'link' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
