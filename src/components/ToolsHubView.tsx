import React, { useState, useMemo, useEffect } from 'react';
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
  UserInterviewSession,
  UserToolsData
} from '../types/hub';
import {
  computeNutritionMetrics,
  DEFAULT_USER_TOOLS_DATA,
  PRESET_MEAL_PLANS,
  QUICK_FOOD_PRESETS
} from '../data/examPrepData';
import {
  ALL_2000_EXAM_MCQS,
  ALL_2000_INTERVIEW_QUESTIONS,
  drawNext30ExamMcqs,
  drawNext30InterviewQuestions,
  QUESTIONS_PER_SESSION,
  TOTAL_EXAM_BANK_SIZE,
  TOTAL_INTERVIEW_BANK_SIZE,
  UnifiedExamQuestion,
  UnifiedInterviewQuestion
} from '../data/questionBank2000';
import {
  downloadExamReportPdf,
  downloadInterviewSessionReportPdf
} from '../lib/toolsPdfGenerator';
import { NutritionSuiteTool } from './NutritionSuiteTool';
import { ExamSuiteTool } from './ExamSuiteTool';

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
  const yearlyDiscountPct = useMemo(() => {
    const fullYear = (monthlyFeeRs || 100) * 12;
    if (fullYear <= 0) return 25;
    return Math.max(
      0,
      Math.round(((fullYear - (yearlyFeeRs || 900)) / fullYear) * 100)
    );
  }, [monthlyFeeRs, yearlyFeeRs]);
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
      interviewSessions: saved.interviewSessions || [],
      seenExamQuestionIds: saved.seenExamQuestionIds || [],
      seenInterviewQuestionIds: saved.seenInterviewQuestionIds || [],
      masteredInterviewIds: saved.masteredInterviewIds || [],
      bookmarkedInterviewIds: saved.bookmarkedInterviewIds || []
    };
  }, [user.toolsData]);

  // Allow opening 'nutrition' or 'exam' (which have built-in Free vs Premium limits) or any tool if isUserPaid
  const [activeSection, setActiveSection] = useState<ActiveToolSection>(() =>
    isUserPaid ||
    ((initialSection === 'nutrition' || initialSection === 'exam') &&
      !hasExpiredPremium)
      ? initialSection
      : 'hub'
  );
  const [showPaywallPrompt, setShowPaywallPrompt] = useState<boolean>(false);
  const [paywallFeatureTitle, setPaywallFeatureTitle] = useState<string>(
    'Premium Specialist Tool'
  );
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Sync activeSection when initialSection changes
  useEffect(() => {
    if (
      initialSection &&
      (isUserPaid ||
        ((initialSection === 'nutrition' || initialSection === 'exam') &&
          !hasExpiredPremium))
    ) {
      setActiveSection(initialSection);
    } else if (
      !isUserPaid &&
      initialSection !== 'nutrition' &&
      initialSection !== 'exam'
    ) {
      setActiveSection('hub');
    }
  }, [initialSection, isUserPaid, hasExpiredPremium]);

  // Nutrition Local Editable State
  const [nutritionForm, setNutritionForm] = useState<NutritionProfileData>(
    () => toolsData.nutrition
  );
  const [newMealType, setNewMealType] = useState<
    'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  >('Breakfast');
  const [newFoodName, setNewFoodName] = useState<string>('');
  const [newPortion, setNewPortion] = useState<string>('1 serving');
  const [newCalories, setNewCalories] = useState<string>('250');
  const [newProtein, setNewProtein] = useState<string>('15');
  const [newCarbs, setNewCarbs] = useState<string>('30');
  const [newFats, setNewFats] = useState<string>('8');
  const [newWeightEntryKg, setNewWeightEntryKg] = useState<string>(
    String(toolsData.nutrition.weightKg || 76)
  );
  const [newWeightEntryDate, setNewWeightEntryDate] = useState<string>('Today');

  const metrics = useMemo(
    () => computeNutritionMetrics(nutritionForm),
    [nutritionForm]
  );

  // ---------------------------------------------------------------------------
  // 30-MCQ EXAM PREPARATION STATE (Drawn from 2,000-MCQ Bank — No 5 Sets!)
  // ---------------------------------------------------------------------------
  const [activeExamQuestions, setActiveExamQuestions] = useState<
    UnifiedExamQuestion[]
  >(() => {
    const initialDraw = drawNext30ExamMcqs(toolsData.seenExamQuestionIds || []);
    return initialDraw.questions;
  });
  const [examBatchNumber, setExamBatchNumber] = useState<number>(
    () => (toolsData.examAttempts?.length || 0) + 1
  );
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [submittedAttempt, setSubmittedAttempt] =
    useState<UserExamAttempt | null>(null);
  const [examFilterSubject, setExamFilterSubject] = useState<string>('All');

  // ---------------------------------------------------------------------------
  // 30-QUESTION INTERVIEW PREPARATION STATE (Drawn from 2,000-Q&A Bank — No 5 Sets!)
  // ---------------------------------------------------------------------------
  const [activeInterviewQuestions, setActiveInterviewQuestions] = useState<
    UnifiedInterviewQuestion[]
  >(() => {
    const initialDraw = drawNext30InterviewQuestions(
      toolsData.seenInterviewQuestionIds || []
    );
    return initialDraw.questions;
  });
  const [interviewBatchNumber, setInterviewBatchNumber] = useState<number>(
    () => (toolsData.interviewSessions?.length || 0) + 1
  );
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null
  );
  const [interviewCompletedReport, setInterviewCompletedReport] =
    useState<UserInterviewSession | null>(null);
  const [interviewTopicFilter, setInterviewTopicFilter] =
    useState<string>('All');

  const triggerSaveBanner = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => {
      setSaveBanner((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Gatekeeper for Free or Expired Premium users
  const handleSelectToolOrAction = (
    targetSection: ActiveToolSection,
    featureName: string,
    afterUnlock?: () => void
  ) => {
    // Nutrition & Exam tools allow Free non-expired users to enter and use the Free tier (1 Exam/Day, 1 BMI calc, etc.)
    if (
      (targetSection === 'nutrition' || targetSection === 'exam') &&
      !hasExpiredPremium
    ) {
      setActiveSection(targetSection);
      if (afterUnlock) afterUnlock();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!isUserPaid) {
      setPaywallFeatureTitle(featureName);
      setShowPaywallPrompt(true);
      return;
    }
    setActiveSection(targetSection);
    if (afterUnlock) afterUnlock();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start or Load Next 30 Different Exam MCQs from the 2,000-MCQ Bank
  const handleStartNew30McqExam = async (customSeenIds?: string[]) => {
    const baseSeen =
      customSeenIds ??
      toolsData.seenExamQuestionIds ??
      [];
    const drawn = drawNext30ExamMcqs(baseSeen);
    const nextAttemptNum = (toolsData.examAttempts?.length || 0) + 1;

    setActiveExamQuestions(drawn.questions);
    setExamBatchNumber(nextAttemptNum);
    setExamAnswers({});
    setSubmittedAttempt(null);
    setExamFilterSubject('All');

    const updatedTools: UserToolsData = {
      ...toolsData,
      seenExamQuestionIds: drawn.nextSeenIds,
      lastActiveTool: 'exam',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    await onSaveToolsData(updatedTools);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit 30-MCQ Exam & Generate Personalized Report with Visual Graph
  const handleSubmit30McqExam = async () => {
    let correctCount = 0;
    let failedCount = 0;
    let unansweredCount = 0;

    activeExamQuestions.forEach((q) => {
      const selected = examAnswers[q.id];
      if (typeof selected !== 'number') {
        unansweredCount++;
        failedCount++;
      } else if (selected === q.correctAnswerIndex) {
        correctCount++;
      } else {
        failedCount++;
      }
    });

    const totalQuestions = activeExamQuestions.length; // 30
    const marksPerQuestion = 2;
    const scoreMarks = correctCount * marksPerQuestion;
    const totalMarks = totalQuestions * marksPerQuestion; // 60
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 60;

    let grade = 'F (Needs Revision)';
    if (percentage >= 90) grade = 'A+ (Distinction)';
    else if (percentage >= 80) grade = 'A (Excellent)';
    else if (percentage >= 70) grade = 'B (Very Good)';
    else if (percentage >= 60) grade = 'C (Qualified Pass)';

    const attemptNumber = (toolsData.examAttempts?.length || 0) + 1;
    const currentSeen = toolsData.seenExamQuestionIds || [];
    const mergedSeen = Array.from(
      new Set([...currentSeen, ...activeExamQuestions.map((q) => q.id)])
    );

    const newAttempt: UserExamAttempt = {
      id: `exam-30mcq-${Date.now()}`,
      setId: `exam-batch-${attemptNumber}`,
      setTitle: `Exam Attempt #${attemptNumber} (30 MCQs from 2,000-Question Bank)`,
      scoreMarks,
      totalMarks,
      correctCount,
      failedCount,
      unansweredCount,
      totalQuestions,
      percentage,
      grade,
      passed,
      questionIds: activeExamQuestions.map((q) => q.id),
      selectedAnswers: { ...examAnswers },
      completedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };

    const updatedAttempts = [
      newAttempt,
      ...(toolsData.examAttempts || [])
    ].slice(0, 30);

    const updatedTools: UserToolsData = {
      ...toolsData,
      examAttempts: updatedAttempts,
      seenExamQuestionIds: mergedSeen,
      lastActiveTool: 'exam',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };

    setSubmittedAttempt(newAttempt);
    await onSaveToolsData(updatedTools);
    triggerSaveBanner(
      `Exam Completed! Score: ${percentage}% (${correctCount} Passed / ${failedCount} Failed out of 30 MCQs) — Saved to your Profile!`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start or Load Next 30 Different Interview Questions from the 2,000-Q&A Bank
  const handleLoadNext30InterviewQuestions = async (
    customSeenIds?: string[]
  ) => {
    const baseSeen =
      customSeenIds ??
      toolsData.seenInterviewQuestionIds ??
      [];
    const drawn = drawNext30InterviewQuestions(baseSeen);
    const nextSessionNum = (toolsData.interviewSessions?.length || 0) + 1;

    setActiveInterviewQuestions(drawn.questions);
    setInterviewBatchNumber(nextSessionNum);
    setInterviewCompletedReport(null);
    setInterviewTopicFilter('All');
    setExpandedQuestionId(drawn.questions[0]?.id || null);

    const updatedTools: UserToolsData = {
      ...toolsData,
      seenInterviewQuestionIds: drawn.nextSeenIds,
      lastActiveTool: 'interview',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    await onSaveToolsData(updatedTools);
    triggerSaveBanner(
      `Loaded 30 brand-new Interview Questions & Answers (Session #${nextSessionNum})!`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Complete 30-Question Interview Session & Generate Personalized Report + Graph
  const handleCompleteInterviewSession = async () => {
    const masteredSet = new Set(toolsData.masteredInterviewIds || []);
    // Automatically mark all 30 questions in the completed session as prepared if none were manually ticked, or count ticked ones
    const manuallyPreparedCount = activeInterviewQuestions.filter((q) =>
      masteredSet.has(q.id)
    ).length;
    const effectivePreparedCount =
      manuallyPreparedCount > 0
        ? manuallyPreparedCount
        : activeInterviewQuestions.length;

    const updatedMastered =
      manuallyPreparedCount > 0
        ? toolsData.masteredInterviewIds
        : Array.from(
            new Set([
              ...(toolsData.masteredInterviewIds || []),
              ...activeInterviewQuestions.map((q) => q.id)
            ])
          );

    const readinessPercentage = Math.round(
      (effectivePreparedCount / Math.max(1, activeInterviewQuestions.length)) *
        100
    );
    const sessionNum = (toolsData.interviewSessions?.length || 0) + 1;
    const currentSeen = toolsData.seenInterviewQuestionIds || [];
    const mergedSeen = Array.from(
      new Set([...currentSeen, ...activeInterviewQuestions.map((q) => q.id)])
    );

    const newSession: UserInterviewSession = {
      id: `int-session-${Date.now()}`,
      sessionTitle: `Interview Prep Session #${sessionNum} (30 Verified Q&As)`,
      totalQuestions: activeInterviewQuestions.length,
      preparedCount: effectivePreparedCount,
      readinessPercentage,
      questionIds: activeInterviewQuestions.map((q) => q.id),
      completedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };

    const updatedSessions = [
      newSession,
      ...(toolsData.interviewSessions || [])
    ].slice(0, 30);

    const updatedTools: UserToolsData = {
      ...toolsData,
      masteredInterviewIds: updatedMastered,
      interviewSessions: updatedSessions,
      seenInterviewQuestionIds: mergedSeen,
      lastActiveTool: 'interview',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };

    setInterviewCompletedReport(newSession);
    await onSaveToolsData(updatedTools);
    triggerSaveBanner(
      `30-Question Interview Session #${sessionNum} Completed & Saved to your Profile!`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMasteredInterview = async (qId: string) => {
    const exists = toolsData.masteredInterviewIds.includes(qId);
    const nextList = exists
      ? toolsData.masteredInterviewIds.filter((id) => id !== qId)
      : [...toolsData.masteredInterviewIds, qId];

    const updatedTools: UserToolsData = {
      ...toolsData,
      masteredInterviewIds: nextList,
      lastActiveTool: 'interview',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    await onSaveToolsData(updatedTools);
  };

  // Nutrition Handlers
  const handleSaveNutritionProfile = async (
    customNutrition?: NutritionProfileData,
    bannerText = 'Personal Health & Nutrition data saved to your Profile Control Panel!'
  ) => {
    const nextNut = customNutrition || nutritionForm;
    const updated: UserToolsData = {
      ...toolsData,
      nutrition: {
        ...nextNut,
        updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
      },
      lastActiveTool: 'nutrition',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    setNutritionForm(updated.nutrition);
    await onSaveToolsData(updated);
    triggerSaveBanner(bannerText);
  };

  const handleAddMealLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;
    const newItem: MealLogItem = {
      id: `meal-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      mealType: newMealType,
      foodName: newFoodName.trim(),
      portion: newPortion.trim() || '1 serving',
      calories: Math.max(0, Number(newCalories) || 0),
      proteinG: Math.max(0, Number(newProtein) || 0),
      carbsG: Math.max(0, Number(newCarbs) || 0),
      fatsG: Math.max(0, Number(newFats) || 0)
    };
    const nextNut: NutritionProfileData = {
      ...nutritionForm,
      mealLogs: [newItem, ...(nutritionForm.mealLogs || [])]
    };
    setNewFoodName('');
    await handleSaveNutritionProfile(
      nextNut,
      `Added "${newItem.foodName}" (${newItem.calories} kcal) to your daily calorie tracker!`
    );
  };

  const handleQuickAddPreset = async (
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
    const nextNut: NutritionProfileData = {
      ...nutritionForm,
      mealLogs: [newItem, ...(nutritionForm.mealLogs || [])]
    };
    await handleSaveNutritionProfile(
      nextNut,
      `Logged "${preset.name}" (+${preset.calories} kcal) & synced to Profile!`
    );
  };

  const handleDeleteMealLog = async (id: string) => {
    const nextNut: NutritionProfileData = {
      ...nutritionForm,
      mealLogs: (nutritionForm.mealLogs || []).filter((m) => m.id !== id)
    };
    await handleSaveNutritionProfile(nextNut, 'Meal item removed.');
  };

  const handleLogWeightCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = Number(newWeightEntryKg);
    if (!w || w < 25 || w > 250) return;
    const hM = Math.max(1.2, (nutritionForm.heightCm || 170) / 100);
    const entryBmi = Number((w / (hM * hM)).toFixed(1));
    const nextHistory = [
      ...(nutritionForm.weightHistory || []),
      {
        date:
          newWeightEntryDate.trim() ||
          `Check ${nutritionForm.weightHistory.length + 1}`,
        weightKg: w,
        bmi: entryBmi
      }
    ].slice(-8);

    const nextNut: NutritionProfileData = {
      ...nutritionForm,
      weightKg: w,
      weightHistory: nextHistory
    };
    await handleSaveNutritionProfile(
      nextNut,
      `Weight updated to ${w} kg (BMI ${entryBmi}) & saved to Profile!`
    );
  };

  const handleApplySuggestedMealPlan = async (
    planKey: 'lose' | 'maintain' | 'gain'
  ) => {
    const nextNut: NutritionProfileData = {
      ...nutritionForm,
      goalType: planKey,
      mealPlans: PRESET_MEAL_PLANS[planKey]
    };
    await handleSaveNutritionProfile(
      nextNut,
      `Applied ${planKey.toUpperCase()} Meal Plan to your Personal Nutrition Tracker!`
    );
  };

  // Compute Subject-wise breakdown for the 30-MCQ Exam Report Graph
  const examSubjectBreakdown = useMemo(() => {
    const map: Record<
      string,
      { total: number; passed: number; failed: number }
    > = {};
    const ansSource = submittedAttempt?.selectedAnswers || examAnswers;
    activeExamQuestions.forEach((q) => {
      if (!map[q.subject]) {
        map[q.subject] = { total: 0, passed: 0, failed: 0 };
      }
      map[q.subject].total += 1;
      if (ansSource[q.id] === q.correctAnswerIndex) {
        map[q.subject].passed += 1;
      } else {
        map[q.subject].failed += 1;
      }
    });
    return Object.entries(map).map(([subject, stats]) => ({
      subject,
      ...stats,
      pct: Math.round((stats.passed / Math.max(1, stats.total)) * 100)
    }));
  }, [activeExamQuestions, submittedAttempt, examAnswers]);

  // Compute Topic breakdown for the 30-Question Interview Report Graph
  const interviewTopicBreakdown = useMemo(() => {
    const masteredSet = new Set(toolsData.masteredInterviewIds || []);
    const map: Record<string, { total: number; prepared: number }> = {};
    activeInterviewQuestions.forEach((q) => {
      if (!map[q.topic]) {
        map[q.topic] = { total: 0, prepared: 0 };
      }
      map[q.topic].total += 1;
      if (masteredSet.has(q.id) || interviewCompletedReport) {
        map[q.topic].prepared += 1;
      }
    });
    return Object.entries(map).map(([topic, stats]) => ({
      topic,
      ...stats,
      pct: Math.round((stats.prepared / Math.max(1, stats.total)) * 100)
    }));
  }, [
    activeInterviewQuestions,
    toolsData.masteredInterviewIds,
    interviewCompletedReport
  ]);

  const answeredExamCount = Object.keys(examAnswers).length;

  return (
    <div className="space-y-4 pb-6">
      {/* TOP SAVE / ACTION NOTIFICATION BANNER */}
      {saveBanner && (
        <div className="p-3.5 rounded-2xl bg-[#13422B] text-white text-xs font-extrabold flex items-center justify-between gap-2 shadow-md border border-emerald-400/30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
            <span>{saveBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveBanner(null)}
            className="text-emerald-200 hover:text-white underline text-[11px] shrink-0 cursor-pointer"
          >
            OK
          </button>
        </div>
      )}

      {/* EXPIRED PREMIUM WARNING BANNER */}
      {hasExpiredPremium && !isUserPaid && (
        <div className="rounded-[22px] bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#7C2D12] text-white p-4 shadow-md border border-red-300/40 space-y-2.5">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-400/20 border border-red-300/40 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-300 text-[#7F1D1D] text-[10px] font-extrabold uppercase tracking-wider">
                  Premium Membership Expired — Access Locked
                </span>
                <h2 className="text-sm sm:text-base font-extrabold text-white mt-1">
                  Your Paid Premium Membership Has Ended
                </h2>
                <p className="text-xs text-red-100 leading-relaxed mt-0.5">
                  Access to the Daily Nutrition Tracker, 2,000-MCQ Exam
                  Preparation, and 2,000-Question Interview Preparation is now
                  locked. Renew your membership to unlock all tools and your
                  saved Profile Control Panel data.
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenPremiumModal}
            className="w-full py-3 px-4 rounded-xl bg-amber-300 hover:bg-amber-200 text-[#7F1D1D] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Crown className="w-4 h-4" />
            <span>
              Renew Premium Membership Now (Rs. {monthlyFeeRs}/Month • Rs.{' '}
              {yearlyFeeRs}/Year)
            </span>
          </button>
        </div>
      )}

      {/* FREE USER / EXPIRED USER PAYWALL MODAL WHEN CLICKING ANY TOOL */}
      {showPaywallPrompt && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0E9F6E] rounded-[28px] max-w-md w-full p-5 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 text-[#B45309] flex items-center justify-center shrink-0">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-[10px] font-extrabold uppercase tracking-wider">
                    {hasExpiredPremium
                      ? 'Membership Expired'
                      : 'Paid Premium Member Tool'}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0F291E] mt-0.5">
                    {hasExpiredPremium
                      ? 'Renew Premium to Unlock Tools'
                      : 'Purchase / Buy Premium Membership'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPaywallPrompt(false)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#9BCAB0] space-y-2">
              <div className="text-xs font-extrabold text-[#13422B]">
                You clicked: &ldquo;{paywallFeatureTitle}&rdquo;
              </div>
              <p className="text-xs text-[#334155] leading-relaxed">
                {hasExpiredPremium
                  ? 'Your previous Paid Premium subscription has expired, so access to Specialist Tools, Exam MCQs, and Interview Prep is currently closed.'
                  : 'Free users can preview the Specialist Tools hub, but opening and using the interactive tools requires a Paid Premium Membership:'}
              </p>
              <ul className="space-y-1.5 text-xs text-[#0F291E] font-medium pt-1">
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-[#0E9F6E] shrink-0 mt-0.5" />
                  <span>
                    <strong>Daily Personal Health &amp; Nutrition App:</strong>{' '}
                    Calorie Counter, Meal Planner, Live BMI Graph (Gain/Reduce
                    Weight Verdict) &amp; Full PDF Report
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-[#0E9F6E] shrink-0 mt-0.5" />
                  <span>
                    <strong>
                      Exam Preparation ({TOTAL_EXAM_BANK_SIZE.toLocaleString()}{' '}
                      MCQs Bank):
                    </strong>{' '}
                    30 fresh non-repeating MCQs on every attempt covering Food
                    Safety, HACCP, ISO 9001, ISO 22000, FSSC 22000 &amp; Food
                    Science + Personalized Graph &amp; PDF Transcript
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-[#0E9F6E] shrink-0 mt-0.5" />
                  <span>
                    <strong>
                      Interview Preparation (
                      {TOTAL_INTERVIEW_BANK_SIZE.toLocaleString()} Q&amp;As
                      Bank):
                    </strong>{' '}
                    30 fresh interview questions &amp; expert answers every
                    session + Personalized Graph &amp; PDF Report
                  </span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-gray-200">
                <div className="text-[11px] font-bold text-gray-500">
                  1 Month Plan
                </div>
                <div className="text-lg font-extrabold text-[#0F291E] mt-0.5">
                  Rs. {monthlyFeeRs}
                </div>
                <div className="text-[10px] font-semibold text-gray-500">
                  30 Days Full Access
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#ECFDF5] border-2 border-[#0E9F6E] relative">
                <span className="px-2 py-0.5 rounded-full bg-[#0E9F6E] text-white text-[9px] font-extrabold uppercase">
                  {yearlyDiscountPct}% Discount
                </span>
                <div className="text-lg font-extrabold text-[#0F291E] mt-0.5">
                  Rs. {yearlyFeeRs}
                </div>
                <div className="text-[10px] font-bold text-[#0E9F6E]">
                  Full Year (365 Days)
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPaywallPrompt(false);
                  onOpenPremiumModal();
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#15803D] via-[#0E9F6E] to-[#13422B] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Purchase / Buy Premium Membership Now</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPaywallPrompt(false)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BACK BUTTON ONLY WHEN INSIDE A SPECIFIC TOOL */}
      {activeSection !== 'hub' && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveSection('hub')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#E2F2E9] border border-[#CBE3D6] text-[#0F291E] text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <span>← Back to All Tools</span>
          </button>
        </div>
      )}

      {/* =====================================================================
          VIEW 0: UNIFIED TOOLS HUB OVERVIEW (ALL 3 TOOLS ON ONE PAGE — NO 5 SETS)
         ===================================================================== */}
      {activeSection === 'hub' && (
        <div className="space-y-4">
          {/* TOOL CARD 1: DAILY PERSONAL HEALTH & NUTRITION TRACKER */}
          <div
            onClick={() =>
              handleSelectToolOrAction(
                'nutrition',
                'Daily Personal Health & Nutrition Tracker'
              )
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectToolOrAction(
                  'nutrition',
                  'Daily Personal Health & Nutrition Tracker'
                );
              }
            }}
            className="bg-white border-[1.5px] border-[#BCE3C8] hover:border-[#0E9F6E] rounded-[24px] p-4 sm:p-5 shadow-sm transition-all cursor-pointer space-y-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#D7EFE2] text-[#0D6845] text-[10px] font-extrabold uppercase">
                      Tool 1 • Personal Health &amp; Diet
                    </span>
                    {!isUserPaid && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-[#92400E] text-[10px] font-extrabold inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Premium Only
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0F291E] mt-1">
                    Complete Nutrition &amp; BMI Calculator, Health Condition Guide &amp; AI Dietitian Agent
                  </h2>
                  <p className="text-xs text-[#5C7267] leading-relaxed mt-0.5">
                    1-Page BMI Gauge &amp; Weight Goal Graph, BMR, TDEE, Ideal
                    Weight, Daily Calorie &amp; Macro Targets, Water Tracker,
                    Health Condition Food Guide (Recommended vs. Avoid) &amp;
                    AI Dietitian Chat Agent for resolving any nutrition issue.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Saved BMI Status
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  {metrics.bmi} kg/m²
                </div>
                <div
                  className="text-[10px] font-extrabold truncate"
                  style={{ color: metrics.bmiColorHex }}
                >
                  {metrics.bmiCategory}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Weight &amp; Calories
                </div>
                <div className="text-xs font-extrabold text-[#0E9F6E] mt-0.5">
                  BMI &amp; Weight Graph
                </div>
                <div className="text-[10px] text-[#5C7267] font-semibold">
                  Gain / Reduce Guide
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Health Conditions
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  AI Dietitian Agent
                </div>
                <div className="text-[10px] text-[#0E9F6E] font-bold">
                  Diabetes, BP, PCOS +
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#ECF4EF]">
              <span className="text-[11px] font-bold text-[#13422B]">
                Easy 1-Page BMI &amp; Weight Tracker + Health Guide + AI Dietitian Chat
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#0E9F6E] text-white text-xs font-extrabold inline-flex items-center gap-1">
                <span>Open Nutrition Tool</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* TOOL CARD 2: FOOD SCIENCE & FOOD SAFETY EXAM PREPARATION (30 DIFFERENT MCQs PER EXAM + SCORE REPORT & PDF DOWNLOAD) */}
          <div
            onClick={() =>
              handleSelectToolOrAction(
                'exam',
                'Food Science Exam Preparation (30 MCQs)'
              )
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectToolOrAction(
                  'exam',
                  'Food Science Exam Preparation (30 MCQs)'
                );
              }
            }}
            className="bg-white border-[1.5px] border-[#BCE3C8] hover:border-[#0E9F6E] rounded-[24px] p-4 sm:p-5 shadow-sm transition-all cursor-pointer space-y-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#D7EFE2] text-[#0D6845] text-[10px] font-extrabold uppercase">
                      Tool 2 • 30 MCQs / Exam • Score Report &amp; PDF
                    </span>
                    {!isUserPaid && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-[#92400E] text-[10px] font-extrabold inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Free: 1 Exam / Day
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0F291E] mt-1">
                    Food Science &amp; Food Safety Exam Preparation (30 MCQs per
                    Exam)
                  </h2>
                  <p className="text-xs text-[#5C7267] leading-relaxed mt-0.5">
                    Click to start your <strong>30-MCQs Exam</strong> immediately.
                    Upon completion, view your complete{' '}
                    <strong>Score Report (Correct vs. Wrong MCQs)</strong>,
                    download your <strong>PDF Report</strong>, and click{' '}
                    <strong>Next Exam / Give Exam Again</strong> to take another
                    exam with <strong>30 brand-new, different MCQs</strong> every
                    time!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Each Exam
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  30 MCQs
                </div>
                <div className="text-[10px] text-[#0E9F6E] font-bold">
                  30 Mins Timed
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Next Exam
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  30 New MCQs
                </div>
                <div className="text-[10px] text-[#5C7267] font-semibold">
                  Different Every Time
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Score Report
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  PDF Download
                </div>
                <div className="text-[10px] text-[#0E9F6E] font-bold">
                  Correct &amp; Wrong Key
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#ECF4EF]">
              <span className="text-[11px] font-bold text-[#13422B]">
                30 Different MCQs Every Exam + Score Report + PDF Download
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#0E9F6E] text-white text-xs font-extrabold inline-flex items-center gap-1">
                <span>Open Exam Tool</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 1: NEW COMPLETE NUTRITION TOOL SUITE (SINGLE EASY PAGE)
         ===================================================================== */}
      {activeSection === 'nutrition' && (
        <NutritionSuiteTool
          user={user}
          isUserPaid={isUserPaid}
          hasExpiredPremium={hasExpiredPremium}
          toolsData={toolsData}
          onSaveToolsData={onSaveToolsData}
          onOpenPremiumModal={onOpenPremiumModal}
        />
      )}

      {/* =====================================================================
          VIEW 2: NEW COMPLETE FOOD SCIENCE EXAM PREPARATION SUITE
         ===================================================================== */}
      {activeSection === 'exam' && (
        <ExamSuiteTool
          user={user}
          isUserPaid={isUserPaid}
          hasExpiredPremium={hasExpiredPremium}
          toolsData={toolsData}
          onSaveToolsData={onSaveToolsData}
          onOpenPremiumModal={onOpenPremiumModal}
        />
      )}
    </div>
  );
};
