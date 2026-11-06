import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  Trash2,
  X,
  CheckCircle2,
  Mail,
  Globe
} from 'lucide-react';

export type LegalTabType = 'privacy' | 'terms' | 'ads' | 'deletion';

interface LegalComplianceModalProps {
  isOpen: boolean;
  initialTab?: LegalTabType;
  onClose: () => void;
  onGoToDeleteAccount?: () => void;
  monthlyFeeRs?: number;
  yearlyFeeRs?: number;
  yearlyDiscountPct?: number;
}

export const LegalComplianceModal: React.FC<LegalComplianceModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
  onGoToDeleteAccount,
  monthlyFeeRs = 100,
  yearlyFeeRs = 900,
  yearlyDiscountPct = 25
}) => {
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#CBE4D6] rounded-[24px] w-full max-w-2xl max-h-[90dvh] flex flex-col shadow-[0_20px_50px_rgba(15,41,30,0.28)] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F291E] via-[#13422B] to-[#0E9F6E] px-4 py-3.5 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#A7F3D0]" />
            </div>
            <div className="min-w-0">
              <h2
                id="legal-modal-title"
                className="text-[15px] sm:text-[17px] font-extrabold leading-tight truncate"
              >
                Privacy Policy, Terms &amp; Ad Compliance
              </h2>
              <p className="text-[11px] text-emerald-100 font-medium">
                FS Portal (Food Specialists) • Google Play, AdSense &amp; AdMob Compliant
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal modal"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer shrink-0 transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#F4FAF7] border-b border-[#D4E9DF] px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {(
            [
              { id: 'privacy', label: 'Privacy Policy', icon: Lock },
              { id: 'terms', label: 'Terms of Use', icon: FileText },
              { id: 'ads', label: 'AdSense & AdMob Policy', icon: Globe },
              { id: 'deletion', label: 'Account Deletion', icon: Trash2 }
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-xl text-[11.5px] font-extrabold inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#0E9F6E] text-white shadow-2xs'
                    : 'bg-white text-[#0F291E] border border-[#CBE4D6] hover:bg-[#E3F3EA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Legal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-[13px] text-[#1F2937] leading-relaxed flex-1">
          {activeTab === 'privacy' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-[#F4FAF7] border border-[#CBE4D6] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0E9F6E] shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-[#0F291E]">
                    Official Privacy Policy — FS Portal (Food Specialists)
                  </div>
                  <div className="text-[11px] text-[#5C7267] font-semibold">
                    Effective Date: November 5, 2026 • Complies with Google Play Developer Program Policies, GDPR &amp; CCPA
                  </div>
                </div>
              </div>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  1. Information We Collect
                </h3>
                <p>
                  When you register or use <strong>FS Portal (Food Specialists)</strong>, we collect only the information you voluntarily provide:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Account Credentials:</strong> Name, email address, and authentication identifier via Firebase Authentication (Email/Password or Google Sign-In).
                  </li>
                  <li>
                    <strong>Professional Profile &amp; CV Data:</strong> Job title, company, qualification, experience, trainings, projects, LinkedIn URL, profile photo, and uploaded PDF CV/resume.
                  </li>
                  <li>
                    <strong>Membership Verification Data:</strong> Payment transaction reference IDs and payment receipt screenshots voluntarily submitted for Premium Membership verification.
                  </li>
                </ul>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  2. Granular Profile Privacy &amp; Field Visibility Controls
                </h3>
                <p>
                  You retain full control over your personal and professional information. Every field in your profile (Name, Title, Company, Location, Bio, LinkedIn, Contact, Education, Experience, Trainings, Projects, and CV) has an individual <strong>ON / OFF Visibility Toggle</strong>. Any field switched <strong>OFF</strong> is stored strictly in your private vault and is never shown to other community members.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  3. How We Use &amp; Protect Your Data
                </h3>
                <p>
                  Your data is used solely to provide access to Food Science &amp; Technology job listings, global scholarships, accredited trainings (Highfield UK, IRCA CQI, Exemplar Global), professional PDF CV generation, and the Verified Specialist Community Directory. All data is encrypted in transit (HTTPS/TLS) and stored securely on Google Cloud Firestore with strict role-based security rules. We never sell your personal data to third parties.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  4. Contact &amp; Data Protection Officer
                </h3>
                <p className="flex items-center gap-1.5 font-semibold text-[#0D6845]">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>Official Support &amp; Privacy Contact: mindmademedia9@gmail.com</span>
                </p>
              </section>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-[#F4FAF7] border border-[#CBE4D6]">
                <div className="font-extrabold text-[#0F291E]">
                  Terms &amp; Conditions of Use
                </div>
                <div className="text-[11px] text-[#5C7267] font-semibold">
                  Governing access to FS Portal Jobs, Scholarships, Trainings &amp; Premium Community
                </div>
              </div>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  1. Professional Conduct &amp; Accuracy of Information
                </h3>
                <p>
                  Users agree to provide accurate academic and professional credentials when creating a specialist profile or generating a CV. Impersonation, uploading fraudulent payment receipts, or posting misleading information may result in immediate account suspension.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  2. External Job &amp; Scholarship Verification Disclaimer
                </h3>
                <p>
                  FS Portal curates and shares verified food industry job openings, fellowships, and international scholarships from credible sources. However, applicants must independently verify employer details, interview locations, and scholarship terms before applying. FS Portal does not charge candidates any recruitment or job-application fees.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  3. Free vs. Paid Premium Community Membership
                </h3>
                <p>
                  Browsing Jobs, Scholarships, Trainings, and downloading your own PDF CV are completely free. Upgrading to <strong>Paid Premium Membership</strong> (Rs. {monthlyFeeRs.toLocaleString()} for 1 Month or Rs. {yearlyFeeRs.toLocaleString()} for 1 Full Year with {yearlyDiscountPct}% discount) unlocks visibility in the Premium Community Directory, viewing other paid specialists&apos; visible profile details, and downloading shared CVs.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-[#F59E0B]">
                <div className="font-extrabold text-[#92400E]">
                  Google AdSense, Google AdMob &amp; Cookie Disclosure
                </div>
                <div className="text-[11px] text-[#78350F] font-semibold">
                  Required disclosure for Google Publisher Policies, AdSense Web &amp; AdMob Mobile SDK
                </div>
              </div>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  1. Third-Party Advertising (Google AdSense &amp; Google AdMob)
                </h3>
                <p>
                  We may use third-party advertising companies, including <strong>Google AdSense</strong> (on web) and <strong>Google AdMob</strong> (on mobile applications), to serve display, native, interstitial, or rewarded video advertisements when you visit or use FS Portal.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  2. DoubleClick DART Cookie &amp; Mobile Advertising IDs
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Google, as a third-party vendor, uses cookies (including the DoubleClick DART cookie) and mobile advertising identifiers (such as Android Advertising ID) to serve ads based on a user&apos;s prior visits to our platform or other websites/apps on the internet.
                  </li>
                  <li>
                    Google&apos;s use of advertising cookies and device identifiers enables it and its partners to serve relevant advertisements, measure ad performance, and prevent invalid ad traffic.
                  </li>
                  <li>
                    Users may opt out of personalized advertising at any time by visiting{' '}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0E9F6E] font-extrabold underline"
                    >
                      Google Ads Settings (adssettings.google.com)
                    </a>{' '}
                    or by resetting their Advertising ID in their mobile device&apos;s privacy settings.
                  </li>
                </ul>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  3. Private Vault &amp; CV Isolation from Advertisers
                </h3>
                <p>
                  Your uploaded PDF CVs, private profile fields, and payment verification receipts are strictly isolated and are <strong>never</strong> shared with advertising networks.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'deletion' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200">
                <div className="font-extrabold text-red-900">
                  User Account &amp; Data Deletion Policy (Google Play Compliant)
                </div>
                <div className="text-[11px] text-red-700 font-semibold">
                  Instant self-service account &amp; personal data deletion
                </div>
              </div>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  1. How to Delete Your Account In-App (Instant Deletion)
                </h3>
                <p>
                  In accordance with Google Play Store and international data privacy requirements, any registered user can permanently delete their account and all associated personal data directly inside the app:
                </p>
                <ol className="list-decimal pl-5 space-y-1 font-medium">
                  <li>Sign in to your FS Portal account and open the <strong>Profile</strong> tab from the bottom navigation bar.</li>
                  <li>Scroll down to the <strong>Account &amp; Data Deletion</strong> section at the bottom of your profile.</li>
                  <li>Click <strong>&ldquo;Delete My Account &amp; Data&rdquo;</strong> and confirm permanent deletion.</li>
                </ol>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  2. What Data is Deleted
                </h3>
                <p>
                  Confirming account deletion immediately and permanently removes:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your public and private specialist profile documents (`/users/{'{uid}'}` and `/users/{'{uid}'}/private/profile`).</li>
                  <li>Your uploaded PDF CV/resume, profile photo, education, experience, trainings, and projects.</li>
                  <li>Your payment verification requests and Firebase Authentication login credentials.</li>
                </ul>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#0F291E] text-[13.5px]">
                  3. Request Deletion via Email (Without Logging In)
                </h3>
                <p>
                  If you cannot access the app and wish to request account or data deletion via web/email, send an email from your registered address to{' '}
                  <strong>mindmademedia9@gmail.com</strong> with the subject line{' '}
                  <strong>&ldquo;Account Deletion Request — FS Portal&rdquo;</strong>. Your account and all associated data will be permanently purged within 48 hours.
                </p>
              </section>

              {onGoToDeleteAccount && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToDeleteAccount();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Go to Profile Account Deletion Section</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F4FAF7] border-t border-[#D4E9DF] px-4 py-3 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-[#5C7267]">
            FS Portal • Developed by Food Specialist
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
