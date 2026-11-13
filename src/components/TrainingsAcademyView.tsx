import React, { useState, useMemo, useEffect } from 'react';
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
  CourseStudyModule,
  DEFAULT_COURSE_TEMPLATE,
  INTERNATIONAL_TRAINING_COURSES,
  InternationalTrainingCourse,
  get40CourseExamQuestions
} from '../data/internationalTrainingsData';
import {
  buildDirectCertificateVerifyUrl,
  downloadOfficialCourseCertificatePdf,
  generateQrCodeMatrix,
  getSequentialModuleList,
  resolveOfficialVerificationBaseUrl,
  stripAccreditedWord
} from '../utils/certificatePdfGenerator';
import { PERMANENT_CERTIFICATE_SIGNATURE } from '../utils/certificateSignatures';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import { preloadUserAvatarForPdf } from '../lib/pdfBranding';
import { AlisonCourseModuleViewer } from './AlisonCourseModuleViewer';
import { CertificateBundleOffersCard } from './PricingAndBundlesSection';

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
    amountRs?: number;
  }) => Promise<void>;
  onOpenUpgradeModal: () => void;
  onRequireSignIn?: () => void;
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
  onOpenUpgradeModal,
  onRequireSignIn
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'my-certificates' | 'verify-portal'>('catalog');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeModuleIdx, setActiveModuleIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'overview' | 'study' | 'exam' | 'exam-result' | 'certificate-preview'>('overview');

  // 40-Question Exam state
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

  // Rs. 1,000 Certificate Unlock Instruction & Payment Modal (2-Step Small Window)
  const [certPayModalCourse, setCertPayModalCourse] = useState<{
    course: InternationalTrainingCourse;
    progress: UserCourseProgress;
  } | null>(null);
  const [certModalStep, setCertModalStep] = useState<'instruction' | 'payment'>('instruction');
  const [payMethod, setPayMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Bank Transfer'>('Bank Transfer');
  const [payTxId, setPayTxId] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [payReceiptDataUrl, setPayReceiptDataUrl] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);
  const [payFeedbackMsg, setPayFeedbackMsg] = useState<string | null>(null);

  // Verification Portal Search State (auto-populated if user scanned QR code or opened ?verify=FSP-...)
  const [verifyQuery, setVerifyQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    return (params.get('verify') || params.get('cert') || '').trim();
  });
  const [hasSearchedVerify, setHasSearchedVerify] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return Boolean((params.get('verify') || params.get('cert') || '').trim());
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const certParam = (params.get('verify') || params.get('cert') || '').trim();
    if (certParam) {
      setActiveSubTab('verify-portal');
      setVerifyQuery(certParam);
      setHasSearchedVerify(true);
      return;
    }
    const courseParam = (params.get('course') || '').trim();
    if (courseParam) {
      const matched = INTERNATIONAL_TRAINING_COURSES.find(
        (c) =>
          c.id.toLowerCase() === courseParam.toLowerCase() ||
          c.code.toLowerCase() === courseParam.toLowerCase()
      );
      if (matched) {
        setActiveSubTab('catalog');
        setSelectedCourseId(matched.id);
        setViewMode('overview');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const existingVerify = (params.get('verify') || params.get('cert') || '').trim();
    const nextParams = new URLSearchParams();
    nextParams.set('section', 'trainings');
    if (activeSubTab === 'verify-portal') {
      nextParams.set('tab', 'verify');
      if (verifyQuery.trim()) {
        nextParams.set('verify', verifyQuery.trim());
      } else if (existingVerify) {
        nextParams.set('verify', existingVerify);
      }
    } else if (activeSubTab === 'my-certificates') {
      nextParams.set('tab', 'my-certificates');
    } else if (selectedCourseId) {
      nextParams.set('course', selectedCourseId);
    }
    try {
      window.history.replaceState(
        {},
        '',
        `${window.location.origin}${window.location.pathname}?${nextParams.toString()}`
      );
    } catch {
      // ignore
    }
  }, [selectedCourseId, activeSubTab, verifyQuery]);

  // Build active courses from Admin-managed trainings + built-in courses, respecting all Admin edits to title, price, modules, MCQs, and visibility
  const mergedCourses: InternationalTrainingCourse[] = useMemo(() => {
    const hiddenIds = new Set(
      trainings.filter((t) => t.isActive === false).map((t) => t.id)
    );
    const activeAdminTrainings = trainings.filter((t) => t.isActive !== false);
    const result: InternationalTrainingCourse[] = [];
    const seenIds = new Set<string>();

    const parseLiveCourseFeeRs = (
      tr: HubTraining,
      fallbackRs: number
    ): number => {
      if (typeof tr.certificateFeeRs === 'number' && tr.certificateFeeRs > 0) {
        return tr.certificateFeeRs;
      }
      if (tr.fees) {
        const cleaned = tr.fees.replace(/,/g, '');
        const match =
          cleaned.match(/(?:rs\.?|pkr)\s*(\d{2,7})/i) ||
          cleaned.match(/\b(\d{3,7})\b/);
        if (match && match[1]) {
          const parsed = Number(match[1]);
          if (!Number.isNaN(parsed) && parsed > 0) {
            return parsed;
          }
        }
      }
      return fallbackRs;
    };

    for (const customTr of activeAdminTrainings) {
      const rawLowerTitle = customTr.title.trim().toLowerCase();
      const isDietaryCourse =
        customTr.id === 'mgr-food-dietary-2026' ||
        rawLowerTitle === 'manager food & dietary' ||
        rawLowerTitle === 'manage food and dietary' ||
        rawLowerTitle === 'certified dietary manager';

      const baseMatch = INTERNATIONAL_TRAINING_COURSES.find(
        (b) =>
          b.id === customTr.id ||
          (isDietaryCourse && b.id === 'mgr-food-dietary-2026') ||
          b.title.trim().toLowerCase() === rawLowerTitle
      );
      const fallbackTemplate = baseMatch || DEFAULT_COURSE_TEMPLATE;
      const isLegacyDietaryTitle =
        rawLowerTitle === 'manager food & dietary' ||
        rawLowerTitle === 'manage food and dietary';
      const normalizedCourseTitle = isLegacyDietaryTitle
        ? 'Certified Dietary Manager'
        : customTr.title || baseMatch?.title || 'Certified Dietary Manager';

      const defaultFeeForCourse = isDietaryCourse
        ? 8000
        : baseMatch?.certificateFeeRs || 1000;
      const liveCourseFeeRs = parseLiveCourseFeeRs(
        customTr,
        defaultFeeForCourse
      );

      const mappedCustomModules: CourseStudyModule[] =
        customTr.customModules && customTr.customModules.length > 0
          ? customTr.customModules.map((m, idx) => {
              const richBaseMod = baseMatch?.modules.find(
                (bm, bIdx) => bm.id === m.id || bIdx === idx
              );
              const paragraphs = (m.description || '')
                .split(/\n+/)
                .map((p) => p.trim())
                .filter(Boolean);
              if (richBaseMod) {
                return {
                  ...richBaseMod,
                  id: m.id || richBaseMod.id,
                  moduleNumber: idx + 1,
                  title: m.subject || richBaseMod.title,
                  overview: m.description || richBaseMod.overview,
                  keyPrinciples:
                    paragraphs.length > 1
                      ? paragraphs
                      : richBaseMod.keyPrinciples
                };
              }
              return {
                id: m.id || `mod-${idx + 1}`,
                moduleNumber: idx + 1,
                title: m.subject || `Module ${idx + 1}`,
                estimatedMinutes: 30,
                overview:
                  m.description ||
                  `Core curriculum for ${m.subject || `Module ${idx + 1}`}.`,
                internationalClauses: [
                  `${normalizedCourseTitle} — Module ${idx + 1}: ${m.subject}`
                ],
                keyPrinciples:
                  paragraphs.length > 0
                    ? paragraphs
                    : [
                        m.description ||
                          `Core principles and operational requirements for ${m.subject}.`
                      ],
                criticalControlParameters: [
                  {
                    parameter: m.subject || `Module ${idx + 1}`,
                    standardLimit: 'Full Compliance Required',
                    correctiveProtocol:
                      m.description ||
                      'Review module study material and verify operational controls.'
                  }
                ],
                practicalChecklist:
                  paragraphs.length > 0
                    ? paragraphs
                    : [`Complete study and review of ${m.subject}`]
              };
            })
          : fallbackTemplate.modules;

      seenIds.add(customTr.id);
      if (baseMatch) seenIds.add(baseMatch.id);

      result.push({
        ...fallbackTemplate,
        id: customTr.id,
        code:
          customTr.standardCode ||
          (isDietaryCourse ? 'CDM-CERT' : baseMatch?.code || 'FSC-INT'),
        title: normalizedCourseTitle,
        accreditationStandard:
          customTr.accreditationStandard ||
          baseMatch?.accreditationStandard ||
          fallbackTemplate.accreditationStandard,
        certificateFeeRs: liveCourseFeeRs,
        levelBadge:
          customTr.subType || baseMatch?.levelBadge || 'International Certification',
        description: customTr.description || baseMatch?.description || '',
        modules: mappedCustomModules,
        duration:
          customTr.duration ||
          baseMatch?.duration ||
          `Self-Paced · ${mappedCustomModules.length} Modules`
      });
    }

    for (const baseCourse of INTERNATIONAL_TRAINING_COURSES) {
      if (!seenIds.has(baseCourse.id) && !hiddenIds.has(baseCourse.id)) {
        result.push(baseCourse);
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

  const cleanCourseProgressObj = (prog: UserCourseProgress): UserCourseProgress => {
    const cleaned: UserCourseProgress = {
      courseId: prog.courseId,
      courseTitle: prog.courseTitle,
      completedModuleIds: prog.completedModuleIds || [],
      lastModuleIndex: prog.lastModuleIndex ?? 0,
      lastAccessedAt: prog.lastAccessedAt || new Date().toISOString(),
      examPassed: Boolean(prog.examPassed),
      bestExamScore: prog.bestExamScore ?? 0,
      bestExamTotal: prog.bestExamTotal ?? 40,
      bestExamPercentage: prog.bestExamPercentage ?? 0,
      distinctionEarned: Boolean(prog.distinctionEarned),
      certificateNumber: prog.certificateNumber || '',
      certificateFeePaid: Boolean(prog.certificateFeePaid),
      certificateFeePending: Boolean(prog.certificateFeePending)
    };
    if (prog.examCompletedAt) {
      cleaned.examCompletedAt = prog.examCompletedAt;
    }
    if (prog.certificateUnlockedAt) {
      cleaned.certificateUnlockedAt = prog.certificateUnlockedAt;
    }
    return cleaned;
  };

  const saveProgressHelper = (course: InternationalTrainingCourse, updated: UserCourseProgress) => {
    const uidKey = currentUser?.uid || 'guest';
    const sanitizedUpdated = cleanCourseProgressObj(updated);
    const nextMap: Record<string, UserCourseProgress> = {};
    for (const [k, v] of Object.entries(courseProgressMap)) {
      if (v) nextMap[k] = cleanCourseProgressObj(v);
    }
    nextMap[course.id] = sanitizedUpdated;
    try {
      localStorage.setItem(`fsp_course_progress_${uidKey}`, JSON.stringify(nextMap));
      localStorage.setItem(`fsp_last_active_course_${uidKey}`, course.id);
    } catch {
      // ignore
    }
    onSaveCourseProgress(course.id, sanitizedUpdated, nextMap);
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
      ...(existing?.examCompletedAt ? { examCompletedAt: existing.examCompletedAt } : {}),
      certificateNumber:
        existing?.certificateNumber ||
        makeDeterministicCertNumber(currentUser?.uid || 'GUEST', course.code),
      certificateFeePaid: existing?.certificateFeePaid || false,
      certificateFeePending: existing?.certificateFeePending || false,
      ...(existing?.certificateUnlockedAt
        ? { certificateUnlockedAt: existing.certificateUnlockedAt }
        : {})
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
    const matchedTr = trainings.find((t) => t.id === course.id);
    const customQuestions: CourseExamMCQ[] =
      matchedTr?.customMcqs && matchedTr.customMcqs.length > 0
        ? matchedTr.customMcqs.map((q, idx) => ({
            id: q.id || `mcq-${idx + 1}`,
            questionNumber: idx + 1,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation:
              q.explanation ||
              `Correct Answer: ${q.options[q.correctIndex] || `Option ${q.correctIndex + 1}`}`
          }))
        : get40CourseExamQuestions(course.id);

    setSelectedCourseId(course.id);
    setExamQuestions(customQuestions);
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
    if (!certPayModalCourse) return;
    if (!currentUser?.uid) {
      setCertPayModalCourse(null);
      if (onRequireSignIn) onRequireSignIn();
      return;
    }
    if (!payTxId.trim()) {
      setPayFeedbackMsg('Please enter your Transaction ID / Reference Number.');
      return;
    }
    setIsSubmittingPay(true);
    setPayFeedbackMsg(null);
    try {
      const { course, progress } = certPayModalCourse;
      const certFeeRs =
        course.certificateFeeRs ||
        (course.id === 'mgr-food-dietary-2026' ||
        course.title.toLowerCase().includes('dietary')
          ? 8000
          : 1000);
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
        amountRs: certFeeRs,
        notes:
          payNotes.trim() ||
          `Certificate Unlock Fee Rs. ${certFeeRs.toLocaleString()} for ${course.title} (${certNo}) + 1 Month Free Paid Membership`
      });

      const updated: UserCourseProgress = {
        ...progress,
        certificateNumber: certNo,
        certificateFeePending: true
      };
      saveProgressHelper(course, updated);

      setPayFeedbackMsg(
        `Your Rs. ${certFeeRs.toLocaleString()} Certificate Request has been submitted to the Admin Control Panel! Upon payment confirmation and approval, your Official Portrait PDF Certificate will unlock, 1 Month of FREE Paid Membership will be activated on your account, and your certificate will be live on the Online Verification Portal.`
      );
      setPayTxId('');
      setPayNotes('');
      setPayReceiptDataUrl('');
    } catch {
      setPayFeedbackMsg('Unable to submit your request at the moment. Please try again.');
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
      courseCode: string;
      accreditationBody: string;
      issueDate: string;
      scorePercentage: number;
      distinction: boolean;
      isHolderMembershipActive: boolean;
      revokedByAdmin: boolean;
      issuedByAdminDirect?: boolean;
    }

    const recordsMap = new Map<string, VerifiedRecordItem>();

    // 1. From official certificates collection (Admin-approved & Admin Direct Issued)
    for (const cert of certificates) {
      const holderUser = users.find(
        (u) =>
          (cert.recipientUid && u.uid === cert.recipientUid) ||
          (cert.recipientEmail &&
            cert.recipientEmail.trim() !== '' &&
            u.email.trim().toLowerCase() === cert.recipientEmail.trim().toLowerCase())
      );
      const isDirectByAdmin = Boolean(
        cert.issuedBy && cert.issuedBy.toLowerCase().includes('direct')
      );
      const isHolderActive = holderUser
        ? isUserPremiumActiveFn(holderUser)
        : true;

      const matchedCourse = INTERNATIONAL_TRAINING_COURSES.find(
        (c) =>
          c.id === cert.courseId ||
          c.title.toLowerCase() === cert.trainingTitle.trim().toLowerCase()
      );

      recordsMap.set(cert.certificateNumber.toUpperCase(), {
        certificateNumber: cert.certificateNumber.toUpperCase(),
        recipientUid: cert.recipientUid || holderUser?.uid,
        recipientName: cert.recipientName || holderUser?.name || 'Certified Professional',
        recipientEmail: cert.recipientEmail || holderUser?.email || '',
        courseTitle: cert.trainingTitle,
        courseCode: matchedCourse?.code || 'FS-CERT-INTL',
        accreditationBody:
          cert.accreditationBody ||
          matchedCourse?.accreditationStandard ||
          'Codex Alimentarius & GFSI International Standard',
        issueDate: cert.issueDate,
        scorePercentage: cert.scorePercentage || 85,
        distinction: Boolean(
          cert.distinction || (cert.scorePercentage && cert.scorePercentage >= 75)
        ),
        isHolderMembershipActive: isHolderActive,
        revokedByAdmin: cert.verificationStatus === 'revoked',
        issuedByAdminDirect: isDirectByAdmin
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
            courseCode: courseObj?.code || 'FS-CERT-INTL',
            accreditationBody:
              courseObj?.accreditationStandard || 'Food Science Portal International Academy',
            issueDate: prog.certificateUnlockedAt
              ? new Date(prog.certificateUnlockedAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : prog.examCompletedAt
              ? new Date(prog.examCompletedAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }),
            scorePercentage: prog.bestExamPercentage,
            distinction: prog.distinctionEarned,
            isHolderMembershipActive: isHolderActive,
            revokedByAdmin: false,
            issuedByAdminDirect: false
          });
        }
      }
    }

    // 3. Also support direct QR code scan payload (?verify=FSP-...&name=...&course=...) if not already in map
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qrCertNo = (params.get('verify') || params.get('cert') || '')
        .trim()
        .toUpperCase();
      const qrName = (params.get('name') || '').trim();
      const qrCourse = (params.get('course') || '').trim();
      if (qrCertNo && qrCourse && !recordsMap.has(qrCertNo)) {
        const scoreNum = Number(params.get('score') || '85') || 85;
        recordsMap.set(qrCertNo, {
          certificateNumber: qrCertNo,
          recipientName: qrName || 'Certified Professional',
          recipientEmail: '',
          courseTitle: qrCourse,
          courseCode: (params.get('code') || 'FS-CERT-INTL').trim(),
          accreditationBody:
            (params.get('std') || '').trim() ||
            'Codex Alimentarius & GFSI International Standard',
          issueDate:
            (params.get('date') || '').trim() ||
            new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }),
          scorePercentage: scoreNum,
          distinction: scoreNum >= 75,
          isHolderMembershipActive: true,
          revokedByAdmin: false,
          issuedByAdminDirect: false
        });
      }
    }

    return Array.from(recordsMap.values()).filter(
      (item) =>
        item.certificateNumber.toLowerCase().includes(q) ||
        item.recipientEmail.toLowerCase().includes(q) ||
        item.recipientName.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q)
    );
  }, [verifyQuery, certificates, users, isUserPremiumActiveFn]);

  // Render Reusable Portrait Certificate Pattern Card
  const renderCertificatePatternCard = (
    course: InternationalTrainingCourse,
    progress: UserCourseProgress
  ) => {
    const hasExplicitlyExpiredMembership = Boolean(
      currentUser?.premiumExpiresAt &&
        new Date(currentUser.premiumExpiresAt).getTime() < Date.now()
    );
    const isUnlocked = Boolean(
      progress.certificateFeePaid && !hasExplicitlyExpiredMembership
    );
    const isFeePaidButMembershipExpired = Boolean(
      progress.certificateFeePaid && hasExplicitlyExpiredMembership
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
          month: 'long',
          year: 'numeric'
        })
      : new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

    const officialPortalBase = resolveOfficialVerificationBaseUrl();
    const directVerifyUrl = buildDirectCertificateVerifyUrl({
      certificateNumber: certNo,
      recipientName: holderName,
      courseTitle: course.title,
      courseCode: course.code,
      accreditationStandard: course.accreditationStandard,
      scorePercentage: scorePct,
      issueDate: issueDateStr,
      baseUrl: officialPortalBase
    });
    const shortVerifyDisplayUrl = `${officialPortalBase}/?verify=${certNo}`;
    const sequentialModules = getSequentialModuleList(
      course.modules.map((m) => m.title),
      course.title
    );
    const qrMatrix = generateQrCodeMatrix(directVerifyUrl);

    return (
      <div className="space-y-4">
        {/* Official FS Portal Portrait A4 Certificate Visual Pattern Card */}
        <div className="max-w-2xl mx-auto relative overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl flex min-h-[760px]">
          {/* Left Full-Height Royal Blue Sidebar (#1673B8) with Giant Rotated "Certificate" */}
          <div className="w-20 sm:w-32 bg-[#1673B8] shrink-0 relative overflow-hidden flex items-center justify-center select-none">
            <span
              className="text-[#105E9A] font-black tracking-tight leading-none select-none pointer-events-none"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                fontSize: 'clamp(4.6rem, 11vw, 8.2rem)'
              }}
            >
              Certificate
            </span>
          </div>

          {/* Right Main White Certificate Canvas (No background "U" watermark; strict margin containment) */}
          <div className="flex-1 min-w-0 p-4 sm:p-7 relative z-10 flex flex-col justify-between text-left overflow-hidden bg-white">
            {/* Preview Watermark if not yet unlocked */}
            {!isUnlocked && (
              <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-20 p-4">
                <span className="rotate-[-20deg] border-2 border-[#1673B8]/30 bg-white/85 px-4 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#1673B8]/60 shadow-xs text-center max-w-full break-words">
                  {isPendingAdminApproval
                    ? 'PENDING ADMIN APPROVAL · CERTIFICATE PREVIEW'
                    : 'CERTIFICATE PATTERN PREVIEW'}
                </span>
              </div>
            )}

            {/* Top Section: Brand Logo, Rosette Seal, Title, User & Training Info */}
            <div className="space-y-4 relative z-10 min-w-0">
              {/* Top Row: Large Food Science Portal Logo on Left + Blue Scalloped Rosette Seal with Ribbons on Right */}
              <div className="flex items-start justify-between gap-2.5 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-xl border-2 border-[#1673B8] bg-white p-0.5 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={FS_PORTAL_LOGO_DATA_URI}
                      alt="Food Science Portal Logo"
                      className="w-full h-full object-contain scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-lg sm:text-2xl font-black tracking-tight text-[#0C182D] flex flex-wrap items-baseline gap-1.5 leading-tight">
                      <span>Food Science</span>
                      <span className="text-[#1673B8] border-b-[3px] border-[#1673B8] pb-0.5 leading-none">
                        Portal
                      </span>
                    </div>
                    <p className="text-[10.5px] sm:text-[11px] font-semibold text-slate-600 mt-1 leading-snug break-words">
                      &ldquo;International Food Science Community&rdquo;
                    </p>
                    <p className="text-[9.5px] sm:text-[10px] font-extrabold tracking-wide text-[#1673B8] mt-0.5 break-words">
                      Official FSP verified Credential
                    </p>
                  </div>
                </div>

                {/* Blue Scalloped Rosette Seal with Two Hanging Ribbons */}
                <div className="relative flex flex-col items-center shrink-0">
                  <svg viewBox="0 0 120 145" className="w-16 h-20 sm:w-22 sm:h-26">
                    {/* Hanging Ribbons */}
                    <polygon points="36,88 54,88 48,136 39,125 28,134" fill="#1673B8" />
                    <polygon points="66,88 84,88 92,134 81,125 72,136" fill="#1673B8" />
                    {/* 12 Scallop Lobes */}
                    {Array.from({ length: 12 }).map((_, idx) => {
                      const angle = (idx / 12) * Math.PI * 2;
                      const cx = 60 + 34 * Math.cos(angle);
                      const cy = 54 + 34 * Math.sin(angle);
                      return <circle key={idx} cx={cx} cy={cy} r="12" fill="#1673B8" />;
                    })}
                    <circle cx="60" cy="54" r="36" fill="#1673B8" />
                    <circle cx="60" cy="54" r="27" fill="#FFFFFF" />
                    <text
                      x="60"
                      y="38"
                      textAnchor="middle"
                      fill="#236B9E"
                      fontSize="5.2"
                      fontWeight="800"
                      letterSpacing="0.5"
                    >
                      FOOD SCIENCE
                    </text>
                    <rect x="39" y="51" width="4" height="4" fill="#1673B8" />
                    <rect x="77" y="51" width="4" height="4" fill="#1673B8" />
                    <text
                      x="60"
                      y="59"
                      textAnchor="middle"
                      fill="#1673B8"
                      fontSize="16"
                      fontWeight="900"
                    >
                      FSP
                    </text>
                    <rect x="50" y="62" width="20" height="2.6" fill="#1673B8" />
                    <text
                      x="60"
                      y="73"
                      textAnchor="middle"
                      fill="#236B9E"
                      fontSize="6.5"
                      fontWeight="800"
                      letterSpacing="0.8"
                    >
                      CERTIFIED
                    </text>
                  </svg>
                </div>
              </div>

              {/* 1. Always "Certificate of Achievement" Heading */}
              <div className="space-y-0.5 min-w-0">
                <h3 className="text-2xl sm:text-4xl font-normal text-[#226CA3] tracking-tight leading-tight break-words">
                  Certificate
                </h3>
                <p className="text-2xl sm:text-4xl font-normal text-[#226CA3] tracking-tight leading-tight break-words">
                  of Achievement
                </p>
              </div>

              {/* 2. "This is to certify that" + Recipient Name + User Profile Picture */}
              <div className="flex items-end justify-between gap-3 border-b border-[#D8E4EE] pb-2.5 min-w-0">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-[#1C2336]">
                    This is to certify that
                  </p>
                  <p className="text-lg sm:text-2xl font-black text-[#162038] tracking-tight break-words leading-snug">
                    {holderName}
                  </p>
                </div>
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-xl border-2 border-[#1673B8] bg-[#F0F7FF] overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                  {currentUser?.profilePicUrl ? (
                    <img
                      src={currentUser.profilePicUrl}
                      alt={holderName}
                      onLoad={() => preloadUserAvatarForPdf(currentUser.profilePicUrl)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm sm:text-lg font-black text-[#1673B8]">
                      {holderName
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((p) => p.charAt(0).toUpperCase())
                        .join('') || 'FS'}
                    </span>
                  )}
                </div>
              </div>

              {/* 3. "has successfully completed" + Course Title + Sequential Modules One Below Another */}
              <div className="space-y-2 min-w-0">
                <p className="text-xs sm:text-sm text-[#1C2336]">
                  has successfully completed
                </p>
                <div className="border-b border-[#D8E4EE] pb-3 pt-0.5 space-y-2 min-w-0">
                  <h4 className="text-base sm:text-xl font-black text-[#1673B8] leading-snug break-words">
                    {stripAccreditedWord(course.title)}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-700 leading-snug break-words">
                    Course Code: <span className="text-slate-900">{course.code}</span> · Standard:{' '}
                    <span className="text-slate-900">{stripAccreditedWord(course.accreditationStandard)}</span>
                  </p>
                  <div className="pt-1 space-y-1 bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/80 min-w-0">
                    <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#1673B8]">
                      Completed Course Modules:
                    </p>
                    <ol className="space-y-1 text-[11px] text-slate-700 font-medium leading-snug">
                      {sequentialModules.map((modLine, mIdx) => (
                        <li key={mIdx} className="break-words">
                          {modLine}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* 4. 3-Column Underlined Metrics Row: Certificate No. | Awarded | Exam Score (Aligned on the exact same horizontal baseline) */}
              <div className="grid grid-cols-3 items-end gap-2 sm:gap-3 pt-2 text-center min-w-0">
                <div className="flex flex-col justify-end min-w-0 px-0.5">
                  <div className="min-h-[24px] flex items-end justify-center border-b border-[#D2DEEA] pb-1.5 text-[9.5px] sm:text-[11px] font-black text-[#162038] font-mono whitespace-nowrap overflow-hidden text-ellipsis">
                    {certNo}
                  </div>
                  <p className="text-[10px] sm:text-[10.5px] text-slate-700 mt-1 leading-tight">
                    Certificate No.
                  </p>
                </div>

                <div className="flex flex-col justify-end min-w-0 px-0.5">
                  <div className="min-h-[24px] flex items-end justify-center border-b border-[#D2DEEA] pb-1.5 text-[9.5px] sm:text-[11px] font-bold text-[#162038] whitespace-nowrap overflow-hidden text-ellipsis">
                    {issueDateStr}
                  </div>
                  <p className="text-[10px] sm:text-[10.5px] text-slate-700 mt-1 leading-tight">
                    Awarded
                  </p>
                </div>

                <div className="flex flex-col justify-end min-w-0 px-0.5">
                  <div className="min-h-[24px] flex items-end justify-center border-b border-[#D2DEEA] pb-1.5 text-[9.5px] sm:text-[10.5px] font-black text-[#1673B8] whitespace-nowrap overflow-hidden text-ellipsis">
                    {scorePct}% ({correctOutOf40}/40 · {isDistinction ? 'Distinction' : 'Passed'})
                  </div>
                  <p className="text-[10px] sm:text-[10.5px] text-slate-700 mt-1 leading-tight">
                    Exam Score
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section: Cursive Signature, "Endorsed by FS Portal", Website Verification Link & Scannable QR Code */}
            <div className="pt-5 space-y-4 relative z-10 min-w-0">
              {/* Row 1: Permanent No. 3 Intertwined MK Monogram Signature on Left + Endorsed by Food Science Portal on Right */}
              <div className="flex flex-wrap items-end justify-between gap-3 min-w-0">
                <div className="w-44 text-center shrink-0">
                  <svg
                    viewBox="0 0 190 48"
                    className="w-38 h-10 mx-auto"
                    style={{ color: PERMANENT_CERTIFICATE_SIGNATURE.inkColorHex }}
                  >
                    {PERMANENT_CERTIFICATE_SIGNATURE.svgPathsLeft.map((p, idx) => (
                      <path
                        key={idx}
                        d={p.d}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={p.strokeWidth || 2.1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </svg>
                  <div className="border-t border-[#D2DEEA] pt-1">
                    <p className="text-[10px] text-slate-700 leading-tight">
                      {PERMANENT_CERTIFICATE_SIGNATURE.signerTitleLeft}
                    </p>
                  </div>
                </div>

                {/* 7. Endorsed by + Green FOOD SCIENCE PORTAL Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-10 h-10 rounded-lg border border-[#1673B8] bg-white flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-2xs">
                    <img
                      src={FS_PORTAL_LOGO_DATA_URI}
                      alt="Food Science Portal Logo"
                      className="w-full h-full object-contain scale-105"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10.5px] font-semibold text-slate-600 leading-none">
                      Endorsed by
                    </p>
                    <div className="px-2.5 py-1 rounded bg-[#0D5C3A] text-white text-[8px] font-black uppercase tracking-wider text-center">
                      FOOD SCIENCE PORTAL
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Green Shield "Validate this certificate online at" on Left + Scannable QR Code on Right */}
              <div className="flex flex-wrap items-end justify-between gap-3 pt-1 min-w-0">
                <div className="space-y-2 flex-1 min-w-[180px]">
                  <div className="flex items-start gap-2 min-w-0">
                    {/* Shield with Green Checkmark */}
                    <svg viewBox="0 0 36 42" className="w-7 h-8 shrink-0 mt-0.5">
                      <path
                        d="M 18 2 L 33 8 L 33 21 C 33 30, 25 36, 18 40 C 11 36, 3 30, 3 21 L 3 8 Z"
                        fill="#FFFFFF"
                        stroke="#1A2138"
                        strokeWidth="2.2"
                      />
                      <path
                        d="M 11 21 L 16 26 L 26 15"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="text-xs space-y-0.5 min-w-0 flex-1">
                      <p className="font-black text-[#1A2138] leading-snug">
                        Validate this certificate online at
                      </p>
                      <a
                        href={directVerifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSubTab('verify-portal');
                          setVerifyQuery(certNo);
                          setHasSearchedVerify(true);
                        }}
                        className="text-left text-[#1673B8] hover:underline font-bold text-[10.5px] leading-snug cursor-pointer block break-all"
                      >
                        {shortVerifyDisplayUrl}
                      </a>
                      <p className="text-[10px] text-slate-600 font-medium leading-snug break-words">
                        Enter Certificate No: <strong className="font-mono text-slate-900">{certNo}</strong> on the Website Verification Portal
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 leading-snug">
                    <p>Refresher training recommended every three years</p>
                    <p>or sooner if circumstances dictate.</p>
                  </div>
                </div>

                {/* Scannable QR Code for Direct Certificate Verification */}
                <div className="flex flex-col items-center bg-white border border-slate-300 rounded-xl p-2 shadow-xs shrink-0 max-w-[112px]">
                  {qrMatrix.length > 0 && (
                    <svg
                      viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                      className="w-18 h-18 sm:w-22 sm:h-22"
                      shapeRendering="crispEdges"
                    >
                      <rect
                        width={qrMatrix.length}
                        height={qrMatrix.length}
                        fill="#FFFFFF"
                      />
                      {qrMatrix.map((row, rIdx) =>
                        row.map((cell, cIdx) =>
                          cell ? (
                            <rect
                              key={`${rIdx}-${cIdx}`}
                              x={cIdx}
                              y={rIdx}
                              width={1}
                              height={1}
                              fill="#162038"
                            />
                          ) : null
                        )
                      )}
                    </svg>
                  )}
                  <span className="text-[8px] font-black uppercase tracking-wider text-[#1673B8] mt-1">
                    Scan to Verify
                  </span>
                  <span className="text-[7.5px] font-mono font-bold text-slate-600 break-all text-center leading-tight">
                    {certNo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Action & Download Bar Below Certificate (No Rs. 1,000 Price Text Here!) */}
        <div className="rounded-2xl border border-[#D2DEEA] bg-white p-4 sm:p-5 shadow-sm space-y-3 max-w-2xl mx-auto">
          {isUnlocked ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F0F6FC] border border-[#D2DEEA] rounded-xl p-3.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#1A2138] font-extrabold text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#1673B8] shrink-0" />
                  Certificate Approved &amp; Ready for Download!
                </div>
                <p className="text-xs text-[#3D4B66]">
                  Certificate ID <span className="font-mono font-bold">{certNo}</span> is active on the Online Verification Portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  downloadOfficialCourseCertificatePdf({
                    certificateNumber: certNo,
                    recipientName: holderName,
                    recipientEmail: currentUser?.email || '',
                    recipientProfilePicUrl: currentUser?.profilePicUrl,
                    courseTitle: course.title,
                    courseCode: course.code,
                    accreditationStandard: course.accreditationStandard,
                    scorePercentage: scorePct,
                    correctCount: correctOutOf40,
                    totalQuestions: 40,
                    distinction: isDistinction,
                    issueDate: issueDateStr,
                    verificationPortalUrl: officialPortalBase,
                    syllabusModules: course.modules.map((m) => m.title),
                    issuedByMode: 'exam'
                  })
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-bold text-xs shadow-sm transition cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Certificate (PDF)
              </button>
            </div>
          ) : isFeePaidButMembershipExpired ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  Paid Membership Expired — Certificate Verification &amp; Download Paused
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your complimentary or subscribed Paid Membership period has ended. Renew your Paid Membership anytime to immediately reactivate your Portrait PDF Certificate download and live online verification on the website.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer"
              >
                Renew Paid Membership
              </button>
            </div>
          ) : isPendingAdminApproval ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                Certificate Issuance Request Sent — Waiting for Admin Approval
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Your certificate unlock request has been submitted to the Admin Control Panel. As soon as Administration approves your request, your Portrait PDF Certificate will be available for immediate download here, 1 Month of FREE Paid Membership will activate, and Certificate ID <span className="font-mono font-bold">{certNo}</span> will verify live on the website.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F0F6FC] border border-[#D2DEEA] rounded-xl p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#1A2138] font-extrabold text-sm">
                  <Award className="w-4 h-4 text-[#1673B8] shrink-0" />
                  Official Portrait PDF Certificate &amp; Online Website Verification
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click the <strong>Download Certificate</strong> button below to unlock your official Portrait PDF Certificate, receive <strong>1 Month of FREE Paid Membership</strong>, and activate live verification on the Online Verification Registry.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setPayFeedbackMsg(null);
                    setCertModalStep('instruction');
                    setCertPayModalCourse({ course, progress });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
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
      <div className="rounded-2xl bg-gradient-to-br from-[#1A2138] via-[#105E9A] to-[#1673B8] text-white p-4 sm:p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#DCE9F6]">
              <Award className="w-4 h-4 text-amber-300" />
              International Food &amp; Hospitality Certification Academy
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight">
              International Certification Trainings &amp; Live Certificate Portal
            </h1>
            <p className="text-xs text-[#EBF4FC]/90 max-w-2xl leading-relaxed">
              Official Certification Training Portal, My Earned &amp; Admin-Issued Portrait PDF Certificates, and Live Online QR/ID Verification Registry.
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
                  ? 'bg-white text-[#1673B8] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Training Courses
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('my-certificates');
                setSelectedCourseId(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeSubTab === 'my-certificates'
                  ? 'bg-white text-[#1673B8] shadow-sm'
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
        <div className="rounded-2xl border border-[#D2DEEA] bg-white p-5 sm:p-6 shadow-sm space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1673B8]">
              <ShieldCheck className="w-4 h-4" />
              Official Online Certificate Verification Registry
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#1A2138]">
              Verify Single or All Member &amp; Admin-Issued Certificates Live
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter a Certificate ID (e.g. <span className="font-mono font-bold text-slate-800">FSP-...</span>), Recipient Email, Full Name, or Course Title to verify any certificate issued via course examination or direct administration issuance.
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
                placeholder="Enter Certificate Number (e.g. FSP-...), Recipient Name, Email, or Topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D2DEEA] text-sm focus:outline-none focus:border-[#1673B8]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-bold text-xs cursor-pointer shrink-0"
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
                      This Certificate ID has not yet been approved by Administration or the entered verification code is invalid.
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

                  // STRICT MEMBERSHIP RULE: If holder's Paid Membership expired, hide certificate details!
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
                          Certificate ID <span className="font-mono font-bold">{rec.certificateNumber}</span> is registered in our system, but the holder&apos;s <strong>Paid Membership</strong> (including their complimentary 1-Month or 1-Year membership period) has expired. In accordance with Food Science Portal policy, live online certificate verification and credential details are displayed only while the holder maintains an active Paid Membership. Once the member renews their Paid Membership, live verification is restored automatically.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={rec.certificateNumber}
                      className="rounded-2xl border-2 border-[#1673B8]/60 bg-[#F0F6FC] p-5 space-y-3 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1673B8] text-white text-xs font-extrabold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-amber-300" />
                            Verified &amp; Active Credential
                          </span>
                          {rec.distinction && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-xs font-extrabold">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              Passed with Distinction ({rec.scorePercentage}%)
                            </span>
                          )}
                          {rec.issuedByAdminDirect && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EBF4FC] border border-[#1673B8]/30 text-[#105E9A] text-[11px] font-extrabold">
                              Direct Executive Issuance
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-black text-[#1A2138] bg-white px-3 py-1 rounded-lg border border-[#D2DEEA]">
                          ID: {rec.certificateNumber}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-center">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Certified Professional</p>
                          <p className="font-black text-[#1A2138] text-sm">{rec.recipientName}</p>
                          {rec.recipientEmail && (
                            <p className="text-slate-500">{rec.recipientEmail}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Certification Title / Topic</p>
                          <p className="font-black text-[#1673B8] text-sm">{rec.courseTitle}</p>
                          <p className="text-slate-500">{rec.accreditationBody}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">Standing &amp; Status</p>
                          <p className="font-bold text-[#1A2138]">
                            Score: {rec.scorePercentage}% ({rec.distinction ? 'Distinction' : 'Passed'})
                          </p>
                          <p className="text-[#1673B8] font-bold">
                            Issued: {rec.issueDate} · Verified Live
                          </p>
                        </div>
                        <div className="flex sm:justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const matched = INTERNATIONAL_TRAINING_COURSES.find(
                                (c) =>
                                  c.title.toLowerCase() === rec.courseTitle.trim().toLowerCase()
                              );
                              const matchedHolderUser = users.find(
                                (u) =>
                                  (rec.recipientEmail &&
                                    u.email?.trim().toLowerCase() ===
                                      rec.recipientEmail.trim().toLowerCase()) ||
                                  u.name?.trim().toLowerCase() ===
                                    rec.recipientName.trim().toLowerCase()
                              );
                              downloadOfficialCourseCertificatePdf({
                                certificateNumber: rec.certificateNumber,
                                recipientName: rec.recipientName,
                                recipientEmail: rec.recipientEmail,
                                recipientProfilePicUrl:
                                  matchedHolderUser?.profilePicUrl ||
                                  currentUser?.profilePicUrl,
                                courseTitle: rec.courseTitle,
                                courseCode: rec.courseCode || matched?.code || 'FS-CERT-INTL',
                                accreditationStandard: rec.accreditationBody,
                                scorePercentage: rec.scorePercentage,
                                correctCount: Math.round((rec.scorePercentage / 100) * 40),
                                totalQuestions: 40,
                                distinction: rec.distinction,
                                issueDate: rec.issueDate,
                                verificationPortalUrl: resolveOfficialVerificationBaseUrl(),
                                syllabusModules: matched?.modules.map((m) => m.title),
                                issuedByMode: rec.issuedByAdminDirect ? 'admin_direct' : 'exam'
                              });
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-bold text-xs shadow-xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Portrait PDF
                          </button>
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
          <div className="rounded-2xl border border-[#D2DEEA] bg-white p-5 shadow-sm">
            <h2 className="text-base sm:text-lg font-black text-[#1A2138]">
              My Earned &amp; Admin-Issued Portrait Certificates
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Courses where you scored 60%+ on the 40-MCQ Final Exam or certificates directly issued to your account by Administration appear below in Portrait A4 format.
            </p>
          </div>

          {/* Direct Admin-Issued Certificates for Current User */}
          {currentUser &&
            certificates.filter(
              (c) =>
                c.verificationStatus === 'valid' &&
                ((c.recipientUid && c.recipientUid === currentUser.uid) ||
                  (c.recipientEmail &&
                    c.recipientEmail.trim().toLowerCase() ===
                      currentUser.email.trim().toLowerCase()))
            ).length > 0 && (
              <div className="space-y-3">
                {certificates
                  .filter(
                    (c) =>
                      c.verificationStatus === 'valid' &&
                      ((c.recipientUid && c.recipientUid === currentUser.uid) ||
                        (c.recipientEmail &&
                          c.recipientEmail.trim().toLowerCase() ===
                            currentUser.email.trim().toLowerCase()))
                  )
                  .map((cert) => {
                    const matched = INTERNATIONAL_TRAINING_COURSES.find(
                      (c) =>
                        c.id === cert.courseId ||
                        c.title.toLowerCase() === cert.trainingTitle.trim().toLowerCase()
                    );
                    const scorePct = cert.scorePercentage || 85;
                    const isDist = Boolean(cert.distinction || scorePct >= 75);
                    return (
                      <div
                        key={cert.id}
                        className="rounded-2xl border-2 border-[#1673B8]/40 bg-[#F0F6FC] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#1673B8] text-white text-[10px] font-black uppercase tracking-wider">
                              Official Issued Credential · {cert.certificateNumber}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-extrabold">
                              {isDist ? `Distinction (${scorePct}%)` : `Passed (${scorePct}%)`}
                            </span>
                          </div>
                          <h4 className="text-base font-black text-[#1A2138]">
                            {cert.trainingTitle}
                          </h4>
                          <p className="text-xs text-slate-600">
                            Recipient: <strong className="text-[#1A2138]">{cert.recipientName}</strong> · Issued: {cert.issueDate} · Standard:{' '}
                            {cert.accreditationBody ||
                              matched?.accreditationStandard ||
                              'Codex Alimentarius & GFSI Standard'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            downloadOfficialCourseCertificatePdf({
                              certificateNumber: cert.certificateNumber,
                              recipientName: cert.recipientName,
                              recipientEmail: cert.recipientEmail || currentUser.email,
                              recipientProfilePicUrl: currentUser.profilePicUrl,
                              courseTitle: cert.trainingTitle,
                              courseCode: matched?.code || 'FS-CERT-INTL',
                              accreditationStandard:
                                cert.accreditationBody ||
                                matched?.accreditationStandard ||
                                'Codex Alimentarius & GFSI International Standard',
                              scorePercentage: scorePct,
                              correctCount: Math.round((scorePct / 100) * 40),
                              totalQuestions: 40,
                              distinction: isDist,
                              issueDate: cert.issueDate,
                              verificationPortalUrl: resolveOfficialVerificationBaseUrl(),
                              syllabusModules: matched?.modules.map((m) => m.title),
                              issuedByMode: 'admin_direct'
                            })
                          }
                          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-bold text-xs shadow-sm cursor-pointer shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          Download Portrait PDF Certificate
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}

          {mergedCourses.filter((c) => courseProgressMap[c.id]?.examPassed).length === 0 ? (
            <div className="rounded-2xl border border-[#D2DEEA] bg-white p-8 text-center space-y-3">
              <Award className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-[#1A2138]">
                Course exam certificates appear here once you pass any 40-MCQ Final Exam (60%+).
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Complete the 05 study modules of any training course and pass the 40-MCQ Final Exam. Scoring 60% or higher qualifies for a Pass Certificate, and scoring 75% or higher qualifies for a Distinction Certificate in Portrait A4 PDF format.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('catalog')}
                className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-bold cursor-pointer"
              >
                Browse Training Courses
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
            <div className="rounded-2xl border-2 border-[#1673B8]/30 bg-[#F0F6FC] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#1673B8]">
                  <PlayCircle className="w-4 h-4" />
                  Continue Where You Left Off
                </div>
                <h3 className="text-base font-black text-[#1A2138]">
                  {lastInProgressCourse.course.title}
                </h3>
                <p className="text-xs text-slate-600">
                  Resume at{' '}
                  <span className="font-bold text-[#1A2138]">
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
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-bold text-xs shadow-sm transition cursor-pointer shrink-0"
              >
                <PlayCircle className="w-4 h-4" />
                Resume Module {lastInProgressCourse.progress.lastModuleIndex + 1}
              </button>
            </div>
          )}

          {/* Certification Courses Grid */}
          {mergedCourses.length === 0 ? (
            <div className="rounded-2xl border border-[#D2DEEA] bg-white p-8 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#1A2138]">
                No Active Training Courses Published Yet
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                New professional Food Safety, HACCP, ISO 22000 &amp; FSSC 22000 certification courses are being prepared and will appear here as they are published. You can still verify or download your issued certificates anytime using the tabs above.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('verify-portal')}
                  className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer transition-colors"
                >
                  Verify Certificate Online
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('my-certificates')}
                  className="px-4 py-2 rounded-xl bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1A2138] text-xs font-extrabold cursor-pointer transition-colors"
                >
                  View My Certificates
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Certificate Bundle Offers Card Inside Trainings Academy */}
              <CertificateBundleOffersCard
                courses={mergedCourses}
                paymentGatewayConfig={paymentGatewayConfig}
                isGuest={!currentUser?.uid}
                onRequireSignIn={onRequireSignIn}
                onSubmitBundleRequest={async ({
                  bundle,
                  selectedCourses,
                  paymentMethod,
                  transactionId,
                  receiptImageUrl,
                  notes
                }) => {
                  const firstCourse =
                    selectedCourses[0] || mergedCourses[0] || INTERNATIONAL_TRAINING_COURSES[0];
                  const courseNames = selectedCourses
                    .map((c) => `${c.title} (${c.code})`)
                    .join(', ');
                  const certNo = makeDeterministicCertNumber(
                    currentUser?.uid || 'GUEST',
                    firstCourse.code
                  );
                  await onSubmitCertificatePaymentRequest({
                    courseId: firstCourse.id,
                    courseTitle: `${bundle.title}: ${courseNames}`,
                    certificateNumber: certNo,
                    scorePercentage: 80,
                    distinction: true,
                    paymentMethod,
                    transactionId,
                    receiptImageUrl,
                    amountRs: bundle.priceRs,
                    notes: `${bundle.title} (Rs. ${bundle.priceRs.toLocaleString()}) — Courses: ${courseNames}${notes ? ` | Note: ${notes}` : ''}`
                  });
                }}
              />

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
                    className="rounded-2xl border border-[#D2DEEA] bg-white p-5 shadow-sm hover:shadow-md hover:border-[#1673B8]/50 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] text-[10px] font-extrabold uppercase tracking-wider">
                          #{idx + 1} · {course.code} · {course.levelBadge}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold">
                            Free Study &amp; Exam · Cert: Rs.{' '}
                            {(course.certificateFeeRs || 1000).toLocaleString()}
                          </span>
                          {prog?.examPassed && (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                                prog.distinctionEarned
                                  ? 'bg-amber-100 border border-amber-400 text-amber-900'
                                  : 'bg-[#EBF4FC] border border-[#1673B8]/35 text-[#105E9A]'
                              }`}
                            >
                              <Award className="w-3 h-3" />
                              {prog.distinctionEarned
                                ? `Distinction (${prog.bestExamPercentage}%)`
                                : `Passed (${prog.bestExamPercentage}%)`}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-[#1A2138] leading-snug">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {course.description}
                      </p>

                      <div className="text-[11px] text-slate-500 font-medium space-y-1 pt-1">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#1673B8]" />
                          <span>{course.accreditationStandard}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#1673B8]" />
                          <span>
                            {course.duration} · {course.totalExamQuestions}-MCQ Final Exam · Online Verifiable Certificate
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
                          <span className="text-[#1673B8]">{pctMods}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-[#1673B8] transition-all duration-300"
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
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-bold text-xs transition cursor-pointer"
                        >
                          <PlayCircle className="w-4 h-4" />
                          {hasStarted
                            ? `Continue Study (Mod ${resumeModNum}/${totalMods})`
                            : 'Start Course Study'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStart40McqExam(course)}
                          className="px-3.5 py-2.5 rounded-xl border border-[#1673B8] text-[#1673B8] hover:bg-[#F0F6FC] font-bold text-xs transition cursor-pointer"
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
        </div>
      )}

      {/* ==================== SELECTED COURSE: STUDY MODULES / 40-MCQ EXAM / CERTIFICATE ==================== */}
      {activeSubTab === 'catalog' && selectedCourse && selectedProgress && (
        <div className="space-y-5">
          {/* Course Top Bar */}
          <div className="rounded-2xl border border-[#D2DEEA] bg-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCourseId(null);
                  setViewMode('overview');
                }}
                className="text-xs font-extrabold text-[#1673B8] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                ← Back to All Courses
              </button>
              <h2 className="text-lg sm:text-xl font-black text-[#1A2138]">
                {selectedCourse.title}{' '}
                <span className="text-xs font-bold text-slate-500">
                  ({selectedCourse.code})
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {selectedCourse.accreditationStandard}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('study')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                  viewMode === 'study'
                    ? 'bg-[#1673B8] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Study Modules ({selectedProgress.completedModuleIds.length}/
                {selectedCourse.modules.length})
              </button>
              <button
                type="button"
                onClick={() => handleStart40McqExam(selectedCourse)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                  viewMode === 'exam' || viewMode === 'exam-result'
                    ? 'bg-[#1673B8] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                40-MCQ Final Exam
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
                  Certificate Preview
                </button>
              )}
            </div>
          </div>

          {/* MODE A: MODULE STUDY VIEW WITH RESUME TRACKING */}
          {viewMode === 'study' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Module List Sidebar */}
              <div className="lg:col-span-4 rounded-2xl border border-[#D2DEEA] bg-white p-4 shadow-sm space-y-2.5 h-fit">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Course Curriculum (5 Modules)
                  </span>
                  <span className="text-xs font-bold text-[#1673B8]">
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
                            ? 'border-[#1673B8] bg-[#F0F6FC]'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#1673B8]" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-400 text-[10px] font-bold flex items-center justify-center text-slate-600">
                              {mod.moduleNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-[#1A2138] leading-snug">
                            {mod.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {mod.presentationSlides?.length
                              ? `${mod.presentationSlides.length} Slides · `
                              : ''}
                            {mod.estimatedMinutes} mins ·{' '}
                            {isCompleted
                              ? 'Completed'
                              : isCurrent
                              ? 'Viewing Slides Now'
                              : 'Pending'}
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

              {/* Right Active Module Study Content (Comprehensive Alison.com Professional View) */}
              <div className="lg:col-span-8">
                {(() => {
                  const mod =
                    selectedCourse.modules[activeModuleIdx] ||
                    selectedCourse.modules[0];
                  const isModCompleted =
                    selectedProgress.completedModuleIds.includes(mod.id);
                  return (
                    <AlisonCourseModuleViewer
                      course={selectedCourse}
                      module={mod}
                      moduleIndex={activeModuleIdx}
                      totalModules={selectedCourse.modules.length}
                      isCompleted={isModCompleted}
                      onSelectprev={() =>
                        handleSelectModule(Math.max(0, activeModuleIdx - 1))
                      }
                      onCompleteAndNext={handleMarkModuleCompleteAndNext}
                      onCompleteAndStartExam={() => {
                        handleMarkModuleCompleteAndNext();
                        handleStart40McqExam(selectedCourse);
                      }}
                    />
                  );
                })()}
              </div>
            </div>
          )}

          {/* MODE B: 40-QUESTION INTERNATIONAL CERTIFICATION EXAM */}
          {viewMode === 'exam' && (
            <div className="rounded-2xl border border-[#D2DEEA] bg-white p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1673B8]">
                    40 Multiple-Choice Questions · Certification Exam
                  </span>
                  <h3 className="text-lg font-black text-[#1A2138]">
                    {selectedCourse.title} — Final Exam
                  </h3>
                  <p className="text-xs text-slate-600">
                    Answer all 40 questions below and click <strong>Submit &amp; Grade Exam</strong>.
                  </p>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-xs font-extrabold text-[#1673B8] shrink-0">
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
                      <p className="text-xs sm:text-sm font-bold text-[#1A2138] leading-relaxed">
                        <span className="text-[#1673B8] font-black mr-1.5">
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
                                  ? 'border-[#1673B8] bg-[#F0F6FC] text-[#1A2138] font-bold ring-2 ring-[#1673B8]/20'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md text-[11px] font-extrabold flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'bg-[#1673B8] text-white'
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
                  className="px-6 py-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Submit &amp; Grade Exam ({examQuestions.length} MCQs)
                </button>
              </div>
            </div>
          )}

          {/* MODE C: EXAM RESULT, CERTIFICATE PATTERN & DETAILED ANSWER EXPLANATIONS */}
          {viewMode === 'exam-result' && lastExamResult && (
            <div className="space-y-5">
              <div
                className={`rounded-2xl border-2 p-5 sm:p-6 shadow-sm space-y-3 ${
                  lastExamResult.passed
                    ? 'border-[#1673B8] bg-[#F0F6FC]'
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
                          ? 'bg-[#1673B8] text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {lastExamResult.distinction
                        ? 'PASSED WITH DISTINCTION (>= 75%)'
                        : lastExamResult.passed
                        ? 'EXAM PASSED (>= 60%)'
                        : 'NOT PASSED (< 60% REQUIRED)'}
                    </span>
                    <h3 className="text-xl font-black text-[#1A2138]">
                      Your Score: {lastExamResult.percentage}% ({lastExamResult.correctCount} /{' '}
                      {lastExamResult.totalQuestions} Correct)
                    </h3>
                    <p className="text-xs text-slate-700">
                      {lastExamResult.distinction
                        ? 'Congratulations! You scored 75% or higher and qualified for an Official Certificate with Distinction.'
                        : lastExamResult.passed
                        ? 'Congratulations! You have passed the Final Exam and qualified for your International Certification.'
                        : 'A minimum score of 60% is required to qualify for a certificate. Review the detailed explanations below and retake the exam anytime for free.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStart40McqExam(selectedCourse)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retake Exam
                  </button>
                </div>
              </div>

              {lastExamResult.passed &&
                renderCertificatePatternCard(selectedCourse, selectedProgress)}

              {/* Graded Question-by-Question Review & Technical Explanations */}
              <div className="rounded-2xl border border-[#D2DEEA] bg-white p-5 shadow-xs space-y-4">
                <h4 className="text-sm sm:text-base font-black text-[#1A2138] border-b border-[#D2DEEA] pb-2.5">
                  Graded Exam Review &amp; Detailed Technical Explanations (1–{examQuestions.length})
                </h4>
                <div className="space-y-3">
                  {examQuestions.map((q, qIdx) => {
                    const selected = examAnswers[qIdx];
                    const isCorrect = selected === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                      >
                        <p className="font-bold text-[#1A2138]">
                          Q{q.questionNumber}. {q.question}
                        </p>
                        <p className="text-slate-600">
                          Your Answer:{' '}
                          <strong
                            className={
                              isCorrect ? 'text-[#1673B8]' : 'text-rose-700'
                            }
                          >
                            {selected !== undefined
                              ? `${String.fromCharCode(65 + selected)}. ${q.options[selected]}`
                              : 'Not Answered'}
                          </strong>
                        </p>
                        <div
                          className={`p-3 rounded-lg border ${
                            isCorrect
                              ? 'bg-[#F0F6FC] border-[#1673B8]/40 text-[#1A2138]'
                              : 'bg-rose-50 border-rose-300 text-rose-950'
                          }`}
                        >
                          <strong>
                            {isCorrect
                              ? '✓ Correct! '
                              : `✗ Incorrect (Correct Answer: Option ${String.fromCharCode(65 + q.correctIndex)} — ${q.options[q.correctIndex]}): `}
                          </strong>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MODE D: DIRECT CERTIFICATE PREVIEW */}
          {viewMode === 'certificate-preview' &&
            renderCertificatePatternCard(selectedCourse, selectedProgress)}
        </div>
      )}

      {/* ==================== SMALL INSTRUCTION WINDOW -> PAYMENT OPTION MODAL ON "DOWNLOAD CERTIFICATE" CLICK ==================== */}
      {certPayModalCourse && (
        <div className="fixed inset-0 z-50 bg-[#1A2138]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#D2DEEA] space-y-4 my-8">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1673B8]">
                  {certModalStep === 'instruction'
                    ? 'Certificate Download Instructions'
                    : 'Certificate Payment & Screenshot Submission'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#1A2138] mt-0.5">
                  {certPayModalCourse.course.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Certificate Number:{' '}
                  <span className="font-mono font-bold text-[#1A2138]">
                    {certPayModalCourse.progress.certificateNumber ||
                      makeDeterministicCertNumber(
                        currentUser?.uid || 'GUEST',
                        certPayModalCourse.course.code
                      )}
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

            {payFeedbackMsg ? (
              <div className="rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] p-4 space-y-3 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#1673B8] mx-auto" />
                <p className="text-xs sm:text-sm font-bold text-[#1A2138] leading-relaxed">
                  {payFeedbackMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setCertPayModalCourse(null)}
                  className="px-5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : certModalStep === 'instruction' ? (
              /* STEP 1: SMALL INSTRUCTION WINDOW WHEN USER CLICKS "DOWNLOAD CERTIFICATE" */
              (() => {
                const modalCertFeeRs =
                  certPayModalCourse.course.certificateFeeRs ||
                  (certPayModalCourse.course.id === 'mgr-food-dietary-2026' ||
                  certPayModalCourse.course.title.toLowerCase().includes('dietary')
                    ? 8000
                    : 1000);
                return (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] p-4 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black uppercase tracking-wider text-[#1673B8]">
                          Certificate Issuance Fee
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#1673B8] text-white font-black text-xs">
                          Rs. {modalCertFeeRs.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#1A2138] leading-relaxed">
                        A certificate issuance fee of{' '}
                        <strong>Rs. {modalCertFeeRs.toLocaleString()}</strong> applies to download your official{' '}
                        <strong>Portrait PDF Certificate</strong> for{' '}
                        <strong>{certPayModalCourse.course.title}</strong> and activate live verification on the{' '}
                        <strong>Online Verification Portal</strong>.
                      </p>
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-[11px]">
                        🎁 <strong>Complimentary Membership Bonus:</strong> Unlocking 1 Certificate automatically grants you <strong>1 Month of FREE Paid Membership</strong>! (Unlocking the All-13 Certificates Bundle grants <strong>1 Full Year of FREE Paid Membership</strong>). After your complimentary period, active Paid Membership is required to keep online certificate verification active.
                      </div>
                      <ul className="space-y-1 text-slate-700 font-medium pt-1">
                        <li>1. Click <strong>Proceed to Payment Option</strong> below.</li>
                        <li>2. Transfer the Rs. {modalCertFeeRs.toLocaleString()} fee and upload your payment screenshot.</li>
                        <li>3. Once approved in the Admin Control Panel, your PDF Certificate and 1-Month Paid Membership will unlock immediately.</li>
                      </ul>
                    </div>

                    {!currentUser?.uid && (
                      <div className="rounded-xl bg-amber-50 border-2 border-amber-400 p-3.5 space-y-2 text-xs text-[#1A2138]">
                        <div className="font-extrabold text-amber-900">
                          ⚠️ User Registration &amp; Login Mandatory for Official Certificates
                        </div>
                        <p className="text-[11.5px] text-amber-800 leading-relaxed">
                          Course study and the 40-MCQ exam are 100% free without registration. However, to issue and verify your Official Portrait PDF Certificate, please register / sign in to your account first.
                        </p>
                        {onRequireSignIn && (
                          <button
                            type="button"
                            onClick={() => {
                              setCertPayModalCourse(null);
                              onRequireSignIn();
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#0C182D] hover:bg-[#1673B8] text-white font-extrabold text-xs cursor-pointer transition-colors"
                          >
                            Sign In / Register Free Account First →
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setCertPayModalCourse(null)}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser?.uid && onRequireSignIn) {
                            setCertPayModalCourse(null);
                            onRequireSignIn();
                            return;
                          }
                          setCertModalStep('payment');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>
                          {!currentUser?.uid
                            ? 'Register / Sign In to Unlock Certificate →'
                            : `Proceed to Payment Option (Rs. ${modalCertFeeRs.toLocaleString()}) →`}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* STEP 2: PAYMENT OPTION & SCREENSHOT UPLOAD TO ADMIN */
              (() => {
                const modalCertFeeRs =
                  certPayModalCourse.course.certificateFeeRs ||
                  (certPayModalCourse.course.id === 'mgr-food-dietary-2026' ||
                  certPayModalCourse.course.title.toLowerCase().includes('dietary')
                    ? 8000
                    : 1000);
                return (
                  <div className="space-y-3.5">
                    <div className="rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] p-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-extrabold text-[#1673B8]">
                          Transfer Rs. {modalCertFeeRs.toLocaleString()} &amp; Upload Payment Screenshot:
                        </p>
                        <button
                          type="button"
                          onClick={() => setCertModalStep('instruction')}
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                        >
                          ← Back
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-lg border border-[#D2DEEA]">
                          <p className="font-bold text-[#1A2138]">
                            JazzCash: {paymentGatewayConfig.jazzCashNumber}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {paymentGatewayConfig.jazzCashTitle}
                          </p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-[#D2DEEA]">
                          <p className="font-bold text-[#1A2138]">
                            EasyPaisa: {paymentGatewayConfig.easyPaisaNumber}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {paymentGatewayConfig.easyPaisaTitle}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-[#D2DEEA]">
                        <p className="font-bold text-[#1A2138]">
                          {paymentGatewayConfig.bankName}: {paymentGatewayConfig.bankAccountOrIban}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Title: {paymentGatewayConfig.bankTitle}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmitCertPayment} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Select Payment Method (Rs. {modalCertFeeRs.toLocaleString()})
                        </label>
                        <select
                          value={payMethod}
                          onChange={(e) =>
                            setPayMethod(
                              e.target.value as 'JazzCash' | 'EasyPaisa' | 'Bank Transfer'
                            )
                          }
                          className="w-full px-3 py-2 rounded-xl border border-[#D2DEEA] text-xs font-semibold focus:outline-none focus:border-[#1673B8]"
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
                          className="w-full px-3 py-2 rounded-xl border border-[#D2DEEA] text-xs focus:outline-none focus:border-[#1673B8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Upload Payment Screenshot *
                        </label>
                        <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[#D2DEEA] bg-[#F0F6FC] hover:bg-[#EBF4FC] text-xs font-semibold text-[#1A2138] cursor-pointer">
                          <Upload className="w-4 h-4 text-[#1673B8]" />
                          <span>
                            {payReceiptDataUrl
                              ? 'Payment Screenshot Attached ✓'
                              : 'Select Payment Screenshot Image'}
                          </span>
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
                          className="w-full px-3 py-2 rounded-xl border border-[#D2DEEA] text-xs focus:outline-none focus:border-[#1673B8]"
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
                          className="px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingPay
                            ? 'Sending to Admin...'
                            : 'Submit Payment & Screenshot to Admin'}
                        </button>
                      </div>
                    </form>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
};
