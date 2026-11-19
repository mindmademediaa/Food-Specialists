import { HubTraining } from '../types/hub';

export interface LightweightCourseSummary {
  id: string;
  code: string;
  title: string;
  levelBadge: string;
  accreditationStandard: string;
  duration: string;
  certificateFeeRs: number;
  description: string;
}

const LEGACY_DIETARY_TITLES = new Set([
  'manager food & dietary',
  'manage food and dietary',
  'certified dietary manager'
]);

export function parseLiveCourseFeeRs(
  tr: Pick<HubTraining, 'certificateFeeRs' | 'fees'>,
  fallbackRs: number
): number {
  if (typeof tr.certificateFeeRs === 'number' && tr.certificateFeeRs > 0) {
    return tr.certificateFeeRs;
  }
  if (tr.fees) {
    const cleaned = tr.fees.replace(/,/g, '');
    const match =
      cleaned.match(/(?:rs\.?|pkr)\s*(\d{2,7})/i) ||
      cleaned.match(/\b(\d{3,7})\b/);
    if (match && match[1]) {
      const parsed = Number(match[1]);
      if (!Number.isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }
  return fallbackRs;
}

export const LIGHTWEIGHT_COURSE_CATALOG: LightweightCourseSummary[] = [
  {
    id: 'cert-2026-haccp-level-03',
    code: 'HACCP-L3',
    title: 'HACCP Level 03',
    levelBadge: 'Visual Interactive Course (15 Modules · 40 MCQs)',
    accreditationStandard: 'Codex Alimentarius CXC 1-1969 • Supervising HACCP Level 03 Standard',
    duration: '15 Interactive Modules + 40-MCQ Final Exam',
    certificateFeeRs: 1000,
    description: 'Comprehensive visual interactive HACCP Level 03 course with 12-Step Codex documents, floor SOPs, and exam.'
  },
  {
    id: 'mgr-food-dietary-2026',
    code: 'CDM-CERT',
    title: 'Certified Dietary Manager',
    levelBadge: 'Visual Interactive Course (15 Modules · Clinical Docs & Drills · 40 MCQs)',
    accreditationStandard: 'ANFP / CBDM Hospital Foodservice & JCI Clinical Nutrition Standard',
    duration: '15 Interactive Modules + 40-MCQ Final Exam',
    certificateFeeRs: 8000,
    description: 'Professional hospital dietary & clinical foodservice management certification with 12 controlled SOPs and exam.'
  },
  {
    id: 'cert-2026-haccp-level-04',
    code: 'HACCP-L4',
    title: 'HACCP Level 04',
    levelBadge: 'Management & Lead Design Certification',
    accreditationStandard: 'Codex Alimentarius CXC 1-1969 • Managing HACCP Level 04',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'Advanced HACCP system design, validation, verification, and management auditing.'
  },
  {
    id: 'cert-2026-food-safety-level-03',
    code: 'FS-L3',
    title: 'Food Safety Level 03',
    levelBadge: 'Supervisory Food Safety Certification',
    accreditationStandard: 'Codex General Principles of Food Hygiene • Level 03',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'Supervisory food safety controls, microbiology, pest control, and compliance.'
  },
  {
    id: 'cert-2026-food-safety-level-04',
    code: 'FS-L4',
    title: 'Food Safety Level 04',
    levelBadge: 'Senior Management Food Safety Certification',
    accreditationStandard: 'Codex & GFSI Senior Food Safety Management Standard',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'Strategic food safety management, outbreak investigation, and legal due diligence.'
  },
  {
    id: 'cert-2026-iso-9001-awareness',
    code: 'ISO-9001-AW',
    title: 'ISO 9001 Awareness Certificate',
    levelBadge: 'International QMS Awareness',
    accreditationStandard: 'ISO 9001:2015 Quality Management Systems',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'ISO 9001:2015 QMS clauses, PDCA cycle, risk-based thinking, and internal auditing.'
  },
  {
    id: 'cert-2026-iso-22000-awareness',
    code: 'ISO-22000-AW',
    title: 'ISO 22000 Awareness Certificate',
    levelBadge: 'International FSMS Awareness',
    accreditationStandard: 'ISO 22000:2018 Food Safety Management Systems',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'ISO 22000:2018 high-level structure, PRPs, OPRPs, CCPs, and FSMS audit readiness.'
  },
  {
    id: 'cert-2026-fssc-22000-v7-awareness',
    code: 'FSSC-V7-AW',
    title: 'FSSC 22000 v7 Awareness Certificate',
    levelBadge: 'GFSI Scheme Awareness',
    accreditationStandard: 'FSSC 22000 Version 6/7 & ISO/TS 22002-1',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'GFSI-recognized FSSC 22000 additional requirements, food fraud, food defense, and culture.'
  },
  {
    id: 'cert-2026-brcgs-issue-09-awareness',
    code: 'BRCGS-I9-AW',
    title: 'BRCGS Food Safety Issue 09 Awareness Certificate',
    levelBadge: 'GFSI Global Retail Standard',
    accreditationStandard: 'BRCGS Global Standard Food Safety Issue 9',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'BRCGS Issue 9 fundamental clauses, food safety culture, high-risk zones, and audit grading.'
  },
  {
    id: 'cert-2026-iso-14001-awareness',
    code: 'ISO-14001-AW',
    title: 'ISO 14001 Awareness Certificate',
    levelBadge: 'Environmental Management System',
    accreditationStandard: 'ISO 14001:2015 Environmental Management Systems',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'Environmental aspects & impacts, life cycle perspective, waste control, and EMS compliance.'
  },
  {
    id: 'cert-2026-iso-45001-awareness',
    code: 'ISO-45001-AW',
    title: 'ISO 45001 Awareness Certificate',
    levelBadge: 'Occupational Health & Safety',
    accreditationStandard: 'ISO 45001:2018 OH&S Management Systems',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'Workplace hazard identification, hierarchy of controls, incident CAPA, and worker safety.'
  },
  {
    id: 'cert-2026-microsoft-office-intro',
    code: 'MS-OFFICE',
    title: 'Introduction to Microsoft Office',
    levelBadge: 'Workplace Productivity Certification',
    accreditationStandard: 'Professional Workplace Digital Competency Standard',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'Practical Word, Excel formulas/dashboards, PowerPoint reporting, and QA documentation tools.'
  },
  {
    id: 'cert-2026-english-proficiency',
    code: 'ENG-PROF',
    title: 'English Language Proficiency Certificate',
    levelBadge: 'Business & Technical English',
    accreditationStandard: 'CEFR Professional & Technical Communication Standard',
    duration: 'Self-Paced · 5 Modules + 40-MCQ Exam',
    certificateFeeRs: 1000,
    description: 'Technical SOP writing, audit reporting, executive email etiquette, and interview communication.'
  }
];

function isDietaryTraining(tr: HubTraining): boolean {
  const rawLowerTitle = (tr.title || '').trim().toLowerCase();
  return (
    tr.id === 'mgr-food-dietary-2026' || LEGACY_DIETARY_TITLES.has(rawLowerTitle)
  );
}

/**
 * Ultra-lightweight live course merger for Home Page & Bundle cards (zero slide/MCQ payload).
 * Mirrors `buildMergedLiveCourses` pricing & ordering rules 100% identically so Home Page
 * and Trainings Academy stay permanently synchronized with Admin Control Panel updates.
 */
export function buildMergedLiveCourseSummaries(
  trainings: HubTraining[]
): LightweightCourseSummary[] {
  const hiddenIds = new Set<string>();
  const hiddenTitles = new Set<string>();

  for (const t of trainings) {
    if (t.isActive === false) {
      hiddenIds.add(t.id);
      if (t.title) hiddenTitles.add(t.title.trim().toLowerCase());
      if (isDietaryTraining(t)) hiddenIds.add('mgr-food-dietary-2026');
    }
  }

  const activeAdminTrainings = trainings.filter((t) => t.isActive !== false);
  const consumedAdminIds = new Set<string>();
  const result: LightweightCourseSummary[] = [];

  for (const baseCourse of LIGHTWEIGHT_COURSE_CATALOG) {
    const baseLower = baseCourse.title.trim().toLowerCase();
    if (hiddenIds.has(baseCourse.id) || hiddenTitles.has(baseLower)) {
      continue;
    }

    const adminMatch = activeAdminTrainings.find((t) => {
      if (consumedAdminIds.has(t.id)) return false;
      const lowerTitle = (t.title || '').trim().toLowerCase();
      return (
        t.id === baseCourse.id ||
        (baseCourse.id === 'mgr-food-dietary-2026' && isDietaryTraining(t)) ||
        lowerTitle === baseLower
      );
    });

    if (adminMatch) {
      consumedAdminIds.add(adminMatch.id);
      const isDietary = isDietaryTraining(adminMatch);
      const rawLower = (adminMatch.title || '').trim().toLowerCase();
      const isLegacyDietaryTitle =
        rawLower === 'manager food & dietary' ||
        rawLower === 'manage food and dietary';
      result.push({
        ...baseCourse,
        id: adminMatch.id,
        title: isLegacyDietaryTitle
          ? 'Certified Dietary Manager'
          : adminMatch.title || baseCourse.title,
        certificateFeeRs: parseLiveCourseFeeRs(
          adminMatch,
          isDietary ? 8000 : baseCourse.certificateFeeRs
        )
      });
    } else {
      result.push(baseCourse);
    }
  }

  for (const customTr of activeAdminTrainings) {
    if (consumedAdminIds.has(customTr.id)) continue;
    consumedAdminIds.add(customTr.id);
    const isDietary = isDietaryTraining(customTr);
    result.push({
      id: customTr.id,
      code: customTr.standardCode || (isDietary ? 'CDM-CERT' : 'FSC-INT'),
      title: customTr.title || 'International Certification',
      levelBadge: customTr.subType || 'International Certification',
      accreditationStandard:
        customTr.accreditationStandard || 'Codex Alimentarius & ISO 22000 Standard',
      duration: customTr.duration || 'Self-Paced Certification',
      certificateFeeRs: parseLiveCourseFeeRs(customTr, isDietary ? 8000 : 1000),
      description: customTr.description || ''
    });
  }

  return result;
}
