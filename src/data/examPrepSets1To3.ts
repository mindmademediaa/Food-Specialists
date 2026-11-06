export interface ExamMcqItem {
  id: string;
  qNum: number;
  category: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  marks: number;
  explanation: string;
}

export interface ExamPrepSet {
  id: string;
  setNumber: number;
  title: string;
  subtitle: string;
  subjectArea: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  passingPercentage: number;
  questions: ExamMcqItem[];
}

export const EXAM_SETS_1_TO_3: ExamPrepSet[] = [
  {
    id: 'exam-set-1',
    setNumber: 1,
    title: 'Exam Set 1: Food Safety, GMP, GHP & Prerequisite Programs (PRPs)',
    subtitle: '50 Official Practice MCQs covering Personal Hygiene, Sanitation, CIP, Pest Control, Allergens & ISO/TS 22002-1',
    subjectArea: 'Food Safety & GMP / GHP',
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 100,
    passingPercentage: 60,
    questions: [
      {
        id: 'ex1-q1',
        qNum: 1,
        category: 'Temperature Control',
        question: 'What is the internationally recognized Temperature Danger Zone (TDZ) in which foodborne pathogens multiply rapidly?',
        options: ['0°C to 4°C', '5°C to 60°C', '-18°C to 0°C', '65°C to 100°C'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Between 5°C and 60°C (41°F–140°F), pathogenic bacteria multiply rapidly, doubling every 20 minutes between 20°C and 45°C.'
      },
      {
        id: 'ex1-q2',
        qNum: 2,
        category: 'Personal Hygiene',
        question: 'What is the minimum recommended scrubbing time with bactericidal soap during proper handwashing in a food plant?',
        options: ['5 seconds', '10 seconds', '20 seconds', '2 minutes'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Codex GHP and WHO standards require scrubbing hands with soap for at least 20 seconds before rinsing and drying.'
      },
      {
        id: 'ex1-q3',
        qNum: 3,
        category: 'Personal Hygiene',
        question: 'Why must food handlers wear BLUE metal-detectable waterproof plasters over minor cuts on their hands?',
        options: [
          'Blue is cheaper than skin-colored bandages',
          'Blue provides high visual contrast in food and contains an electromagnetic strip detectable by metal detectors',
          'Blue bandages contain antibiotics',
          'Blue bandages dissolve harmlessly in food'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Virtually no natural food is bright blue, and the embedded aluminum/ferrous strip triggers the line metal detector if lost.'
      },
      {
        id: 'ex1-q4',
        qNum: 4,
        category: 'Medical Exclusion',
        question: 'After suffering from acute vomiting or diarrhea, how long must a food handler remain symptom-free before returning to open food handling?',
        options: ['12 hours', '24 hours', '48 hours', '7 days'],
        correctIndex: 2,
        marks: 2,
        explanation: 'A strict 48-hour symptom-free period after the last episode of vomiting or diarrhea is required under international GHP rules.'
      },
      {
        id: 'ex1-q5',
        qNum: 5,
        category: 'Cold Chain',
        question: 'What is the maximum recommended storage temperature for chilled high-risk Ready-to-Eat (RTE) foods?',
        options: ['≤ 4°C to 5°C', '≤ 10°C', '≤ 15°C', '≤ 20°C'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Chilled high-risk foods must be maintained at or below 4°C–5°C to suppress pathogen multiplication.'
      },
      {
        id: 'ex1-q6',
        qNum: 6,
        category: 'Cold Chain',
        question: 'What is the standard commercial freezer temperature required to keep frozen foods safe and stop all microbial growth?',
        options: ['-4°C or below', '-10°C or below', '-18°C (0°F) or below', '0°C'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Commercial frozen food storage requires -18°C (0°F) or colder to prevent microbial growth and minimize enzymatic activity.'
      },
      {
        id: 'ex1-q7',
        qNum: 7,
        category: 'Sanitation & CIP',
        question: 'Which four factors make up the "TACT" (Sinner’s Circle) principle in food plant cleaning and CIP?',
        options: [
          'Time, Alkalinity, Chlorine, Turbidity',
          'Time, Action (Mechanical Force), Chemical Concentration, Temperature',
          'Testing, Auditing, Calibration, Traceability',
          'Thermal, Acidic, Caustic, Titration'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'TACT stands for Time, Action (turbulence/scrubbing), Chemical concentration, and Temperature.'
      },
      {
        id: 'ex1-q8',
        qNum: 8,
        category: 'Sanitation & CIP',
        question: 'In a standard 5-step Dairy CIP cycle, what is the primary role of the 1.5%–2.0% Sodium Hydroxide (Caustic) wash at 75°C?',
        options: [
          'To dissolve mineral scale (milkstone)',
          'To saponify fats and peptize/dissolve protein residues',
          'To lower the pH of final rinse water',
          'To lubricate stainless steel gaskets'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Hot caustic soda (NaOH) removes organic soil by saponifying fats and dissolving proteins, while acid removes inorganic mineral scale.'
      },
      {
        id: 'ex1-q9',
        qNum: 9,
        category: 'Sanitation & CIP',
        question: 'What is the minimum flow velocity required inside a CIP pipeline to create turbulent flow (Reynolds Number > 30,000) for effective cleaning?',
        options: ['0.2 m/s', '0.5 m/s', '1.5 m/s', '5.0 m/s'],
        correctIndex: 2,
        marks: 2,
        explanation: 'A minimum flow velocity of 1.5 meters per second is required in CIP piping to ensure turbulent scrubbing action.'
      },
      {
        id: 'ex1-q10',
        qNum: 10,
        category: 'Sanitation & CIP',
        question: 'Why must a food contact surface always be cleaned with detergent BEFORE applying a chemical sanitizer like sodium hypochlorite?',
        options: [
          'Detergent makes the surface smell better',
          'Organic food soil reacts with and inactivates chlorine/sanitizers and shields microbes in biofilms',
          'Sanitizers only work on dry grease',
          'Detergent increases water hardness'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Organic matter rapidly neutralizes free chlorine and Quaternary Ammonium sanitizers; you cannot sanitize a dirty surface.'
      },
      {
        id: 'ex1-q11',
        qNum: 11,
        category: 'Sanitation & CIP',
        question: 'What is the typical working concentration of free available chlorine (Sodium Hypochlorite) for sanitizing hard food-contact surfaces?',
        options: ['1 to 5 ppm', '50 to 200 ppm', '1,000 to 2,000 ppm', '5,000 ppm'],
        correctIndex: 1,
        marks: 2,
        explanation: '50–200 ppm of free chlorine at pH 6.0–7.5 is the standard food-contact surface sanitizing range.'
      },
      {
        id: 'ex1-q12',
        qNum: 12,
        category: 'Sanitation Verification',
        question: 'What does an ATP Bioluminescence swab test measure on a cleaned food-contact surface?',
        options: [
          'Only live pathogenic Salmonella cells',
          'Total biological residue (both organic food debris and microbial ATP) expressed in Relative Light Units (RLU)',
          'Heavy metal concentration in ppm',
          'Caustic soda titration percentage'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'ATP swabs detect Adenosine Triphosphate from both food organic residue and microbial cells within 15 seconds.'
      },
      {
        id: 'ex1-q13',
        qNum: 13,
        category: 'Pest Control',
        question: 'Under ISO/TS 22002-1 and GFSI standards, why are toxic rodenticide bait stations prohibited inside open food processing areas?',
        options: [
          'Rodents do not eat bait indoors',
          'Risk of toxic chemical bait contaminating food products or being carried onto lines by pests',
          'Bait stations rust in humid rooms',
          'Mechanical traps are more expensive'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Toxic bait is restricted to locked external perimeter stations; internal areas must use non-toxic mechanical traps or glue boards.'
      },
      {
        id: 'ex1-q14',
        qNum: 14,
        category: 'Pest Control',
        question: 'Why must Electric Fly Killers (EFKs) in food production rooms use sticky glue boards and shatterproof UV tubes rather than high-voltage zapping grids?',
        options: [
          'Glue boards use more electricity',
          'High-voltage zappers explode insects and scatter body fragments into the air and onto open food',
          'UV tubes do not attract flies',
          'Zappers only work outdoors'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'High-voltage zappers aerosolize insect fragments up to 2 meters; glue-board units safely contain whole insects and allow trend counting.'
      },
      {
        id: 'ex1-q15',
        qNum: 15,
        category: 'Warehouse & Storage',
        question: 'In food warehouse management, what does FEFO stand for and why is it prioritized over FIFO?',
        options: [
          'Fast Entry, Fast Output',
          'First-Expired, First-Out — ensuring stock with the earliest expiration date is used first',
          'Final Evaluation, Final Order',
          'First-Inspected, First-Opened'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'FEFO dispatches raw materials and products based on earliest expiry date, preventing expired lots even if newer shipments arrived earlier.'
      },
      {
        id: 'ex1-q16',
        qNum: 16,
        category: 'Warehouse & Storage',
        question: 'What is the standard minimum inspection gap required between stored pallets and warehouse walls under GMP/IPM rules?',
        options: ['2 cm', '10 cm', '45 cm (18 inches)', '2 meters'],
        correctIndex: 2,
        marks: 2,
        explanation: 'A 45 cm (18-inch) white perimeter strip allows pest trap inspection, cleaning access, and air circulation.'
      },
      {
        id: 'ex1-q17',
        qNum: 17,
        category: 'Allergen Management',
        question: 'Which of the following is NOT one of the "Big 9" major food allergens recognized by Codex/FDA?',
        options: ['Peanuts & Tree Nuts', 'Milk & Eggs', 'White Rice', 'Soybeans & Wheat (Gluten)'],
        correctIndex: 2,
        marks: 2,
        explanation: 'The Big 9 allergens are Milk, Eggs, Fish, Crustacean Shellfish, Tree Nuts, Peanuts, Wheat, Soybeans, and Sesame. White rice is not a major allergen.'
      },
      {
        id: 'ex1-q18',
        qNum: 18,
        category: 'Allergen Management',
        question: 'Does normal baking, frying, or pasteurization destroy food allergen proteins resulting from cross-contact?',
        options: [
          'Yes, 72°C for 15 seconds destroys all allergens',
          'No, food allergen proteins are highly heat-stable and survive baking, cooking, and pasteurization',
          'Yes, freezing at -18°C destroys allergens',
          'Yes, UV light destroys peanut protein'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Unlike vegetative bacteria, allergenic proteins are heat-resistant and remain capable of triggering anaphylaxis after cooking.'
      },
      {
        id: 'ex1-q19',
        qNum: 19,
        category: 'Utilities & Water',
        question: 'According to WHO and food safety standards, what is the maximum allowable count of E. coli or fecal coliforms in 100 mL of potable water used in a food factory?',
        options: ['0 CFU / 100 mL (Absent)', '10 CFU / 100 mL', '50 CFU / 100 mL', '100 CFU / 100 mL'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Potable water used in food processing must have 0 CFU/100 mL (complete absence) of E. coli and coliforms.'
      },
      {
        id: 'ex1-q20',
        qNum: 20,
        category: 'Utilities & Air',
        question: 'What micron filter rating is required by ISO/TS 22002-1 for compressed air that comes into direct contact with food or primary packaging?',
        options: ['10 microns', '5 microns', '0.01 micron oil-free sterile point-of-use filter', '50 microns'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Direct food-contact compressed air must be oil-free and filtered to 0.01 micron to remove microorganisms, moisture, and particles.'
      },
      {
        id: 'ex1-q21',
        qNum: 21,
        category: 'Foreign Body Control',
        question: 'Why are wooden pallets, wooden-handled brushes, and wooden clipboards prohibited inside open food processing rooms?',
        options: [
          'Wood is too heavy for operators',
          'Wood is porous, absorbs moisture to harbor mold/bacteria, cannot be sanitized effectively, and splinters into physical hazards',
          'Wood interferes with Wi-Fi signals',
          'Wood lowers room temperature'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Wood splinters create physical hazards and its porous grain harbors Listeria and molds.'
      },
      {
        id: 'ex1-q22',
        qNum: 22,
        category: 'Hygienic Design',
        question: 'Which grades of Austenitic Stainless Steel are standard for direct food-contact equipment and corrosive salty/acidic food environments?',
        options: ['AISI 1010 Carbon Steel', 'AISI 304 and AISI 316L (with Molybdenum)', 'Cast Iron', 'Galvanized Zinc Steel'],
        correctIndex: 1,
        marks: 2,
        explanation: 'SS 304 is standard for general food contact, and SS 316L (containing 2–3% molybdenum) resists pitting from salt, acids, and chlorides.'
      },
      {
        id: 'ex1-q23',
        qNum: 23,
        category: 'Hygienic Design',
        question: 'In sanitary pipeline design, what is a "Dead Leg" and why is it dangerous?',
        options: [
          'A broken table support leg',
          'A pipe section or T-junction (> 1.5x pipe diameter) where fluid stagnates, preventing CIP turbulence and allowing biofilm growth',
          'An unused warehouse aisle',
          'A grounding wire on a motor'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Dead legs trap stagnant product out of reach of CIP flow velocity, becoming a persistent source of microbial biofilms.'
      },
      {
        id: 'ex1-q24',
        qNum: 24,
        category: 'Maintenance & Lubricants',
        question: 'Which NSF lubricant classification is mandatory for greases and oils used on machinery parts where incidental food contact may occur?',
        options: ['NSF H1 (Food-Grade Lubricant)', 'NSF H2 (Non-Food Contact)', 'SAE 40 Automotive Oil', 'WD-40 Standard'],
        correctIndex: 0,
        marks: 2,
        explanation: 'NSF H1 lubricants are formulated from FDA 21 CFR 178.3570 approved non-toxic ingredients safe for incidental food contact (up to 10 ppm).'
      },
      {
        id: 'ex1-q25',
        qNum: 25,
        category: 'Glass & Brittle Plastic',
        question: 'What is the immediate mandatory procedure if a glass sight-glass or jar breaks on or near an active filling line?',
        options: [
          'Sweep it up quickly while keeping the line running',
          'Stop the line immediately, quarantine/discard all open product and packaging within the splash/shatter zone, clean thoroughly, and obtain QA sign-off before restart',
          'Increase line speed to clear the area',
          'Only remove visible large glass pieces'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Glass breakage requires an immediate line stop, disposal of all exposed product/containers in the blast zone, and documented QA inspection.'
      },
      {
        id: 'ex1-q26',
        qNum: 26,
        category: 'Zoning & Air Flow',
        question: 'In a factory producing both raw ingredients and RTE cooked products, how should air pressure be balanced?',
        options: [
          'Higher pressure in raw material rooms flowing into RTE rooms',
          'Positive filtered air pressure in the High-Care RTE room so air flows outward toward Low-Risk/Raw rooms',
          'Zero air circulation in both rooms',
          'Open windows between raw and cooked areas'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Positive air pressure in High-Care RTE zones prevents airborne dust, spores, and pathogens from entering from raw areas.'
      },
      {
        id: 'ex1-q27',
        qNum: 27,
        category: 'Hot Holding',
        question: 'What is the minimum safe hot-holding core temperature for cooked TCS foods on a serving or packing line?',
        options: ['35°C', '45°C', '≥ 60°C to 63°C', '50°C'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Hot holding at ≥ 60°C (or ≥ 63°C under UK/EU rules) keeps food above the Temperature Danger Zone.'
      },
      {
        id: 'ex1-q28',
        qNum: 28,
        category: 'Cooling Standards',
        question: 'Under the FDA 2-Stage Cooling standard, within how many hours must cooked TCS food be cooled from 57°C (135°F) down to ≤ 5°C (41°F)?',
        options: [
          'Total 6 hours (57°C to 21°C in ≤ 2 hours, then 21°C to ≤ 5°C in ≤ 4 hours)',
          'Total 24 hours at room temperature',
          'Total 12 hours in a covered pot',
          'Total 15 minutes'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Rapid 2-stage cooling (2 hours to 21°C + 4 hours to 5°C) prevents germination of heat-shocked Clostridium perfringens and Bacillus cereus spores.'
      },
      {
        id: 'ex1-q29',
        qNum: 29,
        category: 'Thawing / Defrosting',
        question: 'Which of the following is an UNSAFE and prohibited method for thawing frozen meat or poultry?',
        options: [
          'Thawing inside a controlled chiller at ≤ 4°C',
          'Leaving frozen meat out on a preparation table at ambient room temperature (25–35°C) overnight',
          'Thawing under potable cold running water (≤ 21°C) for immediate cooking',
          'Thawing in a microwave followed immediately by continuous cooking'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Ambient thawing allows the outer surface of meat to enter the 20–35°C danger zone for hours while the core remains frozen.'
      },
      {
        id: 'ex1-q30',
        qNum: 30,
        category: 'Chemical Safety',
        question: 'How must cleaning and sanitation chemicals be stored in a food processing facility?',
        options: [
          'Next to spice bags on the production floor for easy access',
          'In a dedicated, locked, ventilated chemical store with SDS (Safety Data Sheets), secondary containment bunds, and original labels',
          'In empty reused drinking water bottles',
          'Above packaging film racks'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Cleaning chemicals must be isolated in a locked store with SDS sheets and never decanted into food or beverage containers.'
      },
      {
        id: 'ex1-q31',
        qNum: 31,
        category: 'Rework Control',
        question: 'When adding rework back into a production batch, which rule is mandatory for allergen and traceability compliance?',
        options: [
          'Any rework can be mixed into any product to save cost',
          '"Like-into-Like" rule: rework must only go into a product with the exact same allergen profile and have its batch number recorded',
          'Rework does not need batch labels if used within 1 week',
          'Rework can be stored uncovered on the floor'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Rework must be labeled with batch/date/allergens and only added "like-into-like" to prevent undeclared allergen cross-contact.'
      },
      {
        id: 'ex1-q32',
        qNum: 32,
        category: 'Calibration',
        question: 'How do you perform a daily 2-point verification check on a digital food probe thermometer in a plant QA lab?',
        options: [
          'Hold it in the air and check room temperature',
          'Check 0°C (±0.5°C) in a crushed ice-water slurry and 100°C (±0.5°C) in boiling water (adjusted for altitude)',
          'Compare it against a wall clock',
          'Put it in warm tap water'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'The Ice-Point (0°C melting ice slurry) and Boiling-Point (100°C at sea level) methods verify thermometer accuracy across the working range.'
      },
      {
        id: 'ex1-q33',
        qNum: 33,
        category: 'Calibration',
        question: 'Which buffer solutions are typically used for 3-point daily calibration of a laboratory pH meter testing acidic and neutral foods?',
        options: [
          'pH 1.0, 2.0, and 3.0',
          'pH 4.01, pH 7.00, and pH 10.01 certified NIST-traceable buffer solutions at 25°C',
          'Distilled water and tap water',
          'Vinegar and baking soda'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Standard pH meter calibration uses certified pH 4.01, 7.00, and 10.01 buffers with Automatic Temperature Compensation (ATC).'
      },
      {
        id: 'ex1-q34',
        qNum: 34,
        category: 'Receiving Inspection',
        question: 'What is the minimum remaining shelf life generally required by industrial QA specifications when receiving raw materials at the factory gate?',
        options: ['10% remaining shelf life', '25% remaining shelf life', '≥ 75% remaining shelf life', 'Expired by less than 5 days'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Most food manufacturing QA specs require at least 75% (three-quarters) of total shelf life remaining upon delivery.'
      },
      {
        id: 'ex1-q35',
        qNum: 35,
        category: 'Color Coding',
        question: 'What is the primary purpose of color-coding brushes, squeegees, and cutting boards in a food plant?',
        options: [
          'Interior decoration',
          'To prevent cross-contamination between raw, RTE, allergen, and floor/drain/toilet zones',
          'To track supplier brands',
          'To make tools heavier'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Zone-based color coding prevents a drain or raw-meat brush from ever touching a direct food-contact surface.'
      },
      {
        id: 'ex1-q36',
        qNum: 36,
        category: 'Floor & Drain Hygiene',
        question: 'Why is spraying floor drains with a high-pressure water hose strictly prohibited during open food production?',
        options: [
          'It wastes water',
          'High-pressure jets create microscopic aerosols carrying Listeria monocytogenes and drain biofilms onto exposed food and Zone 1 surfaces',
          'It cools the floor too much',
          'It removes floor paint'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'High-pressure hosing aerosolizes Listeria biofilms from drains directly onto overhead food conveyors.'
      },
      {
        id: 'ex1-q37',
        qNum: 37,
        category: 'Traceability',
        question: 'Under Codex and ISO 22000, what is the "One Step Back, One Step Forward" traceability principle?',
        options: [
          'Walking backward and forward on the line',
          'Ability to identify the immediate supplier of all raw materials/packaging (one step back) and the immediate commercial customer of every finished batch (one step forward)',
          'Reviewing yesterday’s and tomorrow’s shift schedule',
          'Testing samples before and after lunch'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Every food business operator must trace all inputs back to their supplier lot and all outputs forward to the receiving customer.'
      },
      {
        id: 'ex1-q38',
        qNum: 38,
        category: 'Waste Management',
        question: 'How must food waste bins inside production rooms be designed and managed?',
        options: [
          'Open cardboard boxes emptied once a week',
          'Foot-operated (hands-free), covered, clearly labeled, lined, made of cleanable impermeable material, and emptied at least at the end of every shift',
          'Uncovered metal drums next to filling nozzles',
          'Stored inside the raw material cold room'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Hands-free lidded bins prevent hand recontamination, pest attraction, and odor build-up.'
      },
      {
        id: 'ex1-q39',
        qNum: 39,
        category: 'Lighting GMP',
        question: 'What is the mandatory GMP requirement for overhead light fixtures suspended above open food processing or packaging lines?',
        options: [
          'Bare glass fluorescent tubes for maximum brightness',
          'Shatterproof protective diffusers/covers or FEP-sleeved shatterproof LED/fluorescent tubes',
          'Candles or oil lamps',
          'Colored neon lights'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'All overhead lighting above open food or packaging must be shatterproof or enclosed to prevent glass contamination if a bulb bursts.'
      },
      {
        id: 'ex1-q40',
        qNum: 40,
        category: 'Hand Dryers',
        question: 'Why are high-speed jet air hand dryers discouraged inside High-Care / RTE food processing handwash stations?',
        options: [
          'They dry hands too quickly',
          'They generate turbulent air currents that disperse water droplets and skin bacteria up to 1.5–2 meters across the room',
          'They are too quiet',
          'They require paper refills'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Single-use disposable paper towels physically remove moisture and bacteria without creating airborne aerosols.'
      },
      {
        id: 'ex1-q41',
        qNum: 41,
        category: 'Packaging Control',
        question: 'Why must food-contact primary packaging film/containers be accompanied by a Certificate of Compliance / Food-Grade Migration test report?',
        options: [
          'To verify ink color brightness',
          'To ensure hazardous monomers, heavy metals, phthalates, or mineral oil hydrocarbons (MOSH/MOAH) do not migrate into the food above legal limits',
          'To check box weight only',
          'To satisfy transport drivers'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Food-grade migration testing (overall and specific migration under EU 10/2011 or FDA 21 CFR) prevents chemical leaching into food.'
      },
      {
        id: 'ex1-q42',
        qNum: 42,
        category: 'Sanitation Chemicals',
        question: 'Which chemical sanitizer is widely preferred for cold CIP disinfection in beverage/dairy plants because it decomposes into harmless water, oxygen, and acetic acid?',
        options: ['Formaldehyde', 'Peracetic Acid (PAA)', 'Phenol', 'Quaternary Ammonium (QAC)'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Peracetic Acid (PAA, 100–200 ppm) is a non-foaming, broad-spectrum sporicidal sanitizer ideal for CIP that leaves no toxic residue.'
      },
      {
        id: 'ex1-q43',
        qNum: 43,
        category: 'Personal Protective Equipment',
        question: 'In what correct order should a food handler put on PPE in the changing room before entering the production hall?',
        options: [
          'Put on clean coat first, then comb hair and put on dirty outdoor shoes',
          'Put on hairnet/beard snood first (covering all hair & ears), then captive footwear, then lab coat/coverall, then wash & sanitize hands',
          'Wash hands first, then touch dirty shoes, then enter line',
          'Gloves first, then hairnet'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Putting the hairnet on BEFORE the clean coat prevents loose hairs and dandruff from falling onto the shoulders of the clean coat; handwashing is done last.'
      },
      {
        id: 'ex1-q44',
        qNum: 44,
        category: 'Glove Policy',
        question: 'What is a major food safety misconception regarding disposable nitrile gloves in food handling?',
        options: [
          'Blue nitrile gloves are tear-resistant',
          'Believing that wearing gloves replaces handwashing—unwashed or un-changed gloves accumulate and transfer pathogens just like bare skin',
          'Gloves protect bandages',
          'Gloves should be food-grade'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Hands must be washed and sanitized before donning gloves, and gloves must be changed after touching non-food surfaces or tearing.'
      },
      {
        id: 'ex1-q45',
        qNum: 45,
        category: 'Sieves & Strainers',
        question: 'Why are flour sifters, inline pipeline strainers, and magnetic traps inspected at the start and end of every shift?',
        options: [
          'To weigh total production output',
          'To verify screen/magnet integrity (no torn mesh) and examine captured foreign bodies for early detection of equipment wear or supplier contamination',
          'To cool down the flour',
          'To add air to liquids'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'A torn sieve mesh means foreign bodies may have passed into the batch since the last intact inspection.'
      },
      {
        id: 'ex1-q46',
        qNum: 46,
        category: 'Wall-Floor Junctions',
        question: 'Why does hygienic food plant construction (ISO/TS 22002-1) require "coved" (curved concave radius) junctions between walls and floors?',
        options: [
          'It looks modern',
          '90-degree sharp corners trap dirt, moisture, and biofilms that floor brushes cannot reach, whereas curved coving allows complete cleaning and drainage',
          'It saves cement',
          'It increases room height'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Curved coving at wall-to-floor junctions eliminates dead corners where organic debris and Listeria accumulate.'
      },
      {
        id: 'ex1-q47',
        qNum: 47,
        category: 'Retention Samples',
        question: 'How long should QA Reference / Retention Samples of each production batch be stored in the sample library?',
        options: [
          '24 hours only',
          'Until the end of the shift',
          'For the entire stated shelf life of the product plus an additional buffer period (typically +1 to 3 months)',
          '10 years for all fresh foods'
        ],
        correctIndex: 2,
        marks: 2,
        explanation: 'Retention samples are kept for Shelf Life + buffer time under recommended storage conditions to investigate any customer complaint or regulatory inquiry.'
      },
      {
        id: 'ex1-q48',
        qNum: 48,
        category: 'Visitor Policy',
        question: 'What is mandatory before an external visitor or contractor enters a food production area?',
        options: [
          'Only a business card',
          'Sign-in, completion of a Visitor Health & Medical Questionnaire (no GI illness), jewelry removal, GMP briefing, and full PPE',
          'Only safety glasses',
          'No check is needed if accompanied by a manager'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Visitors and contractors must complete health screening, remove jewelry, wear full PPE, and follow all GMP rules.'
      },
      {
        id: 'ex1-q49',
        qNum: 49,
        category: 'Condensation Control',
        question: 'Why is overhead ceiling condensation above exposed food lines treated as a critical GMP hazard?',
        options: [
          'It makes the floor slippery only',
          'Condensation droplets falling from ceilings and chilled pipes carry Listeria monocytogenes and mold spores directly into open product',
          'It increases humidity by 1%',
          'It rusts plastic containers'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Overhead condensation droplets act as direct vectors for Listeria monocytogenes and molds onto exposed food.'
      },
      {
        id: 'ex1-q50',
        qNum: 50,
        category: 'Good Documentation Practice',
        question: 'Under Good Documentation Practices (GDP / ALCOA+) in a food factory, how must an operator correct a handwritten mistake on a CCP or GMP log sheet?',
        options: [
          'Use white correction fluid (Whitener / Tipp-Ex) to cover the mistake',
          'Draw a single line through the error (keeping it legible), write the correct value next to it, and add initials, date, and reason',
          'Tear up the page and rewrite the whole shift log from memory',
          'Erase it with a pencil eraser'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Correction fluid, pencils, and obliteration are strictly banned in food safety records; use a single strike-through with initials and date.'
      }
    ]
  },
  {
    id: 'exam-set-2',
    setNumber: 2,
    title: 'Exam Set 2: Codex HACCP 12 Steps, 7 Principles & Hazard Analysis',
    subtitle: '50 Official Practice MCQs on Hazard Identification, CCP Decision Trees, Critical Limits, Monitoring & Validation',
    subjectArea: 'HACCP System & Hazard Control',
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 100,
    passingPercentage: 60,
    questions: [
      {
        id: 'ex2-q1',
        qNum: 1,
        category: 'HACCP History & Origins',
        question: 'HACCP was originally developed in the 1960s through a collaboration between NASA, the US Army Natick Laboratories, and which food company?',
        options: ['Nestlé', 'The Pillsbury Company (led by Dr. Howard Bauman)', 'Unilever', 'Kraft Foods'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Pillsbury, NASA, and Natick Labs created HACCP to guarantee 100% crumb-free, pathogen-free food for astronauts in zero gravity.'
      },
      {
        id: 'ex2-q2',
        qNum: 2,
        category: '12 Steps of HACCP',
        question: 'How many total implementation steps are defined in the Codex Alimentarius HACCP system?',
        options: ['7 Steps total', '10 Steps total', '12 Steps (5 Preliminary Steps + 7 HACCP Principles)', '15 Steps total'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Codex HACCP comprises 5 Preliminary Steps (Steps 1–5) followed by the 7 Principles (Steps 6–12).'
      },
      {
        id: 'ex2-q3',
        qNum: 3,
        category: 'Preliminary Steps',
        question: 'What is Step 1 of the 12-Step Codex HACCP implementation sequence?',
        options: [
          'Conduct a Hazard Analysis',
          'Assemble the Multidisciplinary HACCP Team',
          'Construct a Process Flow Diagram',
          'Determine Critical Control Points'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Step 1 is always assembling a competent, multidisciplinary HACCP team.'
      },
      {
        id: 'ex2-q4',
        qNum: 4,
        category: 'Preliminary Steps',
        question: 'Why does Step 3 of Codex HACCP ("Identify Intended Use") require specifying whether the product targets infants, pregnant women, elderly, or immunocompromised patients (YOPI)?',
        options: [
          'For marketing price calculation',
          'Because vulnerable populations (YOPI) have lower infectious doses and higher mortality risk, requiring stricter hazard severity ratings and microbiological limits',
          'To design smaller packaging',
          'To reduce shipping weight'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'YOPI (Young, Old, Pregnant, Immunocompromised) groups are highly susceptible to pathogens like Cronobacter sakazakii and Listeria monocytogenes.'
      },
      {
        id: 'ex2-q5',
        qNum: 5,
        category: 'Preliminary Steps',
        question: 'When must Step 5 ("On-Site Confirmation of the Flow Diagram") be verified on the factory floor?',
        options: [
          'Only in the conference room using CAD drawings',
          'During actual operating hours across all production shifts (including night shifts and weekend changeovers) by the HACCP Team',
          'Only before the factory is built',
          'Once every 10 years'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'The HACCP team must walk the actual process line across all operating shifts to confirm no bypass pipes, rework loops, or manual steps were missed.'
      },
      {
        id: 'ex2-q6',
        qNum: 6,
        category: '7 Principles',
        question: 'Which HACCP Principle corresponds to Step 6 of the 12-step sequence?',
        options: [
          'Principle 1: Conduct a Hazard Analysis',
          'Principle 2: Determine Critical Control Points (CCPs)',
          'Principle 3: Establish Critical Limits',
          'Principle 4: Establish Monitoring Procedures'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Step 6 is Principle 1: Conduct a Hazard Analysis (identifying hazards, assessing risk, and determining control measures).'
      },
      {
        id: 'ex2-q7',
        qNum: 7,
        category: '7 Principles',
        question: 'Which HACCP Principle requires establishing measurable minimum or maximum boundaries separating safe from unsafe conditions at a CCP?',
        options: ['Principle 1', 'Principle 2', 'Principle 3: Establish Validated Critical Limits', 'Principle 6'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Principle 3 (Step 8) is "Establish Validated Critical Limits for each CCP."'
      },
      {
        id: 'ex2-q8',
        qNum: 8,
        category: 'Hazard Classification',
        question: 'Glass fragments, metal shavings from a worn mixer blade, and hard fruit stones in a product are classified as which type of hazard?',
        options: ['Biological Hazard', 'Chemical Hazard', 'Physical Hazard', 'Radiological Hazard'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Hard or sharp foreign objects that can cause choking, dental breakage, or gastrointestinal laceration are Physical Hazards.'
      },
      {
        id: 'ex2-q9',
        qNum: 9,
        category: 'Hazard Classification',
        question: 'Aflatoxin M1 in milk, Patulin in apple juice, and Histamine (Scombroid toxin) in tuna are classified as which category of food safety hazard?',
        options: [
          'Physical Hazards',
          'Naturally Occurring / Biological-Origin Chemical Hazards',
          'Radiological Hazards',
          'Packaging Defects'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Mycotoxins (Aflatoxin, Patulin) and biogenic amines (Histamine) are chemical toxins assessed under Chemical Hazards in HACCP.'
      },
      {
        id: 'ex2-q10',
        qNum: 10,
        category: 'Hazard Classification',
        question: 'According to the FDA Defect Action Level / Hazard Analysis guidelines, what size range of hard or sharp foreign objects poses the highest physical injury risk to consumers?',
        options: ['Less than 0.1 mm', '7 mm to 25 mm (and ≥ 2 mm for infants)', 'Over 200 mm only', 'Soft dust particles'],
        correctIndex: 1,
        marks: 2,
        explanation: 'FDA compliance policy guides identify hard or sharp foreign objects between 7 mm and 25 mm as capable of causing traumatic dental or GI injury.'
      },
      {
        id: 'ex2-q11',
        qNum: 11,
        category: 'Risk Assessment',
        question: 'In a HACCP Hazard Analysis matrix, how is the "Significance" of a food safety hazard calculated?',
        options: [
          'Product Price × Batch Weight',
          'Severity (health consequence to consumer) × Likelihood (probability of occurrence in final product)',
          'Line Speed × Number of Operators',
          'Shelf Life ÷ Storage Temperature'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Risk significance is the product of Severity (illness/injury impact) and Likelihood (probability of occurrence).'
      },
      {
        id: 'ex2-q12',
        qNum: 12,
        category: 'CCP Decision Tree',
        question: 'In the 4-question Codex CCP Decision Tree, if Question 2 ("Is the step specifically designed to eliminate or reduce the likely occurrence of a hazard to an acceptable level?") is answered YES, what is the outcome?',
        options: [
          'Proceed to Question 3',
          'The step is immediately classified as a Critical Control Point (CCP)',
          'The step is a PRP',
          'Stop the Hazard Analysis'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'A "Yes" to Question 2 (e.g., Pasteurization, Retort Sterilization, Metal Detection) immediately designates that step as a CCP.'
      },
      {
        id: 'ex2-q13',
        qNum: 13,
        category: 'CCP Decision Tree',
        question: 'In the Codex CCP Decision Tree, if Question 3 is answered YES ("Contamination could occur or increase to unacceptable levels") AND Question 4 ("Will a subsequent step eliminate the hazard?") is answered YES, what is the current step?',
        options: [
          'It is a CCP',
          'It is NOT a CCP (because a downstream step will eliminate or reduce the hazard)',
          'It requires product recall',
          'It is a Critical Limit'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'When a subsequent downstream step (e.g., cooking or metal detection) eliminates the hazard, the earlier step is not a CCP.'
      },
      {
        id: 'ex2-q14',
        qNum: 14,
        category: 'Critical Limits',
        question: 'Which of the following is a valid, properly written Critical Limit for a CCP?',
        options: [
          'Cook chicken until it looks golden brown and smells cooked',
          'Core product temperature ≥ 75°C held for ≥ 30 seconds',
          'Total Plate Count < 1,000 CFU/g after 48-hour lab incubation',
          'Keep the kitchen clean'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Critical limits must be objective, quantitative, and measurable in real time (e.g., ≥ 75°C for ≥ 30 seconds).'
      },
      {
        id: 'ex2-q15',
        qNum: 15,
        category: 'Critical Limits vs Operating Limits',
        question: 'If the legal Critical Limit for HTST milk pasteurization is 72.0°C for 15 seconds, why does a dairy plant set its Operating Limit at 74.5°C for 18 seconds?',
        options: [
          'To waste steam energy',
          'To create a safety buffer that triggers operator adjustment before the Critical Limit is breached',
          'To boil the milk',
          'Because thermometers cannot read 72°C'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Operating limits are set more conservatively than critical limits to prevent CCP deviations and costly product quarantine.'
      },
      {
        id: 'ex2-q16',
        qNum: 16,
        category: 'CCP Monitoring',
        question: 'What are the 4 mandatory components ("The 4 Ws") that must be defined in every CCP Monitoring Procedure (Principle 4)?',
        options: [
          'Water, Wheat, Weight, Warehouse',
          'What will be monitored, How it is monitored, Frequency (When), and Who is responsible',
          'Wholesale, Warranty, Waste, Work',
          'Why, Where, Weather, Width'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Every CCP monitoring plan specifies What (parameter), How (instrument/method), When (continuous or frequency), and Who (trained operator).'
      },
      {
        id: 'ex2-q17',
        qNum: 17,
        category: 'CCP Monitoring',
        question: 'If a CCP is monitored discontinuously (e.g., every 30 minutes instead of continuously) and a check at 10:30 AM fails after passing at 10:00 AM, how much product must be quarantined?',
        options: [
          'Only the single pack tested at 10:30 AM',
          '100% of product produced between 10:00 AM (the last good check) and 10:30 AM',
          'The entire month’s production',
          'None if the 11:00 AM check passes'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'All product manufactured since the last compliant monitoring check (10:00 AM) is potentially unsafe and must be placed on QA Hold.'
      },
      {
        id: 'ex2-q18',
        qNum: 18,
        category: 'Metal Detection CCP',
        question: 'Which three types of certified metal test spheres are used to verify an industrial food Metal Detector CCP?',
        options: [
          'Gold, Silver, and Copper',
          'Ferrous (Fe), Non-Ferrous (e.g., Brass/Aluminum), and Non-Magnetic Stainless Steel (typically AISI 316)',
          'Iron, Zinc, and Lead',
          'Plastic, Glass, and Wood'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Ferrous, Non-Ferrous, and Stainless Steel 316 test pieces represent the three distinct magnetic and conductive metal categories.'
      },
      {
        id: 'ex2-q19',
        qNum: 19,
        category: 'Metal Detection CCP',
        question: 'Of Ferrous, Non-Ferrous, and Stainless Steel (316), which metal type is typically the MOST difficult for a balanced-coil metal detector to detect in wet/conductive products?',
        options: ['Ferrous (Iron)', 'Aluminum Foil', 'Austenitic Stainless Steel (304 / 316)', 'Carbon Steel'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Austenitic Stainless Steel (316) is non-magnetic and a poor electrical conductor, requiring a slightly larger sphere diameter for detection.'
      },
      {
        id: 'ex2-q20',
        qNum: 20,
        category: 'X-Ray vs Metal Detection',
        question: 'Unlike a standard balanced-coil Metal Detector, which additional physical hazards can an X-Ray Inspection System detect based on density differences?',
        options: [
          'Human hair and thin paper',
          'High-density glass shards, calcified bone fragments, stones, ceramic, and dense rubber/plastic in addition to metals',
          'Low-density polyethylene film',
          'Dissolved salt and sugar'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'X-Ray systems detect foreign bodies based on mass density absorption, allowing detection of glass, stone, ceramic, bone, and metal.'
      },
      {
        id: 'ex2-q21',
        qNum: 21,
        category: 'Validation vs Verification',
        question: 'Conducting a scientific heat-penetration cold-spot study BEFORE launching a new canned soup retort schedule is an example of:',
        options: ['Routine Monitoring', 'Validation', 'Corrective Action', 'Supplier Auditing'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Validation is obtaining upfront scientific proof that a control measure can consistently achieve the required hazard reduction.'
      },
      {
        id: 'ex2-q22',
        qNum: 22,
        category: 'Validation vs Verification',
        question: 'A QA Manager reviewing last week’s signed CCP pasteurization charts and sending finished product samples for monthly microbiological testing is performing:',
        options: ['Validation', 'Verification (Principle 6)', 'Preliminary Step 2', 'Product Recall'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Record review, internal audits, calibration checks, and finished-product lab testing are Verification activities.'
      },
      {
        id: 'ex2-q23',
        qNum: 23,
        category: 'Thermal Lethality',
        question: 'What is the target "5-Log Reduction" pathogen required by the FDA Juice HACCP regulation (21 CFR Part 120)?',
        options: [
          'Pertinent pathogen (such as E. coli O157:H7, Salmonella, or Cryptosporidium parvum in apple/citrus juice)',
          'Lactobacillus bulgaricus',
          'Saccharomyces cerevisiae',
          'Penicillium roqueforti'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Juice HACCP mandates a validated 5-log (99.999%) reduction of the most resistant pertinent pathogen (e.g., E. coli O157:H7 or Cryptosporidium).'
      },
      {
        id: 'ex2-q24',
        qNum: 24,
        category: 'Canning CCPs',
        question: 'In a low-acid canned food (LACF) line, besides the Retort Sterilization time/temperature, which mechanical packaging step is universally managed as a critical control / integrity check?',
        options: [
          'Carton tape color',
          'Can Double Seam Integrity (overlap, cover hook, body hook, tightness) to prevent post-process leaker contamination',
          'Pallet shrink wrap thickness',
          'Barcode font size'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'A defective double seam allows cooling water pathogens to leak into the sterile can after retorting.'
      },
      {
        id: 'ex2-q25',
        qNum: 25,
        category: 'Canning CCPs',
        question: 'Why must can cooling water after Retort Sterilization contain a measurable residual sanitizer (e.g., 0.5–2.0 ppm free chlorine)?',
        options: [
          'To polish the outside of the tinplate',
          'Because warm cans contract under vacuum during cooling and can suck microscopic droplets of cooling water through the seam',
          'To dissolve paper labels',
          'To heat the water faster'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'As hot cans cool, internal vacuum forms and can draw microscopic water droplets through flexing seams; chlorinated water prevents botulism/spoilage.'
      },
      {
        id: 'ex2-q26',
        qNum: 26,
        category: 'Acidified Foods',
        question: 'For an acidified shelf-stable vegetable pickle relying on acidity to prevent Clostridium botulinum outgrowth, what is the typical Critical Limit for equilibrium pH?',
        options: ['pH ≥ 7.0', 'Equilibrium pH ≤ 4.6 (often operating limit ≤ 4.2)', 'pH = 6.5', 'pH = 8.0'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Clostridium botulinum cannot grow or produce toxin at pH ≤ 4.6.'
      },
      {
        id: 'ex2-q27',
        qNum: 27,
        category: 'Cooking CCPs',
        question: 'According to USDA FSIS / Codex guidelines, what minimum internal core temperature is required when cooking whole or ground poultry Products to eliminate Salmonella and Campylobacter?',
        options: ['55°C (131°F)', '63°C (145°F)', '74°C (165°F)', '45°C (113°F)'],
        correctIndex: 2,
        marks: 2,
        explanation: '74°C (165°F) achieves an instantaneous 7-log reduction of Salmonella in poultry.'
      },
      {
        id: 'ex2-q28',
        qNum: 28,
        category: 'Fish & Seafood HACCP',
        question: 'Which biogenic amine toxin forms in scombroid fish (tuna, mackerel, mahi-mahi) when time-temperature abuse allows bacterial histidine decarboxylase to convert histidine?',
        options: ['Aflatoxin B1', 'Histamine (Scombroid Toxin)', 'Solanine', 'Tetrodotoxin'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Time-temperature abuse (> 4.4°C) in tuna/mackerel allows bacteria to convert free histidine into heat-stable Histamine.'
      },
      {
        id: 'ex2-q29',
        qNum: 29,
        category: 'Fish & Seafood HACCP',
        question: 'Can cooking or canning destroy Histamine (Scombroid toxin) once it has already formed in temperature-abused tuna?',
        options: [
          'Yes, boiling for 5 minutes destroys histamine',
          'No, Histamine is completely heat-stable and survives cooking, smoking, and retort canning',
          'Yes, freezing destroys histamine',
          'Yes, adding lemon juice destroys histamine'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Histamine is heat-stable; even commercial retort sterilization of canned tuna cannot destroy pre-formed histamine.'
      },
      {
        id: 'ex2-q30',
        qNum: 30,
        category: 'Parasite Destruction',
        question: 'Under Seafood HACCP, what freezing regime is required to destroy parasites (such as Anisakis simplex) in fish intended to be consumed raw (sushi/sashimi)?',
        options: [
          '4°C for 12 hours',
          '-20°C (-4°F) or below for 7 days (168 hours), OR -35°C (-31°F) or below for 15 hours',
          '0°C for 24 hours',
          '10°C for 2 days'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Freezing at ≤ -20°C for 7 days or ≤ -35°C for 15 hours kills parasitic nematodes and cestodes in raw-consumption fish.'
      },
      {
        id: 'ex2-q31',
        qNum: 31,
        category: 'Bakery HACCP',
        question: 'In a commercial bread bakery, if baking (oven core temp > 95°C) kills vegetative pathogens, why is the final packaged bread still passed through a Metal Detector CCP?',
        options: [
          'To check bread crust color',
          'Because metal contamination from slicing blades, conveyors, or clips can occur AFTER the oven step',
          'To measure loaf weight',
          'To kill mold spores'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Bread slicing blades experience high mechanical stress and can chip after baking; hence metal detection after packaging is the final CCP.'
      },
      {
        id: 'ex2-q32',
        qNum: 32,
        category: 'Dairy Pasteurization',
        question: 'In an HTST milk pasteurizer, why must the pasteurized side of the regeneration heat exchanger plates be maintained at a higher pressure (e.g., ≥ 1–2 psi / 7–14 kPa higher) than the raw milk side?',
        options: [
          'To make the pump run quieter',
          'So that if a pinhole leak develops in a plate, pasteurized milk leaks into raw milk rather than raw contaminated milk leaking into pasteurized milk',
          'To increase butterfat percentage',
          'To cool the raw milk faster'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Positive differential pressure on the pasteurized side ensures any plate pinhole leaks outward toward the raw side, protecting pasteurized product.'
      },
      {
        id: 'ex2-q33',
        qNum: 33,
        category: 'Dairy Pasteurization',
        question: 'What happens to the HTST pasteurization Critical Limit when processing high-fat dairy products (≥ 10% fat, such as cream or ice cream mix) or products with added sweeteners?',
        options: [
          'The temperature critical limit is lowered by 5°C',
          'The minimum temperature or holding time must be INCREASED (e.g., 75°C for 15s for cream, or 80°C for 25s for ice cream mix) because fat and sugar protect microbes from heat',
          'Pasteurization is skipped',
          'Holding time is reduced to 1 second'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'High fat and high solids/sugar reduce water activity and exert a thermal protective effect on bacteria, requiring higher pasteurization temperatures.'
      },
      {
        id: 'ex2-q34',
        qNum: 34,
        category: 'Mycotoxin Hazards',
        question: 'Which mycotoxin is specifically regulated as a chemical hazard in apple juice and apple puree made from bruised/moldy apples (produced by Penicillium expansum)?',
        options: ['Aflatoxin M1', 'Patulin (typically limit ≤ 50 µg/kg)', 'Ochratoxin A', 'Zearalenone'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Penicillium expansum in rotten apples produces Patulin; Codex and EU/FDA set a maximum limit of 50 µg/kg (ppb) in apple juice (10 ppb for infant apple products).'
      },
      {
        id: 'ex2-q35',
        qNum: 35,
        category: 'Spices & Dry Goods',
        question: 'Which spore-forming pathogen commonly survives in dry spices, herbs, milk powder, and cooked rice, causing either an emetic (vomiting) or diarrheal syndrome?',
        options: ['Campylobacter jejuni', 'Bacillus cereus', 'Vibrio cholerae', 'Shigella sonnei'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Bacillus cereus spores survive dry storage and cooking; if cooked rice or sauces are cooled slowly in the danger zone, they germinate and produce heat-stable cereulide toxin.'
      },
      {
        id: 'ex2-q36',
        qNum: 36,
        category: 'Sous-Vide & Vacuum Packing',
        question: 'What is the primary biological hazard in Refrigerated Processed Foods of Extended Durability (REPFEDs / Sous-Vide / Vacuum-Packed chilled foods)?',
        options: [
          'Aerobic molds',
          'Non-proteolytic (psychrotrophic) Clostridium botulinum (Type B, E, F) capable of growing and producing toxin down to 3.3°C in anaerobic conditions',
          'Baker’s yeast',
          'Lactobacillus acidophilus'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Vacuum/MAP removes oxygen, creating an anaerobic environment where psychrotrophic C. botulinum can grow above 3.3°C unless controlled by 90°C/10 min heat, pH ≤ 5.0, or aw ≤ 0.97.'
      },
      {
        id: 'ex2-q37',
        qNum: 37,
        category: 'Allergen CCP / OPRP',
        question: 'During packaging of a product containing peanuts, why is checking the packaging film/carton barcode or artwork at line startup and roll changes managed as an OPRP or CCP?',
        options: [
          'To make sure the logo looks centered',
          'To prevent putting an allergen-containing product into a non-allergen wrapper (undeclared allergen recall risk)',
          'To count total boxes used',
          'To check ink drying time'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Packing an allergen product into the wrong packaging film is the leading cause of Class I life-threatening food recalls globally.'
      },
      {
        id: 'ex2-q38',
        qNum: 38,
        category: 'Glass & Bottle Washing',
        question: 'On a glass bottle or jar filling line, why is the Inverter Air-Rinser / Water-Jet Rinser just before filling often classified as an OPRP or CCP?',
        options: [
          'To cool the glass',
          'To invert the glass container and flush out any loose glass splinters or foreign objects before product is filled',
          'To weigh the bottle',
          'To apply the paper label'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Inverting glass jars and blasting with filtered air or water removes any glass fragments introduced during transport or depalletizing.'
      },
      {
        id: 'ex2-q39',
        qNum: 39,
        category: 'Corrective Action',
        question: 'Which two elements MUST every documented CCP Corrective Action plan (Principle 5) contain?',
        options: [
          'Warning letter to operator and fine deduction',
          '(1) Regaining process control & disposition of affected non-conforming product, and (2) Eliminating the root cause to prevent recurrence',
          'Calling the media and shutting down the company',
          'Changing the product brand name'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Principle 5 requires both safe handling/disposition of the affected batch AND fixing the process root cause.'
      },
      {
        id: 'ex2-q40',
        qNum: 40,
        category: 'HACCP Documentation',
        question: 'Under Principle 7 (Establish Documentation and Record-Keeping), why must CCP monitoring records be signed by both the operator and a independent verifier/QA supervisor?',
        options: [
          'To use more ink',
          'The operator signature confirms real-time execution, while the QA verifier signature confirms independent review that critical limits were met',
          'For payroll calculation',
          'To replace calibration'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Dual sign-off (Operator + Verifier) is a core audit requirement proving both real-time monitoring and supervisory verification.'
      },
      {
        id: 'ex2-q41',
        qNum: 41,
        category: 'Chemical Hazards',
        question: 'What is the maximum legal Codex / EU / FDA limit for Melamine in powdered infant formula (introduced after the 2008 dairy adulteration crisis)?',
        options: ['100 mg/kg', '1.0 mg/kg (ppm) in powdered infant formula (and 2.5 mg/kg in other foods)', '50 mg/kg', 'Zero testing required'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Codex set the strict maximum limit of 1.0 mg/kg (ppm) for melamine in powdered infant formula and 2.5 mg/kg in other foods/feed.'
      },
      {
        id: 'ex2-q42',
        qNum: 42,
        category: 'Chemical Hazards',
        question: 'Acrylamide is a process contaminant (classified as a probable human carcinogen) that forms when asparagine reacts with reducing sugars above 120°C in which foods?',
        options: [
          'Boiled white rice and steamed fish',
          'Fried potato chips/French fries, roasted coffee, biscuits, and toasted cereals',
          'Pasteurized milk and yogurt',
          'Fresh cut salads'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Acrylamide forms via the Maillard reaction in starchy foods rich in free asparagine (potatoes, cereals, coffee) fried or baked above 120°C.'
      },
      {
        id: 'ex2-q43',
        qNum: 43,
        category: 'Filtration CCP',
        question: 'In a liquid juice, oil, or syrup line, how is the integrity of a fine inline filter/strainer (OPRP/CCP) monitored?',
        options: [
          'By tasting the syrup',
          'By scheduled visual inspection of the filter mesh at shift start/end AND continuous differential pressure (ΔP) gauges across the filter housing',
          'By checking tank color',
          'Once a year during shutdown'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'A sudden drop in differential pressure (ΔP) indicates a ruptured filter mesh, while excessive ΔP risks bursting the screen.'
      },
      {
        id: 'ex2-q44',
        qNum: 44,
        category: 'Water Disinfection',
        question: 'In a bottled water or beverage plant using UV-C disinfection lamps, why must lamp runtime hours and UV intensity sensors (mW/cm²) be monitored?',
        options: [
          'Because UV lamps change color to green when old',
          'Because UV-C germicidal output (254 nm) decays over time (typically after 8,000–9,000 hours) even while the bulb still glows visibly blue',
          'To heat the water',
          'To add ozone'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'A UV bulb can still emit visible blue light after its 254 nm germicidal UV-C intensity has dropped below the lethal dose (≥ 40 mJ/cm²).'
      },
      {
        id: 'ex2-q45',
        qNum: 45,
        category: 'Egg Processing HACCP',
        question: 'Which pathogen is vertically transmitted (transovarian) inside intact hen eggs, making pasteurization of liquid whole egg (e.g., 60–64.4°C for 3.5 min) a critical CCP?',
        options: ['Salmonella Enteritidis', 'Vibrio parahaemolyticus', 'Clostridium perfringens', 'Yersinia enterocolitica'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Salmonella Enteritidis colonizes ovarian tissue in laying hens and can be present inside intact shell eggs.'
      },
      {
        id: 'ex2-q46',
        qNum: 46,
        category: 'Infant Formula HACCP',
        question: 'Which desiccated-tolerant pathogen is of critical concern in Powdered Infant Formula (PIF) manufacturing environments?',
        options: [
          'Cronobacter sakazakii (formerly Enterobacter sakazakii) and Salmonella',
          'Pseudomonas fluorescens',
          'Pediococcus cerevisiae',
          'Acetobacter aceti'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Cronobacter sakazakii survives dry spray-drying environments for months and causes fatal neonatal meningitis and necrotizing enterocolitis.'
      },
      {
        id: 'ex2-q47',
        qNum: 47,
        category: 'Dry Zone Hygiene',
        question: 'Why is wet cleaning (water hosing) strictly avoided in dry mixing/packing zones for powdered milk, infant formula, and flour?',
        options: [
          'Water is too expensive',
          'Introducing moisture into a dry zone triggers rapid exponential growth of dormant Salmonella and Cronobacter in floor cracks and equipment',
          'Water washes away paint',
          'Dry vacuuming takes longer'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Dry zones rely on moisture exclusion (aw < 0.60); Controlled Dry Cleaning (HEPA vacuuming, scraping, alcohol wipes) prevents pathogen proliferation.'
      },
      {
        id: 'ex2-q48',
        qNum: 48,
        category: 'Gas Flushing CCP',
        question: 'In Modified Atmosphere Packaging (MAP) where low residual oxygen (< 0.5%–1.0% O2) is an OPRP/CCP for shelf-life and safety, how is it monitored?',
        options: [
          'Squeezing the pack by hand',
          'Using a calibrated Headspace Gas Analyzer (O2 / CO2 needle probe or optical sensor) + seal integrity water-bath leak test at defined intervals',
          'Weighing the gas cylinder once a month',
          'Checking room humidity'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Calibrated O2/CO2 headspace analyzers and seal integrity (bubble leak) checks verify that gas flushing and hermetic sealing meet specs.'
      },
      {
        id: 'ex2-q49',
        qNum: 49,
        category: 'HACCP Review',
        question: 'If a factory replaces a manual batch cooking kettle with an automated continuous steam tunnel, what must the HACCP team do BEFORE commercial release?',
        options: [
          'Nothing, the recipe is the same',
          'Update the Flow Diagram, conduct a new Hazard Analysis for the steam tunnel, validate heat distribution/cold spots, and update the HACCP Plan',
          'Wait until next year’s external audit',
          'Only inform the sales team'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Any equipment or process change requires updating the flow diagram, reassessing hazards, and re-validating critical limits.'
      },
      {
        id: 'ex2-q50',
        qNum: 50,
        category: 'Prerequisite Foundation',
        question: 'What happens if a company attempts to implement a HACCP plan without first having solid Prerequisite Programs (GMP/GHP) in place?',
        options: [
          'The HACCP plan becomes simpler',
          'The system fails because the team ends up designating dozens of general hygiene steps as CCPs, making real-time monitoring unmanageable ("building a house on sand")',
          'No CCPs are needed',
          'Certification is granted faster'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'PRPs (GMP/GHP) are the essential foundation of the food safety pyramid; without them, a HACCP plan becomes overloaded and ineffective.'
      }
    ]
  },
  {
    id: 'exam-set-3',
    setNumber: 3,
    title: 'Exam Set 3: ISO 22000:2018 & FSSC 22000 v6 Lead Auditor',
    subtitle: '50 Official Practice MCQs on ISO 22000 Clauses 4–10, FSSC v6 Additional Requirements, TACCP, VACCP & Auditing Principles',
    subjectArea: 'ISO 22000:2018 & FSSC 22000 v6',
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 100,
    passingPercentage: 60,
    questions: [
      {
        id: 'ex3-q1',
        qNum: 1,
        category: 'ISO 22000 Structure',
        question: 'Which ISO High-Level Structure (HLS) framework does ISO 22000:2018 follow so it aligns seamlessly with ISO 9001, ISO 14001, and ISO 45001?',
        options: ['Annex A', 'Annex SL (10-Clause High-Level Structure)', 'Codex Annex IV', 'PAS 220'],
        correctIndex: 1,
        marks: 2,
        explanation: 'ISO 22000:2018 adopts the ISO Annex SL 10-clause structure for seamless integration with other ISO management system standards.'
      },
      {
        id: 'ex3-q2',
        qNum: 2,
        category: 'ISO 22000 Clauses',
        question: 'In ISO 22000:2018, which Clause covers "Operation" (including PRPs, Traceability, Emergency Preparedness, and the HACCP/Hazard Control Plan)?',
        options: ['Clause 5', 'Clause 6', 'Clause 8', 'Clause 9'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Clause 8 is "Operation," containing the entire operational PDCA food safety and HACCP requirements.'
      },
      {
        id: 'ex3-q3',
        qNum: 3,
        category: 'ISO 22000 Clauses',
        question: 'Which Clause of ISO 22000:2018 requires identifying "Internal and External Issues" and the "Needs and Expectations of Interested Parties"?',
        options: ['Clause 4 (Context of the Organization)', 'Clause 7 (Support)', 'Clause 8 (Operation)', 'Clause 10 (Improvement)'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Clause 4.1 covers External/Internal Issues and Clause 4.2 covers Interested Parties.'
      },
      {
        id: 'ex3-q4',
        qNum: 4,
        category: 'ISO 22000 Clauses',
        question: 'In ISO 22000:2018, what is the single unified term used in Clause 8.5.4 for the plan governing both CCPs and OPRPs?',
        options: ['Sanitation Schedule', 'Hazard Control Plan', 'Quality Manual', 'Master Cleaning Plan'],
        correctIndex: 1,
        marks: 2,
        explanation: 'ISO 22000:2018 Clause 8.5.4 combines CCPs and OPRPs into the unified "Hazard Control Plan."'
      },
      {
        id: 'ex3-q5',
        qNum: 5,
        category: 'CCP vs OPRP',
        question: 'According to ISO 22000:2018 definitions, a CCP uses "Critical Limits," whereas an OPRP uses:',
        options: ['Action Criteria (measurable or observable criteria)', 'Visual guesses', 'Marketing targets', 'Customer surveys'],
        correctIndex: 0,
        marks: 2,
        explanation: 'In ISO 22000:2018, CCPs have measurable Critical Limits, whereas OPRPs are controlled via measurable or observable Action Criteria.'
      },
      {
        id: 'ex3-q6',
        qNum: 6,
        category: 'FSSC 22000 Architecture',
        question: 'Why was ISO 22000 alone originally not accepted by GFSI (Global Food Safety Initiative) without ISO/TS 22002-1 and FSSC Additional Requirements?',
        options: [
          'ISO 22000 was written in French',
          'ISO 22000 did not contain detailed, prescriptive sector-specific Prerequisite Program (PRP) requirements or Food Defense/Food Fraud rules',
          'ISO 22000 did not include HACCP',
          'ISO 22000 only applied to farms'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'GFSI benchmarking required prescriptive PRPs (provided by ISO/TS 22002-1) plus Food Fraud, Food Defense, and Allergen management.'
      },
      {
        id: 'ex3-q7',
        qNum: 7,
        category: 'ISO/TS 22002 Series',
        question: 'Which technical specification provides the Prerequisite Programs (PRPs) specifically for Food Manufacturing (FSSC Category C)?',
        options: ['ISO/TS 22002-1', 'ISO/TS 22002-2 (Catering)', 'ISO/TS 22002-4 (Food Packaging)', 'ISO 19011'],
        correctIndex: 0,
        marks: 2,
        explanation: 'ISO/TS 22002-1:2009 specifies PRPs for Food Manufacturing; 22002-2 is Catering; 22002-4 is Food Packaging Manufacturing.'
      },
      {
        id: 'ex3-q8',
        qNum: 8,
        category: 'Auditing Guidelines',
        question: 'Which international ISO standard provides the official guidelines for auditing management systems (including principles of auditing and auditor competence)?',
        options: ['ISO 9000', 'ISO 19011', 'ISO 17025', 'ISO 31000'],
        correctIndex: 1,
        marks: 2,
        explanation: 'ISO 19011 provides the guidelines for auditing management systems (first-party and second-party audits).'
      },
      {
        id: 'ex3-q9',
        qNum: 9,
        category: 'Audit Types',
        question: 'When a supermarket or fast-food brand (e.g., McDonald’s, Metro, Carrefour) audits its raw material supplier factory, what type of audit is this?',
        options: [
          'First-Party Audit (Internal Audit)',
          'Second-Party Audit (Customer / Supplier Audit)',
          'Third-Party Audit (Independent Certification Audit)',
          'Financial Tax Audit'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: '1st Party = Internal; 2nd Party = Customer auditing a Supplier; 3rd Party = Independent accredited Certification Body (e.g., SGS, Bureau Veritas).'
      },
      {
        id: 'ex3-q10',
        qNum: 10,
        category: 'Principles of Auditing',
        question: 'An internal auditor is assigned to audit the Quality Control Lab where she works as the Lab Supervisor. Which core ISO 19011 Principle of Auditing is violated?',
        options: [
          'Confidentiality',
          'Independence / Impartiality ("Auditors shall not audit their own work")',
          'Risk-based approach',
          'Punctuality'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'ISO 19011 and ISO 22000 Clause 9.2 strictly require auditor independence and objectivity; auditors must be independent of the activity being audited.'
      },
      {
        id: 'ex3-q11',
        qNum: 11,
        category: 'Stage 1 vs Stage 2 Audit',
        question: 'In a Third-Party Certification Audit (ISO/IEC 17021 & ISO 22003), what is the primary objective of the Stage 1 Audit?',
        options: [
          'Issuing the final 3-year certificate immediately',
          'Reviewing the organization’s FSMS documentation, scope, hazard analysis readiness, PRPs, and site preparedness for the Stage 2 implementation audit',
          'Testing every finished product in a lab',
          'Firing non-compliant operators'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Stage 1 evaluates documentation adequacy, scope, HACCP/PRP design, and readiness before proceeding to Stage 2 (on-site implementation).'
      },
      {
        id: 'ex3-q12',
        qNum: 12,
        category: 'FSSC 22000 Nonconformities',
        question: 'In an FSSC 22000 audit, what happens if a Certification Body auditor raises a CRITICAL Non-Conformity (direct food safety hazard or falsification of records)?',
        options: [
          'The site gets 1 year to fix it',
          'The existing certificate is immediately suspended (for up to 6 months) or initial certification is denied until a follow-up on-site audit verifies closure',
          'Only a verbal warning is given',
          'It is downgraded to an OFI'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Under FSSC 22000 rules, a Critical Nonconformity results in immediate suspension of the certificate until verified closed via an on-site audit.'
      },
      {
        id: 'ex3-q13',
        qNum: 13,
        category: 'FSSC 22000 Nonconformities',
        question: 'Within how many calendar days must a Major Non-Conformity be closed (including root cause analysis, corrective action plan, and evidence of implementation) in an FSSC 22000 audit?',
        options: ['Within 28 calendar days', 'Within 180 days', 'Within 365 days', 'Within 2 hours'],
        correctIndex: 0,
        marks: 2,
        explanation: 'FSSC 22000 strictly mandates that Major Nonconformities must be closed and verified by the CB within 28 calendar days of the last day of the audit.'
      },
      {
        id: 'ex3-q14',
        qNum: 14,
        category: 'TACCP & Food Defense',
        question: 'What is the primary focus of TACCP (Threat Assessment Critical Control Point / Food Defense) under FSSC 22000 Additional Requirement 2.5.3?',
        options: [
          'Preventing accidental machine wear',
          'Preventing intentional, ideologically or maliciously motivated contamination, sabotage, or tampering',
          'Negotiating lower ingredient prices',
          'Reducing electricity bills'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'TACCP protects the food supply chain from intentional malicious sabotage, tampering, or bioterrorism.'
      },
      {
        id: 'ex3-q15',
        qNum: 15,
        category: 'VACCP & Food Fraud',
        question: 'What is the primary focus of VACCP (Vulnerability Assessment Critical Control Point / Food Fraud Mitigation) under FSSC 22000 Additional Requirement 2.5.4?',
        options: [
          'Preventing factory fires',
          'Preventing Economically Motivated Adulteration (EMA), substitution, dilution, mislabeling, or counterfeiting of raw materials',
          'Checking forklift tires',
          'Measuring noise levels'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'VACCP prevents economically motivated food fraud such as diluting honey with sugar syrup, adding melamine to milk, or Sudan dye to chili powder.'
      },
      {
        id: 'ex3-q16',
        qNum: 16,
        category: 'FSSC 22000 Logo Rules',
        question: 'Where is a certified food manufacturer STRICTLY PROHIBITED from displaying the FSSC 22000 or ISO 22000 certification mark?',
        options: [
          'On the company website',
          'On primary/secondary food product packaging, product labels, or Certificates of Analysis (CoAs)',
          'On company marketing brochures',
          'On recruitment advertisements'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Management system certification logos must never appear on product packaging or CoAs because they certify the system, not individual product units.'
      },
      {
        id: 'ex3-q17',
        qNum: 17,
        category: 'Environmental Monitoring',
        question: 'In FSSC 22000 Environmental Monitoring (2.5.7), a swab taken directly from a cheese slicer blade or conveyor belt that touches unpackaged food belongs to which Zone?',
        options: ['Zone 1 (Direct Food Contact Surface)', 'Zone 2', 'Zone 3', 'Zone 4'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Zone 1 encompasses all surfaces that come into direct contact with exposed product.'
      },
      {
        id: 'ex3-q18',
        qNum: 18,
        category: 'Environmental Monitoring',
        question: 'In the 4-Zone Environmental Monitoring model, floor drains, walls, and hand-trucks inside the processing room belong to which Zone?',
        options: ['Zone 1', 'Zone 2', 'Zone 3 (Non-food contact surfaces inside processing area not adjacent to Zone 1)', 'Zone 4'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Zone 3 covers floors, drains, walls, and mobile equipment inside the production room; Zone 4 is outside production (locker rooms/warehouses).'
      },
      {
        id: 'ex3-q19',
        qNum: 19,
        category: 'Unannounced Audits',
        question: 'Under FSSC 22000 scheme rules, how often must a certified site undergo an Unannounced Surveillance Audit?',
        options: [
          'Never, all audits are scheduled 6 months ahead',
          'At least once in every 3-year certification cycle',
          'Every week',
          'Only if the site fails an audit'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'GFSI and FSSC 22000 mandate at least 1 unannounced surveillance audit during every 3-year certification cycle.'
      },
      {
        id: 'ex3-q20',
        qNum: 20,
        category: 'Unannounced Audits',
        question: 'When an FSSC 22000 auditor arrives at the security gate for an Unannounced Audit, within how much time must the site grant access to the production area?',
        options: ['Within 1 hour of arrival', 'After 24 hours', 'After 3 days', 'Whenever the CEO returns from vacation'],
        correctIndex: 0,
        marks: 2,
        explanation: 'The auditor must be admitted to the production floor within 1 hour of arrival at the site; refusing entry leads to immediate certificate suspension.'
      },
      {
        id: 'ex3-q21',
        qNum: 21,
        category: 'Serious Event Notification',
        question: 'Under FSSC 22000 v6 (2.5.17), within how many working days must a certified organization notify its Certification Body of a product recall, regulatory prosecution, or major flood/fire?',
        options: ['Within 3 working days', 'Within 30 days', 'At the next annual audit', 'Within 90 days'],
        correctIndex: 0,
        marks: 2,
        explanation: 'FSSC 22000 v6 requires reporting serious events (recalls, regulatory enforcement, outbreaks) to the CB within 3 working days.'
      },
      {
        id: 'ex3-q22',
        qNum: 22,
        category: 'ISO 22000 Clause 5',
        question: 'Under ISO 22000:2018 Clause 5.2, which three elements must the Food Safety Policy include?',
        options: [
          'Product prices, profit targets, and shareholder names',
          'Commitment to satisfy food safety/legal/customer requirements, commitment to continual improvement, and addressing internal/external communication & competencies',
          'List of all factory machines',
          'Employee vacation schedules'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Clause 5.2.1 requires commitments to food safety, statutory/regulatory & customer requirements, communication, competencies, and continual improvement.'
      },
      {
        id: 'ex3-q23',
        qNum: 23,
        category: 'ISO 22000 Clause 6',
        question: 'What does ISO 22000:2018 Clause 6.2 require regarding Food Safety Objectives?',
        options: [
          'They can be vague statements like "do our best"',
          'They must be measurable, monitored, communicated, consistent with the Food Safety Policy, and updated as appropriate (SMART objectives)',
          'They are kept secret by the CEO',
          'They only measure sales volume'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Food Safety Objectives (e.g., < 2 complaints per million packs, 100% CCP compliance, 0 recalls) must be measurable and monitored.'
      },
      {
        id: 'ex3-q24',
        qNum: 24,
        category: 'ISO 22000 Clause 7',
        question: 'Under ISO 22000:2018 Clause 7.1.5, if an organization uses a software system or external consultant to develop its HACCP plan, who retains ultimate responsibility for its conformity and effectiveness?',
        options: [
          'The external software company',
          'The food organization’s Top Management and Food Safety Team',
          'The Certification Body auditor',
          'The raw material supplier'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Clause 7.1.5 states that externally developed FSMS elements must be adapted specifically to the site’s processes and validated by the Food Safety Team.'
      },
      {
        id: 'ex3-q25',
        qNum: 25,
        category: 'ISO 22000 Clause 8.3',
        question: 'Which information must the Traceability System (ISO 22000 Clause 8.3) capture at a minimum?',
        options: [
          'Only finished product brand names',
          'Relation of received materials, ingredients, and packaging to final products, rework routing, and distribution of the end product',
          'Employee home addresses',
          'Competitor prices'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Clause 8.3 requires uniquely identifying lots from incoming suppliers through all processing/rework stages to the immediate customer.'
      },
      {
        id: 'ex3-q26',
        qNum: 26,
        category: 'ISO 22000 Clause 8.4',
        question: 'Why does ISO 22000 Clause 8.4.2 require periodic testing (drills) of Emergency Preparedness procedures?',
        options: [
          'To give staff a break from production',
          'To verify that staff know how to protect food safety during real emergencies (e.g., cold-storage power failure, water contamination, ammonia leak) and identify gaps before a crisis occurs',
          'To test fire truck speed only',
          'To satisfy insurance agents only'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Emergency drills test whether cold-room doors are sealed, backup generators kick in, and contaminated utilities are isolated promptly.'
      },
      {
        id: 'ex3-q27',
        qNum: 27,
        category: 'ISO 22000 Clause 8.5',
        question: 'When selecting and categorizing control measures as OPRPs vs. CCPs in ISO 22000 Clause 8.5.2.4, which factors must be assessed for each control measure?',
        options: [
          'Cost of the machine only',
          'Likelihood of failure of its functioning and the severity of the consequence in case of failure (plus feasibility of establishing measurable limits and real-time monitoring)',
          'Age of the operator',
          'Brand of equipment'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'ISO 22000 Clause 8.5.2.4 evaluates the likelihood of failure, severity of consequence, synergy with other measures, and real-time measurability.'
      },
      {
        id: 'ex3-q28',
        qNum: 28,
        category: 'ISO 22000 Clause 8.8',
        question: 'Under ISO 22000:2018 Clause 8.8.1 (Verification), who is allowed to carry out verification activities?',
        options: [
          'The same person who is responsible for monitoring the activity',
          'Someone OTHER than the person who is responsible for monitoring the same activity (to ensure objectivity)',
          'External customers only',
          'Untrained temporary workers'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Clause 8.8.1 explicitly mandates that verification shall not be carried out by the person responsible for monitoring the same activity.'
      },
      {
        id: 'ex3-q29',
        qNum: 29,
        category: 'ISO 22000 Clause 8.9',
        question: 'In ISO 22000:2018, if an OPRP’s Action Criteria are NOT met, what must the organization do?',
        options: [
          'Ignore it because only CCPs matter',
          'Determine the cause of failure, determine the consequences with respect to food safety, and evaluate affected products for release or handling',
          'Throw away the entire factory',
          'Rewrite the Food Safety Policy'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'When an OPRP fails, the organization must determine the cause, assess food safety impact on the affected batch, and take corrective action.'
      },
      {
        id: 'ex3-q30',
        qNum: 30,
        category: 'Laboratory Accreditation',
        question: 'Under FSSC 22000 Additional Requirement 2.5.1 (Management of Services and Purchased Materials), laboratories used for verification/validation testing of food safety parameters must be accredited to which standard (or participate in proficiency testing)?',
        options: ['ISO 9001', 'ISO/IEC 17025', 'ISO 14001', 'ISO 50001'],
        correctIndex: 1,
        marks: 2,
        explanation: 'ISO/IEC 17025 is the international standard for the competence of testing and calibration laboratories.'
      },
      {
        id: 'ex3-q31',
        qNum: 31,
        category: 'Product Labeling',
        question: 'Under FSSC 22000 Additional Requirement 2.5.2 (Product Labeling and Printed Materials), which market’s legal and allergen regulations must the product label comply with?',
        options: [
          'Only the country where the factory is located',
          'All applicable statutory and regulatory requirements in the country of intended sale (including customer-specific and allergen labeling requirements)',
          'Only US FDA rules regardless of destination',
          'Only voluntary guidelines'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Exported products must comply with the labeling and allergen laws of the country of intended sale (e.g., GCC/GSO, EU 1169/2011, UK, or US FDA).'
      },
      {
        id: 'ex3-q32',
        qNum: 32,
        category: 'FSSC 22000 v6 Culture',
        question: 'Which four core dimensions of Food Safety and Quality Culture must be addressed in the organization’s plan under FSSC 22000 v6 (2.5.8)?',
        options: [
          'Sales, Marketing, Finance, HR',
          'Communication, Training, Employee Feedback & Engagement, and Performance Measurement of food safety/quality activities',
          'Painting, Gardening, Uniforms, Parking',
          'Advertising, Discounts, Packaging, Transport'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'FSSC 22000 v6 2.5.8 specifies Communication, Training, Employee Feedback/Engagement, and Performance Measurement.'
      },
      {
        id: 'ex3-q33',
        qNum: 33,
        category: 'FSSC 22000 v6 Food Loss',
        question: 'What does FSSC 22000 v6 Additional Requirement 2.5.16 (Food Loss and Waste) require Regarding products donated to charities or diverted to animal feed?',
        options: [
          'Donations are prohibited',
          'Donated food must be safe for consumption, handled under controlled storage, comply with legal requirements, and not be diverted to human consumption if intended only for animal feed',
          'Expired moldy food can be donated',
          'No records are required for food waste'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'FSSC v6 2.5.16 requires a documented strategy to reduce food waste and strict controls ensuring donated food or animal-feed by-products are safe and traceable.'
      },
      {
        id: 'ex3-q34',
        qNum: 34,
        category: 'Root Cause Analysis',
        question: 'In an ISO 22000 / FSSC 22000 audit corrective action response, why is "Operator retrained" often rejected by Lead Auditors as an inadequate Root Cause Analysis?',
        options: [
          'Auditors dislike training',
          'Because "human error" is usually a symptom of a deeper systemic root cause (e.g., unclear SOP, poor lighting, uncalibrated gauge, or lack of automated interlock)',
          'Training is too fast',
          'Only managers can be trained'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: '5-Whys analysis looks past individual human error to uncover the systemic flaw in process design, equipment, or environment.'
      },
      {
        id: 'ex3-q35',
        qNum: 35,
        category: 'Audit Evidence',
        question: 'According to ISO 19011, which three methods do auditors combine ("The Audit Triangle") to gather verifiable Objective Evidence?',
        options: [
          'Guessing, Assuming, and Estimating',
          'Observation of activities/conditions, Interviews with personnel, and Review of documented information (SOPs & records)',
          'Reading websites, calling competitors, and checking stock prices',
          'Only reading the Quality Manual in the office'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Auditors triangulate evidence through physical Observation, personnel Interviews, and Document/Record review.'
      },
      {
        id: 'ex3-q36',
        qNum: 36,
        category: 'Supplier Approval',
        question: 'Under FSSC 22000 (2.5.1), what must be defined in the emergency procurement procedure when a raw material must be purchased from an unapproved supplier in an urgent shortage?',
        options: [
          'Use the material immediately without testing',
          'Assess the supplier prior to use and inspect/test 100% of the incoming emergency batch to verify it meets food safety and specification requirements before production release',
          'Skip CoA verification',
          'Hide the purchase from QA'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Emergency procurement requires documented risk assessment and strict incoming batch inspection/testing prior to use.'
      },
      {
        id: 'ex3-q37',
        qNum: 37,
        category: 'Allergen Management FSSC',
        question: 'What does FSSC 22000 v6 (2.5.6 Management of Allergens) require regarding employees bringing personal food into the facility?',
        options: [
          'Employees can eat peanuts on the production line',
          'Risk assessment and control measures covering allergens brought on-site by staff, visitors, and canteen facilities, plus annual review of the allergen management plan',
          'Only managers can bring food onto the line',
          'No allergen training is needed for temporary staff'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Personal food and canteen meals must be controlled to prevent introducing undeclared allergens (such as peanuts, sesame, or tree nuts) into production.'
      },
      {
        id: 'ex3-q38',
        qNum: 38,
        category: 'Cross-Docking & Tankers',
        question: 'Under FSSC 22000 v6 (2.5.10 Transport, Storage and Warehousing), what is required when receiving bulk liquid food in road tankers (e.g., edible oil, liquid sugar, raw milk)?',
        options: [
          'Only check the driver’s license',
          'Verification of prior cargo loads (food-only dedicated tankers), validated tanker CIP wash certificates, and intact numbered security seals on all hatches and discharge valves',
          'Check tire pressure only',
          'Unload before testing'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Bulk tankers require prior-load history verification, validated cleaning certificates, and intact security seals on every dome and valve.'
      },
      {
        id: 'ex3-q39',
        qNum: 39,
        category: 'Cross-Contamination Control',
        question: 'Under FSSC 22000 v6 (2.5.11 Hazard Control and Measures to Prevent Cross-Contamination), when is Foreign Matter Detection equipment (metal detector, X-ray, magnet, sieve) NOT required?',
        options: [
          'When the line is running fast',
          'Only when a documented risk assessment proves foreign body detection is not necessary and alternative effective controls are in place',
          'During night shifts',
          'When exporting to local markets'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'A documented risk assessment is mandatory to justify either the selection of foreign body detection equipment or why a specific device is not needed.'
      },
      {
        id: 'ex3-q40',
        qNum: 40,
        category: 'PRP Verification',
        question: 'What does FSSC 22000 (2.5.12 PRP Verification) require regarding routine site hygiene inspections?',
        options: [
          'Only inspect once every 3 years before the external audit',
          'Routine (e.g., weekly/monthly) documented site inspections (GMP/GHP walks) with frequency based on risk to verify that PRPs and building/equipment maintenance remain effective',
          'Only inspect the reception office',
          'Verbal checks without records'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Routine risk-based GMP/PRP verification inspections ensure ongoing compliance between internal audits.'
      },
      {
        id: 'ex3-q41',
        qNum: 41,
        category: 'Product Design & R&D',
        question: 'Under FSSC 22000 (2.5.13 Product Design and Development), what must be verified whenever a new product or recipe modification is developed?',
        options: [
          'Only package color',
          'Impact on the Hazard Analysis, allergen status, process flow, equipment capability, shelf-life validation, and statutory labeling before commercial launch',
          'Only social media ads',
          'Competitor logo design'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'R&D product launches require formal HACCP reassessment, shelf-life trials, production trials, and legal label sign-off.'
      },
      {
        id: 'ex3-q42',
        qNum: 42,
        category: 'Audit Sampling',
        question: 'Why does an ISO 22000 audit conclusion include a statement on the "uncertainty of sampling"?',
        options: [
          'Because auditors do not read records',
          'Because an audit is conducted during a finite period using representative sampling of records, interviews, and batches, so 100% of all historical records cannot be examined',
          'Because thermometers are inaccurate',
          'To avoid writing an audit report'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Auditing is fundamentally based on risk-based sampling of available evidence within the audit duration.'
      },
      {
        id: 'ex3-q43',
        qNum: 43,
        category: 'Opening & Closing Meetings',
        question: 'In a formal Third-Party FSMS Audit, what is the purpose of the Opening Meeting?',
        options: [
          'To issue non-conformities immediately',
          'To confirm the audit scope, objectives, audit plan/schedule, communication channels, confidentiality, and safety/escort rules with site management',
          'To celebrate certification',
          'To negotiate audit fees'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'The Opening Meeting aligns the audit team and auditee management on the scope, criteria, timetable, and logistics.'
      },
      {
        id: 'ex3-q44',
        qNum: 44,
        category: 'Documented Information Retention',
        question: 'How long must an ISO 22000 certified food manufacturer retain batch CCP and traceability records?',
        options: [
          '1 week',
          'At least for the product’s stated shelf life plus an additional period (typically ≥ 1 year or as required by statutory law and customer contracts)',
          'Until the waste bin is full',
          '3 days'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Records must outlast the product shelf life and legal liability window so any market complaint or recall can be investigated.'
      },
      {
        id: 'ex3-q45',
        qNum: 45,
        category: 'Management Review Timing',
        question: 'What is the maximum interval allowed between Top Management Reviews under FSSC 22000 and GFSI standards?',
        options: ['At least once every 12 months (annually) or more frequently', 'Once every 3 years', 'Once every 5 years', 'Only when the CEO changes'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Management Review must be conducted at least annually (every 12 months) to evaluate FSMS performance and resource needs.'
      },
      {
        id: 'ex3-q46',
        qNum: 46,
        category: 'Mock Recall Frequency',
        question: 'How frequently must a food manufacturing site test its Traceability and Product Recall / Withdrawal procedure via a Mock Recall drill under FSSC 22000?',
        options: ['At least once every 12 months (annually)', 'Once every 5 years', 'Only after a real poisoning outbreak', 'Never'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Forward and backward traceability / mock recall drills must be conducted at least annually (12-month maximum interval).'
      },
      {
        id: 'ex3-q47',
        qNum: 47,
        category: 'Change Management',
        question: 'Which ISO 22000:2018 clause specifically requires "Planning of Changes" so that changes to the FSMS are carried out in a planned manner considering purpose, consequences, and resource availability?',
        options: ['Clause 4.4', 'Clause 6.3 (Planning of Changes)', 'Clause 9.1', 'Clause 10.3'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Clause 6.3 covers Planning of Changes to ensure FSMS integrity is maintained during organizational or process transitions.'
      },
      {
        id: 'ex3-q48',
        qNum: 48,
        category: 'Continual Updating',
        question: 'Which ISO 22000:2018 clause specifically requires "Updating of the Food Safety Management System" based on communication, verification, and management review outputs?',
        options: ['Clause 10.3 (Update of the FSMS)', 'Clause 5.1', 'Clause 7.2', 'Clause 8.1'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Clause 10.3 requires top management to ensure the FSMS is continually updated based on hazard analysis, verification, and management review.'
      },
      {
        id: 'ex3-q49',
        qNum: 49,
        category: 'Certification Cycle',
        question: 'How long is an ISO 22000 / FSSC 22000 certificate valid before a full Recertification Audit is required (subject to passing annual Surveillance Audits)?',
        options: ['1 year', '3 years (with annual surveillance audits in Year 1 and Year 2)', '5 years', 'Lifetime validity'],
        correctIndex: 1,
        marks: 2,
        explanation: 'ISO/FSSC certificates operate on a 3-year certification cycle with annual surveillance audits.'
      },
      {
        id: 'ex3-q50',
        qNum: 50,
        category: 'GFSI Benchmarking',
        question: 'Which of the following food safety standards is NOT a GFSI-benchmarked certification scheme?',
        options: [
          'FSSC 22000',
          'BRCGS Food Safety',
          'SQF (Safe Quality Food) & IFS Food',
          'ISO 22000 standalone (without ISO/TS 22002-1 & FSSC additional requirements)'
        ],
        correctIndex: 3,
        marks: 2,
        explanation: 'FSSC 22000, BRCGS, SQF, and IFS are GFSI-benchmarked; standalone ISO 22000 is an ISO standard but is not GFSI-benchmarked on its own.'
      }
    ]
  }
];
