import React, { useState, useMemo } from 'react';
import {
  Search,
  Check,
  Lock,
  SlidersHorizontal,
  RotateCcw,
  X
} from 'lucide-react';
import { Opportunity, AppliedJobRecord } from '../types';

interface OpportunitiesModuleProps {
  opportunities: Opportunity[];
  appliedJobs: AppliedJobRecord[];
  unlockedJobIdsThisWeek: string[];
  isPaidMember: boolean;
  onToggleApplied: (jobId: string, notes?: string) => void;
  onUnlockFreeJob: (jobId: string) => void;
  onResetWeeklyFreeJobs: () => void;
  onUpgradeToPro: () => void;
}

type SubTab = 'food-safety' | 'food-quality' | 'scholarship' | 'applied';

export const OpportunitiesModule: React.FC<OpportunitiesModuleProps> = ({
  opportunities,
  appliedJobs,
  unlockedJobIdsThisWeek,
  isPaidMember,
  onToggleApplied,
  onUnlockFreeJob,
  onResetWeeklyFreeJobs,
  onUpgradeToPro
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('food-safety');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubSpecialty, setSelectedSubSpecialty] = useState<string>('all');

  const appliedMap = useMemo(() => {
    const map = new Map<string, AppliedJobRecord>();
    appliedJobs.forEach((rec) => map.set(rec.jobId, rec));
    return map;
  }, [appliedJobs]);

  const subSpecialties = useMemo(() => {
    const baseList =
      activeSubTab === 'applied'
        ? opportunities.filter((o) => appliedMap.has(o.id))
        : opportunities.filter((o) => o.category === activeSubTab);
    const set = new Set<string>();
    baseList.forEach((item) => set.add(item.subCategory));
    return Array.from(set);
  }, [opportunities, activeSubTab, appliedMap]);

  const filteredList = useMemo(() => {
    return opportunities.filter((item) => {
      if (activeSubTab === 'applied') {
        if (!appliedMap.has(item.id)) return false;
      } else {
        if (item.category !== activeSubTab) return false;
      }

      if (selectedSubSpecialty !== 'all' && item.subCategory !== selectedSubSpecialty) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchOrg = item.organization.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchSub = item.subCategory.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        return matchTitle || matchOrg || matchLoc || matchSub || matchDesc;
      }

      return true;
    });
  }, [opportunities, activeSubTab, selectedSubSpecialty, searchQuery, appliedMap]);

  const freeSlotsUsed = unlockedJobIdsThisWeek.length;
  const maxFreeSlots = 3;
  const freeQuotaReached = !isPaidMember && freeSlotsUsed >= maxFreeSlots;

  const isCardUnlocked = (item: Opportunity): boolean => {
    if (item.category === 'scholarship') return true;
    if (isPaidMember) return true;
    if (appliedMap.has(item.id)) return true;
    return unlockedJobIdsThisWeek.includes(item.id);
  };

  const handleTabChange = (tab: SubTab) => {
    setActiveSubTab(tab);
    setSelectedSubSpecialty('all');
  };

  const counts = useMemo(() => {
    return {
      safety: opportunities.filter((o) => o.category === 'food-safety').length,
      quality: opportunities.filter((o) => o.category === 'food-quality').length,
      scholarship: opportunities.filter((o) => o.category === 'scholarship').length,
      applied: appliedJobs.length
    };
  }, [opportunities, appliedJobs]);

  return (
    <div className="space-y-6">
      {/* Top Section Header & Freemium Quota Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-emerald-700 mb-1">
            Verified Food Industry Career & Academic Opportunities
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Opportunities Hub
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Curated daily information on Food Safety jobs (HACCP, ISO 22000, FSSC, BRCGS, Halal), Food Quality jobs (QA/QC, Sensory, R&D), and international Food Science scholarships.
          </p>
        </div>

        {/* Freemium Quota Status Box */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          {isPaidMember ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-900">
                  Pro Specialist Access Active
                </div>
                <div className="text-xs text-slate-500 tabular-nums">
                  Unlimited daily Food Safety & Quality jobs unlocked
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 tabular-nums whitespace-nowrap shrink-0">
                UNLIMITED
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <span>Free Weekly Job Limit:</span>
                  <span className="font-mono tabular-nums text-emerald-700">
                    {freeSlotsUsed} / {maxFreeSlots} Viewed
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {freeQuotaReached
                    ? 'Weekly 3-job limit reached. Remaining jobs are locked.'
                    : `${maxFreeSlots - freeSlotsUsed} free job unlock(s) remaining this week.`}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onResetWeeklyFreeJobs}
                  title="Reset 7-day rolling job counter for testing"
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset 0/3</span>
                </button>
                <button
                  type="button"
                  onClick={onUpgradeToPro}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Category Sub-Tabs & Live Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Opportunity categories"
          className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg overflow-x-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'food-safety'}
            onClick={() => handleTabChange('food-safety')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'food-safety'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Food Safety Jobs ({counts.safety})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'food-quality'}
            onClick={() => handleTabChange('food-quality')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'food-quality'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Food Quality Jobs ({counts.quality})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'scholarship'}
            onClick={() => handleTabChange('scholarship')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'scholarship'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scholarships & Fellowships ({counts.scholarship})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'applied'}
            onClick={() => handleTabChange('applied')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'applied'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            My Applied Jobs ({counts.applied})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ISO 22000, HACCP, city..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-Specialty Filter Bar */}
      {subSpecialties.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1 whitespace-nowrap shrink-0 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Specialty:</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedSubSpecialty('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedSubSpecialty === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Specialties
          </button>
          {subSpecialties.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSubSpecialty(sub)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedSubSpecialty === sub
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Listings Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <h3 className="text-base font-semibold text-slate-900">
            {activeSubTab === 'applied'
              ? 'You have not marked any opportunities as Applied yet'
              : 'No matching opportunities found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {activeSubTab === 'applied'
              ? 'Browse Food Safety Jobs, Food Quality Jobs, or Scholarships and click the "Mark as Applied" button on any listing you have applied to.'
              : 'Try clearing your search query or switching to another specialty tab.'}
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSubSpecialty('all');
                if (activeSubTab === 'applied') setActiveSubTab('food-safety');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {activeSubTab === 'applied' ? 'Explore Food Safety Jobs' : 'Reset Filters'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredList.map((item) => {
            const unlocked = isCardUnlocked(item);
            const appliedRecord = appliedMap.get(item.id);
            const isApplied = Boolean(appliedRecord);

            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden transition-colors hover:border-slate-300"
              >
                <div>
                  {/* Quiet 1-line unboxed metadata kicker (Zero-Pill Discipline) */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <span className="font-medium text-emerald-700">{item.subCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.employmentType}</span>
                    <span aria-hidden="true">·</span>
                    <span>Posted {item.postedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">Deadline {item.deadline}</span>
                  </div>

                  {/* Primary Title */}
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h2>

                  {/* Organization, Location & Compensation as clean unboxed text */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 mt-1.5 pb-4 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">{item.organization}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.location}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono font-medium text-slate-900 tabular-nums">
                      {item.compensation}
                    </span>
                  </div>

                  {/* Body Content: Unlocked vs Blurred Locked State for Free Tier */}
                  {unlocked ? (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 mb-1.5">
                          Key Requirements & Standards:
                        </div>
                        <ul className="space-y-1">
                          {item.requirements.map((req, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-slate-600 flex items-start gap-2"
                            >
                              <span className="text-emerald-600 font-bold select-none">·</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-1 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Official Reference / Portal:</span>{' '}
                        <span className="font-mono text-slate-600 break-all">{item.applicationUrl}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 relative">
                      <div className="select-none pointer-events-none blur-[5px] opacity-55 space-y-2">
                        <p className="text-sm text-slate-600">
                          {item.description}
                        </p>
                        <ul className="space-y-1">
                          {item.requirements.slice(0, 3).map((req, idx) => (
                            <li key={idx} className="text-xs text-slate-600">
                              · {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Lock Overlay */}
                      <div className="inset-0 flex flex-col items-center justify-center bg-slate-900/5 backdrop-blur-[2px] rounded-lg p-5 mt-2 border border-slate-200 text-center">
                        <Lock className="w-5 h-5 text-slate-700 mb-1.5" />
                        {freeQuotaReached ? (
                          <>
                            <p className="text-xs font-bold text-slate-900">
                              Weekly Free Limit Reached (3 / 3 Jobs Viewed)
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5 max-w-sm">
                              Free tier includes 3 Food Safety or Quality jobs per 7-day rolling period. Upgrade to Pro for unlimited daily job listings.
                            </p>
                            <button
                              type="button"
                              onClick={onUpgradeToPro}
                              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                            >
                              Upgrade to Pro to Unlock Daily Jobs
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-bold text-slate-900">
                              Unlock Full Job Details
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5 tabular-nums">
                              Uses 1 of your {maxFreeSlots - freeSlotsUsed} remaining free weekly job views.
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                type="button"
                                onClick={() => onUnlockFreeJob(item.id)}
                                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                              >
                                Unlock Job ({freeSlotsUsed + 1}/{maxFreeSlots} Free)
                              </button>
                              <button
                                type="button"
                                onClick={onUpgradeToPro}
                                className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                              >
                                Upgrade to Pro
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Footer: Only the "Mark as Applied" / "Applied ✓" Status Tracker Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  {unlocked ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onToggleApplied(item.id)}
                        aria-pressed={isApplied}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                          isApplied
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Applied ✓</span>
                          </>
                        ) : (
                          <span>Mark as Applied</span>
                        )}
                      </button>

                      <span className="text-xs text-slate-500 tabular-nums">
                        {appliedRecord
                          ? `Marked Applied on ${appliedRecord.appliedAt}`
                          : `ID: ${item.id.toUpperCase()}`}
                      </span>
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-between text-xs text-slate-500">
                      <span>Locked for Free Tier</span>
                      <button
                        type="button"
                        onClick={onUpgradeToPro}
                        className="font-semibold text-emerald-700 hover:underline whitespace-nowrap shrink-0"
                      >
                        Unlock with Pro →
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
