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
  HubJob,
  HubPaymentRequest,
  HubScholarship,
  HubTraining,
  HubUser
} from '../types/hub';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';

export type AdminSectionTab =
  | 'overview'
  | 'users'
  | 'jobs'
  | 'scholarships'
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
  onChangeStorageConfig: (cfg: CloudStorageConfig) => void;
  onSaveStorageConfig: (e: React.FormEvent) => Promise<void>;
  onExportBackup: () => void;
  onPreviewUserApp: () => void;
  onSignOut: () => void;
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({
  adminEmail,
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
  onChangeStorageConfig,
  onSaveStorageConfig,
  onExportBackup,
  onPreviewUserApp,
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<AdminSectionTab>('overview');

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

  // Trainings & Price Editor State
  const [trCategory, setTrCategory] = useState<'Highfield' | 'Lead Auditor'>(
    'Highfield'
  );
  const [trSubType, setTrSubType] = useState<string>('Highfield UK');
  const [trTitle, setTrTitle] = useState('');
  const [trFees, setTrFees] = useState('');
  const [trDuration, setTrDuration] = useState('');
  const [trEnrollLink, setTrEnrollLink] = useState(
    'https://wa.me/923240906384'
  );
  const [trDesc, setTrDesc] = useState('');
  const [isSavingTraining, setIsSavingTraining] = useState(false);

  // Inline Training Price & Duration Edits Map: { [trainingId]: { fees, duration } }
  const [priceEdits, setPriceEdits] = useState<
    Record<string, { fees: string; duration: string }>
  >({});

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

  const handleCreateNewTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trTitle.trim()) return;
    setIsSavingTraining(true);
    try {
      const id = `tr-custom-${Date.now()}`;
      const newTr: HubTraining = {
        id,
        category: trCategory,
        subType:
          trCategory === 'Highfield'
            ? null
            : (trSubType as 'IRCA | CQI' | 'Exemplar Global'),
        title: trTitle.trim(),
        description:
          trDesc.trim() ||
          `Official ${trTitle.trim()} qualification for food safety & quality professionals.`,
        duration: trDuration.trim() || '5 Days (40 Hours)',
        fees: trFees.trim() || 'PKR 25,000',
        enrollLink: trEnrollLink.trim() || 'https://wa.me/923240906384',
        isActive: true
      };
      await onSaveTraining(newTr);
      setTrTitle('');
      setTrFees('');
      setTrDuration('');
      setTrDesc('');
    } finally {
      setIsSavingTraining(false);
    }
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
    <div className="h-[100dvh] bg-[#E3F3EA] text-[#0F291E] flex flex-col overflow-hidden">
      {/* TOP DEDICATED ADMIN COMMAND HEADER (CONSTANT — DOES NOT SCROLL) */}
      <header className="shrink-0 z-40 bg-[#13422B] text-white shadow-md border-b border-emerald-900/60">
        <div className="max-w-5xl mx-auto px-4 pt-3 pb-2.5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-emerald-200">
              <img
                src={FS_PORTAL_LOGO_DATA_URI}
                alt="FS Portal Admin"
                className="w-full h-full object-contain scale-[1.85] transform-gpu select-none"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[18px] sm:text-[20px] font-extrabold tracking-tight leading-none text-white truncate">
                  FS Portal
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#0E9F6E] text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Admin Control Panel
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 font-medium mt-0.5 truncate">
                {adminEmail} • Full Platform Control
              </p>
            </div>
          </div>

          {/* Integrated Quick Search Bar + Filter + Sign Out in Constant Header */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <div className="relative flex-1 sm:w-56 max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#2C4C3B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  if (activeTab !== 'users') setActiveTab('users');
                }}
                placeholder="Search users, email, role..."
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#D5E6DC] text-[#13422B] placeholder:text-[#3B5949] text-xs font-semibold focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={onPreviewUserApp}
              className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              title="Preview how the user app looks right now"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">View App</span>
            </button>

            <button
              type="button"
              onClick={onExportBackup}
              className="px-3 py-2 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold hidden sm:flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Backup</span>
            </button>

            <button
              type="button"
              onClick={onSignOut}
              className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/35 border border-red-400/30 text-red-100 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION PILLS BAR INSIDE HEADER */}
        <div className="max-w-5xl mx-auto px-4 pb-2.5 pt-0.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              {
                id: 'overview',
                label: '1. Dashboard & Graphs',
                icon: BarChart3,
                badge: null
              },
              {
                id: 'users',
                label: '2. Users & Approvals',
                icon: Users,
                badge:
                  stats.pendingRequests > 0
                    ? `${stats.pendingRequests} Pending`
                    : `${stats.totalUsers}`
              },
              {
                id: 'jobs',
                label: '3. Post Jobs (1-Box)',
                icon: Briefcase,
                badge: `${jobs.length}`
              },
              {
                id: 'scholarships',
                label: '4. Scholarships (1-Box)',
                icon: GraduationCap,
                badge: `${scholarships.length}`
              },
              {
                id: 'trainings',
                label: '5. Trainings & Prices',
                icon: Award,
                badge: `${trainings.length}`
              },
              {
                id: 'payments',
                label: '6. Payment Gateway',
                icon: CreditCard,
                badge: 'Edit'
              },
              {
                id: 'storage',
                label: '7. Cloud Storage',
                icon: Database,
                badge: null
              }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#0E9F6E] text-white shadow-sm scale-[1.01]'
                    : 'bg-[#1D563B] hover:bg-[#256949] text-emerald-100 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.3]" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      tab.id === 'users' && stats.pendingRequests > 0
                        ? 'bg-amber-400 text-[#0F291E]'
                        : isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-black/25 text-emerald-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN ADMIN SCROLLABLE CONTENT CONTAINER */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-5 py-5 space-y-5">
          {/* LIVE FEEDBACK BANNER */}
        {adminStatusBanner && (
          <div className="p-4 rounded-2xl bg-[#13422B] border-2 border-[#0E9F6E] text-white text-xs sm:text-sm font-extrabold flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />
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
                  Review uploaded Rs. 100 payment slips to Accept or Reject
                  their 1-Month Premium Membership.
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
            TAB 1: ANALYTICS & USERS GRAPH DASHBOARD (overview)
           ===================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* TOP 6 KPI SUMMARY CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div
                onClick={() => setActiveTab('users')}
                className="bg-white border border-[#CBE4D6] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#0E9F6E] transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#5C7267]">
                  <span>Total Users</span>
                  <Users className="w-4 h-4 text-[#0E9F6E]" />
                </div>
                <div className="text-2xl font-extrabold text-[#0F291E] mt-1">
                  {stats.totalUsers}
                </div>
                <div className="text-[11px] font-bold text-[#0E9F6E] mt-0.5">
                  Registered Specialists
                </div>
              </div>

              <div
                onClick={() => {
                  setUserFilter('premium');
                  setActiveTab('users');
                }}
                className="bg-white border border-[#CBE4D6] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#0E9F6E] transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#5C7267]">
                  <span>Paid Premium</span>
                  <Crown className="w-4 h-4 text-[#D97706]" />
                </div>
                <div className="text-2xl font-extrabold text-[#0F291E] mt-1">
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
                className="bg-white border border-[#CBE4D6] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#0E9F6E] transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#5C7267]">
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
                className="bg-white border border-[#CBE4D6] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#0E9F6E] transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#5C7267]">
                  <span>Live Jobs</span>
                  <Briefcase className="w-4 h-4 text-[#0E9F6E]" />
                </div>
                <div className="text-2xl font-extrabold text-[#0F291E] mt-1">
                  {jobs.length}
                </div>
                <div className="text-[11px] font-bold text-[#0E9F6E] mt-0.5">
                  3 Categories
                </div>
              </div>

              <div
                onClick={() => setActiveTab('scholarships')}
                className="bg-white border border-[#CBE4D6] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#0E9F6E] transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#5C7267]">
                  <span>Scholarships</span>
                  <GraduationCap className="w-4 h-4 text-[#0E9F6E]" />
                </div>
                <div className="text-2xl font-extrabold text-[#0F291E] mt-1">
                  {scholarships.length}
                </div>
                <div className="text-[11px] font-bold text-[#0E9F6E] mt-0.5">
                  Global Grants
                </div>
              </div>

              <div
                onClick={() => setActiveTab('trainings')}
                className="bg-white border border-[#CBE4D6] rounded-2xl p-4 shadow-xs cursor-pointer hover:border-[#0E9F6E] transition-all"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#5C7267]">
                  <span>Trainings</span>
                  <Award className="w-4 h-4 text-[#0E9F6E]" />
                </div>
                <div className="text-2xl font-extrabold text-[#0F291E] mt-1">
                  {trainings.length}
                </div>
                <div className="text-[11px] font-bold text-[#0E9F6E] mt-0.5">
                  Highfield &amp; IRCA
                </div>
              </div>
            </div>

            {/* VISUAL GRAPHS ROW: USERS GRAPH + PLATFORM CONTENT GRAPH */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* GRAPH 1: ALL USERS ANALYTICS & ACTIVITY GRAPH */}
              <div className="bg-white border border-[#CBE4D6] rounded-[24px] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#ECF4EF] pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-[#0F291E] flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#0E9F6E]" />
                      <span>All Users &amp; Membership Graph</span>
                    </h2>
                    <p className="text-xs text-[#5C7267] font-medium">
                      Real-time visual breakdown of user plans &amp; profile activity
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#D7EFE2] text-[#0D6845] text-xs font-extrabold">
                    {stats.totalUsers} Users
                  </span>
                </div>

                {/* Visual Column Bar Chart for User Segments */}
                <div className="bg-[#F4FAF7] border border-[#D4E9DF] rounded-2xl p-4">
                  <div className="grid grid-cols-5 gap-2.5 items-end h-36 pt-4 px-1">
                    {[
                      {
                        label: 'Total',
                        value: stats.totalUsers,
                        color: 'bg-[#13422B]',
                        max: Math.max(1, stats.totalUsers)
                      },
                      {
                        label: 'Premium',
                        value: stats.premiumUsers,
                        color: 'bg-[#0E9F6E]',
                        max: Math.max(1, stats.totalUsers)
                      },
                      {
                        label: 'Free',
                        value: stats.freeUsers,
                        color: 'bg-[#34D399]',
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
                        color: 'bg-[#059669]',
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
                          <span className="text-xs font-extrabold text-[#0F291E]">
                            {bar.value}
                          </span>
                          <div className="w-full max-w-[44px] bg-[#E2F2E9] rounded-t-xl h-24 flex items-end overflow-hidden">
                            <div
                              style={{ height: `${heightPct}%` }}
                              className={`w-full ${bar.color} rounded-t-xl transition-all duration-500`}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-[#4B6356] text-center leading-tight">
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
                      barClass: 'bg-[#0E9F6E]'
                    },
                    {
                      label: 'Free Tier Users',
                      count: stats.freeUsers,
                      total: Math.max(1, stats.totalUsers),
                      barClass: 'bg-[#13422B]'
                    },
                    {
                      label: 'Completed Specialist Profiles',
                      count: stats.completedProfiles,
                      total: Math.max(1, stats.totalUsers),
                      barClass: 'bg-[#059669]'
                    },
                    {
                      label: 'Users with Uploaded CV / Resume',
                      count: stats.cvUploadedUsers,
                      total: Math.max(1, stats.totalUsers),
                      barClass: 'bg-[#10B981]'
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
                          <span className="font-bold text-[#0F291E]">
                            {item.label}
                          </span>
                          <span className="font-extrabold text-[#0E9F6E]">
                            {item.count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#E3F3EA] overflow-hidden">
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
              <div className="bg-white border border-[#CBE4D6] rounded-[24px] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#ECF4EF] pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-[#0F291E] flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#0E9F6E]" />
                      <span>App Content &amp; Categories Graph</span>
                    </h2>
                    <p className="text-xs text-[#5C7267] font-medium">
                      Live distribution across Jobs, Scholarships &amp; Trainings
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#D7EFE2] text-[#0D6845] text-xs font-extrabold">
                    {jobs.length + scholarships.length + trainings.length} Active Items
                  </span>
                </div>

                {/* Jobs Breakdown */}
                <div className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D4E9DF] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0F291E] uppercase tracking-wider">
                      Jobs by Category ({jobs.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('jobs')}
                      className="text-xs font-extrabold text-[#0E9F6E] hover:underline cursor-pointer"
                    >
                      + Post / Manage Jobs →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-xl p-2.5 border border-[#D4E9DF]">
                      <div className="text-lg font-extrabold text-[#0F291E]">
                        {stats.qaJobs}
                      </div>
                      <div className="text-[11px] font-bold text-[#0D6845]">
                        Quality &amp; Safety
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D4E9DF]">
                      <div className="text-lg font-extrabold text-[#0F291E]">
                        {stats.rdJobs}
                      </div>
                      <div className="text-[11px] font-bold text-[#0D6845]">
                        R&amp;D Lab
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D4E9DF]">
                      <div className="text-lg font-extrabold text-[#0F291E]">
                        {stats.prodJobs}
                      </div>
                      <div className="text-[11px] font-bold text-[#0D6845]">
                        Production
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scholarships Breakdown */}
                <div className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D4E9DF] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0F291E] uppercase tracking-wider">
                      Scholarships by Category ({scholarships.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('scholarships')}
                      className="text-xs font-extrabold text-[#0E9F6E] hover:underline cursor-pointer"
                    >
                      + Post / Manage Scholarships →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-xl p-2.5 border border-[#D4E9DF]">
                      <div className="text-lg font-extrabold text-[#0F291E]">
                        {stats.fellowSch}
                      </div>
                      <div className="text-[11px] font-bold text-[#0D6845]">
                        Fellowships
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D4E9DF]">
                      <div className="text-lg font-extrabold text-[#0F291E]">
                        {stats.intlSch}
                      </div>
                      <div className="text-[11px] font-bold text-[#0D6845]">
                        International
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D4E9DF]">
                      <div className="text-lg font-extrabold text-[#0F291E]">
                        {stats.grantSch}
                      </div>
                      <div className="text-[11px] font-bold text-[#0D6845]">
                        Grants
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trainings Breakdown */}
                <div className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D4E9DF] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0F291E] uppercase tracking-wider">
                      Trainings &amp; Courses ({trainings.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('trainings')}
                      className="text-xs font-extrabold text-[#0E9F6E] hover:underline cursor-pointer"
                    >
                      Edit Prices / Add Training →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-xl p-2.5 border border-[#D4E9DF]">
                      <div className="text-lg font-extrabold text-[#0F291E]">
                        {stats.hfTrainings}
                      </div>
                      <div className="text-[11px] font-bold text-[#0D6845]">
                        Highfield UK
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D4E9DF]">
                      <div className="text-lg font-extrabold text-[#0F291E]">
                        {stats.ircaTrainings}
                      </div>
                      <div className="text-[11px] font-bold text-[#0D6845]">
                        1. IRCA CQI
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-[#D4E9DF]">
                      <div className="text-lg font-extrabold text-[#0F291E]">
                        {stats.egTrainings}
                      </div>
                      <div className="text-[11px] font-bold text-[#0D6845]">
                        2. Exemplar Global
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTION SHORTCUTS */}
            <div className="bg-white border border-[#CBE4D6] rounded-[24px] p-5 shadow-xs">
              <h3 className="text-sm font-extrabold text-[#0F291E] mb-3">
                Quick Admin Controls (Instant Live Sync)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className="p-3.5 rounded-2xl bg-[#F4FAF7] hover:bg-[#D7EFE2] border border-[#CBE4D6] text-left transition-colors cursor-pointer space-y-1"
                >
                  <UserCheck className="w-5 h-5 text-[#0E9F6E]" />
                  <div className="text-xs font-extrabold text-[#0F291E]">
                    Accept / Reject Users
                  </div>
                  <div className="text-[11px] text-[#5C7267]">
                    Monitor profiles &amp; slips
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className="p-3.5 rounded-2xl bg-[#F4FAF7] hover:bg-[#D7EFE2] border border-[#CBE4D6] text-left transition-colors cursor-pointer space-y-1"
                >
                  <Briefcase className="w-5 h-5 text-[#0E9F6E]" />
                  <div className="text-xs font-extrabold text-[#0F291E]">
                    1-Box Paste Job
                  </div>
                  <div className="text-[11px] text-[#5C7267]">
                    Paste &amp; select category
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('scholarships')}
                  className="p-3.5 rounded-2xl bg-[#F4FAF7] hover:bg-[#D7EFE2] border border-[#CBE4D6] text-left transition-colors cursor-pointer space-y-1"
                >
                  <GraduationCap className="w-5 h-5 text-[#0E9F6E]" />
                  <div className="text-xs font-extrabold text-[#0F291E]">
                    1-Box Paste Scholarship
                  </div>
                  <div className="text-[11px] text-[#5C7267]">
                    Paste &amp; select category
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('trainings')}
                  className="p-3.5 rounded-2xl bg-[#F4FAF7] hover:bg-[#D7EFE2] border border-[#CBE4D6] text-left transition-colors cursor-pointer space-y-1"
                >
                  <DollarSign className="w-5 h-5 text-[#0E9F6E]" />
                  <div className="text-xs font-extrabold text-[#0F291E]">
                    Change Training Prices
                  </div>
                  <div className="text-[11px] text-[#5C7267]">
                    Add/remove or update fees
                  </div>
                </button>
              </div>
            </div>

            {/* QUICK PREMIUM MEMBERSHIP PACKAGE PRICE & AUTO-DISCOUNT CALCULATOR (OVERVIEW TAB) */}
            <form
              onSubmit={onSaveStorageConfig}
              className="bg-white border-2 border-[#0E9F6E] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECF4EF] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#B45309] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#0F291E]">
                      Premium Membership Package Price &amp; Auto-Discount Control
                    </h3>
                    <p className="text-[11.5px] text-[#5C7267] font-medium">
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
                  <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF7] border border-[#9BCAB0] text-xs font-extrabold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF7] border border-[#9BCAB0] text-xs font-extrabold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors h-[38px]"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Package Price Live</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#F4FAF7] border border-[#CBE4D6] text-xs">
                <div className="font-bold text-[#0F291E]">
                  Live Calculation: 12 Months ={' '}
                  <strong>Rs. {fullYearBaseFee.toLocaleString()}</strong> → Yearly Package ={' '}
                  <strong className="text-[#0E9F6E]">
                    Rs. {liveYearlyFee.toLocaleString()} ({liveYearlyDiscountPct}% OFF • Saves Rs. {liveYearlySavingsRs.toLocaleString()})
                  </strong>
                </div>
                <label className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#0D6845] cursor-pointer select-none">
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
                    className="w-3.5 h-3.5 accent-[#0E9F6E] rounded cursor-pointer"
                  />
                  <span>Auto 25% OFF on Yearly</span>
                </label>
              </div>
            </form>

            {/* OFFICIAL WHATSAPP CHANNEL BUTTON & LINK CONTROL (HOME SCREEN) */}
            <form
              onSubmit={onSaveStorageConfig}
              className="bg-white border-2 border-[#0E9F6E] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECF4EF] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <MessageSquare className="w-5 h-5 stroke-[2.3]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#0F291E]">
                      Home Screen WhatsApp Channel Button &amp; Link Control
                    </h3>
                    <p className="text-[11.5px] text-[#5C7267] font-medium">
                      Edit or amend the official WhatsApp Channel URL and button text shown on the Home front page.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[11px] font-extrabold">
                  Live on Home Screen
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF7] border border-[#9BCAB0] text-xs font-semibold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF7] border border-[#9BCAB0] text-xs font-semibold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
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
                  className="px-3.5 py-2 rounded-xl bg-[#E3F3EA] hover:bg-[#CFEAD9] text-[#0D6845] text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Current Channel Link</span>
                </a>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
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
            <div className="bg-white border border-[#CBE4D6] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECF4EF] pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0F291E] flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#D97706]" />
                    <span>
                      Membership Payment Slips — Accept or Reject (
                      {sortedPaymentRequests.length})
                    </span>
                  </h2>
                  <p className="text-xs text-[#5C7267] font-medium">
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
                <div className="p-6 rounded-2xl bg-[#F4FAF7] border border-[#D4E9DF] text-center text-xs text-[#5C7267] font-semibold">
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
                          : 'bg-[#F4FAF7] border-[#D4E9DF]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-extrabold text-[#0F291E]">
                            {req.userName}
                          </div>
                          <div className="text-xs text-[#5C7267] font-medium">
                            {req.userEmail}
                            {req.userPhone ? ` • ${req.userPhone}` : ''}
                          </div>
                          <div className="text-xs font-extrabold text-[#0E9F6E] mt-1">
                            {req.paymentMethod} •{' '}
                            {req.amount || 'Rs. 100 (1 Month)'} • TID:{' '}
                            {req.transactionId}
                          </div>
                          {req.submittedAt && (
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              Submitted:{' '}
                              {req.submittedAt.replace('T', ' ').replace('Z', '')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                              req.status === 'verified'
                                ? 'bg-[#D7EFE2] text-[#0D6845]'
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

                      {req.receiptImageUrl && (
                        <div className="rounded-xl overflow-hidden border border-[#CBE4D6] bg-white p-2 space-y-1.5">
                          <div className="text-[10.5px] font-bold text-gray-500 flex items-center justify-between px-1">
                            <span>Payment Screenshot</span>
                            <a
                              href={req.receiptImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0E9F6E] underline font-extrabold"
                            >
                              Open Full Slip ↗
                            </a>
                          </div>
                          <img
                            src={req.receiptImageUrl}
                            alt="Receipt"
                            className="max-h-44 mx-auto object-contain rounded-lg"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onVerifyPayment(req, 'verified')}
                          className="py-2.5 px-3 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>
                            Accept (
                            {req.subscriptionPlan
                              ?.toLowerCase()
                              .includes('year') ||
                            req.amount?.includes(String(liveYearlyFee)) ||
                            req.amount?.includes('900') ||
                            req.amount?.includes('1800') ||
                            req.amount?.includes('1,800')
                              ? '1 Year'
                              : '1 Month'}
                            )
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onVerifyPayment(req, 'rejected')}
                          className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                          <span>Reject Request</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION B: ALL REGISTERED USERS & ACTIVITY MONITOR */}
            <div className="bg-white border border-[#CBE4D6] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECF4EF] pb-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0F291E] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0E9F6E]" />
                    <span>
                      All Users &amp; Activity Monitor ({filteredUsersList.length})
                    </span>
                  </h2>
                  <p className="text-xs text-[#5C7267] font-medium">
                    Monitor user profiles, CVs, visibility settings, and
                    Accept/Premium, Reject/Free, or Remove any user.
                  </p>
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#5C7267] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name, email, city, role..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F4FAF7] border border-[#CBE4D6] text-xs font-semibold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
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
                        ? 'bg-[#0E9F6E] text-white'
                        : 'bg-[#E3F3EA] text-[#0F291E] hover:bg-[#CFEAD9]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Users List */}
              {filteredUsersList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#F4FAF7] border border-[#D4E9DF] text-center text-xs text-[#5C7267] font-semibold">
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
                        className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#CBE4D6] hover:border-[#0E9F6E] transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#13422B] text-white font-extrabold text-base flex items-center justify-center shrink-0 overflow-hidden border border-emerald-200">
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
                                <h3 className="text-sm font-extrabold text-[#0F291E]">
                                  {u.name}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    isPremium
                                      ? 'bg-[#D7EFE2] text-[#0D6845]'
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

                              <p className="text-xs font-bold text-[#0E9F6E]">
                                {u.title ||
                                  u.currentRole ||
                                  'Food Safety & Quality Specialist'}
                                {u.company ? ` • ${u.company}` : ''}
                              </p>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5C7267] font-medium">
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
                                className="px-3 py-1.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
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
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E3F3EA] border border-[#CBE4D6] text-[#0F291E] text-xs font-extrabold cursor-pointer"
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
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#E2F2E9] text-[11px] font-bold">
                          <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#D4E9DF] text-[#0F291E]">
                            Education: {eduCount}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#D4E9DF] text-[#0F291E]">
                            Experience: {expCount}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#D4E9DF] text-[#0F291E]">
                            Trainings: {certCount}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-md ${
                              u.hireMe
                                ? 'bg-[#D7EFE2] text-[#0D6845]'
                                : 'bg-white border border-[#D4E9DF] text-gray-500'
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
                              className="px-2.5 py-0.5 rounded-md bg-[#0E9F6E] text-white inline-flex items-center gap-1"
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
                          <div className="p-3.5 rounded-xl bg-white border border-[#CBE4D6] space-y-2 text-xs">
                            <div className="font-extrabold text-[#0F291E]">
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
              className="bg-white border-2 border-[#0E9F6E] rounded-[26px] p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECF4EF] pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[11px] font-extrabold">
                    Simple 1-Box Job Publisher
                  </span>
                  <h2 className="text-lg font-extrabold text-[#0F291E] mt-1">
                    Paste Full Job Post &amp; Select Category
                  </h2>
                  <p className="text-xs text-[#5C7267] font-medium">
                    No separate fields needed! Just choose the category, paste
                    the complete job details in one box below, and click Share.
                    It will automatically publish with today&apos;s date (
                    {todayFormatted}).
                  </p>
                </div>
              </div>

              {/* STEP 1: DYNAMIC JOB TAGS (Auto-Create from Job Title OR Create Custom Tag OR Pick Tag) */}
              <div className="space-y-3 p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#CBE4D6]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-extrabold text-[#0F291E]">
                    1. Job Tag / Category (Auto-Created from Job Title or Create Custom Tag):
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#0D6845] cursor-pointer select-none">
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
                      className="w-3.5 h-3.5 accent-[#0E9F6E] rounded cursor-pointer"
                    />
                    <span>Auto-Create Tag from Job Title</span>
                  </label>
                </div>

                {/* Live Auto-Detected Job Title Tag Preview */}
                {autoDetectedJobTitleTag && (
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#D7EFE2] border border-[#0E9F6E]/40 text-xs">
                    <div className="font-bold text-[#0F291E]">
                      Auto-Detected Tag from Job Title:{' '}
                      <span className="px-2 py-0.5 rounded-lg bg-[#0E9F6E] text-white font-extrabold">
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
                      className="text-[11px] font-extrabold text-[#0D6845] underline cursor-pointer"
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
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
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
                    className="px-3.5 py-2 rounded-xl bg-[#13422B] hover:bg-[#0E9F6E] text-white text-xs font-extrabold shrink-0 cursor-pointer transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Create Tag</span>
                  </button>
                </div>

                {/* Selectable Tag Pills (Existing + Custom + Auto-Detected) */}
                <div className="space-y-1">
                  <span className="block text-[10.5px] font-bold text-[#5C7267]">
                    Or click any tag below (Selected:{' '}
                    <strong className="text-[#0E9F6E]">
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
                              ? 'bg-[#0E9F6E] text-white border-[#0E9F6E] shadow-xs'
                              : 'bg-white text-[#0F291E] border-[#CBE4D6] hover:bg-[#E3F3EA]'
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
                  <label className="block text-xs font-extrabold text-[#0F291E]">
                    2. Paste Complete Job Announcement Here (1st line becomes
                    Headline &amp; Auto-Creates Tag):
                  </label>
                  <span className="text-[11px] font-bold text-[#0E9F6E]">
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
                  className="w-full p-4 rounded-2xl bg-[#F4FAF7] border-[1.5px] border-[#9BCAB0] focus:border-[#0E9F6E] focus:bg-white text-xs sm:text-sm font-medium text-[#0F291E] leading-relaxed focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPostingJob || !jobPasteText.trim()}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#0E9F6E] hover:bg-[#059669] disabled:opacity-50 text-white text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
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
            <div className="bg-white border border-[#CBE4D6] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECF4EF] pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F291E]">
                    Live Posted Jobs ({filteredAdminJobs.length})
                  </h3>
                  <p className="text-xs text-[#5C7267]">
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
                          ? 'bg-[#0E9F6E] text-white'
                          : 'bg-[#E3F3EA] text-[#0F291E]'
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
                      className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#CBE4D6] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[10.5px] font-extrabold">
                            {job.category || job.specialization}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBE4D6] text-[#5C7267] text-[10.5px] font-bold">
                            Posted: {job.postedAt || todayFormatted}
                          </span>
                          {job.country && (
                            <span className="text-[11px] font-bold text-[#0E9F6E]">
                              • {job.country}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-extrabold text-[#0F291E] leading-snug">
                          {job.title}
                        </h4>
                        <p className="text-xs text-[#5C7267] line-clamp-2 whitespace-pre-line">
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
              className="bg-white border-2 border-[#0E9F6E] rounded-[26px] p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECF4EF] pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[11px] font-extrabold">
                    Simple 1-Box Scholarship Publisher
                  </span>
                  <h2 className="text-lg font-extrabold text-[#0F291E] mt-1">
                    Paste Full Scholarship Post &amp; Select Category
                  </h2>
                  <p className="text-xs text-[#5C7267] font-medium">
                    Choose the scholarship category, paste the entire
                    scholarship announcement in one box below, and click Share.
                    It publishes immediately with today&apos;s date (
                    {todayFormatted}).
                  </p>
                </div>
              </div>

              {/* STEP 1: CHOOSE SCHOLARSHIP CATEGORY */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-[#0F291E]">
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
                            ? 'bg-[#0E9F6E] text-white border-[#0E9F6E] shadow-xs'
                            : 'bg-[#F4FAF7] text-[#0F291E] border-[#CBE4D6] hover:bg-[#E3F3EA]'
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
                  <label className="block text-xs font-extrabold text-[#0F291E]">
                    2. Paste Complete Scholarship Details Here (1st line becomes
                    Headline):
                  </label>
                  <span className="text-[11px] font-bold text-[#0E9F6E]">
                    Auto-Date: {todayFormatted}
                  </span>
                </div>
                <textarea
                  rows={7}
                  required
                  value={schPasteText}
                  onChange={(e) => setSchPasteText(e.target.value)}
                  placeholder={`Paste the full scholarship details here...\nExample:\nErasmus Mundus MSc Food Innovation Scholarship (Europe)\nFully funded fellowship for BS Food Science & Technology graduates.\nApply online at: https://example.org or email admissions@university.edu`}
                  className="w-full p-4 rounded-2xl bg-[#F4FAF7] border-[1.5px] border-[#9BCAB0] focus:border-[#0E9F6E] focus:bg-white text-xs sm:text-sm font-medium text-[#0F291E] leading-relaxed focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPostingSch || !schPasteText.trim()}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#0E9F6E] hover:bg-[#059669] disabled:opacity-50 text-white text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
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
            <div className="bg-white border border-[#CBE4D6] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECF4EF] pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F291E]">
                    Live Posted Scholarships ({filteredAdminScholarships.length})
                  </h3>
                  <p className="text-xs text-[#5C7267]">
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
                            ? 'bg-[#0E9F6E] text-white'
                            : 'bg-[#E3F3EA] text-[#0F291E]'
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
                      className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#CBE4D6] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[10.5px] font-extrabold">
                            {sch.fundingType}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBE4D6] text-[#5C7267] text-[10.5px] font-bold">
                            Date: {sch.deadline || todayFormatted}
                          </span>
                          {sch.country && (
                            <span className="text-[11px] font-bold text-[#0E9F6E]">
                              • {sch.country}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-extrabold text-[#0F291E] leading-snug">
                          {sch.title}
                        </h4>
                        <p className="text-xs text-[#5C7267] line-clamp-2 whitespace-pre-line">
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
            TAB 5: TRAININGS & LIVE PRICES MANAGER (trainings)
           ===================================================================== */}
        {activeTab === 'trainings' && (
          <div className="space-y-5">
            {/* ADD NEW TRAINING FORM */}
            <form
              onSubmit={handleCreateNewTraining}
              className="bg-white border-2 border-[#0E9F6E] rounded-[26px] p-5 shadow-sm space-y-4"
            >
              <div className="border-b border-[#ECF4EF] pb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[11px] font-extrabold">
                  Add New Accredited Training Course
                </span>
                <h2 className="text-lg font-extrabold text-[#0F291E] mt-1">
                  Add Training &amp; Set Course Price
                </h2>
                <p className="text-xs text-[#5C7267] font-medium">
                  Add a new training under Highfield UK or Lead Auditor (IRCA
                  CQI / Exemplar Global) or edit existing prices below.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
                    Main Training Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Highfield', 'Lead Auditor'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setTrCategory(c);
                          setTrSubType(
                            c === 'Highfield' ? 'Highfield UK' : 'IRCA | CQI'
                          );
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer ${
                          trCategory === c
                            ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]'
                            : 'bg-[#F4FAF7] text-[#0F291E] border-[#CBE4D6]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {trCategory === 'Lead Auditor' && (
                  <div>
                    <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
                      Lead Auditor Accreditation Body
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['IRCA | CQI', 'Exemplar Global'] as const).map(
                        (sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => setTrSubType(sub)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer ${
                              trSubType === sub
                                ? 'bg-[#13422B] text-white border-[#13422B]'
                                : 'bg-[#F4FAF7] text-[#0F291E] border-[#CBE4D6]'
                            }`}
                          >
                            {sub}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
                    Training Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={trTitle}
                    onChange={(e) => setTrTitle(e.target.value)}
                    placeholder="e.g. HACCP Level 3 / BRCGS Lead Auditor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF7] border border-[#CBE4D6] text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
                    Course Price / Fee *
                  </label>
                  <input
                    type="text"
                    required
                    value={trFees}
                    onChange={(e) => setTrFees(e.target.value)}
                    placeholder="e.g. PKR 18,000 or $120"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF7] border border-[#CBE4D6] text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={trDuration}
                    onChange={(e) => setTrDuration(e.target.value)}
                    placeholder="e.g. 3 Days (24 Hours)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4FAF7] border border-[#CBE4D6] text-xs font-semibold"
                  />
                </div>
              </div>

              <textarea
                rows={3}
                value={trDesc}
                onChange={(e) => setTrDesc(e.target.value)}
                placeholder="Course overview, syllabus highlights & certification details..."
                className="w-full p-3.5 rounded-xl bg-[#F4FAF7] border border-[#CBE4D6] text-xs font-semibold"
              />

              <button
                type="submit"
                disabled={isSavingTraining || !trTitle.trim()}
                className="w-full py-3 px-5 rounded-2xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Training to Live App</span>
              </button>
            </form>

            {/* EDIT TRAINING PRICES OR REMOVE TRAININGS */}
            <div className="bg-white border border-[#CBE4D6] rounded-[24px] p-5 shadow-xs space-y-4">
              <div className="border-b border-[#ECF4EF] pb-3">
                <h3 className="text-base font-extrabold text-[#0F291E]">
                  All Live Trainings — Edit Prices or Remove ({trainings.length})
                </h3>
                <p className="text-xs text-[#5C7267]">
                  Change any training&apos;s price or duration below and click{' '}
                  <strong>Save Price</strong> — it updates immediately across
                  the entire app.
                </p>
              </div>

              <div className="space-y-3">
                {trainings.map((tr) => {
                  const currentFeeVal =
                    priceEdits[tr.id]?.fees !== undefined
                      ? priceEdits[tr.id].fees
                      : tr.fees;
                  const currentDurVal =
                    priceEdits[tr.id]?.duration !== undefined
                      ? priceEdits[tr.id].duration
                      : tr.duration;

                  return (
                    <div
                      key={tr.id}
                      className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#CBE4D6] space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[10.5px] font-extrabold">
                              {tr.category}
                            </span>
                            {tr.subType && (
                              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBE4D6] text-[#0F291E] text-[10.5px] font-bold">
                                {tr.subType}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-extrabold text-[#0F291E] mt-1">
                            {tr.title}
                          </h4>
                          <p className="text-xs text-[#5C7267] line-clamp-2 mt-0.5">
                            {tr.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteTraining(tr)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* INLINE PRICE & DURATION EDITOR */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#E2F2E9] items-end">
                        <div>
                          <label className="block text-[11px] font-extrabold text-[#0F291E] mb-1">
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
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#9BCAB0] text-xs font-extrabold text-[#0F291E]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-extrabold text-[#0F291E] mb-1">
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
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUpdateCoursePrice(tr)}
                          className="py-2 px-4 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors h-[36px]"
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Save Price &amp; Update Live</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: PAYMENT GATEWAY SETTINGS (JazzCash, EasyPaisa, Bank Transfer & Prices)
           ===================================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-5">
            <form
              onSubmit={onSaveStorageConfig}
              className="bg-white border-2 border-[#0E9F6E] rounded-[26px] p-5 shadow-sm space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECF4EF] pb-3.5">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[11px] font-extrabold">
                    Live Payment Gateway Configuration
                  </span>
                  <h2 className="text-lg font-extrabold text-[#0F291E] mt-1">
                    Modify EasyPaisa, JazzCash, Bank Transfer &amp; Subscription Fees
                  </h2>
                  <p className="text-xs text-[#5C7267] font-medium">
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
              <div className="p-4 rounded-2xl bg-[#F4FAF7] border-2 border-[#0E9F6E] space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-extrabold text-[#0F291E] uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-[#D97706]" />
                    <span>Premium Package Prices &amp; Auto-Discount Calculator (PKR)</span>
                  </div>
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#0D6845] cursor-pointer select-none">
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
                      className="w-3.5 h-3.5 accent-[#0E9F6E] rounded cursor-pointer"
                    />
                    <span>Auto-Apply 25% OFF on Yearly When Monthly Changes</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-extrabold text-[#0F291E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-extrabold text-[#0F291E]"
                    />
                  </div>
                </div>

                {/* Live Auto-Calculated Discount Percentage & App Sync Preview */}
                <div className="p-3.5 rounded-xl bg-white border border-[#9BCAB0] flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-extrabold text-[#0F291E] flex items-center gap-2 flex-wrap">
                      <span>Auto-Calculated Yearly Discount:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0E9F6E] text-white text-xs font-extrabold">
                        {liveYearlyDiscountPct}% OFF
                      </span>
                      <span className="text-[#0D6845]">
                        (User Saves Rs. {liveYearlySavingsRs.toLocaleString()} / Year)
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#5C7267]">
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
              <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#CBE4D6] space-y-3">
                <div className="text-xs font-extrabold text-[#0F291E] uppercase tracking-wider">
                  1. JazzCash Account Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. EASYPAISA DETAILS */}
              <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#CBE4D6] space-y-3">
                <div className="text-xs font-extrabold text-[#0F291E] uppercase tracking-wider">
                  2. EasyPaisa Account Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. BANK TRANSFER DETAILS */}
              <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#CBE4D6] space-y-3">
                <div className="text-xs font-extrabold text-[#0F291E] uppercase tracking-wider">
                  3. Bank Transfer Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. OFFICIAL WHATSAPP CHANNEL BUTTON & LINK CONTROL (HOME SCREEN) */}
              <div className="p-4 rounded-2xl bg-[#F4FAF7] border-2 border-[#0E9F6E] space-y-3">
                <div className="text-xs font-extrabold text-[#0F291E] uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#0E9F6E]" />
                  <span>4. Home Screen WhatsApp Channel Link &amp; Button</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F291E] mb-1">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#9BCAB0] text-xs font-semibold text-[#0F291E]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
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
              className="bg-white border border-[#CBE4D6] rounded-[24px] p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#0F291E]">
                    Cloud Media Storage &amp; Database Backup
                  </h2>
                  <p className="text-xs text-[#5C7267]">
                    Configure how user avatars, CVs, and payment screenshots are
                    stored.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="px-3.5 py-2 rounded-xl bg-[#13422B] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
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
                      ? 'bg-[#F4FAF7] border-2 border-[#0E9F6E]'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="text-xs font-extrabold text-[#0F291E]">
                    Tier 1: Smart WebP Compression + Firebase Firestore Vault
                  </div>
                  <p className="text-[11px] text-[#5C7267] mt-0.5">
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
                      ? 'bg-[#F4FAF7] border-2 border-[#0E9F6E]'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="text-xs font-extrabold text-[#0F291E]">
                    Tier 2: Cloudinary 25 GB Free Global CDN
                  </div>
                  <p className="text-[11px] text-[#5C7267] mt-0.5">
                    Uploads media to Cloudinary CDN and stores HTTPS links in
                    Firestore.
                  </p>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold cursor-pointer"
              >
                Save Cloud Storage Settings
              </button>
            </form>
          </div>
        )}
        </div>
      </main>

      {/* CONSTANT BOTTOM FOOTER IN ADMIN CONTROL PANEL */}
      <footer className="shrink-0 z-40 bg-white border-t border-[#CBE3D6] px-4 py-2 shadow-[0_-6px_24px_rgba(19,66,43,0.08)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center">
          <div className="flex items-center gap-3 text-[11px] font-bold text-[#0F291E]">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`cursor-pointer ${
                activeTab === 'overview' ? 'text-[#0E9F6E] underline' : 'text-[#5C7267]'
              }`}
            >
              Dashboard
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`cursor-pointer ${
                activeTab === 'users' ? 'text-[#0E9F6E] underline' : 'text-[#5C7267]'
              }`}
            >
              Users ({stats.totalUsers})
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className={`cursor-pointer ${
                activeTab === 'jobs' ? 'text-[#0E9F6E] underline' : 'text-[#5C7267]'
              }`}
            >
              Jobs ({jobs.length})
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('scholarships')}
              className={`cursor-pointer ${
                activeTab === 'scholarships' ? 'text-[#0E9F6E] underline' : 'text-[#5C7267]'
              }`}
            >
              Scholarships ({scholarships.length})
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={`cursor-pointer ${
                activeTab === 'payments' ? 'text-[#0E9F6E] underline' : 'text-[#5C7267]'
              }`}
            >
              Payments
            </button>
          </div>
          <p className="text-[10.5px] font-medium text-[#5C7267] leading-tight">
            Developed by{' '}
            <span className="font-bold text-[#13422B]">Food Specialist</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
