export interface InterviewQuestionItem {
  id: string;
  questionNumber: number;
  topic: 'HACCP' | 'ISO 22000' | 'FSSC 22000' | 'Food Safety & GMP' | 'Food Science & QA';
  question: string;
  answer: string;
  keyTakeaway: string;
}

export interface InterviewPrepSet {
  id: string;
  setNumber: number;
  title: string;
  subtitle: string;
  focusStandards: string[];
  questionsCount: number;
  questions: InterviewQuestionItem[];
}

export const INTERVIEW_PREP_SETS: InterviewPrepSet[] = [
  {
    id: 'interview-set-1',
    setNumber: 1,
    title: 'Set 1: Codex HACCP Principles, 12 Steps & CCP Mastery',
    subtitle: '20 Essential Interview Questions on Hazard Analysis, Critical Control Points, Critical Limits & Decision Trees',
    focusStandards: ['Codex HACCP', '7 Principles', 'CCP vs OPRP', 'Critical Limits'],
    questionsCount: 20,
    questions: [
      {
        id: 'int-1-01',
        questionNumber: 1,
        topic: 'HACCP',
        question: 'What are the 7 Principles of Codex Alimentarius HACCP in exact sequence?',
        answer: 'The 7 Principles of HACCP are: (1) Conduct a Hazard Analysis, (2) Determine the Critical Control Points (CCPs), (3) Establish Validated Critical Limits for each CCP, (4) Establish a Monitoring System for each CCP, (5) Establish Corrective Actions when monitoring indicates a deviation from a critical limit, (6) Establish Verification Procedures to confirm the HACCP system works effectively, and (7) Establish Documentation and Record-Keeping concerning all procedures and records.',
        keyTakeaway: 'Always recite all 7 principles in exact chronological order during technical QA interviews.'
      },
      {
        id: 'int-1-02',
        questionNumber: 2,
        topic: 'HACCP',
        question: 'What are the 5 preliminary steps before applying the 7 HACCP principles (the 12 Steps of HACCP)?',
        answer: 'Before applying the 7 principles, the 5 preliminary steps are: Step 1: Assemble the multidisciplinary HACCP Team; Step 2: Describe the Food Product and its distribution; Step 3: Identify the Intended Use and target consumer group (including vulnerable populations); Step 4: Construct a Process Flow Diagram; and Step 5: Perform On-Site Confirmation (walkthrough verification) of the Flow Diagram across all shifts.',
        keyTakeaway: '5 Preliminary Steps + 7 HACCP Principles = 12 Codex HACCP Implementation Steps.'
      },
      {
        id: 'int-1-03',
        questionNumber: 3,
        topic: 'HACCP',
        question: 'How do you differentiate between a Prerequisite Program (PRP), an Operational PRP (OPRP), and a Critical Control Point (CCP)?',
        answer: 'A PRP (e.g., pest control, handwashing, facility maintenance) creates the basic hygienic environment across the plant and is not specific to a single hazard. An OPRP is a control measure identified by hazard analysis as essential to control the likelihood of introducing or proliferating a significant food safety hazard (managed via action criteria, e.g., glass & brittle plastic checks or fine mesh sieving). A CCP is a step where control is essential to prevent or eliminate a significant food safety hazard or reduce it to an acceptable level, governed by measurable Critical Limits where loss of control leads to unsafe product.',
        keyTakeaway: 'PRP = general hygiene; OPRP = controls likelihood via Action Criteria; CCP = controls severity/elimination via Critical Limits.'
      },
      {
        id: 'int-1-04',
        questionNumber: 4,
        topic: 'HACCP',
        question: 'What are the four main categories of food safety hazards evaluated during Hazard Analysis?',
        answer: 'The four primary hazard categories are: (1) Biological Hazards (pathogenic bacteria like Salmonella, Listeria monocytogenes, E. coli O157:H7, viruses, parasites), (2) Chemical Hazards (mycotoxins, pesticide residues, undeclared allergens, cleaning chemical residues, heavy metals), (3) Physical Hazards (glass shards, metal fragments, hard plastic, stones, bone chips), and (4) Radiological Hazards (radionuclides in water or raw materials from contaminated regions).',
        keyTakeaway: 'Mention Biological, Chemical (including Allergens), Physical, and Radiological hazards.'
      },
      {
        id: 'int-1-05',
        questionNumber: 5,
        topic: 'HACCP',
        question: 'What is the difference between a Critical Limit and an Operating Limit at a CCP?',
        answer: 'A Critical Limit is the maximum or minimum value (e.g., 72°C for 15 seconds in HTST pasteurization) to which a biological, chemical, or physical parameter must be controlled at a CCP to prevent, eliminate, or reduce a hazard to an acceptable level. An Operating Limit is a stricter target set by production/QA (e.g., 74.5°C for 18 seconds) that triggers process adjustment before the Critical Limit is breached, preventing non-conforming product and line stops.',
        keyTakeaway: 'Operating limits provide a safety buffer so operators can adjust the process before violating a Critical Limit.'
      },
      {
        id: 'int-1-06',
        questionNumber: 6,
        topic: 'HACCP',
        question: 'Walk me through the 4 questions of the Codex CCP Decision Tree.',
        answer: 'Q1: Do preventative control measures exist for the identified hazard? Q2: Is the step specifically designed to eliminate or reduce the likely occurrence of the hazard to an acceptable level? (If Yes -> CCP). Q3: Could contamination with the identified hazard(s) occur in excess of acceptable levels or could these increase to unacceptable levels? (If No -> Not a CCP). Q4: Will a subsequent step eliminate the identified hazard(s) or reduce likely occurrence to an acceptable level? (If No -> CCP; if Yes -> Not a CCP at this step).',
        keyTakeaway: 'Q2 identifies steps designed for hazard elimination (like pasteurization/metal detection); Q4 checks if a downstream step handles it.'
      },
      {
        id: 'int-1-07',
        questionNumber: 7,
        topic: 'HACCP',
        question: 'What immediate actions must be taken when a Critical Limit deviation occurs at a CCP (e.g., metal detector fails or pasteurizer temperature drops)?',
        answer: 'Four immediate steps are required: (1) Stop the line or divert product flow immediately and restore process control; (2) Isolate and place on QA Hold all product produced since the last successful passed monitoring check; (3) Conduct a Root Cause Analysis (RCA) to prevent recurrence; and (4) Evaluate the quarantined product for disposition (reprocessing/re-pasteurization, re-passing through a calibrated metal detector, or safe destruction) — never release without documented QA disposition.',
        keyTakeaway: 'Always quarantine back to the last good check, fix the process, evaluate affected stock, and document RCA.'
      },
      {
        id: 'int-1-08',
        questionNumber: 8,
        topic: 'HACCP',
        question: 'Explain the difference between Validation, Verification, and Monitoring in a HACCP plan.',
        answer: 'Monitoring is the real-time, scheduled measurement or observation of a CCP against its critical limits (e.g., checking cooking core temperature every 30 minutes). Validation is obtaining scientific and technical evidence BEFORE implementation that a control measure is capable of effectively controlling the hazard (e.g., D-value/Z-value thermal lethality study). Verification is ongoing or periodic auditing/testing AFTER implementation to prove the plan is being followed and remains effective (e.g., record review, microbial swabbing, calibration checks).',
        keyTakeaway: 'Validation = Will it work scientifically? Monitoring = Is it working right now? Verification = Did it work as planned?'
      },
      {
        id: 'int-1-09',
        questionNumber: 9,
        topic: 'HACCP',
        question: 'Why is a Metal Detector or X-Ray machine usually classified as a CCP at the end of a packaging line?',
        answer: 'Because it is the final step specifically designed to detect and reject physical metal/foreign body hazards, and there is no subsequent downstream processing step (Q4 of the decision tree = No) that can eliminate metal fragments before the product reaches the consumer.',
        keyTakeaway: 'No downstream step exists after final packaging to remove physical metal contamination.'
      },
      {
        id: 'int-1-10',
        questionNumber: 10,
        topic: 'HACCP',
        question: 'How do you verify a Metal Detector CCP during production runs?',
        answer: 'Using certified test pieces (Ferrous, Non-Ferrous, and Stainless Steel, typically 316L) at the start of the shift, every 1–2 hours during production, at product changeovers, and at the end of the run. Each test piece is passed with the product (leading edge, middle, trailing edge) to verify both detection sensitivity and the automatic rejection mechanism (fail-safe air blast or pusher arm into a locked reject bin).',
        keyTakeaway: 'Test Ferrous, Non-Ferrous, and Stainless Steel test cards AND verify the physical reject mechanism works.'
      },
      {
        id: 'int-1-11',
        questionNumber: 11,
        topic: 'HACCP',
        question: 'Can aCritical Limit be subjective, such as "visual absence of dirt" or "good smell"?',
        answer: 'No. Under Codex HACCP and ISO 22000, Critical Limits must be measurable and objective (e.g., temperature ≥ 75°C, time ≥ 30 sec, pH ≤ 4.6, water activity aw ≤ 0.85, chlorine concentration 50–100 ppm) so they can be monitored rapidly in real time without ambiguity.',
        keyTakeaway: 'Critical limits must always be quantitative and measurable in real time; microbiological lab tests take too long to be critical limits.'
      },
      {
        id: 'int-1-12',
        questionNumber: 12,
        topic: 'HACCP',
        question: 'Why can microbiological testing of finished product NOT be used as a CCP monitoring method?',
        answer: 'Traditional microbiological plate counts or pathogen tests require 24 to 72+ hours of incubation. CCP monitoring must provide real-time or near-real-time results so the line can be stopped immediately if a deviation occurs. Therefore, physical/chemical parameters (time, temperature, pH, pressure, flow rate) are used for CCP monitoring, while microbiological testing is used for Verification.',
        keyTakeaway: 'Microbiological lab testing is a Verification activity, not a real-time CCP Monitoring method.'
      },
      {
        id: 'int-1-13',
        questionNumber: 13,
        topic: 'HACCP',
        question: 'What triggers a mandatory review and re-validation of an existing HACCP plan?',
        answer: 'A HACCP plan must be reviewed at least annually and whenever there is a significant change: (1) New raw material or supplier, (2) Change in product formulation/recipe or packaging (e.g., MAP/vacuum packing), (3) New processing equipment or line layout change, (4) Recurring customer complaints or product recall, (5) Emerging food safety hazards or regulatory updates, or (6) Change in intended consumer use.',
        keyTakeaway: 'Any change in recipe, equipment, packaging, supplier, or emerging regulation requires HACCP reassessment.'
      },
      {
        id: 'int-1-14',
        questionNumber: 14,
        topic: 'HACCP',
        question: 'How do you conduct a Risk Assessment (Severity × Likelihood) during Hazard Analysis?',
        answer: 'Each identified hazard at every process step is scored on two axes—typically a 3×3 or 5×5 Risk Matrix: Severity (how serious the illness or injury would be: Low/Minor, Medium/Moderate, High/Fatal-Life Threatening) and Likelihood/Probability (how likely it is to occur without extra control: Unlikely, Possible, Frequent). Hazards scoring above the significance threshold are classified as Significant Food Safety Hazards requiring CCP or OPRP control.',
        keyTakeaway: 'Risk = Severity (health impact) × Likelihood (probability of occurrence).'
      },
      {
        id: 'int-1-15',
        questionNumber: 15,
        topic: 'HACCP',
        question: 'What is the difference between Correction and Corrective Action in HACCP and ISO 22000?',
        answer: 'Correction is the action taken to eliminate the detected non-conformity itself (e.g., placing undercooked chicken batches on QA Hold and re-cooking them to 75°C). Corrective Action is the systemic action taken to eliminate the Root Cause of the non-conformity to prevent it from happening again (e.g., replacing a faulty steam valve and adding preventive maintenance checks).',
        keyTakeaway: 'Correction fixes the immediate affected product; Corrective Action eliminates the root cause to prevent recurrence.'
      },
      {
        id: 'int-1-16',
        questionNumber: 16,
        topic: 'HACCP',
        question: 'Why must flow diagrams include rework, waste streams, water/steam/air inputs, and packaging steps?',
        answer: 'Cross-contamination and allergen carry-over frequently enter via rework loops, culinary steam, compressed air contacting food, or ice/water additions. If the flow diagram omits rework or utilities, the HACCP team will miss critical biological, chemical, or allergen hazards during Step 6 (Hazard Analysis).',
        keyTakeaway: 'An incomplete flow diagram leads to unassessed hazards in rework, air, steam, and water.'
      },
      {
        id: 'int-1-17',
        questionNumber: 17,
        topic: 'HACCP',
        question: 'What is the Critical Limit for cooling cooked potentially hazardous foods (Time/Temperature Control for Safety - TCS foods)?',
        answer: 'Under FDA Food Code / international catering HACCP standards (2-stage cooling), cooked TCS foods must be cooled from 57°C (135°F) to 21°C (70°F) within 2 hours, and from 21°C (70°F) to 5°C (41°F) or below within an additional 4 hours (total cooling time not exceeding 6 hours) to prevent spore germination and toxin production by Clostridium perfringens and Bacillus cereus.',
        keyTakeaway: '2-Stage Cooling Rule: 57°C to 21°C in ≤ 2 hours, then 21°C to ≤ 5°C in ≤ 4 hours (6 hours total).'
      },
      {
        id: 'int-1-18',
        questionNumber: 18,
        topic: 'HACCP',
        question: 'What is the Temperature Danger Zone (TDZ) and why is it critical in HACCP?',
        answer: 'The Temperature Danger Zone is 5°C to 60°C (41°F to 140°F). Within this range, mesophilic foodborne pathogens double in number every 20 minutes (particularly between 20°C and 45°C). Cold holding must be kept at ≤ 4°C–5°C and hot holding at ≥ 60°C–63°C.',
        keyTakeaway: 'Keep cold food ≤ 4°C and hot food ≥ 60°C–63°C; never hold TCS food in the 5°C–60°C danger zone.'
      },
      {
        id: 'int-1-19',
        questionNumber: 19,
        topic: 'HACCP',
        question: 'In a pasteurizer CCP, what is the role of the Flow Diversion Valve (FDV)?',
        answer: 'The Flow Diversion Valve (FDV) located at the end of the holding tube automatically diverts milk or juice back to the balance tank whenever the temperature drops below the critical limit (e.g., < 72°C), ensuring zero under-pasteurized liquid can enter the pasteurized storage tank.',
        keyTakeaway: 'The FDV is the automatic engineering fail-safe that prevents under-pasteurized product from moving forward.'
      },
      {
        id: 'int-1-20',
        questionNumber: 20,
        topic: 'HACCP',
        question: 'Who should be included in a multidisciplinary HACCP Team and why?',
        answer: 'A HACCP team must include personnel from Quality Assurance/Food Safety (Team Leader), Production/Operations, Engineering/Maintenance, R&D/Product Development, Procurement/Supply Chain, and Sanitation/Warehouse. No single person knows every machine failure mode, recipe change, and sanitation detail.',
        keyTakeaway: 'QA, Production, Engineering, R&D, Sanitation, and Procurement together form a complete HACCP team.'
      }
    ]
  },
  {
    id: 'interview-set-2',
    setNumber: 2,
    title: 'Set 2: ISO 22000:2018 FSMS Clauses, PDCA & Lead Auditing',
    subtitle: '20 High-Impact Interview Questions on ISO 22000:2018 High-Level Structure, Dual PDCA Cycle & FSMS Auditing',
    focusStandards: ['ISO 22000:2018', 'Clauses 4 to 10', 'Dual PDCA', 'Internal & External Audit'],
    questionsCount: 20,
    questions: [
      {
        id: 'int-2-01',
        questionNumber: 1,
        topic: 'ISO 22000',
        question: 'Explain the Dual PDCA (Plan-Do-Check-Act) cycle introduced in ISO 22000:2018.',
        answer: 'ISO 22000:2018 operates two interconnected PDCA cycles: (1) The Organizational Management PDCA Cycle covering Clauses 4 to 7 and 9 to 10 (Context, Leadership, Planning, Support, Performance Evaluation, Improvement), and (2) The Operational Food Safety (HACCP) PDCA Cycle embedded inside Clause 8 (PRPs, Traceability, Emergency Preparedness, Hazard Analysis, Validation, CCP/OPRP Hazard Control Plan, Verification, and Control of Nonconformities).',
        keyTakeaway: 'Cycle 1 = Strategic FSMS Management (Clauses 4–10); Cycle 2 = Operational HACCP Control inside Clause 8.'
      },
      {
        id: 'int-2-02',
        questionNumber: 2,
        topic: 'ISO 22000',
        question: 'What are the 10 Clauses of ISO 22000:2018 (Annex SL High-Level Structure)?',
        answer: 'Clauses 1–3: Scope, Normative References, Terms & Definitions. Clause 4: Context of the Organization. Clause 5: Leadership. Clause 6: Planning. Clause 7: Support (Resources, Competence, Communication, Documented Information). Clause 8: Operation (PRPs, Traceability, Emergency Preparedness, HACCP/Hazard Control Plan). Clause 9: Performance Evaluation (Monitoring, Internal Audit, Management Review). Clause 10: Improvement (Nonconformity, Corrective Action, Continual Improvement).',
        keyTakeaway: 'Memorize Clauses 4 through 10—every ISO 22000 Lead Auditor interview tests the Annex SL structure.'
      },
      {
        id: 'int-2-03',
        questionNumber: 3,
        topic: 'ISO 22000',
        question: 'What is required under Clause 4.1 and 4.2 (Context of the Organization & Interested Parties) in ISO 22000:2018?',
        answer: 'Clause 4.1 requires identifying internal and external issues (e.g., cold chain infrastructure, climate, staff turnover, new food laws, cyber/power risks) that affect the FSMS. Clause 4.2 requires identifying relevant interested parties (customers, regulatory authorities like PFA/SFA/FDA, suppliers, consumers, certification bodies) and their specific food safety requirements.',
        keyTakeaway: 'SWOT/PESTLE analysis is commonly used for Clause 4.1, and a Stakeholder Matrix for Clause 4.2.'
      },
      {
        id: 'int-2-04',
        questionNumber: 4,
        topic: 'ISO 22000',
        question: 'What changed regarding OPRPs and CCPs in ISO 22000:2018 Clause 8.5.4 (Hazard Control Plan)?',
        answer: 'In the 2005 version, OPRPs were managed separately from the HACCP plan. In ISO 22000:2018 Clause 8.5.4, both CCPs and OPRPs are unified into a single "Hazard Control Plan." CCPs are governed by measurable Critical Limits, whereas OPRPs are governed by measurable or observable Action Criteria.',
        keyTakeaway: 'ISO 22000:2018 combines CCPs (Critical Limits) and OPRPs (Action Criteria) into the unified Hazard Control Plan.'
      },
      {
        id: 'int-2-05',
        questionNumber: 5,
        topic: 'ISO 22000',
        question: 'How does ISO 22000:2018 handle externally developed elements, processes, or outsourced services (Clause 7.1.6)?',
        answer: 'Under Clause 7.1.6, when an organization outsources any process (such as pest control, transport/cold-chain logistics, laboratory testing, calibration, or contract packaging), it must establish, implement, and maintain criteria for the evaluation, selection, monitoring of performance, and re-evaluation of external providers, and retain documented information.',
        keyTakeaway: 'Outsourced processes (pest control, calibration, 3PL cold storage) remain the responsibility of the food company.'
      },
      {
        id: 'int-2-06',
        questionNumber: 6,
        topic: 'ISO 22000',
        question: 'What is the difference between a Major Non-Conformity, Minor Non-Conformity, and Opportunity for Improvement (OFI) in an FSMS audit?',
        answer: 'A Major Non-Conformity is a complete breakdown of an FSMS requirement or a direct risk that unsafe food may reach the consumer (e.g., uncalibrated/bypassed CCP or falsified pasteurization logs). A Minor Non-Conformity is a single or isolated lapse in following a procedure or clause that does not immediately compromise food safety (e.g., one missed signature on a cleaning log). An OFI is a compliant practice that could be optimized further.',
        keyTakeaway: 'Major NC = systemic failure or direct food safety risk; Minor NC = isolated lapse without immediate safety failure.'
      },
      {
        id: 'int-2-07',
        questionNumber: 7,
        topic: 'ISO 22000',
        question: 'What are the mandatory inputs and outputs of Management Review (Clause 9.3) in ISO 22000:2018?',
        answer: 'Mandatory Inputs include status of previous actions, changes in external/internal issues, FSMS performance trends (nonconformities, corrective actions, monitoring/verification results, internal/external audit results, inspections, supplier performance, recall/emergency drills), adequacy of resources, and continual improvement opportunities. Outputs must include decisions and actions related to continual improvement, updates to the FSMS, and resource needs.',
        keyTakeaway: 'Management Review evaluates whether the FSMS is suitable, adequate, and effective, and allocates resources.'
      },
      {
        id: 'int-2-08',
        questionNumber: 8,
        topic: 'ISO 22000',
        question: 'What does ISO 22000:2018 Clause 8.4 require regarding Emergency Preparedness and Response?',
        answer: 'Top management must establish and maintain documented procedures to respond to potential emergency situations or incidents that impact food safety—such as power outages in cold rooms, water supply contamination, natural disasters/flooding, fire, bioterrorism/sabotage, or ammonia leaks—and must periodically test these procedures (emergency drills) where practicable.',
        keyTakeaway: 'Power failure in cold storage, contaminated municipal water, and fire/flood require documented response & drills.'
      },
      {
        id: 'int-2-09',
        questionNumber: 9,
        topic: 'ISO 22000',
        question: 'Why are ISO/TS 22002-1 (or sector-specific PRP standards) paired with ISO 22000 to achieve GFSI recognition (FSSC 22000)?',
        answer: 'ISO 22000 Clause 8.2 lists high-level PRP categories (building layout, utilities, pest control, hygiene) but does not specify detailed engineering/hygienic requirements so it can apply to any link in the food chain. GFSI requires prescriptive PRP details, so ISO/TS 22002-1 (Food Manufacturing) provides the exact technical PRP specifications.',
        keyTakeaway: 'ISO 22000 + ISO/TS 22002-1 + FSSC Additional Requirements = FSSC 22000 (GFSI benchmarked).'
      },
      {
        id: 'int-2-10',
        questionNumber: 10,
        topic: 'ISO 22000',
        question: 'How do you audit "Competence and Awareness" under Clause 7.2 and 7.3 of ISO 22000:2018?',
        answer: 'Instead of only checking training attendance sheets in HR, an auditor interviews CCP/OPRP operators on the shop floor: asking them what their Critical Limit is, what they do if the temperature drops, and why their task matters for consumer safety. Competence must be evaluated for effectiveness, not just attendance.',
        keyTakeaway: 'Audit competence by interviewing shop-floor operators on their CCP critical limits and corrective actions.'
      },
      {
        id: 'int-2-11',
        questionNumber: 11,
        topic: 'ISO 22000',
        question: 'What are the requirements for "Control of Monitoring and Measuring" (Calibration — Clause 8.7) in ISO 22000?',
        answer: 'All equipment used to monitor PRPs, OPRPs, and CCPs (thermometers, pH meters, weighing scales, pressure gauges, metal detectors) must be calibrated or verified at specified intervals against international/national traceable standards (e.g., NIST/ISO 17025), uniquely identified with calibration status labels, protected from unauthorized adjustment, and if found out of calibration, all product measured since the last valid calibration must be assessed!',
        keyTakeaway: 'If a thermometer is found out of calibration by +4°C, you must assess the safety of all batches checked with it.'
      },
      {
        id: 'int-2-12',
        questionNumber: 12,
        topic: 'ISO 22000',
        question: 'What is "Potentially Unsafe Product" under ISO 22000 Clause 8.9.4 and how is it handled?',
        answer: 'Any product manufactured under conditions where a CCP critical limit was violated—or an OPRP action criterion was not met and the cause is unknown—is classified as "Potentially Unsafe Product." It must be held under strict quarantine until a documented evaluation proves either: (a) the hazard was reduced to acceptable levels, (b) it will be reduced by a subsequent step, or (c) the product is reprocessed or destroyed.',
        keyTakeaway: 'Never release product from a CCP deviation without documented scientific evidence or reprocessing.'
      },
      {
        id: 'int-2-13',
        questionNumber: 13,
        topic: 'ISO 22000',
        question: 'Explain Internal vs. External Communication requirements in ISO 22000 Clause 7.4.',
        answer: 'External communication covers timely exchange of food safety information with suppliers (specs, CoA, allergens), customers/consumers (labeling, complaints, recalls), statutory/regulatory authorities, and certification bodies. Internal communication ensures that any change in recipes, raw materials, equipment, cleaning systems, or customer complaints is immediately communicated to the Food Safety Team.',
        keyTakeaway: 'If R&D or Engineering changes a line or ingredient without informing the Food Safety Team, Clause 7.4.3 is breached.'
      },
      {
        id: 'int-2-14',
        questionNumber: 14,
        topic: 'ISO 22000',
        question: 'What is the role and authority of the Food Safety Team Leader (FSTL) in Clause 5.3.2?',
        answer: 'Top management must appoint a Food Safety Team Leader who has the responsibility and authority to: (a) ensure the FSMS is established, implemented, maintained, and updated; (b) manage and organize the work of the Food Safety Team; (c) ensure relevant training and competencies for the team; and (d) report directly to top management on the effectiveness and suitability of the FSMS.',
        keyTakeaway: 'The FSTL must have direct reporting access to Top Management and authority to stop unsafe production.'
      },
      {
        id: 'int-2-15',
        questionNumber: 15,
        topic: 'ISO 22000',
        question: 'How do you distinguish between "Documented Procedure/Policy" (Maintain Documented Information) and "Records" (Retain Documented Information)?',
        answer: 'In ISO 22000:2018 terminology, "Maintain documented information" refers to live controlled documents (SOPs, manuals, policies, specifications) that tell staff what to do. "Retain documented information" refers to completed records (pasteurization logs, COA files, calibration certificates, audit reports) that provide objective evidence of what was done.',
        keyTakeaway: '"Maintain" = SOPs/Procedures; "Retain" = Records/Evidence.'
      },
      {
        id: 'int-2-16',
        questionNumber: 16,
        topic: 'ISO 22000',
        question: 'What is Risk-Based Thinking at the Organizational Level (Clause 6.1) vs. Operational Level (Clause 8.5)?',
        answer: 'Clause 6.1 addresses organizational risks and opportunities that could prevent the FSMS from achieving its intended results (e.g., supplier bankruptcy, skilled QA staff shortage, power grid instability, inflation of packaging materials). Clause 8.5 addresses operational food safety hazards (Biological, Chemical, Physical, Allergen) directly in the food product using HACCP.',
        keyTakeaway: 'Clause 6.1 = Business/Systemic FSMS Risks & Opportunities; Clause 8.5 = Product Hazard Analysis (HACCP).'
      },
      {
        id: 'int-2-17',
        questionNumber: 17,
        topic: 'ISO 22000',
        question: 'What are the key elements of an effective Internal Audit Program (Clause 9.2)?',
        answer: 'The Internal Audit Program must be planned based on the importance and risk status of processes, changes affecting the FSMS, and previous audit results. Auditors must be trained, competent, and independent (auditors cannot audit their own work/department). Findings must be reported to relevant management, and corrective actions closed with root cause verification.',
        keyTakeaway: 'Impartiality ("never audit your own work") and risk-based scheduling are mandatory in Clause 9.2.'
      },
      {
        id: 'int-2-18',
        questionNumber: 18,
        topic: 'ISO 22000',
        question: 'How should Document Control (Clause 7.5.3) be maintained on the production floor?',
        answer: 'All SOPs and log sheets on the factory floor must have a unique document ID, version/revision number, effective date, and authorization signature. Obsolete versions must be immediately removed from points of use to prevent operators from using outdated critical limits or recipes.',
        keyTakeaway: 'Finding an obsolete SOP or unnumbered photocopy on the production floor is a classic Document Control non-conformity.'
      },
      {
        id: 'int-2-19',
        questionNumber: 19,
        topic: 'ISO 22000',
        question: 'What is required for Withdrawal and Recall under ISO 22000 Clause 8.9.5?',
        answer: 'The organization must establish a documented procedure and appoint competent personnel with authority to initiate and execute a product withdrawal or recall. Retained stock in warehouses must be secured, affected customers/regulators notified, root cause investigated, and the effectiveness of the recall system verified periodically via timed Mock Recall drills.',
        keyTakeaway: 'Mock recalls verify 100% mass-balance reconciliation (generally within 2–4 hours) from raw material to customer.'
      },
      {
        id: 'int-2-20',
        questionNumber: 20,
        topic: 'ISO 22000',
        question: 'How do you write a clear, audit-grade Non-Conformity Statement during an ISO 22000 audit?',
        answer: 'Every professional Non-Conformity statement must contain 3 clear parts: (1) The Requirement (exact ISO 22000 clause or company SOP breached), (2) The Failure/Statement of Non-Conformity, and (3) The Objective Evidence (exact batch number, thermometer ID, date, time, or record observed during the audit).',
        keyTakeaway: 'Formula for Audit NC: Requirement (Clause) + Failure + Verifiable Objective Evidence.'
      }
    ]
  },
  {
    id: 'interview-set-3',
    setNumber: 3,
    title: 'Set 3: FSSC 22000 Version 6, TACCP, VACCP & Allergen Control',
    subtitle: '20 Advanced Questions on GFSI Benchmarking, Food Defense, Food Fraud, Food Safety Culture & FSSC v6',
    focusStandards: ['FSSC 22000 v6', 'TACCP & VACCP', 'Allergen Control', 'Food Safety Culture'],
    questionsCount: 20,
    questions: [
      {
        id: 'int-3-01',
        questionNumber: 1,
        topic: 'FSSC 22000',
        question: 'What are the 3 core components that make up FSSC 22000 Certification?',
        answer: 'FSSC 22000 consists of three pillars: (1) ISO 22000:2018 (the management system & HACCP framework), (2) Sector-Specific Prerequisite Programs (such as ISO/TS 22002-1 for Food Manufacturing or ISO/TS 22002-4 for Food Packaging), and (3) FSSC 22000 Additional Requirements (Part 2 of the Scheme, covering Food Defense, Food Fraud, Allergen Management, Environmental Monitoring, Food Safety & Quality Culture, etc.).',
        keyTakeaway: 'FSSC 22000 = ISO 22000 + ISO/TS 22002-x + FSSC Additional Requirements.'
      },
      {
        id: 'int-3-02',
        questionNumber: 2,
        topic: 'FSSC 22000',
        question: 'What are the major new updates introduced in FSSC 22000 Version 6 compared to Version 5.1?',
        answer: 'Key updates in FSSC 22000 v6 include: (1) Mandatory Food Safety and Quality Culture objectives and action plan (2.5.8), (2) Quality Control requirements including net weight/volume and label verification (2.5.9), (3) Equipment Management and hygienic design specifications for new equipment (2.5.15), (4) Food Loss and Waste reduction strategy (2.5.16), and (5) Stricter Communication requirements with the Certification Body within 3 working days for serious events/recalls (2.5.17).',
        keyTakeaway: 'Highlight Food Safety Culture, Quality Control (weight/packaging checks), Hygienic Equipment Design, and Food Waste in v6.'
      },
      {
        id: 'int-3-03',
        questionNumber: 3,
        topic: 'FSSC 22000',
        question: 'Explain the difference between HACCP, TACCP, and VACCP.',
        answer: 'HACCP (Hazard Analysis Critical Control Point) prevents unintentional/accidental biological, chemical, and physical contamination. TACCP (Threat Assessment Critical Control Point — Food Defense) prevents intentional, ideologically or maliciously motivated contamination/sabotage (tampering, bioterrorism, disgruntled insiders). VACCP (Vulnerability Assessment Critical Control Point — Food Fraud) prevents intentional, economically motivated adulteration (EMA), substitution, dilution, or counterfeiting (e.g., melamine in milk, water/urea in milk, Sudan dye in spices).',
        keyTakeaway: 'HACCP = Unintentional Safety; TACCP = Intentional Malicious Sabotage (Defense); VACCP = Economically Motivated Fraud.'
      },
      {
        id: 'int-3-04',
        questionNumber: 4,
        topic: 'FSSC 22000',
        question: 'How do you conduct a Food Fraud Vulnerability Assessment (VACCP) under FSSC 22000?',
        answer: 'Evaluate all raw materials, ingredients, and packaging against vulnerability factors: (1) Economic price fluctuations and high market value (e.g., olive oil, honey, saffron, milk powder, spices), (2) Historical fraud incidents globally, (3) Supply chain complexity (brokers vs. direct manufacturers), (4) Ease of adulteration and routine test detectability. High-vulnerability materials require a documented Food Fraud Mitigation Plan (approved direct suppliers, CoA authenticity, FTIR/isotope or adulteration testing, tamper-evident seals).',
        keyTakeaway: 'Assess Opportunity, Motivation (economic gain), and Control Measures for every raw material.'
      },
      {
        id: 'int-3-05',
        questionNumber: 5,
        topic: 'FSSC 22000',
        question: 'How do you implement a Food Defense Plan (TACCP) in a food manufacturing facility?',
        answer: 'Conduct a Threat Assessment across the perimeter, utilities, storage, and production areas using methodologies like CARVER+Shock. Implement physical and operational controls: perimeter fencing, CCTV surveillance, security guards, biometric/keycard access to sensitive areas (water tanks, CIP chemical stores, spice/premix rooms, bulk silos), visitor sign-in and escort policies, background screening of staff, and locked tanker dome seals verification.',
        keyTakeaway: 'Water tanks, bulk silos, chemical rooms, and premix blending rooms are top priority zones in TACCP.'
      },
      {
        id: 'int-3-06',
        questionNumber: 6,
        topic: 'FSSC 22000',
        question: 'What are the 9 Major Food Allergens ("Big 9" / Codex Major Allergens) and how are they controlled in a plant?',
        answer: 'The major allergens include Milk/Dairy, Eggs, Fish, Crustacean Shellfish, Tree Nuts, Peanuts, Wheat/Cereals containing Gluten, Soybeans, and Sesame (plus Mustard, Celery, Lupin, Sulphites > 10 mg/kg in EU/UK). Plant controls include: segregated color-coded storage and utensils, scheduling allergen runs at the end of production before full wet CIP/sanitation, validated allergen protein swabbing (ELISA/lateral flow swabs) after changeover, rework "like-into-like" only, and strict label verification before every run.',
        keyTakeaway: 'Undeclared allergens are the #1 cause of global food recalls—always verify label artwork and changeover swabs.'
      },
      {
        id: 'int-3-07',
        questionNumber: 7,
        topic: 'FSSC 22000',
        question: 'What is the 4-Zone Environmental Monitoring Program (EMP) concept required under FSSC 22000 (2.5.7)?',
        answer: 'Environmental Monitoring divides the plant into 4 hygienic zones for pathogen (Listeria spp., Salmonella) and indicator swabbing: Zone 1: Direct Food Contact Surfaces (conveyors, slicers, filler nozzles, mixing blades); Zone 2: Non-food contact surfaces immediately adjacent to Zone 1 (machine frames, control panels, splash guards); Zone 3: Non-food contact surfaces inside the processing room (drains, floors, walls, forklifts, air handling units); Zone 4: Areas outside the processing room (warehouses, locker rooms, corridors).',
        keyTakeaway: 'Zone 1 = Direct food contact; Zone 2 = Adjacent equipment; Zone 3 = Room floors/drains/walls; Zone 4 = Outside production.'
      },
      {
        id: 'int-3-08',
        questionNumber: 8,
        topic: 'FSSC 22000',
        question: 'Why are floor drains in high-care/ready-to-eat (RTE) zones considered a high risk for Listeria monocytogenes?',
        answer: 'Listeria monocytogenes is a psychrotrophic pathogen that thrives in cool, wet environments and forms protective biofilms inside floor drains. High-pressure water hosing of drains creates aerosols that can land directly on Zone 1 exposed RTE food surfaces. Therefore, drains must never be cleaned with high-pressure hoses during production, and dedicated color-coded drain brushes must be used.',
        keyTakeaway: 'Never use high-pressure hoses on floor drains during or near exposed food production—it aerosolizes Listeria biofilms.'
      },
      {
        id: 'int-3-09',
        questionNumber: 9,
        topic: 'FSSC 22000',
        question: 'What is "Food Safety Culture" and how do you measure it for FSSC 22000 v6 / BRCGS Issue 9 audits?',
        answer: 'Food Safety Culture is the shared values, beliefs, and norms that affect mindset and behavior toward food safety across all levels of an organization ("how people act when no one is watching"). It is measured via anonymous employee surveys, near-miss reporting rates, walk-the-talk leadership gemba walks, KPI tracking, training behavioral assessments, and positive recognition for operators who stop the line for food safety issues.',
        keyTakeaway: 'GFSI standards require a documented Food Safety Culture Action Plan with measurable timelines and employee feedback.'
      },
      {
        id: 'int-3-10',
        questionNumber: 10,
        topic: 'FSSC 22000',
        question: 'What are the FSSC 22000 v6 requirements for Quality Control (Additional Requirement 2.5.9)?',
        answer: 'FSSC 22000 v6 requires organizations to establish a systematic Quality Control procedure including: (1) Product specification parameters and release criteria, (2) Startup and on-line checks of packaging labels (date coding, batch number, allergen declaration, barcode), (3) Legal net weight/volume control (metrological checks), and (4) Statistical trend analysis of quality parameters.',
        keyTakeaway: 'FSSC 22000 v6 integrated legal weight/volume control and online label verification into mandatory scheme requirements.'
      },
      {
        id: 'int-3-11',
        questionNumber: 11,
        topic: 'FSSC 22000',
        question: 'How do you validate an Allergen Cleaning Procedure on a shared processing line?',
        answer: 'Conduct a worst-case validation trial (after producing the highest-concentration sticky/particulate allergen recipe): execute the documented cleaning SOP, perform visual inspection ("visually clean" to zero residue), swab hard-to-clean points (dead legs, gaskets, auger shafts) using a validated allergen-specific lateral flow or send samples for quantitative ELISA testing (< LOD, e.g., < 5 ppm), and test the first batch of the subsequent non-allergen product across 3 consecutive runs.',
        keyTakeaway: 'Allergen validation requires 3 consecutive successful trials combining visual inspection, surface ELISA/swabs, and first-product testing.'
      },
      {
        id: 'int-3-12',
        questionNumber: 12,
        topic: 'FSSC 22000',
        question: 'What are Unannounced Audits in FSSC 22000 and how often must they occur?',
        answer: 'Under GFSI and FSSC 22000 rules, at least 1 out of every 3 surveillance/recertification audits in a 3-year certification cycle MUST be completely unannounced. The certification body auditor arrives at the factory without prior notice of the date, and the site must grant access within 1 hour of arrival.',
        keyTakeaway: 'At least 1 unannounced surveillance audit is mandatory every 3-year cycle; keep audit-ready records daily.'
      },
      {
        id: 'int-3-13',
        questionNumber: 13,
        topic: 'FSSC 22000',
        question: 'What is Positive Release and when is it mandatory in food manufacturing?',
        answer: 'Positive Release means finished product batches remain quarantined on physical/ERP hold in the warehouse and cannot be dispatched until all required QA checks—including CCP log review, organoleptic evaluation, chemical specs, and microbiological clearance (especially for infant formula, dairy, and RTE foods)—are completed and signed off by an authorized QA officer.',
        keyTakeaway: 'Positive Release blocks dispatch in ERP/warehouse until all lab and CCP clearances are verified.'
      },
      {
        id: 'int-3-14',
        questionNumber: 14,
        topic: 'FSSC 22000',
        question: 'What are the rules for using the FSSC 22000 Logo (Additional Requirement 2.5.5)?',
        answer: 'Certified organizations may use the FSSC 22000 logo on marketing materials, websites, and letterheads, but are STRICTLY FORBIDDEN from printing the FSSC 22000 logo on food product labels, primary/secondary product packaging, or Certificates of Analysis (CoAs), because FSSC 22000 is a management system certification, not a product certification.',
        keyTakeaway: 'Never put the FSSC 22000 or ISO 22000 logo on a food product wrapper or CoA.'
      },
      {
        id: 'int-3-15',
        questionNumber: 15,
        topic: 'FSSC 22000',
        question: 'What does FSSC 22000 v6 require for Equipment Management and Hygienic Design (2.5.15)?',
        answer: 'Before purchasing or installing new processing equipment (or modifying existing equipment), the organization must define a hygienic design specification addressing smooth food-grade surfaces (e.g., SS 304/316), absence of dead legs/crevices, self-draining geometry, and cleanability. A documented risk-based Change Management & Commissioning validation must be completed before commercial production begins.',
        keyTakeaway: 'New machinery requires a Hygienic Design Specification and pre-startup QA commissioning sign-off.'
      },
      {
        id: 'int-3-16',
        questionNumber: 16,
        topic: 'FSSC 22000',
        question: 'What is Cross-Contamination vs. Cross-Contact in food safety terminology?',
        answer: 'Cross-Contamination typically refers to the transfer of biological pathogens (like Salmonella or E. coli) from raw food/surfaces to ready-to-eat food (which can often be killed by cooking). Cross-Contact refers specifically to the unintended transfer of an Allergen protein from an allergen-containing food to an allergen-free food—cooking or baking does NOT destroy allergen proteins!',
        keyTakeaway: 'Cooking kills bacteria (Cross-Contamination), but thermal cooking does NOT denature/destroy food allergens (Cross-Contact).'
      },
      {
        id: 'int-3-17',
        questionNumber: 17,
        topic: 'FSSC 22000',
        question: 'When is Precautionary Allergen Labeling (PAL, e.g., "May contain traces of nuts") legally and ethically allowed?',
        answer: 'Under FSSC 22000 and Codex guidelines, "May contain" (PAL) labeling must never be used as a lazy substitute for GMP and allergen cleaning. It is only permitted when a documented quantitative Allergen Risk Assessment (such as VITAL) proves that despite thorough cleaning and GMP controls, an unavoidable risk of particulate cross-contact remains on shared equipment.',
        keyTakeaway: 'PAL ("May contain") requires a documented risk assessment and cannot replace proper cleaning.'
      },
      {
        id: 'int-3-18',
        questionNumber: 18,
        topic: 'FSSC 22000',
        question: 'What are the FSSC 22000 requirements for Foreign Material Management and Brittle Materials?',
        answer: 'Glass and brittle clear plastic must be excluded from open production areas wherever possible. Any essential glass/plastic (sight glasses, instrument dials, light diffusers) must be listed on a Glass & Brittle Plastic Register, protected with shatterproof sleeves, and inspected on a scheduled frequency. If breakage occurs, the line must stop, affected product within the blast radius discarded, and QA sign-off obtained before restart.',
        keyTakeaway: 'Maintain a Glass & Brittle Plastic Register with regular integrity audits and a strict Breakage SOP.'
      },
      {
        id: 'int-3-19',
        questionNumber: 19,
        topic: 'FSSC 22000',
        question: 'Within how many days must a certified site notify its Certification Body of a food recall, regulatory action, or major food safety outbreak?',
        answer: 'Under FSSC 22000 Version 6 (2.5.17 Communication Requirements), the organization must notify its Certification Body within 3 working days of any serious event affecting food safety, legality, or certification integrity (including public product recalls, regulatory enforcement actions, or natural disasters).',
        keyTakeaway: '3 working days is the strict FSSC 22000 v6 deadline to report recalls or serious events to the Certification Body.'
      },
      {
        id: 'int-3-20',
        questionNumber: 20,
        topic: 'FSSC 22000',
        question: 'How are High-Risk / High-Care Production Zones designed under ISO/TS 22002-1?',
        answer: 'High-Care / High-Risk zones (for RTE chilled products) require physical segregation from raw/low-risk areas, positive filtered air pressure (HEPA/F7–F9 filtration) so air flows outward, dedicated captive footwear and color-coded PPE changed at a barrier hygiene lobby, no floor-level raw material traffic, and sloped smooth epoxy floors without standing water.',
        keyTakeaway: 'Positive air pressure, barrier changing lobbies, and dedicated color-coded tools/PPE protect High-Care zones.'
      }
    ]
  },
  {
    id: 'interview-set-4',
    setNumber: 4,
    title: 'Set 4: Plant QA/QC Operations, GMP/GHP, CIP Sanitation & Traceability',
    subtitle: '20 Practical Factory-Floor Interview Questions on CIP/COP, ATP Swabbing, Pest Control, FIFO/FEFO & Mock Recalls',
    focusStandards: ['GMP / GHP', 'CIP & Sanitation', 'Traceability & Recall', 'Pest Control'],
    questionsCount: 20,
    questions: [
      {
        id: 'int-4-01',
        questionNumber: 1,
        topic: 'Food Safety & GMP',
        question: 'What are the 5 standard steps (and chemical parameters) of a typical Dairy/Beverage 5-Step CIP (Clean-In-Place) cycle?',
        answer: 'Step 1: Pre-Rinse with ambient/warm water (40–50°C for 5–10 min) to flush loose soil. Step 2: Caustic Wash (1.5%–2.0% NaOH at 70–80°C for 20–30 min, flow velocity ≥ 1.5 m/s) to saponify fats and peptize proteins. Step 3: Intermediate Water Rinse to remove caustic residue (verified by phenolphthalein/conductivity). Step 4: Acid Wash (0.8%–1.2% Nitric/Phosphoric acid at 60–65°C for 15–20 min) to dissolve milkstone/mineral scale. Step 5: Final Potable Water Rinse + Thermal or Chemical Sanitization (e.g., Peracetic Acid 150–200 ppm or hot water at 85°C).',
        keyTakeaway: 'Remember TACT for CIP: Time, Action (turbulence ≥ 1.5 m/s), Chemical concentration (NaOH/Acid), and Temperature.'
      },
      {
        id: 'int-4-02',
        questionNumber: 2,
        topic: 'Food Safety & GMP',
        question: 'Explain the difference between Cleaning, Disinfection, Sanitization, and Sterilization.',
        answer: 'Cleaning is the physical and chemical removal of visible food soil, grease, and dirt using detergent and water. Sanitization/Disinfection is the reduction of vegetative microorganisms on a pre-cleaned surface to safe public health levels (typically a 99.999% or 5-log reduction). Sterilization is the complete destruction of all forms of microbial life, including highly resistant bacterial endospores (e.g., UHT or retort processing). You cannot sanitize a dirty surface!',
        keyTakeaway: 'Always clean with detergent BEFORE applying sanitizer—organic soil inactivates chlorine and QAC sanitizers.'
      },
      {
        id: 'int-4-03',
        questionNumber: 3,
        topic: 'Food Safety & GMP',
        question: 'How does ATP Bioluminescence Swabbing work and what does it measure?',
        answer: 'ATP (Adenosine Triphosphate) swabbing uses the luciferin-luciferase enzyme reaction to produce light proportional to the amount of ATP present on a surface, measured in Relative Light Units (RLU) within 15 seconds. It measures total biological residue (both food organic debris and microbial cells) to give immediate Pass/Caution/Fail feedback on cleaning effectiveness before line startup.',
        keyTakeaway: 'ATP swabs give 15-second verification of surface cleanliness (food residue + cells) in RLU units.'
      },
      {
        id: 'int-4-04',
        questionNumber: 4,
        topic: 'Food Safety & GMP',
        question: 'What is the difference between FIFO and FEFO in warehouse inventory management?',
        answer: 'FIFO (First-In, First-Out) dispatches stock based on the date it arrived in the warehouse. FEFO (First-Expired, First-Out) dispatches stock based on the shortest remaining shelf-life / earliest expiration date, regardless of when it arrived. In food manufacturing, FEFO is the gold standard for raw materials and finished goods so no batch expires in storage.',
        keyTakeaway: 'FEFO (First-Expired, First-Out) always takes priority over FIFO for perishable food ingredients.'
      },
      {
        id: 'int-4-05',
        questionNumber: 5,
        topic: 'Food Safety & GMP',
        question: 'How do you execute a Forward and Backward Traceability / Mock Recall exercise?',
        answer: 'Select a random finished product batch or raw material lot. In Backward Traceability, trace the finished batch back to all raw material lots, packaging reels, processing CCP logs, and supplier CoAs. In Forward Traceability, trace one raw material lot forward to every finished batch it entered, warehouse remaining stock, and every customer invoice/delivery address. Calculate Mass Balance (Quantity Received vs. Used + Waste + In-Stock; target 98%–102% within ≤ 4 hours).',
        keyTakeaway: 'A successful Mock Recall achieves 98%–102% Mass Balance reconciliation within under 4 hours.'
      },
      {
        id: 'int-4-06',
        questionNumber: 6,
        topic: 'Food Safety & GMP',
        question: 'What are the rules for Integrated Pest Management (IPM) and bait stations inside a food plant?',
        answer: 'Toxic rodenticide bait blocks are strictly prohibited inside food processing and open storage areas due to the risk of bait translocation into food. Perimeter external walls use locked, tamper-resistant, anchored toxic bait stations spaced every 15–30 meters. Inside the building perimeter, only mechanical snap traps/live catch traps, pheromone traps, and shatterproof-tube Electric Fly Killers (EFKs, placed ≥ 3 meters away from open food and not above conveyors) are permitted.',
        keyTakeaway: 'Never place toxic poison bait inside production or food storage areas—use mechanical traps and shatterproof EFKs.'
      },
      {
        id: 'int-4-07',
        questionNumber: 7,
        topic: 'Food Safety & GMP',
        question: 'Why must Electric Fly Killers (EFKs / Insectocutors) use sticky glue boards and shatterproof UV tubes in production areas?',
        answer: 'High-voltage zapping grids explode insects upon contact, scattering insect body fragments up to 2 meters into the air and onto open food lines. Glue-board UV units silently trap insects on an adhesive board (allowing pest trend counting by species), and FEP-coated shatterproof UV lamps prevent glass shards if a bulb breaks.',
        keyTakeaway: 'Use UV Glue-Board units (not high-voltage zappers) with shatterproof bulbs in food handling areas.'
      },
      {
        id: 'int-4-08',
        questionNumber: 8,
        topic: 'Food Safety & GMP',
        question: 'What is the correct handwashing sequence and duration required for food handlers?',
        answer: 'A minimum 20-second handwashing procedure: (1) Wet hands with warm potable running water, (2) Apply bactericidal unscented liquid soap, (3) Rub palms, backs of hands, between fingers, thumbs, nail beds, and wrists for at least 20 seconds, (4) Rinse thoroughly under hands-free (knee/foot/sensor) tap, (5) Dry completely with single-use paper towels (not warm air dryers that aerosolize bacteria), and (6) Apply 70% alcohol hand rub.',
        keyTakeaway: 'Unscented bactericidal soap, 20+ seconds scrubbing, hands-free taps, and disposable paper towels.'
      },
      {
        id: 'int-4-09',
        questionNumber: 9,
        topic: 'Food Safety & GMP',
        question: 'What are the food industry rules regarding jewelry, fingernails, perfumes, and blue detectable plasters?',
        answer: 'Wristwatches, rings (except a plain smooth wedding band if allowed by site policy), earrings, false eyelashes, nail polish, artificial nails, and strong perfumes (which taint high-fat foods) are strictly prohibited. Any minor cut on the hand must be covered with a waterproof, metal-detectable BLUE bandage (blue does not occur naturally in food and contains an aluminum strip detectable by the line metal detector) plus a food-grade nitrile glove.',
        keyTakeaway: 'Blue metal-detectable plasters provide both visual contrast and electromagnetic detection.'
      },
      {
        id: 'int-4-10',
        questionNumber: 10,
        topic: 'Food Safety & GMP',
        question: 'How do you investigate a Customer Foreign Body or Spoilage Complaint using Root Cause Analysis?',
        answer: 'Log the complaint, check the batch retention sample from the QA library, review production/CCP/sieve/metal detector logs and staff attendance for that shift, and apply the 5-Whys or Fishbone (Ishikawa: 6Ms — Man, Machine, Material, Method, Measurement, Mother Nature) method to identify the true systemic root cause, implement CAPA (Corrective and Preventive Action), and verify effectiveness after 30 days.',
        keyTakeaway: 'Always check the Retention Sample first, then apply 5-Whys and Fishbone (6Ms) analysis.'
      },
      {
        id: 'int-4-11',
        questionNumber: 11,
        topic: 'Food Safety & GMP',
        question: 'What are the key checks performed during Incoming Raw Material & Vehicle Inspection at the receiving bay?',
        answer: 'Before unloading: (1) Inspect vehicle hygiene (clean, free of pests, odors, chemicals, or non-food cargo), (2) Check cold-chain core & air temperature for chilled (≤ 4°C) or frozen (≤ -18°C) goods, (3) Verify security seal number against dispatch documents, (4) Check Certificate of Analysis (CoA) and Halal certificate, (5) Inspect packaging integrity, production/expiry dates (minimum 75% remaining shelf life), and draw representative composite samples using AQL sampling plans.',
        keyTakeaway: 'Check truck hygiene, seal integrity, temperature, CoA, shelf-life (>75%), and AQL sampling before unloading.'
      },
      {
        id: 'int-4-12',
        questionNumber: 12,
        topic: 'Food Safety & GMP',
        question: 'What are the three most common chemical sanitizers used in food plants and their working concentrations?',
        answer: '(1) Sodium Hypochlorite (Chlorine): 50–200 ppm for hard food-contact surfaces (pH 6.0–7.5; inexpensive and broad-spectrum, but corrosive to stainless steel at high ppm/low pH). (2) Quaternary Ammonium Compounds (QAC / Quats): 200–400 ppm (non-corrosive, residual film activity on floors/drains/walls against Listeria). (3) Peracetic Acid (PAA): 100–200 ppm (ideal for cold CIP cycles, breaks down into harmless acetic acid, oxygen, and water with no toxic residue).',
        keyTakeaway: 'Chlorine (50–200 ppm), Quats/QAC (200–400 ppm), and Peracetic Acid/PAA (100–200 ppm).'
      },
      {
        id: 'int-4-13',
        questionNumber: 13,
        topic: 'Food Safety & GMP',
        question: 'Why is compressed air or culinary steam considered a food safety risk if not properly filtered?',
        answer: 'Compressed air that directly contacts food or primary packaging (e.g., blowing out bottles or agitating tanks) can carry compressor oil droplets, rust, condensed water, and mold spores. Under ISO/TS 22002-1, food-contact compressed air must be oil-free and filtered through a 0.01-micron sterile point-of-use filter. Culinary steam must be generated from potable water using food-grade boiler chemicals.',
        keyTakeaway: 'Food-contact compressed air requires oil-free compressors and 0.01-micron sterile point-of-use filtration.'
      },
      {
        id: 'int-4-14',
        questionNumber: 14,
        topic: 'Food Safety & GMP',
        question: 'What is Color-Coding of cleaning tools and utensils in a food factory and why is it mandatory?',
        answer: 'Color-coding prevents cross-contamination between hygienic zones and allergens. For example: Red = Toilets/Washrooms; Yellow = Floor drains & waste areas; Blue = General food contact equipment; Green = Raw/Allergen specific zones; White = Bakery/Dairy direct contact. Brushes and squeegees must be food-grade plastic (no wooden handles, as wood splinters and harbors mold) and hung on shadow boards off the floor.',
        keyTakeaway: 'No wooden handles in food plants; use color-coded food-grade brushes stored on wall shadow boards.'
      },
      {
        id: 'int-4-15',
        questionNumber: 15,
        topic: 'Food Safety & GMP',
        question: 'What is a Temporary Repair Policy (Maintenance GMP) in a food processing plant?',
        answer: 'Temporary repairs using string, wire, cardboard, masking tape, or cable ties are strictly prohibited because they fall into food. If an emergency engineering modification is unavoidable, it must be logged on a Temporary Repair Register, made with food-grade detectable materials without risking product contamination, and permanently engineered out within a strict timeframe (e.g., 7–14 days) followed by post-maintenance hygiene clearance.',
        keyTakeaway: 'Never allow tape, cardboard, or wire fixes on lines; enforce Post-Maintenance Hygiene Handover sign-offs.'
      },
      {
        id: 'int-4-16',
        questionNumber: 16,
        topic: 'Food Safety & GMP',
        question: 'What is a Post-Maintenance Hygiene Handover and why do auditors check it closely?',
        answer: 'Whenever maintenance technicians repair a machine during or between runs, they may leave grease, metal filings, nuts, bolts, or tools behind. A Post-Maintenance Handover form requires the technician to account for 100% of tools/parts taken to the line (Tool Reconciliation) and requires Production/QA to verify that the machine was cleaned and sanitized before restarting production.',
        keyTakeaway: '100% Tool & Spare-Parts Reconciliation + Sanitization sign-off before restarting a repaired machine.'
      },
      {
        id: 'int-4-17',
        questionNumber: 17,
        topic: 'Food Safety & GMP',
        question: 'What are the storage rules for pallets and stacking inside a food warehouse?',
        answer: 'All materials must be stored off the floor on clean pallets (plastic pallets preferred in production areas) and kept at least 45 cm (18 inches) away from walls ("inspection perimeter strip") so pest control traps can be inspected, air can circulate, and cleaners can sweep along the wall-floor junction.',
        keyTakeaway: 'Maintain the 45 cm (18-inch) white inspection line gap between pallets and warehouse walls.'
      },
      {
        id: 'int-4-18',
        questionNumber: 18,
        topic: 'Food Safety & GMP',
        question: 'How should Rework (reprocessing of in-process product) be controlled to protect traceability and safety?',
        answer: 'Rework must be clearly labeled with original product name, batch number, date/time generated, and allergen status, stored in covered food-grade containers, protected from contamination, only added "like-into-like" (same recipe/allergen profile) at a validated percentage, and recorded on the batch sheet so full forward/backward traceability is maintained.',
        keyTakeaway: 'Unlabeled buckets of rework break traceability and allergen safety—every rework bin must have batch & allergen labels.'
      },
      {
        id: 'int-4-19',
        questionNumber: 19,
        topic: 'Food Safety & GMP',
        question: 'What is the standard microbiological and chemical criteria for Potable Water used in food manufacturing?',
        answer: 'Water contacting food or food surfaces must meet WHO / national potable water standards: Total Coliforms and E. coli / fecal coliforms must be 0 CFU/100 mL (absent), pH between 6.5 and 8.5, turbidity < 1–5 NTU, and free residual chlorine maintained at 0.2–0.5 ppm at terminal points of use (tested daily, with full microbiological and chemical lab analysis at least annually/semi-annually).',
        keyTakeaway: 'E. coli and Coliforms must be 0 per 100 mL, with 0.2–0.5 ppm free residual chlorine at terminal taps.'
      },
      {
        id: 'int-4-20',
        questionNumber: 20,
        topic: 'Food Safety & GMP',
        question: 'What is Employee Medical Screening and Return-to-Work Policy for food handlers?',
        answer: 'All food handlers undergo pre-employment and annual medical screening (stool/blood tests for Typhoid/Salmonella, Hepatitis A, tuberculosis, skin infections). Employees suffering from vomiting, diarrhea, jaundice, fever, or infected skin lesions must report immediately, be excluded from food handling areas, and only return after 48 hours symptom-free with medical clearance.',
        keyTakeaway: '48-hour symptom-free rule after vomiting or diarrhea before returning to open food handling.'
      }
    ]
  },
  {
    id: 'interview-set-5',
    setNumber: 5,
    title: 'Set 5: Food Science, Microbiology, Thermal Processing & Lab QA',
    subtitle: '20 Technical Questions on Water Activity, D/Z Values, Pasteurization, Brix/Acidity, Shelf-Life & Halal Standards',
    focusStandards: ['Food Science', 'Microbiology', 'Thermal Processing', 'QA Lab Testing'],
    questionsCount: 20,
    questions: [
      {
        id: 'int-5-01',
        questionNumber: 1,
        topic: 'Food Science & QA',
        question: 'What is the difference between Moisture Content (%) and Water Activity (aw), and which is more important for microbial shelf life?',
        answer: 'Moisture Content measures the total amount of water (bound + free) in a food as a percentage of weight. Water Activity (aw, scale 0.0 to 1.0) measures only the "free/unbound" water available for microbial growth and chemical reactions (vapor pressure of food divided by vapor pressure of pure water). Water activity is far more critical for shelf life: pathogenic bacteria generally stop growing below aw 0.85 (Staphylococcus aureus aerobic down to 0.86), yeasts below 0.80, and xerophilic molds below 0.60.',
        keyTakeaway: 'Microbes cannot use bound water—Water Activity (aw < 0.85) controls pathogen growth, not total moisture %.'
      },
      {
        id: 'int-5-02',
        questionNumber: 2,
        topic: 'Food Science & QA',
        question: 'Why is pH 4.6 the critical dividing line between Acid Foods and Low-Acid Canned Foods?',
        answer: 'Clostridium botulinum spores (which produce the deadly neurotoxin botulinum under anaerobic conditions) cannot germinate, grow, or produce toxin at a pH of 4.6 or below. Therefore, high-acid foods (pH ≤ 4.6, like fruit juices, pickles, tomato ketchup) only require pasteurization/hot-fill (85–95°C) to destroy vegetative cells, molds, and yeasts, whereas low-acid canned foods (pH > 4.6, like canned vegetables, meat, milk) require pressure retort sterilization (121.1°C) for a 12D botulinum cook.',
        keyTakeaway: 'pH 4.6 is the growth cutoff for Clostridium botulinum spores.'
      },
      {
        id: 'int-5-03',
        questionNumber: 3,
        topic: 'Food Science & QA',
        question: 'Explain D-value, Z-value, and F0-value in thermal processing.',
        answer: 'D-value (Decimal Reduction Time) is the time in minutes at a specific constant temperature required to destroy 90% (1 log cycle) of a target microorganism population. Z-value is the temperature change (in °C) required to change the D-value by a factor of 10 (1 log). F0-value is the equivalent thermal lethality time in minutes at a reference temperature of 121.1°C (250°F) assuming a Z-value of 10°C (a minimum F0 of 3.0 minutes achieves the 12-log "12D" reduction of Clostridium botulinum spores in low-acid canned foods).',
        keyTakeaway: 'D-value = time for 1-log (90%) kill; Z-value = temp change to alter D by 10x; F0 = total lethality at 121.1°C.'
      },
      {
        id: 'int-5-04',
        questionNumber: 4,
        topic: 'Food Science & QA',
        question: 'Why is Coxiella burnetii (and Alkaline Phosphatase enzyme) targeted in milk pasteurization (72°C for 15 sec)?',
        answer: 'Coxiella burnetii (the causative agent of Q fever) is the most heat-resistant non-spore-forming pathogen found in raw milk, so pasteurization time-temperature combinations (63°C for 30 min LTLT or 72°C for 15 sec HTST) are designed to achieve at least a 5-log reduction of C. burnetii. Alkaline Phosphatase is an indigenous milk enzyme with slightly higher heat resistance than C. burnetii—so a negative Alkaline Phosphatase test confirms complete pasteurization and absence of raw milk contamination.',
        keyTakeaway: 'A negative Alkaline Phosphatase test is the universal rapid lab proof of successful milk pasteurization.'
      },
      {
        id: 'int-5-05',
        questionNumber: 5,
        topic: 'Food Science & QA',
        question: 'What is the Maillard Reaction vs. Caramelization in food chemistry?',
        answer: 'The Maillard Reaction is a non-enzymatic browning reaction between the carbonyl group of a reducing sugar (e.g., glucose, lactose, fructose) and the free amino group of an amino acid/protein under heat, generating complex roasted/baked flavors, melanoidin brown pigments, and potentially acrylamide in starchy foods cooked >120°C. Caramelization is the pyrolysis (thermal decomposition) of sugars alone at high temperatures (>160°C) without any amino acids or proteins.',
        keyTakeaway: 'Maillard = Reducing Sugar + Amino Acid/Protein; Caramelization = Sugar pyrolysis alone at high heat.'
      },
      {
        id: 'int-5-06',
        questionNumber: 6,
        topic: 'Food Science & QA',
        question: 'How do you determine the Shelf Life of a newly developed food product (Real-Time vs. Accelerated Shelf-Life Testing - ASLT)?',
        answer: 'Real-Time Shelf-Life Testing stores the product under actual recommended storage conditions (e.g., 25°C ambient or 4°C chilled) and tests microbiological, chemical (peroxide value, free fatty acids, pH, vitamin loss), physical (texture, syneresis), and sensory attributes at intervals up to 120% of target life. Accelerated Shelf-Life Testing (ASLT) stores ambient shelf-stable products at elevated temperatures (e.g., 35°C, 40°C, 45°C) and uses the Arrhenius equation / Q10 temperature coefficient to predict shelf life rapidly.',
        keyTakeaway: 'Combine Microbiological, Chemical (PV/FFA), Physical, and Sensory testing; use Q10/Arrhenius for Accelerated studies.'
      },
      {
        id: 'int-5-07',
        questionNumber: 7,
        topic: 'Food Science & QA',
        question: 'What do Peroxide Value (PV) and Free Fatty Acids (FFA) measure in edible oils and fried snacks?',
        answer: 'Free Fatty Acids (FFA, measured by KOH/NaOH titration as % oleic acid) measure hydrolytic rancidity caused by moisture and lipase enzymes splitting triglycerides. Peroxide Value (PV, measured in meq O2/kg oil by iodometric titration) measures primary oxidative rancidity (hydroperoxides formed when unsaturated fats react with oxygen, light, and heat). Usually, fresh refined oil has PV < 1–2 meq/kg, and rancidity becomes noticeable above 10 meq/kg.',
        keyTakeaway: 'FFA = Hydrolytic rancidity (water/heat cleavage); PV = Primary Oxidative rancidity (oxygen/light).'
      },
      {
        id: 'int-5-08',
        questionNumber: 8,
        topic: 'Food Science & QA',
        question: 'What is Brix-to-Acid Ratio in beverage and fruit juice quality assurance?',
        answer: 'Degrees Brix (°Bx, measured with a refractometer) represents the percentage of soluble solids (sucrose/sugars) by weight (1 °Bx = 1g sugar per 100g solution). Titratable Acidity (% w/v, measured by titrating with 0.1N NaOH to pH 8.1/phenolphthalein endpoint) represents organic acid content (citric, malic, or tartaric acid). The Brix-to-Acid Ratio governs perceived sweetness-tartness balance and consumer acceptability of juices and carbonated soft drinks.',
        keyTakeaway: 'Brix (Refractometer) ÷ Titratable Acidity (0.1N NaOH titration) determines flavor balance in beverages.'
      },
      {
        id: 'int-5-09',
        questionNumber: 9,
        topic: 'Food Science & QA',
        question: 'What is Hurdle Technology in food preservation? Give a practical industrial example.',
        answer: 'Coined by Prof. Lothar Leistner, Hurdle Technology combines multiple mild preservation factors ("hurdles")—such as moderate heat treatment, reduced pH (acidification), reduced water activity (salt/sugar humectants), redox potential (vacuum/MAP), chemical preservatives (sorbates/benzoates), and refrigeration—so that microorganisms cannot overcome all hurdles simultaneously, preserving food safety while maintaining fresh sensory and nutritional quality.',
        keyTakeaway: 'Multiple sub-lethal barriers (pH + aw + mild heat + MAP + chill) work synergistically to stop microbial growth.'
      },
      {
        id: 'int-5-10',
        questionNumber: 10,
        topic: 'Food Science & QA',
        question: 'Differentiate between Foodborne Infection and Foodborne Intoxication with examples.',
        answer: 'Foodborne Infection occurs when a person ingests live pathogenic microorganisms (e.g., Salmonella spp., Listeria monocytogenes, Campylobacter jejuni, Hepatitis A) that invade and multiply in the intestinal tract (longer onset: 12 hours to several days, often accompanied by fever). Foodborne Intoxication occurs when a person ingests pre-formed toxins produced by bacteria or molds in the food before eating (e.g., Staphylococcus aureus enterotoxin, Bacillus cereus emetic toxin, Clostridium botulinum neurotoxin, Aflatoxins)—even if the bacteria are later killed by reheating, heat-stable toxins like S. aureus enterotoxin remain active and cause rapid vomiting within 1–6 hours.',
        keyTakeaway: 'Infection = ingesting live pathogens; Intoxication = ingesting pre-formed toxins (often rapid 1–6 hr onset).'
      },
      {
        id: 'int-5-11',
        questionNumber: 11,
        topic: 'Food Science & QA',
        question: 'What are the key Halal Food Management System requirements under PS 3733 / MS 1500 / OIC-SMIIC 1?',
        answer: 'Halal Assurance System (HAS) requires: (1) Zero Haram ingredients (pork/porcine derivatives, alcohol/intoxicants, blood, carrion, non-Halal slaughtered animal enzymes/gelatin/L-cysteine), (2) Validated Halal Certificates for every raw material, flavor, emulsifier (E471), and food-grade lubricant (NSF H1 Halal), (3) Dedicated Halal production lines and logistics (no cross-contamination with non-Halal), and (4) For slaughtering: healthy live Halal animal, Muslim slaughterer pronouncing Tasmiyah (Bismillah Allahu Akbar), severing trachea, esophagus, and both carotid arteries/jugular veins with a surgical-sharp knife without stunning that kills the animal prior to slaughter.',
        keyTakeaway: 'Verify emulsifiers (E471), gelatin, enzymes, flavors, and NSF H1 food-grade lubricants in Halal audits.'
      },
      {
        id: 'int-5-12',
        questionNumber: 12,
        topic: 'Food Science & QA',
        question: 'What are the common adulterants tested in raw milk at a Dairy QA Receiving Dock?',
        answer: 'Routine milk reception platform tests include: Organoleptic check (smell/color/clots), Temperature (≤ 4–5°C), Clot-on-Boiling (COB) & Alcohol Perception Test (APT, 68%–75% ethanol for heat stability/acidity), Lactometer + Gerber Fat for SNF (Solids-Not-Fat) and added water/skimming, Cryoscope (Freezing Point around -0.530°C to -0.550°C to detect exact % added water), and rapid adulteration strips/tests for Urea, Starch, Cane Sugar, Neutralizers (NaHCO3/NaOH), Hydrogen Peroxide, Formalin, Detergents, and Beta-lactam/Tetracycline Antibiotic Residues.',
        keyTakeaway: 'Freezing point (Cryoscope), APT (alcohol test), Gerber Fat/SNF, Antibiotic kit, and Adulteration panel are essential dairy reception tests.'
      },
      {
        id: 'int-5-13',
        questionNumber: 13,
        topic: 'Food Science & QA',
        question: 'What is Modified Atmosphere Packaging (MAP) and which gases are used?',
        answer: 'MAP replaces the air inside a food package with a controlled gas mixture of Carbon Dioxide (CO2), Nitrogen (N2), and/or Oxygen (O2). CO2 (typically 20%–40%) is bacteriostatic and fungistatic, dissolving in food moisture to lower surface pH and inhibit aerobic spoilage bacteria/molds. N2 is an inert filler gas that displaces oxygen to prevent lipid oxidation (rancidity in chips/nuts) and prevents package collapse. O2 is excluded in most foods but used at 70%–80% in fresh red meat MAP to maintain bright red oxymyoglobin color.',
        keyTakeaway: 'CO2 = antimicrobial; N2 = inert anti-oxidation & anti-collapse filler; O2 = maintains red meat oxymyoglobin.'
      },
      {
        id: 'int-5-14',
        questionNumber: 14,
        topic: 'Food Science & QA',
        question: 'What are Mycotoxins (specifically Aflatoxins B1, B2, G1, G2, and M1) and how are they controlled?',
        answer: 'Mycotoxins are toxic secondary metabolites produced by filamentous molds—primarily Aspergillus flavus and Aspergillus parasiticus (producing Aflatoxins B1, B2, G1, G2 in corn, peanuts, chilies, nuts, and spices). When dairy cattle consume Aflatoxin B1-contaminated feed, their liver metabolizes it into Aflatoxin M1, which is excreted in milk. Aflatoxins are extremely heat-stable (pasteurization and sterilization do NOT destroy them!), so control relies on pre-harvest/storage moisture control (<12–14% moisture, aw < 0.70), optical sorting, and incoming ELISA/HPLC screening.',
        keyTakeaway: 'Aflatoxins are heat-stable carcinogens—pasteurization cannot destroy Aflatoxin M1 in milk; test feed and raw grains.'
      },
      {
        id: 'int-5-15',
        questionNumber: 15,
        topic: 'Food Science & QA',
        question: 'Explain the role of Gluten (Gliadin and Glutenin) and Rheology tests (Farinograph, Falling Number) in Flour & Bakery QA.',
        answer: 'When wheat flour is hydrated and kneaded, Gliadin provides extensibility/viscosity while Glutenin provides elasticity/strength, forming the viscoelastic gluten network that traps CO2 gas during fermentation. A Brabender Farinograph measures water absorption (%), dough development time, and stability. The Hagberg Falling Number test measures alpha-amylase enzyme activity (sprout damage) in wheat—a low Falling Number (< 200 sec) indicates excessive alpha-amylase causing sticky,collapsed bread crumb; optimal bread wheat is 250–350 seconds.',
        keyTakeaway: 'Gliadin = Extensibility; Glutenin = Elasticity; Falling Number (250–350s) measures alpha-amylase sprout damage.'
      },
      {
        id: 'int-5-16',
        questionNumber: 16,
        topic: 'Food Science & QA',
        question: 'What is the maximum legal limit and functional role of SodiumBenzoate, Potassium Sorbate, and Sodium Nitrite in food preservation?',
        answer: 'Sodium Benzoate (E211, typically max 0.1% / 1000 ppm) inhibits yeasts and molds best in high-acid beverages/sauces (pH < 4.0). Potassium Sorbate (E202, max 0.1%–0.2%) inhibits molds and yeasts up to pH 6.0 in cheese, bakery, and sauces without imparting off-flavors. Sodium Nitrite (E250, strictly regulated around 120–150 ppm ingoing in cured meats) prevents Clostridium botulinum spore outgrowth, develops cured pink nitrosomyoglobin color, and retards lipid oxidation.',
        keyTakeaway: 'Benzoate works best at pH < 4.0; Sorbate works up to pH 6.0; Nitrite inhibits C. botulinum in cured meats.'
      },
      {
        id: 'int-5-17',
        questionNumber: 17,
        topic: 'Food Science & QA',
        question: 'What is Homogenization in dairy processing and why is it performed?',
        answer: 'Homogenization forces warm milk (55–65°C) through a narrow valve at high pressure (150–250 bar / 2000–3500 psi in two stages), shearing milk fat globules from 3–10 microns down to < 1–2 microns. According to Stokes’ Law, reducing globule diameter prevents fat creaming/separation during storage, increases whiteness, and improves mouthfeel and viscosity.',
        keyTakeaway: 'Homogenization reduces milk fat globules to < 2 microns (Stokes’ Law) to prevent fat separation.'
      },
      {
        id: 'int-5-18',
        questionNumber: 18,
        topic: 'Food Science & QA',
        question: 'What are Indicator Organisms in food microbiology (Total Plate Count, Coliforms, Enterobacteriaceae, E. coli)?',
        answer: 'Testing every batch for rare pathogens can miss low-level contamination. Indicator organisms are tested routinely because they signal hygiene breakdown: Total Plate Count (TPC/APC) indicates overall raw material quality, sanitation, and shelf-life temperature control; Enterobacteriaceae / Coliforms indicate post-process environmental recontamination or inadequate heat/CIP treatment; generic E. coli specifically indicates recent fecal contamination.',
        keyTakeaway: 'Enterobacteriaceae/Coliforms after thermal processing indicate post-process recontamination or CIP failure.'
      },
      {
        id: 'int-5-19',
        questionNumber: 19,
        topic: 'Food Science & QA',
        question: 'Explain the difference between a 2-Class and 3-Class Microbiological Sampling Plan (ICMSF: n, c, m, M).',
        answer: 'In ICMSF microbiological sampling: "n" = number of sample units tested from a lot; "c" = maximum allowable number of sample units yielding marginally acceptable counts between m and M; "m" = microbiological limit separating good quality from marginally acceptable quality; "M" = unacceptable limit (if ANY sample exceeds M, the entire lot is rejected). A 2-Class plan (n, c=0, m) is used for severe pathogens like Salmonella or Listeria monocytogenes in 25g (Absent/Present: any positive rejects the lot). A 3-Class plan (n, c, m, M) is used for hygiene indicators like TPC or Coliforms.',
        keyTakeaway: '2-Class Plan (n=5, c=0, Absent in 25g) is used for Zero-Tolerance pathogens; 3-Class Plan (n, c, m, M) for indicators.'
      },
      {
        id: 'int-5-20',
        questionNumber: 20,
        topic: 'Food Science & QA',
        question: 'How do you calculate Daily Energy Needs (BMR & TDEE) and Macronutrient Distribution in Human Nutrition?',
        answer: 'Basal Metabolic Rate (BMR) is calculated via the Mifflin-St Jeor equation: Men = (10 × weight kg) + (6.25 × height cm) - (5 × age) + 5; Women = (10 × weight kg) + (6.25 × height cm) - (5 × age) - 161. Total Daily Energy Expenditure (TDEE) = BMR × Activity Factor (1.2 sedentary to 1.9 athlete). Standard Acceptable Macronutrient Distribution Ranges (AMDR): Carbohydrates 45%–65% (4 kcal/g), Proteins 10%–35% (4 kcal/g), and Fats 20%–35% (9 kcal/g). A 500 kcal/day deficit yields ~0.45 kg/week healthy weight loss.',
        keyTakeaway: 'Carbs = 4 kcal/g, Protein = 4 kcal/g, Fat = 9 kcal/g; Mifflin-St Jeor + Activity Multiplier = Daily Calorie Target.'
      }
    ]
  }
];
