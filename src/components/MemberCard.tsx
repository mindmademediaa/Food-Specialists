import React from 'react';
import {
  MapPin,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Lock,
  Mail,
  MessageCircle
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
  viewerIsPremium?: boolean,
  isOwnerOrAdmin?: boolean,
  isNameOrTitle?: boolean
): boolean {
  if (isOwnerOrAdmin) return true;
  const level: VisibilityLevel = vis || 'public';
  if (level === 'private') return false;
  if (isNameOrTitle) return true;
  return Boolean(viewerIsPremium);
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  viewerIsPremium = false,
  viewerUid,
  onClick
}) => {
  const isOwner = Boolean(viewerUid && viewerUid === member.uid);
  const ownerIsPremium = Boolean(member.isPremium || member.isPaid);
  const vis = member.visibility;

  const canSeeName = canViewerSeeField(vis?.name ?? 'public', viewerIsPremium, isOwner, true);
  const canSeeTitle = canViewerSeeField(
    vis?.title ?? (member.privacySettings?.currentRole_public === false ? 'private' : 'public'),
    viewerIsPremium,
    isOwner,
    true
  );
  const canSeeCompany = canViewerSeeField(
    vis?.company ?? 'public',
    viewerIsPremium,
    isOwner,
    false
  );
  const canSeeLocation = canViewerSeeField(
    vis?.location ?? (member.privacySettings?.location_public === false ? 'private' : 'public'),
    viewerIsPremium,
    isOwner,
    false
  );
  const canSeeBio = canViewerSeeField(
    vis?.bio ?? 'public',
    viewerIsPremium,
    isOwner,
    false
  );
  const canSeeLinkedin = canViewerSeeField(
    vis?.linkedin ?? 'public',
    viewerIsPremium,
    isOwner,
    false
  );
  const canSeeCv = canViewerSeeField(
    vis?.cv ?? 'public',
    viewerIsPremium,
    isOwner,
    false
  );

  // Contact & full profile details can ONLY be published by Paid Members,
  // and are STRICTLY HIDDEN from General Visitors & Free Users (only Paid viewers or owner can see them).
  const viewerCanAccessContact = Boolean(viewerIsPremium || isOwner);
  const ownerAllowsWhatsapp =
    ownerIsPremium &&
    (vis?.whatsapp ?? vis?.contact ?? 'public') !== 'private' &&
    member.privacySettings?.whatsapp_public !== false &&
    member.privacySettings?.phone_public !== false;
  const ownerAllowsEmail =
    ownerIsPremium &&
    (vis?.email ?? vis?.contact ?? 'public') !== 'private' &&
    member.privacySettings?.email_public !== false;

  const rawWhatsapp = (member.whatsappNumber || member.phone || '').trim();
  const cleanWhatsappDigits = rawWhatsapp.replace(/[^\d]/g, '');
  const rawEmail = (member.email || '').trim();

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
      className="bg-white border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2.5"
    >
      <div className="flex items-start gap-3">
        {/* Avatar with Premium Shield Indicator */}
        <div className="relative shrink-0">
          <img
            src={displayPhoto || makeAvatarSvg(initials, '#E1EEF9', '#105E9A')}
            alt={displayName}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = makeAvatarSvg(
                initials,
                '#E1EEF9',
                '#105E9A'
              );
            }}
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full object-cover border-2 border-[#1673B8] bg-[#F0F6FC] shadow-2xs"
          />
          {(member.isPremium || member.isPaid) && (
            <span
              title="Premium Verified Member"
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1673B8] border-2 border-white text-white flex items-center justify-center shadow-2xs"
            >
              <ShieldCheck className="w-3 h-3" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 min-w-0">
              <h3 className="text-[14px] sm:text-[15px] font-extrabold text-[#1A2138] leading-snug break-words">
                {displayName}
              </h3>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
            </div>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F0F6FC] border border-[#1673B8]/30 text-[#1673B8] text-[9.5px] sm:text-[10px] font-extrabold shrink-0">
              <Sparkles className="w-2.5 h-2.5 text-[#1673B8]" />
              <span>Premium</span>
            </span>
          </div>

          {/* Title & Company */}
          {(canSeeTitle && displayTitle) || (canSeeCompany && member.company) ? (
            <div className="flex items-start gap-1.5 text-[11.5px] sm:text-[12px] text-slate-700 font-semibold leading-snug">
              <Briefcase className="w-3.5 h-3.5 text-[#1673B8] shrink-0 mt-0.5" />
              <span className="break-words">
                {canSeeTitle && displayTitle ? displayTitle : ''}
                {canSeeTitle && displayTitle && canSeeCompany && member.company
                  ? ' • '
                  : ''}
                {canSeeCompany && member.company ? member.company : ''}
              </span>
            </div>
          ) : null}

          {/* Location */}
          {canSeeLocation && member.location && (
            <div className="flex items-start gap-1.5 text-[11px] text-slate-500 font-medium leading-snug">
              <MapPin className="w-3.5 h-3.5 text-[#1673B8] shrink-0 mt-0.5" />
              <span className="break-words">{member.location}</span>
            </div>
          )}

          {/* Bio snippet */}
          {canSeeBio && member.bio && (
            <p className="text-[11px] text-slate-600 pt-0.5 leading-relaxed break-words line-clamp-2">
              {member.bio}
            </p>
          )}
        </div>
      </div>

      {/* Contact Row: Shown ONLY to Paid Premium Viewers (Hidden from Free Users) */}
      {viewerCanAccessContact ? (
        (ownerAllowsWhatsapp && rawWhatsapp) || (ownerAllowsEmail && rawEmail) ? (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {ownerAllowsWhatsapp && rawWhatsapp && (
              <a
                href={
                  cleanWhatsappDigits
                    ? `https://wa.me/${cleanWhatsappDigits}`
                    : `tel:${rawWhatsapp}`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Chat on WhatsApp"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10.5px] font-extrabold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/15 shrink-0" />
                <span>{rawWhatsapp}</span>
              </a>
            )}
            {ownerAllowsEmail && rawEmail && (
              <a
                href={`mailto:${rawEmail}`}
                onClick={(e) => e.stopPropagation()}
                title="Send Email"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#D2DEEA] text-[#1A2138] text-[10.5px] font-bold transition-colors truncate max-w-[220px]"
              >
                <Mail className="w-3 h-3 text-[#1673B8] shrink-0" />
                <span className="truncate">{rawEmail}</span>
              </a>
            )}
          </div>
        ) : null
      ) : (
        <div className="flex items-center gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold">
            <Lock className="w-3 h-3 text-slate-500 shrink-0" />
            <span>Full Profile &amp; Contact Visible to Paid Members Only</span>
          </span>
        </div>
      )}

      {/* Bottom Row: Hire Me / LinkedIn / CV Indicator + View Profile Button */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {viewerCanAccessContact && hireMeActive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10px] font-extrabold">
              <span>Available for Hire</span>
            </span>
          )}

          {canSeeLinkedin && linkedinHref && viewerCanAccessContact && (
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Open LinkedIn Profile"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#D2DEEA] text-[#1673B8] text-[10px] font-extrabold transition-colors"
            >
              <span className="w-3.5 h-3.5 rounded-[3px] bg-[#1673B8] text-white font-black text-[9px] flex items-center justify-center leading-none">
                in
              </span>
              <span>LinkedIn</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}

          {canSeeCv && (member.cvUrl || member.cvFileName) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-extrabold">
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
          className="px-3 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-[11px] font-extrabold inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
