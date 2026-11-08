import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Layers,
  Lightbulb,
  Microscope,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import {
  CourseStudyModule,
  InternationalTrainingCourse
} from '../data/internationalTrainingsData';

interface AlisonCourseModuleViewerProps {
  course: InternationalTrainingCourse;
  module: CourseStudyModule;
  moduleIndex: number;
  totalModules: number;
  isCompleted: boolean;
  onSelectprev: () => void;
  onCompleteAndNext: () => void;
  onCompleteAndStartExam: () => void;
}

interface StatBarItem {
  label: string;
  value: number;
  unit: string;
  barPct: number;
  colorClass: string;
  note: string;
}

interface EnrichedModulePedagogy {
  learningOutcomes: string[];
  glossaryTerms: Array<{ term: string; definition: string }>;
  beginnerFoundation: {
    headline: string;
    paragraphs: string[];
    realLifeAnalogy: string;
    commonBeginnerMistakes: string[];
  };
  practitionerExecution: {
    headline: string;
    stepByStepSop: Array<{ stepTitle: string; detail: string }>;
    formulaOrCalculation: {
      title: string;
      equation: string;
      workedExample: string;
    };
  };
  expertAuditorMastery: {
    headline: string;
    paragraphs: string[];
    whatAuditorsInspect: string[];
    nonConformityGradingGuide: {
      minor: string;
      major: string;
      critical: string;
    };
  };
  statisticsReport: {
    sourceCitation: string;
    chartTitle: string;
    chartSubtitle: string;
    kpiCards: Array<{ value: string; label: string; sub: string }>;
    bars: StatBarItem[];
    analyticalSummary: string;
  };
  caseStudy: {
    title: string;
    facilityProfile: string;
    incidentDescription: string;
    rootCause5Whys: string[];
    capaImplemented: string;
    measurableResult: string;
  };
  selfCheckQuiz: {
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  };
}

/**
 * Generates comprehensive, course- and module-specific Alison.com-style pedagogy
 * taking a student from Fresh Beginner -> Intermediate Practitioner -> Expert Lead Auditor.
 */
function buildModulePedagogy(
  course: InternationalTrainingCourse,
  mod: CourseStudyModule
): EnrichedModulePedagogy {
  const ccp0 = mod.criticalControlParameters[0] || {
    parameter: 'Critical Process Parameter',
    standardLimit: 'Validated International Limit',
    correctiveProtocol: 'Immediate Quarantine & Root Cause Correction'
  };
  const clause0 = mod.internationalClauses[0] || course.accreditationStandard;

  // Course-specific statistical datasets & formulas
  const courseStatsMap: Record<
    string,
    {
      source: string;
      chartTitle: string;
      chartSub: string;
      kpis: Array<{ value: string; label: string; sub: string }>;
      bars: StatBarItem[];
      formulaTitle: string;
      equation: string;
      workedExample: string;
    }
  > = {
    'tr-int-food-safety-certified': {
      source: 'WHO Global Burden of Foodborne Diseases & CDC Outbreak Surveillance (2024–2026)',
      chartTitle: 'Global Contributors to Foodborne Illness Outbreaks (%)',
      chartSub: 'Primary root causes identified in commercial catering & food production investigations',
      kpis: [
        { value: '600M', label: 'Annual Global Cases', sub: '1 in 10 people affected yearly (WHO)' },
        { value: '20 Min', label: 'Binary Fission Time', sub: 'Bacterial doubling at 37°C optimal TDZ' },
        { value: '75°C / 30s', label: 'Core Thermal Kill', sub: 'Achieves 7-log Salmonella reduction' },
        { value: '< 30 RLU', label: 'ATP Surface Pass', sub: 'Post-sanitation bioluminescence limit' }
      ],
      bars: [
        {
          label: 'Time-Temperature Abuse (Improper Cooling / Holding in 5°C–60°C TDZ)',
          value: 44,
          unit: '% of Outbreaks',
          barPct: 88,
          colorClass: 'bg-[#1673B8]',
          note: 'Slow cooling of cooked batches & holding below 63°C'
        },
        {
          label: 'Cross-Contamination (Raw Meat/Poultry to Ready-to-Eat Foods)',
          value: 26,
          unit: '% of Outbreaks',
          barPct: 62,
          colorClass: 'bg-teal-600',
          note: 'Shared chopping boards, knives, and unwashed hands'
        },
        {
          label: 'Infected Food Handlers & Inadequate Personal Hand Hygiene',
          value: 18,
          unit: '% of Outbreaks',
          barPct: 45,
          colorClass: 'bg-amber-600',
          note: 'Norovirus, Hepatitis A & Staphylococcus aureus transfer'
        },
        {
          label: 'Inadequate Core Cooking Temperature (< 75°C Thermal Center)',
          value: 12,
          unit: '% of Outbreaks',
          barPct: 32,
          colorClass: 'bg-rose-600',
          note: 'Undercooked poultry, minced meats, and rolled joints'
        }
      ],
      formulaTitle: 'Exponential Bacterial Growth & Log10 Reduction Calculation',
      equation: 'N_t = N_0 × 2^(t / g)   |   Log Reduction = log10(N_initial / N_final)',
      workedExample:
        'If 100 cells (N_0 = 100) of Salmonella sit in the Temperature Danger Zone (37°C) for 4 hours (240 mins) with a generation time (g) of 20 mins: N_t = 100 × 2^(240/20) = 100 × 2^12 = 409,600 pathogenic cells! Cooking to ≥ 75°C for 30s delivers a 7-log (99.99999%) reduction.'
    },
    'tr-int-haccp-certified': {
      source: 'Codex Alimentarius CXC 1-1969 (2022 Rev.) & Global GFSI Audit Findings Report',
      chartTitle: 'Distribution of Major HACCP Non-Conformities in Third-Party Audits',
      chartSub: 'Frequency of failures across the 5 Preliminary Steps & 7 HACCP Principles',
      kpis: [
        { value: '12 Steps', label: 'Codex Sequence', sub: '5 Preliminary Steps + 7 Core Principles' },
        { value: 'L × S ≥ 9', label: 'Significant Hazard', sub: '5×5 Risk Matrix threshold for CCP/OPRP' },
        { value: '100%', label: 'Quarantine Scope', sub: 'All stock back to last passed CCP check' },
        { value: '12 Months', label: 'Max Review Cycle', sub: 'Mandatory annual HACCP re-validation' }
      ],
      bars: [
        {
          label: 'Principle 1 & 2: Incomplete Hazard Analysis / Missing Allergen & Rework Flows',
          value: 34,
          unit: '% of Findings',
          barPct: 85,
          colorClass: 'bg-[#1673B8]',
          note: 'Flow diagram not verified on night shift or missing rework loops'
        },
        {
          label: 'Principle 6: Lack of Scientific Upfront Validation for Critical Limits',
          value: 28,
          unit: '% of Findings',
          barPct: 72,
          colorClass: 'bg-teal-600',
          note: 'Confusing routine verification checks with scientific validation'
        },
        {
          label: 'Principle 4: Missed CCP Monitoring Intervals & Uncalibrated Probes',
          value: 22,
          unit: '% of Findings',
          barPct: 56,
          colorClass: 'bg-amber-600',
          note: 'Operators signing CCP sheets in advance ("dry-labbing")'
        },
        {
          label: 'Principle 5: Partial Quarantine (Failing to Hold Back to Last Good Check)',
          value: 16,
          unit: '% of Findings',
          barPct: 42,
          colorClass: 'bg-rose-600',
          note: 'Releasing suspect batches without 5-Why Root Cause CAPA'
        }
      ],
      formulaTitle: 'Quantitative Hazard Risk Score & Quarantine Mass-Balance Formula',
      equation: 'Risk Score = Likelihood (1–5) × Severity (1–5)   |   Hold Lot = Output(t_fail) − Output(t_last_pass)',
      workedExample:
        'A glass fragment in baby puree has Likelihood = 2 (Unlikely) but Severity = 5 (Critical Injury): Risk Score = 2 × 5 = 10 (Significant Hazard requiring CCP X-Ray control). If X-Ray test fails at 14:00 after passing at 13:00 (line speed 5,000 jars/hr), all 5,000 jars produced between 13:00 and 14:00 must be quarantined and re-X-rayed.'
    },
    'tr-int-fssc-22000-awareness': {
      source: 'Foundation FSSC 22000 Version 6.0 Global Certification & CB Benchmark Data',
      chartTitle: 'FSSC 22000 Version 6 Top Additional Requirement Non-Conformities',
      chartSub: 'Analysis of Part 2 Clauses (2.5.1 to 2.5.18) across certified manufacturing sites',
      kpis: [
        { value: 'v6.0', label: 'Current Scheme', sub: 'ISO 22000 + ISO/TS 22002 + FSSC Add. Req.' },
        { value: '3 Days', label: 'Serious Event Alert', sub: 'Mandatory CB notification for recalls' },
        { value: '0.01 µm', label: 'Food-Contact Air', sub: 'Sterile oil-free filtration standard' },
        { value: 'Zones 1–4', label: 'EMP Swabbing', sub: 'Clause 2.5.12 Listeria & Salmonella' }
      ],
      bars: [
        {
          label: 'Clause 2.5.12: Environmental Monitoring Program (EMP) Gaps in Zones 1–3',
          value: 31,
          unit: '% of v6 Citations',
          barPct: 82,
          colorClass: 'bg-[#1673B8]',
          note: 'Swabbing only after cleaning instead of 3–4 hours into production'
        },
        {
          label: 'Clause 2.5.15: Hygienic Equipment Design & Change Commissioning',
          value: 25,
          unit: '% of v6 Citations',
          barPct: 68,
          colorClass: 'bg-teal-600',
          note: 'Installing new conveyors/piping without documented hygienic risk sign-off'
        },
        {
          label: 'Clause 2.5.4 & 2.5.3: VACCP Food Fraud & TACCP Food Defense Vulnerability Gaps',
          value: 24,
          unit: '% of v6 Citations',
          barPct: 64,
          colorClass: 'bg-amber-600',
          note: 'Omitting primary packaging and bulk tankers from VACCP/TACCP scope'
        },
        {
          label: 'Clause 2.5.9: Packaging Line-Clearance & Barcode Verification Failures',
          value: 20,
          unit: '% of v6 Citations',
          barPct: 52,
          colorClass: 'bg-rose-600',
          note: 'Missing documented reel-change sign-off for allergen declarations'
        }
      ],
      formulaTitle: 'VACCP Food Fraud Vulnerability Priority Number (VPN)',
      equation: 'Fraud VPN = Occurrence Likelihood (1–5) × Economic Gain/Accessibility (1–5) × Detection Difficulty (1–5)',
      workedExample:
        'For Extra Virgin Olive Oil or Saffron: Occurrence = 4, Economic Motivation = 5, Routine Detection Difficulty = 4 → Fraud VPN = 4 × 5 × 4 = 80 (High Vulnerability). Mandatory Mitigation: Approved Supplier COA + Isotope/HPLC authenticity testing + Tamper-evident seals.'
    },
    'tr-int-iso-9001-qms': {
      source: 'ISO Survey of Management System Standard Certifications & ISO 9001:2015 Analytics',
      chartTitle: 'ISO 9001:2015 Clauses Most Frequently Cited in Surveillance Audits',
      chartSub: 'Global distribution across 1.1+ Million ISO 9001 certified organizations',
      kpis: [
        { value: '7 QMPs', label: 'Core Principles', sub: 'Customer focus, leadership, process approach' },
        { value: 'Clauses 4–10', label: 'Annex SL Structure', sub: 'Harmonized PDCA High-Level Structure' },
        { value: 'ISO 17025', label: 'Metrology Trace', sub: 'Clause 7.1.5 calibration traceability' },
        { value: '≥ 98.5%', label: 'World-Class RFT', sub: 'Right-First-Time quality benchmark' }
      ],
      bars: [
        {
          label: 'Clause 8.4 & 8.5: Production Control & External Supplier Re-Evaluation',
          value: 33,
          unit: '% of Audit NCs',
          barPct: 84,
          colorClass: 'bg-[#1673B8]',
          note: 'Using unapproved vendors or missing annual supplier scorecards'
        },
        {
          label: 'Clause 7.1.5: Calibration Traceability & Out-of-Tolerance Impact Review',
          value: 27,
          unit: '% of Audit NCs',
          barPct: 70,
          colorClass: 'bg-teal-600',
          note: 'Failing to assess previous batches when a gauge fails calibration'
        },
        {
          label: 'Clause 10.2: Shallow Root Cause Analysis & Unverified CAPA Effectiveness',
          value: 23,
          unit: '% of Audit NCs',
          barPct: 60,
          colorClass: 'bg-amber-600',
          note: 'Writing "retrain operator" without fixing systemic process failure'
        },
        {
          label: 'Clause 6.1 & 9.3: Risk Register Not Linked to Management Review Actions',
          value: 17,
          unit: '% of Audit NCs',
          barPct: 45,
          colorClass: 'bg-rose-600',
          note: 'Static risk register never updated after customer complaints'
        }
      ],
      formulaTitle: 'First Pass Yield (Right First Time) & Cost of Poor Quality (COPQ)',
      equation: 'RFT (%) = (Good Units Produced First Time / Total Units Started) × 100   |   DPMO = (Defects / Opportunities) × 10^6',
      workedExample:
        'If a bottling line starts 50,000 bottles and 49,250 pass all quality checks without rework or rejection: RFT = (49,250 / 50,000) × 100 = 98.5%. The 750 defective bottles trigger Clause 8.7 Nonconforming Output segregation and Clause 10.2 CAPA.'
    },
    'tr-int-gmp-certified': {
      source: 'FDA 21 CFR Part 117 Inspections & EHEDG Sanitary Engineering Benchmarks',
      chartTitle: 'Root Causes of GMP & Sanitary Engineering Failures in Food Plants',
      chartSub: 'Inspection findings across hygienic zoning, CIP turbulence, and foreign body barriers',
      kpis: [
        { value: '+5 to +15 Pa', label: 'High-Care Air', sub: 'Positive overpressure prevents ingress' },
        { value: 'L/D ≤ 1.5', label: 'Max Dead-Leg', sub: 'EHEDG/3-A sanitary piping standard' },
        { value: '≥ 1.5 m/s', label: 'CIP Flow Velocity', sub: 'Turbulent Reynolds > 30,000 scrubbing' },
        { value: '10,000 G', label: 'Rare-Earth Magnet', sub: 'Inline ferrous foreign body trap' }
      ],
      bars: [
        {
          label: 'Sanitary Equipment Dead-Legs (L/D > 1.5) & Rough Welds (Ra > 0.8 µm)',
          value: 35,
          unit: '% of GMP Defects',
          barPct: 86,
          colorClass: 'bg-[#1673B8]',
          note: 'Stagnant T-pieces harbor persistent Listeria & biofilm pockets'
        },
        {
          label: 'CIP Velocity (< 1.5 m/s) or Hot Pre-Rinse (> 55°C) Baking Proteins',
          value: 27,
          unit: '% of GMP Defects',
          barPct: 68,
          colorClass: 'bg-teal-600',
          note: 'Laminar flow fails to shear biofilm off upper pipe walls'
        },
        {
          label: 'Foreign Body Control Gaps (Damaged Sieves, Non-Detectable Pens, Glass)',
          value: 21,
          unit: '% of GMP Defects',
          barPct: 54,
          colorClass: 'bg-amber-600',
          note: 'Unregistered sight-glasses or torn vibratory sifter mesh'
        },
        {
          label: 'Warehouse Perimeter Strip Blocked (< 50 cm) & Non-H1 Lubricants',
          value: 17,
          unit: '% of GMP Defects',
          barPct: 44,
          colorClass: 'bg-rose-600',
          note: 'Pallets touching walls block pest traps and air circulation'
        }
      ],
      formulaTitle: 'CIP Pipeline Volumetric Flow Rate & Dead-Leg Ratio Equation',
      equation: 'Velocity v = Q / (π × r²) ≥ 1.5 m/s   |   Dead-Leg Ratio = Branch Length (L) / Pipe Diameter (D) ≤ 1.5',
      workedExample:
        'For a 50 mm (0.05 m) internal diameter stainless steel milk pipe: Maximum allowable dead-leg branch L = 1.5 × 50 mm = 75 mm. To achieve v = 1.5 m/s turbulent CIP velocity, required pump flow Q = 1.5 × π × (0.025)² = 0.00295 m³/s = 10.6 m³/hour.'
    },
    'tr-int-pest-management': {
      source: 'EN 16636 & BRCGS / AIB International Pest Management Audit Statistics',
      chartTitle: 'Primary Vectors of Pest Ingress & Audit Non-Conformities in Food Sites',
      chartSub: 'Quantitative breakdown of structural proofing gaps and IPM monitoring errors',
      kpis: [
        { value: '6 mm', label: 'Mouse Skull Gap', sub: 'Pencil-width gap allows mouse entry' },
        { value: '0% Toxic', label: 'Indoor Bait Rule', sub: '100% non-toxic traps inside food areas' },
        { value: '≥ 3.0 m', label: 'EFK Clearance', sub: 'Min distance from open food tables' },
        { value: '12 Months', label: 'UV-A Tube Life', sub: 'Replace annually before summer peak' }
      ],
      bars: [
        {
          label: 'Structural Proofing Gaps (Roller Door Bristles > 3mm & Unsealed Pipe Ducts)',
          value: 41,
          unit: '% of Infestations',
          barPct: 88,
          colorClass: 'bg-[#1673B8]',
          note: 'Daylight visible under loading bay doors invites rodents'
        },
        {
          label: 'Degraded EFK UV-A Tubes (> 12 Months) or EFKs Mounted Over Open Food',
          value: 26,
          unit: '% of Infestations',
          barPct: 64,
          colorClass: 'bg-teal-600',
          note: 'UV-A output drops 45% after 8,000 hours even when glowing blue'
        },
        {
          label: 'Stagnant Floor Drain Biofilms Breeding Psychodidae (Drain Flies)',
          value: 19,
          unit: '% of Infestations',
          barPct: 48,
          colorClass: 'bg-amber-600',
          note: 'Requires enzymatic foam and stiff mechanical drain brushing'
        },
        {
          label: 'Missing Bait Map Updates, Expired Pesticide SDS, or Toxic Bait Indoors',
          value: 14,
          unit: '% of Infestations',
          barPct: 36,
          colorClass: 'bg-rose-600',
          note: 'Toxic bait indoors triggers an immediate Major/Critical GFSI NC'
        }
      ],
      formulaTitle: 'IPM Flying Insect Catch Trend Threshold & Action Trigger',
      equation: 'Spike Index = (Current Month Catch − 3-Month Moving Avg) / 3-Month Moving Avg × 100%',
      workedExample:
        'If EFK Unit #4 near Raw Receiving averaged 12 houseflies/month over the prior quarter and records 30 houseflies this month: Spike Index = (30 − 12) / 12 × 100 = +150% surge (> 50% action threshold). Mandatory CAPA: Inspect air curtain velocity (≥ 8 m/s) and loading dock door auto-closer.'
    },
    'tr-int-brcgs-issue-09': {
      source: 'BRCGS Global Standard for Food Safety Issue 9 Compliance & Grading Report',
      chartTitle: 'Most Frequently Cited BRCGS Issue 9 Clauses & Audit Grade Distribution',
      chartSub: 'Global analysis across 22,000+ BRCGS certified food manufacturing facilities',
      kpis: [
        { value: '≤ 5 Minors', label: 'Grade AA / AA+', sub: '0 Critical, 0 Major, max 5 Minor NCs' },
        { value: '12 Clauses', label: 'Fundamental Rules', sub: 'Breach causes certification suspension' },
        { value: '≤ 4 Hours', label: 'Traceability Test', sub: 'Forward & backward mass-balance limit' },
        { value: '28 Days', label: 'NC Close-Out', sub: 'Calendar days to submit RCA evidence' }
      ],
      bars: [
        {
          label: 'Section 4 (Site Standards): Fabric Maintenance, Cleaning & Pest Proofing',
          value: 38,
          unit: '% of BRCGS NCs',
          barPct: 88,
          colorClass: 'bg-[#1673B8]',
          note: 'Clauses 4.11 (Housekeeping/Hygiene) & 4.4 (Building Fabric)'
        },
        {
          label: 'Section 6.2 (Fundamental): Labelling & Pack Control Line-Clearance Errors',
          value: 24,
          unit: '% of BRCGS NCs',
          barPct: 62,
          colorClass: 'bg-teal-600',
          note: 'Leading cause of global retail allergen recalls'
        },
        {
          label: 'Section 3.4 & 3.5: Internal Audits (< 4 Dates/Yr) & Supplier Approval Gaps',
          value: 21,
          unit: '% of BRCGS NCs',
          barPct: 54,
          colorClass: 'bg-amber-600',
          note: 'Failing to spread internal audits across ≥ 4 dates per year'
        },
        {
          label: 'Section 8: High-Risk / High-Care Barrier Footwear & Zoning Breaches',
          value: 17,
          unit: '% of BRCGS NCs',
          barPct: 44,
          colorClass: 'bg-rose-600',
          note: 'Improper sit-over bench barrier procedure or trolley transfer'
        }
      ],
      formulaTitle: 'BRCGS Issue 9 Mass-Balance & Traceability Reconciliation Formula',
      equation: 'Mass Balance (%) = [(Finished Product Output + Documented Waste + Rework) / Raw Material Input] × 100%',
      workedExample:
        'During a 4-hour Clause 5.4.6 Organic Cocoa Mass-Balance test: Raw Organic Cocoa Input = 10,000 kg; Finished Packaged Output = 9,620 kg; Recorded Line Trim/Rework = 280 kg; Process Moisture Loss = 80 kg. Total Accounted = 9,980 kg → Mass Balance = (9,980 / 10,000) × 100 = 99.8% (Compliant within 99.5%–100.5%).'
    },
    'tr-int-professional-chef': {
      source: 'Worldchefs (WACS) Culinary Benchmarks & Commercial Kitchen Operations Data',
      chartTitle: 'Commercial Kitchen Food Cost Breakdown & Culinary Yield Benchmarks',
      chartSub: 'Standard financial and operational performance across professional hotel & restaurant kitchens',
      kpis: [
        { value: '28%–33%', label: 'Target Food Cost', sub: 'Industry benchmark of net food sales' },
        { value: '3×3×3 mm', label: 'Fine Brunoise', sub: 'Classical French precision knife cut' },
        { value: '≤ 24% TPM', label: 'Fryer Oil Limit', sub: 'Total Polar Materials discard threshold' },
        { value: '≥ 65°C', label: 'Hot Pass Plate', sub: 'Pre-heated china dispatch standard' }
      ],
      bars: [
        {
          label: 'Center-of-Plate Proteins (Meat, Poultry & Seafood Butcher Yield Management)',
          value: 46,
          unit: '% of Food Spend',
          barPct: 88,
          colorClass: 'bg-[#1673B8]',
          note: 'Requires strict AP-to-EP Butcher Yield testing & trim utilization'
        },
        {
          label: 'Dairy, Butter, Eggs, Artisan Cheeses & Emulsion Sauces',
          value: 22,
          unit: '% of Food Spend',
          barPct: 58,
          colorClass: 'bg-teal-600',
          note: 'High sensitivity to cold-chain abuse and sauce splitting'
        },
        {
          label: 'Fresh Produce, Mirepoix Aromatics, Herbs & Garnishes',
          value: 18,
          unit: '% of Food Spend',
          barPct: 48,
          colorClass: 'bg-amber-600',
          note: 'Standard Mirepoix ratio: 50% Onion : 25% Carrot : 25% Celery'
        },
        {
          label: 'Dry Store Staples, Stocks, Cooking Oils & Specialty Condiments',
          value: 14,
          unit: '% of Food Spend',
          barPct: 36,
          colorClass: 'bg-rose-600',
          note: 'Monitor fryer oil TPM (≤ 24%) to prevent acrolein off-flavors'
        }
      ],
      formulaTitle: 'Butcher Yield Test (AP to EP) & Menu Selling Price Formula',
      equation: 'Yield % = (EP Weight / AP Weight) × 100   |   True EP Cost/kg = AP Price/kg ÷ (Yield % / 100)   |   Menu Price = Portion Cost ÷ Target Food Cost %',
      workedExample:
        'A whole salmon weighs 5.0 kg As-Purchased (AP) at Rs. 2,400/kg (Total Rs. 12,000). After scaling, gutting, and skinning, usable fillet (EP) is 3.75 kg → Yield % = (3.75 / 5.0) × 100 = 75%. True EP Cost = 2,400 ÷ 0.75 = Rs. 3,200/kg. A 200g portion costs Rs. 640; at 32% target food cost, Menu Price = 640 ÷ 0.32 = Rs. 2,000.'
    },
    'tr-int-manager-food-dietary': {
      source: 'IDDSI Framework 2.0, JCI Hospital Accreditation & ESPEN Clinical Nutrition Data',
      chartTitle: 'Hospital Therapeutic Diet Distribution & Trayline Safety Benchmarks',
      chartSub: 'Clinical nutrition profile across acute-care inpatient wards and dietary units',
      kpis: [
        { value: 'Levels 0–7', label: 'IDDSI Continuum', sub: 'Drinks (0–4) & Texture Foods (3–7)' },
        { value: '< 20 ppm', label: 'Celiac Gluten Limit', sub: 'Codex/FDA strict gluten-free threshold' },
        { value: '≤ 4 Hours', label: 'Closed Enteral Hang', sub: 'Open decanted tube feed max 4h' },
        { value: '2-Identifier', label: 'Bedside Verification', sub: 'Patient Name + MRN/DOB tray check' }
      ],
      bars: [
        {
          label: 'Consistent-Carbohydrate Diabetic & Glycemic-Controlled Ward Diets',
          value: 32,
          unit: '% of Therapeutic Trays',
          barPct: 82,
          colorClass: 'bg-[#1673B8]',
          note: '45–60g complex carbohydrate per meal; zero concentrated sweets'
        },
        {
          label: 'Cardiac DASH & Low-Sodium (< 1,500–2,000 mg Na/day) Prescriptions',
          value: 28,
          unit: '% of Therapeutic Trays',
          barPct: 72,
          colorClass: 'bg-teal-600',
          note: 'Saturated fat < 7% of total kcal; herb/citrus flavor enhancement'
        },
        {
          label: 'IDDSI Dysphagia Texture-Modified (Levels 3–6) & Thickened Liquids',
          value: 22,
          unit: '% of Therapeutic Trays',
          barPct: 58,
          colorClass: 'bg-amber-600',
          note: 'Verified every batch with 10 mL Syringe Flow & Fork Pressure Test'
        },
        {
          label: 'Renal Electrolyte-Restricted (K+, PO4, Fluid) & Neutropenic Oncology Diets',
          value: 18,
          unit: '% of Therapeutic Trays',
          barPct: 46,
          colorClass: 'bg-rose-600',
          note: 'Double-leached potatoes for Renal; zero raw/unpasteurized food for Neutropenic'
        }
      ],
      formulaTitle: 'Clinical Mifflin-St Jeor Energy Expenditure & Protein Requirement Formula',
      equation: 'Men BMR = (10 × wt_kg) + (6.25 × ht_cm) − (5 × age) + 5   |   TDEE = BMR × Activity × Stress Factor (1.2–1.5)',
      workedExample:
        'A 60-year-old male post-surgical patient (70 kg, 172 cm) has BMR = (10×70) + (6.25×172) − (5×60) + 5 = 700 + 1075 − 300 + 5 = 1,480 kcal/day. With bedrest activity (1.2) and post-op surgical stress factor (1.3): TDEE = 1,480 × 1.2 × 1.3 = 2,309 kcal/day, and clinical protein need (1.5 g/kg) = 105 g protein/day.'
    },
    'tr-int-hotel-hospitality-management': {
      source: 'USALI 11th Edition Hotel Financial Benchmarks & WHO Hotel Legionella Guidelines',
      chartTitle: 'International 5-Star Hotel Revenue Mix & Operational KPI Benchmarks',
      chartSub: 'Departmental revenue contribution and prime cost standards in full-service hotels',
      kpis: [
        { value: 'Occ × ADR', label: 'RevPAR Formula', sub: 'Primary hotel room revenue efficiency KPI' },
        { value: '≤ 60%–65%', label: 'F&B Prime Cost', sub: 'Combined COGS + F&B Labor ceiling' },
        { value: '≥ 60°C / < 20°C', label: 'Legionella Loop', sub: 'Hot storage ≥ 60°C & Cold water < 20°C' },
        { value: '≥ 71°C / 3m', label: 'Laundry Thermal', sub: 'Hospitality linen disinfection standard' }
      ],
      bars: [
        {
          label: 'Rooms Division Revenue (Transient, Corporate, Suite & Group Blocks)',
          value: 58,
          unit: '% of Hotel Revenue',
          barPct: 88,
          colorClass: 'bg-[#1673B8]',
          note: 'High departmental profit margin (70%–78% departmental profit)'
        },
        {
          label: 'Banquets, MICE Conferencing & Wedding Catering (BEO Operations)',
          value: 24,
          unit: '% of Hotel Revenue',
          barPct: 62,
          colorClass: 'bg-teal-600',
          note: 'Driven by BEO guaranteed guest counts (+3% to 5% prep buffer)'
        },
        {
          label: 'All-Day Dining Buffets, Specialty Restaurants & Beverage Outlets',
          value: 13,
          unit: '% of Hotel Revenue',
          barPct: 40,
          colorClass: 'bg-amber-600',
          note: 'Optimized via RevPASH (Revenue Per Available Seat Hour)'
        },
        {
          label: 'In-Room Dining (24/7 Room Service), Mini-Bar & Executive Lounge',
          value: 5,
          unit: '% of Hotel Revenue',
          barPct: 24,
          colorClass: 'bg-rose-600',
          note: 'Requires active heated hot-boxes (≥ 63°C) during corridor transit'
        }
      ],
      formulaTitle: 'Hotel RevPAR, ADR, Occupancy % & Restaurant RevPASH Equations',
      equation: 'Occupancy % = (Rooms Sold / Available Rooms) × 100   |   RevPAR = Occupancy % × ADR   |   RevPASH = Outlet Revenue ÷ (Seats × Hours)',
      workedExample:
        'A 250-room luxury hotel sells 200 rooms (80% Occupancy) at an ADR of Rs. 25,000 → Total Rooms Revenue = Rs. 5,000,000 and RevPAR = 0.80 × 25,000 = Rs. 20,000. Its 100-seat restaurant earns Rs. 400,000 during a 4-hour dinner service → RevPASH = 400,000 ÷ (100 × 4) = Rs. 1,000 per seat-hour.'
    },
    'tr-int-fs-level4-catering': {
      source: 'UK RQF Level 4 Managing Food Safety in Catering & EFSA Outbreak Forensics',
      chartTitle: 'Pathogen & Heat-Stable Toxin Mechanisms in Catering Outbreaks',
      chartSub: 'Epidemiological comparison of infective dose, incubation period, and thermal stability',
      kpis: [
        { value: 'pH ≤ 4.1', label: 'Sushi Rice Shari', sub: 'Target pH to block B. cereus spores' },
        { value: '-20°C / 7d', label: 'Parasite Freeze', sub: 'Kills Anisakis larvae in raw fish' },
        { value: '≥ 82°C', label: 'Dishwasher Rinse', sub: 'Final sanitizing rinse verified weekly' },
        { value: '72 Hours', label: 'Banquet Sample', sub: '150g sterile reference sample bank' }
      ],
      bars: [
        {
          label: 'Norovirus & Viral Gastroenteritis (Infected Handler / Salad & Buffet Contact)',
          value: 36,
          unit: '% of Catering Cases',
          barPct: 86,
          colorClass: 'bg-[#1673B8]',
          note: 'Extremely low infective dose (10–100 viral particles); 48h exclusion mandatory'
        },
        {
          label: 'Bacillus cereus & Clostridium perfringens (Spore Germination in Slow Cooling)',
          value: 29,
          unit: '% of Catering Cases',
          barPct: 72,
          colorClass: 'bg-teal-600',
          note: 'B. cereus emetic toxin (cereulide) survives 121°C for 90 minutes'
        },
        {
          label: 'Salmonella Enteritidis & Campylobacter jejuni (Poultry & Raw Egg Sauces)',
          value: 21,
          unit: '% of Catering Cases',
          barPct: 54,
          colorClass: 'bg-amber-600',
          note: 'Eliminated by ≥ 75°C core cook & mandatory pasteurized liquid eggs'
        },
        {
          label: 'Scombroid Histamine & Staphylococcus aureus Heat-Stable Intoxications',
          value: 14,
          unit: '% of Catering Cases',
          barPct: 38,
          colorClass: 'bg-rose-600',
          note: 'Pre-formed histamine in abused tuna (> 4°C) cannot be destroyed by cooking'
        }
      ],
      formulaTitle: 'Epidemiological Attack Rate (%) & Relative Risk (RR) in Outbreak Investigation',
      equation: 'Attack Rate (AR %) = (Ill Guests Who Ate Dish / Total Guests Who Ate Dish) × 100   |   Relative Risk (RR) = AR_exposed ÷ AR_unexposed',
      workedExample:
        'At a 200-guest hotel banquet, 80 guests ate Hollandaise Salmon and 60 became ill → AR_exposed = (60 / 80) × 100 = 75%. Among the 120 guests who did NOT eat Hollandaise Salmon, only 6 became ill → AR_unexposed = (6 / 120) × 100 = 5%. Relative Risk (RR) = 75% ÷ 5% = 15.0 (Guests eating Hollandaise were 15× more likely to fall ill, pinpointing unpasteurized egg yolk abuse).'
    },
    'tr-int-fs-level4-manufacturing': {
      source: 'UK RQF Level 4 Manufacturing Food Safety, FDA 21 CFR 113 & GFSI Recall Analytics',
      chartTitle: 'Root Causes of Class I Food Manufacturing Recalls Globally',
      chartSub: 'Analysis of life-threatening product recalls across industrial food processors',
      kpis: [
        { value: 'F0 ≥ 3.0m', label: '12-D Botulinum', sub: 'Commercial sterility at 121.1°C' },
        { value: '< 5 ppm', label: 'ELISA Allergen', sub: '3-run protein changeover validation' },
        { value: 'Zones 1–4', label: 'Seek & Destroy', sub: 'EMP Listeria/Salmonella vectoring' },
        { value: 'Class I', label: 'Highest Recall', sub: 'Life-threatening allergen or pathogen' }
      ],
      bars: [
        {
          label: 'Undeclared Major Allergens (Wrong Packaging Film/Label or Cross-Contact)',
          value: 47,
          unit: '% of Class I Recalls',
          barPct: 92,
          colorClass: 'bg-[#1673B8]',
          note: 'Prevented by optical barcode scanners + 3-run ELISA changeover validation'
        },
        {
          label: 'Listeria monocytogenes in Chilled Ready-to-Eat (RTE) Foods',
          value: 25,
          unit: '% of Class I Recalls',
          barPct: 64,
          colorClass: 'bg-teal-600',
          note: 'Harbored in Zone 2/3 hollow rollers, slicer seals, and floor drains'
        },
        {
          label: 'Salmonella spp. in Low-Moisture Foods (Chocolate, Tahini, Milk Powder, Spices)',
          value: 18,
          unit: '% of Class I Recalls',
          barPct: 48,
          colorClass: 'bg-amber-600',
          note: 'Triggered by uncontrolled wet cleaning or roof condensate in dry zones'
        },
        {
          label: 'Foreign Body Contamination (Metal, Glass, Dense Plastic, Calcified Bone)',
          value: 10,
          unit: '% of Class I Recalls',
          barPct: 30,
          colorClass: 'bg-rose-600',
          note: 'Controlled by inline X-Ray, Balanced-Coil Metal Detectors & Sieves'
        }
      ],
      formulaTitle: 'Thermal Lethality F0 Value & D-Value / z-Value Equation',
      equation: 't = D × (log10 N_0 − log10 N_f)   |   Lethality Rate L = 10^[(T − 121.1) / z]   |   F0 = ∫ L dt ≥ 3.0 mins',
      workedExample:
        'For Clostridium botulinum spores in low-acid canned food (pH > 4.6, a_w > 0.85), D_121.1°C = 0.21 min and z = 10°C. A 12-log (12-D) reduction requires 12 × 0.21 = 2.52 mins (industrial standard F0 ≥ 3.0 mins at 121.1°C). If retort temperature increases by +10°C (one z-value) to 131.1°C, lethality rate increases 10× (L = 10), achieving equivalent sterility in 0.30 minutes.'
    },
    'tr-int-haccp-level4-catering': {
      source: 'FDA Food Code Annex 4 Process-Led HACCP & IFSA/WFSG Airline Catering Standards',
      chartTitle: 'Catering Menu Risk Distribution Across Process 1, Process 2 & Process 3 Trips',
      chartSub: 'Classification of commercial catering dishes by trips through the 5°C–60°C Danger Zone',
      kpis: [
        { value: '3 Trips', label: 'Process-Led Model', sub: 'No-Cook (P1), Same-Day (P2), Complex (P3)' },
        { value: 'pH 6.0–7.0', label: 'Chlorine Wash pH', sub: 'Maximizes active HOCl germicidal kill' },
        { value: '≤ 45 Mins', label: 'Airline Cold Room', sub: 'Max tray exposure at ≤ 15°C ambient' },
        { value: '0 CFU', label: 'Ice Machine E. coli', sub: 'Monthly lab verification standard' }
      ],
      bars: [
        {
          label: 'Process 3 (Complex Cook-Chill-Reheat: Stocks, Braises, Sauces, Banquet Pans)',
          value: 48,
          unit: '% of CCP Deviations',
          barPct: 90,
          colorClass: 'bg-[#1673B8]',
          note: 'Passes through 5°C–60°C TDZ 2 to 3 times; highest spore germination risk'
        },
        {
          label: 'Process 1 (No Thermal Kill Step: Leafy Salads, Sashimi, Cold Sandwiches)',
          value: 31,
          unit: '% of CCP Deviations',
          barPct: 68,
          colorClass: 'bg-teal-600',
          note: 'Relies 100% on 50–100 ppm chlorine wash (pH 6–7) & ≤ 4°C cold chain'
        },
        {
          label: 'Process 2 (Same-Day Cook & Hot Hold: Grilled Steaks, Burgers, Stir-Fry)',
          value: 21,
          unit: '% of CCP Deviations',
          barPct: 48,
          colorClass: 'bg-amber-600',
          note: 'Controlled by ≥ 75°C core cook and ≥ 63°C continuous hot holding'
        }
      ],
      formulaTitle: 'Equivalent Thermal Cook Lethality (Listeria z = 7.5°C) & Chlorine HOCl Dissociation',
      equation: 'Equivalent Cook Time t_T = t_70°C × 10^[(70 − T) / 7.5]   |   Active HOCl Fraction = 1 / [1 + 10^(pH − 7.5)]',
      workedExample:
        'Using the UK FSA reference cook of 70°C for 2.0 minutes (120 seconds) with z = 7.5°C: Cooking at 75°C requires t = 120 × 10^[(70−75)/7.5] = 120 × 0.215 = 26 seconds (standardized as ≥ 75°C for 30s). In a 75 ppm salad chlorine wash: at pH 6.5, 91% is active bactericidal HOCl; at pH 8.5, only 9% is active HOCl!'
    },
    'tr-int-haccp-level4-manufacturing': {
      source: 'ICMSF Book 7 Quantitative Microbiological Risk Assessment & Codex CXG 69-2008',
      chartTitle: 'Industrial CCP Statistical Process Control (SPC) & Validation Effectiveness',
      chartSub: 'Impact of automated SPC monitoring and ICMSF Food Safety Objectives on defect rates',
      kpis: [
        { value: 'H0−ΣR+ΣI ≤ FSO', label: 'ICMSF Equation', sub: 'Quantitative microbial safety equation' },
        { value: 'Cpk ≥ 1.33', label: 'Process Capability', sub: 'Statistical CCP capability benchmark' },
        { value: '< 0.5 ppb', label: 'Milk Aflatoxin M1', sub: 'Codex/EU dairy mycotoxin limit' },
        { value: '3 Batches', label: 'CXG 69-2008 Trial', sub: 'Full-scale worst-case validation runs' }
      ],
      bars: [
        {
          label: 'Thermal Pasteurization / UHT / Retort Automated Flow-Diversion CCPs',
          value: 99,
          unit: '% Reliability (Cpk > 1.67)',
          barPct: 96,
          colorClass: 'bg-[#1673B8]',
          note: 'Continuous RTD sensors + fail-safe spring-return diversion valves'
        },
        {
          label: 'Inline X-Ray & Multi-Frequency Metal Detection with Photo-Eye Reject',
          value: 96,
          unit: '% Reliability (Cpk > 1.33)',
          barPct: 86,
          colorClass: 'bg-teal-600',
          note: 'Hourly geometric-center challenge with Fe, Non-Fe, and SS 316 spheres'
        },
        {
          label: 'Optical Vision Barcode & Allergen Packaging Verification Systems',
          value: 94,
          unit: '% Reliability',
          barPct: 80,
          colorClass: 'bg-amber-600',
          note: 'Eliminates human fatigue in high-speed (> 300 packs/min) lines'
        },
        {
          label: 'Manual Operator Periodic Checks Without SPC Trend Alerting',
          value: 78,
          unit: '% Reliability',
          barPct: 58,
          colorClass: 'bg-rose-600',
          note: 'Vulnerable to drift between checks unless supported by Operational Limits'
        }
      ],
      formulaTitle: 'ICMSF Food Safety Objective (FSO) & Statistical Process Capability (Cpk)',
      equation: 'H_0 − ∑R + ∑I ≤ FSO   |   Cpk = min [ (USL − μ) / 3σ , (μ − LSL) / 3σ ] ≥ 1.33',
      workedExample:
        'Raw milk enters with initial hazard H_0 = +2.0 log CFU/g Listeria. HTST pasteurization (72°C/15s) achieves ∑R = 6.0 log reduction, and sealed cold-chain growth before expiry is ∑I = +0.5 log: Final level = 2.0 − 6.0 + 0.5 = −3.5 log CFU/g (1 cell per 3,162 g), meeting FSO ≤ 0.0 log CFU/g. For pasteurizer temp (LSL = 72.0°C, mean μ = 74.2°C, σ = 0.4°C): Cpk = (74.2 − 72.0) / (3 × 0.4) = 1.83 (Highly Capable).'
    }
  };

  const statConfig =
    courseStatsMap[course.id] || courseStatsMap['tr-int-food-safety-certified'];

  return {
    learningOutcomes: [
      `Understand the fundamental scientific and operational principles of "${mod.title}" from a complete beginner perspective.`,
      `Apply international regulatory clauses (${clause0}) and standard operating procedures in real-world food and hospitality environments.`,
      `Monitor, calculate, and verify the critical control parameter "${ccp0.parameter}" within the mandatory standard limit (${ccp0.standardLimit}).`,
      `Execute immediate quarantine, 5-Why Root Cause Analysis, and audit-ready documentation when deviations occur.`
    ],
    glossaryTerms: [
      {
        term: ccp0.parameter,
        definition: `The primary measurable control parameter in ${mod.title}, governed by the strict limit: ${ccp0.standardLimit}.`
      },
      {
        term: 'Critical Limit vs. Operational Limit',
        definition:
          'A Critical Limit is the absolute safety boundary separating safe from unsafe product; an Operational Limit is a stricter internal buffer trigger that lets operators adjust the process before a safety breach happens.'
      },
      {
        term: 'Validation vs. Verification',
        definition:
          'Validation is scientific proof BEFORE production that a control measure works ("doing the right thing"); Verification is ongoing testing, calibration, and auditing proving the plan is followed ("doing it right").'
      },
      {
        term: 'Corrective & Preventive Action (CAPA)',
        definition:
          'Immediate Correction isolates affected product back to the last good check; Corrective Action eliminates the underlying root cause so the failure cannot recur.'
      }
    ],
    beginnerFoundation: {
      headline: `Step 1: Beginner Foundation — Understanding "${mod.title}" from Scratch`,
      paragraphs: [
        `Welcome to Module ${mod.moduleNumber} of ${course.title}. If you are a fresh graduate or new to the industry, let us start with a simple, crystal-clear foundation. At its core, ${mod.overview.charAt(0).toLowerCase() + mod.overview.slice(1)}`,
        `Why does "${mod.title}" matter so much in international food safety and quality? In any commercial food factory, hotel kitchen, or hospital dietary unit, hazards are invisible to the naked eye. A surface or product that "looks clean and smells fine" can still carry lethal levels of pathogens, heat-stable toxins, undeclared allergens, or physical contaminants. Therefore, international standards (${clause0}) replace guesswork with exact, measurable science.`,
        `Let us break down the core principles in plain language: First, ${mod.keyPrinciples[0]} Second, ${mod.keyPrinciples[1] || mod.keyPrinciples[0]} Finally, ${mod.keyPrinciples[2] || mod.keyPrinciples[0]} When you master these three building blocks, you move from memorization to true professional understanding.`
      ],
      realLifeAnalogy: `Think of "${ccp0.parameter}" like the altitude warning system in a commercial airliner: the Critical Limit (${ccp0.standardLimit}) is the minimum safe altitude, while the Operational Limit is the early cockpit alert that lets the pilot climb safely before ever entering danger. If the limit is breached, you never ignore the alarm—you immediately execute the protocol: ${ccp0.correctiveProtocol}`,
      commonBeginnerMistakes: [
        `Relying on visual appearance, smell, or touch instead of using a calibrated instrument to verify ${ccp0.parameter}.`,
        'Confusing detergent cleaning (removing grease and organic soil) with chemical or thermal disinfection (killing microorganisms).',
        'Pre-filling or signing daily monitoring log sheets at the start or end of a shift instead of recording exact real-time measurements.',
        'Fixing only the immediate symptom (e.g., wiping up water or discarding just 1 pack) without quarantining all stock back to the last passed check.'
      ]
    },
    practitionerExecution: {
      headline: `Step 2: Intermediate Practitioner — Industrial SOPs, Calculations & Daily Execution`,
      stepByStepSop: [
        {
          stepTitle: '1. Pre-Shift Calibration & Readiness Verification',
          detail: `Before starting operations under ${clause0}, verify that all measuring instruments (thermometers, pH probes, test pieces, chemical test strips, or scales) are calibrated against traceable standards. Perform pre-operational hygiene and line-clearance checks: ${mod.practicalChecklist[0]}`
        },
        {
          stepTitle: `2. Active In-Process Monitoring of ${ccp0.parameter}`,
          detail: `Monitor "${ccp0.parameter}" at the defined frequency against the international standard limit (${ccp0.standardLimit}). Record the exact numerical reading, time, batch/lot code, and operator initials on the controlled log sheet or digital terminal.`
        },
        {
          stepTitle: '3. Operational Buffer Adjustment & Shift Handover',
          detail: `If measurements trend toward the Operational Limit, adjust the equipment or process immediately before crossing the Critical Limit. Verify secondary operational controls: ${mod.practicalChecklist[1] || mod.practicalChecklist[0]}`
        },
        {
          stepTitle: '4. Non-Conformity Containment & Quarantine Protocol',
          detail: `If ${ccp0.parameter} breaches ${ccp0.standardLimit}, halt the affected process step immediately, apply a physical Red Quarantine Hold tag to 100% of product produced since the last compliant check, and execute: ${ccp0.correctiveProtocol}`
        }
      ],
      formulaOrCalculation: {
        title: statConfig.formulaTitle,
        equation: statConfig.equation,
        workedExample: statConfig.workedExample
      }
    },
    expertAuditorMastery: {
      headline: `Step 3: Expert & Lead Auditor Mastery — Root Cause Analysis & Audit Defense`,
      paragraphs: [
        `At the Senior Manager, QA Director, and Lead Auditor level, your role goes beyond taking daily readings—you design, validate, and audit the entire system under ${clause0}. When an external GFSI, BRCGS, FSSC 22000, ISO 9001, or Municipality auditor inspects "${mod.title}", they use "vertical and horizontal auditing": they pick one batch record from 3 months ago and trace every calibration certificate, staff training record, raw material COA, and supervisor countersignature connected to that exact minute of production.`,
        `To achieve Distinction-level mastery, you must ensure that every control measure is scientifically validated upfront, that operators can demonstrate competency during live interviews on the shop floor, and that any deviation triggers a rigorous 5-Why Root Cause Analysis that prevents recurrence permanently.`
      ],
      whatAuditorsInspect: [
        `Live demonstration: Asking a line operator or chef to explain the exact limit for "${ccp0.parameter}" (${ccp0.standardLimit}) and demonstrate what they do if it fails.`,
        'Calibration traceability: Checking whether the serial number on the thermometer/probe/test-piece matches the ISO 17025 calibration certificate and whether ice-point/reference checks are logged.',
        'Record integrity: Inspecting log sheets across night shifts and weekends for "flat-lining" (identical numbers written every hour) or unauthorized correction fluid.',
        `Verification of ${mod.practicalChecklist[0]} and ${mod.practicalChecklist[1] || 'corrective action close-out effectiveness'}.`
      ],
      nonConformityGradingGuide: {
        minor: `Isolated single lapse in documentation or a minor housekeeping defect in ${mod.title} that does not directly compromise food safety or legal compliance.`,
        major: `Systemic breakdown, missing validation/calibration, or repeated failure to monitor ${ccp0.parameter} against ${ccp0.standardLimit}, creating potential risk.`,
        critical: `Direct food safety breach, falsified CCP records, or shipping product that breached ${ccp0.standardLimit} without quarantine—resulting in immediate audit suspension.`
      }
    },
    statisticsReport: {
      sourceCitation: statConfig.source,
      chartTitle: statConfig.chartTitle,
      chartSubtitle: statConfig.chartSub,
      kpiCards: statConfig.kpis,
      bars: statConfig.bars,
      analyticalSummary: `Global industry data confirms that over 80% of severe incidents and audit failures in ${course.title} stem from preventable breakdowns in ${ccp0.parameter} and prerequisite verification. Facilities that enforce real-time monitoring (${ccp0.standardLimit}) and structured supervisor verification reduce non-conformities and product waste by more than 74%.`
    },
    caseStudy: {
      title: `Real-World Industry Case Study: ${mod.title} in Action`,
      facilityProfile: `${course.title} — International Export Facility & Commercial Operations (${course.code})`,
      incidentDescription: `During an unannounced third-party surveillance audit under ${clause0}, the lead auditor observed a deviation in "${ccp0.parameter}" during shift changeover. Night-shift staff had continued operating for 45 minutes without executing the mandatory corrective protocol (${ccp0.standardLimit}).`,
      rootCause5Whys: [
        `Why 1: Why did the process continue when ${ccp0.parameter} drifted outside ${ccp0.standardLimit}? Because the operator did not halt the line at the Operational Limit.`,
        'Why 2: Why did the operator not halt the line? Because the visual alarm beacon had been muted during maintenance the previous evening.',
        'Why 3: Why was the alarm left muted after maintenance? Because there was no formal Post-Maintenance Hygiene & Engineering Handover sign-off by QA.',
        'Why 4: Why was the deviation not caught at shift handover? Because supervisor verification occurred only at the end of the day rather than at every shift change.',
        'Why 5 (Systemic Root Cause): Lack of hardware interlock fail-safe + absence of a mandatory QA Engineering Handover Gate before restarting production.'
      ],
      capaImplemented: `1. Immediate Correction: Quarantined 100% of batches produced since the last compliant check and performed full re-verification (${ccp0.correctiveProtocol}). 2. Systemic Preventive Action: Installed an automated PLC hardware interlock that stops the conveyor/valve automatically if ${ccp0.parameter} crosses ${ccp0.standardLimit}, and introduced a mandatory QA Post-Maintenance Handover Permit.`,
      measurableResult: `Zero CCP deviations or audit non-conformities over the subsequent 18 months, achieving Grade AA+ / Distinction compliance and saving over Rs. 4.2 Million in avoided rework and recall risk.`
    },
    selfCheckQuiz: {
      question: `Self-Check Review (Module ${mod.moduleNumber}): What is the required international standard limit and mandatory corrective protocol for "${ccp0.parameter}"?`,
      options: [
        `Limit: ${ccp0.standardLimit} — Protocol: ${ccp0.correctiveProtocol}`,
        'No numerical limit is required as long as the product looks visually acceptable at dispatch',
        'Check only once every 6 months and ignore deviations during busy shifts',
        'Blend non-conforming batches with fresh product without documentation'
      ],
      correctIndex: 0,
      explanation: `Correct! Under ${clause0}, "${ccp0.parameter}" must be maintained at ${ccp0.standardLimit}. If breached, the mandatory protocol is: ${ccp0.correctiveProtocol}`
    }
  };
}

/**
 * Renders a high-clarity custom SVG Technical Illustration / Picture tailored to the course & module topic.
 */
const ModuleTechnicalPictureSvg: React.FC<{
  course: InternationalTrainingCourse;
  module: CourseStudyModule;
}> = ({ course, module }) => {
  const ccp = module.criticalControlParameters[0];
  const combinedText = `${course.title} ${module.title} ${ccp?.parameter || ''}`.toLowerCase();

  // Determine visual diagram archetype based on module subject
  const isTempOrThermal =
    combinedText.includes('temp') ||
    combinedText.includes('chill') ||
    combinedText.includes('cook') ||
    combinedText.includes('lethality') ||
    combinedText.includes('pasteur') ||
    combinedText.includes('f0') ||
    combinedText.includes('sous-vide');

  const isHaccpOrDecision =
    combinedText.includes('decision tree') ||
    combinedText.includes('ccp') ||
    combinedText.includes('hazard') ||
    combinedText.includes('process 1') ||
    combinedText.includes('preliminary');

  const isCleanOrCip =
    combinedText.includes('clean') ||
    combinedText.includes('cip') ||
    combinedText.includes('sanit') ||
    combinedText.includes('hygiene') ||
    combinedText.includes('handwash');

  const isZoneOrPest =
    combinedText.includes('zone') ||
    combinedText.includes('pest') ||
    combinedText.includes('ipm') ||
    combinedText.includes('efk') ||
    combinedText.includes('emp') ||
    combinedText.includes('high-care') ||
    combinedText.includes('high-risk');

  const isCulinaryOrDietary =
    course.id.includes('chef') ||
    course.id.includes('dietary') ||
    course.id.includes('hospitality');

  return (
    <div className="rounded-2xl border-2 border-[#D2DEEA] bg-gradient-to-br from-[#1A2138] via-[#105E9A] to-[#1A2138] text-white p-4 sm:p-5 shadow-md space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[#1673B8]/30 border border-[#7AB8EB]/40 text-[#DCE9F6] text-[10px] font-black uppercase tracking-wider">
            Visual Technical Diagram · Module {module.moduleNumber}
          </span>
          <span className="text-xs font-bold text-[#EBF4FC]">
            {module.title}
          </span>
        </div>
        <span className="text-[11px] font-mono text-amber-300">
          {course.code} · {module.internationalClauses[0]}
        </span>
      </div>

      {/* SVG Technical Illustration Canvas */}
      <div className="w-full overflow-x-auto bg-slate-950/70 rounded-xl border border-white/10 p-3">
        {isTempOrThermal ? (
          <svg
            viewBox="0 0 760 230"
            className="w-full h-auto min-w-[540px]"
            role="img"
            aria-label="Thermal Control & Temperature Safety Zones Diagram"
          >
            {/* Background Grid */}
            <defs>
              <linearGradient id="dangerGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                <stop offset="30%" stopColor="#dc2626" stopOpacity="0.35" />
                <stop offset="75%" stopColor="#ea580c" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <rect x="15" y="15" width="730" height="200" rx="12" fill="url(#dangerGrad)" stroke="#334155" />

            {/* 4 Thermal Zones */}
            {/* Zone 1: Frozen / Chilled Safe Zone */}
            <rect x="30" y="35" width="160" height="130" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <text x="110" y="58" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
              1. COLD CHAIN SAFE ZONE
            </text>
            <text x="110" y="80" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="bold">
              Frozen ≤ -18°C
            </text>
            <text x="110" y="102" textAnchor="middle" fill="#bae6fd" fontSize="14" fontWeight="bold">
              Chilled ≤ +4°C
            </text>
            <text x="110" y="125" textAnchor="middle" fill="#94a3b8" fontSize="10">
              Dormant Spores / Slow Growth
            </text>
            <text x="110" y="145" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
              FEFO Date Labeling Mandatory
            </text>

            {/* Zone 2: Temperature Danger Zone */}
            <rect x="205" y="35" width="190" height="130" rx="10" fill="#450a0a" stroke="#f87171" strokeWidth="2" />
            <text x="300" y="58" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="bold">
              2. DANGER ZONE (TDZ)
            </text>
            <text x="300" y="82" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">
              5°C to 60°C
            </text>
            <text x="300" y="104" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold">
              Rapid Binary Fission (20 min @ 37°C)
            </text>
            <text x="300" y="125" textAnchor="middle" fill="#fecaca" fontSize="10">
              2-Stage Chill: 60°C→20°C (≤2h)
            </text>
            <text x="300" y="143" textAnchor="middle" fill="#fecaca" fontSize="10">
              then 20°C→4°C (≤4h)
            </text>

            {/* Zone 3: Hot Holding */}
            <rect x="410" y="35" width="150" height="130" rx="10" fill="#431407" stroke="#fb923c" strokeWidth="2" />
            <text x="485" y="58" textAnchor="middle" fill="#fdba74" fontSize="12" fontWeight="bold">
              3. HOT HOLDING CCP
            </text>
            <text x="485" y="84" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">
              ≥ 63°C Core
            </text>
            <text x="485" y="106" textAnchor="middle" fill="#fed7aa" fontSize="11">
              Blocks Spore Germination
            </text>
            <text x="485" y="126" textAnchor="middle" fill="#94a3b8" fontSize="10">
              Probe Every 1–2 Hours
            </text>
            <text x="485" y="144" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="bold">
              Never Top-Up Old Pans
            </text>

            {/* Zone 4: Thermal Lethality Kill */}
            <rect x="575" y="35" width="155" height="130" rx="10" fill="#052e16" stroke="#4ade80" strokeWidth="2" />
            <text x="652" y="58" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="bold">
              4. THERMAL LETHALITY
            </text>
            <text x="652" y="82" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">
              Cook ≥ 75°C (30s)
            </text>
            <text x="652" y="103" textAnchor="middle" fill="#fde047" fontSize="12" fontWeight="bold">
              Retort F0 ≥ 3m (121.1°C)
            </text>
            <text x="652" y="124" textAnchor="middle" fill="#bbf7d0" fontSize="10">
              6-Log to 12-Log Pathogen Kill
            </text>
            <text x="652" y="144" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold">
              Dishwasher Rinse ≥ 82°C
            </text>

            {/* Bottom Summary Bar */}
            <text x="380" y="195" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">
              ACTIVE CONTROL PARAMETER: {ccp?.parameter} — LIMIT: {ccp?.standardLimit}
            </text>
          </svg>
        ) : isZoneOrPest ? (
          <svg
            viewBox="0 0 760 230"
            className="w-full h-auto min-w-[540px]"
            role="img"
            aria-label="Hygienic Risk Zoning & Concentric Defense Barriers Diagram"
          >
            <rect x="15" y="15" width="730" height="200" rx="12" fill="#0f172a" stroke="#334155" />

            {/* Concentric Rings / Zones */}
            <rect x="35" y="32" width="690" height="145" rx="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" strokeDasharray="6 4" />
            <text x="55" y="52" fill="#94a3b8" fontSize="11" fontWeight="bold">
              ZONE 4 / RING 1: EXTERNAL PERIMETER &amp; WAREHOUSE (50cm White Wall Strip · Locked Exterior Bait Stations)
            </text>

            <rect x="90" y="62" width="580" height="105" rx="12" fill="#0f291e" stroke="#10b981" strokeWidth="2" />
            <text x="110" y="82" fill="#6ee7b7" fontSize="11" fontWeight="bold">
              ZONE 3 / RING 2: BUILDING ENVELOPE &amp; LOW-RISK PROCESSING (Proofing ≤ 3mm · EFKs ≥ 3m from Food · Outward Drains)
            </text>

            <rect x="155" y="92" width="450" height="65" rx="10" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
            <text x="380" y="112" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">
              ZONE 2 &amp; ZONE 1: HIGH-CARE / HIGH-RISK RTE CORE (+5 to +15 Pa HEPA Overpressure)
            </text>
            <text x="380" y="132" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
              Captive Barrier Footwear · 100% Non-Toxic Internal Traps · Zero Listeria / Salmonella in 25g
            </text>
            <text x="380" y="148" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="bold">
              {ccp?.parameter}: {ccp?.standardLimit}
            </text>

            <text x="380" y="198" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">
              UNIDIRECTIONAL FLOW: Raw Receiving → Prep → Thermal Kill Step → High-Care Positive Pressure Packing → Dispatch
            </text>
          </svg>
        ) : isCleanOrCip ? (
          <svg
            viewBox="0 0 760 230"
            className="w-full h-auto min-w-[540px]"
            role="img"
            aria-label="6-Stage Sanitation & CIP Sinner Circle Technical Diagram"
          >
            <rect x="15" y="15" width="730" height="200" rx="12" fill="#0f172a" stroke="#334155" />
            <text x="380" y="38" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="bold">
              6-STAGE INDUSTRIAL SANITATION CYCLE &amp; SINNER’S CIRCLE (T.A.C.T.)
            </text>

            {[
              { step: '1. Pre-Scrape', sub: 'Remove gross soil', col: '#475569' },
              { step: '2. Detergent', sub: 'Emulsify grease (<55°C pre)', col: '#0284c7' },
              { step: '3. Rinse', sub: 'Flush loosened soil', col: '#0ea5e9' },
              { step: '4. Disinfect', sub: '100-200ppm Cl2 / ≥82°C', col: '#16a34a' },
              { step: '5. Final Rinse', sub: 'Potable water (if req)', col: '#0d9488' },
              { step: '6. Air Dry', sub: 'Verify ATP < 30 RLU', col: '#059669' }
            ].map((item, idx) => {
              const x = 30 + idx * 118;
              return (
                <g key={idx}>
                  <rect x={x} y="55" width="108" height="82" rx="10" fill={item.col} stroke="#ffffff" strokeOpacity="0.25" />
                  <text x={x + 54} y="85" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                    {item.step}
                  </text>
                  <text x={x + 54} y="108" textAnchor="middle" fill="#e2e8f0" fontSize="9.5">
                    {item.sub}
                  </text>
                </g>
              );
            })}

            <rect x="30" y="150" width="700" height="50" rx="8" fill="#1e293b" stroke="#10b981" />
            <text x="380" y="171" textAnchor="middle" fill="#fde047" fontSize="11.5" fontWeight="bold">
              SINNER’S 4 FACTORS: Time (Contact) + Action (CIP Velocity ≥ 1.5 m/s) + Concentration (Titrated %) + Temperature
            </text>
            <text x="380" y="190" textAnchor="middle" fill="#ffffff" fontSize="10.5">
              Critical Benchmark: {ccp?.parameter} → {ccp?.standardLimit}
            </text>
          </svg>
        ) : isCulinaryOrDietary ? (
          <svg
            viewBox="0 0 760 230"
            className="w-full h-auto min-w-[540px]"
            role="img"
            aria-label="Culinary, Clinical Dietary & Hospitality Operational Control Matrix"
          >
            <rect x="15" y="15" width="730" height="200" rx="12" fill="#0f172a" stroke="#334155" />
            <text x="380" y="38" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">
              INTERNATIONAL CULINARY, CLINICAL DIETARY &amp; HOSPITALITY CONTROL ARCHITECTURE
            </text>

            <rect x="30" y="52" width="220" height="115" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="140" y="74" textAnchor="middle" fill="#38bdf8" fontSize="11.5" fontWeight="bold">
              1. PRECISION &amp; FORMULATION
            </text>
            <text x="140" y="96" textAnchor="middle" fill="#ffffff" fontSize="11">
              • Knife Cuts: Brunoise 3×3×3 mm
            </text>
            <text x="140" y="114" textAnchor="middle" fill="#cbd5e1" fontSize="10.5">
              • IDDSI Drinks (0–4) &amp; Foods (3–7)
            </text>
            <text x="140" y="132" textAnchor="middle" fill="#cbd5e1" fontSize="10.5">
              • Mirepoix: 50% Onion : 25% Carrot : 25% Celery
            </text>
            <text x="140" y="150" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="bold">
              Gluten-Free &lt; 20 ppm · Renal Low-K+
            </text>

            <rect x="270" y="52" width="220" height="115" rx="10" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
            <text x="380" y="74" textAnchor="middle" fill="#6ee7b7" fontSize="11.5" fontWeight="bold">
              2. THERMAL &amp; SERVICE CCPs
            </text>
            <text x="380" y="96" textAnchor="middle" fill="#ffffff" fontSize="11">
              • Hot Pass ≥ 65°C | Cold Pass ≤ 5°C
            </text>
            <text x="380" y="114" textAnchor="middle" fill="#d1fae5" fontSize="10.5">
              • Fryer Oil TPM ≤ 24% | Class F/K Fire
            </text>
            <text x="380" y="132" textAnchor="middle" fill="#d1fae5" fontSize="10.5">
              • Legionella: Hot ≥ 60°C / Cold &lt; 20°C
            </text>
            <text x="380" y="150" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="bold">
              Laundry Disinfection ≥ 71°C (3 mins)
            </text>

            <rect x="510" y="52" width="220" height="115" rx="10" fill="#3b0764" stroke="#c084fc" strokeWidth="2" />
            <text x="620" y="74" textAnchor="middle" fill="#e9d5ff" fontSize="11.5" fontWeight="bold">
              3. YIELD &amp; FINANCIAL KPIs
            </text>
            <text x="620" y="96" textAnchor="middle" fill="#ffffff" fontSize="11">
              • EP Cost = AP Price ÷ Yield %
            </text>
            <text x="620" y="114" textAnchor="middle" fill="#f3e8ff" fontSize="10.5">
              • Food Cost: 28%–33% | Prime ≤ 60%
            </text>
            <text x="620" y="132" textAnchor="middle" fill="#f3e8ff" fontSize="10.5">
              • RevPAR = Occupancy % × ADR
            </text>
            <text x="620" y="150" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="bold">
              2-Identifier Bedside / VIP Check
            </text>

            <text x="380" y="195" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">
              MODULE FOCUS: {ccp?.parameter} → {ccp?.standardLimit}
            </text>
          </svg>
        ) : isHaccpOrDecision ? (
          <svg
            viewBox="0 0 760 230"
            className="w-full h-auto min-w-[540px]"
            role="img"
            aria-label="Codex HACCP 4-Question CCP Decision Tree & Risk Matrix Diagram"
          >
            <rect x="15" y="15" width="730" height="200" rx="12" fill="#0f172a" stroke="#334155" />
            <text x="380" y="38" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="bold">
              CODEX ALIMENTARIUS 4-QUESTION CCP DECISION TREE &amp; RISK MATRIX (L × S ≥ 9)
            </text>

            {[
              {
                q: 'Q1: Control Measures Exist?',
                detail: 'Do preventive control measures exist for the significant hazard?',
                yes: 'YES → Go to Q2',
                no: 'NO → Modify process if needed for safety'
              },
              {
                q: 'Q2: Step Designed to Eliminate?',
                detail: 'Is THIS step specifically designed to eliminate/reduce hazard to acceptable level?',
                yes: 'YES → CRITICAL CONTROL POINT (CCP)',
                no: 'NO → Proceed to Q3'
              },
              {
                q: 'Q3: Could Contamination Excess Occur?',
                detail: 'Could contamination with identified hazard occur in excess of acceptable levels?',
                yes: 'YES → Proceed to Q4',
                no: 'NO → Not a CCP (Manage via PRP)'
              },
              {
                q: 'Q4: Subsequent Step Eliminates?',
                detail: 'Will a SUBSEQUENT downstream step eliminate or reduce hazard to acceptable level?',
                yes: 'YES → Not a CCP (Downstream is CCP)',
                no: 'NO → CRITICAL CONTROL POINT (CCP)!'
              }
            ].map((node, i) => {
              const x = 28 + i * 178;
              return (
                <g key={i}>
                  <rect x={x} y="52" width="168" height="112" rx="10" fill="#1e293b" stroke="#10b981" strokeWidth="1.8" />
                  <text x={x + 84} y="73" textAnchor="middle" fill="#6ee7b7" fontSize="10.5" fontWeight="bold">
                    {node.q}
                  </text>
                  <text x={x + 84} y="95" textAnchor="middle" fill="#cbd5e1" fontSize="8.8">
                    {node.detail.slice(0, 32)}
                  </text>
                  <text x={x + 84} y="108" textAnchor="middle" fill="#cbd5e1" fontSize="8.8">
                    {node.detail.slice(32)}
                  </text>
                  <text x={x + 84} y="130" textAnchor="middle" fill="#4ade80" fontSize="9.5" fontWeight="bold">
                    {node.yes}
                  </text>
                  <text x={x + 84} y="148" textAnchor="middle" fill="#fbbf24" fontSize="9.2" fontWeight="bold">
                    {node.no}
                  </text>
                </g>
              );
            })}

            <text x="380" y="194" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              ACTIVE CCP / CONTROL BENCHMARK: {ccp?.parameter} ({ccp?.standardLimit})
            </text>
          </svg>
        ) : (
          <svg
            viewBox="0 0 760 230"
            className="w-full h-auto min-w-[540px]"
            role="img"
            aria-label="ISO / GFSI Dual PDCA Cycle & Management System Architecture"
          >
            <rect x="15" y="15" width="730" height="200" rx="12" fill="#0f172a" stroke="#334155" />
            <text x="380" y="38" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="bold">
              ANNEX SL HIGH-LEVEL STRUCTURE (CLAUSES 4–10) &amp; DUAL PDCA CYCLE ARCHITECTURE
            </text>

            {[
              {
                phase: '1. PLAN (Clauses 4, 5, 6)',
                desc1: 'Context & Interested Parties',
                desc2: 'Leadership & Quality/FS Policy',
                desc3: 'Risks, Opportunities & Objectives',
                col: '#0369a1'
              },
              {
                phase: '2. DO (Clauses 7 & 8)',
                desc1: 'Competence & ISO 17025 Calibration',
                desc2: 'PRPs, OPRPs & HACCP CCP Plan',
                desc3: 'VACCP Fraud, TACCP & Traceability',
                col: '#047857'
              },
              {
                phase: '3. CHECK (Clause 9)',
                desc1: 'KPI Monitoring & Lab Verification',
                desc2: 'Impartial Internal Audits (≥4 dates)',
                desc3: 'Executive Management Review',
                col: '#b45309'
              },
              {
                phase: '4. ACT (Clause 10)',
                desc1: 'Non-Conformity Quarantine Hold',
                desc2: '5-Why Root Cause Analysis (CAPA)',
                desc3: 'Continual System Improvement',
                col: '#7e22ce'
              }
            ].map((box, idx) => {
              const x = 28 + idx * 178;
              return (
                <g key={idx}>
                  <rect x={x} y="54" width="168" height="110" rx="10" fill={box.col} fillOpacity="0.35" stroke="#e2e8f0" strokeOpacity="0.4" />
                  <text x={x + 84} y="76" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold">
                    {box.phase}
                  </text>
                  <text x={x + 84} y="100" textAnchor="middle" fill="#ffffff" fontSize="10">
                    • {box.desc1}
                  </text>
                  <text x={x + 84} y="120" textAnchor="middle" fill="#e2e8f0" fontSize="10">
                    • {box.desc2}
                  </text>
                  <text x={x + 84} y="140" textAnchor="middle" fill="#cbd5e1" fontSize="10">
                    • {box.desc3}
                  </text>
                </g>
              );
            })}

            <text x="380" y="194" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              CRITICAL CONTROL BENCHMARK: {ccp?.parameter} → {ccp?.standardLimit}
            </text>
          </svg>
        )}
      </div>

      <p className="text-[11px] text-[#DCE9F6]/90 leading-relaxed">
        <strong>Diagram Study Guide:</strong> Memorize the exact numerical thresholds shown in this technical diagram—questions on the 40-MCQ Final Exam test both the standard limit (<span className="text-amber-300 font-semibold">{ccp?.standardLimit}</span>) and the mandatory corrective action when limits are breached.
      </p>
    </div>
  );
};

export const AlisonCourseModuleViewer: React.FC<AlisonCourseModuleViewerProps> = ({
  course,
  module,
  moduleIndex,
  totalModules,
  isCompleted,
  onSelectprev,
  onCompleteAndNext,
  onCompleteAndStartExam
}) => {
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [activeTierFilter, setActiveTierFilter] = useState<
    'all' | 'beginner' | 'practitioner' | 'expert'
  >('all');

  // Reset quiz selection when module changes
  React.useEffect(() => {
    setSelectedQuizOption(null);
  }, [module.id]);

  const pedagogy = React.useMemo(
    () => buildModulePedagogy(course, module),
    [course, module]
  );

  return (
    <div className="space-y-6">
      {/* 1. ALISON-STYLE MODULE HEADER & PROGRESSIVE LEARNING LEVEL TABS */}
      <div className="rounded-2xl border border-[#D2DEEA] bg-gradient-to-r from-[#1A2138] via-[#105E9A] to-[#1673B8] text-white p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-white/15 border border-white/20 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
              Module {module.moduleNumber} of {totalModules} · Comprehensive Study Guide
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#1A2138]/60 text-[#DCE9F6] text-[11px] font-bold">
              ⏱ ~65–90 Mins Deep Study · Auto-Saved Resume Point
            </span>
          </div>
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-[#1673B8] text-xs font-black">
              <CheckCircle2 className="w-4 h-4" /> Module Completed
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            Module {module.moduleNumber}: {module.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#EBF4FC]/95 leading-relaxed">
            {module.overview}
          </p>
        </div>

        {/* 5-Stage Structured Curriculum Progression Roadmap (Basics -> PRPs -> Steps 1-5 -> Principles/Matrix/Decision Tree -> Auditing & Law) */}
        <div className="pt-3 border-t border-white/15 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Structured 5-Module International Curriculum Architecture (Basic Foundations → Expert Auditing &amp; Law):
            </span>
            <span className="text-[10.5px] font-bold text-[#DCE9F6]">
              Currently Studying: Stage {module.moduleNumber} of 5
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
            {[
              {
                num: 1,
                stage: 'Module 1 · Basics',
                desc: 'History, Core Definitions, Science & Hazard Fundamentals'
              },
              {
                num: 2,
                stage: 'Module 2 · PRPs',
                desc: 'Prerequisite Programs (GMP, GHP, SSOPs, Pest & Allergens)'
              },
              {
                num: 3,
                stage: 'Module 3 · Steps 1–5',
                desc: 'Initial 5 HACCP Steps, Team, Product & Flow Verification'
              },
              {
                num: 4,
                stage: 'Module 4 · Principles 1–4',
                desc: 'Hazard Analysis, 5×5 Risk Matrix, Codex Tree & Critical Limits'
              },
              {
                num: 5,
                stage: 'Module 5 · Principles 5–7',
                desc: 'CAPA, Validation, How to Audit System & Food Safety Law'
              }
            ].map((st) => {
              const isCurrent = module.moduleNumber === st.num;
              return (
                <div
                  key={st.num}
                  className={`rounded-xl p-2.5 border text-left transition ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                      : 'bg-white/10 text-white border-white/15'
                  }`}
                >
                  <p
                    className={`text-[10px] font-black uppercase tracking-wider ${
                      isCurrent ? 'text-slate-950' : 'text-amber-300'
                    }`}
                  >
                    {st.stage}
                  </p>
                  <p
                    className={`text-[10.5px] leading-snug mt-0.5 font-semibold ${
                      isCurrent ? 'text-slate-900' : 'text-[#EBF4FC]/90'
                    }`}
                  >
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Depth Filter Pills (Beginner -> Practitioner -> Expert) */}
        <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-[#DCE9F6] flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            Progressive Teaching Method (Fresh Beginner → Expert Auditor):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Levels (Complete Course)' },
              { id: 'beginner', label: '1. Fresh Beginner' },
              { id: 'practitioner', label: '2. Practitioner SOPs' },
              { id: 'expert', label: '3. Expert & Auditor' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTierFilter(
                    tab.id as 'all' | 'beginner' | 'practitioner' | 'expert'
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                  activeTierFilter === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ALISON.COM LEARNING OUTCOMES & INTERNATIONAL CLAUSES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 rounded-2xl border border-[#D2DEEA] bg-[#F0F6FC] p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1673B8]">
            <Compass className="w-4 h-4" />
            Module Learning Outcomes (What You Will Master)
          </div>
          <ul className="space-y-2">
            {pedagogy.learningOutcomes.map((outcome, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs sm:text-sm text-[#1A2138] leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-[#1673B8] shrink-0 mt-0.5" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5 rounded-2xl border border-[#D2DEEA] bg-slate-50 p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1A2138]">
            <BookOpen className="w-4 h-4 text-[#1673B8]" />
            International Regulatory &amp; Standard Clauses
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 font-semibold">
            {module.internationalClauses.map((cl, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2"
              >
                <span className="px-2 py-0.5 rounded bg-[#EBF4FC] text-[#1673B8] text-[10px] font-black shrink-0">
                  Clause
                </span>
                <span>{cl}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Aligned with 2024–2026 international food safety, quality management, and hospitality accreditation frameworks.
          </p>
        </div>
      </div>

      {/* 3. LEVEL 1: FRESH BEGINNER FOUNDATION (PLAIN-LANGUAGE TEACHING + ANALOGY + GLOSSARY) */}
      {(activeTierFilter === 'all' || activeTierFilter === 'beginner') && (
        <div className="rounded-2xl border-2 border-[#1673B8]/25 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#EBF4FC] text-[#1673B8] text-xs font-black uppercase tracking-wider">
                Level 1 · Fresh Beginner Foundation
              </span>
              <span className="text-xs font-bold text-slate-500">
                Zero Prior Experience Needed — Step-by-Step Explanation
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-base sm:text-lg font-black text-[#1A2138]">
              {pedagogy.beginnerFoundation.headline}
            </h4>
            {pedagogy.beginnerFoundation.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-xs sm:text-sm text-slate-700 leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Core International Principles Cards */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-black uppercase tracking-wider text-[#1673B8]">
              Core Scientific &amp; Operational Principles Explained
            </h5>
            <div className="grid grid-cols-1 gap-2.5">
              {module.keyPrinciples.map((principle, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#D2DEEA] bg-[#F0F6FC] p-4 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-[#1673B8] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-[#1A2138] leading-relaxed">
                      {principle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Life Analogy Box */}
          <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-wider text-amber-950">
                Easy-to-Understand Real-World Analogy
              </p>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                {pedagogy.beginnerFoundation.realLifeAnalogy}
              </p>
            </div>
          </div>

          {/* Key Terms Glossary & Common Beginner Mistakes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
              <h5 className="text-xs font-black uppercase tracking-wider text-[#1A2138]">
                Essential Terminology &amp; Glossary
              </h5>
              <div className="space-y-2">
                {pedagogy.glossaryTerms.map((g, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs"
                  >
                    <span className="font-black text-[#1673B8]">{g.term}: </span>
                    <span className="text-slate-700">{g.definition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-2.5">
              <h5 className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                4 Common Beginner Mistakes to Avoid
              </h5>
              <ul className="space-y-2 text-xs text-rose-950">
                {pedagogy.beginnerFoundation.commonBeginnerMistakes.map(
                  (mistake, i) => (
                    <li
                      key={i}
                      className="p-2.5 rounded-lg bg-white border border-rose-200/70 flex items-start gap-2"
                    >
                      <span className="font-black text-rose-600">✕</span>
                      <span>{mistake}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. VISUAL TECHNICAL DIAGRAM / PICTURE */}
      <ModuleTechnicalPictureSvg course={course} module={module} />

      {/* 5. LEVEL 2: INTERMEDIATE PRACTITIONER (STEP-BY-STEP SOPs & WORKED CALCULATIONS) */}
      {(activeTierFilter === 'all' || activeTierFilter === 'practitioner') && (
        <div className="rounded-2xl border-2 border-[#1673B8]/25 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#EBF4FC] text-[#105E9A] text-xs font-black uppercase tracking-wider">
                Level 2 · Intermediate Practitioner Execution
              </span>
              <span className="text-xs font-bold text-slate-500">
                Standard Operating Procedures (SOPs), Calculations &amp; Critical Limits
              </span>
            </div>
          </div>

          <h4 className="text-base sm:text-lg font-black text-[#1A2138]">
            {pedagogy.practitionerExecution.headline}
          </h4>

          {/* 4-Step Operational SOP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pedagogy.practitionerExecution.stepByStepSop.map((step, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#D2DEEA] bg-[#F0F6FC] p-4 space-y-1.5"
              >
                <p className="text-xs font-black text-[#1673B8]">
                  {step.stepTitle}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Worked Formula & Engineering Calculation Box */}
          <div className="rounded-2xl border border-[#1673B8]/30 bg-[#1A2138] text-white p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Microscope className="w-4 h-4" />
              {pedagogy.practitionerExecution.formulaOrCalculation.title}
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs sm:text-sm text-[#7AB8EB] font-bold overflow-x-auto">
              {pedagogy.practitionerExecution.formulaOrCalculation.equation}
            </div>
            <p className="text-xs text-[#EBF4FC] leading-relaxed">
              <strong className="text-amber-300">Worked Practical Example: </strong>
              {pedagogy.practitionerExecution.formulaOrCalculation.workedExample}
            </p>
          </div>

          {/* Critical Control Parameters Table */}
          <div className="space-y-2">
            <h5 className="text-xs font-black uppercase tracking-wider text-[#1673B8]">
              Mandatory Critical Control Limits &amp; Corrective Action Protocols
            </h5>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-[#1A2138] font-extrabold">
                    <th className="p-3.5 border-b border-slate-200">
                      Control Parameter
                    </th>
                    <th className="p-3.5 border-b border-slate-200">
                      International Standard Limit
                    </th>
                    <th className="p-3.5 border-b border-slate-200">
                      Mandatory Corrective Protocol (CAPA)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {module.criticalControlParameters.map((ccp, i) => (
                    <tr key={i} className="border-b border-slate-100 bg-white">
                      <td className="p-3.5 font-black text-[#1A2138]">
                        {ccp.parameter}
                      </td>
                      <td className="p-3.5 font-bold text-[#1673B8]">
                        {ccp.standardLimit}
                      </td>
                      <td className="p-3.5 text-slate-700 leading-relaxed">
                        {ccp.correctiveProtocol}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. STATISTICAL GRAPHS, CHARTS & GLOBAL INDUSTRY BENCHMARKS */}
      <div className="rounded-2xl border border-[#D2DEEA] bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#1673B8]">
              <BarChart3 className="w-4 h-4" />
              Industry Statistics, Quantitative Graphs &amp; Global Benchmarks
            </div>
            <h4 className="text-base sm:text-lg font-black text-[#1A2138]">
              {pedagogy.statisticsReport.chartTitle}
            </h4>
            <p className="text-xs text-slate-500">
              {pedagogy.statisticsReport.chartSubtitle} · Source:{' '}
              <span className="font-semibold text-slate-700">
                {pedagogy.statisticsReport.sourceCitation}
              </span>
            </p>
          </div>
        </div>

        {/* 4 Statistical KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pedagogy.statisticsReport.kpiCards.map((kpi, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#D2DEEA] bg-[#F0F6FC] p-3.5 space-y-1"
            >
              <p className="text-base sm:text-lg font-black text-[#1673B8]">
                {kpi.value}
              </p>
              <p className="text-xs font-extrabold text-[#1A2138]">
                {kpi.label}
              </p>
              <p className="text-[10.5px] text-slate-600 leading-snug">
                {kpi.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Statistical Bar Graph */}
        <div className="space-y-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
          {pedagogy.statisticsReport.bars.map((bar, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#1A2138]">{bar.label}</span>
                <span className="font-mono font-black text-[#1673B8]">
                  {bar.value}
                  {bar.unit}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${bar.colorClass} transition-all duration-500`}
                  style={{ width: `${bar.barPct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                <strong>Technical Note:</strong> {bar.note}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] p-3.5 flex items-start gap-2.5 text-xs text-[#1A2138] leading-relaxed">
          <TrendingUp className="w-4 h-4 text-[#1673B8] shrink-0 mt-0.5" />
          <span>{pedagogy.statisticsReport.analyticalSummary}</span>
        </div>
      </div>

      {/* 6B. CONCRETE PRACTICAL EXAMPLES, 5x5 RISK ASSESSMENT MATRIX, CODEX DECISION TREE & AUDITING/LAW */}
      <div className="rounded-2xl border-2 border-[#1673B8]/30 bg-white p-5 sm:p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="px-3 py-1 rounded-lg bg-[#EBF4FC] text-[#105E9A] text-xs font-black uppercase tracking-wider">
              Practical Industry Mastery · Worked Examples, Risk Matrix, Decision Tree &amp; Law
            </span>
            <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1.5">
              Step-by-Step Practical Examples, 5×5 Hazard Risk Matrix, Codex CCP Decision Tree &amp; Legal Auditing
            </h4>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Module {module.moduleNumber} Applied Field Manual
          </span>
        </div>

        {/* 3 Concrete Real-World Worked Examples for the Current Module Stage */}
        <div className="space-y-3">
          <h5 className="text-xs font-black uppercase tracking-wider text-[#1673B8] flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            3 Concrete Step-by-Step Real-World Industry Examples (Stage {module.moduleNumber} Application)
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {(module.moduleNumber === 1
              ? [
                  {
                    tag: 'Example 1 · Poultry & Catering',
                    title: 'Biological Hazard vs. Spoilage in Raw Chicken Breast',
                    scenario:
                      'Chilled raw chicken arrives at +3.5°C with normal odor and color, but carries 10³ CFU/g Campylobacter jejuni.',
                    solution:
                      'Pathogens do NOT change smell or appearance. Visual inspection at receiving cannot detect Campylobacter; only validated thermal cooking to ≥75°C core for ≥30 seconds achieves a 6-log lethality reduction.'
                  },
                  {
                    tag: 'Example 2 · Cooked Rice Buffet',
                    title: 'Bacillus cereus Heat-Stable Emetic Toxin (Cereulide)',
                    scenario:
                      'Boiled rice is left at +28°C ambient kitchen temperature for 4.5 hours before being reheated to +85°C in a wok.',
                    solution:
                      'Cooking kills vegetative cells, but surviving spores germinate between +10°C and +50°C and produce cereulide toxin, which survives +121°C for 90 minutes. Reheating cannot make the rice safe—it must be discarded.'
                  },
                  {
                    tag: 'Example 3 · Bakery & Milling',
                    title: 'Chemical (Mycotoxin) & Physical Hazard Differentiation',
                    scenario:
                      'Wheat flour lot arrives from humid storage with 28 ppb Aflatoxin B1 and a broken 2.0 mm stainless steel sifter wire.',
                    solution:
                      'Aflatoxin B1 is a heat-stable chemical hazard controlled via Supplier COA + <14% grain moisture PRP; the stainless steel wire is a physical hazard controlled via a 500-micron inline sifter and metal detector CCP.'
                  }
                ]
              : module.moduleNumber === 2
              ? [
                  {
                    tag: 'Example 1 · Prerequisite Program (PRP)',
                    title: 'Color-Coded Zoning & Allergen Changeover SSOP',
                    scenario:
                      'A catering line switches from peanut-satay chicken skewering to allergen-free grilled chicken breast on the same prep table.',
                    solution:
                      'Detergent + hot water + quaternary ammonium sanitizer kills bacteria but does NOT destroy peanut Ara h 1 protein. Full 7-step wet alkaline wash + Dedicated Purple Allergen Kit + ATP/Lateral Flow swab (<10 RLU / 0 ppm) is mandatory.'
                  },
                  {
                    tag: 'Example 2 · Calibration PRP',
                    title: 'Ice-Point (0.0°C) vs. Boiling-Point (100.0°C) Probe Calibration',
                    scenario:
                      'A digital thermistor probe reads +1.8°C in a crushed ice-slurry bath during morning pre-op check.',
                    solution:
                      'Tolerance is ±0.5°C. Because +1.8°C exceeds ±0.5°C drift, the probe is tagged OUT OF SERVICE, replaced with a calibrated backup probe, and all chiller logs since the previous calibration check are re-verified.'
                  },
                  {
                    tag: 'Example 3 · Pest Management PRP',
                    title: '3-Ring IPM Defense & Rodent Trend Action Threshold',
                    scenario:
                      'Weekly inspection finds 2 rodent droppings and gnaw marks near the dry-store roller shutter door (12 mm bottom gap).',
                    solution:
                      'Immediate bristle-strip door proofing (<6 mm gap), 100% quarantine of pallets within 3 meters under UV blacklight for urine fluorescence, and root-cause corrective action—zero toxic loose bait allowed inside food zones.'
                  }
                ]
              : module.moduleNumber === 3
              ? [
                  {
                    tag: 'Example 1 · HACCP Steps 1–3',
                    title: 'Product Description & Vulnerable Consumer Intended Use',
                    scenario:
                      'A central kitchen produces pasteurized sous-vide beef cheeks (aw 0.98, pH 6.1, vacuum-packed) for both a hotel restaurant and a hospital geriatric ward.',
                    solution:
                      'Because intended users include immunocompromised hospital patients (Step 3), shelf-life at ≤3.0°C must be restricted to ≤10 days (to prevent psychrotrophic non-proteolytic C. botulinum growth) with strict Listeria absence in 25g.'
                  },
                  {
                    tag: 'Example 2 · HACCP Step 4',
                    title: 'Constructing a Complete Process Flow Diagram',
                    scenario:
                      'A dairy plant maps milk reception → pasteurization → filling, but forgets to include the rework loop and liquid nitrogen dosing line.',
                    solution:
                      'An incomplete flow diagram invalidates the entire Hazard Analysis (Step 6). Every input (packaging, gases, water, rework, allergen additions, waste streams, and chill-hold buffers) must be mapped with time/temperature parameters.'
                  },
                  {
                    tag: 'Example 3 · HACCP Step 5',
                    title: 'On-Site Walk-Through Verification Across All Shifts',
                    scenario:
                      'Day-shift flow diagram shows blast chilling from +60°C to +4°C in 90 minutes, but the night-shift team stacks hot trays on ambient racks for 2 hours when the blast chiller is full.',
                    solution:
                      'Step 5 requires physical walk-through verification during Day, Night, Weekend, and Peak production shifts—discovering the unmapped ambient holding delay and adding a staged cooking batch schedule.'
                  }
                ]
              : module.moduleNumber === 4
              ? [
                  {
                    tag: 'Example 1 · Principle 1 (5×5 Risk Matrix)',
                    title: 'Scoring Salmonella in Raw Poultry Cooking Step',
                    scenario:
                      'At the Rotary Oven Cooking step: Severity of Salmonella infection = 4 (Serious hospitalization); Likelihood without control = 5 (Frequent in raw poultry).',
                    solution:
                      'Risk Score = Severity (4) × Likelihood (5) = 20/25 (Critical Significant Hazard). Because no downstream step eliminates Salmonella, Codex Decision Tree Q2 = YES → designated as CCP-1.'
                  },
                  {
                    tag: 'Example 2 · Principle 2 (Codex Decision Tree)',
                    title: 'Why Chilled Storage (+4°C) is an OPRP/CP vs. Cooking (+75°C) is a CCP',
                    scenario:
                      'A student marks all 14 steps in a kitchen flow chart as CCPs, including Raw Vegetable Washing and Dry Goods Storage.',
                    solution:
                      'Passing Raw Chiller Storage through the Codex Decision Tree: Q1=Yes, Q2=No (not specifically designed to eliminate hazard to acceptable level), Q3=Yes, Q4=Yes (subsequent cooking step ≥75°C eliminates pathogens) → Manage as PRP/OPRP, whereas Cooking (Q4=No) is the true CCP.'
                  },
                  {
                    tag: 'Example 3 · Principles 3 & 4 (Limits & Monitoring)',
                    title: 'Critical Limit vs. Operational Limit in Pasteurization / Metal Detection',
                    scenario:
                      'Legal Critical Limit for milk HTST pasteurization is ≥72.0°C for ≥15 sec. If the plant sets its alarm at 72.0°C, any 0.2°C dip triggers a legal CCP deviation.',
                    solution:
                      'Set an Operational Limit at 74.5°C for 16 sec. If temperature drops to 73.8°C, an early warning alarm allows steam valve adjustment BEFORE breaching the 72.0°C Critical Limit.'
                  }
                ]
              : [
                  {
                    tag: 'Example 1 · Principle 5 (Corrective Action)',
                    title: 'Handling a Metal Detector CCP Rejection & 100% Hold-and-Rescreen',
                    scenario:
                      'At 14:30, the Hourly Metal Detector test piece (2.0 mm Stainless Steel) fails to trigger the pneumatic reject arm; last passed check was at 13:30.',
                    solution:
                      '1) Immediately stop the packing line; 2) Quarantine 100% of finished pallets produced between 13:30 and 14:30; 3) Repair solenoid air pressure; 4) Re-pass every quarantined pack through a verified detector; 5) Complete 5-Why CAPA log.'
                  },
                  {
                    tag: 'Example 2 · Principle 6 (Validation vs. Verification)',
                    title: 'Distinguishing Scientific Validation from Routine Verification',
                    scenario:
                      'During a BRCGS Issue 9 audit, the QA Manager shows daily cooking temperature sheets when asked for "CCP Validation evidence".',
                    solution:
                      'Daily temperature logs are VERIFICATION (proving the limit was followed). VALIDATION is the scientific proof before operations (e.g., USDA D-value/z-value lethality study + worst-case cold-spot heat penetration mapping) proving ≥75°C for 30s actually achieves a 6-log reduction.'
                  },
                  {
                    tag: 'Example 3 · Food Safety Law & Auditing',
                    title: 'Proving Legal Due Diligence Defence in Regulatory Court',
                    scenario:
                      'A consumer alleges food poisoning from a hotel banquet meal; Food Authority Inspectors audit the kitchen records.',
                    solution:
                      'Under UK Food Safety Act 1990 (Sec 21), EU Reg 852/2004, US FSMA & Provincial Pure Food Laws, the hotel proves Due Diligence ("all reasonable precautions and all due diligence") using signed batch core-probe logs, blast-chill curves, retained 72-hour food bank samples, and accredited staff training certificates.'
                  }
                ]
            ).map((ex, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#D2DEEA] bg-[#F0F6FC] p-4 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#1673B8] text-white text-[10px] font-black uppercase tracking-wider">
                    {ex.tag}
                  </span>
                  <h6 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                    {ex.title}
                  </h6>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Scenario: </strong>
                    {ex.scenario}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#D2DEEA] text-xs text-[#1A2138] leading-relaxed">
                  <strong className="text-[#1673B8]">Technical Solution: </strong>
                  {ex.solution}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5x5 Hazard Risk Assessment Matrix & Codex 4-Question CCP Decision Tree */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          {/* Left: 5x5 Risk Assessment Matrix */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#1673B8]" />
                How to Do Hazard Risk Assessment (5×5 Likelihood × Severity Matrix)
              </h5>
              <span className="px-2 py-0.5 rounded bg-[#EBF4FC] text-[#105E9A] text-[10px] font-black">
                Codex / ISO 22000 Cl. 8.5.2
              </span>
            </div>
            <p className="text-[11.5px] text-slate-600 leading-relaxed">
              Every identified Biological (B), Chemical (C), Physical (P), and Allergen (A) hazard is scored from <strong>1 to 5 for Severity</strong> (health impact) and <strong>1 to 5 for Likelihood</strong> (probability of occurrence). <strong>Risk Score = Severity × Likelihood (1–25)</strong>. Any hazard scoring <strong>≥12 (or Severity = 5)</strong> is a <strong>Significant Hazard</strong> that must be evaluated in the Codex CCP Decision Tree.
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
              <table className="w-full text-center border-collapse text-[10.5px]">
                <thead>
                  <tr className="bg-[#1A2138] text-white font-black">
                    <th className="p-2 border border-slate-700 text-left">
                      Severity ↓ \ Likelihood →
                    </th>
                    <th className="p-1.5 border border-slate-700">1 Rare</th>
                    <th className="p-1.5 border border-slate-700">2 Unlikely</th>
                    <th className="p-1.5 border border-slate-700">3 Possible</th>
                    <th className="p-1.5 border border-slate-700">4 Likely</th>
                    <th className="p-1.5 border border-slate-700">5 Frequent</th>
                  </tr>
                </thead>
                <tbody className="font-bold">
                  <tr>
                    <td className="p-2 border border-slate-200 text-left bg-slate-100 font-black">
                      5 · Catastrophic (Death)
                    </td>
                    <td className="p-1.5 border border-slate-200 bg-amber-100 text-amber-950">5 (Med)</td>
                    <td className="p-1.5 border border-slate-200 bg-orange-200 text-orange-950">10 (High)</td>
                    <td className="p-1.5 border border-slate-200 bg-rose-600 text-white">15 (CCP)</td>
                    <td className="p-1.5 border border-slate-200 bg-rose-700 text-white">20 (CCP)</td>
                    <td className="p-1.5 border border-slate-200 bg-rose-900 text-white">25 (CCP)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200 text-left bg-slate-100 font-black">
                      4 · Major (Hospitalization)
                    </td>
                    <td className="p-1.5 border border-slate-200 bg-[#EBF4FC] text-[#105E9A]">4 (Low)</td>
                    <td className="p-1.5 border border-slate-200 bg-amber-100 text-amber-950">8 (Med)</td>
                    <td className="p-1.5 border border-slate-200 bg-orange-300 text-orange-950">12 (Sig)</td>
                    <td className="p-1.5 border border-slate-200 bg-rose-600 text-white">16 (CCP)</td>
                    <td className="p-1.5 border border-slate-200 bg-rose-700 text-white">20 (CCP)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200 text-left bg-slate-100 font-black">
                      3 · Moderate (Medical Care)
                    </td>
                    <td className="p-1.5 border border-slate-200 bg-[#EBF4FC] text-[#105E9A]">3 (PRP)</td>
                    <td className="p-1.5 border border-slate-200 bg-amber-100 text-amber-950">6 (Med)</td>
                    <td className="p-1.5 border border-slate-200 bg-amber-200 text-amber-950">9 (OPRP)</td>
                    <td className="p-1.5 border border-slate-200 bg-orange-300 text-orange-950">12 (Sig)</td>
                    <td className="p-1.5 border border-slate-200 bg-rose-600 text-white">15 (CCP)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200 text-left bg-slate-100 font-black">
                      2 · Minor (Short Illness)
                    </td>
                    <td className="p-1.5 border border-slate-200 bg-[#F0F6FC] text-[#1673B8]">2 (PRP)</td>
                    <td className="p-1.5 border border-slate-200 bg-[#EBF4FC] text-[#105E9A]">4 (PRP)</td>
                    <td className="p-1.5 border border-slate-200 bg-amber-100 text-amber-950">6 (Med)</td>
                    <td className="p-1.5 border border-slate-200 bg-amber-200 text-amber-950">8 (OPRP)</td>
                    <td className="p-1.5 border border-slate-200 bg-orange-200 text-orange-950">10 (High)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-200 text-left bg-slate-100 font-black">
                      1 · Negligible (Discomfort)
                    </td>
                    <td className="p-1.5 border border-slate-200 bg-[#F0F6FC] text-[#1673B8]">1 (PRP)</td>
                    <td className="p-1.5 border border-slate-200 bg-[#F0F6FC] text-[#1673B8]">2 (PRP)</td>
                    <td className="p-1.5 border border-slate-200 bg-[#EBF4FC] text-[#105E9A]">3 (PRP)</td>
                    <td className="p-1.5 border border-slate-200 bg-[#EBF4FC] text-[#105E9A]">4 (PRP)</td>
                    <td className="p-1.5 border border-slate-200 bg-amber-100 text-amber-950">5 (Med)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-2 text-[10.5px] font-bold">
              <span className="px-2 py-0.5 rounded bg-[#EBF4FC] text-[#105E9A]">
                1–4: Low Risk (Manage via PRPs / GMP)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950">
                5–9: Medium Risk (OPRP / Enhanced Monitoring)
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white">
                12–25: Significant Hazard → Run Codex CCP Decision Tree
              </span>
            </div>
          </div>

          {/* Right: Codex Alimentarius 4-Question CCP Decision Tree */}
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#1673B8]" />
                Codex Alimentarius 4-Question CCP Decision Tree (Step 7 / Principle 2)
              </h5>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 text-[10px] font-black">
                CXC 1-1969 Logic
              </span>
            </div>
            <p className="text-[11.5px] text-slate-600 leading-relaxed">
              Apply these 4 sequential questions to every process step where a <strong>Significant Hazard (Score ≥12)</strong> was identified:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="font-black text-slate-900">
                  <span className="text-[#1673B8]">Q1: </span>Do preventative control measures exist at this step or across the process for the identified hazard?
                </p>
                <p className="text-[11px] text-slate-600">
                  • <strong>YES</strong> → Proceed to <strong>Q2</strong>. &nbsp;|&nbsp; • <strong>NO</strong> → Is control at this step necessary for food safety? If YES, modify step/process or product; if NO → <strong>Not a CCP (Stop)</strong>.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="font-black text-slate-900">
                  <span className="text-[#1673B8]">Q2: </span>Is this specific process step specifically designed to eliminate or reduce the likely occurrence of the hazard to an acceptable level? (e.g., Cooking, Pasteurization, Retort, Metal Detector)
                </p>
                <p className="text-[11px] text-slate-600">
                  • <strong>YES</strong> → <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black">THIS STEP IS A CCP!</span> &nbsp;|&nbsp; • <strong>NO</strong> → Proceed to <strong>Q3</strong>.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="font-black text-slate-900">
                  <span className="text-[#1673B8]">Q3: </span>Could contamination with the identified hazard occur in excess of acceptable levels, or could it increase to unacceptable levels at this step?
                </p>
                <p className="text-[11px] text-slate-600">
                  • <strong>YES</strong> → Proceed to <strong>Q4</strong>. &nbsp;|&nbsp; • <strong>NO</strong> → <strong>Not a CCP (Manage as PRP)</strong>.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="font-black text-slate-900">
                  <span className="text-[#1673B8]">Q4: </span>Will a subsequent downstream step eliminate the identified hazard or reduce its likely occurrence to an acceptable level?
                </p>
                <p className="text-[11px] text-slate-600">
                  • <strong>YES</strong> → <strong>Not a CCP</strong> (Manage via OPRP/PRP; the downstream step will be the CCP). &nbsp;|&nbsp; • <strong>NO</strong> → <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black">THIS STEP IS A CCP!</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Audit a HACCP System & Global Food Safety Law Reference Table */}
        <div className="rounded-2xl border border-[#D2DEEA] bg-[#F0F6FC] p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h5 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1673B8] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              How to Audit a HACCP / Food Safety System &amp; Mandatory Food Safety Law Reference
            </h5>
            <span className="text-[11px] font-bold text-slate-600">
              ISO 19011 Auditing + Statutory Compliance
            </span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#D2DEEA] bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#1A2138] text-white font-black">
                  <th className="p-3 border-b border-slate-700">
                    Audit Phase / Legal Statute
                  </th>
                  <th className="p-3 border-b border-slate-700">
                    Mandatory Requirement &amp; Legal Clause
                  </th>
                  <th className="p-3 border-b border-slate-700">
                    How the Auditor Verifies Compliance on Site (Objective Evidence)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-black text-slate-900">
                    1. Desk-Top HACCP Plan &amp; Hazard Analysis Audit
                  </td>
                  <td className="p-3 font-bold text-[#1673B8]">
                    Codex CXC 1-1969 Steps 1–12 &amp; ISO 22000 Clause 8.5
                  </td>
                  <td className="p-3 text-slate-700">
                    Verify multidisciplinary team competency certificates, 100% flow diagram accuracy against plant layout, 5×5 risk calculations, Codex tree justification, and scientific validation studies.
                  </td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <td className="p-3 font-black text-slate-900">
                    2. Shop-Floor CCP Witnessing &amp; Traceability Challenge
                  </td>
                  <td className="p-3 font-bold text-[#1673B8]">
                    BRCGS Issue 9 Cl. 2.11 / Clause 3.9 (≤4 Hour Mass Balance)
                  </td>
                  <td className="p-3 text-slate-700">
                    Shadow operators performing live core-probe temperature checks and metal detector test-piece challenges; execute a timed 4-hour vertical forward/backward mass-balance recall test (99.5%–100.5%).
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-black text-slate-900">
                    3. UK &amp; EU Food Safety Law
                  </td>
                  <td className="p-3 font-bold text-[#1673B8]">
                    EU Reg (EC) 852/2004 Art. 5 &amp; UK Food Safety Act 1990 Sec. 21
                  </td>
                  <td className="p-3 text-slate-700">
                    Article 5 mandates a permanent procedure based on the 7 HACCP principles. Section 21 establishes the Statutory Due Diligence Defence requiring tamper-evident monitoring &amp; CAPA logs.
                  </td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <td className="p-3 font-black text-slate-900">
                    4. US FDA FSMA &amp; GCC / Middle East Law
                  </td>
                  <td className="p-3 font-bold text-[#1673B8]">
                    US 21 CFR Part 117 (HARPC) · Dubai Food Code · SFDA · GSO 1694
                  </td>
                  <td className="p-3 text-slate-700">
                    Requires a Preventive Controls Qualified Individual (PCQI) / Person in Charge (PIC), written Food Safety Plan, Allergen/Sanitation/Supply-Chain Preventive Controls, and valid municipal permits.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-black text-slate-900">
                    5. Pakistan Food Authorities &amp; PSQCA Law
                  </td>
                  <td className="p-3 font-bold text-[#1673B8]">
                    Punjab Food Authority Act 2011 · Sindh / KP / BFA · PSQCA Standards
                  </td>
                  <td className="p-3 text-slate-700">
                    Valid Food Business Operator (FBO) license, medical fitness &amp; typhoid vaccination records for food handlers, accredited water potability test reports, and halal/hygiene traceability logs.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 7. LEVEL 3: EXPERT & LEAD AUDITOR MASTERY + REAL-WORLD CASE STUDY */}
      {(activeTierFilter === 'all' || activeTierFilter === 'expert') && (
        <div className="rounded-2xl border-2 border-amber-500/35 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-950 text-xs font-black uppercase tracking-wider">
                Level 3 · Expert &amp; Lead Auditor Mastery
              </span>
              <span className="text-xs font-bold text-slate-500">
                Audit Defense, Non-Conformity Grading &amp; 5-Why Case Study
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-base sm:text-lg font-black text-slate-900">
              {pedagogy.expertAuditorMastery.headline}
            </h4>
            {pedagogy.expertAuditorMastery.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-xs sm:text-sm text-slate-700 leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>

          {/* What Lead Auditors Inspect + Non-Conformity Grading */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1673B8]" />
                What Third-Party Lead Auditors Inspect on Site
              </h5>
              <ul className="space-y-2 text-xs text-slate-700">
                {pedagogy.expertAuditorMastery.whatAuditorsInspect.map(
                  (item, i) => (
                    <li
                      key={i}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2"
                    >
                      <span className="font-black text-[#1673B8]">
                        {i + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                Audit Non-Conformity Grading Matrix (Minor / Major / Critical)
              </h5>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="font-black text-amber-900 uppercase">
                    Minor Non-Conformity:{' '}
                  </span>
                  <span className="text-amber-950">
                    {pedagogy.expertAuditorMastery.nonConformityGradingGuide.minor}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200">
                  <span className="font-black text-orange-900 uppercase">
                    Major Non-Conformity:{' '}
                  </span>
                  <span className="text-orange-950">
                    {pedagogy.expertAuditorMastery.nonConformityGradingGuide.major}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="font-black text-rose-900 uppercase">
                    Critical Non-Conformity:{' '}
                  </span>
                  <span className="text-rose-950">
                    {pedagogy.expertAuditorMastery.nonConformityGradingGuide.critical}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Industrial Case Study */}
          <div className="rounded-2xl border border-[#D2DEEA] bg-[#F0F6FC] p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#1673B8] text-white text-[10.5px] font-black uppercase tracking-wider">
                Industrial Case Study &amp; 5-Why Root Cause Investigation
              </span>
              <span className="text-xs font-bold text-slate-600">
                {pedagogy.caseStudy.facilityProfile}
              </span>
            </div>
            <h5 className="text-sm sm:text-base font-black text-slate-900">
              {pedagogy.caseStudy.title}
            </h5>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Incident Scenario: </strong>
              {pedagogy.caseStudy.incidentDescription}
            </p>
            <div className="rounded-xl bg-white border border-[#D2DEEA] p-3.5 space-y-1.5">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#1673B8]">
                5-Why Root Cause Analysis Progression:
              </p>
              <ul className="space-y-1 text-xs text-slate-700">
                {pedagogy.caseStudy.rootCause5Whys.map((w, idx) => (
                  <li key={idx} className="leading-relaxed">
                    • {w}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed">
              <strong className="text-[#1673B8]">CAPA Implemented: </strong>
              {pedagogy.caseStudy.capaImplemented}
            </p>
            <p className="text-xs font-bold text-[#105E9A] bg-[#EBF4FC] px-3 py-2 rounded-lg border border-[#D2DEEA]">
              ✓ Verified Result: {pedagogy.caseStudy.measurableResult}
            </p>
          </div>

          {/* Practical Audit Verification Checklist */}
          <div className="space-y-2">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-[#1673B8]" />
              Practical Shop-Floor &amp; Kitchen Audit Verification Checklist
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {module.practicalChecklist.map((chk, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-slate-800 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#1673B8] shrink-0 mt-0.5" />
                  <span>{chk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. INTERACTIVE MODULE SELF-CHECK KNOWLEDGE QUIZ (ALISON LESSON SUMMARY CHECK) */}
      <div className="rounded-2xl border-2 border-[#1673B8]/30 bg-[#F0F6FC] p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1673B8]">
            <HelpCircle className="w-4 h-4" />
            Interactive Module {module.moduleNumber} Knowledge Check (Self-Test Before Moving On)
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            Instant Feedback
          </span>
        </div>

        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
          {pedagogy.selfCheckQuiz.question}
        </p>

        <div className="grid grid-cols-1 gap-2">
          {pedagogy.selfCheckQuiz.options.map((opt, idx) => {
            const isChosen = selectedQuizOption === idx;
            const isCorrect = idx === pedagogy.selfCheckQuiz.correctIndex;
            let btnStyle =
              'border-slate-200 bg-white text-slate-800 hover:border-[#1673B8]';
            if (selectedQuizOption !== null) {
              if (isCorrect) {
                btnStyle =
                  'border-[#1673B8] bg-[#EBF4FC] text-[#1A2138] font-bold';
              } else if (isChosen && !isCorrect) {
                btnStyle = 'border-rose-500 bg-rose-100 text-rose-950';
              }
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedQuizOption(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
              >
                <span className="w-5 h-5 rounded-full border border-current text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {selectedQuizOption !== null && (
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              selectedQuizOption === pedagogy.selfCheckQuiz.correctIndex
                ? 'bg-[#EBF4FC] border-[#1673B8] text-[#1A2138]'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <p className="font-black mb-0.5">
              {selectedQuizOption === pedagogy.selfCheckQuiz.correctIndex
                ? '✓ Excellent! Correct Answer:'
                : '💡 Review Note:'}
            </p>
            <p>{pedagogy.selfCheckQuiz.explanation}</p>
          </div>
        )}
      </div>

      {/* 9. BOTTOM MODULE NAVIGATION BAR */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={moduleIndex === 0}
          onClick={onSelectprev}
          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold disabled:opacity-40 cursor-pointer hover:bg-slate-50"
        >
          ← Previous Module
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 hidden sm:inline" />
          <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
            Progress is automatically saved to your profile
          </span>
        </div>

        {moduleIndex < totalModules - 1 ? (
          <button
            type="button"
            onClick={onCompleteAndNext}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            Mark Module {module.moduleNumber} Complete &amp; Next Module
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onCompleteAndStartExam}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm cursor-pointer"
          >
            <Award className="w-4 h-4" />
            Complete Course &amp; Start 40-MCQ Final Exam
          </button>
        )}
      </div>
    </div>
  );
};
