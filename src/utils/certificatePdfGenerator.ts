import { jsPDF } from 'jspdf';

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
 * Generates and downloads an official Portrait A4 (210mm x 297mm) PDF Certificate
 * modeled directly after the uploaded Commodious / CPD / Institute of Hospitality
 * Portrait Certificate template, populated dynamically with FS Portal user & training data:
 *  - Left full-height blue sidebar (#1673B8) with giant vertical "Certificate" watermark text
 *  - Faint ice-blue "U" watermark curve in the lower-right white canvas
 *  - Top-left FS Portal brand header & top-right blue scalloped rosette badge with ribbons
 *  - "Certificate of Achievement" (or "Certificate of Distinction") in medium blue
 *  - "This is to certify that" + Recipient Name on rule line
 *  - "has successfully completed" + Course Title & Accreditation Standard on rule line
 *  - 3-column underlined metrics row: Certificate No. | Awarded | CPD Credits & Score
 *  - Cursive signature ("Signed on behalf of FS Portal"), Green Shield "Validate this certificate at",
 *    Institute of Hospitality ENDORSED badge, and Purple CPD CERTIFIED emblem
 */
export function downloadOfficialCourseCertificatePdf(
  params: OfficialCertificatePdfParams
): void {
  const {
    certificateNumber,
    recipientName,
    recipientEmail,
    courseTitle,
    courseCode,
    accreditationStandard,
    scorePercentage,
    correctCount = Math.round((scorePercentage / 100) * 40),
    totalQuestions = 40,
    distinction,
    issueDate,
    verificationPortalUrl = typeof window !== 'undefined'
      ? window.location.origin
      : 'https://fsportal.academy',
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
  const blueBarW = 48;

  // =========================================================================
  // 1. PURE WHITE MAIN CANVAS & FAINT ICE-BLUE GIANT "U" WATERMARK ON RIGHT
  // =========================================================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // Giant subtle ice-blue "U" watermark in the right/lower-right background
  doc.setDrawColor(240, 246, 252);
  doc.setLineWidth(28);
  // Left vertical leg, bottom curve, right vertical leg of the giant watermark "U"
  doc.line(103, 122, 103, 205);
  doc.line(196, 122, 196, 205);
  // Smooth bottom arc connecting (103, 205) to (196, 205)
  const arcSteps = 24;
  let prevArcX = 103;
  let prevArcY = 205;
  for (let i = 1; i <= arcSteps; i++) {
    const angle = Math.PI - (i / arcSteps) * Math.PI; // PI -> 0
    const ax = 149.5 + 46.5 * Math.cos(angle);
    const ay = 205 + 42 * Math.sin(angle);
    doc.line(prevArcX, prevArcY, ax, ay);
    prevArcX = ax;
    prevArcY = ay;
  }

  // =========================================================================
  // 2. LEFT FULL-HEIGHT ROYAL BLUE SIDEBAR (x = 0 .. 48mm) + GIANT "Certificate"
  // =========================================================================
  doc.setFillColor(22, 115, 184); // #1673B8
  doc.rect(0, 0, blueBarW, H, 'F');

  // Giant vertical "Certificate" text inside the left blue bar (dark translucent blue #115E98)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(148);
  doc.setTextColor(16, 94, 154);
  doc.text('Certificate', 41, 290, { angle: 90 });

  // =========================================================================
  // 3. TOP-LEFT BRAND LOGO ("FS Portal") & TOP-RIGHT BLUE SCALLOPED ROSETTE SEAL
  // =========================================================================
  const leftX = 56;

  // Brand name styled like "commodious" (dark navy with blue underlined accent)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  doc.setTextColor(26, 33, 56); // #1A2138
  doc.text('FS Port', leftX, 23);

  const portW = doc.getTextWidth('FS Port');
  doc.setTextColor(22, 115, 184); // #1673B8 accent on "al"
  doc.text('al', leftX + portW, 23);
  const alW = doc.getTextWidth('al');

  // Blue accent underline bar under "al"
  doc.setFillColor(22, 115, 184);
  doc.rect(leftX + portW + 0.3, 24.4, alW - 0.5, 1.4, 'F');

  // Portal domain / subtitle under brand
  const cleanHost = verificationPortalUrl
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text(cleanHost || 'fsportal.academy', leftX, 30.5);

  // Top-Right Blue Scalloped Rosette Seal with Two Ribbons (center x = 179mm, y = 39mm)
  const sealX = 179;
  const sealY = 39;

  // Two hanging blue ribbons below the rosette
  doc.setFillColor(22, 115, 184);
  // Left ribbon tail
  doc.triangle(sealX - 9, sealY + 12, sealX - 2, sealY + 12, sealX - 11, sealY + 29, 'F');
  doc.triangle(sealX - 2, sealY + 12, sealX - 4, sealY + 28, sealX - 8, sealY + 24, 'F');
  // Right ribbon tail
  doc.triangle(sealX + 2, sealY + 12, sealX + 9, sealY + 12, sealX + 11, sealY + 28, 'F');
  doc.triangle(sealX + 2, sealY + 12, sealX + 4, sealY + 28, sealX + 8, sealY + 24, 'F');

  // Scalloped outer circle (12 lobes around radius 15.5mm)
  const numLobes = 12;
  const lobeRingR = 14.2;
  for (let k = 0; k < numLobes; k++) {
    const theta = (k / numLobes) * Math.PI * 2;
    const lx = sealX + lobeRingR * Math.cos(theta);
    const ly = sealY + lobeRingR * Math.sin(theta);
    doc.circle(lx, ly, 4.3, 'F');
  }
  doc.circle(sealX, sealY, 15.2, 'F');

  // Inner white circle of the rosette
  doc.setFillColor(255, 255, 255);
  doc.circle(sealX, sealY, 11.4, 'F');

  // Circular text inside white rosette ring
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.2);
  doc.setTextColor(45, 118, 175);
  doc.text('FS PORTAL', sealX, sealY - 6.8, { align: 'center' });
  doc.text('CERTIFIED', sealX, sealY + 8.6, { align: 'center' });

  // Two small blue squares on left/right of center "u" / "FS"
  doc.setFillColor(22, 115, 184);
  doc.rect(sealX - 7.8, sealY - 0.8, 1.5, 1.5, 'F');
  doc.rect(sealX + 6.3, sealY - 0.8, 1.5, 1.5, 'F');

  // Center bold "u" / "FS" mark inside the rosette
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(22, 115, 184);
  doc.text('FS', sealX, sealY + 1.8, { align: 'center' });
  doc.rect(sealX - 3.2, sealY + 3.0, 6.4, 1.0, 'F');

  // =========================================================================
  // 4. "Certificate of Achievement" (or "of Distinction") HEADING
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(31);
  doc.setTextColor(34, 108, 163); // #226CA3
  doc.text('Certificate', leftX, 50);
  doc.text(
    distinction ? 'of Distinction' : 'of Achievement',
    leftX,
    62
  );

  // =========================================================================
  // 5. "This is to certify that" + RECIPIENT NAME ON HORIZONTAL RULE
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12.5);
  doc.setTextColor(28, 35, 54);
  doc.text('This is to certify that', leftX, 78);

  const cleanRecipient = (recipientName || 'Certified Professional').trim();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(22, 32, 56);
  const nameLines = doc.splitTextToSize(cleanRecipient, 138);
  doc.text(nameLines[0], leftX, 95);

  if (recipientEmail?.trim()) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(100, 116, 139);
    doc.text(recipientEmail.trim(), leftX, 100.2);
  }

  // Horizontal divider line under Recipient Name
  doc.setDrawColor(218, 228, 238);
  doc.setLineWidth(0.45);
  doc.line(leftX, 103, 195, 103);

  // =========================================================================
  // 6. "has successfully completed" + TRAINING TITLE & MODULES ON HORIZONTAL RULE
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12.5);
  doc.setTextColor(28, 35, 54);
  doc.text('has successfully completed', leftX, 119.5);

  // Course Title
  doc.setFont('helvetica', 'bold');
  const titleLen = courseTitle.length;
  const courseFontSize = titleLen > 38 ? 16.5 : titleLen > 28 ? 19 : 21.5;
  doc.setFontSize(courseFontSize);
  doc.setTextColor(22, 115, 184);
  const wrappedCourse = doc.splitTextToSize(courseTitle, 138);
  doc.text(wrappedCourse.slice(0, 2), leftX, 133);

  const subCourseY = wrappedCourse.length > 1 ? 143.5 : 139.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(45, 55, 72);
  doc.text(
    `Code: ${courseCode}  ·  Standard: ${accreditationStandard}`,
    leftX,
    subCourseY
  );

  // Concise summary of completed curriculum modules
  if (syllabusModules.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(90, 105, 125);
    const shortMods =
      'Modules Completed: 1. Basics & Foundations · 2. Prerequisite Programs (PRPs) · 3. HACCP Steps 1–5 · 4. 7 Principles, 5x5 Risk Matrix & Decision Tree · 5. Auditing & Food Safety Law';
    const modLines = doc.splitTextToSize(shortMods, 138);
    doc.text(modLines.slice(0, 2), leftX, subCourseY + 4.8);
  }

  // Horizontal divider line under Course Title
  doc.setDrawColor(218, 228, 238);
  doc.setLineWidth(0.45);
  doc.line(leftX, 154, 195, 154);

  // =========================================================================
  // 7. THREE-COLUMN METRICS ROW: Certificate No. | Awarded | CPD Credits / Score
  // =========================================================================
  const lineY = 181;

  // Values above the 3 lines
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(22, 32, 56);

  // Col 1: Certificate No. (center x = 75.5)
  doc.text(certificateNumber, 75.5, lineY - 3, { align: 'center' });
  // Col 2: Awarded Date (center x = 125.5)
  doc.text(issueDate, 125.5, lineY - 3, { align: 'center' });
  // Col 3: Score & Standing / CPD Credits (center x = 175.5)
  doc.text(
    `${scorePercentage}% (${correctCount}/${totalQuestions}) · ${
      distinction ? 'Distinction' : 'Pass'
    }`,
    175.5,
    lineY - 3,
    { align: 'center' }
  );

  // 3 Horizontal Lines
  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.45);
  doc.line(56, lineY, 95, lineY);
  doc.line(106, lineY, 145, lineY);
  doc.line(156, lineY, 195, lineY);

  // Labels below the 3 lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  doc.setTextColor(40, 48, 68);
  doc.text('Certificate No.', 75.5, lineY + 5.2, { align: 'center' });
  doc.text('Awarded', 125.5, lineY + 5.2, { align: 'center' });
  doc.text('CPD Credits / Score', 175.5, lineY + 5.2, { align: 'center' });

  // =========================================================================
  // 8. SIGNATURE BLOCK ("Signed on behalf of FS Portal")
  // =========================================================================
  const sigBaseY = 215;

  // Authentic cursive handwritten signature ("V. M. Whitney" style)
  doc.setDrawColor(20, 24, 36);
  doc.setLineWidth(0.55);
  // "V."
  doc.lines(
    [
      [2.2, 6.5],
      [2.6, -6.8]
    ],
    leftX + 1.5,
    sigBaseY - 8.5
  );
  doc.circle(leftX + 8.2, sigBaseY - 2.3, 0.35, 'F');
  // "M"
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
  // "Whitney" cursive flow with descender loop at the end
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

  // Horizontal line under signature
  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.45);
  doc.line(leftX, sigBaseY, leftX + 45, sigBaseY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(45, 55, 72);
  doc.text('Signed on behalf of FS Portal', leftX + 22.5, sigBaseY + 4.5, {
    align: 'center'
  });

  // =========================================================================
  // 9. RIGHT-SIDE ENDORSEMENT BADGE ("Institute of Hospitality ENDORSED")
  // =========================================================================
  const instX = 148;
  const instY = 225;

  // Small heraldic crest icon on the left of "Institute of Hospitality"
  doc.setDrawColor(38, 48, 86);
  doc.setLineWidth(0.4);
  doc.rect(instX, instY, 9.5, 11, 'S');
  doc.setFillColor(38, 48, 86);
  doc.triangle(instX + 1.5, instY + 9.5, instX + 8, instY + 9.5, instX + 4.75, instY + 3.5, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(instX + 4.75, instY + 7.2, 1.3, 'F');

  // "Institute of Hospitality" text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(26, 33, 56);
  doc.text('Institute', instX + 11.5, instY + 4.5);
  doc.setFontSize(9.5);
  doc.text('of', instX + 11.5, instY + 9.2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Hospitality', instX + 15.8, instY + 9.2);

  // Burgundy "ENDORSED" pill bar (#9E1B34)
  doc.setFillColor(158, 27, 52);
  doc.roundedRect(instX + 11.5, instY + 11.2, 33.5, 4.2, 0.8, 0.8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('ENDORSED', instX + 28.25, instY + 14.1, { align: 'center' });

  // =========================================================================
  // 10. BOTTOM-LEFT GREEN SHIELD + "Validate this certificate at"
  // =========================================================================
  const valY = 250;

  // Shield outline (center x = leftX + 5.5, y = valY + 4)
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

  // Green checkmark inside shield (#22C55E)
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(1.1);
  doc.line(shX - 2.2, shY + 0.2, shX - 0.5, shY + 2.1);
  doc.line(shX - 0.5, shY + 2.1, shX + 2.6, shY - 1.8);

  // "Validate this certificate at"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.8);
  doc.setTextColor(26, 33, 56);
  doc.text('Validate this certificate at', leftX + 13.5, valY + 1.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  doc.setTextColor(45, 55, 72);
  doc.text(
    `${cleanHost || 'fsportal.academy'}/verify (ID: ${certificateNumber})`,
    leftX + 13.5,
    valY + 7.2
  );

  // Refresher training note at bottom-left
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(45, 55, 72);
  doc.text(
    'Refresher training recommended every three years',
    leftX,
    274
  );
  doc.text('or sooner if circumstances dictate.', leftX, 278.5);

  // =========================================================================
  // 11. BOTTOM-RIGHT "CPD CERTIFIED" PURPLE EMBLEM
  // =========================================================================
  const cpdX = 174;
  const cpdY = 264;

  // Faint lilac checkmark behind "CPD"
  doc.setDrawColor(216, 200, 232);
  doc.setLineWidth(2.6);
  doc.line(cpdX - 4, cpdY + 1, cpdX + 1, cpdY + 5);
  doc.line(cpdX + 1, cpdY + 5, cpdX + 10, cpdY - 8);

  // Bold purple "CPD"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(91, 50, 130); // #5B3282
  doc.text('CPD', cpdX, cpdY + 2, { align: 'center' });

  // "CERTIFIED" between thin horizontal rules
  doc.setDrawColor(45, 55, 72);
  doc.setLineWidth(0.3);
  doc.line(cpdX - 14, cpdY + 4.2, cpdX + 14, cpdY + 4.2);

  doc.setFont('times', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(26, 33, 56);
  doc.text('C E R T I F I E D', cpdX, cpdY + 7.8, { align: 'center' });

  doc.line(cpdX - 14, cpdY + 9.2, cpdX + 14, cpdY + 9.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(45, 55, 72);
  doc.text('The CPD Certification', cpdX, cpdY + 12.2, { align: 'center' });
  doc.text('Service', cpdX, cpdY + 15.0, { align: 'center' });

  const safeSlug = courseCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = cleanRecipient
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 28);
  doc.save(`FS_Portal_Certificate_${safeSlug}_${safeName}.pdf`);
}
