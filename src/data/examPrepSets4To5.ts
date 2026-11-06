import { ExamPrepSet } from './examPrepSets1To3';

export const EXAM_SETS_4_TO_5: ExamPrepSet[] = [
  {
    id: 'exam-set-4',
    setNumber: 4,
    title: 'Exam Set 4: Food Microbiology, Pathogens, Spoilage & Preservation',
    subtitle: '50 Official Practice MCQs on Bacterial Pathogens, Water Activity, Thermal D/Z/F0 Values, Fermentation & Hurdle Tech',
    subjectArea: 'Food Microbiology & Preservation',
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 100,
    passingPercentage: 60,
    questions: [
      {
        id: 'ex4-q1',
        qNum: 1,
        category: 'Bacterial Growth Factors',
        question: 'What do the 6 letters of the acronym "FATTOM" stand for in Food Microbiology?',
        options: [
          'Fat, Acid, Texture, Taste, Odor, Moisture',
          'Food (Nutrients), Acidity (pH), Time, Temperature, Oxygen, and Moisture (Water Activity aw)',
          'Fermentation, Aerobic, Thermal, Toxin, Organic, Microbe',
          'Freezing, Autoclaving, Titration, Testing, Oxidation, Mixing'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'FATTOM represents the six environmental conditions governing microbial growth in foods: Food, Acidity, Time, Temperature, Oxygen, and Moisture.'
      },
      {
        id: 'ex4-q2',
        qNum: 2,
        category: 'Bacterial Growth Curve',
        question: 'In the 4-phase bacterial growth curve, during which phase do bacteria adapt to their new food environment and synthesize enzymes without increasing in cell number?',
        options: ['Log (Exponential) Phase', 'Lag Phase', 'Stationary Phase', 'Death (Decline) Phase'],
        correctIndex: 1,
        marks: 2,
        explanation: 'During the Lag Phase, cells adjust metabolically before binary fission begins in the Log Phase. Chilling food extends the Lag Phase.'
      },
      {
        id: 'ex4-q3',
        qNum: 3,
        category: 'Water Activity',
        question: 'What is the minimum Water Activity (aw) required for the growth of most gram-negative foodborne pathogenic bacteria (such as Salmonella and E. coli)?',
        options: ['aw ≥ 0.91 to 0.95', 'aw ≥ 0.60', 'aw ≥ 0.40', 'aw = 0.20'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Most pathogenic bacteria require aw ≥ 0.91 (with Staphylococcus aureus capable of aerobic growth down to aw 0.86).'
      },
      {
        id: 'ex4-q4',
        qNum: 4,
        category: 'Water Activity',
        question: 'Below which Water Activity (aw) value ceases ALL microbial growth (including xerophilic molds and osmophilic yeasts)?',
        options: ['aw < 0.90', 'aw < 0.85', 'aw < 0.60', 'aw < 0.95'],
        correctIndex: 2,
        marks: 2,
        explanation: 'No known microorganism (bacteria, yeast, or xerophilic mold) can multiply at a water activity below 0.60.'
      },
      {
        id: 'ex4-q5',
        qNum: 5,
        category: 'Pathogens — Listeria',
        question: 'Which characteristic makes Listeria monocytogenes uniquely dangerous in chilled Ready-to-Eat (RTE) dairy, deli meat, and smoked fish plants?',
        options: [
          'It only grows above 45°C',
          'It is psychrotrophic (can grow at refrigeration temperatures down to -0.4°C to 4°C), tolerates up to 10% salt, and forms persistent drain biofilms',
          'It is an obligate anaerobe that dies in air',
          'It forms heat-resistant spores that survive autoclaving'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Listeria monocytogenes is a non-spore-forming Gram-positive rod that grows at refrigeration temperatures and causes listeriosis with a 20–30% fatality rate in vulnerable groups.'
      },
      {
        id: 'ex4-q6',
        qNum: 6,
        category: 'Pathogens — Clostridium botulinum',
        question: 'What type of microorganism is Clostridium botulinum?',
        options: [
          'Gram-negative aerobic non-spore-forming coccus',
          'Gram-positive, rod-shaped, obligate anaerobic, spore-forming bacterium that produces a potent neurotoxin',
          'Aerobic mold',
          'Foodborne virus'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Clostridium botulinum is a Gram-positive anaerobic spore-former whose botulinum neurotoxin blocks acetylcholine release, causing flaccid paralysis.'
      },
      {
        id: 'ex4-q7',
        qNum: 7,
        category: 'Pathogens — Staphylococcus aureus',
        question: 'Where is Staphylococcus aureus primarily found on food handlers, and why does reheating contaminated food fail to prevent illness?',
        options: [
          'Only in municipal water',
          'In the nasal passages, throat, skin, and infected cuts/boils of humans; its Staphylococcal enterotoxin is extremely heat-stable and survives boiling',
          'Only in deep ocean fish',
          'It is killed and detoxified at 50°C'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: '30–50% of healthy humans carry S. aureus in their nose/skin; if food is temperature-abused, it produces heat-stable enterotoxins that survive 100°C boiling.'
      },
      {
        id: 'ex4-q8',
        qNum: 8,
        category: 'Pathogens — E. coli O157:H7',
        question: 'Shiga toxin-producing E. coli (STEC / EHEC, such as E. coli O157:H7) is strongly associated with undercooked ground beef and raw milk, and can cause which life-threatening kidney complication in children?',
        options: [
          'Scurvy',
          'Hemolytic Uremic Syndrome (HUS)',
          'Rickets',
          'Beriberi'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'E. coli O157:H7 produces Shiga toxins that damage endothelial cells in the kidneys, leading to Hemolytic Uremic Syndrome (HUS).'
      },
      {
        id: 'ex4-q9',
        qNum: 9,
        category: 'Pathogens — Campylobacter',
        question: 'Which microaerophilic (requiring 3–5% O2 and 5–10% CO2), thermophilic (optimal growth 42°C) bacterium is the leading bacterial cause of gastroenteritis from undercooked poultry?',
        options: ['Campylobacter jejuni', 'Bacillus subtilis', 'Lactococcus lactis', 'Clostridium sporogenes'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Campylobacter jejuni naturally inhabits the avian intestinal tract (42°C body temperature) and has a very low infectious dose (~500 cells).'
      },
      {
        id: 'ex4-q10',
        qNum: 10,
        category: 'Pathogens — Vibrio',
        question: 'Which halophilic (salt-loving) bacterium is strictly associated with raw or undercooked marine crustaceans, oysters, and shellfish?',
        options: ['Vibrio parahaemolyticus and Vibrio vulnificus', 'Clostridium perfringens', 'Aspergillus niger', 'Streptococcus thermophilus'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Vibrio parahaemolyticus and V. vulnificus are halophilic marine bacteria found in coastal waters and raw shellfish.'
      },
      {
        id: 'ex4-q11',
        qNum: 11,
        category: 'Pathogens — Clostridium perfringens',
        question: 'Why is Clostridium perfringens often called the "Cafeteria / Catering Germ"?',
        options: [
          'It grows in coffee machines',
          'Its heat-resistant spores survive cooking in large pots of meat/gravy/stews and germinate rapidly during slow cooling or warm holding between 15°C and 50°C',
          'It only grows in frozen ice cream',
          'It is spread by mosquitoes'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Cooking drives off dissolved oxygen and heat-activates C. perfringens spores, which have a generation time as short as 8–10 minutes at 43–45°C if cooled slowly.'
      },
      {
        id: 'ex4-q12',
        qNum: 12,
        category: 'Pathogens — Yersinia',
        question: 'Besides Listeria monocytogenes, which Gram-negative enteric pathogen is psychrotrophic (capable of growing in refrigerated milk and pork at 0–4°C)?',
        options: ['Yersinia enterocolitica', 'Campylobacter coli', 'Salmonella Typhi', 'Shigella dysenteriae'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Yersinia enterocolitica is a psychrotrophic pathogen associated with raw pork and unpasteurized/recontaminated milk that grows at 4°C.'
      },
      {
        id: 'ex4-q13',
        qNum: 13,
        category: 'Foodborne Viruses',
        question: 'How do foodborne viruses (such as Norovirus and Hepatitis A) differ fundamentally from bacteria in foods?',
        options: [
          'Viruses multiply rapidly in warm milk',
          'Viruses CANNOT multiply or grow in food; food acts purely as a passive transmission vehicle until the virus enters a living human host cell',
          'Viruses are killed by refrigeration at 4°C',
          'Viruses are visible to the naked eye'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Viruses are obligate intracellular parasites—they never multiply in food, have an extremely low infectious dose (10–100 viral particles), and survive freezing.'
      },
      {
        id: 'ex4-q14',
        qNum: 14,
        category: 'Thermal Processing — D-Value',
        question: 'If a target pathogen has a D-value at 70°C (D70) of 2.0 minutes and an initial count of 10,000 (10^4) CFU/g, how many minutes at 70°C are required to achieve a 6-log reduction (down to 10^-2 CFU/g)?',
        options: ['2 minutes', '6 minutes', '12 minutes (6 logs × 2.0 minutes/log)', '24 minutes'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Each D-value reduces the population by 1 log (90%). Therefore, a 6-log reduction requires 6 × D70 = 6 × 2.0 = 12 minutes.'
      },
      {
        id: 'ex4-q15',
        qNum: 15,
        category: 'Thermal Processing — Z-Value',
        question: 'If a bacterial spore has a D-value of 10 minutes at 111.1°C and a Z-value of 10°C, what will its D-value be when the temperature is raised by 10°C to 121.1°C?',
        options: ['100 minutes', '1.0 minute (reduced by a factor of 10)', '5 minutes', '0 minutes'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Increasing temperature by one Z-value (10°C) decreases the D-value tenfold (from 10 minutes down to 1.0 minute).'
      },
      {
        id: 'ex4-q16',
        qNum: 16,
        category: 'Thermal Processing — 12D Concept',
        question: 'In commercial canning of low-acid foods (pH > 4.6), the minimum botulinum cook (12D concept) is equivalent to an F0 value of roughly:',
        options: ['0.1 minutes at 100°C', '2.52 to 3.0 minutes at 121.1°C (since D121.1 for C. botulinum spores = 0.21 minutes)', '60 minutes at 63°C', '15 seconds at 72°C'],
        correctIndex: 1,
        marks: 2,
        explanation: 'D121.1 for Clostridium botulinum spores is ~0.21 min; 12 × 0.21 min = 2.52 min (standardized in industry to minimum F0 ≥ 3.0 minutes).'
      },
      {
        id: 'ex4-q17',
        qNum: 17,
        category: 'Commercial Sterility',
        question: 'In Canned & UHT Foods, why is the term "Commercial Sterility" used instead of "Absolute Sterility"?',
        options: [
          'Because canned food still contains live Salmonella',
          'Because extreme thermophilic spores (like Geobacillus stearothermophilus) may theoretically survive, but cannot germinate or grow under normal ambient non-refrigerated storage conditions',
          'Because cans are open to air',
          'To save label space'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Commercial sterility means absence of all pathogens, toxins, and any microorganisms capable of multiplying under normal ambient storage and distribution.'
      },
      {
        id: 'ex4-q18',
        qNum: 18,
        category: 'Canned Food Spoilage',
        question: 'Which highly heat-resistant thermophilic spore-former causes "Flat Sour" spoilage in low-acid canned vegetables (lowering pH without producing gas, so the can ends remain flat)?',
        options: ['Geobacillus stearothermophilus (formerly Bacillus stearothermophilus)', 'Escherichia coli', 'Penicillium camemberti', 'Vibrio cholerae'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Geobacillus stearothermophilus ferments carbohydrates to acid without gas production when canned goods are held at warm temperatures (> 43°C).'
      },
      {
        id: 'ex4-q19',
        qNum: 19,
        category: 'UHT Milk Processing',
        question: 'What are the standard time-temperature parameters for Ultra-High Temperature (UHT) sterilization of milk packaged aseptically?',
        options: ['63°C for 30 minutes', '72°C for 15 seconds', '135°C to 150°C for 2 to 8 seconds', '100°C for 1 hour'],
        correctIndex: 2,
        marks: 2,
        explanation: 'UHT processing heats milk to 135°C–150°C for 2–8 seconds followed by aseptic packaging in pre-sterilized Tetra Pak/laminate cartons.'
      },
      {
        id: 'ex4-q20',
        qNum: 20,
        category: 'Aseptic Packaging',
        question: 'In an aseptic UHT filling machine (e.g., Tetra Pak), which chemical agent is universally used (often at 30–35% concentration + heat/UV) to sterilize the packaging laminate strip before filling?',
        options: ['Sodium Chloride', 'Food-Grade Hydrogen Peroxide (H2O2)', 'Citric Acid', 'Soap water'],
        correctIndex: 1,
        marks: 2,
        explanation: '30–35% Hydrogen Peroxide (H2O2) heated above 70°C sterilizes the packaging web and is then completely evaporated by sterile hot air knives.'
      },
      {
        id: 'ex4-q21',
        qNum: 21,
        category: 'Dairy Fermentation',
        question: 'Which symbiotic pair of thermophilic lactic acid bacteria is the classic starter culture required by Codex for authentic Yogurt fermentation?',
        options: [
          'Escherichia coli and Bacillus subtilis',
          'Streptococcus thermophilus and Lactobacillus delbrueckii subsp. bulgaricus',
          'Saccharomyces cerevisiae and Acetobacter',
          'Propionibacterium freudenreichii and Penicillium'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'S. thermophilus and L. bulgaricus grow symbiotically at 42–45°C, fermenting lactose to lactic acid and coagulating casein at its isoelectric point (pH 4.6).'
      },
      {
        id: 'ex4-q22',
        qNum: 22,
        category: 'Microbiological Media',
        question: 'Which selective and differential agar medium is standard in food microbiology labs for isolating and enumerating Staphylococcus aureus?',
        options: [
          'Baird-Parker Agar (supplemented with Egg Yolk Tellurite Emulsion)',
          'Potato Dextrose Agar (PDA)',
          'Rose Bengal Agar',
          'Distilled Water Agar'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'On Baird-Parker agar, S. aureus reduces tellurite to form shiny black colonies surrounded by a clear zone (proteolysis) and opaque halo (lecithinase).'
      },
      {
        id: 'ex4-q23',
        qNum: 23,
        category: 'Microbiological Media',
        question: 'Which selective agar media are commonly used in ISO 6579 for isolating Salmonella spp. after selective enrichment?',
        options: [
          'XLD (Xylose Lysine Deoxycholate) Agar and BGA (Brilliant Green Agar) / Hektoen Enteric Agar',
          'Sabouraud Dextrose Agar',
          'MRS Agar',
          'Nutrient Broth only'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'ISO 6579 uses non-selective pre-enrichment in Buffered Peptone Water (BPW), selective enrichment in RVS/MKTTn broths, and plating on XLD agar (red colonies with black H2S centers).'
      },
      {
        id: 'ex4-q24',
        qNum: 24,
        category: 'Microbiological Media',
        question: 'Why are Yeast and Mold plates (e.g., DRBC, DG18, or acidified Potato Dextrose Agar) incubated at 25°C for 5 days rather than 37°C for 24 hours?',
        options: [
          'Incubators cannot reach 37°C',
          'Most food spoilage yeasts and filamentous molds are mesophilic/psychrotolerant with slower growth rates and optimum growth around 22–28°C',
          'Bacteria grow slower at 37°C',
          'Agar melts at 30°C'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Yeasts and molds grow best around 25°C over 3–5 days; chloramphenicol or tartaric acid (pH 3.5) is added to the agar to suppress bacterial overgrowth.'
      },
      {
        id: 'ex4-q25',
        qNum: 25,
        category: 'Gram Staining',
        question: 'In a Gram Stain procedure (Crystal Violet -> Iodine -> Alcohol Decolorizer -> Safranin Counterstain), what color do Gram-positive and Gram-negative bacteria stain respectively?',
        options: [
          'Gram-positive = Red/Pink; Gram-negative = Purple',
          'Gram-positive = Purple/Violet (thick peptidoglycan retains crystal violet); Gram-negative = Pink/Red (counterstained by safranin)',
          'Both stain green',
          'Both stain yellow'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Thick peptidoglycan walls in Gram-positive bacteria trap the crystal violet–iodine complex (Purple), while Gram-negative outer membranes decolorize and take up Safranin (Pink/Red).'
      },
      {
        id: 'ex4-q26',
        qNum: 26,
        category: 'Spore-Forming Genera',
        question: 'Which two bacterial genera are the primary endospore-formers of concern in food microbiology?',
        options: [
          'Salmonella and Shigella',
          'Bacillus (aerobic/facultative) and Clostridium (anaerobic)',
          'Escherichia and Enterobacter',
          'Listeria and Staphylococcus'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Bacillus (aerobic) and Clostridium (anaerobic) produce dipicolinic acid–calcium endospores resistant to boiling, drying, and radiation.'
      },
      {
        id: 'ex4-q27',
        qNum: 27,
        category: 'Freezing Technology',
        question: 'Why does Individual Quick Freezing (IQF / Blast Freezing at -35°C to -40°C) preserve fruit, vegetable, and meat texture far better than slow domestic freezing?',
        options: [
          'Slow freezing kills more vitamins',
          'Rapid freezing forms millions of tiny intracellular ice micro-crystals that do not puncture cell membranes, whereas slow freezing forms large jagged extracellular ice crystals that rupture cells and cause drip loss',
          'IQF adds sugar to food',
          'IQF cooks the food first'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Rapid passage through the zone of maximum ice crystal formation (-1°C to -5°C) creates fine micro-crystals, preventing cell wall rupture and thaw drip loss.'
      },
      {
        id: 'ex4-q28',
        qNum: 28,
        category: 'Blanching',
        question: 'Before freezing vegetables (like peas, corn, or spinach), why are they briefly blanched in steam or hot water (85–95°C for 1–3 minutes)?',
        options: [
          'To add salt',
          'To inactivate indigenous oxidative enzymes (Peroxidase, Catalase, Polyphenol Oxidase, Lipoxygenase) that cause off-flavors, browning, and nutrient loss during frozen storage',
          'To sterilize Clostridium spores',
          'To dry the vegetables'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Enzymes remain active even at -18°C; blanching inactivates Peroxidase (the heat-resistant indicator enzyme) and Polyphenol Oxidase.'
      },
      {
        id: 'ex4-q29',
        qNum: 29,
        category: 'Non-Thermal Preservation',
        question: 'What is High-Pressure Processing (HPP / Pascalization) and how does it preserve cold-pressed juices and guacamole without heat?',
        options: [
          'Boiling juice under vacuum',
          'Subjecting packaged food to 400–600 MPa (4,000–6,000 bar) of isostatic water pressure, which disrupts bacterial cell membranes while leaving covalent bonds (vitamins, fresh color, flavor) intact',
          'Pumping air into bottles',
          'Freezing at -80°C'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'HPP (400–600 MPa) inactivates vegetative pathogens (Listeria, Salmonella, E. coli) and yeasts/molds at chilled temperatures without heat degradation.'
      },
      {
        id: 'ex4-q30',
        qNum: 30,
        category: 'Food Irradiation',
        question: 'What is the maximum radiation dose approved by Codex Alimentarius and the FDA for treating dry spices and herbs to eliminate Salmonella and insects?',
        options: ['Up to 10 kGy (or up to 30 kGy for dry spices in the US)', '1,000,000 kGy', '0.001 Gy', 'Irradiation makes spices radioactive'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Ionizing radiation (Gamma rays from Cobalt-60, X-rays, or E-beam up to 10–30 kGy for spices) destroys DNA in pathogens without making the food radioactive.'
      },
      {
        id: 'ex4-q31',
        qNum: 31,
        category: 'Food Irradiation Symbol',
        question: 'What is the name of the international green symbol required on labels of irradiated foods?',
        options: ['Biohazard Symbol', 'The Radura Symbol', 'Green Dot', 'Fairtrade Mark'],
        correctIndex: 1,
        marks: 2,
        explanation: 'The green Radura symbol accompanied by "Treated with radiation" or "Treated by irradiation" is the international labeling mark.'
      },
      {
        id: 'ex4-q32',
        qNum: 32,
        category: 'Bacteriocins',
        question: 'Which natural polypeptide bacteriocin (E234), produced by Lactococcus lactis, is widely approved in processed cheese and canned foods to inhibit Gram-positive spore-formers like Clostridium and Listeria?',
        options: ['Penicillin', 'Nisin (E234)', 'Tetracycline', 'Aflatoxin'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Nisin (E234) is a GRAS ribosomally synthesized bacteriocin effective against Gram-positive bacteria and spores.'
      },
      {
        id: 'ex4-q33',
        qNum: 33,
        category: 'Natamycin',
        question: 'Which natural antifungal compound (E235), produced by Streptomyces natalensis, is applied to the surface rind of hard cheeses and sausages strictly to prevent mold growth without affecting bacteria?',
        options: ['Natamycin (Pimaricin — E235)', 'Sodium Chloride', 'Ascorbic Acid', 'Monosodium Glutamate'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Natamycin binds specifically to ergosterol in fungal cell membranes, inhibiting yeasts and molds on cheese rinds without hindering starter bacteria.'
      },
      {
        id: 'ex4-q34',
        qNum: 34,
        category: 'Organic Acid Preservatives',
        question: 'Why are weak organic acid preservatives (like Benzoic Acid and Sorbic Acid) only effective as antimicrobials in acidic foods (low pH)?',
        options: [
          'They precipitate at low pH',
          'Because only the UNDISSSOCIATED (uncharged) acid molecule can pass through the lipid bacterial/fungal cell membrane to acidify the cytoplasm, and the undissociated fraction increases below the acid’s pKa',
          'They evaporate at pH 7',
          'They turn blue in alkaline food'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Below their pKa (pKa 4.2 for benzoic acid; pKa 4.76 for sorbic acid), weak acids remain undissociated and uncharged, allowing them to diffuse across microbial membranes.'
      },
      {
        id: 'ex4-q35',
        qNum: 35,
        category: 'Bread Mold Prevention',
        question: 'Which preservative is most commonly added to commercial sliced wheat bread dough to inhibit mold growth and prevent "Ropiness" caused by Bacillus subtilis spores?',
        options: ['Calcium Propionate (E282)', 'Sodium Nitrite', 'Sulphur Dioxide', 'Citric Acid'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Calcium propionate (0.1%–0.3% flour weight) inhibits bread molds and rope-forming Bacillus subtilis without inhibiting baker’s yeast (Saccharomyces cerevisiae).'
      },
      {
        id: 'ex4-q36',
        qNum: 36,
        category: 'Sulfites',
        question: 'Besides acting as an antimicrobial and enzymatic browning inhibitor in dried fruits, Why must Sulfites (SO2 / Sodium Metabisulfite) be declared as an allergen on food labels when present at ≥ 10 mg/kg (ppm)?',
        options: [
          'They increase calories',
          'Sulfites ≥ 10 ppm can trigger severe bronchospasm and life-threatening asthma attacks in sulfite-sensitive individuals',
          'They stain teeth',
          'They lower protein content'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Codex, EU, and FDA regulations mandate declaring sulfites whenever residual SO2 reaches or exceeds 10 mg/kg (10 ppm).'
      },
      {
        id: 'ex4-q37',
        qNum: 37,
        category: 'Biofilms',
        question: 'What is a bacterial Biofilm in a food processing pipeline or conveyor, and why is it resistant to standard chlorine rinsing?',
        options: [
          'A layer of vegetable oil',
          'A structured community of bacteria encased in a self-produced Extracellular Polymeric Substance (EPS) matrix adhered to a surface, shielding inner cells from sanitizers',
          'A plastic wrapper',
          'Dead bacterial spores only'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'The slimy EPS polysaccharide/protein matrix blocks sanitizer penetration; mechanical scrubbing or hot caustic/enzymatic detergent is required to disrupt biofilms.'
      },
      {
        id: 'ex4-q38',
        qNum: 38,
        category: 'Psychrotrophs in Raw Milk',
        question: 'When raw milk is stored in a farm bulk tank at 4°C for > 48–72 hours before pasteurization, which psychrotrophic bacteria produce heat-stable proteases and lipases that survive UHT and cause bitter/gelation defects later?',
        options: ['Pseudomonas spp. (especially Pseudomonas fluorescens)', 'Lactobacillus helveticus', 'Bifidobacterium infantis', 'Salmonella Typhi'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Although pasteurization/UHT kills Pseudomonas cells, their extracellular heat-stable proteases and lipases survive 140°C and cause age gelation and bitterness in UHT milk.'
      },
      {
        id: 'ex4-q39',
        qNum: 39,
        category: 'Bacteriophages',
        question: 'In a cheese or yogurt factory, what is the most common biological cause of a sudden "Starter Culture Failure" (slow or dead vat acidification) when milk is antibiotic-free?',
        options: [
          'Too much calcium in milk',
          'Bacteriophage (viruses that specifically infect and lyse lactic acid starter bacteria)',
          'Yeast contamination',
          'Excessive homogenization'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Bacteriophages infect lactic starter cultures and halt acid production; plants rotate phage-unrelated starter strains and use HEPA air filtration.'
      },
      {
        id: 'ex4-q40',
        qNum: 40,
        category: 'Antibiotic Residues in Milk',
        question: 'Aside from human allergic/resistance risks, what direct industrial defect occurs if raw milk containing Beta-lactam antibiotic residues (Penicillin) is used for Yogurt or Cheese production?',
        options: [
          'The milk turns red',
          'The antibiotic inhibits the lactic acid starter bacteria, preventing acid development and curd coagulation',
          'The fat content doubles',
          'The milk boils at 50°C'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Even ppb levels of antibiotics inhibit S. thermophilus and L. bulgaricus, ruining entire vats of yogurt or cheese.'
      },
      {
        id: 'ex4-q41',
        qNum: 41,
        category: 'Parasites in Meat & Water',
        question: 'Which protozoan parasite forms chlorine-resistant oocysts in contaminated water supplies, requiring UV irradiation, ozone, or ≤ 1-micron absolute filtration for removal?',
        options: ['Cryptosporidium parvum (and Giardia lamblia)', 'Taenia solium', 'Trichinella spiralis', 'Staphylococcus epidermidis'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Cryptosporidium parvum oocysts resist standard municipal chlorination and require 1-micron filtration, ozone, or UV-C treatment.'
      },
      {
        id: 'ex4-q42',
        qNum: 42,
        category: 'Serial Dilution & Plate Count',
        question: 'On a Standard Plate Count (Pour Plate) Petri dish, what is the statistically valid countable range of bacterial colonies per plate (ISO 4833 / FDA BAM)?',
        options: ['1 to 5 colonies', '25 to 250 (or 30 to 300) colonies per plate', '1,000 to 5,000 colonies', 'Over 10,000 colonies (TNTC)'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Plates with 25–250 (FDA BAM) or 30–300 (ISO) colonies give statistically accurate CFU/g counts without overcrowding inhibition.'
      },
      {
        id: 'ex4-q43',
        qNum: 43,
        category: 'CFU Calculation',
        question: 'If 1 mL of a 10^-3 (1:1000) dilution plated on Plate Count Agar yields 65 colonies, what is the Total Plate Count in CFU/g?',
        options: ['650 CFU/g', '6,500 CFU/g', '6.5 × 10^4 (65,000) CFU/g', '6.5 × 10^6 CFU/g'],
        correctIndex: 2,
        marks: 2,
        explanation: 'CFU/g = Number of Colonies ÷ (Dilution Factor × Volume Plated) = 65 ÷ (10^-3 × 1) = 6.5 × 10^4 CFU/g.'
      },
      {
        id: 'ex4-q44',
        qNum: 44,
        category: 'Osmophilic Spoilage',
        question: 'Which osmophilic yeast species is notorious for spoiling honey, high-Brix fruit concentrates, and syrups (growing down to aw 0.61–0.65)?',
        options: ['Zygosaccharomyces rouxii', 'Escherichia coli', 'Pseudomonas aeruginosa', 'Clostridium tetani'],
        correctIndex: 0,
        marks: 2,
        explanation: 'Zygosaccharomyces rouxii is an extreme osmophilic yeast capable of fermenting high-sugar syrups and honey, causing gas and bulging drums.'
      },
      {
        id: 'ex4-q45',
        qNum: 45,
        category: 'Freeze Drying',
        question: 'What physical phase transition is used in Freeze-Drying (Lyophilization) of instant coffee, probiotics, and astronaut meals?',
        options: [
          'Evaporation of liquid water at 100°C',
          'Sublimation — transitioning frozen ice directly from solid phase to water vapor under deep vacuum below the triple point of water (0.01°C, 6.11 mbar)',
          'Condensation under high pressure',
          'Centrifugal separation'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Lyophilization sublimates ice directly into vapor under vacuum, preserving cellular structure, aroma volatiles, and rehydration porosity.'
      },
      {
        id: 'ex4-q46',
        qNum: 46,
        category: 'Spray Drying',
        question: 'In Spray Drying of milk powder, why does the milk droplet core remain relatively cool (45–55°C) despite entering a hot air chamber at 180–200°C?',
        options: [
          'Milk does not conduct heat',
          'Evaporative cooling (latent heat of vaporization) keeps the droplet at the wet-bulb temperature during rapid moisture evaporation',
          'Liquid nitrogen is sprayed inside',
          'The chamber has no air'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Rapid evaporation absorbs latent heat of vaporization, keeping the milk particle cool and preventing severe protein scorching.'
      },
      {
        id: 'ex4-q47',
        qNum: 47,
        category: 'Probiotics',
        question: 'According to FAO/WHO and Codex guidelines, what minimum viable count (CFU/g or CFU/mL) of probiotic bacteria (e.g., Lactobacillus acidophilus, Bifidobacterium lactis) must remain alive at the END of the product’s shelf life to claim probiotic health benefits?',
        options: ['10^2 (100) CFU/g', 'At least 10^6 to 10^7 (1 million to 10 million) viable CFU/g at the end of shelf life', '10 CFU/g', 'Dead cells only'],
        correctIndex: 1,
        marks: 2,
        explanation: 'A minimum of 10^6 to 10^7 viable CFU/g at the expiration date is the international benchmark for functional probiotic foods.'
      },
      {
        id: 'ex4-q48',
        qNum: 48,
        category: 'Canned Food Defect Diagnosis',
        question: 'If a bulged ("hard swell") low-acid tin can is opened in the lab and gives a putrid, foul hydrogen sulfide (H2S) odor with digested black meat and gas, which organism is the primary suspect?',
        options: [
          'Geobacillus stearothermophilus (Flat sour)',
          'Proteolytic Clostridium sporogenes or Clostridium botulinum (Putrefactive anaerobe)',
          'Acetobacter',
          'Leuconostoc mesenteroides'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Proteolytic Clostridium species digest proteins anaerobically, producing H2S, NH3, CO2, H2 gas (swelling the can), and putrid odors.'
      },
      {
        id: 'ex4-q49',
        qNum: 49,
        category: 'Decimal Reduction & Disinfectants',
        question: 'When a chemical surface sanitizer claims a "5-Log Reduction" (99.999% kill) in a suspension test (EN 1276), if a surface starts with 1,000,000 (10^6) bacteria, how many survive?',
        options: ['500,000 survive', '1,000 survive', '10 bacteria (10^1) survive', '0 bacteria survive'],
        correctIndex: 2,
        marks: 2,
        explanation: '10^6 reduced by 5 logs (divided by 10^5) leaves 10^1 = 10 surviving bacteria.'
      },
      {
        id: 'ex4-q50',
        qNum: 50,
        category: 'Infant Botulism',
        question: 'Why must honey NEVER be fed to infants under 12 months of age?',
        options: [
          'Honey contains too much fructose',
          'Honey can naturally harbor dormant Clostridium botulinum endospores, which germinate and colonize the immature infant gut flora (Infant Botulism)',
          'Honey contains lactose',
          'Honey is too thick to swallow'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Infants under 1 year lack mature competitive gut microflora to prevent ingested C. botulinum spores in honey from germinating in vivo.'
      }
    ]
  },
  {
    id: 'exam-set-5',
    setNumber: 5,
    title: 'Exam Set 5: Food Chemistry, Human Nutrition, Dairy/Cereal Tech & QA',
    subtitle: '50 Official Practice MCQs on Macronutrients, BMI/BMR, Lipid Oxidation, Dairy/Bakery Science, Proximate Analysis & Codex',
    subjectArea: 'Food Science, Chemistry & Nutrition',
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 100,
    passingPercentage: 60,
    questions: [
      {
        id: 'ex5-q1',
        qNum: 1,
        category: 'Human Nutrition & Energy',
        question: 'What are the standard Atwater physiological energy values (kcal per gram) for Carbohydrates, Proteins, and Fats respectively?',
        options: [
          'Carbs = 4 kcal/g, Protein = 4 kcal/g, Fat = 9 kcal/g (and Alcohol = 7 kcal/g)',
          'Carbs = 9 kcal/g, Protein = 4 kcal/g, Fat = 4 kcal/g',
          'Carbs = 5 kcal/g, Protein = 5 kcal/g, Fat = 5 kcal/g',
          'Carbs = 2 kcal/g, Protein = 8 kcal/g, Fat = 12 kcal/g'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Atwater energy factors are 4 kcal/g (17 kJ/g) for Carbohydrates and Protein, and 9 kcal/g (37 kJ/g) for Fats/Lipids.'
      },
      {
        id: 'ex5-q2',
        qNum: 2,
        category: 'BMI Calculation',
        question: 'What is the mathematical formula for calculating Body Mass Index (BMI), and what is the WHO Healthy Normal Weight BMI range for adults?',
        options: [
          'Weight (kg) ÷ Height (m)²; Healthy range = 18.5 to 24.9 kg/m²',
          'Height (cm) ÷ Weight (kg); Healthy range = 10 to 15',
          'Weight (kg) × Age; Healthy range = 25 to 30',
          'Weight (lbs) ÷ Waist (in); Healthy range = 30 to 35'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'BMI = Weight (kg) / [Height (m)]². WHO categories: <18.5 Underweight, 18.5–24.9 Normal, 25.0–29.9 Overweight, ≥30.0 Obese.'
      },
      {
        id: 'ex5-q3',
        qNum: 3,
        category: 'Weight Management Math',
        question: 'Approximately how many kilocalories (kcal) of cumulative energy deficit are required to lose 1 kilogram (2.2 lbs) of human adipose (fat) tissue?',
        options: ['1,000 kcal', '3,500 kcal', '~7,700 kcal (so a 500 kcal/day deficit yields ~0.45 kg weight loss per week)', '20,000 kcal'],
        correctIndex: 2,
        marks: 2,
        explanation: '1 kg of human body fat tissue (~85% lipid) stores approximately 7,700 kcal of metabolizable energy.'
      },
      {
        id: 'ex5-q4',
        qNum: 4,
        category: 'Vitamins',
        question: 'Which four vitamins are Fat-Soluble (stored in the liver and adipose tissue), as opposed to Water-Soluble (Vitamin C and B-complex)?',
        options: [
          'Vitamins B1, B2, B6, and B12',
          'Vitamins A, D, E, and K',
          'Vitamins C, B9, and Biotin',
          'Niacin and Pantothenic Acid'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Vitamins A (Retinol), D (Cholecalciferol), E (Tocopherol), and K (Phylloquinone/Menaquinone) are the four fat-soluble vitamins.'
      },
      {
        id: 'ex5-q5',
        qNum: 5,
        category: 'Essential Amino Acids',
        question: 'How many Essential Amino Acids cannot be synthesized de novo by the adult human body and must be supplied through dietary protein?',
        options: [
          '3 Essential Amino Acids',
          '9 Essential Amino Acids (Histidine, Isoleucine, Leucine, Lysine, Methionine, Phenylalanine, Threonine, Tryptophan, Valine)',
          '20 Essential Amino Acids',
          '1 Essential Amino Acid'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'There are 9 essential amino acids for humans; cereal grains (wheat/rice) are typically limiting in Lysine, while legumes (lentils/pulses) are limiting in Methionine.'
      },
      {
        id: 'ex5-q6',
        qNum: 6,
        category: 'Protein Complementation',
        question: 'Why does combining Cereal Grains (e.g., rice or wheat chapati) with Legumes/Pulses (e.g., daal/lentils or chickpeas) create a high-quality "Complete Protein" profile?',
        options: [
          'It doubles the fat content',
          'Cereals are low in Lysine but rich in Methionine, whereas Legumes are rich in Lysine and low in Methionine—so they mutually complement each other’s limiting amino acids',
          'It removes all carbohydrates',
          'It converts starch into Vitamin B12'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Mutual amino acid complementation between cereals (high methionine) and pulses (high lysine) dramatically raises the PDCAAS/DIAAS protein quality score.'
      },
      {
        id: 'ex5-q7',
        qNum: 7,
        category: 'Proximate Analysis — Protein',
        question: 'In the AOAC Kjeldahl Method for crude protein determination, total organic nitrogen (% N) is measured and multiplied by a conversion factor. What is the general conversion factor for most foods, and the specific factor for Dairy products?',
        options: [
          'General = 6.25 (since most proteins are ~16% nitrogen); Dairy = 6.38 (Wheat flour = 5.70)',
          'General = 10.0; Dairy = 2.0',
          'General = 1.0; Dairy = 1.0',
          'General = 4.0; Dairy = 9.0'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: '100 / 16% N = 6.25 is the general Kjeldahl protein factor; dairy casein/whey contains 15.67% N (factor 6.38), and refined wheat flour uses 5.70.'
      },
      {
        id: 'ex5-q8',
        qNum: 8,
        category: 'Proximate Analysis — Fat',
        question: 'Which laboratory apparatus and organic solvent are classically used for continuous solid-liquid extraction of Crude Fat from dried solid food samples?',
        options: [
          'Soxhlet Extractor using Petroleum Ether or Hexane',
          'Gerber Butyrometer using Water',
          'Refractometer using Alcohol',
          'Muffle Furnace at 550°C'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Soxhlet extraction uses non-polar solvents (hexane or petroleum ether) to extract free lipids from dried, ground food samples.'
      },
      {
        id: 'ex5-q9',
        qNum: 9,
        category: 'Proximate Analysis — Ash',
        question: 'In proximate food analysis, how is Total Ash (total mineral content) determined?',
        options: [
          'Boiling in water for 10 minutes',
          'Incinerating a weighed food sample in a Muffle Furnace at 550°C–600°C until all organic carbon is burned off, leaving inorganic mineral residue',
          'Drying in a hot air oven at 105°C',
          'Titrating with HCl'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Dry ashing in a muffle furnace at 550°C oxidizes all organic matter (protein, fat, carbs) to CO2 and H2O, leaving inorganic mineral ash.'
      },
      {
        id: 'ex5-q10',
        qNum: 10,
        category: 'Dairy Science — Milk Composition',
        question: 'What is the Isoelectric Point (pH) of Casein (making up ~80% of cow milk protein) at which casein micelles lose their net negative charge and precipitate to form curd?',
        options: ['pH 7.0', 'pH 6.6', 'pH 4.6', 'pH 2.0'],
        correctIndex: 2,
        marks: 2,
        explanation: 'Fresh cow milk has a pH of 6.6–6.7; when acidified to pH 4.6 (by lactic acid bacteria or acid), casein reaches zero net charge and coagulates.'
      },
      {
        id: 'ex5-q11',
        qNum: 11,
        category: 'Dairy Science — Cheese Making',
        question: 'In enzymatic cheese manufacture (Cheddar/Mozzarella), which enzyme in Chymosin (Rennet) specifically cleaves kappa-casein at the Phe105–Met106 bond to trigger curd clotting in the presence of Ca2+ ions?',
        options: ['Amylase', 'Chymosin (Rennin)', 'Lipase', 'Lactase'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Chymosin cleaves the hydrophilic glycomacropeptide hair layer from kappa-casein, causing para-casein micelles to aggregate into a firm gel.'
      },
      {
        id: 'ex5-q12',
        qNum: 12,
        category: 'Dairy Science — Gerber Fat Test',
        question: 'In the Gerber Method for testing milk fat % in a butyrometer, what are the roles of 90% Sulfuric Acid (sp. gr. 1.820–1.825) and Isoamyl Alcohol?',
        options: [
          'Water dilution only',
          'Sulfuric acid digests casein proteins and generates heat to melt fat; Isoamyl alcohol lowers interfacial tension so fat separates cleanly into a transparent column during centrifugation',
          'They freeze the milk',
          'They measure lactose'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: '10 mL H2SO4 dissolves protein/SNF and releases fat globules, while 1 mL isoamyl alcohol ensures clean phase separation at 1100 rpm.'
      },
      {
        id: 'ex5-q13',
        qNum: 13,
        category: 'Dairy Science — Cryoscope',
        question: 'What is the normal Freezing Point range of pure, unadulterated cow/buffalo milk (measured by a Thermistor Cryoscope), and what happens to the freezing point if water is fraudulently added?',
        options: [
          'Normal is -0.530°C to -0.550°C; adding water shifts the freezing point closer to 0.000°C (e.g., -0.450°C)',
          'Normal is 0.000°C; adding water lowers it to -5°C',
          'Normal is +4°C',
          'Freezing point never changes with water'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Dissolved lactose and minerals depress pure milk’s freezing point to ~ -0.540°C; dilution with water moves the freezing point toward 0°C.'
      },
      {
        id: 'ex5-q14',
        qNum: 14,
        category: 'Edible Oils — Lipid Oxidation',
        question: 'What are the three free-radical stages of Lipid Autoxidation (oxidative rancidity) in unsaturated fats and oils?',
        options: [
          'Melting, Boiling, Freezing',
          'Initiation (formation of alkyl radical R•), Propagation (reaction with O2 to form peroxyl radical ROO• and hydroperoxides ROOH), and Termination (formation of non-radical dimers/aldehydes)',
          'Hydrolysis, Saponification, Esterification',
          'Fermentation, Pasteurization, Homogenization'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Autoxidation proceeds via a free-radical chain reaction: Initiation -> Propagation -> Termination, catalyzed by light, heat, and trace Cu/Fe ions.'
      },
      {
        id: 'ex5-q15',
        qNum: 15,
        category: 'Edible Oils — Antioxidants',
        question: 'Which synthetic phenolic antioxidants (and their typical 100–200 ppm legal limit on fat basis) are added to frying oils and snacks to donate hydrogen atoms and break the free-radical oxidation chain?',
        options: [
          'TBHQ (Tertiary Butylhydroquinone), BHA (Butylated Hydroxyanisole), and BHT (Butylated Hydroxytoluene)',
          'Sodium Chloride and Sugar',
          'Xanthan Gum and Guar Gum',
          'Titanium Dioxide and Tartrazine'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'TBHQ (especially effective in high-heat frying oils), BHA, BHT, and natural Tocopherols (Vitamin E) act as chain-breaking free-radical scavengers.'
      },
      {
        id: 'ex5-q16',
        qNum: 16,
        category: 'Edible Oils — Trans Fats',
        question: 'How are artificial Industrial Trans Fatty Acids (iTFAs, which raise LDL cholesterol and lower HDL cholesterol) formed, and what is the WHO "REPLACE" global limit?',
        options: [
          'Formed during cold pressing of olives',
          'Formed during Partial Catalytic Hydrogenation of liquid vegetable oils; WHO limit is ≤ 2g industrial trans fat per 100g of total fat/oil',
          'Formed by adding water to butter',
          'Formed during refrigeration'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Partial hydrogenation converts cis double bonds into trans isomers (elaidic acid); full hydrogenation or enzymatic interesterification avoids trans fats.'
      },
      {
        id: 'ex5-q17',
        qNum: 17,
        category: 'Edible Oils — Iodine Value',
        question: 'What does the Iodine Value (IV, g of I2 absorbed per 100g oil) of an edible oil or fat measure?',
        options: [
          'Free water content',
          'The degree of Unsaturation (number of C=C double bonds in the fatty acid chains)',
          'Salt concentration',
          'Peroxide rancidity'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'A higher Iodine Value indicates higher unsaturation (e.g., soybean/sunflower oil IV ~ 125–140 vs. coconut oil IV ~ 8–10).'
      },
      {
        id: 'ex5-q18',
        qNum: 18,
        category: 'Starch Chemistry',
        question: 'Starch granules consist of two glucose polymers: linear Amylose (alpha-1,4 linkages) and branched Amylopectin (alpha-1,4 and alpha-1,6 linkages). What happens during Starch Retrogradation as baked bread cools and stales?',
        options: [
          'Starch turns into protein',
          'Gelatinized Amylose and outer Amylopectin chains re-align and recrystallize via hydrogen bonding, expelling water (syneresis) and firming the bread crumb (staling)',
          'Gluten dissolves into sugar',
          'Yeast starts growing again'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Starch retrogradation (recrystallization of amylose and amylopectin) is the primary physical-chemical cause of bread staling and gel syneresis.'
      },
      {
        id: 'ex5-q19',
        qNum: 19,
        category: 'Enzymatic Browning',
        question: 'When apples, potatoes, or bananas are sliced and exposed to air, which copper-containing enzyme oxidizes phenolic compounds into brown o-quinones and melanins?',
        options: [
          'Polyphenol Oxidase (PPO / Tyrosinase)',
          'Pepsin',
          'Lactase',
          'Invertase'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Polyphenol Oxidase (PPO) catalyzes enzymatic browning in the presence of oxygen; it is controlled by dipping in ascorbic acid + citric acid, blanching, or vacuum packing.'
      },
      {
        id: 'ex5-q20',
        qNum: 20,
        category: 'Food Emulsifiers',
        question: 'In food emulsion science, what does the HLB (Hydrophilic-Lipophilic Balance, scale 0 to 20) value of an emulsifier indicate?',
        options: [
          'Whether the emulsifier stabilizes Water-in-Oil (W/O, low HLB 3–6 like PGPR/mono-diglycerides in margarine) or Oil-in-Water (O/W, high HLB 8–18 like Polysorbate 80 in dressings) emulsions',
          'The melting point of sugar',
          'The pH of water',
          'The calorie count of oil'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Bancroft’s rule & HLB scale: Low HLB (3–6) emulsifiers are lipophilic and stabilize W/O emulsions (butter/margarine); High HLB (8–18) stabilize O/W emulsions (milk/mayonnaise).'
      },
      {
        id: 'ex5-q21',
        qNum: 21,
        category: 'Fruit Jam & Pectin Chemistry',
        question: 'What are the exact 3 parameters required for High-Methoxyl (HM) Pectin (Degree of Esterification > 50%) to form a firm jam/jelly gel network?',
        options: [
          'High fat, pH 7.0, and zero sugar',
          'Soluble Solids (Sugar) ≥ 60–65 °Brix (dehydrates pectin micelles) AND Acid pH 2.8 to 3.4 (suppresses carboxyl negative charge repulsion)',
          'Calcium chloride only with zero sugar',
          'Freezing at -20°C'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'HM Pectin requires 60–65% sugar (to bind water) and pH 2.8–3.4 (to protonate COO- groups). Low-Methoxyl (LM) pectin gels with Ca2+ ions in low-sugar jams.'
      },
      {
        id: 'ex5-q22',
        qNum: 22,
        category: 'Meat Science — Rigor Mortis & PSE/DFD',
        question: 'In meat science, what causes PSE (Pale, Soft, Exudative) meat vs. DFD (Dark, Firm, Dry) meat after slaughter?',
        options: [
          'PSE is caused by acute short-term pre-slaughter stress (rapid pH drop < 5.4 while carcass is still hot > 35°C, denaturing sarcoplasmic proteins); DFD is caused by chronic long-term stress depleting muscle glycogen so ultimate pH remains high (> 6.0)',
          'PSE is caused by freezing too fast',
          'DFD is caused by adding too much salt',
          'Both are caused by vitamin C'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Normal muscle glycogen converts to lactic acid post-mortem, lowering pH from 7.0 to ~5.5. Rapid hot acid drop causes PSE; glycogen exhaustion leaves high pH (>6.0) DFD meat with short microbial shelf life.'
      },
      {
        id: 'ex5-q23',
        qNum: 23,
        category: 'Meat Pigments',
        question: 'What are the three chemical states of the meat pigment Myoglobin responsible for Purplish-Red (vacuum), Bright Cherry-Red (bloomed in air), and Brown (oxidized) meat colors?',
        options: [
          'Chlorophyll, Carotene, Lycopene',
          'Deoxymyoglobin (Fe2+, purplish-red), Oxymyoglobin (Fe2+ + O2, bright cherry-red), and Metmyoglobin (oxidized Fe3+, brown)',
          'Hemoglobin, Albumin, Casein',
          'Melanin, Anthocyanin, Betalain'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'When Fe2+ in myoglobin is oxygenated it forms bright red Oxymyoglobin; when oxidized to ferric Fe3+ it forms brown Metmyoglobin.'
      },
      {
        id: 'ex5-q24',
        qNum: 24,
        category: 'Cereal Milling',
        question: 'In wheat flour roller milling, what does "Extraction Rate (%)" mean, and why is 72% extraction white flour lower in vitamins/minerals than 100% whole wheat (Atta) flour?',
        options: [
          'Extraction rate is the water added to dough',
          'Extraction rate is the percentage of flour weight recovered from cleaned wheat grain; 72% extraction removes the Bran and Germ (which contain most B-vitamins, Vitamin E, iron, zinc, and dietary fiber), leaving mostly starchy Endosperm',
          '72% flour has more bran',
          '100% flour has zero protein'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'The aleurone layer, bran, and germ hold the majority of micronutrients and fiber; therefore low-extraction white flour is often fortified with Iron, Folic Acid, Zinc, and B12.'
      },
      {
        id: 'ex5-q25',
        qNum: 25,
        category: 'Food Fortification',
        question: 'Under Pakistan / international mandatory food fortification laws, which two fat-soluble vitamins are fortified into Edible Vegetable Ghee and Cooking Oil, and which mineral is fortified into Table Salt?',
        options: [
          'Vitamins A & D in Oil/Ghee; Iodine (Potassium Iodate) in Salt',
          'Vitamin C in Oil; Calcium in Salt',
          'Vitamin B12 in Oil; Magnesium in Salt',
          'Vitamin K in Oil; Copper in Salt'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'Edible Oil/Ghee is fortified with Vitamins A (33,000–45,000 IU/kg) and D (3,000–4,500 IU/kg), and Salt is iodized (30–50 ppm) to prevent goiter and cretinism.'
      },
      {
        id: 'ex5-q26',
        qNum: 26,
        category: 'Micronutrient Deficiencies',
        question: 'Match the micronutrient deficiency to its classic clinical disorder: Iron, Iodine, Vitamin A, Vitamin D, and Folic Acid (Vitamin B9).',
        options: [
          'Iron = Microcytic Anemia; Iodine = Goiter/Hypothyroidism; Vitamin A = Night Blindness (Xerophthalmia); Vitamin D = Rickets/Osteomalacia; Folic Acid = Neural Tube Defects (Spina Bifida)',
          'Iron = Rashes; Iodine = Scurvy; Vitamin A = Rickets',
          'All cause diabetes',
          'All cause hypertension'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'These five micronutrient deficiencies represent the primary global public health "Hidden Hunger" targets.'
      },
      {
        id: 'ex5-q27',
        qNum: 27,
        category: 'Dietary Fiber & Glycemic Index',
        question: 'How does Soluble Dietary Fiber (e.g., beta-glucan in oats/barley, pectin in apples, psyllium husk) help manage blood glucose and LDL cholesterol?',
        options: [
          'It converts glucose into fat',
          'It forms a viscous gel in the small intestine that slows glucose absorption (lowering Glycemic Index) and binds bile acids to increase hepatic LDL cholesterol clearance',
          'It blocks water absorption completely',
          'It digests protein'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Soluble fiber increases chyme viscosity, blunting postprandial blood glucose spikes and excreting bile salts.'
      },
      {
        id: 'ex5-q28',
        qNum: 28,
        category: 'Sensory Evaluation',
        question: 'In a Sensory Evaluation panel, what is a "Triangle Test" (ISO 4120) and how is it conducted?',
        options: [
          'Asking 3 people if they like the package',
          'A discriminative difference test where a panelist is presented simultaneously with 3 coded samples (2 identical and 1 different, e.g., AAB, ABA, BAA) and asked to identify the odd sample',
          'Measuring food in a triangular cup',
          'Testing 3 different brands for price'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'The Triangle Test has a 1/3 (33.3%) chance probability of guessing correctly and is used to verify whether an ingredient substitution or process change alters product flavor.'
      },
      {
        id: 'ex5-q29',
        qNum: 29,
        category: 'Sensory Evaluation',
        question: 'What is the standard affective consumer test scale used to measure overall product acceptability and liking in R&D?',
        options: [
          'The 9-Point Hedonic Scale (ranging from 1 = "Dislike Extremely", 5 = "Neither Like nor Dislike", to 9 = "Like Extremely")',
          'The Litmus Scale (1 to 14)',
          'The Mohs Hardness Scale',
          'The Brix Scale'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'The 9-Point Hedonic Scale developed by Peryam & Pilgrim is the global industry standard for consumer preference and liking tests.'
      },
      {
        id: 'ex5-q30',
        qNum: 30,
        category: 'Statistical Process Control (SPC)',
        question: 'In Statistical Process Control (SPC) for net weight filling lines, what do Cp and Cpk (Process Capability Index) values ≥ 1.33 indicate?',
        options: [
          'The filling machine is out of control',
          'The filling process variation (6 sigma spread) is well-centered and fits comfortably within the Upper and Lower Specification Limits (USL/LSL) with minimal defect rate',
          'The packages are underweight',
          'The scale is broken'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'A Cpk ≥ 1.33 (4-sigma capability) indicates a capable, well-centered filling process.'
      },
      {
        id: 'ex5-q31',
        qNum: 31,
        category: 'Instrumental Analysis — HPLC vs GC',
        question: 'In an advanced Food QA Laboratory, when do you use HPLC (High-Performance Liquid Chromatography) vs. GC (Gas Chromatography)?',
        options: [
          'HPLC is used for non-volatile, thermally labile compounds in liquid phase (e.g., Aflatoxins, Vitamins, Sugars, Caffeine, Artificial Sweeteners); GC is used for volatile or semi-volatile thermally stable compounds (e.g., Fatty Acid Methyl Esters / FAME, Aroma Volatiles, Pesticide Residues)',
          'HPLC only tests water; GC only tests rocks',
          'Both only test color',
          'GC is used for large proteins'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'HPLC separates non-volatile compounds dissolved in a liquid mobile phase, while GC vaporizes volatile analytes in an inert carrier gas.'
      },
      {
        id: 'ex5-q32',
        qNum: 32,
        category: 'Heavy Metals Analysis',
        question: 'Which analytical instrument is used in food testing laboratories to quantify trace toxic Heavy Metals (Lead Pb, Cadmium Cd, Arsenic As, Mercury Hg) at parts-per-billion (ppb) levels?',
        options: [
          'Atomic Absorption Spectrophotometer (AAS) or Inductively Coupled Plasma Mass Spectrometry (ICP-MS)',
          'Hand Refractometer',
          'Lactometer',
          'Brookfield Viscometer'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'AAS and ICP-MS/ICP-OES quantify elemental heavy metals after microwave acid digestion of the food matrix.'
      },
      {
        id: 'ex5-q33',
        qNum: 33,
        category: 'Colorimetry',
        question: 'In the CIE L*a*b* Hunter Colorimeter system used for tomato paste, flour, and snacks, what do the L*, a*, and b* axes represent?',
        options: [
          'Length, Area, Breadth',
          'L* = Lightness (0 Black to 100 White); +a* = Red / -a* = Green; +b* = Yellow / -b* = Blue',
          'Lactose, Acidity, Brix',
          'Lipid, Ash, Moisture'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'CIE L*a*b* provides objective 3D color coordinates: L* (Lightness), a* (Red-Green), and b* (Yellow-Blue).'
      },
      {
        id: 'ex5-q34',
        qNum: 34,
        category: 'Beverage Carbonation',
        question: 'In Carbonated Soft Drink (CSD) manufacturing, why is water chilled to 2°C–4°C inside the Carbonator before injecting CO2 gas?',
        options: [
          'To freeze the syrup',
          'According to Henry’s Law, the solubility of a gas (CO2) in liquid increases significantly as liquid temperature decreases and pressure increases',
          'CO2 is only liquid at 100°C',
          'To clean the pipes'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Gas solubility in liquids is inversely proportional to temperature; chilling water to 2–4°C maximizes CO2 absorption and prevents foaming during filling.'
      },
      {
        id: 'ex5-q35',
        qNum: 35,
        category: 'Sugar Inversion',
        question: 'What is "Invert Sugar" (used in confectionery and beverages to prevent sugar crystallization and retain moisture), and how is it produced from Sucrose?',
        options: [
          'Powdered starch mixed with oil',
          'An equimolar mixture of D-Glucose (Dextrose) and D-Fructose (Levulose) produced by acid+heat hydrolysis or Invertase enzyme cleavage of sucrose',
          'Burnt caramel',
          'Artificial aspartame'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Hydrolyzing sucrose yields 1:1 glucose + fructose (Invert Sugar), which shifts optical rotation from dextrorotatory (+66.5°) to levorotatory (-20°), increases sweetness, and prevents graining.'
      },
      {
        id: 'ex5-q36',
        qNum: 36,
        category: 'High-Intensity Sweeteners',
        question: 'Why must food products sweetened with Aspartame (E951, a methyl ester dipeptide of L-aspartic acid and L-phenylalanine, 200x sweeter than sucrose) carry a mandatory label warning: "Contains a source of Phenylalanine"?',
        options: [
          'For diabetic patients',
          'To protect individuals with the genetic metabolic disorder Phenylketonuria (PKU), who lack phenylalanine hydroxylase enzyme and suffer brain damage if phenylalanine accumulates',
          'Because phenylalanine is a nut allergen',
          'Because aspartame is bitter'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Digestion of Aspartame releases L-phenylalanine, which is neurotoxic to patients with Phenylketonuria (PKU).'
      },
      {
        id: 'ex5-q37',
        qNum: 37,
        category: 'Chocolate Tempering',
        question: 'In chocolate manufacturing, why must molten chocolate be "Tempered" (precisely cooled and sheared at 27°C -> 31–32°C) before molding?',
        options: [
          'To evaporate water',
          'To crystallize Cocoa Butter selectively into the stable Polymorphic Form V (Beta-5 crystal, melting at 33.8°C), giving glossy snap and preventing gray/white "Fat Bloom" during storage',
          'To kill Salmonella',
          'To dissolve sugar'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Cocoa butter is polymorphic (Forms I to VI); Form V (Beta) gives glossy appearance, firm snap, contraction for demolding, and resistance to fat bloom.'
      },
      {
        id: 'ex5-q38',
        qNum: 38,
        category: 'Extrusion Technology',
        question: 'In high-temperature short-time (HTST) Twin-Screw Extrusion of puffed corn snacks and breakfast cereals, what causes the dough to puff and expand instantaneously as it exits the extruder die?',
        options: [
          'Yeast fermentation',
          'Superheated water trapped under high pressure (30–100 bar, 140–180°C) inside the barrel flashes instantaneously into steam upon exiting to atmospheric pressure, expanding the gelatinized starch matrix',
          'Baking soda reaction only',
          'Injected air'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Flash evaporation of superheated moisture at the die exit expands the viscoelastic starch melt into a porous crispy foam.'
      },
      {
        id: 'ex5-q39',
        qNum: 39,
        category: 'Hydrocolloids & Gums',
        question: 'Why is Xanthan Gum (E415, an exopolysaccharide produced by Xanthomonas campestris) universally added at 0.1%–0.3% to salad dressings, sauces, and tomato ketchup?',
        options: [
          'To add red color',
          'Because it exhibits extreme Pseudoplastic (Shear-Thinning) rheology—providing high viscosity at rest to suspend herbs/spices without phase separation, yet flowing smoothly when shaken or poured',
          'To increase sweetness',
          'To replace salt'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Xanthan gum is stable across wide pH (2–12) and temperature ranges and provides shear-thinning (pseudoplastic) suspension stability.'
      },
      {
        id: 'ex5-q40',
        qNum: 40,
        category: 'Ice Cream Overrun',
        question: 'In Ice Cream manufacturing, if 100 Liters of liquid ice cream mix is whipped and frozen to produce 180 Liters of finished ice cream, what is the "% Overrun"?',
        options: ['18%', '80% Overrun [(180 - 100) ÷ 100 × 100]', '180%', '50%'],
        correctIndex: 1,
        marks: 2,
        explanation: '% Overrun = [(Volume of Ice Cream - Volume of Mix) / Volume of Mix] × 100 = (80 / 100) × 100 = 80%.'
      },
      {
        id: 'ex5-q41',
        qNum: 41,
        category: 'Codex Alimentarius',
        question: 'Which two United Nations organizations jointly established the Codex Alimentarius Commission (CAC) in 1963 to develop international food standards, guidelines, and codes of practice?',
        options: [
          'UNICEF and UNESCO',
          'FAO (Food and Agriculture Organization) and WHO (World Health Organization)',
          'IMF and World Bank',
          'ILO and UNDP'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'The Joint FAO/WHO Food Standards Programme runs the Codex Alimentarius Commission, recognized by the WTO SPS Agreement as the global benchmark for food safety.'
      },
      {
        id: 'ex5-q42',
        qNum: 42,
        category: 'INS / E-Numbers',
        question: 'In the International Numbering System (INS / E-Numbers) on food ingredient labels, what functional classes correspond to the 100s, 200s, 300s, and 400s series?',
        options: [
          '100s = Food Colors; 200s = Preservatives; 300s = Antioxidants & Acidity Regulators; 400s = Thickeners, Stabilizers & Emulsifiers',
          '100s = Flavors; 200s = Sugars; 300s = Vitamins; 400s = Salts',
          'All are artificial colors',
          'All are preservatives'
        ],
        correctIndex: 0,
        marks: 2,
        explanation: 'E100–199 = Colors; E200–299 = Preservatives; E300–399 = Antioxidants/Acidulants; E400–499 = Thickeners/Emulsifiers/Stabilizers; E600s = Flavor Enhancers; E900s = Sweeteners/Glazing agents.'
      },
      {
        id: 'ex5-q43',
        qNum: 43,
        category: 'Flavor Enhancers',
        question: 'Which amino acid salt (E621) elicits the fifth basic taste "Umami" (savory) on human tongue glutamate receptors?',
        options: ['Sodium Chloride', 'Monosodium L-Glutamate (MSG — E621)', 'Citric Acid', 'Sucralose'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Monosodium Glutamate (E621), synergistic with 5’-ribonucleotides (IMP E631 and GMP E627), activates T1R1/T1R3 umami taste receptors.'
      },
      {
        id: 'ex5-q44',
        qNum: 44,
        category: 'Natural vs Artificial Colors',
        question: 'Which of the following is a NATURAL food pigment rather than a synthetic azo dye?',
        options: [
          'Tartrazine (E102)',
          'Curcumin (E100 from turmeric), Beta-Carotene (E160a), Anthocyanins (E163), and Betanin (E162 from beetroot)',
          'Sunset Yellow FCF (E110)',
          'Allura Red AC (E129)'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Curcumin, carotenoids, anthocyanins, chlorophylls, and betanin are natural pigments, whereas Tartrazine, Sunset Yellow, and Allura Red are synthetic azo dyes.'
      },
      {
        id: 'ex5-q45',
        qNum: 45,
        category: 'Lactose Intolerance & Dairy R&D',
        question: 'How is commercial "Lactose-Free Milk" manufactured in the dairy industry, and why does it taste slightly sweeter than regular milk without any added sugar?',
        options: [
          'By boiling off the lactose',
          'By adding Beta-Galactosidase (Lactase) enzyme, which hydrolyzes the disaccharide Lactose (low sweetness ~16) into its monosaccharides Glucose (sweetness ~74) and Galactose (sweetness ~32)',
          'By adding sucralose',
          'By skimming the fat'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Lactase cleaves lactose into glucose and galactose, which have higher relative sweetness and are absorbed directly without causing osmotic bloating.'
      },
      {
        id: 'ex5-q46',
        qNum: 46,
        category: 'Nutrition — Iron Bioavailability',
        question: 'Which dietary vitamin strongly enhances the intestinal absorption of Non-Heme Iron (Fe3+ -> Fe2+) from plant foods like spinach, lentils, and fortified wheat flour, whereas Phytates and Tea Tannins (Polyphenols) inhibit it?',
        options: ['Vitamin D', 'Vitamin C (Ascorbic Acid)', 'Vitamin B1', 'Vitamin K'],
        correctIndex: 1,
        marks: 2,
        explanation: 'Ascorbic acid (Vitamin C) reduces ferric iron (Fe3+) to the more soluble ferrous state (Fe2+) and forms an absorbable chelate, counteracting phytic acid inhibition.'
      },
      {
        id: 'ex5-q47',
        qNum: 47,
        category: 'Nutrition — Basal Metabolic Rate',
        question: 'Which physiological tissue component is the single largest determinant of an individual’s resting Basal Metabolic Rate (BMR)?',
        options: [
          'Hair and nails',
          'Fat-Free Mass / Lean Muscle Mass and metabolically active organs (liver, brain, heart, kidneys)',
          'Subcutaneous fat only',
          'Bone mineral density'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Lean body mass (skeletal muscle and visceral organs) accounts for ~70–80% of variance in resting Basal Metabolic Rate.'
      },
      {
        id: 'ex5-q48',
        qNum: 48,
        category: 'Nutrition — Hydration & Electrolytes',
        question: 'In WHO Oral Rehydration Solution (ORS) and sports hydration science, why are Glucose and Sodium formulated together in a specific equimolar ratio?',
        options: [
          'Just for sweet-salty taste',
          'To activate the intestinal SGLT-1 (Sodium-Glucose Linked Transporter-1) cotransporter in enterocytes, which actively pumps 1 glucose + 2 Na+ ions across the gut wall, pulling water in rapidly by osmosis',
          'To kill bacteria in the stomach',
          'To slow down water absorption'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'The SGLT-1 sodium-glucose cotransport mechanism remains intact even during secretory diarrhea and enables rapid intestinal water and electrolyte absorption.'
      },
      {
        id: 'ex5-q49',
        qNum: 49,
        category: 'Baking Science — Leavening',
        question: 'What is the difference between Baking Soda and Double-Acting Baking Powder in biscuit and cake formulation?',
        options: [
          'They are identical',
          'Baking Soda is pure Sodium Bicarbonate (NaHCO3, requires an acidic ingredient in the batter to release CO2); Baking Powder contains Sodium Bicarbonate PLUS dry acid salts (e.g., MCP + SAPP) and cornstarch filler, releasing CO2 both during cold mixing and during oven heating',
          'Baking powder contains live yeast',
          'Baking soda is acidic'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Double-acting baking powder combines a fast cold-reacting acid salt (Monocalcium Phosphate) and a heat-activated acid salt (Sodium Acid Pyrophosphate) with NaHCO3.'
      },
      {
        id: 'ex5-q50',
        qNum: 50,
        category: 'Nutrition Labeling Regulations',
        question: 'On a mandatory Nutrition Facts Panel, in what order must ingredients be listed in the "Ingredients List" below the nutrition table?',
        options: [
          'Alphabetical order from A to Z',
          'In descending order of predominance by weight (from highest weight to lowest weight at the time of manufacture)',
          'In ascending order from lowest to highest',
          'In random order chosen by marketing'
        ],
        correctIndex: 1,
        marks: 2,
        explanation: 'Codex, FDA, EU, and Pakistani food labeling laws strictly mandate listing all ingredients in descending order of weight.'
      }
    ]
  }
];
