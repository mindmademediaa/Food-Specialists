import { jsPDF } from 'jspdf';
import { FS_PORTAL_LOGO_DATA_URI } from './brandLogo';

const avatarPngCache = new Map<string, string>();

/**
 * Converts a loaded HTMLImageElement into a center-cropped square PNG Data URI
 * so jsPDF can embed any format (WebP, JPEG, PNG, or CORS-enabled remote image)
 * without distortion.
 */
function imageElementToSquarePngDataUri(img: HTMLImageElement, sizePx = 256): string | null {
  try {
    const nw = img.naturalWidth || img.width;
    const nh = img.naturalHeight || img.height;
    if (!nw || !nh) return null;

    const canvas = document.createElement('canvas');
    canvas.width = sizePx;
    canvas.height = sizePx;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, sizePx, sizePx);

    const minDim = Math.min(nw, nh);
    const sx = (nw - minDim) / 2;
    const sy = (nh - minDim) / 2;
    ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, sizePx, sizePx);

    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

/**
 * Preloads and caches a user's profile picture URL as a square PNG Data URI
 * so synchronous PDF generators can immediately embed it.
 */
export function preloadUserAvatarForPdf(url?: string | null): void {
  if (!url || typeof window === 'undefined') return;
  const trimmed = url.trim();
  if (!trimmed || avatarPngCache.has(trimmed)) return;

  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const pngUri = imageElementToSquarePngDataUri(img, 256);
      if (pngUri) {
        avatarPngCache.set(trimmed, pngUri);
      }
    };
    img.src = trimmed;
  } catch {
    // Ignore preload errors
  }
}

/**
 * Synchronously resolves a user's profile picture into a jsPDF-compatible image source
 * and format ('PNG' | 'JPEG' | 'WEBP').
 */
export function resolveUserAvatarForJsPdf(
  rawUrl?: string | null
): { dataUri: string; format: 'PNG' | 'JPEG' | 'WEBP' } | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // 1. Check pre-converted PNG cache
  const cached = avatarPngCache.get(trimmed);
  if (cached) {
    return { dataUri: cached, format: 'PNG' };
  }

  // 2. Check if any currently rendered <img> in the DOM already has this image loaded
  if (typeof document !== 'undefined' && document.images) {
    for (let i = 0; i < document.images.length; i++) {
      const domImg = document.images[i];
      if (
        (domImg.src === trimmed || domImg.currentSrc === trimmed) &&
        domImg.complete &&
        domImg.naturalWidth > 0
      ) {
        const converted = imageElementToSquarePngDataUri(domImg, 256);
        if (converted) {
          avatarPngCache.set(trimmed, converted);
          return { dataUri: converted, format: 'PNG' };
        }
      }
    }
  }

  // 3. Trigger async preload for future downloads
  preloadUserAvatarForPdf(trimmed);

  // 4. If it's already a data:image/* URI, pass it directly to jsPDF
  if (trimmed.startsWith('data:image/png')) {
    return { dataUri: trimmed, format: 'PNG' };
  }
  if (
    trimmed.startsWith('data:image/jpeg') ||
    trimmed.startsWith('data:image/jpg')
  ) {
    return { dataUri: trimmed, format: 'JPEG' };
  }
  if (trimmed.startsWith('data:image/webp')) {
    return { dataUri: trimmed, format: 'WEBP' };
  }

  return null;
}

/**
 * Draws the official Food Science Portal circular emblem logo inside a crisp,
 * high-contrast white rounded container so the full microscope, gears, and DNA emblem
 * is large, zoomed, and crystal-clear on every PDF and Certificate.
 */
export function drawPdfBrandLogo(
  doc: jsPDF,
  x: number,
  y: number,
  sizeMm: number,
  options?: {
    borderColor?: [number, number, number];
    bgFill?: [number, number, number];
    roundedRadius?: number;
  }
): void {
  const borderCol = options?.borderColor || [22, 115, 184];
  const bgCol = options?.bgFill || [255, 255, 255];
  const radius = options?.roundedRadius ?? 3.2;

  doc.setFillColor(bgCol[0], bgCol[1], bgCol[2]);
  doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, sizeMm, sizeMm, radius, radius, 'FD');

  try {
    const pad = Math.max(0.4, sizeMm * 0.02);
    doc.addImage(
      FS_PORTAL_LOGO_DATA_URI,
      'PNG',
      x + pad,
      y + pad,
      sizeMm - pad * 2,
      sizeMm - pad * 2
    );
  } catch {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(Math.max(9, sizeMm * 0.45));
    doc.setTextColor(22, 115, 184);
    doc.text('FSP', x + sizeMm / 2, y + sizeMm * 0.6, { align: 'center' });
  }
}

/**
 * Draws the user's profile picture inside a neat framed portrait box on any PDF or Certificate.
 * If the user has not uploaded a photo yet (or if a remote photo cannot be read synchronously),
 * draws a clean executive monogram avatar badge with the user's initials.
 */
export function drawPdfUserPhoto(
  doc: jsPDF,
  profilePicUrl: string | undefined | null,
  userName: string,
  x: number,
  y: number,
  sizeMm: number,
  options?: {
    borderColor?: [number, number, number];
    fallbackBgColor?: [number, number, number];
    fallbackTextColor?: [number, number, number];
    showCaption?: string;
  }
): void {
  const borderCol = options?.borderColor || [255, 255, 255];
  const fallbackBg = options?.fallbackBgColor || [22, 115, 184];
  const fallbackTxt = options?.fallbackTextColor || [255, 255, 255];

  // Outer white/accent frame
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
  doc.setLineWidth(0.65);
  doc.roundedRect(x, y, sizeMm, sizeMm, 2.8, 2.8, 'FD');

  const resolved = resolveUserAvatarForJsPdf(profilePicUrl);
  let drewPhoto = false;

  if (resolved) {
    try {
      const pad = 0.7;
      doc.addImage(
        resolved.dataUri,
        resolved.format,
        x + pad,
        y + pad,
        sizeMm - pad * 2,
        sizeMm - pad * 2
      );
      drewPhoto = true;
    } catch {
      drewPhoto = false;
    }
  }

  if (!drewPhoto) {
    const pad = 0.8;
    doc.setFillColor(fallbackBg[0], fallbackBg[1], fallbackBg[2]);
    doc.roundedRect(
      x + pad,
      y + pad,
      sizeMm - pad * 2,
      sizeMm - pad * 2,
      2.2,
      2.2,
      'F'
    );

    const initials = (userName || 'Food Specialist')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(Math.max(10, sizeMm * 0.44));
    doc.setTextColor(fallbackTxt[0], fallbackTxt[1], fallbackTxt[2]);
    doc.text(initials || 'FS', x + sizeMm / 2, y + sizeMm * 0.62, {
      align: 'center'
    });
  }

  if (options?.showCaption) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.text(options.showCaption, x + sizeMm / 2, y + sizeMm + 3.2, {
      align: 'center'
    });
  }
}

/**
 * Sanitizes text for jsPDF built-in fonts (Helvetica / Times / Courier, WinAnsi encoding)
 * by converting unsupported Unicode glyphs, subscripts, arrows, and symbols into crisp
 * WinAnsi-safe equivalents and stripping unsupported emojis/characters.
 */
export function sanitizePdfText(
  value: unknown,
  collapseMultiSpaces = false
): string {
  if (value === null || value === undefined) return '';
  let str = String(value);

  const replacements: Array<[RegExp, string]> = [
    [/[✓✔✅]/g, '[OK]'],
    [/[✗✘✕❌]/g, '[X]'],
    [/≥/g, '>='],
    [/≤/g, '<='],
    [/≈/g, '~'],
    [/≠/g, '!='],
    [/[→➡➔➝]/g, '->'],
    [/←/g, '<-'],
    [/⇒/g, '=>'],
    [/↑/g, '^'],
    [/↓/g, 'v'],
    [/α/g, 'alpha'],
    [/β/g, 'beta'],
    [/γ/g, 'gamma'],
    [/μ/g, 'u'],
    [/Ω/g, 'Ohm'],
    [/℃/g, ' C'],
    [/℉/g, ' F'],
    [/₹/g, 'Rs. '],
    [/₀/g, '0'],
    [/₁/g, '1'],
    [/₂/g, '2'],
    [/₃/g, '3'],
    [/₄/g, '4'],
    [/₅/g, '5'],
    [/₆/g, '6'],
    [/₇/g, '7'],
    [/₈/g, '8'],
    [/₉/g, '9'],
    [/⁰/g, '0'],
    [/¹/g, '1'],
    [/⁴/g, '4'],
    [/⁵/g, '5'],
    [/⁶/g, '6'],
    [/⁷/g, '7'],
    [/⁸/g, '8'],
    [/⁹/g, '9'],
    [/[‘’]/g, "'"],
    [/[“”]/g, '"'],
    [/…/g, '...'],
    [/[•●◦▪▫]/g, '-'],
    [/[★☆✦◆◇▸►]/g, '*'],
    [/[–—]/g, '-']
  ];

  for (const [pattern, rep] of replacements) {
    str = str.replace(pattern, rep);
  }

  // Strip surrogate pairs (emojis) and any non-Latin1 characters unsupported by jsPDF standard fonts
  str = str.replace(/[\uD800-\uDFFF]/g, '');
  str = str.replace(/[^\t\r\n\x20-\xFF]/g, '');

  if (collapseMultiSpaces) {
    str = str
      .split('\n')
      .map((line) => line.replace(/ {2,}/g, ' ').trim())
      .join('\n');
  }

  return str;
}

/**
 * Truncates a single line of text cleanly with "..." so it never exceeds maxWidthMm
 * in the currently active jsPDF font/size.
 */
export function fitPdfTextToWidth(
  doc: jsPDF,
  text: unknown,
  maxWidthMm: number,
  collapseMultiSpaces = true
): string {
  const clean = sanitizePdfText(text, collapseMultiSpaces).replace(/\s*\n+\s*/g, ' ').trim();
  if (!clean || maxWidthMm <= 6) return clean;
  if (doc.getTextWidth(clean) <= maxWidthMm) return clean;

  const ellipsis = '...';
  let out = clean;
  while (out.length > 1 && doc.getTextWidth(out + ellipsis) > maxWidthMm) {
    out = out.slice(0, -1).trimEnd();
  }
  return out + ellipsis;
}

