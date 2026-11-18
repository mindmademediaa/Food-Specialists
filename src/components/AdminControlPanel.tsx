import React, { useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Crown,
  Database,
  Download,
  DollarSign,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  GraduationCap,
  Headset,
  Image as ImageIcon,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Send,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  UserCheck,
  UserX,
  Users,
  X
} from 'lucide-react';
import {
  CloudStorageConfig,
  CustomAdBannerItem,
  CustomTrainingItem,
  CustomTrainingMCQ,
  CustomTrainingModule,
  CustomTrainingRegistration,
  DEFAULT_CUSTOM_TRAININGS,
  FrontPageContentConfig,
  HubCertificate,
  HubJob,
  HubPaymentRequest,
  HubScholarship,
  HubTraining,
  HubUser,
  ManualRevenueEntry,
  PaymentGatewayConfig,
  SupportTicketItem,
  SupportTicketStatus
} from '../types/hub';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import { INTERNATIONAL_TRAINING_COURSES } from '../data/internationalTrainingsData';
import {
  buildDirectCertificateVerifyUrl,
  downloadOfficialCourseCertificatePdf,
  resolveOfficialVerificationBaseUrl
} from '../utils/certificatePdfGenerator';
import { DEFAULT_SCROLLING_AD_BANNERS } from './ScrollingAdBanner';
import {
  useGeoCurrency,
  parseRevenuePkrFromRequestText
} from '../lib/geoCurrency';
import { buildConfirmationAlertLinks } from '../lib/pwaNotifications';
import { compressImageFile } from '../lib/storage';
import { AdminSocialShareStudio } from './AdminSocialShareStudio';
import { AdminLaunchFlyerStudio } from './AdminLaunchFlyerStudio';

export interface AdminDispatchConfirmationPayload {
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  title: string;
  decision: 'verified' | 'rejected' | 'direct_cert';
  whatsappUrl: string;
  mailtoUrl: string;
  messageText: string;
}

export type AdminSectionTab =
  | 'menu'
  | 'overview'
  | 'revenue'
  | 'users'
  | 'jobs'
  | 'scholarships'
  | 'certificates'
  | 'trainings'
  | 'payments'
  | 'support'
  | 'social'
  | 'flyer'
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
  onAdminSaveCommunityUser?: (member: HubUser) => Promise<void>;
  onQuickPasteJob: (
    rawText: string,
    category: string,
    flyerImageUrl?: string
  ) => Promise<void>;
  onDeleteJob: (job: HubJob) => Promise<void>;
  onQuickPasteScholarship: (
    rawText: string,
    fundingType: 'Fellowships' | 'International' | 'Grants',
    flyerImageUrl?: string
  ) => Promise<void>;
  onDeleteScholarship: (sch: HubScholarship) => Promise<void>;
  onOpenShareFlyerModal?: (initialSection: 'job' | 'scholarship') => void;
  onSaveTraining: (training: HubTraining) => Promise<void>;
  onDeleteTraining: (training: HubTraining) => Promise<void>;
  certificates?: HubCertificate[];
  onAdminDirectIssueCertificate?: (cert: HubCertificate) => Promise<void>;
  onDeleteCertificate?: (certId: string) => Promise<void>;
  onChangeStorageConfig: (cfg: CloudStorageConfig) => void;
  onSaveStorageConfig: (e: React.FormEvent) => Promise<void>;
  onSaveCustomTrainingsList?: (list: CustomTrainingItem[]) => Promise<void>;
  customTrainingRegistrations?: CustomTrainingRegistration[];
  onUpdateCustomTrainingRegistrationStatus?: (
    id: string,
    status: CustomTrainingRegistration['status']
  ) => Promise<void>;
  onDeleteCustomTrainingRegistration?: (id: string) => Promise<void>;
  onExportBackup: () => void;
  onPreviewUserApp: () => void;
  onSignOut: () => void;
  lastDispatchConfirmation?: AdminDispatchConfirmationPayload | null;
  onClearDispatchConfirmation?: () => void;
  onSetDispatchConfirmation?: (payload: AdminDispatchConfirmationPayload | null) => void;
  supportTickets?: SupportTicketItem[];
  onReplySupportTicket?: (
    ticket: SupportTicketItem,
    replyText: string,
    nextStatus: SupportTicketStatus
  ) => Promise<void>;
  onDeleteSupportTicket?: (ticketId: string) => Promise<void>;
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
  onAdminSaveCommunityUser,
  onQuickPasteJob,
  onDeleteJob,
  onQuickPasteScholarship,
  onDeleteScholarship,
  onOpenShareFlyerModal,
  onSaveTraining,
  onDeleteTraining,
  certificates = [],
  onAdminDirectIssueCertificate,
  onDeleteCertificate,
  onChangeStorageConfig,
  onSaveStorageConfig,
  onSaveCustomTrainingsList,
  customTrainingRegistrations = [],
  onUpdateCustomTrainingRegistrationStatus,
  onDeleteCustomTrainingRegistration,
  onExportBackup,
  onPreviewUserApp,
  onSignOut,
  lastDispatchConfirmation = null,
  onClearDispatchConfirmation,
  onSetDispatchConfirmation,
  supportTickets = [],
  onReplySupportTicket,
  onDeleteSupportTicket
}) => {
  const geo = useGeoCurrency();
  const [activeTab, setActiveTab] = useState<AdminSectionTab>('menu');
  const [copiedDispatchMsg, setCopiedDispatchMsg] = useState(false);

  // Support Tickets, Admin Chat Requests & Custom Opinions State
  const [supportFilter, setSupportFilter] = useState<
    'all' | 'open' | 'admin_chat' | 'issue_report' | 'custom_opinion'
  >('all');
  const [supportSearch, setSupportSearch] = useState('');
  const [supportReplyDrafts, setSupportReplyDrafts] = useState<Record<string, string>>({});
  const [supportStatusDrafts, setSupportStatusDrafts] = useState<
    Record<string, SupportTicketStatus>
  >({});
  const [expandedTranscriptId, setExpandedTranscriptId] = useState<string | null>(null);
  const [savingTicketId, setSavingTicketId] = useState<string | null>(null);

  // Custom Trainings Admin Form & Inline Editor State
  const [ctTitle, setCtTitle] = useState('');
  const [ctCode, setCtCode] = useState('');
  const [ctPriceRs, setCtPriceRs] = useState<number>(3500);
  const [ctPriceUsd, setCtPriceUsd] = useState<number>(15);
  const [ctDuration, setCtDuration] = useState('2 Weeks (Live & Practical)');
  const [ctMode, setCtMode] = useState('Online Live / Hybrid');
  const [ctStandard, setCtStandard] = useState(
    'Codex Alimentarius & Industrial QA/QC Standard'
  );
  const [ctInstructor, setCtInstructor] = useState(
    'Food Science Portal Industrial Faculty'
  );
  const [ctDescription, setCtDescription] = useState('');
  const [ctTopicsText, setCtTopicsText] = useState('');
  const [ctEdits, setCtEdits] = useState<
    Record<
      string,
      {
        title: string;
        code: string;
        priceRs: number;
        priceUsd: number;
        duration: string;
        mode: string;
        description: string;
        topicsText: string;
      }
    >
  >({});

  const [isSavingCustomTraining, setIsSavingCustomTraining] = useState(false);

  const liveCustomTrainings: CustomTrainingItem[] = useMemo(() => {
    if (Array.isArray(storageConfig.customTrainings)) {
      return storageConfig.customTrainings;
    }
    return DEFAULT_CUSTOM_TRAININGS;
  }, [storageConfig.customTrainings]);

  const persistCustomTrainings = async (
    nextList: CustomTrainingItem[],
    msg: string,
    clearEditId?: string
  ): Promise<boolean> => {
    if (isSavingCustomTraining) return false;
    setIsSavingCustomTraining(true);
    try {
      if (onSaveCustomTrainingsList) {
        await onSaveCustomTrainingsList(nextList);
      } else {
        onChangeStorageConfig({
          ...storageConfig,
          customTrainings: nextList
        });
      }
      if (clearEditId) {
        setCtEdits((prev) => {
          const copy = { ...prev };
          delete copy[clearEditId];
          return copy;
        });
      }
      onSetBanner(msg);
      return true;
    } catch (err) {
      console.error('Failed to save Custom Trainings:', err);
      onSetBanner('Error saving Custom Trainings to Firestore. Please verify admin login & retry.');
      return false;
    } finally {
      setIsSavingCustomTraining(false);
    }
  };

  const updatePaymentGateway = (patch: Partial<PaymentGatewayConfig>) => {
    const prev = storageConfig.paymentGateway;
    onChangeStorageConfig({
      ...storageConfig,
      paymentGateway: {
        jazzCashTitle: prev?.jazzCashTitle || 'Muneeb Khan',
        jazzCashNumber: prev?.jazzCashNumber || '0324-0906384',
        easyPaisaTitle: prev?.easyPaisaTitle || 'Muneeb Khan',
        easyPaisaNumber: prev?.easyPaisaNumber || '0324-0906384',
        bankTitle: prev?.bankTitle || 'Muneeb Khan',
        bankName: prev?.bankName || 'Allied Bank / Bank Transfer',
        bankAccountOrIban:
          prev?.bankAccountOrIban || 'Contact on WhatsApp for IBAN',
        bankWhatsapp: prev?.bankWhatsapp || '+92 324 0906384',
        monthlyFeeRs: prev?.monthlyFeeRs ?? 100,
        yearlyFeeRs: prev?.yearlyFeeRs ?? 900,
        monthlyFeeUsd: prev?.monthlyFeeUsd ?? 1,
        yearlyFeeUsd: prev?.yearlyFeeUsd ?? 9,
        certificateFeeUsd: prev?.certificateFeeUsd ?? 5,
        customPriceUpdated: prev?.customPriceUpdated,
        ...patch
      }
    });
  };

  // Users & Approvals Filter State
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<
    'all' | 'community' | 'hidden' | 'premium' | 'pending' | 'free' | 'cv'
  >('all');
  const [expandedUserUid, setExpandedUserUid] = useState<string | null>(null);
  const [confirmDeleteUid, setConfirmDeleteUid] = useState<string | null>(null);

  // Admin Community Member Add / Edit Form State
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [editingMemberUid, setEditingMemberUid] = useState<string | null>(null);
  const [cmName, setCmName] = useState('');
  const [cmTitle, setCmTitle] = useState('');
  const [cmCompany, setCmCompany] = useState('');
  const [cmLocation, setCmLocation] = useState('');
  const [cmCountry, setCmCountry] = useState('');
  const [cmQualification, setCmQualification] = useState('');
  const [cmExperience, setCmExperience] = useState('');
  const [cmSkills, setCmSkills] = useState('');
  const [cmEmail, setCmEmail] = useState('');
  const [cmPhone, setCmPhone] = useState('');
  const [cmLinkedin, setCmLinkedin] = useState('');
  const [cmBio, setCmBio] = useState('');
  const [cmAvatar, setCmAvatar] = useState('');
  const [cmIsPaid, setCmIsPaid] = useState(true);
  const [cmVisibleInCommunity, setCmVisibleInCommunity] = useState(true);
  const [cmHireMe, setCmHireMe] = useState(true);
  const [isSavingCommunityMember, setIsSavingCommunityMember] = useState(false);

  const resetCommunityMemberForm = () => {
    setEditingMemberUid(null);
    setCmName('');
    setCmTitle('');
    setCmCompany('');
    setCmLocation('');
    setCmCountry('');
    setCmQualification('');
    setCmExperience('');
    setCmSkills('');
    setCmEmail('');
    setCmPhone('');
    setCmLinkedin('');
    setCmBio('');
    setCmAvatar('');
    setCmIsPaid(true);
    setCmVisibleInCommunity(true);
    setCmHireMe(true);
  };

  const openNewCommunityMemberForm = () => {
    resetCommunityMemberForm();
    setShowCommunityForm(true);
  };

  const openEditCommunityMemberForm = (u: HubUser) => {
    setEditingMemberUid(u.uid);
    setCmName(u.name || '');
    setCmTitle(u.title || u.currentRole || '');
    setCmCompany(u.company || '');
    setCmLocation(u.location || '');
    setCmCountry(u.country || '');
    setCmQualification(u.qualification || '');
    setCmExperience(
      typeof u.experience === 'string'
        ? u.experience
        : Array.isArray(u.experienceItems) && u.experienceItems.length > 0
        ? u.experienceItems
            .map((e) => `${e.jobTitle} @ ${e.company}`)
            .join(' | ')
        : ''
    );
    setCmSkills(Array.isArray(u.skills) ? u.skills.join(', ') : '');
    setCmEmail(u.email || '');
    setCmPhone(u.whatsappNumber || u.phone || '');
    setCmLinkedin(u.linkedinUrl || '');
    setCmBio(u.bio || '');
    setCmAvatar(u.profilePicUrl || u.profilePhotoUrl || '');
    setCmIsPaid(Boolean(u.isPaid || u.isPremium || u.plan === 'premium'));
    setCmVisibleInCommunity(u.profileVisibility !== false);
    setCmHireMe(u.hireMe !== false);
    setShowCommunityForm(true);
  };

  const handleCommunityAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { dataUrl } = await compressImageFile(file, 360, 0.8);
      setCmAvatar(dataUrl);
    } catch {
      onSetBanner('Could not process profile photo. Please try a JPG/PNG image.');
    }
  };

  const handleSaveCommunityMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmName.trim()) {
      onSetBanner('Please enter the Community member Full Name.');
      return;
    }
    if (!onAdminSaveCommunityUser) return;
    setIsSavingCommunityMember(true);
    try {
      const existing = editingMemberUid
        ? users.find((u) => u.uid === editingMemberUid)
        : undefined;
      const skillsArray = cmSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 30);

      const payload: HubUser = {
        ...(existing || ({} as HubUser)),
        uid: editingMemberUid || '',
        name: cmName.trim(),
        title: cmTitle.trim() || 'Food Safety & Quality Specialist',
        currentRole: cmTitle.trim() || 'Food Safety & Quality Specialist',
        company: cmCompany.trim(),
        location: cmLocation.trim(),
        country: cmCountry.trim(),
        qualification: cmQualification.trim(),
        experience: cmExperience.trim() || existing?.experience || [],
        skills: skillsArray,
        email: cmEmail.trim(),
        phone: cmPhone.trim(),
        whatsappNumber: cmPhone.trim(),
        linkedinUrl: cmLinkedin.trim(),
        bio: cmBio.trim(),
        profilePicUrl: cmAvatar,
        profilePhotoUrl: cmAvatar,
        isPaid: cmIsPaid,
        isPremium: cmIsPaid,
        plan: cmIsPaid ? 'premium' : 'free',
        profileVisibility: cmVisibleInCommunity,
        hireMe: cmHireMe,
        profileCompleted: true,
        isAdmin: false,
        cvUrl: existing?.cvUrl || '',
        createdAt: existing?.createdAt || new Date().toISOString().slice(0, 19) + 'Z',
        privacySettings: existing?.privacySettings || {
          qualification_public: true,
          experience_public: true,
          currentRole_public: true,
          location_public: true,
          email_public: true,
          phone_public: true,
          hireMe_public: cmHireMe
        }
      };

      await onAdminSaveCommunityUser(payload);
      setShowCommunityForm(false);
      resetCommunityMemberForm();
    } finally {
      setIsSavingCommunityMember(false);
    }
  };

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
  const [jobFlyerPreview, setJobFlyerPreview] = useState<string>('');
  const [schFlyerPreview, setSchFlyerPreview] = useState<string>('');

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

  // Inline Training Topic, Code, Price, Description & Duration Edits Map
  const [priceEdits, setPriceEdits] = useState<
    Record<
      string,
      {
        title?: string;
        standardCode?: string;
        certificateFeeRs?: number;
        fees: string;
        duration: string;
        description?: string;
      }
    >
  >({});

  // Inline Existing Module Edit State: { [moduleId]: { subject, description } }
  const [editingModMap, setEditingModMap] = useState<
    Record<string, { subject: string; description: string }>
  >({});

  // Dismissed / Handled Payment Request IDs so clicking Accept, Reject, or Delete immediately closes the request card
  const [dismissedReqIds, setDismissedReqIds] = useState<string[]>([]);

  // Custom Scrolling Ad Banner Manager State (Right-to-Left Marquee below Header & above Good Morning Hero)
  const [adTitleInput, setAdTitleInput] = useState('');
  const [adSubtitleInput, setAdSubtitleInput] = useState('');
  const [adBadgeInput, setAdBadgeInput] = useState('UPCOMING TRAINING');
  const [adCtaTextInput, setAdCtaTextInput] = useState('Register / Details');
  const [adCtaLinkInput, setAdCtaLinkInput] = useState('?page=trainings');
  const [editingAdId, setEditingAdId] = useState<string | null>(null);

  // Manual Revenue Record Form State
  const [revUserName, setRevUserName] = useState('');
  const [revUserEmail, setRevUserEmail] = useState('');
  const [revUserPhone, setRevUserPhone] = useState('');
  const [revCategory, setRevCategory] = useState<
    'subscription' | 'certificate' | 'bundle'
  >('certificate');
  const [revItemTitle, setRevItemTitle] = useState('');
  const [revAmountRs, setRevAmountRs] = useState<number>(1000);
  const [revMethod, setRevMethod] = useState('JazzCash / EasyPaisa');
  const [revTxId, setRevTxId] = useState('');
  const [revSearchQuery, setRevSearchQuery] = useState('');
  const [revFilterType, setRevFilterType] = useState<
    'all' | 'subscription' | 'certificate'
  >('all');

  // Helper: Auto-generate a clean Qualification Code from any Custom Topic Title
  const generateAutoQualificationCode = (
    topicTitle: string,
    includeRandomSuffix = false
  ): string => {
    const cleaned = topicTitle
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .toUpperCase();
    if (!cleaned) {
      const randNum = Math.floor(100 + Math.random() * 900);
      return `FSP-CERT-${randNum}`;
    }
    const words = cleaned.split(/\s+/).filter(Boolean);
    let prefix = '';
    if (words.length === 1) {
      prefix = words[0].slice(0, 6);
    } else {
      prefix = words
        .slice(0, 4)
        .map((w) =>
          /^\d+$/.test(w) ? w.slice(0, 4) : w.slice(0, w.length <= 3 ? 3 : 2)
        )
        .join('');
    }
    const cleanPrefix = prefix.slice(0, 8) || 'EXEC';
    const suffix = includeRandomSuffix
      ? Math.floor(100 + Math.random() * 900)
      : new Date().getFullYear();
    return `FSP-${cleanPrefix}-${suffix}`;
  };

  // Admin Direct Certificate Generator State (Issue Certificate Without Exam / Study on Any Course or Custom Topic)
  const [directRecipientName, setDirectRecipientName] = useState('');
  const [directRecipientEmail, setDirectRecipientEmail] = useState('');
  const [directSelectedUserUid, setDirectSelectedUserUid] = useState('');
  const [directTopicMode, setDirectTopicMode] = useState<'catalog' | 'custom'>('catalog');
  const [directCatalogCourseId, setDirectCatalogCourseId] = useState(
    trainings[0]?.id || ''
  );
  const [directCustomTopicTitle, setDirectCustomTopicTitle] = useState('');
  const [directCustomCourseCode, setDirectCustomCourseCode] = useState(
    () => `FSP-CERT-${new Date().getFullYear()}`
  );
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

  // WhatsApp Group / Channel Share Helper
  const shareToWhatsAppGroupOrChannel = (
    headline: string,
    summaryText: string,
    targetUrl: string
  ) => {
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : resolveOfficialVerificationBaseUrl();
    const fullUrl = targetUrl.startsWith('http')
      ? targetUrl
      : `${origin}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;
    const message = `📢 *${headline}*\n\n${summaryText}\n\n🔗 *Open Direct Link:* ${fullUrl}\n🌐 *Food Science Portal — International Food Science Community*`;
    const waShareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    const link = document.createElement('a');
    link.href = waShareUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyWhatsAppShareText = async (
    headline: string,
    summaryText: string,
    targetUrl: string
  ) => {
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : resolveOfficialVerificationBaseUrl();
    const fullUrl = targetUrl.startsWith('http')
      ? targetUrl
      : `${origin}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;
    const message = `📢 *${headline}*\n\n${summaryText}\n\n🔗 *Open Direct Link:* ${fullUrl}\n🌐 *Food Science Portal — International Food Science Community*`;
    try {
      await navigator.clipboard.writeText(message);
      onSetBanner('Formatted WhatsApp Group/Channel post copied to clipboard!');
    } catch {
      onSetBanner(`Share Link: ${fullUrl}`);
    }
  };

  // Wrapper for Accept / Reject / Delete Payment Request that automatically closes the request from active view
  const handleActionAndAutoClosePaymentRequest = async (
    req: HubPaymentRequest,
    action: 'verified' | 'rejected' | 'delete'
  ) => {
    // Immediately dismiss from the active approval queue so the card closes automatically
    setDismissedReqIds((prev) =>
      prev.includes(req.id) ? prev : [...prev, req.id]
    );
    if (action === 'delete') {
      await onDeletePaymentRequest(req.id);
    } else {
      await onVerifyPayment(req, action);
    }
  };

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
      directTopicMode === 'custom'
        ? (
            directCustomCourseCode.trim() ||
            generateAutoQualificationCode(finalCourseTitle)
          ).toUpperCase()
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

      const verifyUrl = buildDirectCertificateVerifyUrl({
        certificateNumber: generatedCertNo,
        recipientName: cleanName,
        courseTitle: finalCourseTitle,
        courseCode: finalCourseCode,
        accreditationStandard: finalAccreditation,
        scorePercentage: clampedScore,
        issueDate: certRecord.issueDate
      });
      const matchedPhone =
        matchedRecipientUser?.whatsappNumber || matchedRecipientUser?.phone || '';
      const alertLinks = buildConfirmationAlertLinks({
        recipientName: cleanName,
        recipientEmail: directRecipientEmail.trim(),
        recipientPhone: matchedPhone,
        decision: 'direct_cert',
        itemTitle: finalCourseTitle,
        certificateNumber: generatedCertNo,
        verifyUrl
      });
      onSetDispatchConfirmation?.({
        recipientName: cleanName,
        recipientEmail: directRecipientEmail.trim(),
        recipientPhone: matchedPhone,
        title: `${finalCourseTitle} (${generatedCertNo})`,
        decision: 'direct_cert',
        whatsappUrl: alertLinks.whatsappUrl,
        mailtoUrl: alertLinks.mailtoUrl,
        messageText: alertLinks.messageText
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

  // Helper: Parse numeric PKR amount from payment request string (supports Rs./PKR & converts international $ USD slips to PKR)
  const parseAmountRsFromRequest = (req: HubPaymentRequest): number => {
    const intlParsed = parseRevenuePkrFromRequestText(
      req.amount,
      req.notes,
      geo.usdToPkrRate
    );
    if (intlParsed.pkrAmount > 0) return intlParsed.pkrAmount;
    if (
      req.certificateCourseId ||
      req.subscriptionPlan === 'certificate_unlock'
    ) {
      if (
        req.certificateCourseId === 'mgr-food-dietary-2026' ||
        (req.certificateCourseTitle || '').toLowerCase().includes('dietary')
      ) {
        return 8000;
      }
      return 1000;
    }
    if ((req.subscriptionPlan || '').toLowerCase().includes('year')) {
      return liveYearlyFee;
    }
    return liveMonthlyFee;
  };

  // Comprehensive Revenue Ledger (Verified Subscriptions + Verified Certificates/Bundles + Direct/Manual Entries)
  const revenueLedger = useMemo(() => {
    const items: ManualRevenueEntry[] = [];
    const seenPaymentIds = new Set<string>();

    // 1. All verified payment requests (Subscriptions + Certificates + Bundles)
    for (const req of paymentRequests) {
      if (req.status !== 'verified') continue;
      seenPaymentIds.add(req.id);
      const isCertOrBundle =
        Boolean(req.certificateCourseId) ||
        req.subscriptionPlan === 'certificate_unlock' ||
        (req.amount || '').toLowerCase().includes('certificate') ||
        (req.amount || '').toLowerCase().includes('bundle');
      const isBundle =
        (req.certificateCourseTitle || '').toLowerCase().includes('bundle') ||
        (req.notes || '').toLowerCase().includes('bundle');
      const amountRs = parseAmountRsFromRequest(req);

      items.push({
        id: `rev-req-${req.id}`,
        userName: req.userName || 'Member',
        userEmail: req.userEmail || '',
        userPhone: req.userPhone || '',
        category: isBundle
          ? 'bundle'
          : isCertOrBundle
          ? 'certificate'
          : 'subscription',
        itemTitle: isCertOrBundle
          ? req.certificateCourseTitle ||
            req.notes ||
            'Official Course Certificate'
          : req.subscriptionPlan === 'yearly' ||
            (req.amount || '').toLowerCase().includes('year')
          ? '1-Year Paid Specialist Membership'
          : '1-Month Paid Specialist Membership',
        amountRs,
        paymentMethod: req.paymentMethod || 'JazzCash / EasyPaisa',
        transactionId: req.transactionId || 'Verified',
        recordedAt:
          req.verifiedAt || req.submittedAt || new Date().toISOString()
      });
    }

    // 2. Manual revenue entries saved by Admin in storageConfig
    const manualList = storageConfig.manualRevenueEntries || [];
    for (const entry of manualList) {
      items.push(entry);
    }

    // Sort newest first
    return items.sort((a, b) =>
      (b.recordedAt || '').localeCompare(a.recordedAt || '')
    );
  }, [paymentRequests, storageConfig.manualRevenueEntries, liveMonthlyFee, liveYearlyFee]);

  const filteredRevenueLedger = useMemo(() => {
    const q = revSearchQuery.trim().toLowerCase();
    return revenueLedger
      .filter((r) => {
        if (revFilterType === 'subscription') {
          return r.category === 'subscription';
        }
        if (revFilterType === 'certificate') {
          return r.category === 'certificate' || r.category === 'bundle';
        }
        return true;
      })
      .filter((r) => {
        if (!q) return true;
        return (
          r.userName.toLowerCase().includes(q) ||
          r.userEmail.toLowerCase().includes(q) ||
          (r.userPhone || '').toLowerCase().includes(q) ||
          r.itemTitle.toLowerCase().includes(q) ||
          r.transactionId.toLowerCase().includes(q) ||
          r.paymentMethod.toLowerCase().includes(q)
        );
      });
  }, [revenueLedger, revSearchQuery, revFilterType]);

  const revenueSummary = useMemo(() => {
    let totalRevenueRs = 0;
    let subscriptionRevenueRs = 0;
    let certificateRevenueRs = 0;
    let subscriptionCount = 0;
    let certificateCount = 0;

    for (const item of revenueLedger) {
      const amt = Number(item.amountRs) || 0;
      totalRevenueRs += amt;
      if (item.category === 'subscription') {
        subscriptionRevenueRs += amt;
        subscriptionCount += 1;
      } else {
        certificateRevenueRs += amt;
        certificateCount += 1;
      }
    }

    return {
      totalRevenueRs,
      subscriptionRevenueRs,
      certificateRevenueRs,
      subscriptionCount,
      certificateCount,
      totalTransactions: revenueLedger.length
    };
  }, [revenueLedger]);

  const handleDownloadRevenueCsv = () => {
    const headers = [
      'Receipt ID',
      'Date',
      'User Name',
      'User Email',
      'Phone / WhatsApp',
      'Category',
      'Item / Course / Subscription Plan',
      'Payment Method',
      'Transaction ID (TID)',
      'Amount (PKR)'
    ];
    const escapeCsv = (val: string | number) => {
      const s = String(val ?? '').replace(/"/g, '""');
      return `"${s}"`;
    };
    const rows = filteredRevenueLedger.map((r) => [
      escapeCsv(r.id),
      escapeCsv((r.recordedAt || '').replace('T', ' ').slice(0, 19)),
      escapeCsv(r.userName),
      escapeCsv(r.userEmail),
      escapeCsv(r.userPhone || '-'),
      escapeCsv(r.category.toUpperCase()),
      escapeCsv(r.itemTitle),
      escapeCsv(r.paymentMethod),
      escapeCsv(r.transactionId),
      escapeCsv(r.amountRs)
    ]);
    rows.push([
      escapeCsv('TOTAL REVENUE'),
      escapeCsv(new Date().toISOString().slice(0, 10)),
      escapeCsv(`${filteredRevenueLedger.length} Verified Payments`),
      escapeCsv('-'),
      escapeCsv('-'),
      escapeCsv('ALL'),
      escapeCsv(
        `Subscriptions: Rs. ${revenueSummary.subscriptionRevenueRs} | Certificates/Bundles: Rs. ${revenueSummary.certificateRevenueRs}`
      ),
      escapeCsv('-'),
      escapeCsv('-'),
      escapeCsv(
        filteredRevenueLedger.reduce(
          (sum, item) => sum + (Number(item.amountRs) || 0),
          0
        )
      )
    ]);

    const csvContent =
      '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-science-portal-revenue-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onSetBanner(
      `Revenue Ledger CSV downloaded (Total: Rs. ${revenueSummary.totalRevenueRs.toLocaleString()})!`
    );
  };

  const handleAddManualRevenueEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revUserName.trim() || !revItemTitle.trim()) {
      onSetBanner('Please enter User Name and Item/Course Title.');
      return;
    }
    const newEntry: ManualRevenueEntry = {
      id: `rev-manual-${Date.now()}`,
      userName: revUserName.trim(),
      userEmail: revUserEmail.trim(),
      userPhone: revUserPhone.trim(),
      category: revCategory,
      itemTitle: revItemTitle.trim(),
      amountRs: Math.max(0, Number(revAmountRs) || 0),
      paymentMethod: revMethod.trim() || 'Direct Transfer',
      transactionId: revTxId.trim() || `DIRECT-${Date.now().toString().slice(-6)}`,
      recordedAt: new Date().toISOString()
    };
    const nextManual = [
      newEntry,
      ...(storageConfig.manualRevenueEntries || [])
    ];
    onChangeStorageConfig({
      ...storageConfig,
      manualRevenueEntries: nextManual
    });
    setRevUserName('');
    setRevUserEmail('');
    setRevUserPhone('');
    setRevItemTitle('');
    setRevTxId('');
    onSetBanner(
      `Added Rs. ${newEntry.amountRs.toLocaleString()} from "${newEntry.userName}" to Revenue Ledger! Click "Save Revenue Ledger to Cloud" to persist.`
    );
  };

  const handleDeleteManualRevenueEntry = (entryId: string) => {
    const nextManual = (storageConfig.manualRevenueEntries || []).filter(
      (e) => e.id !== entryId
    );
    onChangeStorageConfig({
      ...storageConfig,
      manualRevenueEntries: nextManual
    });
    onSetBanner('Manual revenue entry removed. Click "Save Revenue Ledger to Cloud" to persist.');
  };

  // Custom Scrolling Ad Banner List & Handlers
  const currentAdBanners: CustomAdBannerItem[] = useMemo(() => {
    if (
      Array.isArray(storageConfig.customAds) &&
      storageConfig.customAds.length > 0
    ) {
      return storageConfig.customAds;
    }
    return DEFAULT_SCROLLING_AD_BANNERS;
  }, [storageConfig.customAds]);

  const handleSaveAdBannerItem = () => {
    const cleanTitle = adTitleInput.trim();
    if (!cleanTitle) {
      onSetBanner('Please enter the Ad Banner Headline / Announcement text.');
      return;
    }
    const existingList =
      Array.isArray(storageConfig.customAds) &&
      storageConfig.customAds.length > 0
        ? [...storageConfig.customAds]
        : [...DEFAULT_SCROLLING_AD_BANNERS];

    if (editingAdId) {
      const updated = existingList.map((ad) =>
        ad.id === editingAdId
          ? {
              ...ad,
              title: cleanTitle,
              subtitle: adSubtitleInput.trim(),
              badgeText: adBadgeInput.trim() || 'ANNOUNCEMENT',
              ctaText: adCtaTextInput.trim() || 'Learn More',
              ctaLink: adCtaLinkInput.trim() || '?page=trainings'
            }
          : ad
      );
      onChangeStorageConfig({
        ...storageConfig,
        customAds: updated
      });
      setEditingAdId(null);
      onSetBanner('Ad Banner updated! Click "Save Front Page & Ad Banners" to publish live.');
    } else {
      const newAd: CustomAdBannerItem = {
        id: `ad-${Date.now()}`,
        title: cleanTitle,
        headline: cleanTitle,
        subtitle: adSubtitleInput.trim(),
        subtext: adSubtitleInput.trim(),
        badgeText: adBadgeInput.trim() || 'UPCOMING TRAINING',
        ctaText: adCtaTextInput.trim() || 'Register / Details',
        ctaLabel: adCtaTextInput.trim() || 'Register / Details',
        ctaLink: adCtaLinkInput.trim() || '?page=trainings',
        linkUrl: adCtaLinkInput.trim() || '?page=trainings',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      onChangeStorageConfig({
        ...storageConfig,
        customAds: [newAd, ...existingList]
      });
      onSetBanner('New Scrolling Ad Banner added! Click "Save Front Page & Ad Banners" to publish live.');
    }
    setAdTitleInput('');
    setAdSubtitleInput('');
  };

  const handleToggleAdBannerItem = (adId: string) => {
    const existingList =
      Array.isArray(storageConfig.customAds) &&
      storageConfig.customAds.length > 0
        ? [...storageConfig.customAds]
        : [...DEFAULT_SCROLLING_AD_BANNERS];
    const updated = existingList.map((ad) =>
      ad.id === adId ? { ...ad, isActive: ad.isActive === false } : ad
    );
    onChangeStorageConfig({
      ...storageConfig,
      customAds: updated
    });
  };

  const handleDeleteAdBannerItem = (adId: string) => {
    const existingList =
      Array.isArray(storageConfig.customAds) &&
      storageConfig.customAds.length > 0
        ? [...storageConfig.customAds]
        : [...DEFAULT_SCROLLING_AD_BANNERS];
    const updated = existingList.filter((ad) => ad.id !== adId);
    onChangeStorageConfig({
      ...storageConfig,
      customAds: updated
    });
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
      (r) => r.status === 'pending' && !dismissedReqIds.includes(r.id)
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
  }, [users, paymentRequests, jobs, scholarships, trainings, dismissedReqIds]);

  const communityVisibleCount = useMemo(
    () =>
      users.filter(
        (u) =>
          u.email?.toLowerCase() !== 'mindmademedia9@gmail.com' &&
          Boolean(u.isPaid || u.isPremium || u.plan === 'premium') &&
          u.profileVisibility !== false
      ).length,
    [users]
  );

  const hiddenCommunityCount = useMemo(
    () =>
      users.filter(
        (u) =>
          u.email?.toLowerCase() !== 'mindmademedia9@gmail.com' &&
          u.profileVisibility === false
      ).length,
    [users]
  );

  const filteredUsersList = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return users
      .filter((u) => u.email?.toLowerCase() !== 'mindmademedia9@gmail.com')
      .filter((u) => {
        if (userFilter === 'community') {
          return (
            Boolean(u.isPaid || u.isPremium || u.plan === 'premium') &&
            u.profileVisibility !== false
          );
        }
        if (userFilter === 'hidden') {
          return u.profileVisibility === false;
        }
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

  // Only show PENDING & non-dismissed payment requests in the active Accept / Reject / Delete queues so requests close immediately once acted upon
  const sortedPaymentRequests = useMemo(() => {
    return paymentRequests
      .filter(
        (req) => req.status === 'pending' && !dismissedReqIds.includes(req.id)
      )
      .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
  }, [paymentRequests, dismissedReqIds]);

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

  const handleQuickFlyerPick = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'job' | 'scholarship'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { dataUrl } = await compressImageFile(file, 1000, 0.76);
      if (target === 'job') {
        setJobFlyerPreview(dataUrl);
      } else {
        setSchFlyerPreview(dataUrl);
      }
    } catch {
      onSetBanner('Could not compress selected image. Please try a JPG or PNG.');
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmitQuickJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobPasteText.trim() && !jobFlyerPreview) return;
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
      const effectiveText =
        jobPasteText.trim() ||
        `${finalTag} Opening\nPlease see the attached official job flyer poster for details and application instructions.`;
      await onQuickPasteJob(
        effectiveText,
        finalTag,
        jobFlyerPreview || undefined
      );
      setJobPasteText('');
      setCustomJobTagInput('');
      setJobFlyerPreview('');
    } finally {
      setIsPostingJob(false);
    }
  };

  const handleSubmitQuickScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schPasteText.trim() && !schFlyerPreview) return;
    setIsPostingSch(true);
    try {
      const effectiveText =
        schPasteText.trim() ||
        `${schCategory} Food Science Scholarship\nPlease view the attached official scholarship poster for eligibility and application guidelines.`;
      await onQuickPasteScholarship(
        effectiveText,
        schCategory,
        schFlyerPreview || undefined
      );
      setSchPasteText('');
      setSchFlyerPreview('');
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
    try {
      await onSaveTraining({
        ...tr,
        customModules: nextMods
      });
      setCardModSubject('');
      setCardModDesc('');
    } catch (err) {
      console.error('Failed to add module:', err);
    }
  };

  const handleDeleteModuleFromExistingTraining = async (
    tr: HubTraining,
    modId: string
  ) => {
    const nextMods = (tr.customModules || []).filter((m) => m.id !== modId);
    try {
      await onSaveTraining({
        ...tr,
        customModules: nextMods
      });
    } catch (err) {
      console.error('Failed to delete module:', err);
    }
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
    try {
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
    } catch (err) {
      console.error('Failed to add MCQ:', err);
    }
  };

  const handleDeleteMcqFromExistingTraining = async (
    tr: HubTraining,
    mcqId: string
  ) => {
    const nextMcqs = (tr.customMcqs || []).filter((q) => q.id !== mcqId);
    try {
      await onSaveTraining({
        ...tr,
        customMcqs: nextMcqs
      });
    } catch (err) {
      console.error('Failed to delete MCQ:', err);
    }
  };

  const handleUpdateCoursePrice = async (tr: HubTraining) => {
    const edited = priceEdits[tr.id];
    const nextTitle =
      edited?.title !== undefined && edited.title.trim()
        ? edited.title.trim()
        : tr.title;
    const nextCode =
      edited?.standardCode !== undefined && edited.standardCode.trim()
        ? edited.standardCode.trim().toUpperCase()
        : tr.standardCode;
    const nextDesc =
      edited?.description !== undefined
        ? edited.description.trim()
        : tr.description;
    const nextDuration =
      edited?.duration !== undefined && edited.duration.trim()
        ? edited.duration.trim()
        : tr.duration;

    // Determine numeric certificateFeeRs & display fees string
    let nextCertFeeRs =
      edited?.certificateFeeRs !== undefined
        ? Number(edited.certificateFeeRs)
        : tr.certificateFeeRs;
    let nextFees = edited?.fees !== undefined ? edited.fees.trim() : tr.fees;

    if (
      edited?.certificateFeeRs !== undefined &&
      !Number.isNaN(Number(edited.certificateFeeRs)) &&
      Number(edited.certificateFeeRs) > 0
    ) {
      nextCertFeeRs = Number(edited.certificateFeeRs);
      nextFees = `Free Study & Exam · Rs. ${nextCertFeeRs.toLocaleString()} Certificate`;
    } else if (nextFees) {
      const cleaned = nextFees.replace(/,/g, '');
      const match =
        cleaned.match(/(?:rs\.?|pkr)\s*(\d{2,7})/i) ||
        cleaned.match(/\b(\d{3,7})\b/);
      if (match && match[1]) {
        const parsed = Number(match[1]);
        if (!Number.isNaN(parsed) && parsed > 0) {
          nextCertFeeRs = parsed;
        }
      }
    }

    const updated: HubTraining = {
      ...tr,
      title: nextTitle,
      standardCode: nextCode || tr.standardCode,
      certificateFeeRs: nextCertFeeRs,
      fees:
        nextFees ||
        `Free Study & Exam · Rs. ${(nextCertFeeRs || 1000).toLocaleString()} Certificate`,
      duration: nextDuration || tr.duration,
      description: nextDesc || tr.description,
      isActive: tr.isActive !== false
    };
    try {
      await onSaveTraining(updated);
      onSetBanner(
        `Updated "${nextTitle}" (Cert Fee: Rs. ${(nextCertFeeRs || 1000).toLocaleString()} · ${nextDuration || tr.duration}) — Live on Website & Bundles!`
      );
    } catch (err) {
      console.error('Failed to update course price:', err);
    }
  };

  const handleSaveExistingModuleEdit = async (
    tr: HubTraining,
    modId: string
  ) => {
    const editedMod = editingModMap[modId];
    if (!editedMod) return;
    const nextMods = (tr.customModules || []).map((m) =>
      m.id === modId
        ? {
            ...m,
            subject: editedMod.subject.trim() || m.subject,
            description: editedMod.description.trim()
          }
        : m
    );
    try {
      await onSaveTraining({
        ...tr,
        customModules: nextMods
      });
      setEditingModMap((prev) => {
        const copy = { ...prev };
        delete copy[modId];
        return copy;
      });
      onSetBanner(`Updated module in "${tr.title}" (Live on Website)!`);
    } catch (err) {
      console.error('Failed to save edited module:', err);
    }
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

          {/* 1-CLICK WHATSAPP & EMAIL CONFIRMATION DISPATCH ALERT */}
          {lastDispatchConfirmation && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-sm space-y-2.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                      Instant User Confirmation Dispatch
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-[#1A2138]">
                      Notify {lastDispatchConfirmation.recipientName} — {lastDispatchConfirmation.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                      In-app portal alert has been queued automatically. Send external WhatsApp or Email confirmation with 1 click:
                    </p>
                  </div>
                </div>
                {onClearDispatchConfirmation && (
                  <button
                    type="button"
                    onClick={onClearDispatchConfirmation}
                    className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold text-slate-700 cursor-pointer shrink-0"
                  >
                    Dismiss
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <a
                  href={lastDispatchConfirmation.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Confirmation</span>
                </a>
                <a
                  href={lastDispatchConfirmation.mailtoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email Confirmation</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard
                      ?.writeText(lastDispatchConfirmation.messageText)
                      .then(() => {
                        setCopiedDispatchMsg(true);
                        setTimeout(() => setCopiedDispatchMsg(false), 2000);
                      })
                      .catch(() => {});
                  }}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#D2DEEA] text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#1673B8]" />
                  <span>{copiedDispatchMsg ? 'Message Copied!' : 'Copy Alert Text'}</span>
                </button>
              </div>
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
                      Click any button below to open that dedicated control page. Control every front-page element, scrolling ad banner, training course topic/price/content, WhatsApp share, and downloadable revenue ledger.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[
                    {
                      id: 'overview' as AdminSectionTab,
                      title: '1. Front Page, Ad Banner & Pages Control',
                      desc: 'Edit front page hero, custom scrolling ad banners, WhatsApp share links & analytics',
                      badge: `${currentAdBanners.filter((a) => a.isActive !== false).length} Active Ads`,
                      icon: BarChart3
                    },
                    {
                      id: 'revenue' as AdminSectionTab,
                      title: '2. Revenue Ledger & Downloadable Records',
                      desc: 'Track all Subscription & Certificate payments by user, total revenue & CSV download',
                      badge: `Rs. ${revenueSummary.totalRevenueRs.toLocaleString()}`,
                      icon: DollarSign
                    },
                    {
                      id: 'users' as AdminSectionTab,
                      title: '3. Users, Community Profiles & Approvals',
                      desc: 'Add, edit, show/hide or delete Community members, accept/reject payment slips & monitor CVs',
                      badge:
                        stats.pendingRequests > 0
                          ? `${stats.pendingRequests} Pending`
                          : `${communityVisibleCount} in Community`,
                      icon: Users
                    },
                    {
                      id: 'jobs' as AdminSectionTab,
                      title: '4. Post Jobs (1-Box) & WhatsApp Share',
                      desc: 'Paste & publish new jobs, manage listings & share directly to WhatsApp groups',
                      badge: `${jobs.length} Jobs`,
                      icon: Briefcase
                    },
                    {
                      id: 'scholarships' as AdminSectionTab,
                      title: '5. Scholarships (1-Box) & WhatsApp Share',
                      desc: 'Paste & publish fellowships, international grants & share to WhatsApp',
                      badge: `${scholarships.length} Grants`,
                      icon: GraduationCap
                    },
                    {
                      id: 'certificates' as AdminSectionTab,
                      title: '6. Direct Certificate Generator',
                      desc: 'Generate Portrait PDF Certificates with auto qualification code & approve fee requests',
                      badge: `${certificates.length} Issued`,
                      icon: Award
                    },
                    {
                      id: 'trainings' as AdminSectionTab,
                      title: '7. Trainings, Topics, Prices & Content',
                      desc: 'Change any course topic, price (e.g. Rs. 8,000), modules, MCQs & bundle pricing',
                      badge: `${trainings.length} Courses`,
                      icon: FileText
                    },
                    {
                      id: 'payments' as AdminSectionTab,
                      title: '8. Payment Gateway & Subscription Fees',
                      desc: 'Update Bank Account, JazzCash, EasyPaisa & membership pricing',
                      badge: `Rs. ${liveMonthlyFee}/Mo`,
                      icon: CreditCard
                    },
                    {
                      id: 'storage' as AdminSectionTab,
                      title: '9. Cloud Storage & Full Backup',
                      desc: 'Configure cloud storage endpoints & export full JSON backup',
                      badge: 'Cloud Sync',
                      icon: Database
                    },
                    {
                      id: 'support' as AdminSectionTab,
                      title: '10. Support Issues & Custom Opinions',
                      desc: 'Review user issue highlights, personal custom opinions/ratings, AI chat context & reply directly to users',
                      badge: `${supportTickets.filter((t) => t.status !== 'resolved').length} Open (${supportTickets.length})`,
                      icon: Headset
                    },
                    {
                      id: 'social' as AdminSectionTab,
                      title: '11. Social Media Tool & Page Publisher',
                      desc: 'Share any tool, calculator, course, or page on LinkedIn/Facebook with Interface + Benefits Card (PNG)',
                      badge: '16 Tools + 8 Pages',
                      icon: Share2
                    },
                    {
                      id: 'flyer' as AdminSectionTab,
                      title: '12. Website Launch Ad & Promotional Flyer',
                      desc: 'Create & download high-res Website Launch Flyer (PNG) showcasing Jobs, Scholarships, Tools, Study & Free vs Paid Membership',
                      badge: 'Launch Flyer PNG',
                      icon: Megaphone
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
                      updatePaymentGateway({
                        monthlyFeeRs: nextMonthly,
                        yearlyFeeRs: nextYearly,
                        customPriceUpdated: true
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
                      updatePaymentGateway({
                        yearlyFeeRs: nextYearly,
                        customPriceUpdated: true
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
                        updatePaymentGateway({
                          monthlyFeeRs: currentMo,
                          yearlyFeeRs: autoYr,
                          customPriceUpdated: true
                        });
                      }
                    }}
                    className="w-3.5 h-3.5 accent-[#1673B8] rounded cursor-pointer"
                  />
                  <span>Auto 25% OFF on Yearly</span>
                </label>
              </div>

              {/* International Visitors (Outside Pakistan) USD Base Prices */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#BBD6EE] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-[#105E9A] uppercase tracking-wider">
                    International Users &amp; Guests Pricing (Outside Pakistan — Auto-Converted to Local Currency)
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-600">
                    Pakistan PKR prices above remain unchanged
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Monthly Plan ($ USD)
                    </label>
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={storageConfig.paymentGateway?.monthlyFeeUsd ?? 1}
                      onChange={(e) => {
                        const moUsd = Math.max(0.5, Number(e.target.value) || 1);
                        updatePaymentGateway({
                          monthlyFeeUsd: moUsd,
                          yearlyFeeUsd: Number((moUsd * 12 * 0.75).toFixed(2)),
                          customPriceUpdated: true
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Yearly 12-Mo Plan (25% OFF — $ USD)
                    </label>
                    <input
                      type="number"
                      min={1}
                      step={0.25}
                      value={storageConfig.paymentGateway?.yearlyFeeUsd ?? 9}
                      onChange={(e) => {
                        const yrUsd = Math.max(1, Number(e.target.value) || 9);
                        updatePaymentGateway({
                          yearlyFeeUsd: yrUsd,
                          customPriceUpdated: true
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Per Certificate Fee ($ USD, 25% OFF Bundles)
                    </label>
                    <input
                      type="number"
                      min={1}
                      step={0.5}
                      value={storageConfig.paymentGateway?.certificateFeeUsd ?? 5}
                      onChange={(e) => {
                        const certUsd = Math.max(1, Number(e.target.value) || 5);
                        updatePaymentGateway({
                          certificateFeeUsd: certUsd,
                          customPriceUpdated: true
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                    />
                  </div>
                </div>
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

            {/* CUSTOM RIGHT-TO-LEFT SCROLLING AD BANNER & FRONT PAGE HERO CONTROL */}
            <form
              onSubmit={onSaveStorageConfig}
              className="bg-white border-2 border-[#1673B8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1673B8] to-[#1A2138] text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138]">
                      Custom Scrolling Ad Banner (Below Top Menu &amp; Above Good Morning Hero) + Front Page Text Control
                    </h3>
                    <p className="text-[11.5px] text-[#4A5568] font-medium">
                      Add, edit, or toggle right-to-left scrolling promotional banners (e.g. Highfield HACCP Level 3 program starting date) and customize the Front Page Good Morning Hero section.
                    </p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      storageConfig.frontPageConfig?.showAdBanner !== false
                    }
                    onChange={(e) =>
                      onChangeStorageConfig({
                        ...storageConfig,
                        frontPageConfig: {
                          ...storageConfig.frontPageConfig,
                          showAdBanner: e.target.checked
                        }
                      })
                    }
                    className="w-4 h-4 accent-[#1673B8] rounded cursor-pointer"
                  />
                  <span>Show Scrolling Ad Banner on Website/App</span>
                </label>
              </div>

              {/* Add / Edit Scrolling Ad Banner Item */}
              <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider">
                    {editingAdId
                      ? 'Edit Selected Scrolling Ad Banner'
                      : 'Add New Right-to-Left Scrolling Ad Banner'}
                  </span>
                  {editingAdId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAdId(null);
                        setAdTitleInput('');
                        setAdSubtitleInput('');
                      }}
                      className="text-xs font-extrabold text-red-600 hover:underline cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Badge Tag (Left Pill)
                    </label>
                    <input
                      type="text"
                      value={adBadgeInput}
                      onChange={(e) => setAdBadgeInput(e.target.value)}
                      placeholder="e.g., UPCOMING TRAINING"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Ad Headline / Training Announcement *
                    </label>
                    <input
                      type="text"
                      value={adTitleInput}
                      onChange={(e) => setAdTitleInput(e.target.value)}
                      placeholder="e.g., Highfield HACCP Level 3 International Program starting from 15th of this month — Limited Seats!"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Subtext / Schedule / Fee Details (Optional)
                    </label>
                    <input
                      type="text"
                      value={adSubtitleInput}
                      onChange={(e) => setAdSubtitleInput(e.target.value)}
                      placeholder="e.g., Free Course Study & Exam · Official QR-Verified Certificate"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={adCtaTextInput}
                      onChange={(e) => setAdCtaTextInput(e.target.value)}
                      placeholder="Enroll / Details"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Target URL / Link
                    </label>
                    <input
                      type="text"
                      value={adCtaLinkInput}
                      onChange={(e) => setAdCtaLinkInput(e.target.value)}
                      placeholder="?page=trainings"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleSaveAdBannerItem}
                      className="w-full py-2 px-3 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer transition-colors"
                    >
                      {editingAdId ? 'Update Ad' : '+ Add Ad'}
                    </button>
                  </div>
                </div>

                {/* Active & Saved Scrolling Ad Banners List */}
                <div className="space-y-2 pt-2 border-t border-[#D2DEEA]">
                  <div className="text-[11px] font-extrabold text-[#105E9A]">
                    Configured Right-to-Left Scrolling Ad Banners ({currentAdBanners.length}):
                  </div>
                  {currentAdBanners.map((ad) => (
                    <div
                      key={ad.id}
                      className="p-3 rounded-xl bg-white border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                            {ad.badgeText || 'AD BANNER'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              ad.isActive !== false
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {ad.isActive !== false ? 'MOVING LIVE' : 'PAUSED'}
                          </span>
                          <span className="font-extrabold text-[#1A2138]">
                            {ad.title || ad.headline || 'Training Announcement'}
                          </span>
                        </div>
                        {(ad.subtitle || ad.subtext) && (
                          <p className="text-[11px] text-[#4A5568]">
                            {ad.subtitle || ad.subtext} • Link: {ad.ctaLink || ad.linkUrl || '?page=trainings'}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            shareToWhatsAppGroupOrChannel(
                              ad.title || ad.headline || 'Training Announcement',
                              ad.subtitle ||
                                ad.subtext ||
                                'Special Training & Certification Announcement on Food Science Portal.',
                              ad.ctaLink || ad.linkUrl || '?page=trainings'
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#1EBE5B] text-white text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                          title="Share this Ad Announcement to WhatsApp Group/Channel"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAdId(ad.id);
                            setAdBadgeInput(ad.badgeText || 'UPCOMING TRAINING');
                            setAdTitleInput(ad.title || ad.headline || '');
                            setAdSubtitleInput(ad.subtitle || ad.subtext || '');
                            setAdCtaTextInput(ad.ctaText || ad.ctaLabel || 'Register / Details');
                            setAdCtaLinkInput(ad.ctaLink || ad.linkUrl || '?page=trainings');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#105E9A] text-[11px] font-extrabold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleAdBannerItem(ad.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-extrabold cursor-pointer"
                        >
                          {ad.isActive === false ? 'Enable' : 'Hide'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAdBannerItem(ad.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-extrabold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Front Page Hero Banner Text Overrides (Good Morning Blue Section) */}
              <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
                <div className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider">
                  Front Page &quot;Good Morning&quot; Blue Hero Banner Content Control
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Top Badge Text
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.frontPageConfig?.heroBadgeText ??
                        'Food Science Portal • International Hub'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          frontPageConfig: {
                            ...storageConfig.frontPageConfig,
                            heroBadgeText: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Custom Greeting Override (Leave blank for Auto Good Morning/Afternoon)
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.frontPageConfig?.heroCustomGreeting ?? ''
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          frontPageConfig: {
                            ...storageConfig.frontPageConfig,
                            heroCustomGreeting: e.target.value
                          }
                        })
                      }
                      placeholder="Auto: Good morning / Good afternoon"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Hero Subtitle / Description
                    </label>
                    <input
                      type="text"
                      value={
                        storageConfig.frontPageConfig?.heroSubtitle ??
                        'Explore global QA/QC & R&D jobs, international scholarships, accredited trainings, and 18+ Food Science & Lab Calculators.'
                      }
                      onChange={(e) =>
                        onChangeStorageConfig({
                          ...storageConfig,
                          frontPageConfig: {
                            ...storageConfig.frontPageConfig,
                            heroSubtitle: e.target.value
                          }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Front Page &amp; Scrolling Ad Banners (Live on Website)</span>
                </button>
              </div>
            </form>

            {/* WEBSITE PAGES & TOOLS WHATSAPP GROUP / CHANNEL SHARE CENTER */}
            <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10.5px] font-extrabold uppercase tracking-wider">
                    WhatsApp Group &amp; Channel Broadcast Center
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138] mt-1">
                    Share Any Website Page, Tool, or Certification Portal to Your WhatsApp Group / Channel
                  </h3>
                  <p className="text-xs text-[#4A5568]">
                    Click <strong>Share to WhatsApp</strong> on any page below to send a formatted announcement with its direct custom URL to your WhatsApp Group or Channel.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  {
                    title: 'Trainings & Certification Academy',
                    desc: '13 International Food Safety, HACCP, ISO 22000 & Certified Dietary Manager courses with Free Study & Exam.',
                    path: '?page=trainings'
                  },
                  {
                    title: 'Official Certificate Verification Portal',
                    desc: 'Verify any Food Science Portal credential online via Certificate ID or QR Code.',
                    path: '?page=verify-certificate'
                  },
                  {
                    title: 'Global Food Science Jobs Board',
                    desc: 'Latest QA/QC, Food Safety, R&D Lab & Production vacancies.',
                    path: '?page=jobs'
                  },
                  {
                    title: 'International Scholarships & Fellowships',
                    desc: 'Fully funded MSc, PhD & research grants in Food Science & Nutrition.',
                    path: '?page=scholarships'
                  },
                  {
                    title: '18+ Food Science & Lab Calculators',
                    desc: 'HACCP Matrix, Nutrition Facts, F0 Thermal Lethality, Sensory & Pearson Square tools.',
                    path: '?page=tools'
                  },
                  {
                    title: 'Food Specialists Community Directory',
                    desc: 'Connect with verified Food Technologists, Auditors, and QA/QC Managers.',
                    path: '?page=community'
                  }
                ].map((pg) => (
                  <div
                    key={pg.path}
                    className="p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-col justify-between gap-2.5"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-[#1A2138]">
                        {pg.title}
                      </div>
                      <p className="text-[11px] text-[#4A5568] mt-0.5 line-clamp-2">
                        {pg.desc}
                      </p>
                      <div className="text-[10px] font-mono font-bold text-[#1673B8] mt-1">
                        URL: {pg.path}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          shareToWhatsAppGroupOrChannel(
                            pg.title,
                            pg.desc,
                            pg.path
                          )
                        }
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-[11px] font-extrabold inline-flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share to WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          copyWhatsAppShareText(pg.title, pg.desc, pg.path)
                        }
                        className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-[#EBF4FC] text-[#105E9A] border border-[#D2DEEA] text-[11px] font-extrabold cursor-pointer"
                      >
                        Copy Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 1B: DEDICATED REVENUE LEDGER & DOWNLOADABLE RECORDS (revenue)
           ===================================================================== */}
        {activeTab === 'revenue' && (
          <div className="space-y-5">
            {/* TOP REVENUE SUMMARY KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-gradient-to-br from-[#1A2138] to-[#1673B8] text-white rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-sky-200 uppercase tracking-wider">
                  <span>Total Revenue Generated</span>
                  <DollarSign className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-2xl sm:text-3xl font-black">
                  Rs. {revenueSummary.totalRevenueRs.toLocaleString()}
                </div>
                <div className="text-[11px] text-sky-100 font-semibold">
                  Across {revenueSummary.totalTransactions} Verified Payments (Subscriptions + Certificates)
                </div>
              </div>

              <div className="bg-white border border-[#D2DEEA] rounded-2xl p-5 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#4A5568] uppercase tracking-wider">
                  <span>Subscription Revenue</span>
                  <Crown className="w-4 h-4 text-[#D97706]" />
                </div>
                <div className="text-2xl font-black text-[#1A2138]">
                  Rs. {revenueSummary.subscriptionRevenueRs.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-[#1673B8]">
                  {revenueSummary.subscriptionCount} Paid Membership Subscriptions
                </div>
              </div>

              <div className="bg-white border border-[#D2DEEA] rounded-2xl p-5 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#4A5568] uppercase tracking-wider">
                  <span>Certificates &amp; Bundles Revenue</span>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-[#1A2138]">
                  Rs. {revenueSummary.certificateRevenueRs.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-emerald-700">
                  {revenueSummary.certificateCount} Verified Certificates &amp; Bundles
                </div>
              </div>
            </div>

            {/* RECORD DIRECT / MANUAL REVENUE ENTRY FORM */}
            <form
              onSubmit={handleAddManualRevenueEntry}
              className="bg-white border-2 border-[#1673B8] rounded-[24px] p-5 shadow-xs space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[10.5px] font-extrabold uppercase tracking-wider">
                    Add Direct Payment Record
                  </span>
                  <h3 className="text-base font-extrabold text-[#1A2138] mt-1">
                    Record Direct WhatsApp / Bank Payment into Revenue Ledger
                  </h3>
                  <p className="text-xs text-[#4A5568]">
                    All approved Payment Slips are recorded automatically below. You can also log any direct WhatsApp or offline payment here.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => onSaveStorageConfig(e as unknown as React.FormEvent)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Revenue Ledger to Cloud</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    User Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={revUserName}
                    onChange={(e) => setRevUserName(e.target.value)}
                    placeholder="e.g., Ali Raza"
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    User Email / Phone
                  </label>
                  <input
                    type="text"
                    value={revUserEmail}
                    onChange={(e) => setRevUserEmail(e.target.value)}
                    placeholder="user@email.com / 0300..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Revenue Type
                  </label>
                  <select
                    value={revCategory}
                    onChange={(e) =>
                      setRevCategory(
                        e.target.value as
                          | 'subscription'
                          | 'certificate'
                          | 'bundle'
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  >
                    <option value="certificate">Certificate Fee</option>
                    <option value="bundle">Certificate Bundle</option>
                    <option value="subscription">Paid Membership Subscription</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Amount Received (PKR) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={revAmountRs}
                    onChange={(e) => setRevAmountRs(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-black text-[#1A2138]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Course / Bundle / Subscription Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={revItemTitle}
                    onChange={(e) => setRevItemTitle(e.target.value)}
                    placeholder="e.g., Certified Dietary Manager (Rs. 8,000) / 1-Year Membership"
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    value={revMethod}
                    onChange={(e) => setRevMethod(e.target.value)}
                    placeholder="JazzCash / EasyPaisa / Bank"
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Transaction ID (TID)
                  </label>
                  <input
                    type="text"
                    value={revTxId}
                    onChange={(e) => setRevTxId(e.target.value)}
                    placeholder="TID / Ref"
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer"
                  >
                    + Add Record
                  </button>
                </div>
              </div>
            </form>

            {/* COMPLETE REVENUE RECORDS TABLE + CSV DOWNLOAD */}
            <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D2DEEA] pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#1A2138] flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#1673B8]" />
                    <span>
                      Verified Revenue Ledger ({filteredRevenueLedger.length} Records)
                    </span>
                  </h2>
                  <p className="text-xs text-[#4A5568]">
                    Complete record of who paid, how much was received, for which subscription or certificate, and total revenue generated.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadRevenueCsv}
                    className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Revenue Record (.CSV / Excel)</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(
                    [
                      {
                        id: 'all',
                        label: `All Revenue (${revenueLedger.length})`
                      },
                      {
                        id: 'subscription',
                        label: `Subscriptions (${revenueSummary.subscriptionCount})`
                      },
                      {
                        id: 'certificate',
                        label: `Certificates & Bundles (${revenueSummary.certificateCount})`
                      }
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setRevFilterType(tab.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-extrabold cursor-pointer ${
                        revFilterType === tab.id
                          ? 'bg-[#1673B8] text-white'
                          : 'bg-[#F0F6FC] text-[#1A2138] border border-[#D2DEEA]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#1673B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={revSearchQuery}
                    onChange={(e) => setRevSearchQuery(e.target.value)}
                    placeholder="Search user, course, TID..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-xs font-semibold text-[#1A2138]"
                  />
                </div>
              </div>

              {filteredRevenueLedger.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-center text-xs font-semibold text-[#4A5568]">
                  No verified revenue records match the current filter yet. When you Accept a user&apos;s Membership or Certificate payment slip (or add a record above), it is automatically logged here.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#D2DEEA]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#1A2138] text-white uppercase text-[10.5px] tracking-wider">
                        <th className="py-3 px-3.5 font-extrabold">Date</th>
                        <th className="py-3 px-3.5 font-extrabold">User / Payer</th>
                        <th className="py-3 px-3.5 font-extrabold">Type</th>
                        <th className="py-3 px-3.5 font-extrabold">Subscription / Certificate Details</th>
                        <th className="py-3 px-3.5 font-extrabold">Method &amp; TID</th>
                        <th className="py-3 px-3.5 font-extrabold text-right">Amount (PKR)</th>
                        <th className="py-3 px-3.5 font-extrabold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D2DEEA] bg-white">
                      {filteredRevenueLedger.map((item) => {
                        const isManual = item.id.startsWith('rev-manual-');
                        return (
                          <tr key={item.id} className="hover:bg-[#F0F6FC]/70">
                            <td className="py-2.5 px-3.5 font-semibold text-slate-600 whitespace-nowrap">
                              {(item.recordedAt || '').replace('T', ' ').slice(0, 16)}
                            </td>
                            <td className="py-2.5 px-3.5">
                              <div className="font-extrabold text-[#1A2138]">
                                {item.userName}
                              </div>
                              {item.userEmail && (
                                <div className="text-[11px] text-slate-500">
                                  {item.userEmail}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  item.category === 'subscription'
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-[#EBF4FC] text-[#105E9A]'
                                }`}
                              >
                                {item.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3.5 font-bold text-[#1A2138]">
                              {item.itemTitle}
                            </td>
                            <td className="py-2.5 px-3.5">
                              <div className="font-semibold text-[#1A2138]">
                                {item.paymentMethod}
                              </div>
                              <div className="font-mono text-[10.5px] text-[#1673B8]">
                                TID: {item.transactionId}
                              </div>
                            </td>
                            <td className="py-2.5 px-3.5 text-right font-black text-emerald-700 whitespace-nowrap">
                              Rs. {(Number(item.amountRs) || 0).toLocaleString()}
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              {isManual ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteManualRevenueEntry(item.id)
                                  }
                                  className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-extrabold cursor-pointer"
                                >
                                  Remove
                                </button>
                              ) : (
                                <span className="text-[10.5px] font-bold text-emerald-700">
                                  Verified Slip
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-[#F0F6FC] border-t-2 border-[#1673B8] font-black text-xs text-[#1A2138]">
                        <td colSpan={5} className="py-3 px-3.5 text-right uppercase">
                          Total Revenue Shown ({filteredRevenueLedger.length} Payments):
                        </td>
                        <td className="py-3 px-3.5 text-right text-sm text-[#1673B8] whitespace-nowrap">
                          Rs.{' '}
                          {filteredRevenueLedger
                            .reduce(
                              (sum, r) => sum + (Number(r.amountRs) || 0),
                              0
                            )
                            .toLocaleString()}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
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
                      Pending Payment Slips — Accept, Reject or Delete (
                      {sortedPaymentRequests.length})
                    </span>
                  </h2>
                  <p className="text-xs text-[#4A5568] font-medium">
                    Clicking <strong>Accept</strong>, <strong>Reject</strong>, or <strong>Delete</strong> automatically processes the request, logs verified revenue in the Revenue Ledger, and immediately closes the request from this queue.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-extrabold">
                  {stats.pendingRequests} Pending Review
                </span>
              </div>

              {sortedPaymentRequests.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-center text-xs text-[#4A5568] font-semibold">
                  All pending payment requests have been handled and closed! Verified payments are saved in the <strong>Revenue Ledger</strong> tab, and you can also manage any user directly below.
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
                          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-amber-200 text-amber-950">
                            PENDING
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleActionAndAutoClosePaymentRequest(
                                req,
                                'delete'
                              )
                            }
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            title="Delete and close this payment request"
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
                          onClick={() =>
                            handleActionAndAutoClosePaymentRequest(
                              req,
                              'verified'
                            )
                          }
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
                          onClick={() =>
                            handleActionAndAutoClosePaymentRequest(
                              req,
                              'rejected'
                            )
                          }
                          className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                          <span>Reject</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleActionAndAutoClosePaymentRequest(
                              req,
                              'delete'
                            )
                          }
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

            {/* SECTION B: ALL REGISTERED USERS & COMMUNITY DIRECTORY CONTROL */}
            <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D2DEEA] pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#1A2138] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#1673B8]" />
                    <span>
                      Users &amp; Community Directory Control ({filteredUsersList.length})
                    </span>
                  </h2>
                  <p className="text-xs text-[#4A5568] font-medium">
                    Add new Community specialists, edit any member profile, control Community visibility, or remove any user.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {onAdminSaveCommunityUser && (
                    <button
                      type="button"
                      onClick={() =>
                        showCommunityForm
                          ? (setShowCommunityForm(false), resetCommunityMemberForm())
                          : openNewCommunityMemberForm()
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {showCommunityForm
                          ? 'Close Member Form'
                          : 'Add Community Member'}
                      </span>
                    </button>
                  )}

                  {/* Search Box */}
                  <div className="relative flex-1 sm:w-64">
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
              </div>

              {/* ADMIN ADD / EDIT COMMUNITY MEMBER FORM */}
              {showCommunityForm && onAdminSaveCommunityUser && (
                <form
                  onSubmit={handleSaveCommunityMemberSubmit}
                  className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#1673B8] space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#D2DEEA] pb-2.5">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#1A2138]">
                        {editingMemberUid
                          ? `Edit Community Profile: ${cmName || 'Member'}`
                          : 'Add New Specialist Profile to Community Directory'}
                      </h3>
                      <p className="text-[11px] text-[#4A5568] font-medium">
                        Profiles marked Paid Premium + Visible appear directly in the public Community directory.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCommunityForm(false);
                        resetCommunityMemberForm();
                      }}
                      className="p-1.5 rounded-lg bg-white border border-[#D2DEEA] text-[#4A5568] hover:text-[#1A2138] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Avatar + Core Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-3 flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="w-12 h-12 rounded-xl bg-[#1A2138] text-white font-extrabold flex items-center justify-center overflow-hidden border border-[#D2DEEA] shrink-0">
                        {cmAvatar ? (
                          <img
                            src={cmAvatar}
                            alt={cmName || 'Member'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (cmName || 'M').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="px-3 py-1.5 rounded-lg bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#105E9A] text-xs font-extrabold cursor-pointer">
                          <span>Upload Profile Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCommunityAvatarUpload}
                            className="hidden"
                          />
                        </label>
                        {cmAvatar && (
                          <button
                            type="button"
                            onClick={() => setCmAvatar('')}
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold cursor-pointer"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={cmName}
                        onChange={(e) => setCmName(e.target.value)}
                        placeholder="e.g. Dr. Ayesha Tariq"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        Role / Job Title *
                      </label>
                      <input
                        type="text"
                        value={cmTitle}
                        onChange={(e) => setCmTitle(e.target.value)}
                        placeholder="e.g. QA/QC Manager · FSSC 22000 Auditor"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={cmCompany}
                        onChange={(e) => setCmCompany(e.target.value)}
                        placeholder="e.g. Nestle / FrieslandCampina"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={cmLocation}
                        onChange={(e) => setCmLocation(e.target.value)}
                        placeholder="e.g. Lahore, Pakistan"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={cmCountry}
                        onChange={(e) => setCmCountry(e.target.value)}
                        placeholder="e.g. Pakistan / UAE / Saudi Arabia"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        value={cmQualification}
                        onChange={(e) => setCmQualification(e.target.value)}
                        placeholder="e.g. MSc Food Science & Technology"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={cmEmail}
                        onChange={(e) => setCmEmail(e.target.value)}
                        placeholder="specialist@company.com"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={cmPhone}
                        onChange={(e) => setCmPhone(e.target.value)}
                        placeholder="+92 300 0000000"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="text"
                        value={cmLinkedin}
                        onChange={(e) => setCmLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        Skills (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={cmSkills}
                        onChange={(e) => setCmSkills(e.target.value)}
                        placeholder="HACCP, ISO 22000, FSSC 22000, Dairy QA, Microbiology"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        Experience Summary
                      </label>
                      <input
                        type="text"
                        value={cmExperience}
                        onChange={(e) => setCmExperience(e.target.value)}
                        placeholder="e.g. 6+ Years in Dairy & Beverages QA"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                        Professional Bio
                      </label>
                      <textarea
                        rows={2}
                        value={cmBio}
                        onChange={(e) => setCmBio(e.target.value)}
                        placeholder="Brief background, food safety audits led, and expertise areas..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>
                  </div>

                  {/* Directory Visibility & Tier Switches */}
                  <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-white border border-[#D2DEEA]">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#1A2138] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmIsPaid}
                        onChange={(e) => setCmIsPaid(e.target.checked)}
                        className="w-4 h-4 accent-[#1673B8]"
                      />
                      <span>Paid Premium Tier (Required for Community Directory)</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#1A2138] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmVisibleInCommunity}
                        onChange={(e) => setCmVisibleInCommunity(e.target.checked)}
                        className="w-4 h-4 accent-[#1673B8]"
                      />
                      <span>Visible in Community Section</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#1A2138] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmHireMe}
                        onChange={(e) => setCmHireMe(e.target.checked)}
                        className="w-4 h-4 accent-[#1673B8]"
                      />
                      <span>Available for Hire (Hire Me)</span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSavingCommunityMember}
                      className="ml-auto px-5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer transition-colors disabled:opacity-60"
                    >
                      {isSavingCommunityMember
                        ? 'Saving Profile...'
                        : editingMemberUid
                        ? 'Update Community Profile'
                        : 'Save & Publish to Community'}
                    </button>
                  </div>
                </form>
              )}

              {/* User Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#F0F6FC] rounded-xl overflow-x-auto no-scrollbar">
                {(
                  [
                    { id: 'all', label: `All Users (${stats.totalUsers})` },
                    {
                      id: 'community',
                      label: `Community Visible (${communityVisibleCount})`
                    },
                    {
                      id: 'hidden',
                      label: `Hidden Profiles (${hiddenCommunityCount})`
                    },
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 whitespace-nowrap cursor-pointer transition-colors ${
                      userFilter === f.id
                        ? 'bg-[#1673B8] text-white shadow-2xs'
                        : 'text-[#1A2138] hover:bg-white'
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
                                <div className="text-[11px] font-bold text-[#4A5568] flex flex-wrap items-center gap-1.5">
                                  <span>{isPremium ? 'Paid Premium' : 'Free Tier'}</span>
                                  <span aria-hidden="true">·</span>
                                  <span
                                    className={
                                      isPremium && u.profileVisibility !== false
                                        ? 'text-emerald-700'
                                        : 'text-amber-700'
                                    }
                                  >
                                    {isPremium && u.profileVisibility !== false
                                      ? 'Visible in Community'
                                      : u.profileVisibility === false
                                      ? 'Hidden from Community'
                                      : 'Not Listed (Free)'}
                                  </span>
                                  {u.paymentStatus === 'pending' && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="text-amber-800">Payment Pending</span>
                                    </>
                                  )}
                                  {u.paymentStatus === 'rejected' && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="text-red-700">Payment Rejected</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <p className="text-xs font-bold text-[#1673B8]">
                                {u.title ||
                                  u.currentRole ||
                                  'Food Safety & Quality Specialist'}
                                {u.company ? ` • ${u.company}` : ''}
                              </p>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#4A5568] font-medium">
                                {u.email && <span>{u.email}</span>}
                                {u.phone && <span>{u.phone}</span>}
                                {u.location && <span>{u.location}</span>}
                              </div>
                            </div>
                          </div>

                          {/* DIRECT ADMIN CONTROL BUTTONS FOR THIS USER */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {onAdminSaveCommunityUser && (
                              <button
                                type="button"
                                onClick={() => openEditCommunityMemberForm(u)}
                                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#1673B8]/40 text-[#1673B8] text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Profile</span>
                              </button>
                            )}

                            {onAdminSaveCommunityUser && (
                              <button
                                type="button"
                                onClick={() =>
                                  onAdminSaveCommunityUser({
                                    ...u,
                                    profileVisibility:
                                      u.profileVisibility === false ? true : false
                                  })
                                }
                                className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                                  u.profileVisibility === false
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-white hover:bg-amber-50 text-[#1A2138] border-[#D2DEEA]'
                                }`}
                                title={
                                  u.profileVisibility === false
                                    ? 'Show this user in Community directory'
                                    : 'Hide this user from Community directory'
                                }
                              >
                                {u.profileVisibility === false ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Show in Community</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span>Hide from Community</span>
                                  </>
                                )}
                              </button>
                            )}

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
                    No separate fields needed! Paste text OR attach a job flyer
                    picture below, choose category, and publish with today&apos;s
                    date ({todayFormatted}).
                  </p>
                </div>
                {onOpenShareFlyerModal && (
                  <button
                    type="button"
                    onClick={() => onOpenShareFlyerModal('job')}
                    className="px-3.5 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                  >
                    <ImageIcon className="w-4 h-4 text-sky-300" />
                    <span>Post from Picture / Flyer (AI Read)</span>
                  </button>
                )}
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
                  rows={6}
                  required={!jobFlyerPreview}
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

              {/* OPTIONAL FLYER IMAGE UPLOAD */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA]">
                <div className="flex items-center gap-2.5 min-w-0">
                  {jobFlyerPreview ? (
                    <img
                      src={jobFlyerPreview}
                      alt="Job Flyer Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-[#D2DEEA] shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#EBF4FC] text-[#1673B8] flex items-center justify-center shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#1A2138]">
                      {jobFlyerPreview
                        ? 'Job Picture Attached ✓'
                        : 'Attach Job Flyer Picture (Optional)'}
                    </div>
                    <div className="text-[11px] text-[#4A5568] truncate">
                      Upload a job poster from gallery or share directly from
                      WhatsApp to the app
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#94B8D7] text-[#1673B8] text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{jobFlyerPreview ? 'Change Pic' : 'Pick Picture'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => void handleQuickFlyerPick(e, 'job')}
                      className="hidden"
                    />
                  </label>
                  {jobFlyerPreview && (
                    <button
                      type="button"
                      onClick={() => setJobFlyerPreview('')}
                      className="px-2.5 py-1.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPostingJob || (!jobPasteText.trim() && !jobFlyerPreview)}
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
                      <div className="flex items-start gap-3 min-w-0">
                        {job.flyerImageUrl && (
                          <img
                            src={job.flyerImageUrl}
                            alt={job.title}
                            className="w-12 h-12 rounded-xl object-cover border border-[#D2DEEA] shrink-0"
                          />
                        )}
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
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            shareToWhatsAppGroupOrChannel(
                              `New Job Opening: ${job.title}`,
                              `${job.category || 'Food Science & QA/QC'} (${job.country || 'Global'})\n${(job.description || '').slice(0, 180)}...`,
                              '?page=jobs'
                            )
                          }
                          className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                          title="Share Job to WhatsApp Group / Channel"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteJob(job)}
                          className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
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
                    Choose category, paste text OR attach a scholarship poster
                    below, and publish immediately with today&apos;s date (
                    {todayFormatted}).
                  </p>
                </div>
                {onOpenShareFlyerModal && (
                  <button
                    type="button"
                    onClick={() => onOpenShareFlyerModal('scholarship')}
                    className="px-3.5 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                  >
                    <ImageIcon className="w-4 h-4 text-sky-300" />
                    <span>Post from Picture / Flyer (AI Read)</span>
                  </button>
                )}
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
                  rows={6}
                  required={!schFlyerPreview}
                  value={schPasteText}
                  onChange={(e) => setSchPasteText(e.target.value)}
                  placeholder={`Paste the full scholarship details here...\nExample:\nErasmus Mundus MSc Food Innovation Scholarship (Europe)\nFully funded fellowship for BS Food Science & Technology graduates.\nApply online at: https://example.org or email admissions@university.edu`}
                  className="w-full p-4 rounded-2xl bg-[#F0F6FC] border-[1.5px] border-[#94B8D7] focus:border-[#1673B8] focus:bg-white text-xs sm:text-sm font-medium text-[#1A2138] leading-relaxed focus:outline-none"
                />
              </div>

              {/* OPTIONAL SCHOLARSHIP FLYER UPLOAD */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA]">
                <div className="flex items-center gap-2.5 min-w-0">
                  {schFlyerPreview ? (
                    <img
                      src={schFlyerPreview}
                      alt="Scholarship Flyer Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-[#D2DEEA] shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#EBF4FC] text-[#1673B8] flex items-center justify-center shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#1A2138]">
                      {schFlyerPreview
                        ? 'Scholarship Poster Attached ✓'
                        : 'Attach Scholarship Poster Picture (Optional)'}
                    </div>
                    <div className="text-[11px] text-[#4A5568] truncate">
                      Upload a flyer from gallery or share directly from
                      WhatsApp to the app
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#94B8D7] text-[#1673B8] text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{schFlyerPreview ? 'Change Pic' : 'Pick Picture'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        void handleQuickFlyerPick(e, 'scholarship')
                      }
                      className="hidden"
                    />
                  </label>
                  {schFlyerPreview && (
                    <button
                      type="button"
                      onClick={() => setSchFlyerPreview('')}
                      className="px-2.5 py-1.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isPostingSch || (!schPasteText.trim() && !schFlyerPreview)
                }
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
                    from the frontend app, or Share directly to WhatsApp.
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
                      <div className="flex items-start gap-3 min-w-0">
                        {sch.flyerImageUrl && (
                          <img
                            src={sch.flyerImageUrl}
                            alt={sch.title}
                            className="w-12 h-12 rounded-xl object-cover border border-[#D2DEEA] shrink-0"
                          />
                        )}
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
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            shareToWhatsAppGroupOrChannel(
                              `Scholarship Opportunity: ${sch.title}`,
                              `${sch.fundingType} (${sch.country || 'International'})\n${(sch.description || '').slice(0, 180)}...`,
                              '?page=scholarships'
                            )
                          }
                          className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                          title="Share Scholarship to WhatsApp Group / Channel"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteScholarship(sch)}
                          className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
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
                      onClick={() => {
                        setDirectTopicMode('custom');
                        setDirectCustomCourseCode(
                          generateAutoQualificationCode(directCustomTopicTitle)
                        );
                      }}
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
                        onChange={(e) => {
                          const nextTitle = e.target.value;
                          setDirectCustomTopicTitle(nextTitle);
                          setDirectCustomCourseCode(
                            generateAutoQualificationCode(nextTitle)
                          );
                        }}
                        placeholder="e.g., ISO 22000:2018 Lead Auditor / Halal Food Standards"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-extrabold text-[#1A2138]">
                          Custom Qualification Code (Auto-Generated)
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setDirectCustomCourseCode(
                              generateAutoQualificationCode(
                                directCustomTopicTitle,
                                true
                              )
                            )
                          }
                          className="text-[10.5px] font-extrabold text-[#1673B8] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Auto-Generate</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={directCustomCourseCode}
                        onChange={(e) => setDirectCustomCourseCode(e.target.value)}
                        placeholder="Auto: FSP-CERT-2026"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
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

            {/* CERTIFICATE DOWNLOAD APPROVAL REQUESTS */}
            <div className="bg-white border-2 border-amber-500 rounded-[26px] p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold">
                    Certificate &amp; Bundle Download Approval Requests
                  </span>
                  <h2 className="text-lg font-extrabold text-[#1A2138] mt-1">
                    Approve / Allow User Certificate Downloads (Auto-Closes on Click)
                  </h2>
                  <p className="text-xs text-[#4A5568] font-medium">
                    When a user submits a Certificate Unlock or Bundle payment request, it appears here. Clicking <strong>Accept</strong>, <strong>Reject</strong>, or <strong>Delete</strong> processes the request, logs verified revenue in the Revenue Ledger, and automatically closes the request from this queue.
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
                        className="p-4 rounded-2xl border space-y-2.5 bg-[#FFFDF5] border-2 border-[#F59E0B]"
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
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-950">
                              PENDING
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleActionAndAutoClosePaymentRequest(
                                  req,
                                  'delete'
                                )
                              }
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Delete and close this request"
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
                            onClick={() =>
                              handleActionAndAutoClosePaymentRequest(
                                req,
                                'verified'
                              )
                            }
                            className="py-2 px-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleActionAndAutoClosePaymentRequest(
                                req,
                                'rejected'
                              )
                            }
                            className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleActionAndAutoClosePaymentRequest(
                                req,
                                'delete'
                              )
                            }
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

                {/* PUBLISHED TRAININGS — EDIT TOPICS, PRICES, MODULES, MCQS, VISIBILITY OR REMOVE */}
                <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-[#1A2138]">
                        Published Trainings — Edit Topic Title, Certificate Price (Synced to Bundles), Modules &amp; MCQs ({trainings.length})
                      </h3>
                      <p className="text-xs text-[#4A5568]">
                        Change any course&apos;s Topic/Title, Course Code, Certificate Fee in PKR (e.g., Rs. 8,000 for Certified Dietary Manager or any price), Duration, Overview Description, Modules, and MCQs. Any certificate fee set here automatically applies to the Certificate Bundle Offers (with 25% bundle discount)!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        shareToWhatsAppGroupOrChannel(
                          'Official QR-Verified Certificate Packages & 25% OFF Career Bundles',
                          'Study all 13 International Food Safety, HACCP, ISO 22000 & Certified Dietary Manager courses 100% Free! Select any 3, 5, or all 13 certificates for an automatic 25% Bundle Discount + Free Paid Membership.',
                          '?page=trainings'
                        )
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Bundles to WhatsApp</span>
                    </button>
                  </div>

                  {trainings.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-center text-xs font-semibold text-[#4A5568]">
                      No training courses have been added yet. Use the form above to add your first International Certification training course (with Modules and MCQs).
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trainings.map((tr) => {
                        const isDietary =
                          tr.id === 'mgr-food-dietary-2026' ||
                          tr.title.toLowerCase().includes('dietary');
                        const defaultCertFee =
                          tr.certificateFeeRs || (isDietary ? 8000 : 1000);
                        const currentTitleVal =
                          priceEdits[tr.id]?.title !== undefined
                            ? priceEdits[tr.id].title!
                            : tr.title;
                        const currentCodeVal =
                          priceEdits[tr.id]?.standardCode !== undefined
                            ? priceEdits[tr.id].standardCode!
                            : tr.standardCode || (isDietary ? 'CDM-CERT' : 'FSC-INT');
                        const currentCertFeeRsVal =
                          priceEdits[tr.id]?.certificateFeeRs !== undefined
                            ? priceEdits[tr.id].certificateFeeRs!
                            : defaultCertFee;
                        const currentFeeVal =
                          priceEdits[tr.id]?.fees !== undefined
                            ? priceEdits[tr.id].fees
                            : tr.fees;
                        const currentDurVal =
                          priceEdits[tr.id]?.duration !== undefined
                            ? priceEdits[tr.id].duration
                            : tr.duration;
                        const currentDescVal =
                          priceEdits[tr.id]?.description !== undefined
                            ? priceEdits[tr.id].description!
                            : tr.description;
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
                                    {tr.standardCode || currentCodeVal} · {tr.category}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10.5px] font-extrabold">
                                    Cert Fee: Rs. {(tr.certificateFeeRs || defaultCertFee).toLocaleString()}
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
                                    shareToWhatsAppGroupOrChannel(
                                      `Certification Course: ${tr.title}`,
                                      `Free Course Material & Exam · Official QR-Verified Certificate (Rs. ${(tr.certificateFeeRs || defaultCertFee).toLocaleString()}).\n${tr.description}`,
                                      `?page=trainings&course=${encodeURIComponent(tr.id)}`
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                                  title="Share this Training Course to WhatsApp Group/Channel"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </button>
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
                                    : `Edit Modules (${trMods.length}) & MCQs (${trMcqs.length})`}
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

                            {/* INLINE TOPIC TITLE, COURSE CODE, NUMERIC CERTIFICATE FEE (RS.), DURATION & DESCRIPTION EDITOR */}
                            <div className="p-3.5 rounded-2xl bg-white border border-[#D2DEEA] space-y-2.5">
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                                <div className="sm:col-span-5">
                                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                    Course Topic / Title (Live on Website &amp; Certificate)
                                  </label>
                                  <input
                                    type="text"
                                    value={currentTitleVal}
                                    onChange={(e) =>
                                      setPriceEdits((prev) => ({
                                        ...prev,
                                        [tr.id]: {
                                          ...prev[tr.id],
                                          title: e.target.value,
                                          standardCode: currentCodeVal,
                                          certificateFeeRs: currentCertFeeRsVal,
                                          fees: currentFeeVal,
                                          duration: currentDurVal,
                                          description: currentDescVal
                                        }
                                      }))
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                    Course Code
                                  </label>
                                  <input
                                    type="text"
                                    value={currentCodeVal}
                                    onChange={(e) =>
                                      setPriceEdits((prev) => ({
                                        ...prev,
                                        [tr.id]: {
                                          ...prev[tr.id],
                                          title: currentTitleVal,
                                          standardCode: e.target.value,
                                          certificateFeeRs: currentCertFeeRsVal,
                                          fees: currentFeeVal,
                                          duration: currentDurVal,
                                          description: currentDescVal
                                        }
                                      }))
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                    Cert Fee (Rs.) *
                                  </label>
                                  <input
                                    type="number"
                                    min={100}
                                    value={currentCertFeeRsVal}
                                    onChange={(e) => {
                                      const numFee = Math.max(0, Number(e.target.value) || 0);
                                      setPriceEdits((prev) => ({
                                        ...prev,
                                        [tr.id]: {
                                          ...prev[tr.id],
                                          title: currentTitleVal,
                                          standardCode: currentCodeVal,
                                          certificateFeeRs: numFee,
                                          fees: `Free Study & Exam · Rs. ${numFee.toLocaleString()} Certificate`,
                                          duration: currentDurVal,
                                          description: currentDescVal
                                        }
                                      }));
                                    }}
                                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-black text-emerald-800"
                                  />
                                </div>

                                <div className="sm:col-span-3">
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
                                          ...prev[tr.id],
                                          title: currentTitleVal,
                                          standardCode: currentCodeVal,
                                          certificateFeeRs: currentCertFeeRsVal,
                                          fees: currentFeeVal,
                                          duration: e.target.value,
                                          description: currentDescVal
                                        }
                                      }))
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                                <div className="sm:col-span-9">
                                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                    Course Overview / Description
                                  </label>
                                  <input
                                    type="text"
                                    value={currentDescVal}
                                    onChange={(e) =>
                                      setPriceEdits((prev) => ({
                                        ...prev,
                                        [tr.id]: {
                                          ...prev[tr.id],
                                          title: currentTitleVal,
                                          standardCode: currentCodeVal,
                                          certificateFeeRs: currentCertFeeRsVal,
                                          fees: currentFeeVal,
                                          duration: currentDurVal,
                                          description: e.target.value
                                        }
                                      }))
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-medium text-[#1A2138]"
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCoursePrice(tr)}
                                    className="w-full py-2 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors h-[36px]"
                                  >
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                    <span>Save Course &amp; Price</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* EXPANDABLE MODULES & MCQS MANAGER FOR THIS EXISTING TRAINING */}
                            {isBuilderOpen && (
                              <div className="pt-3 border-t-2 border-[#1673B8]/30 space-y-4">
                                {/* 1. Manage Modules for this Course */}
                                <div className="p-3.5 rounded-2xl bg-white border border-[#D2DEEA] space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-extrabold text-[#1A2138]">
                                      Course Modules ({trMods.length}) — Edit Existing Modules or Add New Module
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
                                        placeholder="New Module Subject..."
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
                                        placeholder="New Module Description & study details..."
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
                                    <div className="space-y-2">
                                      {trMods.map((m, idx) => {
                                        const isEditingThisMod =
                                          editingModMap[m.id] !== undefined;
                                        const modEditState =
                                          editingModMap[m.id] || {
                                            subject: m.subject,
                                            description: m.description
                                          };
                                        return (
                                          <div
                                            key={m.id}
                                            className="p-3 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2 text-xs"
                                          >
                                            {isEditingThisMod ? (
                                              <div className="space-y-2">
                                                <input
                                                  type="text"
                                                  value={modEditState.subject}
                                                  onChange={(e) =>
                                                    setEditingModMap((prev) => ({
                                                      ...prev,
                                                      [m.id]: {
                                                        ...modEditState,
                                                        subject: e.target.value
                                                      }
                                                    }))
                                                  }
                                                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#1673B8] text-xs font-extrabold text-[#1A2138]"
                                                />
                                                <textarea
                                                  rows={3}
                                                  value={
                                                    modEditState.description
                                                  }
                                                  onChange={(e) =>
                                                    setEditingModMap((prev) => ({
                                                      ...prev,
                                                      [m.id]: {
                                                        ...modEditState,
                                                        description:
                                                          e.target.value
                                                      }
                                                    }))
                                                  }
                                                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#1673B8] text-xs font-medium text-[#1A2138]"
                                                />
                                                <div className="flex items-center justify-end gap-2">
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      setEditingModMap(
                                                        (prev) => {
                                                          const copy = {
                                                            ...prev
                                                          };
                                                          delete copy[m.id];
                                                          return copy;
                                                        }
                                                      )
                                                    }
                                                    className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 text-[11px] font-bold cursor-pointer"
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleSaveExistingModuleEdit(
                                                        tr,
                                                        m.id
                                                      )
                                                    }
                                                    className="px-3 py-1 rounded-lg bg-[#1673B8] text-white text-[11px] font-extrabold cursor-pointer"
                                                  >
                                                    Save Module Content
                                                  </button>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="flex items-start justify-between gap-2">
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
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      setEditingModMap(
                                                        (prev) => ({
                                                          ...prev,
                                                          [m.id]: {
                                                            subject: m.subject,
                                                            description:
                                                              m.description ||
                                                              ''
                                                          }
                                                        })
                                                      )
                                                    }
                                                    className="px-2 py-1 rounded-lg bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#105E9A] text-[11px] font-extrabold cursor-pointer"
                                                  >
                                                    Edit Content
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleDeleteModuleFromExistingTraining(
                                                        tr,
                                                        m.id
                                                      )
                                                    }
                                                    className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-extrabold cursor-pointer"
                                                  >
                                                    Delete
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
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

                {/* =================================================================
                    CUSTOM TRAININGS MANAGER (ADD, EDIT PRICE & DETAILS, REMOVE)
                   ================================================================= */}
                <div className="bg-white border-2 border-[#1673B8] rounded-[26px] p-5 shadow-sm space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[11px] font-extrabold">
                        Custom Trainings &amp; Registration Control
                      </span>
                      <h3 className="text-lg font-extrabold text-[#1A2138] mt-1">
                        Manage Custom Trainings — Add, Edit Price &amp; Details, or Remove ({liveCustomTrainings.length})
                      </h3>
                      <p className="text-xs text-[#4A5568]">
                        Any Custom Training added or updated here appears immediately under the <strong>Custom Trainings</strong> tab in the Trainings section for users to view and register.
                      </p>
                    </div>
                  </div>

                  {/* Add New Custom Training Form */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!ctTitle.trim()) {
                        onSetBanner('Please enter a Custom Training Title before publishing.');
                        return;
                      }
                      const autoCode =
                        ctCode.trim() ||
                        `CT-${ctTitle
                          .trim()
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((w) => w.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3))
                          .join('')}-${Math.floor(100 + Math.random() * 900)}`;
                      const parsedTopics = ctTopicsText
                        .split(/\n|,/)
                        .map((s) => s.trim())
                        .filter(Boolean);
                      const newItem: CustomTrainingItem = {
                        id: `ct-${Date.now()}`,
                        title: ctTitle.trim(),
                        code: autoCode,
                        priceRs: Math.max(0, Number(ctPriceRs) || 0),
                        priceUsd: Number.isFinite(Number(ctPriceUsd))
                          ? Math.max(0, Number(ctPriceUsd))
                          : 15,
                        duration: ctDuration.trim() || '2 Weeks',
                        mode: ctMode.trim() || 'Online Live / Hybrid',
                        accreditationStandard:
                          ctStandard.trim() ||
                          'Codex Alimentarius & Industrial QA/QC Standard',
                        instructor:
                          ctInstructor.trim() ||
                          'Food Science Portal Industrial Faculty',
                        description:
                          ctDescription.trim() ||
                          'Specialized hands-on industrial training program for food technologists and QA/QC professionals.',
                        topics:
                          parsedTopics.length > 0
                            ? parsedTopics
                            : [
                                'Industrial Process Control & SOP Implementation',
                                'Quality Assurance Testing & Batch Documentation',
                                'Regulatory & Audit Compliance Workshop'
                              ],
                        isActive: true
                      };
                      const nextList = [newItem, ...liveCustomTrainings];
                      const ok = await persistCustomTrainings(
                        nextList,
                        `Custom Training "${newItem.title}" added and published!`
                      );
                      if (ok) {
                        setCtTitle('');
                        setCtCode('');
                        setCtDescription('');
                        setCtTopicsText('');
                      }
                    }}
                    className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3.5"
                  >
                    <div className="text-xs font-extrabold text-[#1A2138]">
                      + Add New Custom Training Program
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Custom Training Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={ctTitle}
                          onChange={(e) => setCtTitle(e.target.value)}
                          placeholder="e.g., Industrial Dairy & Beverage QA/QC Hands-On Workshop"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Training Code
                        </label>
                        <input
                          type="text"
                          value={ctCode}
                          onChange={(e) => setCtCode(e.target.value)}
                          placeholder="e.g., CT-QA-105"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Price / Fee (Rs.) *
                        </label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={ctPriceRs}
                          onChange={(e) => setCtPriceRs(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-black text-emerald-800"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Duration *
                        </label>
                        <input
                          type="text"
                          required
                          value={ctDuration}
                          onChange={(e) => setCtDuration(e.target.value)}
                          placeholder="e.g., 2 Weeks / 5 Days"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Training Mode
                        </label>
                        <input
                          type="text"
                          value={ctMode}
                          onChange={(e) => setCtMode(e.target.value)}
                          placeholder="Online Live / Hybrid / On-Site"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Intl Fee (USD $)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={ctPriceUsd}
                          onChange={(e) => setCtPriceUsd(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Standard / Faculty
                        </label>
                        <input
                          type="text"
                          value={ctStandard}
                          onChange={(e) => setCtStandard(e.target.value)}
                          placeholder="Codex Alimentarius & Industrial Standard"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Training Details / Overview Description *
                        </label>
                        <textarea
                          rows={2}
                          value={ctDescription}
                          onChange={(e) => setCtDescription(e.target.value)}
                          placeholder="Describe what participants will learn in this Custom Training..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-medium text-[#1A2138]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                          Key Topics Covered (One per line or comma-separated)
                        </label>
                        <textarea
                          rows={2}
                          value={ctTopicsText}
                          onChange={(e) => setCtTopicsText(e.target.value)}
                          placeholder="Topic 1, Topic 2, Topic 3..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-medium text-[#1A2138]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingCustomTraining}
                      className="px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-50 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {isSavingCustomTraining
                          ? 'Saving Custom Training...'
                          : 'Add & Publish Custom Training'}
                      </span>
                    </button>
                  </form>

                  {/* Existing Custom Trainings List — Edit Price, Details, or Remove */}
                  <div className="space-y-3">
                    {liveCustomTrainings.map((ct) => {
                      const editState = ctEdits[ct.id] || {
                        title: ct.title,
                        code: ct.code,
                        priceRs: ct.priceRs,
                        priceUsd: ct.priceUsd ?? 15,
                        duration: ct.duration,
                        mode: ct.mode,
                        description: ct.description,
                        topicsText: (ct.topics || []).join('\n')
                      };

                      return (
                        <div
                          key={ct.id}
                          className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#1673B8] text-white text-[10.5px] font-extrabold">
                                  {ct.code} · {ct.mode}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10.5px] font-extrabold">
                                  Fee: Rs. {Number(ct.priceRs || 0).toLocaleString()}
                                  {ct.priceUsd ? ` ($${ct.priceUsd})` : ''}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D2DEEA] text-[#1A2138] text-[10.5px] font-bold">
                                  {ct.duration}
                                </span>
                              </div>
                              <h4 className="text-sm font-extrabold text-[#1A2138] mt-1">
                                {ct.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={async () => {
                                  const nextList = liveCustomTrainings.filter(
                                    (item) => item.id !== ct.id
                                  );
                                  await persistCustomTrainings(
                                    nextList,
                                    `Removed Custom Training "${ct.title}".`
                                  );
                                }}
                                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-white border border-[#D2DEEA] space-y-2.5">
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                              <div className="sm:col-span-5">
                                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                  Custom Training Title
                                </label>
                                <input
                                  type="text"
                                  value={editState.title}
                                  onChange={(e) =>
                                    setCtEdits((prev) => ({
                                      ...prev,
                                      [ct.id]: { ...editState, title: e.target.value }
                                    }))
                                  }
                                  className="w-full px-3 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                  Code
                                </label>
                                <input
                                  type="text"
                                  value={editState.code}
                                  onChange={(e) =>
                                    setCtEdits((prev) => ({
                                      ...prev,
                                      [ct.id]: { ...editState, code: e.target.value }
                                    }))
                                  }
                                  className="w-full px-3 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                  Price (Rs. / $)
                                </label>
                                <div className="grid grid-cols-2 gap-1">
                                  <input
                                    type="number"
                                    min={0}
                                    value={editState.priceRs}
                                    onChange={(e) =>
                                      setCtEdits((prev) => ({
                                        ...prev,
                                        [ct.id]: {
                                          ...editState,
                                          priceRs: Number(e.target.value) || 0
                                        }
                                      }))
                                    }
                                    title="Fee in PKR"
                                    className="w-full px-2 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-black text-emerald-800"
                                  />
                                  <input
                                    type="number"
                                    min={0}
                                    value={editState.priceUsd}
                                    onChange={(e) =>
                                      setCtEdits((prev) => ({
                                        ...prev,
                                        [ct.id]: {
                                          ...editState,
                                          priceUsd: Number(e.target.value) || 0
                                        }
                                      }))
                                    }
                                    title="International Fee in USD"
                                    className="w-full px-2 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-black text-[#1673B8]"
                                  />
                                </div>
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                  Duration &amp; Mode
                                </label>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <input
                                    type="text"
                                    value={editState.duration}
                                    onChange={(e) =>
                                      setCtEdits((prev) => ({
                                        ...prev,
                                        [ct.id]: {
                                          ...editState,
                                          duration: e.target.value
                                        }
                                      }))
                                    }
                                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                                  />
                                  <input
                                    type="text"
                                    value={editState.mode}
                                    onChange={(e) =>
                                      setCtEdits((prev) => ({
                                        ...prev,
                                        [ct.id]: {
                                          ...editState,
                                          mode: e.target.value
                                        }
                                      }))
                                    }
                                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                              <div className="sm:col-span-5">
                                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                  Description / Details
                                </label>
                                <textarea
                                  rows={2}
                                  value={editState.description}
                                  onChange={(e) =>
                                    setCtEdits((prev) => ({
                                      ...prev,
                                      [ct.id]: {
                                        ...editState,
                                        description: e.target.value
                                      }
                                    }))
                                  }
                                  className="w-full px-3 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-medium text-[#1A2138]"
                                />
                              </div>
                              <div className="sm:col-span-4">
                                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                                  Topics (One per line)
                                </label>
                                <textarea
                                  rows={2}
                                  value={editState.topicsText}
                                  onChange={(e) =>
                                    setCtEdits((prev) => ({
                                      ...prev,
                                      [ct.id]: {
                                        ...editState,
                                        topicsText: e.target.value
                                      }
                                    }))
                                  }
                                  className="w-full px-3 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-medium text-[#1A2138]"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <button
                                  type="button"
                                  disabled={isSavingCustomTraining}
                                  onClick={async () => {
                                    const updatedTopics = editState.topicsText
                                      .split(/\n|,/)
                                      .map((s) => s.trim())
                                      .filter(Boolean);
                                    const nextList = liveCustomTrainings.map(
                                      (item) =>
                                        item.id === ct.id
                                          ? {
                                              ...item,
                                              title: editState.title.trim() || item.title,
                                              code: editState.code.trim() || item.code,
                                              priceRs: Math.max(
                                                0,
                                                Number(editState.priceRs) || 0
                                              ),
                                              priceUsd: Number.isFinite(Number(editState.priceUsd))
                                                ? Math.max(0, Number(editState.priceUsd))
                                                : item.priceUsd ?? 15,
                                              duration:
                                                editState.duration.trim() ||
                                                item.duration,
                                              mode:
                                                editState.mode.trim() || item.mode,
                                              description:
                                                editState.description.trim() ||
                                                item.description,
                                              topics:
                                                updatedTopics.length > 0
                                                  ? updatedTopics
                                                  : item.topics
                                            }
                                          : item
                                    );
                                    await persistCustomTrainings(
                                      nextList,
                                      `Updated Custom Training "${editState.title}"!`,
                                      ct.id
                                    );
                                  }}
                                  className="w-full py-2 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>
                                    {isSavingCustomTraining
                                      ? 'Saving...'
                                      : 'Save Price & Details'}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* =================================================================
                    CUSTOM TRAINING REGISTRATIONS INBOX (FROM USERS)
                   ================================================================= */}
                <div className="bg-white border-2 border-[#1673B8] rounded-[26px] p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold">
                        Incoming Custom Training Applications
                      </span>
                      <h3 className="text-lg font-extrabold text-[#1A2138] mt-1">
                        Custom Training User Registrations ({customTrainingRegistrations.length})
                      </h3>
                      <p className="text-xs text-[#4A5568]">
                        Every user who fills out the registration form under <strong>Custom Trainings</strong> (Name, Father Name, Education, Designation, DOB, Email, Mobile No) appears here in real time.
                      </p>
                    </div>
                  </div>

                  {customTrainingRegistrations.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-center text-xs font-semibold text-[#4A5568]">
                      No Custom Training registrations submitted yet. When a user registers for any Custom Training, their full details will appear here automatically.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customTrainingRegistrations.map((reg) => (
                        <div
                          key={reg.id}
                          className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                        >
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#1673B8] text-white text-[10.5px] font-extrabold">
                                {reg.trainingCode || 'CUSTOM'} · {reg.trainingTitle}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10.5px] font-extrabold">
                                Fee:{' '}
                                {reg.trainingFee ||
                                  `Rs. ${Number(reg.trainingPriceRs || 0).toLocaleString()}`}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                  reg.status === 'enrolled'
                                    ? 'bg-emerald-600 text-white'
                                    : reg.status === 'contacted'
                                    ? 'bg-sky-600 text-white'
                                    : 'bg-amber-200 text-amber-950'
                                }`}
                              >
                                {reg.status || 'pending'}
                              </span>
                              <span className="text-[10.5px] font-semibold text-slate-500">
                                {reg.submittedAt
                                  ? new Date(reg.submittedAt).toLocaleString()
                                  : ''}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs pt-1">
                              <div>
                                <span className="text-slate-500 font-semibold">Name: </span>
                                <strong className="text-[#1A2138]">{reg.name}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 font-semibold">Father Name: </span>
                                <strong className="text-[#1A2138]">{reg.fatherName}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 font-semibold">DOB: </span>
                                <strong className="text-[#1A2138]">{reg.dob}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 font-semibold">Education: </span>
                                <strong className="text-[#1A2138]">{reg.education}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 font-semibold">Designation: </span>
                                <strong className="text-[#1A2138]">{reg.designation}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 font-semibold">Mobile No: </span>
                                <strong className="text-[#1673B8] font-mono">{reg.mobileNo}</strong>
                              </div>
                              <div className="sm:col-span-3">
                                <span className="text-slate-500 font-semibold">Email: </span>
                                <strong className="text-[#1A2138]">{reg.email}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                            {onUpdateCustomTrainingRegistrationStatus && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateCustomTrainingRegistrationStatus(
                                      reg.id,
                                      'contacted'
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#1673B8] text-[#1673B8] text-xs font-extrabold cursor-pointer"
                                >
                                  Mark Contacted
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateCustomTrainingRegistrationStatus(
                                      reg.id,
                                      'enrolled'
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold cursor-pointer"
                                >
                                  Mark Enrolled
                                </button>
                              </>
                            )}
                            {onDeleteCustomTrainingRegistration && (
                              <button
                                type="button"
                                onClick={() =>
                                  onDeleteCustomTrainingRegistration(reg.id)
                                }
                                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
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
                          updatePaymentGateway({
                            monthlyFeeRs: currentMo,
                            yearlyFeeRs: autoYr,
                            customPriceUpdated: true
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
                        updatePaymentGateway({
                          monthlyFeeRs: nextMonthly,
                          yearlyFeeRs: nextYearly,
                          customPriceUpdated: true
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
                        updatePaymentGateway({
                          yearlyFeeRs: nextYearly,
                          customPriceUpdated: true
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
                      updatePaymentGateway({
                        monthlyFeeRs: currentMo,
                        yearlyFeeRs: autoYr,
                        customPriceUpdated: true
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] text-[11px] font-extrabold cursor-pointer transition-colors shrink-0"
                  >
                    Set Exact 25% OFF (Rs. {Math.round(liveMonthlyFee * 12 * 0.75)})
                  </button>
                </div>

                {/* International Users USD Base Rates */}
                <div className="p-3.5 rounded-xl bg-white border border-[#94B8D7] space-y-2.5">
                  <div className="text-xs font-extrabold text-[#105E9A]">
                    International Visitors Pricing (Outside Pakistan — Auto-Converted to User&apos;s Country Currency)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                        Monthly Membership ($ USD)
                      </label>
                      <input
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={storageConfig.paymentGateway?.monthlyFeeUsd ?? 1}
                        onChange={(e) => {
                          const moUsd = Math.max(0.5, Number(e.target.value) || 1);
                          updatePaymentGateway({
                            monthlyFeeUsd: moUsd,
                            yearlyFeeUsd: Number((moUsd * 12 * 0.75).toFixed(2)),
                            customPriceUpdated: true
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                        Yearly Plan (25% OFF — $ USD)
                      </label>
                      <input
                        type="number"
                        min={1}
                        step={0.25}
                        value={storageConfig.paymentGateway?.yearlyFeeUsd ?? 9}
                        onChange={(e) => {
                          const yrUsd = Math.max(1, Number(e.target.value) || 9);
                          updatePaymentGateway({
                            yearlyFeeUsd: yrUsd,
                            customPriceUpdated: true
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                        Certificate Fee ($ USD, 25% OFF Bundles)
                      </label>
                      <input
                        type="number"
                        min={1}
                        step={0.5}
                        value={storageConfig.paymentGateway?.certificateFeeUsd ?? 5}
                        onChange={(e) => {
                          const certUsd = Math.max(1, Number(e.target.value) || 5);
                          updatePaymentGateway({
                            certificateFeeUsd: certUsd,
                            customPriceUpdated: true
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                      />
                    </div>
                  </div>
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
                        updatePaymentGateway({ jazzCashTitle: e.target.value })
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
                        updatePaymentGateway({ jazzCashNumber: e.target.value })
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
                        updatePaymentGateway({ easyPaisaTitle: e.target.value })
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
                        updatePaymentGateway({ easyPaisaNumber: e.target.value })
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
                        updatePaymentGateway({ bankTitle: e.target.value })
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
                        updatePaymentGateway({ bankName: e.target.value })
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
                        updatePaymentGateway({
                          bankAccountOrIban: e.target.value
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
                        updatePaymentGateway({ bankWhatsapp: e.target.value })
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
            TAB 10: SUPPORT ISSUES & PERSONAL CUSTOM OPINIONS
           ===================================================================== */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D2DEEA] pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                    Support Issues &amp; Custom Opinions
                  </h2>
                  <p className="text-xs text-[#4A5568]">
                    Real-time submissions from Support and Help, including user custom opinions/ratings, issue highlights, page/tool context, and direct Admin replies.
                  </p>
                </div>
                <input
                  type="text"
                  value={supportSearch}
                  onChange={(e) => setSupportSearch(e.target.value)}
                  placeholder="Search user, subject, or message..."
                  className="px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-xs font-semibold text-[#1A2138] w-full sm:w-64"
                />
              </div>

              {/* KPI SUMMARY STRIP */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: 'Open / Pending',
                    val: String(supportTickets.filter((t) => t.status !== 'resolved').length)
                  },
                  {
                    label: 'Custom Opinions',
                    val: String(supportTickets.filter((t) => t.requestType === 'custom_opinion').length)
                  },
                  {
                    label: 'Issues Highlighted',
                    val: String(
                      supportTickets.filter(
                        (t) =>
                          t.requestType === 'issue_report' ||
                          t.requestType === 'admin_chat'
                      ).length
                    )
                  },
                  {
                    label: 'Resolved',
                    val: String(supportTickets.filter((t) => t.status === 'resolved').length)
                  }
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] p-3"
                  >
                    <div className="text-[11px] font-semibold text-[#4A5568]">
                      {kpi.label}
                    </div>
                    <div className="text-xl font-extrabold text-[#1A2138] font-mono tabular-nums mt-0.5">
                      {kpi.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* SEGMENTED FILTERS */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all' as const, label: `All (${supportTickets.length})` },
                  {
                    id: 'open' as const,
                    label: `Open / In Review (${supportTickets.filter((t) => t.status !== 'resolved').length})`
                  },
                  {
                    id: 'custom_opinion' as const,
                    label: `Custom Opinions (${supportTickets.filter((t) => t.requestType === 'custom_opinion').length})`
                  },
                  {
                    id: 'issue_report' as const,
                    label: `Issues (${supportTickets.filter((t) => t.requestType === 'issue_report' || t.requestType === 'admin_chat').length})`
                  }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSupportFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      supportFilter === tab.id
                        ? 'bg-[#1673B8] text-white'
                        : 'bg-[#F8FAFC] border border-[#D2DEEA] text-[#1A2138] hover:bg-[#F0F6FC]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TICKETS QUEUE */}
              <div className="space-y-3">
                {supportTickets
                  .filter((t) => {
                    if (supportFilter === 'open') return t.status !== 'resolved';
                    if (supportFilter === 'issue_report') {
                      return t.requestType === 'issue_report' || t.requestType === 'admin_chat';
                    }
                    if (supportFilter !== 'all') return t.requestType === supportFilter;
                    return true;
                  })
                  .filter((t) => {
                    const q = supportSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      t.userName.toLowerCase().includes(q) ||
                      (t.userEmail || '').toLowerCase().includes(q) ||
                      t.subject.toLowerCase().includes(q) ||
                      t.message.toLowerCase().includes(q) ||
                      t.pageContext.toLowerCase().includes(q)
                    );
                  })
                  .map((ticket) => {
                    const replyVal =
                      supportReplyDrafts[ticket.id] ?? ticket.adminReply ?? '';
                    const statusVal =
                      supportStatusDrafts[ticket.id] ?? ticket.status;
                    const cleanDigits = (ticket.userPhone || '').replace(/\D/g, '');
                    const transcriptOpen = expandedTranscriptId === ticket.id;

                    return (
                      <div
                        key={ticket.id}
                        className="rounded-2xl border border-[#D2DEEA] bg-[#F8FAFC] p-4 space-y-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#D2DEEA] pb-2.5">
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#4A5568]">
                              <span className="font-bold text-[#1673B8]">
                                {ticket.requestType === 'custom_opinion'
                                  ? 'Custom Opinion'
                                  : ticket.requestType === 'admin_chat'
                                  ? 'Support Request'
                                  : 'Issue Highlight'}
                              </span>
                              <span>·</span>
                              <span className="font-mono uppercase font-semibold">
                                {ticket.userPlan}
                              </span>
                              <span>·</span>
                              <span className="font-mono tabular-nums">
                                {(ticket.createdAt || '').slice(0, 16).replace('T', ' ')}
                              </span>
                            </div>
                            <h3 className="text-sm font-extrabold text-[#1A2138]">
                              {ticket.subject}
                            </h3>
                            <p className="text-[11px] font-semibold text-[#4A5568]">
                              From: <span className="text-[#1A2138]">{ticket.userName}</span>
                              {ticket.userEmail ? ` · ${ticket.userEmail}` : ''}
                              {ticket.userPhone ? ` · ${ticket.userPhone}` : ''} · Context:{' '}
                              <span className="text-[#1673B8]">{ticket.pageContext}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {typeof ticket.rating === 'number' && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                <span className="font-mono tabular-nums">{ticket.rating}/5</span>
                              </span>
                            )}
                            <span
                              className={`text-[11px] font-mono font-bold uppercase ${
                                ticket.status === 'resolved'
                                  ? 'text-emerald-700'
                                  : ticket.status === 'in_review'
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {ticket.status.replace('_', ' ')}
                            </span>
                            {onDeleteSupportTicket && (
                              <button
                                type="button"
                                onClick={() => onDeleteSupportTicket(ticket.id)}
                                title="Delete Request"
                                className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[#1A2138] whitespace-pre-wrap bg-white border border-[#D2DEEA] rounded-xl p-3">
                          {ticket.message}
                        </p>

                        {ticket.userFollowUp && (
                          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950">
                            <span className="font-bold">User Follow-Up: </span>
                            {ticket.userFollowUp}
                          </div>
                        )}

                        {ticket.chatTranscript && ticket.chatTranscript.length > 0 && (
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedTranscriptId(transcriptOpen ? null : ticket.id)
                              }
                              className="text-[11px] font-bold text-[#1673B8] hover:underline cursor-pointer"
                            >
                              {transcriptOpen
                                ? `Hide AI Chat Transcript (${ticket.chatTranscript.length} msgs)`
                                : `View AI Chat Transcript (${ticket.chatTranscript.length} msgs)`}
                            </button>
                            {transcriptOpen && (
                              <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#D2DEEA] max-h-48 overflow-y-auto space-y-1.5 text-[11px]">
                                {ticket.chatTranscript.map((m, i) => (
                                  <div key={i}>
                                    <span className="font-bold uppercase text-slate-600">
                                      {m.role === 'user' ? 'User' : 'AI Bot'}:{' '}
                                    </span>
                                    <span className="text-slate-800">{m.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* ADMIN REPLY & STATUS CONTROLS */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end pt-1">
                          <div className="sm:col-span-7">
                            <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                              Admin Reply (Visible in User&apos;s Support Drawer &amp; Alerts)
                            </label>
                            <textarea
                              rows={2}
                              value={replyVal}
                              onChange={(e) =>
                                setSupportReplyDrafts((prev) => ({
                                  ...prev,
                                  [ticket.id]: e.target.value
                                }))
                              }
                              placeholder="Type your response or resolution instructions..."
                              className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#D2DEEA] text-xs text-[#1A2138]"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                              Status
                            </label>
                            <select
                              value={statusVal}
                              onChange={(e) =>
                                setSupportStatusDrafts((prev) => ({
                                  ...prev,
                                  [ticket.id]: e.target.value as SupportTicketStatus
                                }))
                              }
                              className="w-full px-2 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold text-[#1A2138]"
                            >
                              <option value="open">Open</option>
                              <option value="in_review">In Review</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                          <div className="sm:col-span-3 flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              disabled={savingTicketId === ticket.id}
                              onClick={async () => {
                                if (!onReplySupportTicket) return;
                                setSavingTicketId(ticket.id);
                                try {
                                  await onReplySupportTicket(ticket, replyVal, statusVal);
                                } finally {
                                  setSavingTicketId(null);
                                }
                              }}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer disabled:opacity-50"
                            >
                              {savingTicketId === ticket.id ? 'Saving...' : 'Save Reply'}
                            </button>
                            {cleanDigits && (
                              <a
                                href={`https://wa.me/${cleanDigits}?text=${encodeURIComponent(
                                  replyVal || `Hello ${ticket.userName}, regarding your Food Science Portal request: ${ticket.subject}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                title="Reply on WhatsApp"
                              >
                                WA
                              </a>
                            )}
                            {ticket.userEmail && (
                              <a
                                href={`mailto:${ticket.userEmail}?subject=${encodeURIComponent(
                                  `Re: ${ticket.subject} — Food Science Portal`
                                )}&body=${encodeURIComponent(replyVal || '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold"
                                title="Reply via Email"
                              >
                                Mail
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {supportTickets.length === 0 && (
                  <div className="p-6 text-center rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs font-semibold text-[#4A5568]">
                    No user support requests, issue highlights, or custom opinions received yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 11: SOCIAL MEDIA TOOL & PAGE PUBLISHER (social)
           ===================================================================== */}
        {activeTab === 'social' && (
          <AdminSocialShareStudio
            jobsCount={jobs.length}
            scholarshipsCount={scholarships.length}
            trainingsCount={trainings.length}
            communityCount={communityVisibleCount}
            onSetBanner={onSetBanner}
          />
        )}

        {/* =====================================================================
            TAB 12: WEBSITE LAUNCH ADVERTISEMENT & FLYER BUILDER (flyer)
           ===================================================================== */}
        {activeTab === 'flyer' && (
          <AdminLaunchFlyerStudio
            monthlyFeeRs={liveMonthlyFee}
            yearlyFeeRs={liveYearlyFee}
            monthlyFeeUsd={
              Number(storageConfig.paymentGateway?.monthlyFeeUsd) || 1
            }
            yearlyFeeUsd={
              Number(storageConfig.paymentGateway?.yearlyFeeUsd) || 9
            }
            whatsappContact={
              storageConfig.paymentGateway?.bankWhatsapp || '+92 324 0906384'
            }
            onSetBanner={onSetBanner}
          />
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
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('support')}
              className={`cursor-pointer ${
                activeTab === 'support' ? 'text-[#1673B8] underline' : 'text-[#4A5568]'
              }`}
            >
              Support ({supportTickets.filter((t) => t.status !== 'resolved').length})
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('social')}
              className={`cursor-pointer ${
                activeTab === 'social' ? 'text-[#1673B8] underline' : 'text-[#4A5568]'
              }`}
            >
              Social Share
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('flyer')}
              className={`cursor-pointer ${
                activeTab === 'flyer' ? 'text-[#1673B8] underline' : 'text-[#4A5568]'
              }`}
            >
              Launch Flyer
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
