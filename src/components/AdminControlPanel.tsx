import React, { useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  Database,
  Download,
  DollarSign,
  Eye,
  ExternalLink,
  FileText,
  GraduationCap,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
  X
} from 'lucide-react';
import {
  CloudStorageConfig,
  CustomTrainingMCQ,
  CustomTrainingModule,
  HubCertificate,
  HubJob,
  HubPaymentRequest,
  HubScholarship,
  HubTraining,
  HubUser
} from '../types/hub';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import { INTERNATIONAL_TRAINING_COURSES } from '../data/internationalTrainingsData';
import {
  downloadOfficialCourseCertificatePdf,
  resolveOfficialVerificationBaseUrl
} from '../utils/certificatePdfGenerator';

export type AdminSectionTab =
  | 'menu'
  | 'overview'
  | 'users'
  | 'jobs'
  | 'scholarships'
  | 'certificates'
  | 'trainings'
  | 'payments'
  | 'storage';

interface AdminControlPanelProps {
  adminEmail: string;
  users: HubUser[];
  paymentRequests: HubPaymentRequest[];
  jobs: HubJob[];
  scholarships: HubScholarship[];
  trainings: HubTraining[];
  storageConfig: CloudStorageConfig;
  adminStatusBanner: string | null;
  onClearBanner: () => void;
  onSetBanner: (msg: string) => void;
  onVerifyPayment: (
    req: HubPaymentRequest,
    decision: 'verified' | 'rejected'
  ) => Promise<void>;
  onDeletePaymentRequest: (reqId: string) => Promise<void>;
  onToggleUserPremium: (
    user: HubUser,
    makePremium: boolean
  ) => Promise<void>;
  onDeleteUser: (uid: string, userName: string) => Promise<void>;
  onQuickPasteJob: (rawText: string, category: string) => Promise<void>;
  onDeleteJob: (job: HubJob) => Promise<void>;
  onQuickPasteScholarship: (
    rawText: string,
    fundingType: 'Fellowships' | 'International' | 'Grants'
  ) => Promise<void>;
  onDeleteScholarship: (sch: HubScholarship) => Promise<void>;
  onSaveTraining: (training: HubTraining) => Promise<void>;
  onDeleteTraining: (training: HubTraining) => Promise<void>;
  certificates?: HubCertificate[];
  onAdminDirectIssueCertificate?: (cert: HubCertificate) => Promise<void>;
  onDeleteCertificate?: (certId: string) => Promise<void>;
  onChangeStorageConfig: (cfg: CloudStorageConfig) => void;
  onSaveStorageConfig: (e: React.FormEvent) => Promise<void>;
  onExportBackup: () => void;
  onPreviewUserApp: () => void;
  onSignOut: () => void;
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({
  users,
  paymentRequests,
  jobs,
  scholarships,
  trainings,
  storageConfig,
  adminStatusBanner,
  onClearBanner,
  onSetBanner,
  onVerifyPayment,
  onDeletePaymentRequest,
  onToggleUserPremium,
  onDeleteUser,
  onQuickPasteJob,
  onDeleteJob,
  onQuickPasteScholarship,
  onDeleteScholarship,
  onSaveTraining,
  onDeleteTraining,
  certificates = [],
  onAdminDirectIssueCertificate,
  onDeleteCertificate,
  onChangeStorageConfig,
  onSaveStorageConfig,
  onExportBackup,
  onPreviewUserApp,
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<AdminSectionTab>('menu');

  // Users & Approvals Filter State
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<
    'all' | 'premium' | 'pending' | 'free' | 'cv'
  >('all');
  const [expandedUserUid, setExpandedUserUid] = useState<string | null>(null);
  const [confirmDeleteUid, setConfirmDeleteUid] = useState<string | null>(null);

  // 1-Box Job Paste & Dynamic/Custom Tag State
  const [jobPasteText, setJobPasteText] = useState('');
  const [jobCategory, setJobCategory] = useState<string>('Quality & Safety');
  const [customJobTagInput, setCustomJobTagInput] = useState<string>('');
  const [customCreatedJobTags, setCustomCreatedJobTags] = useState<string[]>([
    'QA/QC',
    'Food Safety',
    'Dairy',
    'Bakery',
    'Microbiology',
    'Halal & Auditing',
    'Nutrition'
  ]);
  const [useAutoTitleTag, setUseAutoTitleTag] = useState<boolean>(true);
  const [jobFilterCat, setJobFilterCat] = useState<string>('All');
  const [isPostingJob, setIsPostingJob] = useState(false);

  // Auto-calculate 25% OFF on Yearly Fee when Admin changes Monthly Fee
  const [autoApply25PctYearly, setAutoApply25PctYearly] =
    useState<boolean>(true);

  // Live Membership Fee & Auto-Calculated Discount Percentage
  const liveMonthlyFee =
    Number(storageConfig.paymentGateway?.monthlyFeeRs) || 100;
  const liveYearlyFee =
    Number(storageConfig.paymentGateway?.yearlyFeeRs) || 900;
  const fullYearBaseFee = liveMonthlyFee * 12;
  const liveYearlySavingsRs = Math.max(0, fullYearBaseFee - liveYearlyFee);
  const liveYearlyDiscountPct =
    fullYearBaseFee > 0
      ? Math.max(
          0,
          Math.round(((fullYearBaseFee - liveYearlyFee) / fullYearBaseFee) * 100)
        )
      : 25;

  // Smart helper: Extract a clean tag automatically from the Job Title (1st line of pasted job)
  const extractAutoTagFromJobText = (rawText: string): string => {
    const firstNonEmpty = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find(Boolean);
    if (!firstNonEmpty) return '';
    const cleaned = firstNonEmpty
      .replace(/^[•*#\-–—\s]+/, '')
      .replace(/^(?:job\s*title|position|role|vacancy|hiring)\s*[:\-]\s*/i, '')
      .trim();
    // Split before company/location separators like "—", " - ", " | ", " @ ", " at ", " ("
    const titlePart = cleaned
      .split(/\s+(?:—|-|\||@|at)\s+|\s*\(/i)[0]
      ?.trim();
    if (!titlePart) return '';
    return titlePart.slice(0, 42);
  };

  const autoDetectedJobTitleTag = useMemo(
    () => extractAutoTagFromJobText(jobPasteText),
    [jobPasteText]
  );

  // All available job tags (Preset + Auto-Detected from Job Title + Custom Created + Existing Job Categories)
  const allAvailableJobTags = useMemo(() => {
    const base = [
      'Quality & Safety',
      'R&D Lab',
      'Production',
      ...customCreatedJobTags
    ];
    if (autoDetectedJobTitleTag) {
      base.unshift(autoDetectedJobTitleTag);
    }
    jobs.forEach((j) => {
      if (j.category?.trim()) base.push(j.category.trim());
      if (j.specialization?.trim()) base.push(j.specialization.trim());
    });
    return Array.from(new Set(base.filter(Boolean)));
  }, [customCreatedJobTags, autoDetectedJobTitleTag, jobs]);

  // 1-Box Scholarship Paste State
  const [schPasteText, setSchPasteText] = useState('');
  const [schCategory, setSchCategory] = useState<
    'Fellowships' | 'International' | 'Grants'
  >('Fellowships');
  const [schFilterCat, setSchFilterCat] = useState<string>('All');
  const [isPostingSch, setIsPostingSch] = useState(false);

  // Header 3-Dots Menu State
  const [showAdminHeaderMenu, setShowAdminHeaderMenu] = useState(false);

  // Trainings & Price Editor State (Manual Modules + Manual MCQs)
  const [trCategory, setTrCategory] = useState<
    'International Certification' | 'Highfield' | 'Lead Auditor'
  >('International Certification');
  const [trSubType, setTrSubType] = useState<string>(
    'International Certification'
  );
  const [trTitle, setTrTitle] = useState('');
  const [trFees, setTrFees] = useState('');
  const [trDuration, setTrDuration] = useState('');
  const [trEnrollLink, setTrEnrollLink] = useState(
    'https://wa.me/923240906384'
  );
  const [trDesc, setTrDesc] = useState('');
  const [isSavingTraining, setIsSavingTraining] = useState(false);

  // New Training — Manual Modules Builder State (Subject + Description)
  const [trModulesList, setTrModulesList] = useState<CustomTrainingModule[]>([]);
  const [modSubjectInput, setModSubjectInput] = useState('');
  const [modDescInput, setModDescInput] = useState('');

  // New Training — Manual MCQs Builder State (Question + 4 Options + 1 Correct Answer)
  const [trMcqsList, setTrMcqsList] = useState<CustomTrainingMCQ[]>([]);
  const [mcqQuestionInput, setMcqQuestionInput] = useState('');
  const [mcqOptA, setMcqOptA] = useState('');
  const [mcqOptB, setMcqOptB] = useState('');
  const [mcqOptC, setMcqOptC] = useState('');
  const [mcqOptD, setMcqOptD] = useState('');
  const [mcqCorrectIdx, setMcqCorrectIdx] = useState<number>(0);

  // Existing Training Card — Expandable Modules & MCQs Manager State
  const [expandedTrIdForBuilder, setExpandedTrIdForBuilder] = useState<string | null>(null);
  const [cardModSubject, setCardModSubject] = useState('');
  const [cardModDesc, setCardModDesc] = useState('');
  const [cardMcqQuestion, setCardMcqQuestion] = useState('');
  const [cardMcqOptA, setCardMcqOptA] = useState('');
  const [cardMcqOptB, setCardMcqOptB] = useState('');
  const [cardMcqOptC, setCardMcqOptC] = useState('');
  const [cardMcqOptD, setCardMcqOptD] = useState('');
  const [cardMcqCorrectIdx, setCardMcqCorrectIdx] = useState<number>(0);

  // Inline Training Price & Duration Edits Map: { [trainingId]: { fees, duration } }
  const [priceEdits, setPriceEdits] = useState<
    Record<string, { fees: string; duration: string }>
  >({});

  // Admin Direct Certificate Generator State (Issue Certificate Without Exam / Study on Any Course or Custom Topic)
  const [directRecipientName, setDirectRecipientName] = useState('');
  const [directRecipientEmail, setDirectRecipientEmail] = useState('');
  const [directSelectedUserUid, setDirectSelectedUserUid] = useState('');
  const [directTopicMode, setDirectTopicMode] = useState<'catalog' | 'custom'>('catalog');
  const [directCatalogCourseId, setDirectCatalogCourseId] = useState(
    trainings[0]?.id || ''
  );
  const [directCustomTopicTitle, setDirectCustomTopicTitle] = useState('');
  const [directCustomCourseCode, setDirectCustomCourseCode] = useState('FS-EXEC-400');
  const [directAccreditationStd, setDirectAccreditationStd] = useState(
    'Codex Alimentarius CXC 1-1969 · ISO 22000 & GFSI Benchmark'
  );
  const [directScorePct, setDirectScorePct] = useState<number>(88);
  const [directIssueDate, setDirectIssueDate] = useState<string>(
    new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  );
  const [directCustomCertNumber, setDirectCustomCertNumber] = useState<string>('');
  const [isIssuingDirectCert, setIsIssuingDirectCert] = useState(false);

  const handleSelectExistingMemberForCert = (uid: string) => {
    setDirectSelectedUserUid(uid);
    if (!uid) return;
    const found = users.find((u) => u.uid === uid);
    if (found) {
      setDirectRecipientName(found.name);
      setDirectRecipientEmail(found.email);
    }
  };

  const handleAdminDirectGenerateAndIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = directRecipientName.trim();
    if (!cleanName) {
      onSetBanner('Please enter the Recipient Full Name to generate the certificate.');
      return;
    }

    const activeTrMatch =
      trainings.find((t) => t.id === directCatalogCourseId) || trainings[0];
    const catalogCourse = INTERNATIONAL_TRAINING_COURSES.find(
      (c) => c.id === directCatalogCourseId
    );

    if (directTopicMode === 'catalog' && !activeTrMatch && !directCustomTopicTitle.trim()) {
      onSetBanner('No training selected in dropdown. Please add a training first or switch to Custom Topic.');
      return;
    }

    const finalCourseTitle =
      directTopicMode === 'custom' && directCustomTopicTitle.trim()
        ? directCustomTopicTitle.trim()
        : activeTrMatch?.title || catalogCourse?.title || directCustomTopicTitle.trim() || 'Food Safety & Quality Management';
    const finalCourseCode =
      directTopicMode === 'custom' && directCustomCourseCode.trim()
        ? directCustomCourseCode.trim().toUpperCase()
        : activeTrMatch?.standardCode || catalogCourse?.code || 'FS-CERT-INTL';
    const finalAccreditation =
      directTopicMode === 'custom' && directAccreditationStd.trim()
        ? directAccreditationStd.trim()
        : catalogCourse?.accreditationStandard ||
          directAccreditationStd.trim() ||
          'Codex Alimentarius CXC 1-1969 · GFSI Benchmark';

    const cleanCodeSlug = finalCourseCode.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 8) || 'FSCERT';
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const generatedCertNo =
      directCustomCertNumber.trim().toUpperCase() ||
      `FSP-${cleanCodeSlug}-${randomSuffix}`;

    const clampedScore = Math.min(100, Math.max(60, Number(directScorePct) || 85));
    const isDistinction = clampedScore >= 75;
    const totalQs =
      directTopicMode === 'catalog' && activeTrMatch?.customMcqs?.length
        ? activeTrMatch.customMcqs.length
        : 40;
    const correctOutOfTotal = Math.round((clampedScore / 100) * totalQs);
    const syllabusList =
      directTopicMode === 'catalog' &&
      activeTrMatch?.customModules &&
      activeTrMatch.customModules.length > 0
        ? activeTrMatch.customModules.map(
            (m, idx) => `Module ${idx + 1}: ${m.subject}`
          )
        : directTopicMode === 'catalog' && catalogCourse
        ? catalogCourse.modules.map((m) => m.title)
        : [
            `Module 1 (Basics & Foundations): Core Principles & Scientific Fundamentals of ${finalCourseTitle}`,
            `Module 2 (Prerequisite Programs - PRPs): GMP, GHP, SSOPs & Hygiene Controls for ${finalCourseTitle}`,
            `Module 3 (Initial Steps 1–5 & Process Flow): Team Setup, Product Scope & Operational Flow Verification`,
            `Module 4 (Principles 1–4, Risk Matrix & Decision Tree): 5×5 Hazard Analysis, CCPs & Critical Limits`,
            `Module 5 (Principles 5–7, Auditing & Law): CAPA, System Validation, ISO 19011 Auditing & Food Safety Law`
          ];

    setIsIssuingDirectCert(true);
    try {
      const certRecord: HubCertificate = {
        id: `cert-direct-${Date.now()}`,
        certificateNumber: generatedCertNo,
        recipientUid: directSelectedUserUid || undefined,
        recipientName: cleanName,
        recipientEmail: directRecipientEmail.trim(),
        courseId:
          directTopicMode === 'catalog' && activeTrMatch
            ? activeTrMatch.id
            : `custom-${cleanCodeSlug.toLowerCase()}`,
        trainingTitle: finalCourseTitle,
        accreditationBody: finalAccreditation,
        issueDate:
          directIssueDate.trim() ||
          new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
        issuedBy: 'Food Science Portal Administration (Direct Executive Issuance)',
        verificationStatus: 'valid',
        scorePercentage: clampedScore,
        distinction: isDistinction
      };

      if (onAdminDirectIssueCertificate) {
        await onAdminDirectIssueCertificate(certRecord);
      }

      // Immediately generate and download the Portrait A4 PDF Certificate
      const matchedRecipientUser = users.find(
        (u) =>
          (directRecipientEmail.trim() &&
            u.email?.trim().toLowerCase() ===
              directRecipientEmail.trim().toLowerCase()) ||
          u.name?.trim().toLowerCase() === cleanName.toLowerCase()
      );
      downloadOfficialCourseCertificatePdf({
        certificateNumber: generatedCertNo,
        recipientName: cleanName,
        recipientEmail: directRecipientEmail.trim(),
        recipientProfilePicUrl: matchedRecipientUser?.profilePicUrl,
        courseTitle: finalCourseTitle,
        courseCode: finalCourseCode,
        accreditationStandard: finalAccreditation,
        scorePercentage: clampedScore,
        correctCount: correctOutOfTotal,
        totalQuestions: totalQs,
        distinction: isDistinction,
        issueDate: certRecord.issueDate,
        verificationPortalUrl: resolveOfficialVerificationBaseUrl(),
        syllabusModules: syllabusList,
        issuedByMode: 'admin_direct'
      });

      onSetBanner(
        `Portrait PDF Certificate (${generatedCertNo}) generated for "${cleanName}" in "${finalCourseTitle}" & published live to the Online Verification Portal!`
      );
      setDirectCustomCertNumber('');
    } catch {
      onSetBanner('Failed to issue direct certificate. Please try again.');
    } finally {
      setIsIssuingDirectCert(false);
    }
  };

  // Derived Analytics & Graph Data
  const stats = useMemo(() => {
    const nonAdminUsers = users.filter(
      (u) => u.email?.toLowerCase() !== 'mindmademedia9@gmail.com'
    );
    const totalUsers = nonAdminUsers.length;
    const premiumUsers = nonAdminUsers.filter(
      (u) => u.isPaid || u.isPremium || u.plan === 'premium'
    ).length;
    const pendingUsers = nonAdminUsers.filter(
      (u) => u.paymentStatus === 'pending'
    ).length;
    const rejectedUsers = nonAdminUsers.filter(
      (u) => u.paymentStatus === 'rejected'
    ).length;
    const freeUsers = Math.max(0, totalUsers - premiumUsers);
    const cvUploadedUsers = nonAdminUsers.filter((u) =>
      Boolean(u.cvUrl?.trim())
    ).length;
    const completedProfiles = nonAdminUsers.filter(
      (u) =>
        Boolean(u.profileCompleted) ||
        Boolean(u.title && (u.bio || u.location))
    ).length;
    const hireMeActive = nonAdminUsers.filter((u) => Boolean(u.hireMe)).length;

    const pendingRequests = paymentRequests.filter(
      (r) => r.status === 'pending'
    ).length;
    const verifiedRequests = paymentRequests.filter(
      (r) => r.status === 'verified'
    ).length;

    // Jobs breakdown
    const qaJobs = jobs.filter(
      (j) =>
        j.category === 'Quality & Safety' ||
        j.specialization === 'Quality & Safety'
    ).length;
    const rdJobs = jobs.filter(
      (j) => j.category === 'R&D Lab' || j.specialization === 'R&D Lab'
    ).length;
    const prodJobs = jobs.filter(
      (j) => j.category === 'Production' || j.specialization === 'Production'
    ).length;

    // Scholarships breakdown
    const fellowSch = scholarships.filter(
      (s) => s.fundingType === 'Fellowships'
    ).length;
    const intlSch = scholarships.filter(
      (s) => s.fundingType === 'International'
    ).length;
    const grantSch = scholarships.filter(
      (s) => s.fundingType === 'Grants'
    ).length;

    // Trainings breakdown
    const hfTrainings = trainings.filter(
      (t) => t.category === 'Highfield'
    ).length;
    const ircaTrainings = trainings.filter(
      (t) =>
        t.category === 'Lead Auditor' &&
        (!t.subType || t.subType.toLowerCase().includes('irca'))
    ).length;
    const egTrainings = trainings.filter(
      (t) =>
        t.category === 'Lead Auditor' &&
        Boolean(t.subType?.toLowerCase().includes('exemplar'))
    ).length;

    return {
      totalUsers,
      premiumUsers,
      pendingUsers,
      rejectedUsers,
      freeUsers,
      cvUploadedUsers,
      completedProfiles,
      hireMeActive,
      pendingRequests,
      verifiedRequests,
      qaJobs,
      rdJobs,
      prodJobs,
      fellowSch,
      intlSch,
      grantSch,
      hfTrainings,
      ircaTrainings,
      egTrainings
    };
  }, [users, paymentRequests, jobs, scholarships, trainings]);

  const filteredUsersList = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return users
      .filter((u) => u.email?.toLowerCase() !== 'mindmademedia9@gmail.com')
      .filter((u) => {
        if (userFilter === 'premium') {
          return Boolean(u.isPaid || u.isPremium || u.plan === 'premium');
        }
        if (userFilter === 'pending') {
          return u.paymentStatus === 'pending';
        }
        if (userFilter === 'free') {
          return !u.isPaid && !u.isPremium && u.plan !== 'premium';
        }
        if (userFilter === 'cv') {
          return Boolean(u.cvUrl?.trim());
        }
        return true;
      })
      .filter((u) => {
        if (!q) return true;
        return (
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q) ||
          u.title?.toLowerCase().includes(q) ||
          u.currentRole?.toLowerCase().includes(q) ||
          u.location?.toLowerCase().includes(q) ||
          u.company?.toLowerCase().includes(q)
        );
      });
  }, [users, userSearch, userFilter]);

  const sortedPaymentRequests = useMemo(() => {
    return [...paymentRequests].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return (b.submittedAt || '').localeCompare(a.submittedAt || '');
    });
  }, [paymentRequests]);

  const filteredAdminJobs = useMemo(() => {
    if (jobFilterCat === 'All') return jobs;
    return jobs.filter(
      (j) => j.category === jobFilterCat || j.specialization === jobFilterCat
    );
  }, [jobs, jobFilterCat]);

  const filteredAdminScholarships = useMemo(() => {
    if (schFilterCat === 'All') return scholarships;
    return scholarships.filter((s) => s.fundingType === schFilterCat);
  }, [scholarships, schFilterCat]);

  const handleSubmitQuickJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobPasteText.trim()) return;
    const finalTag =
      customJobTagInput.trim() ||
      (useAutoTitleTag && autoDetectedJobTitleTag
        ? autoDetectedJobTitleTag
        : jobCategory) ||
      'Quality & Safety';
    setIsPostingJob(true);
    try {
      if (
        customJobTagInput.trim() &&
        !customCreatedJobTags.includes(customJobTagInput.trim())
      ) {
        setCustomCreatedJobTags((prev) => [customJobTagInput.trim(), ...prev]);
      }
      await onQuickPasteJob(jobPasteText, finalTag);
      setJobPasteText('');
      setCustomJobTagInput('');
    } finally {
      setIsPostingJob(false);
    }
  };

  const handleSubmitQuickScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schPasteText.trim()) return;
    setIsPostingSch(true);
    try {
      await onQuickPasteScholarship(schPasteText, schCategory);
      setSchPasteText('');
    } finally {
      setIsPostingSch(false);
    }
  };

  const handleAddModuleToNewTraining = () => {
    const cleanSubj = modSubjectInput.trim();
    if (!cleanSubj) {
      onSetBanner('Please enter a Module Subject before clicking + Add Module.');
      return;
    }
    const newMod: CustomTrainingModule = {
      id: `mod-${Date.now()}-${trModulesList.length + 1}`,
      subject: cleanSubj,
      description: modDescInput.trim()
    };
    setTrModulesList((prev) => [...prev, newMod]);
    setModSubjectInput('');
    setModDescInput('');
  };

  const handleRemoveModuleFromNewTraining = (modId: string) => {
    setTrModulesList((prev) => prev.filter((m) => m.id !== modId));
  };

  const handleAddMcqToNewTraining = () => {
    const cleanQ = mcqQuestionInput.trim();
    const cleanA = mcqOptA.trim();
    const cleanB = mcqOptB.trim();
    const cleanC = mcqOptC.trim();
    const cleanD = mcqOptD.trim();
    if (!cleanQ || !cleanA || !cleanB || !cleanC || !cleanD) {
      onSetBanner('Please enter the MCQ Question and all 4 Options (A, B, C, D).');
      return;
    }
    const newMcq: CustomTrainingMCQ = {
      id: `mcq-${Date.now()}-${trMcqsList.length + 1}`,
      question: cleanQ,
      options: [cleanA, cleanB, cleanC, cleanD],
      correctIndex: mcqCorrectIdx
    };
    setTrMcqsList((prev) => [...prev, newMcq]);
    setMcqQuestionInput('');
    setMcqOptA('');
    setMcqOptB('');
    setMcqOptC('');
    setMcqOptD('');
    setMcqCorrectIdx(0);
  };

  const handleRemoveMcqFromNewTraining = (mcqId: string) => {
    setTrMcqsList((prev) => prev.filter((q) => q.id !== mcqId));
  };

  const handleCreateNewTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trTitle.trim()) return;
    setIsSavingTraining(true);
    try {
      // Include any pending module or MCQ currently typed into the input fields
      const finalModules = [...trModulesList];
      if (modSubjectInput.trim()) {
        finalModules.push({
          id: `mod-${Date.now()}-${finalModules.length + 1}`,
          subject: modSubjectInput.trim(),
          description: modDescInput.trim()
        });
      }

      const finalMcqs = [...trMcqsList];
      if (
        mcqQuestionInput.trim() &&
        mcqOptA.trim() &&
        mcqOptB.trim() &&
        mcqOptC.trim() &&
        mcqOptD.trim()
      ) {
        finalMcqs.push({
          id: `mcq-${Date.now()}-${finalMcqs.length + 1}`,
          question: mcqQuestionInput.trim(),
          options: [
            mcqOptA.trim(),
            mcqOptB.trim(),
            mcqOptC.trim(),
            mcqOptD.trim()
          ],
          correctIndex: mcqCorrectIdx
        });
      }

      const id = `tr-custom-${Date.now()}`;
      const newTr: HubTraining = {
        id,
        category: trCategory,
        subType:
          trCategory === 'Highfield'
            ? null
            : trSubType || 'International Certification',
        title: trTitle.trim(),
        description:
          trDesc.trim() ||
          `${trTitle.trim()} (${finalModules.length} Modules · ${finalMcqs.length} MCQs)`,
        duration:
          trDuration.trim() ||
          `Self-Paced · ${finalModules.length || 1} Modules`,
        fees:
          trFees.trim() ||
          'Free Study & Exam · Rs. 1,000 Certificate',
        enrollLink: trEnrollLink.trim() || 'https://wa.me/923240906384',
        isActive: true,
        customModules: finalModules,
        customMcqs: finalMcqs
      };
      await onSaveTraining(newTr);
      setDirectCatalogCourseId(id);
      setTrTitle('');
      setTrFees('');
      setTrDuration('');
      setTrDesc('');
      setTrModulesList([]);
      setModSubjectInput('');
      setModDescInput('');
      setTrMcqsList([]);
      setMcqQuestionInput('');
      setMcqOptA('');
      setMcqOptB('');
      setMcqOptC('');
      setMcqOptD('');
      setMcqCorrectIdx(0);
    } finally {
      setIsSavingTraining(false);
    }
  };

  const handleAddModuleToExistingTraining = async (tr: HubTraining) => {
    const cleanSubj = cardModSubject.trim();
    if (!cleanSubj) {
      onSetBanner('Please enter a Module Subject.');
      return;
    }
    const existingMods = tr.customModules || [];
    const nextMods: CustomTrainingModule[] = [
      ...existingMods,
      {
        id: `mod-${Date.now()}-${existingMods.length + 1}`,
        subject: cleanSubj,
        description: cardModDesc.trim()
      }
    ];
    await onSaveTraining({
      ...tr,
      customModules: nextMods
    });
    setCardModSubject('');
    setCardModDesc('');
  };

  const handleDeleteModuleFromExistingTraining = async (
    tr: HubTraining,
    modId: string
  ) => {
    const nextMods = (tr.customModules || []).filter((m) => m.id !== modId);
    await onSaveTraining({
      ...tr,
      customModules: nextMods
    });
  };

  const handleAddMcqToExistingTraining = async (tr: HubTraining) => {
    const cleanQ = cardMcqQuestion.trim();
    const cleanA = cardMcqOptA.trim();
    const cleanB = cardMcqOptB.trim();
    const cleanC = cardMcqOptC.trim();
    const cleanD = cardMcqOptD.trim();
    if (!cleanQ || !cleanA || !cleanB || !cleanC || !cleanD) {
      onSetBanner('Please fill in Question and all 4 Options (A, B, C, D).');
      return;
    }
    const existingMcqs = tr.customMcqs || [];
    const nextMcqs: CustomTrainingMCQ[] = [
      ...existingMcqs,
      {
        id: `mcq-${Date.now()}-${existingMcqs.length + 1}`,
        question: cleanQ,
        options: [cleanA, cleanB, cleanC, cleanD],
        correctIndex: cardMcqCorrectIdx
      }
    ];
    await onSaveTraining({
      ...tr,
      customMcqs: nextMcqs
    });
    setCardMcqQuestion('');
    setCardMcqOptA('');
    setCardMcqOptB('');
    setCardMcqOptC('');
    setCardMcqOptD('');
    setCardMcqCorrectIdx(0);
  };

  const handleDeleteMcqFromExistingTraining = async (
    tr: HubTraining,
    mcqId: string
  ) => {
    const nextMcqs = (tr.customMcqs || []).filter((q) => q.id !== mcqId);
    await onSaveTraining({
      ...tr,
      customMcqs: nextMcqs
    });
  };

  const handleUpdateCoursePrice = async (tr: HubTraining) => {
    const edited = priceEdits[tr.id];
    const nextFees = edited?.fees !== undefined ? edited.fees.trim() : tr.fees;
    const nextDuration =
      edited?.duration !== undefined ? edited.duration.trim() : tr.duration;

    if (!nextFees) return;
    const updated: HubTraining = {
      ...tr,
      fees: nextFees,
      duration: nextDuration || tr.duration,
      isActive: true
    };
    await onSaveTraining(updated);
    onSetBanner(`Updated "${tr.title}" price to ${nextFees} (Live on App)!`);
  };

  const todayFormatted = new Date().toISOString().slice(0, 10);

  return (
    <div className="h-[100dvh] bg-[#F0F6FC] text-[#1A2138] flex flex-col overflow-hidden">
      {/* TOP DEDICATED ADMIN COMMAND HEADER (CLEAN — NO EMAIL/EXTRA TEXT, 3-DOTS MENU WITH SIGN OUT) */}
      <header className="shrink-0 z-40 bg-[#1A2138] text-white shadow-md border-b border-[#1673B8]/50">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              title="Admin Control Panel Home"
              className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-[#D2DEEA] cursor-pointer"
            >
              <img
                src={FS_PORTAL_LOGO_DATA_URI}
                alt="Food Science Portal Admin"
                className="w-full h-full object-contain select-none"
              />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-[15px] sm:text-[18px] font-extrabold tracking-tight leading-none text-white truncate">
                Food Science <span className="text-[#38BDF8]">Portal</span>
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-[#1673B8] text-white text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                Admin
              </span>
            </div>
          </div>

          {/* Integrated Quick Search Bar + All Pages + View App + 3-Dots Menu (Sign Out inside) */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <div className="relative flex-1 sm:w-52 max-w-[200px]">
              <Search className="w-3.5 h-3.5 text-[#1673B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  if (activeTab !== 'users') setActiveTab('users');
                }}
                placeholder="Search users..."
                className="w-full h-8.5 pl-8 pr-3 rounded-xl bg-[#F0F6FC] text-[#1A2138] placeholder:text-slate-500 text-xs font-semibold focus:outline-none border border-[#D2DEEA]"
              />
            </div>

            {activeTab !== 'menu' && (
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="px-2.5 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow-xs"
              >
                <span>Pages</span>
              </button>
            )}

            <button
              type="button"
              onClick={onPreviewUserApp}
              className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              title="Preview how the user app looks right now"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">View App</span>
            </button>

            {/* 3-Dots Menu (Contains Backup, View App, and Sign Out — matching frontend Header) */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowAdminHeaderMenu((prev) => !prev)}
                className="w-8.5 h-8.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Admin Menu & Sign Out"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showAdminHeaderMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAdminHeaderMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-[#1A2138] shadow-2xl border border-[#D2DEEA] py-2 z-50 overflow-hidden">
                    <div className="px-3.5 py-2 border-b border-[#D2DEEA] bg-[#F0F6FC]">
                      <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#1673B8]">
                        Admin Controls
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminHeaderMenu(false);
                        onPreviewUserApp();
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-[#1A2138] hover:bg-[#F0F6FC] flex items-center gap-2.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#1673B8] shrink-0" />
                      <span>Preview User App</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminHeaderMenu(false);
                        onExportBackup();
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-[#1A2138] hover:bg-[#F0F6FC] flex items-center gap-2.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#1673B8] shrink-0" />
                      <span>Export JSON Backup</span>
                    </button>
                    <div className="my-1 border-t border-[#D2DEEA]" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminHeaderMenu(false);
                        onSignOut();
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-xs font-extrabold text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN ADMIN SCROLLABLE CONTENT CONTAINER */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-5 py-5 space-y-5">
          {/* LIVE FEEDBACK BANNER */}
          {adminStatusBanner && (
            <div className="p-4 rounded-2xl bg-[#1A2138] border-2 border-[#1673B8] text-white text-xs sm:text-sm font-extrabold flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{adminStatusBanner}</span>
              </div>
              <button
                type="button"
                onClick={onClearBanner}
                className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold cursor-pointer shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* BACK TO ALL ADMIN PAGES BAR WHEN INSIDE A SPECIFIC PAGE */}
          {activeTab !== 'menu' && (
            <div className="bg-white border border-[#D2DEEA] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <span>← Back to All Admin Control Panel Pages</span>
              </button>
              <span className="text-xs font-extrabold text-[#105E9A]">
                Changes on this page are saved independently
              </span>
            </div>
          )}

          {/* URGENT PENDING PAYMENT ALERT */}
          {stats.pendingRequests > 0 && activeTab !== 'users' && (
            <div className="bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border-[1.5px] border-[#F59E0B] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#92400E]">
                    {stats.pendingRequests} User Payment{' '}
                    {stats.pendingRequests === 1 ? 'Request' : 'Requests'} Waiting
                    for Your Approval
                  </h2>
                  <p className="text-xs text-[#78350F] font-semibold">
                    Review uploaded payment slips to Accept or Reject user memberships or certificates.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className="px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-extrabold cursor-pointer shadow-xs"
              >
                Review &amp; Approve Now →
              </button>
            </div>
          )}

          {/* =====================================================================
              ADMIN CONTROL PANEL HOME MENU (DEFAULT LANDING — SEPARATE BUTTON PER PAGE)
             ===================================================================== */}
          {activeTab === 'menu' && (
            <div className="space-y-5">
              <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
                <div className="border-b border-[#D2DEEA] pb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#EBF4FC] text-[#1673B8] text-[10.5px] font-extrabold uppercase tracking-wider">
                      Admin Control Panel Directory
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#1A2138] mt-1">
                      Select an Admin Section to Open &amp; Manage Separately
                    </h2>
                    <p className="text-xs text-[#4A5568] font-medium">
                      Click any button below to open that dedicated control page. Every section opens on its own page and saves changes independently.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {[
                    {
                      id: 'overview' as AdminSectionTab,
                      title: '1. Dashboard & Graphs',
                      desc: 'Live platform analytics, user statistics & content charts',
                      badge: `${stats.totalUsers} Users`,
                      icon: BarChart3
                    },
                    {
                      id: 'users' as AdminSectionTab,
                      title: '2. Users & Approvals',
                      desc: 'Approve membership payment slips, manage users & CVs',
                      badge:
                        stats.pendingRequests > 0
                          ? `${stats.pendingRequests} Pending`
                          : `${stats.premiumUsers} Premium`,
                      icon: Users
                    },
                    {
                      id: 'jobs' as AdminSectionTab,
                      title: '3. Post Jobs (1-Box)',
                      desc: 'Paste & publish new jobs and manage active job listings',
                      badge: `${jobs.length} Jobs`,
                      icon: Briefcase
                    },
                    {
                      id: 'scholarships' as AdminSectionTab,
                      title: '4. Scholarships (1-Box)',
                      desc: 'Paste & publish fellowships, international & research grants',
                      badge: `${scholarships.length} Grants`,
                      icon: GraduationCap
                    },
                    {
                      id: 'certificates' as AdminSectionTab,
                      title: '5. Direct Certificate Generator',
                      desc: 'Generate Portrait PDF Certificates on any topic & approve Rs. 1,000 fee requests',
                      badge: `${certificates.length} Issued`,
                      icon: Award
                    },
                    {
                      id: 'trainings' as AdminSectionTab,
                      title: '6. Trainings & Course Prices',
                      desc: 'Add new training courses, edit fees, or toggle course visibility',
                      badge: `${trainings.length} Courses`,
                      icon: FileText
                    },
                    {
                      id: 'payments' as AdminSectionTab,
                      title: '7. Payment Gateway & Fees',
                      desc: 'Update Bank Account, JazzCash, EasyPaisa & membership pricing',
                      badge: `Rs. ${liveMonthlyFee}/Mo`,
                      icon: CreditCard
                    },
                    {
                      id: 'storage' as AdminSectionTab,
                      title: '8. Cloud Storage & Backup',
                      desc: 'Configure cloud storage endpoints & export full JSON backup',
                      badge: 'Cloud Sync',
                      icon: Database
                    }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className="text-left rounded-2xl bg-[#F0F6FC] hover:bg-[#E3EFFB] border-2 border-[#D2DEEA] hover:border-[#1673B8] p-4 shadow-2xs transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="w-10 h-10 rounded-xl bg-[#1673B8] group-hover:bg-[#105E9A] text-white flex items-center justify-center shadow-xs transition-colors">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D2DEEA] text-[#105E9A] text-[10.5px] font-extrabold">
                              {item.badge}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-[#1A2138] group-hover:text-[#1673B8] transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-[11px] text-[#4A5568] font-medium mt-0.5 leading-snug">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#D2DEEA]/70 flex items-center justify-between text-[11px] font-extrabold text-[#1673B8]">
                          <span>Open Page</span>
                          <span>→</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 1: ANALYTICS & USERS GRAPH DASHBOARD (overview)
             ===================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* TOP 6 KPI SUMMARY CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div
                  onClick={() => setActiveTab('users')}
                  className="bg-white border border-[#D2DEEA] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#1673B8] transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#4A5568]">
                    <span>Total Users</span>
                    <Users className="w-4 h-4 text-[#1673B8]" />
                  </div>
                  <div className="text-2xl font-extrabold text-[#1A2138] mt-1">
                    {stats.totalUsers}
                  </div>
                  <div className="text-[11px] font-bold text-[#1673B8] mt-0.5">
                    Registered Specialists
                  </div>
                </div>

                <div
                  onClick={() => {
                    setUserFilter('premium');
                    setActiveTab('users');
                  }}
                  className="bg-white border border-[#D2DEEA] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#1673B8] transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#4A5568]">
                    <span>Paid Premium</span>
                    <Crown className="w-4 h-4 text-[#D97706]" />
                  </div>
                  <div className="text-2xl font-extrabold text-[#1A2138] mt-1">
                    {stats.premiumUsers}
                  </div>
                  <div className="text-[11px] font-bold text-[#D97706] mt-0.5">
                    Rs. {liveMonthlyFee.toLocaleString()}/Mo • Rs.{' '}
                    {liveYearlyFee.toLocaleString()}/Yr ({liveYearlyDiscountPct}% OFF)
                  </div>
                </div>

                <div
                  onClick={() => {
                    setUserFilter('pending');
                    setActiveTab('users');
                  }}
                  className="bg-white border border-[#D2DEEA] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#1673B8] transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#4A5568]">
                    <span>Pending Slips</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-700 mt-1">
                    {stats.pendingRequests}
                  </div>
                  <div className="text-[11px] font-bold text-amber-700 mt-0.5">
                    Awaiting Approval
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('jobs')}
                  className="bg-white border border-[#D2DEEA] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#1673B8] transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#4A5568]">
                    <span>Live Jobs</span>
                    <Briefcase className="w-4 h-4 text-[#1673B8]" />
                  </div>
                  <div className="text-2xl font-extrabold text-[#1A2138] mt-1">
                    {jobs.length}
                  </div>
                  <div className="text-[11px] font-bold text-[#1673B8] mt-0.5">
                    3 Categories
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('scholarships')}
                  className="bg-white border border-[#D2DEEA] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#1673B8] transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#4A5568]">
                    <span>Scholarships</span>
                    <GraduationCap className="w-4 h-4 text-[#1673B8]" />
                  </div>
                  <div className="text-2xl font-extrabold text-[#1A2138] mt-1">
                    {scholarships.length}
                  </div>
                  <div className="text-[11px] font-bold text-[#1673B8] mt-0.5">
                    Global Grants
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('trainings')}
                  className="bg-white border border-[#D2DEEA] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#1673B8] transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#4A5568]">
                    <span>Trainings</span>
                    <Award className="w-4 h-4 text-[#1673B8]" />
                  </div>
                  <div className="text-2xl font-extrabold text-[#1A2138] mt-1">
                    {trainings.length}
                  </div>
                  <div className="text-[11px] font-bold text-[#1673B8] mt-0.5">
                    Custom Courses
                  </div>
                </div>
              </div>

              {/* VISUAL GRAPHS ROW: USERS GRAPH + PLATFORM CONTENT GRAPH */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* GRAPH 1: ALL USERS ANALYTICS & ACTIVITY GRAPH */}
                <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D2DEEA] pb-3">
                    <div>
                      <h2 className="text-base font-extrabold text-[#1A2138] flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#1673B8]" />
                        <span>All Users &amp; Membership Graph</span>
                      </h2>
                      <p className="text-xs text-[#4A5568] font-medium">
                        Real-time visual breakdown of user plans &amp; profile activity
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#EBF4FC] text-[#105E9A] text-xs font-extrabold">
                      {stats.totalUsers} Users
                    </span>
                  </div>

                  {/* Visual Column Bar Chart for User Segments */}
                  <div className="bg-[#F0F6FC] border border-[#D2DEEA] rounded-2xl p-4">
                    <div className="grid grid-cols-5 gap-2.5 items-end h-36 pt-4 px-1">
                      {[
                        {
                          label: 'Total',
                          value: stats.totalUsers,
                          color: 'bg-[#1A2138]',
                          max: Math.max(1, stats.totalUsers)
                        },
                        {
                          label: 'Premium',
                          value: stats.premiumUsers,
                          color: 'bg-[#1673B8]',
                          max: Math.max(1, stats.totalUsers)
                        },
                        {
                          label: 'Free',
                          value: stats.freeUsers,
                          color: 'bg-[#38BDF8]',
                          max: Math.max(1, stats.totalUsers)
                        },
                        {
                          label: 'Pending',
                          value: stats.pendingUsers,
                          color: 'bg-[#F59E0B]',
                          max: Math.max(1, stats.totalUsers)
                        },
                        {
                          label: 'CV Added',
                          value: stats.cvUploadedUsers,
                          color: 'bg-[#105E9A]',
                          max: Math.max(1, stats.totalUsers)
                        }
                      ].map((bar) => {
                        const heightPct = Math.max(
                          14,
                          Math.min(100, Math.round((bar.value / bar.max) * 100))
                        );
                        return (
                          <div
                            key={bar.label}
                            className="flex flex-col items-center justify-end h-full gap-1.5"
                          >
                            <span className="text-xs font-extrabold text-[#1A2138]">
                              {bar.value}
                            </span>
                            <div className="w-full max-w-[44px] bg-[#D2DEEA] rounded-t-xl h-24 flex items-end overflow-hidden">
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full ${bar.color} rounded-t-xl transition-all duration-500`}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-[#4A5568] text-center leading-tight">
                              {bar.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Horizontal Activity Progress Bars */}
                  <div className="space-y-3 pt-1">
                    {[
                      {
                        label: `Paid Premium Members (Rs. ${liveMonthlyFee}/Mo • ${liveYearlyDiscountPct}% OFF Yr)`,
                        count: stats.premiumUsers,
                        total: Math.max(1, stats.totalUsers),
                        barClass: 'bg-[#1673B8]'
                      },
                      {
                        label: 'Free Tier Users',
                        count: stats.freeUsers,
                        total: Math.max(1, stats.totalUsers),
                        barClass: 'bg-[#1A2138]'
                      },
                      {
                        label: 'Completed Specialist Profiles',
                        count: stats.completedProfiles,
                        total: Math.max(1, stats.totalUsers),
                        barClass: 'bg-[#105E9A]'
                      },
                      {
                        label: 'Users with Uploaded CV / Resume',
                        count: stats.cvUploadedUsers,
                        total: Math.max(1, stats.totalUsers),
                        barClass: 'bg-[#0284C7]'
                      },
                      {
                        label: 'Available for Hiring ("Hire Me" ON)',
                        count: stats.hireMeActive,
                        total: Math.max(1, stats.totalUsers),
                        barClass: 'bg-[#D97706]'
                      }
                    ].map((item) => {
                      const pct =
                        stats.totalUsers > 0
                          ? Math.round((item.count / item.total) * 100)
                          : 0;
                      return (
                        <div key={item.label} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#1A2138]">
                              {item.label}
                            </span>
                            <span className="font-extrabold text-[#1673B8]">
                              {item.count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#EBF4FC] overflow-hidden">
                            <div
                              style={{ width: `${Math.max(4, pct)}%` }}
                              className={`h-full rounded-full ${item.barClass}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              {/* GRAPH 2: JOBS, SCHOLARSHIPS & TRAININGS DISTRIBUTION GRAPH */}
              <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#D2DEEA] pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-[#1A2138] flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#1673B8]" />
                      <span>App Content &amp; Categories Graph</span>
                    </h2>
                    <p className="text-xs text-[#4A5568] font-medium">
                      Live distribution across Jobs, Scholarships &amp; Trainings
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#EBF4FC] text-[#105E9A] text-xs font-extrabold">
                    {jobs.length + scholarships.length + trainings.length} Active Items
                  </span>
                </div>

                {/* Jobs Breakdown */}
                <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider">
                      Jobs by Category ({jobs.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('jobs')}
                      className="text-xs font-extrabold text-[#1673B8] hover:underline cursor-pointer"
                    >
                      + Post / Manage Jobs →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-xl p-2.5 border border-[#D2DEEA]">
                      <div className="text-lg font-extrabold text-[#1A2138]">
                        {stats.qaJobs}
                      </div>
                      <div className="text-[11px] font-bold text-[#105E9A]">
                        Quality &amp; Safety
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D2DEEA]">
                      <div className="text-lg font-extrabold text-[#1A2138]">
                        {stats.rdJobs}
                      </div>
                      <div className="text-[11px] font-bold text-[#105E9A]">
                        R&amp;D Lab
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D2DEEA]">
                      <div className="text-lg font-extrabold text-[#1A2138]">
                        {stats.prodJobs}
                      </div>
                      <div className="text-[11px] font-bold text-[#105E9A]">
                        Production
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scholarships Breakdown */}
                <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider">
                      Scholarships by Category ({scholarships.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('scholarships')}
                      className="text-xs font-extrabold text-[#1673B8] hover:underline cursor-pointer"
                    >
                      + Post / Manage Scholarships →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-xl p-2.5 border border-[#D2DEEA]">
                      <div className="text-lg font-extrabold text-[#1A2138]">
                        {stats.fellowSch}
                      </div>
                      <div className="text-[11px] font-bold text-[#105E9A]">
                        Fellowships
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D2DEEA]">
                      <div className="text-lg font-extrabold text-[#1A2138]">
                        {stats.intlSch}
                      </div>
                      <div className="text-[11px] font-bold text-[#105E9A]">
                        International
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D2DEEA]">
                      <div className="text-lg font-extrabold text-[#1A2138]">
                        {stats.grantSch}
                      </div>
                      <div className="text-[11px] font-bold text-[#105E9A]">
                        Grants
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trainings Breakdown */}
                <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider">
                      Trainings &amp; Courses ({trainings.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('trainings')}
                      className="text-xs font-extrabold text-[#1673B8] hover:underline cursor-pointer"
                    >
                      Edit Prices / Add Training →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-xl p-2.5 border border-[#D2DEEA]">
                      <div className="text-lg font-extrabold text-[#1A2138]">
                        {stats.hfTrainings}
                      </div>
                      <div className="text-[11px] font-bold text-[#105E9A]">
                        Highfield UK
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D2DEEA]">
                      <div className="text-lg font-extrabold text-[#1A2138]">
                        {stats.ircaTrainings}
                      </div>
                      <div className="text-[11px] font-bold text-[#105E9A]">
                        1. IRCA CQI
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D2DEEA]">
                      <div className="text-lg font-extrabold text-[#1A2138]">
                        {stats.egTrainings}
                      </div>
                      <div className="text-[11px] font-bold text-[#105E9A]">
                        2. Exemplar Global
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTION SHORTCUTS */}
            <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs">
              <h3 className="text-sm font-extrabold text-[#1A2138] mb-3">
                Quick Admin Controls (Instant Live Sync)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className="p-3.5 rounded-2xl bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-left transition-colors cursor-pointer space-y-1"
                >
                  <UserCheck className="w-5 h-5 text-[#1673B8]" />
                  <div className="text-xs font-extrabold text-[#1A2138]">
                    Accept / Reject Users
                  </div>
                  <div className="text-[11px] text-[#4A5568]">
                    Monitor profiles &amp; slips
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className="p-3.5 rounded-2xl bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-left transition-colors cursor-pointer space-y-1"
                >
                  <Briefcase className="w-5 h-5 text-[#1673B8]" />
                  <div className="text-xs font-extrabold text-[#1A2138]">
                    1-Box Paste Job
                  </div>
                  <div className="text-[11px] text-[#4A5568]">
                    Paste &amp; select category
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('scholarships')}
                  className="p-3.5 rounded-2xl bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-left transition-colors cursor-pointer space-y-1"
                >
                  <GraduationCap className="w-5 h-5 text-[#1673B8]" />
                  <div className="text-xs font-extrabold text-[#1A2138]">
                    1-Box Paste Scholarship
                  </div>
                  <div className="text-[11px] text-[#4A5568]">
                    Paste &amp; select category
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('trainings')}
                  className="p-3.5 rounded-2xl bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-left transition-colors cursor-pointer space-y-1"
                >
                  <DollarSign className="w-5 h-5 text-[#1673B8]" />
                  <div className="text-xs font-extrabold text-[#1A2138]">
                    Change Training Prices
                  </div>
                  <div className="text-[11px] text-[#4A5568]">
                    Add/remove or update fees
                  </div>
                </button>
              </div>
            </div>

            {/* QUICK PREMIUM MEMBERSHIP PACKAGE PRICE & AUTO-DISCOUNT CALCULATOR (OVERVIEW TAB) */}
            <form
              onSubmit={onSaveStorageConfig}
              className="bg-white border-2 border-[#1673B8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#B45309] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138]">
                      Premium Membership Package Price &amp; Auto-Discount Control
                    </h3>
                    <p className="text-[11.5px] text-[#4A5568] font-medium">
                      Change the Monthly or Yearly package price here — the discount percentage calculates automatically and updates everywhere across the app when saved.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-extrabold">
                  Auto-Discount: {liveYearlyDiscountPct}% OFF Yearly
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    Monthly Fee (Rs.)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={storageConfig.paymentGateway?.monthlyFeeRs ?? 100}
                    onChange={(e) => {
                      const rawVal = Number(e.target.value);
                      const nextMonthly = rawVal >= 0 ? rawVal : 100;
                      const nextYearly = autoApply25PctYearly
                        ? Math.round(nextMonthly * 12 * 0.75)
                        : storageConfig.paymentGateway?.yearlyFeeRs ?? 900;
                      onChangeStorageConfig({
                        ...storageConfig,
                        paymentGateway: {
                          jazzCashTitle:
                            storageConfig.paymentGateway?.jazzCashTitle ||
                            'Muneeb Khan',
                          jazzCashNumber:
                            storageConfig.paymentGateway?.jazzCashNumber ||
                            '0324-0906384',
                          easyPaisaTitle:
                            storageConfig.paymentGateway?.easyPaisaTitle ||
                            'Muneeb Khan',
                          easyPaisaNumber:
                            storageConfig.paymentGateway?.easyPaisaNumber ||
                            '0324-0906384',
                          bankTitle:
                            storageConfig.paymentGateway?.bankTitle ||
                            'Muneeb Khan',
                          bankName:
                            storageConfig.paymentGateway?.bankName ||
                            'Bank Transfer',
                          bankAccountOrIban:
                            storageConfig.paymentGateway?.bankAccountOrIban ||
                            'Contact on WhatsApp for IBAN',
                          bankWhatsapp:
                            storageConfig.paymentGateway?.bankWhatsapp ||
                            '+92 324 0906384',
                          monthlyFeeRs: nextMonthly,
                          yearlyFeeRs: nextYearly,
                          customPriceUpdated: true
                        }
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-extrabold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    Yearly Fee (Rs.) — ({liveYearlyDiscountPct}% OFF)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={storageConfig.paymentGateway?.yearlyFeeRs ?? 900}
                    onChange={(e) => {
                      setAutoApply25PctYearly(false);
                      const rawVal = Number(e.target.value);
                      const nextYearly = rawVal >= 0 ? rawVal : 900;
                      onChangeStorageConfig({
                        ...storageConfig,
                        paymentGateway: {
                          jazzCashTitle:
                            storageConfig.paymentGateway?.jazzCashTitle ||
                            'Muneeb Khan',
                          jazzCashNumber:
                            storageConfig.paymentGateway?.jazzCashNumber ||
                            '0324-0906384',
                          easyPaisaTitle:
                            storageConfig.paymentGateway?.easyPaisaTitle ||
                            'Muneeb Khan',
                          easyPaisaNumber:
                            storageConfig.paymentGateway?.easyPaisaNumber ||
                            '0324-0906384',
                          bankTitle:
                            storageConfig.paymentGateway?.bankTitle ||
                            'Muneeb Khan',
                          bankName:
                            storageConfig.paymentGateway?.bankName ||
                            'Bank Transfer',
                          bankAccountOrIban:
                            storageConfig.paymentGateway?.bankAccountOrIban ||
                            'Contact on WhatsApp for IBAN',
                          bankWhatsapp:
                            storageConfig.paymentGateway?.bankWhatsapp ||
                            '+92 324 0906384',
                          monthlyFeeRs:
                            storageConfig.paymentGateway?.monthlyFeeRs ?? 100,
                          yearlyFeeRs: nextYearly,
                          customPriceUpdated: true
                        }
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-extrabold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors h-[38px]"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Package Price Live</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-xs">
                <div className="font-bold text-[#1A2138]">
                  Live Calculation: 12 Months ={' '}
                  <strong>Rs. {fullYearBaseFee.toLocaleString()}</strong> → Yearly Package ={' '}
                  <strong className="text-[#1673B8]">
                    Rs. {liveYearlyFee.toLocaleString()} ({liveYearlyDiscountPct}% OFF • Saves Rs. {liveYearlySavingsRs.toLocaleString()})
                  </strong>
                </div>
                <label className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#105E9A] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoApply25PctYearly}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAutoApply25PctYearly(checked);
                      if (checked) {
                        const currentMo =
                          Number(storageConfig.paymentGateway?.monthlyFeeRs) || 100;
                        const autoYr = Math.round(currentMo * 12 * 0.75);
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle:
                              storageConfig.paymentGateway?.jazzCashTitle ||
                              'Muneeb Khan',
                            jazzCashNumber:
                              storageConfig.paymentGateway?.jazzCashNumber ||
                              '0324-0906384',
                            easyPaisaTitle:
                              storageConfig.paymentGateway?.easyPaisaTitle ||
                              'Muneeb Khan',
                            easyPaisaNumber:
                              storageConfig.paymentGateway?.easyPaisaNumber ||
                              '0324-0906384',
                            bankTitle:
                              storageConfig.paymentGateway?.bankTitle ||
                              'Muneeb Khan',
                            bankName:
                              storageConfig.paymentGateway?.bankName ||
                              'Bank Transfer',
                            bankAccountOrIban:
                              storageConfig.paymentGateway?.bankAccountOrIban ||
                              'Contact on WhatsApp for IBAN',
                            bankWhatsapp:
                              storageConfig.paymentGateway?.bankWhatsapp ||
                              '+92 324 0906384',
                            monthlyFeeRs: currentMo,
                            yearlyFeeRs: autoYr,
                            customPriceUpdated: true
                          }
                        });
                      }
                    }}
                    className="w-3.5 h-3.5 accent-[#1673B8] rounded cursor-pointer"
                  />
                  <span>Auto 25% OFF on Yearly</span>
                </label>
              </div>
            </form>

            {/* OFFICIAL WHATSAPP CHANNEL BUTTON & LINK CONTROL (HOME SCREEN) */}
            <form
              onSubmit={onSaveStorageConfig}
              className="bg-white border-2 border-[#1673B8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <MessageSquare className="w-5 h-5 stroke-[2.3]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138]">
                      Home Screen WhatsApp Channel Button &amp; Link Control
                    </h3>
                    <p className="text-[11.5px] text-[#4A5568] font-medium">
                      Edit or amend the official WhatsApp Channel URL and button text shown on the Home front page.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[11px] font-extrabold">
                  Live on Home Screen
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    Official WhatsApp Channel Link (URL)
                  </label>
                  <input
                    type="text"
                    value={
                      storageConfig.whatsappChannelUrl ??
                      'https://whatsapp.com/channel/0029VaFoodSpecialists'
                    }
                    onChange={(e) =>
                      onChangeStorageConfig({
                        ...storageConfig,
                        whatsappChannelUrl: e.target.value
                      })
                    }
                    placeholder="https://whatsapp.com/channel/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    Button Text on Home Page
                  </label>
                  <input
                    type="text"
                    value={
                      storageConfig.whatsappChannelButtonText ??
                      'Follow WhatsApp Channel'
                    }
                    onChange={(e) =>
                      onChangeStorageConfig({
                        ...storageConfig,
                        whatsappChannelButtonText: e.target.value
                      })
                    }
                    placeholder="Follow WhatsApp Channel"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <a
                  href={
                    (
                      storageConfig.whatsappChannelUrl ||
                      'https://whatsapp.com/channel/0029VaFoodSpecialists'
                    )
                      .trim()
                      .match(/^https?:\/\//i)
                      ? (
                          storageConfig.whatsappChannelUrl ||
                          'https://whatsapp.com/channel/0029VaFoodSpecialists'
                        ).trim()
                      : `https://${(
                          storageConfig.whatsappChannelUrl ||
                          'https://whatsapp.com/channel/0029VaFoodSpecialists'
                        ).trim()}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#105E9A] text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Current Channel Link</span>
                </a>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save WhatsApp Channel Link</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =====================================================================
            TAB 2: USERS, ACTIVITY MONITOR & ACCEPT / REJECT (users)
           ===================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-5">
            {/* SECTION A: PAYMENT SLIPS & MEMBERSHIP REQUESTS (ACCEPT / REJECT) */}
            <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#1A2138] flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#D97706]" />
                    <span>
                      Membership Payment Slips — Accept or Reject (
                      {sortedPaymentRequests.length})
                    </span>
                  </h2>
                  <p className="text-xs text-[#4A5568] font-medium">
                    When a user submits a Rs. {liveMonthlyFee.toLocaleString()} (1 Month) or Rs. {liveYearlyFee.toLocaleString()} (1 Year
                    — {liveYearlyDiscountPct}% OFF) payment screenshot, accept it here to unlock
                    their Premium Membership immediately.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-extrabold">
                  {stats.pendingRequests} Pending Review
                </span>
              </div>

              {sortedPaymentRequests.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-center text-xs text-[#4A5568] font-semibold">
                  No payment requests submitted yet. You can also directly
                  Accept/Activate or Reject any user from the Users Directory
                  below.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {sortedPaymentRequests.map((req) => (
                    <div
                      key={req.id}
                      className={`p-4 rounded-2xl border space-y-3 ${
                        req.status === 'pending'
                          ? 'bg-[#FFFDF5] border-2 border-[#F59E0B]'
                          : 'bg-[#F0F6FC] border-[#D2DEEA]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="text-sm font-extrabold text-[#1A2138] break-words">
                            {req.userName || 'Applicant'}
                          </div>
                          <div className="text-xs text-[#4A5568] font-semibold break-all">
                            📧 {req.userEmail || 'No email'}
                          </div>
                          {req.userPhone && (
                            <div className="text-xs text-emerald-800 font-bold">
                              📱 WhatsApp / Phone: {req.userPhone}
                            </div>
                          )}
                          {(req.userCurrentRole || req.userQualification) && (
                            <div className="text-[11px] text-slate-600 font-semibold">
                              👤 {req.userCurrentRole || 'Specialist'}
                              {req.userQualification
                                ? ` • ${req.userQualification}`
                                : ''}
                            </div>
                          )}

                          {/* Prominent Transaction ID / Reference No. & Plan Box */}
                          <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#1673B8]/30 space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-extrabold text-[#1673B8]">
                              <span>Method: {req.paymentMethod}</span>
                              <span>
                                Plan: {req.amount || 'Rs. 100 (1 Month)'}
                              </span>
                            </div>
                            <div className="text-xs font-black text-[#1A2138] bg-[#EBF4FC] px-2.5 py-1 rounded-lg border border-[#1673B8]/25 break-all">
                              TRX / Reference ID:{' '}
                              <span className="text-[#1673B8] font-mono">
                                {req.transactionId || 'Not Provided'}
                              </span>
                            </div>
                          </div>

                          {(req.certificateCourseTitle ||
                            req.subscriptionPlan === 'certificate_unlock') && (
                            <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-[11px] font-extrabold text-amber-950">
                              🎓 Certificate Request:{' '}
                              {req.certificateCourseTitle || req.notes}
                              {req.certificateNumber
                                ? ` (ID: ${req.certificateNumber})`
                                : ''}
                            </div>
                          )}
                          {req.submittedAt && (
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              Submitted:{' '}
                              {req.submittedAt.replace('T', ' ').replace('Z', '')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                              req.status === 'verified'
                                ? 'bg-[#EBF4FC] text-[#105E9A]'
                                : req.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-200 text-amber-950'
                            }`}
                          >
                            {req.status === 'verified'
                              ? 'ACCEPTED'
                              : req.status.toUpperCase()}
                          </span>
                          <button
                            type="button"
                            onClick={() => onDeletePaymentRequest(req.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            title="Delete this payment request record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {req.receiptImageUrl ? (
                        <div className="rounded-xl overflow-hidden border border-[#D2DEEA] bg-white p-2.5 space-y-1.5">
                          <div className="text-[11px] font-extrabold text-[#1A2138] flex items-center justify-between px-1">
                            <span>📸 Payment Screenshot / Slip</span>
                            <a
                              href={req.receiptImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1673B8] underline font-extrabold"
                            >
                              Open Full Screenshot ↗
                            </a>
                          </div>
                          <img
                            src={req.receiptImageUrl}
                            alt="Payment Screenshot"
                            className="max-h-52 mx-auto object-contain rounded-lg border border-slate-100"
                          />
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900">
                          ⚠️ No payment screenshot attached
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onVerifyPayment(req, 'verified')}
                          className="py-2.5 px-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>
                            {req.certificateCourseId ||
                            req.subscriptionPlan === 'certificate_unlock'
                              ? 'Accept Cert'
                              : `Accept (${
                                  req.subscriptionPlan
                                    ?.toLowerCase()
                                    .includes('year') ||
                                  req.amount?.includes(String(liveYearlyFee)) ||
                                  req.amount?.includes('900') ||
                                  req.amount?.includes('1800') ||
                                  req.amount?.includes('1,800')
                                    ? '1 Yr'
                                    : '1 Mo'
                                })`}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onVerifyPayment(req, 'rejected')}
                          className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                          <span>Reject</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeletePaymentRequest(req.id)}
                          className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION B: ALL REGISTERED USERS & ACTIVITY MONITOR */}
            <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D2DEEA] pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#1A2138] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#1673B8]" />
                    <span>
                      All Users &amp; Activity Monitor ({filteredUsersList.length})
                    </span>
                  </h2>
                  <p className="text-xs text-[#4A5568] font-medium">
                    Monitor user profiles, CVs, visibility settings, and
                    Accept/Premium, Reject/Free, or Remove any user.
                  </p>
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#4A5568] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name, email, city, role..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>
              </div>

              {/* User Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {(
                  [
                    { id: 'all', label: `All Users (${stats.totalUsers})` },
                    {
                      id: 'premium',
                      label: `Paid Premium (${stats.premiumUsers})`
                    },
                    {
                      id: 'pending',
                      label: `Pending Approval (${stats.pendingUsers})`
                    },
                    { id: 'free', label: `Free Users (${stats.freeUsers})` },
                    {
                      id: 'cv',
                      label: `CV Uploaded (${stats.cvUploadedUsers})`
                    }
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setUserFilter(f.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                      userFilter === f.id
                        ? 'bg-[#1673B8] text-white'
                        : 'bg-[#EBF4FC] text-[#1A2138] hover:bg-[#DCE9F6]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Users List */}
              {filteredUsersList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-center text-xs text-[#4A5568] font-semibold">
                  No users match the current filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsersList.map((u) => {
                    const isPremium = Boolean(
                      u.isPaid || u.isPremium || u.plan === 'premium'
                    );
                    const isExpanded = expandedUserUid === u.uid;
                    const eduCount = Array.isArray(u.education)
                      ? u.education.length
                      : 0;
                    const expCount = Array.isArray(u.experienceItems)
                      ? u.experienceItems.length
                      : Array.isArray(u.experience)
                      ? u.experience.length
                      : u.experience
                      ? 1
                      : 0;
                    const certCount = Array.isArray(u.certifications)
                      ? u.certifications.length
                      : 0;

                    return (
                      <div
                        key={u.uid}
                        className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] hover:border-[#1673B8] transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#1A2138] text-white font-extrabold text-base flex items-center justify-center shrink-0 overflow-hidden border border-[#D2DEEA]">
                              {u.profilePicUrl || u.profilePhotoUrl ? (
                                <img
                                  src={u.profilePicUrl || u.profilePhotoUrl}
                                  alt={u.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                (u.name || 'U').charAt(0).toUpperCase()
                              )}
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <h3 className="text-sm font-extrabold text-[#1A2138]">
                                  {u.name}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    isPremium
                                      ? 'bg-[#EBF4FC] text-[#105E9A]'
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  {isPremium ? '★ PREMIUM MEMBER' : 'FREE USER'}
                                </span>
                                {u.paymentStatus === 'pending' && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-extrabold">
                                    PAYMENT PENDING
                                  </span>
                                )}
                                {u.paymentStatus === 'rejected' && (
                                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold">
                                    REJECTED
                                  </span>
                                )}
                              </div>

                              <p className="text-xs font-bold text-[#1673B8]">
                                {u.title ||
                                  u.currentRole ||
                                  'Food Safety & Quality Specialist'}
                                {u.company ? ` • ${u.company}` : ''}
                              </p>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#4A5568] font-medium">
                                {u.email && <span>✉ {u.email}</span>}
                                {u.phone && <span>📞 {u.phone}</span>}
                                {u.location && <span>📍 {u.location}</span>}
                              </div>
                            </div>
                          </div>

                          {/* DIRECT ADMIN CONTROL BUTTONS FOR THIS USER */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {!isPremium ? (
                              <button
                                type="button"
                                onClick={() => onToggleUserPremium(u, true)}
                                className="px-3 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Accept / Make Premium</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onToggleUserPremium(u, false)}
                                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Reject / Set Free</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedUserUid(isExpanded ? null : u.uid)
                              }
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1A2138] text-xs font-extrabold cursor-pointer"
                            >
                              {isExpanded ? 'Hide Activity' : 'View Activity'}
                            </button>

                            {confirmDeleteUid === u.uid ? (
                              <div className="inline-flex items-center gap-1 bg-red-600 text-white px-2.5 py-1 rounded-xl text-xs font-extrabold">
                                <span>Confirm?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteUser(u.uid, u.name);
                                    setConfirmDeleteUid(null);
                                  }}
                                  className="underline px-1 cursor-pointer"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteUid(null)}
                                  className="underline px-1 cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteUid(u.uid)}
                                className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                                title="Delete / Remove User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Activity Pills Row */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#D2DEEA] text-[11px] font-bold">
                          <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#D2DEEA] text-[#1A2138]">
                            Education: {eduCount}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#D2DEEA] text-[#1A2138]">
                            Experience: {expCount}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#D2DEEA] text-[#1A2138]">
                            Trainings: {certCount}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-md ${
                              u.hireMe
                                ? 'bg-[#EBF4FC] text-[#105E9A]'
                                : 'bg-white border border-[#D2DEEA] text-gray-500'
                            }`}
                          >
                            Hire Me: {u.hireMe ? 'ON' : 'OFF'}
                          </span>
                          {u.cvUrl && (
                            <a
                              href={u.cvUrl}
                              download={u.cvFileName || `${u.name}_CV.pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-0.5 rounded-md bg-[#1673B8] text-white inline-flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              <span>View / Download CV</span>
                            </a>
                          )}
                          {u.linkedinUrl && (
                            <a
                              href={
                                u.linkedinUrl.startsWith('http')
                                  ? u.linkedinUrl
                                  : `https://${u.linkedinUrl}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-0.5 rounded-md bg-[#0A66C2] text-white inline-flex items-center gap-1"
                            >
                              <span>LinkedIn ↗</span>
                            </a>
                          )}
                        </div>

                        {/* Expanded User Activity & Full Profile Details */}
                        {isExpanded && (
                          <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA] space-y-2 text-xs">
                            <div className="font-extrabold text-[#1A2138]">
                              Full User Activity &amp; Profile Details
                            </div>
                            {u.bio && (
                              <p className="text-gray-700 leading-relaxed">
                                <strong>Bio:</strong> {u.bio}
                              </p>
                            )}
                            {u.qualification && (
                              <p className="text-gray-700">
                                <strong>Qualification:</strong> {u.qualification}
                              </p>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-gray-600 pt-1">
                              <div>
                                <strong>User ID:</strong> {u.uid}
                              </div>
                              <div>
                                <strong>Joined:</strong>{' '}
                                {u.createdAt
                                  ? u.createdAt.slice(0, 10)
                                  : 'Active'}
                              </div>
                              <div>
                                <strong>Premium Until:</strong>{' '}
                                {u.premiumExpiresAt
                                  ? u.premiumExpiresAt.slice(0, 10)
                                  : 'N/A'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: 1-BOX SMART PASTE JOBS MANAGER (jobs)
           ===================================================================== */}
        {activeTab === 'jobs' && (
          <div className="space-y-5">
            {/* 1-BOX JOB PASTE FORM */}
            <form
              onSubmit={handleSubmitQuickJob}
              className="bg-white border-2 border-[#1673B8] rounded-[26px] p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[11px] font-extrabold">
                    Simple 1-Box Job Publisher
                  </span>
                  <h2 className="text-lg font-extrabold text-[#1A2138] mt-1">
                    Paste Full Job Post &amp; Select Category
                  </h2>
                  <p className="text-xs text-[#4A5568] font-medium">
                    No separate fields needed! Just choose the category, paste
                    the complete job details in one box below, and click Share.
                    It will automatically publish with today&apos;s date (
                    {todayFormatted}).
                  </p>
                </div>
              </div>

              {/* STEP 1: DYNAMIC JOB TAGS (Auto-Create from Job Title OR Create Custom Tag OR Pick Tag) */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-extrabold text-[#1A2138]">
                    1. Job Tag / Category (Auto-Created from Job Title or Create Custom Tag):
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#105E9A] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useAutoTitleTag}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUseAutoTitleTag(checked);
                        if (checked && autoDetectedJobTitleTag) {
                          setJobCategory(autoDetectedJobTitleTag);
                        }
                      }}
                      className="w-3.5 h-3.5 accent-[#1673B8] rounded cursor-pointer"
                    />
                    <span>Auto-Create Tag from Job Title</span>
                  </label>
                </div>

                {/* Live Auto-Detected Job Title Tag Preview */}
                {autoDetectedJobTitleTag && (
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#EBF4FC] border border-[#1673B8]/40 text-xs">
                    <div className="font-bold text-[#1A2138]">
                      Auto-Detected Tag from Job Title:{' '}
                      <span className="px-2 py-0.5 rounded-lg bg-[#1673B8] text-white font-extrabold">
                        {autoDetectedJobTitleTag}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUseAutoTitleTag(true);
                        setCustomJobTagInput('');
                        setJobCategory(autoDetectedJobTitleTag);
                      }}
                      className="text-[11px] font-extrabold text-[#105E9A] underline cursor-pointer"
                    >
                      {useAutoTitleTag && !customJobTagInput.trim()
                        ? 'Active ✓'
                        : 'Use This Tag'}
                    </button>
                  </div>
                )}

                {/* Create Custom Tag Input + Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={customJobTagInput}
                    onChange={(e) => {
                      setCustomJobTagInput(e.target.value);
                      if (e.target.value.trim()) {
                        setUseAutoTitleTag(false);
                        setJobCategory(e.target.value.trim());
                      }
                    }}
                    placeholder="Or type / create any new custom tag (e.g. Dairy QA, Regulatory Affairs, Supply Chain)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const clean = customJobTagInput.trim();
                      if (!clean) return;
                      if (!customCreatedJobTags.includes(clean)) {
                        setCustomCreatedJobTags((prev) => [clean, ...prev]);
                      }
                      setUseAutoTitleTag(false);
                      setJobCategory(clean);
                      setCustomJobTagInput('');
                      onSetBanner(`Custom Tag "${clean}" created and selected!`);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold shrink-0 cursor-pointer transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Create Tag</span>
                  </button>
                </div>

                {/* Selectable Tag Pills (Existing + Custom + Auto-Detected) */}
                <div className="space-y-1">
                  <span className="block text-[10.5px] font-bold text-[#4A5568]">
                    Or click any tag below (Selected:{' '}
                    <strong className="text-[#1673B8]">
                      {customJobTagInput.trim() ||
                        (useAutoTitleTag && autoDetectedJobTitleTag
                          ? autoDetectedJobTitleTag
                          : jobCategory)}
                    </strong>
                    ):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {allAvailableJobTags.map((cat) => {
                      const activeTag =
                        customJobTagInput.trim() ||
                        (useAutoTitleTag && autoDetectedJobTitleTag
                          ? autoDetectedJobTitleTag
                          : jobCategory);
                      const isSelected = activeTag === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setUseAutoTitleTag(false);
                            setCustomJobTagInput('');
                            setJobCategory(cat);
                          }}
                          className={`py-1.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#1673B8] text-white border-[#1673B8] shadow-xs'
                              : 'bg-white text-[#1A2138] border-[#D2DEEA] hover:bg-[#EBF4FC]'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* STEP 2: SINGLE BOX TO PASTE FULL JOB */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-[#1A2138]">
                    2. Paste Complete Job Announcement Here (1st line becomes
                    Headline &amp; Auto-Creates Tag):
                  </label>
                  <span className="text-[11px] font-bold text-[#1673B8]">
                    Auto-Date: {todayFormatted}
                  </span>
                </div>
                <textarea
                  rows={7}
                  required
                  value={jobPasteText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setJobPasteText(val);
                    if (useAutoTitleTag && !customJobTagInput.trim()) {
                      const autoTag = extractAutoTagFromJobText(val);
                      if (autoTag) {
                        setJobCategory(autoTag);
                      }
                    }
                  }}
                  placeholder={`Paste the full job post here...\nExample:\nQA / Food Safety Officer — Engro Foods (Lahore, Pakistan)\nRequirement: BS Food Science & Technology, 2+ Years HACCP / ISO 22000 experience.\nSend CV to: careers@company.com or WhatsApp +92 300 1234567`}
                  className="w-full p-4 rounded-2xl bg-[#F0F6FC] border-[1.5px] border-[#94B8D7] focus:border-[#1673B8] focus:bg-white text-xs sm:text-sm font-medium text-[#1A2138] leading-relaxed focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPostingJob || !jobPasteText.trim()}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-50 text-white text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {isPostingJob
                    ? 'Sharing Job to Live App...'
                    : `Share Job with Tag "${
                        customJobTagInput.trim() ||
                        (useAutoTitleTag && autoDetectedJobTitleTag
                          ? autoDetectedJobTitleTag
                          : jobCategory)
                      }" (${todayFormatted})`}
                </span>
              </button>
            </form>

            {/* MANAGE / REMOVE EXISTING JOBS */}
            <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#1A2138]">
                    Live Posted Jobs ({filteredAdminJobs.length})
                  </h3>
                  <p className="text-xs text-[#4A5568]">
                    Click Remove on any job to delete it immediately from the
                    frontend app.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {Array.from(
                    new Set([
                      'All',
                      'Quality & Safety',
                      'R&D Lab',
                      'Production',
                      ...jobs.map((j) => j.category).filter(Boolean)
                    ])
                  ).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setJobFilterCat(c)}
                      className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                        jobFilterCat === c
                          ? 'bg-[#1673B8] text-white'
                          : 'bg-[#EBF4FC] text-[#1A2138]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAdminJobs.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">
                  No jobs in this category. Paste a job above to publish one!
                </p>
              ) : (
                <div className="space-y-2.5">
                  {filteredAdminJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[10.5px] font-extrabold">
                            {job.category || job.specialization}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D2DEEA] text-[#4A5568] text-[10.5px] font-bold">
                            Posted: {job.postedAt || todayFormatted}
                          </span>
                          {job.country && (
                            <span className="text-[11px] font-bold text-[#1673B8]">
                              • {job.country}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-extrabold text-[#1A2138] leading-snug">
                          {job.title}
                        </h4>
                        <p className="text-xs text-[#4A5568] line-clamp-2 whitespace-pre-line">
                          {job.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteJob(job)}
                        className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: 1-BOX SMART PASTE SCHOLARSHIPS MANAGER (scholarships)
           ===================================================================== */}
        {activeTab === 'scholarships' && (
          <div className="space-y-5">
            {/* 1-BOX SCHOLARSHIP PASTE FORM */}
            <form
              onSubmit={handleSubmitQuickScholarship}
              className="bg-white border-2 border-[#1673B8] rounded-[26px] p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[11px] font-extrabold">
                    Simple 1-Box Scholarship Publisher
                  </span>
                  <h2 className="text-lg font-extrabold text-[#1A2138] mt-1">
                    Paste Full Scholarship Post &amp; Select Category
                  </h2>
                  <p className="text-xs text-[#4A5568] font-medium">
                    Choose the scholarship category, paste the entire
                    scholarship announcement in one box below, and click Share.
                    It publishes immediately with today&apos;s date (
                    {todayFormatted}).
                  </p>
                </div>
              </div>

              {/* STEP 1: CHOOSE SCHOLARSHIP CATEGORY */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-[#1A2138]">
                  1. Select Scholarship Category:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Fellowships', 'International', 'Grants'] as const).map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSchCategory(cat)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                          schCategory === cat
                            ? 'bg-[#1673B8] text-white border-[#1673B8] shadow-xs'
                            : 'bg-[#F0F6FC] text-[#1A2138] border-[#D2DEEA] hover:bg-[#EBF4FC]'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* STEP 2: SINGLE BOX TO PASTE FULL SCHOLARSHIP */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-[#1A2138]">
                    2. Paste Complete Scholarship Details Here (1st line becomes
                    Headline):
                  </label>
                  <span className="text-[11px] font-bold text-[#1673B8]">
                    Auto-Date: {todayFormatted}
                  </span>
                </div>
                <textarea
                  rows={7}
                  required
                  value={schPasteText}
                  onChange={(e) => setSchPasteText(e.target.value)}
                  placeholder={`Paste the full scholarship details here...\nExample:\nErasmus Mundus MSc Food Innovation Scholarship (Europe)\nFully funded fellowship for BS Food Science & Technology graduates.\nApply online at: https://example.org or email admissions@university.edu`}
                  className="w-full p-4 rounded-2xl bg-[#F0F6FC] border-[1.5px] border-[#94B8D7] focus:border-[#1673B8] focus:bg-white text-xs sm:text-sm font-medium text-[#1A2138] leading-relaxed focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPostingSch || !schPasteText.trim()}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-50 text-white text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {isPostingSch
                    ? 'Sharing Scholarship to Live App...'
                    : `Share Scholarship in "${schCategory}" (${todayFormatted})`}
                </span>
              </button>
            </form>

            {/* MANAGE / REMOVE EXISTING SCHOLARSHIPS */}
            <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#1A2138]">
                    Live Posted Scholarships ({filteredAdminScholarships.length})
                  </h3>
                  <p className="text-xs text-[#4A5568]">
                    Click Remove on any scholarship to delete it immediately
                    from the frontend app.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {['All', 'Fellowships', 'International', 'Grants'].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSchFilterCat(c)}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                          schFilterCat === c
                            ? 'bg-[#1673B8] text-white'
                            : 'bg-[#EBF4FC] text-[#1A2138]'
                        }`}
                      >
                        {c}
                      </button>
                    )
                  )}
                </div>
              </div>

              {filteredAdminScholarships.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">
                  No scholarships in this category. Paste a scholarship above to
                  publish one!
                </p>
              ) : (
                <div className="space-y-2.5">
                  {filteredAdminScholarships.map((sch) => (
                    <div
                      key={sch.id}
                      className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[10.5px] font-extrabold">
                            {sch.fundingType}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D2DEEA] text-[#4A5568] text-[10.5px] font-bold">
                            Date: {sch.deadline || todayFormatted}
                          </span>
                          {sch.country && (
                            <span className="text-[11px] font-bold text-[#1673B8]">
                              • {sch.country}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-extrabold text-[#1A2138] leading-snug">
                          {sch.title}
                        </h4>
                        <p className="text-xs text-[#4A5568] line-clamp-2 whitespace-pre-line">
                          {sch.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteScholarship(sch)}
                        className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5A: DIRECT CERTIFICATE GENERATOR & APPROVALS (certificates)
           ===================================================================== */}
        {(activeTab === 'certificates' || activeTab === 'trainings') && (
          <div className="space-y-5">
            {activeTab === 'certificates' && (
              <>
                {/* ADMIN DIRECT PORTRAIT CERTIFICATE GENERATOR (WITHOUT EXAM / WITHOUT MODULE STUDY — ANY COURSE OR CUSTOM TOPIC) */}
            <form
              onSubmit={handleAdminDirectGenerateAndIssue}
              className="bg-white border-2 border-[#1673B8] rounded-[26px] p-5 sm:p-6 shadow-md space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#1673B8] text-white text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    Direct Portrait PDF Certificate Generator (Without Exam / Study)
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#1A2138] mt-1.5">
                    Issue Instant Portrait Certificate (Official Certificate of Achievement Pattern) on Any Course or Custom Topic
                  </h2>
                  <p className="text-xs text-[#4A5568] font-medium leading-relaxed">
                    Administrators can directly issue an official <strong>Portrait A4 PDF Certificate</strong> to any candidate or member for any Published Training or Custom Topic without requiring prior module study or exam completion. The certificate downloads immediately in PDF format and verifies live on the Online Verification Portal.
                  </p>
                </div>
              </div>

              {/* Row 1: Optional Existing Member Picker + Recipient Full Name + Recipient Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    Auto-Fill from Existing Member (Optional)
                  </label>
                  <select
                    value={directSelectedUserUid}
                    onChange={(e) => handleSelectExistingMemberForCert(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  >
                    <option value="">-- External Candidate / Type Manually --</option>
                    {users.map((u) => (
                      <option key={u.uid} value={u.uid}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    Recipient Full Name (Printed on Certificate) *
                  </label>
                  <input
                    type="text"
                    required
                    value={directRecipientName}
                    onChange={(e) => setDirectRecipientName(e.target.value)}
                    placeholder="e.g., Muhammad Bilal Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    Recipient Email (Optional · For Account &amp; Portal Search)
                  </label>
                  <input
                    type="email"
                    value={directRecipientEmail}
                    onChange={(e) => setDirectRecipientEmail(e.target.value)}
                    placeholder="e.g., candidate@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
              </div>

              {/* Row 2: Mode Selector (Select from Published Trainings Dropdown vs. Any Custom Topic) */}
              <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-[#1A2138]">
                    Select Certification Topic Mode:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDirectTopicMode('catalog')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                        directTopicMode === 'catalog'
                          ? 'bg-[#1673B8] text-white shadow-xs'
                          : 'bg-white text-[#1A2138] border border-[#D2DEEA]'
                      }`}
                    >
                      Select from Trainings Dropdown ({trainings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirectTopicMode('custom')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                        directTopicMode === 'custom'
                          ? 'bg-[#1673B8] text-white shadow-xs'
                          : 'bg-white text-[#1A2138] border border-[#D2DEEA]'
                      }`}
                    >
                      Enter Any Custom Topic / Qualification Title
                    </button>
                  </div>
                </div>

                {directTopicMode === 'catalog' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                        Select Training Course (Added in Trainings Section) *
                      </label>
                      <select
                        value={directCatalogCourseId}
                        onChange={(e) => setDirectCatalogCourseId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      >
                        {trainings.length === 0 ? (
                          <option value="">
                            -- No trainings added yet (Add a training in Trainings section) --
                          </option>
                        ) : (
                          trainings.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                        Accreditation Standard / Benchmark (Printed on Certificate)
                      </label>
                      <input
                        type="text"
                        value={directAccreditationStd}
                        onChange={(e) => setDirectAccreditationStd(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                        Custom Certificate Topic / Qualification Title *
                      </label>
                      <input
                        type="text"
                        required={directTopicMode === 'custom'}
                        value={directCustomTopicTitle}
                        onChange={(e) => setDirectCustomTopicTitle(e.target.value)}
                        placeholder="e.g., ISO 22000:2018 Lead Auditor / Halal Food Standards"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                        Custom Qualification Code
                      </label>
                      <input
                        type="text"
                        value={directCustomCourseCode}
                        onChange={(e) => setDirectCustomCourseCode(e.target.value)}
                        placeholder="e.g., FS-ISO22K-LA"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                        Accreditation Benchmark
                      </label>
                      <input
                        type="text"
                        value={directAccreditationStd}
                        onChange={(e) => setDirectAccreditationStd(e.target.value)}
                        placeholder="e.g., ISO 19011 & GFSI International Standard"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3: Score / Standing, Issue Date, Optional Custom Certificate ID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    Score % &amp; Standing (60–74% Pass · 75–100% Distinction)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={60}
                      max={100}
                      value={directScorePct}
                      onChange={(e) => setDirectScorePct(Number(e.target.value))}
                      className="w-24 px-3 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-black text-[#1A2138]"
                    />
                    <span
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black ${
                        directScorePct >= 75
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-[#EBF4FC] text-[#105E9A] border border-[#D2DEEA]'
                      }`}
                    >
                      {directScorePct >= 75
                        ? `DISTINCTION (${directScorePct}%)`
                        : `PASS (${directScorePct}%)`}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    Certificate Issue Date
                  </label>
                  <input
                    type="text"
                    value={directIssueDate}
                    onChange={(e) => setDirectIssueDate(e.target.value)}
                    placeholder="e.g., 07 Nov 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    Certificate ID (Leave blank to Auto-Generate)
                  </label>
                  <input
                    type="text"
                    value={directCustomCertNumber}
                    onChange={(e) => setDirectCustomCertNumber(e.target.value)}
                    placeholder="Auto: FSP-XXXX-123456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isIssuingDirectCert}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-50 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-sm transition"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>
                  {isIssuingDirectCert
                    ? 'Generating Portrait PDF & Publishing to Registry...'
                    : 'Generate & Download Portrait A4 PDF Certificate + Publish to Online Verification'}
                </span>
              </button>

              {/* Live List of All Issued Certificates in Registry with Re-Download & Revoke */}
              {certificates.length > 0 && (
                <div className="pt-3 border-t border-[#D2DEEA] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#1A2138]">
                      Issued &amp; Live Verifiable Certificates Registry ({certificates.length})
                    </h3>
                    <span className="text-[11px] font-bold text-[#1673B8]">
                      Instant Portrait PDF Re-Download &amp; Verification Control
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {certificates.map((cert) => {
                      const matchedTr = trainings.find(
                        (t) =>
                          t.id === cert.courseId ||
                          t.title.trim().toLowerCase() === cert.trainingTitle.trim().toLowerCase()
                      );
                      const matchedCourse = INTERNATIONAL_TRAINING_COURSES.find(
                        (c) =>
                          c.id === cert.courseId ||
                          c.title.toLowerCase() === cert.trainingTitle.trim().toLowerCase()
                      );
                      const scoreVal = cert.scorePercentage || 85;
                      const isDist = Boolean(cert.distinction || scoreVal >= 75);
                      const certModulesList =
                        matchedTr?.customModules && matchedTr.customModules.length > 0
                          ? matchedTr.customModules.map(
                              (m, idx) => `Module ${idx + 1}: ${m.subject}`
                            )
                          : matchedCourse?.modules.map((m) => m.title);
                      return (
                        <div
                          key={cert.id}
                          className="p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-2 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono font-black text-[#1673B8] bg-white px-2 py-0.5 rounded border border-[#D2DEEA]">
                                {cert.certificateNumber}
                              </span>
                              <span className="font-extrabold text-[#1A2138]">
                                {cert.recipientName}
                              </span>
                              {cert.recipientEmail && (
                                <span className="text-[#4A5568]">
                                  ({cert.recipientEmail})
                                </span>
                              )}
                            </div>
                            <p className="font-bold text-[#105E9A]">
                              {cert.trainingTitle}{' '}
                              <span className="text-[#4A5568] font-medium">
                                • {scoreVal}% ({isDist ? 'Distinction' : 'Pass'}) • Issued: {cert.issueDate}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const matchedUserForCert = users.find(
                                  (u) =>
                                    (cert.recipientUid &&
                                      u.uid === cert.recipientUid) ||
                                    (cert.recipientEmail &&
                                      u.email?.trim().toLowerCase() ===
                                        cert.recipientEmail.trim().toLowerCase()) ||
                                    u.name?.trim().toLowerCase() ===
                                      cert.recipientName.trim().toLowerCase()
                                );
                                downloadOfficialCourseCertificatePdf({
                                  certificateNumber: cert.certificateNumber,
                                  recipientName: cert.recipientName,
                                  recipientEmail: cert.recipientEmail || '',
                                  recipientProfilePicUrl:
                                    matchedUserForCert?.profilePicUrl,
                                  courseTitle: cert.trainingTitle,
                                  courseCode:
                                    matchedTr?.standardCode ||
                                    matchedCourse?.code ||
                                    'FS-CERT-INTL',
                                  accreditationStandard:
                                    cert.accreditationBody ||
                                    matchedCourse?.accreditationStandard ||
                                    'Codex Alimentarius & GFSI Standard',
                                  scorePercentage: scoreVal,
                                  correctCount: Math.round((scoreVal / 100) * 40),
                                  totalQuestions: 40,
                                  distinction: isDist,
                                  issueDate: cert.issueDate,
                                  verificationPortalUrl: resolveOfficialVerificationBaseUrl(),
                                  syllabusModules: certModulesList,
                                  issuedByMode: 'admin_direct'
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Portrait PDF</span>
                            </button>
                            {onDeleteCertificate && (
                              <button
                                type="button"
                                onClick={() => onDeleteCertificate(cert.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </form>

            {/* CERTIFICATE DOWNLOAD APPROVAL REQUESTS (Rs. 1,000 PER CERTIFICATE) */}
            <div className="bg-white border-2 border-amber-500 rounded-[26px] p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold">
                    Rs. 1,000 Certificate Download &amp; Live Verification Requests
                  </span>
                  <h2 className="text-lg font-extrabold text-[#1A2138] mt-1">
                    Approve / Allow User Certificate Downloads
                  </h2>
                  <p className="text-xs text-[#4A5568] font-medium">
                    When a user passes the course exam and submits a Certificate Unlock or Bundle payment request, it appears here. Clicking <strong>Allow Certificate Download</strong> unlocks their Portrait PDF Certificate, activates their complimentary Paid Membership (1 Month for 1 Certificate or 1 Full Year for the All-13 Bundle), and publishes live verification on the website portal.
                  </p>
                </div>
              </div>

              {sortedPaymentRequests.filter(
                (r) =>
                  Boolean(r.certificateCourseId) ||
                  r.subscriptionPlan === 'certificate_unlock' ||
                  r.amount?.toLowerCase().includes('certificate')
              ).length === 0 ? (
                <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-xs font-semibold text-[#4A5568] text-center">
                  No pending Certificate Download requests at the moment.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {sortedPaymentRequests
                    .filter(
                      (r) =>
                        Boolean(r.certificateCourseId) ||
                        r.subscriptionPlan === 'certificate_unlock' ||
                        r.amount?.toLowerCase().includes('certificate')
                    )
                    .map((req) => (
                      <div
                        key={req.id}
                        className={`p-4 rounded-2xl border space-y-2.5 ${
                          req.status === 'pending'
                            ? 'bg-[#FFFDF5] border-2 border-[#F59E0B]'
                            : 'bg-[#F0F6FC] border-[#D2DEEA]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-extrabold text-[#1A2138]">
                              {req.userName} ({req.userEmail})
                            </div>
                            <div className="text-xs font-extrabold text-[#105E9A] mt-0.5">
                              Course: {req.certificateCourseTitle || req.notes}
                            </div>
                            {req.certificateNumber && (
                              <div className="text-xs font-mono font-bold text-slate-800">
                                Certificate ID: {req.certificateNumber}
                              </div>
                            )}
                            <div className="text-xs text-[#4A5568] mt-0.5">
                              {req.paymentMethod} • {req.amount} • TID: {req.transactionId}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                req.status === 'verified'
                                  ? 'bg-[#EBF4FC] text-[#105E9A]'
                                  : req.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-200 text-amber-950'
                              }`}
                            >
                              {req.status === 'verified'
                                ? 'APPROVED & LIVE'
                                : req.status.toUpperCase()}
                            </span>
                            <button
                              type="button"
                              onClick={() => onDeletePaymentRequest(req.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Delete this request record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {req.receiptImageUrl && (
                          <div className="rounded-xl overflow-hidden border border-[#D2DEEA] bg-white p-2">
                            <img
                              src={req.receiptImageUrl}
                              alt="Certificate Fee Receipt"
                              className="max-h-36 mx-auto object-contain rounded-lg"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onVerifyPayment(req, 'verified')}
                            className="py-2 px-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onVerifyPayment(req, 'rejected')}
                            className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeletePaymentRequest(req.id)}
                            className="py-2 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
              </>
            )}

            {activeTab === 'trainings' && (
              <>
                {/* ADD NEW INTERNATIONAL CERTIFICATION TRAINING FORM (WITH MANUAL MODULES + MANUAL MCQS) */}
                <form
                  onSubmit={handleCreateNewTraining}
                  className="bg-white border-2 border-[#1673B8] rounded-[26px] p-5 shadow-sm space-y-5"
                >
                  <div className="border-b border-[#D2DEEA] pb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[11px] font-extrabold">
                      International Certification Builder
                    </span>
                    <h2 className="text-lg font-extrabold text-[#1A2138] mt-1">
                      Add International Training — Title, Fee, Duration, Modules &amp; Manual MCQs
                    </h2>
                    <p className="text-xs text-[#4A5568] font-medium">
                      Create a new training course manually with its Title, Fee, Duration, Modules (Subject + Description), and Course MCQs (4 Options + 1 Correct Answer). Every training added here automatically appears in the Certificate Generator dropdown as well.
                    </p>
                  </div>

                  {/* Row 1: Training Title, Fee, Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                        Training Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={trTitle}
                        onChange={(e) => setTrTitle(e.target.value)}
                        placeholder="e.g., HACCP Level 3 / ISO 22000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                        Fee *
                      </label>
                      <input
                        type="text"
                        required
                        value={trFees}
                        onChange={(e) => setTrFees(e.target.value)}
                        placeholder="e.g., Rs. 1,000 Certificate"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                        Duration *
                      </label>
                      <input
                        type="text"
                        required
                        value={trDuration}
                        onChange={(e) => setTrDuration(e.target.value)}
                        placeholder="e.g., 10 Hours / 5 Days"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                  </div>

                  {/* Course Short Overview (Optional) */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                      Course Overview / Summary (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={trDesc}
                      onChange={(e) => setTrDesc(e.target.value)}
                      placeholder="Short course overview or certification description..."
                      className="w-full p-3 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>

                  {/* =================================================================
                      MODULES SECTION (MODULE SUBJECT + DESCRIPTION TAB + ADD BUTTON)
                     ================================================================= */}
                  <div className="p-4 rounded-2xl bg-[#F0F6FC] border-2 border-[#D2DEEA] space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#1673B8] text-white text-[11px] font-extrabold">
                          Modules Section ({trModulesList.length} Added)
                        </span>
                        <span className="text-xs font-extrabold text-[#1A2138]">
                          Module Subject + Description
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddModuleToNewTraining}
                        className="px-3 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>+ Add Module</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-start">
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Module Subject (Title)
                        </label>
                        <input
                          type="text"
                          value={modSubjectInput}
                          onChange={(e) => setModSubjectInput(e.target.value)}
                          placeholder={`e.g., Module ${trModulesList.length + 1}: Food Safety Principles`}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                        />
                      </div>
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Module Description / Study Content
                        </label>
                        <textarea
                          rows={2}
                          value={modDescInput}
                          onChange={(e) => setModDescInput(e.target.value)}
                          placeholder="Enter complete module description, key topics, and study notes..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-medium text-[#1A2138]"
                        />
                      </div>
                      <div className="sm:col-span-2 sm:pt-5">
                        <button
                          type="button"
                          onClick={handleAddModuleToNewTraining}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {trModulesList.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="text-[11px] font-extrabold text-[#105E9A]">
                          Added Modules Sequence (Will appear on Course &amp; Certificate):
                        </div>
                        {trModulesList.map((mod, idx) => (
                          <div
                            key={mod.id}
                            className="p-3 rounded-xl bg-white border border-[#D2DEEA] flex items-start justify-between gap-2.5 text-xs"
                          >
                            <div className="space-y-0.5 min-w-0">
                              <div className="font-extrabold text-[#1A2138]">
                                {idx + 1}. {mod.subject}
                              </div>
                              {mod.description && (
                                <p className="text-[#4A5568] text-[11px] whitespace-pre-line">
                                  {mod.description}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveModuleFromNewTraining(mod.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-extrabold shrink-0 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* =================================================================
                      MANUAL MCQS SECTION (QUESTION + 4 OPTIONS + 1 CORRECT ANSWER)
                     ================================================================= */}
                  <div className="p-4 rounded-2xl bg-[#F0F6FC] border-2 border-[#D2DEEA] space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#1A2138] text-white text-[11px] font-extrabold">
                          Course MCQs Section ({trMcqsList.length} Added)
                        </span>
                        <span className="text-xs font-extrabold text-[#1A2138]">
                          Add Manual MCQs (4 Options + 1 Correct Answer)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddMcqToNewTraining}
                        className="px-3 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>+ Add MCQ</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          MCQ Question
                        </label>
                        <input
                          type="text"
                          value={mcqQuestionInput}
                          onChange={(e) => setMcqQuestionInput(e.target.value)}
                          placeholder={`e.g., Q${trMcqsList.length + 1}: What is the minimum safe hot-holding temperature for high-risk foods?`}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                            Option A
                          </label>
                          <input
                            type="text"
                            value={mcqOptA}
                            onChange={(e) => setMcqOptA(e.target.value)}
                            placeholder="Enter Option A"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                            Option B
                          </label>
                          <input
                            type="text"
                            value={mcqOptB}
                            onChange={(e) => setMcqOptB(e.target.value)}
                            placeholder="Enter Option B"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                            Option C
                          </label>
                          <input
                            type="text"
                            value={mcqOptC}
                            onChange={(e) => setMcqOptC(e.target.value)}
                            placeholder="Enter Option C"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                            Option D
                          </label>
                          <input
                            type="text"
                            value={mcqOptD}
                            onChange={(e) => setMcqOptD(e.target.value)}
                            placeholder="Enter Option D"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-2.5 pt-1">
                        <div className="w-full sm:w-64">
                          <label className="block text-[11px] font-extrabold text-[#105E9A] mb-1">
                            Select Correct Answer (1 Correct Option) *
                          </label>
                          <select
                            value={mcqCorrectIdx}
                            onChange={(e) => setMcqCorrectIdx(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#1673B8] text-xs font-extrabold text-[#1A2138]"
                          >
                            <option value={0}>Option A is Correct</option>
                            <option value={1}>Option B is Correct</option>
                            <option value={2}>Option C is Correct</option>
                            <option value={3}>Option D is Correct</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddMcqToNewTraining}
                          className="py-2 px-4 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>+ Add This MCQ to Course</span>
                        </button>
                      </div>
                    </div>

                    {trMcqsList.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[#D2DEEA]">
                        <div className="text-[11px] font-extrabold text-[#105E9A]">
                          Added MCQs for This Course ({trMcqsList.length}):
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                          {trMcqsList.map((q, qIdx) => (
                            <div
                              key={q.id}
                              className="p-3 rounded-xl bg-white border border-[#D2DEEA] flex items-start justify-between gap-2.5 text-xs"
                            >
                              <div className="space-y-1 min-w-0">
                                <div className="font-extrabold text-[#1A2138]">
                                  Q{qIdx + 1}. {q.question}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                                  {q.options.map((opt, oIdx) => (
                                    <span
                                      key={oIdx}
                                      className={`px-2 py-0.5 rounded ${
                                        q.correctIndex === oIdx
                                          ? 'bg-[#EBF4FC] text-[#105E9A] font-extrabold border border-[#1673B8]/40'
                                          : 'text-[#4A5568]'
                                      }`}
                                    >
                                      {['A', 'B', 'C', 'D'][oIdx]}: {opt}{' '}
                                      {q.correctIndex === oIdx ? '✓ (Correct)' : ''}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveMcqFromNewTraining(q.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-extrabold shrink-0 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingTraining || !trTitle.trim()}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      {isSavingTraining
                        ? 'Saving Training...'
                        : 'Save & Publish Training (With Modules & MCQs) to Live App'}
                    </span>
                  </button>
                </form>

                {/* PUBLISHED TRAININGS — EDIT PRICES, MODULES, MCQS, VISIBILITY OR REMOVE */}
                <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
                  <div className="border-b border-[#D2DEEA] pb-3">
                    <h3 className="text-base font-extrabold text-[#1A2138]">
                      Published Trainings — Manage Modules, MCQs, Prices or Remove ({trainings.length})
                    </h3>
                    <p className="text-xs text-[#4A5568]">
                      Manage every training course below: add or edit its Modules (Subject + Description) and Manual MCQs (4 Options + 1 Correct Answer), update fee/duration, or remove it.
                    </p>
                  </div>

                  {trainings.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-center text-xs font-semibold text-[#4A5568]">
                      No training courses have been added yet. Use the form above to add your first International Certification training course (with Modules and MCQs).
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trainings.map((tr) => {
                        const currentFeeVal =
                          priceEdits[tr.id]?.fees !== undefined
                            ? priceEdits[tr.id].fees
                            : tr.fees;
                        const currentDurVal =
                          priceEdits[tr.id]?.duration !== undefined
                            ? priceEdits[tr.id].duration
                            : tr.duration;
                        const isBuilderOpen = expandedTrIdForBuilder === tr.id;
                        const trMods = tr.customModules || [];
                        const trMcqs = tr.customMcqs || [];

                        return (
                          <div
                            key={tr.id}
                            className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3.5"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[10.5px] font-extrabold">
                                    {tr.category}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D2DEEA] text-[#1673B8] text-[10.5px] font-extrabold">
                                    {trMods.length} Modules
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D2DEEA] text-[#1A2138] text-[10.5px] font-extrabold">
                                    {trMcqs.length} MCQs
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                      tr.isActive !== false
                                        ? 'bg-[#EBF4FC] text-[#105E9A]'
                                        : 'bg-slate-200 text-slate-600'
                                    }`}
                                  >
                                    {tr.isActive !== false ? 'ACTIVE ON APP' : 'HIDDEN'}
                                  </span>
                                </div>
                                <h4 className="text-sm font-extrabold text-[#1A2138] mt-1">
                                  {tr.title}
                                </h4>
                                <p className="text-xs text-[#4A5568] line-clamp-2 mt-0.5">
                                  {tr.description}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedTrIdForBuilder(
                                      isBuilderOpen ? null : tr.id
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer"
                                >
                                  {isBuilderOpen
                                    ? 'Close Modules & MCQs'
                                    : `+ Modules (${trMods.length}) & MCQs (${trMcqs.length})`}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onSaveTraining({
                                      ...tr,
                                      isActive: tr.isActive === false ? true : false
                                    })
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBF4FC] text-[#1A2138] border border-[#D2DEEA] text-xs font-extrabold cursor-pointer"
                                >
                                  {tr.isActive === false ? 'Show on App' : 'Hide'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteTraining(tr)}
                                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>

                            {/* INLINE PRICE & DURATION EDITOR */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#D2DEEA] items-end">
                              <div>
                                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                  Course Fee / Price (Live)
                                </label>
                                <input
                                  type="text"
                                  value={currentFeeVal}
                                  onChange={(e) =>
                                    setPriceEdits((prev) => ({
                                      ...prev,
                                      [tr.id]: {
                                        fees: e.target.value,
                                        duration: currentDurVal
                                      }
                                    }))
                                  }
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  value={currentDurVal}
                                  onChange={(e) =>
                                    setPriceEdits((prev) => ({
                                      ...prev,
                                      [tr.id]: {
                                        fees: currentFeeVal,
                                        duration: e.target.value
                                      }
                                    }))
                                  }
                                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleUpdateCoursePrice(tr)}
                                className="py-2 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors h-[36px]"
                              >
                                <Check className="w-4 h-4 stroke-[2.5]" />
                                <span>Save Price &amp; Update Live</span>
                              </button>
                            </div>

                            {/* EXPANDABLE MODULES & MCQS MANAGER FOR THIS EXISTING TRAINING */}
                            {isBuilderOpen && (
                              <div className="pt-3 border-t-2 border-[#1673B8]/30 space-y-4">
                                {/* 1. Manage Modules for this Course */}
                                <div className="p-3.5 rounded-2xl bg-white border border-[#D2DEEA] space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-extrabold text-[#1A2138]">
                                      Course Modules ({trMods.length}) — Add Module Subject + Description
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAddModuleToExistingTraining(tr)
                                      }
                                      className="px-3 py-1 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>+ Add Module</span>
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start">
                                    <div className="sm:col-span-4">
                                      <input
                                        type="text"
                                        value={cardModSubject}
                                        onChange={(e) =>
                                          setCardModSubject(e.target.value)
                                        }
                                        placeholder="Module Subject..."
                                        className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                                      />
                                    </div>
                                    <div className="sm:col-span-6">
                                      <textarea
                                        rows={2}
                                        value={cardModDesc}
                                        onChange={(e) =>
                                          setCardModDesc(e.target.value)
                                        }
                                        placeholder="Module Description & study details..."
                                        className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-medium text-[#1A2138]"
                                      />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleAddModuleToExistingTraining(tr)
                                        }
                                        className="w-full py-2 px-3 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                                      >
                                        + Add
                                      </button>
                                    </div>
                                  </div>

                                  {trMods.length > 0 && (
                                    <div className="space-y-1.5">
                                      {trMods.map((m, idx) => (
                                        <div
                                          key={m.id}
                                          className="p-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] flex items-start justify-between gap-2 text-xs"
                                        >
                                          <div>
                                            <span className="font-extrabold text-[#1A2138]">
                                              {idx + 1}. {m.subject}
                                            </span>
                                            {m.description && (
                                              <p className="text-[11px] text-[#4A5568] mt-0.5 whitespace-pre-line">
                                                {m.description}
                                              </p>
                                            )}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDeleteModuleFromExistingTraining(
                                                tr,
                                                m.id
                                              )
                                            }
                                            className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-extrabold shrink-0 cursor-pointer"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* 2. Manage Manual MCQs for this Course */}
                                <div className="p-3.5 rounded-2xl bg-white border border-[#D2DEEA] space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-extrabold text-[#1A2138]">
                                      Course Final Exam MCQs ({trMcqs.length}) — 4 Options + 1 Correct Answer
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAddMcqToExistingTraining(tr)
                                      }
                                      className="px-3 py-1 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>+ Add MCQ</span>
                                    </button>
                                  </div>

                                  <input
                                    type="text"
                                    value={cardMcqQuestion}
                                    onChange={(e) =>
                                      setCardMcqQuestion(e.target.value)
                                    }
                                    placeholder="Enter MCQ Question..."
                                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                                  />

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={cardMcqOptA}
                                      onChange={(e) =>
                                        setCardMcqOptA(e.target.value)
                                      }
                                      placeholder="Option A"
                                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                                    />
                                    <input
                                      type="text"
                                      value={cardMcqOptB}
                                      onChange={(e) =>
                                        setCardMcqOptB(e.target.value)
                                      }
                                      placeholder="Option B"
                                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                                    />
                                    <input
                                      type="text"
                                      value={cardMcqOptC}
                                      onChange={(e) =>
                                        setCardMcqOptC(e.target.value)
                                      }
                                      placeholder="Option C"
                                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                                    />
                                    <input
                                      type="text"
                                      value={cardMcqOptD}
                                      onChange={(e) =>
                                        setCardMcqOptD(e.target.value)
                                      }
                                      placeholder="Option D"
                                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                                    />
                                  </div>

                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <select
                                      value={cardMcqCorrectIdx}
                                      onChange={(e) =>
                                        setCardMcqCorrectIdx(
                                          Number(e.target.value)
                                        )
                                      }
                                      className="px-3 py-2 rounded-xl bg-[#F0F6FC] border-2 border-[#1673B8] text-xs font-extrabold text-[#1A2138]"
                                    >
                                      <option value={0}>Option A is Correct</option>
                                      <option value={1}>Option B is Correct</option>
                                      <option value={2}>Option C is Correct</option>
                                      <option value={3}>Option D is Correct</option>
                                    </select>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAddMcqToExistingTraining(tr)
                                      }
                                      className="py-2 px-4 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                                    >
                                      + Save MCQ to Course
                                    </button>
                                  </div>

                                  {trMcqs.length > 0 && (
                                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                                      {trMcqs.map((q, qIdx) => (
                                        <div
                                          key={q.id}
                                          className="p-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] flex items-start justify-between gap-2 text-xs"
                                        >
                                          <div className="space-y-0.5">
                                            <div className="font-extrabold text-[#1A2138]">
                                              Q{qIdx + 1}. {q.question}
                                            </div>
                                            <div className="text-[11px] text-[#105E9A] font-bold">
                                              Correct: {['A', 'B', 'C', 'D'][q.correctIndex]} ({q.options[q.correctIndex]})
                                            </div>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDeleteMcqFromExistingTraining(
                                                tr,
                                                q.id
                                              )
                                            }
                                            className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-extrabold shrink-0 cursor-pointer"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 6: PAYMENT GATEWAY SETTINGS (JazzCash, EasyPaisa, Bank Transfer & Prices)
           ===================================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-5">
            <form
              onSubmit={onSaveStorageConfig}
              className="bg-white border-2 border-[#1673B8] rounded-[26px] p-5 shadow-sm space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3.5">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[11px] font-extrabold">
                    Live Payment Gateway Configuration
                  </span>
                  <h2 className="text-lg font-extrabold text-[#1A2138] mt-1">
                    Modify EasyPaisa, JazzCash, Bank Transfer &amp; Subscription Fees
                  </h2>
                  <p className="text-xs text-[#4A5568] font-medium">
                    Any changes saved here immediately update the payment
                    details shown to all users when purchasing Premium
                    Membership.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-extrabold">
                  {liveYearlyDiscountPct}% OFF Yearly Active
                </span>
              </div>

              {/* SUBSCRIPTION PLAN FEES (Monthly Rs. 100 & Yearly Rs. 900 with Auto-Calculated Discount %) */}
              <div className="p-4 rounded-2xl bg-[#F0F6FC] border-2 border-[#1673B8] space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-[#D97706]" />
                    <span>Premium Package Prices &amp; Auto-Discount Calculator (PKR)</span>
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#105E9A] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoApply25PctYearly}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAutoApply25PctYearly(checked);
                        if (checked) {
                          const currentMo =
                            Number(storageConfig.paymentGateway?.monthlyFeeRs) ||
                            100;
                          const autoYr = Math.round(currentMo * 12 * 0.75);
                          onChangeStorageConfig({
                            ...storageConfig,
                            paymentGateway: {
                              jazzCashTitle:
                                storageConfig.paymentGateway?.jazzCashTitle ||
                                'Muneeb Khan',
                              jazzCashNumber:
                                storageConfig.paymentGateway?.jazzCashNumber ||
                                '0324-0906384',
                              easyPaisaTitle:
                                storageConfig.paymentGateway?.easyPaisaTitle ||
                                'Muneeb Khan',
                              easyPaisaNumber:
                                storageConfig.paymentGateway?.easyPaisaNumber ||
                                '0324-0906384',
                              bankTitle:
                                storageConfig.paymentGateway?.bankTitle ||
                                'Muneeb Khan',
                              bankName:
                                storageConfig.paymentGateway?.bankName ||
                                'Bank Transfer',
                              bankAccountOrIban:
                                storageConfig.paymentGateway?.bankAccountOrIban ||
                                'Contact on WhatsApp for IBAN',
                              bankWhatsapp:
                                storageConfig.paymentGateway?.bankWhatsapp ||
                                '+92 324 0906384',
                              monthlyFeeRs: currentMo,
                              yearlyFeeRs: autoYr,
                              customPriceUpdated: true
                            }
                          });
                        }
                      }}
                      className="w-3.5 h-3.5 accent-[#1673B8] rounded cursor-pointer"
                    />
                    <span>Auto-Apply 25% OFF on Yearly When Monthly Changes</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                      1-Month Subscription Fee (Rs.)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={storageConfig.paymentGateway?.monthlyFeeRs ?? 100}
                      onChange={(e) => {
                        const rawVal = Number(e.target.value);
                        const nextMonthly = rawVal >= 0 ? rawVal : 100;
                        const nextYearly = autoApply25PctYearly
                          ? Math.round(nextMonthly * 12 * 0.75)
                          : storageConfig.paymentGateway?.yearlyFeeRs ?? 900;
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle:
                              storageConfig.paymentGateway?.jazzCashTitle ||
                              'Muneeb Khan',
                            jazzCashNumber:
                              storageConfig.paymentGateway?.jazzCashNumber ||
                              '0324-0906384',
                            easyPaisaTitle:
                              storageConfig.paymentGateway?.easyPaisaTitle ||
                              'Muneeb Khan',
                            easyPaisaNumber:
                              storageConfig.paymentGateway?.easyPaisaNumber ||
                              '0324-0906384',
                            bankTitle:
                              storageConfig.paymentGateway?.bankTitle ||
                              'Muneeb Khan',
                            bankName:
                              storageConfig.paymentGateway?.bankName ||
                              'Bank Transfer',
                            bankAccountOrIban:
                              storageConfig.paymentGateway?.bankAccountOrIban ||
                              'Contact on WhatsApp for IBAN',
                            bankWhatsapp:
                              storageConfig.paymentGateway?.bankWhatsapp ||
                              '+92 324 0906384',
                            monthlyFeeRs: nextMonthly,
                            yearlyFeeRs: nextYearly,
                            customPriceUpdated: true
                          }
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                      Full Year (12 Months) Fee — ({liveYearlyDiscountPct}% Discount) (Rs.)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={storageConfig.paymentGateway?.yearlyFeeRs ?? 900}
                      onChange={(e) => {
                        setAutoApply25PctYearly(false);
                        const rawVal = Number(e.target.value);
                        const nextYearly = rawVal >= 0 ? rawVal : 900;
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle:
                              storageConfig.paymentGateway?.jazzCashTitle ||
                              'Muneeb Khan',
                            jazzCashNumber:
                              storageConfig.paymentGateway?.jazzCashNumber ||
                              '0324-0906384',
                            easyPaisaTitle:
                              storageConfig.paymentGateway?.easyPaisaTitle ||
                              'Muneeb Khan',
                            easyPaisaNumber:
                              storageConfig.paymentGateway?.easyPaisaNumber ||
                              '0324-0906384',
                            bankTitle:
                              storageConfig.paymentGateway?.bankTitle ||
                              'Muneeb Khan',
                            bankName:
                              storageConfig.paymentGateway?.bankName ||
                              'Bank Transfer',
                            bankAccountOrIban:
                              storageConfig.paymentGateway?.bankAccountOrIban ||
                              'Contact on WhatsApp for IBAN',
                            bankWhatsapp:
                              storageConfig.paymentGateway?.bankWhatsapp ||
                              '+92 324 0906384',
                            monthlyFeeRs:
                              storageConfig.paymentGateway?.monthlyFeeRs ?? 100,
                            yearlyFeeRs: nextYearly,
                            customPriceUpdated: true
                          }
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                    />
                  </div>
                </div>

                {/* Live Auto-Calculated Discount Percentage & App Sync Preview */}
                <div className="p-3.5 rounded-xl bg-white border border-[#94B8D7] flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-extrabold text-[#1A2138] flex items-center gap-2 flex-wrap">
                      <span>Auto-Calculated Yearly Discount:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1673B8] text-white text-xs font-extrabold">
                        {liveYearlyDiscountPct}% OFF
                      </span>
                      <span className="text-[#105E9A]">
                        (User Saves Rs. {liveYearlySavingsRs.toLocaleString()} / Year)
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#4A5568]">
                      Regular 12-Month Cost: Rs. {fullYearBaseFee.toLocaleString()} • Discounted Yearly Price: Rs. {liveYearlyFee.toLocaleString()} • Updates everywhere in the app automatically when saved!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentMo =
                        Number(storageConfig.paymentGateway?.monthlyFeeRs) || 100;
                      const autoYr = Math.round(currentMo * 12 * 0.75);
                      setAutoApply25PctYearly(true);
                      onChangeStorageConfig({
                        ...storageConfig,
                        paymentGateway: {
                          jazzCashTitle:
                            storageConfig.paymentGateway?.jazzCashTitle ||
                            'Muneeb Khan',
                          jazzCashNumber:
                            storageConfig.paymentGateway?.jazzCashNumber ||
                            '0324-0906384',
                          easyPaisaTitle:
                            storageConfig.paymentGateway?.easyPaisaTitle ||
                            'Muneeb Khan',
                          easyPaisaNumber:
                            storageConfig.paymentGateway?.easyPaisaNumber ||
                            '0324-0906384',
                          bankTitle:
                            storageConfig.paymentGateway?.bankTitle ||
                            'Muneeb Khan',
                          bankName:
                            storageConfig.paymentGateway?.bankName ||
                            'Bank Transfer',
                          bankAccountOrIban:
                            storageConfig.paymentGateway?.bankAccountOrIban ||
                            'Contact on WhatsApp for IBAN',
                          bankWhatsapp:
                            storageConfig.paymentGateway?.bankWhatsapp ||
                            '+92 324 0906384',
                          monthlyFeeRs: currentMo,
                          yearlyFeeRs: autoYr,
                          customPriceUpdated: true
                        }
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] text-[11px] font-extrabold cursor-pointer transition-colors shrink-0"
                  >
                    Set Exact 25% OFF (Rs. {Math.round(liveMonthlyFee * 12 * 0.75)})
                  </button>
                </div>
              </div>

              {/* 1. JAZZCASH DETAILS */}
              <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
                <div className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider">
                  1. JazzCash Account Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1A2138] mb-1">
                      JazzCash Account Title
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.paymentGateway?.jazzCashTitle ??
                        'Muneeb Khan'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle: e.target.value,
                            jazzCashNumber:
                              storageConfig.paymentGateway?.jazzCashNumber ??
                              '0324-0906384',
                            easyPaisaTitle:
                              storageConfig.paymentGateway?.easyPaisaTitle ??
                              'Muneeb Khan',
                            easyPaisaNumber:
                              storageConfig.paymentGateway?.easyPaisaNumber ??
                              '0324-0906384',
                            bankTitle:
                              storageConfig.paymentGateway?.bankTitle ??
                              'Muneeb Khan',
                            bankName:
                              storageConfig.paymentGateway?.bankName ??
                              'Bank Transfer',
                            bankAccountOrIban:
                              storageConfig.paymentGateway?.bankAccountOrIban ??
                              'Contact on WhatsApp for IBAN',
                            bankWhatsapp:
                              storageConfig.paymentGateway?.bankWhatsapp ??
                              '+92 324 0906384',
                            monthlyFeeRs:
                              storageConfig.paymentGateway?.monthlyFeeRs ?? 100,
                            yearlyFeeRs:
                              storageConfig.paymentGateway?.yearlyFeeRs ?? 900
                          }
                        })
                      }
                      placeholder="e.g. Muneeb Khan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A2138] mb-1">
                      JazzCash Account Number
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.paymentGateway?.jazzCashNumber ??
                        '0324-0906384'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle:
                              storageConfig.paymentGateway?.jazzCashTitle ??
                              'Muneeb Khan',
                            jazzCashNumber: e.target.value,
                            easyPaisaTitle:
                              storageConfig.paymentGateway?.easyPaisaTitle ??
                              'Muneeb Khan',
                            easyPaisaNumber:
                              storageConfig.paymentGateway?.easyPaisaNumber ??
                              '0324-0906384',
                            bankTitle:
                              storageConfig.paymentGateway?.bankTitle ??
                              'Muneeb Khan',
                            bankName:
                              storageConfig.paymentGateway?.bankName ??
                              'Bank Transfer',
                            bankAccountOrIban:
                              storageConfig.paymentGateway?.bankAccountOrIban ??
                              'Contact on WhatsApp for IBAN',
                            bankWhatsapp:
                              storageConfig.paymentGateway?.bankWhatsapp ??
                              '+92 324 0906384',
                            monthlyFeeRs:
                              storageConfig.paymentGateway?.monthlyFeeRs ?? 100,
                            yearlyFeeRs:
                              storageConfig.paymentGateway?.yearlyFeeRs ?? 900
                          }
                        })
                      }
                      placeholder="e.g. 0324-0906384"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. EASYPAISA DETAILS */}
              <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
                <div className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider">
                  2. EasyPaisa Account Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1A2138] mb-1">
                      EasyPaisa Account Title
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.paymentGateway?.easyPaisaTitle ??
                        'Muneeb Khan'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle:
                              storageConfig.paymentGateway?.jazzCashTitle ??
                              'Muneeb Khan',
                            jazzCashNumber:
                              storageConfig.paymentGateway?.jazzCashNumber ??
                              '0324-0906384',
                            easyPaisaTitle: e.target.value,
                            easyPaisaNumber:
                              storageConfig.paymentGateway?.easyPaisaNumber ??
                              '0324-0906384',
                            bankTitle:
                              storageConfig.paymentGateway?.bankTitle ??
                              'Muneeb Khan',
                            bankName:
                              storageConfig.paymentGateway?.bankName ??
                              'Bank Transfer',
                            bankAccountOrIban:
                              storageConfig.paymentGateway?.bankAccountOrIban ??
                              'Contact on WhatsApp for IBAN',
                            bankWhatsapp:
                              storageConfig.paymentGateway?.bankWhatsapp ??
                              '+92 324 0906384',
                            monthlyFeeRs:
                              storageConfig.paymentGateway?.monthlyFeeRs ?? 100,
                            yearlyFeeRs:
                              storageConfig.paymentGateway?.yearlyFeeRs ?? 900
                          }
                        })
                      }
                      placeholder="e.g. Muneeb Khan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A2138] mb-1">
                      EasyPaisa Account Number
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.paymentGateway?.easyPaisaNumber ??
                        '0324-0906384'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle:
                              storageConfig.paymentGateway?.jazzCashTitle ??
                              'Muneeb Khan',
                            jazzCashNumber:
                              storageConfig.paymentGateway?.jazzCashNumber ??
                              '0324-0906384',
                            easyPaisaTitle:
                              storageConfig.paymentGateway?.easyPaisaTitle ??
                              'Muneeb Khan',
                            easyPaisaNumber: e.target.value,
                            bankTitle:
                              storageConfig.paymentGateway?.bankTitle ??
                              'Muneeb Khan',
                            bankName:
                              storageConfig.paymentGateway?.bankName ??
                              'Bank Transfer',
                            bankAccountOrIban:
                              storageConfig.paymentGateway?.bankAccountOrIban ??
                              'Contact on WhatsApp for IBAN',
                            bankWhatsapp:
                              storageConfig.paymentGateway?.bankWhatsapp ??
                              '+92 324 0906384',
                            monthlyFeeRs:
                              storageConfig.paymentGateway?.monthlyFeeRs ?? 100,
                            yearlyFeeRs:
                              storageConfig.paymentGateway?.yearlyFeeRs ?? 900
                          }
                        })
                      }
                      placeholder="e.g. 0324-0906384"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. BANK TRANSFER DETAILS */}
              <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
                <div className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider">
                  3. Bank Transfer Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1A2138] mb-1">
                      Bank Account Title
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.paymentGateway?.bankTitle ?? 'Muneeb Khan'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle:
                              storageConfig.paymentGateway?.jazzCashTitle ??
                              'Muneeb Khan',
                            jazzCashNumber:
                              storageConfig.paymentGateway?.jazzCashNumber ??
                              '0324-0906384',
                            easyPaisaTitle:
                              storageConfig.paymentGateway?.easyPaisaTitle ??
                              'Muneeb Khan',
                            easyPaisaNumber:
                              storageConfig.paymentGateway?.easyPaisaNumber ??
                              '0324-0906384',
                            bankTitle: e.target.value,
                            bankName:
                              storageConfig.paymentGateway?.bankName ??
                              'Bank Transfer',
                            bankAccountOrIban:
                              storageConfig.paymentGateway?.bankAccountOrIban ??
                              'Contact on WhatsApp for IBAN',
                            bankWhatsapp:
                              storageConfig.paymentGateway?.bankWhatsapp ??
                              '+92 324 0906384',
                            monthlyFeeRs:
                              storageConfig.paymentGateway?.monthlyFeeRs ?? 100,
                            yearlyFeeRs:
                              storageConfig.paymentGateway?.yearlyFeeRs ?? 900
                          }
                        })
                      }
                      placeholder="e.g. Muneeb Khan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A2138] mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.paymentGateway?.bankName ??
                        'Allied Bank / Bank Transfer'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle:
                              storageConfig.paymentGateway?.jazzCashTitle ??
                              'Muneeb Khan',
                            jazzCashNumber:
                              storageConfig.paymentGateway?.jazzCashNumber ??
                              '0324-0906384',
                            easyPaisaTitle:
                              storageConfig.paymentGateway?.easyPaisaTitle ??
                              'Muneeb Khan',
                            easyPaisaNumber:
                              storageConfig.paymentGateway?.easyPaisaNumber ??
                              '0324-0906384',
                            bankTitle:
                              storageConfig.paymentGateway?.bankTitle ??
                              'Muneeb Khan',
                            bankName: e.target.value,
                            bankAccountOrIban:
                              storageConfig.paymentGateway?.bankAccountOrIban ??
                              'Contact on WhatsApp for IBAN',
                            bankWhatsapp:
                              storageConfig.paymentGateway?.bankWhatsapp ??
                              '+92 324 0906384',
                            monthlyFeeRs:
                              storageConfig.paymentGateway?.monthlyFeeRs ?? 100,
                            yearlyFeeRs:
                              storageConfig.paymentGateway?.yearlyFeeRs ?? 900
                          }
                        })
                      }
                      placeholder="e.g. Meezan Bank / Allied Bank"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A2138] mb-1">
                      Account Number / IBAN
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.paymentGateway?.bankAccountOrIban ??
                        'Contact on WhatsApp for IBAN'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle:
                              storageConfig.paymentGateway?.jazzCashTitle ??
                              'Muneeb Khan',
                            jazzCashNumber:
                              storageConfig.paymentGateway?.jazzCashNumber ??
                              '0324-0906384',
                            easyPaisaTitle:
                              storageConfig.paymentGateway?.easyPaisaTitle ??
                              'Muneeb Khan',
                            easyPaisaNumber:
                              storageConfig.paymentGateway?.easyPaisaNumber ??
                              '0324-0906384',
                            bankTitle:
                              storageConfig.paymentGateway?.bankTitle ??
                              'Muneeb Khan',
                            bankName:
                              storageConfig.paymentGateway?.bankName ??
                              'Bank Transfer',
                            bankAccountOrIban: e.target.value,
                            bankWhatsapp:
                              storageConfig.paymentGateway?.bankWhatsapp ??
                              '+92 324 0906384',
                            monthlyFeeRs:
                              storageConfig.paymentGateway?.monthlyFeeRs ?? 100,
                            yearlyFeeRs:
                              storageConfig.paymentGateway?.yearlyFeeRs ?? 900
                          }
                        })
                      }
                      placeholder="e.g. PK36 MEZN 0000 ..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A2138] mb-1">
                      WhatsApp / Contact Number
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.paymentGateway?.bankWhatsapp ??
                        '+92 324 0906384'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          paymentGateway: {
                            jazzCashTitle:
                              storageConfig.paymentGateway?.jazzCashTitle ??
                              'Muneeb Khan',
                            jazzCashNumber:
                              storageConfig.paymentGateway?.jazzCashNumber ??
                              '0324-0906384',
                            easyPaisaTitle:
                              storageConfig.paymentGateway?.easyPaisaTitle ??
                              'Muneeb Khan',
                            easyPaisaNumber:
                              storageConfig.paymentGateway?.easyPaisaNumber ??
                              '0324-0906384',
                            bankTitle:
                              storageConfig.paymentGateway?.bankTitle ??
                              'Muneeb Khan',
                            bankName:
                              storageConfig.paymentGateway?.bankName ??
                              'Bank Transfer',
                            bankAccountOrIban:
                              storageConfig.paymentGateway?.bankAccountOrIban ??
                              'Contact on WhatsApp for IBAN',
                            bankWhatsapp: e.target.value,
                            monthlyFeeRs:
                              storageConfig.paymentGateway?.monthlyFeeRs ?? 100,
                            yearlyFeeRs:
                              storageConfig.paymentGateway?.yearlyFeeRs ?? 900
                          }
                        })
                      }
                      placeholder="e.g. +92 324 0906384"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. OFFICIAL WHATSAPP CHANNEL BUTTON & LINK CONTROL (HOME SCREEN) */}
              <div className="p-4 rounded-2xl bg-[#F0F6FC] border-2 border-[#1673B8] space-y-3">
                <div className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#1673B8]" />
                  <span>4. Home Screen WhatsApp Channel Link &amp; Button</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1A2138] mb-1">
                      Official WhatsApp Channel URL
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.whatsappChannelUrl ??
                        'https://whatsapp.com/channel/0029VaFoodSpecialists'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          whatsappChannelUrl: e.target.value
                        })
                      }
                      placeholder="https://whatsapp.com/channel/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1A2138] mb-1">
                      WhatsApp Button Label on Home Page
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.whatsappChannelButtonText ??
                        'Follow WhatsApp Channel'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          whatsappChannelButtonText: e.target.value
                        })
                      }
                      placeholder="Follow WhatsApp Channel"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>
                  Save Payment Gateway &amp; WhatsApp Channel Link (Live on App)
                </span>
              </button>
            </form>
          </div>
        )}

        {/* =====================================================================
            TAB 7: CLOUD STORAGE & FULL BACKUP (storage)
           ===================================================================== */}
        {activeTab === 'storage' && (
          <div className="space-y-4">
            <form
              onSubmit={onSaveStorageConfig}
              className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#1A2138]">
                    Cloud Media Storage &amp; Database Backup
                  </h2>
                  <p className="text-xs text-[#4A5568]">
                    Configure how user avatars, CVs, and payment screenshots are
                    stored.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="px-3.5 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full JSON Backup</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <label
                  onClick={() =>
                    onChangeStorageConfig({
                      ...storageConfig,
                      provider: 'smart-firestore'
                    })
                  }
                  className={`block p-3.5 rounded-2xl border cursor-pointer ${
                    storageConfig.provider === 'smart-firestore'
                      ? 'bg-[#F0F6FC] border-2 border-[#1673B8]'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="text-xs font-extrabold text-[#1A2138]">
                    Tier 1: Smart WebP Compression + Firebase Firestore Vault
                  </div>
                  <p className="text-[11px] text-[#4A5568] mt-0.5">
                    Automatically compresses images &amp; receipts before
                    storing directly in Firestore.
                  </p>
                </label>

                <label
                  onClick={() =>
                    onChangeStorageConfig({
                      ...storageConfig,
                      provider: 'cloudinary'
                    })
                  }
                  className={`block p-3.5 rounded-2xl border cursor-pointer ${
                    storageConfig.provider === 'cloudinary'
                      ? 'bg-[#F0F6FC] border-2 border-[#1673B8]'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="text-xs font-extrabold text-[#1A2138]">
                    Tier 2: Cloudinary 25 GB Free Global CDN
                  </div>
                  <p className="text-[11px] text-[#4A5568] mt-0.5">
                    Uploads media to Cloudinary CDN and stores HTTPS links in
                    Firestore.
                  </p>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer transition-colors"
              >
                Save Cloud Storage Settings
              </button>
            </form>
          </div>
        )}
        </div>
      </main>

      {/* CONSTANT BOTTOM FOOTER IN ADMIN CONTROL PANEL */}
      <footer className="shrink-0 z-40 bg-white border-t border-[#D2DEEA] px-4 py-2 shadow-[0_-6px_24px_rgba(22,115,184,0.08)]">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-1.5 text-center">
          <div className="flex items-center gap-3 text-[11px] font-bold text-[#1A2138]">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`cursor-pointer ${
                activeTab === 'overview' ? 'text-[#1673B8] underline' : 'text-[#4A5568]'
              }`}
            >
              Dashboard
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`cursor-pointer ${
                activeTab === 'users' ? 'text-[#1673B8] underline' : 'text-[#4A5568]'
              }`}
            >
              Users ({stats.totalUsers})
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className={`cursor-pointer ${
                activeTab === 'jobs' ? 'text-[#1673B8] underline' : 'text-[#4A5568]'
              }`}
            >
              Jobs ({jobs.length})
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('scholarships')}
              className={`cursor-pointer ${
                activeTab === 'scholarships' ? 'text-[#1673B8] underline' : 'text-[#4A5568]'
              }`}
            >
              Scholarships ({scholarships.length})
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={`cursor-pointer ${
                activeTab === 'payments' ? 'text-[#1673B8] underline' : 'text-[#4A5568]'
              }`}
            >
              Payments
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
