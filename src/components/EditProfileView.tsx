import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Camera,
  MapPin,
  FileText,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Lock,
  Sparkles,
  Loader2,
  Upload,
  Award,
  CreditCard,
  Database,
  Eye,
  Image as ImageIcon,
  AlertCircle,
  Crown,
  ShieldCheck,
  Download,
  Clock,
  Activity,
  GraduationCap,
  MessageSquare,
  Wrench
} from 'lucide-react';
import {
  HubUser,
  VisibilityLevel,
  ProfileVisibilityMap,
  HubEducationItem,
  HubExperienceItem,
  HubCertificationItem,
  HubProjectItem
} from '../types/hub';
import { makeAvatarSvg } from '../data/mockHubData';
import { formatFileSizeLabel } from '../lib/storage';
import { downloadProfessionalCvPdf } from '../lib/cvGenerator';
import {
  DEFAULT_USER_TOOLS_DATA,
  EXAM_PREP_SETS,
  computeNutritionMetrics
} from '../data/examPrepData';
import {
  downloadNutritionReportPdf,
  downloadExamReportPdf
} from '../lib/toolsPdfGenerator';

export const DEFAULT_VISIBILITY_MAP: ProfileVisibilityMap = {
  name: 'public',
  title: 'public',
  company: 'public',
  location: 'public',
  bio: 'public',
  linkedin: 'public',
  cv: 'public',
  contact: 'public',
  education: 'public',
  experience: 'public',
  certifications: 'public',
  projects: 'public'
};

export function cycleVisibilityLevel(current: VisibilityLevel): VisibilityLevel {
  return current === 'private' ? 'public' : 'private';
}

export function normalizeExperienceArray(
  user: HubUser
): HubExperienceItem[] {
  if (Array.isArray(user.experience)) {
    return user.experience;
  }
  if (Array.isArray(user.experienceItems) && user.experienceItems.length > 0) {
    return user.experienceItems;
  }
  if (typeof user.experience === 'string' && user.experience.trim()) {
    return [
      {
        id: 'exp-initial-1',
        jobTitle: user.title || user.currentRole || 'Food Safety & QA Specialist',
        company: user.company || '',
        startDate: '2022',
        endDate: 'Present',
        isPresent: true,
        location: user.location || '',
        description: user.experience.trim(),
        visibility: user.visibility?.experience || 'public'
      }
    ];
  }
  return [];
}

export function normalizeEducationArray(
  user: HubUser
): HubEducationItem[] {
  if (Array.isArray(user.education) && user.education.length > 0) {
    return user.education;
  }
  if (user.qualification && user.qualification.trim()) {
    const parts = user.qualification.split('—').map((s) => s.trim());
    return [
      {
        id: 'edu-initial-1',
        degree: parts[0] || user.qualification,
        institute: parts[1] || 'University of Food Science & Technology',
        startYear: '2018',
        endYear: '2022',
        description: '',
        visibility: user.visibility?.education || 'public'
      }
    ];
  }
  return [];
}

interface VisibilityPillProps {
  value: VisibilityLevel;
  onChange: (next: VisibilityLevel) => void;
  size?: 'sm' | 'md';
}

export const VisibilityPill: React.FC<VisibilityPillProps> = ({
  value,
  onChange,
  size = 'md'
}) => {
  const isOn = value !== 'private';

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(isOn ? 'private' : 'public');
  };

  return (
    <div
      onClick={handleToggle}
      role="switch"
      aria-checked={isOn}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onChange(isOn ? 'private' : 'public');
        }
      }}
      title={
        isOn
          ? 'ON — Show this information to other users in Community (Click to turn OFF)'
          : 'OFF — Hide this information from other users (Click to turn ON)'
      }
      className="inline-flex items-center gap-1.5 shrink-0 cursor-pointer select-none"
    >
      <span
        className={`font-extrabold ${
          size === 'sm' ? 'text-[10.5px]' : 'text-xs'
        } ${isOn ? 'text-[#1673B8]' : 'text-gray-400'}`}
      >
        {isOn ? 'ON' : 'OFF'}
      </span>
      <button
        type="button"
        tabIndex={-1}
        className={`rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
          size === 'sm' ? 'w-11 h-6' : 'w-12 h-6.5'
        } ${isOn ? 'bg-[#1673B8] justify-end' : 'bg-gray-300 justify-start'}`}
      >
        <span
          className={`rounded-full bg-white shadow-sm ${
            size === 'sm' ? 'w-5 h-5' : 'w-5.5 h-5.5'
          }`}
        />
      </button>
    </div>
  );
};

interface EditProfileViewProps {
  profile: HubUser;
  onChangeProfile: (updated: HubUser) => void;
  onSaveProfile: (updated: HubUser) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<void>;
  onUploadCv: (file: File) => Promise<void>;
  onDeleteCv: () => Promise<void>;
  onBack: () => void;
  onPreviewPublicProfile: () => void;
  isUploadingMedia: boolean;
  uploadStatusMsg: string | null;
  profileSaveMsg: string | null;
  isUserAdmin: boolean;
  onOpenAdmin: () => void;
  onOpenPremiumModal: () => void;
  hasSubmittedApplication: boolean;
  onOpenApplicationStatusModal: () => void;
  onOpenLegalModal?: (tab: 'privacy' | 'terms' | 'ads' | 'deletion') => void;
  onDeleteOwnAccount?: () => Promise<void>;
  onOpenToolsSection?: (
    section?: 'hub' | 'nutrition' | 'exam' | 'interview'
  ) => void;
  monthlyFeeRs?: number;
  yearlyFeeRs?: number;
  yearlyDiscountPct?: number;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  profile,
  onChangeProfile,
  onSaveProfile,
  onUploadAvatar,
  onUploadCv,
  onDeleteCv,
  onBack,
  onPreviewPublicProfile,
  isUploadingMedia,
  uploadStatusMsg,
  profileSaveMsg,
  isUserAdmin,
  onOpenAdmin,
  onOpenPremiumModal,
  hasSubmittedApplication,
  onOpenApplicationStatusModal,
  onOpenLegalModal,
  onDeleteOwnAccount,
  onOpenToolsSection,
  monthlyFeeRs = 100,
  yearlyFeeRs = 900,
  yearlyDiscountPct
}) => {
  const effectiveDiscountPct =
    typeof yearlyDiscountPct === 'number'
      ? yearlyDiscountPct
      : monthlyFeeRs * 12 > 0
      ? Math.max(
          0,
          Math.round(
            ((monthlyFeeRs * 12 - yearlyFeeRs) / (monthlyFeeRs * 12)) * 100
          )
        )
      : 25;
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] =
    useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);

  const [linkedinError, setLinkedinError] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Active inline Add/Edit forms for Details sections
  const [editingEdu, setEditingEdu] = useState<HubEducationItem | null>(null);
  const [editingExp, setEditingExp] = useState<HubExperienceItem | null>(null);
  const [editingCert, setEditingCert] = useState<HubCertificationItem | null>(null);
  const [editingProj, setEditingProj] = useState<HubProjectItem | null>(null);

  const vis: ProfileVisibilityMap = {
    ...DEFAULT_VISIBILITY_MAP,
    ...(profile.visibility || {})
  };

  const educationList = normalizeEducationArray(profile);
  const experienceList = normalizeExperienceArray(profile);
  const certificationsList = profile.certifications || [];
  const projectsList = profile.projects || [];

  const hireMe = Boolean(
    profile.hireMe ?? profile.privacySettings?.hireMe_public ?? true
  );
  const isPremiumNotExpired =
    !profile.premiumExpiresAt ||
    Number.isNaN(new Date(profile.premiumExpiresAt).getTime()) ||
    new Date(profile.premiumExpiresAt).getTime() > Date.now();
  const isPremium = Boolean(
    isUserAdmin || ((profile.isPremium || profile.isPaid) && isPremiumNotExpired)
  );
  const isExpiredPremium = Boolean(
    !isUserAdmin &&
      (profile.isPremium ||
        profile.isPaid ||
        profile.paymentStatus === 'verified') &&
      profile.premiumExpiresAt &&
      new Date(profile.premiumExpiresAt).getTime() <= Date.now()
  );

  // Calculate remaining days/hours for Paid Premium Member 5-Day Countdown
  const expiryCountdown = React.useMemo(() => {
    if (!isPremium || !profile.premiumExpiresAt) return null;
    const expMs = new Date(profile.premiumExpiresAt).getTime();
    if (Number.isNaN(expMs)) return null;
    const diffMs = expMs - Date.now();
    if (diffMs <= 0) return null;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const hoursRemainder = totalHours % 24;
    const formattedEndDate = new Date(expMs).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return {
      daysLeft,
      hoursRemainder,
      formattedEndDate,
      isLastFiveDays: daysLeft >= 1 && daysLeft <= 5
    };
  }, [isPremium, profile.premiumExpiresAt]);

  const updateVisibility = (
    field: keyof ProfileVisibilityMap,
    nextLevel: VisibilityLevel
  ) => {
    const nextVis: ProfileVisibilityMap = {
      ...vis,
      [field]: nextLevel
    };
    onChangeProfile({
      ...profile,
      visibility: nextVis,
      privacySettings: {
        ...profile.privacySettings,
        currentRole_public: nextVis.title !== 'private',
        location_public: nextVis.location !== 'private',
        qualification_public: nextVis.education !== 'private',
        experience_public: nextVis.experience !== 'private',
        email_public: nextVis.contact !== 'private',
        phone_public: nextVis.contact !== 'private',
        hireMe_public: hireMe
      }
    });
  };

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUploadAvatar(file);
    e.target.value = '';
  };

  const handleCvFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCvError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setCvError('Only PDF files (.pdf) are allowed for CV / Resume upload.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError(
        `File size (${formatFileSizeLabel(file.size)}) exceeds the 5 MB limit.`
      );
      e.target.value = '';
      return;
    }
    await onUploadCv(file);
    e.target.value = '';
  };

  const validateAndSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLinkedinError(null);

    const rawLinkedin = (profile.linkedinUrl || '').trim();
    if (
      rawLinkedin &&
      !rawLinkedin.toLowerCase().includes('linkedin.com')
    ) {
      setLinkedinError(
        'Please enter a valid LinkedIn URL containing linkedin.com (e.g. https://linkedin.com/in/username)'
      );
      return;
    }

    setIsSaving(true);
    try {
      const normalizedTitle =
        (profile.title ?? profile.currentRole ?? '').trim();
      const updatedUser: HubUser = {
        ...profile,
        name: profile.name.trim() || 'Food Safety Specialist',
        title: normalizedTitle,
        currentRole: normalizedTitle,
        profilePhotoUrl: profile.profilePhotoUrl || profile.profilePicUrl,
        profilePicUrl: profile.profilePhotoUrl || profile.profilePicUrl,
        hireMe,
        plan: isPremium ? 'premium' : 'free',
        isPremium,
        isPaid: isPremium,
        profileCompleted: Boolean(
          profile.name.trim() && (normalizedTitle || profile.bio?.trim())
        ),
        profileVisibility: true,
        visibility: vis,
        education: educationList,
        experience: experienceList,
        experienceItems: experienceList,
        certifications: certificationsList,
        projects: projectsList,
        qualification:
          educationList.length > 0
            ? `${educationList[0].degree}${
                educationList[0].institute
                  ? ` — ${educationList[0].institute}`
                  : ''
              }`
            : profile.qualification || ''
      };
      await onSaveProfile(updatedUser);
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (profile.name || 'FS')
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase();

  const displayAvatar =
    profile.profilePhotoUrl || profile.profilePicUrl || makeAvatarSvg(initials);

  const cvDisplayFileName =
    profile.cvFileName ||
    (profile.cvUrl && !profile.cvUrl.startsWith('data:')
      ? profile.cvUrl.split('/').pop() || 'Uploaded_CV.pdf'
      : profile.cvUrl
      ? `${(profile.name || 'Specialist').replace(/\s+/g, '_')}_CV.pdf`
      : '');

  return (
    <div className="space-y-4 pb-6">
      {/* MAIN EDIT PROFILE CARD MATCHING CERTIFICATE BLUE THEME */}
      <form
        onSubmit={validateAndSubmit}
        className="bg-[#F4F8FD] border border-[#D2DEEA] rounded-[32px] p-4 sm:p-6 shadow-[0_10px_30px_rgba(26,33,56,0.08)] space-y-5"
      >
        {/* TOP HEADER: Back Arrow | "Edit Profile" | "Save" */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-3.5">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full hover:bg-gray-200/60 flex items-center justify-center text-[#1A2138] transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
          </button>

          <h1 className="text-[18px] sm:text-[22px] font-extrabold text-[#1A2138] tracking-tight">
            Edit Profile
          </h1>

          <button
            type="submit"
            disabled={isSaving}
            className="text-[14.5px] sm:text-[16px] font-extrabold text-[#1673B8] hover:text-[#1A2138] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Quick Public Profile Preview + Toggle Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white border border-[#D2DEEA] rounded-2xl px-3.5 py-2.5 shadow-2xs">
          <div className="text-[11px] font-semibold text-gray-600 flex items-center gap-1.5 flex-wrap">
            <span>Toggle next to any field:</span>
            <span className="px-2 py-0.5 rounded-full bg-[#1673B8] text-white font-extrabold text-[10px]">
              ON = Show in Community
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gray-300 text-gray-700 font-extrabold text-[10px]">
              OFF = Hidden
            </span>
          </div>
          <button
            type="button"
            onClick={onPreviewPublicProfile}
            className="px-3 py-1 rounded-full bg-[#EBF4FC] hover:bg-[#D2DEEA] text-[#1673B8] text-[11.5px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public Profile</span>
          </button>
        </div>

        {/* LAST 5 DAYS PREMIUM EXPIRY COUNTDOWN BANNER (Only shows when Paid Member is in last 5 days) */}
        {isPremium && expiryCountdown && expiryCountdown.isLastFiveDays && (
          <div className="bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] border-2 border-[#F59E0B] rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 stroke-[2.4]" />
                </span>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-amber-200 text-[#92400E] text-[10px] font-extrabold uppercase tracking-wider">
                    Final {expiryCountdown.daysLeft}{' '}
                    {expiryCountdown.daysLeft === 1 ? 'Day' : 'Days'} Countdown
                  </span>
                  <h3 className="text-sm font-extrabold text-[#78350F] mt-0.5">
                    Your Premium Membership Ends in {expiryCountdown.daysLeft}{' '}
                    {expiryCountdown.daysLeft === 1 ? 'Day' : 'Days'} (
                    {expiryCountdown.hoursRemainder}h remaining)
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenPremiumModal}
                className="px-3 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-extrabold shrink-0 cursor-pointer transition-colors"
              >
                Renew Now
              </button>
            </div>
            <p className="text-xs font-semibold text-[#92400E] leading-relaxed">
              Your paid subscription will expire on{' '}
              <strong>{expiryCountdown.formattedEndDate}</strong>. Renew for 1
              Month (Rs. 200) or Full Year (Rs. 1,800 — 25% OFF) to keep your
              profile visible in the Community.
            </p>
          </div>
        )}

        {profileSaveMsg && (
          <div className="bg-[#1673B8] text-white rounded-2xl p-3.5 text-xs font-extrabold flex items-center justify-between gap-2 shadow-xs">
            <span>{profileSaveMsg}</span>
            <Check className="w-4 h-4 shrink-0" />
          </div>
        )}

        {uploadStatusMsg && (
          <div className="bg-[#EBF4FC] border border-[#1673B8] text-[#1A2138] rounded-2xl p-3 text-xs font-extrabold flex items-center justify-between gap-2">
            <span>{uploadStatusMsg}</span>
            {isUploadingMedia && (
              <Loader2 className="w-4 h-4 animate-spin text-[#1673B8] shrink-0" />
            )}
          </div>
        )}

        {/* 1. PROFILE PHOTO: Circular Avatar + Camera Button + "Change Photo" */}
        <div className="flex flex-col items-center pt-1">
          <div className="relative inline-block">
            <img
              src={displayAvatar}
              alt={profile.name || 'Profile'}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md bg-[#EBF4FC]"
            />
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              title="Upload Profile Photo"
              className="absolute bottom-0.5 right-0.5 w-9 h-9 rounded-full bg-[#1673B8] hover:bg-[#105E9A] text-white border-2 border-white shadow-md flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            >
              <Camera className="w-4 h-4 stroke-[2.3]" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="mt-2.5 px-4 py-1 rounded-full bg-[#BBD6EE] hover:bg-[#9AC2E6] text-[#1A2138] text-[12px] font-bold shadow-2xs transition-colors cursor-pointer"
          >
            Change Photo
          </button>
        </div>

        {/* 2. BASIC INFORMATION */}
        <div className="space-y-3">
          <h2 className="text-[15px] font-extrabold text-[#1A2138]">
            Basic Information
          </h2>

          {/* Full Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <label className="sm:w-[130px] text-[13.5px] font-semibold text-[#1F2937] shrink-0">
              Full Name
            </label>
            <div className="relative flex-1 flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#1673B8]">
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) =>
                  onChangeProfile({ ...profile, name: e.target.value })
                }
                placeholder="e.g. Muneeb Khan"
                className="w-full text-[14px] font-semibold text-gray-900 bg-transparent focus:outline-none pr-2"
              />
              <VisibilityPill
                value={vis.name}
                onChange={(next) => updateVisibility('name', next)}
              />
            </div>
          </div>

          {/* Current Title */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 pt-1">
            <label className="sm:w-[130px] text-[13.5px] font-semibold text-[#1F2937] shrink-0">
              Current Title
            </label>
            <div className="relative flex-1 flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#1673B8]">
              <input
                type="text"
                value={profile.title ?? profile.currentRole ?? ''}
                onChange={(e) =>
                  onChangeProfile({
                    ...profile,
                    title: e.target.value,
                    currentRole: e.target.value
                  })
                }
                placeholder="e.g. Food Safety & QA Specialist"
                className="w-full text-[14px] font-semibold text-gray-900 bg-transparent focus:outline-none pr-2"
              />
              <VisibilityPill
                value={vis.title}
                onChange={(next) => updateVisibility('title', next)}
              />
            </div>
          </div>

          {/* Current Company */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 pt-1">
            <label className="sm:w-[130px] text-[13.5px] font-semibold text-[#1F2937] shrink-0">
              Current Company
            </label>
            <div className="relative flex-1 flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#1673B8]">
              <input
                type="text"
                value={profile.company || ''}
                onChange={(e) =>
                  onChangeProfile({ ...profile, company: e.target.value })
                }
                placeholder="e.g. Nestlé Pakistan"
                className="w-full text-[14px] font-semibold text-gray-900 bg-transparent focus:outline-none pr-2"
              />
              <VisibilityPill
                value={vis.company}
                onChange={(next) => updateVisibility('company', next)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 pt-1">
            <label className="sm:w-[130px] text-[13.5px] font-semibold text-[#1F2937] shrink-0">
              Location
            </label>
            <div className="flex-1 flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#1673B8]">
              <MapPin className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) =>
                  onChangeProfile({ ...profile, location: e.target.value })
                }
                placeholder="e.g. Lahore, Pakistan"
                className="w-full text-[14px] font-semibold text-gray-900 bg-transparent focus:outline-none pr-2"
              />
              <VisibilityPill
                value={vis.location}
                onChange={(next) => updateVisibility('location', next)}
              />
            </div>
          </div>
        </div>

        {/* ABOUT BIO (500 chars max) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[15px] font-extrabold text-[#1A2138]">
              About Bio
            </label>
            <span className="text-[11px] font-semibold text-gray-400">
              {(profile.bio || '').length}/500
            </span>
          </div>
          <div className="relative bg-white border border-gray-200/90 rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#1673B8] flex items-center gap-2">
            <textarea
              rows={3}
              maxLength={500}
              value={profile.bio || ''}
              onChange={(e) =>
                onChangeProfile({
                  ...profile,
                  bio: e.target.value.slice(0, 500)
                })
              }
              placeholder="Passionate about ensuring food safety, quality assurance, and regulatory compliance across manufacturing and supply chain. 5+ years experience in HACCP, ISO 22000, and audits."
              className="w-full text-[13.5px] font-medium text-gray-800 bg-transparent focus:outline-none resize-none leading-relaxed"
            />
            <VisibilityPill
              value={vis.bio}
              onChange={(next) => updateVisibility('bio', next)}
            />
          </div>
        </div>

        {/* 3. LINKEDIN PROFILE (MUST HAVE) */}
        <div className="space-y-1.5">
          <label className="block text-[15px] font-extrabold text-[#1A2138]">
            LinkedIn URL
          </label>
          <div className="flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#1673B8] gap-2.5">
            <span className="w-7 h-7 rounded-[6px] bg-[#0A66C2] text-white font-black text-[15px] flex items-center justify-center shrink-0 leading-none">
              in
            </span>
            <input
              type="text"
              value={profile.linkedinUrl || ''}
              onChange={(e) => {
                setLinkedinError(null);
                onChangeProfile({ ...profile, linkedinUrl: e.target.value });
              }}
              placeholder="https://linkedin.com/in/username"
              className="w-full text-[13.5px] font-semibold text-gray-900 bg-transparent focus:outline-none"
            />
            <VisibilityPill
              value={vis.linkedin}
              onChange={(next) => updateVisibility('linkedin', next)}
            />
          </div>
          {linkedinError && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{linkedinError}</span>
            </div>
          )}
        </div>

        {/* 4. CV / RESUME UPLOAD CARD (MUST HAVE) */}
        <div className="space-y-1.5">
          <div className="bg-[#EBF4FC] border border-[#9AC2E6] rounded-[22px] p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/90 border border-[#9AC2E6] text-[#1673B8] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[14.5px] sm:text-[15.5px] font-extrabold text-[#1A2138]">
                      CV / Resume
                    </h3>
                    <VisibilityPill
                      size="sm"
                      value={vis.cv}
                      onChange={(next) => updateVisibility('cv', next)}
                    />
                  </div>
                  <p className="text-[11.5px] sm:text-[12.5px] font-semibold text-gray-700 break-all mt-0.5">
                    {cvDisplayFileName
                      ? `${cvDisplayFileName}${
                          profile.cvFileSize ? ` • ${profile.cvFileSize}` : ''
                        }`
                      : 'No PDF uploaded yet (Max 5 MB)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <input
                  ref={cvInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleCvFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => cvInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F0F6FC] border border-[#1673B8] text-[#1A2138] text-[12.5px] font-extrabold inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#1673B8] stroke-[2.5]" />
                  <span>{cvDisplayFileName ? 'Replace PDF' : 'Upload PDF'}</span>
                </button>
                {cvDisplayFileName && (
                  <button
                    type="button"
                    onClick={onDeleteCv}
                    title="Delete CV"
                    className="p-2 rounded-xl bg-white hover:bg-red-50 border border-red-200 text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {cvError && (
              <div className="text-xs font-bold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{cvError}</span>
              </div>
            )}

            <p className="text-[11px] font-semibold text-[#105E9A] leading-snug">
              Turn the toggle button ON to show your CV in the Community section, or OFF to keep it hidden
            </p>
          </div>
        </div>

        {/* 5. DETAILS — DYNAMIC ADD / EDIT / DELETE LISTS */}
        <div className="space-y-3.5 pt-1">
          <h2 className="text-[15px] font-extrabold text-[#1A2138]">Details</h2>

          {/* ==================== 5A. EDUCATION ==================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold text-[#1A2138]">
                  Education
                </span>
                <VisibilityPill
                  size="sm"
                  value={vis.education}
                  onChange={(next) => updateVisibility('education', next)}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingEdu({
                    id: `edu-${Date.now()}`,
                    degree: '',
                    institute: '',
                    startYear: '',
                    endYear: '',
                    description: '',
                    visibility: vis.education || 'public'
                  })
                }
                className="px-4 py-1.5 rounded-full bg-[#BBD6EE] hover:bg-[#9AC2E6] text-[#1A2138] text-[12.5px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add New</span>
              </button>
            </div>

            {editingEdu && (
              <div className="bg-white border-2 border-[#1673B8] rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#105E9A] uppercase">
                    Education Entry
                  </span>
                  <VisibilityPill
                    size="sm"
                    value={editingEdu.visibility}
                    onChange={(next) =>
                      setEditingEdu({ ...editingEdu, visibility: next })
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Degree (e.g. BS (Hons.) Food Science & Technology)"
                  value={editingEdu.degree}
                  onChange={(e) =>
                    setEditingEdu({ ...editingEdu, degree: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1673B8]"
                />
                <input
                  type="text"
                  placeholder="Institute / University (e.g. UVAS Lahore / NIFSAT)"
                  value={editingEdu.institute}
                  onChange={(e) =>
                    setEditingEdu({ ...editingEdu, institute: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1673B8]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start Year (e.g. 2018)"
                    value={editingEdu.startYear}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, startYear: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="End Year (e.g. 2022)"
                    value={editingEdu.endYear}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, endYear: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Description / Major coursework & thesis..."
                  value={editingEdu.description}
                  onChange={(e) =>
                    setEditingEdu({
                      ...editingEdu,
                      description: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-medium text-gray-900 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingEdu(null)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingEdu.degree.trim()) return;
                      const exists = educationList.some(
                        (item) => item.id === editingEdu.id
                      );
                      const nextList = exists
                        ? educationList.map((item) =>
                            item.id === editingEdu.id ? editingEdu : item
                          )
                        : [...educationList, editingEdu];
                      onChangeProfile({ ...profile, education: nextList });
                      setEditingEdu(null);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Save Education
                  </button>
                </div>
              </div>
            )}

            {educationList.length > 0 && (
              <div className="space-y-2">
                {educationList.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-white border border-gray-200 rounded-2xl p-3 flex items-start justify-between gap-2 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-extrabold text-[#1A2138]">
                        {edu.degree}
                      </div>
                      <div className="text-xs font-semibold text-gray-600">
                        {edu.institute}
                        {edu.startYear || edu.endYear
                          ? ` • ${edu.startYear}${
                              edu.endYear ? ` – ${edu.endYear}` : ''
                            }`
                          : ''}
                      </div>
                      {edu.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {edu.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <VisibilityPill
                        size="sm"
                        value={edu.visibility || 'public'}
                        onChange={(nextVis) => {
                          const nextList = educationList.map((item) =>
                            item.id === edu.id
                              ? { ...item, visibility: nextVis }
                              : item
                          );
                          onChangeProfile({ ...profile, education: nextList });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setEditingEdu(edu)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onChangeProfile({
                            ...profile,
                            education: educationList.filter(
                              (item) => item.id !== edu.id
                            )
                          })
                        }
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ==================== 5B. EXPERIENCE ==================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold text-[#1A2138]">
                  Experience
                </span>
                <VisibilityPill
                  size="sm"
                  value={vis.experience}
                  onChange={(next) => updateVisibility('experience', next)}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingExp({
                    id: `exp-${Date.now()}`,
                    jobTitle: '',
                    company: '',
                    startDate: '',
                    endDate: 'Present',
                    isPresent: true,
                    location: '',
                    description: '',
                    visibility: vis.experience || 'public'
                  })
                }
                className="px-4 py-1.5 rounded-full bg-[#BBD6EE] hover:bg-[#9AC2E6] text-[#1A2138] text-[12.5px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add New</span>
              </button>
            </div>

            {editingExp && (
              <div className="bg-white border-2 border-[#1673B8] rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#105E9A] uppercase">
                    Experience Entry
                  </span>
                  <VisibilityPill
                    size="sm"
                    value={editingExp.visibility}
                    onChange={(next) =>
                      setEditingExp({ ...editingExp, visibility: next })
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Job Title (e.g. QA Executive)"
                  value={editingExp.jobTitle}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, jobTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Company (e.g. Nestlé Pakistan)"
                    value={editingExp.company}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, company: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Lahore)"
                    value={editingExp.location}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, location: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start Date (e.g. Mar 2022)"
                    value={editingExp.startDate}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        startDate: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="End Date (or Present)"
                    value={editingExp.isPresent ? 'Present' : editingExp.endDate}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        endDate: e.target.value,
                        isPresent:
                          e.target.value.trim().toLowerCase() === 'present'
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExp.isPresent}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        isPresent: e.target.checked,
                        endDate: e.target.checked ? 'Present' : ''
                      })
                    }
                  />
                  <span>I currently work here (Present)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Description (e.g. Leading quality audits, HACCP implementation, regulatory compliance...)"
                  value={editingExp.description}
                  onChange={(e) =>
                    setEditingExp({
                      ...editingExp,
                      description: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-medium text-gray-900 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingExp(null)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingExp.jobTitle.trim()) return;
                      const exists = experienceList.some(
                        (item) => item.id === editingExp.id
                      );
                      const nextList = exists
                        ? experienceList.map((item) =>
                            item.id === editingExp.id ? editingExp : item
                          )
                        : [...experienceList, editingExp];
                      onChangeProfile({
                        ...profile,
                        experience: nextList,
                        experienceItems: nextList
                      });
                      setEditingExp(null);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Save Experience
                  </button>
                </div>
              </div>
            )}

            {experienceList.length > 0 && (
              <div className="space-y-2">
                {experienceList.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white border border-gray-200 rounded-2xl p-3 flex items-start justify-between gap-2 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-extrabold text-[#1A2138]">
                        {exp.jobTitle}
                      </div>
                      <div className="text-xs font-semibold text-gray-600">
                        {exp.company}
                        {exp.startDate
                          ? ` • ${exp.startDate} – ${
                              exp.isPresent ? 'Present' : exp.endDate
                            }`
                          : ''}
                        {exp.location ? ` • ${exp.location}` : ''}
                      </div>
                      {exp.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <VisibilityPill
                        size="sm"
                        value={exp.visibility || 'public'}
                        onChange={(nextVis) => {
                          const nextList = experienceList.map((item) =>
                            item.id === exp.id
                              ? { ...item, visibility: nextVis }
                              : item
                          );
                          onChangeProfile({
                            ...profile,
                            experience: nextList,
                            experienceItems: nextList
                          });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setEditingExp(exp)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const nextList = experienceList.filter(
                            (item) => item.id !== exp.id
                          );
                          onChangeProfile({
                            ...profile,
                            experience: nextList,
                            experienceItems: nextList
                          });
                        }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ==================== 5C. TRAININGS ==================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold text-[#1A2138]">
                  Trainings
                </span>
                <VisibilityPill
                  size="sm"
                  value={vis.certifications}
                  onChange={(next) => updateVisibility('certifications', next)}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingCert({
                    id: `cert-${Date.now()}`,
                    name: '',
                    issuer: '',
                    issueDate: '',
                    credentialId: '',
                    visibility: vis.certifications || 'public'
                  })
                }
                className="px-4 py-1.5 rounded-full bg-[#BBD6EE] hover:bg-[#9AC2E6] text-[#1A2138] text-[12.5px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add New</span>
              </button>
            </div>

            {editingCert && (
              <div className="bg-white border-2 border-[#1673B8] rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#105E9A] uppercase">
                    Training Entry
                  </span>
                  <VisibilityPill
                    size="sm"
                    value={editingCert.visibility}
                    onChange={(next) =>
                      setEditingCert({ ...editingCert, visibility: next })
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Training Name (e.g. ISO 22000 Lead Auditor / HACCP Level 4)"
                  value={editingCert.name}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Training Body / Issuer (e.g. Highfield UK / IRCA CQI)"
                  value={editingCert.issuer}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, issuer: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Completion Date (e.g. Oct 2024)"
                    value={editingCert.issueDate}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
                        issueDate: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Credential ID (e.g. FSP-2026-01)"
                    value={editingCert.credentialId}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
                        credentialId: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingCert.name.trim()) return;
                      const exists = certificationsList.some(
                        (item) => item.id === editingCert.id
                      );
                      const nextList = exists
                        ? certificationsList.map((item) =>
                            item.id === editingCert.id ? editingCert : item
                          )
                        : [...certificationsList, editingCert];
                      onChangeProfile({ ...profile, certifications: nextList });
                      setEditingCert(null);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Save Training
                  </button>
                </div>
              </div>
            )}

            {certificationsList.length > 0 && (
              <div className="space-y-2">
                {certificationsList.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white border border-gray-200 rounded-2xl p-3 flex items-start justify-between gap-2 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-extrabold text-[#1A2138]">
                        {cert.name}
                      </div>
                      <div className="text-xs font-semibold text-gray-600">
                        {cert.issuer}
                        {cert.issueDate ? ` • ${cert.issueDate}` : ''}
                        {cert.credentialId ? ` • ID: ${cert.credentialId}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <VisibilityPill
                        size="sm"
                        value={cert.visibility || 'public'}
                        onChange={(nextVis) => {
                          const nextList = certificationsList.map((item) =>
                            item.id === cert.id
                              ? { ...item, visibility: nextVis }
                              : item
                          );
                          onChangeProfile({
                            ...profile,
                            certifications: nextList
                          });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setEditingCert(cert)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onChangeProfile({
                            ...profile,
                            certifications: certificationsList.filter(
                              (item) => item.id !== cert.id
                            )
                          })
                        }
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ==================== 5D. PROJECTS ==================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold text-[#1A2138]">
                  Projects
                </span>
                <VisibilityPill
                  size="sm"
                  value={vis.projects}
                  onChange={(next) => updateVisibility('projects', next)}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingProj({
                    id: `proj-${Date.now()}`,
                    title: '',
                    description: '',
                    link: '',
                    visibility: vis.projects || 'public'
                  })
                }
                className="px-4 py-1.5 rounded-full bg-[#BBD6EE] hover:bg-[#9AC2E6] text-[#1A2138] text-[12.5px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add New</span>
              </button>
            </div>

            {editingProj && (
              <div className="bg-white border-2 border-[#1673B8] rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#105E9A] uppercase">
                    Project Entry
                  </span>
                  <VisibilityPill
                    size="sm"
                    value={editingProj.visibility}
                    onChange={(next) =>
                      setEditingProj({ ...editingProj, visibility: next })
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Project Title (e.g. Cold Chain Compliance 2024)"
                  value={editingProj.title}
                  onChange={(e) =>
                    setEditingProj({ ...editingProj, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="Project Description & measurable Food Safety / QA impact..."
                  value={editingProj.description}
                  onChange={(e) =>
                    setEditingProj({
                      ...editingProj,
                      description: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-medium text-gray-900 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Optional Link (e.g. https://...)"
                  value={editingProj.link || ''}
                  onChange={(e) =>
                    setEditingProj({ ...editingProj, link: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-900 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingProj(null)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingProj.title.trim()) return;
                      const exists = projectsList.some(
                        (item) => item.id === editingProj.id
                      );
                      const nextList = exists
                        ? projectsList.map((item) =>
                            item.id === editingProj.id ? editingProj : item
                          )
                        : [...projectsList, editingProj];
                      onChangeProfile({ ...profile, projects: nextList });
                      setEditingProj(null);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            )}

            {projectsList.length > 0 && (
              <div className="space-y-2">
                {projectsList.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white border border-gray-200 rounded-2xl p-3 flex items-start justify-between gap-2 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-extrabold text-[#1A2138]">
                        {proj.title}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {proj.description}
                      </p>
                      {proj.link && (
                        <div className="text-[11px] font-bold text-[#1673B8] truncate mt-0.5">
                          {proj.link}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <VisibilityPill
                        size="sm"
                        value={proj.visibility || 'public'}
                        onChange={(nextVis) => {
                          const nextList = projectsList.map((item) =>
                            item.id === proj.id
                              ? { ...item, visibility: nextVis }
                              : item
                          );
                          onChangeProfile({ ...profile, projects: nextList });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setEditingProj(proj)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onChangeProfile({
                            ...profile,
                            projects: projectsList.filter(
                              (item) => item.id !== proj.id
                            )
                          })
                        }
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ==================== 5E. CONTACT BUTTON & DIRECT CONTACT DETAILS ==================== */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] font-extrabold text-[#1A2138]">
                  Contact &amp; Message Buttons
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  Control who can see your Contact / Message buttons on Public Profile
                </div>
              </div>
              <VisibilityPill
                value={vis.contact}
                onChange={(next) => updateVisibility('contact', next)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) =>
                  onChangeProfile({ ...profile, email: e.target.value })
                }
                placeholder="Contact Email"
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-800 focus:outline-none"
              />
              <input
                type="text"
                value={profile.phone || ''}
                onChange={(e) =>
                  onChangeProfile({ ...profile, phone: e.target.value })
                }
                placeholder="WhatsApp / Phone (e.g. +92 300 ...)"
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold text-gray-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 6. HIRE ME TOGGLE + 7. BIG ROYAL BLUE SAVE CHANGES BUTTON */}
        <div className="bg-white border border-gray-200/80 rounded-[26px] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[17px] font-extrabold text-[#1A2138]">
                Hire Me
              </h3>
              <p className="text-[12.5px] font-medium text-gray-600">
                Allow recruiters to contact you for opportunities
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-extrabold text-[#1673B8]">
                {hireMe ? 'ON' : 'OFF'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={hireMe}
                onClick={() =>
                  onChangeProfile({
                    ...profile,
                    hireMe: !hireMe,
                    privacySettings: {
                      ...profile.privacySettings,
                      hireMe_public: !hireMe
                    }
                  })
                }
                className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center cursor-pointer ${
                  hireMe ? 'bg-[#1673B8] justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 px-6 rounded-[18px] bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold text-[17px] shadow-md transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSaving ? 'Saving Profile...' : 'Save Changes'}
          </button>

          {/* SHARP PROFESSIONAL MARKET-STANDARD PDF CV GENERATOR BUTTON */}
          <button
            type="button"
            onClick={() =>
              downloadProfessionalCvPdf(profile, { respectVisibility: false })
            }
            className="w-full py-3.5 px-5 rounded-[18px] bg-[#1A2138] hover:bg-[#1673B8] text-white font-extrabold text-[14.5px] shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-sky-300 shrink-0" />
            <span>Download Professional CV (PDF)</span>
          </button>
        </div>
      </form>

      {/* FREE USER NOTIFICATION MESSAGE: FREE VS PREMIUM MEMBERSHIP DETAILS LIST + UPGRADE BUTTON */}
      <div className="space-y-3">
        {!isPremium && (
          <div className="bg-white border-[1.5px] border-[#1673B8] rounded-[26px] p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-[#EBF4FC] pb-3">
              <div className="flex items-start gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#EBF4FC] text-[#1673B8] flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5 stroke-[2.3]" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[10.5px] font-extrabold">
                    Membership Notification &amp; Guide
                  </span>
                  <h3 className="text-[16px] font-extrabold text-[#1A2138] leading-snug mt-0.5">
                    Free User Plan vs. Paid Premium Membership
                  </h3>
                  <p className="text-xs text-[#475569] font-medium">
                    See what is included in your Free account and the benefits
                    of upgrading to Paid Premium:
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* List 1: What is Allowed for Free Users */}
              <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider">
                    ✓ Free User (Allowed)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-[#D2DEEA] text-[#1673B8] text-[10px] font-extrabold">
                    Current Plan
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs font-semibold text-[#1F2937]">
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#1673B8] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>
                      Browse &amp; apply to all verified <strong>Jobs</strong>{' '}
                      (QA, R&amp;D, Production)
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#1673B8] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>
                      Explore &amp; apply for global{' '}
                      <strong>Scholarships &amp; Grants</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#1673B8] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>
                      Enroll in <strong>Highfield UK &amp; Lead Auditor</strong>{' '}
                      trainings
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#1673B8] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>
                      Complete your Profile &amp; download{' '}
                      <strong>Professional PDF CV</strong>
                    </span>
                  </li>
                </ul>
              </div>

              {/* List 2: Benefits of Becoming a Paid Premium Member */}
              <div className="p-3.5 rounded-2xl bg-[#FFFDF5] border-[1.5px] border-[#F59E0B] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#92400E] uppercase tracking-wider flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Paid Premium Benefits</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[10px] font-extrabold">
                    25% OFF Yearly
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs font-semibold text-[#1F2937]">
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                    <span>
                      <strong>Show Your Profile in Community:</strong> Visible
                      to all paid members &amp; recruiters
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                    <span>
                      <strong>View Other Specialists&apos; Profiles:</strong>{' '}
                      See full bio, experience, education &amp; LinkedIn
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                    <span>
                      <strong>Community CV Vault Access:</strong> View &amp;
                      download CVs of fellow specialists
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                    <span>
                      <strong>Direct Contact &amp; Hire Me:</strong> Direct
                      WhatsApp, Email &amp; recruiter hiring access
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                    <span>
                      <strong>Full Specialist Tools Access:</strong> Daily
                      Nutrition &amp; BMI Tracker, 2,000 Exam MCQs (30 MCQs per
                      Test) &amp; 2,000 Interview Q&amp;As (30 Qs per Session)
                      with Personalized Graph &amp; PDF Reports
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pricing Summary Strip inside Notification */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#EBF4FC] border border-[#9AC2E6] text-xs">
              <div className="font-bold text-[#1A2138]">
                Plans: <strong>Rs. {monthlyFeeRs.toLocaleString()} / 1 Month</strong> or{' '}
                <strong>Rs. {yearlyFeeRs.toLocaleString()} / Full Year</strong>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1673B8] text-white text-[10.5px] font-extrabold">
                Save {effectiveDiscountPct}% on Yearly Plan
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenPremiumModal}
              className="w-full py-4 px-5 rounded-[20px] bg-gradient-to-r from-[#1673B8] via-[#105E9A] to-[#1A2138] hover:from-[#105E9A] hover:to-[#1A2138] text-white font-extrabold text-[15px] shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Crown className="w-5 h-5 text-amber-300 shrink-0" />
              <span>
                Purchase / Buy Premium Membership (Rs. {monthlyFeeRs.toLocaleString()}/Mo • Rs. {yearlyFeeRs.toLocaleString()}/Yr)
              </span>
            </button>
          </div>
        )}

        {(profile.paymentStatus === 'pending' ||
          hasSubmittedApplication ||
          isPremium) && (
          <button
            type="button"
            onClick={onOpenApplicationStatusModal}
            className="w-full py-3.5 px-5 rounded-[18px] bg-white hover:bg-[#EBF4FC] border-[1.5px] border-[#1673B8] text-[#1A2138] font-extrabold text-[14px] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#1673B8] shrink-0" />
            <span>
              {isPremium
                ? 'View My Application Status (Approved ✓)'
                : profile.paymentStatus === 'pending'
                ? 'View My Application Status (Under Review)'
                : 'View My Application Status'}
            </span>
          </button>
        )}
      </div>

      {isUserAdmin && (
        <button
          type="button"
          onClick={onOpenAdmin}
          className="w-full py-3.5 px-5 rounded-[18px] bg-[#1A2138] hover:bg-[#1673B8] text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Database className="w-4 h-4 text-sky-300" />
          <span>Open Admin Cloud Storage &amp; Control Panel</span>
        </button>
      )}

      {/* PRIVACY POLICY, TERMS, ADSENSE/ADMOB COMPLIANCE & ACCOUNT DELETION SECTION */}
      <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EBF4FC] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1673B8] shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold text-[#1A2138]">
                Legal, Privacy Policy &amp; Account Data Controls
              </h3>
              <p className="text-[11px] text-[#475569] font-medium">
                Google Play Store, AdSense &amp; AdMob compliance policies and self-service data deletion
              </p>
            </div>
          </div>
        </div>

        {/* Quick Policy Links */}
        {onOpenLegalModal && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => onOpenLegalModal('privacy')}
              className="py-2.5 px-3 rounded-xl bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
              <span>Privacy Policy</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalModal('terms')}
              className="py-2.5 px-3 rounded-xl bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
              <span>Terms of Use</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalModal('ads')}
              className="py-2.5 px-3 rounded-xl bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
              <span>AdSense &amp; AdMob</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenLegalModal('deletion')}
              className="py-2.5 px-3 rounded-xl bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>Deletion Policy</span>
            </button>
          </div>
        )}

        {/* Permanent Account & Data Deletion Box */}
        {onDeleteOwnAccount && (
          <div className="pt-2 border-t border-[#ECF4EF]">
            {!showDeleteAccountConfirm ? (
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-red-50/70 border border-red-200 rounded-2xl p-3.5">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-red-900 flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Delete My Account &amp; Personal Data</span>
                  </div>
                  <p className="text-[11px] text-red-700 font-medium leading-snug">
                    Permanently delete your FS Portal profile, uploaded CV, private vault, and login account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmText('');
                    setShowDeleteAccountConfirm(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-600 hover:text-white border border-red-300 text-red-700 text-xs font-extrabold shrink-0 cursor-pointer transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            ) : (
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-extrabold text-red-950">
                        Confirm Permanent Account &amp; Data Deletion
                      </h4>
                      <p className="text-[11px] text-red-800 font-medium mt-0.5 leading-relaxed">
                        This action is permanent and cannot be undone. Your profile, uploaded PDF CV, private vault, and membership records will be immediately erased from Cloud Firestore.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteAccountConfirm(false)}
                    className="text-red-700 hover:text-red-950 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-red-900 mb-1">
                    Type <span className="underline">DELETE</span> below to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-red-300 text-xs font-bold text-gray-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteAccountConfirm(false)}
                    disabled={isDeletingAccount}
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={
                      isDeletingAccount ||
                      deleteConfirmText.trim().toUpperCase() !== 'DELETE'
                    }
                    onClick={async () => {
                      setIsDeletingAccount(true);
                      try {
                        await onDeleteOwnAccount();
                      } finally {
                        setIsDeletingAccount(false);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {isDeletingAccount ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Deleting Account...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Permanently Delete Account &amp; Data</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
