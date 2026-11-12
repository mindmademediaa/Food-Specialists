/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowRight,
  Wheat,
  FlaskConical,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Globe,
  Trophy,
  Search,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Check,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Award,
  Pencil,
  Shield,
  Lock,
  Clock,
  Eye,
  X,
  Bookmark,
  ListFilter,
  Sparkles,
  Leaf,
  Utensils,
  MessageSquare,
  Crown,
  UserPlus,
  Copy,
  Share2,
  MessageCircle,
  ThumbsUp,
  Loader2,
  Database,
  Upload,
  Download,
  Trash2,
  Plus,
  CreditCard,
  Image as ImageIcon,
  Wrench,
  Activity,
  Smartphone,
  Users
} from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import {
  db,
  auth,
  signOut,
  onAuthStateChanged,
  savePersistedAuthUser,
  loadPersistedAuthUser,
  clearPersistedAuthUser,
  type User,
  OperationType,
  handleFirestoreError
} from './lib/firebase';
import { FS_PORTAL_LOGO_DATA_URI } from './lib/brandLogo';
import { preloadUserAvatarForPdf } from './lib/pdfBranding';
import {
  HubUser,
  PrivacySettings,
  ProfileVisibilityMap,
  HubJob,
  HubScholarship,
  HubTraining,
  HubPaymentRequest,
  HubCertificate,
  CloudStorageConfig,
  DevRole,
  SpecializationTag,
  NavTab,
  UserToolsData,
  UserCourseProgress
} from './types/hub';
import {
  INITIAL_JOBS,
  INITIAL_SCHOLARSHIPS,
  INITIAL_TRAININGS,
  makeAvatarSvg
} from './data/mockHubData';
import { INTERNATIONAL_TRAINING_COURSES } from './data/internationalTrainingsData';
import { DEFAULT_USER_TOOLS_DATA } from './data/examPrepData';
import {
  uploadMediaFile,
  formatFileSizeLabel
} from './lib/storage';
import { Header, WebsiteNavSection } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { JobCard } from './components/JobCard';
import { MemberCard, canViewerSeeField } from './components/MemberCard';
import { AuthScreen } from './components/AuthScreen';
import {
  EditProfileView,
  DEFAULT_VISIBILITY_MAP,
  normalizeEducationArray,
  normalizeExperienceArray
} from './components/EditProfileView';
import { PublicProfileView } from './components/PublicProfileView';
import { AdminControlPanel } from './components/AdminControlPanel';
import {
  LegalComplianceModal,
  LegalTabType
} from './components/LegalComplianceModal';
import { ToolsHubView, ActiveToolSection } from './components/ToolsHubView';
import { TrainingsAcademyView } from './components/TrainingsAcademyView';
import { SEOManager, SEODirectoryFooter } from './components/SEOManager';
import {
  FreeVsPremiumComparisonCard,
  CertificateBundleOffersCard
} from './components/PricingAndBundlesSection';

// Custom Duotone SVGs & Botanical Watermarks for the Home Screen Cards
const DuotoneBriefcaseIcon = () => (
  <svg viewBox="0 0 64 64" className="w-11 h-11" fill="none">
    <rect
      x="10"
      y="20"
      width="44"
      height="32"
      rx="6"
      fill="#75C88B"
      stroke="#143622"
      strokeWidth="3"
    />
    <path
      d="M24 20V15C24 13.3431 25.3431 12 27 12H37C38.6569 12 40 13.3431 40 15V20"
      stroke="#143622"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path d="M10 33H54" stroke="#143622" strokeWidth="3" strokeLinecap="round" />
    <rect
      x="28"
      y="29"
      width="8"
      height="7"
      rx="1.5"
      fill="#BCE6C7"
      stroke="#143622"
      strokeWidth="2.5"
    />
  </svg>
);

const DuotoneGradCapIcon = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
    <path
      d="M8 26L32 14L56 26L32 38L8 26Z"
      fill="#75C88B"
      stroke="#143622"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M18 32V44C18 44 24 50 32 50C40 50 46 44 46 44V32"
      fill="#A3DCB2"
      stroke="#143622"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 29V44" stroke="#143622" strokeWidth="3" strokeLinecap="round" />
    <circle
      cx="14"
      cy="46"
      r="2.5"
      fill="#75C88B"
      stroke="#143622"
      strokeWidth="2.5"
    />
  </svg>
);

const LeafWatermark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className}>
    <path
      d="M8 28C8 16 18 8 29 8C29 19 21 28 8 28Z"
      stroke="#9AB5A1"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 28L22 15" stroke="#9AB5A1" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const TestTubeWatermark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className}>
    <path
      d="M22 6L30 11L16 31C14.5 33 11.5 33.5 9.5 32C7.5 30.5 7 27.5 8.5 25.5L22 6Z"
      stroke="#9AB5A1"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 5L31 12" stroke="#9AB5A1" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 22H21" stroke="#9AB5A1" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const WheatWatermark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className}>
    <path d="M8 28L26 10" stroke="#9AB5A1" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse
      cx="15"
      cy="17"
      rx="2.5"
      ry="5"
      transform="rotate(-15 15 17)"
      stroke="#9AB5A1"
      strokeWidth="1.6"
    />
    <ellipse
      cx="20"
      cy="21"
      rx="5"
      ry="2.5"
      transform="rotate(-15 20 21)"
      stroke="#9AB5A1"
      strokeWidth="1.6"
    />
    <ellipse
      cx="20"
      cy="12"
      rx="2.5"
      ry="5"
      transform="rotate(-15 20 12)"
      stroke="#9AB5A1"
      strokeWidth="1.6"
    />
    <ellipse
      cx="25"
      cy="16"
      rx="5"
      ry="2.5"
      transform="rotate(-15 25 16)"
      stroke="#9AB5A1"
      strokeWidth="1.6"
    />
  </svg>
);

const AppleWatermark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className}>
    <path
      d="M18 12C13 11 9 15 9 20.5C9 26.5 13.5 31 18 30C22.5 31 27 26.5 27 20.5C27 15 23 11 18 12Z"
      stroke="#9AB5A1"
      strokeWidth="1.8"
    />
    <path
      d="M18 12C18 9 20 7 22 7"
      stroke="#9AB5A1"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

type RouteView =
  | { name: 'home' }
  | { name: 'jobs'; categoryFilter?: string }
  | { name: 'job-detail'; jobId: string }
  | { name: 'scholarships'; fundingFilter?: string }
  | { name: 'scholarship-detail'; scholarshipId: string }
  | { name: 'search' }
  | { name: 'communities' }
  | { name: 'community-member'; uid: string }
  | { name: 'trainings' }
  | { name: 'trainings-highfield' }
  | { name: 'trainings-lead-auditor-hub' }
  | { name: 'training-detail'; trainingId: string }
  | { name: 'tools'; initialSection?: ActiveToolSection }
  | { name: 'profile' }
  | { name: 'admin' };

const JOB_SCH_SPECIALIZATIONS: SpecializationTag[] = [
  'QA/QC',
  'Food Safety',
  'Dairy',
  'Bakery',
  'Nutrition',
  'R&D'
];

function getDaysRemaining(deadlineStr: string): number {
  const today = new Date('2026-11-01T00:00:00Z').getTime();
  const target = new Date(deadlineStr).getTime();
  if (Number.isNaN(target)) return 30;
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

const DEFAULT_CURRENT_USER_PROFILE: HubUser = {
  uid: '',
  name: '',
  title: '',
  profilePhotoUrl: '',
  profilePicUrl: '',
  qualification: '',
  experience: [],
  experienceItems: [],
  education: [],
  certifications: [],
  projects: [],
  currentRole: '',
  company: '',
  location: '',
  country: '',
  bio: '',
  email: '',
  phone: '',
  linkedinUrl: '',
  portfolioUrl: '',
  skills: [],
  specializations: [],
  cvUrl: '',
  cvFileName: '',
  cvFileSize: '',
  cvUploadedAt: '',
  hireMe: true,
  plan: 'free',
  isPremium: false,
  profileCompleted: false,
  profileVisibility: true,
  visibility: DEFAULT_VISIBILITY_MAP,
  privacySettings: {
    qualification_public: true,
    experience_public: true,
    currentRole_public: true,
    location_public: true,
    email_public: true,
    phone_public: true,
    hireMe_public: true
  },
  createdAt: '2026-11-01T08:00:00Z',
  isAdmin: false,
  isPaid: false,
  paymentStatus: 'none'
};

// Sanitize a user profile before saving to the shared /users/{uid} document:
// Any field whose visibility is 'private' is stripped from the shared document,
// while 'public' and 'premium' fields remain so the frontend can enforce viewer plan rules,
// and the owner's full unredacted data is stored in /users/{uid}/private/profile.
const buildSanitizedPublicUser = (fullProfile: HubUser): HubUser => {
  const vis: ProfileVisibilityMap = {
    ...DEFAULT_VISIBILITY_MAP,
    ...(fullProfile.visibility || {})
  };
  const eduList = normalizeEducationArray(fullProfile).filter(
    (item) => item.visibility !== 'private'
  );
  const expList = normalizeExperienceArray(fullProfile).filter(
    (item) => item.visibility !== 'private'
  );
  const certList = (fullProfile.certifications || []).filter(
    (item) => item.visibility !== 'private'
  );
  const projList = (fullProfile.projects || []).filter(
    (item) => item.visibility !== 'private'
  );

  const isPaidMember = Boolean(fullProfile.isPaid || fullProfile.isPremium);
  const allowEmailPublic =
    isPaidMember && (vis.email ?? vis.contact) !== 'private';
  const allowWhatsappPublic =
    isPaidMember && (vis.whatsapp ?? vis.contact) !== 'private';

  return {
    ...fullProfile,
    visibility: vis,
    title: vis.title === 'private' ? '' : fullProfile.title || fullProfile.currentRole || '',
    currentRole:
      vis.title === 'private' ? '' : fullProfile.title || fullProfile.currentRole || '',
    company: vis.company === 'private' ? '' : fullProfile.company || '',
    location: vis.location === 'private' ? '' : fullProfile.location || '',
    bio: vis.bio === 'private' ? '' : fullProfile.bio || '',
    linkedinUrl: vis.linkedin === 'private' ? '' : fullProfile.linkedinUrl || '',
    cvUrl: vis.cv === 'private' ? '' : fullProfile.cvUrl || '',
    cvFileName: vis.cv === 'private' ? '' : fullProfile.cvFileName || '',
    email: allowEmailPublic ? fullProfile.email || '' : '',
    phone: allowWhatsappPublic
      ? fullProfile.whatsappNumber || fullProfile.phone || ''
      : '',
    whatsappNumber: allowWhatsappPublic
      ? fullProfile.whatsappNumber || fullProfile.phone || ''
      : '',
    education: vis.education === 'private' ? [] : eduList,
    experience: vis.experience === 'private' ? [] : expList,
    experienceItems: vis.experience === 'private' ? [] : expList,
    certifications: vis.certifications === 'private' ? [] : certList,
    projects: vis.projects === 'private' ? [] : projList
  };
};

export default function App() {
  // 2.2-second (2200ms) Startup / Reload / Logout Splash Screen with FS Portal Logo
  const [showSplashLogo, setShowSplashLogo] = useState<boolean>(true);

  useEffect(() => {
    if (!showSplashLogo) return;
    const splashTimer = setTimeout(() => {
      setShowSplashLogo(false);
    }, 2200);
    return () => clearTimeout(splashTimer);
  }, [showSplashLogo]);

  // Firebase Authentication State (Persisted across tab switches & reloads)
  const [authUser, setAuthUser] = useState<User | null>(
    () => auth.currentUser || loadPersistedAuthUser()
  );
  const [authLoading, setAuthLoading] = useState<boolean>(
    () => !(auth.currentUser || loadPersistedAuthUser())
  );

  const [showGuestAuthModal, setShowGuestAuthModal] = useState<boolean>(false);

  // Navigation & Route Stack (supports SEO query parameters: ?section=tools&tool=..., ?section=trainings&course=..., ?verify=...)
  const [route, setRoute] = useState<RouteView>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('verify') ||
        params.get('cert') ||
        params.get('tab') === 'verify-portal' ||
        params.get('course') ||
        params.get('section') === 'trainings'
      ) {
        return { name: 'trainings' };
      }
      const section = (params.get('section') || '').toLowerCase();
      const toolParam = params.get('tool') as ActiveToolSection | null;
      if (section === 'tools' || toolParam) {
        return { name: 'tools', initialSection: toolParam || 'hub' };
      }
      if (section === 'jobs') return { name: 'jobs' };
      if (section === 'scholarships') return { name: 'scholarships' };
      if (section === 'communities') return { name: 'communities' };
      if (section === 'search' || params.get('q')) return { name: 'search' };
    }
    return { name: 'home' };
  });
  const [hasSavedProfile, setHasSavedProfile] = useState<boolean>(true);

  // Collections State (Real Firestore Users — No Placeholder Profiles)
  const [users, setUsers] = useState<HubUser[]>([]);
  const [showCommunityPaywall, setShowCommunityPaywall] =
    useState<boolean>(false);
  const [jobs, setJobs] = useState<HubJob[]>(INITIAL_JOBS);
  const [scholarships, setScholarships] = useState<HubScholarship[]>(
    INITIAL_SCHOLARSHIPS
  );
  const [trainings, setTrainings] = useState<HubTraining[]>(INITIAL_TRAININGS);
  const [certificates, setCertificates] = useState<HubCertificate[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<HubPaymentRequest[]>(
    []
  );
  const [storageConfig, setStorageConfig] = useState<CloudStorageConfig>({
    provider: 'cloudinary',
    cloudinaryCloudName: 'mhjkrdlh',
    cloudinaryUploadPreset: 'Food Specialists',
    updatedAt: '2026-11-03T11:45:00Z',
    whatsappChannelUrl: 'https://whatsapp.com/channel/0029VaFoodSpecialists',
    whatsappChannelButtonText: 'Follow WhatsApp Channel',
    paymentGateway: {
      jazzCashTitle: 'Muneeb Khan',
      jazzCashNumber: '0324-0906384',
      easyPaisaTitle: 'Muneeb Khan',
      easyPaisaNumber: '0324-0906384',
      bankTitle: 'Muneeb Khan',
      bankName: 'Allied Bank / Bank Transfer',
      bankAccountOrIban: 'Contact on WhatsApp for IBAN',
      bankWhatsapp: '+92 324 0906384',
      monthlyFeeRs: 100,
      yearlyFeeRs: 900
    }
  });

  // Applied Jobs & Scholarships Local Tracking ('Mark as Applied' checkbox)
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState<string[]>(
    []
  );
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>([]);

  // Active Tool Section inside ToolsHubView (initialized from ?tool= URL param for SEO deep-linking)
  const [activeToolSection, setActiveToolSection] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('tool') || 'hub';
    }
    return 'hub';
  });
  const [toolsResetKey, setToolsResetKey] = useState<number>(0);

  // Read Job Notification IDs (persisted so newly posted jobs trigger unread Bell notifications)
  const [readJobNotificationIds, setReadJobNotificationIds] = useState<string[]>(
    () => {
      if (typeof window === 'undefined') return [];
      try {
        const saved = window.localStorage.getItem(
          'fs_portal_read_job_notif_ids_v1'
        );
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // Ignore
      }
      // On initial visit, leave the newest 3 jobs unread and mark older seed jobs as read
      return INITIAL_JOBS.slice(3).map((j) => j.id);
    }
  );

  const handleMarkJobNotificationRead = (jobId: string) => {
    setReadJobNotificationIds((prev) => {
      const next = prev.includes(jobId) ? prev : [...prev, jobId];
      try {
        window.localStorage.setItem(
          'fs_portal_read_job_notif_ids_v1',
          JSON.stringify(next)
        );
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleMarkAllJobNotificationsRead = () => {
    const allIds = Array.from(
      new Set([...readJobNotificationIds, ...jobs.map((j) => j.id)])
    );
    setReadJobNotificationIds(allIds);
    try {
      window.localStorage.setItem(
        'fs_portal_read_job_notif_ids_v1',
        JSON.stringify(allIds)
      );
    } catch {
      // Ignore
    }
  };

  // Copy Helper Feedback State (for 1-click 'Copy Contact Email & Subject')
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Current User Profile
  const [myProfile, setMyProfile] = useState<HubUser>(
    DEFAULT_CURRENT_USER_PROFILE
  );
  const [profileSaveMsg, setProfileSaveMsg] = useState<string | null>(null);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);

  // Payment Receipt Submission & Premium Upgrade Modal State
  const [showPremiumUpgradeModal, setShowPremiumUpgradeModal] =
    useState<boolean>(false);
  const [showApplicationStatusModal, setShowApplicationStatusModal] =
    useState<boolean>(false);
  const [isSubmittingPayment, setIsSubmittingPayment] =
    useState<boolean>(false);
  const [selectedPlanDuration, setSelectedPlanDuration] = useState<
    '1-month' | '1-year'
  >('1-month');
  const [payMethod, setPayMethod] = useState<
    'JazzCash' | 'EasyPaisa' | 'Bank Transfer'
  >('Bank Transfer');
  const [payTransactionId, setPayTransactionId] = useState<string>('');
  const [payAmount, setPayAmount] = useState<string>('Rs. 100');
  const [payNotes, setPayNotes] = useState<string>('');
  const [payReceiptUrl, setPayReceiptUrl] = useState<string>('');
  const [paySubmitBanner, setPaySubmitBanner] = useState<string | null>(null);

  // Admin Console Active Tab & Forms (Default to 'receipts' so payment approvals are immediately visible)
  const [adminTab, setAdminTab] = useState<
    'storage' | 'receipts' | 'opportunities'
  >('receipts');
  const [adminStatusBanner, setAdminStatusBanner] = useState<string | null>(
    null
  );
  // When Admin logs in, land directly in the dedicated Admin Control Panel unless opening a ?verify= QR certificate link
  const [adminPreviewUserMode, setAdminPreviewUserMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('verify') || params.get('cert')) {
        return true;
      }
    }
    return false;
  });

  // Admin Quick Add Job / Scholarship State
  const [adminOppType, setAdminOppType] = useState<'job' | 'scholarship'>(
    'job'
  );
  const [adminOppTitle, setAdminOppTitle] = useState<string>('');
  const [adminOppOrg, setAdminOppOrg] = useState<string>('');
  const [adminOppCountry, setAdminOppCountry] = useState<string>('Pakistan');
  const [adminOppLocation, setAdminOppLocation] =
    useState<string>('Lahore, Pakistan');
  const [adminOppCat, setAdminOppCat] = useState<string>('Quality & Safety');
  const [adminOppExpOrDeadline, setAdminOppExpOrDeadline] =
    useState<string>('2+ Years QA/QC');
  const [adminOppEmail, setAdminOppEmail] = useState<string>('');
  const [adminOppLink, setAdminOppLink] = useState<string>('');
  const [adminOppDesc, setAdminOppDesc] = useState<string>('');

  // Hire / Contact Modal State for Communities
  const [contactModalMember, setContactModalMember] = useState<HubUser | null>(
    null
  );
  const [contactCustomMsg, setContactCustomMsg] = useState<string>(
    'Assalam-o-Alaikum, I saw your Verified Specialist profile on Food Science Portal and would like to connect regarding a Food Science / QA opportunity.'
  );
  const [contactSentBanner, setContactSentBanner] = useState<string | null>(
    null
  );

  // Filters for /jobs: Specialization, Country, Category
  const [jobSpecFilter, setJobSpecFilter] = useState<string>('All');
  const [jobCountryFilter, setJobCountryFilter] = useState<string>('All');
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>('All');

  // Filters for /scholarships: Specialization, Country, Funding
  const [schSpecFilter, setSchSpecFilter] = useState<string>('All');
  const [schCountryFilter, setSchCountryFilter] = useState<string>('All');
  const [schFundingFilter, setSchFundingFilter] = useState<string>('All');

  // State for /search
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [searchTab, setSearchTab] = useState<
    'All' | 'Tools' | 'Jobs' | 'Scholarships' | 'Trainings' | 'Members'
  >('All');

  // State for /communities (Directory & Discussions)
  const [memberSearchQuery, setMemberSearchQuery] = useState<string>('');
  const [commSpecFilter, setCommSpecFilter] = useState<string>('All');
  const [commCountryFilter, setCommCountryFilter] = useState<string>('All');
  const [commExpFilter, setCommExpFilter] = useState<string>('All');
  const [onlyHireableFilter, setOnlyHireableFilter] = useState<boolean>(false);

  // File upload refs for /profile & /admin
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);
  const receiptInputRef = useRef<HTMLInputElement | null>(null);

  // Derive user's Membership Status directly from their Profile state:
  // Paid Member (when myProfile.isPaid === true), Free Member (when profile exists & !isPaid), or Guest
  const membershipStatus: DevRole = useMemo(() => {
    if (myProfile.isPaid || myProfile.isPremium) return 'Paid Member';
    if (hasSavedProfile && myProfile.name.trim()) return 'Free Member';
    return 'Guest';
  }, [myProfile.isPaid, myProfile.isPremium, myProfile.name, hasSavedProfile]);

  // Monitor real-time Firebase Authentication state and auto-persist user record in Firestore
  useEffect(() => {
    // Fast fallback timer so the loading screen never hangs on slow mobile connections
    const fastFallback = setTimeout(() => {
      setAuthLoading(false);
    }, 1200);

    const unsubscribeAuth = onAuthStateChanged(auth, async (rawFirebaseUser) => {
      if (rawFirebaseUser) {
        savePersistedAuthUser(rawFirebaseUser);
      }
      const firebaseUser = rawFirebaseUser || loadPersistedAuthUser();
      setAuthUser(firebaseUser);
      // Clear auth loading IMMEDIATELY so the user enters the app right away without waiting for Firestore network calls
      setAuthLoading(false);
      clearTimeout(fastFallback);

      if (firebaseUser) {
        const displayName =
          firebaseUser.displayName?.trim() ||
          firebaseUser.email?.split('@')[0] ||
          'Food Specialist';
        const initials =
          displayName
            .split(' ')
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase() || 'FS';
        const isAdminUser =
          firebaseUser.email?.toLowerCase() === 'mindmademedia9@gmail.com';
        const defaultAvatar =
          firebaseUser.photoURL || makeAvatarSvg(initials, '#EBF4FC', '#1673B8');

        const baseUserRecord: HubUser = {
          ...DEFAULT_CURRENT_USER_PROFILE,
          uid: firebaseUser.uid,
          name: displayName,
          email: firebaseUser.email || '',
          profilePhotoUrl: defaultAvatar,
          profilePicUrl: defaultAvatar,
          isAdmin: isAdminUser,
          isPaid: isAdminUser,
          isPremium: isAdminUser,
          plan: isAdminUser ? 'premium' : 'free',
          visibility: DEFAULT_VISIBILITY_MAP,
          createdAt: new Date().toISOString().slice(0, 19) + 'Z'
        };

        setMyProfile((prev) => ({
          ...prev,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName?.trim() || prev.name || displayName,
          email: firebaseUser.email || prev.email,
          isAdmin: isAdminUser || prev.isAdmin,
          profilePhotoUrl: prev.profilePhotoUrl || prev.profilePicUrl || defaultAvatar,
          profilePicUrl: prev.profilePicUrl || prev.profilePhotoUrl || defaultAvatar
        }));

        // Only query/write Firestore once the live Firebase Auth token is ready
        if (!rawFirebaseUser) {
          return;
        }

        // Check if user profile already exists in Firestore; hydrate both public doc and private owner vault in background
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const privateVaultRef = doc(db, 'users', firebaseUser.uid, 'private', 'profile');
        try {
          const [existingSnap, privateSnap] = await Promise.all([
            getDoc(userDocRef),
            getDoc(privateVaultRef)
          ]);

          if (existingSnap.exists() || privateSnap.exists()) {
            const publicData = (existingSnap.exists() ? existingSnap.data() : {}) as Partial<HubUser>;
            const privateData = (privateSnap.exists() ? privateSnap.data() : {}) as Partial<HubUser>;
            const mergedPrivacy: PrivacySettings = {
              ...DEFAULT_CURRENT_USER_PROFILE.privacySettings,
              ...(publicData.privacySettings || {}),
              ...(privateData.privacySettings || {})
            };
            const mergedVisibility: ProfileVisibilityMap = {
              ...DEFAULT_VISIBILITY_MAP,
              ...(publicData.visibility || {}),
              ...(privateData.visibility || {})
            };
            const rawExpiresAt =
              publicData.premiumExpiresAt || privateData.premiumExpiresAt || '';
            const isNotExpired =
              !rawExpiresAt ||
              Number.isNaN(new Date(rawExpiresAt).getTime()) ||
              new Date(rawExpiresAt).getTime() > Date.now();
            const isPaidOrPremium = Boolean(
              isAdminUser ||
                ((publicData.isPaid ||
                  publicData.isPremium ||
                  privateData.isPaid ||
                  privateData.isPremium) &&
                  isNotExpired)
            );
            const mergedTitle =
              privateData.title ||
              privateData.currentRole ||
              publicData.title ||
              publicData.currentRole ||
              '';
            const mergedAvatar =
              privateData.profilePhotoUrl ||
              privateData.profilePicUrl ||
              publicData.profilePhotoUrl ||
              publicData.profilePicUrl ||
              defaultAvatar;

            const mergedProfile: HubUser = {
              ...baseUserRecord,
              ...publicData,
              ...privateData,
              uid: firebaseUser.uid,
              name:
                privateData.name?.trim() ||
                publicData.name?.trim() ||
                firebaseUser.displayName?.trim() ||
                displayName,
              title: mergedTitle,
              currentRole: mergedTitle,
              profilePhotoUrl: mergedAvatar,
              profilePicUrl: mergedAvatar,
              email:
                privateData.email ||
                publicData.email ||
                firebaseUser.email ||
                '',
              phone: privateData.phone || publicData.phone || '',
              qualification:
                privateData.qualification || publicData.qualification || '',
              experience:
                privateData.experience ||
                publicData.experience ||
                [],
              education:
                privateData.education ||
                publicData.education ||
                [],
              certifications:
                privateData.certifications ||
                publicData.certifications ||
                [],
              projects:
                privateData.projects ||
                publicData.projects ||
                [],
              location: privateData.location || publicData.location || '',
              isPaid: isPaidOrPremium,
              isPremium: isPaidOrPremium,
              plan: isPaidOrPremium ? 'premium' : 'free',
              hireMe: Boolean(
                privateData.hireMe ??
                  publicData.hireMe ??
                  mergedPrivacy.hireMe_public ??
                  true
              ),
              profileCompleted: Boolean(
                privateData.profileCompleted ??
                  publicData.profileCompleted ??
                  Boolean(mergedTitle || privateData.bio || publicData.bio)
              ),
              profileVisibility:
                privateData.profileVisibility ??
                publicData.profileVisibility ??
                true,
              paymentStatus:
                publicData.paymentStatus || privateData.paymentStatus || 'none',
              isAdmin: isAdminUser || Boolean(publicData.isAdmin),
              visibility: mergedVisibility,
              privacySettings: mergedPrivacy,
              toolsData:
                privateData.toolsData ||
                publicData.toolsData ||
                DEFAULT_USER_TOOLS_DATA
            };
            setMyProfile(mergedProfile);
            setHasSavedProfile(true);
            await Promise.all([
              setDoc(privateVaultRef, mergedProfile, { merge: true }),
              setDoc(userDocRef, buildSanitizedPublicUser(mergedProfile), {
                merge: true
              })
            ]);
          } else {
            await Promise.all([
              setDoc(privateVaultRef, baseUserRecord, { merge: true }),
              setDoc(userDocRef, buildSanitizedPublicUser(baseUserRecord), {
                merge: true
              })
            ]);
            setMyProfile(baseUserRecord);
            setHasSavedProfile(true);
          }
        } catch (err) {
          try {
            handleFirestoreError(
              err,
              OperationType.WRITE,
              `users/${firebaseUser.uid}`
            );
          } catch {}
        }
      }
    });

    return () => {
      clearTimeout(fastFallback);
      unsubscribeAuth();
    };
  }, []);

  const [legalModalTab, setLegalModalTab] = useState<LegalTabType | null>(null);

  const handleSignOut = async () => {
    setShowSplashLogo(true);
    clearPersistedAuthUser();
    setAuthUser(null);
    try {
      await signOut(auth);
      setRoute({ name: 'home' });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleDeleteOwnAccount = async () => {
    const uid = authUser?.uid || myProfile.uid;
    clearPersistedAuthUser();
    if (!uid) {
      setAuthUser(null);
      return;
    }

    try {
      // 1. Delete user's own payment verification requests if any
      for (const req of myPaymentApplications) {
        if (req.id) {
          await deleteDoc(doc(db, 'paymentRequests', req.id)).catch(() => {});
        }
      }
      // 2. Delete user's private & profile subcollection docs and main public user document
      await deleteDoc(doc(db, 'users', uid, 'private', 'profile')).catch(() => {});
      await deleteDoc(doc(db, 'users', uid, 'profile', 'main')).catch(() => {});
      await deleteDoc(doc(db, 'users', uid)).catch(() => {});

      // 3. Delete Firebase Auth account if session is recent, then sign out cleanly
      if (auth.currentUser) {
        await auth.currentUser.delete().catch(() => {});
      }
      setAuthUser(null);
      await signOut(auth).catch(() => {});
      setRoute({ name: 'home' });
    } catch (err) {
      console.error('Account deletion error:', err);
      setAuthUser(null);
      await signOut(auth).catch(() => {});
      setRoute({ name: 'home' });
    }
  };

  // Real-time Firestore Listeners (Real Firestore data only — no placeholder users)
  useEffect(() => {
    if (!authUser || !auth.currentUser) return;
    const isAdminUser =
      authUser.email?.toLowerCase() === 'mindmademedia9@gmail.com';

    // Listen to current user's own document so admin approval of isPaid/isPremium reflects immediately
    const unsubMyDoc = onSnapshot(
      doc(db, 'users', authUser.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<HubUser>;
          const rawExpires = data.premiumExpiresAt || '';
          const notExpired =
            !rawExpires ||
            Number.isNaN(new Date(rawExpires).getTime()) ||
            new Date(rawExpires).getTime() > Date.now();
          const nextPaid = Boolean(
            isAdminUser || ((data.isPaid || data.isPremium) && notExpired)
          );
          setMyProfile((prev) => ({
            ...prev,
            isPaid: nextPaid,
            isPremium: nextPaid,
            plan: nextPaid ? 'premium' : 'free',
            paymentStatus: data.paymentStatus || prev.paymentStatus,
            subscriptionPlan: data.subscriptionPlan || prev.subscriptionPlan,
            premiumActivatedAt:
              data.premiumActivatedAt || prev.premiumActivatedAt,
            premiumExpiresAt: data.premiumExpiresAt || prev.premiumExpiresAt,
            toolsData: data.toolsData || prev.toolsData
          }));
        }
      },
      () => {}
    );

    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const fsUsers = snap.docs
          .map((d) => ({ ...(d.data() as HubUser), uid: d.id }))
          .filter((u) => Boolean(u.uid && u.name));
        setUsers(fsUsers);
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'users');
        } catch {}
      }
    );

    const unsubJobs = onSnapshot(
      collection(db, 'jobs'),
      (snap) => {
        const fsJobs = snap.docs.map((d) => ({
          ...(d.data() as HubJob),
          id: d.id
        }));
        setJobs(() => {
          const map = new Map<string, HubJob>();
          // Put custom/newly added jobs first (sorted newest first)
          fsJobs
            .filter((j) => !INITIAL_JOBS.some((ij) => ij.id === j.id))
            .sort((a, b) => b.id.localeCompare(a.id))
            .forEach((j) => map.set(j.id, j));
          INITIAL_JOBS.forEach((j) => map.set(j.id, j));
          fsJobs.forEach((j) => {
            const initMatch = INITIAL_JOBS.find((ij) => ij.id === j.id);
            if (initMatch) {
              map.set(j.id, { ...initMatch, ...j });
            }
          });
          return Array.from(map.values()).filter((j) => j.isActive);
        });
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'jobs');
        } catch {}
      }
    );

    const unsubSch = onSnapshot(
      collection(db, 'scholarships'),
      (snap) => {
        const fsSch = snap.docs.map((d) => ({
          ...(d.data() as HubScholarship),
          id: d.id
        }));
        setScholarships(() => {
          const map = new Map<string, HubScholarship>();
          fsSch
            .filter((s) => !INITIAL_SCHOLARSHIPS.some((is) => is.id === s.id))
            .sort((a, b) => b.id.localeCompare(a.id))
            .forEach((s) => map.set(s.id, s));
          INITIAL_SCHOLARSHIPS.forEach((s) => map.set(s.id, s));
          fsSch.forEach((s) => {
            const initMatch = INITIAL_SCHOLARSHIPS.find(
              (is) => is.id === s.id
            );
            if (initMatch) {
              map.set(s.id, { ...initMatch, ...s });
            }
          });
          return Array.from(map.values()).filter((s) => s.isActive);
        });
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'scholarships');
        } catch {}
      }
    );

    const unsubTr = onSnapshot(
      collection(db, 'trainings'),
      (snap) => {
        const fsTr = snap.docs
          .map((d) => ({
            ...(d.data() as HubTraining),
            id: d.id
          }))
          // Exclude pre-populated seed trainings so only custom Admin-created trainings appear
          .filter(
            (t) =>
              !t.id.startsWith('tr-hf-') &&
              !t.id.startsWith('tr-la-') &&
              !t.id.startsWith('tr-int-') &&
              !t.id.startsWith('tr-intl-') &&
              !t.id.startsWith('tr-haccp-level-4') &&
              !t.id.startsWith('course-') &&
              t.category !== 'Highfield' &&
              t.category !== 'Lead Auditor'
          );
        setTrainings(() => {
          const map = new Map<string, HubTraining>();
          INITIAL_TRAININGS.forEach((t) => map.set(t.id, t));
          fsTr.forEach((t) => {
            const initMatch = INITIAL_TRAININGS.find((it) => it.id === t.id);
            map.set(t.id, initMatch ? { ...initMatch, ...t } : t);
          });
          return Array.from(map.values());
        });
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'trainings');
        } catch {}
      }
    );

    const unsubCerts = onSnapshot(
      collection(db, 'certificates'),
      (snap) => {
        const list = snap.docs.map((d) => ({
          ...(d.data() as HubCertificate),
          id: d.id
        }));
        setCertificates(list);
      },
      () => {}
    );

    const unsubStorageCfg = onSnapshot(
      doc(db, 'settings', 'storageConfig'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as CloudStorageConfig;
          const hydrated: CloudStorageConfig = {
            provider: data.cloudinaryCloudName?.trim()
              ? data.provider
              : 'cloudinary',
            cloudinaryCloudName:
              data.cloudinaryCloudName?.trim() || 'mhjkrdlh',
            cloudinaryUploadPreset:
              data.cloudinaryUploadPreset?.trim() || 'Food Specialists',
            updatedAt: data.updatedAt || '2026-11-03T11:45:00Z',
            whatsappChannelUrl:
              data.whatsappChannelUrl?.trim() ||
              'https://whatsapp.com/channel/0029VaFoodSpecialists',
            whatsappChannelButtonText:
              data.whatsappChannelButtonText?.trim() ||
              'Follow WhatsApp Channel',
            paymentGateway: {
              jazzCashTitle:
                data.paymentGateway?.jazzCashTitle || 'Muneeb Khan',
              jazzCashNumber:
                data.paymentGateway?.jazzCashNumber || '0324-0906384',
              easyPaisaTitle:
                data.paymentGateway?.easyPaisaTitle || 'Muneeb Khan',
              easyPaisaNumber:
                data.paymentGateway?.easyPaisaNumber || '0324-0906384',
              bankTitle: data.paymentGateway?.bankTitle || 'Muneeb Khan',
              bankName:
                data.paymentGateway?.bankName || 'Allied Bank / Bank Transfer',
              bankAccountOrIban:
                data.paymentGateway?.bankAccountOrIban ||
                'Contact on WhatsApp for IBAN',
              bankWhatsapp:
                data.paymentGateway?.bankWhatsapp || '+92 324 0906384',
              monthlyFeeRs:
                data.paymentGateway?.monthlyFeeRs === 200 &&
                data.paymentGateway?.yearlyFeeRs === 1800 &&
                !data.paymentGateway?.customPriceUpdated
                  ? 100
                  : Number(data.paymentGateway?.monthlyFeeRs) || 100,
              yearlyFeeRs:
                data.paymentGateway?.monthlyFeeRs === 200 &&
                data.paymentGateway?.yearlyFeeRs === 1800 &&
                !data.paymentGateway?.customPriceUpdated
                  ? 900
                  : Number(data.paymentGateway?.yearlyFeeRs) || 900,
              customPriceUpdated: Boolean(
                data.paymentGateway?.customPriceUpdated
              )
            }
          };
          setStorageConfig(hydrated);
          if (
            isAdminUser &&
            data.paymentGateway?.monthlyFeeRs === 200 &&
            data.paymentGateway?.yearlyFeeRs === 1800 &&
            !data.paymentGateway?.customPriceUpdated
          ) {
            setDoc(doc(db, 'settings', 'storageConfig'), hydrated, {
              merge: true
            }).catch(() => {});
          }
        } else if (isAdminUser) {
          const defaultCfg: CloudStorageConfig = {
            provider: 'cloudinary',
            cloudinaryCloudName: 'mhjkrdlh',
            cloudinaryUploadPreset: 'Food Specialists',
            updatedAt: new Date().toISOString().slice(0, 19) + 'Z',
            whatsappChannelUrl:
              'https://whatsapp.com/channel/0029VaFoodSpecialists',
            whatsappChannelButtonText: 'Follow WhatsApp Channel',
            paymentGateway: {
              jazzCashTitle: 'Muneeb Khan',
              jazzCashNumber: '0324-0906384',
              easyPaisaTitle: 'Muneeb Khan',
              easyPaisaNumber: '0324-0906384',
              bankTitle: 'Muneeb Khan',
              bankName: 'Allied Bank / Bank Transfer',
              bankAccountOrIban: 'Contact on WhatsApp for IBAN',
              bankWhatsapp: '+92 324 0906384',
              monthlyFeeRs: 100,
              yearlyFeeRs: 900
            }
          };
          setDoc(doc(db, 'settings', 'storageConfig'), defaultCfg, {
            merge: true
          }).catch(() => {});
        }
      },
      () => {}
    );

    const payQuery = isAdminUser
      ? collection(db, 'paymentRequests')
      : query(
          collection(db, 'paymentRequests'),
          where('uid', '==', authUser.uid)
        );

    const unsubPay = onSnapshot(
      payQuery,
      (snap) => {
        const list = snap.docs.map((d) => ({
          ...(d.data() as HubPaymentRequest),
          id: d.id
        }));
        setPaymentRequests(list);
        // If any membership payment request for the current user was verified by Admin,
        // immediately activate their Premium status across Website and Mobile App
        const myApprovedMembership = list.find(
          (r) =>
            r.uid === authUser.uid &&
            r.status === 'verified' &&
            !r.certificateCourseId &&
            r.subscriptionPlan !== 'certificate_unlock'
        );
        if (myApprovedMembership) {
          setMyProfile((prev) => {
            if (prev.isPaid && prev.isPremium && prev.paymentStatus === 'verified') {
              return prev;
            }
            return {
              ...prev,
              isPaid: true,
              isPremium: true,
              plan: 'premium',
              paymentStatus: 'verified',
              premiumActivatedAt:
                myApprovedMembership.premiumActivatedAt ||
                prev.premiumActivatedAt ||
                new Date().toISOString(),
              premiumExpiresAt:
                myApprovedMembership.premiumExpiresAt || prev.premiumExpiresAt
            };
          });
        }
      },
      () => {}
    );

    return () => {
      unsubMyDoc();
      unsubUsers();
      unsubJobs();
      unsubSch();
      unsubTr();
      unsubCerts();
      unsubStorageCfg();
      unsubPay();
    };
  }, [authUser]);

  // PWA Mobile App Install State & Standalone Detection
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isStandaloneApp, setIsStandaloneApp] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  });
  const [showInstallAppModal, setShowInstallAppModal] = useState(false);
  const [installStatusMessage, setInstallStatusMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsStandaloneApp(true);
      setDeferredInstallPrompt(null);
      setInstallStatusMessage(
        'Food Science Portal App installed! You can now launch it anytime from your phone home screen.'
      );
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleTriggerNativeAppInstall = async () => {
    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        if (choiceResult?.outcome === 'accepted') {
          setInstallStatusMessage(
            'Installing Food Science Portal on your device...'
          );
          setDeferredInstallPrompt(null);
        }
      } catch {
        // Fallback to instructions inside modal
      }
    } else {
      setShowInstallAppModal(true);
    }
  };

  // Dynamic Time-of-Day Greeting (Morning / Afternoon / Evening)
  const timeOfDayGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Determine active BottomNav tab from current route
  const activeBottomTab: NavTab = useMemo(() => {
    switch (route.name) {
      case 'home':
      case 'jobs':
      case 'job-detail':
      case 'scholarships':
      case 'scholarship-detail':
      case 'search':
        return 'home';
      case 'tools':
        return 'tools';
      case 'communities':
      case 'community-member':
        return 'communities';
      case 'trainings':
      case 'trainings-highfield':
      case 'trainings-lead-auditor-hub':
      case 'training-detail':
        return 'trainings';
      case 'profile':
      case 'admin':
        return 'profile';
    }
  }, [route.name]);

  // Determine active Website Top Nav section from current route
  const activeWebsiteNav: WebsiteNavSection = useMemo(() => {
    switch (route.name) {
      case 'home':
      case 'search':
        return 'home';
      case 'jobs':
      case 'job-detail':
        return 'jobs';
      case 'scholarships':
      case 'scholarship-detail':
        return 'scholarships';
      case 'tools':
        return 'tools';
      case 'communities':
      case 'community-member':
        return 'communities';
      case 'trainings':
      case 'trainings-highfield':
      case 'trainings-lead-auditor-hub':
      case 'training-detail':
        return 'trainings';
      case 'profile':
      case 'admin':
        return 'profile';
    }
  }, [route.name]);

  const handleNavigateWebsiteSection = (section: WebsiteNavSection) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (section === 'home') setRoute({ name: 'home' });
    if (section === 'jobs') navigateToJobs('All');
    if (section === 'scholarships') navigateToScholarships('All');
    if (section === 'tools') {
      setActiveToolSection('hub');
      setToolsResetKey((k) => k + 1);
      setRoute({ name: 'tools', initialSection: 'hub' });
    }
    if (section === 'communities') setRoute({ name: 'communities' });
    if (section === 'trainings') setRoute({ name: 'trainings' });
    if (section === 'profile') setRoute({ name: 'profile' });
  };

  const handleSelectBottomTab = (tab: NavTab) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'home') setRoute({ name: 'home' });
    if (tab === 'tools') {
      setActiveToolSection('hub');
      setToolsResetKey((k) => k + 1);
      setRoute({ name: 'tools', initialSection: 'hub' });
    }
    if (tab === 'communities') setRoute({ name: 'communities' });
    if (tab === 'trainings') setRoute({ name: 'trainings' });
    if (tab === 'profile') setRoute({ name: 'profile' });
  };

  const navigateToJobs = (category = 'All') => {
    setJobCategoryFilter(category);
    setRoute({ name: 'jobs', categoryFilter: category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToScholarships = (funding = 'All') => {
    setSchFundingFilter(funding);
    setRoute({ name: 'scholarships', fundingFilter: funding });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAppliedJob = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAppliedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleToggleAppliedScholarship = (
    schId: string,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    setAppliedScholarshipIds((prev) =>
      prev.includes(schId) ? prev.filter((id) => id !== schId) : [...prev, schId]
    );
  };

  const handleToggleSavedScholarship = (schId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedScholarshipIds((prev) =>
      prev.includes(schId) ? prev.filter((id) => id !== schId) : [...prev, schId]
    );
  };

  // 1-Click Copy Generic Text Helper (Email / Phone / Link)
  const handleCopyText = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedId(identifier);
    setTimeout(() => {
      setCopiedId((prev) => (prev === identifier ? null : prev));
    }, 3500);
  };

  // 1-Click Copy Contact Email & Subject Helper
  const handleCopyEmailAndSubject = async (
    id: string,
    email: string,
    subject: string
  ) => {
    const formatted = `To: ${email}\nSubject: ${subject}`;
    try {
      await navigator.clipboard.writeText(formatted);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = formatted;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 3500);
  };

  // Share Opportunity Helper for Jobs and Scholarships (Native Web Share + Clipboard Fallback)
  const handleShareOpportunity = async (
    title: string,
    subtitle: string,
    url?: string
  ) => {
    const currentUrl = url || window.location.href;
    const shareData = {
      title: `${title} | Food Science Portal`,
      text: `${title}\n${subtitle}\n\nShared via Food Science Portal:`,
      url: currentUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: Copy opportunity details & link to clipboard
    const fullText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedId('share-link');
    setTimeout(() => {
      setCopiedId((prev) => (prev === 'share-link' ? null : prev));
    }, 3500);
  };

  // Helper: Check if a user's 1-month Premium subscription is currently active
  const isMemberPremiumActive = (u: Partial<HubUser>): boolean => {
    if (!u.isPaid && !u.isPremium) return false;
    if (u.premiumExpiresAt) {
      const expTime = new Date(u.premiumExpiresAt).getTime();
      if (!Number.isNaN(expTime) && expTime <= Date.now()) {
        return false;
      }
    }
    return true;
  };

  // Is Current User a Premium/Paid Member? (Driven by their Profile record or Admin status)
  const isCurrentUserPaid = Boolean(
    isMemberPremiumActive(myProfile) ||
      myProfile.isAdmin ||
      authUser?.email?.toLowerCase() === 'mindmademedia9@gmail.com'
  );

  // Detect if user previously had Paid Premium Membership that has now expired
  const hasExpiredPremium = Boolean(
    !isCurrentUserPaid &&
      (myProfile.isPaid ||
        myProfile.isPremium ||
        myProfile.paymentStatus === 'verified') &&
      myProfile.premiumExpiresAt &&
      new Date(myProfile.premiumExpiresAt).getTime() <= Date.now()
  );

  // Filtered Jobs for /jobs (Country + Category)
  const activeJobs = useMemo(() => jobs.filter((j) => j.isActive), [jobs]);

  // Dynamically extract unique countries from active jobs (auto-updates when any job is posted)
  const availableJobCountries = useMemo(() => {
    const set = new Set<string>();
    activeJobs.forEach((j) => {
      if (j.country?.trim()) set.add(j.country.trim());
      else if (j.location?.trim()) {
        const parts = j.location.split(',');
        const last = parts[parts.length - 1].trim();
        if (last) set.add(last);
      }
    });
    return Array.from(set).sort();
  }, [activeJobs]);

  // Dynamically extract unique categories/specializations from active jobs
  const availableJobCategories = useMemo(() => {
    const set = new Set<string>();
    activeJobs.forEach((j) => {
      if (j.category?.trim()) set.add(j.category.trim());
      if (j.specialization?.trim()) set.add(j.specialization.trim());
    });
    return Array.from(set).sort();
  }, [activeJobs]);

  const filteredJobs = useMemo(() => {
    return activeJobs.filter((j) => {
      if (jobCategoryFilter !== 'All') {
        const target = jobCategoryFilter.toLowerCase();
        const catMatch =
          j.category?.toLowerCase() === target ||
          j.specialization?.toLowerCase() === target ||
          j.tags?.some((t) => t.toLowerCase() === target);
        if (!catMatch) return false;
      }
      if (jobSpecFilter !== 'All') {
        const specMatch =
          j.specialization?.toLowerCase() === jobSpecFilter.toLowerCase() ||
          j.tags.some((t) =>
            t.toLowerCase().includes(jobSpecFilter.toLowerCase())
          );
        if (!specMatch) return false;
      }
      if (jobCountryFilter !== 'All') {
        const countryMatch =
          j.country?.toLowerCase().includes(jobCountryFilter.toLowerCase()) ||
          j.location.toLowerCase().includes(jobCountryFilter.toLowerCase());
        if (!countryMatch) return false;
      }
      return true;
    });
  }, [activeJobs, jobCategoryFilter, jobSpecFilter, jobCountryFilter]);

  // All jobs are visible to everyone without restriction (1-job limit removed)
  const visibleJobs = filteredJobs;
  const lockedJobs: HubJob[] = [];

  // Filtered Scholarships for /scholarships (Specialization + Country + Funding)
  const activeScholarships = useMemo(
    () => scholarships.filter((s) => s.isActive),
    [scholarships]
  );

  // Dynamically extract unique countries from active scholarships
  const availableScholarshipCountries = useMemo(() => {
    const set = new Set<string>();
    activeScholarships.forEach((s) => {
      if (s.country?.trim()) set.add(s.country.trim());
    });
    return Array.from(set).sort();
  }, [activeScholarships]);
  const filteredScholarships = useMemo(() => {
    return activeScholarships.filter((s) => {
      if (schFundingFilter !== 'All' && s.fundingType !== schFundingFilter) {
        return false;
      }
      if (schSpecFilter !== 'All') {
        const specMatch =
          s.specialization?.toLowerCase() === schSpecFilter.toLowerCase() ||
          s.title.toLowerCase().includes(schSpecFilter.toLowerCase()) ||
          s.description.toLowerCase().includes(schSpecFilter.toLowerCase());
        if (!specMatch) return false;
      }
      if (
        schCountryFilter !== 'All' &&
        !s.country.toLowerCase().includes(schCountryFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [activeScholarships, schFundingFilter, schSpecFilter, schCountryFilter]);

  // All scholarships are visible to everyone without restriction
  const visibleScholarships = filteredScholarships;
  const lockedScholarships: HubScholarship[] = [];

  // Part 4: Community Premium Profiles List
  // Show all Premium Users who have completed profile and set profileVisibility !== false
  const paidCommunityMembers = useMemo<HubUser[]>(() => {
    const list = users.filter(
      (u) =>
        isMemberPremiumActive(u) &&
        u.profileVisibility !== false &&
        Boolean(u.uid && u.name.trim())
    );
    if (
      isCurrentUserPaid &&
      myProfile.uid &&
      myProfile.name.trim() &&
      !list.some((u) => u.uid === myProfile.uid)
    ) {
      return [
        {
          ...myProfile,
          isPaid: true,
          isPremium: true,
          plan: 'premium' as const
        },
        ...list
      ];
    }
    return list;
  }, [users, isCurrentUserPaid, myProfile]);

  const availableCommunityLocations = useMemo(() => {
    const set = new Set<string>();
    paidCommunityMembers.forEach((u) => {
      if (u.location?.trim()) set.add(u.location.trim());
    });
    return Array.from(set).sort();
  }, [paidCommunityMembers]);

  const filteredMembers = useMemo(() => {
    return paidCommunityMembers.filter((u) => {
      const hireMeActive = Boolean(
        u.hireMe ?? u.privacySettings?.hireMe_public
      );
      if (onlyHireableFilter && !hireMeActive) {
        return false;
      }
      if (commCountryFilter !== 'All') {
        const locStr = `${u.location || ''} ${u.country || ''}`.toLowerCase();
        if (!locStr.includes(commCountryFilter.toLowerCase())) return false;
      }
      if (!memberSearchQuery.trim()) return true;
      const q = memberSearchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const roleStr = (u.title || u.currentRole || '').toLowerCase();
      const compStr = (u.company || '').toLowerCase();
      const locStr = (u.location || '').toLowerCase();
      return (
        matchName ||
        roleStr.includes(q) ||
        compStr.includes(q) ||
        locStr.includes(q)
      );
    });
  }, [
    paidCommunityMembers,
    memberSearchQuery,
    onlyHireableFilter,
    commCountryFilter
  ]);

  // Trainings Lists
  const highfieldTrainings = useMemo(
    () => trainings.filter((t) => t.isActive && t.category === 'Highfield'),
    [trainings]
  );

  const haccpTrainings = useMemo(
    () =>
      highfieldTrainings.filter((t) =>
        t.title.toLowerCase().includes('haccp')
      ),
    [highfieldTrainings]
  );

  const leadAuditorTrainings = useMemo(
    () => trainings.filter((t) => t.isActive && t.category === 'Lead Auditor'),
    [trainings]
  );

  // Built-in Specialist Tools Directory for Global Portal Search
  const searchablePortalTools = useMemo(
    () => [
      {
        id: 'e-numbers' as const,
        title: 'E-Numbers & Halal Instant Finder',
        category: 'Additives & Halal Database',
        description:
          'Search 400+ Codex E-numbers, INS codes, Halal/Haram/Mushbooh status, ADI limits, and functional classes.'
      },
      {
        id: 'exam' as const,
        title: 'Food Science & Safety Exam Prep (2,000+ MCQs)',
        category: 'Exam & PPSC/FPSC Prep',
        description:
          'Practice 2,000+ food technology, microbiology, dairy, meat, cereals, and food safety exam questions.'
      },
      {
        id: 'interview' as const,
        title: 'QA/QC & Food Industry Interview Q&A Bank',
        category: 'Career & Interview Prep',
        description:
          'Master 2,000+ technical interview questions for QA/QC, Production, R&D, HACCP, and ISO 22000 roles.'
      },
      {
        id: 'nutrition' as const,
        title: 'Clinical Nutrition, BMI, BMR & Meal Planner Suite',
        category: 'Nutrition & Dietetics',
        description:
          'Calculate BMI, BMR, TDEE, macronutrient targets, daily meal plans, and export clinical nutrition PDFs.'
      },
      {
        id: 'lab-formula' as const,
        title: 'Food Lab Formula & Titration Calculator',
        category: 'Laboratory Calculators',
        description:
          'Compute acidity, Brix-to-acid ratio, protein Kjeldahl factor, salt %, and standard lab formulations.'
      },
      {
        id: 'pearson-square' as const,
        title: 'Pearson Square Batch & Milk Standardization Tool',
        category: 'Dairy & Batch Blending',
        description:
          'Standardize milk fat/SNF, juice Brix, and two-ingredient batch blending ratios accurately.'
      },
      {
        id: 'molarity-normality' as const,
        title: 'Lab Solution Molarity, Normality & Dilution Calculator',
        category: 'Chemical Solutions',
        description:
          'Prepare exact molar, normal, and ppm reagent solutions and C1V1 = C2V2 dilutions for food analysis.'
      },
      {
        id: 'moisture-ash' as const,
        title: 'Moisture, Ash, Dry Matter & Process Yield Calculator',
        category: 'Proximate Analysis',
        description:
          'Calculate wet/dry basis moisture %, total ash %, fat extraction, and production line yield.'
      },
      {
        id: 'production-floor' as const,
        title: 'Production Floor Sanitizer ppm, Line Speed & OEE Tool',
        category: 'Plant Operations & Sanitation',
        description:
          'Calculate chlorine/QAC sanitizer ppm dosing, CIP flow rates, thermal pasteurization lethality, and OEE.'
      },
      {
        id: 'job-cover-letter' as const,
        title: 'Food Industry Job Application Email & Cover Letter Generator',
        category: 'Career Tools',
        description:
          'Generate tailored QA/QC, Food Safety, Production, and R&D cover letters and HR application emails.'
      },
      {
        id: 'citation-generator' as const,
        title: 'Scientific Research Citation & Reference Generator (APA / Harvard)',
        category: 'Academic & Research',
        description:
          'Format food science journal articles, thesis references, and Codex standards in APA, Harvard, and Vancouver styles.'
      }
    ],
    []
  );

  // Global Search Results for /search (Searches across Tools, Jobs, Scholarships, Trainings & Verified Paid Specialists)
  const searchResults = useMemo(() => {
    const q = globalSearchQuery.trim().toLowerCase();
    const matchedTools = searchablePortalTools.filter(
      (tool) =>
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q)
    );
    const matchedJobs = visibleJobs.filter(
      (j) =>
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        (j.category && j.category.toLowerCase().includes(q)) ||
        (j.description && j.description.toLowerCase().includes(q))
    );
    const matchedScholarships = visibleScholarships.filter(
      (s) =>
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        (s.fundingType && s.fundingType.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
    const matchedTrainings = trainings.filter(
      (t) =>
        t.isActive &&
        (!q ||
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.subType && t.subType.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)))
    );
    // Strict Free vs Paid Privacy:
    // 1. Only verified Paid members (paidCommunityMembers) are ever included — free users never appear.
    // 2. Never match or expose private contact details (email, phone, whatsappNumber) in search!
    const matchedMembers = paidCommunityMembers.filter((u) => {
      if (!q) return true;
      const vis = u.visibility;
      const canSeeName = (vis?.name ?? 'public') !== 'private';
      const canSeeTitle =
        (vis?.title ??
          (u.privacySettings?.currentRole_public === false
            ? 'private'
            : 'public')) !== 'private';
      const canSeeCompany = (vis?.company ?? 'public') !== 'private';
      const canSeeLocation =
        (vis?.location ??
          (u.privacySettings?.location_public === false
            ? 'private'
            : 'public')) !== 'private';
      return (
        (canSeeName && u.name.toLowerCase().includes(q)) ||
        (canSeeTitle && (u.title || u.currentRole || '').toLowerCase().includes(q)) ||
        (canSeeCompany && (u.company || '').toLowerCase().includes(q)) ||
        (canSeeLocation && (u.location || '').toLowerCase().includes(q))
      );
    });
    return {
      tools: matchedTools,
      jobs: matchedJobs,
      scholarships: matchedScholarships,
      trainings: matchedTrainings,
      members: matchedMembers
    };
  }, [
    globalSearchQuery,
    searchablePortalTools,
    visibleJobs,
    visibleScholarships,
    trainings,
    paidCommunityMembers
  ]);

  const stripUndefinedDeep = <T,>(input: T): T => {
    if (Array.isArray(input)) {
      return input.map((item) => stripUndefinedDeep(item)) as unknown as T;
    }
    if (input !== null && typeof input === 'object') {
      const cleaned: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
        if (v !== undefined) {
          cleaned[k] = stripUndefinedDeep(v);
        }
      }
      return cleaned as T;
    }
    return input;
  };

  // Persist both full private vault (/users/{uid}/private/profile, /users/{uid}/profile/main) and sanitized public profile (/users/{uid})
  const persistUserProfileToFirestore = async (fullUser: HubUser) => {
    const cleanFullUser = stripUndefinedDeep(fullUser);
    const sanitizedPublic = stripUndefinedDeep(buildSanitizedPublicUser(cleanFullUser));
    setUsers((prev) => {
      const exists = prev.some((u) => u.uid === sanitizedPublic.uid);
      if (exists) {
        return prev.map((u) =>
          u.uid === sanitizedPublic.uid ? sanitizedPublic : u
        );
      }
      return [sanitizedPublic, ...prev];
    });

    if (!authUser || !auth.currentUser) {
      return;
    }

    try {
      await Promise.all([
        setDoc(
          doc(db, 'users', cleanFullUser.uid, 'private', 'profile'),
          cleanFullUser,
          { merge: true }
        ),
        setDoc(
          doc(db, 'users', cleanFullUser.uid, 'profile', 'main'),
          sanitizedPublic,
          { merge: true }
        ),
        setDoc(doc(db, 'users', cleanFullUser.uid), sanitizedPublic, {
          merge: true
        })
      ]);
    } catch (err) {
      try {
        handleFirestoreError(
          err,
          OperationType.WRITE,
          `users/${cleanFullUser.uid}`
        );
      } catch {}
    }
  };

  // Profile Save Handler for Rebuilt EditProfileView
  const handleSaveProfileModel = async (updatedFromEditor: HubUser) => {
    const cleanUid =
      authUser?.uid ||
      updatedFromEditor.uid ||
      'user-' +
        (updatedFromEditor.name || 'specialist')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .slice(0, 60);

    const updatedUser: HubUser = {
      ...updatedFromEditor,
      uid: cleanUid,
      name: updatedFromEditor.name.trim() || 'Food Safety Specialist',
      isPaid: isCurrentUserPaid,
      isPremium: isCurrentUserPaid,
      plan: isCurrentUserPaid ? 'premium' : 'free',
      profileCompleted: true,
      profileVisibility: true,
      createdAt:
        updatedFromEditor.createdAt || new Date().toISOString().slice(0, 19) + 'Z'
    };

    setHasSavedProfile(true);
    setMyProfile(updatedUser);
    await persistUserProfileToFirestore(updatedUser);

    setProfileSaveMsg(
      'Profile & visibility settings saved to Cloud Firestore!'
    );
    setTimeout(() => setProfileSaveMsg(null), 4500);
  };

  // Save User's Nutrition, Exam Prep & Interview Prep Tools Data to Profile Control Panel in Cloud Firestore
  const handleSaveUserToolsData = async (updatedToolsData: UserToolsData) => {
    const cleanUid = authUser?.uid || myProfile.uid;
    if (!cleanUid) return;
    const updatedUser: HubUser = {
      ...myProfile,
      uid: cleanUid,
      toolsData: updatedToolsData
    };
    setMyProfile(updatedUser);
    await persistUserProfileToFirestore(updatedUser);
  };

  // Save User's Training Course Progress (Module Tracking + 40-MCQ Exam Score + Resume Point)
  const handleSaveCourseProgress = async (
    courseId: string,
    _updatedProgress: UserCourseProgress,
    allProgress: Record<string, UserCourseProgress>
  ) => {
    const cleanUid = authUser?.uid || myProfile.uid;
    if (!cleanUid) return;
    const baseTools: UserToolsData =
      myProfile.toolsData || DEFAULT_USER_TOOLS_DATA;
    const updatedToolsData: UserToolsData = {
      ...baseTools,
      courseProgress: allProgress,
      lastActiveCourseId: courseId
    };
    const updatedUser: HubUser = {
      ...myProfile,
      uid: cleanUid,
      toolsData: updatedToolsData
    };
    setMyProfile(updatedUser);
    await persistUserProfileToFirestore(updatedUser);
  };

  // Submit Certificate Download & Online Verification Request to Admin (Rs. 8,000 for Certified Dietary Manager; Rs. 1,000 for other courses)
  const handleSubmitCertificatePaymentRequest = async (params: {
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
  }) => {
    if (!authUser) {
      setShowGuestAuthModal(true);
      return;
    }
    const cleanUid = authUser?.uid || myProfile.uid;
    if (!cleanUid) return;
    const nowIso = new Date().toISOString().slice(0, 19) + 'Z';
    const reqId = `certpay-${cleanUid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 14)}-${Date.now()}`;
    const feeRs =
      params.amountRs ||
      (params.courseId === 'mgr-food-dietary-2026' ||
      params.courseTitle.toLowerCase().includes('dietary')
        ? 8000
        : 1000);

    const payload: HubPaymentRequest = {
      id: reqId,
      uid: cleanUid,
      userName: myProfile.name || authUser?.displayName || 'Food Specialist',
      userEmail: myProfile.email || authUser?.email || '',
      userPhone: myProfile.phone || '',
      qualification: myProfile.qualification || '',
      currentRole: myProfile.title || myProfile.currentRole || '',
      paymentMethod: params.paymentMethod,
      transactionId: params.transactionId.trim() || `CERT-FEE-${feeRs}`,
      amount: `Rs. ${feeRs.toLocaleString()} (Certificate Fee)`,
      notes:
        params.notes.trim() ||
        `Certificate Unlock: ${params.courseTitle} (${params.certificateNumber}) — Score: ${params.scorePercentage}%`,
      receiptImageUrl: params.receiptImageUrl || '',
      status: 'pending',
      submittedAt: nowIso,
      subscriptionPlan: 'certificate_unlock',
      certificateCourseId: params.courseId,
      certificateCourseTitle: params.courseTitle,
      certificateNumber: params.certificateNumber
    };

    try {
      await setDoc(doc(db, 'paymentRequests', reqId), payload);
      setPaymentRequests((prev) => [
        payload,
        ...prev.filter((r) => r.id !== payload.id)
      ]);
    } catch (err) {
      try {
        handleFirestoreError(
          err,
          OperationType.WRITE,
          `paymentRequests/${reqId}`
        );
      } catch {}
    }
  };

  const isUserAdmin = Boolean(
    myProfile.isAdmin ||
      authUser?.email?.toLowerCase() === 'mindmademedia9@gmail.com'
  );

  const handleUploadAvatarFile = async (file: File) => {
    setIsUploadingMedia(true);
    try {
      const result = await uploadMediaFile(file, 'avatars', storageConfig);
      const updated: HubUser = {
        ...myProfile,
        uid: authUser?.uid || myProfile.uid,
        profilePhotoUrl: result.url,
        profilePicUrl: result.url
      };
      setMyProfile(updated);
      await persistUserProfileToFirestore(updated);
      setUploadStatusMsg(
        `Profile photo uploaded (${result.sizeKb} KB)!`
      );
      setTimeout(() => setUploadStatusMsg(null), 4000);
    } catch {
      setUploadStatusMsg('Could not process image. Please try another photo.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleUploadCvFile = async (file: File) => {
    setIsUploadingMedia(true);
    try {
      const result = await uploadMediaFile(file, 'cvs', storageConfig);
      const sizeLabel = formatFileSizeLabel(file.size);
      const nowIso = new Date().toISOString().slice(0, 19) + 'Z';
      const updated: HubUser = {
        ...myProfile,
        uid: authUser?.uid || myProfile.uid,
        cvUrl: result.url,
        cvFileName: file.name,
        cvFileSize: sizeLabel,
        cvUploadedAt: nowIso
      };
      setMyProfile(updated);
      await persistUserProfileToFirestore(updated);
      setUploadStatusMsg(
        `CV uploaded (${file.name} • ${sizeLabel})!`
      );
      setTimeout(() => setUploadStatusMsg(null), 4000);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleDeleteCvFile = async () => {
    const updated: HubUser = {
      ...myProfile,
      uid: authUser?.uid || myProfile.uid,
      cvUrl: '',
      cvFileName: '',
      cvFileSize: '',
      cvUploadedAt: ''
    };
    setMyProfile(updated);
    await persistUserProfileToFirestore(updated);
    setUploadStatusMsg('CV removed from your profile.');
    setTimeout(() => setUploadStatusMsg(null), 3500);
  };

  const handlePaymentReceiptUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMedia(true);
    try {
      const result = await uploadMediaFile(file, 'receipts', storageConfig);
      setPayReceiptUrl(result.url);
      setPaySubmitBanner(
        `Payment screenshot attached (${result.sizeKb} KB). Click "Submit Payment Screenshot" below to send your request to Admin.`
      );
    } catch {
      setPaySubmitBanner('Failed to attach screenshot image. Please try again.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const myPaymentApplications = useMemo<HubPaymentRequest[]>(() => {
    const ownList = paymentRequests
      .filter((r) => r.uid === (authUser?.uid || myProfile.uid))
      .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));

    if (ownList.length > 0) return ownList;

    if (myProfile.paymentStatus && myProfile.paymentStatus !== 'none') {
      return [
        {
          id: `app-${myProfile.uid || 'user'}`,
          uid: myProfile.uid,
          userName: myProfile.name || 'Food Specialist',
          userEmail: myProfile.email || '',
          userPhone: myProfile.phone || '',
          qualification: myProfile.qualification || '',
          currentRole: myProfile.title || myProfile.currentRole || '',
          paymentMethod:
            (myProfile.paymentMethod as
              | 'JazzCash'
              | 'EasyPaisa'
              | 'Bank Transfer') || 'JazzCash',
          transactionId: myProfile.paymentReference || 'SCREENSHOT-UPLOADED',
          amount: myProfile.paymentAmount || 'Rs. 100 (1 Month)',
          notes: '1 Month Premium Subscription (Rs. 100)',
          receiptImageUrl: myProfile.receiptImageUrl || payReceiptUrl || '',
          status: myProfile.paymentStatus as 'pending' | 'verified' | 'rejected',
          submittedAt:
            myProfile.createdAt || new Date().toISOString().slice(0, 19) + 'Z',
          subscriptionPlan: myProfile.subscriptionPlan || '1 Month (Rs. 100)',
          approvedAt: myProfile.premiumActivatedAt || '',
          premiumExpiresAt: myProfile.premiumExpiresAt || ''
        }
      ];
    }

    return [];
  }, [paymentRequests, authUser?.uid, myProfile, payReceiptUrl]);

  const myLatestApplication = myPaymentApplications[0] || null;

  useEffect(() => {
    preloadUserAvatarForPdf(myProfile.profilePicUrl);
    users.forEach((u) => {
      if (u.profilePicUrl) {
        preloadUserAvatarForPdf(u.profilePicUrl);
      }
    });
  }, [myProfile.profilePicUrl, users]);

  const [deletedPaymentReqIds, setDeletedPaymentReqIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fsp_deleted_payment_reqs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // All payment requests for Admin (combines /paymentRequests collection + any /users doc with paymentStatus/receiptImageUrl)
  const adminAllPaymentRequests = useMemo<HubPaymentRequest[]>(() => {
    const deletedSet = new Set(deletedPaymentReqIds);
    const map = new Map<string, HubPaymentRequest>();
    paymentRequests.forEach((req) => {
      if (!deletedSet.has(req.id) && !deletedSet.has(`user-pay-${req.uid}`)) {
        map.set(req.id, req);
      }
    });
    users.forEach((u) => {
      const fallbackId = `user-pay-${u.uid}`;
      if (deletedSet.has(fallbackId)) return;
      if (
        (u.paymentStatus && u.paymentStatus !== 'none') ||
        Boolean(u.receiptImageUrl)
      ) {
        const hasExistingForUid = Array.from(map.values()).some(
          (r) => r.uid === u.uid
        );
        if (!hasExistingForUid) {
          map.set(fallbackId, {
            id: fallbackId,
            uid: u.uid,
            userName: u.name || 'Food Specialist',
            userEmail: u.email || '',
            userPhone: u.phone || '',
            qualification: u.qualification || '',
            currentRole: u.title || u.currentRole || '',
            paymentMethod:
              (u.paymentMethod as 'JazzCash' | 'EasyPaisa' | 'Bank Transfer') ||
              'JazzCash',
            transactionId: u.paymentReference || 'SCREENSHOT-UPLOADED',
            amount: u.paymentAmount || 'Rs. 100 (1 Month)',
            notes: '1 Month Premium Subscription (Rs. 100)',
            receiptImageUrl: u.receiptImageUrl || '',
            status:
              (u.paymentStatus as 'pending' | 'verified' | 'rejected') ||
              'pending',
            submittedAt: u.createdAt || '',
            subscriptionPlan: u.subscriptionPlan || '1 Month (Rs. 100)',
            approvedAt: u.premiumActivatedAt || '',
            premiumExpiresAt: u.premiumExpiresAt || ''
          });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return (b.submittedAt || '').localeCompare(a.submittedAt || '');
    });
  }, [paymentRequests, users, deletedPaymentReqIds]);

  const pendingPaymentRequestsCount = useMemo(
    () =>
      adminAllPaymentRequests.filter((r) => r.status === 'pending').length,
    [adminAllPaymentRequests]
  );

  // Live Payment Gateway Fees & Auto-Calculated Discount % (Editable from Admin Control Panel)
  const liveGateway = useMemo(() => {
    const monthlyFeeRs =
      Number(storageConfig.paymentGateway?.monthlyFeeRs) || 100;
    const yearlyFeeRs =
      Number(storageConfig.paymentGateway?.yearlyFeeRs) || 900;
    const fullYearBase = monthlyFeeRs * 12;
    const yearlyDiscountPct =
      fullYearBase > 0
        ? Math.max(
            0,
            Math.round(((fullYearBase - yearlyFeeRs) / fullYearBase) * 100)
          )
        : 25;
    return {
      jazzCashTitle:
        storageConfig.paymentGateway?.jazzCashTitle || 'Muneeb Khan',
      jazzCashNumber:
        storageConfig.paymentGateway?.jazzCashNumber || '0324-0906384',
      easyPaisaTitle:
        storageConfig.paymentGateway?.easyPaisaTitle || 'Muneeb Khan',
      easyPaisaNumber:
        storageConfig.paymentGateway?.easyPaisaNumber || '0324-0906384',
      bankTitle: storageConfig.paymentGateway?.bankTitle || 'Muneeb Khan',
      bankName:
        storageConfig.paymentGateway?.bankName || 'Allied Bank / Bank Transfer',
      bankAccountOrIban:
        storageConfig.paymentGateway?.bankAccountOrIban ||
        'Contact on WhatsApp for IBAN',
      bankWhatsapp:
        storageConfig.paymentGateway?.bankWhatsapp || '+92 324 0906384',
      monthlyFeeRs,
      yearlyFeeRs,
      yearlyDiscountPct
    };
  }, [storageConfig.paymentGateway]);

  // Last 5 Days Expiry Countdown for Paid Premium Members
  const globalPremiumCountdown = useMemo(() => {
    if (!isCurrentUserPaid || !myProfile.premiumExpiresAt) return null;
    const endMs = new Date(myProfile.premiumExpiresAt).getTime();
    if (isNaN(endMs)) return null;
    const diffMs = endMs - Date.now();
    if (diffMs <= 0) return null;
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (daysLeft < 1 || daysLeft > 5) return null;
    const formattedEndDate = new Date(
      myProfile.premiumExpiresAt
    ).toLocaleDateString('en-PK', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return { daysLeft, formattedEndDate };
  }, [isCurrentUserPaid, myProfile.premiumExpiresAt]);

  const handleSubmitPaymentVerification = async () => {
    if (!authUser) {
      setShowPremiumUpgradeModal(false);
      setShowGuestAuthModal(true);
      return;
    }
    if (isSubmittingPayment) return;
    const chosenFee =
      selectedPlanDuration === '1-year'
        ? liveGateway.yearlyFeeRs
        : liveGateway.monthlyFeeRs;
    const chosenAmountLabel =
      selectedPlanDuration === '1-year'
        ? `Rs. ${chosenFee.toLocaleString()} (1 Year - 25% OFF)`
        : `Rs. ${chosenFee.toLocaleString()} (1 Month)`;
    const chosenPlanLabel =
      selectedPlanDuration === '1-year'
        ? `1 Year (Rs. ${chosenFee.toLocaleString()} - 25% OFF)`
        : `1 Month (Rs. ${chosenFee.toLocaleString()})`;

    if (!payTransactionId.trim()) {
      setPaySubmitBanner(
        `Please enter your Transaction ID / Reference No. (TID) after sending Rs. ${chosenFee.toLocaleString()}.`
      );
      return;
    }

    if (!payReceiptUrl) {
      setPaySubmitBanner(
        `Please upload your Payment Screenshot along with your Transaction ID / Reference No. (${payTransactionId.trim()}) so the Admin can verify and approve your Premium access.`
      );
      return;
    }

    setIsSubmittingPayment(true);
    const reqId = `pay-${authUser.uid.slice(0, 18)}-${Date.now()}`;
    const contactPhone = (
      myProfile.whatsappNumber ||
      myProfile.phone ||
      ''
    ).trim();
    const payload: HubPaymentRequest = {
      id: reqId,
      uid: authUser.uid,
      userName: myProfile.name || authUser.displayName || 'Food Specialist',
      userEmail: myProfile.email || authUser.email || '',
      userPhone: contactPhone,
      qualification: myProfile.qualification || '',
      currentRole: myProfile.title || myProfile.currentRole || '',
      userQualification: myProfile.qualification || '',
      userCurrentRole: myProfile.title || myProfile.currentRole || '',
      paymentMethod: payMethod,
      transactionId: payTransactionId.trim(),
      amount: chosenAmountLabel,
      notes: payNotes.trim() || `${chosenPlanLabel} Premium Subscription`,
      receiptImageUrl: payReceiptUrl,
      status: 'pending',
      submittedAt: new Date().toISOString().slice(0, 19) + 'Z',
      subscriptionPlan: chosenPlanLabel
    };

    try {
      await setDoc(doc(db, 'paymentRequests', reqId), payload);
      const updatedUser: HubUser = {
        ...myProfile,
        uid: authUser.uid,
        paymentStatus: 'pending',
        paymentMethod: payMethod,
        paymentReference: payload.transactionId,
        paymentAmount: chosenAmountLabel,
        subscriptionPlan: chosenPlanLabel,
        receiptImageUrl: payReceiptUrl || myProfile.receiptImageUrl || ''
      };
      setMyProfile(updatedUser);
      setPaymentRequests((prev) => [
        payload,
        ...prev.filter((r) => r.id !== payload.id)
      ]);
      await persistUserProfileToFirestore(updatedUser);
      setPaySubmitBanner(null);
      setPayTransactionId('');
      setPayNotes('');
      // Close the payment popup and open the Application Under Review & Status window
      setShowPremiumUpgradeModal(false);
      setShowApplicationStatusModal(true);
    } catch (err) {
      try {
        handleFirestoreError(
          err,
          OperationType.WRITE,
          `paymentRequests/${reqId}`
        );
      } catch {}
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleAdminVerifyPayment = async (
    req: HubPaymentRequest,
    decision: 'verified' | 'rejected'
  ) => {
    try {
      const now = new Date();
      const nowIso = now.toISOString().slice(0, 19) + 'Z';
      const isCertRequest = Boolean(
        req.certificateCourseId ||
          req.subscriptionPlan === 'certificate_unlock' ||
          (req.amount || '').toLowerCase().includes('certificate')
      );

      if (isCertRequest) {
        const updatedReqObj: HubPaymentRequest = {
          ...req,
          status: decision,
          approvedAt: decision === 'verified' ? nowIso : ''
        };
        setPaymentRequests((prev) => {
          const exists = prev.some((r) => r.id === req.id);
          if (exists) {
            return prev.map((r) => (r.id === req.id ? updatedReqObj : r));
          }
          return [updatedReqObj, ...prev];
        });

        try {
          await setDoc(doc(db, 'paymentRequests', req.id), updatedReqObj, {
            merge: true
          });
        } catch {}

        const userSnap = await getDoc(doc(db, 'users', req.uid));
        const baseUser = userSnap.exists()
          ? (userSnap.data() as HubUser)
          : ({
              ...DEFAULT_CURRENT_USER_PROFILE,
              uid: req.uid,
              name: req.userName || 'Food Specialist',
              email: req.userEmail || '',
              phone: req.userPhone || ''
            } as HubUser);

        const courseId = req.certificateCourseId || 'int-tr-01';
        const matchedCourse = INTERNATIONAL_TRAINING_COURSES.find(
          (c) => c.id === courseId
        );
        const baseTools: UserToolsData =
          baseUser.toolsData || DEFAULT_USER_TOOLS_DATA;
        const existingCourseProg = baseTools.courseProgress?.[courseId];
        const certNumber =
          req.certificateNumber ||
          existingCourseProg?.certificateNumber ||
          `FSP-${matchedCourse?.code || 'CERT'}-${req.uid.slice(0, 5).toUpperCase()}`;

        const isAllCertBundle =
          (req.certificateCourseTitle || '').toLowerCase().includes('all 13') ||
          (req.notes || '').toLowerCase().includes('all 13') ||
          (req.notes || '').includes('9,500') ||
          (req.notes || '').includes('9500') ||
          (req.amount || '').includes('9,500') ||
          (req.amount || '').includes('9500');

        const bonusDays = isAllCertBundle ? 365 : 30;
        const existingExpMs = baseUser.premiumExpiresAt
          ? new Date(baseUser.premiumExpiresAt).getTime()
          : 0;
        const baseStartMs =
          !isNaN(existingExpMs) && existingExpMs > now.getTime()
            ? existingExpMs
            : now.getTime();
        const bonusExpiresIso =
          new Date(baseStartMs + bonusDays * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 19) + 'Z';

        const updatedCourseProg: UserCourseProgress = {
          courseId,
          courseTitle:
            req.certificateCourseTitle ||
            existingCourseProg?.courseTitle ||
            matchedCourse?.title ||
            'International Certification',
          completedModuleIds: existingCourseProg?.completedModuleIds || [],
          lastModuleIndex: existingCourseProg?.lastModuleIndex || 0,
          lastAccessedAt: existingCourseProg?.lastAccessedAt || nowIso,
          bestExamScore: existingCourseProg?.bestExamScore || 32,
          bestExamTotal: existingCourseProg?.bestExamTotal || 40,
          bestExamPercentage: existingCourseProg?.bestExamPercentage || 80,
          examPassed: true,
          distinctionEarned: Boolean(
            (existingCourseProg?.bestExamPercentage || 80) >= 75
          ),
          examCompletedAt: existingCourseProg?.examCompletedAt || nowIso,
          certificateNumber: certNumber,
          certificateFeePaid: decision === 'verified',
          certificateFeePending: false,
          ...(decision === 'verified' ? { certificateUnlockedAt: nowIso } : {})
        };

        const nextCourseProgressMap: Record<string, UserCourseProgress> = {
          ...(baseTools.courseProgress || {}),
          [courseId]: updatedCourseProg
        };

        if (decision === 'verified' && isAllCertBundle) {
          for (const c of INTERNATIONAL_TRAINING_COURSES) {
            const prevProg = nextCourseProgressMap[c.id];
            const cCertNo =
              prevProg?.certificateNumber ||
              `FSP-${c.code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${req.uid
                .replace(/[^a-zA-Z0-9]/g, '')
                .toUpperCase()
                .slice(0, 5)}`;
            nextCourseProgressMap[c.id] = {
              courseId: c.id,
              courseTitle: c.title,
              completedModuleIds:
                prevProg?.completedModuleIds && prevProg.completedModuleIds.length > 0
                  ? prevProg.completedModuleIds
                  : c.modules.map((m) => m.id),
              lastModuleIndex: prevProg?.lastModuleIndex || 0,
              lastAccessedAt: prevProg?.lastAccessedAt || nowIso,
              bestExamScore: prevProg?.bestExamScore || 34,
              bestExamTotal: 40,
              bestExamPercentage: prevProg?.bestExamPercentage || 85,
              examPassed: true,
              distinctionEarned: true,
              examCompletedAt: prevProg?.examCompletedAt || nowIso,
              certificateNumber: cCertNo,
              certificateFeePaid: true,
              certificateFeePending: false,
              certificateUnlockedAt: nowIso
            };
          }
        }

        const updatedUser: HubUser = {
          ...baseUser,
          uid: req.uid,
          name: baseUser.name || req.userName || 'Food Specialist',
          ...(decision === 'verified'
            ? {
                isPaid: true,
                isPremium: true,
                plan: 'premium',
                paymentStatus: 'verified',
                premiumActivatedAt: nowIso,
                premiumExpiresAt: bonusExpiresIso,
                subscriptionPlan: isAllCertBundle
                  ? '1 Year Free Paid Membership (All-13 Certificates Bundle)'
                  : '1 Month Free Paid Membership (Certificate Unlock Bonus)'
              }
            : {}),
          toolsData: {
            ...baseTools,
            courseProgress: nextCourseProgressMap
          }
        };

        setUsers((prev) =>
          prev.map((u) => (u.uid === req.uid ? updatedUser : u))
        );
        if (myProfile.uid === req.uid) {
          setMyProfile(updatedUser);
        }

        const cleanUserForFirestore = stripUndefinedDeep(updatedUser);
        await Promise.all([
          setDoc(doc(db, 'users', req.uid), cleanUserForFirestore, { merge: true }),
          setDoc(doc(db, 'users', req.uid, 'private', 'profile'), cleanUserForFirestore, {
            merge: true
          }),
          setDoc(doc(db, 'users', req.uid, 'profile', 'main'), cleanUserForFirestore, {
            merge: true
          })
        ]);

        if (decision === 'verified') {
          if (isAllCertBundle) {
            const bundleCertRecords: HubCertificate[] = [];
            for (const c of INTERNATIONAL_TRAINING_COURSES) {
              const progForC = nextCourseProgressMap[c.id];
              const cCertNo = progForC?.certificateNumber || `FSP-CERT-${c.code}-${req.uid.slice(0, 6).toUpperCase()}`;
              const cleanCertDocId = `cert-${cCertNo.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
              const recObj: HubCertificate = {
                id: cleanCertDocId,
                certificateNumber: cCertNo,
                recipientUid: req.uid,
                recipientName:
                  updatedUser.name || req.userName || 'Food Specialist',
                recipientEmail: updatedUser.email || req.userEmail || '',
                courseId: c.id,
                trainingCategory: 'International Certification',
                trainingTitle: c.title,
                accreditationBody: c.accreditationStandard,
                issueDate: nowIso.slice(0, 10),
                issuedBy: 'Food Science Portal International Academy',
                verificationStatus: 'valid',
                createdAt: nowIso,
                scorePercentage: progForC.bestExamPercentage || 85,
                distinction: true
              };
              bundleCertRecords.push(recObj);
              await setDoc(doc(db, 'certificates', cleanCertDocId), recObj, {
                merge: true
              });
            }
            setCertificates((prev) => {
              const newIds = new Set(bundleCertRecords.map((b) => b.id));
              return [
                ...bundleCertRecords,
                ...prev.filter((c) => !newIds.has(c.id))
              ];
            });
          } else {
            const cleanCertDocId = `cert-${certNumber.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
            const newCertRecord: HubCertificate = {
              id: cleanCertDocId,
              certificateNumber: certNumber,
              recipientUid: req.uid,
              recipientName:
                updatedUser.name || req.userName || 'Food Specialist',
              recipientEmail: updatedUser.email || req.userEmail || '',
              courseId,
              trainingCategory: 'International Certification',
              trainingTitle:
                req.certificateCourseTitle ||
                matchedCourse?.title ||
                'International Certification',
              accreditationBody:
                matchedCourse?.accreditationStandard ||
                'Food Science Portal International Academy',
              issueDate: nowIso.slice(0, 10),
              issuedBy: 'Food Science Portal International Academy',
              verificationStatus: 'valid',
              createdAt: nowIso,
              scorePercentage: updatedCourseProg.bestExamPercentage,
              distinction: updatedCourseProg.distinctionEarned
            };

            await setDoc(doc(db, 'certificates', cleanCertDocId), newCertRecord, {
              merge: true
            });
            setCertificates((prev) => [
              newCertRecord,
              ...prev.filter((c) => c.id !== cleanCertDocId)
            ]);
          }
        }

        setAdminStatusBanner(
          decision === 'verified'
            ? `Approved Certificate & Activated ${isAllCertBundle ? '1-Year' : '1-Month'} Free Paid Membership for ${req.userName}! PDF Download & Online Website Verification are now LIVE.`
            : `Rejected Certificate Download request for ${req.userName}.`
        );
        setTimeout(() => setAdminStatusBanner(null), 5000);
        return;
      }

      const isYearlyPlan =
        (req.subscriptionPlan || '').toLowerCase().includes('year') ||
        (req.amount || '').toLowerCase().includes('year') ||
        (req.amount || '').includes(String(liveGateway.yearlyFeeRs)) ||
        (req.amount || '').includes('900') ||
        (req.amount || '').includes('1800') ||
        (req.amount || '').includes('1,800');
      const durationDays = isYearlyPlan ? 365 : 30;
      const planLabel = isYearlyPlan
        ? `1 Year (Rs. ${liveGateway.yearlyFeeRs.toLocaleString()} - ${liveGateway.yearlyDiscountPct}% OFF)`
        : `1 Month (Rs. ${liveGateway.monthlyFeeRs.toLocaleString()})`;
      const expiresDate = new Date(
        now.getTime() + durationDays * 24 * 60 * 60 * 1000
      );
      const expiresIso = expiresDate.toISOString().slice(0, 19) + 'Z';

      const updatedReqObj: HubPaymentRequest = {
        ...req,
        status: decision,
        subscriptionPlan: req.subscriptionPlan || planLabel,
        approvedAt: decision === 'verified' ? nowIso : '',
        premiumExpiresAt: decision === 'verified' ? expiresIso : ''
      };

      setPaymentRequests((prev) => {
        const exists = prev.some((r) => r.id === req.id);
        if (exists) {
          return prev.map((r) => (r.id === req.id ? updatedReqObj : r));
        }
        return [updatedReqObj, ...prev];
      });

      try {
        await setDoc(doc(db, 'paymentRequests', req.id), updatedReqObj, {
          merge: true
        });
      } catch {}

      const userSnap = await getDoc(doc(db, 'users', req.uid));
      const baseUser = userSnap.exists()
        ? (userSnap.data() as HubUser)
        : ({
            ...DEFAULT_CURRENT_USER_PROFILE,
            uid: req.uid,
            name: req.userName || 'Food Specialist',
            email: req.userEmail || '',
            phone: req.userPhone || ''
          } as HubUser);

      const updatedUser: HubUser = {
        ...baseUser,
        uid: req.uid,
        name: baseUser.name || req.userName || 'Food Specialist',
        isPaid: decision === 'verified',
        isPremium: decision === 'verified',
        plan: decision === 'verified' ? 'premium' : 'free',
        paymentStatus: decision,
        subscriptionPlan: req.subscriptionPlan || planLabel,
        premiumActivatedAt:
          decision === 'verified'
            ? nowIso
            : baseUser.premiumActivatedAt || '',
        premiumExpiresAt:
          decision === 'verified' ? expiresIso : baseUser.premiumExpiresAt || ''
      };

      setUsers((prev) =>
        prev.map((u) => (u.uid === req.uid ? updatedUser : u))
      );

      await Promise.all([
        setDoc(doc(db, 'users', req.uid), updatedUser, { merge: true }),
        setDoc(doc(db, 'users', req.uid, 'private', 'profile'), updatedUser, {
          merge: true
        }),
        setDoc(doc(db, 'users', req.uid, 'profile', 'main'), updatedUser, {
          merge: true
        })
      ]);

      setAdminStatusBanner(
        decision === 'verified'
          ? `Approved ${req.userName}! ${isYearlyPlan ? 'Full Year (365 Days)' : '1-Month (30 Days)'} Premium Subscription activated until ${expiresDate.toLocaleDateString()}.`
          : `Marked ${req.userName}'s payment request as Rejected.`
      );
      setTimeout(() => setAdminStatusBanner(null), 5000);
    } catch (err) {
      try {
        handleFirestoreError(
          err,
          OperationType.WRITE,
          `paymentRequests/${req.id}`
        );
      } catch {}
    }
  };

  const handleDeletePaymentRequest = async (reqId: string) => {
    try {
      const targetReq = adminAllPaymentRequests.find((r) => r.id === reqId);
      const targetUid =
        targetReq?.uid ||
        (reqId.startsWith('user-pay-') ? reqId.replace('user-pay-', '') : '');

      const idsToSuppress = [reqId];
      if (targetUid) {
        idsToSuppress.push(`user-pay-${targetUid}`);
      }

      setDeletedPaymentReqIds((prev) => {
        const next = Array.from(new Set([...prev, ...idsToSuppress]));
        try {
          localStorage.setItem('fsp_deleted_payment_reqs', JSON.stringify(next));
        } catch {}
        return next;
      });

      setPaymentRequests((prev) =>
        prev.filter((r) => r.id !== reqId && (!targetUid || r.uid !== targetUid || r.id !== reqId))
      );

      if (!reqId.startsWith('user-pay-')) {
        try {
          await deleteDoc(doc(db, 'paymentRequests', reqId));
        } catch {}
      }

      if (targetUid) {
        setUsers((prev) =>
          prev.map((u) =>
            u.uid === targetUid
              ? { ...u, paymentStatus: 'none', receiptImageUrl: '' }
              : u
          )
        );
        try {
          const userSnap = await getDoc(doc(db, 'users', targetUid));
          if (userSnap.exists()) {
            const existingUser = userSnap.data() as HubUser;
            const cleanedUser: HubUser = {
              ...existingUser,
              uid: targetUid,
              paymentStatus: 'none',
              receiptImageUrl: ''
            };
            await Promise.all([
              setDoc(doc(db, 'users', targetUid), cleanedUser, { merge: true }),
              setDoc(doc(db, 'users', targetUid, 'private', 'profile'), cleanedUser, {
                merge: true
              }),
              setDoc(doc(db, 'users', targetUid, 'profile', 'main'), cleanedUser, {
                merge: true
              })
            ]);
          }
        } catch {}
      }

      setAdminStatusBanner('Approval request record permanently deleted.');
      setTimeout(() => setAdminStatusBanner(null), 3500);
    } catch {}
  };

  const handleToggleUserPremium = async (
    targetUser: HubUser,
    makePremium: boolean
  ) => {
    try {
      const now = new Date();
      const nowIso = now.toISOString().slice(0, 19) + 'Z';
      const isYearlyPlan = (targetUser.subscriptionPlan || '')
        .toLowerCase()
        .includes('year');
      const durationDays = isYearlyPlan ? 365 : 30;
      const expiresDate = new Date(
        now.getTime() + durationDays * 24 * 60 * 60 * 1000
      );
      const expiresIso = expiresDate.toISOString().slice(0, 19) + 'Z';

      const updatedUser: HubUser = {
        ...targetUser,
        uid: targetUser.uid,
        name: targetUser.name || 'Food Specialist',
        isPaid: makePremium,
        isPremium: makePremium,
        plan: makePremium ? 'premium' : 'free',
        paymentStatus: makePremium ? 'verified' : 'rejected',
        subscriptionPlan: makePremium
          ? targetUser.subscriptionPlan ||
            `1 Month (Rs. ${liveGateway.monthlyFeeRs})`
          : '',
        premiumActivatedAt: makePremium ? nowIso : '',
        premiumExpiresAt: makePremium ? expiresIso : ''
      };

      await Promise.all([
        setDoc(doc(db, 'users', targetUser.uid), updatedUser, { merge: true }),
        setDoc(
          doc(db, 'users', targetUser.uid, 'private', 'profile'),
          updatedUser,
          { merge: true }
        ),
        setDoc(
          doc(db, 'users', targetUser.uid, 'profile', 'main'),
          updatedUser,
          { merge: true }
        )
      ]);

      // Also update any matching paymentRequests for this user
      const matchingReqs = paymentRequests.filter(
        (r) => r.uid === targetUser.uid
      );
      await Promise.all(
        matchingReqs.map((r) =>
          setDoc(
            doc(db, 'paymentRequests', r.id),
            {
              ...r,
              status: makePremium ? 'verified' : 'rejected',
              approvedAt: makePremium ? nowIso : '',
              premiumExpiresAt: makePremium ? expiresIso : ''
            },
            { merge: true }
          )
        )
      );

      setAdminStatusBanner(
        makePremium
          ? `Accepted ${targetUser.name}! Premium Membership activated until ${expiresDate.toLocaleDateString()}.`
          : `Updated ${targetUser.name} to Free Tier / Rejected.`
      );
      setTimeout(() => setAdminStatusBanner(null), 4000);
    } catch {}
  };

  const handleDeleteUser = async (uid: string, userName: string) => {
    try {
      await Promise.all([
        deleteDoc(doc(db, 'users', uid)),
        deleteDoc(doc(db, 'users', uid, 'private', 'profile')),
        deleteDoc(doc(db, 'users', uid, 'profile', 'main'))
      ]);
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      setAdminStatusBanner(`Removed user "${userName}" from the platform.`);
      setTimeout(() => setAdminStatusBanner(null), 4000);
    } catch {}
  };

  // 1-Box Smart Paste Job Publisher (Supports auto-created tags from Job Title & custom tags)
  const handleQuickPasteJob = async (
    rawText: string,
    category: string
  ) => {
    const cleanText = rawText.trim();
    if (!cleanText) return;

    const lines = cleanText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const firstLine = (lines[0] || 'Food Specialist Opportunity')
      .replace(/^[•*#\-–—\s]+/, '')
      .slice(0, 180);

    // Auto-extract tag from Job Title if category is empty or 'auto'
    const autoTitlePart = firstLine
      .replace(/^(?:job\s*title|position|role|vacancy|hiring)\s*[:\-]\s*/i, '')
      .split(/\s+(?:—|-|\||@|at)\s+|\s*\(/i)[0]
      ?.trim()
      .slice(0, 42);
    const effectiveTag = (
      category && category !== 'auto'
        ? category.trim()
        : autoTitlePart || 'Quality & Safety'
    ).slice(0, 80);

    // Auto-detect Company if present, or extract from "Role — Company"
    const companyLineMatch = cleanText.match(
      /(?:company|organization|employer|industry|firm)\s*[:\-]\s*([^\r\n]+)/i
    );
    let detectedCompany = companyLineMatch?.[1]?.trim() || '';
    if (!detectedCompany && firstLine.includes('—')) {
      detectedCompany = firstLine.split('—')[1]?.trim() || '';
    } else if (!detectedCompany && firstLine.includes(' - ')) {
      detectedCompany = firstLine.split(' - ')[1]?.trim() || '';
    }
    if (!detectedCompany) {
      detectedCompany =
        lines[1] && lines[1].length <= 70
          ? lines[1]
          : 'Verified Food Industry Employer';
    }
    detectedCompany = detectedCompany.slice(0, 180);

    // Auto-detect Country & Location
    const countryCandidates = [
      'Pakistan',
      'UAE',
      'Dubai',
      'Saudi Arabia',
      'KSA',
      'Qatar',
      'Oman',
      'Kuwait',
      'Bahrain',
      'UK',
      'United Kingdom',
      'USA',
      'Canada',
      'Australia',
      'Germany',
      'Europe',
      'International',
      'Remote'
    ];
    const matchedCountry =
      countryCandidates.find((c) =>
        new RegExp(`\\b${c}\\b`, 'i').test(cleanText)
      ) || 'Pakistan';

    const locMatch = cleanText.match(
      /(?:location|city|based in)\s*[:\-]\s*([^\r\n]+)/i
    );
    const detectedLocation = (
      locMatch?.[1]?.trim() || matchedCountry
    ).slice(0, 180);

    const detectedEmail =
      cleanText.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      )?.[0] || '';
    const detectedLink =
      cleanText.match(/https?:\/\/[^\s)]+/)?.[0]?.slice(0, 480) || '#';

    const todayStr = new Date().toISOString().slice(0, 10);
    const id = `job-${Date.now()}`;

    const newJob: HubJob = {
      id,
      title: firstLine,
      company: detectedCompany,
      location: detectedLocation,
      country: matchedCountry === 'Dubai' ? 'UAE' : matchedCountry,
      specialization: effectiveTag,
      experienceRequired: 'See Job Post',
      category: effectiveTag,
      description: cleanText.slice(0, 7800),
      requirements:
        'Please refer to the complete job description above for requirements and application details.',
      hrEmail: detectedEmail.slice(0, 190),
      applyLink: detectedLink,
      tags: Array.from(
        new Set([effectiveTag, autoTitlePart || effectiveTag, matchedCountry])
      ).filter(Boolean),
      postedAt: todayStr,
      expiryAt: '2026-12-31',
      isActive: true
    };

    try {
      await setDoc(doc(db, 'jobs', id), newJob);
      setJobs((prev) => [newJob, ...prev.filter((j) => j.id !== id)]);
      setAdminStatusBanner(
        `Job shared with Tag "${effectiveTag}" (${todayStr})! Live on app now.`
      );
      setTimeout(() => setAdminStatusBanner(null), 4000);
    } catch {}
  };

  const handleDeleteJob = async (job: HubJob) => {
    try {
      await setDoc(
        doc(db, 'jobs', job.id),
        { ...job, isActive: false },
        { merge: true }
      );
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      setAdminStatusBanner(`Removed job "${job.title}" from the app.`);
      setTimeout(() => setAdminStatusBanner(null), 3500);
    } catch {}
  };

  // 1-Box Smart Paste Scholarship Publisher
  const handleQuickPasteScholarship = async (
    rawText: string,
    fundingType: 'Fellowships' | 'International' | 'Grants'
  ) => {
    const cleanText = rawText.trim();
    if (!cleanText) return;

    const lines = cleanText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const firstLine = (lines[0] || 'Food Science & Technology Scholarship')
      .replace(/^[•*#\-–—\s]+/, '')
      .slice(0, 220);

    const orgLineMatch = cleanText.match(
      /(?:university|organization|institute|host|program)\s*[:\-]\s*([^\r\n]+)/i
    );
    const detectedOrg = (
      orgLineMatch?.[1]?.trim() ||
      (lines[1] && lines[1].length <= 80
        ? lines[1]
        : 'Global Food Science Scholarship')
    ).slice(0, 220);

    const countryCandidates = [
      'Europe',
      'UK',
      'United Kingdom',
      'USA',
      'Germany',
      'Netherlands',
      'Australia',
      'Canada',
      'China',
      'Japan',
      'South Korea',
      'Italy',
      'France',
      'Sweden',
      'Denmark',
      'Pakistan',
      'International'
    ];
    const matchedCountry =
      countryCandidates.find((c) =>
        new RegExp(`\\b${c}\\b`, 'i').test(cleanText)
      ) || 'International';

    const detectedEmail =
      cleanText.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      )?.[0] || '';
    const detectedLink =
      cleanText.match(/https?:\/\/[^\s)]+/)?.[0]?.slice(0, 480) || '#';

    const todayStr = new Date().toISOString().slice(0, 10);
    const id = `sch-${Date.now()}`;

    const newSch: HubScholarship = {
      id,
      title: firstLine,
      organization: detectedOrg,
      country: matchedCountry,
      specialization: 'Food Science & Technology',
      deadline: todayStr,
      fundingType,
      degreeLevel: 'BS / MS / PhD',
      description: cleanText.slice(0, 7800),
      eligibility:
        'Please refer to the complete scholarship announcement above for eligibility & application steps.',
      hrEmail: detectedEmail.slice(0, 190),
      applyLink: detectedLink,
      isActive: true
    };

    try {
      await setDoc(doc(db, 'scholarships', id), newSch);
      setScholarships((prev) => [newSch, ...prev.filter((s) => s.id !== id)]);
      setAdminStatusBanner(
        `Scholarship shared in "${fundingType}" with date ${todayStr}! Live on app now.`
      );
      setTimeout(() => setAdminStatusBanner(null), 4000);
    } catch {}
  };

  const handleDeleteScholarship = async (sch: HubScholarship) => {
    try {
      await setDoc(
        doc(db, 'scholarships', sch.id),
        { ...sch, isActive: false },
        { merge: true }
      );
      setScholarships((prev) => prev.filter((s) => s.id !== sch.id));
      setAdminStatusBanner(`Removed scholarship "${sch.title}" from the app.`);
      setTimeout(() => setAdminStatusBanner(null), 3500);
    } catch {}
  };

  // Trainings & Live Price Manager
  const handleSaveTraining = async (training: HubTraining) => {
    try {
      const payload: HubTraining = {
        ...training,
        title: training.title.slice(0, 195),
        category: training.category,
        subType: training.subType || null,
        duration: (training.duration || 'Self-Paced').slice(0, 110),
        fees: (training.fees || 'Free Study & Exam · Rs. 1,000 Certificate').slice(0, 110),
        description: (training.description || '').slice(0, 7800),
        enrollLink: (training.enrollLink || 'https://wa.me/923240906384').slice(
          0,
          480
        ),
        isActive: training.isActive !== false,
        customModules: training.customModules || [],
        customMcqs: training.customMcqs || []
      };
      await setDoc(doc(db, 'trainings', payload.id), payload, { merge: true });
      setTrainings((prev) => {
        const exists = prev.some((t) => t.id === payload.id);
        if (exists) {
          return prev.map((t) => (t.id === payload.id ? payload : t));
        }
        return [payload, ...prev];
      });
      setAdminStatusBanner(
        `Saved training "${payload.title}" (${payload.customModules?.length || 0} Modules, ${payload.customMcqs?.length || 0} MCQs) — Live on App!`
      );
      setTimeout(() => setAdminStatusBanner(null), 4000);
    } catch {}
  };

  const handleDeleteTraining = async (training: HubTraining) => {
    try {
      await setDoc(
        doc(db, 'trainings', training.id),
        {
          category: training.category,
          title: training.title,
          isActive: false
        },
        { merge: true }
      );
      setTrainings((prev) => prev.filter((t) => t.id !== training.id));
      setAdminStatusBanner(`Removed training "${training.title}" from the app.`);
      setTimeout(() => setAdminStatusBanner(null), 3500);
    } catch {}
  };

  // Admin Direct Certificate Issuance (Without Exam / Study) & Live Verification Persistence
  const handleAdminDirectIssueCertificate = async (cert: HubCertificate) => {
    const cleanId =
      cert.id ||
      `cert-${cert.certificateNumber.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
    const payload: HubCertificate = {
      id: cleanId,
      certificateNumber: cert.certificateNumber.slice(0, 115),
      recipientUid: cert.recipientUid || '',
      recipientName: cert.recipientName.slice(0, 195),
      recipientEmail: (cert.recipientEmail || '').slice(0, 195),
      courseId: cert.courseId || 'custom-admin-cert',
      trainingCategory: cert.trainingCategory || 'International Certification',
      trainingTitle: cert.trainingTitle.slice(0, 295),
      accreditationBody: (
        cert.accreditationBody ||
        'Codex Alimentarius & GFSI International Standard'
      ).slice(0, 195),
      issueDate: (cert.issueDate || new Date().toISOString().slice(0, 10)).slice(
        0,
        75
      ),
      issuedBy: (
        cert.issuedBy || 'Food Science Portal Administration (Direct Executive Issuance)'
      ).slice(0, 195),
      verificationStatus: 'valid',
      createdAt: new Date().toISOString(),
      scorePercentage: cert.scorePercentage || 85,
      distinction: Boolean(cert.distinction)
    };

    await setDoc(doc(db, 'certificates', cleanId), payload, { merge: true });
    setCertificates((prev) => [
      payload,
      ...prev.filter(
        (c) =>
          c.id !== cleanId &&
          c.certificateNumber.toUpperCase() !==
            payload.certificateNumber.toUpperCase()
      )
    ]);
  };

  const handleDeleteDirectCertificate = async (certId: string) => {
    try {
      await deleteDoc(doc(db, 'certificates', certId));
      setCertificates((prev) => prev.filter((c) => c.id !== certId));
      setAdminStatusBanner(
        'Certificate removed from Online Verification Registry.'
      );
      setTimeout(() => setAdminStatusBanner(null), 3500);
    } catch {}
  };

  const handleAdminPublishOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminOppTitle.trim() || !adminOppOrg.trim()) return;
    if (adminOppType === 'job') {
      const effectiveJobTag =
        adminOppCat.trim() || adminOppTitle.trim().slice(0, 40) || 'Quality & Safety';
      await handleQuickPasteJob(
        `${adminOppTitle.trim()} — ${adminOppOrg.trim()}\nLocation: ${adminOppLocation}, ${adminOppCountry}\n${adminOppDesc}\nEmail: ${adminOppEmail}\nApply: ${adminOppLink}`,
        effectiveJobTag
      );
    } else {
      await handleQuickPasteScholarship(
        `${adminOppTitle.trim()} — ${adminOppOrg.trim()}\nCountry: ${adminOppCountry}\n${adminOppDesc}\nEmail: ${adminOppEmail}\nApply: ${adminOppLink}`,
        (adminOppCat as 'Fellowships' | 'International' | 'Grants') ||
          'Fellowships'
      );
    }
    setAdminOppTitle('');
    setAdminOppOrg('');
    setAdminOppDesc('');
    setAdminOppEmail('');
    setAdminOppLink('');
  };

  const handleSaveStorageConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawWaLink = (
      storageConfig.whatsappChannelUrl ||
      'https://whatsapp.com/channel/0029VaFoodSpecialists'
    ).trim();
    const normalizedWaLink = rawWaLink
      ? /^https?:\/\//i.test(rawWaLink)
        ? rawWaLink
        : `https://${rawWaLink}`
      : 'https://whatsapp.com/channel/0029VaFoodSpecialists';

    const updated: CloudStorageConfig = {
      ...storageConfig,
      paymentGateway: {
        jazzCashTitle:
          storageConfig.paymentGateway?.jazzCashTitle || 'Muneeb Khan',
        jazzCashNumber:
          storageConfig.paymentGateway?.jazzCashNumber || '0324-0906384',
        easyPaisaTitle:
          storageConfig.paymentGateway?.easyPaisaTitle || 'Muneeb Khan',
        easyPaisaNumber:
          storageConfig.paymentGateway?.easyPaisaNumber || '0324-0906384',
        bankTitle: storageConfig.paymentGateway?.bankTitle || 'Muneeb Khan',
        bankName:
          storageConfig.paymentGateway?.bankName || 'Allied Bank / Bank Transfer',
        bankAccountOrIban:
          storageConfig.paymentGateway?.bankAccountOrIban ||
          'Contact on WhatsApp for IBAN',
        bankWhatsapp:
          storageConfig.paymentGateway?.bankWhatsapp || '+92 324 0906384',
        monthlyFeeRs: Number(storageConfig.paymentGateway?.monthlyFeeRs) || 100,
        yearlyFeeRs: Number(storageConfig.paymentGateway?.yearlyFeeRs) || 900,
        customPriceUpdated: true
      },
      whatsappChannelUrl: normalizedWaLink.slice(0, 490),
      whatsappChannelButtonText: (
        storageConfig.whatsappChannelButtonText || 'Follow WhatsApp Channel'
      )
        .trim()
        .slice(0, 110),
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    setStorageConfig(updated);
    try {
      await setDoc(doc(db, 'settings', 'storageConfig'), updated, {
        merge: true
      });
      setAdminStatusBanner(
        'Settings, Payment Gateway & Official WhatsApp Channel Link saved — Live on App!'
      );
      setTimeout(() => setAdminStatusBanner(null), 4000);
    } catch {}
  };

  const handleExportFullBackupJson = () => {
    const backupPayload = {
      exportedAt: new Date().toISOString(),
      projectId: 'food-specialist-3e294',
      storageConfig,
      counts: {
        users: users.length,
        paymentRequests: paymentRequests.length,
        jobs: jobs.length,
        scholarships: scholarships.length,
        trainings: trainings.length
      },
      data: {
        users,
        paymentRequests,
        jobs,
        scholarships,
        trainings
      }
    };
    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-specialists-storage-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const firstName = useMemo(() => {
    if (!myProfile.name) return 'Guest';
    return myProfile.name.split(' ')[0].replace(/,/g, '') || 'Guest';
  }, [myProfile.name]);

  const userInitial = firstName.charAt(0).toUpperCase() || 'G';

  // 0. 2.2-Second Startup / Reload / Logout Splash Screen with Food Science Portal Logo
  if (showSplashLogo) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white p-1.5 shadow-[0_12px_40px_rgba(26,33,56,0.12)] border border-[#D2DEEA] flex items-center justify-center overflow-hidden">
            <img
              src={FS_PORTAL_LOGO_DATA_URI}
              alt="Food Science Portal"
              className="w-full h-full object-contain select-none"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0C182D] tracking-tight">
              Food Science <span className="text-[#1673B8]">Portal</span>
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#1673B8] leading-relaxed px-2">
              The only platform for Food Science related Jobs, Scholarships, Tools, Communities, Trainings
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 1. While checking Firebase Auth state on page load, show a clean loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F0F6FC] flex flex-col items-center justify-center p-4">
        <div className="bg-white border-[1.5px] border-[#BBD6EE] rounded-[28px] px-8 py-7 shadow-lg flex flex-col items-center gap-3 text-center max-w-sm w-full">
          <div className="w-24 h-24 rounded-2xl bg-white p-1 border border-[#D2DEEA] shadow-xs flex items-center justify-center overflow-hidden">
            <img
              src={FS_PORTAL_LOGO_DATA_URI}
              alt="Food Science Portal"
              className="w-full h-full object-contain select-none"
            />
          </div>
          <h2 className="text-base font-black text-[#0C182D]">
            Food Science <span className="text-[#1673B8]">Portal</span>
          </h2>
          <p className="text-xs font-bold text-[#1673B8] leading-relaxed">
            The only platform for Food Science related Jobs, Scholarships, Tools, Communities, Trainings
          </p>
        </div>
      </div>
    );
  }

  // 2. Public SEO Mode & Instant QR Certificate Verification:
  // 2. Public Website Mode:
  // Unauthenticated visitors and Googlebot can browse Home, Tools, Trainings, Certificate Verification (?verify=), Jobs, Scholarships & Communities publicly.
  // AuthScreen is shown only when the user clicks Sign In / Profile or attempts a Paid/Registration-required action.
  if (!authUser) {
    if (showGuestAuthModal || route.name === 'profile') {
      return (
        <div className="min-h-screen bg-[#F0F6FC] flex flex-col">
          <div className="w-full bg-[#0C182D] text-white px-4 py-2.5 flex items-center justify-between gap-2 shadow-sm">
            <span className="text-xs font-bold text-sky-200">
              Sign in to save your profile, log batch records, or unlock verified certificates
            </span>
            <button
              type="button"
              onClick={() => {
                setShowGuestAuthModal(false);
                if (route.name === 'profile') {
                  setRoute({ name: 'home' });
                }
              }}
              className="px-3 py-1 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer whitespace-nowrap"
            >
              ← Browse Public Portal
            </button>
          </div>
          <div className="flex-1">
            <AuthScreen />
          </div>
        </div>
      );
    }
  }

  // 3. Dedicated Admin Control Panel Entry: When Admin logs in, enter AdminControlPanel directly (not as a normal user)
  if (isUserAdmin && !adminPreviewUserMode) {
    return (
      <AdminControlPanel
        adminEmail={authUser?.email || 'mindmademedia9@gmail.com'}
        users={users}
        paymentRequests={adminAllPaymentRequests}
        jobs={activeJobs}
        scholarships={activeScholarships}
        trainings={trainings}
        storageConfig={storageConfig}
        adminStatusBanner={adminStatusBanner}
        onClearBanner={() => setAdminStatusBanner(null)}
        onSetBanner={(msg) => {
          setAdminStatusBanner(msg);
          setTimeout(() => setAdminStatusBanner(null), 4000);
        }}
        onVerifyPayment={handleAdminVerifyPayment}
        onDeletePaymentRequest={handleDeletePaymentRequest}
        onToggleUserPremium={handleToggleUserPremium}
        onDeleteUser={handleDeleteUser}
        onQuickPasteJob={handleQuickPasteJob}
        onDeleteJob={handleDeleteJob}
        onQuickPasteScholarship={handleQuickPasteScholarship}
        onDeleteScholarship={handleDeleteScholarship}
        onSaveTraining={handleSaveTraining}
        onDeleteTraining={handleDeleteTraining}
        certificates={certificates}
        onAdminDirectIssueCertificate={handleAdminDirectIssueCertificate}
        onDeleteCertificate={handleDeleteDirectCertificate}
        onChangeStorageConfig={setStorageConfig}
        onSaveStorageConfig={handleSaveStorageConfig}
        onExportBackup={handleExportFullBackupJson}
        onPreviewUserApp={() => setAdminPreviewUserMode(true)}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-[#F4F8FD] text-[#1A2138] flex flex-col overflow-hidden">
      {/* If Admin is previewing the user-facing app, show a top bar to return to Admin Control Panel */}
      {isUserAdmin && adminPreviewUserMode && (
        <div className="w-full shrink-0 px-4 sm:px-6 lg:px-10 py-2 bg-[#0C182D] text-white border-b border-white/15 flex items-center justify-between gap-2 shadow-sm z-40">
          <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between gap-2">
            <div className="text-xs font-extrabold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-sky-300" />
              <span>Previewing Live User Website &amp; Mobile App Mode</span>
            </div>
            <button
              type="button"
              onClick={() => setAdminPreviewUserMode(false)}
              className="px-3 py-1 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer transition-colors whitespace-nowrap"
            >
              ← Back to Admin Panel
            </button>
          </div>
        </div>
      )}

      {/* Full-Viewport Responsive Website + Mobile App Shell */}
      <div className="w-full flex-1 min-h-0 bg-[#F4F8FD] flex flex-col relative overflow-hidden">
        {/* TOP HEADER — FULL-WIDTH EDGE-TO-EDGE */}
        <Header
          showBack={route.name !== 'home'}
          hideSearchBar={
            route.name === 'search' ||
            (route.name === 'tools' && activeToolSection === 'e-numbers')
          }
          onBack={() => {
            if (route.name === 'tools' && activeToolSection !== 'hub') {
              setActiveToolSection('hub');
              setToolsResetKey((k) => k + 1);
              setRoute({ name: 'tools', initialSection: 'hub' });
            } else if (route.name === 'job-detail') setRoute({ name: 'jobs' });
            else if (route.name === 'scholarship-detail')
              setRoute({ name: 'scholarships' });
            else if (route.name === 'community-member')
              setRoute({ name: 'communities' });
            else if (route.name === 'training-detail')
              setRoute({ name: 'trainings' });
            else if (
              route.name === 'trainings-highfield' ||
              route.name === 'trainings-lead-auditor-hub'
            )
              setRoute({ name: 'trainings' });
            else if (route.name === 'admin') setRoute({ name: 'profile' });
            else setRoute({ name: 'home' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onHomeClick={() => setRoute({ name: 'home' })}
          onSearchClick={() => {
            setSearchTab('All');
            setRoute({ name: 'search' });
          }}
          onBellClick={() => navigateToJobs('All')}
          jobNotifications={activeJobs}
          readJobIds={readJobNotificationIds}
          onSelectJobNotification={(jobId) => {
            handleMarkJobNotificationRead(jobId);
            setRoute({ name: 'job-detail', jobId });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onMarkAllNotificationsRead={handleMarkAllJobNotificationsRead}
          onProfileClick={() => setRoute({ name: 'profile' })}
          onAdminClick={() => {
            setAdminPreviewUserMode(false);
          }}
          isAdmin={isUserAdmin}
          pendingAdminCount={pendingPaymentRequestsCount}
          onSignOutClick={handleSignOut}
          onOpenLegal={(tab) => setLegalModalTab(tab)}
          userEmail={authUser?.email || null}
          userInitial={userInitial}
          userAvatarUrl={
            myProfile.profilePicUrl || authUser?.photoURL || undefined
          }
          activeWebsiteNav={activeWebsiteNav}
          onNavigateWebsiteSection={handleNavigateWebsiteSection}
          isStandaloneApp={isStandaloneApp}
          onInstallAppClick={() => setShowInstallAppModal(true)}
          isGuest={!authUser}
          onSignInClick={() => setShowGuestAuthModal(true)}
        />
        <SEOManager
          routeName={route.name}
          activeToolSection={activeToolSection}
        />

        {/* FLOATING BACK BUTTON THAT MOVES WITH SCROLL ON MOBILE/APP & WEBSITE */}
        {route.name !== 'home' && (
          <button
            type="button"
            onClick={() => {
              if (route.name === 'tools' && activeToolSection !== 'hub') {
                setActiveToolSection('hub');
                setToolsResetKey((k) => k + 1);
                setRoute({ name: 'tools', initialSection: 'hub' });
              } else if (route.name === 'job-detail') setRoute({ name: 'jobs' });
              else if (route.name === 'scholarship-detail')
                setRoute({ name: 'scholarships' });
              else if (route.name === 'community-member')
                setRoute({ name: 'communities' });
              else if (route.name === 'training-detail')
                setRoute({ name: 'trainings' });
              else if (
                route.name === 'trainings-highfield' ||
                route.name === 'trainings-lead-auditor-hub'
              )
                setRoute({ name: 'trainings' });
              else if (route.name === 'admin') setRoute({ name: 'profile' });
              else setRoute({ name: 'home' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Go Back"
            title="Go Back"
            className="fixed bottom-20 left-3.5 md:bottom-6 md:left-6 z-40 px-3.5 py-2.5 rounded-full bg-[#0C182D]/95 hover:bg-[#1673B8] text-white border border-white/25 shadow-[0_8px_24px_rgba(12,24,45,0.35)] backdrop-blur-md flex items-center gap-1.5 text-xs font-extrabold cursor-pointer transition-all"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.8]" />
            <span>Back</span>
          </button>
        )}

        {/* MIDDLE SCROLLABLE PAGE CONTENT AREA — FULL SCREEN WITH CENTERED 1440PX WEBSITE CONTAINER */}
        <main className="flex-1 overflow-y-auto overscroll-contain w-full flex flex-col justify-between">
          <div className="max-w-[1440px] mx-auto w-full p-3 sm:p-6 lg:px-10 lg:py-7 space-y-4 sm:space-y-6">
          {/* LAST 5 DAYS PREMIUM EXPIRY COUNTDOWN BANNER */}
          {globalPremiumCountdown && (
            <div className="rounded-2xl bg-gradient-to-r from-[#1A2138] via-[#105E9A] to-[#1673B8] text-white p-3 shadow-sm border border-[#D2DEEA] flex items-center justify-between gap-2.5">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-sky-200" />
                </div>
                <div className="min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-amber-300 text-[#1A2138] text-[9.5px] font-extrabold uppercase tracking-wider">
                    Final {globalPremiumCountdown.daysLeft}{' '}
                    {globalPremiumCountdown.daysLeft === 1 ? 'Day' : 'Days'} Left
                  </span>
                  <p className="text-[11px] font-bold text-white mt-0.5 leading-snug">
                    Your Premium Membership ends on {globalPremiumCountdown.formattedEndDate}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPaySubmitBanner(null);
                  setPayMethod('Bank Transfer');
                  setShowPremiumUpgradeModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-[#1A2138] text-[11px] font-extrabold shrink-0 cursor-pointer whitespace-nowrap"
              >
                Renew Now
              </button>
            </div>
          )}

          {/* ==================== 1. HOME SCREEN (/) — FULL-FLEDGED WEBSITE + MOBILE APP DASHBOARD ==================== */}
          {route.name === 'home' && (
            <div className="space-y-4 sm:space-y-6">
              {/* SECTION A: EXECUTIVE HERO & COMMAND BANNER */}
              <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0C182D] via-[#123159] to-[#1673B8] text-white p-4 sm:p-6 lg:p-8 shadow-md border border-[#1673B8]/40 relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
                  {/* Left 7 Columns: Greeting, Value Prop, Website Search Bar & Quick Filter Tags */}
                  <div className="lg:col-span-7 space-y-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-sky-200 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                        <span>Global Food Science &amp; Safety Portal</span>
                      </span>
                      {isCurrentUserPaid && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-300 text-[#0C182D] text-[10px] sm:text-[11px] font-extrabold">
                          <Crown className="w-3 h-3 shrink-0" />
                          <span>Premium Specialist</span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h1 className="text-[19px] sm:text-[26px] lg:text-[32px] font-black text-white tracking-tight leading-tight break-words">
                        {timeOfDayGreeting}, {firstName}
                      </h1>
                      <p className="text-xs sm:text-sm text-sky-100/90 font-medium max-w-2xl leading-relaxed">
                        Your unified platform for verified Food Safety &amp; QA/QC jobs, international scholarships, Halal E-Number lookup, laboratory calculators, and accredited trainings.
                      </p>
                    </div>

                    {/* Desktop & Tablet Integrated Hero Search Bar */}
                    <div className="hidden md:flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-lg max-w-2xl">
                      <div className="flex items-center gap-2.5 flex-1 pl-3">
                        <Search className="w-4 h-4 text-[#1673B8] stroke-[2.4] shrink-0" />
                        <input
                          type="text"
                          value={globalSearchQuery}
                          onChange={(e) => setGlobalSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setRoute({ name: 'search' });
                            }
                          }}
                          placeholder="Search jobs, scholarships, E-numbers, trainings or specialists..."
                          className="w-full py-2 text-xs sm:text-sm font-medium text-[#1A2138] placeholder:text-slate-400 focus:outline-none bg-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setRoute({ name: 'search' })}
                        className="px-4 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold transition-colors cursor-pointer shrink-0"
                      >
                        Search Portal
                      </button>
                    </div>

                    {/* Quick Action Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => navigateToJobs('All')}
                        className="px-3 py-1.5 rounded-xl bg-white text-[#0C182D] hover:bg-sky-50 text-[11px] sm:text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-[#1673B8]" />
                        <span>Browse Jobs ({activeJobs.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateToScholarships('All')}
                        className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[11px] sm:text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-sky-200" />
                        <span>Scholarships ({activeScholarships.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveToolSection('hub');
                          setRoute({ name: 'tools', initialSection: 'hub' });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[11px] sm:text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5 text-sky-200" />
                        <span>Open Tools</span>
                      </button>
                      {!isStandaloneApp && (
                        <button
                          type="button"
                          onClick={() => setShowInstallAppModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-[#0C182D] text-[11px] sm:text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-[#0C182D]" />
                          <span>Install Mobile App</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right 5 Columns (Visible on Desktop lg+): Live Portal Stats & Ecosystem Matrix */}
                  <div className="hidden lg:grid lg:col-span-5 grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => navigateToJobs('All')}
                      className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-left transition-all cursor-pointer space-y-1"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-sky-200">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <p className="text-2xl font-black text-white tabular-nums pt-1">
                        {activeJobs.length}
                      </p>
                      <p className="text-xs font-extrabold text-sky-100">
                        Verified Job Roles
                      </p>
                      <p className="text-[10.5px] text-sky-200/80">
                        Production, QA/QC &amp; R&amp;D
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToScholarships('All')}
                      className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-left transition-all cursor-pointer space-y-1"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-sky-200">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <p className="text-2xl font-black text-white tabular-nums pt-1">
                        {activeScholarships.length}
                      </p>
                      <p className="text-xs font-extrabold text-sky-100">
                        Global Scholarships
                      </p>
                      <p className="text-[10.5px] text-sky-200/80">
                        MSc, PhD &amp; Fellowships
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRoute({ name: 'communities' })}
                      className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-left transition-all cursor-pointer space-y-1"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-sky-200">
                        <Users className="w-4 h-4" />
                      </div>
                      <p className="text-2xl font-black text-white tabular-nums pt-1">
                        {paidCommunityMembers.length}
                      </p>
                      <p className="text-xs font-extrabold text-sky-100">
                        Verified Specialists
                      </p>
                      <p className="text-[10.5px] text-sky-200/80">
                        Premium Directory &amp; CVs
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRoute({ name: 'trainings' })}
                      className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-left transition-all cursor-pointer space-y-1"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-sky-200">
                        <Award className="w-4 h-4" />
                      </div>
                      <p className="text-2xl font-black text-white tabular-nums pt-1">
                        {certificates.length}
                      </p>
                      <p className="text-xs font-extrabold text-sky-100">
                        Certificates &amp; Courses
                      </p>
                      <p className="text-[10.5px] text-sky-200/80">
                        Online QR Registry
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* ADMIN QUICK BANNER FOR PENDING PAYMENT APPROVALS */}
              {isUserAdmin && (
                <div className="bg-[#F0F6FC] border border-[#1673B8]/40 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between gap-2.5">
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-extrabold text-[#1A2138] flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#1673B8] shrink-0" />
                      <span className="truncate">
                        Admin Control • {pendingPaymentRequestsCount} Pending{' '}
                        {pendingPaymentRequestsCount === 1 ? 'Request' : 'Requests'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-snug">
                      Review payment slips, post new jobs/scholarships &amp; issue certificates.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminTab('receipts');
                      setRoute({ name: 'admin' });
                    }}
                    className="px-3 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold shrink-0 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Receipts ({adminAllPaymentRequests.length}) →
                  </button>
                </div>
              )}

              {/* SECTION B: PRIMARY OPPORTUNITY HUB (JOBS & SCHOLARSHIPS — 2 COLUMNS ON DESKTOP) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* CARD 1 - JOBS */}
                <div className="bg-white border border-[#D2DEEA] hover:border-[#1673B8]/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs transition-all flex flex-col justify-between space-y-3.5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-[16px] sm:text-[18.5px] font-extrabold text-[#1A2138] leading-snug tracking-tight">
                              Jobs &amp; Career Openings
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-[#EBF4FC] text-[#1673B8] text-[10.5px] font-extrabold">
                              {activeJobs.length} Active
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            Verified QA/QC, Food Safety, Production &amp; R&amp;D roles
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Specialization Tags */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-wrap items-center gap-1.5 select-none cursor-default pointer-events-none"
                    >
                      <span className="px-2.5 py-1 rounded-lg bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] sm:text-[11px] font-bold">
                        Production
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] sm:text-[11px] font-bold">
                        R&amp;D Lab
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] sm:text-[11px] font-bold">
                        Quality &amp; Safety
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] sm:text-[11px] font-bold">
                        HACCP / ISO 22000
                      </span>
                    </div>

                    {/* Live Preview of Recent Jobs (If Available) */}
                    {activeJobs.length > 0 ? (
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                          Latest Posted Roles
                        </p>
                        {activeJobs.slice(0, 2).map((j) => (
                          <button
                            key={j.id}
                            type="button"
                            onClick={() => {
                              setRoute({ name: 'job-detail', jobId: j.id });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F0F6FC] border border-[#E2ECF5] flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-extrabold text-[#1A2138] truncate">
                                {j.title}
                              </p>
                              <p className="text-[11px] font-medium text-slate-500 truncate">
                                {j.company} • {j.location || j.country}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#1673B8] shrink-0" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2ECF5] flex items-center justify-between gap-2">
                        <div className="text-xs text-slate-600 font-medium">
                          Instant bell notifications enabled whenever new industry jobs are posted.
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-[#EBF4FC] text-[#1673B8] text-[10px] font-extrabold shrink-0">
                          Live Alerts
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateToJobs('All')}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs sm:text-[13.5px] font-extrabold text-center shadow-2xs transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                  >
                    <span>Browse Jobs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* CARD 2 - SCHOLARSHIPS */}
                <div className="bg-white border border-[#D2DEEA] hover:border-[#1673B8]/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs transition-all flex flex-col justify-between space-y-3.5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-[16px] sm:text-[18.5px] font-extrabold text-[#1A2138] leading-snug tracking-tight">
                              Global Scholarships &amp; Grants
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-[#EBF4FC] text-[#1673B8] text-[10.5px] font-extrabold">
                              {activeScholarships.length} Open
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            International MSc, PhD fellowships &amp; research funding
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Funding Tags */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-wrap items-center gap-1.5 select-none cursor-default pointer-events-none"
                    >
                      <span className="px-2.5 py-1 rounded-lg bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] sm:text-[11px] font-bold">
                        Fellowships
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] sm:text-[11px] font-bold">
                        International Grants
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] sm:text-[11px] font-bold">
                        MSc &amp; PhD Food Science
                      </span>
                    </div>

                    {/* Live Preview of Recent Scholarships (If Available) */}
                    {activeScholarships.length > 0 ? (
                      <div className="space-y-1.5 pt-1 border-t border-slate-100">
                        <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                          Featured Programs
                        </p>
                        {activeScholarships.slice(0, 2).map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setRoute({
                                name: 'scholarship-detail',
                                scholarshipId: s.id
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F0F6FC] border border-[#E2ECF5] flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-extrabold text-[#1A2138] truncate">
                                {s.title}
                              </p>
                              <p className="text-[11px] font-medium text-slate-500 truncate">
                                {s.organization} • {s.country}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#1673B8] shrink-0" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2ECF5] flex items-center justify-between gap-2">
                        <div className="text-xs text-slate-600 font-medium">
                          Verified international fellowships, Erasmus+ &amp; food research grants updated regularly.
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-[#EBF4FC] text-[#1673B8] text-[10px] font-extrabold shrink-0">
                          Global
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateToScholarships('All')}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-white hover:bg-[#F0F6FC] border-[1.5px] border-[#1673B8] text-[#1673B8] text-xs sm:text-[13.5px] font-extrabold text-center transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                  >
                    <span>Explore Grants</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SECTION C: SPECIALIST TOOLS SUITE (4 INTERACTIVE CARDS ON DESKTOP, 2x2 ON MOBILE) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-0.5">
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-[#1A2138] tracking-tight">
                      Food Science Tools &amp; Lab Calculators
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      Direct access to exam preparation, E-number safety lookup, laboratory formulas &amp; compliance planners
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveToolSection('hub');
                      setRoute({ name: 'tools', initialSection: 'hub' });
                    }}
                    className="text-xs font-extrabold text-[#1673B8] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>All Tools</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Tool 1: Exam Prep & 5-Page PDF Notes */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveToolSection('exam');
                      setRoute({ name: 'tools', initialSection: 'exam' });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-[#F0F6FC] border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-3.5 sm:p-4 text-left transition-all shadow-2xs cursor-pointer flex flex-col justify-between space-y-2.5 group"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#F0F6FC] group-hover:bg-[#1673B8] border border-[#D2DEEA] text-[#1673B8] group-hover:text-white flex items-center justify-center transition-colors">
                        <BookOpen className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#1673B8] block">
                          PPSC / FPSC / Global
                        </span>
                        <h3 className="text-xs sm:text-sm font-extrabold text-[#1A2138] leading-snug mt-0.5">
                          Exam Prep &amp; PDF Notes
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1 hidden sm:block">
                          Subject-wise Food Science MCQs, mock tests &amp; 5-page revision PDF generator.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-[#1673B8] inline-flex items-center gap-1">
                      <span>Start Prep</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  {/* Tool 2: E-Numbers & Halal Additive Finder */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveToolSection('e-numbers');
                      setRoute({ name: 'tools', initialSection: 'e-numbers' });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-[#F0F6FC] border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-3.5 sm:p-4 text-left transition-all shadow-2xs cursor-pointer flex flex-col justify-between space-y-2.5 group"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#F0F6FC] group-hover:bg-[#1673B8] border border-[#D2DEEA] text-[#1673B8] group-hover:text-white flex items-center justify-center transition-colors">
                        <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#1673B8] block">
                          Codex &amp; Halal Status
                        </span>
                        <h3 className="text-xs sm:text-sm font-extrabold text-[#1A2138] leading-snug mt-0.5">
                          E-Numbers &amp; Additives
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1 hidden sm:block">
                          Instant INS/E-code search with Halal status, ADI limits &amp; regulatory safety notes.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-[#1673B8] inline-flex items-center gap-1">
                      <span>Search E-Codes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  {/* Tool 3: Food Lab & Process Calculators */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveToolSection('lab-formula');
                      setRoute({
                        name: 'tools',
                        initialSection: 'lab-formula'
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-[#F0F6FC] border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-3.5 sm:p-4 text-left transition-all shadow-2xs cursor-pointer flex flex-col justify-between space-y-2.5 group"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#F0F6FC] group-hover:bg-[#1673B8] border border-[#D2DEEA] text-[#1673B8] group-hover:text-white flex items-center justify-center transition-colors">
                        <FlaskConical className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#1673B8] block">
                          QA/QC Lab Suite
                        </span>
                        <h3 className="text-xs sm:text-sm font-extrabold text-[#1A2138] leading-snug mt-0.5">
                          Food Lab Calculators
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1 hidden sm:block">
                          Dilution, Pearson Square, molarity, moisture &amp; batch formulation calculators.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-[#1673B8] inline-flex items-center gap-1">
                      <span>Open Calculators</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  {/* Tool 4: Clinical Nutrition & Diet Suite */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveToolSection('nutrition');
                      setRoute({
                        name: 'tools',
                        initialSection: 'nutrition'
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-[#F0F6FC] border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-3.5 sm:p-4 text-left transition-all shadow-2xs cursor-pointer flex flex-col justify-between space-y-2.5 group"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#F0F6FC] group-hover:bg-[#1673B8] border border-[#D2DEEA] text-[#1673B8] group-hover:text-white flex items-center justify-center transition-colors">
                        <Activity className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#1673B8] block">
                          Dietetics &amp; Macros
                        </span>
                        <h3 className="text-xs sm:text-sm font-extrabold text-[#1A2138] leading-snug mt-0.5">
                          Nutrition &amp; Diet Planner
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1 hidden sm:block">
                          BMR, TDEE, BMI, daily meal planner &amp; clinical macro tracker.
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-[#1673B8] inline-flex items-center gap-1">
                      <span>Open Nutrition</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              </div>

              {/* SECTION D: ACADEMY, CERTIFICATE VERIFICATION & SPECIALIST DIRECTORY (3 COLUMNS ON DESKTOP) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setRoute({ name: 'trainings' })}
                  className="bg-white hover:bg-[#F0F6FC] border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-4 text-left transition-all shadow-2xs cursor-pointer flex items-start gap-3.5"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1673B8] block">
                      Accredited Learning &amp; QR Registry
                    </span>
                    <p className="text-sm font-extrabold text-[#1A2138] mt-0.5">
                      Trainings &amp; Certificate Portal
                    </p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                      {trainings.length > 0
                        ? `${trainings.length} Accredited Courses • ${certificates.length} Verified Certificates Issued`
                        : `Study Food Safety modules & verify ${certificates.length} official QR certificates`}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRoute({ name: 'communities' })}
                  className="bg-white hover:bg-[#F0F6FC] border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-4 text-left transition-all shadow-2xs cursor-pointer flex items-start gap-3.5"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1673B8] block">
                      Professional Network
                    </span>
                    <p className="text-sm font-extrabold text-[#1A2138] mt-0.5">
                      Specialist Community ({paidCommunityMembers.length})
                    </p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                      Connect with verified Food Technologists, QA Managers &amp; R&amp;D Specialists.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRoute({ name: 'profile' })}
                  className="bg-white hover:bg-[#F0F6FC] border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-4 text-left transition-all shadow-2xs cursor-pointer flex items-start gap-3.5"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1673B8] block">
                      Career Portfolio
                    </span>
                    <p className="text-sm font-extrabold text-[#1A2138] mt-0.5">
                      ATS CV Builder &amp; Profile
                    </p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                      Generate executive ATS-ready Food Science CVs and manage privacy settings.
                    </p>
                  </div>
                </button>
              </div>

              {/* SECTION E: OFFICIAL WHATSAPP CHANNEL + INSTALL MOBILE APP ROW */}
              <div
                className={`grid grid-cols-1 ${
                  !isStandaloneApp ? 'lg:grid-cols-2' : ''
                } gap-4`}
              >
                {(() => {
                  const rawWaUrl = (
                    storageConfig.whatsappChannelUrl ||
                    'https://whatsapp.com/channel/0029VaFoodSpecialists'
                  ).trim();
                  const waHref = rawWaUrl
                    ? /^https?:\/\//i.test(rawWaUrl)
                      ? rawWaUrl
                      : `https://${rawWaUrl}`
                    : 'https://whatsapp.com/channel/0029VaFoodSpecialists';
                  const waButtonLabel =
                    storageConfig.whatsappChannelButtonText?.trim() ||
                    'Follow WhatsApp Channel';

                  return (
                    <div className="bg-gradient-to-r from-[#1A2138] via-[#105E9A] to-[#1673B8] border border-[#1673B8]/40 rounded-2xl p-4 sm:p-5 shadow-sm text-white flex flex-col justify-between space-y-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 text-white flex items-center justify-center shrink-0">
                          <MessageSquare className="w-5 h-5 stroke-[2.2]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200 block">
                            Official Community Updates
                          </span>
                          <h2 className="text-sm sm:text-base font-extrabold text-white leading-snug break-words">
                            Food Science Portal WhatsApp Channel
                          </h2>
                          <p className="text-xs text-sky-100/90 font-medium mt-0.5 leading-snug break-words">
                            Receive instant alerts for daily food industry jobs, global scholarships &amp; training announcements.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-sky-50 text-[#1A2138] font-extrabold text-xs shadow-2xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#1673B8] stroke-[2.3] shrink-0" />
                          <span>{waButtonLabel}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#1673B8] stroke-[2.4] shrink-0" />
                        </a>

                        {isUserAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setAdminPreviewUserMode(false);
                              setRoute({ name: 'admin' });
                            }}
                            className="px-3 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-extrabold cursor-pointer transition-colors shrink-0 whitespace-nowrap"
                          >
                            Edit Link
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* INSTALL MOBILE APP CARD ON WEBSITE HOME PAGE */}
                {!isStandaloneApp && (
                  <div className="bg-white border border-[#1673B8]/35 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#F0F6FC] border border-[#1673B8]/30 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={FS_PORTAL_LOGO_DATA_URI}
                          alt="Food Science Portal App"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1673B8] block">
                          Website + Mobile App Synced
                        </span>
                        <h2 className="text-sm sm:text-base font-extrabold text-[#1A2138] leading-snug">
                          Install Food Science Portal Mobile App
                        </h2>
                        <p className="text-xs text-slate-600 font-medium mt-0.5 leading-snug">
                          Download the app on your Android or iPhone for instant 1-tap access with real-time cloud synchronization.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowInstallAppModal(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold text-xs shadow-2xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-4 h-4 stroke-[2.3] shrink-0" />
                      <span>Download &amp; Install Mobile App</span>
                    </button>
                  </div>
                )}
              </div>

              {/* CERTIFICATE BUNDLE OFFERS SECTION */}
              <CertificateBundleOffersCard
                paymentGatewayConfig={liveGateway}
                isGuest={!authUser}
                onRequireSignIn={() => setShowGuestAuthModal(true)}
                onOpenCourseCatalog={() => {
                  setRoute({ name: 'trainings' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSubmitBundleRequest={async ({
                  bundle,
                  selectedCourses,
                  paymentMethod,
                  transactionId,
                  receiptImageUrl,
                  notes
                }) => {
                  const firstCourse = selectedCourses[0];
                  const courseNames = selectedCourses
                    .map((c) => `${c.title} (${c.code})`)
                    .join(', ');
                  const cleanUid = (authUser?.uid || myProfile.uid || 'USR')
                    .replace(/[^a-zA-Z0-9]/g, '')
                    .toUpperCase()
                    .slice(0, 5);
                  const certNo = `FSP-${(firstCourse?.code || 'BUNDLE').replace(/[^a-zA-Z0-9]/g, '')}-${cleanUid}`;
                  await handleSubmitCertificatePaymentRequest({
                    courseId: firstCourse?.id || 'bundle-pass',
                    courseTitle: `${bundle.title}: ${courseNames}`,
                    certificateNumber: certNo,
                    scorePercentage: 80,
                    distinction: true,
                    paymentMethod,
                    transactionId,
                    receiptImageUrl,
                    notes: `${bundle.title} (Rs. ${bundle.priceRs.toLocaleString()}) — Courses: ${courseNames}${notes ? ` | Note: ${notes}` : ''}`
                  });
                }}
              />

              {/* SEO DIRECTORY & SITEMAP FOOTER (Crawlable links for all Tools, Calculators & 13 Certifications) */}
              <SEODirectoryFooter
                onOpenTool={(toolId) => {
                  setActiveToolSection(toolId);
                  setToolsResetKey((k) => k + 1);
                  setRoute({ name: 'tools', initialSection: toolId });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenCourse={(courseId) => {
                  try {
                    window.history.replaceState(
                      {},
                      '',
                      `${window.location.origin}${window.location.pathname}?section=trainings&course=${courseId}`
                    );
                  } catch {
                    // ignore
                  }
                  setRoute({ name: 'trainings' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateSection={(sec) => {
                  handleNavigateWebsiteSection(sec);
                }}
              />
            </div>
          )}

          {/* ==================== 2. JOBS PAGE (/jobs) ==================== */}
          {route.name === 'jobs' && (
            <div className="space-y-3.5 px-0.5">
              <div className="flex items-center justify-between pt-0.5">
                <div>
                  <h1 className="text-[16px] sm:text-[18px] font-extrabold text-[#1A2138] tracking-tight leading-snug">
                    Browse Jobs
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setJobSpecFilter('All');
                    setJobCountryFilter('All');
                    setJobCategoryFilter('All');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1673B8] hover:underline transition-colors cursor-pointer"
                >
                  <span>Reset Filters</span>
                </button>
              </div>

              {/* 2 Dropdowns: Country & Category */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={jobCountryFilter}
                    onChange={(e) => setJobCountryFilter(e.target.value)}
                    aria-label="Filter by Country"
                    className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl bg-[#1673B8] text-white text-xs font-bold shadow-2xs focus:outline-none cursor-pointer truncate"
                  >
                    <option value="All">All Countries</option>
                    {availableJobCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-white stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={jobCategoryFilter}
                    onChange={(e) => setJobCategoryFilter(e.target.value)}
                    aria-label="Filter by Category"
                    className={`w-full appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-bold border border-[#D2DEEA] focus:outline-none cursor-pointer truncate ${
                      jobCategoryFilter !== 'All'
                        ? 'bg-[#1673B8] text-white border-[#1673B8]'
                        : 'bg-white text-[#1A2138]'
                    }`}
                  >
                    <option value="All">All Categories</option>
                    {availableJobCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`w-4 h-4 stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      jobCategoryFilter !== 'All' ? 'text-white' : 'text-[#1A2138]'
                    }`}
                  />
                </div>
              </div>

              {/* Jobs Card List (Responsive 2-column grid on desktop, 1-column on mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {visibleJobs.length === 0 ? (
                  <div className="md:col-span-2 bg-white border border-[#D2DEEA] rounded-[22px] p-8 text-center text-gray-500 font-medium">
                    No jobs match the selected filters.
                  </div>
                ) : (
                  visibleJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isApplied={appliedJobIds.includes(job.id)}
                      onToggleApplied={handleToggleAppliedJob}
                      onClick={(j) => {
                        setRoute({ name: 'job-detail', jobId: j.id });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== JOB DETAIL PAGE (/jobs/[id]) ==================== */}
          {route.name === 'job-detail' &&
            (() => {
              const job =
                jobs.find((j) => j.id === route.jobId) || activeJobs[0];
              if (!job) return null;
              const isApplied = appliedJobIds.includes(job.id);

              // Auto-extract email, phone/WhatsApp, and links from job fields or text
              const detectedEmail =
                job.hrEmail ||
                job.description?.match(
                  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
                )?.[0] ||
                job.requirements?.match(
                  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
                )?.[0] ||
                '';

              const detectedPhone =
                (job as any).contactPhone ||
                (job as any).phone ||
                job.description?.match(
                  /(?:\+?92|0092|0)?\s?3\d{2}[ -]?\d{7}/
                )?.[0] ||
                job.requirements?.match(
                  /(?:\+?92|0092|0)?\s?3\d{2}[ -]?\d{7}/
                )?.[0] ||
                '';

              const detectedLink =
                job.applyLink && !job.applyLink.includes('#')
                  ? job.applyLink
                  : job.description?.match(/https?:\/\/[^\s]+/)?.[0] || '';

              const emailSubject =
                job.emailSubject || `Application for ${job.title} — ${job.company}`;

              const displayCategory = job.category || job.specialization || '';
              const displayCountry =
                job.country ||
                (job.location ? job.location.split(',').pop()?.trim() : '');

              return (
                <div className="bg-white border border-[#D2DEEA] rounded-[26px] p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-[#D2DEEA] pb-4">
                    <div className="space-y-1">
                      {/* Top tags: Unclickable Category & Country */}
                      <div className="flex flex-wrap items-center gap-1.5 select-none cursor-default pointer-events-none">
                        {displayCategory && (
                          <span className="inline-block px-2.5 py-0.5 rounded-[8px] bg-[#EBF4FC] text-[#1A2138] text-[11px] font-bold cursor-default pointer-events-none">
                            {displayCategory}
                          </span>
                        )}
                        {displayCountry && (
                          <span className="inline-block px-2.5 py-0.5 rounded-[8px] bg-[#F0F6FC] text-[#1673B8] text-[11px] font-bold cursor-default pointer-events-none">
                            {displayCountry}
                          </span>
                        )}
                      </div>
                      <h1 className="text-[16.5px] sm:text-[19px] font-extrabold text-[#1A2138] leading-snug pt-1 break-words">
                        {job.title}
                      </h1>
                      <p className="text-[12.5px] sm:text-sm font-semibold text-gray-600 break-words">
                        {job.company}
                      </p>
                    </div>

                    {/* Share Job Button */}
                    <button
                      type="button"
                      onClick={() =>
                        handleShareOpportunity(
                          job.title,
                          `Company: ${job.company} • Location: ${job.location || displayCountry}`
                        )
                      }
                      className="px-3.5 py-1.5 rounded-full bg-[#EBF4FC] hover:bg-[#D2DEEA] text-[#1673B8] font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 mt-0.5"
                      title="Share this job opportunity"
                    >
                      {copiedId === 'share-link' ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 stroke-[2.4]" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Location & Experience Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#F0F6FC]">
                      <div className="text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#1673B8]" />
                        <span>Location</span>
                      </div>
                      <div className="font-bold text-gray-900 mt-0.5">
                        {job.location || 'As mentioned in post'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F0F6FC]">
                      <div className="text-gray-500 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#1673B8]" />
                        <span>Experience &amp; Deadline</span>
                      </div>
                      <div className="font-bold text-gray-900 mt-0.5">
                        {job.experienceRequired || 'As per post'}
                        {job.expiryAt ? ` • Due ${job.expiryAt}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* Full Job Description */}
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Description
                    </h2>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                      <p>{job.description}</p>
                      {job.requirements && (
                        <div className="pt-2">
                          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                            Requirements &amp; Qualifications:
                          </h3>
                          <p>{job.requirements}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ==================== HOW TO APPLY BOX & VERIFICATION DISCLAIMER ==================== */}
                  <div className="rounded-[22px] bg-[#F0F6FC] border-2 border-[#1673B8] p-4 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#1673B8] text-white flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#1A2138]">
                          How to Apply &amp; Verification Disclaimer
                        </h3>
                        <p className="text-[11px] text-[#1673B8] font-semibold">
                          Official Application Guidelines
                        </p>
                      </div>
                    </div>

                    {/* Professional, Short & Precise Disclaimer */}
                    <div className="space-y-2 text-xs text-gray-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-[#D2DEEA]">
                      <p>
                        <strong>Disclaimer:</strong> We curate and share professional opportunities from credible food industry sources. However, it is each applicant&apos;s responsibility to independently verify all company, position, and location details before applying or attending an interview.
                      </p>
                      <p>
                        <strong>How to Apply:</strong> Send your updated CV, academic credentials, and certifications directly to the contact email below, or apply through the official link if provided in the post.
                      </p>
                    </div>

                    {/* Contact Details Box */}
                    {(detectedEmail || detectedPhone) && (
                      <div className="bg-white rounded-2xl p-3 border border-[#D2DEEA] space-y-2 text-xs">
                        {detectedEmail && (
                          <div>
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Employer HR Contact Email
                            </span>
                            <span className="font-extrabold text-[#1A2138] select-all break-all text-[13px]">
                              {detectedEmail}
                            </span>
                          </div>
                        )}

                        {detectedPhone && (
                          <div
                            className={
                              detectedEmail ? 'border-t border-[#D2DEEA] pt-2' : ''
                            }
                          >
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Contact / WhatsApp Number
                            </span>
                            <span className="font-extrabold text-[#1A2138] select-all text-[13px]">
                              {detectedPhone}
                            </span>
                          </div>
                        )}

                        {emailSubject && detectedEmail && (
                          <div className="border-t border-[#D2DEEA] pt-2">
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Recommended Email Subject Line
                            </span>
                            <span className="font-bold text-[#105E9A] select-all text-xs">
                              {emailSubject}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dynamic Action Buttons */}
                    <div className="space-y-2 pt-1">
                      {detectedEmail && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(detectedEmail, 'job-email')}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedId === 'job-email' ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              <span>Copied Contact Email!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy Contact Email</span>
                            </>
                          )}
                        </button>
                      )}

                      {detectedPhone && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(detectedPhone, 'job-phone')}
                          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F0F6FC] border-2 border-[#1673B8] text-[#1A2138] font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedId === 'job-phone' ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5] text-[#1673B8]" />
                              <span>Copied Contact Number!</span>
                            </>
                          ) : (
                            <>
                              <Phone className="w-4 h-4 text-[#1673B8]" />
                              <span>Copy Contact Number</span>
                            </>
                          )}
                        </button>
                      )}

                      {detectedLink && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(detectedLink, 'job-link')}
                          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F0F6FC] border border-[#BBD6EE] text-[#1A2138] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedId === 'job-link' ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5] text-[#1673B8]" />
                              <span>Copied Application Link!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-[#1673B8]" />
                              <span>Copy Application Link</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Personal 'Mark as Applied' Checkbox (Preserved) */}
                  <label className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EBF4FC] border border-[#9AC2E6] cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isApplied}
                        onChange={() => handleToggleAppliedJob(job.id)}
                        className="w-5 h-5 accent-[#1673B8] rounded cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-[#1A2138]">
                          Mark as Applied
                        </div>
                        <div className="text-[11px] text-gray-600">
                          Track your personal external submission locally
                        </div>
                      </div>
                    </div>
                    {isApplied && (
                      <span className="px-2.5 py-1 rounded-full bg-[#1673B8] text-white text-[11px] font-extrabold">
                        Applied ✓
                      </span>
                    )}
                  </label>
                </div>
              );
            })()}

          {/* ==================== 3. SCHOLARSHIPS PAGE (/scholarships) ==================== */}
          {route.name === 'scholarships' && (
            <div className="space-y-3.5 px-0.5">
              <div className="flex items-center justify-between pt-0.5">
                <div>
                  <h1 className="text-[16px] sm:text-[18px] font-extrabold text-[#1A2138] tracking-tight leading-snug">
                    Scholarships for you
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSchSpecFilter('All');
                    setSchCountryFilter('All');
                    setSchFundingFilter('All');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1673B8] hover:underline transition-colors cursor-pointer shrink-0"
                >
                  <ListFilter className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 2 Dropdowns: Country & Funding */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={schCountryFilter}
                    onChange={(e) => setSchCountryFilter(e.target.value)}
                    aria-label="Filter by Country"
                    className="w-full appearance-none pl-3 pr-6 py-2 rounded-xl bg-[#1673B8] text-white text-xs font-bold shadow-2xs focus:outline-none cursor-pointer truncate"
                  >
                    <option value="All">All Countries</option>
                    {availableScholarshipCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-white stroke-[2.5] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={schFundingFilter}
                    onChange={(e) => setSchFundingFilter(e.target.value)}
                    aria-label="Filter by Funding"
                    className={`w-full appearance-none pl-3 pr-6 py-2 rounded-xl text-xs font-bold border border-[#D2DEEA] focus:outline-none cursor-pointer truncate ${
                      schFundingFilter !== 'All'
                        ? 'bg-[#1673B8] text-white border-[#1673B8]'
                        : 'bg-white text-[#1A2138]'
                    }`}
                  >
                    <option value="All">All Funding Types</option>
                    <option value="Fellowships">Fellowships</option>
                    <option value="International">International</option>
                    <option value="Grants">Grants</option>
                  </select>
                  <ChevronDown
                    className={`w-3.5 h-3.5 stroke-[2.5] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                      schFundingFilter !== 'All' ? 'text-white' : 'text-[#1673B8]'
                    }`}
                  />
                </div>
              </div>

              {/* Scholarships Card List (Responsive 2-column grid on desktop, 1-column on mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-0.5">
                {visibleScholarships.length === 0 ? (
                  <div className="md:col-span-2 bg-white border border-[#D2DEEA] rounded-2xl p-6 text-center text-slate-500 font-medium text-xs">
                    No scholarships match the selected filters.
                  </div>
                ) : (
                  visibleScholarships.map((sch) => {
                    const daysLeft = getDaysRemaining(sch.deadline);
                    const isSaved = savedScholarshipIds.includes(sch.id);
                    const isApplied = appliedScholarshipIds.includes(sch.id);

                    const BadgeIcon =
                      sch.fundingType === 'International'
                        ? Globe
                        : sch.fundingType === 'Grants'
                        ? Trophy
                        : GraduationCap;

                    return (
                      <div
                        key={sch.id}
                        className="bg-white border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-3.5 sm:p-4 shadow-2xs transition-all space-y-2.5"
                      >
                        {/* Top Row: Royal Blue Icon Box + Title & Organization */}
                        <div className="flex items-start justify-between gap-2.5 border-b border-slate-100 pb-2.5">
                          <div
                            onClick={() => {
                              setRoute({
                                name: 'scholarship-detail',
                                scholarshipId: sch.id
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-start gap-2.5 min-w-0 cursor-pointer flex-1"
                          >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] flex items-center justify-center shrink-0">
                              <BadgeIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                            </div>
                            <div className="min-w-0 pt-0.5 flex-1">
                              <h3 className="text-[14px] sm:text-[15px] font-extrabold text-[#1A2138] leading-snug break-words">
                                {sch.title}
                              </h3>
                              <p className="text-[11.5px] sm:text-[12.5px] font-medium text-slate-600 mt-0.5 leading-snug break-words">
                                {sch.organization}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            title={
                              isSaved ? 'Saved Scholarship' : 'Save Scholarship'
                            }
                            onClick={(e) =>
                              handleToggleSavedScholarship(sch.id, e)
                            }
                            className="p-1.5 rounded-xl text-[#1673B8] hover:bg-[#F0F6FC] transition-colors shrink-0 cursor-pointer"
                          >
                            <Bookmark
                              className={`w-4 h-4 stroke-[2.2] ${
                                isSaved
                                  ? 'fill-[#1673B8] text-[#1673B8]'
                                  : 'text-[#1673B8]'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Middle Row: Unclickable Info Tags */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2.5 select-none cursor-default pointer-events-none"
                        >
                          <span className="px-2 py-0.5 rounded-md bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] font-bold inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#1673B8] stroke-[2.2] shrink-0" />
                            <span>{sch.country}</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] font-bold inline-flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-[#1673B8] stroke-[2.2] shrink-0" />
                            <span>{sch.fundingType}</span>
                          </span>

                          {isApplied && (
                            <span className="px-2 py-0.5 rounded-md bg-[#1673B8] text-white text-[10px] font-bold inline-flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[2.5] shrink-0" />
                              <span>Applied</span>
                            </span>
                          )}
                        </div>

                        {/* Bottom Row: Deadline + Royal Blue Button */}
                        <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
                          <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                            Deadline {sch.deadline} ({daysLeft}d left)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setRoute({
                                name: 'scholarship-detail',
                                scholarshipId: sch.id
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-[11.5px] font-bold shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                          >
                            See Details
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ==================== SCHOLARSHIP DETAIL PAGE (/scholarships/[id]) ==================== */}
          {route.name === 'scholarship-detail' &&
            (() => {
              const sch =
                scholarships.find((s) => s.id === route.scholarshipId) ||
                activeScholarships[0];
              if (!sch) return null;
              const daysLeft = getDaysRemaining(sch.deadline);
              const isApplied = appliedScholarshipIds.includes(sch.id);

              // Auto-extract email, phone, and links from scholarship fields or text
              const detectedEmail =
                sch.hrEmail ||
                sch.description?.match(
                  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
                )?.[0] ||
                sch.eligibility?.match(
                  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
                )?.[0] ||
                '';

              const detectedPhone =
                (sch as any).contactPhone ||
                (sch as any).phone ||
                sch.description?.match(
                  /(?:\+?\d{1,3}[ -]?)?\(?\d{3,4}\)?[ -]?\d{3,4}[ -]?\d{3,4}/
                )?.[0] ||
                sch.eligibility?.match(
                  /(?:\+?\d{1,3}[ -]?)?\(?\d{3,4}\)?[ -]?\d{3,4}[ -]?\d{3,4}/
                )?.[0] ||
                '';

              const detectedLink =
                sch.applyLink && !sch.applyLink.includes('#')
                  ? sch.applyLink
                  : sch.description?.match(/https?:\/\/[^\s]+/)?.[0] || '';

              const emailSubject =
                sch.emailSubject ||
                `Scholarship Inquiry: ${sch.title} — ${sch.organization}`;

              const displayFunding =
                sch.fundingType || sch.specialization || 'Scholarship';
              const displayCountry = sch.country || 'International';

              return (
                <div className="bg-white border border-[#D2DEEA] rounded-[26px] p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-[#D2DEEA] pb-4">
                    <div className="space-y-1">
                      {/* Top tags: Unclickable Funding Type & Country */}
                      <div className="flex flex-wrap items-center gap-1.5 select-none cursor-default pointer-events-none">
                        <span className="inline-block px-2.5 py-0.5 rounded-[8px] bg-[#EBF4FC] text-[#1A2138] text-[11px] font-bold cursor-default pointer-events-none">
                          {displayFunding}
                        </span>
                        <span className="inline-block px-2.5 py-0.5 rounded-[8px] bg-[#F0F6FC] text-[#1673B8] text-[11px] font-bold cursor-default pointer-events-none">
                          {displayCountry}
                        </span>
                      </div>
                      <h1 className="text-[16.5px] sm:text-[19px] font-extrabold text-[#1A2138] leading-snug pt-1 break-words">
                        {sch.title}
                      </h1>
                      <p className="text-[12.5px] sm:text-sm font-semibold text-gray-600 break-words">
                        {sch.organization}
                      </p>
                    </div>

                    {/* Share Scholarship Button */}
                    <button
                      type="button"
                      onClick={() =>
                        handleShareOpportunity(
                          sch.title,
                          `Organization: ${sch.organization} • Country: ${sch.country} • Deadline: ${sch.deadline}`
                        )
                      }
                      className="px-3.5 py-1.5 rounded-full bg-[#EBF4FC] hover:bg-[#D2DEEA] text-[#1673B8] font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 mt-0.5"
                      title="Share this scholarship"
                    >
                      {copiedId === 'share-link' ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 stroke-[2.4]" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Country & Deadline Countdown Cards */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#F0F6FC]">
                      <div className="text-gray-500">Host Country</div>
                      <div className="font-bold text-gray-900 mt-0.5">
                        {sch.country || 'International'}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#EBF4FC] border border-[#D2DEEA]">
                      <div className="text-[#105E9A]">Deadline Countdown</div>
                      <div className="font-bold text-[#1A2138] mt-0.5 tabular-nums">
                        {sch.deadline} ({daysLeft}d left)
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Description
                    </h2>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
                      <p>{sch.description}</p>
                      {sch.eligibility && (
                        <div className="pt-2">
                          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                            Eligibility Criteria:
                          </h3>
                          <p>{sch.eligibility}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ==================== HOW TO APPLY BOX & VERIFICATION DISCLAIMER ==================== */}
                  <div className="rounded-[22px] bg-[#F0F6FC] border-2 border-[#1673B8] p-4 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#1673B8] text-white flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#1A2138]">
                          How to Apply &amp; Verification Disclaimer
                        </h3>
                        <p className="text-[11px] text-[#1673B8] font-semibold">
                          Official Application Guidelines
                        </p>
                      </div>
                    </div>

                    {/* Professional English Disclaimer & Application Instructions */}
                    <div className="space-y-2 text-xs text-gray-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-[#D2DEEA]">
                      <p>
                        <strong>Disclaimer:</strong> We curate and share authentic, verified scholarship opportunities from reputable academic and research institutions. However, it is each individual applicant&apos;s responsibility to independently verify all eligibility requirements, institution credentials, and official deadlines before applying.
                      </p>
                      <p>
                        <strong>How to Apply:</strong> Prepare your academic transcripts, CV, and required documentation, then submit directly to the admissions contact email below or apply via the official institution link as per instructions.
                      </p>
                    </div>

                    {/* Contact & Email Details Box */}
                    {(detectedEmail || detectedPhone) && (
                      <div className="bg-white rounded-2xl p-3 border border-[#D2DEEA] space-y-2 text-xs">
                        {detectedEmail && (
                          <div>
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Admissions / Coordinator Email
                            </span>
                            <span className="font-extrabold text-[#1A2138] select-all break-all text-[13px]">
                              {detectedEmail}
                            </span>
                          </div>
                        )}

                        {detectedPhone && (
                          <div
                            className={
                              detectedEmail ? 'border-t border-[#D2DEEA] pt-2' : ''
                            }
                          >
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Contact / Coordinator Number
                            </span>
                            <span className="font-extrabold text-[#1A2138] select-all text-[13px]">
                              {detectedPhone}
                            </span>
                          </div>
                        )}

                        {emailSubject && detectedEmail && (
                          <div className="border-t border-[#D2DEEA] pt-2">
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Recommended Email Subject Line
                            </span>
                            <span className="font-bold text-[#105E9A] select-all text-xs">
                              {emailSubject}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dynamic Action Buttons */}
                    <div className="space-y-2 pt-1">
                      {detectedEmail && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(detectedEmail, 'sch-email')}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedId === 'sch-email' ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              <span>Copied Contact Email!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy Contact Email</span>
                            </>
                          )}
                        </button>
                      )}

                      {detectedPhone && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(detectedPhone, 'sch-phone')}
                          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F0F6FC] border-2 border-[#1673B8] text-[#1A2138] font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedId === 'sch-phone' ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5] text-[#1673B8]" />
                              <span>Copied Contact Number!</span>
                            </>
                          ) : (
                            <>
                              <Phone className="w-4 h-4 text-[#1673B8]" />
                              <span>Copy Contact Number</span>
                            </>
                          )}
                        </button>
                      )}

                      {detectedLink && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(detectedLink, 'sch-link')}
                          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F0F6FC] border border-[#BBD6EE] text-[#1A2138] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedId === 'sch-link' ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5] text-[#1673B8]" />
                              <span>Copied Official Link!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-[#1673B8]" />
                              <span>Copy Application Link</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Personal 'Mark as Applied' Checkbox (Preserved) */}
                  <label className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EBF4FC] border border-[#9AC2E6] cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isApplied}
                        onChange={() => handleToggleAppliedScholarship(sch.id)}
                        className="w-5 h-5 accent-[#1673B8] rounded cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-[#1A2138]">
                          Mark as Applied
                        </div>
                        <div className="text-[11px] text-gray-600">
                          Track your scholarship application status locally
                        </div>
                      </div>
                    </div>
                    {isApplied && (
                      <span className="px-2.5 py-1 rounded-full bg-[#1673B8] text-white text-[11px] font-extrabold">
                        Applied ✓
                      </span>
                    )}
                  </label>
                </div>
              );
            })()}

          {/* ==================== 4. GLOBAL PORTAL SEARCH PAGE (/search) ==================== */}
          {route.name === 'search' && (
            <div className="space-y-4 px-1">
              <div className="bg-white border border-[#D2DEEA] rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <h1 className="text-base sm:text-lg font-extrabold text-[#1A2138] tracking-tight">
                      Global Portal Search
                    </h1>
                    <p className="text-xs text-slate-600 font-medium">
                      Search across Food Science Tools, Calculators, Jobs, Scholarships, Trainings &amp; Verified Specialists
                    </p>
                  </div>
                  {!isCurrentUserPaid && !isUserAdmin && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10.5px] font-bold">
                      <span>Free Account View (Contact Info &amp; Paid Content Protected)</span>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-[#1673B8] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    autoFocus
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    placeholder="Search tools, E-numbers, jobs, scholarships, trainings, specialists..."
                    className="w-full pl-10 pr-9 py-3.5 text-sm font-medium bg-[#F8FAFC] border-[1.5px] border-[#BBD6EE] rounded-[20px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1673B8] focus:bg-white shadow-2xs"
                  />
                  {globalSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setGlobalSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {(
                    [
                      'All',
                      'Tools',
                      'Jobs',
                      'Scholarships',
                      'Trainings',
                      'Members'
                    ] as const
                  ).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSearchTab(t)}
                      className={`px-4 py-2 rounded-[14px] text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        searchTab === t
                          ? 'bg-[#1673B8] text-white'
                          : 'bg-[#F0F6FC] border border-[#D2DEEA] text-[#1A2138] hover:bg-[#E1EEF9]'
                      }`}
                    >
                      {t === 'Members' ? 'Specialists' : t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {/* 1. SPECIALIST TOOLS & CALCULATORS */}
                {(searchTab === 'All' || searchTab === 'Tools') &&
                  searchResults.tools.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#105E9A] px-1">
                        Food Science Tools &amp; Calculators ({searchResults.tools.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {searchResults.tools.map((tool) => (
                          <div
                            key={tool.id}
                            onClick={() => {
                              setActiveToolSection(tool.id);
                              setRoute({
                                name: 'tools',
                                initialSection: tool.id
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-white border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer shadow-2xs transition-all"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="text-[10.5px] font-extrabold text-[#1673B8] uppercase tracking-wider">
                                {tool.category}
                              </div>
                              <div className="text-sm sm:text-[15px] font-extrabold text-[#1A2138]">
                                {tool.title}
                              </div>
                              <div className="text-xs text-slate-600 line-clamp-2">
                                {tool.description}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#1673B8] shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 2. JOBS */}
                {(searchTab === 'All' || searchTab === 'Jobs') && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#105E9A] px-1">
                      Jobs ({searchResults.jobs.length})
                    </h2>
                    {searchResults.jobs.length === 0 ? (
                      <div className="bg-white border border-[#D2DEEA] rounded-2xl p-4 text-xs text-slate-500 font-medium">
                        No matching job postings found.
                      </div>
                    ) : (
                      searchResults.jobs.map((j) => (
                        <JobCard
                          key={j.id}
                          job={j}
                          isApplied={appliedJobIds.includes(j.id)}
                          onToggleApplied={handleToggleAppliedJob}
                          onClick={(job) =>
                            setRoute({ name: 'job-detail', jobId: job.id })
                          }
                        />
                      ))
                    )}
                  </div>
                )}

                {/* 3. SCHOLARSHIPS */}
                {(searchTab === 'All' || searchTab === 'Scholarships') && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#105E9A] px-1">
                      Scholarships ({searchResults.scholarships.length})
                    </h2>
                    {searchResults.scholarships.length === 0 ? (
                      <div className="bg-white border border-[#D2DEEA] rounded-2xl p-4 text-xs text-slate-500 font-medium">
                        No matching scholarships found.
                      </div>
                    ) : (
                      searchResults.scholarships.map((s) => (
                        <div
                          key={s.id}
                          onClick={() =>
                            setRoute({
                              name: 'scholarship-detail',
                              scholarshipId: s.id
                            })
                          }
                          className="bg-white border border-[#D2DEEA] rounded-[24px] p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-[#1673B8] shadow-xs"
                        >
                          <div>
                            <div className="text-[11px] font-bold text-[#1673B8]">
                              {s.fundingType} • {s.country}
                            </div>
                            <div className="text-base font-bold text-[#1A2138]">
                              {s.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {s.organization}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 4. TRAININGS */}
                {(searchTab === 'All' || searchTab === 'Trainings') && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#105E9A] px-1">
                      Trainings &amp; Courses ({searchResults.trainings.length})
                    </h2>
                    {searchResults.trainings.length === 0 ? (
                      <div className="bg-white border border-[#D2DEEA] rounded-2xl p-4 flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500 font-medium">
                          Browse international HACCP, ISO 22000 &amp; Food Safety courses in the Trainings Academy.
                        </span>
                        <button
                          type="button"
                          onClick={() => setRoute({ name: 'trainings' })}
                          className="px-3 py-1.5 rounded-xl bg-[#1673B8] text-white text-xs font-extrabold shrink-0 cursor-pointer"
                        >
                          Open Academy →
                        </button>
                      </div>
                    ) : (
                      searchResults.trainings.map((t) => (
                        <div
                          key={t.id}
                          onClick={() =>
                            setRoute({
                              name: 'training-detail',
                              trainingId: t.id
                            })
                          }
                          className="bg-white border border-[#D2DEEA] rounded-[24px] p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-[#1673B8] shadow-xs"
                        >
                          <div>
                            <div className="text-[11px] font-bold text-[#1673B8]">
                              {t.category} {t.subType ? `• ${t.subType}` : ''}
                            </div>
                            <div className="text-base font-bold text-[#1A2138]">
                              {t.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {t.duration} • {t.fees}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 5. VERIFIED PAID SPECIALISTS (CONTACT DETAILS STRICTLY HIDDEN FROM FREE USERS) */}
                {(searchTab === 'All' || searchTab === 'Members') && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#105E9A] px-1">
                      Verified Paid Specialists ({searchResults.members.length})
                    </h2>
                    {searchResults.members.length === 0 ? (
                      <div className="bg-white border border-[#D2DEEA] rounded-2xl p-4 text-xs text-slate-500 font-medium">
                        No matching verified specialists found.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {searchResults.members.map((m) => (
                          <MemberCard
                            key={m.uid}
                            member={m}
                            viewerIsPremium={isCurrentUserPaid || isUserAdmin}
                            viewerUid={myProfile.uid}
                            onClick={(mem) => {
                              setRoute({
                                name: 'community-member',
                                uid: mem.uid
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== 5. COMMUNITY — PREMIUM PROFILES LIST (/communities) ==================== */}
          {route.name === 'communities' && (
            <div className="space-y-3.5 px-0.5">
              {/* Top Single Community Search Bar & Location Filter */}
              <div className="bg-white border border-[#D2DEEA] rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-[15px] sm:text-[17px] font-extrabold text-[#1A2138] leading-snug tracking-tight">
                      Premium Community Directory
                    </h1>
                    <span className="px-2 py-0.5 rounded-md bg-[#1673B8] text-white text-[10px] font-extrabold inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{paidCommunityMembers.length} Verified</span>
                    </span>
                  </div>

                  {(isCurrentUserPaid || isUserAdmin) && (
                    <button
                      type="button"
                      onClick={() =>
                        setRoute({
                          name: 'community-member',
                          uid: myProfile.uid
                        })
                      }
                      className="px-2.5 py-1 rounded-xl bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#D2DEEA] text-[#1673B8] text-[10.5px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>My Public View</span>
                    </button>
                  )}
                </div>

                {/* Single Community Search Bar + Country/Location Filter */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="relative sm:col-span-2">
                    <Search className="w-4 h-4 text-[#1673B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      placeholder="Search Community by Name, Title, or Company..."
                      className="w-full pl-9 pr-8 py-2 text-xs bg-[#F8FAFC] border border-[#D2DEEA] rounded-xl text-[#1A2138] placeholder:text-slate-400 focus:outline-none focus:border-[#1673B8] focus:bg-white transition-colors"
                    />
                    {memberSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setMemberSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <select
                      value={commCountryFilter}
                      onChange={(e) => setCommCountryFilter(e.target.value)}
                      className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-[#1A2138] text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Locations</option>
                      {availableCommunityLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                      {!availableCommunityLocations.includes('Pakistan') && (
                        <option value="Pakistan">Pakistan</option>
                      )}
                      {!availableCommunityLocations.includes('UAE') && (
                        <option value="UAE">UAE</option>
                      )}
                      {!availableCommunityLocations.includes('Saudi Arabia') && (
                        <option value="Saudi Arabia">Saudi Arabia</option>
                      )}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#1673B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Free User Banner: Explains that Free Users' own profiles are not listed in Communities, and Paid Members' Contact Info (WhatsApp & Email) is hidden until they upgrade */}
              {!isCurrentUserPaid && !isUserAdmin && (
                <div className="bg-white border border-[#1673B8]/35 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#F0F6FC] text-[#1673B8] text-[10.5px] font-extrabold">
                        <Crown className="w-3 h-3 text-[#1673B8]" />
                        <span>Free Account Preview Mode</span>
                      </span>
                      <h2 className="text-sm sm:text-base font-extrabold text-[#1A2138]">
                        Your Profile is Hidden • Paid Members&apos; Contact Info is Locked
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        You can view Paid Specialists&apos; profiles below, but their WhatsApp numbers &amp; Emails are hidden for Free users, and Free users&apos; profiles do not appear in the Community. Upgrade to Paid Membership (Rs. {liveGateway.monthlyFeeRs.toLocaleString()} / 1 Month or Rs. {liveGateway.yearlyFeeRs.toLocaleString()} / Year) to publish your profile and unlock direct WhatsApp &amp; Email contact.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setPaySubmitBanner(null);
                          setPayMethod('Bank Transfer');
                          setShowPremiumUpgradeModal(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Crown className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Buy Premium Membership</span>
                      </button>
                      {(myPaymentApplications.length > 0 ||
                        (myProfile.paymentStatus &&
                          myProfile.paymentStatus !== 'none')) && (
                        <button
                          type="button"
                          onClick={() => setShowApplicationStatusModal(true)}
                          className="px-3.5 py-2 rounded-xl bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#1673B8] text-[#1673B8] font-extrabold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <Clock className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
                          <span>
                            Application Status (
                            {myProfile.paymentStatus === 'pending'
                              ? 'Under Review'
                              : myProfile.paymentStatus === 'rejected'
                              ? 'Action Needed'
                              : 'Check'}
                            )
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PAID MEMBERS PROFILES LIST (Visible to both Paid and Free users; Contact info is hidden for Free users inside MemberCard & PublicProfileView; Free users' profiles never appear here) */}
              {filteredMembers.length === 0 ? (
                <div className="bg-white border border-[#D2DEEA] rounded-2xl p-6 text-center space-y-2 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-[#F0F6FC] text-[#1673B8] flex items-center justify-center mx-auto">
                    <Search className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm font-extrabold text-[#1A2138]">
                    No Matching Paid Members Found
                  </h2>
                  <p className="text-xs text-slate-600">
                    Paid members who activate their Premium Membership will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMembers.map((member) => (
                    <MemberCard
                      key={member.uid}
                      member={member}
                      viewerIsPremium={isCurrentUserPaid || isUserAdmin}
                      viewerUid={myProfile.uid}
                      onClick={(m) => {
                        setRoute({ name: 'community-member', uid: m.uid });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== PART 3: PUBLIC PROFILE VIEW (/profile/[userId]) ==================== */}
          {route.name === 'community-member' &&
            (() => {
              const member =
                route.uid === myProfile.uid
                  ? myProfile
                  : paidCommunityMembers.find((u) => u.uid === route.uid) ||
                    users.find((u) => u.uid === route.uid) ||
                    myProfile;

              if (!member) return null;

              return (
                <PublicProfileView
                  member={member}
                  viewerIsPremium={isCurrentUserPaid || isUserAdmin}
                  viewerUid={myProfile.uid}
                  isViewerAdmin={isUserAdmin}
                  onBack={() => {
                    if (route.uid === myProfile.uid) {
                      setRoute({ name: 'profile' });
                    } else {
                      setRoute({ name: 'communities' });
                    }
                  }}
                  onEditOwnProfile={() => setRoute({ name: 'profile' })}
                  onMessageOrContact={(mem) => setContactModalMember(mem)}
                  onRequestUpgradeToPremium={() => {
                    setPaySubmitBanner(null);
                    setShowPremiumUpgradeModal(true);
                  }}
                />
              );
            })()}

          {/* ==================== 6. INTERNATIONAL CERTIFICATION TRAININGS ACADEMY & VERIFICATION PORTAL (/trainings) ==================== */}
          {(route.name === 'trainings' ||
            route.name === 'trainings-highfield' ||
            route.name === 'trainings-lead-auditor-hub' ||
            route.name === 'training-detail') && (
            <TrainingsAcademyView
              trainings={trainings}
              currentUser={myProfile}
              users={users}
              certificates={certificates}
              paymentRequests={adminAllPaymentRequests}
              paymentGatewayConfig={liveGateway}
              isCurrentUserPremiumActive={isCurrentUserPaid}
              isUserPremiumActiveFn={(u) =>
                Boolean(u && (isMemberPremiumActive(u) || u.isAdmin))
              }
              onSaveCourseProgress={handleSaveCourseProgress}
              onSubmitCertificatePaymentRequest={
                handleSubmitCertificatePaymentRequest
              }
              onOpenUpgradeModal={() => {
                setPaySubmitBanner(null);
                setShowPremiumUpgradeModal(true);
              }}
              onRequireSignIn={() => setShowGuestAuthModal(true)}
            />
          )}

          {/* ==================== 6C. SPECIALIST TOOLS HUB (/tools) ==================== */}
          {route.name === 'tools' && (
            <ToolsHubView
              user={myProfile}
              isUserPaid={isCurrentUserPaid}
              hasExpiredPremium={hasExpiredPremium}
              monthlyFeeRs={liveGateway.monthlyFeeRs}
              yearlyFeeRs={liveGateway.yearlyFeeRs}
              onSaveToolsData={handleSaveUserToolsData}
              onOpenPremiumModal={() => {
                setPaySubmitBanner(null);
                setShowPremiumUpgradeModal(true);
              }}
              onRequireSignIn={() => setShowGuestAuthModal(true)}
              onGoToProfileTools={() => {
                setRoute({ name: 'profile' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              initialSection={route.initialSection || 'hub'}
              resetTrigger={toolsResetKey}
              onActiveSectionChange={(sec) => setActiveToolSection(sec)}
            />
          )}

          {/* ==================== 7. MY OWN PROFILE — CREATE / EDIT VIEW (/profile & /profile/edit) ==================== */}
          {route.name === 'profile' && (
            <EditProfileView
              profile={myProfile}
              onChangeProfile={setMyProfile}
              onSaveProfile={handleSaveProfileModel}
              onUploadAvatar={handleUploadAvatarFile}
              onUploadCv={handleUploadCvFile}
              onDeleteCv={handleDeleteCvFile}
              onBack={() => setRoute({ name: 'home' })}
              onPreviewPublicProfile={() =>
                setRoute({ name: 'community-member', uid: myProfile.uid })
              }
              isUploadingMedia={isUploadingMedia}
              uploadStatusMsg={uploadStatusMsg}
              profileSaveMsg={profileSaveMsg}
              isUserAdmin={isUserAdmin}
              onOpenAdmin={() => setAdminPreviewUserMode(false)}
              onOpenPremiumModal={() => {
                setPaySubmitBanner(null);
                setShowPremiumUpgradeModal(true);
              }}
              hasSubmittedApplication={
                myPaymentApplications.length > 0 ||
                Boolean(
                  myProfile.paymentStatus &&
                    myProfile.paymentStatus !== 'none'
                )
              }
              onOpenApplicationStatusModal={() => {
                setShowApplicationStatusModal(true);
              }}
              onOpenLegalModal={(tab) => setLegalModalTab(tab)}
              onDeleteOwnAccount={handleDeleteOwnAccount}
              onOpenToolsSection={(sec) => {
                setRoute({ name: 'tools', initialSection: sec || 'hub' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              monthlyFeeRs={liveGateway.monthlyFeeRs}
              yearlyFeeRs={liveGateway.yearlyFeeRs}
              yearlyDiscountPct={liveGateway.yearlyDiscountPct}
            />
          )}

          {/* ==================== 8. ADMIN CLOUD STORAGE & RECEIPTS CONSOLE (/admin) ==================== */}
          {route.name === 'admin' && isUserAdmin && (
            <div className="space-y-4 px-1">
              <div className="bg-gradient-to-r from-[#1A2138] via-[#105E9A] to-[#1673B8] rounded-[24px] p-5 text-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-sky-200 text-[10.5px] font-extrabold">
                    Admin Cloud Storage &amp; Control Center
                  </span>
                  <button
                    type="button"
                    onClick={handleExportFullBackupJson}
                    className="px-3 py-1 rounded-full bg-white text-[#1A2138] text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Backup All Data</span>
                  </button>
                </div>
                <h1 className="text-[22px] font-extrabold leading-tight">
                  Cloud Storage &amp; Data Vault
                </h1>
                <p className="text-xs text-sky-100 leading-relaxed">
                  Manage high-traffic storage for User Profiles, Avatars, CVs, Payment Receipts, Jobs &amp; Scholarships.
                </p>
              </div>

              {adminStatusBanner && (
                <div className="p-3.5 rounded-2xl bg-[#1673B8] text-white text-xs font-extrabold flex items-center justify-between shadow-xs">
                  <span>{adminStatusBanner}</span>
                  <button
                    type="button"
                    onClick={() => setAdminStatusBanner(null)}
                    className="underline ml-2"
                  >
                    OK
                  </button>
                </div>
              )}

              {/* 3 Admin Navigation Tabs */}
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'storage', label: '1. Cloud Storage' },
                    {
                      id: 'receipts',
                      label: `2. Receipts (${adminAllPaymentRequests.length})`
                    },
                    { id: 'opportunities', label: '3. Jobs & Scholars' }
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAdminTab(t.id)}
                    className={`py-2.5 px-2.5 rounded-2xl text-xs font-extrabold border transition-colors cursor-pointer ${
                      adminTab === t.id
                        ? 'bg-[#1673B8] text-white border-[#1673B8] shadow-xs'
                        : 'bg-white text-[#1A2138] border-[#D2DEEA] hover:bg-[#F0F6FC]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: CLOUD STORAGE ARCHITECTURE & LIVE METRICS */}
              {adminTab === 'storage' && (
                <div className="space-y-4">
                  <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-extrabold text-[#1A2138] flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-[#1673B8]" />
                        <span>Live Cloud Storage Collections Status</span>
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[10.5px] font-extrabold">
                        100% Free Active
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      <div className="p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
                        <div className="text-gray-500 font-semibold">
                          User Profiles &amp; Pics
                        </div>
                        <div className="text-lg font-extrabold text-[#1A2138] mt-0.5">
                          {users.length} Users
                        </div>
                        <div className="text-[10.5px] text-[#1673B8] font-bold">
                          /users + /private/profile
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
                        <div className="text-gray-500 font-semibold">
                          Payment Receipts
                        </div>
                        <div className="text-lg font-extrabold text-[#1A2138] mt-0.5">
                          {adminAllPaymentRequests.length} Receipts
                        </div>
                        <div className="text-[10.5px] text-[#1673B8] font-bold">
                          /paymentRequests
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
                        <div className="text-gray-500 font-semibold">
                          Jobs &amp; Scholarships
                        </div>
                        <div className="text-lg font-extrabold text-[#1A2138] mt-0.5">
                          {jobs.length + scholarships.length} Posts
                        </div>
                        <div className="text-[10.5px] text-[#1673B8] font-bold">
                          {jobs.length} Jobs • {scholarships.length} Scholarships
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STORAGE ENGINE CONFIGURATION (SMART WEBP VS 25GB CLOUDINARY FREE CDN) */}
                  <form
                    onSubmit={handleSaveStorageConfig}
                    className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-3.5"
                  >
                    <div>
                      <h3 className="text-base font-extrabold text-[#1A2138]">
                        High-Traffic Free Media Storage Engine
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Choose how Profile Photos, Payment Receipts &amp; CVs are stored:
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label
                        onClick={() =>
                          setStorageConfig({
                            ...storageConfig,
                            provider: 'smart-firestore'
                          })
                        }
                        className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          storageConfig.provider === 'smart-firestore'
                            ? 'bg-[#F0F6FC] border-2 border-[#1673B8]'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#1A2138]">
                            Tier 1: Smart WebP Compression + Firebase Firestore (Default)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#1673B8] text-white text-[10px] font-bold">
                            Active &amp; Free
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1">
                          Automatically compresses 5MB photos, receipts &amp; certificates down to ~80 KB WebP before saving to Firestore. Zero external account needed; supports 10,000+ records free.
                        </p>
                      </label>

                      <label
                        onClick={() =>
                          setStorageConfig({
                            ...storageConfig,
                            provider: 'cloudinary'
                          })
                        }
                        className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          storageConfig.provider === 'cloudinary'
                            ? 'bg-[#F0F6FC] border-2 border-[#1673B8]'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#1A2138]">
                            Tier 2: Cloudinary 25 GB Free Global CDN (Massive Traffic)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[10px] font-bold">
                            25 GB Free
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1">
                          Uploads images, receipts, PDFs &amp; certificates to Cloudinary&apos;s free 25 GB CDN and saves only the tiny HTTPS URL (~80 bytes) in Firestore for 100,000+ users.
                        </p>
                      </label>
                    </div>

                    {storageConfig.provider === 'cloudinary' && (
                      <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
                        <div>
                          <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                            Cloudinary Cloud Name (Free Account at cloudinary.com)
                          </label>
                          <input
                            type="text"
                            value={storageConfig.cloudinaryCloudName}
                            onChange={(e) =>
                              setStorageConfig({
                                ...storageConfig,
                                cloudinaryCloudName: e.target.value
                              })
                            }
                            placeholder="e.g. dxyz12345"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                            Unsigned Upload Preset Name
                          </label>
                          <input
                            type="text"
                            value={storageConfig.cloudinaryUploadPreset}
                            onChange={(e) =>
                              setStorageConfig({
                                ...storageConfig,
                                cloudinaryUploadPreset: e.target.value
                              })
                            }
                            placeholder="e.g. food_specialists_unsigned"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer"
                    >
                      Save Cloud Storage Configuration
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: PAYMENT RECEIPTS & PREMIUM MEMBER APPROVALS */}
              {adminTab === 'receipts' && (
                <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-extrabold text-[#1A2138]">
                        Premium Subscription Requests ({adminAllPaymentRequests.length})
                      </h2>
                      <p className="text-[11px] text-gray-600">
                        Verify applicant details, Transaction / Reference ID, and Payment Screenshot to approve and activate Premium Membership
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[10.5px] font-extrabold shrink-0">
                      Rs. {liveGateway.monthlyFeeRs.toLocaleString()} / 1 Month
                    </span>
                  </div>
                  {adminAllPaymentRequests.length === 0 ? (
                    <p className="text-xs text-gray-500 py-4 text-center">
                      No payment requests submitted yet. When users click &ldquo;Become a Premium Member&rdquo; and upload their payment screenshot, it appears here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {adminAllPaymentRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="text-sm font-extrabold text-[#1A2138] break-words">
                                {req.userName || 'Applicant'}
                              </div>
                              <div className="text-[11.5px] font-semibold text-gray-700 break-all">
                                📧 {req.userEmail || 'No Email'}
                              </div>
                              {req.userPhone && (
                                <div className="text-[11.5px] font-bold text-emerald-800">
                                  📱 WhatsApp / Phone: {req.userPhone}
                                </div>
                              )}
                              {(req.userCurrentRole ||
                                req.currentRole ||
                                req.userQualification ||
                                req.qualification) && (
                                <div className="text-[11px] font-semibold text-slate-600">
                                  👤 {req.userCurrentRole || req.currentRole || 'Specialist'}
                                  {req.userQualification || req.qualification
                                    ? ` • ${req.userQualification || req.qualification}`
                                    : ''}
                                </div>
                              )}
                              <div className="mt-1.5 p-2.5 rounded-xl bg-white border border-[#1673B8]/30 space-y-1">
                                <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-extrabold text-[#1673B8]">
                                  <span>Method: {req.paymentMethod}</span>
                                  <span>
                                    Plan:{' '}
                                    {req.amount ||
                                      `Rs. ${liveGateway.monthlyFeeRs.toLocaleString()} (1 Month)`}
                                  </span>
                                </div>
                                <div className="text-xs font-black text-[#1A2138] bg-[#EBF4FC] px-2.5 py-1 rounded-lg border border-[#1673B8]/25 break-all">
                                  TRX / Reference ID:{' '}
                                  <span className="text-[#1673B8] font-mono">
                                    {req.transactionId || 'Not Provided'}
                                  </span>
                                </div>
                              </div>
                              {req.submittedAt && (
                                <div className="text-[10.5px] text-gray-500 mt-0.5">
                                  Submitted: {req.submittedAt.replace('T', ' ').replace('Z', '')}
                                </div>
                              )}
                              {req.status === 'verified' && req.premiumExpiresAt && (
                                <div className="text-[11px] font-extrabold text-[#105E9A] mt-1">
                                  ✓ Subscription Active Until:{' '}
                                  {new Date(req.premiumExpiresAt).toLocaleDateString('en-PK', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                              )}
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold shrink-0 ${
                                req.status === 'verified'
                                  ? 'bg-[#EBF4FC] text-[#105E9A]'
                                  : req.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {req.status === 'verified'
                                ? 'APPROVED'
                                : req.status.toUpperCase()}
                            </span>
                          </div>

                          {req.receiptImageUrl ? (
                            <div className="rounded-xl overflow-hidden border border-[#D2DEEA] bg-white p-2.5 space-y-1.5">
                              <div className="text-[11px] font-extrabold text-[#1A2138] flex items-center justify-between px-1">
                                <span>📸 Uploaded Payment Screenshot</span>
                                <a
                                  href={req.receiptImageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#1673B8] underline font-extrabold"
                                >
                                  Open Full Image ↗
                                </a>
                              </div>
                              <img
                                src={req.receiptImageUrl}
                                alt="Payment Receipt"
                                className="max-h-56 mx-auto object-contain rounded-lg border border-slate-100"
                              />
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900">
                              ⚠️ No payment screenshot attached
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleAdminVerifyPayment(req, 'verified')
                              }
                              className="py-2.5 px-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer transition-colors"
                            >
                              ✓ Approve &amp; Activate Premium
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleAdminVerifyPayment(req, 'rejected')
                              }
                              className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold cursor-pointer transition-colors"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: JOBS & SCHOLARSHIPS CLOUD STORAGE */}
              {adminTab === 'opportunities' && (
                <form
                  onSubmit={handleAdminPublishOpportunity}
                  className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-3"
                >
                  <h2 className="text-base font-extrabold text-[#1A2138]">
                    Store New Job or Scholarship in Cloud Database
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminOppType('job');
                        setAdminOppCat('Quality & Safety');
                      }}
                      className={`py-2 rounded-xl text-xs font-extrabold border cursor-pointer ${
                        adminOppType === 'job'
                          ? 'bg-[#1673B8] text-white border-[#1673B8]'
                          : 'bg-[#F0F6FC] text-[#1A2138] border-[#D2DEEA]'
                      }`}
                    >
                      + New Job ({jobs.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminOppType('scholarship');
                        setAdminOppCat('Fellowships');
                      }}
                      className={`py-2 rounded-xl text-xs font-extrabold border cursor-pointer ${
                        adminOppType === 'scholarship'
                          ? 'bg-[#1673B8] text-white border-[#1673B8]'
                          : 'bg-[#F0F6FC] text-[#1A2138] border-[#D2DEEA]'
                      }`}
                    >
                      + New Scholarship ({scholarships.length})
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    value={adminOppTitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAdminOppTitle(val);
                      if (adminOppType === 'job' && val.trim()) {
                        setAdminOppCat(val.trim().slice(0, 40));
                      }
                    }}
                    placeholder={
                      adminOppType === 'job'
                        ? 'Job Title (e.g. QA/QC Executive — Auto-creates Tag)'
                        : 'Scholarship Title (e.g. MSc Food Science Fellowship)'
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold"
                  />

                  {adminOppType === 'job' && (
                    <div className="space-y-1.5 p-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA]">
                      <label className="block text-[11px] font-extrabold text-[#1A2138]">
                        Job Tag (Auto-Created from Job Title or Type Any Custom Tag):
                      </label>
                      <input
                        type="text"
                        value={adminOppCat}
                        onChange={(e) => setAdminOppCat(e.target.value)}
                        placeholder="Type custom tag or pick below (e.g. Dairy QA, Food Safety)..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D2DEEA] text-xs font-bold text-[#1A2138]"
                      />
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {[
                          'Quality & Safety',
                          'R&D Lab',
                          'Production',
                          'QA/QC',
                          'Food Safety',
                          'Dairy',
                          'Bakery',
                          'Microbiology'
                        ].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setAdminOppCat(t)}
                            className={`px-2 py-0.5 rounded-md text-[10.5px] font-extrabold cursor-pointer ${
                              adminOppCat === t
                                ? 'bg-[#1673B8] text-white'
                                : 'bg-white border border-[#D2DEEA] text-[#1A2138]'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    required
                    value={adminOppOrg}
                    onChange={(e) => setAdminOppOrg(e.target.value)}
                    placeholder={
                      adminOppType === 'job'
                        ? 'Company Name (e.g. Engro Foods)'
                        : 'University / Organization'
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={adminOppCountry}
                      onChange={(e) => setAdminOppCountry(e.target.value)}
                      placeholder="Country (e.g. Pakistan / UAE)"
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={adminOppExpOrDeadline}
                      onChange={(e) => setAdminOppExpOrDeadline(e.target.value)}
                      placeholder={
                        adminOppType === 'job'
                          ? 'Experience (e.g. 2+ Years)'
                          : 'Deadline (YYYY-MM-DD)'
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={adminOppEmail}
                      onChange={(e) => setAdminOppEmail(e.target.value)}
                      placeholder="Contact HR / Admissions Email"
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={adminOppLink}
                      onChange={(e) => setAdminOppLink(e.target.value)}
                      placeholder="Official Apply Link (https://...)"
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold"
                    />
                  </div>

                  <textarea
                    rows={3}
                    value={adminOppDesc}
                    onChange={(e) => setAdminOppDesc(e.target.value)}
                    placeholder="Full description, eligibility, and application instructions..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] text-xs font-semibold"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Save &amp; Publish to Cloud Database
                  </button>
                </form>
              )}
            </div>
          )}
          </div>

          {/* FULL-WIDTH DESKTOP & TABLET WEBSITE FOOTER (Visible on md+ screens) */}
          <footer className="hidden md:block w-full bg-[#0C182D] text-white border-t border-[#1C3257] mt-10 shrink-0">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 lg:py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
                {/* Col 1: Brand & Mission */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center shrink-0">
                      <img
                        src={FS_PORTAL_LOGO_DATA_URI}
                        alt="Food Science Portal"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-lg font-black tracking-tight text-white">
                      Food Science <span className="text-sky-400">Portal</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The only platform for Food Science related Jobs, Scholarships, Tools, Communities, Trainings.
                  </p>
                </div>

                {/* Col 2: Portal Navigation */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
                    Portal Sections
                  </h3>
                  <ul className="space-y-2 text-xs font-semibold text-slate-300">
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNavigateWebsiteSection('home')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Home Dashboard
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNavigateWebsiteSection('jobs')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Browse Food Industry Jobs ({activeJobs.length})
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() =>
                          handleNavigateWebsiteSection('scholarships')
                        }
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Global Scholarships &amp; Grants ({activeScholarships.length})
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() =>
                          handleNavigateWebsiteSection('communities')
                        }
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Specialist Community Directory ({paidCommunityMembers.length})
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleNavigateWebsiteSection('profile')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        ATS CV Builder &amp; Profile
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Specialist Tools & Academy */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
                    Tools &amp; Academy
                  </h3>
                  <ul className="space-y-2 text-xs font-semibold text-slate-300">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveToolSection('exam');
                          setRoute({
                            name: 'tools',
                            initialSection: 'exam'
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Food Science Exam Prep &amp; PDF Notes
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveToolSection('e-numbers');
                          setRoute({
                            name: 'tools',
                            initialSection: 'e-numbers'
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        E-Numbers &amp; Halal Additive Finder
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveToolSection('lab-formula');
                          setRoute({
                            name: 'tools',
                            initialSection: 'lab-formula'
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        QA/QC Food Lab Calculators
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() =>
                          handleNavigateWebsiteSection('trainings')
                        }
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        International Trainings &amp; QR Verification
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Col 4: Legal Compliance & Mobile App */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
                    Policies &amp; Mobile App
                  </h3>
                  <ul className="space-y-2 text-xs font-semibold text-slate-300">
                    <li>
                      <button
                        type="button"
                        onClick={() => setLegalModalTab('privacy')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setLegalModalTab('terms')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Terms &amp; Conditions
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setLegalModalTab('ads')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        AdMob &amp; Ads Compliance Policy
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setLegalModalTab('deletion')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Data &amp; Account Deletion Policy
                      </button>
                    </li>
                  </ul>
                  {!isStandaloneApp && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowInstallAppModal(true)}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 text-sky-200" />
                        <span>Install Mobile App</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
                <p>
                  © {new Date().getFullYear()} Food Science Portal. All rights reserved.
                </p>
                <p>
                  Synchronized Web Portal &amp; Google Play Store Compatible PWA
                </p>
              </div>
            </div>
          </footer>
        </main>

        {/* ==================== HIRE / CONTACT MEMBER MODAL ==================== */}
        {contactModalMember && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] bg-white rounded-[28px] p-5 shadow-xl space-y-4 border border-[#D2DEEA]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#1673B8] text-[11px] font-extrabold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Premium Specialist</span>
                  </span>
                  <h3 className="text-[20px] font-extrabold text-[#1A2138] mt-1">
                    Connect with {contactModalMember.name}
                  </h3>
                  {(contactModalMember.title ||
                    contactModalMember.currentRole) && (
                    <p className="text-xs text-gray-600 font-medium">
                      {contactModalMember.title ||
                        contactModalMember.currentRole}
                      {contactModalMember.company
                        ? ` • ${contactModalMember.company}`
                        : ''}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setContactModalMember(null);
                    setContactSentBanner(null);
                  }}
                  className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1A2138]">
                  Hiring / Networking Message
                </label>
                <textarea
                  rows={3}
                  value={contactCustomMsg}
                  onChange={(e) => setContactCustomMsg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F0F6FC] border border-[#BBD6EE] text-xs font-medium text-gray-900 focus:outline-none focus:border-[#1673B8]"
                />
              </div>

              {contactSentBanner && (
                <div className="p-3 rounded-2xl bg-[#EBF4FC] text-[#1A2138] text-xs font-bold">
                  {contactSentBanner}
                </div>
              )}

              <div className="space-y-2">
                {contactModalMember.linkedinUrl &&
                  canViewerSeeField(
                    contactModalMember.visibility?.linkedin || 'premium',
                    isCurrentUserPaid,
                    contactModalMember.uid === myProfile.uid || isUserAdmin
                  ) && (
                    <a
                      href={
                        contactModalMember.linkedinUrl.startsWith('http')
                          ? contactModalMember.linkedinUrl
                          : `https://${contactModalMember.linkedinUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Message on LinkedIn</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                {contactModalMember.phone && (
                  <a
                    href={`https://wa.me/${contactModalMember.phone.replace(
                      /[^0-9]/g,
                      ''
                    )}?text=${encodeURIComponent(contactCustomMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message / Call on WhatsApp</span>
                  </a>
                )}

                {contactModalMember.email && (
                  <a
                    href={`mailto:${
                      contactModalMember.email
                    }?subject=${encodeURIComponent(
                      'Hiring / Networking Inquiry via Food Science Portal'
                    )}&body=${encodeURIComponent(contactCustomMsg)}`}
                    className="w-full py-3 px-4 rounded-2xl bg-[#EBF4FC] hover:bg-[#D2DEEA] text-[#1A2138] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#1673B8]" />
                    <span>Send Direct Email ({contactModalMember.email})</span>
                  </a>
                )}

                {!contactModalMember.linkedinUrl &&
                  !contactModalMember.phone &&
                  !contactModalMember.email && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold text-center">
                      This specialist has not added direct contact details yet.
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== PREMIUM MEMBERSHIP & FREE VS. PREMIUM ACCESS COMPARISON POPUP NOTIFICATION ==================== */}
        {showPremiumUpgradeModal && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3.5 overflow-y-auto">
            <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-[30px] p-4 sm:p-6 shadow-2xl space-y-5 border-2 border-[#1673B8]">
              {/* Free Access vs. Premium Access Comparison Notification with Close Button */}
              <FreeVsPremiumComparisonCard
                isCurrentUserPaid={isCurrentUserPaid}
                monthlyFeeRs={liveGateway.monthlyFeeRs}
                yearlyFeeRs={liveGateway.yearlyFeeRs}
                onClose={() => setShowPremiumUpgradeModal(false)}
                onSelectPlanUpgrade={(plan) => {
                  setSelectedPlanDuration(plan);
                  setPayAmount(
                    plan === '1-year'
                      ? `Rs. ${liveGateway.yearlyFeeRs}`
                      : `Rs. ${liveGateway.monthlyFeeRs}`
                  );
                }}
                onNavigateTools={() => {
                  setShowPremiumUpgradeModal(false);
                  setActiveToolSection('hub');
                  setToolsResetKey((k) => k + 1);
                  setRoute({ name: 'tools', initialSection: 'hub' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateTrainings={() => {
                  setShowPremiumUpgradeModal(false);
                  setRoute({ name: 'trainings' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {!authUser && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-400 space-y-2 text-xs text-[#1A2138]">
                  <div className="font-extrabold text-amber-900">
                    ⚠️ Account Registration &amp; Login Mandatory for Paid Membership
                  </div>
                  <p className="text-[11.5px] text-amber-800 leading-relaxed">
                    Free tools, jobs, scholarships, and training study are open without login. However, activating <strong>Premium Access</strong> (Cloud Directory Saving, PDF Reports &amp; Verified Specialist Listing) requires a registered user account.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPremiumUpgradeModal(false);
                      setShowGuestAuthModal(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0C182D] hover:bg-[#1673B8] text-white font-extrabold text-xs cursor-pointer transition-colors"
                  >
                    Sign In / Register Free Account First →
                  </button>
                </div>
              )}

              {/* STEP 1: CHOOSE SUBSCRIPTION PLAN (1 MONTH vs FULL YEAR DISCOUNT) */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#1A2138]">
                  1. Select Subscription Plan
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* 1-Month Plan Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlanDuration('1-month');
                      setPayAmount(`Rs. ${liveGateway.monthlyFeeRs}`);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                      selectedPlanDuration === '1-month'
                        ? 'bg-[#EBF4FC] border-[#1673B8] shadow-xs'
                        : 'bg-white border-gray-200 hover:border-[#9AC2E6]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#105E9A]">
                        1 Month Plan
                      </span>
                      {selectedPlanDuration === '1-month' && (
                        <CheckCircle2 className="w-4 h-4 text-[#1673B8]" />
                      )}
                    </div>
                    <div className="text-lg font-black text-[#1A2138] mt-1">
                      Rs. {liveGateway.monthlyFeeRs.toLocaleString()}
                    </div>
                    <div className="text-[10.5px] font-semibold text-gray-600">
                      Valid for 30 Days
                    </div>
                  </button>

                  {/* Full Year Plan Card (Dynamic Discount %) */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlanDuration('1-year');
                      setPayAmount(`Rs. ${liveGateway.yearlyFeeRs}`);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                      selectedPlanDuration === '1-year'
                        ? 'bg-[#EBF4FC] border-[#1673B8] shadow-xs'
                        : 'bg-white border-gray-200 hover:border-[#9AC2E6]'
                    }`}
                  >
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#1673B8] text-white text-[9.5px] font-extrabold uppercase tracking-wider mb-1">
                      🔥 {liveGateway.yearlyDiscountPct}% Discount
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#105E9A]">
                        Full Year (12 Mo)
                      </span>
                      {selectedPlanDuration === '1-year' && (
                        <CheckCircle2 className="w-4 h-4 text-[#1673B8]" />
                      )}
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-lg font-black text-[#1A2138]">
                        Rs. {liveGateway.yearlyFeeRs.toLocaleString()}
                      </span>
                      <span className="text-[10.5px] font-bold text-gray-400 line-through">
                        Rs. {(liveGateway.monthlyFeeRs * 12).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10.5px] font-extrabold text-[#1673B8]">
                      Save Rs.{' '}
                      {Math.max(
                        0,
                        liveGateway.monthlyFeeRs * 12 - liveGateway.yearlyFeeRs
                      ).toLocaleString()}{' '}
                      (365 Days)
                    </div>
                  </button>
                </div>
              </div>

              {/* Premium Member Features List */}
              <div className="bg-[#F0F6FC] border border-[#BBD6EE] rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#105E9A]">
                    Premium Member Benefits
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1673B8] text-white text-[11px] font-extrabold">
                    {selectedPlanDuration === '1-year'
                      ? `Rs. ${liveGateway.yearlyFeeRs.toLocaleString()} / Year (${liveGateway.yearlyDiscountPct}% OFF)`
                      : `Rs. ${liveGateway.monthlyFeeRs.toLocaleString()} / Month`}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-gray-800 font-semibold">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1673B8] shrink-0 mt-0.5" />
                    <span>
                      <strong>Show Your Profile in Community:</strong> Your profile appears in the Community directory so other Premium specialists &amp; recruiters can view your profile.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1673B8] shrink-0 mt-0.5" />
                    <span>
                      <strong>View Full Profiles &amp; LinkedIn:</strong> Access complete profiles, experience, education &amp; LinkedIn links of fellow specialists.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1673B8] shrink-0 mt-0.5" />
                    <span>
                      <strong>CV Vault Access &amp; Downloads:</strong> Download CVs/Resumes of other Premium members and showcase your CV to recruiters.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1673B8] shrink-0 mt-0.5" />
                    <span>
                      <strong>Direct Contact &amp; Hiring:</strong> Enable direct WhatsApp, Email &amp; Message buttons to connect with members and recruiters.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Payment Options: Bank Transfer First/Top, JazzCash, EasyPaisa */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#1A2138]">
                    2. Choose Payment Method (
                    {selectedPlanDuration === '1-year'
                      ? `Rs. ${liveGateway.yearlyFeeRs.toLocaleString()} / Full Year`
                      : `Rs. ${liveGateway.monthlyFeeRs.toLocaleString()} / 1 Month`}
                    )
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['Bank Transfer', 'JazzCash', 'EasyPaisa'] as const).map(
                    (method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPayMethod(method)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer whitespace-nowrap ${
                          payMethod === method
                            ? 'bg-[#1673B8] text-white border-[#1673B8] shadow-xs'
                            : 'bg-[#F0F6FC] text-[#1A2138] border-[#D2DEEA] hover:bg-[#E1EEF9]'
                        }`}
                      >
                        {method === 'Bank Transfer' ? 'Bank Account' : method}
                      </button>
                    )
                  )}
                </div>

                {/* Selected Payment Account Instructions (Live from Admin Payment Gateway Settings) */}
                <div className="bg-[#F0F6FC] border border-[#1673B8]/40 rounded-2xl p-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-[#1A2138]">
                      {payMethod} Account Details
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const copyTarget =
                          payMethod === 'JazzCash'
                            ? liveGateway.jazzCashNumber
                            : payMethod === 'EasyPaisa'
                            ? liveGateway.easyPaisaNumber
                            : liveGateway.bankAccountOrIban !==
                              'Contact on WhatsApp for IBAN'
                            ? liveGateway.bankAccountOrIban
                            : liveGateway.bankWhatsapp;
                        handleCopyText(copyTarget, 'pay-acc-num');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#BBD6EE] text-[#1673B8] text-[10.5px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'pay-acc-num' ? (
                        <>
                          <Check className="w-3 h-3 text-[#1673B8]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Details</span>
                        </>
                      )}
                    </button>
                  </div>

                  {payMethod === 'JazzCash' && (
                    <div className="text-gray-800 space-y-0.5">
                      <div>
                        Account Title:{' '}
                        <strong>{liveGateway.jazzCashTitle}</strong>
                      </div>
                      <div>
                        JazzCash Number:{' '}
                        <strong>{liveGateway.jazzCashNumber}</strong>
                      </div>
                      <div>
                        Subscription Fee:{' '}
                        <strong>
                          {selectedPlanDuration === '1-year'
                            ? `Rs. ${liveGateway.yearlyFeeRs.toLocaleString()} (Full Year - 25% Discount)`
                            : `Rs. ${liveGateway.monthlyFeeRs.toLocaleString()} (For 1 Month)`}
                        </strong>
                      </div>
                    </div>
                  )}

                  {payMethod === 'EasyPaisa' && (
                    <div className="text-gray-800 space-y-0.5">
                      <div>
                        Account Title:{' '}
                        <strong>{liveGateway.easyPaisaTitle}</strong>
                      </div>
                      <div>
                        EasyPaisa Number:{' '}
                        <strong>{liveGateway.easyPaisaNumber}</strong>
                      </div>
                      <div>
                        Subscription Fee:{' '}
                        <strong>
                          {selectedPlanDuration === '1-year'
                            ? `Rs. ${liveGateway.yearlyFeeRs.toLocaleString()} (Full Year - 25% Discount)`
                            : `Rs. ${liveGateway.monthlyFeeRs.toLocaleString()} (For 1 Month)`}
                        </strong>
                      </div>
                    </div>
                  )}

                  {payMethod === 'Bank Transfer' && (
                    <div className="text-gray-800 space-y-0.5">
                      <div>
                        Account Title: <strong>{liveGateway.bankTitle}</strong>
                      </div>
                      <div>
                        Bank Name: <strong>{liveGateway.bankName}</strong>
                      </div>
                      <div>
                        Account / IBAN:{' '}
                        <strong>{liveGateway.bankAccountOrIban}</strong>
                      </div>
                      <div>
                        WhatsApp / Contact:{' '}
                        <strong>{liveGateway.bankWhatsapp}</strong>
                      </div>
                      <div>
                        Subscription Fee:{' '}
                        <strong>
                          {selectedPlanDuration === '1-year'
                            ? `Rs. ${liveGateway.yearlyFeeRs.toLocaleString()} (Full Year - 25% Discount)`
                            : `Rs. ${liveGateway.monthlyFeeRs.toLocaleString()} (For 1 Month)`}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Screenshot, Applicant Details & Transaction Details */}
              <div className="space-y-3">
                <label className="block text-xs font-extrabold text-[#1A2138]">
                  3. Enter Your Details, Transaction / Reference ID &amp; Upload Payment Screenshot (Rs.{' '}
                  {selectedPlanDuration === '1-year'
                    ? liveGateway.yearlyFeeRs.toLocaleString()
                    : liveGateway.monthlyFeeRs.toLocaleString()}
                  )
                </label>

                {/* Applicant Details Summary & WhatsApp/Phone Input for Admin Verification */}
                <div className="p-3 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2">
                  <div className="text-[11px] font-extrabold text-[#1A2138]">
                    Applicant Details Sent to Admin:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 mb-0.5">
                        Full Name *
                      </span>
                      <input
                        type="text"
                        value={myProfile.name || ''}
                        onChange={(e) =>
                          setMyProfile({ ...myProfile, name: e.target.value })
                        }
                        placeholder="Your Full Name"
                        className="w-full px-2.5 py-2 rounded-lg bg-white border border-[#D2DEEA] text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 mb-0.5">
                        WhatsApp / Phone Number *
                      </span>
                      <input
                        type="text"
                        value={
                          myProfile.whatsappNumber ?? myProfile.phone ?? ''
                        }
                        onChange={(e) =>
                          setMyProfile({
                            ...myProfile,
                            whatsappNumber: e.target.value,
                            phone: e.target.value
                          })
                        }
                        placeholder="e.g. +92 300 1234567"
                        className="w-full px-2.5 py-2 rounded-lg bg-white border border-[#D2DEEA] text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#1673B8]"
                      />
                    </div>
                  </div>
                  <div className="text-[10.5px] font-semibold text-slate-600">
                    Email:{' '}
                    <strong>
                      {myProfile.email || authUser?.email || 'Guest (Sign in required)'}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <span className="block text-[10.5px] font-bold text-gray-500 mb-1">
                      Selected Plan &amp; Fee
                    </span>
                    <div className="w-full px-3 py-2.5 rounded-xl bg-[#EBF4FC] border border-[#BBD6EE] text-xs font-extrabold text-[#1A2138]">
                      {selectedPlanDuration === '1-year'
                        ? `Rs. ${liveGateway.yearlyFeeRs.toLocaleString()} / 1 Year (25% OFF)`
                        : `Rs. ${liveGateway.monthlyFeeRs.toLocaleString()} / 1 Month`}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                      TRX ID / Reference No. (Required *)
                    </span>
                    <input
                      type="text"
                      required
                      value={payTransactionId}
                      onChange={(e) => setPayTransactionId(e.target.value)}
                      placeholder="Enter TRX / Reference No..."
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6FC] border-2 border-[#1673B8] text-xs font-bold text-gray-900 focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* Screenshot Upload Box */}
                <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border-2 border-dashed border-[#1673B8] space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <ImageIcon className="w-5 h-5 text-[#1673B8] shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-extrabold text-[#1A2138] block truncate">
                          {payReceiptUrl
                            ? 'Payment Screenshot Uploaded ✓'
                            : 'Upload Payment Screenshot (Required *)'}
                        </span>
                        <span className="text-[10.5px] text-gray-500 block">
                          Attach screenshot of your Rs.{' '}
                          {selectedPlanDuration === '1-year'
                            ? liveGateway.yearlyFeeRs.toLocaleString()
                            : liveGateway.monthlyFeeRs.toLocaleString()}{' '}
                          payment
                        </span>
                      </div>
                    </div>
                    <input
                      ref={receiptInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePaymentReceiptUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => receiptInputRef.current?.click()}
                      disabled={isUploadingMedia}
                      className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold shrink-0 cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {isUploadingMedia ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{payReceiptUrl ? 'Change' : 'Upload'}</span>
                    </button>
                  </div>

                  {payReceiptUrl && (
                    <div className="rounded-xl overflow-hidden border border-[#D2DEEA] bg-white p-2">
                      <img
                        src={payReceiptUrl}
                        alt="Uploaded Payment Screenshot"
                        className="max-h-40 mx-auto object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {paySubmitBanner && (
                  <div className="p-3 rounded-xl bg-[#EBF4FC] border border-[#1673B8] text-[#1A2138] text-xs font-extrabold leading-relaxed">
                    {paySubmitBanner}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSubmitPaymentVerification}
                    disabled={isUploadingMedia || isSubmittingPayment}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs sm:text-sm font-extrabold shadow-md transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmittingPayment && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    <span>
                      {isSubmittingPayment
                        ? 'Submitting Request...'
                        : 'Submit Payment Screenshot for Approval'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPremiumUpgradeModal(false)}
                    className="py-3.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== APPLICATION UNDER REVIEW & APPROVAL STATUS MODAL ==================== */}
        {showApplicationStatusModal && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3.5 overflow-y-auto">
            <div className="w-full max-w-[440px] max-h-[92vh] overflow-y-auto bg-white rounded-[30px] p-5 shadow-2xl space-y-4 border-2 border-[#1673B8]">
              {(() => {
                const currentStatus = isCurrentUserPaid
                  ? 'verified'
                  : myLatestApplication?.status ||
                    (myProfile.paymentStatus &&
                    myProfile.paymentStatus !== 'none'
                      ? myProfile.paymentStatus
                      : 'pending');

                const isApproved = currentStatus === 'verified';
                const isRejected = currentStatus === 'rejected';

                return (
                  <>
                    {/* Top Modal Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-[#D2DEEA] pb-3.5">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                            isApproved
                              ? 'bg-[#1673B8] text-white'
                              : isRejected
                              ? 'bg-red-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {isApproved ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : isRejected ? (
                            <X className="w-6 h-6" />
                          ) : (
                            <ShieldCheck className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                              isApproved
                                ? 'bg-[#EBF4FC] text-[#105E9A]'
                                : isRejected
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {isApproved
                              ? 'Application Approved ✓'
                              : isRejected
                              ? 'Application Not Approved'
                              : 'Sent to Admin for Approval'}
                          </span>
                          <h2 className="text-[19px] font-extrabold text-[#1A2138] leading-tight mt-1">
                            {isApproved
                              ? 'Premium Membership Active!'
                              : isRejected
                              ? 'Payment Request Not Approved'
                              : 'Your Request is Under Review'}
                          </h2>
                          <p className="text-xs font-medium text-gray-600 mt-0.5 leading-relaxed">
                            {isApproved
                              ? 'Admin has verified your payment slip and activated your Premium Membership.'
                              : isRejected
                              ? 'Admin reviewed your request and marked it as not approved. You can submit a new valid payment slip below.'
                              : 'Your request is under review and has been sent to Admin for approval. Once Admin approves your payment slip, your Premium Membership will activate automatically.'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowApplicationStatusModal(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Live Approval Tracker Steps */}
                    <div className="bg-[#F0F6FC] border border-[#BBD6EE] rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#105E9A]">
                          Live Approval Status
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                            isApproved
                              ? 'bg-[#1673B8] text-white'
                              : isRejected
                              ? 'bg-red-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {isApproved
                            ? 'APPROVED ✓'
                            : isRejected
                            ? 'REJECTED'
                            : 'UNDER REVIEW'}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-semibold">
                        <div className="flex items-center gap-2.5 text-[#1A2138]">
                          <span className="w-5 h-5 rounded-full bg-[#1673B8] text-white flex items-center justify-center text-[11px] font-extrabold shrink-0">
                            ✓
                          </span>
                          <span>1. Payment Slip &amp; Application Submitted</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-[#1A2138]">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                              isApproved
                                ? 'bg-[#1673B8] text-white'
                                : isRejected
                                ? 'bg-red-600 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {isApproved ? '✓' : isRejected ? '✕' : '2'}
                          </span>
                          <span>
                            2. Sent to Admin for Verification{' '}
                            <strong
                              className={
                                isApproved
                                  ? 'text-[#1673B8]'
                                  : isRejected
                                  ? 'text-red-700'
                                  : 'text-amber-800'
                              }
                            >
                              (
                              {isApproved
                                ? 'Verified by Admin'
                                : isRejected
                                ? 'Not Approved'
                                : 'Under Review'}
                              )
                            </strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-[#1A2138]">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                              isApproved
                                ? 'bg-[#1673B8] text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {isApproved ? '✓' : '3'}
                          </span>
                          <span
                            className={
                              isApproved ? 'text-[#1A2138]' : 'text-gray-500'
                            }
                          >
                            3. 1-Month Premium Membership Activation{' '}
                            {isApproved ? '(Active ✓)' : '(Awaiting Approval)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Submitted Application Details Card */}
                    {myLatestApplication && (
                      <div className="bg-white border border-[#D2DEEA] rounded-2xl p-4 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-[#D2DEEA] pb-2">
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1A2138]">
                            My Submitted Application Details
                          </h3>
                          <span className="text-[10.5px] font-bold text-gray-500">
                            {myLatestApplication.submittedAt
                              ? myLatestApplication.submittedAt
                                  .replace('T', ' ')
                                  .replace('Z', '')
                              : 'Just now'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                          <div className="p-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA]">
                            <span className="text-[10px] font-bold text-gray-500 block uppercase">
                              Applicant Name
                            </span>
                            <span className="font-extrabold text-[#1A2138] block truncate mt-0.5">
                              {myLatestApplication.userName || myProfile.name}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA]">
                            <span className="text-[10px] font-bold text-gray-500 block uppercase">
                              Approval Status
                            </span>
                            <span
                              className={`font-extrabold block mt-0.5 ${
                                isApproved
                                  ? 'text-[#1673B8]'
                                  : isRejected
                                  ? 'text-red-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {isApproved
                                ? 'Approved ✓'
                                : isRejected
                                ? 'Not Approved'
                                : 'Under Review'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA]">
                            <span className="text-[10px] font-bold text-gray-500 block uppercase">
                              Payment Method
                            </span>
                            <span className="font-extrabold text-[#1A2138] block mt-0.5">
                              {myLatestApplication.paymentMethod}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA]">
                            <span className="text-[10px] font-bold text-gray-500 block uppercase">
                              Subscription Plan &amp; Fee
                            </span>
                            <span className="font-extrabold text-[#1673B8] block mt-0.5">
                              {myLatestApplication.amount ||
                                myLatestApplication.subscriptionPlan ||
                                `Rs. ${liveGateway.monthlyFeeRs} (1 Month)`}
                            </span>
                          </div>
                        </div>

                        {myLatestApplication.transactionId &&
                          myLatestApplication.transactionId !==
                            'SCREENSHOT-UPLOADED' && (
                            <div className="p-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-xs flex items-center justify-between">
                              <span className="text-gray-500 font-bold">
                                Transaction / Ref ID:
                              </span>
                              <span className="font-extrabold text-[#1A2138]">
                                {myLatestApplication.transactionId}
                              </span>
                            </div>
                          )}

                        {isApproved &&
                          (myLatestApplication.premiumExpiresAt ||
                            myProfile.premiumExpiresAt) && (
                            <div className="p-3 rounded-xl bg-[#EBF4FC] border border-[#1673B8] text-xs font-extrabold text-[#1A2138] flex items-center justify-between">
                              <span>Premium Subscription Valid Until:</span>
                              <span className="text-[#1673B8]">
                                {new Date(
                                  myLatestApplication.premiumExpiresAt ||
                                    myProfile.premiumExpiresAt ||
                                    ''
                                ).toLocaleDateString('en-PK', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          )}

                        {myLatestApplication.receiptImageUrl && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-600">
                              <span>Uploaded Payment Slip</span>
                              <a
                                href={myLatestApplication.receiptImageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1673B8] underline font-extrabold"
                              >
                                View Full Slip ↗
                              </a>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-[#D2DEEA] bg-[#F0F6FC] p-2">
                              <img
                                src={myLatestApplication.receiptImageUrl}
                                alt="Submitted Payment Slip"
                                className="max-h-44 mx-auto object-contain rounded-lg"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowApplicationStatusModal(false)}
                        className="w-full py-3.5 px-5 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs sm:text-sm font-extrabold shadow-md transition-colors cursor-pointer"
                      >
                        OK, Close Window
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowApplicationStatusModal(false);
                          setPaySubmitBanner(null);
                          setShowPremiumUpgradeModal(true);
                        }}
                        className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold cursor-pointer shrink-0"
                      >
                        Submit New Slip
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* INSTALL MOBILE APP MODAL (1-Click PWA Install + Android/iOS Instructions + Sync Info) */}
        {showInstallAppModal && (
          <div className="fixed inset-0 z-50 bg-[#0C182D]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-md bg-white border border-[#D2DEEA] rounded-[28px] p-5 sm:p-6 shadow-2xl space-y-4 my-auto">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0F6FC] border border-[#1673B8]/30 p-1.5 flex items-center justify-center shrink-0">
                    <img
                      src={FS_PORTAL_LOGO_DATA_URI}
                      alt="Food Science Portal"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[#EBF4FC] text-[#1673B8] text-[10px] font-extrabold uppercase tracking-wider">
                      Official Mobile App
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138] leading-snug mt-0.5">
                      Install Food Science Portal
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInstallAppModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Install <strong>Food Science Portal</strong> directly onto your mobile phone home screen. Your account, jobs, scholarships, tools, certificates, and notifications stay <strong>100% synchronized</strong> between the Website and Mobile App.
              </p>

              {installStatusMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{installStatusMessage}</span>
                </div>
              )}

              {/* Direct 1-Click Install Button (When Browser Supports Native Prompt) */}
              {deferredInstallPrompt && (
                <button
                  type="button"
                  onClick={handleTriggerNativeAppInstall}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#1A2138] to-[#1673B8] hover:from-[#105E9A] hover:to-[#1673B8] text-white text-xs sm:text-sm font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4 text-sky-200 shrink-0" />
                  <span>Install App Now (1-Click)</span>
                </button>
              )}

              {/* Step-by-Step Guide for Android & iPhone */}
              <div className="space-y-2.5 bg-[#F4F8FD] border border-[#D2DEEA] rounded-2xl p-3.5 text-xs">
                <div className="space-y-1">
                  <p className="font-extrabold text-[#1A2138] flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#1673B8]" />
                    <span>On Android (Chrome / Samsung Internet):</span>
                  </p>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed pl-5">
                    Tap the browser menu <strong>(⋮)</strong> at the top-right and select <strong>&ldquo;Install App&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                  </p>
                </div>

                <div className="border-t border-[#D2DEEA] pt-2.5 space-y-1">
                  <p className="font-extrabold text-[#1A2138] flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#1673B8]" />
                    <span>On iPhone / iPad (Safari):</span>
                  </p>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed pl-5">
                    Tap the <strong>Share</strong> button at the bottom of Safari and select <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                  </p>
                </div>
              </div>

              {/* Copy Website/App Link to Open on Phone */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(window.location.href, 'install-app-link')
                  }
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#1673B8]/40 text-[#1673B8] text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedId === 'install-app-link' ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Portal Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link for Mobile</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInstallAppModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5-TAB BOTTOM NAVIGATION BAR (Shown on Mobile < 768px) */}
        <BottomNav
          activeTab={activeBottomTab}
          onSelectTab={handleSelectBottomTab}
          onOpenLegal={(tab) => setLegalModalTab(tab)}
        />

        {/* LEGAL, PRIVACY POLICY, TERMS, ADSENSE/ADMOB, DATA DELETION & APP CLOSURE MODAL */}
        <LegalComplianceModal
          isOpen={legalModalTab !== null}
          initialTab={legalModalTab || 'privacy'}
          onClose={() => setLegalModalTab(null)}
          onGoToDeleteAccount={() => {
            setRoute({ name: 'profile' });
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }}
          onSignOutApp={handleSignOut}
          monthlyFeeRs={liveGateway.monthlyFeeRs}
          yearlyFeeRs={liveGateway.yearlyFeeRs}
          yearlyDiscountPct={liveGateway.yearlyDiscountPct}
        />
      </div>
    </div>
  );
}
