import { HubTraining } from '../types/hub';
import {
  MANAGER_FOOD_DIETARY_COURSE,
  MANAGER_FOOD_DIETARY_HUB_TRAINING
} from './managerFoodDietaryCourse';
import {
  HACCP_3_AND_4_COURSES,
  HACCP_3_AND_4_HUB_TRAININGS
} from './coursesHaccp3And4';
import {
  FOOD_SAFETY_3_AND_4_COURSES,
  FOOD_SAFETY_3_AND_4_HUB_TRAININGS
} from './coursesFoodSafety3And4';
import {
  ISO_9001_22000_FSSC_COURSES,
  ISO_9001_22000_FSSC_HUB_TRAININGS
} from './coursesIso9001And22000AndFssc';
import {
  ISO_14001_45001_BRCGS_COURSES,
  ISO_14001_45001_BRCGS_HUB_TRAININGS
} from './coursesIso14001And45001AndBrcgs';
import {
  OFFICE_AND_ENGLISH_COURSES,
  OFFICE_AND_ENGLISH_HUB_TRAININGS
} from './coursesOfficeAndEnglish';

export interface CoursePresentationSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  keyTakeaway: string;
  practicalExample?: string;
}

export interface CourseStudyModule {
  id: string;
  moduleNumber: number;
  title: string;
  estimatedMinutes: number;
  overview: string;
  internationalClauses: string[];
  keyPrinciples: string[];
  criticalControlParameters: Array<{
    parameter: string;
    standardLimit: string;
    correctiveProtocol: string;
  }>;
  practicalChecklist: string[];
  presentationSlides?: CoursePresentationSlide[];
}

export interface CourseExamMCQ {
  id: string;
  questionNumber: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface InternationalTrainingCourse {
  id: string;
  code: string;
  title: string;
  levelBadge: string;
  accreditationStandard: string;
  duration: string;
  certificateFeeRs: number;
  passPercentage: number;
  distinctionPercentage: number;
  totalExamQuestions: number;
  description: string;
  modules: CourseStudyModule[];
  coreExamPool: Array<{
    q: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  }>;
}

/**
 * Fallback template used when a new custom training is added by the Admin or user later,
 * ensuring that Course Study, Exam, My Certificates, and Portrait PDF Certificate generation work seamlessly.
 */
export const DEFAULT_COURSE_TEMPLATE: InternationalTrainingCourse = {
  id: 'default-course-template',
  code: 'FSC-INT',
  title: 'International Food Safety & Quality Certification',
  levelBadge: 'International Certification',
  accreditationStandard: 'Codex Alimentarius CXC 1-1969 & ISO 22000 Standard',
  duration: 'Self-Paced Certification',
  certificateFeeRs: 1000,
  passPercentage: 60,
  distinctionPercentage: 75,
  totalExamQuestions: 40,
  description: 'Professional Food Safety and Quality Management System Certification.',
  modules: [
    {
      id: 'mod-1',
      moduleNumber: 1,
      title: 'Module 1: Core Food Safety Principles & Regulatory Compliance',
      estimatedMinutes: 60,
      overview: 'Core principles, regulatory requirements, and operational standards for food safety management.',
      internationalClauses: ['Codex Alimentarius CXC 1-1969', 'ISO 22000:2018'],
      keyPrinciples: [
        'Establish and maintain prerequisite programs (PRPs) and operational controls.',
        'Conduct hazard analysis and monitor critical control limits with calibrated instruments.',
        'Maintain verifiable documentation and traceability records for regulatory due diligence.'
      ],
      criticalControlParameters: [
        {
          parameter: 'Critical Control Limit Monitoring',
          standardLimit: '100% compliance with validated time, temperature, and sanitation limits',
          correctiveProtocol: 'Isolate non-conforming product, restore process control, and document root cause.'
        }
      ],
      practicalChecklist: [
        'Verify daily calibration and sanitation monitoring logs.',
        'Confirm traceability and corrective action records are signed and archived.'
      ]
    }
  ],
  coreExamPool: [
    {
      q: 'What is the primary objective of an accredited Food Safety Management System (FSMS)?',
      options: [
        'To systematically identify, evaluate, and control food safety hazards across the food chain',
        'To eliminate the need for employee hygiene training',
        'To replace all laboratory testing with visual checks only',
        'To increase product weight without labeling'
      ],
      correctIndex: 0,
      explanation: 'An FSMS ensures hazards are systematically identified, evaluated, and controlled to ensure food is safe at the time of consumption.'
    }
  ]
};

export const INTERNATIONAL_TRAINING_COURSES: InternationalTrainingCourse[] = [
  MANAGER_FOOD_DIETARY_COURSE,
  ...HACCP_3_AND_4_COURSES,
  ...FOOD_SAFETY_3_AND_4_COURSES,
  ...ISO_9001_22000_FSSC_COURSES,
  ...ISO_14001_45001_BRCGS_COURSES,
  ...OFFICE_AND_ENGLISH_COURSES
];

export function get40CourseExamQuestions(courseId: string): CourseExamMCQ[] {
  const course =
    INTERNATIONAL_TRAINING_COURSES.find((c) => c.id === courseId) ||
    DEFAULT_COURSE_TEMPLATE;

  const generated: Array<{
    q: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  }> = [];

  for (const item of course.coreExamPool) {
    generated.push(item);
  }

  for (const mod of course.modules) {
    for (const ccp of mod.criticalControlParameters) {
      generated.push({
        q: `In ${course.title} (${mod.title}), what is the required standard limit or rule for "${ccp.parameter}"?`,
        options: [
          ccp.standardLimit,
          'No limit is required unless a customer complains',
          'Visual inspection once every 6 months without documentation',
          'Operate at ambient room condition without calibration'
        ],
        correctIndex: 0,
        explanation: `For ${ccp.parameter}, the standard requirement is: ${ccp.standardLimit}. Action: ${ccp.correctiveProtocol}`
      });

      generated.push({
        q: `During an operational check in ${course.title}, if "${ccp.parameter}" deviates from its standard requirement, what action applies?`,
        options: [
          'Continue operations and note it at the end of the month',
          ccp.correctiveProtocol,
          'Delete the monitoring log entry so auditors do not see it',
          'Ship the batch immediately without review'
        ],
        correctIndex: 1,
        explanation: `When ${ccp.parameter} deviates, the required protocol is: ${ccp.correctiveProtocol}`
      });
    }

    if (mod.presentationSlides) {
      for (const sl of mod.presentationSlides) {
        generated.push({
          q: `According to Module ${mod.moduleNumber} (${sl.title}) of ${course.title}, which key takeaway is accurate?`,
          options: [
            sl.keyTakeaway,
            'Skip all daily monitoring and documentation',
            'Ignore safety and quality procedures during peak hours',
            'Training and supervision are never required'
          ],
          correctIndex: 0,
          explanation: sl.keyTakeaway
        });
      }
    }

    for (let i = 0; i < mod.keyPrinciples.length; i++) {
      const principle = mod.keyPrinciples[i];
      generated.push({
        q: `According to Module ${mod.moduleNumber} (${mod.title}) of ${course.title}, which of the following statements is compliant?`,
        options: [
          principle,
          'Documentation and calibration are optional during night shifts',
          'Quarantined non-conforming batches can be blended into retail packs without safety evaluation',
          'Sanitizers are effective on heavily greased surfaces without pre-cleaning'
        ],
        correctIndex: 0,
        explanation: principle
      });
    }
  }

  while (generated.length < 40) {
    generated.push(
      course.coreExamPool[generated.length % course.coreExamPool.length] ||
        DEFAULT_COURSE_TEMPLATE.coreExamPool[0]
    );
  }

  return generated.slice(0, 40).map((item, idx) => ({
    id: `${course.id}-q-${idx + 1}`,
    questionNumber: idx + 1,
    question: item.q,
    options: [...item.options] as [string, string, string, string],
    correctIndex: item.correctIndex,
    explanation: item.explanation
  }));
}

export const INITIAL_INTERNATIONAL_TRAININGS: HubTraining[] = [
  MANAGER_FOOD_DIETARY_HUB_TRAINING,
  ...HACCP_3_AND_4_HUB_TRAININGS,
  ...FOOD_SAFETY_3_AND_4_HUB_TRAININGS,
  ...ISO_9001_22000_FSSC_HUB_TRAININGS,
  ...ISO_14001_45001_BRCGS_HUB_TRAININGS,
  ...OFFICE_AND_ENGLISH_HUB_TRAININGS
];


