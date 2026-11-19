import {
  HubUser,
  VisibilityLevel,
  ProfileVisibilityMap,
  HubEducationItem,
  HubExperienceItem
} from '../types/hub';

export const DEFAULT_VISIBILITY_MAP: ProfileVisibilityMap = {
  name: 'public',
  title: 'public',
  company: 'public',
  location: 'public',
  bio: 'public',
  linkedin: 'public',
  cv: 'public',
  contact: 'public',
  email: 'public',
  whatsapp: 'public',
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
