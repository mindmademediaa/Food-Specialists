import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  Trash2,
  X,
  CheckCircle2,
  Mail,
  Globe,
  LogOut,
  Power
} from 'lucide-react';

export type LegalTabType = 'privacy' | 'ads' | 'terms' | 'deletion' | 'closure';

interface LegalComplianceModalProps {
  isOpen: boolean;
  initialTab?: LegalTabType;
  onClose: () => void;
  onGoToDeleteAccount?: () => void;
  onSignOutApp?: () => void;
  monthlyFeeRs?: number;
  yearlyFeeRs?: number;
  yearlyDiscountPct?: number;
}

export const LegalComplianceModal: React.FC<LegalComplianceModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
  onGoToDeleteAccount,
  onSignOutApp,
  monthlyFeeRs = 100,
  yearlyFeeRs = 900,
  yearlyDiscountPct = 25
}) => {
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-[90] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white border border-[#D2DEEA] rounded-2xl w-full max-w-2xl max-h-[90dvh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header — Certificate Royal Blue & Deep Navy Scheme */}
        <div className="bg-gradient-to-r from-[#1A2138] via-[#105E9A] to-[#1673B8] px-4 py-3.5 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-sky-200" />
            </div>
            <div className="min-w-0">
              <h2
                id="legal-modal-title"
                className="text-sm sm:text-base font-extrabold leading-tight truncate"
              >
                Google Play Store Policies, Privacy &amp; App Closure
              </h2>
              <p className="text-[11px] text-sky-100 font-medium truncate">
                FS Portal • Google Play Developer Program, AdMob &amp; Data Safety Compliant
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
        <div className="bg-[#F0F6FC] border-b border-[#D2DEEA] px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {(
            [
              { id: 'privacy', label: 'Privacy Policy', icon: Lock },
              { id: 'ads', label: 'AdMob & Ads Policy', icon: Globe },
              { id: 'terms', label: 'Terms of Use', icon: FileText },
              { id: 'deletion', label: 'Data Deletion Policy', icon: Trash2 },
              { id: 'closure', label: 'App Closure & Sign Out', icon: Power }
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#1673B8] text-white shadow-xs'
                    : 'bg-white text-[#1A2138] border border-[#D2DEEA] hover:bg-[#E6F0FA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Legal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-[13px] text-slate-800 leading-relaxed flex-1">
          {activeTab === 'privacy' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1673B8] shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-[#1A2138]">
                    Official Privacy Policy — FS Portal (Google Play Store Compliant)
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold">
                    Complies with Google Play Developer Program Policies, Data Safety Section, GDPR &amp; CCPA
                  </div>
                </div>
              </div>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  1. Information We Collect (Google Play Data Safety Disclosure)
                </h3>
                <p>
                  When you register or use <strong>FS Portal</strong>, we collect only the minimum information voluntarily provided by you to deliver app functionality:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Account Identifiers:</strong> Name, email address, and authentication UID via Firebase Authentication (Email/Password or Google Sign-In).
                  </li>
                  <li>
                    <strong>Professional Profile &amp; CV Data:</strong> Job title, organization, academic qualifications, work experience, trainings, projects, LinkedIn URL, profile photo, and uploaded PDF CV/resume.
                  </li>
                  <li>
                    <strong>Membership &amp; Certificate Verification Data:</strong> Payment transaction reference IDs, receipt screenshots submitted for admin approval, and earned training certificate records.
                  </li>
                </ul>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  2. Granular Profile Privacy &amp; Field Visibility Controls
                </h3>
                <p>
                  You retain complete control over your personal and professional information. Every field in your profile (Name, Title, Company, Location, Bio, LinkedIn, Contact, Education, Experience, Certifications, Projects, and CV) has a dedicated visibility control. Any field marked private is stored strictly in your isolated vault and is never shared with other members.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  3. Data Encryption, Security &amp; Zero Third-Party Selling
                </h3>
                <p>
                  All data is encrypted in transit using HTTPS/TLS and stored securely on Google Cloud Firestore with strict role-based security rules. We never sell, rent, or trade your personal data to third-party data brokers.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  4. Official Data Protection &amp; Support Contact
                </h3>
                <p className="flex items-center gap-1.5 font-semibold text-[#1673B8]">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>Privacy &amp; Compliance Support: mindmademedia9@gmail.com</span>
                </p>
              </section>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#F0F6FC] border border-[#1673B8]/30">
                <div className="font-extrabold text-[#1A2138]">
                  Google AdMob &amp; Google AdSense Policy Disclosure
                </div>
                <div className="text-[11px] text-slate-600 font-semibold">
                  Compliant with Google Play Store AdMob SDK Policies, Google Publisher Policies &amp; EU User Consent Policy
                </div>
              </div>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  1. Mobile App (Google AdMob) &amp; Web (Google AdSense) Advertising
                </h3>
                <p>
                  FS Portal uses <strong>Google AdMob</strong> within the mobile application and <strong>Google AdSense</strong> on the web portal to display non-intrusive banner, native, interstitial, or rewarded advertisements that support free educational and career content.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  2. Android Advertising ID (AAID) &amp; Cookie Usage
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    On Android devices, the Google Mobile Ads SDK (AdMob) may access your device&apos;s resettable <strong>Advertising ID (AAID)</strong> and coarse diagnostic signals for ad delivery, frequency capping, fraud prevention, and aggregate analytics in accordance with Google Play Developer Policies.
                  </li>
                  <li>
                    On web browsers, Google uses cookies (including the DoubleClick cookie) to serve relevant ads based on prior visits.
                  </li>
                  <li>
                    You may opt out of personalized advertising at any time via your mobile device settings (<strong>Settings &rarr; Google &rarr; Ads &rarr; Opt out of Ads Personalization / Reset Advertising ID</strong>) or on the web at{' '}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1673B8] font-extrabold underline"
                    >
                      adssettings.google.com
                    </a>
                    .
                  </li>
                </ul>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  3. Strict Isolation of Private User Data from Ad Networks
                </h3>
                <p>
                  Your uploaded PDF CVs, private profile fields, exam records, and payment verification screenshots are strictly isolated and are <strong>never</strong> shared with AdMob, AdSense, or any external advertising network.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA]">
                <div className="font-extrabold text-[#1A2138]">
                  Terms &amp; Conditions of Use (Google Play App Publishing Standard)
                </div>
                <div className="text-[11px] text-slate-600 font-semibold">
                  Governing use of FS Portal Jobs, Scholarships, International Trainings &amp; Community Directory
                </div>
              </div>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  1. User Conduct, UGC Safety &amp; Authenticity
                </h3>
                <p>
                  Users agree to provide accurate academic and professional credentials when creating a profile, taking certification exams, or generating a CV. In compliance with Google Play User-Generated Content (UGC) policies, impersonation, objectionable content, or fraudulent payment receipts are strictly prohibited and result in immediate account removal.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  2. External Job &amp; Scholarship Verification Disclaimer
                </h3>
                <p>
                  FS Portal curates food industry job openings, fellowships, and international scholarships from reputable organizations. Applicants must independently verify employer details and scholarship terms before applying. FS Portal never charges candidates recruitment or job-application fees.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  3. Membership &amp; Certificate Verification Rules
                </h3>
                <p>
                  Browsing Jobs, Scholarships, studying Training Modules, taking 40-MCQ Exams, and using Specialist Tools are available to members. Upgrading to <strong>Paid Premium Membership</strong> (Rs. {monthlyFeeRs.toLocaleString()} / Month or Rs. {yearlyFeeRs.toLocaleString()} / Year with {yearlyDiscountPct}% discount) unlocks full Community Directory access and active Online Certificate Verification visibility.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'deletion' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <div className="font-extrabold text-red-900">
                  User Data &amp; Account Deletion Policy (Google Play Store Mandatory Requirement)
                </div>
                <div className="text-[11px] text-red-700 font-semibold">
                  Instant in-app self-service deletion &amp; external web/email deletion request support
                </div>
              </div>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  1. Instant In-App Account &amp; Data Deletion
                </h3>
                <p>
                  In full compliance with Google Play&apos;s User Data &amp; Account Deletion policy, you can permanently delete your account and all associated personal data at any time directly inside the app:
                </p>
                <ol className="list-decimal pl-5 space-y-1 font-medium">
                  <li>Open the <strong>Profile</strong> tab from the bottom navigation bar (or click the button below).</li>
                  <li>Scroll to the <strong>Account &amp; Data Deletion</strong> section at the bottom of your profile.</li>
                  <li>Tap <strong>&ldquo;Delete My Account &amp; Data&rdquo;</strong> and confirm permanent deletion.</li>
                </ol>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  2. Scope of Data Permanently Erased
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your public and private specialist profile documents (`/users/{'{uid}'}` and `/users/{'{uid}'}/private/profile`).</li>
                  <li>Your uploaded PDF CV/resume, profile photo, education, experience, and tool logs.</li>
                  <li>Your payment verification requests and Firebase Authentication login credentials.</li>
                </ul>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  3. Request Data Deletion Without Re-Installing the App
                </h3>
                <p>
                  If you have uninstalled the app and wish to delete your account and data without logging in, send an email from your registered address to <strong>mindmademedia9@gmail.com</strong> with the subject <strong>&ldquo;Account &amp; Data Deletion Request — FS Portal&rdquo;</strong>. All associated data is permanently purged within 48 hours.
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

          {activeTab === 'closure' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA]">
                <div className="font-extrabold text-[#1A2138]">
                  App Closure, Session Termination &amp; Background Resource Policy
                </div>
                <div className="text-[11px] text-slate-600 font-semibold">
                  Google Play Store App Lifecycle, Sign-Out &amp; Device Resource Compliance
                </div>
              </div>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  1. Clean App Closure &amp; Zero Unauthorized Background Processes
                </h3>
                <p>
                  In accordance with Google Play Store Mobile App Quality and Device Resource guidelines, closing or exiting <strong>FS Portal</strong> immediately suspends all active cloud listeners, UI timers, and network requests. The app does not run hidden background services, location trackers, or battery-draining wake locks when closed.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  2. Course Progress Auto-Save Before Closure
                </h3>
                <p>
                  Whenever you close the app or sign out, your active training module progress (&ldquo;Continue Where You Left Off&rdquo;), specialist tool records, and profile settings are automatically saved so you can resume seamlessly on your next login.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-extrabold text-[#1A2138] text-[13px]">
                  3. Sign Out / Terminate Active Session
                </h3>
                <p>
                  Use the button below to securely sign out of your current Firebase Authentication session and close your active workspace on this device.
                </p>
              </section>

              {onSignOutApp && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSignOutApp();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#1A2138] hover:bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out &amp; Close Active Session</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F0F6FC] border-t border-[#D2DEEA] px-4 py-2.5 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-slate-600">
            FS Portal • Official Google Play Compliant Policy Center
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
