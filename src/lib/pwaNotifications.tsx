import React, { useEffect, useState } from 'react';
import { WifiOff, CheckCircle2, RefreshCw } from 'lucide-react';

export const OFFLINE_PACK_STORAGE_KEY = 'fsp_factory_offline_pack_v1';
export const PUSH_ALERTS_STORAGE_KEY = 'fsp_push_alerts_enabled_v1';

export interface FactoryOfflinePackMeta {
  savedAt: string;
  coursesCount: number;
  authorityLimitsCount: number;
  sizeKb: number;
}

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function getSavedOfflinePackMeta(): FactoryOfflinePackMeta | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(OFFLINE_PACK_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.meta) return parsed.meta as FactoryOfflinePackMeta;
  } catch {
    // Ignore parse error
  }
  return null;
}

export async function saveFactoryFloorOfflinePack(): Promise<FactoryOfflinePackMeta> {
  const [{ INTERNATIONAL_TRAINING_COURSES }, { FOOD_AUTHORITY_LIMITS }] =
    await Promise.all([
      import('../data/internationalTrainingsData'),
      import('../data/foodSafetyReferenceData')
    ]);
  const savedAt = new Date().toISOString();
  const payload = {
    meta: {
      savedAt,
      coursesCount: INTERNATIONAL_TRAINING_COURSES.length,
      authorityLimitsCount: FOOD_AUTHORITY_LIMITS.length,
      sizeKb: 0
    },
    coursesSummary: INTERNATIONAL_TRAINING_COURSES.map((c) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      modules: c.modules.map((m) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        keyPrinciples: m.keyPrinciples,
        internationalClauses: m.internationalClauses
      }))
    })),
    authorityLimits: FOOD_AUTHORITY_LIMITS
  };
  const serialized = JSON.stringify(payload);
  payload.meta.sizeKb = Math.max(1, Math.round(serialized.length / 1024));

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(OFFLINE_PACK_STORAGE_KEY, JSON.stringify(payload));
    // Also trigger service worker asset warm-up if registered
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_OFFLINE_URLS',
        urls: [
          './',
          './index.html',
          './manifest.json',
          './?section=tools',
          './?section=tools&tool=authority-limits',
          './?section=tools&tool=lab-formula',
          './?section=tools&tool=pearson-square',
          './?section=tools&tool=e-numbers',
          './?section=trainings'
        ]
      });
    }
  }
  return payload.meta;
}

export function getPushAlertsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(PUSH_ALERTS_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export async function requestJobAndScholarshipPushAlerts(): Promise<{
  ok: boolean;
  permission: NotificationPermission | 'unsupported';
  message: string;
}> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      ok: false,
      permission: 'unsupported',
      message: 'Browser notifications are not supported on this device. You will still see live in-app bell alerts.'
    };
  }

  try {
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    if (permission === 'granted') {
      window.localStorage.setItem(PUSH_ALERTS_STORAGE_KEY, 'true');
      await showPortalPushNotification(
        'Job & Scholarship Alerts Active',
        'Food Science Portal will alert you when new QA/QC jobs, scholarships, or certificate approvals arrive.',
        '/?section=jobs'
      );
      return {
        ok: true,
        permission,
        message: 'Push alerts enabled! You will be alerted whenever new Jobs or Scholarships are posted.'
      };
    }
    return {
      ok: false,
      permission,
      message:
        permission === 'denied'
          ? 'Browser notifications are currently blocked in browser site settings. In-app Bell alerts remain active.'
          : 'Notification prompt dismissed. You can enable it anytime from the Bell icon.'
    };
  } catch {
    return {
      ok: false,
      permission: 'unsupported',
      message: 'Could not enable browser push alerts in this preview frame, but in-app real-time alerts are active.'
    };
  }
}

export function disableJobAndScholarshipPushAlerts() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PUSH_ALERTS_STORAGE_KEY, 'false');
  }
}

export async function showPortalPushNotification(
  title: string,
  body: string,
  targetUrl = '/'
): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, {
          body,
          icon: '/pwa-192x192.png?v=fsp-20261119-v11',
          badge: '/favicon.png?v=fsp-20261119-v11',
          data: { url: targetUrl }
        });
        return;
      }
    }
    new Notification(title, {
      body,
      icon: '/pwa-192x192.png?v=fsp-20261119-v11'
    });
  } catch {
    // Ignore restricted notification contexts
  }
}

// LinkedIn 1-Click "Add to Profile" Certification URL Builder
export function buildLinkedInAddCertificateUrl(params: {
  courseTitle: string;
  certificateNumber: string;
  issueDate?: string;
  verifyUrl: string;
}): string {
  const cleanTitle = (params.courseTitle || 'Food Safety & Quality Management')
    .replace(/\bAccredited\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const parsedDate = params.issueDate ? new Date(params.issueDate) : new Date();
  const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const issueYear = String(safeDate.getFullYear());
  const issueMonth = String(safeDate.getMonth() + 1);

  const query = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: cleanTitle,
    organizationName: 'Food Science Portal',
    issueYear,
    issueMonth,
    certUrl: params.verifyUrl,
    certId: params.certificateNumber
  });

  return `https://www.linkedin.com/profile/add?${query.toString()}`;
}

export function buildLinkedInCertificatePostCaption(params: {
  courseTitle: string;
  certificateNumber: string;
  accreditationStandard?: string;
  scorePercentage?: number;
  distinction?: boolean;
  verifyUrl: string;
}): string {
  const cleanTitle = (params.courseTitle || 'Food Safety & Quality Management')
    .replace(/\bAccredited\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const scoreBadge =
    typeof params.scorePercentage === 'number'
      ? ` with ${params.scorePercentage}% (${params.distinction ? 'Distinction' : 'Passed'})`
      : '';

  const cleanStandard = (params.accreditationStandard || '')
    .replace(/\bAccredited\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const lines = [
    `I'm pleased to share that I have earned my certificate in ${cleanTitle}${scoreBadge} from Food Science Portal!`,
    '',
    `Credential ID: ${params.certificateNumber}`,
    ...(cleanStandard ? [`Standard: ${cleanStandard}`] : []),
    `Verify Certificate Online: ${params.verifyUrl}`,
    '',
    '#FoodSafety #FoodScience #QAQC #HACCP #ISO22000 #ProfessionalDevelopment'
  ];

  return lines.join('\n');
}

export function buildLinkedInFeedPostUrl(postText: string): string {
  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
    postText
  )}`;
}

// WhatsApp & Email Confirmation URL Builders for Admin Post-Approval Alerts
export function formatWhatsAppNumber(rawPhone?: string): string {
  const digits = (rawPhone || '').replace(/[^\d]/g, '');
  if (!digits) return '';
  if (digits.startsWith('03') && digits.length === 11) {
    return `92${digits.slice(1)}`;
  }
  if (digits.startsWith('00')) {
    return digits.slice(2);
  }
  return digits;
}

export function buildConfirmationAlertLinks(params: {
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  decision: 'verified' | 'rejected' | 'direct_cert';
  itemTitle: string;
  transactionId?: string;
  certificateNumber?: string;
  verifyUrl?: string;
  expiryDateLabel?: string;
}): {
  whatsappUrl: string;
  mailtoUrl: string;
  messageText: string;
  emailSubject: string;
} {
  const name = params.recipientName || 'Food Specialist';
  const portalUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://foodscienceportal.com';

  let emailSubject = '';
  let messageText = '';

  if (params.decision === 'direct_cert' || (params.decision === 'verified' && params.certificateNumber)) {
    emailSubject = `Certificate Approved & Verified — ${params.itemTitle} (${params.certificateNumber || ''})`;
    messageText = [
      `Assalam-o-Alaikum / Dear ${name},`,
      ``,
      `Congratulations! Your Food Science Portal official credential has been APPROVED and is now LIVE on our Online Verification Registry:`,
      `• Credential: ${params.itemTitle}`,
      params.certificateNumber ? `• Certificate ID: ${params.certificateNumber}` : '',
      params.transactionId ? `• Transaction / Ref ID: ${params.transactionId}` : '',
      params.verifyUrl ? `• Live QR & Online Verify Link: ${params.verifyUrl}` : '',
      params.expiryDateLabel ? `• Bonus Paid Membership Active Until: ${params.expiryDateLabel}` : '',
      ``,
      `You can now download your official Portrait A4 PDF Certificate and add it directly to LinkedIn from "My Certificates" on ${portalUrl}.`,
      ``,
      `Regards,`,
      `Food Science Portal Administration`
    ]
      .filter(Boolean)
      .join('\n');
  } else if (params.decision === 'verified') {
    emailSubject = `Paid Membership Activated — Food Science Portal`;
    messageText = [
      `Assalam-o-Alaikum / Dear ${name},`,
      ``,
      `Great news! Your Paid Premium Membership payment has been VERIFIED by Administration:`,
      `• Plan: ${params.itemTitle}`,
      params.transactionId ? `• Transaction / Ref ID: ${params.transactionId}` : '',
      params.expiryDateLabel ? `• Active Until: ${params.expiryDateLabel}` : '',
      ``,
      `All Paid PDF Reports, QA/QC Audit Templates Vault, Research ANOVA & Cloud Sync features are now unlocked on your account: ${portalUrl}`,
      ``,
      `Regards,`,
      `Food Science Portal Administration`
    ]
      .filter(Boolean)
      .join('\n');
  } else {
    emailSubject = `Payment Verification Update — Food Science Portal`;
    messageText = [
      `Dear ${name},`,
      ``,
      `Your payment verification submission (${params.itemTitle}${params.transactionId ? ` · Ref: ${params.transactionId}` : ''}) could not be verified. Please double-check your Transaction ID / receipt screenshot and resubmit from the portal or reply to Administration with a clear payment slip.`,
      ``,
      `Portal: ${portalUrl}`,
      `Food Science Portal Administration`
    ].join('\n');
  }

  const formattedPhone = formatWhatsAppNumber(params.recipientPhone);
  const whatsappUrl = formattedPhone
    ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`
    : `https://wa.me/?text=${encodeURIComponent(messageText)}`;

  const cleanEmail = (params.recipientEmail || '').trim();
  const mailtoUrl = `mailto:${encodeURIComponent(cleanEmail)}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(messageText)}`;

  return {
    whatsappUrl,
    mailtoUrl,
    messageText,
    emailSubject
  };
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [packMeta, setPackMeta] = useState<FactoryOfflinePackMeta | null>(() =>
    getSavedOfflinePackMeta()
  );
  const [justOnline, setJustOnline] = useState(false);

  useEffect(() => {
    const onOnline = () => {
      setPackMeta(getSavedOfflinePackMeta());
      setJustOnline(true);
      const t = setTimeout(() => setJustOnline(false), 3500);
      return () => clearTimeout(t);
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  if (isOnline && !justOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-36 md:bottom-20 right-3 sm:right-5 z-40 max-w-[calc(100vw-24px)] sm:max-w-sm rounded-2xl px-4 py-3 shadow-lg border flex items-center gap-2.5 text-xs font-bold transition-all ${
        isOnline
          ? 'bg-emerald-950 text-white border-emerald-500/40'
          : 'bg-[#0C182D] text-white border-amber-400/60'
      }`}
    >
      {isOnline ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Back online — Cloud progress synced.</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
          <div className="min-w-0">
            <p className="font-extrabold text-amber-200 leading-tight">
              Factory Floor Offline Mode Active
            </p>
            <p className="text-[11px] text-sky-100/90 font-medium leading-snug mt-0.5">
              {packMeta
                ? `Cached Pack ready (${packMeta.coursesCount} Courses · ${packMeta.authorityLimitsCount} Authority Limits · All Calculators).`
                : 'Offline calculators & cached pages remain usable without signal.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            title="Retry connection"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
};
