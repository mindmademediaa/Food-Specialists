export type FoodAuthorityBody = 'PFA' | 'PSQCA' | 'SFDA / GSO' | 'Codex';

export type FoodCommodityCategory =
  | 'Dairy & Milk'
  | 'Edible Oils & Ghee'
  | 'Drinking & Bottled Water'
  | 'Spices, Grains & Mycotoxins'
  | 'Beverages & Juices'
  | 'Meat, Poultry & Seafood'
  | 'Bakery, Flour & Sugar';

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
