export type VisibilityLevel = 'public' | 'private' | 'premium';

export interface ProfileVisibilityMap {
  name: VisibilityLevel;
  title: VisibilityLevel;
  company: VisibilityLevel;
  location: VisibilityLevel;
  bio: VisibilityLevel;
  linkedin: VisibilityLevel;
  cv: VisibilityLevel;
  contact: VisibilityLevel;
  email?: VisibilityLevel;
  whatsapp?: VisibilityLevel;
  education: VisibilityLevel;
  experience: VisibilityLevel;
  certifications: VisibilityLevel;
  projects: VisibilityLevel;
}

export interface HubEducationItem {
  id: string;
  degree: string;
  institute: string;
  startYear: string;
  endYear: string;
  description: string;
  visibility: VisibilityLevel;
}

export interface HubExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  location: string;
  description: string;
  visibility: VisibilityLevel;
}

export interface HubCertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  visibility: VisibilityLevel;
}

export interface HubProjectItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  visibility: VisibilityLevel;
}

export interface PrivacySettings {
  qualification_public: boolean;
  experience_public: boolean;
  currentRole_public: boolean;
  location_public: boolean;
  email_public: boolean;
  phone_public: boolean;
  whatsapp_public?: boolean;
  hireMe_public?: boolean;
}

export type DevRole = 'Guest' | 'Free Member' | 'Paid Member';

export type PaymentVerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';

export type SpecializationTag =
  | 'QA/QC'
  | 'Food Safety'
  | 'Dairy'
  | 'Bakery'
  | 'Nutrition'
  | 'R&D'
  | 'HACCP'
  | 'ISO 22000'
  | 'Food Chemistry';

export interface HubUser {
  uid: string;
  name: string;
  title?: string;
  profilePhotoUrl?: string;
  profilePicUrl: string;
  qualification: string;
  experience: string | HubExperienceItem[];
  experienceItems?: HubExperienceItem[];
  education?: HubEducationItem[];
  certifications?: HubCertificationItem[];
  projects?: HubProjectItem[];
  currentRole: string;
  company: string;
  location: string;
  country?: string;
  bio?: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: string[];
  specializations?: string[];
  cvUrl: string;
  cvFileName?: string;
  cvFileSize?: string;
  cvUploadedAt?: string;
  hireMe?: boolean;
  plan?: 'free' | 'premium';
  isPremium?: boolean;
  profileCompleted?: boolean;
  profileVisibility?: boolean;
  visibility?: ProfileVisibilityMap;
  privacySettings: PrivacySettings;
  createdAt: string;
  isAdmin: boolean;
  isPaid?: boolean;
  paymentStatus?: PaymentVerificationStatus;
  paymentMethod?: string;
  paymentReference?: string;
  paymentAmount?: string;
  receiptImageUrl?: string;
  subscriptionPlan?: string;
  premiumActivatedAt?: string;
  premiumExpiresAt?: string;
  toolsData?: UserToolsData;
}

export interface MealLogItem {
  id: string;
  date: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  foodName: string;
  portion: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
}

export interface DailyMealPlanItem {
  id: string;
  day: string;
  breakfast: string;
  breakfastKcal: number;
  lunch: string;
  lunchKcal: number;
  snack: string;
  snackKcal: number;
  dinner: string;
  dinnerKcal: number;
}

export interface WeightHistoryEntry {
  date: string;
  weightKg: number;
  bmi: number;
}

export interface NutritionPatientVisitEntry {
  visitId: string;
  visitNumber: number;
  visitDate: string;
  visitIso: string;
  weightKg: number;
  targetWeightKg: number;
  bmi: number;
  bmiStatus: string;
  bodyFatPct: number;
  leanBodyMassKg: number;
  dailyCaloriesNeeded: number;
  healthCondition: string;
  prescriptionNotes: string;
}

export interface NutritionPatientRecord {
  id: string;
  patientCode: string;
  patientName: string;
  patientContact?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: string;
  goal: string;
  waterGlasses: number;
  waistCm?: number;
  hipCm?: number;
  neckCm?: number;
  wristCm?: number;
  healthCondition: string;
  prescriptionNotes: string;
  bmi: number;
  bmiStatus: string;
  bodyFatPct: number;
  leanBodyMassKg: number;
  dailyCaloriesNeeded: number;
  savedAt: string;
  updatedAtIso?: string;
  visitHistory?: NutritionPatientVisitEntry[];
}

export interface NutritionProfileData {
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
  goalType: 'lose' | 'maintain' | 'gain';
  waterGlassesToday: number;
  mealLogs: MealLogItem[];
  mealPlans: DailyMealPlanItem[];
  weightHistory: WeightHistoryEntry[];
  patientLogs?: NutritionPatientRecord[];
  updatedAt: string;
}

export interface UserExamAttempt {
  id: string;
  setId: string;
  setTitle: string;
  scoreMarks: number;
  totalMarks: number;
  correctCount: number;
  failedCount?: number;
  unansweredCount?: number;
  totalQuestions: number;
  percentage: number;
  grade: string;
  passed: boolean;
  questionIds?: string[];
  selectedAnswers?: Record<string, number>;
  completedAt: string;
}

export interface UserInterviewSession {
  id: string;
  sessionTitle: string;
  totalQuestions: number;
  preparedCount: number;
  readinessPercentage: number;
  questionIds: string[];
  completedAt: string;
}

export interface UserCourseProgress {
  courseId: string;
  courseTitle: string;
  completedModuleIds: string[];
  lastModuleIndex: number;
  lastAccessedAt: string;
  examPassed: boolean;
  bestExamScore: number;
  bestExamTotal: number;
  bestExamPercentage: number;
  distinctionEarned: boolean;
  examCompletedAt?: string;
  certificateNumber?: string;
  certificateFeePaid?: boolean;
  certificateFeePending?: boolean;
  certificateUnlockedAt?: string;
}

export interface CustomSanitizerItem {
  id: string;
  name: string;
  concentrationPct: number;
  createdAt: string;
}

export interface CustomAcidFactorItem {
  id: string;
  label: string;
  factor: string;
  createdAt: string;
}

export interface LabFormulaSavedRecord {
  id: string;
  recordCode: string;
  recordType: 'ppm' | 'acidity';
  savedDateFormatted: string;
  savedAtIso: string;
  batchOrSampleName: string;
  notes?: string;
  // For 'ppm' (Sanitizer / Chemical Solution)
  sanitizerName?: string;
  stockStrengthPct?: number;
  waterVolumeLiters?: number;
  targetPpm?: number;
  stockMlRequired?: number;
  stockLitersRequired?: number;
  stockMlPerLiter?: number;
  applicationGuide?: string;
  // For 'acidity' (Titratable Acidity & Brix:Acid Ratio)
  acidName?: string;
  acidFactor?: number;
  sampleWeightG?: number;
  naohMl?: number;
  naohNormality?: number;
  sampleBrix?: number;
  acidityPct?: number;
  brixAcidRatio?: number;
}

export interface LabFormulaUserData {
  customSanitizers: CustomSanitizerItem[];
  customAcids: CustomAcidFactorItem[];
  savedRecords: LabFormulaSavedRecord[];
}

export interface UserToolsData {
  nutrition: NutritionProfileData;
  examAttempts: UserExamAttempt[];
  interviewSessions?: UserInterviewSession[];
  seenExamQuestionIds?: string[];
  seenInterviewQuestionIds?: string[];
  masteredInterviewIds: string[];
  bookmarkedInterviewIds: string[];
  courseProgress?: Record<string, UserCourseProgress>;
  labFormulaData?: LabFormulaUserData;
  lastActiveCourseId?: string;
  lastActiveTool?: 'nutrition' | 'exam' | 'interview';
  updatedAt: string;
}

export interface HubCommunityThread {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  topicTag: string;
  title: string;
  preview: string;
  repliesCount: number;
  likesCount: number;
  postedAgo: string;
}

export interface HubPaymentRequest {
  id: string;
  uid: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  qualification: string;
  currentRole: string;
  userQualification?: string;
  userCurrentRole?: string;
  paymentMethod: 'EasyPaisa' | 'JazzCash' | 'Bank Transfer';
  transactionId: string;
  amount: string;
  notes: string;
  receiptImageUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  subscriptionPlan?: string;
  certificateCourseId?: string;
  certificateCourseTitle?: string;
  certificateNumber?: string;
  approvedAt?: string;
  premiumActivatedAt?: string;
  premiumExpiresAt?: string;
}

export interface HubCertificate {
  id: string;
  certificateNumber: string;
  recipientUid?: string;
  recipientName: string;
  recipientEmail: string;
  courseId?: string;
  trainingCategory?: 'Highfield' | 'Lead Auditor' | 'International Certification' | string;
  trainingTitle: string;
  accreditationBody: string;
  issueDate: string;
  scorePercentage?: number;
  distinction?: boolean;
  certificateImageUrl?: string;
  verificationStatus: 'valid' | 'revoked';
  issuedBy: string;
  createdAt?: string;
}

export interface PaymentGatewayConfig {
  jazzCashTitle: string;
  jazzCashNumber: string;
  easyPaisaTitle: string;
  easyPaisaNumber: string;
  bankTitle: string;
  bankName: string;
  bankAccountOrIban: string;
  bankWhatsapp: string;
  monthlyFeeRs: number;
  yearlyFeeRs: number;
  customPriceUpdated?: boolean;
}

export interface CloudStorageConfig {
  provider: 'smart-firestore' | 'cloudinary';
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
  updatedAt: string;
  whatsappChannelUrl?: string;
  whatsappChannelButtonText?: string;
  paymentGateway?: PaymentGatewayConfig;
}

export interface HubChatMessage {
  id: string;
  senderUid: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  chatType: 'admin_support' | 'hiring_contact';
  message: string;
  adminReply?: string;
  createdAt: string;
}

export type JobCategory = 'Production' | 'R&D Lab' | 'Quality & Safety' | (string & {});

export interface HubJob {
  id: string;
  title: string;
  company: string;
  location: string;
  country?: string;
  specialization?: string;
  experienceRequired: string;
  category: JobCategory;
  description: string;
  requirements: string;
  hrEmail?: string;
  emailSubject?: string;
  applicationGuidelines?: string;
  applyLink: string;
  tags: string[];
  postedAt: string;
  expiryAt: string;
  isActive: boolean;
}

export interface HubScholarship {
  id: string;
  title: string;
  organization: string;
  country: string;
  specialization?: string;
  deadline: string;
  fundingType: 'Fellowships' | 'International' | 'Grants';
  degreeLevel: string;
  description: string;
  eligibility: string;
  hrEmail?: string;
  emailSubject?: string;
  applicationGuidelines?: string;
  applyLink: string;
  isActive: boolean;
}

export interface CustomTrainingModule {
  id: string;
  subject: string;
  description: string;
}

export interface CustomTrainingMCQ {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation?: string;
}

export interface HubTraining {
  id: string;
  category: 'Highfield' | 'Lead Auditor' | 'International Certification';
  title: string;
  standardCode?: 'ISO 9001' | 'FSSC 22000' | 'ISO 14001' | 'ISO 45001' | string;
  subType: null | 'Exemplar Global' | 'IRCA | CQI' | string;
  description: string;
  duration: string;
  fees: string;
  enrollLink: string;
  isActive: boolean;
  customModules?: CustomTrainingModule[];
  customMcqs?: CustomTrainingMCQ[];
}

export type NavTab = 'home' | 'search' | 'communities' | 'trainings' | 'tools' | 'profile';




