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

/**
 * Generates and downloads a razor-sharp, vector-crisp, executive market-ready PDF CV
 * directly from the user's entered profile information.
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

  const fullName =
    (isVisible(vis?.name) && user.name?.trim()) || 'Food Safety Specialist';
  const roleTitle =
    (isVisible(vis?.title) &&
      (user.title?.trim() || user.currentRole?.trim())) ||
    'Food Safety & Quality Assurance Specialist';
  const companyName =
    isVisible(vis?.company) && user.company?.trim() ? user.company.trim() : '';
  const locationText =
    isVisible(vis?.location) && user.location?.trim()
      ? user.location.trim()
      : '';
  const emailText =
    isVisible(vis?.contact) && user.email?.trim() ? user.email.trim() : '';
  const phoneText =
    isVisible(vis?.contact) && user.phone?.trim() ? user.phone.trim() : '';
  const linkedinText =
    isVisible(vis?.linkedin) && user.linkedinUrl?.trim()
      ? user.linkedinUrl
          .trim()
          .replace(/^https?:\/\/(www\.)?/i, '')
          .replace(/\/$/, '')
      : '';
  const bioText =
    isVisible(vis?.bio) && user.bio?.trim() ? user.bio.trim() : '';

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
  // Top deep forest green executive banner
  doc.setFillColor(13, 46, 27); // #0D2E1B
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Subtle gold/emerald bottom border on header
  doc.setFillColor(217, 119, 6); // #D97706 Gold accent bar
  doc.rect(0, 44, pageWidth, 1.4, 'F');

  // Full Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(fullName.toUpperCase(), marginX, 17);

  // Title & Current Company
  const headlineParts = [roleTitle, companyName].filter(Boolean);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(167, 243, 208); // Soft mint emerald
  doc.text(headlineParts.join('  |  '), marginX, 25);

  // Contact Details Row inside Header
  const contactItems = [
    locationText,
    emailText,
    phoneText,
    linkedinText
  ].filter(Boolean);

  if (contactItems.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(229, 231, 235);
    const contactLine = contactItems.join('   •   ');
    const wrappedContact = doc.splitTextToSize(contactLine, contentWidth);
    doc.text(wrappedContact.slice(0, 2), marginX, 33.5);
  }

  let cursorY = 54;

  const ensureSpace = (neededMm: number) => {
    if (cursorY + neededMm > pageHeight - 16) {
      doc.addPage();
      // Top accent bar on continuation page
      doc.setFillColor(13, 46, 27);
      doc.rect(0, 0, pageWidth, 6, 'F');
      cursorY = 18;
    }
  };

  const drawSectionHeader = (title: string) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(13, 46, 27); // #0D2E1B
    doc.text(title.toUpperCase(), marginX, cursorY);

    // Emerald underline with gold leading segment
    doc.setDrawColor(22, 163, 74); // #16A34A
    doc.setLineWidth(0.6);
    doc.line(marginX, cursorY + 2, pageWidth - marginX, cursorY + 2);

    doc.setDrawColor(217, 119, 6); // #D97706
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
    ensureSpace(lines.length * 4.6 + 4);
    doc.text(lines, marginX, cursorY);
    cursorY += lines.length * 4.6 + 5;
  }

  // ==================== 2. PROFESSIONAL EXPERIENCE ====================
  if (experienceList.length > 0) {
    drawSectionHeader('Professional Experience');

    experienceList.forEach((exp) => {
      ensureSpace(18);
      const jobTitle = exp.jobTitle?.trim() || 'Food Safety & QA Specialist';
      const company = exp.company?.trim() || '';
      const loc = exp.location?.trim() || '';
      const dateStr = exp.startDate
        ? `${exp.startDate} – ${exp.isPresent ? 'Present' : exp.endDate || 'Present'}`
        : exp.isPresent
        ? 'Present'
        : exp.endDate || '';

      // Job Title (Left) & Date (Right)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.8);
      doc.setTextColor(17, 24, 39);
      doc.text(jobTitle, marginX, cursorY);

      if (dateStr) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.2);
        doc.setTextColor(21, 128, 61); // #15803D
        doc.text(dateStr, pageWidth - marginX, cursorY, { align: 'right' });
      }
      cursorY += 4.6;

      // Company & Location
      const subLine = [company, loc].filter(Boolean).join('  •  ');
      if (subLine) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(75, 85, 99);
        doc.text(subLine, marginX, cursorY);
        cursorY += 4.5;
      }

      // Description
      if (exp.description?.trim()) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(55, 65, 81);
        const descLines = doc.splitTextToSize(
          exp.description.trim(),
          contentWidth - 3
        );
        ensureSpace(descLines.length * 4.4 + 3);
        doc.text(descLines, marginX + 2, cursorY);
        cursorY += descLines.length * 4.4 + 2;
      }

      cursorY += 3.5;
    });
  }

  // ==================== 3. EDUCATION & ACADEMIC QUALIFICATIONS ====================
  if (educationList.length > 0) {
    drawSectionHeader('Education & Qualifications');

    educationList.forEach((edu) => {
      ensureSpace(15);
      const degree = edu.degree?.trim() || 'Degree in Food Science & Technology';
      const institute = edu.institute?.trim() || '';
      const years =
        edu.startYear || edu.endYear
          ? `${edu.startYear || ''}${edu.endYear ? ` – ${edu.endYear}` : ''}`
          : '';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(17, 24, 39);
      doc.text(degree, marginX, cursorY);

      if (years) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.2);
        doc.setTextColor(21, 128, 61);
        doc.text(years, pageWidth - marginX, cursorY, { align: 'right' });
      }
      cursorY += 4.5;

      if (institute) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(75, 85, 99);
        doc.text(institute, marginX, cursorY);
        cursorY += 4.4;
      }

      if (edu.description?.trim()) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.3);
        doc.setTextColor(55, 65, 81);
        const eduDesc = doc.splitTextToSize(
          edu.description.trim(),
          contentWidth - 3
        );
        ensureSpace(eduDesc.length * 4.3 + 2);
        doc.text(eduDesc, marginX + 2, cursorY);
        cursorY += eduDesc.length * 4.3 + 1.5;
      }

      cursorY += 3;
    });
  }

  // ==================== 4. CERTIFICATIONS & LICENSES ====================
  if (certificationsList.length > 0) {
    drawSectionHeader('Certifications & Accreditations');

    certificationsList.forEach((cert) => {
      ensureSpace(11);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(`•  ${cert.name}`, marginX, cursorY);

      if (cert.issueDate) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(21, 128, 61);
        doc.text(cert.issueDate, pageWidth - marginX, cursorY, {
          align: 'right'
        });
      }
      cursorY += 4.3;

      const metaParts = [
        cert.issuer ? `Issued by ${cert.issuer}` : '',
        cert.credentialId ? `Credential ID: ${cert.credentialId}` : ''
      ].filter(Boolean);

      if (metaParts.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(75, 85, 99);
        doc.text(metaParts.join('   |   '), marginX + 4, cursorY);
        cursorY += 4.2;
      }

      cursorY += 1.8;
    });
    cursorY += 2;
  }

  // ==================== 5. KEY PROJECTS & ACHIEVEMENTS ====================
  if (projectsList.length > 0) {
    drawSectionHeader('Key Projects & Achievements');

    projectsList.forEach((proj) => {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.2);
      doc.setTextColor(17, 24, 39);
      doc.text(proj.title, marginX, cursorY);

      if (proj.link?.trim()) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(21, 128, 61);
        doc.text(proj.link.trim(), pageWidth - marginX, cursorY, {
          align: 'right'
        });
      }
      cursorY += 4.4;

      if (proj.description?.trim()) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.4);
        doc.setTextColor(55, 65, 81);
        const projLines = doc.splitTextToSize(
          proj.description.trim(),
          contentWidth - 3
        );
        ensureSpace(projLines.length * 4.3 + 2);
        doc.text(projLines, marginX + 2, cursorY);
        cursorY += projLines.length * 4.3 + 1.5;
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
      `${fullName} — Curriculum Vitae • Generated via FS Portal`,
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
