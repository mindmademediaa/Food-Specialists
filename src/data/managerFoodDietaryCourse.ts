import { HubTraining } from '../types/hub';
import {
  CourseStudyModule,
  InternationalTrainingCourse
} from './internationalTrainingsData';

export const MANAGER_FOOD_DIETARY_MODULES: CourseStudyModule[] = [
  // =========================================================================
  // MODULE 1: ROLE OF CERTIFIED DIETARY MANAGER, KITCHEN SETUP & STAFF MANAGEMENT
  // =========================================================================
  {
    id: 'mfd-mod-1',
    moduleNumber: 1,
    title: 'Role of Certified Dietary Manager, Kitchen Layout & Staff Management',
    estimatedMinutes: 45,
    overview:
      'Simple, step-by-step presentation on what a Certified Dietary Manager does every day, how to organize a hospital or institutional kitchen, how one-way kitchen flow works, and how to manage kitchen and service staff.',
    internationalClauses: [
      'Hospital & Institutional Dietary Department Standard Operating Procedures',
      'Basic Food Safety & Hygiene Principles (Codex / ISO 22000)'
    ],
    keyPrinciples: [
      'The Certified Dietary Manager oversees all daily food operations: planning menus, ordering supplies, supervising cooking, checking patient diet trays, and maintaining kitchen cleanliness.',
      'A safe kitchen follows a "One-Way Flow" (Receiving → Storage → Preparation → Cooking → Tray Assembly → Dispatch) so raw food never touches cooked food.',
      'The Certified Dietary Manager works closely with Clinical Dietitians (who prescribe special patient diets) and Ward Nurses (who update patient admissions, discharges, and NPO status).',
      'Proper staff management includes shift scheduling, daily uniform/hygiene checks, annual medical fitness certificates, and keeping sick staff away from food handling.'
    ],
    criticalControlParameters: [
      {
        parameter: 'One-Way Kitchen Flow (Dirty to Clean Separation)',
        standardLimit: 'Raw food, cooked food, and dirty dishes must never cross paths',
        correctiveProtocol: 'Separate raw prep tables from cooked tray assembly and use dedicated trolleys.'
      },
      {
        parameter: 'Staff Illness & Fitness to Work Rule',
        standardLimit: 'Zero staff with vomiting, diarrhea, fever, or open skin cuts allowed in kitchen',
        correctiveProtocol: 'Send sick food handlers on medical leave and allow return only after 48 hours symptom-free.'
      }
    ],
    practicalChecklist: [
      'Conduct a 10-minute morning briefing with chefs, diet aides, and servers before breakfast service.',
      'Check staff uniforms, hairnets, clean aprons, trimmed nails, and handwashing before work starts.',
      'Coordinate with Ward Nurses and Clinical Dietitians for new patient admissions and diet changes.'
    ],
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Who is a Certified Dietary Manager?',
        subtitle: 'Understanding Your Core Role & Daily Responsibilities',
        bulletPoints: [
          'The Certified Dietary Manager is the head of the food and nutrition service department in a hospital, clinic, university, corporate facility, or catering unit.',
          'Your main goal is to serve safe, nutritious, hot, and tasty meals on time to patients, staff, and visitors.',
          'You manage two sides of the department: (1) Kitchen Production & Service, and (2) Clinical Patient Tray Accuracy.',
          'You control the department budget, food purchasing, store inventory, kitchen hygiene, and staff duty rosters.'
        ],
        keyTakeaway:
          'A successful Certified Dietary Manager ensures the right meal reaches the right person, at the right temperature, at the right time, every single day.',
        practicalExample:
          'In a 200-bed hospital, you oversee breakfast, lunch, evening tea, and dinner for patients as well as the staff cafeteria.'
      },
      {
        slideNumber: 2,
        title: 'Department Structure & Key Team Members',
        subtitle: 'How the Dietary Team Works Together',
        bulletPoints: [
          'Certified Dietary Manager: Overall head responsible for operations, quality, budget, and compliance.',
          'Clinical Dietitians / Nutritionists: Assess patients and prescribe therapeutic diets (Diabetic, Renal, Low-Salt, Soft/Pureed).',
          'Executive Chef & Cooks: Prepare regular meals and therapeutic patient meals according to standardized recipes.',
          'Diet Aides & Tray Line Servers: Assemble patient trays using printed diet tickets and deliver meals to wards.',
          'Storekeeper & Stewards (Dishwashers): Manage raw material stock and keep kitchen equipment and dishes clean.'
        ],
        keyTakeaway:
          'The Dietitian decides WHAT diet a patient needs; the Certified Dietary Manager ensures it is COOKED and DELIVERED accurately.'
      },
      {
        slideNumber: 3,
        title: 'Coordination with Doctors, Dietitians & Ward Nurses',
        subtitle: 'Preventing Diet Errors Through Clear Communication',
        bulletPoints: [
          'Before every meal (Breakfast, Lunch, Dinner), the dietary office receives an updated Diet Sheet / Ward Census from nursing stations.',
          'New Admissions & Discharges: Update the meal count immediately so no patient is missed and no extra food is wasted.',
          'Diet Changes: If a doctor changes a patient from "Regular Diet" to "NPO (Nil Per Os / Nothing by Mouth)" for surgery, remove their tray immediately.',
          'Hold Trays: If a patient is away for X-ray or dialysis, hold their meal safely and serve a fresh hot tray when they return.'
        ],
        keyTakeaway:
          'Always verify the updated Ward Diet Sheet before starting the patient tray assembly line.'
      },
      {
        slideNumber: 4,
        title: 'Main Sections of a Food & Dietary Kitchen',
        subtitle: 'How a Professional Kitchen is Divided into Zones',
        bulletPoints: [
          '1. Receiving Area: Where daily vegetables, meat, dairy, and dry groceries are weighed and checked.',
          '2. Storage Area: Divided into Dry Store, Chiller Room (+1°C to +4°C), and Freezer (-18°C).',
          '3. Pre-Preparation Area: Separate sinks and tables for washing vegetables and cutting raw meat/poultry.',
          '4. Hot Cooking Section: Stoves, ovens, steamers, and soup kettles for regular and diet cooking.',
          '5. Tray Assembly & Dispatch Area: Clean zone where patient trays are plated, checked, and loaded into meal carts.',
          '6. Dishwashing (Scullery) & Waste Area: Separate return zone for washing dirty trays and disposing of waste.'
        ],
        keyTakeaway:
          'Never mix raw meat preparation, clean patient tray assembly, and dirty dishwashing in the same space.'
      },
      {
        slideNumber: 5,
        title: 'The "One-Way Flow" Rule in the Kitchen',
        subtitle: 'Stopping Cross-Contamination by Design',
        bulletPoints: [
          'Food should move in ONE forward direction only: From Receiving → Store → Prep → Cooking → Serving → Dispatch.',
          'This is called the "One-Way Flow" or "Dirty-to-Clean Flow".',
          'Raw food and unwashed vegetables must never pass through the area where cooked meals and salads are plated.',
          'Dirty plates and leftover trays returning from hospital wards must enter directly into the Dishwashing Area through a separate return door or window.'
        ],
        keyTakeaway:
          'One-Way Flow means raw food moves forward into cooked food, and dirty dishes never cross the clean food path.'
      },
      {
        slideNumber: 6,
        title: 'Kitchen Lighting, Ventilation & Floor Standards',
        subtitle: 'Basic Facility Requirements Every Manager Must Check',
        bulletPoints: [
          'Floors & Walls: Must be smooth, non-slip, washable tiles or epoxy with rounded corners and covered floor drains.',
          'Ventilation & Exhaust Hoods: Cooking stoves must have working exhaust hoods with grease filters cleaned weekly to remove heat, smoke, and steam.',
          'Lighting: Bright, clear lighting (especially over food prep and tray-checking tables) with shatterproof covers over all bulbs/tubes.',
          'Handwashing Stations: Dedicated handwash basins at the kitchen entrance and inside prep areas—stocked with liquid soap, warm water, and paper towels.'
        ],
        keyTakeaway:
          'A well-lit, well-ventilated kitchen with dry, non-slip floors prevents both food contamination and staff accidents.'
      },
      {
        slideNumber: 7,
        title: 'Staff Shift Scheduling & Duty Rosters',
        subtitle: 'Managing 7-Day Kitchen Operations Smoothly',
        bulletPoints: [
          'Hospital and institutional kitchens operate 365 days a year, from early morning (5:30 AM) until night (9:30 PM).',
          'Divide staff into clear shifts: Morning Shift (Breakfast & Lunch prep), Afternoon Shift (Lunch service & Dinner cooking), and Relief/Off-Day Staff.',
          'Because the kitchen runs 7 days a week while each worker works 5 or 6 days, always keep trained relief staff (~1.4 staff per daily position) to cover weekly offs and sick leave.',
          'Post the weekly duty roster clearly on the notice board at least 3 days in advance.'
        ],
        keyTakeaway:
          'Cross-train your cooks and diet aides so that if one person is absent, another trained team member can cover the station smoothly.'
      },
      {
        slideNumber: 8,
        title: 'Staff Personal Hygiene & Uniform Standards',
        subtitle: 'Daily Grooming Rules for All Food Handlers',
        bulletPoints: [
          'Clean Uniform: Every staff member must wear a clean kitchen uniform, apron, non-slip closed shoes, and a hairnet/cap that covers 100% of hair (plus beard cover if applicable).',
          'Nails & Jewelry: Fingernails must be short, clean, and unvarnished. Wristwatches, rings, bracelets, and dangling earrings are strictly prohibited in food areas.',
          'Handwashing Rule: Wash hands for 20 seconds with soap and warm water before starting work, after touching raw meat, after using the washroom, and after touching face or bins.',
          'Glove Use: Disposable gloves must be changed between tasks; wearing gloves never replaces proper handwashing.'
        ],
        keyTakeaway:
          'Inspect staff hands, nails, hairnets, and uniforms every morning before they touch any food or utensil.'
      },
      {
        slideNumber: 9,
        title: 'Staff Medical Fitness & Illness Reporting',
        subtitle: 'Protecting Patients & Diners from Foodborne Infections',
        bulletPoints: [
          'Every kitchen employee must have a valid Pre-Employment and Annual Medical Fitness Certificate (including Typhoid vaccination, Hepatitis A screening, and stool/blood check).',
          'Mandatory Illness Reporting: Staff must immediately inform the Manager if they have diarrhea, vomiting, fever, jaundice, sore throat, or infected cuts/boils on hands.',
          '48-Hour Exclusion Rule: Any staff member with vomiting or diarrhea must be removed from food handling immediately and may only return after being 100% symptom-free for at least 48 hours.',
          'Small Cuts: Any minor clean cut on a finger must be covered with a bright Blue Waterproof Detectable Bandage AND a disposable glove.'
        ],
        keyTakeaway:
          'Never allow a sick cook or server with vomiting or diarrhea to work in the kitchen—keep them off food duty until 48 hours symptom-free.'
      },
      {
        slideNumber: 10,
        title: 'The Manager’s Daily Morning Routine',
        subtitle: 'Your 5-Step Daily Success Habits',
        bulletPoints: [
          'Step 1 (Morning Walk-Around): Check chiller/freezer temperatures, kitchen cleanliness, and receiving dock readiness.',
          'Step 2 (Staff Briefing — 10 Mins): Check attendance, uniforms, today’s menu, patient count, and VIP/special functions.',
          'Step 3 (Clinical Diet Check): Review special diet counts (Diabetic, Renal, Soft, NPO, Allergies) with the Dietitian/Supervisor.',
          'Step 4 (Pre-Service Tasting & Temp Check): Taste meals for salt/quality and verify hot/cold temperatures 20 minutes before service.',
          'Step 5 (End-of-Day Review): Check food wastage, leftover cooling logs, cleaning sign-offs, and next day’s store requisition.'
        ],
        keyTakeaway:
          'A 10-minute morning briefing and a daily kitchen walkthrough prevent 90% of operational mistakes.'
      }
    ]
  },

  // =========================================================================
  // MODULE 2: PATIENT DIETS, MENU PLANNING & TRAY SERVICE MANAGEMENT
  // =========================================================================
  {
    id: 'mfd-mod-2',
    moduleNumber: 2,
    title: 'Patient Diets, Menu Planning & Tray Service Management',
    estimatedMinutes: 50,
    overview:
      'Simple presentation on hospital and institutional menu planning, understanding regular and therapeutic diets (Diabetic, Low-Salt/Cardiac, Renal, Soft/Pureed, Allergies), checking patient tray tickets, and delivering meals safely to wards.',
    internationalClauses: [
      'Hospital Therapeutic Diet Manual & Patient Safety Guidelines',
      'IDDSI Texture-Modified Diet Basics & Two-Patient-Identifier Rule'
    ],
    keyPrinciples: [
      'Hospital menus are divided into Regular Diets (for patients with no dietary restrictions) and Therapeutic Diets (modified in sugar, salt, fat, protein, or texture as part of medical treatment).',
      'Common therapeutic diets include Diabetic (controlled carbs, no added sugar), Cardiac/Low-Sodium (low salt, low saturated fat), Renal (controlled potassium, phosphorus, sodium, and fluids), and Texture-Modified (Liquid, Pureed, Minced, Soft).',
      'Every patient tray must have a printed Diet Ticket / Tray Card showing Patient Name, MRN/ID Number, Ward/Bed, Diet Type, and Allergies.',
      'Before handing a tray to a patient at the bedside, staff must verify Two Patient Identifiers (Patient Full Name + Medical Record Number/Date of Birth) against the patient wristband.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Bedside Patient Identification Check',
        standardLimit: 'Verify 2 Unique Patient Identifiers (Full Name + MRN/DOB) on tray card and wristband',
        correctiveProtocol: 'Never deliver a tray by checking room or bed number alone, as patients often change beds.'
      },
      {
        parameter: 'Tube Feeding (Enteral Formula) Hygiene & Hang Time',
        standardLimit: 'Prepare in a sanitized area; reconstituted powdered formula max bedside hang time ≤ 4 hours',
        correctiveProtocol: 'Label every feed with Patient Name, Time Prepared, and Expiry Time; discard after 4 hours.'
      }
    ],
    practicalChecklist: [
      'Inspect 100% of therapeutic and allergy trays at the end of the tray line before loading into ward carts.',
      'Confirm that NPO (Nothing by Mouth) patients never receive food or water trays.',
      'Verify that hot meals leave the kitchen at ≥ 63°C and cold items at ≤ 5°C in insulated or heated carts.'
    ],
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Menu Planning for Hospitals & Institutions',
        subtitle: 'How to Design a Balanced Cyclic Menu',
        bulletPoints: [
          'What is a Cyclic Menu? A planned menu that rotates every 7 days, 14 days, or 28 days so patients and staff do not get bored with repeating dishes.',
          'Nutritional Balance: Every main meal should include a Protein source (chicken, fish, meat, lentils, eggs), Complex Carbohydrate (chapati, rice, oats, potato), Vegetables, and Dairy/Fruit.',
          'One Base Recipe, Multiple Diets: Plan menus so the main dish (e.g., grilled chicken & vegetables) can easily be adapted into Low-Salt, Diabetic, and Soft/Pureed versions before adding heavy spices or salt.',
          'Seasonal & Budget Friendly: Use fresh, in-season fruits and vegetables for better taste and lower cost.'
        ],
        keyTakeaway:
          'A smart cyclic menu allows cooks to prepare regular and therapeutic diets from the same fresh ingredients with consistent quality.'
      },
      {
        slideNumber: 2,
        title: 'Progression of Hospital Diets (Liquid to Regular)',
        subtitle: 'Understanding Transitional Diets After Surgery or Illness',
        bulletPoints: [
          '1. NPO (Nil Per Os — Nothing by Mouth): Patient must NOT be given any food, water, or juice (usually before surgery or certain tests).',
          '2. Clear Liquid Diet: Transparent liquids that leave no residue—clear broth, apple juice without pulp, plain jelly/gelatin, weak tea (used right after surgery).',
          '3. Full Liquid Diet: All liquids plus milk, strained cream soups, thin custard, yogurt, and plain pudding.',
          '4. Soft / Mechanical Soft Diet: Tender, easily chewed foods with low fiber and mild seasoning (khichdi, mashed potatoes, minced chicken, soft-cooked vegetables).',
          '5. Regular (Normal) Diet: Complete balanced meal for patients with no special restrictions.'
        ],
        keyTakeaway:
          'Never send any food or water tray to an NPO patient—giving food before anesthesia can be life-threatening.'
      },
      {
        slideNumber: 3,
        title: 'Diabetic & Heart-Healthy (Cardiac) Diets',
        subtitle: 'Managing Sugar, Carbohydrates, Salt & Fat',
        bulletPoints: [
          'Diabetic Diet (Controlled Carbohydrate):',
          '• Avoid all refined sugars, regular sweets, honey, sugary juices, and soft drinks.',
          '• Serve controlled portions of high-fiber whole grains (whole-wheat chapati, brown rice, oats), lean protein, and non-starchy vegetables.',
          '• Provide timed meals and evening snacks so blood sugar matches insulin/medication.',
          'Cardiac / Low-Sodium (Low-Salt) Diet:',
          '• Restrict salt (sodium) to under 1,500–2,000 mg/day; avoid pickles, papad, canned soups, salty snacks, and salted butter.',
          '• Use lemon, garlic, ginger, and fresh herbs for flavor, and cook with minimal heart-healthy oil (olive/canola).'
        ],
        keyTakeaway:
          'Diabetic trays need consistent carbs and zero added sugar; Cardiac trays need low salt and low saturated fat.'
      },
      {
        slideNumber: 4,
        title: 'Renal (Kidney) & High-Protein Healing Diets',
        subtitle: 'Special Care for Kidney Patients & Post-Surgery Recovery',
        bulletPoints: [
          'Renal (Kidney Disease) Diet:',
          '• Kidneys cannot easily filter excess Sodium (Salt), Potassium, Phosphorus, and Fluids.',
          '• Avoid high-potassium foods like bananas, oranges, coconut water, spinach, and tomatoes (potatoes must be peeled, diced, soaked, and boiled in excess water to remove potassium).',
          '• NEVER use commercial "Low-Sodium Salt Substitutes" on Renal trays because they contain Potassium Chloride, which is dangerous for kidney patients!',
          'High-Protein / High-Calorie Diet:',
          '• Given to burn patients, trauma/post-surgery patients, and malnourished patients (extra eggs, chicken, fish, paneer, milkshakes, and protein supplements).'
        ],
        keyTakeaway:
          'Never use potassium-based salt substitutes for Renal patients, and always follow the Dietitian’s exact protein and fluid limits.'
      },
      {
        slideNumber: 5,
        title: 'Swallowing Difficulty (Dysphagia) & IDDSI Texture Levels',
        subtitle: 'Safe Food & Drink Textures for Stroke and Elderly Patients',
        bulletPoints: [
          'Patients after a stroke or neurological illness often have Dysphagia (difficulty swallowing) and can choke or inhale thin water into their lungs.',
          'We use the simple IDDSI (0 to 7) Texture Scale:',
          '• Drinks (Levels 0 to 4): Level 0 = Thin Water; Level 1 = Slightly Thick; Level 2 = Mildly Thick; Level 3 = Moderately Thick; Level 4 = Extremely Thick.',
          '• Foods (Levels 3 to 7): Level 4 = Smooth Pureed (no lumps, holds shape on spoon); Level 5 = Minced & Moist (tiny 4mm pieces); Level 6 = Soft & Bite-Sized (1.5cm tender pieces); Level 7 = Regular.',
          'Quick Kitchen Test: For Level 4 Pureed food, it should sit on a fork without dripping through the prongs and slide off a spoon smoothly without sticking.'
        ],
        keyTakeaway:
          'Never serve thin liquids, dry crumbly bread, nuts, or foods with mixed lumps to a patient on a Pureed (Level 4) dysphagia diet.'
      },
      {
        slideNumber: 6,
        title: 'Managing Food Allergies & Gluten-Free Trays',
        subtitle: 'Protecting Allergic & Celiac Patients in the Kitchen',
        bulletPoints: [
          'Major Food Allergens: Milk/Dairy, Eggs, Peanuts, Tree Nuts, Wheat/Gluten, Soy, Fish, Shellfish, and Sesame.',
          'Even a tiny trace of an allergen on a knife, chopping board, or cooking pan can trigger a severe life-threatening reaction (Anaphylaxis).',
          'Gluten-Free Diet (for Celiac Disease): Strictly avoid wheat, barley, rye, regular bread/chapati, pasta, and regular soy sauce; use rice, corn, millet, potatoes, and certified gluten-free flour.',
          'Kitchen Rule: Prepare allergy meals in a separate clean zone using dedicated PURPLE-colored cutting boards, knives, and utensils after washing hands and changing gloves.'
        ],
        keyTakeaway:
          'Sanitizer spray kills bacteria, NOT food allergens! You must wash equipment with soap and hot water and use dedicated Purple utensils for allergy trays.'
      },
      {
        slideNumber: 7,
        title: 'Tube Feeding (Enteral Nutrition) & Infant Formula Room',
        subtitle: 'Safe Preparation for ICU & Pediatric Patients',
        bulletPoints: [
          'Patients in ICU who cannot eat by mouth receive liquid nutrition through a feeding tube (Nasogastric / PEG tube).',
          'Clean Preparation Room: Tube feeds and infant formulas must be prepared in a dedicated, sanitized room using boiled/sterile water and sterilized blenders/bottles.',
          'Clear Labeling: Every bottle/bag must be labeled with Patient Name, MRN, Ward/Bed, Formula Name, Date & Time Prepared, and Expiry Time.',
          'Maximum Hang Time Rule: Powdered or kitchen-blended feeds can hang at room temperature at the bedside for a MAXIMUM of 4 hours (Ready-to-Hang sterile hospital bags can hang 24 hours).'
        ],
        keyTakeaway:
          'Never keep reconstituted powdered or blenderized tube feeds at room temperature for more than 4 hours.'
      },
      {
        slideNumber: 8,
        title: 'The Patient Tray Assembly Line (Belt System)',
        subtitle: 'How to Assemble 100% Accurate Patient Trays',
        bulletPoints: [
          'Step 1 (Tray Ticket Starter): Place the printed Patient Diet Ticket on the tray along with the correct color tray mat and cutlery.',
          'Step 2 (Cold Station): Place salads, yogurt, fruit, or cold desserts (kept at ≤ 5°C).',
          'Step 3 (Hot Station): Portion soup, rice/chapati, dal/vegetables, and main protein using standardized scoops (kept hot at ≥ 63°C) and cover immediately with an insulated dome lid.',
          'Step 4 (Final Check by Supervisor/Dietitian): Before the tray enters the cart, the checker compares every item on the tray against the printed Diet Ticket.'
        ],
        keyTakeaway:
          'Every single patient tray must be checked against its printed Diet Ticket by a Supervisor or Dietitian before leaving the kitchen.'
      },
      {
        slideNumber: 9,
        title: 'Safe Delivery to Wards & The "Two-Identifier" Rule',
        subtitle: 'Delivering the Right Tray to the Right Patient at the Right Temperature',
        bulletPoints: [
          'Enclosed Meal Trolleys: Transport patient trays in clean, covered, heated/insulated meal carts so hot food stays ≥ 63°C and cold food stays ≤ 5°C.',
          'Timely Service: Deliver trays from kitchen to patient bedside within 20–30 minutes of plating.',
          'The JCI Two-Patient-Identifier Rule: Never deliver a tray just by looking at the Room or Bed Number (patients often get shifted to another bed!).',
          'Always verify TWO identifiers before placing the tray: (1) Patient Full Name, and (2) Medical Record Number (MRN) or Date of Birth—matching the Tray Ticket with the Patient’s Wristband.'
        ],
        keyTakeaway:
          'Always match Patient Full Name + MRN/Date of Birth on the Tray Card with the patient’s wristband—never rely on bed number alone.'
      },
      {
        slideNumber: 10,
        title: 'Infectious Isolation Trays & Patient Feedback',
        subtitle: 'Handling Isolation Wards & Improving Patient Satisfaction',
        bulletPoints: [
          'Isolation Ward Patients (e.g., TB, COVID-19, Contact Isolation): Serve meals in single-use disposable food-grade containers so contaminated trays do not return to the main kitchen, or sanitize reusable ware at ≥ 82°C.',
          'Protected Mealtimes: Coordinate with nursing so non-urgent rounds do not interrupt patients while they are eating hot food.',
          'Checking Plate Waste: Notice if a patient leaves more than 50% of their meal uneaten and inform the Dietitian so a preferred or fortified alternative can be offered.',
          'Daily Patient Rounds: Visit a sample of patients daily to ask about food taste, temperature, cleanliness, and staff courtesy.'
        ],
        keyTakeaway:
          'Checking patient satisfaction and plate waste daily helps patients recover faster and improves your department’s rating.'
      }
    ]
  },

  // =========================================================================
  // MODULE 3: PURCHASING, RECEIVING, STORE MANAGEMENT & COST CONTROL
  // =========================================================================
  {
    id: 'mfd-mod-3',
    moduleNumber: 3,
    title: 'Food Purchasing, Receiving, Store Management & Cost Control',
    estimatedMinutes: 45,
    overview:
      'Simple presentation on how to buy food from approved vendors, check deliveries at the receiving dock, organize dry stores, chillers, and freezers using FIFO/FEFO, use standardized recipes, and control food cost and wastage.',
    internationalClauses: [
      'Receiving & Cold-Chain Inspection Standards',
      'FIFO / FEFO Store Management & Kitchen Cost Control'
    ],
    keyPrinciples: [
      'Purchase food only from approved, licensed suppliers and inspect every delivery at the receiving dock for temperature, expiry date, packaging integrity, and weight.',
      'Follow FEFO (First Expired, First Out) and FIFO (First In, First Out) in all stores, keeping items at least 15 cm (6 inches) off the floor.',
      'Inside chillers, store Ready-to-Eat/Cooked foods on the TOP shelves and Raw Meat/Poultry on the BOTTOM shelves to prevent drip contamination.',
      'Control kitchen food cost through Standardized Recipes, fixed portion scoops, butcher yield checks, and daily food waste tracking.'
    ],
    criticalControlParameters: [
      {
        parameter: 'Receiving Temperatures for Chilled & Frozen Foods',
        standardLimit: 'Chilled Meat/Dairy ≤ +4°C (+5°C max); Fresh Fish ≤ +2°C on ice; Frozen Food ≤ -18°C',
        correctiveProtocol: 'Reject any warm, thawed, dented/swollen, expired, or pest-damaged delivery at the gate.'
      },
      {
        parameter: 'Chiller Vertical Shelf Storage Hierarchy',
        standardLimit: 'Top: Ready-to-Eat/Cooked → Middle: Whole Fish/Meat → Bottom: Raw Poultry',
        correctiveProtocol: 'Immediately move any raw meat found above cooked or ready-to-eat items to the bottom shelf.'
      }
    ],
    practicalChecklist: [
      'Check and record delivery truck temperature, product temperature, and expiry dates for every incoming shipment.',
      'Ensure all opened or prepared items in the chiller have a Date Label (Item Name, Date Opened/Prepared, Use-By Date).',
      'Compare daily meal count against store requisitions and monitor plate/kitchen wastage.'
    ],
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Smart Food Purchasing & Approved Suppliers',
        subtitle: 'Buying Safe, High-Quality Ingredients at the Right Price',
        bulletPoints: [
          'Approved Supplier List: Only buy meat, poultry, dairy, cooking oil, and dry goods from licensed, food-authority-approved suppliers.',
          'Purchase Specifications: Clearly write down quality standards for every item (e.g., Grade-A eggs with clean shells, boneless chicken breast chilled at ≤ 4°C, Halal certification).',
          'Order Based on Menu & Census: Calculate order quantities based on the upcoming menu cycle, expected patient/staff meal count, and current store balance.',
          'Avoid Over-Ordering Perishables: Order fresh vegetables, milk, bread, and meat frequently so ingredients stay fresh and spoilage is minimized.'
        ],
        keyTakeaway:
          'Good food quality starts at purchasing—never buy unbranded, loose, or unlicensed food ingredients.'
      },
      {
        slideNumber: 2,
        title: 'Receiving Dock Inspection (Checking Deliveries)',
        subtitle: 'What to Check Before Signing Any Supplier Invoice',
        bulletPoints: [
          '1. Delivery Vehicle Check: Is the truck clean, free from pests/chemicals, and is the refrigeration unit working?',
          '2. Temperature Check (Using a Sanitized Probe):',
          '   • Chilled Meat, Poultry & Dairy: Must be ≤ +4°C (max +5°C).',
          '   • Fresh Fish: Must be ≤ +2°C packed in clean crushed ice.',
          '   • Frozen Foods: Must be rock-solid at ≤ -18°C with no signs of thawing or ice crystals.',
          '3. Packaging & Expiry Check: Check Manufacture Date, Expiry Date, Halal logo, and weight.',
          '4. When to REJECT: Reject any warm chilled food, thawed frozen food, swollen/dented cans, broken seals, or expired items on the spot.'
        ],
        keyTakeaway:
          'If a delivery fails temperature or quality checks at the receiving gate, reject it immediately and log a Supplier Rejection Note.'
      },
      {
        slideNumber: 3,
        title: 'Dry Store Management & The 15 cm Floor Rule',
        subtitle: 'Keeping Grains, Pulses, Spices, Oils & Cans Safe',
        bulletPoints: [
          'Temperature & Humidity: Keep the Dry Store cool, dry, and well-ventilated (+15°C to +25°C, relative humidity < 60%).',
          'Off-the-Floor Rule: Store all food sacks, cartons, and cans on washable racks or plastic pallets at least 15 cm (6 inches) off the floor and 5 cm away from walls.',
          'No Cardboard or Gunny Sacks in Kitchen: Transfer opened flour, rice, sugar, and pulses into clean, food-grade plastic or stainless-steel bins with tight lids and clear labels.',
          'Keep Chemicals Separate: Cleaning chemicals, phenyl, bleach, and insecticides must NEVER be kept in the food store—lock them in a separate Chemical Store.'
        ],
        keyTakeaway:
          'Keep all food at least 6 inches (15 cm) off the floor, in lidded labeled bins, and keep cleaning chemicals in a separate locked cupboard.'
      },
      {
        slideNumber: 4,
        title: 'FIFO & FEFO Stock Rotation Rules',
        subtitle: 'Preventing Expired Stock & Financial Loss',
        bulletPoints: [
          'FEFO (First Expired, First Out): Items with the earliest Expiry Date are placed in the front of the shelf so they are used first.',
          'FIFO (First In, First Out): For fresh produce without printed expiry dates, the older delivery goes in front and the new delivery goes behind it.',
          'Date Labeling of Opened Items: Once a tin, sauce bottle, or bulk pack is opened or transferred to a container, stick a label showing: Item Name, Date Opened, and Use-By Date.',
          'Monthly Expiry Check: Inspect the store every week and remove any item approaching expiry before it goes bad.'
        ],
        keyTakeaway:
          'Place new stock BEHIND old stock so the earliest-expiring items (FEFO) are always used first.'
      },
      {
        slideNumber: 5,
        title: 'Chiller & Freezer Organization (Top-to-Bottom Rule)',
        subtitle: 'Where to Place Food Inside Refrigerators',
        bulletPoints: [
          'Chiller Temperature: Maintain between +1°C and +4°C. Freezer Temperature: Maintain at ≤ -18°C.',
          'Ideally, use separate refrigerators for Raw Meat and Cooked/Ready-to-Eat foods.',
          'If sharing a single walk-in chiller, strictly follow the Top-to-Bottom Shelf Rule so raw juices never drip onto cooked food:',
          '  • TOP Shelf: Ready-to-Eat (RTE) Foods, Cooked Meals, Dairy, Salads & Desserts.',
          '  • MIDDLE Shelf: Whole Raw Fish & Whole Cuts of Beef/Mutton.',
          '  • BOTTOM Shelf: Raw Minced Meat & Raw Poultry (Chicken/Turkey) in deep trays.',
          'Cover & Label Everything: Every tray in the chiller must be covered with food-grade lids/wrap and date-labeled (max 72 hours for cooked chilled items).'
        ],
        keyTakeaway:
          'In any refrigerator: Cooked & Ready-to-Eat foods go on the TOP shelf; Raw Chicken & Meat always go on the BOTTOM shelf.'
      },
      {
        slideNumber: 6,
        title: 'Standardized Recipes & Portion Control',
        subtitle: 'Ensuring Consistent Taste, Nutrition & Cost Every Day',
        bulletPoints: [
          'What is a Standardized Recipe? A tested written recipe card that specifies exact ingredient weights, cooking method, cooking time/temperature, total yield, and exact portion size.',
          'Why Standardized Recipes Matter in Dietary Operations:',
          '  1. Every patient gets the exact calories, protein, and low-salt/diabetic profile prescribed by the Dietitian.',
          '  2. The dish tastes the same regardless of which cook is on duty.',
          '  3. You know the exact ingredient cost per plate.',
          'Portion Control Tools: Use standard ladles, weighing scales, and numbered portion scoops on the tray line (e.g., #8 scoop = ½ cup / 120 mL; #16 scoop = ¼ cup / 60 mL).'
        ],
        keyTakeaway:
          'Standardized recipes + portion scoops guarantee consistent nutrition for patients and predictable food cost for management.'
      },
      {
        slideNumber: 7,
        title: 'Understanding Butcher Yield (AP vs. EP Weight)',
        subtitle: 'How Peeling, Trimming & Boning Affect Your Ordering',
        bulletPoints: [
          'AP (As-Purchased Weight): The weight of raw food as you buy it from the supplier (with peel, bone, skin, or fat).',
          'EP (Edible Portion Weight): The actual usable weight left after peeling, trimming, or deboning.',
          'Simple Example: You buy 10 kg of raw potatoes (AP). After peeling, 2 kg of peel is removed, leaving 8 kg of peeled potatoes (EP). Your Yield is 80%.',
          'Manager’s Ordering Rule: If your recipe needs 8 kg of peeled potatoes and the yield is 80%, you must requisition 10 kg (8 ÷ 0.80 = 10 kg) from the store.'
        ],
        keyTakeaway:
          'Always check trimming and peeling loss in the prep room so cooks do not throw away usable meat or vegetables.'
      },
      {
        slideNumber: 8,
        title: 'Daily Store Issue & Kitchen Production Planning',
        subtitle: 'Matching Store Requisitions to Actual Meal Counts',
        bulletPoints: [
          'Production Sheet: Every afternoon, prepare the next day’s Kitchen Production Sheet based on expected patient census and cafeteria sales.',
          'Store Requisition Slip: Ingredients should only leave the Dry Store or Freezer against a signed Store Requisition Slip approved by the Chef/Manager.',
          'Preventing Over-Production: Cooking 250 meals when only 180 patients are admitted creates massive food waste and budget loss.',
          'Batch Cooking for Cafeteria: For staff/visitor cafeterias, cook fresh batches in stages during peak hours rather than cooking everything at once.'
        ],
        keyTakeaway:
          'No ingredient should leave the store without a signed requisition linked to the daily production count.'
      },
      {
        slideNumber: 9,
        title: 'Simple Food Cost & Cost Per Patient Day (CPPD)',
        subtitle: 'How a Manager Tracks the Departmental Budget',
        bulletPoints: [
          'Total Food Cost Used = (Opening Store Stock + Monthly Purchases) − Closing Store Stock.',
          'Food Cost Per Patient Day (CPPD): Divide Total Patient Food Cost by the Total Inpatient Bed-Days for the month.',
          '  • Example: If monthly patient food cost is Rs. 1,200,000 for 4,000 patient days, your CPPD is Rs. 300 per patient per day.',
          'Food Cost % (For Paid Cafeteria): (Food Cost ÷ Cafeteria Sales) × 100. Typical target in institutional/commercial catering is 30% to 38%.'
        ],
        keyTakeaway:
          'Track your Cost Per Patient Day (CPPD) and Cafeteria Food Cost % every month to keep your department within budget.'
      },
      {
        slideNumber: 10,
        title: 'Controlling Kitchen Waste & Pilferage',
        subtitle: 'Where Money Leaks in a Kitchen & How to Stop It',
        bulletPoints: [
          '5 Main Causes of High Food Cost:',
          '  1. Short-weight or poor quality accepted at the receiving gate.',
          '  2. Spoilage in chillers/dry store due to ignoring FIFO/FEFO.',
          '  3. Over-trimming meat/vegetables or burning batches during cooking.',
          '  4. Over-portioning on the tray line (not using standard scoops/ladles).',
          '  5. Unauthorized staff eating or pilferage (theft).',
          'Solution: Keep stores locked, weigh all deliveries, enforce portion scoops, and maintain a Daily Food Wastage Log.'
        ],
        keyTakeaway:
          'What gets measured gets controlled—weigh and record kitchen waste daily to cut food costs by 10% to 15%.'
      }
    ]
  },

  // =========================================================================
  // MODULE 4: KITCHEN HYGIENE, FOOD SAFETY (HACCP), CLEANING & DISHWASHING
  // =========================================================================
  {
    id: 'mfd-mod-4',
    moduleNumber: 4,
    title: 'Kitchen Hygiene, Safe Temperatures (HACCP), Cleaning & Dishwashing',
    estimatedMinutes: 45,
    overview:
      'Simple presentation on the Temperature Danger Zone, safe thawing, cooking, cooling, reheating, and holding temperatures, color-coded chopping boards, 6-step kitchen cleaning, dishwashing standards, and pest control.',
    internationalClauses: [
      'HACCP Safe Time-Temperature Rules for Catering',
      'Color-Coded Hygiene, 6-Step Sanitization & Pest Control Standards'
    ],
    keyPrinciples: [
      'Keep food out of the Temperature Danger Zone (+5°C to +60°C): cold food at ≤ +5°C, hot food at ≥ +63°C, core cooking at ≥ +75°C, and reheating at ≥ +75°C.',
      'Prevent cross-contamination by using international color-coded chopping boards and knives (Red = Raw Meat, Yellow = Cooked Meat, Blue = Raw Fish, Green = Washed Salad/Fruit, Brown = Root Veg, White = Bakery/Dairy, Purple = Allergen-Free).',
      'Clean and sanitize food-contact surfaces using the 6-Step Method: Scrape → Pre-Rinse → Detergent Wash → Water Rinse → Sanitize → Air Dry.',
      'Sanitize dishes thermally in a dishwasher with a final rinse of ≥ +82°C or chemically in a 3-compartment sink (50–100 ppm chlorine or 200–400 ppm quat).'
    ],
    criticalControlParameters: [
      {
        parameter: 'Core Cooking, Hot Holding & Rapid Cooling Temperatures',
        standardLimit: 'Cook ≥ +75°C; Hot Hold ≥ +63°C; Cold Hold ≤ +5°C; Cool from +60°C to +20°C in ≤ 2h and to ≤ +4°C in ≤ 4h',
        correctiveProtocol: 'Continue cooking if < 75°C; reheat once to ≥ 75°C or discard if held in Danger Zone > 2 hours.'
      },
      {
        parameter: 'Dishwasher Final Sanitizing Rinse Temperature',
        standardLimit: 'Final Rinse Manifold ≥ +82°C (achieving ≥ +71°C on plate surface)',
        correctiveProtocol: 'Check daily with thermal test strips; if below 82°C, use 3-sink chemical sanitization until repaired.'
      }
    ],
    practicalChecklist: [
      'Probe and record core temperatures of all cooked meats, soups, and sauces before service.',
      'Check chiller and freezer temperature logs twice daily (Morning & Evening).',
      'Verify dishwasher final rinse temperature (≥ 82°C) or 3-sink sanitizer concentration with test strips.'
    ],
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Understanding Food Safety Hazards (Simple HACCP)',
        subtitle: 'The 4 Types of Hazards You Must Prevent in the Kitchen',
        bulletPoints: [
          '1. Biological Hazards (Germs): Bacteria (Salmonella, E. coli, Listeria) and viruses (Norovirus) from raw meat, unwashed hands, dirty water, or temperature abuse.',
          '2. Chemical Hazards: Dishwashing soap, bleach, or pest spray accidentally getting into food.',
          '3. Physical Hazards (Foreign Objects): Hair, staples, glass shards, metal wire from scrubbers, stones in rice/lentils, or bone splinters.',
          '4. Allergen Hazards: Traces of peanuts, milk, egg, or wheat getting into an allergic patient’s meal.',
          'Strictly ban glass bottles, wooden tables, and metal wire-bristle scrubbers inside the cooking area.'
        ],
        keyTakeaway:
          'HACCP simply means identifying where Biological, Chemical, Physical, or Allergen hazards can happen and controlling them before food is served.'
      },
      {
        slideNumber: 2,
        title: 'The Temperature Danger Zone (+5°C to +60°C)',
        subtitle: 'The Golden Rule of Kitchen Temperature Control',
        bulletPoints: [
          'Bacteria multiply fastest between +5°C and +60°C—this is called the Temperature Danger Zone (TDZ).',
          'At room temperature (+30°C to +37°C), bacteria double every 20 minutes!',
          'To keep food safe, follow the Golden Rule: "Keep Cold Food COLD (≤ +5°C) and Keep Hot Food HOT (≥ +63°C)."',
          'The 2-Hour / 4-Hour Rule: Never leave cooked meat, rice, dairy, or cut salads sitting at room temperature for more than 2 hours during prep or service.'
        ],
        keyTakeaway:
          'Never leave high-risk foods sitting between +5°C and +60°C—keep cold items at ≤ +5°C and hot items at ≥ +63°C.'
      },
      {
        slideNumber: 3,
        title: 'Safe Thawing (Defrosting) of Frozen Meat & Poultry',
        subtitle: '4 Safe Ways to Defrost Food Without Growing Bacteria',
        bulletPoints: [
          'NEVER thaw frozen chicken, meat, or fish on a kitchen counter at room temperature or in warm water!',
          'Approved Safe Thawing Methods:',
          '  1. In the Thawing Chiller (Best Method): Place frozen meat in a covered drip tray on the bottom shelf of a chiller at ≤ +4°C for 24 hours.',
          '  2. Under Cold Running Potable Water: Submerged in sealed packaging under running water at ≤ +21°C for no more than 2 hours.',
          '  3. In a Microwave: Only if the food will be cooked immediately right after thawing.',
          '  4. Cook from Frozen: For small items like frozen vegetables or burger patties.',
          'Once thawed, never refreeze raw meat—cook it within 24 hours.'
        ],
        keyTakeaway:
          'Plan ahead and thaw frozen meat on the bottom shelf of the chiller (≤ +4°C)—never at room temperature.'
      },
      {
        slideNumber: 4,
        title: 'Safe Cooking & Hot-Holding Temperatures',
        subtitle: 'Exact Thermometer Numbers Every Cook Must Know',
        bulletPoints: [
          'Always check the thickest center part of meat/poultry using a clean, alcohol-wiped digital probe thermometer:',
          '• Poultry (Chicken/Turkey), Minced Meat & Stuffed Dishes: Cook to ≥ +75°C core temperature.',
          '• Whole Cuts of Beef, Mutton, Lamb & Fish: Cook to ≥ +70°C (or ≥ +63°C for 2 mins).',
          '• Hot Holding (Bain-Marie & Patient Meal Carts): Keep all cooked hot foods at ≥ +63°C until served.',
          '• Cold Holding (Salads, Yogurt, Cut Fruit, Sandwiches): Keep chilled at ≤ +5°C.'
        ],
        keyTakeaway:
          'Cook to ≥ +75°C, Hot-Hold at ≥ +63°C, and Cold-Hold at ≤ +5°C—and write the readings on the daily temperature log.'
      },
      {
        slideNumber: 5,
        title: 'Safe Cooling & Reheating of Cooked Food',
        subtitle: 'Preventing Food Poisoning from Slow-Cooled Rice, Dal & Gravies',
        bulletPoints: [
          'Never put a huge hot pot of curry, soup, or rice straight into the refrigerator (it warms up the fridge and cools too slowly in the center).',
          'How to Cool Hot Food Safely:',
          '  • Divide large batches into shallow stainless-steel pans (less than 5–10 cm deep) or use a Blast Chiller / ice-water bath.',
          '  • Cool from +60°C down to +20°C within 2 hours, and from +20°C down to ≤ +4°C within the next 4 hours (or ≤ 90 minutes in a Blast Chiller).',
          'How to Reheat Safely:',
          '  • Reheat chilled food rapidly to ≥ +75°C core temperature and reheat ONLY ONCE. Discard any leftover reheated food.'
        ],
        keyTakeaway:
          'Cool cooked food quickly in shallow pans (to ≤ +4°C) and reheat only once to ≥ +75°C.'
      },
      {
        slideNumber: 6,
        title: 'Color-Coded Chopping Boards & Knives',
        subtitle: 'Stopping Cross-Contamination Between Raw and Ready-to-Eat Foods',
        bulletPoints: [
          'Use separate color-coded chopping boards, knives, and tongs for each food group:',
          '• RED: Raw Meat & Poultry',
          '• BLUE: Raw Fish & Seafood',
          '• YELLOW: Cooked Meat & Poultry',
          '• GREEN: Washed Salads & Fresh Fruits',
          '• BROWN: Unwashed Root Vegetables (Potatoes, Carrots, Onions)',
          '• WHITE: Bakery, Bread & Dairy (Cheese/Butter)',
          '• PURPLE: Allergen-Free & Special Diet Meals'
        ],
        keyTakeaway:
          'Post a Color-Coding Chart on the kitchen wall and replace any deeply scratched or cracked chopping boards immediately.'
      },
      {
        slideNumber: 7,
        title: 'Washing Fresh Vegetables, Salads & Fruits',
        subtitle: 'How to Sanitize Raw Produce That Will Not Be Cooked',
        bulletPoints: [
          'Raw salads (lettuce, cucumber, tomatoes) and fresh fruits are eaten without cooking, so washing in plain water alone is not enough to kill surface germs.',
          '3-Step Produce Washing Procedure:',
          '  1. Remove outer damaged leaves and wash thoroughly in running potable water to remove mud, soil, and insects.',
          '  2. Dip in a food-grade Vegetable Sanitizing Solution (50 to 100 ppm Chlorine / Sodium Dichloroisocyanurate tablet) for 5 minutes (check with chlorine test strips).',
          '  3. Rinse thoroughly with clean potable drinking water, drain in a sanitized colander, and store at ≤ +4°C.'
        ],
        keyTakeaway:
          'Always wash raw salad vegetables in a dedicated vegetable sink using 50–100 ppm food-grade chlorine solution followed by a clean water rinse.'
      },
      {
        slideNumber: 8,
        title: 'The 6-Step Kitchen Cleaning & Sanitization Method',
        subtitle: 'Cleaning Removes Dirt; Sanitization Kills Germs',
        bulletPoints: [
          'Remember: Chemical sanitizer does NOT work on a greasy or dirty table! You must clean with soap first, then sanitize.',
          'The 6 Simple Steps for Tables, Slicers & Utensils:',
          '  1. Pre-Scrape: Remove leftover food scraps into the bin.',
          '  2. Pre-Rinse: Rinse with warm water.',
          '  3. Detergent Wash: Scrub with warm water (+45°C–+55°C) and food-safe detergent to remove grease.',
          '  4. Rinse: Rinse off all soap with clean water.',
          '  5. Sanitize: Apply approved food-contact sanitizer (e.g., 200 ppm Quat or 100 ppm Chlorine) for the required contact time.',
          '  6. Air Dry: Let surfaces and utensils air-dry naturally (never wipe with dirty cloth dusters!).'
        ],
        keyTakeaway:
          'Ban dirty cloth dusters in the kitchen—use 6-step cleaning + sanitization and allow utensils to air-dry.'
      },
      {
        slideNumber: 9,
        title: 'Dishwashing Machine & 3-Sink Pot Washing Standards',
        subtitle: 'Making Sure Patient Trays, Plates & Pots Are 100% Germ-Free',
        bulletPoints: [
          'Automatic High-Temperature Dishwasher:',
          '  • Wash Tank Temperature: +55°C to +65°C with detergent.',
          '  • Final Sanitizing Rinse Temperature: ≥ +82°C (achieving ≥ +71°C on the plate surface to kill bacteria and viruses).',
          '  • Verify daily by placing a Thermal Test Strip on a tray passing through the machine.',
          'Manual 3-Compartment Sink (For Pots, Pans & Utensils):',
          '  • Sink 1: Hot Detergent Wash (+45°C to +50°C).',
          '  • Sink 2: Clean Warm Water Rinse.',
          '  • Sink 3: Chemical Sanitizer Soak (50–100 ppm Chlorine or 200–400 ppm Quat for 30–60 seconds) or Hot Water ≥ +77°C, then Air-Dry on racks.'
        ],
        keyTakeaway:
          'Dishwasher final rinse must reach ≥ +82°C, and 3-compartment sinks must follow Wash → Rinse → Sanitize → Air-Dry.'
      },
      {
        slideNumber: 10,
        title: 'Pest Control & Kitchen Waste Management',
        subtitle: 'Keeping Cockroaches, Flies & Rodents Out of the Kitchen',
        bulletPoints: [
          'Pest Prevention Rules:',
          '  • Keep all external doors closed with rubber bottom seals (zero gaps > 3 mm) and air curtains, and fit fine mesh screens on windows.',
          '  • Install UV Electric Fly Killers (with sticky glue boards, NOT zappers that scatter insect parts) away from open food tables.',
          '  • Never use toxic loose rat poison inside food prep rooms—use a licensed pest control company with mapped traps.',
          'Kitchen Garbage Rules:',
          '  • Use foot-operated (pedal) bins lined with heavy plastic bags so staff never touch bin lids by hand.',
          '  • Empty kitchen bins whenever 75% full and at the end of every shift into a closed, washable external garbage room.'
        ],
        keyTakeaway:
          'Use foot-pedal covered bins, seal all wall/door gaps, and empty kitchen waste after every meal service.'
      }
    ]
  },

  // =========================================================================
  // MODULE 5: QUALITY CHECKS, 72-HOUR FOOD SAMPLES, EMERGENCIES & AUDITS
  // =========================================================================
  {
    id: 'mfd-mod-5',
    moduleNumber: 5,
    title: 'Quality Checks, 72-Hour Food Samples, Emergency Planning & Audits',
    estimatedMinutes: 45,
    overview:
      'Simple presentation on daily pre-service food tasting, keeping a 72-hour reference food sample bank, what to do if a food complaint or outbreak happens, maintaining a 72-hour emergency food and water backup, and passing hospital/food authority inspections.',
    internationalClauses: [
      '72-Hour Reference Food Sample Bank & Outbreak Investigation Protocol',
      'JCI / Hospital 72-Hour Emergency Disaster Reserve & Inspection Readiness'
    ],
    keyPrinciples: [
      'Before every meal service, the Chef and Dietary Supervisor must check food appearance, taste, texture, and temperature, and collect a 150 g reference sample of every cooked dish.',
      'Reference food samples must be labeled and locked in a dedicated chiller (+1°C to +4°C) for at least 72 hours (3 days) as proof of food safety.',
      'Every hospital dietary department must keep a 72-hour (3-day) Emergency Disaster Stock of ready-to-eat/dry food, tube feeds, disposable plates, and drinking water (≥ 3 Liters per person per day).',
      'Maintain clean, honest, real-time daily logs (Receiving, Chiller Temps, Cooking/Tray Temps, Cleaning, and Staff Health) to pass Food Authority, ISO 22000, and JCI inspections.'
    ],
    criticalControlParameters: [
      {
        parameter: '72-Hour Reference Food Sample Retention',
        standardLimit: '150 g sample of every served dish collected in sterile container, labeled, and kept at +1°C to +4°C for 72 hours',
        correctiveProtocol: 'Audit the sample chiller every evening to confirm Breakfast, Lunch, and Dinner samples are stored.'
      },
      {
        parameter: '72-Hour Hospital Emergency Food & Water Reserve',
        standardLimit: 'Minimum 3 full days (72 hours) of shelf-stable food, enteral feeds, disposables, and ≥ 3 L/person/day water',
        correctiveProtocol: 'Check emergency stock monthly and rotate items into daily kitchen use before they expire (FEFO).'
      }
    ],
    practicalChecklist: [
      'Complete the Pre-Service Food Tasting, Temperature & Tray Accuracy Log before Breakfast, Lunch, and Dinner.',
      'Verify that 150 g labeled samples of all dishes from the last 72 hours are locked in the Reference Sample Chiller.',
      'Conduct a weekly Manager Self-Inspection Walkthrough and check the 72-hour emergency food and water reserve monthly.'
    ],
    presentationSlides: [
      {
        slideNumber: 1,
        title: 'Pre-Service Food Tasting & Sensory Check',
        subtitle: 'Checking Every Dish 20 Minutes Before Meal Service',
        bulletPoints: [
          'Never allow a meal to go to patients or the cafeteria without tasting and inspecting it first!',
          '20 minutes before Breakfast, Lunch, and Dinner, the Chef and Dietary Supervisor conduct a Pre-Service Check:',
          '  1. Appearance & Color: Does the dish look fresh, appetizing, and properly garnished?',
          '  2. Taste & Seasoning: Is the regular dish well-seasoned, and is the Low-Salt/Diabetic dish truly salt/sugar-controlled?',
          '  3. Texture Check: Is the meat tender, and do Pureed/Soft diets pass the spoon/fork texture check?',
          '  4. Temperature Check: Are hot items ≥ +63°C and cold items ≤ +5°C?',
          'Always use a clean tasting spoon (never dip the same spoon twice!).'
        ],
        keyTakeaway:
          'A 5-minute pre-service tasting and temperature check catches under-seasoned, over-salted, or lukewarm food before it ever reaches a patient.'
      },
      {
        slideNumber: 2,
        title: 'The 72-Hour Reference Food Sample Bank',
        subtitle: 'Your Legal & Medical Proof of Food Safety',
        bulletPoints: [
          'What is a Reference Food Sample Bank? Keeping a small sample of every meal served so it can be lab-tested if anyone claims food poisoning.',
          'How to Collect Samples Properly:',
          '  • Collect at least 150 g to 200 g of every dish (soup, main course, rice, vegetable, dessert) at the time of service using a sanitized spoon.',
          '  • Place in a clean, sterile, tightly sealed container or zip-lock sample bag.',
          '  • Label clearly: Dish Name, Date, Meal (Breakfast/Lunch/Dinner), and Supervisor Initials.',
          '  • Store in a dedicated, locked chiller at +1°C to +4°C (do NOT freeze) for 72 hours (3 full days), then discard after 72 hours.'
        ],
        keyTakeaway:
          'Always keep ≥ 150 g of every served meal at +1°C to +4°C for 72 hours—it protects your department during any complaint or investigation.'
      },
      {
        slideNumber: 3,
        title: 'What to Do If a Food Complaint or Illness Occurs',
        subtitle: 'Step-by-Step Manager Action Plan for Suspected Food Poisoning',
        bulletPoints: [
          'If 2 or more patients or staff report vomiting or diarrhea after a meal, take immediate calm action:',
          'Step 1 (Stop & Quarantine): Immediately stop serving the suspected food item and put all remaining batches on "Quarantine Hold" in the chiller.',
          'Step 2 (Lock the Sample Bank): Secure the 72-Hour Reference Food Samples from the past 3 days so they can be sent to an accredited microbiology lab.',
          'Step 3 (Notify Management): Inform the Hospital Medical Director / Infection Control Team immediately.',
          'Step 4 (Check Kitchen Logs & Staff): Review cooking/cooling temperature logs for that dish and check if any kitchen staff member had stomach illness or skin cuts.'
        ],
        keyTakeaway:
          'In any suspected food incident: Stop serving the item, lock the 72-hour food samples, inform Infection Control, and check temperature/staff logs.'
      },
      {
        slideNumber: 4,
        title: 'Handling Foreign Object Complaints (Hair, Stone, Plastic)',
        subtitle: 'How to Investigate & Prevent Physical Contamination',
        bulletPoints: [
          'If a patient or diner finds a hair, insect, stone, or piece of plastic in their food:',
          '1. Apologize immediately, remove the tray politely, and provide a fresh replacement meal at once.',
          '2. Save the foreign object in a small labeled bag so you can identify where it came from.',
          '3. Find the Root Cause (5-Why Check):',
          '   • Hair in food → Enforce proper hairnet & beard cover wearing.',
          '   • Stone in dal/rice → Improve dry cleaning/picking and washing on a stainless-steel sorting table under bright light.',
          '   • Plastic shred → Ban tearing packaging with teeth or knives; use clean kitchen scissors and throw away plastic corners immediately.'
        ],
        keyTakeaway:
          'Never argue with a patient or customer over a food complaint—replace the meal immediately, preserve the evidence, and fix the root cause.'
      },
      {
        slideNumber: 5,
        title: '4-Hour Traceability & Recall Readiness',
        subtitle: 'Tracing Any Ingredient Back to Its Supplier',
        bulletPoints: [
          'What is Traceability? Being able to trace which supplier batch of chicken, milk, or oil was used in a specific day’s meal.',
          'How to Maintain Simple Traceability:',
          '  • Record Batch/Lot Numbers and Expiry Dates on the Daily Receiving Log.',
          '  • Keep supplier delivery invoices and Certificates of Analysis (COA) organized by date.',
          '  • Record which batch was issued from the store on the Daily Kitchen Production Sheet.',
          'If a supplier or Food Authority recalls a contaminated batch of milk or spice, you should be able to locate and isolate every pack in your store within 2 to 4 hours.'
        ],
        keyTakeaway:
          'Recording batch numbers at receiving and store issue allows you to isolate any recalled ingredient in under 4 hours.'
      },
      {
        slideNumber: 6,
        title: '72-Hour Hospital Emergency Disaster Food & Water Plan',
        subtitle: 'Being Ready for Floods, Strikes, Road Blocks & Disasters',
        bulletPoints: [
          'Hospitals cannot stop feeding patients during natural disasters, city lockdowns, or supply breakdowns.',
          'Every Hospital Dietary Department must maintain an on-site 72-Hour (3-Day) Emergency Reserve:',
          '  • Shelf-Stable Food: Ready-to-eat meals, UHT milk, biscuits, oats, canned beans/tuna, porridge, and diabetic/low-salt options for 100% of patients and on-duty staff.',
          '  • Tube Feeds: 3-day stock of Ready-to-Hang enteral nutrition formulas.',
          '  • Potable Drinking Water: At least 3 Liters per person per day for 3 days.',
          '  • Disposable Tableware: 3-day stock of disposable plates, cups, and spoons in case dishwashing water is cut off.'
        ],
        keyTakeaway:
          'Keep a 72-hour emergency stock of dry/shelf-stable food, tube feeds, disposable plates, and drinking water—and rotate it before expiry.'
      },
      {
        slideNumber: 7,
        title: 'Handling Power Outages & Water Supply Failures',
        subtitle: 'Immediate Kitchen Contingency Actions',
        bulletPoints: [
          'What to Do During a Power Outage (If Generator Fails):',
          '  • Keep all Chiller and Freezer doors CLOSED! A closed walk-in freezer keeps food frozen for 24–48 hours; a closed chiller stays cold for 4 hours.',
          '  • Check food core temperatures when power returns: if chilled food stayed ≤ +5°C (or ≤ +8°C for < 2 hours), it is safe; if above +8°C for > 2 hours, discard it.',
          'What to Do During a Water Supply Contamination / Boil-Water Alert:',
          '  • Turn off plumbed ice machines and water dispensers immediately and throw away existing ice.',
          '  • Use bottled water or water boiled at a rolling boil for ≥ 1 minute for all cooking, drinking, and beverage prep, and switch to disposable plates.'
        ],
        keyTakeaway:
          'During power cuts, keep fridge/freezer doors shut; during water contamination alerts, shut off ice machines and use bottled/boiled water + disposable plates.'
      },
      {
        slideNumber: 8,
        title: 'Key Performance Indicators (KPIs) for a Dietary Manager',
        subtitle: 'How Hospital Management Measures Your Department’s Success',
        bulletPoints: [
          'Track these 6 simple Monthly KPIs on a 1-page dashboard:',
          '1. Patient Tray Accuracy %: Target ≥ 99% (Zero wrong allergy or NPO trays).',
          '2. On-Time Ward Delivery %: Target ≥ 98% of wards served within the scheduled 30-minute meal window.',
          '3. Bedside Food Temperature Pass %: Hot food ≥ +63°C and Cold food ≤ +5°C.',
          '4. Patient Satisfaction Score: Target ≥ 85%–90% positive feedback on daily ward rounds.',
          '5. Plate Waste %: Target < 15% uneaten food returned on trays.',
          '6. Cost Per Patient Day (CPPD): Staying within the approved monthly food budget.'
        ],
        keyTakeaway:
          'Presenting a simple monthly KPI report (Tray Accuracy, On-Time Delivery, Temps, Satisfaction & Cost) proves your leadership to top management.'
      },
      {
        slideNumber: 9,
        title: 'Essential Daily Records & Logbooks (Audit Readiness)',
        subtitle: 'The 7 Files Every Manager Must Keep Up to Date',
        bulletPoints: [
          'In food safety and hospital inspections, the rule is: "If it is not written down, it did not happen."',
          'Keep these 7 simple daily logs in a clean folder at the Manager’s Desk:',
          '  1. Goods Receiving & Supplier Temperature Log',
          '  2. Chiller, Freezer & Dry Store Twice-Daily Temperature Log',
          '  3. Cooking, Cooling, Reheating & Patient Tray Temperature Log',
          '  4. 72-Hour Reference Food Sample Log',
          '  5. Daily Kitchen Cleaning & Dishwasher Temperature (≥ 82°C) Log',
          '  6. Staff Medical Fitness, Training & Daily Hygiene Check Log',
          '  7. Pest Control Service Reports & Thermometer Calibration Log',
          'Never allow staff to pre-fill ("fake") tomorrow’s temperature readings in advance!'
        ],
        keyTakeaway:
          'Review and sign your kitchen’s daily temperature and cleaning logs at the end of every day—and never tolerate pre-filled logs.'
      },
      {
        slideNumber: 10,
        title: 'Passing Food Authority, ISO 22000 & JCI Inspections',
        subtitle: 'Final Summary Checklist for the Certified Dietary Manager',
        bulletPoints: [
          'When an external inspector (Food Authority, Healthcare Commission, JCI, or ISO 22000 Auditor) visits your kitchen, they check 5 main things:',
          '  1. Staff Hygiene & Medical Certificates: Clean uniforms, hairnets, handwashing, and valid medical cards.',
          '  2. Store & Chiller Discipline: No expired items, FEFO labels on opened containers, raw meat on bottom shelves, and working thermometers.',
          '  3. Kitchen Cleanliness & Pest Control: Clean exhaust hoods, covered pedal bins, color-coded chopping boards, and zero pests.',
          '  4. Patient Safety: Accurate diet tickets, Purple allergy utensils, 4-hour tube feed labels, and Two-Identifier bedside checks.',
          '  5. Honest Documentation: Up-to-date logs and a locked 72-hour food sample chiller.'
        ],
        keyTakeaway:
          'Congratulations on completing all 5 Modules! You are now ready to take the 40-MCQ Final Exam (60% passing score = 24/40 correct).'
      }
    ]
  }
];

export interface ManagerDietaryExamMcq {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  moduleRef: string;
}

export const MANAGER_FOOD_DIETARY_EXAM_MCQS: ManagerDietaryExamMcq[] = [
  // MODULE 1: ROLE OF CERTIFIED DIETARY MANAGER, KITCHEN LAYOUT & STAFF MANAGEMENT (8 MCQs)
  {
    id: 'mfd-q1',
    question: 'What is the main responsibility of a Certified Dietary Manager in a hospital or catering facility?',
    options: [
      'Prescribing surgical operations for patients',
      'Managing kitchen production, patient diet tray accuracy, food safety, budget, and dietary staff',
      'Repairing hospital X-ray machines',
      'Working only at the hospital reception desk'
    ],
    correctIndex: 1,
    explanation:
      'The Certified Dietary Manager oversees all kitchen operations, patient meal accuracy, food safety, store control, budget, and staff scheduling.',
    moduleRef: 'Module 1: Role of Certified Dietary Manager, Kitchen Layout & Staff Management'
  },
  {
    id: 'mfd-q2',
    question: 'Who is responsible for assessing a patient’s clinical nutrition status and prescribing their special therapeutic diet?',
    options: [
      'The Kitchen Dishwasher',
      'The Doctor and Clinical Dietitian / Nutritionist',
      'The Storekeeper',
      'The Delivery Truck Driver'
    ],
    correctIndex: 1,
    explanation:
      'Doctors and Clinical Dietitians prescribe the patient’s diet, while the Certified Dietary Manager ensures the kitchen prepares and delivers it accurately.',
    moduleRef: 'Module 1: Role of Certified Dietary Manager, Kitchen Layout & Staff Management'
  },
  {
    id: 'mfd-q3',
    question: 'What does the "One-Way Flow" rule in a professional kitchen mean?',
    options: [
      'Food moves forward in one direction from Receiving → Store → Prep → Cooking → Serving so raw food and dirty dishes never cross cooked food',
      'All staff must enter and exit through the dishwashing window',
      'Raw meat and cooked salads should be cut on the same table',
      'Delivery trucks should drive inside the cooking area'
    ],
    correctIndex: 0,
    explanation:
      'One-Way Flow prevents cross-contamination by ensuring raw ingredients move smoothly toward cooked dispatch without crossing dirty dish returns.',
    moduleRef: 'Module 1: Role of Certified Dietary Manager, Kitchen Layout & Staff Management'
  },
  {
    id: 'mfd-q4',
    question: 'Why must all light bulbs and tube lights inside a kitchen have shatterproof covers?',
    options: [
      'To make the kitchen darker',
      'To prevent broken glass shards from falling into open food if a bulb breaks',
      'To keep insects warm',
      'To save electricity'
    ],
    correctIndex: 1,
    explanation:
      'Shatterproof light covers protect food from physical glass contamination if a light tube or bulb shatters.',
    moduleRef: 'Module 1: Role of Certified Dietary Manager, Kitchen Layout & Staff Management'
  },
  {
    id: 'mfd-q5',
    question: 'Which of the following is mandatory for every food handler before starting work in the kitchen?',
    options: [
      'Wearing rings, a wristwatch, and strong perfume',
      'Wearing a clean uniform, apron, non-slip closed shoes, hairnet covering all hair, and washing hands with soap',
      'Keeping long painted fingernails',
      'Working in casual street clothes'
    ],
    correctIndex: 1,
    explanation:
      'Clean uniforms, hairnets, short clean nails, zero jewelry, and thorough handwashing are basic personal hygiene rules for all kitchen staff.',
    moduleRef: 'Module 1: Role of Certified Dietary Manager, Kitchen Layout & Staff Management'
  },
  {
    id: 'mfd-q6',
    question: 'If a kitchen cook reports having acute vomiting and diarrhea in the morning, what must the Certified Dietary Manager do?',
    options: [
      'Let the cook prepare cold salads while wearing gloves',
      'Immediately remove the cook from food handling and allow return only after they are 100% symptom-free for at least 48 hours',
      'Tell the cook to drink tea and continue cooking',
      'Assign the cook to serve patient trays on the ward'
    ],
    correctIndex: 1,
    explanation:
      'Staff with vomiting or diarrhea can spread dangerous viruses and bacteria to patients; they must be excluded from food handling until 48 hours symptom-free.',
    moduleRef: 'Module 1: Role of Certified Dietary Manager, Kitchen Layout & Staff Management'
  },
  {
    id: 'mfd-q7',
    question: 'How should a small, clean cut on a food handler’s finger be protected while working?',
    options: [
      'Leave it uncovered so air can dry it',
      'Cover it with a bright Blue Waterproof Detectable Bandage AND wear a disposable glove over it',
      'Wrap it with a piece of newspaper',
      'Apply cooking oil on it'
    ],
    correctIndex: 1,
    explanation:
      'A bright blue waterproof bandage covered by a disposable glove prevents wound bacteria from contaminating food and is easily visible if it ever slips.',
    moduleRef: 'Module 1: Role of Certified Dietary Manager, Kitchen Layout & Staff Management'
  },
  {
    id: 'mfd-q8',
    question: 'Why should the Certified Dietary Manager conduct a 10-minute morning briefing with kitchen staff every day?',
    options: [
      'To check staff uniforms/hygiene, review today’s menu and patient diet counts, and assign clear daily duties',
      'To cancel breakfast service',
      'To lock the kitchen doors',
      'Briefings are only needed once a year'
    ],
    correctIndex: 0,
    explanation:
      'A daily 10-minute morning briefing aligns the team on hygiene, patient diet counts, special requirements, and menu quality.',
    moduleRef: 'Module 1: Role of Certified Dietary Manager, Kitchen Layout & Staff Management'
  },

  // MODULE 2: PATIENT DIETS, MENU PLANNING & TRAY SERVICE MANAGEMENT (8 MCQs)
  {
    id: 'mfd-q9',
    question: 'What does a medical order of "NPO (Nil Per Os)" on a patient’s diet sheet mean?',
    options: [
      'Give the patient extra spicy food',
      'Nothing by Mouth — do NOT send any food, water, or juice tray to the patient',
      'Serve only high-protein meat',
      'Serve double portions of dessert'
    ],
    correctIndex: 1,
    explanation:
      'NPO means "Nothing by Mouth" (usually before surgery or medical procedures). Sending food or liquid to an NPO patient is a serious safety error.',
    moduleRef: 'Module 2: Patient Diets, Menu Planning & Tray Service Management'
  },
  {
    id: 'mfd-q10',
    question: 'Which foods are allowed on a "Clear Liquid Diet" right after surgery?',
    options: [
      'Transparent liquids such as clear broth, strained apple juice without pulp, and plain gelatin/jelly',
      'Whole milk, thick mango shake, and chapati',
      'Fried chicken and French fries',
      'Boiled eggs and cheese sandwiches'
    ],
    correctIndex: 0,
    explanation:
      'A Clear Liquid Diet includes only transparent liquids that leave no digestive residue, such as clear soup broth, pulp-free apple juice, and plain jelly.',
    moduleRef: 'Module 2: Patient Diets, Menu Planning & Tray Service Management'
  },
  {
    id: 'mfd-q11',
    question: 'What is the main rule when preparing a "Diabetic Diet" tray for a hospital patient?',
    options: [
      'Serve sugary soft drinks, honey, and sweet mithai with every meal',
      'Eliminate added sugars/sweets and serve controlled portions of complex carbohydrates (whole-wheat chapati/oats), lean protein, and vegetables on time',
      'Serve only plain salt water',
      'Skip dinner completely'
    ],
    correctIndex: 1,
    explanation:
      'Diabetic diets require zero refined sugars and consistent, measured portions of complex carbohydrates and protein served at regular meal times.',
    moduleRef: 'Module 2: Patient Diets, Menu Planning & Tray Service Management'
  },
  {
    id: 'mfd-q12',
    question: 'Which nutrients must be carefully restricted in a "Renal (Kidney Disease) Diet"?',
    options: [
      'Sodium (Salt), Potassium, Phosphorus, and excess Fluids (as prescribed by the Dietitian)',
      'Clean air and sunlight',
      'All carbohydrates',
      'Vitamin C only'
    ],
    correctIndex: 0,
    explanation:
      'Patients with kidney disease cannot easily excrete excess sodium, potassium, phosphorus, and fluid, so these are carefully controlled.',
    moduleRef: 'Module 2: Patient Diets, Menu Planning & Tray Service Management'
  },
  {
    id: 'mfd-q13',
    question: 'Why must cooks NEVER use commercial "Low-Sodium Salt Substitutes" on a Renal (Kidney) patient’s meal?',
    options: [
      'Because salt substitutes are too sweet',
      'Because salt substitutes contain Potassium Chloride, which can cause dangerously high potassium levels in kidney patients',
      'Because salt substitutes change the color of rice',
      'Because salt substitutes are only for children'
    ],
    correctIndex: 1,
    explanation:
      'Commercial salt substitutes replace sodium with potassium chloride, which can cause life-threatening high blood potassium (hyperkalemia) in renal patients.',
    moduleRef: 'Module 2: Patient Diets, Menu Planning & Tray Service Management'
  },
  {
    id: 'mfd-q14',
    question: 'Under the IDDSI Dysphagia scale for patients with swallowing difficulty, what is "Level 4 — Pureed" food?',
    options: [
      'Hard nuts and crispy biscuits',
      'Smooth, lump-free pureed food that holds its shape on a spoon and does not drip through fork prongs',
      'Thin water and clear tea',
      'Large 3 cm chunks of roasted meat'
    ],
    correctIndex: 1,
    explanation:
      'IDDSI Level 4 (Pureed) is smooth and lump-free, requires no chewing, sits on a fork without dripping through, and slides off a spoon cleanly.',
    moduleRef: 'Module 2: Patient Diets, Menu Planning & Tray Service Management'
  },
  {
    id: 'mfd-q15',
    question: 'What is the maximum time a reconstituted powdered or kitchen-blended Tube Feed (Enteral Formula) can hang at room temperature at a patient’s bedside?',
    options: [
      'Maximum 4 hours',
      '24 hours',
      '48 hours',
      '3 days'
    ],
    correctIndex: 0,
    explanation:
      'To prevent rapid bacterial growth at room temperature, reconstituted powdered or blenderized tube feeds have a strict maximum hang time of 4 hours.',
    moduleRef: 'Module 2: Patient Diets, Menu Planning & Tray Service Management'
  },
  {
    id: 'mfd-q16',
    question: 'When delivering a meal tray to a patient at the bedside, how must the dietary server verify patient identity?',
    options: [
      'By checking only the room number on the door',
      'By matching TWO Patient Identifiers (Patient Full Name + Medical Record Number / Date of Birth) on the Tray Ticket against the patient’s wristband',
      'By asking another patient in the hallway',
      'By guessing based on the patient’s age'
    ],
    correctIndex: 1,
    explanation:
      'Because patients often change beds, JCI patient safety rules require checking two unique identifiers (Full Name + MRN/DOB) against the patient’s wristband.',
    moduleRef: 'Module 2: Patient Diets, Menu Planning & Tray Service Management'
  },

  // MODULE 3: FOOD PURCHASING, RECEIVING, STORE MANAGEMENT & COST CONTROL (8 MCQs)
  {
    id: 'mfd-q17',
    question: 'What is the maximum safe receiving temperature for chilled fresh meat, poultry, and dairy at the kitchen receiving dock?',
    options: [
      '≤ +4°C (maximum +5°C)',
      '+20°C',
      '+35°C',
      '+50°C'
    ],
    correctIndex: 0,
    explanation:
      'Chilled high-risk foods such as meat, poultry, and dairy must arrive cold at ≤ +4°C (max +5°C) to prevent bacterial growth.',
    moduleRef: 'Module 3: Food Purchasing, Receiving, Store Management & Cost Control'
  },
  {
    id: 'mfd-q18',
    question: 'At what temperature must frozen food deliveries arrive, and what should you do if frozen meat arrives soft and leaking water?',
    options: [
      'Arrive at ≤ -18°C; if it arrives thawed/soft, REJECT the delivery immediately',
      'Arrive at +10°C; refreeze it without checking',
      'Arrive at room temperature; wash it with soap',
      'Accept all deliveries without checking temperature'
    ],
    correctIndex: 0,
    explanation:
      'Frozen foods must arrive rock-solid at ≤ -18°C. Thawed or refrozen deliveries indicate cold-chain failure and must be rejected at the gate.',
    moduleRef: 'Module 3: Food Purchasing, Receiving, Store Management & Cost Control'
  },
  {
    id: 'mfd-q19',
    question: 'In a Dry Food Store, how high off the floor must food sacks, cartons, and containers be stored on racks or pallets?',
    options: [
      'Directly on the wet floor',
      'At least 15 cm (6 inches) off the floor and away from walls',
      'On top of cleaning chemical bottles',
      'Outside in the open parking lot'
    ],
    correctIndex: 1,
    explanation:
      'Storing food at least 15 cm (6 inches) off the floor allows easy floor cleaning, prevents dampness, and helps spot any pest activity.',
    moduleRef: 'Module 3: Food Purchasing, Receiving, Store Management & Cost Control'
  },
  {
    id: 'mfd-q20',
    question: 'What does the store management rule "FEFO" stand for?',
    options: [
      'First Expired, First Out (use items with the earliest expiry date first)',
      'Forever Keep Food Open',
      'Freeze Everything For October',
      'First Empty, First Order'
    ],
    correctIndex: 0,
    explanation:
      'FEFO means First Expired, First Out—placing stock with the closest expiry date in front so it is used before newer stock.',
    moduleRef: 'Module 3: Food Purchasing, Receiving, Store Management & Cost Control'
  },
  {
    id: 'mfd-q21',
    question: 'Inside a walk-in refrigerator (chiller), where must Raw Chicken/Meat and Cooked/Ready-to-Eat foods be placed?',
    options: [
      'Raw chicken on the top shelf and cooked food on the bottom shelf',
      'Cooked & Ready-to-Eat foods on the TOP shelves, and Raw Meat/Poultry on the BOTTOM shelves',
      'Mixed together in the same uncovered tray',
      'On the chiller floor next to the drain'
    ],
    correctIndex: 1,
    explanation:
      'Keeping Ready-to-Eat foods on the top shelves and Raw Poultry/Meat on the bottom shelves ensures raw blood or juices can never drip onto cooked meals.',
    moduleRef: 'Module 3: Food Purchasing, Receiving, Store Management & Cost Control'
  },
  {
    id: 'mfd-q22',
    question: 'Why does a Certified Dietary Manager enforce "Standardized Recipes" and numbered portion scoops in the kitchen?',
    options: [
      'To ensure every dish has consistent taste, accurate patient nutrition, and controlled food cost per portion',
      'To make cooking slower and harder',
      'So cooks can guess salt and oil amounts every day',
      'To increase food wastage'
    ],
    correctIndex: 0,
    explanation:
      'Standardized recipes and portion scoops ensure every meal has the exact same taste, nutritional value, and predictable portion cost.',
    moduleRef: 'Module 3: Food Purchasing, Receiving, Store Management & Cost Control'
  },
  {
    id: 'mfd-q23',
    question: 'If you buy 10 kg of raw potatoes (As-Purchased / AP) and after peeling you get 8 kg of peeled potatoes (Edible Portion / EP), what is the Yield Percentage?',
    options: [
      '80% Yield [(8 kg ÷ 10 kg) × 100]',
      '20% Yield',
      '100% Yield',
      '50% Yield'
    ],
    correctIndex: 0,
    explanation:
      'Yield % = (Edible Portion Weight ÷ As-Purchased Weight) × 100 = (8 ÷ 10) × 100 = 80%.',
    moduleRef: 'Module 3: Food Purchasing, Receiving, Store Management & Cost Control'
  },
  {
    id: 'mfd-q24',
    question: 'If your hospital dietary department spent Rs. 900,000 on patient food in a month and served 3,000 Inpatient Bed-Days, what is your Food Cost Per Patient Day (CPPD)?',
    options: [
      'Rs. 300 per patient day (900,000 ÷ 3,000)',
      'Rs. 3,000 per patient day',
      'Rs. 30 per patient day',
      'Rs. 90,000 per patient day'
    ],
    correctIndex: 0,
    explanation:
      'Food Cost Per Patient Day (CPPD) = Total Monthly Patient Food Cost (Rs. 900,000) ÷ Total Inpatient Bed-Days (3,000) = Rs. 300 per patient day.',
    moduleRef: 'Module 3: Food Purchasing, Receiving, Store Management & Cost Control'
  },

  // MODULE 4: KITCHEN HYGIENE, SAFE TEMPERATURES (HACCP), CLEANING & DISHWASHING (8 MCQs)
  {
    id: 'mfd-q25',
    question: 'What is the "Temperature Danger Zone (TDZ)" in which food poisoning bacteria multiply rapidly?',
    options: [
      'Between +5°C and +60°C',
      'Below -18°C',
      'Above +100°C',
      'Between 0°C and +2°C'
    ],
    correctIndex: 0,
    explanation:
      'Bacteria grow rapidly between +5°C and +60°C. Cold food must be kept at ≤ +5°C and hot food at ≥ +63°C.',
    moduleRef: 'Module 4: Kitchen Hygiene, Safe Temperatures (HACCP), Cleaning & Dishwashing'
  },
  {
    id: 'mfd-q26',
    question: 'What is the safest standard method to thaw (defrost) frozen chicken or meat?',
    options: [
      'Leave it out on the warm kitchen table overnight',
      'Soak it in hot water for 3 hours',
      'Place it in a covered tray on the bottom shelf of a thawing chiller at ≤ +4°C',
      'Put it near the cooking stove'
    ],
    correctIndex: 2,
    explanation:
      'Thawing frozen meat on the bottom shelf of a chiller at ≤ +4°C keeps the surface out of the Temperature Danger Zone so bacteria cannot multiply.',
    moduleRef: 'Module 4: Kitchen Hygiene, Safe Temperatures (HACCP), Cleaning & Dishwashing'
  },
  {
    id: 'mfd-q27',
    question: 'What is the minimum safe internal core cooking temperature for poultry (chicken) and minced meat dishes, and the minimum hot-holding temperature before serving?',
    options: [
      'Cook to ≥ +75°C core temperature; Hot-Hold at ≥ +63°C',
      'Cook to +40°C; Hot-Hold at +25°C',
      'Cook to +50°C; Hot-Hold at +30°C',
      'Thermometers are not needed for chicken'
    ],
    correctIndex: 0,
    explanation:
      'Cooking to ≥ +75°C destroys harmful bacteria like Salmonella, and holding hot food at ≥ +63°C prevents bacterial growth during service.',
    moduleRef: 'Module 4: Kitchen Hygiene, Safe Temperatures (HACCP), Cleaning & Dishwashing'
  },
  {
    id: 'mfd-q28',
    question: 'Under the international kitchen Color-Coding Chart, which color chopping board and knife must be used for (1) Raw Meat/Poultry and (2) Allergen-Free Special Diets?',
    options: [
      'Red for Raw Meat/Poultry; Purple for Allergen-Free Special Diets',
      'Green for Raw Meat; Brown for Allergen-Free Diets',
      'White for Raw Meat; Blue for Allergen-Free Diets',
      'Yellow for Raw Meat; Red for Salads'
    ],
    correctIndex: 0,
    explanation:
      'Red is used for Raw Meat/Poultry, while Purple is dedicated to Allergen-Free meal preparation.',
    moduleRef: 'Module 4: Kitchen Hygiene, Safe Temperatures (HACCP), Cleaning & Dishwashing'
  },
  {
    id: 'mfd-q29',
    question: 'How should fresh raw salad vegetables (lettuce, cucumbers, tomatoes) be washed and sanitized before chopping?',
    options: [
      'Wipe them with a dry cloth only',
      'Wash in running potable water to remove soil, dip in 50–100 ppm food-grade chlorine sanitizing solution for 5 minutes, and rinse with clean potable water',
      'Wash with dishwashing soap',
      'Soak in boiling oil'
    ],
    correctIndex: 1,
    explanation:
      'Because raw salads are not cooked, washing off soil followed by a 50–100 ppm food-grade chlorine dip and clean potable water rinse removes surface bacteria.',
    moduleRef: 'Module 4: Kitchen Hygiene, Safe Temperatures (HACCP), Cleaning & Dishwashing'
  },
  {
    id: 'mfd-q30',
    question: 'What is the correct 6-Step sequence for cleaning and sanitizing a kitchen food preparation table?',
    options: [
      '1) Pre-Scrape → 2) Pre-Rinse → 3) Detergent Wash → 4) Clean Water Rinse → 5) Apply Sanitizer → 6) Air Dry',
      'Spray sanitizer directly over grease and wipe with a dirty towel',
      'Rinse with cold water only once a week',
      'Wipe with a dry newspaper'
    ],
    correctIndex: 0,
    explanation:
      'Grease and food dirt block sanitizers from working. You must scrape, wash with detergent, and rinse before applying chemical sanitizer and air-drying.',
    moduleRef: 'Module 4: Kitchen Hygiene, Safe Temperatures (HACCP), Cleaning & Dishwashing'
  },
  {
    id: 'mfd-q31',
    question: 'In a commercial high-temperature dishwashing machine, what must the Final Sanitizing Rinse temperature be to disinfect patient trays and plates?',
    options: [
      'At least +82°C at the rinse manifold (achieving ≥ +71°C on the plate surface)',
      '+30°C lukewarm water',
      '+15°C cold water',
      '+45°C'
    ],
    correctIndex: 0,
    explanation:
      'A final rinse manifold temperature of ≥ +82°C heats the dish surface to ≥ +71°C, thermally killing bacteria and viruses.',
    moduleRef: 'Module 4: Kitchen Hygiene, Safe Temperatures (HACCP), Cleaning & Dishwashing'
  },
  {
    id: 'mfd-q32',
    question: 'What type of garbage bins must be used inside food preparation areas?',
    options: [
      'Open uncovered baskets next to cooking pots',
      'Foot-operated (pedal) covered bins lined with plastic bags that are emptied whenever 75% full and at the end of every shift',
      'Cardboard boxes on the prep table',
      'No bins are needed in a kitchen'
    ],
    correctIndex: 1,
    explanation:
      'Foot-operated covered bins keep flies away and allow kitchen staff to dispose of waste without touching bin lids with their hands.',
    moduleRef: 'Module 4: Kitchen Hygiene, Safe Temperatures (HACCP), Cleaning & Dishwashing'
  },

  // MODULE 5: QUALITY CHECKS, 72-HOUR FOOD SAMPLES, EMERGENCY PLANNING & AUDITS (8 MCQs)
  {
    id: 'mfd-q33',
    question: 'When should the Chef and Dietary Supervisor perform the daily Food Tasting and Temperature Check?',
    options: [
      'About 20 minutes BEFORE each meal service (Breakfast, Lunch, and Dinner) using clean tasting spoons and a calibrated probe thermometer',
      'Two days after the food is eaten',
      'Only once a month',
      'Tasting is never needed in a hospital kitchen'
    ],
    correctIndex: 0,
    explanation:
      'Checking taste, salt level, texture, and temperature 20 minutes before service allows the team to fix any issue before trays go to wards.',
    moduleRef: 'Module 5: Quality Checks, 72-Hour Food Samples, Emergency Planning & Audits'
  },
  {
    id: 'mfd-q34',
    question: 'How much food must be saved in the "Reference Food Sample Bank", at what temperature, and for how long?',
    options: [
      'At least 150 g of every served dish in a sterile labeled container, kept in a locked chiller at +1°C to +4°C for 72 hours (3 days)',
      '5 g kept on the office desk for 2 hours',
      '1 kg kept in the hot oven for 1 week',
      'Only take a photo of the menu on a phone'
    ],
    correctIndex: 0,
    explanation:
      'Retaining ≥ 150 g of every served meal at +1°C to +4°C for 72 hours provides official laboratory evidence if any foodborne illness complaint arises.',
    moduleRef: 'Module 5: Quality Checks, 72-Hour Food Samples, Emergency Planning & Audits'
  },
  {
    id: 'mfd-q35',
    question: 'If three patients complain of vomiting shortly after eating lunch, what is the FIRST action the Certified Dietary Manager must take?',
    options: [
      'Throw away the reference food samples and delete the temperature logs',
      'Immediately stop serving the suspected dish, quarantine remaining batches, lock the 72-hour Reference Food Samples, and inform Hospital Infection Control / Medical Director',
      'Ignore the complaint until next week',
      'Serve the remaining food to kitchen staff'
    ],
    correctIndex: 1,
    explanation:
      'Immediate containment (stopping service, quarantining stock, locking the 72-hour reference samples, and alerting Infection Control) protects patients and preserves lab evidence.',
    moduleRef: 'Module 5: Quality Checks, 72-Hour Food Samples, Emergency Planning & Audits'
  },
  {
    id: 'mfd-q36',
    question: 'Under hospital accreditation standards (such as JCI), how many days of Emergency Disaster Food and Drinking Water reserve must the Dietary Department keep on-site?',
    options: [
      'At least 72 hours (3 full days) of shelf-stable food, tube feeds, disposable plates, and drinking water (≥ 3 Liters per person per day)',
      'Only 2 hours of tea and biscuits',
      'No emergency stock is needed in a hospital',
      'Only frozen raw chicken'
    ],
    correctIndex: 0,
    explanation:
      'Hospitals must maintain a minimum 72-hour (3-day) self-sufficient emergency reserve of shelf-stable food, tube feeds, disposables, and drinking water.',
    moduleRef: 'Module 5: Quality Checks, 72-Hour Food Samples, Emergency Planning & Audits'
  },
  {
    id: 'mfd-q37',
    question: 'What should kitchen staff do immediately if there is a sudden power outage and backup power is delayed?',
    options: [
      'Open all chiller and freezer doors wide to let air in',
      'Keep all chiller and freezer doors tightly CLOSED to preserve cold air, and check core food temperatures when power returns',
      'Move frozen meat into the hot kitchen',
      'Turn on all exhaust fans'
    ],
    correctIndex: 1,
    explanation:
      'Keeping chiller and freezer doors closed traps cold air inside, keeping freezers safe for 24–48 hours and chillers cold for up to 4 hours.',
    moduleRef: 'Module 5: Quality Checks, 72-Hour Food Samples, Emergency Planning & Audits'
  },
  {
    id: 'mfd-q38',
    question: 'If the hospital experiences a "Boil-Water Alert" or water supply contamination, what must the Certified Dietary Manager do?',
    options: [
      'Keep using tap water and ice machines as normal',
      'Turn off plumbed ice machines and water dispensers, discard existing ice, use bottled or boiled water (boiled ≥ 1 minute), and use disposable plates/cups',
      'Wash salads in untreated water',
      'Add salt to tap water'
    ],
    correctIndex: 1,
    explanation:
      'During a water contamination alert, ice machines must be disconnected, existing ice discarded, and only bottled or rolling-boiled water used alongside disposable tableware.',
    moduleRef: 'Module 5: Quality Checks, 72-Hour Food Samples, Emergency Planning & Audits'
  },
  {
    id: 'mfd-q39',
    question: 'Why is it a serious violation if a kitchen supervisor pre-fills ("fakes") evening chiller temperature logs in the morning?',
    options: [
      'Because falsifying food safety logs hides real equipment failures, puts patients at risk, and leads to an immediate Critical Failure in Food Authority or JCI audits',
      'Because blue ink should be used instead of black ink',
      'Pre-filling logs is allowed on weekends',
      'Logs are only for decoration'
    ],
    correctIndex: 0,
    explanation:
      'Temperature and cleaning logs are legal food safety records; they must be recorded honestly at the exact time the check is performed.',
    moduleRef: 'Module 5: Quality Checks, 72-Hour Food Samples, Emergency Planning & Audits'
  },
  {
    id: 'mfd-q40',
    question: 'Within how many hours should a well-managed dietary department be able to trace the supplier batch/lot number of any ingredient used in a meal?',
    options: [
      'Within 2 to 4 hours using the Daily Receiving Log and Kitchen Production Sheet',
      'Within 6 months',
      'Within 30 days',
      'Ingredient batch numbers never need to be recorded'
    ],
    correctIndex: 0,
    explanation:
      'Recording supplier batch/lot numbers at receiving and store issue allows a Manager to trace and isolate any recalled ingredient within 2 to 4 hours.',
    moduleRef: 'Module 5: Quality Checks, 72-Hour Food Samples, Emergency Planning & Audits'
  }
];

export const MANAGER_FOOD_DIETARY_COURSE: InternationalTrainingCourse = {
  id: 'mgr-food-dietary-2026',
  code: 'CDM-CERT',
  title: 'Certified Dietary Manager',
  levelBadge: 'Professional Certification (05 Modules · 50 Slides · 40 MCQs · 60% Pass)',
  accreditationStandard:
    'Hospital & Institutional Food & Dietary Management • Verified Certification',
  duration: '05 Presentation Modules (50 Easy Slides) + 40-MCQ Exam',
  certificateFeeRs: 8000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'A comprehensive, step-by-step Slide Presentation Course designed for Certified Dietary Manager (CDM) roles in hospitals, clinics, corporate cafeterias, and catering operations. Course study material (05 Presentation Modules / 50 Slides) and the 40-MCQ Final Exam are 100% Free for all users, with an official verifiable Portrait PDF Certificate available upon completion (Certificate Fee: Rs. 8,000).',
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
  subType: '05 Presentation Modules (50 Slides) | 40 MCQs | 60% Pass',
  description: MANAGER_FOOD_DIETARY_COURSE.description,
  duration: MANAGER_FOOD_DIETARY_COURSE.duration,
  fees: 'Free Study & Exam | Rs. 8,000 Verified Certificate',
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
