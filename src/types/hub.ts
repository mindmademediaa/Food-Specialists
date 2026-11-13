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

export type PearsonCalculatorMode =
  | 'beverage'
  | 'dairy'
  | 'sauces_mayo'
  | 'baking_biscuits'
  | 'classic';

export interface PearsonCustomProductItem {
  id: string;
  productName: string;
  industryCategory: string;
  calculatorMode: PearsonCalculatorMode;
  createdAt: string;
}

export interface PearsonBatchSavedRecord {
  id: string;
  recordCode: string;
  calculatorMode: PearsonCalculatorMode;
  industryCategory: string;
  productName: string;
  notes?: string;
  savedDateFormatted: string;
  savedAtIso: string;

  // Mode 1: Juice & Beverage Batch Corrector (Brix, Acidity, pH)
  bevBatchKg?: number;
  bevCurrentBrix?: number;
  bevTargetBrix?: number;
  bevCurrentAcid?: number;
  bevTargetAcid?: number;
  bevCurrentPh?: number;
  bevTargetPh?: number;
  bevSugarSourceBrix?: number;
  bevBrixStatus?: string;
  bevAcidStatus?: string;
  bevPhStatus?: string;
  bevCurrentRatio?: string;
  bevTargetRatio?: string;
  bevAddSugarKg?: number;
  bevAddSugarGrams?: number;
  bevAddAcidKg?: number;
  bevAddAcidGrams?: number;
  bevAddWaterLiters?: number;
  bevFinalBatchKg?: number;
  bevVerifiedBrix?: number;
  bevVerifiedAcid?: number;

  // Mode 2: Dairy Fat & SNF Standardizer
  dairyBatchKg?: number;
  dairyCurrentFat?: number;
  dairyTargetFat?: number;
  dairyCurrentSnf?: number;
  dairyTargetSnf?: number;
  skimMilkFat?: number;
  skimMilkSnf?: number;
  creamFat?: number;
  dairyAddSkimKg?: number;
  dairyAddCreamKg?: number;
  dairyAddSmpKg?: number;
  dairyAddWaterKg?: number;
  dairyFinalMass?: number;

  // Mode 3: Sauces, Ketchup & Mayonnaise Batch Standardizer
  sauceSubType?: 'ketchup_sauce' | 'mayo_emulsion';
  sauceBatchKg?: number;
  sauceCurrentTssOrOil?: number;
  sauceTargetTssOrOil?: number;
  sauceCurrentAcid?: number;
  sauceTargetAcid?: number;
  sauceCurrentSalt?: number;
  sauceTargetSalt?: number;
  sauceCurrentPh?: number;
  sauceTargetPh?: number;
  sauceVinegarStrength?: number;
  sauceAddSolidsOrOilKg?: number;
  sauceAddVinegarKg?: number;
  sauceAddSaltKg?: number;
  sauceAddWaterKg?: number;
  saucePhStatus?: string;
  sauceFinalBatchKg?: number;

  // Mode 4: Baking, Biscuits & Dough Batch Standardizer
  bakingBatchKg?: number;
  bakingCurrentMoisture?: number;
  bakingTargetMoisture?: number;
  bakingCurrentProtein?: number;
  bakingTargetProtein?: number;
  bakingCurrentFat?: number;
  bakingTargetFat?: number;
  bakingCurrentSugar?: number;
  bakingTargetSugar?: number;
  bakingGlutenSourcePct?: number;
  bakingAddWaterLiters?: number;
  bakingAddGlutenKg?: number;
  bakingAddShorteningFatKg?: number;
  bakingAddSugarKg?: number;
  bakingFinalDoughKg?: number;

  // Mode 5: Classic Pearson Square
  psIngredientAName?: string;
  psIngredientBName?: string;
  psHighVal?: number;
  psLowVal?: number;
  psTargetVal?: number;
  psTotalBatch?: number;
  psHighParts?: number;
  psLowParts?: number;
  psHighPct?: number;
  psLowPct?: number;
  psHighAmount?: number;
  psLowAmount?: number;
}

export interface PearsonBatchUserData {
  customProducts: PearsonCustomProductItem[];
  savedBatchRecords: PearsonBatchSavedRecord[];
}

export interface LabMolarityCustomReagentItem {
  id: string;
  name: string;
  mw: number;
  nFactor: number;
  createdAt: string;
}

export interface LabMolaritySavedRecord {
  id: string;
  recordCode: string;
  recordType: 'solid_prep' | 'liquid_dilution';
  solutionName: string;
  notes?: string;
  savedDateFormatted: string;
  savedAtIso: string;

  // Solid Reagent to Molar (M) / Normal (N) Solution
  reagentName?: string;
  mw?: number;
  nFactor?: number;
  concMode?: 'N' | 'M';
  targetConc?: number;
  targetVolMl?: number;
  purityPct?: number;
  eqWeight?: number;
  pureGrams?: number;
  actualGramsToWeigh?: number;
  equivMolarity?: number;
  equivNormality?: number;

  // Liquid Stock Dilution (C1 * V1 = C2 * V2)
  stockC1?: number;
  desiredC2?: number;
  finalV2Ml?: number;
  requiredStockV1Ml?: number;
  waterToAddMl?: number;
}

export interface LabMolarityUserData {
  customReagents: LabMolarityCustomReagentItem[];
  savedRecords: LabMolaritySavedRecord[];
}

export interface MoistureAshSavedRecord {
  id: string;
  recordCode: string;
  sampleName: string;
  productCategory?: string;
  notes?: string;
  savedDateFormatted: string;
  savedAtIso: string;

  // 1. Moisture & Dry Matter
  mEmptyDish?: number;
  mDishPlusWet?: number;
  mDishPlusDry?: number;
  wetSampleG?: number;
  drySampleG?: number;
  waterLossG?: number;
  moistureWetBasis?: number;
  totalSolidsPct?: number;
  moistureDryBasis?: number;

  // 2. Total Ash (Muffle Furnace at 550°C)
  aEmptyCrucible?: number;
  aCruciblePlusSample?: number;
  aCruciblePlusAsh?: number;
  ashSampleG?: number;
  ashResidueG?: number;
  ashWetBasis?: number;
  ashDryBasis?: number;

  // 3. Kjeldahl Nitrogen & Crude Protein
  kSampleWeightG?: number;
  kSampleTitrationMl?: number;
  kBlankTitrationMl?: number;
  kAcidNormality?: number;
  kProteinFactor?: number;
  nitrogenPct?: number;
  crudeProteinPct?: number;
}

export interface MoistureAshUserData {
  savedRecords: MoistureAshSavedRecord[];
}

export interface ProductionFloorSavedRecord {
  id: string;
  recordCode: string;
  plantCompanyName: string;
  lineOrProductName: string;
  shiftName: string;
  productionDate: string; // YYYY-MM-DD
  savedDateFormatted: string;
  savedAtIso: string;
  notes?: string;

  // 1. 1-Hour Machine Efficiency
  machineSpeedTraysPerHour: number;
  oneHourActualTrays: number;
  oneHourEfficiencyPct: number;
  oneHourLostTrays: number;

  // 2. Full-Day Net Efficiency (Start Time, Late Start, Break, CIP, Breakdown, Total Trays)
  scheduledStartTime: string;
  actualStartTime: string;
  totalShiftHours: number;
  lateStartMins: number;
  breakMins: number;
  cipMins: number;
  unplannedDowntimeMins: number;
  totalFullDayTrays: number;
  rejectedTrays: number;
  goodFullDayTrays: number;
  workersCount: number;
  fullDayGrossEfficiencyPct: number;
  fullDayNetOperatingEfficiencyPct: number;
  fullDayOeePct: number;
  traysPerWorkerHour: number;

  // 3. Syrup Room / Preparation Room Batch Efficiency
  syrupUnit: 'Liters' | 'kg';
  syrupPreparedTotal: number;
  syrupPackedTotal: number;
  syrupWasteTotal: number;
  syrupBatchEfficiencyPct: number;
  syrupWastagePct: number;
  syrupCostPerUnit: number;
  syrupWasteCostRs: number;

  // 4. Raw-to-Packed Process Yield
  rawInputKg: number;
  trimmedPreppedKg: number;
  finalPackedKg: number;
  rawCostPerKg: number;
  prepYieldPct: number;
  netProcessYieldPct: number;
  totalLossKg: number;
  totalLossPct: number;
  effectiveRawCostPerFinalKg: number;
}

export interface ProductionFloorUserData {
  defaultPlantName?: string;
  savedRecords: ProductionFloorSavedRecord[];
}

export interface CustomJournalRequirementItem {
  id: string;
  label: string;
  shortName: string;
  hecCategoryOrImpact: string;
  abstractWordLimit: number;
  abstractStructured: boolean;
  keywordsLimit: number;
  headingNumbering: 'numbered' | 'roman' | 'unnumbered';
  includeLiteratureReview: boolean;
  separateResultsAndDiscussion: boolean;
  includeHighlights: boolean;
  includePracticalApplication: boolean;
  includeStatTableInManuscript: boolean;
  inTextFormat: '(Author et al., Year)' | '(Author, Year)' | '[1]' | '(1)';
  referenceStyleId: string;
  customReferenceTemplate: string;
  sortReferencesAlphabetically: boolean;
  sectionOrder: string[];
  guidelinesSummary: string;
  createdAt: string;
}

export interface CustomAnovaRequirementItem {
  id: string;
  name: string;
  designType: 'crd_one_way' | 'rcbd_two_way';
  alphaLevel: '0.05' | '0.01';
  postHocTest: 'LSD' | 'Tukey_HSD' | 'Duncan_DMR';
  summaryFormat: 'mean_sd' | 'mean_se' | 'mean_only';
  decimalPlaces: number;
  replicationsCount: number;
  notes?: string;
  createdAt: string;
}

export interface CustomCitationRequirementItem {
  id: string;
  name: string;
  shortName: string;
  templatePattern: string;
  inTextFormat: '(Author et al., Year)' | '(Author, Year)' | '[1]' | '(1)';
  numberingStyle: 'none' | 'dot_number' | 'bracket_number';
  authorFormat: 'as_entered' | 'uppercase';
  sortAlphabetically: boolean;
  includeDoi: boolean;
  createdAt: string;
}

export interface ResearchSuiteSavedStatRow {
  id: string;
  treatmentName: string;
  rep1: string;
  rep2: string;
  rep3: string;
  rep4: string;
  rep5?: string;
  rep6?: string;
}

export interface ResearchSuiteSavedRecord {
  id: string;
  recordCode: string;
  recordType: 'extracted_paper' | 'journal_manuscript' | 'anova_analysis' | 'reference_list';
  title: string;
  subtitle?: string;
  savedDateFormatted: string;
  savedAtIso: string;
  notes?: string;

  // Extracted Paper / Manuscript fields
  rawPaperText?: string;
  extractedTitle?: string;
  extractedAuthors?: string;
  extractedAbstract?: string;
  extractedKeywords?: string;
  extractedIntro?: string;
  extractedLitReview?: string;
  extractedMethods?: string;
  extractedResults?: string;
  extractedConclusion?: string;
  extractedReferences?: string;

  // Journal Manuscript fields
  targetJournalName?: string;
  targetJournalShortName?: string;
  manuscriptTitle?: string;
  manuscriptAuthors?: string;
  compiledManuscriptText?: string;

  // ANOVA Statistical Analysis fields
  statParameterName?: string;
  statFactorName?: string;
  anovaRequirementName?: string;
  designType?: 'crd_one_way' | 'rcbd_two_way';
  alphaLevel?: '0.05' | '0.01';
  postHocTest?: 'LSD' | 'Tukey_HSD' | 'Duncan_DMR';
  statRows?: ResearchSuiteSavedStatRow[];
  grandMean?: number;
  fCalculated?: number;
  significanceBadge?: string;
  lsdValue?: number;
  cvPct?: number;

  // Reference / Citation List fields
  citationStyleName?: string;
  rawReferencesText?: string;
  formattedReferencesText?: string;
  referencesCount?: number;
}

export interface ResearchSuiteUserData {
  customJournals: CustomJournalRequirementItem[];
  customAnovaPresets: CustomAnovaRequirementItem[];
  customCitationStyles: CustomCitationRequirementItem[];
  savedRecords: ResearchSuiteSavedRecord[];
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
  pearsonBatchData?: PearsonBatchUserData;
  molarityData?: LabMolarityUserData;
  moistureAshData?: MoistureAshUserData;
  productionFloorData?: ProductionFloorUserData;
  researchSuiteData?: ResearchSuiteUserData;
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
  verifiedAt?: string;
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

export interface CustomAdBannerItem {
  id: string;
  badgeText: string;
  headline?: string;
  title?: string;
  subtext?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaText?: string;
  linkUrl?: string;
  ctaLink?: string;
  bannerImageUrl?: string;
  theme?: 'royal-blue' | 'emerald-gold' | 'navy-amber' | 'crimson-alert';
  isActive: boolean;
  createdAt?: string;
}

export interface FrontPageContentConfig {
  heroBadge?: string;
  heroBadgeText?: string;
  heroGreetingSuffix?: string;
  heroCustomGreeting?: string;
  heroSubtitle?: string;
  announcementText?: string;
  showScrollingAds?: boolean;
  showAdBanner?: boolean;
  adScrollSpeedSeconds?: number;
}

export interface ManualRevenueEntry {
  id: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  category: 'subscription' | 'certificate' | 'bundle';
  itemTitle: string;
  amountRs: number;
  paymentMethod: 'JazzCash' | 'EasyPaisa' | 'Bank Transfer' | 'Direct / Cash' | string;
  transactionId: string;
  recordedAt: string;
  notes?: string;
}

export interface CloudStorageConfig {
  provider: 'smart-firestore' | 'cloudinary';
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
  updatedAt: string;
  whatsappChannelUrl?: string;
  whatsappChannelButtonText?: string;
  paymentGateway?: PaymentGatewayConfig;
  customAds?: CustomAdBannerItem[];
  frontPageConfig?: FrontPageContentConfig;
  manualRevenueEntries?: ManualRevenueEntry[];
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
  standardCode?: 'ISO 9001' | 'FSSC 22000' | 'ISO 14001' | 'ISO 45001' | string | null;
  accreditationStandard?: string;
  subType: null | 'Exemplar Global' | 'IRCA | CQI' | string;
  description: string;
  duration: string;
  fees: string;
  certificateFeeRs?: number;
  enrollLink: string;
  isActive: boolean;
  customModules?: CustomTrainingModule[];
  customMcqs?: CustomTrainingMCQ[];
}

export type NavTab = 'home' | 'search' | 'communities' | 'trainings' | 'tools' | 'profile';





