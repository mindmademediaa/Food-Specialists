import { jsPDF } from 'jspdf';
import {
  HubUser,
  HubEducationItem,
  HubExperienceItem,
  HubCertificationItem,
  HubProjectItem
} from '../types/hub';
import {
  normalizeEducationArray,
  normalizeExperienceArray
} from '../components/EditProfileView';
import { drawPdfUserPhoto, fitPdfTextToWidth, sanitizePdfText } from './pdfBranding';

/**
 * Generates and downloads a razor-sharp, vector-crisp, executive market-ready PDF CV
 * directly from the user's entered profile information, complete with the
 * Specialist's Profile Picture (without portal branding).
 */
export function downloadProfessionalCvPdf(
  user: HubUser,
  options?: { respectVisibility?: boolean }
): void {
  const respectVis = options?.respectVisibility ?? false;
  const vis = user.visibility;

  const isVisible = (fieldVal?: string) =>
    !respectVis || fieldVal !== 'private';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const marginX = 16;
  const contentWidth = pageWidth - marginX * 2;

  const fullName = sanitizePdfText(
    (isVisible(vis?.name) && user.name?.trim()) || 'Food Safety Specialist',
    true
  );
  const roleTitle = sanitizePdfText(
    (isVisible(vis?.title) &&
      (user.title?.trim() || user.currentRole?.trim())) ||
      'Food Safety & Quality Assurance Specialist',
    true
  );
  const companyName = sanitizePdfText(
    isVisible(vis?.company) && user.company?.trim() ? user.company.trim() : '',
    true
  );
  const locationText = sanitizePdfText(
    isVisible(vis?.location) && user.location?.trim()
      ? user.location.trim()
      : '',
    true
  );
  const emailText = sanitizePdfText(
    isVisible(vis?.contact) && user.email?.trim() ? user.email.trim() : '',
    true
  );
  const phoneText = sanitizePdfText(
    isVisible(vis?.contact) &&
      (user.whatsappNumber?.trim() || user.phone?.trim())
      ? (user.whatsappNumber?.trim() || user.phone?.trim() || '')
      : '',
    true
  );
  const linkedinText = sanitizePdfText(
    isVisible(vis?.linkedin) && user.linkedinUrl?.trim()
      ? user.linkedinUrl
          .trim()
          .replace(/^https?:\/\/(www\.)?/i, '')
          .replace(/\/$/, '')
      : '',
    true
  );
  const bioText = sanitizePdfText(
    isVisible(vis?.bio) && user.bio?.trim() ? user.bio.trim() : '',
    false
  );

  const rawEdu: HubEducationItem[] = normalizeEducationArray(user);
  const educationList = isVisible(vis?.education)
    ? rawEdu.filter((e) => !respectVis || e.visibility !== 'private')
    : [];

  const rawExp: HubExperienceItem[] = normalizeExperienceArray(user);
  const experienceList = isVisible(vis?.experience)
    ? rawExp.filter((e) => !respectVis || e.visibility !== 'private')
    : [];

  const rawCerts: HubCertificationItem[] = user.certifications || [];
  const certificationsList = isVisible(vis?.certifications)
    ? rawCerts.filter((c) => !respectVis || c.visibility !== 'private')
    : [];

  const rawProjs: HubProjectItem[] = user.projects || [];
  const projectsList = isVisible(vis?.projects)
    ? rawProjs.filter((p) => !respectVis || p.visibility !== 'private')
    : [];

  // ==================== HEADER BANNER ====================
  doc.setFillColor(26, 33, 56); // #1A2138
  doc.rect(0, 0, pageWidth, 44, 'F');

  doc.setFillColor(217, 119, 6); // #D97706 Gold accent bar
  doc.rect(0, 44, pageWidth, 1.4, 'F');

  // Right: Specialist Profile Picture (28mm x 28mm)
  drawPdfUserPhoto(
    doc,
    user.profilePicUrl || user.profilePhotoUrl,
    fullName,
    pageWidth - 44,
    8,
    28,
    {
      borderColor: [186, 230, 253],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    }
  );

  const headerTextX = marginX;
  const headerTextWidth = pageWidth - marginX - 48;

  // Full Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fullName.length > 26 ? 16 : 19);
  doc.setTextColor(255, 255, 255);
  const nameLine = fitPdfTextToWidth(doc, fullName.toUpperCase(), headerTextWidth);
  doc.text(nameLine, headerTextX, 16);

  // Title & Current Company
  const headlineParts = [roleTitle, companyName].filter(Boolean);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.2);
  doc.setTextColor(186, 230, 253);
  const headlineLine = fitPdfTextToWidth(
    doc,
    headlineParts.join(' | '),
    headerTextWidth
  );
  doc.text(headlineLine, headerTextX, 23.5);

  // Contact Details Row inside Header
  const contactItems = [
    locationText,
    emailText,
    phoneText,
    linkedinText
  ].filter(Boolean);

  if (contactItems.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.6);
    doc.setTextColor(229, 231, 235);
    const contactLine = contactItems.join(' | ');
    const wrappedContact = doc.splitTextToSize(contactLine, headerTextWidth);
    doc.text(wrappedContact.slice(0, 2), headerTextX, 31);
  }

  let cursorY = 54;

  const ensureSpace = (neededMm: number) => {
    if (cursorY + neededMm > pageHeight - 19) {
      doc.addPage();
      doc.setFillColor(26, 33, 56);
      doc.rect(0, 0, pageWidth, 14, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text(
        fitPdfTextToWidth(doc, `${fullName} - Curriculum Vitae`, contentWidth),
        marginX,
        9.2
      );
      cursorY = 22;
    }
  };

  const drawSectionHeader = (title: string) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 33, 56);
    doc.text(title.toUpperCase(), marginX, cursorY);

    doc.setDrawColor(22, 115, 184);
    doc.setLineWidth(0.6);
    doc.line(marginX, cursorY + 2, pageWidth - marginX, cursorY + 2);

    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1.1);
    doc.line(marginX, cursorY + 2, marginX + 26, cursorY + 2);

    cursorY += 7.5;
  };

  // ==================== 1. EXECUTIVE SUMMARY / BIO ====================
  if (bioText) {
    drawSectionHeader('Executive Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.8);
    doc.setTextColor(45, 55, 72);
    const lines = doc.splitTextToSize(bioText, contentWidth);
    ensureSpace(Math.min(lines.length * 4.6 + 4, 24));
    lines.forEach((line: string) => {
      ensureSpace(5);
      doc.text(line, marginX, cursorY);
      cursorY += 4.6;
    });
    cursorY += 5;
  }

  // ==================== 2. PROFESSIONAL EXPERIENCE ====================
  if (experienceList.length > 0) {
    drawSectionHeader('Professional Experience');

    experienceList.forEach((exp) => {
      const jobTitle = sanitizePdfText(
        exp.jobTitle?.trim() || 'Food Safety & QA Specialist',
        true
      );
      const company = sanitizePdfText(exp.company?.trim() || '', true);
      const loc = sanitizePdfText(exp.location?.trim() || '', true);
      const dateStr = sanitizePdfText(
        exp.startDate
          ? `${exp.startDate} - ${exp.isPresent ? 'Present' : exp.endDate || 'Present'}`
          : exp.isPresent
          ? 'Present'
          : exp.endDate || '',
        true
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2);
      const rightW = dateStr ? Math.min(contentWidth * 0.42, doc.getTextWidth(dateStr) + 6) : 0;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.6);
      const titleLines = doc.splitTextToSize(jobTitle, contentWidth - rightW);

      ensureSpace(titleLines.length * 4.6 + 10);

      doc.setTextColor(17, 24, 39);
      doc.text(titleLines, marginX, cursorY);

      if (dateStr) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.2);
        doc.setTextColor(22, 115, 184);
        doc.text(
          fitPdfTextToWidth(doc, dateStr, Math.max(20, rightW - 2)),
          pageWidth - marginX,
          cursorY,
          { align: 'right' }
        );
      }
      cursorY += titleLines.length * 4.6 + 0.4;

      const subLine = [company, loc].filter(Boolean).join(' | ');
      if (subLine) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.4);
        doc.setTextColor(75, 85, 99);
        const subWrapped = doc.splitTextToSize(subLine, contentWidth);
        ensureSpace(subWrapped.length * 4.3 + 2);
        doc.text(subWrapped, marginX, cursorY);
        cursorY += subWrapped.length * 4.3 + 0.5;
      }

      if (exp.description?.trim()) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.4);
        doc.setTextColor(55, 65, 81);
        const descLines = doc.splitTextToSize(
          sanitizePdfText(exp.description.trim()),
          contentWidth - 3
        );
        descLines.forEach((line: string) => {
          ensureSpace(4.6);
          doc.text(line, marginX + 2, cursorY);
          cursorY += 4.4;
        });
        cursorY += 2;
      }

      cursorY += 3.2;
    });
  }

  // ==================== 3. EDUCATION & ACADEMIC QUALIFICATIONS ====================
  if (educationList.length > 0) {
    drawSectionHeader('Education & Qualifications');

    educationList.forEach((edu) => {
      const degree = sanitizePdfText(
        edu.degree?.trim() || 'Degree in Food Science & Technology',
        true
      );
      const institute = sanitizePdfText(edu.institute?.trim() || '', true);
      const years = sanitizePdfText(
        edu.startYear || edu.endYear
          ? `${edu.startYear || ''}${edu.endYear ? ` - ${edu.endYear}` : ''}`
          : '',
        true
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.2);
      const rightW = years ? Math.min(contentWidth * 0.38, doc.getTextWidth(years) + 6) : 0;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      const degLines = doc.splitTextToSize(degree, contentWidth - rightW);

      ensureSpace(degLines.length * 4.5 + 10);

      doc.setTextColor(17, 24, 39);
      doc.text(degLines, marginX, cursorY);

      if (years) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.2);
        doc.setTextColor(22, 115, 184);
        doc.text(
          fitPdfTextToWidth(doc, years, Math.max(20, rightW - 2)),
          pageWidth - marginX,
          cursorY,
          { align: 'right' }
        );
      }
      cursorY += degLines.length * 4.5 + 0.4;

      if (institute) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.4);
        doc.setTextColor(75, 85, 99);
        const instLines = doc.splitTextToSize(institute, contentWidth);
        ensureSpace(instLines.length * 4.3 + 2);
        doc.text(instLines, marginX, cursorY);
        cursorY += instLines.length * 4.3 + 0.4;
      }

      if (edu.description?.trim()) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.2);
        doc.setTextColor(55, 65, 81);
        const eduDesc = doc.splitTextToSize(
          sanitizePdfText(edu.description.trim()),
          contentWidth - 3
        );
        eduDesc.forEach((line: string) => {
          ensureSpace(4.5);
          doc.text(line, marginX + 2, cursorY);
          cursorY += 4.3;
        });
        cursorY += 1.5;
      }

      cursorY += 3;
    });
  }

  // ==================== 4. CERTIFICATIONS & LICENSES ====================
  if (certificationsList.length > 0) {
    drawSectionHeader('Certifications & Accreditations');

    certificationsList.forEach((cert) => {
      const certName = sanitizePdfText(cert.name || 'Certification', true);
      const issueDate = sanitizePdfText(cert.issueDate || '', true);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      const rightW = issueDate ? Math.min(contentWidth * 0.35, doc.getTextWidth(issueDate) + 6) : 0;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      const certLines = doc.splitTextToSize(`- ${certName}`, contentWidth - rightW);

      ensureSpace(certLines.length * 4.3 + 7);
      doc.setTextColor(17, 24, 39);
      doc.text(certLines, marginX, cursorY);

      if (issueDate) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(22, 115, 184);
        doc.text(
          fitPdfTextToWidth(doc, issueDate, Math.max(18, rightW - 2)),
          pageWidth - marginX,
          cursorY,
          { align: 'right' }
        );
      }
      cursorY += certLines.length * 4.3 + 0.3;

      const metaParts = [
        cert.issuer ? `Issued by ${sanitizePdfText(cert.issuer, true)}` : '',
        cert.credentialId
          ? `Credential ID: ${sanitizePdfText(cert.credentialId, true)}`
          : ''
      ].filter(Boolean);

      if (metaParts.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(75, 85, 99);
        const metaLines = doc.splitTextToSize(
          metaParts.join(' | '),
          contentWidth - 4
        );
        ensureSpace(metaLines.length * 4.2 + 2);
        doc.text(metaLines, marginX + 4, cursorY);
        cursorY += metaLines.length * 4.2;
      }

      cursorY += 1.8;
    });
    cursorY += 2;
  }

  // ==================== 5. KEY PROJECTS & ACHIEVEMENTS ====================
  if (projectsList.length > 0) {
    drawSectionHeader('Key Projects & Achievements');

    projectsList.forEach((proj) => {
      const projTitle = sanitizePdfText(proj.title || 'Project', true);
      const linkText = sanitizePdfText(proj.link?.trim() || '', true);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const rightW = linkText
        ? Math.min(contentWidth * 0.42, doc.getTextWidth(linkText) + 6)
        : 0;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.2);
      const titleLines = doc.splitTextToSize(projTitle, contentWidth - rightW);

      ensureSpace(titleLines.length * 4.4 + 8);
      doc.setTextColor(17, 24, 39);
      doc.text(titleLines, marginX, cursorY);

      if (linkText) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(22, 115, 184);
        doc.text(
          fitPdfTextToWidth(doc, linkText, Math.max(20, rightW - 2)),
          pageWidth - marginX,
          cursorY,
          { align: 'right' }
        );
      }
      cursorY += titleLines.length * 4.4 + 0.3;

      if (proj.description?.trim()) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.4);
        doc.setTextColor(55, 65, 81);
        const projLines = doc.splitTextToSize(
          sanitizePdfText(proj.description.trim()),
          contentWidth - 3
        );
        projLines.forEach((line: string) => {
          ensureSpace(4.5);
          doc.text(line, marginX + 2, cursorY);
          cursorY += 4.3;
        });
        cursorY += 1.5;
      }

      cursorY += 2.5;
    });
  }

  // ==================== FOOTER ON ALL PAGES ====================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 11, pageWidth - marginX, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(
      fitPdfTextToWidth(doc, `${fullName} - Curriculum Vitae`, contentWidth - 28),
      marginX,
      pageHeight - 6.8
    );
    doc.text(
      `Page ${p} of ${totalPages}`,
      pageWidth - marginX,
      pageHeight - 6.8,
      { align: 'right' }
    );
  }

  const safeName = fullName
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  doc.save(`${safeName || 'Specialist'}_Professional_CV.pdf`);
}
