export type OpportunityCategory = 'food-safety' | 'food-quality' | 'scholarship';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  compensation: string;
  postedDate: string;
  deadline: string;
  category: OpportunityCategory;
  subCategory: string;
  employmentType: string;
  description: string;
  requirements: string[];
  applicationUrl: string;
}

export interface AppliedJobRecord {
  jobId: string;
  appliedAt: string;
  notes?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  graduationYear: string;
  cgpa: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  sector: string;
  duration: string;
  responsibilities: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  year: string;
  outcomes: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingBody: string;
  year: string;
  credentialId: string;
}

export interface UserProfile {
  avatarUrl: string;
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}

export type CvTemplateId = 'modern-clean' | 'ats-standard' | 'executive-specialist';

export type TaskHorizon = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface ComplianceTask {
  id: string;
  title: string;
  category: string;
  horizon: TaskHorizon;
  dueDate: string;
  dueTime: string;
  priority: TaskPriority;
  completed: boolean;
  notes?: string;
}

export type ObjectiveType = 'training' | 'certification' | 'promotion' | 'education';
export type ObjectiveStatus = 'planned' | 'in-progress' | 'achieved';

export interface CareerObjective {
  id: string;
  year: number;
  targetQuarter: string;
  type: ObjectiveType;
  title: string;
  providerOrTarget: string;
  status: ObjectiveStatus;
  notes: string;
}

export type MainNavTab = 'opportunities' | 'alerts' | 'roadmap' | 'profile' | 'admin';
