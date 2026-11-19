export const OFFICIAL_APP_PORTAL_URL = 'https://foodscienceportal.com';

/**
 * Resolves the official public Website base URL for certificate verification,
 * ensuring internal preview/container origins (.run.app, localhost) resolve to the public website URL,
 * while preserving the user's live website or custom domain when accessed on the web.
 */
export function resolveOfficialVerificationBaseUrl(rawUrl?: string): string {
  const browserFullBase =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname
          .replace(/\/index\.html$/i, '')
          .replace(/\/$/, '')}`
      : '';
  const candidate = (rawUrl || browserFullBase || OFFICIAL_APP_PORTAL_URL)
    .trim()
    .replace(/\/$/, '');

  if (
    !candidate ||
    candidate.toLowerCase().includes('.run.app') ||
    candidate.toLowerCase().includes('localhost') ||
    candidate.toLowerCase().includes('127.0.0.1')
  ) {
    return OFFICIAL_APP_PORTAL_URL;
  }
  return candidate;
}

/**
 * Builds the direct verification URL encoded in the QR code and validation link.
 * Scanning the QR code or opening this link opens the app's Certificate Verification Portal
 * and automatically verifies the certificate.
 */
export function buildDirectCertificateVerifyUrl(params: {
  certificateNumber: string;
  recipientName?: string;
  courseTitle?: string;
  courseCode?: string;
  accreditationStandard?: string;
  scorePercentage?: number;
  issueDate?: string;
  baseUrl?: string;
}): string {
  const base = resolveOfficialVerificationBaseUrl(params.baseUrl);
  const query = new URLSearchParams();
  query.set('verify', params.certificateNumber.trim().toUpperCase());
  if (params.recipientName) query.set('name', params.recipientName.trim());
  if (params.courseTitle) query.set('course', params.courseTitle.trim());
  if (params.courseCode) query.set('code', params.courseCode.trim());
  if (params.accreditationStandard) {
    query.set('std', params.accreditationStandard.trim());
  }
  if (typeof params.scorePercentage === 'number') {
    query.set('score', String(params.scorePercentage));
  }
  if (params.issueDate) query.set('date', params.issueDate.trim());
  return `${base}/?${query.toString()}`;
}
