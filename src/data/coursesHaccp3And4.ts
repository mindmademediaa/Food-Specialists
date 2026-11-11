import { HubTraining } from '../types/hub';
import {
  CourseExamMCQ,
  InternationalTrainingCourse
} from './internationalTrainingsData';

export interface RawSlideCourseInput {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: string;
  level: string;
  durationHours: number;
  totalModules: number;
  examQuestionsCount: number;
  passingScorePercent: number;
  certificateTitle: string;
  accreditationStandard: string;
  targetAudience: string[];
  overview: string;
  learningOutcomes: string[];
  modules: Array<{
    moduleNumber: number;
    title: string;
    estimatedMinutes: number;
    learningObjectives: string[];
    summary: string;
    keyTakeaways: string[];
    practiceScenario: string;
    presentationSlides: Array<{
      slideNumber: number;
      title: string;
      subtitle: string;
      bullets: string[];
      Example?: string;
      keyPoint: string;
    }>;
    sections?: unknown[];
    quiz?: unknown[];
  }>;
}

export function normalizeRawSlideCourse(
  raw: RawSlideCourseInput
): InternationalTrainingCourse {
  const totalSlides = raw.modules.reduce(
    (sum, m) => sum + m.presentationSlides.length,
    0
  );
  const coreExamPool: InternationalTrainingCourse['coreExamPool'] = [];

  for (const mod of raw.modules) {
    for (const slide of mod.presentationSlides) {
      coreExamPool.push({
        q: `In ${raw.title} (${mod.title} — ${slide.title}), which of the following statements is accurate?`,
        options: [
          slide.keyPoint,
          'No documentation, verification, or control is required',
          'Standard procedures can be ignored during peak workloads',
          'Checks are only required once every five years'
        ],
        correctIndex: 0,
        explanation: `${slide.keyPoint}${slide.Example ? ` Example: ${slide.Example}` : ''}`
      });
      if (slide.bullets[0]) {
        coreExamPool.push({
          q: `Regarding "${slide.title}" in ${raw.title}, what is a key operational requirement?`,
          options: [
            'Skip standard verification checks',
            slide.bullets[0],
            'Operate without management oversight or training',
            'Discard records immediately after the shift'
          ],
          correctIndex: 1,
          explanation: `${slide.bullets[0]} — ${slide.keyPoint}`
        });
      }
    }
  }

  return {
    id: raw.id,
    code: raw.code,
    title: raw.title,
    levelBadge: `Simple Presentation Course (05 Modules · ${totalSlides} Slides · 40 MCQs · 60% Pass)`,
    accreditationStandard: raw.accreditationStandard,
    duration: `05 Presentation Modules (${totalSlides} Slides) + 40-MCQ Final Exam`,
    certificateFeeRs: 1000,
    passPercentage: raw.passingScorePercent || 60,
    distinctionPercentage: 75,
    totalExamQuestions: 40,
    description: raw.overview,
    modules: raw.modules.map((m) => ({
      id: `${raw.id}-mod-${m.moduleNumber}`,
      moduleNumber: m.moduleNumber,
      title: m.title.replace(/^Module\s*0?\d+:\s*/i, ''),
      estimatedMinutes: m.estimatedMinutes,
      overview: m.summary,
      internationalClauses: [raw.accreditationStandard],
      keyPrinciples: [...m.keyTakeaways, ...m.learningObjectives],
      criticalControlParameters: m.presentationSlides.slice(0, 3).map((sl) => ({
        parameter: sl.title,
        standardLimit: sl.keyPoint,
        correctiveProtocol: sl.Example || m.practiceScenario
      })),
      practicalChecklist: m.learningObjectives,
      presentationSlides: m.presentationSlides.map((sl) => ({
        slideNumber: sl.slideNumber,
        title: sl.title,
        subtitle: sl.subtitle,
        bulletPoints: sl.bullets,
        keyTakeaway: sl.keyPoint,
        practicalExample: sl.Example
      }))
    })),
    coreExamPool
  };
}

export function build40McqsForCourse(
  course: InternationalTrainingCourse
): CourseExamMCQ[] {
  const pool: Array<{
    q: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  }> = [...course.coreExamPool];

  for (const mod of course.modules) {
    for (const ccp of mod.criticalControlParameters) {
      pool.push({
        q: `In ${course.title} (${mod.title}), what is the standard requirement for "${ccp.parameter}"?`,
        options: [
          ccp.standardLimit,
          'No check or standard is required',
          'Check only once every two years',
          'Ignore the rule during busy shifts'
        ],
        correctIndex: 0,
        explanation: `${ccp.parameter} requires: ${ccp.standardLimit}. Action: ${ccp.correctiveProtocol}`
      });
      pool.push({
        q: `In ${course.title}, what corrective action must be taken if "${ccp.parameter}" is not met?`,
        options: [
          'Take no action and continue',
          ccp.correctiveProtocol,
          'Hide the record from the supervisor',
          'Wait until next month to check'
        ],
        correctIndex: 1,
        explanation: ccp.correctiveProtocol
      });
    }
    if (mod.presentationSlides) {
      for (const sl of mod.presentationSlides) {
        if (pool.length >= 40) break;
        pool.push({
          q: `According to ${mod.title} (${sl.title}), which of the following statements is correct?`,
          options: [
            sl.keyTakeaway,
            'Skip all daily monitoring and documentation',
            'Ignore safety and quality procedures during peak hours',
            'Training and supervision are never required'
          ],
          correctIndex: 0,
          explanation: sl.keyTakeaway
        });
      }
    }
  }

  while (pool.length < 40) {
    pool.push(course.coreExamPool[pool.length % course.coreExamPool.length]);
  }

  return pool.slice(0, 40).map((item, idx) => ({
    id: `${course.id}-q-${idx + 1}`,
    questionNumber: idx + 1,
    question: item.q,
    options: item.options,
    correctIndex: item.correctIndex,
    explanation: item.explanation
  }));
}

export function buildHubTrainingFromCourse(
  course: InternationalTrainingCourse
): HubTraining {
  const mcqs40 = build40McqsForCourse(course);
  return {
    id: course.id,
    category: 'International Certification',
    title: course.title,
    standardCode: course.code,
    subType: course.levelBadge,
    description: course.description,
    duration: course.duration,
    fees: 'Free Study & Exam | Rs. 1,000 Verified Certificate',
    enrollLink: '#trainings',
    isActive: true,
    customModules: course.modules.map((m) => ({
      id: m.id,
      subject: m.title,
      description: `${m.overview}\n\n${m.keyPrinciples.join('\n\n')}`
    })),
    customMcqs: mcqs40.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation
    }))
  };
}

// ============================================================================
// 1. HACCP LEVEL 03 (SUPERVISORY HACCP — 05 MODULES, 40 SLIDES, 40 MCQs)
// ============================================================================
export const HACCP_LEVEL_03_COURSE: InternationalTrainingCourse = {
  id: 'cert-2026-haccp-level-03',
  code: 'HACCP-L3',
  title: 'HACCP Level 03',
  levelBadge: 'Simple Presentation Course (05 Modules · 40 Slides · 40 MCQs · 60% Pass)',
  accreditationStandard:
    'Codex Alimentarius HACCP System • Supervisory Level 03 Presentation Course',
  duration: '05 Presentation Modules (40 Slides) + 40-MCQ Final Exam',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Supervisory-level Slide Presentation Course on Hazard Analysis and Critical Control Points (HACCP Level 03) for QA Supervisors, Production Team Leaders, Kitchen Supervisors, and Food Technologists. Covers Prerequisite Programs (PRPs), the 5 Preliminary Steps, the 7 Codex HACCP Principles, Critical Limits, Daily CCP Monitoring, Corrective Actions, and Verification.',
  modules: [
    {
      id: 'haccp3-mod-1',
      moduleNumber: 1,
      title: 'Introduction to HACCP Level 03 & Prerequisite Programs (PRPs)',
      estimatedMinutes: 40,
      overview:
        'Simple presentation explaining what HACCP is, why supervisors need Level 03 HACCP, the 4 types of food safety hazards, and how Prerequisite Programs (PRPs) form the foundation of a HACCP plan.',
      internationalClauses: [
        'Codex Alimentarius General Principles of Food Hygiene (CXC 1-1969)',
        'Highfield / RQF Level 3 Award in HACCP for Supervisors'
      ],
      keyPrinciples: [
        'HACCP stands for Hazard Analysis and Critical Control Points—a preventive food safety system that stops hazards before food reaches the consumer.',
        'The 4 Food Safety Hazards are Microbiological (bacteria, viruses, molds), Chemical (cleaning chemicals, pesticides, toxins), Physical (glass, metal, stones, hair), and Allergens (peanuts, milk, eggs, wheat, soy, fish, shellfish, sesame).',
        'Prerequisite Programs (PRPs) are basic hygiene foundations—such as clean premises, safe water, pest control, personal hygiene, and supplier approval—that must be working before HACCP starts.',
        'At Level 03, the Supervisor is responsible for training line staff, checking daily CCP logs, and taking immediate action if any limit is missed.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Prerequisite Program (PRP) Readiness Before HACCP',
          standardLimit: '100% active GMP, cleaning, pest control, personal hygiene, and safe water controls',
          correctiveProtocol: 'Fix any broken hygiene or sanitation prerequisite immediately so CCPs are not overloaded.'
        },
        {
          parameter: 'Supervisor Daily Log Verification',
          standardLimit: 'Every shift CCP record reviewed and countersigned by the Supervisor',
          correctiveProtocol: 'Investigate any missing or out-of-spec entry before releasing the batch.'
        }
      ],
      practicalChecklist: [
        'Verify that all pre-operational cleaning, handwashing, and pest control checks are completed before starting the line.',
        'Confirm that all probes and scales used by operators are clean and calibrated.',
        'Brief shift operators on the Critical Control Points (CCPs) for their station.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'What is HACCP & Why Do We Use It?',
          subtitle: 'Preventing Food Safety Problems Before They Happen',
          bulletPoints: [
            'HACCP stands for Hazard Analysis and Critical Control Points.',
            'Instead of only testing finished food at the end, HACCP controls hazards at every step from raw material receiving to dispatch.',
            'It was originally developed by NASA and Pillsbury to guarantee 100% safe food for astronauts and is now the global standard under Codex Alimentarius.',
            'HACCP is a legal and customer requirement for food factories, catering kitchens, dairy plants, bakeries, and hospitality units.'
          ],
          keyTakeaway:
            'HACCP is a preventive system designed to identify and control food safety hazards during production rather than relying on end-product testing.'
        },
        {
          slideNumber: 2,
          title: 'Role of the Supervisor in HACCP Level 03',
          subtitle: 'Bridging Management Planning and Shop-Floor Execution',
          bulletPoints: [
            'As a Supervisor or QA Officer, you are the daily guardian of the HACCP plan on the production floor.',
            'You ensure operators understand what to check, how to check it, and when to record it.',
            'You verify that thermometers, metal detectors, and chemical test strips are working properly at the start of every shift.',
            'When a Critical Limit is breached, you lead the immediate quarantine and corrective action.'
          ],
          keyTakeaway:
            'A HACCP plan on paper is useless unless the Supervisor enforces it on the floor every shift.'
        },
        {
          slideNumber: 3,
          title: 'Biological Hazards in Food',
          subtitle: 'Understanding Bacteria, Viruses, Parasites & Molds',
          bulletPoints: [
            'Biological hazards are the #1 cause of foodborne illness outbreaks worldwide.',
            'Pathogenic Bacteria: Salmonella (poultry/eggs), E. coli O157 (raw meat/water), Listeria monocytogenes (chilled ready-to-eat foods), and Clostridium perfringens / Bacillus cereus (spore-formers in slow-cooled gravies and rice).',
            'Viruses: Norovirus and Hepatitis A spread through infected food handlers and contaminated water.',
            'Bacteria need Food, Acidity (neutral pH), Time, Temperature (+5°C to +60°C), Oxygen, and Moisture (FATTOM) to multiply.'
          ],
          keyTakeaway:
            'Control biological hazards through strict time-temperature control, thorough cooking, rapid cooling, and clean hands.'
        },
        {
          slideNumber: 4,
          title: 'Chemical, Physical & Allergen Hazards',
          subtitle: 'Protecting Consumers from Non-Bacterial Risks',
          bulletPoints: [
            'Chemical Hazards: Cleaning detergents, sanitizers left on equipment, unapproved lubricants, pesticide residues, and mycotoxins (Aflatoxin in nuts/grains/milk).',
            'Physical Hazards: Broken glass, metal fragments from machinery, stones, bone splinters, jewelry, staples, and hard plastics.',
            'Allergen Hazards: Undeclared presence of major allergens (Milk, Eggs, Peanuts, Tree Nuts, Wheat/Gluten, Soy, Fish, Crustaceans, Sesame) due to cross-contact or wrong labels.',
            'Use food-grade lubricants, ban glass/wood/staples in production areas, and segregate allergens strictly.'
          ],
          keyTakeaway:
            'Every HACCP hazard analysis must evaluate Biological, Chemical, Physical, and Allergen hazards at each process step.'
        },
        {
          slideNumber: 5,
          title: 'What Are Prerequisite Programs (PRPs)?',
          subtitle: 'The Essential Hygiene Foundation Underneath HACCP',
          bulletPoints: [
            'Prerequisite Programs (PRPs) are the basic Good Manufacturing Practices (GMPs) and Good Hygiene Practices (GHPs) required to keep the facility clean and safe.',
            'Examples of PRPs include: Hygienic building layout, potable water supply, cleaning and sanitization schedules, pest control, personal hygiene, waste disposal, and supplier approval.',
            'Without strong PRPs, your HACCP plan would have too many Critical Control Points to manage.',
            'PRPs control general plant-wide hazards, while HACCP CCPs target specific high-risk process steps.'
          ],
          keyTakeaway:
            'Always build strong Prerequisite Programs (GMPs & GHPs) first before setting up your HACCP plan.'
        },
        {
          slideNumber: 6,
          title: 'Safe Water, Cleaning & Pest Control PRPs',
          subtitle: 'Daily Environmental Controls on the Floor',
          bulletPoints: [
            'Potable Water: All water used in food, ice, and equipment washing must meet drinking water standards and be tested regularly.',
            'Cleaning & Disinfection: Follow written Cleaning Schedules (SSOPs) showing what to clean, who cleans it, which chemical concentration to use, and supervisor sign-off.',
            'Pest Control: Keep doors sealed, screens intact, electric fly killers (glue-board type) working, and external bait stations inspected by a licensed contractor.'
          ],
          keyTakeaway:
            'Clean equipment, potable water, and a pest-free building prevent everyday contamination before food processing even begins.'
        },
        {
          slideNumber: 7,
          title: 'Personal Hygiene & Training PRPs',
          subtitle: 'People Are Key to Food Safety',
          bulletPoints: [
            'All staff must wear clean protective clothing, hairnets, beard snoods, and captive footwear before entering food zones.',
            'Handwashing: Wash hands with warm water and antibacterial liquid soap for at least 20 seconds upon entry, after breaks, and after touching raw materials.',
            'Medical Screening & Sickness Rule: Exclude any worker with vomiting or diarrhea until they have been symptom-free for at least 48 hours.',
            'Provide job-specific HACCP training so operators know the exact Critical Limits for their machines.'
          ],
          keyTakeaway:
            'Trained, healthy, and hygienic operators are your strongest defense against food contamination.'
        },
        {
          slideNumber: 8,
          title: 'Approved Suppliers & Raw Material Receiving PRPs',
          subtitle: 'Stopping Hazards at the Factory Gate',
          bulletPoints: [
            'Buy raw materials and packaging only from vetted, approved suppliers who hold valid food safety certifications.',
            'Inspect every delivery at the receiving bay for vehicle cleanliness, product temperature (Chilled ≤ +4°C, Frozen ≤ -18°C), expiry dates, and intact packaging.',
            'Verify Certificates of Analysis (COA) for high-risk ingredients such as milk powder, spices, nuts, and oils.',
            'Reject non-conforming deliveries immediately so unsafe ingredients never enter your store.'
          ],
          keyTakeaway:
            'Safe finished products require safe raw materials—never accept unapproved or temperature-abused deliveries.'
        }
      ]
    },
    {
      id: 'haccp3-mod-2',
      moduleNumber: 2,
      title: 'The 5 Preliminary Steps of HACCP (Codex Steps 1 to 5)',
      estimatedMinutes: 40,
      overview:
        'Simple presentation covering the 5 preparation steps required before starting Hazard Analysis: Assembling the HACCP Team, Describing the Product, Identifying Intended Use, Constructing the Process Flow Diagram, and On-Site Verification of the Flow Diagram.',
      internationalClauses: [
        'Codex Alimentarius HACCP Preliminary Steps 1 to 5'
      ],
      keyPrinciples: [
        'Before applying the 7 HACCP Principles, every facility must complete the 5 Codex Preliminary Steps.',
        'Step 1: Assemble a multidisciplinary HACCP Team (QA, Production, Engineering, Warehouse, Procurement).',
        'Step 2 & 3: Describe the Product (ingredients, pH, water activity, packaging, shelf-life, storage) and identify its Intended Use and target consumers (including vulnerable groups).',
        'Step 4 & 5: Draw a complete Process Flow Diagram from receiving to dispatch and walk the floor to verify its accuracy across all shifts.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Multidisciplinary HACCP Team Composition (Step 1)',
          standardLimit: 'Includes QA/Food Safety Lead, Production Supervisor, Maintenance Engineer, and Store/Purchasing rep',
          correctiveProtocol: 'Never allow one person alone in an office to write the HACCP plan without floor input.'
        },
        {
          parameter: 'On-Site Verification of Process Flow Diagram (Step 5)',
          standardLimit: 'Flow diagram physically walked and signed off on the floor during both day and night shifts',
          correctiveProtocol: 'Update the flow diagram immediately if any new equipment, rework loop, or bypass line is added.'
        }
      ],
      practicalChecklist: [
        'Check that your HACCP Team list is current and includes trained members from QA, Production, and Engineering.',
        'Verify that Product Specification Sheets include composition, allergens, packaging, storage temperature, and shelf life.',
        'Walk the production line with the printed Process Flow Diagram to confirm no step, rework, or waste stream is missing.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Overview of the 12-Step Codex HACCP Sequence',
          subtitle: '5 Preliminary Steps + 7 Core HACCP Principles',
          bulletPoints: [
            'The complete Codex Alimentarius HACCP system has 12 sequential steps.',
            'The first 5 steps are called the Preliminary Steps—they prepare the team and gather all product and process facts.',
            'The next 7 steps are the 7 Core HACCP Principles—where hazards are analyzed and CCPs are controlled.',
            'Skipping the 5 Preliminary Steps is the most common reason HACCP plans fail during external audits.'
          ],
          keyTakeaway:
            'Remember the formula: 5 Preliminary Steps + 7 HACCP Principles = 12 Total Codex HACCP Steps.'
        },
        {
          slideNumber: 2,
          title: 'Step 1: Assemble the Multidisciplinary HACCP Team',
          subtitle: 'Why One Person Cannot Build a HACCP Plan Alone',
          bulletPoints: [
            'A HACCP plan must be built by a team of people who truly know the product, the machines, and the daily floor operations.',
            'Core Team Members: Quality Assurance / Food Safety Leader (Team Leader), Production Manager/Supervisor, Maintenance/Engineering Specialist, and Warehouse/Procurement Supervisor.',
            'Why include Engineering? Because engineers understand how pasteurizers, ovens, chillers, and metal detectors work and fail.',
            'The HACCP Team Leader must hold formal HACCP Level 03 or Level 04 training.'
          ],
          keyTakeaway:
            'A strong HACCP team combines QA science, Production practicality, and Engineering machine knowledge.'
        },
        {
          slideNumber: 3,
          title: 'Step 2: Describe the Product Completely',
          subtitle: 'Writing the Product Safety Profile',
          bulletPoints: [
            'For every product or product group, the HACCP team writes a complete Product Description sheet.',
            'Include all raw materials, ingredients, food additives, and processing aids used.',
            'Record intrinsic safety factors: pH (acidity), Water Activity (aw), salt/sugar content, and preservatives.',
            'Specify packaging type (vacuum, modified atmosphere, aseptic carton, food-grade pouch), storage conditions (Chilled ≤ 4°C, Frozen ≤ -18°C, or Ambient), and validated shelf life.'
          ],
          keyTakeaway:
            'Intrinsic factors like pH (< 4.6) and Water Activity (< 0.85) determine which bacteria can or cannot grow in your product.'
        },
        {
          slideNumber: 4,
          title: 'Step 3: Identify Intended Use & Target Consumers',
          subtitle: 'How Will the Consumer Prepare and Eat the Product?',
          bulletPoints: [
            'Define whether the product is Ready-to-Eat (RTE), Ready-to-Reheat, or Raw (requires thorough cooking by the customer).',
            'Identify who will consume the product: General public, or High-Risk Vulnerable Groups (YOPI: Young infants, Old/elderly, Pregnant women, Immunocompromised hospital patients).',
            'Consider reasonably foreseeable misuse—for example, a consumer eating cookie dough raw or leaving a chilled dip at room temperature during a party.',
            'Ensure clear cooking and storage instructions ("Keep Refrigerated ≤ 4°C", "Cook Thoroughly to 75°C") are printed on the label.'
          ],
          keyTakeaway:
            'Products intended for infants, hospital patients, or Ready-to-Eat consumption require the strictest hazard controls.'
        },
        {
          slideNumber: 5,
          title: 'Step 4: Construct the Process Flow Diagram',
          subtitle: 'Mapping Every Step From Receiving to Dispatch',
          bulletPoints: [
            'Draw a clear, step-by-step block diagram showing every stage of your operation in exact sequence.',
            'Include Raw Material & Packaging Receiving, Storage (Dry/Chilled/Frozen), Weighing, Mixing, Cooking/Pasteurization, Cooling, Metal Detection, Packing, and Dispatch.',
            'Do not forget side inputs and outputs: Water/steam/air inputs, Rework loops, Returned goods, and Waste removal.',
            'Number every process step (Step 1, Step 2, Step 3...) so your Hazard Analysis table matches the Flow Diagram.'
          ],
          keyTakeaway:
            'If a process step (such as rework or allergen changeovers) is missing from your Flow Diagram, its hazards will be missed in your HACCP plan.'
        },
        {
          slideNumber: 6,
          title: 'Step 5: On-Site Confirmation of the Flow Diagram',
          subtitle: 'Walking the Production Floor to Verify Reality',
          bulletPoints: [
            'A flow diagram drawn in a meeting room often differs from what actually happens on the factory or kitchen floor.',
            'The entire HACCP team must take the printed Flow Diagram and walk the line from start to finish.',
            'Check operations during different shifts (morning, afternoon, and night shift) and weekend runs.',
            'Once confirmed accurate, all HACCP Team members sign and date the verified Process Flow Diagram.'
          ],
          keyTakeaway:
            'Auditors always check that your Process Flow Diagram is signed, dated, and 100% identical to your real production line.'
        },
        {
          slideNumber: 7,
          title: 'When Must Preliminary Steps Be Updated?',
          subtitle: 'Keeping Your Flow Diagram Alive',
          bulletPoints: [
            'Your Product Description and Process Flow Diagram are living documents—they must be updated whenever anything changes.',
            'Trigger events for update: Launching a new product, changing an ingredient or supplier, installing a new machine, changing packaging film, or extending shelf life.',
            'Even if no changes occur, review and re-verify the Flow Diagram at least once every 12 months.'
          ],
          keyTakeaway:
            'Never install new equipment or change a recipe without first updating your HACCP Flow Diagram and Hazard Analysis.'
        },
        {
          slideNumber: 8,
          title: 'Summary of the 5 Preliminary Steps',
          subtitle: 'Quick Checklist Before Starting Principle 1',
          bulletPoints: [
            'Team Ready: Multidisciplinary HACCP Team appointed and trained.',
            'Product Defined: Ingredients, allergens, pH, aw, packaging, storage, and shelf life documented.',
            'Consumer Identified: Intended use (RTE vs. Cook) and vulnerable groups defined.',
            'Flow Mapped & Verified: Every step, input, rework, and waste stream drawn and signed off on the floor.'
          ],
          keyTakeaway:
            'With the 5 Preliminary Steps complete, your team is ready to start the 7 Codex HACCP Principles.'
        }
      ]
    },
    {
      id: 'haccp3-mod-3',
      moduleNumber: 3,
      title: 'HACCP Principles 1, 2 & 3: Hazard Analysis, CCPs & Critical Limits',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on conducting a Hazard Analysis (Likelihood × Severity), using the 4-Question Codex Decision Tree to find Critical Control Points (CCPs), and setting measurable Critical Limits and Operational Limits.',
      internationalClauses: [
        'Codex Alimentarius HACCP Principles 1, 2, and 3'
      ],
      keyPrinciples: [
        'Principle 1 (Conduct a Hazard Analysis): List all potential Biological, Chemical, Physical, and Allergen hazards at each step, assess their Risk (Likelihood × Severity), and define preventive control measures.',
        'Principle 2 (Determine Critical Control Points — CCPs): Apply the Codex 4-Question Decision Tree to significant hazards to identify the exact steps essential to prevent or eliminate a hazard.',
        'Principle 3 (Establish Critical Limits): Set measurable, scientific boundaries (e.g., ≥ 75°C for 30s, pH ≤ 4.2, Metal Detector 1.5mm Fe) that separate safe product from unsafe product.',
        'Use stricter internal Operational Limits (buffer limits) so operators can adjust the process before a Critical Limit breach occurs.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Risk Assessment Matrix (Likelihood × Severity)',
          standardLimit: 'Evaluate every hazard by Likelihood (1–3 or 1–5) × Severity (1–3 or 1–5) to identify Significant Hazards',
          correctiveProtocol: 'Every Significant Hazard must be controlled by a CCP or Operational PRP (OPRP).'
        },
        {
          parameter: 'Measurable Critical Limits vs. Subjective Checks',
          standardLimit: '100% objective numerical parameters (Temperature, Time, pH, ppm, mm) — never subjective words like "looks cooked"',
          correctiveProtocol: 'Replace any vague visual limit on a CCP with a calibrated numerical measurement.'
        }
      ],
      practicalChecklist: [
        'Check that every step on your Flow Diagram has a matching Hazard Analysis entry covering Biological, Chemical, Physical, and Allergen hazards.',
        'Verify that each CCP was determined using the documented 4-Question Codex Decision Tree.',
        'Confirm that operators know both the Critical Limit and the Operational Limit for their station.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Principle 1: Conduct a Hazard Analysis',
          subtitle: 'Identifying What Can Go Wrong at Every Step',
          bulletPoints: [
            'Principle 1 is the heart of the HACCP plan.',
            'For every numbered step on your Process Flow Diagram, the team asks: "What Biological, Chemical, Physical, or Allergen hazard could be introduced, increase, or survive at this step?"',
            'Clearly state the root cause of each hazard (e.g., "Survival of Salmonella due to insufficient cooking core temperature").',
            'Specify the Control Measure that prevents or eliminates the hazard (e.g., "Cook to core temperature ≥ 75°C for at least 30 seconds").'
          ],
          keyTakeaway:
            'Always write both the specific hazard AND its cause at each process step so the right control measure can be selected.'
        },
        {
          slideNumber: 2,
          title: 'Risk Assessment Matrix (Likelihood × Severity)',
          subtitle: 'Separating Significant Hazards from Minor Risks',
          bulletPoints: [
            'Not every possible hazard requires a Critical Control Point—we use a Risk Matrix to find Significant Hazards.',
            'Likelihood (Probability): How likely is this hazard to occur? (1 = Low / Rare, 2 = Medium / Possible, 3 = High / Frequent).',
            'Severity (Consequence): How serious is the harm to the consumer? (1 = Minor discomfort, 2 = Moderate illness/injury, 3 = Severe illness, hospitalization, or death).',
            'Risk Score = Likelihood × Severity. Any hazard with a high risk score (or high severity) is a Significant Hazard that must be evaluated in the CCP Decision Tree.'
          ],
          keyTakeaway:
            'Risk = Likelihood × Severity. Significant hazards must be controlled by a CCP or Operational PRP.'
        },
        {
          slideNumber: 3,
          title: 'Principle 2: Determine Critical Control Points (CCPs)',
          subtitle: 'What Makes a Step a Critical Control Point?',
          bulletPoints: [
            'A Critical Control Point (CCP) is a step at which control CAN be applied and is ESSENTIAL to prevent or eliminate a food safety hazard or reduce it to an acceptable level.',
            'Typical examples of CCPs: Thermal Cooking / Pasteurization (kills pathogens), Rapid Blast Chilling (stops spore growth), Acidification/pH control, and Final Metal Detection / X-Ray.',
            'A facility should have a focused, manageable number of true CCPs (usually 2 to 5 CCPs per line).'
          ],
          keyTakeaway:
            'A CCP is the last line of defense in your process where a hazard is eliminated or reduced to a safe level.'
        },
        {
          slideNumber: 4,
          title: 'Using the Codex 4-Question CCP Decision Tree',
          subtitle: 'The Step-by-Step Logic to Identify CCPs',
          bulletPoints: [
            'For each Significant Hazard, answer the 4 Codex Questions in order:',
            'Q1: Do preventive control measures exist at this step? (If YES → Go to Q2).',
            'Q2: Is this step specifically designed to eliminate or reduce the hazard to an acceptable level? (If YES → It IS a CCP! e.g., Pasteurizer, Oven, Metal Detector. If NO → Go to Q3).',
            'Q3: Could contamination with the hazard occur in excess of acceptable levels or increase to unacceptable levels? (If NO → Not a CCP; if YES → Go to Q4).',
            'Q4: Will a subsequent (later) step eliminate or reduce the hazard to an acceptable level? (If YES → Not a CCP here, because the later step is the CCP; if NO → This step IS a CCP!).'
          ],
          keyTakeaway:
            'If a step is specifically designed to kill or remove the hazard (Q2 = Yes), or if no downstream step will fix it (Q4 = No), it is a CCP!'
        },
        {
          slideNumber: 5,
          title: 'Principle 3: Establish Critical Limits',
          subtitle: 'Drawing the Clear Line Between Safe and Unsafe Product',
          bulletPoints: [
            'A Critical Limit is the maximum or minimum measurable value to which a parameter must be controlled at a CCP to ensure food safety.',
            'Critical Limits must ALWAYS be measurable numbers—such as Temperature (°C), Time (minutes/seconds), pH, Chlorine (ppm), Water Activity (aw), or Metal Test Piece size (mm).',
            'Never use vague descriptions like "cook until golden brown" or "chill until cold" as a Critical Limit because they cannot be measured objectively in real time.',
            'If a product crosses a Critical Limit, it is potentially unsafe and MUST be quarantined.'
          ],
          keyTakeaway:
            'Critical Limits must be objective, measurable, and fast to check on the production floor.'
        },
        {
          slideNumber: 6,
          title: 'Examples of Validated Critical Limits',
          subtitle: 'Standard Benchmarks Used Across the Food Industry',
          bulletPoints: [
            'Poultry & Minced Meat Cooking CCP: Core temperature ≥ 75°C for at least 30 seconds (or ≥ 70°C for 2 minutes).',
            'Milk HTST Pasteurization CCP: ≥ 72°C for at least 15 seconds.',
            'Hot Holding CCP: Maintain core temperature at ≥ 63°C continuously.',
            'Chilled Storage / Cold Holding CCP: Maintain product temperature at ≤ 4°C (max 5°C).',
            'Metal Detector CCP: 100% detection and automatic rejection of 1.5 mm Ferrous, 2.0 mm Non-Ferrous, and 2.5 mm Stainless Steel test spheres.'
          ],
          keyTakeaway:
            'Memorize these standard Critical Limits—they are tested in almost every HACCP exam and workplace audit.'
        },
        {
          slideNumber: 7,
          title: 'Critical Limits vs. Operational (Target) Limits',
          subtitle: 'Building a Safety Buffer to Prevent CCP Failures',
          bulletPoints: [
            'Critical Limit: The absolute legal/safety boundary (e.g., Cooking ≥ 75°C; Chiller ≤ 5°C). Crossing it triggers quarantine.',
            'Operational Limit (Target Limit): A stricter internal working target set by the Supervisor to give an early warning buffer (e.g., Target Cooking = 78°C; Target Chiller = 3°C).',
            'If a chiller drifts from 3°C to 4.2°C (crossing the Operational Limit), the operator adjusts the thermostat BEFORE it ever breaches the 5.0°C Critical Limit!',
            'Operational Limits save time, money, and product by preventing CCP deviations before they happen.'
          ],
          keyTakeaway:
            'Operational Limits act as an early warning alarm so you can adjust the machine before breaching the Critical Limit.'
        },
        {
          slideNumber: 8,
          title: 'Scientific Validation of Critical Limits',
          subtitle: 'Proving Your Critical Limits Actually Work',
          bulletPoints: [
            'Where do Critical Limits come from? They cannot be guessed.',
            'Sources of Validation: National/Codex food safety regulations, published scientific thermal-kill studies, equipment manufacturer specifications, or accredited laboratory challenge trials.',
            'Keep copies of the regulatory standards or lab trial reports in your HACCP Manual as proof for auditors.'
          ],
          keyTakeaway:
            'Every Critical Limit in your HACCP plan must be backed by regulatory standards or scientific validation.'
        }
      ]
    },
    {
      id: 'haccp3-mod-4',
      moduleNumber: 4,
      title: 'HACCP Principles 4 & 5: CCP Monitoring & Corrective Actions',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on designing a CCP Monitoring System (What, How, When, Who) and executing Principle 5 Corrective Actions (Immediate Quarantine, Product Disposition, and 5-Why Root Cause Analysis) when a deviation occurs.',
      internationalClauses: [
        'Codex Alimentarius HACCP Principles 4 and 5'
      ],
      keyPrinciples: [
        'Principle 4 (Establish a Monitoring System): Define What is measured, How it is measured, When (frequency), and Who is trained and authorized to perform and record the check.',
        'Monitoring can be Continuous (automated temperature chart recorders) or Batch/Periodic (manual probe checks every 30–60 minutes).',
        'Principle 5 (Establish Corrective Actions): When a Critical Limit is breached, restore process control, quarantine all affected product back to the last good check, evaluate product safety, and fix the root cause.',
        'All CCP monitoring and corrective action records must be signed in real time by the operator and verified by the Supervisor.'
      ],
      criticalControlParameters: [
        {
          parameter: '4 Ws of CCP Monitoring (What, How, When, Who)',
          standardLimit: 'Real-time measurement with calibrated instrument at set frequency by a named trained operator',
          correctiveProtocol: 'Never allow uncalibrated instruments or pre-filled/backdated log sheets.'
        },
        {
          parameter: 'Quarantine Scope During a CCP Deviation',
          standardLimit: 'Hold 100% of product produced since the LAST passed monitoring check',
          correctiveProtocol: 'Apply a physical Red Quarantine Hold tag and obtain QA Manager approval before rework or disposal.'
        }
      ],
      practicalChecklist: [
        'Check that every CCP log sheet clearly prints the Critical Limit, Monitoring Frequency, and Corrective Action instructions at the top.',
        'Verify that thermometers are checked in ice-water (0°C ± 0.5°C) and metal detectors are tested with Fe, Non-Fe, and SS test wands every hour.',
        'Audit CCP logs during your shift to ensure operators record exact readings and times in ink.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Principle 4: Establish a CCP Monitoring System',
          subtitle: 'Keeping Real-Time Watch Over Your Critical Control Points',
          bulletPoints: [
            'Monitoring is the planned sequence of observations or measurements to assess whether a CCP is under control and within its Critical Limit.',
            'It provides an accurate written record for future verification and legal due diligence.',
            'Every monitoring procedure in your HACCP table must clearly define the 4 Ws: WHAT, HOW, WHEN, and WHO.'
          ],
          keyTakeaway:
            'Monitoring proves in real time that every batch met its Critical Limit before leaving your facility.'
        },
        {
          slideNumber: 2,
          title: 'The 4 Ws of Monitoring (What, How, When, Who)',
          subtitle: 'Structuring Your HACCP Monitoring Table',
          bulletPoints: [
            'WHAT will be monitored? The exact parameter (e.g., Core internal temperature of cooked chicken breast).',
            'HOW will it be monitored? The calibrated instrument and method (e.g., Insert sanitized digital probe thermometer into the thickest center part).',
            'WHEN (Frequency) will it be monitored? Continuous or periodic (e.g., Every batch, or every 30 minutes).',
            'WHO will monitor it? The specific trained job role (e.g., Line Cook / Pasteurizer Operator, verified by QA Supervisor).'
          ],
          keyTakeaway:
            'Every CCP monitoring instruction must clearly specify What, How, When, and Who.'
        },
        {
          slideNumber: 3,
          title: 'Continuous vs. Periodic (Batch) Monitoring',
          subtitle: 'Understanding Monitoring Frequencies',
          bulletPoints: [
            'Continuous Monitoring: An automated sensor records every second of production (e.g., Pasteurizer chart recorder or inline Metal Detector). Even with continuous sensors, an operator must check the display and test the reject mechanism regularly (e.g., hourly).',
            'Periodic / Batch Monitoring: When an operator checks every batch or checks every 30 or 60 minutes.',
            'Important Rule for Periodic Checks: If your 10:00 AM check passed and your 11:00 AM check FAILED, all product made between 10:00 AM and 11:00 AM must be quarantined because you do not know the exact minute the failure started!'
          ],
          keyTakeaway:
            'Shorter intervals between checks mean less product has to be quarantined if a failure happens.'
        },
        {
          slideNumber: 4,
          title: 'Instrument Calibration (Thermometers, Scales & Metal Detectors)',
          subtitle: 'Making Sure Your Readings Are True',
          bulletPoints: [
            'An uncalibrated thermometer that reads 76°C when the real temperature is 66°C can cause a food poisoning outbreak.',
            'Ice-Point & Boiling-Point Thermometer Check: In a 50:50 crushed ice and water slurry, a probe must read 0.0°C (±0.5°C to ±1.0°C). In boiling water, it must read 100.0°C (±1.0°C).',
            'Metal Detector Challenge Test: Pass Ferrous (Fe), Non-Ferrous (Non-Fe), and Stainless Steel (SS) test pieces through the center of the aperture at the start of the shift, every hour, and at the end of the run.'
          ],
          keyTakeaway:
            'Always calibrate and challenge-test your CCP instruments daily and log the results.'
        },
        {
          slideNumber: 5,
          title: 'Principle 5: Establish Corrective Actions',
          subtitle: 'What to Do Immediately When a Critical Limit Is Breached',
          bulletPoints: [
            'When a monitoring check shows that a Critical Limit has been breached, operators must never ignore it or keep running.',
            'Every Corrective Action has TWO mandatory parts:',
            'Part 1 — Immediate Correction (Containment): Stop the line, adjust/repair the process to bring the CCP back under control, and quarantine all affected product produced since the last good check.',
            'Part 2 — Root Cause Corrective Action (Preventive): Find out WHY the failure happened and fix the system so it does not happen again.'
          ],
          keyTakeaway:
            'Corrective Action = (1) Quarantine affected product & restore control + (2) Eliminate the root cause.'
        },
        {
          slideNumber: 6,
          title: 'Practical Examples of Immediate CCP Corrections',
          subtitle: 'Real-World Floor Actions for Common Deviations',
          bulletPoints: [
            'Cooking CCP Deviation (< 75°C): Continue cooking the batch immediately until the thickest piece reaches ≥ 75°C for 30 seconds, and check oven burner/thermostat.',
            'Blast Chilling Deviation (> 5°C after max time): Evaluate time-temperature profile with QA; if safe, rapidly chill in smaller pans, or discard if held in the Danger Zone too long.',
            'Metal Detector Failure (Test wand not rejected): Stop packing line immediately, quarantine all packs produced since the last passed hourly check, repair the reject arm, and re-pass 100% of quarantined packs through a working detector.'
          ],
          keyTakeaway:
            'If a Metal Detector fails its hourly test, quarantine and re-screen 100% of packs back to the last passed check.'
        },
        {
          slideNumber: 7,
          title: 'Handling Quarantined Non-Conforming Product',
          subtitle: 'Physical Hold Tags & Authorized Release',
          bulletPoints: [
            'Quarantined stock must be physically moved to a designated Hold / Quarantine Cage or clearly labeled with a bright RED "ON HOLD — DO NOT USE" tag.',
            'Line operators and warehouse staff are NOT allowed to remove a Quarantine Tag.',
            'Only the QA Manager or HACCP Team Leader can decide the final disposition of quarantined stock: (a) Rework/Re-process safely, (b) Re-screen, or (c) Destroy/Dispose as waste with a signed Destruction Certificate.'
          ],
          keyTakeaway:
            'Quarantined product must be physically tagged and locked until the QA Manager signs its release or disposal.'
        },
        {
          slideNumber: 8,
          title: 'Simple 5-Why Root Cause Analysis',
          subtitle: 'Stopping the Problem from Returning Tomorrow',
          bulletPoints: [
            'To find the true root cause of a CCP failure, ask "Why?" five times:',
            'Example: Why did the chiller reach +9°C? → Why 1: Warm air entered. → Why 2: Door was left open for 45 mins. → Why 3: Plastic strip curtain was torn and door alarm was switched off. → Why 4: No maintenance work order was raised. → Why 5: Missing daily door-alarm check on the shift checklist.',
            'Permanent Fix: Replace strip curtain, hardwire the door alarm so it cannot be switched off, and add a daily alarm check.'
          ],
          keyTakeaway:
            'Fixing the symptom is temporary; fixing the 5-Why Root Cause makes your HACCP system permanently stronger.'
        }
      ]
    },
    {
      id: 'haccp3-mod-5',
      moduleNumber: 5,
      title: 'HACCP Principles 6 & 7: Verification, Documentation & Auditing',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on Principle 6 (Verification vs. Validation, Internal Audits, Microbiological Testing) and Principle 7 (HACCP Documentation, Record-Keeping Rules, and Legal Due Diligence).',
      internationalClauses: [
        'Codex Alimentarius HACCP Principles 6 and 7'
      ],
      keyPrinciples: [
        'Principle 6 (Establish Verification Procedures): Confirm that the HACCP system is working effectively in practice through internal audits, supervisor record reviews, calibration checks, and lab testing.',
        'Validation ("Are we doing the right thing?") proves scientifically before production that a control works; Verification ("Are we doing it right?") checks daily/monthly that the plan is being followed.',
        'Principle 7 (Establish Documentation & Record-Keeping): Maintain the HACCP Manual, SOPs, and signed daily monitoring/corrective action logs for legal due diligence.',
        'Review the entire HACCP plan at least once a year and whenever any product, process, equipment, or emerging hazard changes.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Validation vs. Verification Distinction',
          standardLimit: 'Validation = Scientific proof BEFORE operation; Verification = Ongoing audit/testing DURING/AFTER operation',
          correctiveProtocol: 'Perform re-validation whenever recipes, equipment, or packaging change; perform verification continuously.'
        },
        {
          parameter: 'Annual & Change-Triggered HACCP Plan Review',
          standardLimit: 'Full HACCP review at least once every 12 months and prior to any process/recipe modification',
          correctiveProtocol: 'Document meeting minutes and updated hazard analysis signed by the HACCP Team.'
        }
      ],
      practicalChecklist: [
        'Verify that all daily CCP logs are filled in permanent ink with zero correction fluid (white-out) or pre-filled future entries.',
        'Check that monthly environmental swabs and finished-product microbiological lab reports meet targets.',
        'Confirm that the annual HACCP System Review and Internal Audit schedule are up to date.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Principle 6: Establish Verification Procedures',
          subtitle: 'Proving That Your HACCP Plan Works Every Day',
          bulletPoints: [
            'Monitoring checks a CCP in real time; Verification is the step back to check that the ENTIRE HACCP system is working properly and being followed honestly.',
            'Examples of Verification Activities:',
            '• Supervisor daily review and countersignature of CCP monitoring and corrective action logs.',
            '• Internal HACCP Audits and unannounced floor inspections.',
            '• Thermometer and Metal Detector calibration records.',
            '• Microbiological lab testing of raw materials, food-contact surfaces (swabs), water, and finished products.'
          ],
          keyTakeaway:
            'Verification gives management confidence that operators are following the HACCP plan accurately on every shift.'
        },
        {
          slideNumber: 2,
          title: 'Validation vs. Verification (Crucial Exam Topic)',
          subtitle: 'Knowing the Exact Difference Between the Two Terms',
          bulletPoints: [
            'Validation ("Doing the Right Thing"): Obtaining scientific and technical proof BEFORE starting routine production that a Critical Limit will effectively control the hazard (e.g., proving that 75°C for 30s kills Salmonella).',
            'Verification ("Doing It Right"): Ongoing checks DURING and AFTER production to confirm the validated plan is actually being followed (e.g., checking daily cooking logs and taking lab samples).',
            'Simple Analogy: Validation is designing a safe speed limit for a bridge; Verification is using a speed camera to check that drivers obey that speed limit.'
          ],
          keyTakeaway:
            'Validation = Scientific proof upfront that the rule works. Verification = Ongoing checks and audits that the rule is followed.'
        },
        {
          slideNumber: 3,
          title: 'Internal HACCP Audits & Floor Walkthroughs',
          subtitle: 'Checking Reality Against the Written Plan',
          bulletPoints: [
            'Conduct scheduled Internal HACCP Audits across all shifts (including night and weekend shifts).',
            'An internal auditor must be independent of the area being audited (you cannot audit your own work).',
            'During the audit, observe operators live on the line, interview them on their Critical Limits, and trace a batch record from receiving to dispatch.',
            'Raise Non-Conformance Reports (NCRs) for any gaps found and close them with corrective actions.'
          ],
          keyTakeaway:
            'Internal audits find and fix weak spots internally before an external customer or government inspector visits.'
        },
        {
          slideNumber: 4,
          title: 'Microbiological Swabbing & Product Lab Testing',
          subtitle: 'Using Laboratory Results to Verify Hygiene & CCPs',
          bulletPoints: [
            'Why do we still test finished products and swab tables if we have CCPs? To VERIFY that our cleaning PRPs and thermal CCPs worked!',
            'ATP Bioluminescence Swabs: Give an instant hygiene reading in 15 seconds after cleaning so equipment can be re-cleaned immediately if dirty.',
            'Microbiological Lab Tests: Check for Total Plate Count, Coliforms, E. coli, Salmonella, and Listeria monocytogenes.',
            'Trend lab results monthly to spot any early hygiene drift.'
          ],
          keyTakeaway:
            'Lab testing is a Verification tool that confirms your PRPs and CCPs are delivering safe food.'
        },
        {
          slideNumber: 5,
          title: 'Principle 7: Documentation & Record-Keeping',
          subtitle: 'If It Is Not Written Down, It Did Not Happen',
          bulletPoints: [
            'Principle 7 requires maintaining two types of documents:',
            'System Documentation (The HACCP Manual): Prerequisite Programs, Product Descriptions, Verified Flow Diagrams, Hazard Analysis tables, CCP Decision Trees, and Standard Operating Procedures (SOPs).',
            'Operational Records (Daily Proof): Signed CCP monitoring sheets, Corrective Action logs, Calibration logs, Cleaning sign-offs, Training records, and Supplier COAs.'
          ],
          keyTakeaway:
            'Complete, honest records are your only proof to auditors and regulators that your HACCP plan works.'
        },
        {
          slideNumber: 6,
          title: 'Good Documentation Practices (GDP) on the Floor',
          subtitle: 'Rules for Filling Out Food Safety Logs Properly',
          bulletPoints: [
            'Write in permanent blue or black ink (never use pencil).',
            'Record the EXACT numerical reading (e.g., "+3.4°C", never just a tick mark "✓" or "OK") at the exact time the check is done.',
            'Never use correction fluid (white-out) or tear pages out of a logbook. If you make a mistake, draw a single line through it, write the correct value, and sign your initials.',
            'NEVER pre-fill future times or fake readings ("dry-labbing")—falsifying CCP logs is a critical offense.'
          ],
          keyTakeaway:
            'Record real numbers in real time with permanent ink—never use tick marks, white-out, or pre-filled times.'
        },
        {
          slideNumber: 7,
          title: 'Record Retention & Legal Due Diligence',
          subtitle: 'How Long to Keep HACCP Records & Why They Protect You',
          bulletPoints: [
            'How long should HACCP records be kept? Always keep records for at least the full Shelf Life of the product PLUS 12 months (or a minimum of 1 to 3 years per company/regulatory policy).',
            'What is a Legal "Due Diligence" Defense? Under food safety law, if a customer claims illness, your business must prove it took "all reasonable precautions and exercised all due diligence" to prevent the offense.',
            'Signed, calibrated, verified HACCP logs are your primary legal Due Diligence defense.'
          ],
          keyTakeaway:
            'Retain HACCP records beyond product shelf life (+1 year) to protect the company with a valid Due Diligence defense.'
        },
        {
          slideNumber: 8,
          title: 'Mandatory Annual HACCP Review & Course Summary',
          subtitle: 'Keeping Your HACCP System Continually Updated',
          bulletPoints: [
            'The HACCP team must formally review the entire HACCP plan at least once every 12 months.',
            'Also trigger an immediate review whenever there is a new product, new ingredient, new machine, recurring customer complaint, or new food safety regulation.',
            'Summary of the 7 Principles: (1) Hazard Analysis → (2) Determine CCPs → (3) Establish Critical Limits → (4) Monitor CCPs → (5) Corrective Actions → (6) Verification → (7) Documentation & Records.'
          ],
          keyTakeaway:
            'Congratulations on completing all 5 Modules of HACCP Level 03! Proceed to the 40-MCQ Final Exam (60% passing mark).'
        }
      ]
    }
  ],
  coreExamPool: [
    {
      q: 'What does the acronym HACCP stand for?',
      options: [
        'Hazard Analysis and Critical Control Points',
        'Health and Clean Cooking Procedures',
        'Hospital Administration and Catering Control Plan',
        'High Accuracy Chemical Cleaning Process'
      ],
      correctIndex: 0,
      explanation: 'HACCP stands for Hazard Analysis and Critical Control Points.'
    },
    {
      q: 'How many Preliminary Steps and how many Core Principles make up the 12-Step Codex HACCP system?',
      options: [
        '5 Preliminary Steps and 7 Core Principles',
        '2 Preliminary Steps and 10 Core Principles',
        '6 Preliminary Steps and 6 Core Principles',
        '4 Preliminary Steps and 4 Core Principles'
      ],
      correctIndex: 0,
      explanation: 'The 12-step Codex HACCP sequence consists of 5 Preliminary Steps followed by 7 Core Principles.'
    },
    {
      q: 'Which of the following are the 4 main categories of food safety hazards evaluated in a HACCP study?',
      options: [
        'Biological, Chemical, Physical, and Allergens',
        'Financial, Marketing, Sales, and Transport',
        'Electrical, Mechanical, Plumbing, and Painting',
        'Color, Taste, Smell, and Price'
      ],
      correctIndex: 0,
      explanation: 'A modern HACCP study evaluates Biological, Chemical, Physical, and Allergen hazards at every step.'
    },
    {
      q: 'What must be established and working effectively BEFORE implementing a HACCP plan?',
      options: [
        'Prerequisite Programs (PRPs) such as GMPs, cleaning, pest control, personal hygiene, and safe water',
        'A television commercial',
        'Only end-product tasting',
        'Nothing is needed before HACCP'
      ],
      correctIndex: 0,
      explanation: 'Prerequisite Programs (PRPs) build the hygienic foundation required for a HACCP plan to succeed.'
    },
    {
      q: 'What is Step 1 of the 5 Codex Preliminary Steps?',
      options: [
        'Assemble a multidisciplinary HACCP Team',
        'Destroy all raw materials',
        'Ship finished goods',
        'Close the warehouse'
      ],
      correctIndex: 0,
      explanation: 'Step 1 is assembling a multidisciplinary HACCP team (QA, Production, Engineering, Store/Procurement).'
    },
    {
      q: 'Why must the HACCP team physically walk the production floor during Preliminary Step 5?',
      options: [
        'To confirm on-site that the Process Flow Diagram matches actual operations across all shifts',
        'To count the number of office chairs',
        'To paint the factory walls',
        'On-site verification is never required'
      ],
      correctIndex: 0,
      explanation: 'Preliminary Step 5 requires on-site verification of the Process Flow Diagram across all operating shifts.'
    },
    {
      q: 'What is Principle 1 of the 7 Codex HACCP Principles?',
      options: [
        'Conduct a Hazard Analysis',
        'Buy new delivery trucks',
        'Design product logos',
        'Hire new office receptionists'
      ],
      correctIndex: 0,
      explanation: 'Principle 1 is to conduct a Hazard Analysis (identifying hazards, assessing risk, and defining control measures).'
    },
    {
      q: 'In the Codex 4-Question CCP Decision Tree, if Question 2 ("Is this step specifically designed to eliminate or reduce the hazard to an acceptable level?") is answered YES, what is the result?',
      options: [
        'The step is a Critical Control Point (CCP)',
        'The step is deleted from the factory',
        'No monitoring is needed at this step',
        'The product must be thrown away'
      ],
      correctIndex: 0,
      explanation: 'When a step is specifically designed to eliminate or reduce a significant hazard to an acceptable level (Q2 = Yes), it is a CCP.'
    },
    {
      q: 'Which of the following is a valid, measurable Critical Limit for a Cooking CCP?',
      options: [
        'Core internal temperature ≥ 75°C held for at least 30 seconds',
        'Cook until the chicken looks nice and brown',
        'Cook until the chef feels it is ready',
        'Check the color of the smoke'
      ],
      correctIndex: 0,
      explanation: 'Critical Limits must be objective, measurable numerical parameters such as ≥ 75°C for 30 seconds.'
    },
    {
      q: 'What is the purpose of setting an internal "Operational Limit" that is stricter than the Critical Limit?',
      options: [
        'To provide an early warning safety buffer so operators can adjust the process before a Critical Limit breach happens',
        'To confuse operators',
        'To replace thermometer calibration',
        'To allow unsafe food to be shipped'
      ],
      correctIndex: 0,
      explanation: 'Operational Limits give operators a buffer margin to take action before crossing the safety Critical Limit.'
    },
    {
      q: 'If a Metal Detector fails its hourly test-piece check at 11:00 AM (after passing at 10:00 AM), what product must be quarantined?',
      options: [
        '100% of product packed since the last passed check at 10:00 AM',
        'Only the single pack at 11:00 AM',
        'No product needs to be quarantined',
        'Only next week’s production'
      ],
      correctIndex: 0,
      explanation: 'All product produced since the last passed monitoring check (10:00 AM) must be quarantined and re-screened through a working detector.'
    },
    {
      q: 'What is the key difference between Validation and Verification in HACCP?',
      options: [
        'Validation is scientific proof BEFORE production that a control works; Verification is ongoing auditing/testing proving the plan is followed in practice',
        'They mean the exact same thing',
        'Validation is only done by dishwashers',
        'Verification means never keeping records'
      ],
      correctIndex: 0,
      explanation: 'Validation proves upfront that a control measure is scientifically capable; Verification confirms ongoing compliance.'
    },
    {
      q: 'Which of the following is correct Good Documentation Practice (GDP) when recording CCP monitoring checks?',
      options: [
        'Write exact numerical readings in permanent ink at the actual time of the check, and never use white-out or pre-fill future times',
        'Use a pencil and fill in the whole sheet in the morning before production starts',
        'Use correction fluid (white-out) to hide mistakes',
        'Write only checkmarks (✓) without numbers'
      ],
      correctIndex: 0,
      explanation: 'CCP logs are legal food safety records that must be completed in real time using permanent ink and exact values.'
    }
  ]
};

// ============================================================================
// 2. HACCP LEVEL 04 (MANAGING & AUDITING HACCP SYSTEMS — 05 MODULES, 40 SLIDES, 40 MCQs)
// ============================================================================
export const HACCP_LEVEL_04_COURSE: InternationalTrainingCourse = {
  id: 'cert-2026-haccp-level-04',
  code: 'HACCP-L4',
  title: 'HACCP Level 04',
  levelBadge: 'Simple Presentation Course (05 Modules · 40 Slides · 40 MCQs · 60% Pass)',
  accreditationStandard:
    'Codex Alimentarius & RQF Level 4 Award in Managing HACCP for Food Manufacturing & Catering',
  duration: '05 Presentation Modules (40 Slides) + 40-MCQ Final Exam',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Managerial-level Slide Presentation Course (HACCP Level 04) for QA Managers, Food Safety Team Leaders, Production Managers, and Auditors. Covers Designing & Leading HACCP Systems, Advanced Hazard Risk Modeling, Scientific Validation & Thermal Lethality, Managing Recalls/Traceability/Food Fraud (VACCP/TACCP), and Auditing & Continual Improvement of the HACCP System.',
  modules: [
    {
      id: 'haccp4-mod-1',
      moduleNumber: 1,
      title: 'Strategic Leadership of the HACCP System & Food Safety Culture',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on the executive duties of a Level 04 HACCP Team Leader: designing the HACCP architecture, securing top management commitment, managing linear vs. modular HACCP plans, and building a positive Food Safety Culture.',
      internationalClauses: [
        'Codex CXC 1-1969 (2022 Rev.) Management Commitment & Food Safety Culture',
        'RQF Level 4 Managing the HACCP System'
      ],
      keyPrinciples: [
        'At HACCP Level 04, you design, validate, manage, and audit the entire HACCP system rather than just monitoring a single station.',
        'Top Management Commitment provides the budget, time, laboratory resources, and authority to stop production whenever food safety is at risk.',
        'Choose between a Linear HACCP Plan (for a single dedicated product line) or a Modular / Process-Led HACCP Plan (for complex multi-product factories and catering operations).',
        'Food Safety Culture means employees follow food safety rules even when nobody is watching, supported by open reporting and leadership role-modeling.'
      ],
      criticalControlParameters: [
        {
          parameter: 'HACCP Team Leader Authority to Stop Production',
          standardLimit: 'Unrestricted written authority to halt any line and quarantine stock upon CCP breach',
          correctiveProtocol: 'Escalate directly to Managing Director if commercial pressure ever challenges a food safety hold.'
        },
        {
          parameter: 'Linear vs. Modular / Process-Led HACCP Scope',
          standardLimit: '100% of products, shifts, rework loops, and subcontracted processes covered in the HACCP scope',
          correctiveProtocol: 'Conduct a gap analysis whenever new SKUs or shift patterns are introduced.'
        }
      ],
      practicalChecklist: [
        'Verify that the Food Safety Policy is signed by Top Management and communicated to all staff in languages they understand.',
        'Confirm that the HACCP Team has a trained deputy leader so coverage is maintained during leave.',
        'Review monthly Food Safety Culture metrics (near-miss reporting, training completion, audit closure).'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'What Makes HACCP Level 04 Different from Level 03?',
          subtitle: 'Stepping Up From Supervisor to HACCP System Manager',
          bulletPoints: [
            'Level 02 is for operators (following CCP rules); Level 03 is for supervisors (monitoring and checking daily logs).',
            'Level 04 is for Managers, QA Heads, and HACCP Team Leaders who DESIGN, VALIDATE, AUDIT, and CONTINUALLY IMPROVE the entire HACCP system.',
            'At Level 04, you decide which HACCP structure fits the factory, validate Critical Limits scientifically, lead recalls, and chair Management Review meetings.'
          ],
          keyTakeaway:
            'HACCP Level 04 equips you to build and lead the entire HACCP system from the ground up.'
        },
        {
          slideNumber: 2,
          title: 'Securing Top Management Commitment & Resources',
          subtitle: 'Why Leadership Support Is Mandatory under Codex & GFSI',
          bulletPoints: [
            'A HACCP system cannot succeed if top management only cares about production volume and cuts the hygiene or maintenance budget.',
            'As HACCP Manager, you present business-case reports to the CEO/Director to secure budgets for preventive maintenance, lab testing, staff training, and automated CCP sensors.',
            'Establish a clear written policy: "Food Safety overrides production targets—any HACCP Team Leader has full authority to stop a line if a Critical Limit fails."'
          ],
          keyTakeaway:
            'Without top management backing and the authority to stop an unsafe line, HACCP fails.'
        },
        {
          slideNumber: 3,
          title: 'Selecting the Right HACCP Architecture (Linear vs. Modular)',
          subtitle: 'Structuring HACCP for Simple vs. Complex Operations',
          bulletPoints: [
            'Linear (Product-Specific) HACCP Plan: Best for factories making one main product family on a dedicated line (e.g., a UHT milk line or a bottled water plant).',
            'Modular HACCP Plan: Best for factories with many products sharing common process modules (e.g., Mixing Module, Baking Module, Cooling Module, Packing Module).',
            'Process-Led HACCP Plan: Best for catering, hotels, and hospital kitchens with hundreds of recipes grouped into Process 1 (No-Cook), Process 2 (Same-Day Cook-Serve), and Process 3 (Complex Cook-Chill-Reheat).'
          ],
          keyTakeaway:
            'Match your HACCP structure (Linear, Modular, or Process-Led) to your operation so the plan stays practical and easy for staff to use.'
        },
        {
          slideNumber: 4,
          title: 'Building a Competent Multidisciplinary Team',
          subtitle: 'Selecting and Training Your Core & Specialist Members',
          bulletPoints: [
            'Appoint a trained HACCP Team Leader and a qualified Deputy Team Leader.',
            'Core Members: Quality Assurance, Production, Engineering/Maintenance, Warehouse/Supply Chain, and R&D/New Product Development.',
            'When needed, bring in external specialists (microbiologists, thermal process authorities, or packaging experts) to validate complex steps.',
            'Maintain a Competency Matrix proving every team member has completed formal HACCP training.'
          ],
          keyTakeaway:
            'Always include R&D and Engineering on your Level 04 HACCP Team so new products and machines are evaluated before launch.'
        },
        {
          slideNumber: 5,
          title: 'Building a Positive Food Safety Culture',
          subtitle: 'Codex Alimentarius 2022 Mandatory Requirement',
          bulletPoints: [
            'Food Safety Culture is the shared values, beliefs, and everyday behaviors regarding food safety across every level of the company.',
            'Key pillars of Food Safety Culture: Visible leadership walk-arounds, open two-way communication, rewarding staff who report hazards, and zero blame for honest safety stops.',
            'If workers are afraid of being punished for stopping a line when a metal detector or oven fails, they will hide problems—destroying food safety.'
          ],
          keyTakeaway:
            'Praise and support operators who speak up or stop the line when a food safety limit is breached.'
        },
        {
          slideNumber: 6,
          title: 'Managing Change Control (Management of Change — MOC)',
          subtitle: 'Preventing Hidden Hazards When Operations Change',
          bulletPoints: [
            'Many major food recalls happen because production or purchasing made a "small change" without telling the HACCP Team.',
            'Establish a formal Management of Change (MOC) Permit: No new raw material, supplier, recipe, packaging material, machine, or cleaning chemical can be introduced without a signed HACCP Team review.',
            'Update the Hazard Analysis, allergen matrix, label artwork, and operator training BEFORE the change goes live.'
          ],
          keyTakeaway:
            'Enforce a strict rule: Zero changes to ingredients, suppliers, recipes, or machines without prior HACCP Team sign-off.'
        },
        {
          slideNumber: 7,
          title: 'Overcoming Common Barriers to HACCP Success',
          subtitle: 'How a Manager Solves Real-World Floor Challenges',
          bulletPoints: [
            'Barrier: High staff turnover or language barriers → Solution: Use visual photo SOPs, color-coded gauges, and hands-on buddy coaching.',
            'Barrier: Paperwork overload ("tick-box mentality") → Solution: Simplify log sheets so operators only record essential CCPs/OPRPs and use digital probes where possible.',
            'Barrier: Frequent equipment breakdowns → Solution: Integrate CCP equipment (pasteurizers, chillers, metal detectors) into the priority Preventive Maintenance schedule.'
          ],
          keyTakeaway:
            'Keep floor paperwork simple, visual, and focused on real risks so operators take every check seriously.'
        },
        {
          slideNumber: 8,
          title: 'Chairing the Executive HACCP Management Review',
          subtitle: 'Keeping Directors Informed & Accountable',
          bulletPoints: [
            'Hold formal HACCP Management Review meetings at least quarterly or bi-annually with Top Management.',
            'Review Inputs: Audit findings, CCP deviation trends, customer complaints, lab results, recall drills, and resource needs.',
            'Review Outputs: Approved budget for equipment upgrades, staffing decisions, and next year’s measurable Food Safety Objectives.'
          ],
          keyTakeaway:
            'Management Review connects shop-floor HACCP performance directly to boardroom investment decisions.'
        }
      ]
    },
    {
      id: 'haccp4-mod-2',
      moduleNumber: 2,
      title: 'Advanced Hazard Analysis, Emerging Risks, Allergens & Risk Matrices',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on conducting a deep Level 04 Hazard Analysis: spore-forming bacteria, heat-stable toxins, mycotoxins, radiological hazards, quantitative allergen cross-contact controls, and 5×5 Risk Assessment matrices.',
      internationalClauses: [
        'Codex Principle 1 & CXC 80-2020 Allergen Management Code'
      ],
      keyPrinciples: [
        'A Level 04 Hazard Analysis differentiates between vegetative pathogens (killed by normal cooking) and bacterial spores or heat-stable toxins (which survive normal cooking).',
        'Chemical hazard analysis must include Mycotoxins (Aflatoxin B1/M1, Ochratoxin, Patulin), Histamine in fish, Acrylamide in high-temp frying/baking, and cleaning chemical residues.',
        'Use a structured 5×5 Risk Matrix (Likelihood 1–5 × Severity 1–5) to classify hazards objectively into PRPs, OPRPs, and CCPs.',
        'Allergen management requires supplier allergen declarations, segregated storage, production scheduling (allergen-free runs first), validated changeover cleaning, and label barcode verification.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Vegetative Pathogens vs. Spores & Heat-Stable Toxins',
          standardLimit: 'Cooking (75°C) kills vegetative cells; rapid cooling & cold chain (≤ 4°C) or retort (121.1°C) controls spores/toxins',
          correctiveProtocol: 'Never rely on reheating to make temperature-abused food safe, as toxins from S. aureus and B. cereus survive boiling.'
        },
        {
          parameter: 'Allergen Changeover & Label Verification Control',
          standardLimit: 'Validated wet/dry cleaning + protein swab pass + 100% packaging label check before starting allergen-free run',
          correctiveProtocol: 'Quarantine and relabel or destroy any batch packed in the wrong allergen packaging.'
        }
      ],
      practicalChecklist: [
        'Verify that your Hazard Analysis explicitly addresses spore-formers (C. botulinum, C. perfringens, B. cereus) and heat-stable toxins.',
        'Audit the Allergen Matrix across all recipes and confirm that changeover cleaning between allergen and non-allergen runs is validated with protein swabs.',
        'Confirm that packaging label verification is treated as an OPRP or CCP to prevent undeclared allergen recalls.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Vegetative Bacteria vs. Spore-Formers & Heat-Stable Toxins',
          subtitle: 'Why Cooking Alone Does Not Solve Every Biological Hazard',
          bulletPoints: [
            'Vegetative Bacteria (Salmonella, E. coli, Campylobacter, Listeria): Killed reliably when cooked to ≥ 75°C for 30 seconds.',
            'Spore-Forming Bacteria (Clostridium perfringens, Clostridium botulinum, Bacillus cereus): Form tough protective spores that SURVIVE normal cooking temperatures (75°C–100°C)!',
            'If cooked food is cooled too slowly through the Danger Zone (+60°C to +5°C), surviving spores germinate and multiply rapidly.',
            'Heat-Stable Toxins: Staphylococcus aureus enterotoxin, Bacillus cereus emetic toxin ( in rice/pasta), and Scombroid histamine (in warm tuna) CANNOT be destroyed by cooking or reheating!'
          ],
          keyTakeaway:
            'Cooking kills vegetative bacteria, but rapid cooling and strict cold-chain control are mandatory to stop spores and heat-stable toxins.'
        },
        {
          slideNumber: 2,
          title: 'Controlling Listeria monocytogenes in Chilled Ready-to-Eat (RTE) Foods',
          subtitle: 'The Pathogen That Grows Inside Refrigerators',
          bulletPoints: [
            'Unlike most bacteria, Listeria monocytogenes can slowly multiply even at refrigerator temperatures (+1°C to +4°C) and thrives in wet floor drains, hollow rollers, and slicer seals.',
            'It causes severe illness and miscarriage in pregnant women, newborns, elderly, and immunocompromised patients.',
            'Control Strategy: Positive-pressure High-Care RTE zones, captive boots, keeping high-care floors dry during production, shelf-life limits, and an Environmental Monitoring Program (swabbing Zones 1 to 4).'
          ],
          keyTakeaway:
            'Because Listeria grows in cold, wet environments, control it through strict High-Care hygiene zoning and regular environmental swabbing.'
        },
        {
          slideNumber: 3,
          title: 'Advanced Chemical Hazards: Mycotoxins, Histamine & Process Contaminants',
          subtitle: 'Invisible Chemical Risks Raw Material Specs Must Control',
          bulletPoints: [
            'Mycotoxins (Mold Toxins): Aflatoxin B1/G1 in peanuts, tree nuts, maize, and spices; Aflatoxin M1 in milk (< 0.5 ppb EU/Codex limit); Patulin in damaged apples (< 50 ppb in juice); Ochratoxin A in cereals/coffee.',
            'Mycotoxins are completely heat-stable—pasteurization or baking will NOT destroy them! They must be controlled through Supplier COA testing and dry storage.',
            'Process Contaminants: Acrylamide (formed in starchy foods fried/baked above 120°C) and Trans Fats / Polar Compounds (> 24% TPM in overused frying oil).'
          ],
          keyTakeaway:
            'Since mycotoxins survive all cooking and pasteurization steps, supplier COA screening and dry storage are your primary controls.'
        },
        {
          slideNumber: 4,
          title: 'Radiological & Heavy Metal Hazards',
          subtitle: 'Completing a Comprehensive GFSI-Compliant Hazard Analysis',
          bulletPoints: [
            'Heavy Metals: Lead, Cadmium, Mercury (in predatory fish), and Arsenic (in rice and groundwater). Controlled via annual water testing and supplier COA screening.',
            'Radiological Hazards: Radionuclides (e.g., Cesium-137, Iodine-131) in ingredients sourced from regions near historical nuclear incidents.',
            'Controlled through Country-of-Origin purchasing verification and import radiation clearance certificates.'
          ],
          keyTakeaway:
            'Include Heavy Metals and Radiological hazards in your Raw Material Hazard Analysis to satisfy FSSC 22000, BRCGS, and ISO 22000 auditors.'
        },
        {
          slideNumber: 5,
          title: 'Using the 5×5 Risk Assessment Matrix',
          subtitle: 'Scoring Likelihood (1–5) × Severity (1–5)',
          bulletPoints: [
            'In Level 04 HACCP, a 5×5 Risk Matrix gives finer precision than a basic 3×3 matrix:',
            'Likelihood (1 to 5): 1 = Almost Impossible, 2 = Unlikely, 3 = Possible, 4 = Likely, 5 = Almost Certain.',
            'Severity (1 to 5): 1 = Negligible, 2 = Minor, 3 = Moderate illness, 4 = Serious hospitalization, 5 = Fatal / Permanent disability / Anaphylaxis.',
            'Risk Score = L × S (1 to 25). Typically, a score ≥ 9 (or any Severity = 5) is classified as a Significant Hazard requiring an OPRP or CCP.'
          ],
          keyTakeaway:
            'Document clear rules for your 5×5 Risk Matrix—any hazard with Severity 5 (life-threatening) must be treated as Significant even if Likelihood is low.'
        },
        {
          slideNumber: 6,
          title: 'Distinguishing PRPs, OPRPs, and CCPs',
          subtitle: 'The 3-Tier Control Hierarchy in Modern Food Safety',
          bulletPoints: [
            'PRP (Prerequisite Program): General plant hygiene (pest control, handwashing, floor cleaning)—not tied to one specific process step.',
            'OPRP (Operational Prerequisite Program): A specific control measure for a Significant Hazard where failure does not immediately mean unsafe food, or where monitoring is visual/procedural (e.g., sieve inspection, glass register check, allergen label check).',
            'CCP (Critical Control Point): A critical step with a strict numerical Critical Limit where failure means the product is unsafe (e.g., pasteurizer temperature/flow diversion, metal detector).'
          ],
          keyTakeaway:
            'PRPs manage the environment; OPRPs manage significant operational risks; CCPs enforce absolute numerical safety limits.'
        },
        {
          slideNumber: 7,
          title: 'End-to-End Allergen Management Architecture',
          subtitle: 'Preventing the #1 Cause of Global Food Recalls',
          bulletPoints: [
            'Undeclared allergens cause nearly 50% of all Class I (life-threatening) food recalls globally.',
            'Step-by-Step Allergen Control: (1) Supplier Allergen Questionnaire, (2) Color-coded segregated warehouse racks, (3) Dedicated weighing scoops, (4) Production scheduling (run non-allergen products FIRST in the morning, allergen products LAST before deep clean), and (5) Validated allergen changeover cleaning.'
          ],
          keyTakeaway:
            'Schedule allergen-free production runs FIRST after full sanitation, and validate allergen clean-downs with rapid protein/ELISA swabs.'
        },
        {
          slideNumber: 8,
          title: 'Preventing Packaging & Label Artwork Recalls',
          subtitle: 'Making Sure the Right Product Goes Into the Right Pack',
          bulletPoints: [
            'Even if a product is 100% free of contamination, putting a product containing peanuts or milk into a wrapper that does not list peanuts or milk on the label is a life-threatening failure.',
            'Line-Clearance Rule: Before starting a new batch, remove 100% of old packaging film, cartons, and labels from the packing room.',
            'Verify barcode/label code against the Production Order and sign the Packaging Line-Clearance Log every 30–60 minutes.'
          ],
          keyTakeaway:
            'Treat Packaging Line Clearance and Label Verification as a top-priority OPRP/CCP on every packing line.'
        }
      ]
    },
    {
      id: 'haccp4-mod-3',
      moduleNumber: 3,
      title: 'Scientific Validation, Thermal Lethality & Process Capability',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on how a Level 04 Manager scientifically validates CCPs (Codex CXG 69-2008), understands D-value and z-value thermal kill concepts in plain English, maps oven/retort cold spots, and conducts shelf-life studies.',
      internationalClauses: [
        'Codex Guidelines for the Validation of Food Safety Control Measures (CXG 69-2008)'
      ],
      keyPrinciples: [
        'Validation is obtaining scientific evidence BEFORE routine production that a control measure achieves the required hazard reduction under worst-case operating conditions.',
        'In thermal processing, D-value is the time at a fixed temperature needed to kill 90% (1-log) of a target bacterium; a 6-D cook kills 99.9999% of vegetative bacteria (like Listeria or Salmonella).',
        'Equipment mapping identifies the "Cold Spot" (slowest-heating point in an oven, autoclave, or kettle) and "Warm Spot" in a chiller so monitoring probes are placed in the worst-case location.',
        'Shelf-life validation combines real-time storage testing (at target + slight abuse temperatures) across multiple batches to prove safety until the final expiry day.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Worst-Case Cold-Spot Thermal Validation (3-Batch Rule)',
          standardLimit: 'Validate across at least 3 consecutive full-scale worst-case production runs at the coldest spot',
          correctiveProtocol: 'Never validate an oven or chiller when it is half-empty—always test under maximum full load.'
        },
        {
          parameter: '6-Log (6-D) Vegetative Pathogen Reduction Benchmark',
          standardLimit: '≥ 70°C for 2 minutes or ≥ 75°C for 30 seconds at the slowest-heating thermal center',
          correctiveProtocol: 'Increase cook time or belt residence time if the thickest product center fails to reach target.'
        }
      ],
      practicalChecklist: [
        'Ensure your Validation Dossier contains 3-batch trial data under maximum load for every thermal and cooling CCP.',
        'Verify that chiller and oven temperature sensors are positioned at the mapped Warm Spot (chiller) and Cold Spot (oven).',
        'Check that every product has a signed Shelf-Life Validation Report supporting its printed expiry date.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'How to Validate a Control Measure (Codex CXG 69-2008)',
          subtitle: 'The 5-Step Validation Method for Managers',
          bulletPoints: [
            'Step A: Identify the target hazard and the required safety outcome (e.g., 6-log reduction of Salmonella in cooked poultry).',
            'Step B: Gather scientific references, regulatory standards, or equipment specs.',
            'Step C: Run a worst-case full-scale trial on your actual factory equipment across at least 3 consecutive batches.',
            'Step D: Analyze the data (temperature curves, pH, microbiological lab results) to confirm the target was met every time.',
            'Step E: Compile the signed Validation Report and archive it in the HACCP Manual.'
          ],
          keyTakeaway:
            'Always validate CCPs across at least 3 full-load worst-case production batches—never on an empty or half-full machine.'
        },
        {
          slideNumber: 2,
          title: 'Understanding D-Value & Log Reductions in Simple Terms',
          subtitle: 'How Heat Kills Bacteria Step by Step',
          bulletPoints: [
            'What is a 1-Log Reduction (D-Value)? The time at a specific temperature needed to kill 90% of a bacterial population (reducing 1,000,000 cells down to 100,000 cells).',
            'What is a 6-Log (6-D) Reduction? Killing 99.9999% of bacteria (reducing 1,000,000 cells down to just 1 cell!). This is the standard for pasteurization and cooking (e.g., 70°C for 2 mins or 75°C for 30s).',
            'What is a 12-Log (12-D) Botulinum Cook? Used in low-acid canned foods (retorting at 121.1°C for ≥ 3 minutes) to destroy heat-resistant Clostridium botulinum spores.'
          ],
          keyTakeaway:
            '1-Log kills 90%; 6-Log kills 99.9999% (standard cooking/pasteurization); 12-Log sterilizes canned low-acid foods.'
        },
        {
          slideNumber: 3,
          title: 'Finding the "Cold Spot" in Ovens, Kettles & Retorts',
          subtitle: 'Why Probe Placement Determines Food Safety',
          bulletPoints: [
            'Heat does not distribute evenly inside a large oven, steamer, or cooking kettle—one corner or the geometric center of the thickest piece heats up last.',
            'This slowest-heating location is called the "Cold Spot".',
            'During thermal validation, place multiple data-logging temperature probes throughout the oven/rack to map the exact Cold Spot.',
            'Once found, operators must always check the temperature at that Cold Spot (and inside the thickest piece of meat/product).'
          ],
          keyTakeaway:
            'If the Cold Spot reaches ≥ 75°C for 30 seconds, you know 100% of the rest of the batch is safe.'
        },
        {
          slideNumber: 4,
          title: 'Finding the "Warm Spot" in Chillers & Cold Rooms',
          subtitle: 'Mapping Refrigerators and Delivery Trucks',
          bulletPoints: [
            'In a walk-in chiller or refrigerated truck, the area right in front of the evaporator fan is the coldest, while the area near the door or ceiling corners is the warmest.',
            'If the wall thermometer sensor is placed right in front of the cold fan, it may read +2°C while food near the door is sitting at +9°C!',
            'Map your chillers to locate the "Warm Spot" (usually near the return air/door) and place your temperature monitoring sensor there.'
          ],
          keyTakeaway:
            'Place oven probes in the Cold Spot and chiller sensors in the Warm Spot for true worst-case protection.'
        },
        {
          slideNumber: 5,
          title: 'Validating Cleaning & Allergen Changeovers',
          subtitle: 'Proving Your Sanitation SOP Actually Removes Soil & Allergens',
          bulletPoints: [
            'How do you prove a cleaning procedure (SSOP) or CIP cycle works?',
            'Run 3 consecutive cleaning trials after the dirtiest/longest production run and inspect:',
            '• Visual Check: Zero visible food residue under bright light (including dismantling gaskets, blades, and dead-ends).',
            '• ATP Swab & Microbiological Swab: Confirm ATP is within pass limits and pathogen swabs (Listeria/Salmonella) are negative.',
            '• Allergen Protein / ELISA Swab: Confirm zero detectable allergen residue (< 5 ppm) after an allergen run.'
          ],
          keyTakeaway:
            'Validate cleaning and allergen changeovers across 3 consecutive runs using Visual + ATP + Microbiological + Allergen swabs.'
        },
        {
          slideNumber: 6,
          title: 'Validating Product Shelf Life Safely',
          subtitle: 'How to Set Accurate Use-By and Best-Before Dates',
          bulletPoints: [
            'Use-By Date (Safety Date): Used on chilled, high-risk perishable foods (meat, dairy, ready meals)—eating the food after this date is unsafe.',
            'Best-Before Date (Quality Date): Used on dry/ambient stable foods (biscuits, pasta, canned goods)—related to crispness, color, and flavor.',
            'How to Validate Chilled Shelf Life: Test samples at Day 0, Mid-Life, End-of-Life, and End-of-Life + 15% margin, including a slight temperature-abuse stage (e.g., +7°C to +8°C) to simulate consumer transport.'
          ],
          keyTakeaway:
            'Never guess a shelf-life date—validate it with microbiological, chemical, and sensory testing through the end of shelf life.'
        },
        {
          slideNumber: 7,
          title: 'Validating Metal Detectors & X-Ray Systems',
          subtitle: 'Testing Under Real Product Effect & Line Speed',
          bulletPoints: [
            'Wet, salty, or acidic foods (like cheese, pickles, or fresh meat) create a magnetic "Product Effect" that can make metal harder to detect.',
            'Always validate Metal Detectors by placing the test spheres (Fe, Non-Fe, SS) at the geometric center of an actual product pack moving at maximum belt speed.',
            'Also test the Fail-Safe features: What happens if the air pressure drops or the reject bin is full? The line must stop automatically!'
          ],
          keyTakeaway:
            'Always pass test pieces WITH a real product pack through the center of the detector aperture at normal belt speed.'
        },
        {
          slideNumber: 8,
          title: 'When Must You Re-Validate Your CCPs?',
          subtitle: 'Triggers for Re-Validation',
          bulletPoints: [
            'A validation is not valid forever. You must re-validate whenever:',
            '• You change product formulation (e.g., reducing salt/sugar or changing pH).',
            '• You increase pack size/thickness or change packaging material.',
            '• You speed up a conveyor oven or replace a pasteurizer/metal detector.',
            '• Repeated CCP failures or microbiological failures occur during routine verification.'
          ],
          keyTakeaway:
            'Any change to recipe, pack thickness, belt speed, or equipment requires immediate re-validation.'
        }
      ]
    },
    {
      id: 'haccp4-mod-4',
      moduleNumber: 4,
      title: 'Traceability, Crisis & Recall Management, Food Fraud (VACCP) & Food Defense (TACCP)',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on managing forward and backward traceability, conducting 4-hour Mock Recall & Mass-Balance drills, managing Crisis & Outbreak response, and implementing VACCP (Food Fraud) and TACCP (Food Defense).',
      internationalClauses: [
        'Codex Traceability & Product Recall Guidelines',
        'GFSI / ISO 22000 Food Fraud (VACCP) & Food Defense (TACCP) Requirements'
      ],
      keyPrinciples: [
        'One-Step-Back, One-Step-Forward Traceability links every raw material lot and primary packaging roll to the exact finished product batch and customer shipment.',
        'A Mock Recall & Mass-Balance exercise must trace and account for 99.5%–100% of a lot (received, used, in-stock, waste, and shipped) within ≤ 4 hours.',
        'VACCP (Vulnerability Assessment Critical Control Point) prevents economically motivated Food Fraud (adulteration, dilution, substitution, counterfeit labels).',
        'TACCP (Threat Assessment Critical Control Point) protects the facility from intentional malicious tampering or sabotage (Food Defense).'
      ],
      criticalControlParameters: [
        {
          parameter: 'Mock Recall & Mass-Balance Completion Time',
          standardLimit: '100% forward and backward lot trace with 99.5%–100% mass balance completed within ≤ 4 hours',
          correctiveProtocol: 'Test the recall system at least once a year (including an out-of-hours test) and fix any batch-logging gaps.'
        },
        {
          parameter: 'VACCP (Food Fraud) & TACCP (Food Defense) Assessments',
          standardLimit: 'Annual vulnerability assessment for raw materials (VACCP) and site security access control (TACCP)',
          correctiveProtocol: 'Lock high-risk tanks/silos, seal bulk tankers with numbered tamper-evident seals, and test fraud-prone ingredients.'
        }
      ],
      practicalChecklist: [
        'Conduct a 4-hour Mock Recall drill tracing one finished batch back to all raw material COAs and packaging lots.',
        'Verify that bulk liquid deliveries (milk, oil, water) arrive with intact numbered tamper-evident security seals matching the invoice.',
        'Confirm that external doors, water tanks, chemical stores, and High-Care areas have restricted access controls.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Forward & Backward Traceability Systems',
          subtitle: 'One Step Back, One Step Forward',
          bulletPoints: [
            'Backward Traceability (Upstream): Given a finished product batch code, identify every raw material lot, spice batch, rework batch, and food-contact packaging roll used to make it.',
            'Forward Traceability (Downstream): Given a raw material lot (e.g., a contaminated batch of milk powder), identify every finished batch it entered and every customer or distributor who received it.',
            'Every container of work-in-progress (WIP) and rework in the factory must carry a batch code label so the chain is never broken.'
          ],
          keyTakeaway:
            'Don’t forget primary food-contact packaging and rework in your traceability system—they must be batch-tracked just like raw ingredients.'
        },
        {
          slideNumber: 2,
          title: 'Conducting a 4-Hour Mock Recall & Mass Balance',
          subtitle: 'Proving Your Traceability System Works Under Time Pressure',
          bulletPoints: [
            'International standards (ISO 22000, FSSC 22000, BRCGS) require completing a full Mock Recall and Mass-Balance exercise within ≤ 4 hours at least once a year.',
            'What is a Mass Balance? Accounting for 100% of the weight/units of the chosen lot:',
            'Total Quantity Received = Quantity Used in Production + Quantity Remaining in Store + Recorded Waste/Samples.',
            'And for Finished Goods: Total Produced = Quantity Shipped to Customers + Quantity in Warehouse + QA Samples.',
            'Target reconciliation is 99.5% to 100% within 4 hours.'
          ],
          keyTakeaway:
            'Run a timed Mock Recall drill every 6 to 12 months and record the exact start and finish times.'
        },
        {
          slideNumber: 3,
          title: 'Product Withdrawal vs. Public Product Recall',
          subtitle: 'Knowing When to Escalate to Regulatory Authorities',
          bulletPoints: [
            'Trade Withdrawal: Removing a batch from distribution warehouses and retail back-rooms BEFORE it has been sold to the general public (usually for a quality defect or minor issue).',
            'Public Product Recall: Removing an unsafe product (e.g., undeclared allergen, Salmonella/Listeria, glass contamination) that has ALREADY reached consumers, including notifying the Food Authority within 24 hours and issuing public alerts.',
            'Maintain a 24/7 Crisis Management Team contact list (CEO, QA Head, Legal, Operations, and Regulator hotlines).'
          ],
          keyTakeaway:
            'If an unsafe product has left your control, notify the Crisis Team and Regulatory Authorities immediately.'
        },
        {
          slideNumber: 4,
          title: 'What is Food Fraud (VACCP)?',
          subtitle: 'Vulnerability Assessment Critical Control Points',
          bulletPoints: [
            'Food Fraud (Economically Motivated Adulteration — EMA) is the intentional substitution, dilution, or misrepresentation of food for financial gain.',
            'Common High-Risk Ingredients for Fraud: Olive oil diluted with cheap seed oil, honey diluted with sugar syrup, milk adulterated with water/urea/melamine, ground spices mixed with dyes/fillers, and fake Halal/Organic certificates.',
            'While the fraudster’s motive is money, the result can be toxic or allergenic (e.g., peanut shells added to cumin powder!).'
          ],
          keyTakeaway:
            'VACCP focuses on preventing economically motivated adulteration, dilution, substitution, and counterfeit raw materials.'
        },
        {
          slideNumber: 5,
          title: 'How to Build a Simple VACCP Plan',
          subtitle: 'Assessing Raw Material Vulnerability & Controls',
          bulletPoints: [
            'Evaluate each raw material based on: (1) Historical fraud alerts, (2) Price fluctuations/high value, (3) Physical form (powders and liquids are much easier to adulterate than whole items), and (4) Supply chain complexity (brokers vs. direct manufacturers).',
            'VACCP Controls: Buy directly from audited manufacturers, require accredited lab authenticity testing (e.g., FTIR, isotope, or DNA species testing), and perform unannounced supplier audits.'
          ],
          keyTakeaway:
            'Powders, oils, honey, spices, and minced meats have the highest fraud risk and require strict supplier and lab verification.'
        },
        {
          slideNumber: 6,
          title: 'What is Food Defense (TACCP)?',
          subtitle: 'Threat Assessment Critical Control Points',
          bulletPoints: [
            'Food Defense (TACCP) protects food from intentional malicious contamination, tampering, or sabotage by disgruntled employees, unauthorized intruders, or extremists.',
            'Unlike HACCP (accidental hazards) and VACCP (financial greed), TACCP deals with ideological or revenge-driven intent to cause harm or panic.',
            'High-risk points in a factory: Open mixing vats, outdoor water/milk storage silos, chemical stores, and unlocked delivery tankers.'
          ],
          keyTakeaway:
            'HACCP = Accidental Safety; VACCP = Economic Fraud; TACCP = Malicious Sabotage/Tampering.'
        },
        {
          slideNumber: 7,
          title: 'Practical TACCP Site Security Controls',
          subtitle: 'Hardening Your Facility Against Tampering',
          bulletPoints: [
            'Perimeter & Entry Control: Perimeter fencing, CCTV cameras, security guards, visitor sign-in badges (escorted at all times), and biometric/keycard doors for production zones.',
            'Bulk Tanker & Silo Security: All bulk milk, oil, and flour tankers must arrive with numbered Tamper-Evident Security Seals on every hatch and valve, matched against the dispatch note before unloading.',
            'Internal Controls: Keep toxic chemicals and maintenance rooms locked, and immediately revoke badge/IT access when an employee leaves the company.'
          ],
          keyTakeaway:
            'Never unload a bulk tanker whose tamper-evident security seal is broken, missing, or does not match the delivery paperwork.'
        },
        {
          slideNumber: 8,
          title: 'Business Continuity & Utility Failure Drills',
          subtitle: 'Testing Your Crisis Response Before a Real Emergency',
          bulletPoints: [
            'Test your Crisis & Business Continuity Plan annually with realistic tabletop scenarios:',
            'Scenario A: Sudden 12-hour power failure in the cold store.',
            'Scenario B: Contamination of municipal water supply.',
            'Scenario C: Cyber-attack locking the ERP traceability software (always keep a backup export or paper log capability).'
          ],
          keyTakeaway:
            'Annual Mock Recalls and Crisis Drills ensure your team acts fast and calmly during a real emergency.'
        }
      ]
    },
    {
      id: 'haccp4-mod-5',
      moduleNumber: 5,
      title: 'Auditing the HACCP System, Regulatory Compliance & Continual Improvement',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on planning and executing risk-based HACCP audits, vertical and horizontal auditing techniques, grading Minor/Major/Critical non-conformities, verifying CAPA effectiveness, and driving continual improvement.',
      internationalClauses: [
        'ISO 19011 Auditing Guidelines & Codex Principle 6/7 System Review'
      ],
      keyPrinciples: [
        'A risk-based Internal Audit Program schedules more frequent audits for high-risk CCPs, allergen lines, and areas with previous non-conformities.',
        'Auditors gather objective evidence using the Audit Triangle: (1) Observe actual floor practices, (2) Interview operators, and (3) Review documented records.',
        'Vertical Auditing traces a single production batch from raw material receiving through every CCP, lab check, cleaning log, and calibration record to dispatch.',
        'Non-conformities are graded as Minor, Major, or Critical, and are only closed after verifying that the root-cause Corrective Action prevented recurrence.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Auditor Impartiality & Independence Rule',
          standardLimit: 'Internal auditors must NEVER audit their own department or direct area of responsibility',
          correctiveProtocol: 'Cross-train QA, Production, and Engineering managers to audit each other’s departments.'
        },
        {
          parameter: 'Non-Conformity Grading & CAPA Verification',
          standardLimit: 'Critical NC = Immediate food safety risk/falsification (24–72h fix); Major NC = Systemic breakdown (14–28d CAPA)',
          correctiveProtocol: 'Re-audit the corrective action after 30 days to verify that the failure has not returned.'
        }
      ],
      practicalChecklist: [
        'Prepare a risk-based Annual Internal Audit Schedule covering all shifts, PRPs, OPRPs, and CCPs.',
        'Conduct a Vertical Traceability & CCP Audit on one batch selected at random from last month’s dispatch records.',
        'Verify that all open audit Non-Conformities have documented 5-Why Root Cause Analysis and signed verification.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Designing a Risk-Based HACCP Audit Program',
          subtitle: 'Auditing Based on Risk and Performance, Not Just a Calendar',
          bulletPoints: [
            'Do not audit every area only once a year in December.',
            'Risk-Based Scheduling: Audit High-Care RTE zones, Cooking/Pasteurization CCPs, and Allergen changeover lines quarterly or monthly, while low-risk dry packaging stores may be audited twice a year.',
            'Include unannounced internal hygiene and CCP audits across night shifts and weekends.',
            'Ensure Auditor Independence: A QA Supervisor cannot audit the QA Lab—have a trained Production Manager audit QA, and QA audit Production.'
          ],
          keyTakeaway:
            'Audit high-risk CCPs and night shifts more frequently, and ensure auditors never audit their own work.'
        },
        {
          slideNumber: 2,
          title: 'The Audit Evidence Triangle (Observe, Interview, Review)',
          subtitle: 'How Professional Auditors Gather Objective Evidence',
          bulletPoints: [
            'Never conduct an audit sitting in an office looking only at folders!',
            'Spend at least 60% of audit time on the shop floor using the 3-part Audit Triangle:',
            '• OBSERVE: Watch operators performing cooking probes, metal detector tests, and allergen clean-downs live.',
            '• INTERVIEW: Ask the operator in simple words: "What is your temperature limit here, and what do you do if it reads 68°C?"',
            '• REVIEW: Check that the written logbook matches what you just observed on the line.'
          ],
          keyTakeaway:
            'Always combine live floor observation, operator interviews, and record checks during a HACCP audit.'
        },
        {
          slideNumber: 3,
          title: 'Vertical vs. Horizontal Auditing Techniques',
          subtitle: 'The Method Used by GFSI, BRCGS & FSSC 22000 Lead Auditors',
          bulletPoints: [
            'Horizontal Audit: Checking one topic across the whole plant (e.g., checking thermometer calibration across all departments).',
            'Vertical Audit (Batch Trace Audit): Picking ONE finished product batch from 2 months ago and auditing every single record linked to that batch on that exact day:',
            '• Raw material receiving & supplier COAs → Pre-op sanitation & ATP swabs → Cooking CCP log → Cooling CCP log → Metal detector hourly checks → Operator training & thermometer calibration certificates → Final dispatch temperature.'
          ],
          keyTakeaway:
            'A Vertical Audit of a single batch tests your entire HACCP system from start to finish in 2 hours.'
        },
        {
          slideNumber: 4,
          title: 'Spotting Record Falsification ("Dry-Labbing")',
          subtitle: 'Red Flags Every HACCP Manager Must Catch',
          bulletPoints: [
            'During record verification, look closely for warning signs of fake or pre-filled logs:',
            '• "Flat-Lining": The exact same temperature (e.g., "76.0°C, 76.0°C, 76.0°C") written every hour all day long in identical handwriting.',
            '• Future Timestamps: Entries filled in for 4:00 PM when the current time on the clock is only 1:30 PM.',
            '• Missing Batches or Unrecorded Downtime: CCP checks logged during an hour when engineering logs show the oven was shut down for repair!'
          ],
          keyTakeaway:
            'Cross-checking CCP logs against engineering downtime and production output quickly reveals whether logs are genuine.'
        },
        {
          slideNumber: 5,
          title: 'Grading Audit Findings (Minor, Major & Critical)',
          subtitle: 'How Non-Conformities Are Classified',
          bulletPoints: [
            'Minor Non-Conformity: A single, isolated lapse in a procedure or record that does not directly threaten food safety (e.g., one missed signature on a cleaning log).',
            'Major Non-Conformity: A systemic breakdown, missing validation, or repeated failure to follow a requirement that could lead to a food safety failure if not corrected.',
            'Critical Non-Conformity: A direct threat to food safety (e.g., shipping product that failed a CCP without quarantine, active pest infestation in open food, or falsified CCP records).'
          ],
          keyTakeaway:
            'A Critical Non-Conformity requires immediate line stoppage, product quarantine, and urgent executive action.'
        },
        {
          slideNumber: 6,
          title: 'Writing Clear Non-Conformance Reports (NCRs)',
          subtitle: 'The 3 Parts of an Audit Finding Statement',
          bulletPoints: [
            'Every audit Non-Conformance Report should clearly state three facts:',
            'Requirement: Which HACCP clause or SOP requirement applies (e.g., "Cooking CCP-1 requires core temp ≥ 75°C checked every 30 mins").',
            'Objective Evidence: Exactly what was seen, including batch code, time, and equipment ID (e.g., "On Line 2 at 14:15, Batch #409 was dispatched with no cooking temperature recorded between 12:00 and 14:00").',
            'Statement of Non-Conformity: Why this is a risk to food safety or system compliance.'
          ],
          keyTakeaway:
            'Always record exact batch numbers, times, and equipment IDs as objective evidence in an audit report.'
        },
        {
          slideNumber: 7,
          title: 'Closing CAPAs & Verifying Effectiveness',
          subtitle: 'Making Sure Fixed Problems Stay Fixed',
          bulletPoints: [
            'Do not close an audit finding just because a manager emails a promise ("We will retrain the staff").',
            'Require objective proof of: (1) Immediate Correction, (2) 5-Why Root Cause Analysis, and (3) Systemic Corrective Action.',
            'Schedule a Follow-Up Effectiveness Check 30 days later on the floor to verify that the new control is working and the issue has not recurred.'
          ],
          keyTakeaway:
            'An audit CAPA is only truly closed when a follow-up check on the floor proves the root cause was eliminated.'
        },
        {
          slideNumber: 8,
          title: 'Continual Improvement & Course Completion',
          subtitle: 'Using Trend Analysis to Achieve World-Class Food Safety',
          bulletPoints: [
            'Track monthly trends in CCP deviations, foreign-body complaints, ATP swab pass rates, and audit scores.',
            'Use PDCA (Plan → Do → Check → Act) to upgrade manual controls to automated poka-yoke (error-proof) systems.',
            'Congratulations on completing all 5 Modules of HACCP Level 04! You are now ready to take the 40-MCQ Final Exam (60% passing score).'
          ],
          keyTakeaway:
            'Continual improvement turns your HACCP plan from a compliance document into a competitive strength.'
        }
      ]
    }
  ],
  coreExamPool: [
    {
      q: 'What is the primary role of a manager holding HACCP Level 04 compared to Level 02 or Level 03?',
      options: [
        'Designing, scientifically validating, auditing, and continually improving the entire HACCP system',
        'Only washing kitchen floors',
        'Only driving delivery vans',
        'Working without any documentation'
      ],
      correctIndex: 0,
      explanation: 'HACCP Level 04 covers the strategic design, scientific validation, auditing, and management of the entire HACCP system.'
    },
    {
      q: 'Which HACCP plan structure is most effective for a large catering or multi-recipe operation producing hundreds of dishes?',
      options: [
        'A Process-Led / Modular HACCP Plan grouping dishes by thermal process trips (No-Cook, Cook-Serve, Cook-Chill-Reheat)',
        'Writing no HACCP plan at all',
        'Using only a single verbal instruction',
        'Testing only 1 meal per year'
      ],
      correctIndex: 0,
      explanation: 'Process-Led / Modular HACCP groups dishes by common process pathways through the Temperature Danger Zone.'
    },
    {
      q: 'Why can spore-forming bacteria (such as Clostridium perfringens and Bacillus cereus) cause outbreaks in cooked foods?',
      options: [
        'Their heat-resistant spores survive normal cooking temperatures and germinate rapidly if the cooked food is cooled too slowly',
        'They only grow inside -25°C freezers',
        'They are killed at +25°C room temperature',
        'They only exist in bottled water'
      ],
      correctIndex: 0,
      explanation: 'Bacterial spores survive normal cooking; rapid blast chilling through the Danger Zone is mandatory to prevent spore germination.'
    },
    {
      q: 'How are Mycotoxins (such as Aflatoxin in nuts, spices, grains, and milk) effectively controlled in a HACCP system?',
      options: [
        'Through Supplier Approval, COA laboratory screening at receiving, and dry storage, because mycotoxins are heat-stable and are NOT destroyed by cooking or pasteurization',
        'By boiling the food for 2 minutes',
        'By freezing the food for 1 hour',
        'By wiping the packaging with alcohol'
      ],
      correctIndex: 0,
      explanation: 'Mycotoxins are completely heat-stable; they cannot be destroyed by normal cooking or pasteurization and must be prevented at sourcing and storage.'
    },
    {
      q: 'In production scheduling, what is the safest sequence to prevent allergen cross-contact?',
      options: [
        'Run Allergen-Free products FIRST after full sanitation, and schedule allergen-containing products LAST before a validated deep clean',
        'Run peanut products first and baby food immediately after without cleaning',
        'Mix all products together on the same belt',
        'Clean only once a month'
      ],
      correctIndex: 0,
      explanation: 'Running non-allergen products first and allergen products last before a validated clean-down minimizes cross-contact risk.'
    },
    {
      q: 'According to Codex Validation Guidelines (CXG 69-2008), how should a thermal Cooking or Cooling CCP be validated on factory equipment?',
      options: [
        'Across at least 3 consecutive full-scale worst-case batches with temperature probes placed at the slowest-heating Cold Spot (or Warm Spot in chillers)',
        'By running the oven completely empty for 5 minutes',
        'By asking the equipment salesman verbally',
        'Validation is not needed if the machine is new'
      ],
      correctIndex: 0,
      explanation: 'Validation requires testing at least 3 consecutive worst-case full-load production runs at the mapped Cold Spot / Warm Spot.'
    },
    {
      q: 'What does a "6-Log (6-D) Reduction" mean in thermal food processing?',
      options: [
        'A 99.9999% reduction in the target pathogen population (reducing 1,000,000 cells down to 1 cell)',
        'A 6% reduction in bacteria',
        'Heating food to 6°C',
        'Cooking for 6 hours'
      ],
      correctIndex: 0,
      explanation: 'Each 1-log reduction kills 90% of cells; a 6-log reduction kills 99.9999% of the target vegetative pathogen.'
    },
    {
      q: 'What is the target maximum time to complete a full Mock Recall and Mass-Balance exercise under international standards?',
      options: [
        'Within ≤ 4 hours (accounting for 99.5%–100% of the lot received, used, in-stock, and shipped)',
        'Within 30 days',
        'Within 6 months',
        'Traceability is only required once every 5 years'
      ],
      correctIndex: 0,
      explanation: 'International standards require completing forward/backward traceability and mass balance within 4 hours.'
    },
    {
      q: 'What is the difference between HACCP, VACCP, and TACCP?',
      options: [
        'HACCP prevents unintentional food safety hazards; VACCP prevents economically motivated Food Fraud; TACCP prevents malicious tampering/sabotage (Food Defense)',
        'They all mean dishwashing',
        'VACCP is only for accounting software',
        'TACCP is only for marketing brochures'
      ],
      correctIndex: 0,
      explanation: 'HACCP addresses unintentional safety hazards, VACCP addresses economic Food Fraud, and TACCP addresses malicious Food Defense threats.'
    },
    {
      q: 'Which technique allows an auditor to test the entire HACCP system by picking one finished batch and tracing all receiving, CCP, calibration, cleaning, and dispatch records from that day?',
      options: [
        'Vertical Auditing (Batch Trace Audit)',
        'Visual Guessing',
        'Financial Auditing',
        'External Marketing Review'
      ],
      correctIndex: 0,
      explanation: 'Vertical auditing traces a single production batch end-to-end across every operational and prerequisite record.'
    }
  ]
};

export const HACCP_3_AND_4_COURSES: InternationalTrainingCourse[] = [
  HACCP_LEVEL_03_COURSE,
  HACCP_LEVEL_04_COURSE
];

export const HACCP_3_AND_4_HUB_TRAININGS: HubTraining[] =
  HACCP_3_AND_4_COURSES.map(buildHubTrainingFromCourse);
