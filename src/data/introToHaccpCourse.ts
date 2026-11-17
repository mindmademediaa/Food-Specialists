import { InternationalTrainingCourse } from './internationalTrainingsData';
import { HACCP_LEVEL_03_VISUAL_COURSE } from './haccpDemoCourse';

/**
 * INTRODUCTION TO HACCP (CERT-2026-INTRO-HACCP)
 * Rebuilt using the exact visual interactive architecture (SVGs, PRP floor SOPs,
 * 12-Step Codex Controlled Document blueprints, interactive drills & Control Chart)
 * organized into 5 foundational modules for beginners, food handlers & QA entrants.
 */
export const INTRODUCTION_TO_HACCP_COURSE: InternationalTrainingCourse = {
  id: 'cert-2026-intro-haccp',
  code: 'HACCP-INTRO',
  title: 'Introduction to HACCP',
  levelBadge: 'Visual Interactive Foundation (05 Modules · PRPs, 12-Step Docs & Drills · 40 MCQs)',
  accreditationStandard:
    'Codex Alimentarius General Principles of Food Hygiene (CXC 1-1969) • Foundational HACCP',
  duration: '05 Visual Interactive Modules (PRP SOPs & 12-Step Docs) + 40-MCQ Final Exam',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Foundational visual interactive course introducing Hazard Analysis and Critical Control Points (HACCP) for food handlers, QA newcomers, supervisors, and food science students. Features illustrated hazard & temperature guides, step-by-step Prerequisite Programme (PRP) floor SOPs, controlled document blueprints for all 12 Codex steps, interactive decision trees, and a 40-question final exam.',
  modules: [
    // =========================================================================
    // MODULE 1: FOUNDATIONS, 4 HAZARDS & PRP PROCEDURES
    // =========================================================================
    {
      id: 'intro-haccp-mod-1',
      moduleNumber: 1,
      title: 'Module 1: HACCP Foundations, 4 Hazards & PRP Floor SOPs',
      estimatedMinutes: 40,
      overview:
        'Understand why Codex HACCP prevents hazards proactively rather than sampling finished goods, explore the 4 food safety hazard classes, master the Danger Zone Germometer, and step through live Prerequisite Programme (PRP) floor SOPs.',
      internationalClauses: [
        'Codex Alimentarius CXC 1-1969 (GHP & HACCP Foundations)',
        'ISO/TS 22002-1 Prerequisite Programmes'
      ],
      keyPrinciples: [
        'HACCP prevents foodborne illness and consumer harm by controlling hazards during processing rather than relying on end-product lab testing alone.',
        'Prerequisite Programmes (Cleaning, Pest Control, Personal Hygiene, Approved Suppliers, Maintenance & Traceability) must work reliably via documented SOPs before CCPs can succeed.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Cold & Hot Temperature Holding Limits',
          standardLimit: 'Cold storage ≤ 5°C (Target 1°C–4°C) · Hot holding ≥ 63°C · Cooking core ≥ 75°C',
          correctiveProtocol: 'Quarantine temperature-abused food held in the 5°C–63°C Danger Zone beyond 2 hours.'
        }
      ],
      practicalChecklist: [
        'Complete all pre-op cleaning, handwashing, and pest glue-board checks prior to shift start.',
        'Inspect delivery vehicle hygiene and probe incoming chilled stock at the receiving bay.'
      ],
      quickCheck: {
        question: 'In HACCP Prerequisite Programmes (PRPs), why must a facility operate clean wet/dry SSOPs, pest control, and approved supplier checks BEFORE choosing CCPs?',
        options: [
          'Strong PRPs control general environmental hazards across the site so the HACCP plan stays focused cleanly on true critical control points',
          'PRPs replace any legal need to cook poultry or run finished trays through calibrated metal detectors',
          'PRPs are optional aesthetic guidelines checked once every five years prior to building renovations',
          'Without PRPs, every food operator must test batches with sterile syringes every ten minutes'
        ],
        correctIndex: 0,
        explanation: 'Without working PRPs, hygiene gaps turn dozens of routine tasks into fake CCPs. PRPs handle plant-wide hygiene while CCPs control process lethality and final barriers.'
      },
      presentationSlides: [
        HACCP_LEVEL_03_VISUAL_COURSE.modules[0].presentationSlides![1],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[1].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[1].presentationSlides![1],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[1].presentationSlides![2],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[2].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[2].presentationSlides![1],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[2].presentationSlides![2]
      ].map((sl, idx) => ({ ...sl, slideNumber: idx + 1 }))
    },

    // =========================================================================
    // MODULE 2: THE 5 PRELIMINARY STEPS WITH CONTROLLED DOCUMENTS (STEPS 1–5)
    // =========================================================================
    {
      id: 'intro-haccp-mod-2',
      moduleNumber: 2,
      title: 'Module 2: Codex Preliminary Steps 1–5 & Document Blueprints',
      estimatedMinutes: 35,
      overview:
        'See exact sample controlled documents used for all 5 Codex Preliminary Steps: Assemble HACCP Team (DOC-01), Product Profile (DOC-02), Intended Use & YOPI Risk (DOC-03), Multi-Stream Flow Diagram (DOC-04), and On-Site Verification Log (DOC-05).',
      internationalClauses: [
        'Codex Alimentarius Steps 1 to 5',
        'On-Site Flow Chart Verification Standards'
      ],
      keyPrinciples: [
        'The complete Codex sequence combines 5 Preliminary Preparation Steps (Steps 1–5) plus 7 Core Principles (Steps 6–12).',
        'Every Preliminary Step generates controlled documented evidence — never skip Step 5 floor verification across day and night shifts.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Step 5 Process Flow Verification',
          standardLimit: '100% live shift walk-through dated and signed before Principle 1 begins',
          correctiveProtocol: 'Revise Flow Diagram DOC-04 immediately whenever unmapped holding loops, water inputs, or rework paths appear.'
        }
      ],
      practicalChecklist: [
        'Include QA, Production, Engineering, and Hygiene inside the Step 1 HACCP Team Charter.',
        'Capture pH, Water Activity (Aw), declared allergens, and YOPI consumer risks inside Product Sheets.'
      ],
      quickCheck: {
        question: 'Why does Codex Step 3 ("Identify Intended Use") pay special attention to hospital patients, elderly residents, infants, and pregnant women?',
        options: [
          'Vulnerable (YOPI) consumers face severe or fatal illness from lower pathogen doses, requiring stricter microbiological & shelf-life controls',
          'Hospitalised patients require zero allergen labelling on prepared retail sandwiches',
          'Elderly care menus are exempt from calibrated thermometer cooking checks',
          'Intended Use documents are used solely to set supermarket retail discounts'
        ],
        correctIndex: 0,
        explanation: 'Ready-to-eat products supplied to immunocompromised or elderly consumers demand stringent pathogen limits and conservative shelf-life.'
      },
      presentationSlides: [
        HACCP_LEVEL_03_VISUAL_COURSE.modules[4].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[4].presentationSlides![1],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[4].presentationSlides![2],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[5].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[5].presentationSlides![1]
      ].map((sl, idx) => ({ ...sl, slideNumber: idx + 1 }))
    },

    // =========================================================================
    // MODULE 3: PRINCIPLES 1, 2 & 3 (STEPS 6–8 DOCUMENTS & INTERACTIVE DRILLS)
    // =========================================================================
    {
      id: 'intro-haccp-mod-3',
      moduleNumber: 3,
      title: 'Module 3: Hazard Analysis, CCP Decision Tree & Critical Limits (P1–P3)',
      estimatedMinutes: 45,
      overview:
        'Execute Codex Principles 1, 2, and 3 using the Interactive 3×3 Risk Matrix, Targeted Control Table, Interactive Codex 4-Question CCP Decision Tree, and sample Controlled Documents (DOC-06, DOC-07, DOC-08).',
      internationalClauses: [
        'Codex Principles 1, 2 & 3 (Steps 6–8)',
        'Codex CCP Decision Tree Logic'
      ],
      keyPrinciples: [
        'Risk = Likelihood × Severity; significant hazards proceed to targeted preventative controls and CCP Decision Tree evaluation.',
        'Critical Limits are strictly objective numeric limits separating safe from unsafe food, buffered inside by proactive Target Levels.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Measurable Critical Limits',
          standardLimit: '≥ 75°C poultry core · ≤ 5°C cold store · ≥ 63°C hot hold · 2.0mm Fe / 2.5mm SS detector reject',
          correctiveProtocol: 'Replace all subjective SOP descriptions ("looks brown") with calibrated measurable values.'
        }
      ],
      practicalChecklist: [
        'Test every significant hazard-step pair step-by-step through Codex Questions 1–4.',
        'Maintain stricter internal Target Levels so operators catch drift before breaching legal limits.'
      ],
      quickCheck: {
        question: 'Which statement correctly distinguishes a Target Level from a Critical Limit under Codex Principle 3?',
        options: [
          'A Critical Limit marks the legal boundary between safe and unsafe food, whereas a Target Level is tighter to warn operators before breach',
          'A Target Level is legally binding in court while Critical Limits are optional culinary hints',
          'Target Levels apply solely to dry ambient storage boxes and never chillers or ovens',
          'Critical Limits can remain subjective descriptions like "cook until edges turn golden"'
        ],
        correctIndex: 0,
        explanation: 'Managing operations around tighter Target Levels (e.g., 1°C–3°C chiller aim vs ≤ 5°C Critical Limit) prevents unsafe batches before deviation occurs.'
      },
      presentationSlides: [
        HACCP_LEVEL_03_VISUAL_COURSE.modules[6].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[7].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[8].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[8].presentationSlides![1],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[9].presentationSlides![0]
      ].map((sl, idx) => ({ ...sl, slideNumber: idx + 1 }))
    },

    // =========================================================================
    // MODULE 4: PRINCIPLES 4 & 5 (MONITORING, CALIBRATION & CORRECTIVE CAPA)
    // =========================================================================
    {
      id: 'intro-haccp-mod-4',
      moduleNumber: 4,
      title: 'Module 4: Monitoring, Probe Calibration & Corrective Actions (P4–P5)',
      estimatedMinutes: 35,
      overview:
        'Design live CCP monitoring logs (Form DOC-09), verify digital thermometers in crushed ice-slurry (0°C) and boiling water (100°C), and execute two-part Containment + Root Cause CAPA workflows (Form DOC-10).',
      internationalClauses: [
        'Codex Principles 4 & 5 (Steps 9–10)',
        'Calibration & Non-Conforming Product Control'
      ],
      keyPrinciples: [
        'Effective monitoring defines What, How, Where, Frequency, and Responsible Role using calibrated instruments.',
        'Every Corrective Action combines immediate product quarantine/disposition plus 5-Why root-cause elimination.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Probe Calibration & Periodic Quarantine',
          standardLimit: '0.0°C ± 0.5°C ice slurry · 100.0°C ± 0.5°C boiling · Hold all stock back to last good check',
          correctiveProtocol: 'Tag drifted probes out of service and isolate every batch made since the last passed monitoring reading.'
        }
      ],
      practicalChecklist: [
        'Verify sanitising wipes are stored next to every handheld digital probe on the floor.',
        'Ensure physical Red Hold Tags and quarantine cages remain under QA control.'
      ],
      quickCheck: {
        question: 'When calibrating a kitchen food thermometer in boiling potable water at sea level, what reading range verifies probe accuracy?',
        options: [
          '85.0°C to 88.0°C',
          '99.5°C to 100.5°C',
          '105.0°C to 112.0°C',
          '74.0°C to 75.5°C'
        ],
        correctIndex: 1,
        explanation: 'Pure boiling water at standard atmospheric pressure reads 100.0°C; food thermometers verify within ±0.5°C (99.5°C–100.5°C).'
      },
      presentationSlides: [
        HACCP_LEVEL_03_VISUAL_COURSE.modules[10].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[11].presentationSlides![0]
      ].map((sl, idx) => ({ ...sl, slideNumber: idx + 1 }))
    },

    // =========================================================================
    // MODULE 5: PRINCIPLES 6 & 7, LEGAL VALUE, CONTROL CHART & EXAM REVISION
    // =========================================================================
    {
      id: 'intro-haccp-mod-5',
      moduleNumber: 5,
      title: 'Module 5: Verification, Records, Master Control Chart & Exam Prep (P6–P7)',
      estimatedMinutes: 40,
      overview:
        'Connect Statutory Due Diligence, Principle 6 Verification Master Plans (DOC-11), Principle 7 Document Control Registers (DOC-12), the Master End-to-End HACCP Control Chart, and Interactive Definition Revision prior to the final exam.',
      internationalClauses: [
        'Codex Principles 6 & 7 (Steps 11–12)',
        'Due Diligence & Vertical Trace Auditing'
      ],
      keyPrinciples: [
        'Validation confirms scientifically upfront that controls work; Verification proves ongoingly through independent audits, calibration, and lab swabs that the plan works.',
        'Documents specify rules with version numbers; permanent-ink signed Records establish legal Due Diligence protection.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Master Record Retention & Audit Review',
          standardLimit: 'Retain CCP & CAPA records minimum Shelf-Life + 1 Year; review HACCP system annually or on any change',
          correctiveProtocol: 'Strike errors cleanly with single line + initials (never white-out) and purge obsolete blank forms.'
        }
      ],
      practicalChecklist: [
        'Test yourself across all 9 Codex definitions in the Interactive Revision Table.',
        'Proceed directly to the 40-MCQ Final Exam upon completing all 5 foundational modules.'
      ],
      quickCheck: {
        question: 'During an internal Vertical Batch Trace Audit, how does the auditor test the food safety system?',
        options: [
          'By auditing only external marketing billboard posters across the city',
          'By selecting one dispatched batch lot and tracing intake specs, CCP monitor sheets, calibrations, sanitation swabs & training records from that production run',
          'By interviewing temporary cleaners solely about next month’s holiday calendar',
          'By checking factory electricity utility invoices for three consecutive winters'
        ],
        correctIndex: 1,
        explanation: 'Vertical auditing connects every prerequisite and CCP record tied to a single live batch end-to-end.'
      },
      presentationSlides: [
        HACCP_LEVEL_03_VISUAL_COURSE.modules[3].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[12].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[13].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[14].presentationSlides![0],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[14].presentationSlides![1],
        HACCP_LEVEL_03_VISUAL_COURSE.modules[14].presentationSlides![2]
      ].map((sl, idx) => ({ ...sl, slideNumber: idx + 1 }))
    }
  ],

  // Clean 40-MCQ Exam Pool shared cleanly without trivial/irrelevant distractors
  coreExamPool: HACCP_LEVEL_03_VISUAL_COURSE.coreExamPool
};
