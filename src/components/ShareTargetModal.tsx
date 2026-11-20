import React, { useEffect, useRef, useState } from 'react';
import {
  Briefcase,
  Check,
  CheckCircle2,
  GraduationCap,
  Image as ImageIcon,
  Loader2,
  LogIn,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Upload,
  X
} from 'lucide-react';
import { CloudStorageConfig } from '../types/hub';
import { compressImageFile, uploadMediaFile } from '../lib/storage';
import {
  SharedTargetDraft,
  clearSharedTargetPayload
} from '../lib/shareTargetStorage';

export interface FlyerPublishPayload {
  section: 'job' | 'scholarship';
  jobCategory: string;
  scholarshipCategory: 'Fellowships' | 'International' | 'Grants';
  title: string;
  organization: string;
  location: string;
  country: string;
  hrEmail: string;
  applyLink: string;
  experienceOrDeadline: string;
  degreeLevel: string;
  description: string;
  requirementsOrEligibility: string;
  flyerImageUrl: string;
}

interface ShareTargetModalProps {
  isOpen: boolean;
  initialDraft: SharedTargetDraft | null;
  initialSection?: 'job' | 'scholarship';
  storageConfig: CloudStorageConfig;
  isSignedIn: boolean;
  isUserAdmin: boolean;
  onClose: () => void;
  onOpenAuthModal: () => void;
  onPublish: (payload: FlyerPublishPayload) => Promise<{
    id: string;
    section: 'job' | 'scholarship';
  } | null>;
  onNavigateToPublished?: (id: string, section: 'job' | 'scholarship') => void;
}

const JOB_CATEGORY_PRESETS = [
  'Quality & Safety',
  'R&D Lab',
  'Production',
  'Food Safety & HACCP',
  'Dairy & Beverages',
  'Nutrition & Dietetics',
  'Internship'
];

const SCHOLARSHIP_CATEGORIES: Array<
  'Fellowships' | 'International' | 'Grants'
> = ['Fellowships', 'International', 'Grants'];

export const ShareTargetModal: React.FC<ShareTargetModalProps> = ({
  isOpen,
  initialDraft,
  initialSection = 'job',
  storageConfig,
  isSignedIn,
  isUserAdmin,
  onClose,
  onOpenAuthModal,
  onPublish,
  onNavigateToPublished
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const autoScannedKeyRef = useRef<string>('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [section, setSection] = useState<'job' | 'scholarship'>(initialSection);
  const [jobCategory, setJobCategory] = useState<string>('Quality & Safety');
  const [customJobTag, setCustomJobTag] = useState<string>('');
  const [schCategory, setSchCategory] = useState<
    'Fellowships' | 'International' | 'Grants'
  >('International');

  const [title, setTitle] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [country, setCountry] = useState<string>('Pakistan');
  const [hrEmail, setHrEmail] = useState<string>('');
  const [applyLink, setApplyLink] = useState<string>('');
  const [experienceOrDeadline, setExperienceOrDeadline] = useState<string>('');
  const [degreeLevel, setDegreeLevel] = useState<string>('BS / MS / PhD');
  const [description, setDescription] = useState<string>('');
  const [requirementsOrEligibility, setRequirementsOrEligibility] =
    useState<string>('');

  const [isScanningAi, setIsScanningAi] = useState<boolean>(false);
  const [aiStatusMsg, setAiStatusMsg] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [publishedResult, setPublishedResult] = useState<{
    id: string;
    section: 'job' | 'scholarship';
  } | null>(null);

  // Sync incoming shared draft when modal opens or a fresh share arrives
  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    setPublishedResult(null);

    if (initialDraft) {
      if (initialDraft.file) {
        setSelectedFile(initialDraft.file);
      }
      const combinedText = [
        initialDraft.title,
        initialDraft.text,
        initialDraft.url
      ]
        .filter(Boolean)
        .join('\n')
        .trim();

      if (combinedText) {
        setDescription((prev) => prev || combinedText);
        const firstLine = combinedText.split(/\r?\n/)[0]?.trim() || '';
        if (firstLine) {
          setTitle((prev) => prev || firstLine.slice(0, 180));
        }
        const detectedEmail =
          combinedText.match(
            /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
          )?.[0] || '';
        if (detectedEmail) {
          setHrEmail((prev) => prev || detectedEmail);
        }
        const detectedUrl =
          combinedText.match(/https?:\/\/[^\s)]+/)?.[0] || '';
        if (detectedUrl) {
          setApplyLink((prev) => prev || detectedUrl);
        }
      }
    } else if (initialSection) {
      setSection(initialSection);
      if (initialSection === 'scholarship') {
        setCountry((prev) => (prev === 'Pakistan' ? 'International' : prev));
      }
    }
  }, [isOpen, initialDraft, initialSection]);

  // Create/revoke object URL for preview
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }
    const objUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objUrl);
    return () => {
      URL.revokeObjectURL(objUrl);
    };
  }, [selectedFile]);

  const runAiFlyerExtraction = async (fileToScan: File) => {
    setIsScanningAi(true);
    setAiStatusMsg('Reading flyer text automatically...');
    setErrorMsg(null);
    try {
      const compressed = await compressImageFile(fileToScan, 1100, 0.78);
      const sharedHint = [
        initialDraft?.title,
        initialDraft?.text,
        initialDraft?.url
      ]
        .filter(Boolean)
        .join('\n');

      const res = await fetch('/api/extract-flyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: compressed.dataUrl,
          mimeType: 'image/jpeg',
          sharedText: sharedHint
        })
      });

      if (!res.ok) {
        setAiStatusMsg(
          'Auto-read unavailable — choose section & category and edit fields below.'
        );
        return;
      }

      const data = (await res.json()) as {
        extracted?: {
          section?: 'job' | 'scholarship';
          suggestedJobCategory?: string;
          suggestedScholarshipCategory?:
            | 'Fellowships'
            | 'International'
            | 'Grants';
          title?: string;
          organization?: string;
          location?: string;
          country?: string;
          hrEmail?: string;
          applyLink?: string;
          experienceOrDeadline?: string;
          degreeLevel?: string;
          description?: string;
          requirementsOrEligibility?: string;
        };
      };

      const ex = data.extracted;
      if (!ex) {
        setAiStatusMsg('Ready — select category and publish below.');
        return;
      }

      if (ex.section === 'scholarship' || ex.section === 'job') {
        setSection(ex.section);
      }
      if (ex.suggestedJobCategory) {
        if (JOB_CATEGORY_PRESETS.includes(ex.suggestedJobCategory)) {
          setJobCategory(ex.suggestedJobCategory);
        } else {
          setCustomJobTag(ex.suggestedJobCategory);
          setJobCategory(ex.suggestedJobCategory);
        }
      }
      if (ex.suggestedScholarshipCategory) {
        setSchCategory(ex.suggestedScholarshipCategory);
      }
      if (ex.title) setTitle(ex.title);
      if (ex.organization) setOrganization(ex.organization);
      if (ex.location) setLocation(ex.location);
      if (ex.country) setCountry(ex.country);
      if (ex.hrEmail) setHrEmail(ex.hrEmail);
      if (ex.applyLink) setApplyLink(ex.applyLink);
      if (ex.experienceOrDeadline)
        setExperienceOrDeadline(ex.experienceOrDeadline);
      if (ex.degreeLevel) setDegreeLevel(ex.degreeLevel);
      if (ex.description) setDescription(ex.description);
      if (ex.requirementsOrEligibility)
        setRequirementsOrEligibility(ex.requirementsOrEligibility);

      setAiStatusMsg(
        `AI detected ${
          ex.section === 'scholarship' ? 'Scholarship' : 'Job'
        } details from flyer! Review or adjust category before posting.`
      );
    } catch {
      setAiStatusMsg(
        'Auto-read skipped — enter a short title, choose category, and publish directly.'
      );
    } finally {
      setIsScanningAi(false);
    }
  };

  // Auto-scan newly shared image once when modal opens with an image
  useEffect(() => {
    if (!isOpen || !selectedFile) return;
    const scanKey = `${selectedFile.name}:${selectedFile.size}:${
      initialDraft?.receivedAt || 0
    }`;
    if (autoScannedKeyRef.current === scanKey) return;
    autoScannedKeyRef.current = scanKey;
    void runAiFlyerExtraction(selectedFile);
  }, [isOpen, selectedFile, initialDraft?.receivedAt]);

  if (!isOpen) return null;

  const activeJobTag = customJobTag.trim() || jobCategory || 'Quality & Safety';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }
    setErrorMsg(null);
    setSelectedFile(picked);
    autoScannedKeyRef.current = '';
  };

  const handleResetAndClose = async () => {
    await clearSharedTargetPayload();
    setSelectedFile(null);
    setTitle('');
    setOrganization('');
    setLocation('');
    setHrEmail('');
    setApplyLink('');
    setExperienceOrDeadline('');
    setDescription('');
    setRequirementsOrEligibility('');
    setAiStatusMsg(null);
    setErrorMsg(null);
    setPublishedResult(null);
    autoScannedKeyRef.current = '';
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isSignedIn || !isUserAdmin) {
      setErrorMsg(
        'Admin sign-in (mindmademedia9@gmail.com) is required to publish directly to live Jobs / Scholarships.'
      );
      return;
    }

    if (!selectedFile && !title.trim() && !description.trim()) {
      setErrorMsg(
        'Please attach a flyer picture or enter a headline/description.'
      );
      return;
    }

    setIsPublishing(true);
    try {
      let uploadedFlyerUrl = '';
      if (selectedFile) {
        const uploaded = await uploadMediaFile(
          selectedFile,
          'flyers',
          storageConfig
        );
        uploadedFlyerUrl = uploaded.url;
        if (
          uploadedFlyerUrl.startsWith('data:') &&
          uploadedFlyerUrl.length > 445000
        ) {
          const tighter = await compressImageFile(selectedFile, 820, 0.55);
          uploadedFlyerUrl = tighter.dataUrl;
        }
        if (uploadedFlyerUrl.length > 448000) {
          throw new Error(
            'Compressed image is still too large for Firestore. Please choose a smaller screenshot.'
          );
        }
      }

      const defaultTitle =
        section === 'job'
          ? `${activeJobTag} Opportunity`
          : `${schCategory} — Food Science Scholarship`;

      const defaultDesc =
        section === 'job'
          ? 'Please view the attached official job flyer poster for full role details, qualification, and how to apply.'
          : 'Please view the attached official scholarship poster for full eligibility, funding benefits, and application details.';

      const result = await onPublish({
        section,
        jobCategory: activeJobTag,
        scholarshipCategory: schCategory,
        title: (title.trim() || defaultTitle).slice(0, 200),
        organization: (
          organization.trim() ||
          (section === 'job'
            ? ''
            : 'Global Academic & Research Institute')
        ).slice(0, 200),
        location: (
          location.trim() ||
          country.trim() ||
          (section === 'job' ? 'Pakistan' : 'International')
        ).slice(0, 180),
        country: (
          country.trim() || (section === 'job' ? 'Pakistan' : 'International')
        ).slice(0, 100),
        hrEmail: hrEmail.trim().slice(0, 180),
        applyLink: applyLink.trim().slice(0, 480) || '#',
        experienceOrDeadline: experienceOrDeadline.trim().slice(0, 100),
        degreeLevel: degreeLevel.trim().slice(0, 100) || 'BS / MS / PhD',
        description: (description.trim() || defaultDesc).slice(0, 7500),
        requirementsOrEligibility: requirementsOrEligibility.trim().slice(0, 7500),
        flyerImageUrl: uploadedFlyerUrl
      });

      if (result) {
        await clearSharedTargetPayload();
        setPublishedResult(result);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Failed to publish post. Please try again.'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0C182D]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-[#D2DEEA] rounded-[26px] p-4 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[94dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#D2DEEA] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF4FC] border border-[#1673B8]/30 text-[#1673B8] flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[10.5px] font-extrabold uppercase tracking-wider">
                WhatsApp / Gallery Flyer Publisher
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138] leading-snug mt-0.5">
                Post Shared Picture to Jobs or Scholarships
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              void handleResetAndClose();
            }}
            aria-label="Close Flyer Publisher"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {publishedResult ? (
          <div className="py-5 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-emerald-950">
                Published Live to{' '}
                {publishedResult.section === 'scholarship'
                  ? 'Scholarships'
                  : 'Jobs & Internships'}
                !
              </h3>
              <p className="text-xs text-emerald-800 font-medium mt-1">
                Your flyer image and post details are now visible to all Food
                Science Portal visitors.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {onNavigateToPublished && (
                <button
                  type="button"
                  onClick={() => {
                    const target = publishedResult;
                    setPublishedResult(null);
                    onClose();
                    onNavigateToPublished(target.id, target.section);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer"
                >
                  View Published Post
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  void handleResetAndClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-extrabold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Auth Notice (Preserves Shared Flyer!) */}
            {(!isSignedIn || !isUserAdmin) && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-start gap-2 text-xs text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold">
                      {!isSignedIn
                        ? 'Admin Sign-In Required to Publish'
                        : 'Signed in as Non-Admin Account'}
                    </p>
                    <p className="text-[11px] font-medium text-amber-900 mt-0.5">
                      {!isSignedIn
                        ? 'Your shared image is safely kept ready. Sign in as Admin to publish directly into Jobs or Scholarships.'
                        : 'Only the portal Admin account (mindmademedia9@gmail.com) can publish official Jobs & Scholarships.'}
                    </p>
                  </div>
                </div>
                {!isSignedIn && (
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In Now</span>
                  </button>
                )}
              </div>
            )}

            {/* Shared / Selected Image Preview + Upload Controls */}
            <div className="rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] p-3 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#1A2138]">
                  1. Job / Scholarship Picture (Flyer)
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile && (
                    <button
                      type="button"
                      disabled={isScanningAi}
                      onClick={() => void runAiFlyerExtraction(selectedFile)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] disabled:opacity-60 text-white text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {isScanningAi ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-sky-300" />
                      )}
                      <span>
                        {isScanningAi ? 'Reading Flyer...' : 'Re-Scan Text'}
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#94B8D7] text-[#1673B8] text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>
                      {selectedFile ? 'Change Image' : 'Select Picture'}
                    </span>
                  </button>
                </div>
              </div>

              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden bg-white border border-[#D2DEEA] p-1.5">
                  <img
                    src={previewUrl}
                    alt="Shared Job or Scholarship Flyer"
                    className="max-h-56 w-full object-contain rounded-lg mx-auto"
                  />
                  {isScanningAi && (
                    <div className="mt-2 px-3 py-1.5 rounded-lg bg-[#EBF4FC] text-[#105E9A] text-[11px] font-bold flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                      <span>Extracting title, company, and details from image...</span>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 px-4 rounded-xl border-2 border-dashed border-[#94B8D7] hover:border-[#1673B8] bg-white text-center space-y-1 cursor-pointer transition-colors"
                >
                  <Upload className="w-6 h-6 text-[#1673B8] mx-auto" />
                  <p className="text-xs font-extrabold text-[#1A2138]">
                    Tap to choose a Job or Scholarship image from gallery
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    JPG, PNG, or WebP — auto-compressed &amp; text auto-read
                  </p>
                </button>
              )}

              {aiStatusMsg && !isScanningAi && (
                <p className="text-[11px] font-bold text-[#105E9A] bg-white/80 px-2.5 py-1.5 rounded-lg border border-[#D2DEEA]">
                  {aiStatusMsg}
                </p>
              )}
            </div>

            {/* 2. Target Section Choice: JOBS vs SCHOLARSHIPS */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#1A2138]">
                2. Choose Where to Publish (Section):
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSection('job');
                    if (country === 'International') setCountry('Pakistan');
                  }}
                  className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                    section === 'job'
                      ? 'bg-[#1673B8] border-[#1673B8] text-white shadow-sm'
                      : 'bg-[#F0F6FC] border-[#D2DEEA] text-[#1A2138] hover:border-[#1673B8]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      section === 'job'
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-[#1673B8]'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold">
                      Jobs Section
                    </div>
                    <div
                      className={`text-[10.5px] font-medium ${
                        section === 'job' ? 'text-sky-100' : 'text-slate-500'
                      }`}
                    >
                      Food Tech, QA/QC, R&amp;D
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSection('scholarship');
                    if (!country || country === 'Pakistan') {
                      setCountry('International');
                    }
                  }}
                  className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                    section === 'scholarship'
                      ? 'bg-[#1673B8] border-[#1673B8] text-white shadow-sm'
                      : 'bg-[#F0F6FC] border-[#D2DEEA] text-[#1A2138] hover:border-[#1673B8]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      section === 'scholarship'
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-[#1673B8]'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold">
                      Scholarships Section
                    </div>
                    <div
                      className={`text-[10.5px] font-medium ${
                        section === 'scholarship'
                          ? 'text-sky-100'
                          : 'text-slate-500'
                      }`}
                    >
                      Fellowships, MS/PhD, Grants
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Category Choice */}
            {section === 'job' ? (
              <div className="space-y-2 p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
                <label className="block text-xs font-extrabold text-[#1A2138]">
                  3. Choose Job Category / Tag (Active:{' '}
                  <span className="text-[#1673B8]">{activeJobTag}</span>):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {JOB_CATEGORY_PRESETS.map((cat) => {
                    const selected = !customJobTag.trim() && jobCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCustomJobTag('');
                          setJobCategory(cat);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border cursor-pointer transition-colors ${
                          selected
                            ? 'bg-[#1673B8] text-white border-[#1673B8]'
                            : 'bg-white text-[#1A2138] border-[#D2DEEA] hover:bg-[#EBF4FC]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={customJobTag}
                  onChange={(e) => setCustomJobTag(e.target.value)}
                  placeholder="Or type any custom job category tag (e.g. Dairy QA, Regulatory Affairs)..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>
            ) : (
              <div className="space-y-2 p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
                <label className="block text-xs font-extrabold text-[#1A2138]">
                  3. Choose Scholarship Category:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SCHOLARSHIP_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSchCategory(cat)}
                      className={`py-2 px-3 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                        schCategory === cat
                          ? 'bg-[#1673B8] text-white border-[#1673B8]'
                          : 'bg-white text-[#1A2138] border-[#D2DEEA] hover:bg-[#EBF4FC]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Editable Post Fields */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    {section === 'job'
                      ? 'Job Title / Headline'
                      : 'Scholarship Title'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      section === 'job'
                        ? 'e.g. QA / Food Safety Officer'
                        : 'e.g. Erasmus Mundus Food Science MS'
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] focus:border-[#1673B8] focus:bg-white text-xs font-semibold text-[#1A2138] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    {section === 'job'
                      ? 'Company / Employer'
                      : 'University / Organization'}
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder={
                      section === 'job'
                        ? 'e.g. Engro Foods / Nestle'
                        : 'e.g. Wageningen University'
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] focus:border-[#1673B8] focus:bg-white text-xs font-semibold text-[#1A2138] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder={section === 'job' ? 'Pakistan' : 'International'}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] focus:border-[#1673B8] focus:bg-white text-xs font-semibold text-[#1A2138] focus:outline-none"
                  />
                </div>

                {section === 'job' ? (
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Lahore, Pakistan"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] focus:border-[#1673B8] focus:bg-white text-xs font-semibold text-[#1A2138] focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Degree Level
                    </label>
                    <input
                      type="text"
                      value={degreeLevel}
                      onChange={(e) => setDegreeLevel(e.target.value)}
                      placeholder="BS / MS / PhD"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] focus:border-[#1673B8] focus:bg-white text-xs font-semibold text-[#1A2138] focus:outline-none"
                    />
                  </div>
                )}

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    {section === 'job' ? 'Experience' : 'Deadline (YYYY-MM-DD)'}
                  </label>
                  <input
                    type="text"
                    value={experienceOrDeadline}
                    onChange={(e) => setExperienceOrDeadline(e.target.value)}
                    placeholder={
                      section === 'job' ? 'e.g. 2+ Years' : '2026-12-31'
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] focus:border-[#1673B8] focus:bg-white text-xs font-semibold text-[#1A2138] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    HR / Admissions Email (Optional)
                  </label>
                  <input
                    type="text"
                    value={hrEmail}
                    onChange={(e) => setHrEmail(e.target.value)}
                    placeholder="careers@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] focus:border-[#1673B8] focus:bg-white text-xs font-semibold text-[#1A2138] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Apply Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={applyLink}
                    onChange={(e) => setApplyLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] focus:border-[#1673B8] focus:bg-white text-xs font-semibold text-[#1A2138] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Description / Details (Visitors can read text &amp; view full
                  flyer picture)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Extra summary, WhatsApp number, salary/stipend, or instructions..."
                  className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] focus:border-[#1673B8] focus:bg-white text-xs font-medium text-[#1A2138] leading-relaxed focus:outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            {/* Submit Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  void handleResetAndClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isPublishing || !isSignedIn || !isUserAdmin}
                className="py-3 px-5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Live...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      Publish to{' '}
                      {section === 'job'
                        ? `Jobs (${activeJobTag})`
                        : `Scholarships (${schCategory})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
