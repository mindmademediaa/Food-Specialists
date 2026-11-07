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
 * modeled directly after the uploaded DEKRA / Bureau Veritas ISO 9001:2015
 * European Certification design:
 *  - Left vertical security strip with diagonal micro-watermark pattern & rotated green brand spine
 *  - Sweeping green guilloche wave curves across the right and bottom-center background
 *  - Bold left-aligned Swiss typography ("CERTIFICATE", Number, Candidate block, Bold Standard/Course Title, Scope, Dates block)
 *  - Dual fountain-pen vector signatures (Managing Director & Certification Manager)
 *  - Bottom accreditation emblems (MGMT. SYS. & IAF Multilateral Recognition oval) and registry footer
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

  // Portrait A4 dimensions: 210mm width x 297mm height
  const W = 210;
  const H = 297;

  // =========================================================================
  // 1. PURE WHITE BACKGROUND & SWEEPING GREEN GUILLOCHE WAVE LINES
  // =========================================================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // Soft green shaded wavewash backdrop on the right side (like the DEKRA certificate)
  doc.setFillColor(235, 245, 238);
  doc.triangle(138, 0, 210, 0, 210, 155, 'F');
  doc.setFillColor(241, 248, 243);
  doc.triangle(75, 297, 210, 110, 210, 297, 'F');

  // Draw 44 sweeping parallel green guilloche curves from top-right through mid-right to bottom-center
  const totalWaves = 44;
  for (let i = 0; i < totalWaves; i++) {
    const t = i / (totalWaves - 1); // 0 .. 1

    // Alternate subtle shades of forest/sage green for authentic guilloche depth
    if (i % 3 === 0) {
      doc.setDrawColor(115, 174, 138);
      doc.setLineWidth(0.22);
    } else if (i % 3 === 1) {
      doc.setDrawColor(148, 195, 166);
      doc.setLineWidth(0.16);
    } else {
      doc.setDrawColor(172, 210, 186);
      doc.setLineWidth(0.14);
    }

    // Family A: Sweeping S-curve from top-right (136..208, 0) down to bottom (58..185, 297)
    const x0 = 136 + t * 72;
    const y0 = 0;

    // Control point 1 (pulls inward then right)
    const cx1 = 195 - t * 65;
    const cy1 = 85 + t * 25;

    // Control point 2 (sweeps wide across lower middle)
    const cx2 = 52 + t * 135;
    const cy2 = 175 - t * 20;

    const x3 = 58 + t * 126;
    const y3 = 297;

    // Approximate cubic Bezier with 36 smooth line segments
    const steps = 36;
    let prevX = x0;
    let prevY = y0;
    for (let s = 1; s <= steps; s++) {
      const u = s / steps;
      const inv = 1 - u;
      const bx =
        inv * inv * inv * x0 +
        3 * inv * inv * u * cx1 +
        3 * inv * u * u * cx2 +
        u * u * u * x3;
      const by =
        inv * inv * inv * y0 +
        3 * inv * inv * u * cy1 +
        3 * inv * u * u * cy2 +
        u * u * u * y3;
      doc.line(prevX, prevY, bx, by);
      prevX = bx;
      prevY = by;
    }
  }

  // Secondary intersecting guilloche wave family on the right edge for authentic moiré texture
  const secondaryWaves = 26;
  for (let j = 0; j < secondaryWaves; j++) {
    const t = j / (secondaryWaves - 1);
    doc.setDrawColor(130, 184, 150);
    doc.setLineWidth(0.14);

    const x0 = 155 + t * 55;
    const y0 = 0;
    const cx1 = 115 + t * 65;
    const cy1 = 110;
    const cx2 = 165 + t * 45;
    const cy2 = 205;
    const x3 = 82 + t * 92;
    const y3 = 297;

    const steps = 30;
    let prevX = x0;
    let prevY = y0;
    for (let s = 1; s <= steps; s++) {
      const u = s / steps;
      const inv = 1 - u;
      const bx =
        inv * inv * inv * x0 +
        3 * inv * inv * u * cx1 +
        3 * inv * u * u * cx2 +
        u * u * u * x3;
      const by =
        inv * inv * inv * y0 +
        3 * inv * inv * u * cy1 +
        3 * inv * u * u * cy2 +
        u * u * u * y3;
      doc.line(prevX, prevY, bx, by);
      prevX = bx;
      prevY = by;
    }
  }

  // =========================================================================
  // 2. LEFT VERTICAL SECURITY STRIP (x = 0 .. 16mm) — DEKRA / BV SPINE STYLE
  // =========================================================================
  const stripW = 16;

  // Top security grey block (y = 0 .. 42mm) with diagonal curved bottom edge
  doc.setFillColor(208, 212, 209);
  doc.rect(0, 0, stripW, 41, 'F');

  // Lower security grey block (y = 94 .. 297mm)
  doc.setFillColor(208, 212, 209);
  doc.rect(0, 94, stripW, H - 94, 'F');

  // Repeating micro-security text inside top & bottom grey strips
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(250, 252, 250);

  for (let yPos = 4; yPos <= 39; yPos += 4.6) {
    const offset = (Math.round(yPos) % 2) * 2.2;
    doc.text('FS PORTAL  >  FS PORTAL', -1 + offset, yPos, { angle: 10 });
  }
  for (let yPos = 98; yPos <= 295; yPos += 4.6) {
    const offset = (Math.round(yPos) % 2) * 2.2;
    doc.text('FS PORTAL  >  FS PORTAL', -1 + offset, yPos, { angle: 10 });
  }

  // White cutout section in middle of left spine (y = 41 .. 94mm)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 41, stripW + 1, 53, 'F');

  // Green geometric chevron/triangle emblem in the spine (y = 79 .. 89mm)
  doc.setFillColor(13, 122, 67);
  doc.triangle(4.2, 88.5, 4.2, 79.5, 13.5, 84.0, 'F');
  doc.setFillColor(255, 255, 255);
  doc.triangle(6.2, 86.4, 6.2, 81.8, 10.6, 84.0, 'F');

  // Vertical bold green brand text (rotated 90 degrees counter-clockwise)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(13, 122, 67);
  doc.text('FS PORTAL', 11.5, 76.5, { angle: 90 });

  // =========================================================================
  // 3. MAIN LEFT-ALIGNED SWISS TYPOGRAPHY BLOCK (Left Margin x = 25mm)
  // =========================================================================
  const leftX = 25;

  // Giant "CERTIFICATE" heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(38);
  doc.setTextColor(0, 0, 0);
  doc.text('CERTIFICATE', leftX, 36);

  // Certificate Number
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`Number: ${certificateNumber}`, leftX, 50.5);

  // Introductory sentence
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    'The professional competency, curriculum completion, and assessment record belonging to:',
    leftX,
    58.5
  );

  // Recipient Name (Large Bold Black, just like "Bureau Veritas Cybersecurity Europe B.V.")
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.setTextColor(0, 0, 0);
  const cleanRecipient = (recipientName || 'Certified Professional').trim();
  const recipientLines = doc.splitTextToSize(cleanRecipient, 165);
  doc.text(recipientLines[0], leftX, 70.5);

  // Sub-lines under Recipient Name (Address/Credential details style)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 0, 0);
  doc.text(
    recipientEmail?.trim()
      ? `Registered Candidate: ${recipientEmail.trim()}`
      : `Credential ID: ${certificateNumber}`,
    leftX,
    76.5
  );
  doc.text(
    distinction
      ? `Qualification Standing: Passed with Distinction (${scorePercentage}%)`
      : `Qualification Standing: Certified Pass (${scorePercentage}%)`,
    leftX,
    81.5
  );
  doc.text('International Food Safety & Quality Compliance Registry', leftX, 86.5);

  // Compliance transition sentence
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(
    'including the practical module implementation meets the requirements of the standard:',
    leftX,
    98.5
  );

  // =========================================================================
  // 4. STANDARD / COURSE TITLE (Large Bold Black like "ISO 9001:2015")
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  const titleLen = courseTitle.length;
  const courseFontSize = titleLen > 38 ? 19 : titleLen > 28 ? 22 : 26;
  doc.setFontSize(courseFontSize);
  doc.setTextColor(0, 0, 0);
  const wrappedTitle = doc.splitTextToSize(courseTitle, 165);
  doc.text(wrappedTitle.slice(0, 2), leftX, 111.5);

  const afterTitleY = wrappedTitle.length > 1 ? 123.5 : 118.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(13, 122, 67);
  doc.text(
    `Standard / Code: ${courseCode}  ·  ${accreditationStandard}`,
    leftX,
    afterTitleY
  );

  // =========================================================================
  // 5. SCOPE & COMPLETED MODULES BLOCK
  // =========================================================================
  const scopeStartY = afterTitleY + 9;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Scope:', leftX, scopeStartY);

  const defaultScopeText =
    'Performing hazard analysis, prerequisite programs (PRPs: GMP, GHP, SSOPs), 12-step Codex HACCP implementation, 5x5 risk assessment matrix scoring, CCP decision tree evaluation, internal system auditing, and statutory food safety law compliance.';
  const scopeLines = doc.splitTextToSize(defaultScopeText, 160);
  doc.text(scopeLines, leftX, scopeStartY + 5);

  // List the 5 curriculum modules concisely under Scope
  const modListStartY = scopeStartY + 5 + scopeLines.length * 4.5 + 1.5;
  const effectiveModules =
    syllabusModules.length > 0
      ? syllabusModules.slice(0, 5)
      : [
          'Module 1: Basics, Core Definitions & Scientific Hazard Foundations',
          'Module 2: Prerequisite Programs (PRPs — GMP, GHP, SSOPs, Pest & Allergens)',
          'Module 3: Initial 5 Preliminary Steps of HACCP & Process Flow Verification',
          'Module 4: Principles 1–4, 5x5 Risk Matrix, Codex CCP Decision Tree & Critical Limits',
          'Module 5: Principles 5–7, Corrective Actions, System Auditing & Food Safety Law'
        ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  effectiveModules.forEach((modTitle, idx) => {
    const cleanLine = modTitle.replace(/\s+/g, ' ').trim();
    const truncated =
      cleanLine.length > 96 ? `${cleanLine.slice(0, 93)}...` : cleanLine;
    doc.text(`• ${truncated}`, leftX, modListStartY + idx * 4.0);
  });

  // =========================================================================
  // 6. CERTIFICATE DATES & STANDING TABLE (2-Column Aligned like DEKRA)
  // =========================================================================
  const datesStartY = modListStartY + effectiveModules.length * 4.0 + 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  doc.text('Certificate verification:', leftX, datesStartY);
  doc.text('Online Portal Registry (Active)', leftX + 46, datesStartY);

  doc.text('Certificate effective date:', leftX, datesStartY + 5);
  doc.text(issueDate, leftX + 46, datesStartY + 5);

  doc.text('Assessment score*:', leftX, datesStartY + 10);
  doc.text(
    `${scorePercentage}% (${correctCount}/${totalQuestions} MCQs — ${
      distinction ? 'Distinction' : 'Certified Pass'
    })`,
    leftX + 46,
    datesStartY + 10
  );

  // Validity sentence
  doc.text(
    'This certificate is valid and verifiable online for the candidate and qualification mentioned above.',
    leftX,
    datesStartY + 18.5
  );

  // =========================================================================
  // 7. ISSUING BODY & DUAL FOUNTAIN-PEN SIGNATURES (y = 205 .. 235mm)
  // =========================================================================
  const sigTopY = 205;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 0, 0);
  doc.text('FS Portal Certification Academy', leftX, sigTopY);

  // Left Fountain-Pen Cursive Vector Signature (Dark Blue Ink #2B3A67)
  doc.setDrawColor(43, 58, 103);
  doc.setLineWidth(0.35);
  // Stylized cursive loops matching the left signature in the uploaded image
  doc.lines(
    [
      [3, -7],
      [6, -2],
      [4, 5],
      [-5, 4],
      [-7, -2],
      [8, -6],
      [4, -8],
      [1, 9],
      [3, -4],
      [2, 4],
      [4, -7],
      [1, 7],
      [4, -3],
      [2, 3],
      [5, -9],
      [2, 9],
      [6, -2]
    ],
    leftX + 2,
    sigTopY + 14
  );
  doc.line(leftX, sigTopY + 18, leftX + 43, sigTopY + 17);

  // Right Fountain-Pen Cursive Vector Signature (Dark Blue Ink #2B3A67)
  const rightSigX = 96;
  doc.lines(
    [
      [8, -6],
      [10, -2],
      [-6, 5],
      [-10, 3],
      [5, -8],
      [12, -3],
      [8, 4],
      [-14, 3],
      [18, -5],
      [9, 2],
      [-6, 3]
    ],
    rightSigX + 4,
    sigTopY + 13
  );
  doc.line(rightSigX + 2, sigTopY + 17.5, rightSigX + 38, sigTopY + 16);

  // Signatory Names & Titles
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  doc.text('B.T.M. Holtus', leftX, sigTopY + 24);
  doc.text('Managing Director', leftX, sigTopY + 28.8);

  doc.text('P. de Boer', rightSigX, sigTopY + 24);
  doc.text('Certification Manager', rightSigX, sigTopY + 28.8);

  // =========================================================================
  // 8. COPYRIGHT, ASTERISK NOTE, ACCREDITATION LOGOS & FOOTER
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(0, 0, 0);
  doc.text(
    '© Integral publication of this certificate and adjoining verification reports is allowed.',
    leftX,
    244.5
  );
  doc.text(
    '* Against this certifiable international standard / verified online by FS Portal Certification Registry.',
    leftX,
    249
  );

  // Left Accreditation Emblem (MGMT. SYS. / RvA C 013 style)
  const logoY = 258;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.55);
  doc.circle(leftX + 5.5, logoY + 4.5, 4.5, 'S');
  doc.line(leftX + 5.5, logoY + 4.5, leftX + 11.5, logoY + 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text('MGMT. SYS.', leftX + 2, logoY + 12.2);
  doc.text('RvA C 013', leftX + 2.5, logoY + 15.2);

  // Right Blue Oval IAF Multilateral Recognition Emblem
  const iafCenterX = leftX + 29;
  const iafCenterY = logoY + 7.5;
  doc.setFillColor(37, 99, 171);
  doc.ellipse(iafCenterX, iafCenterY, 10.5, 6.2, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.35);
  doc.ellipse(iafCenterX, iafCenterY, 9.5, 5.3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4.1);
  doc.setTextColor(255, 255, 255);
  doc.text('MEMBER OF MULTILATERAL', iafCenterX, iafCenterY - 2.6, {
    align: 'center'
  });
  doc.setFontSize(8.5);
  doc.text('IAF', iafCenterX, iafCenterY + 1.1, { align: 'center' });
  doc.setFontSize(3.9);
  doc.text('RECOGNITION ARRANGEMENT', iafCenterX, iafCenterY + 3.7, {
    align: 'center'
  });

  // Bottom Address & Live Verification Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text(
    'FS Portal Certification B.V. · International Food Safety, HACCP, ISO & Hospitality Academy · Global Verification Registry',
    leftX,
    281.5
  );
  doc.text(
    `Verify online: ${verificationPortalUrl}  ·  Certificate No: ${certificateNumber}  ·  Registration 09085396`,
    leftX,
    285.8
  );

  const safeSlug = courseCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = cleanRecipient
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 28);
  doc.save(`FS_Portal_Certificate_${safeSlug}_${safeName}.pdf`);
}
