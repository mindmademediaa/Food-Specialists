import { HubTraining } from '../types/hub';
import {
  CourseStudyModule,
  DEFAULT_COURSE_TEMPLATE,
  INTERNATIONAL_TRAINING_COURSES,
  InternationalTrainingCourse
} from '../data/internationalTrainingsData';
import { isLegacyHaccpVisualDoc } from '../data/coursesHaccp3And4';

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

function isDietaryTraining(tr: HubTraining): boolean {
  const rawLowerTitle = (tr.title || '').trim().toLowerCase();
  return (
    tr.id === 'mgr-food-dietary-2026' || LEGACY_DIETARY_TITLES.has(rawLowerTitle)
  );
}

function mergeTrainingWithBase(
  customTr: HubTraining,
  baseMatch?: InternationalTrainingCourse
): InternationalTrainingCourse {
  const rawLowerTitle = (customTr.title || '').trim().toLowerCase();
  const isDietaryCourse = isDietaryTraining(customTr);
  const fallbackTemplate = baseMatch || DEFAULT_COURSE_TEMPLATE;
  const isLegacyDietaryTitle =
    rawLowerTitle === 'manager food & dietary' ||
    rawLowerTitle === 'manage food and dietary';
  const normalizedCourseTitle = isLegacyDietaryTitle
    ? 'Certified Dietary Manager'
    : customTr.title || baseMatch?.title || 'Certified Dietary Manager';

  const defaultFeeForCourse = isDietaryCourse
    ? 8000
    : baseMatch?.certificateFeeRs || 1000;
  const liveCourseFeeRs = parseLiveCourseFeeRs(customTr, defaultFeeForCourse);

  const isStaleVisual = Boolean(
    baseMatch && isLegacyHaccpVisualDoc(customTr, baseMatch.modules.length)
  );

  const mappedCustomModules: CourseStudyModule[] =
    !isStaleVisual &&
    customTr.customModules &&
    customTr.customModules.length > 0
      ? customTr.customModules.map((m, idx) => {
          const richBaseMod = baseMatch?.modules.find(
            (bm, bIdx) => bm.id === m.id || bIdx === idx
          );
          const paragraphs = (m.description || '')
            .split(/\n+/)
            .map((p) => p.trim())
            .filter(Boolean);
          if (richBaseMod) {
            return {
              ...richBaseMod,
              id: m.id || richBaseMod.id,
              moduleNumber: idx + 1,
              title: m.subject || richBaseMod.title,
              overview: m.description || richBaseMod.overview,
              keyPrinciples:
                paragraphs.length > 1 ? paragraphs : richBaseMod.keyPrinciples
            };
          }
          return {
            id: m.id || `mod-${idx + 1}`,
            moduleNumber: idx + 1,
            title: m.subject || `Module ${idx + 1}`,
            estimatedMinutes: 30,
            overview:
              m.description ||
              `Core curriculum for ${m.subject || `Module ${idx + 1}`}.`,
            internationalClauses: [
              `${normalizedCourseTitle} — Module ${idx + 1}: ${m.subject}`
            ],
            keyPrinciples:
              paragraphs.length > 0
                ? paragraphs
                : [
                    m.description ||
                      `Core principles and operational requirements for ${m.subject}.`
                  ],
            criticalControlParameters: [
              {
                parameter: m.subject || `Module ${idx + 1}`,
                standardLimit: 'Full Compliance Required',
                correctiveProtocol:
                  m.description ||
                  'Review module study material and verify operational controls.'
              }
            ],
            practicalChecklist:
              paragraphs.length > 0
                ? paragraphs
                : [`Complete study and review of ${m.subject}`]
          };
        })
      : fallbackTemplate.modules;

  return {
    ...fallbackTemplate,
    id: customTr.id,
    code:
      (!isStaleVisual ? customTr.standardCode : undefined) ||
      (isDietaryCourse ? 'CDM-CERT' : baseMatch?.code || 'FSC-INT'),
    title:
      isStaleVisual && baseMatch ? baseMatch.title : normalizedCourseTitle,
    accreditationStandard:
      (!isStaleVisual ? customTr.accreditationStandard : undefined) ||
      baseMatch?.accreditationStandard ||
      fallbackTemplate.accreditationStandard,
    certificateFeeRs: liveCourseFeeRs,
    levelBadge:
      (!isStaleVisual ? customTr.subType : undefined) ||
      baseMatch?.levelBadge ||
      'International Certification',
    description:
      (!isStaleVisual ? customTr.description : undefined) ||
      baseMatch?.description ||
      '',
    modules: mappedCustomModules,
    duration:
      (!isStaleVisual ? customTr.duration : undefined) ||
      baseMatch?.duration ||
      `Self-Paced · ${mappedCustomModules.length} Modules`
  };
}

/**
 * Single source of truth for merging Admin-managed Firestore `trainings`
 * with built-in `INTERNATIONAL_TRAINING_COURSES`.
 * Preserves deterministic canonical ordering so Home Page, Trainings Academy,
 * and Certificate Bundle cards always display 100% synchronized live prices.
 */
export function buildMergedLiveCourses(
  trainings: HubTraining[]
): InternationalTrainingCourse[] {
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
  const result: InternationalTrainingCourse[] = [];

  // 1. Canonical built-in courses first, overridden live by any matching Admin record
  for (const baseCourse of INTERNATIONAL_TRAINING_COURSES) {
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
      result.push(mergeTrainingWithBase(adminMatch, baseCourse));
    } else {
      result.push(baseCourse);
    }
  }

  // 2. Append any newly added Admin-only custom courses
  for (const customTr of activeAdminTrainings) {
    if (consumedAdminIds.has(customTr.id)) continue;
    consumedAdminIds.add(customTr.id);
    result.push(mergeTrainingWithBase(customTr, undefined));
  }

  return result;
}
