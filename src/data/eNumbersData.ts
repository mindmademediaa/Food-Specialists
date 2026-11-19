export interface ENumberAdditive {
  code: string;
  name: string;
  category:
    | 'Preservative'
    | 'Antioxidant'
    | 'Color'
    | 'Emulsifier & Stabilizer'
    | 'Acidity Regulator'
    | 'Sweetener'
    | 'Flavor Enhancer'
    | 'Anti-Caking & Glazing';
  insNumber: string;
  functionSummary: string;
  commonFoods: string;
  codexMaxLimit: string;
  halalStatus: 'Halal (Plant / Synthetic)' | 'Mushbooh (Verify Animal vs Plant Source)' | 'Haram / Restricted';
  safetyNotes: string;
}

export const E_NUMBERS_DATABASE: ENumberAdditive[] = [
  // PRESERVATIVES (E200 - E299)
  {
    code: 'E200',
    name: 'Sorbic Acid',
    category: 'Preservative',
    insNumber: 'INS 200',
    functionSummary: 'Antifungal preservative effective against yeasts and molds (pH < 6.5).',
    commonFoods: 'Cheese, bakery goods, fruit juices, margarine, syrups, pickles',
    codexMaxLimit: '200 – 1,000 mg/kg (PPM) depending on food category',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–25 mg/kg body weight. Safe and widely approved globally.'
  },
  {
    code: 'E202',
    name: 'Potassium Sorbate',
    category: 'Preservative',
    insNumber: 'INS 202',
    functionSummary: 'Highly water-soluble salt of sorbic acid; inhibits mold and yeast growth.',
    commonFoods: 'Fruit drinks, nectars, yogurt, cheese, sauces, dried fruits, cakes',
    codexMaxLimit: '500 – 1,000 mg/kg (PPM)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Most common beverage/dairy antifungal preservative. Effective up to pH 6.5.'
  },
  {
    code: 'E203',
    name: 'Calcium Sorbate',
    category: 'Preservative',
    insNumber: 'INS 203',
    functionSummary: 'Antifungal preservative used on dairy surfaces and fat emulsions.',
    commonFoods: 'Processed cheese, margarine, dairy spreads, bakery fillings',
    codexMaxLimit: '500 – 1,000 mg/kg (PPM)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Used where low water solubility is desired for surface mold protection.'
  },
  {
    code: 'E210',
    name: 'Benzoic Acid',
    category: 'Preservative',
    insNumber: 'INS 210',
    functionSummary: 'Antimicrobial preservative against yeasts and bacteria in acidic foods (pH 2.5–4.5).',
    commonFoods: 'Carbonated soft drinks, fruit squashes, jams, pickles, ketchup',
    codexMaxLimit: '150 – 1,000 mg/kg (PPM)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–5 mg/kg bw. Avoid combining with Ascorbic Acid (E300) under heat/light to prevent trace benzene formation.'
  },
  {
    code: 'E211',
    name: 'Sodium Benzoate',
    category: 'Preservative',
    insNumber: 'INS 211',
    functionSummary: 'Water-soluble salt of benzoic acid; primary preservative for acidic beverages & sauces.',
    commonFoods: 'Soft drinks, fruit juices, ketchup, chili sauce, soy sauce, jams, syrups',
    codexMaxLimit: '150 – 600 mg/kg in beverages; up to 1,000 mg/kg in sauces',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Requires pH below 4.5 for active undissociated benzoic acid efficacy.'
  },
  {
    code: 'E212',
    name: 'Potassium Benzoate',
    category: 'Preservative',
    insNumber: 'INS 212',
    functionSummary: 'Low-sodium alternative to Sodium Benzoate for acidic beverages.',
    commonFoods: 'Diet soft drinks, low-sodium sauces, fruit concentrates',
    codexMaxLimit: '150 – 600 mg/kg (PPM)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–5 mg/kg bw (expressed as benzoic acid).'
  },
  {
    code: 'E220',
    name: 'Sulfur Dioxide',
    category: 'Preservative',
    insNumber: 'INS 220',
    functionSummary: 'Preservative and anti-browning agent (inhibits enzymatic & non-enzymatic browning).',
    commonFoods: 'Dried apricots, raisins, dehydrated potatoes, fruit pulp, cordials',
    codexMaxLimit: '50 – 2,000 mg/kg (dried fruits); 350 mg/kg (fruit pulp)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Mandatory allergen declaration required if >10 mg/kg (PPM) due to sulfite sensitivity in asthmatics.'
  },
  {
    code: 'E223',
    name: 'Sodium Metabisulfite (SMBS)',
    category: 'Preservative',
    insNumber: 'INS 223',
    functionSummary: 'Preservative, antioxidant, bleaching agent, and dough conditioner (reducing agent).',
    commonFoods: 'Hard biscuits/crackers (dough relaxation), dried fruits, shrimp (black spot prevention), fruit pulp',
    codexMaxLimit: '50 – 500 mg/kg as residual SO2',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Destroys Vitamin B1 (Thiamine). Must declare "Contains Sulfites" if residual SO2 > 10 PPM.'
  },
  {
    code: 'E224',
    name: 'Potassium Metabisulfite (KMS)',
    category: 'Preservative',
    insNumber: 'INS 224',
    functionSummary: 'Sulfite preservative widely used in bulk mango/fruit pulp preservation.',
    commonFoods: 'Bulk fruit pulp, squashes, dried vegetables, syrups',
    codexMaxLimit: '50 – 1,000 mg/kg as SO2',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Allergen label required above 10 mg/kg residual SO2.'
  },
  {
    code: 'E234',
    name: 'Nisin',
    category: 'Preservative',
    insNumber: 'INS 234',
    functionSummary: 'Natural bacteriocin peptide produced by Lactococcus lactis; inhibits Gram-positive spore formers (Clostridium, Bacillus).',
    commonFoods: 'Processed cheese, clotted cream, canned vegetables, pasteurized liquid egg',
    codexMaxLimit: '12.5 mg/kg (PPM) in processed cheese',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Natural bio-preservative; digested by human proteases.'
  },
  {
    code: 'E235',
    name: 'Natamycin (Pimaricin)',
    category: 'Preservative',
    insNumber: 'INS 235',
    functionSummary: 'Natural antifungal polyene macrolide for surface treatment of cheese and sausages.',
    commonFoods: 'Hard and semi-hard cheese rinds, dry cured sausages',
    codexMaxLimit: '20 mg/kg on surface (not detectable at 5 mm depth)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Strictly for surface application against mold; zero activity against bacteria.'
  },
  {
    code: 'E250',
    name: 'Sodium Nitrite',
    category: 'Preservative',
    insNumber: 'INS 250',
    functionSummary: 'Curing salt; prevents Clostridium botulinum growth and fixes pink cured meat color.',
    commonFoods: 'Cured beef, sausages, frankfurters, salami, corned beef',
    codexMaxLimit: '80 – 150 mg/kg (PPM) ingoing; 50–80 mg/kg residual',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Strictly controlled maximum limit. Often paired with Ascorbate (E301) to inhibit nitrosamine formation.'
  },
  {
    code: 'E251',
    name: 'Sodium Nitrate',
    category: 'Preservative',
    insNumber: 'INS 251',
    functionSummary: 'Slow-release curing preservative for long-maturing cured meats and hard cheeses.',
    commonFoods: 'Dry-cured meats, Gouda/Edam cheese (prevents late blowing by Clostridia)',
    codexMaxLimit: '150 – 300 mg/kg (PPM)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Converts slowly to nitrite via starter cultures.'
  },
  {
    code: 'E260',
    name: 'Acetic Acid (Glacial / Food Grade)',
    category: 'Preservative',
    insNumber: 'INS 260',
    functionSummary: 'Acidulant and antimicrobial preservative.',
    commonFoods: 'Pickles, mayonnaise, salad dressings, ketchup, chutneys',
    codexMaxLimit: 'GMP (Good Manufacturing Practice)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'GRAS status; lowers pH to inhibit pathogenic bacteria.'
  },
  {
    code: 'E282',
    name: 'Calcium Propionate',
    category: 'Preservative',
    insNumber: 'INS 282',
    functionSummary: 'Primary bakery mold and "rope" (Bacillus mesentericus) inhibitor in yeast-leavened bread.',
    commonFoods: 'Sliced bread, burger buns, tortillas, pita bread, rolls',
    codexMaxLimit: '1,000 – 3,000 mg/kg (0.1% – 0.3% on flour weight)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Preferred in bread because it does not inhibit baker’s yeast fermentation.'
  },

  // ANTIOXIDANTS (E300 - E399)
  {
    code: 'E300',
    name: 'Ascorbic Acid (Vitamin C)',
    category: 'Antioxidant',
    insNumber: 'INS 300',
    functionSummary: 'Oxygen scavenger, anti-browning agent in juices, and flour improver (oxidizes gluten).',
    commonFoods: 'Fruit juices, bread flour (20–100 PPM), cured meats, cut fruits',
    codexMaxLimit: 'GMP (Up to 200 mg/kg in flour treatment)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Essential vitamin and clean-label antioxidant.'
  },
  {
    code: 'E307',
    name: 'Alpha-Tocopherol (Vitamin E)',
    category: 'Antioxidant',
    insNumber: 'INS 307',
    functionSummary: 'Natural lipid-soluble antioxidant that prevents rancidity in vegetable oils and infant formula.',
    commonFoods: 'Cooking oils, infant formula, cereal snacks, nuts',
    codexMaxLimit: '200 – 500 mg/kg (GMP in refined oils)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Natural alternative to synthetic BHA/BHT/TBHQ.'
  },
  {
    code: 'E319',
    name: 'TBHQ (Tertiary Butylhydroquinone)',
    category: 'Antioxidant',
    insNumber: 'INS 319',
    functionSummary: 'Highly potent heat-stable synthetic antioxidant for frying oils and snacks.',
    commonFoods: 'Cooking/frying oils, potato chips, nimko, instant noodles, biscuits',
    codexMaxLimit: '200 mg/kg (PPM) on fat/oil basis',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Maximum limit strictly 200 PPM on fat content; excellent carry-through in deep frying.'
  },
  {
    code: 'E320',
    name: 'BHA (Butylated Hydroxyanisole)',
    category: 'Antioxidant',
    insNumber: 'INS 320',
    functionSummary: 'Synthetic fat-soluble antioxidant preventing oxidative rancidity.',
    commonFoods: 'Shortening, ghee, chewing gum, dehydrated snacks, essential oils',
    codexMaxLimit: '200 mg/kg (PPM) on fat basis',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Often used synergistically with BHT (E321) and Citric Acid (E330).'
  },
  {
    code: 'E321',
    name: 'BHT (Butylated Hydroxytoluene)',
    category: 'Antioxidant',
    insNumber: 'INS 321',
    functionSummary: 'Synthetic antioxidant for edible fats, oils, and packaging liners.',
    commonFoods: 'Edible oils, breakfast cereals, snack foods',
    codexMaxLimit: '100 – 200 mg/kg (PPM) on fat basis',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Regulated under Codex GSFA fat/oil limits.'
  },
  {
    code: 'E322',
    name: 'Lecithin (Soy / Sunflower)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 322',
    functionSummary: 'Natural phospholipid emulsifier, wetting agent, and viscosity reducer.',
    commonFoods: 'Chocolate, margarine, instant milk powder, bakery goods, wafers',
    codexMaxLimit: 'GMP',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'If derived from Soy, must be declared as a Soy Allergen on packaging.'
  },
  {
    code: 'E330',
    name: 'Citric Acid',
    category: 'Acidity Regulator',
    insNumber: 'INS 330',
    functionSummary: 'Primary acidulant, pH regulator, flavor enhancer, and chelating synergist for antioxidants.',
    commonFoods: 'Beverages, jams, jellies, candies, sauces, canned tomatoes, edible oils',
    codexMaxLimit: 'GMP',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Produced via Aspergillus niger fermentation on molasses/glucose; completely safe.'
  },
  {
    code: 'E331',
    name: 'Sodium Citrate (Trisodium Citrate)',
    category: 'Acidity Regulator',
    insNumber: 'INS 331',
    functionSummary: 'pH buffer, emulsifying salt in processed cheese, and calcium sequestrant in UHT milk.',
    commonFoods: 'Soft drinks, UHT milk, evaporated milk, processed cheese slices, ORS',
    codexMaxLimit: 'GMP (Up to 4,000 mg/kg in UHT milk)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Prevents protein coagulation during UHT sterilization.'
  },

  // COLORS (E100 - E199)
  {
    code: 'E100',
    name: 'Curcumin (Turmeric Extract)',
    category: 'Color',
    insNumber: 'INS 100',
    functionSummary: 'Natural yellow-orange food color extracted from turmeric rhizomes.',
    commonFoods: 'Mustard, curry powders, ice cream, dairy desserts, bakery mixes',
    codexMaxLimit: '50 – 500 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Sensitive to light; clean-label natural replacement for Tartrazine.'
  },
  {
    code: 'E102',
    name: 'Tartrazine (FD&C Yellow No. 5)',
    category: 'Color',
    insNumber: 'INS 102',
    functionSummary: 'Synthetic lemon-yellow azo dye.',
    commonFoods: 'Custard powder, yellow beverages, candies, snacks, biryani mix',
    codexMaxLimit: '100 – 300 mg/kg (PPM)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Requires mandatory warning label in EU/PFA ("May have an adverse effect on activity and attention in children").'
  },
  {
    code: 'E110',
    name: 'Sunset Yellow FCF (FD&C Yellow No. 6)',
    category: 'Color',
    insNumber: 'INS 110',
    functionSummary: 'Synthetic orange-yellow azo food color.',
    commonFoods: 'Mango drinks, orange squash, snacks, confectionery, ice lollies',
    codexMaxLimit: '50 – 300 mg/kg (PPM)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Synthetic azo dye; subject to Southampton six child-hyperactivity labeling.'
  },
  {
    code: 'E120',
    name: 'Carmine / Cochineal (Carminic Acid)',
    category: 'Color',
    insNumber: 'INS 120',
    functionSummary: 'Natural crimson red pigment extracted from crushed female Dactylopius coccus insects.',
    commonFoods: 'Imported yogurts, candies, fruit fillings, beverages, surimi',
    codexMaxLimit: '50 – 500 mg/kg',
    halalStatus: 'Haram / Restricted',
    safetyNotes: 'Derived from insects; considered non-Halal by most Halal certification bodies and non-vegetarian.'
  },
  {
    code: 'E129',
    name: 'Allura Red AC (FD&C Red No. 40)',
    category: 'Color',
    insNumber: 'INS 129',
    functionSummary: 'Synthetic red azo dye with high heat and light stability.',
    commonFoods: 'Strawberry drinks, jellies, syrups, cakes, confectionery',
    codexMaxLimit: '100 – 300 mg/kg (PPM)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–7 mg/kg bw.'
  },
  {
    code: 'E150d',
    name: 'Caramel Color Class IV (Sulfite Ammonia Caramel)',
    category: 'Color',
    insNumber: 'INS 150d',
    functionSummary: 'Acid-proof dark brown caramel color stable in phosphoric acid beverages.',
    commonFoods: 'Cola soft drinks, soy sauce, gravies, chocolate bakery products',
    codexMaxLimit: 'GMP / up to 2,000 mg/kg in colas',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Monitored for 4-MEI levels; safe within Codex limits.'
  },
  {
    code: 'E160a',
    name: 'Beta-Carotene',
    category: 'Color',
    insNumber: 'INS 160a',
    functionSummary: 'Natural/nature-identical yellow-to-orange carotenoid pigment and pro-vitamin A.',
    commonFoods: 'Margarine, butter, mango juices, cheese, bakery goods',
    codexMaxLimit: '100 – 1,000 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Verify carrier gelatin if used in water-dispersible beadlet form.'
  },

  // EMULSIFIERS, STABILIZERS, THICKENERS & GELLING AGENTS (E400 - E499)
  {
    code: 'E407',
    name: 'Carrageenan',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 407',
    functionSummary: 'Red seaweed hydrocolloid that reacts with milk casein to prevent whey separation and suspend cocoa.',
    commonFoods: 'Chocolate milk, ice cream, evaporated milk, poultry injection brines, dessert gels',
    codexMaxLimit: 'GMP (Typically 150 – 1,000 mg/kg in dairy drinks)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Plant-derived (Rhodophyceae seaweed); keeps cocoa particles suspended at 0.02–0.05%.'
  },
  {
    code: 'E412',
    name: 'Guar Gum',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 412',
    functionSummary: 'Cold-water soluble galactomannan thickener and ice crystal inhibitor.',
    commonFoods: 'Ice cream, ketchup, sauces, gluten-free bakery, noodles',
    codexMaxLimit: 'GMP (Typically 0.1% – 0.5%)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Extracted from Cyamopsis tetragonoloba seeds (widely grown in Pakistan/India).'
  },
  {
    code: 'E415',
    name: 'Xanthan Gum',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 415',
    functionSummary: 'Pseudoplastic (shear-thinning) polysaccharide thickener stable across wide pH (2–12) and temperature ranges.',
    commonFoods: 'Salad dressings, mayonnaise, ketchup, sauces, fruit drinks, gluten-free bread',
    codexMaxLimit: 'GMP (Typically 0.05% – 0.3%)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Produced by Xanthomonas campestris fermentation on glucose/sucrose.'
  },
  {
    code: 'E440',
    name: 'Pectin (High & Low Methoxyl)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 440',
    functionSummary: 'Natural fruit cell-wall gelling agent and acidic dairy protein stabilizer.',
    commonFoods: 'Jams, jellies, marmalades, fruit gummies, drinking yogurt, fruit juices',
    codexMaxLimit: 'GMP (Typically 0.3% – 1.0% in jams)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'HM Pectin gels at Brix > 55% and pH 2.8–3.4; LM Pectin gels in the presence of Calcium ions.'
  },
  {
    code: 'E441',
    name: 'Gelatin',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 441',
    functionSummary: 'Thermo-reversible protein gelling, foaming, and stabilizing agent derived from collagen.',
    commonFoods: 'Jelly desserts, marshmallows, gummy candies, yogurt, capsules',
    codexMaxLimit: 'GMP',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'CRITICAL HALAL CHECK: Must come from Halal-slaughtered bovine or fish skin. Porcine (pork) gelatin is Haram.'
  },
  {
    code: 'E466',
    name: 'CMC (Carboxymethyl Cellulose)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 466',
    functionSummary: 'Cellulose-derived water binder, mouthfeel enhancer, and ice crystal control agent.',
    commonFoods: 'Fruit drinks, synthetic syrups, ice cream, icing, bakery batters',
    codexMaxLimit: 'GMP (Typically 0.1% – 0.4%)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Gives body and mouthfeel to low-juice beverages and diet drinks.'
  },
  {
    code: 'E471',
    name: 'Mono- and Diglycerides of Fatty Acids',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 471',
    functionSummary: 'Primary food emulsifier and starch-complexing crumb softener (anti-staling agent).',
    commonFoods: 'Bread, cakes, margarine, ice cream, peanut butter, whipped toppings',
    codexMaxLimit: 'GMP',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'CRITICAL HALAL CHECK: Must be derived from vegetable oils (palm/soy) rather than animal tallow/lard.'
  },
  {
    code: 'E472e',
    name: 'DATEM (Diacetyl Tartaric Acid Esters of Mono- and Diglycerides)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 472e',
    functionSummary: 'Strong dough conditioner that strengthens gluten network and improves bread volume.',
    commonFoods: 'Pan bread, buns, rolls, yeast-raised bakery products',
    codexMaxLimit: '2,500 – 5,000 mg/kg',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'Verify plant fatty acid source for Halal compliance.'
  },

  // ACIDITY REGULATORS, PHOSPHATES & RAISING AGENTS (E500 - E599)
  {
    code: 'E450',
    name: 'Diphosphates / Pyrophosphates (SAPP)',
    category: 'Acidity Regulator',
    insNumber: 'INS 450',
    functionSummary: 'Leavening acid, water-binding phosphate in meat/seafood, and anti-graying agent in potatoes.',
    commonFoods: 'Baking powder, french fries (prevents after-cooking darkening), nuggets, sausages',
    codexMaxLimit: '1,000 – 5,000 mg/kg as P2O5',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Inorganic mineral phosphate.'
  },
  {
    code: 'E500',
    name: 'Sodium Carbonates (Sodium Bicarbonate / Baking Soda)',
    category: 'Acidity Regulator',
    insNumber: 'INS 500',
    functionSummary: 'Chemical leavening base (releases CO2 with acid/heat) and pH raiser.',
    commonFoods: 'Biscuits, cakes, baking powder, effervescent drinks, dairy neutralization',
    codexMaxLimit: 'GMP',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Safe mineral salt.'
  },
  {
    code: 'E503',
    name: 'Ammonium Carbonates (Ammonium Bicarbonate)',
    category: 'Acidity Regulator',
    insNumber: 'INS 503',
    functionSummary: 'Volatile leavening agent for low-moisture thin baked goods (leaves zero residual salt).',
    commonFoods: 'Cookies, crackers, Marie biscuits, wafers (< 5% final moisture)',
    codexMaxLimit: 'GMP',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Only use in thin, low-moisture baked products so ammonia gas volatilizes completely.'
  },
  {
    code: 'E551',
    name: 'Silicon Dioxide (Silica)',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 551',
    functionSummary: 'Free-flowing anti-caking agent that absorbs trace moisture in hygroscopic powders.',
    commonFoods: 'Spice mixes, onion/garlic powder, instant coffee whitener, powdered drink mixes, salt',
    codexMaxLimit: '10,000 – 20,000 mg/kg (1% – 2%)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Inert mineral anti-caking agent.'
  },

  // FLAVOR ENHANCERS & SWEETENERS (E600 - E999)
  {
    code: 'E621',
    name: 'Monosodium Glutamate (MSG)',
    category: 'Flavor Enhancer',
    insNumber: 'INS 621',
    functionSummary: 'Umami savory flavor enhancer (sodium salt of L-glutamic acid).',
    commonFoods: 'Instant noodles, soups, potato chips, savory snacks, stock cubes, seasonings',
    codexMaxLimit: 'GMP (Restricted in infant foods)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Produced by bacterial fermentation (Corynebacterium glutamicum) on cassava/sugarcane molasses. Not permitted in infant foods (<12 months).'
  },
  {
    code: 'E635',
    name: 'Disodium 5-Ribonucleotides (I+G)',
    category: 'Flavor Enhancer',
    insNumber: 'INS 635',
    functionSummary: 'Potent umami synergist combining Disodium Inosinate (E631) and Disodium Guanylate (E627).',
    commonFoods: 'Instant noodle masala, snacks, soups, sauces',
    codexMaxLimit: '500 mg/kg',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'Verify microbial/plant fermentation source (inosinate can occasionally be derived from fish/meat).'
  },
  {
    code: 'E950',
    name: 'Acesulfame Potassium (Ace-K)',
    category: 'Sweetener',
    insNumber: 'INS 950',
    functionSummary: 'Heat-stable high-intensity non-nutritive sweetener (~200x sweeter than sucrose).',
    commonFoods: 'Zero-sugar beverages, chewing gum, baked goods, tabletop sweeteners',
    codexMaxLimit: '350 – 1,000 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Often blended with Aspartame (E951) or Sucralose (E955) for a clean sugar-like sweetness profile.'
  },
  {
    code: 'E951',
    name: 'Aspartame',
    category: 'Sweetener',
    insNumber: 'INS 951',
    functionSummary: 'High-intensity dipeptide sweetener (~200x sweeter than sugar).',
    commonFoods: 'Diet carbonated drinks, sugar-free gum, powdered drink mixes',
    codexMaxLimit: '600 mg/kg in beverages',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'MANDATORY LABEL WARNING: "Contains a source of Phenylalanine" (for PKU patients). Loses sweetness during prolonged high-heat baking.'
  },
  {
    code: 'E955',
    name: 'Sucralose',
    category: 'Sweetener',
    insNumber: 'INS 955',
    functionSummary: 'Chlorinated sucrose derivative (~600x sweeter than sugar) with high heat and pH stability.',
    commonFoods: 'Diet juices, protein powders, sugar-free syrups, baked goods',
    codexMaxLimit: '300 – 400 mg/kg in beverages',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–15 mg/kg bw. Stable during pasteurization and baking.'
  },
  {
    code: 'E960',
    name: 'Steviol Glycosides (Stevia)',
    category: 'Sweetener',
    insNumber: 'INS 960',
    functionSummary: 'Natural zero-calorie sweetener extracted from Stevia rebaudiana leaves (~200–300x sweeter than sugar).',
    commonFoods: 'Natural low-calorie juices, flavored milk, tabletop sweeteners',
    codexMaxLimit: '200 – 330 mg/kg (as steviol equivalents)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Natural plant-derived high-intensity sweetener.'
  },

  // ============================================================================
  // EXTENDED GLOBAL COLORS (E101 – E180)
  // ============================================================================
  {
    code: 'E101',
    name: 'Riboflavin (Vitamin B2)',
    category: 'Color',
    insNumber: 'INS 101(i)',
    functionSummary: 'Natural yellow-orange colorant and essential B-vitamin fortificant.',
    commonFoods: 'Breakfast cereals, fortified milk, energy drinks, pasta, sauces',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Water-soluble vitamin; ADI 0–0.5 mg/kg bw. Sensitive to direct sunlight.'
  },
  {
    code: 'E104',
    name: 'Quinoline Yellow',
    category: 'Color',
    insNumber: 'INS 104',
    functionSummary: 'Synthetic greenish-yellow food dye used in confectionery and beverages.',
    commonFoods: 'Soft drinks, lollipops, iced candies, smoked haddock',
    codexMaxLimit: '50 – 100 mg/kg (EU strictly reduced limits)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Part of EU Southampton Six colors; requires hyperactivity warning in EU. Restricted in USA & Australia.'
  },
  {
    code: 'E122',
    name: 'Azorubine (Carmoisine)',
    category: 'Color',
    insNumber: 'INS 122',
    functionSummary: 'Synthetic red-to-maroon azo food colorant.',
    commonFoods: 'Jams, jellies, fruit squashes, marzipan, red velvet cakes',
    codexMaxLimit: '50 – 200 mg/kg depending on food category',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'EU Southampton Six warning required; prohibited in USA, Japan, and Norway.'
  },
  {
    code: 'E123',
    name: 'Amaranth',
    category: 'Color',
    insNumber: 'INS 123',
    functionSummary: 'Dark red-to-purple synthetic azo dye with restricted international status.',
    commonFoods: 'Aperitif wines, fish roe substitutes (strictly restricted)',
    codexMaxLimit: '30 mg/kg (banned in USA since 1976)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Prohibited by US FDA; strictly limited in EU and GCC.'
  },
  {
    code: 'E124',
    name: 'Ponceau 4R (Cochineal Red A)',
    category: 'Color',
    insNumber: 'INS 124',
    functionSummary: 'Synthetic strawberry-red azo dye (chemically unrelated to insect cochineal E120).',
    commonFoods: 'Desserts, syrups, canned red fruits, strawberry milkshakes, confectionery',
    codexMaxLimit: '10 – 50 mg/kg (EU tightened); 100 mg/kg Codex',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Synthetic Halal alternative to E120 Carmine, but requires EU hyperactivity warning and is banned in USA.'
  },
  {
    code: 'E127',
    name: 'Erythrosine (FD&C Red No. 3)',
    category: 'Color',
    insNumber: 'INS 127',
    functionSummary: 'Cherry-pink synthetic iodine-containing xanthene dye.',
    commonFoods: 'Cocktail cherries, candied fruits, cake decorating gels',
    codexMaxLimit: '100 – 200 mg/kg (restricted to cherries in EU)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'High iodine content; US FDA revoked authorization in food/ingested drugs (phase-out 2027).'
  },
  {
    code: 'E131',
    name: 'Patent Blue V',
    category: 'Color',
    insNumber: 'INS 131',
    functionSummary: 'Synthetic sky-blue triphenylmethane dye.',
    commonFoods: 'Candies, jelly sweets, blue beverages, cake icings',
    codexMaxLimit: '50 – 100 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Permitted in EU/UK; prohibited in USA, Australia, and New Zealand.'
  },
  {
    code: 'E132',
    name: 'Indigotine (Indigo Carmine / FD&C Blue 2)',
    category: 'Color',
    insNumber: 'INS 132',
    functionSummary: 'Synthetic royal-blue dye widely approved globally.',
    commonFoods: 'Confectionery, baked goods, ice cream, snacks, tablet coatings',
    codexMaxLimit: '100 – 300 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–5 mg/kg bw. Sensitive to light and oxidizing agents.'
  },
  {
    code: 'E133',
    name: 'Brilliant Blue FCF (FD&C Blue 1)',
    category: 'Color',
    insNumber: 'INS 133',
    functionSummary: 'Bright turquoise-blue synthetic food color, often blended with E102 for green shades.',
    commonFoods: 'Sports drinks, slushies, ice pops, candies, mint jellies',
    codexMaxLimit: '100 – 300 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–6 mg/kg bw. Very stable across pH 3–8.'
  },
  {
    code: 'E140',
    name: 'Chlorophylls & Chlorophyllins',
    category: 'Color',
    insNumber: 'INS 140',
    functionSummary: 'Natural green pigment extracted from alfalfa, spinach, and nettle leaves.',
    commonFoods: 'Pistachio ice cream, green pasta, sauces, confectionery, soups',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Natural plant pigment; E141 copper complexes offer superior heat and acid stability.'
  },
  {
    code: 'E141',
    name: 'Copper Complexes of Chlorophylls',
    category: 'Color',
    insNumber: 'INS 141',
    functionSummary: 'Heat- and acid-stable olive-to-emerald natural green colorant.',
    commonFoods: 'Canned peas, pickles, green beverages, chewing gum, mint sweets',
    codexMaxLimit: '100 – 500 mg/kg (ADI 0–15 mg/kg bw)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Preferred over E140 in thermally processed and acidic green foods.'
  },
  {
    code: 'E142',
    name: 'Green S (Brilliant Acid Green)',
    category: 'Color',
    insNumber: 'INS 142',
    functionSummary: 'Synthetic sea-green triarylmethane food color.',
    commonFoods: 'Mint sauce, tinned mushy peas, dessert mixes, candies',
    codexMaxLimit: '100 – 200 mg/kg (EU); banned in USA, Canada & Japan',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–5 mg/kg bw. Check destination export country rules before formulation.'
  },
  {
    code: 'E150a',
    name: 'Plain Caramel (Class I)',
    category: 'Color',
    insNumber: 'INS 150a',
    functionSummary: 'Natural brown caramel produced strictly by heating carbohydrates without ammonia/sulfites.',
    commonFoods: 'Bakery glazes, gravies, malt beverages, biscuits, sauces',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Cleanest caramel class; contains no 4-MEI contaminant.'
  },
  {
    code: 'E150c',
    name: 'Ammonia Caramel (Class III)',
    category: 'Color',
    insNumber: 'INS 150c',
    functionSummary: 'Reddish-brown caramel widely used in soy sauces, bakery, and meat gravies.',
    commonFoods: 'Soy sauce, brown sauces, dark biscuits, seasoning cubes, malt drinks',
    codexMaxLimit: '1,000 – 50,000 mg/kg depending on category',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Positively charged; compatible with protein-rich sauces without precipitation.'
  },
  {
    code: 'E151',
    name: 'Brilliant Black BN (Black PN)',
    category: 'Color',
    insNumber: 'INS 151',
    functionSummary: 'Synthetic violet-black bis-azo colorant.',
    commonFoods: 'Licorice confectionery, caviar substitutes, blackcurrant sauces',
    codexMaxLimit: '100 – 300 mg/kg (prohibited in USA & Japan)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–5 mg/kg bw. Avoid for USA/Japan export formulations.'
  },
  {
    code: 'E153',
    name: 'Vegetable Carbon (Activated Charcoal)',
    category: 'Color',
    insNumber: 'INS 153',
    functionSummary: 'Pure carbonized plant matter producing jet-black natural coloring.',
    commonFoods: 'Black ice cream, activated charcoal buns, licorice, black macarons',
    codexMaxLimit: 'GMP (EU/Codex); NOT permitted as food color by US FDA',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Verify plant origin (wood/coconut shell) vs bone char for Halal & Vegan compliance.'
  },
  {
    code: 'E155',
    name: 'Brown HT (Chocolate Brown HT)',
    category: 'Color',
    insNumber: 'INS 155',
    functionSummary: 'Synthetic reddish-brown diazo dye stable to baking heat.',
    commonFoods: 'Chocolate cakes, cocoa biscuits, chocolate pudding mixes',
    codexMaxLimit: '50 mg/kg (EU); banned in USA, Austria & Norway',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–1.5 mg/kg bw. Used as cost-effective cocoa color booster.'
  },
  {
    code: 'E160b',
    name: 'Annatto (Bixin / Norbixin)',
    category: 'Color',
    insNumber: 'INS 160b',
    functionSummary: 'Natural orange-yellow carotenoid extracted from Bixa orellana seeds.',
    commonFoods: 'Cheddar & Red Leicester cheese, butter, margarine, smoked fish, snacks',
    codexMaxLimit: '10 – 50 mg/kg (as bixin/norbixin)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Bixin is oil-soluble (butter/margarine); Norbixin is water-soluble (cheese/extruded snacks).'
  },
  {
    code: 'E160c',
    name: 'Paprika Extract (Capsanthin / Capsorubin)',
    category: 'Color',
    insNumber: 'INS 160c',
    functionSummary: 'Natural deep orange-red carotenoid oleoresin from sweet red peppers.',
    commonFoods: 'Snack seasonings, processed cheese, sausages, sauces, poultry marinades',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Natural plant color with excellent heat stability; verify carrier oil is vegetable-based.'
  },
  {
    code: 'E160d',
    name: 'Lycopene',
    category: 'Color',
    insNumber: 'INS 160d',
    functionSummary: 'Natural red carotenoid extracted from ripe tomatoes or Blakeslea trispora.',
    commonFoods: 'Tomato sauces, soups, fruit beverages, surimi, confectionery',
    codexMaxLimit: '30 – 100 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Clean-label natural red substitute for synthetic reds; antioxidant properties.'
  },
  {
    code: 'E161b',
    name: 'Lutein (Tagetes Extract)',
    category: 'Color',
    insNumber: 'INS 161b',
    functionSummary: 'Natural golden-yellow xanthophyll extracted from marigold petals.',
    commonFoods: 'Beverages, bakery, infant nutrition, sauces, poultry feed pigment',
    codexMaxLimit: '100 – 500 mg/kg (ADI 0–1 mg/kg bw)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Widely accepted natural yellow colorant and eye-health carotenoid.'
  },
  {
    code: 'E162',
    name: 'Beetroot Red (Betanin)',
    category: 'Color',
    insNumber: 'INS 162',
    functionSummary: 'Natural magenta-red pigment extracted from red beetroot juice.',
    commonFoods: 'Strawberry yogurt, ice cream, cold desserts, smoothies, dry soup mixes',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Heat-sensitive (browns above 85°C); best for chilled dairy, ice cream, and dry mixes.'
  },
  {
    code: 'E163',
    name: 'Anthocyanins (Grape Skin / Black Carrot)',
    category: 'Color',
    insNumber: 'INS 163',
    functionSummary: 'Natural red-purple-blue flavonoid pigments from berries, black carrot, and red cabbage.',
    commonFoods: 'Fruit drinks, jams, yogurt, berry confectionery, soft drinks',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Color shifts with pH: bright red at pH < 3.5, purple at pH 5–6, blue above pH 7. Verify non-alcoholic extraction.'
  },
  {
    code: 'E170',
    name: 'Calcium Carbonate',
    category: 'Color',
    insNumber: 'INS 170(i)',
    functionSummary: 'Natural white mineral pigment, calcium fortificant, acidity regulator & anti-caking agent.',
    commonFoods: 'Plant milks, bread flour, chewing gum, sugar-coated candies, biscuits',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Widely used safe replacement for E171 Titanium Dioxide in white confectionery coatings.'
  },
  {
    code: 'E171',
    name: 'Titanium Dioxide (TiO₂)',
    category: 'Color',
    insNumber: 'INS 171',
    functionSummary: 'Intense bright-white opaque mineral pigment.',
    commonFoods: 'Chewing gum, white icing, coffee creamers, candies, sauces (region-dependent)',
    codexMaxLimit: 'BANNED in EU (2022) & Saudi SFDA (2023); still allowed under US FDA (≤ 1%)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'CRITICAL EXPORT ALERT: EFSA ruled E171 no longer safe due to genotoxicity concerns; reformulate with E170/rice starch for EU & GCC.'
  },
  {
    code: 'E172',
    name: 'Iron Oxides & Hydroxides (Yellow/Red/Black)',
    category: 'Color',
    insNumber: 'INS 172',
    functionSummary: 'Heat- and light-stable mineral earth pigments (yellow, red, brown, black).',
    commonFoods: 'Cake decorations, sausage casings, tablet coatings, chocolate dragees',
    codexMaxLimit: 'GMP (EU/Codex); restricted in USA',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Inert mineral pigments with virtually zero fading during thermal processing.'
  },

  // ============================================================================
  // EXTENDED GLOBAL PRESERVATIVES (E201 – E297)
  // ============================================================================
  {
    code: 'E213',
    name: 'Calcium Benzoate',
    category: 'Preservative',
    insNumber: 'INS 213',
    functionSummary: 'Low-sodium benzoate preservative active against yeasts and molds in acidic foods.',
    commonFoods: 'Low-sodium fruit drinks, diet concentrates, pickles, sauces',
    codexMaxLimit: '150 – 1,000 mg/kg (as benzoic acid)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Optimal antimicrobial activity at pH < 4.5. Avoid combining with high ascorbic acid + heat (benzene risk).'
  },
  {
    code: 'E214',
    name: 'Ethyl p-Hydroxybenzoate (Ethylparaben)',
    category: 'Preservative',
    insNumber: 'INS 214',
    functionSummary: 'Broad-spectrum antifungal preservative effective even at neutral pH (pH 4–8).',
    commonFoods: 'Cereal/potato snacks, jelly coatings of meat products, liquid dietary supplements',
    codexMaxLimit: '300 – 1,000 mg/kg (sum of parabens)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–10 mg/kg bw (group ADI with E218 Methylparaben).'
  },
  {
    code: 'E218',
    name: 'Methyl p-Hydroxybenzoate (Methylparaben)',
    category: 'Preservative',
    insNumber: 'INS 218',
    functionSummary: 'pH-independent preservative active against molds and yeasts in low-acid foods.',
    commonFoods: 'Confectionery fillings, bakery glazes, liquid supplements, meat jelly coatings',
    codexMaxLimit: '300 – 1,000 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Unlike benzoates/sorbates, remains undissociated and effective up to pH 8.0.'
  },
  {
    code: 'E221',
    name: 'Sodium Sulfite',
    category: 'Preservative',
    insNumber: 'INS 221',
    functionSummary: 'Antimicrobial and anti-browning sulfiting agent.',
    commonFoods: 'Dehydrated vegetables, frozen shrimp, dried fruits, fruit pulps',
    codexMaxLimit: '50 – 2,000 mg/kg (as residual SO₂)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'MANDATORY ALLERGEN DECLARATION if residual SO₂ ≥ 10 mg/kg (ppm).'
  },
  {
    code: 'E222',
    name: 'Sodium Hydrogen Sulfite (Sodium Bisulfite)',
    category: 'Preservative',
    insNumber: 'INS 222',
    functionSummary: 'Anti-browning preservative and dough-relaxing conditioner for biscuits.',
    commonFoods: 'Hard dough biscuits (reduces shrinkage), dried potatoes, fruit juices',
    codexMaxLimit: '50 – 500 mg/kg (as SO₂)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ALLERGEN: Sulfites ≥ 10 ppm must be declared on label; destroys Vitamin B1 (Thiamine).'
  },
  {
    code: 'E228',
    name: 'Potassium Hydrogen Sulfite',
    category: 'Preservative',
    insNumber: 'INS 228',
    functionSummary: 'Sulfite preservative and antioxidant for fruit pulps and dried produce.',
    commonFoods: 'Dried apricots, fruit concentrates, potato flakes, vinegar',
    codexMaxLimit: '100 – 2,000 mg/kg (as SO₂)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ALLERGEN: Mandatory sulfite warning at ≥ 10 mg/kg.'
  },
  {
    code: 'E242',
    name: 'Dimethyl Dicarbonate (DMDC / Velcorin)',
    category: 'Preservative',
    insNumber: 'INS 242',
    functionSummary: 'Cold-sterilization agent dosed inline into beverages before capping; hydrolyzes completely.',
    commonFoods: 'RTD iced teas, flavored waters, non-alcoholic beverages, fruit drinks',
    codexMaxLimit: '250 mg/L max dosing rate',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Rapidly hydrolyzes into trace methanol & CO₂; requires precision inline Velcorin dosing unit.'
  },
  {
    code: 'E249',
    name: 'Potassium Nitrite',
    category: 'Preservative',
    insNumber: 'INS 249',
    functionSummary: 'Curing salt inhibiting Clostridium botulinum and stabilizing cured meat pink color.',
    commonFoods: 'Cured beef/poultry sausages, salami, smoked meats',
    codexMaxLimit: '80 – 150 mg/kg ingoing (EU tightening to 80 mg/kg in 2025)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Strict CCP weighing required! Pair with sodium erythorbate (E316) to suppress nitrosamines.'
  },
  {
    code: 'E252',
    name: 'Potassium Nitrate (Saltpetre)',
    category: 'Preservative',
    insNumber: 'INS 252',
    functionSummary: 'Slow-release curing agent and anti-blowing agent in aged hard cheeses.',
    commonFoods: 'Gouda/Edam cheeses (prevents Clostridium tyrobutyricum late blowing), dry-cured meats',
    codexMaxLimit: '50 – 150 mg/kg (as nitrate ion)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Slowly reduced to nitrite by nitrate-reductase bacteria during maturation.'
  },
  {
    code: 'E261',
    name: 'Potassium Acetate',
    category: 'Preservative',
    insNumber: 'INS 261',
    functionSummary: 'Preservative and pH buffer inhibiting Listeria monocytogenes in chilled foods.',
    commonFoods: 'RTE poultry/meat products, sauces, dressings, bakery items',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Low-sodium alternative to sodium diacetate (E262) for clean-taste preservation.'
  },
  {
    code: 'E262',
    name: 'Sodium Acetates / Sodium Diacetate',
    category: 'Preservative',
    insNumber: 'INS 262(i)/(ii)',
    functionSummary: 'Potent anti-rope, anti-mold, and anti-Listeria preservative and salt-and-vinegar flavor agent.',
    commonFoods: 'Salt & vinegar chips, sliced bread, RTE cooked meats, pickles',
    codexMaxLimit: 'GMP (up to 4,000 mg/kg in bakery/meats)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Synergistic with sodium lactate (E325) for RTE meat Listeria hurdle control.'
  },
  {
    code: 'E263',
    name: 'Calcium Acetate',
    category: 'Preservative',
    insNumber: 'INS 263',
    functionSummary: 'Anti-rope bakery preservative, firming agent, and stabilizer.',
    commonFoods: 'Bread, baked goods, pie fillings, canned vegetables',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Prevents Bacillus subtilis rope spoilage in warm-climate sliced breads.'
  },
  {
    code: 'E270',
    name: 'Lactic Acid',
    category: 'Acidity Regulator',
    insNumber: 'INS 270',
    functionSummary: 'Mild organic acid produced by carbohydrate fermentation; acidulant & antimicrobial.',
    commonFoods: 'Yogurt, olives, pickles, sourdough bread, sports drinks, meat carcass wash',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Generally plant-fermented (sugar/starch); mild flavor profile compared to acetic acid.'
  },
  {
    code: 'E280',
    name: 'Propionic Acid',
    category: 'Preservative',
    insNumber: 'INS 280',
    functionSummary: 'Organic acid preservative specifically targeting molds and Bacillus rope in bakery.',
    commonFoods: 'Sliced bread, tortillas, pizza bases, packed flatbreads',
    codexMaxLimit: '1,000 – 3,000 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Liquid pungent form; usually applied as calcium propionate (E282) or sodium propionate (E281).'
  },
  {
    code: 'E281',
    name: 'Sodium Propionate',
    category: 'Preservative',
    insNumber: 'INS 281',
    functionSummary: 'Mold inhibitor ideal for chemically leavened cakes and pastries where calcium interferes.',
    commonFoods: 'Cakes, muffins, tortillas, processed cheese slices',
    codexMaxLimit: '2,000 – 3,000 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Preferred over E282 in baking-powder cakes because calcium ions can disrupt chemical leavening.'
  },
  {
    code: 'E290',
    name: 'Carbon Dioxide (CO₂)',
    category: 'Preservative',
    insNumber: 'INS 290',
    functionSummary: 'Carbonation gas, Modified Atmosphere Packaging (MAP) bacteriostatic gas & refrigerant.',
    commonFoods: 'Carbonated soft drinks, sparkling water, MAP packaged meat/bakery/cheese',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: '20–40% CO₂ in MAP headspace strongly inhibits aerobic Gram-negative spoilage bacteria (Pseudomonas).'
  },
  {
    code: 'E296',
    name: 'Malic Acid',
    category: 'Acidity Regulator',
    insNumber: 'INS 296',
    functionSummary: 'Natural apple-derived tart organic acid with smooth, lingering sourness.',
    commonFoods: 'Apple juices, sour candies, fruit chews, sports drinks, ciders',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Enhances fruit flavor longevity and masks artificial sweetener aftertaste better than citric acid.'
  },
  {
    code: 'E297',
    name: 'Fumaric Acid',
    category: 'Acidity Regulator',
    insNumber: 'INS 297',
    functionSummary: 'Strongest food acidulant (~1.5x stronger than citric acid) with very low hygroscopicity.',
    commonFoods: 'Powdered drink mixes, gelatin desserts, tortillas (pH control), sour coatings',
    codexMaxLimit: '1,000 – 4,000 mg/kg depending on category',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Non-hygroscopic — prevents caking in dry powdered beverage sachets.'
  },

  // ============================================================================
  // EXTENDED GLOBAL ANTIOXIDANTS & ACIDITY REGULATORS (E301 – E385)
  // ============================================================================
  {
    code: 'E301',
    name: 'Sodium Ascorbate',
    category: 'Antioxidant',
    insNumber: 'INS 301',
    functionSummary: 'Buffered, non-acidic Vitamin C salt used as meat curing accelerator and antioxidant.',
    commonFoods: 'Cured sausages, luncheon meats, baby foods, fruit purees, beverage fortification',
    codexMaxLimit: 'GMP (500 mg/kg typical in cured meats)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Accelerates nitrosomyoglobin color development and inhibits nitrosamine formation without lowering pH.'
  },
  {
    code: 'E304',
    name: 'Ascorbyl Palmitate',
    category: 'Antioxidant',
    insNumber: 'INS 304',
    functionSummary: 'Fat-soluble ester of Vitamin C that protects oils and infant formulas against rancidity.',
    commonFoods: 'Vegetable oils, infant formula, snack frying oils, margarine, roasted nuts',
    codexMaxLimit: '200 – 500 mg/kg (fat basis)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Palmitic acid can derive from palm oil (Halal) or animal tallow — verify plant-source certificate.'
  },
  {
    code: 'E306',
    name: 'Tocopherol-Rich Extract (Natural Vitamin E)',
    category: 'Antioxidant',
    insNumber: 'INS 306',
    functionSummary: 'Clean-label mixed natural tocopherols extracted from soybean/sunflower distillate.',
    commonFoods: 'Cold-pressed oils, baby food, fried snacks, nut butters, fish oil capsules',
    codexMaxLimit: '300 – 500 mg/kg (fat basis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Clean-label alternative to synthetic BHA/BHT/TBHQ; check soy allergen exemption for highly refined oil.'
  },
  {
    code: 'E310',
    name: 'Propyl Gallate',
    category: 'Antioxidant',
    insNumber: 'INS 310',
    functionSummary: 'Potent synthetic phenolic antioxidant for fats, oils, and chewing gum bases.',
    commonFoods: 'Frying oils, ghee, dehydrated soups, chewing gum, seasoning blends',
    codexMaxLimit: '100 – 200 mg/kg (fat basis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–0.5 mg/kg bw. Synergistic with BHA/BHT and citric acid (chelator).'
  },
  {
    code: 'E316',
    name: 'Sodium Erythorbate',
    category: 'Antioxidant',
    insNumber: 'INS 316',
    functionSummary: 'Cost-effective stereoisomer of sodium ascorbate widely used in cured meat processing.',
    commonFoods: 'Hot dogs, chicken mortadella, beef salami, frozen seafood glaze',
    codexMaxLimit: '500 mg/kg (as erythorbic acid)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Same antioxidant and curing acceleration power as E301 at lower cost, though negligible Vitamin C bioactivity.'
  },
  {
    code: 'E325',
    name: 'Sodium Lactate',
    category: 'Acidity Regulator',
    insNumber: 'INS 325',
    functionSummary: 'Humectant, water-activity depressant, and Listeria inhibitor for meat & poultry.',
    commonFoods: 'Cooked poultry rolls, sausages, deli meats, marinated kebabs',
    codexMaxLimit: 'GMP (typically 1.5% – 3.0% of meat batch)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Extends chilled shelf-life of RTE meats by 2–3x while improving juiciness and cook yield.'
  },
  {
    code: 'E326',
    name: 'Potassium Lactate',
    category: 'Acidity Regulator',
    insNumber: 'INS 326',
    functionSummary: 'Low-sodium antimicrobial humectant used in chilled meats and poultry.',
    commonFoods: 'Low-sodium sausages, deli slices, ready meals, marinades',
    codexMaxLimit: 'GMP (typically 1.5% – 2.5%)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Avoids salty taste while delivering identical Listeria hurdle control to sodium lactate.'
  },
  {
    code: 'E327',
    name: 'Calcium Lactate',
    category: 'Acidity Regulator',
    insNumber: 'INS 327',
    functionSummary: 'Highly soluble neutral-tasting calcium fortificant and fruit firming agent.',
    commonFoods: 'Fresh-cut apples/melons, fortified juices, mozzarella cheese, baking powder',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Does not impart bitter taste like calcium chloride; ideal for fresh-cut fruit dipping.'
  },
  {
    code: 'E332',
    name: 'Potassium Citrates',
    category: 'Acidity Regulator',
    insNumber: 'INS 332',
    functionSummary: 'Low-sodium buffering salt, chelating agent, and heat stabilizer in UHT milk.',
    commonFoods: 'Electrolyte/ORS drinks, UHT dairy, infant formula, jams, jellies',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Stabilizes UHT milk proteins against age gelation and thermal coagulation.'
  },
  {
    code: 'E334',
    name: 'L(+)-Tartaric Acid',
    category: 'Acidity Regulator',
    insNumber: 'INS 334',
    functionSummary: 'Sharp-tasting natural organic acid used in baking powders and grape-flavored foods.',
    commonFoods: 'Baking powders, grape beverages, sour candies, jams, jellies',
    codexMaxLimit: 'GMP (ADI 0–30 mg/kg bw)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Naturally occurs in tamarind and grapes; verify halal non-wine-byproduct sourcing if strict certification required.'
  },
  {
    code: 'E338',
    name: 'Phosphoric Acid (Orthophosphoric Acid)',
    category: 'Acidity Regulator',
    insNumber: 'INS 338',
    functionSummary: 'Sharp inorganic acidulant giving cola drinks their characteristic bite and low pH (~2.5).',
    commonFoods: 'Cola carbonated soft drinks, processed cheese, yeast nutrient',
    codexMaxLimit: '700 mg/L (as P₂O₅) in flavored carbonated drinks',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'EFSA group ADI for all phosphates: 40 mg/kg bw/day (expressed as phosphorus).'
  },
  {
    code: 'E339',
    name: 'Sodium Phosphates (Mono / Di / Tri)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 339',
    functionSummary: 'Emulsifying salt for processed cheese, milk heat-stabilizer, and meat moisture binder.',
    commonFoods: 'Processed cheese slices, evaporated/UHT milk, instant puddings, ham/sausages',
    codexMaxLimit: '1,000 – 20,000 mg/kg (as P₂O₅ depending on category)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Disodium phosphate (E339ii) prevents curdling in UHT dairy and binds water in emulsified meats.'
  },
  {
    code: 'E340',
    name: 'Potassium Phosphates',
    category: 'Acidity Regulator',
    insNumber: 'INS 340',
    functionSummary: 'Buffering salt and protein stabilizer preventing feathering in coffee creamers.',
    commonFoods: 'Non-dairy coffee whiteners, UHT flavored milk, sports drinks, meat brines',
    codexMaxLimit: '1,000 – 5,000 mg/kg (as P₂O₅)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Dipotassium phosphate (E340ii) keeps milk proteins soluble when poured into hot acidic coffee.'
  },
  {
    code: 'E341',
    name: 'Calcium Phosphates (MCP / DCP / TCP)',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 341',
    functionSummary: 'Leavening acid (MCP), anti-caking agent (TCP), and calcium fortificant.',
    commonFoods: 'Baking powder, powdered milk/spices, cake mixes, fortified cereals',
    codexMaxLimit: '1,000 – 10,000 mg/kg (as P₂O₅)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Verify mineral-rock phosphate source rather than animal bone ash.'
  },
  {
    code: 'E385',
    name: 'Calcium Disodium EDTA',
    category: 'Antioxidant',
    insNumber: 'INS 385',
    functionSummary: 'Powerful metal-ion chelator preventing oxidative rancidity and color fading.',
    commonFoods: 'Mayonnaise, salad dressings, canned chickpeas/beans, sauces, margarines',
    codexMaxLimit: '75 mg/kg in mayonnaise/dressings; 250 mg/kg in canned legumes',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Binds trace iron & copper catalysts that cause mayonnaise oil oxidation and canned bean discoloration.'
  },
  {
    code: 'E392',
    name: 'Extracts of Rosemary',
    category: 'Antioxidant',
    insNumber: 'INS 392',
    functionSummary: 'Clean-label natural herbal antioxidant (carnosic acid & carnosol).',
    commonFoods: 'Vegetable oils, fried snacks, poultry sausages, meat patties, nuts',
    codexMaxLimit: '30 – 150 mg/kg (sum of carnosol & carnosic acid)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Clean-label natural alternative to TBHQ/BHA/BHT in meat and frying oil applications.'
  },

  // ============================================================================
  // EXTENDED EMULSIFIERS, STABILIZERS, THICKENERS & GUMS (E400 – E495)
  // ============================================================================
  {
    code: 'E401',
    name: 'Sodium Alginate',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 401',
    functionSummary: 'Seaweed hydrocolloid forming instant cold-set heat-stable gels in presence of calcium.',
    commonFoods: 'Ice cream, restructured onion rings, pimento olive stuffing, bakery cream fillings',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Extracted from brown seaweed; bake-stable gel ideal for fruit pastry fillings.'
  },
  {
    code: 'E406',
    name: 'Agar (Agar-Agar)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 406',
    functionSummary: '100% plant-derived seaweed gelling agent — premier Halal & Vegan substitute for gelatin.',
    commonFoods: 'Jellies, puddings, Turkish delight, icings, dairy desserts, microbiology media',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Sets firmly at 32–40°C and melts only above 85°C (large thermal hysteresis).'
  },
  {
    code: 'E410',
    name: 'Locust Bean Gum (Carob Bean Gum)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 410',
    functionSummary: 'Natural seed galactomannan giving creamy melt and ice-crystal control in ice cream.',
    commonFoods: 'Premium ice cream, cream cheese, infant formulas, sauces, ketchups',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Strongly synergistic with Xanthan Gum (E415) and Kappa-Carrageenan (E407).'
  },
  {
    code: 'E414',
    name: 'Gum Arabic (Acacia Gum)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 414',
    functionSummary: 'Natural tree-exudate emulsifier essential for citrus beverage flavor emulsions and spray-drying.',
    commonFoods: 'Carbonated citrus drinks (cloud/oil emulsions), coated candies, pastilles, flavor powders',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'High soluble dietary fiber (> 85%); provides low viscosity even at 30% solids.'
  },
  {
    code: 'E417',
    name: 'Tara Gum',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 417',
    functionSummary: 'Plant seed thickener bridging the functional properties of Guar (E412) and Locust Bean Gum (E410).',
    commonFoods: 'Ice cream, yogurt, frozen desserts, sauces, bakery fillings',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Cost-effective synergistic stabilizer with xanthan gum and carrageenan.'
  },
  {
    code: 'E418',
    name: 'Gellan Gum',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 418',
    functionSummary: 'Fermentation hydrocolloid suspending cocoa/fruit pulp particles at ultra-low dosage (0.03%).',
    commonFoods: 'Chocolate milk, plant milks (almond/oat), fruit pulp drinks, vegan jelly candies',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'High-acyl gives soft elastic gels; low-acyl gives firm brittle gels and fluid-gel suspensions.'
  },
  {
    code: 'E420',
    name: 'Sorbitol (and Sorbitol Syrup)',
    category: 'Sweetener',
    insNumber: 'INS 420',
    functionSummary: 'Sugar alcohol (polyol) humectant and bulk sweetener (~60% sweetness of sucrose).',
    commonFoods: 'Sugar-free chewing gum, diabetic sweets, soft cakes, surimi cryoprotectant',
    codexMaxLimit: 'GMP (Mandatory laxative warning in EU if > 10% product)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: '2.4–2.6 kcal/g; retains moisture and prevents staling in soft bakery items.'
  },
  {
    code: 'E421',
    name: 'Mannitol',
    category: 'Sweetener',
    insNumber: 'INS 421',
    functionSummary: 'Non-hygroscopic polyol sweetener and anti-sticking dusting powder for chewing gum.',
    commonFoods: 'Chewing gum coatings, sugar-free mints, chewable tablets, chocolate glazes',
    codexMaxLimit: 'GMP (Laxative warning if > 10%)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Provides distinct cooling sensation in the mouth and resists moisture pickup.'
  },
  {
    code: 'E422',
    name: 'Glycerol (Glycerin)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 422',
    functionSummary: 'Humectant, water-activity reducer, and solvent keeping bars and cakes moist.',
    commonFoods: 'Protein bars, soft cakes, fondant icing, flavorings, dried fruit coatings',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Can be derived from vegetable oils (Halal) or animal fats/tallow — always demand Plant-Origin CoA.'
  },
  {
    code: 'E432',
    name: 'Polysorbate 20 (Tween 20)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 432',
    functionSummary: 'Hydrophilic oil-in-water emulsifier for flavor oils and beverage clouding agents.',
    commonFoods: 'Beverage flavor emulsions, cake mixes, whipped toppings',
    codexMaxLimit: '1,000 – 3,000 mg/kg (Group ADI 25 mg/kg bw)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Lauric acid ester — verify coconut/palm plant fatty acid source.'
  },
  {
    code: 'E433',
    name: 'Polysorbate 80 (Tween 80)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 433',
    functionSummary: 'High-HLB emulsifier giving dry extrusion and slow melt-down in ice cream.',
    commonFoods: 'Ice cream, pickles (disperses spice oils), sauces, whipped creams',
    codexMaxLimit: '1,000 – 3,000 mg/kg',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Oleic acid can be vegetable or animal-derived — require Halal Certificate.'
  },
  {
    code: 'E435',
    name: 'Polysorbate 60 (Tween 60)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 435',
    functionSummary: 'Emulsifier enhancing aeration and volume in cakes, icings, and whipped toppings.',
    commonFoods: 'Sponge cakes, non-dairy whipped toppings, chocolate coatings, sauces',
    codexMaxLimit: '1,000 – 5,000 mg/kg',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Stearic acid ester — verify strictly plant-origin fatty acids.'
  },
  {
    code: 'E451',
    name: 'Triphosphates (STPP / KTPP)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 451',
    functionSummary: 'Water-holding, tenderizing, and emulsion-stabilizing phosphate for meat, poultry & seafood.',
    commonFoods: 'Marinated chicken nuggets, burgers, sausages, frozen shrimp, instant noodles',
    codexMaxLimit: '5,000 mg/kg (as P₂O₅ in meat/seafood)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Sodium Tripolyphosphate (E451i) boosts meat pH and ionic strength to reduce cooking purge loss.'
  },
  {
    code: 'E452',
    name: 'Polyphosphates (SHMP)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 452',
    functionSummary: 'Calcium-sequestering stabilizer used in meat brines, UHT dairy, and beverage preservation.',
    commonFoods: 'Processed cheese, meat injections, shelf-stable fruit drinks (with sorbate), seafood',
    codexMaxLimit: '1,000 – 5,000 mg/kg (as P₂O₅)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Sodium Hexametaphosphate (E452i) enhances potassium sorbate antimicrobial efficacy in RTD beverages.'
  },
  {
    code: 'E460',
    name: 'Microcrystalline Cellulose (MCC) & Powdered Cellulose',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 460(i)/(ii)',
    functionSummary: 'Plant-fiber anti-caking agent, fat mimetic, and heat-stable suspension stabilizer.',
    commonFoods: 'Shredded cheese (anti-caking), chocolate milk, low-fat dressings, bakery fiber',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Colloidal MCC (co-processed with CMC) builds a thixotropic network that withstands UHT retorting.'
  },
  {
    code: 'E461',
    name: 'Methyl Cellulose (MC)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 461',
    functionSummary: 'Unique thermal-gelling plant hydrocolloid (gels when heated, melts when cooled).',
    commonFoods: 'Plant-based burgers, onion rings, gluten-free bread, fried batters (reduces oil uptake)',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Key binder in plant-based meat analogs giving meaty hot-bite texture.'
  },
  {
    code: 'E464',
    name: 'Hydroxypropyl Methyl Cellulose (HPMC)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 464',
    functionSummary: 'Plant-based film former, thermal binder, and vegetarian capsule shell polymer.',
    commonFoods: 'Gluten-free bakery, Halal/Vegan supplement capsules, fried snack batters, whipped toppings',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: '100% plant-derived cellulose alternative to animal gelatin capsules.'
  },
  {
    code: 'E472a',
    name: 'Acetic Acid Esters of Mono- and Diglycerides (ACETEM)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 472a',
    functionSummary: 'Aerating emulsifier and edible moisture-barrier film for toppings and coatings.',
    commonFoods: 'Whipped dessert toppings, cake emulsifiers, dried fruit coatings',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Verify plant-derived mono/diglycerides (palm/soy) on supplier CoA.'
  },
  {
    code: 'E472b',
    name: 'Lactic Acid Esters of Mono- and Diglycerides (LACTEM)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 472b',
    functionSummary: 'Alpha-tending cake and whipped-cream aerating emulsifier.',
    commonFoods: 'Cake premixes, sponge cakes, whipped toppings, mousses',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Must confirm vegetable fatty-acid origin.'
  },
  {
    code: 'E475',
    name: 'Polyglycerol Esters of Fatty Acids (PGE)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 475',
    functionSummary: 'High-performance sponge cake aerating emulsifier and margarine anti-spattering agent.',
    commonFoods: 'Sponge cake gels, fine bakery, cooking margarines, dessert foams',
    codexMaxLimit: '5,000 – 10,000 mg/kg',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Fatty acids & glycerol must be verified 100% plant-derived.'
  },
  {
    code: 'E476',
    name: 'Polyglycerol Polyricinoleate (PGPR)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 476',
    functionSummary: 'Castor-oil-derived viscosity reducer drastically cutting yield value in molten chocolate.',
    commonFoods: 'Milk/dark chocolates, compound coatings, ice cream chocolate dips, low-fat spreads',
    codexMaxLimit: '5,000 mg/kg in cocoa & chocolate products',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'Usually plant-derived (castor bean oil + vegetable glycerol); confirm Halal certificate for glycerol fraction.'
  },
  {
    code: 'E481',
    name: 'Sodium Stearoyl-2-Lactylate (SSL)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 481',
    functionSummary: 'Premier dough strengthener and crumb softener extending bread softness by days.',
    commonFoods: 'Sliced sandwich bread, burger buns, biscuits, coffee creamers, tortillas',
    codexMaxLimit: '3,000 – 5,000 mg/kg in bakery',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Verify palm-based stearic acid (not animal tallow). Complexes with amylose to retard staling.'
  },
  {
    code: 'E491',
    name: 'Sorbitan Monostearate (Span 60)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 491',
    functionSummary: 'Emulsifier preventing fat bloom in chocolate coatings and rehydrating instant dry yeast.',
    commonFoods: 'Active/instant dry baker’s yeast, chocolate coatings, cakes, margarines',
    codexMaxLimit: '5,000 – 10,000 mg/kg',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Stearic acid source must be certified plant-origin.'
  },

  // ============================================================================
  // EXTENDED ANTI-CAKING, RAISING, FIRMING & ACIDITY AGENTS (E501 – E585)
  // ============================================================================
  {
    code: 'E501',
    name: 'Potassium Carbonates',
    category: 'Acidity Regulator',
    insNumber: 'INS 501',
    functionSummary: 'Alkalizing agent for Dutch-processed dark cocoa and elastic alkaline noodles.',
    commonFoods: 'Dutch-processed cocoa powder, ramen/instant noodles, gingerbread',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Gives instant noodles their springy chew and characteristic pale yellow color.'
  },
  {
    code: 'E504',
    name: 'Magnesium Carbonates',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 504',
    functionSummary: 'Mineral anti-caking agent, acidity regulator, and magnesium fortificant.',
    commonFoods: 'Table salt, spice mixes, powdered milk, chewing gum, confectionery',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Keeps free-flowing salt and hygroscopic seasoning powders clump-free.'
  },
  {
    code: 'E508',
    name: 'Potassium Chloride (KCl)',
    category: 'Flavor Enhancer',
    insNumber: 'INS 508',
    functionSummary: 'Primary mineral salt replacer for sodium-reduction formulations.',
    commonFoods: 'Low-sodium snacks, soups, sauces, processed meats, electrolyte drinks',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Can replace 25–35% of NaCl before metallic/bitter off-notes appear; pair with yeast extract.'
  },
  {
    code: 'E509',
    name: 'Calcium Chloride',
    category: 'Acidity Regulator',
    insNumber: 'INS 509',
    functionSummary: 'Essential milk coagulant aid in cheesemaking and firming agent for canned/pickled vegetables.',
    commonFoods: 'Cheddar/mozzarella cheese (restores Ca²⁺ after pasteurization), canned tomatoes, pickles, bottled water',
    codexMaxLimit: 'GMP (typically 0.02% in cheese milk)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Cross-links fruit/vegetable pectin to preserve crisp texture during retorting.'
  },
  {
    code: 'E516',
    name: 'Calcium Sulfate (Gypsum)',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 516',
    functionSummary: 'Tofu coagulant, dough conditioner, yeast food, and mineral calcium fortificant.',
    commonFoods: 'Tofu, commercial bread improvers, canned vegetables, brewing water treatment',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Strengthens gluten network in soft-water bakeries.'
  },
  {
    code: 'E524',
    name: 'Sodium Hydroxide (Caustic Soda — Food Grade)',
    category: 'Acidity Regulator',
    insNumber: 'INS 524',
    functionSummary: 'Strong alkali used for pretzel glazing, olive debittering, and cocoa alkalization.',
    commonFoods: 'Bavarian pretzels, black ripe olives, cocoa processing, hominy',
    codexMaxLimit: 'GMP (must be food-grade FCC/E524; neutralized in final product)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Also primary CIP alkaline detergent — strictly segregate food-grade processing stock from sanitation chemicals.'
  },
  {
    code: 'E535',
    name: 'Sodium Ferrocyanide',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 535',
    functionSummary: 'Highly effective crystal-modifying anti-caking agent for table and industrial salt.',
    commonFoods: 'Refined table salt, iodized salt, industrial seasoning salt',
    codexMaxLimit: '10 – 20 mg/kg (as anhydrous ferrocyanide)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Strongly bound complex (NOT free cyanide); safe within Codex/EFSA limits.'
  },
  {
    code: 'E536',
    name: 'Potassium Ferrocyanide',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 536',
    functionSummary: 'Anti-caking agent preventing moisture clumping in table salt.',
    commonFoods: 'Refined table salt, salt substitutes',
    codexMaxLimit: '10 – 20 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Used at trace ppm levels (typically 5–10 ppm) in free-flow salt.'
  },
  {
    code: 'E553b',
    name: 'Talc (Magnesium Silicate)',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 553b',
    functionSummary: 'Anti-sticking dusting powder and polishing agent in chewing gum and confectionery.',
    commonFoods: 'Chewing gum slabs, polished rice (where permitted), sugar-coated candies, food supplements',
    codexMaxLimit: 'GMP (must be certified 100% asbestos-free food grade)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Mandatory supplier CoA verifying zero asbestos fibers.'
  },
  {
    code: 'E575',
    name: 'Glucono-Delta-Lactone (GDL)',
    category: 'Acidity Regulator',
    insNumber: 'INS 575',
    functionSummary: 'Slow-release acidulant that hydrolyzes gradually into gluconic acid without instant curdling.',
    commonFoods: 'Feta/cottage cheese, silken tofu, fermented-style sausages, slow-acting baking powders',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Enables rapid controlled pH drop in dry sausages and smooth gel texture in dairy/tofu.'
  },

  // ============================================================================
  // EXTENDED FLAVOR ENHANCERS (E620 – E650)
  // ============================================================================
  {
    code: 'E622',
    name: 'Monopotassium Glutamate (MPG)',
    category: 'Flavor Enhancer',
    insNumber: 'INS 622',
    functionSummary: 'Low-sodium umami flavor enhancer replacing MSG in reduced-salt savory foods.',
    commonFoods: 'Low-sodium bouillons, soups, noodle seasonings, savory snacks',
    codexMaxLimit: '10,000 mg/kg (as glutamic acid)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Produced by bacterial fermentation of plant molasses/starch.'
  },
  {
    code: 'E627',
    name: 'Disodium Guanylate (GMP)',
    category: 'Flavor Enhancer',
    insNumber: 'INS 627',
    functionSummary: 'Potent nucleotide umami booster with intense synergy alongside MSG (E621).',
    commonFoods: 'Instant noodles, potato chips, chicken stock cubes, savory sauces',
    codexMaxLimit: '500 mg/kg (as guanylic acid)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Usually tapioca/yeast fermented (Halal), occasionally fish/meat derived — verify plant/microbial origin.'
  },
  {
    code: 'E631',
    name: 'Disodium Inosinate (IMP)',
    category: 'Flavor Enhancer',
    insNumber: 'INS 631',
    functionSummary: 'Meaty umami nucleotide synergist commonly combined 50:50 with E627 (as E635).',
    commonFoods: 'Instant noodle tastemakers, extruded snacks, soups, seasoning powders',
    codexMaxLimit: '500 mg/kg (as inosinic acid)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Can be derived from tapioca fermentation (Halal) or fish/pork meat extract — strictly verify Halal Certificate.'
  },
  {
    code: 'E640',
    name: 'Glycine and its Sodium Salt',
    category: 'Flavor Enhancer',
    insNumber: 'INS 640',
    functionSummary: 'Sweet-tasting amino acid masking bitterness of saccharin/stevia and preserving chilled foods.',
    commonFoods: 'Seasoning mixes, ready-to-eat chilled bento/meats, diet beverages',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Synthetic glycine is Halal; rarely hydrolyzed from animal gelatin — verify synthetic origin.'
  },

  // ============================================================================
  // EXTENDED GLAZING AGENTS, GASES & SWEETENERS (E900 – E968)
  // ============================================================================
  {
    code: 'E900',
    name: 'Dimethyl Polysiloxane (Silicone Antifoam)',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 900a',
    functionSummary: 'Ultra-low-dose anti-foaming agent extending deep-frying oil life and controlling jam/syrup boiling foam.',
    commonFoods: 'Commercial frying oils (fast food), jams, fruit juices, fermentation broths',
    codexMaxLimit: '10 mg/kg in frying oils and jams',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Forms a microscopic surface barrier on frying oil, dramatically slowing thermal oxidation and foaming.'
  },
  {
    code: 'E901',
    name: 'Beeswax (White & Yellow)',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 901',
    functionSummary: 'Natural glossy glazing agent and anti-sticking coating for confectionery and citrus fruits.',
    commonFoods: 'Gummy candies, jelly beans, chocolate dragees, fresh apples/citrus wax coating',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Permitted Halal (insect-secreted wax like honey); note: not Vegan.'
  },
  {
    code: 'E903',
    name: 'Carnauba Wax',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 903',
    functionSummary: 'Hard, high-melting plant palm wax giving mirror-shine gloss to candies and chocolate beans.',
    commonFoods: 'Sugar-coated chocolate lentils, jelly beans, chewing gum, fresh fruit waxing',
    codexMaxLimit: '200 – 1,200 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: '100% plant-derived from Copernicia prunifera palm leaves (Halal & Vegan).'
  },
  {
    code: 'E904',
    name: 'Shellac',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 904',
    functionSummary: 'High-gloss resinous confectionery glaze and moisture-barrier coating.',
    commonFoods: 'Glossy chocolate nuts, jelly beans, sprinkles, coated apples/citrus',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Secreted by lac beetle & often dissolved in ethanol solvent — consult local Halal certification board (JAKIM/SANHA/PSQCA).'
  },
  {
    code: 'E920',
    name: 'L-Cysteine',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 920',
    functionSummary: 'Reducing amino acid dough conditioner relaxing gluten for easy sheeting of pizza & biscuits.',
    commonFoods: 'Pizza doughs, burger buns, biscuits, crackers, meaty flavor precursors',
    codexMaxLimit: '75 – 90 mg/kg (flour basis)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'CRITICAL HALAL AUDIT ITEM: Historically extracted from human hair or duck/hog feathers (Haram/Mushbooh); ONLY accept bacterial fermentation-derived E920 with Halal CoA!'
  },
  {
    code: 'E924',
    name: 'Potassium Bromate',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 924',
    functionSummary: 'Oxidizing flour improver — BANNED across Pakistan (PFA/PSQCA), EU, UK, GCC, Canada & India.',
    commonFoods: 'Historically bread flour (PROHIBITED in most countries; still permitted in USA with restrictions)',
    codexMaxLimit: 'PROHIBITED (0 mg/kg) in EU, UK, Pakistan, GCC, China & India',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'REGULATORY ZERO TOLERANCE: Classified IARC Group 2B carcinogen; replace with Ascorbic Acid (E300) + Fungal Alpha-Amylase.'
  },
  {
    code: 'E941',
    name: 'Nitrogen (N₂ — Food Grade)',
    category: 'Preservative',
    insNumber: 'INS 941',
    functionSummary: 'Inert flushing gas displacing oxygen in snack bags, milk powder tins, and edible oil headspace.',
    commonFoods: 'Potato chip bags, infant formula cans, roasted coffee, nuts, edible oil bottles',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Prevents lipid oxidation rancidity and cushions fragile chips against crushing.'
  },
  {
    code: 'E942',
    name: 'Nitrous Oxide (N₂O)',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 942',
    functionSummary: 'Fat-soluble aerosol propellant for whipped dairy cream canisters.',
    commonFoods: 'Aerosol whipped cream, culinary foams',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Dissolves in milk fat under pressure and expands into fine stable foam upon dispensing.'
  },
  {
    code: 'E952',
    name: 'Cyclamates (Sodium / Calcium Cyclamate)',
    category: 'Sweetener',
    insNumber: 'INS 952',
    functionSummary: 'Heat-stable synthetic sweetener (~30–50x sweeter than sugar), often blended 10:1 with saccharin.',
    commonFoods: 'Tabletop sweeteners, diet squashes, canned fruits (EU/Pakistan/GCC)',
    codexMaxLimit: '250 mg/L in beverages (EU); BANNED in USA (FDA)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'EXPORT WARNING: Approved in EU, Codex & Pakistan, but banned in USA since 1969.'
  },
  {
    code: 'E953',
    name: 'Isomalt',
    category: 'Sweetener',
    insNumber: 'INS 953',
    functionSummary: 'Tooth-friendly bulk sugar replacer ideal for sugar-free hard boiled candies and sculptures.',
    commonFoods: 'Sugar-free hard candies, throat lozenges, coated chewing gums, chocolates',
    codexMaxLimit: 'GMP (Laxative warning if > 10%)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Very low hygroscopicity — prevents sugar-free hard candies from becoming sticky in humid climates.'
  },
  {
    code: 'E954',
    name: 'Saccharin and its Na/K/Ca Salts',
    category: 'Sweetener',
    insNumber: 'INS 954',
    functionSummary: 'Heat-stable high-intensity synthetic sweetener (~300–500x sweeter than sucrose).',
    commonFoods: 'Tabletop sweeteners, diet drinks, jams, pickles, toothpaste',
    codexMaxLimit: '80 – 100 mg/L in beverages; 200 mg/kg in desserts',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ADI: 0–5 mg/kg bw. Slight metallic/bitter aftertaste masked by blending with cyclamate or aspartame.'
  },
  {
    code: 'E961',
    name: 'Neotame',
    category: 'Sweetener',
    insNumber: 'INS 961',
    functionSummary: 'Ultra-high-intensity sweetener (~7,000–13,000x sweeter than sugar) requiring NO PKU warning.',
    commonFoods: 'Beverages, bakery, chewing gum, dairy desserts, tabletop blends',
    codexMaxLimit: '20 – 32 mg/kg',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Unlike aspartame, does NOT release significant phenylalanine and withstands baking heat.'
  },
  {
    code: 'E962',
    name: 'Salt of Aspartame-Acesulfame',
    category: 'Sweetener',
    insNumber: 'INS 962',
    functionSummary: 'Crystalline synergistic salt delivering clean sucrose-like sweetness (~350x sugar).',
    commonFoods: 'Sugar-free chewing gum, powdered drink mixes, diet sodas',
    codexMaxLimit: '350 – 450 mg/L (based on Ace-K / Aspartame equivalents)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Requires mandatory Phenylalanine (PKU) label warning.'
  },
  {
    code: 'E965',
    name: 'Maltitol (and Maltitol Syrup)',
    category: 'Sweetener',
    insNumber: 'INS 965',
    functionSummary: 'Bulk polyol sweetener closely matching sucrose taste (90% sweetness) and melting behavior.',
    commonFoods: 'Sugar-free chocolate bars, keto biscuits, protein bars, sugar-free ice cream',
    codexMaxLimit: 'GMP (Laxative warning if > 10%)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Premier bulk replacer in sugar-free chocolate without strong cooling effect.'
  },
  {
    code: 'E967',
    name: 'Xylitol',
    category: 'Sweetener',
    insNumber: 'INS 967',
    functionSummary: 'Tooth-friendly (anti-cariogenic) polyol with equal sweetness to sugar and strong minty cooling.',
    commonFoods: 'Dental chewing gums, mints, sugar-free lozenges, oral care',
    codexMaxLimit: 'GMP (Laxative warning if > 10%)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Clinically proven to reduce dental plaque (Streptococcus mutans); note: toxic to dogs.'
  },
  {
    code: 'E968',
    name: 'Erythritol',
    category: 'Sweetener',
    insNumber: 'INS 968',
    functionSummary: 'Zero-calorie fermented polyol (~70% sweetness) with highest digestive tolerance among polyols.',
    commonFoods: 'Keto baking mixes, Stevia/Monkfruit tabletop blends, low-calorie ice cream, RTD teas',
    codexMaxLimit: 'GMP (1.6% max in EU beverages)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: '0.2 kcal/g; excreted unchanged in urine, avoiding laxative side effects at normal serving sizes.'
  },

  // ============================================================================
  // MODIFIED STARCHES, ENZYMES & SOLVENTS (E1100 – E1520)
  // ============================================================================
  {
    code: 'E1100',
    name: 'Alpha-Amylase (Enzyme)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 1100',
    functionSummary: 'Starch-hydrolyzing enzyme improving bread oven-spring, crust color, and juice clarity.',
    commonFoods: 'Bread improvers, glucose syrup manufacturing, clarified apple juice, malt drinks',
    codexMaxLimit: 'GMP (Processing aid in many jurisdictions)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Verify microbial/fungal (Aspergillus oryzae) or plant origin — avoid porcine pancreatic amylase.'
  },
  {
    code: 'E1103',
    name: 'Invertase',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 1103',
    functionSummary: 'Yeast-derived enzyme converting solid sucrose into soft liquid invert sugar inside fondant centers.',
    commonFoods: 'Soft-centered chocolates, fondant creams, invert syrups, marzipan',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Derived from baker’s yeast (Saccharomyces cerevisiae); liquefies chocolate centers post-enrobing.'
  },
  {
    code: 'E1105',
    name: 'Lysozyme',
    category: 'Preservative',
    insNumber: 'INS 1105',
    functionSummary: 'Natural antimicrobial enzyme preventing Clostridium tyrobutyricum late-blowing in aged cheeses.',
    commonFoods: 'Grana Padano, Parmigiano, Gouda, Edam & ripened hard cheeses',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'ALLERGEN ALERT: Extracted from hen egg white — mandatory EGG allergen declaration on cheese labels!'
  },
  {
    code: 'E1200',
    name: 'Polydextrose',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 1200',
    functionSummary: 'Low-calorie (1 kcal/g) soluble prebiotic bulking fiber replacing sugar and fat.',
    commonFoods: 'Sugar-free cakes, high-fiber nutrition bars, reduced-calorie ice cream, dressings',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Restores mouthfeel and bulk lost when sucrose is replaced by high-intensity sweeteners.'
  },
  {
    code: 'E1414',
    name: 'Acetylated Distarch Phosphate (Modified Starch)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 1414',
    functionSummary: 'Freeze-thaw and high-shear stable modified food starch for creamy sauces and dairy.',
    commonFoods: 'Tomato ketchup, yogurt, frozen ready meals, gravies, fruit pie fillings',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Prevents syneresis (water separation) during cold storage and pasteurization.'
  },
  {
    code: 'E1422',
    name: 'Acetylated Distarch Adipate (Modified Starch)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 1422',
    functionSummary: 'Premier acid-, heat-, and shear-resistant starch for ketchup, mayonnaise, and retorted sauces.',
    commonFoods: 'Tomato ketchup, mayonnaise, chili garlic sauce, stirred yogurt, baby food jars',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Industry gold standard for high-acid (pH 3.5–4.0) sauces subjected to UHT/homogenization.'
  },
  {
    code: 'E1442',
    name: 'Hydroxypropyl Distarch Phosphate (Modified Starch)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 1442',
    functionSummary: 'Ultra-smooth, glossy, freeze-thaw stable modified waxy maize/tapioca starch.',
    commonFoods: 'Creamy dairy desserts, mayonnaise, Asian oyster/chili sauces, instant noodles',
    codexMaxLimit: 'GMP (Quantum Satis)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Gives high sheen, short creamy texture, and superior cold-storage stability.'
  },
  {
    code: 'E1450',
    name: 'Starch Sodium Octenyl Succinate (OSA Starch)',
    category: 'Emulsifier & Stabilizer',
    insNumber: 'INS 1450',
    functionSummary: 'Emulsifying starch replacing Gum Arabic in beverage flavor clouds and spray-dried oils.',
    commonFoods: 'Citrus soft drink cloud emulsions, spray-dried flavor powders, salad dressings, infant formula',
    codexMaxLimit: 'GMP (up to 50,000 mg/kg in infant formulas)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Consistent cost-effective alternative to E414 Gum Arabic for beverage oil-in-water emulsions.'
  },
  {
    code: 'E1518',
    name: 'Glyceryl Triacetate (Triacetin)',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 1518',
    functionSummary: 'Carrier solvent for liquid food flavors and humectant in chewing gum.',
    commonFoods: 'Liquid bakery/beverage flavorings, chewing gum bases',
    codexMaxLimit: '3,000 mg/kg (as flavor carrier)',
    halalStatus: 'Mushbooh (Verify Animal vs Plant Source)',
    safetyNotes: 'HALAL AUDIT NOTE: Verify plant-origin glycerol used to manufacture triacetin.'
  },
  {
    code: 'E1520',
    name: 'Propylene Glycol (1,2-Propanediol)',
    category: 'Anti-Caking & Glazing',
    insNumber: 'INS 1520',
    functionSummary: 'Primary Halal non-alcoholic carrier solvent for food flavors, colors, and antioxidants.',
    commonFoods: 'Liquid vanilla/fruit essences, food color drops, cake mixes, soft drinks',
    codexMaxLimit: '1,000 mg/kg in beverages; 3,000 mg/kg in foods (EU)',
    halalStatus: 'Halal (Plant / Synthetic)',
    safetyNotes: 'Preferred Halal alternative to ethanol as a carrier solvent for oil-soluble flavors.'
  }
];

