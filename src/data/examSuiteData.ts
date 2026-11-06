import { ALL_2000_EXAM_MCQS } from './questionBank2000';

export type ExamDifficulty = 'Easy' | 'Medium' | 'Hard';
export type OptionLetter = 'A' | 'B' | 'C' | 'D';

export interface SuiteExamQuestion {
  id: string;
  questionNumber: number; // 1 to 30 within the attempt
  category: string;
  subcategory: string;
  difficulty: ExamDifficulty;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: OptionLetter;
  explanation: string;
  reference: string;
}

export interface ExamAnswerRecord {
  questionId: string;
  questionNumber: number;
  category: string;
  difficulty: ExamDifficulty;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  userAnswer: OptionLetter | null; // null if skipped
  correctAnswer: OptionLetter;
  isCorrect: boolean;
  isFlagged: boolean;
  explanation: string;
  reference: string;
}

export interface SuiteExamResult {
  examId: string;
  title: string;
  date: string;
  dateFormatted: string;
  category: string;
  mode: 'Mock' | 'Category' | 'Practice' | 'DailyQuiz' | 'WrongRetry';
  totalQuestions: number;
  correct: number;
  wrong: number;
  skipped: number;
  scorePercent: number;
  timeTakenSeconds: number;
  timeTakenFormatted: string;
  status: 'PASS' | 'FAIL';
  certificateId: string;
  answers: ExamAnswerRecord[];
}

export interface ExamCategoryMeta {
  id: string;
  name: string;
  iconKey:
    | 'shield'
    | 'haccp'
    | 'fssc'
    | 'audit'
    | 'micro'
    | 'chem'
    | 'tech'
    | 'quality'
    | 'law'
    | 'nutrition'
    | 'preserve'
    | 'package'
    | 'gmp'
    | 'iso'
    | 'allergen'
    | 'pest'
    | 'hygiene';
  isPrimaryGrid: boolean;
  defaultAccuracyPct: number;
  description: string;
}

export const EXAM_CATEGORIES_LIST: ExamCategoryMeta[] = [
  // Primary 6 Categories shown on Exam Dashboard 2-Column Grid (Matching Image 1)
  {
    id: 'Food Safety',
    name: 'Food Safety',
    iconKey: 'shield',
    isPrimaryGrid: true,
    defaultAccuracyPct: 80,
    description: 'Cross-contamination, temperature danger zone, CCPs & hygiene controls'
  },
  {
    id: 'HACCP',
    name: 'HACCP',
    iconKey: 'haccp',
    isPrimaryGrid: true,
    defaultAccuracyPct: 70,
    description: '7 Principles, 12 Codex steps, hazard analysis, critical limits & corrective actions'
  },
  {
    id: 'FSSC 22000',
    name: 'FSSC 22000',
    iconKey: 'fssc',
    isPrimaryGrid: true,
    defaultAccuracyPct: 60,
    description: 'FSSC 22000 Version 6 additional requirements, TACCP, VACCP & ISO/TS 22002-1'
  },
  {
    id: 'Auditing',
    name: 'Auditing',
    iconKey: 'audit',
    isPrimaryGrid: true,
    defaultAccuracyPct: 60,
    description: 'ISO 19011 auditing principles, NCR grading, CAPA, root cause & audit evidence'
  },
  {
    id: 'Microbiology',
    name: 'Microbiology',
    iconKey: 'micro',
    isPrimaryGrid: true,
    defaultAccuracyPct: 65,
    description: 'Salmonella, Listeria, E. coli O157:H7, Clostridium botulinum, D/Z values & Aw'
  },
  {
    id: 'Food Chemistry',
    name: 'Food Chemistry',
    iconKey: 'chem',
    isPrimaryGrid: true,
    defaultAccuracyPct: 69,
    description: 'Maillard reaction, lipid oxidation, pH, moisture, proximate analysis & enzymes'
  },
  // Extra 11 Categories (Shown when clicking See all / Categories tab)
  {
    id: 'Food Technology',
    name: 'Food Technology',
    iconKey: 'tech',
    isPrimaryGrid: false,
    defaultAccuracyPct: 72,
    description: 'UHT, pasteurization, extrusion, homogenization, milling & dairy/meat processing'
  },
  {
    id: 'Quality Management',
    name: 'Quality Management',
    iconKey: 'quality',
    isPrimaryGrid: false,
    defaultAccuracyPct: 74,
    description: 'ISO 9001:2015, PDCA cycle, SPC charts, Six Sigma, COA & traceability'
  },
  {
    id: 'Food Laws and Regulations',
    name: 'Food Laws & Regulations',
    iconKey: 'law',
    isPrimaryGrid: false,
    defaultAccuracyPct: 68,
    description: 'Codex Alimentarius, PFA, PSQCA, SFDA, Dubai Municipality, FDA FSMA & EU Food Law'
  },
  {
    id: 'Nutrition',
    name: 'Nutrition',
    iconKey: 'nutrition',
    isPrimaryGrid: false,
    defaultAccuracyPct: 78,
    description: 'Macronutrients, micronutrients, RDA, bioavailability, fortification & labeling'
  },
  {
    id: 'Food Preservation',
    name: 'Food Preservation',
    iconKey: 'preserve',
    isPrimaryGrid: false,
    defaultAccuracyPct: 71,
    description: 'Hurdle technology, thermal commercial sterility, freezing, drying & preservatives'
  },
  {
    id: 'Food Packaging',
    name: 'Food Packaging',
    iconKey: 'package',
    isPrimaryGrid: false,
    defaultAccuracyPct: 66,
    description: 'MAP packaging, aseptic cartons, WVTR/OTR barrier properties & migration testing'
  },
  {
    id: 'GMP and GHP',
    name: 'GMP and GHP',
    iconKey: 'gmp',
    isPrimaryGrid: false,
    defaultAccuracyPct: 82,
    description: 'Good Manufacturing & Hygiene Practices, zoning, CIP/COP & sanitary facility design'
  },
  {
    id: 'ISO 22000',
    name: 'ISO 22000',
    iconKey: 'iso',
    isPrimaryGrid: false,
    defaultAccuracyPct: 73,
    description: 'ISO 22000:2018 Clauses 4–10, PRPs, OPRPs, CCPs, validation & verification'
  },
  {
    id: 'Allergen Management',
    name: 'Allergen Management',
    iconKey: 'allergen',
    isPrimaryGrid: false,
    defaultAccuracyPct: 76,
    description: 'Big 9 allergens, VITAL thresholds, validated allergen cleaning & precautionary labeling'
  },
  {
    id: 'Pest Control',
    name: 'Pest Control',
    iconKey: 'pest',
    isPrimaryGrid: false,
    defaultAccuracyPct: 79,
    description: 'Integrated Pest Management (IPM), rodent bait maps, EFK insect traps & proofing'
  },
  {
    id: 'Personal Hygiene',
    name: 'Personal Hygiene',
    iconKey: 'hygiene',
    isPrimaryGrid: false,
    defaultAccuracyPct: 85,
    description: '20-second handwashing, medical screening, protective clothing, jewelry & illness reporting'
  }
];

// Curated High-Yield Real Exam Questions matching the exact examples and categories in the PRD
const CURATED_HIGH_YIELD_MCQS: Omit<SuiteExamQuestion, 'questionNumber'>[] = [
  {
    id: 'curated-exam-1',
    category: 'HACCP',
    subcategory: 'HACCP Principles',
    difficulty: 'Easy',
    questionText: 'What is the primary purpose of HACCP?',
    optionA: 'Increase production speed across all packaging lines',
    optionB: 'Identify and control food safety hazards',
    optionC: 'Reduce raw material purchasing cost',
    optionD: 'Improve sensory taste and color of food',
    correctAnswer: 'B',
    explanation:
      'HACCP systematically identifies biological, chemical, and physical hazards and controls them at Critical Control Points (CCPs). This preventive system ensures food safety before finished product release.',
    reference: 'Codex Alimentarius HACCP Principle 1 & 2'
  },
  {
    id: 'curated-exam-2',
    category: 'HACCP',
    subcategory: 'Critical Control Points',
    difficulty: 'Medium',
    questionText:
      'Which of the following is a critical control point (CCP) in the HACCP system?',
    optionA: 'Regular cleaning of food preparation surfaces',
    optionB: 'Checking food temperature during cooking',
    optionC: 'Storing cleaning chemicals in the pantry',
    optionD: 'Staff handwashing at the start of the shift',
    correctAnswer: 'B',
    explanation:
      'Cooking to a validated internal temperature (e.g., ≥74°C for poultry) is a Critical Control Point (CCP) because it directly eliminates vegetative pathogens. Cleaning, chemical storage, and handwashing are Prerequisite Programs (PRPs).',
    reference: 'HACCP Principle 2 — Determine Critical Control Points'
  },
  {
    id: 'curated-exam-3',
    category: 'HACCP',
    subcategory: 'Terminology',
    difficulty: 'Easy',
    questionText: 'What does HACCP stand for?',
    optionA: 'Hazard Analysis and Critical Control Points',
    optionB: 'Health Assessment and Contamination Control Plan',
    optionC: 'Hygienic Auditing and Chemical Control Procedure',
    optionD: 'Hazard Avoidance and Continuous Cleaning Protocol',
    correctAnswer: 'A',
    explanation:
      'HACCP stands for Hazard Analysis and Critical Control Points, an internationally recognized science-based system defined by the Codex Alimentarius Commission.',
    reference: 'Codex Alimentarius CXC 1-1969'
  },
  {
    id: 'curated-exam-4',
    category: 'FSSC 22000',
    subcategory: 'Foundation Standards',
    difficulty: 'Easy',
    questionText: 'FSSC 22000 is based on which ISO standard?',
    optionA: 'ISO 9001 only',
    optionB: 'ISO 22000',
    optionC: 'ISO 14001',
    optionD: 'ISO 45001',
    correctAnswer: 'B',
    explanation:
      'FSSC 22000 is a GFSI-benchmarked Food Safety Management System built on ISO 22000, sector-specific Technical Specifications for PRPs (ISO/TS 22002-x), and FSSC Additional Requirements.',
    reference: 'FSSC 22000 Version 6 Scheme Part 2'
  },
  {
    id: 'curated-exam-5',
    category: 'Food Safety',
    subcategory: 'Temperature Control',
    difficulty: 'Easy',
    questionText:
      'What is the internationally recognized Temperature Danger Zone in which foodborne bacteria multiply most rapidly?',
    optionA: '0°C to 4°C (32°F to 39°F)',
    optionB: '5°C to 60°C (41°F to 140°F)',
    optionC: '63°C to 100°C (145°F to 212°F)',
    optionD: '-18°C to 0°C (0°F to 32°F)',
    correctAnswer: 'B',
    explanation:
      'Pathogenic mesophilic bacteria multiply rapidly between 5°C and 60°C. Cold TCS foods must be held at ≤4°C and hot foods must be maintained at ≥60°C (or ≥63°C per Gulf/UK codes).',
    reference: 'FDA Food Code / Gulf GSO Hygiene Regulations'
  },
  {
    id: 'curated-exam-6',
    category: 'Auditing',
    subcategory: 'ISO 19011 Auditing',
    difficulty: 'Medium',
    questionText:
      'During a third-party FSSC 22000 audit, a complete breakdown of a CCP monitoring system with unsafe product released is classified as:',
    optionA: 'Minor Non-Conformity',
    optionB: 'Opportunity for Improvement (OFI)',
    optionC: 'Critical Non-Conformity',
    optionD: 'Observation Note',
    correctAnswer: 'C',
    explanation:
      'A Critical Non-Conformity is issued when there is a direct food safety impact without corrective action or when legality/certification integrity is compromised, leading to immediate certificate suspension.',
    reference: 'FSSC 22000 Version 6 Part 3 & ISO 19011'
  },
  {
    id: 'curated-exam-7',
    category: 'Microbiology',
    subcategory: 'Pathogen Limits',
    difficulty: 'Hard',
    questionText:
      'What is the minimum water activity (Aw) required for the growth and toxin production of Clostridium botulinum Type A?',
    optionA: '0.60',
    optionB: '0.85',
    optionC: '0.93',
    optionD: '0.99',
    correctAnswer: 'C',
    explanation:
      'Proteolytic Clostridium botulinum (Types A, B, F) cannot grow or produce neurotoxin below a water activity (Aw) of 0.93 or a pH below 4.6.',
    reference: 'ICMSF Microbiological Specifications & FDA BAM'
  },
  {
    id: 'curated-exam-8',
    category: 'Food Chemistry',
    subcategory: 'Browning Reactions',
    difficulty: 'Medium',
    questionText:
      'The non-enzymatic Maillard browning reaction in baked and roasted foods occurs between which two chemical groups?',
    optionA: 'Triglycerides and free fatty acids',
    optionB: 'Reducing sugars and free amino groups of proteins',
    optionC: 'Polyphenols and polyphenol oxidase enzyme',
    optionD: 'Ascorbic acid and dissolved oxygen',
    correctAnswer: 'B',
    explanation:
      'Maillard browning is a chemical reaction between the carbonyl group of a reducing sugar and the nucleophilic amino group of an amino acid, forming melanoidin pigments and aroma compounds.',
    reference: 'Fennema’s Food Chemistry — Carbohydrate Reactions'
  }
];

function mapCategoryFromUnifiedSubject(subj: string, idx: number): string {
  const s = subj.toLowerCase();
  if (s.includes('haccp')) return 'HACCP';
  if (s.includes('fssc')) return 'FSSC 22000';
  if (s.includes('iso 22000')) return idx % 2 === 0 ? 'ISO 22000' : 'Auditing';
  if (s.includes('iso 9001')) return idx % 2 === 0 ? 'Quality Management' : 'Auditing';
  if (s.includes('micro')) return 'Microbiology';
  if (s.includes('chem')) {
    return idx % 3 === 0 ? 'Nutrition' : 'Food Chemistry';
  }
  if (s.includes('science')) {
    const rot = [
      'Food Technology',
      'Food Preservation',
      'Food Packaging',
      'Food Laws and Regulations'
    ];
    return rot[idx % rot.length];
  }
  const safetyRot = [
    'Food Safety',
    'GMP and GHP',
    'Allergen Management',
    'Pest Control',
    'Personal Hygiene'
  ];
  return safetyRot[idx % safetyRot.length];
}

function getStandardReferenceForCategory(category: string, idx: number): string {
  const map: Record<string, string[]> = {
    'Food Safety': [
      'Codex Alimentarius CXC 1-1969 Sec 5',
      'PFA / Gulf GSO Food Hygiene Regulation',
      'FDA Food Code Chapter 3 — TCS Controls'
    ],
    HACCP: [
      'HACCP Principle 2 — Critical Control Points',
      'HACCP Principle 3 — Critical Limits',
      'HACCP Principle 4 & 5 — Monitoring & Corrective Action'
    ],
    'FSSC 22000': [
      'FSSC 22000 v6 Additional Requirement 2.5.4 (Food Defense)',
      'FSSC 22000 v6 Additional Requirement 2.5.6 (Allergens)',
      'ISO/TS 22002-1 Clause 10 — Cross-Contamination'
    ],
    Auditing: [
      'ISO 19011:2018 Clause 6.4 — Conducting Audit',
      'ISO 22000:2018 Clause 9.2 — Internal Audit',
      'ISO 17021-1 Conformity Assessment'
    ],
    Microbiology: [
      'ICMSF Microorganisms in Foods Book 8',
      'ISO 6579-1 Salmonella Detection Method',
      'BAM Chapter 10 — Listeria monocytogenes'
    ],
    'Food Chemistry': [
      'AOAC Official Methods of Analysis',
      'Fennema’s Food Chemistry 5th Ed.',
      'Codex GSFA Food Additives Standard 192-1995'
    ]
  };
  const list = map[category] || [
    'ISO 22000:2018 Clause 8.5',
    'Codex Alimentarius General Principles of Food Hygiene',
    'PSQCA / SFDA Food Safety Standard'
  ];
  return list[idx % list.length];
}

/**
 * Dynamically draws 30 unique, non-repeating MCQs (or custom count for Daily Quiz)
 * with randomized option order (A, B, C, D shuffled every attempt) so the user
 * never sees the same sequence twice and the 2,000-question bank is never dumped on screen.
 */
export function draw30ExamSuiteQuestions(options: {
  category?: string; // 'All' or specific category
  difficulty?: 'All' | ExamDifficulty;
  seenQuestionIds?: string[];
  onlyQuestionIds?: string[]; // For Wrong Questions Retry or Bookmarks
  searchKeyword?: string;
  count?: number;
}): {
  questions: SuiteExamQuestion[];
  nextSeenIds: string[];
} {
  const {
    category = 'All',
    difficulty = 'All',
    seenQuestionIds = [],
    onlyQuestionIds,
    searchKeyword = '',
    count = 30
  } = options;

  const seenSet = new Set(seenQuestionIds);
  const onlySet = onlyQuestionIds ? new Set(onlyQuestionIds) : null;

  // Build candidate pool from Curated + 2,000 Master Bank
  const fullPool: Omit<SuiteExamQuestion, 'questionNumber'>[] = [
    ...CURATED_HIGH_YIELD_MCQS
  ];

  ALL_2000_EXAM_MCQS.forEach((q, idx) => {
    const mappedCat = mapCategoryFromUnifiedSubject(q.subject, idx);
    const diffList: ExamDifficulty[] = ['Easy', 'Medium', 'Hard'];
    const diff = diffList[idx % 3];
    const letters: OptionLetter[] = ['A', 'B', 'C', 'D'];
    const correctLetter = letters[q.correctAnswerIndex] || 'B';

    fullPool.push({
      id: q.id,
      category: mappedCat,
      subcategory: q.subject,
      difficulty: diff,
      questionText: q.question.replace(/^\[[^\]]+\]\s*/, '').trim(),
      optionA: q.options[0] || 'Option A',
      optionB: q.options[1] || 'Option B',
      optionC: q.options[2] || 'Option C',
      optionD: q.options[3] || 'Option D',
      correctAnswer: correctLetter,
      explanation: q.explanation,
      reference: getStandardReferenceForCategory(mappedCat, idx)
    });
  });

  // Filter pool
  let filtered = fullPool.filter((item) => {
    if (onlySet && !onlySet.has(item.id)) return false;
    if (
      category &&
      category !== 'All' &&
      item.category.toLowerCase() !== category.toLowerCase() &&
      !item.subcategory.toLowerCase().includes(category.toLowerCase())
    ) {
      return false;
    }
    if (difficulty && difficulty !== 'All' && item.difficulty !== difficulty) {
      return false;
    }
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      if (
        !item.questionText.toLowerCase().includes(kw) &&
        !item.category.toLowerCase().includes(kw) &&
        !item.explanation.toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    return true;
  });

  if (filtered.length < count) {
    // Fallback to full pool if strict filter had fewer than 30
    filtered = fullPool;
  }

  // Separate into unseen vs seen so every attempt serves 30 different MCQs
  const unseen = filtered.filter((q) => !seenSet.has(q.id));
  const seen = filtered.filter((q) => seenSet.has(q.id));

  // Fisher-Yates shuffle unseen
  const shuffledUnseen = [...unseen];
  for (let i = shuffledUnseen.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledUnseen[i], shuffledUnseen[j]] = [
      shuffledUnseen[j],
      shuffledUnseen[i]
    ];
  }

  const selectedRaw = [...shuffledUnseen, ...seen].slice(0, count);

  // Shuffle options A, B, C, D randomly for each selected question
  const letters: OptionLetter[] = ['A', 'B', 'C', 'D'];
  const finalQuestions: SuiteExamQuestion[] = selectedRaw.map((raw, idx) => {
    const origPairs: { letter: OptionLetter; text: string }[] = [
      { letter: 'A', text: raw.optionA },
      { letter: 'B', text: raw.optionB },
      { letter: 'C', text: raw.optionC },
      { letter: 'D', text: raw.optionD }
    ];
    const correctText =
      origPairs.find((p) => p.letter === raw.correctAnswer)?.text ||
      raw.optionB;

    // Shuffle the 4 option texts
    const shuffledTexts = origPairs.map((p) => p.text);
    for (let i = shuffledTexts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTexts[i], shuffledTexts[j]] = [
        shuffledTexts[j],
        shuffledTexts[i]
      ];
    }

    const newCorrectIdx = Math.max(0, shuffledTexts.indexOf(correctText));
    const newCorrectLetter = letters[newCorrectIdx] || 'B';

    return {
      ...raw,
      questionNumber: idx + 1,
      optionA: shuffledTexts[0],
      optionB: shuffledTexts[1],
      optionC: shuffledTexts[2],
      optionD: shuffledTexts[3],
      correctAnswer: newCorrectLetter
    };
  });

  const nextSeenIds = Array.from(
    new Set([...seenQuestionIds, ...finalQuestions.map((q) => q.id)])
  );

  return {
    questions: finalQuestions,
    nextSeenIds
  };
}

export const LEADERBOARD_TOP_10_WEEKLY = [
  { rank: 1, name: 'Dr. Ayesha Siddiqui', role: 'Lead FSMS Auditor', scorePct: 97, examsCount: 14, badge: '🏆 Gold Auditor' },
  { rank: 2, name: 'Engr. Bilal Tariq', role: 'QA Manager (Gulf Dairy)', scorePct: 94, examsCount: 12, badge: '🥈 Silver Specialist' },
  { rank: 3, name: 'Muneeb Ahmad Khan', role: 'Food Safety Specialist', scorePct: 92, examsCount: 11, badge: '🥉 Bronze Specialist' },
  { rank: 4, name: 'Sana Fatima', role: 'HACCP Coordinator', scorePct: 90, examsCount: 9, badge: '⭐ Top 5%' },
  { rank: 5, name: 'Usman Ghani', role: 'Microbiology Lead', scorePct: 88, examsCount: 10, badge: '⭐ Top 5%' },
  { rank: 6, name: 'Zainab Raza', role: 'FSSC 22000 Consultant', scorePct: 87, examsCount: 8, badge: '✓ Verified' },
  { rank: 7, name: 'Hamza Sheikh', role: 'Food Technologist', scorePct: 85, examsCount: 7, badge: '✓ Verified' },
  { rank: 8, name: 'Nadia Karim', role: 'R&D Scientist', scorePct: 83, examsCount: 6, badge: '✓ Verified' },
  { rank: 9, name: 'Fahad Mehmood', role: 'Regulatory Officer', scorePct: 81, examsCount: 6, badge: '✓ Verified' },
  { rank: 10, name: 'Hira Noor', role: 'Quality Analyst', scorePct: 80, examsCount: 5, badge: '✓ Verified' }
];
