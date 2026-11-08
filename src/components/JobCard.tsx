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
    <div className="bg-white border border-[#D2DEEA] hover:border-[#1673B8] rounded-2xl p-3.5 sm:p-4 shadow-2xs transition-all space-y-2.5">
      {/* Top Row: Certificate Ice-Blue Icon Square + Job Title & Company */}
      <div className="flex items-start justify-between gap-2.5 border-b border-slate-100 pb-2.5">
        <div
          onClick={() => onClick(job)}
          className="flex items-start gap-2.5 min-w-0 flex-1 cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] flex items-center justify-center shrink-0 mt-0.5">
            <CategoryBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[14px] sm:text-[15px] font-extrabold text-[#1A2138] leading-snug break-words">
              {job.title}
            </h3>
            <p className="text-[11.5px] sm:text-[12.5px] font-medium text-slate-600 mt-0.5 leading-snug break-words">
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
            className="p-1.5 rounded-xl text-[#1673B8] hover:bg-[#F0F6FC] transition-colors shrink-0 cursor-pointer"
          >
            <Bookmark
              className={`w-4 h-4 stroke-[2.2] ${
                isApplied
                  ? 'fill-[#1673B8] text-[#1673B8]'
                  : 'text-[#1673B8]'
              }`}
            />
          </button>
        )}
      </div>

      {/* Middle Row: Location & Category + Experience Info */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="space-y-1.5 border-b border-slate-100 pb-2.5 select-none cursor-default"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] font-bold inline-flex items-center gap-1 cursor-default pointer-events-none">
            <MapPin className="w-3 h-3 text-[#1673B8] stroke-[2.2] shrink-0" />
            <span className="break-words">{job.location || job.country}</span>
          </span>

          <span className="px-2 py-0.5 rounded-md bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-[10.5px] font-bold inline-flex items-center gap-1 cursor-default pointer-events-none">
            <Briefcase className="w-3 h-3 text-[#1673B8] stroke-[2.2] shrink-0" />
            <span className="break-words">{job.category}</span>
          </span>

          {isApplied && (
            <span className="px-2 py-0.5 rounded-md bg-[#1673B8] text-white text-[10px] font-bold inline-flex items-center gap-1 cursor-default pointer-events-none">
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Applied</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-medium text-slate-600 break-words">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Experience: {job.experienceRequired || '2+ Years'} • Full-time
          </span>
        </div>
      </div>

      {/* Bottom Row: Posted Date on Left + Royal Blue 'See Details' Button on Right */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Posted {job.postedAt}</span>
        </div>

        <button
          type="button"
          onClick={() => onClick(job)}
          className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-[11.5px] font-bold shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          See Details
        </button>
      </div>
    </div>
  );
};
