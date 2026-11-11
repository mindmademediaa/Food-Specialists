import { HubTraining } from '../types/hub';
import { InternationalTrainingCourse } from './internationalTrainingsData';
import { buildHubTrainingFromCourse } from './coursesHaccp3And4';

// ============================================================================
// 3. FOOD SAFETY LEVEL 03 (SUPERVISING FOOD SAFETY IN CATERING & MANUFACTURING)
// ============================================================================
export const FOOD_SAFETY_LEVEL_03_COURSE: InternationalTrainingCourse = {
  id: 'cert-2026-food-safety-level-03',
  code: 'FS-L3',
  title: 'Food Safety Level 03',
  levelBadge: 'Simple Presentation Course (05 Modules · 40 Slides · 40 MCQs · 60% Pass)',
  accreditationStandard:
    'International Supervising Food Safety & Hygiene Level 03 • Presentation Course',
  duration: '05 Presentation Modules (40 Slides) + 40-MCQ Final Exam',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Comprehensive Slide Presentation Course on Supervising Food Safety (Level 03) for Kitchen Supervisors, Restaurant Managers, Production Line Leaders, and QA Officers. Covers Food Microbiology & Foodborne Illness, Temperature Control & Safe Storage, Cross-Contamination & Allergen Supervision, Premises Hygiene, Cleaning & Pest Control, and Supervisory Inspections & Food Safety Law.',
  modules: [
    {
      id: 'fs3-mod-1',
      moduleNumber: 1,
      title: 'Supervisory Responsibilities, Food Microbiology & Foodborne Illness',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on the role of a Level 03 Food Safety Supervisor, how bacteria multiply (FATTOM), key food poisoning pathogens, and high-risk vs. low-risk foods.',
      internationalClauses: [
        'Codex General Principles of Food Hygiene & Level 03 Supervisory Standards'
      ],
      keyPrinciples: [
        'A Food Safety Level 03 Supervisor leads by example, trains food handlers, checks daily hygiene and temperature logs, and corrects unsafe practices on the spot.',
        'Bacteria require 6 conditions to multiply (FATTOM): Food (protein/moisture), Acidity (neutral pH 4.6–7.5), Time, Temperature (+5°C to +60°C), Oxygen, and Moisture (aw > 0.85).',
        'High-Risk Foods are Ready-to-Eat, high-protein, moist foods (cooked meat, poultry, dairy, cooked rice, seafood, egg dishes) that support rapid bacterial growth without further cooking.',
        'Major foodborne pathogens include Salmonella, Campylobacter, E. coli O157, Listeria monocytogenes, Staphylococcus aureus, Clostridium perfringens, Bacillus cereus, and Norovirus.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Bacterial Binary Fission in the Temperature Danger Zone',
          standardLimit: 'Keep high-risk foods out of +5°C to +60°C (bacteria double every 10–20 minutes at +37°C)',
          correctiveProtocol: 'Discard any high-risk ready-to-eat food left in the Danger Zone for more than 4 hours.'
        },
        {
          parameter: 'High-Risk Ready-to-Eat (RTE) Food Protection',
          standardLimit: 'Store covered at ≤ +4°C (+5°C max), separate from raw foods, with strict Use-By date labels',
          correctiveProtocol: 'Never prepare or store High-Risk RTE foods on surfaces used for raw meat.'
        }
      ],
      practicalChecklist: [
        'Conduct a daily pre-shift hygiene inspection of all food handlers and workstations.',
        'Check that all High-Risk Ready-to-Eat foods in chillers are covered, date-labeled, and stored above raw items.',
        'Coach new staff on the 6 FATTOM conditions and why time-temperature control is critical.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'The Role of a Level 03 Food Safety Supervisor',
          subtitle: 'Why Supervisors Are the Backbone of Safe Food Operations',
          bulletPoints: [
            'Food Safety Level 03 is designed for Supervisors, Sous Chefs, Shift Managers, and QA Officers who oversee food handlers.',
            'Your key duties: Train and coach staff, monitor daily temperature and cleaning logs, inspect deliveries, and enforce personal hygiene.',
            'Good food safety prevents food poisoning outbreaks, protects brand reputation, reduces food waste, and ensures legal compliance.'
          ],
          keyTakeaway:
            'As a Supervisor, what you walk past is what you accept—always correct unsafe food handling immediately.'
        },
        {
          slideNumber: 2,
          title: 'High-Risk vs. Low-Risk Foods',
          subtitle: 'Knowing Which Foods Require Strict Refrigeration',
          bulletPoints: [
            'High-Risk Foods: Ready-to-Eat (RTE) foods that are moist and high in protein, where bacteria can grow quickly and which will be eaten without further cooking.',
            'Examples of High-Risk Foods: Cooked meat and poultry, cooked rice and pasta, milk, cream, soft cheeses, cooked eggs/mayonnaise, smoked fish, and prepared salads.',
            'Low-Risk Foods: Dry, acidic, salty, or high-sugar foods where bacteria cannot easily grow (e.g., dry flour, uncooked rice, biscuits, pickles, jam, cooking oil).'
          ],
          keyTakeaway:
            'Note: Cooked rice is a High-Risk Food because Bacillus cereus spores survive boiling and multiply if rice is left warm!'
        },
        {
          slideNumber: 3,
          title: 'How Bacteria Multiply (The 6 FATTOM Factors)',
          subtitle: 'Understanding What Bacteria Need to Grow',
          bulletPoints: [
            'Bacteria multiply by splitting in two (Binary Fission) every 10 to 20 minutes under ideal conditions.',
            'F — Food: High-protein, nutrient-rich foods.',
            'A — Acidity: Bacteria prefer neutral pH (between pH 4.6 and 7.5); strong acid (pH < 4.6 like vinegar/lemon) stops most bacterial growth.',
            'T — Time & T — Temperature: In the Temperature Danger Zone (+5°C to +60°C), a few bacteria can become millions in just a few hours.',
            'O — Oxygen: Some bacteria need air (aerobic), while others grow in vacuum packs or deep pots without air (anaerobic).',
            'M — Moisture: Bacteria need available water (Water Activity aw > 0.85) to grow.'
          ],
          keyTakeaway:
            'By controlling Time and Temperature (keeping food ≤ +5°C or ≥ +63°C), you break the FATTOM chain.'
        },
        {
          slideNumber: 4,
          title: 'Key Food Poisoning Bacteria Every Supervisor Must Know (Part 1)',
          subtitle: 'Salmonella, Campylobacter & E. coli O157',
          bulletPoints: [
            'Salmonella: Found in raw poultry, raw eggs, and unpasteurized milk. Killed by cooking to ≥ +75°C and using pasteurized eggs.',
            'Campylobacter jejuni: The most common bacterial cause of foodborne diarrhea; found in raw chicken. Never wash raw chicken in the sink (splashing water spreads Campylobacter across the kitchen!).',
            'E. coli O157 (STEC): Found in raw minced beef, unwashed salad vegetables, and contaminated water. Has a very low infective dose and can cause severe kidney failure in children.'
          ],
          keyTakeaway:
            'Never wash raw chicken at a kitchen sink—cook it thoroughly to ≥ +75°C to kill Salmonella and Campylobacter.'
        },
        {
          slideNumber: 5,
          title: 'Key Food Poisoning Bacteria (Part 2)',
          subtitle: 'Staphylococcus aureus, Clostridium perfringens & Bacillus cereus',
          bulletPoints: [
            'Staphylococcus aureus: Carried in the nose, throat, skin, and cuts of healthy humans. Transfers to cooked ham, salads, or cream pastries via bare hands and produces a heat-stable vomiting toxin within 1–6 hours.',
            'Clostridium perfringens: Spore-former found in soil and raw meat; multiplies in large pots of gravy, stew, or curry cooled too slowly.',
            'Bacillus cereus: Spore-former found in rice, cereals, and spices; produces a heat-stable vomiting toxin if cooked rice is left at room temperature.'
          ],
          keyTakeaway:
            'Cool cooked rice, curries, and gravies rapidly (to ≤ +4°C) and never handle Ready-to-Eat foods with bare hands.'
        },
        {
          slideNumber: 6,
          title: 'Listeria monocytogenes & Foodborne Viruses',
          subtitle: 'Cold-Tolerant Bacteria & Highly Contagious Viruses',
          bulletPoints: [
            'Listeria monocytogenes: Found in soft cheeses, pâté, sliced deli meats, smoked fish, and wet chiller drains. Crucially, it can grow slowly even inside a refrigerator at +1°C to +4°C!',
            'Norovirus ("Winter Vomiting Bug") & Hepatitis A: Viruses do NOT multiply in food, but just 10 to 100 viral particles from an infected food handler’s unwashed hands can infect dozens of diners.',
            'Strict handwashing with soap and water + 48-hour exclusion after vomiting/diarrhea are essential to stop Norovirus.'
          ],
          keyTakeaway:
            'Alcohol hand gel alone does NOT kill Norovirus effectively—thorough handwashing with soap and running warm water is mandatory.'
        },
        {
          slideNumber: 7,
          title: 'Food Spoilage vs. Food Poisoning',
          subtitle: 'Why "Smelling the Food" Cannot Protect You',
          bulletPoints: [
            'Spoilage Bacteria & Molds: Break down food so it smells sour, looks slimy, or shows visible green/white mold—people see or smell it and do not eat it.',
            'Pathogenic (Food Poisoning) Bacteria: Do NOT change the look, smell, or taste of food!',
            'A chicken sandwich contaminated with a lethal dose of Salmonella or Listeria looks, smells, and tastes 100% normal.'
          ],
          keyTakeaway:
            'Never taste or smell food to decide if it is safe—rely on calibrated thermometers and strict time/date logs.'
        },
        {
          slideNumber: 8,
          title: 'Vulnerable Groups (YOPI) & Outbreak Reporting',
          subtitle: 'Protecting Those at Highest Risk',
          bulletPoints: [
            'YOPI Groups: Young children/infants, Old/elderly people, Pregnant women, and Immunocompromised patients have weaker immune systems and face the highest risk of hospitalization or death.',
            'If 2 or more customers or staff report similar illness after eating the same meal, treat it as a suspected outbreak: quarantine remaining food, preserve reference samples, and notify management/authorities.'
          ],
          keyTakeaway:
            'Fast supervisory containment during a suspected illness complaint prevents a single case from becoming a major outbreak.'
        }
      ]
    },
    {
      id: 'fs3-mod-2',
      moduleNumber: 2,
      title: 'Temperature Control, Delivery, Storage, Cooking, Cooling & Reheating',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on all critical food safety temperatures from receiving to service, how to calibrate and use probe thermometers, and how to supervise safe thawing, cooking, blast chilling, and hot/cold holding.',
      internationalClauses: [
        'International Food Code Time-Temperature Controls'
      ],
      keyPrinciples: [
        'Cold Chain Rule: Chilled deliveries and refrigerators must be maintained at +1°C to +4°C (maximum +5°C); Freezers must operate at ≤ -18°C.',
        'Thermal Cooking & Reheating Rule: Cook and reheat high-risk foods to a core temperature of ≥ +75°C for 30 seconds (or ≥ +70°C for 2 minutes).',
        'Rapid Cooling Rule: Cool hot food from +60°C to +20°C within ≤ 2 hours and then from +20°C to ≤ +4°C within ≤ 4 hours (or ≤ 90 minutes in a Blast Chiller).',
        'Service Holding Rule: Keep hot food at ≥ +63°C and cold food at ≤ +5°C.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Safe Core Cooking, Reheating & Hot/Cold Holding Limits',
          standardLimit: 'Cook/Reheat ≥ +75°C; Hot Hold ≥ +63°C; Cold Hold ≤ +5°C; Freezer ≤ -18°C',
          correctiveProtocol: 'Reheat once to ≥ +75°C if hot holding drops below +63°C for < 2 hours, or discard immediately.'
        },
        {
          parameter: 'Probe Thermometer Calibration & Sanitization',
          standardLimit: 'Ice-point check at 0.0°C (±0.5°C to ±1.0°C) and boiling check at 100.0°C; sanitize probe before and after every use',
          correctiveProtocol: 'Replace or recalibrate any thermometer that drifts by more than ±1.0°C.'
        }
      ],
      practicalChecklist: [
        'Check and sign morning and evening temperature logs for all walk-in chillers, reach-in fridges, and freezers.',
        'Verify that staff sanitize probe thermometers with alcohol wipes before and after probing food.',
        'Ensure cooked batches are cooled in shallow pans or blast chillers and labeled with a 72-hour maximum Use-By date.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'The Complete Temperature Summary Chart',
          subtitle: 'Every Number You Need for Level 03 Exams & Daily Supervision',
          bulletPoints: [
            'Freezer Storage & Frozen Delivery: ≤ -18°C.',
            'Chiller Storage & Chilled Delivery: +1°C to +4°C (Legal maximum ≤ +5°C; Fresh fish on ice ≤ +2°C).',
            'Temperature Danger Zone (TDZ): +5°C to +60°C (Optimal bacterial growth at +37°C).',
            'Hot Holding (Buffet / Bain-Marie): ≥ +63°C.',
            'Core Cooking & Reheating Temperature: ≥ +75°C for 30 seconds (or ≥ +70°C for 2 minutes; ≥ +82°C for reheating in Scotland).',
            'Dishwasher Final Sanitizing Rinse: ≥ +82°C.'
          ],
          keyTakeaway:
            'Post this temperature chart near the kitchen pass so every cook and server knows the exact limits.'
        },
        {
          slideNumber: 2,
          title: 'How to Use & Calibrate Digital Probe Thermometers',
          subtitle: 'Getting Accurate Core Readings Without Cross-Contamination',
          bulletPoints: [
            'Never rely on a fridge’s outside wall dial alone—check actual food temperatures using a digital core probe thermometer.',
            'How to Probe Correctly: Wipe the metal stem with a food-safe antibacterial alcohol wipe, insert the tip into the thickest center part of the food (avoiding bone or pan metal), wait 15 seconds for the reading to stabilize, then wipe clean again.',
            'Ice-Point Calibration: Fill a cup with crushed ice and cold water (50:50 slurry); stir and insert the probe—it must read 0.0°C (±0.5°C).',
            'Boiling-Point Calibration: In rapidly boiling water, the probe must read 100.0°C (±1.0°C).'
          ],
          keyTakeaway:
            'Always sanitize the thermometer probe before AND after probing each food item, and use separate probes for raw and cooked foods.'
        },
        {
          slideNumber: 3,
          title: 'Supervising Safe Delivery & Cold Storage',
          subtitle: 'Maintaining the Unbroken Cold Chain',
          bulletPoints: [
            'Inspect deliveries immediately at the receiving bay—transfer chilled and frozen goods into cold storage within 15 minutes.',
            'Do not overload refrigerators or pack cartons tightly against the back wall, as cold air must circulate freely around shelves.',
            'Never put hot pans directly into a storage chiller, as the steam raises the chiller temperature and puts all other stored food into the Danger Zone.',
            'Follow FEFO (First Expired, First Out) and label all prepped/opened items with a clear Use-By date.'
          ],
          keyTakeaway:
            'Overloading a refrigerator blocks airflow and creates warm pockets where food spoils rapidly.'
        },
        {
          slideNumber: 4,
          title: 'Supervising Safe Thawing (Defrosting)',
          subtitle: 'Eliminating Raw Drip & Surface Bacterial Growth',
          bulletPoints: [
            'Why is room-temperature thawing dangerous? Because the outside of a frozen chicken reaches +25°C (Danger Zone) while the center is still frozen solid!',
            'Standard Thawing Method: Place frozen meat/poultry in a deep covered container on the BOTTOM shelf of a dedicated Thawing Chiller at ≤ +4°C.',
            'Make sure raw thawing liquid (drip) cannot splash or drip onto any other food or shelf.',
            'Label the container with the date/time moved to the chiller, cook within 24 hours of thawing, and NEVER refreeze thawed raw meat.'
          ],
          keyTakeaway:
            'Thaw meat in a covered drip tray on the bottom shelf of a chiller (≤ +4°C) and never refreeze once thawed.'
        },
        {
          slideNumber: 5,
          title: 'Supervising Safe Cooking (Thermal Kill Step)',
          subtitle: 'Ensuring 100% Pathogen Destruction',
          bulletPoints: [
            'Cooking is the main Critical Control Point (CCP) that destroys vegetative pathogens like Salmonella, E. coli, Campylobacter, and Listeria.',
            'Check the thickest piece in the coldest part of the oven or grill—it must reach ≥ +75°C (or ≥ +70°C for 2 minutes).',
            'Stir liquid dishes (soups, sauces, curries, gravies) before probing so heat is distributed evenly and there are no cold pockets.',
            'Whole rolled joints of meat, stuffed poultry, and minced meat burgers must always be cooked all the way through to ≥ +75°C with zero pink meat or red juices.'
          ],
          keyTakeaway:
            'Minced meats and rolled joints have surface bacteria mixed into the center—they must always be cooked thoroughly to ≥ +75°C.'
        },
        {
          slideNumber: 6,
          title: 'Supervising Rapid Cooling of Cooked Food',
          subtitle: 'Beating Spore Germination in the Danger Zone',
          bulletPoints: [
            'Slow cooling of cooked food is one of the biggest causes of Clostridium perfringens and Bacillus cereus food poisoning.',
            'Target Cooling Limit: Cool from +60°C to +20°C within 2 hours, and from +20°C to ≤ +4°C within 4 hours (or from +70°C to ≤ +3°C in ≤ 90 minutes using a Blast Chiller).',
            'Practical Ways to Speed Up Cooling: Portion large batches into shallow stainless-steel gastronorm pans (< 5 cm deep), place pans in an ice-water bath, stir with a sanitized cooling paddle, or use a Blast Chiller.'
          ],
          keyTakeaway:
            'Decant deep pots of curry, soup, or rice into shallow pans immediately after cooking so they cool rapidly.'
        },
        {
          slideNumber: 7,
          title: 'Supervising Reheating & Hot Holding',
          subtitle: 'Keeping Buffet & Service Food Safe',
          bulletPoints: [
            'Hot Holding Rule: Pre-heat the bain-marie or hot cabinet BEFORE loading hot food, and keep food at ≥ +63°C.',
            'Never use a bain-marie to cook cold food or reheat chilled food—it heats too slowly!',
            'Never "top up" (mix) a fresh batch of food on top of an old batch sitting in the buffet pan—replace the pan completely with a clean one.',
            'Reheating Rule: Reheat chilled food rapidly to ≥ +75°C core temperature, reheat ONLY ONCE, and discard any unserved reheated leftovers at the end of service.'
          ],
          keyTakeaway:
            'Pre-heat hot-holding units before loading, keep food ≥ +63°C, never top-up old pans, and reheat food only once to ≥ +75°C.'
        },
        {
          slideNumber: 8,
          title: 'Supervising Cold Display & Buffet Service',
          subtitle: 'Protecting Salads, Sandwiches & Desserts',
          bulletPoints: [
            'Cold display units, salad bars, and sandwich chillers must hold food at ≤ +5°C (ideally ≤ +4°C).',
            'Use sneeze guards (protective glass canopies), clean serving tongs for each dish, and small display batches replenished frequently from the back chiller.',
            'If cold high-risk food is displayed out of refrigeration for a short buffet event, enforce the strict 2-Hour / 4-Hour Rule (return to chiller within 2 hours, or use within 4 hours max and discard).'
          ],
          keyTakeaway:
            'Cold buffets need sneeze guards, separate tongs per dish (to prevent allergen cross-contact), and core temperatures ≤ +5°C.'
        }
      ]
    },
    {
      id: 'fs3-mod-3',
      moduleNumber: 3,
      title: 'Preventing Cross-Contamination, Allergen Control & Personal Hygiene',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on direct vs. indirect cross-contamination, color-coded equipment, managing major food allergens in kitchens and factories, and supervising staff personal hygiene and medical fitness.',
      internationalClauses: [
        'Codex CXC 80-2020 Food Allergen Management & Hygiene Controls'
      ],
      keyPrinciples: [
        'Direct Cross-Contamination happens when raw food touches or drips onto Ready-to-Eat food; Indirect Cross-Contamination happens via hands, knives, chopping boards, cloths, or worktables.',
        'Enforce physical separation and color-coded utensils for Raw Meat (Red), Raw Fish (Blue), Cooked Meat (Yellow), Salads/Fruit (Green), Root Veg (Brown), Bakery/Dairy (White), and Allergen-Free (Purple).',
        'Food Allergies involve an immune reaction to specific proteins (even micrograms can cause fatal anaphylaxis); Food Intolerances (like lactose intolerance) are digestive and non-life-threatening.',
        'Supervisors must enforce the 20-second handwashing method, ban jewelry/nail polish/watches, and enforce the 48-hour symptom-free exclusion rule for gastrointestinal illness.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Physical & Color-Coded Separation of Raw vs. Ready-to-Eat (RTE)',
          standardLimit: 'Zero shared chopping boards, knives, slicers, or vacuum packers between raw and RTE foods',
          correctiveProtocol: 'Immediately discard any Ready-to-Eat food that contacts a raw meat surface or utensil.'
        },
        {
          parameter: 'Allergen Communication & Preparation Protocol',
          standardLimit: 'Accurate written Allergen Matrix + clean uniform/gloves + washed surface + Purple kit for allergy orders',
          correctiveProtocol: 'Never guess ingredients—check the recipe allergen matrix and original ingredient labels every time.'
        }
      ],
      practicalChecklist: [
        'Inspect all chopping boards and knives to confirm color-coding is followed and worn/grooved boards are replaced.',
        'Verify that the current Menu Allergen Matrix is available at the service point and in the kitchen.',
        'Check handwashing stations twice daily to ensure warm water, antibacterial liquid soap, and paper towels are fully stocked.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Direct vs. Indirect Cross-Contamination',
          subtitle: 'How Germs Travel From Raw Food to Ready-to-Eat Food',
          bulletPoints: [
            'Direct Cross-Contamination: Raw meat, poultry, fish, or unwashed soil vegetables directly touching or dripping blood/juices onto cooked or Ready-to-Eat food.',
            'Indirect Cross-Contamination (Vehicles of Contamination): Germs transferring via unwashed hands, shared chopping boards, knives, meat slicers, door handles, or reusable wiping cloths.',
            'Remember: Raw food has a future cooking step to kill bacteria; Ready-to-Eat food has NO further cooking step, so even tiny contamination is dangerous!'
          ],
          keyTakeaway:
            'Eliminate reusable wiping cloths in high-care areas—use single-use paper towels and food-safe sanitizer sprays.'
        },
        {
          slideNumber: 2,
          title: 'Enforcing the 7-Color Hygiene Coding System',
          subtitle: 'Visual Discipline on the Preparation Line',
          bulletPoints: [
            'Red: Raw Meat & Poultry',
            'Blue: Raw Fish & Seafood',
            'Yellow: Cooked Meat & Poultry',
            'Green: Washed Salads & Fresh Fruit',
            'Brown: Unwashed Root Vegetables (Potatoes, Carrots, Onions)',
            'White: Bakery, Bread & Dairy Products',
            'Purple: Allergen-Free & Special Diet Preparation',
            'Wash, sanitize, and store color-coded boards vertically in a rack so air circulates between them.'
          ],
          keyTakeaway:
            'Never stack wet chopping boards flat on top of each other—store them upright in a sanitized rack to air-dry.'
        },
        {
          slideNumber: 3,
          title: 'Food Allergy vs. Food Intolerance',
          subtitle: 'Understanding Why Allergens Are a Life-or-Death Issue',
          bulletPoints: [
            'Food Allergy: An immediate, severe immune system reaction to a specific food protein (such as peanuts, tree nuts, milk, egg, fish, shellfish, soy, wheat, or sesame).',
            'Can trigger Anaphylactic Shock within minutes: swelling of throat and tongue, difficulty breathing, drop in blood pressure, collapse, and death if not treated with an adrenaline (EpiPen) injection.',
            'Food Intolerance (e.g., Lactose intolerance): A digestive difficulty (bloating, cramps) that does not involve the immune system and is not immediately life-threatening (Note: Celiac disease is a serious autoimmune reaction to gluten requiring < 20 ppm gluten).'
          ],
          keyTakeaway:
            'Even a microscopic crumb or droplet of an allergen on a knife, fryer oil, or grill can trigger fatal anaphylaxis.'
        },
        {
          slideNumber: 4,
          title: 'Controlling Allergens in Kitchens & Factories',
          subtitle: 'Practical Rules for Preparing an Allergy-Safe Meal',
          bulletPoints: [
            'Maintain an accurate written Allergen Matrix showing which of the major allergens are present in every menu dish or product.',
            'When a customer or patient declares an allergy:',
            '• Inform the Shift Supervisor / Head Chef immediately.',
            '• Wash hands thoroughly, put on fresh gloves and a clean apron.',
            '• Wash and detergent-scrub the prep surface (remember: sanitizer spray alone does NOT remove allergenic proteins!).',
            '• Use dedicated Purple allergen utensils, fresh unopened ingredients, and clean cooking oil (never fry in oil previously used for battered fish or breaded chicken!).'
          ],
          keyTakeaway:
            'Deep-frying oil shared with breaded or battered items is contaminated with gluten/egg/fish allergens—always use a separate clean pan.'
        },
        {
          slideNumber: 5,
          title: 'Controlling Physical & Chemical Contamination',
          subtitle: 'Foreign Body Prevention Rules on the Floor',
          bulletPoints: [
            'No Glass & Brittle Plastic Policy: Decant ingredients from glass jars into food-grade plastic containers outside the cooking zone.',
            'No Wood, Staples, or Wire Scrubbers: Use stainless-steel tables, plastic pallets, and nylon/green scouring pads.',
            'Decanting & Sieving: Sift flour and dry powders through an intact stainless-steel mesh sieve (checked before and after use for broken wires).',
            'Chemical Control: Store cleaning chemicals in a locked cupboard in their original labeled bottles—never put bleach or detergent into an empty drinking water bottle!'
          ],
          keyTakeaway:
            'Never decant cleaning chemicals into food or beverage containers, and check sieves/blades daily for missing metal pieces.'
        },
        {
          slideNumber: 6,
          title: 'Supervising Handwashing Technique & Facilities',
          subtitle: 'The Most Important 20 Seconds in Food Safety',
          bulletPoints: [
            'Dedicated Handwash Basin: Must be used ONLY for washing hands (never for washing food or utensils!) and fitted with non-hand-operated taps (knee, foot, or sensor taps).',
            'Stocked at all times with warm running water (+38°C to +45°C), antibacterial liquid soap, and single-use paper towels (no shared cloth towels).',
            '6-Step Handwashing Technique (20–30 seconds): Wet hands → Apply soap → Rub palms, backs of hands, between fingers, backs of fingers, thumbs, and fingertips/nails → Rinse → Dry with paper towel and use the towel to turn off the tap.'
          ],
          keyTakeaway:
            'If a handwash basin runs out of soap or paper towels, restock it immediately before allowing staff to continue food prep.'
        },
        {
          slideNumber: 7,
          title: 'Protective Clothing, Jewelry & Bad Habits',
          subtitle: 'Setting the Standard for Floor Discipline',
          bulletPoints: [
            'Protective Clothing: Clean light-colored uniform without external pockets or loose buttons (which can fall into food), put on at work (never worn while commuting on buses/streets).',
            'Hair Restraint: Put on hairnet/mob cap FIRST before putting on the uniform coat so loose hairs do not fall onto the shoulders.',
            'Zero Jewelry Policy: Remove watches, rings, bracelets, and visible piercings (studs and stones harbor bacteria and can fall into food).',
            'Strictly prohibit eating, chewing gum, smoking/vaping, spitting, or touching mobile phones in food handling areas.'
          ],
          keyTakeaway:
            'Mobile phones carry heavy bacterial contamination—ban personal mobile phones at food prep tables.'
        },
        {
          slideNumber: 8,
          title: 'Managing Staff Sickness & Return-to-Work Interviews',
          subtitle: 'Enforcing the 48-Hour Exclusion Rule',
          bulletPoints: [
            'Any staff member suffering from diarrhea, vomiting, fever with sore throat, jaundice, or infected skin lesions must report to the Supervisor before entering the building.',
            'Exclude the worker from food handling immediately and log it in the Sickness & Return-to-Work Register.',
            'The employee may only return to food handling after being completely symptom-free for at least 48 hours after stopping anti-diarrheal medication (or with medical clearance for Typhoid/Salmonella/Hepatitis A).'
          ],
          keyTakeaway:
            'Conduct a signed Return-to-Work Interview with every staff member returning from stomach illness to confirm 48 hours symptom-free.'
        }
      ]
    },
    {
      id: 'fs3-mod-4',
      moduleNumber: 4,
      title: 'Hygienic Premises Design, Cleaning & Disinfection (SSOPs), Waste & Pest Control',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on hygienic kitchen/factory design, the difference between detergents and disinfectants, Sinner’s Circle (TACT), Master Cleaning Schedules, waste management, and Integrated Pest Management (IPM).',
      internationalClauses: [
        'Codex Section 3 & 6: Establishment Design, Cleaning & Pest Control'
      ],
      keyPrinciples: [
        'Hygienic premises use smooth, impervious, washable surfaces, coved floor-to-wall joints, adequate drainage, good lighting, and extraction ventilation.',
        'Detergents remove grease and organic dirt; Disinfectants/Sanitizers reduce bacteria to a safe level—always clean with detergent BEFORE applying disinfectant.',
        'Cleaning effectiveness depends on 4 factors (Sinner’s Circle — T.A.C.T.): Time (contact time), Action (scrubbing/water pressure), Chemical concentration, and Temperature.',
        'Integrated Pest Management (IPM) combines pest-proofing (exclusion), good housekeeping (denying food/water), and regular monitoring by a licensed pest contractor.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Two-Stage Cleaning & Chemical Contact Time',
          standardLimit: 'Stage 1: Detergent wash to remove grease/soil → Rinse → Stage 2: Disinfectant at correct ppm for full contact time → Air dry',
          correctiveProtocol: 'Re-clean and re-sanitize any surface where sanitizer was wiped off immediately without waiting for contact time.'
        },
        {
          parameter: 'Pest Proofing & Zero Infestation Tolerance',
          standardLimit: 'Zero evidence of rodents, cockroaches, or flies in food areas; door gaps ≤ 3 mm; fly screens intact',
          correctiveProtocol: 'If pest signs (droppings/gnawing) are found near food, quarantine & discard affected food, deep-clean, and call pest control immediately.'
        }
      ],
      practicalChecklist: [
        'Audit the Master Cleaning Schedule (What, Who, How, Chemical dilution, Frequency, Sign-off) across all kitchen sections.',
        'Check chemical dilution dispensers and test sanitizer spray bottles with chemical test strips.',
        'Inspect external doors, window fly screens, floor drains, and UV fly-killer glue boards weekly.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Hygienic Design of Food Premises & Equipment',
          subtitle: 'Building a Kitchen or Factory That Is Easy to Clean',
          bulletPoints: [
            'Walls, Floors & Ceilings: Must be smooth, waterproof, non-absorbent, light-colored, and free from cracks or peeling paint.',
            'Coved Corners: Floor-to-wall junctions should be rounded (coved) so dirt and water cannot hide in sharp 90-degree corners.',
            'Equipment Design: Made of food-grade 304/316 stainless steel, smooth welds, easy to dismantle for cleaning, and mounted on legs (at least 15–30 cm off the floor) or mobile lockable castors.'
          ],
          keyTakeaway:
            'Report cracked tiles, peeling ceiling paint, or rusted equipment frames to maintenance immediately.'
        },
        {
          slideNumber: 2,
          title: 'Detergents vs. Disinfectants vs. Sanitizers',
          subtitle: 'Knowing What Each Cleaning Chemical Actually Does',
          bulletPoints: [
            'Detergent (Soap / Degreaser): Dissolves grease, oil, and food dirt so it can be rinsed away—does NOT kill bacteria.',
            'Disinfectant: Kills pathogenic microorganisms to a safe level, but ONLY works on a clean, grease-free surface.',
            'Sanitizer: A chemical that combines cleaning and disinfecting properties (though heavily soiled surfaces still require a two-stage clean first).',
            'Sterilization: Destroying 100% of all microorganisms and spores (used for surgical tools, baby bottles, and UHT/retort processing).'
          ],
          keyTakeaway:
            'Disinfectants are inactivated by grease and food scraps—always wash with detergent and rinse before disinfecting!'
        },
        {
          slideNumber: 3,
          title: 'The 4 Factors of Effective Cleaning (T.A.C.T. / Sinner’s Circle)',
          subtitle: 'Why Contact Time and Chemical Dilution Matter',
          bulletPoints: [
            'T — Time: Every disinfectant requires a specific Contact Time (e.g., 30 seconds to 5 minutes) sitting wet on the surface to kill bacteria. Wiping it off after 2 seconds leaves bacteria alive!',
            'A — Action: Physical scrubbing with a color-coded brush or pad breaks up sticky bacterial biofilms.',
            'C — Chemical Concentration: Too weak = fails to kill bacteria; Too strong = leaves toxic chemical residue in food. Always use calibrated dosing pumps and test strips.',
            'T — Temperature: Warm water (+45°C–+55°C) melts fat, while water above +50°C causes chlorine bleach to evaporate.'
          ],
          keyTakeaway:
            'Always leave food-safe disinfectant on the surface for the manufacturer’s full Contact Time before rinsing or air-drying.'
        },
        {
          slideNumber: 4,
          title: 'Managing the Master Cleaning Schedule (SSOPs)',
          subtitle: 'What, Who, When, How & Verification',
          bulletPoints: [
            'A Master Cleaning Schedule (Sanitation Standard Operating Procedure — SSOP) lists every piece of equipment and room in the facility:',
            '• WHAT item is to be cleaned (e.g., Meat Slicer, Walk-in Chiller, Floor Drains, Canopy Filters).',
            '• WHO is responsible for cleaning it.',
            '• WHEN (Frequency): Clean-as-you-go, end of every shift, daily, or weekly.',
            '• HOW to clean it (step-by-step dismantling, safety lock-out, chemical name & dilution rate, contact time, and safety PPE).',
            '• WHO verifies and signs off that it is clean.'
          ],
          keyTakeaway:
            'Always unplug electrical machines (slicers, mixers, mincers) before dismantling them for cleaning!'
        },
        {
          slideNumber: 5,
          title: 'Color-Coded Cleaning Equipment (Mops, Buckets & Brushes)',
          subtitle: 'Never Use a Washroom Mop in the Kitchen!',
          bulletPoints: [
            'Just like chopping boards, mops, buckets, brooms, and squeegees must be color-coded by area:',
            '• Red Mops/Buckets: Staff Toilets, Washrooms & Changing Rooms.',
            '• Green / Blue Mops/Buckets: Food Preparation & Cooking Areas.',
            '• Yellow Mops/Buckets: Dishwashing / Scullery & Waste Areas.',
            'After cleaning, wash mops and brushes in hot disinfectant, shake dry, and hang them upside-down off the floor on a wall rack.'
          ],
          keyTakeaway:
            'Never leave dirty mops soaking in a bucket of stagnant water overnight—it becomes a breeding soup for bacteria.'
        },
        {
          slideNumber: 6,
          title: 'Hygienic Waste Management Inside & Outside',
          subtitle: 'Removing Food Waste Before It Attracts Pests',
          bulletPoints: [
            'Internal Bins: Foot-pedal operated, lidded, washable bins lined with strong polythene bags; emptied whenever 75% full and at the end of every shift.',
            'External Waste Compound: Located away from raw material receiving doors, on a washable concrete pad with drainage, with heavy closed dumpster lids locked at all times.',
            'Wash hands thoroughly after handling garbage bags or wheelie bins.'
          ],
          keyTakeaway:
            'Overflowing bins and open external dumpsters are the #1 magnet for flies, rats, and cockroaches.'
        },
        {
          slideNumber: 7,
          title: 'Integrated Pest Management (IPM) — The 3 Lines of Defense',
          subtitle: 'Exclusion, Restriction & Destruction',
          bulletPoints: [
            '1st Line — Exclusion (Pest-Proofing the Building): Seal all holes around pipes, keep external doors closed with brush/rubber strips (< 3 mm gap), fit fine mesh fly screens on windows, and keep drain covers on.',
            '2nd Line — Restriction (Good Housekeeping): Store all food in lidded containers off the floor, clean up spills immediately, and keep stores dry so pests have zero food or water.',
            '3rd Line — Destruction (Monitoring & Eradication): Use UV glue-board fly killers and a licensed Pest Control Contractor with a site bait-map.'
          ],
          keyTakeaway:
            'Pest control is 80% good housekeeping and building proofing, and 20% traps and contractor visits.'
        },
        {
          slideNumber: 8,
          title: 'Spotting Signs of Rodents, Cockroaches & Stored-Product Insects',
          subtitle: 'What Supervisors Must Look For During Daily Walks',
          bulletPoints: [
            'Rats & Mice: Dark spindle-shaped droppings, gnaw marks on sacks/cables/doors, greasy smear marks along base of walls, footprints in dust, and ammonia smell.',
            'Cockroaches: Dark pepper-like droppings, brown egg cases (oothecae) behind warm motors/fridges, and unpleasant almond-like odor.',
            'Flies & Stored-Product Weevils: Maggots near drains/bins, webbing or tiny holes in flour and grain sacks.',
            'If you spot any live pest or droppings in a food room: Quarantine and discard contaminated food, wash and disinfect all surfaces, and call the pest contractor immediately.'
          ],
          keyTakeaway:
            'Check behind warm refrigerator motors, under sinks, and in dark store corners weekly using a bright flashlight.'
        }
      ]
    },
    {
      id: 'fs3-mod-5',
      moduleNumber: 5,
      title: 'Supervisory Auditing, Staff Training, Food Safety Law & Due Diligence',
      estimatedMinutes: 35,
      overview:
        'Simple presentation on how to train and coach kitchen/factory teams, conduct daily supervisory inspections, cooperate with Environmental Health / Food Authority Officers, understand enforcement notices, and maintain Legal Due Diligence.',
      internationalClauses: [
        'Food Safety Legislation, Enforcement Powers & Legal Due Diligence'
      ],
      keyPrinciples: [
        'Supervisors must deliver induction training before new hires touch food, refresher training annually, and on-the-job coaching whenever procedures change.',
        'Food Safety Enforcement Officers (Inspectors) have the legal right to enter food premises unannounced, take samples/photos, inspect records, seize unsafe food, and issue Improvement or Prohibition Notices.',
        'A Statutory Due Diligence Defense requires proving with signed records that the business took all reasonable precautions to prevent a food safety offense.',
        'Daily Supervisory Walkthroughs and honest record-keeping ensure your facility is audit-ready 365 days a year.'
      ],
      criticalControlParameters: [
        {
          parameter: 'New Starter Food Hygiene Induction Rule',
          standardLimit: '100% of new, temporary, or agency staff receive basic hygiene & allergen induction BEFORE starting work',
          correctiveProtocol: 'Never place an untrained worker on a food line without first completing induction and medical screening.'
        },
        {
          parameter: 'Cooperation with Regulatory Food Safety Inspectors',
          standardLimit: 'Immediate polite access, honest records presentation, and prompt action on any inspector findings',
          correctiveProtocol: 'Obstructing an authorized Food Safety Inspector is a criminal offense.'
        }
      ],
      practicalChecklist: [
        'Maintain an up-to-date Staff Training Matrix signed by both the employee and the trainer.',
        'Conduct a daily 15-minute Supervisory Hygiene & Temperature Walkthrough across all areas.',
        'Ensure all daily logbooks (Receiving, Fridges, Cooking, Cooling, Cleaning, Pest Control) are signed and archived neatly.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'How to Train & Motivate Your Food Handling Team',
          subtitle: 'Turning Knowledge Into Everyday Safe Habits',
          bulletPoints: [
            'Induction Training (Day 1 before touching food): Cover handwashing, uniform rules, illness reporting (48-hour rule), allergen awareness, and fire/safety rules.',
            'Job-Specific Training: Teach cooks how to probe temperatures and dishwashers how to check 82°C rinse / 3-sink chemical levels.',
            'Refresher Training: Repeat food safety training at least once a year and whenever a mistake or audit finding occurs.',
            'Keep signed Training Records showing the date, topics covered, trainer name, and employee signature.'
          ],
          keyTakeaway:
            'If a staff member’s training is not signed and documented, an auditor treats them as untrained.'
        },
        {
          slideNumber: 2,
          title: 'Conducting Daily & Weekly Supervisory Inspections',
          subtitle: 'Being Your Own Toughest Inspector',
          bulletPoints: [
            'Do not wait for the Food Authority or QA Auditor to find dirty equipment or expired food.',
            'Use a simple 1-Page Daily Supervisor Inspection Checklist:',
            '• Staff uniforms, hairnets, nails, and handwash stations.',
            '• Chiller and freezer temperatures + FEFO date labels + raw/cooked separation.',
            '• Cooking, cooling, and hot-holding probe logs.',
            '• Cleanliness under tables, inside slicers, and around floor drains.'
          ],
          keyTakeaway:
            'A 15-minute daily supervisory inspection keeps standards high across every shift.'
        },
        {
          slideNumber: 3,
          title: 'Powers of Food Authority / Environmental Health Officers',
          subtitle: 'What Regulatory Inspectors Are Legally Authorized to Do',
          bulletPoints: [
            'Authorized Food Safety Officers have the legal right to:',
            '• Enter and inspect any food business at any reasonable hour WITHOUT prior appointment.',
            '• Inspect food, equipment, stores, and written/digital HACCP records.',
            '• Take food samples, surface swabs, and photographic evidence.',
            '• Detain or seize food that is unfit for human consumption.',
            '• Serve legal enforcement notices or close down dangerous premises.'
          ],
          keyTakeaway:
            'Always verify the inspector’s official ID badge, accompany them politely, and provide requested records promptly.'
        },
        {
          slideNumber: 4,
          title: 'Understanding Legal Enforcement Notices',
          subtitle: 'Hygiene Improvement Notice vs. Emergency Prohibition Notice',
          bulletPoints: [
            'Hygiene Improvement Notice (Corrective Notice): Issued when a legal standard is not met (e.g., broken chiller seal, cracked tiles, missing training records) giving a set deadline (e.g., 14 to 28 days) to fix the defect while staying open.',
            'Hygiene Emergency Prohibition Notice (Immediate Closure / Sealing): Issued when there is an imminent risk of injury to health (e.g., active rat/cockroach infestation in the kitchen, sewage backup, or no running water). The business must STOP operating immediately until cleared!'
          ],
          keyTakeaway:
            'An Improvement Notice gives a deadline to fix a defect; an Emergency Prohibition Notice closes the operation immediately.'
        },
        {
          slideNumber: 5,
          title: 'Penalties for Breaching Food Safety Law',
          subtitle: 'Why Compliance Protects Both the Business and Individuals',
          bulletPoints: [
            'Selling unsafe, contaminated, or mislabeled food can lead to:',
            '• Heavy financial fines and confiscation of stock.',
            '• Immediate suspension or revocation of the Food Business License.',
            '• Public "Name and Shame" closure notices that ruin customer trust.',
            '• Personal criminal prosecution and imprisonment for owners/managers in cases of gross negligence or fatal allergen/poisoning incidents.'
          ],
          keyTakeaway:
            'Strong daily food safety management protects consumers, workers, and your career.'
        },
        {
          slideNumber: 6,
          title: 'Proving "Due Diligence" in Court or Audits',
          subtitle: 'How Your Daily Logs Protect You',
          bulletPoints: [
            'Under Food Safety Law, the primary legal defense is Due Diligence—proving that you took "all reasonable precautions and exercised all due diligence" to avoid committing the offense.',
            'To prove Due Diligence, you need 3 things:',
            '• A written HACCP / Food Safety System.',
            '• Positive action (staff training, approved suppliers, calibrated probes, pest control contracts).',
            '• Honest, signed daily monitoring and corrective action records.'
          ],
          keyTakeaway:
            'No records = No Due Diligence defense. Keep your logs accurate, honest, and signed every shift.'
        },
        {
          slideNumber: 7,
          title: 'Handling Customer Complaints & Product Recalls',
          subtitle: 'Turning Complaints Into System Improvements',
          bulletPoints: [
            'Log every customer complaint (foreign object, off-taste, packaging defect, or alleged illness) in the Customer Complaint Register.',
            'Check the batch code, inspect retained reference samples, and review the shift’s HACCP and cleaning logs.',
            'If a serious safety defect affects other packs in the market, initiate an immediate Withdrawal or Recall and notify management and regulators.'
          ],
          keyTakeaway:
            'Investigate every complaint within 24 hours to ensure no wider batch safety risk exists.'
        },
        {
          slideNumber: 8,
          title: 'Course Summary & Exam Readiness',
          subtitle: 'Ready for the Food Safety Level 03 Final Assessment',
          bulletPoints: [
            'You have completed all 5 Modules of Food Safety Level 03:',
            '• Module 1: Food Microbiology, FATTOM & Pathogens',
            '• Module 2: Safe Temperatures (Delivery, Storage, Cooking, Cooling & Holding)',
            '• Module 3: Cross-Contamination, Color-Coding, Allergens & Personal Hygiene',
            '• Module 4: Premises Design, 6-Step Cleaning, Waste & Pest Control',
            '• Module 5: Supervisory Inspections, Food Law & Due Diligence'
          ],
          keyTakeaway:
            'Click "Complete Course & Start 40-MCQ Final Exam" below (60% passing score = 24/40 correct).'
        }
      ]
    }
  ],
  coreExamPool: [
    {
      q: 'What are the 6 conditions bacteria need to multiply (known by the acronym FATTOM)?',
      options: [
        'Food, Acidity, Time, Temperature, Oxygen, and Moisture',
        'Fire, Air, Tables, Trays, Oil, and Milk',
        'Freezing, Acid, Testing, Training, Ovens, and Metal',
        'Flour, Apples, Tea, Tomatoes, Onions, and Meat'
      ],
      correctIndex: 0,
      explanation: 'FATTOM stands for Food, Acidity, Time, Temperature, Oxygen, and Moisture.'
    },
    {
      q: 'Which of the following is classified as a "High-Risk Ready-to-Eat (RTE) Food"?',
      options: [
        'Cooked sliced chicken breast and cooked boiled rice',
        'Dry uncooked wheat flour',
        'Refined white sugar in a sealed jar',
        'Pure vegetable cooking oil'
      ],
      correctIndex: 0,
      explanation: 'Cooked meat and cooked rice are moist, protein/starch-rich Ready-to-Eat foods that support rapid bacterial growth if temperature-abused.'
    },
    {
      q: 'Why must staff NEVER wash raw chicken under a running tap in a kitchen sink?',
      options: [
        'Splashing water droplets spread Campylobacter and Salmonella bacteria up to 80 cm onto surrounding tables, utensils, and Ready-to-Eat foods',
        'Because water makes chicken heavier',
        'Because chicken is already sterile',
        'Because water ruins the sink drain'
      ],
      correctIndex: 0,
      explanation: 'Washing raw poultry splashes Campylobacter and Salmonella aerosols across nearby surfaces; thorough cooking (≥ 75°C) kills the bacteria safely.'
    },
    {
      q: 'Which foodborne pathogen can continue to grow slowly even inside a refrigerator at +1°C to +4°C?',
      options: [
        'Listeria monocytogenes',
        'Salmonella Typhi',
        'Campylobacter jejuni',
        'E. coli O157'
      ],
      correctIndex: 0,
      explanation: 'Listeria monocytogenes is psychrotrophic (cold-tolerant) and can multiply slowly at refrigeration temperatures (+1°C to +4°C).'
    },
    {
      q: 'Can you tell if food is contaminated with food poisoning bacteria (such as Salmonella or E. coli) by looking at it or smelling it?',
      options: [
        'No — pathogenic food poisoning bacteria do NOT change the appearance, smell, or taste of food',
        'Yes — contaminated food always turns bright green',
        'Yes — it always smells like vinegar',
        'Yes — it always tastes bitter'
      ],
      correctIndex: 0,
      explanation: 'Unlike spoilage bacteria, pathogenic bacteria do not alter taste, smell, or appearance.'
    },
    {
      q: 'What reading must a calibrated digital probe thermometer show when placed in a 50:50 crushed ice and water slurry?',
      options: [
        '0.0°C (within ±0.5°C to ±1.0°C)',
        '+10.0°C',
        '-18.0°C',
        '+25.0°C'
      ],
      correctIndex: 0,
      explanation: 'Melting ice-water slurry has a fixed reference temperature of 0.0°C.'
    },
    {
      q: 'What is the difference between a Detergent and a Disinfectant?',
      options: [
        'A Detergent removes grease and dirt; a Disinfectant kills bacteria to a safe level on a pre-cleaned surface',
        'A Detergent kills spores; a Disinfectant adds grease',
        'They are identical',
        'Disinfectants work best on thick layers of grease without washing'
      ],
      correctIndex: 0,
      explanation: 'Detergents emulsify grease and soil, while disinfectants kill microorganisms once grease has been removed.'
    },
    {
      q: 'When an inspector serves a "Hygiene Emergency Prohibition Notice", what must the food business do?',
      options: [
        'Stop operating the affected premises or equipment IMMEDIATELY because there is an imminent risk to public health',
        'Continue operating for 6 months',
        'Ignore the notice',
        'Only change the menu prices'
      ],
      correctIndex: 0,
      explanation: 'An Emergency Prohibition Notice requires immediate closure/stoppage due to imminent risk of injury to health.'
    }
  ]
};

// ============================================================================
// 4. FOOD SAFETY LEVEL 04 (MANAGING FOOD SAFETY IN MANUFACTURING & CATERING)
// ============================================================================
export const FOOD_SAFETY_LEVEL_04_COURSE: InternationalTrainingCourse = {
  id: 'cert-2026-food-safety-level-04',
  code: 'FS-L4',
  title: 'Food Safety Level 04',
  levelBadge: 'Simple Presentation Course (05 Modules · 40 Slides · 40 MCQs · 60% Pass)',
  accreditationStandard:
    'RQF / Highfield Level 4 Award in Managing Food Safety & Hygiene • Presentation Course',
  duration: '05 Presentation Modules (40 Slides) + 40-MCQ Final Exam',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Executive Managerial Slide Presentation Course on Food Safety Level 04 for Operations Managers, Factory Managers, Executive Chefs, and QA Heads. Covers Advanced Foodborne Pathogens & Outbreak Epidemiology, Hygienic Facility Engineering & High-Care Zoning, Advanced CIP/Sanitation Chemistry & Environmental Monitoring (Zones 1–4), Supplier Quality Assurance & Laboratory Governance, and Food Safety Culture, Auditing & Crisis Leadership.',
  modules: [
    {
      id: 'fs4-mod-1',
      moduleNumber: 1,
      title: 'Advanced Food Microbiology, Toxins, Viruses & Outbreak Investigation',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on managing complex microbiological risks (infectious dose, incubation periods, heat-stable toxins, water activity, pH hurdles) and leading epidemiological outbreak investigations.',
      internationalClauses: [
        'Level 4 Advanced Food Microbiology & Outbreak Forensics'
      ],
      keyPrinciples: [
        'Hurdle Technology combines multiple preservation barriers (Temperature, pH < 4.6, Water Activity aw < 0.85, Salt/Sugar, Vacuum/MAP packaging, and Preservatives) so pathogens cannot survive or multiply.',
        'Low-Acid Canned/Vacuum Foods (pH > 4.6, aw > 0.85) require strict control of anaerobic Clostridium botulinum (using ≥ 121.1°C retort for 3 mins, or ≥ 3.5% salt / ≤ 10 days shelf-life at ≤ 3°C).',
        'During a suspected foodborne illness outbreak, the Incubation Period (time from eating to symptoms) and main symptoms (vomiting vs. fever/bloody diarrhea) point to the likely pathogen.',
        'Epidemiological Attack Rate % calculates the percentage of diners who ate a specific dish and became ill compared to those who did not eat it.'
      ],
      criticalControlParameters: [
        {
          parameter: 'pH and Water Activity (aw) Safety Hurdles',
          standardLimit: 'pH ≤ 4.6 blocks Clostridium botulinum growth; Water Activity aw ≤ 0.85 blocks bacterial growth',
          correctiveProtocol: 'Quarantine any acidified sauce, pickle, or sushi rice batch that fails pH verification before release.'
        },
        {
          parameter: 'Vacuum-Packed & Sous-Vide Chilled Shelf-Life Control',
          standardLimit: 'Store at ≤ +3°C with max 10-day shelf life unless thermal kill (90°C for 10m) or aw/pH/nitrite hurdle is validated',
          correctiveProtocol: 'Never assign > 10 days chilled shelf life to vacuum-packed foods without scientific C. botulinum validation.'
        }
      ],
      practicalChecklist: [
        'Review pH and Water Activity (aw) specifications for all ambient and chilled sauces, dressings, and bakery fillings.',
        'Verify that vacuum-packing and Modified Atmosphere Packaging (MAP) machines are segregated between raw and RTE products.',
        'Ensure the 72-hour Reference Sample Bank and Outbreak Investigation Protocol are ready at all times.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'What is "Hurdle Technology" in Food Preservation?',
          subtitle: 'Combining Multiple Barriers to Stop Bacterial Growth',
          bulletPoints: [
            'Instead of relying on just one extreme treatment, Hurdle Technology puts multiple hurdles in front of microorganisms so they cannot jump over all of them:',
            '• Hurdle 1: Thermal Treatment (Cooking / Pasteurization)',
            '• Hurdle 2: Acidity (Lowering pH below 4.6 using vinegar, citric acid, or lactic fermentation)',
            '• Hurdle 3: Reduced Water Activity (Binding water with salt or sugar so aw < 0.85)',
            '• Hurdle 4: Chilled Storage (≤ +4°C) and Modified Atmosphere Packaging (CO2/N2).'
          ],
          keyTakeaway:
            'If you reduce salt, sugar, or acid in a recipe for health reasons, you have weakened a safety hurdle and must re-validate shelf life!'
        },
        {
          slideNumber: 2,
          title: 'Critical pH and Water Activity (aw) Thresholds',
          subtitle: 'Key Numbers Every Level 04 Manager Must Know',
          bulletPoints: [
            'Pure distilled water has a Water Activity (aw) of 1.00. Fresh meat/milk is ~0.99.',
            'aw ≤ 0.85: Stops growth of pathogenic bacteria (including Staphylococcus aureus aerobic growth).',
            'aw ≤ 0.60: Stops ALL microbial growth (including osmophilic yeasts and xerophilic molds).',
            'pH ≤ 4.6: The critical acidification boundary—blocks germination and neurotoxin production of Clostridium botulinum (and pH ≤ 4.1 is used for acidified sushi rice).'
          ],
          keyTakeaway:
            'Remember the two golden intrinsic boundaries: pH ≤ 4.6 and Water Activity (aw) ≤ 0.85.'
        },
        {
          slideNumber: 3,
          title: 'Controlling Non-Proteolytic Clostridium botulinum in Vacuum Packs',
          subtitle: 'Why Vacuum Packing & Sous-Vide Need Special Rules',
          bulletPoints: [
            'Vacuum packing and Sous-Vide remove oxygen, which stops aerobic spoilage bacteria—making food look fresh longer.',
            'However, Clostridium botulinum is an ANAEROBE (it loves zero-oxygen vacuum packs!), and Type E / non-proteolytic strains can grow slowly at temperatures down to +3.3°C!',
            'Safety Rule for Chilled Vacuum-Packed Foods: Either (1) Keep strictly at ≤ +3°C and limit shelf life to ≤ 10 days, OR (2) Heat to ≥ +90°C for 10 minutes in the pack, OR (3) Maintain pH ≤ 5.0 / Salt ≥ 3.5% / aw ≤ 0.97.'
          ],
          keyTakeaway:
            'Never give vacuum-packed chilled food more than 10 days shelf life unless it has a validated 90°C/10m cook or pH/salt hurdle.'
        },
        {
          slideNumber: 4,
          title: 'Matching Symptoms & Incubation Periods to Pathogens',
          subtitle: 'How Managers & Doctors Identify the Cause of an Outbreak',
          bulletPoints: [
            'Very Short Incubation (1 to 6 Hours — Sudden Vomiting, No Fever): Pre-formed heat-stable toxin from Staphylococcus aureus (handled cooked meats/cream cakes) or Bacillus cereus emetic toxin (cooked rice).',
            'Medium Incubation (8 to 22 Hours — Watery Diarrhea & Cramps): Clostridium perfringens (slow-cooled gravies, stews, large meat joints).',
            'Longer Incubation (12 to 72 Hours — Diarrhea, Fever, Vomiting): Salmonella, Campylobacter, Norovirus, or E. coli O157.',
            'Very Long Incubation (3 to 70 Days): Listeria monocytogenes or Hepatitis A (15–50 days).'
          ],
          keyTakeaway:
            'Vomiting within 1–6 hours of eating points to a pre-formed toxin (S. aureus or B. cereus); diarrhea 12–72 hours later points to bacterial/viral infection.'
        },
        {
          slideNumber: 5,
          title: 'Calculating Attack Rate (%) in Outbreak Investigations',
          subtitle: 'Finding Which Menu Item Caused the Illness',
          bulletPoints: [
            'When investigating a banquet or cafeteria outbreak, interview both people who got sick AND people who stayed healthy.',
            'Calculate the Attack Rate (AR %) for each dish:',
            'Attack Rate % = (Number of Sick People Who Ate the Dish ÷ Total People Who Ate the Dish) × 100.',
            'The dish with the highest Attack Rate among eaters (and lowest Attack Rate among non-eaters) is the contaminated vehicle!'
          ],
          keyTakeaway:
            'Compare the Attack Rate of those who ate each dish vs. those who did not eat it to pinpoint the exact source of food poisoning.'
        },
        {
          slideNumber: 6,
          title: 'Controlling Parasites in Fish & Meat',
          subtitle: 'Freezing & Cooking Rules for Parasite Destruction',
          bulletPoints: [
            'Anisakis simplex (Parasitic worms in wild raw fish used for sushi/ceviche): Must be blast-frozen to ≤ -20°C for at least 24 hours (or ≤ -20°C for 7 days / ≤ -35°C for 15 hours under FDA/EU rules) to kill larvae.',
            'Cryptosporidium & Giardia: Protozoan parasites spread via contaminated water (resistant to normal chlorine; controlled by water filtration, UV, or boiling ≥ 1 minute).',
            'Trichinella & Toxoplasma: Eliminated by cooking meat thoroughly to ≥ +70°C/+75°C.'
          ],
          keyTakeaway:
            'Any fish intended to be served raw or lightly marinated (sushi/sashimi) must have a validated parasite-freezing record (≤ -20°C).'
        },
        {
          slideNumber: 7,
          title: 'Scombroid Fish Poisoning (Histamine) & Marine Biotoxins',
          subtitle: 'Chemical Toxins in Seafood That Cooking Cannot Destroy',
          bulletPoints: [
            'Scombroid Fish (Tuna, Mackerel, Mahi-Mahi, Sardines) naturally contain high levels of the amino acid histidine.',
            'If these fish are left above +4°C even for a few hours, bacteria convert histidine into Histamine (Scombrotoxin).',
            'Eating high-histamine fish causes flushing, rash, headache, and breathing trouble within 30 minutes—and histamine CANNOT be destroyed by cooking, canning, or freezing!',
            'Always receive and store fresh fish packed in melting ice at ≤ +2°C.'
          ],
          keyTakeaway:
            'Histamine in temperature-abused tuna survives all cooking and retorting—strict cold chain (≤ +2°C on ice) from catch to kitchen is the only defense.'
        },
        {
          slideNumber: 8,
          title: 'Low-Moisture Food Safety (Salmonella Survival)',
          subtitle: 'Why Dry Powders, Chocolate, Tahini & Spices Can Cause Outbreaks',
          bulletPoints: [
            'Although Salmonella cannot MULTIPLY in dry foods (aw < 0.85), it can SURVIVE for months or years in milk powder, infant formula, chocolate, peanut butter, tahini, and black pepper!',
            'Moreover, Salmonella in dry/fatty foods becomes extra heat-resistant.',
            'Rule for Dry Processing Zones: Keep dry mixing and packing zones 100% DRY—never use high-pressure water hoses in dry powder areas, as moisture wakes up dormant Salmonella!'
          ],
          keyTakeaway:
            'Keep dry powder/bakery/chocolate zones completely dry (use dry vacuuming and alcohol wipes) to prevent Salmonella growth.'
        }
      ]
    },
    {
      id: 'fs4-mod-2',
      moduleNumber: 2,
      title: 'Hygienic Facility Engineering, High-Care Zoning & Utilities Management',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on factory/kitchen zoning (Low-Risk vs. High-Care vs. High-Risk), positive air pressure, drainage flow direction, hygienic equipment welding, and water/air/steam utility controls.',
      internationalClauses: [
        'ISO/TS 22002-1 & 22002-2 Hygienic Engineering & Facility Zoning'
      ],
      keyPrinciples: [
        'Facilities handling Ready-to-Eat foods must segregate Low-Risk (raw/unwashed) areas from High-Care / High-Risk (cooked/RTE) areas using physical walls, barrier changing rooms, and pass-through ovens/chillers.',
        'High-Care RTE rooms require Positive Air Pressure (+5 to +15 Pascals) with HEPA/F8 filtered air so unfiltered air cannot enter when doors open.',
        'Floor drainage must flow from High-Care (Clean) toward Low-Risk (Dirty) areas, never the reverse.',
        'Water, ice, culinary steam, and compressed air that touch food must be microbiologically and chemically tested to potable standards.'
      ],
      criticalControlParameters: [
        {
          parameter: 'High-Care Positive Air Pressure & Barrier Changing Protocol',
          standardLimit: '+5 to +15 Pa positive air pressure; captive footwear & dedicated color-coded coat/hairnet change at barrier',
          correctiveProtocol: 'Repair air-handling filters immediately if positive pressure drops; never prop barrier doors open.'
        },
        {
          parameter: 'Directional Floor Drainage Rule',
          standardLimit: 'Effluent flows from High-Care/Clean zones toward Low-Risk/Dirty zones with trapped gullies',
          correctiveProtocol: 'Never allow a drain line from a raw meat or toilet area to pass unsealed through a High-Care room.'
        }
      ],
      practicalChecklist: [
        'Verify that High-Care / RTE assembly rooms maintain positive air pressure and ambient temperatures ≤ +12°C–+15°C.',
        'Check that barrier changing rooms enforce captive boot changes and handwashing before entering High-Care.',
        'Review annual potable water, ice machine, and compressed air microbiological test certificates.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Understanding Facility Hygiene Zones',
          subtitle: 'Non-Food, Low-Risk, High-Care & High-Risk RTE Zones',
          bulletPoints: [
            'Non-Food Zone: Offices, exterior yards, engineering workshops, and boilers.',
            'Enclosed Product / Ambient Zone: Warehouses storing sealed cartons and cans.',
            'Low-Risk Zone: Raw meat prep, unwashed vegetable washing, and pre-cooking areas (products here will undergo a thermal kill step later).',
            'High-Care / High-Risk RTE Zone: Where cooked, pasteurized, or washed Ready-to-Eat foods are cooled, sliced, assembled, or packed before sealing.'
          ],
          keyTakeaway:
            'Staff, trolleys, and utensils from Low-Risk raw zones must NEVER enter High-Care RTE zones without going through a full hygiene barrier.'
        },
        {
          slideNumber: 2,
          title: 'Designing a High-Care Barrier Changing Room',
          subtitle: 'Step-by-Step Entry Protocol for High-Care Staff',
          bulletPoints: [
            'Entering a High-Care RTE zone requires a physical "Sit-Over Bench" barrier:',
            '• Put on hairnet and beard snood first.',
            '• Remove outdoor/low-risk shoes on the "Dirty Side" of the bench, swing legs over the barrier bench, and step into Captive High-Care Boots (which never leave the High-Care zone).',
            '• Wash and dry hands at the barrier basin.',
            '• Put on a dedicated High-Care color-coded coat/smock and sanitize hands.'
          ],
          keyTakeaway:
            'Captive boots must stay inside the High-Care zone permanently and be washed in a boot-washer at the end of each shift.'
        },
        {
          slideNumber: 3,
          title: 'Air Handling, Positive Pressure & Condensation Control',
          subtitle: 'Preventing Airborne Contamination & Roof Drips',
          bulletPoints: [
            'Why Positive Air Pressure? By supplying slightly more filtered air into the High-Care room than is extracted (+5 to +15 Pa), air blows OUTWARD when a door opens—blocking dust, flies, and mold spores from entering.',
            'Air Filtration: Air entering High-Care rooms passes through fine F8 / HEPA filters maintained on a regular replacement schedule.',
            'Condensation Control: Overhead chiller coils and cold water pipes must be insulated and fitted with plumbed drip trays—roof condensation dripping onto open food is a major source of Listeria!'
          ],
          keyTakeaway:
            'Condensation droplets hanging above open food are a Critical Audit Failure—keep extractor fans and chiller defrost drains clear.'
        },
        {
          slideNumber: 4,
          title: 'Floor Slopes & Directional Drainage Engineering',
          subtitle: 'Keeping Wastewater Moving Away From Clean Food',
          bulletPoints: [
            'Floors must slope evenly (1:50 to 1:100 gradient) toward stainless-steel drainage channels so no stagnant water puddles remain on the floor.',
            'Directional Flow Rule: Underground drains must ALWAYS flow from High-Care (Cleanest) → toward Low-Risk (Dirty) → to main sewer.',
            'If a drain flowed from Raw Meat through High-Care and got blocked, raw meat sewage would back up onto the High-Care floor!',
            'Fit all drains with removable perforated strainer baskets and water-seal P-traps.'
          ],
          keyTakeaway:
            'Never clean floor drains with high-pressure hoses during active food production, as aerosols spray Listeria onto tables!'
        },
        {
          slideNumber: 5,
          title: 'Hygienic Equipment Design Principles (EHEDG / 3-A)',
          subtitle: 'What to Check Before Buying a New Food Machine',
          bulletPoints: [
            'Food-Contact Surfaces: Smooth, non-toxic 304 or 316 stainless steel with continuous ground welds (no rough spot-welds, rivets, or open screw threads).',
            'Zero Dead-Legs: Pipes must not have T-junction "dead ends" where stagnant milk or sauce sits untouched by CIP cleaning.',
            'Self-Draining: Tanks and vats must have sloped bottoms so 100% of liquid drains out after washing.',
            'Hollow Frameworks: Machine frames must be hermetically sealed or open-profile angle iron—hollow square tubes crack and harbor Listeria inside!'
          ],
          keyTakeaway:
            'Involve the QA/Food Safety Manager before purchasing any new machine to verify it can be dismantled and cleaned easily.'
        },
        {
          slideNumber: 6,
          title: 'Managing Potable Water, Ice & Culinary Steam',
          subtitle: 'Testing the Invisible Ingredients in Your Facility',
          bulletPoints: [
            'Water & Ice: Ice is a food! Plumbed ice machines must be emptied, descaled, and sanitized monthly, with ice scoops stored in an external sanitized holder (never left buried inside the ice!).',
            'Test water and ice at an accredited lab at least every 6–12 months for Total Coliforms (0 CFU/100mL) and E. coli (0 CFU/100mL).',
            'Culinary Steam & Compressed Air: Steam or compressed air that touches food or blows open packaging bags must use food-grade boiler chemicals and 0.01-micron sterile air filters.'
          ],
          keyTakeaway:
            'Treat your ice machine like a High-Risk food container—sanitize it monthly and never store the ice scoop inside the ice bin.'
        },
        {
          slideNumber: 7,
          title: 'Preventive Maintenance & Post-Maintenance Hygiene Clearance',
          subtitle: 'Controlling Engineering Risks on the Production Line',
          bulletPoints: [
            'Engineers bringing dirty toolboxes, metal filings, and black grease onto a food line can contaminate an entire batch.',
            'Maintenance Rules in Food Zones:',
            '• Use ONLY certified Food-Grade Lubricants (NSF H1) on conveyors, mixers, and slicers.',
            '• Count all nuts, bolts, drill bits, and tools before and after the repair (Zero Temporary Repairs with tape, wire, or cardboard!).',
            '• Before restarting the line, QA/Supervisor must inspect, clean, sanitize, and sign the Post-Maintenance Hygiene Clearance Permit.'
          ],
          keyTakeaway:
            'Ban temporary repairs (string, tape, wire, cardboard) on food equipment, and require QA sign-off after every maintenance job.'
        },
        {
          slideNumber: 8,
          title: 'Contractor & Visitor Control in Food Facilities',
          subtitle: 'Ensuring Outsiders Follow Every Hygiene Rule',
          bulletPoints: [
            'External contractors (electricians, plumbers, refrigeration technicians) and visitors must sign a Health & Hygiene Questionnaire at reception.',
            'Provide full visitor protective clothing (coat, hairnet, beard cover, captive overshoes) and escort them at all times.',
            'Never allow a contractor with recent vomiting/diarrhea to enter food production or storage rooms.'
          ],
          keyTakeaway:
            'Contractors and visitors must follow the exact same hygiene and medical screening rules as permanent staff.'
        }
      ]
    },
    {
      id: 'fs4-mod-3',
      moduleNumber: 3,
      title: 'Advanced Sanitation, CIP Systems, Biofilms & Environmental Monitoring (Zones 1–4)',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on automated Clean-In-Place (CIP) engineering, removing bacterial biofilms, chemical sanitizer comparison (Chlorine, Quats, PAA), ATP bioluminescence, and Zone 1–4 Listeria/Salmonella Environmental Monitoring.',
      internationalClauses: [
        'GFSI / ISO 22000 Environmental Monitoring & CIP Validation Standards'
      ],
      keyPrinciples: [
        'Clean-In-Place (CIP) cleans closed pipes and tanks automatically using 5 stages (Pre-Rinse → Caustic Wash → Intermediate Rinse → Acid Wash → Disinfection/Final Rinse) at flow velocity ≥ 1.5 m/s.',
        'Bacterial Biofilms are slimy protective layers secreted by bacteria (especially Listeria and Pseudomonas) on poorly cleaned steel and rubber gaskets that resist normal sanitizer sprays.',
        'An Environmental Monitoring Program (EMP) divides the plant into 4 Hygienic Zones (Zone 1 = Food Contact, Zone 2 = Adjacent Equipment, Zone 3 = Floors/Drains/Walls, Zone 4 = Outside Production) for regular pathogen swabbing.',
        'ATP Bioluminescence swabs measure residual organic matter (food + microbes) in Relative Light Units (RLU) within 15 seconds to verify cleaning before starting production.'
      ],
      criticalControlParameters: [
        {
          parameter: 'CIP Pipeline Flow Velocity, Temperature & Conductivity',
          standardLimit: 'Turbulent flow velocity ≥ 1.5 meters/second; Caustic (1%–2% NaOH at 70°C–80°C); Acid (0.5%–1% HNO3 at 60°C)',
          correctiveProtocol: 'Abort and repeat the CIP cycle automatically if return-line conductivity, temperature, or flow rate drops below setpoint.'
        },
        {
          parameter: 'Zone 1 to 4 Environmental Pathogen Swabbing (Listeria / Salmonella)',
          standardLimit: 'Absent (0 CFU / Negative) in all Zone 1 and Zone 2 swabs; immediate vector-swabbing if Zone 3/4 is positive',
          correctiveProtocol: 'If a Zone 1 (food-contact) swab tests positive for Listeria or Salmonella, quarantine all batches produced on that line and deep-sanitize.'
        }
      ],
      practicalChecklist: [
        'Review daily CIP chart records (return temperature, conductivity, flow velocity, and final rinse pH neutrality).',
        'Verify that rubber gaskets, slicer blades, and O-rings are dismantled weekly for biofilm scrubbing and inspection.',
        'Audit the monthly Zone 1–4 Environmental Swab Map to ensure drains, rollers, and cold-room fans are tested.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'How Automated Clean-In-Place (CIP) Systems Work',
          subtitle: 'The 5-Stage CIP Cycle for Dairy, Beverage & Liquid Plants',
          bulletPoints: [
            'Clean-In-Place (CIP) cleans closed pipelines, homogenizers, pasteurizers, and storage silos without dismantling them:',
            'Stage A — Pre-Rinse: Ambient/warm potable water flushes out loose product residue.',
            'Stage B — Caustic Wash (1%–2% Sodium Hydroxide NaOH at 70°C–80°C): Dissolves fats and proteins.',
            'Stage C — Intermediate Water Rinse: Flushes out caustic soap.',
            'Stage D — Acid Wash (0.5%–1.0% Nitric/Phosphoric Acid at 60°C): Removes mineral scale ("milkstone" / hard water scale).',
            'Stage E — Final Potable Rinse & Thermal/PAA Sanitization (verified by neutral pH / zero conductivity on the return line).'
          ],
          keyTakeaway:
            'Caustic removes fat and protein; Acid removes mineral scale (milkstone)—and turbulent flow (≥ 1.5 m/s) is essential to scrub pipe walls.'
        },
        {
          slideNumber: 2,
          title: 'What Are Bacterial Biofilms & How Do You Destroy Them?',
          subtitle: 'The Hidden Slime Shield That Protects Listeria',
          bulletPoints: [
            'When bacteria sit on a damp surface (like a conveyor belt underside, rubber gasket, or floor drain), they secrete a sticky polysaccharide slime coat called a Biofilm.',
            'Once inside a mature Biofilm, bacteria are up to 1,000 times more resistant to chemical sanitizers!',
            'Simply spraying sanitizer onto a biofilm does NOT kill the bacteria inside.',
            'How to Destroy Biofilms: Dismantle gaskets/parts, scrub physically with alkaline/enzymatic detergent and mechanical friction to break the slime shield, rinse, and then apply disinfectant.'
          ],
          keyTakeaway:
            'Physical scrubbing + enzymatic/alkaline detergent is the only way to break open a bacterial biofilm so sanitizer can reach the germs.'
        },
        {
          slideNumber: 3,
          title: 'Comparing Industrial Disinfectants (Chlorine, Quats, PAA & Alcohol)',
          subtitle: 'Choosing the Right Sanitizer for the Job',
          bulletPoints: [
            'Chlorine (Sodium Hypochlorite — 50 to 200 ppm): Fast, broad-spectrum, low cost; works best at pH 6.0–7.5 and water temp < 48°C, but is corrosive to stainless steel if left un-rinsed and easily inactivated by organic dirt.',
            'QAC / Quats (Quaternary Ammonium — 200 to 400 ppm): Non-corrosive, odorless, leaves residual film; ideal for tables, walls, and cold rooms.',
            'Peracetic Acid (PAA — 100 to 250 ppm): Strong oxidizing sanitizer ideal for CIP systems and cold rooms; breaks down safely into vinegar, water, and oxygen.',
            '70% Isopropyl/Ethyl Alcohol: Evaporates dry with zero water—ideal for dry bakery/powder lines and thermometer probes.'
          ],
          keyTakeaway:
            'Rotate your disinfectants periodically (e.g., Quats during the week, oxidizing PAA/Chlorine on weekends) so bacteria do not build resistance.'
        },
        {
          slideNumber: 4,
          title: 'Rapid Hygiene Verification: ATP Bioluminescence vs. Protein Swabs',
          subtitle: 'Checking Cleanliness in 15 Seconds Before Starting the Line',
          bulletPoints: [
            'Traditional agar plate lab tests take 24 to 48 hours—too slow to tell you if a machine is clean enough to start the morning shift!',
            'ATP Bioluminescence Swabs: Measure Adenosine Triphosphate (ATP—energy molecule found in all food residues and living cells) in 15 seconds, displayed as Relative Light Units (RLU).',
            'If an ATP swab fails (e.g., > 30 RLU), the operator re-washes and re-sanitizes the machine immediately BEFORE any food touches it.',
            'Allergen Protein Swabs: Specifically detect residual protein/allergens after an allergen changeover.'
          ],
          keyTakeaway:
            'ATP swabs give an instant 15-second pass/fail check on cleaning before production starts.'
        },
        {
          slideNumber: 5,
          title: 'The 4-Zone Environmental Monitoring Program (EMP)',
          subtitle: 'Seeking & Destroying Listeria and Salmonella in the Plant',
          bulletPoints: [
            'An Environmental Monitoring Program (EMP) divides the facility into 4 concentric rings (Zones 1 to 4):',
            'Zone 1 (Food-Contact Surfaces): Slicer blades, conveyor belts, filler nozzles, mixing bowls, and utensils.',
            'Zone 2 (Non-Food-Contact Surfaces Immediately Adjacent to Food): Machine frames, control buttons, chiller drip trays, and table legs.',
            'Zone 3 (Surrounding Room Surfaces): Floors, floor drains, walls, door handles, handwash taps, and forklifts inside the production room.',
            'Zone 4 (Areas Outside the Production Room): Locker rooms, corridors, loading docks, and maintenance workshops.'
          ],
          keyTakeaway:
            'Finding and eliminating Listeria in Zone 3 (floor drains) stops it before it ever reaches Zone 1 (food-contact surfaces)!'
        },
        {
          slideNumber: 6,
          title: 'What to Do When an Environmental Swab Tests Positive',
          subtitle: 'Vector Swabbing & Seek-and-Destroy Protocol',
          bulletPoints: [
            'If a Zone 3 (floor drain) swab is positive: Deep-clean and sanitize the area, and take 5 to 10 surrounding "Vector Swabs" (upward toward Zone 2 and Zone 1) across 3 consecutive days until 3 consecutive negative results are achieved.',
            'If a Zone 1 (food-contact surface) swab is positive for Listeria or Salmonella: Immediately STOP the line, quarantine all product batches made on that line, dismantle and deep-sanitize the machine, and perform finished-product pathogen testing.'
          ],
          keyTakeaway:
            'Always require 3 consecutive negative swabs after a positive environmental finding to prove the harborage niche is eliminated.'
        }
      ]
    },
    {
      id: 'fs4-mod-4',
      moduleNumber: 4,
      title: 'Supplier Quality Assurance (SQA), Laboratory Governance & Foreign Body Detection',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on managing risk-based Supplier Approval Programs, interpreting ISO/IEC 17025 laboratory certificates, and managing inline Metal Detectors, X-Ray inspection, optical sorters, and magnets/sieves.',
      internationalClauses: [
        'GFSI Supplier Quality Assurance & Foreign Body Control Standards'
      ],
      keyPrinciples: [
        'Risk-based Supplier Quality Assurance classifies suppliers into High-Risk (requiring GFSI certification or 2nd-party site audit + COA per batch) and Low-Risk (questionnaire + annual review).',
        'All external pathogen, mycotoxin, and chemical residue testing must be performed by an ISO/IEC 17025 accredited laboratory (and internal pathogen labs must be physically isolated from production).',
        'Foreign-body detection devices (Sieves, Rare-Earth Magnets ≥ 10,000 Gauss, Metal Detectors, and X-Ray Inspection systems) must have fail-safe reject mechanisms into locked bins.',
        'Glass and Brittle Plastic Registers must be audited monthly across all production and storage zones.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Metal Detector & X-Ray Fail-Safe Reject Verification',
          standardLimit: 'Hourly test with Fe, Non-Fe, and SS 316 test pieces; automatic rejection into a locked reject bin',
          correctiveProtocol: 'Verify that belt-stop or air-blast reject confirm-sensors work; quarantine back to last good check if failed.'
        },
        {
          parameter: 'ISO/IEC 17025 Laboratory Accreditation & Internal Lab Segregation',
          standardLimit: 'External food safety lab tests accredited to ISO 17025; zero live pathogen culturing inside open food zones',
          correctiveProtocol: 'Never culture Salmonella or Listeria inside an unsealed factory quality office.'
        }
      ],
      practicalChecklist: [
        'Verify that all raw material and primary packaging suppliers have valid approval records and annual performance scores.',
        'Check that the Metal Detector / X-Ray reject bin is kept locked and that only the QA Supervisor holds the key.',
        'Audit the monthly Glass, Brittle Plastic & Ceramic Register and the Knife/Blade Register.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Risk-Based Supplier Quality Assurance (SQA)',
          subtitle: 'Approving and Grading Suppliers Before You Buy',
          bulletPoints: [
            'Classify every raw material and food-contact packaging supplier by Risk:',
            '• High-Risk Ingredients (Raw meat, dairy, eggs, spices, nuts, infant ingredients): Require GFSI Certification (BRCGS, FSSC 22000, IFS, SQF) OR an on-site 2nd-Party Audit by your QA team, plus a Certificate of Analysis (COA) with every delivery.',
            '• Low-Risk Ingredients: Approved via Supplier Questionnaire, product specification, and legal compliance declaration.',
            'Evaluate suppliers annually on delivery temperature compliance, COA pass rate, and zero foreign-body complaints.'
          ],
          keyTakeaway:
            'Maintain a clear emergency Emergency Supplier Approval procedure in case a primary supplier suffers a fire or shortage.'
        },
        {
          slideNumber: 2,
          title: 'Managing Outsourced Processes & Brokers/Agents',
          subtitle: 'Ensuring Traceability Back to the Actual Manufacturer',
          bulletPoints: [
            'If you buy ingredients through a Broker, Trader, or Agent rather than directly from the factory, you must still know and approve the ACTUAL manufacturing site of origin!',
            'A broker’s invoice alone does not tell you if the factory that made the spice or milk powder is hygienic.',
            'Similarly, any subcontracted storage warehouse or transport company must sign a Service Level Agreement (SLA) covering cold-chain temperatures, pest control, and security.'
          ],
          keyTakeaway:
            'Always trace brokered ingredients back to the original manufacturing plant and approve that site.'
        },
        {
          slideNumber: 3,
          title: 'Inline Foreign-Body Controls: Sieves, Filters & Rare-Earth Magnets',
          subtitle: 'Catching Physical Contaminants During Processing',
          bulletPoints: [
            'Sieves & Strainers: Inspect mesh screens before and after every shift. If a wire is broken on a flour sieve at the end of the shift, the missing metal wire is inside today’s dough batch—quarantine the batch!',
            'Rare-Earth Magnets (Neodymium ≥ 10,000–12,000 Gauss): Installed in powder chutes and liquid pipelines to trap fine iron/steel wear particles.',
            'Clean magnet bars on a set schedule, photograph/log any metal shavings found, and test magnet pull-strength annually.'
          ],
          keyTakeaway:
            'A damaged sieve or filter found at the end of a shift requires immediate quarantine of all product made since the start of the shift.'
        },
        {
          slideNumber: 4,
          title: 'Metal Detectors vs. X-Ray Inspection Systems',
          subtitle: 'Comparing Capabilities & Fail-Safe Reject Controls',
          bulletPoints: [
            'Balanced-Coil Metal Detectors: Detect Ferrous (Iron/Steel), Non-Ferrous (Brass/Aluminum/Copper), and Stainless Steel (SS 316 is hardest to detect because it is non-magnetic). Cannot be used on foil-wrapped trays (use Ferrous-in-Foil or X-Ray).',
            'X-Ray Inspection Systems: Detect dense foreign objects based on density—catching Metal, Glass, Calcified Bone, Stone, and Dense Rubber/Plastic even inside aluminum foil or metal cans!',
            'Fail-Safe Reject Bin: Rejected packs must be diverted into a LOCKED reject bin with a photo-eye confirmation sensor.'
          ],
          keyTakeaway:
            'X-Ray detects metal, glass, stone, and dense bone; Metal Detectors detect Fe, Non-Fe, and Stainless Steel.'
        },
        {
          slideNumber: 5,
          title: 'Glass, Brittle Plastic, Knife & Needle Control Registers',
          subtitle: 'Preventing Internal Sharp Object Contamination',
          bulletPoints: [
            'Glass & Brittle Plastic Register: List every essential glass/plastic item in the factory (gauge dials, sight glasses, clock faces, EFK tubes) and inspect them monthly for cracks.',
            'Glass Breakage Procedure: Stop the line immediately, quarantine all open food within the splash radius (typically 3 to 5 meters), discard affected product, sweep up fragments using dedicated red glass-cleanup tools, and get QA sign-off before restarting.',
            'Knife & Blade Register: Issue numbered knives/snap-off blades prohibited; log blade condition at the start and end of every shift.'
          ],
          keyTakeaway:
            'Snap-off utility blades are strictly banned in food plants because broken blade segments easily fall into packaging and food!'
        },
        {
          slideNumber: 6,
          title: 'Laboratory Governance & ISO/IEC 17025 Accreditation',
          subtitle: 'Ensuring Lab Test Results Are Legally & Scientifically Valid',
          bulletPoints: [
            'All critical food safety testing (Salmonella, Listeria, E. coli, Mycotoxins, Pesticides, Water Potability) must be done by a laboratory accredited to ISO/IEC 17025.',
            'If your factory has an on-site microbiology lab, it must be completely isolated from food production with negative air pressure, autoclave sterilization of waste plates, and restricted access.',
            'When sending a finished batch for pathogen testing, follow "Positive Release"—keep the batch on hold in the warehouse until the written lab pass certificate arrives!'
          ],
          keyTakeaway:
            'Under Positive Release, never ship a batch that is undergoing pathogen lab testing until the written negative (pass) report is received.'
        }
      ]
    },
    {
      id: 'fs4-mod-5',
      moduleNumber: 5,
      title: 'Food Safety Management Systems (FSMS), Auditing, KPIs & Executive Leadership',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on integrating GMP, HACCP, VACCP, and TACCP into a complete Food Safety Management System (FSMS), tracking executive KPIs, managing unannounced third-party audits, and leading crisis response.',
      internationalClauses: [
        'GFSI Benchmarking Requirements, ISO 22000 & Level 4 Leadership Standards'
      ],
      keyPrinciples: [
        'A complete Food Safety Management System (FSMS) integrates Prerequisite Programs (GMP/GHP), HACCP, Traceability/Recall, Food Fraud (VACCP), Food Defense (TACCP), and Food Safety Culture.',
        'Managers use trend analysis of KPIs (Right-First-Time %, CCP compliance %, ATP pass %, Foreign-Body Complaints per Million Packs, Audit closure rate) to drive continual improvement.',
        'Unannounced Audit Readiness means every shift operates to audit standard every day, supported by a trained Audit Reception Protocol.',
        'Effective Crisis Management protects consumer health first through rapid quarantine, transparent regulatory notification, and root-cause elimination.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Unannounced Audit Readiness Protocol',
          standardLimit: 'Auditor granted access to production floor within ≤ 30 minutes of arrival at security gate',
          correctiveProtocol: 'Train security and shift managers on the Unannounced Audit SOP so entry is never delayed or refused.'
        },
        {
          parameter: 'Foreign-Body & Food Safety Complaint Trend Analysis',
          standardLimit: 'Monthly pareto/trend review of all complaints with mandatory CAPA for any recurring defect',
          correctiveProtocol: 'Convene a cross-functional engineering and QA team whenever 2+ complaints occur on the same SKU.'
        }
      ],
      practicalChecklist: [
        'Verify that security gate staff and night/weekend shift leaders know the Unannounced Audit Reception Procedure.',
        'Compile the monthly Food Safety KPI Dashboard for Top Management Review.',
        'Complete all 5 modules and proceed to the 40-MCQ Food Safety Level 04 Final Exam.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'The Complete Food Safety Management System (FSMS) House',
          subtitle: 'How PRPs, HACCP, VACCP, TACCP & Culture Fit Together',
          bulletPoints: [
            'Think of your Food Safety Management System (FSMS) as a strong building:',
            '• Foundation: Top Management Commitment & Food Safety Culture.',
            '• Ground Floor: Prerequisite Programs (GMPs, Hygiene, SSOPs, Pest Control, Approved Suppliers).',
            '• Pillars: (1) HACCP (Unintentional Safety Hazards), (2) VACCP (Food Fraud Prevention), (3) TACCP (Food Defense / Site Security), and (4) 4-Hour Traceability & Recall.',
            '• Roof: Internal Auditing, Management Review & Continual Improvement (PDCA).'
          ],
          keyTakeaway:
            'Every pillar of the FSMS House works together to protect consumers and pass international GFSI audits.'
        },
        {
          slideNumber: 2,
          title: 'Managing Unannounced Audits With Confidence',
          subtitle: 'Being Ready Every Single Day of the Year',
          bulletPoints: [
            'Under BRCGS, FSSC 22000, McDonald’s SQMS, and Food Authority rules, unannounced audits are mandatory.',
            'Train your Security Gate: When an auditor arrives and shows their ID, security calls the QA Manager / Senior Shift Manager immediately and gets the auditor onto the shop floor within 15 to 30 minutes.',
            'Refusing entry to an unannounced GFSI or regulatory auditor results in immediate certificate suspension or legal action!'
          ],
          keyTakeaway:
            'Build an everyday culture where "every shift is audit-ready" so unannounced audits are stress-free.'
        },
        {
          slideNumber: 3,
          title: 'Key Performance Indicators (KPIs) for Level 04 Managers',
          subtitle: 'Measuring What Matters on a Monthly Dashboard',
          bulletPoints: [
            'Leading Indicators (Preventive):',
            '• Pre-Op ATP Swab Pass Rate % (Target ≥ 98%)',
            '• Preventive Maintenance On-Time Completion % for CCP Equipment (Target 100%)',
            '• Staff Hygiene & HACCP Training Completion % (Target 100%)',
            'Lagging Indicators (Outcome):',
            '• Customer Complaints per Million Units (CPMU)',
            '• Number of CCP Deviations & Quarantine Batches',
            '• Third-Party Audit Grade & Non-Conformity Count'
          ],
          keyTakeaway:
            'Track both Leading (preventive) and Lagging (outcome) KPIs every month to spot trends early.'
        },
        {
          slideNumber: 4,
          title: 'Document Control & Record Integrity Governance',
          subtitle: 'Eliminating Uncontrolled Forms on the Floor',
          bulletPoints: [
            'Every SOP, recipe card, and daily log sheet must have a Document Code, Version Number, Issue Date, and "Approved By" signature.',
            'When you update an SOP or log sheet from Version 2 to Version 3, collect and remove all old Version 2 copies from the production floor immediately and stamp the archive copy "OBSOLETE".',
            'Never allow operators to use photocopied scrap paper, sticky notes, or outdated log forms.'
          ],
          keyTakeaway:
            'Using an obsolete version of a CCP form on the production floor is a common audit non-conformity—control document versions strictly.'
        },
        {
          slideNumber: 5,
          title: 'Leading Crisis Management & Regulatory Notification',
          subtitle: 'Acting Fast When a Serious Incident Happens',
          bulletPoints: [
            'What triggers the Crisis Management Team? Confirmed pathogen in dispatched food, undeclared allergen label error, tampered product threat, factory fire/flood, or regulatory enforcement notice.',
            'Golden Rules of Crisis Leadership:',
            '• Consumer safety comes first—never hide a known food safety hazard to save money.',
            '• Freeze all warehouse dispatches of the suspect lot within 30 minutes.',
            '• Notify the Certification Body (within 3 working days for recalls) and Food Authority (within 24 hours).'
          ],
          keyTakeaway:
            'Fast, honest containment during a food safety crisis protects human lives and preserves long-term company survival.'
        },
        {
          slideNumber: 6,
          title: 'Course Completion & Final Exam Guide',
          subtitle: 'Ready for the Food Safety Level 04 Final Assessment',
          bulletPoints: [
            'Congratulations on completing all 5 Modules of Food Safety Level 04!',
            'You have mastered Advanced Microbiology & Hurdle Technology, High-Care Facility Engineering, CIP & Zone 1–4 Environmental Monitoring, Supplier & Foreign-Body Controls, and Executive FSMS Leadership.',
            'Click below to start the 40-MCQ Final Exam (60% passing score = 24/40 correct; 75% for Distinction).'
          ],
          keyTakeaway:
            'Review the Key Takeaway boxes on each slide and proceed to your 40-MCQ Final Exam!'
        }
      ]
    }
  ],
  coreExamPool: [
    {
      q: 'What are the critical pH and Water Activity (aw) safety boundaries used in Hurdle Technology to stop Clostridium botulinum and pathogenic bacterial growth?',
      options: [
        'pH ≤ 4.6 and Water Activity (aw) ≤ 0.85',
        'pH = 9.0 and Water Activity = 0.99',
        'pH = 7.0 and Water Activity = 1.00',
        'pH and Water Activity have no effect on bacteria'
      ],
      correctIndex: 0,
      explanation: 'pH ≤ 4.6 prevents Clostridium botulinum growth and toxin formation, while aw ≤ 0.85 prevents pathogenic bacterial growth.'
    },
    {
      q: 'Why must chilled vacuum-packed and Sous-Vide foods be restricted to ≤ 10 days shelf life at ≤ +3°C unless additional thermal or intrinsic hurdles are validated?',
      options: [
        'To prevent growth and neurotoxin production by anaerobic non-proteolytic Clostridium botulinum, which can grow without oxygen down to +3.3°C',
        'Because plastic bags melt after 10 days',
        'Because vacuum packing adds extra oxygen',
        'Vacuum-packed chilled meat can be kept at room temperature for 6 months'
      ],
      correctIndex: 0,
      explanation: 'Non-proteolytic Clostridium botulinum thrives in anaerobic vacuum packs and can grow down to +3.3°C unless controlled by ≤ 10-day shelf life at ≤ +3°C, a 90°C/10m cook, or pH/salt hurdles.'
    },
    {
      q: 'If 15 banquet guests develop sudden projectile vomiting 2.5 hours after eating cream pastries and sliced ham (with no fever), which hazard is the primary suspect?',
      options: [
        'Pre-formed heat-stable Staphylococcus aureus enterotoxin (or Bacillus cereus emetic toxin in starchy foods)',
        'Listeria monocytogenes (incubation 3 to 70 days)',
        'Hepatitis A virus (incubation 15 to 50 days)',
        'Trichinella spiralis'
      ],
      correctIndex: 0,
      explanation: 'A short incubation period of 1 to 6 hours with acute vomiting and no fever indicates a pre-formed heat-stable toxin such as Staphylococcus aureus enterotoxin.'
    },
    {
      q: 'In what direction must floor drainage channels flow inside a food manufacturing facility?',
      options: [
        'From High-Care / High-Risk (Cleanest) zones toward Low-Risk (Dirty) zones—never from raw/dirty areas into High-Care',
        'From Raw Meat and Toilets directly through the High-Care RTE packing room',
        'Upward onto the ceiling',
        'Drainage direction does not matter'
      ],
      correctIndex: 0,
      explanation: 'Floor drains must flow from High-Care (clean) toward Low-Risk (dirty) zones so contaminated effluent can never back up into Ready-to-Eat rooms.'
    },
    {
      q: 'What are the 5 sequential stages of a standard industrial Clean-In-Place (CIP) cycle, and what minimum pipeline flow velocity is required?',
      options: [
        'Pre-Rinse → Caustic Wash → Intermediate Rinse → Acid Wash → Disinfection/Final Rinse, at a turbulent flow velocity of ≥ 1.5 m/s',
        'Cold water rinse only at 0.1 m/s',
        'Acid wash first without rinsing',
        'Blowing warm air through the pipe once a month'
      ],
      correctIndex: 0,
      explanation: 'A 5-stage CIP uses Caustic (for fat/protein) and Acid (for mineral scale) at ≥ 1.5 m/s turbulent flow velocity to scrub pipe walls clean.'
    },
    {
      q: 'How do you effectively remove a mature bacterial Biofilm from stainless-steel equipment and rubber gaskets?',
      options: [
        'Dismantle parts and apply mechanical scrubbing with alkaline/enzymatic detergent to break the protective polysaccharide slime layer BEFORE applying chemical disinfectant',
        'Lightly mist with cold water from 2 meters away',
        'Wipe with a dry paper towel only',
        'Spray alcohol over the grease without scrubbing'
      ],
      correctIndex: 0,
      explanation: 'Biofilms shield bacteria from sanitizers; mechanical scrubbing with detergent/enzymes is required to break the slime matrix before disinfecting.'
    },
    {
      q: 'In a 4-Zone Environmental Monitoring Program (EMP), what constitutes "Zone 1" vs. "Zone 3"?',
      options: [
        'Zone 1 = Direct Food-Contact Surfaces (slicer blades, conveyor belts, filler nozzles); Zone 3 = Surrounding Room Surfaces (floors, floor drains, walls, forklifts)',
        'Zone 1 = Exterior parking lot; Zone 3 = Slicer blades',
        'Zone 1 = Staff washrooms; Zone 3 = Office desks',
        'All zones are outside the factory'
      ],
      correctIndex: 0,
      explanation: 'Zone 1 covers direct food-contact surfaces, Zone 2 covers adjacent equipment frames, Zone 3 covers floors/drains/walls in the room, and Zone 4 covers areas outside production.'
    },
    {
      q: 'Which foreign-body inspection technology can detect metal, glass shards, calcified bone, and stones even inside aluminum-foil trays or metal cans?',
      options: [
        'X-Ray Inspection System',
        'A standard wooden ruler',
        'A basic pH meter',
        'A room thermometer'
      ],
      correctIndex: 0,
      explanation: 'X-Ray inspection works by density difference and detects metal, glass, stone, and dense bone even inside foil or metal packaging.'
    }
  ]
};

export const FOOD_SAFETY_3_AND_4_COURSES: InternationalTrainingCourse[] = [
  FOOD_SAFETY_LEVEL_03_COURSE,
  FOOD_SAFETY_LEVEL_04_COURSE
];

export const FOOD_SAFETY_3_AND_4_HUB_TRAININGS: HubTraining[] =
  FOOD_SAFETY_3_AND_4_COURSES.map(buildHubTrainingFromCourse);
