export interface PrivacySettings {
  qualification_public: boolean;
  experience_public: boolean;
  currentRole_public: boolean;
  location_public: boolean;
  email_public: boolean;
  phone_public: boolean;
  hireMe_public?: boolean;
}

export interface HubUser {
  uid: string;
  name: string;
  profilePicUrl: string;
  qualification: string;
  experience: string;
  currentRole: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  skills: string[];
  cvUrl: string;
  privacySettings: PrivacySettings;
  createdAt: string;
  isAdmin: boolean;
  isPaid?: boolean;
}

export type JobCategory = 'Production' | 'R&D Lab' | 'Quality & Safety';

export interface HubJob {
  id: string;
  title: string;
  company: string;
  location: string;
  experienceRequired: string;
  category: JobCategory;
  description: string;
  requirements: string;
  applyLink: string;
  tags: string[];
  postedAt: string;
  expiryAt: string;
  isActive: boolean;
}

export interface HubScholarship {
  id: string;
  title: string;
  organization: string;
  country: string;
  deadline: string;
  fundingType: 'Fellowships' | 'International' | 'Grants';
  degreeLevel: string;
  description: string;
  eligibility: string;
  applyLink: string;
  isActive: boolean;
}

export interface HubTraining {
  id: string;
  category: 'Highfield' | 'Lead Auditor';
  title: string;
  standardCode?: string;
  subType: null | 'Exemplar Global' | 'IRCA | CQI';
  description: string;
  duration: string;
  fees: string;
  enrollLink: string;
  isActive: boolean;
}

export type NavTab = 'home' | 'search' | 'communities' | 'trainings' | 'profile' | 'admin';
