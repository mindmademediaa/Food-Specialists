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
  viewerIsPremium: boolean,
  isOwnerOrAdmin: boolean
): boolean {
  if (isOwnerOrAdmin) return true;
  const level: VisibilityLevel = vis || 'public';
  if (level === 'private') return false;
  if (level === 'premium') return viewerIsPremium;
  return true;
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
    vis?.company ?? 'premium',
    viewerIsPremium,
    isOwner
  );
  const canSeeLocation = canViewerSeeField(
    vis?.location ?? (member.privacySettings?.location_public === false ? 'private' : 'public'),
    viewerIsPremium,
    isOwner
  );
  const canSeeLinkedin = canViewerSeeField(
    vis?.linkedin ?? 'premium',
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
      className="bg-white border-[1.5px] border-[#C8E2CE] hover:border-[#1E8E49] rounded-[24px] p-4 sm:p-5 shadow-[0_6px_20px_rgba(22,163,74,0.06)] hover:shadow-md transition-all cursor-pointer space-y-3"
    >
      <div className="flex items-start gap-3.5">
        {/* Avatar with Premium Shield Indicator */}
        <div className="relative shrink-0">
          <img
            src={displayPhoto || makeAvatarSvg(initials)}
            alt={displayName}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = makeAvatarSvg(initials);
            }}
            className="w-[64px] h-[64px] rounded-full object-cover border-2 border-[#1E8E49] bg-[#F0FDF4] shadow-xs"
          />
          {(member.isPremium || member.isPaid) && (
            <span
              title="Premium Verified Member"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#15803D] border-2 border-white text-white flex items-center justify-center shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-[18px] font-extrabold text-[#0D2E1B] leading-tight truncate">
                {displayName}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-[#229A54] shrink-0" />
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4B7F52] border border-[#D4AF37]/70 text-white text-[10.5px] font-extrabold shrink-0">
              <Sparkles className="w-3 h-3 text-[#FBBF24]" />
              <span>Premium Member</span>
            </span>
          </div>

          {/* Title & Company (filtered by field visibility) */}
          {(canSeeTitle && displayTitle) || (canSeeCompany && member.company) ? (
            <div className="flex items-center gap-1.5 text-[13.5px] text-gray-800 font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-[#1E8E49] shrink-0" />
              <span className="truncate">
                {canSeeTitle && displayTitle ? displayTitle : ''}
                {canSeeTitle && displayTitle && canSeeCompany && member.company
                  ? ' • '
                  : ''}
                {canSeeCompany && member.company ? member.company : ''}
              </span>
            </div>
          ) : null}

          {/* Location (filtered by field visibility) */}
          {canSeeLocation && member.location && (
            <div className="flex items-center gap-1.5 text-[12.5px] text-gray-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#1E8E49] shrink-0" />
              <span className="truncate">{member.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Hire Me / LinkedIn Icon (if allowed) + View Profile Button */}
      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-emerald-100/90">
        <div className="flex items-center gap-2">
          {hireMeActive && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-extrabold">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-[#0A66C2] text-[11.5px] font-extrabold transition-colors"
            >
              <span className="w-4 h-4 rounded-[3px] bg-[#0A66C2] text-white font-black text-[10px] flex items-center justify-center leading-none">
                in
              </span>
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick(member);
          }}
          className="px-4 py-2 rounded-full bg-[#1E8E49] hover:bg-[#156B36] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

