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
  AlertCircle
} from 'lucide-react';
import {
  HubUser,
  VisibilityLevel,
  ProfileVisibilityMap,
  HubEducationItem,
  HubExperienceItem,
  HubCertificationItem,
  HubProjectItem,
  HubCertificate
} from '../types/hub';
import { makeAvatarSvg } from '../data/mockHubData';
import { formatFileSizeLabel } from '../lib/storage';

export const DEFAULT_VISIBILITY_MAP: ProfileVisibilityMap = {
  name: 'public',
  title: 'public',
  company: 'premium',
  location: 'public',
  bio: 'public',
  linkedin: 'premium',
  cv: 'premium',
  contact: 'premium',
  education: 'premium',
  experience: 'premium',
  certifications: 'public',
  projects: 'public'
};

export function cycleVisibilityLevel(current: VisibilityLevel): VisibilityLevel {
  if (current === 'public') return 'private';
  if (current === 'private') return 'premium';
  return 'public';
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
        visibility: user.visibility?.experience || 'premium'
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
        visibility: user.visibility?.education || 'premium'
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
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(cycleVisibilityLevel(value));
  };

  if (value === 'public') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title="Visibility: Public (Tap to switch to Private / Premium Only)"
        className={`inline-flex items-center rounded-full border border-[#229A54] bg-gradient-to-r from-white via-[#E8F8EE] to-[#229A54] text-[#0D2E1B] font-extrabold shadow-2xs transition-all cursor-pointer shrink-0 select-none ${
          size === 'sm' ? 'px-2.5 py-0.5 text-[10.5px]' : 'px-3 py-1 text-[11.5px]'
        }`}
      >
        <span className="text-[#15803D] drop-shadow-2xs">Public</span>
      </button>
    );
  }

  if (value === 'private') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title="Visibility: Private — Only you can see (Tap to switch to Premium Only)"
        className={`inline-flex items-center rounded-full bg-[#B0B5B2] hover:bg-[#9CA29E] text-white font-extrabold shadow-2xs transition-all cursor-pointer shrink-0 select-none ${
          size === 'sm' ? 'px-2.5 py-0.5 text-[10.5px]' : 'px-3 py-1 text-[11.5px]'
        }`}
      >
        <span>Private</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Visibility: Premium Only — Only Premium Paid Members can see (Tap to switch to Public)"
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#B45309] hover:to-[#92400E] border border-[#FCD34D] text-white font-extrabold shadow-2xs transition-all cursor-pointer shrink-0 select-none ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10.5px]' : 'px-3 py-1 text-[11px]'
      }`}
    >
      <Sparkles className="w-2.5 h-2.5 text-amber-200" />
      <span>Premium Only</span>
    </button>
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
  // Membership & Certificates Vault props
  myEarnedCertificates: HubCertificate[];
  onSelectCertificate: (cert: HubCertificate) => void;
  onOpenTrainings: () => void;
  payMethod: 'EasyPaisa' | 'JazzCash' | 'Bank Transfer';
  setPayMethod: (m: 'EasyPaisa' | 'JazzCash' | 'Bank Transfer') => void;
  payTransactionId: string;
  setPayTransactionId: (v: string) => void;
  payAmount: string;
  setPayAmount: (v: string) => void;
  payReceiptUrl: string;
  onUploadPaymentReceipt: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paySubmitBanner: string | null;
  onSubmitPaymentVerification: () => void;
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
  myEarnedCertificates,
  onSelectCertificate,
  onOpenTrainings,
  payMethod,
  setPayMethod,
  payTransactionId,
  setPayTransactionId,
  payAmount,
  setPayAmount,
  payReceiptUrl,
  onUploadPaymentReceipt,
  paySubmitBanner,
  onSubmitPaymentVerification
}) => {
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);
  const receiptInputRef = useRef<HTMLInputElement | null>(null);

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
  const isPremium = Boolean(profile.isPremium || profile.isPaid);

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
      {/* MAIN EDIT PROFILE CARD MATCHING REFERENCE IMAGE 1 */}
      <form
        onSubmit={validateAndSubmit}
        className="bg-[#F9FBF9] border border-[#DCE8DF] rounded-[32px] p-4 sm:p-6 shadow-[0_10px_30px_rgba(13,46,27,0.08)] space-y-5"
      >
        {/* TOP HEADER: Back Arrow | "Edit Profile" | "Save" */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-3.5">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full hover:bg-gray-200/60 flex items-center justify-center text-[#111827] transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
          </button>

          <h1 className="text-[22px] sm:text-[24px] font-extrabold text-[#14261C] tracking-tight">
            Edit Profile
          </h1>

          <button
            type="submit"
            disabled={isSaving}
            className="text-[16px] font-extrabold text-[#228B4E] hover:text-[#14532D] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Quick Public Profile Preview Pill + Visibility Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white border border-emerald-100 rounded-2xl px-3.5 py-2.5 shadow-2xs">
          <div className="text-[11px] font-semibold text-gray-600 flex items-center gap-1.5 flex-wrap">
            <span>Tap any pill to cycle:</span>
            <span className="px-2 py-0.5 rounded-full bg-[#229A54] text-white font-bold text-[10px]">
              Public
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#B0B5B2] text-white font-bold text-[10px]">
              Private
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#D97706] text-white font-bold text-[10px]">
              Premium Only
            </span>
          </div>
          <button
            type="button"
            onClick={onPreviewPublicProfile}
            className="px-3 py-1 rounded-full bg-[#EAF5EC] hover:bg-[#D5EAD8] text-[#15803D] text-[11.5px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public Profile</span>
          </button>
        </div>

        {profileSaveMsg && (
          <div className="bg-[#15803D] text-white rounded-2xl p-3.5 text-xs font-extrabold flex items-center justify-between gap-2 shadow-xs">
            <span>{profileSaveMsg}</span>
            <Check className="w-4 h-4 shrink-0" />
          </div>
        )}

        {uploadStatusMsg && (
          <div className="bg-[#DCFCE7] border border-[#16A34A] text-[#0D2E1B] rounded-2xl p-3 text-xs font-extrabold flex items-center justify-between gap-2">
            <span>{uploadStatusMsg}</span>
            {isUploadingMedia && (
              <Loader2 className="w-4 h-4 animate-spin text-[#15803D] shrink-0" />
            )}
          </div>
        )}

        {/* 1. PROFILE PHOTO: Circular Avatar + Camera Button + "Change Photo" */}
        <div className="flex flex-col items-center pt-1">
          <div className="relative inline-block">
            <img
              src={displayAvatar}
              alt={profile.name || 'Profile'}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md bg-[#EBF3ED]"
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
              className="absolute bottom-0.5 right-0.5 w-9 h-9 rounded-full bg-[#229A54] hover:bg-[#15803D] text-white border-2 border-white shadow-md flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            >
              <Camera className="w-4 h-4 stroke-[2.3]" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="mt-2.5 px-4 py-1 rounded-full bg-[#95CEA5] hover:bg-[#7FBF91] text-[#0D2E1B] text-[12px] font-bold shadow-2xs transition-colors cursor-pointer"
          >
            Change Photo
          </button>
        </div>

        {/* 2. BASIC INFORMATION */}
        <div className="space-y-3">
          <h2 className="text-[15px] font-extrabold text-[#14261C]">
            Basic Information
          </h2>

          {/* Full Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <label className="sm:w-[130px] text-[13.5px] font-semibold text-[#1F2937] shrink-0">
              Full Name
            </label>
            <div className="relative flex-1 flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#229A54]">
              <span className="absolute -top-2 left-3 px-1.5 py-0.2 bg-[#E5EAE7] rounded text-[9.5px] font-bold text-gray-700 leading-tight">
                Full Name
              </span>
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
            <div className="relative flex-1 flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#229A54]">
              <span className="absolute -top-2 left-3 px-1.5 py-0.2 bg-[#E5EAE7] rounded text-[9.5px] font-bold text-gray-700 leading-tight">
                Current Title
              </span>
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
            <div className="relative flex-1 flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#229A54]">
              <span className="absolute -top-2 left-3 px-1.5 py-0.2 bg-[#E5EAE7] rounded text-[9.5px] font-bold text-gray-700 leading-tight">
                Current Company
              </span>
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
            <div className="flex-1 flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#229A54]">
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
            <label className="text-[15px] font-extrabold text-[#14261C]">
              About Bio
            </label>
            <span className="text-[11px] font-semibold text-gray-400">
              {(profile.bio || '').length}/500
            </span>
          </div>
          <div className="relative bg-white border border-gray-200/90 rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#229A54] flex items-center gap-2">
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
          <label className="block text-[15px] font-extrabold text-[#14261C]">
            LinkedIn URL
          </label>
          <div className="flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#229A54] gap-2.5">
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
          <div className="bg-[#E6F3EA] border border-[#8BB999] rounded-[22px] p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-[#8BB999] text-[#228B4E] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15.5px] font-extrabold text-[#14261C]">
                      CV / Resume
                    </h3>
                    <VisibilityPill
                      size="sm"
                      value={vis.cv}
                      onChange={(next) => updateVisibility('cv', next)}
                    />
                  </div>
                  <p className="text-[12.5px] font-semibold text-gray-700 truncate mt-0.5">
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
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F0FDF4] border border-[#228B4E] text-[#14261C] text-[12.5px] font-extrabold inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#228B4E] stroke-[2.5]" />
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

            <p className="text-[11px] font-semibold text-[#14532D]/90 leading-snug">
              Your CV will be visible only to Premium Community Members after you become Premium
            </p>
          </div>
        </div>

        {/* 5. DETAILS — DYNAMIC ADD / EDIT / DELETE LISTS */}
        <div className="space-y-3.5 pt-1">
          <h2 className="text-[15px] font-extrabold text-[#14261C]">Details</h2>

          {/* ==================== 5A. EDUCATION ==================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold text-[#14261C]">
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
                    visibility: vis.education || 'premium'
                  })
                }
                className="px-4 py-1.5 rounded-full bg-[#95CEA5] hover:bg-[#7FBF91] text-[#0D2E1B] text-[12.5px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add New</span>
              </button>
            </div>

            {editingEdu && (
              <div className="bg-white border-2 border-[#229A54] rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#14532D] uppercase">
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
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#229A54]"
                />
                <input
                  type="text"
                  placeholder="Institute / University (e.g. UVAS Lahore / NIFSAT)"
                  value={editingEdu.institute}
                  onChange={(e) =>
                    setEditingEdu({ ...editingEdu, institute: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#229A54]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start Year (e.g. 2018)"
                    value={editingEdu.startYear}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, startYear: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="End Year (e.g. 2022)"
                    value={editingEdu.endYear}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, endYear: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
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
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-medium text-gray-900 focus:outline-none"
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
                    className="px-4 py-1.5 rounded-xl bg-[#228B4E] text-white text-xs font-extrabold cursor-pointer"
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
                      <div className="text-[13.5px] font-extrabold text-[#14261C]">
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
                        value={edu.visibility || 'premium'}
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
                <span className="text-[17px] font-extrabold text-[#14261C]">
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
                    visibility: vis.experience || 'premium'
                  })
                }
                className="px-4 py-1.5 rounded-full bg-[#95CEA5] hover:bg-[#7FBF91] text-[#0D2E1B] text-[12.5px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add New</span>
              </button>
            </div>

            {editingExp && (
              <div className="bg-white border-2 border-[#229A54] rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#14532D] uppercase">
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
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Company (e.g. Nestlé Pakistan)"
                    value={editingExp.company}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, company: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Lahore)"
                    value={editingExp.location}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, location: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
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
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
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
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
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
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-medium text-gray-900 focus:outline-none"
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
                    className="px-4 py-1.5 rounded-xl bg-[#228B4E] text-white text-xs font-extrabold cursor-pointer"
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
                      <div className="text-[13.5px] font-extrabold text-[#14261C]">
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
                        value={exp.visibility || 'premium'}
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

          {/* ==================== 5C. CERTIFICATIONS ==================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold text-[#14261C]">
                  Certifications
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
                className="px-4 py-1.5 rounded-full bg-[#95CEA5] hover:bg-[#7FBF91] text-[#0D2E1B] text-[12.5px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add New</span>
              </button>
            </div>

            {editingCert && (
              <div className="bg-white border-2 border-[#229A54] rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#14532D] uppercase">
                    Certification Entry
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
                  placeholder="Certificate Name (e.g. ISO 22000 Lead Auditor / HACCP Level 4)"
                  value={editingCert.name}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Issuer (e.g. Highfield UK / IRCA CQI)"
                  value={editingCert.issuer}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, issuer: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Issue Date (e.g. Oct 2024)"
                    value={editingCert.issueDate}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
                        issueDate: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
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
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
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
                    className="px-4 py-1.5 rounded-xl bg-[#228B4E] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Save Certification
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
                      <div className="text-[13.5px] font-extrabold text-[#14261C]">
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
                <span className="text-[17px] font-extrabold text-[#14261C]">
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
                className="px-4 py-1.5 rounded-full bg-[#95CEA5] hover:bg-[#7FBF91] text-[#0D2E1B] text-[12.5px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add New</span>
              </button>
            </div>

            {editingProj && (
              <div className="bg-white border-2 border-[#229A54] rounded-2xl p-4 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#14532D] uppercase">
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
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
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
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-medium text-gray-900 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Optional Link (e.g. https://...)"
                  value={editingProj.link || ''}
                  onChange={(e) =>
                    setEditingProj({ ...editingProj, link: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-900 focus:outline-none"
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
                    className="px-4 py-1.5 rounded-xl bg-[#228B4E] text-white text-xs font-extrabold cursor-pointer"
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
                      <div className="text-[13.5px] font-extrabold text-[#14261C]">
                        {proj.title}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {proj.description}
                      </p>
                      {proj.link && (
                        <div className="text-[11px] font-bold text-[#228B4E] truncate mt-0.5">
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
                <div className="text-[14px] font-extrabold text-[#14261C]">
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
                className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-800 focus:outline-none"
              />
              <input
                type="text"
                value={profile.phone || ''}
                onChange={(e) =>
                  onChangeProfile({ ...profile, phone: e.target.value })
                }
                placeholder="WhatsApp / Phone (e.g. +92 300 ...)"
                className="w-full px-3 py-2 rounded-xl bg-[#F3F7F4] text-xs font-semibold text-gray-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 6. HIRE ME TOGGLE + 7. BIG GREEN SAVE CHANGES BUTTON (BOTTOM CONTAINER MATCHING REF IMAGE 1) */}
        <div className="bg-white border border-gray-200/80 rounded-[26px] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[17px] font-extrabold text-[#14261C]">
                Hire Me
              </h3>
              <p className="text-[12.5px] font-medium text-gray-600">
                Allow recruiters to contact you for opportunities
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-extrabold text-[#228B4E]">
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
                  hireMe ? 'bg-[#229A54] justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 px-6 rounded-[18px] bg-[#228B4E] hover:bg-[#196E3B] text-white font-extrabold text-[17px] shadow-md transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSaving ? 'Saving Profile...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* PREMIUM MEMBERSHIP UPGRADE & TRAINING CERTIFICATES VAULT */}
      <div className="bg-white border-2 border-[#16A34A] rounded-[26px] p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#15803D]" />
            <div>
              <h3 className="text-[15.5px] font-extrabold text-[#0D2E1B]">
                Premium Membership &amp; Payment Receipt
              </h3>
              <p className="text-[11px] text-gray-600">
                Become a Premium Member to appear in Community, view LinkedIn &amp; download CVs
              </p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10.5px] font-extrabold ${
              isPremium
                ? 'bg-[#DCFCE7] text-[#14532D]'
                : profile.paymentStatus === 'pending'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isPremium
              ? 'Premium Active ✓'
              : profile.paymentStatus === 'pending'
              ? 'Pending Admin Review'
              : 'Free Plan'}
          </span>
        </div>

        {!isPremium && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-3 gap-1.5">
              {(['EasyPaisa', 'JazzCash', 'Bank Transfer'] as const).map(
                (method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPayMethod(method)}
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                      payMethod === method
                        ? 'bg-[#15803D] text-white border-[#15803D]'
                        : 'bg-[#F2F7F3] text-[#0D2E1B] border-[#C6DFCB]'
                    }`}
                  >
                    {method}
                  </button>
                )
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                value={payTransactionId}
                onChange={(e) => setPayTransactionId(e.target.value)}
                placeholder="Transaction / Ref ID"
                className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold text-gray-900 focus:outline-none"
              />
              <input
                type="text"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="Amount (e.g. PKR 2,000)"
                className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold text-gray-900 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#F2F7F3] border border-dashed border-[#16A34A] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <ImageIcon className="w-5 h-5 text-[#15803D] shrink-0" />
                <span className="text-xs font-extrabold text-[#0D2E1B] truncate">
                  {payReceiptUrl
                    ? 'Payment Receipt Attached ✓'
                    : 'Upload Payment Receipt Screenshot'}
                </span>
              </div>
              <input
                ref={receiptInputRef}
                type="file"
                accept="image/*"
                onChange={onUploadPaymentReceipt}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => receiptInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-[#15803D] text-white text-xs font-extrabold shrink-0 cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{payReceiptUrl ? 'Change' : 'Upload'}</span>
              </button>
            </div>

            {paySubmitBanner && (
              <div className="p-3 rounded-xl bg-[#DCFCE7] text-[#0D2E1B] text-xs font-bold">
                {paySubmitBanner}
              </div>
            )}

            <button
              type="button"
              onClick={onSubmitPaymentVerification}
              className="w-full py-3 px-4 rounded-2xl bg-[#14532D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold transition-colors cursor-pointer"
            >
              Submit Payment Receipt for Premium Activation
            </button>
          </div>
        )}
      </div>

      {/* MY TRAINING CERTIFICATES VAULT */}
      <div className="bg-white border border-emerald-200 rounded-[24px] p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#15803D]" />
            <h3 className="text-sm font-extrabold text-[#0D2E1B]">
              My Training Certificates ({myEarnedCertificates.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenTrainings}
            className="text-[11px] font-extrabold text-[#15803D] underline cursor-pointer"
          >
            Verify Any ID →
          </button>
        </div>

        {myEarnedCertificates.length === 0 ? (
          <p className="text-xs text-gray-600">
            Official Highfield &amp; Lead Auditor training certificates issued to your email will appear here.
          </p>
        ) : (
          <div className="space-y-2">
            {myEarnedCertificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => onSelectCertificate(cert)}
                className="p-3 rounded-2xl bg-[#F0FDF4] border border-emerald-200 flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-[#0D2E1B] truncate">
                    {cert.trainingTitle}
                  </div>
                  <div className="text-[11px] text-[#15803D] font-bold">
                    ID: {cert.certificateNumber} • {cert.issueDate}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#15803D] text-white text-[10.5px] font-extrabold shrink-0">
                  Open
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isUserAdmin && (
        <button
          type="button"
          onClick={onOpenAdmin}
          className="w-full py-3.5 px-5 rounded-[18px] bg-[#0D2E1B] hover:bg-[#14532D] text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Database className="w-4 h-4 text-emerald-300" />
          <span>Open Admin Cloud Storage &amp; Control Panel</span>
        </button>
      )}
    </div>
  );
};
