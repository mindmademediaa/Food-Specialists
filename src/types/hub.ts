export interface PrivacySettings {
  qualification_public: boolean;
  experience_public: boolean;
  currentRole_public: boolean;
  location_public: boolean;
  email_public: boolean;
  phone_public: boolean;
  hireMe_public?: boolean;
}

export type PaymentVerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';

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
  paymentStatus?: PaymentVerificationStatus;
  paymentMethod?: string;
  paymentReference?: string;
  paymentAmount?: string;
}

export interface HubPaymentRequest {
  id: string;
  uid: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  qualification: string;
  currentRole: string;
  paymentMethod: 'EasyPaisa' | 'JazzCash' | 'Bank Transfer';
  transactionId: string;
  amount: string;
  notes: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}

export interface HubChatMessage {
  id: string;
  senderUid: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  chatType: 'admin_support' | 'hiring_contact';
  message: string;
  adminReply?: string;
  createdAt: string;
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
