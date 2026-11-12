import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { drawPdfBrandLogo, drawPdfUserPhoto } from '../lib/pdfBranding';
import {
  CertificateSignatureId,
  drawSignaturePresetOnPdf,
  getSavedCertificateSignatureId,
  getSavedCustomSignatureDataUrl
} from './certificateSignatures';

export const OFFICIAL_APP_PORTAL_URL =
  'https://mindmademediaa.github.io/food-specialists';

export interface OfficialCertificatePdfParams {
  certificateNumber: string;
  recipientName: string;
  recipientEmail?: string;
  recipientProfilePicUrl?: string;
  courseTitle: string;
  courseCode: string;
  accreditationStandard: string;
  scorePercentage: number;
  correctCount?: number;
  totalQuestions?: number;
  distinction: boolean;
  issueDate: string;
  verificationPortalUrl?: string;
  syllabusModules?: string[];
  issuedByMode?: 'exam' | 'admin_direct';
  signatureStyleId?: CertificateSignatureId;
  customSignatureImageUrl?: string;
}

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

/**
 * Returns a 2D boolean matrix for a QR code so both the React preview SVG
 * and the jsPDF generator can render a crisp, scannable vector QR code.
 */
export function generateQrCodeMatrix(text: string): boolean[][] {
  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
    const size = qr.modules.size;
    const matrix: boolean[][] = [];
    for (let r = 0; r < size; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < size; c++) {
        row.push(Boolean(qr.modules.get(r, c)));
      }
      matrix.push(row);
    }
    return matrix;
  } catch {
    return [];
  }
}

/**
 * Removes any occurrence of the word "accredited" from certificate display strings.
 */
export function stripAccreditedWord(text?: string): string {
  return (text || '')
    .replace(/\baccredited\b\s*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Normalizes the course's module titles into a clean sequential list (Module 1 .. Module 5).
 */
export function getSequentialModuleList(
  syllabusModules?: string[],
  courseTitle?: string
): string[] {
  const defaultModules = [
    'Fundamentals, Core Terminology & International Scope',
    'Prerequisite Programs (PRPs), Hygiene & Operational Controls',
    'Preliminary Steps, Process Flow & System Planning',
    'Hazard Analysis, 5x5 Risk Assessment Matrix & Decision Tree',
    'Internal Auditing, Corrective Actions & Regulatory Law'
  ];

  const rawList =
    syllabusModules && syllabusModules.length > 0
      ? syllabusModules
      : defaultModules;

  return rawList.map((rawTitle, idx) => {
    const cleaned = stripAccreditedWord(
      rawTitle.replace(/^Module\s*\d+\s*[:.-]\s*/i, '').trim()
    );
    return `Module ${idx + 1}: ${cleaned || (courseTitle ? `${stripAccreditedWord(courseTitle)} Stage ${idx + 1}` : defaultModules[idx] || 'Core Competency')}`;
  });
}

/**
 * Generates and downloads an official Portrait A4 (210mm x 297mm) PDF Certificate:
 *  1. Displays the large, clear Food Science Portal Logo + "Food Science Portal" at the top
 *  2. Displays the recipient's Name and Profile Picture
 *  3. Properly fits Course Title, Code/Standard, and lists all Modules sequentially one below another inside the certificate bounds
 *  4. 3-Column Metrics Row: Certificate No. | Awarded | Exam Score
 *  5. Validation section links directly to the App/Website Verification Portal
 *  6. Scannable vector QR Code on the bottom-right for instant verification on scan
 *  7. "Endorsed by Food Science Portal" badge with official emblem
 */
export function downloadOfficialCourseCertificatePdf(
  params: OfficialCertificatePdfParams
): void {
  const {
    certificateNumber,
    recipientName,
    recipientProfilePicUrl,
    courseTitle,
    courseCode,
    accreditationStandard,
    scorePercentage,
    correctCount = Math.round((scorePercentage / 100) * 40),
    totalQuestions = 40,
    distinction,
    issueDate,
    verificationPortalUrl,
    syllabusModules = []
  } = params;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Portrait A4 dimensions: 210mm x 297mm
  const W = 210;
  const H = 297;
  const blueBarW = 46;
  const leftX = 54;
  const rightEdgeX = 196;
  const contentWidth = rightEdgeX - leftX; // 142mm

  const officialBaseUrl = resolveOfficialVerificationBaseUrl(verificationPortalUrl);
  const directVerifyUrl = buildDirectCertificateVerifyUrl({
    certificateNumber,
    recipientName,
    courseTitle,
    courseCode,
    accreditationStandard,
    scorePercentage,
    issueDate,
    baseUrl: officialBaseUrl
  });
  const shortVerifyDisplayUrl = `${officialBaseUrl}/?verify=${certificateNumber}`;

  // =========================================================================
  // 1. PURE WHITE MAIN CANVAS (No background "U" watermark)
  // =========================================================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // Subtle inner border frame on the white canvas to keep visual margins crisp
  doc.setDrawColor(218, 228, 238);
  doc.setLineWidth(0.4);
  doc.rect(blueBarW + 4, 6, W - blueBarW - 10, H - 12);

  // =========================================================================
  // 2. LEFT FULL-HEIGHT ROYAL BLUE SIDEBAR + GIANT VERTICAL "Certificate"
  // =========================================================================
  doc.setFillColor(22, 115, 184); // #1673B8
  doc.rect(0, 0, blueBarW, H, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(142);
  doc.setTextColor(16, 94, 154);
  doc.text('Certificate', 39.5, 287, { angle: 90 });

  // =========================================================================
  // 3. TOP-LEFT LARGE BRAND LOGO + "Food Science Portal" & TOP-RIGHT ROSETTE SEAL
  // =========================================================================
  // Large, crystal-clear Food Science Portal Logo (21mm x 21mm) at the top
  drawPdfBrandLogo(doc, leftX, 11, 21, {
    borderColor: [22, 115, 184],
    bgFill: [255, 255, 255],
    roundedRadius: 3.5
  });

  const brandTextX = leftX + 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(12, 24, 45);
  doc.text('Food Science ', brandTextX, 19.5);

  const portW = doc.getTextWidth('Food Science ');
  doc.setTextColor(22, 115, 184);
  doc.text('Portal', brandTextX + portW, 19.5);
  const alW = doc.getTextWidth('Portal');

  doc.setFillColor(22, 115, 184);
  doc.rect(brandTextX + portW + 0.3, 20.8, alW - 0.5, 1.2, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(71, 85, 105);
  doc.text('"International Food Science Community"', brandTextX, 25.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.4);
  doc.setTextColor(22, 115, 184);
  doc.text('Official FSP verified Credential', brandTextX, 29.8);

  // Top-Right Blue Scalloped Rosette Seal with Two Ribbons (center x = 180mm, y = 26mm)
  const sealX = 180;
  const sealY = 26;

  doc.setFillColor(22, 115, 184);
  doc.triangle(sealX - 8.5, sealY + 11, sealX - 2, sealY + 11, sealX - 10.5, sealY + 25, 'F');
  doc.triangle(sealX - 2, sealY + 11, sealX - 4, sealY + 24, sealX - 7.5, sealY + 20, 'F');
  doc.triangle(sealX + 2, sealY + 11, sealX + 8.5, sealY + 11, sealX + 10.5, sealY + 24, 'F');
  doc.triangle(sealX + 2, sealY + 11, sealX + 4, sealY + 24, sealX + 7.5, sealY + 20, 'F');

  const numLobes = 12;
  const lobeRingR = 12.2;
  for (let k = 0; k < numLobes; k++) {
    const theta = (k / numLobes) * Math.PI * 2;
    const lx = sealX + lobeRingR * Math.cos(theta);
    const ly = sealY + lobeRingR * Math.sin(theta);
    doc.circle(lx, ly, 3.6, 'F');
  }
  doc.circle(sealX, sealY, 13.0, 'F');

  doc.setFillColor(255, 255, 255);
  doc.circle(sealX, sealY, 9.8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4.6);
  doc.setTextColor(45, 118, 175);
  doc.text('FOOD SCIENCE', sealX, sealY - 5.6, { align: 'center' });
  doc.text('CERTIFIED', sealX, sealY + 7.4, { align: 'center' });

  doc.setFillColor(22, 115, 184);
  doc.rect(sealX - 6.8, sealY - 0.8, 1.2, 1.2, 'F');
  doc.rect(sealX + 5.6, sealY - 0.8, 1.2, 1.2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(22, 115, 184);
  doc.text('FSP', sealX, sealY + 1.5, { align: 'center' });
  doc.rect(sealX - 2.8, sealY + 2.5, 5.6, 0.75, 'F');

  // =========================================================================
  // 4. "Certificate of Achievement" HEADING (Always "of Achievement")
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(26);
  doc.setTextColor(34, 108, 163); // #226CA3
  doc.text('Certificate', leftX, 44);
  doc.text('of Achievement', leftX, 54);

  // =========================================================================
  // 5. "This is to certify that" + RECIPIENT NAME + USER PROFILE PICTURE
  // =========================================================================
  const cleanRecipient = (recipientName || 'Certified Professional').trim();

  // Draw Recipient's Profile Picture (21mm x 21mm) on the right side of the recipient row
  drawPdfUserPhoto(
    doc,
    recipientProfilePicUrl,
    cleanRecipient,
    rightEdgeX - 21,
    59,
    21,
    {
      borderColor: [22, 115, 184],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(28, 35, 54);
  doc.text('This is to certify that', leftX, 66);

  doc.setFont('helvetica', 'bold');
  const maxRecipientW = contentWidth - 25;
  let recipientFontSize = cleanRecipient.length > 30 ? 14.5 : cleanRecipient.length > 22 ? 16.5 : 19;
  doc.setFontSize(recipientFontSize);
  while (doc.getTextWidth(cleanRecipient) > maxRecipientW && recipientFontSize > 11) {
    recipientFontSize -= 0.5;
    doc.setFontSize(recipientFontSize);
  }
  doc.setTextColor(22, 32, 56);
  const nameLines = doc.splitTextToSize(cleanRecipient, maxRecipientW).slice(0, 2);
  doc.text(nameLines, leftX, nameLines.length > 1 ? 74 : 78);

  // Horizontal divider line under Recipient Name & Photo
  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.45);
  doc.line(leftX, 84, rightEdgeX, 84);

  // =========================================================================
  // 6. "has successfully completed" + COURSE TITLE + SEQUENTIAL MODULES LIST
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(28, 35, 54);
  doc.text('has successfully completed', leftX, 92);

  // Course Title properly adjusted inside certificate width
  const cleanCourseTitle = stripAccreditedWord(courseTitle);
  const cleanStandard = stripAccreditedWord(accreditationStandard);
  doc.setFont('helvetica', 'bold');
  const titleLen = cleanCourseTitle.length;
  const courseFontSize = titleLen > 45 ? 13.5 : titleLen > 32 ? 15.5 : 17.5;
  doc.setFontSize(courseFontSize);
  doc.setTextColor(22, 115, 184);
  const wrappedCourse = doc.splitTextToSize(cleanCourseTitle, contentWidth).slice(0, 2);
  doc.text(wrappedCourse, leftX, 100.5);

  let cursorY = 100.5 + wrappedCourse.length * 6.0;

  // Course Code & Standard wrapped cleanly within certificate bounds
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(45, 55, 72);
  const codeAndStandardText = `Course Code: ${courseCode}  |  Standard: ${cleanStandard}`;
  const wrappedStandard = doc
    .splitTextToSize(codeAndStandardText, contentWidth)
    .slice(0, 2);
  doc.text(wrappedStandard, leftX, cursorY);
  cursorY += wrappedStandard.length * 4.0 + 2.0;

  // Sequential Modules listed one below another (Module 1, Module 2, Module 3, Module 4, Module 5...)
  const sequentialModules = getSequentialModuleList(syllabusModules, courseTitle);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.setTextColor(22, 115, 184);
  doc.text('Completed Course Modules:', leftX, cursorY);
  cursorY += 4.2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  const maxModulesToShow = Math.min(sequentialModules.length, 5);
  for (let mIdx = 0; mIdx < maxModulesToShow; mIdx++) {
    const modItem = sequentialModules[mIdx];
    const modLines = doc.splitTextToSize(modItem, contentWidth - 3).slice(0, 2);
    doc.text(modLines, leftX + 1.5, cursorY);
    cursorY += modLines.length * 3.6 + 0.8;
  }

  // Horizontal divider line below sequential modules list
  const courseRuleY = Math.min(Math.max(cursorY + 1.5, 160), 170);
  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.45);
  doc.line(leftX, courseRuleY, rightEdgeX, courseRuleY);

  // =========================================================================
  // 7. THREE-COLUMN METRICS ROW: Certificate No. | Awarded | Exam Score
  // =========================================================================
  const lineY = Math.min(Math.max(courseRuleY + 18, 182), 189);

  // Helper to fit text strictly inside each 42mm column
  const drawFittedColText = (
    textStr: string,
    centerX: number,
    yPos: number,
    maxW: number,
    initialSize: number,
    rgb: [number, number, number]
  ) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    let sz = initialSize;
    doc.setFontSize(sz);
    while (doc.getTextWidth(textStr) > maxW && sz > 6.5) {
      sz -= 0.4;
      doc.setFontSize(sz);
    }
    doc.text(textStr, centerX, yPos, { align: 'center' });
  };

  // Col 1: Certificate No. (center x = 74, width = 42mm)
  drawFittedColText(certificateNumber, 74, lineY - 2.5, 42, 9.0, [22, 32, 56]);
  // Col 2: Awarded Date (center x = 125, width = 42mm)
  drawFittedColText(issueDate, 125, lineY - 2.5, 42, 9.0, [22, 32, 56]);
  // Col 3: Exam Score (center x = 176, width = 42mm)
  drawFittedColText(
    `${scorePercentage}% (${correctCount}/${totalQuestions} · ${
      distinction ? 'Distinction' : 'Passed'
    })`,
    176,
    lineY - 2.5,
    42,
    8.8,
    [22, 115, 184]
  );

  // 3 Horizontal Lines
  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.45);
  doc.line(54, lineY, 94, lineY);
  doc.line(105, lineY, 145, lineY);
  doc.line(156, lineY, 196, lineY);

  // Labels below the 3 lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 48, 68);
  doc.text('Certificate No.', 74, lineY + 4.8, { align: 'center' });
  doc.text('Awarded', 125, lineY + 4.8, { align: 'center' });
  doc.text('Exam Score', 176, lineY + 4.8, { align: 'center' });

  // =========================================================================
  // 8. SIGNATURE BLOCK + "Endorsed by FS Portal" BADGE
  // =========================================================================
  const sigBaseY = 219;
  const activeSigId = params.signatureStyleId || getSavedCertificateSignatureId();
  const activeCustomSigImg =
    params.customSignatureImageUrl ?? getSavedCustomSignatureDataUrl();

  drawSignaturePresetOnPdf(
    doc,
    activeSigId,
    leftX,
    sigBaseY,
    activeCustomSigImg
  );

  // Right-Side Endorsement Badge: "Endorsed by" slightly above green "FOOD SCIENCE PORTAL" bar
  const endX = 138;
  const endY = 206;

  // Food Science Portal Official Emblem Icon
  drawPdfBrandLogo(doc, endX, endY, 14, {
    borderColor: [22, 115, 184],
    bgFill: [255, 255, 255],
    roundedRadius: 2.2
  });

  // "Endorsed by" text placed slightly above the green bar (no blue Food Science Portal text)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(71, 85, 105);
  doc.text('Endorsed by', endX + 16, endY + 5.8);

  // Official Green Bar right below "Endorsed by" with "FOOD SCIENCE PORTAL" only
  doc.setFillColor(13, 92, 58); // #0D5C3A
  doc.roundedRect(endX + 16, endY + 7.5, 41, 5.0, 0.8, 0.8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(255, 255, 255);
  doc.text('FOOD SCIENCE PORTAL', endX + 36.5, endY + 10.8, { align: 'center' });

  // =========================================================================
  // 9. BOTTOM-LEFT GREEN SHIELD + WEBSITE VERIFICATION LINK
  // =========================================================================
  const valY = 246;
  const maxValTextWidth = 88; // Strictly fits between x=67mm and QR code box at x=159mm

  const shX = leftX + 5.2;
  const shY = valY + 3.5;
  doc.setDrawColor(26, 33, 56);
  doc.setLineWidth(0.65);
  doc.lines(
    [
      [4.8, 1.8],
      [0, 4.5],
      [-4.8, 4.8],
      [-4.8, -4.8],
      [0, -4.5],
      [4.8, -1.8]
    ],
    shX,
    shY - 5.2
  );

  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(1.1);
  doc.line(shX - 2.2, shY + 0.2, shX - 0.5, shY + 2.1);
  doc.line(shX - 0.5, shY + 2.1, shX + 2.6, shY - 1.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(26, 33, 56);
  doc.text('Validate this certificate online at', leftX + 13, valY + 1.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.6);
  doc.setTextColor(22, 115, 184);
  const wrappedVerifyUrl = doc.splitTextToSize(shortVerifyDisplayUrl, maxValTextWidth).slice(0, 2);
  doc.text(wrappedVerifyUrl, leftX + 13, valY + 5.6);
  // Make the verification area clickable in the PDF
  doc.link(leftX + 13, valY - 2, maxValTextWidth + 2, 16, { url: directVerifyUrl });

  const urlBottomY = valY + 5.6 + wrappedVerifyUrl.length * 3.6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  doc.setTextColor(51, 65, 85);
  const certInstructionLines = doc
    .splitTextToSize(
      `Enter Certificate No: ${certificateNumber} on the Website Verification Portal`,
      maxValTextWidth
    )
    .slice(0, 2);
  doc.text(certInstructionLines, leftX + 13, urlBottomY + 1.0);

  // Refresher training note at bottom-left
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(71, 85, 105);
  doc.text('Refresher training recommended every three years', leftX, 276);
  doc.text('or sooner if circumstances dictate.', leftX, 280);

  // =========================================================================
  // 10. BOTTOM-RIGHT SCANNABLE QR CODE (Direct Certificate Verification on Scan)
  // =========================================================================
  const qrMatrix = generateQrCodeMatrix(directVerifyUrl);
  const qrBoxSize = 28;
  const qrX = 162;
  const qrY = 242;

  // Outer card frame for QR code
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.roundedRect(qrX - 2, qrY - 2, qrBoxSize + 4, qrBoxSize + 10, 1.5, 1.5, 'FD');

  if (qrMatrix.length > 0) {
    const modulesCount = qrMatrix.length;
    const cellSize = qrBoxSize / modulesCount;
    doc.setFillColor(22, 32, 56);
    for (let r = 0; r < modulesCount; r++) {
      for (let c = 0; c < modulesCount; c++) {
        if (qrMatrix[r][c]) {
          doc.rect(
            qrX + c * cellSize,
            qrY + r * cellSize,
            cellSize + 0.06,
            cellSize + 0.06,
            'F'
          );
        }
      }
    }
  }

  // Make QR code clickable in PDF as well
  doc.link(qrX - 2, qrY - 2, qrBoxSize + 4, qrBoxSize + 10, {
    url: directVerifyUrl
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(22, 115, 184);
  doc.text('SCAN TO VERIFY', qrX + qrBoxSize / 2, qrY + qrBoxSize + 3.4, {
    align: 'center'
  });
  drawFittedColText(
    certificateNumber,
    qrX + qrBoxSize / 2,
    qrY + qrBoxSize + 6.4,
    qrBoxSize + 2,
    5.6,
    [71, 85, 105]
  );

  const safeSlug = courseCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = cleanRecipient
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 28);
  doc.save(`FS_Portal_Certificate_${safeSlug}_${safeName}.pdf`);
}
