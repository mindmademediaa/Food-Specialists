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
  }
];
