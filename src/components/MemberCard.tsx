import React from 'react';
import {
  MapPin,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { HubUser, VisibilityLevel } from '../types/hub';
import { makeAvatarSvg } from '../data/mockHubData';

interface MemberCardProps {
  member: HubUser;
  viewerIsPremium?: boolean;
  viewerUid?: string;
  onClick: (member: HubUser) => void;
  onHireOrContact?: (member: HubUser, e: React.MouseEvent) => void;
}

export function canViewerSeeField(
  vis: VisibilityLevel | undefined,
  _viewerIsPremium?: boolean,
  _isOwnerOrAdmin?: boolean
): boolean {
  const level: VisibilityLevel = vis || 'public';
  return level !== 'private';
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  viewerIsPremium = false,
  viewerUid,
  onClick
}) => {
  const isOwner = Boolean(viewerUid && viewerUid === member.uid);
  const vis = member.visibility;

  const canSeeName = canViewerSeeField(vis?.name ?? 'public', viewerIsPremium, isOwner);
  const canSeeTitle = canViewerSeeField(
    vis?.title ?? (member.privacySettings?.currentRole_public === false ? 'private' : 'public'),
    viewerIsPremium,
    isOwner
  );
  const canSeeCompany = canViewerSeeField(
    vis?.company ?? 'public',
    viewerIsPremium,
    isOwner
  );
  const canSeeLocation = canViewerSeeField(
    vis?.location ?? (member.privacySettings?.location_public === false ? 'private' : 'public'),
    viewerIsPremium,
    isOwner
  );
  const canSeeBio = canViewerSeeField(
    vis?.bio ?? 'public',
    viewerIsPremium,
    isOwner
  );
  const canSeeLinkedin = canViewerSeeField(
    vis?.linkedin ?? 'public',
    viewerIsPremium,
    isOwner
  );
  const canSeeCv = canViewerSeeField(
    vis?.cv ?? 'public',
    viewerIsPremium,
    isOwner
  );

  const displayName = canSeeName ? member.name : 'Food Safety Specialist';
  const displayTitle = member.title || member.currentRole || '';
  const displayPhoto = member.profilePhotoUrl || member.profilePicUrl;
  const hireMeActive = Boolean(
    member.hireMe ?? member.privacySettings?.hireMe_public
  );

  const initials = (displayName || 'FS')
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase();

  const linkedinHref =
    member.linkedinUrl && member.linkedinUrl.trim()
      ? member.linkedinUrl.startsWith('http')
        ? member.linkedinUrl.trim()
        : `https://${member.linkedinUrl.trim()}`
      : '';

  return (
    <div
      onClick={() => onClick(member)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(member);
        }
      }}
      className="bg-white border-[1.5px] border-[#C8E2CE] hover:border-[#1E8E49] rounded-[20px] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(22,163,74,0.06)] hover:shadow-md transition-all cursor-pointer space-y-2.5"
    >
      <div className="flex items-start gap-3">
        {/* Avatar with Premium Shield Indicator */}
        <div className="relative shrink-0">
          <img
            src={displayPhoto || makeAvatarSvg(initials)}
            alt={displayName}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = makeAvatarSvg(initials);
            }}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#1E8E49] bg-[#F0FDF4] shadow-xs"
          />
          {(member.isPremium || member.isPaid) && (
            <span
              title="Premium Verified Member"
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#15803D] border-2 border-white text-white flex items-center justify-center shadow-xs"
            >
              <ShieldCheck className="w-3 h-3" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 min-w-0">
              <h3 className="text-[14.5px] sm:text-[16px] font-extrabold text-[#0D2E1B] leading-snug break-words">
                {displayName}
              </h3>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#229A54] shrink-0" />
            </div>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4B7F52] border border-[#D4AF37]/70 text-white text-[9.5px] sm:text-[10px] font-extrabold shrink-0">
              <Sparkles className="w-2.5 h-2.5 text-[#FBBF24]" />
              <span>Premium</span>
            </span>
          </div>

          {/* Title & Company (filtered by field visibility toggle — full text shown) */}
          {(canSeeTitle && displayTitle) || (canSeeCompany && member.company) ? (
            <div className="flex items-start gap-1.5 text-[12px] sm:text-[12.5px] text-gray-800 font-semibold leading-snug">
              <Briefcase className="w-3.5 h-3.5 text-[#1E8E49] shrink-0 mt-0.5" />
              <span className="break-words">
                {canSeeTitle && displayTitle ? displayTitle : ''}
                {canSeeTitle && displayTitle && canSeeCompany && member.company
                  ? ' • '
                  : ''}
                {canSeeCompany && member.company ? member.company : ''}
              </span>
            </div>
          ) : null}

          {/* Location (filtered by field visibility toggle — full text shown) */}
          {canSeeLocation && member.location && (
            <div className="flex items-start gap-1.5 text-[11.5px] text-gray-600 font-medium leading-snug">
              <MapPin className="w-3.5 h-3.5 text-[#1E8E49] shrink-0 mt-0.5" />
              <span className="break-words">{member.location}</span>
            </div>
          )}

          {/* Bio snippet (shown if Bio toggle is ON — full text wrap) */}
          {canSeeBio && member.bio && (
            <p className="text-[11.5px] text-gray-600 pt-0.5 leading-relaxed break-words">
              {member.bio}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Row: Hire Me / LinkedIn / CV Indicator (if toggled ON) + View Profile Button */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-100/90 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {hireMeActive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10.5px] font-extrabold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              <span>Hire Me</span>
            </span>
          )}

          {canSeeLinkedin && linkedinHref && (
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Open LinkedIn Profile"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-[#0A66C2] text-[10.5px] font-extrabold transition-colors"
            >
              <span className="w-3.5 h-3.5 rounded-[3px] bg-[#0A66C2] text-white font-black text-[9px] flex items-center justify-center leading-none">
                in
              </span>
              <span>LinkedIn</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}

          {canSeeCv && (member.cvUrl || member.cvFileName) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-[10.5px] font-extrabold">
              <span>CV Available</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick(member);
          }}
          className="px-3 py-1.5 rounded-full bg-[#1E8E49] hover:bg-[#156B36] text-white text-[11px] font-extrabold inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

