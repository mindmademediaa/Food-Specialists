import React, { useState, useRef, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Award,
  Shield,
  Eye,
  Upload,
  Search,
  ExternalLink,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { HubTraining } from '../types/hub';
import {
  generateCertificateSvgDataUrl,
  CERTIFICATE_PRESETS
} from '../utils/certificateUtils';

interface TrainingAdminModuleProps {
  trainings: HubTraining[];
  onSaveTraining: (training: HubTraining, isNew: boolean) => Promise<void>;
  onDeleteTraining: (id: string) => Promise<void>;
  onViewTrainingInApp: (id: string) => void;
  onCloseAdmin?: () => void;
}

export const TrainingAdminModule: React.FC<TrainingAdminModuleProps> = ({
  trainings,
  onSaveTraining,
  onDeleteTraining,
  onViewTrainingInApp,
  onCloseAdmin
}) => {
  // Filter & Search
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State (Modal)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null);

  // Form Fields
  const [category, setCategory] = useState<string>('Highfield');
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [subType, setSubType] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [standardCode, setStandardCode] = useState<string>('');
  const [duration, setDuration] = useState<string>('3 Days (18 Hours)');
  const [fees, setFees] = useState<string>('PKR 28,000 / USD 135');
  const [enrollLink, setEnrollLink] = useState<string>('https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20this%20training.');
  const [description, setDescription] = useState<string>('');
  const [certificateUrl, setCertificateUrl] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);

  // Action status and loading
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Preview Certificate Lightbox in Admin
  const [previewCertUrl, setPreviewCertUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Extract all distinct categories from current trainings
  const existingCategories = useMemo(() => {
    const set = new Set<string>(['Highfield', 'Lead Auditor']);
    trainings.forEach((t) => {
      if (t.category?.trim()) set.add(t.category.trim());
    });
    return Array.from(set);
  }, [trainings]);

  // Filtered trainings
  const filteredTrainings = useMemo(() => {
    return trainings.filter((t) => {
      if (selectedCategoryFilter !== 'All' && t.category !== selectedCategoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.subType && t.subType.toLowerCase().includes(q)) ||
          (t.standardCode && t.standardCode.toLowerCase().includes(q)) ||
          t.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [trainings, selectedCategoryFilter, searchQuery]);

  // Open modal for NEW training
  const handleOpenAddModal = (presetCat?: string) => {
    const defaultCat = presetCat || (selectedCategoryFilter !== 'All' ? selectedCategoryFilter : 'Highfield');
    setEditingTrainingId(null);
    setCategory(defaultCat);
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setSubType(defaultCat === 'Lead Auditor' ? 'IRCA | CQI' : 'UK Accredited');
    setTitle('');
    setStandardCode('');
    setDuration('3 Days (18 Hours)');
    setFees('PKR 25,000 / USD 120');
    setEnrollLink('https://wa.me/923008429104?text=Assalam-o-Alaikum%2C%20I%20want%20to%20enroll%20in%20this%20training.');
    setDescription('Comprehensive training program for food industry professionals covering regulatory standards, practical audits, and international compliance.');
    setIsActive(true);

    // Generate initial certificate template
    const certSvg = generateCertificateSvgDataUrl(
      'New Professional Training',
      defaultCat,
      defaultCat === 'Lead Auditor' ? 'IRCA | CQI' : 'UK Accredited'
    );
    setCertificateUrl(certSvg);
    setIsModalOpen(true);
  };

  // Open modal to EDIT existing training
  const handleOpenEditModal = (t: HubTraining) => {
    setEditingTrainingId(t.id);
    const isExistingStandard = ['Highfield', 'Lead Auditor'].includes(t.category);
    if (!isExistingStandard && !existingCategories.includes(t.category)) {
      setIsCustomCategory(true);
      setCustomCategoryInput(t.category);
      setCategory('Custom');
    } else {
      setIsCustomCategory(false);
      setCategory(t.category);
      setCustomCategoryInput('');
    }
    setSubType(t.subType || '');
    setTitle(t.title);
    setStandardCode(t.standardCode || '');
    setDuration(t.duration || '');
    setFees(t.fees || '');
    setEnrollLink(t.enrollLink || '');
    setDescription(t.description || '');
    setCertificateUrl(t.certificateUrl || generateCertificateSvgDataUrl(t.title, t.category, t.subType, t.standardCode));
    setIsActive(t.isActive !== false);
    setIsModalOpen(true);
  };

  // Handle Certificate Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit. Please upload an optimized image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCertificateUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Regenerate SVG certificate based on current form inputs
  const handleGenerateCertificateTemplate = () => {
    const effectiveCategory = isCustomCategory ? (customCategoryInput.trim() || 'Food Safety') : category;
    const certSvg = generateCertificateSvgDataUrl(
      title.trim() || 'Accredited Food Specialist Course',
      effectiveCategory,
      subType.trim(),
      standardCode.trim()
    );
    setCertificateUrl(certSvg);
  };

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a course title.');
      return;
    }

    const effectiveCategory = isCustomCategory
      ? (customCategoryInput.trim() || 'Specialist Training')
      : category;

    setIsSaving(true);
    try {
      const trainingId = editingTrainingId || `tr-${Date.now()}`;
      const payload: HubTraining = {
        id: trainingId,
        category: effectiveCategory,
        title: title.trim(),
        subType: subType.trim() || null,
        standardCode: standardCode.trim() || undefined,
        duration: duration.trim() || '3 Days',
        fees: fees.trim() || 'Contact for fee',
        enrollLink: enrollLink.trim() || 'https://wa.me/923008429104',
        description: description.trim() || 'Professional training qualification.',
        certificateUrl: certificateUrl || generateCertificateSvgDataUrl(title.trim(), effectiveCategory, subType.trim()),
        isActive
      };

      await onSaveTraining(payload, !editingTrainingId);
      setStatusMessage(
        editingTrainingId
          ? `Updated training: "${payload.title}"`
          : `Added new training: "${payload.title}" in ${payload.category}`
      );
      setIsModalOpen(false);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Save error:', err);
      alert('Error saving training: ' + (err.message || String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async (id: string) => {
    try {
      await onDeleteTraining(id);
      setDeleteConfirmId(null);
      setStatusMessage('Training deleted successfully.');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Error deleting training: ' + (err.message || String(err)));
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white border-2 border-[#16A34A] rounded-[24px] p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#15803D] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10.5px] font-extrabold uppercase tracking-wider">
                  Admin Control Panel
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {trainings.length} Total Courses
                </span>
              </div>
              <h1 className="text-[20px] sm:text-[22px] font-extrabold text-[#0D2E1B] leading-tight mt-0.5">
                Trainings &amp; Certificate Control Module
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Training</span>
            </button>

            {onCloseAdmin && (
              <button
                type="button"
                onClick={onCloseAdmin}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                title="Back to Portal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Status notification banner */}
        {statusMessage && (
          <div className="mt-3 bg-[#DCFCE7] border border-[#16A34A] text-[#0B3B1E] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#16A34A] stroke-[2.5]" />
              <span>{statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-[#15803D] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Category Tabs & Quick Add Category Bar */}
      <div className="bg-white border border-[#B8D3BE] rounded-[22px] p-3 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-[#0D2E1B] flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Course Categories:</span>
          </span>

          <button
            type="button"
            onClick={() => {
              setIsCustomCategory(true);
              handleOpenAddModal();
            }}
            className="text-[11.5px] font-bold text-[#15803D] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Category</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategoryFilter === 'All'
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'bg-[#F2F7F3] text-[#0D2E1B] hover:bg-[#E2EDE4]'
            }`}
          >
            All Categories ({trainings.length})
          </button>

          {existingCategories.map((cat) => {
            const count = trainings.filter((t) => t.category === cat).length;
            const isSelected = selectedCategoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#15803D] text-white shadow-xs'
                    : 'bg-[#F2F7F3] text-[#0D2E1B] hover:bg-[#E2EDE4]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-[#15803D]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by course title, standard (ISO 22000, HACCP...), or keywords..."
          className="w-full pl-10 pr-4 py-2.5 rounded-[18px] bg-white border border-[#B8D3BE] text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Trainings List */}
      <div className="space-y-3">
        {filteredTrainings.length === 0 ? (
          <div className="bg-white border border-emerald-100 rounded-[22px] p-8 text-center space-y-3">
            <Award className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-extrabold text-[#0D2E1B]">
              No trainings found in this category
            </h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              Add a new training course with certificate or reset the filter above.
            </p>
            <button
              type="button"
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 rounded-xl bg-[#15803D] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Training in {selectedCategoryFilter}</span>
            </button>
          </div>
        ) : (
          filteredTrainings.map((tr) => {
            const hasCertificate = Boolean(tr.certificateUrl);
            const certSample = tr.certificateUrl || generateCertificateSvgDataUrl(tr.title, tr.category, tr.subType, tr.standardCode);

            return (
              <div
                key={tr.id}
                className={`bg-white border rounded-[24px] p-4 shadow-sm hover:shadow-md transition-all ${
                  tr.isActive ? 'border-emerald-200/90' : 'border-gray-200 opacity-70 bg-gray-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Certificate Thumbnail Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewCertUrl(certSample)}
                      title="Click to view full certificate sample"
                      className="relative w-16 h-14 rounded-xl border border-emerald-300 overflow-hidden bg-emerald-50 shrink-0 group cursor-pointer shadow-2xs hover:scale-105 transition-transform"
                    >
                      <img
                        src={certSample}
                        alt="Certificate Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-[#15803D] text-white text-[8px] font-bold rounded-tl">
                        Cert
                      </span>
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] text-[10.5px] font-extrabold">
                          {tr.category}
                        </span>
                        {tr.subType && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10.5px] font-semibold border border-emerald-200">
                            {tr.subType}
                          </span>
                        )}
                        {!tr.isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold">
                            Draft / Inactive
                          </span>
                        )}
                      </div>

                      <h3 className="text-[17px] font-extrabold text-[#0B3B1E] leading-snug mt-1">
                        {tr.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>{tr.duration}</span>
                        </span>
                        <span className="flex items-center gap-1 font-bold text-[#15803D]">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{tr.fees}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: View in App, Edit, Delete */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => onViewTrainingInApp(tr.id)}
                      title="View live page in App"
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#15803D] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(tr)}
                      title="Edit this training"
                      className="px-3 py-1.5 rounded-xl bg-[#15803D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(tr.id)}
                      title="Delete training"
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed mt-2.5 line-clamp-2">
                  {tr.description}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* ==================== ADD / EDIT TRAINING MODAL ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-[560px] bg-white rounded-[28px] p-5 sm:p-6 shadow-2xl border-2 border-[#16A34A] max-h-[92vh] overflow-y-auto space-y-4 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center">
                  <Award className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-[18px] font-extrabold text-[#0D2E1B] leading-tight">
                    {editingTrainingId ? 'Edit Training & Certificate' : 'Post New Training Course'}
                  </h2>
                  <p className="text-[11.5px] text-gray-600 font-medium">
                    Controls public text, category, duration, fee &amp; certificate preview
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Category Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-[#0D2E1B]">
                  Training Category:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('Highfield');
                      setIsCustomCategory(false);
                      if (!subType) setSubType('UK Accredited');
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer text-center ${
                      !isCustomCategory && category === 'Highfield'
                        ? 'bg-[#15803D] border-[#15803D] text-white shadow-2xs'
                        : 'bg-[#F2F7F3] border-[#C6DFCB] text-gray-700 hover:bg-[#E2EDE4]'
                    }`}
                  >
                    Highfield
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('Lead Auditor');
                      setIsCustomCategory(false);
                      if (!subType) setSubType('IRCA | CQI');
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer text-center ${
                      !isCustomCategory && category === 'Lead Auditor'
                        ? 'bg-[#15803D] border-[#15803D] text-white shadow-2xs'
                        : 'bg-[#F2F7F3] border-[#C6DFCB] text-gray-700 hover:bg-[#E2EDE4]'
                    }`}
                  >
                    Lead Auditor
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(true);
                      if (!customCategoryInput) setCustomCategoryInput('');
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer text-center ${
                      isCustomCategory
                        ? 'bg-[#15803D] border-[#15803D] text-white shadow-2xs'
                        : 'bg-[#F2F7F3] border-[#C6DFCB] text-gray-700 hover:bg-[#E2EDE4]'
                    }`}
                  >
                    ➕ New Category
                  </button>
                </div>

                {/* If Custom Category Selected */}
                {isCustomCategory && (
                  <div className="mt-2 space-y-1 p-3 rounded-xl bg-[#DCFCE7]/60 border border-emerald-300">
                    <label className="block text-[11px] font-bold text-[#0D2E1B]">
                      Enter New Category Name (e.g. HACCP &amp; GMP, BRCGS, Halal Standards):
                    </label>
                    <input
                      type="text"
                      required
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="e.g. BRCGS Packaging &amp; Food Safety"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#16A34A] text-gray-900 font-semibold focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Title & SubType */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-extrabold text-[#0D2E1B]">
                    Course / Training Title:
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. HACCP Level 3 for Food Manufacturing"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F2F7F3] border border-[#AECBB5] text-gray-900 font-semibold focus:bg-white focus:outline-none focus:border-[#16A34A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-[#0D2E1B]">
                    Accreditation / SubType:
                  </label>
                  <input
                    type="text"
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    placeholder="e.g. IRCA | CQI, Exemplar Global"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F2F7F3] border border-[#AECBB5] text-gray-900 font-semibold focus:bg-white focus:outline-none focus:border-[#16A34A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-[#0D2E1B]">
                    Standard Code (Optional):
                  </label>
                  <input
                    type="text"
                    value={standardCode}
                    onChange={(e) => setStandardCode(e.target.value)}
                    placeholder="e.g. ISO 22000:2018 / FSSC v6"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F2F7F3] border border-[#AECBB5] text-gray-900 font-semibold focus:bg-white focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              {/* Duration & Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-[#0D2E1B]">
                    Duration:
                  </label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 5 Days (40 Hours)"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F2F7F3] border border-[#AECBB5] text-gray-900 font-semibold focus:bg-white focus:outline-none focus:border-[#16A34A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-[#0D2E1B]">
                    Course Fee / Investment:
                  </label>
                  <input
                    type="text"
                    required
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    placeholder="e.g. PKR 35,000 / USD 150"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F2F7F3] border border-[#AECBB5] text-gray-900 font-semibold focus:bg-white focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              {/* Course Description */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-[#0D2E1B]">
                  Course Description &amp; Modules:
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the course contents, prerequisites, who should attend, and learning outcomes..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F2F7F3] border border-[#AECBB5] text-gray-900 font-medium focus:bg-white focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              {/* Enroll Link / WhatsApp Contact */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-[#0D2E1B]">
                  Enrollment WhatsApp / Registration Link:
                </label>
                <input
                  type="url"
                  required
                  value={enrollLink}
                  onChange={(e) => setEnrollLink(e.target.value)}
                  placeholder="https://wa.me/923008429104?text=..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F2F7F3] border border-[#AECBB5] text-gray-900 font-medium focus:bg-white focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              {/* ==================== CERTIFICATE MANAGEMENT SECTION ==================== */}
              <div className="rounded-2xl border-2 border-emerald-300 bg-[#F0FDF4] p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#15803D]" />
                    <span className="text-xs font-extrabold text-[#0B3B1E]">
                      Accredited Certificate Sample (Public Preview)
                    </span>
                  </div>
                  <span className="text-[10.5px] font-bold text-[#15803D] bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Visible to Candidates
                  </span>
                </div>

                {/* Live Certificate Thumbnail Preview */}
                <div className="relative rounded-xl border border-emerald-300 overflow-hidden bg-white shadow-xs">
                  {certificateUrl ? (
                    <div className="relative group">
                      <img
                        src={certificateUrl}
                        alt="Certificate Preview"
                        className="w-full h-44 object-contain bg-slate-50 p-1"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewCertUrl(certificateUrl)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer gap-1.5"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Full Size Sample Certificate</span>
                      </button>
                    </div>
                  ) : (
                    <div className="h-28 flex flex-col items-center justify-center text-gray-500 text-xs gap-1">
                      <Award className="w-6 h-6 text-emerald-400" />
                      <span>No certificate attached yet</span>
                    </div>
                  )}
                </div>

                {/* Certificate Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateCertificateTemplate}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 border border-[#16A34A] text-[#15803D] text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Official Certificate</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-gray-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>Upload Certificate File</span>
                  </button>
                </div>
              </div>

              {/* Status Toggle (Active / Inactive) */}
              <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F2F7F3] border border-[#C6DFCB] cursor-pointer">
                <div>
                  <div className="text-xs font-extrabold text-[#0D2E1B]">
                    Active on Portal (Publicly Visible)
                  </div>
                  <div className="text-[11px] text-gray-600">
                    When active, candidates can view and enroll immediately.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 accent-[#15803D] rounded cursor-pointer"
                />
              </label>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#0D2E1B] text-white text-xs font-extrabold shadow-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{editingTrainingId ? 'Save Training Changes' : 'Publish Training'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-[380px] bg-white rounded-[24px] p-5 shadow-xl space-y-4 border-2 border-red-300">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold text-gray-900">
                Remove this Training Course?
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to remove this training and its associated certificate from the portal? This action will remove it for all users immediately.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold cursor-pointer"
              >
                Delete Training
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== FULLSCREEN CERTIFICATE LIGHTBOX ==================== */}
      {previewCertUrl && (
        <div
          onClick={() => setPreviewCertUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[850px] bg-white rounded-[24px] p-4 shadow-2xl space-y-3 cursor-default border-2 border-[#16A34A]"
          >
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#15803D]" />
                <h3 className="text-sm font-extrabold text-[#0D2E1B]">
                  Accredited Certificate Sample Preview
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCertUrl(null)}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-50 border border-emerald-200">
              <img
                src={previewCertUrl}
                alt="Full Certificate Sample"
                className="w-full h-auto max-h-[75vh] object-contain mx-auto"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span>Highfield Qualifications / IRCA CQI / Exemplar Global Accredited Sample</span>
              <button
                type="button"
                onClick={() => setPreviewCertUrl(null)}
                className="px-4 py-1.5 rounded-xl bg-[#15803D] text-white font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
