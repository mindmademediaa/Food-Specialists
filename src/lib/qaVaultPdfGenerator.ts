import { jsPDF } from 'jspdf';
import { FS_PORTAL_LOGO_DATA_URI } from './brandLogo';
import { fitPdfTextToWidth, sanitizePdfText } from './pdfBranding';
import { QA_MODULE_CATALOG } from '../data/qaVaultDefaults';
import {
  QaControlledDocMeta,
  QaModuleId,
  QaModulePayloadMap,
  QaWorkspaceCompanyProfile
} from '../types/qaVault';

function safeSlug(val: string, maxLen = 28): string {
  return (val || 'Company')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLen) || 'Company';
}

function drawCompanyLogo(
  pdf: jsPDF,
  logoUrl: string | undefined,
  x: number,
  y: number,
  sizeMm: number
): void {
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.35);
  pdf.roundedRect(x, y, sizeMm, sizeMm, 2, 2, 'FD');

  const src = logoUrl && logoUrl.startsWith('data:image/') ? logoUrl : FS_PORTAL_LOGO_DATA_URI;
  const fmt = src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')
    ? 'JPEG'
    : src.startsWith('data:image/webp')
    ? 'WEBP'
    : 'PNG';
  try {
    pdf.addImage(src, fmt, x + 1, y + 1, sizeMm - 2, sizeMm - 2);
  } catch {
    try {
      pdf.addImage(FS_PORTAL_LOGO_DATA_URI, 'PNG', x + 1, y + 1, sizeMm - 2, sizeMm - 2);
    } catch {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(22, 115, 184);
      pdf.text('QMS', x + sizeMm / 2, y + sizeMm / 2 + 1.5, { align: 'center' });
    }
  }
}

function drawControlledHeader(
  pdf: jsPDF,
  company: QaWorkspaceCompanyProfile,
  title: string,
  meta: QaControlledDocMeta,
  pageNumber: number
): number {
  const pageW = pdf.internal.pageSize.getWidth();
  const margin = 12;
  const boxW = pageW - margin * 2;
  const top = 10;
  const hdrH = 26;

  // Outer ISO controlled header box
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(26, 33, 56);
  pdf.setLineWidth(0.45);
  pdf.rect(margin, top, boxW, hdrH, 'FD');

  // Left logo cell
  const logoCellW = 28;
  pdf.line(margin + logoCellW, top, margin + logoCellW, top + hdrH);
  drawCompanyLogo(pdf, company.logoUrl, margin + 4, top + 3, 20);

  // Right doc control cell
  const rightCellW = 64;
  const rightX = margin + boxW - rightCellW;
  pdf.line(rightX, top, rightX, top + hdrH);

  // Center title & company
  const centerW = boxW - logoCellW - rightCellW;
  const centerX = margin + logoCellW + centerW / 2;

  pdf.setTextColor(26, 33, 56);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10.5);
  pdf.text(
    fitPdfTextToWidth(pdf, company.companyName || 'Food Organization', centerW - 6),
    centerX,
    top + 6.5,
    { align: 'center' }
  );

  pdf.setFontSize(10.5);
  pdf.setTextColor(22, 115, 184);
  const titleLines = pdf.splitTextToSize(sanitizePdfText(title, true).toUpperCase(), centerW - 6).slice(0, 2);
  pdf.text(titleLines, centerX, top + 12.2, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.4);
  pdf.setTextColor(71, 85, 105);
  const subLine = fitPdfTextToWidth(
    pdf,
    `${meta.standardClause || 'QMS/FSMS'} | Reg: ${company.pfaOrRegNo || 'QMS/FSMS'}`,
    centerW - 6
  );
  pdf.text(subLine, centerX, top + 23.2, { align: 'center' });

  // Right metadata grid (4 rows)
  const rRowH = hdrH / 4;
  for (let i = 1; i < 4; i += 1) {
    pdf.line(rightX, top + i * rRowH, rightX + rightCellW, top + i * rRowH);
  }
  const metaRows: Array<[string, string]> = [
    ['Doc No:', meta.docCode],
    ['Revision:', `${meta.revision} (${(meta.status || 'approved').toUpperCase()})`],
    ['Eff. Date:', meta.effectiveDate],
    ['Page:', `Page ${pageNumber}`]
  ];
  metaRows.forEach(([lbl, val], idx) => {
    const ry = top + idx * rRowH + 4.4;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.4);
    pdf.setTextColor(51, 65, 85);
    pdf.text(lbl, rightX + 2, ry);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(15, 23, 42);
    pdf.text(fitPdfTextToWidth(pdf, val, rightCellW - 21), rightX + 19, ry);
  });

  return top + hdrH + 6;
}

function drawFooterAllPages(
  pdf: jsPDF,
  company: QaWorkspaceCompanyProfile,
  meta: QaControlledDocMeta
): void {
  const totalPages = pdf.getNumberOfPages();
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 12;

  for (let p = 1; p <= totalPages; p += 1) {
    pdf.setPage(p);
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.25);
    pdf.line(margin, pageH - 12, pageW - margin, pageH - 12);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(71, 85, 105);
    const rightFooter = `Page ${p} of ${totalPages} | Generated via Food Science Portal`;
    const rightFooterW = pdf.getTextWidth(rightFooter);
    pdf.text(
      fitPdfTextToWidth(
        pdf,
        `Controlled Document: ${meta.docCode} (${meta.revision}) | ${company.companyName} | Review: ${meta.reviewCycle}`,
        pageW - margin * 2 - rightFooterW - 6
      ),
      margin,
      pageH - 7.5
    );
    pdf.text(rightFooter, pageW - margin, pageH - 7.5, { align: 'right' });
  }
}

function drawApprovalSignOffBlock(
  pdf: jsPDF,
  company: QaWorkspaceCompanyProfile,
  meta: QaControlledDocMeta,
  startY: number
): number {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 12;
  let y = startY;

  if (y + 30 > pageH - 16) {
    pdf.addPage();
    y = drawControlledHeader(
      pdf,
      company,
      'Document Authorization & Sign-Off',
      meta,
      pdf.getNumberOfPages()
    );
  }

  const boxW = (pageW - margin * 2 - 8) / 3;
  const blocks = [
    { label: 'Prepared By', name: company.preparedBy || 'QA Manager', role: company.preparedRole || 'FSTL' },
    { label: 'Reviewed By', name: company.reviewedBy || 'Production Manager', role: company.reviewedRole || 'Operations' },
    { label: 'Approved By', name: company.approvedBy || 'Plant Director', role: company.approvedRole || 'Top Management' }
  ];

  blocks.forEach((b, idx) => {
    const bx = margin + idx * (boxW + 4);
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect(bx, y, boxW, 22, 1.5, 1.5, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(22, 115, 184);
    pdf.text(b.label.toUpperCase(), bx + 3, y + 5);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text(fitPdfTextToWidth(pdf, b.name || '', boxW - 6), bx + 3, y + 11.5);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.4);
    pdf.setTextColor(71, 85, 105);
    pdf.text(
      fitPdfTextToWidth(pdf, `${b.role} | Date: ${meta.effectiveDate}`, boxW - 6),
      bx + 3,
      y + 18
    );
  });

  return y + 26;
}

function drawSectionHeading(
  pdf: jsPDF,
  company: QaWorkspaceCompanyProfile,
  docTitle: string,
  meta: QaControlledDocMeta,
  y: number,
  heading: string
): number {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 12;

  if (y + 18 > pageH - 18) {
    pdf.addPage();
    y = drawControlledHeader(pdf, company, docTitle, meta, pdf.getNumberOfPages());
  }

  pdf.setFillColor(240, 246, 252);
  pdf.setDrawColor(210, 222, 234);
  pdf.rect(margin, y, pageW - margin * 2, 7.5, 'FD');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.2);
  pdf.setTextColor(26, 33, 56);
  pdf.text(fitPdfTextToWidth(pdf, heading, pageW - margin * 2 - 6), margin + 3, y + 5.1);

  return y + 10.5;
}

function drawParagraphBlock(
  pdf: jsPDF,
  company: QaWorkspaceCompanyProfile,
  docTitle: string,
  meta: QaControlledDocMeta,
  y: number,
  label: string,
  body: string
): number {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const maxW = pageW - margin * 2 - 4;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.3);
  const lines = pdf.splitTextToSize(sanitizePdfText(body || 'Not specified', true), maxW);

  if (y + 14 > pageH - 18) {
    pdf.addPage();
    y = drawControlledHeader(pdf, company, docTitle, meta, pdf.getNumberOfPages());
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.4);
  pdf.setTextColor(22, 115, 184);
  pdf.text(fitPdfTextToWidth(pdf, label, maxW), margin + 1, y);
  y += 4.2;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.3);
  pdf.setTextColor(30, 41, 59);
  for (const line of lines) {
    if (y + 4.5 > pageH - 18) {
      pdf.addPage();
      y = drawControlledHeader(pdf, company, docTitle, meta, pdf.getNumberOfPages());
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.3);
      pdf.setTextColor(30, 41, 59);
    }
    pdf.text(line, margin + 1, y);
    y += 4.2;
  }

  return y + 3.5;
}

function drawDataTable(
  pdf: jsPDF,
  company: QaWorkspaceCompanyProfile,
  docTitle: string,
  meta: QaControlledDocMeta,
  startY: number,
  columns: Array<{ header: string; weight: number }>,
  rows: string[][]
): number {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const totalW = pageW - margin * 2;
  const totalWeight = columns.reduce((acc, c) => acc + c.weight, 0) || 1;
  const colWidths = columns.map((c) => (c.weight / totalWeight) * totalW);

  let y = startY;

  const drawTableHeader = () => {
    pdf.setFillColor(26, 33, 56);
    pdf.rect(margin, y, totalW, 8.5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.4);
    let cx = margin;
    columns.forEach((col, i) => {
      const cleanHdr = sanitizePdfText(col.header, true);
      const wrapped = pdf.splitTextToSize(cleanHdr, colWidths[i] - 3).slice(0, 2);
      if (wrapped.length > 1) {
        pdf.text(wrapped, cx + 1.5, y + 3.4);
      } else {
        pdf.text(wrapped[0] || cleanHdr, cx + 1.5, y + 5.5);
      }
      cx += colWidths[i];
    });
    y += 8.5;
  };

  if (y + 22 > pageH - 18) {
    pdf.addPage();
    y = drawControlledHeader(pdf, company, docTitle, meta, pdf.getNumberOfPages());
  }
  drawTableHeader();

  rows.forEach((row, rIdx) => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.6);
    const maxBodyLines = Math.max(8, Math.floor((pageH - 72) / 3.9));
    const cellLines = columns.map((_, cIdx) => {
      const text = sanitizePdfText((row[cIdx] ?? '').toString(), false) || '-';
      return pdf.splitTextToSize(text, colWidths[cIdx] - 3).slice(0, maxBodyLines);
    });
    const maxLines = Math.max(...cellLines.map((l) => l.length), 1);
    const rowH = Math.max(8.5, maxLines * 3.9 + 3.5);

    if (y + rowH > pageH - 18) {
      pdf.addPage();
      y = drawControlledHeader(pdf, company, docTitle, meta, pdf.getNumberOfPages());
      drawTableHeader();
    }

    if (rIdx % 2 === 1) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y, totalW, rowH, 'F');
    }

    pdf.setDrawColor(210, 222, 234);
    pdf.setLineWidth(0.2);
    pdf.rect(margin, y, totalW, rowH);

    let cx = margin;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.6);
    pdf.setTextColor(15, 23, 42);
    columns.forEach((_, cIdx) => {
      if (cIdx > 0) {
        pdf.line(cx, y, cx, y + rowH);
      }
      pdf.text(cellLines[cIdx], cx + 1.5, y + 4.3);
      cx += colWidths[cIdx];
    });

    y += rowH;
  });

  return y + 5;
}

export function downloadQaControlledModulePdf<K extends keyof QaModulePayloadMap>(
  company: QaWorkspaceCompanyProfile,
  moduleId: K,
  meta: QaControlledDocMeta,
  payload: QaModulePayloadMap[K]
): void {
  const landscapeModules: Array<keyof QaModulePayloadMap> = [
    'approved-supplier',
    'pest-management',
    'hazard-analysis',
    'ccp-determination',
    'critical-limits',
    'monitoring-checklists',
    'corrective-actions',
    'verification-form',
    'risk-assessment'
  ];
  const orientation = landscapeModules.includes(moduleId) ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  const catalogEntry = QA_MODULE_CATALOG.find((m) => m.id === moduleId);
  const docTitle = catalogEntry?.fullTitle || 'Controlled QMS/FSMS Document';
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 12;

  let y = drawControlledHeader(pdf, company, docTitle, meta, 1);

  // Company Scope Banner Line
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  const scopeText = fitPdfTextToWidth(
    pdf,
    `Facility: ${company.facilityAddress || 'Primary Plant'} | Standards: ${(company.standards || []).join(', ') || 'ISO 9001 & FSSC 22000'}`,
    pageW - margin * 2
  );
  pdf.text(scopeText, margin, y);
  y += 5;

  switch (moduleId) {
    case 'sops': {
      const data = payload as QaModulePayloadMap['sops'];
      data.sops.forEach((sop, idx) => {
        y = drawSectionHeading(
          pdf,
          company,
          docTitle,
          meta,
          y,
          `${idx + 1}. ${sop.sopCode} - ${sop.title} (${sop.revision} | ${sop.status.toUpperCase()})`
        );
        y = drawParagraphBlock(
          pdf,
          company,
          docTitle,
          meta,
          y,
          `Standard & Department: ${sop.standardRef} | ${sop.department}`,
          `Purpose: ${sop.purpose}\nScope: ${sop.scope}\nResponsibilities: ${sop.responsibilities}`
        );
        y = drawParagraphBlock(
          pdf,
          company,
          docTitle,
          meta,
          y,
          'Standard Operating Procedure Steps',
          sop.procedureSteps.join('\n')
        );
        y = drawParagraphBlock(
          pdf,
          company,
          docTitle,
          meta,
          y,
          'Controlled Records & Forms',
          sop.recordsRequired
        );
      });
      break;
    }

    case 'approved-supplier': {
      const data = payload as QaModulePayloadMap['approved-supplier'];
      y = drawSectionHeading(pdf, company, docTitle, meta, y, '1. Approved Supplier Governance Policy (ISO 9001 Cl. 8.4 & FSSC 22000)');
      y = drawParagraphBlock(pdf, company, docTitle, meta, y, 'Policy Objective', data.policyObjective);
      y = drawParagraphBlock(pdf, company, docTitle, meta, y, 'Qualification & Audit Method', data.selectionProcedure);
      y = drawParagraphBlock(pdf, company, docTitle, meta, y, 'Incoming Receiving & COA Rule', data.incomingCoaRule);
      y = drawParagraphBlock(pdf, company, docTitle, meta, y, 'Annual Re-Evaluation Criteria', data.reEvaluationCriteria);

      y = drawSectionHeading(pdf, company, docTitle, meta, y, '2. Approved Supplier Master Register');
      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'Supplier Name & Material', weight: 2.2 },
          { header: 'Risk Tier', weight: 0.8 },
          { header: 'Certifications & Expiry', weight: 1.7 },
          { header: 'Audit Method & Score', weight: 1.3 },
          { header: 'Incoming COA Verification Spec', weight: 2.3 },
          { header: 'Status & Next Review', weight: 1.2 }
        ],
        data.suppliers.map((s) => [
          `${s.supplierName}\n(${s.materialSupplied})`,
          s.riskTier,
          `${s.certifications}\nExp: ${s.certExpiry}`,
          `${s.auditMethod}\nScore: ${s.auditScorePct}%`,
          s.coaParameters,
          `${s.approvalStatus}\nReview: ${s.nextEvaluationDate}`
        ])
      );
      break;
    }

    case 'pest-management': {
      const data = payload as QaModulePayloadMap['pest-management'];
      y = drawSectionHeading(pdf, company, docTitle, meta, y, '1. Integrated Pest Management (IPM) Procedure');
      y = drawParagraphBlock(
        pdf,
        company,
        docTitle,
        meta,
        y,
        `Licensed Pest Contractor: ${data.contractorName} (License: ${data.contractorLicenseNo})`,
        `${data.procedureSummary}\n\nChemical & Bait Safety Rule: ${data.chemicalControlRule}\n\nTrend Escalation Rule: ${data.trendReviewRule}`
      );
      y = drawSectionHeading(pdf, company, docTitle, meta, y, '2. Pest Monitoring Device Register & Threshold Matrix');
      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'Device ID', weight: 1.1 },
          { header: 'Zone / Plant Location', weight: 1.8 },
          { header: 'Device Type', weight: 1.8 },
          { header: 'Target Pest', weight: 1.2 },
          { header: 'Frequency', weight: 1.1 },
          { header: 'Last Catch', weight: 0.7 },
          { header: 'Threshold & Action', weight: 2.0 }
        ],
        data.devices.map((d) => [
          d.deviceCode,
          d.zoneLocation,
          d.deviceType,
          d.targetPest,
          d.inspectionFrequency,
          String(d.lastActivityCount),
          `${d.thresholdTrigger} -> ${d.correctiveActionNote}`
        ])
      );
      break;
    }

    case 'haccp-team': {
      const data = payload as QaModulePayloadMap['haccp-team'];
      y = drawSectionHeading(pdf, company, docTitle, meta, y, '1. Food Safety & HACCP Team Charter (Codex Step 1)');
      y = drawParagraphBlock(
        pdf,
        company,
        docTitle,
        meta,
        y,
        'Authority & Management Commitment',
        `${data.teamCharterStatement}\n\nMeeting Cadence: ${data.meetingFrequency}\nExternal Technical Support: ${data.externalConsultants}`
      );
      y = drawSectionHeading(pdf, company, docTitle, meta, y, '2. Multidisciplinary Food Safety Team Matrix');
      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'Member Name & Title', weight: 1.6 },
          { header: 'HACCP Team Role', weight: 1.4 },
          { header: 'Qualification & Experience', weight: 1.5 },
          { header: 'HACCP / FSSC Training', weight: 1.4 },
          { header: 'Responsibilities & Authority', weight: 2.3 }
        ],
        data.members.map((m) => [
          `${m.fullName}\n(${m.designation}, ${m.department})`,
          m.haccpRole,
          m.qualificationAndExp,
          m.trainingCredentials,
          m.assignedResponsibilities
        ])
      );
      break;
    }

    case 'product-description': {
      const data = payload as QaModulePayloadMap['product-description'];
      data.products.forEach((p, idx) => {
        y = drawSectionHeading(
          pdf,
          company,
          docTitle,
          meta,
          y,
          `${idx + 1}. ${p.productCode} — ${p.productName} (${p.productCategory})`
        );
        y = drawDataTable(
          pdf,
          company,
          docTitle,
          meta,
          y,
          [
            { header: 'Codex Steps 2–3 Specification Element', weight: 1.3 },
            { header: 'Company Validated Specification & Control Details', weight: 3.0 }
          ],
          [
            ['Raw Materials & Ingredients', p.rawMaterialsAndIngredients],
            ['Intrinsic Factors (pH, aw, Brix, Preservatives)', p.intrinsicCharacteristics],
            ['Processing & Preservation Method', p.processingMethod],
            ['Primary & Secondary Packaging', p.packagingMaterial],
            ['Shelf-Life & Storage Conditions', p.shelfLifeAndStorage],
            ['Distribution & Logistics Controls', p.distributionMethod],
            ['Intended Use (Step 3)', p.intendedUse],
            ['Target Consumer & Vulnerable Groups', `${p.targetConsumerGroup} | Warning: ${p.vulnerableGroupsWarning}`],
            ['Allergen Declaration', p.allergenDeclaration],
            ['Statutory Labeling & Standards', p.labelingAndRegulatoryStandard],
            ['Reasonably Expected Mishandling', p.expectedMishandling]
          ]
        );
      });
      break;
    }

    case 'flow-diagram': {
      const data = payload as QaModulePayloadMap['flow-diagram'];
      y = drawSectionHeading(pdf, company, docTitle, meta, y, `1. ${data.processTitle} (Codex Step 4)`);
      y = drawParagraphBlock(pdf, company, docTitle, meta, y, 'Process Boundary', data.scopeBoundary);

      // Draw crisp visual vector flowchart
      const boxW = pageW - margin * 2 - 40;
      const boxX = margin + 20;

      data.steps.forEach((step, idx) => {
        if (y + 22 > pageH - 18) {
          pdf.addPage();
          y = drawControlledHeader(pdf, company, docTitle, meta, pdf.getNumberOfPages());
        }
        const isCcp = step.controlClassification === 'CCP';
        const isOprp = step.controlClassification === 'OPRP';
        pdf.setFillColor(isCcp ? 254 : isOprp ? 255 : 248, isCcp ? 242 : isOprp ? 251 : 250, isCcp ? 242 : isOprp ? 235 : 252);
        pdf.setDrawColor(isCcp ? 220 : isOprp ? 217 : 22, isCcp ? 38 : isOprp ? 119 : 115, isCcp ? 38 : isOprp ? 6 : 184);
        pdf.setLineWidth(isCcp ? 0.65 : 0.35);
        pdf.roundedRect(boxX, y, boxW, 14.5, 2, 2, 'FD');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.8);
        pdf.setTextColor(isCcp ? 185 : isOprp ? 180 : 22, isCcp ? 28 : isOprp ? 83 : 115, isCcp ? 28 : isOprp ? 9 : 184);
        const badgeText = sanitizePdfText(`[${step.controlClassification} | ${step.stepCategory}]`, true);
        const badgeW = pdf.getTextWidth(badgeText);
        pdf.text(badgeText, boxX + boxW - 3, y + 5.3, { align: 'right' });

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(15, 23, 42);
        pdf.text(
          fitPdfTextToWidth(pdf, `Step ${step.stepNumber}: ${step.stepName}`, boxW - badgeW - 10),
          boxX + 3,
          y + 5.3
        );

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.4);
        pdf.setTextColor(71, 85, 105);
        pdf.text(
          fitPdfTextToWidth(
            pdf,
            `Params: ${step.equipmentAndParams} | Inputs: ${step.inputsAndIngredients}`,
            boxW - 6
          ),
          boxX + 3,
          y + 11.2
        );

        y += 14.5;
        if (idx < data.steps.length - 1) {
          const midX = boxX + boxW / 2;
          pdf.setDrawColor(26, 33, 56);
          pdf.setLineWidth(0.4);
          pdf.line(midX, y, midX, y + 5);
          pdf.line(midX - 1.5, y + 3.2, midX, y + 5);
          pdf.line(midX + 1.5, y + 3.2, midX, y + 5);
          y += 5;
        } else {
          y += 5;
        }
      });

      y = drawSectionHeading(pdf, company, docTitle, meta, y, '2. Process Step Inputs, Wastes & Rework Summary');
      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'Step # & Name', weight: 1.8 },
          { header: 'Class', weight: 0.7 },
          { header: 'Inputs / Ingredients', weight: 1.6 },
          { header: 'Equipment & Parameters', weight: 1.8 },
          { header: 'Wastes / Rework Control', weight: 1.6 }
        ],
        data.steps.map((s) => [
          `${s.stepNumber}. ${s.stepName}`,
          s.controlClassification,
          s.inputsAndIngredients,
          s.equipmentAndParams,
          s.wastesAndRework
        ])
      );

      y = drawSectionHeading(pdf, company, docTitle, meta, y, '3. Codex Step 5: On-Site Verification of Flow Diagram');
      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'Date', weight: 0.9 },
          { header: 'Line & Shift', weight: 1.5 },
          { header: 'Live Run?', weight: 0.7 },
          { header: 'Deviations Observed', weight: 2.0 },
          { header: 'Corrections Made', weight: 1.8 },
          { header: 'Verified By / FSTL', weight: 1.3 }
        ],
        data.verifications.map((v) => [
          v.verificationDate,
          v.lineAndShift,
          v.checkedDuringLiveRun,
          v.deviationsObserved,
          v.diagramCorrectionsMade,
          `${v.verifiedBy}\n${v.fstlApproval}`
        ])
      );
      break;
    }

    case 'hazard-analysis': {
      const data = payload as QaModulePayloadMap['hazard-analysis'];
      y = drawSectionHeading(pdf, company, docTitle, meta, y, '1. Hazard Analysis Methodology (Codex Step 6 / ISO 22000 Cl. 8.5.2)');
      y = drawParagraphBlock(pdf, company, docTitle, meta, y, 'Risk Evaluation Rule', data.methodologyNote);
      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'Step / Material', weight: 1.6 },
          { header: 'Type', weight: 0.7 },
          { header: 'Hazard & Cause', weight: 2.2 },
          { header: 'L×S=R', weight: 0.8 },
          { header: 'Significant?', weight: 0.9 },
          { header: 'Control Measure & Justification', weight: 2.5 },
          { header: 'Program', weight: 0.7 }
        ],
        data.rows.map((r) => {
          const score = r.likelihood * r.severity;
          const sig = score >= data.significanceThreshold || r.severity >= 4 ? 'YES (Sig.)' : 'No (Low)';
          return [
            r.stepOrMaterial,
            r.hazardCategory,
            `${r.hazardDescription}\nCause: ${r.causeOrSource}`,
            `${r.likelihood}×${r.severity}=${score}`,
            sig,
            `${r.controlMeasures}\n(${r.justification})`,
            r.appliedProgram
          ];
        })
      );
      break;
    }

    case 'ccp-determination': {
      const data = payload as QaModulePayloadMap['ccp-determination'];
      y = drawSectionHeading(pdf, company, docTitle, meta, y, `1. ${data.decisionTreeStandard} Worksheet (Codex Step 7)`);
      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'Process Step & Hazard', weight: 2.0 },
          { header: 'Q1', weight: 0.5 },
          { header: 'Q2', weight: 0.5 },
          { header: 'Q3', weight: 0.5 },
          { header: 'Q4', weight: 0.5 },
          { header: 'Result / ID', weight: 1.1 },
          { header: 'Decision Tree Rationale', weight: 2.6 }
        ],
        data.rows.map((r) => [
          `${r.stepName}\n[${r.significantHazard}]`,
          r.q1ControlMeasureExists,
          r.q2DesignedToEliminate,
          r.q3ContaminationCouldIncrease,
          r.q4SubsequentStepEliminates,
          `${r.classification} (${r.ccpNumber})`,
          r.decisionRationale
        ])
      );
      break;
    }

    case 'critical-limits': {
      const data = payload as QaModulePayloadMap['critical-limits'];
      y = drawSectionHeading(pdf, company, docTitle, meta, y, '1. Critical Control Limits Validation Matrix (Codex Step 8)');
      y = drawParagraphBlock(pdf, company, docTitle, meta, y, 'Validation Basis', data.validationPolicy);
      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'ID & Step', weight: 1.4 },
          { header: 'Hazard Controlled', weight: 1.5 },
          { header: 'Validated Critical Limit (Hard Fail)', weight: 2.0 },
          { header: 'Operational Target (Alert)', weight: 1.7 },
          { header: 'Scientific Basis & Evidence', weight: 2.2 }
        ],
        data.rows.map((r) => [
          `${r.ccpOrOprpNumber}\n${r.processStep}`,
          r.hazardControlled,
          r.criticalLimit,
          r.operationalTarget,
          `${r.scientificValidationBasis}\nRef: ${r.validationEvidenceRef}`
        ])
      );
      break;
    }

    case 'monitoring-checklists': {
      const data = payload as QaModulePayloadMap['monitoring-checklists'];
      data.checklists.forEach((chk, idx) => {
        y = drawSectionHeading(
          pdf,
          company,
          docTitle,
          meta,
          y,
          `${idx + 1}. ${chk.checklistCode} — ${chk.title} (${chk.lineOrArea} · ${chk.shift} · ${chk.monitoringDate})`
        );
        y = drawDataTable(
          pdf,
          company,
          docTitle,
          meta,
          y,
          [
            { header: 'Checkpoint / Parameter', weight: 2.2 },
            { header: 'Frequency', weight: 1.2 },
            { header: 'Acceptable Limit', weight: 1.6 },
            { header: 'Actual Reading', weight: 1.6 },
            { header: 'Status', weight: 0.7 },
            { header: 'Init.', weight: 0.6 },
            { header: 'Remarks', weight: 1.5 }
          ],
          [
            ...chk.items.map((it) => [
              it.checkpointName,
              it.frequency,
              it.acceptableLimit,
              it.actualReading,
              it.status,
              it.operatorInitials,
              it.remarks
            ]),
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '']
          ]
        );
      });
      break;
    }

    case 'corrective-actions': {
      const data = payload as QaModulePayloadMap['corrective-actions'];
      y = drawSectionHeading(pdf, company, docTitle, meta, y, '1. Hold, Containment & Corrective Action Protocol (Codex Step 10 / ISO 9001 Cl. 10.2)');
      y = drawParagraphBlock(pdf, company, docTitle, meta, y, 'Product Hold & Release Procedure', data.holdAndReleaseProcedure);
      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'CAR # & Source', weight: 1.2 },
          { header: 'Batch & Deviation', weight: 1.9 },
          { header: 'Immediate Correction & Disposition', weight: 1.8 },
          { header: '5-Why Root Cause', weight: 1.8 },
          { header: 'Corrective Action & Owner', weight: 1.8 },
          { header: 'Verification & Status', weight: 1.5 }
        ],
        data.records.map((r) => [
          `${r.carNumber}\n${r.dateRaised}\n${r.source}`,
          `${r.affectedProductBatch} (${r.quantityHeld})\n${r.deviationDescription}`,
          `${r.immediateCorrection}\nDisp: ${r.productDisposition}`,
          r.rootCause5Why,
          `${r.correctiveActionPlan}\nOwner: ${r.responsiblePerson} (Due ${r.targetDate})`,
          `${r.status}\n${r.effectivenessVerification}`
        ])
      );
      break;
    }

    case 'verification-form': {
      const data = payload as QaModulePayloadMap['verification-form'];
      y = drawSectionHeading(pdf, company, docTitle, meta, y, '1. FSMS / HACCP Verification & Calibration Schedule (Codex Step 11)');
      y = drawParagraphBlock(pdf, company, docTitle, meta, y, 'Verification Objective', data.verificationObjective);
      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'Verification Activity & Clause', weight: 1.8 },
          { header: 'Frequency', weight: 1.2 },
          { header: 'Method & Acceptance Criteria', weight: 2.0 },
          { header: 'Actual Finding & Date', weight: 2.0 },
          { header: 'Status & Next Due', weight: 1.2 },
          { header: 'Verifier', weight: 1.0 }
        ],
        data.rows.map((r) => [
          `${r.activityName}\n(${r.standardClause})`,
          r.frequency,
          r.methodAndCriteria,
          `${r.actualFinding}\nChecked: ${r.lastVerifiedDate}`,
          `${r.verificationStatus}\nNext: ${r.nextDueDate}`,
          r.verifierName
        ])
      );
      break;
    }

    case 'risk-assessment': {
      const data = payload as QaModulePayloadMap['risk-assessment'];
      y = drawSectionHeading(pdf, company, docTitle, meta, y, '1. Full Risk & Opportunity Assessment (ISO 9001 Cl. 6.1, FSSC 22000, TACCP & VACCP)');
      y = drawParagraphBlock(pdf, company, docTitle, meta, y, '5x5 Scoring Matrix Rule', data.scoringMatrixRule);

      const scoreBand = (score: number) =>
        score >= 16 ? 'CRITICAL' : score >= 10 ? 'HIGH' : score >= 5 ? 'MEDIUM' : 'LOW';

      y = drawDataTable(
        pdf,
        company,
        docTitle,
        meta,
        y,
        [
          { header: 'ID & Domain', weight: 1.4 },
          { header: 'Process & Risk / Threat', weight: 2.1 },
          { header: 'Inherent (L×S)', weight: 1.0 },
          { header: 'Existing & Planned Mitigation', weight: 2.3 },
          { header: 'Residual (L×S)', weight: 1.0 },
          { header: 'Owner & Status', weight: 1.3 }
        ],
        data.rows.map((r) => {
          const inh = r.inherentLikelihood * r.inherentSeverity;
          const res = r.residualLikelihood * r.residualSeverity;
          return [
            `${r.riskCode}\n${r.domain}`,
            `${r.processOrArea}: ${r.riskOrOpportunity}\nImpact: ${r.potentialImpact}`,
            `${r.inherentLikelihood}×${r.inherentSeverity}=${inh}\n(${scoreBand(inh)})`,
            `Existing: ${r.existingControls}\nAction: ${r.mitigationActionPlan}`,
            `${r.residualLikelihood}×${r.residualSeverity}=${res}\n(${scoreBand(res)})`,
            `${r.owner}\n${r.reviewStatus} (${r.targetDate})`
          ];
        })
      );
      break;
    }
  }

  drawApprovalSignOffBlock(pdf, company, meta, y);
  drawFooterAllPages(pdf, company, meta);

  pdf.save(`${meta.docCode}-${safeSlug(company.companyName)}.pdf`);
}

export function downloadQaMasterRegisterPdf(
  company: QaWorkspaceCompanyProfile,
  metaMap: Record<keyof QaModulePayloadMap, QaControlledDocMeta>
): void {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const masterMeta: QaControlledDocMeta = {
    docCode: `${company.docCodePrefix || 'QFS'}-MDR-00`,
    revision: 'Rev 1.0',
    status: 'approved',
    effectiveDate: new Date().toISOString().slice(0, 10),
    reviewCycle: 'Annual',
    standardClause: 'ISO 9001 Cl. 7.5 | FSSC 22000 Cl. 7.5',
    updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
  };

  let y = drawControlledHeader(
    pdf,
    company,
    'Master QMS / FSMS / HACCP Document Control Register',
    masterMeta,
    1
  );

  y = drawParagraphBlock(
    pdf,
    company,
    'Master Document Control Register',
    masterMeta,
    y,
    'Facility Scope & Applicable Standards',
    `${company.scopeStatement}\nFacility Address: ${company.facilityAddress} | Standards: ${(company.standards || []).join(', ')}`
  );

  const rows = QA_MODULE_CATALOG.filter(
    (m) => m.id !== 'company-register' && m.id !== 'classic-templates'
  ).map((m) => {
    const modMeta = metaMap[m.id as keyof QaModulePayloadMap];
    return [
      modMeta?.docCode || `${company.docCodePrefix}-${m.defaultSuffix}`,
      m.fullTitle,
      modMeta?.standardClause || m.standardRef,
      modMeta?.revision || 'Rev 1.0',
      (modMeta?.status || 'approved').toUpperCase(),
      modMeta?.effectiveDate || masterMeta.effectiveDate,
      modMeta?.reviewCycle || 'Annual'
    ];
  });

  y = drawDataTable(
    pdf,
    company,
    'Master Document Control Register',
    masterMeta,
    y,
    [
      { header: 'Doc Code', weight: 1.1 },
      { header: 'Controlled Document Title', weight: 2.5 },
      { header: 'ISO 9001 / FSSC / Codex Clause', weight: 1.8 },
      { header: 'Revision', weight: 0.7 },
      { header: 'Status', weight: 0.8 },
      { header: 'Effective Date', weight: 0.9 },
      { header: 'Review Cycle', weight: 1.0 }
    ],
    rows
  );

  drawApprovalSignOffBlock(pdf, company, masterMeta, y);
  drawFooterAllPages(pdf, company, masterMeta);
  pdf.save(`${masterMeta.docCode}-${safeSlug(company.companyName)}.pdf`);
}

export function downloadQaModuleCsv(
  company: QaWorkspaceCompanyProfile,
  docCode: string,
  title: string,
  headers: string[],
  rows: string[][]
): void {
  const esc = (v: string) => `"${(v || '').replace(/"/g, '""')}"`;
  const lines = [
    `"Company","${company.companyName.replace(/"/g, '""')}","Document Code","${docCode}"`,
    `"Document Title","${title.replace(/"/g, '""')}","Prepared By","${company.preparedBy.replace(/"/g, '""')}"`,
    '',
    headers.map(esc).join(','),
    ...rows.map((r) => r.map(esc).join(','))
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${docCode}-${safeSlug(company.companyName)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
