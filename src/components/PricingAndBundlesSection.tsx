import React, { useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Crown,
  Download,
  FileText,
  Layers,
  ShieldCheck,
  Upload,
  X
} from 'lucide-react';
import {
  INTERNATIONAL_TRAINING_COURSES,
  InternationalTrainingCourse
} from '../data/internationalTrainingsData';
import { PaymentGatewayConfig } from '../types/hub';

export interface CertificateBundleOption {
  id: 'single-1' | 'bundle-3' | 'bundle-5' | 'bundle-13';
  title: string;
  subtitle: string;
  count: number;
  priceRs: number;
  originalPriceRs: number;
  savingsRs: number;
  recommendedCourses: string[];
  highlight?: boolean;
}

export const CERTIFICATE_BUNDLE_OPTIONS: CertificateBundleOption[] = [
  {
    id: 'single-1',
    title: 'Single Certificate Pass',
    subtitle: 'Official Portrait PDF Certificate + 1 Month FREE Paid Membership Included',
    count: 1,
    priceRs: 1000,
    originalPriceRs: 1000,
    savingsRs: 0,
    recommendedCourses: ['Any 1 Completed Training Course (60%+ Exam Score)', 'Includes 1 Month FREE Paid Membership']
  },
  {
    id: 'bundle-3',
    title: '3-Certificate Career Starter Bundle',
    subtitle: 'Ideal for Fresh Graduates & Technologists + 1 Month FREE Paid Membership',
    count: 3,
    priceRs: 2500,
    originalPriceRs: 3000,
    savingsRs: 500,
    recommendedCourses: [
      'HACCP Level 03',
      'Food Safety Level 03',
      'ISO 22000 Awareness Certificate'
    ]
  },
  {
    id: 'bundle-5',
    title: '5-Certificate QA/QC & HSE Manager Bundle',
    subtitle: 'Best Value for QA/QC Officers & Auditors + 1 Month FREE Paid Membership',
    count: 5,
    priceRs: 4000,
    originalPriceRs: 5000,
    savingsRs: 1000,
    recommendedCourses: [
      'HACCP Level 04',
      'Food Safety Level 04',
      'FSSC 22000 v7 Awareness Certificate',
      'BRCGS Food Safety Issue 09 Awareness Certificate',
      'ISO 9001 Awareness Certificate'
    ],
    highlight: true
  },
  {
    id: 'bundle-13',
    title: 'All 13 Certificates Executive Master Pass',
    subtitle: 'All 13 Official Certificates + 1 FULL YEAR (12 Months) FREE Paid Membership!',
    count: 13,
    priceRs: 9500,
    originalPriceRs: 20000,
    savingsRs: 10500,
    recommendedCourses: [
      'All 13 Courses (Certified Dietary Manager, HACCP L3/L4, Food Safety L3/L4, ISO 9001/22000/14001/45001, FSSC v7, BRCGS Issue 9, MS Office & English)',
      'Includes 1 Full Year (365 Days) FREE Paid Membership!'
    ]
  }
];

interface FreeVsPremiumComparisonProps {
  isCurrentUserPaid: boolean;
  monthlyFeeRs: number;
  yearlyFeeRs: number;
  onSelectPlanUpgrade: (plan: '1-month' | '1-year') => void;
  onNavigateTools?: () => void;
  onNavigateTrainings?: () => void;
  onClose?: () => void;
}

export const FreeVsPremiumComparisonCard: React.FC<
  FreeVsPremiumComparisonProps
> = ({
  isCurrentUserPaid,
  monthlyFeeRs,
  yearlyFeeRs,
  onSelectPlanUpgrade,
  onNavigateTools,
  onNavigateTrainings,
  onClose
}) => {
  const comparisonRows: Array<{
    feature: string;
    category: string;
    free: string;
    premium: string;
    freeIncluded: boolean;
  }> = [
    {
      feature: 'Food Industry Jobs & Global Scholarships',
      category: 'Careers & Grants',
      free: '100% Free Browse & Direct Apply',
      premium: '100% Free + Applied Status Tracker & Priority Alerts',
      freeIncluded: true
    },
    {
      feature: '13 Accredited Slide Presentation Courses & 40-MCQ Exams',
      category: 'Training Academy',
      free: '100% Free Study Slides & Final Exam',
      premium: 'Free Study & Exam + Active QR Certificate Registry Status',
      freeIncluded: true
    },
    {
      feature: 'Lab & Formula Calculator (Sanitizer PPM & Titratable Acidity)',
      category: 'Laboratory Tools',
      free: 'On-Screen Live Calculation Only',
      premium: 'Add Custom Chemicals/Acids + Save Batch Directory + PDF Report',
      freeIncluded: true
    },
    {
      feature:
        'Pearson Square & Multi-Industry Batch Standardizer (Dairy, Beverage, Bakery, Sauces)',
      category: 'Batch Standardization',
      free: 'On-Screen Live Calculation Only',
      premium: 'Save Every Adjusted Batch Log in Directory + Download PDF Report',
      freeIncluded: true
    },
    {
      feature: 'Lab Solution Molarity/Normality & Moisture/Ash/Yield Calculators',
      category: 'Analytical QC',
      free: 'On-Screen Live Calculation Only',
      premium: 'Cloud Directory History Logging + Official Lab PDF Report',
      freeIncluded: true
    },
    {
      feature:
        'Production Line Net Efficiency (1-Hr & Full-Day OEE) & Syrup Room Yield',
      category: 'Plant Operations',
      free: 'On-Screen Live Calculation Only',
      premium:
        'Daily, Weekly, Monthly & Yearly Plant Analytics + PDF Shift Report',
      freeIncluded: true
    },
    {
      feature:
        'Research Paper, Thesis-to-Journal Converter, ANOVA & Citation Suite',
      category: 'Academic & R&D',
      free: 'Standard On-Screen Preview',
      premium:
        'Custom Journal Rules + Word Upload Auto-Format + Saved Directory & PDF',
      freeIncluded: true
    },
    {
      feature: 'Verified Food Specialists Community Directory & Public CV',
      category: 'Professional Network',
      free: 'Browse Directory Only',
      premium: 'Listed as Verified Specialist + CV Upload & Direct Recruiter Contact',
      freeIncluded: false
    }
  ];

  return (
    <section
      aria-label="Free Access vs. Premium Access Comparison"
      className="rounded-2xl bg-white border border-[#D2DEEA] p-4 sm:p-6 shadow-2xs space-y-5 text-left"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1673B8]">
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Transparent Plan Comparison</span>
            <span aria-hidden="true">·</span>
            <span>Built for Students, QA/QC Officers &amp; Plant Managers</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#0C182D]">
            Free Access vs. Premium Access
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            All calculators, training slides, 40-MCQ exams, jobs, and scholarships are free to use on-screen. Upgrade to Premium Access to unlock Cloud Directory Data Logging, Daily/Monthly/Yearly Plant Analytics, Custom Chemicals, and Official PDF Audit Reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isCurrentUserPaid ? (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Premium Access Active</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onSelectPlanUpgrade('1-month')}
                className="px-4 py-2.5 rounded-xl bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#1673B8]/40 text-[#1673B8] text-xs font-extrabold cursor-pointer transition-colors"
              >
                Monthly Plan: Rs. {monthlyFeeRs} / mo
              </button>
              <button
                type="button"
                onClick={() => onSelectPlanUpgrade('1-year')}
                className="px-4 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Yearly Plan: Rs. {yearlyFeeRs} / yr (Save 25%)</span>
              </button>
            </>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive Comparison Table */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full border-collapse text-left text-xs min-w-[640px]">
          <thead>
            <tr className="border-b border-[#D2DEEA] bg-[#F4F8FD]">
              <th className="py-3 px-3.5 font-extrabold text-[#0C182D] w-[38%]">
                Portal Feature / Industrial Tool
              </th>
              <th className="py-3 px-3.5 font-extrabold text-slate-700 w-[28%]">
                Free User (Rs. 0 — Always Free)
              </th>
              <th className="py-3 px-3.5 font-extrabold text-[#1673B8] bg-[#EBF4FC]/60 w-[34%]">
                Paid Premium Member (Rs. {monthlyFeeRs}/mo or Rs. {yearlyFeeRs}/yr)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparisonRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3.5 align-top">
                  <p className="font-extrabold text-[#1A2138]">{row.feature}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {row.category}
                  </p>
                </td>
                <td className="py-3 px-3.5 align-top text-slate-600 font-medium">
                  <div className="flex items-start gap-1.5">
                    {row.freeIncluded ? (
                      <Check className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    ) : (
                      <span className="text-slate-400 font-bold shrink-0">—</span>
                    )}
                    <span>{row.free}</span>
                  </div>
                </td>
                <td className="py-3 px-3.5 align-top bg-[#F0F6FC]/45 font-bold text-[#0C182D]">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1673B8] shrink-0 mt-0.5" />
                    <span>{row.premium}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-3 text-slate-600 font-medium">
          {onNavigateTools && (
            <button
              type="button"
              onClick={onNavigateTools}
              className="text-[#1673B8] hover:underline font-extrabold cursor-pointer"
            >
              Explore All 11+ Free &amp; Pro Tools →
            </button>
          )}
          {onNavigateTrainings && (
            <button
              type="button"
              onClick={onNavigateTrainings}
              className="text-[#1673B8] hover:underline font-extrabold cursor-pointer"
            >
              Browse 13 Free Training Courses →
            </button>
          )}
        </div>
        {!isCurrentUserPaid && (
          <button
            type="button"
            onClick={() => onSelectPlanUpgrade('1-year')}
            className="px-4 py-2 rounded-xl bg-[#0C182D] hover:bg-[#1673B8] text-white font-extrabold cursor-pointer transition-colors"
          >
            Unlock Full Premium Cloud Directory &amp; PDF Reports →
          </button>
        )}
      </div>
    </section>
  );
};

interface CertificateBundleOffersCardProps {
  paymentGatewayConfig: PaymentGatewayConfig;
  onSubmitBundleRequest: (params: {
    bundle: CertificateBundleOption;
    selectedCourses: InternationalTrainingCourse[];
    paymentMethod: 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';
    transactionId: string;
    receiptImageUrl: string;
    notes: string;
  }) => Promise<void>;
  onOpenCourseCatalog?: () => void;
  isGuest?: boolean;
  onRequireSignIn?: () => void;
}

export const CertificateBundleOffersCard: React.FC<
  CertificateBundleOffersCardProps
> = ({
  paymentGatewayConfig,
  onSubmitBundleRequest,
  onOpenCourseCatalog,
  isGuest = false,
  onRequireSignIn
}) => {
  const [activeBundleModal, setActiveBundleModal] =
    useState<CertificateBundleOption | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [payMethod, setPayMethod] = useState<
    'JazzCash' | 'EasyPaisa' | 'Bank Transfer'
  >('Bank Transfer');
  const [txId, setTxId] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptDataUrl, setReceiptDataUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleOpenBundleModal = (bundle: CertificateBundleOption) => {
    setFeedbackMsg(null);
    setTxId('');
    setNotes('');
    setReceiptDataUrl('');
    if (bundle.count === 13) {
      setSelectedCourseIds(INTERNATIONAL_TRAINING_COURSES.map((c) => c.id));
    } else if (bundle.count === 3) {
      setSelectedCourseIds([
        'cert-2026-haccp-level-03',
        'cert-2026-food-safety-level-03',
        'cert-2026-iso-22000-awareness'
      ]);
    } else if (bundle.count === 5) {
      setSelectedCourseIds([
        'cert-2026-haccp-level-04',
        'cert-2026-food-safety-level-04',
        'cert-2026-fssc-22000-v7-awareness',
        'cert-2026-brcgs-issue-09-awareness',
        'cert-2026-iso-9001-awareness'
      ]);
    } else {
      setSelectedCourseIds([
        INTERNATIONAL_TRAINING_COURSES.find((c) => c.certificateFeeRs === 1000)
          ?.id || INTERNATIONAL_TRAINING_COURSES[0].id
      ]);
    }
    setActiveBundleModal(bundle);
  };

  const effectiveBundlePriceRs = activeBundleModal
    ? activeBundleModal.count === 1 &&
      selectedCourseIds.some(
        (id) =>
          id === 'mgr-food-dietary-2026' ||
          INTERNATIONAL_TRAINING_COURSES.find((c) => c.id === id)
            ?.certificateFeeRs === 8000
      )
      ? 8000
      : activeBundleModal.priceRs
    : 1000;

  const toggleCourseInBundle = (courseId: string, maxCount: number) => {
    if (maxCount === 13) return; // All 13 included
    setSelectedCourseIds((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      }
      if (maxCount === 1) {
        return [courseId];
      }
      if (prev.length >= maxCount) {
        return [...prev.slice(1), courseId];
      }
      return [...prev, courseId];
    });
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReceiptDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBundleModal) return;
    if (isGuest && onRequireSignIn) {
      setActiveBundleModal(null);
      onRequireSignIn();
      return;
    }
    if (selectedCourseIds.length === 0) {
      setFeedbackMsg('Please select at least 1 course for your certificate package.');
      return;
    }
    if (!txId.trim()) {
      setFeedbackMsg('Please enter your Transaction / Reference ID.');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      const chosenCourses = INTERNATIONAL_TRAINING_COURSES.filter((c) =>
        selectedCourseIds.includes(c.id)
      );
      const bundleWithEffectivePrice: CertificateBundleOption = {
        ...activeBundleModal,
        priceRs: effectiveBundlePriceRs
      };
      await onSubmitBundleRequest({
        bundle: bundleWithEffectivePrice,
        selectedCourses: chosenCourses,
        paymentMethod: payMethod,
        transactionId: txId.trim(),
        receiptImageUrl: receiptDataUrl,
        notes: notes.trim()
      });
      setFeedbackMsg(
        `Your ${activeBundleModal.title} (Rs. ${effectiveBundlePriceRs.toLocaleString()}) request for ${chosenCourses.length} course(s) has been sent to the Admin Control Panel! Once verified, your official Portrait PDF Certificates will be unlocked.`
      );
      setTxId('');
      setReceiptDataUrl('');
    } catch {
      setFeedbackMsg('Could not submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-label="Accredited Certificate Bundle Offers"
      className="rounded-2xl bg-white border border-[#D2DEEA] p-4 sm:p-6 shadow-2xs space-y-5 text-left"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1673B8]">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Free Course Study &amp; Exam</span>
            <span aria-hidden="true">·</span>
            <span>Special Certificate Bundle Discounts</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#0C182D]">
            Official QR-Verified Certificate Packages &amp; Bundle Offers
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Study all 05 presentation modules and pass the 40-MCQ exam (60% passing score) for free. Unlock your official Portrait PDF Certificates individually or save up to Rs. 3,500 with a multi-certificate career bundle.
          </p>
        </div>

        {onOpenCourseCatalog && (
          <button
            type="button"
            onClick={onOpenCourseCatalog}
            className="px-4 py-2 rounded-xl bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#D2DEEA] text-[#1673B8] text-xs font-extrabold cursor-pointer shrink-0 transition-colors"
          >
            View All 13 Courses →
          </button>
        )}
      </div>

      {/* 4 Bundle Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {CERTIFICATE_BUNDLE_OPTIONS.map((bundle) => (
          <div
            key={bundle.id}
            className={`rounded-2xl p-4 flex flex-col justify-between space-y-4 border transition-all ${
              bundle.highlight
                ? 'bg-[#F0F6FC]/70 border-2 border-[#1673B8] shadow-sm'
                : 'bg-white border-[#D2DEEA] hover:border-[#1673B8]/50'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-[11px] font-extrabold">
                <span className="text-[#1673B8]">
                  {bundle.count === 1
                    ? '1 Certificate'
                    : `${bundle.count} Certificates Bundle`}
                </span>
                {bundle.savingsRs > 0 && (
                  <span className="text-emerald-700 font-black">
                    Save Rs. {bundle.savingsRs.toLocaleString()}
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-black text-[#0C182D] leading-snug">
                {bundle.title}
              </h3>

              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-xl font-black text-[#1673B8]">
                  Rs. {bundle.priceRs.toLocaleString()}
                </span>
                {bundle.savingsRs > 0 && (
                  <span className="text-xs font-bold text-slate-400 line-through">
                    Rs. {bundle.originalPriceRs.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                {bundle.subtitle}
              </p>

              <div className="pt-2 border-t border-slate-200/70 space-y-1">
                <p className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Recommended Combination:
                </p>
                <ul className="space-y-1 text-[11px] text-slate-700 font-semibold">
                  {bundle.recommendedCourses.map((rc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#1673B8] shrink-0 mt-0.5" />
                      <span>{rc}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-1.5 text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Unique Certificate ID + Scannable QR Code</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenBundleModal(bundle)}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                bundle.highlight
                  ? 'bg-[#1673B8] hover:bg-[#105E9A] text-white shadow-xs'
                  : 'bg-[#0C182D] hover:bg-[#1673B8] text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {bundle.count === 1
                  ? 'Unlock 1 Certificate'
                  : `Claim ${bundle.count}-Cert Bundle`}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Bundle Selection & Payment Modal */}
      {activeBundleModal && (
        <div className="fixed inset-0 z-50 bg-[#0C182D]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#D2DEEA] space-y-4 my-8 text-left">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <p className="text-[11px] font-bold text-[#1673B8]">
                  Official Certificate Bundle Unlock
                  {activeBundleModal.savingsRs > 0
                    ? ` · Save Rs. ${activeBundleModal.savingsRs.toLocaleString()}`
                    : ''}
                </p>
                <h3 className="text-base sm:text-lg font-black text-[#0C182D] mt-0.5">
                  {activeBundleModal.title} — Rs.{' '}
                  {effectiveBundlePriceRs.toLocaleString()}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveBundleModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedbackMsg ? (
              <div className="rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] p-4 space-y-3 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#1673B8] mx-auto" />
                <p className="text-xs sm:text-sm font-bold text-[#1A2138] leading-relaxed">
                  {feedbackMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveBundleModal(null)}
                  className="px-5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
                {isGuest && (
                  <div className="rounded-xl bg-amber-50 border-2 border-amber-400 p-3.5 space-y-2 text-[#1A2138]">
                    <div className="font-extrabold text-amber-900">
                      ⚠️ Account Registration &amp; Login Mandatory for Official Certificates
                    </div>
                    <p className="text-[11.5px] text-amber-800 leading-relaxed">
                      Studying all 13 courses and taking the 40-MCQ exams is 100% free without registration. However, to issue and verify Official QR Certificates in your name, you must register / sign in first.
                    </p>
                    {onRequireSignIn && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveBundleModal(null);
                          onRequireSignIn();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#0C182D] hover:bg-[#1673B8] text-white font-extrabold text-xs cursor-pointer transition-colors"
                      >
                        Sign In / Register Free Account First →
                      </button>
                    )}
                  </div>
                )}

                {/* Step 1: Select Courses Included in Bundle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-[#0C182D]">
                      1. Select Courses to Include ({selectedCourseIds.length} /{' '}
                      {activeBundleModal.count} Selected):
                    </label>
                    {activeBundleModal.count < 13 && (
                      <span className="text-[11px] text-slate-500">
                        Click to choose any {activeBundleModal.count} course(s)
                      </span>
                    )}
                  </div>
                  <div className="max-h-44 overflow-y-auto rounded-xl border border-[#D2DEEA] bg-[#F8FAFC] p-2 grid grid-cols-1 gap-1.5">
                    {INTERNATIONAL_TRAINING_COURSES.map((course) => {
                      const isChecked = selectedCourseIds.includes(course.id);
                      const courseFee = course.certificateFeeRs || 1000;
                      return (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() =>
                            toggleCourseInBundle(
                              course.id,
                              activeBundleModal.count
                            )
                          }
                          className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                            isChecked
                              ? 'bg-[#1673B8] text-white font-bold'
                              : 'bg-white hover:bg-[#EBF4FC] text-slate-700 border border-slate-200/70'
                          }`}
                        >
                          <span className="truncate">
                            {course.title} ({course.code}) — Rs.{' '}
                            {courseFee.toLocaleString()}
                          </span>
                          {isChecked && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Payment Account Details */}
                <div className="rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] p-3.5 space-y-2">
                  <p className="font-extrabold text-[#1673B8]">
                    2. Transfer Rs. {effectiveBundlePriceRs.toLocaleString()}{' '}
                    to Official Account:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-white p-2.5 rounded-lg border border-[#D2DEEA]">
                      <p className="font-bold text-[#1A2138]">
                        JazzCash: {paymentGatewayConfig.jazzCashNumber}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {paymentGatewayConfig.jazzCashTitle}
                      </p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-[#D2DEEA]">
                      <p className="font-bold text-[#1A2138]">
                        EasyPaisa: {paymentGatewayConfig.easyPaisaNumber}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {paymentGatewayConfig.easyPaisaTitle}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#D2DEEA]">
                    <p className="font-bold text-[#1A2138]">
                      {paymentGatewayConfig.bankName}:{' '}
                      {paymentGatewayConfig.bankAccountOrIban}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Title: {paymentGatewayConfig.bankTitle}
                    </p>
                  </div>
                </div>

                {/* Step 3: Method, Transaction ID & Receipt Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={payMethod}
                      onChange={(e) =>
                        setPayMethod(
                          e.target.value as
                            | 'JazzCash'
                            | 'EasyPaisa'
                            | 'Bank Transfer'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#D2DEEA] bg-white font-semibold"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Transaction / Reference ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                      placeholder="Enter TRX / Reference ID..."
                      className="w-full px-3 py-2 rounded-xl border border-[#D2DEEA] bg-white font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Upload Payment Screenshot (Optional / Recommended)
                  </label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[#1673B8] bg-[#F0F6FC]/60 hover:bg-[#EBF4FC] text-[#1673B8] font-bold cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>
                      {receiptDataUrl
                        ? 'Payment Screenshot Attached ✓'
                        : 'Choose Screenshot Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Notes for Admin (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any note regarding your selected courses..."
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DEEA] bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveBundleModal(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {isSubmitting
                        ? 'Submitting...'
                        : `Submit Bundle Request (Rs. ${effectiveBundlePriceRs.toLocaleString()})`}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
