import { HubTraining } from '../types/hub';
import {
  CourseExamMCQ,
  InternationalTrainingCourse
} from './internationalTrainingsData';

export const HACCP_LEVEL_03_VISUAL_COURSE: InternationalTrainingCourse = {
  id: 'cert-2026-haccp-level-03',
  code: 'HACCP-L3',
  title: 'HACCP Level 03',
  levelBadge: 'Visual Interactive Course (15 Modules · SOPs, 12-Step Docs & Drills · 40 MCQs)',
  accreditationStandard: 'Codex Alimentarius CXC 1-1969 • Supervising HACCP Level 03 Standard',
  duration: '15 Interactive Modules (PRPs, 12-Step Docs & Drills) + 40-MCQ Final Exam',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Comprehensive supervisory HACCP Level 03 certification featuring custom visual diagrams, interactive Prerequisite Programme (PRP) floor SOP procedures, sample controlled document forms for all 12 Codex HACCP steps, interactive Germometer, Hazard Classifier & Decision Trees, and a 40-MCQ final exam.',
  modules: [
    // =========================================================================
    // MODULE 1
    // =========================================================================
    {
      id: 'haccp3-v-mod-1',
      moduleNumber: 1,
      title: 'Module 1: Introduction to Supervising HACCP & Role of Supervisors',
      estimatedMinutes: 25,
      overview:
        'Meet your course facilitator, understand the Codex Alimentarius definition of HACCP, explore why preventive process control replaces end-product sampling, and clarify supervisory floor accountability.',
      internationalClauses: ['Codex Alimentarius CXC 1-1969 (2022 Rev.)', 'ISO 22000 Overview'],
      keyPrinciples: [
        'HACCP is a proactive, preventive science-based system that controls food safety hazards before defects reach consumers.',
        'Supervisors bridge written food safety policies and daily factory or kitchen execution through coaching, monitoring, calibration checks, and corrective sign-off.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Preventive Process Control',
          standardLimit: 'Monitor critical food-safety limits continuously or per batch before product dispatch',
          correctiveProtocol: 'Quarantine affected output immediately and investigate process deviations before release.'
        }
      ],
      practicalChecklist: [
        'Verify your team understands that HACCP prevents hazards rather than testing finished goods after dispatch.',
        'Map how your current facility or kitchen role links to daily monitoring and corrective verification.'
      ],
      quickCheck: {
        question: 'Why does Codex HACCP prioritise real-time process control over finished-product microbiological lab sampling alone?',
        options: [
          'Microbiological sampling inspects only a tiny fraction of stock retrospectively, whereas HACCP controls hazards continuously before dispatch',
          'Laboratory swabbing is strictly illegal in food factories under Codex guidelines',
          'Finished-product testing only detects physical metal fragments and cannot test for bacteria',
          'HACCP eliminates the need for thermometer calibration, cleaning schedules, and staff hygiene rules'
        ],
        correctIndex: 0,
        explanation: 'Spot lab tests can easily miss sporadic pathogen pockets and results arrive too late; HACCP controls critical steps continuously during production.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Course Facilitator & Supervisory Learning Path',
          subtitle: 'Interactive Supervisory HACCP Architecture — Food Science Portal',
          visualIllustration: 'instructor-profile',
          trainerCard: {
            name: 'Muneeb Khan, M.Sc (Hons.) Food Science & Technology',
            credential: 'Lead Auditor (FSSC 22000 · ISO 22000 · ISO 9001 · PSQCA Halal) & Industry Trainer',
            experience: '10+ Years QA/QC & Manufacturing',
            specialties: [
              'Codex HACCP Design',
              'Thermal & Dairy Validation',
              'Catering & Factory Audits',
              'Regulatory Compliance (PFA/PSQCA/SFDA)'
            ],
            introNote:
              'Welcome to HACCP Level 03 — engineered with step-by-step Prerequisite Programme SOPs, sample controlled documents for all 12 Codex steps, interactive safety drills, and applied supervision checklists.'
          },
          bulletPoints: [
            'Combines food microbiology science with real shop-floor supervisory duties across kitchens, bakeries, dairy lines, and packaging facilities.',
            'Structured across 15 progressive modules covering Hazards, interactive PRP Procedures, all 12 Codex Document Templates, and Exam Mastery.',
            'Built for QA/QC Supervisors, Line Leaders, Head Chefs, Shift Managers, and Food Technology graduates.'
          ],
          keyTakeaway:
            'Supervisory HACCP turns international Codex standards into clear, verifiable daily shop-floor actions.'
        },
        {
          slideNumber: 2,
          title: 'What Is HACCP & Why Supervisors Matter',
          subtitle: 'Preventive Science Over End-Product Guesswork',
          calloutBanner: {
            label: 'Codex Alimentarius Definition',
            text: 'HACCP (Hazard Analysis and Critical Control Point) is a systematic, science-based system that identifies, evaluates, and controls hazards which are significant for food safety from primary production to final consumption.',
            tone: 'blue'
          },
          bulletPoints: [
            'Origins: Developed by Pillsbury, NASA, and the US Army to guarantee 100% pathogen-free astronaut rations without destroying lots via destructive lab testing.',
            'Supervisor Responsibility: Coach operators on limits, verify thermometer calibration, check daily logs for accuracy, and authorise immediate hold/corrective actions.',
            'Food Safety Culture: Lead by example — wear full PPE, inspect handwashing, and escalate deviations promptly instead of hiding delays.'
          ],
          practicalExample:
            'Testing 5 random cooked chicken breasts out of 5,000 gives false security; confirming every batch reached ≥ 75°C thermal core guarantees lethality across 100% of production.',
          keyTakeaway:
            'HACCP stops foodborne illness before food leaves the site by controlling critical steps during processing.'
        }
      ]
    },

    // =========================================================================
    // MODULE 2
    // =========================================================================
    {
      id: 'haccp3-v-mod-2',
      moduleNumber: 2,
      title: 'Module 2: Food Safety Hazards, Microbiology & High-Risk Foods',
      estimatedMinutes: 35,
      overview:
        'Classify Microbiological, Physical, Chemical, and Allergenic hazards, explore the interactive Germometer Danger Zone, and distinguish High-Risk vs Low-Risk foods.',
      internationalClauses: ['Codex Hazard Classification', 'FATTOM Microbial Growth Model'],
      keyPrinciples: [
        'Every food safety hazard fits into four distinct groups: Microbiological, Physical, Chemical, and Allergenic.',
        'Pathogenic bacteria multiply rapidly between 5°C and 63°C (peaking around 37°C) via binary fission when food, moisture, time, and near-neutral pH align.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Temperature Danger Zone Control',
          standardLimit: 'Cold food ≤ 5°C · Hot food ≥ 63°C · Poultry core lethality ≥ 75°C',
          correctiveProtocol: 'Assess cumulative time spent between 5°C and 63°C; discard perishable lots abused beyond 2 hours.'
        }
      ],
      practicalChecklist: [
        'Train line staff to recognise biological, physical, chemical, and allergenic hazards at every workstation.',
        'Monitor time-in-ambient-zone strictly during preparation and cooling.'
      ],
      quickCheck: {
        question: 'Between which temperatures does the pathogenic bacterial "Danger Zone" occur where binary fission multiplication accelerates rapidly?',
        options: [
          '-18°C to 0°C',
          '5°C to 63°C',
          '65°C to 90°C',
          '75°C to 100°C'
        ],
        correctIndex: 1,
        explanation: 'Bacteria multiply rapidly between 5°C and 63°C (especially around 37°C). Keep food chilled ≤ 5°C or hot ≥ 63°C.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'The Four Food Safety Hazard Categories',
          subtitle: 'Biological Threats, Foreign Objects, Chemicals & 14 Major Allergens',
          visualIllustration: 'four-hazards',
          bulletPoints: [
            'Microbiological: Pathogenic bacteria (Salmonella, Listeria, E. coli O157), viruses (Norovirus, Hepatitis A), parasites, and mycotoxin-producing moulds.',
            'Physical: Hard or sharp foreign items causing choking or laceration — glass, metal swarf, brittle plastic, stones, bone splinters, jewellery.',
            'Chemical: Excess sanitisers, boiler additives, pesticide residues, heavy metals, or food-grade lubricants leaking from bearings.',
            'Allergenic: Immunological food proteins (peanuts, tree nuts, milk, egg, fish, crustacea, molluscs, soy, wheat/gluten, sesame, celery, mustard, lupin, sulphites >10 ppm).'
          ],
          classifierDrill: [
            {
              item: 'Blue waterproof plaster found inside chilled potato salad',
              category: 'Physical',
              reason: 'Foreign object posing choking/contamination risk even though it is visually detectable.'
            },
            {
              item: 'Quaternary ammonium sanitiser residue left on a stainless slicing blade',
              category: 'Chemical',
              reason: 'Excess cleaning chemical transferring into ready-to-eat sliced meats.'
            },
            {
              item: 'Undeclared almond flour cross-contacted into a nut-free brownie batch',
              category: 'Allergenic',
              reason: 'Tree nuts can trigger fatal anaphylaxis even in milligram trace amounts.'
            },
            {
              item: 'Salmonella Enteritidis surviving inside undercooked meringue',
              category: 'Microbiological',
              reason: 'Living pathogenic bacterium capable of causing severe enteric infection.'
            }
          ],
          keyTakeaway:
            'Every hazard analysis worksheet must examine Microbiological, Physical, Chemical, and Allergenic threats per step.'
        },
        {
          slideNumber: 2,
          title: 'Bacterial Multiplication, Spores & The Germometer',
          subtitle: 'Interactive Temperature Guide from -18°C to +100°C',
          visualIllustration: 'microbe-spore',
          germometerInteractive: true,
          bulletPoints: [
            'Binary Fission: Between 20°C and 50°C, bacteria divide every 10–20 minutes — reaching hazardous numbers within hours.',
            'Spores vs Toxins: Clostridium perfringens and Bacillus cereus form tough endospores surviving 100°C boiling and germinating during slow cooling; Staphylococcus aureus produces heat-stable toxins.',
            'Six FATTOM Drivers: Food (protein), Acidity (pH > 4.5), Time, Temperature (5°C–63°C), Oxygen, and Moisture (Aw > 0.85).'
          ],
          keyTakeaway:
            'Cooking kills vegetative cells, freezing only pauses them, and rapid chilling prevents surviving spores from germinating.'
        },
        {
          slideNumber: 3,
          title: 'High-Risk vs Low-Risk Foods',
          subtitle: 'Why Ready-to-Eat Moisture & Protein Require Strict Supervision',
          twoColumns: {
            leftTitle: 'High-Risk Foods (Strict Cold/Hot Control)',
            leftTone: 'rose',
            leftItems: [
              'Ready-to-eat cooked poultry, meat stews, and meat pies',
              'Cooked rice and pasta held warm or cooled slowly (Bacillus cereus risk)',
              'Dairy creams, cheesecakes, custard desserts, and soft unripened cheeses',
              'Peeled cooked prawns, smoked salmon, and mayonnaise sandwiches'
            ],
            rightTitle: 'Low-Risk Foods (Stable at Ambient)',
            rightTone: 'emerald',
            rightItems: [
              'Dry biscuits, uncooked pasta, flour, sugar, and roasted nuts (Low Aw)',
              'Pickles, chutneys, and vinegars (High Acidity / Low pH < 4.2)',
              'High-sugar jams, salted cured snacks, and cooking oils',
              'Unopened commercially sterilised canned soups and UHT cartons'
            ]
          },
          highLowRiskDrill: [
            {
              food: 'Boiled basmati rice left uncovered on a kitchen counter for 4 hours',
              risk: 'High-Risk',
              reason: 'High moisture + neutral pH allows Bacillus cereus spores to germinate and emit emetic toxin.'
            },
            {
              food: 'Sealed jars of mango vinegar pickle (pH 3.3)',
              risk: 'Low-Risk',
              reason: 'High acidity inhibits pathogen growth at ambient storage temperature.'
            },
            {
              food: 'Sliced roast turkey platter ready for buffet service',
              risk: 'High-Risk',
              reason: 'High protein, high moisture, ready-to-eat with zero further cooking step.'
            },
            {
              food: 'Dry uncooked wholewheat macaroni in sealed sacks',
              risk: 'Low-Risk',
              reason: 'Very low water activity (Aw < 0.60) prevents bacterial multiplication.'
            }
          ],
          bulletPoints: [
            'High-risk foods share four traits: high protein, high moisture (Aw > 0.85), near-neutral pH, and Ready-to-Eat status with no downstream cooking.',
            'Low-risk foods inhibit pathogens via high acidity (pH < 4.2), low moisture (dry grains/flour), high salt/sugar, or sealed commercial sterility.'
          ],
          keyTakeaway:
            'High-risk foods are moist, protein-rich, ready-to-eat items that support pathogen growth and receive no further cooking.'
        }
      ]
    },

    // =========================================================================
    // MODULE 3 (UPGRADED WITH STEP-BY-STEP PRP SOP PROCEDURES!)
    // =========================================================================
    {
      id: 'haccp3-v-mod-3',
      moduleNumber: 3,
      title: 'Module 3: Prerequisite Programmes (PRPs) & Floor SOP Procedures',
      estimatedMinutes: 35,
      overview:
        'Explore how Prerequisite Programmes form the structural foundation under HACCP and step through exact shop-floor Standard Operating Procedures (Cleaning, Personal Hygiene, Pest Control, Supplier Intake & Maintenance/Traceability).',
      internationalClauses: ['Codex CXC 1-1969 Sec 1 (GHP)', 'ISO/TS 22002-1 Prerequisite Programmes'],
      keyPrinciples: [
        'PRPs control general facility hygiene and environmental risks so HACCP can concentrate on process-specific CCPs.',
        'Every PRP must follow a clear, repeatable Standard Operating Procedure (SOP) showing steps, tolerances, responsible roles, and verification records.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Approved Supplier Intake Temperature',
          standardLimit: 'Chilled ≤ 5°C (Target ≤ 4°C) · Frozen ≤ -18°C · Clean pest-free vehicle',
          correctiveProtocol: 'Reject warm or damaged deliveries at the bay and log a Supplier Non-Conformance Report.'
        }
      ],
      practicalChecklist: [
        'Walk through the 6-Step Wet Cleaning SOP and verify sanitiser contact time on line benches.',
        'Check daily pre-op inspection logs for handwashing sinks, pest glue boards, and glass/brittle plastic register.'
      ],
      quickCheck: {
        question: 'In a 6-Step Wet Cleaning & Disinfection SOP (SSOP), why must detergent residue be rinsed BEFORE applying chemical disinfectant?',
        options: [
          'Remaining food soil and soap films neutralise disinfectant activity, preventing full microbial log reduction on surfaces',
          'Washing with warm detergent followed by disinfectant automatically creates toxic ozone gas',
          'Disinfectants are designed to remove thick baked-on grease before detergent touches the stainless surface',
          'Rinsing is only necessary once per quarter prior to external supplier audits'
        ],
        correctIndex: 0,
        explanation: 'Organic grease and detergent residue deactivate quaternary ammonium or chlorine sanitisers; rinsing ensures clean surface contact for lethality.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'PRPs: The Load-Bearing Foundation of HACCP',
          subtitle: 'Why Cleaning, Hygiene, Pest Control & Engineering Come First',
          visualIllustration: 'prp-foundation',
          bulletPoints: [
            'Good Manufacturing & Hygiene Practices (GMP/GHP): General environmental barriers applied plant-wide prior to specific HACCP CCP selection.',
            'Avoiding CCP Overload: Attempting HACCP without working PRPs turns every broom, drain, and doorway into an unmanageable fake CCP.',
            'Key PRP Pillars: Structural layout, potable water, Cleaning & Disinfection (SSOP), Integrated Pest Management (IPM), Personal Hygiene, Approved Suppliers, Maintenance, Glass/Allergen Control & Traceability.'
          ],
          keyTakeaway:
            'Strong PRPs control 80%+ of baseline environmental hazards, keeping the formal HACCP plan sharp and focused.'
        },
        {
          slideNumber: 2,
          title: 'How PRPs Operate Live — Interactive Step-by-Step SOPs',
          subtitle: 'Click Each PRP Tab to Inspect Exact Floor Execution Steps & Verification Logs',
          prpProceduresBlock: [
            {
              prpCode: 'PRP-01',
              prpName: 'Cleaning & Disinfection (6-Step SSOP)',
              objective: 'Eliminate soil, allergen traces, and pathogens from food-contact equipment without leaving chemical residue.',
              steps: [
                'Step 1 — Dry Pre-Clean: Scrape, sweep, and remove loose food debris and packaging off production tables.',
                'Step 2 — Pre-Rinse: Flush surfaces with warm potable water (40°C–50°C) to loosen soluble fats and sugars.',
                'Step 3 — Detergent Wash: Scrub with food-safe alkaline/neutral detergent using colour-coded brushes for biofilm removal.',
                'Step 4 — Inter-Rinse: Wash away lifted soils and spent detergent thoroughly using clean potable water.',
                'Step 5 — Disinfection: Spray or immerse with validated sanitiser (e.g., 200 ppm QAC / Chlorine) observing full 5–10 min contact time.',
                'Step 6 — Final Rinse & Dry: Rinse off non-no-rinse sanitisers, squeegee dry, and complete visual + ATP/micro swab check before line start-up.'
              ],
              verificationRecord: 'Daily Pre-Op Hygiene Sign-Off Sheet (Form SAN-01) + Weekly ATP Bioluminescence / Microbiological Swab Log.'
            },
            {
              prpCode: 'PRP-02',
              prpName: 'Personal Hygiene, PPE & Handwashing',
              objective: 'Prevent food handlers from transferring Staphylococcus, Norovirus, hair, or foreign items into exposed food.',
              steps: [
                'Step 1 — Health Screen: Exclude operators with vomiting/diarrhoea until symptom-free for ≥ 48 hours; cover minor cuts with bright blue detectable plasters.',
                'Step 2 — Garment Sequence: Put on hairnet/snood (tucking all hair), then clean dedicated factory coat (no outside pockets/buttons), then captive work boots.',
                'Step 3 — 20-Second Handwash: Wet hands with warm water, lather antibacterial unscented soap over palms, backs, thumbs, fingertips, and wrists for ≥ 20 seconds, rinse, dry with single-use paper towel, and use towel to close tap if non-sensor.',
                'Step 4 — Zero Jewellery & Habits: Remove watches, rings (except plain wedding band if facility policy permits), nail polish, and prohibit eating/smoking in food bays.'
              ],
              verificationRecord: 'Daily Supervisor Grooming Audit + Return-to-Work Medical Fitness Form (Form HYG-04) + Hand-Swab Verification.'
            },
            {
              prpCode: 'PRP-03',
              prpName: 'Integrated Pest Management (IPM)',
              objective: 'Deny pest entry, harbourage, and food sources while detecting any early activity without chemical taint.',
              steps: [
                'Step 1 — Structural Proofing: Seal external gaps > 3mm, install bristles on dock doors, fit 16-mesh screens on open vents, and mesh-cover drains.',
                'Step 2 — External Defence Perimeter: Place locked tamper-resistant rodent bait boxes around outer fences and building walls on an indexed site map.',
                'Step 3 — Internal Non-Toxic Monitoring: Use non-toxic snap/glue pheromone monitors indoors (NO loose rodenticide bait inside open food halls) and position shatter-proof UV glue-board fly killers ≥ 2m away from open food lines.',
                'Step 4 — Stock Rotation & Housekeeping: Keep stored pallets 45cm clear off walls ("inspection perimeter") and clear external weeds/waste skips daily.'
              ],
              verificationRecord: 'Numbered Pest Bait Station Map + Monthly Biologist Trend Report & Action Close-Out Log (Form IPM-02).'
            },
            {
              prpCode: 'PRP-04',
              prpName: 'Approved Suppliers & Intake Control',
              objective: 'Stop substandard, contaminated, mislabelled, or temperature-abused raw materials before entering factory storage.',
              steps: [
                'Step 1 — Pre-Approval Vetting: Audit GFSI/ISO certificates, allergen controls, and micro Certificates of Analysis (COAs) before adding supplier to ASL.',
                'Step 2 — Purchase Specifications: Contract exact ingredient parameters (Aw, pH, pathogen absence, max pesticide residue, intact primary packaging).',
                'Step 3 — Intake Vehicle Check: Inspect lorry floor cleanliness, pest signs, allergen segregation, and intact security seals on arrival.',
                'Step 4 — Thermal Probe & Lot Logging: Measure between-pack chilled (≤ 5°C) or frozen (≤ -18°C) core temperature, check minimum shelf-life, tag Hold/Reject any failures, and assign Goods-In Traceability Lot Code.'
              ],
              verificationRecord: 'Approved Supplier Register + Goods-In Inspection & Rejection Log (Form REC-01) + Supplier CAPA.'
            },
            {
              prpCode: 'PRP-05',
              prpName: 'Maintenance, Glass Register & 4-Hr Traceability',
              objective: 'Prevent equipment metal/glass debris and ensure 100% forward/backward batch recall readiness within 4 hours.',
              steps: [
                'Step 1 — Hygiene Clearance Post-Repair: Engineers clear every loose screw, nut, wire clipping, and metal swarf using tool-count checks and sign equipment back over to QA sanitation before restart.',
                'Step 2 — Food-Grade H1 Lubricants & Glass Register: Ban fragile glass/ceramic in production areas; inspect unavoidable sight glasses/UV sleeves per shift on the Glass & Brittle Plastic Audit.',
                'Step 3 — Forward & Backward Traceability Link: Link Intake Supplier Lot → Mixing Batch ID → Primary Pack Code → Customer Dispatch Invoice.',
                'Step 4 — Timed Mock Recall: Twice yearly test complete mass-balance reconciliation (accounting for 99.5%–100% of suspect batch) within ≤ 4 hours.'
              ],
              verificationRecord: 'Engineering Hygiene Clearance Log + Glass/Plastic Register (Form ENG-03) + Timed 4-Hr Mock Recall Dossier.'
            }
          ],
          bulletPoints: [
            'Selecting each PRP tab above demonstrates the exact floor sequence, responsibilities, and signed verification records expected during external audits.',
            'PRPs are audited daily via pre-op checklists so issues are caught before production lines go live.'
          ],
          keyTakeaway:
            'A PRP only protects consumers when documented as a clear step-by-step SOP and proven with daily signed logs.'
        },
        {
          slideNumber: 3,
          title: 'Approved Supplier Controls & Intake Inspection Visual',
          subtitle: 'Stopping Hazards at the Loading Bay Door',
          visualIllustration: 'approved-supplier',
          bulletPoints: [
            'Gatekeeper Discipline: Never bypass goods-in inspection during busy shifts — defective raw materials contaminate whole finished production days.',
            'Lot Coding at Receipt: Assign unique intake lot numbers immediately so full 1-up / 1-down traceability works during recalls.'
          ],
          practicalExample:
            'If chilled raw cream arrives at 8.5°C with crushed outer boxes, isolate and reject the lot immediately at goods-in rather than relying on downstream pasteurisation to erase heat-stable toxins.',
          keyTakeaway:
            'Safe finished products demand approved suppliers, clean transport, verified temperatures, and intact seals at receipt.'
        }
      ]
    },

    // =========================================================================
    // MODULE 4
    // =========================================================================
    {
      id: 'haccp3-v-mod-4',
      moduleNumber: 4,
      title: 'Module 4: Legal Obligations, Due Diligence & Business Value',
      estimatedMinutes: 20,
      overview:
        'Connect international food hygiene legislation, statutory Due Diligence legal defence, and tangible operational ROI alongside implementation hurdles.',
      internationalClauses: ['Codex General Principles', 'Statutory Due Diligence Standards'],
      keyPrinciples: [
        'Food business operators are legally obliged to establish, implement, maintain, and document permanent procedures based on the 7 HACCP principles.',
        'Accurate contemporaneous HACCP records establish a Due Diligence defence proving all reasonable precautions were taken.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Statutory Record Availability',
          standardLimit: '100% up-to-date signed HACCP plans, monitoring sheets, and training matrices ready for unannounced inspection',
          correctiveProtocol: 'Immediately close missing sign-off gaps via daily supervisor end-of-shift folder checks.'
        }
      ],
      practicalChecklist: [
        'Confirm staff training matrices and allergen specifications match active menus/SKUs.',
        'Ensure calibration, CCP, and corrective action binders/tablets are available across all shifts.'
      ],
      quickCheck: {
        question: 'In food safety law, what objective evidence establishes a statutory "Due Diligence" defence following a customer complaint?',
        options: [
          'Written company marketing brochures claiming strict kitchen hygiene',
          'Verbal promises from shift leaders that staff follow cleaning rules',
          'Dated, signed operational records (CCP logs, calibration, training, supplier COAs) proving all reasonable precautions were executed',
          'Deleting older production records after 7 days to keep binders tidy'
        ],
        correctIndex: 2,
        explanation: 'Courts and inspectors require contemporaneous, signed objective records demonstrating proactive preventive control before any incident occurred.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Legal Mandates & The Due Diligence Defence',
          subtitle: 'Turning Regulatory Compliance Into Measurable Brand Protection',
          calloutBanner: {
            label: 'Due Diligence Legal Principle',
            text: 'If a foodborne illness investigation or prosecution occurs, a business can only mount a Due Diligence defence by proving with dated, signed evidence that it took all reasonable precautions and exercised all due diligence to prevent the defect.',
            tone: 'amber'
          },
          twoColumns: {
            leftTitle: 'Strategic Business Benefits',
            leftTone: 'emerald',
            leftItems: [
              'Sharp reduction in product recalls, rework scrap, and complaints',
              'Preferred supplier approval from retailers, airlines & export buyers',
              'Consistent batch quality and stronger insurance/legal protection',
              'Clear shift accountability and proactive food safety culture'
            ],
            rightTitle: 'Common Implementation Hurdles',
            rightTone: 'blue',
            rightItems: [
              'Initial floor resistance and fear of extra clipboard paperwork',
              'Capital cost of calibrated digital probes, chillers & structural repairs',
              'Language or literacy barriers among seasonal temporary operators',
              'Temptation to buy generic off-the-shelf plans not tailored to site flow'
            ]
          },
          bulletPoints: [
            'Food hygiene regulations legally mandate permanent written procedures grounded in Codex HACCP principles.',
            'Visible executive commitment and clear operator training transform compliance hurdles into routine operational savings.'
          ],
          keyTakeaway:
            'Documented HACCP is both a statutory mandate and the single strongest safeguard against catastrophic recalls.'
        }
      ]
    },

    // =========================================================================
    // MODULE 5 (CONTAINS SAMPLE DOCUMENTS FOR CODEX STEPS 1, 2 & 3!)
    // =========================================================================
    {
      id: 'haccp3-v-mod-5',
      moduleNumber: 5,
      title: 'Module 5: Codex Steps 1–3 & Actual Controlled Document Templates',
      estimatedMinutes: 35,
      overview:
        'See exact controlled document templates used in real food factories for Codex Step 1 (Assemble HACCP Team), Step 2 (Describe Product), and Step 3 (Identify Intended Use & Vulnerable Consumers).',
      internationalClauses: ['Codex Steps 1–3', 'Codex 12-Step Logic Sequence'],
      keyPrinciples: [
        'The 12-Step Codex sequence consists of 5 Preliminary Preparation Steps (Steps 1–5) followed by the 7 HACCP Principles (Steps 6–12).',
        'Every Preliminary Step produces a signed, version-controlled document before moving to Step 6 Hazard Analysis.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Vulnerable Consumer Declaration (Step 3)',
          standardLimit: 'Explicitly identify Infants, Elderly, Pregnant Women, and Immunocompromised consumers (YOPI)',
          correctiveProtocol: 'Tighten microbiological criteria, Listeria limits, and allergen controls wherever YOPI consumers are served.'
        }
      ],
      practicalChecklist: [
        'Inspect how your site documents Step 1 Team Charter, Step 2 Product Profile, and Step 3 Intended Use.',
        'Verify form numbers, revision dates, and cross-functional signatures are complete.'
      ],
      quickCheck: {
        question: 'Why must Maintenance Engineering and Production Supervisors sit alongside QA inside the Codex Step 1 HACCP Team?',
        options: [
          'Only finance clerks need to join HACCP teams once a year',
          'Engineering and Production spot real pipe dead-legs, thermal cold spots, and monitoring feasibility that a solo QA writer misses',
          'Codex requires outside university professors to approve every daily recipe edit',
          'Including engineers eliminates the need for Step 4 Process Flow Diagrams'
        ],
        correctIndex: 1,
        explanation: 'A multidisciplinary team combines food microbiology science with real machine capability, engineering failure modes, and shift operability.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'The Complete 12-Step Codex Sequence & Step 1 Team Document',
          subtitle: 'How Codex Step 1 ("Assemble HACCP Team") Is Documented in Real Facilities',
          visualIllustration: 'codex-12-steps',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-01',
            version: 'Rev 03 · 2026',
            codexStepLabel: 'Codex Step 1 Document',
            docTitle: 'Multidisciplinary HACCP Team & Scope Terms of Reference',
            purpose: 'Establish trained cross-functional ownership and define exact facility lines, product families, and hazard categories (M/P/C/A) covered.',
            fields: [
              { label: 'Scope / Product Group', value: 'Chilled Ready-to-Eat Cooked Poultry & Pasta Meals (Line 02)' },
              { label: 'Boundary (Start → End)', value: 'Raw Intake Loading Bay → Chilled Customer Dispatch Dock' },
              { label: 'Hazard Scope Covered', value: 'Microbiological, Physical, Chemical & Allergenic (14 Allergens)' },
              { label: 'Standard Reference', value: 'Codex Alimentarius CXC 1-1969 / ISO 22000:2018' }
            ],
            tablePreview: {
              headers: ['Team Role', 'Named Member', 'Qualification / Competence', 'HACCP Study Responsibility'],
              rows: [
                ['Team Leader (QA Mgr)', 'Sana Tariq', 'M.Sc Food Tech · HACCP L3/L4 · Lead Auditor', 'Chairs study, document version control & verification'],
                ['Production Lead', 'Bilal Ahmed', '8 yrs High-Care Processing Supervision', 'Confirms line flows, shift delays & operator checks'],
                ['Chief Engineer', 'Kamran Raza', 'B.E. Mechanical · Thermal/Metal Systems', 'Advises oven/chiller tolerances & calibration tolerances'],
                ['Hygiene Lead', 'Nadia Iqbal', 'CIP / Allergen Clean Validation Specialist', 'Validates changeover SSOPs & environmental swab maps']
              ]
            },
            signOffLine: 'Approved by Plant Director & HACCP Team Leader · Next Scheduled Annual Review: 12 Months'
          },
          bulletPoints: [
            'Never let a single QA clerk write the HACCP manual in isolation — auditors specifically inspect team meeting minutes and engineering sign-off.',
            'Terms of Reference define upfront whether packaging, transport, or vulnerable populations lie inside the study scope.'
          ],
          keyTakeaway:
            'Codex Step 1 starts with a signed, multidisciplinary Team Charter defining exact scope and technical competence.'
        },
        {
          slideNumber: 2,
          title: 'Step 2 Document: Complete Product Description Sheet',
          subtitle: 'How Codex Step 2 Captures Intrinsic Safety Factors, Packaging & Shelf-Life',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-02',
            version: 'Rev 02 · 2026',
            codexStepLabel: 'Codex Step 2 Document',
            docTitle: 'Product Safety Description & Intrinsic Barrier Profile',
            purpose: 'Document formulation, intrinsic physicochemical hurdles (pH, Aw, preservatives), packaging atmosphere, and validated shelf-life so Hazard Analysis identifies which pathogens can survive or multiply.',
            fields: [
              { label: 'Product Name / SKU', value: 'Chilled Herb Roast Chicken Pasta Salad (250g MAP Tray)' },
              { label: 'Composition & Processing Aids', value: 'Roast chicken breast (35%), cooked durum pasta, yoghurt-herb dressing, spinach, canola oil, salt, mixed herbs' },
              { label: 'Declared Allergens', value: 'WHEAT (Gluten), MILK (Yoghurt), MUSTARD (Dressing) — Highlighted Bold on Label' },
              { label: 'Intrinsic Barriers (pH & Aw)', value: 'Composite pH 4.9 – 5.3 · Water Activity (Aw) 0.97 (High-Risk moist matrix; no intrinsic kill)' },
              { label: 'Packaging Specification', value: 'Food-grade rPET/EVOH tray, heat-sealed barrier film, Modified Atmosphere (30% CO₂ / 70% N₂)' },
              { label: 'Storage, Shelf-Life & Labelling', value: 'Keep Refrigerated 0°C to +5°C · Validated Use-By: Day +4 from pack · Eat within 24h of opening' }
            ],
            signOffLine: 'Prepared by NPD & QA Technologist · Validated by Micro Lab Shelf-Life Dossier #SL-2026-08'
          },
          bulletPoints: [
            'Intrinsic pH and Water Activity tell microbiologists immediately whether pathogens like Clostridium botulinum, Listeria monocytogenes, or Salmonella can multiply.',
            'Accurate allergen declarations in Step 2 drive changeover cleaning rules downstream.'
          ],
          keyTakeaway:
            'Step 2 translates a recipe into quantitative food safety parameters (pH, Aw, allergens, MAP gas, shelf-life).'
        },
        {
          slideNumber: 3,
          title: 'Step 3 Document: Intended Use & Vulnerable Consumer Assessment',
          subtitle: 'How Codex Step 3 Defines Consumer Handling, Cooking Needs & YOPI Risk',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-03',
            version: 'Rev 02 · 2026',
            codexStepLabel: 'Codex Step 3 Document',
            docTitle: 'Intended Use & Target Consumer Vulnerability Specification',
            purpose: 'Confirm how the end consumer prepares or eats the product and whether High-Risk Vulnerable groups (YOPI) will be exposed.',
            fields: [
              { label: 'Consumption State', value: 'Ready-to-Eat (RTE) Cold directly from tray — NO further consumer heating or cooking!' },
              { label: 'Target Consumer Channels', value: 'Supermarket Chilled Retail, Corporate Canteens & Hospital Catering Contracts' },
              { label: 'Vulnerable (YOPI) Exposure?', value: 'YES — Supplied to Elderly Care Wards & Maternity Units (Listeria monocytogenes zero-tolerance target!)' },
              { label: 'Reasonably Foreseeable Misuse', value: 'Consumer leaves tray in warm car bag for 2–3 hrs or eats 1 day past printed Use-By date' },
              { label: 'Mitigation via Label & Control', value: 'Strict chilled blast-chill ≤ 5°C + Conservative Use-By (Day +4 instead of Day +6) + Bold "KEEP CHILLED ≤ 5°C"' }
            ],
            signOffLine: 'Reviewed by Commercial Sales, Medical Catering Liaison & HACCP Team Leader'
          },
          bulletPoints: [
            'Ready-to-Eat hospital food has far stricter microbiological tolerance than raw uncooked flour or meat consumers will boil.',
            'Always account for foreseeable consumer misuse when setting shelf-life buffers and warning labels.'
          ],
          keyTakeaway:
            'Step 3 answers "Will it be cooked later?" and "Who eats it?" — directly shaping downstream CCP strictness.'
        }
      ]
    },

    // =========================================================================
    // MODULE 6 (STEPS 4 & 5 FLOW DIAGRAMS + WALK-THROUGH VERIFICATION DOCUMENT)
    // =========================================================================
    {
      id: 'haccp3-v-mod-6',
      moduleNumber: 6,
      title: 'Module 6: Process Flow Diagrams & On-Site Verification (Steps 4 & 5)',
      estimatedMinutes: 30,
      overview:
        'Build complete Step 4 multi-stream flow diagrams and execute the Codex Step 5 On-Site Walk-Through Verification Document across live production shifts.',
      internationalClauses: ['Codex Steps 4 & 5', 'On-Site Process Confirmation'],
      keyPrinciples: [
        'Every raw intake, secondary ingredient stream, holding delay, rework loop, packaging entry, and waste exit must be numbered on the Flow Diagram.',
        'Step 5 mandates physically walking the active line across all shifts to sign off that paper matches shop-floor reality before Principle 1 starts.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Step 5 Floor Walk Confirmation',
          standardLimit: '100% live shift confirmation signed and dated prior to Hazard Analysis and after any layout change',
          correctiveProtocol: 'Pause Hazard Analysis and redraw Step 4 immediately if unmapped rework loops or staging delays are spotted.'
        }
      ],
      practicalChecklist: [
        'Confirm day, afternoon, and night shift variations are walked during Step 5.',
        'Verify every box on Form HACCP-DOC-04 carries a clear sequential step number.'
      ],
      quickCheck: {
        question: 'During a Step 5 On-Site Flow Diagram walk-through, the team notices operators holding cooked pasta bins at room temperature for 45 minutes — a step missing from the drawing. What must happen?',
        options: [
          'Update the Flow Diagram immediately to add the ambient staging step and include it in Step 6 Hazard Analysis',
          'Ignore the 45-minute wait because dry pasta never requires refrigeration',
          'Delete the entire cooking step from the chart to keep paperwork under one page',
          'Wait twelve months until next year’s scheduled annual review before updating the paper'
        ],
        correctIndex: 0,
        explanation: 'Hidden holding delays often allow spore germination. Step 5 exists precisely to capture real floor steps before Hazard Analysis begins.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Step 4 Document: Multi-Stream Process Flow Chart',
          subtitle: 'Mapping Main Flow, Converging Ingredient Streams & CCP Markers',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-04',
            version: 'Rev 04 · 2026',
            codexStepLabel: 'Codex Step 4 Document',
            docTitle: 'Controlled Multi-Stream Process Flow Chart (Line 02 — Poultry Pasta Salad)',
            purpose: 'Provide a sequential numbered blueprint covering all ingredient streams, utilities (water/air/MAP gas), thermal steps, rework, and packaging lines.',
            fields: [
              { label: 'Scope Covered', value: 'Steps 01 through 07 + Pasta/Dressing Sub-Stream & Primary Packaging Stream' },
              { label: 'Utilities / Side Inputs', value: 'Potable Cold Water, Filtered Compressed Air, Food-Grade CO₂/N₂ Gas' }
            ],
            signOffLine: 'Drafted by Process Engineer · Pending On-Site Step 5 Shift Verification'
          },
          flowDiagramData: {
            title: 'Live Step 4 Visual Map: Main Poultry Stream + Secondary Streams',
            isMultiStream: true,
            mainSteps: [
              { step: 'Step 1: Raw Chilled Chicken Intake', note: 'Approved supplier COA + core ≤ 5°C' },
              { step: 'Step 2: Chilled Raw Storage', note: 'Dedicated raw bay 0°C – 4°C' },
              { step: 'Step 3: Oven Roasting (Heat Kill)', note: 'Core ≥ 75°C instantaneous', isCcp: true },
              { step: 'Step 4: Blast Chilling', note: 'Cool 75°C → ≤ 5°C within 90 min', isCcp: true },
              { step: 'Step 5: High-Care Assembly & Dressing Mix', note: 'Ambient room ≤ 10°C; strict allergen segregation' },
              { step: 'Step 6: MAP Sealing & Inline Metal Detection', note: 'Calibrated Fe / Non-Fe / SS rejection', isCcp: true },
              { step: 'Step 7: Chilled Storage & Dispatch', note: 'Maintain ≤ 5°C through retail delivery' }
            ],
            secondarySteps: [
              {
                step: 'Sub-Stream A: Pasta Cook + Rapid Cool + Yoghurt Dressing',
                note: 'Joined hygienically at Step 5',
                joinAtIndex: 4
              },
              {
                step: 'Sub-Stream B: Primary rPET Trays & Allergen Labels',
                note: 'Artwork & barcode verify at Step 6',
                joinAtIndex: 5
              }
            ]
          },
          bulletPoints: [
            'Numbered boxes link directly to Hazard Analysis rows (Step 1 → Row 1, Step 3 → Row 3) for effortless auditing.',
            'Include side inputs (steam, brine, ice, nitrogen gas, packaging) and rework loops so no contamination path goes unexamined.'
          ],
          keyTakeaway:
            'If a process delay, water rinse, or rework path exists on the floor, it MUST have a numbered box on your Step 4 Flow Diagram.'
        },
        {
          slideNumber: 2,
          title: 'Step 5 Document: On-Site Physical Flow Verification Record',
          subtitle: 'Signed Shift-by-Shift Audit Proof Before Hazard Analysis Starts',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-05',
            version: 'Rev 01 · 2026',
            codexStepLabel: 'Codex Step 5 Document',
            docTitle: 'On-Site Process Flow Diagram Verification & Sign-Off Log',
            purpose: 'Document physical floor walk observations across day, night, and sanitation shifts proving Form HACCP-DOC-04 matches reality.',
            fields: [
              { label: 'Audit Walk Date / Time', value: 'Day Shift (09:30) + Night Sanitation/Run (23:15)' },
              { label: 'Verification Method', value: 'Physical walk Step 01 → Step 07 carrying printed DOC-04 clipboard' },
              { label: 'Discrepancy Found?', value: 'YES — Night crew staged dressed trays 25 min on ambient trolley (Corrected: trolley moved inside 8°C chill buffer & added to Step 5)' },
              { label: 'Final Alignment Status', value: '100% Match Confirmed After Flow Chart Revision 04' }
            ],
            tablePreview: {
              headers: ['Verification Check Item', 'Shift Checked', 'Observed Reality', 'Signed By'],
              rows: [
                ['Raw vs High-Care segregation barriers intact', 'Day & Night', 'Pass — separate boot change & airlock observed', 'Sana T. / Bilal A.'],
                ['All water, gas, spice & tray sub-streams shown', 'Day Shift', 'Pass — CO₂/N₂ & allergen sleeve scan matched', 'Kamran R.'],
                ['Waste bins & reject rework routing mapped', 'Night Shift', 'Pass — locked red waste exit confirmed', 'Nadia I.']
              ]
            },
            signOffLine: 'Verified & Authorised by Full HACCP Team Prior to Principle 1 (Hazard Analysis)'
          },
          bulletPoints: [
            'Never sign Step 5 from a boardroom chair — walk during actual night runs when fatigue shortcuts typically appear.',
            'Any factory layout tweak, conveyor speed increase, or new ingredient triggers an immediate Step 5 re-verification.'
          ],
          keyTakeaway:
            'Step 5 converts your flow chart from an engineer’s theory into a legally verified, shift-tested operational blueprint.'
        }
      ]
    },

    // =========================================================================
    // MODULE 7 (STEP 6 / PRINCIPLE 1A: HAZARD ANALYSIS WORKSHEET DOCUMENT)
    // =========================================================================
    {
      id: 'haccp3-v-mod-7',
      moduleNumber: 7,
      title: 'Module 7: Hazard Analysis Document & Risk Scoring (Codex Step 6 / P1A)',
      estimatedMinutes: 30,
      overview:
        'Execute Principle 1: score Risk quantitatively using the Interactive 3×3 Matrix and see how Codex Step 6 is recorded on an official Hazard Analysis Worksheet.',
      internationalClauses: ['Codex Principle 1 (Step 6)', 'Quantitative Risk Evaluation'],
      keyPrinciples: [
        'Principle 1 identifies every reasonably expected M/P/C/A hazard per numbered step and evaluates Likelihood × Severity.',
        'Significant Hazards (Risk Score ≥ 6, or rare-but-fatal hazards like botulism/anaphylaxis) proceed to targeted controls and CCP evaluation.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Significant Hazard Threshold',
          standardLimit: '3×3 Risk Score ≥ 6 (or High Severity = 3 requiring explicit PRP/OPRP/CCP control justification)',
          correctiveProtocol: 'Re-score hazards whenever recalls, outbreak trends, or formulation edits shift baseline risk.'
        }
      ],
      practicalChecklist: [
        'Name specific biological/physical/chemical agents — never write generic terms like "bugs" or "dirt".',
        'Document the scientific justification for every Likelihood and Severity score.'
      ],
      quickCheck: {
        question: 'On a 3×3 Risk Assessment Matrix (Likelihood 1–3 × Severity 1–3), how must a hazard scoring Likelihood = 1 (Rare) but Severity = 3 (Fatal, e.g. Botulism or undeclared Peanut) be handled?',
        options: [
          'Delete it permanently from the spreadsheet because the overall score is only 3',
          'Treat high-severity fatal hazards seriously with explicit verified controls (e.g. vacuum barrier or allergen segregation) rather than ignoring them',
          'Reclassify the hazard as a cosmetic packaging defect under marketing review',
          'Wait until a confirmed fatality happens twice before upgrading its likelihood to 3'
        ],
        correctIndex: 1,
        explanation: 'Rare but lethal hazards (anaphylactic allergens, Clostridium botulinum) can never be dismissed solely on low frequency; dedicated controls are mandatory.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Step 6 Document: Hazard Analysis Worksheet & Risk Matrix',
          subtitle: 'Principle 1A — How Codex Step 6 Scores Hazards Step-by-Step',
          riskMatrixHighlight: true,
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-06',
            version: 'Rev 03 · 2026',
            codexStepLabel: 'Codex Step 6 / Principle 1 Document',
            docTitle: 'Step-by-Step Hazard Analysis & Quantitative Risk Scoring Sheet',
            purpose: 'Evaluate every process step from Form DOC-04 across all 4 hazard classes (M/P/C/A) using Likelihood (1–3) × Severity (1–3) = Risk Score.',
            fields: [
              { label: 'Risk Formula Applied', value: 'Risk = Likelihood (1=Rare, 2=Possible, 3=Likely) × Severity (1=Minor, 2=Illness, 3=Fatal)' },
              { label: 'Significance Cut-Off', value: 'Score ≥ 6 (or Severity = 3) moves to Control Selection & Step 7 CCP Tree' }
            ],
            tablePreview: {
              headers: ['Flow Step', 'Specific Hazard & Cause', 'Type', 'L × S = Score', 'Control / PRP Action'],
              rows: [
                ['01. Raw Chicken Intake', 'Salmonella / Campylobacter carried on raw meat', 'M', '3 × 3 = 9 (Sig.)', 'COA + Chilled intake ≤ 5°C; killed later at Step 03'],
                ['03. Oven Roasting', 'Salmonella survival if oven cool spot < 75°C', 'M', '2 × 3 = 6 (Sig.)', 'Core cook ≥ 75°C + probe every batch → Test Q1–Q4'],
                ['05. Salad Assembly', 'Undeclared Milk / Mustard residue on table', 'A', '2 × 3 = 6 (Sig.)', 'Allergen-free first schedule + validated SSOP wet clean'],
                ['06. Inline Metal Check', 'Slicer blade metal fragment inside tray', 'P', '2 × 3 = 6 (Sig.)', 'Calibrated Metal Detector (2.0 Fe / 2.5 SS) → Test Q1–Q4']
              ]
            },
            signOffLine: 'Completed by Full Multidisciplinary HACCP Team · Cross-checked against Flow Chart DOC-04'
          },
          bulletPoints: [
            'Hazard vs Risk: A Hazard is the harmful agent itself (Salmonella, glass shard, peanut); Risk is Likelihood × Severity combined.',
            'Documenting WHY a hazard is scored Low vs High gives clear transparency during regulatory or GFSI audits.'
          ],
          keyTakeaway:
            'Form HACCP-DOC-06 links every flow step to specific hazards, transparent risk scores, and targeted control measures.'
        }
      ]
    },

    // =========================================================================
    // MODULE 8
    // =========================================================================
    {
      id: 'haccp3-v-mod-8',
      moduleNumber: 8,
      title: 'Module 8: Matching Targeted Control Measures (Principle 1B)',
      estimatedMinutes: 25,
      overview:
        'Select scientifically proven Control Measures to prevent, eliminate, or reduce each significant Biological, Physical, Chemical, and Allergenic hazard.',
      internationalClauses: ['Codex Principle 1B', 'Targeted Control Mapping'],
      keyPrinciples: [
        'One control measure (e.g. ≥ 75°C roasting) can eliminate multiple vegetative pathogens, whereas physical/allergen hazards demand dedicated non-thermal barriers.',
        'Heat cooking destroys living vegetative cells — it does NOT eliminate glass, metal, caustic detergent, or allergen proteins.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Allergen Cross-Contact Control',
          standardLimit: 'Allergen-free runs FIRST, validated wet-clean + swab before changeover, and 100% label barcode scan',
          correctiveProtocol: 'Quarantine packed trays immediately if a label mismatch or incomplete clean is suspected.'
        }
      ],
      practicalChecklist: [
        'Verify every significant hazard from Step 6 has an active physical, chemical, or thermal barrier assigned.',
        'Confirm sieve inspection logs and detergent rinse checks are executed daily.'
      ],
      quickCheck: {
        question: 'If peanut butter cross-contacts into a nut-free cookie batter prior to baking at 195°C for 18 minutes, what happens to the allergen risk?',
        options: [
          'The 195°C oven sterilises and destroys 100% of peanut protein allergens completely',
          'Allergenic peanut proteins are heat-stable and remain fully dangerous after baking — the batch must be treated as containing peanut',
          'Passing sealed boxes through a metal detector automatically removes all allergen traces',
          'Chilling the baked cookies below 4°C permanently neutralises allergenic proteins'
        ],
        correctIndex: 1,
        explanation: 'Food allergen proteins survive normal baking, frying, and boiling unchanged; only strict segregation and validated changeover cleaning prevent allergen hazards.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Matching Control Measures to Biological, Physical, Chemical & Allergen Hazards',
          subtitle: 'Principle 1B — Targeted Preventative Controls Table',
          tableBlock: {
            caption: 'Hazard-to-Control Selection Matrix (Prevent · Eliminate · Reduce)',
            headers: ['Hazard Class', 'Factory / Kitchen Hazard Example', 'Targeted Control Measure Selected'],
            rows: [
              ['Microbiological (Vegetative)', 'Salmonella & Campylobacter in roast poultry', 'Core roast ≥ 75°C (or validated 70°C × 2 min)'],
              ['Microbiological (Spores)', 'Clostridium perfringens outgrowth during cooling', 'Blast chill 75°C → ≤ 5°C in ≤ 90 min using shallow pans'],
              ['Physical Foreign Body', 'Stainless steel mesh wire or blade fragment', 'Daily 1.5mm sieve check + Calibrated Metal Detector / X-Ray'],
              ['Chemical Residue', 'CIP caustic soda or QAC left on filler manifold', 'Automated conductivity rinse interlock + final pH strip verify'],
              ['Allergenic Cross-Contact', 'Milk/Peanut transfer onto allergen-free SKU', 'Run allergen-free FIRST + validated wet clean + barcode label check']
            ]
          },
          bulletPoints: [
            'Prevent: Approved suppliers, clean hands, intact pest screens.',
            'Eliminate: Core cooking ≥ 75°C, inline metal rejection, sterile commercial retorting.',
            'Reduce to Safe Level: Chlorine produce wash, pasteurisation log-reduction, rapid blast chilling.'
          ],
          keyTakeaway:
            'Choose controls that match the hazard mechanism — thermal cooking never fixes physical metal, chemical sanitisers, or allergens.'
        }
      ]
    },

    // =========================================================================
    // MODULE 9 (STEP 7 / PRINCIPLE 2: CCP DETERMINATION DOCUMENT & DECISION TREE)
    // =========================================================================
    {
      id: 'haccp3-v-mod-9',
      moduleNumber: 9,
      title: 'Module 9: Determining CCPs & Document Template (Codex Step 7 / P2)',
      estimatedMinutes: 35,
      overview:
        'Apply both the Interactive Codex 4-Question Decision Tree and Simplified 3-Question Decision Tree, and inspect how Codex Step 7 is documented on an auditable CCP Determination Sheet.',
      internationalClauses: ['Codex Principle 2 (Step 7)', 'Codex CCP Decision Tree'],
      keyPrinciples: [
        'A CCP is a step where control can be applied and is essential to prevent, eliminate, or reduce a hazard to a safe acceptable level.',
        'If a later processing step will reliably eliminate the hazard (Q4 = Yes), the current step is managed as a PRP/CP rather than a CCP.'
      ],
      criticalControlParameters: [
        {
          parameter: 'True CCP Focus Rule',
          standardLimit: 'Reserve CCP status strictly for critical steps where loss of control creates unacceptable safety harm without downstream fix',
          correctiveProtocol: 'Reclassify baseline hygiene chores back into PRPs to prevent operator monitoring fatigue.'
        }
      ],
      practicalChecklist: [
        'Trace each significant hazard from DOC-06 cleanly through Q1 → Q2 → Q3 → Q4.',
        'Record Yes/No decisions with brief justification in Form HACCP-DOC-07.'
      ],
      quickCheck: {
        question: 'Under the Codex 4-Question Decision Tree, raw chicken cold receiving (≤ 5°C) precedes a validated ≥ 75°C oven roasting step later in the kitchen. Why is cold receiving NOT classified as a CCP for Salmonella?',
        options: [
          'Because chilled temperatures freeze and achieve a permanent 6-log kill on Salmonella at intake',
          'Because Q4 = Yes — the subsequent validated ≥ 75°C roasting step eliminates Salmonella to a safe level',
          'Because raw poultry never carries pathogenic bacteria prior to packaging',
          'Because Codex forbids placing any temperature checks at factory loading bays'
        ],
        correctIndex: 1,
        explanation: 'Under Question 4 of the Codex Decision Tree, when a later process step eliminates the hazard reliably, the earlier step is controlled via PRPs rather than a CCP.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Step 7 Document: Codex 4-Question Decision Tree & Determination Log',
          subtitle: 'Principle 2 — Interactive Tree + Controlled Audit Worksheet',
          visualIllustration: 'ccp-tree-codex',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-07',
            version: 'Rev 02 · 2026',
            codexStepLabel: 'Codex Step 7 / Principle 2 Document',
            docTitle: 'CCP Decision Tree Determination Record (Line 02)',
            purpose: 'Document exact Yes/No answers across Codex Q1–Q4 for every significant hazard so auditors see objective proof why steps became CCPs or PRPs.',
            fields: [
              { label: 'Decision Model Used', value: 'Codex Alimentarius 4-Question CCP Decision Tree' },
              { label: 'Total CCPs Identified', value: '3 Focused CCPs (Roasting, Blast Chill, Metal Detection)' }
            ],
            tablePreview: {
              headers: ['Step & Hazard', 'Q1 Control?', 'Q2 Eliminates?', 'Q3 Increases?', 'Q4 Later Step?', 'Outcome'],
              rows: [
                ['01. Raw Chicken Cold Intake (Salmonella)', 'YES', 'NO', 'YES', 'YES (Step 03)', 'PRP (Intake Check)'],
                ['03. Oven Roasting ≥ 75°C (Salmonella)', 'YES', 'YES', '—', '—', 'CCP-1 (Kill Step)'],
                ['04. Blast Chill ≤ 5°C (Cl. perfringens)', 'YES', 'NO', 'YES', 'NO (Ready-to-Eat)', 'CCP-2 (Chill Step)'],
                ['06. Inline Metal Check (Metal Swarf)', 'YES', 'YES', '—', '—', 'CCP-3 (Final Barrier)']
              ]
            },
            signOffLine: 'Reviewed by HACCP Team Leader · Aligned with Form HACCP-DOC-06'
          },
          bulletPoints: [
            'Use the interactive scenario selector above to trace why Cooked Chicken Oven Roasting becomes a CCP while Raw Receiving does not.',
            'Every external auditor inspects Form DOC-07 to ensure CCPs were derived logically, not guessed arbitrarily.'
          ],
          keyTakeaway:
            'Q2 = Yes OR (Q3 = Yes and Q4 = No) confirms a step as a true Critical Control Point.'
        },
        {
          slideNumber: 2,
          title: 'Simplified 3-Question Decision Tree & Avoiding CCP Overload',
          subtitle: 'Streamlined Catering Logic Without Checkbox Fatigue',
          visualIllustration: 'ccp-tree-simple',
          bulletPoints: [
            'Simplified 3 Questions: Useful for restaurants and multi-menu catering teams — Hazard present? Control exists? Any later kill step before service?',
            'Danger of Too Many CCPs: Marking 25 minor floor hygiene tasks as CCPs causes operator monitoring fatigue and hollow form signing.',
            'Focused Protection: Concentrate intensive batch logging, calibration, and hold tags strictly on your 2 to 5 critical steps.'
          ],
          keyTakeaway:
            'Less is stronger — fewer, true CCPs receive 100% genuine daily operator focus.'
        }
      ]
    },

    // =========================================================================
    // MODULE 10 (STEP 8 / PRINCIPLE 3: CRITICAL LIMITS DOCUMENT)
    // =========================================================================
    {
      id: 'haccp3-v-mod-10',
      moduleNumber: 10,
      title: 'Module 10: Critical Limits, Target Levels & Spec Sheet (Codex Step 8 / P3)',
      estimatedMinutes: 30,
      overview:
        'Establish objective, measurable Critical Limits alongside proactive Target Levels and Tolerances, documented inside a validated Critical Limit Specification Sheet.',
      internationalClauses: ['Codex Principle 3 (Step 8)', 'CXG 69-2008 Limit Validation'],
      keyPrinciples: [
        'Critical Limits separate acceptable safe food from unacceptable unsafe food using measurable values (Temp, Time, pH, Aw, Metal mm).',
        'Target Levels sit strictly inside the safe side of Critical Limits, creating an early operational warning buffer.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Measurable Numerical Boundary',
          standardLimit: 'Zero subjective criteria ("cook until brown") — exact calibrated numeric figures required',
          correctiveProtocol: 'Replace ambiguous words with validated time, temperature, pH, or test-piece standards.'
        }
      ],
      practicalChecklist: [
        'Verify every CCP clearly states both an internal Target Level and an absolute Critical Limit.',
        'File supporting regulations or laboratory validation reports alongside DOC-08.'
      ],
      quickCheck: {
        question: 'Why does a supervisor set a Chiller Target Level of 1°C–3°C (alert at 4°C) when the statutory Critical Limit is ≤ 5.0°C?',
        options: [
          'Target alerts give engineers an early safety buffer to adjust defrost cycles BEFORE product crosses the unsafe 5.0°C legal boundary',
          'Target limits let plants legally ship spoiled food at 9°C without notifying QA supervisors',
          'Setting a target eliminates any requirement to calibrate chiller probe sensors',
          'Target temperatures sterilise meat allergens inside plastic trays'
        ],
        correctIndex: 0,
        explanation: 'Operational Target Levels trigger adjustment prior to failure, saving expensive quarantine waste and protecting food safety.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Step 8 Document: Critical Limits, Target Levels & Validation Schedule',
          subtitle: 'Principle 3 — Objective Safety Boundaries Documented Clearly',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-08',
            version: 'Rev 02 · 2026',
            codexStepLabel: 'Codex Step 8 / Principle 3 Document',
            docTitle: 'Validated Critical Limits, Operational Targets & Tolerances Schedule',
            purpose: 'Specify exact measurable boundaries, early-warning operational targets, and scientific validation sources for every CCP.',
            fields: [
              { label: 'Subjective Limit Rule', value: 'Strictly PROHIBITED ("looks done", "feels cold") — numeric probes/strips mandatory' },
              { label: 'Scientific Validation Basis', value: 'Codex CXC 1-1969 + FSA 6-Log Thermal Lethality + 3-Batch Oven Heat Study' }
            ],
            tablePreview: {
              headers: ['CCP Step', 'Target Operating Aim', 'Tolerance / Early Alert', 'Critical Limit (Hard Boundary)'],
              rows: [
                ['CCP-1: Oven Roasting', '78°C core centre', 'Re-adjust if 75.5°C – 76°C', '≥ 75°C instantaneous (or ≥ 70°C × 2 min)'],
                ['CCP-2: Blast Chilling', '≤ 3°C in 75 min', 'Split trays at 80 min if > 4°C', '75°C → ≤ 5.0°C within ≤ 90 minutes'],
                ['CCP-3: Metal Detection', '1.5 Fe / 2.0 NFe / 2.0 SS', 'Test hourly wands every pass', 'Must reject 2.0mm Fe / 2.5mm NFe / 2.5mm SS'],
                ['Hot Holding (Catering)', '68°C – 72°C centre', 'Turn element up if < 65°C', '≥ 63.0°C continuously']
              ]
            },
            signOffLine: 'Scientifically Validated & Approved by QA Lead + Production Director'
          },
          bulletPoints: [
            'Critical Limit = Legal Red Line: Any reading breaching this boundary triggers immediate batch Hold & Corrective Action.',
            'Tolerance Band = Operator Trigger: Alerts line leaders early before food becomes compromised.'
          ],
          keyTakeaway:
            'Operate strictly to Target Levels so your process never reaches the legal Critical Limit edge.'
        }
      ]
    },

    // =========================================================================
    // MODULE 11 (STEP 9 / PRINCIPLE 4: MONITORING & CALIBRATION LOG SHEET)
    // =========================================================================
    {
      id: 'haccp3-v-mod-11',
      moduleNumber: 11,
      title: 'Module 11: Monitoring System, Calibration & Floor Log (Codex Step 9 / P4)',
      estimatedMinutes: 30,
      overview:
        'Design practical CCP monitoring procedures (What, How, Where, When, Who), enforce 0°C/100°C probe calibration, and review a live Step 9 CCP Monitoring Sheet.',
      internationalClauses: ['Codex Principle 4 (Step 9)', 'Instrument Calibration Standards'],
      keyPrinciples: [
        'Monitoring must deliver rapid live feedback while stock is still under facility control.',
        'Every monitoring instruction defines the 5 Ws/Hs: What, How, Where (cold/warm spot), Frequency, and Named Owner.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Thermometer Accuracy Band',
          standardLimit: '0.0°C ± 0.5°C in crushed ice-water slurry; 100.0°C ± 0.5°C in rolling boiling water',
          correctiveProtocol: 'Remove and tag any probe drifting > ±0.5°C/±1.0°C; audit recent readings made with that probe.'
        }
      ],
      practicalChecklist: [
        'Check live operator probing technique during shifts — verify probe sanitising wipes are used every time.',
        'Watch for robotic pre-filled logs ("pencil-whipping") during supervisory floor audits.'
      ],
      quickCheck: {
        question: 'When checking a handheld digital food thermometer inside a 50/50 crushed ice and potable water slurry, which reading confirms acceptable calibration?',
        options: [
          '-4.0°C to -2.5°C',
          '-0.5°C to +0.5°C',
          '+3.0°C to +5.0°C',
          '+10.0°C to +12.0°C'
        ],
        correctIndex: 1,
        explanation: 'Equilibrium ice-water always sits at 0.0°C; food-safety digital probes must verify within ±0.5°C (or facility calibration tolerance).'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Step 9 Document: CCP Monitoring Sheet & Thermometer Calibration',
          subtitle: 'Principle 4 — Live Monitoring Form Design & Ice/Boil Verification',
          visualIllustration: 'thermometer-calibration',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-09',
            version: 'Rev 05 · 2026',
            codexStepLabel: 'Codex Step 9 / Principle 4 Document',
            docTitle: 'Daily Oven Cooking (CCP-1) & Probe Calibration Monitoring Log',
            purpose: 'Capture live, time-stamped numeric measurements in permanent ink proving every production batch met validated Critical Limits.',
            fields: [
              { label: 'Critical Limit Printed on Form', value: 'Roast Chicken Core Temperature ≥ 75.0°C (Thickest Thermal Centre)' },
              { label: 'Method & Frequency', value: 'Calibrated Probe #TH-04 sanitised with alcohol wipe · Every Single Batch' }
            ],
            tablePreview: {
              headers: ['Batch ID', 'Probe Time', 'Core Temp (°C)', 'Pass / Fail', 'Operator Initials', 'QA Verify'],
              rows: [
                ['CHK-2611-A', '08:42 AM', '78.4°C', 'PASS', 'M.A.', 'ST ✓'],
                ['CHK-2611-B', '10:15 AM', '77.1°C', 'PASS', 'M.A.', 'ST ✓'],
                ['CHK-2611-C', '11:50 AM', '68.5°C → Re-cook 79.2°C', 'DEV → PASS', 'M.A. (CAPA #19)', 'ST ✓']
              ]
            },
            signOffLine: 'Daily Ice-Slurry Calibration Check Recorded at 07:30 AM: 0.1°C (PASS) · No Pencil-Whipping Permitted'
          },
          bulletPoints: [
            'Notice realistic natural decimals (78.4°C, 77.1°C) rather than fake copied numbers ("75.0°C" repeated identically).',
            'Short periodic intervals limit quarantine losses: if checks run hourly and 14:00 fails, only 1 hour of production since 13:00 goes on Hold.'
          ],
          keyTakeaway:
            'Print the exact Critical Limit and immediate escalation rule right on top of Form DOC-09 so operators never guess under pressure.'
        }
      ]
    },

    // =========================================================================
    // MODULE 12 (STEP 10 / PRINCIPLE 5: CORRECTIVE ACTION & QUARANTINE CAPA FORM)
    // =========================================================================
    {
      id: 'haccp3-v-mod-12',
      moduleNumber: 12,
      title: 'Module 12: Corrective Actions & CAPA Form (Codex Step 10 / P5)',
      estimatedMinutes: 25,
      overview:
        'Execute dual-stage Corrective Actions when limits fail and review an authentic Codex Step 10 Non-Conformance, Hold Tag & 5-Why Root Cause CAPA document.',
      internationalClauses: ['Codex Principle 5 (Step 10)', 'Non-Conforming Product Disposition'],
      keyPrinciples: [
        'Corrective Action = (1) Immediate Product Hold/Disposition + Process Restoration, AND (2) 5-Why Root Cause Elimination.',
        'Pre-defined rules allow operators to quarantine product immediately without waiting for management approval.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Quarantine & Disposition Scope',
          standardLimit: 'Apply Red Hold Tag to 100% of suspect lot back to last good check; release/condemn only via signed QA disposition',
          correctiveProtocol: 'Never silently blend failed batches into compliant stock.'
        }
      ],
      practicalChecklist: [
        'Inspect quarantine cage locks and Red Hold Tags during daily facility walks.',
        'Audit closed CAPA forms for genuine root-cause engineering/training fixes.'
      ],
      quickCheck: {
        question: 'An inline metal detector fails its 14:00 hourly test-wand pass after passing normally at 13:00. What batch scope MUST be quarantined immediately?',
        options: [
          'Only the final three retail packs sitting directly inside the tunnel at 14:00',
          'All production packed between 13:00 (last confirmed good pass) and 14:00 must be isolated and re-screened through a repaired detector',
          'Continue packing normally until shift end at 17:00 before calling engineering',
          'Discard the outer cardboard boxes while shipping internal plastic trays immediately'
        ],
        correctIndex: 1,
        explanation: 'With periodic hourly checks, failure could have begun at 13:01 — every pack made since the last passed 13:00 check is suspect until re-screened.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Step 10 Document: CCP Deviation, Quarantine Hold & 5-Why CAPA Form',
          subtitle: 'Principle 5 — Containment + Root-Cause Prevention Documented',
          visualIllustration: 'corrective-action',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-10',
            version: 'Rev 02 · 2026',
            codexStepLabel: 'Codex Step 10 / Principle 5 Document',
            docTitle: 'CCP Deviation, Quarantine Disposition & Root Cause Report (#CAPA-19)',
            purpose: 'Track affected batch codes under Red Hold Tag, document QA disposition, and close root cause permanently.',
            fields: [
              { label: 'Deviation Event', value: 'Batch CHK-2611-C probed 68.5°C (< 75°C Critical Limit) at Step 03' },
              { label: 'Immediate Correction (Part 1)', value: 'Red Hold Tag applied; whole oven rack cooked additional 6 min to verified 79.2°C core' },
              { label: 'Suspect Stock Disposition', value: '0 kg discarded — Safe 6-log thermal lethality confirmed prior to chilling' },
              { label: '5-Why Root Cause (Part 2)', value: 'Fan belt slip reduced lower rack air circulation + double-stacked trays' },
              { label: 'Preventive Fix Executed', value: 'Engineer replaced fan belt + SOP updated restricting tray spacing to single height' }
            ],
            signOffLine: 'Initiated by Shift Chef · Root Cause Closed & Batch Released by QA Supervisor (ST)'
          },
          bulletPoints: [
            'Operators never throw out Corrective Action logs out of fear — honest deviation logging proves your HACCP system is genuinely catching and fixing risks.',
            'QA signature is mandatory before quarantined stock can be reworked, released, or disposed.'
          ],
          keyTakeaway:
            'Form DOC-10 captures immediate safety containment AND permanent 5-Why root-cause fixes so errors never repeat.'
        }
      ]
    },

    // =========================================================================
    // MODULE 13 (STEP 11 / PRINCIPLE 6: VERIFICATION & AUDIT SCHEDULE DOCUMENT)
    // =========================================================================
    {
      id: 'haccp3-v-mod-13',
      moduleNumber: 13,
      title: 'Module 13: Verification, Validation & Audit Document (Codex Step 11 / P6)',
      estimatedMinutes: 30,
      overview:
        'Master the difference between Validation and Verification, understand vertical batch trace audits, and inspect the official Codex Step 11 Master Verification Plan.',
      internationalClauses: ['Codex Principle 6 (Step 11)', 'CXG 69-2008 Validation vs Verification'],
      keyPrinciples: [
        'Validation proves scientifically BEFORE launch that limits control the hazard ("Are we doing the right thing?").',
        'Verification proves ongoingly through audits, calibration, record reviews, and lab swabs that the plan works daily ("Are we doing it right?").'
      ],
      criticalControlParameters: [
        {
          parameter: 'Audit Independence & Frequency',
          standardLimit: 'Daily supervisory record verification + quarterly independent internal audits + annual or change-triggered system review',
          correctiveProtocol: 'Immediately trigger unscheduled review after new allergen SKUs, equipment changes, recalls, or legal updates.'
        }
      ],
      practicalChecklist: [
        'Assign auditors independent of the specific line/shift being audited.',
        'Trend monthly micro swab results and customer complaints inside management review meetings.'
      ],
      quickCheck: {
        question: 'Which statement accurately contrasts Validation versus Verification under Codex Principle 6?',
        options: [
          'Validation is performed once after a product recall, while Verification happens before factory construction starts',
          'Validation proves scientifically upfront that controls achieve safety ("doing the right thing"); Verification provides ongoing audits/tests confirming daily execution ("doing it right")',
          'Both words mean checking delivery lorry tyres visually at the outer security gate',
          'Verification only covers financial invoicing whereas Validation covers staff uniforms'
        ],
        correctIndex: 1,
        explanation: 'Validation collects pre-launch thermal/challenge proof; Verification conducts ongoing supervisor checks, calibration, swabs, and internal audits.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Step 11 Document: Verification, Audit & Lab Testing Master Plan',
          subtitle: 'Principle 6 — Proving Scientific Validity & Daily Compliance',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-11',
            version: 'Rev 03 · 2026',
            codexStepLabel: 'Codex Step 11 / Principle 6 Document',
            docTitle: 'Annual Validation, Internal Audit & Verification Master Schedule',
            purpose: 'Schedule independent checks proving all CCPs, PRPs, and documents remain scientifically valid and faithfully executed.',
            fields: [
              { label: 'Auditor Independence Rule', value: 'Verifier cannot audit their own direct shift/recording logs' },
              { label: 'Unscheduled Review Triggers', value: 'New allergen, new supplier, machine install, recall, new pathogen law' }
            ],
            tablePreview: {
              headers: ['Activity Type', 'Question Answered', 'Frequency & Objective Proof'],
              rows: [
                ['Thermal Validation Study', 'Does 75°C / blast chill profile kill & stabilise?', 'Pre-launch & line change · 3 worst-case runs (Cold spot logs)'],
                ['Daily Record Verification', 'Did operators log & escalate deviations truthfully?', 'Daily · Independent QA countersignature on DOC-09 & CAPAs'],
                ['Environmental & Lab Swabs', 'Is high-care sanitation holding pathogen-free?', 'Monthly · TVC, Listeria, Entero, Allergen ELISA & potable water'],
                ['Vertical Batch Trace Audit', 'Can 1 shipped SKU trace 100% end-to-end?', 'Quarterly · Pick finished lot & verify intake, CCPs, cleaning & dispatch'],
                ['Management System Review', 'Does the complete HACCP system need updates?', 'Annually (or post-incident) · Signed Minutes by Plant Director']
              ]
            },
            signOffLine: 'Owned by QA Manager · Reported Quarterly at Food Safety Culture & Management Review'
          },
          bulletPoints: [
            'Vertical Auditing traces a single production batch from receiving gate to customer dispatch across every sheet (intake, cooking, chiller, calibration, sanitation).',
            'Never skip night-shift verification — night teams deserve equal coaching and audit focus.'
          ],
          keyTakeaway:
            'Validation tests your scientific theory before launch; Verification proves daily discipline across every shift.'
        }
      ]
    },

    // =========================================================================
    // MODULE 14 (STEP 12 / PRINCIPLE 7: DOCUMENTATION REGISTER & FAILURE TRAPS)
    // =========================================================================
    {
      id: 'haccp3-v-mod-14',
      moduleNumber: 14,
      title: 'Module 14: Documentation Control, Records & Failure Traps (Step 12 / P7)',
      estimatedMinutes: 25,
      overview:
        'Inspect Codex Step 12 Master Document Control Registers, enforce permanent-ink & retention rules, and diagnose the top real-world reasons HACCP systems fail.',
      internationalClauses: ['Codex Principle 7 (Step 12)', 'Document Control & Retention'],
      keyPrinciples: [
        'Controlled Documents (Plans, SOPs, Blank Forms) explain what MUST happen; Live Records prove what ACTUALLY happened.',
        'If an action is unsigned or covered with correction fluid, legally it cannot defend the business.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Document Control & Retention Rule',
          standardLimit: 'Retain batch & CCP records Shelf-Life + 1 Year minimum (zero tippex/erasable ink; obsolete sheets purged)',
          correctiveProtocol: 'Cross out genuine handwriting mistakes with a single neat line and initial + date.'
        }
      ],
      practicalChecklist: [
        'Check blank forms on line clipboards carry only the latest Revision Number.',
        'Confirm digital logs maintain tamper-proof time stamps and daily backups.'
      ],
      quickCheck: {
        question: 'If an operator accidentally writes the wrong oven temperature on a paper CCP log sheet, what is the ONLY audit-compliant correction method?',
        options: [
          'Cover the wrong digit cleanly with white correction fluid so the form stays neat',
          'Draw a single clean line through the mistake, write the true measurement beside it, and add initials with date/time',
          'Tear out the damaged page and rewrite the entire week neatly at shift end',
          'Use an erasable pencil for initial entries until QA verifies the binder on Friday'
        ],
        correctIndex: 1,
        explanation: 'White-out and torn pages destroy legal traceability; a single strike-through with initials preserves a transparent audit trail.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Step 12 Document: Master Document Control Register & Failure Traps',
          subtitle: 'Principle 7 — Keeping Living Documents Accessible & Unbreakable',
          visualIllustration: 'failure-causes',
          documentTemplateBlock: {
            docCode: 'HACCP-DOC-12',
            version: 'Rev 03 · 2026',
            codexStepLabel: 'Codex Step 12 / Principle 7 Document',
            docTitle: 'Master HACCP Document Control & Record Retention Register',
            purpose: 'Control version numbers, prevent obsolete clipboards on the floor, and mandate legal retention durations.',
            fields: [
              { label: 'Record Retention Floor', value: 'Maximum Product Shelf-Life + 1 Year (Minimum 24 months typical)' },
              { label: 'Data Integrity Mandate', value: 'Blue/black indelible ink or timestamped tablet; ZERO correction fluid' }
            ],
            tablePreview: {
              headers: ['Document ID', 'Controlled Title', 'Latest Rev', 'Retention Period', 'Owner'],
              rows: [
                ['HACCP-DOC-01 to 08', 'Team Charter, Product Spec, Flow Charts, Risk & Limits', 'Rev 02–04', 'Current + 5 Years Archived', 'QA Manager'],
                ['HACCP-DOC-09', 'Daily CCP Cook / Chill / Metal Check Logs', 'Rev 05', 'Shelf-Life + 1 Year', 'Shift Supervisors'],
                ['HACCP-DOC-10', 'Deviation Hold Tags & 5-Why CAPA Reports', 'Rev 02', '5 Years Minimum', 'QA Supervisor'],
                ['PRP-01 to 05', 'SSOP, Hygiene, IPM, Intake & Maintenance Logs', 'Rev 03', '2–3 Years Rolling', 'Dept Leads']
              ]
            },
            signOffLine: 'Controlled Digital Repository Backup Verified Weekly · Audited Every Quarter'
          },
          twoColumns: {
            leftTitle: 'Documents vs Live Records',
            leftTone: 'blue',
            leftItems: [
              'Documents (Rules): Scope, Team Charter, Flow Diagrams, Risk Matrix, SOPs',
              'Records (Proof): Signed Cook/Chill sheets, Metal tests, Calibrations, Training & CAPAs'
            ],
            rightTitle: 'Why Factory HACCP Fails',
            rightTone: 'rose',
            rightItems: [
              'Copy-paste generic templates never verified via Step 5 floor walks',
              '20+ fake CCPs exhausting operators into pre-filled checkbox fraud',
              'Zero leadership commitment when production pressure spikes'
            ]
          },
          bulletPoints: [
            'Active clipboards/tablets belong right beside the ovens, chillers, and packing lines — never locked inside corporate filing cabinets.',
            'Removing obsolete forms whenever a Revision increments prevents operators logging to outdated Critical Limits.'
          ],
          keyTakeaway:
            'Simple, version-controlled forms backed by visible management culture outperform thick dusty binders.'
        }
      ]
    },

    // =========================================================================
    // MODULE 15
    // =========================================================================
    {
      id: 'haccp3-v-mod-15',
      moduleNumber: 15,
      title: 'Module 15: End-to-End HACCP Control Chart, Revision & Exam Technique',
      estimatedMinutes: 35,
      overview:
        'Unite all 12 Codex steps inside a Master HACCP Control Chart, test yourself with the Interactive Codex Definition Matcher, and polish your supervisory exam technique.',
      internationalClauses: ['Codex Integrated HACCP Plan Table', 'Exam Command Verb Strategy'],
      keyPrinciples: [
        'The Master HACCP Control Chart links CCP Step → Significant Hazard → Critical Limit → Monitoring → Corrective Action → Verification → Record across one blueprint.',
        'Strong exam answers read command verbs carefully ("Identify" vs "Explain") and anchor explanations to food safety science.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Master Control Chart Alignment',
          standardLimit: '100% traceability linking DOC-04 Steps → DOC-06 Hazards → DOC-07 CCPs → DOC-08 Limits → DOC-09 Logs',
          correctiveProtocol: 'Cross-audit all 8 columns whenever any CCP changes.'
        }
      ],
      practicalChecklist: [
        'Use the Interactive Definition Matcher below until every Codex term clicks immediately.',
        'Launch the 40-MCQ Final Examination and score ≥ 60% (≥ 75% Distinction) to earn your certificate.'
      ],
      quickCheck: {
        question: 'In a Master HACCP Control Chart, which columns must connect cleanly left-to-right for every single identified CCP?',
        options: [
          'Unit Price → Retail Discount → Driver Overtime → Sales Tax',
          'CCP & Step → Significant Hazard → Critical Limit → Monitoring (4 Ws) → Corrective Action → Verification & Record',
          'Brand Logo Font → Factory Wall Paint → Canteen Menu → Holiday Dates',
          'Only the Team Leader Name and the Annual Electricity Meter Reading'
        ],
        correctIndex: 1,
        explanation: 'The Control Chart binds Principles 1 through 7 seamlessly across one auditable operational table.'
      },
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Master HACCP Control Chart Summary Blueprint',
          subtitle: 'All 7 Codex Principles Connected Across One Auditable Table',
          tableBlock: {
            caption: 'Master Supervisory HACCP Control Chart (Ready-to-Eat Poultry Line 02)',
            headers: ['CCP & Step', 'Significant Hazard', 'Critical Limit', 'Monitoring (What/When)', 'Corrective Action', 'Verification & Record'],
            rows: [
              ['CCP-1: Oven Roasting', 'Salmonella / Campylobacter survival', 'Core ≥ 75°C (or 70°C × 2 min)', 'Calibrated probe thickest fillet · Every batch · Chef', 'Continue cook to ≥ 75°C; repair oven element', 'Daily QA review + 0°C/100°C probe log (DOC-09)'],
              ['CCP-2: Blast Chilling', 'Cl. perfringens & B. cereus spore outgrowth', '75°C → ≤ 5°C within ≤ 90 minutes', 'Time & core temp log start/finish · Every batch', 'Hold/discard if > 2 hrs in danger zone; split tray depth', 'Weekly airflow check + Chill Log (Form Chill-02)'],
              ['CCP-3: Metal Detection', 'Ferrous / Non-Ferrous / Stainless fragments', 'Reject 2.0mm Fe / 2.5mm NFe / 2.5mm SS', 'Auto-reject every pack + hourly 3-wand test · Operator', 'Hold all stock since last good wand pass; re-screen', 'QA hourly verify + Metal Detector Log (Form MD-03)']
            ]
          },
          bulletPoints: [
            'Each CCP row connects seamlessly from Limit → Monitoring → Corrective Action → Verification → Record.',
            'Supervisors inspect this master chart during internal audits to verify floor reality matches approved science.'
          ],
          keyTakeaway:
            'Every single CCP must trace cleanly across all columns of your Master HACCP Control Chart.'
        },
        {
          slideNumber: 2,
          title: 'Interactive Revision: Match the Official Codex Definitions',
          subtitle: 'Self-Test All Core Terminology Before Launching the 40-MCQ Exam',
          definitionMatchDrill: [
            {
              term: 'Hazard',
              definition: 'A biological, chemical, physical, or allergenic agent in food with the potential to cause an adverse health effect.'
            },
            {
              term: 'Risk',
              definition: 'A function of the probability (likelihood) of an adverse health effect and the severity of that effect consequential to a hazard.'
            },
            {
              term: 'Prerequisite Programme (PRP)',
              definition: 'Basic environmental and operational hygiene conditions (GMP/GHP, SSOP, IPM, Suppliers) required as the foundation for HACCP.'
            },
            {
              term: 'Critical Control Point (CCP)',
              definition: 'A step at which control can be applied and is essential to prevent or eliminate a food safety hazard or reduce it to an acceptable level.'
            },
            {
              term: 'Critical Limit',
              definition: 'A measurable, observable criterion separating acceptability from unacceptability at a CCP.'
            },
            {
              term: 'Target Level & Tolerance',
              definition: 'Tighter operational criteria set inside the safe side of a Critical Limit to trigger early adjustment before breach.'
            },
            {
              term: 'Monitoring',
              definition: 'Conducting a planned sequence of observations or measurements to assess whether a CCP is under control.'
            },
            {
              term: 'Corrective Action',
              definition: 'Actions taken when CCP monitoring shows loss of control (product quarantine/disposition + root-cause elimination).'
            },
            {
              term: 'Validation vs Verification',
              definition: 'Validation proves upfront scientifically that controls work; Verification audits and tests ongoingly that the plan is followed.'
            }
          ],
          bulletPoints: [
            'Click individual rows in the interactive drill above to recall Codex definitions before revealing the answer.',
            'Double-check Hazard vs Risk, Target vs Critical Limit, and Validation vs Verification before starting the exam.'
          ],
          keyTakeaway:
            'Precision in Codex terminology wins both external factory audits and supervisory examinations.'
        },
        {
          slideNumber: 3,
          title: 'Supervisory Exam Technique & Command Verbs',
          subtitle: 'Final Readiness Checklist for the 40-MCQ Assessment',
          tableBlock: {
            caption: 'Exam Command Word Guide & Key Numerical Benchmarks',
            headers: ['Command Word', 'What Examiners Test', 'Winning Strategy'],
            rows: [
              ['Identify / State', 'Concise specific naming of hazard, limit, or step', 'Never write vague words — state exact pathogen or exact numeric °C/time'],
              ['Describe', 'Ordered operational workflow ("how")', 'Cover Who, What, How, Frequency & Record logically'],
              ['Explain', 'Scientific or legal mechanism ("why")', 'Link directly with "because..." to pathogen kill, spore dormancy, or injury prevention'],
              ['Evaluate / Judge', 'Risk Score & CCP Decision Tree application', 'Trace Likelihood × Severity and Codex Q1–Q4 step-by-step']
            ]
          },
          bulletPoints: [
            'Benchmark Numbers to Remember: Cold ≤ 5°C, Danger Zone 5°C–63°C, Hot Hold ≥ 63°C, Poultry Core ≥ 75°C, Ice Calibration 0°C ± 0.5°C.',
            'Click "Complete All Modules & Start 40-MCQ Final Exam" below when ready!'
          ],
          keyTakeaway:
            'Apply Codex Step-by-Step logic carefully to every scenario question in the 40-MCQ Final Exam.'
        }
      ]
    }
  ],

  // ===========================================================================
  // 40 HAND-CRAFTED SCENARIO & AUDIT MCQS COVERING ALL 15 MODULES
  // ===========================================================================
  coreExamPool: [
    {
      q: 'Why does HACCP replace reliance on finished-product microbiological testing alone?',
      options: [
        'End-product testing is retrospective, slow, and samples only a small fraction of a batch, whereas HACCP controls hazards continuously in real time',
        'Microbiological testing is prohibited under international Codex Alimentarius rules',
        'Finished-product testing can only detect broken glass and never bacteria',
        'HACCP eliminates the need for any temperature probes or cleaning schedules'
      ],
      correctIndex: 0,
      explanation: 'Microbiological lab sampling misses sporadic pockets of contamination; real-time process control ensures every batch is safe.'
    },
    {
      q: 'What is the primary duty of a shop-floor supervisor within a HACCP system?',
      options: [
        'Verify daily monitoring, inspect calibration, coach operators, and authorise corrective actions when deviations occur',
        'Write all company policies secretly without consulting production engineers or line staff',
        'Delegate every critical temperature check to untrained temporary cleaners',
        'Wait for an annual external auditor before fixing broken equipment'
      ],
      correctIndex: 0,
      explanation: 'Supervisors connect written procedures to live operational reality through coaching, checks, and rapid corrective escalation.'
    },
    {
      q: 'A tray of cooked turkey slices contains a blue plastic plaster from a kitchen operator’s finger. How is this hazard classified?',
      options: [
        'Physical hazard',
        'Microbiological hazard',
        'Chemical hazard',
        'Allergenic hazard'
      ],
      correctIndex: 0,
      explanation: 'Plasters, glass splinters, bone shards, and metal fragments are physical hazards capable of choking or injury.'
    },
    {
      q: 'Which statement accurately describes trace residue of quaternary ammonium sanitiser left on a dough mixer bowl?',
      options: [
        'A chemical hazard caused by inadequate rinsing after sanitation',
        'A biological hazard that disappears automatically in the oven',
        'A physical hazard that can be removed using an inline metal detector',
        'An allergenic hazard affecting only gluten-intolerant consumers'
      ],
      correctIndex: 0,
      explanation: 'Excess cleaning chemicals or lubricants migrating into food constitute chemical hazards and are not destroyed by baking.'
    },
    {
      q: 'A pastry chef prepares nut-free lemon tarts immediately after grinding almonds on the same unwashed worktable. Which hazard applies?',
      options: [
        'Allergenic cross-contact carrying potentially fatal anaphylactic risk',
        'Spore germination caused by slow cooling',
        'Physical contamination detectable by X-ray inspection',
        'Chemical taint easily neutralised by raising oven temperature to 200°C'
      ],
      correctIndex: 0,
      explanation: 'Allergen proteins are heat-stable; only strict segregation, validated wet cleaning, and allergen checks prevent cross-contact.'
    },
    {
      q: 'Between which temperatures does the classic foodborne bacterial "Danger Zone" sit?',
      options: [
        '5°C to 63°C',
        '-18°C to 0°C',
        '75°C to 100°C',
        '65°C to 95°C'
      ],
      correctIndex: 0,
      explanation: 'Pathogenic bacteria multiply rapidly between 5°C and 63°C, with division peaking around human body temperature (37°C).'
    },
    {
      q: 'Why can boiled basmati rice left at warm room temperature for 5 hours still trigger violent food poisoning even if briefly reheated?',
      options: [
        'Bacillus cereus spores survive boiling, germinate during slow cooling, and produce heat-stable emetic toxin',
        'Rice absorbs atmospheric oxygen and turns acidic within two hours',
        'Freezing water crystals convert starch directly into caustic alkali',
        'Vegetative Salmonella spores become metallic inside stainless pots'
      ],
      correctIndex: 0,
      explanation: 'Bacterial endospores withstand 100°C boiling and release heat-resistant toxins if cooked rice is held warm too long.'
    },
    {
      q: 'What effect does deep freezing at -18°C have on pathogenic bacteria in raw chicken?',
      options: [
        'It places bacteria into dormancy without killing them; multiplication resumes upon thawing',
        'It achieves a permanent 6-log destruction identical to pressure canning',
        'It eliminates both chemical pesticides and peanut allergens',
        'It turns high-risk poultry into a permanently sterile ambient product'
      ],
      correctIndex: 0,
      explanation: 'Freezing locks moisture and pauses microbial division, but dormant pathogens revive as soon as temperature rises above 5°C.'
    },
    {
      q: 'Which of the following items is classified as a High-Risk Food requiring strict cold-chain or hot-hold supervision?',
      options: [
        'Ready-to-eat chilled egg-mayonnaise sandwiches',
        'Unopened jars of vinegar-preserved pickles at pH 3.2',
        'Dry uncooked wheat flour stored in sealed sacks',
        'Crystalline white sugar kept in a dry ingredient room'
      ],
      correctIndex: 0,
      explanation: 'Ready-to-eat moist protein foods (egg-mayonnaise sandwiches) support rapid pathogen growth without any further cooking step.'
    },
    {
      q: 'Why do pickled vegetables in vinegar (pH 3.3) remain shelf-stable at ambient temperature?',
      options: [
        'High acidity inhibits pathogenic bacteria from multiplying',
        'Vinegar automatically sterilises physical metal fragments',
        'Pickled vegetables contain zero water moisture',
        'Acetic acid converts bacterial spores into benign yeast'
      ],
      correctIndex: 0,
      explanation: 'Pathogenic bacteria require near-neutral pH (> 4.5); strong acidity acts as an effective intrinsic growth barrier.'
    },
    {
      q: 'How do Prerequisite Programmes (PRPs) relate to a facility’s formal HACCP plan?',
      options: [
        'PRPs control baseline hygiene, pest control, cleaning, and maintenance so HACCP can focus sharply on process-specific CCPs',
        'PRPs only apply after a facility fails three external ISO audits',
        'HACCP replaces the need for personal hygiene, handwashing, and pest proofing',
        'Every cleaning broom and corridor door must be classified as a CCP instead of a PRP'
      ],
      correctIndex: 0,
      explanation: 'Without strong PRPs, teams overload HACCP plans with dozens of fake CCPs, making real critical monitoring unmanageable.'
    },
    {
      q: 'In the 6-Step Wet Cleaning SOP (SSOP), why must surfaces be clean-rinsed AFTER detergent scrubbing and BEFORE applying disinfectant?',
      options: [
        'Organic grease and soap residues deactivate chemical sanitisers, blocking microbial kill on stainless surfaces',
        'Disinfectants are designed to remove thick baked-on grease before detergent touches steel',
        'Warm detergent reacts instantly with chilled water to create broken glass fragments',
        'Rinsing between detergent and disinfectant is only needed once every 6 months'
      ],
      correctIndex: 0,
      explanation: 'Disinfectants require clean soil-free stainless steel surfaces and full contact time to kill residual bacteria effectively.'
    },
    {
      q: 'Why should indoor electric UV fly-killers never be installed directly above open high-care food assembly benches?',
      options: [
        'Insect debris can drop straight into open ready-to-eat food as physical and biological contamination',
        'UV light rapidly freezes moist protein sauces below 0°C',
        'UV tubes destroy plastic food packaging instantly upon contact',
        'Pest contractors prohibit indoor fly monitoring near wall doorways'
      ],
      correctIndex: 0,
      explanation: 'Insect zappers must be positioned at wall entrances away from open food zones so debris cannot fall into exposed product.'
    },
    {
      q: 'In legal proceedings following a foodborne illness investigation, what establishes a statutory "Due Diligence" defence?',
      options: [
        'Dated, signed records proving the business took all reasonable precautions and monitored controls effectively prior to the incident',
        'Verbal assurances from shift staff that kitchen floors look shiny',
        'A marketing brochure claiming the brand won a culinary award last year',
        'Deleting old monitoring sheets at the end of every month'
      ],
      correctIndex: 0,
      explanation: 'Only contemporaneous, verifiable records (CCP logs, calibration, training, supplier specs) prove Due Diligence in court.'
    },
    {
      q: 'How many total steps make up the official Codex Alimentarius HACCP sequence?',
      options: [
        '12 Steps: 5 Preliminary Preparation Steps followed by the 7 HACCP Principles',
        '7 Steps total with no preliminary product or flow diagram stages',
        '4 Steps limited to receiving, cooking, packaging, and invoicing',
        '20 Steps requiring daily government inspector signatures'
      ],
      correctIndex: 0,
      explanation: 'Codex comprises Steps 1–5 (Team, Product, Intended Use, Flow Diagram, On-Site Verify) plus Steps 6–12 (Principles 1–7).'
    },
    {
      q: 'What key information belongs inside the Codex Step 1 controlled document ("Assemble HACCP Team")?',
      options: [
        'Named cross-functional members (QA, Production, Engineering, Hygiene), training competence, and defined product/hazard scope boundaries',
        'Only customer retail pricing lists and quarterly advertising discounts',
        'Anonymous job titles without any product scope or review signature',
        'A blank thermometer sheet signed in advance for the next twelve months'
      ],
      correctIndex: 0,
      explanation: 'Form HACCP-DOC-01 proves multidisciplinary competence, assigns clear responsibilities, and fixes facility start-to-end scope.'
    },
    {
      q: 'Which consumer information in Codex Step 3 (Intended Use) requires tightening microbiological and allergen criteria?',
      options: [
        'Serving Ready-to-Eat cold meals to hospitalised, elderly, pregnant, or immunocompromised patients',
        'Exporting dried uncooked rice sacks with boiling instructions printed on the bag',
        'Packaging ambient refined sugar for bakery wholesale',
        'Shipping whole unwashed root vegetables exclusively for industrial peeling and boiling'
      ],
      correctIndex: 0,
      explanation: 'Vulnerable (YOPI) consumers lack full immune defences and face severe consequences from ready-to-eat pathogens like Listeria.'
    },
    {
      q: 'Why must water, ice, packaging materials, and rework loops appear on a Step 4 Process Flow Diagram?',
      options: [
        'Every omitted input or holding loop escapes Step 6 Hazard Analysis and can introduce unmonitored allergens or pathogens',
        'Flow diagrams are designed only as decorative reception posters for visitors',
        'Adding extra boxes automatically reduces factory utility bills',
        'Packaging materials never carry label, allergen, or physical hazards'
      ],
      correctIndex: 0,
      explanation: 'If a step or rework loop is left off the flow chart, its hazards will go completely unassessed and uncontrolled.'
    },
    {
      q: 'What is the mandatory purpose of Codex Step 5 (On-Site Confirmation of Flow Diagram)?',
      options: [
        'Physically walk the active line across all shifts to verify the written diagram matches real shop-floor practice before Hazard Analysis',
        'Email the draft diagram to suppliers without visiting the factory floor',
        'Skip straight to metal detection calibration without reviewing cooking sequences',
        'Replace engineering blueprints during building construction'
      ],
      correctIndex: 0,
      explanation: 'Floor walks catch unmapped staging delays, shortcuts, and night-shift workarounds before risk scoring begins.'
    },
    {
      q: 'Within Quantitative Risk Scoring (Risk = Likelihood × Severity), how is a hazard scoring High Likelihood (3) and High Severity (3) treated?',
      options: [
        'Score 9 (Significant Hazard) — must proceed to targeted control measures and CCP Decision Tree evaluation',
        'Score 6 — safely ignored under basic floor-sweeping schedules',
        'Score 1 — classified as an insignificant cosmetic packaging blemish',
        'Managed purely through annual financial budget meetings'
      ],
      correctIndex: 0,
      explanation: 'High-risk scores (≥ 6 on a 3×3 matrix) represent significant food safety hazards demanding robust, verifiable control.'
    },
    {
      q: 'When listing hazards during Principle 1, why should teams write "Salmonella spp." or "Shattered brittle plastic" instead of "germs" or "dirt"?',
      options: [
        'Specific hazards dictate exact scientific controls — thermal kill curves for pathogens differ completely from sieve/X-ray controls for plastic',
        'Long Latin words automatically waive audit verification fees',
        'General words like "dirt" are reserved exclusively for financial accountants',
        'Specific terms prevent staff from ever needing calibrated thermometers'
      ],
      correctIndex: 0,
      explanation: 'Different pathogens and foreign materials have distinct survival characteristics and require completely different control barriers.'
    },
    {
      q: 'Using the Codex 4-Question Decision Tree, raw chicken cold-chain delivery (≤ 5°C) precedes a full ≥ 75°C roasting step later in the kitchen. Is cold receiving a CCP for Salmonella?',
      options: [
        'No (Q4 = Yes) — the subsequent validated ≥ 75°C roasting step will eliminate Salmonella to a safe level',
        'Yes — every single step on any flow diagram is automatically a CCP',
        'Yes — cold chilling immediately kills 100% of Salmonella inside raw chicken',
        'No — raw chicken cannot carry Salmonella unless frozen below -18°C'
      ],
      correctIndex: 0,
      explanation: 'Under Question 4, when a later processing step eliminates the hazard reliably, the upstream step is managed as a PRP/CP rather than a CCP.'
    },
    {
      q: 'Under the same Codex Decision Tree, chilled storage (≤ 5°C) of a Ready-to-Eat salmon cheesecake served cold receives what classification?',
      options: [
        'Mandatory CCP (Q3 = Yes, Q4 = No) — no subsequent heat step exists before consumer consumption',
        'Not a CCP because consumers will bake frozen cheesecake for 90 minutes at home',
        'Insignificant housekeeping check requiring zero temperature records',
        'Controlled exclusively by inline metal detection'
      ],
      correctIndex: 0,
      explanation: 'Because ready-to-eat chilled desserts receive no downstream cooking kill step, cold-chain temperature control is critical.'
    },
    {
      q: 'What is the operational downside of classifying 25 routine facility steps as CCPs?',
      options: [
        'Monitoring fatigue and diluted attention cause operators to treat genuine life-saving CCPs as routine tick-box chores',
        'Too many CCPs improve bakery oven energy efficiency automatically',
        'External auditors award automatic bonus points for excessive paperwork',
        'Operators stop needing training or thermometer calibration'
      ],
      correctIndex: 0,
      explanation: 'Strong HACCP focuses intensive CCP monitoring strictly on the few essential control points where failure harms consumers.'
    },
    {
      q: 'Which statement represents a valid, objective Critical Limit under Principle 3?',
      options: [
        'Internal thermal core temperature ≥ 75°C measured at the thickest piece',
        'Cook chicken breasts until juices run visually clear and golden brown',
        'Chill curry pots until they feel fairly cold on the outside stainless rim',
        'Keep pickled sauce reasonably sour according to the senior chef’s taste'
      ],
      correctIndex: 0,
      explanation: 'Critical Limits must always be measurable or observable numerically — subjective colour or feel checks fail audit scrutiny.'
    },
    {
      q: 'Why do well-run factories set a Target Level of 1°C–3°C for chilled cabinets whose legal Critical Limit is ≤ 5.0°C?',
      options: [
        'Tighter target buffers alert engineers to adjust refrigeration long before food actually crosses the unsafe 5.0°C legal boundary',
        'Target levels allow managers to legally sell food stored at 12°C without logging deviations',
        'Setting a target removes the requirement to calibrate electronic chiller probes',
        'Chillers automatically disinfect floors whenever air temperature reaches 2°C'
      ],
      correctIndex: 0,
      explanation: 'Target Levels and Tolerances provide proactive breathing room to correct drift before product safety is compromised.'
    },
    {
      q: 'What is the standard accuracy verification band when calibrating a cold-chain digital probe in a 50/50 crushed ice-water slurry?',
      options: [
        '0.0°C ± 0.5°C (-0.5°C to +0.5°C)',
        '10.0°C ± 5.0°C',
        '-18.0°C ± 2.0°C',
        '25.0°C ± 1.0°C'
      ],
      correctIndex: 0,
      explanation: 'Pure crushed ice in water equilibrates at 0.0°C; food-safety probes are normally verified within ±0.5°C (or facility tolerance).'
    },
    {
      q: 'During an audit, a supervisor notices every batch core temperature on a weekly cook log is written in the exact same pen stroke as "75.0°C" from Monday through Friday. What risk does this signal?',
      options: [
        'Potential record falsification ("pencil-whipping") without genuine probing — requires immediate live line observation & retraining',
        'Superior oven thermostatic perfection proving probes never vary by 0.1°C',
        'Guaranteed compliance with ISO 9001 continuous data telemetry',
        'Proof that the digital thermometer battery is permanently overcharged'
      ],
      correctIndex: 0,
      explanation: 'Real thermal processes naturally fluctuate (76.4°C, 78.1°C); identical neat numbers suggest fabricated batch sign-offs.'
    },
    {
      q: 'An inline metal detector fails its hourly 2.0mm stainless test-wand check at 14:00 after passing at 13:00. Which immediate action is mandatory?',
      options: [
        'Stop the line, place all stock packed since 13:00 on HOLD, repair/re-verify the detector, and re-inspect quarantined packs before release',
        'Finish packing the shift smoothly and promise to repair the detector tomorrow morning',
        'Turn off the reject alarm so boxes stop jamming the conveyor belt',
        'Discard only the single tray sitting directly under the tunnel at 14:00'
      ],
      correctIndex: 0,
      explanation: 'Everything produced back to the last confirmed successful check (13:00) is potentially unprotected and must be quarantined and re-screened.'
    },
    {
      q: 'Which two mandatory components define a complete Principle 5 Corrective Action?',
      options: [
        'Immediate containment/disposition of suspect food + root-cause repair to stop the failure recurring',
        'Issuing a written apology to customers + deleting the failed monitoring sheet',
        'Increasing conveyor speed + bypassing QA supervisor counter-signatures',
        'Blending non-conforming stock evenly into compliant finished pallets'
      ],
      correctIndex: 0,
      explanation: 'Corrective Action resolves both the immediate unsafe batch and the underlying technical or human root cause.'
    },
    {
      q: 'How does Validation differ from Verification under Codex Principle 6?',
      options: [
        'Validation obtains pre-launch scientific proof that controls work; Verification provides ongoing audits/tests proving the plan is followed consistently',
        'Validation is performed once every ten years by receptionists; Verification means weighing delivery vans',
        'Both terms mean asking temporary operators whether they washed their hands',
        'Verification happens strictly before factory construction; Validation happens only after a recall'
      ],
      correctIndex: 0,
      explanation: 'Validation checks "Can our plan make safe food?" before launch; Verification checks "Are we actually doing it?" day by day.'
    },
    {
      q: 'Which internal audit approach tests the whole system end-to-end by picking one dispatched batch code and checking intake, CCPs, calibration, cleaning, and training from that day?',
      options: [
        'Vertical Trace Audit',
        'Ambient Temperature Guessing',
        'Marketing Artwork Audit',
        'Payroll Ledger Reconciliation'
      ],
      correctIndex: 0,
      explanation: 'Vertical auditing connects every prerequisite and CCP record belonging to a single batch from goods-in to dispatch.'
    },
    {
      q: 'Which event must trigger an immediate unscheduled HACCP System Review rather than waiting for the annual calendar date?',
      options: [
        'Introduction of a new allergenic ingredient, installation of a new blast chiller, or a confirmed product safety recall',
        'Hiring a new finance clerk in the corporate accounting office',
        'Repainting the outdoor staff car-park boundary lines',
        'Changing the colour of external visitor ID lanyards'
      ],
      correctIndex: 0,
      explanation: 'Any recipe, allergen, process equipment, packaging, legal, or safety-incident change invalidates the old hazard assumptions until reviewed.'
    },
    {
      q: 'Which statement accurately contrasts HACCP Documents versus Operational Records?',
      options: [
        'Documents (SOPs, Flow Charts, Control Charts) are version-controlled templates telling staff what to do; Records are dated, signed proofs of execution',
        'Records can be freely rewritten in pencil months later; Documents have no version numbers',
        'Only Documents require retention; daily monitoring sheets are shredded every Friday',
        'Documents and Records are identical marketing flyers printed for trade fairs'
      ],
      correctIndex: 0,
      explanation: 'Controlled documents define the rules ("say what you do"); immutable records demonstrate live compliance ("prove what you did").'
    },
    {
      q: 'How should an operator correct a genuine handwriting mistake on a paper CCP temperature sheet?',
      options: [
        'Draw a single clean line through the error, write the true reading clearly alongside, and add initials with date/time',
        'Cover the mistake completely with white correction fluid so auditors see a tidy page',
        'Tear out the page and discard it in general factory waste',
        'Erase the ink until the paper tears and leave the box blank'
      ],
      correctIndex: 0,
      explanation: 'Correction fluid destroys audit trail integrity; a single-line strike-through plus initials preserves complete traceability.'
    },
    {
      q: 'Which factor most commonly causes factory HACCP systems to collapse within six months of certification?',
      options: [
        'Treating copied generic paperwork as compliance without management commitment, Step 5 verification, or practical floor ownership',
        'Using calibrated stainless-steel probes instead of wooden rulers',
        'Testing product temperature during both morning and evening shifts',
        'Training operators on allergenic cross-contact before handling peanut butter'
      ],
      correctIndex: 0,
      explanation: 'Copy-paste plans divorced from shop-floor culture and senior management backing fail immediately when pressure rises.'
    },
    {
      q: 'In an end-to-end HACCP Control Chart, which columns must be linked together for every single CCP?',
      options: [
        'Step & Hazard → Critical Limit → Monitoring (What/How/When/Who) → Corrective Action → Verification & Record',
        'Product Price → Retail Margin → Discount Code → Driver Tips',
        'Supplier Phone Number → Logo Font → Kitchen Paint Colour → Floor Tile Size',
        'Holiday Roster → Shift Break Times → Car-Park Bays → Canteen Menu'
      ],
      correctIndex: 0,
      explanation: 'The Control Chart links Principles 1 through 7 seamlessly across one auditable master matrix.'
    },
    {
      q: 'A cooked bulk beef curry (core 82°C) takes 5.5 hours to drop from 60°C down to 15°C in deep plastic buckets inside a standard chiller. What is the key risk?',
      options: [
        'Surviving Clostridium perfringens spores germinate and multiply explosively across the prolonged Danger Zone cooling curve',
        'Beef protein turns chemically acidic below pH 2.0',
        'Plastic buckets automatically magnetise metal shards into the gravy',
        'Chiller fans freeze curry faster than blast freezers'
      ],
      correctIndex: 0,
      explanation: 'Slow cooling is a top cause of spore-former outbreaks; shallow ≤ 5cm metal trays and blast chilling bring food under 5°C within 90 minutes.'
    },
    {
      q: 'Why is ongoing allergen swabbing of cleaned slicing equipment classified under Verification (Principle 6) rather than continuous real-time Monitoring?',
      options: [
        'Periodic laboratory/ELISA swabs verify independently that the validated cleaning SOP reliably removes allergen residues across cycles',
        'Allergen swabs are completely banned inside ready-to-eat catering kitchens',
        'Cleaning blades never require sanitation verification between raw cheese and ham',
        'Verification means guessing whether blades look clean under dim lighting'
      ],
      correctIndex: 0,
      explanation: 'Periodic swab verification confirms ongoing sanitation effectiveness alongside visual and paperwork sign-offs.'
    },
    {
      q: 'When answering a supervisory HACCP exam question starting with "Explain why...", what earns full marks?',
      options: [
        'Stating the exact scientific/operational mechanism ("because...") linking the control step directly to hazard prevention or elimination',
        'Listing three unrelated department names without linking them to food safety',
        'Writing a single generic word such as "hygiene" or "standard"',
        'Repeating the question stem word-for-word without justification'
      ],
      correctIndex: 0,
      explanation: 'Supervisory assessment distinguishes identifying a fact from explaining the scientific or legal reason behind it.'
    }
  ]
};

function arrangeHaccp3McqOptions(
  options: [string, string, string, string],
  correctIndex: number,
  idx: number
): { options: [string, string, string, string]; correctIndex: number } {
  const targetPos = (idx * 3 + 1) % 4;
  const correctOpt = options[correctIndex];
  const distractors = options.filter((_, oIdx) => oIdx !== correctIndex);
  const arranged: [string, string, string, string] = ['', '', '', ''];
  let dIdx = 0;
  for (let pos = 0; pos < 4; pos++) {
    arranged[pos] = pos === targetPos ? correctOpt : distractors[dIdx++];
  }
  return { options: arranged, correctIndex: targetPos };
}

export const HACCP_LEVEL_03_VISUAL_HUB_TRAINING: HubTraining = {
  id: HACCP_LEVEL_03_VISUAL_COURSE.id,
  category: 'International Certification',
  title: HACCP_LEVEL_03_VISUAL_COURSE.title,
  standardCode: HACCP_LEVEL_03_VISUAL_COURSE.code,
  subType: HACCP_LEVEL_03_VISUAL_COURSE.levelBadge,
  description: HACCP_LEVEL_03_VISUAL_COURSE.description,
  duration: HACCP_LEVEL_03_VISUAL_COURSE.duration,
  fees: 'Free Study & Exam | Rs. 1,000 Verified Certificate',
  enrollLink: '#trainings',
  isActive: true,
  customModules: HACCP_LEVEL_03_VISUAL_COURSE.modules.map((m) => ({
    id: m.id,
    subject: m.title,
    description: `${m.overview}\n\n${m.keyPrinciples.join('\n\n')}`
  })),
  customMcqs: HACCP_LEVEL_03_VISUAL_COURSE.coreExamPool.map((item, idx) => {
    const arranged = arrangeHaccp3McqOptions(item.options, item.correctIndex, idx);
    return {
      id: `${HACCP_LEVEL_03_VISUAL_COURSE.id}-q-${idx + 1}`,
      question: item.q,
      options: arranged.options,
      correctIndex: arranged.correctIndex,
      explanation: item.explanation
    };
  })
};

export function getHaccpLevel03VisualExamMcqs(): CourseExamMCQ[] {
  return HACCP_LEVEL_03_VISUAL_COURSE.coreExamPool.map((item, idx) => {
    const arranged = arrangeHaccp3McqOptions(item.options, item.correctIndex, idx);
    return {
      id: `${HACCP_LEVEL_03_VISUAL_COURSE.id}-q-${idx + 1}`,
      questionNumber: idx + 1,
      question: item.q,
      options: arranged.options,
      correctIndex: arranged.correctIndex,
      explanation: item.explanation
    };
  });
}
