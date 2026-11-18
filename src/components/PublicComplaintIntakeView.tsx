import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  Loader2,
  Lock,
  MapPin,
  Phone,
  Send,
  ShieldCheck
} from 'lucide-react';
import { doc, getDoc, increment, writeBatch } from 'firebase/firestore';
import {
  db,
  OperationType,
  handleFirestoreError
} from '../lib/firebase';
import { compressImageFile } from '../lib/storage';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import { DEFAULT_COMPLAINT_CATEGORIES } from '../lib/complaintPdfGenerator';
import {
  ComplaintOrganizationProfile,
  ComplaintSeverity,
  FREE_COMPLAINT_QUOTA,
  HubUser,
  OrganizationComplaintRecord
} from '../types/hub';

interface PublicComplaintIntakeViewProps {
  orgId: string;
  demoOrgPreview?: ComplaintOrganizationProfile | null;
  demoQuotaReached?: boolean;
  onSubmitDemoComplaint?: (record: OrganizationComplaintRecord) => void;
  onBackToPortal?: () => void;
}

export const PublicComplaintIntakeView: React.FC<
  PublicComplaintIntakeViewProps
> = ({
  orgId,
  demoOrgPreview,
  demoQuotaReached = false,
  onSubmitDemoComplaint,
  onBackToPortal
}) => {
  const [org, setOrg] = useState<ComplaintOrganizationProfile | null>(
    demoOrgPreview || null
  );
  const [ownerIsPaid, setOwnerIsPaid] = useState<boolean>(false);
  const [loadingOrg, setLoadingOrg] = useState<boolean>(!demoOrgPreview);
  const [orgError, setOrgError] = useState<string | null>(null);

  const [complainantName, setComplainantName] = useState('');
  const [complainantPhone, setComplainantPhone] = useState('');
  const [complainantEmail, setComplainantEmail] = useState('');
  const [category, setCategory] = useState<string>(
    DEFAULT_COMPLAINT_CATEGORIES[0]
  );
  const [severity, setSeverity] = useState<ComplaintSeverity>('medium');
  const [batchOrOrderRef, setBatchOrOrderRef] = useState('');
  const [incidentDate, setIncidentDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [evidencePhotoUrl, setEvidencePhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] =
    useState<OrganizationComplaintRecord | null>(null);

  useEffect(() => {
    if (demoOrgPreview) {
      setOrg(demoOrgPreview);
      setLoadingOrg(false);
      if (
        demoOrgPreview.categories &&
        demoOrgPreview.categories.length > 0
      ) {
        setCategory(demoOrgPreview.categories[0]);
      }
      return;
    }

    if (!orgId) {
      setOrgError('Invalid QR link: organization reference is missing.');
      setLoadingOrg(false);
      return;
    }

    let cancelled = false;
    setLoadingOrg(true);
    setOrgError(null);

    Promise.all([
      getDoc(doc(db, 'complaintOrgs', orgId)),
      getDoc(doc(db, 'users', orgId)).catch(() => null)
    ])
      .then(([snap, ownerSnap]) => {
        if (cancelled) return;
        if (!snap.exists()) {
          setOrgError(
            'This Complaint QR Portal was not found or has not been activated yet.'
          );
          setOrg(null);
        } else {
          const data = snap.data() as ComplaintOrganizationProfile;
          setOrg(data);
          if (data.categories && data.categories.length > 0) {
            setCategory(data.categories[0]);
          }
          if (ownerSnap && ownerSnap.exists()) {
            const ownerData = ownerSnap.data() as Partial<HubUser>;
            const notExpired =
              !ownerData.premiumExpiresAt ||
              Number.isNaN(new Date(ownerData.premiumExpiresAt).getTime()) ||
              new Date(ownerData.premiumExpiresAt).getTime() > Date.now();
            const activePaid = Boolean(
              ownerData.isAdmin ||
                ((ownerData.isPaid || ownerData.isPremium) && notExpired)
            );
            setOwnerIsPaid(activePaid);
          } else {
            setOwnerIsPaid(false);
          }
        }
        setLoadingOrg(false);
      })
      .catch(() => {
        if (!cancelled) {
          setOrgError(
            'Unable to connect to the Complaint Portal right now. Please check your internet connection and retry.'
          );
          setLoadingOrg(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [orgId, demoOrgPreview]);

  const isFreeQuotaExhausted = demoOrgPreview
    ? demoQuotaReached
    : Boolean(org && !ownerIsPaid && (org.complaintsCount ?? 0) >= FREE_COMPLAINT_QUOTA);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    setSubmitError(null);
    try {
      const compressed = await compressImageFile(file, 720, 0.72);
      if (compressed.dataUrl.length > 420000) {
        setSubmitError(
          'Photo is too large even after compression. Please select a smaller image.'
        );
      } else {
        setEvidencePhotoUrl(compressed.dataUrl);
      }
    } catch {
      setSubmitError('Could not process selected photo. Please try another.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;

    const cleanName = complainantName.trim().slice(0, 120);
    const cleanSubject = subject.trim().slice(0, 200);
    const cleanDesc = description.trim().slice(0, 4000);

    if (!cleanName || !cleanSubject || !cleanDesc) {
      setSubmitError(
        'Please complete Your Name, Subject, and Complaint Details.'
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const nowIso = new Date().toISOString().slice(0, 19) + 'Z';
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `cmp_${Date.now()}_${randDigits}`;
    const complaintCode = `CMP-${new Date().getFullYear()}-${randDigits}`;

    const cleanPayload: OrganizationComplaintRecord = {
      id: complaintId,
      orgId: org.orgId,
      complaintCode,
      companyNameSnapshot: org.companyName.trim().slice(0, 160),
      complainantName: cleanName,
      category: (category || 'Other Concern').trim().slice(0, 100),
      severity,
      subject: cleanSubject,
      description: cleanDesc,
      status: 'open',
      createdAt: nowIso
    };

    if (complainantPhone.trim()) {
      cleanPayload.complainantPhone = complainantPhone.trim().slice(0, 60);
    }
    if (complainantEmail.trim()) {
      cleanPayload.complainantEmail = complainantEmail.trim().slice(0, 200);
    }
    if (batchOrOrderRef.trim()) {
      cleanPayload.batchOrOrderRef = batchOrOrderRef.trim().slice(0, 120);
    }
    if (incidentDate.trim()) {
      cleanPayload.incidentDate = incidentDate.trim().slice(0, 64);
    }
    if (evidencePhotoUrl) {
      cleanPayload.evidencePhotoUrl = evidencePhotoUrl.slice(0, 450000);
    }

    try {
      if (isFreeQuotaExhausted) {
        setSubmitError(
          `This organization has reached its Free Plan limit of ${FREE_COMPLAINT_QUOTA} complaints. Only Paid Plan accounts can accept additional complaints.`
        );
        return;
      }

      if (demoOrgPreview && onSubmitDemoComplaint) {
        onSubmitDemoComplaint(cleanPayload);
        setSubmittedRecord(cleanPayload);
        return;
      }

      const targetPath = `complaintOrgs/${org.orgId}/complaints/${complaintId}`;
      try {
        const batch = writeBatch(db);
        batch.set(
          doc(db, 'complaintOrgs', org.orgId, 'complaints', complaintId),
          cleanPayload
        );
        batch.update(doc(db, 'complaintOrgs', org.orgId), {
          complaintsCount: increment(1),
          lastComplaintId: complaintId,
          updatedAt: nowIso
        });
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, targetPath);
      }
      setOrg((prev) =>
        prev
          ? {
              ...prev,
              complaintsCount: (prev.complaintsCount ?? 0) + 1,
              lastComplaintId: complaintId
            }
          : prev
      );
      setSubmittedRecord(cleanPayload);
    } catch {
      setSubmitError(
        'Complaint could not be submitted. This organization may have reached its 10-complaint Free Plan limit or encountered a connection issue.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormForAnother = () => {
    setSubmittedRecord(null);
    setSubject('');
    setDescription('');
    setBatchOrOrderRef('');
    setEvidencePhotoUrl('');
    setSubmitError(null);
  };

  if (loadingOrg) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#1673B8] animate-spin" />
        <p className="text-sm font-bold text-[#1A2138]">
          Loading Organization Complaint Portal...
        </p>
      </div>
    );
  }

  if (orgError || !org) {
    return (
      <div className="max-w-lg mx-auto my-8 bg-white border border-[#D2DEEA] rounded-2xl p-6 text-center space-y-4 shadow-xs">
        <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
        <h2 className="text-lg font-bold text-[#1A2138]">
          Complaint Portal Unavailable
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {orgError || 'Organization portal could not be loaded.'}
        </p>
        {onBackToPortal && (
          <button
            type="button"
            onClick={onBackToPortal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>
        )}
      </div>
    );
  }

  if (!org.isActive) {
    return (
      <div className="max-w-lg mx-auto my-8 bg-white border border-[#D2DEEA] rounded-2xl p-6 text-center space-y-4 shadow-xs">
        <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
        <h2 className="text-lg font-bold text-[#1A2138]">
          {org.companyName} — Portal Paused
        </h2>
        <p className="text-sm text-slate-600">
          This organization has temporarily paused online QR complaint submissions. Please contact them directly.
        </p>
        {onBackToPortal && (
          <button
            type="button"
            onClick={onBackToPortal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1673B8] text-white text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Website</span>
          </button>
        )}
      </div>
    );
  }

  if (isFreeQuotaExhausted) {
    return (
      <div className="max-w-lg mx-auto my-8 bg-white border border-[#D2DEEA] rounded-2xl p-6 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#1A2138]">
          {org.companyName} — Free Complaint Quota Reached
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          This organization has reached its Free Tier allowance of{' '}
          <strong>{FREE_COMPLAINT_QUOTA} complaints</strong>. Only Paid Plan accounts can continue accumulating QR complaints, saving records, and generating CAPA PDF reports.
        </p>
        {(org.contactPhone || org.contactEmail) && (
          <div className="p-3 rounded-xl bg-[#F4F8FD] border border-[#D2DEEA] text-xs text-[#1A2138] space-y-1">
            <div className="font-bold">Direct Organization Contact:</div>
            {org.contactPhone && <div>Phone: {org.contactPhone}</div>}
            {org.contactEmail && <div>Email: {org.contactEmail}</div>}
          </div>
        )}
        {onBackToPortal && (
          <button
            type="button"
            onClick={onBackToPortal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1673B8] text-white text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{demoOrgPreview ? 'Back to Complaint Directory' : 'Return to Website'}</span>
          </button>
        )}
      </div>
    );
  }

  const categoryOptions =
    org.categories && org.categories.length > 0
      ? org.categories
      : DEFAULT_COMPLAINT_CATEGORIES;

  return (
    <div className="max-w-2xl mx-auto py-4 px-2 sm:px-0 space-y-4">
      {onBackToPortal && (
        <button
          type="button"
          onClick={onBackToPortal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D2DEEA] hover:bg-[#F0F6FC] text-[#1A2138] text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{demoOrgPreview ? 'Back to Complaint Dashboard' : 'Visit Food Science Portal'}</span>
        </button>
      )}

      {/* Branded Organization Header Card */}
      <div className="bg-white border border-[#D2DEEA] rounded-2xl overflow-hidden shadow-xs">
        <div className="bg-[#1A2138] px-5 py-4 text-white flex items-center gap-4 border-b-4 border-[#1673B8]">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={org.logoUrl || FS_PORTAL_LOGO_DATA_URI}
              alt={org.companyName}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
              {org.organizationType}
            </p>
            <h1 className="text-lg sm:text-xl font-bold text-white leading-tight truncate">
              {org.companyName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-200 mt-1">
              {org.branchLocation && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-300" />
                  <span>{org.branchLocation}</span>
                </span>
              )}
              {org.contactPhone && (
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Phone className="w-3 h-3 text-sky-300" />
                  <span>{org.contactPhone}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {submittedRecord ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#1A2138]">
                  Complaint Registered Successfully
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{submittedRecord.complainantName}</strong>. Your concern has been delivered directly to{' '}
                  <strong>{org.companyName}</strong>&apos;s Quality &amp; Management directory.
                </p>
              </div>

              <div className="max-w-sm mx-auto rounded-xl bg-[#F4F8FD] border border-[#D2DEEA] p-4 space-y-2 text-left text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Reference ID</span>
                  <span className="font-mono font-bold text-[#1673B8] tabular-nums">
                    {submittedRecord.complaintCode}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="font-bold text-amber-700">OPEN — Under Review</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Category</span>
                  <span className="font-semibold text-[#1A2138]">
                    {submittedRecord.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={resetFormForAnother}
                  className="px-4 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-bold cursor-pointer"
                >
                  Submit Another Complaint
                </button>
                {onBackToPortal && (
                  <button
                    type="button"
                    onClick={onBackToPortal}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1A2138] text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-[#1A2138]">
                  Customer Complaint &amp; Feedback Form
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {org.welcomeNote ||
                    'Please share full details below. Every submission is routed privately to this organization’s Quality & Management team for Root Cause & Corrective Action.'}
                </p>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A2138] mb-1">
                    Your Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs sm:text-sm text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2138] mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    maxLength={60}
                    value={complainantPhone}
                    onChange={(e) => setComplainantPhone(e.target.value)}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs sm:text-sm text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A2138] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    maxLength={200}
                    value={complainantEmail}
                    onChange={(e) => setComplainantEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs sm:text-sm text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2138] mb-1">
                    Order / Batch / Receipt No.
                  </label>
                  <input
                    type="text"
                    maxLength={120}
                    value={batchOrOrderRef}
                    onChange={(e) => setBatchOrOrderRef(e.target.value)}
                    placeholder="e.g. Table #4 or Batch #L2411"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs sm:text-sm text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1A2138] mb-1">
                    Complaint Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs sm:text-sm text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2138] mb-1">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs sm:text-sm text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1.5">
                  Urgency / Severity Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'low', label: 'Low' },
                      { id: 'medium', label: 'Medium' },
                      { id: 'high', label: 'High' },
                      { id: 'critical', label: 'Critical' }
                    ] as const
                  ).map((sev) => (
                    <button
                      key={sev.id}
                      type="button"
                      onClick={() => setSeverity(sev.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                        severity === sev.id
                          ? sev.id === 'critical'
                            ? 'bg-red-600 text-white border-red-600'
                            : sev.id === 'high'
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-[#1673B8] text-white border-[#1673B8]'
                          : 'bg-[#F8FAFC] text-[#1A2138] border-[#D2DEEA] hover:bg-[#F0F6FC]'
                      }`}
                    >
                      {sev.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Complaint Subject / Summary <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Short title describing the issue"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs sm:text-sm text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Detailed Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={4000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe what happened, product/dish name, time, and any relevant details..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs sm:text-sm text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2138] mb-1">
                  Attach Photo Evidence (Optional)
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#9AC2E6] bg-[#F4F8FD] hover:bg-[#EBF4FC] text-xs font-bold text-[#1673B8] cursor-pointer">
                  {isUploadingPhoto ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <span>
                    {evidencePhotoUrl
                      ? 'Photo Attached ✓ (Click to replace)'
                      : 'Upload Photo from Camera / Gallery'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {evidencePhotoUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={evidencePhotoUrl}
                      alt="Complaint evidence"
                      className="w-20 h-20 object-cover rounded-lg border border-[#D2DEEA]"
                    />
                    <button
                      type="button"
                      onClick={() => setEvidencePhotoUrl('')}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isUploadingPhoto}
                className="w-full py-3.5 px-5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-60 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Complaint...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Official Complaint</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
                <span>
                  Delivered privately to {org.companyName}&apos;s isolated Quality Directory
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
