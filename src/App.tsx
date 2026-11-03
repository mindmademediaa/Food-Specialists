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
  Image as ImageIcon
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
  type User,
  OperationType,
  handleFirestoreError
} from './lib/firebase';
import {
  HubUser,
  PrivacySettings,
  HubJob,
  HubScholarship,
  HubTraining,
  HubPaymentRequest,
  HubCertificate,
  CloudStorageConfig,
  DevRole,
  SpecializationTag,
  NavTab
} from './types/hub';
import {
  INITIAL_USERS,
  INITIAL_JOBS,
  INITIAL_SCHOLARSHIPS,
  INITIAL_TRAININGS,
  INITIAL_COMMUNITY_THREADS,
  makeAvatarSvg
} from './data/mockHubData';
import {
  uploadMediaFile,
  generateCertificateSvgDataUrl,
  INITIAL_CERTIFICATES
} from './lib/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { JobCard } from './components/JobCard';
import { MemberCard } from './components/MemberCard';
import { AuthScreen } from './components/AuthScreen';

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

const COMMUNITY_SPECIALIZATION_TAGS: SpecializationTag[] = [
  'HACCP',
  'ISO 22000',
  'Food Chemistry',
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
  uid: 'user-alex-morgan',
  name: 'Alex Morgan',
  profilePicUrl: makeAvatarSvg('AM', '#DCFCE7', '#14532D'),
  qualification: 'BS (Hons.) Food Science & Technology',
  experience: 'Fresh Graduate / 1 Year Food Quality & Safety Internship',
  currentRole: 'Food Safety & QA Specialist',
  company: 'PureFoods Dairy Lab',
  location: 'Lahore, Pakistan',
  country: 'Pakistan',
  bio: 'Food Safety & QA Specialist passionate about HACCP implementation, ISO 22000 auditing, and dairy quality control.',
  email: 'alex.morgan@email.com',
  phone: '+92 300 1234567',
  linkedinUrl: 'https://www.linkedin.com/in/alex-morgan-fsqa',
  portfolioUrl: 'https://foodspecialists.org/portfolio/alex-morgan',
  skills: ['HACCP', 'ISO 22000', 'QA/QC', 'Food Safety'],
  specializations: ['QA/QC', 'Food Safety', 'HACCP', 'ISO 22000'],
  cvUrl: 'Alex_Morgan_Food_Safety_CV.pdf',
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
// Any field whose privacy toggle is OFF (Private) is stripped so other users cannot read it,
// while the owner's full unredacted data is stored in /users/{uid}/private/profile.
const buildSanitizedPublicUser = (fullProfile: HubUser): HubUser => {
  const ps = fullProfile.privacySettings || DEFAULT_CURRENT_USER_PROFILE.privacySettings;
  return {
    ...fullProfile,
    currentRole: ps.currentRole_public ? fullProfile.currentRole : '',
    qualification: ps.qualification_public ? fullProfile.qualification : '',
    experience: ps.experience_public ? fullProfile.experience : '',
    location: ps.location_public ? fullProfile.location : '',
    email: ps.email_public ? fullProfile.email : '',
    phone: ps.phone_public ? fullProfile.phone : ''
  };
};

export default function App() {
  // Firebase Authentication State (Strict Gate)
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Navigation & Route Stack
  const [route, setRoute] = useState<RouteView>({ name: 'home' });
  const [hasSavedProfile, setHasSavedProfile] = useState<boolean>(true);

  // Collections State
  const [users, setUsers] = useState<HubUser[]>(INITIAL_USERS);
  const [jobs, setJobs] = useState<HubJob[]>(INITIAL_JOBS);
  const [scholarships, setScholarships] = useState<HubScholarship[]>(
    INITIAL_SCHOLARSHIPS
  );
  const [trainings, setTrainings] = useState<HubTraining[]>(INITIAL_TRAININGS);
  const [certificates, setCertificates] = useState<HubCertificate[]>(
    INITIAL_CERTIFICATES
  );
  const [paymentRequests, setPaymentRequests] = useState<HubPaymentRequest[]>(
    []
  );
  const [storageConfig, setStorageConfig] = useState<CloudStorageConfig>({
    provider: 'smart-firestore',
    cloudinaryCloudName: '',
    cloudinaryUploadPreset: '',
    updatedAt: '2026-11-01T00:00:00Z'
  });

  // Applied Jobs & Scholarships Local Tracking ('Mark as Applied' checkbox)
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState<string[]>(
    []
  );
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>([]);

  // Copy Helper Feedback State (for 1-click 'Copy Contact Email & Subject')
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Current User Profile
  const [myProfile, setMyProfile] = useState<HubUser>(
    DEFAULT_CURRENT_USER_PROFILE
  );
  const [profileSaveMsg, setProfileSaveMsg] = useState<string | null>(null);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);

  // Payment Receipt Submission State (in /profile)
  const [payMethod, setPayMethod] = useState<
    'EasyPaisa' | 'JazzCash' | 'Bank Transfer'
  >('EasyPaisa');
  const [payTransactionId, setPayTransactionId] = useState<string>('');
  const [payAmount, setPayAmount] = useState<string>('PKR 2,000');
  const [payNotes, setPayNotes] = useState<string>('');
  const [payReceiptUrl, setPayReceiptUrl] = useState<string>('');
  const [paySubmitBanner, setPaySubmitBanner] = useState<string | null>(null);

  // Certificate Search & Preview Modal State (in /trainings and /profile)
  const [certSearchQuery, setCertSearchQuery] = useState<string>('');
  const [selectedCertificate, setSelectedCertificate] =
    useState<HubCertificate | null>(null);

  // Admin Console Active Tab & Forms
  const [adminTab, setAdminTab] = useState<
    'storage' | 'receipts' | 'certificates' | 'opportunities'
  >('storage');
  const [adminStatusBanner, setAdminStatusBanner] = useState<string | null>(
    null
  );
  const [newCertRecipientName, setNewCertRecipientName] = useState<string>('');
  const [newCertRecipientEmail, setNewCertRecipientEmail] =
    useState<string>('');
  const [newCertCategory, setNewCertCategory] = useState<string>('Highfield');
  const [newCertTitle, setNewCertTitle] = useState<string>(
    'HACCP Level 3 — Food Safety & HACCP Plan Implementation'
  );
  const [newCertAccreditation, setNewCertAccreditation] = useState<string>(
    'Highfield UK Accredited'
  );
  const [newCertNumber, setNewCertNumber] = useState<string>(
    `FSP-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [newCertIssueDate, setNewCertIssueDate] =
    useState<string>('2026-11-03');
  const [newCertImageUrl, setNewCertImageUrl] = useState<string>('');

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
    'Assalam-o-Alaikum, I saw your Verified Specialist profile on Food Specialists Hub and would like to connect regarding a Food Science / QA opportunity.'
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
    'All' | 'Jobs' | 'Scholarships' | 'Trainings' | 'Members'
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
  const certImageInputRef = useRef<HTMLInputElement | null>(null);

  // Derive user's Membership Status directly from their Profile state:
  // Paid Member (when myProfile.isPaid === true), Free Member (when profile exists & !isPaid), or Guest
  const membershipStatus: DevRole = useMemo(() => {
    if (myProfile.isPaid) return 'Paid Member';
    if (hasSavedProfile && myProfile.name.trim()) return 'Free Member';
    return 'Guest';
  }, [myProfile.isPaid, myProfile.name, hasSavedProfile]);

  // Monitor real-time Firebase Authentication state and auto-persist user record in Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthUser(firebaseUser);
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

        const baseUserRecord: HubUser = {
          ...DEFAULT_CURRENT_USER_PROFILE,
          uid: firebaseUser.uid,
          name: displayName,
          email: firebaseUser.email || '',
          profilePicUrl:
            firebaseUser.photoURL || makeAvatarSvg(initials, '#DCFCE7', '#14532D'),
          isAdmin: isAdminUser,
          createdAt: new Date().toISOString().slice(0, 19) + 'Z'
        };

        setMyProfile((prev) => ({
          ...prev,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName?.trim() || prev.name || displayName,
          email: firebaseUser.email || prev.email,
          isAdmin: isAdminUser || prev.isAdmin,
          profilePicUrl:
            prev.profilePicUrl ||
            firebaseUser.photoURL ||
            makeAvatarSvg(initials, '#DCFCE7', '#14532D')
        }));

        // Check if user profile already exists in Firestore; hydrate both public doc and private owner vault
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
              email:
                privateData.email ||
                publicData.email ||
                firebaseUser.email ||
                '',
              phone: privateData.phone || publicData.phone || '',
              qualification:
                privateData.qualification || publicData.qualification || '',
              experience: privateData.experience || publicData.experience || '',
              currentRole:
                privateData.currentRole || publicData.currentRole || '',
              location: privateData.location || publicData.location || '',
              isPaid: Boolean(publicData.isPaid ?? privateData.isPaid),
              paymentStatus:
                publicData.paymentStatus || privateData.paymentStatus || 'none',
              isAdmin: isAdminUser || Boolean(publicData.isAdmin),
              privacySettings: mergedPrivacy
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
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setRoute({ name: 'home' });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Real-time Firestore Listeners (with strict per-user isolation & Paid community filtering)
  useEffect(() => {
    if (!authUser) return;
    const isAdminUser =
      authUser.email?.toLowerCase() === 'mindmademedia9@gmail.com';

    // Listen to current user's own document so admin approval of isPaid/paymentStatus reflects immediately
    const unsubMyDoc = onSnapshot(
      doc(db, 'users', authUser.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<HubUser>;
          setMyProfile((prev) => ({
            ...prev,
            isPaid: Boolean(data.isPaid ?? prev.isPaid),
            paymentStatus: data.paymentStatus || prev.paymentStatus
          }));
        }
      },
      () => {}
    );

    // Non-admin users only query Verified Paid community profiles (`where('isPaid', '==', true)`)
    // matching `allow list: if isAdmin() || (isSignedIn() && resource.data.isPaid == true)` in firestore.rules
    const usersQuery = isAdminUser
      ? collection(db, 'users')
      : query(collection(db, 'users'), where('isPaid', '==', true));

    const unsubUsers = onSnapshot(
      usersQuery,
      (snap) => {
        if (!snap.empty) {
          const fsUsers = snap.docs.map((d) => d.data() as HubUser);
          setUsers(() => {
            const map = new Map<string, HubUser>();
            INITIAL_USERS.forEach((u) => map.set(u.uid, u));
            fsUsers.forEach((u) => {
              const initMatch = INITIAL_USERS.find((iu) => iu.uid === u.uid);
              map.set(u.uid, { ...initMatch, ...u });
            });
            return Array.from(map.values());
          });
        }
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
        if (!snap.empty) {
          const fsJobs = snap.docs.map((d) => ({
            ...(d.data() as HubJob),
            id: d.id
          }));
          setJobs(() => {
            const map = new Map<string, HubJob>();
            INITIAL_JOBS.forEach((j) => map.set(j.id, j));
            fsJobs.forEach((j) => {
              const initMatch = INITIAL_JOBS.find((ij) => ij.id === j.id);
              map.set(j.id, { ...initMatch, ...j });
            });
            return Array.from(map.values()).filter((j) => j.isActive);
          });
        }
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
        if (!snap.empty) {
          const fsSch = snap.docs.map((d) => ({
            ...(d.data() as HubScholarship),
            id: d.id
          }));
          setScholarships(() => {
            const map = new Map<string, HubScholarship>();
            INITIAL_SCHOLARSHIPS.forEach((s) => map.set(s.id, s));
            fsSch.forEach((s) => {
              const initMatch = INITIAL_SCHOLARSHIPS.find(
                (is) => is.id === s.id
              );
              map.set(s.id, { ...initMatch, ...s });
            });
            return Array.from(map.values()).filter((s) => s.isActive);
          });
        }
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
        if (!snap.empty) {
          const fsTr = snap.docs.map((d) => ({
            ...(d.data() as HubTraining),
            id: d.id
          }));
          setTrainings(() => {
            const map = new Map<string, HubTraining>();
            INITIAL_TRAININGS.forEach((t) => map.set(t.id, t));
            fsTr.forEach((t) => map.set(t.id, t));
            return Array.from(map.values()).filter((t) => t.isActive);
          });
        }
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
        if (!snap.empty) {
          const fsCerts = snap.docs.map((d) => ({
            ...(d.data() as HubCertificate),
            id: d.id
          }));
          setCertificates(() => {
            const map = new Map<string, HubCertificate>();
            INITIAL_CERTIFICATES.forEach((c) => map.set(c.id, c));
            fsCerts.forEach((c) => map.set(c.id, c));
            return Array.from(map.values());
          });
        }
      },
      () => {}
    );

    const unsubStorageCfg = onSnapshot(
      doc(db, 'settings', 'storageConfig'),
      (snap) => {
        if (snap.exists()) {
          setStorageConfig(snap.data() as CloudStorageConfig);
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

  const handleSelectBottomTab = (tab: NavTab) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'home') setRoute({ name: 'home' });
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
      title: `${title} | Food Specialists Portal`,
      text: `${title}\n${subtitle}\n\nShared via Food Specialists Portal:`,
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

  // Is Current User a Paid Member? (Driven by their Profile record)
  const isCurrentUserPaid = Boolean(myProfile.isPaid);

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

  // Filtered Members for /communities:
  // ONLY Paid Members (`u.isPaid === true`) are shown in the Specialist Directory!
  const paidCommunityMembers = useMemo(() => {
    const list = users.filter((u) => u.isPaid === true && u.uid && u.name);
    if (
      isCurrentUserPaid &&
      !list.some((u) => u.uid === myProfile.uid)
    ) {
      return [{ ...myProfile, isPaid: true }, ...list];
    }
    return list;
  }, [users, isCurrentUserPaid, myProfile]);

  const filteredMembers = useMemo(() => {
    return paidCommunityMembers.filter((u) => {
      if (onlyHireableFilter && !u.privacySettings?.hireMe_public) {
        return false;
      }
      if (commSpecFilter !== 'All') {
        const specs = u.specializations || u.skills || [];
        const hasSpec =
          specs.some(
            (s) => s.toLowerCase() === commSpecFilter.toLowerCase()
          ) ||
          u.currentRole.toLowerCase().includes(commSpecFilter.toLowerCase()) ||
          u.experience.toLowerCase().includes(commSpecFilter.toLowerCase());
        if (!hasSpec) return false;
      }
      if (commCountryFilter !== 'All') {
        const locStr = `${u.country || ''} ${u.location || ''}`.toLowerCase();
        if (!locStr.includes(commCountryFilter.toLowerCase())) return false;
      }
      if (commExpFilter !== 'All') {
        const expStr = (u.experience || '').toLowerCase();
        if (!expStr.includes(commExpFilter.toLowerCase())) return false;
      }
      if (!memberSearchQuery.trim()) return true;
      const q = memberSearchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchBio = u.bio?.toLowerCase().includes(q);
      const matchRole =
        u.privacySettings?.currentRole_public &&
        (u.currentRole.toLowerCase().includes(q) ||
          u.company.toLowerCase().includes(q));
      const matchLoc =
        u.privacySettings?.location_public &&
        u.location.toLowerCase().includes(q);
      const matchQual =
        u.privacySettings?.qualification_public &&
        u.qualification.toLowerCase().includes(q);
      return matchName || matchBio || matchRole || matchLoc || matchQual;
    });
  }, [
    paidCommunityMembers,
    memberSearchQuery,
    onlyHireableFilter,
    commSpecFilter,
    commCountryFilter,
    commExpFilter
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

  const leadAuditorStandards = [
    {
      code: 'ISO 9001',
      subtitle: 'Quality Management Systems (QMS)',
      icon: Award
    },
    {
      code: 'FSSC 22000',
      subtitle: 'Food Safety System Certification',
      icon: Shield
    },
    {
      code: 'ISO 14001',
      subtitle: 'Environmental Management Systems',
      icon: Leaf
    },
    {
      code: 'ISO 45001',
      subtitle: 'Occupational Health & Safety (OH&S)',
      icon: ShieldCheck
    }
  ];

  // Global Search Results for /search
  const searchResults = useMemo(() => {
    const q = globalSearchQuery.trim().toLowerCase();
    const matchedJobs = visibleJobs.filter(
      (j) =>
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
    );
    const matchedScholarships = visibleScholarships.filter(
      (s) =>
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q)
    );
    const matchedTrainings = trainings.filter(
      (t) =>
        t.isActive &&
        (!q ||
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.subType && t.subType.toLowerCase().includes(q)))
    );
    const matchedMembers = isCurrentUserPaid
      ? paidCommunityMembers.filter(
          (u) =>
            !q ||
            u.name.toLowerCase().includes(q) ||
            (u.privacySettings?.currentRole_public &&
              u.currentRole.toLowerCase().includes(q))
        )
      : [];
    return {
      jobs: matchedJobs,
      scholarships: matchedScholarships,
      trainings: matchedTrainings,
      members: matchedMembers
    };
  }, [
    globalSearchQuery,
    visibleJobs,
    visibleScholarships,
    trainings,
    paidCommunityMembers,
    isCurrentUserPaid
  ]);

  // Toggle Specialization Tag on Profile
  const handleToggleProfileSpecialization = (tag: string) => {
    const current = myProfile.specializations || [];
    const next = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setMyProfile({
      ...myProfile,
      specializations: next,
      skills: next
    });
  };

  // Persist both full private vault (/users/{uid}/private/profile) and sanitized public profile (/users/{uid})
  const persistUserProfileToFirestore = async (fullUser: HubUser) => {
    const sanitizedPublic = buildSanitizedPublicUser(fullUser);
    setUsers((prev) => {
      const exists = prev.some((u) => u.uid === sanitizedPublic.uid);
      if (exists) {
        return prev.map((u) =>
          u.uid === sanitizedPublic.uid ? sanitizedPublic : u
        );
      }
      return [sanitizedPublic, ...prev];
    });

    try {
      await Promise.all([
        setDoc(
          doc(db, 'users', fullUser.uid, 'private', 'profile'),
          fullUser,
          { merge: true }
        ),
        setDoc(doc(db, 'users', fullUser.uid), sanitizedPublic, {
          merge: true
        })
      ]);
    } catch (err) {
      try {
        handleFirestoreError(
          err,
          OperationType.WRITE,
          `users/${fullUser.uid}`
        );
      } catch {}
    }
  };

  // Instant Privacy Toggle Handler: Immediately saves toggle state & sanitizes shared Community data
  const handleTogglePrivacySetting = async (field: keyof PrivacySettings) => {
    const cleanUid = authUser?.uid || myProfile.uid;
    const nextValue = !myProfile.privacySettings[field];
    const updatedUser: HubUser = {
      ...myProfile,
      uid: cleanUid,
      name: myProfile.name.trim() || 'Food Specialist',
      isPaid: isCurrentUserPaid,
      privacySettings: {
        ...myProfile.privacySettings,
        [field]: nextValue
      }
    };
    setMyProfile(updatedUser);
    await persistUserProfileToFirestore(updatedUser);
    setProfileSaveMsg(
      nextValue
        ? 'Privacy updated: Selected field is now visible in your Community Profile.'
        : 'Privacy updated: Selected field is now hidden and strictly private to you.'
    );
    setTimeout(() => setProfileSaveMsg(null), 3500);
  };

  // Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUid =
      authUser?.uid ||
      myProfile.uid ||
      'user-' +
        (myProfile.name || 'specialist')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .slice(0, 60);

    const updatedUser: HubUser = {
      ...myProfile,
      uid: cleanUid,
      name: myProfile.name.trim() || 'Food Specialist',
      isPaid: isCurrentUserPaid,
      createdAt:
        myProfile.createdAt || new Date().toISOString().slice(0, 19) + 'Z'
    };

    setHasSavedProfile(true);
    setMyProfile(updatedUser);
    await persistUserProfileToFirestore(updatedUser);

    setProfileSaveMsg(
      isCurrentUserPaid
        ? 'Profile saved! Only the fields marked Public are visible to Paid Specialists in the Community Directory.'
        : 'Profile saved! Your current status is Free Member (Strictly Private until upgraded to Paid Member).'
    );
    setTimeout(() => setProfileSaveMsg(null), 5000);
  };

  const isUserAdmin = Boolean(
    myProfile.isAdmin ||
      authUser?.email?.toLowerCase() === 'mindmademedia9@gmail.com'
  );

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMedia(true);
    try {
      const result = await uploadMediaFile(file, 'avatars', storageConfig);
      const updated: HubUser = {
        ...myProfile,
        uid: authUser?.uid || myProfile.uid,
        profilePicUrl: result.url
      };
      setMyProfile(updated);
      await persistUserProfileToFirestore(updated);
      setUploadStatusMsg(
        result.provider === 'cloudinary-cdn'
          ? `Profile photo uploaded to Free Cloud CDN (${result.sizeKb} KB)!`
          : `Profile photo compressed & saved to Cloud Vault (${result.sizeKb} KB WebP)!`
      );
      setTimeout(() => setUploadStatusMsg(null), 4000);
    } catch {
      setUploadStatusMsg('Could not process image. Please try another photo.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMedia(true);
    try {
      const result = await uploadMediaFile(file, 'cvs', storageConfig);
      const updated: HubUser = {
        ...myProfile,
        uid: authUser?.uid || myProfile.uid,
        cvUrl: result.provider === 'cloudinary-cdn' ? result.url : result.fileName
      };
      setMyProfile(updated);
      await persistUserProfileToFirestore(updated);
      setUploadStatusMsg(
        result.provider === 'cloudinary-cdn'
          ? `CV uploaded to Cloud CDN (${result.sizeKb} KB)!`
          : `CV metadata & document linked to your Private Vault (${result.sizeKb} KB)!`
      );
      setTimeout(() => setUploadStatusMsg(null), 4000);
    } finally {
      setIsUploadingMedia(false);
    }
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
        `Payment receipt attached (${result.sizeKb} KB ${
          result.provider === 'cloudinary-cdn' ? 'Cloud CDN' : 'Compressed WebP'
        }). Click Submit below to send to Admin.`
      );
    } catch {
      setPaySubmitBanner('Failed to attach receipt image.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleSubmitPaymentVerification = async () => {
    if (!authUser) return;
    if (!payTransactionId.trim() && !payReceiptUrl) {
      setPaySubmitBanner(
        'Please enter your Transaction ID or upload your Payment Receipt screenshot.'
      );
      return;
    }

    const reqId = `pay-${authUser.uid.slice(0, 18)}-${Date.now()}`;
    const payload: HubPaymentRequest = {
      id: reqId,
      uid: authUser.uid,
      userName: myProfile.name || authUser.displayName || 'Food Specialist',
      userEmail: myProfile.email || authUser.email || '',
      userPhone: myProfile.phone || '',
      qualification: myProfile.qualification || '',
      currentRole: myProfile.currentRole || '',
      paymentMethod: payMethod,
      transactionId: payTransactionId.trim() || 'RECEIPT-UPLOADED',
      amount: payAmount.trim() || 'PKR 2,000',
      notes: payNotes.trim(),
      receiptImageUrl: payReceiptUrl || '',
      status: 'pending',
      submittedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };

    try {
      await setDoc(doc(db, 'paymentRequests', reqId), payload);
      const updatedUser: HubUser = {
        ...myProfile,
        uid: authUser.uid,
        paymentStatus: 'pending',
        paymentMethod: payMethod,
        paymentReference: payload.transactionId,
        paymentAmount: payload.amount,
        receiptImageUrl: payReceiptUrl || myProfile.receiptImageUrl || ''
      };
      setMyProfile(updatedUser);
      await persistUserProfileToFirestore(updatedUser);
      setPaySubmitBanner(
        'Payment Receipt & Verification Request saved in Cloud Storage! Admin will verify and activate your Paid Membership shortly.'
      );
      setPayTransactionId('');
      setPayNotes('');
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

  const handleAdminVerifyPayment = async (
    req: HubPaymentRequest,
    decision: 'verified' | 'rejected'
  ) => {
    try {
      await setDoc(
        doc(db, 'paymentRequests', req.id),
        { ...req, status: decision },
        { merge: true }
      );
      const userSnap = await getDoc(doc(db, 'users', req.uid));
      if (userSnap.exists()) {
        const uData = userSnap.data() as HubUser;
        const updatedUser: HubUser = {
          ...uData,
          isPaid: decision === 'verified',
          paymentStatus: decision
        };
        await setDoc(doc(db, 'users', req.uid), updatedUser, { merge: true });
        await setDoc(
          doc(db, 'users', req.uid, 'private', 'profile'),
          updatedUser,
          { merge: true }
        );
      }
      setAdminStatusBanner(
        decision === 'verified'
          ? `Approved ${req.userName} as Verified Paid Specialist!`
          : `Marked ${req.userName}'s payment request as Rejected.`
      );
      setTimeout(() => setAdminStatusBanner(null), 4000);
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

  const handleCertImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMedia(true);
    try {
      const result = await uploadMediaFile(file, 'certificates', storageConfig);
      setNewCertImageUrl(result.url);
      setAdminStatusBanner(
        `Certificate scan uploaded (${result.sizeKb} KB via ${
          result.provider === 'cloudinary-cdn' ? 'Cloud CDN' : 'Smart WebP'
        })!`
      );
      setTimeout(() => setAdminStatusBanner(null), 4000);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertRecipientName.trim() || !newCertTitle.trim()) return;
    const certId = `cert-${Date.now()}`;
    const serial =
      newCertNumber.trim() ||
      `FSP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const certImg =
      newCertImageUrl ||
      generateCertificateSvgDataUrl({
        certificateNumber: serial,
        recipientName: newCertRecipientName.trim(),
        trainingTitle: newCertTitle.trim(),
        trainingCategory: newCertCategory,
        accreditationBody: newCertAccreditation,
        issueDate: newCertIssueDate || '2026-11-03'
      });

    const newCert: HubCertificate = {
      id: certId,
      certificateNumber: serial,
      recipientName: newCertRecipientName.trim(),
      recipientEmail: newCertRecipientEmail.trim().toLowerCase(),
      trainingCategory: newCertCategory,
      trainingTitle: newCertTitle.trim(),
      accreditationBody: newCertAccreditation.trim() || 'Highfield UK Accredited',
      issueDate: newCertIssueDate || '2026-11-03',
      certificateImageUrl: certImg,
      verificationStatus: 'valid',
      issuedBy: 'Food Specialists Portal Admin',
      createdAt: new Date().toISOString().slice(0, 19) + 'Z'
    };

    try {
      await setDoc(doc(db, 'certificates', certId), newCert);
      setCertificates((prev) => [newCert, ...prev]);
      setAdminStatusBanner(
        `Issued & stored Training Certificate (${serial}) for ${newCert.recipientName}!`
      );
      setNewCertRecipientName('');
      setNewCertRecipientEmail('');
      setNewCertImageUrl('');
      setNewCertNumber(`FSP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setTimeout(() => setAdminStatusBanner(null), 4500);
    } catch (err) {
      try {
        handleFirestoreError(
          err,
          OperationType.WRITE,
          `certificates/${certId}`
        );
      } catch {}
    }
  };

  const handleDeleteCertificate = async (certId: string) => {
    try {
      await deleteDoc(doc(db, 'certificates', certId));
    } catch {}
    setCertificates((prev) => prev.filter((c) => c.id !== certId));
    setAdminStatusBanner('Certificate removed from storage.');
    setTimeout(() => setAdminStatusBanner(null), 3500);
  };

  const handleAdminPublishOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminOppTitle.trim() || !adminOppOrg.trim()) return;
    if (adminOppType === 'job') {
      const id = `job-${Date.now()}`;
      const newJob: HubJob = {
        id,
        title: adminOppTitle.trim(),
        company: adminOppOrg.trim(),
        location: adminOppLocation.trim() || 'Lahore, Pakistan',
        country: adminOppCountry.trim() || 'Pakistan',
        specialization: adminOppCat,
        experienceRequired: adminOppExpOrDeadline.trim() || '2+ Years',
        category: adminOppCat,
        description: adminOppDesc.trim() || 'Role in Food Quality & Safety.',
        requirements: 'BS/MS Food Science & Technology, HACCP / ISO 22000.',
        hrEmail: adminOppEmail.trim(),
        applyLink: adminOppLink.trim() || '#',
        tags: [adminOppCat, adminOppCountry],
        postedAt: new Date().toISOString().slice(0, 10),
        expiryAt: '2026-12-31',
        isActive: true
      };
      try {
        await setDoc(doc(db, 'jobs', id), newJob);
        setJobs((prev) => [newJob, ...prev]);
        setAdminStatusBanner(`Job "${newJob.title}" saved to Cloud Storage!`);
      } catch {}
    } else {
      const id = `sch-${Date.now()}`;
      const newSch: HubScholarship = {
        id,
        title: adminOppTitle.trim(),
        organization: adminOppOrg.trim(),
        country: adminOppCountry.trim() || 'International',
        specialization: 'Food Science & Technology',
        deadline: adminOppExpOrDeadline.trim() || '2026-12-31',
        fundingType:
          (adminOppCat as 'Fellowships' | 'International' | 'Grants') ||
          'Fellowships',
        degreeLevel: 'MS / PhD',
        description:
          adminOppDesc.trim() || 'Funded Food Science & Technology Scholarship.',
        eligibility: 'BS/MS in Food Science, Human Nutrition, or Dairy Tech.',
        hrEmail: adminOppEmail.trim(),
        applyLink: adminOppLink.trim() || '#',
        isActive: true
      };
      try {
        await setDoc(doc(db, 'scholarships', id), newSch);
        setScholarships((prev) => [newSch, ...prev]);
        setAdminStatusBanner(
          `Scholarship "${newSch.title}" saved to Cloud Storage!`
        );
      } catch {}
    }
    setAdminOppTitle('');
    setAdminOppOrg('');
    setAdminOppDesc('');
    setAdminOppEmail('');
    setAdminOppLink('');
    setTimeout(() => setAdminStatusBanner(null), 4000);
  };

  const handleSaveStorageConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CloudStorageConfig = {
      ...storageConfig,
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    setStorageConfig(updated);
    try {
      await setDoc(doc(db, 'settings', 'storageConfig'), updated);
      setAdminStatusBanner(
        updated.provider === 'cloudinary'
          ? 'Cloud Storage switched to Free Cloudinary Global CDN (25 GB Capacity)!'
          : 'Cloud Storage set to Built-in Smart WebP Compression + Firebase Firestore Vault!'
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
        trainings: trainings.length,
        certificates: certificates.length
      },
      data: {
        users,
        paymentRequests,
        jobs,
        scholarships,
        trainings,
        certificates
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

  const filteredCertificates = useMemo(() => {
    const q = certSearchQuery.trim().toLowerCase();
    if (!q) return certificates;
    return certificates.filter(
      (c) =>
        c.certificateNumber.toLowerCase().includes(q) ||
        c.recipientName.toLowerCase().includes(q) ||
        c.recipientEmail?.toLowerCase().includes(q) ||
        c.trainingTitle.toLowerCase().includes(q)
    );
  }, [certificates, certSearchQuery]);

  const myEarnedCertificates = useMemo(() => {
    const myEmail = (authUser?.email || myProfile.email || '').toLowerCase();
    const myName = (myProfile.name || '').toLowerCase();
    return certificates.filter(
      (c) =>
        (myEmail && c.recipientEmail?.toLowerCase() === myEmail) ||
        (c.recipientUid && c.recipientUid === authUser?.uid) ||
        (myName && c.recipientName.toLowerCase() === myName)
    );
  }, [certificates, authUser?.email, authUser?.uid, myProfile.email, myProfile.name]);

  const firstName = useMemo(() => {
    if (!myProfile.name) return 'Guest';
    return myProfile.name.split(' ')[0].replace(/,/g, '') || 'Guest';
  }, [myProfile.name]);

  const userInitial = firstName.charAt(0).toUpperCase() || 'G';

  // 1. While checking Firebase Auth state on page load, show a clean loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center justify-center p-4">
        <div className="bg-white border-[1.5px] border-[#9EC4A7] rounded-[28px] px-8 py-7 shadow-lg flex flex-col items-center gap-3 text-center max-w-xs w-full">
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h2 className="text-base font-extrabold text-[#0D2E1B]">
            Food Specialists Portal
          </h2>
          <p className="text-xs font-medium text-gray-500">
            Verifying your authentication session...
          </p>
        </div>
      </div>
    );
  }

  // 2. Strict Authentication Gate: If NOT signed in, hide the app and show ONLY AuthScreen
  if (!authUser) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-gray-900 flex flex-col items-center justify-start py-0 sm:py-6 px-0 sm:px-4">
      {/* Mobile-First App Container — Tight fit with zero unnecessary white space */}
      <div className="w-full max-w-[480px] bg-[#EEF7F0] sm:rounded-[38px] sm:border-[1.5px] sm:border-[#9EC4A7] sm:shadow-xl flex flex-col relative overflow-hidden">
        <div className="p-3.5 sm:p-5 pb-5 space-y-5">
          {/* TOP ROUNDED GREEN HEADER */}
          <Header
            showBack={route.name !== 'home'}
            onBack={() => {
              if (route.name === 'job-detail') setRoute({ name: 'jobs' });
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
            }}
            onHomeClick={() => setRoute({ name: 'home' })}
            onSearchClick={() => setRoute({ name: 'search' })}
            onBellClick={() => navigateToJobs('All')}
            onProfileClick={() => setRoute({ name: 'profile' })}
            onAdminClick={() => setRoute({ name: 'admin' })}
            isAdmin={isUserAdmin}
            onSignOutClick={handleSignOut}
            userEmail={authUser.email}
            userInitial={userInitial}
            userAvatarUrl={myProfile.profilePicUrl || authUser.photoURL || undefined}
          />

          {/* ==================== 1. HOME SCREEN (/) ==================== */}
          {route.name === 'home' && (
            <div className="space-y-4 px-1">
              {/* Greeting */}
              <div className="pt-1">
                <h1 className="text-[28px] sm:text-[30px] font-bold text-[#0D2E1B] tracking-tight leading-tight">
                  Good morning, {firstName}
                </h1>
              </div>

              {/* CARD 1 - JOBS */}
              <div className="relative bg-white border-[1.5px] border-[#78AF88] rounded-[24px] p-5 shadow-sm overflow-hidden">
                <LeafWatermark className="w-8 h-8 absolute left-5 top-[108px] opacity-65 pointer-events-none" />
                <AppleWatermark className="w-8 h-8 absolute right-6 top-[110px] opacity-55 pointer-events-none" />
                <TestTubeWatermark className="w-9 h-9 absolute right-14 bottom-3.5 opacity-75 pointer-events-none" />
                <WheatWatermark className="w-9 h-9 absolute right-4 bottom-3.5 opacity-75 pointer-events-none" />

                {/* Clickable Header Area */}
                <div
                  onClick={() => navigateToJobs('All')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigateToJobs('All');
                    }
                  }}
                  className="flex items-start justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-[74px] h-[74px] rounded-full bg-gradient-to-br from-[#D0ECDA] to-[#EAF6EE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <DuotoneBriefcaseIcon />
                    </div>
                    <div className="pt-1">
                      <h2 className="text-[28px] font-bold text-[#0D2E1B] leading-none tracking-tight group-hover:text-[#16A34A] transition-colors">
                        Jobs
                      </h2>
                      <p className="text-[14.5px] text-[#2F4737] mt-2 leading-snug max-w-[210px]">
                        Find roles in food R&amp;D, QA, production &amp; more
                      </p>
                    </div>
                  </div>

                  <span className="w-10 h-10 rounded-full border-2 border-[#16A34A] text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ArrowRight className="w-5 h-5 stroke-[2.4]" />
                  </span>
                </div>

                {/* Middle row 3 tags: Production, R&D Lab, Quality & Safety (100% NON-CLICKABLE, display only) */}
                <div className="grid grid-cols-3 gap-2 mt-6 px-2 relative z-10 select-none cursor-default">
                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <Wheat className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737]">
                      Production
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <FlaskConical className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737]">
                      R&amp;D Lab
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <ShieldCheck className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737] whitespace-nowrap">
                      Quality &amp; Safety
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 2 - SCHOLARSHIPS */}
              <div className="relative bg-white border-[1.5px] border-[#78AF88] rounded-[24px] p-5 shadow-sm overflow-hidden">
                <LeafWatermark className="w-8 h-8 absolute left-5 top-[112px] opacity-65 pointer-events-none" />
                <TestTubeWatermark className="w-9 h-9 absolute right-5 top-[106px] opacity-45 pointer-events-none" />
                <WheatWatermark className="w-9 h-9 absolute right-14 bottom-3.5 opacity-75 pointer-events-none" />
                <AppleWatermark className="w-8 h-8 absolute right-4 bottom-3.5 opacity-75 pointer-events-none" />

                {/* Clickable Header Area */}
                <div
                  onClick={() => navigateToScholarships('All')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigateToScholarships('All');
                    }
                  }}
                  className="flex items-start justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-[74px] h-[74px] rounded-full bg-gradient-to-br from-[#D0ECDA] to-[#EAF6EE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <DuotoneGradCapIcon />
                    </div>
                    <div className="pt-1">
                      <h2 className="text-[28px] font-bold text-[#0D2E1B] leading-none tracking-tight group-hover:text-[#16A34A] transition-colors">
                        Scholarships
                      </h2>
                      <p className="text-[14.5px] text-[#2F4737] mt-2 leading-snug max-w-[215px]">
                        Grants, fellowships &amp; programs for food tech
                      </p>
                    </div>
                  </div>

                  <span className="w-10 h-10 rounded-full border-2 border-[#16A34A] text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ArrowRight className="w-5 h-5 stroke-[2.4]" />
                  </span>
                </div>

                {/* Middle row 3 tags: Fellowships, International, Grants (100% NON-CLICKABLE, display only) */}
                <div className="grid grid-cols-3 gap-2 mt-6 px-2 relative z-10 select-none cursor-default">
                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <BookOpen className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737]">
                      Fellowships
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <Globe className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737]">
                      International
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <Trophy className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737]">
                      Grants
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. JOBS PAGE (/jobs) ==================== */}
          {route.name === 'jobs' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h1 className="text-[28px] font-extrabold text-[#0B3B1E] tracking-tight leading-tight">
                    Jobs for you
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setJobSpecFilter('All');
                    setJobCountryFilter('All');
                    setJobCategoryFilter('All');
                  }}
                  className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#15803D] hover:text-[#0B3B1E] transition-colors cursor-pointer"
                >
                  <ListFilter className="w-4 h-4 stroke-[2.5]" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 2 Dropdowns: Country & Category (Dynamically Populated from Posted Jobs) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative">
                  <select
                    value={jobCountryFilter}
                    onChange={(e) => setJobCountryFilter(e.target.value)}
                    aria-label="Filter by Country"
                    className="w-full appearance-none pl-3.5 pr-7 py-2.5 rounded-[18px] bg-[#15803D] text-white text-[13.5px] font-bold shadow-xs focus:outline-none cursor-pointer truncate"
                  >
                    <option value="All">All Countries</option>
                    {availableJobCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-white stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={jobCategoryFilter}
                    onChange={(e) => setJobCategoryFilter(e.target.value)}
                    aria-label="Filter by Category"
                    className={`w-full appearance-none pl-3.5 pr-7 py-2.5 rounded-[18px] text-[13.5px] font-bold border-[2px] border-[#16A34A] focus:outline-none cursor-pointer truncate ${
                      jobCategoryFilter !== 'All'
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white text-[#15803D]'
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
                      jobCategoryFilter !== 'All' ? 'text-white' : 'text-[#15803D]'
                    }`}
                  />
                </div>
              </div>

              {/* Jobs Card List (All Jobs accessible to everyone) */}
              <div className="space-y-4 pt-1">
                {visibleJobs.length === 0 ? (
                  <div className="bg-white border border-emerald-100 rounded-[24px] p-8 text-center text-gray-500 font-medium">
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
                <div className="bg-white border border-emerald-200 rounded-[26px] p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-emerald-100 pb-4">
                    <div className="space-y-1">
                      {/* Top tags: Only Category & Country */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {displayCategory && (
                          <span className="inline-block px-3 py-1 rounded-[10px] bg-[#BCE3C5] text-[#0B3B1E] text-xs font-bold">
                            {displayCategory}
                          </span>
                        )}
                        {displayCountry && (
                          <span className="inline-block px-3 py-1 rounded-[10px] bg-[#EAF5EC] text-[#15803D] text-xs font-bold">
                            {displayCountry}
                          </span>
                        )}
                      </div>
                      <h1 className="text-[22px] font-extrabold text-[#0B3B1E] leading-snug pt-1">
                        {job.title}
                      </h1>
                      <p className="text-sm font-semibold text-gray-600">
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
                      className="px-3.5 py-1.5 rounded-full bg-[#EAF5EC] hover:bg-[#D5EBD9] text-[#15803D] font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 mt-0.5"
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
                    <div className="p-3.5 rounded-2xl bg-[#F0FDF4]">
                      <div className="text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>Location</span>
                      </div>
                      <div className="font-bold text-gray-900 mt-0.5">
                        {job.location || 'As mentioned in post'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F0FDF4]">
                      <div className="text-gray-500 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#16A34A]" />
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
                  <div className="rounded-[22px] bg-[#F0FDF4] border-2 border-[#16A34A] p-4 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#15803D] text-white flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#0B3B1E]">
                          How to Apply &amp; Verification Disclaimer
                        </h3>
                        <p className="text-[11px] text-[#15803D] font-semibold">
                          Official Application Guidelines
                        </p>
                      </div>
                    </div>

                    {/* Professional, Short & Precise Disclaimer */}
                    <div className="space-y-2 text-xs text-gray-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-100">
                      <p>
                        <strong>Disclaimer:</strong> We curate and share professional opportunities from credible food industry sources. However, it is each applicant&apos;s responsibility to independently verify all company, position, and location details before applying or attending an interview.
                      </p>
                      <p>
                        <strong>How to Apply:</strong> Send your updated CV, academic credentials, and certifications directly to the contact email below, or apply through the official link if provided in the post.
                      </p>
                    </div>

                    {/* Contact Details Box */}
                    {(detectedEmail || detectedPhone) && (
                      <div className="bg-white rounded-2xl p-3 border border-emerald-200 space-y-2 text-xs">
                        {detectedEmail && (
                          <div>
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Employer HR Contact Email
                            </span>
                            <span className="font-extrabold text-[#0B3B1E] select-all break-all text-[13px]">
                              {detectedEmail}
                            </span>
                          </div>
                        )}

                        {detectedPhone && (
                          <div
                            className={
                              detectedEmail ? 'border-t border-emerald-100 pt-2' : ''
                            }
                          >
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Contact / WhatsApp Number
                            </span>
                            <span className="font-extrabold text-[#0B3B1E] select-all text-[13px]">
                              {detectedPhone}
                            </span>
                          </div>
                        )}

                        {emailSubject && detectedEmail && (
                          <div className="border-t border-emerald-100 pt-2">
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Recommended Email Subject Line
                            </span>
                            <span className="font-bold text-[#14532D] select-all text-xs">
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
                          className="w-full py-2.5 px-4 rounded-xl bg-[#15803D] hover:bg-[#0D2E1B] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
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
                          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-emerald-50 border-2 border-[#16A34A] text-[#0B3B1E] font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedId === 'job-phone' ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5] text-[#16A34A]" />
                              <span>Copied Contact Number!</span>
                            </>
                          ) : (
                            <>
                              <Phone className="w-4 h-4 text-[#16A34A]" />
                              <span>Copy Contact Number</span>
                            </>
                          )}
                        </button>
                      )}

                      {detectedLink && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(detectedLink, 'job-link')}
                          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-[#0B3B1E] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedId === 'job-link' ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5] text-[#16A34A]" />
                              <span>Copied Application Link!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-[#16A34A]" />
                              <span>Copy Application Link</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Personal 'Mark as Applied' Checkbox (Preserved) */}
                  <label className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EAF5EC] border border-[#9EC4A7] cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isApplied}
                        onChange={() => handleToggleAppliedJob(job.id)}
                        className="w-5 h-5 accent-[#15803D] rounded cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-[#0B3B1E]">
                          Mark as Applied
                        </div>
                        <div className="text-[11px] text-gray-600">
                          Track your personal external submission locally
                        </div>
                      </div>
                    </div>
                    {isApplied && (
                      <span className="px-2.5 py-1 rounded-full bg-[#15803D] text-white text-[11px] font-extrabold">
                        Applied ✓
                      </span>
                    )}
                  </label>
                </div>
              );
            })()}

          {/* ==================== 3. SCHOLARSHIPS PAGE (/scholarships) ==================== */}
          {route.name === 'scholarships' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h1 className="text-[26px] sm:text-[28px] font-extrabold text-[#0B3B1E] tracking-tight leading-tight">
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
                  className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#15803D] hover:text-[#0B3B1E] transition-colors cursor-pointer shrink-0"
                >
                  <ListFilter className="w-4 h-4 stroke-[2.5]" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 2 Dropdowns: Country & Funding */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative">
                  <select
                    value={schCountryFilter}
                    onChange={(e) => setSchCountryFilter(e.target.value)}
                    aria-label="Filter by Country"
                    className="w-full appearance-none pl-3.5 pr-7 py-2.5 rounded-[18px] bg-[#15803D] text-white text-[13.5px] font-bold shadow-xs focus:outline-none cursor-pointer truncate"
                  >
                    <option value="All">All Countries</option>
                    {availableScholarshipCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-white stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={schFundingFilter}
                    onChange={(e) => setSchFundingFilter(e.target.value)}
                    aria-label="Filter by Funding"
                    className={`w-full appearance-none pl-3.5 pr-7 py-2.5 rounded-[18px] text-[13.5px] font-bold border-[2px] border-[#16A34A] focus:outline-none cursor-pointer truncate ${
                      schFundingFilter !== 'All'
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white text-[#15803D]'
                    }`}
                  >
                    <option value="All">All Funding Types</option>
                    <option value="Fellowships">Fellowships</option>
                    <option value="International">International</option>
                    <option value="Grants">Grants</option>
                  </select>
                  <ChevronDown
                    className={`w-4 h-4 stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      schFundingFilter !== 'All' ? 'text-white' : 'text-[#15803D]'
                    }`}
                  />
                </div>
              </div>

              {/* Scholarships Card List (All Scholarships accessible to everyone) */}
              <div className="space-y-4 pt-1">
                {visibleScholarships.length === 0 ? (
                  <div className="bg-white border border-emerald-100 rounded-[24px] p-8 text-center text-gray-500 font-medium">
                    No scholarships match the selected filters.
                  </div>
                ) : (
                  visibleScholarships.map((sch) => {
                    const daysLeft = getDaysRemaining(sch.deadline);
                    const isSaved = savedScholarshipIds.includes(sch.id);
                    const isApplied = appliedScholarshipIds.includes(sch.id);
                    const orgInitials =
                      sch.organization
                        .split(' ')
                        .filter((w) => /^[A-Za-z]/.test(w))
                        .slice(0, 2)
                        .map((w) => w.charAt(0))
                        .join('')
                        .toUpperCase() || 'FS';

                    const BadgeIcon =
                      sch.fundingType === 'International'
                        ? Globe
                        : sch.fundingType === 'Grants'
                        ? Trophy
                        : GraduationCap;

                    return (
                      <div
                        key={sch.id}
                        onClick={() => {
                          setRoute({
                            name: 'scholarship-detail',
                            scholarshipId: sch.id
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setRoute({
                              name: 'scholarship-detail',
                              scholarshipId: sch.id
                            });
                          }
                        }}
                        className="bg-white border border-emerald-100/90 hover:border-[#16A34A] rounded-[26px] p-5 shadow-[0_6px_24px_rgba(22,163,74,0.07)] hover:shadow-[0_10px_28px_rgba(22,163,74,0.13)] transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-[18px] bg-gradient-to-b from-[#49A55E] to-[#2F8944] border-2 border-white shadow-[0_4px_12px_rgba(22,163,74,0.22)] ring-2 ring-emerald-50 flex flex-col items-center justify-center text-white shrink-0 mt-1">
                            <BadgeIcon className="w-5 h-5 stroke-[2.2] mb-0.5" />
                            <span className="text-[12px] font-extrabold tracking-wider leading-none">
                              {orgInitials}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-[19px] font-extrabold text-[#0B3B1E] leading-snug">
                              {sch.title}
                            </h3>

                            <p className="text-[13.5px] font-medium text-gray-700 mt-1 leading-snug">
                              {sch.organization} • {sch.country}
                            </p>

                            {/* Status & Metadata Row without tags */}
                            <div className="flex items-center justify-between gap-2 mt-3 pt-1">
                              <div>
                                {isApplied && (
                                  <span className="px-2.5 py-1 rounded-[10px] bg-[#16A34A] text-white text-[11px] font-bold leading-none inline-flex items-center gap-1">
                                    <Check className="w-3 h-3 stroke-[2.5]" />
                                    <span>Applied</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2.5">
                                <span className="text-[12.5px] font-semibold text-[#15803D] tabular-nums">
                                  Deadline {sch.deadline} • {daysLeft}d left
                                </span>

                                <button
                                  type="button"
                                  title={isSaved ? 'Saved Scholarship' : 'Save Scholarship'}
                                  onClick={(e) => handleToggleSavedScholarship(sch.id, e)}
                                  className="p-1 rounded-lg text-[#15803D] hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer"
                                >
                                  <Bookmark
                                    className={`w-5 h-5 stroke-[2.2] ${
                                      isSaved
                                        ? 'fill-[#15803D] text-[#15803D]'
                                        : 'text-[#15803D]'
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
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
                <div className="bg-white border border-emerald-200 rounded-[26px] p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-emerald-100 pb-4">
                    <div className="space-y-1">
                      {/* Top tags: Only Funding Type & Country */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-block px-3 py-1 rounded-[10px] bg-[#BCE3C5] text-[#0B3B1E] text-xs font-bold">
                          {displayFunding}
                        </span>
                        <span className="inline-block px-3 py-1 rounded-[10px] bg-[#EAF5EC] text-[#15803D] text-xs font-bold">
                          {displayCountry}
                        </span>
                      </div>
                      <h1 className="text-[22px] font-extrabold text-[#0B3B1E] leading-snug pt-1">
                        {sch.title}
                      </h1>
                      <p className="text-sm font-semibold text-gray-600">
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
                      className="px-3.5 py-1.5 rounded-full bg-[#EAF5EC] hover:bg-[#D5EBD9] text-[#15803D] font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 mt-0.5"
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
                    <div className="p-3.5 rounded-2xl bg-[#F0FDF4]">
                      <div className="text-gray-500">Host Country</div>
                      <div className="font-bold text-gray-900 mt-0.5">
                        {sch.country || 'International'}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#DCF2E3] border border-emerald-200">
                      <div className="text-[#14532D]">Deadline Countdown</div>
                      <div className="font-bold text-[#0B3B1E] mt-0.5 tabular-nums">
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
                  <div className="rounded-[22px] bg-[#F0FDF4] border-2 border-[#16A34A] p-4 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#15803D] text-white flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#0B3B1E]">
                          How to Apply &amp; Verification Disclaimer
                        </h3>
                        <p className="text-[11px] text-[#15803D] font-semibold">
                          Official Application Guidelines
                        </p>
                      </div>
                    </div>

                    {/* Professional English Disclaimer & Application Instructions */}
                    <div className="space-y-2 text-xs text-gray-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-emerald-100">
                      <p>
                        <strong>Disclaimer:</strong> We curate and share authentic, verified scholarship opportunities from reputable academic and research institutions. However, it is each individual applicant&apos;s responsibility to independently verify all eligibility requirements, institution credentials, and official deadlines before applying.
                      </p>
                      <p>
                        <strong>How to Apply:</strong> Prepare your academic transcripts, CV, and required documentation, then submit directly to the admissions contact email below or apply via the official institution link as per instructions.
                      </p>
                    </div>

                    {/* Contact & Email Details Box */}
                    {(detectedEmail || detectedPhone) && (
                      <div className="bg-white rounded-2xl p-3 border border-emerald-200 space-y-2 text-xs">
                        {detectedEmail && (
                          <div>
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Admissions / Coordinator Email
                            </span>
                            <span className="font-extrabold text-[#0B3B1E] select-all break-all text-[13px]">
                              {detectedEmail}
                            </span>
                          </div>
                        )}

                        {detectedPhone && (
                          <div
                            className={
                              detectedEmail ? 'border-t border-emerald-100 pt-2' : ''
                            }
                          >
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Contact / Coordinator Number
                            </span>
                            <span className="font-extrabold text-[#0B3B1E] select-all text-[13px]">
                              {detectedPhone}
                            </span>
                          </div>
                        )}

                        {emailSubject && detectedEmail && (
                          <div className="border-t border-emerald-100 pt-2">
                            <span className="text-[11px] font-bold uppercase text-gray-400 block">
                              Recommended Email Subject Line
                            </span>
                            <span className="font-bold text-[#14532D] select-all text-xs">
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
                          className="w-full py-2.5 px-4 rounded-xl bg-[#15803D] hover:bg-[#0D2E1B] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
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
                          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-emerald-50 border-2 border-[#16A34A] text-[#0B3B1E] font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedId === 'sch-phone' ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5] text-[#16A34A]" />
                              <span>Copied Contact Number!</span>
                            </>
                          ) : (
                            <>
                              <Phone className="w-4 h-4 text-[#16A34A]" />
                              <span>Copy Contact Number</span>
                            </>
                          )}
                        </button>
                      )}

                      {detectedLink && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(detectedLink, 'sch-link')}
                          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-[#0B3B1E] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          {copiedId === 'sch-link' ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5] text-[#16A34A]" />
                              <span>Copied Official Link!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-[#16A34A]" />
                              <span>Copy Application Link</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Personal 'Mark as Applied' Checkbox (Preserved) */}
                  <label className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EAF5EC] border border-[#9EC4A7] cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isApplied}
                        onChange={() => handleToggleAppliedScholarship(sch.id)}
                        className="w-5 h-5 accent-[#15803D] rounded cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-[#0B3B1E]">
                          Mark as Applied
                        </div>
                        <div className="text-[11px] text-gray-600">
                          Track your scholarship application status locally
                        </div>
                      </div>
                    </div>
                    {isApplied && (
                      <span className="px-2.5 py-1 rounded-full bg-[#15803D] text-white text-[11px] font-extrabold">
                        Applied ✓
                      </span>
                    )}
                  </label>
                </div>
              );
            })()}

          {/* ==================== 4. SEARCH PAGE (/search) ==================== */}
          {route.name === 'search' && (
            <div className="space-y-4 px-1">
              <div className="relative">
                <Search className="w-4 h-4 text-[#16A34A] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  placeholder="Search jobs, scholarships, trainings, specialists..."
                  className="w-full pl-10 pr-9 py-3.5 text-sm font-medium bg-white border-[1.5px] border-emerald-300 rounded-[20px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#16A34A] shadow-xs"
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
                {(['All', 'Jobs', 'Scholarships', 'Trainings', 'Members'] as const).map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSearchTab(t)}
                      className={`px-4 py-2 rounded-[14px] text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        searchTab === t
                          ? 'bg-[#15803D] text-white'
                          : 'bg-white border border-emerald-200 text-[#0B3B1E]'
                      }`}
                    >
                      {t}
                    </button>
                  )
                )}
              </div>

              <div className="space-y-5">
                {(searchTab === 'All' || searchTab === 'Jobs') &&
                  searchResults.jobs.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#14532D] px-1">
                        Jobs ({searchResults.jobs.length})
                      </h2>
                      {searchResults.jobs.map((j) => (
                        <JobCard
                          key={j.id}
                          job={j}
                          isApplied={appliedJobIds.includes(j.id)}
                          onToggleApplied={handleToggleAppliedJob}
                          onClick={(job) =>
                            setRoute({ name: 'job-detail', jobId: job.id })
                          }
                        />
                      ))}
                    </div>
                  )}

                {(searchTab === 'All' || searchTab === 'Scholarships') &&
                  searchResults.scholarships.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#14532D] px-1">
                        Scholarships ({searchResults.scholarships.length})
                      </h2>
                      {searchResults.scholarships.map((s) => (
                        <div
                          key={s.id}
                          onClick={() =>
                            setRoute({
                              name: 'scholarship-detail',
                              scholarshipId: s.id
                            })
                          }
                          className="bg-white border border-emerald-200 rounded-[24px] p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-[#16A34A] shadow-xs"
                        >
                          <div>
                            <div className="text-[11px] font-bold text-[#16A34A]">
                              {s.fundingType} • {s.country}
                            </div>
                            <div className="text-base font-bold text-[#0B3B1E]">
                              {s.title}
                            </div>
                            <div className="text-xs text-gray-500">{s.organization}</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}

                {(searchTab === 'All' || searchTab === 'Trainings') &&
                  searchResults.trainings.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#14532D] px-1">
                        Trainings ({searchResults.trainings.length})
                      </h2>
                      {searchResults.trainings.map((t) => (
                        <div
                          key={t.id}
                          onClick={() =>
                            setRoute({
                              name: 'training-detail',
                              trainingId: t.id
                            })
                          }
                          className="bg-white border border-emerald-200 rounded-[24px] p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-[#16A34A] shadow-xs"
                        >
                          <div>
                            <div className="text-[11px] font-bold text-[#16A34A]">
                              {t.category} {t.subType ? `• ${t.subType}` : ''}
                            </div>
                            <div className="text-base font-bold text-[#0B3B1E]">
                              {t.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {t.duration} • {t.fees}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}

                {(searchTab === 'All' || searchTab === 'Members') && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#14532D] px-1">
                      Verified Specialists ({searchResults.members.length})
                    </h2>
                    {isCurrentUserPaid ? (
                      searchResults.members.map((m) => (
                        <MemberCard
                          key={m.uid}
                          member={m}
                          onHireOrContact={(mem, e) => {
                            e.stopPropagation();
                            setContactModalMember(mem);
                          }}
                          onClick={(mem) =>
                            setRoute({ name: 'community-member', uid: mem.uid })
                          }
                        />
                      ))
                    ) : (
                      <div className="bg-white border border-emerald-200 rounded-[22px] p-4 text-xs text-gray-700 flex items-center justify-between gap-3">
                        <span>
                          Free Members cannot search the Specialist Directory. Check your status in Profile.
                        </span>
                        <button
                          type="button"
                          onClick={() => setRoute({ name: 'profile' })}
                          className="px-3 py-1.5 rounded-full bg-[#15803D] text-white font-bold shrink-0 cursor-pointer"
                        >
                          My Profile
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== 5. SPECIALIST COMMUNITY & DIRECTORY (/communities) ==================== */}
          {route.name === 'communities' && (
            <div className="space-y-4 px-1">
              {/* Top Rounded White Directory Header & Search/Filter Card */}
              <div className="bg-white border border-[#C6DFCB] rounded-[28px] p-5 shadow-[0_6px_20px_rgba(22,163,74,0.06)] space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h1 className="text-[24px] sm:text-[26px] font-extrabold text-[#0D2E1B] leading-tight tracking-tight">
                      Specialist Directory
                    </h1>
                    <p className="text-[12.5px] text-gray-600 font-medium mt-0.5">
                      {paidCommunityMembers.length} Verified Paid Specialists • Direct Professional Discovery
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRoute({ name: 'profile' })}
                    className="px-3 py-1.5 rounded-full bg-[#DCF2E3] hover:bg-[#C6E8D1] text-[#0D2E1B] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>My Profile</span>
                  </button>
                </div>

                {/* Search Input + Right "Hire Me" Filter Toggle */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#0D2E1B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled={!isCurrentUserPaid}
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      placeholder={
                        isCurrentUserPaid
                          ? 'Search specialists by name, role, bio...'
                          : 'Upgrade to Paid to search specialists...'
                      }
                      className="w-full pl-10 pr-8 py-2.5 text-[13.5px] bg-[#F2F7F3] border border-[#AECBB5] rounded-[18px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#16A34A] focus:bg-white transition-colors disabled:opacity-60"
                    />
                    {memberSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setMemberSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!isCurrentUserPaid}
                    title="Filter Open to Hire (Hire Me)"
                    onClick={() => setOnlyHireableFilter((prev) => !prev)}
                    className={`px-3 py-2.5 rounded-[16px] border text-xs font-extrabold flex items-center justify-center gap-1 shrink-0 transition-colors cursor-pointer disabled:opacity-60 ${
                      onlyHireableFilter
                        ? 'bg-[#15803D] border-[#15803D] text-white'
                        : 'bg-[#C5DFC9] border-[#9BBFA1] text-[#0D2E1B] hover:bg-[#B4D5B9]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hire Me</span>
                  </button>
                </div>

                {/* Filter Tags (HACCP, ISO 22000, Food Chemistry, QA/QC, etc.) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    disabled={!isCurrentUserPaid}
                    onClick={() => setCommSpecFilter('All')}
                    className={`px-3 py-1 rounded-full text-[11.5px] font-extrabold whitespace-nowrap transition-colors cursor-pointer disabled:opacity-60 ${
                      commSpecFilter === 'All'
                        ? 'bg-[#15803D] text-white'
                        : 'bg-[#EAF5EC] text-[#0D2E1B]'
                    }`}
                  >
                    All Tags
                  </button>
                  {COMMUNITY_SPECIALIZATION_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      disabled={!isCurrentUserPaid}
                      onClick={() => setCommSpecFilter(tag)}
                      className={`px-3 py-1 rounded-full text-[11.5px] font-extrabold whitespace-nowrap transition-colors cursor-pointer disabled:opacity-60 ${
                        commSpecFilter === tag
                          ? 'bg-[#15803D] text-white'
                          : 'bg-[#EAF5EC] text-[#0D2E1B] hover:bg-[#D5EAD8]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Country & Experience Dropdowns */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <select
                      disabled={!isCurrentUserPaid}
                      value={commCountryFilter}
                      onChange={(e) => setCommCountryFilter(e.target.value)}
                      className="w-full appearance-none pl-3 pr-7 py-2 rounded-[14px] bg-[#F2F7F3] border border-[#AECBB5] text-[#0D2E1B] text-xs font-bold focus:outline-none cursor-pointer disabled:opacity-60"
                    >
                      <option value="All">All Countries</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="UAE">UAE</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#0D2E1B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      disabled={!isCurrentUserPaid}
                      value={commExpFilter}
                      onChange={(e) => setCommExpFilter(e.target.value)}
                      className="w-full appearance-none pl-3 pr-7 py-2 rounded-[14px] bg-[#F2F7F3] border border-[#AECBB5] text-[#0D2E1B] text-xs font-bold focus:outline-none cursor-pointer disabled:opacity-60"
                    >
                      <option value="All">All Experience Levels</option>
                      <option value="3">3+ Years</option>
                      <option value="4">4+ Years</option>
                      <option value="5">5+ Years</option>
                      <option value="7">7+ Years</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#0D2E1B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* DIRECTORY + COMMUNITY FORUM CONTAINER WITH FROSTED-GLASS OVERLAY FOR FREE / GUEST */}
              <div className="relative">
                <div
                  className={`space-y-5 transition-all ${
                    !isCurrentUserPaid
                      ? 'blur-[6px] select-none pointer-events-none opacity-80'
                      : ''
                  }`}
                >
                  {/* 1. Verified Paid Specialists List */}
                  <div className="space-y-3.5">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <MemberCard
                          key={member.uid}
                          member={member}
                          onHireOrContact={(mem, e) => {
                            e.stopPropagation();
                            if (!isCurrentUserPaid) return;
                            setContactModalMember(mem);
                          }}
                          onClick={(m) => {
                            if (!isCurrentUserPaid) return;
                            setRoute({ name: 'community-member', uid: m.uid });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        />
                      ))
                    ) : (
                      <div className="bg-white border border-[#B8D3BE] rounded-[26px] p-6 text-center space-y-2 shadow-xs">
                        <div className="w-12 h-12 rounded-full bg-[#DCF2E3] text-[#15803D] flex items-center justify-center mx-auto">
                          <UserPlus className="w-6 h-6" />
                        </div>
                        <h2 className="text-[17px] font-extrabold text-[#0D2E1B]">
                          No Matching Specialists Found
                        </h2>
                        <p className="text-xs text-gray-600">
                          Try resetting the specialization, country, or experience filters above.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 2. Community Discussions & Technical Forum Threads */}
                  <div className="bg-white border border-[#B8D3BE] rounded-[26px] p-5 shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-[19px] font-extrabold text-[#0D2E1B]">
                          Community Discussions
                        </h2>
                        <p className="text-xs text-gray-600 font-medium">
                          Peer technical threads on FSSC 22000 v6, ISO 17025 &amp; R&amp;D
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-extrabold">
                        Paid Forum
                      </span>
                    </div>

                    <div className="space-y-3">
                      {INITIAL_COMMUNITY_THREADS.map((thread) => (
                        <div
                          key={thread.id}
                          className="p-4 rounded-[20px] bg-[#F6FBF7] border border-emerald-200/80 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={thread.authorAvatar}
                                alt={thread.authorName}
                                className="w-8 h-8 rounded-full object-cover border border-emerald-300 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-extrabold text-[#0D2E1B] truncate">
                                  {thread.authorName}
                                </div>
                                <div className="text-[10.5px] text-gray-500 truncate">
                                  {thread.authorRole}
                                </div>
                              </div>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#BCE3C5] text-[#0B3B1E] text-[10.5px] font-extrabold shrink-0">
                              {thread.topicTag}
                            </span>
                          </div>

                          <h3 className="text-[14px] font-extrabold text-[#0B3B1E] leading-snug">
                            {thread.title}
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {thread.preview}
                          </p>

                          <div className="flex items-center justify-between text-[11px] font-bold text-[#15803D] pt-1">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {thread.repliesCount} replies
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                {thread.likesCount} helpful
                              </span>
                            </div>
                            <span className="text-gray-400">{thread.postedAgo}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FROSTED-GLASS BLUR OVERLAY MODAL FOR FREE MEMBERS & GUESTS */}
                {!isCurrentUserPaid && (
                  <div className="absolute inset-x-0 top-6 z-20 flex justify-center px-3">
                    <div className="w-full max-w-[410px] bg-white/90 backdrop-blur-md border-2 border-[#16A34A] rounded-[28px] p-6 shadow-2xl text-center space-y-3.5">
                      <div className="w-14 h-14 rounded-full bg-[#DCF2E3] text-[#15803D] flex items-center justify-center mx-auto shadow-xs">
                        <Lock className="w-7 h-7" />
                      </div>
                      <h2 className="text-[20px] font-extrabold text-[#0D2E1B] leading-snug">
                        Upgrade to Unlock Community &amp; Networking
                      </h2>
                      <p className="text-[13px] text-gray-700 leading-relaxed">
                        Free members cannot search or view the{' '}
                        <strong>Specialist Directory</strong> or{' '}
                        <strong>Community Discussions</strong>. Only{' '}
                        <strong>Paid Members</strong> approved by Admin are visible here.
                      </p>
                      <button
                        type="button"
                        onClick={() => setRoute({ name: 'profile' })}
                        className="w-full py-3.5 px-5 rounded-[18px] bg-[#15803D] hover:bg-[#0D2E1B] text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Crown className="w-4 h-4 text-amber-300" />
                        <span>View Membership Status in My Profile</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== MEMBER PUBLIC PROFILE (/communities/[uid]) ==================== */}
          {route.name === 'community-member' &&
            (() => {
              const member =
                paidCommunityMembers.find((u) => u.uid === route.uid) ||
                users.find((u) => u.uid === route.uid) ||
                myProfile;

              if (!member) return null;
              const ps = member.privacySettings;
              const initials = (member.name || 'FS')
                .split(' ')
                .slice(0, 2)
                .map((w) => w.charAt(0))
                .join('')
                .toUpperCase();
              const externalUrl = member.linkedinUrl || member.portfolioUrl;

              return (
                <div className="bg-white border border-[#B8D3BE] rounded-[26px] p-5 shadow-sm space-y-5">
                  <div className="flex items-center gap-4 border-b border-emerald-100 pb-4">
                    <img
                      src={member.profilePicUrl || makeAvatarSvg(initials)}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#16A34A] shrink-0"
                    />
                    <div className="min-w-0 space-y-1 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h1 className="text-[21px] font-extrabold text-[#0D2E1B] truncate">
                          {member.name}
                        </h1>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] border border-[#16A34A]/40 text-[#14532D] text-[11px] font-extrabold shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>Verified Specialist</span>
                        </span>
                      </div>

                      {ps.currentRole_public && member.currentRole && (
                        <p className="text-xs font-bold text-[#15803D]">
                          {member.currentRole}
                          {member.company ? ` • ${member.company}` : ''}
                        </p>
                      )}
                      {ps.location_public && member.location && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>{member.location}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {member.bio && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Specialist Bio
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  )}

                  {/* Specializations */}
                  {member.specializations && member.specializations.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Specializations
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {member.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-3 py-1 rounded-full bg-[#BCE3C5] text-[#0B3B1E] text-xs font-bold"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education / Qualification */}
                  {ps.qualification_public && member.qualification && (
                    <div className="p-4 rounded-2xl bg-[#D8ECD9]/70 border border-emerald-200">
                      <div className="text-[11px] font-bold uppercase text-[#15803D] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Education &amp; Qualification</span>
                      </div>
                      <div className="text-sm font-bold text-[#0D2E1B] mt-1">
                        {member.qualification}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {ps.experience_public && member.experience && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Food Industry Experience
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {member.experience}
                      </p>
                    </div>
                  )}

                  {/* External Portfolio / LinkedIn & Permitted Contact Info */}
                  <div className="space-y-2.5 pt-2 border-t border-emerald-100">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      External Links &amp; Direct Discovery
                    </h2>

                    {externalUrl && (
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-2xl bg-[#EAF5EC] hover:bg-[#D5EAD8] border border-[#9EC4A7] text-[#0D2E1B] font-extrabold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <span>Connect via LinkedIn / Portfolio</span>
                        <ExternalLink className="w-4 h-4 text-[#15803D]" />
                      </a>
                    )}

                    {ps.email_public && member.email && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                        <Mail className="w-4 h-4 text-[#16A34A]" />
                        <span>{member.email}</span>
                      </div>
                    )}

                    {ps.phone_public && member.phone && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                        <Phone className="w-4 h-4 text-[#16A34A]" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Hire / Contact Me Button */}
                  <button
                    type="button"
                    onClick={() => setContactModalMember(member)}
                    className="w-full py-3.5 px-5 rounded-[18px] bg-[#15803D] hover:bg-[#0D2E1B] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>
                      {ps.hireMe_public
                        ? `Hire / Contact ${member.name}`
                        : `Contact ${member.name}`}
                    </span>
                  </button>
                </div>
              );
            })()}

          {/* ==================== 6. TRAININGS MAIN PAGE (/trainings) ==================== */}
          {route.name === 'trainings' && (
            <div className="space-y-4 px-1">
              <div className="bg-gradient-to-r from-[#2E7D47] via-[#469A61] to-[#2E7D47] rounded-[22px] px-4 py-4 text-center text-white shadow-sm border border-emerald-600/30">
                <h1 className="text-[22px] font-extrabold tracking-tight leading-snug">
                  Build Your Expertise
                </h1>
                <p className="text-[12px] sm:text-[13px] font-semibold text-emerald-50 mt-0.5">
                  Select a training category below to view accredited courses
                </p>
              </div>

              {/* CARD 1: HIGHFIELD TRAININGS */}
              <div
                onClick={() => {
                  setRoute({ name: 'trainings-highfield' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setRoute({ name: 'trainings-highfield' });
                  }
                }}
                className="relative bg-white border-[1.5px] border-[#78AF88] hover:border-[#16A34A] rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
              >
                <LeafWatermark className="w-8 h-8 absolute right-6 bottom-4 opacity-60 pointer-events-none" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-[68px] h-[68px] rounded-2xl bg-[#228B4E] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Shield className="w-9 h-9 stroke-[2.2]" />
                    </div>
                    <div className="pt-0.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#DCF2E3] text-[#138A3E] text-[11px] font-extrabold">
                        Highfield UK Accredited
                      </span>
                      <h2 className="text-[24px] font-extrabold text-[#0D2E1B] leading-tight mt-1">
                        Highfield Trainings
                      </h2>
                      <p className="text-[13.5px] text-[#2F4737] mt-1 leading-snug">
                        HACCP Level 1, HACCP Level 2, HACCP Level 3 &amp; HACCP Level 4
                      </p>
                    </div>
                  </div>

                  <span className="w-10 h-10 rounded-full border-2 border-[#16A34A] text-[#16A34A] flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 stroke-[2.4]" />
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C6E4C9] text-[#0D2E1B] text-[12.5px] font-bold">
                    <span className="text-[#16A34A]">●</span>
                    <span>4 HACCP Qualification Levels</span>
                  </span>
                  <span className="text-xs font-extrabold text-[#15803D]">
                    Open Trainings →
                  </span>
                </div>
              </div>

              {/* CARD 2: LEAD AUDITOR TRAININGS */}
              <div
                onClick={() => {
                  setRoute({ name: 'trainings-lead-auditor-hub' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setRoute({ name: 'trainings-lead-auditor-hub' });
                  }
                }}
                className="relative bg-white border-[1.5px] border-[#78AF88] hover:border-[#16A34A] rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
              >
                <WheatWatermark className="w-9 h-9 absolute right-6 bottom-4 opacity-60 pointer-events-none" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-[68px] h-[68px] rounded-2xl bg-[#14532D] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Award className="w-9 h-9 stroke-[2.2]" />
                    </div>
                    <div className="pt-0.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#DCF2E3] text-[#14532D] text-[11px] font-extrabold">
                        1. IRCA CQI • 2. Exemplar Global
                      </span>
                      <h2 className="text-[24px] font-extrabold text-[#0D2E1B] leading-tight mt-1">
                        Lead Auditor Trainings
                      </h2>
                      <p className="text-[13.5px] text-[#2F4737] mt-1 leading-snug">
                        ISO 22000, FSSC 22000, ISO 9001 &amp; ISO 14001 Lead Auditor
                      </p>
                    </div>
                  </div>

                  <span className="w-10 h-10 rounded-full border-2 border-[#16A34A] text-[#16A34A] flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 stroke-[2.4]" />
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C6E4C9] text-[#0D2E1B] text-[12.5px] font-bold">
                    <span className="text-[#16A34A]">●</span>
                    <span>8 Certified Lead Auditor Courses</span>
                  </span>
                  <span className="text-xs font-extrabold text-[#15803D]">
                    Open Trainings →
                  </span>
                </div>
              </div>

              {/* CARD 3: TRAINING CERTIFICATES VERIFICATION & DIGITAL VAULT */}
              <div className="bg-white border-[1.5px] border-[#78AF88] rounded-[24px] p-5 shadow-sm space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#15803D] text-white flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#DCF2E3] text-[#14532D] text-[10.5px] font-extrabold">
                        Cloud Certificate Registry
                      </span>
                      <h2 className="text-[19px] font-extrabold text-[#0D2E1B] leading-tight mt-0.5">
                        Training Certificates &amp; Verification
                      </h2>
                    </div>
                  </div>
                  {isUserAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setAdminTab('certificates');
                        setRoute({ name: 'admin' });
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#14532D] text-white text-[11px] font-extrabold cursor-pointer shrink-0"
                    >
                      + Issue Certificate
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Search by Certificate ID (e.g. <strong>FSP-2026-HACCP4-001</strong>), candidate name, or email to verify and download official Highfield &amp; Lead Auditor training certificates.
                </p>

                <div className="relative">
                  <Search className="w-4 h-4 text-[#15803D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={certSearchQuery}
                    onChange={(e) => setCertSearchQuery(e.target.value)}
                    placeholder="Enter Certificate ID, Name, or Email..."
                    className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-[#F2F7F3] border border-[#AECBB5] text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#16A34A] focus:bg-white"
                  />
                  {certSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCertSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-0.5">
                  {filteredCertificates.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-[#F6FBF7] border border-emerald-100 text-center text-xs text-gray-500 font-semibold">
                      No matching training certificate found for &ldquo;{certSearchQuery}&rdquo;.
                    </div>
                  ) : (
                    filteredCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        onClick={() => setSelectedCertificate(cert)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedCertificate(cert);
                          }
                        }}
                        className="p-3.5 rounded-2xl bg-[#F6FBF7] hover:bg-[#EAF5EC] border border-emerald-200 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-[#14532D] text-white text-[10px] font-extrabold">
                              {cert.certificateNumber}
                            </span>
                            <span className="text-[10.5px] font-extrabold text-[#15803D]">
                              • Verified ✓
                            </span>
                          </div>
                          <div className="text-[14px] font-extrabold text-[#0B3B1E] truncate mt-1">
                            {cert.recipientName}
                          </div>
                          <div className="text-[11.5px] font-semibold text-gray-600 truncate">
                            {cert.trainingTitle} ({cert.issueDate})
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-full bg-[#138A3E] text-white text-[11px] font-extrabold shrink-0">
                          View
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 6A. HIGHFIELD TRAININGS SUB-PAGE (HACCP Level 1–4) ==================== */}
          {route.name === 'trainings-highfield' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[24px] font-extrabold text-[#0B3B1E] leading-tight">
                      Highfield Trainings
                    </h1>
                    <span className="w-7 h-7 rounded-full bg-[#138A3E] text-white flex items-center justify-center">
                      <Leaf className="w-4 h-4 stroke-[2.3]" />
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-700 font-medium">
                    HACCP Level 1, Level 2, Level 3 &amp; Level 4 Qualifications
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'tr-hf-haccp-1',
                    title: 'HACCP Level 1',
                    subtitle: 'Foundation Food Safety & Hazard Awareness',
                    levelTag: 'Level 1',
                    icon: Shield
                  },
                  {
                    id: 'tr-hf-haccp-2',
                    title: 'HACCP Level 2',
                    subtitle: 'Codex 7 Principles & CCP Monitoring',
                    levelTag: 'Level 2',
                    icon: CheckCircle2
                  },
                  {
                    id: 'tr-hf-haccp-3',
                    title: 'HACCP Level 3',
                    subtitle: 'HACCP Plan Implementation for Supervisors',
                    levelTag: 'Level 3',
                    icon: Utensils
                  },
                  {
                    id: 'tr-hf-haccp-4',
                    title: 'HACCP Level 4',
                    subtitle: 'Managing HACCP Systems for QA Leaders',
                    levelTag: 'Level 4',
                    icon: Award
                  }
                ].map((card) => {
                  const IconComp = card.icon;
                  const matchingTr =
                    haccpTrainings.find((t) => t.id === card.id) ||
                    highfieldTrainings[0];

                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        if (matchingTr) {
                          setRoute({
                            name: 'training-detail',
                            trainingId: matchingTr.id
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (
                          (e.key === 'Enter' || e.key === ' ') &&
                          matchingTr
                        ) {
                          e.preventDefault();
                          setRoute({
                            name: 'training-detail',
                            trainingId: matchingTr.id
                          });
                        }
                      }}
                      className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-[22px] p-4 shadow-[0_4px_16px_rgba(22,163,74,0.07)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <div className="w-10 h-10 rounded-[14px] bg-[#228B4E] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <IconComp className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div>
                            <h3 className="text-[15px] font-extrabold text-[#0B3B1E] leading-tight">
                              {card.title}
                            </h3>
                            <p className="text-[11.5px] text-gray-600 leading-snug mt-0.5">
                              {card.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="px-2 py-0.5 rounded-md bg-[#E8F3EB] text-[#14532D] text-[10.5px] font-bold">
                            Highfield UK
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#E8F3EB] text-[#14532D] text-[10.5px] font-bold">
                            {card.levelTag}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3.5 flex items-center justify-end">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#138A3E] hover:bg-[#0E6F30] text-white text-[11.5px] font-bold inline-flex items-center gap-1 shadow-2xs transition-colors">
                          <span>Enroll</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== 6B. LEAD AUDITOR TRAININGS SUB-PAGE (1. IRCA CQI & 2. Exemplar Global) ==================== */}
          {route.name === 'trainings-lead-auditor-hub' && (
            <div className="space-y-6 px-1">
              <div>
                <h1 className="text-[24px] font-extrabold text-[#0B3B1E] leading-tight">
                  Lead Auditor Trainings
                </h1>
                <p className="text-[13px] text-gray-600 font-medium">
                  Accredited under 1. IRCA CQI &amp; 2. Exemplar Global
                </p>
              </div>

              {/* SECTION 1: 1. IRCA CQI */}
              <div className="bg-white border-[1.5px] border-[#B8D3BE] rounded-[26px] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#14532D] text-white flex items-center justify-center font-extrabold text-xs">
                      IRCA
                    </div>
                    <div>
                      <h2 className="text-[19px] font-extrabold text-[#0B3B1E] leading-none">
                        1. IRCA CQI
                      </h2>
                      <p className="text-[12px] text-gray-600 font-medium mt-1">
                        Chartered Quality Institute • 5-Day Lead Auditor Courses
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'tr-la-fssc22000-irca',
                      title: 'ISO 22000 Lead Auditor',
                      sub: 'Food Safety Management Systems (FSMS)',
                      meta: 'IRCA CQI Certified • 5 Days (40 Hours)'
                    },
                    {
                      id: 'tr-la-fssc22000-irca',
                      title: 'FSSC 22000 Lead Auditor',
                      sub: 'FSSC 22000 Version 6 Food Safety Systems',
                      meta: 'IRCA CQI Certified • 5 Days (40 Hours)'
                    },
                    {
                      id: 'tr-la-iso9001-irca',
                      title: 'ISO 9001 Lead Auditor',
                      sub: 'Quality Management Systems (QMS)',
                      meta: 'IRCA CQI Certified • 5 Days (40 Hours)'
                    },
                    {
                      id: 'tr-la-iso14001-irca',
                      title: 'ISO 14001 Lead Auditor',
                      sub: 'Environmental Management Systems (EMS)',
                      meta: 'IRCA CQI Certified • 5 Days (40 Hours)'
                    }
                  ].map((course, idx) => (
                    <div
                      key={`irca-${idx}`}
                      onClick={() => {
                        setRoute({
                          name: 'training-detail',
                          trainingId: course.id
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setRoute({
                            name: 'training-detail',
                            trainingId: course.id
                          });
                        }
                      }}
                      className="bg-[#F6FBF7] border border-emerald-200/80 hover:border-[#16A34A] rounded-[20px] p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#14532D] text-white flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[14.5px] font-extrabold text-[#0B3B1E] leading-tight">
                            {course.title}
                          </div>
                          <div className="text-[12px] font-semibold text-gray-700 truncate">
                            {course.sub}
                          </div>
                          <div className="text-[11px] text-[#15803D] font-bold mt-0.5">
                            {course.meta}
                          </div>
                        </div>
                      </div>

                      <span className="px-3.5 py-1.5 rounded-full bg-[#138A3E] text-white text-[11.5px] font-bold inline-flex items-center gap-1 shrink-0">
                        <span>Enroll</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: 2. Exemplar Global */}
              <div className="bg-white border-[1.5px] border-[#B8D3BE] rounded-[26px] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#138A3E] text-white flex items-center justify-center font-extrabold text-xs">
                      EG
                    </div>
                    <div>
                      <h2 className="text-[19px] font-extrabold text-[#0B3B1E] leading-none">
                        2. Exemplar Global
                      </h2>
                      <p className="text-[12px] text-gray-600 font-medium mt-1">
                        Certified Training Provider • 5-Day Lead Auditor Courses
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'tr-la-fssc22000-eg',
                      title: 'ISO 22000 Lead Auditor',
                      sub: 'Food Safety Management Systems (FSMS)',
                      meta: 'Exemplar Global Certified • 5 Days (40 Hours)'
                    },
                    {
                      id: 'tr-la-fssc22000-eg',
                      title: 'FSSC 22000 Lead Auditor',
                      sub: 'FSSC 22000 Version 6 Food Safety Systems',
                      meta: 'Exemplar Global Certified • 5 Days (40 Hours)'
                    },
                    {
                      id: 'tr-la-iso9001-eg',
                      title: 'ISO 9001 Lead Auditor',
                      sub: 'Quality Management Systems (QMS)',
                      meta: 'Exemplar Global Certified • 5 Days (40 Hours)'
                    },
                    {
                      id: 'tr-la-iso14001-eg',
                      title: 'ISO 14001 Lead Auditor',
                      sub: 'Environmental Management Systems (EMS)',
                      meta: 'Exemplar Global Certified • 5 Days (40 Hours)'
                    }
                  ].map((course, idx) => (
                    <div
                      key={`eg-${idx}`}
                      onClick={() => {
                        setRoute({
                          name: 'training-detail',
                          trainingId: course.id
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setRoute({
                            name: 'training-detail',
                            trainingId: course.id
                          });
                        }
                      }}
                      className="bg-[#F6FBF7] border border-emerald-200/80 hover:border-[#16A34A] rounded-[20px] p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#1E8244] text-white flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[14.5px] font-extrabold text-[#0B3B1E] leading-tight">
                            {course.title}
                          </div>
                          <div className="text-[12px] font-semibold text-gray-700 truncate">
                            {course.sub}
                          </div>
                          <div className="text-[11px] text-[#15803D] font-bold mt-0.5">
                            {course.meta}
                          </div>
                        </div>
                      </div>

                      <span className="px-3.5 py-1.5 rounded-full bg-[#138A3E] text-white text-[11.5px] font-bold inline-flex items-center gap-1 shrink-0">
                        <span>Enroll</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TRAINING DETAIL PAGE ==================== */}
          {route.name === 'training-detail' &&
            (() => {
              const tr =
                trainings.find((t) => t.id === route.trainingId) ||
                trainings[0];
              if (!tr) return null;

              return (
                <div className="bg-white border border-emerald-200 rounded-[26px] p-5 shadow-sm space-y-4">
                  <div className="space-y-1 border-b border-emerald-100 pb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-block px-3 py-1 rounded-[10px] bg-[#BCE3C5] text-[#0B3B1E] text-xs font-bold">
                        {tr.category}
                      </span>
                      {tr.subType && (
                        <span className="inline-block px-3 py-1 rounded-[10px] bg-[#EAF5EC] text-[#15803D] text-xs font-bold">
                          {tr.subType}
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#0B3B1E] leading-tight pt-1">
                      {tr.title}
                    </h1>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#F0FDF4]">
                      <div className="text-gray-500">Duration</div>
                      <div className="font-bold text-gray-900 mt-0.5">{tr.duration}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#DCF2E3]">
                      <div className="text-[#14532D]">Course Fee</div>
                      <div className="font-extrabold text-[#0B3B1E] mt-0.5">{tr.fees}</div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Course Overview
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {tr.description}
                    </p>
                  </div>

                  <a
                    href={tr.enrollLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#138A3E] hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Enroll via WhatsApp</span>
                    <ExternalLink className="w-4 h-4 ml-0.5" />
                  </a>
                </div>
              );
            })()}

          {/* ==================== 7. PROFILE DASHBOARD (/profile) ==================== */}
          {route.name === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 px-1">
              {/* ACCOUNT MEMBERSHIP STATUS CARD INSIDE PROFILE (Guest / Free Member / Paid Member) */}
              <div className="bg-white border-2 border-[#16A34A] rounded-[24px] p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#15803D]">
                      My Account Membership Status
                    </div>
                    <h3 className="text-[18px] font-extrabold text-[#0D2E1B] mt-0.5 flex items-center gap-2">
                      <span>{membershipStatus}</span>
                      {membershipStatus === 'Paid Member' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#14532D] text-white text-[10.5px] font-extrabold inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-300" />
                          <span>Verified Specialist</span>
                        </span>
                      )}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      membershipStatus === 'Paid Member'
                        ? 'bg-[#DCFCE7] text-[#14532D] border border-[#16A34A]/40'
                        : membershipStatus === 'Free Member'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    {membershipStatus}
                  </span>
                </div>

                {/* 3 Status Indicators showing Guest vs Free Member vs Paid Member right on Profile */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {(['Guest', 'Free Member', 'Paid Member'] as DevRole[]).map(
                    (statusOption) => {
                      const isCurrent = membershipStatus === statusOption;
                      return (
                        <div
                          key={statusOption}
                          className={`px-2.5 py-2 rounded-xl text-center border text-[11px] font-extrabold transition-all ${
                            isCurrent
                              ? 'bg-[#15803D] border-[#15803D] text-white shadow-xs'
                              : 'bg-[#F2F7F3] border-[#C6DFCB] text-gray-500'
                          }`}
                        >
                          <div>{statusOption}</div>
                          <div className="text-[9.5px] font-semibold opacity-90 mt-0.5">
                            {isCurrent ? 'Current Status' : 'Tier'}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {isCurrentUserPaid ? (
                  <p className="text-xs font-semibold text-[#14532D] bg-[#F0FDF4] p-3 rounded-xl border border-emerald-200">
                    Your profile is public and active in the Specialist Directory. [Verified Specialist]
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    Your profile is private ({membershipStatus}). Upgrade to Paid Member (verified by Admin) to get featured in the Specialist Directory and be discovered by recruiters.
                  </p>
                )}
              </div>

              {/* Top Profile Hero Card with Sage-Green Gradient Backdrop */}
              <div className="rounded-[28px] overflow-hidden bg-gradient-to-b from-[#6FA57C] via-[#9FC4A7]/60 to-white border border-[#B5D6BB] shadow-sm p-5 text-center relative">
                <div className="bg-white rounded-[18px] px-4 py-2.5 flex items-center justify-between shadow-xs mb-5">
                  <span className="text-[18px] font-extrabold text-[#0D2E1B]">
                    Profile Dashboard
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setRoute({ name: 'community-member', uid: myProfile.uid })
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#EAF5EC] text-[#15803D] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <Lock className="w-5 h-5 text-[#15803D]" />
                  </div>
                </div>

                {/* Large Centered Circular Avatar + Floating Green Edit Badge */}
                <div className="relative inline-block">
                  <img
                    src={myProfile.profilePicUrl || makeAvatarSvg('FS')}
                    alt={myProfile.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md bg-[#F0FDF4]"
                  />
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 px-2.5 py-1 rounded-full bg-[#228B4E] hover:bg-[#15803D] text-white text-[11px] font-bold border-2 border-white shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <h2 className="text-[22px] font-extrabold text-[#0D2E1B] leading-tight">
                    {myProfile.name}
                  </h2>
                  {isCurrentUserPaid && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#14532D] text-white text-[10.5px] font-extrabold">
                      <ShieldCheck className="w-3 h-3 text-emerald-300" />
                      <span>Verified Specialist</span>
                    </span>
                  )}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DCEFE0] text-[#138A3E] text-[12px] font-bold mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span>{myProfile.currentRole || 'Food Safety Specialist'}</span>
                </div>
                <p className="text-[12.5px] font-bold text-[#0D2E1B] mt-2">
                  Manage your Name, Title, Specializations, Bio &amp; External Links
                </p>
              </div>

              {/* HIRE ME TOGGLE CARD */}
              <div className="bg-white border border-emerald-200 rounded-[24px] p-4 shadow-xs flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-[#0D2E1B] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#15803D]" />
                    <span>&ldquo;Hire Me&rdquo; Badge Visible on My Profile</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Allow recruiters &amp; specialists to hire you based on your Education &amp; Experience
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(myProfile.privacySettings.hireMe_public)}
                    onClick={() => handleTogglePrivacySetting('hireMe_public')}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                      myProfile.privacySettings.hireMe_public
                        ? 'bg-[#228B4E] justify-end'
                        : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                  </button>
                  <span
                    className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${
                      myProfile.privacySettings.hireMe_public
                        ? 'bg-[#68B678]'
                        : 'bg-[#A6ABA8]'
                    }`}
                  >
                    {myProfile.privacySettings.hireMe_public ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>

              {profileSaveMsg && (
                <div className="bg-[#15803D] text-white rounded-2xl p-3.5 text-xs font-bold flex items-center justify-between gap-2 shadow-sm">
                  <span>{profileSaveMsg}</span>
                </div>
              )}

              {/* ✨ SPECIALIZATIONS & BIO CARD */}
              <div className="bg-white border border-emerald-100 rounded-[26px] p-5 shadow-[0_6px_24px_rgba(22,163,74,0.08)] space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-extrabold text-[#0D2E1B]">
                    Specializations &amp; Professional Bio
                  </h3>
                  <span className="text-[11px] font-bold text-[#15803D]">
                    Directory Filters
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {COMMUNITY_SPECIALIZATION_TAGS.map((tag) => {
                    const selected = (myProfile.specializations || []).includes(
                      tag
                    );
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleProfileSpecialization(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#15803D] text-white shadow-xs'
                            : 'bg-[#EAF3EC] text-[#0D2E1B] hover:bg-[#D5EAD8]'
                        }`}
                      >
                        {selected ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1 pt-1">
                  <label className="block text-xs font-extrabold text-[#0D2E1B]">
                    Short Professional Bio
                  </label>
                  <textarea
                    rows={2}
                    value={myProfile.bio || ''}
                    onChange={(e) =>
                      setMyProfile({ ...myProfile, bio: e.target.value })
                    }
                    placeholder="Summarize your food safety, QA/QC, or R&D expertise..."
                    className="w-full px-3 py-2 rounded-[12px] bg-[#EAF3EC] text-[13px] font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>

                {/* External Links: LinkedIn / Portfolio */}
                <div className="space-y-1 pt-1">
                  <label className="block text-xs font-extrabold text-[#0D2E1B]">
                    External LinkedIn / Portfolio Link
                  </label>
                  <input
                    type="url"
                    value={myProfile.linkedinUrl || ''}
                    onChange={(e) =>
                      setMyProfile({
                        ...myProfile,
                        linkedinUrl: e.target.value
                      })
                    }
                    placeholder="https://www.linkedin.com/in/your-profile"
                    className="w-full px-3 py-2 rounded-[12px] bg-[#EAF3EC] text-[13px] font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>
              </div>

              {/* ✨ PROFILE DETAILS & PRIVACY TOGGLES WHITE CARD */}
              <div className="bg-white border border-emerald-100 rounded-[26px] p-5 shadow-[0_6px_24px_rgba(22,163,74,0.08)] space-y-3.5">
                <div className="flex items-center justify-center gap-1.5 pb-1">
                  <Sparkles className="w-5 h-5 text-[#15803D]" />
                  <h3 className="text-[20px] font-extrabold text-[#0D2E1B]">
                    Profile Details &amp; Privacy
                  </h3>
                </div>

                {/* Row 1: Name */}
                <div className="flex items-center gap-2.5">
                  <label className="w-[95px] text-[13px] font-extrabold text-[#0D2E1B] shrink-0">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={myProfile.name}
                    onChange={(e) =>
                      setMyProfile({ ...myProfile, name: e.target.value })
                    }
                    className="flex-1 min-w-0 px-3 py-2 rounded-[12px] bg-[#EAF3EC] text-[13px] font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-11 h-6 rounded-full bg-[#228B4E] p-0.5 flex items-center justify-end">
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#68B678] text-white text-[10px] font-bold">
                      Public
                    </span>
                  </div>
                </div>

                {/* Row 2: Title / Current Role */}
                <div className="flex items-center gap-2.5">
                  <label className="w-[95px] text-[13px] font-extrabold text-[#0D2E1B] shrink-0">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    value={myProfile.currentRole}
                    onChange={(e) =>
                      setMyProfile({
                        ...myProfile,
                        currentRole: e.target.value
                      })
                    }
                    className="flex-1 min-w-0 px-3 py-2 rounded-[12px] bg-[#EAF3EC] text-[13px] font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={myProfile.privacySettings.currentRole_public}
                      onClick={() =>
                        handleTogglePrivacySetting('currentRole_public')
                      }
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                        myProfile.privacySettings.currentRole_public
                          ? 'bg-[#228B4E] justify-end'
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                    <span
                      className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${
                        myProfile.privacySettings.currentRole_public
                          ? 'bg-[#68B678]'
                          : 'bg-[#A6ABA8]'
                      }`}
                    >
                      {myProfile.privacySettings.currentRole_public
                        ? 'Public'
                        : 'Private'}
                    </span>
                  </div>
                </div>

                {/* Row 3: Qualification (Education) */}
                <div className="flex items-center gap-2.5">
                  <label className="w-[95px] text-[13px] font-extrabold text-[#0D2E1B] shrink-0">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={myProfile.qualification}
                    onChange={(e) =>
                      setMyProfile({
                        ...myProfile,
                        qualification: e.target.value
                      })
                    }
                    className="flex-1 min-w-0 px-3 py-2 rounded-[12px] bg-[#EAF3EC] text-[13px] font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={myProfile.privacySettings.qualification_public}
                      onClick={() =>
                        handleTogglePrivacySetting('qualification_public')
                      }
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                        myProfile.privacySettings.qualification_public
                          ? 'bg-[#228B4E] justify-end'
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                    <span
                      className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${
                        myProfile.privacySettings.qualification_public
                          ? 'bg-[#68B678]'
                          : 'bg-[#A6ABA8]'
                      }`}
                    >
                      {myProfile.privacySettings.qualification_public
                        ? 'Public'
                        : 'Private'}
                    </span>
                  </div>
                </div>

                {/* Row 4: Experience */}
                <div className="flex items-center gap-2.5">
                  <label className="w-[95px] text-[13px] font-extrabold text-[#0D2E1B] shrink-0">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={myProfile.experience}
                    onChange={(e) =>
                      setMyProfile({ ...myProfile, experience: e.target.value })
                    }
                    className="flex-1 min-w-0 px-3 py-2 rounded-[12px] bg-[#EAF3EC] text-[13px] font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={myProfile.privacySettings.experience_public}
                      onClick={() =>
                        handleTogglePrivacySetting('experience_public')
                      }
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                        myProfile.privacySettings.experience_public
                          ? 'bg-[#228B4E] justify-end'
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                    <span
                      className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${
                        myProfile.privacySettings.experience_public
                          ? 'bg-[#68B678]'
                          : 'bg-[#A6ABA8]'
                      }`}
                    >
                      {myProfile.privacySettings.experience_public
                        ? 'Public'
                        : 'Private'}
                    </span>
                  </div>
                </div>

                {/* Row 5: Location */}
                <div className="flex items-center gap-2.5">
                  <label className="w-[95px] text-[13px] font-extrabold text-[#0D2E1B] shrink-0">
                    Location
                  </label>
                  <input
                    type="text"
                    value={myProfile.location}
                    onChange={(e) =>
                      setMyProfile({ ...myProfile, location: e.target.value })
                    }
                    className="flex-1 min-w-0 px-3 py-2 rounded-[12px] bg-[#EAF3EC] text-[13px] font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={myProfile.privacySettings.location_public}
                      onClick={() =>
                        handleTogglePrivacySetting('location_public')
                      }
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                        myProfile.privacySettings.location_public
                          ? 'bg-[#228B4E] justify-end'
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                    <span
                      className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${
                        myProfile.privacySettings.location_public
                          ? 'bg-[#68B678]'
                          : 'bg-[#A6ABA8]'
                      }`}
                    >
                      {myProfile.privacySettings.location_public
                        ? 'Public'
                        : 'Private'}
                    </span>
                  </div>
                </div>

                {/* Row 6: Email */}
                <div className="flex items-center gap-2.5">
                  <label className="w-[95px] text-[13px] font-extrabold text-[#0D2E1B] shrink-0">
                    Email
                  </label>
                  <input
                    type="email"
                    value={myProfile.email}
                    onChange={(e) =>
                      setMyProfile({ ...myProfile, email: e.target.value })
                    }
                    className="flex-1 min-w-0 px-3 py-2 rounded-[12px] bg-[#EAF3EC] text-[13px] font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={myProfile.privacySettings.email_public}
                      onClick={() => handleTogglePrivacySetting('email_public')}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                        myProfile.privacySettings.email_public
                          ? 'bg-[#228B4E] justify-end'
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                    <span
                      className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${
                        myProfile.privacySettings.email_public
                          ? 'bg-[#68B678]'
                          : 'bg-[#A6ABA8]'
                      }`}
                    >
                      {myProfile.privacySettings.email_public
                        ? 'Public'
                        : 'Private'}
                    </span>
                  </div>
                </div>

                {/* Row 7: Phone */}
                <div className="flex items-center gap-2.5">
                  <label className="w-[95px] text-[13px] font-extrabold text-[#0D2E1B] shrink-0">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={myProfile.phone}
                    onChange={(e) =>
                      setMyProfile({ ...myProfile, phone: e.target.value })
                    }
                    className="flex-1 min-w-0 px-3 py-2 rounded-[12px] bg-[#EAF3EC] text-[13px] font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={myProfile.privacySettings.phone_public}
                      onClick={() => handleTogglePrivacySetting('phone_public')}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                        myProfile.privacySettings.phone_public
                          ? 'bg-[#228B4E] justify-end'
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                    <span
                      className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${
                        myProfile.privacySettings.phone_public
                          ? 'bg-[#68B678]'
                          : 'bg-[#A6ABA8]'
                      }`}
                    >
                      {myProfile.privacySettings.phone_public
                        ? 'Public'
                        : 'Private'}
                    </span>
                  </div>
                </div>
              </div>

              {uploadStatusMsg && (
                <div className="bg-[#DCFCE7] border border-[#16A34A] text-[#0D2E1B] rounded-2xl p-3 text-xs font-extrabold flex items-center justify-between">
                  <span>{uploadStatusMsg}</span>
                  {isUploadingMedia && (
                    <Loader2 className="w-4 h-4 animate-spin text-[#15803D]" />
                  )}
                </div>
              )}

              {/* CV Upload PDF */}
              <div className="bg-white border border-emerald-100 rounded-[24px] p-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <div className="min-w-0 text-xs">
                    <div className="font-bold text-gray-900 truncate">
                      {myProfile.cvUrl || 'No CV PDF uploaded yet'}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Upload CV PDF for Hiring &amp; QA Roles (Saved to Cloud Vault)
                    </div>
                  </div>
                </div>
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => cvInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#EAF3EC] text-[#15803D] text-xs font-bold shrink-0 cursor-pointer"
                >
                  Upload PDF
                </button>
              </div>

              {/* MY EARNED TRAINING CERTIFICATES VAULT CARD */}
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
                    onClick={() => setRoute({ name: 'trainings' })}
                    className="text-[11px] font-extrabold text-[#15803D] underline cursor-pointer"
                  >
                    Verify Any ID →
                  </button>
                </div>

                {myEarnedCertificates.length === 0 ? (
                  <p className="text-xs text-gray-600">
                    Certificates issued to your email (<strong>{myProfile.email}</strong>) or name will automatically appear here for viewing &amp; download.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {myEarnedCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        onClick={() => setSelectedCertificate(cert)}
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

              {/* PREMIUM / PAID MEMBERSHIP PAYMENT RECEIPT UPLOAD & VERIFICATION CARD */}
              <div className="bg-white border-2 border-[#16A34A] rounded-[26px] p-5 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#15803D]" />
                    <div>
                      <h3 className="text-[16px] font-extrabold text-[#0D2E1B]">
                        Paid Membership &amp; Payment Receipt Vault
                      </h3>
                      <p className="text-[11px] text-gray-600">
                        Upload your payment receipt to unlock Verified Specialist status
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10.5px] font-extrabold ${
                      myProfile.isPaid
                        ? 'bg-[#DCFCE7] text-[#14532D]'
                        : myProfile.paymentStatus === 'pending'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {myProfile.isPaid
                      ? 'Verified ✓'
                      : myProfile.paymentStatus === 'pending'
                      ? 'Pending Review'
                      : 'Free Tier'}
                  </span>
                </div>

                {!myProfile.isPaid && (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-3 gap-1.5">
                      {(
                        ['EasyPaisa', 'JazzCash', 'Bank Transfer'] as const
                      ).map((method) => (
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
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0D2E1B] mb-1">
                          Transaction / Ref ID
                        </label>
                        <input
                          type="text"
                          value={payTransactionId}
                          onChange={(e) => setPayTransactionId(e.target.value)}
                          placeholder="e.g. TID-89341209"
                          className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#0D2E1B] mb-1">
                          Paid Amount
                        </label>
                        <input
                          type="text"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          placeholder="PKR 2,000"
                          className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                        />
                      </div>
                    </div>

                    {/* Payment Receipt Image Upload */}
                    <div className="p-3.5 rounded-2xl bg-[#F2F7F3] border border-dashed border-[#16A34A] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ImageIcon className="w-5 h-5 text-[#15803D] shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-[#0D2E1B] truncate">
                            {payReceiptUrl
                              ? 'Payment Receipt Attached ✓'
                              : 'Upload Payment Receipt Screenshot'}
                          </div>
                          <div className="text-[10.5px] text-gray-600">
                            Auto-compressed for fast cloud storage
                          </div>
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
                        className="px-3 py-1.5 rounded-xl bg-[#15803D] text-white text-xs font-extrabold shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{payReceiptUrl ? 'Change' : 'Upload'}</span>
                      </button>
                    </div>

                    {payReceiptUrl && (
                      <div className="rounded-2xl overflow-hidden border border-emerald-200 max-h-40 bg-gray-50 flex justify-center">
                        <img
                          src={payReceiptUrl}
                          alt="Payment Receipt Preview"
                          className="max-h-36 object-contain"
                        />
                      </div>
                    )}

                    {paySubmitBanner && (
                      <div className="p-3 rounded-xl bg-[#DCFCE7] text-[#0D2E1B] text-xs font-bold">
                        {paySubmitBanner}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSubmitPaymentVerification}
                      className="w-full py-3 px-4 rounded-2xl bg-[#14532D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      Submit Payment Receipt for Admin Verification
                    </button>
                  </div>
                )}
              </div>

              {isUserAdmin && (
                <button
                  type="button"
                  onClick={() => setRoute({ name: 'admin' })}
                  className="w-full py-3.5 px-5 rounded-[18px] bg-[#0D2E1B] hover:bg-[#14532D] text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Database className="w-4 h-4 text-emerald-300" />
                  <span>Open Admin Cloud Storage &amp; Control Panel</span>
                </button>
              )}

              {/* Full-Width Green "Save Changes" Button */}
              <button
                type="submit"
                className="w-full py-4 px-5 rounded-[18px] bg-[#168A42] hover:bg-[#117035] text-white font-extrabold text-[16px] shadow-md transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          )}

          {/* ==================== 8. ADMIN CLOUD STORAGE, RECEIPTS & CERTIFICATES CONSOLE (/admin) ==================== */}
          {route.name === 'admin' && isUserAdmin && (
            <div className="space-y-4 px-1">
              <div className="bg-gradient-to-r from-[#0D2E1B] via-[#14532D] to-[#15803D] rounded-[24px] p-5 text-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200 text-[10.5px] font-extrabold">
                    Admin Cloud Storage &amp; Control Center
                  </span>
                  <button
                    type="button"
                    onClick={handleExportFullBackupJson}
                    className="px-3 py-1 rounded-full bg-white text-[#0D2E1B] text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Backup All Data</span>
                  </button>
                </div>
                <h1 className="text-[22px] font-extrabold leading-tight">
                  Cloud Storage &amp; Data Vault
                </h1>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Manage high-traffic storage for User Profiles, Avatars, Payment Receipts, Jobs, Scholarships &amp; Training Certificates.
                </p>
              </div>

              {adminStatusBanner && (
                <div className="p-3.5 rounded-2xl bg-[#15803D] text-white text-xs font-extrabold flex items-center justify-between shadow-xs">
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

              {/* 4 Admin Navigation Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(
                  [
                    { id: 'storage', label: '1. Cloud Storage' },
                    {
                      id: 'receipts',
                      label: `2. Receipts (${paymentRequests.length})`
                    },
                    {
                      id: 'certificates',
                      label: `3. Certificates (${certificates.length})`
                    },
                    { id: 'opportunities', label: '4. Jobs & Scholars' }
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAdminTab(t.id)}
                    className={`py-2.5 px-2.5 rounded-2xl text-xs font-extrabold border transition-colors cursor-pointer ${
                      adminTab === t.id
                        ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                        : 'bg-white text-[#0D2E1B] border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: CLOUD STORAGE ARCHITECTURE & LIVE METRICS */}
              {adminTab === 'storage' && (
                <div className="space-y-4">
                  <div className="bg-white border border-emerald-200 rounded-[24px] p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-extrabold text-[#0D2E1B] flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-[#15803D]" />
                        <span>Live Cloud Storage Collections Status</span>
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] text-[10.5px] font-extrabold">
                        100% Free Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-3 rounded-2xl bg-[#F2F7F3] border border-emerald-100">
                        <div className="text-gray-500 font-semibold">
                          User Profiles &amp; Pics
                        </div>
                        <div className="text-lg font-extrabold text-[#0D2E1B] mt-0.5">
                          {users.length} Users
                        </div>
                        <div className="text-[10.5px] text-[#15803D] font-bold">
                          /users + /private/profile
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#F2F7F3] border border-emerald-100">
                        <div className="text-gray-500 font-semibold">
                          Payment Receipts
                        </div>
                        <div className="text-lg font-extrabold text-[#0D2E1B] mt-0.5">
                          {paymentRequests.length} Receipts
                        </div>
                        <div className="text-[10.5px] text-[#15803D] font-bold">
                          /paymentRequests
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#F2F7F3] border border-emerald-100">
                        <div className="text-gray-500 font-semibold">
                          Jobs &amp; Scholarships
                        </div>
                        <div className="text-lg font-extrabold text-[#0D2E1B] mt-0.5">
                          {jobs.length + scholarships.length} Posts
                        </div>
                        <div className="text-[10.5px] text-[#15803D] font-bold">
                          {jobs.length} Jobs • {scholarships.length} Scholarships
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#F2F7F3] border border-emerald-100">
                        <div className="text-gray-500 font-semibold">
                          Training Certificates
                        </div>
                        <div className="text-lg font-extrabold text-[#0D2E1B] mt-0.5">
                          {certificates.length} Issued
                        </div>
                        <div className="text-[10.5px] text-[#15803D] font-bold">
                          /certificates Vault
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STORAGE ENGINE CONFIGURATION (SMART WEBP VS 25GB CLOUDINARY FREE CDN) */}
                  <form
                    onSubmit={handleSaveStorageConfig}
                    className="bg-white border border-emerald-200 rounded-[24px] p-5 shadow-xs space-y-3.5"
                  >
                    <div>
                      <h3 className="text-base font-extrabold text-[#0D2E1B]">
                        High-Traffic Free Media Storage Engine
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Choose how Profile Photos, Payment Receipts, CVs &amp; Training Certificates are stored:
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
                            ? 'bg-[#F0FDF4] border-2 border-[#16A34A]'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#0D2E1B]">
                            Tier 1: Smart WebP Compression + Firebase Firestore (Default)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#15803D] text-white text-[10px] font-bold">
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
                            ? 'bg-[#F0FDF4] border-2 border-[#16A34A]'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#0D2E1B]">
                            Tier 2: Cloudinary 25 GB Free Global CDN (Massive Traffic)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#14532D] text-[10px] font-bold">
                            25 GB Free
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1">
                          Uploads images, receipts, PDFs &amp; certificates to Cloudinary&apos;s free 25 GB CDN and saves only the tiny HTTPS URL (~80 bytes) in Firestore for 100,000+ users.
                        </p>
                      </label>
                    </div>

                    {storageConfig.provider === 'cloudinary' && (
                      <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#F2F7F3] border border-emerald-200">
                        <div>
                          <label className="block text-[11px] font-extrabold text-[#0D2E1B] mb-1">
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
                            className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-extrabold text-[#0D2E1B] mb-1">
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
                            className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-2xl bg-[#15803D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold cursor-pointer"
                    >
                      Save Cloud Storage Configuration
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: PAYMENT RECEIPTS & PREMIUM MEMBER APPROVALS */}
              {adminTab === 'receipts' && (
                <div className="bg-white border border-emerald-200 rounded-[24px] p-4 shadow-xs space-y-3">
                  <h2 className="text-base font-extrabold text-[#0D2E1B]">
                    Submitted Payment Receipts ({paymentRequests.length})
                  </h2>
                  {paymentRequests.length === 0 ? (
                    <p className="text-xs text-gray-500 py-4 text-center">
                      No payment receipts submitted yet. When users upload a receipt in their Profile, it appears here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {paymentRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-4 rounded-2xl bg-[#F6FBF7] border border-emerald-200 space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm font-extrabold text-[#0D2E1B]">
                                {req.userName}
                              </div>
                              <div className="text-[11px] text-gray-600">
                                {req.userEmail} • {req.userPhone}
                              </div>
                              <div className="text-xs font-bold text-[#15803D] mt-0.5">
                                {req.paymentMethod} • {req.amount} • TID:{' '}
                                {req.transactionId}
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                                req.status === 'verified'
                                  ? 'bg-[#DCFCE7] text-[#14532D]'
                                  : req.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {req.status.toUpperCase()}
                            </span>
                          </div>

                          {req.receiptImageUrl && (
                            <div className="rounded-xl overflow-hidden border border-emerald-200 bg-white p-2">
                              <img
                                src={req.receiptImageUrl}
                                alt="Payment Receipt"
                                className="max-h-48 mx-auto object-contain rounded-lg"
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleAdminVerifyPayment(req, 'verified')
                              }
                              className="py-2 px-3 rounded-xl bg-[#15803D] text-white text-xs font-extrabold cursor-pointer"
                            >
                              ✓ Approve Paid Member
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleAdminVerifyPayment(req, 'rejected')
                              }
                              className="py-2 px-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-extrabold cursor-pointer"
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

              {/* TAB 3: TRAINING CERTIFICATES ISSUANCE & STORAGE */}
              {adminTab === 'certificates' && (
                <div className="space-y-4">
                  <form
                    onSubmit={handleIssueCertificate}
                    className="bg-white border border-emerald-200 rounded-[24px] p-5 shadow-xs space-y-3"
                  >
                    <h2 className="text-base font-extrabold text-[#0D2E1B]">
                      Issue &amp; Store Training Certificate
                    </h2>
                    <p className="text-xs text-gray-600">
                      Upload a scanned certificate image OR auto-generate a verifiable digital certificate for any student.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0D2E1B] mb-1">
                          Recipient Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newCertRecipientName}
                          onChange={(e) =>
                            setNewCertRecipientName(e.target.value)
                          }
                          placeholder="e.g. Muhammad Usman"
                          className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#0D2E1B] mb-1">
                          Recipient Email (Links to User Profile)
                        </label>
                        <input
                          type="email"
                          value={newCertRecipientEmail}
                          onChange={(e) =>
                            setNewCertRecipientEmail(e.target.value)
                          }
                          placeholder="student@email.com"
                          className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0D2E1B] mb-1">
                          Training Category
                        </label>
                        <select
                          value={newCertCategory}
                          onChange={(e) => {
                            const cat = e.target.value;
                            setNewCertCategory(cat);
                            if (cat === 'Highfield') {
                              setNewCertTitle(
                                'HACCP Level 3 — Food Safety & HACCP Plan Implementation'
                              );
                              setNewCertAccreditation('Highfield UK Accredited');
                            } else {
                              setNewCertTitle('ISO 22000 Lead Auditor (FSMS)');
                              setNewCertAccreditation('IRCA | CQI Certified');
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-bold"
                        >
                          <option value="Highfield">Highfield Trainings</option>
                          <option value="Lead Auditor">
                            Lead Auditor Trainings
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#0D2E1B] mb-1">
                          Accreditation Body
                        </label>
                        <input
                          type="text"
                          value={newCertAccreditation}
                          onChange={(e) =>
                            setNewCertAccreditation(e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0D2E1B] mb-1">
                        Training Course Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCertTitle}
                        onChange={(e) => setNewCertTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0D2E1B] mb-1">
                          Certificate Serial / ID
                        </label>
                        <input
                          type="text"
                          value={newCertNumber}
                          onChange={(e) => setNewCertNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#0D2E1B] mb-1">
                          Issue Date
                        </label>
                        <input
                          type="date"
                          value={newCertIssueDate}
                          onChange={(e) => setNewCertIssueDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                        />
                      </div>
                    </div>

                    {/* Optional Custom Certificate Image Upload */}
                    <div className="p-3 rounded-2xl bg-[#F2F7F3] border border-dashed border-[#16A34A] flex items-center justify-between gap-2">
                      <div className="text-xs">
                        <div className="font-extrabold text-[#0D2E1B]">
                          {newCertImageUrl
                            ? 'Custom Certificate Image Attached ✓'
                            : 'Optional: Upload Scanned Certificate Image'}
                        </div>
                        <div className="text-[10.5px] text-gray-500">
                          Leave empty to auto-generate Official Digital Certificate
                        </div>
                      </div>
                      <input
                        ref={certImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCertImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => certImageInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-[#15803D] text-white text-xs font-extrabold shrink-0 cursor-pointer"
                      >
                        Upload Scan
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-2xl bg-[#15803D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Issue &amp; Save Certificate to Cloud Storage</span>
                    </button>
                  </form>

                  <div className="bg-white border border-emerald-200 rounded-[24px] p-4 shadow-xs space-y-2.5">
                    <h3 className="text-sm font-extrabold text-[#0D2E1B]">
                      Stored Certificates ({certificates.length})
                    </h3>
                    {certificates.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-2xl bg-[#F6FBF7] border border-emerald-200 flex items-center justify-between gap-2"
                      >
                        <div
                          onClick={() => setSelectedCertificate(c)}
                          className="min-w-0 cursor-pointer flex-1"
                        >
                          <div className="text-xs font-extrabold text-[#0D2E1B] truncate">
                            {c.recipientName} — {c.certificateNumber}
                          </div>
                          <div className="text-[11px] text-gray-600 truncate">
                            {c.trainingTitle} • {c.issueDate}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedCertificate(c)}
                            className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#14532D] text-[11px] font-extrabold cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCertificate(c.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: JOBS & SCHOLARSHIPS CLOUD STORAGE */}
              {adminTab === 'opportunities' && (
                <form
                  onSubmit={handleAdminPublishOpportunity}
                  className="bg-white border border-emerald-200 rounded-[24px] p-5 shadow-xs space-y-3"
                >
                  <h2 className="text-base font-extrabold text-[#0D2E1B]">
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
                          ? 'bg-[#15803D] text-white border-[#15803D]'
                          : 'bg-[#F2F7F3] text-[#0D2E1B] border-emerald-200'
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
                          ? 'bg-[#15803D] text-white border-[#15803D]'
                          : 'bg-[#F2F7F3] text-[#0D2E1B] border-emerald-200'
                      }`}
                    >
                      + New Scholarship ({scholarships.length})
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    value={adminOppTitle}
                    onChange={(e) => setAdminOppTitle(e.target.value)}
                    placeholder={
                      adminOppType === 'job'
                        ? 'Job Title (e.g. QA/QC Executive)'
                        : 'Scholarship Title (e.g. MSc Food Science Fellowship)'
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                  />

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
                    className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={adminOppCountry}
                      onChange={(e) => setAdminOppCountry(e.target.value)}
                      placeholder="Country (e.g. Pakistan / UAE)"
                      className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
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
                      className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={adminOppEmail}
                      onChange={(e) => setAdminOppEmail(e.target.value)}
                      placeholder="Contact HR / Admissions Email"
                      className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={adminOppLink}
                      onChange={(e) => setAdminOppLink(e.target.value)}
                      placeholder="Official Apply Link (https://...)"
                      className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                    />
                  </div>

                  <textarea
                    rows={3}
                    value={adminOppDesc}
                    onChange={(e) => setAdminOppDesc(e.target.value)}
                    placeholder="Full description, eligibility, and application instructions..."
                    className="w-full px-3 py-2 rounded-xl bg-[#EAF3EC] text-xs font-semibold"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-2xl bg-[#15803D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Save &amp; Publish to Cloud Database
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* ==================== TRAINING CERTIFICATE PREVIEW & DOWNLOAD MODAL ==================== */}
        {selectedCertificate && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-[460px] bg-white rounded-[28px] p-5 shadow-2xl space-y-4 border-2 border-[#16A34A]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] text-[10.5px] font-extrabold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>
                      Verified Certificate • {selectedCertificate.certificateNumber}
                    </span>
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0D2E1B] mt-1">
                    {selectedCertificate.recipientName}
                  </h3>
                  <p className="text-xs font-semibold text-[#15803D]">
                    {selectedCertificate.trainingTitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCertificate(null)}
                  className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-emerald-200 bg-[#F0FDF4]">
                <img
                  src={
                    selectedCertificate.certificateImageUrl ||
                    generateCertificateSvgDataUrl({
                      certificateNumber: selectedCertificate.certificateNumber,
                      recipientName: selectedCertificate.recipientName,
                      trainingTitle: selectedCertificate.trainingTitle,
                      trainingCategory: selectedCertificate.trainingCategory,
                      accreditationBody: selectedCertificate.accreditationBody,
                      issueDate: selectedCertificate.issueDate
                    })
                  }
                  alt={selectedCertificate.trainingTitle}
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#F6FBF7] p-3 rounded-2xl border border-emerald-100">
                <div>
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">
                    Accreditation
                  </span>
                  <span className="font-extrabold text-[#0D2E1B]">
                    {selectedCertificate.accreditationBody}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">
                    Issue Date
                  </span>
                  <span className="font-extrabold text-[#0D2E1B]">
                    {selectedCertificate.issueDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={
                    selectedCertificate.certificateImageUrl ||
                    generateCertificateSvgDataUrl({
                      certificateNumber: selectedCertificate.certificateNumber,
                      recipientName: selectedCertificate.recipientName,
                      trainingTitle: selectedCertificate.trainingTitle,
                      trainingCategory: selectedCertificate.trainingCategory,
                      accreditationBody: selectedCertificate.accreditationBody,
                      issueDate: selectedCertificate.issueDate
                    })
                  }
                  download={`${selectedCertificate.certificateNumber}-${selectedCertificate.recipientName.replace(
                    /\s+/g,
                    '_'
                  )}.svg`}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#15803D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Certificate</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedCertificate(null)}
                  className="py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== HIRE / CONTACT MEMBER MODAL ==================== */}
        {contactModalMember && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] bg-white rounded-[28px] p-5 shadow-xl space-y-4 border border-emerald-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-extrabold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Specialist</span>
                  </span>
                  <h3 className="text-[20px] font-extrabold text-[#0D2E1B] mt-1">
                    Connect with {contactModalMember.name}
                  </h3>
                  {contactModalMember.privacySettings.qualification_public && (
                    <p className="text-xs text-gray-600 font-medium">
                      {contactModalMember.qualification}
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
                <label className="block text-xs font-bold text-[#0D2E1B]">
                  Hiring / Networking Message
                </label>
                <textarea
                  rows={3}
                  value={contactCustomMsg}
                  onChange={(e) => setContactCustomMsg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F2F7F3] border border-[#AECBB5] text-xs font-medium text-gray-900 focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              {contactSentBanner && (
                <div className="p-3 rounded-2xl bg-[#DCFCE7] text-[#0D2E1B] text-xs font-bold">
                  {contactSentBanner}
                </div>
              )}

              <div className="space-y-2">
                {(contactModalMember.linkedinUrl ||
                  contactModalMember.portfolioUrl) && (
                  <a
                    href={
                      contactModalMember.linkedinUrl ||
                      contactModalMember.portfolioUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-[#14532D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Connect via LinkedIn / Portfolio</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {contactModalMember.privacySettings?.phone_public &&
                  contactModalMember.phone && (
                    <a
                      href={`https://wa.me/${contactModalMember.phone.replace(
                        /[^0-9]/g,
                        ''
                      )}?text=${encodeURIComponent(contactCustomMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl bg-[#15803D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Hire / Chat on WhatsApp</span>
                    </a>
                  )}

                {contactModalMember.privacySettings?.email_public &&
                  contactModalMember.email && (
                    <a
                      href={`mailto:${
                        contactModalMember.email
                      }?subject=${encodeURIComponent(
                        'Hiring / Networking Inquiry via Food Specialists Hub'
                      )}&body=${encodeURIComponent(contactCustomMsg)}`}
                      className="w-full py-3 px-4 rounded-2xl bg-[#EAF3EC] hover:bg-[#D5EAD8] text-[#0D2E1B] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#15803D]" />
                      <span>Send Direct Email ({contactModalMember.email})</span>
                    </a>
                  )}

                {!contactModalMember.linkedinUrl &&
                  !contactModalMember.portfolioUrl &&
                  !(
                    contactModalMember.privacySettings?.phone_public &&
                    contactModalMember.phone
                  ) &&
                  !(
                    contactModalMember.privacySettings?.email_public &&
                    contactModalMember.email
                  ) && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold text-center">
                      This specialist has set their direct phone and email to Private.
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* 4-TAB BOTTOM NAVIGATION BAR (Home, Communities, Trainings, Profile) */}
        <BottomNav
          activeTab={activeBottomTab}
          onSelectTab={handleSelectBottomTab}
        />
      </div>
    </div>
  );
}
