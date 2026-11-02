/**
 * Certificate Templates & SVG Data URL Generator for Food Specialists Portal
 * Generates verified, high-resolution accredited certificate mockups
 * for Highfield Qualifications, IRCA CQI, Exemplar Global, and Custom Courses.
 */

export interface CertificateTemplate {
  id: string;
  name: string;
  category: string;
  accreditation: string;
  sealColor: string;
  accentColor: string;
  badgeText: string;
  standardTitle: string;
}

export const CERTIFICATE_PRESETS: CertificateTemplate[] = [
  {
    id: 'tpl-highfield-haccp',
    name: 'Highfield UK Accredited (HACCP / Food Safety)',
    category: 'Highfield',
    accreditation: 'Highfield Qualifications (UK Approved Awarding Organisation)',
    sealColor: '#15803D',
    accentColor: '#166534',
    badgeText: 'HIGHFIELD ACCREDITED QUALIFICATION',
    standardTitle: 'Award in HACCP & Food Safety Management'
  },
  {
    id: 'tpl-irca-cqi',
    name: 'IRCA | CQI Certified Lead Auditor',
    category: 'Lead Auditor',
    accreditation: 'Chartered Quality Institute & International Register of Certificated Auditors',
    sealColor: '#0B3B1E',
    accentColor: '#14532D',
    badgeText: 'IRCA CQI CERTIFICATED LEAD AUDITOR',
    standardTitle: 'ISO 22000 / FSSC 22000 Lead Auditor Course'
  },
  {
    id: 'tpl-exemplar-global',
    name: 'Exemplar Global Recognised Lead Auditor',
    category: 'Lead Auditor',
    accreditation: 'Exemplar Global Personnel Certification & Training Framework',
    sealColor: '#1E40AF',
    accentColor: '#1E3A8A',
    badgeText: 'EXEMPLAR GLOBAL ACCREDITED AUDITOR',
    standardTitle: 'Lead Auditor Professional Competency Certificate'
  },
  {
    id: 'tpl-custom-specialist',
    name: 'Food Specialists Portal Verified Certificate',
    category: 'Custom',
    accreditation: 'Food Specialists Professional Training & Continuous Development Directorate',
    sealColor: '#0F766E',
    accentColor: '#134E4A',
    badgeText: 'VERIFIED PROFESSIONAL CERTIFICATE',
    standardTitle: 'Advanced Food Science & Quality Standards Certificate'
  }
];

export function generateCertificateSvgDataUrl(
  courseTitle: string,
  category: string,
  subType?: string | null,
  standardCode?: string,
  candidateName = 'STUDENT / CANDIDATE NAME'
): string {
  const safeTitle = courseTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeCat = category.replace(/&/g, '&amp;');
  const safeSub = (subType || (category === 'Highfield' ? 'UK Regulated Qualification' : 'Accredited Certification')).replace(/&/g, '&amp;');
  const safeStandard = (standardCode || 'ISO / HACCP Standard Framework').replace(/&/g, '&amp;');
  const certNumber = `FS-${Math.abs(hashString(courseTitle + category)).toString().padStart(6, '0')}-2026`;

  const isHighfield = category.toLowerCase().includes('highfield');
  const isLeadAuditor = category.toLowerCase().includes('lead') || (subType && (subType.includes('IRCA') || subType.includes('Exemplar')));

  const primaryColor = isHighfield ? '#15803D' : isLeadAuditor ? '#0B3B1E' : '#0F766E';
  const secondaryColor = isHighfield ? '#D0ECDA' : isLeadAuditor ? '#DCF2E3' : '#CCFBF1';
  const goldColor = '#D97706';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFDFD" />
      <stop offset="100%" stop-color="#F2F8F4" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" />
      <stop offset="100%" stop-color="#052E16" />
    </linearGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="900" height="620" fill="url(#bgGrad)" />

  <!-- Outer Geometric Guilloche Border -->
  <rect x="25" y="25" width="850" height="570" rx="16" fill="none" stroke="${primaryColor}" stroke-width="4" />
  <rect x="35" y="35" width="830" height="550" rx="12" fill="none" stroke="#D1D5DB" stroke-width="1.2" stroke-dasharray="6,4" />
  <rect x="42" y="42" width="816" height="536" rx="8" fill="none" stroke="${goldColor}" stroke-width="1.5" />

  <!-- Corner Ornaments -->
  <g fill="${goldColor}">
    <circle cx="48" cy="48" r="5" />
    <circle cx="852" cy="48" r="5" />
    <circle cx="48" cy="572" r="5" />
    <circle cx="852" cy="572" r="5" />
  </g>

  <!-- Top Header Ribbon / Emblem -->
  <g transform="translate(450, 85)" text-anchor="middle">
    <circle cx="0" cy="0" r="32" fill="${secondaryColor}" stroke="${primaryColor}" stroke-width="2.5" />
    <!-- Graduation Cap / Shield Icon -->
    <path d="M-16 -6 L0 -14 L16 -6 L0 2 Z" fill="${primaryColor}" />
    <path d="M-10 -2 V8 C-10 13 -4 16 0 16 C4 16 10 13 10 8 V-2" fill="none" stroke="${primaryColor}" stroke-width="2" />
    <path d="M12 -4 V9" stroke="${goldColor}" stroke-width="2" />
  </g>

  <!-- Accreditation Header -->
  <text x="450" y="145" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="${primaryColor}" letter-spacing="4">
    FOOD SPECIALISTS PORTAL • PROFESSIONAL ACCREDITATION
  </text>
  <text x="450" y="166" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#6B7280" letter-spacing="1.5">
    ${safeSub.toUpperCase()}
  </text>

  <!-- Title "Certificate of Completion" -->
  <text x="450" y="220" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#111827">
    Certificate of Competency
  </text>
  <line x1="330" y1="234" x2="570" y2="234" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round" />

  <text x="450" y="266" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#4B5563">
    This is officially awarded to verify successful completion and examination in:
  </text>

  <!-- Candidate Name Placeholder Box -->
  <rect x="220" y="285" width="460" height="42" rx="8" fill="#FFFFFF" stroke="${secondaryColor}" stroke-width="1.5" />
  <text x="450" y="312" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#1F2937" letter-spacing="1">
    ${candidateName}
  </text>

  <!-- Course Title Box -->
  <g transform="translate(450, 375)" text-anchor="middle">
    <rect x="-350" y="-28" width="700" height="56" rx="14" fill="${secondaryColor}" stroke="${primaryColor}" stroke-width="1.8" />
    <text x="0" y="2" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="800" fill="${primaryColor}">
      ${safeTitle}
    </text>
    <text x="0" y="19" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#065F46" letter-spacing="1">
      ${safeCat.toUpperCase()} • ${safeStandard.toUpperCase()}
    </text>
  </g>

  <!-- Bottom Golden Seal (Left) -->
  <g transform="translate(140, 495)">
    <circle cx="0" cy="0" r="42" fill="url(#goldGrad)" stroke="#FFFFFF" stroke-width="3" filter="drop-shadow(0px 2px 6px rgba(0,0,0,0.2))" />
    <circle cx="0" cy="0" r="35" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="4,2" />
    <text x="0" y="-8" text-anchor="middle" font-family="system-ui, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" letter-spacing="1">
      AUTHENTIC
    </text>
    <text x="0" y="5" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#FFFFFF">
      VERIFIED
    </text>
    <text x="0" y="17" text-anchor="middle" font-family="system-ui, sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" letter-spacing="1">
      SPECIALIST
    </text>
    <!-- Ribbon tails -->
    <path d="M-14 36 L-24 64 L-8 54 L0 64 L-4 36 Z" fill="${goldColor}" />
    <path d="M14 36 L24 64 L8 54 L0 64 L4 36 Z" fill="${goldColor}" />
  </g>

  <!-- Signatures & Verification Details (Middle & Right) -->
  <g transform="translate(350, 485)">
    <path d="M0 0 Q40 -12 80 -4 T160 -8" fill="none" stroke="#1F2937" stroke-width="1.8" />
    <line x1="0" y1="5" x2="160" y2="5" stroke="#9CA3AF" stroke-width="1" />
    <text x="80" y="20" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#374151">
      Authorised Lead Assessor
    </text>
    <text x="80" y="33" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="500" fill="#6B7280">
      Chartered Quality Specialist
    </text>
  </g>

  <g transform="translate(600, 485)">
    <path d="M0 -4 Q50 -18 100 2 T160 -6" fill="none" stroke="#1F2937" stroke-width="1.8" />
    <line x1="0" y1="5" x2="160" y2="5" stroke="#9CA3AF" stroke-width="1" />
    <text x="80" y="20" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#374151">
      Academic Directorate
    </text>
    <text x="80" y="33" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="500" fill="#6B7280">
      Food Specialists Portal
    </text>
  </g>

  <!-- Certificate ID and Barcode / Security strip footer -->
  <rect x="50" y="555" width="800" height="24" rx="4" fill="#E5E7EB" opacity="0.6" />
  <text x="70" y="571" font-family="monospace" font-size="10" font-weight="700" fill="#374151">
    Credential Verification ID: ${certNumber}
  </text>
  <text x="830" y="571" text-anchor="end" font-family="system-ui, sans-serif" font-size="9.5" font-weight="600" fill="#4B5563">
    Official Accredited Sample • Verify at foodspecialists.org/verify
  </text>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
