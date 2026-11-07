import { jsPDF } from 'jspdf';

export interface OfficialCertificatePdfParams {
  certificateNumber: string;
  recipientName: string;
  recipientEmail: string;
  courseTitle: string;
  courseCode: string;
  accreditationStandard: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  distinction: boolean;
  issueDate: string;
  verificationPortalUrl: string;
  syllabusModules?: string[];
  issuedByMode?: 'exam' | 'admin_direct';
}

/**
 * Generates an official Portrait A4 (210mm × 297mm) PDF Certificate
 * modeled after Highfield Qualifications (UK), SGS, and Bureau Veritas
 * vertical international certification credentials.
 */
export function downloadOfficialCourseCertificatePdf(
  params: OfficialCertificatePdfParams
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageW = 210;
  const pageH = 297;

  // 1. Subtle Warm Security Parchment Background
  doc.setFillColor(251, 253, 251);
  doc.rect(0, 0, pageW, pageH, 'F');

  // 2. Outer Architectural Emerald-Navy Frame (Highfield / Bureau Veritas style)
  doc.setDrawColor(13, 74, 48);
  doc.setLineWidth(2.8);
  doc.rect(8, 8, pageW - 16, pageH - 16);

  // 3. Metallic Gold Inner Frame
  doc.setDrawColor(197, 155, 39);
  doc.setLineWidth(1.1);
  doc.rect(11.5, 11.5, pageW - 23, pageH - 23);

  // 4. Fine Inner Guilloche Hairline Border
  doc.setDrawColor(20, 108, 67);
  doc.setLineWidth(0.35);
  doc.rect(13.8, 13.8, pageW - 27.6, pageH - 27.6);

  // 5. Corner Security Squares & Gold Accents
  const corners = [
    [8, 8],
    [pageW - 18, 8],
    [8, pageH - 18],
    [pageW - 18, pageH - 18]
  ];
  corners.forEach(([cx, cy]) => {
    doc.setFillColor(13, 74, 48);
    doc.rect(cx, cy, 10, 10, 'F');
    doc.setDrawColor(197, 155, 39);
    doc.setLineWidth(0.6);
    doc.rect(cx + 1.8, cy + 1.8, 6.4, 6.4);
  });

  // 6. Top Left & Right Reference Strip (SGS / Bureau Veritas Registry Header)
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`CERTIFICATE REF: ${params.certificateNumber}`, 18, 20.5);
  doc.text(
    `ISO / CODEX BENCHMARK: ${params.courseCode || 'FSC-INT'}`,
    pageW - 18,
    20.5,
    { align: 'right' }
  );

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(18, 22.5, pageW - 18, 22.5);

  // 7. Top Crest / Emblem Shield
  doc.setFillColor(13, 74, 48);
  doc.circle(pageW / 2, 35, 10.5, 'F');
  doc.setDrawColor(197, 155, 39);
  doc.setLineWidth(0.9);
  doc.circle(pageW / 2, 35, 9, 'D');
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('FSP', pageW / 2, 34.5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.2);
  doc.setTextColor(253, 224, 71);
  doc.text('INTL ACADEMY', pageW / 2, 38.2, { align: 'center' });

  // 8. Issuing Authority Header
  doc.setTextColor(13, 74, 48);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.text(
    'FOOD SPECIALISTS INTERNATIONAL ACADEMY',
    pageW / 2,
    51,
    { align: 'center' }
  );

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.text(
    'GLOBAL FOOD SAFETY, HACCP, QMS & HOSPITALITY CERTIFICATION REGISTRAR',
    pageW / 2,
    55.8,
    { align: 'center' }
  );

  // 9. Decorative Gold Divider Bar
  doc.setFillColor(197, 155, 39);
  doc.rect(pageW / 2 - 42, 59, 84, 1.1, 'F');

  // 10. Main Portrait Certificate Title (Highfield / SGS Vertical Typography)
  doc.setTextColor(13, 74, 48);
  doc.setFont('times', 'bold');
  doc.setFontSize(25);
  doc.text('CERTIFICATE OF', pageW / 2, 71, { align: 'center' });
  doc.setFontSize(27);
  doc.text(
    params.distinction ? 'DISTINCTION' : 'ACHIEVEMENT',
    pageW / 2,
    81,
    { align: 'center' }
  );

  // 11. Standing Ribbon Pill
  if (params.distinction) {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.5);
    doc.roundedRect(pageW / 2 - 48, 85.5, 96, 7.5, 2, 2, 'FD');
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.text(
      `AWARDED WITH DISTINCTION (SCORE: ${params.scorePercentage}%)`,
      pageW / 2,
      90.4,
      { align: 'center' }
    );
  } else {
    doc.setFillColor(220, 252, 231);
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.5);
    doc.roundedRect(pageW / 2 - 48, 85.5, 96, 7.5, 2, 2, 'FD');
    doc.setTextColor(20, 83, 45);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.text(
      'INTERNATIONALLY VERIFIED PROFESSIONAL CREDENTIAL',
      pageW / 2,
      90.4,
      { align: 'center' }
    );
  }

  // 12. "This is to certify that" Presentation Line
  doc.setTextColor(71, 85, 105);
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.text('This is to officially certify that', pageW / 2, 102, {
    align: 'center'
  });

  // 13. Recipient Full Name
  const recipientDisplay = (params.recipientName || 'Certified Specialist')
    .trim()
    .toUpperCase();
  doc.setTextColor(15, 23, 42);
  doc.setFont('times', 'bold');
  doc.setFontSize(recipientDisplay.length > 26 ? 18 : 22);
  doc.text(recipientDisplay, pageW / 2, 113.5, { align: 'center' });

  // Gold Underline below Recipient Name
  doc.setDrawColor(197, 155, 39);
  doc.setLineWidth(0.75);
  doc.line(32, 117, pageW - 32, 117);

  // 14. Qualification Statement
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.8);
  doc.text(
    'has successfully completed the international training syllabus and passed the competency assessment for:',
    pageW / 2,
    125.5,
    { align: 'center' }
  );

  // 15. Course / Qualification Title Box (Auto-wraps multi-line custom or standard titles)
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(13, 92, 58);
  doc.setLineWidth(0.6);
  doc.roundedRect(20, 130, pageW - 40, 24, 2.5, 2.5, 'FD');

  doc.setTextColor(13, 74, 48);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15.5);
  const wrappedTitle = doc.splitTextToSize(params.courseTitle, pageW - 50);
  if (wrappedTitle.length === 1) {
    doc.text(wrappedTitle[0], pageW / 2, 140.5, { align: 'center' });
  } else {
    doc.setFontSize(13.5);
    doc.text(wrappedTitle.slice(0, 2), pageW / 2, 138, { align: 'center' });
  }

  // Standard Benchmark line inside the Qualification Box
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const cleanStandard =
    params.accreditationStandard ||
    'Codex Alimentarius CXC 1-1969, ISO 22000 & GFSI International Benchmark';
  doc.text(
    `Standard Benchmark: ${cleanStandard.slice(0, 82)}`,
    pageW / 2,
    150.5,
    { align: 'center' }
  );

  // 16. Syllabus & Core Modules Verified Box (Highfield / SGS Transcript Panel)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.45);
  doc.roundedRect(20, 159, pageW - 40, 46, 2, 2, 'FD');

  doc.setTextColor(13, 74, 48);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    'VERIFIED CURRICULUM & CORE COMPETENCY MODULES COMPLETED:',
    25,
    166
  );

  const defaultModules = [
    'Module 1: Fundamental Principles, Terminology, Regulatory Scope & Core Definitions',
    'Module 2: Prerequisite Programs (PRPs), GMP, Sanitary Design & Hygiene Controls',
    'Module 3: Preliminary Steps, Process Flow Diagramming & Operational Setup',
    'Module 4: Hazard Analysis, 5x5 Risk Assessment Matrix, Decision Tree & Critical Limits',
    'Module 5: System Verification, Internal/External Auditing & Food Safety Law Compliance'
  ];
  const modulesToPrint =
    params.syllabusModules && params.syllabusModules.length > 0
      ? params.syllabusModules.slice(0, 5)
      : defaultModules;

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  modulesToPrint.forEach((modLine, idx) => {
    const cleanLine = modLine.length > 92 ? `${modLine.slice(0, 89)}...` : modLine;
    doc.text(`•  ${cleanLine}`, 26, 172.5 + idx * 6.1);
  });

  // 17. Assessment & Credential Metrics Table (4 Columns)
  doc.setFillColor(13, 74, 48);
  doc.roundedRect(20, 210, pageW - 40, 16, 2, 2, 'F');

  const colW = (pageW - 40) / 4;
  const metrics = [
    {
      label: 'ASSESSMENT SCORE',
      val:
        params.issuedByMode === 'admin_direct'
          ? `${params.scorePercentage}% (Verified)`
          : `${params.scorePercentage}% (${params.correctCount}/${params.totalQuestions})`
    },
    {
      label: 'QUALIFICATION GRADE',
      val: params.distinction ? 'DISTINCTION' : 'CREDIT / PASS'
    },
    {
      label: 'DATE OF ISSUE',
      val: params.issueDate
    },
    {
      label: 'CERTIFICATE NO.',
      val: params.certificateNumber
    }
  ];

  metrics.forEach((m, i) => {
    const centerX = 20 + colW * i + colW / 2;
    doc.setTextColor(167, 243, 208);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(m.label, centerX, 215.5, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(m.val, centerX, 222, { align: 'center' });
  });

  // 18. Official Embossed Gold/Emerald Seal & Dual Signatories (Portrait Bottom Section)
  // Left Signatory: Director of International Certifications
  doc.setTextColor(13, 74, 48);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(12);
  doc.text('Dr. M. Khan, Lead Auditor', 48, 246, { align: 'center' });
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.45);
  doc.line(22, 249, 74, 249);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.text('Director of Certifications', 48, 253.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('FS Portal International Academy', 48, 257.5, { align: 'center' });

  // Center Official Gold & Emerald Embossed Seal (Highfield / SGS Seal Style)
  doc.setFillColor(197, 155, 39);
  doc.circle(pageW / 2, 247, 15.5, 'F');
  doc.setFillColor(13, 74, 48);
  doc.circle(pageW / 2, 247, 13, 'F');
  doc.setDrawColor(253, 224, 71);
  doc.setLineWidth(0.5);
  doc.circle(pageW / 2, 247, 11.2, 'D');

  doc.setTextColor(253, 224, 71);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.text('OFFICIAL SEAL', pageW / 2, 242.5, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.2);
  doc.text(
    params.distinction ? 'DISTINCTION' : 'VERIFIED',
    pageW / 2,
    247.5,
    { align: 'center' }
  );
  doc.setTextColor(167, 243, 208);
  doc.setFontSize(5.8);
  doc.text('GLOBAL REGISTRY', pageW / 2, 252, { align: 'center' });

  // Right Signatory: Examination & Quality Registrar
  doc.setTextColor(13, 74, 48);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(12);
  doc.text('International Exam Board', pageW - 48, 246, { align: 'center' });
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.45);
  doc.line(pageW - 74, 249, pageW - 22, 249);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.text('Chief Quality & Exam Registrar', pageW - 48, 253.5, {
    align: 'center'
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Accredited Compliance Division', pageW - 48, 257.5, {
    align: 'center'
  });

  // 19. Bottom Online Verification Registry Box (SGS / Bureau Veritas Verification Block)
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.roundedRect(18, 266, pageW - 36, 17, 1.8, 1.8, 'FD');

  doc.setTextColor(13, 74, 48);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.6);
  doc.text(
    `LIVE ONLINE VERIFICATION REGISTRY — CERTIFICATE NO: ${params.certificateNumber}`,
    pageW / 2,
    271.2,
    { align: 'center' }
  );

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.9);
  doc.text(
    `Verify the live authenticity of this credential at ${params.verificationPortalUrl} (Trainings -> Verify Certificate Portal).`,
    pageW / 2,
    275.8,
    { align: 'center' }
  );
  doc.text(
    `Holder: ${params.recipientName}${params.recipientEmail ? ` (${params.recipientEmail})` : ''} · Active online verification is maintained via FS Portal Registry.`,
    pageW / 2,
    280.2,
    { align: 'center' }
  );

  const safeTitle = params.courseTitle.replace(/[^a-zA-Z0-9]+/g, '_').slice(0, 36);
  doc.save(`FS_Portrait_Certificate_${safeTitle}_${params.certificateNumber}.pdf`);
}
