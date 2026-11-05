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
    <div className="bg-white border border-[#D4E9DF] hover:border-[#0E9F6E] rounded-[18px] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(19,66,43,0.05)] transition-all space-y-2.5">
      {/* Top Row: Soft Mint Icon Square + Job Title & Company */}
      <div className="flex items-start justify-between gap-2.5 border-b border-[#ECF4EF] pb-2.5">
        <div
          onClick={() => onClick(job)}
          className="flex items-start gap-2.5 min-w-0 flex-1 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center shrink-0 mt-0.5">
            <CategoryBadgeIcon className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[14.5px] sm:text-[16px] font-extrabold text-[#0F291E] leading-snug break-words">
              {job.title}
            </h3>
            <p className="text-[12px] sm:text-[13px] font-medium text-[#5C7267] mt-0.5 leading-snug break-words">
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
              className={`w-4 h-4 stroke-[2.2] ${
                isApplied
                  ? 'fill-[#0E9F6E] text-[#0E9F6E]'
                  : 'text-[#0E9F6E]'
              }`}
            />
          </button>
        )}
      </div>

      {/* Middle Row: Unclickable Informational Tags (Location & Category) + Experience Info */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="space-y-1.5 border-b border-[#ECF4EF] pb-2.5 select-none cursor-default"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[11px] font-bold inline-flex items-center gap-1 cursor-default pointer-events-none">
            <MapPin className="w-3 h-3 text-[#0E9F6E] stroke-[2.3] shrink-0" />
            <span className="break-words">{job.location || job.country}</span>
          </span>

          <span className="px-2.5 py-0.5 rounded-full bg-[#D7EFE2] text-[#0D6845] text-[11px] font-bold inline-flex items-center gap-1 cursor-default pointer-events-none">
            <Briefcase className="w-3 h-3 text-[#0E9F6E] stroke-[2.3] shrink-0" />
            <span className="break-words">{job.category}</span>
          </span>

          {isApplied && (
            <span className="px-2 py-0.5 rounded-full bg-[#0E9F6E] text-white text-[10.5px] font-bold inline-flex items-center gap-1 cursor-default pointer-events-none">
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Applied</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-medium text-[#5C7267] break-words">
          <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          <span>
            Experience: {job.experienceRequired || '2+ Years'} • Full-time
          </span>
        </div>
      </div>

      {/* Bottom Row: Posted Date on Left + Emerald Green 'See Details' Button on Right */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-1 text-[11px] sm:text-[12px] font-semibold text-[#4B6356]">
          <Calendar className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          <span>Posted {job.postedAt}</span>
        </div>

        <button
          type="button"
          onClick={() => onClick(job)}
          className="px-3.5 py-1.5 rounded-[10px] bg-[#0E9F6E] hover:bg-[#059669] text-white text-[11.5px] sm:text-[12px] font-bold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          See Details
        </button>
      </div>
    </div>
  );
};
