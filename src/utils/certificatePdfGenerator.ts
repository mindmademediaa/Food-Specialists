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
}

export function downloadOfficialCourseCertificatePdf(params: OfficialCertificatePdfParams): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageW = 297;
  const pageH = 210;

  // Soft ivory-emerald parchment background
  doc.setFillColor(250, 253, 250);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Outer Deep Emerald Border
  doc.setDrawColor(13, 92, 58);
  doc.setLineWidth(3.2);
  doc.rect(8, 8, pageW - 16, pageH - 16);

  // Inner Gold Metallic Accent Border
  doc.setDrawColor(197, 155, 39);
  doc.setLineWidth(1.1);
  doc.rect(12, 12, pageW - 24, pageH - 24);

  // Inner Hairline Frame
  doc.setDrawColor(21, 128, 61);
  doc.setLineWidth(0.4);
  doc.rect(14.5, 14.5, pageW - 29, pageH - 29);

  // Corner Ornaments
  doc.setFillColor(13, 92, 58);
  doc.rect(8, 8, 12, 12, 'F');
  doc.rect(pageW - 20, 8, 12, 12, 'F');
  doc.rect(8, pageH - 20, 12, 12, 'F');
  doc.rect(pageW - 20, pageH - 20, 12, 12, 'F');

  // Top Header Ribbon
  doc.setFillColor(13, 92, 58);
  doc.roundedRect(pageW / 2 - 68, 20, 136, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('FOOD SPECIALISTS INTERNATIONAL ACADEMY · GLOBAL CERTIFICATION', pageW / 2, 26.5, {
    align: 'center'
  });

  // Main Certificate Heading
  doc.setTextColor(13, 92, 58);
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.text(
    params.distinction ? 'CERTIFICATE OF DISTINCTION' : 'CERTIFICATE OF ACHIEVEMENT',
    pageW / 2,
    44,
    { align: 'center' }
  );

  // Gold Sub-banner for Distinction or Standard Pass
  if (params.distinction) {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.6);
    doc.roundedRect(pageW / 2 - 48, 48, 96, 8, 2, 2, 'FD');
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('PASSED WITH DISTINCTION (SCORE >= 75%)', pageW / 2, 53.3, { align: 'center' });
  } else {
    doc.setFillColor(220, 252, 231);
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.5);
    doc.roundedRect(pageW / 2 - 44, 48, 88, 8, 2, 2, 'FD');
    doc.setTextColor(20, 83, 45);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('INTERNATIONALLY CERTIFIED PROFESSIONAL', pageW / 2, 53.3, { align: 'center' });
  }

  // Presentation Line
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('This is to officially certify that', pageW / 2, 66, { align: 'center' });

  // Recipient Name
  doc.setTextColor(15, 23, 42);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(26);
  doc.text(params.recipientName.toUpperCase(), pageW / 2, 79, { align: 'center' });

  // Gold Line under Name
  doc.setDrawColor(197, 155, 39);
  doc.setLineWidth(0.8);
  doc.line(pageW / 2 - 65, 83, pageW / 2 + 65, 83);

  // Course Completion Statement
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(
    'has successfully completed the international training modules and passed the 40-MCQ Certification Examination in',
    pageW / 2,
    93,
    { align: 'center' }
  );

  // Course Title
  doc.setTextColor(13, 92, 58);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.text(params.courseTitle, pageW / 2, 105, { align: 'center' });

  // Standard / Code Subtitle
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(
    `Course Code: ${params.courseCode}   |   Standard Benchmark: ${params.accreditationStandard}`,
    pageW / 2,
    113,
    { align: 'center' }
  );

  // Exam Score Summary Box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.setLineWidth(0.5);
  doc.roundedRect(pageW / 2 - 78, 119, 156, 14, 2, 2, 'FD');
  doc.setTextColor(20, 83, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(
    `Final Examination Score: ${params.scorePercentage}% (${params.correctCount} / ${params.totalQuestions} MCQs)   ·   Standing: ${
      params.distinction ? 'DISTINCTION (>= 75%)' : 'PASSED (>= 60%)'
    }`,
    pageW / 2,
    127.5,
    { align: 'center' }
  );

  // Left Metadata Block: Certificate ID & Issue Date
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`Certificate No: ${params.certificateNumber}`, 26, 154);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Issue Date: ${params.issueDate}`, 26, 160);
  doc.text(`Holder Email: ${params.recipientEmail}`, 26, 166);

  // Center Gold Seal Circle
  doc.setFillColor(197, 155, 39);
  doc.circle(pageW / 2, 160, 15, 'F');
  doc.setFillColor(13, 92, 58);
  doc.circle(pageW / 2, 160, 12.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('VERIFIED', pageW / 2, 158, { align: 'center' });
  doc.text(params.distinction ? 'DISTINCTION' : 'CERTIFIED', pageW / 2, 163, { align: 'center' });

  // Right Signature Block
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.5);
  doc.line(pageW - 92, 158, pageW - 26, 158);
  doc.setTextColor(13, 92, 58);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(13);
  doc.text('Food Specialists Examination Board', pageW - 59, 154, { align: 'center' });
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Authorized Certification Registrar', pageW - 59, 164, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('FS Portal International Academy', pageW - 59, 169, { align: 'center' });

  // Bottom Online Verification Footer
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(24, 179, pageW - 48, 11, 1.5, 1.5, 'F');
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(
    `ONLINE VERIFICATION PORTAL: Verify live authenticity of Certificate ID [${params.certificateNumber}] on FS Portal (${params.verificationPortalUrl}).`,
    pageW / 2,
    184,
    { align: 'center' }
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.text(
    'Note: Live online verification remains active while the certificate holder maintains an active Paid Premium Membership on FS Portal.',
    pageW / 2,
    188.2,
    { align: 'center' }
  );

  const safeTitle = params.courseTitle.replace(/[^a-zA-Z0-9]+/g, '_');
  doc.save(`FS_Certificate_${safeTitle}_${params.certificateNumber}.pdf`);
}
