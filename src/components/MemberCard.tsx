import React from 'react';
import {
  MapPin,
  Briefcase,
  CheckCircle2,
  Lock,
  Globe,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { HubUser } from '../types/hub';
import { makeAvatarSvg } from '../data/mockHubData';

interface MemberCardProps {
  member: HubUser;
  onClick: (member: HubUser) => void;
  onHireOrContact?: (member: HubUser, e: React.MouseEvent) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onClick,
  onHireOrContact
}) => {
  const ps = member.privacySettings || {
    qualification_public: true,
    experience_public: true,
    currentRole_public: true,
    location_public: true,
    email_public: false,
    phone_public: false,
    hireMe_public: false
  };

  const initials = (member.name || 'FS')
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase();

  const isFullyPublic =
    ps.qualification_public &&
    ps.experience_public &&
    ps.currentRole_public &&
    ps.location_public &&
    (ps.email_public || ps.phone_public);

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
      className="bg-white border-[1.5px] border-[#B8D3BE] hover:border-[#16A34A] rounded-[24px] p-5 shadow-[0_6px_20px_rgba(22,163,74,0.06)] hover:shadow-md transition-all cursor-pointer space-y-3"
    >
      <div className="flex items-start gap-4">
        {/* Profile Pic Circle 68px (Always public) */}
        <img
          src={member.profilePicUrl || makeAvatarSvg(initials)}
          alt={member.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = makeAvatarSvg(initials);
          }}
          className="w-[68px] h-[68px] rounded-full object-cover border-2 border-[#A7D4AF] shrink-0 bg-[#F0FDF4] shadow-xs"
        />

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            {/* Name bold 20px (Always public) */}
            <h3 className="text-[20px] font-extrabold text-[#0D2E1B] leading-tight truncate">
              {member.name}
            </h3>

            {/* Public / Private Indicator */}
            <div className="flex items-center gap-1 text-gray-500 shrink-0">
              {isFullyPublic ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span className="text-[11px] font-medium">Public</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span className="text-[11px] font-medium">Private</span>
                </>
              )}
            </div>
          </div>

          {/* Current Role — ONLY shown if privacySettings.currentRole_public is true */}
          {ps.currentRole_public && member.currentRole && (
            <div className="flex items-center gap-1.5 text-[13.5px] text-gray-800 font-medium">
              <Briefcase className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <span className="truncate">
                {member.currentRole}
                {member.company ? ` • ${member.company}` : ''}
              </span>
            </div>
          )}

          {/* Location — ONLY shown if privacySettings.location_public is true */}
          {ps.location_public && member.location && (
            <div className="flex items-center gap-1.5 text-[13.5px] text-gray-600">
              <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <span className="truncate">{member.location}</span>
            </div>
          )}

          {/* Verified Qualification Pill — ONLY shown if privacySettings.qualification_public is true */}
          {ps.qualification_public && member.qualification && (
            <div className="pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8ECD9] text-[#0D2E1B] text-[12px] font-semibold max-w-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                <span className="truncate">Education • {member.qualification}</span>
              </div>
            </div>
          )}

          {/* Experience Preview — ONLY shown if privacySettings.experience_public is true */}
          {ps.experience_public && member.experience && (
            <p className="text-[12.5px] text-gray-600 line-clamp-2 pt-0.5">
              <span className="font-bold text-[#0D2E1B]">Experience: </span>
              {member.experience}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Row: Hire Me Badge + Contact / Hire Action Button (NO HACCP / Skill Tags!) */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-100/80">
        {ps.hireMe_public ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#16A34A]/40 text-[#15803D] text-[12px] font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hire Me • Open to Work</span>
          </span>
        ) : (
          <span className="text-[11.5px] font-semibold text-gray-500">
            Verified Paid Community Member
          </span>
        )}

        {onHireOrContact && (
          <button
            type="button"
            onClick={(e) => onHireOrContact(member, e)}
            className="px-4 py-1.5 rounded-full bg-[#15803D] hover:bg-[#0D2E1B] text-white text-[12px] font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{ps.hireMe_public ? 'Hire / Contact' : 'Contact Me'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
