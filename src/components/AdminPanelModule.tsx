import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { Opportunity, OpportunityCategory } from '../types';

interface AdminPanelModuleProps {
  opportunities: Opportunity[];
  onSaveOpportunity: (opportunity: Opportunity, isNew: boolean) => void;
  onDeleteOpportunity: (id: string) => void;
  onResetAllDemoData: () => void;
}

const SUB_CATEGORY_SUGGESTIONS: Record<OpportunityCategory, string[]> = {
  'food-safety': [
    'ISO 22000 & FSSC Auditing',
    'HACCP & Plant Hygiene',
    'Halal Auditing & Regulatory Affairs',
    'BRCGS & Supplier Compliance'
  ],
  'food-quality': [
    'QA/QC Executive & Lab Analysis',
    'Sensory Analyst & Shelf-Life',
    'R&D Food Technologist',
    'Microbiological Lab Analyst'
  ],
  scholarship: [
    'MS Funded Program (Europe)',
    'MSc Food Safety Grant',
    'PhD Funded Program (UK)',
    'International Exchange & Research Grant'
  ]
};

export const AdminPanelModule: React.FC<AdminPanelModuleProps> = ({
  opportunities,
  onSaveOpportunity,
  onDeleteOpportunity,
  onResetAllDemoData
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState<OpportunityCategory>('food-safety');
  const [subCategory, setSubCategory] = useState<string>('ISO 22000 & FSSC Auditing');
  const [title, setTitle] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [compensation, setCompensation] = useState<string>('');
  const [employmentType, setEmploymentType] = useState<string>('Full-Time');
  const [deadline, setDeadline] = useState<string>('2026-12-15');
  const [description, setDescription] = useState<string>('');
  const [requirementsText, setRequirementsText] = useState<string>('');
  const [applicationUrl, setApplicationUrl] = useState<string>('https://');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCategoryChange = (newCat: OpportunityCategory) => {
    setCategory(newCat);
    setSubCategory(SUB_CATEGORY_SUGGESTIONS[newCat][0]);
    if (newCat === 'scholarship') {
      setEmploymentType('Fully Funded Fellowship');
    } else {
      setEmploymentType('Full-Time');
    }
  };

  const handleStartEdit = (item: Opportunity) => {
    setEditingId(item.id);
    setCategory(item.category);
    setSubCategory(item.subCategory);
    setTitle(item.title);
    setOrganization(item.organization);
    setLocation(item.location);
    setCompensation(item.compensation);
    setEmploymentType(item.employmentType);
    setDeadline(item.deadline);
    setDescription(item.description);
    setRequirementsText(item.requirements.join('\n'));
    setApplicationUrl(item.applicationUrl);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setOrganization('');
    setLocation('');
    setCompensation('');
    setDescription('');
    setRequirementsText('');
    setApplicationUrl('https://');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    const reqArray = requirementsText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const payload: Opportunity = {
      id: editingId || `item-${Date.now()}`,
      title: title.trim(),
      organization: organization.trim(),
      location: location.trim() || 'Lahore / Remote',
      compensation: compensation.trim() || 'Competitive Package',
      postedDate: editingId ? 'Updated Today' : 'Just now',
      deadline: deadline || '2026-12-31',
      category,
      subCategory: subCategory.trim() || SUB_CATEGORY_SUGGESTIONS[category][0],
      employmentType: employmentType.trim() || 'Full-Time',
      description: description.trim(),
      requirements:
        reqArray.length > 0
          ? reqArray
          : ['BS/MS in Food Science & Technology', 'Relevant HACCP / ISO 22000 certification'],
      applicationUrl: applicationUrl.trim() || 'https://foodspecialists.org/apply'
    };

    onSaveOpportunity(payload, !editingId);
    setStatusMessage(
      editingId
        ? `Updated listing "${payload.title}"`
        : `Published new ${category.replace('-', ' ')} listing "${payload.title}"`
    );
    setTimeout(() => setStatusMessage(null), 4000);
    handleCancelEdit();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-emerald-700 mb-1">
            App Owner Publishing & Content Management Console
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Admin Panel — Manage Jobs & Scholarships
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Publish daily Food Safety Jobs, Food Quality Jobs, and funded Food Science Scholarships, or edit and remove existing listings.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetAllDemoData}
          className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Default Demo Dataset</span>
        </button>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-emerald-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Publish / Edit Form (5 cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {editingId ? 'Edit Existing Opportunity' : 'Post New Job or Scholarship'}
              </h2>
              <p className="text-xs text-slate-500">
                Appears immediately in the Opportunities Hub
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Edit</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Opportunity Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'food-safety', label: 'Food Safety Job' },
                  { id: 'food-quality', label: 'Food Quality Job' },
                  { id: 'scholarship', label: 'Scholarship' }
                ] as { id: OpportunityCategory; label: string }[]
              ).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCategoryChange(c.id)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    category === c.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Title (Position or Scholarship Name)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior HACCP & FSSC 22000 Auditor"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / University / Organization
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g., Engro Foods / University of Leeds"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sub-Specialty
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                list="sub-category-options"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
              <datalist id="sub-category-options">
                {SUB_CATEGORY_SUGGESTIONS[category].map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employment / Program Type
              </label>
              <input
                type="text"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                placeholder="Full-Time / MSc Fellowship"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Karachi, Pakistan / Riyadh, KSA"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Salary / Stipend
              </label>
              <input
                type="text"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                placeholder="PKR 180,000 / mo or Fully Funded"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 tabular-nums focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 tabular-nums focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Link / Portal URL
              </label>
              <input
                type="text"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Role / Scholarship Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe responsibilities, FSMS standards, or scholarship coverage..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requirements (One per line)
              </label>
              <textarea
                rows={3}
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                placeholder={`BS/MS in Food Science & Technology\nLead Auditor ISO 22000 / HACCP Level 3\n2+ years FMCG QA experience`}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{editingId ? 'Save Changes' : 'Publish Opportunity'}</span>
          </button>
        </form>

        {/* Right: Existing Listings Table / Manager (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Active Published Listings ({opportunities.length})
              </h2>
              <p className="text-xs text-slate-500">
                Click Edit to modify any job or scholarship, or Delete to remove it.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {opportunities.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold text-emerald-700 uppercase">
                      {item.category.replace('-', ' ')}
                    </span>
                    <span>·</span>
                    <span>{item.subCategory}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">Deadline {item.deadline}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-600">
                    {item.organization} · {item.location} ·{' '}
                    <span className="font-mono tabular-nums">{item.compensation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteOpportunity(item.id)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
