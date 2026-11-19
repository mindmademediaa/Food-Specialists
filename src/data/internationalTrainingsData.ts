import { HubTraining } from '../types/hub';
import {
  MANAGER_FOOD_DIETARY_COURSE,
  MANAGER_FOOD_DIETARY_HUB_TRAINING
} from './managerFoodDietaryCourse';
import {
  HACCP_3_AND_4_COURSES,
  HACCP_3_AND_4_HUB_TRAININGS,
  build40McqsForCourse
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
import {
  HACCP_LEVEL_03_VISUAL_COURSE,
  HACCP_LEVEL_03_VISUAL_HUB_TRAINING
} from './haccpDemoCourse';

export type SlideVisualIllustration =
  | 'instructor-profile'
  | 'course-roadmap'
  | 'four-hazards'
  | 'microbe-spore'
  | 'high-low-risk'
  | 'prp-foundation'
  | 'approved-supplier'
  | 'codex-12-steps'
  | 'team-matrix'
  | 'product-table'
  | 'flow-diagram'
  | 'risk-matrix'
  | 'control-measures'
  | 'ccp-tree-simple'
  | 'ccp-tree-codex'
  | 'critical-limits'
  | 'thermometer-calibration'
  | 'corrective-action'
  | 'verification-audit'
  | 'documentation-records'
  | 'failure-causes'
  | 'exam-technique'
  | 'cdm-care-team'
  | 'cdm-kitchen-zones'
  | 'cdm-therapeutic-diets'
  | 'cdm-iddsi-levels'
  | 'cdm-tray-accuracy'
  | 'cdm-inventory-fifo'
  | 'cdm-emergency-plan'
  | 'cdm-quality-audit';

export interface SlideTableBlock {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface SlideTwoColumnBlock {
  leftTitle: string;
  leftTone?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  leftItems: string[];
  rightTitle: string;
  rightTone?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  rightItems: string[];
}

export interface SlideClassifierItem {
  item: string;
  category: 'Microbiological' | 'Physical' | 'Chemical' | 'Allergenic';
  reason: string;
}

export interface SlideHighLowItem {
  food: string;
  risk: 'High-Risk' | 'Low-Risk';
  reason: string;
}

export interface SlideDefinitionMatch {
  term: string;
  definition: string;
}

export interface SlideTrainerCard {
  name: string;
  credential: string;
  experience: string;
  specialties: string[];
  introNote: string;
}

export interface SlideDocumentTemplateBlock {
  docCode: string;
  version: string;
  codexStepLabel: string;
  docTitle: string;
  purpose: string;
  fields: Array<{ label: string; value: string }>;
  tablePreview?: {
    headers: string[];
    rows: string[][];
  };
  signOffLine: string;
}

export interface SlidePrpProcedureItem {
  prpCode: string;
  prpName: string;
  objective: string;
  steps: string[];
  verificationRecord: string;
}

export interface ModuleQuickCheck {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface CoursePresentationSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  keyTakeaway: string;
  practicalExample?: string;
  visualIllustration?: SlideVisualIllustration;
  calloutBanner?: {
    label: string;
    text: string;
    tone?: 'blue' | 'amber' | 'emerald' | 'rose';
  };
  twoColumns?: SlideTwoColumnBlock;
  tableBlock?: SlideTableBlock;
  documentTemplateBlock?: SlideDocumentTemplateBlock;
  prpProceduresBlock?: SlidePrpProcedureItem[];
  germometerInteractive?: boolean;
  riskMatrixHighlight?: boolean;
  flowDiagramData?: {
    title: string;
    isMultiStream?: boolean;
    mainSteps: Array<{ step: string; note?: string; isCcp?: boolean }>;
    secondarySteps?: Array<{ step: string; note?: string; joinAtIndex: number }>;
  };
  classifierDrill?: SlideClassifierItem[];
  highLowRiskDrill?: SlideHighLowItem[];
  definitionMatchDrill?: SlideDefinitionMatch[];
  trainerCard?: SlideTrainerCard;
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
  quickCheck?: ModuleQuickCheck;
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
        'To rely exclusively on end-product consumer feedback for hazard identification',
        'To substitute prerequisite sanitation programs with quarterly visual inspections',
        'To delegate regulatory compliance responsibility solely to third-party logistics providers'
      ],
      correctIndex: 0,
      explanation: 'An FSMS ensures hazards are systematically identified, evaluated, and controlled to ensure food is safe at the time of consumption.'
    }
  ]
};

export const INTERNATIONAL_TRAINING_COURSES: InternationalTrainingCourse[] = [
  HACCP_LEVEL_03_VISUAL_COURSE,
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
  return build40McqsForCourse(course);
}

const cdmMcqs40 = build40McqsForCourse(MANAGER_FOOD_DIETARY_COURSE);

export const INITIAL_INTERNATIONAL_TRAININGS: HubTraining[] = [
  HACCP_LEVEL_03_VISUAL_HUB_TRAINING,
  {
    ...MANAGER_FOOD_DIETARY_HUB_TRAINING,
    customMcqs: cdmMcqs40.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation
    }))
  },
  ...HACCP_3_AND_4_HUB_TRAININGS,
  ...FOOD_SAFETY_3_AND_4_HUB_TRAININGS,
  ...ISO_9001_22000_FSSC_HUB_TRAININGS,
  ...ISO_14001_45001_BRCGS_HUB_TRAININGS,
  ...OFFICE_AND_ENGLISH_HUB_TRAININGS
];


