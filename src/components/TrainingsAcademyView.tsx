import React, { useState, useMemo } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileCheck2,
  Lock,
  PlayCircle,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
  XCircle
} from 'lucide-react';
import {
  HubCertificate,
  HubPaymentRequest,
  HubTraining,
  HubUser,
  PaymentGatewayConfig,
  UserCourseProgress
} from '../types/hub';
import {
  CourseExamMCQ,
  INTERNATIONAL_TRAINING_COURSES,
  InternationalTrainingCourse,
  get40CourseExamQuestions
} from '../data/internationalTrainingsData';
import { downloadOfficialCourseCertificatePdf } from '../utils/certificatePdfGenerator';

interface TrainingsAcademyViewProps {
  trainings: HubTraining[];
  currentUser: HubUser | null;
  users: HubUser[];
  certificates: HubCertificate[];
  paymentRequests: HubPaymentRequest[];
  paymentGatewayConfig: PaymentGatewayConfig;
  isCurrentUserPremiumActive: boolean;
  isUserPremiumActiveFn: (user?: HubUser | null) => boolean;
  onSaveCourseProgress: (
    courseId: string,
    updatedProgress: UserCourseProgress,
    allProgress: Record<string, UserCourseProgress>
  ) => Promise<void> | void;
  onSubmitCertificatePaymentRequest: (params: {
    courseId: string;
    courseTitle: string;
    certificateNumber: string;
    scorePercentage: number;
    distinction: boolean;
    paymentMethod: 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';
    transactionId: string;
    receiptImageUrl: string;
    notes: string;
  }) => Promise<void>;
  onOpenUpgradeModal: () => void;
}

function makeDeterministicCertNumber(uid: string, courseCode: string): string {
  const cleanUid = (uid || 'USR').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5);
  const cleanCode = (courseCode || 'FSC').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `FSP-${cleanCode}-${cleanUid}`;
}

export const TrainingsAcademyView: React.FC<TrainingsAcademyViewProps> = ({
  trainings,
  currentUser,
  users,
  certificates,
  paymentRequests,
  paymentGatewayConfig,
  isCurrentUserPremiumActive,
  isUserPremiumActiveFn,
  onSaveCourseProgress,
  onSubmitCertificatePaymentRequest,
  onOpenUpgradeModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'my-certificates' | 'verify-portal'>('catalog');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeModuleIdx, setActiveModuleIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'overview' | 'study' | 'exam' | 'exam-result' | 'certificate-preview'>('overview');

  // Exam state (40 MCQs)
  const [examQuestions, setExamQuestions] = useState<CourseExamMCQ[]>([]);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [lastExamResult, setLastExamResult] = useState<{
    correctCount: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    distinction: boolean;
    certificateNumber: string;
  } | null>(null);

  // Rs. 1,000 Certificate Unlock Payment Modal
  const [certPayModalCourse, setCertPayModalCourse] = useState<{
    course: InternationalTrainingCourse;
    progress: UserCourseProgress;
  } | null>(null);
  const [payMethod, setPayMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Bank Transfer'>('JazzCash');
  const [payTxId, setPayTxId] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [payReceiptDataUrl, setPayReceiptDataUrl] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);
  const [payFeedbackMsg, setPayFeedbackMsg] = useState<string | null>(null);

  // Verification Portal Search State
  const [verifyQuery, setVerifyQuery] = useState('');
  const [hasSearchedVerify, setHasSearchedVerify] = useState(false);

  // Merge Admin-managed trainings with international curriculum data
  const mergedCourses: InternationalTrainingCourse[] = useMemo(() => {
    const activeAdminTrainings = trainings.filter((t) => t.isActive !== false);
    const result: InternationalTrainingCourse[] = [];

    for (const baseCourse of INTERNATIONAL_TRAINING_COURSES) {
      const adminMatch = trainings.find(
        (t) =>
          t.id === baseCourse.id ||
          t.title.trim().toLowerCase() === baseCourse.title.trim().toLowerCase()
      );
      if (adminMatch && adminMatch.isActive === false) {
        continue; // Hidden by Admin in Control Panel
      }
      result.push({
        ...baseCourse,
        title: adminMatch?.title || baseCourse.title,
        description: adminMatch?.description || baseCourse.description,
        duration: adminMatch?.duration || baseCourse.duration
      });
    }

    // Also include any custom International Certification course added by Admin in AdminControlPanel
    for (const customTr of activeAdminTrainings) {
      const alreadyIn = result.some(
        (c) =>
          c.id === customTr.id ||
          c.title.trim().toLowerCase() === customTr.title.trim().toLowerCase()
      );
      if (!alreadyIn && customTr.category === 'International Certification') {
        const fallbackTemplate = INTERNATIONAL_TRAINING_COURSES[0];
        result.push({
          ...fallbackTemplate,
          id: customTr.id,
          code: customTr.standardCode || 'FSC-INT',
          title: customTr.title,
          levelBadge: customTr.subType || 'International Certification',
          description: customTr.description,
          duration: customTr.duration || '12 Guided Hours · 5 Modules'
        });
      }
    }

    return result;
  }, [trainings]);

  // Load user's saved courseProgress map from currentUser + localStorage fallback
  const courseProgressMap: Record<string, UserCourseProgress> = useMemo(() => {
    const uidKey = currentUser?.uid || 'guest';
    let localMap: Record<string, UserCourseProgress> = {};
    try {
      const raw = localStorage.getItem(`fsp_course_progress_${uidKey}`);
      if (raw) {
        localMap = JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    const cloudMap = currentUser?.toolsData?.courseProgress || {};
    const combined: Record<string, UserCourseProgress> = { ...localMap, ...cloudMap };

    // Sync Admin approval status from certificates & paymentRequests collections
    for (const cId of Object.keys(combined)) {
      const prog = combined[cId];
      const certNo = prog.certificateNumber;
      const isApprovedInCerts = certificates.some(
        (cert) =>
          cert.verificationStatus === 'valid' &&
          ((certNo && cert.certificateNumber.toUpperCase() === certNo.toUpperCase()) ||
            (currentUser?.uid &&
              cert.recipientUid === currentUser.uid &&
              cert.trainingTitle.trim().toLowerCase() === prog.courseTitle.trim().toLowerCase()))
      );
      const isApprovedInPayReqs = paymentRequests.some(
        (req) =>
          req.uid === currentUser?.uid &&
          req.certificateCourseId === cId &&
          req.status === 'verified'
      );
      const isPendingInPayReqs = paymentRequests.some(
        (req) =>
          req.uid === currentUser?.uid &&
          req.certificateCourseId === cId &&
          req.status === 'pending'
      );

      if (isApprovedInCerts || isApprovedInPayReqs) {
        combined[cId] = {
          ...prog,
          certificateFeePaid: true,
          certificateFeePending: false
        };
      } else if (isPendingInPayReqs) {
        combined[cId] = {
          ...prog,
          certificateFeePending: true
        };
      }
    }

    return combined;
  }, [currentUser, certificates, paymentRequests]);

  const saveProgressHelper = (course: InternationalTrainingCourse, updated: UserCourseProgress) => {
    const uidKey = currentUser?.uid || 'guest';
    const nextMap = {
      ...courseProgressMap,
      [course.id]: updated
    };
    try {
      localStorage.setItem(`fsp_course_progress_${uidKey}`, JSON.stringify(nextMap));
      localStorage.setItem(`fsp_last_active_course_${uidKey}`, course.id);
    } catch {
      // ignore
    }
    onSaveCourseProgress(course.id, updated, nextMap);
  };

  // Find the most recently accessed course for "Continue Where You Left Off"
  const lastInProgressCourse = useMemo(() => {
    const entries = Object.values(courseProgressMap).filter((p) =>
      mergedCourses.some((c) => c.id === p.courseId)
    );
    if (entries.length === 0) return null;
    entries.sort(
      (a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
    );
    const latest = entries[0];
    const courseObj = mergedCourses.find((c) => c.id === latest.courseId);
    if (!courseObj) return null;
    return { course: courseObj, progress: latest };
  }, [courseProgressMap, mergedCourses]);

  const selectedCourse = useMemo(
    () => mergedCourses.find((c) => c.id === selectedCourseId) || null,
    [mergedCourses, selectedCourseId]
  );

  const selectedProgress: UserCourseProgress | null = useMemo(() => {
    if (!selectedCourse) return null;
    const existing = courseProgressMap[selectedCourse.id];
    if (existing) return existing;
    return {
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      completedModuleIds: [],
      lastModuleIndex: 0,
      lastAccessedAt: new Date().toISOString(),
      examPassed: false,
      bestExamScore: 0,
      bestExamTotal: 40,
      bestExamPercentage: 0,
      distinctionEarned: false,
      certificateNumber: makeDeterministicCertNumber(currentUser?.uid || 'GUEST', selectedCourse.code),
      certificateFeePaid: false,
      certificateFeePending: false
    };
  }, [selectedCourse, courseProgressMap, currentUser]);

  const handleOpenCourse = (course: InternationalTrainingCourse, resumeModuleIndex?: number) => {
    const existing = courseProgressMap[course.id];
    const startIdx =
      typeof resumeModuleIndex === 'number'
        ? resumeModuleIndex
        : existing?.lastModuleIndex ?? 0;

    setSelectedCourseId(course.id);
    setActiveModuleIdx(Math.min(Math.max(0, startIdx), course.modules.length - 1));
    setViewMode('study');

    const updated: UserCourseProgress = {
      courseId: course.id,
      courseTitle: course.title,
      completedModuleIds: existing?.completedModuleIds || [],
      lastModuleIndex: Math.min(Math.max(0, startIdx), course.modules.length - 1),
      lastAccessedAt: new Date().toISOString(),
      examPassed: existing?.examPassed || false,
      bestExamScore: existing?.bestExamScore || 0,
      bestExamTotal: 40,
      bestExamPercentage: existing?.bestExamPercentage || 0,
      distinctionEarned: existing?.distinctionEarned || false,
      examCompletedAt: existing?.examCompletedAt,
      certificateNumber:
        existing?.certificateNumber ||
        makeDeterministicCertNumber(currentUser?.uid || 'GUEST', course.code),
      certificateFeePaid: existing?.certificateFeePaid || false,
      certificateFeePending: existing?.certificateFeePending || false,
      certificateUnlockedAt: existing?.certificateUnlockedAt
    };
    saveProgressHelper(course, updated);
  };

  const handleSelectModule = (idx: number) => {
    if (!selectedCourse || !selectedProgress) return;
    setActiveModuleIdx(idx);
    const updated: UserCourseProgress = {
      ...selectedProgress,
      lastModuleIndex: idx,
      lastAccessedAt: new Date().toISOString()
    };
    saveProgressHelper(selectedCourse, updated);
  };

  const handleMarkModuleCompleteAndNext = () => {
    if (!selectedCourse || !selectedProgress) return;
    const currentMod = selectedCourse.modules[activeModuleIdx];
    const completedSet = new Set(selectedProgress.completedModuleIds);
    if (currentMod) {
      completedSet.add(currentMod.id);
    }

    const isLastModule = activeModuleIdx >= selectedCourse.modules.length - 1;
    const nextIdx = isLastModule ? activeModuleIdx : activeModuleIdx + 1;

    const updated: UserCourseProgress = {
      ...selectedProgress,
      completedModuleIds: Array.from(completedSet),
      lastModuleIndex: nextIdx,
      lastAccessedAt: new Date().toISOString()
    };
    saveProgressHelper(selectedCourse, updated);

    if (!isLastModule) {
      setActiveModuleIdx(nextIdx);
    }
  };

  const handleStart40McqExam = (course: InternationalTrainingCourse) => {
    const questions40 = get40CourseExamQuestions(course.id);
    setSelectedCourseId(course.id);
    setExamQuestions(questions40);
    setExamAnswers({});
    setLastExamResult(null);
    setViewMode('exam');
  };

  const handleSubmit40McqExam = () => {
    if (!selectedCourse || !selectedProgress) return;
    let correct = 0;
    examQuestions.forEach((q, idx) => {
      if (examAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });
    const total = examQuestions.length || 40;
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= 60;
    const distinction = percentage >= 75;
    const certNo =
      selectedProgress.certificateNumber ||
      makeDeterministicCertNumber(currentUser?.uid || 'GUEST', selectedCourse.code);

    setLastExamResult({
      correctCount: correct,
      totalQuestions: total,
      percentage,
      passed,
      distinction,
      certificateNumber: certNo
    });

    // Save best exam score & pass/distinction status
    const bestScore = Math.max(selectedProgress.bestExamScore || 0, correct);
    const bestPct = Math.max(selectedProgress.bestExamPercentage || 0, percentage);
    const updated: UserCourseProgress = {
      ...selectedProgress,
      completedModuleIds: selectedCourse.modules.map((m) => m.id),
      lastAccessedAt: new Date().toISOString(),
      examPassed: selectedProgress.examPassed || passed,
      bestExamScore: bestScore,
      bestExamTotal: total,
      bestExamPercentage: bestPct,
      distinctionEarned: selectedProgress.distinctionEarned || distinction,
      examCompletedAt: new Date().toISOString(),
      certificateNumber: certNo
    };
    saveProgressHelper(selectedCourse, updated);
    setViewMode('exam-result');
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPayReceiptDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitCertPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certPayModalCourse || !currentUser) return;
    if (!payTxId.trim()) {
      setPayFeedbackMsg('Baraye meharbani Transaction ID / Reference Number darj karein.');
      return;
    }
    setIsSubmittingPay(true);
    setPayFeedbackMsg(null);
    try {
      const { course, progress } = certPayModalCourse;
      const certNo =
        progress.certificateNumber ||
        makeDeterministicCertNumber(currentUser.uid, course.code);

      await onSubmitCertificatePaymentRequest({
        courseId: course.id,
        courseTitle: course.title,
        certificateNumber: certNo,
        scorePercentage: progress.bestExamPercentage || 60,
        distinction: progress.distinctionEarned,
        paymentMethod: payMethod,
        transactionId: payTxId.trim(),
        receiptImageUrl: payReceiptDataUrl,
        notes: payNotes.trim() || `Certificate Unlock Fee Rs. 1,000 for ${course.title} (${certNo})`
      });

      const updated: UserCourseProgress = {
        ...progress,
        certificateNumber: certNo,
        certificateFeePending: true
      };
      saveProgressHelper(course, updated);

      setPayFeedbackMsg(
        'Apki Rs. 1,000 Certificate Request Admin Control Panel may bhej di gayi hy! Admin ki payment confirmation & approval k foran baad apka Certificate Download unlock ho jayega aur Online Verification Portal par live verify hoga.'
      );
      setPayTxId('');
      setPayNotes('');
      setPayReceiptDataUrl('');
    } catch {
      setPayFeedbackMsg('Request submit karnay may masla aya. Dobara koshish karein.');
    } finally {
      setIsSubmittingPay(false);
    }
  };

  // Online Certificate Verification Portal Search Results (Strict Membership Rule!)
  const verificationSearchResults = useMemo(() => {
    const q = verifyQuery.trim().toLowerCase();
    if (!q) return [];

    interface VerifiedRecordItem {
      certificateNumber: string;
      recipientUid?: string;
      recipientName: string;
      recipientEmail: string;
      courseTitle: string;
      accreditationBody: string;
      issueDate: string;
      scorePercentage: number;
      distinction: boolean;
      isHolderMembershipActive: boolean;
      revokedByAdmin: boolean;
    }

    const recordsMap = new Map<string, VerifiedRecordItem>();

    // 1. From official certificates collection (Admin-approved & issued)
    for (const cert of certificates) {
      const holderUser = users.find(
        (u) =>
          (cert.recipientUid && u.uid === cert.recipientUid) ||
          (cert.recipientEmail &&
            u.email.trim().toLowerCase() === cert.recipientEmail.trim().toLowerCase())
      );
      const isHolderActive = holderUser ? isUserPremiumActiveFn(holderUser) : false;

      recordsMap.set(cert.certificateNumber.toUpperCase(), {
        certificateNumber: cert.certificateNumber.toUpperCase(),
        recipientUid: cert.recipientUid || holderUser?.uid,
        recipientName: cert.recipientName || holderUser?.name || 'Certified Member',
        recipientEmail: cert.recipientEmail || holderUser?.email || '',
        courseTitle: cert.trainingTitle,
        accreditationBody:
          cert.accreditationBody || 'Codex Alimentarius & GFSI International Standard',
        issueDate: cert.issueDate,
        scorePercentage: cert.scorePercentage || 75,
        distinction: Boolean(cert.distinction || (cert.scorePercentage && cert.scorePercentage >= 75)),
        isHolderMembershipActive: isHolderActive,
        revokedByAdmin: cert.verificationStatus === 'revoked'
      });
    }

    // 2. Also scan users' toolsData.courseProgress where certificateFeePaid === true
    for (const u of users) {
      const progMap = u.toolsData?.courseProgress;
      if (!progMap) continue;
      const isHolderActive = isUserPremiumActiveFn(u);
      for (const prog of Object.values(progMap)) {
        if (!prog.examPassed || !prog.certificateFeePaid || !prog.certificateNumber) continue;
        const certKey = prog.certificateNumber.toUpperCase();
        if (!recordsMap.has(certKey)) {
          const courseObj = INTERNATIONAL_TRAINING_COURSES.find((c) => c.id === prog.courseId);
          recordsMap.set(certKey, {
            certificateNumber: certKey,
            recipientUid: u.uid,
            recipientName: u.name,
            recipientEmail: u.email,
            courseTitle: prog.courseTitle,
            accreditationBody:
              courseObj?.accreditationStandard || 'FS Portal International Academy',
            issueDate: prog.certificateUnlockedAt
              ? new Date(prog.certificateUnlockedAt).toLocaleDateString()
              : prog.examCompletedAt
              ? new Date(prog.examCompletedAt).toLocaleDateString()
              : new Date().toLocaleDateString(),
            scorePercentage: prog.bestExamPercentage,
            distinction: prog.distinctionEarned,
            isHolderMembershipActive: isHolderActive,
            revokedByAdmin: false
          });
        }
      }
    }

    return Array.from(recordsMap.values()).filter(
      (item) =>
        item.certificateNumber.toLowerCase().includes(q) ||
        item.recipientEmail.toLowerCase().includes(q) ||
        item.recipientName.toLowerCase().includes(q)
    );
  }, [verifyQuery, certificates, users, isUserPremiumActiveFn]);

  // Render Reusable Certificate Pattern Card (for Preview & Unlocked Download)
  const renderCertificatePatternCard = (
    course: InternationalTrainingCourse,
    progress: UserCourseProgress
  ) => {
    const isUnlocked = Boolean(progress.certificateFeePaid && isCurrentUserPremiumActive);
    const isFeePaidButMembershipExpired = Boolean(
      progress.certificateFeePaid && !isCurrentUserPremiumActive
    );
    const isPendingAdminApproval = Boolean(
      progress.certificateFeePending && !progress.certificateFeePaid
    );
    const certNo =
      progress.certificateNumber ||
      makeDeterministicCertNumber(currentUser?.uid || 'GUEST', course.code);
    const scorePct = progress.bestExamPercentage || 0;
    const correctOutOf40 = progress.bestExamScore || Math.round((scorePct / 100) * 40);
    const isDistinction = progress.distinctionEarned || scorePct >= 75;
    const holderName = currentUser?.name || 'Candidate Name';
    const issueDateStr = progress.examCompletedAt
      ? new Date(progress.examCompletedAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });

    return (
      <div className="space-y-4">
        {/* Certificate Visual Pattern Frame */}
        <div className="relative overflow-hidden rounded-2xl border-4 border-[#0D5C3A] bg-[#FAFDF9] p-5 sm:p-7 shadow-xl">
          {/* Inner Gold Border */}
          <div className="border-2 border-amber-500/80 rounded-xl p-4 sm:p-6 relative">
            {/* Watermark if not yet unlocked */}
            {!isUnlocked && (
              <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-10">
                <span className="rotate-[-18deg] border-2 border-amber-600/30 bg-amber-50/75 px-5 py-2 rounded-xl text-xs sm:text-base font-black uppercase tracking-widest text-amber-900/50 shadow-sm">
                  {isPendingAdminApproval
                    ? 'PENDING ADMIN APPROVAL · PREVIEW ONLY'
                    : 'CERTIFICATE PATTERN PREVIEW · DOWNLOAD LOCKED'}
                </span>
              </div>
            )}

            <div className="text-center space-y-2.5 relative z-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0D5C3A] text-white text-[10px] font-extrabold uppercase tracking-widest">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                FS Portal International Certification Academy
              </div>

              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#0D5C3A] font-serif">
                {isDistinction ? 'CERTIFICATE OF DISTINCTION' : 'CERTIFICATE OF ACHIEVEMENT'}
              </h3>

              <div className="flex justify-center">
                {isDistinction ? (
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Passed with Distinction ({scorePct}% · &gt;= 75%)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-md bg-emerald-100 border border-emerald-400 text-emerald-900 text-[11px] font-extrabold uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    Passed International Standard ({scorePct}% · &gt;= 60%)
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 pt-1">This is to officially certify that</p>
              <p className="text-lg sm:text-2xl font-black text-slate-900 tracking-wide border-b-2 border-amber-400/80 inline-block px-6 pb-1 font-serif">
                {holderName}
              </p>

              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                has completed all 5 International Course Modules and passed the 40-MCQ Final Certification Exam in
              </p>

              <h4 className="text-base sm:text-xl font-black text-[#0D5C3A]">{course.title}</h4>
              <p className="text-[11px] font-semibold text-slate-500">
                Course Code: <span className="text-slate-800 font-bold">{course.code}</span> · Benchmark:{' '}
                <span className="text-slate-800">{course.accreditationStandard}</span>
              </p>

              <div className="grid grid-cols-3 gap-2 pt-4 mt-3 border-t border-emerald-900/15 text-left">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Certificate ID</p>
                  <p className="text-xs font-black text-slate-800 font-mono">{certNo}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Exam Score</p>
                  <p className="text-xs font-black text-[#0D5C3A]">
                    {scorePct}% ({correctOutOf40}/40 MCQs)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Issue Date</p>
                  <p className="text-xs font-bold text-slate-800">{issueDateStr}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action & Download Controls Based on User Tier & Admin Approval */}
        <div className="rounded-2xl border border-emerald-900/15 bg-white p-4 sm:p-5 shadow-sm space-y-3">
          {isUnlocked ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Admin Approved & Online Verification Active!
                </div>
                <p className="text-xs text-emerald-800">
                  Certificate ID <span className="font-mono font-bold">{certNo}</span> is live on the Verification Portal while your Paid Premium Membership is active.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  downloadOfficialCourseCertificatePdf({
                    certificateNumber: certNo,
                    recipientName: holderName,
                    recipientEmail: currentUser?.email || '',
                    courseTitle: course.title,
                    courseCode: course.code,
                    accreditationStandard: course.accreditationStandard,
                    scorePercentage: scorePct,
                    correctCount: correctOutOf40,
                    totalQuestions: 40,
                    distinction: isDistinction,
                    issueDate: issueDateStr,
                    verificationPortalUrl: window.location.origin
                  })
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D5C3A] hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Official PDF Certificate
              </button>
            </div>
          ) : isFeePaidButMembershipExpired ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  Premium Membership Expired — Certificate Verification & Download Paused
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Apka Rs. 1,000 certificate fee pehlay say paid & approved hy, magar apki Paid Premium Membership khatam ho chuki hy. Jab ap dobara Paid Premium Membership (Rs. {paymentGatewayConfig.monthlyFeeRs}/mo) renew karengay, apka certificate download aur online website verification foran dobara active ho jayega.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer"
              >
                Renew Premium Membership
              </button>
            </div>
          ) : isPendingAdminApproval ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                Rs. 1,000 Certificate Payment Request Sent — Waiting for Admin Approval
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Apki certificate download request Admin Control Panel may mojod hy. Payment confirmation k baad jesay hi Admin allow/approve karega, apka PDF Certificate Download button yahan unlock ho jayega aur Certificate ID <span className="font-mono font-bold">{certNo}</span> website par live verify hona shuru ho jayega.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  {isCurrentUserPremiumActive
                    ? 'Unlock Official PDF Certificate & Live Portal Verification (Rs. 1,000)'
                    : 'Free Member Preview Mode — Paid Membership + Rs. 1,000 Required for Download'}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isCurrentUserPremiumActive
                    ? 'Paid Members har certificate Rs. 1,000 fee pay kar k hasil kar saktay hain. Request submit karnay par Admin payment confirm kar k allow karega, jiskay baad PDF download aur live verification active ho jayegi.'
                    : 'Free users tamam course materials parh saktay hain, 40-MCQ exam day saktay hain aur apna Certificate Pattern dekh saktay hain, magar PDF Certificate download aur online verification k liye Paid Premium Membership + Rs. 1,000 per certificate lazmi hy.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {!isCurrentUserPremiumActive ? (
                  <button
                    type="button"
                    onClick={onOpenUpgradeModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Upgrade to Paid Member First
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setPayFeedbackMsg(null);
                      setCertPayModalCourse({ course, progress });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D5C3A] hover:bg-emerald-900 text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Pay Rs. 1,000 & Request Admin Unlock
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Top Academy Banner & Sub-Navigation Tabs */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0D5C3A] via-[#116943] to-[#094229] text-white p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-200">
              <Award className="w-4 h-4 text-amber-300" />
              International Food & Hospitality Certification Academy
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              14 Accredited International Trainings & Live Certificate Portal
            </h1>
            <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
              Study international modules with automatic resume tracking, pass the 40-MCQ Final Exam (60% Pass · 75% Distinction), preview your certificate pattern free, and unlock official PDF download & live verification (Rs. 1,000/certificate with active Paid Membership).
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('catalog');
                setSelectedCourseId(null);
                setViewMode('overview');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeSubTab === 'catalog'
                  ? 'bg-white text-[#0D5C3A] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              All 14 Courses
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('my-certificates');
                setSelectedCourseId(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeSubTab === 'my-certificates'
                  ? 'bg-white text-[#0D5C3A] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              My Certificates
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('verify-portal');
                setSelectedCourseId(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'verify-portal'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/10 text-amber-200 hover:bg-white/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verify Certificate Portal
            </button>
          </div>
        </div>
      </div>

      {/* ==================== TAB 3: ONLINE CERTIFICATE VERIFICATION PORTAL ==================== */}
      {activeSubTab === 'verify-portal' && (
        <div className="rounded-2xl border border-emerald-900/15 bg-white p-5 sm:p-6 shadow-sm space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0D5C3A]">
              <ShieldCheck className="w-4 h-4" />
              Official Online Certificate Verification Registry
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Verify Single or All Member Certificates Live
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter a Certificate ID (e.g. <span className="font-mono font-bold text-slate-800">FSP-FSC101-...</span>), Member Email, or Full Name to verify all or single certificates issued by FS Portal.{' '}
              <span className="font-semibold text-emerald-800">
                Note: Certificate verification visibility is strictly linked to the member’s active Paid Premium Membership.
              </span>
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setHasSearchedVerify(true);
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={verifyQuery}
                onChange={(e) => {
                  setVerifyQuery(e.target.value);
                  setHasSearchedVerify(true);
                }}
                placeholder="Enter Certificate Number (e.g. FSP-...), Member Email, or Name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#0D5C3A]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0D5C3A] hover:bg-emerald-900 text-white font-bold text-xs cursor-pointer shrink-0"
            >
              Verify Authenticity
            </button>
          </form>

          {hasSearchedVerify && verifyQuery.trim() !== '' && (
            <div className="space-y-3 pt-2">
              {verificationSearchResults.length === 0 ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-extrabold text-rose-900">
                      No Approved Certificate Found for &ldquo;{verifyQuery}&rdquo;
                    </p>
                    <p className="text-xs text-rose-700">
                      Yeh Certificate ID abhi Admin say approve nahi hua ya darj kiya gaya code ghalat hy.
                    </p>
                  </div>
                </div>
              ) : (
                verificationSearchResults.map((rec) => {
                  if (rec.revokedByAdmin) {
                    return (
                      <div
                        key={rec.certificateNumber}
                        className="rounded-xl border border-rose-300 bg-rose-50 p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-black text-rose-900">
                            Certificate Revoked by Administration ({rec.certificateNumber})
                          </p>
                          <p className="text-xs text-rose-700">
                            This credential has been revoked and is no longer valid.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  // STRICT MEMBERSHIP RULE: If holder's Paid Premium Membership expired, hide certificate details!
                  if (!rec.isHolderMembershipActive) {
                    return (
                      <div
                        key={rec.certificateNumber}
                        className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                          Certificate Verification Paused — Holder’s Paid Membership Expired
                        </div>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          Certificate ID <span className="font-mono font-bold">{rec.certificateNumber}</span> system may registered hy, magar is member ki <strong>Paid Premium Membership</strong> is waqt expire ho chuki hy. FS Portal policy k mutabiq certificate ki online verification aur details sirf active Paid Membership k doran show hoti hain. Jab member apni Paid Premium Membership dobara purchase/renew karega, tamam certificates ki verification details khud ba khud dobara live show ho jayengi.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={rec.certificateNumber}
                      className="rounded-2xl border-2 border-emerald-500/70 bg-emerald-50/50 p-5 space-y-3 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-amber-300" />
                            Verified & Active Credential
                          </span>
                          {rec.distinction && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-xs font-extrabold">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              Passed with Distinction ({rec.scorePercentage}%)
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-black text-emerald-950 bg-white px-3 py-1 rounded-lg border border-emerald-200">
                          ID: {rec.certificateNumber}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Certified Professional</p>
                          <p className="font-black text-slate-900 text-sm">{rec.recipientName}</p>
                          <p className="text-slate-500">{rec.recipientEmail}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Certification Title</p>
                          <p className="font-black text-[#0D5C3A] text-sm">{rec.courseTitle}</p>
                          <p className="text-slate-500">{rec.accreditationBody}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Standing & Membership Status</p>
                          <p className="font-bold text-slate-900">
                            Score: {rec.scorePercentage}% ({rec.distinction ? 'Distinction' : 'Passed'})
                          </p>
                          <p className="text-emerald-700 font-bold">
                            Issued: {rec.issueDate} · Active Paid Member
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: MY CERTIFICATES ==================== */}
      {activeSubTab === 'my-certificates' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-900/15 bg-white p-5 shadow-sm">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              My Earned Course Certificates & Pattern Previews
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Courses where you scored 60% or above on the 40-MCQ Final Exam appear below. Score 75%+ earns a Distinction Certificate.
            </p>
          </div>

          {mergedCourses.filter((c) => courseProgressMap[c.id]?.examPassed).length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
              <Award className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                Abhi tak apnay kisi course ka 40-MCQ Final Exam pass (60%+) nahi kiya.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Kisi bhi training course k modules mukammal kar k 40-MCQ exam dain. 60% marks par Pass Certificate aur 75% marks par Distinction Certificate jari hota hy.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('catalog')}
                className="px-4 py-2 rounded-xl bg-[#0D5C3A] text-white text-xs font-bold cursor-pointer"
              >
                Browse 14 Certification Courses
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {mergedCourses
                .filter((c) => courseProgressMap[c.id]?.examPassed)
                .map((course) => {
                  const prog = courseProgressMap[course.id];
                  return (
                    <div key={course.id} className="space-y-2">
                      {renderCertificatePatternCard(course, prog)}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 1: ALL 14 COURSES CATALOG OR ACTIVE COURSE STUDY/EXAM ==================== */}
      {activeSubTab === 'catalog' && !selectedCourse && (
        <div className="space-y-5">
          {/* "Continue Where You Left Off" Banner */}
          {lastInProgressCourse && (
            <div className="rounded-2xl border-2 border-[#0D5C3A]/30 bg-emerald-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#0D5C3A]">
                  <PlayCircle className="w-4 h-4" />
                  Continue Where You Left Off
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {lastInProgressCourse.course.title}
                </h3>
                <p className="text-xs text-slate-600">
                  Resume at{' '}
                  <span className="font-bold text-slate-900">
                    Module {lastInProgressCourse.progress.lastModuleIndex + 1}:{' '}
                    {lastInProgressCourse.course.modules[
                      lastInProgressCourse.progress.lastModuleIndex
                    ]?.title || 'Course Study'}
                  </span>{' '}
                  ({lastInProgressCourse.progress.completedModuleIds.length} /{' '}
                  {lastInProgressCourse.course.modules.length} Modules Completed)
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleOpenCourse(
                    lastInProgressCourse.course,
                    lastInProgressCourse.progress.lastModuleIndex
                  )
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D5C3A] hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition cursor-pointer shrink-0"
              >
                <PlayCircle className="w-4 h-4" />
                Resume Module {lastInProgressCourse.progress.lastModuleIndex + 1}
              </button>
            </div>
          )}

          {/* 14 International Certification Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mergedCourses.map((course, idx) => {
              const prog = courseProgressMap[course.id];
              const completedCount = prog?.completedModuleIds?.length || 0;
              const totalMods = course.modules.length;
              const pctMods = Math.round((completedCount / totalMods) * 100);
              const hasStarted = Boolean(prog);
              const resumeModNum = (prog?.lastModuleIndex ?? 0) + 1;

              return (
                <div
                  key={course.id}
                  className="rounded-2xl border border-emerald-900/15 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[#0D5C3A] text-[10px] font-extrabold uppercase tracking-wider">
                        #{idx + 1} · {course.code} · {course.levelBadge}
                      </span>
                      {prog?.examPassed && (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                            prog.distinctionEarned
                              ? 'bg-amber-100 border border-amber-400 text-amber-900'
                              : 'bg-emerald-100 border border-emerald-400 text-emerald-900'
                          }`}
                        >
                          <Award className="w-3 h-3" />
                          {prog.distinctionEarned
                            ? `Distinction (${prog.bestExamPercentage}%)`
                            : `Passed (${prog.bestExamPercentage}%)`}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    <div className="text-[11px] text-slate-500 font-medium space-y-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#0D5C3A]" />
                        <span>{course.accreditationStandard}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0D5C3A]" />
                        <span>
                          {course.duration} · 40-MCQ Exam (60% Pass / 75% Distinction) · Rs. 1,000 Certificate
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Module Progress Bar */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600">
                          Module Progress: {completedCount} / {totalMods} Modules
                        </span>
                        <span className="text-[#0D5C3A]">{pctMods}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#15803D] transition-all duration-300"
                          style={{ width: `${pctMods}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenCourse(course, hasStarted ? prog.lastModuleIndex : 0)
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D5C3A] hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer"
                      >
                        <PlayCircle className="w-4 h-4" />
                        {hasStarted
                          ? `Continue (Module ${resumeModNum})`
                          : 'Start Course Materials'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStart40McqExam(course)}
                        className="px-3.5 py-2.5 rounded-xl border border-[#0D5C3A] text-[#0D5C3A] hover:bg-emerald-50 font-bold text-xs transition cursor-pointer"
                      >
                        40-MCQ Exam
                      </button>

                      {prog?.examPassed && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourseId(course.id);
                            setViewMode('certificate-preview');
                          }}
                          className="px-3 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-xs transition cursor-pointer"
                        >
                          Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== SELECTED COURSE: STUDY MODULES / 40-MCQ EXAM / CERTIFICATE PREVIEW ==================== */}
      {activeSubTab === 'catalog' && selectedCourse && selectedProgress && (
        <div className="space-y-5">
          {/* Course Top Bar */}
          <div className="rounded-2xl border border-emerald-900/15 bg-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCourseId(null);
                  setViewMode('overview');
                }}
                className="text-xs font-extrabold text-[#0D5C3A] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                ← Back to All 14 Courses
              </button>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {selectedCourse.title}{' '}
                <span className="text-xs font-bold text-slate-500">({selectedCourse.code})</span>
              </h2>
              <p className="text-xs text-slate-500">{selectedCourse.accreditationStandard}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('study')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  viewMode === 'study'
                    ? 'bg-[#0D5C3A] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Study Modules ({selectedProgress.completedModuleIds.length}/5)
              </button>
              <button
                type="button"
                onClick={() => handleStart40McqExam(selectedCourse)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  viewMode === 'exam' || viewMode === 'exam-result'
                    ? 'bg-[#0D5C3A] text-white'
                    : 'bg-emerald-50 text-[#0D5C3A] border border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                Take 40-MCQ Final Exam
              </button>
              {selectedProgress.examPassed && (
                <button
                  type="button"
                  onClick={() => setViewMode('certificate-preview')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                    viewMode === 'certificate-preview'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  View Certificate Pattern
                </button>
              )}
            </div>
          </div>

          {/* MODE A: MODULE STUDY VIEW WITH RESUME TRACKING */}
          {viewMode === 'study' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Module List Sidebar */}
              <div className="lg:col-span-4 rounded-2xl border border-emerald-900/15 bg-white p-4 shadow-sm space-y-2.5 h-fit">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Course Curriculum (5 Modules)
                  </span>
                  <span className="text-xs font-bold text-[#0D5C3A]">
                    {Math.round(
                      (selectedProgress.completedModuleIds.length /
                        selectedCourse.modules.length) *
                        100
                    )}
                    % Done
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedCourse.modules.map((mod, mIdx) => {
                    const isCompleted = selectedProgress.completedModuleIds.includes(mod.id);
                    const isCurrent = activeModuleIdx === mIdx;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => handleSelectModule(mIdx)}
                        className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-2.5 cursor-pointer ${
                          isCurrent
                            ? 'border-[#0D5C3A] bg-emerald-50/70'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-400 text-[10px] font-bold flex items-center justify-center text-slate-600">
                              {mod.moduleNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-slate-900 leading-snug">
                            Module {mod.moduleNumber}: {mod.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {mod.estimatedMinutes} mins · {isCompleted ? 'Completed' : isCurrent ? 'Reading Now (Saved Point)' : 'Pending'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleStart40McqExam(selectedCourse)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    Proceed to 40-MCQ Final Exam
                  </button>
                </div>
              </div>

              {/* Right Active Module Study Content */}
              <div className="lg:col-span-8 rounded-2xl border border-emerald-900/15 bg-white p-5 sm:p-6 shadow-sm space-y-5">
                {(() => {
                  const mod = selectedCourse.modules[activeModuleIdx] || selectedCourse.modules[0];
                  const isModCompleted = selectedProgress.completedModuleIds.includes(mod.id);
                  return (
                    <>
                      <div className="space-y-2 border-b border-slate-100 pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-[#0D5C3A] text-[11px] font-extrabold uppercase">
                            Module {mod.moduleNumber} of {selectedCourse.modules.length} · Auto-Saved Resume Point
                          </span>
                          {isModCompleted && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4" /> Module Completed
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900">
                          {mod.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {mod.overview}
                        </p>
                      </div>

                      {/* International Standard Clauses */}
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1.5">
                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                          International Regulatory & Standard Clauses
                        </p>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-medium">
                          {mod.internationalClauses.map((cl, i) => (
                            <li key={i}>{cl}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Technical Principles */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#0D5C3A]">
                          Core International Principles & Technical Notes
                        </h4>
                        <div className="space-y-2">
                          {mod.keyPrinciples.map((p, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-emerald-900/10 bg-emerald-50/40 p-3.5 flex items-start gap-2.5"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#0D5C3A] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                                {p}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Critical Control Parameters Table */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#0D5C3A]">
                          Critical Control Limits & Corrective Protocols
                        </h4>
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-100 text-slate-700 font-extrabold">
                                <th className="p-3 border-b border-slate-200">Control Parameter</th>
                                <th className="p-3 border-b border-slate-200">International Standard Limit</th>
                                <th className="p-3 border-b border-slate-200">Mandatory Corrective Protocol</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mod.criticalControlParameters.map((ccp, i) => (
                                <tr key={i} className="border-b border-slate-100">
                                  <td className="p-3 font-bold text-slate-900">{ccp.parameter}</td>
                                  <td className="p-3 font-semibold text-[#0D5C3A]">{ccp.standardLimit}</td>
                                  <td className="p-3 text-slate-700">{ccp.correctiveProtocol}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Practical Audit & Implementation Checklist */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                          Practical Implementation & Audit Verification Checklist
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {mod.practicalChecklist.map((chk, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{chk}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          disabled={activeModuleIdx === 0}
                          onClick={() => handleSelectModule(Math.max(0, activeModuleIdx - 1))}
                          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold disabled:opacity-40 cursor-pointer"
                        >
                          ← Previous Module
                        </button>

                        {activeModuleIdx < selectedCourse.modules.length - 1 ? (
                          <button
                            type="button"
                            onClick={handleMarkModuleCompleteAndNext}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0D5C3A] hover:bg-emerald-900 text-white font-bold text-xs shadow-sm cursor-pointer"
                          >
                            Mark Module Complete & Next Module
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              handleMarkModuleCompleteAndNext();
                              handleStart40McqExam(selectedCourse);
                            }}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm cursor-pointer"
                          >
                            <Award className="w-4 h-4" />
                            Complete Course & Start 40-MCQ Final Exam
                          </button>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* MODE B: 40-MCQ FINAL EXAM */}
          {viewMode === 'exam' && (
            <div className="rounded-2xl border border-emerald-900/15 bg-white p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0D5C3A]">
                    Final Certification Examination · 40 Multiple-Choice Questions
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedCourse.title} — 40-MCQ Final Exam
                  </h3>
                  <p className="text-xs text-slate-600">
                    Minimum <strong>60% (24/40)</strong> required to Pass & qualify for Certificate ·{' '}
                    <strong>75% (30/40)</strong> earns a <strong>Distinction Certificate</strong>.
                  </p>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-[#0D5C3A] shrink-0">
                  Answered: {Object.keys(examAnswers).length} / {examQuestions.length}
                </div>
              </div>

              <div className="space-y-4">
                {examQuestions.map((q, qIdx) => {
                  const chosen = examAnswers[qIdx];
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/40"
                    >
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                        <span className="text-[#0D5C3A] font-black mr-1.5">
                          Q{q.questionNumber}.
                        </span>
                        {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = chosen === oIdx;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() =>
                                setExamAnswers((prev) => ({
                                  ...prev,
                                  [qIdx]: oIdx
                                }))
                              }
                              className={`text-left p-3 rounded-xl border text-xs font-medium transition cursor-pointer flex items-start gap-2 ${
                                isSelected
                                  ? 'border-[#0D5C3A] bg-emerald-50 text-emerald-950 font-bold'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md text-[11px] font-extrabold flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'bg-[#0D5C3A] text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-600">
                  Answered <strong>{Object.keys(examAnswers).length}</strong> of{' '}
                  <strong>{examQuestions.length}</strong> questions
                </p>
                <button
                  type="button"
                  onClick={handleSubmit40McqExam}
                  className="px-6 py-3 rounded-xl bg-[#0D5C3A] hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Submit 40-MCQ Final Exam & View Result
                </button>
              </div>
            </div>
          )}

          {/* MODE C: EXAM RESULT & CERTIFICATE PATTERN */}
          {viewMode === 'exam-result' && lastExamResult && (
            <div className="space-y-5">
              <div
                className={`rounded-2xl border-2 p-5 sm:p-6 shadow-sm space-y-3 ${
                  lastExamResult.passed
                    ? 'border-emerald-500 bg-emerald-50/60'
                    : 'border-rose-300 bg-rose-50/70'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-extrabold uppercase ${
                        lastExamResult.distinction
                          ? 'bg-amber-400 text-slate-950'
                          : lastExamResult.passed
                          ? 'bg-emerald-700 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {lastExamResult.distinction
                        ? 'PASSED WITH DISTINCTION (>= 75%)'
                        : lastExamResult.passed
                        ? 'EXAM PASSED (>= 60%)'
                        : 'NOT PASSED (< 60% REQUIRED)'}
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      Your Score: {lastExamResult.percentage}% ({lastExamResult.correctCount} /{' '}
                      {lastExamResult.totalQuestions} Correct)
                    </h3>
                    <p className="text-xs text-slate-700">
                      {lastExamResult.distinction
                        ? 'Mubarak ho! Apnay 75% say ziada marks hasil kar k Distinction Certificate qualify kar liya hy.'
                        : lastExamResult.passed
                        ? 'Mubarak ho! Apnay 60%+ marks hasil kar k International Certification qualify kar liya hy.'
                        : 'Certificate hasil karnay k liye kam az kam 60% (24 / 40) marks lazmi hain. Course modules review kar k dobara exam dain.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStart40McqExam(selectedCourse)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retake 40-MCQ Exam
                  </button>
                </div>
              </div>

              {lastExamResult.passed &&
                renderCertificatePatternCard(selectedCourse, selectedProgress)}
            </div>
          )}

          {/* MODE D: DIRECT CERTIFICATE PREVIEW */}
          {viewMode === 'certificate-preview' &&
            renderCertificatePatternCard(selectedCourse, selectedProgress)}
        </div>
      )}

      {/* ==================== RS. 1,000 CERTIFICATE PAYMENT REQUEST MODAL ==================== */}
      {certPayModalCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D5C3A]">
                  Official Certificate Issuance Request
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Pay Rs. 1,000 Certificate Fee — {certPayModalCourse.course.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Certificate ID:{' '}
                  <span className="font-mono font-bold text-slate-800">
                    {certPayModalCourse.progress.certificateNumber}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCertPayModalCourse(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Payment Account Details */}
            <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3.5 space-y-2 text-xs">
              <p className="font-extrabold text-[#0D5C3A]">
                Transfer Rs. 1,000 to any official account below & upload receipt:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                  <p className="font-bold text-slate-800">JazzCash: {paymentGatewayConfig.jazzCashNumber}</p>
                  <p className="text-[11px] text-slate-500">{paymentGatewayConfig.jazzCashTitle}</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                  <p className="font-bold text-slate-800">EasyPaisa: {paymentGatewayConfig.easyPaisaNumber}</p>
                  <p className="text-[11px] text-slate-500">{paymentGatewayConfig.easyPaisaTitle}</p>
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                <p className="font-bold text-slate-800">
                  {paymentGatewayConfig.bankName}: {paymentGatewayConfig.bankAccountOrIban}
                </p>
                <p className="text-[11px] text-slate-500">Title: {paymentGatewayConfig.bankTitle}</p>
              </div>
            </div>

            {payFeedbackMsg ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-4 space-y-3 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed">
                  {payFeedbackMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setCertPayModalCourse(null)}
                  className="px-5 py-2 rounded-xl bg-[#0D5C3A] text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitCertPayment} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Method (Rs. 1,000)
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) =>
                      setPayMethod(e.target.value as 'JazzCash' | 'EasyPaisa' | 'Bank Transfer')
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transaction ID / TID / Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={payTxId}
                    onChange={(e) => setPayTxId(e.target.value)}
                    placeholder="Enter 11-digit TID or Bank Reference..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Payment Screenshot (Optional but Recommended)
                  </label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer">
                    <Upload className="w-4 h-4 text-[#0D5C3A]" />
                    <span>{payReceiptDataUrl ? 'Receipt Image Attached ✓' : 'Select Payment Slip Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    placeholder="Sender account number or note for Admin..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCertPayModalCourse(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPay}
                    className="px-5 py-2.5 rounded-xl bg-[#0D5C3A] hover:bg-emerald-900 text-white text-xs font-extrabold shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingPay ? 'Sending to Admin...' : 'Submit Rs. 1,000 Request to Admin'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
