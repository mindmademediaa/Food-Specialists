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
  Trash2,
  LogIn,
  LogOut,
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
  UserPlus
} from 'lucide-react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import {
  db,
  OperationType,
  handleFirestoreError
} from './lib/firebase';
import {
  HubUser,
  HubJob,
  HubScholarship,
  HubTraining,
  HubPaymentRequest,
  HubChatMessage,
  JobCategory,
  NavTab
} from './types/hub';
import {
  INITIAL_USERS,
  INITIAL_JOBS,
  INITIAL_SCHOLARSHIPS,
  INITIAL_TRAININGS,
  INITIAL_PAYMENT_REQUESTS,
  INITIAL_CHATS,
  makeAvatarSvg
} from './data/mockHubData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { JobCard } from './components/JobCard';
import { MemberCard } from './components/MemberCard';

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
  company: '',
  location: 'Lahore, Pakistan',
  email: 'alex.morgan@email.com',
  phone: '+92 300 1234567',
  skills: [],
  cvUrl: '',
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

export default function App() {
  // Navigation & Route Stack
  const [route, setRoute] = useState<RouteView>({ name: 'home' });

  // Collections State (Synced with Firestore Backend)
  const [users, setUsers] = useState<HubUser[]>(INITIAL_USERS);
  const [paymentRequests, setPaymentRequests] = useState<HubPaymentRequest[]>(
    INITIAL_PAYMENT_REQUESTS
  );
  const [chats, setChats] = useState<HubChatMessage[]>(INITIAL_CHATS);
  const [jobs, setJobs] = useState<HubJob[]>(INITIAL_JOBS);
  const [scholarships, setScholarships] = useState<HubScholarship[]>(
    INITIAL_SCHOLARSHIPS
  );
  const [trainings, setTrainings] = useState<HubTraining[]>(INITIAL_TRAININGS);

  // Applied Jobs & Saved Scholarships Tracking
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>([]);

  // Current User Profile (Starts as Free Member until Admin verifies payment in Part 2)
  const [myProfile, setMyProfile] = useState<HubUser>(
    DEFAULT_CURRENT_USER_PROFILE
  );
  const [profileSaveMsg, setProfileSaveMsg] = useState<string | null>(null);

  // Payment Verification Request Form State (on /profile)
  const [payMethod, setPayMethod] = useState<
    'EasyPaisa' | 'JazzCash' | 'Bank Transfer'
  >('EasyPaisa');
  const [payTxId, setPayTxId] = useState<string>('');
  const [payAmount, setPayAmount] = useState<string>('PKR 1,500');
  const [payNotes, setPayNotes] = useState<string>(
    'Paid membership fee submitted. Please verify payment and approve my profile for Communities.'
  );
  const [paySubmitBanner, setPaySubmitBanner] = useState<string | null>(null);

  // User-to-Admin Support Chat Box State
  const [supportChatInput, setSupportChatInput] = useState<string>('');
  const [supportChatSentMsg, setSupportChatSentMsg] = useState<string | null>(
    null
  );

  // Hire / Contact Modal State for Communities
  const [contactModalMember, setContactModalMember] = useState<HubUser | null>(
    null
  );
  const [contactCustomMsg, setContactCustomMsg] = useState<string>(
    'Assalam-o-Alaikum, I saw your profile on Food Specialists Hub and would like to connect regarding a Food Science / QA role.'
  );
  const [contactSentBanner, setContactSentBanner] = useState<string | null>(
    null
  );

  // Filters for /jobs
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>('All');
  const [jobLocationFilter, setJobLocationFilter] = useState<string>('All');
  const [jobExpFilter, setJobExpFilter] = useState<string>('All');

  // Filters for /scholarships
  const [schFundingFilter, setSchFundingFilter] = useState<string>('All');
  const [schCountryFilter, setSchCountryFilter] = useState<string>('All');
  const [schDegreeFilter, setSchDegreeFilter] = useState<string>('All');

  // State for /search
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [searchTab, setSearchTab] = useState<
    'All' | 'Jobs' | 'Scholarships' | 'Trainings' | 'Members'
  >('All');

  // State for /communities
  const [memberSearchQuery, setMemberSearchQuery] = useState<string>('');
  const [onlyHireableFilter, setOnlyHireableFilter] = useState<boolean>(false);

  // File upload refs for /profile
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  // Admin Panel (Part 2 Backend) State
  const [adminTab, setAdminTab] = useState<
    'requests' | 'chats' | 'users' | 'jobs' | 'scholarships' | 'trainings'
  >('requests');
  const [adminStatusMsg, setAdminStatusMsg] = useState<string | null>(null);

  // Real-time Firestore Listeners for Backend Collections
  useEffect(() => {
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        if (!snap.empty) {
          const fsUsers = snap.docs.map((d) => d.data() as HubUser);
          setUsers(() => {
            const map = new Map<string, HubUser>();
            INITIAL_USERS.forEach((u) => map.set(u.uid, u));
            fsUsers.forEach((u) => map.set(u.uid, u));
            return Array.from(map.values());
          });
          const matchedMe = fsUsers.find((u) => u.uid === myProfile.uid);
          if (matchedMe) {
            setMyProfile(matchedMe);
          }
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'users');
        } catch {}
      }
    );

    const unsubRequests = onSnapshot(
      collection(db, 'paymentRequests'),
      (snap) => {
        if (!snap.empty) {
          const fsReqs = snap.docs.map((d) => d.data() as HubPaymentRequest);
          setPaymentRequests(() => {
            const map = new Map<string, HubPaymentRequest>();
            INITIAL_PAYMENT_REQUESTS.forEach((r) => map.set(r.id, r));
            fsReqs.forEach((r) => map.set(r.id, r));
            return Array.from(map.values());
          });
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'paymentRequests');
        } catch {}
      }
    );

    const unsubChats = onSnapshot(
      collection(db, 'chats'),
      (snap) => {
        if (!snap.empty) {
          const fsChats = snap.docs.map((d) => d.data() as HubChatMessage);
          setChats(() => {
            const map = new Map<string, HubChatMessage>();
            INITIAL_CHATS.forEach((c) => map.set(c.id, c));
            fsChats.forEach((c) => map.set(c.id, c));
            return Array.from(map.values());
          });
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'chats');
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
            fsJobs.forEach((j) => map.set(j.id, j));
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
            fsSch.forEach((s) => map.set(s.id, s));
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

    return () => {
      unsubUsers();
      unsubRequests();
      unsubChats();
      unsubJobs();
      unsubSch();
      unsubTr();
    };
  }, [myProfile.uid]);

  // Determine active BottomNav tab from current route (4 tabs: home, communities, trainings, profile)
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

  const handleToggleApplied = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAppliedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const handleToggleSavedScholarship = (schId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedScholarshipIds((prev) =>
      prev.includes(schId) ? prev.filter((id) => id !== schId) : [...prev, schId]
    );
  };

  // Is Current User a Verified Paid Member?
  const isCurrentUserPaid = Boolean(myProfile.isPaid);

  // Filtered Jobs for /jobs
  const activeJobs = useMemo(() => jobs.filter((j) => j.isActive), [jobs]);
  const filteredJobs = useMemo(() => {
    return activeJobs.filter((j) => {
      if (jobCategoryFilter !== 'All' && j.category !== jobCategoryFilter) {
        return false;
      }
      if (
        jobLocationFilter !== 'All' &&
        !j.location.toLowerCase().includes(jobLocationFilter.toLowerCase())
      ) {
        return false;
      }
      if (
        jobExpFilter !== 'All' &&
        !j.experienceRequired.toLowerCase().includes(jobExpFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [activeJobs, jobCategoryFilter, jobLocationFilter, jobExpFilter]);

  // Free users see ONLY 1 Job per day; Paid members see all jobs
  const visibleJobs = useMemo(() => {
    return isCurrentUserPaid ? filteredJobs : filteredJobs.slice(0, 1);
  }, [filteredJobs, isCurrentUserPaid]);

  // Filtered Scholarships for /scholarships
  const activeScholarships = useMemo(
    () => scholarships.filter((s) => s.isActive),
    [scholarships]
  );
  const filteredScholarships = useMemo(() => {
    return activeScholarships.filter((s) => {
      if (schFundingFilter !== 'All' && s.fundingType !== schFundingFilter) {
        return false;
      }
      if (
        schCountryFilter !== 'All' &&
        !s.country.toLowerCase().includes(schCountryFilter.toLowerCase())
      ) {
        return false;
      }
      if (
        schDegreeFilter !== 'All' &&
        !s.degreeLevel.toLowerCase().includes(schDegreeFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [activeScholarships, schFundingFilter, schCountryFilter, schDegreeFilter]);

  // Free users see ONLY 1 Scholarship per day; Paid members see all scholarships
  const visibleScholarships = useMemo(() => {
    return isCurrentUserPaid
      ? filteredScholarships
      : filteredScholarships.slice(0, 1);
  }, [filteredScholarships, isCurrentUserPaid]);

  // Filtered Members for /communities:
  // ONLY Paid Members (`u.isPaid === true`) verified by Admin are shown in Communities!
  const paidCommunityMembers = useMemo(
    () => users.filter((u) => u.isPaid === true && u.uid && u.name),
    [users]
  );

  const filteredMembers = useMemo(() => {
    return paidCommunityMembers.filter((u) => {
      if (onlyHireableFilter && !u.privacySettings?.hireMe_public) {
        return false;
      }
      if (!memberSearchQuery.trim()) return true;
      const q = memberSearchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
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
      return matchName || matchRole || matchLoc || matchQual;
    });
  }, [paidCommunityMembers, memberSearchQuery, onlyHireableFilter]);

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
    const matchedMembers = paidCommunityMembers.filter(
      (u) =>
        !q ||
        u.name.toLowerCase().includes(q) ||
        (u.privacySettings?.currentRole_public &&
          u.currentRole.toLowerCase().includes(q))
    );
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
    paidCommunityMembers
  ]);

  // Profile Save Handler — Saves user record to Backend `users` collection.
  // IMPORTANT: Saving profile does NOT automatically add user to Communities unless Admin verifies payment!
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUid =
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
      createdAt:
        myProfile.createdAt || new Date().toISOString().slice(0, 19) + 'Z'
    };

    setMyProfile(updatedUser);
    setUsers((prev) => {
      const exists = prev.some((u) => u.uid === updatedUser.uid);
      if (exists) {
        return prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u));
      }
      return [updatedUser, ...prev];
    });

    try {
      await setDoc(doc(db, 'users', updatedUser.uid), updatedUser, {
        merge: true
      });
    } catch {}

    setProfileSaveMsg(
      updatedUser.isPaid
        ? 'Profile saved! Since your payment is verified by Admin, your permitted details are live in Communities.'
        : 'Profile saved to Backend Free User Record! To appear in Communities, submit your Payment Request below for Admin verification.'
    );
    setTimeout(() => setProfileSaveMsg(null), 5000);
  };

  // Submit Paid Membership & Payment Verification Request to Admin Backend (Part 2)
  const handleSubmitPaymentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTxId.trim()) return;

    const cleanUid = myProfile.uid || 'user-alex-morgan';
    const reqId = 'req-' + Date.now();
    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

    const newReq: HubPaymentRequest = {
      id: reqId,
      uid: cleanUid,
      userName: myProfile.name || 'Alex Morgan',
      userEmail: myProfile.email || 'alex.morgan@email.com',
      userPhone: myProfile.phone || '+92 300 1234567',
      qualification: myProfile.qualification,
      currentRole: myProfile.currentRole,
      paymentMethod: payMethod,
      transactionId: payTxId.trim(),
      amount: payAmount.trim() || 'PKR 1,500',
      notes: payNotes.trim(),
      status: 'pending',
      submittedAt: nowStr
    };

    const updatedUser: HubUser = {
      ...myProfile,
      uid: cleanUid,
      isPaid: false, // Remains false until Admin verifies in Part 2!
      paymentStatus: 'pending',
      paymentMethod: payMethod,
      paymentReference: payTxId.trim(),
      paymentAmount: payAmount.trim() || 'PKR 1,500'
    };

    setMyProfile(updatedUser);
    setUsers((prev) => {
      const exists = prev.some((u) => u.uid === updatedUser.uid);
      return exists
        ? prev.map((u) => (u.uid === updatedUser.uid ? updatedUser : u))
        : [updatedUser, ...prev];
    });
    setPaymentRequests((prev) => [newReq, ...prev]);

    try {
      await setDoc(doc(db, 'users', updatedUser.uid), updatedUser, {
        merge: true
      });
      await setDoc(doc(db, 'paymentRequests', newReq.id), newReq, {
        merge: true
      });
    } catch {}

    setPayTxId('');
    setPaySubmitBanner(
      'Payment verification request sent to Admin Backend Control Panel! Once Admin verifies your payment, your Paid Access & Communities listing will be activated.'
    );
    setTimeout(() => setPaySubmitBanner(null), 6000);
  };

  // Send Support Chat Message to Admin Backend
  const handleSendSupportChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportChatInput.trim()) return;

    const chatMsg: HubChatMessage = {
      id: 'chat-' + Date.now(),
      senderUid: myProfile.uid || 'user-alex-morgan',
      senderName: myProfile.name || 'Alex Morgan',
      senderPhone: myProfile.phone || '+92 300 1234567',
      recipientName: 'Admin Support (Muneeb Khan)',
      chatType: 'admin_support',
      message: supportChatInput.trim(),
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setChats((prev) => [chatMsg, ...prev]);
    setSupportChatInput('');
    setSupportChatSentMsg(
      'Message sent to Admin Backend! Check Part 2 (Admin Panel -> Chats) for replies.'
    );
    setTimeout(() => setSupportChatSentMsg(null), 4000);

    try {
      await setDoc(doc(db, 'chats', chatMsg.id), chatMsg, { merge: true });
    } catch {}
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMyProfile((prev) => ({
          ...prev,
          profilePicUrl: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMyProfile((prev) => ({ ...prev, cvUrl: file.name }));
  };

  const firstName = useMemo(() => {
    if (!myProfile.name) return 'Alex';
    return myProfile.name.split(' ')[0].replace(/,/g, '') || 'Alex';
  }, [myProfile.name]);

  const userInitial = firstName.charAt(0).toUpperCase() || 'A';

  const pendingReqCount = useMemo(
    () => paymentRequests.filter((r) => r.status === 'pending').length,
    [paymentRequests]
  );

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-gray-900 flex flex-col items-center justify-start py-0 sm:py-6 px-0 sm:px-4">
      {/* Mobile-First App Container — NO extra empty white space at bottom */}
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
              else setRoute({ name: 'home' });
            }}
            onHomeClick={() => setRoute({ name: 'home' })}
            onSearchClick={() => setRoute({ name: 'search' })}
            onBellClick={() => navigateToJobs('All')}
            onProfileClick={() => setRoute({ name: 'profile' })}
            isAdmin={false}
            userInitial={userInitial}
          />

          {/* ==================== 1. HOME SCREEN (/) — TIGHT FIT WITHOUT EXTRA WHITE SCREEN ==================== */}
          {route.name === 'home' && (
            <div className="space-y-4 px-1">
              {/* Greeting + Subtitle + Stats Pills */}
              <div className="space-y-1.5 pt-1">
                <h1 className="text-[28px] sm:text-[30px] font-bold text-[#0D2E1B] tracking-tight leading-tight">
                  Good morning, {firstName}
                </h1>
                <p className="text-[15px] text-gray-500 font-medium">
                  Food Science • Food Technology specialists
                </p>

                {/* Stats Pills: "12 new jobs" and "5 scholarships open" */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => navigateToJobs('All')}
                    className="px-3.5 py-1.5 rounded-full bg-[#C8E4CA] hover:bg-[#B8DBBA] text-[#0D2E1B] text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Wheat className="w-4 h-4 text-[#14532D]" />
                    <span className="tabular-nums">{activeJobs.length} new jobs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateToScholarships('All')}
                    className="px-3.5 py-1.5 rounded-full bg-[#DCEBDD] hover:bg-[#CCE2CE] text-[#0D2E1B] text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-[#14532D]" />
                    <span className="tabular-nums">
                      {activeScholarships.length} scholarships open
                    </span>
                  </button>
                </div>
              </div>

              {/* CARD 1 - JOBS */}
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
                className="relative bg-white border-[1.5px] border-[#78AF88] hover:border-[#16A34A] rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
              >
                <LeafWatermark className="w-8 h-8 absolute left-5 top-[108px] opacity-65 pointer-events-none" />
                <AppleWatermark className="w-8 h-8 absolute right-6 top-[110px] opacity-55 pointer-events-none" />
                <TestTubeWatermark className="w-9 h-9 absolute right-14 bottom-3.5 opacity-75 pointer-events-none" />
                <WheatWatermark className="w-9 h-9 absolute right-4 bottom-3.5 opacity-75 pointer-events-none" />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-[74px] h-[74px] rounded-full bg-gradient-to-br from-[#D0ECDA] to-[#EAF6EE] flex items-center justify-center shrink-0">
                      <DuotoneBriefcaseIcon />
                    </div>
                    <div className="pt-1">
                      <h2 className="text-[28px] font-bold text-[#0D2E1B] leading-none tracking-tight">
                        Jobs
                      </h2>
                      <p className="text-[14.5px] text-[#2F4737] mt-2 leading-snug max-w-[210px]">
                        Find roles in food R&amp;D, QA, production &amp; more
                      </p>
                    </div>
                  </div>

                  <span className="w-10 h-10 rounded-full border-2 border-[#16A34A] text-[#16A34A] flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 stroke-[2.4]" />
                  </span>
                </div>

                {/* Middle row 3 icons: Production, R&D Lab, Quality & Safety */}
                <div className="grid grid-cols-3 gap-2 mt-6 mb-5 px-2 relative z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToJobs('Production');
                    }}
                    className="flex flex-col items-center gap-1.5 py-1.5 rounded-xl hover:bg-[#F0FDF4] transition-colors cursor-pointer"
                  >
                    <Wheat className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737]">
                      Production
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToJobs('R&D Lab');
                    }}
                    className="flex flex-col items-center gap-1.5 py-1.5 rounded-xl hover:bg-[#F0FDF4] transition-colors cursor-pointer"
                  >
                    <FlaskConical className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737]">
                      R&amp;D Lab
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToJobs('Quality & Safety');
                    }}
                    className="flex flex-col items-center gap-1.5 py-1.5 rounded-xl hover:bg-[#F0FDF4] transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737] whitespace-nowrap">
                      Quality &amp; Safety
                    </span>
                  </button>
                </div>

                {/* Bottom pill "Apply now • 12 openings" */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C6E4C9] text-[#0D2E1B] text-[13px] font-semibold">
                    <span className="text-[#16A34A] font-bold">●</span>
                    <span>Apply now</span>
                    <span className="text-[#16A34A]">•</span>
                    <span className="tabular-nums">{activeJobs.length} openings</span>
                  </div>
                </div>
              </div>

              {/* CARD 2 - SCHOLARSHIPS */}
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
                className="relative bg-white border-[1.5px] border-[#78AF88] hover:border-[#16A34A] rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
              >
                <LeafWatermark className="w-8 h-8 absolute left-5 top-[112px] opacity-65 pointer-events-none" />
                <TestTubeWatermark className="w-8 h-8 absolute right-5 top-[106px] opacity-45 pointer-events-none" />
                <WheatWatermark className="w-9 h-9 absolute right-14 bottom-3.5 opacity-75 pointer-events-none" />
                <AppleWatermark className="w-8 h-8 absolute right-4 bottom-3.5 opacity-75 pointer-events-none" />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-[74px] h-[74px] rounded-full bg-gradient-to-br from-[#D0ECDA] to-[#EAF6EE] flex items-center justify-center shrink-0">
                      <DuotoneGradCapIcon />
                    </div>
                    <div className="pt-1">
                      <h2 className="text-[28px] font-bold text-[#0D2E1B] leading-none tracking-tight">
                        Scholarships
                      </h2>
                      <p className="text-[14.5px] text-[#2F4737] mt-2 leading-snug max-w-[215px]">
                        Grants, fellowships &amp; programs for food tech
                      </p>
                    </div>
                  </div>

                  <span className="w-10 h-10 rounded-full border-2 border-[#16A34A] text-[#16A34A] flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 stroke-[2.4]" />
                  </span>
                </div>

                {/* Middle row 3 icons: Fellowships, International, Grants */}
                <div className="grid grid-cols-3 gap-2 mt-6 mb-5 px-2 relative z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToScholarships('Fellowships');
                    }}
                    className="flex flex-col items-center gap-1.5 py-1.5 rounded-xl hover:bg-[#F0FDF4] transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737]">
                      Fellowships
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToScholarships('International');
                    }}
                    className="flex flex-col items-center gap-1.5 py-1.5 rounded-xl hover:bg-[#F0FDF4] transition-colors cursor-pointer"
                  >
                    <Globe className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737]">
                      International
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToScholarships('Grants');
                    }}
                    className="flex flex-col items-center gap-1.5 py-1.5 rounded-xl hover:bg-[#F0FDF4] transition-colors cursor-pointer"
                  >
                    <Trophy className="w-6 h-6 text-[#143622] stroke-[2]" />
                    <span className="text-[12.5px] font-medium text-[#2F4737]">
                      Grants
                    </span>
                  </button>
                </div>

                {/* Bottom pill "Apply now • 5 available" */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C6E4C9] text-[#0D2E1B] text-[13px] font-semibold">
                    <span className="text-[#16A34A] font-bold">●</span>
                    <span>Apply now</span>
                    <span className="text-[#16A34A]">•</span>
                    <span className="tabular-nums">{activeScholarships.length} available</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. JOBS PAGE (/jobs) ==================== */}
          {route.name === 'jobs' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between pt-1">
                <h1 className="text-[28px] font-extrabold text-[#0B3B1E] tracking-tight">
                  Jobs for you
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setJobLocationFilter('All');
                    setJobExpFilter('All');
                    setJobCategoryFilter('All');
                  }}
                  className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#15803D] hover:text-[#0B3B1E] transition-colors cursor-pointer"
                >
                  <ListFilter className="w-5 h-5 stroke-[2.5]" />
                  <span>Filters</span>
                </button>
              </div>

              {/* 3 Pill Filter Dropdowns */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="relative">
                  <select
                    value={jobLocationFilter}
                    onChange={(e) => setJobLocationFilter(e.target.value)}
                    aria-label="Filter by Location"
                    className="w-full appearance-none pl-3.5 pr-7 py-2.5 rounded-[18px] bg-[#15803D] text-white text-[13.5px] font-bold shadow-xs focus:outline-none cursor-pointer truncate"
                  >
                    <option value="All">Location</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Sahiwal">Sahiwal</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Riyadh">Riyadh</option>
                    <option value="Doha">Doha</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-white stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={jobExpFilter}
                    onChange={(e) => setJobExpFilter(e.target.value)}
                    aria-label="Filter by Experience"
                    className={`w-full appearance-none pl-3.5 pr-7 py-2.5 rounded-[18px] text-[13.5px] font-bold border-[2px] border-[#16A34A] focus:outline-none cursor-pointer truncate ${
                      jobExpFilter !== 'All'
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white text-[#15803D]'
                    }`}
                  >
                    <option value="All">Experience</option>
                    <option value="1">1–3 Years</option>
                    <option value="2">2–4 Years</option>
                    <option value="3">3–5 Years</option>
                    <option value="4">4+ Years</option>
                    <option value="5">5+ Years</option>
                  </select>
                  <ChevronDown
                    className={`w-4 h-4 stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      jobExpFilter !== 'All' ? 'text-white' : 'text-[#15803D]'
                    }`}
                  />
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
                    <option value="All">Category</option>
                    <option value="Quality & Safety">Quality &amp; Safety</option>
                    <option value="R&D Lab">R&amp;D Lab</option>
                    <option value="Production">Production</option>
                  </select>
                  <ChevronDown
                    className={`w-4 h-4 stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      jobCategoryFilter !== 'All' ? 'text-white' : 'text-[#15803D]'
                    }`}
                  />
                </div>
              </div>

              {/* Jobs Card List (1 Job for Free Users, All Jobs for Paid Members) */}
              <div className="space-y-4 pt-1">
                {visibleJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isApplied={appliedJobIds.includes(job.id)}
                    onToggleApplied={handleToggleApplied}
                    onClick={(j) => {
                      setRoute({ name: 'job-detail', jobId: j.id });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))}

                {/* Free User Daily Limit Banner (when !isCurrentUserPaid) */}
                {!isCurrentUserPaid && filteredJobs.length > 1 && (
                  <div className="bg-white border-2 border-[#16A34A] rounded-[26px] p-5 shadow-sm text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#DCF2E3] text-[#15803D] flex items-center justify-center mx-auto">
                      <Crown className="w-6 h-6" />
                    </div>
                    <h3 className="text-[18px] font-extrabold text-[#0B3B1E]">
                      Free Tier Limit: 1 Job Per Day
                    </h3>
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      Free members can view <strong>1 Job &amp; 1 Scholarship daily</strong>.
                      Upgrade to <strong>Paid Member</strong> to unlock all{' '}
                      {filteredJobs.length} daily jobs, all scholarships, and list your
                      profile in the Communities Directory for hiring!
                    </p>
                    <button
                      type="button"
                      onClick={() => setRoute({ name: 'profile' })}
                      className="w-full py-3.5 px-5 rounded-[18px] bg-[#15803D] hover:bg-[#0D2E1B] text-white font-extrabold text-sm shadow-sm transition-colors cursor-pointer"
                    >
                      Go to Profile →
                    </button>
                  </div>
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
              return (
                <div className="bg-white border border-emerald-200 rounded-[26px] p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-emerald-100 pb-4">
                    <div className="space-y-1">
                      <span className="inline-block px-3 py-1 rounded-[10px] bg-[#BCE3C5] text-[#0B3B1E] text-xs font-bold">
                        {job.category}
                      </span>
                      <h1 className="text-[22px] font-extrabold text-[#0B3B1E] leading-snug pt-1">
                        {job.title}
                      </h1>
                      <p className="text-sm font-semibold text-gray-600">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#F0FDF4]">
                      <div className="text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>Location</span>
                      </div>
                      <div className="font-bold text-gray-900 mt-0.5">
                        {job.location}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F0FDF4]">
                      <div className="text-gray-500 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>Experience</span>
                      </div>
                      <div className="font-bold text-gray-900 mt-0.5">
                        {job.experienceRequired}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-[10px] bg-[#BCE3C5] text-[#0B3B1E] text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Job Description
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Requirements &amp; Qualifications
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.requirements}
                    </p>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center justify-between pt-2 border-t border-emerald-100">
                    <span>Posted: {job.postedAt}</span>
                    <span>Expires: {job.expiryAt}</span>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (!appliedJobIds.includes(job.id)) {
                          handleToggleApplied(job.id);
                        }
                      }}
                      className="w-full py-3.5 px-5 rounded-2xl bg-[#15803D] hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleToggleApplied(job.id)}
                      className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                        isApplied
                          ? 'bg-[#DCF2E3] border-[#16A34A] text-[#0B3B1E]'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isApplied ? 'Marked as Applied ✓' : 'Mark as Applied'}</span>
                    </button>
                  </div>
                </div>
              );
            })()}

          {/* ==================== 3. SCHOLARSHIPS PAGE (/scholarships) ==================== */}
          {route.name === 'scholarships' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between pt-1">
                <h1 className="text-[26px] sm:text-[28px] font-extrabold text-[#0B3B1E] tracking-tight">
                  Scholarships for you
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setSchCountryFilter('All');
                    setSchDegreeFilter('All');
                    setSchFundingFilter('All');
                  }}
                  className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#15803D] hover:text-[#0B3B1E] transition-colors cursor-pointer shrink-0"
                >
                  <ListFilter className="w-5 h-5 stroke-[2.5]" />
                  <span>Filters</span>
                </button>
              </div>

              {/* 3 Pill Filter Dropdowns */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="relative">
                  <select
                    value={schCountryFilter}
                    onChange={(e) => setSchCountryFilter(e.target.value)}
                    aria-label="Filter by Country"
                    className="w-full appearance-none pl-3.5 pr-7 py-2.5 rounded-[18px] bg-[#15803D] text-white text-[13.5px] font-bold shadow-xs focus:outline-none cursor-pointer truncate"
                  >
                    <option value="All">Country</option>
                    <option value="Belgium">Europe (EU)</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="United States">USA</option>
                    <option value="United Kingdom">UK</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-white stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={schDegreeFilter}
                    onChange={(e) => setSchDegreeFilter(e.target.value)}
                    aria-label="Filter by Degree"
                    className={`w-full appearance-none pl-3.5 pr-7 py-2.5 rounded-[18px] text-[13.5px] font-bold border-[2px] border-[#16A34A] focus:outline-none cursor-pointer truncate ${
                      schDegreeFilter !== 'All'
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white text-[#15803D]'
                    }`}
                  >
                    <option value="All">Degree</option>
                    <option value="BS">BS / Undergrad</option>
                    <option value="MS">MS / MSc</option>
                    <option value="PhD">PhD / Doctoral</option>
                    <option value="Fellowship">Fellowship</option>
                  </select>
                  <ChevronDown
                    className={`w-4 h-4 stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      schDegreeFilter !== 'All' ? 'text-white' : 'text-[#15803D]'
                    }`}
                  />
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
                    <option value="All">Funding</option>
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

              {/* Scholarships Card List (1 Scholarship for Free Users, All for Paid Members) */}
              <div className="space-y-4 pt-1">
                {visibleScholarships.map((sch) => {
                  const daysLeft = getDaysRemaining(sch.deadline);
                  const isSaved = savedScholarshipIds.includes(sch.id);
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

                          <div className="flex items-center justify-between gap-2 mt-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-3 py-1 rounded-[10px] bg-[#BCE3C5] text-[#0B3B1E] text-[12px] font-semibold leading-none">
                                {sch.fundingType}
                              </span>
                              <span className="px-3 py-1 rounded-[10px] bg-[#BCE3C5] text-[#0B3B1E] text-[12px] font-semibold leading-none">
                                {sch.degreeLevel}
                              </span>
                              <span className="px-3 py-1 rounded-[10px] bg-[#D8ECD9] text-[#0B3B1E] text-[12px] font-semibold leading-none">
                                Fully Funded
                              </span>
                            </div>

                            <button
                              type="button"
                              title={isSaved ? 'Saved Scholarship' : 'Save Scholarship'}
                              onClick={(e) => handleToggleSavedScholarship(sch.id, e)}
                              className="p-1.5 rounded-xl text-[#15803D] hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer"
                            >
                              <Bookmark
                                className={`w-6 h-6 stroke-[2.2] ${
                                  isSaved
                                    ? 'fill-[#15803D] text-[#15803D]'
                                    : 'text-[#15803D]'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-end mt-2.5">
                            <span className="text-[12.5px] font-semibold text-[#15803D] tabular-nums">
                              Deadline {sch.deadline} • {daysLeft}d left
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Free User Daily Limit Banner (when !isCurrentUserPaid) */}
                {!isCurrentUserPaid && filteredScholarships.length > 1 && (
                  <div className="bg-white border-2 border-[#16A34A] rounded-[26px] p-5 shadow-sm text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#DCF2E3] text-[#15803D] flex items-center justify-center mx-auto">
                      <Crown className="w-6 h-6" />
                    </div>
                    <h3 className="text-[18px] font-extrabold text-[#0B3B1E]">
                      Free Tier Limit: 1 Scholarship Per Day
                    </h3>
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      Free members can view <strong>1 Scholarship &amp; 1 Job daily</strong>.
                      Upgrade to <strong>Paid Member</strong> to unlock all{' '}
                      {filteredScholarships.length} scholarships, all daily jobs, and display
                      your profile in Communities!
                    </p>
                    <button
                      type="button"
                      onClick={() => setRoute({ name: 'profile' })}
                      className="w-full py-3.5 px-5 rounded-[18px] bg-[#15803D] hover:bg-[#0D2E1B] text-white font-extrabold text-sm shadow-sm transition-colors cursor-pointer"
                    >
                      Go to Profile →
                    </button>
                  </div>
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
              return (
                <div className="bg-white border border-emerald-200 rounded-[26px] p-5 shadow-sm space-y-4">
                  <div className="border-b border-emerald-100 pb-4 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-3 py-1 rounded-[10px] bg-[#BCE3C5] text-[#0B3B1E] text-xs font-bold">
                        {sch.fundingType}
                      </span>
                      <span className="px-3 py-1 rounded-[10px] bg-[#D8ECD9] text-[#0B3B1E] text-xs font-semibold">
                        {sch.degreeLevel}
                      </span>
                    </div>
                    <h1 className="text-[22px] font-extrabold text-[#0B3B1E] leading-snug pt-1">
                      {sch.title}
                    </h1>
                    <p className="text-sm font-semibold text-gray-600">
                      {sch.organization}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#F0FDF4]">
                      <div className="text-gray-500">Host Country</div>
                      <div className="font-bold text-gray-900 mt-0.5">{sch.country}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#DCF2E3] border border-emerald-200">
                      <div className="text-[#14532D]">Deadline Countdown</div>
                      <div className="font-bold text-[#0B3B1E] mt-0.5 tabular-nums">
                        {sch.deadline} ({daysLeft}d left)
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Scholarship &amp; Stipend Coverage
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {sch.description}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Eligibility Criteria
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {sch.eligibility}
                    </p>
                  </div>

                  <a
                    href={sch.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#15803D] hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Apply on Official Scholarship Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
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
                  placeholder="Search jobs, scholarships, trainings, members..."
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
                          onToggleApplied={handleToggleApplied}
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

                {(searchTab === 'All' || searchTab === 'Members') &&
                  searchResults.members.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#14532D] px-1">
                        Paid Community Members ({searchResults.members.length})
                      </h2>
                      {searchResults.members.map((m) => (
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
                      ))}
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* ==================== 5. COMMUNITIES PAGE (/communities) ==================== */}
          {route.name === 'communities' && (
            <div className="space-y-4 px-1">
              {/* Top Rounded White Directory Header Card */}
              <div className="bg-white border border-[#C6DFCB] rounded-[28px] p-5 shadow-[0_6px_20px_rgba(22,163,74,0.06)] space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h1 className="text-[26px] font-extrabold text-[#0D2E1B] leading-tight tracking-tight">
                      Members Directory
                    </h1>
                    <p className="text-[13px] text-gray-600 font-medium mt-0.5">
                      {paidCommunityMembers.length} verified paid members • Direct add disabled (Admin payment verification required)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRoute({ name: 'profile' })}
                    className="px-3 py-1.5 rounded-full bg-[#DCF2E3] hover:bg-[#C6E8D1] text-[#0D2E1B] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>My Profile</span>
                  </button>
                </div>

                {/* Search Input + Right "Hire Me" Filter Toggle */}
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-[#0D2E1B] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      placeholder="Search members by name, education, role..."
                      className="w-full pl-11 pr-8 py-3 text-[14px] bg-[#F2F7F3] border border-[#AECBB5] rounded-[20px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#16A34A] focus:bg-white transition-colors"
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
                    title="Filter Open to Hire (Hire Me)"
                    onClick={() => setOnlyHireableFilter((prev) => !prev)}
                    className={`px-3.5 h-12 rounded-[18px] border text-xs font-extrabold flex items-center justify-center gap-1 shrink-0 transition-colors cursor-pointer ${
                      onlyHireableFilter
                        ? 'bg-[#15803D] border-[#15803D] text-white'
                        : 'bg-[#C5DFC9] border-[#9BBFA1] text-[#0D2E1B] hover:bg-[#B4D5B9]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Hire Me</span>
                  </button>
                </div>
              </div>

              {/* FREE USER BLUR BANNER: Only Admin-approved Premium Members are shown */}
              {!isCurrentUserPaid && (
                <div className="bg-white border-2 border-[#16A34A] rounded-[24px] p-4 shadow-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#DCF2E3] text-[#15803D] flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </span>
                    <div>
                      <h2 className="text-sm font-extrabold text-[#0D2E1B]">
                        Premium Members Directory (Admin Approved Only)
                      </h2>
                      <p className="text-[11.5px] text-gray-600">
                        Community profiles are blurred for Free users. Only Premium members approved by Admin appear here.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Member Cards List (Only Paid Verified Members Approved by Admin) */}
              {filteredMembers.length > 0 ? (
                <div className="relative">
                  <div
                    className={`space-y-3.5 transition-all ${
                      !isCurrentUserPaid
                        ? 'blur-[5px] select-none pointer-events-none opacity-85'
                        : ''
                    }`}
                  >
                    {filteredMembers.map((member) => (
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
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-[#B8D3BE] rounded-[26px] p-6 text-center space-y-3 shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-[#DCF2E3] text-[#15803D] flex items-center justify-center mx-auto">
                    <UserPlus className="w-7 h-7" />
                  </div>
                  <h2 className="text-[19px] font-extrabold text-[#0D2E1B]">
                    No Matching Paid Member Profiles
                  </h2>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    Only Paid Members whose payment is verified by Admin appear in
                    Communities.
                  </p>
                </div>
              )}
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
                      <div className="flex items-center justify-between gap-2">
                        <h1 className="text-[22px] font-extrabold text-[#0D2E1B] truncate">
                          {member.name}
                        </h1>
                        {ps.hireMe_public && (
                          <span className="px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#16A34A]/40 text-[#15803D] text-[11px] font-extrabold shrink-0">
                            Hire Me
                          </span>
                        )}
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

                  {/* Education / Qualification — ONLY shown if privacySettings.qualification_public == true */}
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

                  {/* Experience — ONLY shown if privacySettings.experience_public == true */}
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

                  {/* Contact Info — ONLY shown if email_public / phone_public == true */}
                  {(ps.email_public || ps.phone_public) && (
                    <div className="space-y-2 pt-2 border-t border-emerald-100">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Permitted Contact Information
                      </h2>
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
                  )}

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

          {/* ==================== 6. TRAININGS MAIN PAGE (/trainings) — ONLY 2 CARDS ON FIRST PAGE ==================== */}
          {route.name === 'trainings' && (
            <div className="space-y-4 px-1">
              {/* Top Green Gradient Banner */}
              <div className="bg-gradient-to-r from-[#2E7D47] via-[#469A61] to-[#2E7D47] rounded-[22px] px-4 py-4 text-center text-white shadow-sm border border-emerald-600/30">
                <h1 className="text-[22px] font-extrabold tracking-tight leading-snug">
                  Build Your Expertise
                </h1>
                <p className="text-[12px] sm:text-[13px] font-semibold text-emerald-50 mt-0.5">
                  Select a training category below
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
                        HACCP Level 1, Level 2, Level 3 &amp; Level 4 Certified Courses
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
                    <span>HACCP Levels 1–4 Cards</span>
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
                        ISO 9001, FSSC 22000, ISO 14001 &amp; ISO 45001 Lead Auditor
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
                    <span>IRCA CQI &amp; Exemplar Global</span>
                  </span>
                  <span className="text-xs font-extrabold text-[#15803D]">
                    Open Trainings →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 6A. HIGHFIELD TRAININGS SUB-PAGE (HACCP Level 1, 2, 3, 4 Cards) ==================== */}
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
                    HACCP Level 1, Level 2, Level 3 &amp; Level 4
                  </p>
                </div>
              </div>

              {/* 2x2 Grid of White Cards for HACCP Level 1, 2, 3, 4 in the exact same card design */}
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'tr-hf-haccp-1',
                    title: 'HACCP Level 1',
                    sub: 'Foundations of Food Safety',
                    icon: Shield
                  },
                  {
                    id: 'tr-hf-haccp-2',
                    title: 'HACCP Level 2',
                    sub: 'Hazard Analysis & CCPs',
                    icon: Utensils
                  },
                  {
                    id: 'tr-hf-haccp-3',
                    title: 'HACCP Level 3',
                    sub: 'Advanced HACCP Management',
                    icon: FileText
                  },
                  {
                    id: 'tr-hf-haccp-4',
                    title: 'HACCP Level 4',
                    sub: 'Lead HACCP Implementer',
                    icon: ShieldCheck
                  }
                ].map((item) => {
                  const matched =
                    haccpTrainings.find(
                      (t) => t.title.toLowerCase() === item.title.toLowerCase()
                    ) || highfieldTrainings[0];
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (matched) {
                          setRoute({
                            name: 'training-detail',
                            trainingId: matched.id
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && matched) {
                          e.preventDefault();
                          setRoute({
                            name: 'training-detail',
                            trainingId: matched.id
                          });
                        }
                      }}
                      className="bg-white border border-emerald-100 hover:border-[#16A34A] rounded-[22px] p-4 shadow-[0_4px_16px_rgba(22,163,74,0.07)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-11 h-11 rounded-[14px] bg-[#228B4E] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <IconComp className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[15px] font-extrabold text-[#0B3B1E] leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-[11.5px] text-gray-600 font-medium leading-snug mt-1">
                            {item.sub}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-center">
                        <span className="px-4 py-1.5 rounded-full bg-[#138A3E] hover:bg-[#0E6F30] text-white text-[12px] font-bold inline-flex items-center gap-1 shadow-xs transition-colors">
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
                  Accredited under 1. IRCA CQI and 2. Exemplar Global
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
                  {leadAuditorStandards.map((std) => {
                    const IconComp = std.icon;
                    const matched = trainings.find(
                      (t) =>
                        t.category === 'Lead Auditor' &&
                        t.title.toLowerCase() === std.code.toLowerCase() &&
                        t.subType === 'IRCA | CQI'
                    );
                    return (
                      <div
                        key={`irca-${std.code}`}
                        onClick={() => {
                          if (matched) {
                            setRoute({
                              name: 'training-detail',
                              trainingId: matched.id
                            });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && matched) {
                            e.preventDefault();
                            setRoute({
                              name: 'training-detail',
                              trainingId: matched.id
                            });
                          }
                        }}
                        className="bg-[#F6FBF7] border border-emerald-200/80 hover:border-[#16A34A] rounded-[20px] p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-[#14532D] text-white flex items-center justify-center shrink-0">
                            <IconComp className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[14.5px] font-extrabold text-[#0B3B1E] leading-tight">
                              {std.code}
                            </div>
                            <div className="text-[12px] font-semibold text-gray-700 truncate">
                              {std.subtitle}
                            </div>
                            <div className="text-[11px] text-[#15803D] font-bold mt-0.5">
                              IRCA CQI Certified • 5-Day Course
                            </div>
                          </div>
                        </div>

                        <span className="px-3.5 py-1.5 rounded-full bg-[#138A3E] text-white text-[11.5px] font-bold shrink-0 inline-flex items-center gap-1">
                          <span>Enroll</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      </div>
                    );
                  })}
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
                  {leadAuditorStandards.map((std) => {
                    const IconComp = std.icon;
                    const matched = trainings.find(
                      (t) =>
                        t.category === 'Lead Auditor' &&
                        t.title.toLowerCase() === std.code.toLowerCase() &&
                        t.subType === 'Exemplar Global'
                    );
                    return (
                      <div
                        key={`eg-${std.code}`}
                        onClick={() => {
                          if (matched) {
                            setRoute({
                              name: 'training-detail',
                              trainingId: matched.id
                            });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && matched) {
                            e.preventDefault();
                            setRoute({
                              name: 'training-detail',
                              trainingId: matched.id
                            });
                          }
                        }}
                        className="bg-[#F6FBF7] border border-emerald-200/80 hover:border-[#16A34A] rounded-[20px] p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-[#1E8244] text-white flex items-center justify-center shrink-0">
                            <IconComp className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[14.5px] font-extrabold text-[#0B3B1E] leading-tight">
                              {std.code}
                            </div>
                            <div className="text-[12px] font-semibold text-gray-700 truncate">
                              {std.subtitle}
                            </div>
                            <div className="text-[11px] text-[#15803D] font-bold mt-0.5">
                              Exemplar Global Certified • 5-Day Course
                            </div>
                          </div>
                        </div>

                        <span className="px-3.5 py-1.5 rounded-full bg-[#138A3E] text-white text-[11.5px] font-bold shrink-0 inline-flex items-center gap-1">
                          <span>Enroll</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      </div>
                    );
                  })}
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
                  <span className="inline-block px-3 py-1 rounded-[10px] bg-[#BCE3C5] text-[#0B3B1E] text-xs font-bold">
                    {tr.category} {tr.subType ? `• ${tr.subType}` : 'UK Qualification'}
                  </span>
                  <h1 className="text-2xl font-extrabold text-[#0B3B1E]">
                    {tr.title} {tr.subType ? `(${tr.subType})` : ''}
                  </h1>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#F0FDF4]">
                      <div className="text-gray-500">Duration</div>
                      <div className="font-bold text-gray-900 mt-0.5">{tr.duration}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#F0FDF4]">
                      <div className="text-gray-500">Course Fee</div>
                      <div className="font-bold text-[#15803D] mt-0.5">{tr.fees}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {tr.description}
                  </p>
                  <a
                    href={tr.enrollLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#138A3E] hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Enroll via WhatsApp</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              );
            })()}

          {/* ==================== 7. PROFILE & PRIVACY PAGE (/profile) — CLEAN PROFILE PAGE ONLY ==================== */}
          {route.name === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5 px-1">
              {/* Top Profile Hero Card with Sage-Green Gradient Backdrop */}
              <div className="rounded-[28px] overflow-hidden bg-gradient-to-b from-[#6FA57C] via-[#9FC4A7]/60 to-white border border-[#B5D6BB] shadow-sm p-5 text-center relative">
                <div className="bg-white rounded-[18px] px-4 py-2.5 flex items-center justify-between shadow-xs mb-5">
                  <span className="text-[18px] font-extrabold text-[#0D2E1B]">
                    Profile &amp; Privacy
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

                <h2 className="text-[22px] font-extrabold text-[#0D2E1B] mt-3 leading-tight">
                  {myProfile.name}
                </h2>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DCEFE0] text-[#138A3E] text-[12px] font-bold mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span>{myProfile.currentRole || 'Food Safety Specialist'}</span>
                </div>
                <p className="text-[13px] font-bold text-[#0D2E1B] mt-2">
                  Control what others can see on your profile
                </p>
              </div>

              {/* HIRE ME TOGGLE CARD */}
              <div className="bg-white border border-emerald-200 rounded-[24px] p-4 shadow-xs flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-[#0D2E1B] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#15803D]" />
                    <span>&ldquo;Hire Me&rdquo; Button Visible on My Profile</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Allow community members &amp; employers to hire you based on your
                    Education &amp; Experience
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(myProfile.privacySettings.hireMe_public)}
                    onClick={() =>
                      setMyProfile({
                        ...myProfile,
                        privacySettings: {
                          ...myProfile.privacySettings,
                          hireMe_public: !myProfile.privacySettings.hireMe_public
                        }
                      })
                    }
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

              {/* ✨ PROFILE DETAILS WHITE CARD */}
              <div className="bg-white border border-emerald-100 rounded-[26px] p-5 shadow-[0_6px_24px_rgba(22,163,74,0.08)] space-y-3.5">
                <div className="flex items-center justify-center gap-1.5 pb-1">
                  <Sparkles className="w-5 h-5 text-[#15803D]" />
                  <h3 className="text-[20px] font-extrabold text-[#0D2E1B]">
                    Profile Details
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

                {/* Row 2: Qualification (Education) */}
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
                        setMyProfile({
                          ...myProfile,
                          privacySettings: {
                            ...myProfile.privacySettings,
                            qualification_public:
                              !myProfile.privacySettings.qualification_public
                          }
                        })
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

                {/* Row 3: Experience */}
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
                        setMyProfile({
                          ...myProfile,
                          privacySettings: {
                            ...myProfile.privacySettings,
                            experience_public:
                              !myProfile.privacySettings.experience_public
                          }
                        })
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

                {/* Row 4: Current Role */}
                <div className="flex items-center gap-2.5">
                  <label className="w-[95px] text-[13px] font-extrabold text-[#0D2E1B] shrink-0">
                    Current Role
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
                        setMyProfile({
                          ...myProfile,
                          privacySettings: {
                            ...myProfile.privacySettings,
                            currentRole_public:
                              !myProfile.privacySettings.currentRole_public
                          }
                        })
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
                        setMyProfile({
                          ...myProfile,
                          privacySettings: {
                            ...myProfile.privacySettings,
                            location_public:
                              !myProfile.privacySettings.location_public
                          }
                        })
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
                      onClick={() =>
                        setMyProfile({
                          ...myProfile,
                          privacySettings: {
                            ...myProfile.privacySettings,
                            email_public: !myProfile.privacySettings.email_public
                          }
                        })
                      }
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
                      onClick={() =>
                        setMyProfile({
                          ...myProfile,
                          privacySettings: {
                            ...myProfile.privacySettings,
                            phone_public: !myProfile.privacySettings.phone_public
                          }
                        })
                      }
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

              {/* CV Upload PDF */}
              <div className="bg-white border border-emerald-100 rounded-[24px] p-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <div className="min-w-0 text-xs">
                    <div className="font-bold text-gray-900 truncate">
                      {myProfile.cvUrl || 'No CV PDF uploaded yet'}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Upload CV PDF for Hiring &amp; QA Roles
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

              {/* Full-Width Green "Save Changes" Button */}
              <button
                type="submit"
                className="w-full py-4 px-5 rounded-[18px] bg-[#168A42] hover:bg-[#117035] text-white font-extrabold text-[16px] shadow-md transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* ==================== HIRE / CONTACT MEMBER MODAL ==================== */}
        {contactModalMember && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] bg-white rounded-[28px] p-5 shadow-xl space-y-4 border border-emerald-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-extrabold">
                    {contactModalMember.privacySettings.hireMe_public
                      ? 'Available for Hiring'
                      : 'Direct Community Contact'}
                  </span>
                  <h3 className="text-[20px] font-extrabold text-[#0D2E1B] mt-1">
                    Contact {contactModalMember.name}
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
                  Hiring / Connection Message
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
                {contactModalMember.phone && (
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

                {contactModalMember.email && (
                  <a
                    href={`mailto:${
                      contactModalMember.email
                    }?subject=${encodeURIComponent(
                      'Hiring / Opportunity via Food Specialists Hub'
                    )}&body=${encodeURIComponent(contactCustomMsg)}`}
                    className="w-full py-3 px-4 rounded-2xl bg-[#EAF3EC] hover:bg-[#D5EAD8] text-[#0D2E1B] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#15803D]" />
                    <span>Send Hiring Email ({contactModalMember.email})</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setContactSentBanner(
                      `Your hiring request has been sent to ${contactModalMember.name}!`
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-2xl border border-emerald-200 text-[#15803D] text-xs font-bold cursor-pointer hover:bg-[#F0FDF4]"
                >
                  Send Direct In-App Hire Request
                </button>
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

