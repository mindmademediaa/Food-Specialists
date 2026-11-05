import React from 'react';
import {
  ChevronLeft,
  MoreHorizontal,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Phone,
  Info,
  ArrowRight,
  Download,
  Lock,
  Briefcase,
  Folder,
  GraduationCap,
  Award,
  Sparkles,
  UserCheck,
  Pencil,
  ExternalLink
} from 'lucide-react';
import {
  HubUser,
  ProfileVisibilityMap,
  VisibilityLevel
} from '../types/hub';
import { makeAvatarSvg } from '../data/mockHubData';
import { canViewerSeeField } from './MemberCard';
import {
  DEFAULT_VISIBILITY_MAP,
  normalizeEducationArray,
  normalizeExperienceArray
} from './EditProfileView';
import { downloadProfessionalCvPdf } from '../lib/cvGenerator';

interface PublicProfileViewProps {
  member: HubUser;
  viewerIsPremium: boolean;
  viewerUid?: string;
  isViewerAdmin?: boolean;
  onBack: () => void;
  onEditOwnProfile?: () => void;
  onMessageOrContact: (member: HubUser, mode: 'message' | 'contact') => void;
  onRequestUpgradeToPremium: () => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  member,
  viewerIsPremium,
  viewerUid,
  isViewerAdmin = false,
  onBack,
  onEditOwnProfile,
  onMessageOrContact,
  onRequestUpgradeToPremium
}) => {
  const isOwner = Boolean(viewerUid && viewerUid === member.uid);
  const isOwnerOrAdmin = isOwner || isViewerAdmin;
  const ownerIsPremium = Boolean(member.isPremium || member.isPaid);

  const vis: ProfileVisibilityMap = {
    ...DEFAULT_VISIBILITY_MAP,
    ...(member.visibility || {})
  };

  // Visibility checks for each section/field
  const canSeeName = canViewerSeeField(
    vis.name,
    viewerIsPremium,
    isOwnerOrAdmin
  );
  const canSeeTitle = canViewerSeeField(
    vis.title,
    viewerIsPremium,
    isOwnerOrAdmin
  );
  const canSeeCompany = canViewerSeeField(
    vis.company,
    viewerIsPremium,
    isOwnerOrAdmin
  );
  const canSeeLocation = canViewerSeeField(
    vis.location,
    viewerIsPremium,
    isOwnerOrAdmin
  );
  const canSeeBio = canViewerSeeField(
    vis.bio,
    viewerIsPremium,
    isOwnerOrAdmin
  );
  const canSeeLinkedin = canViewerSeeField(
    vis.linkedin,
    viewerIsPremium,
    isOwnerOrAdmin
  );
  const canSeeContact = canViewerSeeField(
    vis.contact,
    viewerIsPremium,
    isOwnerOrAdmin
  );
  const canSeeCvField = canViewerSeeField(
    vis.cv,
    viewerIsPremium,
    isOwnerOrAdmin
  );

  // CV Download Rule:
  // If owner toggled CV ON (canSeeCvField) -> show & enable download
  const canDownloadCv = canSeeCvField;

  const displayName = canSeeName ? member.name : 'Food Safety Specialist';
  const displayTitle = member.title || member.currentRole || '';
  const displayAvatar = member.profilePhotoUrl || member.profilePicUrl;
  const hireMeOn = Boolean(
    member.hireMe ?? member.privacySettings?.hireMe_public
  );

  const initials = (displayName || 'FS')
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase();

  const rawLinkedin = (member.linkedinUrl || '').trim();
  const cleanLinkedinDisplay = rawLinkedin
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/\/$/, '');
  const linkedinHref = rawLinkedin
    ? rawLinkedin.startsWith('http')
      ? rawLinkedin
      : `https://${rawLinkedin}`
    : '';

  // Filter dynamic lists by each entry's visibility + section visibility
  const allExperience = normalizeExperienceArray(member);
  const visibleExperience = canViewerSeeField(
    vis.experience,
    viewerIsPremium,
    isOwnerOrAdmin
  )
    ? allExperience.filter((item) =>
        canViewerSeeField(
          item.visibility || vis.experience,
          viewerIsPremium,
          isOwnerOrAdmin
        )
      )
    : [];

  const allEducation = normalizeEducationArray(member);
  const visibleEducation = canViewerSeeField(
    vis.education,
    viewerIsPremium,
    isOwnerOrAdmin
  )
    ? allEducation.filter((item) =>
        canViewerSeeField(
          item.visibility || vis.education,
          viewerIsPremium,
          isOwnerOrAdmin
        )
      )
    : [];

  const allCertifications = member.certifications || [];
  const visibleCertifications = canViewerSeeField(
    vis.certifications,
    viewerIsPremium,
    isOwnerOrAdmin
  )
    ? allCertifications.filter((item) =>
        canViewerSeeField(
          item.visibility || vis.certifications,
          viewerIsPremium,
          isOwnerOrAdmin
        )
      )
    : [];

  const allProjects = member.projects || [];
  const visibleProjects = canViewerSeeField(
    vis.projects,
    viewerIsPremium,
    isOwnerOrAdmin
  )
    ? allProjects.filter((item) =>
        canViewerSeeField(
          item.visibility || vis.projects,
          viewerIsPremium,
          isOwnerOrAdmin
        )
      )
    : [];

  const handleTriggerCvDownload = () => {
    if (!canDownloadCv) {
      onRequestUpgradeToPremium();
      return;
    }
    const fileName =
      member.cvFileName ||
      `${(member.name || 'Specialist').replace(/\s+/g, '_')}_CV.pdf`;

    if (
      member.cvUrl &&
      (member.cvUrl.startsWith('http') || member.cvUrl.startsWith('data:'))
    ) {
      const a = document.createElement('a');
      a.href = member.cvUrl;
      a.download = fileName;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Generate sharp, market-standard PDF CV from visible profile fields
    downloadProfessionalCvPdf(member, { respectVisibility: !isOwner });
  };

  return (
    <div className="bg-[#FAFBF9] border border-[#D5E4D8] rounded-[32px] overflow-hidden shadow-[0_12px_36px_rgba(13,46,27,0.09)] pb-6">
      {/* TOP BAR MATCHING REFERENCE IMAGE 2: < | Profile | ... + Gold Gem */}
      <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#3B8256] transition-colors cursor-pointer"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <h1 className="text-[18px] sm:text-[22px] font-extrabold text-[#14291D] tracking-tight">
          Profile
        </h1>

        <div className="flex items-center gap-2">
          {isOwner && onEditOwnProfile ? (
            <button
              type="button"
              onClick={onEditOwnProfile}
              className="px-3 py-1.5 rounded-full bg-[#EAF5EC] hover:bg-[#D5EAD8] text-[#15803D] text-xs font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          ) : (
            <span className="text-gray-700">
              <MoreHorizontal className="w-5 h-5" />
            </span>
          )}

          {/* Gold-Faceted Gem Badge on top-right matching Reference Image 2 */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FDE68A] via-[#D97706] to-[#78350F] p-0.5 shadow-xs flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FEF3C7]">
              <path d="M6 3h12l4 6-10 12L2 9z" />
            </svg>
          </div>
        </div>
      </div>

      {/* BOTANICAL & SAFETY SHIELD GREEN COVER BANNER + OVERLAPPING AVATAR */}
      <div className="relative">
        <div className="h-36 sm:h-40 w-full bg-gradient-to-r from-[#4E875B] via-[#6AA374] to-[#2F6842] relative overflow-hidden">
          {/* Botanical Leaves & Safety Shield Vector Artwork matching Reference Image 2 */}
          <svg
            viewBox="0 0 600 180"
            className="w-full h-full object-cover opacity-40"
            preserveAspectRatio="none"
          >
            <path
              d="M30 160 C40 90, 110 60, 150 20 C120 90, 90 130, 30 160 Z"
              fill="#2B5B3C"
            />
            <path
              d="M95 165 C115 110, 175 85, 220 55 C195 115, 150 150, 95 165 Z"
              fill="#84BA8E"
            />
            <line
              x1="120"
              y1="170"
              x2="250"
              y2="10"
              stroke="#A7F3D0"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
            <line
              x1="420"
              y1="10"
              x2="560"
              y2="170"
              stroke="#FDE68A"
              strokeWidth="1.2"
              strokeOpacity="0.5"
            />
            <line
              x1="460"
              y1="160"
              x2="580"
              y2="30"
              stroke="#A7F3D0"
              strokeWidth="1.2"
              strokeOpacity="0.5"
            />
            {/* Shield Emblem on Top Right of Banner */}
            <g transform="translate(385, 24)">
              <path
                d="M28 4 L52 14 V32 C52 48 41 60 28 66 C15 60 4 48 4 32 V14 L28 4 Z"
                fill="#86BA90"
                fillOpacity="0.35"
                stroke="#D1FAE5"
                strokeWidth="2.5"
              />
              <path
                d="M19 34 L25 40 L38 26"
                fill="none"
                stroke="#D1FAE5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <circle cx="510" cy="48" r="3" fill="#FDE68A" />
            <circle cx="190" cy="40" r="2.5" fill="#A7F3D0" />
            <circle cx="465" cy="115" r="2.5" fill="#FDE68A" />
          </svg>
        </div>

        {/* Centered Overlapping Circular Avatar + PREMIUM Shield Badge */}
        <div className="flex justify-center -mt-16 relative z-10">
          <div className="relative inline-block">
            <img
              src={displayAvatar || makeAvatarSvg(initials)}
              alt={displayName}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = makeAvatarSvg(initials);
              }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-[5px] border-white shadow-lg bg-[#EBF3ED]"
            />

            {/* Gold & Green "PREMIUM" Shield Badge on Avatar Bottom-Right */}
            {ownerIsPremium && (
              <div
                title="Verified Premium Specialist"
                className="absolute -bottom-1 -right-4 bg-gradient-to-b from-[#498456] to-[#1D5430] border-2 border-[#EAB308] rounded-xl px-2 py-1 shadow-md flex flex-col items-center justify-center"
              >
                <span className="text-[8.5px] font-black tracking-wider text-[#FEF08A] uppercase leading-none">
                  PREMIUM
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IDENTITY & HEADER DETAILS */}
      <div className="px-4 sm:px-6 pt-3 space-y-4">
        <div className="text-center space-y-1.5">
          {/* Name + Verified Green Check */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <h2 className="text-[18px] sm:text-[23px] font-extrabold text-[#14261C] leading-snug break-words">
              {displayName}
            </h2>
            <CheckCircle2 className="w-4.5 h-4.5 text-[#229A54] fill-[#DCFCE7] shrink-0" />
          </div>

          {/* Title • Company */}
          {((canSeeTitle && displayTitle) ||
            (canSeeCompany && member.company)) && (
            <div className="flex items-center justify-center gap-1.5 text-[12.5px] sm:text-[14px] font-semibold text-[#1F2937] flex-wrap leading-snug break-words">
              <UserCheck className="w-4 h-4 text-[#228B4E] shrink-0" />
              <span>
                {canSeeTitle && displayTitle ? displayTitle : ''}
                {canSeeTitle && displayTitle && canSeeCompany && member.company
                  ? ' • '
                  : ''}
                {canSeeCompany && member.company ? member.company : ''}
              </span>
            </div>
          )}

          {/* Location • FS Portal • 500+ connections + [✦ Premium Member] Pill */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap text-[12.5px] font-medium text-gray-600 pt-0.5">
            {canSeeLocation && member.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#228B4E] shrink-0" />
                <span>{member.location}</span>
                <span>•</span>
              </span>
            )}
            <span>FS Portal</span>
            <span>•</span>
            <span>500+ connections</span>

            {ownerIsPremium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#538257] border border-[#D4AF37] text-white text-[11px] font-extrabold shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#FDE047]" />
                <span>Premium Member</span>
              </span>
            )}
          </div>
        </div>

        {/* MESSAGE & CONTACT BUTTONS (SHOWN WHEN OWNER TOGGLES CONTACT ON) */}
        {canSeeContact && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => onMessageOrContact(member, 'message')}
              className="py-3 px-4 rounded-2xl bg-[#278549] hover:bg-[#1D6A39] text-white font-extrabold text-[15px] shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white/20" />
              <span>Message</span>
            </button>

            <button
              type="button"
              onClick={() => onMessageOrContact(member, 'contact')}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-[#F0FDF4] border-[1.5px] border-[#278549] text-[#14261C] font-extrabold text-[15px] shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#278549]" />
              <span>Contact</span>
            </button>
          </div>
        )}

        {/* ABOUT SECTION + HIRE ME INDICATOR */}
        {((canSeeBio && member.bio) || hireMeOn) && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[19px] font-extrabold text-[#14261C]">
                  About
                </h3>
                <Info className="w-4 h-4 text-gray-500" />
              </div>

              {hireMeOn && (
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-extrabold text-[#278549]">
                    Hire Me
                  </span>
                  <span className="w-11 h-6 rounded-full bg-[#278549] p-0.5 flex items-center justify-end">
                    <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                  </span>
                </div>
              )}
            </div>

            {canSeeBio && member.bio && (
              <p className="text-[13.5px] text-gray-800 leading-relaxed font-medium">
                {member.bio}
              </p>
            )}
          </div>
        )}

        {/* LINKEDIN CARD (SHOWN WHEN OWNER TOGGLES LINKEDIN ON) */}
        {rawLinkedin && canSeeLinkedin && (
          <div>
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#F3F5F4] hover:bg-[#EAEFEC] border border-gray-300/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#0A66C2] text-white font-black text-[22px] flex items-center justify-center shrink-0 leading-none shadow-2xs">
                  in
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] sm:text-[15.5px] font-extrabold text-[#14261C]">
                    LinkedIn
                  </div>
                  <div className="text-[11.5px] sm:text-[13px] font-semibold text-[#0A66C2] break-all">
                    {cleanLinkedinDisplay}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#14261C] group-hover:translate-x-0.5 transition-all shrink-0" />
            </a>
          </div>
        )}

        {/* CV VAULT CARD (SHOWN WHEN OWNER TOGGLES CV ON) */}
        {canSeeCvField && (
          <div className="bg-[#FDFBF5] border-[1.5px] border-[#C6A34F] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Gold Shield Icon matching Reference Image 2 */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A] border border-[#D97706]/40 flex items-center justify-center shrink-0 shadow-2xs">
                <svg viewBox="0 0 32 32" className="w-6 h-6">
                  <defs>
                    <linearGradient id="goldShield" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="50%" stopColor="#D97706" />
                      <stop offset="100%" stopColor="#92400E" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M16 3 L27 7.5 V16 C27 22.8 22.2 27.8 16 30 C9.8 27.8 5 22.8 5 16 V7.5 L16 3 Z"
                    fill="url(#goldShield)"
                    stroke="#FEF3C7"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[14px] sm:text-[15.5px] font-extrabold text-[#14261C] leading-snug">
                  CV / Resume (PDF)
                </div>
                <div className="text-[11.5px] sm:text-[12px] font-medium text-gray-700 break-all mt-0.5">
                  {member.cvFileName
                    ? `${member.cvFileName}`
                    : `${displayName.replace(/\s+/g, '_')}_Professional_CV.pdf`}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTriggerCvDownload}
              className="px-3.5 py-2 rounded-xl bg-[#278549] hover:bg-[#1D6A39] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download CV</span>
            </button>
          </div>
        )}

        {/* EXPERIENCE SECTION */}
        {visibleExperience.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#278549]" />
              <h3 className="text-[18px] font-extrabold text-[#14261C]">
                Experience
              </h3>
            </div>

            <div className="space-y-3">
              {visibleExperience.map((exp) => (
                <div
                  key={exp.id}
                  className="pl-1 space-y-0.5 border-b border-gray-200/70 pb-3 last:border-b-0 last:pb-0"
                >
                  <h4 className="text-[15.5px] font-extrabold text-[#14261C]">
                    {exp.jobTitle}
                  </h4>
                  <div className="text-[13px] font-semibold text-gray-800">
                    {exp.company}
                    {exp.startDate
                      ? ` • ${exp.startDate} – ${
                          exp.isPresent ? 'Present' : exp.endDate
                        }`
                      : ''}
                    {exp.location ? ` • ${exp.location}` : ''}
                  </div>
                  {exp.description && (
                    <p className="text-[13px] text-gray-700 leading-relaxed pt-0.5">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION SECTION */}
        {visibleEducation.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#278549]" />
              <h3 className="text-[18px] font-extrabold text-[#14261C]">
                Education
              </h3>
            </div>

            <div className="space-y-2.5">
              {visibleEducation.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-white border border-emerald-100 rounded-2xl p-3.5 space-y-0.5 shadow-2xs"
                >
                  <h4 className="text-[15px] font-extrabold text-[#14261C]">
                    {edu.degree}
                  </h4>
                  <div className="text-[12.5px] font-semibold text-[#278549]">
                    {edu.institute}
                    {edu.startYear || edu.endYear
                      ? ` • ${edu.startYear}${
                          edu.endYear ? ` – ${edu.endYear}` : ''
                        }`
                      : ''}
                  </div>
                  {edu.description && (
                    <p className="text-xs text-gray-600 pt-0.5">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRAININGS SECTION */}
        {visibleCertifications.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#278549]" />
              <h3 className="text-[18px] font-extrabold text-[#14261C]">
                Trainings
              </h3>
            </div>

            <div className="space-y-2">
              {visibleCertifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white border border-emerald-100 rounded-2xl p-3.5 flex items-start justify-between gap-2 shadow-2xs"
                >
                  <div>
                    <h4 className="text-[14.5px] font-extrabold text-[#14261C]">
                      {cert.name}
                    </h4>
                    <div className="text-xs font-semibold text-gray-600 mt-0.5">
                      {cert.issuer}
                      {cert.issueDate ? ` • ${cert.issueDate}` : ''}
                      {cert.credentialId ? ` • ID: ${cert.credentialId}` : ''}
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#278549] shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS SECTION (GREEN CARDS WITH TOP ACCENT BAR MATCHING REFERENCE IMAGE 2) */}
        {visibleProjects.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-[#278549] fill-[#278549]" />
              <h3 className="text-[18px] font-extrabold text-[#14261C]">
                Projects
              </h3>
            </div>

            <div className="space-y-3">
              {visibleProjects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="relative bg-[#D8EFE0] border border-[#BDE0C8] rounded-2xl p-4 overflow-hidden shadow-2xs"
                >
                  {/* Top-left green bar accent matching Reference Image 2 */}
                  <div className="absolute top-0 left-3 w-28 h-1.5 bg-[#4EA86B] rounded-b-full" />

                  <div className="flex items-start gap-3 pt-1">
                    <div className="text-[#1D6A39] shrink-0 mt-0.5">
                      {idx % 2 === 0 ? (
                        <GraduationCap className="w-6 h-6" />
                      ) : (
                        <Folder className="w-6 h-6 fill-[#4EA86B]/40" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-[15.5px] font-extrabold text-[#14261C] leading-snug">
                          {proj.title}
                        </h4>
                        {proj.link && (
                          <a
                            href={
                              proj.link.startsWith('http')
                                ? proj.link
                                : `https://${proj.link}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-extrabold text-[#1D6A39] inline-flex items-center gap-1 hover:underline shrink-0"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-[13px] text-gray-800 leading-relaxed font-medium">
                        {proj.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
