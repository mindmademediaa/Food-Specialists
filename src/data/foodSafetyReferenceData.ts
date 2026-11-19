export type FoodAuthorityBody =
  | 'PFA'
  | 'PSQCA'
  | 'SFDA / GSO'
  | 'Codex'
  | 'EFSA / EU'
  | 'FDA / USA'
  | 'FSSAI / ISO';

export type FoodCommodityCategory =
  | 'Dairy & Milk'
  | 'Edible Oils & Ghee'
  | 'Drinking & Bottled Water'
  | 'Spices, Grains & Mycotoxins'
  | 'Beverages & Juices'
  | 'Meat, Poultry & Seafood'
  | 'Bakery, Flour & Sugar'
  | 'Heavy Metals & Contaminants'
  | 'Honey, Jams, Sauces & Tea'
  | 'Infant Formula & Special Nutrition'
  | 'Plant Hygiene & Swab Limits';

export interface FoodAuthorityLimitRecord {
  id: string;
  authority: FoodAuthorityBody;
  category: FoodCommodityCategory;
  product: string;
  parameter: string;
  limitValue: string;
  unit: string;
  limitType: 'Minimum' | 'Maximum' | 'Range' | 'Zero Tolerance';
  testMethod: string;
  clauseRef: string;
  complianceNote: string;
}

export const FOOD_AUTHORITY_LIMITS: FoodAuthorityLimitRecord[] = [
  // DAIRY & MILK
  {
    id: 'pfa-milk-fat',
    authority: 'PFA',
    category: 'Dairy & Milk',
    product: 'Pasteurized / Standardized Cow Milk',
    parameter: 'Milk Fat (Minimum) & SNF (Minimum)',
    limitValue: '≥ 3.5% Fat · ≥ 8.5% SNF',
    unit: '% w/w',
    limitType: 'Minimum',
    testMethod: 'Gerber / Rose-Gottlieb & Gravimetric SNF',
    clauseRef: 'Punjab Pure Food Regulations 2018 (Rule 5)',
    complianceNote: 'Buffalo milk requires ≥ 5.0% Fat and ≥ 9.0% SNF; UHT Milk ≥ 3.5% Fat / ≥ 8.5% SNF.'
  },
  {
    id: 'pfa-milk-aflatoxin-m1',
    authority: 'PFA',
    category: 'Dairy & Milk',
    product: 'Raw, UHT & Powdered Milk',
    parameter: 'Aflatoxin M1',
    limitValue: '≤ 0.50 (Codex/PFA) · ≤ 0.05 (EU Export)',
    unit: 'µg/L (ppb)',
    limitType: 'Maximum',
    testMethod: 'ELISA Rapid Screen / HPLC-FLD Confirmation',
    clauseRef: 'PFA Contaminant Schedule & Codex CXS 193-1995',
    complianceNote: 'Strict incoming tanker screening required prior to pasteurization reception.'
  },
  {
    id: 'pfa-milk-mbr',
    authority: 'PFA',
    category: 'Dairy & Milk',
    product: 'Raw Chilled Milk Reception',
    parameter: 'Methylene Blue Reduction (MBR) Time',
    limitValue: '≥ 4.5 hours (Good) · Reject < 2.0 hrs',
    unit: 'Hours at 37°C',
    limitType: 'Minimum',
    testMethod: 'IS / AOAC Methylene Blue Dye Reduction',
    clauseRef: 'Dairy QA Reception SOP / PSQCA',
    complianceNote: 'Also verify Platform Tests: Alcohol Test (Negative at 68%), COB (Negative), Titratable Acidity ≤ 0.16% lactic acid.'
  },
  {
    id: 'psqca-milk-powder',
    authority: 'PSQCA',
    category: 'Dairy & Milk',
    product: 'Whole Milk Powder (WMP) / Skim Milk Powder (SMP)',
    parameter: 'Moisture Content & Total Milk Fat',
    limitValue: 'Moisture ≤ 4.0% · WMP Fat ≥ 26.0% · SMP Fat ≤ 1.5%',
    unit: '% w/w',
    limitType: 'Range',
    testMethod: 'ISO 5537 Vacuum Oven & ISO 1736',
    clauseRef: 'PS: 363 / Codex CXS 207-1999',
    complianceNote: 'Standard Plate Count ≤ 50,000 CFU/g; Coliforms ≤ 10 CFU/g; Salmonella Absent in 25 g.'
  },
  {
    id: 'sfda-dairy-micro',
    authority: 'SFDA / GSO',
    category: 'Dairy & Milk',
    product: 'Pasteurized Milk & Yogurt (Export GCC)',
    parameter: 'Listeria monocytogenes & Salmonella spp.',
    limitValue: 'Absent in 25 mL / 25 g',
    unit: 'Presence/Absence',
    limitType: 'Zero Tolerance',
    testMethod: 'ISO 11290-1 / ISO 6579-1',
    clauseRef: 'GSO 1016 Microbiological Criteria',
    complianceNote: 'Cold chain distribution strictly ≤ 4°C throughout retail shelf-life.'
  },

  // EDIBLE OILS & GHEE
  {
    id: 'pfa-oil-pv',
    authority: 'PFA',
    category: 'Edible Oils & Ghee',
    product: 'Refined Cooking Oil & Banaspati Ghee',
    parameter: 'Peroxide Value (PV)',
    limitValue: '≤ 10.0 (Fresh Plant Gate ≤ 5.0)',
    unit: 'meq O₂/kg oil',
    limitType: 'Maximum',
    testMethod: 'AOCS Cd 8b-90 / ISO 3960',
    clauseRef: 'PFA Edible Oil & Banaspati Standards / Codex CXS 210',
    complianceNote: 'Cold-pressed virgin oils permit up to 15.0 meq O₂/kg under Codex CXS 210.'
  },
  {
    id: 'psqca-oil-trans-fat',
    authority: 'PSQCA',
    category: 'Edible Oils & Ghee',
    product: 'Banaspati, Margarine & Industrial Shortening',
    parameter: 'Industrially Produced Trans Fatty Acids (iTFA)',
    limitValue: '≤ 2.0 (WHO REPLACE Target)',
    unit: 'g / 100 g total fat',
    limitType: 'Maximum',
    testMethod: 'GC-FID (AOAC 996.06 / AOCS Ce 1h-05)',
    clauseRef: 'PFA / PSQCA Trans Fat Elimination Standard 2023-2025',
    complianceNote: 'Mandatory reformulation away from partially hydrogenated oils; Acid Value ≤ 0.6 mg KOH/g.'
  },
  {
    id: 'codex-oil-erucic',
    authority: 'Codex',
    category: 'Edible Oils & Ghee',
    product: 'Low Erucic Acid Rapeseed / Canola Oil',
    parameter: 'Erucic Acid & Moisture + Volatile Matter',
    limitValue: 'Erucic Acid ≤ 2.0% · Moisture ≤ 0.2%',
    unit: '% w/w',
    limitType: 'Maximum',
    testMethod: 'ISO 5508 GC / ISO 662',
    clauseRef: 'Codex CXS 210-1999',
    complianceNote: 'Vitamin A fortification in Pakistan mandatory at 33,000–45,000 IU/kg for cooking oil & banaspati.'
  },

  // DRINKING & BOTTLED WATER
  {
    id: 'psqca-water-tds',
    authority: 'PSQCA',
    category: 'Drinking & Bottled Water',
    product: 'Bottled Drinking Water (Mineral / Purified)',
    parameter: 'TDS, pH, Arsenic & Microbial Limits',
    limitValue: 'TDS 100–500 · pH 6.5–8.5 · Arsenic ≤ 10 µg/L',
    unit: 'mg/L (ppm) / pH',
    limitType: 'Range',
    testMethod: 'APHA Standard Methods (SMWW 2540C / ICP-MS)',
    clauseRef: 'PS: 4639 Bottled Drinking Water Standard',
    complianceNote: 'E. coli, Coliforms & Pseudomonas aeruginosa must be 0 CFU / 250 mL.'
  },
  {
    id: 'pfa-water-bromate',
    authority: 'PFA',
    category: 'Drinking & Bottled Water',
    product: 'Ozonated Bottled Water',
    parameter: 'Bromate (Ozonation By-product)',
    limitValue: '≤ 10',
    unit: 'µg/L (ppb)',
    limitType: 'Maximum',
    testMethod: 'EPA 300.1 Ion Chromatography',
    clauseRef: 'WHO / PFA Bottled Water Regulations',
    complianceNote: 'Control ozone contact dosage and source bromide concentration to prevent bromate spike.'
  },
  {
    id: 'sfda-water-micro',
    authority: 'SFDA / GSO',
    category: 'Drinking & Bottled Water',
    product: 'Bottled Drinking Water (GSO 1025)',
    parameter: 'Total Coliforms, Fecal Streptococci & P. aeruginosa',
    limitValue: '0 CFU / 250 mL',
    unit: 'CFU / 250 mL',
    limitType: 'Zero Tolerance',
    testMethod: 'Membrane Filtration ISO 9308-1 / ISO 16266',
    clauseRef: 'GSO 1025 / SFDA Technical Regulation',
    complianceNote: 'TPC at 22°C ≤ 100 CFU/mL and at 37°C ≤ 20 CFU/mL at bottling.'
  },

  // SPICES, GRAINS & MYCOTOXINS
  {
    id: 'pfa-spice-aflatoxin',
    authority: 'PFA',
    category: 'Spices, Grains & Mycotoxins',
    product: 'Red Chilli Powder, Turmeric & Mixed Spices',
    parameter: 'Total Aflatoxins (B1+B2+G1+G2) & Aflatoxin B1',
    limitValue: 'Total ≤ 10–15 · B1 ≤ 5.0 (EU Export B1 ≤ 2.0)',
    unit: 'µg/kg (ppb)',
    limitType: 'Maximum',
    testMethod: 'IAC-HPLC-FLD (AOAC 999.07)',
    clauseRef: 'PFA Pure Food Regulations / EU 2023/915',
    complianceNote: 'Zero tolerance for Sudan I–IV synthetic dyes; Acid-insoluble ash ≤ 1.25–1.5%.'
  },
  {
    id: 'codex-grain-ochratoxin',
    authority: 'Codex',
    category: 'Spices, Grains & Mycotoxins',
    product: 'Wheat, Rice, Barley & Dried Spices',
    parameter: 'Ochratoxin A (OTA) & Moisture Content',
    limitValue: 'OTA ≤ 5.0 µg/kg · Grain Moisture ≤ 13.0–14.0%',
    unit: 'µg/kg / % w/w',
    limitType: 'Maximum',
    testMethod: 'LC-MS/MS / AOAC Oven Moisture',
    clauseRef: 'Codex CXS 193-1995 & CXC 51-2003',
    complianceNote: 'Maintain silo storage relative humidity < 65% and a_w ≤ 0.65 to prevent Aspergillus growth.'
  },

  // BEVERAGES & JUICES
  {
    id: 'codex-juice-brix',
    authority: 'Codex',
    category: 'Beverages & Juices',
    product: '100% Reconstituted Mango / Orange / Apple Juice',
    parameter: 'Minimum °Brix (Soluble Solids) & Patulin (Apple)',
    limitValue: 'Orange ≥ 11.2° · Apple ≥ 11.5° · Mango ≥ 13.5° · Patulin ≤ 50 µg/kg',
    unit: '°Brix / µg/kg',
    limitType: 'Range',
    testMethod: 'Refractometry (AOAC 932.12) & HPLC-UV',
    clauseRef: 'Codex CXS 247-2005 Fruit Juices & Nectars',
    complianceNote: 'No added preservatives permitted in 100% pure fruit juice under Codex unless declared as nectar/drink.'
  },
  {
    id: 'pfa-bev-benzoate',
    authority: 'PFA',
    category: 'Beverages & Juices',
    product: 'Flavored Drinks, Squash & CSDs',
    parameter: 'Sodium Benzoate (E211) & Potassium Sorbate (E202)',
    limitValue: 'Benzoate ≤ 150 mg/L (Flavored Drink) · Sorbate ≤ 300 mg/L',
    unit: 'mg/L (ppm)',
    limitType: 'Maximum',
    testMethod: 'HPLC-DAD / UV Spectrophotometry',
    clauseRef: 'PFA / Codex GSFA CXS 192-1995',
    complianceNote: 'Avoid combining Sodium Benzoate with Ascorbic Acid in high heat/UV due to benzene formation risk.'
  },

  // MEAT, POULTRY & SEAFOOD
  {
    id: 'sfda-meat-salmonella',
    authority: 'SFDA / GSO',
    category: 'Meat, Poultry & Seafood',
    product: 'Chilled & Frozen Raw Poultry / Beef',
    parameter: 'Salmonella spp., Campylobacter & E. coli O157:H7',
    limitValue: 'Salmonella: Absent/25 g · TPC ≤ 10⁶ CFU/g (Chilled)',
    unit: 'CFU/g / Presence',
    limitType: 'Zero Tolerance',
    testMethod: 'ISO 6579-1 / ISO 4833-1',
    clauseRef: 'GSO 1016 / Halal Slaughter Standard GSO 993',
    complianceNote: 'Frozen meat core temp strictly ≤ -18°C; Chilled meat 0°C to +4°C; Total Volatile Basic Nitrogen (TVBN) ≤ 20 mg N/100g.'
  },
  {
    id: 'codex-fish-histamine',
    authority: 'Codex',
    category: 'Meat, Poultry & Seafood',
    product: 'Scombroid Fish (Tuna, Mackerel, Sardines)',
    parameter: 'Histamine',
    limitValue: '≤ 100 (Avg) · Max 200 (Decomposition)',
    unit: 'mg/kg (ppm)',
    limitType: 'Maximum',
    testMethod: 'AOAC 977.13 Fluorometric / HPLC',
    clauseRef: 'Codex CXS 36 / FDA Defect Action Level',
    complianceNote: 'Rapid icing immediately post-harvest (< 4°C) is critical because histamine is heat-stable during retorting.'
  },

  // BAKERY, FLOUR & SUGAR
  {
    id: 'psqca-flour-fortification',
    authority: 'PSQCA',
    category: 'Bakery, Flour & Sugar',
    product: 'Fortified Wheat Flour (Atta / Maida)',
    parameter: 'Moisture, Ash (Dry Basis) & Iron/Folic Acid Fortification',
    limitValue: 'Moisture ≤ 14.0% · Maida Ash ≤ 0.60% · Iron 15–30 ppm (NaFeEDTA)',
    unit: '% w/w / ppm',
    limitType: 'Range',
    testMethod: 'AACC 44-15A / 08-01 / AAS',
    clauseRef: 'PSQCA PS: 1791 & Provincial Flour Fortification Act',
    complianceNote: 'Potassium Bromate (E924) is strictly prohibited as a flour improver in Pakistan & GCC.'
  },
  {
    id: 'codex-sugar-icumsa',
    authority: 'Codex',
    category: 'Bakery, Flour & Sugar',
    product: 'White Plantation / Refined Beverage-Grade Sugar',
    parameter: 'ICUMSA Color, Polarisation & Sulfite (SO₂)',
    limitValue: 'Beverage Grade ≤ 45 IU · Standard ≤ 150 IU · Pol ≥ 99.7°Z · SO₂ ≤ 15 ppm',
    unit: 'ICUMSA / °Z / ppm',
    limitType: 'Range',
    testMethod: 'ICUMSA GS2/3-10 & Monier-Williams',
    clauseRef: 'Codex CXS 212-1999 Sugars',
    complianceNote: 'Beverage bottling plants require Low-ICUMSA (< 45 IU) floc-free sugar to prevent acid-beverage flocculation.'
  },

  // ============================================================================
  // ADDITIONAL DAIRY & MILK (INTERNATIONAL & REGIONAL)
  // ============================================================================
  {
    id: 'pfa-buffalo-milk-fat',
    authority: 'PFA',
    category: 'Dairy & Milk',
    product: 'Raw / Pasteurized Buffalo Milk',
    parameter: 'Milk Fat (Minimum) & SNF (Minimum)',
    limitValue: '≥ 5.0% Fat · ≥ 9.0% SNF',
    unit: '% w/w',
    limitType: 'Minimum',
    testMethod: 'ISO 2446 Gerber / Lactoscan',
    clauseRef: 'Punjab Pure Food Regulations 2018 (Dairy)',
    complianceNote: 'Must be free from added water, urea, formalin, detergents, starch, and vegetable fat adulterants.'
  },
  {
    id: 'codex-uht-milk-sterility',
    authority: 'Codex',
    category: 'Dairy & Milk',
    product: 'UHT Sterilized Milk & Flavored Milk',
    parameter: 'Commercial Sterility (30°C / 15 days & 55°C / 7 days)',
    limitValue: '< 10 CFU / 0.1 mL · pH drop ≤ 0.2 · Zero Swelling',
    unit: 'CFU / 0.1 mL',
    limitType: 'Maximum',
    testMethod: 'ISO 4833 / Incubation Stability Test',
    clauseRef: 'Codex CAC/RCP 57-2004 / GSO 984',
    complianceNote: 'Mandatory pre-incubation hold-and-release testing before shipping UHT milk cartons.'
  },
  {
    id: 'efsa-dairy-listeria-cheese',
    authority: 'EFSA / EU',
    category: 'Dairy & Milk',
    product: 'Ready-to-Eat Soft Cheese & Dairy Desserts',
    parameter: 'Listeria monocytogenes (End of Shelf-Life)',
    limitValue: 'Absent in 25 g (before leaving plant) · ≤ 100 CFU/g (if growth not supported)',
    unit: 'CFU/g / 25 g',
    limitType: 'Zero Tolerance',
    testMethod: 'ISO 11290-1 / ISO 11290-2',
    clauseRef: 'EU Commission Regulation (EC) No 2073/2005',
    complianceNote: 'Challenge study or pH ≤ 4.4 / aw ≤ 0.92 validation required to justify 100 CFU/g limit.'
  },
  {
    id: 'fda-milk-antibiotics-scc',
    authority: 'FDA / USA',
    category: 'Dairy & Milk',
    product: 'Grade "A" Raw Milk for Pasteurization',
    parameter: 'Somatic Cell Count (SCC), SPC & Beta-Lactam Drug Residues',
    limitValue: 'SCC ≤ 750,000/mL · SPC ≤ 100,000 CFU/mL · Antibiotics = Zero (Negative)',
    unit: 'cells/mL / CFU/mL',
    limitType: 'Maximum',
    testMethod: 'Charm / Delvotest / Fossomatic',
    clauseRef: 'US FDA Grade "A" Pasteurized Milk Ordinance (PMO)',
    complianceNote: 'Every bulk milk tanker must test negative for beta-lactam antibiotics before unloading.'
  },
  {
    id: 'codex-butter-moisture-fat',
    authority: 'Codex',
    category: 'Dairy & Milk',
    product: 'Salted & Unsalted Butter',
    parameter: 'Minimum Milk Fat, Max Moisture & Max Non-Fat Milk Solids',
    limitValue: 'Milk Fat ≥ 80.0% · Moisture ≤ 16.0% · MSNF ≤ 2.0%',
    unit: '% w/w',
    limitType: 'Range',
    testMethod: 'ISO 3727-1 / ISO 3727-2 / ISO 3727-3',
    clauseRef: 'Codex CXS 279-1971 Standard for Butter',
    complianceNote: 'Moisture droplets must be finely dispersed (< 10 µm) to prevent mold and Pseudomonas spoilage.'
  },
  {
    id: 'sfda-yogurt-acidity-cultures',
    authority: 'SFDA / GSO',
    category: 'Dairy & Milk',
    product: 'Plain & Flavored Set/Stirred Yogurt',
    parameter: 'Live Starter Cultures, Titratable Acidity & Coliforms',
    limitValue: 'Live LAB ≥ 10⁷ CFU/g · Acidity 0.6–1.5% Lactic · Coliforms ≤ 10 CFU/g',
    unit: 'CFU/g / %',
    limitType: 'Range',
    testMethod: 'ISO 7889 / ISO 4832',
    clauseRef: 'GSO 2033 / SFDA Fermented Milks Standard',
    complianceNote: 'Must contain viable Streptococcus thermophilus and Lactobacillus delbrueckii subsp. bulgaricus through expiry.'
  },

  // ============================================================================
  // ADDITIONAL EDIBLE OILS & GHEE
  // ============================================================================
  {
    id: 'efsa-oil-3mcpd-glycidyl',
    authority: 'EFSA / EU',
    category: 'Edible Oils & Ghee',
    product: 'Refined Vegetable Oils (Palm, Sunflower, Soy, Canola)',
    parameter: 'Glycidyl Fatty Acid Esters (GE) & 3-MCPD Esters',
    limitValue: 'GE ≤ 1,000 µg/kg (500 µg/kg baby food) · 3-MCPD ≤ 1,250–2,500 µg/kg',
    unit: 'µg/kg (ppb)',
    limitType: 'Maximum',
    testMethod: 'AOCS Cd 29a-13 / ISO 18363-1 (GC-MS)',
    clauseRef: 'EU Regulation (EU) 2023/915 Contaminants',
    complianceNote: 'Deodorization temperature must be optimized (< 240°C) with clay washing to control 3-MCPD and GE.'
  },
  {
    id: 'pfa-frying-oil-tpm',
    authority: 'PFA',
    category: 'Edible Oils & Ghee',
    product: 'Used Commercial Deep-Frying Oil (Restaurants & Snack Lines)',
    parameter: 'Total Polar Materials (TPM) & Free Fatty Acid',
    limitValue: 'TPM ≤ 24% – 25% (Discard Mandatory above 25%) · Smoke Point ≥ 170°C',
    unit: '% TPM',
    limitType: 'Maximum',
    testMethod: 'Testo 270 Oil Tester / AOCS Cd 20-91',
    clauseRef: 'PFA Frying Oil Safety Regulations / FSSAI RUCO',
    complianceNote: 'Immediate oil discard required once TPM exceeds 24–25% to prevent carcinogenic aldehydes and polymers.'
  },
  {
    id: 'codex-olive-oil-ev',
    authority: 'Codex',
    category: 'Edible Oils & Ghee',
    product: 'Extra Virgin Olive Oil (EVOO)',
    parameter: 'Free Fatty Acidity (as Oleic), Peroxide Value & UV K232/K270',
    limitValue: 'FFA ≤ 0.8% · Peroxide Value ≤ 20 meq O₂/kg · K270 ≤ 0.22',
    unit: '% / meq O₂/kg',
    limitType: 'Maximum',
    testMethod: 'ISO 660 / ISO 3960 / COI/T.20',
    clauseRef: 'Codex CXS 33-1981 / IOC Trade Standard',
    complianceNote: 'Cold-pressed mechanical extraction only; sensory panel must score zero defects and fruity median > 0.'
  },
  {
    id: 'efsa-trans-fat-limit',
    authority: 'EFSA / EU',
    category: 'Edible Oils & Ghee',
    product: 'Industrial Bakery Shortenings, Margarine & Processed Foods',
    parameter: 'Industrial Trans Fatty Acids (iTFA)',
    limitValue: '≤ 2.0 g per 100 g of Total Fat (WHO REPLACE Target)',
    unit: '% of total fat',
    limitType: 'Maximum',
    testMethod: 'ISO 12966-4 Capillary GC-FID',
    clauseRef: 'EU Reg (EU) 2019/649 & WHO Global Trans-Fat Elimination',
    complianceNote: 'Partially hydrogenated oils (PHOs) are phased out globally; use interesterification or palm fractions.'
  },

  // ============================================================================
  // ADDITIONAL DRINKING & BOTTLED WATER
  // ============================================================================
  {
    id: 'codex-water-bromate-ozone',
    authority: 'Codex',
    category: 'Drinking & Bottled Water',
    product: 'Ozonated Bottled Drinking Water',
    parameter: 'Bromate (BrO₃⁻) Disinfection By-Product',
    limitValue: '≤ 0.01 mg/L (10 µg/L / 10 ppb)',
    unit: 'mg/L (ppm)',
    limitType: 'Maximum',
    testMethod: 'ISO 15061 Ion Chromatography',
    clauseRef: 'WHO Guidelines / Codex CXS 227-2001 / FDA 21 CFR 165.110',
    complianceNote: 'Excessive ozone dosing in raw water containing bromide forms carcinogenic bromate — monitor O₃ residual (0.1–0.4 ppm).'
  },
  {
    id: 'psqca-water-micro-pseudomonas',
    authority: 'PSQCA',
    category: 'Drinking & Bottled Water',
    product: 'Packaged Drinking Water & Natural Mineral Water',
    parameter: 'E. coli, Coliforms, Pseudomonas aeruginosa & TPC (22°C)',
    limitValue: 'E. coli = 0/250 mL · Pseudomonas = 0/250 mL · TPC ≤ 100 CFU/mL',
    unit: 'CFU / 250 mL',
    limitType: 'Zero Tolerance',
    testMethod: 'ISO 9308-1 / ISO 16266 Membrane Filtration',
    clauseRef: 'PSQCA PS: 4639 / GSO 1025 Bottled Water',
    complianceNote: 'Pseudomonas aeruginosa indicates biofilm contamination in filler nozzles, RO membranes, or cap chutes.'
  },
  {
    id: 'fda-water-fluoride-nitrate',
    authority: 'FDA / USA',
    category: 'Drinking & Bottled Water',
    product: 'Bottled Drinking Water (Potable Process & Retail)',
    parameter: 'Nitrate (NO₃-N), Nitrite (NO₂-N), Arsenic & Lead',
    limitValue: 'Nitrate ≤ 10 mg/L · Nitrite ≤ 1.0 mg/L · Arsenic ≤ 0.010 mg/L · Lead ≤ 0.005 mg/L',
    unit: 'mg/L (ppm)',
    limitType: 'Maximum',
    testMethod: 'EPA 200.8 ICP-MS / EPA 300.0 IC',
    clauseRef: 'US FDA 21 CFR 165.110 Quality Standards',
    complianceNote: 'FDA bottled water lead limit (5 ppb) is stricter than municipal tap water action level (15 ppb).'
  },

  // ============================================================================
  // ADDITIONAL SPICES, GRAINS & MYCOTOXINS
  // ============================================================================
  {
    id: 'efsa-mycotoxin-ota-spices',
    authority: 'EFSA / EU',
    category: 'Spices, Grains & Mycotoxins',
    product: 'Red Chili, Black Pepper, Turmeric, Ginger & Nutmeg',
    parameter: 'Ochratoxin A (OTA) & Aflatoxin B1 / Total',
    limitValue: 'Chili/Paprika OTA ≤ 20 µg/kg · Other Spices OTA ≤ 15 µg/kg · AFB1 ≤ 5 µg/kg · Total Aflatoxin ≤ 10 µg/kg',
    unit: 'µg/kg (ppb)',
    limitType: 'Maximum',
    testMethod: 'ISO 16050 / EN 14132 HPLC-FLD',
    clauseRef: 'EU Regulation (EU) 2023/915',
    complianceNote: 'Primary cause of EU RASFF border rejections for South Asian spices — dry rapidly to moisture < 10% and aw < 0.65.'
  },
  {
    id: 'efsa-spices-sudan-dyes',
    authority: 'EFSA / EU',
    category: 'Spices, Grains & Mycotoxins',
    product: 'Red Chili Powder, Paprika, Curry & Sumac',
    parameter: 'Illegal Industrial Dyes (Sudan I, II, III, IV, Para Red, Rhodamine B)',
    limitValue: 'Zero Tolerance (Not Detected; LOD ≤ 0.5 mg/kg)',
    unit: 'mg/kg',
    limitType: 'Zero Tolerance',
    testMethod: 'LC-MS/MS Multi-Dye Screening',
    clauseRef: 'EU Commission Decision 2005/402/EC & PFA Spices Standard',
    complianceNote: 'Any trace detection of Sudan dyes triggers immediate global product recall and import ban.'
  },
  {
    id: 'efsa-spices-eto-ethylene-oxide',
    authority: 'EFSA / EU',
    category: 'Spices, Grains & Mycotoxins',
    product: 'Sesame Seeds, Spices, Herbs & Dried Vegetables',
    parameter: 'Ethylene Oxide (EtO) + 2-Chloroethanol (Sum)',
    limitValue: '≤ 0.05 – 0.1 mg/kg (EU MRL at LOQ)',
    unit: 'mg/kg (ppm)',
    limitType: 'Maximum',
    testMethod: 'GC-MS/MS (QuEChERS)',
    clauseRef: 'EU Regulation (EC) No 396/2005',
    complianceNote: 'EtO fumigation is banned for EU exports — use steam sterilization instead for microbial reduction.'
  },
  {
    id: 'codex-cereal-don-fumonisin',
    authority: 'Codex',
    category: 'Spices, Grains & Mycotoxins',
    product: 'Wheat Flour, Cornmeal & Breakfast Cereals',
    parameter: 'Deoxynivalenol (DON / Vomitoxin) & Fumonisins (B1+B2)',
    limitValue: 'Wheat Flour DON ≤ 1,000 µg/kg · Cornmeal Fumonisins ≤ 2,000 µg/kg',
    unit: 'µg/kg (ppb)',
    limitType: 'Maximum',
    testMethod: 'AOAC 986.17 / LC-MS/MS',
    clauseRef: 'Codex CXS 193-1995 General Standard for Contaminants',
    complianceNote: 'Stricter thresholds (DON ≤ 200 µg/kg) apply to cereal-based infant foods.'
  },
  {
    id: 'fda-peanuts-aflatoxin',
    authority: 'FDA / USA',
    category: 'Spices, Grains & Mycotoxins',
    product: 'Peanuts, Tree Nuts, Corn & Peanut Butter',
    parameter: 'Total Aflatoxins (B1 + B2 + G1 + G2)',
    limitValue: '≤ 20 µg/kg (ppb) US FDA · ≤ 4 µg/kg (ppb) EU Ready-to-Eat',
    unit: 'µg/kg (ppb)',
    limitType: 'Maximum',
    testMethod: 'AOAC 991.31 Immunoaffinity HPLC',
    clauseRef: 'US FDA CPG Sec. 555.400 / EU Reg 2023/915',
    complianceNote: 'Optical color sorting and roasting controls are mandatory CCPs for export nut processors.'
  },

  // ============================================================================
  // ADDITIONAL BEVERAGES & JUICES
  // ============================================================================
  {
    id: 'codex-apple-juice-patulin',
    authority: 'Codex',
    category: 'Beverages & Juices',
    product: 'Apple Juice, Apple Nectar & Apple Concentrates',
    parameter: 'Patulin Mycotoxin',
    limitValue: '≤ 50 µg/kg (Regular Juice) · ≤ 10 µg/kg (Infant/Baby Apple Juice)',
    unit: 'µg/kg (ppb)',
    limitType: 'Maximum',
    testMethod: 'AOAC 2000.02 HPLC-UV',
    clauseRef: 'Codex CXS 193-1995 / EU Reg 2023/915 / FDA Action Level',
    complianceNote: 'Sorting out bruised/rotten apples before crushing is the primary CCP to control Penicillium expansum patulin.'
  },
  {
    id: 'sfda-energy-drink-caffeine',
    authority: 'SFDA / GSO',
    category: 'Beverages & Juices',
    product: 'Caffeinated Energy Drinks & Cola Beverages',
    parameter: 'Caffeine, Taurine & Mandatory Health Warnings',
    limitValue: 'Energy Drinks ≤ 320 mg/L (32 mg/100 mL) · Cola ≤ 150–200 mg/L · Taurine ≤ 4,000 mg/L',
    unit: 'mg/L (ppm)',
    limitType: 'Maximum',
    testMethod: 'ISO 20481 HPLC-UV',
    clauseRef: 'GSO 1926 Energy Drinks / PFA Beverage Rules',
    complianceNote: 'Mandatory warning for children, pregnant women & caffeine-sensitive individuals; daily intake cap declaration required.'
  },
  {
    id: 'psqca-juice-brix-pulp',
    authority: 'PSQCA',
    category: 'Beverages & Juices',
    product: 'Fruit Nectars (Mango, Guava, Peach, Orange) vs Fruit Drinks',
    parameter: 'Minimum Fruit Juice/Pulp Content & Minimum °Brix',
    limitValue: 'Mango Nectar ≥ 25% Pulp (≥ 13.5°Bx) · Fruit Drink ≥ 8–10% Pulp · 100% Juice = No Added Sugar',
    unit: '% Pulp / °Brix',
    limitType: 'Minimum',
    testMethod: 'Refractometry (ISO 2173) & Formulation Audit',
    clauseRef: 'PSQCA PS: 527 / Codex CXS 247-2005 Fruit Juices & Nectars',
    complianceNote: 'Products below minimum nectar fruit content cannot be labeled "Juice" or "Nectar" — must be labeled "Fruit Drink".'
  },
  {
    id: 'fda-juice-haccp-5log',
    authority: 'FDA / USA',
    category: 'Beverages & Juices',
    product: 'Pasteurized Fruit & Vegetable Juices',
    parameter: 'Pathogen Log Reduction (E. coli O157:H7, Salmonella, Cryptosporidium)',
    limitValue: '≥ 5-Log (99.999%) Reduction of Pertinent Pathogen',
    unit: 'Log₁₀ CFU reduction',
    limitType: 'Minimum',
    testMethod: 'Thermal/HPP Process Validation Study',
    clauseRef: 'US FDA 21 CFR Part 120 Juice HACCP',
    complianceNote: 'Typically validated at 71.1°C for 6–15 seconds (pH ≤ 4.0) or equivalent HPP/UV treatment.'
  },

  // ============================================================================
  // ADDITIONAL MEAT, POULTRY & SEAFOOD
  // ============================================================================
  {
    id: 'fda-poultry-core-temp',
    authority: 'FDA / USA',
    category: 'Meat, Poultry & Seafood',
    product: 'Cooked Poultry, Nuggets, Sausages & Ground Meat',
    parameter: 'Minimum Internal Cooking Core Temperature & Cooling Curve',
    limitValue: 'Poultry ≥ 74°C (165°F) · Ground Beef ≥ 71°C (160°F) · Chill 54°C→27°C in ≤ 1.5h, 27°C→4°C in ≤ 5h',
    unit: '°C / Hours',
    limitType: 'Minimum',
    testMethod: 'Calibrated Core Probe Thermocouple',
    clauseRef: 'USDA FSIS Appendix A & B / FDA Food Code',
    complianceNote: 'Appendix B rapid cooling prevents Clostridium perfringens spore germination in cooked meats.'
  },
  {
    id: 'sfda-halal-slaughter-stunning',
    authority: 'SFDA / GSO',
    category: 'Meat, Poultry & Seafood',
    product: 'Halal Fresh, Chilled & Frozen Meat & Poultry',
    parameter: 'Halal Slaughter Compliance, Pork DNA & Blood Drainage',
    limitValue: 'Porcine DNA = 0% (Zero Tolerance) · Reversible Stunning Only (If Permitted) · Chilled ≤ 4°C / Frozen ≤ -18°C',
    unit: 'PCR / °C',
    limitType: 'Zero Tolerance',
    testMethod: 'Real-Time PCR Porcine Assay / Calibrated Probe',
    clauseRef: 'GSO 993 / OIC-SMIIC 1:2019 Halal Food Requirements',
    complianceNote: 'Mandatory Halal slaughterhouse certification and zero cross-contamination during cutting & transport.'
  },
  {
    id: 'efsa-seafood-tvbn',
    authority: 'EFSA / EU',
    category: 'Meat, Poultry & Seafood',
    product: 'Fresh & Frozen Marine Fish / Seafood',
    parameter: 'Total Volatile Basic Nitrogen (TVB-N) Freshness Limit',
    limitValue: '≤ 25 – 35 mg N / 100 g (species-dependent)',
    unit: 'mg N / 100 g',
    limitType: 'Maximum',
    testMethod: 'EU Ref Distillation Method (EC 2074/2005)',
    clauseRef: 'EU Regulation (EC) No 2074/2005 Fishery Products',
    complianceNote: 'TVB-N measures ammonia, TMA & DMA produced by bacterial spoilage; values > 35 mg/100g indicate unfit fish.'
  },

  // ============================================================================
  // ADDITIONAL BAKERY, FLOUR & SUGAR
  // ============================================================================
  {
    id: 'efsa-acrylamide-bakery-chips',
    authority: 'EFSA / EU',
    category: 'Bakery, Flour & Sugar',
    product: 'Potato Chips, Biscuits, Crackers, Bread & Roasted Coffee',
    parameter: 'Acrylamide Benchmark Level (Maillard Process Contaminant)',
    limitValue: 'Potato Chips ≤ 750 µg/kg · Biscuits ≤ 350 µg/kg · Wheat Bread ≤ 50 µg/kg · Roast Coffee ≤ 400 µg/kg',
    unit: 'µg/kg (ppb)',
    limitType: 'Maximum',
    testMethod: 'EN 16618 LC-MS/MS',
    clauseRef: 'EU Commission Regulation (EU) 2017/2158',
    complianceNote: 'Mitigate via asparaginase enzyme, low-reducing-sugar potatoes, and controlling baking/frying temperature < 175°C.'
  },
  {
    id: 'pfa-biscuits-acid-insoluble-ash',
    authority: 'PFA',
    category: 'Bakery, Flour & Sugar',
    product: 'Biscuits, Cookies, Rusks & Wafer Products',
    parameter: 'Moisture, Acid-Insoluble Ash (Sand/Silica) & Acidity of Extracted Fat',
    limitValue: 'Moisture ≤ 5.0% · Acid-Insoluble Ash ≤ 0.10% · Fat Acidity (as Oleic) ≤ 1.5%',
    unit: '% w/w',
    limitType: 'Maximum',
    testMethod: 'AOAC 925.10 / ISO 5985 / ISO 660',
    clauseRef: 'PFA Bakery Standards / PSQCA PS: 381',
    complianceNote: 'High extracted-fat acidity signals rancid shortening or poor packaging moisture/oxygen barrier.'
  },

  // ============================================================================
  // HEAVY METALS & CHEMICAL CONTAMINANTS
  // ============================================================================
  {
    id: 'codex-rice-inorganic-arsenic',
    authority: 'Codex',
    category: 'Heavy Metals & Contaminants',
    product: 'Polished White Rice, Brown Rice & Rice-Based Baby Cereal',
    parameter: 'Inorganic Arsenic (iAs)',
    limitValue: 'Polished Rice ≤ 0.20 mg/kg · Husked/Brown Rice ≤ 0.35 mg/kg · Infant Rice Cereal ≤ 0.10 mg/kg',
    unit: 'mg/kg (ppm)',
    limitType: 'Maximum',
    testMethod: 'HPLC-ICP-MS Speciation (EN 16802)',
    clauseRef: 'Codex CXS 193-1995 / EU Reg 2023/915 / FDA Action Level',
    complianceNote: 'Critical screening parameter for exported Basmati rice and infant cereal manufacturers.'
  },
  {
    id: 'efsa-heavy-metals-lead-general',
    authority: 'EFSA / EU',
    category: 'Heavy Metals & Contaminants',
    product: 'Milk, Fruit Juices, Vegetables, Spices & Salt',
    parameter: 'Lead (Pb) Maximum Levels',
    limitValue: 'Milk ≤ 0.02 mg/kg · Fruit Juices ≤ 0.03 mg/kg · Root Spices ≤ 1.5 mg/kg · Food-Grade Salt ≤ 1.0 mg/kg',
    unit: 'mg/kg (ppm)',
    limitType: 'Maximum',
    testMethod: 'ISO 17294-2 ICP-MS / AAS',
    clauseRef: 'EU Regulation (EU) 2023/915 & Codex CXS 193-1995',
    complianceNote: 'Turmeric must also be screened for illegal lead chromate adulteration used to brighten yellow color.'
  },
  {
    id: 'codex-heavy-metals-cadmium',
    authority: 'Codex',
    category: 'Heavy Metals & Contaminants',
    product: 'Dark Chocolate, Cocoa Powder, Wheat & Rice',
    parameter: 'Cadmium (Cd) Maximum Levels',
    limitValue: 'Dark Chocolate (≥50% cocoa) ≤ 0.80 mg/kg · Wheat ≤ 0.20 mg/kg · Polished Rice ≤ 0.40 mg/kg',
    unit: 'mg/kg (ppm)',
    limitType: 'Maximum',
    testMethod: 'ICP-MS (AOAC 2015.01)',
    clauseRef: 'Codex CXS 193-1995 / EU Reg 2023/915',
    complianceNote: 'Cocoa beans grown in volcanic South American soils frequently require cadmium lot-blending verification.'
  },
  {
    id: 'codex-fish-methylmercury',
    authority: 'Codex',
    category: 'Heavy Metals & Contaminants',
    product: 'Canned Tuna, Predatory Marine Fish & General Seafood',
    parameter: 'Methylmercury / Total Mercury (Hg)',
    limitValue: 'General Fish ≤ 0.50 mg/kg · Tuna ≤ 1.0–1.2 mg/kg · Swordfish/Shark ≤ 1.0–1.6 mg/kg',
    unit: 'mg/kg (ppm)',
    limitType: 'Maximum',
    testMethod: 'EPA 7473 Direct Mercury Analyzer / ICP-MS',
    clauseRef: 'Codex CXS 193-1995 / EU Reg 2023/915',
    complianceNote: 'Bioaccumulates in large predatory marine species; strictly tested on canned tuna lots.'
  },
  {
    id: 'codex-canned-food-tin',
    authority: 'Codex',
    category: 'Heavy Metals & Contaminants',
    product: 'Canned Foods & Canned Beverages (Tinplate Cans)',
    parameter: 'Inorganic Tin (Sn)',
    limitValue: 'Canned Foods ≤ 250 mg/kg (EU 200 mg/kg) · Canned Beverages ≤ 150 mg/kg (EU 100 mg/kg) · Baby Food ≤ 50 mg/kg',
    unit: 'mg/kg (ppm)',
    limitType: 'Maximum',
    testMethod: 'AOAC 985.16 AAS / ICP-MS',
    clauseRef: 'Codex CXS 193-1995 / EU Reg 2023/915',
    complianceNote: 'Internal BPA-free lacquer integrity and headspace oxygen control prevent acid corrosion of tinplate.'
  },

  // ============================================================================
  // HONEY, JAMS, SAUCES & TEA
  // ============================================================================
  {
    id: 'codex-honey-hmf-moisture',
    authority: 'Codex',
    category: 'Honey, Jams, Sauces & Tea',
    product: 'Pure Blossom & Floral Honey',
    parameter: 'Moisture, HMF (Hydroxymethylfurfural), Diastase & Sucrose',
    limitValue: 'Moisture ≤ 20.0% · HMF ≤ 40 mg/kg (80 mg/kg tropical) · Diastase ≥ 8 Schade · Sucrose ≤ 5%',
    unit: '% / mg/kg',
    limitType: 'Range',
    testMethod: 'IHC Harmonized Methods / HPLC / EA-IRMS (C4 Sugar)',
    clauseRef: 'Codex CXS 12-1981 Standard for Honey',
    complianceNote: 'Elevated HMF indicates overheating or old honey; EA-IRMS / NMR detects C4/C3 corn & rice syrup adulteration.'
  },
  {
    id: 'codex-ketchup-tss-lycopene',
    authority: 'Codex',
    category: 'Honey, Jams, Sauces & Tea',
    product: 'Tomato Ketchup & Tomato Sauces',
    parameter: 'Total Soluble Solids (TSS), Acidity, pH & Howard Mold Count',
    limitValue: 'TSS ≥ 25% (PFA/PSQCA) / ≥ 28% Premium · Acidity ≥ 1.0% Acetic · pH ≤ 4.0 · Howard Mold ≤ 40% fields',
    unit: '°Brix / % / pH',
    limitType: 'Range',
    testMethod: 'Refractometer / AOAC 965.41 Howard Mold Count',
    clauseRef: 'PSQCA PS: 511 / PFA Standards / USDA Grades',
    complianceNote: 'Maintaining pH < 3.9 and hot-fill ≥ 88°C ensures ambient shelf stability without high benzoate.'
  },
  {
    id: 'codex-jams-jellies-brix',
    authority: 'Codex',
    category: 'Honey, Jams, Sauces & Tea',
    product: 'Fruit Jams, Jellies & Marmalades',
    parameter: 'Soluble Solids (°Brix) & Minimum Fruit Content',
    limitValue: 'Soluble Solids ≥ 60% – 65°Brix (Regular) · Fruit Content ≥ 35% – 45% (Extra Jam ≥ 45%)',
    unit: '°Brix / %',
    limitType: 'Minimum',
    testMethod: 'ISO 2173 Refractometry',
    clauseRef: 'Codex CXS 296-2009 Jams, Jellies & Marmalades',
    complianceNote: '65°Brix combined with pH 3.0–3.3 achieves water activity aw ≤ 0.82 to prevent xerophilic mold growth.'
  },
  {
    id: 'fssai-mayonnaise-fat-ph',
    authority: 'FSSAI / ISO',
    category: 'Honey, Jams, Sauces & Tea',
    product: 'Real Mayonnaise & Eggless Mayo Dressing',
    parameter: 'Vegetable Oil Fat %, pH & Salmonella',
    limitValue: 'Real Mayo ≥ 65% Oil (US FDA) / ≥ 50–70% (EU/GSO) · pH ≤ 4.1 · Salmonella = Absent in 25 g',
    unit: '% / pH / 25 g',
    limitType: 'Range',
    testMethod: 'Acid Hydrolysis Fat / pH Meter / ISO 6579',
    clauseRef: 'FDA 21 CFR 169.140 / GSO 1335 / FSSAI',
    complianceNote: 'Pasteurized egg yolk and aqueous-phase acetic acid ≥ 0.7% prevent Salmonella survival at ambient temperature.'
  },
  {
    id: 'fssai-black-tea-iso3720',
    authority: 'FSSAI / ISO',
    category: 'Honey, Jams, Sauces & Tea',
    product: 'Black Tea (CTC & Orthodox Loose/Bagged)',
    parameter: 'Water Extract, Total Ash, Crude Fiber & Iron Filings',
    limitValue: 'Water Extract ≥ 32% · Total Ash 4–8% · Crude Fiber ≤ 16.5% · Iron Filings ≤ 150–250 mg/kg (PFA Zero Added)',
    unit: '% w/w / mg/kg',
    limitType: 'Range',
    testMethod: 'ISO 3720 / ISO 9768 / Magnet Test',
    clauseRef: 'ISO 3720:2011 Black Tea / PSQCA PS: 493 / FSSAI',
    complianceNote: 'Check for illegal artificial coal-tar dyes (Sunset Yellow/Carmoisine) and spent tea leaf adulteration.'
  },

  // ============================================================================
  // INFANT FORMULA & SPECIAL NUTRITION
  // ============================================================================
  {
    id: 'codex-infant-cronobacter',
    authority: 'Codex',
    category: 'Infant Formula & Special Nutrition',
    product: 'Powdered Infant Formula (0–6 Months)',
    parameter: 'Cronobacter sakazakii & Salmonella spp.',
    limitValue: 'Cronobacter = Absent in 30 × 10 g samples · Salmonella = Absent in 60 × 25 g samples',
    unit: 'Absent / sample',
    limitType: 'Zero Tolerance',
    testMethod: 'ISO 22964 (Cronobacter) / ISO 6579 (Salmonella)',
    clauseRef: 'Codex CXC 66-2008 / EU Reg 2073/2005',
    complianceNote: 'Strict dry-zoning hygiene (no wet cleaning in high-care spray-drying & canning zones) is mandatory.'
  },
  {
    id: 'codex-infant-melamine',
    authority: 'Codex',
    category: 'Infant Formula & Special Nutrition',
    product: 'Powdered Infant Formula & Milk Powders',
    parameter: 'Melamine (Nitrogen-Adulteration Contaminant)',
    limitValue: 'Powdered Infant Formula ≤ 1.0 mg/kg · Liquid Infant Formula ≤ 0.15 mg/kg · Other Foods ≤ 2.5 mg/kg',
    unit: 'mg/kg (ppm)',
    limitType: 'Maximum',
    testMethod: 'LC-MS/MS (FDA LIB 4421)',
    clauseRef: 'Codex CXS 193-1995 / EU Reg 2023/915',
    complianceNote: 'Melamine fraudulently inflates Kjeldahl protein readings — direct LC-MS/MS verification required on milk powder imports.'
  },

  // ============================================================================
  // PLANT HYGIENE, CIP & ENVIRONMENTAL SWAB LIMITS
  // ============================================================================
  {
    id: 'iso-hygiene-surface-swabs',
    authority: 'FSSAI / ISO',
    category: 'Plant Hygiene & Swab Limits',
    product: 'Food Contact Surfaces (Post-CIP / Pre-Op Ready-to-Eat Lines)',
    parameter: 'Total Viable Count (TVC), Enterobacteriaceae & Pathogens (Listeria/Salmonella)',
    limitValue: 'TVC ≤ 10 – 100 CFU/100 cm² · Entero < 10 CFU/100 cm² · Listeria/Salmonella = Absent / Swab',
    unit: 'CFU / 100 cm²',
    limitType: 'Maximum',
    testMethod: 'ISO 18593 Surface Sampling / ISO 4833',
    clauseRef: 'ISO 22000 / FSSC 22000 / BRCGS Environmental Monitoring',
    complianceNote: 'Zone 1 food-contact surfaces require immediate re-cleaning and root-cause CAPA if TVC exceeds action limit.'
  },
  {
    id: 'iso-hygiene-atp-bioluminescence',
    authority: 'FSSAI / ISO',
    category: 'Plant Hygiene & Swab Limits',
    product: 'Stainless Steel Tanks, Conveyors & Filling Nozzles (Pre-Op)',
    parameter: 'ATP Bioluminescence Swab Reading (Hygiena / 3M Benchmark)',
    limitValue: 'Pass ≤ 10–30 RLU · Caution 31–99 RLU · Fail ≥ 100 RLU (device-calibrated)',
    unit: 'RLU (Relative Light Units)',
    limitType: 'Maximum',
    testMethod: 'ATP Bioluminescence Luminometer (Pre-Op)',
    clauseRef: 'FSSC 22000 / BRCGS Issue 9 Clause 4.11',
    complianceNote: 'Real-time 15-second verification of organic residue removal before line startup; calibrate pass/fail thresholds per luminometer brand.'
  },
  {
    id: 'iso-hygiene-food-handler-hands',
    authority: 'FSSAI / ISO',
    category: 'Plant Hygiene & Swab Limits',
    product: 'Food Handler Washed Hands & Gloves (High-Care RTE Zones)',
    parameter: 'E. coli, Staphylococcus aureus & Coliforms',
    limitValue: 'E. coli = Absent / Hand · S. aureus = Absent / Hand · TVC ≤ 100 – 500 CFU / Hand',
    unit: 'CFU / Hand Swab',
    limitType: 'Zero Tolerance',
    testMethod: 'ISO 18593 Swab / Contact Plate',
    clauseRef: 'Codex CXC 1-1969 (GHP) / ISO TS 22002-1',
    complianceNote: 'Mandatory 20-second antimicrobial handwashing + 70% alcohol sanitizer before entering high-risk rooms.'
  },
  {
    id: 'iso-hygiene-air-plate-highcare',
    authority: 'FSSAI / ISO',
    category: 'Plant Hygiene & Swab Limits',
    product: 'Processing Hall Ambient Air (Settle Plate & Active Air Sampler)',
    parameter: 'Yeast, Mold & Total Aerobic Plate Count (High-Care vs Low-Risk)',
    limitValue: 'High-Care Settle Plate (15 min) ≤ 5–15 CFU · Yeast & Mold ≤ 5 CFU · Active Air ≤ 50–100 CFU/m³',
    unit: 'CFU / plate or m³',
    limitType: 'Maximum',
    testMethod: 'ISO 14698 Active Air Sampler / 90 mm Settle Plate',
    clauseRef: 'ISO TS 22002-1 / BRCGS High-Care Positive Pressure',
    complianceNote: 'Maintain positive air pressure (+5 to +15 Pa) and HEPA/F9 filtration in open-product filling rooms.'
  },
  {
    id: 'fda-cip-sanitizer-limits',
    authority: 'FDA / USA',
    category: 'Plant Hygiene & Swab Limits',
    product: 'No-Rinse Food Contact Chemical Sanitizers (CIP & Spray)',
    parameter: 'Free Chlorine (NaOCl), Peracetic Acid (PAA) & QAC Concentration',
    limitValue: 'Chlorine 50–200 ppm · PAA 80–200 ppm · QAC 150–400 ppm (Follow EPA Label)',
    unit: 'ppm (mg/L)',
    limitType: 'Range',
    testMethod: 'Titration Drop Kit / Calibrated Test Strips',
    clauseRef: 'US FDA 21 CFR 178.1010 Sanitizing Solutions',
    complianceNote: 'Exceeding 200 ppm chlorine or 400 ppm QAC without potable water rinse creates chemical food-safety hazard.'
  }
];

export interface QaQcTemplateDocument {
  id: string;
  code: string;
  title: string;
  category: 'HACCP & Food Safety' | 'Sanitation & PRP' | 'Supplier & Audit' | 'Regulatory Inspection';
  standardBadge: string;
  summary: string;
  revision: string;
  columns: string[];
  sampleRows: string[][];
  auditGuidance: string[];
}

export const QA_QC_TEMPLATES_VAULT: QaQcTemplateDocument[] = [
  {
    id: 'tpl-haccp-master',
    code: 'FSP-DOC-HACCP-01',
    title: 'HACCP Plan & CCP Monitoring Master Worksheet',
    category: 'HACCP & Food Safety',
    standardBadge: 'Codex CXC 1-1969 · ISO 22000',
    summary:
      'Complete 12-Step Codex HACCP critical control point monitoring table covering hazard description, validated critical limits, monitoring frequency, corrective action, and verification records.',
    revision: 'Rev 4.2',
    columns: [
      'Process Step & CCP #',
      'Significant Hazard (B/C/P)',
      'Validated Critical Limit',
      'Monitoring (What / How / Freq)',
      'Deviation Corrective Action',
      'Verification & Record'
    ],
    sampleRows: [
      [
        'CCP-1: Milk Pasteurization',
        'Biological: Coxiella burnetii, Salmonella, Listeria',
        '≥ 72.0°C for ≥ 15 sec (FDV Auto-Divert)',
        'Continuous HTST chart recorder + hourly log by Operator',
        'Auto-divert to balance tank; hold suspect batch; re-pasteurize & QA release',
        'Daily supervisor sign-off; annual RTD calibration'
      ],
      [
        'CCP-2: Metal Detection (Line End)',
        'Physical: Ferrous, Non-Ferrous, SS 316 fragments',
        'Fe ≤ 1.5 mm · Non-Fe ≤ 2.0 mm · SS ≤ 2.5 mm',
        'Test wands run start-up, hourly & post-downtime',
        'Stop belt, segregate since last good check, re-pass 100% product & investigate',
        'QA hourly verification & reject bin lock check'
      ],
      [
        'CCP-3: Acidification / Hot-Fill Sauce',
        'Biological: Clostridium botulinum / spoilage',
        'Equilibrium pH ≤ 4.20 & Core Fill ≥ 85°C',
        'pH meter calibrated 2-point before each batch + inline probe',
        'Hold batch; adjust acidity or reprocess; destroy if out-of-spec > 2 hrs',
        'Batch sheet review & incubator shelf-life sample'
      ]
    ],
    auditGuidance: [
      'Ensure calibration certificates of all CCP probes (thermometers, pH meters, metal detector wands) are traceable to ISO 17025 standards.',
      'Document actual numeric readings rather than simple "OK / Tick" marks on operator logs.',
      'Verify Decision Tree justification is archived for every OPRP vs CCP classification.'
    ]
  },
  {
    id: 'tpl-ssop-preop',
    code: 'FSP-DOC-SSOP-02',
    title: 'SSOP Sanitation, CIP & Pre-Operational Release Log',
    category: 'Sanitation & PRP',
    standardBadge: 'FSSC 22000 v7 · ISO/TS 22002-1',
    summary:
      'Line clearance and pre-operational hygiene checklist including CIP caustic/acid concentration, rinse pH neutrality, ATP bioluminescence RLU limits, and QA sign-off.',
    revision: 'Rev 3.1',
    columns: [
      'Equipment / Zone',
      'Cleaning Method / Chemical',
      'Validated Target Parameter',
      'Pre-Op ATP / Swab Result',
      'Corrective Action (If Fail)',
      'QA Release Initials'
    ],
    sampleRows: [
      [
        'Filling Hopper & Nozzles (Zone 1)',
        '5-Step CIP: Water → 1.5% NaOH (75°C) → Rinse → 1.0% HNO₃ → Sanitizer',
        'Conductivity 25–35 mS/cm · Final Rinse pH 6.8–7.4 · Temp ≥ 72°C',
        'ATP < 150 RLU · TPC Swab < 10 CFU/25cm²',
        'Re-clean & re-sanitize nozzle assembly; re-swab prior to production',
        'QA Officer Sign-off'
      ],
      [
        'Conveyor Belt & Slicer Blades (Zone 1)',
        'Manual COP: Alkaline Foam + QAC 200 ppm',
        'QAC strip test 200–400 ppm · Zero visible soil or allergen residue',
        'ATP < 150 RLU · Allergen lateral flow Negative',
        'Re-foam, scrub crevices, verify chemical concentration & re-inspect',
        'Sanitation Lead + QA'
      ],
      [
        'Drains & Floor Perimeter (Zone 3)',
        'Chlorinated Foam + 400 ppm NaOCl Flush',
        'No standing water; no backflow; drain baskets intact',
        'Visual clean & odor-free (Listeria env. swab monthly)',
        'Unblock drain, sanitize trap & reschedule swab within 24h',
        'Shift Supervisor'
      ]
    ],
    auditGuidance: [
      'Always verify sanitizer concentration using calibrated test strips or titration prior to application.',
      'Keep Food Contact Surface (Zone 1) ATP pass/fail limits clearly posted at QA stations.'
    ]
  },
  {
    id: 'tpl-allergen-matrix',
    code: 'FSP-DOC-ALL-03',
    title: 'Allergen Cross-Contact Control Matrix & Changeover SOP',
    category: 'HACCP & Food Safety',
    standardBadge: 'BRCGS Issue 9 · Codex CXC 1-1969',
    summary:
      'Production scheduling matrix and validated wet/dry changeover cleaning protocol covering Gluten, Milk, Soy, Peanuts, Tree Nuts, Eggs, Sesame, Fish, Crustaceans, and Sulfites.',
    revision: 'Rev 2.5',
    columns: [
      'SKU / Line Product',
      'Declared Allergens Present',
      'Shared Equipment Risk',
      'Changeover Cleaning Protocol',
      'Analytical Verification (ELISA/LFD)',
      'Label & Artwork Check'
    ],
    sampleRows: [
      [
        'SKU-101: Plain Milk Biscuit',
        'Wheat (Gluten), Milk, Soy Lecithin',
        'Shared Dough Mixer & Oven Band',
        'Run allergen-light to allergen-heavy; full wet wash before Peanut/Sesame clearance',
        'Gluten/Milk Lateral Flow (< 5 ppm LOD) on mixer paddles',
        '2-person artwork scan + allergen bold box check'
      ],
      [
        'SKU-204: Roasted Sesame & Nut Bar',
        'Sesame, Peanuts, Almonds (Tree Nuts)',
        'Enrobing Line & Cooling Tunnel',
        'Dedicated scoops/utensils color-coded Orange; full dismantle & washdown',
        'Peanut & Sesame ELISA protein swab Negative (< 2.5 ppm)',
        'Batch code + "Contains Sesame, Peanut, Almond" verified'
      ]
    ],
    auditGuidance: [
      'Color-code maintenance tools, scoops, and scrapers used on allergen-containing lines.',
      'Audit rework storage bins to guarantee allergen rework is only added back into identical allergen profiles.'
    ]
  },
  {
    id: 'tpl-fssc-audit',
    code: 'FSP-DOC-AUD-04',
    title: 'ISO 22000 & FSSC 22000 v7 Internal Audit Checklist',
    category: 'Supplier & Audit',
    standardBadge: 'FSSC 22000 v7 · ISO 19011',
    summary:
      'Clause-by-clause internal audit evidence checklist covering FSSC v7 Food Safety Culture, Quality Control (2.5.16), Food Fraud Mitigation, Food Defense (TACCP), and Traceability.',
    revision: 'v7.0 (2026)',
    columns: [
      'Standard Clause',
      'Audit Requirement & Question',
      'Objective Evidence Inspected',
      'Finding Status (C / Min / Maj)',
      'Root Cause & Corrective Action Plan',
      'Target Closure Date'
    ],
    sampleRows: [
      [
        'FSSC v7 Add. Req 2.5.8',
        'Food Safety & Quality Culture: Defined measurable objectives, communication & leadership review?',
        'Annual Culture Survey, toolbox talks, KPI board & Management Review minutes',
        'Conforming (C)',
        'Continue quarterly floor engagement KPIs',
        'Ongoing'
      ],
      [
        'FSSC v7 Add. Req 2.5.16',
        'Equipment Management: Hygienic design spec & documented commissioning sign-off for new/modified lines?',
        'EHEDG/3-A spec sheet + maintenance sanitary weld inspection log',
        'Minor NC (Demo)',
        'Establish formal Equipment Purchase Hygienic Spec SOP prior to procurement',
        '30 Days'
      ],
      [
        'ISO 22000 Cl. 8.3',
        'Traceability Mock Recall: Can 100% forward & backward mass balance reconcile within ≤ 4 hours?',
        'Mock recall drill report (Raw sugar lot → Finished cartons → Dispatch invoices)',
        'Conforming (C)',
        '99.4% reconciliation achieved in 2 hrs 15 mins',
        'Next Drill: Q3'
      ]
    ],
    auditGuidance: [
      'Auditors must remain independent of the department being audited per ISO 19011 impartiality rules.',
      'Verify closure of previous Minor/Major Non-Conformities via objective effectiveness evidence.'
    ]
  },
  {
    id: 'tpl-supplier-coa',
    code: 'FSP-DOC-SUP-05',
    title: 'Approved Supplier Register & Incoming COA Verification Log',
    category: 'Supplier & Audit',
    standardBadge: 'GFSI · ISO 22000 Cl. 7.1.6',
    summary:
      'Vendor risk rating matrix, annual GFSI certification tracking, and incoming lot Certificate of Analysis (COA) parameter verification sheet.',
    revision: 'Rev 3.0',
    columns: [
      'Approved Vendor & Material',
      'Risk Tier & Audit Status',
      'Cert Expiry (ISO/FSSC/Halal)',
      'Incoming Lot / Batch #',
      'COA Parameters Verified vs Limit',
      'Receiving Decision'
    ],
    sampleRows: [
      [
        'Al-Noor Dairy Ingredients — SMP',
        'High Risk · Annual On-Site Audited',
        'FSSC 22000 valid till Dec 2026 · Halal Cert Active',
        'LOT-SMP-2609A',
        'Moisture 3.4% (≤4.0%), Protein 34.5%, Antibiotics Negative, Aflatoxin M1 <0.05 ppb',
        'ACCEPTED & RELEASED'
      ],
      [
        'Crescent Packaging — Food Grade LDPE Film',
        'Medium Risk · Questionnaire + Migration COA',
        'BRCGS Packaging valid till Oct 2026',
        'LOT-PKG-8821',
        'Overall Migration < 10 mg/dm² (EU 10/2011), Seal Strength ≥ 2.5 N/15mm',
        'ACCEPTED'
      ]
    ],
    auditGuidance: [
      'Never release high-risk raw materials into production without verified Certificate of Analysis and intact tamper-evident truck seals.'
    ]
  },
  {
    id: 'tpl-pfa-inspection',
    code: 'FSP-DOC-REG-06',
    title: 'PFA / PSQCA / SFDA Regulatory Inspection Readiness Checklist',
    category: 'Regulatory Inspection',
    standardBadge: 'PFA 2018 · PSQCA · SFDA',
    summary:
      'Self-inspection readiness audit covering licensing, food handler medicals, water potability testing, labeling compliance, pest control, and finished product shelf-life retention samples.',
    revision: 'Rev 5.0',
    columns: [
      'Inspection Area',
      'Statutory Requirement',
      'Mandatory Evidence On-Site',
      'Status (Pass / Action)',
      'Responsible Person',
      'Remarks'
    ],
    sampleRows: [
      [
        'Licensing & Food Handler Medicals',
        'Valid Provincial Food Authority License + 6-Monthly Medical Fitness (Hep A/B, Typhoid, TB)',
        'Displayed License frame + individual worker medical cards & stool test reports',
        'Pass',
        'HR & QA Manager',
        'Renew every 6 months'
      ],
      [
        'Product Labeling & Nutritional Claims',
        'Batch #, Mfg/Exp Date, Net Weight, Ingredients, Allergens, Nutrition Facts & Halal Mark',
        'Approved packaging artwork proof + ink-jet batch coding legibility check',
        'Pass',
        'Regulatory Affairs',
        'Zero misleading "100% Organic/Cure" claims'
      ],
      [
        'Pest Control & Chemical Storage',
        'Locked chemical store with MSDS; bait map with non-toxic traps inside food areas',
        'Signed Pest Control Service Logs, ILT UV bulb log, chemical inventory',
        'Pass',
        'Sanitation Lead',
        'Zero domestic pesticides inside production floor'
      ]
    ],
    auditGuidance: [
      'Keep a dedicated "Regulatory Inspector Binder" at reception containing License, Water Lab Test (6-monthly), Pest Contract, Medicals, and Calibration Certificates.'
    ]
  }
];

export interface NutritionPresetItem {
  id: string;
  label: string;
  servingSizeLabel: string;
  servingWeightG: number;
  servingsPerContainer: string;
  calories: number;
  totalFatG: number;
  saturatedFatG: number;
  transFatG: number;
  cholesterolMg: number;
  sodiumMg: number;
  totalCarbG: number;
  dietaryFiberG: number;
  totalSugarsG: number;
  addedSugarsG: number;
  proteinG: number;
  vitaminDMcg: number;
  calciumMg: number;
  ironMg: number;
  potassiumMg: number;
}

export const NUTRITION_LABEL_PRESETS: NutritionPresetItem[] = [
  {
    id: 'mango-nectar',
    label: 'Mango Fruit Nectar (250 mL Carton)',
    servingSizeLabel: '1 Carton (250 mL)',
    servingWeightG: 250,
    servingsPerContainer: '1',
    calories: 120,
    totalFatG: 0,
    saturatedFatG: 0,
    transFatG: 0,
    cholesterolMg: 0,
    sodiumMg: 25,
    totalCarbG: 29,
    dietaryFiberG: 1,
    totalSugarsG: 26,
    addedSugarsG: 18,
    proteinG: 0.5,
    vitaminDMcg: 0,
    calciumMg: 15,
    ironMg: 0.4,
    potassiumMg: 140
  },
  {
    id: 'greek-yogurt',
    label: 'High-Protein Plain Yogurt (170 g Cup)',
    servingSizeLabel: '1 Cup (170 g)',
    servingWeightG: 170,
    servingsPerContainer: '1',
    calories: 110,
    totalFatG: 2.5,
    saturatedFatG: 1.5,
    transFatG: 0,
    cholesterolMg: 10,
    sodiumMg: 65,
    totalCarbG: 6,
    dietaryFiberG: 0,
    totalSugarsG: 5,
    addedSugarsG: 0,
    proteinG: 16,
    vitaminDMcg: 2,
    calciumMg: 210,
    ironMg: 0,
    potassiumMg: 240
  },
  {
    id: 'whole-wheat-biscuit',
    label: 'Whole Wheat Digestive Biscuit (30 g / 2 pcs)',
    servingSizeLabel: '2 Biscuits (30 g)',
    servingWeightG: 30,
    servingsPerContainer: '8',
    calories: 145,
    totalFatG: 6,
    saturatedFatG: 2.5,
    transFatG: 0,
    cholesterolMg: 0,
    sodiumMg: 135,
    totalCarbG: 20,
    dietaryFiberG: 2,
    totalSugarsG: 5,
    addedSugarsG: 4,
    proteinG: 2.5,
    vitaminDMcg: 0,
    calciumMg: 18,
    ironMg: 1.2,
    potassiumMg: 75
  },
  {
    id: 'tomato-ketchup',
    label: 'Tomato Ketchup (15 g / 1 Tbsp)',
    servingSizeLabel: '1 Tbsp (15 g)',
    servingWeightG: 15,
    servingsPerContainer: '30',
    calories: 20,
    totalFatG: 0,
    saturatedFatG: 0,
    transFatG: 0,
    cholesterolMg: 0,
    sodiumMg: 160,
    totalCarbG: 5,
    dietaryFiberG: 0,
    totalSugarsG: 4,
    addedSugarsG: 3,
    proteinG: 0,
    vitaminDMcg: 0,
    calciumMg: 4,
    ironMg: 0.1,
    potassiumMg: 48
  }
];
