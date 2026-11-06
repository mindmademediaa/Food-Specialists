import React, { useState, useMemo } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Crown,
  Download,
  FileText,
  Flame,
  Heart,
  Lock,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Utensils,
  X
} from 'lucide-react';
import {
  DailyMealPlanItem,
  HubUser,
  MealLogItem,
  NutritionProfileData,
  UserExamAttempt,
  UserToolsData
} from '../types/hub';
import {
  computeNutritionMetrics,
  DEFAULT_USER_TOOLS_DATA,
  EXAM_PREP_SETS,
  ExamPrepSet,
  PRESET_MEAL_PLANS,
  QUICK_FOOD_PRESETS
} from '../data/examPrepData';
import {
  INTERVIEW_PREP_SETS,
  InterviewPrepSet
} from '../data/interviewPrepData';
import {
  downloadExamReportPdf,
  downloadInterviewSetPdf,
  downloadNutritionReportPdf
} from '../lib/toolsPdfGenerator';

export type ActiveToolSection = 'hub' | 'nutrition' | 'exam' | 'interview';

interface ToolsHubViewProps {
  user: HubUser;
  isUserPaid: boolean;
  hasExpiredPremium: boolean;
  monthlyFeeRs: number;
  yearlyFeeRs: number;
  initialSection?: ActiveToolSection;
  onSaveToolsData: (updatedToolsData: UserToolsData) => Promise<void>;
  onOpenPremiumModal: () => void;
  onGoToProfileTools?: () => void;
}

export const ToolsHubView: React.FC<ToolsHubViewProps> = ({
  user,
  isUserPaid,
  hasExpiredPremium,
  monthlyFeeRs,
  yearlyFeeRs,
  initialSection = 'hub',
  onSaveToolsData,
  onOpenPremiumModal,
  onGoToProfileTools
}) => {
  // Normalize user's saved toolsData with defaults
  const toolsData: UserToolsData = useMemo(() => {
    const saved = user.toolsData;
    if (!saved) return DEFAULT_USER_TOOLS_DATA;
    return {
      ...DEFAULT_USER_TOOLS_DATA,
      ...saved,
      nutrition: {
        ...DEFAULT_USER_TOOLS_DATA.nutrition,
        ...(saved.nutrition || {}),
        mealLogs:
          saved.nutrition?.mealLogs || DEFAULT_USER_TOOLS_DATA.nutrition.mealLogs,
        mealPlans:
          saved.nutrition?.mealPlans ||
          DEFAULT_USER_TOOLS_DATA.nutrition.mealPlans,
        weightHistory:
          saved.nutrition?.weightHistory ||
          DEFAULT_USER_TOOLS_DATA.nutrition.weightHistory
      },
      examAttempts: saved.examAttempts || [],
      masteredInterviewIds: saved.masteredInterviewIds || [],
      bookmarkedInterviewIds: saved.bookmarkedInterviewIds || []
    };
  }, [user.toolsData]);

  // If user is NOT paid (Free user or Expired Premium), force section to 'hub' and show lock modal on any tool click
  const [activeSection, setActiveSection] = useState<ActiveToolSection>(() =>
    isUserPaid ? initialSection : 'hub'
  );
  const [lockedToolPromptTitle, setLockedToolPromptTitle] = useState<
    string | null
  >(null);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // ==================== NUTRITION TOOL STATE ====================
  const [nutriTab, setNutriTab] = useState<
    'bmi-graph' | 'calories' | 'meal-plan'
  >('bmi-graph');
  const [heightInput, setHeightInput] = useState<string>(
    String(toolsData.nutrition.heightCm || 172)
  );
  const [weightInput, setWeightInput] = useState<string>(
    String(toolsData.nutrition.weightKg || 76)
  );
  const [targetWeightInput, setTargetWeightInput] = useState<string>(
    String(toolsData.nutrition.targetWeightKg || 68)
  );
  const [ageInput, setAgeInput] = useState<string>(
    String(toolsData.nutrition.age || 27)
  );
  const [genderInput, setGenderInput] = useState<'male' | 'female'>(
    toolsData.nutrition.gender || 'male'
  );
  const [activityInput, setActivityInput] = useState<
    NutritionProfileData['activityLevel']
  >(toolsData.nutrition.activityLevel || 'moderate');
  const [newWeightLogInput, setNewWeightLogInput] = useState<string>('');

  // Custom Meal Log Inputs
  const [mealTypeInput, setMealTypeInput] = useState<
    'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  >('Breakfast');
  const [foodNameInput, setFoodNameInput] = useState<string>('');
  const [portionInput, setPortionInput] = useState<string>('1 serving');
  const [caloriesInput, setCaloriesInput] = useState<string>('');
  const [proteinInput, setProteinInput] = useState<string>('');
  const [carbsInput, setCarbsInput] = useState<string>('');
  const [fatsInput, setFatsInput] = useState<string>('');

  // ==================== EXAM PREP TOOL STATE ====================
  const [selectedExamSetId, setSelectedExamSetId] =
    useState<string>('exam-set-1');
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [instantFeedbackMode, setInstantFeedbackMode] = useState<boolean>(true);
  const [submittedExamResult, setSubmittedExamResult] =
    useState<UserExamAttempt | null>(null);
  const [examFilterMode, setExamFilterMode] = useState<
    'all' | 'unanswered' | 'incorrect'
  >('all');

  // ==================== INTERVIEW PREP TOOL STATE ====================
  const [selectedInterviewSetId, setSelectedInterviewSetId] =
    useState<string>('interview-set-1');
  const [interviewSearch, setInterviewSearch] = useState<string>('');
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>([
    'int-1-01',
    'int-1-02',
    'int-2-01',
    'int-3-01',
    'int-4-01',
    'int-5-01'
  ]);

  // Live computed nutrition metrics
  const liveNutritionState: NutritionProfileData = useMemo(
    () => ({
      ...toolsData.nutrition,
      heightCm: Number(heightInput) || toolsData.nutrition.heightCm || 172,
      weightKg: Number(weightInput) || toolsData.nutrition.weightKg || 76,
      targetWeightKg:
        Number(targetWeightInput) || toolsData.nutrition.targetWeightKg || 68,
      age: Number(ageInput) || toolsData.nutrition.age || 27,
      gender: genderInput,
      activityLevel: activityInput
    }),
    [
      toolsData.nutrition,
      heightInput,
      weightInput,
      targetWeightInput,
      ageInput,
      genderInput,
      activityInput
    ]
  );

  const metrics = useMemo(
    () => computeNutritionMetrics(liveNutritionState),
    [liveNutritionState]
  );

  const activeExamSet: ExamPrepSet = useMemo(
    () =>
      EXAM_PREP_SETS.find((s) => s.id === selectedExamSetId) ||
      EXAM_PREP_SETS[0],
    [selectedExamSetId]
  );

  const activeInterviewSet: InterviewPrepSet = useMemo(
    () =>
      INTERVIEW_PREP_SETS.find((s) => s.id === selectedInterviewSetId) ||
      INTERVIEW_PREP_SETS[0],
    [selectedInterviewSetId]
  );

  const triggerBanner = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 4000);
  };

  // Gate handler: If Free user or Expired Premium clicks any tool, show Premium Upgrade Prompt
  const handleTryOpenTool = (
    section: ActiveToolSection,
    toolLabel: string,
    optionalSetId?: string
  ) => {
    if (!isUserPaid) {
      setLockedToolPromptTitle(toolLabel);
      return;
    }
    if (section === 'exam' && optionalSetId) {
      setSelectedExamSetId(optionalSetId);
      setExamAnswers({});
      setSubmittedExamResult(null);
    }
    if (section === 'interview' && optionalSetId) {
      setSelectedInterviewSetId(optionalSetId);
    }
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==================== NUTRITION HANDLERS ====================
  const handleSaveBiometrics = async () => {
    if (!isUserPaid) {
      setLockedToolPromptTitle('Nutrition & BMI Health Tracker');
      return;
    }
    const h = Math.min(240, Math.max(110, Number(heightInput) || 172));
    const w = Math.min(250, Math.max(30, Number(weightInput) || 76));
    const tw = Math.min(220, Math.max(35, Number(targetWeightInput) || 68));
    const a = Math.min(100, Math.max(14, Number(ageInput) || 27));
    const bmiVal = Number((w / ((h / 100) * (h / 100))).toFixed(1));
    const todayLabel = new Date().toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short'
    });

    const existingHist = toolsData.nutrition.weightHistory || [];
    const updatedHistory = [
      ...existingHist.filter((item) => item.date !== todayLabel).slice(-7),
      { date: todayLabel, weightKg: w, bmi: bmiVal }
    ];

    const nextTools: UserToolsData = {
      ...toolsData,
      lastActiveTool: 'nutrition',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z',
      nutrition: {
        ...toolsData.nutrition,
        heightCm: h,
        weightKg: w,
        targetWeightKg: tw,
        age: a,
        gender: genderInput,
        activityLevel: activityInput,
        goalType: w > tw + 1 ? 'lose' : w < tw - 1 ? 'gain' : 'maintain',
        weightHistory: updatedHistory,
        updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
      }
    };

    await onSaveToolsData(nextTools);
    triggerBanner(
      `Health Profile & BMI (${bmiVal}) saved to your User Profile!`
    );
  };

  const handleLogWeightPoint = async () => {
    const w = Number(newWeightLogInput);
    if (!w || w < 30 || w > 250) return;
    const h = liveNutritionState.heightCm || 172;
    const bmiVal = Number((w / ((h / 100) * (h / 100))).toFixed(1));
    const label = new Date().toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short'
    });

    setWeightInput(String(w));
    setNewWeightLogInput('');

    const updatedHistory = [
      ...(toolsData.nutrition.weightHistory || []).slice(-7),
      { date: label, weightKg: w, bmi: bmiVal }
    ];

    const nextTools: UserToolsData = {
      ...toolsData,
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z',
      nutrition: {
        ...liveNutritionState,
        weightKg: w,
        weightHistory: updatedHistory,
        updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
      }
    };
    await onSaveToolsData(nextTools);
    triggerBanner(`Logged ${w} kg (BMI ${bmiVal}) to your Weight Graph!`);
  };

  const handleQuickAddPresetFood = async (
    preset: (typeof QUICK_FOOD_PRESETS)[number]
  ) => {
    const newItem: MealLogItem = {
      id: `meal-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      mealType: preset.defaultMeal,
      foodName: preset.name,
      portion: preset.portion,
      calories: preset.calories,
      proteinG: preset.proteinG,
      carbsG: preset.carbsG,
      fatsG: preset.fatsG
    };
    const nextLogs = [newItem, ...(toolsData.nutrition.mealLogs || [])].slice(
      0,
      40
    );
    const nextTools: UserToolsData = {
      ...toolsData,
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z',
      nutrition: {
        ...liveNutritionState,
        mealLogs: nextLogs,
        updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
      }
    };
    await onSaveToolsData(nextTools);
    triggerBanner(`Added "${preset.name}" (+${preset.calories} kcal) to your log!`);
  };

  const handleAddCustomMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodNameInput.trim() || !caloriesInput) return;
    const newItem: MealLogItem = {
      id: `meal-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      mealType: mealTypeInput,
      foodName: foodNameInput.trim().slice(0, 120),
      portion: portionInput.trim().slice(0, 60) || '1 serving',
      calories: Math.max(0, Number(caloriesInput) || 0),
      proteinG: Math.max(0, Number(proteinInput) || 0),
      carbsG: Math.max(0, Number(carbsInput) || 0),
      fatsG: Math.max(0, Number(fatsInput) || 0)
    };
    const nextLogs = [newItem, ...(toolsData.nutrition.mealLogs || [])].slice(
      0,
      40
    );
    const nextTools: UserToolsData = {
      ...toolsData,
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z',
      nutrition: {
        ...liveNutritionState,
        mealLogs: nextLogs,
        updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
      }
    };
    await onSaveToolsData(nextTools);
    setFoodNameInput('');
    setCaloriesInput('');
    setProteinInput('');
    setCarbsInput('');
    setFatsInput('');
    triggerBanner(`Logged "${newItem.foodName}" (+${newItem.calories} kcal) & saved to Profile!`);
  };

  const handleDeleteMealLog = async (id: string) => {
    const nextLogs = (toolsData.nutrition.mealLogs || []).filter(
      (m) => m.id !== id
    );
    const nextTools: UserToolsData = {
      ...toolsData,
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z',
      nutrition: {
        ...liveNutritionState,
        mealLogs: nextLogs,
        updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
      }
    };
    await onSaveToolsData(nextTools);
  };

  const handleUpdateWaterGlasses = async (delta: number) => {
    const nextWater = Math.min(
      16,
      Math.max(0, (toolsData.nutrition.waterGlassesToday || 0) + delta)
    );
    const nextTools: UserToolsData = {
      ...toolsData,
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z',
      nutrition: {
        ...liveNutritionState,
        waterGlassesToday: nextWater,
        updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
      }
    };
    await onSaveToolsData(nextTools);
  };

  const handleApplyMealPlanPreset = async (
    planType: 'lose' | 'maintain' | 'gain'
  ) => {
    const chosenPlans: DailyMealPlanItem[] = PRESET_MEAL_PLANS[planType];
    const nextTools: UserToolsData = {
      ...toolsData,
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z',
      nutrition: {
        ...liveNutritionState,
        goalType: planType,
        mealPlans: chosenPlans,
        updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
      }
    };
    await onSaveToolsData(nextTools);
    triggerBanner(
      `Applied ${
        planType === 'lose'
          ? 'Weight Reduction (Calorie Deficit)'
          : planType === 'gain'
          ? 'Healthy Weight Gain (High-Protein Surplus)'
          : 'Balanced Maintenance'
      } Meal Plan & saved to Profile!`
    );
  };

  // ==================== EXAM PREP HANDLERS ====================
  const handleSelectMcqOption = (questionId: string, optionIdx: number) => {
    setExamAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleSubmitExamAttempt = async () => {
    let correctCount = 0;
    let scoreMarks = 0;
    activeExamSet.questions.forEach((q) => {
      if (examAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
        scoreMarks += q.marks;
      }
    });

    const totalMarks = activeExamSet.totalMarks;
    const percentage = Math.round((scoreMarks / totalMarks) * 100);
    const passed = percentage >= activeExamSet.passingPercentage;
    let grade = 'F (Needs Revision)';
    if (percentage >= 90) grade = 'A+ (Distinction)';
    else if (percentage >= 80) grade = 'A (Excellent)';
    else if (percentage >= 70) grade = 'B (Very Good)';
    else if (percentage >= 60) grade = 'C (Qualified Pass)';

    const attempt: UserExamAttempt = {
      id: `attempt-${activeExamSet.id}-${Date.now()}`,
      setId: activeExamSet.id,
      setTitle: activeExamSet.title,
      scoreMarks,
      totalMarks,
      correctCount,
      totalQuestions: activeExamSet.totalQuestions,
      percentage,
      grade,
      passed,
      completedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };

    setSubmittedExamResult(attempt);

    const nextAttempts = [attempt, ...(toolsData.examAttempts || [])].slice(
      0,
      25
    );
    const nextTools: UserToolsData = {
      ...toolsData,
      lastActiveTool: 'exam',
      examAttempts: nextAttempts,
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    await onSaveToolsData(nextTools);
    triggerBanner(
      `Exam Graded: ${scoreMarks}/${totalMarks} Marks (${percentage}% — ${grade}) saved to your User Profile!`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==================== INTERVIEW PREP HANDLERS ====================
  const handleToggleMasteredQuestion = async (qId: string) => {
    const exists = toolsData.masteredInterviewIds.includes(qId);
    const nextMastered = exists
      ? toolsData.masteredInterviewIds.filter((id) => id !== qId)
      : [...toolsData.masteredInterviewIds, qId];

    const nextTools: UserToolsData = {
      ...toolsData,
      lastActiveTool: 'interview',
      masteredInterviewIds: nextMastered,
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    await onSaveToolsData(nextTools);
  };

  const toggleExpandInterviewQ = (qId: string) => {
    setExpandedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // SVG Weight Graph Coordinate Calculation
  const graphPoints = useMemo(() => {
    const rawHist = liveNutritionState.weightHistory || [];
    const curW = liveNutritionState.weightKg || 76;
    const targW = liveNutritionState.targetWeightKg || metrics.idealMidKg;

    // Build 6 points: historical + current + projected 4-week & 8-week goal
    const midGoalW = Number(((curW + targW) / 2).toFixed(1));
    const pts = [
      ...(rawHist.length > 0
        ? rawHist.slice(-4)
        : [
            { date: 'Start', weightKg: curW + 1.5, bmi: metrics.bmi + 0.5 },
            { date: 'Today', weightKg: curW, bmi: metrics.bmi }
          ]),
      {
        date: 'Goal Wk 4',
        weightKg: midGoalW,
        bmi: Number(
          (
            midGoalW /
            Math.pow((liveNutritionState.heightCm || 172) / 100, 2)
          ).toFixed(1)
        )
      },
      {
        date: 'Target Goal',
        weightKg: targW,
        bmi: Number(
          (
            targW / Math.pow((liveNutritionState.heightCm || 172) / 100, 2)
          ).toFixed(1)
        )
      }
    ];

    const allWeights = pts.map((p) => p.weightKg).concat([targW, metrics.healthyMinKg, metrics.healthyMaxKg]);
    const minW = Math.floor(Math.min(...allWeights) - 4);
    const maxW = Math.ceil(Math.max(...allWeights) + 4);
    const range = Math.max(8, maxW - minW);

    const width = 360;
    const height = 140;
    const padX = 28;
    const padY = 22;

    const coords = pts.map((p, idx) => {
      const x =
        padX +
        (idx / Math.max(1, pts.length - 1)) * (width - padX * 2);
      const y =
        height -
        padY -
        ((p.weightKg - minW) / range) * (height - padY * 2);
      return { ...p, x, y, isProjected: idx >= pts.length - 2 };
    });

    const targetY =
      height -
      padY -
      ((targW - minW) / range) * (height - padY * 2);

    return { coords, targetY, targW, minW, maxW, width, height };
  }, [liveNutritionState, metrics]);

  return (
    <div className="space-y-4 px-0.5 pb-4">
      {/* SAVE FEEDBACK BANNER */}
      {saveBanner && (
        <div className="p-3 rounded-2xl bg-[#0E9F6E] text-white text-xs font-extrabold flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveBanner(null)}
            className="text-white/90 hover:text-white underline text-[11px] cursor-pointer"
          >
            OK
          </button>
        </div>
      )}

      {/* ==================== UNIFIED TOOLS HUB OVERVIEW PAGE ==================== */}
      {activeSection === 'hub' && (
        <div className="space-y-4">
          {/* Top Hero Card */}
          <div className="bg-gradient-to-r from-[#0D2E1B] via-[#13422B] to-[#0E7A46] rounded-[22px] p-4 sm:p-5 text-white shadow-md space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-[#A7F3D0] text-[10.5px] font-extrabold uppercase tracking-wider">
                Food Specialist Career &amp; Health Suite
              </span>
              {isUserPaid ? (
                <span className="px-2.5 py-0.5 rounded-full bg-[#25D366] text-[#072614] text-[10.5px] font-extrabold inline-flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>Premium Unlocked ✓</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onOpenPremiumModal}
                  className="px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-[#0D2E1B] text-[10.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Lock className="w-3 h-3" />
                  <span>
                    {hasExpiredPremium
                      ? 'Expired — Renew Premium'
                      : 'Free Preview — Unlock All Tools'}
                  </span>
                </button>
              )}
            </div>

            <h1 className="text-[19px] sm:text-[22px] font-extrabold leading-tight">
              Specialist Tools, Exam &amp; Interview Hub
            </h1>
            <p className="text-[11.5px] sm:text-[12.5px] text-emerald-100/95 font-medium leading-relaxed">
              Click any tool below to open it. All your BMI &amp; nutrition logs, meal plans, exam marks, and interview progress are automatically saved in your User Profile Control Panel.
            </p>

            {/* Expired or Free Member Notice Strip */}
            {!isUserPaid && (
              <div className="p-3 rounded-xl bg-amber-400/15 border border-amber-300/40 flex items-center justify-between gap-2.5 flex-wrap">
                <div className="text-[11.5px] font-bold text-amber-100 leading-snug flex-1 min-w-[200px]">
                  {hasExpiredPremium ? (
                    <span>
                      ⚠️ <strong>Your Paid Premium Membership has ended.</strong> Renew Premium to unlock Nutrition Tracker, 250 Exam MCQs &amp; 100 Interview Q&amp;As.
                    </span>
                  ) : (
                    <span>
                      🔒 <strong>Free Member View:</strong> You can browse all tools &amp; sets below. Upgrade to Paid Premium (Rs. {monthlyFeeRs}/mo or Rs. {yearlyFeeRs}/yr) to open &amp; use them.
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onOpenPremiumModal}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0D2E1B] text-[11px] font-extrabold shrink-0 cursor-pointer"
                >
                  Buy Premium →
                </button>
              </div>
            )}
          </div>

          {/* ==================== TOOL CARD 1: NUTRITION & DAILY PERSONAL HEALTH TRACKER ==================== */}
          <div
            onClick={() =>
              handleTryOpenTool(
                'nutrition',
                'Daily Personal Health & Nutrition Tracker'
              )
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTryOpenTool(
                  'nutrition',
                  'Daily Personal Health & Nutrition Tracker'
                );
              }
            }}
            className="bg-white border-[1.5px] border-[#CBE3D6] hover:border-[#0E9F6E] rounded-[22px] p-4 sm:p-5 shadow-[0_6px_22px_rgba(19,66,43,0.06)] transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#ECF4EF] pb-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-12 h-12 rounded-[16px] bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E9F6E]">
                      Tool 01 • Personal Health &amp; Dietetics
                    </span>
                    {!isUserPaid && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold inline-flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Premium</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#0F291E] leading-snug mt-0.5">
                    Daily Personal Health &amp; Nutrition Tracker
                  </h2>
                  <p className="text-[12px] text-[#5C7267] font-medium mt-0.5 leading-snug">
                    Calorie Counter, Meal Planner, BMI Calculator, Weight Gain/Reduce Graph &amp; Full Nutrition PDF Report Download.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Live Stats Preview */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#F4FAF6] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267] uppercase">
                  Current BMI
                </div>
                <div className="text-sm sm:text-base font-extrabold text-[#0F291E] tabular-nums mt-0.5">
                  {metrics.bmi}{' '}
                  <span className="text-[10px] font-bold text-[#0E9F6E]">
                    ({metrics.bmiCategory.split(' ')[0]})
                  </span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF6] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267] uppercase">
                  Weight Goal
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-[#0E9F6E] tabular-nums mt-0.5">
                  {metrics.weightAction}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF6] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267] uppercase">
                  Daily Target
                </div>
                <div className="text-sm sm:text-base font-extrabold text-[#0F291E] tabular-nums mt-0.5">
                  {metrics.dailyTargetKcal} kcal
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-[11.5px] font-bold text-[#4B6356]">
                BMI Graph • Calorie Counter • Meal Plan • PDF Report
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-[12px] font-extrabold inline-flex items-center gap-1.5 shrink-0 shadow-xs">
                {!isUserPaid && <Lock className="w-3.5 h-3.5" />}
                <span>Open Nutrition App</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            </div>
          </div>

          {/* ==================== TOOL CARD 2: EXAM PREPARATION (5 SETS × 50 MCQS = 250 MCQS) ==================== */}
          <div className="bg-white border-[1.5px] border-[#CBE3D6] rounded-[22px] p-4 sm:p-5 shadow-[0_6px_22px_rgba(19,66,43,0.06)] space-y-3.5">
            <div
              onClick={() =>
                handleTryOpenTool(
                  'exam',
                  'Food Safety & Food Science Exam Preparation (250 MCQs)'
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTryOpenTool(
                    'exam',
                    'Food Safety & Food Science Exam Preparation (250 MCQs)'
                  );
                }
              }}
              className="flex items-start justify-between gap-3 border-b border-[#ECF4EF] pb-3 cursor-pointer"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-12 h-12 rounded-[16px] bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E9F6E]">
                      Tool 02 • 5 Exam Sets × 50 MCQs (250 Total MCQs)
                    </span>
                    {!isUserPaid && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold inline-flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Premium</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#0F291E] leading-snug mt-0.5">
                    Food Safety &amp; Food Science Exam Preparation
                  </h2>
                  <p className="text-[12px] text-[#5C7267] font-medium mt-0.5 leading-snug">
                    5 Complete Exam Sets (50 MCQs &amp; 100 Marks each) with Correct Answers, Technical Explanations, Grading &amp; Official PDF Score Report Download.
                  </p>
                </div>
              </div>
            </div>

            {/* 5 Exam Sets List on Hub Page */}
            <div className="space-y-2">
              {EXAM_PREP_SETS.map((set) => {
                const bestAttempt = (toolsData.examAttempts || [])
                  .filter((a) => a.setId === set.id)
                  .sort((a, b) => b.scoreMarks - a.scoreMarks)[0];

                return (
                  <div
                    key={set.id}
                    onClick={() =>
                      handleTryOpenTool('exam', set.title, set.id)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTryOpenTool('exam', set.title, set.id);
                      }
                    }}
                    className="p-3 rounded-2xl bg-[#F6FBF8] hover:bg-[#EBF7F0] border border-[#D4E9DF] flex items-center justify-between gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#0E9F6E]">
                        <span>SET 0{set.setNumber}</span>
                        <span>·</span>
                        <span>50 MCQs (100 Marks)</span>
                        {bestAttempt && (
                          <>
                            <span>·</span>
                            <span className="text-[#15803D]">
                              Best: {bestAttempt.scoreMarks}/100 ({bestAttempt.percentage}%)
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-[13px] sm:text-[14px] font-extrabold text-[#0F291E] leading-snug mt-0.5 break-words">
                        {set.title}
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-[#0E9F6E] text-white text-[11px] font-extrabold inline-flex items-center gap-1 shrink-0">
                      {!isUserPaid && <Lock className="w-3 h-3" />}
                      <span>Start 50 MCQs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== TOOL CARD 3: INTERVIEW PREPARATION (5 SETS × 20 Q&As = 100 Q&As) ==================== */}
          <div className="bg-white border-[1.5px] border-[#CBE3D6] rounded-[22px] p-4 sm:p-5 shadow-[0_6px_22px_rgba(19,66,43,0.06)] space-y-3.5">
            <div
              onClick={() =>
                handleTryOpenTool(
                  'interview',
                  'Food Safety, HACCP & ISO 22000 Interview Preparation (100 Q&As)'
                )
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTryOpenTool(
                    'interview',
                    'Food Safety, HACCP & ISO 22000 Interview Preparation (100 Q&As)'
                  );
                }
              }}
              className="flex items-start justify-between gap-3 border-b border-[#ECF4EF] pb-3 cursor-pointer"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-12 h-12 rounded-[16px] bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E9F6E]">
                      Tool 03 • 5 Interview Sets × 20 Questions (100 Q&amp;As)
                    </span>
                    {!isUserPaid && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold inline-flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Premium</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#0F291E] leading-snug mt-0.5">
                    Food Safety, HACCP &amp; ISO 22000 Interview Prep
                  </h2>
                  <p className="text-[12px] text-[#5C7267] font-medium mt-0.5 leading-snug">
                    5 Specialized Interview Sets (20 Questions &amp; Verified Answers per Set) covering HACCP, ISO 22000:2018, FSSC 22000 v6, GMP/CIP &amp; Food Science QA.
                  </p>
                </div>
              </div>
            </div>

            {/* 5 Interview Sets List on Hub Page */}
            <div className="space-y-2">
              {INTERVIEW_PREP_SETS.map((set) => {
                const masteredInSet = set.questions.filter((q) =>
                  toolsData.masteredInterviewIds.includes(q.id)
                ).length;

                return (
                  <div
                    key={set.id}
                    onClick={() =>
                      handleTryOpenTool('interview', set.title, set.id)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTryOpenTool('interview', set.title, set.id);
                      }
                    }}
                    className="p-3 rounded-2xl bg-[#F6FBF8] hover:bg-[#EBF7F0] border border-[#D4E9DF] flex items-center justify-between gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#0E9F6E]">
                        <span>SET 0{set.setNumber}</span>
                        <span>·</span>
                        <span>20 Interview Q&amp;As</span>
                        <span>·</span>
                        <span className="text-[#15803D]">
                          {masteredInSet}/20 Prepared
                        </span>
                      </div>
                      <div className="text-[13px] sm:text-[14px] font-extrabold text-[#0F291E] leading-snug mt-0.5 break-words">
                        {set.title}
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-[#13422B] hover:bg-[#0E9F6E] text-white text-[11px] font-extrabold inline-flex items-center gap-1 shrink-0 transition-colors">
                      {!isUserPaid && <Lock className="w-3 h-3" />}
                      <span>Open 20 Q&amp;As</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Link to User Profile Saved Tools Control Panel */}
          {onGoToProfileTools && (
            <div className="bg-[#F2F9F5] border border-[#B8D8C6] rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="text-xs font-bold text-[#0F291E]">
                All your BMI logs, Exam Scores &amp; Interview Progress are saved in your <strong>User Profile Control Panel</strong>.
              </div>
              <button
                type="button"
                onClick={onGoToProfileTools}
                className="px-3 py-2 rounded-xl bg-white border border-[#0E9F6E] text-[#0E9F6E] text-[11px] font-extrabold shrink-0 cursor-pointer hover:bg-emerald-50"
              >
                View in Profile →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== OPENED TOOL 1: DAILY PERSONAL HEALTH & NUTRITION TRACKER ==================== */}
      {activeSection === 'nutrition' && isUserPaid && (
        <div className="space-y-4">
          {/* Top Navigation Bar inside Tool */}
          <div className="bg-white border border-[#CBE3D6] rounded-2xl p-3 flex items-center justify-between gap-2 flex-wrap shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveSection('hub')}
              className="px-3 py-1.5 rounded-xl bg-[#EBF7F0] hover:bg-[#D7EFE2] text-[#0F291E] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>← All Tools Hub</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  downloadNutritionReportPdf(
                    user.name || 'Food Specialist',
                    liveNutritionState,
                    metrics
                  )
                }
                className="px-3.5 py-1.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full Nutrition Report (PDF)</span>
              </button>
            </div>
          </div>

          {/* 3 Sub-Tabs inside Nutrition App */}
          <div className="grid grid-cols-3 gap-1.5 bg-white p-1.5 rounded-2xl border border-[#CBE3D6]">
            {(
              [
                { id: 'bmi-graph', label: '1. BMI & Weight Graph' },
                { id: 'calories', label: '2. Calorie Counter' },
                { id: 'meal-plan', label: '3. Meal Planner' }
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setNutriTab(t.id)}
                className={`py-2 px-2 rounded-xl text-[11.5px] font-extrabold transition-colors cursor-pointer ${
                  nutriTab === t.id
                    ? 'bg-[#0E9F6E] text-white shadow-xs'
                    : 'text-[#13422B] hover:bg-[#F0FAF4]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* SUB-TAB 1: BMI CALCULATOR, WEIGHT VERDICT & VISUAL GRAPH */}
          {nutriTab === 'bmi-graph' && (
            <div className="space-y-4">
              {/* Biometric Inputs Card */}
              <div className="bg-white border border-[#CBE3D6] rounded-[22px] p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#ECF4EF] pb-2.5">
                  <div>
                    <h2 className="text-[16px] font-extrabold text-[#0F291E]">
                      Personal Body Metrics &amp; BMI Calculator
                    </h2>
                    <p className="text-[11px] text-[#5C7267] font-medium">
                      Enter your height, current weight &amp; goal weight to calculate BMI and weight recommendation
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#13422B] block mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={heightInput}
                      onChange={(e) => setHeightInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-sm font-extrabold text-[#0F291E] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#13422B] block mb-1">
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-sm font-extrabold text-[#0F291E] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#13422B] block mb-1">
                      Target Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={targetWeightInput}
                      onChange={(e) => setTargetWeightInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-sm font-extrabold text-[#0E9F6E] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#13422B] block mb-1">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      value={ageInput}
                      onChange={(e) => setAgeInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-sm font-extrabold text-[#0F291E] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#13422B] block mb-1">
                      Gender
                    </label>
                    <select
                      value={genderInput}
                      onChange={(e) =>
                        setGenderInput(e.target.value as 'male' | 'female')
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-sm font-extrabold text-[#0F291E]"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#13422B] block mb-1">
                      Activity Level
                    </label>
                    <select
                      value={activityInput}
                      onChange={(e) =>
                        setActivityInput(
                          e.target.value as NutritionProfileData['activityLevel']
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-xs font-extrabold text-[#0F291E]"
                    >
                      <option value="sedentary">Sedentary (Desk Job)</option>
                      <option value="light">Lightly Active (1–3 days/wk)</option>
                      <option value="moderate">Moderately Active (3–5 days/wk)</option>
                      <option value="active">Very Active (6–7 days/wk)</option>
                      <option value="athlete">Intense Physical / Athlete</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveBiometrics}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#13422B] hover:bg-[#0E9F6E] text-white text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
                >
                  Save Biometrics &amp; Update My Profile Health Data
                </button>
              </div>

              {/* BMI Score & Weight Gain / Reduce Verdict Card */}
              <div className="bg-white border-[1.5px] border-[#0E9F6E] rounded-[22px] p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#5C7267]">
                      Your Body Mass Index (BMI) &amp; Clinical Verdict
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-extrabold text-[#0F291E] tabular-nums">
                        {metrics.bmi}
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        kg/m²
                      </span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-white text-xs font-extrabold"
                        style={{ backgroundColor: metrics.bmiColorHex }}
                      >
                        {metrics.bmiCategory}
                      </span>
                    </div>
                  </div>

                  <div className="px-3 py-2 rounded-xl bg-[#F0FAF4] border border-[#B8D8C6] text-right">
                    <div className="text-[10px] font-bold text-[#5C7267] uppercase">
                      Healthy Weight Range
                    </div>
                    <div className="text-sm font-extrabold text-[#0F291E] tabular-nums">
                      {metrics.healthyMinKg} kg – {metrics.healthyMaxKg} kg
                    </div>
                  </div>
                </div>

                {/* WHO BMI Visual Spectrum Gauge Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-extrabold text-center">
                    <div className="py-1 rounded-l-lg bg-amber-400 text-amber-950">
                      Underweight (&lt;18.5)
                    </div>
                    <div className="py-1 bg-[#0E9F6E] text-white">
                      Normal (18.5–24.9)
                    </div>
                    <div className="py-1 bg-orange-500 text-white">
                      Overweight (25–29.9)
                    </div>
                    <div className="py-1 rounded-r-lg bg-red-600 text-white">
                      Obese (30+)
                    </div>
                  </div>
                  <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(8, ((metrics.bmi - 12) / 26) * 100))}%`,
                        backgroundColor: metrics.bmiColorHex
                      }}
                    />
                  </div>
                </div>

                {/* Explicit Weight Gain / Reduce Recommendation Callout */}
                <div className="p-3.5 rounded-2xl bg-[#F2F9F5] border border-[#9BCAB0] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0F291E]">
                    {metrics.weightAction === 'REDUCE WEIGHT' ? (
                      <TrendingDown className="w-5 h-5 text-orange-600 shrink-0" />
                    ) : metrics.weightAction === 'GAIN WEIGHT' ? (
                      <TrendingUp className="w-5 h-5 text-[#0E9F6E] shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-[#0E9F6E] shrink-0" />
                    )}
                    <span>
                      Recommendation: {metrics.weightAction} —{' '}
                      {metrics.recommendationHeadline}
                    </span>
                  </div>
                  <p className="text-xs text-[#374151] font-medium leading-relaxed">
                    {metrics.recommendationDetail}
                  </p>
                </div>
              </div>

              {/* VISUAL WEIGHT PROGRESS & GOAL TRAJECTORY GRAPH (SVG) */}
              <div className="bg-white border border-[#CBE3D6] rounded-[22px] p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#0F291E]">
                      Weight Goal Trajectory &amp; BMI Graph
                    </h3>
                    <p className="text-[11px] text-[#5C7267] font-medium">
                      Solid line shows your logged weight history; dashed line shows your path to Target Weight ({graphPoints.targW} kg)
                    </p>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#0E9F6E] tabular-nums">
                    Current: {liveNutritionState.weightKg} kg → Goal: {graphPoints.targW} kg
                  </span>
                </div>

                {/* SVG Line & Area Chart */}
                <div className="w-full overflow-x-auto bg-[#F8FCFA] border border-[#E2F2E9] rounded-2xl p-2.5">
                  <svg
                    viewBox={`0 0 ${graphPoints.width} ${graphPoints.height}`}
                    className="w-full h-40 overflow-visible"
                  >
                    {/* Healthy Target Weight Horizontal Dashed Reference Line */}
                    <line
                      x1={24}
                      y1={graphPoints.targetY}
                      x2={graphPoints.width - 20}
                      y2={graphPoints.targetY}
                      stroke="#0E9F6E"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={graphPoints.width - 22}
                      y={Math.max(12, graphPoints.targetY - 5)}
                      textAnchor="end"
                      fill="#0E9F6E"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      Target Goal: {graphPoints.targW} kg
                    </text>

                    {/* Polyline connecting weight points */}
                    <polyline
                      fill="none"
                      stroke="#13422B"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={graphPoints.coords
                        .map((c) => `${c.x},${c.y}`)
                        .join(' ')}
                    />

                    {/* Data Points & Labels */}
                    {graphPoints.coords.map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={pt.isProjected ? 4 : 5}
                          fill={pt.isProjected ? '#F59E0B' : '#0E9F6E'}
                          stroke="#FFFFFF"
                          strokeWidth="1.8"
                        />
                        <text
                          x={pt.x}
                          y={Math.max(12, pt.y - 8)}
                          textAnchor="middle"
                          fill="#0F291E"
                          fontSize="9.5"
                          fontWeight="bold"
                        >
                          {pt.weightKg}kg
                        </text>
                        <text
                          x={pt.x}
                          y={graphPoints.height - 4}
                          textAnchor="middle"
                          fill="#5C7267"
                          fontSize="8.5"
                          fontWeight="600"
                        >
                          {pt.date}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Quick Log New Weight Point to Graph */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Enter today's weight in kg (e.g. 75.2)"
                    value={newWeightLogInput}
                    onChange={(e) => setNewWeightLogInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-xs font-bold text-[#0F291E]"
                  />
                  <button
                    type="button"
                    onClick={handleLogWeightPoint}
                    className="px-3.5 py-2 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold cursor-pointer shrink-0"
                  >
                    + Log Weight to Graph
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: DAILY CALORIE COUNTER, MACROS & HYDRATION */}
          {nutriTab === 'calories' && (
            <div className="space-y-4">
              {/* Daily Calorie & Macro Progress Ring/Bars Card */}
              <div className="bg-white border border-[#CBE3D6] rounded-[22px] p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-[#0F291E]">
                      Daily Calorie &amp; Macronutrient Tracker
                    </h2>
                    <p className="text-[11px] text-[#5C7267] font-medium">
                      BMR: {metrics.bmrKcal} kcal • Maintenance TDEE: {metrics.tdeeKcal} kcal • Goal Target: {metrics.dailyTargetKcal} kcal
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-[#0E9F6E] tabular-nums">
                      {metrics.consumedKcal} / {metrics.dailyTargetKcal} kcal
                    </div>
                    <div className="text-[10px] font-bold text-gray-500">
                      {Math.max(
                        0,
                        metrics.dailyTargetKcal - metrics.consumedKcal
                      )}{' '}
                      kcal remaining
                    </div>
                  </div>
                </div>

                {/* Calorie Progress Bar */}
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0E9F6E] rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (metrics.consumedKcal /
                            Math.max(1, metrics.dailyTargetKcal)) *
                            100
                        )
                      )}%`
                    }}
                  />
                </div>

                {/* 3 Macronutrient Boxes */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-xl bg-[#F4FAF6] border border-[#D4E9DF]">
                    <div className="text-[10px] font-bold text-[#5C7267]">
                      Protein (30%)
                    </div>
                    <div className="text-sm font-extrabold text-[#0F291E] tabular-nums mt-0.5">
                      {metrics.consumedProteinG}g / {metrics.targetProteinG}g
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F4FAF6] border border-[#D4E9DF]">
                    <div className="text-[10px] font-bold text-[#5C7267]">
                      Carbs (45%)
                    </div>
                    <div className="text-sm font-extrabold text-[#0F291E] tabular-nums mt-0.5">
                      {metrics.consumedCarbsG}g / {metrics.targetCarbsG}g
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F4FAF6] border border-[#D4E9DF]">
                    <div className="text-[10px] font-bold text-[#5C7267]">
                      Fats (25%)
                    </div>
                    <div className="text-sm font-extrabold text-[#0F291E] tabular-nums mt-0.5">
                      {metrics.consumedFatsG}g / {metrics.targetFatsG}g
                    </div>
                  </div>
                </div>

                {/* Daily Water Intake Tracker */}
                <div className="p-3 rounded-xl bg-[#F0F9FF] border border-sky-200 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-extrabold text-sky-950">
                      Daily Water Hydration: {toolsData.nutrition.waterGlassesToday || 0} / 8 Glasses
                    </div>
                    <div className="text-[10.5px] font-semibold text-sky-700">
                      {(toolsData.nutrition.waterGlassesToday || 0) * 250} mL drunk today (Target: 2,000 mL)
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateWaterGlasses(-1)}
                      className="w-8 h-8 rounded-lg bg-white border border-sky-300 text-sky-900 font-extrabold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateWaterGlasses(1)}
                      className="px-3 h-8 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs cursor-pointer"
                    >
                      + 1 Glass
                    </button>
                  </div>
                </div>
              </div>

              {/* 1-Click Quick Food Presets */}
              <div className="bg-white border border-[#CBE3D6] rounded-[22px] p-4 space-y-2.5 shadow-2xs">
                <h3 className="text-sm font-extrabold text-[#0F291E]">
                  1-Click Quick Add Common Meals &amp; Foods
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {QUICK_FOOD_PRESETS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickAddPresetFood(item)}
                      className="p-2.5 rounded-xl bg-[#F6FBF8] hover:bg-[#E2F2E9] border border-[#D4E9DF] text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-[#0F291E] truncate">
                          {item.name}
                        </div>
                        <div className="text-[10.5px] font-semibold text-[#5C7267]">
                          {item.defaultMeal} · {item.calories} kcal · P:{item.proteinG}g C:{item.carbsG}g F:{item.fatsG}g
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-[#0E9F6E] text-white text-[10.5px] font-extrabold shrink-0">
                        + Add
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Food / Meal Log Form */}
              <form
                onSubmit={handleAddCustomMeal}
                className="bg-white border border-[#CBE3D6] rounded-[22px] p-4 space-y-3 shadow-2xs"
              >
                <h3 className="text-sm font-extrabold text-[#0F291E]">
                  Log Custom Meal / Food Item
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10.5px] font-bold text-[#13422B] block mb-0.5">
                      Meal Type
                    </label>
                    <select
                      value={mealTypeInput}
                      onChange={(e) =>
                        setMealTypeInput(
                          e.target.value as
                            | 'Breakfast'
                            | 'Lunch'
                            | 'Dinner'
                            | 'Snack'
                        )
                      }
                      className="w-full px-2.5 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-xs font-extrabold text-[#0F291E]"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Snack">Snack</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="text-[10.5px] font-bold text-[#13422B] block mb-0.5">
                      Food / Dish Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chicken Pulao + Raita"
                      value={foodNameInput}
                      onChange={(e) => setFoodNameInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-xs font-bold text-[#0F291E]"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-[#13422B] block mb-0.5">
                      Calories (kcal)
                    </label>
                    <input
                      type="number"
                      placeholder="350"
                      value={caloriesInput}
                      onChange={(e) => setCaloriesInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-xs font-bold text-[#0F291E]"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-[#13422B] block mb-0.5">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      placeholder="25"
                      value={proteinInput}
                      onChange={(e) => setProteinInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-xs font-bold text-[#0F291E]"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-[#13422B] block mb-0.5">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      placeholder="40"
                      value={carbsInput}
                      onChange={(e) => setCarbsInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#B8D8C6] bg-[#F9FCFA] text-xs font-bold text-[#0F291E]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold cursor-pointer"
                >
                  + Add Meal to Calorie Log &amp; Save to Profile
                </button>
              </form>

              {/* Logged Meals List */}
              <div className="bg-white border border-[#CBE3D6] rounded-[22px] p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#0F291E]">
                    My Logged Meals ({toolsData.nutrition.mealLogs?.length || 0})
                  </h3>
                  <span className="text-xs font-extrabold text-[#0E9F6E] tabular-nums">
                    Total: {metrics.consumedKcal} kcal
                  </span>
                </div>
                <div className="space-y-2">
                  {(toolsData.nutrition.mealLogs || []).map((meal) => (
                    <div
                      key={meal.id}
                      className="p-3 rounded-xl bg-[#F6FBF8] border border-[#D4E9DF] flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-[#0F291E]">
                          [{meal.mealType}] {meal.foodName}
                        </div>
                        <div className="text-[11px] font-semibold text-[#5C7267] tabular-nums">
                          {meal.calories} kcal · Protein: {meal.proteinG}g · Carbs: {meal.carbsG}g · Fats: {meal.fatsG}g
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMealLog(meal.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Remove meal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: MEAL PLANNER */}
          {nutriTab === 'meal-plan' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#CBE3D6] rounded-[22px] p-4 space-y-3 shadow-2xs">
                <h2 className="text-base font-extrabold text-[#0F291E]">
                  Personalized Nutritionist Meal Planner
                </h2>
                <p className="text-xs text-[#5C7267] font-medium">
                  Select a goal-based meal plan below (based on your BMI recommendation: <strong>{metrics.weightAction}</strong>) to save it to your profile and PDF report:
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyMealPlanPreset('lose')}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold cursor-pointer ${
                      toolsData.nutrition.goalType === 'lose'
                        ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]'
                        : 'bg-[#F6FBF8] text-[#0F291E] border-[#CBE3D6]'
                    }`}
                  >
                    Weight Loss Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyMealPlanPreset('maintain')}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold cursor-pointer ${
                      toolsData.nutrition.goalType === 'maintain'
                        ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]'
                        : 'bg-[#F6FBF8] text-[#0F291E] border-[#CBE3D6]'
                    }`}
                  >
                    Maintenance Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyMealPlanPreset('gain')}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold cursor-pointer ${
                      toolsData.nutrition.goalType === 'gain'
                        ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]'
                        : 'bg-[#F6FBF8] text-[#0F291E] border-[#CBE3D6]'
                    }`}
                  >
                    Weight Gain Plan
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {(toolsData.nutrition.mealPlans || []).map((plan) => {
                    const totalKcal =
                      plan.breakfastKcal +
                      plan.lunchKcal +
                      plan.snackKcal +
                      plan.dinnerKcal;
                    return (
                      <div
                        key={plan.id}
                        className="p-3.5 rounded-2xl bg-[#F6FBF8] border border-[#CBE3D6] space-y-2"
                      >
                        <div className="flex items-center justify-between border-b border-[#D4E9DF] pb-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-[#0F291E]">
                            {plan.day}
                          </span>
                          <span className="text-xs font-extrabold text-[#0E9F6E] tabular-nums">
                            {totalKcal} kcal / day
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs text-[#1F2937]">
                          <div>
                            <strong className="text-[#13422B]">
                              Breakfast ({plan.breakfastKcal} kcal):
                            </strong>{' '}
                            {plan.breakfast}
                          </div>
                          <div>
                            <strong className="text-[#13422B]">
                              Lunch ({plan.lunchKcal} kcal):
                            </strong>{' '}
                            {plan.lunch}
                          </div>
                          <div>
                            <strong className="text-[#13422B]">
                              Evening Snack ({plan.snackKcal} kcal):
                            </strong>{' '}
                            {plan.snack}
                          </div>
                          <div>
                            <strong className="text-[#13422B]">
                              Dinner ({plan.dinnerKcal} kcal):
                            </strong>{' '}
                            {plan.dinner}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== OPENED TOOL 2: EXAM PREPARATION (5 SETS × 50 MCQS) ==================== */}
      {activeSection === 'exam' && isUserPaid && (
        <div className="space-y-4">
          {/* Top Navigation Bar */}
          <div className="bg-white border border-[#CBE3D6] rounded-2xl p-3 flex items-center justify-between gap-2 flex-wrap shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveSection('hub')}
              className="px-3 py-1.5 rounded-xl bg-[#EBF7F0] hover:bg-[#D7EFE2] text-[#0F291E] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>← All Tools Hub</span>
            </button>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#13422B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={instantFeedbackMode}
                  onChange={(e) => setInstantFeedbackMode(e.target.checked)}
                  className="rounded accent-[#0E9F6E]"
                />
                <span>Show Answer &amp; Explanation Instantly</span>
              </label>
            </div>
          </div>

          {/* 5 Exam Sets Selector Pills */}
          <div className="bg-white border border-[#CBE3D6] rounded-2xl p-3 space-y-2">
            <div className="text-xs font-extrabold text-[#13422B]">
              Select Exam Set (5 Sets × 50 MCQs = 250 Total Questions):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
              {EXAM_PREP_SETS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedExamSetId(s.id);
                    setExamAnswers({});
                    setSubmittedExamResult(null);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border text-left sm:text-center transition-colors cursor-pointer ${
                    selectedExamSetId === s.id
                      ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]'
                      : 'bg-[#F6FBF8] text-[#0F291E] border-[#CBE3D6] hover:bg-[#E2F2E9]'
                  }`}
                >
                  Set {s.setNumber} (50 MCQs)
                </button>
              ))}
            </div>
          </div>

          {/* Active Exam Header & Live Progress */}
          <div className="bg-gradient-to-r from-[#0D2E1B] to-[#13422B] rounded-[22px] p-4 text-white space-y-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-200">
              <span>{activeExamSet.subjectArea}</span>
              <span className="tabular-nums">
                Answered: {Object.keys(examAnswers).length} / {activeExamSet.totalQuestions} MCQs • Total: {activeExamSet.totalMarks} Marks
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold leading-snug">
              {activeExamSet.title}
            </h2>
            <p className="text-xs text-emerald-100/90">
              {activeExamSet.subtitle}
            </p>
          </div>

          {/* Graded Exam Result Card (When Submitted) */}
          {submittedExamResult && (
            <div className="bg-white border-2 border-[#0E9F6E] rounded-[22px] p-4 sm:p-5 space-y-3 shadow-md">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      submittedExamResult.passed
                        ? 'bg-[#DCFCE7] text-[#14532D]'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {submittedExamResult.passed
                      ? 'EXAM PASSED ✓'
                      : 'NEEDS REVISION'}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#0F291E] mt-1 tabular-nums">
                    Score: {submittedExamResult.scoreMarks} /{' '}
                    {submittedExamResult.totalMarks} Marks (
                    {submittedExamResult.percentage}%)
                  </h3>
                  <p className="text-xs font-bold text-[#0E9F6E]">
                    Grade: {submittedExamResult.grade} • Correct Answers:{' '}
                    {submittedExamResult.correctCount} /{' '}
                    {submittedExamResult.totalQuestions} MCQs
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      downloadExamReportPdf(
                        user.name || 'Food Specialist',
                        submittedExamResult,
                        activeExamSet,
                        examAnswers
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Exam Report (PDF)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExamAnswers({});
                      setSubmittedExamResult(null);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-extrabold cursor-pointer"
                  >
                    Retake Set
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 50 MCQs Scrollable List */}
          <div className="space-y-3">
            {activeExamSet.questions.map((q) => {
              const selectedIdx = examAnswers[q.id];
              const hasAnswered = typeof selectedIdx === 'number';
              const showFeedback =
                Boolean(submittedExamResult) ||
                (instantFeedbackMode && hasAnswered);

              return (
                <div
                  key={q.id}
                  className="bg-white border border-[#CBE3D6] rounded-[20px] p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-[#5C7267]">
                    <span>
                      Question {q.qNum} of {activeExamSet.totalQuestions} ·{' '}
                      <strong className="text-[#0E9F6E]">{q.category}</strong>
                    </span>
                    <span className="tabular-nums font-extrabold text-[#13422B]">
                      {q.marks} Marks
                    </span>
                  </div>

                  <div className="text-[13.5px] sm:text-[14.5px] font-extrabold text-[#0F291E] leading-snug">
                    {q.qNum}. {q.question}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((optText, optIdx) => {
                      const isSelected = selectedIdx === optIdx;
                      const isCorrectOption = q.correctIndex === optIdx;

                      let btnStyle =
                        'bg-[#F8FCFA] border-[#D4E9DF] text-[#0F291E] hover:border-[#0E9F6E]';
                      if (showFeedback) {
                        if (isCorrectOption) {
                          btnStyle =
                            'bg-[#DCFCE7] border-[#16A34A] text-[#0D2E1B] font-extrabold';
                        } else if (isSelected && !isCorrectOption) {
                          btnStyle =
                            'bg-red-50 border-red-400 text-red-900 font-bold';
                        }
                      } else if (isSelected) {
                        btnStyle =
                          'bg-[#0E9F6E] border-[#0E9F6E] text-white font-extrabold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectMcqOption(q.id, optIdx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs sm:text-[13px] flex items-start justify-between gap-2 transition-colors cursor-pointer ${btnStyle}`}
                        >
                          <span>
                            <strong>
                              {String.fromCharCode(65 + optIdx)}.
                            </strong>{' '}
                            {optText}
                          </span>
                          {showFeedback && isCorrectOption && (
                            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showFeedback && (
                    <div className="p-3 rounded-xl bg-[#F2F9F5] border border-[#B8D8C6] text-xs space-y-1">
                      <div className="font-extrabold text-[#0E9F6E]">
                        ✓ Correct Answer:{' '}
                        {String.fromCharCode(65 + q.correctIndex)}.{' '}
                        {q.options[q.correctIndex]}
                      </div>
                      <p className="text-[#374151] font-medium leading-relaxed">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sticky / Bottom Submit & Download Exam Report Bar */}
          <div className="bg-white border-2 border-[#0E9F6E] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="text-xs font-extrabold text-[#0F291E]">
              Answered {Object.keys(examAnswers).length} of{' '}
              {activeExamSet.totalQuestions} MCQs ({activeExamSet.totalMarks}{' '}
              Total Marks)
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSubmitExamAttempt}
                className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold cursor-pointer shadow-sm"
              >
                Submit Exam &amp; Calculate Marks
              </button>
              <button
                type="button"
                onClick={() => {
                  const tempAttempt: UserExamAttempt = submittedExamResult || {
                    id: `attempt-${activeExamSet.id}`,
                    setId: activeExamSet.id,
                    setTitle: activeExamSet.title,
                    scoreMarks: activeExamSet.questions.reduce(
                      (acc, q) =>
                        acc + (examAnswers[q.id] === q.correctIndex ? q.marks : 0),
                      0
                    ),
                    totalMarks: activeExamSet.totalMarks,
                    correctCount: activeExamSet.questions.filter(
                      (q) => examAnswers[q.id] === q.correctIndex
                    ).length,
                    totalQuestions: activeExamSet.totalQuestions,
                    percentage: Math.round(
                      (activeExamSet.questions.reduce(
                        (acc, q) =>
                          acc +
                          (examAnswers[q.id] === q.correctIndex ? q.marks : 0),
                        0
                      ) /
                        activeExamSet.totalMarks) *
                        100
                    ),
                    grade: 'Official Transcript',
                    passed: true,
                    completedAt: new Date().toISOString()
                  };
                  downloadExamReportPdf(
                    user.name || 'Food Specialist',
                    tempAttempt,
                    activeExamSet,
                    examAnswers
                  );
                }}
                className="py-3 px-4 rounded-xl bg-[#13422B] hover:bg-[#0D2E1B] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== OPENED TOOL 3: INTERVIEW PREPARATION (5 SETS × 20 Q&As) ==================== */}
      {activeSection === 'interview' && isUserPaid && (
        <div className="space-y-4">
          {/* Top Navigation Bar */}
          <div className="bg-white border border-[#CBE3D6] rounded-2xl p-3 flex items-center justify-between gap-2 flex-wrap shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveSection('hub')}
              className="px-3 py-1.5 rounded-xl bg-[#EBF7F0] hover:bg-[#D7EFE2] text-[#0F291E] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>← All Tools Hub</span>
            </button>
            <button
              type="button"
              onClick={() =>
                downloadInterviewSetPdf(
                  user.name || 'Food Specialist',
                  activeInterviewSet
                )
              }
              className="px-3.5 py-1.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Set {activeInterviewSet.setNumber} PDF Guide</span>
            </button>
          </div>

          {/* 5 Interview Sets Selector */}
          <div className="bg-white border border-[#CBE3D6] rounded-2xl p-3 space-y-2">
            <div className="text-xs font-extrabold text-[#13422B]">
              Select Interview Preparation Set (5 Sets × 20 Questions = 100 Verified Q&amp;As):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
              {INTERVIEW_PREP_SETS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedInterviewSetId(s.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border text-left sm:text-center transition-colors cursor-pointer ${
                    selectedInterviewSetId === s.id
                      ? 'bg-[#13422B] text-white border-[#13422B]'
                      : 'bg-[#F6FBF8] text-[#0F291E] border-[#CBE3D6] hover:bg-[#E2F2E9]'
                  }`}
                >
                  Set {s.setNumber} (20 Q&amp;As)
                </button>
              ))}
            </div>
          </div>

          {/* Set Header & Search */}
          <div className="bg-gradient-to-r from-[#0D2E1B] to-[#13422B] rounded-[22px] p-4 text-white space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-200">
              <span>{activeInterviewSet.focusStandards.join(' · ')}</span>
              <span className="tabular-nums">
                Prepared:{' '}
                {
                  activeInterviewSet.questions.filter((q) =>
                    toolsData.masteredInterviewIds.includes(q.id)
                  ).length
                }{' '}
                / 20 Questions
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold leading-snug">
              {activeInterviewSet.title}
            </h2>
            <p className="text-xs text-emerald-100/90">
              {activeInterviewSet.subtitle}
            </p>
            <div className="relative pt-1">
              <Search className="w-4 h-4 text-emerald-200 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions or keywords (e.g. CCP, Listeria, CIP, VACCP)..."
                value={interviewSearch}
                onChange={(e) => setInterviewSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-emerald-100/70 text-xs font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* 20 Questions & Model Answers List */}
          <div className="space-y-3">
            {activeInterviewSet.questions
              .filter(
                (q) =>
                  !interviewSearch.trim() ||
                  q.question
                    .toLowerCase()
                    .includes(interviewSearch.toLowerCase()) ||
                  q.answer
                    .toLowerCase()
                    .includes(interviewSearch.toLowerCase()) ||
                  q.topic.toLowerCase().includes(interviewSearch.toLowerCase())
              )
              .map((item) => {
                const isMastered = toolsData.masteredInterviewIds.includes(
                  item.id
                );

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#CBE3D6] rounded-[20px] p-4 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-[#0E9F6E]">
                        Question {item.questionNumber} of 20 · {item.topic}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleMasteredQuestion(item.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                          isMastered
                            ? 'bg-[#DCFCE7] text-[#14532D] border border-[#16A34A]'
                            : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>
                          {isMastered ? 'Prepared ✓' : 'Mark Prepared'}
                        </span>
                      </button>
                    </div>

                    <h3
                      onClick={() => toggleExpandInterviewQ(item.id)}
                      className="text-[14px] sm:text-[15px] font-extrabold text-[#0F291E] leading-snug cursor-pointer"
                    >
                      Q{item.questionNumber}: {item.question}
                    </h3>

                    <div className="p-3.5 rounded-2xl bg-[#F6FBF8] border border-[#D4E9DF] space-y-2">
                      <div className="text-xs text-[#1F2937] leading-relaxed font-medium">
                        <strong className="text-[#0D2E1B]">
                          Model Interview Answer:
                        </strong>{' '}
                        {item.answer}
                      </div>
                      <div className="pt-1.5 border-t border-[#E2F2E9] text-[11.5px] font-extrabold text-[#0E9F6E]">
                        💡 Key Audit / Interview Takeaway: {item.keyTakeaway}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ==================== PREMIUM MEMBERSHIP REQUIRED MODAL (FOR FREE USERS & EXPIRED PREMIUM) ==================== */}
      {lockedToolPromptTitle && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-white rounded-[28px] p-5 border-2 border-[#0E9F6E] shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#0E9F6E]">
                    {hasExpiredPremium
                      ? 'Premium Membership Expired'
                      : 'Paid Premium Member Tool'}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0F291E] leading-tight">
                    {hasExpiredPremium
                      ? 'Renew Premium to Unlock Tools'
                      : 'Upgrade to Premium Membership'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLockedToolPromptTitle(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F2F9F5] border border-[#B8D8C6] space-y-2 text-xs text-[#1F2937]">
              <div className="font-extrabold text-[#0D2E1B]">
                🔒 You clicked: &ldquo;{lockedToolPromptTitle}&rdquo;
              </div>
              <p className="leading-relaxed font-medium text-[#4B6356]">
                {hasExpiredPremium
                  ? 'Your Paid Premium subscription period has ended, so access to specialist tools has been locked. Renew your Premium Membership now to restore full access to all your saved data and tools:'
                  : 'This specialist tool is exclusively available to Paid Premium Members. Purchase a Premium Membership to unlock:'}
              </p>
              <ul className="space-y-1 font-bold text-[#0F291E] pt-1">
                <li>✓ Full Nutrition, Calorie Counter, Meal Planner &amp; BMI Graph + PDF Report</li>
                <li>✓ All 5 Exam Prep Sets (250 Food Safety &amp; Food Science MCQs + PDF Report)</li>
                <li>✓ All 5 Interview Prep Sets (100 HACCP, ISO 22000 &amp; FSSC 22000 Q&amp;As)</li>
                <li>✓ Verified Community Directory &amp; Direct Recruiter Visibility</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#F8FCFA] border border-[#CBE3D6]">
                <div className="text-[10px] font-bold text-gray-500 uppercase">
                  1-Month Plan
                </div>
                <div className="text-base font-extrabold text-[#0F291E]">
                  Rs. {monthlyFeeRs}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#0E9F6E]">
                <div className="text-[10px] font-extrabold text-[#0E9F6E] uppercase">
                  1-Year Plan (25% OFF)
                </div>
                <div className="text-base font-extrabold text-[#0F291E]">
                  Rs. {yearlyFeeRs.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setLockedToolPromptTitle(null);
                  onOpenPremiumModal();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs sm:text-sm font-extrabold shadow-md cursor-pointer transition-colors"
              >
                {hasExpiredPremium
                  ? 'Renew Premium Membership Now'
                  : 'Buy / Purchase Premium Now'}
              </button>
              <button
                type="button"
                onClick={() => setLockedToolPromptTitle(null)}
                className="py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
