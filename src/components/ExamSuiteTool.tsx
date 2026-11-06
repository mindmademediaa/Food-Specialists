import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  Award,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Download,
  FileText,
  Flag,
  Grid,
  Home,
  Info,
  Lock,
  Play,
  RotateCcw,
  Share2,
  Sparkles,
  Trophy,
  UserCheck,
  X
} from 'lucide-react';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { HubUser, UserExamAttempt, UserToolsData } from '../types/hub';
import {
  draw30ExamSuiteQuestions,
  ExamAnswerRecord,
  LEADERBOARD_TOP_10_WEEKLY,
  OptionLetter,
  SuiteExamQuestion,
  SuiteExamResult
} from '../data/examSuiteData';
import {
  download5PageExamReportPdf,
  downloadExamAchievementCertificatePdf
} from '../lib/exam5PagePdfGenerator';

interface ExamSuiteToolProps {
  user: HubUser;
  isUserPaid: boolean;
  hasExpiredPremium: boolean;
  toolsData: UserToolsData;
  onSaveToolsData: (updated: UserToolsData) => Promise<void>;
  onOpenPremiumModal: () => void;
}

type ExamScreenMode = 'dashboard' | 'attempt' | 'result' | 'history' | 'profile';

const IN_PROGRESS_STORAGE_KEY = 'fs_portal_active_exam_attempt_v3';

function stripLeadingReference(text: string): string {
  return (text || '').replace(/^\[[^\]]+\]\s*/, '').trim();
}

export const ExamSuiteTool: React.FC<ExamSuiteToolProps> = ({
  user,
  isUserPaid,
  hasExpiredPremium,
  toolsData,
  onSaveToolsData,
  onOpenPremiumModal
}) => {
  const canUsePremium = isUserPaid && !hasExpiredPremium;
  const firstName = useMemo(() => {
    const raw = (user.name || 'Alex').trim();
    return raw.split(' ')[0] || 'Alex';
  }, [user.name]);
  const avatarInitial = useMemo(
    () => (firstName[0] || 'A').toUpperCase(),
    [firstName]
  );

  // Screen Navigation State (No separate Categories screen)
  const [screen, setScreen] = useState<ExamScreenMode>('dashboard');

  // Saved Results, Bookmarks & Study Time
  const [savedResults, setSavedResults] = useState<SuiteExamResult[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<
    SuiteExamQuestion[]
  >([]);
  const [totalStudySeconds, setTotalStudySeconds] = useState<number>(87120);

  // Active 30-MCQ Exam Attempt State
  const [activeQuestions, setActiveQuestions] = useState<SuiteExamQuestion[]>(
    []
  );
  const [activeExamTitle, setActiveExamTitle] = useState<string>('Exam #1');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, OptionLetter>
  >({});
  const [flaggedIds, setFlaggedIds] = useState<Record<string, boolean>>({});
  const [visitedIds, setVisitedIds] = useState<Record<string, boolean>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1800); // 30 mins
  const [initialDurationSeconds, setInitialDurationSeconds] =
    useState<number>(1800);
  const [showQuestionPalette, setShowQuestionPalette] =
    useState<boolean>(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] =
    useState<boolean>(false);
  const [hasSavedInProgressExam, setHasSavedInProgressExam] =
    useState<boolean>(false);

  // Active Result Screen State
  const [activeResult, setActiveResult] = useState<SuiteExamResult | null>(
    null
  );
  const [expandedReviewIds, setExpandedReviewIds] = useState<
    Record<string, boolean>
  >({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [paywallModalFeature, setPaywallModalFeature] = useState<string | null>(
    null
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Load saved exam results, progress & bookmarks from Firestore
  useEffect(() => {
    let isMounted = true;
    async function loadUserExamData() {
      try {
        const rawInProgress = localStorage.getItem(IN_PROGRESS_STORAGE_KEY);
        if (rawInProgress) {
          setHasSavedInProgressExam(true);
        }

        if (user?.uid) {
          const progRef = doc(db, 'users', user.uid, 'progress', 'main');
          const progSnap = await getDoc(progRef);
          if (progSnap.exists() && isMounted) {
            const data = progSnap.data();
            if (typeof data.totalStudySeconds === 'number') {
              setTotalStudySeconds(data.totalStudySeconds);
            }
          }

          const bmRef = doc(db, 'users', user.uid, 'bookmarks', 'main');
          const bmSnap = await getDoc(bmRef);
          if (bmSnap.exists() && isMounted) {
            const bmData = bmSnap.data();
            if (Array.isArray(bmData.questions)) {
              setBookmarkedQuestions(bmData.questions);
            }
          }

          const resultsCol = collection(db, 'users', user.uid, 'examResults');
          const resultsSnap = await getDocs(resultsCol);
          const loaded: SuiteExamResult[] = [];
          resultsSnap.forEach((docSnap) => {
            const d = docSnap.data() as SuiteExamResult;
            if (d && d.examId) {
              loaded.push(d);
            }
          });
          if (loaded.length > 0 && isMounted) {
            loaded.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setSavedResults(loaded);
          }
        }
      } catch {
        // Silent fallback
      }
    }
    loadUserExamData();
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  // Check how many exams the user has attempted today (Free Tier: 1 Exam / Day)
  const examsAttemptedTodayCount = useMemo(() => {
    const todayPrefix = new Date().toISOString().slice(0, 10);
    return savedResults.filter((r) => r.date.startsWith(todayPrefix)).length;
  }, [savedResults]);

  // Countdown Timer during active 30-minute exam
  useEffect(() => {
    if (screen !== 'attempt') return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen]);

  // Auto-submit when timer hits 00:00
  useEffect(() => {
    if (
      screen === 'attempt' &&
      remainingSeconds === 0 &&
      activeQuestions.length > 0
    ) {
      finalizeAndSubmitExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, screen]);

  // Auto-save active exam progress in localStorage
  useEffect(() => {
    if (screen === 'attempt' && activeQuestions.length > 0) {
      const payload = {
        activeQuestions,
        activeExamTitle,
        currentIndex,
        selectedAnswers,
        flaggedIds,
        visitedIds,
        remainingSeconds,
        initialDurationSeconds,
        savedAt: new Date().toISOString()
      };
      try {
        localStorage.setItem(IN_PROGRESS_STORAGE_KEY, JSON.stringify(payload));
        setHasSavedInProgressExam(true);
      } catch {
        // Ignore quota error
      }
    }
  }, [
    screen,
    activeQuestions,
    activeExamTitle,
    currentIndex,
    selectedAnswers,
    flaggedIds,
    visitedIds,
    remainingSeconds,
    initialDurationSeconds
  ]);

  // Resume unfinished exam
  const handleResumeInProgressExam = () => {
    try {
      const raw = localStorage.getItem(IN_PROGRESS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed.activeQuestions) &&
        parsed.activeQuestions.length > 0
      ) {
        const cleanedQuestions = parsed.activeQuestions.map(
          (q: SuiteExamQuestion) => ({
            ...q,
            questionText: stripLeadingReference(q.questionText)
          })
        );
        setActiveQuestions(cleanedQuestions);
        setActiveExamTitle(parsed.activeExamTitle || 'Exam Attempt');
        setCurrentIndex(parsed.currentIndex || 0);
        setSelectedAnswers(parsed.selectedAnswers || {});
        setFlaggedIds(parsed.flaggedIds || {});
        setVisitedIds(
          parsed.visitedIds || { [cleanedQuestions[0].id]: true }
        );
        setRemainingSeconds(parsed.remainingSeconds || 1800);
        setInitialDurationSeconds(parsed.initialDurationSeconds || 1800);
        setScreen('attempt');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      localStorage.removeItem(IN_PROGRESS_STORAGE_KEY);
      setHasSavedInProgressExam(false);
    }
  };

  // Start a new 30-MCQ Exam (Every attempt draws 30 brand-new, non-repeating MCQs with shuffled options A/B/C/D)
  const handleStartNew30McqExam = async () => {
    if (!canUsePremium && examsAttemptedTodayCount >= 1) {
      setPaywallModalFeature(
        'Unlimited Exam Attempts (Free Users get 1 Exam per Day)'
      );
      return;
    }

    const drawn = draw30ExamSuiteQuestions({
      seenQuestionIds: toolsData.seenExamQuestionIds || [],
      category: 'All',
      difficulty: 'All',
      count: 30
    });

    const cleanedQuestions: SuiteExamQuestion[] = drawn.questions.map((q) => ({
      ...q,
      questionText: stripLeadingReference(q.questionText)
    }));

    const nextExamNumber =
      savedResults.length + (toolsData.examAttempts?.length || 0) + 1;
    const examTitle = `Exam Attempt #${nextExamNumber}`;

    setActiveQuestions(cleanedQuestions);
    setActiveExamTitle(examTitle);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedIds({});
    setVisitedIds(
      cleanedQuestions[0] ? { [cleanedQuestions[0].id]: true } : {}
    );
    setRemainingSeconds(1800); // 30 minutes
    setInitialDurationSeconds(1800);
    setShowQuestionPalette(false);
    setShowSubmitConfirmModal(false);
    setScreen('attempt');

    // Update seenExamQuestionIds so next exam attempt always loads 30 different MCQs
    const updatedToolsData: UserToolsData = {
      ...toolsData,
      seenExamQuestionIds: drawn.nextSeenIds,
      lastActiveTool: 'exam',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    await onSaveToolsData(updatedToolsData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Finalize and Submit 30-MCQ Exam
  const finalizeAndSubmitExam = async () => {
    setShowSubmitConfirmModal(false);
    localStorage.removeItem(IN_PROGRESS_STORAGE_KEY);
    setHasSavedInProgressExam(false);

    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    const answerRecords: ExamAnswerRecord[] = activeQuestions.map((q) => {
      const userAns = selectedAnswers[q.id] || null;
      const isRight = userAns !== null && userAns === q.correctAnswer;
      if (userAns === null) {
        skipped += 1;
      } else if (isRight) {
        correct += 1;
      } else {
        wrong += 1;
      }

      return {
        questionId: q.id,
        questionNumber: q.questionNumber,
        category: q.category,
        difficulty: q.difficulty,
        questionText: stripLeadingReference(q.questionText),
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect: isRight,
        isFlagged: Boolean(flaggedIds[q.id]),
        explanation: q.explanation,
        reference: ''
      };
    });

    const totalQ = activeQuestions.length || 30;
    const scorePercent = Math.round((correct / totalQ) * 100);
    const status: 'PASS' | 'FAIL' = scorePercent >= 50 ? 'PASS' : 'FAIL';

    const elapsedSec = Math.max(30, initialDurationSeconds - remainingSeconds);
    const elapsedMins = Math.max(1, Math.round(elapsedSec / 60));

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const examId = `exam-${Date.now()}`;
    const certificateId = `FS-CERT-${now.getFullYear()}-${String(
      Math.floor(100000 + Math.random() * 900000)
    )}`;

    const resultObj: SuiteExamResult = {
      examId,
      title: activeExamTitle,
      date: now.toISOString(),
      dateFormatted,
      category: 'Food Science & Food Safety',
      mode: 'Mock',
      totalQuestions: totalQ,
      correct,
      wrong,
      skipped,
      scorePercent,
      timeTakenSeconds: elapsedSec,
      timeTakenFormatted: `${elapsedMins} mins`,
      status,
      certificateId,
      answers: answerRecords
    };

    const nextResults = [resultObj, ...savedResults].slice(0, 30);
    setSavedResults(nextResults);
    setActiveResult(resultObj);
    const updatedStudySec = totalStudySeconds + elapsedSec;
    setTotalStudySeconds(updatedStudySec);
    setScreen('result');

    let grade = 'F (Needs Revision)';
    if (scorePercent >= 90) grade = 'A+ (Distinction)';
    else if (scorePercent >= 80) grade = 'A (Excellent)';
    else if (scorePercent >= 65) grade = 'B (Good)';
    else if (scorePercent >= 50) grade = 'C (Pass)';

    const legacyAttempt: UserExamAttempt = {
      id: examId,
      setId: examId,
      setTitle: `${resultObj.title} (30 MCQs)`,
      scoreMarks: correct * 2,
      totalMarks: totalQ * 2,
      correctCount: correct,
      failedCount: wrong + skipped,
      unansweredCount: skipped,
      totalQuestions: totalQ,
      percentage: scorePercent,
      grade,
      passed: status === 'PASS',
      questionIds: activeQuestions.map((q) => q.id),
      selectedAnswers: {},
      completedAt: now.toISOString().slice(0, 19) + 'Z'
    };

    const currentSeen = toolsData.seenExamQuestionIds || [];
    const mergedSeen = Array.from(
      new Set([...currentSeen, ...activeQuestions.map((q) => q.id)])
    );

    const updatedTools: UserToolsData = {
      ...toolsData,
      examAttempts: [legacyAttempt, ...(toolsData.examAttempts || [])].slice(
        0,
        30
      ),
      seenExamQuestionIds: mergedSeen,
      lastActiveTool: 'exam',
      updatedAt: now.toISOString().slice(0, 19) + 'Z'
    };
    await onSaveToolsData(updatedTools);

    if (user?.uid) {
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'examResults', examId),
          resultObj
        );
        await setDoc(
          doc(db, 'users', user.uid, 'progress', 'main'),
          {
            totalStudySeconds: updatedStudySec,
            examsCompleted: nextResults.length,
            updatedAt: now.toISOString()
          },
          { merge: true }
        );
      } catch {
        // Ignore offline/permission fallback
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Bookmark on a question
  const handleToggleBookmark = async (question: SuiteExamQuestion) => {
    const exists = bookmarkedQuestions.some((b) => b.id === question.id);
    const updated = exists
      ? bookmarkedQuestions.filter((b) => b.id !== question.id)
      : [question, ...bookmarkedQuestions].slice(0, 100);
    setBookmarkedQuestions(updated);
    showToast(
      exists ? 'Removed from Bookmarked Questions' : 'Saved to Bookmarks 🔖'
    );
    if (user?.uid) {
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'bookmarks', 'main'),
          {
            questions: updated,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch {
        // Ignore
      }
    }
  };

  const formatTimerMMSS = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remSec = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;
  };

  const formattedStudyTime = useMemo(() => {
    const hrs = Math.floor(totalStudySeconds / 3600);
    const mins = Math.floor((totalStudySeconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  }, [totalStudySeconds]);

  const overallAccuracyPct = useMemo(() => {
    if (savedResults.length === 0) return 80;
    const avg =
      savedResults.reduce((acc, r) => acc + r.scorePercent, 0) /
      savedResults.length;
    return Math.min(100, Math.max(10, Math.round(avg)));
  }, [savedResults]);

  const currentQuestion: SuiteExamQuestion | undefined =
    activeQuestions[currentIndex];

  const attemptCounts = useMemo(() => {
    const total = activeQuestions.length;
    const answered = Object.keys(selectedAnswers).length;
    const flagged = Object.values(flaggedIds).filter(Boolean).length;
    const notAnswered = Math.max(0, total - answered);
    return { total, answered, flagged, notAnswered };
  }, [activeQuestions.length, selectedAnswers, flaggedIds]);

  const handleShareResult = (res: SuiteExamResult) => {
    const text = `🎓 Food Science Exam Result:\nCandidate: ${
      user.name || 'Food Specialist'
    }\nExam: ${res.title}\nCorrect: ${res.correct}/${res.totalQuestions} | Wrong: ${
      res.wrong
    } | Score: ${res.scorePercent}% (${res.status})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Exam score summary copied to clipboard!');
    } else {
      showToast('Result ready to share!');
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-8 space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#13422B] text-white text-xs font-extrabold shadow-lg flex items-center gap-2 border border-emerald-400/30">
          <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Premium Paywall Modal */}
      {paywallModalFeature && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl border-2 border-[#16A34A] space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Crown className="w-7 h-7 stroke-[2.2]" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold uppercase">
              🔒 Premium Exam Feature
            </span>
            <h3 className="text-lg font-extrabold text-[#0F291E]">
              Unlock {paywallModalFeature}
            </h3>
            <p className="text-xs text-[#5C7267] leading-relaxed">
              Free users can attempt <strong>1 Exam per day (30 MCQs)</strong> and view
              their full score &amp; answers. Upgrade to <strong>Paid Premium</strong> to
              take unlimited exams with 30 new MCQs every time and download the{' '}
              <strong>Official Exam PDF Report</strong>!
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setPaywallModalFeature(null)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-xs font-extrabold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Maybe Later
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaywallModalFeature(null);
                  onOpenPremiumModal();
                }}
                className="flex-1 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold shadow-md cursor-pointer"
              >
                Upgrade to Premium →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 1: SIMPLE & CLEAN EXAM DASHBOARD (NO SEPARATE CATEGORIES)
         ===================================================================== */}
      {screen === 'dashboard' && (
        <div className="bg-[#F4F8F5] rounded-[32px] overflow-hidden border border-[#D5E8DC] shadow-md">
          {/* Top Green Banner */}
          <div className="bg-gradient-to-br from-[#388E5A] via-[#2E7D4E] to-[#1F633B] px-5 pt-6 pb-14 text-white flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
                <span>Hi, {firstName}</span>
                <span>👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50 font-semibold mt-0.5">
                Food Science &amp; Food Safety Exam Preparation
              </p>
            </div>
            <button
              type="button"
              onClick={() => setScreen('profile')}
              className="w-13 h-13 rounded-full bg-white text-[#1F633B] font-extrabold text-xl flex items-center justify-center ring-4 ring-white/30 shadow-md cursor-pointer shrink-0"
              title="Candidate Profile"
            >
              {avatarInitial}
            </button>
          </div>

          <div className="px-4 sm:px-5 -mt-9 space-y-5 pb-6">
            {/* Floating Total Progress Card */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 shadow-md border border-[#E2EFE7] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">
                    Exam Readiness
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-extrabold">
                    30 MCQs / Exam
                  </span>
                </div>
                <p className="text-xs font-bold text-[#374151] mt-0.5">
                  Average Score: {overallAccuracyPct}% •{' '}
                  {savedResults.length + (toolsData.examAttempts?.length || 0)}{' '}
                  Exams Completed
                </p>
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="w-28 sm:w-36 h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#16A34A]"
                      style={{ width: `${overallAccuracyPct}%` }}
                    />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E3F6EA] text-[#15803D] text-[11px] font-extrabold inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Study Time: {formattedStudyTime}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Resume Unfinished Exam Banner if any */}
            {hasSavedInProgressExam && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <div className="text-xs font-extrabold text-amber-950">
                      Unfinished 30-MCQ Exam Saved
                    </div>
                    <div className="text-[11px] text-amber-800">
                      Continue your in-progress exam from where you left off.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResumeInProgressExam}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold cursor-pointer shrink-0"
                >
                  Resume Exam →
                </button>
              </div>
            )}

            {/* DIRECT START EXAM CARD (NO CATEGORIES — SIMPLE & DIRECT) */}
            <div className="bg-white rounded-[24px] p-5 border border-[#E2EFE7] shadow-xs space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF8EF] text-[#169C46] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#111827]">
                    Start 30-MCQs Exam Preparation
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Every exam presents <strong>30 different MCQs</strong> covering
                    Food Science, Food Safety, HACCP, ISO 9001, ISO 22000 &amp; FSSC
                    22000. At the end of the exam, view your complete{' '}
                    <strong>Correct vs. Wrong Score Report</strong> and download your{' '}
                    <strong>PDF Report</strong>. Whenever you take the exam again, you
                    will get <strong>30 brand-new MCQs</strong>!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#F4F8F5] border border-[#D5E8DC]">
                  <div className="text-sm font-extrabold text-[#111827]">
                    30 MCQs
                  </div>
                  <div className="text-[10.5px] font-bold text-[#169C46]">
                    Per Exam Attempt
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F4F8F5] border border-[#D5E8DC]">
                  <div className="text-sm font-extrabold text-[#111827]">
                    30 Mins
                  </div>
                  <div className="text-[10.5px] font-bold text-[#4B5563]">
                    Exam Duration
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F4F8F5] border border-[#D5E8DC]">
                  <div className="text-sm font-extrabold text-[#111827]">
                    PDF Report
                  </div>
                  <div className="text-[10.5px] font-bold text-[#169C46]">
                    Score + Answer Key
                  </div>
                </div>
              </div>

              {/* MAIN START EXAM BUTTON */}
              <button
                type="button"
                onClick={handleStartNew30McqExam}
                className="w-full py-4 px-5 rounded-[18px] bg-[#169C46] hover:bg-[#13873C] text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="text-base sm:text-lg font-extrabold leading-tight flex items-center gap-2">
                  <Play className="w-5 h-5 fill-white" />
                  <span>
                    {savedResults.length > 0
                      ? 'Start Next Exam (30 New MCQs)'
                      : 'Start Exam Now (30 MCQs)'}
                  </span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-100 mt-0.5">
                  • 30 Different Questions Every Attempt • Instant Score &amp; PDF Report
                </span>
              </button>
            </div>

            {/* PREVIOUS EXAM RESULTS LIST */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-extrabold text-[#111827]">
                  Previous Exam Results
                </h3>
                {savedResults.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setScreen('history')}
                    className="text-xs sm:text-sm font-extrabold text-[#15803D] hover:underline cursor-pointer"
                  >
                    View all ({savedResults.length}) →
                  </button>
                )}
              </div>

              {savedResults.length === 0 ? (
                <div className="bg-white rounded-[20px] p-4 border border-[#E5EFE9] text-center space-y-1.5">
                  <div className="text-xs font-extrabold text-[#111827]">
                    No Exam Taken Yet in This Session
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    Click &ldquo;Start Exam Now (30 MCQs)&rdquo; above to begin your
                    first 30-question exam and generate your PDF score report.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {savedResults.slice(0, 5).map((res) => (
                    <div
                      key={res.examId}
                      onClick={() => {
                        setActiveResult(res);
                        setScreen('result');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-[20px] p-3.5 border border-[#E5EFE9] hover:border-[#16A34A] shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-xs ${
                            res.status === 'PASS' ? 'bg-[#169C46]' : 'bg-red-600'
                          }`}
                        >
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-[#111827] truncate">
                            {res.title}
                          </div>
                          <div className="text-xs font-semibold text-[#4B5563] truncate mt-0.5">
                            ✓ {res.correct} Correct • ✗ {res.wrong} Wrong •{' '}
                            {res.scorePercent}% ({res.dateFormatted})
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!canUsePremium) {
                            setPaywallModalFeature(
                              'Professional Exam PDF Report'
                            );
                            return;
                          }
                          download5PageExamReportPdf(user, res, savedResults);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] text-xs font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clean Bottom Navigation (Home, Results, Profile — No Categories) */}
          <div className="bg-white border-t border-[#E5EFE9] px-4 py-2.5 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="flex flex-col items-center justify-center py-1 text-[#169C46] font-extrabold text-xs cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span className="mt-0.5">Exam Home</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('history')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] hover:text-[#169C46] font-bold text-xs cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="mt-0.5">Results</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('profile')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] hover:text-[#169C46] font-bold text-xs cursor-pointer"
            >
              <UserCheck className="w-5 h-5" />
              <span className="mt-0.5">Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 2: EXAM ATTEMPT SCREEN (30 CLEAN MCQs WITHOUT ANY REFERENCE PREFIX)
         ===================================================================== */}
      {screen === 'attempt' && currentQuestion && (
        <div className="bg-[#F4F8F5] rounded-[32px] overflow-hidden border border-[#D5E8DC] shadow-md">
          {/* Top Bar: Back Button + "Exam Attempt" + Green Timer Pill */}
          <div className="bg-white px-4 sm:px-5 py-4 border-b border-[#E5EFE9] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setScreen('dashboard')}
                className="w-9 h-9 rounded-xl bg-[#F4F8F5] hover:bg-[#E5EFE9] flex items-center justify-center text-[#111827] cursor-pointer"
                title="Back to Exam Home"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">
                {activeExamTitle}
              </h2>
            </div>

            <span
              className={`px-3.5 py-1.5 rounded-full text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs ${
                remainingSeconds < 180
                  ? 'bg-red-600 animate-pulse'
                  : 'bg-[#169C46]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimerMMSS(remainingSeconds)} remaining</span>
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* Question Progress Card: "Question X of 30" + Flag + Palette + Progress Bar */}
            <div className="bg-white rounded-[22px] p-4 border border-[#E5EFE9] shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm sm:text-base font-extrabold text-[#111827]">
                  Question {currentIndex + 1} of {activeQuestions.length}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleBookmark(currentQuestion)}
                    className={`p-2 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer ${
                      bookmarkedQuestions.some(
                        (b) => b.id === currentQuestion.id
                      )
                        ? 'bg-amber-50 border-amber-400 text-amber-800'
                        : 'bg-[#F9FAFB] border-gray-200 text-gray-600'
                    }`}
                    title="Bookmark Question"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFlaggedIds((prev) => ({
                        ...prev,
                        [currentQuestion.id]: !prev[currentQuestion.id]
                      }))
                    }
                    className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer ${
                      flaggedIds[currentQuestion.id]
                        ? 'bg-amber-100 border-amber-400 text-amber-900'
                        : 'bg-[#F9FAFB] border-gray-200 text-[#374151]'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>
                      {flaggedIds[currentQuestion.id] ? 'Flagged' : 'Flag'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQuestionPalette((prev) => !prev)}
                    className="p-2 rounded-xl bg-[#EAF8EF] text-[#15803D] border border-[#BBF7D0] text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                    title="Question Palette (1-30)"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Green Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#169C46] transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      ((currentIndex + 1) / activeQuestions.length) * 100
                    )}%`
                  }}
                />
              </div>

              {/* Collapsible 1-30 Question Palette */}
              {showQuestionPalette && (
                <div className="pt-2 border-t border-gray-100 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-bold text-gray-600">
                    <span>Jump to any question (1–30):</span>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#169C46]" />
                        Answered
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        Flagged
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        Unanswered
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                    {activeQuestions.map((q, idx) => {
                      const isAns = Boolean(selectedAnswers[q.id]);
                      const isFlg = Boolean(flaggedIds[q.id]);
                      let colorCls = 'bg-gray-100 text-gray-700 border-gray-200';
                      if (isFlg) {
                        colorCls = 'bg-amber-500 text-white border-amber-600';
                      } else if (isAns) {
                        colorCls = 'bg-[#169C46] text-white border-[#15803D]';
                      }
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            setCurrentIndex(idx);
                            setVisitedIds((prev) => ({
                              ...prev,
                              [q.id]: true
                            }));
                          }}
                          className={`h-8 rounded-lg text-xs font-extrabold border cursor-pointer transition-all ${colorCls} ${
                            idx === currentIndex
                              ? 'ring-2 ring-[#111827] ring-offset-1'
                              : ''
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* MAIN QUESTION CARD (PURE CLEAN QUESTION TEXT — NO REFERENCE AT START) */}
            <div className="bg-white rounded-[24px] p-5 border border-[#E5EFE9] shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#169C46]">
                  QUESTION {currentIndex + 1}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-[#111827] leading-snug">
                {stripLeadingReference(currentQuestion.questionText)}
              </h3>

              <p className="text-xs text-[#6B7280] font-medium">
                Select the most appropriate answer from the options below.
              </p>

              {/* 4 Radio Options A, B, C, D */}
              <div className="space-y-2.5 pt-1">
                {(['A', 'B', 'C', 'D'] as OptionLetter[]).map((letter) => {
                  const optionText =
                    letter === 'A'
                      ? currentQuestion.optionA
                      : letter === 'B'
                        ? currentQuestion.optionB
                        : letter === 'C'
                          ? currentQuestion.optionC
                          : currentQuestion.optionD;
                  const userSelected =
                    selectedAnswers[currentQuestion.id] === letter;

                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.id]: letter
                        }))
                      }
                      className={`w-full text-left p-3.5 sm:p-4 rounded-[16px] border transition-all flex items-center gap-3 cursor-pointer ${
                        userSelected
                          ? 'bg-[#E9F9EE] border-2 border-[#169C46] shadow-xs'
                          : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#169C46]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          userSelected
                            ? 'border-[5px] border-[#169C46] bg-white'
                            : 'border-2 border-[#9CA3AF] bg-white'
                        }`}
                      />
                      <span
                        className={`text-xs sm:text-sm leading-snug ${
                          userSelected
                            ? 'font-extrabold text-[#14532D]'
                            : 'font-bold text-[#1F2937]'
                        }`}
                      >
                        {letter}. {optionText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Indicator Footer */}
              <div className="pt-1 flex items-center justify-between text-xs font-extrabold text-[#15803D]">
                <span className="inline-flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#169C46]" />
                  <span>
                    {selectedAnswers[currentQuestion.id]
                      ? `Selected: ${selectedAnswers[currentQuestion.id]}`
                      : 'No option selected yet'}
                  </span>
                </span>
                <span className="text-[11px] text-[#6B7280] font-semibold">
                  {attemptCounts.answered}/{attemptCounts.total} Answered
                </span>
              </div>
            </div>

            {/* PREVIOUS & NEXT / SUBMIT BUTTONS */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => {
                  const prevIdx = Math.max(0, currentIndex - 1);
                  setCurrentIndex(prevIdx);
                  if (activeQuestions[prevIdx]) {
                    setVisitedIds((prev) => ({
                      ...prev,
                      [activeQuestions[prevIdx].id]: true
                    }));
                  }
                }}
                className={`py-3.5 px-4 rounded-[16px] bg-white border border-[#D1D5DB] text-sm font-extrabold inline-flex items-center justify-center gap-2 ${
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                    : 'text-[#374151] hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < activeQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = currentIndex + 1;
                    setCurrentIndex(nextIdx);
                    if (activeQuestions[nextIdx]) {
                      setVisitedIds((prev) => ({
                        ...prev,
                        [activeQuestions[nextIdx].id]: true
                      }));
                    }
                  }}
                  className="py-3.5 px-4 rounded-[16px] bg-[#169C46] hover:bg-[#13873C] text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirmModal(true)}
                  className="py-3.5 px-4 rounded-[16px] bg-[#13422B] hover:bg-[#169C46] text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Exam</span>
                </button>
              )}
            </div>

            {/* Finish & Submit Exam Anytime Button */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setShowSubmitConfirmModal(true)}
                className="text-xs font-extrabold text-[#15803D] hover:underline cursor-pointer"
              >
                Finish &amp; Submit Exam Now ({attemptCounts.answered}/
                {attemptCounts.total} Answered) →
              </button>
            </div>
          </div>

          {/* Submit Confirmation Popup Modal */}
          {showSubmitConfirmModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-[26px] max-w-md w-full p-6 shadow-2xl border border-[#D5E8DC] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#EAF8EF] text-[#169C46] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#111827]">
                      Submit 30-MCQs Exam?
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      View your score report, Correct vs. Wrong MCQs &amp; PDF
                      report.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-2xl bg-[#EAF8EF] border border-[#BBF7D0]">
                    <div className="text-lg font-extrabold text-[#15803D]">
                      {attemptCounts.answered}
                    </div>
                    <div className="text-[10.5px] font-bold text-[#14532D]">
                      Answered
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="text-lg font-extrabold text-amber-700">
                      {attemptCounts.flagged}
                    </div>
                    <div className="text-[10.5px] font-bold text-amber-900">
                      Flagged
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-100 border border-gray-200">
                    <div className="text-lg font-extrabold text-gray-700">
                      {attemptCounts.notAnswered}
                    </div>
                    <div className="text-[10.5px] font-bold text-gray-600">
                      Not Answered
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitConfirmModal(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-300 text-xs font-extrabold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={finalizeAndSubmitExam}
                    className="flex-1 py-3 rounded-xl bg-[#169C46] hover:bg-[#13873C] text-white text-xs font-extrabold shadow-md cursor-pointer"
                  >
                    Submit Now ✓
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SCREEN 3: EXAM RESULT & PDF REPORT SCREEN (WITH "GIVE EXAM AGAIN / NEXT EXAM")
         ===================================================================== */}
      {screen === 'result' && activeResult && (
        <div className="bg-[#F4F8F5] rounded-[32px] overflow-hidden border border-[#D5E8DC] shadow-md">
          {/* Top Bar: Back + "Exam Result" + Share Icon */}
          <div className="bg-white px-4 sm:px-5 py-4 border-b border-[#E5EFE9] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="w-9 h-9 rounded-xl bg-[#F4F8F5] hover:bg-[#E5EFE9] flex items-center justify-center text-[#111827] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">
              Exam Result
            </h2>
            <button
              type="button"
              onClick={() => handleShareResult(activeResult)}
              className="w-9 h-9 rounded-xl bg-[#F4F8F5] hover:bg-[#E5EFE9] flex items-center justify-center text-[#111827] cursor-pointer"
              title="Share Score"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* BIG HERO RESULT CARD (GREEN IF >= 50% PASS, RED IF < 50% FAIL) */}
            <div
              className={`rounded-[26px] p-6 text-white text-center shadow-md space-y-2.5 ${
                activeResult.status === 'PASS'
                  ? 'bg-gradient-to-br from-[#169C46] via-[#128A3E] to-[#0D6E30]'
                  : 'bg-gradient-to-br from-red-600 via-red-700 to-red-800'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-white/15 border-4 border-white flex items-center justify-center mx-auto shadow-sm">
                {activeResult.status === 'PASS' ? (
                  <Check className="w-8 h-8 text-white stroke-[3.5]" />
                ) : (
                  <X className="w-8 h-8 text-white stroke-[3.5]" />
                )}
              </div>

              <div>
                <span
                  className={`inline-block px-5 py-1 rounded-full bg-white text-xs font-black uppercase tracking-wider shadow-xs ${
                    activeResult.status === 'PASS'
                      ? 'text-[#15803D]'
                      : 'text-red-700'
                  }`}
                >
                  {activeResult.status}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
                Score {activeResult.correct} out of{' '}
                {activeResult.totalQuestions}
              </h3>

              <p className="text-xs sm:text-sm font-semibold text-white/90">
                {activeResult.scorePercent}% • Completed on{' '}
                {activeResult.dateFormatted} • {activeResult.timeTakenFormatted}
              </p>
            </div>

            {/* QUICK TOP ACTION BUTTONS: DOWNLOAD PDF REPORT + GIVE EXAM AGAIN (30 NEW MCQs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (!canUsePremium) {
                    setPaywallModalFeature('Professional Exam PDF Report');
                    return;
                  }
                  download5PageExamReportPdf(user, activeResult, savedResults);
                  showToast('Exam Report PDF downloaded!');
                }}
                className="py-3.5 px-4 rounded-2xl bg-[#169C46] hover:bg-[#13873C] text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {canUsePremium ? (
                  <Download className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-200" />
                )}
                <span>Download Exam PDF Report</span>
              </button>

              <button
                type="button"
                onClick={handleStartNew30McqExam}
                className="py-3.5 px-4 rounded-2xl bg-[#13422B] hover:bg-[#0F291E] text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-emerald-300" />
                <span>Next Exam / Give Exam Again (30 New MCQs)</span>
              </button>
            </div>

            {/* PERFORMANCE OVERVIEW CARD WITH PIE CHART (CORRECT vs WRONG vs SKIPPED) */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E5EFE9] shadow-xs space-y-3">
              <h4 className="text-base font-extrabold text-[#111827]">
                Performance Overview (Correct vs. Wrong MCQs)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-4">
                  <svg
                    viewBox="0 0 42 42"
                    className="w-28 h-28 shrink-0 -rotate-90"
                  >
                    <circle cx="21" cy="21" r="15.915" fill="#F3F4F6" />
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#9CA3AF"
                      strokeWidth="10"
                    />
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#D97706"
                      strokeWidth="10"
                      strokeDasharray={`${Math.round(
                        ((activeResult.correct + activeResult.wrong) /
                          Math.max(1, activeResult.totalQuestions)) *
                          100
                      )} 100`}
                    />
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#169C46"
                      strokeWidth="10"
                      strokeDasharray={`${activeResult.scorePercent} 100`}
                    />
                  </svg>

                  <div className="space-y-1.5 text-xs font-extrabold">
                    <div className="text-[#169C46]">
                      {activeResult.correct}{' '}
                      <span className="text-[#111827] font-bold">
                        Correct (Sahi)
                      </span>
                    </div>
                    <div className="text-[#D97706]">
                      {activeResult.wrong}{' '}
                      <span className="text-[#D97706] font-bold">
                        Wrong (Ghalat)
                      </span>
                    </div>
                    <div className="text-[#6B7280]">
                      {activeResult.skipped}{' '}
                      <span className="text-[#374151] font-bold">Skipped</span>
                    </div>
                    <div className="text-[11px] text-[#15803D] font-bold">
                      Total Score: {activeResult.scorePercent}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-bold border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
                  <div className="flex items-center justify-between text-[#111827]">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#169C46]" />
                      <span>Correct MCQs</span>
                    </span>
                    <span className="font-extrabold text-[#169C46]">
                      {activeResult.correct} / {activeResult.totalQuestions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#111827]">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                      <span>Wrong MCQs</span>
                    </span>
                    <span className="font-extrabold text-[#D97706]">
                      {activeResult.wrong} / {activeResult.totalQuestions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#111827]">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]" />
                      <span>Skipped MCQs</span>
                    </span>
                    <span className="font-extrabold text-[#6B7280]">
                      {activeResult.skipped} / {activeResult.totalQuestions}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ALL 30 QUESTIONS REVIEW (CLEAN — NO REFERENCE PREFIX) */}
            <div className="space-y-3 pt-1">
              <div>
                <h4 className="text-base font-extrabold text-[#111827]">
                  All 30 Questions Review
                </h4>
                <p className="text-xs text-[#4B5563] font-medium">
                  Correct answers shown in{' '}
                  <span className="text-[#169C46] font-extrabold">green</span>,
                  your answer shown below
                </p>
              </div>

              <div className="space-y-2.5">
                {activeResult.answers.map((ans) => {
                  const getOptionText = (letter: OptionLetter | null) => {
                    if (!letter) return 'Not Answered (Skipped)';
                    if (letter === 'A') return ans.optionA;
                    if (letter === 'B') return ans.optionB;
                    if (letter === 'C') return ans.optionC;
                    return ans.optionD;
                  };
                  const isExpanded = Boolean(expandedReviewIds[ans.questionId]);

                  return (
                    <div
                      key={ans.questionId}
                      className="bg-white rounded-[20px] p-4 border border-[#E5EFE9] shadow-xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-white text-xs font-extrabold shrink-0 mt-0.5 ${
                              ans.isCorrect ? 'bg-[#65B77E]' : 'bg-[#E59849]'
                            }`}
                          >
                            Q{ans.questionNumber}
                          </span>
                          <h5 className="text-xs sm:text-sm font-extrabold text-[#111827] leading-snug">
                            {stripLeadingReference(ans.questionText)}
                          </h5>
                        </div>
                      </div>

                      <div className="pl-9 space-y-1 text-xs">
                        <div className="flex items-start gap-1.5 font-bold text-[#15803D]">
                          <CheckCircle2 className="w-4 h-4 text-[#169C46] shrink-0 mt-0.5" />
                          <span>
                            Correct Answer: {getOptionText(ans.correctAnswer)}
                          </span>
                        </div>
                        <div
                          className={`flex items-start gap-1.5 font-bold ${
                            ans.isCorrect ? 'text-[#15803D]' : 'text-[#D97706]'
                          }`}
                        >
                          {ans.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-[#169C46] shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                          )}
                          <span>
                            Your Answer: {getOptionText(ans.userAnswer)}
                          </span>
                        </div>

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedReviewIds((prev) => ({
                                ...prev,
                                [ans.questionId]: !prev[ans.questionId]
                              }))
                            }
                            className="text-[11px] font-extrabold text-[#15803D] hover:underline cursor-pointer"
                          >
                            {isExpanded
                              ? 'Hide Explanation ▲'
                              : 'View Explanation ▼'}
                          </button>
                          {isExpanded && (
                            <div className="mt-1.5 p-2.5 rounded-xl bg-[#F4F8F5] border border-[#D5E8DC] text-[11px] text-[#374151]">
                              <p>
                                <strong>Explanation:</strong> {ans.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM ACTION BUTTONS: DOWNLOAD PDF REPORT + NEXT EXAM (GIVE EXAM AGAIN) */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!canUsePremium) {
                    setPaywallModalFeature(
                      'Professional Exam Performance PDF Report'
                    );
                    return;
                  }
                  download5PageExamReportPdf(user, activeResult, savedResults);
                  showToast('Professional Exam PDF Report downloaded!');
                }}
                className="w-full py-4 px-5 rounded-[18px] bg-[#169C46] hover:bg-[#13873C] text-white font-extrabold text-sm sm:text-base shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                {canUsePremium ? (
                  <Download className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5 text-amber-200" />
                )}
                <span>Download Professional PDF Report</span>
              </button>

              <button
                type="button"
                onClick={handleStartNew30McqExam}
                className="w-full py-4 px-5 rounded-[18px] bg-[#13422B] hover:bg-[#0F291E] text-white font-extrabold text-sm sm:text-base shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 text-emerald-300" />
                <span>
                  Give Exam Again / Next Exam (30 New Different MCQs) →
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const allOpen: Record<string, boolean> = {};
                  activeResult.answers.forEach((a) => {
                    allOpen[a.questionId] = true;
                  });
                  setExpandedReviewIds(allOpen);
                  showToast('All 30 question explanations expanded!');
                }}
                className="w-full py-3.5 px-5 rounded-[18px] bg-white hover:bg-gray-50 border-2 border-[#169C46] text-[#14532D] font-extrabold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#169C46]" />
                <span>Expand All Explanations</span>
              </button>

              {activeResult.scorePercent >= 80 && (
                <button
                  type="button"
                  onClick={() => {
                    if (!canUsePremium) {
                      setPaywallModalFeature(
                        'Official High-Achievement Certificate PDF'
                      );
                      return;
                    }
                    downloadExamAchievementCertificatePdf(user, activeResult);
                    showToast('Official Certificate PDF downloaded!');
                  }}
                  className="w-full py-3.5 px-5 rounded-[18px] bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Award className="w-5 h-5" />
                  <span>
                    Download Official Achievement Certificate (Score{' '}
                    {activeResult.scorePercent}%)
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 4: ALL EXAM RESULTS HISTORY
         ===================================================================== */}
      {screen === 'history' && (
        <div className="bg-[#F4F8F5] rounded-[32px] overflow-hidden border border-[#D5E8DC] shadow-md">
          <div className="bg-white px-5 py-4 border-b border-[#E5EFE9] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="w-9 h-9 rounded-xl bg-[#F4F8F5] flex items-center justify-center text-[#111827] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">
              All Exam Results History
            </h2>
            <span className="text-xs font-extrabold text-[#169C46]">
              {savedResults.length} Saved
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-3">
            {savedResults.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center space-y-3 border border-[#E5EFE9]">
                <Trophy className="w-10 h-10 text-[#169C46] mx-auto" />
                <div className="text-sm font-extrabold text-[#111827]">
                  No Completed Exam Attempts Yet
                </div>
                <p className="text-xs text-[#6B7280]">
                  Start your 30-Question Exam to see your score history and
                  download your PDF report.
                </p>
                <button
                  type="button"
                  onClick={handleStartNew30McqExam}
                  className="px-5 py-2.5 rounded-xl bg-[#169C46] text-white text-xs font-extrabold cursor-pointer"
                >
                  Start 30-MCQs Exam Now →
                </button>
              </div>
            ) : (
              savedResults.map((res) => (
                <div
                  key={res.examId}
                  className="bg-white rounded-[20px] p-4 border border-[#E5EFE9] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl text-white flex items-center justify-center font-extrabold text-xs ${
                          res.status === 'PASS' ? 'bg-[#169C46]' : 'bg-red-600'
                        }`}
                      >
                        {res.scorePercent}%
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-[#111827]">
                          {res.title}
                        </div>
                        <div className="text-xs text-[#6B7280] font-semibold">
                          ✓ {res.correct} Correct • ✗ {res.wrong} Wrong •{' '}
                          {res.dateFormatted}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-extrabold ${
                        res.status === 'PASS'
                          ? 'bg-[#DCFCE7] text-[#15803D]'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveResult(res);
                        setScreen('result');
                      }}
                      className="flex-1 py-2 rounded-xl bg-[#EAF8EF] text-[#15803D] text-xs font-extrabold cursor-pointer"
                    >
                      View Result &amp; Answers
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!canUsePremium) {
                          setPaywallModalFeature('Professional Exam PDF Report');
                          return;
                        }
                        download5PageExamReportPdf(user, res, savedResults);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#169C46] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white border-t border-[#E5EFE9] px-4 py-2.5 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] font-bold text-xs cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span className="mt-0.5">Exam Home</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('history')}
              className="flex flex-col items-center justify-center py-1 text-[#169C46] font-extrabold text-xs cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="mt-0.5">Results</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('profile')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] font-bold text-xs cursor-pointer"
            >
              <UserCheck className="w-5 h-5" />
              <span className="mt-0.5">Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 5: CANDIDATE PROFILE & BOOKMARKS
         ===================================================================== */}
      {screen === 'profile' && (
        <div className="bg-[#F4F8F5] rounded-[32px] overflow-hidden border border-[#D5E8DC] shadow-md">
          <div className="bg-white px-5 py-4 border-b border-[#E5EFE9] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="w-9 h-9 rounded-xl bg-[#F4F8F5] flex items-center justify-center text-[#111827] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">
              Candidate Profile &amp; Leaderboard
            </h2>
            <UserCheck className="w-5 h-5 text-[#169C46]" />
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div className="bg-white rounded-[22px] p-4 border border-[#E5EFE9] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#169C46] text-white font-extrabold text-lg flex items-center justify-center">
                  {avatarInitial}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#111827]">
                    {user.name || 'Food Safety Specialist'}
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    {user.email || 'Verified Candidate'} • Study Time:{' '}
                    {formattedStudyTime}
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[10.5px] font-extrabold ${
                  canUsePremium
                    ? 'bg-[#DCFCE7] text-[#15803D]'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {canUsePremium ? '✓ Premium Member' : 'Free Tier'}
              </span>
            </div>

            {/* Weekly Top 10 Scorers */}
            <div className="bg-white rounded-[22px] p-4 border border-[#E5EFE9] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Weekly Top 10 Exam Scorers</span>
                </h3>
              </div>
              <div className="space-y-2">
                {LEADERBOARD_TOP_10_WEEKLY.map((scorer) => (
                  <div
                    key={scorer.rank}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F9FAFB] border border-gray-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[11px] ${
                          scorer.rank <= 3
                            ? 'bg-[#169C46] text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {scorer.rank}
                      </span>
                      <div>
                        <div className="font-extrabold text-[#111827]">
                          {scorer.name}
                        </div>
                        <div className="text-[10.5px] text-[#6B7280]">
                          {scorer.role}
                        </div>
                      </div>
                    </div>
                    <span className="font-extrabold text-[#15803D]">
                      {scorer.scorePct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookmarked Questions */}
            <div className="bg-white rounded-[22px] p-4 border border-[#E5EFE9] space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-[#169C46]" />
                  <span>Bookmarked Questions ({bookmarkedQuestions.length})</span>
                </h3>
              </div>
              {bookmarkedQuestions.length === 0 ? (
                <p className="text-xs text-[#6B7280]">
                  Tap the bookmark icon during any exam attempt to save
                  important questions here for quick revision.
                </p>
              ) : (
                <div className="space-y-2">
                  {bookmarkedQuestions.map((bq) => (
                    <div
                      key={bq.id}
                      className="p-3 rounded-xl bg-[#F4F8F5] border border-[#D5E8DC] space-y-1 text-xs"
                    >
                      <div className="font-extrabold text-[#111827]">
                        {stripLeadingReference(bq.questionText)}
                      </div>
                      <div className="text-[#15803D] font-bold">
                        Correct ({bq.correctAnswer}): {bq.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border-t border-[#E5EFE9] px-4 py-2.5 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] font-bold text-xs cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span className="mt-0.5">Exam Home</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('history')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] font-bold text-xs cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="mt-0.5">Results</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('profile')}
              className="flex flex-col items-center justify-center py-1 text-[#169C46] font-extrabold text-xs cursor-pointer"
            >
              <UserCheck className="w-5 h-5" />
              <span className="mt-0.5">Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
