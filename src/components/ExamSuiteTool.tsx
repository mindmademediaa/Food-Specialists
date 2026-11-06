import React, { useState, useEffect, useMemo } from 'react';
import {
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
  FlaskConical,
  Flame,
  Grid,
  Home,
  Info,
  Layers,
  Lock,
  Microscope,
  Play,
  Rocket,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  X,
  AlertTriangle
} from 'lucide-react';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { HubUser, UserExamAttempt, UserToolsData } from '../types/hub';
import {
  draw30ExamSuiteQuestions,
  EXAM_CATEGORIES_LIST,
  ExamCategoryMeta,
  ExamDifficulty,
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

type ExamScreenMode =
  | 'dashboard'
  | 'categories'
  | 'attempt'
  | 'result'
  | 'history'
  | 'profile';

const IN_PROGRESS_STORAGE_KEY = 'fs_portal_active_exam_attempt_v2';

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

  // Navigation & Screen State
  const [screen, setScreen] = useState<ExamScreenMode>('dashboard');
  const [showAllCategoriesOnHome, setShowAllCategoriesOnHome] =
    useState<boolean>(false);

  // Filters on Dashboard / Categories
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>('All');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<
    ExamDifficulty | 'All'
  >('All');
  const [questionPoolFilter, setQuestionPoolFilter] = useState<
    'All' | 'Unattempted' | 'WrongOnly'
  >('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Saved Results, Bookmarks, Wrong Question IDs, Study Seconds
  const [savedResults, setSavedResults] = useState<SuiteExamResult[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<
    SuiteExamQuestion[]
  >([]);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [totalStudySeconds, setTotalStudySeconds] = useState<number>(87120); // 24h 12m default baseline

  // Active Exam Attempt State
  const [activeQuestions, setActiveQuestions] = useState<SuiteExamQuestion[]>(
    []
  );
  const [activeExamTitle, setActiveExamTitle] =
    useState<string>('Mock Test #1');
  const [activeExamCategory, setActiveExamCategory] =
    useState<string>('Mixed Categories');
  const [activeExamMode, setActiveExamMode] = useState<
    'Mock' | 'Category' | 'Practice' | 'DailyQuiz' | 'WrongRetry'
  >('Mock');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, OptionLetter>
  >({});
  const [flaggedIds, setFlaggedIds] = useState<Record<string, boolean>>({});
  const [visitedIds, setVisitedIds] = useState<Record<string, boolean>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1800); // 30 mins = 1800s
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

  // Load saved results, progress & bookmarks from Firestore (or fallback to local/toolsData)
  useEffect(() => {
    let isMounted = true;
    async function loadUserExamData() {
      try {
        // Check localStorage for in-progress exam
        const rawInProgress = localStorage.getItem(IN_PROGRESS_STORAGE_KEY);
        if (rawInProgress) {
          setHasSavedInProgressExam(true);
        }

        if (user?.uid) {
          // Load progress doc
          const progRef = doc(db, 'users', user.uid, 'progress', 'main');
          const progSnap = await getDoc(progRef);
          if (progSnap.exists() && isMounted) {
            const data = progSnap.data();
            if (typeof data.totalStudySeconds === 'number') {
              setTotalStudySeconds(data.totalStudySeconds);
            }
            if (Array.isArray(data.wrongQuestionIds)) {
              setWrongQuestionIds(data.wrongQuestionIds);
            }
          }

          // Load bookmarks doc
          const bmRef = doc(db, 'users', user.uid, 'bookmarks', 'main');
          const bmSnap = await getDoc(bmRef);
          if (bmSnap.exists() && isMounted) {
            const bmData = bmSnap.data();
            if (Array.isArray(bmData.questions)) {
              setBookmarkedQuestions(bmData.questions);
            }
          }

          // Load examResults collection
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
        // Silent fallback if offline or guest
      }
    }
    loadUserExamData();
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  // Check how many exams the user has attempted today (for Free User 1 Exam/Day rule)
  const examsAttemptedTodayCount = useMemo(() => {
    const todayPrefix = new Date().toISOString().slice(0, 10);
    return savedResults.filter((r) => r.date.startsWith(todayPrefix)).length;
  }, [savedResults]);

  // Countdown Timer during active timed exam
  useEffect(() => {
    if (screen !== 'attempt') return;
    if (activeExamMode === 'Practice') return; // Practice mode has no countdown limit

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
  }, [screen, activeExamMode]);

  // Auto-submit when remainingSeconds hits 0 in timed mode
  useEffect(() => {
    if (
      screen === 'attempt' &&
      activeExamMode !== 'Practice' &&
      remainingSeconds === 0 &&
      activeQuestions.length > 0
    ) {
      finalizeAndSubmitExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, screen, activeExamMode]);

  // Auto-save active attempt to localStorage whenever answers/index change
  useEffect(() => {
    if (screen === 'attempt' && activeQuestions.length > 0) {
      const payload = {
        activeQuestions,
        activeExamTitle,
        activeExamCategory,
        activeExamMode,
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
        // Ignore storage quota errors
      }
    }
  }, [
    screen,
    activeQuestions,
    activeExamTitle,
    activeExamCategory,
    activeExamMode,
    currentIndex,
    selectedAnswers,
    flaggedIds,
    visitedIds,
    remainingSeconds,
    initialDurationSeconds
  ]);

  // Resume saved in-progress exam
  const handleResumeInProgressExam = () => {
    try {
      const raw = localStorage.getItem(IN_PROGRESS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed.activeQuestions) &&
        parsed.activeQuestions.length > 0
      ) {
        setActiveQuestions(parsed.activeQuestions);
        setActiveExamTitle(parsed.activeExamTitle || 'Resumed Exam');
        setActiveExamCategory(parsed.activeExamCategory || 'Mixed Categories');
        setActiveExamMode(parsed.activeExamMode || 'Mock');
        setCurrentIndex(parsed.currentIndex || 0);
        setSelectedAnswers(parsed.selectedAnswers || {});
        setFlaggedIds(parsed.flaggedIds || {});
        setVisitedIds(parsed.visitedIds || { [parsed.activeQuestions[0].id]: true });
        setRemainingSeconds(parsed.remainingSeconds || 1500);
        setInitialDurationSeconds(parsed.initialDurationSeconds || 1800);
        setScreen('attempt');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      localStorage.removeItem(IN_PROGRESS_STORAGE_KEY);
      setHasSavedInProgressExam(false);
    }
  };

  // Start a new exam (30 non-repeating MCQs with shuffled options A/B/C/D)
  const handleStartExam = async (options: {
    mode: 'Mock' | 'Category' | 'Practice' | 'DailyQuiz' | 'WrongRetry';
    category?: string;
    title?: string;
    questionCount?: number;
  }) => {
    const mode = options.mode;
    const category = options.category || selectedCategoryFilter || 'All';
    const count = options.questionCount || (mode === 'DailyQuiz' ? 10 : 30);

    // Free vs Paid gating per Part 7:
    // Free User: Can attempt 1 Exam per day (30 Questions). Practice Mode & Wrong Retry are Premium.
    if (!canUsePremium) {
      if (mode === 'Practice' || mode === 'WrongRetry') {
        setPaywallModalFeature(
          mode === 'Practice'
            ? 'Unlimited Untimed Practice Mode with Instant Explanations'
            : 'Wrong Questions Smart Retry Bank'
        );
        return;
      }
      if (examsAttemptedTodayCount >= 1) {
        setPaywallModalFeature(
          'Unlimited Daily Exams (Free Tier includes 1 Exam / Day)'
        );
        return;
      }
    }

    const onlyIds =
      mode === 'WrongRetry' || questionPoolFilter === 'WrongOnly'
        ? wrongQuestionIds.length > 0
          ? wrongQuestionIds
          : undefined
        : undefined;

    const drawn = draw30ExamSuiteQuestions({
      seenQuestionIds: toolsData.seenExamQuestionIds || [],
      category: category === 'All' ? undefined : category,
      difficulty: selectedDifficultyFilter,
      onlyQuestionIds: onlyIds,
      searchKeyword,
      count
    });

    const nextNumber = savedResults.length + (toolsData.examAttempts?.length || 0) + 1;
    const computedTitle =
      options.title ||
      (mode === 'Mock'
        ? `Mock Test #${nextNumber}`
        : mode === 'Practice'
          ? `Practice: ${category === 'All' ? 'Mixed Subjects' : category}`
          : mode === 'DailyQuiz'
            ? `Daily Quick Quiz #${nextNumber}`
            : mode === 'WrongRetry'
              ? `Wrong Questions Review #${nextNumber}`
              : `${category === 'All' ? 'Food Science' : category} Exam #${nextNumber}`);

    const durationSec = count * 60; // 30 mins for 30 questions, 10 mins for 10 questions

    setActiveQuestions(drawn.questions);
    setActiveExamTitle(computedTitle);
    setActiveExamCategory(category === 'All' ? 'Mixed Food Science' : category);
    setActiveExamMode(mode);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedIds({});
    setVisitedIds(
      drawn.questions[0] ? { [drawn.questions[0].id]: true } : {}
    );
    setRemainingSeconds(durationSec);
    setInitialDurationSeconds(durationSec);
    setShowQuestionPalette(false);
    setShowSubmitConfirmModal(false);
    setScreen('attempt');

    // Update seenExamQuestionIds in user's profile toolsData so next attempt draws 30 different MCQs
    const updatedToolsData: UserToolsData = {
      ...toolsData,
      seenExamQuestionIds: drawn.nextSeenIds,
      lastActiveTool: 'exam',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    await onSaveToolsData(updatedToolsData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Finalize and Submit Exam
  const finalizeAndSubmitExam = async () => {
    setShowSubmitConfirmModal(false);
    localStorage.removeItem(IN_PROGRESS_STORAGE_KEY);
    setHasSavedInProgressExam(false);

    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const newWrongIds = new Set<string>(wrongQuestionIds);

    const answerRecords: ExamAnswerRecord[] = activeQuestions.map((q) => {
      const userAns = selectedAnswers[q.id] || null;
      const isRight = userAns !== null && userAns === q.correctAnswer;
      if (userAns === null) {
        skipped += 1;
      } else if (isRight) {
        correct += 1;
        newWrongIds.delete(q.id);
      } else {
        wrong += 1;
        newWrongIds.add(q.id);
      }

      return {
        questionId: q.id,
        questionNumber: q.questionNumber,
        category: q.category,
        difficulty: q.difficulty,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect: isRight,
        isFlagged: Boolean(flaggedIds[q.id]),
        explanation: q.explanation,
        reference: q.reference
      };
    });

    const totalQ = activeQuestions.length || 30;
    const scorePercent = Math.round((correct / totalQ) * 100);
    const status: 'PASS' | 'FAIL' = scorePercent >= 50 ? 'PASS' : 'FAIL';

    const elapsedSec =
      activeExamMode === 'Practice'
        ? Math.max(120, Object.keys(selectedAnswers).length * 32)
        : Math.max(30, initialDurationSeconds - remainingSeconds);
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
      category: activeExamCategory,
      mode: activeExamMode,
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
    const updatedWrongList = Array.from(newWrongIds).slice(0, 200);
    setWrongQuestionIds(updatedWrongList);
    setScreen('result');

    // Sync with Profile Control Panel toolsData.examAttempts (without storing raw 2000-MCQ bank)
    let grade = 'F (Needs Revision)';
    if (scorePercent >= 90) grade = 'A+ (Distinction)';
    else if (scorePercent >= 80) grade = 'A (Excellent)';
    else if (scorePercent >= 65) grade = 'B (Good)';
    else if (scorePercent >= 50) grade = 'C (Pass)';

    const legacyAttempt: UserExamAttempt = {
      id: examId,
      setId: resultObj.category,
      setTitle: `${resultObj.title} (${resultObj.category})`,
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

    // Save to Firestore users/{uid}/examResults/{examId} and users/{uid}/progress/main
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
            wrongQuestionIds: updatedWrongList,
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

  // Format seconds as MM:SS
  const formatTimerMMSS = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remSec = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;
  };

  // Format total study time e.g. "24h 12m"
  const formattedStudyTime = useMemo(() => {
    const hrs = Math.floor(totalStudySeconds / 3600);
    const mins = Math.floor((totalStudySeconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  }, [totalStudySeconds]);

  // Overall progress percentage for Top Card (Matching Image 1)
  const overallProgressPct = useMemo(() => {
    if (savedResults.length === 0) return 68;
    const avg =
      savedResults.reduce((acc, r) => acc + r.scorePercent, 0) /
      savedResults.length;
    return Math.min(99, Math.max(15, Math.round(avg)));
  }, [savedResults]);

  // Compute Category Accuracy from user's attempts (or realistic baseline from Image 1)
  const getCategoryStats = (cat: ExamCategoryMeta) => {
    let correct = 0;
    let total = 0;
    savedResults.forEach((res) => {
      res.answers.forEach((ans) => {
        if (ans.category.toLowerCase() === cat.name.toLowerCase()) {
          total += 1;
          if (ans.isCorrect) correct += 1;
        }
      });
    });
    const accuracyPct =
      total > 0 ? Math.round((correct / total) * 100) : cat.defaultAccuracyPct;
    return {
      accuracyPct,
      attemptedCount: total
    };
  };

  // Render Category Icon matching Image 1 style
  const renderCategoryIcon = (iconKey: ExamCategoryMeta['iconKey']) => {
    switch (iconKey) {
      case 'shield':
        return <ShieldCheck className="w-6 h-6 text-[#16A34A]" />;
      case 'haccp':
        return (
          <div className="px-1.5 py-0.5 rounded-md bg-[#16A34A] text-white text-[9px] font-black tracking-tighter">
            HACCP
          </div>
        );
      case 'fssc':
        return <FileText className="w-6 h-6 text-[#16A34A]" />;
      case 'audit':
        return <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />;
      case 'micro':
        return <Microscope className="w-6 h-6 text-[#16A34A]" />;
      case 'chem':
        return <FlaskConical className="w-6 h-6 text-[#16A34A]" />;
      default:
        return <Award className="w-6 h-6 text-[#16A34A]" />;
    }
  };

  // Display list for Previous Results on Dashboard (Matching Image 1)
  const dashboardResultsList = useMemo(() => {
    if (savedResults.length > 0) {
      return savedResults.slice(0, 4).map((r) => ({
        id: r.examId,
        title: r.title,
        subtitle: `${r.correct}/${r.totalQuestions} • ${r.scorePercent}% • ${r.dateFormatted}`,
        durationPill: r.timeTakenFormatted.replace(' mins', 'min'),
        rawResult: r
      }));
    }
    return [
      {
        id: 'sample-1',
        title: 'Mock Test #12',
        subtitle: '26/30 • 87% • Today, 10:45 AM',
        durationPill: '22min',
        rawResult: null
      },
      {
        id: 'sample-2',
        title: 'Practice: HACCP',
        subtitle: '18/20 • 90% • Yesterday, 4:30 PM',
        durationPill: '15min',
        rawResult: null
      },
      {
        id: 'sample-3',
        title: 'Practice: Microbiology',
        subtitle: '22/30 • 73% • Dec 3, 2:10 PM',
        durationPill: '28min',
        rawResult: null
      }
    ];
  }, [savedResults]);

  // Active Question in Attempt Screen
  const currentQuestion: SuiteExamQuestion | undefined =
    activeQuestions[currentIndex];

  // Counts for Submit Confirmation Popup
  const attemptCounts = useMemo(() => {
    const total = activeQuestions.length;
    const answered = Object.keys(selectedAnswers).length;
    const flagged = Object.values(flaggedIds).filter(Boolean).length;
    const notAnswered = Math.max(0, total - answered);
    return { total, answered, flagged, notAnswered };
  }, [activeQuestions.length, selectedAnswers, flaggedIds]);

  // Share Result via WhatsApp or Clipboard
  const handleShareResult = (res: SuiteExamResult) => {
    const text = `🎓 Food Science Exam Preparation Result:\nCandidate: ${
      user.name || 'Food Specialist'
    }\nExam: ${res.title}\nScore: ${res.correct}/${res.totalQuestions} (${
      res.scorePercent
    }%) — ${res.status}\nCertificate ID: ${res.certificateId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Result summary copied! Ready to paste on WhatsApp.');
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

      {/* Premium Paywall Modal for Locked Features */}
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
              Free users can attempt <strong>1 Exam per day (30 Questions)</strong> and view
              their score &amp; answers. Upgrade to <strong>Paid Premium</strong> to unlock
              unlimited daily exams, the <strong>5-Page Visual PDF Report</strong>, Detailed
              Subject Analysis, Wrong Questions Retry Bank, and Official Certificates!
            </p>
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-3.5 text-left space-y-1.5 text-xs font-bold text-[#14532D]">
              <div>✓ Unlimited Daily 30-MCQ Timed &amp; Mock Exams</div>
              <div>✓ 5-Page Eye-Catching PDF Report with Charts &amp; Tables</div>
              <div>✓ Detailed Subject-Wise Performance &amp; Weak Area Plan</div>
              <div>✓ Practice Mode, Wrong Questions Bank &amp; Certificates</div>
            </div>
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
          PART 1: EXAM DASHBOARD SCREEN (MATCHING IMAGE 1)
         ===================================================================== */}
      {screen === 'dashboard' && (
        <div className="bg-[#F4F8F5] rounded-[32px] overflow-hidden border border-[#D5E8DC] shadow-md">
          {/* Top Green Curved Banner — "Hi, Alex 👋" + Avatar */}
          <div className="bg-gradient-to-br from-[#388E5A] via-[#2E7D4E] to-[#1F633B] px-5 pt-6 pb-14 text-white flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
                <span>Hi, {firstName}</span>
                <span>👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50 font-semibold mt-0.5">
                Food Science Exam Preparation
              </p>
            </div>
            <button
              type="button"
              onClick={() => setScreen('profile')}
              className="w-13 h-13 rounded-full bg-white text-[#1F633B] font-extrabold text-xl flex items-center justify-center ring-4 ring-white/30 shadow-md cursor-pointer shrink-0"
              title="Exam Profile & Leaderboard"
            >
              {avatarInitial}
            </button>
          </div>

          <div className="px-4 sm:px-5 -mt-9 space-y-5 pb-6">
            {/* Floating Total Progress Card (Matching Image 1) */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 shadow-md border border-[#E2EFE7] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">
                    Total Progress
                  </h2>
                  {!canUsePremium && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                      Free: {Math.max(0, 1 - examsAttemptedTodayCount)}/1 Exam Today
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-[#374151] mt-0.5">
                  {overallProgressPct}% completed • {savedResults.length} Exams Completed
                </p>
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="w-28 sm:w-36 h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#16A34A]"
                      style={{ width: `${overallProgressPct}%` }}
                    />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E3F6EA] text-[#15803D] text-[11px] font-extrabold inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Total Study Time: {formattedStudyTime}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Resume In-Progress Exam Banner if exists */}
            {hasSavedInProgressExam && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <div className="text-xs font-extrabold text-amber-950">
                      Unfinished Exam Attempt Saved
                    </div>
                    <div className="text-[11px] text-amber-800">
                      Resume right where you left off without losing progress.
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

            {/* Exam Categories Header + See all -> */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-extrabold text-[#111827]">
                  Exam Categories
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setShowAllCategoriesOnHome((prev) => !prev)
                  }
                  className="text-xs sm:text-sm font-extrabold text-[#15803D] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>
                    {showAllCategoriesOnHome
                      ? 'Show Top 6'
                      : `See all (${EXAM_CATEGORIES_LIST.length}) →`}
                  </span>
                </button>
              </div>

              {/* 2-Column Categories Grid (Matching Image 1) */}
              <div className="grid grid-cols-2 gap-3">
                {(showAllCategoriesOnHome
                  ? EXAM_CATEGORIES_LIST
                  : EXAM_CATEGORIES_LIST.filter((c) => c.isPrimaryGrid)
                ).map((cat) => {
                  const stats = getCategoryStats(cat);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        handleStartExam({
                          mode: 'Category',
                          category: cat.name,
                          title: `${cat.name} Exam`
                        })
                      }
                      className="bg-white hover:bg-[#F9FEFB] rounded-[20px] p-3.5 text-left border border-[#E5EFE9] hover:border-[#16A34A] shadow-xs transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF8EF] flex items-center justify-center group-hover:scale-105 transition-transform">
                          {renderCategoryIcon(cat.iconKey)}
                        </div>
                        <span className="text-[10px] font-extrabold text-[#16A34A] bg-[#EAF8EF] px-2 py-0.5 rounded-full">
                          30 Qs
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-[#111827] truncate">
                          {cat.name}
                        </div>
                        <div className="text-[11px] font-bold text-[#4B5563] mt-0.5">
                          Accuracy • {stats.accuracyPct}%
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#16A34A]"
                          style={{ width: `${stats.accuracyPct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart Filters Row (Category, Difficulty, Attempted/Wrong Filter) */}
            <div className="bg-white rounded-[20px] p-3.5 border border-[#E5EFE9] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#13422B] uppercase tracking-wider">
                  Customize Exam Filters (30 Fresh MCQs Every Attempt)
                </span>
                <span className="text-[10.5px] font-bold text-[#16A34A]">
                  Shuffled A/B/C/D
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F4F8F5] border border-[#D5E8DC] text-xs font-bold text-[#111827]"
                >
                  <option value="All">All 17 Categories (Mixed)</option>
                  {EXAM_CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDifficultyFilter}
                  onChange={(e) =>
                    setSelectedDifficultyFilter(
                      e.target.value as ExamDifficulty | 'All'
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-[#F4F8F5] border border-[#D5E8DC] text-xs font-bold text-[#111827]"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy Level</option>
                  <option value="Medium">Medium Level</option>
                  <option value="Hard">Hard / Lead Auditor</option>
                </select>

                <select
                  value={questionPoolFilter}
                  onChange={(e) =>
                    setQuestionPoolFilter(
                      e.target.value as 'All' | 'Unattempted' | 'WrongOnly'
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-[#F4F8F5] border border-[#D5E8DC] text-xs font-bold text-[#111827]"
                >
                  <option value="All">Fresh Unseen MCQs First</option>
                  <option value="Unattempted">Unattempted Only</option>
                  <option value="WrongOnly">
                    Wrong Questions Only ({wrongQuestionIds.length})
                  </option>
                </select>
              </div>
            </div>

            {/* TWO BIG ACTION BUTTONS (MATCHING IMAGE 1) */}
            <div className="space-y-2.5">
              {/* Primary Solid Green Button */}
              <button
                type="button"
                onClick={() =>
                  handleStartExam({
                    mode:
                      selectedCategoryFilter === 'All' ? 'Mock' : 'Category',
                    category: selectedCategoryFilter
                  })
                }
                className="w-full py-3.5 px-5 rounded-[18px] bg-[#169C46] hover:bg-[#13873C] text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="text-base sm:text-lg font-extrabold leading-tight">
                  Start New Exam
                </span>
                <span className="text-[11px] font-semibold text-emerald-100 mt-0.5">
                  • 30 Questions • 30 Minutes
                </span>
              </button>

              {/* Secondary Outlined Green Button */}
              <button
                type="button"
                onClick={() =>
                  handleStartExam({
                    mode: 'Mock',
                    category: 'All',
                    title: `Mock Test #${savedResults.length + 1}`
                  })
                }
                className="w-full py-3 px-5 rounded-[18px] bg-white hover:bg-[#EAF8EF] border-2 border-[#169C46] text-[#15803D] transition-all cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="text-sm sm:text-base font-extrabold inline-flex items-center gap-1.5">
                  <Rocket className="w-4 h-4 text-[#169C46]" />
                  <span>Mock Test</span>
                </span>
                <span className="text-[11px] font-bold text-[#169C46]">
                  Mixed 30 Questions • Timed Mode
                </span>
              </button>

              {/* Extra Pro Mode Pills (Practice Mode, Daily Quiz 10 Qs, Wrong Questions Retry) */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleStartExam({
                      mode: 'Practice',
                      category: selectedCategoryFilter
                    })
                  }
                  className="p-2.5 rounded-2xl bg-white border border-[#D5E8DC] hover:border-[#16A34A] text-center cursor-pointer"
                >
                  <div className="text-[11px] font-extrabold text-[#13422B] flex items-center justify-center gap-1">
                    <Play className="w-3 h-3 text-[#16A34A]" />
                    <span>Practice Mode</span>
                  </div>
                  <div className="text-[10px] text-[#5C7267] font-semibold mt-0.5">
                    No Timer • Instant Ans
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleStartExam({
                      mode: 'DailyQuiz',
                      category: 'All',
                      questionCount: 10
                    })
                  }
                  className="p-2.5 rounded-2xl bg-white border border-[#D5E8DC] hover:border-[#16A34A] text-center cursor-pointer"
                >
                  <div className="text-[11px] font-extrabold text-[#13422B] flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>Daily Quiz</span>
                  </div>
                  <div className="text-[10px] text-[#5C7267] font-semibold mt-0.5">
                    10 Quick Questions
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleStartExam({
                      mode: 'WrongRetry',
                      category: 'All'
                    })
                  }
                  className="p-2.5 rounded-2xl bg-white border border-[#D5E8DC] hover:border-[#16A34A] text-center cursor-pointer"
                >
                  <div className="text-[11px] font-extrabold text-[#13422B] flex items-center justify-center gap-1">
                    <RotateCcw className="w-3 h-3 text-red-600" />
                    <span>Wrong Bank</span>
                  </div>
                  <div className="text-[10px] text-[#5C7267] font-semibold mt-0.5">
                    Retry Mistakes ({wrongQuestionIds.length})
                  </div>
                </button>
              </div>
            </div>

            {/* PREVIOUS RESULTS SECTION (MATCHING IMAGE 1) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-extrabold text-[#111827]">
                  Previous Results
                </h3>
                <button
                  type="button"
                  onClick={() => setScreen('history')}
                  className="text-xs sm:text-sm font-extrabold text-[#15803D] hover:underline cursor-pointer"
                >
                  View all →
                </button>
              </div>

              <div className="space-y-2.5">
                {dashboardResultsList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.rawResult) {
                        setActiveResult(item.rawResult);
                        setScreen('result');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        handleStartExam({
                          mode: 'Mock',
                          category: 'All',
                          title: item.title
                        });
                      }
                    }}
                    className="bg-white rounded-[20px] p-3.5 border border-[#E5EFE9] hover:border-[#16A34A] shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-[#169C46] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-[#111827] truncate">
                          {item.title}
                        </div>
                        <div className="text-xs font-semibold text-[#4B5563] truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-extrabold inline-flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.durationPill}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Internal Bottom Nav Bar (Home, Categories, Results, Profile — Matching Image 1) */}
          <div className="bg-white border-t border-[#E5EFE9] px-4 py-2.5 grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="flex flex-col items-center justify-center py-1 text-[#169C46] font-extrabold text-xs cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span className="mt-0.5">Home</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('categories')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] hover:text-[#169C46] font-bold text-xs cursor-pointer"
            >
              <Layers className="w-5 h-5" />
              <span className="mt-0.5">Categories</span>
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
              <Rocket className="w-5 h-5" />
              <span className="mt-0.5">Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          ALL 17 CATEGORIES DIRECTORY SCREEN
         ===================================================================== */}
      {screen === 'categories' && (
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
              All 17 Exam Categories
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-extrabold">
              30 Qs / Test
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* Search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search category or topic (e.g. HACCP, Allergen, ISO 22000)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#D5E8DC] text-xs font-bold text-[#111827]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXAM_CATEGORIES_LIST.filter(
                (c) =>
                  !searchKeyword.trim() ||
                  c.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                  c.description
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
              ).map((cat) => {
                const stats = getCategoryStats(cat);
                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-[20px] p-4 border border-[#E5EFE9] shadow-xs space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF8EF] flex items-center justify-center">
                          {renderCategoryIcon(cat.iconKey)}
                        </div>
                        <span className="text-xs font-extrabold text-[#16A34A]">
                          {stats.accuracyPct}% Mastery
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-[#111827]">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-[#5C7267] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#16A34A]"
                          style={{ width: `${stats.accuracyPct}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleStartExam({
                              mode: 'Category',
                              category: cat.name,
                              title: `${cat.name} Timed Exam`
                            })
                          }
                          className="flex-1 py-2 rounded-xl bg-[#169C46] hover:bg-[#13873C] text-white text-xs font-extrabold cursor-pointer"
                        >
                          Timed Exam (30 Qs)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStartExam({
                              mode: 'Practice',
                              category: cat.name,
                              title: `Practice: ${cat.name}`
                            })
                          }
                          className="px-3 py-2 rounded-xl bg-[#EAF8EF] text-[#15803D] text-xs font-extrabold cursor-pointer"
                        >
                          Practice
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border-t border-[#E5EFE9] px-4 py-2.5 grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] font-bold text-xs cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span className="mt-0.5">Home</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('categories')}
              className="flex flex-col items-center justify-center py-1 text-[#169C46] font-extrabold text-xs cursor-pointer"
            >
              <Layers className="w-5 h-5" />
              <span className="mt-0.5">Categories</span>
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
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] font-bold text-xs cursor-pointer"
            >
              <Rocket className="w-5 h-5" />
              <span className="mt-0.5">Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART 3: EXAM ATTEMPT SCREEN (MATCHING IMAGE 2)
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
                title="Save & Return to Dashboard"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">
                Exam Attempt
              </h2>
            </div>

            {activeExamMode === 'Practice' ? (
              <span className="px-3.5 py-1.5 rounded-full bg-[#169C46] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs">
                <Play className="w-3.5 h-3.5" />
                <span>Practice Mode (Untimed)</span>
              </span>
            ) : (
              <span
                className={`px-3.5 py-1.5 rounded-full text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs ${
                  remainingSeconds < 180 ? 'bg-red-600 animate-pulse' : 'bg-[#169C46]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimerMMSS(remainingSeconds)} remaining</span>
              </span>
            )}
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* Question Progress Card: "Question 5 of 30" + Flag + Palette + Progress Bar */}
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

              {/* Collapsible Question Palette (1 to 30 Grid: Green = Answered, Orange = Flagged, Red = Skipped, Grey = Not Answered) */}
              {showQuestionPalette && (
                <div className="pt-2 border-t border-gray-100 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-bold text-gray-600">
                    <span>Jump to any question:</span>
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
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        Skipped
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        Unvisited
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                    {activeQuestions.map((q, idx) => {
                      const isAns = Boolean(selectedAnswers[q.id]);
                      const isFlg = Boolean(flaggedIds[q.id]);
                      const isVis = Boolean(visitedIds[q.id]);
                      let colorCls = 'bg-gray-100 text-gray-700 border-gray-200';
                      if (isFlg) {
                        colorCls = 'bg-amber-500 text-white border-amber-600';
                      } else if (isAns) {
                        colorCls = 'bg-[#169C46] text-white border-[#15803D]';
                      } else if (isVis && idx !== currentIndex) {
                        colorCls = 'bg-red-500 text-white border-red-600';
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

            {/* MAIN QUESTION CARD (MATCHING IMAGE 2) */}
            <div className="bg-white rounded-[24px] p-5 border border-[#E5EFE9] shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#169C46]">
                  QUESTION {currentIndex + 1}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF8EF] text-[#15803D] text-[10.5px] font-extrabold">
                  {currentQuestion.category} • {currentQuestion.difficulty}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-[#111827] leading-snug">
                {currentQuestion.questionText}
              </h3>

              <p className="text-xs text-[#6B7280] font-medium">
                Select the most appropriate answer from the options below.
              </p>

              {/* 4 Radio Options A, B, C, D (Matching Image 2) */}
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
                      {/* Radio Circle Indicator */}
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

              {/* Selected Indicator Footer (Matching Image 2: "ⓘ Selected: B") */}
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

              {/* Instant Explanation in Practice Mode */}
              {activeExamMode === 'Practice' &&
                selectedAnswers[currentQuestion.id] && (
                  <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] space-y-1 text-xs">
                    <div className="font-extrabold text-[#14532D]">
                      {selectedAnswers[currentQuestion.id] ===
                      currentQuestion.correctAnswer
                        ? '✓ Correct Answer!'
                        : `✗ Incorrect — Correct Option is ${currentQuestion.correctAnswer}`}
                    </div>
                    <p className="text-[#1F2937] leading-relaxed">
                      <strong>Explanation:</strong>{' '}
                      {currentQuestion.explanation}
                    </p>
                    <div className="text-[10.5px] font-bold text-[#15803D]">
                      Reference: {currentQuestion.reference}
                    </div>
                  </div>
                )}
            </div>

            {/* PREVIOUS & NEXT / SUBMIT BUTTONS (MATCHING IMAGE 2) */}
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

            {/* Finish & Submit Exam Anytime Link */}
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
                      Submit Exam Attempt?
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      Are you sure you want to submit your exam now?
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
          PART 4: EXAM RESULT SCREEN (MATCHING IMAGE 3)
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
            {/* BIG HERO RESULT CARD (GREEN IF >= 50% PASS, RED IF < 50% FAIL — MATCHING IMAGE 3) */}
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

            {/* PERFORMANCE OVERVIEW CARD WITH PIE CHART (MATCHING IMAGE 3) */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E5EFE9] shadow-xs space-y-3">
              <h4 className="text-base font-extrabold text-[#111827]">
                Performance Overview
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Multi-Slice SVG Pie Chart + Counts */}
                <div className="flex items-center gap-4">
                  <svg
                    viewBox="0 0 42 42"
                    className="w-28 h-28 shrink-0 -rotate-90"
                  >
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="#F3F4F6"
                    />
                    {/* Base Grey Circle for Skipped */}
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#9CA3AF"
                      strokeWidth="10"
                    />
                    {/* Orange Slice for Wrong */}
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
                    {/* Green Slice for Correct */}
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
                      <span className="text-[#111827] font-bold">Correct</span>
                    </div>
                    <div className="text-[#D97706]">
                      {activeResult.wrong}{' '}
                      <span className="text-[#D97706] font-bold">Wrong</span>
                    </div>
                    <div className="text-[#6B7280]">
                      {activeResult.skipped}{' '}
                      <span className="text-[#374151] font-bold">Skipped</span>
                    </div>
                    <div className="text-[11px] text-[#6B7280] font-bold">
                      {Math.round(
                        (activeResult.skipped /
                          Math.max(1, activeResult.totalQuestions)) *
                          100
                      )}
                      % Unanswered
                    </div>
                  </div>
                </div>

                {/* Right Legend Dots (Matching Image 3) */}
                <div className="space-y-2 text-xs font-bold border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
                  <div className="flex items-center gap-2 text-[#111827]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#169C46]" />
                    <span>Correct • {activeResult.correct}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#111827]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                    <span>Wrong • {activeResult.wrong}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#111827]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]" />
                    <span>Skipped • {activeResult.skipped}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBJECT-WISE PERFORMANCE CARD (MATCHING IMAGE 3 + FREE USER LOCK PER PART 7) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-[#111827]">
                  Subject-wise Performance
                </h4>
                {!canUsePremium && (
                  <span className="text-[10.5px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Premium Analysis
                  </span>
                )}
              </div>

              {canUsePremium ? (
                <div className="bg-white rounded-[22px] p-4 border border-[#E5EFE9] shadow-xs space-y-3">
                  {/* Overall Subject Row */}
                  {(() => {
                    const subjMap: Record<
                      string,
                      { total: number; correct: number }
                    > = {};
                    activeResult.answers.forEach((a) => {
                      if (!subjMap[a.category]) {
                        subjMap[a.category] = { total: 0, correct: 0 };
                      }
                      subjMap[a.category].total += 1;
                      if (a.isCorrect) subjMap[a.category].correct += 1;
                    });
                    const entries = Object.entries(subjMap);
                    return entries.map(([subjName, st]) => {
                      const pct = Math.round(
                        (st.correct / Math.max(1, st.total)) * 100
                      );
                      const isSubjPass = pct >= 50;
                      return (
                        <div key={subjName} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-extrabold text-[#111827]">
                            <span>{subjName}</span>
                            <span>
                              {st.correct}/{st.total} • {pct}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isSubjPass ? 'bg-[#169C46]' : 'bg-amber-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                isSubjPass
                                  ? 'bg-[#169C46] text-white'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {isSubjPass ? 'Pass' : 'Review'}
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div className="bg-white rounded-[22px] p-4 border border-amber-300 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#111827]">
                        Detailed Subject-wise Performance Locked
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        Upgrade to Premium to unlock subject accuracy &amp; weak
                        topic diagnostic.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPaywallModalFeature(
                        'Detailed Subject-wise Performance Analysis'
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-[#169C46] text-white text-xs font-extrabold shrink-0 cursor-pointer"
                  >
                    Unlock →
                  </button>
                </div>
              )}
            </div>

            {/* ALL QUESTIONS REVIEW (1 TO 30 — MATCHING IMAGE 3) */}
            <div className="space-y-3 pt-1">
              <div>
                <h4 className="text-base font-extrabold text-[#111827]">
                  All Questions Review
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
                            {ans.questionText}
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

                        {/* Explanation & Reference */}
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
                              : 'View Explanation & Clause Reference ▼'}
                          </button>
                          {isExpanded && (
                            <div className="mt-1.5 p-2.5 rounded-xl bg-[#F4F8F5] border border-[#D5E8DC] text-[11px] text-[#374151] space-y-1">
                              <p>
                                <strong>Why Correct:</strong> {ans.explanation}
                              </p>
                              <p className="text-[#15803D] font-bold">
                                Reference: {ans.reference}
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

            {/* BOTTOM ACTION BUTTONS (MATCHING IMAGE 3: DOWNLOAD PROFESSIONAL PDF REPORT + REVIEW ANSWERS) */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!canUsePremium) {
                    setPaywallModalFeature(
                      '5-Page Professional Exam Performance PDF Report'
                    );
                    return;
                  }
                  download5PageExamReportPdf(user, activeResult, savedResults);
                  showToast('5-Page Professional PDF Report downloaded!');
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
                onClick={() => {
                  const allOpen: Record<string, boolean> = {};
                  activeResult.answers.forEach((a) => {
                    allOpen[a.questionId] = true;
                  });
                  setExpandedReviewIds(allOpen);
                  showToast('All 30 question explanations expanded!');
                }}
                className="w-full py-3.5 px-5 rounded-[18px] bg-white hover:bg-gray-50 border-2 border-[#169C46] text-[#14532D] font-extrabold text-sm sm:text-base inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-5 h-5 text-[#169C46]" />
                <span>Review Answers</span>
              </button>

              {/* Official Achievement Certificate Button if Score >= 80% */}
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

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleStartExam({
                      mode: activeResult.mode,
                      category:
                        activeResult.category === 'Mixed Food Science'
                          ? 'All'
                          : activeResult.category
                    })
                  }
                  className="py-3 px-4 rounded-2xl bg-[#13422B] hover:bg-[#0F291E] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-300" />
                  <span>Retake (30 New Qs)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('dashboard')}
                  className="py-3 px-4 rounded-2xl bg-white border border-[#D5E8DC] text-[#111827] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Home className="w-4 h-4 text-[#169C46]" />
                  <span>Go to Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          EXAM HISTORY SCREEN (RESULTS TAB)
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
                  Start your first 30-Question Timed Exam or Mock Test to see
                  your score history and download your 5-Page PDF Report.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleStartExam({ mode: 'Mock', category: 'All' })
                  }
                  className="px-5 py-2.5 rounded-xl bg-[#169C46] text-white text-xs font-extrabold cursor-pointer"
                >
                  Start 30-Question Exam Now →
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
                          {res.correct}/{res.totalQuestions} Correct •{' '}
                          {res.dateFormatted} • {res.timeTakenFormatted}
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
                          setPaywallModalFeature(
                            '5-Page Professional PDF Report'
                          );
                          return;
                        }
                        download5PageExamReportPdf(user, res, savedResults);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#169C46] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>5-Page PDF</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white border-t border-[#E5EFE9] px-4 py-2.5 grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] font-bold text-xs cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span className="mt-0.5">Home</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('categories')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] font-bold text-xs cursor-pointer"
            >
              <Layers className="w-5 h-5" />
              <span className="mt-0.5">Categories</span>
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
              <Rocket className="w-5 h-5" />
              <span className="mt-0.5">Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          PROFILE, WEEKLY TOP 10 LEADERBOARD & BOOKMARKED QUESTIONS SCREEN
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
            {/* Candidate Summary Card */}
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

            {/* Weekly Top 10 Scorers Leaderboard */}
            <div className="bg-white rounded-[22px] p-4 border border-[#E5EFE9] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Weekly Top 10 Exam Scorers</span>
                </h3>
                <span className="text-[10.5px] font-bold text-[#169C46]">
                  Updated Weekly
                </span>
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
                          {scorer.role} • {scorer.badge}
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
                        {bq.questionText}
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

          <div className="bg-white border-t border-[#E5EFE9] px-4 py-2.5 grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] font-bold text-xs cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span className="mt-0.5">Home</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('categories')}
              className="flex flex-col items-center justify-center py-1 text-[#6B7280] font-bold text-xs cursor-pointer"
            >
              <Layers className="w-5 h-5" />
              <span className="mt-0.5">Categories</span>
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
              <Rocket className="w-5 h-5" />
              <span className="mt-0.5">Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
