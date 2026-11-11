import { HubTraining } from '../types/hub';
import { InternationalTrainingCourse } from './internationalTrainingsData';
import { buildHubTrainingFromCourse } from './coursesHaccp3And4';

// ============================================================================
// 5. ISO 9001 AWARENESS CERTIFICATE (QUALITY MANAGEMENT SYSTEM — QMS)
// ============================================================================
export const ISO_9001_AWARENESS_COURSE: InternationalTrainingCourse = {
  id: 'cert-2026-iso-9001-awareness',
  code: 'ISO-9001-AW',
  title: 'ISO 9001 Awareness Certificate',
  levelBadge: 'Simple Presentation Course (05 Modules · 35 Slides · 40 MCQs · 60% Pass)',
  accreditationStandard:
    'ISO 9001:2015 Quality Management Systems (QMS) • Awareness Presentation Course',
  duration: '05 Presentation Modules (35 Slides) + 40-MCQ Final Exam',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Clear, easy-to-follow Slide Presentation Course on ISO 9001:2015 Quality Management Systems (QMS). Covers the 7 Quality Management Principles, Annex SL High-Level Structure (Clauses 4 to 10), Process Approach & PDCA Cycle, Risk-Based Thinking, Documented Information, Operational Quality Controls, Internal Auditing, and Continual Improvement.',
  modules: [
    {
      id: 'iso9001-mod-1',
      moduleNumber: 1,
      title: 'Introduction to ISO 9001, Quality Principles & PDCA Cycle',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on what ISO 9001:2015 is, why companies implement a Quality Management System (QMS), the 7 Quality Management Principles, the Process Approach, and the Plan-Do-Check-Act (PDCA) cycle.',
      internationalClauses: [
        'ISO 9001:2015 Clauses 0.1 to 0.3 & ISO 9000 Seven Quality Principles'
      ],
      keyPrinciples: [
        'ISO 9001:2015 is the world’s most recognized standard for a Quality Management System (QMS), ensuring an organization consistently delivers products and services that meet customer and regulatory requirements.',
        'The 7 Quality Management Principles are: Customer Focus, Leadership, Engagement of People, Process Approach, Improvement, Evidence-Based Decision Making, and Relationship Management.',
        'The Process Approach manages activities as interconnected processes (Inputs → Process Activities → Outputs) rather than isolated silos.',
        'Every clause of ISO 9001 follows Deming’s PDCA Cycle: Plan (Clauses 4, 5, 6) → Do (Clauses 7, 8) → Check (Clause 9) → Act (Clause 10).'
      ],
      criticalControlParameters: [
        {
          parameter: '7 Quality Management Principles (ISO 9000 / 9001)',
          standardLimit: 'Customer Focus, Leadership, Engagement of People, Process Approach, Improvement, Evidence-Based Decisions, Relationship Management',
          correctiveProtocol: 'Align all departmental quality KPIs and SOPs with these 7 core principles.'
        },
        {
          parameter: 'Annex SL High-Level Structure (Clauses 4 to 10)',
          standardLimit: 'Plan (Clauses 4, 5, 6) → Do (Clauses 7, 8) → Check (Clause 9) → Act (Clause 10)',
          correctiveProtocol: 'Use the unified Annex SL structure to integrate ISO 9001 seamlessly with ISO 22000, ISO 14001, and ISO 45001.'
        }
      ],
      practicalChecklist: [
        'Understand the 7 Quality Management Principles and how they apply to your job.',
        'Map your department’s core processes showing Inputs, Process Steps, Controls, and Outputs.',
        'Identify which clauses belong to Plan, Do, Check, and Act.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'What is ISO 9001:2015?',
          subtitle: 'The Global Benchmark for Quality Management Systems (QMS)',
          bulletPoints: [
            'ISO stands for the International Organization for Standardization, based in Geneva, Switzerland.',
            'ISO 9001:2015 is the international standard that specifies requirements for a Quality Management System (QMS).',
            'It applies to ANY organization—food manufacturing, hospitals, laboratories, packaging plants, logistics, or software companies.',
            'Note: ISO 9001 certifies the Management System processes, NOT the product itself—ensuring consistent quality "Right First Time" every day.'
          ],
          keyTakeaway:
            'ISO 9001:2015 helps organizations consistently meet customer and legal requirements while continually improving satisfaction.'
        },
        {
          slideNumber: 2,
          title: 'Why Do Organizations Implement ISO 9001?',
          subtitle: 'Key Benefits for Customers, Staff & Business',
          bulletPoints: [
            'Consistent Quality: Standardized SOPs ensure products and services meet exact specifications on every shift.',
            'Fewer Mistakes & Less Waste: Catching risks early reduces rework, scrap, customer complaints, and financial loss.',
            'Customer Confidence & Market Access: Many multinational clients, retailers, and government tenders require suppliers to hold ISO 9001 certification.',
            'Clear Roles & Accountability: Every employee knows their responsibilities, SOPs, and quality targets.'
          ],
          keyTakeaway:
            'A working QMS reduces costly rework and builds long-term customer trust.'
        },
        {
          slideNumber: 3,
          title: 'The 7 Quality Management Principles (Part 1)',
          subtitle: 'Customer Focus, Leadership, Engagement & Process Approach',
          bulletPoints: [
            'Customer Focus: The primary focus of quality management is to meet customer requirements and strive to exceed customer expectations.',
            'Leadership: Leaders at all levels establish unity of purpose and direction and create conditions in which people are engaged in achieving quality objectives.',
            'Engagement of People: Competent, empowered, and engaged people at all levels throughout the organization are essential to enhance its capability to create and deliver value.',
            'Process Approach: Consistent and predictable results are achieved more effectively when activities are understood and managed as interrelated processes.'
          ],
          keyTakeaway:
            'Customer Focus is Principle #1 of ISO 9001—every process exists to deliver value to the customer.'
        },
        {
          slideNumber: 4,
          title: 'The 7 Quality Management Principles (Part 2)',
          subtitle: 'Improvement, Evidence-Based Decisions & Relationship Management',
          bulletPoints: [
            'Improvement: Successful organizations have an ongoing focus on continual improvement.',
            'Evidence-Based Decision Making: Decisions based on the analysis and evaluation of real data and information (KPIs, audit findings, lab trends) are more likely to produce desired results.',
            'Relationship Management: For sustained success, an organization manages its relationships with interested parties, such as suppliers, partners, and contractors.'
          ],
          keyTakeaway:
            'Never make quality decisions based on guesswork—use real data and facts (Evidence-Based Decision Making).'
        },
        {
          slideNumber: 5,
          title: 'Understanding the Process Approach (SIPOC)',
          subtitle: 'Suppliers → Inputs → Process → Outputs → Customers',
          bulletPoints: [
            'Every activity in a business is a Process that transforms Inputs into Outputs:',
            '• Suppliers provide Inputs (raw materials, information, customer orders).',
            '• The Process applies controlled activities, machines, and trained staff.',
            '• The Output (finished product or service) is delivered to the internal or external Customer.',
            'Monitor KPIs at each process interface so defects are never passed to the next department.'
          ],
          keyTakeaway:
            'Treat the next department on the line as your "Internal Customer" and never pass a defective item forward.'
        },
        {
          slideNumber: 6,
          title: 'The PDCA Cycle & Annex SL Structure (Clauses 4 to 10)',
          subtitle: 'How ISO 9001 Is Organized',
          bulletPoints: [
            'Clauses 1, 2, and 3 cover Scope, Normative References, and Terms/Definitions.',
            'The auditable requirements sit in Clauses 4 to 10 following the PDCA Cycle:',
            '• PLAN: Clause 4 (Context of the Organization), Clause 5 (Leadership), Clause 6 (Planning & Risks).',
            '• DO: Clause 7 (Support, Resources, Competence & Documents), Clause 8 (Operation).',
            '• CHECK: Clause 9 (Performance Evaluation, Internal Audit & Management Review).',
            '• ACT: Clause 10 (Improvement, Nonconformity & Corrective Action).'
          ],
          keyTakeaway:
            'All modern ISO standards (9001, 22000, 14001, 45001) share this exact same Clauses 4–10 Annex SL structure!'
        },
        {
          slideNumber: 7,
          title: 'What is "Risk-Based Thinking" in ISO 9001:2015?',
          subtitle: 'Preventing Problems Before They Happen',
          bulletPoints: [
            'ISO 9001:2015 replaced the old separate "Preventive Action" procedure with Risk-Based Thinking built into the entire system.',
            'Risk is the "effect of uncertainty"—it can be negative (a threat/failure) or positive (an opportunity for improvement).',
            'Every department identifies what could go wrong in its process and puts preventive controls in place upfront.'
          ],
          keyTakeaway:
            'Risk-Based Thinking makes quality management proactive rather than waiting for things to break.'
        }
      ]
    },
    {
      id: 'iso9001-mod-2',
      moduleNumber: 2,
      title: 'Clauses 4, 5 & 6: Context, Leadership, Quality Policy & Planning',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on Clause 4 (Internal/External Issues, Interested Parties, QMS Scope), Clause 5 (Leadership Commitment, Quality Policy, Roles), and Clause 6 (Addressing Risks & Opportunities, SMART Quality Objectives).',
      internationalClauses: [
        'ISO 9001:2015 Clauses 4, 5, and 6 (The PLAN Phase)'
      ],
      keyPrinciples: [
        'Clause 4 requires understanding internal and external issues (e.g., SWOT/PESTLE), identifying the needs of Interested Parties (customers, regulators, owners, staff, suppliers), and defining the QMS Scope.',
        'Clause 5 requires Top Management to demonstrate active leadership, establish a customer-focused Quality Policy, and assign clear organizational roles and authorities.',
        'Clause 6 requires planning actions to address Risks and Opportunities,设置 measurable SMART Quality Objectives at relevant functions/levels, and planning changes systematically.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Quality Policy Requirements (Clause 5.2)',
          standardLimit: 'Appropriate to company purpose, commits to meeting requirements & continual improvement, communicated & understood by staff',
          correctiveProtocol: 'Train employees to explain how the Quality Policy relates to their daily work rather than just memorizing words.'
        },
        {
          parameter: 'SMART Quality Objectives (Clause 6.2)',
          standardLimit: 'Specific, Measurable, Achievable, Relevant, and Time-bound targets with an action plan (What, Resources, Who, When, How evaluated)',
          correctiveProtocol: 'Review Quality Objective progress monthly and initiate corrective action if any target falls behind.'
        }
      ],
      practicalChecklist: [
        'Verify that your organization has a documented Context & Interested Parties Matrix (Clause 4.1 & 4.2).',
        'Check that the signed Quality Policy is displayed and understood by staff across all departments.',
        'Confirm that each department has measurable SMART Quality Objectives tracked monthly.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Clause 4.1 & 4.2: Context of the Organization & Interested Parties',
          subtitle: 'Knowing Your Business Environment & Stakeholders',
          bulletPoints: [
            'Clause 4.1 (Internal & External Issues): Identify factors that affect your ability to achieve quality results—External (regulations, market competition, raw material inflation, technology) and Internal (company culture, equipment age, staff skills).',
            'Simple Tool: Most companies use a SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats) to document Clause 4.1.',
            'Clause 4.2 (Interested Parties): List all stakeholders who care about your quality—Customers, Regulatory Authorities, Shareholders, Employees, Suppliers, and Local Community—and write down what they expect from you.'
          ],
          keyTakeaway:
            'Understanding internal/external issues and stakeholder expectations ensures your QMS addresses real-world business needs.'
        },
        {
          slideNumber: 2,
          title: 'Clause 4.3 & 4.4: Defining the QMS Scope & Processes',
          subtitle: 'Setting the Boundaries of Your Quality System',
          bulletPoints: [
            'Clause 4.3 (QMS Scope): Clearly write down which physical site locations, products, and services are covered by your ISO 9001 certificate.',
            'Can any clause of ISO 9001 be excluded? A clause (such as Clause 8.3 Design and Development) can ONLY be declared "Not Applicable" if your company genuinely does not perform product design and excluding it does not affect product conformity.',
            'Clause 4.4: Establish, implement, maintain, and continually improve the QMS processes and their interactions.'
          ],
          keyTakeaway:
            'Any exclusion from the QMS Scope (like Clause 8.3 Design) must be justified in writing.'
        },
        {
          slideNumber: 3,
          title: 'Clause 5.1: Leadership and Commitment',
          subtitle: 'Top Management Can No Longer Delegate All Quality Duties',
          bulletPoints: [
            'In ISO 9001:2015, Top Management (CEO / Managing Director / General Manager) is directly accountable for the effectiveness of the QMS.',
            'Leadership must ensure that the Quality Policy and Quality Objectives match the company’s strategic direction.',
            'They must provide necessary resources (staff, equipment, training), promote the Process Approach and Risk-Based Thinking, and actively lead Management Review.'
          ],
          keyTakeaway:
            'Auditors interview Top Management directly to verify their active involvement in Clause 5.'
        },
        {
          slideNumber: 4,
          title: 'Clause 5.2 & 5.3: Quality Policy, Roles & Authorities',
          subtitle: 'Setting the Company’s Quality Compass',
          bulletPoints: [
            'The Quality Policy (Clause 5.2) must include:',
            '• A commitment to satisfy applicable customer, statutory, and regulatory requirements.',
            '• A commitment to continual improvement of the QMS.',
            '• A framework for setting measurable Quality Objectives.',
            'How should staff understand the Quality Policy? Employees do not need to recite it word-for-word, but they must know what it means for their daily job! (Clause 5.3 defines organization charts and job descriptions).'
          ],
          keyTakeaway:
            'Every employee should know how their daily work contributes to the company’s Quality Policy.'
        },
        {
          slideNumber: 5,
          title: 'Clause 6.1: Actions to Address Risks and Opportunities',
          subtitle: 'Maintaining a Department Risk Register',
          bulletPoints: [
            'Each department evaluates risks (what could cause non-conforming product, late delivery, or customer dissatisfaction) and opportunities (new automation, training, waste reduction).',
            'Options to address a Risk: Avoid the risk, Eliminate the risk source, Reduce likelihood or severity (install controls), Share the risk (insurance/supplier contract), or Accept minor informed risk.',
            'Evaluate the effectiveness of your risk controls during internal audits and management reviews.'
          ],
          keyTakeaway:
            'Keep a practical Risk & Opportunity Register for each process and review it whenever processes change.'
        },
        {
          slideNumber: 6,
          title: 'Clause 6.2 & 6.3: SMART Quality Objectives & Planning of Changes',
          subtitle: 'Turning Quality Policy Into Measurable Targets',
          bulletPoints: [
            'Quality Objectives (Clause 6.2) must be SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.',
            'Examples: "Achieve ≥ 98.5% On-Time In-Full (OTIF) customer delivery in 2026" or "Reduce customer quality complaints by 25% by Q4 2026."',
            'Each objective needs a written plan: What will be done, What resources are required, Who is responsible, When it will be completed, and How results will be evaluated.',
            'Clause 6.3 requires planning any QMS changes systematically so quality is never disrupted.'
          ],
          keyTakeaway:
            'Vague goals like "improve quality" fail ISO 9001 audits—Quality Objectives must have measurable numbers and deadlines.'
        }
      ]
    },
    {
      id: 'iso9001-mod-3',
      moduleNumber: 3,
      title: 'Clause 7: Support — Resources, Calibration, Competence & Documented Information',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on Clause 7 requirements: people, infrastructure, work environment, calibration of measuring equipment (Clause 7.1.5), staff competence and awareness (7.2–7.3), communication (7.4), and control of Documented Information (7.5).',
      internationalClauses: [
        'ISO 9001:2015 Clause 7 (Support & Resource Management)'
      ],
      keyPrinciples: [
        'Clause 7.1 covers providing adequate personnel, maintained infrastructure (buildings, machinery, IT), a suitable work environment, and calibrated measuring instruments.',
        'Clause 7.1.5 requires all measuring equipment affecting product quality (scales, thermometers, pH meters, gauges) to be calibrated at specified intervals against international/national traceable standards.',
        'Clause 7.2 & 7.3 require defining competence requirements for every role, providing training, evaluating training effectiveness, and ensuring staff awareness.',
        'Clause 7.5 (Documented Information) governs creating, approving, updating, controlling versions, and retaining procedures ("Maintain") and records ("Retain").'
      ],
      criticalControlParameters: [
        {
          parameter: 'Calibration Traceability & Out-of-Calibration Action (Clause 7.1.5)',
          standardLimit: 'All quality-critical instruments calibrated to national/ISO 17025 standards, labeled with status, and protected from damage',
          correctiveProtocol: 'If an instrument is found out of calibration, assess the validity of all previous measurements taken with it and quarantine affected stock.'
        },
        {
          parameter: 'Control of Documented Information (Clause 7.5)',
          standardLimit: 'Current approved version available at point of use; obsolete versions removed; records legible and retained per schedule',
          correctiveProtocol: 'Withdraw any uncontrolled or outdated SOP/form found on the shop floor immediately.'
        }
      ],
      practicalChecklist: [
        'Check the Master Calibration Register and verify that every scale, thermometer, and gauge has a valid calibration sticker.',
        'Review the Staff Competence & Training Matrix to confirm training effectiveness is evaluated.',
        'Verify that all SOPs and forms on the floor show the current controlled revision number.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Clause 7.1.1 to 7.1.4: People, Infrastructure & Work Environment',
          subtitle: 'Providing the Right Tools and Conditions for Quality Work',
          bulletPoints: [
            'People (7.1.2): Provide enough qualified staff so workloads do not cause quality errors.',
            'Infrastructure (7.1.3): Maintain buildings, production machinery, utilities, transport vehicles, and IT software through a Preventive Maintenance schedule.',
            'Environment for the Operation of Processes (7.1.4): Maintain suitable physical conditions (temperature, humidity, lighting, cleanliness, noise control) and social/psychological conditions (safe, respectful workplace).'
          ],
          keyTakeaway:
            'Well-maintained machines and a clean, well-lit work environment are essential prerequisites for quality.'
        },
        {
          slideNumber: 2,
          title: 'Clause 7.1.5: Monitoring and Measuring Resources (Calibration)',
          subtitle: 'How Do You Know Your Scales and Gauges Are Accurate?',
          bulletPoints: [
            'Any instrument used to verify product conformity (weighing scales, thermometers, pressure gauges, pH meters, refractometers, micrometers) MUST be calibrated.',
            'Calibration Rules under Clause 7.1.5:',
            '• Calibrate at specified intervals against measurement standards traceable to international or national standards.',
            '• Identify each instrument with a unique ID and Calibration Status Sticker (Calibrated Date + Due Date).',
            '• Safeguard instruments from unauthorized adjustment, dropping, or corrosion.',
            'Crucial Rule: If an instrument is found out of calibration during a check, you MUST assess the validity of previous batch measurements and take action on any affected product!'
          ],
          keyTakeaway:
            'Finding a scale or thermometer out of calibration requires checking whether recent batches measured with it are still within specification!'
        },
        {
          slideNumber: 3,
          title: 'Clause 7.1.6 & 7.2: Organizational Knowledge & Competence',
          subtitle: 'Building and Retaining Skilled Teams',
          bulletPoints: [
            'Organizational Knowledge (7.1.6): Capture lessons learned, technical know-how, and best practices in SOPs so valuable knowledge is not lost when a senior employee retires or leaves.',
            'Competence (7.2): Determine required education, training, or experience for each role → Provide training/mentoring to close any skill gaps → Evaluate the EFFECTIVENESS of the training (via test, observation, or audit) → Retain documented records (certificates, training matrix).'
          ],
          keyTakeaway:
            'Attendance on a training sheet is not enough—Clause 7.2 requires evaluating whether the training actually made the employee competent.'
        },
        {
          slideNumber: 4,
          title: 'Clause 7.3 & 7.4: Awareness and Communication',
          subtitle: 'What Every Employee Must Know During an Audit Interview',
          bulletPoints: [
            'Under Clause 7.3, every person working under the organization’s control must be aware of 4 things:',
            '• The Quality Policy.',
            '• Relevant Quality Objectives for their department.',
            '• Their contribution to QMS effectiveness (benefits of improved performance).',
            '• The implications of NOT conforming with QMS requirements (risks of defects, complaints, or recalls).',
            'Clause 7.4 defines Internal and External Communication (what, when, with whom, how, and who communicates).'
          ],
          keyTakeaway:
            'Make sure every operator can answer the 4 Awareness questions in simple language before an ISO 9001 audit.'
        },
        {
          slideNumber: 5,
          title: 'Clause 7.5: Documented Information ("Maintain" vs. "Retain")',
          subtitle: 'Controlling Procedures and Records',
          bulletPoints: [
            'ISO 9001 uses the term "Documented Information" for both documents and records:',
            '• "Maintain Documented Information" = Written Documents / SOPs / Manuals / Work Instructions that guide how to work (subject to version updates).',
            '• "Retain Documented Information" = Completed Records / Logs / Test Reports / Checklists that provide evidence of results achieved (cannot be altered once signed).',
            'Document Control Rules: Approve documents before issue, ensure the current version is at the workstation, remove obsolete versions, and back up electronic records.'
          ],
          keyTakeaway:
            '"Maintain" means SOPs and Procedures; "Retain" means Records and Logs.'
        }
      ]
    },
    {
      id: 'iso9001-mod-4',
      moduleNumber: 4,
      title: 'Clause 8: Operation — Customer Orders, Design, Purchasing, Production & Nonconforming Outputs',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on Clause 8 (The DO Phase): reviewing customer orders (8.2), design and development (8.3), controlling external suppliers (8.4), production and service controls (8.5), product release (8.6), and controlling nonconforming outputs (8.7).',
      internationalClauses: [
        'ISO 9001:2015 Clause 8 (Operational Planning and Control)'
      ],
      keyPrinciples: [
        'Clause 8.2 requires reviewing customer requirements (product specs, delivery dates, statutory rules) BEFORE committing to supply.',
        'Clause 8.4 requires evaluating, selecting, monitoring, and re-evaluating external suppliers, contractors, and outsourced processes.',
        'Clause 8.5 & 8.6 govern controlled production conditions, identification and traceability, preserving product quality during storage/handling, and formal QC inspection release.',
        'Clause 8.7 requires identifying and segregating Nonconforming Outputs (defective items) so they cannot be used or delivered unintentionally.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Customer Order Review Before Acceptance (Clause 8.2.3)',
          standardLimit: '100% review of product specs, quantity, delivery lead time, and legal requirements before confirming order',
          correctiveProtocol: 'Resolve any contract discrepancy with the customer in writing before starting production.'
        },
        {
          parameter: 'Control of Nonconforming Outputs (Clause 8.7)',
          standardLimit: 'Immediate physical segregation/hold tagging of defective items + documented disposition (Rework, Scrap, Concession)',
          correctiveProtocol: 'Re-inspect 100% of any reworked batch against original specifications before release.'
        }
      ],
      practicalChecklist: [
        'Check that Sales/Customer Service reviews and signs off customer specifications before accepting orders.',
        'Verify the Approved Supplier List and annual supplier evaluation scores (Clause 8.4).',
        'Inspect the Quarantine / Nonconforming Product Hold area to confirm all rejected items are tagged and logged (Clause 8.7).'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Clause 8.1 & 8.2: Operational Planning & Customer Requirements',
          subtitle: 'Never Promise What the Factory Cannot Deliver',
          bulletPoints: [
            'Clause 8.1: Plan and control production processes by setting clear product acceptance criteria (specifications) and keeping production records.',
            'Clause 8.2 (Requirements for Products and Services): Before accepting a customer order or contract, review it to confirm:',
            '• Product specifications, packaging, and delivery dates are clearly defined.',
            '• Applicable statutory and regulatory laws are met.',
            '• Your facility actually has the capacity and capability to meet the order on time.',
            'If a customer changes an order later, amend the documents and notify production/QA immediately.'
          ],
          keyTakeaway:
            'Reviewing customer contracts before acceptance prevents late deliveries and specification disputes.'
        },
        {
          slideNumber: 2,
          title: 'Clause 8.3: Design and Development of Products and Services',
          subtitle: 'Turning a New Idea Into a Safe, Tested Commercial Product',
          bulletPoints: [
            'When developing a new product or recipe, follow structured Design Stages:',
            '• Design Inputs: Customer needs, legal regulations, functional/safety targets, and lessons from previous similar products.',
            '• Design Controls: Design Reviews (checking progress), Design Verification (do lab recipes meet input specs?), and Design Validation (do pilot/factory trials work in real customer use?).',
            '• Design Outputs: Approved final formula, raw material specs, packaging specs, and inspection criteria.'
          ],
          keyTakeaway:
            'Design Verification checks if outputs meet design inputs on paper/lab; Design Validation proves the final product works in real-world use.'
        },
        {
          slideNumber: 3,
          title: 'Clause 8.4: Control of Externally Provided Processes, Products & Services',
          subtitle: 'Supplier Approval, Monitoring & Outsourced Processes',
          bulletPoints: [
            'Your finished product is only as good as the raw materials and services you buy.',
            'Establish criteria for evaluating, selecting, monitoring performance, and re-evaluating suppliers (Clause 8.4.1).',
            'Clearly communicate specifications, quality requirements, and COA needs on Purchase Orders (Clause 8.4.3).',
            'Remember: If you outsource a process (e.g., external warehousing, lab testing, or contract packing), YOU remain responsible for its quality and must control it under Clause 8.4!'
          ],
          keyTakeaway:
            'Outsourced processes cannot be ignored—they must be controlled and audited under Clause 8.4.'
        },
        {
          slideNumber: 4,
          title: 'Clause 8.5.1 & 8.5.2: Production Control, Identification & Traceability',
          subtitle: 'Running Controlled Shifts & Tracking Every Batch',
          bulletPoints: [
            'Controlled Conditions (8.5.1): Operators must have clear work instructions/specs, suitable calibrated equipment, in-process monitoring checks, and human-error prevention controls.',
            'Identification & Traceability (8.5.2): Every raw material, work-in-progress bin, and finished carton must carry a clear Batch/Lot ID AND Inspection Status (e.g., "Under Test / Hold", "QC Passed", or "Rejected").',
            'Never leave unlabeled containers or unmarked pallets on the shop floor.'
          ],
          keyTakeaway:
            'Every pallet or bin in the facility must clearly show both What it is (Batch ID) and its Inspection Status (Passed / Hold / Rejected).'
        },
        {
          slideNumber: 5,
          title: 'Clause 8.5.3 to 8.5.6: Customer Property, Preservation & Change Control',
          subtitle: 'Protecting Goods & Managing Operational Changes',
          bulletPoints: [
            'Customer or External Provider Property (8.5.3): If a customer supplies their own branded packaging, molds, or raw materials, label and protect them carefully and report any damage/loss.',
            'Preservation (8.5.4): Protect product quality during internal handling, packaging, storage (FIFO/FEFO, temperature/humidity control), and transport.',
            'Post-Delivery Activities (8.5.5) & Control of Changes (8.5.6): Handle warranty/feedback and document approval before making any production process change.'
          ],
          keyTakeaway:
            'Preservation (Clause 8.5.4) covers proper packaging, warehousing, FIFO/FEFO rotation, and safe shipping conditions.'
        },
        {
          slideNumber: 6,
          title: 'Clause 8.6 & 8.7: Release of Products & Nonconforming Outputs',
          subtitle: 'Final QC Gate & Handling Defective Batches',
          bulletPoints: [
            'Release of Products (8.6): Finished goods must NOT be shipped to customers until all planned inspections/tests are completed and signed off by an authorized person (e.g., QC Release Officer).',
            'Control of Nonconforming Outputs (8.7): If raw material, WIP, or finished product fails specification:',
            '• Identify and physically segregate it immediately (Red Hold Tag / Quarantine Area) to prevent unintended use.',
            '• Authorized Actions: (a) Correction / Rework (followed by full re-inspection!), (b) Segregation/Return/Scrap, or (c) Obtaining written Concession from the customer (only if legal/safe).',
            '• Retain records describing the defect, action taken, and who authorized the decision.'
          ],
          keyTakeaway:
            'Any reworked product under Clause 8.7 MUST be re-inspected to prove it now meets 100% of original specifications.'
        }
      ]
    },
    {
      id: 'iso9001-mod-5',
      moduleNumber: 5,
      title: 'Clauses 9 & 10: Performance Evaluation, Internal Audit, Management Review & Improvement',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on Clause 9 (Monitoring KPIs, Customer Satisfaction, Internal Audits, Management Review) and Clause 10 (Nonconformity & Corrective Action, Root Cause Analysis, and Continual Improvement).',
      internationalClauses: [
        'ISO 9001:2015 Clauses 9 and 10 (The CHECK & ACT Phases)'
      ],
      keyPrinciples: [
        'Clause 9.1 requires monitoring process KPIs, analyzing data trends, and actively measuring Customer Satisfaction (surveys, repeat orders, complaint trends, OTIF).',
        'Clause 9.2 requires conducting planned, impartial Internal Audits to verify that the QMS conforms to ISO 9001 and company procedures and is effectively maintained.',
        'Clause 9.3 requires Top Management to review the QMS at planned intervals considering mandatory Review Inputs and generating documented Review Outputs.',
        'Clause 10.2 requires reacting to nonconformities, determining Root Cause, implementing Corrective Actions, and verifying effectiveness to prevent recurrence.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Internal Audit Impartiality & Scope (Clause 9.2)',
          standardLimit: 'Audit program covers all QMS processes based on status/importance; auditors do NOT audit their own work',
          correctiveProtocol: 'Ensure timely correction and corrective action without undue delay for every audit nonconformity.'
        },
        {
          parameter: 'Correction vs. Corrective Action (Clause 10.2)',
          standardLimit: 'Correction = Immediate fix of the defect; Corrective Action = Eliminating the Root Cause so it cannot recur',
          correctiveProtocol: 'Review the effectiveness of every Corrective Action taken before closing the CAR/CAPA log.'
        }
      ],
      practicalChecklist: [
        'Review customer satisfaction survey results, complaint trends, and process KPIs (Clause 9.1).',
        'Verify that the Annual Internal Audit Program and Management Review minutes are complete (Clauses 9.2 & 9.3).',
        'Complete all 5 modules and take the 40-MCQ ISO 9001 Awareness Final Exam.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Clause 9.1: Monitoring, Measurement, Analysis & Evaluation',
          subtitle: 'Measuring Process Performance & Customer Satisfaction',
          bulletPoints: [
            'Determine what needs to be monitored and measured, when, and how the data will be analyzed.',
            'Customer Satisfaction (Clause 9.1.2): You must monitor customer perceptions of the degree to which their needs and expectations have been fulfilled.',
            'Methods to measure Customer Satisfaction: Customer surveys, feedback on delivered quality, On-Time-In-Full (OTIF) delivery scores, customer complaints, compliments, and repeat business.',
            'Analyze data (Clause 9.1.3) to evaluate product conformity, process trends, and supplier performance.'
          ],
          keyTakeaway:
            'Waiting for complaints is not enough—Clause 9.1.2 requires proactively monitoring customer satisfaction perceptions.'
        },
        {
          slideNumber: 2,
          title: 'Clause 9.2: Internal Audit Program',
          subtitle: 'Checking That Your QMS Works as Planned',
          bulletPoints: [
            'Conduct internal audits at planned intervals to verify whether the QMS:',
            '• Conforms to your organization’s own procedures and requirements.',
            '• Conforms to the requirements of ISO 9001:2015.',
            '• Is effectively implemented and maintained.',
            'Plan the audit schedule based on the importance of the processes, changes affecting the company, and the results of previous audits.',
            'Select trained, objective, and impartial auditors (auditors must never audit their own work!).'
          ],
          keyTakeaway:
            'Internal audits must be scheduled based on process risk/importance and previous audit findings.'
        },
        {
          slideNumber: 3,
          title: 'Clause 9.3: Management Review (Inputs & Outputs)',
          subtitle: 'Top Management’s Strategic Review of the QMS',
          bulletPoints: [
            'Top Management must review the QMS at planned intervals (e.g., quarterly or annually).',
            'Mandatory Management Review Inputs (9.3.2): Status of previous actions, changes in external/internal issues, customer satisfaction & feedback, achievement of Quality Objectives, process performance & nonconformities, audit results, supplier performance, adequacy of resources, and effectiveness of risk actions.',
            'Mandatory Outputs (9.3.3): Decisions and actions related to Opportunities for Improvement, any need for changes to the QMS, and Resource needs.'
          ],
          keyTakeaway:
            'Make sure your Management Review meeting agenda includes every single mandatory input listed in Clause 9.3.2!'
        },
        {
          slideNumber: 4,
          title: 'Clause 10.2: Nonconformity and Corrective Action',
          subtitle: 'Correction vs. Corrective Action (Key Exam Distinction)',
          bulletPoints: [
            'When a nonconformity (including a customer complaint or audit finding) occurs:',
            'Step 1 — React & Apply Immediate Correction: Take action to control and correct the immediate defect and deal with the consequences.',
            'Step 2 — Root Cause Analysis: Evaluate the need for action to eliminate the cause(s) of the nonconformity (using 5-Whys or Fishbone/Ishikawa diagram) so it does not recur.',
            'Step 3 — Implement Corrective Action & Review Effectiveness: Put the systemic fix in place, update risks/SOPs if needed, and verify later that the problem did not return.'
          ],
          keyTakeaway:
            'Correction fixes the immediate symptom; Corrective Action eliminates the Root Cause so the problem cannot happen again.'
        },
        {
          slideNumber: 5,
          title: 'Clause 10.3: Continual Improvement & Course Summary',
          subtitle: 'Making the Organization Stronger Every Year',
          bulletPoints: [
            'The organization must continually improve the suitability, adequacy, and effectiveness of the QMS.',
            'Use outputs from data analysis, internal audits, customer feedback, and management reviews to drive Kaizen (continuous small improvements) and breakthrough projects.',
            'Congratulations on completing all 5 Modules of the ISO 9001 Awareness Certificate! Proceed to the 40-MCQ Final Exam (60% passing score).'
          ],
          keyTakeaway:
            'ISO 9001 is a continuous PDCA journey of quality excellence—click below to start your 40-MCQ Final Exam!'
        }
      ]
    }
  ],
  coreExamPool: [
    {
      q: 'What is the primary purpose of the ISO 9001:2015 standard?',
      options: [
        'To specify requirements for a Quality Management System (QMS) so an organization consistently provides products/services that meet customer and regulatory requirements',
        'To set retail prices for food products',
        'To calculate employee income tax',
        'To design company logos'
      ],
      correctIndex: 0,
      explanation: 'ISO 9001:2015 defines the requirements for an effective Quality Management System (QMS).'
    },
    {
      q: 'How many Quality Management Principles form the foundation of ISO 9000 / ISO 9001:2015?',
      options: [
        '7 Quality Management Principles',
        '3 Quality Management Principles',
        '14 Quality Management Principles',
        '20 Quality Management Principles'
      ],
      correctIndex: 0,
      explanation: 'ISO 9001:2015 is built on 7 Quality Management Principles: Customer Focus, Leadership, Engagement of People, Process Approach, Improvement, Evidence-Based Decision Making, and Relationship Management.'
    },
    {
      q: 'In the Annex SL structure of ISO 9001:2015, which clauses correspond to the PLAN, DO, CHECK, and ACT phases?',
      options: [
        'Plan = Clauses 4, 5, 6; Do = Clauses 7, 8; Check = Clause 9; Act = Clause 10',
        'Plan = Clause 1; Do = Clause 2; Check = Clause 3; Act = Clause 4',
        'Plan = Clause 10; Do = Clause 9; Check = Clause 8; Act = Clause 7',
        'ISO 9001 does not use PDCA'
      ],
      correctIndex: 0,
      explanation: 'Clauses 4–6 represent Plan, Clauses 7–8 represent Do, Clause 9 represents Check, and Clause 10 represents Act.'
    },
    {
      q: 'Under ISO 9001:2015 Clause 7.5 (Documented Information), what is the difference between "Maintain documented information" and "Retain documented information"?',
      options: [
        '"Maintain" refers to procedures/SOPs/manuals that guide work; "Retain" refers to records/logs that provide objective evidence of results achieved',
        'They both mean throwing away old files',
        '"Maintain" means repairing trucks; "Retain" means hiring staff',
        'ISO 9001 does not require any records'
      ],
      correctIndex: 0,
      explanation: 'In Annex SL terminology, "Maintain documented information" means controlled procedures/documents, while "Retain documented information" means records.'
    },
    {
      q: 'Under Clause 7.1.5 (Monitoring and Measuring Resources), what must you do if a weighing scale or thermometer is found to be out of calibration?',
      options: [
        'Tag the instrument out of service, recalibrate/repair it, AND assess the validity of previous measurements taken with it (checking if recent batches were affected)',
        'Continue using it until the end of the year',
        'Change the calibration sticker date with a pen',
        'Do nothing'
      ],
      correctIndex: 0,
      explanation: 'Clause 7.1.5.2 requires assessing and recording the validity of previous measurement results whenever measuring equipment is found unfit for purpose.'
    },
    {
      q: 'Under Clause 10.2 of ISO 9001:2015, what is the exact difference between "Correction" and "Corrective Action"?',
      options: [
        'Correction fixes the immediate detected nonconformity; Corrective Action eliminates the Root Cause of the nonconformity to prevent recurrence',
        'Correction is for managers; Corrective Action is for operators',
        'They mean the exact same thing',
        'Corrective Action means ignoring the defect'
      ],
      correctIndex: 0,
      explanation: 'Correction addresses the immediate symptom/defect, while Corrective Action eliminates the underlying root cause so it cannot happen again.'
    }
  ]
};

// ============================================================================
// 6. ISO 22000 AWARENESS CERTIFICATE (FOOD SAFETY MANAGEMENT SYSTEM — FSMS)
// ============================================================================
export const ISO_22000_AWARENESS_COURSE: InternationalTrainingCourse = {
  id: 'cert-2026-iso-22000-awareness',
  code: 'ISO-22000-AW',
  title: 'ISO 22000 Awareness Certificate',
  levelBadge: 'Simple Presentation Course (05 Modules · 35 Slides · 40 MCQs · 60% Pass)',
  accreditationStandard:
    'ISO 22000:2018 Food Safety Management Systems (FSMS) • Awareness Presentation Course',
  duration: '05 Presentation Modules (35 Slides) + 40-MCQ Final Exam',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Simple Slide Presentation Course on ISO 22000:2018 Food Safety Management Systems (FSMS) across the entire "Farm-to-Fork" food chain. Covers the 4 Pillars of ISO 22000, the Dual PDCA Cycle (Organizational vs. Operational HACCP), Clauses 4 to 7, Clause 8 Operational Control (PRPs vs. OPRPs vs. CCPs, Traceability & Emergency Preparedness), and Clauses 9 & 10 Auditing and Improvement.',
  modules: [
    {
      id: 'iso22000-mod-1',
      moduleNumber: 1,
      title: 'Introduction to ISO 22000:2018, The 4 Key Elements & Dual PDCA Cycle',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on what ISO 22000:2018 is, which food chain organizations can use it, its 4 core pillars (Interactive Communication, System Management, PRPs, HACCP Principles), and its unique Dual PDCA Cycle.',
      internationalClauses: [
        'ISO 22000:2018 Clauses 1 to 4 & Dual PDCA Architecture'
      ],
      keyPrinciples: [
        'ISO 22000:2018 is the international Food Safety Management System (FSMS) standard applicable to all organizations in the "Farm-to-Fork" food chain (farms, processors, catering, packaging, transport, chemicals).',
        'It combines 4 key elements: (1) Interactive Communication across the food chain, (2) System Management (ISO 9001 Annex SL structure), (3) Prerequisite Programs (PRPs), and (4) Codex HACCP Principles.',
        'ISO 22000:2018 uses a Dual PDCA Cycle: The Outer PDCA manages Organizational Business Risk (Clauses 4–10), while the Inner PDCA inside Clause 8 manages Operational Food Safety Risk (HACCP).'
      ],
      criticalControlParameters: [
        {
          parameter: 'Four Pillars of ISO 22000:2018',
          standardLimit: 'Interactive Communication + System Management + Prerequisite Programs (PRPs) + HACCP Principles',
          correctiveProtocol: 'Ensure all 4 elements are active and integrated in the company FSMS.'
        },
        {
          parameter: 'Dual PDCA Cycle (Organizational vs. Operational)',
          standardLimit: 'Level 1 Organizational Risk (Clause 6.1) + Level 2 Operational Food Safety Hazard Analysis (Clause 8.5)',
          correctiveProtocol: 'Maintain both an Organizational Business Risk Register (Clause 6.1) and a HACCP Hazard Analysis (Clause 8.5).'
        }
      ],
      practicalChecklist: [
        'Learn the 4 key elements of ISO 22000:2018.',
        'Understand how the Inner Operational PDCA (Clause 8 HACCP) sits inside the Outer Organizational PDCA (Clauses 4–10).',
        'Identify your organization’s upstream suppliers and downstream customers in the food chain.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'What is ISO 22000:2018?',
          subtitle: 'The Global Standard for Food Safety Management Systems (FSMS)',
          bulletPoints: [
            'ISO 22000:2018 is the international standard created specifically for Food Safety Management Systems (FSMS).',
            'It combines the management system structure of ISO 9001 with Codex Alimentarius HACCP and Prerequisite Programs (PRPs).',
            'It applies to ANY organization in the "Farm-to-Fork" food chain: crop/dairy farms, food & beverage manufacturers, hospital/hotel kitchens, transport & cold storage, food packaging makers, and cleaning chemical suppliers.'
          ],
          keyTakeaway:
            'ISO 22000:2018 unites ISO 9001 management discipline with Codex HACCP food safety science.'
        },
        {
          slideNumber: 2,
          title: 'The 4 Key Elements (Pillars) of ISO 22000:2018',
          subtitle: 'The Building Blocks of the Standard',
          bulletPoints: [
            'Interactive Communication: Structured food safety communication upstream (with suppliers) and downstream (with customers and regulators) across the food chain.',
            'System Management: Structured policies, planning, document control, internal auditing, and management review (Clauses 4 to 10).',
            'Prerequisite Programs (PRPs): Basic hygiene and facility conditions (GMPs/GHPs) tailored to your sector (using ISO/TS 22002 series).',
            'HACCP Principles: Science-based hazard analysis and control via OPRPs and CCPs.'
          ],
          keyTakeaway:
            'Memorize the 4 Pillars of ISO 22000: Interactive Communication, System Management, PRPs, and HACCP Principles.'
        },
        {
          slideNumber: 3,
          title: 'The Unique "Dual PDCA Cycle" in ISO 22000:2018',
          subtitle: 'Two Levels of Plan-Do-Check-Act Working Together',
          bulletPoints: [
            'A major highlight of ISO 22000:2018 is that it operates TWO PDCA cycles simultaneously:',
            'Cycle 1 — Outer Organizational PDCA (Clauses 4 to 10): Manages high-level business context, leadership, organizational risks/opportunities (Clause 6.1), resources, audits, and continual improvement.',
            'Cycle 2 — Inner Operational PDCA (Inside Clause 8): Manages hands-on Food Safety—PRPs, Traceability, Emergency Preparedness, Hazard Analysis, OPRPs/CCPs, Validation, Monitoring, and Verification.'
          ],
          keyTakeaway:
            'Clause 6.1 addresses Business/Organizational Risks; Clause 8.5 addresses Operational Food Safety Hazards (HACCP).'
        },
        {
          slideNumber: 4,
          title: 'Interactive Communication Across the Food Chain',
          subtitle: 'Why One Link Cannot Ensure Safe Food Alone',
          bulletPoints: [
            'Contamination can enter at any point from farm feed to retail display.',
            'Upstream Communication (With Suppliers): Sharing raw material specifications, allergen profiles, COA requirements, and audit findings.',
            'Downstream Communication (With Customers & Consumers): Providing accurate allergen labeling, storage temperatures ("Keep Chilled ≤ 4°C"), shelf life, and safe cooking instructions.',
            'Regulatory Communication: Reporting statutory notifications and recalls promptly.'
          ],
          keyTakeaway:
            'Clear communication with suppliers and customers ensures hazards are controlled across the entire food chain.'
        },
        {
          slideNumber: 5,
          title: 'Overview of ISO 22000:2018 Clauses 4 to 10',
          subtitle: 'Matching the High-Level Annex SL Structure',
          bulletPoints: [
            'Clause 4: Context of the Organization, Interested Parties & FSMS Scope.',
            'Clause 5: Leadership, Food Safety Policy & Food Safety Team Leader (FSTL) Role.',
            'Clause 6: Planning (Organizational Risks/Opportunities & FSMS Objectives).',
            'Clause 7: Support (Resources, Competence, Awareness, Communication & Documented Information).',
            'Clause 8: Operation (PRPs, Traceability, Emergency Preparedness, HACCP Hazard Analysis, OPRPs & CCPs).',
            'Clause 9: Performance Evaluation (Monitoring, Verification, Internal Audit & Management Review).',
            'Clause 10: Improvement (Nonconformity, Corrective Action & Continual Improvement).'
          ],
          keyTakeaway:
            'Because ISO 22000 shares the Clauses 4–10 layout with ISO 9001, companies can easily combine both into one Integrated Management System.'
        }
      ]
    },
    {
      id: 'iso22000-mod-2',
      moduleNumber: 2,
      title: 'Clauses 5, 6 & 7: Leadership, Food Safety Team Leader (FSTL), Planning & Support',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on Top Management commitment, the Food Safety Policy, the mandatory duties of the Food Safety Team Leader (FSTL), FSMS Objectives, Calibration, Competence, and control of Externally Developed Elements.',
      internationalClauses: [
        'ISO 22000:2018 Clauses 5, 6, and 7'
      ],
      keyPrinciples: [
        'Clause 5.3 requires Top Management to appoint a qualified Food Safety Team Leader (FSTL) who manages the Food Safety Team, ensures training, maintains the FSMS, and reports effectiveness to Top Management.',
        'The Food Safety Policy (Clause 5.2) must commit to satisfying applicable food safety/legal/customer requirements, continual improvement, and addressing internal/external food safety communication.',
        'Clause 7.1.5 requires explicitly controlling any "Externally Developed Elements" of the FSMS (e.g., government hygiene guides or group head-office HACCP templates) to ensure they fit the local site.',
        'Clause 7.4 defines mandatory External and Internal Food Safety Communication channels.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Appointment & Duties of the Food Safety Team Leader (Clause 5.3.2)',
          standardLimit: 'Formally appointed FSTL responsible for managing the FS Team, organizing work/training, and reporting FSMS suitability',
          correctiveProtocol: 'Ensure the FSTL has formal HACCP/ISO 22000 training and direct reporting access to Top Management.'
        },
        {
          parameter: 'Internal Food Safety Change Communication (Clause 7.4.3)',
          standardLimit: 'Food Safety Team notified BEFORE any change in new products, raw materials, equipment, cleaning chemicals, or packaging',
          correctiveProtocol: 'Enforce a Management of Change (MOC) sign-off by the FSTL prior to implementing any operational change.'
        }
      ],
      practicalChecklist: [
        'Check that the Food Safety Team Leader (FSTL) appointment letter and Food Safety Team list are signed by Top Management.',
        'Verify that the Food Safety Policy is displayed and includes a commitment to safe food, legal compliance, communication, and continual improvement.',
        'Confirm that Clause 7.4.3 internal change notifications are logged whenever recipes, suppliers, or machines change.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Clause 5.2: The Food Safety Policy',
          subtitle: 'Top Management’s Written Commitment to Safe Food',
          bulletPoints: [
            'Top Management must establish, implement, and maintain a Food Safety Policy that:',
            '• Is appropriate to the purpose and context of the food organization.',
            '• Provides a framework for setting and reviewing measurable FSMS Objectives.',
            '• Includes a commitment to satisfy applicable food safety requirements (statutory, regulatory, and mutually agreed customer requirements).',
            '• Addresses internal and external communication.',
            '• Includes a commitment to continual improvement and ensuring food safety competence.'
          ],
          keyTakeaway:
            'Unlike a generic quality policy, an ISO 22000 Food Safety Policy must specifically mention food safety communication and competence.'
        },
        {
          slideNumber: 2,
          title: 'Clause 5.3: The Food Safety Team Leader (FSTL)',
          subtitle: 'A Mandatory Role Under ISO 22000:2018',
          bulletPoints: [
            'While ISO 9001 removed the mandatory title "Management Representative", ISO 22000:2018 STILL strictly requires appointing a Food Safety Team Leader (FSTL)!',
            'Core Responsibilities of the FSTL (Clause 5.3.2):',
            '• Ensure the FSMS is established, implemented, maintained, and updated.',
            '• Manage and organize the work of the multidisciplinary Food Safety Team.',
            '• Ensure relevant training and competencies for the Food Safety Team.',
            '• Report to Top Management on the effectiveness and suitability of the FSMS.'
          ],
          keyTakeaway:
            'Every ISO 22000 facility must have a formally appointed Food Safety Team Leader (FSTL).'
        },
        {
          slideNumber: 3,
          title: 'Clause 6: Planning Organizational Risks & FSMS Objectives',
          subtitle: 'Separating Business Risks from HACCP Hazards',
          bulletPoints: [
            'Clause 6.1 (Organizational Risks & Opportunities): Evaluates business-level risks that could impact food safety—such as skilled staff shortage, supplier bankruptcy, power grid instability, or regulatory law changes.',
            'Clause 6.2 (FSMS Objectives): Measurable targets consistent with the Food Safety Policy—such as "Zero Class I/II recalls", "100% CCP monitoring compliance", or "≥ 98% pre-op ATP swab pass rate".'
          ],
          keyTakeaway:
            'Track your measurable FSMS Objectives monthly and review them in Management Review.'
        },
        {
          slideNumber: 4,
          title: 'Clause 7.1.2 to 7.1.6: External Experts, Labs & Suppliers',
          subtitle: 'Controlling External Support for the FSMS',
          bulletPoints: [
            'If you use External Experts (e.g., a food safety consultant or pest control advisor) to help develop or maintain the FSMS, you must keep a written agreement defining their competence, responsibility, and authority (Clause 7.1.2).',
            'If you use Externally Developed Elements (e.g., industry-wide PRP guides or corporate HACCP plans), you must prove they are adapted specifically to your factory lines (Clause 7.1.5).'
          ],
          keyTakeaway:
            'Never copy-paste a generic HACCP plan—Clause 7.1.5 requires adapting any external template to your exact site processes.'
        },
        {
          slideNumber: 5,
          title: 'Clause 7.4: External & Internal Food Safety Communication',
          subtitle: 'Ensuring the Food Safety Team Is Never Left in the Dark',
          bulletPoints: [
            'External Communication (7.4.2): Assign authorized personnel to communicate food safety information with suppliers, customers, statutory/regulatory authorities, and other organizations.',
            'Internal Communication (7.4.3): The Food Safety Team MUST be informed in a timely manner of any changes in: New products, raw materials/ingredients, production systems/equipment, cleaning & sanitation programs, packaging/storage/distribution, staff qualification levels, or legal requirements.'
          ],
          keyTakeaway:
            'Clause 7.4.3 guarantees that no department can change an ingredient, chemical, or machine without informing the Food Safety Team first.'
        }
      ]
    },
    {
      id: 'iso22000-mod-3',
      moduleNumber: 3,
      title: 'Clause 8.1 to 8.4: Prerequisite Programs (PRPs), Traceability & Emergency Preparedness',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on Clause 8.2 Prerequisite Programs (PRPs and the ISO/TS 22002 series), Clause 8.3 Traceability System (one step back, one step forward, rework tracking), and Clause 8.4 Emergency Preparedness and Response.',
      internationalClauses: [
        'ISO 22000:2018 Clauses 8.1, 8.2, 8.3, and 8.4'
      ],
      keyPrinciples: [
        'Clause 8.2 requires establishing Prerequisite Programs (PRPs) to prevent and reduce contaminants in the processing environment, aligned with the ISO/TS 22002 technical specification for your sector.',
        'Clause 8.2.3 lists 12 mandatory PRP areas including building layout, air/water/energy utilities, pest control, waste disposal, equipment suitability, cleaning/sanitizing, personal hygiene, rework, and product information.',
        'Clause 8.3 requires a Traceability System that uniquely identifies incoming materials, rework, and finished distribution pathways.',
        'Clause 8.4 requires written Emergency Preparedness procedures (fire, flood, power/water outage, bioterrorism/sabotage) tested periodically through drills.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Sector-Specific PRP Alignment (Clause 8.2 & ISO/TS 22002)',
          standardLimit: 'Food Manufacturing = ISO/TS 22002-1; Catering = ISO/TS 22002-2; Packaging = ISO/TS 22002-4; Storage/Transport = ISO 22002-5',
          correctiveProtocol: 'Verify and inspect all 12 PRP categories listed in Clause 8.2.3 on a scheduled frequency.'
        },
        {
          parameter: 'Emergency Preparedness Testing & Mock Recalls (Clause 8.3 & 8.4)',
          standardLimit: 'Periodic testing of emergency response plans and traceability/recall drills at least annually',
          correctiveProtocol: 'Update emergency contact lists and SOPs immediately after every drill or real incident.'
        }
      ],
      practicalChecklist: [
        'Verify that your PRP Manual covers all 12 sub-clauses of ISO 22000 Clause 8.2.3.',
        'Check that Rework (if used) is clearly batch-coded, allergen-segregated, and recorded in your Traceability system (Clause 8.3).',
        'Confirm that an annual Emergency Drill (e.g., power outage or water contamination) and Mock Recall have been documented.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Clause 8.2: Prerequisite Programs (PRPs)',
          subtitle: 'The 12 Mandatory PRP Topics in Clause 8.2.3',
          bulletPoints: [
            'ISO 22000 Clause 8.2.3 requires your PRPs to cover at least these 12 areas:',
            '• Construction and layout of buildings & associated utilities.',
            '• Layout of premises, including workspace and employee facilities.',
            '• Supplies of air, water, energy, and other utilities.',
            '• Pest control, waste, and sewage disposal.',
            '• Suitability of equipment and its accessibility for cleaning and maintenance.',
            '• Supplier approval and management of purchased materials, services, and subcontracted processes.'
          ],
          keyTakeaway:
            'PRPs must be established BEFORE conducting the Clause 8.5 HACCP Hazard Analysis.'
        },
        {
          slideNumber: 2,
          title: 'Clause 8.2.3 (Continued) & The ISO/TS 22002 Series',
          subtitle: 'Matching Your PRPs to Your Exact Industry Sector',
          bulletPoints: [
            'The remaining mandatory PRP topics in Clause 8.2.3:',
            '• Measures for prevention of cross-contamination & allergen control.',
            '• Cleaning and disinfecting.',
            '• Personal hygiene and employee health facilities.',
            '• Rework control, Product recall procedures, and Warehousing/Transport.',
            'Sector Technical Specifications: ISO/TS 22002-1 (Food Manufacturing), ISO/TS 22002-2 (Catering), ISO/TS 22002-3 (Farming), ISO/TS 22002-4 (Food Packaging), ISO/TS 22002-5 (Transport & Storage).'
          ],
          keyTakeaway:
            'ISO 22000 tells you WHAT PRPs are needed; the ISO/TS 22002 series gives the detailed technical rules for your sector.'
        },
        {
          slideNumber: 3,
          title: 'Clause 8.3: The Traceability System',
          subtitle: 'Tracking Materials, Rework & Distribution',
          bulletPoints: [
            'The traceability system must uniquely identify incoming material from suppliers and the first stage of the distribution route of the end product.',
            'Crucial ISO 22000 Requirement: When establishing traceability, you must explicitly include:',
            '• Relation of lots of received materials, ingredients, and intermediate products to the end products.',
            '• Reworking of materials/products (ensuring rework batch codes and allergens are 100% traced!).',
            '• Distribution of the end product.',
            'Test the effectiveness of the traceability system at defined intervals.'
          ],
          keyTakeaway:
            'Unlabeled rework is one of the top causes of traceability failure in ISO 22000 audits—always label rework with its original batch and date!'
        },
        {
          slideNumber: 4,
          title: 'Clause 8.4: Emergency Preparedness and Response',
          subtitle: 'Preparing for Accidents, Utility Failures & Crises',
          bulletPoints: [
            'Top Management must ensure procedures are in place to respond to potential emergency situations or accidents that can impact food safety.',
            'Examples covered under Clause 8.4: Natural disasters (floods, earthquakes), environmental accidents, bioterrorism/sabotage, workplace accidents, and public health emergencies (pandemics, loss of potable water, extended power blackouts).',
            'Periodically TEST the emergency procedures where practical, and review/update the plan after any drill or real incident.'
          ],
          keyTakeaway:
            'An untested emergency plan on a shelf fails Clause 8.4—run at least one documented emergency simulation drill every year.'
        }
      ]
    },
    {
      id: 'iso22000-mod-4',
      moduleNumber: 4,
      title: 'Clause 8.5 to 8.9: Hazard Control Plan — OPRPs vs. CCPs, Validation & Nonconformities',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on the core of ISO 22000 Clause 8.5: Preliminary steps, Hazard Assessment, categorizing control measures into OPRPs (Action Criteria) vs. CCPs (Critical Limits), Validation (8.5.3), Verification (8.8), and Handling Potentially Unsafe Products (8.9).',
      internationalClauses: [
        'ISO 22000:2018 Clauses 8.5, 8.6, 8.7, 8.8, and 8.9'
      ],
      keyPrinciples: [
        'In ISO 22000:2018, the Hazard Control Plan combines both OPRPs (Operational Prerequisite Programs) and CCPs (Critical Control Points).',
        'A CCP uses measurable Critical Limits (e.g., ≥ 75°C, pH ≤ 4.2), whereas an OPRP uses measurable OR observable Action Criteria (e.g., visual sieve integrity check, allergen label check).',
        'When a CCP Critical Limit is breached, the affected product is automatically treated as "Potentially Unsafe Product" (Clause 8.9.4) and must be quarantined.',
        'When an OPRP Action Criterion is not met, you determine the cause, evaluate whether food safety was affected, and take corrective action.'
      ],
      criticalControlParameters: [
        {
          parameter: 'OPRPs (Action Criteria) vs. CCPs (Critical Limits) in Clause 8.5.2.4',
          standardLimit: 'CCPs have measurable Critical Limits with real-time detection; OPRPs have measurable or observable Action Criteria',
          correctiveProtocol: 'Document the selection logic (likelihood of failure + severity of consequence + feasibility of monitoring) for every OPRP and CCP.'
        },
        {
          parameter: 'Handling Potentially Unsafe Products (Clause 8.9.4)',
          standardLimit: 'Any batch failing a CCP Critical Limit is quarantined and evaluated via lab/scientific proof before release, rework, or destruction',
          correctiveProtocol: 'Initiate Clause 8.9.5 Withdrawal/Recall immediately if potentially unsafe product has already left the facility.'
        }
      ],
      practicalChecklist: [
        'Check your Hazard Control Plan to see how significant hazards are assigned to either OPRPs (with Action Criteria) or CCPs (with Critical Limits).',
        'Verify that validation records (Clause 8.5.3) exist for every OPRP and CCP prior to implementation.',
        'Understand the exact difference in handling an OPRP deviation vs. a CCP Critical Limit failure under Clause 8.9.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Clause 8.5.1 & 8.5.2: Preliminary Steps & Hazard Assessment',
          subtitle: 'Identifying Significant Food Safety Hazards',
          bulletPoints: [
            'Clause 8.5.1 embeds the 5 Codex Preliminary Steps: Raw material/ingredient/food-contact material descriptions, End-product characteristics, Intended use, Flow diagrams, and Description of processes/environment.',
            'Clause 8.5.2 (Hazard Identification & Assessment): For every step, identify all reasonably expected food safety hazards (Biological, Chemical, Physical, Radiological, Allergens) and determine the Acceptable Level in the end product.',
            'Evaluate each hazard by Likelihood × Severity to identify Significant Food Safety Hazards.'
          ],
          keyTakeaway:
            'Every Significant Food Safety Hazard identified in Clause 8.5.2.3 MUST be controlled by an OPRP or a CCP.'
        },
        {
          slideNumber: 2,
          title: 'OPRP vs. CCP in ISO 22000:2018 (The #1 Exam Topic!)',
          subtitle: 'Understanding Critical Limits vs. Action Criteria',
          bulletPoints: [
            'In ISO 22000:2018, the Hazard Control Plan includes both CCPs and OPRPs:',
            'Critical Control Point (CCP):',
            '• Uses a measurable CRITICAL LIMIT (e.g., Pasteurization ≥ 72°C for 15s; Metal Detector 1.5 mm Fe).',
            '• Monitoring detects any failure in time to isolate the product immediately.',
            '• If breached → Product is automatically classified as "Potentially Unsafe Product" and quarantined!',
            'Operational Prerequisite Program (OPRP):',
            '• Uses a measurable OR observable ACTION CRITERION (e.g., Pre-op allergen clean visual/swab check, End-of-shift sieve intactness check, Glass inspection).',
            '• If not met → Determine cause, assess if food safety was impacted, and take corrective action.'
          ],
          keyTakeaway:
            'Remember: CCPs have measurable "Critical Limits"; OPRPs have measurable or observable "Action Criteria".'
        },
        {
          slideNumber: 3,
          title: 'How ISO 22000 Selects OPRPs vs. CCPs (Clause 8.5.2.4)',
          subtitle: 'Evaluating Control Measures Systematically',
          bulletPoints: [
            'To categorize a control measure as an OPRP or a CCP, the Food Safety Team assesses:',
            '• Likelihood of failure of its functioning (does the control fail easily or have an automatic fail-safe?).',
            '• Severity of the consequence in case of failure (degree of effect on the significant hazard and proximity to the final consumer).',
            '• Feasibility of establishing measurable Critical Limits and real-time monitoring to allow immediate correction.',
            'Where a strict numerical Critical Limit and real-time isolation are feasible for a high-severity step, it is designated a CCP.'
          ],
          keyTakeaway:
            'Document the exact reasoning in your HACCP/ISO 22000 file showing why each control measure was classified as an OPRP or CCP.'
        },
        {
          slideNumber: 4,
          title: 'Clause 8.5.3: Validation of Control Measures',
          subtitle: 'Proving OPRPs and CCPs Work Before Going Live',
          bulletPoints: [
            'Before implementing the Hazard Control Plan, the Food Safety Team must VALIDATE that the selected OPRPs and CCPs are capable of achieving the intended control of the significant hazards.',
            'If validation shows that a control measure cannot achieve the required safe level, the team must modify the control measure, the process parameter, or the raw material/recipe and re-assess.'
          ],
          keyTakeaway:
            'Both CCPs and OPRPs must be validated prior to implementation and after any process change.'
        },
        {
          slideNumber: 5,
          title: 'Clause 8.8 & 8.9: Verification, Corrections & Potentially Unsafe Product',
          subtitle: 'What Happens When an OPRP or CCP Fails?',
          bulletPoints: [
            'Clause 8.8 (Verification): Verify that PRPs and the Hazard Control Plan are implemented and effective (via lab tests, audits, and record reviews).Note: Verification cannot be done by the same person who performed the monitoring!',
            'Clause 8.9.4 (Potentially Unsafe Products): Any batch produced when a CCP Critical Limit was breached MUST NOT be released until it is scientifically evaluated:',
            '• If proven safe by independent lab/scientific evidence → Release.',
            '• If it can be safely re-processed (e.g., re-pasteurized or re-passed through metal detector) → Rework.',
            '• Otherwise → Destroy / Dispose as non-food waste!'
          ],
          keyTakeaway:
            'Under Clause 8.8, the person who verifies CCP records must be independent of the operator who recorded the monitoring checks.'
        }
      ]
    },
    {
      id: 'iso22000-mod-5',
      moduleNumber: 5,
      title: 'Clauses 9 & 10: Performance Evaluation, FSMS Updating & Continual Improvement',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on Clause 9 (Analyzing Verification Results, Internal Audits, Management Review) and Clause 10 (Nonconformity & Corrective Action, Continual Improvement, and Mandatory Updating of the FSMS).',
      internationalClauses: [
        'ISO 22000:2018 Clauses 9 and 10'
      ],
      keyPrinciples: [
        'Clause 9.1.2 requires the Food Safety Team to analyze all verification results (lab tests, CCP/OPRP trends, audits, complaints) and report them to Top Management.',
        'Clause 9.2 requires planned, impartial Internal Audits of the FSMS.',
        'Clause 9.3 requires Top Management to conduct Management Reviews covering food safety performance, emergencies/recalls, and resource adequacy.',
        'Clause 10.3 strictly requires the Food Safety Team to continually UPDATE the FSMS based on internal/external communication, audit findings, and verification analysis.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Analysis of Verification Results by the Food Safety Team (Clause 9.1.2)',
          standardLimit: 'Formal periodic evaluation of PRPs, Hazard Control Plan trends, lab results, audits, and external alerts',
          correctiveProtocol: 'Use verification analysis to update the Hazard Assessment, PRPs, or OPRPs/CCPs.'
        },
        {
          parameter: 'Continual Updating of the FSMS (Clause 10.3)',
          standardLimit: 'Planned updating of the FSMS by the Food Safety Team at defined intervals and upon any process/product change',
          correctiveProtocol: 'Retain documented records of all FSMS updating meetings and report them into Management Review.'
        }
      ],
      practicalChecklist: [
        'Verify that the Food Safety Team conducts a documented Verification Analysis meeting (Clause 9.1.2).',
        'Check that the FSMS Updating Log (Clause 10.3) records all updates made to PRPs, Flow Diagrams, and the Hazard Control Plan.',
        'Complete all 5 modules and take the 40-MCQ ISO 22000 Awareness Final Exam.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Clause 9.1: Analyzing Verification Results',
          subtitle: 'How the Food Safety Team Evaluates System Health',
          bulletPoints: [
            'Under Clause 9.1.2, the Food Safety Team must analyze and evaluate the results of verification activities, including:',
            '• Confirming overall FSMS performance meets planned arrangements.',
            '• Identifying any need for updating or improving the FSMS.',
            '• Identifying trends that indicate a higher incidence of potentially unsafe products or process failures.',
            '• Establishing information for planning the Internal Audit program and prioritizing high-risk areas.'
          ],
          keyTakeaway:
            'Verification data (swabs, lab reports, CCP deviations) must be analyzed by the Food Safety Team, not just filed away in a cabinet.'
        },
        {
          slideNumber: 2,
          title: 'Clause 9.2 & 9.3: Internal Audits & Management Review',
          subtitle: 'Auditing and Executive Oversight of the FSMS',
          bulletPoints: [
            'Internal Audits (9.2): Audit all FSMS processes, PRPs, OPRPs, and CCPs across all shifts using trained, impartial auditors.',
            'Management Review (9.3): Top Management reviews the FSMS considering:',
            '• Results of FSMS updating activities and verification analysis.',
            '• Emergency situations, incidents, and product withdrawals/recalls.',
            '• External inspections, customer audits, and regulatory changes.',
            '• Adequacy of resources and opportunities for continual improvement.'
          ],
          keyTakeaway:
            'Any emergency drill, recall, or external customer audit report must be reviewed by Top Management under Clause 9.3.'
        },
        {
          slideNumber: 3,
          title: 'Clause 10.1 & 10.2: Nonconformity and Corrective Action',
          subtitle: 'Eliminating Root Causes Across the FSMS',
          bulletPoints: [
            'When a nonconformity occurs in any PRP, OPRP, CCP, or management process:',
            '• React to the nonconformity, control/correct it, and deal with the consequences.',
            '• Review the nonconformity and conduct a Root Cause Analysis so it does not recur or occur elsewhere.',
            '• Implement required Corrective Actions, review their effectiveness, and make changes to the FSMS if necessary.'
          ],
          keyTakeaway:
            'Retain documented information of the nature of the nonconformities, actions taken, and the results of every corrective action.'
        },
        {
          slideNumber: 4,
          title: 'Clause 10.3: Update of the Food Safety Management System',
          subtitle: 'Keeping the FSMS Alive and Current',
          bulletPoints: [
            'Clause 10.3 is unique to ISO 22000: Top Management must ensure that the FSMS is continually UPDATED!',
            'To do this, the Food Safety Team evaluates the FSMS at planned intervals using inputs from:',
            '• Internal and external communication (Clause 7.4).',
            '• Analysis of verification activities (Clause 9.1.2).',
            '• Outputs from Management Review (Clause 9.3).',
            'Congratulations on completing all 5 Modules of the ISO 22000 Awareness Certificate! Proceed to the 40-MCQ Final Exam (60% passing score).'
          ],
          keyTakeaway:
            'ISO 22000 Clause 10 has both Continual Improvement (10.2) AND Mandatory Updating of the FSMS (10.3).'
        }
      ]
    }
  ],
  coreExamPool: [
    {
      q: 'What are the 4 Key Elements (Pillars) combined in ISO 22000:2018?',
      options: [
        'Interactive Communication, System Management, Prerequisite Programs (PRPs), and HACCP Principles',
        'Sales, Advertising, Accounting, and HR',
        'Cooking, Freezing, Packing, and Billing',
        'Only end-product laboratory testing'
      ],
      correctIndex: 0,
      explanation: 'ISO 22000:2018 integrates Interactive Communication, System Management, Prerequisite Programs (PRPs), and Codex HACCP Principles.'
    },
    {
      q: 'How does the "Dual PDCA Cycle" work in ISO 22000:2018?',
      options: [
        'The Outer PDCA covers Organizational Management & Business Risk (Clauses 4–10), while the Inner PDCA inside Clause 8 covers Operational Food Safety & HACCP Controls',
        'It means washing hands twice',
        'It means running two factories at once',
        'ISO 22000 does not use PDCA'
      ],
      correctIndex: 0,
      explanation: 'ISO 22000:2018 operates an Organizational PDCA cycle (Clauses 4–10) and an Operational HACCP PDCA cycle within Clause 8.'
    },
    {
      q: 'In ISO 22000:2018 Clause 8.5, what is the key difference between a CCP (Critical Control Point) and an OPRP (Operational Prerequisite Program)?',
      options: [
        'A CCP uses measurable "Critical Limits" where failure makes the product Potentially Unsafe; an OPRP uses measurable or observable "Action Criteria"',
        'An OPRP is only for offices; a CCP is only for warehouses',
        'They are 100% identical with no difference',
        'OPRPs do not need validation or monitoring'
      ],
      correctIndex: 0,
      explanation: 'CCPs are governed by measurable Critical Limits, whereas OPRPs are governed by measurable or observable Action Criteria.'
    },
    {
      q: 'Which Technical Specification in the ISO/TS 22002 series provides the detailed Prerequisite Program (PRP) requirements for Food Manufacturing vs. Catering?',
      options: [
        'ISO/TS 22002-1 for Food Manufacturing; ISO/TS 22002-2 for Catering',
        'ISO 9000 for Manufacturing; ISO 19011 for Catering',
        'ISO 14001 for both',
        'No PRP standards exist'
      ],
      correctIndex: 0,
      explanation: 'ISO/TS 22002-1 covers Food Manufacturing PRPs, while ISO/TS 22002-2 covers Catering PRPs.'
    },
    {
      q: 'Under ISO 22000:2018 Clause 5.3, what mandatory leadership role must Top Management appoint to lead the Food Safety Team?',
      options: [
        'The Food Safety Team Leader (FSTL)',
        'The Chief Marketing Officer',
        'An External Sales Agent',
        'No team leader is required'
      ],
      correctIndex: 0,
      explanation: 'Clause 5.3 requires Top Management to appoint a Food Safety Team Leader (FSTL) with defined responsibilities.'
    },
    {
      q: 'Under ISO 22000:2018 Clause 8.8 (Verification), can the operator who records the daily CCP monitoring checks also be the person who performs the formal Verification of those records?',
      options: [
        'No — Clause 8.8 requires that verification activities shall NOT be carried out by the person responsible for monitoring the same activities',
        'Yes — the same operator can verify and approve their own logs without a supervisor',
        'Verification is optional in ISO 22000',
        'Only customers can verify logs'
      ],
      correctIndex: 0,
      explanation: 'To ensure impartiality, ISO 22000 Clause 8.8.1 states that verification shall not be carried out by the person responsible for monitoring the same activities.'
    }
  ]
};

// ============================================================================
// 7. FSSC 22000 V7 AWARENESS CERTIFICATE (GFSI FOOD SAFETY SYSTEM CERTIFICATION)
// ============================================================================
export const FSSC_22000_V7_AWARENESS_COURSE: InternationalTrainingCourse = {
  id: 'cert-2026-fssc-22000-v7-awareness',
  code: 'FSSC-V7-AW',
  title: 'FSSC 22000 v7 Awareness Certificate',
  levelBadge: 'Simple Presentation Course (05 Modules · 35 Slides · 40 MCQs · 60% Pass)',
  accreditationStandard:
    'FSSC 22000 (Version 6 / v7 GFSI Scheme) • Three-Component Architecture & Additional Requirements',
  duration: '05 Presentation Modules (35 Slides) + 40-MCQ Final Exam',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Comprehensive Slide Presentation Course on the FSSC 22000 Food Safety Certification Scheme (including latest v6/v7 GFSI requirements). Covers the 3-Pillar FSSC Architecture (ISO 22000:2018 + ISO/TS 22002 PRPs + FSSC Additional Requirements 2.5.1–2.5.18), Food Defense (TACCP), Food Fraud (VACCP), Allergen Management, Environmental Monitoring, Food Safety & Quality Culture, Equipment Management, Food Loss & Waste, and Unannounced GFSI Audit Rules.',
  modules: [
    {
      id: 'fssc-mod-1',
      moduleNumber: 1,
      title: 'FSSC 22000 Architecture, GFSI Recognition & Food Chain Categories',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on why FSSC 22000 was created, why ISO 22000 alone is not GFSI-benchmarked, the 3-Component Formula of FSSC 22000, and the Food Chain Categories (C, I, K, F, G).',
      internationalClauses: [
        'FSSC 22000 Scheme Part 1 & Part 2 Overview'
      ],
      keyPrinciples: [
        'FSSC 22000 (Food Safety System Certification 22000) is a Global Food Safety Initiative (GFSI) benchmarked certification scheme accepted by major global food brands and retailers.',
        'The 3 Components of FSSC 22000 are: (1) ISO 22000:2018 + (2) Sector-Specific PRPs (ISO/TS 22002-x) + (3) FSSC 22000 Additional Requirements (Clause 2.5.1 to 2.5.18).',
        'Food Chain Categories include Category C (Food Manufacturing: C0–C4), Category E (Catering), Category F (Trading/Retail), Category G (Transport & Storage), Category I (Food Packaging), and Category K (Bio/Chemicals).'
      ],
      criticalControlParameters: [
        {
          parameter: 'The 3-Component Formula of FSSC 22000',
          standardLimit: '1) ISO 22000:2018 + 2) Sector ISO/TS 22002 PRP Standard + 3) FSSC Additional Requirements (2.5.1–2.5.18)',
          correctiveProtocol: 'Audit all three components together during internal and external FSSC 22000 audits.'
        },
        {
          parameter: 'Mandatory Unannounced Audit Rule (3-Year Cycle)',
          standardLimit: 'At least 1 surveillance audit every 3-year certification cycle MUST be completely unannounced',
          correctiveProtocol: 'Maintain daily audit readiness and a gate reception protocol so unannounced auditors enter within 30 minutes.'
        }
      ],
      practicalChecklist: [
        'Memorize the 3-Component Formula of FSSC 22000.',
        'Identify which Food Chain Category (e.g., C1, C2, C3, C4, E, G, I, K) applies to your facility.',
        'Understand the 3-year certification cycle and mandatory unannounced surveillance audit rule.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Why Was FSSC 22000 Created?',
          subtitle: 'Bridging ISO 22000 and Global GFSI Recognition',
          bulletPoints: [
            'Major global food companies (Nestlé, Unilever, PepsiCo, Mondelēz, Coca-Cola, Danone) and retailers require suppliers to hold a GFSI (Global Food Safety Initiative) recognized certificate.',
            'Standalone ISO 22000 was not accepted by GFSI on its own because it lacked detailed sector-specific PRP rules and specific GFSI requirements (like Food Fraud, Food Defense, and Logo control).',
            'Therefore, the Foundation FSSC created FSSC 22000—making it a fully GFSI-benchmarked scheme built on top of ISO 22000!'
          ],
          keyTakeaway:
            'FSSC 22000 gives you both an ISO-based management system AND full GFSI global recognition.'
        },
        {
          slideNumber: 2,
          title: 'The 3-Pillar Formula of FSSC 22000',
          subtitle: 'How the 3 Standards Combine Into One Certification',
          bulletPoints: [
            'Every FSSC 22000 certified site must comply with 3 documents simultaneously:',
            'Pillar 1 — ISO 22000:2018: The core Food Safety Management System (Clauses 4 to 10 & HACCP).',
            'Pillar 2 — Sector-Specific PRP Standard (ISO/TS 22002 series): e.g., ISO/TS 22002-1 for Food Manufacturing, ISO/TS 22002-2 for Catering, ISO/TS 22002-4 for Packaging, or ISO/TS 22002-5 for Storage/Transport.',
            'Pillar 3 — FSSC 22000 Additional Requirements (Part 2, Clauses 2.5.1 to 2.5.18): Mandatory GFSI rules added by Foundation FSSC.'
          ],
          keyTakeaway:
            'FSSC 22000 = ISO 22000:2018 + ISO/TS 22002-x (PRPs) + FSSC Additional Requirements (2.5.1–2.5.18).'
        },
        {
          slideNumber: 3,
          title: 'FSSC 22000 Food Chain Categories (ISO 22003-1)',
          subtitle: 'Knowing Which Category Applies to Your Site',
          bulletPoints: [
            'Category C — Food Manufacturing: Divided into C1 (Perishable animal products: meat/dairy/fish), C2 (Perishable plant products: fruits/veg), C3 (Perishable mixed animal & plant ready meals), and C4 (Ambient stable products: biscuits, flour, sugar, oil, beverages, canned goods).',
            'Category D — Animal Feed Production.',
            'Category E — Catering (Hotels, hospitals, central kitchens, flight catering).',
            'Category F — Trading, Wholesale & E-Commerce.',
            'Category G — Transport & Cold/Dry Storage Services.',
            'Category I — Production of Food Packaging Materials.',
            'Category K — Production of Bio/Chemicals (Food additives, vitamins, processing aids).'
          ],
          keyTakeaway:
            'Your FSSC 22000 audit scope and ISO/TS 22002 PRP standard depend directly on your Food Chain Category.'
        },
        {
          slideNumber: 4,
          title: 'The 3-Year FSSC Audit Cycle & Unannounced Audits',
          subtitle: 'Initial Certification, Surveillance & Recertification',
          bulletPoints: [
            'Year 1 (Initial Certification): Stage 1 Audit (Document readiness review) + Stage 2 Audit (Full on-site operational audit).',
            'Year 2 & Year 3: Annual Surveillance Audits (no more than 12 months apart).',
            'Mandatory Unannounced Rule: At least ONE of the two Surveillance Audits in every 3-year cycle MUST be completely unannounced!',
            'Year 4: Full Recertification Audit before the 3-year certificate expires.'
          ],
          keyTakeaway:
            'In every 3-year FSSC 22000 cycle, at least one surveillance audit happens completely unannounced.'
        },
        {
          slideNumber: 5,
          title: 'Overview of FSSC Additional Requirements (Clauses 2.5.1 to 2.5.18)',
          subtitle: 'The 18 Extra Topics Every FSSC Site Must Implement',
          bulletPoints: [
            '2.5.1 Management of Services & Purchased Materials | 2.5.2 Product Labeling & Printed Materials',
            '2.5.3 Food Defense (TACCP) | 2.5.4 Food Fraud Mitigation (VACCP)',
            '2.5.5 Logo Use | 2.5.6 Management of Allergens',
            '2.5.7 Environmental Monitoring | 2.5.8 Food Safety and Quality Culture',
            '2.5.9 Quality Control | 2.5.10 Transport, Storage & Warehousing',
            '2.5.11 Hazard Control & Cross-Contamination | 2.5.12 PRP Verification',
            '2.5.13 Product Design & Development | 2.5.14 Health Status (Feed) | 2.5.15 Equipment Management | 2.5.16 Food Loss and Waste | 2.5.17 Communication Requirements | 2.5.18 Multi-Site.'
          ],
          keyTakeaway:
            'Modules 2, 3, and 4 break down each of these FSSC Additional Requirements in simple, practical detail.'
        }
      ]
    },
    {
      id: 'fssc-mod-2',
      moduleNumber: 2,
      title: 'Sector PRPs (ISO/TS 22002-1) & FSSC Clauses 2.5.1 (Services/Materials) and 2.5.2 (Labeling)',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on ISO/TS 22002-1 Prerequisite Programs and the first two FSSC Additional Requirements: 2.5.1 Management of Services & Purchased Materials (ISO 17025 Labs, Emergency Procurement, Recycled Packaging) and 2.5.2 Product Labeling & Artwork Control.',
      internationalClauses: [
        'ISO/TS 22002-1 & FSSC Part 2 Clauses 2.5.1 and 2.5.2'
      ],
      keyPrinciples: [
        'ISO/TS 22002-1 defines strict factory PRP standards for site perimeter, internal layout, utilities (potable water, filtered air, food-grade boiler steam), waste, equipment, maintenance, purchasing, cross-contamination, cleaning, pest control, and personal hygiene.',
        'FSSC Clause 2.5.1 requires using ISO/IEC 17025 accredited laboratories (or proficiency-tested labs) for food safety testing, documenting an Emergency Procurement procedure, and verifying food-safety compliance of recycled packaging.',
        'FSSC Clause 2.5.2 requires product labels to comply with all legal and allergen rules in the country of intended sale, plus strict artwork approval and packing line-clearance procedures.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Laboratory Competence Requirement (FSSC Clause 2.5.1 a)',
          standardLimit: 'External/internal labs used for food safety verification must hold ISO/IEC 17025 accreditation or participate in proficiency testing',
          correctiveProtocol: 'Keep copies of external lab ISO 17025 accreditation scopes on file before sending pathogen/chemical samples.'
        },
        {
          parameter: 'Product Labeling & Artwork Line-Clearance (FSSC Clause 2.5.2)',
          standardLimit: 'Labels verified against country-of-sale allergen/legal laws; signed line-clearance before and after every packing run',
          correctiveProtocol: 'Remove 100% of previous batch labels/film from the packing line before starting a changeover.'
        }
      ],
      practicalChecklist: [
        'Verify that external laboratories hold valid ISO/IEC 17025 certificates covering the exact tests they perform for you.',
        'Check that a documented Emergency Supplier Procurement procedure is in place (Clause 2.5.1).',
        'Audit packing lines to confirm signed Label Verification & Line-Clearance checks are completed on every batch (Clause 2.5.2).'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Key Highlights of ISO/TS 22002-1 (Manufacturing PRPs)',
          subtitle: 'Utilities, Air, Water, Steam & Cross-Contamination',
          bulletPoints: [
            'Water & Ice: Potable drinking water quality tested regularly; non-potable water pipes (fire/cooling) must be clearly color-coded with zero cross-connection to potable water.',
            'Boiler Chemicals & Culinary Steam: If steam touches food directly, boiler water additives must be approved food-grade chemicals.',
            'Compressed Air & Gases: Filtered to remove oil, water, and microbes (using oil-free compressors and micron filters at point of use).',
            ' Pest Control: Electric Fly Killers (EFKs) must be sticky glue-board units (high-voltage zappers that shatter insects are prohibited in food zones) placed > 3 meters away from open food.'
          ],
          keyTakeaway:
            'High-voltage electric "zapper" fly killers are banned over food areas in ISO/TS 22002-1—always use sticky glue-board UV units.'
        },
        {
          slideNumber: 2,
          title: 'FSSC 2.5.1: Management of Services & Purchased Materials',
          subtitle: 'Lab Accreditation, Emergency Buying & Animal Slaughter Inspection',
          bulletPoints: [
            'Lab Testing Competence (2.5.1 a): Where lab analysis is used for food safety verification/validation, it must be conducted by an ISO/IEC 17025 accredited lab (or a lab participating in proficiency testing programs).',
            'Emergency Procurement (2.5.1 b): You must have a documented procedure for purchasing raw materials/packaging in emergency situations to ensure products still meet specifications and supplier evaluation happens before use.',
            'Recycled Packaging: Verify legal/food-grade safety when recycled paper/plastic is used in food packaging.'
          ],
          keyTakeaway:
            'Always keep your external laboratory’s ISO/IEC 17025 scope certificate in your FSSC audit folder.'
        },
        {
          slideNumber: 3,
          title: 'FSSC 2.5.2: Product Labeling & Printed Materials',
          subtitle: 'Complying With Country-of-Sale Laws & Stopping Label Mix-Ups',
          bulletPoints: [
            'Country of Intended Sale (2.5.2 a): Finished products must be labeled according to all statutory and regulatory requirements (especially Allergen & Nutrition labeling) in the destination country where the product will be sold!',
            'Unlabeled Bulk Products: If you ship bulk tankers or unprinted industrial bags, provide the allergen and legal specification sheet directly to the customer.',
            'Artwork & Line-Clearance Procedure: Implement a strict procedure for approving new label artwork, destroying obsolete labels, and performing signed Line-Clearance checks on the packing line (including barcode/vision scanner checks).'
          ],
          keyTakeaway:
            'If you export to the UK, EU, GCC, or USA, your label must comply with the exact allergen laws of that destination country.'
        },
        {
          slideNumber: 4,
          title: 'FSSC 2.5.5: FSSC 22000 Logo Use Rules',
          subtitle: 'Where You CAN and CANNOT Put the FSSC 22000 Logo',
          bulletPoints: [
            'Certified companies are allowed to use the FSSC 22000 Logo on marketing brochures, websites, business cards, and letterheads.',
            'STRICT PROHIBITION: You must NEVER print the FSSC 22000 Logo (or state FSSC certification) directly on a food product label, primary packaging, or secondary retail box!',
            'Why? Because FSSC 22000 certifies your Management System, not the individual food pack—putting the logo on a product pack misleads consumers.'
          ],
          keyTakeaway:
            'Never print the FSSC 22000 logo on a product pack or label—doing so is an immediate audit non-conformity!'
        }
      ]
    },
    {
      id: 'fssc-mod-3',
      moduleNumber: 3,
      title: 'FSSC Clauses 2.5.3 (Food Defense), 2.5.4 (Food Fraud), 2.5.6 (Allergens) & 2.5.7 (Environmental Monitoring)',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on the four high-priority risk clauses of FSSC 22000: Food Defense / TACCP (2.5.3), Food Fraud Mitigation / VACCP (2.5.4), Management of Allergens (2.5.6), and Environmental Monitoring / EMP (2.5.7).',
      internationalClauses: [
        'FSSC 22000 Part 2 Clauses 2.5.3, 2.5.4, 2.5.6, and 2.5.7'
      ],
      keyPrinciples: [
        'Clause 2.5.3 (Food Defense / TACCP) requires a documented Threat Assessment to identify potential intentional sabotage threats and a Food Defense Plan inside the FSMS.',
        'Clause 2.5.4 (Food Fraud / VACCP) requires a documented Vulnerability Assessment for all raw materials/packaging to identify economically motivated adulteration risks and a Food Fraud Mitigation Plan.',
        'Clause 2.5.6 (Management of Allergens) requires a list of all allergens handled on site, risk assessment of cross-contact, control measures (segregation/cleaning/labeling), and annual validation/verification.',
        'Clause 2.5.7 (Environmental Monitoring) requires a risk-based pathogen/spoilage swabbing program across Zones 1 to 4 to verify cleaning effectiveness.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Food Defense (2.5.3) & Food Fraud (2.5.4) Plans',
          standardLimit: 'Documented Threat Assessment (TACCP) + Vulnerability Assessment (VACCP) covering 100% of raw materials/site areas, reviewed annually',
          correctiveProtocol: 'Update TACCP and VACCP plans immediately whenever a new raw material, supplier, or emerging fraud/security alert occurs.'
        },
        {
          parameter: 'Allergen Management & Validation (FSSC Clause 2.5.6)',
          standardLimit: 'Site allergen list + cross-contact risk assessment + validated cleaning + precautionary ("May contain") labeling only if scientifically justified',
          correctiveProtocol: 'Train all personnel in allergen awareness at least annually and retain training records.'
        }
      ],
      practicalChecklist: [
        'Check that both the Food Defense Plan (2.5.3) and Food Fraud Mitigation Plan (2.5.4) have been reviewed within the last 12 months.',
        'Verify that all raw materials AND food-contact packaging are included in the VACCP Food Fraud Vulnerability Assessment.',
        'Confirm that the Allergen Management Plan (2.5.6) and Zone 1–4 Environmental Monitoring Program (2.5.7) are active and reviewed annually.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'FSSC 2.5.3: Food Defense (TACCP)',
          subtitle: 'Two-Step Requirement: Threat Assessment + Food Defense Plan',
          bulletPoints: [
            'Step A — Threat Assessment: Conduct and document a Food Defense Threat Assessment using a defined methodology (like TACCP or CARVER+Shock) to identify and evaluate potential intentional threats (sabotage, tampering, cyber-attack, disgruntled insider, external intruder).',
            'Step B — Food Defense Plan: For all significant threats identified, specify and implement mitigation measures (CCTV, keycard access, locked chemical/water tanks, tamper-evident tanker seals).',
            'The Food Defense Plan must be supported by the FSMS, comply with legislation, and be kept up to date.'
          ],
          keyTakeaway:
            'Clause 2.5.3 requires BOTH a documented Threat Assessment AND an active Food Defense Plan integrated into your FSMS.'
        },
        {
          slideNumber: 2,
          title: 'FSSC 2.5.4: Food Fraud Mitigation (VACCP)',
          subtitle: 'Two-Step Requirement: Vulnerability Assessment + Mitigation Plan',
          bulletPoints: [
            'Step A — Vulnerability Assessment: Conduct and document a Food Fraud Vulnerability Assessment (using SSAFE or PAS 96) to identify potential vulnerabilities for Economically Motivated Adulteration (EMA), substitution, dilution, counterfeit, or mislabeling.',
            'Crucial Note: Your VACCP assessment must cover ALL raw materials, ingredients, AND primary food-contact packaging!',
            'Step B — Food Fraud Mitigation Plan: Implement control measures (approved manufacturer sourcing, COA authenticity testing, mass-balance checks) for all significant vulnerabilities.'
          ],
          keyTakeaway:
            'Do not forget to include food-contact packaging materials in your Clause 2.5.4 Food Fraud Vulnerability Assessment!'
        },
        {
          slideNumber: 3,
          title: 'FSSC 2.5.6: Management of Allergens',
          subtitle: 'Strict Rules in FSSC v6/v7 for Allergen Control',
          bulletPoints: [
            'Maintain a documented list of all allergens handled on site (including raw materials, processing aids, and finished products).',
            'Conduct a Risk Assessment covering all potential sources of allergen cross-contact.',
            'Implement control measures to reduce or eliminate cross-contact (segregated storage, dedicated Purple tools, production scheduling, and validated allergen cleaning).',
            'Precautionary Allergen Labeling ("May contain traces of..."): Can ONLY be used if a thorough risk assessment proves cross-contact cannot be eliminated despite full GMPs—it must NEVER be used as an excuse for poor cleaning!'
          ],
          keyTakeaway:
            'Under FSSC 2.5.6, all personnel must receive Allergen Awareness Training, and the Allergen Plan must be reviewed at least annually.'
        },
        {
          slideNumber: 4,
          title: 'FSSC 2.5.7: Environmental Monitoring Program (EMP)',
          subtitle: 'Risk-Based Pathogen & Spoilage Swabbing',
          bulletPoints: [
            'Implement a risk-based Environmental Monitoring Program (Zones 1 to 4) for relevant pathogens (e.g., Listeria spp. / L. monocytogenes in wet/chilled plants; Salmonella in dry plants) and spoilage/indicator organisms (Enterobacteriaceae, Total Plate Count, Yeasts/Molds).',
            'Document a written EMP procedure defining: Target organisms, sample locations (mapped on floor plan), swabbing frequency, lab methods, action limits, and mandatory corrective action when a positive or upward trend is found.',
            'Review the EMP at least annually and whenever new equipment, building works, or positive results occur.'
          ],
          keyTakeaway:
            'Building renovations or roof leaks inside a factory are major triggers to increase Environmental Monitoring swabs immediately.'
        }
      ]
    },
    {
      id: 'fssc-mod-4',
      moduleNumber: 4,
      title: 'FSSC Clauses 2.5.8 to 2.5.16: Culture, Quality Control, Equipment & Food Loss/Waste',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on the newer FSSC v6/v7 Additional Requirements: Food Safety & Quality Culture (2.5.8), Quality Control & Legal Weight/Volume (2.5.9), Transport & Tanker Cleaning (2.5.10), Cross-Contamination & Foreign Body Controls (2.5.11), Equipment Management (2.5.15), and Food Loss & Waste (2.5.16).',
      internationalClauses: [
        'FSSC 22000 Part 2 Clauses 2.5.8, 2.5.9, 2.5.10, 2.5.11, 2.5.12, 2.5.13, 2.5.15, and 2.5.16'
      ],
      keyPrinciples: [
        'Clause 2.5.8 (Food Safety and Quality Culture) requires a documented Culture Plan with measurable objectives, timelines, and employee feedback covering communication, training, behavioral measurement, and management review.',
        'Clause 2.5.9 (Quality Control) embeds systematic quality parameters, start-up/line-changeover checks, and legal net weight/volume control directly into the FSSC audit.',
        'Clause 2.5.15 (Equipment Management) requires hygienic design specifications BEFORE buying new equipment and a risk-based Change Management process for commissioning.',
        'Clause 2.5.16 (Food Loss and Waste) requires a documented policy and measurable objectives to reduce food waste, safely manage charity donations, and prevent diversion of unsafe waste into the food chain.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Food Safety & Quality Culture Plan (FSSC Clause 2.5.8)',
          standardLimit: 'Documented Culture Plan with measurable targets, timelines, staff survey/feedback, training, and Management Review evaluation',
          correctiveProtocol: 'Ensure the Culture Plan addresses both Food Safety AND Quality across all departments.'
        },
        {
          parameter: 'Hygienic Equipment Specification & Commissioning (FSSC Clause 2.5.15)',
          standardLimit: 'Written hygienic design specification prepared BEFORE purchasing new equipment + supplier proof + commissioning validation',
          correctiveProtocol: 'Never install a new food machine without a pre-purchase hygienic specification and QA commissioning sign-off.'
        }
      ],
      practicalChecklist: [
        'Verify that your site has a documented Food Safety & Quality Culture Plan with measurable targets and timelines (Clause 2.5.8).',
        'Check that Net Weight / Volume metrological checks and startup quality checks are logged under Clause 2.5.9.',
        'Confirm that Equipment Hygienic Specifications (2.5.15) and Food Loss & Waste targets (2.5.16) are documented.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'FSSC 2.5.8: Food Safety and Quality Culture',
          subtitle: 'Mandatory Written Culture Plan with Objectives & Timelines',
          bulletPoints: [
            'Under FSSC v6/v7 Clause 2.5.8, top management must establish, implement, and maintain a Food Safety and Quality Culture Objective(s) as part of the management system.',
            'Your documented Food Safety & Quality Culture Plan must address 4 core elements:',
            '• Communication (open reporting, safety briefings, suggestion boxes).',
            '• Training (coaching, culture workshops).',
            '• Employee Feedback and Engagement (anonymous culture surveys, floor walks).',
            '• Performance Measurement of defined activities covering all sections of the organization, supported by timelines and reviewed in Management Review.'
          ],
          keyTakeaway:
            'Clause 2.5.8 requires a written Culture Plan with timelines and measurable objectives—not just a poster on the wall.'
        },
        {
          slideNumber: 2,
          title: 'FSSC 2.5.9: Quality Control & Legal Weight/Volume Checks',
          subtitle: 'Integrating Quality Parameters Into Your FSSC Audit',
          bulletPoints: [
            'FSSC v6/v7 expanded the scheme to include Quality Control (Clause 2.5.9):',
            '• Establish a Quality Policy and measurable Quality Objectives alongside Food Safety.',
            '• Define, monitor, and record Quality Parameters (Brix, pH, color, viscosity, bake profile, sensory) in line with finished product specifications.',
            '• Legal Metrology (Net Weight & Volume Control): Implement a procedure to verify that pack weights/volumes meet legal label declarations using calibrated checkweighers or statistical weight logs.',
            '• Perform and record Line Start-Up and Line Changeover checks.'
          ],
          keyTakeaway:
            'FSSC auditors now inspect your Net Weight / Volume logs and Quality Control checks under Clause 2.5.9!'
        },
        {
          slideNumber: 3,
          title: 'FSSC 2.5.10, 2.5.11 & 2.5.12: Tankers, Foreign Bodies & PRP Inspections',
          subtitle: 'Strengthened Operational Controls on the Floor',
          bulletPoints: [
            'Clause 2.5.10 (Transport, Storage & Bulk Tankers): When receiving or shipping in bulk tankers, verify tanker cleaning certificates (prior load restriction + CIP wash certificate) and prevents cross-contamination.',
            'Clause 2.5.11 (Foreign Matter & Cross-Contamination): Conduct a documented risk assessment to determine the need for magnets, metal detectors, X-ray equipment, filters, and sieves.',
            'Clause 2.5.12 (PRP Verification): Conduct routine (e.g., monthly) site hygiene and PRP inspections to verify that building, equipment, and personal hygiene standards are maintained.'
          ],
          keyTakeaway:
            'Never unload a bulk liquid tanker without first checking its Previous Load History and Validated Tanker Wash Certificate.'
        },
        {
          slideNumber: 4,
          title: 'FSSC 2.5.13 & 2.5.15: Product Design & Hygienic Equipment Management',
          subtitle: 'Designing Out Risks Before Buying or Launching',
          bulletPoints: [
            'Clause 2.5.13 (Product Design & Development): For any new product or recipe modification, validate shelf life, safe cooking instructions, and impact on existing allergen/process lines (including ongoing shelf-life verification during commercial life).',
            'Clause 2.5.15 (Equipment Management):',
            '• Before purchasing new equipment, write a Hygienic Design Specification covering hygienic materials, cleanability, and legal rules.',
            '• Obtain written evidence from the equipment manufacturer that the machine meets your specification BEFORE installation.',
            '• Execute a risk-based commissioning and change-management sign-off before running commercial food.'
          ],
          keyTakeaway:
            'Under Clause 2.5.15, you must write a Hygienic Design Specification BEFORE buying any new food processing equipment.'
        },
        {
          slideNumber: 5,
          title: 'FSSC 2.5.16: Food Loss and Waste',
          subtitle: 'Sustainability + Safe Charity Donation Rules',
          bulletPoints: [
            'Aligned with UN Sustainable Development Goals, Clause 2.5.16 requires:',
            '• A documented Policy and measurable Objectives outlining the organization’s strategy to reduce Food Loss and Waste inside the facility and supply chain.',
            '• Safe Donation Controls: Any surplus food donated to charities/food banks must be stored, handled, and tracked safely so it remains 100% wholesome.',
            '• By-Products & Animal Feed: Surplus food sent for animal feed must be protected from contamination and never diverted illegally back into human food.'
          ],
          keyTakeaway:
            'Track monthly food waste %, set a reduction target, and ensure any charity food donations meet full cold-chain and safety rules.'
        }
      ]
    },
    {
      id: 'fssc-mod-5',
      moduleNumber: 5,
      title: 'FSSC Clause 2.5.17 (CB Communication), Nonconformity Grading & Audit Readiness',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on FSSC Clause 2.5.17 (3-Working-Day Mandatory Notification to the Certification Body), how FSSC grades Minor, Major, and Critical Nonconformities, the strict 28-Day CAPA Closure Deadline, and passing your FSSC audit.',
      internationalClauses: [
        'FSSC 22000 Part 2 Clause 2.5.17 & Part 3 Audit Nonconformity Rules'
      ],
      keyPrinciples: [
        'FSSC Clause 2.5.17 requires notifying your Certification Body (CB) within 3 working days of any serious event (public recall, regulatory action, outbreak, disaster, or fraud/legal investigation).',
        'FSSC Audit Nonconformities are graded as Minor, Major, or Critical.',
        'Under FSSC 22000 rules, for both Minor and Major Nonconformities, the certified site MUST submit objective evidence of Correction, Root Cause Analysis, and Corrective Action Plan within ≤ 28 calendar days of the last day of the audit!',
        'Failing to close a Major Nonconformity within 28 calendar days results in immediate suspension of the FSSC 22000 certificate.'
      ],
      criticalControlParameters: [
        {
          parameter: '3-Working-Day Certification Body Notification Rule (Clause 2.5.17)',
          standardLimit: 'Notify the Certification Body within ≤ 3 working days of any serious event, recall, regulatory enforcement, or disaster',
          correctiveProtocol: 'Include the Certification Body email/phone on the Crisis Management Team emergency contact sheet.'
        },
        {
          parameter: '28-Calendar-Day Audit Nonconformity Closure Rule',
          standardLimit: 'All Minor and Major audit nonconformities closed with Correction + RCA + CAPA evidence within ≤ 28 calendar days',
          correctiveProtocol: 'Submit CAPA evidence to the auditor by Day 20 so there is time for auditor review before Day 28.'
        }
      ],
      practicalChecklist: [
        'Add the 3-Working-Day Certification Body notification requirement (Clause 2.5.17) into your Crisis & Recall SOP.',
        'Memorize the strict 28-Calendar-Day deadline for closing Minor and Major FSSC audit findings.',
        'Complete all 5 modules and take the 40-MCQ FSSC 22000 v7 Awareness Final Exam.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'FSSC 2.5.17: Communication Requirements With Your Certification Body',
          subtitle: 'The Mandatory 3-Working-Day Notification Rule',
          bulletPoints: [
            'Under Clause 2.5.17, the organization MUST inform its Certification Body (e.g., SGS, Bureau Veritas, DNV, Intertek, LRQA) within 3 WORKING DAYS of the commencement of any serious event that impacts the FSMS, legality, or integrity of certification:',
            '• Public food safety recalls or withdrawals.',
            '• Regulatory enforcement notices, fines, or legal proceedings regarding food safety.',
            '• Natural or man-made disasters (fires, floods, cyber-attacks, wars) halting safe production.',
            '• Serious situations where the integrity of FSSC certification is at risk (food fraud or outbreak).'
          ],
          keyTakeaway:
            'Memorize the number: 3 Working Days to notify your Certification Body of any recall, regulatory notice, or serious crisis!'
        },
        {
          slideNumber: 2,
          title: 'How FSSC 22000 Grades Audit Nonconformities',
          subtitle: 'Minor vs. Major vs. Critical Findings',
          bulletPoints: [
            'Minor Nonconformity: Does not affect the capability of the management system to achieve intended food safety outcomes (e.g., an isolated documentation gap).',
            'Major Nonconformity: Negatively affects the capability of the management system to achieve intended outcomes (e.g., missing validation of a CCP, uncalibrated CCP probes, or failure to follow an allergen changeover SOP).',
            'Critical Nonconformity: Direct food safety impact occurs without proper action by the organization, OR when legality/certification integrity is at stake (e.g., falsified CCP logs or shipping contaminated product).'
          ],
          keyTakeaway:
            'FSSC 22000 does NOT issue "Observations" or "Opportunities for Improvement (OFIs)" as soft substitutes for real nonconformities.'
        },
        {
          slideNumber: 3,
          title: 'The Strict 28-Calendar-Day Closure Rule in FSSC 22000',
          subtitle: 'Missing This Deadline Suspends Your Certificate!',
          bulletPoints: [
            'FSSC 22000 has one of the strictest audit closure timelines in the world:',
            '• For a MINOR Nonconformity: Submit objective evidence of Correction, Root Cause Analysis (RCA), and a Corrective Action Plan (CAPA) for auditor approval within 28 CALENDAR DAYS of the last day of the audit.',
            '• For a MAJOR Nonconformity: Submit full Correction, RCA, and objective evidence of implemented CAPA within 28 CALENDAR DAYS (failure to close a Major NC by Day 28 results in immediate Certificate Suspension!).',
            '• For a CRITICAL Nonconformity: The certificate is suspended immediately (for up to 6 months) and a follow-up on-site audit is required.'
          ],
          keyTakeaway:
            'Remember: 28 Calendar Days is the absolute deadline to close Minor and Major nonconformities in FSSC 22000!'
        },
        {
          slideNumber: 4,
          title: 'Complete FSSC 22000 Audit Readiness Summary',
          subtitle: 'Final Checklist & Course Completion',
          bulletPoints: [
            'You have completed all 5 Modules of the FSSC 22000 v7 Awareness Certificate:',
            '• 3-Component Formula: ISO 22000:2018 + ISO/TS 22002-x + FSSC Additional Requirements (2.5.1–2.5.18).',
            '• Core GFSI Pillars: TACCP (2.5.3), VACCP (2.5.4), Allergens (2.5.6), Environmental Monitoring (2.5.7), Culture (2.5.8), Quality Control (2.5.9), Equipment Management (2.5.15), and Food Waste (2.5.16).',
            '• Key Timelines: 1 Unannounced Audit per 3-year cycle, 3 Working Days CB notification, and 28 Calendar Days NC closure.'
          ],
          keyTakeaway:
            'Click below to start the 40-MCQ FSSC 22000 v7 Awareness Final Exam (60% passing score = 24/40 correct)!'
        }
      ]
    }
  ],
  coreExamPool: [
    {
      q: 'What are the 3 mandatory components that make up the FSSC 22000 certification scheme?',
      options: [
        '1) ISO 22000:2018 + 2) Sector-Specific PRPs (ISO/TS 22002 series) + 3) FSSC 22000 Additional Requirements (Clauses 2.5.1–2.5.18)',
        'Only a local municipal trade license',
        'Only ISO 9001 and ISO 14001',
        'Only a financial balance sheet'
      ],
      correctIndex: 0,
      explanation: 'FSSC 22000 is built on three pillars: ISO 22000:2018, the relevant ISO/TS 22002 PRP standard, and the FSSC 22000 Additional Requirements.'
    },
    {
      q: 'Under FSSC 22000 rules, how often must a certified site undergo a mandatory Unannounced Surveillance Audit?',
      options: [
        'At least once in every 3-year certification cycle',
        'Once every 20 years',
        'Never — all FSSC audits are announced',
        'Every week'
      ],
      correctIndex: 0,
      explanation: 'FSSC 22000 requires at least one surveillance audit in every 3-year certification cycle to be conducted unannounced.'
    },
    {
      q: 'Under FSSC 22000 Additional Requirement 2.5.5 (Logo Use), is a certified food manufacturer allowed to print the FSSC 22000 logo directly on its retail food packaging or product label?',
      options: [
        'No — the FSSC 22000 logo must NEVER be printed on a product label or retail packaging (as it certifies the management system, not the individual product)',
        'Yes — it must be printed on the front of every biscuit packet',
        'Yes — if printed in red ink',
        'Logo use is not regulated'
      ],
      correctIndex: 0,
      explanation: 'FSSC Clause 2.5.5 strictly prohibits using the FSSC 22000 logo on products, product labels, or primary/secondary retail packaging.'
    },
    {
      q: 'Under FSSC 22000 Clause 2.5.17 (Communication Requirements), within how many days must a certified organization notify its Certification Body of a product recall, regulatory action, or serious crisis?',
      options: [
        'Within 3 working days',
        'Within 90 days',
        'Within 1 year',
        'Notification is not required'
      ],
      correctIndex: 0,
      explanation: 'FSSC Clause 2.5.17 requires notifying the Certification Body within 3 working days of any serious event or recall.'
    },
    {
      q: 'What is the strict maximum deadline to submit Correction, Root Cause Analysis, and Corrective Action evidence to close a Minor or Major Nonconformity raised during an FSSC 22000 audit?',
      options: [
        'Within 28 calendar days from the last day of the audit',
        'Within 6 months',
        'Within 12 months',
        'No deadline applies'
      ],
      correctIndex: 0,
      explanation: 'Under FSSC 22000 rules, all Minor and Major nonconformities must be closed within 28 calendar days from the last day of the audit, or the certificate is suspended.'
    },
    {
      q: 'Which new FSSC Additional Requirements were introduced/expanded in FSSC 22000 v6/v7 under Clauses 2.5.8, 2.5.9, 2.5.15, and 2.5.16?',
      options: [
        'Food Safety & Quality Culture (2.5.8), Quality Control & Legal Weight/Volume (2.5.9), Hygienic Equipment Management (2.5.15), and Food Loss & Waste (2.5.16)',
        'Social Media Advertising and Office Interior Design',
        'Vehicle Car Wash and Parking Lot Striping',
        'None of the above'
      ],
      correctIndex: 0,
      explanation: 'Clauses 2.5.8 (Culture), 2.5.9 (Quality Control), 2.5.15 (Equipment Management), and 2.5.16 (Food Loss & Waste) are core FSSC Additional Requirements.'
    }
  ]
};

export const ISO_9001_22000_FSSC_COURSES: InternationalTrainingCourse[] = [
  ISO_9001_AWARENESS_COURSE,
  ISO_22000_AWARENESS_COURSE,
  FSSC_22000_V7_AWARENESS_COURSE
];

export const ISO_9001_22000_FSSC_HUB_TRAININGS: HubTraining[] =
  ISO_9001_22000_FSSC_COURSES.map(buildHubTrainingFromCourse);
