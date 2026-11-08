import { HubTraining } from '../types/hub';

export interface CourseStudyModule {
  id: string;
  moduleNumber: number;
  title: string;
  estimatedMinutes: number;
  overview: string;
  internationalClauses: string[];
  keyPrinciples: string[];
  criticalControlParameters: Array<{
    parameter: string;
    standardLimit: string;
    correctiveProtocol: string;
  }>;
  practicalChecklist: string[];
}

export interface CourseExamMCQ {
  id: string;
  questionNumber: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface InternationalTrainingCourse {
  id: string;
  code: string;
  title: string;
  levelBadge: string;
  accreditationStandard: string;
  duration: string;
  certificateFeeRs: number;
  passPercentage: number;
  distinctionPercentage: number;
  totalExamQuestions: number;
  description: string;
  modules: CourseStudyModule[];
  coreExamPool: Array<{
    q: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  }>;
}

interface CompactSeedCourse {
  id: string;
  code: string;
  title: string;
  levelBadge: string;
  accreditationStandard: string;
  duration: string;
  description: string;
  modules: Array<{
    title: string;
    clause: string;
    overview: string;
    principles: [string, string, string];
    ccpParam: string;
    ccpLimit: string;
    ccpFix: string;
    checks: [string, string];
  }>;
  questions: Array<{
    q: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  }>;
}

const COMPACT_COURSES: CompactSeedCourse[] = [
  // 1. Food Safety Certified
  {
    id: 'tr-int-food-safety-certified',
    code: 'FSC-101',
    title: 'Food Safety Certified',
    levelBadge: 'International Foundation & Practitioner',
    accreditationStandard: 'Codex Alimentarius CXC 1-1969 & WHO Five Keys to Safer Food',
    duration: '14 Guided Hours · 5 Modules',
    description:
      'Step-by-step international Food Safety Certification from Basics to Expert: Module 1 (Food Safety Basics & FAT TOM), Module 2 (Prerequisite Programs: Personal Hygiene & Sanitation PRPs), Module 3 (Initial Process Flow & Cold-Chain Setup), Module 4 (Hazard Analysis, 5x5 Risk Matrix, Codex Decision Tree & Critical Limits), and Module 5 (How to Audit Food Safety Systems & International Food Safety Law).',
    modules: [
      {
        title: 'Module 1: Food Safety Basics, Terminology & Microbiology (FAT TOM)',
        clause: 'Codex CXC 1-1969 Rev. 2022 Section 2–3 & WHO Five Keys to Safer Food',
        overview: 'Starting from zero: Understanding what Food Safety is, foodborne infection vs. intoxication, biological/chemical/physical/allergenic hazards, and the 6 FAT TOM bacterial growth factors (Food, Acidity, Time, Temperature, Oxygen, Moisture).',
        principles: [
          'Pathogenic bacteria divide every 20 minutes by binary fission under optimal FAT TOM conditions (37°C, water activity a_w > 0.95, neutral pH 6.5–7.5).',
          'Spore-forming bacteria (Clostridium botulinum, Clostridium perfringens, Bacillus cereus) survive normal cooking and germinate if cooled slowly in the 5°C–60°C Temperature Danger Zone.',
          'Water activity (a_w) below 0.85 and pH below 4.5 block the growth of vegetative pathogenic bacteria.'
        ],
        ccpParam: 'Temperature Danger Zone (TDZ) & Core Thermal Kill',
        ccpLimit: 'TDZ: 5°C to 60°C (Max 2h exposure) | Core Cooking: >= 75°C for 30 seconds (7-log Salmonella reduction)',
        ccpFix: 'Continue cooking until core reaches >= 75°C; chill to <= 4°C within 2 hours or discard if held > 4 hours in TDZ.',
        checks: [
          'Calibrate digital probe thermometer in crushed ice slurry (0.0°C ± 0.5°C) before daily checks.',
          'Store raw meats/poultry on bottom chiller racks strictly below ready-to-eat (RTE) foods.'
        ]
      },
      {
        title: 'Module 2: Prerequisite Programs (PRPs) — Personal Hygiene, Cleaning & Pest Foundations',
        clause: 'Codex CXC 1-1969 Section 6–7 & ISO/TS 22002-1 Prerequisite Programs',
        overview: 'Building the foundational Prerequisite Programs (PRPs) required before advanced hazard control: personal hygiene, 48-hour medical exclusion, 6-stage cleaning & disinfection chemistry, and pest proofing.',
        principles: [
          'Food handlers are primary vectors for Norovirus, Hepatitis A, Salmonella Typhi, and Staphylococcus aureus; a 48-hour symptom-free exclusion period is mandatory after vomiting or diarrhea.',
          '6-Stage Sanitation PRP: (1) Pre-scrape, (2) Detergent wash (removes grease/biofilm), (3) Rinse, (4) Disinfect (Chlorine 100–200 ppm or QAC 200–400 ppm), (5) Final rinse, (6) Air dry.',
          'Minor cuts on hands must be covered with waterproof, brightly colored metal-detectable blue plasters under disposable nitrile gloves.'
        ],
        ccpParam: 'Handwashing Temp, Medical Clearance & Sanitizer Concentration',
        ccpLimit: 'Handwash water 38°C–43°C (20–30s wash) | Chlorine 100–200 ppm / QAC 200–400 ppm | ATP Swab < 30 RLU',
        ccpFix: 'Exclude symptomatic staff immediately; re-clean and re-sanitize any surface exceeding 30 RLU.',
        checks: [
          'Verify knee/sensor-operated handwash stations are stocked with bactericidal soap and single-use paper towels.',
          'Maintain a signed Master Cleaning Schedule (MCS) and locked COSHH chemical cabinet.'
        ]
      },
      {
        title: 'Module 3: Preliminary Process Steps — Receiving, Storage, Thawing, Cooking & Two-Stage Cooling Flow',
        clause: 'FDA Food Code 3-501.14 & Codex Linear Process Flow Steps',
        overview: 'Mapping the complete operational food flow from Approved Supplier Receiving to Cold Storage, Safe Thawing, Core Cooking, Two-Stage Blast Chilling, and Hot/Cold Holding.',
        principles: [
          'Linear Flow Steps: (1) Approved Supplier Receiving -> (2) Chilled/Frozen/Dry Storage -> (3) Controlled Thawing -> (4) Color-Coded Prep -> (5) Core Cooking -> (6) Two-Stage Blast Cooling -> (7) Reheating/Service.',
          'Two-Stage Cooling Standard: Cool cooked food from 60°C to 20°C within 2 hours, and from 20°C to <= 4°C within 4 additional hours (total <= 6 hours).',
          'Safe thawing is restricted to refrigeration at <= 4°C, running potable water <= 21°C (< 2 hours), or microwave followed immediately by cooking.'
        ],
        ccpParam: 'Hot Holding (>= 63°C) & Two-Stage Blast Chilling Curve',
        ccpLimit: 'Hot Hold >= 63°C continuously | Blast Chill 60°C->20°C (<= 2h) & 20°C->4°C (<= 4h) | Reheat >= 75°C once',
        ccpFix: 'Divide deep batches into shallow gastronorm pans (< 5 cm depth) for rapid blast chilling; discard if time limit breached.',
        checks: [
          'Record chiller (<= 4°C) and freezer (<= -18°C) temperatures at least 3 times daily.',
          'Apply FEFO (First Expired, First Out) date labels to all prepared and opened items.'
        ]
      },
      {
        title: 'Module 4: Hazard Analysis, 5x5 Risk Assessment Matrix, Decision Tree & Allergen Controls',
        clause: 'Codex Hazard Analysis Methodology & CXC 80-2020 Allergen Management',
        overview: 'How to conduct a step-by-step Hazard Analysis, calculate Risk Scores using the 5x5 Likelihood x Severity Matrix, apply the Codex 4-Question CCP Decision Tree, and control the Big-9 Allergens.',
        principles: [
          '5x5 Risk Assessment Matrix: Multiply Likelihood (1=Rare to 5=Almost Certain) x Severity (1=Negligible to 5=Catastrophic/Fatal). Any score >= 9 (or Severity = 5) is a Significant Hazard requiring CCP/OPRP control.',
          'Codex 4-Question Decision Tree determines whether a step is a true CCP (e.g., Cooking is a CCP because Q2=Yes; Raw Receiving is NOT a CCP for Salmonella if subsequent Cooking Q4=Yes eliminates it).',
          'The Big-9 Allergens (Gluten, Crustaceans, Eggs, Fish, Peanuts, Soy, Milk, Tree Nuts, Sesame) are heat-stable proteins requiring dedicated Purple allergen kits and ELISA swabbing (< 5 ppm).'
        ],
        ccpParam: '5x5 Risk Assessment Score & Allergen Changeover Verification',
        ccpLimit: 'Significant Hazard (L x S >= 9) evaluated via Codex Decision Tree | Allergen swab < 5 ppm & 100% label check',
        ccpFix: 'Quarantine any mislabeled allergen batch immediately and re-wash/re-swab equipment before non-allergen runs.',
        checks: [
          'Document Likelihood x Severity risk scores and Decision Tree Q1–Q4 answers for every process step.',
          'Use color-coded boards: Red (Raw Meat), Blue (Raw Fish), Yellow (Cooked Meat), Green (Salad), White (Bakery/Dairy), Brown (Veg), Purple (Allergen-Free).'
        ]
      },
      {
        title: 'Module 5: How to Audit Food Safety Systems, Corrective Actions & Food Safety Law',
        clause: 'ISO 19011 Auditing Guidelines, UK Food Safety Act 1990, FDA FSMA & Pure Food Laws',
        overview: 'Mastering internal/external food safety auditing techniques, grading Minor/Major/Critical non-conformities, 4-hour traceability recall tests, and understanding National & International Food Safety Law (Legal Due Diligence).',
        principles: [
          'How to Audit a Food Safety System: Combine (1) Vertical Trace Audits (tracing 1 batch from raw receipt through CCP logs to dispatch), (2) Shop-Floor Observation & Operator Interviews, and (3) Calibration & Record Cross-Checks.',
          'Food Safety Law & Legal Due Diligence: Under the UK Food Safety Act 1990 (Sec 21), EU Reg 852/2004, FDA FSMA 21 CFR 117, GCC Municipality Codes, and Pakistan Pure Food Authorities (PFA/PSQCA), food businesses must prove "All Reasonable Precautions" (documented system) AND "All Due Diligence" (active verification).',
          'Falsifying or pre-filling temperature logs ("dry-labbing") invalidates Legal Due Diligence and triggers criminal prosecution or Emergency Prohibition closure.'
        ],
        ccpParam: 'Internal Audit Verification & 4-Hour Traceability Recall Law',
        ccpLimit: '100% authentic real-time logs + <= 4-hour forward/backward mass-balance traceability + zero unresolved Major NCs',
        ccpFix: 'Quarantine suspect lots back to last good check, complete 5-Why Root Cause CAPA within 28 days, and notify regulators if unsafe food left control.',
        checks: [
          'Conduct monthly internal food safety audits using the ISO 19011 evidence triangle (Observation, Interview, Records).',
          'Perform an annual 4-hour Mock Recall exercise reconciling 99.5%–100.5% mass balance.'
        ]
      }
    ],
    questions: [
      {
        q: 'What is the internationally recognized Temperature Danger Zone (TDZ) within which foodborne pathogenic bacteria multiply most rapidly?',
        options: ['0°C to 35°C', '5°C to 60°C', '10°C to 75°C', '-18°C to 4°C'],
        correctIndex: 1,
        explanation: 'Pathogenic bacteria multiply rapidly between 5°C and 60°C, with optimal growth near 37°C.'
      },
      {
        q: 'Under the two-stage cooling standard, cooked TCS food must be cooled from 60°C to 20°C within what maximum timeframe?',
        options: ['1 hour', '2 hours', '4 hours', '6 hours'],
        correctIndex: 1,
        explanation: 'Stage 1 requires cooling from 60°C to 20°C within 2 hours, followed by 20°C to <= 4°C within 4 more hours.'
      },
      {
        q: 'Which minimum internal core temperature and holding time is required for safe cooking of poultry and stuffed meats?',
        options: ['63°C for 15 seconds', '68°C for 10 seconds', '75°C for 30 seconds', '55°C for 2 minutes'],
        correctIndex: 2,
        explanation: 'Cooking to >= 75°C for 30 seconds achieves a 7-log reduction of Salmonella in poultry.'
      },
      {
        q: 'What is the mandatory minimum symptom-free period before a food handler who suffered acute diarrhea or vomiting can return to food handling?',
        options: ['12 hours', '24 hours', '48 hours', '7 days'],
        correctIndex: 2,
        explanation: 'International food hygiene guidelines mandate a 48-hour symptom-free period after cessation of vomiting/diarrhea.'
      },
      {
        q: 'Why must a detergent wash always precede chemical disinfection on a greasy food contact surface?',
        options: [
          'Detergents sterilize bacterial spores automatically',
          'Organic soil and fat inactivate chemical disinfectants and shield bacteria from contact',
          'Disinfectants only work at freezing temperatures',
          'Detergents lower the pH to 1.0'
        ],
        correctIndex: 1,
        explanation: 'Organic matter and fats neutralize sanitizers and form a physical barrier protecting microbes.'
      }
    ]
  },

  // 2. HACCP Certified
  {
    id: 'tr-int-haccp-certified',
    code: 'HCP-102',
    title: 'HACCP Certified',
    levelBadge: 'Codex 12 Steps & 7 Principles',
    accreditationStandard: 'Codex Alimentarius CXC 1-1969 (2022 Revision) HACCP System',
    duration: '16 Guided Hours · 5 Modules',
    description:
      'Complete, step-by-step international HACCP Certification: Module 1 (HACCP Basics, History & Definitions), Module 2 (Prerequisite Programs - PRPs), Module 3 (The First 5 Preliminary Steps of the 12-Step Codex Sequence), Module 4 (Principles 1–4: How to Do Hazard Analysis, 5x5 Risk Assessment Matrix, Codex CCP Decision Tree, Critical Limits & Monitoring), and Module 5 (Principles 5–7: Corrective Actions, Validation, How to Audit a HACCP System & HACCP Food Law).',
    modules: [
      {
        title: 'Module 1: HACCP Basics, NASA/Pillsbury History, Core Definitions & Why Traditional End-Product Testing Fails',
        clause: 'Codex Alimentarius CXC 1-1969 (2022 Rev.) Introduction & Section 1',
        overview: 'Understanding the origins of HACCP (1960s NASA Apollo space program, Pillsbury Company & US Army Natick Labs), why statistical end-product sampling fails to guarantee safety, and mastering core HACCP definitions (Hazard, Risk, Severity, PRP, OPRP, CCP, Critical Limit, Validation, Verification).',
        principles: [
          'Why End-Product Testing Fails: Testing 10 packs out of a 10,000-pack batch with a 1% Salmonella defect rate gives a 90.4% probability of missing the contamination completely! HACCP replaces reactive lot testing with preventive in-process control.',
          'Core Definitions: A "Hazard" is a biological, chemical, physical, or allergenic agent in food with the potential to cause an adverse health effect; "Risk" is a function of the probability (Likelihood) of an adverse health effect and the magnitude (Severity) of that effect.',
          'The Codex 12-Step HACCP Logic Sequence consists of 5 Preliminary Steps (Steps 1–5) followed by the 7 Core HACCP Principles (Steps 6–12).'
        ],
        ccpParam: 'Preventive In-Process Control vs. End-Product Lot Sampling',
        ccpLimit: '100% of production lines covered by a preventive Codex 12-Step HACCP Plan rather than reliance on end-product testing alone',
        ccpFix: 'Establish real-time in-process CCPs (thermal, pH, metal/X-ray) so safety is built into every unit produced.',
        checks: [
          'Define the exact Legal & Regulatory Scope of the HACCP study before starting.',
          'Ensure all team members understand the difference between a Quality defect and a Food Safety Hazard.'
        ]
      },
      {
        title: 'Module 2: Prerequisite Programs (PRPs) — The Foundation Supporting the HACCP System',
        clause: 'Codex CXC 1-1969 Chapter 1 & ISO/TS 22002-1 Clauses 4–18 PRPs',
        overview: 'Why HACCP cannot function without rock-solid Prerequisite Programs (PRPs): Good Manufacturing Practices (GMP), Good Hygiene Practices (GHP), Sanitation Standard Operating Procedures (SSOPs), Pest Control (IPM), Allergen Control, Supplier Approval, Potable Water/Air Utilities, and Calibration.',
        principles: [
          'PRPs control general plant-wide environmental and operational conditions; if PRPs are weak, the HACCP plan becomes overloaded with dozens of unmanageable CCPs.',
          'Core PRPs include: (1) Hygienic Facility Layout & Linear Flow, (2) Potable Water (0.5–2.0 ppm Cl2) & 0.01 µm Air Filtration, (3) 6-Stage SSOP Cleaning & ATP (< 30 RLU), (4) Integrated Pest Management (100% non-toxic indoor traps), (5) Personal Hygiene & 48h Medical Exclusion, and (6) Approved Supplier List (ASL).',
          'Difference between PRP, OPRP, and CCP: PRPs are site-wide foundations; OPRPs control medium-high hazards using Action Criteria; CCPs are absolute process steps with Critical Limits where loss of control causes unsafe food.'
        ],
        ccpParam: 'Pre-HACCP PRP Verification Audit Score & Water/Surface Hygiene',
        ccpLimit: '100% of core ISO/TS 22002 PRPs verified operational prior to CCP selection | ATP < 30 RLU | Potable water 0 CFU Coliforms',
        ccpFix: 'Rectify any structural, sanitation, or pest proofing PRP gap before finalizing the Hazard Analysis.',
        checks: [
          'Verify documented SOPs and monitoring records exist for all 12 core Prerequisite Programs.',
          'Confirm ISO 17025 calibration traceability for all thermometers, pH meters, pressure gauges, and scales.'
        ]
      },
      {
        title: 'Module 3: The 12 Steps of HACCP (Part 1) — The First 5 Preliminary Steps (Steps 1 to 5)',
        clause: 'Codex CXC 1-1969 Steps 1, 2, 3, 4 & 5 (ISO 22000 Clause 8.5.1)',
        overview: 'Executing the initial 5 Preliminary Steps in detail: Step 1 (Assemble Multidisciplinary HACCP Team), Step 2 (Describe the Product & Intrinsic Hurdles), Step 3 (Identify Intended Use & Vulnerable Consumers), Step 4 (Construct the Process Flow Diagram), and Step 5 (On-Site Verification of the Flow Diagram Across All Shifts).',
        principles: [
          'Step 1 (HACCP Team): Must be multidisciplinary—including QA/Food Safety Leader, Production Manager, Maintenance Engineer, Sanitation Lead, and Procurement—so biological, chemical, and mechanical hazards are never missed.',
          'Step 2 & Step 3 (Product Description & Intended Use): Document composition, intrinsic safety hurdles (pH, water activity a_w, salt/preservatives), packaging (MAP/vacuum), storage shelf-life, and whether vulnerable YOPI groups (Young, Old, Pregnant, Immunocompromised) consume the product.',
          'Step 4 & Step 5 (Construct & Verify Process Flow Diagram On-Site): Map every step from raw material receipt, utilities (water, steam, air), allergen additions, and rework/waste loops to dispatch—then walk the factory floor across Day and Night shifts to sign off 100% physical accuracy.'
        ],
        ccpParam: 'Step 5 On-Site Flow Diagram Verification & Step 2 Intrinsic Specs',
        ccpLimit: '100% physical match of Flow Diagram with actual plant piping, rework loops & night-shift practices signed & dated by HACCP Team',
        ccpFix: 'Halt Hazard Analysis and update the Process Flow Diagram immediately if any bypass pipe, rework loop, or manual step was omitted.',
        checks: [
          'Verify HACCP Team Leader holds formal Level 3/Level 4 HACCP qualification.',
          'Walk the process line in reverse and forward directions during both production and CIP washdown to verify Step 5.'
        ]
      },
      {
        title: 'Module 4: The 7 Principles (Principles 1–4) — Hazard Analysis, 5x5 Risk Matrix, Codex Decision Tree, Critical Limits & Monitoring',
        clause: 'Codex Steps 6–9 (Principles 1, 2, 3 & 4) & Codex CCP Decision Tree',
        overview: 'Mastering the heart of HACCP: Principle 1 (How to Conduct a Proper Hazard Analysis & 5x5 Risk Assessment Matrix), Principle 2 (Applying the Codex 4-Question CCP Decision Tree), Principle 3 (Establishing Validated Critical Limits vs. Operational Limits), and Principle 4 (Designing Continuous & Batch CCP Monitoring Systems).',
        principles: [
          'Principle 1 — How to Do Proper Hazard Analysis & 5x5 Risk Matrix: At every flow step, identify exact Biological (e.g., Salmonella, L. monocytogenes, C. botulinum spores), Chemical (mycotoxins, cleaning residues, pesticides), Physical (glass, metal > 1.5mm, hard plastic), and Allergenic hazards; state the cause (introduction, survival, or growth); and score Risk = Likelihood (1–5) x Severity (1–5). Any score >= 9 (or Severity = 5) is a Significant Hazard.',
          'Principle 2 — Codex 4-Question CCP Decision Tree: Pass every Significant Hazard through Q1 (Do preventive control measures exist?), Q2 (Is the step specifically designed to eliminate/reduce the hazard to an acceptable level? -> If YES = CCP!), Q3 (Could contamination occur/increase to unacceptable levels?), and Q4 (Will a subsequent downstream step eliminate/reduce the hazard? -> If YES = Not a CCP; if NO = CCP!).',
          'Principle 3 & Principle 4 — Critical Limits & Monitoring: Set objective measurable Critical Limits (e.g., >= 72°C for 15s, pH <= 4.5, Fe 1.5mm / Non-Fe 2.0mm / SS 2.5mm) alongside tighter Operational Limits (e.g., >= 74°C) and define What, How, Frequency, and Who monitors the CCP in real time.'
        ],
        ccpParam: '5x5 Risk Matrix (L x S >= 9), Codex Q1–Q4 Decision Tree & CCP Limits',
        ccpLimit: '100% of Significant Hazards evaluated through Q1–Q4 Decision Tree | Pasteurization >= 72°C/15s | Cooking >= 75°C/30s | Metal Fe 1.5mm',
        ccpFix: 'Automatic flow-diversion valve or pneumatic reject arm isolates product immediately if a Critical Limit is breached.',
        checks: [
          'Document written scientific justification for every Likelihood x Severity score and every Q1–Q4 Decision Tree answer.',
          'Ensure CCP monitoring logs specify both the Critical Limit and the stricter Operational Limit.'
        ]
      },
      {
        title: 'Module 5: The 7 Principles (Principles 5–7) — Corrective Actions, Validation, How to Audit a HACCP System & HACCP Law',
        clause: 'Codex Steps 10–12 (Principles 5, 6 & 7), ISO 19011 Auditing & International HACCP Law',
        overview: 'Completing the 7 Principles and mastering governance: Principle 5 (Quarantine & Root-Cause Corrective Actions), Principle 6 (Scientific Validation vs. Verification & How to Audit a HACCP System), Principle 7 (Tamper-Proof Recordkeeping), and International/National Law on HACCP.',
        principles: [
          'Principle 5 (Corrective Actions): Whenever a CCP breaches its Critical Limit, operators must (1) Regain process control immediately, (2) Quarantine 100% of product manufactured back to the last passed CCP check, (3) Perform a 5-Why Root Cause Analysis, and (4) Dispose of or re-process held stock only under QA Director sign-off.',
          'Principle 6 & How to Audit a HACCP System: Upfront Validation proves scientifically BEFORE production that the critical limit kills the target pathogen; ongoing Verification & HACCP Auditing uses Vertical Lot Traceability, SCADA vs. paper log reconciliation, unannounced shop-floor observation, and third-party microbial testing to prove the HACCP system works daily.',
          'Principle 7 & What is the Law About HACCP: Retained CCP records (Shelf-Life + 12 months) are legal documents. Mandatory HACCP Law is enforced globally under EU Regulation (EC) No 852/2004 (Article 5), US FDA FSMA (21 CFR Part 117 / 120 / 123), UK Food Safety & Hygiene Regulations, GCC/UAE/Saudi SFDA Food Law, and Pakistan Pure Food Authorities (PFA/KPFA/SFA) & PSQCA.'
        ],
        ccpParam: '100% Quarantine Back to Last Good Check, Annual Re-Validation & Legal Compliance',
        ccpLimit: '100% stock held back to last passed check | Full HACCP review every 12 months | Zero falsified ("dry-labbed") legal records',
        ccpFix: 'Convene the HACCP Team immediately to re-validate the plan whenever a recipe, equipment line, packaging material, or food law changes.',
        checks: [
          'Conduct a full Vertical HACCP Audit tracing one CCP deviation batch from raw intake to final disposition.',
          'Verify all CCP records use single-line strike-through with initials (zero correction fluid/whitener) for Legal Due Diligence.'
        ]
      }
    ],
    questions: [
      {
        q: 'How many Preliminary Steps and how many Core Principles make up the complete Codex Alimentarius 12-Step HACCP methodology?',
        options: ['4 Steps and 8 Principles', '5 Preliminary Steps and 7 Principles', '6 Steps and 6 Principles', '3 Steps and 9 Principles'],
        correctIndex: 1,
        explanation: 'The Codex 12-step sequence consists of 5 Preliminary Steps (Steps 1–5) followed by the 7 HACCP Principles (Steps 6–12).'
      },
      {
        q: 'In the Codex CCP Decision Tree, if a step is NOT designed to eliminate a hazard (Q2 = No), contamination CAN occur (Q3 = Yes), and a SUBSEQUENT step WILL eliminate the hazard (Q4 = Yes), is the current step a CCP?',
        options: ['Yes, always', 'No, because the subsequent step will control the hazard (the downstream step becomes the CCP)', 'Both steps are CCPs', 'Stop production'],
        correctIndex: 1,
        explanation: 'When Q4 = Yes (a subsequent step eliminates or reduces the hazard to an acceptable level), the current step is NOT a CCP.'
      },
      {
        q: 'What is the fundamental difference between a Critical Limit and an Operational Limit at a CCP?',
        options: [
          'They are identical',
          'An Operational Limit is a stricter internal target set inside the Critical Limit to allow adjustment before a safety breach occurs',
          'A Critical Limit is optional',
          'Operational Limits apply only to offices'
        ],
        correctIndex: 1,
        explanation: 'Operational limits provide a safety buffer so operators can adjust the process before crossing the Critical Limit.'
      },
      {
        q: 'If an hourly metal detector CCP check fails at 11:00 AM after passing at 10:00 AM, which batch of finished product must be quarantined?',
        options: [
          'Only the single pack tested at 11:00 AM',
          'All product produced between 10:00 AM (the last good check) and 11:00 AM',
          'Only products produced after 11:00 AM',
          'No quarantine is needed'
        ],
        correctIndex: 1,
        explanation: 'Principle 5 requires quarantining and re-evaluating 100% of product manufactured since the last documented compliant CCP check.'
      },
      {
        q: 'Which activity is an example of HACCP Validation rather than Verification?',
        options: [
          'Supervisor signing the daily pasteurizer temperature chart',
          'Conducting scientific heat-penetration and microbial lethality trials before launching a new retort sterilization cycle',
          'Checking refrigerator thermometers every morning',
          'Reviewing customer complaint trends'
        ],
        correctIndex: 1,
        explanation: 'Validation proves scientifically upfront that the control measure achieves the required log reduction; daily checks and audits are Verification.'
      }
    ]
  },

  // 3. FSSC 22000 awareness
  {
    id: 'tr-int-fssc-22000-awareness',
    code: 'FSSC-103',
    title: 'FSSC 22000 awareness',
    levelBadge: 'GFSI Benchmarked Scheme v6',
    accreditationStandard: 'FSSC 22000 Version 6 + ISO 22000:2018 + ISO/TS 22002',
    duration: '15 Guided Hours · 5 Modules',
    description:
      'In-depth awareness of the GFSI-benchmarked FSSC 22000 Version 6 Food Safety Management System: ISO 22000:2018 Dual PDCA Cycles, Sector-Specific PRPs (ISO/TS 22002), and FSSC v6 Additional Requirements including VACCP, TACCP, Allergen Management, and Food Safety Culture.',
    modules: [
      {
        title: 'FSSC 22000 Version 6 Architecture & The Three-Pillar GFSI Model',
        clause: 'FSSC 22000 Scheme v6.0 Part 2 & ISO 22000:2018 Clauses 4–10',
        overview: 'Integrating ISO 22000:2018, ISO/TS 22002 Sector PRPs, and FSSC Additional Requirements (Clauses 2.5.1–2.5.18).',
        principles: [
          'FSSC 22000 stands on 3 pillars: ISO 22000:2018 Management System, Sector-Specific PRPs (ISO/TS 22002), and FSSC Additional Requirements.',
          'ISO 22000 operates Dual PDCA Cycles: Organizational Planning/Management PDCA and Operational HACCP PDCA (Clause 8).',
          'At least one surveillance audit every 3-year certification cycle is conducted unannounced.'
        ],
        ccpParam: 'Unannounced Audit Readiness & Serious Event Notification',
        ccpLimit: '1 unannounced audit per 3-year cycle | Notify Certification Body within 3 working days of any recall/crisis',
        ccpFix: 'Maintain continuous shift audit readiness and escalate recalls to the CB within 3 working days.',
        checks: [
          'Verify correct FSSC Food Chain Subcategory (C1–C4, I, K).',
          'Maintain Internal & External Issues and Interested Parties Risk Register (Clauses 4.1 & 4.2).'
        ]
      },
      {
        title: 'ISO/TS 22002-1 Prerequisite Programs (PRPs), Utilities & Zoning',
        clause: 'ISO/TS 22002-1 Clauses 4–18 & FSSC v6 Clause 2.5.12 EMP',
        overview: 'Controlling site layout, hygienic zoning, food-contact compressed air, culinary steam, potable water, and pathogen swabbing.',
        principles: [
          'Compressed air contacting food or primary packaging must be filtered to 0.01 micron, oil-free (Class 0), and microbiologically tested.',
          'Culinary steam contacting food must be generated from potable water using only food-grade boiler chemicals.',
          'Clause 2.5.12 mandates a risk-based Environmental Monitoring Program (EMP) across Zones 1–4 for Listeria and Salmonella.'
        ],
        ccpParam: 'Food-Contact Air Filtration & Potable Water Chlorination',
        ccpLimit: 'Compressed Air: 0.01 µm sterile oil-free | Potable Water: 0.5–2.0 ppm free residual chlorine',
        ccpFix: 'Replace air filter cartridges on preventive schedule and shock-chlorinate water tank if coliforms appear.',
        checks: [
          'Verify backflow preventers on all water hoses and CIP connections.',
          'Inspect against the Glass & Brittle Plastic Register monthly.'
        ]
      },
      {
        title: 'OPRPs vs. CCPs in ISO 22000:2018 Clause 8.5 Hazard Control Plan',
        clause: 'ISO 22000:2018 Clauses 8.5.2, 8.5.4 & 8.9.4',
        overview: 'Differentiating PRPs, Operational PRPs (with Action Criteria), and CCPs (with Critical Limits) inside the Hazard Control Plan.',
        principles: [
          'CCPs use measurable Critical Limits where loss of control creates Potentially Unsafe Product (Clause 8.9.4).',
          'OPRPs use measurable or observable Action Criteria where failure requires root cause correction and safety impact evaluation.',
          'Both CCPs and OPRPs require upfront validation (Clause 8.5.3), monitoring, correction, and verification.'
        ],
        ccpParam: 'Hazard Control Plan (CCP Critical Limits vs. OPRP Action Criteria)',
        ccpLimit: '100% quarantine hold under Clause 8.9.4 for any batch affected by a CCP breach',
        ccpFix: 'Release held product only if independent scientific/lab testing proves hazard is within acceptable limits.',
        checks: [
          'Document clear Action Criteria for every OPRP and Critical Limits for every CCP.',
          'Validate all OPRP and CCP control measures prior to implementation.'
        ]
      },
      {
        title: 'Food Defense (TACCP Clause 2.5.3) & Food Fraud Mitigation (VACCP Clause 2.5.4)',
        clause: 'FSSC 22000 v6 Clauses 2.5.3 (Food Defense) & 2.5.4 (Food Fraud)',
        overview: 'Conducting Threat Assessments (intentional sabotage) and Vulnerability Assessments (economically motivated adulteration).',
        principles: [
          'HACCP covers accidental hazards; TACCP covers malicious/ideological sabotage; VACCP covers Economically Motivated Adulteration (EMA).',
          'Food Fraud includes Dilution, Substitution (melamine in milk, Sudan dye in spices), Concealment, Counterfeiting, and Mislabeling.',
          'Food Defense requires perimeter security, locked water silos/tanks, visitor escorting, and tamper-evident tanker seals.'
        ],
        ccpParam: 'Bulk Tanker Tamper-Evident Seals & Authenticity COA',
        ccpLimit: '100% seal serial match on incoming tankers + annual TACCP/VACCP vulnerability review',
        ccpFix: 'Reject any delivery with broken/mismatched tamper seals and perform authenticity lab testing on high-fraud ingredients.',
        checks: [
          'Complete documented VACCP & TACCP assessments covering all raw materials and packaging.',
          'Test the site Food Defense plan and Mock Recall annually.'
        ]
      },
      {
        title: 'FSSC v6 New Clauses: Quality Control, Equipment Management & Food Waste',
        clause: 'FSSC 22000 v6 Clauses 2.5.8, 2.5.9, 2.5.15 & 2.5.16',
        overview: 'Implementing Food Safety Culture (2.5.8), Quality Control & Line Clearance (2.5.9), Hygienic Equipment Commissioning (2.5.15), and Food Loss reduction (2.5.16).',
        principles: [
          'Clause 2.5.8 requires a documented Food Safety & Quality Culture plan with measurable KPIs and employee feedback.',
          'Clause 2.5.9 mandates systematic Quality Control including legal net-weight control and packaging startup/reel-change line clearance.',
          'Clause 2.5.15 requires hygienic design specifications and risk-based change management before installing new equipment.'
        ],
        ccpParam: 'Packaging Line-Clearance (2.5.9) & Equipment Commissioning (2.5.15)',
        ccpLimit: '100% removal of prior packaging + barcode/allergen check at startup & reel change | Signed commissioning sign-off',
        ccpFix: 'Stop packing line immediately if wrong label/film is found; modify dead-legs before releasing new machinery.',
        checks: [
          'Conduct annual Food Safety & Quality Culture employee survey.',
          'Track and reduce organic food loss and waste under Clause 2.5.16.'
        ]
      }
    ],
    questions: [
      {
        q: 'Which three components combine to form the complete GFSI-benchmarked FSSC 22000 Certification Scheme?',
        options: [
          'ISO 9001, ISO 14001, and ISO 45001',
          'ISO 22000:2018, Sector-Specific PRPs (ISO/TS 22002), and FSSC 22000 Additional Requirements',
          'Codex HACCP, GMP, and local municipal licensing only',
          'BRCGS, IFS, and SQF'
        ],
        correctIndex: 1,
        explanation: 'FSSC 22000 integrates ISO 22000:2018, ISO/TS 22002 sector PRPs, and FSSC Additional Requirements.'
      },
      {
        q: 'In FSSC 22000, what is the primary distinction between TACCP (Food Defense) and VACCP (Food Fraud)?',
        options: [
          'TACCP targets economically motivated adulteration while VACCP targets accidental cross-contamination',
          'TACCP prevents intentional malicious sabotage/ideological contamination, whereas VACCP prevents economically motivated adulteration (EMA)',
          'Both cover only natural microbial growth',
          'VACCP applies only to retail restaurants'
        ],
        correctIndex: 1,
        explanation: 'TACCP addresses malicious/ideological sabotage (Food Defense), whereas VACCP addresses financially motivated fraud/adulteration.'
      },
      {
        q: 'According to ISO 22000:2018, what measurable or observable benchmark is established for an Operational Prerequisite Program (OPRP)?',
        options: ['Critical Limit', 'Action Criterion', 'Financial Budget', 'Marketing Target'],
        correctIndex: 1,
        explanation: 'ISO 22000:2018 assigns Critical Limits to CCPs and Action Criteria to OPRPs.'
      },
      {
        q: 'Under FSSC 22000 Version 6, how frequently must at least one unannounced audit take place during a 3-year certification cycle?',
        options: ['Never', 'At least once every 3-year certification cycle during surveillance audits', 'Every month', 'Once every 10 years'],
        correctIndex: 1,
        explanation: 'GFSI and FSSC 22000 mandate at least one unannounced surveillance audit within every 3-year certification cycle.'
      },
      {
        q: 'Which new requirement was formally introduced in FSSC 22000 Version 6 under Clause 2.5.15?',
        options: [
          'Elimination of internal audits',
          'Equipment Management — requiring hygienic design specifications and risk-based change management for new equipment',
          'Removal of allergen labeling',
          'Replacing HACCP with financial auditing'
        ],
        correctIndex: 1,
        explanation: 'Clause 2.5.15 in FSSC 22000 v6 mandates hygienic design specifications and commissioning verification for new/modified equipment.'
      }
    ]
  },

  // 4. ISO 9001 QMS Awareness
  {
    id: 'tr-int-iso-9001-qms',
    code: 'QMS-104',
    title: 'ISO 9001 QMS Awareness',
    levelBadge: 'ISO 9001:2015 Quality Systems',
    accreditationStandard: 'ISO 9001:2015 Quality Management Systems & ISO 19011',
    duration: '12 Guided Hours · 5 Modules',
    description:
      'Complete awareness of ISO 9001:2015 Quality Management Systems, the 7 Quality Management Principles, Annex SL High-Level Structure (Clauses 4–10), Risk-Based Thinking, Process Approach, and Continual Improvement.',
    modules: [
      {
        title: 'The 7 Quality Management Principles, Process Approach & PDCA',
        clause: 'ISO 9000:2015 Clause 2.3 & ISO 9001:2015 Clause 0.3',
        overview: 'Mastering the 7 QMPs (Customer Focus, Leadership, Engagement of People, Process Approach, Improvement, Evidence-Based Decisions, Relationship Management).',
        principles: [
          'The 7 Quality Management Principles form the foundation of ISO 9001:2015.',
          'The Process Approach manages interrelated processes using Turtle Diagrams (Inputs, Outputs, Resources, Competence, Methods, KPIs).',
          'Risk-Based Thinking embeds proactive risk and opportunity management across every process.'
        ],
        ccpParam: 'Process Mapping & Measurable KPIs',
        ccpLimit: '100% of value-chain and support processes mapped with owners and target KPIs',
        ccpFix: 'Trigger PDCA improvement action whenever process KPI falls below target.',
        checks: [
          'Map the organization-wide Process Interaction Matrix.',
          'Align Quality Policy and Objectives with strategic direction.'
        ]
      },
      {
        title: 'Clauses 4, 5 & 6: Context of Organization, Leadership & Risk Planning',
        clause: 'ISO 9001:2015 Clauses 4, 5 & 6',
        overview: 'Determining internal/external issues, requirements of interested parties, QMS Scope justification, and Risk & Opportunity planning.',
        principles: [
          'Clause 4.1 & 4.2 identify internal/external issues (SWOT/PESTLE) and interested party requirements.',
          'Clause 4.3 allows excluding a requirement (such as 8.3 Design) ONLY with documented justification proving conformity is unaffected.',
          'Clause 6.1 requires planning actions to address Risks and Opportunities and evaluating their effectiveness.'
        ],
        ccpParam: 'SMART Quality Objectives & Risk Register Review',
        ccpLimit: 'Quantifiable SMART objectives + quarterly Risk & Opportunity Register evaluation',
        ccpFix: 'Implement additional risk controls whenever residual risk score exceeds acceptable threshold.',
        checks: [
          'Communicate the Quality Policy across all operational levels.',
          'Document any justified non-applicable clauses in the QMS Scope.'
        ]
      },
      {
        title: 'Clause 7: Metrology Calibration, Competence & Documented Information',
        clause: 'ISO 9001:2015 Clauses 7.1.5, 7.2 & 7.5',
        overview: 'Traceable calibration of measuring equipment (ISO 17025), evaluating training effectiveness, and controlling documented information.',
        principles: [
          'Measuring instruments must be calibrated at specified intervals against standards traceable to international/national references.',
          'If an instrument is found out-of-calibration, the organization MUST assess and record the validity of previous measurement results.',
          '"Maintain documented information" means procedures/SOPs; "Retain documented information" means objective evidence records.'
        ],
        ccpParam: 'Out-of-Calibration Impact Assessment & Document Control',
        ccpLimit: '100% retrospective batch assessment when a gauge fails calibration | Current approved SOP revision at point of use',
        ccpFix: 'Quarantine and re-inspect all batches measured since the last valid calibration check.',
        checks: [
          'Maintain Master Calibration Schedule with traceable certificates.',
          'Remove obsolete SOP versions from production areas.'
        ]
      },
      {
        title: 'Clause 8: Operational Control, Design Verification/Validation & Supplier Management',
        clause: 'ISO 9001:2015 Clauses 8.1 to 8.7',
        overview: 'Controlling customer contract review, Design Verification vs. Validation (8.3), Approved Suppliers (8.4), and Nonconforming Outputs (8.7).',
        principles: [
          'Design Verification confirms design outputs meet design input requirements; Design Validation confirms the product works in its intended real-world use.',
          'Clause 8.4 requires documented criteria for selection, evaluation, and annual re-evaluation of external suppliers.',
          'Clause 8.7 requires segregating nonconforming outputs to prevent unintended use or delivery.'
        ],
        ccpParam: 'Positive Product Release (8.6) & Nonconforming Output Segregation (8.7)',
        ccpLimit: 'Documented conformity sign-off prior to dispatch | Written customer concession required for any spec deviation',
        ccpFix: 'Segregate nonconforming lots in a locked Quarantine area and initiate CAPA.',
        checks: [
          'Maintain Approved Supplier List (ASL) with annual vendor scorecards.',
          'Ensure batch traceability and inspection status identification at all stages.'
        ]
      },
      {
        title: 'Clauses 9 & 10: Internal Audits, Management Review & Corrective Action (CAPA)',
        clause: 'ISO 9001:2015 Clauses 9.2, 9.3, 10.2 & ISO 19011',
        overview: 'Conducting impartial internal audits, chairing Management Reviews, and executing Root Cause Corrective Actions.',
        principles: [
          'Internal auditors must be selected to ensure objectivity and impartiality—auditors shall NOT audit their own work (Clause 9.2.2).',
          'Management Review (Clause 9.3) evaluates audit findings, customer satisfaction, process KPIs, supplier performance, and risks.',
          'Corrective Action (Clause 10.2) eliminates the root cause of a nonconformity to prevent recurrence.'
        ],
        ccpParam: 'Audit Impartiality & CAPA Effectiveness Verification',
        ccpLimit: 'Zero self-auditing + documented root cause and effectiveness verification within agreed deadline',
        ccpFix: 'Re-open CAPA if follow-up verification reveals recurrence of the root cause.',
        checks: [
          'Execute risk-based Annual Internal Audit Schedule.',
          'Retain Management Review minutes with action owners and resource decisions.'
        ]
      }
    ],
    questions: [
      {
        q: 'How many Quality Management Principles (QMPs) form the foundation of ISO 9001:2015?',
        options: ['5 Principles', '7 Principles', '10 Principles', '14 Principles'],
        correctIndex: 1,
        explanation: 'ISO 9001:2015 is built upon 7 Quality Management Principles.'
      },
      {
        q: 'In ISO 9001:2015 terminology, what does the phrase "retain documented information" specifically require an organization to keep?',
        options: [
          'Marketing brochures only',
          'Records that provide objective evidence of results achieved and activities performed',
          'Unwritten verbal instructions',
          'Competitor price lists'
        ],
        correctIndex: 1,
        explanation: '"Maintain documented information" refers to procedures/manuals, whereas "Retain documented information" refers to records.'
      },
      {
        q: 'Under ISO 9001:2015 Clause 7.1.5, what action is mandatory when a measuring instrument is found to be out of calibration?',
        options: [
          'Discard the instrument without recording anything',
          'Assess and record the validity of previous measurement results obtained when the instrument was out of calibration, and take action on any affected product',
          'Ignore previous batches',
          'Wait until next year’s audit'
        ],
        correctIndex: 1,
        explanation: 'Clause 7.1.5.2 requires assessing and recording the validity of previous measurement results whenever measuring equipment is found unfit.'
      },
      {
        q: 'In ISO 9001:2015 Clause 8.3 (Design and Development), what is the difference between Design Verification and Design Validation?',
        options: [
          'They mean the exact same thing',
          'Verification ensures design outputs meet design input requirements; Validation ensures the resulting product is capable of meeting requirements for the specified intended use',
          'Validation happens before inputs are written',
          'Verification is performed only by customers'
        ],
        correctIndex: 1,
        explanation: 'Verification checks Design Outputs against Design Inputs; Validation checks real-world fitness for intended application/use.'
      },
      {
        q: 'Which core rule governs the selection of internal auditors under ISO 9001:2015 Clause 9.2?',
        options: [
          'Only the CEO may conduct internal audits',
          'Auditors must be selected and audits conducted to ensure objectivity and impartiality (auditors shall not audit their own work)',
          'Department heads must always audit their own department',
          'Internal audits are optional'
        ],
        correctIndex: 1,
        explanation: 'Clause 9.2.2(c) mandates selecting auditors and conducting audits to ensure objectivity and impartiality.'
      }
    ]
  },

  // 5. GMP
  {
    id: 'tr-int-gmp-certified',
    code: 'GMP-105',
    title: 'GMP',
    levelBadge: 'Good Manufacturing Practices',
    accreditationStandard: '21 CFR Part 117 Current Good Manufacturing Practice & Codex GMP',
    duration: '12 Guided Hours · 5 Modules',
    description:
      'International Good Manufacturing Practices (GMP) covering hygienic plant design, positive air pressure zoning, utilities, sanitary equipment fabrication (EHEDG/3-A), foreign body prevention, and CIP/COP sanitation.',
    modules: [
      {
        title: 'Hygienic Facility Design, Linear Product Flow & Positive Air Zoning',
        clause: 'FDA 21 CFR Part 117 Subpart B & ISO/TS 22002-1 Clauses 4–5',
        overview: 'Establishing unidirectional linear product flow, coved wall-floor junctions, sloped drainage, and positive air pressure in High-Care zones.',
        principles: [
          'Unidirectional linear flow (Raw -> Prep -> Thermal Process -> High-Care Packing -> Dispatch) prevents cross-contamination.',
          'High-Care RTE rooms must maintain positive air pressure (+5 to +15 Pa) filtered through HEPA/F9 filtration.',
          'Wall-to-floor junctions must be coved (>= 25 mm radius) and floors sloped (1:50 to 1:100) so drainage flows from High-Care toward Low-Risk.'
        ],
        ccpParam: 'High-Care Differential Air Pressure & Drainage Flow',
        ccpLimit: '+5 Pa to +15 Pa positive pressure | Drainage flowing strictly from High-Care to Low-Risk',
        ccpFix: 'Service AHU filters, keep airlock doors closed, and eliminate any standing floor water.',
        checks: [
          'Seal all pipe and cable penetrations through walls to block pest/dust ingress.',
          'Fit shatterproof sleeves/diffusers on all overhead production lighting.'
        ]
      },
      {
        title: 'Sanitary Equipment Design (EHEDG / 3-A Standards) & NSF H1 Lubricants',
        clause: 'EHEDG Doc. 8 Hygienic Equipment Design & FDA 21 CFR 178.3570',
        overview: 'Using AISI 316L stainless steel (Ra <= 0.8 µm), eliminating piping dead-legs (L/D <= 1.5), and enforcing NSF H1 food-grade lubricants.',
        principles: [
          'Food contact surfaces must be corrosion-resistant AISI 304/316L stainless steel finished to surface roughness Ra <= 0.8 µm.',
          'Piping dead-legs must not exceed 1.5 times the pipe diameter (L/D <= 1.5) so CIP turbulence flushes the entire pocket.',
          'Bearings and chains above or near open food zones must use NSF H1 food-grade lubricants (incidental contact <= 10 ppm).'
        ],
        ccpParam: 'Piping Dead-Leg Ratio & Lubricant Grade',
        ccpLimit: 'Dead-leg L/D <= 1.5 | Surface roughness Ra <= 0.8 µm | 100% NSF H1 lubricant above food zones',
        ccpFix: 'Cut back dead-leg T-junctions and segregate NSF H1 lubricants from H2 industrial oils.',
        checks: [
          'Ban wood, glass, bare mild steel, and string/cardboard temporary repairs in production.',
          'Verify Food-Contact Migration Certificates for all conveyor belts and gaskets.'
        ]
      },
      {
        title: 'Foreign Body Prevention: Glass/Brittle Plastic, Magnets, Sieves & Blades',
        clause: 'Codex CXC 1-1969 Physical Hazard Control & GFSI Foreign Body Standards',
        overview: 'Operating inline rare-earth magnets, vibratory sifters, metal-detectable stationery, and glass breakage quarantine protocols.',
        principles: [
          'Maintain a Master Glass & Brittle Plastic Register for unavoidable sight-glasses and indicator gauges.',
          'Glass Breakage Protocol: Halt line immediately, isolate >= 3-meter radius, discard exposed food, inspect footwear/PPE, and obtain QA sign-off.',
          'Inline neodymium magnets (>= 10,000 Gauss) and sieves/strainers must be inspected every shift for integrity.'
        ],
        ccpParam: 'Sieve Mesh Integrity & Inline Magnet Strength',
        ccpLimit: 'Zero torn wires/pinholes on shift sieve check | >= 10,000 Gauss rare-earth magnet pull',
        ccpFix: 'Quarantine all product passed since the last intact sieve check and re-screen.',
        checks: [
          'Enforce one-piece metal-detectable blue pens and detectable cable ties.',
          'Prohibit staples, paperclips, thumbtacks, and snap-off utility blades in processing areas.'
        ]
      },
      {
        title: 'Clean-In-Place (CIP) & Clean-Out-Of-Place (COP) Sinner’s Circle',
        clause: 'EHEDG Doc. 50 Hygienic Design and Safe Use of CIP Systems',
        overview: 'Balancing Time, Action (turbulent flow >= 1.5 m/s), Chemical Concentration, and Temperature across 5-stage CIP cycles.',
        principles: [
          'Sinner’s Circle requires balancing Time, Action (pipeline flow velocity >= 1.5 m/s for Reynolds > 30,000), Concentration, and Temperature.',
          'Initial CIP pre-rinse water must be < 55°C so milk/meat proteins do not denature and bake onto stainless steel.',
          'Standard CIP: Pre-rinse (< 55°C) -> Caustic Wash (1.5–2% NaOH at 75°C) -> Rinse -> Acid Wash (0.8–1.2% HNO3 at 60°C) -> Final Rinse.'
        ],
        ccpParam: 'CIP Pipeline Flow Velocity & Chemical Titration',
        ccpLimit: 'Flow velocity >= 1.5 m/s | Caustic 1.5–2.0% NaOH at 75°C | Neutral pH on final rinse return',
        ccpFix: 'Increase CIP pump flow, clear blocked rotary spray balls, and verify chemical strength by titration.',
        checks: [
          'Perform manual laboratory titration of CIP caustic and acid tanks weekly.',
          'Inspect tank rotary spray balls for clogged nozzles monthly.'
        ]
      },
      {
        title: 'Good Warehousing Practices (GWP), Rework Control & 4-Hour Traceability',
        clause: 'ISO/TS 22002-1 Clauses 14, 15 & 16',
        overview: 'Maintaining the 50 cm warehouse perimeter inspection strip, "like-into-like" allergen rework rules, and mass-balance mock recalls.',
        principles: [
          'Maintain an unobstructed 45–50 cm (18-inch) white inspection strip between stored pallets and warehouse perimeter walls.',
          'Rework must be labeled with batch number, date, and allergen profile, and only incorporated under strict "like-into-like" allergen rules.',
          'Mock Recall exercises must reconcile 99.5%–100.5% mass balance forward and backward within <= 4 hours.'
        ],
        ccpParam: 'Warehouse Perimeter Clearance & Mock Recall Speed',
        ccpLimit: '>= 45–50 cm wall clearance | 99.5%–100.5% mass balance trace within <= 4 hours',
        ccpFix: 'Reposition pallets off walls and audit batch sheet recording gaps if trace takes > 4 hours.',
        checks: [
          'Reseal partly used ingredient bags and attach internal secondary lot/expiry tags.',
          'Segregate non-conforming stock inside a locked Quarantine cage.'
        ]
      }
    ],
    questions: [
      {
        q: 'In an automated Clean-In-Place (CIP) system for pipelines, what minimum fluid flow velocity is required to achieve turbulent scrubbing action (Reynolds > 30,000)?',
        options: ['0.2 meters/second', '0.5 meters/second', '1.5 meters/second', '10.0 meters/second'],
        correctIndex: 2,
        explanation: 'A minimum velocity of 1.5 m/s creates turbulent flow across the internal pipe wall to shear off biofilms and soil.'
      },
      {
        q: 'Why must the initial CIP pre-rinse water temperature be kept below 55°C before the hot caustic wash in dairy or protein plants?',
        options: [
          'Hot water above 60°C denatures and coagulates whey proteins, baking them onto the stainless steel surface',
          'Cold water evaporates too fast',
          'Stainless steel melts at 60°C',
          'To save boiler fuel only'
        ],
        correctIndex: 0,
        explanation: 'Pre-rinsing with water > 60°C denatures milk/meat proteins, causing them to adhere stubbornly to the steel surface.'
      },
      {
        q: 'According to EHEDG and 3-A sanitary equipment standards, what is the maximum allowable dead-leg length-to-diameter ratio (L/D) in food process piping?',
        options: ['L/D <= 10.0', 'L/D <= 5.0', 'L/D <= 1.5', 'L/D = 25.0'],
        correctIndex: 2,
        explanation: 'Dead legs must not exceed 1.5 times the pipe diameter (L/D <= 1.5) so CIP turbulence can flush the pocket completely.'
      },
      {
        q: 'Which NSF lubricant classification is mandatory for greases and oils used on equipment points where incidental food contact could occur?',
        options: ['NSF H1', 'NSF H2', 'NSF H3 Soluble Oil', 'SAE 40 Automotive Oil'],
        correctIndex: 0,
        explanation: 'NSF H1 lubricants are formulated from FDA 21 CFR 178.3570 approved ingredients safe for incidental food contact (up to 10 ppm).'
      },
      {
        q: 'In Good Warehousing Practices (GWP), why is a 45–50 cm (18-inch) white painted strip maintained clear along all internal warehouse perimeter walls?',
        options: [
          'For decorative aesthetics',
          'To allow unobstructed pest control bait/trap inspection, cleaning, and airflow around pallets',
          'To park diesel forklifts',
          'To store toxic chemicals'
        ],
        correctIndex: 1,
        explanation: 'The 45–50 cm perimeter inspection strip enables visual rodent/insect inspection, trap servicing, and wall-floor cleaning.'
      }
    ]
  },

  // 6. Pest Management
  {
    id: 'tr-int-pest-management',
    code: 'IPM-106',
    title: 'Pest Management',
    levelBadge: 'Integrated Pest Management (IPM)',
    accreditationStandard: 'EN 16636 Pest Management & GFSI / BRCGS / AIB International IPM Standards',
    duration: '12 Guided Hours · 5 Modules',
    description:
      'International Integrated Pest Management (IPM) certification for food manufacturing, warehousing, and hospitality: pest biology, exclusion proofing, multi-ring bait/trap defense, UV EFK placement, and pesticide safety.',
    modules: [
      {
        title: 'Integrated Pest Management (IPM) Hierarchy & Target Pest Biology',
        clause: 'EN 16636:2015 & ISO/TS 22002-1 Clause 12 Pest Control',
        overview: 'Prioritizing Exclusion, Sanitation, and Mechanical Control over chemicals, and understanding rodent, cockroach, fly, and SPI biology.',
        principles: [
          'IPM 4-Step Hierarchy: (1) Exclusion & Proofing, (2) Sanitation & Habitat Deprivation, (3) Mechanical Monitoring/Trapping, (4) Targeted Approved Pesticides.',
          'House Mouse (Mus musculus) can enter through a 6 mm (1/4 inch) gap; Rats can enter through a 12 mm (1/2 inch) gap.',
          'Stored-Product Insects (Red Flour Beetle Tribolium, Indian Meal Moth) infest grain silos and flour sifter decks.'
        ],
        ccpParam: 'Door Under-Clearance & Mesh Proofing Aperture',
        ccpLimit: 'Door bristle gap <= 3 mm (zero daylight visible) | Ventilation mesh aperture <= 2 mm',
        ccpFix: 'Fit heavy-duty rubber/brush sweeps on all external doors and seal wall penetrations with mortar/steel mesh.',
        checks: [
          'Conduct quarterly comprehensive IPM Proofing & Risk Surveys.',
          'Eliminate standing water and vegetation within 1 meter of building exterior walls.'
        ]
      },
      {
        title: 'Concentric 3-Ring Defense System & Indoor Non-Toxic Trap Mandate',
        clause: 'BRCGS Food Safety Issue 9 Clause 4.14 & AIB IPM Standards',
        overview: 'Configuring Ring 1 (Property Fence), Ring 2 (Building Exterior), and Ring 3 (Internal Non-Toxic Mechanical Traps).',
        principles: [
          'CRITICAL GFSI RULE: Toxic rodenticide baits are STRICTLY PROHIBITED inside food production, packing, or open storage areas.',
          'Ring 1 and Ring 2 (Exterior) use locked, tamper-resistant, ground-anchored bait stations with wax blocks secured on metal rods.',
          'Ring 3 (Interior Perimeter, every 6–12m and flanking roller doors) uses ONLY non-toxic mechanical multi-catch traps or snap traps.'
        ],
        ccpParam: 'Internal Rodent Trap Type & External Station Security',
        ccpLimit: '100% Non-Toxic Mechanical Traps indoors | Exterior stations bolted, numbered, and rod-secured',
        ccpFix: 'Immediately remove any toxic bait found indoors and replace missing stations within 24 hours.',
        checks: [
          'Date-sign the internal service sticker inside every trap/station lid during each inspection.',
          'Verify the signed Site Bait Map matches 100% of physical device locations.'
        ]
      },
      {
        title: 'Flying Insect Control: UV Electric Fly Killers (EFKs) & Catch Trending',
        clause: 'BRCGS Issue 9 Clause 4.14.8 Electric Fly Killers',
        overview: 'Mounting sticky glue-board EFKs (>= 3m from open food), replacing shatterproof UV-A tubes annually, and trending insect counts.',
        principles: [
          'High-voltage electrocutor ("zapper") EFKs must NEVER be used in food areas because exploding insects scatter fragments up to 2 meters; use Sticky Glue-Board units.',
          'Mount EFKs at 1.8–2.2m height, perpendicular to doors (not visible from outdoors), and >= 3.0 meters away from open food/packaging.',
          'UV-A tubes lose 40–50% of their 365 nm UV output after 12 months even while glowing blue—replace annually before summer.'
        ],
        ccpParam: 'EFK Distance from Open Food & UV-A Tube Replacement',
        ccpLimit: '>= 3.0 meters clearance from open food + shatterproof FEP-sleeved UV-A tubes replaced every 12 months',
        ccpFix: 'Relocate EFK away from food conveyors and deep-clean floor drains if Drain Flies (Psychodidae) spike.',
        checks: [
          'Log monthly insect catch counts by species (Houseflies, Drain flies, Fruit flies, SPIs).',
          'Verify 100% of EFK tubes are shatterproof FEP-coated.'
        ]
      },
      {
        title: 'Stored-Product Insects (SPIs), Pheromone Traps & Fumigation Safety',
        clause: 'Codex Code of Practice for Prevention of Insect Infestation in Cereals',
        overview: 'Using sex/aggregation pheromone traps, inspecting flour sifter tailings every shift, and controlling Phosphine (PH3) fumigation.',
        principles: [
          'Pheromone delta and dome traps detect low-level populations of Indian Meal Moth, Ephestia moth, and Tribolium flour beetles.',
          'Flour sifter tailings must be inspected every shift for live/dead beetles, weevils, larvae, or webbing.',
          'Phosphine (PH3) silo fumigation requires licensed operators and digital gas-clearance verification (< 0.1 ppm TLV) before re-entry.'
        ],
        ccpParam: 'Shift Flour Sifter Tailings Check & Post-Fumigation Clearance',
        ccpLimit: 'Zero live/dead SPIs in sifter tailings | Residual Phosphine gas < 0.1 ppm prior to re-entry',
        ccpFix: 'Quarantine infested flour lot and heat-treat/clean sifter unit immediately.',
        checks: [
          'Replace pheromone lures every 6–8 weeks per manufacturer specification.',
          'Vacuum overhead flour dust ledges and cable trays weekly.'
        ]
      },
      {
        title: 'IPM Master Documentation Binder, Pesticide SDS Approval & Trend Reviews',
        clause: 'BRCGS Issue 9 Clauses 4.14.1–4.14.12 & FSSC 22000 IPM Docs',
        overview: 'Auditing contractor licenses, technician competency certificates, approved food-grade pesticide list, SDS sheets, and quarterly trends.',
        principles: [
          'The IPM Master Binder must contain: Contract Scope, Contractor License, Technician Certificates, Signed Bait Map, Approved Pesticide List + SDS, and Quarterly Trend Graphs.',
          'Only pesticides officially registered and approved for food processing facilities may be brought on-site.',
          'All proofing defects raised by the pest technician must be closed out within 24–48 hours.'
        ],
        ccpParam: 'Approved Pesticide SDS & Proofing Action Close-Out',
        ccpLimit: '100% food-approved pesticides with current SDS | Critical proofing findings closed within <= 48 hours',
        ccpFix: 'Prohibit unapproved agricultural sprays and escalate overdue proofing repairs to Plant Management.',
        checks: [
          'Require QA escort and countersignature on every pest technician visit report.',
          'Present quarterly pest catch trend analysis during Management Review.'
        ]
      }
    ],
    questions: [
      {
        q: 'Under international GFSI (BRCGS / FSSC 22000) Integrated Pest Management standards, why are toxic rodenticide baits prohibited inside open food production and storage areas?',
        options: [
          'They are too expensive for indoor use',
          'Rodents or insects can carry toxic bait fragments onto food contact surfaces or into open ingredients, causing chemical contamination',
          'Rodents only feed outdoors',
          'Toxic baits attract birds'
        ],
        correctIndex: 1,
        explanation: 'Toxic baits inside food areas pose a severe chemical food safety hazard via translocation or spillage; only non-toxic mechanical traps are permitted indoors.'
      },
      {
        q: 'What is the minimum horizontal distance an Electric Fly Killer (EFK) unit must be positioned away from open food preparation tables or unwrapped packaging?',
        options: ['0.5 meters', '1.0 meter', '3.0 meters', '15.0 meters'],
        correctIndex: 2,
        explanation: 'EFKs must be mounted at least 3 meters away from open food/packaging, use shatterproof UV-A tubes, and avoid facing exterior doors directly.'
      },
      {
        q: 'Through how small of an opening can an adult House Mouse (Mus musculus) squeeze to enter a food processing facility?',
        options: ['6 mm (1/4 inch — diameter of a pencil)', '25 mm (1 inch)', '50 mm (2 inches)', '100 mm'],
        correctIndex: 0,
        explanation: 'Young and adult house mice can compress their skull/ribcage through a 6 mm (1/4 inch) gap.'
      },
      {
        q: 'Why must UV-A fluorescent tubes in Electric Fly Killers be replaced annually even when they still emit visible blue light?',
        options: [
          'To change the color of the room',
          'The phosphor coating degrades over 12 months, reducing invisible 365 nm UV-A output by 40–50% and rendering the trap ineffective',
          'Because glass expires after 365 days',
          'To reduce electricity voltage'
        ],
        correctIndex: 1,
        explanation: 'Insects are attracted to 350–370 nm UV-A wavelengths, which decay by nearly 50% after ~8,000 hours (1 year) of operation.'
      },
      {
        q: 'A sudden surge of Drain Flies (Moth Flies / Psychodidae) on an internal EFK glue board most strongly indicates which root cause inside the plant?',
        options: [
          'Broken roof tiles',
          'Accumulated organic sludge and gelatinous biofilm inside stagnant floor drains or grease traps',
          'Contaminated wheat flour delivery',
          'Excessive positive air pressure'
        ],
        correctIndex: 1,
        explanation: 'Drain flies (Psychodidae) breed exclusively in gelatinous organic biofilm lining floor drains, sumps, and effluent traps.'
      }
    ]
  },

  // 7. BRCG Food Safety issue-09 awareness
  {
    id: 'tr-int-brcgs-issue-09',
    code: 'BRC-107',
    title: 'BRCG Food Safety issue-09 awareness',
    levelBadge: 'BRCGS Global Standard Issue 9',
    accreditationStandard: 'BRCGS Global Standard for Food Safety Issue 9 (Sections 1–9)',
    duration: '16 Guided Hours · 5 Modules',
    description:
      'Complete awareness of the BRCGS Global Standard for Food Safety Issue 9 across all 9 Sections, the 12 Fundamental Clauses, Color-Coded Risk Zones (High-Risk, High-Care, Ambient High-Care), Audit Grading (AA+ to D), and Product Authenticity.',
    modules: [
      {
        title: 'BRCGS Issue 9 Structure, The 12 Fundamental Clauses & Senior Management',
        clause: 'BRCGS Issue 9 Section 1 & Part I (The 12 Fundamental Clauses)',
        overview: 'Understanding all 9 Sections, the 12 star-marked Fundamental Clauses, Food Safety Culture (1.1.2), and confidential reporting (1.1.6).',
        principles: [
          'BRCGS Issue 9 has 9 Sections: (1) Senior Management, (2) HACCP, (3) FSQMS, (4) Site Standards, (5) Product Control, (6) Process Control, (7) Personnel, (8) Production Risk Zones, (9) Traded Products.',
          'Failure to meet the Statement of Intent of any of the 12 Fundamental Clauses results in refusal or suspension of certification.',
          'Clause 1.1.2 requires a documented multi-year Food Safety & Quality Culture Plan focusing on behavioral changes.'
        ],
        ccpParam: 'Non-Conformity Close-Out & Whistleblower Channel',
        ccpLimit: 'Close all audit non-conformities within 28 calendar days | Confidential reporting hotline active (Clause 1.1.6)',
        ccpFix: 'Submit objective evidence and Root Cause Analysis to the Certification Body within 28 days.',
        checks: [
          'Audit all 12 BRCGS Fundamental Clauses quarterly.',
          'Ensure the most senior operational manager attends Opening and Closing audit meetings.'
        ]
      },
      {
        title: 'Sections 2 & 3: HACCP Plan, Internal Audit Spread, Traceability & 3-Day CB Recall Alert',
        clause: 'BRCGS Issue 9 Sections 2 & 3 (Clauses 3.4.1, 3.9, 3.11.4)',
        overview: 'Scheduling internal audits across >= 4 dates/year, 4-hour traceability tests, and notifying the Certification Body within 3 working days of any recall.',
        principles: [
          'Clause 3.4.1 mandates spreading scheduled internal audits across the year on at least 4 separate audit dates.',
          'Clause 3.9 requires forward and backward traceability (including primary packaging) to be completed within <= 4 hours.',
          'Clause 3.11.4 MANDATORY RULE: Notify the Certification Body within 3 working days of any product recall or regulatory food safety enforcement notice.'
        ],
        ccpParam: 'Internal Audit Spread (3.4.1) & CB Recall Notification (3.11.4)',
        ccpLimit: '>= 4 internal audit dates/year | <= 4h traceability | <= 3 working days CB recall notification',
        ccpFix: 'Immediately notify the Certification Body within 3 working days if a recall occurs and submit RCA within 21 days.',
        checks: [
          'Include primary packaging and rework in the annual 4-hour traceability challenge.',
          'Verify all raw material suppliers via GFSI certification or documented audit/risk assessment.'
        ]
      },
      {
        title: 'Section 4 & Section 8: High-Risk, High-Care & Ambient High-Care Production Zones',
        clause: 'BRCGS Issue 9 Clause 4.3, Section 8 & Appendix 2 Zone Decision Tree',
        overview: 'Mapping High-Risk (full cook >= 70°C/2m), High-Care (1–2 log reduction), and Ambient High-Care zones, plus captive barrier footwear.',
        principles: [
          'High-Risk Zone: Chilled/frozen RTE foods that undergo a full cook step (>= 70°C for 2 mins) and are exposed prior to packing.',
          'High-Care Zone: Chilled/frozen RTE foods that undergo a partial pathogen reduction (1–2 log, e.g., washed salads) and are exposed prior to packing.',
          'Ambient High-Care Zone: Ambient RTE foods (chocolate, peanut butter, milk powder) prone to vegetative Salmonella survival.'
        ],
        ccpParam: 'High-Risk Physical Barrier Bench & Captive Footwear',
        ccpLimit: '100% sit-over barrier bench + captive footwear that never leaves High-Risk + outward-flowing drains',
        ccpFix: 'Audit barrier changing sequence daily and swab High-Risk floor/drains weekly for Listeria.',
        checks: [
          'Map all factory rooms using the BRCGS Appendix 2 Production Risk Zone Decision Tree.',
          'Strip outer cardboard cartons or sanitize via UV/sanitizer tunnel before items enter High-Care.'
        ]
      },
      {
        title: 'Sections 5 & 6: Product Authenticity (VACCP), Claim Mass Balance & Label Control',
        clause: 'BRCGS Issue 9 Clauses 5.4 & 6.2 Labelling and Pack Control (Fundamental)',
        overview: 'Preventing packaging/allergen mislabeling through formal line-clearance and conducting 6-monthly mass balance checks on claims.',
        principles: [
          'Clause 6.2 (Labelling and Pack Control) is a Fundamental Clause designed to eliminate undeclared allergen recalls.',
          'Formal documented line-clearance and barcode/allergen verification must occur at startup, product changeover, and every reel change.',
          'Clause 5.4.6 requires mass balance tests every 6 months for identity-preserved claims (Halal, Organic, Gluten-Free, Fairtrade).'
        ],
        ccpParam: 'Line Clearance (6.2) & Claim Mass Balance (5.4.6)',
        ccpLimit: '100% removal of previous packaging before startup | Mass balance reconciliation every 6 months',
        ccpFix: 'Halt packing line and quarantine all packs if wrong film/label or failed barcode scanner check occurs.',
        checks: [
          'Challenge-test inline optical barcode/vision scanners at startup and end of run.',
          'Retain signed master artwork approval sheets for every SKU.'
        ]
      },
      {
        title: 'BRCGS Issue 9 Audit Protocol, Non-Conformity Levels & Grading Matrix (AA+ to D)',
        clause: 'BRCGS Issue 9 Part III Audit Protocol & Grading Table',
        overview: 'Calculating BRCGS audit grades (AA, A, B, C, D) from Critical, Major, and Minor non-conformities, and the unannounced "+" suffix.',
        principles: [
          'Grade AA = 0 Critical, 0 Major, and <= 5 Minor non-conformities. Grade A = 0 Major and 6–10 Minor. Grade B = 0 Major (11–16 Minor) OR 1 Major (<= 10 Minor).',
          'Unannounced audits earn a "+" suffix (e.g., Grade AA+, Grade A+).',
          'Under Issue 9, sites on the announced program must still undergo at least 1 unannounced audit every 3 years.'
        ],
        ccpParam: 'Grade AA/AA+ Threshold & Unannounced Auditor Access',
        ccpLimit: '0 Critical, 0 Major, <= 5 Minor for Grade AA | Auditor on production floor within <= 30 mins of gate arrival',
        ccpFix: 'Brief gate security on immediate escort protocol for unannounced BRCGS auditors.',
        checks: [
          'Register maximum 5 non-audit block-out days per year with the Certification Body.',
          'Perform pre-audit mock inspections covering all 9 Sections.'
        ]
      }
    ],
    questions: [
      {
        q: 'In BRCGS Food Safety Issue 9, what Audit Grade is awarded to an announced site that receives Zero Critical, Zero Major, and 4 Minor Non-Conformities?',
        options: ['Grade B', 'Grade A', 'Grade AA', 'Grade AA+'],
        correctIndex: 2,
        explanation: '5 or fewer Minor non-conformities (with 0 Critical and 0 Major) earns Grade AA for an announced audit (or AA+ if unannounced).'
      },
      {
        q: 'Under BRCGS Issue 9 Clause 3.11.4, within how many working days must a certified site notify its Certification Body (CB) in the event of a product recall or regulatory food safety enforcement notice?',
        options: ['Within 3 working days', 'Within 30 calendar days', 'Within 6 months', 'At the next annual surveillance audit'],
        correctIndex: 0,
        explanation: 'Clause 3.11.4 requires notifying the Certification Body within 3 working days of any product recall, safety withdrawal, or regulatory enforcement notice.'
      },
      {
        q: 'According to BRCGS Issue 9 Clause 3.4.1, across how many minimum different audit dates per year must the internal audit program be spread?',
        options: [
          'All internal audits can be done on 1 single day',
          'At least 4 different audit dates spread throughout the year',
          'Once every 3 years',
          'Only when a customer visits'
        ],
        correctIndex: 1,
        explanation: 'Clause 3.4.1 mandates spreading scheduled internal audits throughout the year across a minimum of 4 different audit dates.'
      },
      {
        q: 'Which BRCGS Issue 9 Production Risk Zone applies to chilled ready-to-eat foods that have undergone a full pathogen-kill cook step (>= 70°C for 2 minutes) and are exposed prior to packaging?',
        options: ['Low-Risk Zone', 'Enclosed Product Area', 'High-Risk Zone', 'Non-Food Warehouse'],
        correctIndex: 2,
        explanation: 'Chilled RTE products receiving a full thermal cook step (>= 70°C for 2 min) that are open before packing require a High-Risk Zone.'
      },
      {
        q: 'Within how many calendar days must a currently certified site provide documentary evidence of corrective action to close out non-conformities raised during a BRCGS surveillance audit?',
        options: ['7 calendar days', '28 calendar days', '90 calendar days', '180 calendar days'],
        correctIndex: 1,
        explanation: 'Certified sites have 28 calendar days from the audit conclusion to close out non-conformities with root cause and preventive evidence.'
      }
    ]
  },

  // 8. Professional Chef Certificate
  {
    id: 'tr-int-professional-chef',
    code: 'PCC-108',
    title: 'Professional Chef Certificate',
    levelBadge: 'Culinary Arts & Kitchen Brigade Mastery',
    accreditationStandard: 'Escoffier Brigade System, Worldchefs Culinary Standards & HACCP Kitchen Safety',
    duration: '15 Guided Hours · 5 Modules',
    description:
      'International Professional Chef Certification covering the Classical & Modern Kitchen Brigade (Escoffier), Precision Knife Cuts, Mother Sauces & Stocks, Thermal Culinary Science (Sous-Vide, Maillard, Emulsions), Menu Costing, and Commercial Kitchen Hygiene.',
    modules: [
      {
        title: 'Kitchen Brigade Organization, Mise en Place & Classical Knife Cuts',
        clause: 'Worldchefs (WACS) Culinary Standards & Escoffier Brigade de Cuisine',
        overview: 'Mastering Brigade roles (Saucier, Garde Manger, Poissonnier, Rôtisseur, Entremetier) and precision French knife cuts.',
        principles: [
          'Brigade de Cuisine: Executive Chef, Sous Chef, Saucier (sauces/sauté), Garde Manger (cold larder/charcuterie), Poissonnier (fish), Rôtisseur (roasts), Entremetier (vegetables/soups), Pâtissier (pastry).',
          'Classical Knife Cuts: Brunoise (3x3x3 mm cube), Macédoine (5x5x5 mm cube), Julienne (3x3x50 mm matchstick), Batonnet (6x6x50 mm), Chiffonade (herb ribbons).',
          'A honing steel realigns the microscopic blade edge daily; a whetstone (1000/3000 grit at 15°–20°) grinds and sharpens a dull bevel.'
        ],
        ccpParam: 'Knife Cut Precision & Blade Sanitation',
        ccpLimit: 'Brunoise: 3x3x3 mm | Julienne: 3x3x50 mm | Sanitize knives between raw and RTE tasks',
        ccpFix: 'Wash and sanitize chef knives by hand immediately after use; never leave submerged in pot-wash sinks.',
        checks: [
          'Complete 100% station Mise en Place and tasting spoons 30 minutes before service.',
          'Place a damp cloth or silicone non-slip mat under every chopping board.'
        ]
      },
      {
        title: 'Classical Fond (Stocks), The 5 French Mother Sauces & Emulsions',
        clause: 'Le Guide Culinaire — Classical Sauce & Stock Foundations',
        overview: 'Preparing Fond Blanc, Fond Brun, Fish Fumet, Mirepoix (50:25:25), and the 5 Mother Sauces (Béchamel, Velouté, Espagnole, Hollandaise, Tomato).',
        principles: [
          'Standard Mirepoix ratio by weight is 50% Onion, 25% Carrot, and 25% Celery.',
          'Stocks must always start in COLD water so soluble albumin proteins rise slowly and coagulate at the surface for clean skimming (starting in boiling water clouds the stock).',
          'The 5 Mother Sauces: Béchamel (Milk + White Roux), Velouté (White Stock + Blonde Roux), Espagnole (Brown Stock + Brown Roux), Hollandaise (Butter + Egg Yolk at 55°C–62°C), and Sauce Tomate.'
        ],
        ccpParam: 'Hollandaise Emulsion Temp & Fish Fumet Simmer Time',
        ccpLimit: 'Hollandaise held at 55°C–62°C (using pasteurized yolks, max 2h) | Fish Fumet simmered 30–45 mins max',
        ccpFix: 'Whisk Hollandaise over gentle bain-marie (above 68°C scrambles egg yolks); strain fish fumet by 45 mins.',
        checks: [
          'Blast-chill stocks from 60°C to 20°C within 2h and to <= 4°C within 4h.',
          'Cook Roux thoroughly (White 3–5m, Blonde 6–8m, Brown 12–15m) to eliminate raw starch taste.'
        ]
      },
      {
        title: 'Thermal Culinary Science: Moist vs. Dry Heat, Maillard Reaction & Sous-Vide',
        clause: 'Modern Culinary Physics & Sous-Vide Pasteurization Standards',
        overview: 'Applying dry heat vs. moist collagen hydrolysis, Maillard browning (140°C–165°C), fryer oil TPM limits, and Sous-Vide water-bath cooking.',
        principles: [
          'Dry-Heat Methods (Searing, Roasting, Grilling, Deep-Frying at 175°C–190°C) suit tender cuts; Moist/Combination Methods (Braising, Stewing) hydrolyze tough collagen into gelatin at 70°C–85°C.',
          'The Maillard reaction occurs between amino acids and reducing sugars on dry food surfaces above 140°C.',
          'Sous-Vide vacuum-pouch cooking requires precision water baths (±0.1°C), core pasteurization verification, and rapid ice-bath chilling to <= 3°C.'
        ],
        ccpParam: 'Frying Oil Total Polar Materials (TPM) & Sous-Vide Chill',
        ccpLimit: 'Fryer Oil TPM <= 24% at 175°C–190°C | Sous-Vide chilled to <= 3°C within 2 hours',
        ccpFix: 'Discard frying oil when digital tester reaches 24% TPM; pat proteins dry before searing.',
        checks: [
          'Rest roasted/grilled meats for 10–20% of cooking duration before carving.',
          'Log vacuum seal integrity, water-bath temp, core temp, and chill curve for every Sous-Vide batch.'
        ]
      },
      {
        title: 'Butcher Yield Testing (AP vs. EP), Recipe Costing & Menu Engineering',
        clause: 'Professional Culinary Cost Control & Menu Engineering Matrix',
        overview: 'Calculating Yield %, True Edible Portion (EP) cost, Food Cost % (28–33%), and classifying dishes into Stars, Plowhorses, Puzzles, and Dogs.',
        principles: [
          'Yield % = (Edible Portion Weight [EP] / As-Purchased Weight [AP]) x 100.',
          'True EP Cost per kg = AP Price per kg / (Yield % / 100). (e.g., Rs. 2,000/kg at 80% yield = Rs. 2,500/kg true cost).',
          'Menu Engineering Matrix: Stars (High Profit, High Popularity), Plowhorses (Low Profit, High Popularity), Puzzles (High Profit, Low Popularity), Dogs (Low Profit, Low Popularity).'
        ],
        ccpParam: 'Target Kitchen Food Cost % & Portion Weight Tolerance',
        ccpLimit: 'Food Cost: 28%–33% of Net Food Sales | Portion weight within ± 2% on digital scale',
        ccpFix: 'Audit butcher trim yields, waste logs, and portion scoops whenever Food Cost % exceeds target.',
        checks: [
          'Perform Butcher Yield Tests on every new meat and fish supplier specification.',
          'Display laminated Standardized Recipe Cards with gram weights and plating photos at each station.'
        ]
      },
      {
        title: 'Commercial Kitchen Fire Safety (Class F/K), Hot Pass Expediting & Allergen Pass',
        clause: 'Commercial Kitchen Fire Safety (Class F/K) & Allergen Pass Protocol',
        overview: 'Extinguishing deep-fat fryer fires with Wet Chemical Class F/K extinguishers and executing zero-error allergen meal dispatch at the Pass.',
        principles: [
          'Deep-fat fryer oil fires (Class F / Class K) must NEVER be fought with water; cut gas/power and apply a Wet Chemical (potassium acetate) extinguisher or fire blanket.',
          'Allergen Alert Protocol at the Pass: Wash hands, don fresh gloves, use the segregated Purple Allergen Kit, and dispatch with an Allergen Flag pick.',
          'Hot dishes must be plated on pre-heated china (>= 65°C) and cold dishes on chilled plates (<= 5°C).'
        ],
        ccpParam: 'Hot Pass Dispatch Temperature & Class F/K Fire Readiness',
        ccpLimit: 'Hot Pass >= 65°C | Cold Pass <= 5°C | Weekly extraction hood baffle filter degreasing',
        ccpFix: 'Remake any allergen dish from scratch in a clean pan if cross-contact is suspected at the Pass.',
        checks: [
          'Degrease kitchen canopy hood baffle filters weekly to prevent duct flash fires.',
          'Inspect every plate rim, garnish, portion, and core temperature before calling service.'
        ]
      }
    ],
    questions: [
      {
        q: 'In Auguste Escoffier’s classical Brigade de Cuisine, which Chef de Partie is responsible for cold larder preparations, salads, pâtés, terrines, and charcuterie?',
        options: ['Saucier', 'Garde Manger', 'Poissonnier', 'Entremetier'],
        correctIndex: 1,
        explanation: 'The Garde Manger (Pantry/Larder Chef) oversees all cold kitchen preparations, charcuterie, salads, and cold buffet displays.'
      },
      {
        q: 'What are the standard dimensions of a classical French "Brunoise" vegetable cut?',
        options: [
          '3 mm x 3 mm x 3 mm fine cube (cut from a julienne strip)',
          '10 mm x 10 mm x 10 mm large cube',
          '6 mm x 6 mm x 50 mm baton',
          'Long thin ribbons of leafy herbs'
        ],
        correctIndex: 0,
        explanation: 'A classical Brunoise is a 3 mm x 3 mm x 3 mm cube cut from julienne strips.'
      },
      {
        q: 'Why must classical culinary stocks (Fond Blanc / Fond Brun) always be started in cold water rather than boiling water?',
        options: [
          'Cold water boils faster than hot water',
          'Starting in cold water allows soluble albumin proteins to dissolve and rise slowly to coagulate at the surface for clean skimming, yielding a clear stock',
          'Boiling water breaks stainless steel stockpots',
          'To prevent salt from dissolving'
        ],
        correctIndex: 1,
        explanation: 'Starting in boiling water coagulates surface proteins instantly and emulsifies fats/impurities, producing a cloudy stock.'
      },
      {
        q: 'If a whole beef striploin is purchased (AP) at Rs. 2,000 per kg and has a butcher trim yield of 80% Edible Portion (EP), what is the true cost per kg of the usable trimmed meat?',
        options: ['Rs. 1,600 / kg', 'Rs. 2,000 / kg', 'Rs. 2,500 / kg', 'Rs. 3,200 / kg'],
        correctIndex: 2,
        explanation: 'True EP Cost per kg = AP Cost / Yield % = 2,000 / 0.80 = Rs. 2,500 per kg.'
      },
      {
        q: 'Which specialized fire extinguisher class is mandatory for extinguishing a deep-fat fryer cooking oil fire in a commercial kitchen?',
        options: [
          'Water hose (Class A)',
          'Wet Chemical Extinguisher (Class F in UK/EU / Class K in US)',
          'Standard pressurized tap water bucket',
          'Paper fan'
        ],
        correctIndex: 1,
        explanation: 'Class F / Class K Wet Chemical extinguishers spray potassium salts that react with burning oil (saponification) to form a non-combustible soapy blanket.'
      }
    ]
  },

  // 9. Manager Food & Dietary
  {
    id: 'tr-int-manager-food-dietary',
    code: 'MFD-109',
    title: 'Manager Food & Dietary',
    levelBadge: 'Clinical & Institutional Dietary Management',
    accreditationStandard: 'IDDSI Framework, JCI Hospital Dietary Standards, ESPEN & Clinical Foodservice',
    duration: '15 Guided Hours · 5 Modules',
    description:
      'Advanced certification for Food & Dietary Managers in hospitals, healthcare, aviation, and institutional catering: Therapeutic Diets (Renal, Diabetic, Cardiac), IDDSI Dysphagia Framework (Levels 0–7), Enteral Tube Formula Safety, Ward Trayline Accuracy, and Neutropenic Food Safety.',
    modules: [
      {
        title: 'Therapeutic Diet Prescriptions: Renal, Cardiac, Diabetic, Celiac & Drug Interactions',
        clause: 'JCI Care of Patients (COP) Nutrition Standards & AND Clinical Guidelines',
        overview: 'Managing clinical diet restrictions (Sodium, Potassium, Phosphorus, Gluten < 20 ppm) and Warfarin/MAOI drug-nutrient interactions.',
        principles: [
          'Renal (CKD/Hemodialysis) Diet restricts Sodium (< 2,000 mg/d), Potassium (leach potatoes; limit bananas/oranges/tomatoes), Phosphorus, and Fluids.',
          'Cardiac / DASH Diet restricts Sodium (< 1,500–2,000 mg/d) and saturated fat (< 7% of total calories).',
          'Patients on Warfarin anticoagulant therapy must maintain a steady, consistent daily Vitamin K intake (avoid sudden surges in spinach/kale).'
        ],
        ccpParam: 'Celiac Gluten-Free (< 20 ppm) & Renal Electrolyte Limits',
        ccpLimit: 'Gluten < 20 ppm | Cardiac/Renal Sodium <= 1,500–2,000 mg/day',
        ccpFix: 'Prepare Celiac trays in a segregated allergen zone and cross-check every tray ticket against the EMR.',
        checks: [
          'Double-leach diced potatoes in warm water before cooking for hyperkalemic renal patients.',
          'Flag NPO (Nil Per Os / Nothing by Mouth) patients immediately on the ward dietary board.'
        ]
      },
      {
        title: 'IDDSI Framework (Levels 0–7) for Dysphagia & Texture-Modified Diets',
        clause: 'IDDSI (International Dysphagia Diet Standardisation Initiative) Framework 2.0',
        overview: 'Applying IDDSI Drink Levels (0–4) and Food Levels (3–7), 10 mL Syringe Flow Testing, and Fork Pressure Testing.',
        principles: [
          'IDDSI Drinks: Level 0 (Thin), Level 1 (Slightly Thick), Level 2 (Mildly Thick), Level 3 (Moderately Thick), Level 4 (Extremely Thick).',
          'IDDSI Foods: Level 3 (Liquidised), Level 4 (Pureed), Level 5 (Minced & Moist — max 4 mm adult / 2 mm pediatric particle size), Level 6 (Soft & Bite-Sized — max 15x15 mm adult / 8x8 mm pediatric), Level 7 (Regular).',
          'IDDSI 10 mL Syringe Flow Test (10s): L0 < 1 mL remaining; L1 = 1–4 mL; L2 = 4–8 mL; L3 > 8 mL.'
        ],
        ccpParam: 'IDDSI Level 5 (4 mm) & Level 6 (15 mm) Particle & Fork Pressure Test',
        ccpLimit: 'Level 5 Adult <= 4 mm width | Level 6 Adult <= 15x15 mm & squashes when fork-pressed until thumbnail blanches',
        ccpFix: 'Re-pass through a 4 mm sieve or food processor if lumps exceed IDDSI specification.',
        checks: [
          'Perform the 10-second IDDSI Syringe Flow Test on thickened beverages every batch.',
          'Never serve mixed-consistency items (solid cereal/meat in thin broth) to dysphagia patients.'
        ]
      },
      {
        title: 'Neutropenic Low-Microbial Diets & Infant/Enteral Formula Room Hygiene',
        clause: 'WHO/FAO Powdered Infant Formula Guidelines & CDC Healthcare Infection Control',
        overview: 'Protecting immunocompromised oncology/transplant patients from Listeria and reconstituting powdered infant formula at >= 70°C to kill Cronobacter.',
        principles: [
          'Neutropenic patients must NEVER receive unpasteurized dairy, soft mold-ripened cheeses (Brie, Blue cheese), raw/undercooked eggs, raw sprouts, or cold deli meats.',
          'Powdered Infant Formula (PIF) is not sterile and must be reconstituted with potable water boiled and cooled to NO LESS THAN 70°C to destroy Cronobacter sakazakii.',
          'Open-system decanted enteral tube feeds have a maximum bedside hang time of 4 hours (closed Ready-to-Hang RTH systems: 24–48 hours).'
        ],
        ccpParam: 'Infant Formula Reconstitution (>= 70°C) & Enteral Hang Time',
        ccpLimit: 'Water >= 70°C at PIF mixing (then cooled rapidly) | Open enteral feed max 4 hours bedside hang time',
        ccpFix: 'Discard any formula mixed with tepid water or open enteral feed hanging > 4 hours.',
        checks: [
          'Label every enteral feed container with Patient Name, MRN, Formula, Rate (mL/hr), Prep Time, and Expiry.',
          'Maintain positive air pressure and laminar flow hood sanitization in the Enteral Prep Room.'
        ]
      },
      {
        title: 'Hospital Cook-Chill Operations, Ward Regeneration & Two-Identifier Bedside Check',
        clause: 'UK NHS Healthcare Food Standards & JCI IPSG.1 Patient Identification',
        overview: 'Blast chilling from 70°C to <= 3°C in 90 minutes, regenerating ward trolleys to >= 75°C, and verifying two patient identifiers.',
        principles: [
          'Hospital Cook-Chill Standard: Blast chill cooked meals from 70°C to <= 3°C within 90 minutes and store at 0°C–3°C for max 5 days.',
          'Ward regeneration carts must reheat hot components to >= 75°C core temperature for 2 minutes while keeping cold side <= 5°C.',
          'JCI IPSG.1 requires verifying TWO patient identifiers (Full Name + MRN/DOB) plus Diet/Allergy wristband before handing over the tray.'
        ],
        ccpParam: 'Cook-Chill 90-Minute Curve & JCI Two-Identifier Verification',
        ccpLimit: '70°C to <= 3°C in <= 90 mins | Regeneration >= 75°C | 100% Two-Identifier match at bedside',
        ccpFix: 'Halt tray delivery immediately if patient wristband or EMR shows NPO or allergy mismatch.',
        checks: [
          'Probe dummy sample trays on every ward meal cart prior to service.',
          'Sanitize returned ward meal carts in a thermal tunnel washer (>= 82°C final rinse).'
        ]
      },
      {
        title: 'Malnutrition Universal Screening Tool (MUST), Plate Waste & 72-Hour Disaster Stock',
        clause: 'BAPEN MUST Clinical Protocol & ESPEN Hospital Nutrition Guidelines',
        overview: 'Screening inpatients within 24h using MUST, auditing plate waste, tracking Cost Per Patient Day (CPPD), and holding a 72h emergency food reserve.',
        principles: [
          'The 5-Step MUST tool scores BMI, Unplanned Weight Loss % (3–6 months), and Acute Disease Effect (+2 if no intake > 5 days).',
          'MUST Score >= 2 indicates High Malnutrition Risk requiring immediate Clinical Dietitian intervention and fortified meals/ONS.',
          'Hospitals must maintain a minimum 72-hour (3-day) emergency disaster reserve of shelf-stable food, enteral formulas, and potable water.'
        ],
        ccpParam: '24-Hour Admission MUST Screening & 72-Hour Disaster Reserve',
        ccpLimit: '100% inpatient MUST screening within 24h | Minimum 72-hour emergency food & water stock rotated on FEFO',
        ccpFix: 'Refer all MUST >= 2 patients to Clinical Dietitian within 24 hours and provide Red Tray feeding assistance.',
        checks: [
          'Conduct monthly ward Plate Waste Audits (target < 10–15% waste).',
          'Track Daily Cost Per Patient Day (CPPD) across all therapeutic menus.'
        ]
      }
    ],
    questions: [
      {
        q: 'In the IDDSI (International Dysphagia Diet Standardisation Initiative) Framework, what is the maximum allowable food particle width for an adult on a Level 5 (Minced & Moist) diet?',
        options: ['1 mm', '4 mm (fits between the prongs of a standard dinner fork)', '15 mm', '30 mm'],
        correctIndex: 1,
        explanation: 'IDDSI Level 5 (Minced & Moist) specifies a maximum particle size of 4 mm for adults (and 2 mm for pediatric patients).'
      },
      {
        q: 'To prevent fatal Cronobacter sakazakii infection when reconstituting powdered infant formula in a healthcare dietary unit, what is the minimum temperature of the boiled potable water used for mixing?',
        options: ['25°C', '37°C', '70°C (followed by rapid cooling to feeding temperature)', '100°C served boiling'],
        correctIndex: 2,
        explanation: 'WHO/FAO guidelines require mixing powdered infant formula with boiled water cooled to no less than 70°C to kill Cronobacter sakazakii.'
      },
      {
        q: 'Which dietary modification is essential for a patient prescribed Warfarin (Coumadin) anticoagulant medication?',
        options: [
          'Completely eliminating all water intake',
          'Maintaining a consistent daily intake of Vitamin K and avoiding sudden large fluctuations in dark green leafy vegetables (spinach, kale, broccoli)',
          'Eating 5 grapefruits every morning',
          'Tripling daily sodium intake'
        ],
        correctIndex: 1,
        explanation: 'Vitamin K directly antagonizes Warfarin clotting pathways; patients must maintain a steady, consistent Vitamin K intake.'
      },
      {
        q: 'In an institutional Cook-Chill hospital catering system, within how many minutes must cooked food be blast-chilled from 70°C down to <= 3°C?',
        options: ['Within 90 minutes', 'Within 6 hours', 'Within 12 hours', 'Within 24 hours'],
        correctIndex: 0,
        explanation: 'UK NHS/international Cook-Chill standards require blast chilling from 70°C to <= 3°C within 90 minutes and storage at 0°C–3°C.'
      },
      {
        q: 'Which food item must be strictly excluded from a Neutropenic (Low-Microbial) Diet for an immunocompromised bone-marrow transplant patient?',
        options: [
          'Thoroughly cooked chicken breast (>= 75°C)',
          'Pasteurized UHT milk in sealed carton',
          'Unpasteurized soft mold-ripened cheese (Brie / Blue cheese) and raw alfalfa sprouts',
          'Freshly baked white bread'
        ],
        correctIndex: 2,
        explanation: 'Soft mold-ripened cheeses and raw sprouts carry high risks of Listeria monocytogenes and Salmonella for neutropenic patients.'
      }
    ]
  },

  // 10. Hotel & Hospitality Management
  {
    id: 'tr-int-hotel-hospitality-management',
    code: 'HHM-110',
    title: 'Hotel & Hospitality Management',
    levelBadge: 'International Hospitality & F&B Operations',
    accreditationStandard: 'International Hotel & F&B Operations, Banquet Management & Hospitality KPIs',
    duration: '14 Guided Hours · 5 Modules',
    description:
      'Comprehensive certification in Hotel & Hospitality Management: Food & Beverage Service Styles, Banquet Event Orders (BEO), Buffet & Room Service Safety, Hotel Revenue Metrics (Occupancy, ADR, RevPAR, RevPASH), Housekeeping SOPs, and Guest Recovery.',
    modules: [
      {
        title: 'Hotel Divisions, Guest Cycle & Revenue KPIs (Occupancy, ADR, RevPAR, RevPASH)',
        clause: 'Uniform System of Accounts for the Lodging Industry (USALI 11th Ed.)',
        overview: 'Managing Rooms vs. F&B Divisions and calculating Occupancy %, ADR, RevPAR, and Restaurant RevPASH.',
        principles: [
          'Occupancy % = (Rooms Sold / Total Available Rooms) x 100; ADR (Average Daily Rate) = Total Rooms Revenue / Rooms Sold.',
          'RevPAR (Revenue Per Available Room) = Total Rooms Revenue / Total Available Rooms (or Occupancy % x ADR).',
          'RevPASH (Revenue Per Available Seat Hour) = Total Outlet Revenue / (Available Seats x Hours Open).'
        ],
        ccpParam: 'Night Audit Reconciliation & RevPAR / RevPASH Tracking',
        ccpLimit: 'Zero unresolved PMS vs. Housekeeping room status discrepancies at Night Audit close',
        ccpFix: 'Conduct physical inspection of any Sleep/Skip room discrepancy before closing Night Audit.',
        checks: [
          'Brief Front Office and F&B teams daily on VIP arrivals, group blocks, and BEOs.',
          'Track Average Guest Check and Seat Turnover by meal period.'
        ]
      },
      {
        title: 'International F&B Service Styles, Fine Dining Etiquette & Sommelier Standards',
        clause: 'International Food & Beverage Service & Sommelier Standards',
        overview: 'Executing American (Plated), Russian (Silver Service), French (Guéridon), and Wine Temperature Service.',
        principles: [
          'American (Plated) Service: Plated in kitchen and served/cleared from the guest’s RIGHT side (beverages also from the right).',
          'Russian (Silver) Service: Presented on silver platters and portioned onto the guest’s plate from the LEFT side using a service fork and spoon.',
          'Wine Service Temperatures: Sparkling/Champagne 6°C–8°C, White Wine 8°C–12°C, Full-Bodied Red Wine 16°C–18°C.'
        ],
        ccpParam: 'Fine Dining Service Timing & Wine Temperature Control',
        ccpLimit: 'Welcome <= 2 mins | Starter <= 12 mins | Sparkling wine 6°C–8°C',
        ccpFix: 'Manager touches table immediately if kitchen ticket time exceeds 15 minutes.',
        checks: [
          'Polish glassware and flatware with steam and lint-free microfiber cloths.',
          'Clear course plates only after all guests at the table have finished eating.'
        ]
      },
      {
        title: 'Banquet Event Orders (BEO), MICE Conferencing & Hotel Buffet Hygiene',
        clause: 'International MICE & Hotel Banquet Food Safety Standards',
        overview: 'Executing BEOs (3–5% over-prep guarantee) and enforcing strict buffet pan replacement and temperature logs.',
        principles: [
          'The Banquet Event Order (BEO) is the single operational contract synchronizing Kitchen, Banquets, Stewarding, AV, and Billing.',
          'Kitchens prepare 3% to 5% above the Guaranteed Guest Count on BEOs.',
          'Buffet Rule: Hot chafing dishes >= 63°C, Cold displays <= 5°C; NEVER mix/top-up old buffet pans with fresh food batches.'
        ],
        ccpParam: 'Buffet Pan Replacement & Hourly Temperature Probing',
        ccpLimit: 'Hot >= 63°C | Cold <= 5°C | 100% fresh clean gastro-pan swap on every replenishment',
        ccpFix: 'Remove depleted chafing pan completely to dishwash and insert fresh batch in a clean pan.',
        checks: [
          'Fit sneeze-guards and allergen-labeled serving tongs to every buffet dish.',
          'Use active heated hot-boxes (>= 63°C) inside In-Room Dining delivery trolleys.'
        ]
      },
      {
        title: 'Housekeeping Management, Laundry Disinfection (71°C) & Legionella Water Control',
        clause: 'WHO Hotel Legionella Prevention & EN 14065 Commercial Laundry RABC',
        overview: 'Preventing Legionella pneumophila in hotel plumbing/cooling towers and achieving thermal disinfection in hotel laundries.',
        principles: [
          'Legionella Prevention: Keep cold water < 20°C and hot water stored at >= 60°C (circulating return loop >= 50°C).',
          'Unoccupied hotel guestroom showers and taps must be flushed for 3 minutes every 7 days to prevent stagnant pipe biofilm.',
          'Commercial hotel laundry thermal disinfection requires washing linens and chef uniforms at >= 71°C for at least 3 minutes.'
        ],
        ccpParam: 'Hot Water Loop Legionella Temp & Laundry Thermal Wash',
        ccpLimit: 'Hot water loop >= 60°C (return >= 50°C), Cold < 20°C | Laundry wash >= 71°C for >= 3 minutes',
        ccpFix: 'Perform thermal pasteurization flush (70°C) or chlorination if Legionella is detected.',
        checks: [
          'Use color-coded microfiber cloths in guestrooms to prevent bathroom-to-bedroom cross-contamination.',
          'Log weekly 3-minute water flushing in all vacant rooms.'
        ]
      },
      {
        title: 'Service Recovery (LAST Model), F&B Prime Cost Control & Guest Loyalty',
        clause: 'Forbes Travel Guide Service Standards & USALI Prime Cost Benchmarks',
        overview: 'Resolving guest complaints via the LAST framework (Listen, Apologize, Solve, Thank) and keeping Prime Cost <= 60–65%.',
        principles: [
          'LAST Service Recovery Framework: Listen without interrupting, Apologize sincerely, Solve immediately, Thank the guest.',
          'Hospitality Prime Cost = Total Cost of Goods Sold (Food + Beverage Cost) + Total Labor Cost (Payroll + Benefits).',
          'Well-managed hotel F&B operations maintain Prime Cost at or below 60%–65% of total F&B revenue.'
        ],
        ccpParam: 'F&B Prime Cost % & Pre-Checkout Glitch Resolution',
        ccpLimit: 'Prime Cost (COGS + Labor) <= 60%–65% | 100% of guest glitches resolved prior to checkout',
        ccpFix: 'Optimize roster scheduling and audit beverage pour variances if Prime Cost exceeds 65%.',
        checks: [
          'Record and close every guest issue in the daily Duty Manager Glitch Report.',
          'Conduct semi-annual hotel fire evacuation and food-allergy emergency drills.'
        ]
      }
    ],
    questions: [
      {
        q: 'If a 200-room hotel sells 150 rooms on a given night at an Average Daily Rate (ADR) of Rs. 20,000, what is the hotel’s RevPAR (Revenue Per Available Room) for that night?',
        options: ['Rs. 10,000', 'Rs. 15,000', 'Rs. 20,000', 'Rs. 25,000'],
        correctIndex: 1,
        explanation: 'Occupancy = 150 / 200 = 75%. RevPAR = Occupancy (0.75) x ADR (Rs. 20,000) = Rs. 15,000.'
      },
      {
        q: 'In classical Silver Service (Russian Service), from which side of the guest does the waiter portion food from the silver platter onto the guest’s plate?',
        options: [
          'From the guest’s left side using a service fork and spoon in one hand',
          'From the guest’s right side',
          'Across the center of the table',
          'Guests must walk to the kitchen to collect food'
        ],
        correctIndex: 0,
        explanation: 'In Silver Service, food platters are presented and served from the guest’s left side, while plated food and beverages are served from the right.'
      },
      {
        q: 'To prevent Legionella pneumophila bacterial growth in a hotel’s domestic hot and cold water plumbing system, what temperature thresholds must be maintained?',
        options: [
          'Cold water at 35°C and hot water at 40°C',
          'Cold water below 20°C and hot water stored at >= 60°C (circulating return >= 50°C)',
          'All water held at 37°C',
          'Temperature does not affect Legionella'
        ],
        correctIndex: 1,
        explanation: 'Legionella proliferates between 20°C and 45°C; keeping cold water < 20°C and hot water >= 60°C prevents colonization.'
      },
      {
        q: 'When replenishing a hot chafing dish on a hotel breakfast or banquet buffet, what is the strict international food safety rule?',
        options: [
          'Pour fresh hot food directly on top of the remaining old food in the pan and stir',
          'Never mix old and new batches; remove the depleted pan to the dishwash and insert a clean, sanitized pan containing the fresh batch',
          'Turn off the chafing fuel to save cost',
          'Hold hot buffet food at 35°C'
        ],
        correctIndex: 1,
        explanation: 'Topping up old food transfers time-abused bacteria into the fresh batch; always swap out the entire pan with a clean pan.'
      },
      {
        q: 'In hospitality financial management, which two major expense categories are combined to calculate "Prime Cost"?',
        options: [
          'Marketing Expense + Property Tax',
          'Total Cost of Goods Sold (Food & Beverage Cost) + Total Labor Cost (Payroll & Benefits)',
          'Electricity + Water Bills',
          'Depreciation + Loan Interest'
        ],
        correctIndex: 1,
        explanation: 'Prime Cost equals Total Cost of Goods Sold (COGS) plus Total Labor Cost.'
      }
    ]
  },

  // 11. Food Safety Level 4 in Catering
  {
    id: 'tr-int-fs-level4-catering',
    code: 'FSLC-111',
    title: 'Food Safety Level 4 in Catering',
    levelBadge: 'Level 4 Award (RQF Equivalent) · Catering',
    accreditationStandard: 'UK RQF Level 4 Managing Food Safety in Catering, Codex & Municipality PIC Standards',
    duration: '24 Guided Hours · 5 Modules',
    description:
      'Advanced Level 4 Management Qualification in Food Safety for Catering & Hospitality Directors, Executive Chefs, and Senior QA Managers: Outbreak Epidemiology, Complex Culinary Processes (Sous-Vide, Cook-Chill, Sushi Acidification), Food Safety Culture Leadership, and Regulatory Inspection Defense.',
    modules: [
      {
        title: 'Advanced Catering Microbiology, Heat-Stable Toxins & Outbreak Epidemiology',
        clause: 'RQF Level 4 Managing Food Safety in Catering Unit 1 & WHO Outbreak Investigation',
        overview: 'Distinguishing bacterial infections from heat-stable intoxications (B. cereus emetic cereulide, S. aureus enterotoxin, Scombroid histamine).',
        principles: [
          'Foodborne Intoxications (B. cereus emetic toxin, S. aureus enterotoxin) involve pre-formed heat-stable toxins that survive reheating to 75°C or 100°C.',
          'Scombroid Histamine Poisoning occurs in temperature-abused (> 4°C) tuna, mackerel, and mahi-mahi; cooking cannot destroy histamine.',
          'Large banquet operations must retain 150g sterile reference samples at <= 4°C for 72 hours for epidemiological traceback.'
        ],
        ccpParam: 'Scombroid Fish Receiving Temp & 72-Hour Banquet Sample Bank',
        ccpLimit: 'Histidine-rich fish received at <= 2°C in melting ice (< 50 ppm histamine) | 150g banquet samples held 72h',
        ccpFix: 'Reject any tuna/mackerel delivery arriving above 4°C immediately.',
        checks: [
          'Maintain a locked 72-hour Banquet Reference Sample refrigerator.',
          'Calculate Attack Rate % tables during any suspected foodborne illness investigation.'
        ]
      },
      {
        title: 'High-Risk Culinary Processes: Acidified Sushi Rice, Parasite Freezing & Sous-Vide',
        clause: 'FDA Food Code 3-502 Special Processes & EU Parasite Freezing Reg 853/2004',
        overview: 'Controlling sushi rice acidification (pH <= 4.1), Anisakis parasite freezing (-20°C/7d), and catering Sous-Vide.',
        principles: [
          'Acidified Sushi Rice (shari) held at ambient bar temperature requires target pH <= 4.1 (Critical Limit < 4.5) to inhibit Bacillus cereus.',
          'Fish served raw (sushi, sashimi, ceviche) must be frozen at <= -20°C for >= 7 days (or <= -35°C for >= 15 hours) to kill Anisakis parasites.',
          'Raw or lightly cooked egg dishes (Hollandaise, Tiramisu, Mayonnaise) must exclusively use pasteurized egg products.'
        ],
        ccpParam: 'Sushi Rice pH & Raw Fish Parasite Freezing',
        ccpLimit: 'Sushi rice pH <= 4.1 (Critical < 4.5) | Raw fish frozen <= -20°C for 7 days (or -35°C for 15h)',
        ccpFix: 'Add rice vinegar and re-test pH with calibrated probe before releasing sushi rice; retain fish freezing certificates.',
        checks: [
          'Calibrate the sushi kitchen digital pH meter daily in pH 4.0 and 7.0 buffers.',
          'Ban unpasteurized shell eggs from cold sauces and desserts.'
        ]
      },
      {
        title: 'Commercial Kitchen Engineering, HVAC Ventilation & Thermal Dishwashing (82°C)',
        clause: 'BS EN 16282 Commercial Kitchen Engineering & Codex Catering Design',
        overview: 'Segregating pot-wash from High-Care plating, maintaining >= 500 Lux lighting, and verifying >= 82°C dishwasher final rinse.',
        principles: [
          'Segregate dirty dish return/pot-wash from clean storage and cold plating to prevent aerosol cross-contamination.',
          'Commercial rack/flight dishwashers require wash tanks at 55°C–65°C and final disinfection rinse at >= 82°C for 10–15 seconds.',
          'Food preparation and inspection pass surfaces require >= 500 Lux shatterproof illumination.'
        ],
        ccpParam: 'Dishwasher Final Rinse Disinfection & Prep Lighting',
        ccpLimit: 'Final Rinse >= 82°C verified by irreversible thermal strip | Prep surface lighting >= 500 Lux',
        ccpFix: 'Service rinse booster heater and re-run racks if 82°C thermal strip fails to turn black.',
        checks: [
          'Run weekly 82°C irreversible thermal test strips through all dishwashers and log.',
          'Service grease traps outside preparation hours on a documented manifest.'
        ]
      },
      {
        title: 'Leading Multi-Site Catering Food Safety Culture & Unannounced Branch Audits',
        clause: 'Codex CXC 1-1969 Food Safety Culture & RQF Level 4 Management',
        overview: 'Embedding behavioral food safety culture across restaurant/hotel groups, induction gates, and unannounced branch audits.',
        principles: [
          'Zero new or agency food handlers may touch open food prior to completing Personal Hygiene, Allergen, and Temperature Induction.',
          'Executive Chef and Outlet Manager incentives must be tied to unannounced Food Safety Audit scores (>= 90%), not food cost alone.',
          'Prohibit unauthorized petty-cash purchases of meat, poultry, or dairy from unapproved local retail vendors.'
        ],
        ccpParam: 'Unannounced Branch Audit Score & Pre-Work Induction Gate',
        ccpLimit: 'Branch audit >= 90% with zero critical breaches | 100% pre-work hygiene/allergen induction sign-off',
        ccpFix: 'Issue 48-hour mandatory rectification notice and re-audit any branch scoring below 90%.',
        checks: [
          'Conduct daily 5-minute pre-shift food safety briefings in every kitchen.',
          'Audit Petty Cash receipts monthly to block unapproved food purchasing.'
        ]
      },
      {
        title: 'Food Law, Legal Due Diligence Defense & Regulatory Enforcement Notices',
        clause: 'International Food Safety Act Due Diligence & GCC Municipality Regulations',
        overview: 'Establishing the two-pillar Legal Due Diligence defense, preventing record fabrication ("dry-labbing"), and handling EHO inspections.',
        principles: [
          'Legal Due Diligence Defense requires proving: (1) All reasonable precautions (robust HACCP system), and (2) All due diligence (active verification/auditing in practice).',
          'Pre-filling or falsifying temperature logs ("dry-labbing") destroys any Due Diligence defense and is a criminal offense.',
          'Regulatory powers include Hygiene Improvement Notices, Seizure of unfit food, and Hygiene Emergency Prohibition Orders (immediate closure).'
        ],
        ccpParam: 'Log Authenticity & Daily Manager Verification',
        ccpLimit: 'Zero pre-filled/fabricated logs | 100% daily Head Chef/Manager verification sign-off',
        ccpFix: 'Audit logs for "flat-lining" (identical numbers daily) and transition to timestamped digital Bluetooth probes.',
        checks: [
          'Ensure allergen matrices are signed off BEFORE any daily chef special goes on sale.',
          'Maintain a 24/7 Crisis Response Protocol for alleged food poisoning or anaphylaxis.'
        ]
      }
    ],
    questions: [
      {
        q: 'Why can reheating temperature-abused cooked rice to 75°C fail to prevent foodborne illness caused by Bacillus cereus emetic syndrome?',
        options: [
          'Bacillus cereus is a virus that grows at 100°C',
          'Bacillus cereus produces a pre-formed emetic toxin (cereulide) during ambient temperature abuse that is extremely heat-stable (surviving 121°C for 90 minutes)',
          'Rice cannot be heated above 50°C',
          'Reheating increases the water activity to 2.0'
        ],
        correctIndex: 1,
        explanation: 'Both Bacillus cereus emetic toxin (cereulide) and Staphylococcus aureus enterotoxin are heat-stable toxins that survive normal cooking and reheating.'
      },
      {
        q: 'When preparing acidified sushi rice (shari) to be held at ambient sushi-bar temperatures, what critical pH threshold must be achieved and verified with a calibrated pH meter?',
        options: ['pH 7.0 (Neutral)', 'pH 8.5 (Alkaline)', 'Target pH <= 4.1 (Critical Limit < 4.5)', 'pH 6.2'],
        correctIndex: 2,
        explanation: 'Acidifying cooked sushi rice to pH <= 4.1 (critical limit < 4.5) prevents germination and growth of Bacillus cereus spores at ambient temperature.'
      },
      {
        q: 'To prevent Anisakis parasite infection when serving raw or lightly marinated fish (sushi, sashimi, ceviche) in catering, what freezing treatment is required if the fish is not from certified parasite-free aquaculture?',
        options: [
          'Chilling at +4°C for 2 hours',
          'Freezing at -20°C or below for at least 7 days (or -35°C for at least 15 hours)',
          'Washing the fish in cold tap water',
          'Squeezing lemon juice over the fish'
        ],
        correctIndex: 1,
        explanation: 'EU/FDA regulations require freezing fish intended for raw consumption at <= -20°C for 7 days (or <= -35°C for 15 hours) to kill Anisakis larvae.'
      },
      {
        q: 'What are the two essential elements a catering organization must prove in court to establish a successful "Due Diligence" defense under food safety law?',
        options: [
          'That the restaurant was busy and staff were tired',
          'That it took all reasonable precautions (designed a robust HACCP system) AND exercised all due diligence (verified and audited that the system was followed in practice)',
          'That the customer signed a menu disclaimer',
          'That the supplier was the cheapest available'
        ],
        correctIndex: 1,
        explanation: 'Due Diligence requires proving both a documented system ("all reasonable precautions") and active verification/enforcement ("all due diligence").'
      },
      {
        q: 'What causes Scombroid food poisoning in histidine-rich fish such as tuna, mackerel, and mahi-mahi, and can cooking eliminate the hazard?',
        options: [
          'Bacterial conversion of histidine into heat-stable histamine during temperature abuse (> 4°C); cooking CANNOT destroy histamine once formed',
          'A parasite that dies instantly at 55°C',
          'Excessive ice storage at 0°C',
          'Adding lemon and salt during grilling'
        ],
        correctIndex: 0,
        explanation: 'Enteric bacteria decarboxylate histidine into histamine when fish is held above 4°C; histamine is completely heat-stable through cooking and canning.'
      }
    ]
  },

  // 12. Food Safety Level 4 in Manufacturing
  {
    id: 'tr-int-fs-level4-manufacturing',
    code: 'FSLM-112',
    title: 'Food Safety Level 4 in Manufacturing',
    levelBadge: 'Level 4 Award (RQF Equivalent) · Manufacturing',
    accreditationStandard: 'UK RQF Level 4 Managing Food Safety in Manufacturing, GFSI & Codex Standards',
    duration: '26 Guided Hours · 5 Modules',
    description:
      'Premier Level 4 Qualification for Food Manufacturing QA Managers, Plant Directors, and Technical Heads: Thermal Lethality Kinetics (D-Value, z-Value, F0=3 min Botulinum Cook), Environmental Pathogen Monitoring (Zones 1–4), Hurdle Technology, Allergen ELISA/PCR Validation, and Crisis Recall Management.',
    modules: [
      {
        title: 'Thermal Lethality Kinetics: D-Value, z-Value, 12-D Botulinum Cook (F0) & Hurdle Tech',
        clause: 'FDA 21 CFR Part 113 Low-Acid Canned Foods & Codex CXC 23-1979',
        overview: 'Calculating D-values, z-values, F0 >= 3.0 min retort commercial sterility, double-seam integrity, and multi-factor Hurdle Technology.',
        principles: [
          'D-Value is the time in minutes at a specific temperature to reduce microbial population by 90% (1 log); z-Value is the temperature change (°C) to change D-value by 10x.',
          'For Clostridium botulinum spores (D_121.1°C = 0.21 min, z = 10°C), a 12-D reduction requires F0 = 12 x 0.21 = 2.52 mins (industrial minimum F0 >= 3.0 mins at 121.1°C).',
          'Post-retort cooling canal water must maintain 0.5–2.0 ppm free chlorine so vacuum cooling does not suck pathogens through warm wet seams.'
        ],
        ccpParam: 'Retort Sterilization Lethality (F0) & Cooling Water Chlorine',
        ccpLimit: 'F0 >= 3.0 minutes at 121.1°C at cold spot | Cooling water 0.5–2.0 ppm free chlorine',
        ccpFix: 'Quarantine entire retort crate for Process Authority evaluation if thermal drop or seam defect occurs.',
        checks: [
          'Perform destructive Can Double-Seam Teardown micrometric checks every 30–60 minutes.',
          'Validate retort heat distribution and cold-spot penetration annually.'
        ]
      },
      {
        title: 'Environmental Pathogen Monitoring Programs (EMP): Zones 1–4 for Listeria & Salmonella',
        clause: 'FSSC 22000 v6 Clause 2.5.12 & BRCGS Issue 9 Clause 4.11.8 EMP',
        overview: 'Executing "Seek and Destroy" swabbing across Zones 1, 2, 3, and 4 in wet chilled RTE plants (Listeria) and dry plants (Salmonella).',
        principles: [
          'Zone 1: Direct food contact surfaces. Zone 2: Adjacent non-food contact frames/panels. Zone 3: Floors, walls, drains in processing room. Zone 4: Remote locker/warehouse areas.',
          'Chilled wet RTE factories target Listeria spp.; dry low-moisture factories (milk powder, chocolate, tahini) target Salmonella spp.',
          'Dry low-moisture zones must use dry vacuuming and controlled alcohol wipes—uncontrolled water flooding triggers rapid Salmonella growth.'
        ],
        ccpParam: 'Zone 1 Pathogen Swab Standard & Corrective Vectoring',
        ccpLimit: 'Listeria spp. & Salmonella: Absent in 25g / swab on all Zone 1 food-contact surfaces',
        ccpFix: 'Halt line, quarantine finished lot, tear down equipment for biofilm removal, and require 3 consecutive negative daily swabs.',
        checks: [
          'Collect EMP swabs 3–4 hours into active production run (not only immediately after sanitation).',
          'Ban high-pressure water hoses during open production.'
        ]
      },
      {
        title: 'Quantitative Allergen Validation (ELISA / PCR / VITAL 3.0) & Rework Rules',
        clause: 'Codex CXC 80-2020 & Allergen Bureau VITAL 3.0 Reference Doses',
        overview: 'Why ATP swabs cannot validate allergen removal, requiring protein-specific ELISA/PCR across 3 consecutive runs.',
        principles: [
          'ATP bioluminescence swabs measure general organic adenosine triphosphate, NOT specific allergenic proteins.',
          'Allergen cleaning validation requires protein-specific ELISA or Lateral Flow swabs (< 5 ppm) across 3 consecutive worst-case changeovers.',
          'Allergen-containing rework may ONLY be reworked into products sharing the exact same allergen profile ("like-into-like").'
        ],
        ccpParam: 'Allergen Changeover ELISA Validation',
        ccpLimit: '3 consecutive runs passing visual + specific ELISA swab (< LOQ / < 5 ppm) on surfaces and CIP rinse water',
        ccpFix: 'Re-engineer CIP wash or dedicate product-contact hoses/gaskets if ELISA detects residual protein.',
        checks: [
          'Apply Precautionary Allergen Labeling ("May contain") only when justified by quantitative VITAL risk assessment.',
          'Color-code and lock allergen rework containers.'
        ]
      },
      {
        title: 'Foreign Body Detection Physics (Balanced-Coil Metal vs. X-Ray) & Engineering Handover',
        clause: 'GFSI Foreign Body Detection & Sanitary Engineering Standards',
        overview: 'Comparing Ferrous, Non-Ferrous, and Stainless Steel 316 detection physics, conductive product effect, X-Ray density detection, and fail-safes.',
        principles: [
          'Austenitic Stainless Steel (304/316) is hardest for balanced-coil metal detectors to detect because it is non-magnetic and has low electrical conductivity.',
          'Warm, wet, salty, or acidic foods create a conductive "Product Effect"; metalized foil film requires X-Ray or Ferrous-in-Foil detectors.',
          'X-Ray systems detect density differentials (metal, calcified bone, stone, glass, dense rubber) but cannot detect low-density wood, hair, or thin plastic.'
        ],
        ccpParam: 'Detector Fail-Safe Verification & Post-Maintenance Hygiene Sign-Off',
        ccpLimit: 'Leading/Middle/Trailing test pack rejection + air-drop/bin-full line stop | 100% tool & bolt reconciliation after maintenance',
        ccpFix: 'Keep line locked out until QA signs Post-Maintenance Hygiene & Fastener Reconciliation clearance.',
        checks: [
          'Pass certified test pieces through the geometric center of the aperture (worst-case spot) hourly.',
          'Verify photo-eye reject confirmation and locked reject bin alarms every shift.'
        ]
      },
      {
        title: 'Strategic FSMS Governance, Class I/II/III Recalls & Supplier Auditing',
        clause: 'FDA Recall Classifications (Class I, II, III) & Codex CXG 60-2006',
        overview: 'Managing Class I life-threatening recalls vs. Trade Withdrawals, supplier risk stratification, and Management Review KPIs.',
        principles: [
          'Class I Recall: Reasonable probability of serious adverse health consequences or death (undeclared peanut/milk allergen, Listeria in RTE, C. botulinum).',
          'Class II Recall: Temporary/reversible health effects. Class III Recall: Unlikely to cause adverse health effects.',
          'High-risk raw material suppliers require a valid GFSI certificate or an on-site second-party food safety audit every 12 months.'
        ],
        ccpParam: 'Class I Recall Execution & High-Risk Supplier Approval',
        ccpLimit: '4-hour mass-balance trace + immediate regulatory/CB alert | 100% GFSI or audited high-risk suppliers',
        ccpFix: 'Lock affected lots in ERP, notify Certification Body within 3 working days, and issue public recall alert.',
        checks: [
          'Trend Right First Time (RFT %), Complaints per Million Units (CPMU), and EMP hit rates monthly.',
          'Conduct unannounced Mock Recalls including out-of-hours crisis team contact tests.'
        ]
      }
    ],
    questions: [
      {
        q: 'In thermal processing kinetics, if an organism has a D-value at 121.1°C of 0.21 minutes, how many minutes at 121.1°C are required to achieve a 12-log (12-D) reduction ("Botulinum Cook")?',
        options: ['0.21 minutes', '1.20 minutes', '2.52 minutes (rounded to F0 = 3.0 minutes industry standard)', '12.0 minutes'],
        correctIndex: 2,
        explanation: 'A 12-D reduction requires 12 x D_121.1°C = 12 x 0.21 minutes = 2.52 minutes (standardized industrially as F0 >= 3.0 minutes).'
      },
      {
        q: 'In a plant Environmental Monitoring Program (EMP), which zone classification applies to non-food contact surfaces immediately adjacent to food contact surfaces (such as equipment frames, control panels, and overhead drip shields)?',
        options: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'],
        correctIndex: 1,
        explanation: 'Zone 1 is direct food contact; Zone 2 is immediately adjacent non-food contact; Zone 3 is floors/walls/drains inside the room; Zone 4 is remote areas.'
      },
      {
        q: 'Why is an ATP bioluminescence swab alone insufficient to validate that an equipment line is free of peanut or milk allergen protein after a changeover wash?',
        options: [
          'ATP swabs take 5 days to give a result',
          'ATP measures residual adenosine triphosphate (general organic/microbial debris), not specific allergenic proteins, which have zero or low ATP yet remain capable of triggering anaphylaxis',
          'ATP swabs only work on wooden surfaces',
          'Allergens glow in the dark naturally'
        ],
        correctIndex: 1,
        explanation: 'Purified or heat-processed allergenic proteins contain little or no ATP; allergen validation requires protein-specific ELISA or lateral-flow swabbing.'
      },
      {
        q: 'Why is Austenitic Stainless Steel (304 / 316) typically more difficult for a balanced-coil metal detector to detect than Ferrous iron of the same diameter?',
        options: [
          'Stainless steel is lighter than water',
          'Austenitic stainless steel is non-magnetic (low magnetic permeability) and has low electrical conductivity',
          'Stainless steel dissolves inside food',
          'Ferrous metal is invisible to coils'
        ],
        correctIndex: 1,
        explanation: 'Austenitic 304/316 stainless steel is non-magnetic and poorly conductive, requiring a larger sphere (e.g., 2.5 mm vs 1.5 mm Fe) to disturb the detector field.'
      },
      {
        q: 'Which scenario requires a "Class I" Product Recall under international food safety regulations?',
        options: [
          'A slight font size error on the back-of-pack website address',
          'Discovery of undeclared peanut protein or Listeria monocytogenes in a distributed Ready-to-Eat food product',
          'Shipping 23 cartons instead of 24 cartons on a pallet',
          'A crooked barcode sticker on an outer shipping case'
        ],
        correctIndex: 1,
        explanation: 'Class I recalls involve a reasonable probability of serious adverse health consequences or death, such as undeclared major allergens or Listeria/Salmonella in RTE food.'
      }
    ]
  },

  // 13. HACCP Level 4 in Catering
  {
    id: 'tr-int-haccp-level4-catering',
    code: 'HCLC-113',
    title: 'HACCP Level 4 in Catering',
    levelBadge: 'Level 4 Award (RQF Equivalent) · Catering HACCP',
    accreditationStandard: 'UK RQF Level 4 Managing HACCP in Catering, Safer Food Better Business & Codex 2022',
    duration: '24 Guided Hours · 5 Modules',
    description:
      'Advanced Level 4 Qualification in Designing, Validating, and Auditing Catering HACCP Systems: Module 1 (HACCP Basics & Process-Led 3-Trip Catering Architecture), Module 2 (Catering Prerequisite Programs - PRPs), Module 3 (The 12 Steps of HACCP: First 5 Preliminary Steps in Catering), Module 4 (Principles 1–4: Hazard Analysis, 5x5 Risk Matrix, Codex Decision Tree, Critical Limits & Monitoring), and Module 5 (Principles 5–7: Corrective Actions, Validation, How to Audit Catering HACCP & Food Safety Law).',
    modules: [
      {
        title: 'Module 1: HACCP Basics in Catering & Process-Led 3-Trip Architecture (Process 1, 2 & 3)',
        clause: 'FDA Food Code Annex 4 Process Approach & Codex CXC 1-1969 (2022)',
        overview: 'Starting with HACCP Basics for commercial kitchens, hotels, hospitals, and airlines: why traditional recipe-by-recipe HACCP fails in changing menus, and how Process-Led HACCP groups hundreds of dishes into Process 1 (No Cook), Process 2 (Same-Day Cook), and Process 3 (Complex Cook-Chill-Reheat) based on trips through the 5°C–60°C Danger Zone.',
        principles: [
          'Process 1 (No Cook Trip — 0 Trips through Thermal Kill): Receive -> Store -> Prep -> Hold Cold -> Serve (e.g., Sashimi, Green Salads, Cold Sandwiches).',
          'Process 2 (Same-Day Cook & Serve — 1 Trip through TDZ): Receive -> Store -> Prep -> Cook (>= 75°C) -> Hot Hold (>= 63°C) -> Serve (e.g., Grilled Steaks, Roast Chicken).',
          'Process 3 (Complex Cook-Chill-Reheat — 2 to 3 Trips through TDZ): Cook (>= 75°C) -> Blast Chill (60°C->20°C in 2h, ->4°C in 4h) -> Cold Store -> Reheat (>= 75°C) -> Hot Hold -> Serve (highest spore germination risk for C. perfringens and B. cereus).'
        ],
        ccpParam: 'Process 3 (Cook-Chill-Reheat) Spore Germination Control',
        ccpLimit: 'Cook >= 75°C | Chill 60°C->20°C (<= 2h) & ->4°C (<= 4h) | Reheat once to >= 75°C',
        ccpFix: 'Discard any Process 3 batch that fails the blast-chill time limit or has already been reheated once.',
        checks: [
          'Classify 100% of catering menu items into Process 1, Process 2, or Process 3.',
          'Update Process Group mapping whenever seasonal, hotel buffet, or banquet menus change.'
        ]
      },
      {
        title: 'Module 2: Catering Prerequisite Programs (PRPs) — Kitchen Zoning, Produce Washing, Dishwashing & Allergen PRPs',
        clause: 'Codex CXC 1-1969 Catering PRPs & BS EN 16282 Commercial Kitchen Hygiene',
        overview: 'Establishing the catering Prerequisite Programs (PRPs) before applying the 12 HACCP Steps: color-coded cross-contamination barriers, 50–100 ppm chlorine vegetable washing (pH 6.0–7.0), 82°C thermal dishwashing, ice machine sanitation, and Big-9 allergen zoning.',
        principles: [
          'Chlorine Salad Wash PRP/OPRP: Immerse pre-washed produce in 50–100 ppm free chlorine at pH 6.0–7.0 for 5 minutes followed by potable water rinse (above pH 8.0, active HOCl drops by ~80%).',
          'Commercial rack/flight dishwashers require wash tanks at 55°C–65°C and final sanitizing rinse at >= 82°C verified weekly with irreversible thermal strips.',
          'Commercial ice machines must be emptied, descaled, and sanitized (200 ppm chlorine) monthly with external scoop holders to prevent Coliform and Pseudomonas biofilms.'
        ],
        ccpParam: 'Produce Chlorine Wash (50–100 ppm at pH 6.0–7.0) & Dishwasher >= 82°C Rinse',
        ccpLimit: '50–100 ppm Free Chlorine at pH 6.0–7.0 for 5 mins | Dishwasher final rinse >= 82°C | Ice E. coli 0 CFU/100mL',
        ccpFix: 'Test both chlorine ppm AND pH strips every batch; service rinse booster heater if 82°C thermal strip fails.',
        checks: [
          'Log both free chlorine concentration and pH in the salad wash sink every shift.',
          'Enforce 7-color chopping board segregation and dedicated Purple Allergen kits.'
        ]
      },
      {
        title: 'Module 3: The 12 Steps of HACCP (Part 1) — First 5 Preliminary Steps for Catering, Banquets & Airlines',
        clause: 'Codex Preliminary Steps 1–5 & World Food Safety Guidelines (WFSG) for Airline Catering',
        overview: 'Executing the initial 5 Steps of Codex HACCP in catering: Step 1 (Culinary & QA HACCP Team), Step 2 (Menu Group Specifications & Shelf-Life), Step 3 (Intended Consumers & Vulnerable Hospital/School/Airline Guests), Step 4 (Kitchen & Off-Site Banquet Flow Diagrams), and Step 5 (On-Site Verification Across Prep, Peak Service & Night Clean).',
        principles: [
          'Step 1 to Step 3 in Catering: Assemble Executive Chef, Sous Chef, Stewarding Manager, and QA Manager; define Process 1/2/3 menu specs and identify high-risk YOPI consumers (hospital patients, nursery children, elderly, allergy guests).',
          'Step 4 & Step 5 Flow Diagramming: Map Receiving -> Walk-in Chillers -> Butcher/Veg Prep -> Thermal Cooking -> Blast Chilling -> Cold Plating (<= 15°C room, max 45 mins exposure in airline catering) -> Hot/Cold Pass -> Off-Site Insulated Transport.',
          'Walk the kitchen floor during peak Friday/Saturday service and off-site banquet loading to verify Step 5 Flow Diagram accuracy.'
        ],
        ccpParam: 'Step 5 Kitchen Flow Verification & Airline Cold-Room Exposure Limit',
        ccpLimit: '100% verified kitchen/banquet flow diagram | Airline cold assembly <= 15°C room max 45 mins exposure',
        ccpFix: 'Return delayed meal trays to blast chiller immediately if assembly exceeds 45 minutes; update flow chart before launching new catering services.',
        checks: [
          'Pre-chill off-site banquet delivery trucks to <= 4°C before loading trolleys.',
          'Apply tamper-evident hygiene seals to all off-site event boxes and flight carts.'
        ]
      },
      {
        title: 'Module 4: The 7 Principles (Principles 1–4) — Catering Hazard Analysis, 5x5 Risk Matrix, Codex Decision Tree, Critical Limits & Monitoring',
        clause: 'Codex Steps 6–9 (Principles 1–4) & UK FSA 6-Log Listeria Equivalent Cook Table',
        overview: 'Conducting a complete Catering Hazard Analysis using the 5x5 Risk Assessment Matrix (Likelihood x Severity), applying the Codex 4-Question CCP Decision Tree to kitchen steps, setting validated Critical Limits (Cooking, Cooling, Reheating, Sushi Rice pH <= 4.1), and calibrating digital probes.',
        principles: [
          'Principle 1 & 2 (Hazard Analysis, 5x5 Risk Matrix & Codex Decision Tree): Score catering hazards (e.g., Salmonella in poultry L=4 x S=4 = 16 Significant; B. cereus in sushi rice L=3 x S=4 = 12 Significant; Anisakis in raw fish L=3 x S=4 = 12) and apply Q1–Q4 Decision Tree to pinpoint true CCPs.',
          'Principle 3 (Validated Catering Critical Limits & Equivalent Cooks): Equivalent 6-Log Listeria Cook Combinations: 60°C/45m, 65°C/10m, 70°C/2m, 75°C/30s, 80°C/6s; Acidified Sushi Rice pH <= 4.1; Raw Sushi Fish parasite freeze <= -20°C for 7 days.',
          'Principle 4 (Catering CCP Monitoring & Probe Calibration): Calibrate digital probes weekly in crushed ice (0.0°C ± 0.5°C) and boiling water (100.0°C ± 0.5°C), sanitize stems with 70% alcohol wipes, and record core temperatures of the thickest item per batch.'
        ],
        ccpParam: '5x5 Risk Matrix, Equivalent Cook (>= 75°C/30s), Sushi pH (<= 4.1) & Probe Calibration',
        ccpLimit: 'Cook >= 75°C/30s (or 70°C/2m) | Sushi rice pH <= 4.1 | Probe accuracy ± 0.5°C in ice/boiling water',
        ccpFix: 'Continue cooking if < 75°C; add vinegar if sushi rice pH > 4.1; withdraw any probe deviating by > ±1.0°C.',
        checks: [
          'Stock 70% isopropyl alcohol probe wipes and pH 4.0/7.0 calibration buffers in the kitchen.',
          'Verify walk-in chillers recover to <= 4°C within 30–60 minutes after automatic defrost cycles.'
        ]
      },
      {
        title: 'Module 5: The 7 Principles (Principles 5–7) — Corrective Actions, Validation, How to Audit Catering HACCP & Food Safety Law',
        clause: 'Codex Principles 5–7, ISO 19011 Catering Audits & Food Safety Law (Due Diligence)',
        overview: 'Executing catering CCP Corrective Actions (Principle 5), Microbiological Verification & How to Audit a Catering HACCP System (Principle 6), Tamper-Proof Exception Diaries (Principle 7), and Catering Food Safety Law & Legal Due Diligence Defense.',
        principles: [
          'Principle 5 (Catering Corrective Actions): If hot-hold drops below 63°C (< 2h: reheat once to >= 75°C; > 2h: discard immediately); if blast-chill exceeds 6 hours, discard the batch and investigate blast-chiller loading depth.',
          'Principle 6 & How to Audit a Catering HACCP System: Audit kitchen CCP diaries against delivery invoices and probe calibration logs, observe chefs probing core temperatures live, inspect 72-hour banquet reference sample banks (150g held at <= 4°C), and review monthly lab swabs.',
          'Principle 7 & Catering Law on HACCP: Under UK/EU Food Hygiene Law (Reg 852/2004 Art 5), FDA Food Code, GCC/Dubai Municipality PIC Regulations, and Pakistan Pure Food Laws (PFA/SFA/KPFA), catering operators must maintain a HACCP-based system and prove Legal Due Diligence (zero pre-filled/"dry-labbed" temperature sheets).'
        ],
        ccpParam: 'Catering HACCP Audit Score, 72h Banquet Sample Bank & Legal Record Authenticity',
        ccpLimit: 'Unannounced kitchen audit >= 90% | Zero pre-filled ("dry-labbed") CCP logs | 150g banquet reference samples kept 72h at <= 4°C',
        ccpFix: 'Quarantine/discard unsafe food immediately, retrain brigade on CCP corrective actions, and transition to digital timestamped Bluetooth probes if log flat-lining is detected.',
        checks: [
          'Conduct monthly unannounced Catering HACCP audits during peak dinner and banquet shifts.',
          'Review and re-validate the Catering HACCP Plan annually or prior to any menu/equipment change.'
        ]
      }
    ],
    questions: [
      {
        q: 'In the Process-Led Catering HACCP methodology (FDA Annex 4 / EU Catering Notice), why are menu items categorized into Process 1 (No Cook), Process 2 (Same-Day Cook), and Process 3 (Complex Cook-Chill-Reheat)?',
        options: [
          'To group dishes by menu price',
          'To group hundreds of changing recipes according to how many times the food passes through the Temperature Danger Zone (5°C–60°C), simplifying CCP management',
          'To separate vegetarian dishes from meat dishes only',
          'To avoid checking cooking temperatures'
        ],
        correctIndex: 1,
        explanation: 'Process-Led HACCP groups dishes by the number of trips through the Temperature Danger Zone (0 trips, 1 trip, or 2+ trips) so shared CCPs control hundreds of recipes.'
      },
      {
        q: 'Why must the pH of a chlorine vegetable sanitization bath be maintained between pH 6.0 and 7.0 when disinfecting ready-to-eat salad leaves at 50–100 ppm?',
        options: [
          'Because at pH above 8.0, active hypochlorous acid (HOCl) converts mostly into weak hypochlorite ions (OCl-), drastically reducing bactericidal effectiveness',
          'Because pH 6.5 turns lettuce blue',
          'Because chlorine boils at pH 7.5',
          'pH has zero effect on chlorine sanitization'
        ],
        correctIndex: 0,
        explanation: 'Hypochlorous acid (HOCl) is 80x more lethal to microbes than hypochlorite ion (OCl-); HOCl predominates at pH 6.0–7.0.'
      },
      {
        q: 'According to UK FSA / ACMSF time-temperature equivalence tables for cooking (6-log reduction of Listeria monocytogenes), which combination is equivalent to cooking at 70°C for 2 minutes?',
        options: ['45°C for 1 minute', '75°C for 30 seconds (or 65°C for 10 minutes)', '50°C for 30 seconds', '60°C for 10 seconds'],
        correctIndex: 1,
        explanation: 'Using z = 7.5°C for Listeria monocytogenes, 70°C for 2 mins is thermally equivalent to 75°C for 30 secs, 65°C for 10 mins, or 60°C for 45 mins.'
      },
      {
        q: 'Which piece of commercial catering equipment is one of the most frequent sources of Coliform and Pseudomonas contamination during third-party microbiological verification audits if not descaled and sanitized monthly?',
        options: ['Gas burner cast-iron grates', 'Commercial ice machines and ice storage bins (plus ice scoops)', 'Dry pasta storage shelves', 'Exhaust chimney exterior'],
        correctIndex: 1,
        explanation: 'Commercial ice machines develop mold/slime biofilms and suffer hand-contact contamination via improperly stored ice scoops.'
      },
      {
        q: 'In International Airline Catering (IFSA / WFSG) HACCP standards, if a cold-meal assembly room is maintained at an ambient temperature of <= 15°C, what is the maximum allowable exposure time for chilled food during tray assembly before returning to <= 4°C blast chillers?',
        options: ['45 minutes', '4 hours', '8 hours', '24 hours'],
        correctIndex: 0,
        explanation: 'WFSG Airline Catering guidelines limit chilled food exposure in a <= 15°C cold kitchen to a maximum of 45 minutes.'
      }
    ]
  },

  // 14. HACCP Level 4 in Manufacturing
  {
    id: 'tr-int-haccp-level4-manufacturing',
    code: 'HCLM-114',
    title: 'HACCP Level 4 in Manufacturing',
    levelBadge: 'Level 4 Award (RQF Equivalent) · Manufacturing HACCP',
    accreditationStandard: 'UK RQF Level 4 Managing HACCP in Food Manufacturing, Codex CXG 69-2008 & ISO 22000',
    duration: '28 Guided Hours · 5 Modules',
    description:
      'Executive Level 4 Qualification for Industrial HACCP Team Leaders & Lead Auditors: Module 1 (Industrial HACCP Basics, Modular Architecture & ICMSF Equation), Module 2 (Industrial PRPs: EHEDG Sanitary Design, CIP, Zoning & Allergen PRPs), Module 3 (The 12 Steps of HACCP: First 5 Preliminary Steps & P&ID Flow Verification), Module 4 (Principles 1–4: Quantitative Hazard Analysis, 5x5 Risk Matrix, Codex Decision Tree, Critical Limits & Automated SPC Monitoring), and Module 5 (Principles 5–7: Corrective Actions, CXG 69-2008 Validation, How to Audit Industrial HACCP & Global Food Safety Law).',
    modules: [
      {
        title: 'Module 1: Industrial HACCP Basics, Modular Architecture & ICMSF Quantitative Equation (H0 - ΣR + ΣI <= FSO)',
        clause: 'Codex CXC 1-1969 (2022) & ICMSF Book 7 Quantitative Microbiological Risk Assessment',
        overview: 'Mastering Level 4 Industrial HACCP Foundations: why multi-line factories use Modular HACCP Plans, the difference between PRP, OPRP, and CCP under Codex/ISO 22000, and how the ICMSF quantitative equation links raw material hazard levels to final consumer Food Safety Objectives (FSO).',
        principles: [
          'Modular Industrial HACCP Architecture: Large plants separate shared operations (Raw Reception, Water/Air Utilities, CIP, Warehousing) into Core Modules and individual thermal/packaging lines into Process Modules.',
          'ICMSF Quantitative Equation: H0 - ΣR + ΣI <= FSO (where H0 = initial log hazard in raw ingredients, ΣR = cumulative log reductions from pasteurization/retort, ΣI = log growth or recontamination, and FSO = maximum safe log level at consumption).',
          'Surge-tank buffer time and temperature before thermal processing must be strictly controlled to prevent heat-stable Staphylococcus aureus enterotoxin or Bacillus cereus cereulide accumulation.'
        ],
        ccpParam: 'ICMSF Performance Criterion (ΣR) & Surge Tank Hold Limit',
        ccpLimit: 'H0 - ΣR + ΣI <= FSO (>= 5-log or 6-log validated kill) | Max intermediate surge-tank hold time enforced',
        ccpFix: 'Dump or re-evaluate intermediate slurry if line breakdown exceeds validated hold time.',
        checks: [
          'Define quantitative Performance Criteria (ΣR) for every lethal thermal or chemical step.',
          'Appoint a formally qualified Level 4 HACCP Team Leader and Deputy for 24/7 plant coverage.'
        ]
      },
      {
        title: 'Module 2: Industrial Prerequisite Programs (PRPs) — ISO/TS 22002-1, EHEDG Sanitary Engineering, CIP & EMP',
        clause: 'ISO/TS 22002-1 Clauses 4–18, EHEDG Doc. 8 & FDA Pasteurized Milk Ordinance (PMO)',
        overview: 'Establishing industrial Prerequisite Programs (PRPs) before the 12 HACCP steps: positive air pressure zoning (+5 to +15 Pa), EHEDG dead-leg elimination (L/D <= 1.5), CIP turbulence (>= 1.5 m/s), regenerative PHE differential pressure (>= +0.5 bar), and Zones 1–4 Environmental Pathogen Monitoring.',
        principles: [
          'Sanitary Engineering PRPs: Food-contact piping must be AISI 316L stainless steel (Ra <= 0.8 µm) with dead-legs L/D <= 1.5 and CIP velocity >= 1.5 m/s so biofilms cannot form.',
          'Regenerative Plate Heat Exchangers (PHEs) must maintain >= 0.5 bar higher pressure on the pasteurized side than the raw side, and holding tubes require a >= 2% upward slope to eliminate air pockets.',
          'Environmental Monitoring Program (EMP Zones 1–4) swabs for Listeria spp. in wet chilled plants and Salmonella spp. in dry low-moisture factories 3–4 hours into active production.'
        ],
        ccpParam: 'PHE Differential Pressure (>= +0.5 bar), Holding Tube Slope (>= 2%) & CIP Velocity (>= 1.5 m/s)',
        ccpLimit: 'Pasteurized side >= +0.5 bar over raw | Holding tube >= 2.0% upward slope | Zone 1 Listeria/Salmonella: Absent',
        ccpFix: 'Halt line immediately if differential pressure drops below +0.5 bar; strip and deep-clean equipment if Zone 1 swab is positive.',
        checks: [
          'Verify 0.01 micron oil-free filtration on all compressed air contacting food or primary packaging.',
          'Validate allergen changeover cleaning across 3 consecutive runs using protein-specific ELISA swabs (< 5 ppm).'
        ]
      },
      {
        title: 'Module 3: The 12 Steps of HACCP (Part 1) — First 5 Preliminary Steps & Industrial P&ID Flow Verification',
        clause: 'Codex CXC 1-1969 Preliminary Steps 1–5 & ISO 22000:2018 Clause 8.5.1',
        overview: 'Executing the initial 5 Preliminary Steps in an industrial manufacturing plant: Step 1 (Multidisciplinary Engineering/QA/Production Team), Step 2 (Raw & Finished Specs: pH, a_w, Preservatives, Packaging Migration), Step 3 (Intended Use & Vulnerable Groups), Step 4 (Constructing Detailed Process & P&ID Flow Diagrams), and Step 5 (On-Site Multi-Shift Verification).',
        principles: [
          'Step 1 to Step 3: Assemble QA, Process Engineering, Automation/PLC, Production, and R&D; document intrinsic barriers (pH, a_w, gas flush MAP ratio) and food-contact packaging migration compliance (< 10 mg/dm²).',
          'Step 4 (Constructing the Industrial Flow Diagram): Must include every raw material stream, water/culinary steam/compressed air input, balance tank, heat exchanger, divert loop, rework entry point, and waste stream.',
          'Step 5 (On-Site Verification of Flow Diagram): The HACCP Team must physically trace all stainless steel pipelines, diversion valves, and rework loops across Day, Swing, and Night shifts—signing off the verified schematic before starting Principle 1.'
        ],
        ccpParam: 'Step 5 On-Site P&ID / Flow Diagram Verification & Rework Loop Mapping',
        ccpLimit: '100% physical match of Flow Diagram with actual plant piping, divert valves & night-shift rework practices signed by HACCP Team',
        ccpFix: 'Remove any unmapped dead-leg or bypass jumper pipe immediately and re-verify the Flow Diagram prior to Hazard Analysis.',
        checks: [
          'Trace all CIP return lines and product divert lines physically on the factory floor.',
          'Require accredited lab Declaration of Compliance (DoC) for all primary packaging films.'
        ]
      },
      {
        title: 'Module 4: The 7 Principles (Principles 1–4) — Industrial Hazard Analysis, 5x5 Risk Matrix, Codex Decision Tree, Critical Limits & SPC',
        clause: 'Codex Steps 6–9 (Principles 1–4), CXS 193-1995 Contaminants & Statistical Process Control',
        overview: 'Conducting a comprehensive Industrial Hazard Analysis (Biological, Chemical, Process-Induced Acrylamide/Mycotoxins/Antibiotics, Physical & Allergenic), scoring the 5x5 Risk Assessment Matrix, applying the Codex 4-Question CCP Decision Tree, setting Critical vs. Operational Limits, and implementing automated PLC/SPC CCP Monitoring.',
        principles: [
          'Principle 1 — Industrial Hazard Analysis & 5x5 Risk Matrix: Evaluate biological pathogens (C. botulinum, Salmonella, Listeria), chemical contaminants (Aflatoxin M1 <= 0.05–0.5 ppb, Patulin <= 50 ppb, Beta-lactam antibiotics, Acrylamide > 120°C), physical shards (glass, SS 316), and allergens using Likelihood (1–5) x Severity (1–5). Score >= 9 (or Severity = 5) is a Significant Hazard.',
          'Principle 2 — Codex 4-Question CCP Decision Tree: Apply Q1, Q2, Q3, and Q4 systematically to every Significant Hazard (e.g., Raw Milk Antibiotic/Aflatoxin Reception = CCP because no downstream step destroys them [Q4=No]; Raw Milk Salmonella = NOT a CCP at Reception because downstream HTST Pasteurization kills it [Q4=Yes], making Pasteurization the CCP [Q2=Yes]).',
          'Principle 3 & Principle 4 — Critical Limits, Fail-Safe Flow Diversion & SPC Monitoring: Set validated Critical Limits (HTST >= 72°C/15s, Retort F0 >= 3.0 min at 121.1°C, Metal/X-Ray limits) with automated fail-safe Flow Diversion Valves (<= 1s response) and Statistical Process Control (Cpk >= 1.33).'
        ],
        ccpParam: '5x5 Risk Matrix, Codex Decision Tree Q1–Q4, FDV Response (<= 1s) & Process Capability (Cpk >= 1.33)',
        ccpLimit: '100% Significant Hazards passed through Codex Decision Tree | FDV divert <= 1s | SPC Capability Cpk >= 1.33 | Milk ALP < 350 mU/L',
        ccpFix: 'Seal FDV cut-in switches with tamper-evident seals; reject raw milk tankers positive for antibiotics/aflatoxin prior to unloading.',
        checks: [
          'Pass certified Fe, Non-Fe, and SS 316 test spheres through the geometric center of metal/X-ray apertures hourly.',
          'Challenge-test dual reject confirmation photo-eyes and locked reject bin full-sensors every shift.'
        ]
      },
      {
        title: 'Module 5: The 7 Principles (Principles 5–7) — Corrective Actions, CXG 69-2008 Validation, How to Audit HACCP & Global Food Law',
        clause: 'Codex Principles 5–7, CXG 69-2008 Validation, ISO 19011 Auditing & International Food Law',
        overview: 'Mastering Principle 5 (Mass-Balance Quarantine & 5-Why CAPA), Principle 6 (Worst-Case Surrogate Validation under Codex CXG 69-2008 & How to Conduct Vertical Trace HACCP Audits), Principle 7 (Tamper-Proof SCADA/Batch Records), and National/International Law on Manufacturing HACCP.',
        principles: [
          'Principle 5 (Industrial Quarantine & CAPA): Any CCP failure triggers immediate quarantine of 100% of product back to the last passed check, ERP stock-lock, 5-Why Root Cause Analysis, and formal QA/Process Authority disposition.',
          'Principle 6 — Scientific Validation (Codex CXG 69-2008) & How to Audit a HACCP System: Never introduce live pathogens into a factory—use approved non-pathogenic surrogates (Enterococcus faecium NRRL B-2354 or C. sporogenes PA 3679) across 3 worst-case runs. Audit the HACCP system via Vertical Lot Traceability (correlating SCADA charts, operator logs, ISO 17025 calibration certificates, and release sign-offs) and strict Management of Change (MOC) gates.',
          'Principle 7 & Manufacturing HACCP Law: Enforceable by law under US FDA FSMA 21 CFR Part 117 (HARPC) & Part 113 (LACF), EU Regulation 852/2004 Article 5, UK Food Safety Act 1990 (Section 21 Due Diligence), GCC/SFDA/UAE Export Standards, and Pakistan Pure Food Authorities (PFA/KPFA/SFA/BFA) & PSQCA mandatory standards.'
        ],
        ccpParam: 'CXG 69-2008 Surrogate Validation, Vertical Audit Correlation & MOC Gate Compliance',
        ccpLimit: '3 consecutive worst-case validation runs | 100% SCADA vs. paper log match | 100% MOC sign-off prior to any process change',
        ccpFix: 'Halt any unapproved plant trial immediately, quarantine batches lacking MOC sign-off, and notify Certification Body within 3 working days of any Class I recall.',
        checks: [
          'Conduct unannounced night-shift and weekend Vertical HACCP Audits tracing a CCP deviation batch end-to-end.',
          'Maintain a live Export Destination Regulatory, MRL & Mandatory HACCP Law Compliance Matrix.'
        ]
      }
    ],
    questions: [
      {
        q: 'In the ICMSF quantitative microbiological equation (H0 - ΣR + ΣI <= FSO), what does the term "ΣR" represent?',
        options: [
          'Initial contamination level in raw material',
          'The sum of cumulative log reductions achieved by lethal control measures (such as pasteurization or cooking)',
          'Microbial growth during storage',
          'Retail selling price'
        ],
        correctIndex: 1,
        explanation: 'In H0 - ΣR + ΣI <= FSO, H0 is initial hazard level, ΣR is total log reductions, ΣI is total log increases, and FSO is the Food Safety Objective.'
      },
      {
        q: 'When performing an in-plant biological challenge validation of a dry nut roaster to prove a 5-log reduction of Salmonella, why is Enterococcus faecium NRRL B-2354 used instead of live Salmonella?',
        options: [
          'Because live pathogens must NEVER be introduced into an active food factory; Enterococcus faecium NRRL B-2354 is a validated non-pathogenic surrogate with equal or greater thermal resistance',
          'Because Salmonella cannot grow in a laboratory',
          'Because Enterococcus adds flavor to roasted nuts',
          'Because Codex prohibits lab testing'
        ],
        correctIndex: 0,
        explanation: 'Codex CXG 69-2008 strictly forbids introducing live pathogens into food factories; validated non-pathogenic surrogates are used.'
      },
      {
        q: 'In an HTST continuous milk pasteurizer, why must the pasteurized product side of the regenerative Plate Heat Exchanger (PHE) be maintained at a higher pressure (>= 0.5 bar differential) than the incoming raw milk side?',
        options: [
          'To make the milk foam more',
          'So that if a microscopic pinhole or gasket leak develops in a heat-exchanger plate, pasteurized milk leaks into raw milk rather than raw milk contaminating pasteurized milk',
          'To cool the boiler',
          'To dissolve butterfat'
        ],
        correctIndex: 1,
        explanation: 'Positive differential pressure on the pasteurized side ensures any plate pinhole leaks from pasteurized -> raw, protecting finished product safety.'
      },
      {
        q: 'Why must the holding tube of a continuous HTST pasteurizer be engineered with a continuous upward slope of at least 2% (1/4 inch per foot)?',
        options: [
          'To drain milk onto the floor',
          'To eliminate trapped air pockets at the top of the pipe, which would reduce the effective cross-sectional area and accelerate fluid velocity, shortening holding residence time below the 15-second critical limit',
          'To increase acrylamide formation',
          'For visual appearance only'
        ],
        correctIndex: 1,
        explanation: 'Trapped air pockets reduce the pipe’s effective volume, causing milk to shoot through faster than the required 15-second residence time.'
      },
      {
        q: 'Which process-induced chemical contaminant forms via the Maillard reaction between free asparagine and reducing sugars when starchy foods (potatoes, cereals, coffee, biscuits) are baked, roasted, or fried above 120°C?',
        options: ['Aflatoxin M1', 'Acrylamide', 'Melamine', 'Patulin'],
        correctIndex: 1,
        explanation: 'Acrylamide forms naturally from free asparagine and reducing sugars during high-temperature (> 120°C) dry-heat processing of starchy foods.'
      }
    ]
  }
];

const MODULE_STAGE_PREFIXES = [
  'Module 1 (Basics, Core Definitions & Foundations)',
  'Module 2 (Prerequisite Programs - PRPs & Foundational Controls)',
  'Module 3 (Initial Steps 1–5, Process Flow & Operational Setup)',
  'Module 4 (Core Principles, Hazard/Risk Matrix, Decision Tree & Critical Limits)',
  'Module 5 (Corrective Actions, Validation, System Auditing & Regulatory Law)'
];

export const INTERNATIONAL_TRAINING_COURSES: InternationalTrainingCourse[] = COMPACT_COURSES.map((c) => ({
    id: c.id,
    code: c.code,
    title: c.title,
    levelBadge: c.levelBadge,
    accreditationStandard: c.accreditationStandard,
    duration: c.duration,
    certificateFeeRs: 1000,
    passPercentage: 60,
    distinctionPercentage: 75,
    totalExamQuestions: 40,
    description: c.description,
    modules: c.modules.map((m, idx) => {
      const cleanTitle = m.title.replace(/^Module\s*\d+\s*:\s*/i, '');
      const stageLabel = MODULE_STAGE_PREFIXES[idx] || `Module ${idx + 1}`;
      return {
        id: `${c.id}-m${idx + 1}`,
        moduleNumber: idx + 1,
        title: `${stageLabel}: ${cleanTitle}`,
        estimatedMinutes: 85,
        overview: m.overview,
        internationalClauses: [
          m.clause,
          `${c.accreditationStandard} (2024–2026 International Compliance Edition & ISO Climate Amendment Amd 1:2024)`
        ],
        keyPrinciples: [
          ...m.principles,
          `Hazard Analysis, 5x5 Risk Matrix & Decision Tree Application: Evaluate every hazard at this stage using Likelihood (1–5) × Severity (1–5) and apply the 4-Question Codex Decision Tree to determine whether the step is controlled by a PRP, an OPRP, or a CCP (${m.ccpLimit}).`,
          `Operational Limit vs. Critical Limit Control: Establish a stricter internal Operational Limit inside the Critical Limit (${m.ccpLimit}) so operators adjust the process proactively before any safety breach occurs.`,
          `System Auditing & Legal Due Diligence Compliance: Validate "${m.ccpParam}" scientifically prior to production, audit compliance via ISO 19011 vertical trace checks, and retain tamper-proof records to satisfy EU Reg 852/2004, US FDA FSMA, UK Food Safety Act, GCC Municipality, and Pakistan Pure Food Laws.`
        ],
        criticalControlParameters: [
          {
            parameter: m.ccpParam,
            standardLimit: m.ccpLimit,
            correctiveProtocol: m.ccpFix
          },
          {
            parameter: `Instrument Calibration & Metrology Verification (${cleanTitle})`,
            standardLimit:
              '100% ISO/IEC 17025 traceable calibration + daily reference check (0.0°C ± 0.5°C ice-point / certified test piece / pH buffer)',
            correctiveProtocol:
              'Withdraw out-of-tolerance gauge immediately, tag "DO NOT USE", and retrospectively evaluate all batches measured since the last passed calibration check.'
          },
          {
            parameter: 'Real-Time Record Integrity & Legal Due Diligence Sign-Off',
            standardLimit:
              '100% real-time timestamped entries with zero correction fluid ("whitener") and zero pre-filled ("dry-labbed") shift logs',
            correctiveProtocol:
              'Quarantine unverified production lots, retrain staff on legal Due Diligence documentation rules, and implement supervisor shift-handover countersignature.'
          }
        ],
        practicalChecklist: [
          ...m.checks,
          `Verify that operators on Day, Swing, and Night shifts can verbally state the exact Critical Limit (${m.ccpLimit}) and demonstrate the emergency quarantine procedure.`,
          `Audit the last 30 days of "${m.ccpParam}" monitoring records, calibration certificates, and CAPA close-out reports for 100% traceability within ≤ 4 hours.`
        ]
      };
    }),
    coreExamPool: c.questions
  }));

/**
 * Generates a full 40-question course-specific international examination.
 */
export function get40CourseExamQuestions(courseId: string): CourseExamMCQ[] {

  const course =
    INTERNATIONAL_TRAINING_COURSES.find((c) => c.id === courseId) ||
    INTERNATIONAL_TRAINING_COURSES[0];

  const generated: Array<{
    q: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  }> = [];

  for (const item of course.coreExamPool) {
    generated.push(item);
  }

  for (const mod of course.modules) {
    for (const ccp of mod.criticalControlParameters) {
      generated.push({
        q: `In ${course.title} (${mod.title}), what is the required international standard limit for "${ccp.parameter}"?`,
        options: [
          ccp.standardLimit,
          'No limit is required unless a customer complains',
          'Visual inspection once every 6 months without documentation',
          'Operate at ambient room condition without calibration'
        ],
        correctIndex: 0,
        explanation: `For ${ccp.parameter}, the international standard limit is: ${ccp.standardLimit}. Corrective protocol: ${ccp.correctiveProtocol}`
      });

      generated.push({
        q: `During an operational check in ${course.title}, if "${ccp.parameter}" breaches its standard limit (${ccp.standardLimit}), what is the mandatory corrective protocol?`,
        options: [
          'Continue production and note it at the end of the month',
          ccp.correctiveProtocol,
          'Delete the monitoring log entry so auditors do not see it',
          'Ship the batch immediately under a discount label'
        ],
        correctIndex: 1,
        explanation: `When ${ccp.parameter} deviates from ${ccp.standardLimit}, the mandatory action is: ${ccp.correctiveProtocol}`
      });
    }

    for (let i = 0; i < mod.keyPrinciples.length; i++) {
      const principle = mod.keyPrinciples[i];
      generated.push({
        q: `According to Module ${mod.moduleNumber} (${mod.title}) of ${course.title}, which of the following technical statements is compliant with international standards?`,
        options: [
          principle,
          'Documentation and calibration are optional during night shifts',
          'Quarantined non-conforming batches can be blended into retail packs without safety evaluation',
          'Sanitizers are effective on heavily greased surfaces without pre-cleaning'
        ],
        correctIndex: 0,
        explanation: principle
      });
    }

    for (let i = 0; i < mod.practicalChecklist.length; i++) {
      const checkItem = mod.practicalChecklist[i];
      generated.push({
        q: `When auditing ${mod.title} under ${course.title}, which operational verification practice is mandatory?`,
        options: [
          'Skip verification whenever production targets are high',
          'Allow uncalibrated instruments if they look new',
          checkItem,
          'Sign all daily checklists one week in advance'
        ],
        correctIndex: 2,
        explanation: `Mandatory operational checklist requirement: ${checkItem}`
      });
    }

    if (mod.internationalClauses.length > 0) {
      generated.push({
        q: `Which international standard or regulatory benchmark governs "${mod.title}" in the ${course.title} curriculum?`,
        options: [
          mod.internationalClauses[0],
          'Unregulated informal kitchen custom',
          'Automobile emissions standard ISO 16750',
          'Textile dyeing specification only'
        ],
        correctIndex: 0,
        explanation: `${mod.title} is governed by ${mod.internationalClauses.join('; ')}.`
      });
    }
  }

  const otherCourses = INTERNATIONAL_TRAINING_COURSES.filter((c) => c.id !== course.id);
  for (const other of otherCourses) {
    if (generated.length >= 40) break;
    for (const item of other.coreExamPool) {
      if (generated.length >= 40) break;
      generated.push(item);
    }
  }

  const final40: CourseExamMCQ[] = generated.slice(0, 40).map((item, idx) => {
    const targetCorrectSlot = (idx * 3 + course.code.charCodeAt(0)) % 4;
    const opts = [...item.options] as [string, string, string, string];
    const currentCorrect = item.correctIndex;
    if (currentCorrect !== targetCorrectSlot) {
      const temp = opts[targetCorrectSlot];
      opts[targetCorrectSlot] = opts[currentCorrect];
      opts[currentCorrect] = temp;
    }
    return {
      id: `${course.id}-q-${idx + 1}`,
      questionNumber: idx + 1,
      question: item.q,
      options: opts,
      correctIndex: targetCorrectSlot,
      explanation: item.explanation
    };
  });

  return final40;
}

export const INITIAL_INTERNATIONAL_TRAININGS: HubTraining[] = INTERNATIONAL_TRAINING_COURSES.map((c) => ({
  id: c.id,
  category: 'International Certification',
  title: c.title,
  standardCode: c.code,
  subType: c.levelBadge,
  description: c.description,
  duration: c.duration,
  fees: `Free Study & Exam · Rs. ${c.certificateFeeRs.toLocaleString()} Certificate Download`,
  enrollLink: `https://wa.me/923008429104?text=${encodeURIComponent(
    `Assalam-o-Alaikum, I want to verify/unlock my certificate for ${c.title} (${c.code}).`
  )}`,
  isActive: true
}));
