import { jsPDF } from 'jspdf';
import {
  ComplaintOrganizationProfile,
  OrganizationComplaintRecord
} from '../types/hub';
import { generateQrCodeMatrix } from '../utils/certificatePdfGenerator';
import { FS_PORTAL_LOGO_DATA_URI } from './brandLogo';

export const DEFAULT_COMPLAINT_CATEGORIES = [
  'Food Quality & Taste',
  'Hygiene & Sanitation',
  'Foreign Material / Contamination',
  'Packaging / Seal Defect',
  'Temperature / Cold Chain Abuse',
  'Allergen / Labeling Issue',
  'Wrong / Missing Order',
  'Staff Conduct & Service',
  'Delivery / Handling Damage',
  'Other Concern'
];

export const ROOT_CAUSE_CATEGORIES = [
  'Personnel / Training Gap',
  'SOP / Process Deviation',
  'Equipment / Calibration Failure',
  'Raw Material / Supplier Issue',
  'Sanitation / Pest Control Gap',
  'Storage / Cold Chain Excursion',
  'Packaging / Labeling Error',
  'Management / Communication Breakdown'
];

function sanitizeSlug(raw: string): string {
  return (raw || 'Organization')
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32);
}

async function loadImageAsDataUrl(
  src?: string,
  maxDim = 320
): Promise<string | null> {
  if (!src || !src.trim() || typeof window === 'undefined') return null;
  const trimmed = src.trim();
  if (trimmed.startsWith('data:image/png')) return trimmed;

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          if (!w || !h) {
            resolve(null);
            return;
          }
          const scale = Math.min(1, maxDim / Math.max(w, h));
          const cw = Math.max(1, Math.round(w * scale));
          const ch = Math.max(1, Math.round(h * scale));
          const canvas = document.createElement('canvas');
          canvas.width = cw;
          canvas.height = ch;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, cw, ch);
          ctx.drawImage(img, 0, 0, cw, ch);
          resolve(canvas.toDataURL('image/png'));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = trimmed;
    } catch {
      resolve(null);
    }
  });
}

function formatReadableDate(iso?: string): string {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatStatusLabel(status: OrganizationComplaintRecord['status']): string {
  if (status === 'closed') return 'CLOSED';
  if (status === 'in_progress') return 'IN PROGRESS';
  return 'OPEN';
}

function statusColors(
  status: OrganizationComplaintRecord['status']
): { bg: [number, number, number]; text: [number, number, number] } {
  if (status === 'closed') {
    return { bg: [220, 252, 231], text: [21, 128, 61] };
  }
  if (status === 'in_progress') {
    return { bg: [219, 234, 254], text: [29, 78, 216] };
  }
  return { bg: [254, 226, 226], text: [185, 28, 28] };
}

function severityLabel(sev: OrganizationComplaintRecord['severity']): string {
  return (sev || 'medium').toUpperCase();
}

export async function downloadSingleComplaintCapaPdf(
  org: ComplaintOrganizationProfile,
  complaint: OrganizationComplaintRecord,
  actionByUserName?: string
): Promise<void> {
  const logoPng = await loadImageAsDataUrl(org.logoUrl, 240);
  const evidencePng = await loadImageAsDataUrl(complaint.evidencePhotoUrl, 480);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const W = 210;
  const H = 297;
  const margin = 14;
  const contentW = W - margin * 2;

  // Header Banner
  doc.setFillColor(26, 33, 56); // #1A2138
  doc.rect(0, 0, W, 34, 'F');
  doc.setFillColor(22, 115, 184); // #1673B8
  doc.rect(0, 32, W, 2.5, 'F');

  // Organization Logo box on top-left
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 6, 22, 22, 2.5, 2.5, 'F');
  try {
    doc.addImage(logoPng || FS_PORTAL_LOGO_DATA_URI, 'PNG', margin + 1, 7, 20, 20);
  } catch {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(22, 115, 184);
    doc.text('ORG', margin + 11, 19, { align: 'center' });
  }

  // Organization Name & Report Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  const cleanCompany = (org.companyName || 'Food Business Organization').slice(0, 52);
  doc.text(cleanCompany, margin + 26, 13.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(191, 219, 254);
  doc.text(
    `${org.organizationType || 'Food Establishment'}${org.branchLocation ? `  |  ${org.branchLocation}` : ''}`,
    margin + 26,
    19.2
  );
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(253, 224, 71);
  doc.text(
    'OFFICIAL COMPLAINT & CAPA INVESTIGATION REPORT',
    margin + 26,
    25.8
  );

  // Ticket Status & Code Strip
  let y = 41;
  doc.setFillColor(244, 248, 253);
  doc.setDrawColor(210, 222, 234);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentW, 18, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(90, 108, 132);
  doc.text('COMPLAINT ID', margin + 4, y + 6);
  doc.text('SEVERITY', margin + 52, y + 6);
  doc.text('SUBMITTED DATE', margin + 94, y + 6);
  doc.text('CURRENT STATUS', margin + 142, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(26, 33, 56);
  doc.text(complaint.complaintCode, margin + 4, y + 13);
  doc.text(severityLabel(complaint.severity), margin + 52, y + 13);
  doc.text(formatReadableDate(complaint.createdAt), margin + 94, y + 13);

  const stCol = statusColors(complaint.status);
  doc.setFillColor(stCol.bg[0], stCol.bg[1], stCol.bg[2]);
  doc.roundedRect(margin + 140, y + 7.8, 36, 7, 1.5, 1.5, 'F');
  doc.setTextColor(stCol.text[0], stCol.text[1], stCol.text[2]);
  doc.setFontSize(9);
  doc.text(formatStatusLabel(complaint.status), margin + 158, y + 12.6, {
    align: 'center'
  });

  y += 24;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > H - 20) {
      doc.addPage();
      y = 18;
    }
  };

  const drawSectionBox = (
    title: string,
    bodyLines: { label?: string; value: string }[],
    accentRgb: [number, number, number] = [22, 115, 184]
  ) => {
    // Calculate required height
    doc.setFontSize(9);
    let innerHeight = 10;
    const preparedRows: { label?: string; lines: string[] }[] = [];
    for (const row of bodyLines) {
      const text = (row.value || 'Not documented yet').trim();
      const availW = row.label ? contentW - 44 : contentW - 8;
      const wrapped = doc.splitTextToSize(text, availW);
      preparedRows.push({ label: row.label, lines: wrapped });
      innerHeight += Math.max(5.5, wrapped.length * 4.4 + 1.8);
    }
    const boxHeight = innerHeight + 4;
    ensureSpace(boxHeight + 4);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(210, 222, 234);
    doc.setLineWidth(0.35);
    doc.roundedRect(margin, y, contentW, boxHeight, 2, 2, 'FD');

    // Header strip inside box
    doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.roundedRect(margin, y, contentW, 7.5, 2, 2, 'F');
    doc.rect(margin, y + 4.5, contentW, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + 4, y + 5.2);

    let ry = y + 12.5;
    for (const row of preparedRows) {
      if (row.label) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(row.label, margin + 4, ry);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(15, 23, 42);
        doc.text(row.lines, margin + 40, ry);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(15, 23, 42);
        doc.text(row.lines, margin + 4, ry);
      }
      ry += Math.max(5.5, row.lines.length * 4.4 + 1.8);
    }

    y += boxHeight + 5;
  };

  // Section 1: Complainant & Incident Information
  drawSectionBox(
    '1. COMPLAINANT & INCIDENT RECORD',
    [
      { label: 'Complainant:', value: complaint.complainantName },
      {
        label: 'Phone / Email:',
        value:
          [complaint.complainantPhone, complaint.complainantEmail]
            .filter(Boolean)
            .join('  |  ') || 'Not provided'
      },
      { label: 'Category:', value: complaint.category },
      {
        label: 'Batch / Order Ref:',
        value: complaint.batchOrOrderRef || 'Not specified'
      },
      {
        label: 'Incident Date:',
        value: complaint.incidentDate || formatReadableDate(complaint.createdAt)
      },
      { label: 'Subject:', value: complaint.subject },
      { label: 'Description:', value: complaint.description }
    ],
    [22, 115, 184]
  );

  // Evidence Photo if uploaded
  if (evidencePng) {
    ensureSpace(56);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(210, 222, 234);
    doc.roundedRect(margin, y, contentW, 50, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(26, 33, 56);
    doc.text('ATTACHED CUSTOMER EVIDENCE PHOTO', margin + 4, y + 6);
    try {
      doc.addImage(evidencePng, 'PNG', margin + 4, y + 9, 44, 37);
    } catch {
      // Ignore image placement failure
    }
    y += 55;
  }

  // Section 2: Root Cause Analysis
  drawSectionBox(
    '2. ROOT CAUSE ANALYSIS (RCA)',
    [
      {
        label: 'Cause Category:',
        value: complaint.rootCauseCategory || 'Pending QA classification'
      },
      {
        label: 'Root Cause:',
        value:
          complaint.rootCause ||
          'Root cause investigation not yet recorded.'
      }
    ],
    [180, 83, 9]
  );

  // Section 3: Immediate Correction
  drawSectionBox(
    '3. IMMEDIATE CORRECTION (CONTAINMENT)',
    [
      {
        label: 'Correction:',
        value:
          complaint.correction ||
          'Immediate containment / customer resolution not yet recorded.'
      }
    ],
    [16, 94, 154]
  );

  // Section 4: Long-Term Corrective & Preventive Action (CAPA)
  drawSectionBox(
    '4. CORRECTIVE & PREVENTIVE ACTION (CAPA) & CLOSURE',
    [
      {
        label: 'Corrective Action:',
        value:
          complaint.correctiveAction ||
          'Preventive action plan not yet recorded.'
      },
      {
        label: 'Assigned Owner:',
        value: complaint.assignedTo || 'Quality Assurance / Management'
      },
      {
        label: 'Target Date:',
        value: complaint.targetClosureDate || 'Not set'
      },
      {
        label: 'Verification:',
        value:
          complaint.verificationNotes ||
          (complaint.status === 'closed'
            ? 'Verified & Closed by Responsible Authority.'
            : 'Awaiting closure verification.')
      },
      {
        label: 'Closed Date:',
        value: complaint.closedAt
          ? formatReadableDate(complaint.closedAt)
          : complaint.status === 'closed'
            ? formatReadableDate(complaint.updatedAt)
            : 'Open — Not Closed Yet'
      }
    ],
    [13, 92, 58]
  );

  // Clean Sign-off Lines (without "Digitally Signed" stamp on upper lines)
  ensureSpace(26);
  const sigLineY = y + 12;
  const sigColW = 74;
  const rightSigX = W - margin - sigColW;
  const responsibleUserName = (
    complaint.assignedTo ||
    actionByUserName ||
    org.companyName ||
    'Quality Assurance / Manager'
  )
    .trim()
    .slice(0, 40);
  const signedDateLabel = formatReadableDate(
    complaint.closedAt || complaint.updatedAt || complaint.createdAt
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(26, 33, 56);
  doc.text(responsibleUserName, margin, sigLineY - 2, {
    maxWidth: sigColW - 2
  });

  if (complaint.status === 'closed') {
    doc.text(responsibleUserName, rightSigX, sigLineY - 2, {
      maxWidth: sigColW - 2
    });
  }

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(margin, sigLineY, margin + sigColW, sigLineY);
  doc.line(rightSigX, sigLineY, W - margin, sigLineY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Prepared / Investigated By (QA / Manager)', margin, sigLineY + 4.5);
  doc.text('Approved & Closed By (Authorized Signatory)', rightSigX, sigLineY + 4.5);

  const actionRoleLabel =
    complaint.status === 'closed'
      ? 'Closed & Investigated by'
      : 'Investigated by';

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(210, 222, 234);
    doc.setLineWidth(0.3);
    doc.line(margin, H - 14.5, W - margin, H - 14.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.6);
    doc.setTextColor(15, 37, 71);
    doc.text(
      `Digitally Signed Document  ·  ${actionRoleLabel}: ${responsibleUserName}  ·  ${signedDateLabel}`,
      margin,
      H - 10
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `${org.companyName} — Complaint & CAPA Record ${complaint.complaintCode} · Food Science Portal`,
      margin,
      H - 5.5
    );
    doc.text(`Page ${p} of ${totalPages}`, W - margin, H - 5.5, { align: 'right' });
  }

  doc.save(
    `CAPA_Report_${sanitizeSlug(org.companyName)}_${complaint.complaintCode}.pdf`
  );
}

export async function downloadFullComplaintDirectoryPdf(
  org: ComplaintOrganizationProfile,
  complaints: OrganizationComplaintRecord[],
  filterLabel = 'All Records'
): Promise<void> {
  const logoPng = await loadImageAsDataUrl(org.logoUrl, 240);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const W = 210;
  const H = 297;
  const margin = 13;
  const contentW = W - margin * 2;

  const drawHeader = () => {
    doc.setFillColor(26, 33, 56);
    doc.rect(0, 0, W, 30, 'F');
    doc.setFillColor(22, 115, 184);
    doc.rect(0, 28.5, W, 1.8, 'F');

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 5, 20, 20, 2, 2, 'F');
    try {
      doc.addImage(logoPng || FS_PORTAL_LOGO_DATA_URI, 'PNG', margin + 1, 6, 18, 18);
    } catch {
      // Ignore
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text(
      (org.companyName || 'Organization').slice(0, 54),
      margin + 24,
      12.5
    );
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(191, 219, 254);
    doc.text(
      `COMPLAINT HANDLING & CAPA REGISTER  |  Filter: ${filterLabel}  |  Generated: ${formatReadableDate(new Date().toISOString())}`,
      margin + 24,
      19
    );
    if (org.branchLocation || org.organizationType) {
      doc.text(
        `${org.organizationType}${org.branchLocation ? ` — ${org.branchLocation}` : ''}`,
        margin + 24,
        24.2
      );
    }
  };

  drawHeader();

  // KPI Metrics Row
  const totalCount = complaints.length;
  const openCount = complaints.filter((c) => c.status === 'open').length;
  const inProgressCount = complaints.filter(
    (c) => c.status === 'in_progress'
  ).length;
  const closedCount = complaints.filter((c) => c.status === 'closed').length;
  const resolutionPct =
    totalCount > 0 ? Math.round((closedCount / totalCount) * 100) : 0;

  let y = 36;
  const kpiW = (contentW - 9) / 4;
  const kpis = [
    { label: 'Total Logged', val: String(totalCount), col: [26, 33, 56] as [number, number, number] },
    { label: 'Open / Pending', val: String(openCount + inProgressCount), col: [185, 28, 28] as [number, number, number] },
    { label: 'Closed & Verified', val: String(closedCount), col: [21, 128, 61] as [number, number, number] },
    { label: 'Closure Rate', val: `${resolutionPct}%`, col: [22, 115, 184] as [number, number, number] }
  ];

  kpis.forEach((k, idx) => {
    const kx = margin + idx * (kpiW + 3);
    doc.setFillColor(244, 248, 253);
    doc.setDrawColor(210, 222, 234);
    doc.roundedRect(kx, y, kpiW, 15, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(k.label, kx + 3.5, y + 5.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(k.col[0], k.col[1], k.col[2]);
    doc.text(k.val, kx + 3.5, y + 12.2);
  });

  y += 21;

  if (complaints.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('No complaint records match the selected directory filter.', margin, y + 8);
  } else {
    for (const c of complaints) {
      doc.setFontSize(8.2);
      const subjectLines = doc.splitTextToSize(`Issue: ${c.subject} — ${c.description}`, contentW - 8).slice(0, 3);
      const rcLines = doc.splitTextToSize(
        `Root Cause: ${c.rootCause || 'Pending RCA'}`,
        contentW - 8
      ).slice(0, 2);
      const corrLines = doc.splitTextToSize(
        `Correction: ${c.correction || 'Pending'}  |  Corrective Action: ${c.correctiveAction || 'Pending'}`,
        contentW - 8
      ).slice(0, 3);

      const cardH =
        13 +
        subjectLines.length * 4 +
        rcLines.length * 4 +
        corrLines.length * 4 +
        6;

      if (y + cardH > H - 18) {
        doc.addPage();
        drawHeader();
        y = 36;
      }

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(210, 222, 234);
      doc.setLineWidth(0.35);
      doc.roundedRect(margin, y, contentW, cardH, 2, 2, 'FD');

      // Card Top Row
      doc.setFillColor(244, 248, 253);
      doc.rect(margin, y, contentW, 8.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 33, 56);
      doc.text(
        `${c.complaintCode}  |  ${c.complainantName} (${c.category})  |  ${formatReadableDate(c.createdAt)}`,
        margin + 3.5,
        y + 5.8
      );

      const stCol = statusColors(c.status);
      doc.setFillColor(stCol.bg[0], stCol.bg[1], stCol.bg[2]);
      doc.roundedRect(margin + contentW - 30, y + 1.5, 27, 5.5, 1, 1, 'F');
      doc.setTextColor(stCol.text[0], stCol.text[1], stCol.text[2]);
      doc.setFontSize(7.2);
      doc.text(
        formatStatusLabel(c.status),
        margin + contentW - 16.5,
        y + 5.3,
        { align: 'center' }
      );

      let cy = y + 13;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.2);
      doc.setTextColor(30, 41, 59);
      doc.text(subjectLines, margin + 3.5, cy);
      cy += subjectLines.length * 4 + 1.5;

      doc.setTextColor(146, 64, 14);
      doc.text(rcLines, margin + 3.5, cy);
      cy += rcLines.length * 4 + 1.5;

      doc.setTextColor(13, 92, 58);
      doc.text(corrLines, margin + 3.5, cy);

      y += cardH + 4;
    }
  }

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `${org.companyName} — Confidential Complaint & CAPA Directory · Food Science Portal`,
      margin,
      H - 7
    );
    doc.text(`Page ${p} of ${totalPages}`, W - margin, H - 7, { align: 'right' });
  }

  doc.save(`Complaint_Directory_${sanitizeSlug(org.companyName)}.pdf`);
}

export async function downloadQrPosterPng(
  org: ComplaintOrganizationProfile,
  intakeUrl: string
): Promise<void> {
  const logoPng = await loadImageAsDataUrl(org.logoUrl, 360);
  const qrMatrix = generateQrCodeMatrix(intakeUrl);

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clean White Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer Hairline Border
  ctx.strokeStyle = '#D2DEEA';
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  // Top Header Navy + Royal Blue Accent
  ctx.fillStyle = '#1A2138';
  ctx.fillRect(24, 24, canvas.width - 48, 280);
  ctx.fillStyle = '#1673B8';
  ctx.fillRect(24, 294, canvas.width - 48, 16);

  // Brand Logo White Card
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(canvas.width / 2 - 90, 56, 180, 180, 24);
  ctx.fill();

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, canvas.width / 2 - 80, 66, 160, 160);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = logoPng || FS_PORTAL_LOGO_DATA_URI;
  });

  // Company Name & Sector
  ctx.fillStyle = '#1A2138';
  ctx.font = 'bold 54px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    (org.companyName || 'Food Organization').slice(0, 34),
    canvas.width / 2,
    390
  );

  ctx.fillStyle = '#1673B8';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(
    `${org.organizationType || 'Food Establishment'}${org.branchLocation ? ` · ${org.branchLocation}` : ''}`,
    canvas.width / 2,
    442
  );

  // Scan Callout
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 42px sans-serif';
  ctx.fillText('SCAN QR FOR COMPLAINTS & FEEDBACK', canvas.width / 2, 535);

  ctx.fillStyle = '#475569';
  ctx.font = '26px sans-serif';
  ctx.fillText(
    'Point your phone camera below to register a quality, hygiene,',
    canvas.width / 2,
    586
  );
  ctx.fillText(
    'or service complaint directly with our QA & Management Team.',
    canvas.width / 2,
    622
  );

  // QR Code Box
  const qrSize = 620;
  const qrX = (canvas.width - qrSize) / 2;
  const qrY = 680;
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#1673B8';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(qrX - 36, qrY - 36, qrSize + 72, qrSize + 72, 28);
  ctx.fill();
  ctx.stroke();

  if (qrMatrix.length > 0) {
    const modCount = qrMatrix.length;
    const cell = qrSize / modCount;
    ctx.fillStyle = '#1A2138';
    for (let r = 0; r < modCount; r++) {
      for (let c = 0; c < modCount; c++) {
        if (qrMatrix[r][c]) {
          ctx.fillRect(
            qrX + c * cell,
            qrY + r * cell,
            Math.ceil(cell),
            Math.ceil(cell)
          );
        }
      }
    }
  }

  // Footer
  ctx.fillStyle = '#1673B8';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(intakeUrl.slice(0, 68), canvas.width / 2, 1435);

  ctx.fillStyle = '#64748B';
  ctx.font = '22px sans-serif';
  ctx.fillText(
    'Verified Digital Complaint & CAPA Portal · Food Science Portal',
    canvas.width / 2,
    1505
  );

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR_Complaint_Poster_${sanitizeSlug(org.companyName)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, 'image/png');
}
