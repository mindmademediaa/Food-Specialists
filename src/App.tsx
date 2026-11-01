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
        {/* TOP ARCHITECTURE SWITCHER: PART 1 (USER FRONTEND) vs PART 2 (ADMIN BACKEND CONTROL PANEL) */}
        <div className="bg-[#0D2E1B] text-white px-3.5 py-2.5 flex flex-col gap-2 border-b border-emerald-800">
          <div className="grid grid-cols-2 gap-1.5 bg-white/10 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                if (route.name === 'admin') setRoute({ name: 'home' });
              }}
              className={`py-2 px-2.5 rounded-xl text-[11.5px] font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                route.name !== 'admin'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <span>Part 1: User Frontend</span>
            </button>

            <button
              type="button"
              onClick={() => setRoute({ name: 'admin' })}
              className={`py-2 px-2.5 rounded-xl text-[11.5px] font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                route.name === 'admin'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Part 2: Admin Backend</span>
              {pendingReqCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#0D2E1B] text-[10px] font-black">
                  {pendingReqCount}
                </span>
              )}
            </button>
          </div>

          {/* User Preview Tier Bar (Free Member vs Verified Paid Member) */}
          {route.name !== 'admin' && (
            <div className="flex items-center justify-between gap-2 px-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCurrentUserPaid ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span className="text-emerald-100 font-semibold">
                  Current Access:{' '}
                  <strong className="text-white">
                    {isCurrentUserPaid
                      ? 'Verified Paid Member'
                      : myProfile.paymentStatus === 'pending'
                      ? 'Free User (Payment Pending Admin)'
                      : 'Free User (Communities Blurred)'}
                  </strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMyProfile((prev) => ({
                    ...prev,
                    isPaid: !prev.isPaid,
                    paymentStatus: !prev.isPaid ? 'verified' : 'none'
                  }))
                }
                className="px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold cursor-pointer shrink-0"
              >
                {isCurrentUserPaid ? 'Preview Free View' : 'Preview Paid View'}
              </button>
            </div>
          )}
        </div>

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
            onAdminClick={() => setRoute({ name: 'admin' })}
            isAdmin={true}
            userInitial={userInitial}
            notificationCount={pendingReqCount}
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
                      onClick={() => {
                        if (!isUserSignedIn) {
                          setRoute({ name: 'profile' });
                        } else {
                          handleToggleMyPaidStatus(true);
                        }
                      }}
                      className="w-full py-3.5 px-5 rounded-[18px] bg-[#15803D] hover:bg-[#0D2E1B] text-white font-extrabold text-sm shadow-sm transition-colors cursor-pointer"
                    >
                      {isUserSignedIn
                        ? 'Activate Paid Membership Now →'
                        : 'Sign In & Upgrade to Paid Member →'}
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
                      onClick={() => {
                        if (!isUserSignedIn) {
                          setRoute({ name: 'profile' });
                        } else {
                          handleToggleMyPaidStatus(true);
                        }
                      }}
                      className="w-full py-3.5 px-5 rounded-[18px] bg-[#15803D] hover:bg-[#0D2E1B] text-white font-extrabold text-sm shadow-sm transition-colors cursor-pointer"
                    >
                      {isUserSignedIn
                        ? 'Activate Paid Membership Now →'
                        : 'Sign In & Upgrade to Paid Member →'}
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

              {/* FREE USER BLUR BANNER: If user is NOT a verified Paid Member, explain that cards are blurred */}
              {!isCurrentUserPaid && (
                <div className="bg-white border-2 border-[#16A34A] rounded-[24px] p-4 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#DCF2E3] text-[#15803D] flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4" />
                      </span>
                      <div>
                        <h2 className="text-sm font-extrabold text-[#0D2E1B]">
                          Blurred for Free Members (Paid Access Only)
                        </h2>
                        <p className="text-[11.5px] text-gray-600">
                          {myProfile.paymentStatus === 'pending'
                            ? 'Your Payment Request is pending in Admin Control Panel. Once verified, profiles will unblur.'
                            : 'Community profiles are blurred for Free users. Submit payment in Profile for Admin verification.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setRoute({ name: 'profile' })}
                      className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold cursor-pointer transition-colors"
                    >
                      Submit Payment Request in Profile →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminTab('requests');
                        setRoute({ name: 'admin' });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#EAF3EC] text-[#0D2E1B] text-xs font-bold cursor-pointer"
                    >
                      Open Part 2: Admin Panel →
                    </button>
                  </div>
                </div>
              )}

              {/* Member Cards List (Only Paid Verified Members from Backend) */}
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

                  {/* Floating Unlock Card over Blurred List for Free Users */}
                  {!isCurrentUserPaid && (
                    <div className="inset-x-0 top-16 flex justify-center pointer-events-auto mt-3">
                      <div className="bg-[#0D2E1B]/95 text-white rounded-[24px] p-4 shadow-xl border border-emerald-500/40 text-center max-w-[380px] space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-[11px] font-bold">
                          <Crown className="w-3.5 h-3.5" />
                          <span>Verified Paid Members Only</span>
                        </div>
                        <p className="text-xs text-emerald-50 leading-relaxed">
                          Direct profile addition is disabled. When you create your profile and
                          submit payment, your request goes to the <strong>Admin Control Panel</strong>.
                          Once payment is verified, you get full access &amp; listing here.
                        </p>
                      </div>
                    </div>
                  )}
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

          {/* ==================== 7. PROFILE & PRIVACY PAGE (/profile) — NO SIGN IN / SIGN UP ==================== */}
          {route.name === 'profile' && (
            <div className="space-y-5 px-1">
              <form onSubmit={handleSaveProfile} className="space-y-5">
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
                  <p className="text-[12.5px] font-bold text-[#0D2E1B] mt-2">
                    Control what others can see on your profile. Saving stores your record in Backend; Admin adds you to Communities after Payment Verification.
                  </p>
                </div>

                {/* MEMBERSHIP STATUS & HIRE ME CARD */}
                <div className="bg-white border-2 border-[#16A34A] rounded-[24px] p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-[#15803D]" />
                        <span className="text-sm font-extrabold text-[#0D2E1B]">
                          Account Status:{' '}
                          {myProfile.isPaid
                            ? 'Verified Paid Member'
                            : myProfile.paymentStatus === 'pending'
                            ? 'Payment Pending Admin Verification'
                            : 'Free User (Not in Communities Yet)'}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-gray-600 mt-0.5">
                        {myProfile.isPaid
                          ? 'Admin verified your payment! Your profile is live in Communities + all Jobs & Scholarships are unlocked.'
                          : 'Free users see 1 Job & 1 Scholarship/day and blurred Communities. Submit payment below for Admin approval.'}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold shrink-0 ${
                        myProfile.isPaid
                          ? 'bg-[#DCF2E3] text-[#0D2E1B] border border-[#16A34A]'
                          : myProfile.paymentStatus === 'pending'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {myProfile.isPaid
                        ? 'Paid Verified ✓'
                        : myProfile.paymentStatus === 'pending'
                        ? 'Pending Admin'
                        : 'Free Tier'}
                    </span>
                  </div>

                  {/* HIRE ME TOGGLE (For Fresh Graduates & Specialists) */}
                  <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-extrabold text-[#0D2E1B] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#15803D]" />
                        <span>&ldquo;Hire Me&rdquo; Button Visible on My Profile</span>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        Allow community members &amp; employers to hire you based on your
                        Education &amp; Experience once approved
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
                </div>

                {profileSaveMsg && (
                  <div className="bg-[#15803D] text-white rounded-2xl p-3.5 text-xs font-bold flex items-center justify-between gap-2 shadow-sm">
                    <span>{profileSaveMsg}</span>
                    <button
                      type="button"
                      onClick={() => setRoute({ name: 'communities' })}
                      className="px-2.5 py-1 rounded-lg bg-white text-[#0D2E1B] font-bold shrink-0 cursor-pointer"
                    >
                      Communities →
                    </button>
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
                  Save Profile Details
                </button>
              </form>

              {/* ==================== REQUEST PAID MEMBERSHIP & PAYMENT VERIFICATION CARD ==================== */}
              <form
                onSubmit={handleSubmitPaymentRequest}
                className="bg-white border-2 border-[#15803D] rounded-[26px] p-5 shadow-sm space-y-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10.5px] font-extrabold uppercase tracking-wide">
                      Step 2 • Admin Payment Verification
                    </span>
                    <h3 className="text-[18px] font-extrabold text-[#0D2E1B] mt-1">
                      Request Paid Member Access
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      Submit your payment details below. Your request goes to the{' '}
                      <strong>Admin Backend Control Panel</strong>. Once Admin verifies
                      your payment, your profile will be added to Communities and all
                      blurred cards will unlock.
                    </p>
                  </div>
                  <Crown className="w-6 h-6 text-[#15803D] shrink-0" />
                </div>

                <div className="bg-[#F0FDF4] border border-emerald-200 rounded-2xl p-3 text-xs space-y-1">
                  <div className="font-extrabold text-[#0D2E1B]">
                    Official Payment Account (Muneeb Khan):
                  </div>
                  <div className="text-gray-700 font-semibold">
                    EasyPaisa / JazzCash / WhatsApp: <span className="text-[#15803D] font-extrabold">+92 324 0906384</span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Membership Fee: PKR 1,500 (Unlocks Communities Directory + Unlimited Daily Jobs &amp; Scholarships)
                  </div>
                </div>

                {paySubmitBanner && (
                  <div className="p-3.5 rounded-2xl bg-[#15803D] text-white text-xs font-bold leading-relaxed">
                    {paySubmitBanner}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#0D2E1B] mb-1">
                      Payment Method
                    </label>
                    <select
                      value={payMethod}
                      onChange={(e) =>
                        setPayMethod(
                          e.target.value as
                            | 'EasyPaisa'
                            | 'JazzCash'
                            | 'Bank Transfer'
                        )
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-[#EAF3EC] border border-[#AECBB5] text-xs font-bold text-[#0D2E1B]"
                    >
                      <option value="EasyPaisa">EasyPaisa</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-[#0D2E1B] mb-1">
                      Amount Sent
                    </label>
                    <input
                      type="text"
                      required
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#EAF3EC] border border-[#AECBB5] text-xs font-bold text-[#0D2E1B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#0D2E1B] mb-1">
                    Transaction ID / TID Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., TID-88492019482 (Required for Admin Verification)"
                    value={payTxId}
                    onChange={(e) => setPayTxId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EAF3EC] border border-[#AECBB5] text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none focus:border-[#16A34A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#0D2E1B] mb-1">
                    Note for Admin
                  </label>
                  <input
                    type="text"
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#EAF3EC] border border-[#AECBB5] text-xs font-medium text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-[18px] bg-[#0D2E1B] hover:bg-[#15803D] text-white font-extrabold text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Payment Request to Admin Backend →</span>
                </button>
              </form>

              {/* ==================== DIRECT SUPPORT CHAT WITH ADMIN ==================== */}
              <form
                onSubmit={handleSendSupportChat}
                className="bg-white border border-emerald-200 rounded-[26px] p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#15803D]" />
                    <div>
                      <h3 className="text-sm font-extrabold text-[#0D2E1B]">
                        Chat with Admin Support
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Messages appear live in Part 2 (Admin Control Panel &rarr; Chats)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Show recent messages from this user & Admin replies */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {chats
                    .filter(
                      (c) =>
                        c.senderUid === myProfile.uid ||
                        c.senderName.toLowerCase() ===
                          myProfile.name.toLowerCase()
                    )
                    .map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-2xl bg-[#F2F7F3] border border-emerald-100 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[10.5px] text-gray-500 font-bold">
                          <span>You ({c.senderName})</span>
                          <span>{c.createdAt}</span>
                        </div>
                        <p className="text-gray-800 font-medium">{c.message}</p>
                        {c.adminReply && (
                          <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#0D2E1B] text-[11px] font-bold">
                            Admin Reply: {c.adminReply}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {supportChatSentMsg && (
                  <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#0D2E1B] text-xs font-bold">
                    {supportChatSentMsg}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write message to Admin regarding membership, jobs, or verification..."
                    value={supportChatInput}
                    onChange={(e) => setSupportChatInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#EAF3EC] border border-[#AECBB5] text-xs font-medium text-gray-900 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#15803D] text-white text-xs font-extrabold shrink-0 cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              </form>

              {/* Quick Switch to Part 2 Admin Backend Control Panel */}
              <div className="bg-white border border-emerald-200 rounded-[22px] p-3.5 flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-gray-600">
                  Want to verify payments &amp; manage requests?
                </span>
                <button
                  type="button"
                  onClick={() => setRoute({ name: 'admin' })}
                  className="px-3.5 py-2 rounded-xl bg-[#0D2E1B] text-white font-extrabold cursor-pointer shrink-0"
                >
                  Open Part 2: Admin Backend →
                </button>
              </div>
            </div>
          )}

          {/* ==================== 8. PART 2: ADMIN BACKEND CONTROL PANEL (/admin) ==================== */}
          {route.name === 'admin' && (
            <AdminPanelView
              users={users}
              paymentRequests={paymentRequests}
              chats={chats}
              jobs={jobs}
              scholarships={scholarships}
              trainings={trainings}
              adminTab={adminTab}
              setAdminTab={setAdminTab}
              adminStatusMsg={adminStatusMsg}
              setAdminStatusMsg={setAdminStatusMsg}
              onVerifyPaymentRequest={async (reqItem, approve) => {
                const newStatus = approve ? 'verified' : 'rejected';
                const updatedReq: HubPaymentRequest = {
                  ...reqItem,
                  status: newStatus
                };
                setPaymentRequests((prev) =>
                  prev.map((r) => (r.id === reqItem.id ? updatedReq : r))
                );
                try {
                  await setDoc(doc(db, 'paymentRequests', reqItem.id), updatedReq, {
                    merge: true
                  });
                } catch {}

                // Also update or create the corresponding user in `users` collection
                const existingUser = users.find((u) => u.uid === reqItem.uid);
                const updatedUser: HubUser = existingUser
                  ? {
                      ...existingUser,
                      isPaid: approve,
                      paymentStatus: newStatus,
                      paymentMethod: reqItem.paymentMethod,
                      paymentReference: reqItem.transactionId,
                      paymentAmount: reqItem.amount
                    }
                  : {
                      uid: reqItem.uid,
                      name: reqItem.userName,
                      profilePicUrl: makeAvatarSvg(
                        reqItem.userName.slice(0, 2).toUpperCase(),
                        '#DCFCE7',
                        '#14532D'
                      ),
                      qualification:
                        reqItem.qualification || 'BS Food Science & Technology',
                      experience: 'Food Safety & Quality Specialist',
                      currentRole:
                        reqItem.currentRole || 'Food Safety Specialist',
                      company: '',
                      location: 'Pakistan',
                      email: reqItem.userEmail,
                      phone: reqItem.userPhone,
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
                      createdAt: new Date().toISOString(),
                      isAdmin: false,
                      isPaid: approve,
                      paymentStatus: newStatus,
                      paymentMethod: reqItem.paymentMethod,
                      paymentReference: reqItem.transactionId,
                      paymentAmount: reqItem.amount
                    };

                setUsers((prev) => {
                  const exists = prev.some((u) => u.uid === updatedUser.uid);
                  return exists
                    ? prev.map((u) =>
                        u.uid === updatedUser.uid ? updatedUser : u
                      )
                    : [updatedUser, ...prev];
                });

                if (myProfile.uid === updatedUser.uid) {
                  setMyProfile(updatedUser);
                }

                try {
                  await setDoc(doc(db, 'users', updatedUser.uid), updatedUser, {
                    merge: true
                  });
                } catch {}
              }}
              onReplyChat={async (chatItem, replyText) => {
                const updatedChat: HubChatMessage = {
                  ...chatItem,
                  adminReply: replyText
                };
                setChats((prev) =>
                  prev.map((c) => (c.id === chatItem.id ? updatedChat : c))
                );
                try {
                  await setDoc(doc(db, 'chats', chatItem.id), updatedChat, {
                    merge: true
                  });
                } catch {}
              }}
              onDeleteChat={async (chatId) => {
                setChats((prev) => prev.filter((c) => c.id !== chatId));
                try {
                  await deleteDoc(doc(db, 'chats', chatId));
                } catch {}
              }}
              onToggleUserPaid={async (u) => {
                const nextPaid = !u.isPaid;
                const updated: HubUser = {
                  ...u,
                  isPaid: nextPaid,
                  paymentStatus: nextPaid ? 'verified' : 'none'
                };
                setUsers((prev) =>
                  prev.map((item) => (item.uid === u.uid ? updated : item))
                );
                if (myProfile.uid === u.uid) {
                  setMyProfile(updated);
                }
                try {
                  await setDoc(doc(db, 'users', u.uid), updated, { merge: true });
                } catch {}
              }}
              onDeleteUser={async (uid) => {
                setUsers((prev) => prev.filter((u) => u.uid !== uid));
                try {
                  await deleteDoc(doc(db, 'users', uid));
                } catch {}
              }}
              onSaveJob={async (job) => {
                setJobs((prev) => {
                  const exists = prev.some((j) => j.id === job.id);
                  return exists
                    ? prev.map((j) => (j.id === job.id ? job : j))
                    : [job, ...prev];
                });
                try {
                  await setDoc(doc(db, 'jobs', job.id), job, { merge: true });
                } catch {}
              }}
              onDeleteJob={async (id) => {
                setJobs((prev) => prev.filter((j) => j.id !== id));
                try {
                  await deleteDoc(doc(db, 'jobs', id));
                } catch {}
              }}
              onSaveScholarship={async (sch) => {
                setScholarships((prev) => {
                  const exists = prev.some((s) => s.id === sch.id);
                  return exists
                    ? prev.map((s) => (s.id === sch.id ? sch : s))
                    : [sch, ...prev];
                });
                try {
                  await setDoc(doc(db, 'scholarships', sch.id), sch, {
                    merge: true
                  });
                } catch {}
              }}
              onDeleteScholarship={async (id) => {
                setScholarships((prev) => prev.filter((s) => s.id !== id));
                try {
                  await deleteDoc(doc(db, 'scholarships', id));
                } catch {}
              }}
              onSaveTraining={async (tr) => {
                setTrainings((prev) => {
                  const exists = prev.some((t) => t.id === tr.id);
                  return exists
                    ? prev.map((t) => (t.id === tr.id ? tr : t))
                    : [tr, ...prev];
                });
                try {
                  await setDoc(doc(db, 'trainings', tr.id), tr, {
                    merge: true
                  });
                } catch {}
              }}
              onDeleteTraining={async (id) => {
                setTrainings((prev) => prev.filter((t) => t.id !== id));
                try {
                  await deleteDoc(doc(db, 'trainings', id));
                } catch {}
              }}
            />
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
                  onClick={async () => {
                    const newHireChat: HubChatMessage = {
                      id: 'chat-hire-' + Date.now(),
                      senderUid: myProfile.uid || 'user-alex-morgan',
                      senderName: myProfile.name || 'Alex Morgan',
                      senderPhone: myProfile.phone || '+92 300 1234567',
                      recipientName: contactModalMember.name,
                      chatType: 'hiring_contact',
                      message: contactCustomMsg.trim(),
                      createdAt: new Date()
                        .toISOString()
                        .slice(0, 16)
                        .replace('T', ' ')
                    };
                    setChats((prev) => [newHireChat, ...prev]);
                    setContactSentBanner(
                      `Your hiring request has been sent to ${contactModalMember.name} and logged in the Admin Backend!`
                    );
                    try {
                      await setDoc(doc(db, 'chats', newHireChat.id), newHireChat, {
                        merge: true
                      });
                    } catch {}
                  }}
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

// ==================== PART 2: ADMIN BACKEND CONTROL PANEL SUB-COMPONENT ====================
type AdminTabType =
  | 'requests'
  | 'chats'
  | 'users'
  | 'jobs'
  | 'scholarships'
  | 'trainings';

interface AdminPanelViewProps {
  users: HubUser[];
  paymentRequests: HubPaymentRequest[];
  chats: HubChatMessage[];
  jobs: HubJob[];
  scholarships: HubScholarship[];
  trainings: HubTraining[];
  adminTab: AdminTabType;
  setAdminTab: (t: AdminTabType) => void;
  adminStatusMsg: string | null;
  setAdminStatusMsg: (m: string | null) => void;
  onVerifyPaymentRequest: (reqItem: HubPaymentRequest, approve: boolean) => void;
  onReplyChat: (chatItem: HubChatMessage, replyText: string) => void;
  onDeleteChat: (chatId: string) => void;
  onToggleUserPaid: (u: HubUser) => void;
  onDeleteUser: (uid: string) => void;
  onSaveJob: (j: HubJob) => void;
  onDeleteJob: (id: string) => void;
  onSaveScholarship: (s: HubScholarship) => void;
  onDeleteScholarship: (id: string) => void;
  onSaveTraining: (t: HubTraining) => void;
  onDeleteTraining: (id: string) => void;
}

const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  users,
  paymentRequests,
  chats,
  jobs,
  scholarships,
  trainings,
  adminTab,
  setAdminTab,
  adminStatusMsg,
  setAdminStatusMsg,
  onVerifyPaymentRequest,
  onReplyChat,
  onDeleteChat,
  onToggleUserPaid,
  onDeleteUser,
  onSaveJob,
  onDeleteJob,
  onSaveScholarship,
  onDeleteScholarship,
  onSaveTraining,
  onDeleteTraining
}) => {
  // Filter state for Paid vs Free user records
  const [userRecordFilter, setUserRecordFilter] = useState<
    'all' | 'paid' | 'free'
  >('all');

  // Admin Reply Inputs Map by chat ID
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Job Form State
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jTitle, setJTitle] = useState('');
  const [jCompany, setJCompany] = useState('');
  const [jLoc, setJLoc] = useState('Lahore, Pakistan');
  const [jExp, setJExp] = useState('2–4 Years');
  const [jCat, setJCat] = useState<JobCategory>('Quality & Safety');
  const [jTags, setJTags] = useState('HACCP, FSSC 22000');
  const [jDesc, setJDesc] = useState('');
  const [jReqs, setJReqs] = useState('');
  const [jLink, setJLink] = useState('https://');

  // Scholarship Form State
  const [editingSchId, setEditingSchId] = useState<string | null>(null);
  const [sTitle, setSTitle] = useState('');
  const [sOrg, setSOrg] = useState('');
  const [sCountry, setSCountry] = useState('Europe / Global');
  const [sDeadline, setSDeadline] = useState('2027-01-30');
  const [sFunding, setSFunding] = useState<
    'Fellowships' | 'International' | 'Grants'
  >('Fellowships');
  const [sDegree, setSDegree] = useState('MS / PhD');
  const [sDesc, setSDesc] = useState('');
  const [sElig, setSElig] = useState('');
  const [sLink, setSLink] = useState('https://');

  // Training Form State
  const [editingTrId, setEditingTrId] = useState<string | null>(null);
  const [tCategory, setTCategory] = useState<'Highfield' | 'Lead Auditor'>(
    'Highfield'
  );
  const [tTitle, setTTitle] = useState('HACCP Level 3');
  const [tSubType, setTSubType] = useState<
    '' | 'Exemplar Global' | 'IRCA | CQI'
  >('');
  const [tDuration, setTDuration] = useState('3 Days (18 Hours)');
  const [tFees, setTFees] = useState('PKR 28,000');
  const [tDesc, setTDesc] = useState('');
  const [tEnroll, setTEnroll] = useState('https://wa.me/923240906384');

  const notify = (msg: string) => {
    setAdminStatusMsg(msg);
    setTimeout(() => setAdminStatusMsg(null), 4000);
  };

  const paidMembersList = useMemo(
    () => users.filter((u) => u.isPaid === true),
    [users]
  );
  const freeUsersList = useMemo(
    () => users.filter((u) => !u.isPaid),
    [users]
  );
  const pendingPaymentsCount = useMemo(
    () => paymentRequests.filter((r) => r.status === 'pending').length,
    [paymentRequests]
  );

  const displayedUsersRecord = useMemo(() => {
    if (userRecordFilter === 'paid') return paidMembersList;
    if (userRecordFilter === 'free') return freeUsersList;
    return users;
  }, [users, paidMembersList, freeUsersList, userRecordFilter]);

  return (
    <div className="space-y-4 px-1">
      {/* Admin Header Banner */}
      <div className="bg-[#0D2E1B] text-white rounded-[26px] p-5 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-[10.5px] font-extrabold uppercase tracking-wider">
            Part 2 • Backend Control Panel
          </span>
          <ShieldCheck className="w-5 h-5 text-[#4ADE80]" />
        </div>
        <h1 className="text-[22px] font-extrabold leading-tight">
          Admin Backend &amp; Database
        </h1>
        <p className="text-xs text-emerald-100/90 leading-relaxed">
          Verify incoming Payments, approve Paid Members for Communities, reply to
          User Chats, and manage Premium &amp; Free User records.
        </p>

        {/* Summary Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 pt-2 text-center">
          <div className="bg-white/10 rounded-2xl p-2.5">
            <div className="text-lg font-extrabold text-[#4ADE80] tabular-nums">
              {pendingPaymentsCount}
            </div>
            <div className="text-[10px] font-bold text-emerald-100">
              Pending Pay
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <div className="text-lg font-extrabold text-white tabular-nums">
              {chats.length}
            </div>
            <div className="text-[10px] font-bold text-emerald-100">Chats</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <div className="text-lg font-extrabold text-[#4ADE80] tabular-nums">
              {paidMembersList.length}
            </div>
            <div className="text-[10px] font-bold text-emerald-100">
              Paid Members
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <div className="text-lg font-extrabold text-amber-300 tabular-nums">
              {freeUsersList.length}
            </div>
            <div className="text-[10px] font-bold text-emerald-100">
              Free Users
            </div>
          </div>
        </div>
      </div>

      {adminStatusMsg && (
        <div className="bg-[#15803D] text-white rounded-2xl p-3.5 text-xs font-extrabold shadow-sm">
          {adminStatusMsg}
        </div>
      )}

      {/* 6 Backend Control Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-white p-1.5 rounded-2xl border border-emerald-200 shadow-2xs">
        {(
          [
            { id: 'requests', label: `Payments (${paymentRequests.length})` },
            { id: 'chats', label: `Chats (${chats.length})` },
            { id: 'users', label: `Users (${users.length})` },
            { id: 'jobs', label: `Jobs (${jobs.length})` },
            { id: 'scholarships', label: `Grants (${scholarships.length})` },
            { id: 'trainings', label: `Trainings (${trainings.length})` }
          ] as { id: AdminTabType; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setAdminTab(t.id)}
            className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition-colors cursor-pointer ${
              adminTab === t.id
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'text-[#0D2E1B] hover:bg-emerald-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ==================== TAB 1: PAYMENTS RECEIVED & MEMBERSHIP REQUESTS ==================== */}
      {adminTab === 'requests' && (
        <div className="space-y-3">
          <div className="bg-white border border-emerald-200 rounded-[22px] p-4 text-xs space-y-1">
            <div className="font-extrabold text-[#0D2E1B] text-sm">
              Payments Received &amp; Paid Membership Verification
            </div>
            <p className="text-gray-600 leading-relaxed">
              When a user creates their profile and sends payment, their request
              appears below. Click <strong>Verify Payment &amp; Grant Access</strong>{' '}
              to unlock their Paid account and publish their profile in Communities.
            </p>
          </div>

          {paymentRequests.length === 0 ? (
            <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center text-xs text-gray-500">
              No payment requests received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {paymentRequests.map((reqItem) => (
                <div
                  key={reqItem.id}
                  className="bg-white border-[1.5px] border-[#B8D3BE] rounded-[24px] p-4 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-[#0D2E1B]">
                          {reqItem.userName}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            reqItem.status === 'verified'
                              ? 'bg-[#DCFCE7] text-[#15803D]'
                              : reqItem.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {reqItem.status === 'verified'
                            ? 'Payment Verified ✓'
                            : reqItem.status === 'rejected'
                            ? 'Rejected'
                            : 'Pending Verification'}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium mt-0.5">
                        {reqItem.currentRole || 'Food Specialist'} •{' '}
                        {reqItem.qualification || 'Food Science'}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {reqItem.userEmail} • {reqItem.userPhone}
                      </p>
                    </div>
                    <span className="text-[10.5px] font-bold text-gray-400 shrink-0">
                      {reqItem.submittedAt}
                    </span>
                  </div>

                  {/* Payment Receipt Box */}
                  <div className="bg-[#F2F7F3] border border-emerald-200 rounded-2xl p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-600">
                        Method &amp; Amount:
                      </span>
                      <span className="font-extrabold text-[#0D2E1B]">
                        {reqItem.paymentMethod} • {reqItem.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-600">
                        Transaction ID (TID):
                      </span>
                      <span className="font-mono font-extrabold text-[#15803D]">
                        {reqItem.transactionId}
                      </span>
                    </div>
                    {reqItem.notes && (
                      <p className="text-[11px] text-gray-600 pt-1 border-t border-emerald-100">
                        Note: &ldquo;{reqItem.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Admin Verification Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onVerifyPaymentRequest(reqItem, true);
                        notify(
                          `Payment verified for ${reqItem.userName}! Added to Paid Members & Communities directory.`
                        );
                      }}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        reqItem.status === 'verified'
                          ? 'bg-[#DCFCE7] text-[#15803D] border border-[#16A34A]'
                          : 'bg-[#15803D] hover:bg-[#0D2E1B] text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {reqItem.status === 'verified'
                          ? 'Verified & Added to Communities ✓'
                          : 'Verify Payment & Grant Paid Access'}
                      </span>
                    </button>

                    {reqItem.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => {
                          onVerifyPaymentRequest(reqItem, false);
                          notify(
                            `Payment request for ${reqItem.userName} marked as unverified/free.`
                          );
                        }}
                        className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs cursor-pointer"
                      >
                        Reject / Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: CHATS & HIRING INQUIRIES ==================== */}
      {adminTab === 'chats' && (
        <div className="space-y-3">
          <div className="bg-white border border-emerald-200 rounded-[22px] p-4 text-xs space-y-1">
            <div className="font-extrabold text-[#0D2E1B] text-sm">
              User Support Chats &amp; Hiring Inquiries
            </div>
            <p className="text-gray-600">
              All messages sent by users to Admin Support or to Community Members for
              hiring appear here. You can reply directly to any conversation.
            </p>
          </div>

          {chats.length === 0 ? (
            <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center text-xs text-gray-500">
              No chats recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {chats.map((chatItem) => (
                <div
                  key={chatItem.id}
                  className="bg-white border-[1.5px] border-[#B8D3BE] rounded-[24px] p-4 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-[#0D2E1B] text-sm">
                          {chatItem.senderName}
                        </span>
                        <span className="text-gray-400">&rarr;</span>
                        <span className="font-bold text-[#15803D]">
                          {chatItem.recipientName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            chatItem.chatType === 'hiring_contact'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {chatItem.chatType === 'hiring_contact'
                            ? 'Hiring Contact'
                            : 'Admin Support'}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        WhatsApp / Phone: {chatItem.senderPhone} • {chatItem.createdAt}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteChat(chatItem.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F2F7F3] text-gray-900 font-medium leading-relaxed">
                    {chatItem.message}
                  </div>

                  {chatItem.adminReply && (
                    <div className="p-3 rounded-2xl bg-[#DCFCE7] border border-emerald-200 text-[#0D2E1B] font-bold">
                      Admin Reply: {chatItem.adminReply}
                    </div>
                  )}

                  {/* Admin Reply Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write Admin reply to this user..."
                      value={replyInputs[chatItem.id] || ''}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({
                          ...prev,
                          [chatItem.id]: e.target.value
                        }))
                      }
                      className="flex-1 px-3 py-2 rounded-xl bg-[#EAF3EC] border border-[#AECBB5] text-xs font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const txt = (replyInputs[chatItem.id] || '').trim();
                        if (!txt) return;
                        onReplyChat(chatItem, txt);
                        setReplyInputs((prev) => ({ ...prev, [chatItem.id]: '' }));
                        notify(`Reply sent to ${chatItem.senderName}!`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#15803D] text-white font-extrabold cursor-pointer shrink-0"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: PREMIUM (PAID) & FREE USERS DATABASE RECORD ==================== */}
      {adminTab === 'users' && (
        <div className="space-y-3">
          <div className="bg-white border border-emerald-200 rounded-[22px] p-4 text-xs space-y-2.5">
            <div>
              <div className="font-extrabold text-[#0D2E1B] text-sm">
                Premium (Paid) &amp; Free Users Database Record
              </div>
              <p className="text-gray-500 mt-0.5">
                Complete backend record of all <strong>Premium Paid Members</strong>{' '}
                (visible in Communities) and <strong>Free Users</strong> (stored in
                backend until payment is verified).
              </p>
            </div>

            {/* Filter Pills: All | Paid Members | Free Users */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#EAF3EC] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setUserRecordFilter('all')}
                className={`py-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer ${
                  userRecordFilter === 'all'
                    ? 'bg-[#0D2E1B] text-white'
                    : 'text-[#0D2E1B]'
                }`}
              >
                All ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setUserRecordFilter('paid')}
                className={`py-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer ${
                  userRecordFilter === 'paid'
                    ? 'bg-[#15803D] text-white'
                    : 'text-[#0D2E1B]'
                }`}
              >
                Paid ({paidMembersList.length})
              </button>
              <button
                type="button"
                onClick={() => setUserRecordFilter('free')}
                className={`py-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer ${
                  userRecordFilter === 'free'
                    ? 'bg-amber-600 text-white'
                    : 'text-[#0D2E1B]'
                }`}
              >
                Free ({freeUsersList.length})
              </button>
            </div>
          </div>

          {displayedUsersRecord.length === 0 ? (
            <div className="bg-white border border-emerald-200 rounded-2xl p-5 text-center text-xs text-gray-500">
              No user records match this filter.
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedUsersRecord.map((u) => (
                <div
                  key={u.uid}
                  className="bg-white border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-[#0D2E1B] truncate">
                        {u.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9.5px] font-extrabold ${
                          u.isPaid
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {u.isPaid ? 'PAID MEMBER' : 'FREE USER'}
                      </span>
                    </div>
                    <div className="text-gray-600 truncate font-medium">
                      {u.currentRole} • {u.qualification}
                    </div>
                    <div className="text-gray-400 text-[11px] truncate">
                      {u.email} • {u.phone} •{' '}
                      {u.privacySettings?.hireMe_public ? 'Hire Me ON' : 'Standard'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onToggleUserPaid(u);
                        notify(
                          !u.isPaid
                            ? `${u.name} upgraded to Paid Member (Added to Communities)!`
                            : `${u.name} moved to Free User record (Removed from Communities).`
                        );
                      }}
                      className={`px-3 py-1.5 rounded-xl font-extrabold cursor-pointer ${
                        u.isPaid
                          ? 'bg-[#15803D] text-white'
                          : 'bg-gray-100 hover:bg-emerald-50 text-[#0D2E1B] border border-emerald-300'
                      }`}
                    >
                      {u.isPaid ? 'Paid (In Communities) ✓' : 'Approve Paid'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteUser(u.uid)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MANAGE JOBS */}
      {adminTab === 'jobs' && (
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!jTitle.trim() || !jCompany.trim()) return;
              onSaveJob({
                id: editingJobId || `job-${Date.now()}`,
                title: jTitle.trim(),
                company: jCompany.trim(),
                location: jLoc.trim(),
                experienceRequired: jExp.trim(),
                category: jCat,
                description: jDesc.trim(),
                requirements: jReqs.trim(),
                applyLink: jLink.trim() || 'https://foodspecialists.org',
                tags: jTags
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                postedAt: 'Just now',
                expiryAt: '2026-12-30',
                isActive: true
              });
              notify(editingJobId ? 'Job updated!' : 'New job published!');
              setEditingJobId(null);
              setJTitle('');
              setJCompany('');
              setJDesc('');
              setJReqs('');
            }}
            className="bg-white border border-emerald-200 rounded-[24px] p-4 space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-gray-900">
              {editingJobId ? 'Edit Job' : 'Add New Job'}
            </h3>
            <input
              type="text"
              required
              placeholder="Job Title"
              value={jTitle}
              onChange={(e) => setJTitle(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Company"
                value={jCompany}
                onChange={(e) => setJCompany(e.target.value)}
                className="px-3 py-2 border border-emerald-200 rounded-xl"
              />
              <select
                value={jCat}
                onChange={(e) => setJCat(e.target.value as JobCategory)}
                className="px-3 py-2 border border-emerald-200 rounded-xl bg-white"
              >
                <option value="Quality & Safety">Quality &amp; Safety</option>
                <option value="R&D Lab">R&amp;D Lab</option>
                <option value="Production">Production</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Location"
                value={jLoc}
                onChange={(e) => setJLoc(e.target.value)}
                className="px-3 py-2 border border-emerald-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="Experience Required"
                value={jExp}
                onChange={(e) => setJExp(e.target.value)}
                className="px-3 py-2 border border-emerald-200 rounded-xl"
              />
            </div>
            <input
              type="text"
              placeholder="Tags (comma-separated: HACCP, FSSC 22000)"
              value={jTags}
              onChange={(e) => setJTags(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <textarea
              rows={2}
              placeholder="Job Description"
              value={jDesc}
              onChange={(e) => setJDesc(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <textarea
              rows={2}
              placeholder="Requirements"
              value={jReqs}
              onChange={(e) => setJReqs(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <input
              type="text"
              placeholder="Apply Link URL"
              value={jLink}
              onChange={(e) => setJLink(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#16A34A] text-white font-bold cursor-pointer"
            >
              {editingJobId ? 'Update Job' : 'Publish Job'}
            </button>
          </form>

          <div className="space-y-2">
            {jobs.map((j) => (
              <div
                key={j.id}
                className="bg-white border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs"
              >
                <div className="truncate">
                  <div className="font-bold text-gray-900 truncate">{j.title}</div>
                  <div className="text-gray-500">
                    {j.company} • {j.category}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingJobId(j.id);
                      setJTitle(j.title);
                      setJCompany(j.company);
                      setJLoc(j.location);
                      setJExp(j.experienceRequired);
                      setJCat(j.category);
                      setJTags(j.tags.join(', '));
                      setJDesc(j.description);
                      setJReqs(j.requirements);
                      setJLink(j.applyLink);
                    }}
                    className="p-1.5 rounded-lg bg-gray-100 text-gray-700"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteJob(j.id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANAGE SCHOLARSHIPS */}
      {adminTab === 'scholarships' && (
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!sTitle.trim() || !sOrg.trim()) return;
              onSaveScholarship({
                id: editingSchId || `sch-${Date.now()}`,
                title: sTitle.trim(),
                organization: sOrg.trim(),
                country: sCountry.trim(),
                deadline: sDeadline,
                fundingType: sFunding,
                degreeLevel: sDegree.trim(),
                description: sDesc.trim(),
                eligibility: sElig.trim(),
                applyLink: sLink.trim() || 'https://',
                isActive: true
              });
              notify(
                editingSchId ? 'Scholarship updated!' : 'New scholarship published!'
              );
              setEditingSchId(null);
              setSTitle('');
              setSOrg('');
              setSDesc('');
              setSElig('');
            }}
            className="bg-white border border-emerald-200 rounded-[24px] p-4 space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-gray-900">
              {editingSchId ? 'Edit Scholarship' : 'Add New Scholarship'}
            </h3>
            <input
              type="text"
              required
              placeholder="Scholarship Title"
              value={sTitle}
              onChange={(e) => setSTitle(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <input
              type="text"
              required
              placeholder="Organization / University"
              value={sOrg}
              onChange={(e) => setSOrg(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Country"
                value={sCountry}
                onChange={(e) => setSCountry(e.target.value)}
                className="px-3 py-2 border border-emerald-200 rounded-xl"
              />
              <input
                type="date"
                value={sDeadline}
                onChange={(e) => setSDeadline(e.target.value)}
                className="px-3 py-2 border border-emerald-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={sFunding}
                onChange={(e) =>
                  setSFunding(
                    e.target.value as 'Fellowships' | 'International' | 'Grants'
                  )
                }
                className="px-3 py-2 border border-emerald-200 rounded-xl bg-white"
              >
                <option value="Fellowships">Fellowships</option>
                <option value="International">International</option>
                <option value="Grants">Grants</option>
              </select>
              <input
                type="text"
                placeholder="Degree Level (MS / PhD)"
                value={sDegree}
                onChange={(e) => setSDegree(e.target.value)}
                className="px-3 py-2 border border-emerald-200 rounded-xl"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Description"
              value={sDesc}
              onChange={(e) => setSDesc(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <textarea
              rows={2}
              placeholder="Eligibility"
              value={sElig}
              onChange={(e) => setSElig(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <input
              type="text"
              placeholder="Apply Link URL"
              value={sLink}
              onChange={(e) => setSLink(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#16A34A] text-white font-bold cursor-pointer"
            >
              {editingSchId ? 'Update Scholarship' : 'Publish Scholarship'}
            </button>
          </form>

          <div className="space-y-2">
            {scholarships.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs"
              >
                <div className="truncate">
                  <div className="font-bold text-gray-900 truncate">{s.title}</div>
                  <div className="text-gray-500">
                    {s.country} • {s.deadline}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSchId(s.id);
                      setSTitle(s.title);
                      setSOrg(s.organization);
                      setSCountry(s.country);
                      setSDeadline(s.deadline);
                      setSFunding(s.fundingType);
                      setSDegree(s.degreeLevel);
                      setSDesc(s.description);
                      setSElig(s.eligibility);
                      setSLink(s.applyLink);
                    }}
                    className="p-1.5 rounded-lg bg-gray-100 text-gray-700"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteScholarship(s.id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANAGE TRAININGS */}
      {adminTab === 'trainings' && (
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!tTitle.trim()) return;
              onSaveTraining({
                id: editingTrId || `tr-${Date.now()}`,
                category: tCategory,
                title: tTitle.trim(),
                subType:
                  tCategory === 'Lead Auditor'
                    ? tSubType || 'Exemplar Global'
                    : null,
                description: tDesc.trim(),
                duration: tDuration.trim(),
                fees: tFees.trim(),
                enrollLink: tEnroll.trim(),
                isActive: true
              });
              notify(editingTrId ? 'Training updated!' : 'New training added!');
              setEditingTrId(null);
            }}
            className="bg-white border border-emerald-200 rounded-[24px] p-4 space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-gray-900">
              {editingTrId ? 'Edit Training' : 'Add New Training'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={tCategory}
                onChange={(e) =>
                  setTCategory(e.target.value as 'Highfield' | 'Lead Auditor')
                }
                className="px-3 py-2 border border-emerald-200 rounded-xl bg-white"
              >
                <option value="Highfield">Highfield</option>
                <option value="Lead Auditor">Lead Auditor</option>
              </select>
              <select
                value={tSubType}
                onChange={(e) =>
                  setTSubType(
                    e.target.value as '' | 'Exemplar Global' | 'IRCA | CQI'
                  )
                }
                className="px-3 py-2 border border-emerald-200 rounded-xl bg-white"
              >
                <option value="">None (Highfield)</option>
                <option value="Exemplar Global">Exemplar Global</option>
                <option value="IRCA | CQI">IRCA | CQI</option>
              </select>
            </div>
            <input
              type="text"
              required
              placeholder="Title (e.g. HACCP Level 3 or FSSC 22000)"
              value={tTitle}
              onChange={(e) => setTTitle(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Duration"
                value={tDuration}
                onChange={(e) => setTDuration(e.target.value)}
                className="px-3 py-2 border border-emerald-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="Fees"
                value={tFees}
                onChange={(e) => setTFees(e.target.value)}
                className="px-3 py-2 border border-emerald-200 rounded-xl"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Description"
              value={tDesc}
              onChange={(e) => setTDesc(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <input
              type="text"
              placeholder="WhatsApp Enroll Link"
              value={tEnroll}
              onChange={(e) => setTEnroll(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-xl"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#16A34A] text-white font-bold cursor-pointer"
            >
              {editingTrId ? 'Update Training' : 'Publish Training'}
            </button>
          </form>

          <div className="space-y-2">
            {trainings.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs"
              >
                <div className="truncate">
                  <div className="font-bold text-gray-900 truncate">
                    {t.title} {t.subType ? `(${t.subType})` : ''}
                  </div>
                  <div className="text-gray-500">
                    {t.category} • {t.fees}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTrId(t.id);
                      setTCategory(t.category);
                      setTTitle(t.title);
                      setTSubType(t.subType || '');
                      setTDuration(t.duration);
                      setTFees(t.fees);
                      setTDesc(t.description);
                      setTEnroll(t.enrollLink);
                    }}
                    className="p-1.5 rounded-lg bg-gray-100 text-gray-700"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTraining(t.id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
