import React from 'react';
import {
  Bookmark,
  Shield,
  FlaskConical,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  Check
} from 'lucide-react';
import { HubJob } from '../types/hub';

interface JobCardProps {
  job: HubJob;
  isApplied?: boolean;
  onToggleApplied?: (jobId: string, e: React.MouseEvent) => void;
  onClick: (job: HubJob) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isApplied = false,
  onToggleApplied,
  onClick
}) => {
  const CategoryBadgeIcon =
    job.category === 'R&D Lab'
      ? FlaskConical
      : job.category === 'Quality & Safety'
      ? Shield
      : Building2;

  return (
    <div
      onClick={() => onClick(job)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(job);
        }
      }}
      className="bg-white border border-[#D4E9DF] hover:border-[#0E9F6E] rounded-[22px] p-5 shadow-[0_6px_22px_rgba(19,66,43,0.06)] hover:shadow-[0_10px_28px_rgba(14,159,110,0.12)] transition-all cursor-pointer space-y-3.5"
    >
      {/* Top Row: Soft Mint Icon Square + Job Title & Company */}
      <div className="flex items-start justify-between gap-3 border-b border-[#ECF4EF] pb-3.5">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-13 h-13 rounded-[15px] bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center shrink-0">
            <CategoryBadgeIcon className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="min-w-0 pt-0.5">
            <h3 className="text-[18.5px] font-extrabold text-[#0F291E] leading-snug">
              {job.title}
            </h3>
            <p className="text-[14px] font-medium text-[#5C7267] mt-0.5 truncate">
              {job.company}
            </p>
          </div>
        </div>

        {onToggleApplied && (
          <button
            type="button"
            title={
              isApplied ? 'Marked as Applied / Saved' : 'Save / Mark Applied'
            }
            onClick={(e) => onToggleApplied(job.id, e)}
            className="p-1.5 rounded-xl text-[#0E9F6E] hover:bg-[#E2F2E9] transition-colors shrink-0 cursor-pointer"
          >
            <Bookmark
              className={`w-5 h-5 stroke-[2.2] ${
                isApplied
                  ? 'fill-[#0E9F6E] text-[#0E9F6E]'
                  : 'text-[#0E9F6E]'
              }`}
            />
          </button>
        )}
      </div>

      {/* Middle Row: Mint Pill Badges (Location & Category) + Experience Info */}
      <div className="space-y-2 border-b border-[#ECF4EF] pb-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[12px] font-bold inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0E9F6E] stroke-[2.3]" />
            <span>{job.location || job.country}</span>
          </span>

          <span className="px-3 py-1 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[12px] font-bold inline-flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#0E9F6E] stroke-[2.3]" />
            <span>{job.category}</span>
          </span>

          {isApplied && (
            <span className="px-2.5 py-1 rounded-full bg-[#0E9F6E] text-white text-[11px] font-bold inline-flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Applied</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#5C7267]">
          <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          <span>
            Experience: {job.experienceRequired || '2+ Years'} • Full-time
          </span>
        </div>
      </div>

      {/* Bottom Row: Posted Date on Left + Emerald Green Action Button on Right */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#4B6356]">
          <Calendar className="w-4 h-4 text-[#64748B] shrink-0" />
          <span>Posted {job.postedAt}</span>
        </div>

        <span className="px-4 py-2 rounded-[11px] bg-[#0E9F6E] hover:bg-[#059669] text-white text-[12.5px] font-bold shadow-xs transition-colors">
          See Details
        </span>
      </div>
    </div>
  );
};
