import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
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
  Info,
  Lock,
  Play,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  X
} from 'lucide-react';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { HubUser, UserExamAttempt, UserToolsData } from '../types/hub';
import {
  draw30ExamSuiteQuestions,
  EXAM_PREP_TRACKS,
  ExamAnswerRecord,
  ExamTrackId,
  getExamTrackPoolCounts,
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
  onRequireSignIn?: () => void;
}

type ExamScreenMode = 'dashboard' | 'attempt' | 'result';

const IN_PROGRESS_STORAGE_KEY = 'fs_portal_active_exam_attempt_v4';
const GUEST_RESULTS_STORAGE_KEY = 'fs_portal_guest_exam_results_v1';
const GUEST_MAX_ATTEMPTS = 3;
const REGISTERED_FREE_MAX_ATTEMPTS = 5;

function stripLeadingReference(text: string): string {
  return (text || '').replace(/^\[[^\]]+\]\s*/, '').trim();
}

export const ExamSuiteTool: React.FC<ExamSuiteToolProps> = ({
  user,
  isUserPaid,
  hasExpiredPremium,
  toolsData,
  onSaveToolsData,
  onOpenPremiumModal,
  onRequireSignIn
}) => {
  const canUsePremium = Boolean((isUserPaid && !hasExpiredPremium) || user.isAdmin);
  const isGuestUser = !Boolean(user?.uid);
  const maxFreeAttempts = isGuestUser
    ? GUEST_MAX_ATTEMPTS
    : REGISTERED_FREE_MAX_ATTEMPTS;

  const firstName = useMemo(() => {
    const raw = (user.name || 'Specialist').trim();
    return raw.split(' ')[0] || 'Specialist';
  }, [user.name]);

  const avatarInitial = useMemo(
    () => (firstName[0] || 'S').toUpperCase(),
    [firstName]
  );

  // Screen Navigation State
  const [screen, setScreen] = useState<ExamScreenMode>('dashboard');

  // Selected Exam Track ('All', 'ISO 9001 Lead Auditor', 'FSSC 22000 Lead Auditor', 'HACCP', 'Food Safety', 'Food Science', 'Food Authority')
  const [selectedTrack, setSelectedTrack] = useState<ExamTrackId>('All');

  // Pool counts per track (3,500+ total MCQs)
  const trackPoolCounts = useMemo(() => getExamTrackPoolCounts(), []);
  const selectedTrackMeta = useMemo(
    () =>
      EXAM_PREP_TRACKS.find((t) => t.id === selectedTrack) ||
      EXAM_PREP_TRACKS[0],
    [selectedTrack]
  );

  // Convert legacy toolsData.examAttempts into SuiteExamResult fallback so saved attempts always show immediately
  const fallbackResultsFromToolsData = useMemo<SuiteExamResult[]>(() => {
    const list = toolsData.examAttempts || [];
    return list.map((att) => {
      const dateFormatted = att.completedAt
        ? new Date(att.completedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        : 'Saved Attempt';
      return {
        examId: att.id || att.setId || `exam-legacy-${att.completedAt}`,
        title: (att.setTitle || 'Exam Attempt').replace(/\s*\(30 MCQs\)\s*$/i, ''),
        date: att.completedAt || new Date().toISOString(),
        dateFormatted,
        category: 'Food Science & Safety',
        mode: 'Mock',
        totalQuestions: att.totalQuestions || 30,
        correct: att.correctCount || 0,
        wrong: Math.max(
          0,
          (att.totalQuestions || 30) -
            (att.correctCount || 0) -
            (att.unansweredCount || 0)
        ),
        skipped: att.unansweredCount || 0,
        scorePercent: att.percentage || 0,
        timeTakenSeconds: 900,
        timeTakenFormatted: '15 mins',
        status: att.passed ? 'PASS' : 'FAIL',
        certificateId: `FS-CERT-${(att.id || '001').slice(-6).toUpperCase()}`,
        answers: []
      };
    });
  }, [toolsData.examAttempts]);

  // Saved Results, Bookmarks & Study Time
  const [firestoreResults, setFirestoreResults] = useState<SuiteExamResult[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<
    SuiteExamQuestion[]
  >([]);
  const [totalStudySeconds, setTotalStudySeconds] = useState<number>(87120);

  // Merge Firestore examResults + toolsData.examAttempts (deduplicated by examId)
  const savedResults = useMemo<SuiteExamResult[]>(() => {
    const map = new Map<string, SuiteExamResult>();
    for (const r of firestoreResults) {
      map.set(r.examId, r);
    }
    for (const fb of fallbackResultsFromToolsData) {
      if (!map.has(fb.examId)) {
        map.set(fb.examId, fb);
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [firestoreResults, fallbackResultsFromToolsData]);

  // Total completed attempts count (Guest: max 3 attempts; Registered Free: max 5 attempts; Paid: Unlimited)
  const totalAttemptsCount = savedResults.length;
  const freeAttemptsRemaining = Math.max(
    0,
    maxFreeAttempts - totalAttemptsCount
  );

  // Active 30-MCQ Exam Attempt State
  const [activeQuestions, setActiveQuestions] = useState<SuiteExamQuestion[]>(
    []
  );
  const [activeExamTitle, setActiveExamTitle] = useState<string>('Exam #1');
  const [activeExamTrack, setActiveExamTrack] = useState<ExamTrackId>('All');
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
            setFirestoreResults(loaded);
          }
        } else {
          // Guest user: load saved guest exam attempts from localStorage
          const rawGuestResults = localStorage.getItem(GUEST_RESULTS_STORAGE_KEY);
          if (rawGuestResults && isMounted) {
            const parsedGuest = JSON.parse(rawGuestResults);
            if (Array.isArray(parsedGuest)) {
              setFirestoreResults(parsedGuest);
            }
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
        activeExamTrack,
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
    activeExamTrack,
    currentIndex,
    selectedAnswers,
    flaggedIds,
    visitedIds,
    remainingSeconds,
    initialDurationSeconds
  ]);

  // Resume unfinished exam
  const handleResumeInProgressExam = () => {
    if (!canUsePremium && totalAttemptsCount >= maxFreeAttempts) {
      setPaywallModalFeature(
        isGuestUser
          ? 'More Exam Attempts (Guest Users get 03 Attempts; Registered Free Users get 05 Attempts; Paid Users get Unlimited)'
          : 'Unlimited Exam Attempts (Registered Free Users get 05 Exam Attempts)'
      );
      return;
    }
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
        setActiveExamTrack(parsed.activeExamTrack || 'All');
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

  // Start a new 30-MCQ Exam for the selected Exam Track
  const handleStartNew30McqExam = async (trackOverride?: ExamTrackId) => {
    const trackToUse = trackOverride || selectedTrack || 'All';

    // Tier Check: Guest max 3 attempts; Registered Free max 5 attempts; Paid Unlimited
    if (!canUsePremium && totalAttemptsCount >= maxFreeAttempts) {
      setPaywallModalFeature(
        isGuestUser
          ? 'More Exam Attempts (Guest Users get 03 Attempts; Register for 05 Attempts or Upgrade to Paid for Unlimited)'
          : '6th Exam Attempt & Unlimited Practice (Registered Free Users get 05 Exam Attempts)'
      );
      return;
    }

    const drawn = draw30ExamSuiteQuestions({
      seenQuestionIds: toolsData.seenExamQuestionIds || [],
      examTrack: trackToUse,
      category: trackToUse,
      difficulty: 'All',
      count: 30
    });

    const cleanedQuestions: SuiteExamQuestion[] = drawn.questions.map((q) => ({
      ...q,
      questionText: stripLeadingReference(q.questionText)
    }));

    const nextExamNumber = totalAttemptsCount + 1;
    const trackLabel =
      trackToUse === 'All' ? 'Combined Master Exam' : trackToUse;
    const examTitle = `${trackLabel} — Attempt #${nextExamNumber}`;

    setActiveQuestions(cleanedQuestions);
    setActiveExamTitle(examTitle);
    setActiveExamTrack(trackToUse);
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

  // Finalize and Submit 30-MCQ Exam (Saves lightweight JSON attempt data in Firestore — zero PDF storage load)
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
      category:
        activeExamTrack === 'All'
          ? 'Food Science & Food Safety'
          : activeExamTrack,
      mode: activeExamTrack === 'All' ? 'Mock' : 'Category',
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

    const nextFirestoreResults = [resultObj, ...firestoreResults].slice(0, 50);
    setFirestoreResults(nextFirestoreResults);
    if (!user?.uid) {
      try {
        localStorage.setItem(
          GUEST_RESULTS_STORAGE_KEY,
          JSON.stringify(nextFirestoreResults)
        );
      } catch {
        // Ignore storage quota errors
      }
    }
    setActiveResult(resultObj);
    const updatedStudySec = totalStudySeconds + elapsedSec;
    setTotalStudySeconds(updatedStudySec);
    setScreen('result');

    let grade = 'F (Needs Revision)';
    if (scorePercent >= 90) grade = 'A+ (Distinction)';
    else if (scorePercent >= 80) grade = 'A (Excellent)';
    else if (scorePercent >= 65) grade = 'B (Good)';
    else if (scorePercent >= 50) grade = 'C (Pass)';

    // Lightweight attempt record stored in toolsData (no PDF blobs saved in DB)
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
        50
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
            examsCompleted: nextFirestoreResults.length,
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
      exists ? 'Removed from Bookmarked Questions' : 'Saved to Bookmarks'
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
    const text = `Food Science Portal Exam Result:\nCandidate: ${
      user.name || 'Food Specialist'
    }\nExam: ${res.title}\nCorrect: ${res.correct}/${res.totalQuestions} | Wrong: ${
      res.wrong
    } | Skipped: ${res.skipped} | Score: ${res.scorePercent}% (${res.status})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Exam score summary copied to clipboard!');
    } else {
      showToast('Result ready to share!');
    }
  };

  return (
    <div className="w-full pb-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A2138] text-white text-xs font-extrabold shadow-lg flex items-center gap-2 border border-[#1673B8]/40">
          <Sparkles className="w-4 h-4 text-[#60A5FA] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Premium Paywall Modal */}
      {paywallModalFeature && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl border-2 border-[#1673B8] space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Crown className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
              Premium Exam Access Required
            </div>
            <h3 className="text-lg font-extrabold text-[#1A2138]">
              Unlock {paywallModalFeature}
            </h3>
            <p className="text-xs text-[#5A6C84] leading-relaxed">
              <strong>Guest Users</strong> get <strong>03 Exam Attempts</strong> and{' '}
              <strong>Registered Free Users</strong> get <strong>05 Exam Attempts</strong>{' '}
              with summary results (Pass/Fail, Score %, Correct/Wrong/Skipped),
              while detailed answers and certificate downloads remain locked.
              Upgrade to <strong>Paid Premium</strong> for{' '}
              <strong>Unlimited Exam Attempts</strong>, full{' '}
              <strong>30-MCQ Detailed Report with Correct Answers &amp; Explanations</strong>,
              and <strong>Downloadable Exam Certificates &amp; Full PDF Reports</strong>!
            </p>
            {isGuestUser && onRequireSignIn && (
              <button
                type="button"
                onClick={() => {
                  setPaywallModalFeature(null);
                  onRequireSignIn();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F0F6FC] hover:bg-[#DCE9F6] border border-[#1673B8] text-[#1673B8] text-xs font-extrabold cursor-pointer"
              >
                Register / Sign In Free Account (Unlock 05 Attempts) →
              </button>
            )}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setPaywallModalFeature(null)}
                className="flex-1 py-3 rounded-xl border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] hover:bg-[#F0F6FC] cursor-pointer"
              >
                Maybe Later
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaywallModalFeature(null);
                  onOpenPremiumModal();
                }}
                className="flex-1 py-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold shadow-md cursor-pointer"
              >
                Upgrade to Paid Premium →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 1: RESPONSIVE WEBSITE + MOBILE APP EXAM DASHBOARD
         ===================================================================== */}
      {screen === 'dashboard' && (
        <div className="bg-[#F0F6FC] rounded-[28px] sm:rounded-[32px] overflow-hidden border border-[#D2DEEA] shadow-sm">
          {/* Top Wide Royal Blue & Navy Header Banner */}
          <div className="bg-gradient-to-br from-[#1A2138] via-[#105E9A] to-[#1673B8] px-5 sm:px-8 pt-6 pb-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#93C5FD] tracking-wide">
                  Food Science Portal • Certification &amp; Authority Exam Center
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                  Welcome, {firstName} — Specialist Exam Preparation Suite
                </h1>
                <p className="text-xs sm:text-sm text-[#DCE9F6] max-w-3xl leading-relaxed">
                  Prepare for <strong>ISO 9001 Lead Auditor</strong>,{' '}
                  <strong>FSSC 22000 Lead Auditor</strong>, <strong>HACCP</strong>,{' '}
                  <strong>Food Safety</strong>, <strong>Food Science</strong>, and{' '}
                  <strong>Food Authority (PFA / PSQCA / SFDA / Codex)</strong> exams
                  from a verified bank of{' '}
                  <strong>{trackPoolCounts.All.toLocaleString()}+ MCQs</strong>.
                </p>
              </div>

              {/* Candidate Quick KPI Strip on Desktop / Mobile */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-3.5 py-2.5 text-center">
                  <div className="text-base sm:text-lg font-extrabold tabular-nums">
                    {trackPoolCounts.All.toLocaleString()}+
                  </div>
                  <div className="text-[10.5px] text-[#DCE9F6] font-semibold">
                    Verified MCQs
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-3.5 py-2.5 text-center">
                  <div className="text-base sm:text-lg font-extrabold tabular-nums">
                    {totalAttemptsCount}
                  </div>
                  <div className="text-[10.5px] text-[#DCE9F6] font-semibold">
                    Exams Taken
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-3.5 py-2.5 text-center">
                  <div className="text-base sm:text-lg font-extrabold tabular-nums">
                    {canUsePremium
                      ? 'Unlimited'
                      : `${freeAttemptsRemaining} / ${maxFreeAttempts}`}
                  </div>
                  <div className="text-[10.5px] text-[#DCE9F6] font-semibold">
                    {canUsePremium
                      ? 'Paid Access'
                      : isGuestUser
                        ? 'Guest Attempts Left'
                        : 'Free Attempts Left'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Responsive Grid: Wide 2-Column on Website (lg:grid-cols-12), Single Column on Mobile App */}
          <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT / MAIN WORKSPACE COLUMN (8 Cols on Desktop) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Resume Unfinished Exam Banner if any */}
              {hasSavedInProgressExam && (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-amber-950">
                        Unfinished 30-MCQ Exam Saved in Progress
                      </div>
                      <div className="text-xs text-amber-800">
                        Continue your active exam session from the exact question
                        where you left off.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResumeInProgressExam}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    Resume Exam →
                  </button>
                </div>
              )}

              {/* STEP 1: SELECT SPECIFIC EXAM PREPARATION TRACK */}
              <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#D2DEEA] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4EDF7] pb-4">
                  <div>
                    <div className="text-xs font-extrabold text-[#1673B8]">
                      01. Select Target Certification or Authority Exam
                    </div>
                    <h2 className="text-base sm:text-xl font-extrabold text-[#1A2138] mt-0.5">
                      Choose Your Specific Exam Preparation Track
                    </h2>
                    <p className="text-xs text-[#5A6C84] mt-0.5">
                      Select a dedicated standard or authority exam below so all 30
                      MCQs in your test match your target certification.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-[#1673B8] tabular-nums shrink-0">
                    30 New MCQs / Attempt • 30 Mins
                  </div>
                </div>

                {/* Responsive Grid of Specific Exam Tracks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {EXAM_PREP_TRACKS.map((track) => {
                    const isSelected = selectedTrack === track.id;
                    const count = trackPoolCounts[track.id] || 300;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => setSelectedTrack(track.id)}
                        className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-[#EBF4FC] border-2 border-[#1673B8] shadow-xs'
                            : 'bg-[#F8FAFC] border-[#D2DEEA] hover:border-[#1673B8] hover:bg-white'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-extrabold ${
                                isSelected ? 'text-[#1673B8]' : 'text-[#5A6C84]'
                              }`}
                            >
                              {track.shortBadge}
                            </span>
                            <span className="text-[11px] font-extrabold text-[#1A2138] tabular-nums">
                              {count.toLocaleString()} MCQs
                            </span>
                          </div>
                          <div className="text-sm sm:text-base font-extrabold text-[#1A2138] leading-snug">
                            {track.title}
                          </div>
                          <p className="text-[11px] text-[#5A6C84] leading-relaxed line-clamp-2">
                            {track.subtitle}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#D2DEEA]/70 flex items-center justify-between text-[11px] font-extrabold">
                          <span
                            className={
                              isSelected ? 'text-[#1673B8]' : 'text-[#5A6C84]'
                            }
                          >
                            {isSelected ? '✓ Selected Track' : 'Select Track'}
                          </span>
                          <span className="text-[#1673B8]">30 MCQs →</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Exam Track Details & Start Action Box */}
                <div className="rounded-2xl bg-[#F0F6FC] border border-[#BBD6EE] p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-extrabold text-[#1673B8]">
                        Active Exam Track •{' '}
                        {(
                          trackPoolCounts[selectedTrackMeta.id] || 500
                        ).toLocaleString()}{' '}
                        Dedicated MCQs Available
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                        {selectedTrackMeta.title} — 30-MCQ Mock Assessment
                      </h3>
                      <p className="text-xs text-[#5A6C84] leading-relaxed">
                        {selectedTrackMeta.description}
                      </p>
                    </div>
                  </div>

                  {/* Standards Covered Unboxed Metadata Line */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#1A2138]">
                    <span className="font-extrabold text-[#1673B8]">
                      Syllabus Coverage:
                    </span>
                    {selectedTrackMeta.standardsCovered.map((std, i) => (
                      <React.Fragment key={std}>
                        <span className="font-semibold">{std}</span>
                        {i < selectedTrackMeta.standardsCovered.length - 1 && (
                          <span aria-hidden="true" className="text-[#94A3B8]">
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Guest / Registered Free User Attempt Limit Notice Banner */}
                  {!canUsePremium && (
                    <div
                      className={`rounded-xl p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                        freeAttemptsRemaining > 0
                          ? 'bg-white border-[#D2DEEA] text-[#1A2138]'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold">
                          {isGuestUser
                            ? 'Guest Tier Exam Limit (03 Attempts): '
                            : 'Registered Free Tier Exam Limit (05 Attempts): '}
                        </span>
                        {freeAttemptsRemaining > 0 ? (
                          <span>
                            You have used{' '}
                            <strong>
                              {totalAttemptsCount} of {maxFreeAttempts}
                            </strong>{' '}
                            {isGuestUser ? 'guest' : 'free'} exam attempts (
                            {freeAttemptsRemaining} remaining).{' '}
                            {isGuestUser
                              ? 'Register a Free Account for 05 Attempts, or upgrade to Paid Premium for Unlimited Attempts, Full Detailed Answer Key & Certificate Download.'
                              : 'Guest & Free users receive summary score reports; Paid Members get Unlimited Attempts + Full 30-MCQ Detailed Report with Correct Answers & Certificate Download.'}
                          </span>
                        ) : (
                          <span>
                            You have completed all{' '}
                            <strong>
                              0{maxFreeAttempts}{' '}
                              {isGuestUser ? 'Guest' : 'Free'} Exam Attempts
                            </strong>
                            .{' '}
                            {isGuestUser
                              ? 'Register a Free Account to unlock 05 Attempts, or upgrade to Paid Premium for Unlimited Attempts & Full Detailed Reports!'
                              : 'Upgrade to Paid Premium to unlock Unlimited Exam Attempts, Full 30-MCQ Answer Keys & Certificate Downloads!'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isGuestUser && onRequireSignIn && (
                          <button
                            type="button"
                            onClick={onRequireSignIn}
                            className="px-3 py-1.5 rounded-lg bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#1673B8] border border-[#1673B8]/40 font-extrabold text-xs cursor-pointer whitespace-nowrap"
                          >
                            Register (05 Attempts)
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={onOpenPremiumModal}
                          className="px-3 py-1.5 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold text-xs shrink-0 cursor-pointer whitespace-nowrap"
                        >
                          Upgrade to Paid →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Main Start Exam Button */}
                  <button
                    type="button"
                    onClick={() => handleStartNew30McqExam(selectedTrackMeta.id)}
                    className="w-full py-4 px-5 rounded-[18px] bg-[#1673B8] hover:bg-[#105E9A] text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center"
                  >
                    <span className="text-base sm:text-lg font-extrabold leading-tight flex items-center gap-2">
                      {!canUsePremium &&
                      totalAttemptsCount >= maxFreeAttempts ? (
                        <Lock className="w-5 h-5 text-amber-200" />
                      ) : (
                        <Play className="w-5 h-5 fill-white" />
                      )}
                      <span>
                        {!canUsePremium &&
                        totalAttemptsCount >= maxFreeAttempts
                          ? `Unlock Next Attempt — Upgrade for Unlimited ${selectedTrackMeta.title} Exams`
                          : `Start ${selectedTrackMeta.title} Now (30 MCQs)`}
                      </span>
                    </span>
                    <span className="text-[11px] font-semibold text-[#DCE9F6] mt-0.5">
                      30 Non-Repeating Questions Every Attempt · 30 Minutes Duration ·
                      Auto-Saved Attempt History
                    </span>
                  </button>
                </div>
              </div>

              {/* STEP 2: SAVED EXAM ATTEMPTS HISTORY (TEXT/JSON SAVED IN DB — NO HEAVY PDF STORAGE) */}
              <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#D2DEEA] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4EDF7] pb-3.5">
                  <div>
                    <div className="text-xs font-extrabold text-[#1673B8]">
                      02. Saved Assessment Records
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                      Your Saved Exam Attempts ({savedResults.length})
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#5A6C84]">
                    {canUsePremium
                      ? 'Click any attempt to view full 30-MCQ answers & download PDF'
                      : 'Click any attempt to view Pass/Fail & score summary'}
                  </span>
                </div>

                {savedResults.length === 0 ? (
                  <div className="rounded-2xl bg-[#F8FAFC] p-6 border border-[#D2DEEA] text-center space-y-1.5">
                    <div className="text-sm font-extrabold text-[#1A2138]">
                      No Exam Attempts Recorded Yet
                    </div>
                    <p className="text-xs text-[#5A6C84] max-w-md mx-auto">
                      Select your target exam track above (e.g., ISO 9001 Lead
                      Auditor, FSSC 22000, HACCP, Food Safety, Food Science, or
                      Food Authority) and click Start Exam.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedResults.map((res, idx) => (
                      <div
                        key={res.examId || idx}
                        onClick={() => {
                          setActiveResult(res);
                          setScreen('result');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-[#F8FAFC] hover:bg-white rounded-2xl p-4 border border-[#D2DEEA] hover:border-[#1673B8] shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-11 h-11 rounded-2xl text-white flex items-center justify-center shrink-0 font-extrabold text-xs ${
                              res.status === 'PASS'
                                ? 'bg-[#1673B8]'
                                : 'bg-red-600'
                            }`}
                          >
                            {res.scorePercent}%
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="text-xs sm:text-sm font-extrabold text-[#1A2138] truncate">
                              {res.title}
                            </div>
                            <div className="text-[11px] font-semibold text-[#5A6C84] truncate">
                              {res.status} · ✓ {res.correct} Correct · ✗{' '}
                              {res.wrong} Wrong · {res.skipped} Skipped
                            </div>
                            <div className="text-[10.5px] text-[#5A6C84]">
                              {res.category} · {res.dateFormatted}
                            </div>
                          </div>
                        </div>

                        {canUsePremium ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              download5PageExamReportPdf(
                                user,
                                res,
                                savedResults
                              );
                              showToast('Exam PDF Report generated!');
                            }}
                            className="px-3 py-2 rounded-xl bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#1673B8] text-xs font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                            title="Download Full Exam PDF Report"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-extrabold text-[#1673B8] shrink-0">
                            Summary →
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR COLUMN ON DESKTOP WEBSITE (4 Cols on Desktop) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Candidate Readiness & Tier Access Card */}
              <div className="bg-white rounded-[24px] p-5 border border-[#D2DEEA] shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-[#1673B8] text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                      {avatarInitial}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138] truncate">
                        {user.name || 'Food Safety Specialist'}
                      </h3>
                      <p className="text-xs text-[#5A6C84] truncate">
                        {canUsePremium
                          ? 'Paid Premium Member (Full Access)'
                          : isGuestUser
                            ? `Guest User (${totalAttemptsCount}/${GUEST_MAX_ATTEMPTS} Attempts Used)`
                            : `Registered Free Member (${totalAttemptsCount}/${REGISTERED_FREE_MAX_ATTEMPTS} Attempts Used)`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#1A2138]">
                    <span>Average Exam Accuracy</span>
                    <span className="text-[#1673B8] tabular-nums">
                      {overallAccuracyPct}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1673B8]"
                      style={{ width: `${overallAccuracyPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#5A6C84] pt-1">
                    <span>Study Time: {formattedStudyTime}</span>
                    <span>Passing Threshold: 50%</span>
                  </div>
                </div>

                {/* Access Comparison Summary */}
                <div className="space-y-2 text-xs">
                  <div className="font-extrabold text-[#1A2138]">
                    Exam Preparation Tier Permissions:
                  </div>
                  <div className="flex items-center justify-between text-[#5A6C84]">
                    <span>Guest User Attempts</span>
                    <span className="font-extrabold text-[#1A2138]">
                      03 Attempts (Summary Only)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#5A6C84]">
                    <span>Registered Free User</span>
                    <span className="font-extrabold text-[#1A2138]">
                      05 Attempts (Summary Only)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#5A6C84]">
                    <span>Paid Member Attempts</span>
                    <span className="font-extrabold text-[#1673B8]">
                      ✓ Unlimited Attempts
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#5A6C84]">
                    <span>Detailed Answers &amp; Explanations</span>
                    <span
                      className={`font-extrabold ${
                        canUsePremium ? 'text-[#1673B8]' : 'text-amber-700'
                      }`}
                    >
                      {canUsePremium ? '✓ Unlocked' : '🔒 Paid Members Only'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#5A6C84]">
                    <span>Certificate &amp; Full PDF Download</span>
                    <span
                      className={`font-extrabold ${
                        canUsePremium ? 'text-[#1673B8]' : 'text-amber-700'
                      }`}
                    >
                      {canUsePremium ? '✓ Unlocked' : '🔒 Paid Members Only'}
                    </span>
                  </div>
                </div>

                {!canUsePremium && (
                  <button
                    type="button"
                    onClick={onOpenPremiumModal}
                    className="w-full py-3 px-4 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer transition-colors"
                  >
                    Upgrade to Paid Premium for Full Access →
                  </button>
                )}
              </div>

              {/* Bookmarked Questions Quick Revision Card */}
              <div className="bg-white rounded-[24px] p-5 border border-[#D2DEEA] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#1A2138] flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-[#1673B8]" />
                    <span>
                      Bookmarked Questions ({bookmarkedQuestions.length})
                    </span>
                  </h3>
                </div>
                {bookmarkedQuestions.length === 0 ? (
                  <p className="text-xs text-[#5A6C84] leading-relaxed">
                    Tap the bookmark icon during any exam attempt to save
                    important MCQs here for quick revision.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {bookmarkedQuestions.map((bq) => (
                      <div
                        key={bq.id}
                        className="p-3 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-1 text-xs"
                      >
                        <div className="font-extrabold text-[#1A2138]">
                          {stripLeadingReference(bq.questionText)}
                        </div>
                        {canUsePremium ? (
                          <div className="text-[#1673B8] font-bold">
                            Correct ({bq.correctAnswer}): {bq.explanation}
                          </div>
                        ) : (
                          <div className="text-amber-800 font-semibold text-[11px]">
                            Detailed answer key unlocked with Paid Membership
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Weekly Top 10 Exam Scorers Leaderboard */}
              <div className="bg-white rounded-[24px] p-5 border border-[#D2DEEA] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#1A2138] flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Weekly Top 10 Exam Scorers</span>
                  </h3>
                </div>
                <div className="space-y-2">
                  {LEADERBOARD_TOP_10_WEEKLY.map((scorer) => (
                    <div
                      key={scorer.rank}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F8FD] border border-[#D2DEEA] text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[11px] shrink-0 ${
                            scorer.rank <= 3
                              ? 'bg-[#1673B8] text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {scorer.rank}
                        </span>
                        <div className="min-w-0">
                          <div className="font-extrabold text-[#1A2138] truncate">
                            {scorer.name}
                          </div>
                          <div className="text-[10.5px] text-[#5A6C84] truncate">
                            {scorer.role}
                          </div>
                        </div>
                      </div>
                      <span className="font-extrabold text-[#1673B8] tabular-nums shrink-0">
                        {scorer.scorePct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 2: EXAM ATTEMPT SCREEN (WIDE DESKTOP + MOBILE RESPONSIVE)
         ===================================================================== */}
      {screen === 'attempt' && currentQuestion && (
        <div className="bg-[#F0F6FC] rounded-[28px] sm:rounded-[32px] overflow-hidden border border-[#D2DEEA] shadow-md">
          {/* Top Bar: Back Button + Exam Title + Track Name + Timer */}
          <div className="bg-white px-4 sm:px-6 py-4 border-b border-[#D2DEEA] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setScreen('dashboard')}
                className="w-9 h-9 rounded-xl bg-[#F0F6FC] hover:bg-[#DCE9F6] flex items-center justify-center text-[#1A2138] cursor-pointer shrink-0"
                title="Back to Exam Center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <div className="text-[11px] font-extrabold text-[#1673B8]">
                  Track: {activeExamTrack}
                </div>
                <h2 className="text-sm sm:text-lg font-extrabold text-[#1A2138] truncate">
                  {activeExamTitle}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={`px-3.5 py-1.5 rounded-xl text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs tabular-nums ${
                  remainingSeconds < 180 ? 'bg-red-600' : 'bg-[#1673B8]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimerMMSS(remainingSeconds)} left</span>
              </span>

              <button
                type="button"
                onClick={() => setShowSubmitConfirmModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1A2138] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>

          {/* Responsive 2-Column Attempt Workspace on Desktop, Single Column on Mobile */}
          <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: ACTIVE QUESTION & OPTIONS (8 Cols on Desktop) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Question Progress Header Card */}
              <div className="bg-white rounded-[22px] p-4 sm:p-5 border border-[#D2DEEA] shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-[#1A2138]">
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
                          : 'bg-[#F4F8FD] border-[#D2DEEA] text-[#5A6C84]'
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
                          : 'bg-[#F4F8FD] border-[#D2DEEA] text-[#1A2138]'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>
                        {flaggedIds[currentQuestion.id] ? 'Flagged' : 'Flag'}
                      </span>
                    </button>

                    {/* Mobile Palette Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowQuestionPalette((prev) => !prev)}
                      className="lg:hidden p-2 rounded-xl bg-[#EBF4FC] text-[#1673B8] border border-[#BBD6EE] text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                      title="Question Palette (1-30)"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1673B8] transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        ((currentIndex + 1) / activeQuestions.length) * 100
                      )}%`
                    }}
                  />
                </div>

                {/* Mobile Collapsible Question Palette */}
                {showQuestionPalette && (
                  <div className="lg:hidden pt-3 border-t border-[#E4EDF7] space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-bold text-[#5A6C84]">
                      <span>Jump to question (1–30):</span>
                      <span>
                        Answered: {attemptCounts.answered} · Flagged:{' '}
                        {attemptCounts.flagged}
                      </span>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                      {activeQuestions.map((q, idx) => {
                        const isAns = Boolean(selectedAnswers[q.id]);
                        const isFlg = Boolean(flaggedIds[q.id]);
                        let colorCls =
                          'bg-[#F4F8FD] text-[#1A2138] border-[#D2DEEA]';
                        if (isFlg) {
                          colorCls =
                            'bg-amber-500 text-white border-amber-600';
                        } else if (isAns) {
                          colorCls =
                            'bg-[#1673B8] text-white border-[#105E9A]';
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
                            className={`h-8 rounded-lg text-xs font-extrabold border cursor-pointer transition-all tabular-nums ${colorCls} ${
                              idx === currentIndex
                                ? 'ring-2 ring-[#1A2138] ring-offset-1'
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

              {/* MAIN QUESTION CARD */}
              <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#D2DEEA] shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs font-extrabold text-[#1673B8]">
                  <span>
                    QUESTION {currentIndex + 1} · {currentQuestion.category}
                  </span>
                  <span className="text-[#5A6C84]">
                    Difficulty: {currentQuestion.difficulty}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-[#1A2138] leading-snug">
                  {stripLeadingReference(currentQuestion.questionText)}
                </h3>

                <p className="text-xs text-[#5A6C84] font-medium">
                  Select the most appropriate answer from the four options below:
                </p>

                {/* 4 Radio Options A, B, C, D */}
                <div className="space-y-3 pt-1">
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
                        className={`w-full text-left p-4 rounded-[16px] border transition-all flex items-start gap-3.5 cursor-pointer ${
                          userSelected
                            ? 'bg-[#EBF4FC] border-2 border-[#1673B8] shadow-xs'
                            : 'bg-[#F8FAFC] border-[#D2DEEA] hover:border-[#1673B8] hover:bg-white'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${
                            userSelected
                              ? 'bg-[#1673B8] text-white'
                              : 'bg-white border-2 border-[#94A3B8] text-[#1A2138]'
                          }`}
                        >
                          {letter}
                        </span>
                        <span
                          className={`text-xs sm:text-sm leading-relaxed ${
                            userSelected
                              ? 'font-extrabold text-[#1A2138]'
                              : 'font-semibold text-[#1A2138]'
                          }`}
                        >
                          {optionText}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Indicator Footer */}
                <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-[#1673B8]">
                  <span className="inline-flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#1673B8]" />
                    <span>
                      {selectedAnswers[currentQuestion.id]
                        ? `Selected Option: ${selectedAnswers[currentQuestion.id]}`
                        : 'No option selected yet'}
                    </span>
                  </span>
                  <span className="text-[11px] text-[#5A6C84] font-semibold tabular-nums">
                    {attemptCounts.answered} / {attemptCounts.total} Answered
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
                  className={`py-3.5 px-4 rounded-[16px] bg-white border border-[#D2DEEA] text-sm font-extrabold inline-flex items-center justify-center gap-2 ${
                    currentIndex === 0
                      ? 'opacity-40 cursor-not-allowed text-gray-400'
                      : 'text-[#1A2138] hover:bg-[#F4F8FD] cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Question</span>
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
                    className="py-3.5 px-4 rounded-[16px] bg-[#1673B8] hover:bg-[#105E9A] text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitConfirmModal(true)}
                    className="py-3.5 px-4 rounded-[16px] bg-[#1A2138] hover:bg-[#1673B8] text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Exam</span>
                  </button>
                )}
              </div>

              {/* Finish & Submit Exam Anytime Button on Mobile */}
              <div className="lg:hidden text-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirmModal(true)}
                  className="text-xs font-extrabold text-[#1673B8] hover:underline cursor-pointer"
                >
                  Finish &amp; Submit Exam Now ({attemptCounts.answered}/
                  {attemptCounts.total} Answered) →
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN ON DESKTOP: ALWAYS-VISIBLE 1-30 QUESTION PALETTE & STATUS (4 Cols on Desktop) */}
            <div className="hidden lg:block lg:col-span-4 space-y-4 sticky top-24">
              <div className="bg-white rounded-[24px] p-5 border border-[#D2DEEA] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E4EDF7] pb-3">
                  <h4 className="text-sm font-extrabold text-[#1A2138]">
                    Question Navigator (1–{activeQuestions.length})
                  </h4>
                  <span className="text-xs font-extrabold text-[#1673B8] tabular-nums">
                    {attemptCounts.answered}/{attemptCounts.total} Done
                  </span>
                </div>

                {/* Status Counters */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#EBF4FC] border border-[#BBD6EE]">
                    <div className="text-sm font-extrabold text-[#1673B8] tabular-nums">
                      {attemptCounts.answered}
                    </div>
                    <div className="text-[10px] font-bold text-[#1A2138]">
                      Answered
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-sm font-extrabold text-amber-700 tabular-nums">
                      {attemptCounts.flagged}
                    </div>
                    <div className="text-[10px] font-bold text-amber-900">
                      Flagged
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA]">
                    <div className="text-sm font-extrabold text-[#5A6C84] tabular-nums">
                      {attemptCounts.notAnswered}
                    </div>
                    <div className="text-[10px] font-bold text-[#5A6C84]">
                      Remaining
                    </div>
                  </div>
                </div>

                {/* 30-Question Grid */}
                <div className="grid grid-cols-6 gap-2">
                  {activeQuestions.map((q, idx) => {
                    const isAns = Boolean(selectedAnswers[q.id]);
                    const isFlg = Boolean(flaggedIds[q.id]);
                    let colorCls =
                      'bg-[#F8FAFC] text-[#1A2138] border-[#D2DEEA] hover:border-[#1673B8]';
                    if (isFlg) {
                      colorCls = 'bg-amber-500 text-white border-amber-600';
                    } else if (isAns) {
                      colorCls = 'bg-[#1673B8] text-white border-[#105E9A]';
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
                        className={`h-9 rounded-xl text-xs font-extrabold border cursor-pointer transition-all tabular-nums ${colorCls} ${
                          idx === currentIndex
                            ? 'ring-2 ring-[#1A2138] ring-offset-1'
                            : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setShowSubmitConfirmModal(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish &amp; Submit Exam Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Confirmation Popup Modal */}
          {showSubmitConfirmModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-[26px] max-w-md w-full p-6 shadow-2xl border border-[#D2DEEA] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#EBF4FC] text-[#1673B8] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1A2138]">
                      Submit 30-MCQs Exam?
                    </h3>
                    <p className="text-xs text-[#5A6C84]">
                      Save your attempt and view your official exam performance
                      report.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-2xl bg-[#EBF4FC] border border-[#BBD6EE]">
                    <div className="text-lg font-extrabold text-[#1673B8] tabular-nums">
                      {attemptCounts.answered}
                    </div>
                    <div className="text-[10.5px] font-bold text-[#1A2138]">
                      Answered
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="text-lg font-extrabold text-amber-700 tabular-nums">
                      {attemptCounts.flagged}
                    </div>
                    <div className="text-[10.5px] font-bold text-amber-900">
                      Flagged
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA]">
                    <div className="text-lg font-extrabold text-[#5A6C84] tabular-nums">
                      {attemptCounts.notAnswered}
                    </div>
                    <div className="text-[10.5px] font-bold text-[#5A6C84]">
                      Skipped
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitConfirmModal(false)}
                    className="flex-1 py-3 rounded-xl border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] hover:bg-[#F4F8FD] cursor-pointer"
                  >
                    Continue Exam
                  </button>
                  <button
                    type="button"
                    onClick={finalizeAndSubmitExam}
                    className="flex-1 py-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold shadow-md cursor-pointer"
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
          SCREEN 3: EXAM RESULT SCREEN
          - Free Users: See ONLY Summary Report (Pass/Fail, %, Correct, Wrong, Skipped). No PDF & No 30-MCQ Answer Key.
          - Paid Users: See Full Summary + All 30 MCQs with Correct & Wrong Answers + Full PDF Download.
         ===================================================================== */}
      {screen === 'result' && activeResult && (
        <div className="bg-[#F0F6FC] rounded-[28px] sm:rounded-[32px] overflow-hidden border border-[#D2DEEA] shadow-md">
          {/* Top Bar */}
          <div className="bg-white px-4 sm:px-6 py-4 border-b border-[#D2DEEA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setScreen('dashboard')}
                className="w-9 h-9 rounded-xl bg-[#F0F6FC] hover:bg-[#DCE9F6] flex items-center justify-center text-[#1A2138] cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="text-[11px] font-extrabold text-[#1673B8]">
                  {activeResult.category}
                </div>
                <h2 className="text-sm sm:text-lg font-extrabold text-[#1A2138]">
                  {activeResult.title} — Official Result
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleShareResult(activeResult)}
              className="px-3.5 py-2 rounded-xl bg-[#F0F6FC] hover:bg-[#DCE9F6] flex items-center gap-1.5 text-xs font-extrabold text-[#1A2138] cursor-pointer"
              title="Share Score Summary"
            >
              <Share2 className="w-4 h-4 text-[#1673B8]" />
              <span className="hidden sm:inline">Share Summary</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* TOP SUMMARY GRID: HERO PASS/FAIL BANNER + PERFORMANCE BREAKDOWN CARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* BIG HERO RESULT CARD (6 Cols on Desktop) */}
              <div
                className={`lg:col-span-6 rounded-[26px] p-6 sm:p-8 text-white text-center shadow-md flex flex-col items-center justify-center space-y-3 ${
                  activeResult.status === 'PASS'
                    ? 'bg-gradient-to-br from-[#1A2138] via-[#105E9A] to-[#1673B8]'
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

                <div className="text-xs font-black uppercase tracking-widest text-white/90">
                  Test Status: {activeResult.status} (
                  {activeResult.status === 'PASS'
                    ? 'Passed ≥ 50%'
                    : 'Failed < 50%'}
                  )
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight tabular-nums">
                  {activeResult.scorePercent}% Marks ({activeResult.correct} /{' '}
                  {activeResult.totalQuestions})
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-white/90">
                  Track: {activeResult.category} · Completed on{' '}
                  {activeResult.dateFormatted} · Duration:{' '}
                  {activeResult.timeTakenFormatted}
                </p>

                {!canUsePremium && (
                  <div className="pt-1 text-[11px] font-bold text-amber-200">
                    {isGuestUser ? 'Guest Tier' : 'Registered Free Tier'} Attempts
                    Used: {totalAttemptsCount} of {maxFreeAttempts}
                  </div>
                )}
              </div>

              {/* FRONT SUMMARY METRICS & PIE CHART (6 Cols on Desktop — Shown to Guest, Free & Paid Users) */}
              <div className="lg:col-span-6 bg-white rounded-[26px] p-5 sm:p-6 border border-[#D2DEEA] shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-extrabold text-[#1673B8]">
                    Attempt Summary Report
                  </div>
                  <h4 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                    Score Breakdown (Correct, Wrong &amp; Skipped)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-4">
                    <svg
                      viewBox="0 0 42 42"
                      className="w-28 h-28 shrink-0 -rotate-90"
                    >
                      <circle cx="21" cy="21" r="15.915" fill="#F0F6FC" />
                      <circle
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke="#94A3B8"
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
                        stroke="#1673B8"
                        strokeWidth="10"
                        strokeDasharray={`${activeResult.scorePercent} 100`}
                      />
                    </svg>

                    <div className="space-y-1.5 text-xs font-extrabold tabular-nums">
                      <div className="text-[#1673B8]">
                        ✓ {activeResult.correct}{' '}
                        <span className="text-[#1A2138] font-bold">
                          Correct
                        </span>
                      </div>
                      <div className="text-[#D97706]">
                        ✗ {activeResult.wrong}{' '}
                        <span className="text-[#D97706] font-bold">Wrong</span>
                      </div>
                      <div className="text-[#5A6C84]">
                        − {activeResult.skipped}{' '}
                        <span className="text-[#1A2138] font-bold">
                          Skipped
                        </span>
                      </div>
                      <div className="text-[11px] text-[#1673B8] font-bold">
                        Percentage: {activeResult.scorePercent}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-center">
                    <div className="p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
                      <div className="text-base font-extrabold text-[#1673B8] tabular-nums">
                        {activeResult.correct}/{activeResult.totalQuestions}
                      </div>
                      <div className="text-[10.5px] font-bold text-[#5A6C84]">
                        Correct Answers
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                      <div className="text-base font-extrabold text-amber-700 tabular-nums">
                        {activeResult.wrong}/{activeResult.totalQuestions}
                      </div>
                      <div className="text-[10.5px] font-bold text-amber-900">
                        Wrong Answers
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA]">
                      <div className="text-base font-extrabold text-[#1A2138] tabular-nums">
                        {activeResult.skipped}/{activeResult.totalQuestions}
                      </div>
                      <div className="text-[10.5px] font-bold text-[#5A6C84]">
                        Skipped MCQs
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
                      <div
                        className={`text-base font-extrabold ${
                          activeResult.status === 'PASS'
                            ? 'text-emerald-700'
                            : 'text-red-600'
                        }`}
                      >
                        {activeResult.status}
                      </div>
                      <div className="text-[10.5px] font-bold text-[#5A6C84]">
                        Final Result
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons inside Summary Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {canUsePremium ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          download5PageExamReportPdf(
                            user,
                            activeResult,
                            savedResults
                          );
                          showToast('Official Exam PDF Report downloaded!');
                        }}
                        className="py-3 px-3.5 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Download className="w-4 h-4 shrink-0" />
                        <span>Download Full Report PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          downloadExamAchievementCertificatePdf(
                            user,
                            activeResult
                          );
                          showToast('Official Certificate PDF downloaded!');
                        }}
                        className="py-3 px-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Award className="w-4 h-4 shrink-0" />
                        <span>Download Certificate PDF</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setPaywallModalFeature(
                            'Exam Certificate Download (Locked for Guest & Free Users — Paid Members Only)'
                          )
                        }
                        className="py-3 px-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>Certificate (Paid Only)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPaywallModalFeature(
                            'Full Detailed Exam Report with Correct Answers & PDF Download (Paid Members Only)'
                          )
                        }
                        className="py-3 px-3.5 rounded-2xl bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#1673B8] border border-[#1673B8]/40 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>Full Report PDF (Paid)</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleStartNew30McqExam(activeExamTrack)}
                    className="py-3 px-3.5 rounded-2xl bg-[#1A2138] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-[#60A5FA] shrink-0" />
                    <span>
                      {!canUsePremium && totalAttemptsCount >= maxFreeAttempts
                        ? 'Unlock More Attempts'
                        : 'Next Exam (30 MCQs)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* =================================================================
                DETAILED 30-MCQ CORRECT vs WRONG ANSWER REVIEW
                - PAID MEMBERS: Full 30 MCQs with Options, Your Answer, Correct Answer & Explanation
                - FREE USERS: Hidden! Shows Upgrade Card instead.
               ================================================================= */}
            {canUsePremium ? (
              <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-[#D2DEEA] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4EDF7] pb-4">
                  <div>
                    <div className="text-xs font-extrabold text-[#1673B8]">
                      Paid Member Complete Answer Key &amp; Audit Explanations
                    </div>
                    <h4 className="text-base sm:text-xl font-extrabold text-[#1A2138]">
                      All {activeResult.answers.length || 30} Questions Detailed
                      Review (Correct vs. Wrong Answers)
                    </h4>
                  </div>

                  {activeResult.answers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const allOpen: Record<string, boolean> = {};
                        activeResult.answers.forEach((a) => {
                          allOpen[a.questionId] = true;
                        });
                        setExpandedReviewIds(allOpen);
                        showToast('All explanations expanded!');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#1673B8] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Expand All Explanations</span>
                    </button>
                  )}
                </div>

                {activeResult.answers.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] text-center text-xs text-[#5A6C84]">
                    Detailed question-by-question records are saved for all new
                    30-MCQ attempts taken in the Exam Suite.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {activeResult.answers.map((ans) => {
                      const getOptionText = (letter: OptionLetter | null) => {
                        if (!letter) return 'Not Answered (Skipped)';
                        if (letter === 'A') return `A. ${ans.optionA}`;
                        if (letter === 'B') return `B. ${ans.optionB}`;
                        if (letter === 'C') return `C. ${ans.optionC}`;
                        return `D. ${ans.optionD}`;
                      };
                      const isExpanded =
                        expandedReviewIds[ans.questionId] ?? true;

                      return (
                        <div
                          key={ans.questionId}
                          className={`rounded-2xl p-4 sm:p-5 border space-y-3 ${
                            ans.isCorrect
                              ? 'bg-[#F8FAFC] border-[#D2DEEA]'
                              : 'bg-amber-50/40 border-amber-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-white text-xs font-extrabold shrink-0 mt-0.5 tabular-nums ${
                                  ans.isCorrect
                                    ? 'bg-[#1673B8]'
                                    : ans.userAnswer === null
                                      ? 'bg-slate-500'
                                      : 'bg-red-600'
                                }`}
                              >
                                Q{ans.questionNumber}
                              </span>
                              <div>
                                <div className="text-[11px] font-bold text-[#5A6C84]">
                                  {ans.category} ·{' '}
                                  {ans.isCorrect
                                    ? '✓ Correct'
                                    : ans.userAnswer === null
                                      ? 'Skipped'
                                      : '✗ Wrong'}
                                </div>
                                <h5 className="text-xs sm:text-sm font-extrabold text-[#1A2138] leading-snug mt-0.5">
                                  {stripLeadingReference(ans.questionText)}
                                </h5>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs pt-1">
                            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 font-bold text-emerald-950">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>
                                <strong>Correct Answer:</strong>{' '}
                                {getOptionText(ans.correctAnswer)}
                              </span>
                            </div>

                            <div
                              className={`p-2.5 rounded-xl border flex items-start gap-2 font-bold ${
                                ans.isCorrect
                                  ? 'bg-[#EBF4FC] border-[#BBD6EE] text-[#105E9A]'
                                  : 'bg-red-50 border-red-200 text-red-900'
                              }`}
                            >
                              {ans.isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-[#1673B8] shrink-0 mt-0.5" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                              )}
                              <span>
                                <strong>Your Answer:</strong>{' '}
                                {getOptionText(ans.userAnswer)}
                              </span>
                            </div>

                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedReviewIds((prev) => ({
                                    ...prev,
                                    [ans.questionId]: !isExpanded
                                  }))
                                }
                                className="text-[11px] font-extrabold text-[#1673B8] hover:underline cursor-pointer"
                              >
                                {isExpanded
                                  ? 'Hide Explanation ▲'
                                  : 'View Explanation ▼'}
                              </button>
                              {isExpanded && (
                                <div className="mt-1.5 p-3 rounded-xl bg-white border border-[#D2DEEA] text-[11px] text-[#1A2138] leading-relaxed">
                                  <strong>Technical Explanation:</strong>{' '}
                                  {ans.explanation}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom Action Strip for Paid Members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E4EDF7]">
                  <button
                    type="button"
                    onClick={() => {
                      download5PageExamReportPdf(
                        user,
                        activeResult,
                        savedResults
                      );
                      showToast('Official Exam PDF Report downloaded!');
                    }}
                    className="py-4 px-5 rounded-[18px] bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold text-sm shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>
                      Download Full Exam PDF Report (With All 30 Answers)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      downloadExamAchievementCertificatePdf(
                        user,
                        activeResult
                      );
                      showToast('Official Certificate PDF downloaded!');
                    }}
                    className="py-4 px-5 rounded-[18px] bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="w-5 h-5" />
                    <span>
                      Download Exam Certificate PDF ({activeResult.scorePercent}
                      %)
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* GUEST & REGISTERED FREE USER LOCKED ANSWER KEY & CERTIFICATE CARD */
              <div className="bg-white rounded-[26px] p-6 sm:p-8 border-2 border-amber-300 shadow-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7 stroke-[2.2]" />
                </div>
                <div className="space-y-1.5 max-w-2xl mx-auto">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                    Paid Member Exclusive Feature
                  </div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#1A2138]">
                    Detailed Result with Correct Answers, Full Report &amp;
                    Certificate Download Locked
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5A6C84] leading-relaxed">
                    {isGuestUser ? (
                      <>
                        As a <strong>Guest User</strong>, you can attempt up to{' '}
                        <strong>03 Exams</strong> (You have used{' '}
                        {totalAttemptsCount} of {GUEST_MAX_ATTEMPTS} attempts)
                        and view your summary result above (Pass/Fail status,{' '}
                        {activeResult.scorePercent}% score, Correct/Wrong/Skipped
                        counts), but Certificate Download and Detailed Correct
                        Answers are locked. Register a Free Account for{' '}
                        <strong>05 Exam Attempts</strong>, or upgrade to{' '}
                        <strong>Paid Premium</strong> for{' '}
                        <strong>Unlimited Exam Attempts</strong>, the{' '}
                        <strong>Full Detailed Report with Correct Answers</strong>,
                        and <strong>Certificate &amp; Report Downloads</strong>!
                      </>
                    ) : (
                      <>
                        As a <strong>Registered Free Member</strong>, you can
                        attempt up to <strong>05 Exams</strong> (You have used{' '}
                        {totalAttemptsCount} of {REGISTERED_FREE_MAX_ATTEMPTS}{' '}
                        attempts) and view your summary result above (Pass/Fail
                        status, {activeResult.scorePercent}% score,
                        Correct/Wrong/Skipped counts). Detailed results with
                        correct answers and Certificate/PDF Report downloads are
                        exclusively available for{' '}
                        <strong>Paid Premium Members</strong> along with{' '}
                        <strong>Unlimited Exam Attempts</strong>!
                      </>
                    )}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {isGuestUser && onRequireSignIn && (
                    <button
                      type="button"
                      onClick={onRequireSignIn}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#1673B8] border border-[#1673B8] text-xs sm:text-sm font-extrabold cursor-pointer"
                    >
                      Register Free Account (05 Attempts) →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onOpenPremiumModal}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs sm:text-sm font-extrabold shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>
                      Upgrade to Paid Premium (Unlimited + Full Report &amp;
                      Certificate) →
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreen('dashboard')}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-[#D2DEEA] text-[#1A2138] hover:bg-[#F0F6FC] text-xs sm:text-sm font-extrabold cursor-pointer"
                  >
                    Back to Exam Center
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
