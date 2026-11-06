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
      interviewSessions: saved.interviewSessions || [],
      seenExamQuestionIds: saved.seenExamQuestionIds || [],
      seenInterviewQuestionIds: saved.seenInterviewQuestionIds || [],
      masteredInterviewIds: saved.masteredInterviewIds || [],
      bookmarkedInterviewIds: saved.bookmarkedInterviewIds || []
    };
  }, [user.toolsData]);

  // Allow opening 'nutrition' (which has built-in Free vs Premium limits) or any tool if isUserPaid
  const [activeSection, setActiveSection] = useState<ActiveToolSection>(() =>
    isUserPaid || (initialSection === 'nutrition' && !hasExpiredPremium)
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
      (isUserPaid || (initialSection === 'nutrition' && !hasExpiredPremium))
    ) {
      setActiveSection(initialSection);
    } else if (!isUserPaid && initialSection !== 'nutrition') {
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
    // Nutrition tool allows Free non-expired users to enter and use the Free tier (1 BMI calc, 5 Recipes, 1-Day Meal Plan, 1 Health Condition Search)
    if (targetSection === 'nutrition' && !hasExpiredPremium) {
      setActiveSection('nutrition');
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
                  25% Discount
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
                    Complete Nutrition Dashboard, AI Meal Planner, 44+ Recipes
                    &amp; Health Condition Guide
                  </h2>
                  <p className="text-xs text-[#5C7267] leading-relaxed mt-0.5">
                    BMI Gauge &amp; Health Score (0–100), BMR, TDEE, Ideal
                    Weight, Body Fat %, Visceral Fat, Water Tracker, 7-Day AI
                    Meal Plan (with Grams &amp; Grocery List), 44+ Desi /
                    Pakistani / Chinese / Italian / Healthy Recipes, Health
                    Condition Food Guide &amp; AI Dietitian Chat.
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
                  Recipes &amp; Plans
                </div>
                <div className="text-xs font-extrabold text-[#0E9F6E] mt-0.5">
                  44+ Recipes • 7-Day Plan
                </div>
                <div className="text-[10px] text-[#5C7267] font-semibold">
                  Desi, Chinese, Italian
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Health Conditions
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  AI Dietitian
                </div>
                <div className="text-[10px] text-[#0E9F6E] font-bold">
                  Diabetes, BP, PCOS +
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#ECF4EF]">
              <span className="text-[11px] font-bold text-[#13422B]">
                Includes BMI Gauge + 7-Day AI Meal Plan + 44+ Recipes + Health
                Guide
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#0E9F6E] text-white text-xs font-extrabold inline-flex items-center gap-1">
                <span>Open Nutrition Tool</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* TOOL CARD 2: UNIFIED EXAM PREPARATION (2,000 DIFFERENT MCQs — 30 MCQs PER TEST) */}
          <div className="bg-white border-[1.5px] border-[#BCE3C8] hover:border-[#0E9F6E] rounded-[24px] p-4 sm:p-5 shadow-sm transition-all space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#D7EFE2] text-[#0D6845] text-[10px] font-extrabold uppercase">
                      Tool 2 • {TOTAL_EXAM_BANK_SIZE.toLocaleString()} MCQs
                      Master Bank • 30 MCQs / Attempt
                    </span>
                    {!isUserPaid && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-[#92400E] text-[10px] font-extrabold inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Premium Only
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0F291E] mt-1">
                    Food Science, Food Safety, HACCP, ISO 9001, ISO 22000 &amp;
                    FSSC 22000 Exam Preparation
                  </h2>
                  <p className="text-xs text-[#5C7267] leading-relaxed mt-0.5">
                    Powered by a massive bank of{' '}
                    <strong>2,000 different MCQs</strong> covering all relevant
                    Food Science &amp; Food Safety subjects. Every time you start
                    a test, you get <strong>30 fresh MCQs</strong>, followed by a
                    personalized Performance Graph &amp; PDF Report in your name
                    showing Passed, Failed &amp; Percentage Score!
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Coverage Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                'Food Safety & GMP',
                'HACCP Principles',
                'ISO 9001:2015',
                'ISO 22000:2018',
                'FSSC 22000 v6',
                'Food Microbiology',
                'Dairy & Beverage Tech',
                'Cereal, Bakery & Meat Science',
                'Food Chemistry & Nutrition'
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[#F4FAF7] border border-[#D4E9DF] text-[#13422B] text-[10.5px] font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Total MCQ Bank
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  2,000 MCQs
                </div>
                <div className="text-[10px] text-[#0E9F6E] font-bold">
                  All Relevant Subjects
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Per Attempt
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  30 Different MCQs
                </div>
                <div className="text-[10px] text-[#5C7267] font-semibold">
                  New Questions Every Time
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Completed Tests
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  {toolsData.examAttempts?.length || 0} Tests
                </div>
                <div className="text-[10px] text-[#0E9F6E] font-bold">
                  {(toolsData.seenExamQuestionIds || []).length} / 2,000 Seen
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSelectToolOrAction(
                  'exam',
                  '30-MCQ Exam Preparation (2,000 MCQs Bank)',
                  () => {
                    if (submittedAttempt) {
                      handleStartNew30McqExam();
                    }
                  }
                )
              }
              className="w-full py-3.5 px-4 rounded-2xl bg-[#13422B] hover:bg-[#0E9F6E] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Award className="w-4 h-4 text-emerald-300" />
              <span>
                Start 30-MCQ Exam Preparation Now (2,000 MCQs Bank) →
              </span>
            </button>
          </div>

          {/* TOOL CARD 3: UNIFIED INTERVIEW PREPARATION (2,000 DIFFERENT Q&As — 30 QUESTIONS PER SESSION) */}
          <div className="bg-white border-[1.5px] border-[#BCE3C8] hover:border-[#0E9F6E] rounded-[24px] p-4 sm:p-5 shadow-sm transition-all space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#D7EFE2] text-[#0D6845] text-[10px] font-extrabold uppercase">
                      Tool 3 • {TOTAL_INTERVIEW_BANK_SIZE.toLocaleString()}{' '}
                      Interview Q&amp;As • 30 Qs / Session
                    </span>
                    {!isUserPaid && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-[#92400E] text-[10px] font-extrabold inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Premium Only
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0F291E] mt-1">
                    Food Science, Food Safety, HACCP, ISO 9001, ISO 22000 &amp;
                    FSSC 22000 Interview Preparation
                  </h2>
                  <p className="text-xs text-[#5C7267] leading-relaxed mt-0.5">
                    One unified Interview Preparation portal backed by{' '}
                    <strong>2,000 different interview questions &amp; answers</strong>.
                    Each session presents <strong>30 unique questions</strong>{' '}
                    with expert model answers, and upon completion generates a
                    personalized Readiness Graph &amp; PDF Report in your name!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Interview Q&amp;A Bank
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  2,000 Q&amp;As
                </div>
                <div className="text-[10px] text-[#0E9F6E] font-bold">
                  With Model Answers
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Per Session
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  30 Questions
                </div>
                <div className="text-[10px] text-[#5C7267] font-semibold">
                  Fresh 30 Every Time
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                <div className="text-[10px] font-bold text-[#5C7267]">
                  Prepared Q&amp;As
                </div>
                <div className="text-sm font-extrabold text-[#0F291E] mt-0.5">
                  {toolsData.masteredInterviewIds?.length || 0} Prepared
                </div>
                <div className="text-[10px] text-[#0E9F6E] font-bold">
                  {(toolsData.seenInterviewQuestionIds || []).length} / 2,000
                  Seen
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSelectToolOrAction(
                  'interview',
                  '30-Question Interview Preparation (2,000 Q&As Bank)'
                )
              }
              className="w-full py-3.5 px-4 rounded-2xl bg-[#13422B] hover:bg-[#0E9F6E] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Briefcase className="w-4 h-4 text-emerald-300" />
              <span>
                Open Interview Preparation (30 Questions from 2,000 Q&amp;As) →
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 1: NEW COMPLETE NUTRITION TOOL SUITE (REPLACING OLD NUTRITION APP)
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
          VIEW 2: UNIFIED EXAM PREPARATION (30 MCQs AT A TIME FROM 2,000-MCQ BANK)
         ===================================================================== */}
      {activeSection === 'exam' && isUserPaid && (
        <div className="space-y-4">
          {/* Top Exam Header Banner */}
          <div className="bg-gradient-to-r from-[#13422B] via-[#155E3A] to-[#0E9F6E] rounded-[24px] p-4 sm:p-5 text-white shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200 text-[10.5px] font-extrabold uppercase tracking-wider">
                2,000 Verified MCQs Bank • Showing 30 Unique MCQs (Attempt #
                {examBatchNumber})
              </span>
              <button
                type="button"
                onClick={() => handleStartNew30McqExam()}
                className="px-3.5 py-1.5 rounded-full bg-white text-[#13422B] hover:bg-emerald-50 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#0E9F6E]" />
                <span>Load Next 30 Different MCQs</span>
              </button>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold leading-tight">
                Food Science, Food Safety, HACCP, ISO 9001, ISO 22000 &amp; FSSC
                22000 Exam
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Candidate: <strong>{user.name || 'Food Specialist'}</strong> •
                30 MCQs per Test (60 Marks) • Every attempt loads 30 brand-new
                questions!
              </p>
            </div>
          </div>

          {/* IF EXAM IS COMPLETED: SHOW PERSONALIZED ASSESSMENT REPORT + GRAPH + PDF DOWNLOAD */}
          {submittedAttempt && (
            <div className="bg-white border-2 border-[#0E9F6E] rounded-[26px] p-4 sm:p-5 shadow-md space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#ECF4EF] pb-3.5">
                <div>
                  <span
                    className={`inline-block px-3 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase ${
                      submittedAttempt.passed
                        ? 'bg-[#DCFCE7] text-[#14532D]'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {submittedAttempt.passed
                      ? '✓ OFFICIAL VERDICT: PASSED (QUALIFIED)'
                      : '✗ OFFICIAL VERDICT: FAILED (NEEDS REVISION)'}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0F291E] mt-1">
                    {user.name || 'Food Specialist'}&apos;s Official 30-MCQ Exam
                    Assessment Report
                  </h3>
                  <p className="text-xs text-[#5C7267] font-medium">
                    Email: {user.email || 'Verified Member'} • Role:{' '}
                    {user.title || user.currentRole || 'Food Safety Specialist'}{' '}
                    • Date:{' '}
                    {new Date(
                      submittedAttempt.completedAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      downloadExamReportPdf(
                        user,
                        submittedAttempt,
                        activeExamQuestions,
                        examAnswers
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartNew30McqExam()}
                    className="px-4 py-2.5 rounded-xl bg-[#13422B] hover:bg-[#0F291E] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-300" />
                    <span>Take Next Exam (30 New MCQs)</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Score Cards: Percentage, Passed MCQs, Failed MCQs, Grade */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-[#F0FDF4] border border-[#9BCAB0] text-center">
                  <div className="text-[10.5px] font-bold text-[#13422B]">
                    Percentage Score
                  </div>
                  <div className="text-2xl font-extrabold text-[#0E9F6E] mt-0.5">
                    {submittedAttempt.percentage}%
                  </div>
                  <div className="text-[10.5px] font-bold text-[#13422B]">
                    {submittedAttempt.scoreMarks} /{' '}
                    {submittedAttempt.totalMarks} Marks
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-[10.5px] font-bold text-emerald-900">
                    Passed (Correct)
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">
                    {submittedAttempt.correctCount} / 30
                  </div>
                  <div className="text-[10.5px] font-bold text-emerald-800">
                    Correct Answers ✓
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-center">
                  <div className="text-[10.5px] font-bold text-red-900">
                    Failed (Wrong)
                  </div>
                  <div className="text-2xl font-extrabold text-red-600 mt-0.5">
                    {submittedAttempt.failedCount ??
                      30 - submittedAttempt.correctCount}{' '}
                    / 30
                  </div>
                  <div className="text-[10.5px] font-bold text-red-800">
                    Incorrect / Unanswered ✗
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                  <div className="text-[10.5px] font-bold text-blue-900">
                    Official Grade
                  </div>
                  <div className="text-base font-extrabold text-blue-800 mt-1">
                    {submittedAttempt.grade}
                  </div>
                  <div className="text-[10.5px] font-bold text-blue-700">
                    Pass Mark: 60%
                  </div>
                </div>
              </div>

              {/* VISUAL PERFORMANCE GRAPH: SVG DONUT + SUBJECT BREAKDOWN BAR CHART */}
              <div className="p-4 rounded-2xl bg-[#F8FCFA] border border-[#CBE3D6] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0F291E]">
                    Visual Performance Graph — {user.name || 'Food Specialist'}
                  </h4>
                  <span className="text-[11px] font-bold text-[#0E9F6E]">
                    Pass vs. Fail &amp; Subject Accuracy
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* SVG Donut Chart */}
                  <div className="flex flex-col items-center justify-center p-2">
                    <svg viewBox="0 0 120 120" className="w-32 h-32">
                      <circle
                        cx="60"
                        cy="60"
                        r="46"
                        fill="none"
                        stroke="#FEE2E2"
                        strokeWidth="14"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="46"
                        fill="none"
                        stroke="#0E9F6E"
                        strokeWidth="14"
                        strokeDasharray={`${
                          (submittedAttempt.percentage / 100) * 289
                        } 289`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                      <text
                        x="60"
                        y="56"
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="bold"
                        fill="#0F291E"
                      >
                        {submittedAttempt.percentage}%
                      </text>
                      <text
                        x="60"
                        y="72"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill={submittedAttempt.passed ? '#0E9F6E' : '#DC2626'}
                      >
                        {submittedAttempt.passed ? 'PASSED' : 'FAILED'}
                      </text>
                    </svg>
                    <div className="flex items-center gap-3 text-[11px] font-bold mt-1">
                      <span className="inline-flex items-center gap-1 text-[#0E9F6E]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0E9F6E]" />
                        Pass: {submittedAttempt.correctCount}
                      </span>
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        Fail:{' '}
                        {submittedAttempt.failedCount ??
                          30 - submittedAttempt.correctCount}
                      </span>
                    </div>
                  </div>

                  {/* Subject-Wise Accuracy Bars */}
                  <div className="sm:col-span-2 space-y-2">
                    <div className="text-[11px] font-extrabold text-[#13422B]">
                      Subject-Wise Accuracy Breakdown (30 MCQs):
                    </div>
                    {examSubjectBreakdown.map((item) => (
                      <div key={item.subject} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-[#0F291E]">{item.subject}</span>
                          <span className="text-[#13422B]">
                            {item.passed}/{item.total} Passed ({item.pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden flex">
                          <div
                            className="h-full bg-[#0E9F6E]"
                            style={{ width: `${item.pct}%` }}
                          />
                          <div
                            className="h-full bg-red-400"
                            style={{ width: `${100 - item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Strip Before Submission */}
          {!submittedAttempt && (
            <div className="bg-white border border-[#CBE3D6] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-extrabold text-[#0F291E]">
                  Progress: {answeredExamCount} / {activeExamQuestions.length}{' '}
                  MCQs Answered
                </div>
                <div className="text-[11px] text-[#5C7267]">
                  Select your answer for all 30 questions, then click
                  &ldquo;Submit 30-MCQ Exam &amp; View My Report&rdquo;.
                </div>
              </div>
              <button
                type="button"
                onClick={handleSubmit30McqExam}
                className="px-4 py-2.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold cursor-pointer shadow-xs"
              >
                Submit 30-MCQ Exam &amp; View Report
              </button>
            </div>
          )}

          {/* Subject Filter Pills for current 30 MCQs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              'All',
              'Food Safety',
              'HACCP',
              'ISO 22000',
              'FSSC 22000',
              'Food Microbiology',
              'Food Science & Tech',
              'Food Chemistry & Nutrition'
            ].map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setExamFilterSubject(subj)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold whitespace-nowrap cursor-pointer ${
                  examFilterSubject === subj
                    ? 'bg-[#13422B] text-white'
                    : 'bg-white text-[#13422B] border border-[#CBE3D6]'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* 30 MCQs List */}
          <div className="space-y-3">
            {activeExamQuestions
              .filter(
                (q) =>
                  examFilterSubject === 'All' || q.subject === examFilterSubject
              )
              .map((q) => {
                const selectedIdx = examAnswers[q.id];
                const isSubmitted = Boolean(submittedAttempt);
                const isCorrect = selectedIdx === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`bg-white border rounded-[22px] p-4 shadow-xs space-y-3 ${
                      isSubmitted
                        ? isCorrect
                          ? 'border-2 border-[#0E9F6E]'
                          : 'border-2 border-red-400'
                        : 'border-[#CBE3D6]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E2F2E9] text-[#0D6845] text-[10.5px] font-extrabold">
                        MCQ #{q.questionNumber} of 30 • {q.subject}
                      </span>
                      {isSubmitted && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                            isCorrect
                              ? 'bg-[#DCFCE7] text-[#14532D]'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isCorrect
                            ? '✓ PASS (+2 Marks)'
                            : '✗ FAIL (0 Marks)'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0F291E] leading-snug">
                      {q.question}
                    </h4>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedIdx === optIdx;
                        const isRightOption = optIdx === q.correctAnswerIndex;

                        let btnClass =
                          'bg-[#F8FCFA] border-[#D4E9DF] text-[#0F291E] hover:border-[#0E9F6E]';
                        if (isSubmitted) {
                          if (isRightOption) {
                            btnClass =
                              'bg-[#DCFCE7] border-2 border-[#0E9F6E] text-[#0F291E]';
                          } else if (isSelected && !isRightOption) {
                            btnClass =
                              'bg-red-50 border-2 border-red-500 text-red-900';
                          }
                        } else if (isSelected) {
                          btnClass =
                            'bg-[#13422B] border-[#13422B] text-white';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() =>
                              setExamAnswers((prev) => ({
                                ...prev,
                                [q.id]: optIdx
                              }))
                            }
                            className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-start justify-between gap-2 cursor-pointer ${btnClass}`}
                          >
                            <span>
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </span>
                            {isSubmitted && isRightOption && (
                              <CheckCircle2 className="w-4 h-4 text-[#0E9F6E] shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#9BCAB0] text-xs space-y-1">
                        <div className="font-extrabold text-[#13422B]">
                          Correct Answer:{' '}
                          {String.fromCharCode(65 + q.correctAnswerIndex)}.{' '}
                          {q.options[q.correctAnswerIndex]}
                        </div>
                        <p className="text-[11.5px] text-[#334155] leading-relaxed">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Bottom Submit or Next 30 MCQs Button */}
          <div className="pt-2">
            {!submittedAttempt ? (
              <button
                type="button"
                onClick={handleSubmit30McqExam}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#13422B] via-[#0E9F6E] to-[#15803D] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5 text-amber-300" />
                <span>
                  Complete 30-MCQ Exam &amp; Generate Personalized Report +
                  Graph
                </span>
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    downloadExamReportPdf(
                      user,
                      submittedAttempt,
                      activeExamQuestions,
                      examAnswers
                    )
                  }
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#0E9F6E] hover:bg-[#059669] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download My 30-MCQ Report (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStartNew30McqExam()}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#13422B] hover:bg-[#0F291E] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-300" />
                  <span>Take Next Exam (30 Different MCQs)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 3: UNIFIED INTERVIEW PREPARATION (30 QUESTIONS AT A TIME FROM 2,000-Q&A BANK)
         ===================================================================== */}
      {activeSection === 'interview' && isUserPaid && (
        <div className="space-y-4">
          {/* Top Interview Header Banner */}
          <div className="bg-gradient-to-r from-[#13422B] via-[#155E3A] to-[#0E9F6E] rounded-[24px] p-4 sm:p-5 text-white shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200 text-[10.5px] font-extrabold uppercase tracking-wider">
                2,000 Interview Q&amp;As Bank • Showing 30 Questions (Session #
                {interviewBatchNumber})
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    downloadInterviewSessionReportPdf(
                      user,
                      activeInterviewQuestions,
                      toolsData.masteredInterviewIds,
                      interviewBatchNumber
                    )
                  }
                  className="px-3 py-1.5 rounded-full bg-white text-[#13422B] hover:bg-emerald-50 text-xs font-extrabold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#0E9F6E]" />
                  <span>Download PDF Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadNext30InterviewQuestions()}
                  className="px-3 py-1.5 rounded-full bg-amber-300 text-[#13422B] hover:bg-amber-200 text-xs font-extrabold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Next 30 Different Qs</span>
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold leading-tight">
                Food Science, Food Safety, HACCP, ISO 9001, ISO 22000 &amp; FSSC
                22000 Interview Preparation
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                Specialist: <strong>{user.name || 'Food Specialist'}</strong> •
                30 Verified Interview Questions &amp; Answers per Session •
                Click &ldquo;Next 30 Different Qs&rdquo; anytime for a fresh set
                of 30!
              </p>
            </div>
          </div>

          {/* IF INTERVIEW SESSION IS COMPLETED: SHOW PERSONALIZED INTERVIEW REPORT + GRAPH + PDF */}
          {interviewCompletedReport && (
            <div className="bg-white border-2 border-[#0E9F6E] rounded-[26px] p-4 sm:p-5 shadow-md space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#ECF4EF] pb-3">
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] text-[10.5px] font-extrabold uppercase">
                    ✓ INTERVIEW SESSION REPORT GENERATED
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0F291E] mt-1">
                    {user.name || 'Food Specialist'}&apos;s 30-Question
                    Interview Readiness Report
                  </h3>
                  <p className="text-xs text-[#5C7267] font-medium">
                    Email: {user.email || 'Verified Member'} • Role:{' '}
                    {user.title || user.currentRole || 'Food Safety Specialist'}{' '}
                    • Session #{interviewBatchNumber}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      downloadInterviewSessionReportPdf(
                        user,
                        activeInterviewQuestions,
                        toolsData.masteredInterviewIds,
                        interviewBatchNumber
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadNext30InterviewQuestions()}
                    className="px-4 py-2.5 rounded-xl bg-[#13422B] hover:bg-[#0F291E] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-300" />
                    <span>Load Next 30 Different Questions</span>
                  </button>
                </div>
              </div>

              {/* Visual Topic & Readiness Graph */}
              <div className="p-4 rounded-2xl bg-[#F8FCFA] border border-[#CBE3D6] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0F291E]">
                    Visual Interview Subject Coverage &amp; Readiness Graph —{' '}
                    {user.name || 'Food Specialist'}
                  </h4>
                  <span className="text-xs font-extrabold text-[#0E9F6E]">
                    {interviewCompletedReport.preparedCount} / 30 Questions
                    Covered ({interviewCompletedReport.readinessPercentage}%)
                  </span>
                </div>

                <div className="space-y-2">
                  {interviewTopicBreakdown.map((item) => (
                    <div key={item.topic} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-[#0F291E]">{item.topic}</span>
                        <span className="text-[#0E9F6E]">
                          {item.prepared}/{item.total} Q&amp;As ({item.pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-[#0E9F6E]"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Topic Filter Pills for current 30 Interview Questions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              'All',
              'Food Safety & GMP',
              'HACCP',
              'ISO 9001',
              'ISO 22000',
              'FSSC 22000',
              'Food Science & QA',
              'Food Microbiology',
              'Dairy & Beverage Tech',
              'Cereal, Bakery & Meat Tech'
            ].map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setInterviewTopicFilter(topic)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold whitespace-nowrap cursor-pointer ${
                  interviewTopicFilter === topic
                    ? 'bg-[#13422B] text-white'
                    : 'bg-white text-[#13422B] border border-[#CBE3D6]'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* 30 Interview Questions & Model Answers Accordion/Cards */}
          <div className="space-y-3">
            {activeInterviewQuestions
              .filter(
                (q) =>
                  interviewTopicFilter === 'All' ||
                  q.topic === interviewTopicFilter
              )
              .map((q, idx) => {
                const isPrepared = toolsData.masteredInterviewIds.includes(
                  q.id
                );
                const isExpanded =
                  expandedQuestionId === q.id || idx === 0;

                return (
                  <div
                    key={q.id}
                    className={`bg-white border rounded-[22px] p-4 shadow-xs space-y-2.5 transition-all ${
                      isPrepared
                        ? 'border-2 border-[#0E9F6E]'
                        : 'border-[#CBE3D6]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E2F2E9] text-[#0D6845] text-[10.5px] font-extrabold">
                        Q#{idx + 1} of 30 • {q.topic}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleMasteredInterview(q.id)}
                        className={`px-2.5 py-1 rounded-full text-[10.5px] font-extrabold cursor-pointer transition-colors ${
                          isPrepared
                            ? 'bg-[#0E9F6E] text-white'
                            : 'bg-[#F4FAF7] text-[#13422B] border border-[#BCE3C8]'
                        }`}
                      >
                        {isPrepared ? '✓ Prepared' : 'Mark as Prepared'}
                      </button>
                    </div>

                    <div
                      onClick={() =>
                        setExpandedQuestionId(
                          expandedQuestionId === q.id ? null : q.id
                        )
                      }
                      className="flex items-start justify-between gap-2 cursor-pointer"
                    >
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#0F291E] leading-snug">
                        {q.question}
                      </h4>
                      <ChevronDown
                        className={`w-4 h-4 text-[#0E9F6E] shrink-0 mt-0.5 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-[#ECF4EF] space-y-2">
                        <div className="p-3 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF] text-xs text-[#0F291E] leading-relaxed">
                          <strong className="text-[#13422B]">
                            Expert Model Answer:
                          </strong>{' '}
                          {q.answer}
                        </div>
                        <div className="px-3 py-2 rounded-xl bg-[#FFFBEB] border border-amber-200 text-[11px] font-bold text-amber-950">
                          💡 <strong>Key Takeaway:</strong> {q.keyTakeaway}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Bottom Complete Session & Next 30 Different Interview Questions Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleCompleteInterviewSession}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#0E9F6E] hover:bg-[#059669] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Complete Session &amp; Generate My 30-Q Report + Graph
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLoadNext30InterviewQuestions()}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#13422B] hover:bg-[#0F291E] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-emerald-300" />
              <span>Next Attempt: Load 30 Different Interview Questions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
