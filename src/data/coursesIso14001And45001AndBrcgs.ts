import { InternationalTrainingCourse } from './internationalTrainingsData';
import {
  buildHubTrainingFromCourse,
  normalizeRawSlideCourse
} from './coursesHaccp3And4';
import { HubTraining } from '../types/hub';

export const BRCGS_ISSUE_09_COURSE: InternationalTrainingCourse = normalizeRawSlideCourse({
  id: 'cert-2026-brcgs-issue-09-awareness',
  code: 'BRCGS-I9-AW',
  title: 'BRCGS Food Safety Issue 09 Awareness Certificate',
  subtitle: 'Global Standard for Food Safety Issue 9 — Product Safety Culture, HACCP, Site Standards & Audit Readiness',
  category: 'International Certification',
  level: 'Professional',
  durationHours: 24,
  totalModules: 5,
  examQuestionsCount: 40,
  passingScorePercent: 60,
  certificateTitle: 'Certified BRCGS Food Safety Issue 09 Awareness Professional',
  accreditationStandard: 'BRCGS Global Standard for Food Safety Issue 09 / GFSI Benchmark',
  targetAudience: ['Food Quality Managers', 'Production & Warehouse Supervisors', 'Internal Auditors', 'Packaging & Processing Teams'],
  overview: 'A clear, practical 05-Module slide presentation training covering all 9 sections of BRCGS Food Safety Issue 09, Fundamental Clauses, Product Safety Culture, High-Risk/High-Care Zoning, Foreign Body Prevention, and Unannounced Audit Readiness.',
  learningOutcomes: [
    'Understand the 9 Sections and 12 Fundamental Clauses of BRCGS Food Safety Issue 09',
    'Implement the BRCGS Product Safety Culture Plan and Senior Management Commitment',
    'Manage Production Risk Zones (High-Risk, High-Care, Ambient High-Care, Low-Risk)',
    'Control Labelling, Pack Verification, Foreign Body Detection, and Traceability within 4 hours',
    'Prepare the site for Announced, Blended, and Mandatory Unannounced BRCGS Audits'
  ],
  modules: [
    {
      moduleNumber: 1,
      title: 'Module 01: Introduction to BRCGS Issue 09 & Fundamental Clauses',
      estimatedMinutes: 60,
      learningObjectives: [
        'Explain the structure of BRCGS Food Safety Issue 09',
        'Identify the 12 Fundamental Clauses where major failure blocks certification',
        'Build a compliant Product Safety Culture Action Plan'
      ],
      summary: 'Covers the structure of BRCGS Issue 09, GFSI benchmarking, the 12 Fundamental Clauses, and Clause 1.1.2 Food Safety & Quality Culture.',
      keyTakeaways: [
        'BRCGS Issue 09 contains 9 Core Sections and 12 Fundamental Clauses.',
        'Failure of a Fundamental Clause results in non-certification or immediate suspension.',
        'Clause 1.1.2 requires a multi-year Product Safety Culture Plan reviewed annually.'
      ],
      practiceScenario: 'An auditor asks how your factory measures Food Safety Culture under Clause 1.1.2. You present employee survey results, near-miss reporting metrics, and behavior walk-through records.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'What is BRCGS Food Safety Issue 09?',
          subtitle: 'Module 01 • Global Retail & Brand Recognition',
          bullets: [
            'BRCGS stands for Brand Reputation through Compliance Global Standards.',
            'Issue 09 (published August 2022, audits started February 2023) is GFSI-benchmarked.',
            'Required by major global retailers, fast-food chains, and foodservice brands worldwide.',
            'Focuses on product safety, authenticity, legality, and quality.'
          ],
          Example: 'A sauce manufacturer holding BRCGS Issue 09 Grade AA+ can supply international supermarket chains without separate retailer audits.',
          keyPoint: 'BRCGS Issue 09 covers four pillars: Food Safety, Product Authenticity, Legality, and Quality.'
        },
        {
          slideNumber: 2,
          title: 'The 9 Core Sections of BRCGS Issue 09',
          subtitle: 'Module 01 • Standard Architecture',
          bullets: [
            'Section 1: Senior Management Commitment & Product Safety Culture.',
            'Section 2: The Food Safety Plan — HACCP (based on Codex Alimentarius).',
            'Section 3: Food Safety & Quality Management System (Document Control, Traceability, VACCP/TACCP).',
            'Section 4: Site Standards (Layout, Hygiene, Maintenance, Pest Management, Foreign Body Control).',
            'Sections 5 to 9: Product Control, Process Control, Personnel, Production Risk Zones, and Traded Products.'
          ],
          Example: 'If a site buys finished products strictly for resale without processing them, Section 9 (Traded Products) applies.',
          keyPoint: 'Sections 1 to 7 apply to all manufacturing sites; Sections 8 and 9 apply based on specific risk zones or traded goods.'
        },
        {
          slideNumber: 3,
          title: 'The 12 Fundamental Clauses Explained',
          subtitle: 'Module 01 • Zero-Tolerance Foundation',
          bullets: [
            'BRCGS designates 12 clauses as "Fundamental" marked with a star icon in the standard.',
            'Includes: Senior Management Commitment (1.1), HACCP (2), Internal Audits (3.4), Supplier Approval (3.5.1), Corrective Actions (3.7), Traceability (3.9).',
            'Also includes: Layout & Product Flow (4.3), Housekeeping & Hygiene (4.11), Allergen Management (5.3), Control of Operations (6.1), Labelling & Pack Control (6.2), Training (7.1).',
            'A Critical or Major non-conformity against a Fundamental Clause prevents certification.'
          ],
          Example: 'Failure to verify label changes on a packing line violates Fundamental Clause 6.2 (Labelling and Pack Control).',
          keyPoint: 'All 12 Fundamental Clauses must be continuously maintained every day on the shop floor.'
        },
        {
          slideNumber: 4,
          title: 'Clause 1.1.2: Product Safety & Quality Culture',
          subtitle: 'Module 01 • Key Update in Issue 09',
          bullets: [
            'Senior management must define and maintain a clear plan for developing product safety culture.',
            'The plan must cover all sections of the site that impact product safety.',
            'Activities must include clear communication, training, employee feedback, and behavior measurement.',
            'Senior management must review the effectiveness of culture activities at least annually.'
          ],
          Example: 'Holding monthly "Quality Champions" huddles and anonymous food safety suggestion boxes with visible management action.',
          keyPoint: 'Product safety culture in Issue 09 focuses on observable behaviours, not just posters on walls.'
        },
        {
          slideNumber: 5,
          title: 'Management Review & Resource Allocation (Clause 1.1)',
          subtitle: 'Module 01 • Leadership Accountability',
          bullets: [
            'The most senior operational manager on site must attend the opening and closing BRCGS audit meetings.',
            'Management Review meetings must be held at least annually to evaluate objectives, complaints, recalls, and audit results.',
            'Site management must provide adequate financial, technical, and staffing resources.',
            'There must be a clear organizational chart showing deputies for all key food safety roles.'
          ],
          Example: 'When the QA Manager is on leave, a trained Deputy QA Manager is formally designated to sign off product release.',
          keyPoint: 'Every key food safety position must have a documented, competent deputy.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 2,
      title: 'Module 02: Food Safety Plan (HACCP) & Management System (Sections 2 & 3)',
      estimatedMinutes: 60,
      learningObjectives: [
        'Align the HACCP plan with Section 2 of BRCGS Issue 09',
        'Execute Internal Audits across at least 4 different audit dates per year',
        'Complete vertical and horizontal traceability tests within 4 hours'
      ],
      summary: 'Explains Section 2 (Codex HACCP requirements in BRCGS) and Section 3 (Internal Audits, Supplier Approval, VACCP Food Fraud, TACCP Food Defence, Traceability, and Recall).',
      keyTakeaways: [
        'Internal audits must be scheduled throughout the year (at least 4 different audit dates).',
        'Traceability tests (forward and backward + mass balance) must be completed within 4 hours.',
        'Significant food safety incidents or regulatory notices must be reported to the Certification Body within 3 working days.'
      ],
      practiceScenario: 'During an audit, the auditor picks a retail pack of biscuits from the warehouse and starts a stopwatch. Your team must trace all raw material batches, packaging reels, processing records, and customer shipments within 4 hours.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Section 2: The Food Safety Plan (HACCP)',
          subtitle: 'Module 02 • Codex Alimentarius Alignment',
          bullets: [
            'BRCGS Section 2 follows the 12 Codex HACCP steps (5 preliminary steps + 7 principles).',
            'The HACCP team leader must have in-depth HACCP training and demonstrate competence.',
            'Prerequisite programs (PRPs), process flow diagrams, hazard analysis, and CCPs must be verified at least annually.',
            'Any change in raw materials, recipe, equipment, or packaging triggers a HACCP review before launch.'
          ],
          Example: 'Installing a new high-speed pouch filler requires verifying the heat-sealing CCP and updating the flow diagram on site.',
          keyPoint: 'Process flow diagrams must be verified by walking the actual production line at least once a year.'
        },
        {
          slideNumber: 2,
          title: 'Internal Audits & Hygiene Inspections (Clause 3.4)',
          subtitle: 'Module 02 • Year-Round Verification',
          bullets: [
            'Internal audits must be spread across the year on at least 4 separate audit dates (not all done in one month).',
            'Every clause of the BRCGS standard and all production activities must be audited at least once a year.',
            'Auditors must be trained and independent of the area being audited.',
            'Separate monthly Fabrication & Hygiene inspections must check walls, floors, drains, and equipment condition.'
          ],
          Example: 'Creating an annual audit programme covering Q1 (Sections 1-2), Q2 (Sections 3-4), Q3 (Sections 5-6), and Q4 (Sections 7-8).',
          keyPoint: 'Auditing the entire standard in the week before the external BRCGS audit is a non-conformity.'
        },
        {
          slideNumber: 3,
          title: 'Supplier Approval & Raw Material Authenticity (Clause 3.5)',
          subtitle: 'Module 02 • VACCP & Supply Chain Control',
          bullets: [
            'Every raw material and primary packaging supplier must undergo risk assessment and formal approval.',
            'Approved suppliers hold GFSI-benchmarked certificates or undergo supplier audits/questionnaires.',
            'Vulnerability Assessment (VACCP) identifies raw materials at risk of economic adulteration, substitution, or fraud.',
            'When buying through brokers or agents, the site must still know the identity of the actual manufacturer/processor.'
          ],
          Example: 'Knowing both the broker name and the actual manufacturing mill for imported cocoa powder or spices.',
          keyPoint: 'Buying from a broker without knowing the actual manufacturer of the ingredient violates BRCGS Clause 3.5.'
        },
        {
          slideNumber: 4,
          title: 'Traceability within 4 Hours & Mass Balance (Clause 3.9)',
          subtitle: 'Module 02 • Fundamental Clause Requirement',
          bullets: [
            'The site must trace all raw material lots (including primary packaging) from supplier to finished product and customer.',
            'Traceability must work in both directions (backward from finished good and forward from raw material) within 4 hours.',
            'Annual traceability tests must include a Mass Balance (quantity check) comparing input weight vs output + waste.',
            'Rework must maintain full traceability back to its original production batch.'
          ],
          Example: 'If 1,000 kg of organic flour is received, mass balance reconciles how many kg went into finished bread, rework, warehouse stock, and sweepings.',
          keyPoint: 'Target time for full traceability and mass balance in BRCGS is a maximum of 4 hours.'
        },
        {
          slideNumber: 5,
          title: 'Root Cause Analysis, Recalls & 3-Day Notification',
          subtitle: 'Module 02 • Clauses 3.7 & 3.11',
          bullets: [
            'Root Cause Analysis (RCA) is mandatory for non-conformities, customer complaints trends, and CCP failures.',
            'Mock product recall exercises must be carried out at least annually, including out-of-hours contact checks.',
            'In the event of an actual product recall or regulatory food safety enforcement notice, the Certification Body (CB) must be notified within 3 working days.',
            'The site must then provide full RCA Details within 21 calendar days.'
          ],
          Example: 'If a product is recalled due to undeclared milk allergen, the site emails its BRCGS Certification Body within 3 working days.',
          keyPoint: 'Always remember the 3-Working-Day rule for notifying your Certification Body of recalls or regulatory notices.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 3,
      title: 'Module 03: Site Standards, Foreign Body & Hygiene Controls (Section 4)',
      estimatedMinutes: 60,
      learningObjectives: [
        'Apply Site Security and Food Defence (TACCP) controls',
        'Manage Glass, Brittle Plastic, Metal Detectors, X-Ray, Sieves, and Magnets',
        'Enforce Environmental Monitoring (EMP) for Listeria and Salmonella'
      ],
      summary: 'Covers Section 4 of BRCGS Issue 09: Site Security, Equipment Hygienic Design, Maintenance, Housekeeping, Glass/Brittle Plastic Registers, Metal Detection, and Environmental Monitoring.',
      keyTakeaways: [
        'Glass and brittle plastic in open product areas must be listed on a register and inspected at defined frequencies.',
        'Metal detectors must have fail-safe reject systems, locked reject bins, and regular test piece checks (Fe, Non-Fe, SS).',
        'Risk-based Environmental Monitoring Programs (Clause 4.11.8) are mandatory for open product areas.'
      ],
      practiceScenario: 'During a line walk, an operator notices a cracked plastic gauge cover above an open mixing bowl. You stop the line, quarantine the batch in the bowl, inspect surrounding area under the glass/brittle breakage procedure, and replace the cover before restarting.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Site Security & Food Defence — TACCP (Clause 4.2)',
          subtitle: 'Module 03 • Protecting Against Intentional Contamination',
          bullets: [
            'Threat Assessment Critical Control Point (TACCP) evaluates risks of malicious contamination or sabotage.',
            'External perimeters, raw material intake bays, water tanks, and silos must be locked and access-controlled.',
            'Visitors and contractors must sign in, show ID, and learn site food safety rules before entering.',
            'Staff are trained to challenge unidentified or unauthorized individuals in production areas.'
          ],
          Example: 'Keeping external bulk liquid sugar intake valves locked in a security box that only QA/Receiving staff can unlock.',
          keyPoint: 'External storage silos, water tanks, and intake pipes must always be physically locked.'
        },
        {
          slideNumber: 2,
          title: 'Equipment Commissioning & Maintenance Hygiene (Clauses 4.6 & 4.7)',
          subtitle: 'Module 03 • Issue 09 Enhanced Equipment Controls',
          bullets: [
            'Issue 09 expanded Clause 4.6 on Hygienic Equipment Design and purchase specifications.',
            'New or Second-hand equipment must undergo formal hygienic inspection and food safety commissioning before use.',
            'Temporary repairs (using tape, wire, string, or cardboard) are strictly prohibited.',
            'After any engineering maintenance on a line, a documented Hygiene Clearance sign-off is required before production restarts.'
          ],
          Example: 'After a technician replaces a conveyor bearing, all bolts and tools are counted out, the belt is sanitized, and QA signs the Hygiene Handover form.',
          keyPoint: 'No tape, string, or cardboard temporary fixes are ever allowed in a BRCGS factory.'
        },
        {
          slideNumber: 3,
          title: 'Glass, Brittle Plastic, Ceramics & Wood Control (Clause 4.9)',
          subtitle: 'Module 03 • Preventing Physical Contamination',
          bullets: [
            'Glass and hard brittle plastic must be excluded from open product areas wherever possible.',
            'Remaining essential items (light diffusers, sight glasses, clock faces, pest units) must be recorded on a Glass & Brittle Plastic Register.',
            'Regular documented inspections check every item on the register for cracks or damage.',
            'Clean, undamaged wooden pallets are acceptable only where there is no risk of product splinters; open product zones use plastic/metal.'
          ],
          Example: 'Inspecting all 42 items on the Packaging Hall Glass Register every week and immediately logging any scratched plastic guard.',
          keyPoint: 'Any breakage of glass or brittle plastic near open product requires immediate line stop and product quarantine.'
        },
        {
          slideNumber: 4,
          title: 'Foreign Body Detection: Filters, Sieves, Magnets & Metal Detectors (Clause 4.10)',
          subtitle: 'Module 03 • Critical Physical Barriers',
          bullets: [
            'Filters and sieves used for food safety must be inspected at a defined frequency (e.g., every shift) for tears or damage.',
            'Metal detectors or X-ray units must be installed unless a documented risk assessment justifies an alternative.',
            'Metal detector checks use Ferrous, Non-Ferrous, and Stainless Steel test pieces passed with product packs.',
            'Automated reject mechanisms (air-blast, pusher arm, belt stop) must divert rejected packs into a locked bin.'
          ],
          Example: 'Passing a 1.5mm Fe, 2.0mm Non-Fe, and 2.5mm SS test card at start of run, hourly, batch change, and end of run.',
          keyPoint: ' testing not only checks that the metal detector alarms, but that the physical reject arm actually kicks the pack into the locked bin.'
        },
        {
          slideNumber: 5,
          title: 'Environmental Monitoring & Pest Management (Clauses 4.11.8 & 4.14)',
          subtitle: 'Module 03 • Pathogen & Pest Barriers',
          bullets: [
            'Environmental Monitoring Program (EMP) tests food contact (Zone 1) and non-food contact surfaces (Zones 2–4) for pathogens/indicators.',
            'Drains, wheels, undersides of conveyors, and chillers are prime targets for Listeria spp. swabbing.',
            'Pest control requires regular contractor inspections AND in-house staff awareness.',
            'Toxic rodent bait stations are prohibited inside open production/storage areas to prevent bait contamination.'
          ],
          Example: 'Using non-toxic snap traps or monitoring blocks inside raw material warehouses and toxic bait only in secured external perimeter boxes.',
          keyPoint: 'Toxic loose rodenticides must never be placed inside areas where open food or ingredients are handled.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 4,
      title: 'Module 04: Product Control, Labelling Verification & Risk Zones (Sections 5, 6, 7 & 8)',
      estimatedMinutes: 60,
      learningObjectives: [
        'Prevent the #1 cause of recalls using BRCGS Clause 6.2 Labelling & Pack Control',
        'Control Allergens and Product Authenticity/Claims (Halal, Organic, Gluten-Free)',
        'Understand High-Risk, High-Care, and Ambient High-Care Production Risk Zones'
      ],
      summary: 'Explains Section 5 (Allergens, Claims, Lab Testing), Section 6 (Process Control, Labelling & Pack Verification), Section 7 (Personnel Hygiene & Protective Clothing), and Section 8 (Production Risk Zones).',
      keyTakeaways: [
        'Incorrect packaging/labelling is the single largest cause of product recalls globally (Fundamental Clause 6.2).',
        'Every production run requires documented line clearance to remove all previous labels and packaging.',
        'High-Risk and High-Care zones require strict barrier changing procedures for footwear and protective clothing.'
      ],
      practiceScenario: 'A line finishes packing "Peanut Butter Cookies" and switches to "Plain Butter Cookies". Under Clause 5.3 and Clause 6.2, the line undergoes full allergen wet cleaning, protein swab verification, removal of all Peanut Cookie film reels back to store, and barcode scanner verification of the new film reel.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Allergen Management & Identity Preserved Claims (Clauses 5.3 & 5.4)',
          subtitle: 'Module 04 • Protecting Allergic Consumers & Brand Integrity',
          bullets: [
            'Sites must map all allergens handled on site and prevent cross-contact during storage, weighing, production, and packing.',
            'Rework containing allergens can only be used in products that already contain that exact same allergen.',
            'When a product makes a special claim (Organic, Halal, Kosher, Vegan, Free-From, Protected Origin), mass balance must be verified at least every 6 months.',
            'Allergen cleaning procedures must be validated (proven to work) and verified before switching to a non-allergen product.'
          ],
          Example: 'Conducting a 6-monthly mass balance calculation comparing Organic Raw Almond purchases against Organic Almond Butter sales.',
          keyPoint: 'Validated allergen cleaning and strict label verification are mandatory to prevent undeclared allergen recalls.'
        },
        {
          slideNumber: 2,
          title: 'Fundamental Clause 6.2: Labelling & Pack Control',
          subtitle: 'Module 04 • Preventing Wrong-Packaging Recalls',
          bullets: [
            'Before starting any packing run, a formal Line Clearance check ensures all packaging from the previous run is removed.',
            'Only the authorized packaging for the current product is issued to the line.',
            'Checks at start of run, every reel change, and hourly verify: Product Name, Artwork Version, Allergen Statement, Date Code, and Barcode.',
            'Where online vision cameras or barcode scanners are used, their fail-safe rejection must be tested at start and end of run.'
          ],
          Example: 'Physically attaching a snippet of the printed film reel and date code to the QC check sheet at the start of the shift and after every splice.',
          keyPoint: 'Never allow two different product labels or film reels to sit side-by-side at a packing machine.'
        },
        {
          slideNumber: 3,
          title: 'Quantity, Weight, Volume & Equipment Calibration (Clauses 6.3 & 6.4)',
          subtitle: 'Module 04 • Legal Metrology & Accuracy',
          bullets: [
            'Checkweighers and volume fillers ensure packs meet legal weight/volume regulations in the country of sale.',
            'All measuring devices critical to food safety and legality (thermometers, scales, pH meters, timers) must be calibrated.',
            'Calibration must be traceable to a recognized national or international standard.',
            'If a thermometer is found out of calibration (+2.5°C error), all batches measured since its last good check must be risk-assessed.'
          ],
          Example: 'Testing the working line thermometer daily against a certified reference thermometer in ice slurry (0°C) and boiling water (100°C).',
          keyPoint: 'Out-of-calibration instruments require a retroactive safety evaluation of products produced since the last passed check.'
        },
        {
          slideNumber: 4,
          title: 'Personnel Hygiene, Medical Screening & Protective Clothing (Section 7)',
          subtitle: 'Module 04 • People as Food Safety Guardians',
          bullets: [
            'All staff, visitors, and contractors must complete medical screening before entering open food areas.',
            'Watches, rings (except a plain wedding band if site policy allows), earrings, visible piercings, false fingernails, and perfume are prohibited.',
            'Blue metal-detectable plasters must be used for any skin cuts and tested through the site metal detector.',
            'Protective clothing must have no external pockets above the waist and no sewn-on buttons.'
          ],
          Example: 'Every shift, QA tests one strip from the first-aid box of blue detectable plasters through the line metal detector and logs it.',
          keyPoint: 'Protective coats in food handling areas must never have external upper pockets or buttons that can fall into product.'
        },
        {
          slideNumber: 5,
          title: 'Section 8: Production Risk Zones (High-Risk & High-Care)',
          subtitle: 'Module 04 • Zoning for Ready-to-Eat (RTE) Foods',
          bullets: [
            'Low-Risk Areas: Foods that require cooking by the consumer (raw meat, dry pasta) or ambient stable products.',
            'High-Care Areas: Chilled/frozen Ready-to-Eat foods that underwent a pathogen reduction step (e.g., washed salad, sandwiches).',
            'High-Risk Areas: Chilled/frozen Ready-to-Eat foods that have had a full cook step (≥70°C for 2 min) and are vulnerable to recontamination before packing.',
            'High-Risk/High-Care entry requires physical barrier benches, captive footwear changes, full garment change, and filtered air overpressure.'
          ],
          Example: 'Workers stepping over a physical sit-on barrier bench to remove factory shoes on the "dirty side" and put on captive white boots on the "High-Risk cooked meat side".',
          keyPoint: 'High-Risk zones require complete physical segregation and captive footwear/equipment that never leaves the zone.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 5,
      title: 'Module 05: BRCGS Audit Protocol, Grading & Unannounced Readiness',
      estimatedMinutes: 60,
      learningObjectives: [
        'Differentiate between Critical, Major, and Minor non-conformities and BRCGS Grades (AA+ to D)',
        'Understand the Mandatory 1-in-3 Year Unannounced Audit rule in Issue 09',
        'Close out audit non-conformities within 28 calendar days'
      ],
      summary: 'Covers the BRCGS Issue 09 Audit Protocol, Non-Conformity classification, Grading table (AA, A, B, C, D and "+" for unannounced), the mandatory unannounced audit cycle, and 28-day corrective action closure.',
      keyTakeaways: [
        'Every certified site must have at least 1 Unannounced Audit every 3 years under Issue 09.',
        'The auditor must be on the factory shop floor within 30 minutes of arriving on site for an unannounced audit.',
        'All non-conformities must be closed with root cause and preventive evidence within 28 calendar days.'
      ],
      practiceScenario: 'At 8:15 AM on a Tuesday, a BRCGS Auditor arrives unannounced at your reception gate. Security verifies their BRCGS Auditor ID card, notifies the QA Lead, and escorts the auditor directly onto the production floor by 8:35 AM (within the mandatory 30-minute window).',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'BRCGS Audit Options & Mandatory Unannounced Rule',
          subtitle: 'Module 05 • Issue 09 Audit Protocol',
          bullets: [
            'Announced Audit: Scheduled date agreed in advance (Note: must still have 1 unannounced audit every 3 years!).',
            'Blended Audit: Part 1 is remote document review; Part 2 is on-site physical factory audit within 28 days.',
            'Unannounced Audit Programme: Auditor arrives unannounced within the last 4 months of the audit cycle; earns a "+" on the grade (e.g., AA+).',
            'Refusing entry to an unannounced BRCGS auditor results in immediate suspension of the site certificate.'
          ],
          Example: 'A site choosing the Announced programme has announced audits in Year 1 and Year 2, and a mandatory Unannounced audit in Year 3.',
          keyPoint: 'Under Issue 09 (and GFSI rules), every site undergoes at least one Unannounced Audit every 3 years.'
        },
        {
          slideNumber: 2,
          title: 'The 30-Minute Shop Floor Rule',
          subtitle: 'Module 05 • Starting the Unannounced Audit',
          bullets: [
            'In an unannounced audit, the inspection of the production floor begins within 30 minutes of the auditor arriving at the site.',
            'Reception and security staff must have a clear "Auditor Arrival Procedure" ready on the front desk.',
            'PPE (visitor coat, hairnet, safety shoes) in all sizes must be stocked and ready at reception.',
            'At Least 50% of the total audit duration is spent on the factory floor inspecting operations, hygiene, and interviewing operators.'
          ],
          Example: 'Keeping an "Unannounced Audit Ready Box" at reception containing clean coats, beard snoods, hairnets, and a laminated contact list.',
          keyPoint: 'Train security guards and receptionists so the auditor reaches the production floor within 30 minutes of arrival.'
        },
        {
          slideNumber: 3,
          title: 'Non-Conformity Levels & BRCGS Grading (AA to D)',
          subtitle: 'Module 05 • How Audit Grades Are Calculated',
          bullets: [
            'Critical Non-Conformity: Direct threat to food safety or legality → Immediate fail / certificate withdrawal.',
            'Major Non-Conformity: Substantial failure to meet the intent of a clause.',
            'Minor Non-Conformity: A clause is not fully met, but product safety is not compromised.',
            'Grade AA (or AA+): 5 or fewer Minors (0 Majors). Grade A (or A+): 6 to 10 Minors (0 Majors). Grade B (or B+): 11 to 16 Minors OR 1 Major + up to 10 Minors.'
          ],
          Example: 'A site receiving 4 Minor non-conformities and 0 Majors during an unannounced audit achieves the highest rating: Grade AA+.',
          keyPoint: 'To achieve Grade AA or AA+, a site must have Zero Majors and 5 or fewer Minors.'
        },
        {
          slideNumber: 4,
          title: 'Closing Non-Conformities within 28 Calendar Days',
          subtitle: 'Module 05 • Post-Audit Certification Process',
          bullets: [
            'After the audit closing meeting, the site has 28 calendar days (14 days for initial certification in some cases) to submit evidence.',
            'For every non-conformity, the site must submit: 1) Immediate Correction, 2) Root Cause Analysis (5-Whys), and 3) Preventive Action Plan.',
            'Documentary evidence includes photos, updated SOPs, training attendance sheets, and completed check logs.',
            'If acceptable evidence is not submitted within 28 days, certification is not granted and a full re-audit is required.'
          ],
          Example: 'For a minor NC on a missing calibration sticker, submitting a photo of the calibrated scale, a 5-Why RCA, and a revised monthly calibration checklist.',
          keyPoint: 'Simply fixing the symptom is not enough—BRCGS requires documented Root Cause Analysis and systemic Preventive Action within 28 days.'
        }
      ],
      sections: [],
      quiz: []
    }
  ]
});

export const ISO_14001_AWARENESS_COURSE: InternationalTrainingCourse = normalizeRawSlideCourse({
  id: 'cert-2026-iso-14001-awareness',
  code: 'ISO-14001-AW',
  title: 'ISO 14001 Awareness Certificate',
  subtitle: 'ISO 14001:2015 Environmental Management Systems (EMS) — Aspects, Impacts, Waste Control & Sustainability',
  category: 'International Certification',
  level: 'Foundation & Intermediate',
  durationHours: 16,
  totalModules: 5,
  examQuestionsCount: 40,
  passingScorePercent: 60,
  certificateTitle: 'Certified ISO 14001:2015 Environmental Management System (EMS) Awareness Professional',
  accreditationStandard: 'ISO 14001:2015 Environmental Management Systems Standard',
  targetAudience: ['HSE Officers', 'Plant & Facility Managers', 'Production Supervisors', 'Sustainability & Quality Teams'],
  overview: 'A comprehensive 05-Module slide presentation course on ISO 14001:2015 covering Environmental Aspects & Impacts, Life Cycle Perspective, Compliance Obligations, Waste Hierarchy, Spill Emergency Response, and Environmental Performance Auditing.',
  learningOutcomes: [
    'Understand the purpose and Clauses 4–10 of ISO 14001:2015 Environmental Management Systems',
    'Distinguish clearly between Environmental Aspects (Cause) and Environmental Impacts (Effect)',
    'Evaluate Significant Environmental Aspects across Normal, Abnormal, and Emergency conditions',
    'Apply the Waste Management Hierarchy, Wastewater (ETP) Controls, and Chemical Spill Response',
    'Monitor Environmental KPIs, Compliance Obligations, and Internal EMS Audits'
  ],
  modules: [
    {
      moduleNumber: 1,
      title: 'Module 01: Introduction to ISO 14001:2015 & EMS Fundamentals',
      estimatedMinutes: 45,
      learningObjectives: [
        'Explain the goal of an Environmental Management System (EMS)',
        'Describe the High-Level Structure (Clauses 4 to 10) and PDCA Cycle in ISO 14001',
        'Identify the three core commitments of an Environmental Policy'
      ],
      summary: 'Introduces ISO 14001:2015, sustainable development, the PDCA cycle, Context of the Organization, and the mandatory commitments of an ISO 14001 Environmental Policy.',
      keyTakeaways: [
        'ISO 14001:2015 helps organizations protect the environment, fulfill legal compliance obligations, and improve environmental performance.',
        'Every ISO 14001 Environmental Policy must contain 3 commitments: Protect the environment/prevent pollution, Fulfill compliance obligations, and Continual improvement.'
      ],
      practiceScenario: 'During an ISO 14001 awareness walkthrough, an auditor asks an operator how their daily work supports the Environmental Policy. The operator explains turning off idle conveyors to save electricity and segregating plastic waste.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'What is ISO 14001:2015?',
          subtitle: 'Module 01 • Global Environmental Management Standard',
          bullets: [
            'ISO 14001:2015 is the international standard for an Environmental Management System (EMS).',
            'Published by the International Organization for Standardization (ISO) and adopted globally.',
            'Applies to any organization—manufacturing plants, food factories, hospitals, offices, and logistics hubs.',
            'Helps organizations grow sustainably while reducing pollution, waste, energy use, and environmental fines.'
          ],
          Example: 'A beverage bottling plant using ISO 14001 to reduce water usage from 2.5 liters of water per liter of beverage down to 1.6 liters.',
          keyPoint: 'ISO 14001 is about systematically managing how your organization interacts with the air, water, land, and natural resources.'
        },
        {
          slideNumber: 2,
          title: 'The Three Pillars of an ISO 14001 EMS',
          subtitle: 'Module 01 • Core Purpose of the Standard',
          bullets: [
            'Pillar 1: Enhancement of Environmental Performance (reducing resource consumption, emissions, and waste).',
            'Pillar 2: Fulfillment of Compliance Obligations (meeting all environmental laws, permits, and customer requirements).',
            'Pillar 3: Achievement of Environmental Objectives (setting and hitting measurable sustainability targets).',
            'Uses the Plan-Do-Check-Act (PDCA) cycle across Clauses 4 to 10.'
          ],
          Example: 'Meeting local EPA wastewater discharge limits (Compliance) while cutting electricity use by 8% (Performance & Objective).',
          keyPoint: 'Legal compliance is the minimum baseline in ISO 14001; continual environmental improvement is the ongoing goal.'
        },
        {
          slideNumber: 3,
          title: 'Context of the Organization & Interested Parties (Clause 4)',
          subtitle: 'Module 01 • Understanding Environmental Conditions',
          bullets: [
            'Clause 4.1 examines external and internal issues, including environmental conditions affecting the site (climate, water scarcity, air quality).',
            'Clause 4.2 identifies Interested Parties: Environmental Regulators (EPA), Local Community/Neighbors, Customers, Employees, Investors.',
            'Any voluntary agreement with a neighbor or customer that the company chooses to adopt becomes a binding "Compliance Obligation".',
            'Clause 4.3 defines the physical and operational boundaries (Scope) of the EMS.'
          ],
          Example: 'If a factory promises nearby residents not to run noisy delivery trucks between 11 PM and 6 AM, that promise becomes a Compliance Obligation.',
          keyPoint: 'In ISO 14001, "Compliance Obligations" include both mandatory environmental laws AND voluntary commitments made by the company.'
        },
        {
          slideNumber: 4,
          title: 'Leadership & The Environmental Policy (Clause 5)',
          subtitle: 'Module 01 • Three Mandatory Policy Commitments',
          bullets: [
            'Top Management must establish, sign, and communicate an Environmental Policy (Clause 5.2).',
            'Commitment 1: Commitment to the protection of the environment, including prevention of pollution.',
            'Commitment 2: Commitment to fulfill the organization’s compliance obligations (legal and other requirements).',
            'Commitment 3: Commitment to continual improvement of the EMS to enhance environmental performance.'
          ],
          Example: 'Displaying the Environmental Policy at site entrances and making it publicly available on the company website for external stakeholders.',
          keyPoint: 'Unlike the Quality Policy, the Environmental Policy MUST be made available to the public / external interested parties.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 2,
      title: 'Module 02: Environmental Aspects, Impacts & Life Cycle Perspective (Clause 6)',
      estimatedMinutes: 50,
      learningObjectives: [
        'Differentiate clearly between an Environmental Aspect (Cause) and Impact (Effect)',
        'Assess aspects under Normal, Abnormal, and Emergency operating conditions',
        'Apply a Life Cycle Perspective from raw material sourcing to end-of-life disposal'
      ],
      summary: 'Explains Clause 6.1.2 (Environmental Aspects & Impacts), Significance Scoring, Normal/Abnormal/Emergency conditions, Life Cycle Perspective, and Compliance Obligations (Clause 6.1.3).',
      keyTakeaways: [
        'Environmental Aspect = element of an organization’s activities/products that interacts with the environment (The Cause).',
        'Environmental Impact = any change to the environment, whether adverse or beneficial, resulting from an aspect (The Effect).',
        'Aspects must be evaluated across Normal, Abnormal (startup/maintenance), and Emergency (fire/spill) situations.'
      ],
      practiceScenario: 'You are preparing the Aspect-Impact Register for the Boiler Room. Burning natural gas is the Activity; Flue gas emission (CO2, NOx) is the Environmental Aspect; Air pollution / climate change is the Environmental Impact.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Environmental Aspect vs. Environmental Impact',
          subtitle: 'Module 02 • Cause and Effect Relationship (Clause 6.1.2)',
          bullets: [
            'Activity / Process: What we do (e.g., Operating a steam boiler, Washing processing tanks, Running air compressors).',
            'Environmental Aspect (THE CAUSE): How the activity interacts with the environment (e.g., Emission of stack gases, Discharge of alkaline wastewater, Consumption of electricity).',
            'Environmental Impact (THE EFFECT): The resulting change to the environment (e.g., Air pollution/global warming, Water contamination, Depletion of natural resources).',
            'Impacts can be Adverse (negative, like chemical spill) or Beneficial (positive, like planting trees or recycling water).'
          ],
          Example: 'Activity: Forklift battery charging → Aspect: Electricity consumption & hydrogen gas release → Impact: Resource depletion & explosion hazard.',
          keyPoint: 'Always remember: Aspect = Cause (interaction with environment); Impact = Effect (change to the environment).'
        },
        {
          slideNumber: 2,
          title: 'Normal, Abnormal & Emergency Conditions',
          subtitle: 'Module 02 • Complete Operational Assessment',
          bullets: [
            'ISO 14001 requires identifying aspects across three operating conditions:',
            '1. Normal Conditions: Routine day-to-day production, standard office operations, regular wastewater treatment.',
            '2. Abnormal Conditions: Startup and shutdown of boilers, annual deep cleaning, filter regeneration, maintenance overhauls.',
            '3. Emergency Conditions: Chemical tank rupture, ammonia refrigerant leak, transformer oil fire, ETP overflow during heavy flood.'
          ],
          Example: 'Boiler soot-blowing during monthly maintenance produces much higher dust emissions than normal daily operation—this is an Abnormal aspect.',
          keyPoint: 'Many severe environmental incidents happen during Abnormal (maintenance/startup) or Emergency conditions, so all three must be assessed.'
        },
        {
          slideNumber: 3,
          title: 'Determining "Significant" Environmental Aspects',
          subtitle: 'Module 02 • Risk Scoring & Prioritization',
          bullets: [
            'Organizations use objective scoring criteria to decide which aspects are "Significant" (SEAs).',
            'Criteria typically include: Severity of environmental damage, Frequency/Probability, Quantity/Scale, Duration, and Legal/Regulatory status.',
            'Any aspect regulated by an environmental law or permit limit is automatically prioritized.',
            'Every Significant Environmental Aspect (SEA) MUST have operational controls, monitoring, or an improvement objective.'
          ],
          Example: 'Ammonia storage in the refrigeration plant scores high on Severity and Legal status, making it a Significant Environmental Aspect requiring leak detectors and emergency drills.',
          keyPoint: 'Employees working in an area must know the Significant Environmental Aspects of their specific job.'
        },
        {
          slideNumber: 4,
          title: 'Life Cycle Perspective & Compliance Obligations',
          subtitle: 'Module 02 • Clauses 6.1.2 & 6.1.3',
          bullets: [
            'ISO 14001:2015 requires thinking beyond the factory walls using a Life Cycle Perspective (Cradle-to-Grave).',
            'Stages include: Raw material acquisition → Design & Production → Transportation/Delivery → Product Use → End-of-Life Disposal/Recycling.',
            'While a full numerical Life Cycle Assessment (LCA) is not mandatory, you must consider stages you can control or influence.',
            'Compliance Obligations Register (Legal Register) tracks all environmental permits, air/noise/water limits, and hazardous waste licenses.'
          ],
          Example: 'Redesigning product packaging from non-recyclable multi-layer foil to recyclable mono-material PE film reduces end-of-life landfill impact.',
          keyPoint: 'Life Cycle Perspective means considering environmental impacts before raw materials arrive and after the customer finishes the product.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 3,
      title: 'Module 03: Operational Controls, Waste Hierarchy & Pollution Prevention (Clauses 7 & 8)',
      estimatedMinutes: 50,
      learningObjectives: [
        'Apply the 5-step Waste Management Hierarchy (Prevent, Reduce, Reuse, Recycle, Dispose)',
        'Control Hazardous Waste, Secondary Containment (110% Rule), and Effluent Treatment (ETP)',
        'Manage Environmental Controls for Contractors and Procurement'
      ],
      summary: 'Covers Clause 7 (Competence, Awareness, Communication) and Clause 8.1 (Operational Planning & Control: Waste Hierarchy, Hazardous Chemicals, Bunding/Secondary Containment, Wastewater & Air Emissions).',
      keyTakeaways: [
        'The Waste Hierarchy prioritizes Prevention and Reduction first, followed by Reuse, Recycling, Energy Recovery, and Disposal last.',
        'Liquid chemical and oil storage tanks require Secondary Containment (bund walls/drip trays) holding at least 110% of the largest tank volume.'
      ],
      practiceScenario: 'You inspect the chemical drum storage yard and find five 200-liter caustic soda drums sitting directly on bare soil near a rainwater drain. You immediately relocate the drums onto a bunded spill pallet inside a covered chemical store away from storm drains.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'The 5-Step Waste Management Hierarchy',
          subtitle: 'Module 03 • Best Practice Resource Efficiency',
          bullets: [
            '1. Prevention / Reduce (Most Preferred): Avoid generating waste at source (optimize cutting patterns, stop overproduction).',
            '2. Reuse: Use materials again for the same or different purpose (returnable plastic crates, IBC totes, wooden pallets).',
            '3. Recycle / Compost: Reprocess materials into new products (cardboard baling, scrap metal, organic food waste to compost/biogas).',
            '4. Energy Recovery: Generate heat or electricity from non-recyclable waste.',
            '5. Disposal / Landfill (Least Preferred): Safe disposal only when no higher option is possible.'
          ],
          Example: 'Switching from single-use cardboard shipping boxes to returnable collapsible plastic crates with a dairy supplier eliminates 40 tons of waste per year.',
          keyPoint: 'Always start at the top of the Waste Hierarchy: preventing waste is far better than paying to recycle or dispose of it.'
        },
        {
          slideNumber: 2,
          title: 'Hazardous Waste & Color-Coded Segregation',
          subtitle: 'Module 03 • Safe Handling from Source to Licensed Disposal',
          bullets: [
            'Non-hazardous waste (paper, cardboard, clean plastic, food scraps) must never be mixed with hazardous waste.',
            'Hazardous waste includes: Used lubricant oil, chemical containers, oily rags, laboratory reagents, e-waste, batteries, fluorescent tubes.',
            'Hazardous waste must be stored in labeled, covered, weatherproof, and bunded areas.',
            'Disposal of hazardous waste is permitted ONLY through government-licensed hazardous waste contractors with a Waste Manifest.'
          ],
          Example: 'Keeping a signed Hazardous Waste Manifest certificate on file for every shipment of used compressor oil sent to an EPA-approved recycler.',
          keyPoint: 'Mixing one oily chemical rag into a bin of recyclable cardboard contaminates the entire load into hazardous waste.'
        },
        {
          slideNumber: 3,
          title: 'Chemical Storage & The 110% Secondary Containment Rule',
          subtitle: 'Module 03 • Preventing Soil & Water Contamination',
          bullets: [
            'All liquid chemicals, fuels, oils, and liquid waste must have Secondary Containment (bund walls or spill pallets).',
            'Standard engineering rule: Bund capacity must hold at least 110% of the volume of the largest container stored inside it.',
            'Safety Data Sheets (SDS) must be available at the point of storage and use, including Section 6 (Accidental Release) and Section 12/13 (Ecology/Disposal).',
            'Stormwater drains (rainwater) must be clearly marked and protected so no chemical wash-water ever enters them.'
          ],
          Example: 'A 1,000-liter diesel tank sits inside a concrete bund wall capable of holding at least 1,100 liters with its drain valve locked shut.',
          keyPoint: 'Rainwater/storm drains flow directly to rivers or soil—never pour wash-water, oils, or chemicals into a storm drain.'
        },
        {
          slideNumber: 4,
          title: 'Wastewater (ETP), Air Emissions & Contractor Control',
          subtitle: 'Module 03 • Clause 8.1 Operational Controls',
          bullets: [
            'Process wastewater must flow to an Effluent Treatment Plant (ETP) before discharge, monitoring pH, BOD, COD, TSS, and Oil & Grease.',
            'Air emission controls include boiler stack scrubbers/filters, generator maintenance, and preventing ozone-depleting refrigerant leaks.',
            'Contractors working on site (painters, welders, cleaners, construction crews) must follow the site’s ISO 14001 rules.',
            'Procurement checks environmental requirements before buying new chemicals or machinery.'
          ],
          Example: 'Requiring an external painting contractor to take back all empty paint tins and thinner cans rather than dumping them in factory bins.',
          keyPoint: 'Your site is legally and environmentally responsible for the actions of contractors working on your premises.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 4,
      title: 'Module 04: Emergency Preparedness & Spill Response (Clause 8.2)',
      estimatedMinutes: 45,
      learningObjectives: [
        'Identify potential environmental emergencies (spills, leaks, fires, ETP failure)',
        'Use a Spill Response Kit using the STOP-CONTAIN-CLEAN-DISPOSE sequence',
        'Conduct and evaluate periodic environmental emergency drills'
      ],
      summary: 'Explains Clause 8.2 Emergency Preparedness and Response, Spill Kits, managing firewater runoff, and revising emergency plans after drills or incidents.',
      keyTakeaways: [
        'Spill response follows: Assess Safety (PPE) → Stop the Source → Contain the Spill (protect drains) → Clean Up → Dispose as Hazardous Waste.',
        'Emergency plans must be tested periodically through practical drills and reviewed after any drill or real incident.'
      ],
      practiceScenario: 'A forklift punctures a 25-liter drum of phosphoric acid near an outdoor yard drain. The trained spill team puts on chemical gloves/goggles, places a drain cover mat over the storm drain immediately, surrounds the liquid with absorbent socks, absorbs the spill with pads, places used pads into a yellow hazardous waste bag, and restocks the spill kit.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Identifying Environmental Emergencies (Clause 8.2)',
          subtitle: 'Module 04 • Preparing Before an Incident Happens',
          bullets: [
            'Organizations must establish procedures to prepare for and respond to potential environmental emergencies.',
            'Common environmental emergencies: Chemical or fuel spill, toxic gas/ammonia leak, fire & contaminated firewater runoff, ETP overflow.',
            'Also includes natural disasters impacting the site: Flooding of chemical stores, lightning strike on fuel tanks, power blackout at ETP.',
            'Emergency plans must protect both human safety AND the surrounding air, soil, and water.'
          ],
          Example: 'Installing an emergency holding lagoon at the ETP to catch untreated wastewater if the biological treatment pump fails.',
          keyPoint: 'During a factory fire, toxic firewater runoff entering rivers can cause massive environmental damage if drains are not blocked.'
        },
        {
          slideNumber: 2,
          title: 'Anatomy of a Chemical & Oil Spill Kit',
          subtitle: 'Module 04 • Essential Emergency Equipment',
          bullets: [
            'Spill kits must be stationed near chemical stores, workshops, fuel tanks, loading bays, and laboratories.',
            'Contents include: Absorbent Booms/Socks (to build a dam around the spill), Absorbent Pads/Pillows (to soak up liquid), and Granules.',
            'Also includes: Neoprene Drain Covers/Putty (to seal storm drains), PPE (chemical gloves, goggles), Plastic Shovel/Brush, and Hazardous Waste Bags.',
            'Spill kits are color-coded: Yellow for Chemicals/Acids, White for Oils/Hydrocarbons (repels water, floats on water), Grey for Universal liquids.'
          ],
          Example: 'Using a White Oil-Only Spill Kit when hydraulic oil leaks onto a wet concrete loading dock during rain.',
          keyPoint: 'Never use a Spill Kit as a trash bin—inspect spill kit seals monthly to ensure all pads, socks, and PPE are complete.'
        },
        {
          slideNumber: 3,
          title: 'The 5-Step Spill Response Procedure',
          subtitle: 'Module 04 • Action Sequence in an Emergency',
          bullets: [
            'Step 1 — ASSESS & PROTECT: Check the chemical SDS, alert people nearby, and put on appropriate PPE (never touch unknown chemicals barehanded).',
            'Step 2 — STOP THE SOURCE: Upright a tipped drum or close the leaking valve if safe to do so.',
            'Step 3 — CONTAIN & BLOCK DRAINS: Place drain mats and absorbent socks around the outer edge of the spill to stop it reaching drains.',
            'Step 4 — CLEAN UP: Place absorbent pads over the liquid from the outside inward until dry.',
            'Step 5 — DISPOSE & RESTOCK: Seal used absorbents in labeled hazardous waste bags, report the incident, and replenish the spill kit.'
          ],
          Example: 'Blocking the storm drain FIRST before mopping up the middle of the puddle stops chemicals from escaping off-site.',
          keyPoint: 'Priority #1 in containment is always blocking nearby floor drains and rainwater grates before the liquid reaches them.'
        },
        {
          slideNumber: 4,
          title: 'Emergency Drills & Post-Incident Review',
          subtitle: 'Module 04 • Testing and Improving Response Plans',
          bullets: [
            'ISO 14001 Clause 8.2 requires periodic testing (mock drills) of emergency response procedures where practicable.',
            'Drills should test chemical spill containment, ammonia leak evacuation, and ETP overflow response.',
            'After every mock drill or actual incident, the team must evaluate what worked and what failed.',
            'Emergency procedures and training must be updated whenever weaknesses are found during a drill.'
          ],
          Example: 'Discovering during a mock spill drill that the nearest spill kit was blocked by stacked pallets, leading to painted yellow "Keep Clear" floor zones.',
          keyPoint: 'Every emergency drill must end with a documented evaluation report and corrective actions for any delays identified.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 5,
      title: 'Module 05: Performance Evaluation, Compliance Auditing & Continual Improvement (Clauses 9 & 10)',
      estimatedMinutes: 45,
      learningObjectives: [
        'Monitor Environmental KPIs and calibrate environmental measuring equipment',
        'Perform Evaluation of Compliance (Clause 9.1.2) against environmental laws and permits',
        'Drive Continual Improvement through Internal Audits, Management Review, and CAPA'
      ],
      summary: 'Covers Clause 9 (Monitoring & Measurement, Evaluation of Compliance, Internal EMS Audit, Management Review) and Clause 10 (Nonconformity, Corrective Action, and Continual Improvement).',
      keyTakeaways: [
        'Clause 9.1.2 requires periodic Evaluation of Compliance with all legal permits and voluntary obligations, maintaining documented evidence.',
        'Environmental monitoring instruments (pH meters, flow meters, gas analyzers) must be calibrated and verified.'
      ],
      practiceScenario: 'During your quarterly Evaluation of Compliance (Clause 9.1.2), you verify that third-party stack emission test reports, ETP effluent lab reports, and hazardous waste manifests are all within legal permit limits and renewable licenses are up to date.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Monitoring, Measurement & Environmental KPIs (Clause 9.1.1)',
          subtitle: 'Module 05 • Data-Driven Environmental Management',
          bullets: [
            'Organizations must define what needs to be monitored and measured, methods used, and frequency of analysis.',
            'Key Environmental Performance Indicators (EPIs) are normalized per unit of production (e.g., kWh per ton, Liters of water per kg, % waste recycled).',
            'Equipment used for environmental monitoring (ETP pH sensors, flow meters, noise meters) must be calibrated.',
            'Reliable data shows whether environmental objectives are on track or slipping.'
          ],
          Example: 'Tracking "Specific Water Consumption (m³ water / ton of product)" monthly rather than just total water bills, to account for seasonal production volume changes.',
          keyPoint: 'Normalizing environmental KPIs per ton or unit of output gives an accurate picture of true resource efficiency.'
        },
        {
          slideNumber: 2,
          title: 'Evaluation of Compliance (Clause 9.1.2)',
          subtitle: 'Module 05 • Verifying Legal & Permit Adherence',
          bullets: [
            'Identifying laws in Clause 6.1.3 is step one; Clause 9.1.2 requires evaluating whether you actually comply with every single requirement.',
            'Checks include: Valid operating permits, air stack emission test certificates, wastewater lab reports, noise boundary surveys, and waste transfer notes.',
            'If a legal non-compliance is discovered (e.g., ETP COD exceeded permit limit on Tuesday), immediate corrective action is mandatory.',
            'Documented information (records) of all compliance evaluations must be retained.'
          ],
          Example: 'Conducting a twice-yearly Legal Compliance Audit where every condition printed on the factory’s Environmental Permit is checked against actual test records.',
          keyPoint: 'Even if a legal limit was exceeded only once and already fixed, the EMS must record the non-compliance and its root cause action.'
        },
        {
          slideNumber: 3,
          title: 'Internal EMS Audits & Management Review (Clauses 9.2 & 9.3)',
          subtitle: 'Module 05 • System Health Check',
          bullets: [
            'Internal EMS audits check whether the environmental management system conforms to ISO 14001:2015 and site procedures.',
            'Audit frequency is based on the environmental importance of the processes (e.g., ETP and Chemical Store audited more often than offices).',
            'Management Review evaluates: status of objectives, significant aspects changes, compliance status, environmental incidents, and resource needs.',
            'Outputs of Management Review drive budget allocation for cleaner technologies and waste reduction projects.'
          ],
          Example: 'Management Review approving capital budget to install solar panels and condensate heat recovery based on annual EMS energy data.',
          keyPoint: 'Audit schedules in ISO 14001 must prioritize areas with Significant Environmental Aspects.'
        },
        {
          slideNumber: 4,
          title: 'Nonconformity, Corrective Action & Continual Improvement (Clause 10)',
          subtitle: 'Module 05 • Closing the Loop',
          bullets: [
            'When an environmental nonconformity or incident occurs, first take immediate action to mitigate adverse environmental impacts.',
            'Perform Root Cause Analysis (5-Whys / Fishbone) so the spill, exceedance, or waste mix-up cannot happen again.',
            'Update the Aspect-Impact Register or operational controls if necessary.',
            'Continual Improvement in ISO 14001 means measurably improving actual environmental performance—not just adding more paperwork.'
          ],
          Example: 'Eliminating recurring ETP high-pH alarms by installing an automated acid-dosing neutralization valve rather than just retraining operators.',
          keyPoint: 'True continual improvement in ISO 14001 results in cleaner air, cleaner water, less waste, and lower resource consumption.'
        }
      ],
      sections: [],
      quiz: []
    }
  ]
});

export const ISO_45001_AWARENESS_COURSE: InternationalTrainingCourse = normalizeRawSlideCourse({
  id: 'cert-2026-iso-45001-awareness',
  code: 'ISO-45001-AW',
  title: 'ISO 45001 Awareness Certificate',
  subtitle: 'ISO 45001:2018 Occupational Health & Safety (OH&S) — HIRA, Hierarchy of Controls, LOTO & Worker Safety',
  category: 'International Certification',
  level: 'Foundation & Intermediate',
  durationHours: 16,
  totalModules: 5,
  examQuestionsCount: 40,
  passingScorePercent: 60,
  certificateTitle: 'Certified ISO 45001:2018 Occupational Health & Safety (OH&S) Awareness Professional',
  accreditationStandard: 'ISO 45001:2018 Occupational Health & Safety Management Systems',
  targetAudience: ['Safety Officers (HSE)', 'Plant Managers & Engineers', 'Line Supervisors', 'Warehouse & Maintenance Teams'],
  overview: 'A practical 05-Module slide presentation course on ISO 45001:2018 covering Worker Consultation & Participation, Hazard Identification & Risk Assessment (HIRA), the 5-Level Hierarchy of Controls, Permit-to-Work (PTW), Lockout/Tagout (LOTO), and Incident Investigation.',
  learningOutcomes: [
    'Understand ISO 45001:2018 requirements and Clause 5.4 Worker Consultation & Participation',
    'Identify physical, mechanical, chemical, ergonomic, and psychosocial workplace hazards (HIRA)',
    'Apply the 5-Level Hierarchy of Controls (Elimination, Substitution, Engineering, Administrative, PPE)',
    'Execute Permit-to-Work (PTW), Lockout/Tagout (LOTO), Machine Guarding, and Confined Space controls',
    'Investigate Near-Misses and Workplace Accidents using Root Cause Analysis without worker blame'
  ],
  modules: [
    {
      moduleNumber: 1,
      title: 'Module 01: Introduction to ISO 45001:2018 & Worker Participation',
      estimatedMinutes: 45,
      learningObjectives: [
        'Explain the purpose of ISO 45001:2018 and how it replaced OHSAS 18001',
        'Distinguish between Worker Consultation and Worker Participation (Clause 5.4)',
        'Understand the Worker’s Right to Stop Unsafe Work (Clause 5.2 / 7.3)'
      ],
      summary: 'Covers the transition from OHSAS 18001 to ISO 45001:2018, the OH&S Policy commitments, Leadership accountability, Worker Consultation & Participation (Clause 5.4), and the right to refuse imminent danger.',
      keyTakeaways: [
        'ISO 45001:2018 prevents work-related injury and ill health and provides safe and healthy workplaces.',
        'Clause 5.4 requires active Consultation (seeking views before deciding) and Participation (joint decision-making) of non-managerial workers.',
        'Clause 7.3 ensures workers can remove themselves from work situations that present an imminent and serious danger without reprisal.'
      ],
      practiceScenario: 'A maintenance technician notices that a scaffold has a missing guardrail and unstable base plates. Under ISO 45001 Clause 7.3, the technician stops the job, reports the hazard to the supervisor, and is protected from any disciplinary punishment for stopping unsafe work.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'What is ISO 45001:2018?',
          subtitle: 'Module 01 • Global Occupational Health & Safety Standard',
          bullets: [
            'ISO 45001:2018 is the world’s first ISO international standard for Occupational Health & Safety (OH&S), replacing OHSAS 18001.',
            'Designed to prevent work-related fatal accidents, injuries, and occupational diseases (hearing loss, musculoskeletal injury, stress).',
            'Applies to full-time employees, temporary agency workers, contractors, and visitors under the organization’s control.',
            'Built on the Annex SL High-Level Structure (Clauses 4 to 10) so it integrates smoothly with ISO 9001 and ISO 14001.'
          ],
          Example: 'Integrating ISO 9001 (Quality), ISO 14001 (Environment), and ISO 45001 (Safety) into one unified QHSE Management System.',
          keyPoint: 'ISO 45001 protects both physical safety (preventing injuries) and long-term occupational health (preventing physical and mental ill-health).'
        },
        {
          slideNumber: 2,
          title: 'Leadership & The OH&S Policy (Clauses 5.1 & 5.2)',
          subtitle: 'Module 01 • Management Ownership of Safety',
          bullets: [
            'Top Management holds ultimate accountability for preventing work-related injury and ill-health (cannot be delegated solely to the Safety Officer).',
            'The OH&S Policy must include commitments to: 1) Provide safe and healthy working conditions, 2) Eliminate hazards and reduce OH&S risks.',
            '3) Fulfill legal and other requirements, 4) Continual improvement of the OH&S system, and 5) Consultation and participation of workers.',
            'Leadership must foster a positive safety culture that encourages reporting near-misses without fear of blame.'
          ],
          Example: 'Plant Directors starting every morning production meeting with a 2-minute Safety Share and reviewing near-miss reports personally.',
          keyPoint: 'The OH&S Policy has 5 mandatory commitments, including eliminating hazards and consulting with workers.'
        },
        {
          slideNumber: 3,
          title: 'Clause 5.4: Consultation & Participation of Workers',
          subtitle: 'Module 01 • Engaging Non-Managerial Staff',
          bullets: [
            'Consultation = Seeking workers’ views and feedback BEFORE management makes a safety decision (two-way communication).',
            'Participation = Involving workers directly in safety decision-making (e.g., joint HIRA teams, selecting PPE, investigating incidents).',
            'ISO 45001 specifically requires engaging non-managerial workers—the operators, drivers, and technicians on the front line.',
            'Barriers to participation (language barriers, literacy, shift schedules, fear of retaliation) must be identified and removed.'
          ],
          Example: 'Having three line operators test three different styles of cut-resistant gloves and vote on which glove offers the best grip and comfort.',
          keyPoint: 'Never write a Risk Assessment (HIRA) sitting alone in an office—always involve the operators who actually perform the task.'
        },
        {
          slideNumber: 4,
          title: 'The Right to Stop Unsafe Work (Clause 7.3)',
          subtitle: 'Module 01 • Protection Against Imminent Danger',
          bullets: [
            'Clause 7.3(e) & (f) requires workers to be aware of the ability to remove themselves from work situations that they consider present an imminent and serious danger to their life or health.',
            'Workers must be protected from undue consequences (no pay deduction, firing, or punishment) when they stop unsafe work in good faith.',
            'Everyone on site is empowered with a "Stop Work Authority" if a critical safety control fails.',
            'Work only resumes once the hazard is inspected and made safe.'
          ],
          Example: 'A forklift driver refuses to drive a truck whose brakes failed the morning pre-start check; the supervisor tags the truck "Out of Service" and thanks the driver.',
          keyPoint: 'Every worker in an ISO 45001 workplace has the right and duty to stop work if there is imminent danger to life or health.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 2,
      title: 'Module 02: Hazard Identification & Risk Assessment — HIRA (Clause 6)',
      estimatedMinutes: 50,
      learningObjectives: [
        'Distinguish clearly between a Hazard, a Risk, an Incident, a Near-Miss, and an Accident',
        'Identify the 6 categories of workplace hazards (Mechanical, Physical, Chemical, Biological, Ergonomic, Psychosocial)',
        'Conduct a HIRA risk scoring matrix across Routine and Non-Routine tasks'
      ],
      summary: 'Explains core safety definitions (Hazard vs Risk, Near-Miss vs Accident), the 6 categories of workplace hazards including psychosocial factors in ISO 45001, and conducting HIRA.',
      keyTakeaways: [
        'Hazard = source with a potential to cause injury and ill health. Risk = combination of likelihood and severity of injury.',
        'Near-Miss = an incident where no injury or ill health occurs, but had the potential to do so.',
        'ISO 45001 explicitly includes ergonomic and psychosocial hazards (workload, bullying, shift fatigue) alongside physical/mechanical hazards.'
      ],
      practiceScenario: 'An unguarded rotating conveyor chain is a Mechanical Hazard. The chance of an operator’s sleeve getting caught and causing a severe hand fracture is the OH&S Risk. Installing a fixed bolted mesh guard reduces that risk to an acceptable level.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Essential Safety Definitions in ISO 45001',
          subtitle: 'Module 02 • Speaking the Language of Safety',
          bullets: [
            'Hazard: A source or situation with a potential to cause injury and ill health (e.g., wet floor, live electrical wire, loud noise, toxic fumes).',
            'OH&S Risk: Combination of the Likelihood of a hazardous event occurring and the Severity of the injury/ill health that could be caused.',
            'Incident: Occurrence arising out of work that could or does result in injury and ill health.',
            'Accident = Incident that DOES result in injury/ill health. Near-Miss (Close Call) = Incident where NO injury occurs, but could have.'
          ],
          Example: 'A heavy wrench falls from an overhead platform and lands 1 meter away from a worker—no one is hurt, so it is a Near-Miss that must be investigated immediately.',
          keyPoint: 'Today’s unaddressed Near-Miss is tomorrow’s serious Accident—investigating near-misses prevents injuries before they happen.'
        },
        {
          slideNumber: 2,
          title: 'The 6 Categories of Workplace Hazards (Clause 6.1.2.1)',
          subtitle: 'Module 02 • Comprehensive Hazard Identification',
          bullets: [
            '1. Mechanical & Physical: Unguarded machinery, moving forklifts, working at height, slips/trips, noise (>85 dB), vibration, heat/cold, electricity.',
            '2. Chemical: Acids, caustic soda, ammonia, solvents, dust, welding fumes, carbon monoxide.',
            '3. Biological: Bacteria, viruses, mold spores, bloodborne pathogens, pest droppings.',
            '4. Ergonomic: Repetitive manual lifting, awkward postures, poorly designed workstations.',
            '5. Psychosocial (Highlighted in ISO 45001): Excessive workload, long night shifts, fatigue, workplace harassment, or bullying.'
          ],
          Example: 'Evaluating 12-hour night shift fatigue and manual lifting of 50 kg bags as part of the factory HIRA alongside machine hazards.',
          keyPoint: 'ISO 45001 requires assessing mental/psychosocial and ergonomic health hazards, not just physical machinery hazards.'
        },
        {
          slideNumber: 3,
          title: 'Routine, Non-Routine & Emergency Activities in HIRA',
          subtitle: 'Module 02 • Where Most Severe Accidents Happen',
          bullets: [
            'HIRA must cover Routine Activities (daily line operation, packing, normal warehouse stacking).',
            'HIRA must cover Non-Routine Activities (unblocking jammed machines, roof repair, annual tank entry, installing new lines).',
            'Must also consider human factors, past incidents, and people near the workplace (visitors, neighbors, delivery drivers).',
            'Statistics show a high percentage of fatal industrial accidents occur during Non-Routine maintenance or jam clearing.'
          ],
          Example: 'Writing a specific Job Safety Analysis (JSA) before a crane lifts a new cooling tower onto the factory roof (a non-routine task).',
          keyPoint: 'Never allow a non-routine maintenance or unjamming task to start without assessing its specific hazards first.'
        },
        {
          slideNumber: 4,
          title: 'Risk Assessment Matrix (Likelihood × Severity)',
          subtitle: 'Module 02 • Prioritizing Safety Actions',
          bullets: [
            'Step 1: Score Initial Risk = Likelihood (1 to 5) × Severity (1 = First Aid to 5 = Fatality/Permanent Disability).',
            'Step 2: If risk is High or Unacceptable, work cannot proceed until stronger controls are applied.',
            'Step 3: Apply controls using the Hierarchy of Controls and re-score the Residual Risk.',
            'Step 4: Review HIRA annually, after any incident/near-miss, or before any Management of Change (MOC).'
          ],
          Example: 'Working at 6 meters height without protection has Severity = 5, Likelihood = 4 (Score 20 = Critical); using a scissor lift with guardrails drops Likelihood to 1 (Residual Score 5 = Low).',
          keyPoint: 'Controls must reduce high risks down to an acceptable Residual Risk level before work begins.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 3,
      title: 'Module 03: The Hierarchy of Controls & High-Risk Operations (Clause 8.1)',
      estimatedMinutes: 55,
      learningObjectives: [
        'Apply the 5-Level Hierarchy of Controls in exact order from Most Effective to Least Effective',
        'Execute Lockout/Tagout (LOTO) and Permit-to-Work (PTW) for high-risk jobs',
        'Control Confined Space Entry, Working at Height, Hot Work, and Machine Guarding'
      ],
      summary: 'Explains Clause 8.1.2 Hierarchy of Controls (Elimination, Substitution, Engineering, Administrative, PPE) and critical life-saving rules: Lockout/Tagout (LOTO), Permit-to-Work (PTW), Machine Guarding, Confined Spaces, and Forklift Pedestrian Segregation.',
      keyTakeaways: [
        'The 5-Level Hierarchy of Controls MUST be applied in order: 1. Elimination, 2. Substitution, 3. Engineering Controls, 4. Administrative Controls, 5. PPE (Last Resort).',
        'Lockout/Tagout (LOTO) isolates all energy sources with a personal padlock and tag + Try/Test before any maintenance inside machinery.'
      ],
      practiceScenario: 'An operator needs to clean inside a dough mixer. Instead of just pressing the emergency stop button, the operator switches off the main electrical isolator, attaches their personal LOTO padlock and photo tag, keeps the single key in their pocket, and presses the start button (TRY step) to confirm zero energy before reaching inside.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Clause 8.1.2: The 5-Level Hierarchy of Controls',
          subtitle: 'Module 03 • Most Effective to Least Effective',
          bullets: [
            '1. ELIMINATION (Most Effective): Physically remove the hazard completely (e.g., perform inspection from ground level using a camera instead of climbing a ladder).',
            '2. SUBSTITUTION: Replace the hazard with something safer (e.g., replace toxic solvent paint with water-based paint; replace 50 kg bags with 20 kg bags).',
            '3. ENGINEERING CONTROLS: Isolate people from the hazard physically (e.g., interlocked machine guards, acoustic noise enclosures, local exhaust ventilation).',
            '4. ADMINISTRATIVE CONTROLS: Change the way people work (e.g., SOPs, safety signs, job rotation, Permit-to-Work, training).',
            '5. PERSONAL PROTECTIVE EQUIPMENT — PPE (Least Effective / Last Resort): Earplugs, safety glasses, helmets, gloves, safety shoes.'
          ],
          Example: 'Instead of just handing out earplugs (PPE) in a 95 dB compressor room, enclosing the compressor in soundproof panels (Engineering) drops room noise to 76 dB.',
          keyPoint: 'PPE is always the LAST line of defence because if a glove tears or a worker forgets goggles, the hazard is still 100% present.'
        },
        {
          slideNumber: 2,
          title: 'Lockout / Tagout (LOTO) — Zero Energy Isolation',
          subtitle: 'Module 03 • Life-Saving Control During Maintenance & Cleaning',
          bullets: [
            'LOTO prevents unexpected startup or release of stored energy (electrical, pneumatic air, hydraulic, steam, gravity) during servicing or unjamming.',
            'Rule: "One Person, One Lock, One Key" — every technician working on a machine attaches their own personal padlock to the hasp.',
            'LOTO 6 Steps: 1) Prepare, 2) Shut down machine, 3) Isolate energy source at main disconnect, 4) Apply Lock & Tag, 5) Release stored energy (bleed air/pressure), 6) TRY/VERIFY.',
            'Note: Emergency Stop buttons and control switches are NOT energy isolation points and must never be locked out instead of the main breaker.'
          ],
          Example: 'Three technicians repairing a packaging line attach a 6-hole group scissor hasp to the main breaker; the machine cannot be energized until all 3 technicians remove their own locks.',
          keyPoint: 'Always perform Step 6 (TRY Out): press the start button after applying your padlock to prove the machine is truly dead before entering.'
        },
        {
          slideNumber: 3,
          title: 'Permit-to-Work (PTW) System for High-Risk Tasks',
          subtitle: 'Module 03 • Formal Authorization Before Starting',
          bullets: [
            'A Permit-to-Work (PTW) is a formal written safety checklist authorizing high-risk non-routine work for a specific shift and location.',
            'Hot Work Permit (welding, grinding, cutting): Requires removing combustibles within 10–11m, gas check, fire extinguisher on standby, and 30–60 min fire watch after completion.',
            'Confined Space Entry Permit (tanks, silos, deep pits): Requires gas testing BEFORE entry (Oxygen 19.5%–23.5%, LEL <10%, toxic gases CO/H2S = 0), continuous ventilation, standby attendant outside, and rescue harness.',
            'Work at Height Permit (>2 meters): Requires certified scaffolding, full-body harness with double lanyard anchored securely, and tool lanyards.'
          ],
          Example: 'Before entering a flour silo for cleaning, atmospheric gas meter confirms 20.9% Oxygen, LOTO locks the auger screw, and a trained attendant stands at the manhole.',
          keyPoint: 'Never enter a Confined Space to rescue an unconscious colleague without breathing apparatus—over 50% of confined space fatalities are would-be rescuers.'
        },
        {
          slideNumber: 4,
          title: 'Machine Guarding & Forklift-Pedestrian Segregation',
          subtitle: 'Module 03 • Everyday Shop Floor Engineering Controls',
          bullets: [
            'All nip points, rotating shafts, gears, chains, and cutting blades must have Fixed Guards (requiring a tool to remove) or Interlocked Guards (stopping the machine immediately when opened).',
            'Bypassing, taping, or defeating a safety interlock switch is a gross safety violation.',
            'Workplace transport (forklifts & trucks) must be physically separated from pedestrians using barriers, marked walkways, convex mirrors, speed limits, and blue warning spotlights.',
            'Management of Change (Clause 8.1.3) requires a formal safety review before introducing any new machine, chemical, or layout change.'
          ],
          Example: 'Installing steel crash barriers between the warehouse pedestrian walkway and the main forklift aisle.',
          keyPoint: 'Never bypass a machine safety interlock switch—interlocks exist to prevent amputations and fatalities.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 4,
      title: 'Module 04: Contractor Safety, Procurement & Emergency Preparedness (Clauses 8.1.4 & 8.2)',
      estimatedMinutes: 45,
      learningObjectives: [
        'Control safety risks introduced by Procurement, Contractors, and Outsourcing (Clause 8.1.4)',
        'Establish Emergency Preparedness plans for Fire, Medical Trauma, Chemical Release, and Evacuation',
        'Apply Occupational Health monitoring (noise audiometry, ergonomics, first aid)'
      ],
      summary: 'Covers Clause 8.1.4 (Procurement, Contractors, Outsourcing), Occupational Health surveillance, and Clause 8.2 (Emergency Preparedness, Fire Safety, Evacuation Drills, First Aid).',
      keyTakeaways: [
        'Procurement must verify safety specifications (CE/safety guarding, low noise, SDS) BEFORE purchasing equipment or chemicals.',
        'Contractors must be pre-qualified, inducted, issued Permits-to-Work, and supervised on site.',
        'Emergency evacuation drills must be conducted periodically across all shifts, including night shifts.'
      ],
      practiceScenario: 'An external roofing contractor arrives on site without safety harnesses. Under Clause 8.1.4.2, security and HSE refuse to issue a Work at Height Permit until the contractor provides inspected full-body harnesses, anchor lines, and worker fall-protection training certificates.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Procurement, Contractors & Outsourcing (Clause 8.1.4)',
          subtitle: 'Module 04 • Stopping Hazards at the Factory Gate',
          bullets: [
            'Procurement (8.1.4.1): Safety requirements must be checked BEFORE buying new machines, raw materials, or chemicals (never buy an unguarded machine or a chemical without an SDS).',
            'Contractors (8.1.4.2): Coordinate safety with contractors considering: 1) How contractor work affects your workers, 2) How your factory hazards affect contractor workers, 3) How contractor work affects visitors/neighbors.',
            'All contractors must complete Site Safety Induction, provide method statements/risk assessments (RAMS), and hold valid Permits-to-Work.',
            'Outsourcing (8.1.4.3): Outsourced functions under the scope of the OH&S system must remain controlled.'
          ],
          Example: 'Requiring the Engineering Buyer to get HSE sign-off on noise levels (<80 dB) and interlocked guards before ordering a new case-packer.',
          keyPoint: 'Fixing safety flaws at the Procurement stage is 10 times cheaper and safer than retrofitting guards after a machine is installed.'
        },
        {
          slideNumber: 2,
          title: 'Occupational Health & Ergonomics Surveillance',
          subtitle: 'Module 04 • Protecting Long-Term Worker Health',
          bullets: [
            'Occupational Health focuses on chronic exposures that develop over months or years.',
            'Noise Control: Areas ≥85 dB(A) require mandatory hearing protection zones, engineering noise reduction, and annual Audiometry (hearing tests) for workers.',
            'Hazardous Substances: Local Exhaust Ventilation (LEV), exposure monitoring, eyewash/safety showers within 10 seconds (unobstructed) of corrosive chemical handling.',
            'Manual Handling & Ergonomics: Mechanical lifting aids (pallet jacks, vacuum lifters), team lifting, and ergonomic table heights.'
          ],
          Example: 'Testing emergency eyewash stations and deluge showers weekly to flush stagnant water and confirm instant flow.',
          keyPoint: 'Emergency eyewash and safety showers must be reachable within 10 seconds on the same level with zero locked doors or obstacles in the path.'
        },
        {
          slideNumber: 3,
          title: 'Emergency Preparedness & Fire Safety (Clause 8.2)',
          subtitle: 'Module 04 • Readiness Saves Lives',
          bullets: [
            'Emergency plans cover: Fire/Explosion, Ammonia/Gas leak, Severe Medical Injury, Electric Shock, Structural Collapse, and Natural Disasters.',
            'Fire exits and escape corridors must NEVER be locked, chained, or blocked by pallets during working hours.',
            'Fire extinguishers (Water, Foam, CO2, Dry Powder, Wet Chemical) must be inspected monthly, unobstructed, and matched to the fire class.',
            'Trained Fire Wardens and Certified First Aiders must be present on every shift (including night and weekend shifts).'
          ],
          Example: 'Ensuring CO2 fire extinguishers are placed outside electrical switchgear panels rather than water extinguishers.',
          keyPoint: 'A blocked or locked emergency fire exit in a populated building is a critical life-safety violation.'
        }
      ],
      sections: [],
      quiz: []
    },
    {
      moduleNumber: 5,
      title: 'Module 05: Incident Investigation, Safety KPIs & Audits (Clauses 9 & 10)',
      estimatedMinutes: 45,
      learningObjectives: [
        'Distinguish between Leading Safety Indicators (Proactive) and Lagging Safety Indicators (Reactive)',
        'Investigate Incidents and Near-Misses with worker participation to find systemic Root Causes',
        'Conduct ISO 45001 Internal Audits and Management Review'
      ],
      summary: 'Covers Clause 9 (Leading vs Lagging OH&S KPIs, Evaluation of Legal Compliance, Internal Audits, Management Review) and Clause 10 (Incident Investigation, Nonconformity, Corrective Action, and Continual Improvement).',
      keyTakeaways: [
        'Leading Indicators measure proactive prevention (safety walks, near-misses closed, training); Lagging Indicators measure past failures (LTIFR, injury rates).',
        'Incident investigations (Clause 10.2) must involve workers, focus on systemic root causes (not human blame), and be communicated to relevant workers.'
      ],
      practiceScenario: 'An operator slips and twists an ankle on oil near a filling machine. Instead of blaming the operator for "not looking", a 5-Why investigation with the operator finds a worn hydraulic seal leaking onto an ungrooved smooth tile. Corrective action: replace the seal type, add a drip tray, and apply anti-slip floor coating.',
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Leading vs. Lagging Safety Indicators (Clause 9.1)',
          subtitle: 'Module 05 • Measuring Proactive Safety vs. Past Injuries',
          bullets: [
            'Lagging Indicators (Reactive — measuring after harm occurs): Lost Time Injury Frequency Rate (LTIFR), Total Recordable Incident Rate (TRIR), Days Lost, Occupational Illness cases.',
            'Leading Indicators (Proactive — measuring prevention activities): Number of Near-Misses reported & closed, % of HIRA actions completed on time, Safety Gemba Walks completed, Emergency Drill scores.',
            'Relying only on "Zero Lost Time Injuries" can hide serious underlying hazards if near-misses are ignored.',
            'Clause 9.1.2 requires periodic Evaluation of Compliance with national labor/OH&S laws (boiler certificates, crane load tests, fire certificates).'
          ],
          Example: 'Celebrating an increase in Near-Miss reporting from 5 per month to 45 per month because hazards are being spotted and fixed before anyone gets hurt.',
          keyPoint: 'High Near-Miss reporting combined with fast closure is the strongest indicator of a healthy safety culture.'
        },
        {
          slideNumber: 2,
          title: 'Incident Investigation & Root Cause Analysis (Clause 10.2)',
          subtitle: 'Module 05 • Learning Without Blame',
          bullets: [
            'All accidents, occupational illnesses, and near-misses must be investigated promptly.',
            'Step 1: Secure the scene and provide immediate medical care.',
            'Step 2: Investigate with the participation of workers and worker representatives (Clause 10.2).',
            'Step 3: Use 5-Whys or Fishbone analysis to identify underlying System Root Causes (design, guarding, maintenance, workload)—never stop at "worker carelessness".',
            'Step 4: Apply corrective actions using the Hierarchy of Controls and update the HIRA.'
          ],
          Example: 'When a worker cuts a finger opening boxes, replacing open steel blades with spring-retractable safety cutters (Substitution/Engineering) rather than just issuing a warning letter.',
          keyPoint: 'Writing "Worker Error / Tell worker to be careful" as a root cause is rejected in ISO 45001—you must fix the system condition that allowed the error.'
        },
        {
          slideNumber: 3,
          title: 'Internal Audits, Management Review & Continual Improvement',
          subtitle: 'Module 05 • Clauses 9.2, 9.3 & 10.3',
          bullets: [
            'Internal OH&S Audits verify that HIRA controls, LOTO, Permits-to-Work, and legal checks are actually working on the shop floor.',
            'Auditors interview front-line workers to confirm they were consulted and know emergency procedures.',
            'Results of incident investigations and corrective actions must be communicated to relevant workers and the Safety Committee.',
            'Continual Improvement (Clause 10.3) enhances OH&S performance, builds safety culture, and eliminates workplace hazards.'
          ],
          Example: 'Sharing a 1-page visual "Safety Lesson Learned" alert across all factory noticeboards after fixing a near-miss in the warehouse.',
          keyPoint: 'ISO 45001 requires communicating investigation findings and corrective actions back to the workforce.'
        }
      ],
      sections: [],
      quiz: []
    }
  ]
});

export const ISO_14001_45001_BRCGS_COURSES: InternationalTrainingCourse[] = [
  BRCGS_ISSUE_09_COURSE,
  ISO_14001_AWARENESS_COURSE,
  ISO_45001_AWARENESS_COURSE
];

export const ISO_14001_45001_BRCGS_HUB_TRAININGS: HubTraining[] = ISO_14001_45001_BRCGS_COURSES.map(buildHubTrainingFromCourse);
