import { HubTraining } from '../types/hub';
import {
  CourseStudyModule,
  InternationalTrainingCourse
} from './internationalTrainingsData';

export interface ManagerDietaryExamQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  moduleRef: string;
}

export const MANAGER_FOOD_DIETARY_MODULES: CourseStudyModule[] = [
  // =========================================================================
  // MODULE 1
  // =========================================================================
  {
    id: 'cdm-v-mod-1',
    moduleNumber: 1,
    title: 'Scope of Practice, Leadership Role & Interdisciplinary Clinical Care Team',
    estimatedMinutes: 30,
    overview:
      'Master the executive scope of practice of a Certified Dietary Manager (CDM), understand clinical vs operational boundaries with Registered Dietitians and Physicians, and run daily interdisciplinary shift briefings.',
    internationalClauses: [
      'ANFP Certified Dietary Manager (CDM, CFPP) Scope of Practice',
      'JCI Hospital Patient-Centered Care & Nutrition Standards (COP.4)'
    ],
    keyPrinciples: [
      'The Certified Dietary Manager leads hospital and institutional foodservice operations: menu execution, therapeutic diet accuracy, food safety/HACCP, procurement, budgeting, and team leadership.',
      'Clinical Dietitians (RD/RDN) perform medical nutrition assessments and prescribe therapeutic diet modifications; the CDM ensures every prescribed meal is cooked, portioned, verified, and delivered safely on time.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Ward Diet Census Synchronization',
        standardLimit: '100% live reconciliation of Admissions, Discharges, Transfers & NPO orders ≥ 30 mins before every meal service',
        correctiveProtocol: 'Halt tray release for any unverified bed change; confirm verbally and digitally with the Ward Charge Nurse before dispatch.'
      }
    ],
    practicalChecklist: [
      'Lead a structured 10-minute morning huddle reviewing ward census, therapeutic specials, allergens, and staffing assignments.',
      'Reconcile new NPO (Nil Per Os) and Hold-Tray requests immediately with nursing stations before tray-line startup.'
    ],
    quickCheck: {
      question: 'How do the professional responsibilities of a Clinical Dietitian (RD) and a Certified Dietary Manager (CDM) complement each other in a hospital?',
      options: [
        'The CDM prescribes intravenous TPN formulas while the Dietitian supervises kitchen dishwashing and store inventory',
        'The Clinical Dietitian assesses nutrition risk and prescribes therapeutic diet targets, while the CDM manages kitchen operations, food safety, staff, budget, and accurate meal delivery',
        'Both roles are identical and either person may independently change a physician’s NPO surgical order',
        'The CDM only manages the staff cafeteria and has no responsibility for patient therapeutic tray accuracy'
      ],
      correctIndex: 1,
      explanation: 'Clinical Dietitians handle clinical nutrition assessment and Medical Nutrition Therapy (MNT); Certified Dietary Managers lead foodservice production, HACCP, staffing, budgets, and accurate execution of every therapeutic tray.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Course Architecture & Certified Dietary Manager Mastery Blueprint',
        subtitle: 'Interactive Professional CDM Curriculum — Food Science Portal',
        calloutBanner: {
          label: 'Hospital & Institutional Leadership Blueprint',
          text: 'Engineered for Certified Dietary Managers, Hospital Foodservice Directors, Clinical Kitchen Supervisors, Nutritionists, and Catering Managers — combining clinical therapeutic diet execution, IDDSI dysphagia controls, hospital SOPs, 12 controlled dietary documents, interactive drills, and financial KPI mastery.',
          tone: 'blue'
        },
        visualIllustration: 'cdm-care-team',
        bulletPoints: [
          'Structured across 15 progressive interactive modules covering Clinical Care Coordination, Therapeutic Diets, IDDSI Textures, Hospital HACCP, Tray-Line QA, Financial PPD Control, and Accreditation Readiness.',
          'Includes 12 authentic Hospital Controlled Document Templates (CDM-DOC-01 to CDM-DOC-12), interactive SOP tabs, Germometer, Risk Matrix, and Classification Drills.',
          'Assessment Goal: Study all 15 interactive modules and score ≥ 60% (≥ 75% Distinction) on the 40-MCQ Final Examination.'
        ],
        keyTakeaway:
          'A Certified Dietary Manager bridges clinical medicine and culinary operations so the right diet reaches the right patient safely at every meal.'
      },
      {
        slideNumber: 2,
        title: 'Scope of Practice: CDM vs Clinical Dietitian vs Ward Nursing',
        subtitle: 'Preventing Clinical Errors Through Clear Role Boundaries',
        twoColumns: {
          leftTitle: 'Certified Dietary Manager (CDM) Mandate',
          leftTone: 'blue',
          leftItems: [
            'Translate prescribed diet manuals into cycle menus and standardized recipes',
            'Direct kitchen operations, tray assembly line, thermal transport & sanitation',
            'Manage food purchasing, FIFO/FEFO inventory, PPD food cost & labor rosters',
            'Screen routine food preferences, allergies & intake; escalate high nutrition risk to RD'
          ],
          rightTitle: 'Clinical Dietitian (RD) & Physician Mandate',
          rightTone: 'emerald',
          rightItems: [
            'Physician writes legal medical diet order (Diabetic, Renal, IDDSI, NPO)',
            'Clinical Dietitian performs comprehensive MNT assessment & calculates tube feeds',
            'Dietitian approves hospital diet manual and complex clinical nutrient modifications',
            'Ward Nurse verifies dual patient ID at bedside, assists feeding & records % eaten'
          ]
        },
        documentTemplateBlock: {
          docCode: 'CDM-DOC-01',
          version: 'Rev 2.0',
          codexStepLabel: 'Daily Clinical Operations Control',
          docTitle: 'Daily Dietary Shift Huddle & Ward Census Sign-Off Sheet',
          purpose: 'Synchronizes kitchen production with live nursing census, NPO surgical holds, and high-risk patient allergen alerts prior to breakfast, lunch, and dinner tray lines.',
          fields: [
            { label: 'Hospital / Unit', value: 'Tertiary Care Dietary Dept (250 Beds)' },
            { label: 'Meal Service Period', value: 'Lunch Service (Tray Line Start: 11:30 AM)' },
            { label: 'Total Active Patients', value: '218 Active · 14 NPO · 6 Hold Trays' },
            { label: 'Shift Lead / CDM', value: 'Certified Dietary Manager on Duty' }
          ],
          tablePreview: {
            headers: ['Ward', 'Regular', 'Diabetic / Cardiac', 'Renal / Low-K', 'IDDSI L4–L6', 'NPO / Allergen Flags'],
            rows: [
              ['ICU / CCU', '4', '12', '5', '6 (Pureed/Soft)', '4 NPO · Bed 104: Peanut Allergy'],
              ['Medical Ward A', '26', '28', '9', '11', '3 NPO · Bed 212: Celiac (GF)'],
              ['Surgical Ward B', '31', '14', '2', '8 (Liquid/Soft)', '7 NPO (Pre-Op) · 3 Hold Trays']
            ]
          },
          signOffLine: 'CDM Signature & Time ________ | Charge Nurse Census Confirm ________'
        },
        bulletPoints: [
          'Never alter a therapeutic diet restriction independently without documented physician or Clinical Dietitian authorization.',
          'When a patient reports chewing difficulty, weight loss, or <50% meal consumption for 3 consecutive days, submit an immediate Clinical Dietitian Referral.'
        ],
        keyTakeaway:
          'Clear scope boundaries and pre-meal census reconciliation eliminate NPO breaches and therapeutic diet mix-ups.'
      }
    ]
  },

  // =========================================================================
  // MODULE 2
  // =========================================================================
  {
    id: 'cdm-v-mod-2',
    moduleNumber: 2,
    title: 'Hospital Kitchen Architecture, One-Way Flow & Ergonomic Zone Control',
    estimatedMinutes: 30,
    overview:
      'Design and audit a hygienic hospital dietary facility using strict Dirty-to-Clean one-way workflow, multi-stream therapeutic segregation, air-pressure zoning, and ergonomic equipment placement.',
    internationalClauses: [
      'Codex CXC 1-1969 Hygienic Facility Design',
      'ISO/TS 22002-2 Catering & Institutional Kitchen Zoning'
    ],
    keyPrinciples: [
      'A compliant hospital kitchen enforces strict One-Way Forward Flow (Receiving → Storage → Pre-Prep → Hot/Diet Cooking → Tray Assembly → Ward Dispatch) with a physically isolated Scullery return route.',
      'Positive air pressure in the clean tray-assembly zone, washable coved floor-to-wall junctions, shatterproof ≥500 lux lighting, and dedicated handwash basins prevent environmental contamination.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Facility Zoning & Environmental Separation',
        standardLimit: 'Zero cross-traffic between raw preparation, clean tray plating, and soiled ward-cart scullery return',
        correctiveProtocol: 'Re-route carts immediately, sanitize affected clean-zone surfaces, and retrain floor stewards on directional signage.'
      }
    ],
    practicalChecklist: [
      'Walk the kitchen floor weekly from Receiving Bay to Scullery verifying zero back-tracking of raw ingredients or dirty trays.',
      'Check shatterproof light covers, insect-screen mesh integrity, floor drain traps, and handwash station supplies every shift.'
    ],
    quickCheck: {
      question: 'Why must returning soiled meal trolleys from hospital wards enter directly into an isolated Dishwashing (Scullery) zone rather than passing through the Tray Assembly area?',
      options: [
        'To reduce the walking distance for kitchen chefs during lunch preparation',
        'To prevent infectious ward pathogens, used utensils, and food waste from cross-contaminating clean plated patient meals',
        'Because soiled trolleys are too heavy for standard kitchen floor tiles',
        'To allow ward nurses to wash patient dishes before returning trolleys'
      ],
      correctIndex: 1,
      explanation: 'Hospital trays returning from patient wards may carry clinical pathogens; an isolated soiled-return route preserves strict One-Way (Dirty-to-Clean) hygienic separation.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'The 6 Functional Zones of a Hospital Dietary Kitchen',
        subtitle: 'Engineering Cross-Contamination Out of Daily Operations',
        visualIllustration: 'cdm-kitchen-zones',
        flowDiagramData: {
          title: 'Hospital Multi-Stream Meal Workflow (Regular + Therapeutic Convergence)',
          isMultiStream: true,
          mainSteps: [
            { step: 'Zone 1: Receiving Bay Gatekeeping', note: 'Verify COA, weight, pest-free truck, ≤5°C chilled / ≤-18°C frozen' },
            { step: 'Zone 2: Segregated Dry, Chilled & Frozen Stores', note: 'FIFO/FEFO tagging · 15 cm off floor · raw bottom shelf' },
            { step: 'Zone 3: Color-Coded Pre-Preparation', note: 'Dedicated raw meat, produce & allergen-free benches' },
            { step: 'Zone 4: Hot Bulk & Therapeutic Cooking', note: 'Validated core lethality ≥75°C (probe verified)', isCcp: true },
            { step: 'Zone 5: Clean Tray Assembly & Ticket Audit', note: 'Hot hold ≥63°C · Cold ≤5°C · Dual-ID & NPO check', isCcp: true },
            { step: 'Ward Thermal Dispatch → Isolated Zone 6 Scullery', note: 'Deliver ≤30 min; soiled carts return via separate scullery door' }
          ],
          secondarySteps: [
            { step: 'Therapeutic & IDDSI Puree Station', note: 'Dedicated salt-free / allergen-free kettles & IDDSI flow check', joinAtIndex: 4 },
            { step: 'Cold Desserts, Oral Shakes & Salads', note: 'Chilled ≤5°C RTE plating line', joinAtIndex: 4 }
          ]
        },
        bulletPoints: [
          'Physical Barriers: Where full walls are unavailable, enforce color-coded floor zoning, dedicated equipment, and time-separated sanitization.',
          'Dedicated Handwash Basins: Must be hands-free (elbow/knee/sensor), stocked with warm water, liquid antibacterial soap, paper towels, and pedal bin — never used for vegetable washing.'
        ],
        keyTakeaway:
          'Facility flow design is your strongest silent supervisor — when clean and dirty paths never cross, outbreaks plummet.'
      },
      {
        slideNumber: 2,
        title: 'Structural Hygiene, Ventilation, Lighting & Equipment Audit',
        subtitle: 'Building & Utility Specifications Every CDM Inspects',
        documentTemplateBlock: {
          docCode: 'CDM-DOC-02',
          version: 'Rev 1.8',
          codexStepLabel: 'Facility & GMP Inspection',
          docTitle: 'Weekly Hospital Kitchen Structural & Equipment Hygiene Audit',
          purpose: 'Documents preventive facility checks across flooring, drainage, hood ventilation, lighting, water filtration, and cooking equipment prior to regulatory or JCI rounds.',
          fields: [
            { label: 'Lighting Standard', value: '≥ 500 Lux Prep/Tray Line (Shatterproof Sleeves)' },
            { label: 'Floor & Coving', value: 'Anti-slip epoxy/tile · Coved wall junctions' },
            { label: 'Exhaust & HVAC', value: 'Degreased baffle filters · Positive clean-zone airflow' },
            { label: 'Potable Water Check', value: 'Free Chlorine 0.2–0.5 ppm · Monthly Micro Test' }
          ],
          tablePreview: {
            headers: ['Facility Area', 'Inspection Criterion', 'Status', 'Corrective Action & Target Date'],
            rows: [
              ['Main Prep Zone', 'Hands-free sink operational, soap & paper stocked', 'PASS', 'None required'],
              ['Exhaust Canopy', 'Baffle filters free of grease drip over stoves', 'PASS', 'Scheduled deep-clean every Sunday'],
              ['Chiller #2 Door', 'Magnetic door gasket intact; zero ice buildup', 'ACTION', 'Engineering WO #442 raised — seal replacement 24h']
            ]
          },
          signOffLine: 'CDM Inspector ________ | Hospital Engineering Lead ________'
        },
        bulletPoints: [
          'Preventive Maintenance (PM): Maintain a live equipment asset register covering combi-ovens, blast chillers, dishmachines, and insulated meal trolleys.',
          'Food-Grade Lubricants (NSF H1): Confirm hospital maintenance engineers exclusively use food-grade H1 lubricants on mixers, slicers, and conveyor belts.'
        ],
        keyTakeaway:
          'A preventive engineering schedule avoids mid-service chiller failures, gasket leaks, and structural pest entry points.'
      }
    ]
  },

  // =========================================================================
  // MODULE 3
  // =========================================================================
  {
    id: 'cdm-v-mod-3',
    moduleNumber: 3,
    title: 'Essential Nutrition Science, Macronutrients, Hydration & Patient Screening',
    estimatedMinutes: 35,
    overview:
      'Apply core human nutrition principles to menu design, calculate patient calorie and protein delivery, monitor hydration needs, and execute first-line nutrition risk screening for timely RD escalation.',
    internationalClauses: [
      'WHO / DRI Clinical Energy & Protein Guidelines',
      'MST / MUST Hospital Malnutrition Screening Protocols'
    ],
    keyPrinciples: [
      'Macronutrients supply energy (Carbohydrates 4 kcal/g, Protein 4 kcal/g, Fat 9 kcal/g), while vitamins, minerals, fiber, and water drive immunity, healing, and electrolyte homeostasis.',
      'Hospital malnutrition increases length of stay and infection risk; CDMs track meal consumption percentages and screen weight/appetite changes to trigger prompt Clinical Dietitian referrals.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Low Intake Escalation Trigger',
        standardLimit: 'Any hospitalized patient consuming < 50% of meals for 3 consecutive days (or experiencing unintentional weight loss)',
        correctiveProtocol: 'Document intake log, interview patient on food preferences/chewing issues, and submit immediate Clinical Dietitian Referral.'
      }
    ],
    practicalChecklist: [
      'Verify daily hospital menus deliver balanced energy (1,800–2,200 kcal standard) and adequate high-biological-value protein.',
      'Review ward meal-intake sheets and ensure hydration rounds supply ≥ 1.5–2.0 L fluids daily (unless fluid-restricted).'
    ],
    quickCheck: {
      question: 'A post-surgical patient eats only 25% of breakfast, lunch, and dinner for 3 consecutive days and reports loss of appetite. What is the Certified Dietary Manager’s correct action?',
      options: [
        'Reduce the patient’s portion size permanently to save food cost',
        'Document the low intake, check patient food preferences/texture tolerance, and submit an immediate referral to the Clinical Dietitian',
        'Prescribe high-dose intravenous antibiotics and discharge the patient',
        'Wait 14 days to see if appetite returns naturally before recording anything'
      ],
      correctIndex: 1,
      explanation: 'Intake below 50% for 3 consecutive days is a clinical malnutrition red flag requiring documented preference review and prompt escalation to the Clinical Dietitian.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Macronutrients, Micronutrients & Hospital Energy Density',
        subtitle: 'Translating Nutritional Science Into Healing Patient Meals',
        tableBlock: {
          caption: 'Clinical Nutrition Quick-Reference for Hospital Menu Planning',
          headers: ['Nutrient Group', 'Energy / Role', 'Key Hospital Food Sources', 'Clinical Care Considerations'],
          rows: [
            ['Carbohydrates', '4 kcal/g · Primary brain & muscle fuel', 'Whole grains, oats, brown rice, legumes, fruits', 'Control portion & glycemic index for Diabetic diets (45–60 g/meal)'],
            ['Proteins', '4 kcal/g · Tissue repair, immunity & enzymes', 'Eggs, poultry, fish, lean meat, lentils, Greek yogurt', 'Increase to 1.2–1.5 g/kg for wounds, burns, sepsis & post-op healing'],
            ['Fats (Lipids)', '9 kcal/g · Concentrated energy & Vitamins A,D,E,K', 'Olive/canola oil, fatty fish, nuts, avocado', 'Limit saturated (<7% kcal) & zero trans fats for Cardiac patients'],
            ['Key Micronutrients', '0 kcal · Immunity, bone & wound healing', 'Vitamin C (citrus), Zinc (meat/seeds), Iron, Vit D, Ca', 'Protect water-soluble Vitamins B & C by steaming rather than over-boiling'],
            ['Fluids & Electrolytes', 'Hydration, renal balance & circulation', 'Potable water, broths, milk, herbal tea, oral shakes', 'Standard ~30 mL/kg/day; strictly measure for CHF & Dialysis fluid restrictions']
          ]
        },
        bulletPoints: [
          'Nutrient Retention in Bulk Cooking: Cook vegetables in small batches using steam/convection ovens to preserve Vitamin C, folate, color, and texture.',
          'Food-First Fortification: Enrich soups, mashed potatoes, and porridge with skim milk powder, egg whites, or olive oil to boost calories/protein for frail elderly patients without increasing plate volume.'
        ],
        keyTakeaway:
          'Every tray is clinical therapy — cooking methods directly determine whether patients absorb healing protein and vitamins.'
      },
      {
        slideNumber: 2,
        title: 'Nutrition Risk Screening, Malnutrition Red Flags & Intake Tracking',
        subtitle: 'Partnering With Nursing & Dietitians to Stop Hospital Malnutrition',
        twoColumns: {
          leftTitle: 'Malnutrition Red Flags (Refer to RD)',
          leftTone: 'rose',
          leftItems: [
            'Unintentional weight loss ≥ 5% in 1 month or ≥ 10% in 6 months',
            'Oral intake < 50% of prescribed meals for ≥ 3 consecutive days',
            'Chewing pain, ill-fitting dentures, coughing on liquids, or nausea',
            'Stage 2–4 pressure ulcers, severe burns, dialysis, or oncology cachexia'
          ],
          rightTitle: 'CDM Frontline Nutritional Support Actions',
          rightTone: 'emerald',
          rightItems: [
            'Conduct friendly patient meal-satisfaction & preference interviews within 24–48h of admission',
            'Honor cultural, religious (Halal/Vegetarian), and personal dislikes promptly',
            'Provide prescribed mid-morning / evening high-protein snacks & oral supplements (ONS)',
            'Track ward-level calorie/plate-waste trends and share with the Nutrition Committee'
          ]
        },
        documentTemplateBlock: {
          docCode: 'CDM-DOC-03',
          version: 'Rev 1.4',
          codexStepLabel: 'Clinical Nutrition Screening',
          docTitle: 'Patient Nutrition Preference, Intake & RD Referral Log',
          purpose: 'Captures admission food preferences, allergen verifications, 3-day meal intake %, and timely referrals to Clinical Dietitians.',
          fields: [
            { label: 'Screening Tool Used', value: 'Malnutrition Screening Tool (MST Score 0–5)' },
            { label: 'Referral Threshold', value: 'MST ≥ 2 or Intake < 50% × 3 Days' },
            { label: 'Allergen Cross-Check', value: 'Verified against EMR & Wristband' },
            { label: 'Completed By', value: 'Certified Dietary Manager / Diet Tech' }
          ],
          tablePreview: {
            headers: ['Patient / Bed', 'Diet Order', '3-Day Avg Intake', 'MST Score / Trigger', 'CDM Action Taken'],
            rows: [
              ['Bed 304 (M, 72y)', 'Cardiac Low-Na', '85%', '0 (Low Risk)', 'Honored preference: grilled fish over chicken'],
              ['Bed 311 (F, 64y)', 'High-Protein Soft', '35%', '3 (High Risk)', 'Immediate RD Referral sent; added chilled ONS shake'],
              ['Bed 318 (M, 55y)', 'Renal Low-K+', '75%', '1 (Monitor)', 'Confirmed potassium-leached vegetables on ticket']
            ]
          },
          signOffLine: 'CDM Signature ________ | Clinical Dietitian Received ________'
        },
        bulletPoints: [
          'Always verify patient food allergies against both the Electronic Medical Record (EMR) and bedside wristband.',
          'Escalate MST scores ≥ 2 or 3-day intake < 50% immediately so Clinical Dietitians can initiate oral nutrition support.'
        ],
        keyTakeaway:
          'Nutrition screening turns dietary staff into an early-warning shield against hospital-acquired malnutrition.'
      }
    ]
  },

  // =========================================================================
  // MODULE 4
  // =========================================================================
  {
    id: 'cdm-v-mod-4',
    moduleNumber: 4,
    title: 'Clinical Therapeutic Diets & Medical Nutrition Execution',
    estimatedMinutes: 40,
    overview:
      'Execute every major hospital therapeutic diet accurately — including Diabetic, Renal, Cardiac, Hepatic, Post-Operative, Neutropenic, and Allergen-Free orders — without kitchen cross-contact or nutrient errors.',
    internationalClauses: [
      'Academy of Nutrition & Dietetics (AND) Nutrition Care Manual',
      'Hospital Therapeutic Diet Formulary Standards'
    ],
    keyPrinciples: [
      'A therapeutic diet modifies nutrients, calories, fluids, or food safety rules to treat medical disease; serving an unapproved condiment or wrong salt packet can destabilize a critically ill patient.',
      'Therapeutic recipes must be prepared with measured seasonings (e.g., herbs/lemon instead of salt/MSG for cardiac/renal trays) and clearly coded on printed meal tickets.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Therapeutic Diet & Condiment Restriction Accuracy',
        standardLimit: '0% unauthorized sugar, salt sachets, high-potassium foods, or raw items on restricted clinical trays',
        correctiveProtocol: 'Pull the tray before cart loading, re-plate using verified therapeutic items, log Near-Miss / Variance Report, and coach tray-line server.'
      }
    ],
    practicalChecklist: [
      'Verify salt packets are strictly removed from Cardiac/Low-Sodium and Renal trays, and sugar packets removed from Diabetic trays.',
      'Confirm Neutropenic/Oncology trays contain zero raw salads, unpeeled fresh fruit, unpasteurized dairy, or pepper packets.'
    ],
    quickCheck: {
      question: 'Which food combination is UNSAFE and must NEVER be placed on a Renal (Chronic Kidney Disease / Low-Potassium, Low-Sodium) patient tray?',
      options: [
        'Steamed white rice, herb-seasoned skinless chicken breast, and peeled apple slices',
        'Banana, tomato soup, potato fries, orange juice, and salted packaged pickles',
        'Egg-white omelet, white toast with unsalted butter, and cranberry juice',
        'Boiled pasta with olive oil, garlic, and low-potassium cabbage'
      ],
      correctIndex: 1,
      explanation: 'Bananas, tomatoes, un-leached potatoes, and orange juice are very high in Potassium (risking fatal cardiac arrhythmia in renal failure), and salted pickles are excessive in Sodium.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'The 6 Core Hospital Therapeutic Diets',
        subtitle: 'Clinical Rationale, Allowed Foods & Strictly Prohibited Items',
        visualIllustration: 'cdm-therapeutic-diets',
        tableBlock: {
          caption: 'Hospital Therapeutic Diet Execution Matrix',
          headers: ['Therapeutic Diet', 'Target Clinical Limits', 'Recommended Kitchen Swaps', 'Strictly Avoid / Red Flags'],
          rows: [
            ['Diabetic (Carb-Controlled)', 'Consistent 45–60 g carbs/meal; zero simple sugars', 'Wholewheat chapati/oats, steamed veg, lean grilled protein, sugar-free jelly', 'Sweetened juices, white sugar sachets, syrups, pastries, sweet desserts'],
            ['Renal (Low Na+, K+, PO4)', 'Na <2,000 mg · K+ <2,000 mg · PO4 <800–1,000 mg', 'White rice, egg whites, peeled apples, grapes, double-boiled/leached veg', 'Bananas, oranges, tomatoes, potatoes, dark colas, dairy excess, salt substitutes (KCl!)'],
            ['Cardiac (Low-Na / Low-Fat)', 'Na ≤1,500–2,000 mg/day · Saturated fat <7%', 'Garlic, lemon, black pepper, herbs, baked fish, olive/canola oil', 'Table salt packets, soy sauce, stock cubes, processed deli meats, deep-fried food'],
            ['Clear vs Full Liquid', 'Post-op / GI rest progression', 'Clear: strained broth, apple juice, tea, gelatin · Full: milk, strained cream soup, yogurt', 'Clear liquid must NEVER contain milk, pulp, seeds, or opaque solids'],
            ['Neutropenic (Immunocompromised)', 'Minimal microbial load for chemotherapy/transplant', 'Well-done meat ≥75°C, UHT milk, canned fruit, individually sealed condiments', 'Raw salads, raw sprouts, soft unpasteurized cheese, deli cold cuts, raw honey']
          ]
        },
        calloutBanner: {
          label: 'Critical Clinical Safety Alert — Potassium Chloride Salt Substitutes',
          text: 'NEVER give commercial "Lo-Salt" or potassium-chloride salt substitutes to Renal patients! They replace sodium with potassium and can trigger life-threatening hyperkalemia.',
          tone: 'rose'
        },
        bulletPoints: [
          'Double-check every tray ticket for hidden sodium (stock cubes, soy sauce, pickles) on Cardiac/Renal orders and simple sugars on Diabetic orders.',
          'Potassium leaching (peeling, dicing, soaking, and double-boiling root vegetables in fresh water) significantly lowers potassium content for CKD meals.'
        ],
        keyTakeaway:
          'Therapeutic diet accuracy is clinical medication delivered on a plate — verify every condiment, beverage, and side dish.'
      },
      {
        slideNumber: 2,
        title: 'Managing Allergens, Celiac (Gluten-Free) & Cultural Diets',
        subtitle: 'Dedicated Purple-Zone Equipment & Controlled Diet Census',
        documentTemplateBlock: {
          docCode: 'CDM-DOC-04',
          version: 'Rev 2.1',
          codexStepLabel: 'Therapeutic Production Control',
          docTitle: 'Daily Therapeutic & Allergen-Safe Diet Master Census Sheet',
          purpose: 'Translates live EMR physician diet orders into exact batch counts for the Diet Cook and Allergen-Free station before cooking begins.',
          fields: [
            { label: 'Diet Manual Version', value: 'Hospital Clinical Diet Manual 2026' },
            { label: 'Allergen Kit Used', value: 'Dedicated Purple Boards, Knives & Pans' },
            { label: 'Diet Cook Assigned', value: 'Senior Therapeutic Chef' },
            { label: 'Pre-Service Tasting', value: 'Verified by CDM (Salt/Texture/Temp)' }
          ],
          tablePreview: {
            headers: ['Diet Category', 'Batch Count', 'Key Modification Rule', 'Ticket Color / Tag'],
            rows: [
              ['Diabetic 1800 kcal', '42 Trays', 'No sugar/honey; 1 measured starch portion', 'Blue Diabetic Band'],
              ['Renal Low-K+ / Low-Na', '14 Trays', 'Zero salt, zero tomato/potato; leached carrots', 'Yellow Renal Band'],
              ['Neutropenic (Oncology)', '9 Trays', 'Cooked ≥75°C; sealed UHT milk; zero raw garnish', 'Green Sterile Seal'],
              ['Celiac / Nut-Free', '3 Trays', 'Purple station first-run; double-checked ingredient labels', 'RED ALLERGEN FLAG']
            ]
          },
          signOffLine: 'Therapeutic Chef ________ | Certified Dietary Manager ________'
        },
        bulletPoints: [
          'Always prepare Allergen-Free and Celiac (Gluten-Free) meals FIRST on freshly sanitized surfaces using dedicated purple-handled tools, cover immediately, and label with patient full name & bed number.',
          'Check every composite ingredient label (sauces, gravy thickeners, spice blends) for hidden wheat, milk, soy, egg, peanut, tree nuts, fish, shellfish, or sesame.'
        ],
        keyTakeaway:
          'Dedicated purple utensils, label reading, and color-coded meal tickets stop fatal allergen and therapeutic errors.'
      }
    ]
  },

  // =========================================================================
  // MODULE 5
  // =========================================================================
  {
    id: 'cdm-v-mod-5',
    moduleNumber: 5,
    title: 'Texture-Modified Diets, Dysphagia Safety & The IDDSI Framework',
    estimatedMinutes: 35,
    overview:
      'Prevent choking and silent aspiration pneumonia by standardizing dysphagia foods and thickened liquids using the global IDDSI (Levels 0–7) framework and bedside Fork Drip, Spoon Tilt, and Syringe Flow tests.',
    internationalClauses: [
      'IDDSI Global Framework v2.0 (Levels 0–7)',
      'Speech-Language Pathologist (SLP) Dysphagia Safety Standards'
    ],
    keyPrinciples: [
      'Dysphagia (swallowing impairment in stroke, elderly, ICU, and neurological patients) can cause fatal choking or aspiration pneumonia if food lumps are too big or liquids are too thin.',
      'The CDM enforces standardized IDDSI testing (10 mL Syringe Flow Test for drinks; Fork Drip, Fork Pressure & Spoon Tilt Tests for foods) before every meal service.'
    ],
    criticalControlParameters: [
      {
        parameter: 'IDDSI Texture & Viscosity Verification',
        standardLimit: '100% compliance with prescribed IDDSI Level (e.g., Level 4 Pureed: zero lumps, passes Spoon Tilt; Level 5 Minced: ≤4 mm particle size)',
        correctiveProtocol: 'Re-blend, strain, or adjust food-grade thickener to specification; never serve mixed thin-liquid + solid foods (e.g., watery soup with chunks) to dysphagia patients.'
      }
    ],
    practicalChecklist: [
      'Keep a laminated IDDSI testing chart, 10 mL slip-tip syringes, and metal testing forks at the Diet Cooking station.',
      'Verify ice cream, gelatin, and soup do not melt into thin Level 0 liquid in the mouth for patients ordered Thickened Liquids.'
    ],
    quickCheck: {
      question: 'A stroke patient is prescribed an IDDSI Level 4 (Pureed) diet with Level 2 (Mildly Thick) drinks. Which item is DANGEROUS and must be removed from their tray immediately?',
      options: [
        'Smooth pureed chicken that holds shape on a spoon and slides cleanly off when tilted',
        'A cup of vanilla ice cream and a bowl of thin clear broth with diced vegetable chunks',
        'Smooth pureed sweet potato with no lumps or liquid separation',
        'Pre-thickened apple juice verified at 6 mL remaining on a 10-second IDDSI syringe flow test'
      ],
      correctIndex: 1,
      explanation: 'Ice cream melts into Level 0 thin liquid inside the mouth, and broth with vegetable chunks is a dangerous dual-consistency food that causes rapid aspiration.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Understanding the Global IDDSI Dysphagia Scale (Levels 0–7)',
        subtitle: 'Eliminating Ambiguous Labels Like "Soft" or "Semi-Solid"',
        visualIllustration: 'cdm-iddsi-levels',
        calloutBanner: {
          label: 'Zero-Aspiration Kitchen Rule: Avoid Dual-Consistency & Melting Foods',
          text: 'Patients on Thickened Liquids (Levels 1–4) must NEVER receive ice cream, jelly/gelatin, watermelon, or cereal swimming in thin milk — these melt or separate into thin liquid in the throat and enter the lungs!',
          tone: 'amber'
        },
        bulletPoints: [
          'Why IDDSI Replaced Old Terms: Words like "soft diet" meant different things in every kitchen; IDDSI gives exact measurable particle sizes (4 mm for Level 5, 1.5 cm for Level 6) and objective tests.',
          'Dignity & Presentation: Use food molds, piping bags, and vibrant natural colors for Level 4 pureed meals so patients enjoy eating and avoid malnutrition.'
        ],
        keyTakeaway:
          'Standardized IDDSI testing transforms dysphagia meal prep from guesswork into measurable life-saving precision.'
      },
      {
        slideNumber: 2,
        title: 'Objective IDDSI Kitchen Testing Methods & Verification Log',
        subtitle: 'Syringe Flow Test, Fork Drip Test, Fork Pressure & Spoon Tilt',
        tableBlock: {
          caption: 'Mandatory IDDSI Pre-Service Verification Tests',
          headers: ['IDDSI Test Method', 'Used For', 'How to Perform on the Line', 'Pass Criterion'],
          rows: [
            ['10 mL Syringe Flow Test', 'Drinks (Levels 0–3)', 'Fill 10 mL slip-tip syringe to 10 mL mark; release nozzle for exactly 10 seconds', 'L0: 0 mL · L1: 1–4 mL · L2: 4–8 mL · L3: >8 mL left'],
            ['Fork Drip Test', 'Level 3 & Level 4', 'Scoop food onto fork tines and observe drip behavior', 'L4 Pureed sits in a mound above fork; does not continuously drip through'],
            ['Spoon Tilt Test', 'Level 4 Pureed & L5', 'Hold sample on teaspoon, tilt sideways and flick gently', 'Holds shape on spoon, slides off cleanly with almost no sticky residue'],
            ['Fork Pressure Test', 'Level 5 (4 mm) & L6 (1.5 cm)', 'Press side/tines of fork until thumbnail blanches white', 'Sample squashes easily and does not spring back; fits 4 mm / 1.5 cm size rule']
          ]
        },
        documentTemplateBlock: {
          docCode: 'CDM-DOC-05',
          version: 'Rev 1.5',
          codexStepLabel: 'Dysphagia Safety CCP Log',
          docTitle: 'Pre-Service IDDSI Texture & Thickened Fluid Verification Log',
          purpose: 'Verifies that every batch of pureed, minced-moist, soft bite-sized food and thickened liquid meets IDDSI standards at actual serving temperature.',
          fields: [
            { label: 'Service Shift', value: 'Lunch & Dinner Dysphagia Line' },
            { label: 'Testing Tools', value: '10 mL BD Syringe · Standard 4 mm Fork · Teaspoon' },
            { label: 'Temperature Check', value: 'Tested at Serving Temp (≥ 63°C Hot / ≤ 5°C Cold)' },
            { label: 'Verified By', value: 'Diet Chef & Certified Dietary Manager' }
          ],
          tablePreview: {
            headers: ['Menu Item', 'Target IDDSI', 'Test Performed', 'Result', 'Sign-Off'],
            rows: [
              ['Pureed Roast Chicken & Gravy', 'Level 4 Pureed', 'Fork Drip + Spoon Tilt', 'PASS (Cohesive, zero lumps)', 'CDM ✓'],
              ['Minced Spinach & Lentils', 'Level 5 Minced', '4 mm Slot + Fork Pressure', 'PASS (No liquid separation)', 'CDM ✓'],
              ['Thickened Orange Drink', 'Level 2 Mildly Thick', '10 mL Syringe (10 sec)', '6.2 mL left — PASS', 'CDM ✓']
            ]
          },
          signOffLine: 'Diet Chef ________ | CDM Pre-Release Approval ________'
        },
        bulletPoints: [
          'Perform both the 10 mL Syringe Flow Test (for drinks) and Fork Drip / Spoon Tilt tests (for pureed/minced meals) before opening the tray line.',
          'Document every batch test on CDM-DOC-05 and re-check viscosity whenever hot thickened soups sit longer than 20 minutes.'
        ],
        keyTakeaway:
          'Always test IDDSI consistency at actual serving temperature — starches thicken as they cool and thin out if reheated.'
      }
    ]
  },

  // =========================================================================
  // MODULE 6
  // =========================================================================
  {
    id: 'cdm-v-mod-6',
    moduleNumber: 6,
    title: 'Hospital Food Safety Hazards, Microbiology & Vulnerable (YOPI) Patients',
    estimatedMinutes: 35,
    overview:
      'Protect immunologically vulnerable hospital populations (Young, Old, Pregnant, Immunocompromised — YOPI) by mastering the 4 hazard classes, bacterial growth kinetics on the interactive Germometer, and high-risk hospital food controls.',
    internationalClauses: [
      'Codex Alimentarius CXC 1-1969 Hazard Control',
      'WHO Five Keys to Safer Food in Healthcare Settings'
    ],
    keyPrinciples: [
      'Hospital patients belong to the highest-risk YOPI demographic: low infectious doses of Listeria, Salmonella, E. coli, or Norovirus that cause mild upset in healthy adults can be fatal in hospitalized patients.',
      'Controlling FATTOM factors — especially keeping perishable food out of the 5°C–63°C Temperature Danger Zone — prevents logarithmic bacterial multiplication and spore germination.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Hospital Danger Zone & Core Lethality Control',
        standardLimit: 'Cold ≤ 5°C · Hot ≥ 63°C · Poultry/Minced/Reheated Core ≥ 75°C',
        correctiveProtocol: 'Discard any high-risk hospital meal exposed between 5°C and 63°C for > 2 hours (stricter hospital YOPI limit).'
      }
    ],
    practicalChecklist: [
      'Enforce zero bare-hand contact with ready-to-eat (RTE) patient salads, fruits, sandwiches, and bread.',
      'Verify chilled desserts, oral nutrition shakes, and cooked rice are rapidly chilled and never left on ward counters.'
    ],
    quickCheck: {
      question: 'Why are Listeria monocytogenes and Salmonella uniquely dangerous in a hospital dietary department compared to a standard public restaurant?',
      options: [
        'Hospital kitchens operate at higher humidity than restaurants',
        'Hospital patients are predominantly YOPI (Young, Old, Pregnant, Immunocompromised), where even low pathogen levels can cause sepsis, meningitis, or fatality',
        'Listeria only grows inside stainless steel hospital trolleys',
        'Antibiotics in hospitals make food bacteria immune to 75°C cooking'
      ],
      correctIndex: 1,
      explanation: 'YOPI patients have weakened immune defenses, making zero-tolerance pathogen prevention, chilled ≤4°C control (Listeria grows slowly even in cold!), and ≥75°C cooking essential.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'The Four Food Safety Hazards in Hospital Kitchens',
        subtitle: 'Interactive Classification of Clinical Dietary Contamination Risks',
        visualIllustration: 'four-hazards',
        bulletPoints: [
          'Microbiological: Salmonella (poultry/eggs), Listeria monocytogenes (chilled RTE foods, soft cheese — grows even at 4°C!), Bacillus cereus (warm rice), Clostridium perfringens (slow-cooled stews), Norovirus (sick food handlers).',
          'Physical: Broken ceramic plate chips, metal scourer strands, bone splinters in fish/poultry, staples from grocery cartons.',
          'Chemical: Quaternary sanitizer spray landing on patient trays, dishmachine detergent residue, unapproved pest sprays.',
          'Allergenic: Cross-contact of peanuts, milk, egg, gluten, soy, or sesame onto allergen-restricted patient trays.'
        ],
        classifierDrill: [
          {
            item: 'Stainless steel wire bristle from a worn kitchen pot scourer found in pureed soup',
            category: 'Physical',
            reason: 'Hard metallic foreign object posing severe internal laceration or choking hazard to a patient.'
          },
          {
            item: 'Listeria monocytogenes multiplying on pre-sliced chilled turkey stored at 7°C for 5 days',
            category: 'Microbiological',
            reason: 'Cold-tolerant pathogenic bacterium capable of causing fatal sepsis in elderly or pregnant patients.'
          },
          {
            item: 'Alkaline oven degreaser overspray contaminating uncovered patient dessert bowls',
            category: 'Chemical',
            reason: 'Corrosive cleaning chemical entering ready-to-eat patient food.'
          },
          {
            item: 'Trace walnut oil transferred via an unwashed ladle onto a nut-allergic pediatric tray',
            category: 'Allergenic',
            reason: 'Tree nut proteins can trigger life-threatening anaphylactic shock even in trace amounts.'
          }
        ],
        keyTakeaway:
          'Never use steel wool scourers in hospital kitchens, store chemicals locked away from food, and segregate all allergens.'
      },
      {
        slideNumber: 2,
        title: 'Bacterial Spores, Danger Zone & Interactive Hospital Germometer',
        subtitle: 'Click Every Temperature Stop (-18°C to 100°C) to Master Thermal Control',
        visualIllustration: 'microbe-spore',
        germometerInteractive: true,
        highLowRiskDrill: [
          {
            food: 'Cooked chicken biryani held in a disconnected ward cart at 42°C for 3 hours',
            risk: 'High-Risk',
            reason: 'High protein & moisture held at peak Danger Zone allows Bacillus cereus & Clostridium perfringens spore outgrowth.'
          },
          {
            food: 'Unopened UHT tetra-pack milk stored in dry store at 20°C',
            risk: 'Low-Risk',
            reason: 'Commercially sterile aseptic packaging prevents microbial growth until opened.'
          },
          {
            food: 'Freshly pureed custard dessert for geriatric ward held unchilled on counter',
            risk: 'High-Risk',
            reason: 'Dairy protein, neutral pH, high moisture, and zero downstream cooking step.'
          },
          {
            food: 'Individually sealed packets of dry salted crackers for clear-liquid transition',
            risk: 'Low-Risk',
            reason: 'Very low water activity (Aw < 0.50) prevents bacterial multiplication.'
          }
        ],
        bulletPoints: [
          'Click each stop on the interactive Germometer above to compare Freezing (-18°C), Chilled (1°C–5°C), Peak Danger Zone (37°C), Hot Hold (≥ 63°C), and Cooking Lethality (≥ 75°C).',
          'Classify each hospital food item above — ready-to-eat high-protein, high-moisture dishes require strict cold/hot thermal control.'
        ],
        keyTakeaway:
          'In hospital foodservice, keep cold food ≤ 4°C (limit ≤ 5°C), hot food ≥ 63°C, and discard time-temperature abused items after 2 hours.'
      }
    ]
  },

  // =========================================================================
  // MODULE 7
  // =========================================================================
  {
    id: 'cdm-v-mod-7',
    moduleNumber: 7,
    title: 'Hospital Dietary SOPs & Prerequisite Hygiene Programmes (PRPs)',
    estimatedMinutes: 35,
    overview:
      'Execute rock-solid Prerequisite Programmes on the hospital kitchen floor through 5 interactive Standard Operating Procedures: Hand Hygiene & 48-Hour Illness Exclusion, Color-Coded Boards, Commercial Dishmachine Sanitizing, Pest Control, and Allergen/NPO Controls.',
    internationalClauses: [
      'Codex GHP Prerequisite Programmes',
      'WHO Hand Hygiene & Hospital Infection Prevention (IPC)'
    ],
    keyPrinciples: [
      'Prerequisite SOPs eliminate baseline environmental contamination before a single patient meal is cooked.',
      'Every kitchen staff member must know exact sanitizer concentrations (e.g., 50–100 ppm chlorine or 200 ppm quat), dishmachine final rinse temperature (≥ 82°C), and the mandatory 48-hour symptom-free return rule after GI illness.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Commercial Dishmachine Sanitizing Rinse',
        standardLimit: 'Wash tank 55°C–65°C · Thermal Sanitizing Final Rinse ≥ 82°C (or validated 50–100 ppm chlorine chemical rinse)',
        correctiveProtocol: 'Stop warewashing immediately if rinse gauge drops < 82°C; switch to validated 3-sink wash-rinse-sanitize manual SOP and call Engineering.'
      }
    ],
    practicalChecklist: [
      'Inspect every food handler’s nails, hairnet/beard snood, clean uniform, zero jewelry, and health status at shift start.',
      'Check dishmachine wash/rinse gauges and chemical sanitizer test strips at the start of every meal shift.'
    ],
    quickCheck: {
      question: 'What is the minimum required thermal sanitizing final rinse temperature in a commercial hospital dishmachine to kill foodborne pathogens on patient trays?',
      options: [
        '45°C',
        '60°C',
        '82°C (180°F)',
        '37°C'
      ],
      correctIndex: 2,
      explanation: 'High-temperature commercial dishmachines must maintain a final sanitizing rinse of at least 82°C (180°F) so plate surface temperature reaches ≥ 71°C for effective thermal sanitization.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Prerequisite Hygiene Programmes: Foundation of Hospital Food Safety',
        subtitle: 'Interactive Floor SOPs — Click Each Protocol Tab Below',
        visualIllustration: 'prp-foundation',
        prpProceduresBlock: [
          {
            prpCode: 'CDM-SOP-01',
            prpName: 'Hand Hygiene, PPE & 48-Hour Illness Rule',
            objective: 'Prevent Norovirus, Staphylococcus, and enteric pathogen transfer from food handlers to vulnerable patients.',
            steps: [
              'Remove watches, rings, and nail polish; cover hair/beard completely with hairnets and wear clean department-issued uniform & apron.',
              'Wash hands for ≥ 20 seconds using warm water and liquid antibacterial soap before entering kitchen, after restroom use, after touching raw meat, trash, or face, and before putting on gloves.',
              'Cover minor clean cuts with a bright BLUE waterproof detectable plaster PLUS a disposable food-grade glove.',
              'Exclude any staff reporting vomiting, diarrhea, jaundice, fever with sore throat, or infected skin lesions immediately — permit return ONLY after 48 hours completely symptom-free and medical clearance.'
            ],
            verificationRecord: 'Daily Staff Hygiene & Fitness-to-Work Sign-In Log (checked by CDM every morning).'
          },
          {
            prpCode: 'CDM-SOP-02',
            prpName: 'Color-Coded Cutting Boards & Utensil Segregation',
            objective: 'Eliminate raw-to-cooked and allergen cross-contamination during meal preparation.',
            steps: [
              'RED: Raw red meat · YELLOW: Raw poultry · BLUE: Raw fish/seafood.',
              'GREEN: Raw fruits & washed salads · BROWN: Unwashed root vegetables.',
              'WHITE: Bakery, dairy & ready-to-eat cooked items · PURPLE: Dedicated Allergen-Free / Celiac (Gluten-Free) preparation ONLY.',
              'Wash, rinse, sanitize (200 ppm quat or 100 ppm chlorine), and air-dry boards vertically on slotted racks after each batch; discard deeply scored boards.'
            ],
            verificationRecord: 'Pre-Operational Sanitation Verification Checklist & Monthly Board Replacement Audit.'
          },
          {
            prpCode: 'CDM-SOP-03',
            prpName: 'Commercial Dishmachine & 3-Sink Manual Sanitizing',
            objective: 'Guarantee every returning patient plate, lid, and utensil is sanitized free of hospital pathogens.',
            steps: [
              'Scrape food waste into pedal-operated bins and pre-rinse soiled dishes in the isolated Zone 6 Scullery.',
              'Verify commercial dishmachine Wash Tank = 55°C–65°C and Final Thermal Sanitizing Rinse ≥ 82°C (if chemical machine, verify 50–100 ppm chlorine with test strip).',
              'If machine fails, execute 3-Compartment Sink SOP: Sink 1 Wash (detergent ≥ 45°C) → Sink 2 Clean Rinse → Sink 3 Sanitize (50–100 ppm chlorine ≥ 1 min or 200 ppm quat) → Air Dry ONLY (never towel-dry!).',
              'Store sanitized trays inverted on clean mobile racks protected from splashes.'
            ],
            verificationRecord: 'Shift Dishmachine Temperature & Sanitizer Strip Log (logged 3× daily).'
          },
          {
            prpCode: 'CDM-SOP-04',
            prpName: 'Integrated Pest Management (IPM) & Waste Control',
            objective: 'Maintain a 100% pest-free hospital kitchen without risking toxic pesticide contamination.',
            steps: [
              'Seal door sweeps (< 3 mm gap), fit intact mesh flyscreens on windows, and install UV shatterproof electric fly killers AWAY from open food prep.',
              'Line waste bins with heavy-duty bags, keep foot-pedal lids closed, and empty whenever 75% full via the external waste corridor.',
              'Allow only licensed IPM contractors to service numbered external bait stations and internal non-toxic glue traps; maintain SDS sheets in the CDM binder.',
              'Inspect incoming cardboard produce crates outside Zone 2 and transfer dry items into sealed food-grade containers.'
            ],
            verificationRecord: 'Monthly Licensed Pest Control Trend Report & Sighting Action Log.'
          },
          {
            prpCode: 'CDM-SOP-05',
            prpName: 'Allergen Isolation & NPO Rapid-Pull Protocol',
            objective: 'Zero patient anaphylaxis events and zero surgical cancellations caused by NPO tray errors.',
            steps: [
              'Highlight every patient allergy and NPO status in bold red on the Ward Diet Sheet and tray ticket.',
              'Cook and plate allergen-free meals FIRST using Purple tools; seal tray with tamper-evident allergen sticker before regular line starts.',
              'Upon receiving a phone or EMR "NPO" update from a ward nurse, immediately pull the tray from the line or call the cart runner via radio/phone BEFORE bedside delivery.',
              'Verify every late/new admission meal ticket against the EMR before releasing from the kitchen.'
            ],
            verificationRecord: 'Daily Allergen & NPO Verification Register signed by Tray-Line Checker.'
          }
        ],
        bulletPoints: [
          'Inspect all five interactive Hospital SOP tabs above — covering Hand Hygiene & 48h Illness Exclusion, Color-Coded Boards, Commercial Dishmachine ≥ 82°C Rinse, IPM, and Allergen/NPO Pulls.',
          'Post waterproof SOP quick-reference charts directly at handwash sinks, prep tables, and the dishmachine control panel.'
        ],
        keyTakeaway:
          'Written SOPs only protect patients when checked live on the floor every single shift with objective gauges and test strips.'
      }
    ]
  },

  // =========================================================================
  // MODULE 8
  // =========================================================================
  {
    id: 'cdm-v-mod-8',
    moduleNumber: 8,
    title: 'Cycle Menu Planning, Standardized Recipes & Portion Control Engineering',
    estimatedMinutes: 35,
    overview:
      'Design nutritionally balanced 14-day or 28-day hospital cycle menus, write ironclad Standardized Recipes with exact Edible Portion (EP) yields, and enforce calibrated scoops and ladles for consistent patient nutrition and food cost.',
    internationalClauses: [
      'Institutional Cycle Menu Engineering Best Practices',
      'Standardized Portion & Nutrient Consistency Standards'
    ],
    keyPrinciples: [
      'A 14-day or 28-day Cycle Menu prevents patient menu fatigue, streamlines seasonal purchasing, stabilizes food cost, and simplifies staff training.',
      'Standardized Recipes ensure every chef produces the exact same taste, calorie/sodium content, portion yield, and cost per serving — regardless of who is on shift.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Portion Size & Nutrient Accuracy',
        standardLimit: '± 5% tolerance on standardized scoop/ladle weight across all therapeutic and regular servings',
        correctiveProtocol: 'Re-calibrate tray-line serving utensils before startup; audit 3 random plated portions per meal on a digital scale.'
      }
    ],
    practicalChecklist: [
      'Post laminated Standardized Recipe Cards and a Scoop/Ladle Portion Chart directly at the cooking and tray assembly stations.',
      'Check seasonal ingredient availability and cultural/religious preferences (Halal, local favorites) before locking each quarterly cycle menu.'
    ],
    quickCheck: {
      question: 'If a hospital recipe uses a #8 portion scoop (disher) to serve mashed potatoes on Diabetic patient trays, approximately how much volume does one level #8 scoop hold?',
      options: [
        '1 cup (240 mL)',
        '1/2 cup (4 fl oz / ~120 mL)',
        '1 tablespoon (15 mL)',
        '2 cups (480 mL)'
      ],
      correctIndex: 1,
      explanation: 'Scoop numbers equal the number of scoops per quart (32 fl oz): 32 ÷ 8 = 4 fl oz = 1/2 cup (~120 mL), ensuring exact carbohydrate consistency for Diabetic patients.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Cycle Menu Architecture & Portion Utensil Calibration',
        subtitle: 'Balancing Patient Enjoyment, Clinical Accuracy & Kitchen Efficiency',
        twoColumns: {
          leftTitle: 'Cycle Menu Design Principles (14–28 Days)',
          leftTone: 'blue',
          leftItems: [
            'Matches average hospital stay (long-term care uses 28-day; acute care uses 7–14 day cycles)',
            'Balances color, texture, flavor, cooking method & equipment load (avoid overloading ovens)',
            'Adapts seamlessly from one "Master Regular Menu" into Diabetic, Renal, Cardiac & IDDSI extensions',
            'Incorporates seasonal produce to maximize freshness and keep PPD food cost predictable'
          ],
          rightTitle: 'Why Standardized Recipes Are Mandatory',
          rightTone: 'emerald',
          rightItems: [
            'Guarantees identical Sodium, Potassium, Carbohydrate & Protein values per serving',
            'Eliminates chef guesswork — new cooks deliver consistent hospital quality on Day 1',
            'Prevents over-production waste and mid-service food run-outs (exact batch scaling)',
            'Locks in accurate Food Cost per portion for monthly hospital budgeting'
          ]
        },
        tableBlock: {
          caption: 'Essential Hospital Portion Control Scoops (Dishers) & Ladles Guide',
          headers: ['Utensil Size', 'Exact Volume (fl oz / mL)', 'Cup Equivalent', 'Typical Hospital Application'],
          rows: [
            ['#6 Scoop', '5.3 fl oz (~160 mL)', '2/3 Cup', 'Main starch (rice/pasta) for High-Calorie / Regular'],
            ['#8 Scoop', '4.0 fl oz (~120 mL)', '1/2 Cup', 'Diabetic measured rice, mashed potato, pureed entrée'],
            ['#10 Scoop', '3.2 fl oz (~95 mL)', '2/5 Cup', 'Standard cooked vegetables, hot cereal, custard'],
            ['#12 Scoop', '2.7 fl oz (~80 mL)', '1/3 Cup', 'Soft fruit, side salad, pudding desserts'],
            ['#16 Scoop', '2.0 fl oz (~60 mL)', '1/4 Cup', 'Pureed side veg, thick sauce, renal restricted sides'],
            ['4 oz / 6 oz Ladle', '120 mL / 180 mL', '1/2 – 3/4 Cup', 'Measured soups, dals, broths & gravies']
          ]
        },
        bulletPoints: [
          'Adapt one Master Cycle Menu cleanly across Regular, Diabetic, Cardiac, Renal, and IDDSI extensions to simplify kitchen prep and ordering.',
          'Use calibrated numbered scoops (#6, #8, #10, #12, #16) and oz ladles on every tray-line shift to lock in exact calories and food cost.'
        ],
        keyTakeaway:
          'Scoop Number = Scoops per 32 fl oz Quart (#8 = 1/2 cup; #16 = 1/4 cup) — the easiest way to guarantee therapeutic nutrient consistency.'
      },
      {
        slideNumber: 2,
        title: 'Hospital Standardized Recipe & Yield Engineering Card',
        subtitle: 'Integrating HACCP CCPs, Allergens & Cost Into One Master Card',
        documentTemplateBlock: {
          docCode: 'CDM-DOC-06',
          version: 'Rev 3.0',
          codexStepLabel: 'Production Standardization',
          docTitle: 'Standardized Hospital Recipe Card (50 Portions — Diabetic & Cardiac Friendly)',
          purpose: 'Controls exact ingredient weights (AP vs EP), allergen flags, cooking CCP lethality limit, serving utensil, nutrient profile, and cost per serving.',
          fields: [
            { label: 'Recipe Name & Yield', value: 'Herb-Steamed Lemon Chicken (50 × 100 g Cooked)' },
            { label: 'Serving Utensil', value: 'Calibrated 100 g Tongs + 2 oz Low-Na Jus Ladle' },
            { label: 'CCP Cooking Limit', value: 'Internal Core ≥ 75°C for 15 sec (Probe Thickest Piece)' },
            { label: 'Nutrition / Allergens', value: '165 kcal · 28 g Protein · 140 mg Na · Allergens: NONE' }
          ],
          tablePreview: {
            headers: ['Ingredient', 'As Purchased (AP)', 'Edible Portion (EP)', 'Prep / Scaling Note'],
            rows: [
              ['Skinless Chicken Breast', '6.25 kg', '5.00 kg (80% yield)', 'Trim fat; cut uniform 125 g raw fillets'],
              ['Fresh Lemon Juice & Herbs', '450 mL', '450 mL (100%)', 'Zero table salt; rosemary, thyme & garlic'],
              ['Olive Oil (Cold-Pressed)', '200 mL', '200 mL (100%)', 'Light brush before combi-steam roast at 165°C']
            ]
          },
          signOffLine: 'Executive Chef ________ | Clinical Dietitian & CDM Approved ________'
        },
        bulletPoints: [
          'Scaling Factor Formula: Factor = Desired Portions ÷ Original Recipe Yield. Multiply every ingredient weight by the exact Factor (always weigh dry/meat items in grams/kg rather than volume cups!).',
          'As Purchased (AP) vs Edible Portion (EP): If spinach has 75% yield and you need 6 kg EP, order AP = 6 ÷ 0.75 = 8.0 kg.'
        ],
        keyTakeaway:
          'Weighing ingredients and applying AP/EP yield factors prevents both clinical shortage and budget overruns.'
      }
    ]
  },

  // =========================================================================
  // MODULE 9
  // =========================================================================
  {
    id: 'cdm-v-mod-9',
    moduleNumber: 9,
    title: 'Ethical Procurement, Receiving Gatekeeper & FIFO/FEFO Inventory Control',
    estimatedMinutes: 30,
    overview:
      'Protect hospital food quality and budgets from the loading bay inward using written purchase specifications, Approved Supplier Lists, strict receiving temperature rejection rules, and FIFO/FEFO Par-Level store management.',
    internationalClauses: [
      'ISO 22000 Supplier Evaluation & Purchasing Controls',
      'Hospital Ethical Procurement & Cold-Chain Receiving SOP'
    ],
    keyPrinciples: [
      'Food safety and cost control begin at the Receiving Bay: once you sign an invoice for warm meat or short-weight produce, the hospital inherits the hazard and the financial loss.',
      'Strict FIFO (First-In, First-Out) and FEFO (First-Expired, First-Out) stock rotation, Par-Level reordering, and vertical chiller zoning eliminate spoilage and cross-contamination.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Cold-Chain Receiving Temperature Gatekeeper',
        standardLimit: 'Chilled foods ≤ 5°C (Target ≤ 4°C) · Frozen foods ≤ -18°C (rock solid, zero thaw crystals) · Intact packaging & valid expiry',
        correctiveProtocol: 'REJECT warm, thawed, dented/swollen canned, pest-infested, or short-dated deliveries immediately; issue Supplier Non-Conformance Report and do not sign invoice.'
      }
    ],
    practicalChecklist: [
      'Never sign a supplier delivery invoice before physically weighing items on a calibrated receiving scale and probing chilled/frozen temperatures.',
      'Audit chiller vertical shelving daily: Ready-to-Eat on TOP, raw vegetables in MIDDLE, raw meat/poultry in leak-proof trays on BOTTOM.'
    ],
    quickCheck: {
      question: 'A supplier delivers 40 kg of fresh chilled chicken breasts for tomorrow’s hospital lunch. Your calibrated digital probe reads +9.5°C between packs. What must you do?',
      options: [
        'Accept the chicken and immediately cook it at 85°C to save time',
        'Accept it at a 20% discount and put it in the deep freezer immediately',
        'Reject the delivery immediately at the receiving bay, record a Supplier Non-Conformance Report, and source from an approved backup vendor',
        'Wash the chicken with hot water and store it on the top shelf of the chiller'
      ],
      correctIndex: 2,
      explanation: 'Chilled poultry above 5°C has already entered the bacterial Danger Zone; it must be rejected at receiving to protect vulnerable hospital patients.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Approved Supplier Gatekeeping & Receiving Bay Controls',
        subtitle: 'Stopping Unsafe or Short-Weight Stock Before It Enters Your Hospital',
        visualIllustration: 'approved-supplier',
        bulletPoints: [
          'Written Purchase Specifications: Define exact grade, cut weight, fat %, Halal certification, packaging size, minimum remaining shelf-life, and delivery temperature for every item.',
          'Ethical Procurement: Obtain competitive bids from Approved Suppliers only; enforce zero conflict-of-interest/kickback policies and verify Invoice vs Purchase Order vs Physical Delivery (3-Way Match).',
          'Immediate Rejection Criteria: Chilled > 5°C, thawed/refrozen crystals, swollen/rusty/seam-dented cans (Botulism risk!), expired dates, broken seals, or dirty delivery trucks.'
        ],
        keyTakeaway:
          'Your signature on the delivery note is a legal and clinical certification that the food is safe, complete, and correctly priced.'
      },
      {
        slideNumber: 2,
        title: 'Store Zoning, FIFO/FEFO Rotation & Par-Level Control',
        subtitle: 'Maximizing Shelf-Life While Maintaining Zero Spoilage',
        visualIllustration: 'cdm-inventory-fifo',
        documentTemplateBlock: {
          docCode: 'CDM-DOC-07',
          version: 'Rev 2.0',
          codexStepLabel: 'Receiving & Store Control',
          docTitle: 'Daily Cold-Chain Receiving & Supplier Non-Conformance Log',
          purpose: 'Records delivery weights, probed temperatures, supplier batch/lot codes (for 4-hour traceability), and immediate rejections.',
          fields: [
            { label: 'Receiving Scale Check', value: 'Calibrated ± 10 g Weekly' },
            { label: 'Probe Thermometer ID', value: 'DIG-REC-01 (Ice-Point 0.0°C Verified)' },
            { label: 'Chiller Limit / Freezer', value: '≤ 5°C Chilled · ≤ -18°C Frozen' },
            { label: 'Storekeeper / Receiver', value: 'Authorized Dietary Storekeeper' }
          ],
          tablePreview: {
            headers: ['Time / Vendor', 'Item & Batch Lot #', 'Temp (°C)', 'Expiry / Spec', 'Accept / Reject'],
            rows: [
              ['07:15 · Al-Noor Poultry', 'Fresh Chicken Breast · LOT-P982', '+3.2°C', 'Intact · Halal Cert OK', 'ACCEPTED'],
              ['07:40 · FreshDairy Co.', 'Pasteurized Milk · LOT-D441', '+7.8°C', 'Above 5°C Limit!', 'REJECTED — NCR #19'],
              ['08:05 · MedFoods Dry', 'UHT Oral Shakes · LOT-U112', 'Ambient 21°C', 'Exp Nov 2027 · Sealed', 'ACCEPTED']
            ]
          },
          signOffLine: 'Storekeeper ________ | CDM Daily Audit Sign-Off ________'
        },
        bulletPoints: [
          'Par-Level System: Set a Minimum Par (reorder trigger) and Maximum Par (storage cap) for every item so you never run out during emergencies or tie up hospital cash in rotting excess stock.',
          'Physical Inventory Security: Keep high-value items (meat, cooking oil, dry milk, oral nutrition supplements) locked with signed Daily Store Issue Requisition slips.'
        ],
        keyTakeaway:
          'FEFO rotation, vertical cold-store zoning, and signed store requisitions cut food pilferage and spoilage dramatically.'
      }
    ]
  },

  // =========================================================================
  // MODULE 10
  // =========================================================================
  {
    id: 'cdm-v-mod-10',
    moduleNumber: 10,
    title: 'Bulk Production, Batch Cooking, Rapid Blast-Chilling & Thermal Control',
    estimatedMinutes: 35,
    overview:
      'Control thermal Critical Control Points across both Cook-Serve and Cook-Chill hospital kitchens: safe thawing, batch cooking lethality, 2-stage rapid blast-chilling, calibrated probe checks, and safe reheating.',
    internationalClauses: [
      'Codex Thermal Processing & Rapid Cooling Standards',
      'Hospital Cook-Chill / Cook-Serve HACCP Controls'
    ],
    keyPrinciples: [
      'Batch cooking in smaller staggered trays preserves vitamins, flavor, and hot-holding temperatures far better than cooking all hospital meals 3 hours ahead of service.',
      'When cooling bulk cooked food (e.g., soups, gravies, cook-chill batches), pass rapidly through the Danger Zone using blast chillers or shallow pans + ice-water baths (60°C → 21°C in ≤ 2h, then 21°C → ≤ 5°C within 4 more hours; or 63°C → ≤ 5°C within 90 min in Cook-Chill).'
    ],
    criticalControlParameters: [
      {
        parameter: 'Core Cooking, Rapid Cooling & Reheating Limits',
        standardLimit: 'Cook ≥ 75°C · Reheat ≥ 75°C (once only) · Blast-Chill to ≤ 5°C within 90 mins (2-stage max 6h total)',
        correctiveProtocol: 'Continue heating until core reaches ≥ 75°C; if cooling fails time limits, discard batch immediately — reheating will NOT destroy heat-stable toxins!'
      }
    ],
    practicalChecklist: [
      'Calibrate kitchen digital probe thermometers weekly using Ice-Point (0°C ± 0.5°C) and Boiling-Water (100°C ± 0.5°C) verification.',
      'Sanitize thermometer probes with alcohol wipes BEFORE and AFTER every single dish check.'
    ],
    quickCheck: {
      question: 'A 25-liter deep stockpot of cooked chicken soup was left on the counter overnight to cool and reads 28°C the next morning. What must the Certified Dietary Manager order?',
      options: [
        'Boil it vigorously at 100°C for 10 minutes so it becomes safe for patients',
        'Move it into the blast chiller immediately and serve it for dinner',
        'Discard the entire batch immediately and log a Corrective Action because surviving bacterial spores may have produced heat-stable toxins',
        'Serve it only to the staff cafeteria and make a fresh batch for hospital patients'
      ],
      correctIndex: 2,
      explanation: 'Slow overnight cooling allows Clostridium perfringens / Bacillus cereus spores to germinate and Staphylococcus aureus to form heat-stable toxins that boiling CANNOT destroy.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Cook-Serve vs Cook-Chill Hospital Production & Safe Thawing',
        subtitle: 'Controlling Every Thermal Step From Defrost to Ward Dispatch',
        flowDiagramData: {
          title: 'Hospital Thermal Production CCP Map (Cook-Serve & Cook-Chill)',
          isMultiStream: false,
          mainSteps: [
            { step: 'Safe Thawing (Bottom-Shelf Thaw Chiller ≤ 4°C)', note: 'Never counter-thaw! Drip pans under sealed meat · Use within 24h' },
            { step: 'Staggered Batch Preparation & Seasoning', note: 'Minimize ambient exposure (< 30 min on prep bench)' },
            { step: 'Thermal Cooking Lethality (Core ≥ 75°C)', note: 'Probe thickest thermal center of every batch; log time & temp', isCcp: true },
            { step: 'Path A (Cook-Serve): Hot Hold ≥ 63°C OR Path B (Cook-Chill): Blast Chill ≤ 5°C in 90 min', note: 'Shallow pans (< 5 cm depth) for rapid cooling; label date & batch', isCcp: true },
            { step: 'Reheating (Cook-Chill Only — Core ≥ 75°C Once Only)', note: 'Retherm carts / combi-ovens; never reheat in bain-marie warmers!', isCcp: true }
          ]
        },
        bulletPoints: [
          'Batch Cooking Advantage: Cooking vegetables and proteins in rolling 15-minute waves keeps vitamin loss low, texture crisp, and temperatures safely ≥ 63°C.',
          'Never Reheat in Hot-Holders: Bain-maries and soup warmers heat too slowly, holding food in the Danger Zone for hours — always reheat rapidly on stoves or combi-ovens to ≥ 75°C before transfer.'
        ],
        keyTakeaway:
          'Fast cooking, fast blast-chilling, and zero slow warming break the bacterial growth cycle completely.'
      },
      {
        slideNumber: 2,
        title: 'Probe Thermometer Calibration & CCP Temperature Log',
        subtitle: 'Objective Proof of Thermal Safety for Every Hospital Meal',
        visualIllustration: 'thermometer-calibration',
        documentTemplateBlock: {
          docCode: 'CDM-DOC-08',
          version: 'Rev 2.2',
          codexStepLabel: 'Thermal Processing CCP Record',
          docTitle: 'Daily Cooking, Hot-Hold & Rapid Cooling CCP Temperature Log',
          purpose: 'Provides legal, time-stamped thermal verification for every regular and therapeutic dish served across all hospital wards.',
          fields: [
            { label: 'Cooking / Reheating CCP', value: 'Core ≥ 75°C (Sanitized Digital Probe)' },
            { label: 'Hot-Hold / Cold-Hold CCP', value: 'Hot ≥ 63°C · Cold ≤ 5°C' },
            { label: 'Probe Calibration Status', value: 'Ice Slurry 0.0°C Verified (Tolerance ± 0.5°C)' },
            { label: 'Deviation Authority', value: 'Head Chef & Certified Dietary Manager' }
          ],
          tablePreview: {
            headers: ['Dish / Batch', 'Cook Core (°C)', 'Hot Hold (11:30)', 'Blast Chill (90m)', 'Action / Status'],
            rows: [
              ['Herb Chicken (Diabetic/Reg)', '79.4°C', '71.0°C', 'N/A (Cook-Serve)', 'PASS ✓'],
              ['Pureed Lentil Soup (IDDSI L4)', '84.2°C', '73.5°C', 'N/A (Cook-Serve)', 'PASS ✓'],
              ['Custard Dessert (Cook-Chill)', '76.8°C', 'N/A', '3.8°C in 75 min', 'PASS ✓']
            ]
          },
          signOffLine: 'Shift Cook ________ | Certified Dietary Manager Verification ________'
        },
        bulletPoints: [
          'Verify digital probe thermometers weekly in an agitated ice-water slurry (0.0°C ± 0.5°C) and boiling water (100.0°C ± 0.5°C).',
          'Sanitize thermometer stems with alcohol wipes before probing every dish to prevent cross-contamination between raw and cooked trays.'
        ],
        keyTakeaway:
          'An uncalibrated thermometer produces false confidence — verify ice-point 0°C weekly and record real-time readings honestly.'
      }
    ]
  },

  // =========================================================================
  // MODULE 11
  // =========================================================================
  {
    id: 'cdm-v-mod-11',
    moduleNumber: 11,
    title: 'Patient Tray Line Operations, Meal Ticket Auditing & Zero-Error Delivery',
    estimatedMinutes: 35,
    overview:
      'Run a high-precision hospital patient tray assembly line using Pre-Service Test Trays, the 4-Gate Tray Accuracy Checker, insulated thermal trolleys, and seamless late-tray / hold-tray coordination with wards.',
    internationalClauses: [
      'JCI IPSG.1 Dual Patient Identification Standard',
      'Hospital Tray-Line Quality & Thermal Delivery SOP'
    ],
    keyPrinciples: [
      'The Tray-Line Checker (Starter + Final Auditor) is the final safety firewall before meals reach patients — checking Patient Name + Bed/MRN, Diet Order, Allergen/NPO flag, Portion, Appearance, and Temperature.',
      'Always plate and audit a "Test Tray" 15 minutes before line startup to taste every dish (regular + therapeutic), probe hot/cold temperatures, and verify IDDSI texture.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Patient Tray Accuracy & Ward Delivery Time',
        standardLimit: '≥ 98% tray accuracy (0% allergen/NPO/therapeutic errors) · Hot food ≥ 63°C & Cold ≤ 5°C at bedside · Delivery ≤ 30 mins from plating',
        correctiveProtocol: 'Intercept and replace any defective tray immediately; investigate root cause of recurring ticket or plating errors during post-meal debrief.'
      }
    ],
    practicalChecklist: [
      'Taste and temperature-probe a full Test Tray (including salt-free therapeutic & IDDSI pureed items) 15 minutes before every meal.',
      'Pre-heat insulated thermal bases/pellet warmers and pre-chill cold-cart compartments before loading patient trays.'
    ],
    quickCheck: {
      question: 'Why must the Certified Dietary Manager (or Shift Supervisor) assemble and taste a "Test Tray" 15 minutes before launching the patient tray line?',
      options: [
        'To ensure kitchen staff get to eat before patients',
        'To verify dish flavor, therapeutic seasoning (salt-free/sugar-free), IDDSI texture, visual presentation, and hot/cold serving temperatures before any patient is served',
        'To reduce leftover food in the pots',
        'Because hospital policy prohibits tasting food during cooking'
      ],
      correctIndex: 1,
      explanation: 'A pre-service Test Tray catches burnt, over-salted, wrong-texture, or lukewarm dishes BEFORE 200+ patient trays are plated and dispatched.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'The 4-Gate Patient Tray Accuracy System & Floor SOPs',
        subtitle: 'Delivering Zero-Error Therapeutic Trays Within 30 Minutes',
        visualIllustration: 'cdm-tray-accuracy',
        prpProceduresBlock: [
          {
            prpCode: 'TRAY-SOP-01',
            prpName: 'Pre-Line Setup & 15-Minute Test Tray Approval',
            objective: 'Verify temperature, taste, therapeutic compliance, and equipment readiness before tray assembly starts.',
            steps: [
              'Pre-heat hot bain-marie wells (water ≥ 85°C), pellet plate heaters, and insulated thermal carts 30 minutes prior to service.',
              'Reconcile final Ward Census updates (new admissions, discharges, diet upgrades, NPO orders) and print sorted tray tickets.',
              'Assemble 1 Regular + 1 Therapeutic/IDDSI Test Tray: taste with clean disposable spoons, probe hot items (≥ 68°C at line so ≥ 63°C at bedside) and cold items (≤ 4°C).',
              'Log Test Tray Approval — do NOT open the tray line until every defective dish is corrected.'
            ],
            verificationRecord: 'Daily Pre-Service Test Tray Taste & Temperature Log (CDM-DOC-09).'
          },
          {
            prpCode: 'TRAY-SOP-02',
            prpName: 'Tray-Line Station Flow & Final Checker Audit',
            objective: 'Ensure 100% alignment between the printed diet ticket and every item placed on the patient tray.',
            steps: [
              'Station 1 (Starter): Places clean tray mat, correct diet ticket, cutlery, and verifies NPO/Allergen red banners.',
              'Stations 2–4 (Cold / Hot / Beverage): Plate exact standardized portions using calibrated scoops/ladles; cover hot plates immediately with thermal domes.',
              'Final Checker (End of Line): Performs 100% visual & ticket audit — verifies Name + MRN/Bed, Diet Type, IDDSI texture, Allergen exclusion, condiment restrictions (no salt on cardiac, no sugar on diabetic), and clean plate rims.',
              'Load completed trays into ward-labeled closed thermal carts immediately to lock in heat.'
            ],
            verificationRecord: 'Random 10-Tray Accuracy Audit Log (Target ≥ 98% overall · 100% Clinical Safety).'
          },
          {
            prpCode: 'TRAY-SOP-03',
            prpName: 'Bedside Verification, Hold Trays & Late Admissions',
            objective: 'Guarantee safe bedside handoff and fresh hot meals for patients returning from diagnostics or dialysis.',
            steps: [
              'Deliver closed carts to wards within 30 minutes of plating; coordinate with ward nurse for isolation-room precautions (disposable ware if required by IPC).',
              'Verify TWO Patient Identifiers (Full Name + Medical Record Number / Bed) before placing tray at bedside — NEVER rely on room number alone!',
              'For patients away at X-ray/MRI/Dialysis, do NOT leave meals cooling on bedside tables — hold fresh portion in kitchen and deliver hot upon nursing call.',
              'Collect soiled trays within 60–90 minutes using dedicated soiled return trolleys routed directly to Zone 6 Scullery.'
            ],
            verificationRecord: 'Ward Dispatch Time Log & Late/Hold Tray Fulfillment Register.'
          }
        ],
        bulletPoints: [
          'Use the 4-Gate Verification Protocol (Dual Patient ID, Diet & Allergen Match, Portion/Visual Inspection, and Thermal Delivery ≤ 30 min) on every single meal service.',
          'Click through TRAY-SOP-01 to TRAY-SOP-03 above to review Test Tray approval, Final Checker sign-off, and Hold-Tray procedures.'
        ],
        keyTakeaway:
          'Never leave a patient meal sitting on an empty bed — Hold Trays protect food safety and patient dignity.'
      },
      {
        slideNumber: 2,
        title: 'Controlled Tray Accuracy & Test-Tray Sign-Off Record',
        subtitle: 'Measuring Excellence at Every Breakfast, Lunch & Dinner',
        documentTemplateBlock: {
          docCode: 'CDM-DOC-09',
          version: 'Rev 2.0',
          codexStepLabel: 'Tray-Line QA Audit',
          docTitle: 'Daily Test-Tray & Patient Tray Accuracy Audit Sheet',
          purpose: 'Tracks pre-service thermal/taste approval and random post-assembly tray audits to sustain ≥ 98% tray accuracy and zero clinical diet errors.',
          fields: [
            { label: 'Meal Audited', value: 'Lunch Service · 218 Trays Dispatched' },
            { label: 'Line Start / End Time', value: '11:30 AM – 12:08 PM (38 Minutes)' },
            { label: 'Bedside Test Temp (Last Tray)', value: 'Hot Entrée 66.2°C · Cold Salad 3.9°C' },
            { label: 'Tray Accuracy Score', value: '19/20 Audited Perfect (95% → Minor: Missing Napkin)' }
          ],
          tablePreview: {
            headers: ['Audit Metric', 'Target', 'Actual Reading', 'Corrective Action'],
            rows: [
              ['Therapeutic / Allergen Match', '100%', '100% (20/20)', 'Compliant — zero clinical variance'],
              ['IDDSI Texture Match', '100%', '100% (4/4)', 'Fork & Spoon Tilt passed'],
              ['Hot / Cold Bedside Temp', '≥ 63°C / ≤ 5°C', '66.2°C / 3.9°C', 'Thermal domes pre-heated properly'],
              ['Missing Non-Food Item', '0 Errors', '1 Missing Napkin', 'Reminded Starter Station #1 at debrief']
            ]
          },
          signOffLine: 'Tray-Line Checker ________ | Certified Dietary Manager ________'
        },
        bulletPoints: [
          'Audit at least 10–20 random completed patient trays per meal against printed diet tickets and track both Clinical Safety (100% target) and Overall Accuracy (≥ 98%).',
          'Debrief any minor tray variance immediately with station staff before the next meal shift.'
        ],
        keyTakeaway:
          'Measure the temperature of the LAST tray delivered to the farthest ward — if it arrives ≥ 63°C, your thermal chain works.'
      }
    ]
  },

  // =========================================================================
  // MODULE 12
  // =========================================================================
  {
    id: 'cdm-v-mod-12',
    moduleNumber: 12,
    title: 'Foodservice Budgeting, Food Cost Control, Yield % & Plate Waste Reduction',
    estimatedMinutes: 35,
    overview:
      'Master the financial engine of a Certified Dietary Manager: calculate Food Cost %, Patient-Per-Day (PPD) meal cost, Inventory Turnover, AP/EP Yield %, and Plate Waste % to run a high-quality, fiscally disciplined department.',
    internationalClauses: [
      'Healthcare Foodservice Financial Accounting KPIs',
      'Sustainable Hospital Plate-Waste Reduction Standards'
    ],
    keyPrinciples: [
      'Hospital administrators evaluate a CDM on both Clinical Safety AND Financial Stewardship — especially Patient-Per-Day (PPD) Food Cost, Labor Productivity (Meals per Labor Hour), and Plate Waste %.',
      'Reducing patient plate waste below 15% simultaneously improves clinical nutrition absorption AND saves thousands of dollars/rupees every month.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Monthly Food Cost & Patient Plate Waste Threshold',
        standardLimit: 'Food Cost within ± 3% of approved monthly PPD budget · Patient Plate Waste < 15%',
        correctiveProtocol: 'Conduct immediate menu popularity review, audit store pilferage/spoilage logs, re-verify portion scoops, and recalibrate batch forecasting.'
      }
    ],
    practicalChecklist: [
      'Calculate weekly Patient-Per-Day (PPD) food cost and compare actual spend against budget before month-end.',
      'Run a monthly Plate Waste Audit across wards to identify unpopular dishes or oversized portions.'
    ],
    quickCheck: {
      question: 'A hospital dietary department spent Rs. 450,000 on raw food during a 30-day month with an average of 150 active inpatients per day (4,500 patient-days). What is the Patient-Per-Day (PPD) food cost?',
      options: [
        'Rs. 3,000 per patient-day',
        'Rs. 100 per patient-day',
        'Rs. 150 per patient-day',
        'Rs. 450 per patient-day'
      ],
      correctIndex: 1,
      explanation: 'PPD Food Cost = Total Monthly Food Cost ÷ Total Patient-Days = Rs. 450,000 ÷ (150 patients × 30 days = 4,500) = Rs. 100 per patient-day.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Essential Certified Dietary Manager Financial Formulas',
        subtitle: 'Turning Kitchen Numbers Into Executive Boardroom Clarity',
        tableBlock: {
          caption: 'Core Financial & Operational Formulas Every CDM Must Master',
          headers: ['KPI Metric', 'Exact Formula', 'Worked Hospital Example', 'Benchmark Target'],
          rows: [
            ['Cost of Food Used', 'Opening Inventory + Purchases − Closing Inventory', '100k + 420k − 70k = 450k', 'Reconcile monthly'],
            ['Food Cost % (Cafeteria)', '(Cost of Food Used ÷ Total Food Sales) × 100', '(180k ÷ 600k) × 100 = 30%', '28% – 35%'],
            ['Patient-Per-Day (PPD) Cost', 'Total Patient Food Cost ÷ Total Patient-Days', '450,000 ÷ 4,500 = Rs. 100/day', 'Within ± 3% of budget'],
            ['Edible Yield %', '(Edible Cooked Weight ÷ As-Purchased Weight) × 100', '(4.0 kg ÷ 5.0 kg) × 100 = 80%', 'Track meat & produce'],
            ['Plate Waste %', '(Weight of Uneaten Food ÷ Weight Served) × 100', '(12 kg ÷ 100 kg) × 100 = 12%', '< 15% Hospital Best Practice'],
            ['Meals Per Labor Hour (MPLH)', 'Total Meal Equivalents ÷ Total Paid Labor Hours', '600 meals ÷ 120 hrs = 5.0 MPLH', '3.5 – 5.5 (Acute Care)']
          ]
        },
        twoColumns: {
          leftTitle: 'Top Causes of Hidden Cost Overruns',
          leftTone: 'rose',
          leftItems: [
            'Over-production cooking without consulting live ward census',
            'Unstandardized portion scooping ("free-pouring" meat & gravies)',
            'Poor FIFO/FEFO rotation causing expired dairy & rotting produce',
            'Unlocked dry stores, missing receiving scales & unlogged cafeteria staff meals'
          ],
          rightTitle: 'Smart Cost Control Without Cutting Quality',
          rightTone: 'emerald',
          rightItems: [
            'Enforce calibrated scoops, daily requisition slips & locked high-value stores',
            'Shift menus toward seasonal regional vegetables and competitive supplier bids',
            'Reduce plate waste by interviewing patients on taste, temp & portion sizes',
            'Cross-train kitchen staff to balance peak tray-line labor hours efficiently'
          ]
        },
        bulletPoints: [
          'Master Cost of Food Used (Opening + Purchases − Closing) and Patient-Per-Day (PPD) Cost so budget variances are spotted weekly instead of after month-end.',
          'Track Plate Waste % alongside PPD cost — high plate waste means wasted money AND undernourished patients.'
        ],
        keyTakeaway:
          'Never slash nutritional quality to cut costs — eliminate spoilage, over-portioning, and plate waste instead.'
      },
      {
        slideNumber: 2,
        title: 'Monthly PPD Financial & Plate Waste Executive Dashboard',
        subtitle: 'Controlled Management Reporting to Hospital Administration',
        documentTemplateBlock: {
          docCode: 'CDM-DOC-10',
          version: 'Rev 1.6',
          codexStepLabel: 'Financial & Waste Governance',
          docTitle: 'Monthly Patient-Per-Day (PPD) Food Cost & Plate Waste Report',
          purpose: 'Summarizes monthly raw food expenditure, inventory turnover, patient-days served, and ward plate waste for Hospital Finance & Administration.',
          fields: [
            { label: 'Reporting Period', value: 'Monthly Operating Summary (30 Days)' },
            { label: 'Total Patient-Days', value: '6,420 Patient-Days (Avg 214 Beds)' },
            { label: 'Inventory Turnover Rate', value: '3.2× / Month (Target 2.5–4.0×)' },
            { label: 'Overall Plate Waste %', value: '11.4% (Target < 15% — ON TARGET)' }
          ],
          tablePreview: {
            headers: ['Cost Category', 'Monthly Budget', 'Actual Spend', 'Variance & CDM Commentary'],
            rows: [
              ['Patient Raw Food (PPD)', 'Rs. 1,926,000', 'Rs. 1,881,000', '-2.3% Favorable (seasonal veg savings)'],
              ['Oral Nutrition Supplements', 'Rs. 240,000', 'Rs. 254,000', '+5.8% (higher ICU oncology census)'],
              ['Disposables & Sanitation', 'Rs. 165,000', 'Rs. 161,000', '-2.4% Favorable (auto-dosing chemicals)'],
              ['Cafeteria Revenue Offset', 'Rs. 750,000', 'Rs. 812,000', '+8.3% Revenue growth (new healthy combos)']
            ]
          },
          signOffLine: 'Certified Dietary Manager ________ | Hospital Finance Director ________'
        },
        bulletPoints: [
          'Explain every positive or negative budget variance clearly using census shifts (e.g., ICU oncology ONS demand) and seasonal market rates.',
          'Maintain healthy Inventory Turnover (2.5× to 4.0× per month) so food stays fresh and cash is not trapped in overstocked storerooms.'
        ],
        keyTakeaway:
          'A CDM who presents clear PPD variances and plate-waste solutions earns strong leadership trust and capital equipment budgets.'
      }
    ]
  },

  // =========================================================================
  // MODULE 13
  // =========================================================================
  {
    id: 'cdm-v-mod-13',
    moduleNumber: 13,
    title: 'Human Resource Management, Shift Rostering, Training & Workplace Safety',
    estimatedMinutes: 30,
    overview:
      'Build a loyal, high-performing hospital dietary team through fair shift rostering, structured onboarding and annual food-safety competency tracking, progressive coaching, and kitchen occupational safety (ergonomics, burns, slips, chemicals).',
    internationalClauses: [
      'ISO 45001 Kitchen Occupational Health & Safety',
      'Food Handler Medical Screening & Competency Standards'
    ],
    keyPrinciples: [
      'A hospital dietary department operates 365 days a year across early morning, afternoon, and relief shifts — fair rotating rosters, clear job descriptions, and cross-training prevent burnout and turnover.',
      'Every food handler must hold an up-to-date Medical Fitness Certificate (typhoid/hepatitis/stool & chest screening per local Food Authority) and documented annual HACCP & Therapeutic Diet training.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Staff Medical Fitness & Induction Compliance',
        standardLimit: '100% of active kitchen staff hold valid Medical Fitness Certificates & completed Day-1 Food Hygiene Induction before handling food',
        correctiveProtocol: 'Reassign any staff member with an expired medical certificate to non-food duties until renewed lab clearance is filed.'
      }
    ],
    practicalChecklist: [
      'Audit the Staff Medical Fitness & Training Matrix monthly to catch expiring certificates 30 days ahead.',
      'Verify anti-slip safety shoes, cut-resistant gloves for slicers, Class K/F fire extinguisher, first-aid kit, and Chemical SDS binder are in place.'
    ],
    quickCheck: {
      question: 'A newly hired diet aide arrives for their first shift during a busy lunch rush. What MUST the Certified Dietary Manager ensure BEFORE assigning them to assemble patient trays?',
      options: [
        'Let them learn by trial and error on the diabetic tray line and train them next month',
        'Verify valid medical clearance, clean PPE/hairnet, handwashing competency, and provide structured induction on diet tickets, allergens, and NPO safety',
        'Ask them to wash pots without gloves for the first week',
        'Only give them the written handbook to read at home after the shift'
      ],
      correctIndex: 1,
      explanation: 'Untrained or medically unscreened staff on a hospital tray line create immediate clinical and foodborne risks; Day-1 hygiene and safety induction is mandatory.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Dietary Department Staffing, Shift Rosters & Progressive Leadership',
        subtitle: 'Coaching Excellence While Preventing Kitchen Injuries',
        tableBlock: {
          caption: 'Sample 200-Bed Hospital Dietary Shift Roster Architecture',
          headers: ['Shift Window', 'Core Operational Responsibilities', 'Key Roles On Duty', 'Handover Protocol'],
          rows: [
            ['Morning Shift (05:30 – 13:30)', 'Receiving bay, Breakfast & Lunch production, Tray Line, Mid-morning ONS', 'CDM, Head Chef, Diet Cook, Storekeeper, 6 Tray Aides, 3 Stewards', '13:15 Written Census & Chiller Temp Handover'],
            ['Evening Shift (12:30 – 20:30)', 'Evening tea/snacks, Dinner production, Tray Line, Deep Scullery & Sanitation', 'Shift Supervisor, Evening Chef, Diet Cook, 5 Tray Aides, 3 Stewards', '20:15 End-of-Day Lockup, Gas Shutoff & Prep List'],
            ['Relief / Staggered Pool', 'Covers weekly days off, annual leave & high-census surges without overtime', 'Cross-trained Relief Cook & Relief Diet Aides', 'Published 14 days in advance']
          ]
        },
        twoColumns: {
          leftTitle: 'Progressive Coaching & Discipline Ladder',
          leftTone: 'blue',
          leftItems: [
            'Step 1: Private Coaching & Retraining (fix skill gaps respectfully)',
            'Step 2: Documented Verbal Warning with clear 14-day expectation',
            'Step 3: Written Warning signed with HR for repeated SOP breaches',
            'Immediate Suspension: Intentional food tampering, falsifying CCP logs, or working while hiding severe GI illness'
          ],
          rightTitle: 'Kitchen Occupational Health & Safety (OH&S)',
          rightTone: 'amber',
          rightItems: [
            'Slips & Falls: Mandatory oil-resistant anti-slip shoes + immediate spill mop + wet-floor cones',
            'Burns & Steam: Dry heat-resistant oven mitts (wet cloths conduct steam burns!), open combi-oven doors standing back',
            'Cuts & Machinery: Unplug slicers before cleaning; use cut-resistant mesh gloves on blades',
            'Chemicals & Fire: Never mix Bleach + Acid/Ammonia (toxic chlorine gas!); keep Class K/F extinguisher & fire blanket accessible'
          ]
        },
        bulletPoints: [
          'Publish fair rotating shift rosters at least 14 days in advance with structured written shift handovers between Morning and Evening teams.',
          'Verify Class K/F kitchen fire extinguishers, fire blankets, cut-resistant gloves, and Chemical Safety Data Sheets (SDS) during monthly safety rounds.'
        ],
        keyTakeaway:
          'Praise staff publicly, coach mistakes privately, and treat kitchen safety (burns, slips, chemicals) with the same urgency as food safety.'
      },
      {
        slideNumber: 2,
        title: 'Food Handler Medical Fitness & Competency Tracking Matrix',
        subtitle: 'Audit-Ready HR Documentation for Food Authorities & JCI',
        documentTemplateBlock: {
          docCode: 'CDM-DOC-11',
          version: 'Rev 1.9',
          codexStepLabel: 'HR & Competency Compliance',
          docTitle: 'Dietary Staff Medical Fitness & Annual Training Matrix',
          purpose: 'Ensures 100% of kitchen and tray-line personnel maintain active health screening and verified competency in HACCP, Allergens, and IDDSI.',
          fields: [
            { label: 'Total Active Staff', value: '26 Full-Time Equivalents (FTEs)' },
            { label: 'Medical Screening Cycle', value: 'Every 6–12 Months (Per Local Food Authority)' },
            { label: 'Mandatory Annual Modules', value: 'Hand Hygiene · HACCP · Allergens · IDDSI · Fire' },
            { label: 'Compliance Target', value: '100% Valid Certificates (Zero Expired)' }
          ],
          tablePreview: {
            headers: ['Staff Name & Role', 'Medical Cert Expiry', 'HACCP / Hygiene', 'IDDSI & Allergen', 'Status'],
            rows: [
              ['Ahmed R. (Diet Chef)', 'Aug 2027', 'Completed (92%)', 'Verified Practical ✓', 'COMPLIANT'],
              ['Sana K. (Tray Checker)', 'May 2027', 'Completed (95%)', 'Verified Practical ✓', 'COMPLIANT'],
              ['Bilal M. (Steward)', 'Expires in 18 Days', 'Completed (84%)', 'N/A (Scullery)', 'RENEWAL SCHEDULED']
            ]
          },
          signOffLine: 'Certified Dietary Manager ________ | Hospital HR / IPC Nurse ________'
        },
        bulletPoints: [
          'Flag expiring Medical Fitness Certificates 30 days early so zero kitchen staff work with lapsed health clearance.',
          'Keep signed Day-1 Hygiene Induction forms and practical competency evaluations on file for every active and relief employee.'
        ],
        keyTakeaway:
          'Auditors always ask for two HR files first: Medical Fitness Certificates and Signed Food Hygiene Training Attendance Sheets.'
      }
    ]
  },

  // =========================================================================
  // MODULE 14
  // =========================================================================
  {
    id: 'cdm-v-mod-14',
    moduleNumber: 14,
    title: 'Quality Assurance (CQI), 72-Hour Food Samples, Traceability & Disaster Planning',
    estimatedMinutes: 35,
    overview:
      'Protect hospital continuity and legal due diligence through 72-hour retained food sample protocols, 4-hour batch traceability, quantitative risk scoring, foodborne outbreak containment, and 72-hour emergency/disaster menu plans.',
    internationalClauses: [
      'Hospital Emergency Preparedness & 72-Hour Reserve Standards',
      'Codex Traceability, Recall & Outbreak Investigation Protocols'
    ],
    keyPrinciples: [
      'Retaining 150 g sterile samples of every cooked hospital meal item at ≤ 4°C (or frozen) for 72 hours provides objective laboratory evidence if an outbreak is ever suspected.',
      'Every hospital dietary department must maintain a written 72-Hour Disaster Menu, potable water reserve (≥ 3 L/patient/day), and power-outage cold-chain contingency SOP.'
    ],
    criticalControlParameters: [
      {
        parameter: '72-Hour Retained Food Samples & Outbreak Traceability',
        standardLimit: '150 g sealed labeled sample per dish retained for 72 hours at ≤ 4°C · Full supplier lot traceability within ≤ 4 hours',
        correctiveProtocol: 'Upon any cluster of patient GI symptoms, immediately lock down retained samples for Infection Control / Lab testing, isolate implicated batches, and trace supplier lots.'
      }
    ],
    practicalChecklist: [
      'Verify the dedicated 72-Hour Food Sample Refrigerator has sterile bags, dated labels (Meal, Dish, Date, Time, Collector), and daily temperature log ≤ 4°C.',
      'Rotate 72-hour emergency canned/UHT stock every 3–6 months using FIFO so disaster supplies never expire.'
    ],
    quickCheck: {
      question: 'Three hospitalized patients report acute vomiting 4 hours after lunch. What is the Certified Dietary Manager’s FIRST priority action?',
      options: [
        'Immediately discard all leftover food and 72-hour samples so inspectors cannot find them',
        'Preserve all remaining meal batches and 72-hour retained food samples untouched, notify Infection Control & Medical Director, and start 4-hour batch/lot traceability',
        'Blame the ward nurses before checking any kitchen temperature records',
        'Close the hospital kitchen permanently without arranging patient meals'
      ],
      correctIndex: 1,
      explanation: 'Preserving 72-hour retained samples and notifying Infection Control immediately enables rapid scientific root-cause identification and protects other patients.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: '72-Hour Disaster Menus, Power Outages & Outbreak Containment',
        subtitle: 'Keeping Hospital Patients Fed Safely When Utilities Fail',
        visualIllustration: 'cdm-emergency-plan',
        riskMatrixHighlight: true,
        bulletPoints: [
          '72-Hour Retained Sample Protocol: Using sanitized spoons, collect ≥ 150 g of every cooked regular & therapeutic dish into sterile zip-bags/containers; label Date, Meal, Dish Name, Temp & Initials; hold at ≤ 4°C for exactly 72 hours before safe disposal.',
          'Power Outage Cold-Chain Rule: Keep chiller/freezer doors SHUT! A closed freezer stays safe ~24–48h and chiller ~4h; if chilled high-risk food climbs > 5°C for > 2–4 hours, discard — "When in doubt, throw it out!"',
          'Boil-Water Alert: Halt ice machines, vegetable washing with tap water, and coffee brewers; immediately switch to bottled potable water, disposable ware, and no-cook shelf-stable menus.'
        ],
        keyTakeaway:
          'Emergency preparedness is tested BEFORE a flood, power outage, or boil-water alert hits — never during the crisis.'
      },
      {
        slideNumber: 2,
        title: '72-Hour Food Sample & Emergency Contingency Register',
        subtitle: 'Controlled Evidence for Infection Control & Regulatory Audits',
        documentTemplateBlock: {
          docCode: 'CDM-DOC-12',
          version: 'Rev 2.1',
          codexStepLabel: 'Traceability & Emergency Control',
          docTitle: '72-Hour Retained Food Sample & Emergency Readiness Log',
          purpose: 'Documents daily retention and controlled disposal of 150 g hospital meal samples alongside monthly 72-hour emergency stock rotation checks.',
          fields: [
            { label: 'Sample Fridge ID / Temp', value: 'FRIDGE-SMP-01 (Target 2.0°C · Limit ≤ 4°C)' },
            { label: 'Sample Weight & Hold', value: '150 g per Dish · Retained Full 72 Hours' },
            { label: 'Emergency Water Stock', value: '2,250 Liters Bottled (250 Beds × 3 L × 3 Days)' },
            { label: 'Mock Recall Drill Time', value: 'Completed in 1 hr 45 mins (Limit ≤ 4 hrs)' }
          ],
          tablePreview: {
            headers: ['Date / Meal', 'Dish Sampled (150 g)', 'Batch / Lot Ref', 'Collected By', '72h Disposal Date'],
            rows: [
              ['Mon · Lunch', 'Herb-Steamed Chicken', 'LOT-P982', 'Shift Supv ✓', 'Thu 14:00 (Logged)'],
              ['Mon · Lunch', 'Pureed Lentil Soup (L4)', 'LOT-L204', 'Shift Supv ✓', 'Thu 14:00 (Logged)'],
              ['Mon · Dinner', 'Baked Fish (Cardiac)', 'LOT-F519', 'Evening Supv ✓', 'Thu 20:00 (Logged)']
            ]
          },
          signOffLine: 'CDM Quality Lead ________ | Hospital Infection Control Officer ________'
        },
        bulletPoints: [
          'Store 150 g sterile labeled samples of every cooked regular and therapeutic dish at ≤ 4°C for a full 72 hours before documented disposal.',
          'Run semi-annual timed mock recall drills proving supplier batch-to-ward traceability within ≤ 4 hours.'
        ],
        keyTakeaway:
          'Never skip 72-hour sample collection — it is your hospital’s strongest scientific protection during any patient GI complaint.'
      }
    ]
  },

  // =========================================================================
  // MODULE 15
  // =========================================================================
  {
    id: 'cdm-v-mod-15',
    moduleNumber: 15,
    title: 'Hospital Accreditation Readiness (JCI / ISO 22000), Revision & Exam Mastery',
    estimatedMinutes: 35,
    overview:
      'Connect all 14 prior modules into one executive CQI & Hospital Accreditation Audit Blueprint (JCI, ISO 22000, Provincial/National Food Authorities), test your recall of official CDM definitions, and prepare to excel on the 40-MCQ Final Examination.',
    internationalClauses: [
      'JCI Hospital Food & Nutrition Accreditation Standards',
      'ISO 22000:2018 & Food Authority Inspection Readiness'
    ],
    keyPrinciples: [
      'Accreditation readiness is NOT a one-week cleanup before inspectors arrive — it is daily living compliance across temperature logs, medical certificates, IDDSI verification, tray accuracy, and patient satisfaction surveys.',
      'A Certified Dietary Manager continuously tracks 5 core KPIs (Tray Accuracy ≥ 98%, Meal Temp Compliance ≥ 63°C/≤ 5°C, Plate Waste < 15%, 72h Samples 100%, Traceability ≤ 4h) and presents monthly CQI improvements.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Continuous Audit & Legal Due Diligence Readiness',
        standardLimit: '100% real-time, honestly signed records (zero back-dated or pre-filled logs) archived for ≥ 12–24 months',
        correctiveProtocol: 'Conduct unannounced weekly mock self-audits using the Food Authority / JCI checklist and close every CAPA finding with photographic proof.'
      }
    ],
    practicalChecklist: [
      'Maintain an indexed "Audit Ready Master Binder" containing Food License, Staff Medical Certs, Calibration Certs, Pest Reports, Water Lab Tests, and SOPs.',
      'Complete the interactive Recall & Reveal Revision Drill below before starting the 40-MCQ Final Examination.'
    ],
    quickCheck: {
      question: 'During a surprise Hospital Accreditation / Food Authority inspection, an auditor notices that next Friday’s refrigerator temperature log is already filled out with "3.5°C". What does this represent?',
      options: [
        'Proactive time management by an efficient kitchen supervisor',
        'A critical compliance failure (record falsification) that destroys legal due diligence and invalidates the entire food safety system',
        'An acceptable shortcut if the chiller is brand new',
        'A minor cosmetic error requiring no corrective action'
      ],
      correctIndex: 1,
      explanation: 'Pre-filling or back-dating food safety logs is falsification of legal records; every temperature, calibration, and cleaning check must be recorded honestly in real time.'
    },
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Master CDM Accreditation & CQI Performance Dashboard',
        subtitle: 'Every Hospital Benchmark Connected Across One Audit-Ready View',
        visualIllustration: 'cdm-quality-audit',
        tableBlock: {
          caption: 'Master Certified Dietary Manager Audit & Operational Reference Chart',
          headers: ['Audit Domain', 'Mandatory Standard / Limit', 'Key Controlled Document', 'Audit Verification Proof'],
          rows: [
            ['Clinical Coordination', 'Live Ward Census + Dual Patient ID + NPO pull', 'CDM-DOC-01 & DOC-04', 'Zero NPO/diet mix-ups; signed census'],
            ['Dysphagia (IDDSI)', 'Levels 0–7 verified via Syringe / Fork / Spoon', 'CDM-DOC-05', 'Live IDDSI testing tools & shift log'],
            ['Cold-Chain & Stores', 'Chilled ≤ 5°C · Frozen ≤ -18°C · FEFO · 15 cm floor', 'CDM-DOC-07', 'Calibrated probe & zero expired stock'],
            ['Thermal CCPs', 'Cook/Reheat ≥ 75°C · Hot ≥ 63°C · Blast-Chill 90m', 'CDM-DOC-08', 'Real-time signed logs + Ice-Point 0°C'],
            ['Tray-Line & Warewash', 'Test Tray 15m pre-line · Rinse ≥ 82°C · ≥ 98% Acc', 'CDM-DOC-09 & SOP-03', 'Bedside temp probe & dishmachine gauge'],
            ['HR, Cost & Emergency', '100% Medical Certs · PPD ±3% · 72h Samples/Stock', 'CDM-DOC-10, 11 & 12', 'Master Audit Binder + ≤ 4h mock recall']
          ]
        },
        bulletPoints: [
          'Review all 6 Hospital Audit Domains above prior to JCI, ISO 22000, or Provincial Food Authority inspections.',
          'Keep every temperature, dishmachine rinse, calibration, medical fitness, and 72-hour sample record signed honestly in real time.'
        ],
        keyTakeaway:
          'When your daily logs are honest, your Test Trays are verified, and your staff are trained, your kitchen is audit-ready 365 days a year.'
      },
      {
        slideNumber: 2,
        title: 'Interactive Revision: Recall & Reveal Official CDM Definitions',
        subtitle: 'Test Yourself on 10 Core Terms Before Launching the 40-MCQ Final Exam',
        definitionMatchDrill: [
          {
            term: 'NPO (Nil Per Os)',
            definition: 'A strict physician order meaning "Nothing by Mouth" (no food, water, or ice) — typically before surgery or diagnostic procedures; meal trays must be pulled immediately.'
          },
          {
            term: 'IDDSI Framework (Levels 0–7)',
            definition: 'International Dysphagia Diet Standardisation Initiative defining objective viscosity and particle-size levels (Drinks 0–4, Foods 3–7) using Syringe Flow, Fork Drip, and Spoon Tilt tests.'
          },
          {
            term: 'YOPI Population',
            definition: 'Young, Old, Pregnant, and Immunocompromised patients — the most vulnerable demographic in healthcare requiring strict zero-tolerance food safety controls.'
          },
          {
            term: 'FEFO (First-Expired, First-Out)',
            definition: 'Inventory rotation system ensuring stock with the earliest expiration/use-by date is issued and consumed first to prevent spoilage and expired ingredients.'
          },
          {
            term: 'As Purchased (AP) vs Edible Portion (EP)',
            definition: 'AP is the raw weight bought from the supplier including peel/bone/trim; EP is the usable weight remaining after trimming and cooking (Yield % = EP ÷ AP × 100).'
          },
          {
            term: 'PPD (Patient-Per-Day) Food Cost',
            definition: 'Core hospital dietary financial KPI calculated as Total Patient Food Cost divided by Total Patient-Days served during the accounting period.'
          },
          {
            term: 'Plate Waste Percentage',
            definition: 'Percentage of served patient food returned uneaten on trays — tracked below 15% to optimize both patient clinical nutrition intake and food budget.'
          },
          {
            term: '72-Hour Retained Food Sample',
            definition: 'A sealed, labeled 150 g sample of every cooked dish stored at ≤ 4°C for 72 hours for microbiological investigation if a foodborne illness outbreak occurs.'
          },
          {
            term: 'Neutropenic (Low-Microbial) Diet',
            definition: 'Specialized diet for severely immunocompromised/oncology patients excluding raw salads, unpeeled raw fruits, unpasteurized dairy, and undercooked foods.'
          },
          {
            term: 'Pre-Service Test Tray',
            definition: 'Sample regular and therapeutic tray assembled 15 minutes before meal service so the CDM verifies flavor, seasoning compliance, IDDSI texture, and temperature prior to patient dispatch.'
          }
        ],
        calloutBanner: {
          label: 'Final Exam Readiness Strategy (40 MCQs · 60% Pass · 75% Distinction)',
          text: 'Read each hospital scenario carefully — pay close attention to exact clinical limits (75°C core, 63°C hot hold, ≤ 5°C chilled, 82°C dishmachine rinse, 48h illness exclusion, 72h food samples, 15% plate waste, 98% tray accuracy) and patient-first safety priorities.',
          tone: 'emerald'
        },
        bulletPoints: [
          'Click each hidden row in the Revision Drill above to verify your recall of all 10 high-yield Certified Dietary Manager terms.',
          'Achieve ≥ 60% (24/40) to Pass or ≥ 75% (30/40) for Distinction on the 40-MCQ Final Examination to unlock your official QR-Verified Portrait PDF Certificate.'
        ],
        keyTakeaway:
          'You have mastered all 15 Certified Dietary Manager modules — launch the 40-MCQ Final Exam below to earn your Official QR-Verified CDM Certificate!'
      }
    ]
  }
];

export const MANAGER_FOOD_DIETARY_EXAM_MCQS: ManagerDietaryExamQuestion[] = [
  {
    id: 'cdm-q01',
    question: 'How do the professional roles of a Clinical Dietitian (RD) and a Certified Dietary Manager (CDM) work together in a hospital?',
    options: [
      'The CDM writes physician drug orders while the Dietitian operates the commercial dishmachine',
      'The Clinical Dietitian performs nutrition assessment and prescribes Medical Nutrition Therapy, while the CDM manages kitchen operations, HACCP, budgets, staffing, and accurate therapeutic meal delivery',
      'Both roles have identical legal authority to cancel surgical NPO orders without consulting a doctor',
      'The CDM is limited exclusively to the visitor coffee shop and has no role in patient meal quality'
    ],
    correctIndex: 1,
    explanation: 'Clinical Dietitians lead clinical assessment and MNT prescriptions; Certified Dietary Managers direct foodservice operations, food safety, budgeting, staffing, and accurate patient tray execution.',
    moduleRef: 'Module 1: Scope of Practice & Interdisciplinary Care Team'
  },
  {
    id: 'cdm-q02',
    question: 'A nurse calls the dietary office 10 minutes before lunch dispatch to report that Bed 204 has been switched from "Regular Diet" to "NPO" for emergency surgery. What must the CDM do immediately?',
    options: [
      'Send the tray anyway and let the patient decide whether to eat',
      'Replace the solid lunch with a cup of clear apple juice and broth',
      'Immediately pull Bed 204’s tray from the line or notify the cart runner before delivery and update the Ward Census log',
      'Wait until dinner service to update the diet sheet'
    ],
    correctIndex: 2,
    explanation: 'NPO (Nil Per Os) means nothing by mouth; delivering food or drink to a pre-surgical NPO patient risks severe anesthesia aspiration and surgical cancellation.',
    moduleRef: 'Module 1: Scope of Practice & Interdisciplinary Care Team'
  },
  {
    id: 'cdm-q03',
    question: 'What is the primary food safety purpose of enforcing a strict "One-Way Flow" (Dirty-to-Clean) layout in a hospital kitchen?',
    options: [
      'To reduce electricity usage by placing chillers next to ovens',
      'To ensure raw ingredients and returning soiled ward trays never cross paths with clean cooked food and plated patient trays',
      'To allow delivery trucks to drive directly into the tray assembly zone',
      'To eliminate the need for separate handwashing sinks'
    ],
    correctIndex: 1,
    explanation: 'One-Way forward flow physically separates raw receiving, prep, clean tray assembly, and returning soiled ward carts to prevent cross-contamination.',
    moduleRef: 'Module 2: Hospital Kitchen Architecture & One-Way Flow'
  },
  {
    id: 'cdm-q04',
    question: 'Which facility lighting and floor specification is standard for a hygienic hospital food preparation and tray assembly area?',
    options: [
      'Unshielded glass bulbs and rough porous concrete flooring',
      'Dim ambient lighting (< 100 lux) and carpeted walkways',
      'Shatterproof-sleeved lighting (≥ 500 lux) with smooth, anti-slip, washable flooring and coved wall-to-floor junctions',
      'Open floor trenches without drain traps to speed up hosing'
    ],
    correctIndex: 2,
    explanation: 'Shatterproof ≥ 500 lux lighting prevents glass contamination and improves visual inspection; coved anti-slip floors prevent dirt buildup and staff slips.',
    moduleRef: 'Module 2: Hospital Kitchen Architecture & One-Way Flow'
  },
  {
    id: 'cdm-q05',
    question: 'What type of lubricant must hospital maintenance engineers exclusively use on food mixers, meat slicers, and tray-line conveyors?',
    options: [
      'Standard automotive motor oil',
      'NSF H1 Food-Grade Lubricant',
      'Industrial diesel grease',
      'Used vegetable frying oil'
    ],
    correctIndex: 1,
    explanation: 'NSF H1 food-grade lubricants are non-toxic and approved for incidental food contact on kitchen processing machinery.',
    moduleRef: 'Module 2: Hospital Kitchen Architecture & One-Way Flow'
  },
  {
    id: 'cdm-q06',
    question: 'How many kilocalories (kcal) are supplied per gram by Carbohydrates, Protein, and Fat respectively?',
    options: [
      '4 kcal/g Carbohydrate, 4 kcal/g Protein, 9 kcal/g Fat',
      '9 kcal/g Carbohydrate, 4 kcal/g Protein, 4 kcal/g Fat',
      '2 kcal/g Carbohydrate, 6 kcal/g Protein, 12 kcal/g Fat',
      '4 kcal/g Carbohydrate, 9 kcal/g Protein, 4 kcal/g Fat'
    ],
    correctIndex: 0,
    explanation: 'Carbohydrates and Proteins each provide 4 kcal/g, whereas Fats provide concentrated energy at 9 kcal/g.',
    moduleRef: 'Module 3: Essential Nutrition Science & Screening'
  },
  {
    id: 'cdm-q07',
    question: 'A hospitalized geriatric patient eats less than 50% of their meals for 3 consecutive days and mentions difficulty chewing. What is the CDM’s mandatory action?',
    options: [
      'Serve half portions permanently to cut plate waste',
      'Document the low intake, interview the patient on preferences/denture comfort, and submit an immediate Clinical Dietitian Referral',
      'Ignore the observation until the patient requests a doctor',
      'Switch the patient to an unprescribed clear liquid diet independently'
    ],
    correctIndex: 1,
    explanation: 'Consuming < 50% of meals for 3 consecutive days is a key hospital malnutrition trigger requiring documented intake review and prompt RD escalation.',
    moduleRef: 'Module 3: Essential Nutrition Science & Screening'
  },
  {
    id: 'cdm-q08',
    question: 'Which cooking practice best preserves water-soluble vitamins (Vitamin C and B-complex) and natural color in hospital vegetables?',
    options: [
      'Boiling vegetables in large pots of water for 60 minutes and holding for 3 hours',
      'Steaming or batch-cooking in small staggered quantities just prior to tray assembly',
      'Adding baking soda to boiling water to brighten green vegetables',
      'Reheating leftover vegetables three times across consecutive shifts'
    ],
    correctIndex: 1,
    explanation: 'Small-batch steaming minimizes water leaching and prolonged heat destruction of Vitamin C and folate.',
    moduleRef: 'Module 3: Essential Nutrition Science & Screening'
  },
  {
    id: 'cdm-q09',
    question: 'Which condiment or ingredient is DANGEROUS and must NEVER be offered to a Renal (Chronic Kidney Disease) patient as a salt alternative?',
    options: [
      'Fresh lemon juice and dried rosemary',
      'Garlic powder (salt-free) and black pepper',
      'Commercial Potassium Chloride ("Lo-Salt") salt substitute',
      'Fresh chopped parsley and white vinegar'
    ],
    correctIndex: 2,
    explanation: 'Commercial salt substitutes replace sodium with potassium chloride, which can cause fatal hyperkalemia and cardiac arrest in renal patients.',
    moduleRef: 'Module 4: Clinical Therapeutic Diets'
  },
  {
    id: 'cdm-q10',
    question: 'Which meal item must be STRICTLY excluded from a Neutropenic (Low-Microbial) oncology patient’s tray?',
    options: [
      'Well-cooked herb chicken probed at 78°C internal core temperature',
      'Unopened UHT pasteurized milk tetra-pack',
      'Fresh raw mixed garden salad with unpeeled berries and soft unpasteurized cheese',
      'Individually sealed canned peaches in light syrup'
    ],
    correctIndex: 2,
    explanation: 'Immunocompromised neutropenic patients face life-threatening infections from raw unpeeled produce and unpasteurized dairy; all foods must be thoroughly cooked or commercially sterile.',
    moduleRef: 'Module 4: Clinical Therapeutic Diets'
  },
  {
    id: 'cdm-q11',
    question: 'Which menu item is ACCEPTABLE on a strict post-operative Clear Liquid diet?',
    options: [
      'Strained fat-free clear broth, clear apple juice, plain gelatin, and black tea',
      'Cream of mushroom soup, whole milk, and vanilla yogurt',
      'Oatmeal porridge with mashed banana',
      'Orange juice with thick fruit pulp and blended lentil soup'
    ],
    correctIndex: 0,
    explanation: 'A Clear Liquid diet permits only transparent, residue-free liquids that are liquid at body temperature — zero milk, cream, pulp, or opaque solids.',
    moduleRef: 'Module 4: Clinical Therapeutic Diets'
  },
  {
    id: 'cdm-q12',
    question: 'What is the primary operational goal of a Diabetic (Carbohydrate-Controlled) hospital menu?',
    options: [
      'Eliminate 100% of all carbohydrates including grains and vegetables',
      'Deliver consistent, measured complex carbohydrates (typically 45–60 g/meal), high fiber, and zero refined simple sugars aligned with insulin/medication timing',
      'Double the fat and salt content to replace sugar calories',
      'Serve all daily calories in one single evening meal'
    ],
    correctIndex: 1,
    explanation: 'Consistent measured carbohydrate portions and timely meal delivery prevent dangerous blood glucose spikes and insulin-induced hypoglycemia.',
    moduleRef: 'Module 4: Clinical Therapeutic Diets'
  },
  {
    id: 'cdm-q13',
    question: 'Under the global IDDSI Framework, which objective kitchen test is used to verify Thickened Drinks (Levels 0 to 3)?',
    options: [
      'Measuring fluid temperature with a laser gun',
      'The 10 mL Slip-Tip Syringe Flow Test timed for exactly 10 seconds',
      'Pouring the beverage through a pasta colander',
      'Weighing the drinking cup on a receiving scale'
    ],
    correctIndex: 1,
    explanation: 'The IDDSI 10 mL Syringe Flow Test measures exact liquid remaining after 10 seconds of gravity flow (L0: 0 mL; L1: 1–4 mL; L2: 4–8 mL; L3: > 8 mL).',
    moduleRef: 'Module 5: Texture-Modified Diets & IDDSI Framework'
  },
  {
    id: 'cdm-q14',
    question: 'Why must vanilla ice cream and gelatin (jelly) NEVER be served to a dysphagia patient ordered IDDSI Level 2 (Mildly Thick) liquids?',
    options: [
      'They contain too much dietary fiber for dysphagia patients',
      'They melt inside the warm mouth into thin Level 0 liquid, creating a high risk of silent aspiration pneumonia',
      'They are too expensive for standard hospital budgets',
      'They cannot be served on color-coded hospital trays'
    ],
    correctIndex: 1,
    explanation: 'Foods that turn into thin liquid at body temperature (ice cream, gelatin, ice chips) bypass thickened-fluid precautions and can enter the airway.',
    moduleRef: 'Module 5: Texture-Modified Diets & IDDSI Framework'
  },
  {
    id: 'cdm-q15',
    question: 'What particle size and fork behavior define an IDDSI Level 5 (Minced & Moist) meal?',
    options: [
      'Whole roasted cuts requiring a steak knife',
      'Soft, moist lumps no larger than 4 mm (adult) that squash easily with light fork pressure and have zero thin liquid separation',
      'Completely watery thin broth that passes freely through fork tines',
      'Dry crispy bread cubes of 3 cm size'
    ],
    correctIndex: 1,
    explanation: 'IDDSI Level 5 Minced & Moist requires soft, cohesive particles ≤ 4 mm (fitting between standard fork prongs) with no separate thin liquid draining out.',
    moduleRef: 'Module 5: Texture-Modified Diets & IDDSI Framework'
  },
  {
    id: 'cdm-q16',
    question: 'What does the food safety acronym "YOPI" represent in healthcare foodservice?',
    options: [
      'Yearly Operational Productivity Index',
      'Young, Old, Pregnant, and Immunocompromised — the most vulnerable patient groups',
      'Yield Output Per Ingredient',
      'Yellow, Orange, Purple, and Indigo cutting boards'
    ],
    correctIndex: 1,
    explanation: 'YOPI patients have immature, weakened, or altered immune defenses, making strict pathogen prevention mandatory in hospital kitchens.',
    moduleRef: 'Module 6: Hospital Food Safety Hazards & YOPI Patients'
  },
  {
    id: 'cdm-q17',
    question: 'Which pathogenic bacterium is uniquely hazardous in chilled hospital ready-to-eat foods (sliced meats, soft cheeses, sandwiches) because it can continue multiplying slowly even at +4°C?',
    options: [
      'Listeria monocytogenes',
      'Lactobacillus acidophilus',
      'Saccharomyces cerevisiae',
      'Bifidobacterium longum'
    ],
    correctIndex: 0,
    explanation: 'Listeria monocytogenes is psychrotrophic (cold-tolerant) and can cause fatal listeriosis/meningitis in elderly, pregnant, and immunocompromised hospital patients.',
    moduleRef: 'Module 6: Hospital Food Safety Hazards & YOPI Patients'
  },
  {
    id: 'cdm-q18',
    question: 'Between which temperatures does the bacterial "Temperature Danger Zone" occur, and what is the stricter hospital maximum ambient exposure rule for perishable patient meals?',
    options: [
      '-18°C to 0°C; maximum 12 hours',
      '5°C to 63°C; discard high-risk hospital food abused beyond 2 hours',
      '65°C to 95°C; maximum 6 hours',
      '0°C to 4°C; maximum 30 minutes'
    ],
    correctIndex: 1,
    explanation: 'Pathogens multiply rapidly between 5°C and 63°C; hospitals enforce a strict 2-hour cumulative Danger Zone limit to protect vulnerable YOPI patients.',
    moduleRef: 'Module 6: Hospital Food Safety Hazards & YOPI Patients'
  },
  {
    id: 'cdm-q19',
    question: 'Which color-coded cutting board and utensil set is reserved EXCLUSIVELY for Allergen-Free and Celiac (Gluten-Free) patient meal preparation?',
    options: [
      'Red board',
      'Yellow board',
      'Purple board and dedicated purple-handled tools',
      'Brown root-vegetable board'
    ],
    correctIndex: 2,
    explanation: 'Purple boards, knives, and pans are internationally recognized for dedicated allergen-free / gluten-free preparation to prevent trace cross-contact.',
    moduleRef: 'Module 7: Hospital Dietary SOPs & Prerequisite Programmes'
  },
  {
    id: 'cdm-q20',
    question: 'A kitchen cook reports having acute vomiting and diarrhea early in the morning. When may the Certified Dietary Manager legally allow them to return to food handling?',
    options: [
      'Immediately if they wear two pairs of disposable gloves',
      'After taking an over-the-counter tablet and waiting 4 hours',
      'Only after being completely symptom-free for at least 48 hours and receiving medical fitness clearance',
      'The same afternoon if they only wash dishes'
    ],
    correctIndex: 2,
    explanation: 'Food handlers with vomiting or diarrhea (Norovirus/enteric pathogens) must be excluded immediately and remain off duty until at least 48 hours completely symptom-free.',
    moduleRef: 'Module 7: Hospital Dietary SOPs & Prerequisite Programmes'
  },
  {
    id: 'cdm-q21',
    question: 'What is the required final sanitizing rinse temperature in a high-temperature commercial hospital dishmachine?',
    options: [
      '50°C',
      '65°C',
      '≥ 82°C (180°F)',
      '40°C'
    ],
    correctIndex: 2,
    explanation: 'A final thermal sanitizing rinse of ≥ 82°C ensures dish surface temperature achieves ≥ 71°C for validated pathogen destruction.',
    moduleRef: 'Module 7: Hospital Dietary SOPs & Prerequisite Programmes'
  },
  {
    id: 'cdm-q22',
    question: 'After sanitizing patient dishes in a 3-compartment manual sink (Wash → Rinse → Sanitize), how must the clean dishes be dried?',
    options: [
      'Wiped quickly with a reusable cotton kitchen towel',
      'Air-dried completely on clean sanitized slatted racks',
      'Dried with paper napkins from the cafeteria',
      'Stacked wet immediately inside closed meal trolleys'
    ],
    correctIndex: 1,
    explanation: 'Cloth towels re-contaminate sanitized tableware with bacteria; air-drying on sanitized drain racks is mandatory.',
    moduleRef: 'Module 7: Hospital Dietary SOPs & Prerequisite Programmes'
  },
  {
    id: 'cdm-q23',
    question: 'If a standardized hospital recipe requires 12 kg of Edible Portion (EP) peeled carrots and carrots have an 80% yield, how many kg of As Purchased (AP) carrots must you order?',
    options: [
      '9.6 kg',
      '12.0 kg',
      '15.0 kg',
      '18.5 kg'
    ],
    correctIndex: 2,
    explanation: 'AP Weight = EP Weight ÷ Yield % = 12 kg ÷ 0.80 = 15.0 kg As Purchased.',
    moduleRef: 'Module 8: Cycle Menus, Standardized Recipes & Portion Control'
  },
  {
    id: 'cdm-q24',
    question: 'On a hospital tray line, how much volume does one level #16 portion scoop (disher) measure?',
    options: [
      '2.0 fl oz (1/4 cup / ~60 mL)',
      '4.0 fl oz (1/2 cup / ~120 mL)',
      '8.0 fl oz (1 cup / ~240 mL)',
      '16 fl oz (2 cups / ~480 mL)'
    ],
    correctIndex: 0,
    explanation: 'Scoop number equals scoops per quart (32 fl oz): 32 ÷ 16 = 2 fl oz = 1/4 cup (~60 mL).',
    moduleRef: 'Module 8: Cycle Menus, Standardized Recipes & Portion Control'
  },
  {
    id: 'cdm-q25',
    question: 'Why are 14-day or 28-day Cycle Menus preferred over static daily menus in hospitals and long-term care facilities?',
    options: [
      'They eliminate the need for therapeutic diets',
      'They reduce patient menu fatigue, streamline seasonal procurement, standardize labor forecasting, and stabilize PPD food cost',
      'They allow chefs to improvise recipes daily without written cards',
      'They avoid the requirement to inspect incoming deliveries'
    ],
    correctIndex: 1,
    explanation: 'Cycle menus balance patient variety with predictable purchasing, consistent standardized recipes, and disciplined budget control.',
    moduleRef: 'Module 8: Cycle Menus, Standardized Recipes & Portion Control'
  },
  {
    id: 'cdm-q26',
    question: 'During receiving inspection, a pallet of canned tomato paste includes 6 cans with swollen, bulging lids and deep seam dents. What is the correct decision?',
    options: [
      'Accept them and use the swollen cans first under FIFO',
      'Reject the swollen and seam-dented cans immediately due to Clostridium botulinum (Botulism) risk and log a Supplier NCR',
      'Open and boil the swollen cans for 5 minutes to remove gas',
      'Store them in the deep freezer until next month'
    ],
    correctIndex: 1,
    explanation: 'Swollen or seam-dented cans indicate loss of hermetic seal or anaerobic Clostridium botulinum gas/toxin growth — immediate rejection is mandatory.',
    moduleRef: 'Module 9: Procurement, Receiving & FIFO/FEFO Inventory'
  },
  {
    id: 'cdm-q27',
    question: 'In a walk-in hospital chiller (+1°C to +4°C), what is the mandatory vertical shelf-stacking hierarchy from TOP to BOTTOM?',
    options: [
      'Top: Raw poultry · Middle: Raw red meat · Bottom: Ready-to-eat patient desserts',
      'Top: Ready-to-Eat cooked meals, salads & dairy · Middle: Washed vegetables · Bottom: Raw meat & poultry in leak-proof drip trays',
      'All items mixed together alphabetically by supplier name',
      'Raw meat stored directly on the tiled chiller floor for coldest airflow'
    ],
    correctIndex: 1,
    explanation: 'Storing raw meat/poultry on the bottom shelf in sealed drip trays prevents raw blood or juices from dripping onto ready-to-eat hospital foods.',
    moduleRef: 'Module 9: Procurement, Receiving & FIFO/FEFO Inventory'
  },
  {
    id: 'cdm-q28',
    question: 'How high above the floor must dry store shelving be raised in a compliant hospital food store?',
    options: [
      'Flush on the floor with cardboard sheets underneath',
      'At least 15 cm (6 inches) off the floor and 5 cm away from walls',
      '1 cm off the floor',
      'Height does not matter if bags are sealed in plastic'
    ],
    correctIndex: 1,
    explanation: 'Maintaining ≥ 15 cm floor clearance and 5 cm wall spacing enables floor mopping, airflow circulation, and rapid visual pest inspection.',
    moduleRef: 'Module 9: Procurement, Receiving & FIFO/FEFO Inventory'
  },
  {
    id: 'cdm-q29',
    question: 'What is the minimum validated internal core cooking temperature for poultry, minced meats, and reheated cook-chill hospital meals?',
    options: [
      '55°C',
      '63°C',
      '≥ 75°C (verified at the thickest thermal center with a sanitized digital probe)',
      '100°C for 30 minutes'
    ],
    correctIndex: 2,
    explanation: 'An internal core temperature of ≥ 75°C (or validated equivalent 70°C for 2 min) guarantees thermal lethality of vegetative pathogens like Salmonella and Campylobacter.',
    moduleRef: 'Module 10: Bulk Production, Rapid Cooling & Thermal Control'
  },
  {
    id: 'cdm-q30',
    question: 'How should frozen raw chicken breasts be safely thawed in a hospital dietary kitchen?',
    options: [
      'Submerged in a sink of warm tap water for 4 hours',
      'Left uncovered on a stainless steel prep table overnight',
      'Inside a dedicated bottom-shelf thaw chiller maintained at ≤ 4°C in covered drip pans',
      'Placed near the exhaust hood above the hot cooking range'
    ],
    correctIndex: 2,
    explanation: 'Thawing in a bottom-shelf chiller at ≤ 4°C keeps outer meat surfaces out of the Danger Zone while preventing raw thaw drip onto other foods.',
    moduleRef: 'Module 10: Bulk Production, Rapid Cooling & Thermal Control'
  },
  {
    id: 'cdm-q31',
    question: 'When calibrating a digital food probe thermometer using the Ice-Point method (crushed ice + clean water slurry), what exact reading confirms calibration?',
    options: [
      '+4.0°C ± 2.0°C',
      '0.0°C (within ± 0.5°C tolerance)',
      '-18.0°C ± 1.0°C',
      '+10.0°C ± 0.5°C'
    ],
    correctIndex: 1,
    explanation: 'An agitated ice-water slurry stabilizes at exactly 0.0°C (32°F); probes deviating beyond ± 0.5°C must be recalibrated or replaced.',
    moduleRef: 'Module 10: Bulk Production, Rapid Cooling & Thermal Control'
  },
  {
    id: 'cdm-q32',
    question: 'Before handing a patient their meal tray at the hospital bedside, how must staff verify patient identity per JCI IPSG.1 safety standards?',
    options: [
      'Check the room number on the door only',
      'Verify TWO patient identifiers (Full Patient Name + Medical Record Number / Bed or Date of Birth) against the printed diet ticket',
      'Ask the visitor in the hallway which bed ordered chicken',
      'Place the tray silently on the bedside table without checking the wristband'
    ],
    correctIndex: 1,
    explanation: 'Room numbers change frequently; verifying two independent patient identifiers prevents serving a regular or allergen-containing meal to the wrong patient.',
    moduleRef: 'Module 11: Patient Tray Line & Zero-Error Delivery'
  },
  {
    id: 'cdm-q33',
    question: 'What is the target hot-holding and cold-holding temperature at the point of patient bedside meal service?',
    options: [
      'Hot ≥ 50°C · Cold ≤ 12°C',
      'Hot ≥ 63°C · Cold ≤ 5°C',
      'Hot ≥ 45°C · Cold ≤ 15°C',
      'Temperature does not need checking once plated'
    ],
    correctIndex: 1,
    explanation: 'Hot entrées must remain ≥ 63°C and cold salads/desserts ≤ 5°C through bedside delivery (ideally within ≤ 30 minutes of plating) to stay safely outside the Danger Zone.',
    moduleRef: 'Module 11: Patient Tray Line & Zero-Error Delivery'
  },
  {
    id: 'cdm-q34',
    question: 'A patient is temporarily away from their ward for a 90-minute MRI scan during lunch delivery. What is the correct Hold-Tray procedure?',
    options: [
      'Leave the hot tray uncovered on the empty bed until the patient comes back',
      'Discard the patient’s lunch record and wait until dinner',
      'Hold the meal order in the kitchen and deliver a freshly plated hot tray (≥ 63°C) when the ward nurse confirms the patient has returned',
      'Give the patient’s therapeutic tray to the neighboring bed'
    ],
    correctIndex: 2,
    explanation: 'Leaving meals unattended on empty beds drops food into the Danger Zone and leaves the returning patient with cold, unsafe food.',
    moduleRef: 'Module 11: Patient Tray Line & Zero-Error Delivery'
  },
  {
    id: 'cdm-q35',
    question: 'A hospital kitchen starts the month with Rs. 120,000 in inventory, purchases Rs. 580,000 of food, and ends the month with Rs. 100,000 in closing inventory. What is the Cost of Food Used?',
    options: [
      'Rs. 560,000',
      'Rs. 600,000',
      'Rs. 700,000',
      'Rs. 800,000'
    ],
    correctIndex: 1,
    explanation: 'Cost of Food Used = Opening Inventory (120,000) + Purchases (580,000) − Closing Inventory (100,000) = Rs. 600,000.',
    moduleRef: 'Module 12: Budgeting, Food Cost & Plate Waste'
  },
  {
    id: 'cdm-q36',
    question: 'During a ward Plate Waste Audit, 100 kg of patient food was served and 24 kg came back uneaten (24% waste vs < 15% benchmark). Which action best addresses the root cause?',
    options: [
      'Stop weighing returning waste so the numbers look better',
      'Analyze which dishes/wards drive the waste, interview patients on flavor, temperature, and portion size, and refine recipes/cycle menus',
      'Force patients to finish their trays before discharge',
      'Cut food quality further to offset the wasted weight'
    ],
    correctIndex: 1,
    explanation: 'High plate waste (> 15%) signals palatability, temperature, cultural mismatch, or oversized portions — targeted patient feedback fixes both nutrition and budget.',
    moduleRef: 'Module 12: Budgeting, Food Cost & Plate Waste'
  },
  {
    id: 'cdm-q37',
    question: 'Why must kitchen staff NEVER mix Chlorine Bleach with Acid descalers or Ammonia-based floor cleaners?',
    options: [
      'The mixture loses its color on white tiles',
      'It triggers a hazardous chemical reaction releasing lethal toxic chlorine/chloramine gas inside the kitchen',
      'It makes the floor slightly slippery',
      'It increases the cost of cleaning supplies by 5%'
    ],
    correctIndex: 1,
    explanation: 'Mixing bleach with acids or ammonia releases highly toxic chlorine or chloramine vapors that cause acute respiratory injury; always follow SDS sheets.',
    moduleRef: 'Module 13: Human Resources, Rostering & Kitchen Safety'
  },
  {
    id: 'cdm-q38',
    question: 'For how many hours and at what temperature must a hospital kitchen retain 150 g labeled food samples of every cooked patient meal item?',
    options: [
      '12 hours at room temperature (25°C)',
      '24 hours in the hot-holding cabinet',
      '72 hours at ≤ 4°C (or frozen) in sealed sterile containers',
      '30 days in the dry grocery store'
    ],
    correctIndex: 2,
    explanation: 'Retaining 150 g samples of every cooked dish at ≤ 4°C for 72 hours covers standard foodborne illness incubation windows for laboratory root-cause testing.',
    moduleRef: 'Module 14: Quality Assurance, 72h Samples & Disaster Planning'
  },
  {
    id: 'cdm-q39',
    question: 'If the hospital experiences a sudden municipal "Boil-Water Alert" due to water main contamination, what must the Certified Dietary Manager do immediately?',
    options: [
      'Continue washing raw salads with tap water since sanitizer is unnecessary',
      'Shut down ice machines and tap-water prep, switch immediately to bottled potable water (≥ 3 L/patient/day reserve), no-cook emergency menus, and single-use disposable tableware',
      'Serve only dry bread with zero beverages for 48 hours',
      'Wait for local television news to confirm before taking kitchen action'
    ],
    correctIndex: 1,
    explanation: 'During a boil-water alert, contaminated tap water can taint ice, produce, and dishwashing — bottled water, disposable ware, and disaster menus protect patients immediately.',
    moduleRef: 'Module 14: Quality Assurance, 72h Samples & Disaster Planning'
  },
  {
    id: 'cdm-q40',
    question: 'Within what maximum time window should a well-managed hospital dietary department trace any ingredient batch/lot number from supplier delivery to ward service during a recall or outbreak?',
    options: [
      'Within 2 to 4 hours using Receiving Lot Logs and Daily Production Records',
      'Within 30 business days',
      'Within 6 months during the annual financial audit',
      'Batch traceability is only required for pharmaceutical drugs, not hospital food'
    ],
    correctIndex: 0,
    explanation: 'Logging supplier lot numbers at receiving and daily production allows a Certified Dietary Manager to isolate recalled ingredients within 2 to 4 hours.',
    moduleRef: 'Module 15: Accreditation Readiness & Exam Mastery'
  }
];

export const MANAGER_FOOD_DIETARY_COURSE: InternationalTrainingCourse = {
  id: 'mgr-food-dietary-2026',
  code: 'CDM-CERT',
  title: 'Certified Dietary Manager',
  levelBadge:
    'Visual Interactive Course (15 Modules · Clinical SOPs, Hospital Docs & Drills · 40 MCQs)',
  accreditationStandard:
    'ANFP / Codex CXC 1-1969 • Certified Dietary Manager (CDM) Professional Standard',
  duration:
    '15 Interactive Modules (Clinical SOPs, Controlled Docs & Drills) + 40-MCQ Final Exam',
  certificateFeeRs: 8000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Comprehensive Certified Dietary Manager (CDM) hospital & institutional foodservice certification featuring custom clinical visual diagrams, interactive Hospital Dietary & Tray-Line SOPs, 12 controlled sample hospital document forms (CDM-DOC-01 to 12), IDDSI dysphagia controls, interactive Germometer, Risk Matrix & Hazard Drills, financial PPD dashboards, and a 40-MCQ final exam.',
  modules: MANAGER_FOOD_DIETARY_MODULES,
  coreExamPool: MANAGER_FOOD_DIETARY_EXAM_MCQS.map((item) => ({
    q: item.question,
    options: item.options,
    correctIndex: item.correctIndex,
    explanation: item.explanation
  }))
};

export const MANAGER_FOOD_DIETARY_HUB_TRAINING: HubTraining = {
  id: MANAGER_FOOD_DIETARY_COURSE.id,
  category: 'International Certification',
  title: 'Certified Dietary Manager',
  standardCode: 'CDM-CERT',
  accreditationStandard: MANAGER_FOOD_DIETARY_COURSE.accreditationStandard,
  certificateFeeRs: MANAGER_FOOD_DIETARY_COURSE.certificateFeeRs,
  subType: MANAGER_FOOD_DIETARY_COURSE.levelBadge,
  description: MANAGER_FOOD_DIETARY_COURSE.description,
  duration: MANAGER_FOOD_DIETARY_COURSE.duration,
  fees: 'Free Study & Exam · Rs. 8,000 Certificate',
  enrollLink: '#trainings',
  isActive: true,
  customModules: MANAGER_FOOD_DIETARY_MODULES.map((m) => ({
    id: m.id,
    subject: m.title,
    description: `${m.overview}\n\n${m.keyPrinciples.join('\n\n')}`
  })),
  customMcqs: MANAGER_FOOD_DIETARY_EXAM_MCQS.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation
  }))
};
