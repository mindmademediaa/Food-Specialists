import React from 'react';
import { Bookmark, Shield, FlaskConical, Leaf, Check } from 'lucide-react';
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
  const initials = job.company
    .split(' ')
    .filter((w) => w.length > 0 && /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase() || 'FS';

  const CategoryBadgeIcon =
    job.category === 'R&D Lab'
      ? FlaskConical
      : job.category === 'Quality & Safety'
      ? Shield
      : Leaf;

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
      className="bg-white border border-emerald-100/90 hover:border-[#16A34A] rounded-[26px] p-5 shadow-[0_6px_24px_rgba(22,163,74,0.07)] hover:shadow-[0_10px_28px_rgba(22,163,74,0.13)] transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Left Rounded Green Company & Category Badge (matching Image 3) */}
        <div className="w-14 h-14 rounded-[18px] bg-gradient-to-b from-[#49A55E] to-[#2F8944] border-2 border-white shadow-[0_4px_12px_rgba(22,163,74,0.22)] ring-2 ring-emerald-50 flex flex-col items-center justify-center text-white shrink-0 mt-1">
          <CategoryBadgeIcon className="w-5 h-5 stroke-[2.2] mb-0.5" />
          <span className="text-[12px] font-extrabold tracking-wider leading-none">
            {initials}
          </span>
        </div>

        {/* Right Main Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[20px] font-extrabold text-[#0B3B1E] leading-snug">
            {job.title}
          </h3>

          <p className="text-[13.5px] font-medium text-gray-700 mt-1 leading-snug">
            {job.company} • {job.location} • Full-time
          </p>

          {/* Status & Metadata Row without tags */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-1">
            <div>
              {isApplied && (
                <span className="px-2.5 py-1 rounded-[10px] bg-[#16A34A] text-white text-[11px] font-bold leading-none inline-flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  <span>Applied</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[12.5px] font-semibold text-[#15803D]">
                Posted {job.postedAt} • {job.experienceRequired}
              </span>

              {onToggleApplied && (
                <button
                  type="button"
                  title={isApplied ? 'Marked as Applied / Saved' : 'Save / Mark Applied'}
                  onClick={(e) => onToggleApplied(job.id, e)}
                  className="p-1 rounded-lg text-[#15803D] hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer"
                >
                  <Bookmark
                    className={`w-5 h-5 stroke-[2.2] ${
                      isApplied ? 'fill-[#15803D] text-[#15803D]' : 'text-[#15803D]'
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
