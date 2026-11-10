import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export const OFFICIAL_APP_PORTAL_URL =
  'https://ais-pre-5bkil6kufarm7w3fanh7wl-601551548198.asia-east1.run.app';

export interface OfficialCertificatePdfParams {
  certificateNumber: string;
  recipientName: string;
  recipientEmail?: string;
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
}

/**
 * Resolves the official App / Website base URL for certificate verification,
 * ensuring github.io or localhost origins are replaced with the live App Portal URL.
 */
export function resolveOfficialVerificationBaseUrl(rawUrl?: string): string {
  const candidate = (
    rawUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    OFFICIAL_APP_PORTAL_URL
  )
    .trim()
    .replace(/\/$/, '');

  if (
    !candidate ||
    candidate.toLowerCase().includes('github.io') ||
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
    const cleaned = rawTitle
      .replace(/^Module\s*\d+\s*[:.-]\s*/i, '')
      .trim();
    return `Module ${idx + 1}: ${cleaned || (courseTitle ? `${courseTitle} Stage ${idx + 1}` : defaultModules[idx] || 'Core Competency')}`;
  });
}

/**
 * Generates and downloads an official Portrait A4 (210mm x 297mm) PDF Certificate:
 *  1. Always displays "Certificate of Achievement"
 *  2. Displays ONLY the recipient's Name (no email address on certificate)
 *  3. Properly fits Course Title, Code/Standard, and lists all Modules sequentially one below another inside the certificate bounds
 *  4. 3-Column Metrics Row: Certificate No. | Awarded | Exam Score (no CPD Credits)
 *  5. Validation section links directly to the App/Website Verification Portal (no GitHub link)
 *  6. Scannable vector QR Code on the bottom-right for instant verification on scan
 *  7. "Endorsed by FS Portal" badge (replaces Institute of Hospitality)
 *  8. All CPD marks removed
 */
export function downloadOfficialCourseCertificatePdf(
  params: OfficialCertificatePdfParams
): void {
  const {
    certificateNumber,
    recipientName,
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
  const shortVerifyDisplayUrl = `${officialBaseUrl.replace(/^https?:\/\//i, '')}/?verify=${certificateNumber}`;

  // =========================================================================
  // 1. PURE WHITE MAIN CANVAS & FAINT ICE-BLUE GIANT "U" WATERMARK ON RIGHT
  // =========================================================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // Giant subtle ice-blue "U" watermark in the right/lower-right background
  doc.setDrawColor(242, 247, 252);
  doc.setLineWidth(26);
  doc.line(104, 125, 104, 205);
  doc.line(195, 125, 195, 205);
  const arcSteps = 24;
  let prevArcX = 104;
  let prevArcY = 205;
  for (let i = 1; i <= arcSteps; i++) {
    const angle = Math.PI - (i / arcSteps) * Math.PI;
    const ax = 149.5 + 45.5 * Math.cos(angle);
    const ay = 205 + 40 * Math.sin(angle);
    doc.line(prevArcX, prevArcY, ax, ay);
    prevArcX = ax;
    prevArcY = ay;
  }

  // =========================================================================
  // 2. LEFT FULL-HEIGHT ROYAL BLUE SIDEBAR + GIANT VERTICAL "Certificate"
  // =========================================================================
  doc.setFillColor(22, 115, 184); // #1673B8
  doc.rect(0, 0, blueBarW, H, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(146);
  doc.setTextColor(16, 94, 154);
  doc.text('Certificate', 39.5, 289, { angle: 90 });

  // =========================================================================
  // 3. TOP-LEFT BRAND LOGO ("FS Portal") & TOP-RIGHT BLUE SCALLOPED ROSETTE SEAL
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(12, 24, 45);
  doc.text('Food Science ', leftX, 21);

  const portW = doc.getTextWidth('Food Science ');
  doc.setTextColor(22, 115, 184);
  doc.text('Portal', leftX + portW, 21);
  const alW = doc.getTextWidth('Portal');

  doc.setFillColor(22, 115, 184);
  doc.rect(leftX + portW + 0.3, 22.3, alW - 0.5, 1.3, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(71, 85, 105);
  doc.text('International Food Safety & Hospitality Academy', leftX, 27.5);

  // Top-Right Blue Scalloped Rosette Seal with Two Ribbons (center x = 179mm, y = 35mm)
  const sealX = 179;
  const sealY = 35;

  doc.setFillColor(22, 115, 184);
  doc.triangle(sealX - 8.5, sealY + 11, sealX - 2, sealY + 11, sealX - 10.5, sealY + 27, 'F');
  doc.triangle(sealX - 2, sealY + 11, sealX - 4, sealY + 26, sealX - 7.5, sealY + 22, 'F');
  doc.triangle(sealX + 2, sealY + 11, sealX + 8.5, sealY + 11, sealX + 10.5, sealY + 26, 'F');
  doc.triangle(sealX + 2, sealY + 11, sealX + 4, sealY + 26, sealX + 7.5, sealY + 22, 'F');

  const numLobes = 12;
  const lobeRingR = 13.5;
  for (let k = 0; k < numLobes; k++) {
    const theta = (k / numLobes) * Math.PI * 2;
    const lx = sealX + lobeRingR * Math.cos(theta);
    const ly = sealY + lobeRingR * Math.sin(theta);
    doc.circle(lx, ly, 4.0, 'F');
  }
  doc.circle(sealX, sealY, 14.4, 'F');

  doc.setFillColor(255, 255, 255);
  doc.circle(sealX, sealY, 10.8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.0);
  doc.setTextColor(45, 118, 175);
  doc.text('FOOD SCIENCE', sealX, sealY - 6.3, { align: 'center' });
  doc.text('CERTIFIED', sealX, sealY + 8.1, { align: 'center' });

  doc.setFillColor(22, 115, 184);
  doc.rect(sealX - 7.4, sealY - 0.8, 1.4, 1.4, 'F');
  doc.rect(sealX + 6.0, sealY - 0.8, 1.4, 1.4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(22, 115, 184);
  doc.text('FS', sealX, sealY + 1.7, { align: 'center' });
  doc.rect(sealX - 3.0, sealY + 2.8, 6.0, 0.9, 'F');

  // =========================================================================
  // 4. "Certificate of Achievement" HEADING (Always "of Achievement")
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(29);
  doc.setTextColor(34, 108, 163); // #226CA3
  doc.text('Certificate', leftX, 44);
  doc.text('of Achievement', leftX, 55);

  // =========================================================================
  // 5. "This is to certify that" + RECIPIENT NAME ONLY (No Email)
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(28, 35, 54);
  doc.text('This is to certify that', leftX, 68);

  const cleanRecipient = (recipientName || 'Certified Professional').trim();
  doc.setFont('helvetica', 'bold');
  const recipientFontSize = cleanRecipient.length > 32 ? 17 : 20.5;
  doc.setFontSize(recipientFontSize);
  doc.setTextColor(22, 32, 56);
  const nameLines = doc.splitTextToSize(cleanRecipient, contentWidth);
  doc.text(nameLines[0], leftX, 80);

  // Horizontal divider line under Recipient Name
  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.45);
  doc.line(leftX, 85, rightEdgeX, 85);

  // =========================================================================
  // 6. "has successfully completed" + COURSE TITLE + SEQUENTIAL MODULES LIST
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(28, 35, 54);
  doc.text('has successfully completed', leftX, 95);

  // Course Title properly adjusted inside certificate width
  doc.setFont('helvetica', 'bold');
  const titleLen = courseTitle.length;
  const courseFontSize = titleLen > 45 ? 14.5 : titleLen > 32 ? 16.5 : 18.5;
  doc.setFontSize(courseFontSize);
  doc.setTextColor(22, 115, 184);
  const wrappedCourse = doc.splitTextToSize(courseTitle, contentWidth).slice(0, 2);
  doc.text(wrappedCourse, leftX, 105);

  let cursorY = 105 + wrappedCourse.length * 6.5;

  // Course Code & Standard wrapped cleanly within certificate bounds
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(45, 55, 72);
  const codeAndStandardText = `Course Code: ${courseCode}  |  Standard: ${accreditationStandard}`;
  const wrappedStandard = doc
    .splitTextToSize(codeAndStandardText, contentWidth)
    .slice(0, 2);
  doc.text(wrappedStandard, leftX, cursorY);
  cursorY += wrappedStandard.length * 4.2 + 2.5;

  // Sequential Modules listed one below another (Module 1, Module 2, Module 3, Module 4, Module 5...)
  const sequentialModules = getSequentialModuleList(syllabusModules, courseTitle);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(22, 115, 184);
  doc.text('Completed Course Modules:', leftX, cursorY);
  cursorY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(51, 65, 85);

  const maxModulesToShow = Math.min(sequentialModules.length, 6);
  for (let mIdx = 0; mIdx < maxModulesToShow; mIdx++) {
    const modItem = sequentialModules[mIdx];
    // Fit each module neatly on a single line (or 2 if needed) within contentWidth
    const fittedLine = doc.splitTextToSize(modItem, contentWidth - 2)[0];
    doc.text(fittedLine, leftX + 1.5, cursorY);
    cursorY += 4.4;
  }

  // Horizontal divider line below sequential modules list
  const courseRuleY = Math.max(cursorY + 2, 162);
  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.45);
  doc.line(leftX, courseRuleY, rightEdgeX, courseRuleY);

  // =========================================================================
  // 7. THREE-COLUMN METRICS ROW: Certificate No. | Awarded | Exam Score
  // =========================================================================
  const lineY = Math.max(courseRuleY + 21, 185);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(22, 32, 56);

  // Col 1: Certificate No. (center x = 74)
  doc.text(certificateNumber, 74, lineY - 2.8, { align: 'center' });
  // Col 2: Awarded Date (center x = 125)
  doc.text(issueDate, 125, lineY - 2.8, { align: 'center' });
  // Col 3: Exam Score only (NO CPD Credits) (center x = 176)
  doc.setTextColor(22, 115, 184);
  doc.text(
    `${scorePercentage}% (${correctCount}/${totalQuestions} · ${
      distinction ? 'Distinction' : 'Passed'
    })`,
    176,
    lineY - 2.8,
    { align: 'center' }
  );

  // 3 Horizontal Lines
  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.45);
  doc.line(54, lineY, 94, lineY);
  doc.line(105, lineY, 145, lineY);
  doc.line(156, lineY, 196, lineY);

  // Labels below the 3 lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.0);
  doc.setTextColor(40, 48, 68);
  doc.text('Certificate No.', 74, lineY + 5, { align: 'center' });
  doc.text('Awarded', 125, lineY + 5, { align: 'center' });
  doc.text('Exam Score', 176, lineY + 5, { align: 'center' });

  // =========================================================================
  // 8. SIGNATURE BLOCK + "Endorsed by FS Portal" BADGE
  // =========================================================================
  const sigBaseY = 220;

  // Cursive handwritten signature
  doc.setDrawColor(20, 24, 36);
  doc.setLineWidth(0.55);
  doc.lines(
    [
      [2.2, 6.5],
      [2.6, -6.8]
    ],
    leftX + 1.5,
    sigBaseY - 8.5
  );
  doc.circle(leftX + 8.2, sigBaseY - 2.3, 0.35, 'F');
  doc.lines(
    [
      [0.8, -5.5],
      [2.2, 4.2],
      [2.2, -4.2],
      [1.8, 5.5]
    ],
    leftX + 11,
    sigBaseY - 2
  );
  doc.lines(
    [
      [1.5, -6.5],
      [0.5, 6.2],
      [2.2, -2.5],
      [1.6, 2.5],
      [2.0, -3.5],
      [1.2, 3.5],
      [2.4, -5.8],
      [0.6, 5.8],
      [2.5, -2.8],
      [2.2, 2.6],
      [2.8, -2.4],
      [2.5, 2.4],
      [2.2, -2.2],
      [1.4, 6.2],
      [-1.8, 2.2],
      [-2.2, -1.2]
    ],
    leftX + 21.5,
    sigBaseY - 2.2
  );

  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.45);
  doc.line(leftX, sigBaseY, leftX + 46, sigBaseY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(45, 55, 72);
  doc.text('Signed on behalf of Food Science Portal', leftX + 23, sigBaseY + 4.5, {
    align: 'center'
  });

  // Right-Side Endorsement Badge: "Endorsed by Food Science Portal"
  const endX = 142;
  const endY = 208;

  // Food Science Portal Official Crest Icon
  doc.setDrawColor(22, 115, 184);
  doc.setFillColor(240, 247, 255);
  doc.setLineWidth(0.5);
  doc.roundedRect(endX, endY, 11, 12.5, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 115, 184);
  doc.text('FSP', endX + 5.5, endY + 7.8, { align: 'center' });

  // "Endorsed by Food Science Portal" text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(26, 33, 56);
  doc.text('Endorsed by', endX + 13, endY + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(22, 115, 184);
  doc.text('Food Science Portal', endX + 13, endY + 9.8);

  // Official Endorsed Bar
  doc.setFillColor(13, 92, 58); // #0D5C3A
  doc.roundedRect(endX + 13, endY + 11.5, 42, 4.2, 0.8, 0.8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.4);
  doc.setTextColor(255, 255, 255);
  doc.text('ENDORSED BY FOOD SCIENCE PORTAL', endX + 34, endY + 14.3, { align: 'center' });

  // =========================================================================
  // 9. BOTTOM-LEFT GREEN SHIELD + APP VERIFICATION LINK (No GitHub URL)
  // =========================================================================
  const valY = 248;

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
  doc.setFontSize(9.5);
  doc.setTextColor(26, 33, 56);
  doc.text('Validate this certificate online at', leftX + 13, valY + 1.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.setTextColor(22, 115, 184);
  const wrappedVerifyUrl = doc.splitTextToSize(shortVerifyDisplayUrl, 90);
  doc.text(wrappedVerifyUrl.slice(0, 2), leftX + 13, valY + 6.2);
  // Make the verification area clickable in the PDF
  doc.link(leftX + 13, valY - 2, 92, 16, { url: directVerifyUrl });

  const urlBottomY = valY + 6.2 + Math.min(wrappedVerifyUrl.length, 2) * 3.8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Enter Certificate No: ${certificateNumber} on Food Science Portal Verification Registry`,
    leftX + 13,
    urlBottomY + 1.2
  );

  // Refresher training note at bottom-left
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.0);
  doc.setTextColor(71, 85, 105);
  doc.text('Refresher training recommended every three years', leftX, 276);
  doc.text('or sooner if circumstances dictate.', leftX, 280.2);

  // =========================================================================
  // 10. BOTTOM-RIGHT SCANNABLE QR CODE (Direct Certificate Verification on Scan)
  // =========================================================================
  const qrMatrix = generateQrCodeMatrix(directVerifyUrl);
  const qrBoxSize = 29;
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
  doc.setFontSize(6.5);
  doc.setTextColor(22, 115, 184);
  doc.text('SCAN TO VERIFY', qrX + qrBoxSize / 2, qrY + qrBoxSize + 3.5, {
    align: 'center'
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(71, 85, 105);
  doc.text(certificateNumber, qrX + qrBoxSize / 2, qrY + qrBoxSize + 6.5, {
    align: 'center'
  });

  const safeSlug = courseCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = cleanRecipient
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 28);
  doc.save(`FS_Portal_Certificate_${safeSlug}_${safeName}.pdf`);
}
