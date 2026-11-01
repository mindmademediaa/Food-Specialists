import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Award,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';
import { CareerObjective, ObjectiveType, ObjectiveStatus } from '../types';

interface CareerRoadmapModuleProps {
  objectives: CareerObjective[];
  onAddObjective: (obj: Omit<CareerObjective, 'id'>) => void;
  onUpdateStatus: (id: string, status: ObjectiveStatus) => void;
  onDeleteObjective: (id: string) => void;
}

const YEARS = [2026, 2027, 2028, 2029, 2030];

const TYPE_LABELS: Record<ObjectiveType, string> = {
  training: 'Target Training / Course',
  certification: 'Target Certification',
  promotion: 'Target Promotion / Role',
  education: 'Higher Education Goal'
};

export const CareerRoadmapModule: React.FC<CareerRoadmapModuleProps> = ({
  objectives,
  onAddObjective,
  onUpdateStatus,
  onDeleteObjective
}) => {
  const [selectedYearFilter, setSelectedYearFilter] = useState<number | 'all'>('all');
  const [year, setYear] = useState<number>(2026);
  const [targetQuarter, setTargetQuarter] = useState<string>('Q4 2026');
  const [type, setType] = useState<ObjectiveType>('training');
  const [title, setTitle] = useState<string>('');
  const [providerOrTarget, setProviderOrTarget] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [celebrationMilestone, setCelebrationMilestone] = useState<string | null>(null);

  const filteredObjectives = useMemo(() => {
    const list =
      selectedYearFilter === 'all'
        ? objectives
        : objectives.filter((o) => o.year === selectedYearFilter);
    return [...list].sort((a, b) => a.year - b.year);
  }, [objectives, selectedYearFilter]);

  const groupedByYear = useMemo(() => {
    const map = new Map<number, CareerObjective[]>();
    filteredObjectives.forEach((obj) => {
      const existing = map.get(obj.year) || [];
      existing.push(obj);
      map.set(obj.year, existing);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [filteredObjectives]);

  const summaryMetrics = useMemo(() => {
    const total = objectives.length;
    const achieved = objectives.filter((o) => o.status === 'achieved').length;
    const inProgress = objectives.filter((o) => o.status === 'in-progress').length;
    const planned = objectives.filter((o) => o.status === 'planned').length;
    const pct = total > 0 ? Math.round((achieved / total) * 100) : 0;
    return { total, achieved, inProgress, planned, pct };
  }, [objectives]);

  const handleCreateObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddObjective({
      year,
      targetQuarter: targetQuarter.trim() || `Q2 ${year}`,
      type,
      title: title.trim(),
      providerOrTarget: providerOrTarget.trim() || 'Food Industry Accreditation Body',
      status: 'planned',
      notes: notes.trim()
    });
    setTitle('');
    setProviderOrTarget('');
    setNotes('');
  };

  const handleStatusChange = (obj: CareerObjective, newStatus: ObjectiveStatus) => {
    onUpdateStatus(obj.id, newStatus);
    if (newStatus === 'achieved' && obj.status !== 'achieved') {
      setCelebrationMilestone(
        `Milestone Achieved (${obj.year}): "${obj.title}" — Your Food Specialist roadmap progress has been updated!`
      );
      setTimeout(() => setCelebrationMilestone(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overall Roadmap Progress */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-emerald-700 mb-1">
            Multi-Year Food Science & Quality Leadership Planner
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Career Growth & Objective Roadmap
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Plan year-by-year trainings, Lead Auditor certifications, promotions, and postgraduate fellowships from 2026 to 2030.
          </p>
        </div>

        {/* Summary Metric Strip */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-6 tabular-nums shrink-0">
          <div>
            <div className="text-xs text-slate-500">Achieved</div>
            <div className="text-lg font-mono font-bold text-emerald-700">
              {summaryMetrics.achieved} / {summaryMetrics.total}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-xs text-slate-500">In Progress</div>
            <div className="text-lg font-mono font-bold text-amber-700">
              {summaryMetrics.inProgress}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="text-xs text-slate-500">Completion</div>
            <div className="text-lg font-mono font-bold text-slate-900">
              {summaryMetrics.pct}%
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Celebration Banner */}
      {celebrationMilestone && (
        <div className="bg-emerald-900 text-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs font-semibold">{celebrationMilestone}</div>
          </div>
          <button
            type="button"
            onClick={() => setCelebrationMilestone(null)}
            className="text-xs text-emerald-300 hover:text-white underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Year Filter Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedYearFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedYearFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Years (2026–2030)
          </button>
          {YEARS.map((y) => {
            const count = objectives.filter((o) => o.year === y).length;
            return (
              <button
                key={y}
                type="button"
                onClick={() => setSelectedYearFilter(y)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors tabular-nums whitespace-nowrap shrink-0 ${
                  selectedYearFilter === y
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {y} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Layout: Left = Add Milestone Form, Right = Visual Multi-Year Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Add Career Objective Form (4 cols) */}
        <form
          onSubmit={handleCreateObjective}
          className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4"
        >
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Set New Career Growth Objective
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Assign a target year, training course, certification, or promotion goal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Year
              </label>
              <select
                value={year}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setYear(y);
                  setTargetQuarter(`Q2 ${y}`);
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 tabular-nums focus:outline-none focus:border-emerald-600"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Quarter
              </label>
              <input
                type="text"
                value={targetQuarter}
                onChange={(e) => setTargetQuarter(e.target.value)}
                placeholder="e.g., Q3 2027"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 tabular-nums focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Objective Category
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ObjectiveType)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            >
              <option value="training">Target Training / Course</option>
              <option value="certification">Target Certification (ISO / BRCGS / Halal)</option>
              <option value="promotion">Target Promotion / Leadership Role</option>
              <option value="education">Higher Education / Funded Fellowship</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Milestone Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete FSSC 22000 Lead Auditor in 2026"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Training Provider / Target Organization
            </label>
            <input
              type="text"
              value={providerOrTarget}
              onChange={(e) => setProviderOrTarget(e.target.value)}
              placeholder="e.g., SGS Academy, IRCA, Wageningen University..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Action Plan & Prerequisites
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Study schedule, exam booking month, or budget notes..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Career Milestone</span>
          </button>
        </form>

        {/* Right: Year-by-Year Timeline Roadmap (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {groupedByYear.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-2">
              <Target className="w-7 h-7 text-emerald-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-900">
                No career milestones planned for this year yet
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add a target training, certification, promotion, or fellowship using the form on the left.
              </p>
            </div>
          ) : (
            groupedByYear.map(([yr, items]) => {
              const yearAchieved = items.filter((i) => i.status === 'achieved').length;
              return (
                <section
                  key={yr}
                  className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                        {yr} Career Roadmap
                      </h2>
                      <span className="text-xs text-slate-500 tabular-nums">
                        {items.length} Milestone(s) · {yearAchieved} Achieved
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {items.map((obj) => (
                      <div
                        key={obj.id}
                        className={`p-4 rounded-xl border transition-colors ${
                          obj.status === 'achieved'
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : obj.status === 'in-progress'
                            ? 'bg-amber-50/30 border-amber-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            {/* Clean unboxed metadata */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                              <span className="font-semibold text-emerald-700">
                                {TYPE_LABELS[obj.type]}
                              </span>
                              <span>·</span>
                              <span className="font-mono tabular-nums">{obj.targetQuarter}</span>
                              <span>·</span>
                              <span>{obj.providerOrTarget}</span>
                            </div>

                            <h3 className="text-base font-bold text-slate-900">
                              {obj.title}
                            </h3>

                            {obj.notes && (
                              <p className="text-xs text-slate-600">{obj.notes}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Interactive 3-state status selector */}
                            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(obj, 'planned')}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                                  obj.status === 'planned'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                Planned
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(obj, 'in-progress')}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                                  obj.status === 'in-progress'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                <span>In Progress</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(obj, 'achieved')}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                                  obj.status === 'achieved'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Achieved</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onDeleteObjective(obj.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"
                              aria-label={`Delete ${obj.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
