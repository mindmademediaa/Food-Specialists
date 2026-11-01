import React, { useState, useMemo } from 'react';
import {
  Bell,
  Plus,
  Check,
  Trash2,
  AlertTriangle,
  Clock,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { ComplianceTask, TaskHorizon, TaskPriority } from '../types';

interface AlertsTasksModuleProps {
  tasks: ComplianceTask[];
  todayIso: string;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<ComplianceTask, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
  onResetHorizonTasks: (horizon: TaskHorizon) => void;
}

const HORIZONS: { id: TaskHorizon; label: string; cadenceDesc: string }[] = [
  {
    id: 'daily',
    label: 'Daily Tasks',
    cadenceDesc: '24-hour plant floor CCP logs, ATP swabbing & lab instrument calibration'
  },
  {
    id: 'weekly',
    label: 'Weekly Tasks',
    cadenceDesc: '7-day pest control inspections, shelf-life sensory panels & allergen checks'
  },
  {
    id: 'monthly',
    label: 'Monthly Tasks',
    cadenceDesc: '30-day glass & brittle plastic audits, GMP walkthroughs & supplier COA reviews'
  },
  {
    id: 'quarterly',
    label: 'Quarterly Tasks',
    cadenceDesc: 'Every 3 months mock recall traceability exercises & external water testing'
  },
  {
    id: 'annual',
    label: 'Annual Tasks',
    cadenceDesc: 'Yearly FSSC 22000 / BRCGS surveillance audits & Halal certification renewals'
  }
];

export const AlertsTasksModule: React.FC<AlertsTasksModuleProps> = ({
  tasks,
  todayIso,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onResetHorizonTasks
}) => {
  const [activeHorizon, setActiveHorizon] = useState<TaskHorizon>('daily');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HACCP CCP Monitoring');
  const [dueDate, setDueDate] = useState(todayIso);
  const [dueTime, setDueTime] = useState('10:00');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [notes, setNotes] = useState('');
  const [alertBannerMessage, setAlertBannerMessage] = useState<string | null>(null);

  const horizonStats = useMemo(() => {
    const map: Record<
      TaskHorizon,
      { total: number; completed: number; percent: number; overdue: number }
    > = {
      daily: { total: 0, completed: 0, percent: 0, overdue: 0 },
      weekly: { total: 0, completed: 0, percent: 0, overdue: 0 },
      monthly: { total: 0, completed: 0, percent: 0, overdue: 0 },
      quarterly: { total: 0, completed: 0, percent: 0, overdue: 0 },
      annual: { total: 0, completed: 0, percent: 0, overdue: 0 }
    };

    tasks.forEach((t) => {
      const bucket = map[t.horizon];
      bucket.total += 1;
      if (t.completed) {
        bucket.completed += 1;
      } else if (t.dueDate < todayIso) {
        bucket.overdue += 1;
      }
    });

    (Object.keys(map) as TaskHorizon[]).forEach((k) => {
      const b = map[k];
      b.percent = b.total > 0 ? Math.round((b.completed / b.total) * 100) : 0;
    });

    return map;
  }, [tasks, todayIso]);

  const activeTasks = useMemo(() => {
    return tasks
      .filter((t) => t.horizon === activeHorizon)
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [tasks, activeHorizon]);

  const overdueTasksAll = useMemo(() => {
    return tasks.filter((t) => !t.completed && t.dueDate < todayIso);
  }, [tasks, todayIso]);

  const dueTodayTasksAll = useMemo(() => {
    return tasks.filter((t) => !t.completed && t.dueDate === todayIso);
  }, [tasks, todayIso]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      category,
      horizon: activeHorizon,
      dueDate: dueDate || todayIso,
      dueTime: dueTime || '09:00',
      priority,
      completed: false,
      notes: notes.trim() || undefined
    });
    setTitle('');
    setNotes('');
  };

  const handleTriggerAlertNotification = async () => {
    const urgentCount = overdueTasksAll.length + dueTodayTasksAll.length;
    const summaryText =
      urgentCount > 0
        ? `Compliance Alert: ${overdueTasksAll.length} Overdue and ${dueTodayTasksAll.length} Due Today across your Food Safety & QA schedule.`
        : 'All scheduled Food Safety & QA compliance tasks are currently on track.';

    setAlertBannerMessage(summaryText);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'granted') {
          new Notification('Food Specialists — Task Alert', { body: summaryText });
        } else if (Notification.permission !== 'denied') {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            new Notification('Food Specialists — Task Alert', { body: summaryText });
          }
        }
      } catch {
        // Ignore if browser notifications are restricted inside sandboxed iframe
      }
    }
  };

  const currentStat = horizonStats[activeHorizon];
  const currentHorizonMeta = HORIZONS.find((h) => h.id === activeHorizon)!;

  return (
    <div className="space-y-6">
      {/* Header & Alert Trigger Button */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-emerald-700 mb-1">
            Multi-Horizon Plant Floor & Personal Compliance Manager
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Alerts & Compliance Tasks
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Manage Daily, Weekly, Monthly, Quarterly, and Annual routines—from CCP temperature logs to FSSC 22000 & Halal audit renewals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleTriggerAlertNotification}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Check Deadline Alerts ({overdueTasksAll.length + dueTodayTasksAll.length})</span>
          </button>
          <button
            type="button"
            onClick={() => onResetHorizonTasks(activeHorizon)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset {currentHorizonMeta.label}</span>
          </button>
        </div>
      </div>

      {/* Live Alert Banner if triggered or if Overdue tasks exist */}
      {(alertBannerMessage || overdueTasksAll.length > 0) && (
        <div
          className={`rounded-xl p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            overdueTasksAll.length > 0
              ? 'bg-red-50/90 border-red-200 text-red-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={`w-4 h-4 mt-0.5 shrink-0 ${
                overdueTasksAll.length > 0 ? 'text-red-600' : 'text-emerald-600'
              }`}
            />
            <div className="text-xs space-y-0.5">
              <div className="font-bold">
                {alertBannerMessage ||
                  `Action Required: ${overdueTasksAll.length} Overdue Task(s) & ${dueTodayTasksAll.length} Task(s) Due Today`}
              </div>
              <div className="text-slate-700">
                {overdueTasksAll.length > 0
                  ? `Overdue: ${overdueTasksAll.map((t) => `${t.title} (${t.horizon.toUpperCase()})`).join(' · ')}`
                  : 'All scheduled tasks are within compliance windows.'}
              </div>
            </div>
          </div>
          {alertBannerMessage && (
            <button
              type="button"
              onClick={() => setAlertBannerMessage(null)}
              className="text-xs font-semibold underline shrink-0"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* 5 Segmented Horizon Tabs with Completion Counters */}
      <div
        role="tablist"
        aria-label="Task time horizons"
        className="grid grid-cols-2 sm:grid-cols-5 gap-2.5"
      >
        {HORIZONS.map((h) => {
          const stat = horizonStats[h.id];
          const isSelected = activeHorizon === h.id;
          return (
            <button
              key={h.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveHorizon(h.id)}
              className={`p-3.5 rounded-xl border text-left transition-colors ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold whitespace-nowrap">{h.label}</span>
                {stat.overdue > 0 && (
                  <span
                    className={`text-[11px] font-mono font-bold tabular-nums ${
                      isSelected ? 'text-red-300' : 'text-red-600'
                    }`}
                  >
                    {stat.overdue} Overdue
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-baseline justify-between text-xs tabular-nums">
                <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                  {stat.completed}/{stat.total} Done
                </span>
                <span
                  className={`font-mono font-semibold ${
                    isSelected ? 'text-emerald-400' : 'text-emerald-700'
                  }`}
                >
                  {stat.percent}%
                </span>
              </div>
              <div
                className={`w-full h-1.5 rounded-full mt-1.5 overflow-hidden ${
                  isSelected ? 'bg-slate-700' : 'bg-slate-100'
                }`}
              >
                <div
                  className="h-full bg-emerald-500 transition-transform duration-150 origin-left"
                  style={{ transform: `scaleX(${stat.percent / 100})` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Horizon Workspace: Left = Add Task Form, Right = Active Horizon Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Add Task Form (4 cols) */}
        <form
          onSubmit={handleCreateTask}
          className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4"
        >
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Add {currentHorizonMeta.label.replace('Tasks', 'Task')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{currentHorizonMeta.cadenceDesc}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Title / Compliance Check
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Verify CCP-1 Chiller Temperature Log..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Compliance Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            >
              <option value="HACCP CCP Monitoring">HACCP CCP Monitoring</option>
              <option value="Sanitation & SSOP">Sanitation & SSOP</option>
              <option value="Lab QA/QC">Lab QA/QC Calibration & Testing</option>
              <option value="Prerequisite Program (PRP)">Prerequisite Program (PRP)</option>
              <option value="Allergen Control">Allergen Control</option>
              <option value="GMP & Foreign Body Control">GMP & Foreign Body Control</option>
              <option value="Supplier Quality Assurance">Supplier Quality Assurance</option>
              <option value="FSMS Traceability">FSMS Traceability & Recall</option>
              <option value="Certification Renewal">FSSC / BRCGS / Halal Certification</option>
              <option value="Personal Career & Training">Personal Career & Training</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 tabular-nums focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 tabular-nums focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 text-xs font-semibold rounded-md border capitalize transition-colors ${
                    priority === p
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              SOP Reference / Target Threshold Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional acceptance criteria (e.g. ATP < 30 RLU)..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add to {currentHorizonMeta.label}</span>
          </button>
        </form>

        {/* Active Horizon Task List & Progress Bar (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          {/* Horizon Progress Header */}
          <div className="pb-4 border-b border-slate-200 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {currentHorizonMeta.label} Schedule
                </h2>
                <p className="text-xs text-slate-500">{currentHorizonMeta.cadenceDesc}</p>
              </div>
              <div className="text-right tabular-nums">
                <div className="text-sm font-mono font-bold text-emerald-700">
                  {currentStat.percent}% Complete
                </div>
                <div className="text-xs text-slate-500">
                  {currentStat.completed} of {currentStat.total} tasks verified
                </div>
              </div>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-transform duration-150 origin-left"
                style={{ transform: `scaleX(${currentStat.percent / 100})` }}
              />
            </div>
          </div>

          {/* Tasks List */}
          {activeTasks.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-900">
                No {currentHorizonMeta.label.toLowerCase()} scheduled yet
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the form on the left to add a compliance check, audit routine, or personal task for this horizon.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => {
                const isOverdue = !task.completed && task.dueDate < todayIso;
                const isDueToday = !task.completed && task.dueDate === todayIso;

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
                      task.completed
                        ? 'bg-slate-50/80 border-slate-200 opacity-75'
                        : isOverdue
                        ? 'bg-red-50/50 border-red-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        aria-label={
                          task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`
                        }
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                          task.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : isOverdue
                            ? 'border-red-400 bg-white hover:border-red-600'
                            : 'border-slate-300 bg-white hover:border-emerald-600'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </button>

                      <div className="space-y-1">
                        {/* Clean unboxed metadata row */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="font-semibold text-slate-700">{task.category}</span>
                          <span className="text-slate-400">·</span>
                          <span
                            className={`font-semibold capitalize ${
                              task.priority === 'high'
                                ? 'text-red-700'
                                : task.priority === 'medium'
                                ? 'text-amber-700'
                                : 'text-slate-600'
                            }`}
                          >
                            {task.priority} Priority
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="font-mono tabular-nums text-slate-600">
                            Due {task.dueDate} at {task.dueTime}
                          </span>

                          {isOverdue && (
                            <>
                              <span className="text-slate-400">·</span>
                              <span className="font-bold text-red-700 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>OVERDUE</span>
                              </span>
                            </>
                          )}

                          {isDueToday && (
                            <>
                              <span className="text-slate-400">·</span>
                              <span className="font-bold text-amber-700 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>DUE TODAY</span>
                              </span>
                            </>
                          )}
                        </div>

                        <h3
                          className={`text-sm font-bold ${
                            task.completed
                              ? 'line-through text-slate-500'
                              : isOverdue
                              ? 'text-red-950'
                              : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </h3>

                        {task.notes && (
                          <p className="text-xs text-slate-600">{task.notes}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-md shrink-0"
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
