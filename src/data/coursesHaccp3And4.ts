import { HubTraining } from '../types/hub';
import {
  CourseExamMCQ,
  InternationalTrainingCourse
} from './internationalTrainingsData';
import { INTRODUCTION_TO_HACCP_COURSE } from './introToHaccpCourse';

export interface RawSlideCourseInput {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: string;
  level: string;
  durationHours: number;
  totalModules: number;
  examQuestionsCount: number;
  passingScorePercent: number;
  certificateTitle: string;
  accreditationStandard: string;
  targetAudience: string[];
  overview: string;
  learningOutcomes: string[];
  modules: Array<{
    moduleNumber: number;
    title: string;
    estimatedMinutes: number;
    learningObjectives: string[];
    summary: string;
    keyTakeaways: string[];
    practiceScenario: string;
    presentationSlides: Array<{
      slideNumber: number;
      title: string;
      subtitle: string;
      bullets: string[];
      Example?: string;
      keyPoint: string;
    }>;
    sections?: unknown[];
    quiz?: unknown[];
  }>;
}

// ============================================================================
// CHALLENGING TECHNICAL MCQ SYNTHESIZER FOR ALL 13 INTERNATIONAL COURSES
// Ensures every MCQ has:
// 1. A distinct, scenario/audit-grade question stem (no repetitive phrasing)
// 2. 4 realistic, domain-specific technical options of comparable length
// 3. Subtle parameter/threshold/role mutations & cross-slide technical distractors
// 4. Deterministic shuffling across A (0), B (1), C (2), and D (3)
// ============================================================================

function sanitizeMcqLabel(text: string): string {
  return (text || '')
    .replace(
      /What Makes HACCP Level 0?4 Different from Level 0?3\??/gi,
      'Key Managerial Responsibilities in HACCP System Design'
    )
    .replace(/\bHACCP\s+Level\s+0?[1-4]\b/gi, 'HACCP')
    .replace(/\bFood\s+Safety\s+Level\s+0?[1-4]\b/gi, 'Food Safety')
    .replace(/\ba\s+Level\s+0?[1-4]\s+Food\s+Safety\s+Supervisor\b/gi, 'a Food Safety Supervisor')
    .replace(/\bfor\s+Level\s+0?[1-4]\s+Managers\b/gi, 'for Food Safety Managers')
    .replace(/\bLevel\s+0?[1-4]\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\(\s*\)/g, '')
    .trim();
}

const QUESTION_STEM_TEMPLATES: Array<(modTitle: string, topic: string) => string> = [
  (mod, topic) =>
    `During an internal compliance audit of ${mod}, which technical criterion governs "${topic}"?`,
  (mod, topic) =>
    `When evaluating operational compliance for "${topic}" in ${mod}, which control measure must be verified first?`,
  (_mod, topic) =>
    `A quality supervisor reviewing "${topic}" identifies a process deviation. Which standard protocol applies?`,
  (mod, topic) =>
    `Which technical specification defines the mandatory requirement for "${topic}" within ${mod}?`,
  (_mod, topic) =>
    `In an operational assessment of "${topic}", which objective evidence demonstrates effective implementation?`,
  (mod, topic) =>
    `What is the primary operational requirement when executing "${topic}" in ${mod}?`,
  (mod, topic) =>
    `When validating "${topic}" during ${mod}, which technical procedure is mandatory?`,
  (_mod, topic) =>
    `How must the technical team manage "${topic}" to maintain strict compliance and process control?`,
  (mod, topic) =>
    `During a management review of ${mod}, how is conformance for "${topic}" verified?`,
  (mod, topic) =>
    `Which operational control directly satisfies the technical requirement for "${topic}" in ${mod}?`
];

// Mutates numbers, temperatures, durations, percentages, or technical qualifiers in a statement
// to create a close, realistic, challenging technical distractor of equal length and style.
function buildCloseParameterDistractor(baseText: string, topic: string, seed: number): string {
  let mutated = baseText;
  let changed = false;

  // 1. Mutate temperatures (°C)
  mutated = mutated.replace(/(\d+)\s*°C/g, (_match, numStr) => {
    changed = true;
    const n = parseInt(numStr, 10);
    const delta = seed % 2 === 0 ? 12 : -11;
    const nextVal = Math.max(1, n + delta);
    return `${nextVal}°C`;
  });

  // 2. Mutate percentages (%)
  mutated = mutated.replace(/(\d+)\s*%/g, (_match, numStr) => {
    changed = true;
    const n = parseInt(numStr, 10);
    const nextVal = n >= 80 ? n - 25 : n + 20;
    return `${nextVal}%`;
  });

  // 3. Mutate durations (seconds / minutes / hours / days / months / years)
  mutated = mutated.replace(
    /(\d+)\s*(seconds|second|minutes|minute|hours|hour|days|day|months|month|years|year)/gi,
    (_match, numStr, unit) => {
      changed = true;
      const n = parseInt(numStr, 10);
      const nextVal = n <= 2 ? n + 4 : n <= 15 ? n * 2 : Math.max(1, Math.round(n * 0.5));
      return `${nextVal} ${unit}`;
    }
  );

  // 4. Mutate key technical authority / verification terms if no numeric values were present
  if (!changed) {
    if (/before|prior to/i.test(mutated)) {
      mutated = mutated.replace(/before|prior to/i, 'within 30 days after completing');
      changed = true;
    } else if (/daily|every shift|continuous/i.test(mutated)) {
      mutated = mutated.replace(/daily|every shift|continuous/i, 'on a quarterly rotational basis');
      changed = true;
    } else if (/mandatory|must|required/i.test(mutated)) {
      mutated = mutated.replace(/mandatory|must|required/i, 'recommended as an optional guideline');
      changed = true;
    }
  }

  if (changed && mutated.trim().toLowerCase() !== baseText.trim().toLowerCase()) {
    return mutated;
  }

  // Fallback high-precision technical parameter distractor tailored to the exact topic
  const parameterFallbacks = [
    `Record "${topic}" parameters at the end of each monthly cycle and archive them solely for retrospective reference.`,
    `Delegate "${topic}" verification solely to external third-party contractors during biennial surveillance reviews.`,
    `Classify "${topic}" as an advisory prerequisite observation that does not require formal root-cause corrective action.`,
    `Approve "${topic}" compliance using retrospective batch release sampling in place of real-time process monitoring.`
  ];
  return parameterFallbacks[seed % parameterFallbacks.length];
}

// 40 distinct, realistic, audit-grade technical distractors (indexed 0..39 so every question gets a unique one)
function buildAuditDistractorForIndex(topic: string, modTitle: string, qIdx: number): string {
  const templates: Array<(t: string, m: string) => string> = [
    (t, _m) => `Rely on end-product lot sampling instead of continuous in-line process monitoring for "${t}" during routine production.`,
    (t, m) => `Authorize shift operators in ${m} to close non-conformances on "${t}" without independent QA verification.`,
    (t, _m) => `Release affected production lots under conditional concession prior to completing the "${t}" evaluation.`,
    (t, m) => `Treat "${t}" in ${m} as a voluntary guidance note rather than an auditable compliance requirement.`,
    (t, _m) => `Adjust the established specification limits for "${t}" during peak production runs without formal technical re-validation.`,
    (t, m) => `Consolidate "${t}" monitoring logs at the conclusion of each quarter in ${m} instead of real-time recording.`,
    (t, _m) => `Apply a generic facility checklist to "${t}" in place of a hazard-specific technical risk assessment.`,
    (t, m) => `Defer quarantine of non-conforming items from "${t}" until the scheduled annual ${m} management review.`,
    (t, _m) => `Substitute uncalibrated visual estimation for verified instrument measurement when executing "${t}" on the floor.`,
    (t, m) => `Accept supplier self-declarations for "${t}" in ${m} without empirical Certificate of Analysis (COA) verification.`,
    (t, _m) => `Restrict "${t}" documentation to external certification audits while omitting routine internal verification checks.`,
    (t, m) => `Allow temporary bypass of "${t}" controls in ${m} up to 4 hours per shift provided line output targets are met.`,
    (t, _m) => `Validate "${t}" once during initial commissioning without periodic re-verification or change-triggered technical review.`,
    (t, m) => `Transfer primary accountability for "${t}" in ${m} exclusively to warehouse dispatch personnel after packaging.`,
    (t, _m) => `Classify deviations in "${t}" as minor observations that only require informal verbal notification.`,
    (t, m) => `Perform corrective adjustments on "${t}" in ${m} retroactively after product dispatch to distribution centers.`,
    (t, _m) => `Evaluate "${t}" using historical industry averages rather than site-specific empirical validation data.`,
    (t, m) => `Maintain "${t}" operational records in ${m} for a maximum of 14 days regardless of product shelf-life duration.`,
    (t, _m) => `Combine "${t}" verification with routine housekeeping inspections to eliminate dedicated operational control logs.`,
    (t, m) => `Approve process modifications affecting "${t}" in ${m} verbally before updating the controlled hazard analysis.`,
    (t, _m) => `Limit "${t}" competency assessments to newly hired staff while exempting experienced senior supervisors.`,
    (t, m) => `Conduct "${t}" calibration checks in ${m} only after a customer complaint or regulatory rejection occurs.`,
    (t, _m) => `Downgrade "${t}" from a critical operational control to a routine maintenance task during system updates.`,
    (t, m) => `Record "${t}" compliance in ${m} using pre-printed shift averages rather than actual time-stamped measurements.`,
    (t, _m) => `Permit re-processing of quarantined stock from "${t}" without QA Manager sign-off or batch traceability logging.`,
    (t, m) => `Exclude sub-contracted processes and night-shift operations from the "${t}" scope within ${m}.`,
    (t, _m) => `Verify "${t}" effectiveness solely through annual financial performance metrics rather than objective audit evidence.`,
    (t, m) => `Use unverified third-party templates for "${t}" in ${m} without on-site flow diagram confirmation.`,
    (t, _m) => `Close "${t}" corrective action requests immediately upon containment before investigating the underlying root cause.`,
    (t, m) => `Store "${t}" reference standards and controlled documents in ${m} without version control or change history.`,
    (t, _m) => `Sample only the first batch of the week for "${t}" to represent full continuous process compliance.`,
    (t, m) => `Waive "${t}" verification requirements in ${m} whenever raw materials originate from domestic suppliers.`,
    (t, _m) => `Assign the same operator who performs "${t}" monitoring to conduct the independent internal audit of that step.`,
    (t, m) => `Replace documented "${t}" standard operating procedures in ${m} with informal peer-to-peer shift briefings.`,
    (t, _m) => `Calculate "${t}" compliance scores by excluding peak-season deviations from the official compliance trend analysis.`,
    (t, m) => `Implement "${t}" controls in ${m} only for export batches while exempting domestic production runs.`,
    (t, _m) => `Archive "${t}" non-conformance reports separately from the formal management review input package.`,
    (t, m) => `Extend the allowable tolerance range for "${t}" in ${m} by 25% when ambient facility humidity increases.`,
    (t, _m) => `Complete "${t}" sign-off logs at the start of the shift based on projected operating parameters.`,
    (t, m) => `Verify "${t}" trace recall readiness in ${m} through tabletop discussion without timed physical stock reconciliation.`
  ];
  return templates[qIdx % templates.length](topic, modTitle);
}

function cleanSlideStatement(text: string | undefined, fallback: string): string {
  if (!text) return fallback;
  const cleaned = text.trim();
  if (/congratulations|proceed to the 40-mcq|passing mark/i.test(cleaned)) {
    return fallback;
  }
  return cleaned;
}

export function normalizeRawSlideCourse(
  raw: RawSlideCourseInput
): InternationalTrainingCourse {
  const totalSlides = raw.modules.reduce(
    (sum, m) => sum + m.presentationSlides.length,
    0
  );

  // Collect all valid slide keyPoints and bullets across the entire course for cross-slide technical distractors
  const allSlidesFlat: Array<{
    modNumber: number;
    modTitle: string;
    slideNumber: number;
    title: string;
    subtitle: string;
    keyPoint: string;
    bullets: string[];
    example?: string;
  }> = [];

  for (const mod of raw.modules) {
    const cleanModTitle = mod.title.replace(/^Module\s*0?\d+:\s*/i, '');
    for (const slide of mod.presentationSlides) {
      const validBullets = (slide.bullets || []).filter(
        (b) => b && !/congratulations|proceed to the 40-mcq/i.test(b)
      );
      const primaryPoint = cleanSlideStatement(
        slide.keyPoint,
        validBullets[0] || mod.keyTakeaways[0] || mod.summary
      );
      allSlidesFlat.push({
        modNumber: mod.moduleNumber,
        modTitle: cleanModTitle,
        slideNumber: slide.slideNumber,
        title: slide.title,
        subtitle: slide.subtitle,
        keyPoint: primaryPoint,
        bullets: validBullets,
        example: slide.Example
      });
    }
  }

  const coreExamPool: InternationalTrainingCourse['coreExamPool'] = [];

  allSlidesFlat.forEach((sl, idx) => {
    const cleanMod = sanitizeMcqLabel(sl.modTitle);
    const cleanTopic = sanitizeMcqLabel(sl.title);
    const useBullet = idx % 2 === 1 && sl.bullets.length > 0;
    const correctStatement = useBullet ? sl.bullets[0] : sl.keyPoint;
    const altSourceForMutation =
      sl.bullets.length > 1
        ? sl.bullets[1]
        : sl.example || sl.keyPoint;

    // Distractor 1: Close parameter / threshold / frequency mutation of a real statement from this slide
    const distractor1 = buildCloseParameterDistractor(
      altSourceForMutation,
      cleanTopic,
      idx + 3
    );

    // Distractor 2: Unique audit/operational misconception tailored to this slide's topic
    const distractor2 = buildAuditDistractorForIndex(
      cleanTopic,
      cleanMod,
      idx
    );

    // Distractor 3: Cross-module/slide technical requirement modified with an incompatible scope/condition
    const peerSlide = allSlidesFlat[(idx + 7) % allSlidesFlat.length];
    const peerBase = peerSlide.bullets[0] || peerSlide.keyPoint;
    const distractor3 = buildCloseParameterDistractor(
      peerBase,
      cleanTopic,
      idx + 11
    );

    // Place correct answer at a deterministically varied index (0, 1, 2, or 3)
    const targetCorrectIdx = (idx * 3 + sl.modNumber) % 4;
    const distractors = [distractor1, distractor2, distractor3];
    const options: [string, string, string, string] = ['', '', '', ''];
    let dPtr = 0;
    for (let pos = 0; pos < 4; pos++) {
      if (pos === targetCorrectIdx) {
        options[pos] = correctStatement;
      } else {
        options[pos] = distractors[dPtr++];
      }
    }

    const stemFn = QUESTION_STEM_TEMPLATES[idx % QUESTION_STEM_TEMPLATES.length];
    coreExamPool.push({
      q: stemFn(cleanMod, cleanTopic),
      options,
      correctIndex: targetCorrectIdx,
      explanation: `${correctStatement}${sl.example ? ` (${sl.example})` : ''}`
    });
  });

  return {
    id: raw.id,
    code: raw.code,
    title: raw.title,
    levelBadge: `Simple Presentation Course (05 Modules · ${totalSlides} Slides · 40 MCQs · 60% Pass)`,
    accreditationStandard: raw.accreditationStandard,
    duration: `05 Presentation Modules (${totalSlides} Slides) + 40-MCQ Final Exam`,
    certificateFeeRs: 1000,
    passPercentage: raw.passingScorePercent || 60,
    distinctionPercentage: 75,
    totalExamQuestions: 40,
    description: raw.overview,
    modules: raw.modules.map((m) => ({
      id: `${raw.id}-mod-${m.moduleNumber}`,
      moduleNumber: m.moduleNumber,
      title: m.title.replace(/^Module\s*0?\d+:\s*/i, ''),
      estimatedMinutes: m.estimatedMinutes,
      overview: m.summary,
      internationalClauses: [raw.accreditationStandard],
      keyPrinciples: [...m.keyTakeaways, ...m.learningObjectives],
      criticalControlParameters: m.presentationSlides.slice(0, 3).map((sl) => ({
        parameter: sl.title,
        standardLimit: sl.keyPoint,
        correctiveProtocol: sl.Example || m.practiceScenario
      })),
      practicalChecklist: m.learningObjectives,
      presentationSlides: m.presentationSlides.map((sl) => ({
        slideNumber: sl.slideNumber,
        title: sl.title,
        subtitle: sl.subtitle,
        bulletPoints: sl.bullets,
        keyTakeaway: sl.keyPoint,
        practicalExample: sl.Example
      }))
    })),
    coreExamPool
  };
}

// Detects whether an existing MCQ has trivial/boilerplate options that need upgrading
export function hasLegacyTrivialOptions(options: string[]): boolean {
  if (!options || options.length < 4) return true;
  const trivialPattern =
    /no check|no documentation|skip all|skip standard|ignore the rule|ignore safety|never required|once every five years|once every two years|take no action|hide the record|wait until next month|television commercial|office chairs|paint the factory|destroy all raw|close the warehouse|no bins are needed/i;
  if (options.some((opt) => trivialPattern.test(opt))) return true;
  const lengths = options.map((o) => (o || '').trim().length);
  const maxLen = Math.max(...lengths);
  const minLen = Math.min(...lengths);
  // If the longest option is >3.2x the shortest option (e.g., 120 chars vs 18 chars), it's a giveaway
  return maxLen > 70 && minLen < 24;
}

// Detects both trivial options and old MCQs stamped with repeated course codes/titles (e.g., "under HACCP-L3?", "(HACCP Level 03)")
export function hasLegacyMcqFormat(mcq: {
  question?: string;
  options: string[];
}): boolean {
  if (hasLegacyTrivialOptions(mcq.options)) return true;
  const courseCodePattern =
    /\b(HACCP-L[34]|FS-L[34]|ISO-9001-AW|ISO-22000-AW|FSSC-22000-AW|ISO-14001-AW|ISO-45001-AW|BRCGS-9-AW|MS-OFFICE|ENG-PROF|CDM-2026)\b/;
  const taggedStemPattern =
    /(which technical criterion governs .* under |protocol applies\?|accredited .* assessment of|within .* \((HACCP Level|Food Safety Level|ISO |FSSC |BRCGS|Microsoft Office|Workplace English|Certified Dietary)|to maintain compliance with .* standards\?|Different from Level 03)/i;
  if (
    mcq.question &&
    (courseCodePattern.test(mcq.question) || taggedStemPattern.test(mcq.question))
  ) {
    return true;
  }
  return mcq.options.some((opt) => courseCodePattern.test(opt));
}

// Detects whether a persisted HubTraining record (e.g., from Firestore) holds stale pre-upgrade
// 5-module metadata/syllabus for visual interactive HACCP courses (cert-2026-haccp-level-03 / cert-2026-intro-haccp).
export function isLegacyHaccpVisualDoc(
  tr: {
    id?: string;
    title?: string | null;
    subType?: string | null;
    duration?: string | null;
    customModules?: Array<{ id?: string; subject?: string }>;
  },
  expectedModuleCount: number
): boolean {
  const id = tr.id || '';
  if (id !== 'cert-2026-haccp-level-03' && id !== 'cert-2026-intro-haccp') {
    return false;
  }
  const mods = tr.customModules || [];
  if (mods.length === 0 || mods.length < expectedModuleCount) return true;
  if (mods.some((m) => (m.id || '').startsWith('haccp3-mod-'))) return true;
  const sub = (tr.subType || '').toLowerCase();
  const dur = (tr.duration || '').toLowerCase();
  if (
    sub.includes('simple presentation course') ||
    sub.includes('05 modules') ||
    dur.includes('05 presentation modules') ||
    (tr.title || '').toLowerCase().includes('demo')
  ) {
    return true;
  }
  return false;
}

export function build40McqsForCourse(
  course: InternationalTrainingCourse
): CourseExamMCQ[] {
  if (course.coreExamPool && course.coreExamPool.length >= 40) {
    return course.coreExamPool.slice(0, 40).map((item, idx) => {
      const targetPos = (idx * 3 + 1) % 4;
      const correctOpt = item.options[item.correctIndex];
      const distractors = item.options.filter((_, oIdx) => oIdx !== item.correctIndex);
      const arranged: [string, string, string, string] = ['', '', '', ''];
      let dIdx = 0;
      for (let pos = 0; pos < 4; pos++) {
        arranged[pos] = pos === targetPos ? correctOpt : distractors[dIdx++];
      }
      return {
        id: `${course.id}-q-${idx + 1}`,
        questionNumber: idx + 1,
        question: item.q,
        options: arranged,
        correctIndex: targetPos,
        explanation: item.explanation
      };
    });
  }

  // Collect all slide & parameter items across the course so we can generate 40 distinct, challenging questions
  const slideEntries: Array<{
    modNumber: number;
    modTitle: string;
    topic: string;
    correctStatement: string;
    secondaryStatement: string;
    explanation: string;
  }> = [];

  for (const mod of course.modules) {
    const cleanMod = sanitizeMcqLabel(mod.title);
    if (mod.presentationSlides && mod.presentationSlides.length > 0) {
      for (const sl of mod.presentationSlides) {
        const cleanTopic = sanitizeMcqLabel(sl.title);
        const validBullets = (sl.bulletPoints || []).filter(
          (b) => b && !/congratulations|proceed to the 40-mcq/i.test(b)
        );
        const primary = cleanSlideStatement(
          sl.keyTakeaway,
          validBullets[0] || mod.keyPrinciples[0] || mod.overview
        );
        const secondary =
          validBullets[1] ||
          validBullets[0] ||
          sl.practicalExample ||
          primary;
        slideEntries.push({
          modNumber: mod.moduleNumber,
          modTitle: cleanMod,
          topic: cleanTopic,
          correctStatement:
            slideEntries.length % 2 === 1 && validBullets[0]
              ? validBullets[0]
              : primary,
          secondaryStatement: secondary,
          explanation: `${primary}${sl.practicalExample ? ` (${sl.practicalExample})` : ''}`
        });
      }
    } else {
      for (const ccp of mod.criticalControlParameters) {
        slideEntries.push({
          modNumber: mod.moduleNumber,
          modTitle: cleanMod,
          topic: sanitizeMcqLabel(ccp.parameter),
          correctStatement: `${ccp.standardLimit} — ${ccp.correctiveProtocol}`,
          secondaryStatement: ccp.correctiveProtocol,
          explanation: `${ccp.parameter}: ${ccp.standardLimit}. Corrective Action: ${ccp.correctiveProtocol}`
        });
      }
    }
  }

  const finalQuestions: CourseExamMCQ[] = [];

  // Use slideEntries to build 40 distinct, high-rigor questions
  for (let idx = 0; idx < 40; idx++) {
    const entry = slideEntries[idx % slideEntries.length];
    const peerEntry = slideEntries[(idx + 9) % slideEntries.length];

    const distractor1 = buildCloseParameterDistractor(
      entry.secondaryStatement,
      entry.topic,
      idx + 5
    );
    const distractor2 = buildAuditDistractorForIndex(
      entry.topic,
      entry.modTitle,
      idx
    );
    const distractor3 = buildCloseParameterDistractor(
      peerEntry.correctStatement,
      entry.topic,
      idx + 13
    );

    const targetCorrectIdx = (idx * 3 + entry.modNumber) % 4;
    const distractors = [distractor1, distractor2, distractor3];
    const options: [string, string, string, string] = ['', '', '', ''];
    let dPtr = 0;
    for (let pos = 0; pos < 4; pos++) {
      if (pos === targetCorrectIdx) {
        options[pos] = entry.correctStatement;
      } else {
        options[pos] = distractors[dPtr++];
      }
    }

    const stemFn = QUESTION_STEM_TEMPLATES[idx % QUESTION_STEM_TEMPLATES.length];
    finalQuestions.push({
      id: `${course.id}-q-${idx + 1}`,
      questionNumber: idx + 1,
      question: stemFn(entry.modTitle, entry.topic),
      options,
      correctIndex: targetCorrectIdx,
      explanation: entry.explanation
    });
  }

  return finalQuestions;
}

export function buildHubTrainingFromCourse(
  course: InternationalTrainingCourse
): HubTraining {
  const mcqs40 = build40McqsForCourse(course);
  return {
    id: course.id,
    category: 'International Certification',
    title: course.title,
    standardCode: course.code,
    subType: course.levelBadge,
    description: course.description,
    duration: course.duration,
    fees: 'Free Study & Exam | Rs. 1,000 Verified Certificate',
    enrollLink: '#trainings',
    isActive: true,
    customModules: course.modules.map((m) => ({
      id: m.id,
      subject: m.title,
      description: `${m.overview}\n\n${m.keyPrinciples.join('\n\n')}`
    })),
    customMcqs: mcqs40.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation
    }))
  };
}

// 1. INTRODUCTION TO HACCP (visual interactive edition) imported from ./introToHaccpCourse.ts

// ============================================================================
// 2. HACCP LEVEL 04 (MANAGING & AUDITING HACCP SYSTEMS — 05 MODULES, 40 SLIDES, 40 MCQs)
// ============================================================================
export const HACCP_LEVEL_04_COURSE: InternationalTrainingCourse = {
  id: 'cert-2026-haccp-level-04',
  code: 'HACCP-L4',
  title: 'HACCP Level 04',
  levelBadge: 'Simple Presentation Course (05 Modules · 40 Slides · 40 MCQs · 60% Pass)',
  accreditationStandard:
    'Codex Alimentarius & RQF Level 4 Award in Managing HACCP for Food Manufacturing & Catering',
  duration: '05 Presentation Modules (40 Slides) + 40-MCQ Final Exam',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description:
    'Managerial-level Slide Presentation Course (HACCP Level 04) for QA Managers, Food Safety Team Leaders, Production Managers, and Auditors. Covers Designing & Leading HACCP Systems, Advanced Hazard Risk Modeling, Scientific Validation & Thermal Lethality, Managing Recalls/Traceability/Food Fraud (VACCP/TACCP), and Auditing & Continual Improvement of the HACCP System.',
  modules: [
    {
      id: 'haccp4-mod-1',
      moduleNumber: 1,
      title: 'Strategic Leadership of the HACCP System & Food Safety Culture',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on the executive duties of a Level 04 HACCP Team Leader: designing the HACCP architecture, securing top management commitment, managing linear vs. modular HACCP plans, and building a positive Food Safety Culture.',
      internationalClauses: [
        'Codex CXC 1-1969 (2022 Rev.) Management Commitment & Food Safety Culture',
        'RQF Level 4 Managing the HACCP System'
      ],
      keyPrinciples: [
        'At HACCP Level 04, you design, validate, manage, and audit the entire HACCP system rather than just monitoring a single station.',
        'Top Management Commitment provides the budget, time, laboratory resources, and authority to stop production whenever food safety is at risk.',
        'Choose between a Linear HACCP Plan (for a single dedicated product line) or a Modular / Process-Led HACCP Plan (for complex multi-product factories and catering operations).',
        'Food Safety Culture means employees follow food safety rules even when nobody is watching, supported by open reporting and leadership role-modeling.'
      ],
      criticalControlParameters: [
        {
          parameter: 'HACCP Team Leader Authority to Stop Production',
          standardLimit: 'Unrestricted written authority to halt any line and quarantine stock upon CCP breach',
          correctiveProtocol: 'Escalate directly to Managing Director if commercial pressure ever challenges a food safety hold.'
        },
        {
          parameter: 'Linear vs. Modular / Process-Led HACCP Scope',
          standardLimit: '100% of products, shifts, rework loops, and subcontracted processes covered in the HACCP scope',
          correctiveProtocol: 'Conduct a gap analysis whenever new SKUs or shift patterns are introduced.'
        }
      ],
      practicalChecklist: [
        'Verify that the Food Safety Policy is signed by Top Management and communicated to all staff in languages they understand.',
        'Confirm that the HACCP Team has a trained deputy leader so coverage is maintained during leave.',
        'Review monthly Food Safety Culture metrics (near-miss reporting, training completion, audit closure).'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'What Makes HACCP Level 04 Different from Level 03?',
          subtitle: 'Stepping Up From Supervisor to HACCP System Manager',
          bulletPoints: [
            'Level 02 is for operators (following CCP rules); Level 03 is for supervisors (monitoring and checking daily logs).',
            'Level 04 is for Managers, QA Heads, and HACCP Team Leaders who DESIGN, VALIDATE, AUDIT, and CONTINUALLY IMPROVE the entire HACCP system.',
            'At Level 04, you decide which HACCP structure fits the factory, validate Critical Limits scientifically, lead recalls, and chair Management Review meetings.'
          ],
          keyTakeaway:
            'HACCP Level 04 equips you to build and lead the entire HACCP system from the ground up.'
        },
        {
          slideNumber: 2,
          title: 'Securing Top Management Commitment & Resources',
          subtitle: 'Why Leadership Support Is Mandatory under Codex & GFSI',
          bulletPoints: [
            'A HACCP system cannot succeed if top management only cares about production volume and cuts the hygiene or maintenance budget.',
            'As HACCP Manager, you present business-case reports to the CEO/Director to secure budgets for preventive maintenance, lab testing, staff training, and automated CCP sensors.',
            'Establish a clear written policy: "Food Safety overrides production targets—any HACCP Team Leader has full authority to stop a line if a Critical Limit fails."'
          ],
          keyTakeaway:
            'Without top management backing and the authority to stop an unsafe line, HACCP fails.'
        },
        {
          slideNumber: 3,
          title: 'Selecting the Right HACCP Architecture (Linear vs. Modular)',
          subtitle: 'Structuring HACCP for Simple vs. Complex Operations',
          bulletPoints: [
            'Linear (Product-Specific) HACCP Plan: Best for factories making one main product family on a dedicated line (e.g., a UHT milk line or a bottled water plant).',
            'Modular HACCP Plan: Best for factories with many products sharing common process modules (e.g., Mixing Module, Baking Module, Cooling Module, Packing Module).',
            'Process-Led HACCP Plan: Best for catering, hotels, and hospital kitchens with hundreds of recipes grouped into Process 1 (No-Cook), Process 2 (Same-Day Cook-Serve), and Process 3 (Complex Cook-Chill-Reheat).'
          ],
          keyTakeaway:
            'Match your HACCP structure (Linear, Modular, or Process-Led) to your operation so the plan stays practical and easy for staff to use.'
        },
        {
          slideNumber: 4,
          title: 'Building a Competent Multidisciplinary Team',
          subtitle: 'Selecting and Training Your Core & Specialist Members',
          bulletPoints: [
            'Appoint a trained HACCP Team Leader and a qualified Deputy Team Leader.',
            'Core Members: Quality Assurance, Production, Engineering/Maintenance, Warehouse/Supply Chain, and R&D/New Product Development.',
            'When needed, bring in external specialists (microbiologists, thermal process authorities, or packaging experts) to validate complex steps.',
            'Maintain a Competency Matrix proving every team member has completed formal HACCP training.'
          ],
          keyTakeaway:
            'Always include R&D and Engineering on your Level 04 HACCP Team so new products and machines are evaluated before launch.'
        },
        {
          slideNumber: 5,
          title: 'Building a Positive Food Safety Culture',
          subtitle: 'Codex Alimentarius 2022 Mandatory Requirement',
          bulletPoints: [
            'Food Safety Culture is the shared values, beliefs, and everyday behaviors regarding food safety across every level of the company.',
            'Key pillars of Food Safety Culture: Visible leadership walk-arounds, open two-way communication, rewarding staff who report hazards, and zero blame for honest safety stops.',
            'If workers are afraid of being punished for stopping a line when a metal detector or oven fails, they will hide problems—destroying food safety.'
          ],
          keyTakeaway:
            'Praise and support operators who speak up or stop the line when a food safety limit is breached.'
        },
        {
          slideNumber: 6,
          title: 'Managing Change Control (Management of Change — MOC)',
          subtitle: 'Preventing Hidden Hazards When Operations Change',
          bulletPoints: [
            'Many major food recalls happen because production or purchasing made a "small change" without telling the HACCP Team.',
            'Establish a formal Management of Change (MOC) Permit: No new raw material, supplier, recipe, packaging material, machine, or cleaning chemical can be introduced without a signed HACCP Team review.',
            'Update the Hazard Analysis, allergen matrix, label artwork, and operator training BEFORE the change goes live.'
          ],
          keyTakeaway:
            'Enforce a strict rule: Zero changes to ingredients, suppliers, recipes, or machines without prior HACCP Team sign-off.'
        },
        {
          slideNumber: 7,
          title: 'Overcoming Common Barriers to HACCP Success',
          subtitle: 'How a Manager Solves Real-World Floor Challenges',
          bulletPoints: [
            'Barrier: High staff turnover or language barriers → Solution: Use visual photo SOPs, color-coded gauges, and hands-on buddy coaching.',
            'Barrier: Paperwork overload ("tick-box mentality") → Solution: Simplify log sheets so operators only record essential CCPs/OPRPs and use digital probes where possible.',
            'Barrier: Frequent equipment breakdowns → Solution: Integrate CCP equipment (pasteurizers, chillers, metal detectors) into the priority Preventive Maintenance schedule.'
          ],
          keyTakeaway:
            'Keep floor paperwork simple, visual, and focused on real risks so operators take every check seriously.'
        },
        {
          slideNumber: 8,
          title: 'Chairing the Executive HACCP Management Review',
          subtitle: 'Keeping Directors Informed & Accountable',
          bulletPoints: [
            'Hold formal HACCP Management Review meetings at least quarterly or bi-annually with Top Management.',
            'Review Inputs: Audit findings, CCP deviation trends, customer complaints, lab results, recall drills, and resource needs.',
            'Review Outputs: Approved budget for equipment upgrades, staffing decisions, and next year’s measurable Food Safety Objectives.'
          ],
          keyTakeaway:
            'Management Review connects shop-floor HACCP performance directly to boardroom investment decisions.'
        }
      ]
    },
    {
      id: 'haccp4-mod-2',
      moduleNumber: 2,
      title: 'Advanced Hazard Analysis, Emerging Risks, Allergens & Risk Matrices',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on conducting a deep Level 04 Hazard Analysis: spore-forming bacteria, heat-stable toxins, mycotoxins, radiological hazards, quantitative allergen cross-contact controls, and 5×5 Risk Assessment matrices.',
      internationalClauses: [
        'Codex Principle 1 & CXC 80-2020 Allergen Management Code'
      ],
      keyPrinciples: [
        'A Level 04 Hazard Analysis differentiates between vegetative pathogens (killed by normal cooking) and bacterial spores or heat-stable toxins (which survive normal cooking).',
        'Chemical hazard analysis must include Mycotoxins (Aflatoxin B1/M1, Ochratoxin, Patulin), Histamine in fish, Acrylamide in high-temp frying/baking, and cleaning chemical residues.',
        'Use a structured 5×5 Risk Matrix (Likelihood 1–5 × Severity 1–5) to classify hazards objectively into PRPs, OPRPs, and CCPs.',
        'Allergen management requires supplier allergen declarations, segregated storage, production scheduling (allergen-free runs first), validated changeover cleaning, and label barcode verification.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Vegetative Pathogens vs. Spores & Heat-Stable Toxins',
          standardLimit: 'Cooking (75°C) kills vegetative cells; rapid cooling & cold chain (≤ 4°C) or retort (121.1°C) controls spores/toxins',
          correctiveProtocol: 'Never rely on reheating to make temperature-abused food safe, as toxins from S. aureus and B. cereus survive boiling.'
        },
        {
          parameter: 'Allergen Changeover & Label Verification Control',
          standardLimit: 'Validated wet/dry cleaning + protein swab pass + 100% packaging label check before starting allergen-free run',
          correctiveProtocol: 'Quarantine and relabel or destroy any batch packed in the wrong allergen packaging.'
        }
      ],
      practicalChecklist: [
        'Verify that your Hazard Analysis explicitly addresses spore-formers (C. botulinum, C. perfringens, B. cereus) and heat-stable toxins.',
        'Audit the Allergen Matrix across all recipes and confirm that changeover cleaning between allergen and non-allergen runs is validated with protein swabs.',
        'Confirm that packaging label verification is treated as an OPRP or CCP to prevent undeclared allergen recalls.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Vegetative Bacteria vs. Spore-Formers & Heat-Stable Toxins',
          subtitle: 'Why Cooking Alone Does Not Solve Every Biological Hazard',
          bulletPoints: [
            'Vegetative Bacteria (Salmonella, E. coli, Campylobacter, Listeria): Killed reliably when cooked to ≥ 75°C for 30 seconds.',
            'Spore-Forming Bacteria (Clostridium perfringens, Clostridium botulinum, Bacillus cereus): Form tough protective spores that SURVIVE normal cooking temperatures (75°C–100°C)!',
            'If cooked food is cooled too slowly through the Danger Zone (+60°C to +5°C), surviving spores germinate and multiply rapidly.',
            'Heat-Stable Toxins: Staphylococcus aureus enterotoxin, Bacillus cereus emetic toxin ( in rice/pasta), and Scombroid histamine (in warm tuna) CANNOT be destroyed by cooking or reheating!'
          ],
          keyTakeaway:
            'Cooking kills vegetative bacteria, but rapid cooling and strict cold-chain control are mandatory to stop spores and heat-stable toxins.'
        },
        {
          slideNumber: 2,
          title: 'Controlling Listeria monocytogenes in Chilled Ready-to-Eat (RTE) Foods',
          subtitle: 'The Pathogen That Grows Inside Refrigerators',
          bulletPoints: [
            'Unlike most bacteria, Listeria monocytogenes can slowly multiply even at refrigerator temperatures (+1°C to +4°C) and thrives in wet floor drains, hollow rollers, and slicer seals.',
            'It causes severe illness and miscarriage in pregnant women, newborns, elderly, and immunocompromised patients.',
            'Control Strategy: Positive-pressure High-Care RTE zones, captive boots, keeping high-care floors dry during production, shelf-life limits, and an Environmental Monitoring Program (swabbing Zones 1 to 4).'
          ],
          keyTakeaway:
            'Because Listeria grows in cold, wet environments, control it through strict High-Care hygiene zoning and regular environmental swabbing.'
        },
        {
          slideNumber: 3,
          title: 'Advanced Chemical Hazards: Mycotoxins, Histamine & Process Contaminants',
          subtitle: 'Invisible Chemical Risks Raw Material Specs Must Control',
          bulletPoints: [
            'Mycotoxins (Mold Toxins): Aflatoxin B1/G1 in peanuts, tree nuts, maize, and spices; Aflatoxin M1 in milk (< 0.5 ppb EU/Codex limit); Patulin in damaged apples (< 50 ppb in juice); Ochratoxin A in cereals/coffee.',
            'Mycotoxins are completely heat-stable—pasteurization or baking will NOT destroy them! They must be controlled through Supplier COA testing and dry storage.',
            'Process Contaminants: Acrylamide (formed in starchy foods fried/baked above 120°C) and Trans Fats / Polar Compounds (> 24% TPM in overused frying oil).'
          ],
          keyTakeaway:
            'Since mycotoxins survive all cooking and pasteurization steps, supplier COA screening and dry storage are your primary controls.'
        },
        {
          slideNumber: 4,
          title: 'Radiological & Heavy Metal Hazards',
          subtitle: 'Completing a Comprehensive GFSI-Compliant Hazard Analysis',
          bulletPoints: [
            'Heavy Metals: Lead, Cadmium, Mercury (in predatory fish), and Arsenic (in rice and groundwater). Controlled via annual water testing and supplier COA screening.',
            'Radiological Hazards: Radionuclides (e.g., Cesium-137, Iodine-131) in ingredients sourced from regions near historical nuclear incidents.',
            'Controlled through Country-of-Origin purchasing verification and import radiation clearance certificates.'
          ],
          keyTakeaway:
            'Include Heavy Metals and Radiological hazards in your Raw Material Hazard Analysis to satisfy FSSC 22000, BRCGS, and ISO 22000 auditors.'
        },
        {
          slideNumber: 5,
          title: 'Using the 5×5 Risk Assessment Matrix',
          subtitle: 'Scoring Likelihood (1–5) × Severity (1–5)',
          bulletPoints: [
            'In Level 04 HACCP, a 5×5 Risk Matrix gives finer precision than a basic 3×3 matrix:',
            'Likelihood (1 to 5): 1 = Almost Impossible, 2 = Unlikely, 3 = Possible, 4 = Likely, 5 = Almost Certain.',
            'Severity (1 to 5): 1 = Negligible, 2 = Minor, 3 = Moderate illness, 4 = Serious hospitalization, 5 = Fatal / Permanent disability / Anaphylaxis.',
            'Risk Score = L × S (1 to 25). Typically, a score ≥ 9 (or any Severity = 5) is classified as a Significant Hazard requiring an OPRP or CCP.'
          ],
          keyTakeaway:
            'Document clear rules for your 5×5 Risk Matrix—any hazard with Severity 5 (life-threatening) must be treated as Significant even if Likelihood is low.'
        },
        {
          slideNumber: 6,
          title: 'Distinguishing PRPs, OPRPs, and CCPs',
          subtitle: 'The 3-Tier Control Hierarchy in Modern Food Safety',
          bulletPoints: [
            'PRP (Prerequisite Program): General plant hygiene (pest control, handwashing, floor cleaning)—not tied to one specific process step.',
            'OPRP (Operational Prerequisite Program): A specific control measure for a Significant Hazard where failure does not immediately mean unsafe food, or where monitoring is visual/procedural (e.g., sieve inspection, glass register check, allergen label check).',
            'CCP (Critical Control Point): A critical step with a strict numerical Critical Limit where failure means the product is unsafe (e.g., pasteurizer temperature/flow diversion, metal detector).'
          ],
          keyTakeaway:
            'PRPs manage the environment; OPRPs manage significant operational risks; CCPs enforce absolute numerical safety limits.'
        },
        {
          slideNumber: 7,
          title: 'End-to-End Allergen Management Architecture',
          subtitle: 'Preventing the #1 Cause of Global Food Recalls',
          bulletPoints: [
            'Undeclared allergens cause nearly 50% of all Class I (life-threatening) food recalls globally.',
            'Step-by-Step Allergen Control: (1) Supplier Allergen Questionnaire, (2) Color-coded segregated warehouse racks, (3) Dedicated weighing scoops, (4) Production scheduling (run non-allergen products FIRST in the morning, allergen products LAST before deep clean), and (5) Validated allergen changeover cleaning.'
          ],
          keyTakeaway:
            'Schedule allergen-free production runs FIRST after full sanitation, and validate allergen clean-downs with rapid protein/ELISA swabs.'
        },
        {
          slideNumber: 8,
          title: 'Preventing Packaging & Label Artwork Recalls',
          subtitle: 'Making Sure the Right Product Goes Into the Right Pack',
          bulletPoints: [
            'Even if a product is 100% free of contamination, putting a product containing peanuts or milk into a wrapper that does not list peanuts or milk on the label is a life-threatening failure.',
            'Line-Clearance Rule: Before starting a new batch, remove 100% of old packaging film, cartons, and labels from the packing room.',
            'Verify barcode/label code against the Production Order and sign the Packaging Line-Clearance Log every 30–60 minutes.'
          ],
          keyTakeaway:
            'Treat Packaging Line Clearance and Label Verification as a top-priority OPRP/CCP on every packing line.'
        }
      ]
    },
    {
      id: 'haccp4-mod-3',
      moduleNumber: 3,
      title: 'Scientific Validation, Thermal Lethality & Process Capability',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on how a Level 04 Manager scientifically validates CCPs (Codex CXG 69-2008), understands D-value and z-value thermal kill concepts in plain English, maps oven/retort cold spots, and conducts shelf-life studies.',
      internationalClauses: [
        'Codex Guidelines for the Validation of Food Safety Control Measures (CXG 69-2008)'
      ],
      keyPrinciples: [
        'Validation is obtaining scientific evidence BEFORE routine production that a control measure achieves the required hazard reduction under worst-case operating conditions.',
        'In thermal processing, D-value is the time at a fixed temperature needed to kill 90% (1-log) of a target bacterium; a 6-D cook kills 99.9999% of vegetative bacteria (like Listeria or Salmonella).',
        'Equipment mapping identifies the "Cold Spot" (slowest-heating point in an oven, autoclave, or kettle) and "Warm Spot" in a chiller so monitoring probes are placed in the worst-case location.',
        'Shelf-life validation combines real-time storage testing (at target + slight abuse temperatures) across multiple batches to prove safety until the final expiry day.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Worst-Case Cold-Spot Thermal Validation (3-Batch Rule)',
          standardLimit: 'Validate across at least 3 consecutive full-scale worst-case production runs at the coldest spot',
          correctiveProtocol: 'Never validate an oven or chiller when it is half-empty—always test under maximum full load.'
        },
        {
          parameter: '6-Log (6-D) Vegetative Pathogen Reduction Benchmark',
          standardLimit: '≥ 70°C for 2 minutes or ≥ 75°C for 30 seconds at the slowest-heating thermal center',
          correctiveProtocol: 'Increase cook time or belt residence time if the thickest product center fails to reach target.'
        }
      ],
      practicalChecklist: [
        'Ensure your Validation Dossier contains 3-batch trial data under maximum load for every thermal and cooling CCP.',
        'Verify that chiller and oven temperature sensors are positioned at the mapped Warm Spot (chiller) and Cold Spot (oven).',
        'Check that every product has a signed Shelf-Life Validation Report supporting its printed expiry date.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'How to Validate a Control Measure (Codex CXG 69-2008)',
          subtitle: 'The 5-Step Validation Method for Managers',
          bulletPoints: [
            'Step A: Identify the target hazard and the required safety outcome (e.g., 6-log reduction of Salmonella in cooked poultry).',
            'Step B: Gather scientific references, regulatory standards, or equipment specs.',
            'Step C: Run a worst-case full-scale trial on your actual factory equipment across at least 3 consecutive batches.',
            'Step D: Analyze the data (temperature curves, pH, microbiological lab results) to confirm the target was met every time.',
            'Step E: Compile the signed Validation Report and archive it in the HACCP Manual.'
          ],
          keyTakeaway:
            'Always validate CCPs across at least 3 full-load worst-case production batches—never on an empty or half-full machine.'
        },
        {
          slideNumber: 2,
          title: 'Understanding D-Value & Log Reductions in Simple Terms',
          subtitle: 'How Heat Kills Bacteria Step by Step',
          bulletPoints: [
            'What is a 1-Log Reduction (D-Value)? The time at a specific temperature needed to kill 90% of a bacterial population (reducing 1,000,000 cells down to 100,000 cells).',
            'What is a 6-Log (6-D) Reduction? Killing 99.9999% of bacteria (reducing 1,000,000 cells down to just 1 cell!). This is the standard for pasteurization and cooking (e.g., 70°C for 2 mins or 75°C for 30s).',
            'What is a 12-Log (12-D) Botulinum Cook? Used in low-acid canned foods (retorting at 121.1°C for ≥ 3 minutes) to destroy heat-resistant Clostridium botulinum spores.'
          ],
          keyTakeaway:
            '1-Log kills 90%; 6-Log kills 99.9999% (standard cooking/pasteurization); 12-Log sterilizes canned low-acid foods.'
        },
        {
          slideNumber: 3,
          title: 'Finding the "Cold Spot" in Ovens, Kettles & Retorts',
          subtitle: 'Why Probe Placement Determines Food Safety',
          bulletPoints: [
            'Heat does not distribute evenly inside a large oven, steamer, or cooking kettle—one corner or the geometric center of the thickest piece heats up last.',
            'This slowest-heating location is called the "Cold Spot".',
            'During thermal validation, place multiple data-logging temperature probes throughout the oven/rack to map the exact Cold Spot.',
            'Once found, operators must always check the temperature at that Cold Spot (and inside the thickest piece of meat/product).'
          ],
          keyTakeaway:
            'If the Cold Spot reaches ≥ 75°C for 30 seconds, you know 100% of the rest of the batch is safe.'
        },
        {
          slideNumber: 4,
          title: 'Finding the "Warm Spot" in Chillers & Cold Rooms',
          subtitle: 'Mapping Refrigerators and Delivery Trucks',
          bulletPoints: [
            'In a walk-in chiller or refrigerated truck, the area right in front of the evaporator fan is the coldest, while the area near the door or ceiling corners is the warmest.',
            'If the wall thermometer sensor is placed right in front of the cold fan, it may read +2°C while food near the door is sitting at +9°C!',
            'Map your chillers to locate the "Warm Spot" (usually near the return air/door) and place your temperature monitoring sensor there.'
          ],
          keyTakeaway:
            'Place oven probes in the Cold Spot and chiller sensors in the Warm Spot for true worst-case protection.'
        },
        {
          slideNumber: 5,
          title: 'Validating Cleaning & Allergen Changeovers',
          subtitle: 'Proving Your Sanitation SOP Actually Removes Soil & Allergens',
          bulletPoints: [
            'How do you prove a cleaning procedure (SSOP) or CIP cycle works?',
            'Run 3 consecutive cleaning trials after the dirtiest/longest production run and inspect:',
            '• Visual Check: Zero visible food residue under bright light (including dismantling gaskets, blades, and dead-ends).',
            '• ATP Swab & Microbiological Swab: Confirm ATP is within pass limits and pathogen swabs (Listeria/Salmonella) are negative.',
            '• Allergen Protein / ELISA Swab: Confirm zero detectable allergen residue (< 5 ppm) after an allergen run.'
          ],
          keyTakeaway:
            'Validate cleaning and allergen changeovers across 3 consecutive runs using Visual + ATP + Microbiological + Allergen swabs.'
        },
        {
          slideNumber: 6,
          title: 'Validating Product Shelf Life Safely',
          subtitle: 'How to Set Accurate Use-By and Best-Before Dates',
          bulletPoints: [
            'Use-By Date (Safety Date): Used on chilled, high-risk perishable foods (meat, dairy, ready meals)—eating the food after this date is unsafe.',
            'Best-Before Date (Quality Date): Used on dry/ambient stable foods (biscuits, pasta, canned goods)—related to crispness, color, and flavor.',
            'How to Validate Chilled Shelf Life: Test samples at Day 0, Mid-Life, End-of-Life, and End-of-Life + 15% margin, including a slight temperature-abuse stage (e.g., +7°C to +8°C) to simulate consumer transport.'
          ],
          keyTakeaway:
            'Never guess a shelf-life date—validate it with microbiological, chemical, and sensory testing through the end of shelf life.'
        },
        {
          slideNumber: 7,
          title: 'Validating Metal Detectors & X-Ray Systems',
          subtitle: 'Testing Under Real Product Effect & Line Speed',
          bulletPoints: [
            'Wet, salty, or acidic foods (like cheese, pickles, or fresh meat) create a magnetic "Product Effect" that can make metal harder to detect.',
            'Always validate Metal Detectors by placing the test spheres (Fe, Non-Fe, SS) at the geometric center of an actual product pack moving at maximum belt speed.',
            'Also test the Fail-Safe features: What happens if the air pressure drops or the reject bin is full? The line must stop automatically!'
          ],
          keyTakeaway:
            'Always pass test pieces WITH a real product pack through the center of the detector aperture at normal belt speed.'
        },
        {
          slideNumber: 8,
          title: 'When Must You Re-Validate Your CCPs?',
          subtitle: 'Triggers for Re-Validation',
          bulletPoints: [
            'A validation is not valid forever. You must re-validate whenever:',
            '• You change product formulation (e.g., reducing salt/sugar or changing pH).',
            '• You increase pack size/thickness or change packaging material.',
            '• You speed up a conveyor oven or replace a pasteurizer/metal detector.',
            '• Repeated CCP failures or microbiological failures occur during routine verification.'
          ],
          keyTakeaway:
            'Any change to recipe, pack thickness, belt speed, or equipment requires immediate re-validation.'
        }
      ]
    },
    {
      id: 'haccp4-mod-4',
      moduleNumber: 4,
      title: 'Traceability, Crisis & Recall Management, Food Fraud (VACCP) & Food Defense (TACCP)',
      estimatedMinutes: 45,
      overview:
        'Simple presentation on managing forward and backward traceability, conducting 4-hour Mock Recall & Mass-Balance drills, managing Crisis & Outbreak response, and implementing VACCP (Food Fraud) and TACCP (Food Defense).',
      internationalClauses: [
        'Codex Traceability & Product Recall Guidelines',
        'GFSI / ISO 22000 Food Fraud (VACCP) & Food Defense (TACCP) Requirements'
      ],
      keyPrinciples: [
        'One-Step-Back, One-Step-Forward Traceability links every raw material lot and primary packaging roll to the exact finished product batch and customer shipment.',
        'A Mock Recall & Mass-Balance exercise must trace and account for 99.5%–100% of a lot (received, used, in-stock, waste, and shipped) within ≤ 4 hours.',
        'VACCP (Vulnerability Assessment Critical Control Point) prevents economically motivated Food Fraud (adulteration, dilution, substitution, counterfeit labels).',
        'TACCP (Threat Assessment Critical Control Point) protects the facility from intentional malicious tampering or sabotage (Food Defense).'
      ],
      criticalControlParameters: [
        {
          parameter: 'Mock Recall & Mass-Balance Completion Time',
          standardLimit: '100% forward and backward lot trace with 99.5%–100% mass balance completed within ≤ 4 hours',
          correctiveProtocol: 'Test the recall system at least once a year (including an out-of-hours test) and fix any batch-logging gaps.'
        },
        {
          parameter: 'VACCP (Food Fraud) & TACCP (Food Defense) Assessments',
          standardLimit: 'Annual vulnerability assessment for raw materials (VACCP) and site security access control (TACCP)',
          correctiveProtocol: 'Lock high-risk tanks/silos, seal bulk tankers with numbered tamper-evident seals, and test fraud-prone ingredients.'
        }
      ],
      practicalChecklist: [
        'Conduct a 4-hour Mock Recall drill tracing one finished batch back to all raw material COAs and packaging lots.',
        'Verify that bulk liquid deliveries (milk, oil, water) arrive with intact numbered tamper-evident security seals matching the invoice.',
        'Confirm that external doors, water tanks, chemical stores, and High-Care areas have restricted access controls.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Forward & Backward Traceability Systems',
          subtitle: 'One Step Back, One Step Forward',
          bulletPoints: [
            'Backward Traceability (Upstream): Given a finished product batch code, identify every raw material lot, spice batch, rework batch, and food-contact packaging roll used to make it.',
            'Forward Traceability (Downstream): Given a raw material lot (e.g., a contaminated batch of milk powder), identify every finished batch it entered and every customer or distributor who received it.',
            'Every container of work-in-progress (WIP) and rework in the factory must carry a batch code label so the chain is never broken.'
          ],
          keyTakeaway:
            'Don’t forget primary food-contact packaging and rework in your traceability system—they must be batch-tracked just like raw ingredients.'
        },
        {
          slideNumber: 2,
          title: 'Conducting a 4-Hour Mock Recall & Mass Balance',
          subtitle: 'Proving Your Traceability System Works Under Time Pressure',
          bulletPoints: [
            'International standards (ISO 22000, FSSC 22000, BRCGS) require completing a full Mock Recall and Mass-Balance exercise within ≤ 4 hours at least once a year.',
            'What is a Mass Balance? Accounting for 100% of the weight/units of the chosen lot:',
            'Total Quantity Received = Quantity Used in Production + Quantity Remaining in Store + Recorded Waste/Samples.',
            'And for Finished Goods: Total Produced = Quantity Shipped to Customers + Quantity in Warehouse + QA Samples.',
            'Target reconciliation is 99.5% to 100% within 4 hours.'
          ],
          keyTakeaway:
            'Run a timed Mock Recall drill every 6 to 12 months and record the exact start and finish times.'
        },
        {
          slideNumber: 3,
          title: 'Product Withdrawal vs. Public Product Recall',
          subtitle: 'Knowing When to Escalate to Regulatory Authorities',
          bulletPoints: [
            'Trade Withdrawal: Removing a batch from distribution warehouses and retail back-rooms BEFORE it has been sold to the general public (usually for a quality defect or minor issue).',
            'Public Product Recall: Removing an unsafe product (e.g., undeclared allergen, Salmonella/Listeria, glass contamination) that has ALREADY reached consumers, including notifying the Food Authority within 24 hours and issuing public alerts.',
            'Maintain a 24/7 Crisis Management Team contact list (CEO, QA Head, Legal, Operations, and Regulator hotlines).'
          ],
          keyTakeaway:
            'If an unsafe product has left your control, notify the Crisis Team and Regulatory Authorities immediately.'
        },
        {
          slideNumber: 4,
          title: 'What is Food Fraud (VACCP)?',
          subtitle: 'Vulnerability Assessment Critical Control Points',
          bulletPoints: [
            'Food Fraud (Economically Motivated Adulteration — EMA) is the intentional substitution, dilution, or misrepresentation of food for financial gain.',
            'Common High-Risk Ingredients for Fraud: Olive oil diluted with cheap seed oil, honey diluted with sugar syrup, milk adulterated with water/urea/melamine, ground spices mixed with dyes/fillers, and fake Halal/Organic certificates.',
            'While the fraudster’s motive is money, the result can be toxic or allergenic (e.g., peanut shells added to cumin powder!).'
          ],
          keyTakeaway:
            'VACCP focuses on preventing economically motivated adulteration, dilution, substitution, and counterfeit raw materials.'
        },
        {
          slideNumber: 5,
          title: 'How to Build a Simple VACCP Plan',
          subtitle: 'Assessing Raw Material Vulnerability & Controls',
          bulletPoints: [
            'Evaluate each raw material based on: (1) Historical fraud alerts, (2) Price fluctuations/high value, (3) Physical form (powders and liquids are much easier to adulterate than whole items), and (4) Supply chain complexity (brokers vs. direct manufacturers).',
            'VACCP Controls: Buy directly from audited manufacturers, require accredited lab authenticity testing (e.g., FTIR, isotope, or DNA species testing), and perform unannounced supplier audits.'
          ],
          keyTakeaway:
            'Powders, oils, honey, spices, and minced meats have the highest fraud risk and require strict supplier and lab verification.'
        },
        {
          slideNumber: 6,
          title: 'What is Food Defense (TACCP)?',
          subtitle: 'Threat Assessment Critical Control Points',
          bulletPoints: [
            'Food Defense (TACCP) protects food from intentional malicious contamination, tampering, or sabotage by disgruntled employees, unauthorized intruders, or extremists.',
            'Unlike HACCP (accidental hazards) and VACCP (financial greed), TACCP deals with ideological or revenge-driven intent to cause harm or panic.',
            'High-risk points in a factory: Open mixing vats, outdoor water/milk storage silos, chemical stores, and unlocked delivery tankers.'
          ],
          keyTakeaway:
            'HACCP = Accidental Safety; VACCP = Economic Fraud; TACCP = Malicious Sabotage/Tampering.'
        },
        {
          slideNumber: 7,
          title: 'Practical TACCP Site Security Controls',
          subtitle: 'Hardening Your Facility Against Tampering',
          bulletPoints: [
            'Perimeter & Entry Control: Perimeter fencing, CCTV cameras, security guards, visitor sign-in badges (escorted at all times), and biometric/keycard doors for production zones.',
            'Bulk Tanker & Silo Security: All bulk milk, oil, and flour tankers must arrive with numbered Tamper-Evident Security Seals on every hatch and valve, matched against the dispatch note before unloading.',
            'Internal Controls: Keep toxic chemicals and maintenance rooms locked, and immediately revoke badge/IT access when an employee leaves the company.'
          ],
          keyTakeaway:
            'Never unload a bulk tanker whose tamper-evident security seal is broken, missing, or does not match the delivery paperwork.'
        },
        {
          slideNumber: 8,
          title: 'Business Continuity & Utility Failure Drills',
          subtitle: 'Testing Your Crisis Response Before a Real Emergency',
          bulletPoints: [
            'Test your Crisis & Business Continuity Plan annually with realistic tabletop scenarios:',
            'Scenario A: Sudden 12-hour power failure in the cold store.',
            'Scenario B: Contamination of municipal water supply.',
            'Scenario C: Cyber-attack locking the ERP traceability software (always keep a backup export or paper log capability).'
          ],
          keyTakeaway:
            'Annual Mock Recalls and Crisis Drills ensure your team acts fast and calmly during a real emergency.'
        }
      ]
    },
    {
      id: 'haccp4-mod-5',
      moduleNumber: 5,
      title: 'Auditing the HACCP System, Regulatory Compliance & Continual Improvement',
      estimatedMinutes: 40,
      overview:
        'Simple presentation on planning and executing risk-based HACCP audits, vertical and horizontal auditing techniques, grading Minor/Major/Critical non-conformities, verifying CAPA effectiveness, and driving continual improvement.',
      internationalClauses: [
        'ISO 19011 Auditing Guidelines & Codex Principle 6/7 System Review'
      ],
      keyPrinciples: [
        'A risk-based Internal Audit Program schedules more frequent audits for high-risk CCPs, allergen lines, and areas with previous non-conformities.',
        'Auditors gather objective evidence using the Audit Triangle: (1) Observe actual floor practices, (2) Interview operators, and (3) Review documented records.',
        'Vertical Auditing traces a single production batch from raw material receiving through every CCP, lab check, cleaning log, and calibration record to dispatch.',
        'Non-conformities are graded as Minor, Major, or Critical, and are only closed after verifying that the root-cause Corrective Action prevented recurrence.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Auditor Impartiality & Independence Rule',
          standardLimit: 'Internal auditors must NEVER audit their own department or direct area of responsibility',
          correctiveProtocol: 'Cross-train QA, Production, and Engineering managers to audit each other’s departments.'
        },
        {
          parameter: 'Non-Conformity Grading & CAPA Verification',
          standardLimit: 'Critical NC = Immediate food safety risk/falsification (24–72h fix); Major NC = Systemic breakdown (14–28d CAPA)',
          correctiveProtocol: 'Re-audit the corrective action after 30 days to verify that the failure has not returned.'
        }
      ],
      practicalChecklist: [
        'Prepare a risk-based Annual Internal Audit Schedule covering all shifts, PRPs, OPRPs, and CCPs.',
        'Conduct a Vertical Traceability & CCP Audit on one batch selected at random from last month’s dispatch records.',
        'Verify that all open audit Non-Conformities have documented 5-Why Root Cause Analysis and signed verification.'
      ],
      presentationSlides: [
        {
          slideNumber: 1,
          title: 'Designing a Risk-Based HACCP Audit Program',
          subtitle: 'Auditing Based on Risk and Performance, Not Just a Calendar',
          bulletPoints: [
            'Do not audit every area only once a year in December.',
            'Risk-Based Scheduling: Audit High-Care RTE zones, Cooking/Pasteurization CCPs, and Allergen changeover lines quarterly or monthly, while low-risk dry packaging stores may be audited twice a year.',
            'Include unannounced internal hygiene and CCP audits across night shifts and weekends.',
            'Ensure Auditor Independence: A QA Supervisor cannot audit the QA Lab—have a trained Production Manager audit QA, and QA audit Production.'
          ],
          keyTakeaway:
            'Audit high-risk CCPs and night shifts more frequently, and ensure auditors never audit their own work.'
        },
        {
          slideNumber: 2,
          title: 'The Audit Evidence Triangle (Observe, Interview, Review)',
          subtitle: 'How Professional Auditors Gather Objective Evidence',
          bulletPoints: [
            'Never conduct an audit sitting in an office looking only at folders!',
            'Spend at least 60% of audit time on the shop floor using the 3-part Audit Triangle:',
            '• OBSERVE: Watch operators performing cooking probes, metal detector tests, and allergen clean-downs live.',
            '• INTERVIEW: Ask the operator in simple words: "What is your temperature limit here, and what do you do if it reads 68°C?"',
            '• REVIEW: Check that the written logbook matches what you just observed on the line.'
          ],
          keyTakeaway:
            'Always combine live floor observation, operator interviews, and record checks during a HACCP audit.'
        },
        {
          slideNumber: 3,
          title: 'Vertical vs. Horizontal Auditing Techniques',
          subtitle: 'The Method Used by GFSI, BRCGS & FSSC 22000 Lead Auditors',
          bulletPoints: [
            'Horizontal Audit: Checking one topic across the whole plant (e.g., checking thermometer calibration across all departments).',
            'Vertical Audit (Batch Trace Audit): Picking ONE finished product batch from 2 months ago and auditing every single record linked to that batch on that exact day:',
            '• Raw material receiving & supplier COAs → Pre-op sanitation & ATP swabs → Cooking CCP log → Cooling CCP log → Metal detector hourly checks → Operator training & thermometer calibration certificates → Final dispatch temperature.'
          ],
          keyTakeaway:
            'A Vertical Audit of a single batch tests your entire HACCP system from start to finish in 2 hours.'
        },
        {
          slideNumber: 4,
          title: 'Spotting Record Falsification ("Dry-Labbing")',
          subtitle: 'Red Flags Every HACCP Manager Must Catch',
          bulletPoints: [
            'During record verification, look closely for warning signs of fake or pre-filled logs:',
            '• "Flat-Lining": The exact same temperature (e.g., "76.0°C, 76.0°C, 76.0°C") written every hour all day long in identical handwriting.',
            '• Future Timestamps: Entries filled in for 4:00 PM when the current time on the clock is only 1:30 PM.',
            '• Missing Batches or Unrecorded Downtime: CCP checks logged during an hour when engineering logs show the oven was shut down for repair!'
          ],
          keyTakeaway:
            'Cross-checking CCP logs against engineering downtime and production output quickly reveals whether logs are genuine.'
        },
        {
          slideNumber: 5,
          title: 'Grading Audit Findings (Minor, Major & Critical)',
          subtitle: 'How Non-Conformities Are Classified',
          bulletPoints: [
            'Minor Non-Conformity: A single, isolated lapse in a procedure or record that does not directly threaten food safety (e.g., one missed signature on a cleaning log).',
            'Major Non-Conformity: A systemic breakdown, missing validation, or repeated failure to follow a requirement that could lead to a food safety failure if not corrected.',
            'Critical Non-Conformity: A direct threat to food safety (e.g., shipping product that failed a CCP without quarantine, active pest infestation in open food, or falsified CCP records).'
          ],
          keyTakeaway:
            'A Critical Non-Conformity requires immediate line stoppage, product quarantine, and urgent executive action.'
        },
        {
          slideNumber: 6,
          title: 'Writing Clear Non-Conformance Reports (NCRs)',
          subtitle: 'The 3 Parts of an Audit Finding Statement',
          bulletPoints: [
            'Every audit Non-Conformance Report should clearly state three facts:',
            'Requirement: Which HACCP clause or SOP requirement applies (e.g., "Cooking CCP-1 requires core temp ≥ 75°C checked every 30 mins").',
            'Objective Evidence: Exactly what was seen, including batch code, time, and equipment ID (e.g., "On Line 2 at 14:15, Batch #409 was dispatched with no cooking temperature recorded between 12:00 and 14:00").',
            'Statement of Non-Conformity: Why this is a risk to food safety or system compliance.'
          ],
          keyTakeaway:
            'Always record exact batch numbers, times, and equipment IDs as objective evidence in an audit report.'
        },
        {
          slideNumber: 7,
          title: 'Closing CAPAs & Verifying Effectiveness',
          subtitle: 'Making Sure Fixed Problems Stay Fixed',
          bulletPoints: [
            'Do not close an audit finding just because a manager emails a promise ("We will retrain the staff").',
            'Require objective proof of: (1) Immediate Correction, (2) 5-Why Root Cause Analysis, and (3) Systemic Corrective Action.',
            'Schedule a Follow-Up Effectiveness Check 30 days later on the floor to verify that the new control is working and the issue has not recurred.'
          ],
          keyTakeaway:
            'An audit CAPA is only truly closed when a follow-up check on the floor proves the root cause was eliminated.'
        },
        {
          slideNumber: 8,
          title: 'Continual Improvement & Course Completion',
          subtitle: 'Using Trend Analysis to Achieve World-Class Food Safety',
          bulletPoints: [
            'Track monthly trends in CCP deviations, foreign-body complaints, ATP swab pass rates, and audit scores.',
            'Use PDCA (Plan → Do → Check → Act) to upgrade manual controls to automated poka-yoke (error-proof) systems.',
            'Congratulations on completing all 5 Modules of HACCP Level 04! You are now ready to take the 40-MCQ Final Exam (60% passing score).'
          ],
          keyTakeaway:
            'Continual improvement turns your HACCP plan from a compliance document into a competitive strength.'
        }
      ]
    }
  ],
  coreExamPool: [
    {
      q: 'What is the primary role of a manager holding HACCP Level 04 compared to Level 02 or Level 03?',
      options: [
        'Designing, scientifically validating, auditing, and continually improving the entire HACCP system',
        'Only washing kitchen floors',
        'Only driving delivery vans',
        'Working without any documentation'
      ],
      correctIndex: 0,
      explanation: 'HACCP Level 04 covers the strategic design, scientific validation, auditing, and management of the entire HACCP system.'
    },
    {
      q: 'Which HACCP plan structure is most effective for a large catering or multi-recipe operation producing hundreds of dishes?',
      options: [
        'A Process-Led / Modular HACCP Plan grouping dishes by thermal process trips (No-Cook, Cook-Serve, Cook-Chill-Reheat)',
        'Writing no HACCP plan at all',
        'Using only a single verbal instruction',
        'Testing only 1 meal per year'
      ],
      correctIndex: 0,
      explanation: 'Process-Led / Modular HACCP groups dishes by common process pathways through the Temperature Danger Zone.'
    },
    {
      q: 'Why can spore-forming bacteria (such as Clostridium perfringens and Bacillus cereus) cause outbreaks in cooked foods?',
      options: [
        'Their heat-resistant spores survive normal cooking temperatures and germinate rapidly if the cooked food is cooled too slowly',
        'They only grow inside -25°C freezers',
        'They are killed at +25°C room temperature',
        'They only exist in bottled water'
      ],
      correctIndex: 0,
      explanation: 'Bacterial spores survive normal cooking; rapid blast chilling through the Danger Zone is mandatory to prevent spore germination.'
    },
    {
      q: 'How are Mycotoxins (such as Aflatoxin in nuts, spices, grains, and milk) effectively controlled in a HACCP system?',
      options: [
        'Through Supplier Approval, COA laboratory screening at receiving, and dry storage, because mycotoxins are heat-stable and are NOT destroyed by cooking or pasteurization',
        'By boiling the food for 2 minutes',
        'By freezing the food for 1 hour',
        'By wiping the packaging with alcohol'
      ],
      correctIndex: 0,
      explanation: 'Mycotoxins are completely heat-stable; they cannot be destroyed by normal cooking or pasteurization and must be prevented at sourcing and storage.'
    },
    {
      q: 'In production scheduling, what is the safest sequence to prevent allergen cross-contact?',
      options: [
        'Run Allergen-Free products FIRST after full sanitation, and schedule allergen-containing products LAST before a validated deep clean',
        'Run peanut products first and baby food immediately after without cleaning',
        'Mix all products together on the same belt',
        'Clean only once a month'
      ],
      correctIndex: 0,
      explanation: 'Running non-allergen products first and allergen products last before a validated clean-down minimizes cross-contact risk.'
    },
    {
      q: 'According to Codex Validation Guidelines (CXG 69-2008), how should a thermal Cooking or Cooling CCP be validated on factory equipment?',
      options: [
        'Across at least 3 consecutive full-scale worst-case batches with temperature probes placed at the slowest-heating Cold Spot (or Warm Spot in chillers)',
        'By running the oven completely empty for 5 minutes',
        'By asking the equipment salesman verbally',
        'Validation is not needed if the machine is new'
      ],
      correctIndex: 0,
      explanation: 'Validation requires testing at least 3 consecutive worst-case full-load production runs at the mapped Cold Spot / Warm Spot.'
    },
    {
      q: 'What does a "6-Log (6-D) Reduction" mean in thermal food processing?',
      options: [
        'A 99.9999% reduction in the target pathogen population (reducing 1,000,000 cells down to 1 cell)',
        'A 6% reduction in bacteria',
        'Heating food to 6°C',
        'Cooking for 6 hours'
      ],
      correctIndex: 0,
      explanation: 'Each 1-log reduction kills 90% of cells; a 6-log reduction kills 99.9999% of the target vegetative pathogen.'
    },
    {
      q: 'What is the target maximum time to complete a full Mock Recall and Mass-Balance exercise under international standards?',
      options: [
        'Within ≤ 4 hours (accounting for 99.5%–100% of the lot received, used, in-stock, and shipped)',
        'Within 30 days',
        'Within 6 months',
        'Traceability is only required once every 5 years'
      ],
      correctIndex: 0,
      explanation: 'International standards require completing forward/backward traceability and mass balance within 4 hours.'
    },
    {
      q: 'What is the difference between HACCP, VACCP, and TACCP?',
      options: [
        'HACCP prevents unintentional food safety hazards; VACCP prevents economically motivated Food Fraud; TACCP prevents malicious tampering/sabotage (Food Defense)',
        'They all mean dishwashing',
        'VACCP is only for accounting software',
        'TACCP is only for marketing brochures'
      ],
      correctIndex: 0,
      explanation: 'HACCP addresses unintentional safety hazards, VACCP addresses economic Food Fraud, and TACCP addresses malicious Food Defense threats.'
    },
    {
      q: 'Which technique allows an auditor to test the entire HACCP system by picking one finished batch and tracing all receiving, CCP, calibration, cleaning, and dispatch records from that day?',
      options: [
        'Vertical Auditing (Batch Trace Audit)',
        'Visual Guessing',
        'Financial Auditing',
        'External Marketing Review'
      ],
      correctIndex: 0,
      explanation: 'Vertical auditing traces a single production batch end-to-end across every operational and prerequisite record.'
    }
  ]
};

export const HACCP_3_AND_4_COURSES: InternationalTrainingCourse[] = [
  INTRODUCTION_TO_HACCP_COURSE,
  HACCP_LEVEL_04_COURSE
];

export const HACCP_3_AND_4_HUB_TRAININGS: HubTraining[] =
  HACCP_3_AND_4_COURSES.map(buildHubTrainingFromCourse);
