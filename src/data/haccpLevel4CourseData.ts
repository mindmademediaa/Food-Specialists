import { HubTraining } from '../types/hub';
import {
  CourseExamMCQ,
  InternationalTrainingCourse
} from './internationalTrainingsData';

export interface HaccpSimulatorPreset {
  name: string;
  categoryLabel: string;
  l: number;
  s: number;
  q1: boolean;
  q2: boolean;
  q3: boolean;
  q4: boolean;
  cl: string;
  mon: string;
  ca: string;
}

export interface HaccpPrpChecklistItem {
  id: number;
  cat: string;
  label: string;
  sub: string;
  defaultChecked: boolean;
}

export interface HaccpExamQuestionWithMod extends CourseExamMCQ {
  mod: 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6';
}

export const HACCP_L4_SIMULATOR_PRESETS: HaccpSimulatorPreset[] = [
  {
    name: 'HTST Milk Pasteurization',
    categoryLabel: '1. HTST Milk Pasteurization (Biological)',
    l: 4,
    s: 5,
    q1: true,
    q2: true,
    q3: false,
    q4: false,
    cl: '>= 72.0°C for >= 15 sec (OL: 73.5°C)',
    mon: 'Continuous FDV & chart recorder every 30m',
    ca: 'Auto-divert flow via FDV, hold product, recalibrate'
  },
  {
    name: 'Raw Poultry Chilled Storage',
    categoryLabel: '2. Raw Poultry Chilled Storage (Biological)',
    l: 3,
    s: 4,
    q1: true,
    q2: false,
    q3: true,
    q4: true,
    cl: 'Chiller <= 4.0°C',
    mon: 'Automated temp logger every 2 hours',
    ca: 'Adjust refrigeration; cooking step downstream eliminates pathogen'
  },
  {
    name: 'Cooked Meat Slicing Line',
    categoryLabel: '3. Cooked Meat Slicing Line (Physical - Blade)',
    l: 3,
    s: 4,
    q1: true,
    q2: false,
    q3: true,
    q4: true,
    cl: 'Intact slicer blade integrity',
    mon: 'Hourly visual blade inspection',
    ca: 'Quarantine product since last check; final Metal Detector is CCP'
  },
  {
    name: 'Final Pack Metal Detection',
    categoryLabel: '4. Final Pack Metal Detection (Physical)',
    l: 3,
    s: 5,
    q1: true,
    q2: true,
    q3: false,
    q4: false,
    cl: 'Fe <= 1.5mm, Non-Fe <= 2.0mm, SS <= 2.5mm',
    mon: 'Hourly certified test wand challenge',
    ca: 'Stop line, lock reject bin, re-screen all packs since last passed check'
  },
  {
    name: 'Dry Warehouse Storage',
    categoryLabel: '5. Dry Warehouse Storage (Ambient Pest/Dust)',
    l: 2,
    s: 2,
    q1: true,
    q2: false,
    q3: false,
    q4: false,
    cl: 'Clean, dry, pest-free ambient storage',
    mon: 'Weekly GMP & bait station inspection',
    ca: 'Clean spillages and repair door seals under standard PRPs'
  }
];

export const HACCP_L4_PRP_CHECKLIST_ITEMS: HaccpPrpChecklistItem[] = [
  {
    id: 1,
    cat: 'Sanitation (SSOP)',
    label: 'Pre-operational ATP Bioluminescence Swabbing Completed',
    sub: 'Pass Limit: < 30 RLU on stainless steel food contact surfaces',
    defaultChecked: true
  },
  {
    id: 2,
    cat: 'Sanitation (SSOP)',
    label: 'Sanitizer Concentration Verified via Calibrated Test Strips',
    sub: 'Chlorine: 100-200 ppm | QAC: 200-400 ppm at 20-30°C',
    defaultChecked: true
  },
  {
    id: 3,
    cat: 'Personal Hygiene',
    label: 'Daily Staff Medical Screening & Fitness-to-Work Log',
    sub: 'Zero staff with jaundice, diarrhea, vomiting, or infected wounds',
    defaultChecked: false
  },
  {
    id: 4,
    cat: 'Personal Hygiene',
    label: 'High-Care Airlock Handwash Station Audit',
    sub: 'Sensor taps 40-45°C, EN 1499 soap, sanitizer, single-use towels stocked',
    defaultChecked: false
  },
  {
    id: 5,
    cat: 'Facility & Pest',
    label: 'Glass & Brittle Plastic Register Verified Intact',
    sub: 'Sight glasses, light diffusers, and gauge covers free from cracks',
    defaultChecked: false
  },
  {
    id: 6,
    cat: 'Facility & Pest',
    label: 'EFK Catch Trays & Perimeter Bait Stations Checked',
    sub: 'EFK trays < 50% full; zero toxic bait inside food handling zones',
    defaultChecked: false
  },
  {
    id: 7,
    cat: 'Storage & Allergens',
    label: 'Chiller/Freezer Temps & Raw/RTE/Allergen Segregation',
    sub: 'Chiller 0-4°C | Freezer <= -18°C | Allergens stored on bottom racks',
    defaultChecked: false
  },
  {
    id: 8,
    cat: 'Utilities',
    label: 'Potable Process Water Free Residual Chlorine Test',
    sub: 'Verified between 0.2 ppm and 0.5 ppm at farthest plant tap',
    defaultChecked: false
  }
];

export const HACCP_L4_45_EXAM_QUESTIONS: HaccpExamQuestionWithMod[] = [
  // MODULE 1: Legal Framework & Food Safety Culture (Q1 - Q7)
  {
    id: 'tr-haccp-level-4-managerial-q-1',
    questionNumber: 1,
    mod: 'M1',
    question:
      "Following a Listeria monocytogenes outbreak linked to Ready-to-Eat smoked fish, the processor claims 'Due Diligence' in court because raw fish suppliers provided Certificates of Analysis (CoAs). Why does this legal defense fail?",
    options: [
      'CoAs are only valid for chemical hazards, not biological pathogens',
      'Under statutory food law, the manufacturer must prove all reasonable precautions and internal CCP validations were executed within their own process',
      'Due diligence only applies to retail supermarkets, not factories',
      'Listeria is exempt from Codex Alimentarius standards'
    ],
    correctIndex: 1,
    explanation:
      'A supplier CoA alone never satisfies legal Due Diligence; the FBO must prove its own internal process controls, CCP validations, and verification systems were actively working.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-2',
    questionNumber: 2,
    mod: 'M1',
    question:
      'Under the revised Codex Alimentarius General Principles of Food Hygiene (CXC 1-1969, Rev. 2022/2023), which management element was elevated to a foundational pillar alongside PRPs and HACCP?',
    options: [
      'ISO 9001 Quality Cost Accounting',
      'Positive Food Safety Culture commitment by leadership',
      'Blockchain cryptocurrency supplier payments',
      'Automated robotic packaging'
    ],
    correctIndex: 1,
    explanation:
      'Codex Rev 2022/2023 explicitly introduced Management Commitment to a positive Food Safety Culture as a mandatory core pillar.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-3',
    questionNumber: 3,
    mod: 'M1',
    question:
      'In Pakistan, a dairy plant exporting UHT milk and selling locally must align its HACCP system with which national PSQCA standard and provincial regulatory bodies?',
    options: [
      'PS: 3733 and Provincial Food Authorities (PFA, SFA, KPFA, BFA)',
      'PS: 1001 and the Ministry of Textiles',
      'NEQS Environmental Noise Act only',
      'SBP Banking Compliance Code'
    ],
    correctIndex: 0,
    explanation:
      "PS: 3733 is Pakistan's national standard for HACCP / Food Safety Management alongside Provincial Food Authority regulations."
  },
  {
    id: 'tr-haccp-level-4-managerial-q-4',
    questionNumber: 4,
    mod: 'M1',
    question:
      'How does the US FDA Food Safety Modernization Act (FSMA - HARPC, 21 CFR Part 117) differ from traditional Codex HACCP regarding preventive controls?',
    options: [
      'FSMA eliminates the need for hazard analysis',
      'FSMA requires risk-based Preventive Controls across Process, Allergen, Sanitation, and Supply-Chain—even when a step is not a traditional CCP',
      'FSMA only applies to canned pet food',
      'FSMA bans all chemical sanitizers'
    ],
    correctIndex: 1,
    explanation:
      'HARPC expands control beyond traditional process CCPs to formally include Allergen, Sanitation, and Supply-Chain Preventive Controls.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-5',
    questionNumber: 5,
    mod: 'M1',
    question:
      'During an unannounced inspection, a line operator admits they bypassed a slow metal detector to meet shift production targets set by the Plant Manager. Under Level 4 governance, what does this primarily demonstrate?',
    options: [
      'A failure in Food Safety Culture and distorted management KPIs',
      'A minor administrative typo',
      'A supplier quality failure',
      'Proper agile manufacturing'
    ],
    correctIndex: 0,
    explanation:
      'When production volume KPIs override CCP compliance, it reflects a systemic breakdown in leadership Food Safety Culture.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-6',
    questionNumber: 6,
    mod: 'M1',
    question:
      'Why must the Quality Assurance / HACCP Team Leader have a direct reporting line to Senior Executive Management rather than reporting solely to the Production Manager?',
    options: [
      'To reduce payroll taxes',
      'To prevent conflict of interest when stopping a production line or quarantining unsafe batches',
      'Because QA managers do not enter the factory floor',
      'To comply with marketing guidelines'
    ],
    correctIndex: 1,
    explanation:
      'Organizational independence ensures QA can halt production or hold non-conforming stock without pressure from output targets.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-7',
    questionNumber: 7,
    mod: 'M1',
    question:
      'Which of the following falls under TACCP (Threat Assessment Critical Control Point) and VACCP (Vulnerability Assessment) rather than traditional HACCP?',
    options: [
      'Accidental survival of Salmonella due to a faulty steam valve',
      'Intentional malicious contamination by a disgruntled employee (TACCP) and economically motivated adulteration of milk with melamine (VACCP)',
      'Growth of mold due to high humidity in a bread cooler',
      'Broken stainless steel wire from a flour sieve'
    ],
    correctIndex: 1,
    explanation:
      'HACCP addresses unintentional hazards; TACCP addresses ideologically/maliciously motivated sabotage, and VACCP addresses Economically Motivated Adulteration (EMA/Food Fraud).'
  },

  // MODULE 2: Prerequisite Programs - PRPs & SSOPs (Q8 - Q15)
  {
    id: 'tr-haccp-level-4-managerial-q-8',
    questionNumber: 8,
    mod: 'M2',
    question:
      'During the 7-step SSOP cleaning of a meat slicer, a sanitation worker applies 200 ppm sodium hypochlorite (chlorine) directly onto greasy meat residue without pre-rinsing or applying alkaline detergent. What is the microbiological outcome?',
    options: [
      'Pathogens are killed twice as fast',
      'Organic fat and protein inactivate free chlorine and shield bacteria inside biofilms, causing sanitization failure',
      'The stainless steel becomes permanently magnetized',
      'ATP readings drop to 0 RLU'
    ],
    correctIndex: 1,
    explanation:
      'Hypochlorite reacts with organic matter and cannot penetrate fat layers; detergent removal of soil is mandatory before disinfection.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-9',
    questionNumber: 9,
    mod: 'M2',
    question:
      'A pre-operational ATP bioluminescence swab on a Ready-to-Eat slicing conveyor yields 420 RLU (Pass limit: < 30 RLU). What must the QA Manager understand about ATP swabbing and require immediately?',
    options: [
      'ATP measures exact Salmonella colony counts; ship the product with a warning label',
      'ATP detects organic residue (food + microbial ATP) indicating cleaning failure; halt startup, re-execute full detergent-sanitize cycle, and re-swab until < 30 RLU',
      'Spray extra perfume in the room and start production',
      'Average the 420 RLU with three 0 RLU swabs from the walls'
    ],
    correctIndex: 1,
    explanation:
      'ATP measures total organic residue (Adenosine Triphosphate) in real time; a high RLU requires immediate re-cleaning and re-verification prior to line startup.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-10',
    questionNumber: 10,
    mod: 'M2',
    question:
      'How must airflow and air pressure differentials be engineered between a Raw Poultry Deboning Room and a Cooked Ready-to-Eat (RTE) Packaging Room?',
    options: [
      'Positive air pressure in the Raw room blowing air into the RTE room',
      'Positive air pressure (+5 to +15 Pa) in the High-Care RTE room so filtered air flows outward toward lower-risk/raw zones',
      'Equal negative pressure drawing air from outside drains',
      'Airflow direction has no impact on Listeria control'
    ],
    correctIndex: 1,
    explanation:
      'High-care RTE zones must maintain positive pressure relative to raw zones to prevent airborne pathogens from being sucked into exposed cooked product areas.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-11',
    questionNumber: 11,
    mod: 'M2',
    question:
      'A pest control contractor places anticoagulant toxic rodent bait blocks inside an open dry-ingredient mixing room. As a Level 4 HACCP Manager, how do you respond?',
    options: [
      'Approve it because toxic bait kills rats faster',
      'Immediately remove toxic bait from internal food zones (chemical contamination risk); enforce non-toxic mechanical traps/monitors inside and restrict toxic bait to locked external perimeter stations',
      'Move the toxic bait on top of the flour sacks',
      'Double the poison dosage'
    ],
    correctIndex: 1,
    explanation:
      'Toxic bait inside food production areas creates a severe risk of poisoned rodents dying in product or bait dust contaminating ingredients.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-12',
    questionNumber: 12,
    mod: 'M2',
    question:
      'Where must Electric Fly Killers (EFKs / UV insectocutors) be positioned in a food processing facility?',
    options: [
      'Directly above open mixing vats to catch flies before they land',
      'At least 3 meters away from exposed food and preparation tables, fitted with shatterproof sleeves, and away from glass windows that attract outside insects',
      'Inside refrigerated blast freezers',
      'On the floor next to floor drains'
    ],
    correctIndex: 1,
    explanation:
      'EFKs eject insect body fragments upon impact; placing them over open food causes physical/biological contamination, and placing them visible to external doors lures insects inside.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-13',
    questionNumber: 13,
    mod: 'M2',
    question:
      'A bakery produces Peanut Butter Cookies and Allergen-Free Vanilla Biscuits on the same line. Which scheduling and storage protocol best prevents allergen cross-contact?',
    options: [
      'Run Peanut Cookies first, then blow compressed air over the belt before Vanilla Biscuits',
      'Store peanuts on the top rack of the warehouse and run Peanut Cookies randomly',
      'Store allergens in sealed containers on bottom racks; schedule Allergen-Free Vanilla Biscuits first after deep CIP, followed by Peanut Cookies and validated protein-swab wet cleaning',
      'Bake Vanilla Biscuits at 10°C higher temperature to destroy peanut proteins'
    ],
    correctIndex: 2,
    explanation:
      'Thermal baking does not destroy allergenic proteins; running non-allergen lines first and storing allergens on bottom racks prevents spill and line carryover.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-14',
    questionNumber: 14,
    mod: 'M2',
    question:
      'During a routine glass and brittle plastic audit, a sight-glass on an enclosed sauce mixing tank is found cracked with a 1cm piece missing. What is the mandatory action?',
    options: [
      'Put clear tape over the crack and repair it on Sunday',
      'Quarantine the current batch and all batches since the last intact glass check, drain/inspect the tank and filters, replace the sight-glass, and log an NCR',
      'Rely on the metal detector at the end of the line to catch the glass',
      'Ignore it if the sauce looks clear'
    ],
    correctIndex: 1,
    explanation:
      'Metal detectors cannot detect glass; broken glass above or in a product vessel requires immediate line stop, batch quarantine back to the last intact inspection, and physical teardown.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-15',
    questionNumber: 15,
    mod: 'M2',
    question:
      'What is the required microbiological and chemical standard for in-plant potable process water used for washing Ready-to-Eat vegetables?',
    options: [
      'Total Coliforms < 500 CFU/100ml and 0 ppm chlorine',
      'E. coli / Coliforms 0 CFU/100ml (absent) and Free Residual Chlorine maintained between 0.2 and 0.5 ppm at the terminal tap',
      'Untreated borehole water tested once every 5 years',
      'Distilled water with pH 2.0'
    ],
    correctIndex: 1,
    explanation:
      'Potable water must have zero coliforms/E. coli and maintain 0.2–0.5 ppm residual chlorine at point of use to prevent pipeline recontamination.'
  },

  // MODULE 3: Preliminary Steps 1 to 5 (Q16 - Q22)
  {
    id: 'tr-haccp-level-4-managerial-q-16',
    questionNumber: 16,
    mod: 'M3',
    question:
      'Why does Codex Step 1 require a multidisciplinary HACCP team rather than allowing an external consultant or solo QA Manager to write the entire HACCP plan alone?',
    options: [
      'To spread legal blame equally among staff',
      'Because accurate hazard identification requires combined practical knowledge of equipment mechanics (Engineering), process flow (Production), and pathogen kinetics (QA/Microbiology)',
      'Because auditors charge less when more names are on the cover page',
      'To satisfy labor union quotas'
    ],
    correctIndex: 1,
    explanation:
      'No single individual understands every hidden mechanical dead-leg, valve pressure drop, operator shortcut, and microbiological hazard across a plant.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-17',
    questionNumber: 17,
    mod: 'M3',
    question:
      'In Step 2 (Describe the Product), a chilled garlic-in-oil puree has pH = 5.8, water activity (a_w) = 0.97, and is vacuum-packed (anaerobic). Which specific pathogen hazard must the HACCP team immediately flag?',
    options: [
      'Staphylococcus aureus only',
      'Non-proteolytic / proteolytic Clostridium botulinum spore germination and neurotoxin production',
      'Norovirus multiplication',
      'Trichinella spiralis growth'
    ],
    correctIndex: 1,
    explanation:
      'C. botulinum thrives in anaerobic (vacuum/oil) environments when pH > 4.6 and a_w > 0.93.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-18',
    questionNumber: 18,
    mod: 'M3',
    question:
      'In Step 3 (Identify Intended Use), a powdered milk product is marketed for neonatal hospital wards (YOPI group). How does this impact the HACCP plan compared to standard adult skim milk powder?',
    options: [
      'No difference exists',
      'Strict zero-tolerance microbiological controls for Cronobacter sakazakii and Salmonella must be established, with elevated hygiene zoning and tighter lot sampling',
      'Only the packaging artwork changes',
      'Critical limits can be relaxed because hospitals are clean'
    ],
    correctIndex: 1,
    explanation:
      'Infant and immunocompromised (YOPI) populations have vastly lower infectious doses, requiring stringent pathogen controls like Cronobacter testing.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-19',
    questionNumber: 19,
    mod: 'M3',
    question:
      'Which elements are frequently omitted by novice teams in Step 4 (Construct Process Flow Diagram) that cause critical audit failures?',
    options: [
      'Company logo and font style',
      'Rework/recycle loops, intermediate holding delays, culinary steam/water/air inputs, packaging material entry, and waste exit points',
      'Retail supermarket shelf price',
      'Employee payroll schedules'
    ],
    correctIndex: 1,
    explanation:
      'Rework loops and rework holding stages are prime sources of allergen cross-contact and bacterial toxin accumulation if left off the PFD.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-20',
    questionNumber: 20,
    mod: 'M3',
    question:
      'Why must Step 5 (On-Site Confirmation of Flow Diagram) be performed across all operational shifts, including the night shift and weekend sanitation?',
    options: [
      'To check if night shift lights are bright enough',
      'Because night shift crews may use temporary holding racks, bypass piping, or manual rework methods not shown on engineering blueprints',
      'To give the HACCP team overtime pay',
      'Codex requires Step 5 only during daytime'
    ],
    correctIndex: 1,
    explanation:
      'Actual floor practices during off-peak shifts frequently diverge from theoretical daytime flow diagrams.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-21',
    questionNumber: 21,
    mod: 'M3',
    question:
      'A meat processing plant installs a new high-speed vacuum tumbler and reformulates its brine to reduce salt by 40%. When must the HACCP team review the PFD and Hazard Analysis?',
    options: [
      'During the next annual review in 11 months',
      'Prior to commissioning the change (Management of Change), because equipment modification and lower salt (higher water activity) alter pathogen growth risks',
      'Only if a customer complains of sickness',
      'Never, because meat is still the main ingredient'
    ],
    correctIndex: 1,
    explanation:
      'Reducing salt increases water activity (a_w), directly impacting pathogen growth kinetics; Management of Change (MoC) requires re-validation before commercial launch.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-22',
    questionNumber: 22,
    mod: 'M3',
    question:
      'When designing a high-care plant schematic alongside the PFD, how should personnel flow, raw material flow, and waste removal flow be arranged?',
    options: [
      'All three should share the same central corridor for efficiency',
      'Linear unidirectional flow (Raw -> Processed -> High Care) with counter-current personnel entry locks and dedicated waste exits that never cross exposed RTE products',
      'Circular flow returning through the raw meat chillers',
      'Personnel should enter directly through the loading dock into high-care'
    ],
    correctIndex: 1,
    explanation:
      'Linear separation prevents cross-contamination between raw materials, waste streams, and finished RTE products.'
  },

  // MODULE 4: The 7 Principles - Steps 6 to 12 (Q23 - Q35)
  {
    id: 'tr-haccp-level-4-managerial-q-23',
    questionNumber: 23,
    mod: 'M4',
    question:
      "In Principle 1 (Hazard Analysis), a team writes 'Bacterial contamination' and 'Foreign matter' as hazards on their worksheet. Why will a Level 4 auditor reject this?",
    options: [
      'The font is too small',
      'Hazards must be specifically named by biological agent (e.g., Salmonella enterica, Bacillus cereus emetic toxin) and physical source/size (e.g., stainless steel blade splinters > 2mm) so targeted controls and critical limits can be validated',
      'Only chemical hazards are allowed in HACCP',
      'Scientific names are prohibited'
    ],
    correctIndex: 1,
    explanation:
      "Generic terms like 'bacteria' cannot be validated because thermal death times (D/Z values) and spore resistance differ drastically by organism."
  },
  {
    id: 'tr-haccp-level-4-managerial-q-24',
    questionNumber: 24,
    mod: 'M4',
    question:
      "Using the 5x5 Risk Assessment Matrix, a raw milk receiving step has a hazard of 'Aflatoxin M1 residue'. Likelihood is scored 3 (Occasional) and Severity is scored 4 (Major chronic liver toxicity). What is the Risk Score and required pathway?",
    options: [
      'Score = 7; manage via routine warehouse sweeping',
      'Score = 12 (Significant Hazard); must be evaluated through the Codex CCP Decision Tree / strict Supplier & Receiving Preventive Controls',
      'Score = 1; ignore completely',
      'Score = 25; shut down the dairy permanently'
    ],
    correctIndex: 1,
    explanation:
      'Score = 3 x 4 = 12 (falls in the >= 10 Significant Risk zone), requiring formal evaluation for CCP/OPRP control.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-25',
    questionNumber: 25,
    mod: 'M4',
    question:
      "Apply the Codex 4-Question Decision Tree to 'Raw Poultry Chilled Storage (<= 4°C)' for Salmonella in a plant that subsequently cooks the poultry to 78°C core temperature: Q1=Yes, Q2=No, Q3=Yes, Q4=Yes. What is the result?",
    options: [
      'Raw Chilled Storage is a CCP',
      'Raw Chilled Storage is NOT a CCP (it is an OPRP/PRP), because Q4 is Yes—subsequent thermal cooking eliminates Salmonella to an acceptable level',
      'Cooking is not needed',
      'Both steps are eliminated'
    ],
    correctIndex: 1,
    explanation:
      'When Q2=No, Q3=Yes, and Q4=Yes (a subsequent step eliminates the hazard), the current step is not a CCP.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-26',
    questionNumber: 26,
    mod: 'M4',
    question:
      'Why does thermal pasteurization ONLY eliminate vegetative cells of Staphylococcus aureus or Bacillus cereus, making pre-pasteurization temperature control critical if heat-stable toxins have already formed?',
    options: [
      'Pasteurization freezes the milk',
      'Staphylococcal enterotoxins and B. cereus emetic toxin (cereulide) are highly heat-stable and survive standard pasteurization even after the bacteria are killed',
      'Toxins evaporate only at 0°C',
      'Pasteurization increases bacterial counts'
    ],
    correctIndex: 1,
    explanation:
      'Pre-formed heat-stable toxins survive thermal pasteurization (72°C/15s) and even retort cooking, so preventing prior proliferation is critical.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-27',
    questionNumber: 27,
    mod: 'M4',
    question:
      "In Principle 3 (Establish Critical Limits), why is 'Cook chicken until golden brown and juices run clear with no odor' unacceptable as a Critical Limit?",
    options: [
      'It is too expensive to measure',
      'Subjective sensory traits cannot be objectively measured or validated for pathogen lethality; a Critical Limit must be a quantifiable physical/chemical parameter (e.g., Core Temp >= 75°C for >= 30 seconds)',
      'Golden brown chicken is illegal',
      'Thermometers are banned in kitchens'
    ],
    correctIndex: 1,
    explanation:
      'Critical Limits must be objective, measurable, real-time parameters scientifically linked to pathogen reduction.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-28',
    questionNumber: 28,
    mod: 'M4',
    question:
      'A pasteurizer has a validated Critical Limit (CL) of 72.0°C for 15 seconds. The QA Manager sets the Operating Limit (OL) alarm at 73.5°C for 16 seconds. What is the strategic purpose of the Operating Limit?',
    options: [
      'To waste boiler fuel',
      'To provide a safety buffer zone that triggers operator adjustment or automatic correction BEFORE the statutory Critical Limit is breached, preventing costly product quarantine',
      'To confuse regulatory inspectors',
      'To replace the need for thermometer calibration'
    ],
    correctIndex: 1,
    explanation:
      'Crossing an Operating Limit triggers process adjustment without creating unsafe product; crossing a Critical Limit mandates quarantine and corrective action.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-29',
    questionNumber: 29,
    mod: 'M4',
    question:
      'Why is periodic microbiological lab testing of finished product (which takes 48–72 hours for culture results) NOT an acceptable primary Monitoring method (Principle 4) for an inline CCP?',
    options: [
      'Microbiologists charge too much',
      'CCP monitoring must provide real-time or near-real-time feedback to maintain process control before batch release; 72-hour lab testing is a Verification tool, not inline monitoring',
      'Lab tests are always inaccurate',
      'Codex bans microbiological testing'
    ],
    correctIndex: 1,
    explanation:
      'Monitoring must detect loss of control in time to isolate product immediately; slow end-product microbiological testing is used for Verification.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-30',
    questionNumber: 30,
    mod: 'M4',
    question:
      'At 11:00 AM, the hourly Metal Detector challenge test fails to reject the 2.5mm Stainless Steel test wand. The last passed test was at 10:00 AM. Under Principle 5 (Corrective Action), what is the mandatory protocol?',
    options: [
      'Fix the detector and continue packing without touching the 10:00–11:00 AM pallets',
      'Stop the line, repair/re-validate the detector, quarantine 100% of product packed since 10:00 AM (last good check), re-pass quarantined packs through a working detector, and complete Root Cause Analysis',
      'Only check the last 5 boxes on the conveyor',
      'Lower the detector sensitivity until it passes'
    ],
    correctIndex: 1,
    explanation:
      'All product produced since the last successful monitoring check (10:00 AM) is potentially compromised and must be held and re-screened.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-31',
    questionNumber: 31,
    mod: 'M4',
    question:
      'Distinguish accurately between Validation and Verification under Principle 6 (Step 11):',
    options: [
      'They are identical synonyms',
      'Validation is obtaining scientific/technical evidence BEFORE or during process changes that a control measure can achieve the required hazard reduction (5-log kill); Verification is ongoing auditing/testing to confirm the plan is being followed as designed',
      'Validation is done by line cleaners; Verification is done by customers',
      'Verification happens only once when the factory is built'
    ],
    correctIndex: 1,
    explanation:
      "Validation answers 'Will this control work scientifically?' while Verification answers 'Are we actually following the plan day-to-day?'"
  },
  {
    id: 'tr-haccp-level-4-managerial-q-32',
    questionNumber: 32,
    mod: 'M4',
    question:
      'In thermal process validation, if a target pathogen has a D-value at 65°C (D₆₅) of 1.2 minutes, how long must the product core be held at 65°C to achieve a 6-log (6D) reduction?',
    options: [
      '1.2 minutes',
      '7.2 minutes (6 x 1.2 min)',
      '0.2 minutes',
      '65 minutes'
    ],
    correctIndex: 1,
    explanation:
      'Each D-value represents a 1-log (90%) reduction; a 6-log reduction requires 6 x D = 6 x 1.2 = 7.2 minutes.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-33',
    questionNumber: 33,
    mod: 'M4',
    question:
      'What is the correct procedure when verifying an inline CCP Metal Detector using certified Ferrous, Non-Ferrous, and Stainless Steel test cards?',
    options: [
      'Wave the test card near the outside metal frame of the detector',
      'Place the test card with the product at the geometric center of the aperture (worst-case sensitivity zone), test Leading, Middle, and Trailing positions, and verify both detection alarm and physical timing of the reject arm into a locked bin',
      'Drop all three test cards together without any food pack',
      'Turn off the conveyor belt during testing'
    ],
    correctIndex: 1,
    explanation:
      'The center of the tunnel aperture has the weakest magnetic field, and testing with packs ensures product effect and pneumatic reject timing are verified.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-34',
    questionNumber: 34,
    mod: 'M4',
    question:
      'How do you perform a two-point physical verification check on a handheld digital CCP probe thermometer in the factory?',
    options: [
      'Hold it under a warm handdryer and inside a domestic fridge',
      'Check in agitated crushed ice-water slurry (0.0°C ± 0.5°C) and boiling water (100.0°C ± 0.5°C at sea level) against a NIST/ISO 17025 certified reference thermometer',
      'Compare it with the wall room-temperature clock',
      'Put it inside hot soup'
    ],
    correctIndex: 1,
    explanation:
      'Crushed ice slurry (0°C) and boiling water (100°C adjusted for altitude) provide stable physical phase-change points for calibration verification.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-35',
    questionNumber: 35,
    mod: 'M4',
    question:
      'Following cooked meat pasteurization, why is Blast Chilling from 60°C down to <= 4°C within <= 4 hours managed as a critical control parameter?',
    options: [
      'To improve meat slicing color',
      'To pass rapidly through the spore germination temperature danger zone (52°C–12°C) and prevent outgrowth of heat-shocked Clostridium perfringens and Bacillus cereus spores',
      'To freeze water into large ice crystals',
      'To kill Listeria via cold shock'
    ],
    correctIndex: 1,
    explanation:
      'Cooking activates dormant heat-resistant bacterial spores; slow cooling through 52°C–12°C allows rapid germination and multiplication.'
  },

  // MODULE 5: Documentation & Traceability (Q36 - Q40)
  {
    id: 'tr-haccp-level-4-managerial-q-36',
    questionNumber: 36,
    mod: 'M5',
    question:
      'A shelf-stable canned tuna product has a 3-year shelf life. How long must the manufacturer retain the retort CCP sterilization charts and batch traceability records?',
    options: [
      '3 months after production',
      'For the entire shelf life plus at least 1 additional year (minimum 4 years) to support legal defense and recall investigations',
      'Until the next monthly internal audit',
      '7 days'
    ],
    correctIndex: 1,
    explanation:
      "Records must outlast the product's commercial shelf life by at least 1 year so historical evidence exists if a late consumer claim arises."
  },
  {
    id: 'tr-haccp-level-4-managerial-q-37',
    questionNumber: 37,
    mod: 'M5',
    question:
      'During a Mock Recall & Mass Balance exercise for 1,000 kg of suspect flour used across 4 production batches, what defines a successful Level 4 pass criterion?',
    options: [
      'Locating 50% of the flour within 2 weeks',
      'Accounting for 98%–102% of the total mass (finished stock in warehouse + shipped to customers + rework + documented line waste/QA samples) within 2 to 4 hours',
      'Sending a general email to suppliers without checking warehouse stock',
      'Only tracing forward without checking rework loops'
    ],
    correctIndex: 1,
    explanation:
      'Global GFSI and regulatory standards require 100% (98–102% accounting for moisture change) mass-balance reconciliation within max 4 hours.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-38',
    questionNumber: 38,
    mod: 'M5',
    question:
      'An operator makes a mistake while writing a CCP temperature on a paper log. How must the correction be documented on a controlled quality record?',
    options: [
      'Erase it with white correction fluid (Tipp-Ex) so the sheet looks neat',
      "Tear up the whole day's sheet and rewrite it from memory at 5:00 PM",
      'Draw a single line through the error so the original entry remains legible, write the correct value alongside, and sign/initial and date the correction',
      'Scratch a hole through the paper'
    ],
    correctIndex: 2,
    explanation:
      'Good Documentation Practice (GDP / ALCOA+) strictly forbids obliterating data with correction fluid or rewriting logs from memory.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-39',
    questionNumber: 39,
    mod: 'M5',
    question:
      'Why must every printed SOP and CCP monitoring form carry a controlled Document ID, Version/Revision Number, Issue Date, and Authorization Signature?',
    options: [
      'To use more printer ink',
      'To prevent operators from recording critical limits on obsolete forms after a process or critical limit has been updated',
      'To satisfy graphic design awards',
      'So customers can read them online'
    ],
    correctIndex: 1,
    explanation:
      'Document version control prevents obsolete critical limits from remaining in circulation on the shop floor.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-40',
    questionNumber: 40,
    mod: 'M5',
    question:
      'A plant replaces a manual chlorine dosing pump with an automated Ozone sanitation system. Which document protocol must be completed BEFORE operating the new system?',
    options: [
      'Nothing until the external auditor arrives',
      'Management of Change (MoC) dossier including updated Hazard Analysis, Validation of Ozone microbial efficacy, updated SSOP, and operator retraining logs',
      'Only a purchase invoice in the accounting department',
      'A marketing press release'
    ],
    correctIndex: 1,
    explanation:
      'Any change to sanitation chemistry, equipment, or process parameters requires formal Management of Change (MoC) and re-validation.'
  },

  // MODULE 6: ISO 19011 Auditing (Q41 - Q45)
  {
    id: 'tr-haccp-level-4-managerial-q-41',
    questionNumber: 41,
    mod: 'M6',
    question:
      'Under ISO 19011 auditing principles, why can a Production Manager NOT perform the internal HACCP audit of their own production lines?',
    options: [
      'Production managers do not know how to read',
      'Rule of Independence & Impartiality: Auditors must not audit their own work or department to avoid bias and self-review conflicts',
      'Only external government inspectors can perform internal audits',
      'Internal audits are optional'
    ],
    correctIndex: 1,
    explanation:
      'ISO 19011 mandates auditor independence from the activity being audited to guarantee objectivity.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-42',
    questionNumber: 42,
    mod: 'M6',
    question:
      "At 1:45 PM during a floor audit, the auditor inspects the Cooker CCP log and notices temperatures are already recorded and signed for 2:00 PM, 3:00 PM, and 4:00 PM, all showing an identical '75.0°C'. How is this classified?",
    options: [
      'High efficiency time management',
      "A Critical Non-Conformance for record falsification ('Pencil Whipping / Dry Labbing'), requiring immediate investigation, batch hold, and disciplinary/systemic action",
      'A Minor typographical observation',
      'Acceptable if the cooker usually runs well'
    ],
    correctIndex: 1,
    explanation:
      'Pre-filling future CCP checks is fraudulent falsification of food safety records and constitutes an immediate Critical Non-Conformance.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-43',
    questionNumber: 43,
    mod: 'M6',
    question:
      "While using the 'Audit Triangle' at a pasteurizer CCP, how should the Lead Auditor interview the line operator?",
    options: [
      "Ask closed yes/no questions like 'Do you follow the SOP?'",
      "Use open, scenario-based questions: 'Show me how you check the flow diversion valve, and tell me what exact action you take if the temperature drops to 70.5°C'",
      'Interview the HR director instead of the operator',
      'Only read the manual in the conference room'
    ],
    correctIndex: 1,
    explanation:
      'Open demonstration questions test genuine operator competency and real-time adherence to Critical Limits and Corrective Actions.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-44',
    questionNumber: 44,
    mod: 'M6',
    question:
      'During an audit, you find that the reference thermometer used to calibrate all plant CCP probes expired 8 months ago, though the pasteurizer is currently running at 74°C. How do you grade this finding?',
    options: [
      'Critical Non-Conformance (burn the factory)',
      'Major Non-Conformance: Systemic breakdown of calibration verification compromising confidence in measurement accuracy across CCPs',
      'No finding at all',
      'Commendation for saving calibration fees'
    ],
    correctIndex: 1,
    explanation:
      'An expired master reference instrument invalidates calibration traceability across CCPs—a systemic breakdown graded as a Major Non-Conformance.'
  },
  {
    id: 'tr-haccp-level-4-managerial-q-45',
    questionNumber: 45,
    mod: 'M6',
    question:
      "An internal audit raises a Non-Conformance because an operator missed 2 hourly metal detector checks during a shift change. The Production Manager writes 'Operator was scolded and told to be careful' as the CAPA. Why must the Lead Auditor reject this CAPA?",
    options: [
      'The operator should have been fired immediately',
      "Retraining/blaming an individual is only a symptom fix, not a 5-Why Root Cause Preventive Action (e.g., installing an automated shift-handover interlock alarm that stops the belt if the hourly test isn't completed within 5 minutes)",
      'CAPAs do not require root cause analysis',
      'Auditors are not allowed to review CAPAs'
    ],
    correctIndex: 1,
    explanation:
      'True Preventive Action (CAPA) addresses the systemic root cause (e.g., engineering interlocks or shift-handover controls) rather than blaming human vigilance.'
  }
];

export const HACCP_LEVEL_4_MANAGERIAL_COURSE: InternationalTrainingCourse = {
  id: 'tr-haccp-level-4-managerial',
  code: 'FS-L4-2026-PK',
  title: 'HACCP Level 4: Managing Food Safety Systems (Codex CXC 1-1969 Rev 2023)',
  levelBadge: 'Level 4 Managerial Standard',
  accreditationStandard:
    'Codex Alimentarius CXC 1-1969 (Rev. 2023), Pakistan PS: 3733 & ISO 19011 Auditing Guidelines',
  duration: '18 Guided Hours · 6 Modules · Interactive Simulators · 45-MCQ Exam',
  certificateFeeRs: 1000,
  passPercentage: 80,
  distinctionPercentage: 85,
  totalExamQuestions: 45,
  description:
    'Level 4 Award in Managing HACCP for Food Manufacturing & Catering: Comprehensive managerial training covering Module 1 (Legal Framework, Pakistan PS:3733, US FDA FSMA & Due Diligence Defense), Module 2 (ISO/TS 22002-1 PRPs, 7-Step SSOPs, ATP Swabbing & Positive Air Zoning), Module 3 (Preliminary Steps 1–5 & Multi-Shift Walk-Throughs), Module 4 (The 7 Principles Steps 6–12, Interactive 5x5 Risk Matrix & Codex CCP Decision Tree Simulator), Module 5 (4-Tier Documentation & 4-Hour Mass Balance Recall), and Module 6 (ISO 19011 Auditing & Grading NCRs), plus a 45-MCQ Managerial Certification Exam.',
  modules: [
    {
      id: 'tr-haccp-level-4-managerial-m1',
      moduleNumber: 1,
      title: 'Module 1: Legal Framework & Managerial Responsibility',
      estimatedMinutes: 90,
      overview:
        'Codex Alimentarius CXC 1-1969 (Rev 2023), Pakistan PS:3733, Provincial Food Authorities (PFA, SFA, KPFA, BFA), US FDA FSMA (21 CFR Part 117), EU Reg 852/2004, Positive Food Safety Culture, TACCP/VACCP, and Legal Due Diligence Defense.',
      internationalClauses: [
        'Codex Alimentarius CXC 1-1969 (Rev. 2022/2023) — General Principles of Food Hygiene & Food Safety Culture',
        'Pakistan PSQCA Standard PS: 3733 & Provincial Pure Food Regulations (PFA, SFA, KPFA, BFA)',
        'US FDA FSMA 21 CFR Part 117 (HARPC) & EU Regulation (EC) 852/2004 Article 5'
      ],
      keyPrinciples: [
        'Codex CXC 1-1969 (Rev. 2022/2023): International benchmark integrating 12 Steps, 7 Principles, Positive Food Safety Culture commitment by leadership, and Allergen Control.',
        'Pakistan & Export Mandates: PSQCA Standard PS: 3733 and Provincial Food Authorities (PFA, SFA, KPFA, BFA) Pure Food Regulations require hazard-based controls and full traceability; US FDA FSMA (21 CFR Part 117 - HARPC) mandates Process, Allergen, Sanitation, and Supply-Chain Preventive Controls.',
        'Legal Due Diligence Defense & Organizational Independence: A Food Business Operator (FBO) cannot rely on supplier CoAs alone—management must prove scientific validation of Critical Limits, continuous un-falsified CCP logs, immediate CAPA on deviations, and direct QA reporting to Senior Executive Management.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Statutory Legal Due Diligence & CCP Validation Evidence',
          standardLimit:
            '100% scientifically validated Critical Limits + continuous real-time CCP logs + independent QA reporting line to Senior Management',
          correctiveProtocol:
            'Halt non-conforming production immediately, quarantine affected batches, and execute 5-Why Root Cause CAPA without production KPI interference.'
        },
        {
          parameter: 'TACCP (Sabotage) & VACCP (Economically Motivated Adulteration)',
          standardLimit:
            '100% access-controlled high-risk zones + approved supplier vulnerability screening against adulterants (e.g., melamine in milk)',
          correctiveProtocol:
            'Delist fraudulent suppliers immediately, lock vulnerable chemical/water storage areas, and report intentional tampering to regulatory authorities.'
        }
      ],
      practicalChecklist: [
        'Verify QA / HACCP Team Leader reports directly to Senior Executive Management independently of Production targets.',
        'Confirm alignment with Codex CXC 1-1969 (Rev. 2023), Pakistan PS: 3733, and applicable Provincial Food Authority licensing requirements.',
        'Audit plant KPIs to ensure production speed never overrides metal detector or thermal CCP compliance.'
      ]
    },
    {
      id: 'tr-haccp-level-4-managerial-m2',
      moduleNumber: 2,
      title: 'Module 2: Prerequisite Programs (PRPs - ISO/TS 22002-1)',
      estimatedMinutes: 95,
      overview:
        'GMPs, 7-Step SSOPs, ATP Bioluminescence Swabbing (< 30 RLU), 3-Line Integrated Pest Management, Allergen Segregation, Potable Water Residual Chlorine, and Positive Air Pressure Zoning (+5 to +15 Pa).',
      internationalClauses: [
        'ISO/TS 22002-1:2009 — Prerequisite Programmes on Food Safety (Part 1: Food Manufacturing)',
        'Codex CXC 1-1969 Section 1: Good Hygiene Practices (GHPs) & CXC 80-2020 Allergen Management'
      ],
      keyPrinciples: [
        '7-Step SSOP Protocol: (1) Dry scrape heavy soil, (2) Pre-rinse with 45–50°C warm water, (3) Alkaline/acid detergent foam to remove fat/biofilm, (4) Potable water rinse, (5) Sanitize (100–200 ppm Chlorine or 200–400 ppm QAC), (6) Final rinse if required, (7) Air dry & pre-op ATP Swab (< 30 RLU).',
        '3-Line Integrated Pest Management (IPM): Line 1 (Perimeter tamper-resistant bait stations every 15–20m outside; zero toxic rodenticides inside food zones), Line 2 (Proofing: door gaps < 3mm, mesh screens < 1.2mm), Line 3 (Internal shatterproof LED Electric Fly Killers placed >= 3m away from exposed food).',
        'Zoning, Utilities & Allergens: High-Care RTE zones maintained at positive pressure (+5 to +15 Pa) so filtered air flows outward toward raw areas; potable water at 0 CFU/100ml Coliforms and 0.2–0.5 ppm free residual chlorine at terminal tap; allergens stored sealed on bottom racks and scheduled after non-allergen runs.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Pre-Operational ATP Swabbing & Sanitizer Concentration',
          standardLimit:
            'ATP Bioluminescence < 30 RLU on stainless steel food contact surfaces | Chlorine 100–200 ppm / QAC 200–400 ppm at 20–30°C',
          correctiveProtocol:
            'Halt line startup if ATP >= 30 RLU; re-execute full detergent-wash and sanitization cycle and re-swab until < 30 RLU before releasing line.'
        },
        {
          parameter: 'High-Care Positive Air Pressure & Potable Water Chlorine',
          standardLimit:
            'High-Care RTE Pressure Differential: +5 to +15 Pa outward | Potable Water: 0 CFU/100ml E. coli/Coliforms & 0.2–0.5 ppm Free Chlorine',
          correctiveProtocol:
            'Inspect HVAC HEPA filters and airlock doors if pressure drops; adjust chlorine dosing and hold RTE washing if residual chlorine falls below 0.2 ppm.'
        }
      ],
      practicalChecklist: [
        'Verify zero toxic rodenticide bait blocks are present inside internal food handling or dry mixing rooms.',
        'Check that all Electric Fly Killers (EFKs) have shatterproof UV tubes and are mounted >= 3m away from open food vats.',
        'Inspect Glass & Brittle Plastic Register for sight-glasses, light diffusers, and gauge covers prior to shift startup.'
      ]
    },
    {
      id: 'tr-haccp-level-4-managerial-m3',
      moduleNumber: 3,
      title: 'Module 3: Preliminary Steps of HACCP (Steps 1–5)',
      estimatedMinutes: 90,
      overview:
        'Step 1 (Multidisciplinary HACCP Team), Step 2 (Intrinsic/Extrinsic Product Specs: pH, water activity a_w, packaging), Step 3 (Intended Use & YOPI Vulnerability), Step 4 (Process Flow Diagrams including rework & utilities), and Step 5 (Multi-Shift On-Site Verification).',
      internationalClauses: [
        'Codex Alimentarius CXC 1-1969 HACCP System — Preliminary Steps 1 to 5',
        'ISO 22000:2018 Clause 8.5.1 — Preliminary Steps to Enable Hazard Analysis'
      ],
      keyPrinciples: [
        'Step 1 Multidisciplinary Team: Requires QA Lead, Production Manager, Maintenance Engineer, Microbiologist, and Procurement so equipment mechanics, flow rates, and pathogen kinetics are jointly evaluated.',
        'Steps 2 & 3 Product Description & YOPI Intended Use: Document intrinsic factors (pH, water activity a_w, preservatives) and extrinsic factors (vacuum/MAP, storage temp)—e.g., vacuum-packed garlic-in-oil with pH 5.8 and a_w 0.97 triggers Clostridium botulinum control; neonatal/hospital products (YOPI: Young, Old, Pregnant, Immunocompromised) require zero-tolerance Cronobacter sakazakii and Salmonella controls.',
        'Steps 4 & 5 Process Flow Diagram (PFD) & Multi-Shift Walk-Through: PFD must include raw inputs, packaging, water/steam/air contact, rework loops, hold delays, and waste exits, and must be verified on-site across Morning, Night, and Weekend Sanitation shifts.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Intrinsic Formulation Hurdles (pH & Water Activity a_w)',
          standardLimit:
            'Acidified foods pH <= 4.6 or low-moisture a_w <= 0.85 (or strict refrigerated <= 3.3°C / thermal botulinum cook if anaerobic pH > 4.6 & a_w > 0.93)',
          correctiveProtocol:
            'Reject or hold any reformulated batch (e.g., reduced salt/acid) until Management of Change (MoC) shelf-life challenge testing validates pathogen inhibition.'
        },
        {
          parameter: 'On-Site PFD Verification Across All Shifts (Step 5)',
          standardLimit:
            '100% physical confirmation of Process Flow Diagram across Day, Night, and Sanitation shifts including all rework loops and holding tanks',
          correctiveProtocol:
            'Immediately update PFD and Hazard Analysis if undocumented bypass pipes, temporary night-shift holding racks, or manual rework steps are discovered.'
        }
      ],
      practicalChecklist: [
        'Verify HACCP Team roster includes Engineering, Production, QA/Microbiology, and Procurement representatives with documented training.',
        'Trace all rework loops, culinary steam/water entry points, and waste exits on the floor against the signed Process Flow Diagram.',
        'Confirm Management of Change (MoC) review is triggered prior to commissioning any new equipment or recipe salt/preservative reduction.'
      ]
    },
    {
      id: 'tr-haccp-level-4-managerial-m4',
      moduleNumber: 4,
      title: 'Module 4: The 7 Principles of HACCP (Steps 6–12)',
      estimatedMinutes: 110,
      overview:
        'Principle 1 (Specific Hazard Analysis B/C/P/R/EMA & 5x5 Risk Matrix), Principle 2 (Codex 4-Question CCP Decision Tree), Principle 3 (Critical Limits vs. Operating Limits), Principle 4 (Real-Time Monitoring), Principle 5 (Corrective Actions & Quarantine), Principle 6 (Scientific Validation vs. Verification), and Principle 7 (Record Keeping).',
      internationalClauses: [
        'Codex Alimentarius CXC 1-1969 — The Seven Principles of HACCP (Steps 6 to 12)',
        'ISO 22000:2018 Clauses 8.5.2 – 8.5.4 (Hazard Assessment, OPRP vs. CCP Selection, Validation & Verification)'
      ],
      keyPrinciples: [
        'Principle 1 & 2 (5x5 Risk Matrix & Codex Decision Tree): Name specific biological/chemical/physical hazards (e.g., Coxiella burnetii, Aflatoxin M1, SS fragments > 2mm). Multiply Likelihood (1–5) × Severity (1–5); scores >= 10 enter the Codex 4-Question Decision Tree (Q1–Q4) to distinguish OPRPs (where a subsequent step Q4=Yes eliminates the hazard) from true CCPs (Q2=Yes or Q4=No).',
        'Principle 3, 4 & 5 (Critical Limit vs. Operating Limit, Monitoring & Corrective Action): CCP 1B HTST Pasteurization (CL: >= 72°C for >= 15s | OL: 73.5°C for 16s; auto-divert via FDV); CCP 2B Poultry Blast Chilling (CL: 60°C to <= 4°C within <= 4 hrs | OL: <= 2°C in 3.5 hrs); CCP 3P Metal Detection (CL: Fe 1.5mm, Non-Fe 2.0mm, SS 2.5mm; hourly test wand at Leading/Middle/Trailing; quarantine back to last good check on failure).',
        'Principle 6 (Validation vs. Verification & Thermal D-Value Lethality): Validation proves scientifically beforehand that a control achieves target log reduction (e.g., 6D reduction at D₆₅ = 1.2 min requires 6 × 1.2 = 7.2 minutes); Verification confirms ongoing adherence via calibration in crushed ice slurry (0.0°C) and boiling water (100.0°C), audits, and lab testing.'
      ],
      criticalControlParameters: [
        {
          parameter: 'CCP 1B: HTST Milk Pasteurization & CCP 2B: Blast Chilling',
          standardLimit:
            'HTST CL: >= 72.0°C for >= 15s (OL: 73.5°C / 16s) | Blast Chilling CL: 60°C to <= 4°C within <= 4 hrs (OL: <= 2°C in 3.5 hrs)',
          correctiveProtocol:
            'Auto-divert under-pasteurized milk via Flow Diversion Valve (FDV) and verify FDV cut-out daily; hold any batch chilled > 4 hrs for spore-former pathogen testing or destruction.'
        },
        {
          parameter: 'CCP 3P: Final Pack Metal Detection & 2-Point Probe Calibration',
          standardLimit:
            'Metal Detector CL: Fe <= 1.5mm, Non-Fe <= 2.0mm, SS <= 2.5mm (tested hourly at geometric center) | Thermometer: 0.0°C ± 0.5°C (ice) & 100.0°C ± 0.5°C (boiling)',
          correctiveProtocol:
            'If hourly test wand fails to reject, stop line, lock reject bin, quarantine 100% of packs produced since last passed check, and re-screen after repair.'
        }
      ],
      practicalChecklist: [
        'Use the Interactive 5x5 Risk & CCP Simulator tab to test Likelihood × Severity scores and Codex Q1–Q4 Decision Tree outcomes.',
        'Verify that Operating Limits (OL) are set tighter than Critical Limits (CL) on all thermal and metal detection CCPs.',
        'Confirm two-point thermometer verification (0°C ice slurry and 100°C boiling water) against an ISO 17025 certified reference probe.'
      ]
    },
    {
      id: 'tr-haccp-level-4-managerial-m5',
      moduleNumber: 5,
      title: 'Module 5: Mandatory Documentation & Traceability Tiers',
      estimatedMinutes: 85,
      overview:
        '4-Tier Document Hierarchy (Tier 1 Policy, Tier 2 Core HACCP, Tier 3 PRP SOPs, Tier 4 Live Records), Good Documentation Practice (ALCOA+), Management of Change (MoC), Mass Balance Recall Drills (98–102% within 4 Hours), and Record Retention (Shelf Life + 1 Year).',
      internationalClauses: [
        'Codex CXC 1-1969 Principle 7 (Establish Documentation and Record Keeping)',
        'ISO 22000:2018 Clause 7.5 (Documented Information) & Clause 8.9.5 (Withdrawal/Recall Mass Balance)'
      ],
      keyPrinciples: [
        '4-Tier Document Hierarchy: Tier 1 (Signed CEO Food Safety Policy, Scope & Org Chart showing QA independence), Tier 2 (Core HACCP: Team credentials, PFDs, Zoning Maps, Hazard Worksheets, Decision Tree Logs, Master CCP Chart, Validation Dossiers), Tier 3 (PRP SOPs: SSOPs, Pest Map, Glass Policy, Allergen Matrix, Recall SOP), Tier 4 (Live Records: CCP Logs, NCR/CAPA registers, NIST Calibration Certificates, Mock Recall Reports).',
        'Mock Recall & Mass Balance Pass Criterion: Account for 98%–102% of total suspect ingredient/product mass (warehouse stock + shipped to customers + rework + documented line waste/QA samples) within 2 to 4 hours.',
        'Good Documentation Practice (GDP) & Record Retention: Retain CCP and batch records for full commercial shelf life + at least 1 additional year (e.g., 3-year canned tuna = minimum 4 years retention); never use white correction fluid—strike through errors with a single line, write the correct value alongside, and sign/date.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Mock Recall & Mass Balance Reconciliation Time',
          standardLimit:
            '98% to 102% total mass balance reconciled (Stock + Shipped + Rework + Waste/Samples) within <= 4 hours',
          correctiveProtocol:
            'Identify any untraced rework or shipping gap immediately, upgrade batch coding granularity, and repeat mock recall within 30 days.'
        },
        {
          parameter: 'Good Documentation Practice (GDP) & Document Version Control',
          standardLimit:
            'Controlled Document ID + Version + Issue Date + Auth Signature on all forms | Zero correction fluid (Tipp-Ex) | Retention >= Shelf Life + 1 Year',
          correctiveProtocol:
            'Withdraw obsolete forms from shop floor immediately; enforce single-line strike-through with operator initials and date on any manual log correction.'
        }
      ],
      practicalChecklist: [
        'Conduct a bi-annual forward and backward Mock Recall drill verifying 98%–102% mass balance within 4 hours.',
        'Inspect floor clipboards to ensure all CCP monitoring sheets carry the current controlled Document ID and Revision Number.',
        'Complete a formal Management of Change (MoC) dossier before introducing any new sanitation system, ingredient supplier, or processing line.'
      ]
    },
    {
      id: 'tr-haccp-level-4-managerial-m6',
      moduleNumber: 6,
      title: 'Module 6: Conducting a HACCP Audit (ISO 19011 Approach)',
      estimatedMinutes: 95,
      overview:
        'ISO 19011 Auditor Independence, Stage 1 Desktop Review, Stage 2 Floor Audit Triangle (Observation, Unscripted Operator Interview, Record Cross-Check), Detecting "Pencil Whipping / Dry Labbing", Vertical Traceability Audits, and Grading Critical/Major/Minor Non-Conformances & 5-Why CAPA.',
      internationalClauses: [
        'ISO 19011:2018 — Guidelines for Auditing Management Systems',
        'GFSI Benchmarking Requirements & ISO 22000:2018 Clause 9.2 (Internal Audit) & Clause 10.1 (Nonconformity and Corrective Action)'
      ],
      keyPrinciples: [
        'The ISO 19011 Audit Triangle & Impartiality: Auditors must be independent of the department audited (a Production Manager cannot audit their own lines). Triangulate every CCP via (1) Physical Observation of line challenge test, (2) Open, scenario-based Operator Interview ("Show me what you do if pasteurizer temp drops to 70.5°C"), and (3) Record Cross-Check for "Pencil Whipping" (identical numbers or pre-filled future timestamps).',
        'Vertical Traceability Audit: Select 1 finished batch code from dispatch and trace backward to raw supplier CoAs, that exact day’s pasteurizer chart, pre-op ATP swabs, and the NIST calibration status of the probe used.',
        'Grading Non-Conformances & Rejecting Weak CAPAs: Critical NC = direct food safety failure or pre-filled/falsified CCP log (immediate line stop & batch hold); Major NC = systemic breakdown such as an expired master reference calibration thermometer (7–14 days closure); Minor NC = isolated lapse with zero safety risk (30 days closure). Reject symptom-only CAPAs ("operator was scolded") and require systemic 5-Why engineering/procedural preventions.'
      ],
      criticalControlParameters: [
        {
          parameter: 'CCP Log Authenticity & Anti-Pencil-Whipping Audit',
          standardLimit:
            'Zero pre-filled future timestamps + verified alignment between paper/digital CCP logs and continuous data-logger charts',
          correctiveProtocol:
            'Raise an immediate Critical Non-Conformance if pre-filled logs are found, quarantine all affected production lots, and implement supervisor/automated interlocks.'
        },
        {
          parameter: 'Master Calibration Traceability & 5-Why CAPA Closure',
          standardLimit:
            '100% valid ISO 17025 master reference calibration certificates + systemic root-cause CAPA closure within 7–14 days for Major NCs',
          correctiveProtocol:
            'Grade expired master calibration references as a Major Non-Conformance, recalibrate all dependent plant probes, and reject any CAPA that merely blames operator vigilance.'
        }
      ],
      practicalChecklist: [
        'Verify internal audit schedule ensures no manager or supervisor audits their own area of responsibility.',
        'Perform a full Vertical Audit on 1 dispatched batch covering supplier CoA, CCP chart, ATP pre-op log, and probe calibration certificate.',
        'Audit open and closed CAPAs to confirm 5-Why root cause analysis addresses systemic/engineering controls rather than "retraining/scolding operator" alone.'
      ]
    }
  ],
  coreExamPool: HACCP_L4_45_EXAM_QUESTIONS.map((q) => ({
    q: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation
  }))
};

export const HACCP_LEVEL_4_HUB_TRAINING: HubTraining = {
  id: HACCP_LEVEL_4_MANAGERIAL_COURSE.id,
  category: 'International Certification',
  title: HACCP_LEVEL_4_MANAGERIAL_COURSE.title,
  standardCode: HACCP_LEVEL_4_MANAGERIAL_COURSE.code,
  subType: HACCP_LEVEL_4_MANAGERIAL_COURSE.levelBadge,
  description: HACCP_LEVEL_4_MANAGERIAL_COURSE.description,
  duration: HACCP_LEVEL_4_MANAGERIAL_COURSE.duration,
  fees: 'Free Study, Simulators & 45-MCQ Exam · Rs. 1,000 Certificate Download',
  enrollLink: `https://wa.me/923008429104?text=${encodeURIComponent(
    `Assalam-o-Alaikum, I want to verify/unlock my certificate for ${HACCP_LEVEL_4_MANAGERIAL_COURSE.title} (${HACCP_LEVEL_4_MANAGERIAL_COURSE.code}).`
  )}`,
  isActive: true
};
