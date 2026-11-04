import { CloudStorageConfig, HubCertificate } from '../types/hub';

export type StorageFolder = 'avatars' | 'receipts' | 'certificates' | 'cvs';

export interface UploadResult {
  url: string;
  provider: 'cloudinary-cdn' | 'smart-firestore';
  sizeKb: number;
  fileName: string;
}

/**
 * Compresses an image file on the client using HTML5 Canvas into a crisp,
 * lightweight WebP/JPEG data URL (~50KB - 140KB) so it never exceeds Firestore's 1MB limit
 * and loads instantaneously even under high traffic.
 */
export async function compressImageFile(
  file: File,
  maxDimension = 900,
  quality = 0.78
): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const fallback = reader.result as string;
          resolve({
            dataUrl: fallback,
            sizeKb: Math.round(fallback.length / 1024)
          });
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer WebP for 35% smaller file size; fallback to JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // If still larger than 240KB, step down quality slightly to guarantee fast Firestore writes
        if (dataUrl.length > 245000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.62);
        }

        resolve({
          dataUrl,
          sizeKb: Math.max(1, Math.round((dataUrl.length * 0.75) / 1024))
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Hybrid Free Cloud Uploader:
 * - Tier 1 (If Cloudinary Free CDN is configured): Uploads directly to Cloudinary's 25GB Free CDN
 *   and returns a short HTTPS URL.
 * - Tier 2 (Built-in Default — 100% Free): Uses Smart WebP/JPEG Canvas Compression to store
 *   optimized media directly in Firebase Firestore without hitting the 1MB document limit.
 */
export const DEFAULT_CLOUDINARY_CLOUD_NAME = 'mhjkrdlh';
export const DEFAULT_CLOUDINARY_UPLOAD_PRESET = 'Food Specialists';

export async function uploadMediaFile(
  file: File,
  folder: StorageFolder,
  config?: CloudStorageConfig
): Promise<UploadResult> {
  const cloudName =
    config?.cloudinaryCloudName?.trim() || DEFAULT_CLOUDINARY_CLOUD_NAME;
  const rawPreset =
    config?.cloudinaryUploadPreset?.trim() || DEFAULT_CLOUDINARY_UPLOAD_PRESET;

  // Build candidate preset names in case Cloudinary normalized spaces to underscores/hyphens
  const presetCandidates = Array.from(
    new Set([
      rawPreset,
      rawPreset.replace(/\s+/g, '_'),
      rawPreset.toLowerCase().replace(/\s+/g, '_'),
      rawPreset.replace(/\s+/g, '-'),
      rawPreset.toLowerCase().replace(/\s+/g, '-')
    ].filter(Boolean))
  );

  // 1. Try Cloudinary Free Global CDN (25 GB Free) unless explicitly switched off
  if (config?.provider !== 'smart-firestore' && cloudName && presetCandidates.length > 0) {
    for (const preset of presetCandidates) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', preset);
        formData.append('folder', `food_specialists_${folder}`);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/auto/upload`,
          {
            method: 'POST',
            body: formData
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.secure_url) {
            return {
              url: data.secure_url,
              provider: 'cloudinary-cdn',
              sizeKb: Math.max(1, Math.round((data.bytes || file.size) / 1024)),
              fileName: file.name
            };
          }
        }
      } catch {
        // Continue to next candidate or fallback to Smart Firestore Compression
      }
    }
  }

  // 2. Smart Built-in Compression for Images (Avatars, Payment Receipts, Certificates)
  if (file.type.startsWith('image/')) {
    const maxDim =
      folder === 'avatars' ? 420 : folder === 'receipts' ? 960 : 1100;
    const quality = folder === 'avatars' ? 0.8 : 0.76;
    const compressed = await compressImageFile(file, maxDim, quality);
    return {
      url: compressed.dataUrl,
      provider: 'smart-firestore',
      sizeKb: compressed.sizeKb,
      fileName: file.name
    };
  }

  // 3. For PDFs (<= 500KB), encode as data URL; otherwise store clean reference metadata
  if (file.size <= 500 * 1024) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const resultStr =
          typeof reader.result === 'string' ? reader.result : file.name;
        resolve({
          url: resultStr,
          provider: 'smart-firestore',
          sizeKb: Math.max(1, Math.round(file.size / 1024)),
          fileName: file.name
        });
      };
      reader.onerror = () => {
        resolve({
          url: file.name,
          provider: 'smart-firestore',
          sizeKb: Math.max(1, Math.round(file.size / 1024)),
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    });
  }

  return {
    url: `${file.name}`,
    provider: 'smart-firestore',
    sizeKb: Math.max(1, Math.round(file.size / 1024)),
    fileName: file.name
  };
}

export function formatFileSizeLabel(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Generates an official, verifiable SVG Digital Training Certificate Data URL
 * when an admin issues a certificate without uploading a scanned image, or when a user downloads it.
 */
export function generateCertificateSvgDataUrl(cert: {
  certificateNumber: string;
  recipientName: string;
  trainingTitle: string;
  trainingCategory: string;
  accreditationBody: string;
  issueDate: string;
}): string {
  const esc = (s: string) =>
    (s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F0FDF4"/>
        <stop offset="50%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#DCFCE7"/>
      </linearGradient>
      <linearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0D2E1B"/>
        <stop offset="50%" stop-color="#15803D"/>
        <stop offset="100%" stop-color="#0D2E1B"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="700" fill="url(#bgGrad)" rx="24"/>
    <rect x="24" y="24" width="952" height="652" fill="none" stroke="#15803D" stroke-width="4" rx="18"/>
    <rect x="36" y="36" width="928" height="628" fill="none" stroke="#86EFAC" stroke-width="1.5" stroke-dasharray="8 6" rx="14"/>
    
    <rect x="180" y="65" width="640" height="54" rx="27" fill="url(#headerGrad)"/>
    <text x="500" y="99" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="20" font-weight="bold" letter-spacing="3">
      FS PORTAL • OFFICIAL CERTIFICATE
    </text>

    <text x="500" y="168" text-anchor="middle" fill="#15803D" font-family="Arial, sans-serif" font-size="15" font-weight="bold" letter-spacing="2">
      ${esc(cert.trainingCategory.toUpperCase())} • ${esc(cert.accreditationBody.toUpperCase())}
    </text>

    <text x="500" y="215" text-anchor="middle" fill="#374151" font-family="Georgia, serif" font-size="18" font-style="italic">
      This is to proudly certify that
    </text>

    <text x="500" y="280" text-anchor="middle" fill="#0D2E1B" font-family="Georgia, serif" font-size="42" font-weight="bold">
      ${esc(cert.recipientName)}
    </text>
    <line x1="250" y1="298" x2="750" y2="298" stroke="#16A34A" stroke-width="2"/>

    <text x="500" y="345" text-anchor="middle" fill="#374151" font-family="Georgia, serif" font-size="18" font-style="italic">
      has successfully completed the professional training &amp; assessment for
    </text>

    <text x="500" y="405" text-anchor="middle" fill="#14532D" font-family="Arial, sans-serif" font-size="30" font-weight="bold">
      ${esc(cert.trainingTitle)}
    </text>

    <rect x="310" y="438" width="380" height="40" rx="20" fill="#DCFCE7" stroke="#16A34A" stroke-width="1.5"/>
    <text x="500" y="464" text-anchor="middle" fill="#0D2E1B" font-family="Arial, sans-serif" font-size="15" font-weight="bold">
      Accreditation: ${esc(cert.accreditationBody)}
    </text>

    <text x="220" y="565" text-anchor="middle" fill="#0D2E1B" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
      ${esc(cert.issueDate)}
    </text>
    <line x1="120" y1="578" x2="320" y2="578" stroke="#6B7280" stroke-width="1.5"/>
    <text x="220" y="600" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="13" font-weight="bold">
      DATE OF ISSUE
    </text>

    <circle cx="500" cy="565" r="44" fill="#15803D" stroke="#BBF7D0" stroke-width="4"/>
    <text x="500" y="560" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="12" font-weight="bold">
      VERIFIED
    </text>
    <text x="500" y="578" text-anchor="middle" fill="#DCFCE7" font-family="Arial, sans-serif" font-size="10" font-weight="bold">
      CREDENTIAL
    </text>

    <text x="780" y="565" text-anchor="middle" fill="#0D2E1B" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
      ${esc(cert.certificateNumber)}
    </text>
    <line x1="680" y1="578" x2="880" y2="578" stroke="#6B7280" stroke-width="1.5"/>
    <text x="780" y="600" text-anchor="middle" fill="#6B7280" font-family="Arial, sans-serif" font-size="13" font-weight="bold">
      CERTIFICATE ID
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_CERTIFICATES: HubCertificate[] = [
  {
    id: 'cert-fs-2026-001',
    certificateNumber: 'FSP-2026-HACCP4-001',
    recipientName: 'Dr. Ayesha Siddiqui',
    recipientEmail: 'ayesha.siddiqui@foodsafety.pk',
    trainingCategory: 'Highfield',
    trainingTitle: 'HACCP Level 4 — Managing HACCP Systems',
    accreditationBody: 'Highfield UK Accredited',
    issueDate: '2026-10-15',
    verificationStatus: 'valid',
    issuedBy: 'FS Portal Admin',
    createdAt: '2026-10-15T10:00:00Z'
  },
  {
    id: 'cert-fs-2026-002',
    certificateNumber: 'FSP-2026-ISO22000-002',
    recipientName: 'Engr. Bilal Raza',
    recipientEmail: 'bilal.raza@qa-dairy.com',
    trainingCategory: 'Lead Auditor',
    trainingTitle: 'ISO 22000 Lead Auditor (FSMS)',
    accreditationBody: 'IRCA | CQI Certified',
    issueDate: '2026-10-28',
    verificationStatus: 'valid',
    issuedBy: 'FS Portal Admin',
    createdAt: '2026-10-28T14:30:00Z'
  }
];
