import { UserProfile, CvTemplateId } from '../types';

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildCvHtmlDocument(profile: UserProfile, templateId: CvTemplateId): string {
  const safeName = escapeHtml(profile.fullName || 'Food Specialist');
  const safeTitle = escapeHtml(profile.professionalTitle);
  const safeEmail = escapeHtml(profile.email);
  const safePhone = escapeHtml(profile.phone);
  const safeLocation = escapeHtml(profile.location);
  const safeLinkedin = escapeHtml(profile.linkedin);
  const safeSummary = escapeHtml(profile.summary);

  const baseStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Public+Sans:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.5;
      font-size: 13px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, h3, h4 {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .page {
      max-width: 820px;
      margin: 0 auto;
      padding: 28px 32px;
      background: #ffffff;
    }
    @media print {
      body { background: #ffffff; }
      .page { padding: 14px; max-width: 100%; }
    }
  `;

  if (templateId === 'modern-clean') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${safeName} — Curriculum Vitae</title>
  <style>
    ${baseStyles}
    .grid-modern { display: grid; grid-template-columns: 240px 1fr; gap: 28px; }
    .sidebar { background: #1e293b; color: #f8fafc; padding: 24px 20px; border-radius: 10px; }
    .avatar { width: 88px; height: 88px; border-radius: 12px; object-fit: cover; border: 2px solid #10b981; margin-bottom: 14px; background: #0f172a; }
    .side-heading { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #34d399; margin: 18px 0 8px; border-bottom: 1px solid #334155; padding-bottom: 4px; }
    .contact-line { font-size: 11.5px; color: #cbd5e1; margin-bottom: 6px; word-break: break-word; }
    .skill-item { font-size: 11.5px; color: #e2e8f0; padding: 3px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
    .main-title { font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.2; }
    .sub-title { font-size: 13.5px; font-weight: 600; color: #059669; margin-top: 4px; margin-bottom: 12px; }
    .summary { font-size: 12.5px; color: #334155; margin-bottom: 18px; }
    .sec-title { font-size: 13px; font-weight: 700; color: #0f172a; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin: 16px 0 10px; text-transform: uppercase; letter-spacing: 0.04em; }
    .item { margin-bottom: 12px; }
    .item-head { display: flex; justify-content: space-between; align-items: baseline; font-weight: 600; color: #0f172a; font-size: 13px; }
    .item-meta { font-size: 11.5px; color: #059669; font-weight: 500; margin-bottom: 3px; }
    .item-desc { font-size: 12px; color: #475569; }
  </style>
</head>
<body>
  <div class="page">
    <div class="grid-modern">
      <div class="sidebar">
        ${profile.avatarUrl ? `<img class="avatar" src="${profile.avatarUrl}" alt="${safeName}" />` : ''}
        <div class="side-heading">Contact Details</div>
        <div class="contact-line">${safeEmail}</div>
        <div class="contact-line">${safePhone}</div>
        <div class="contact-line">${safeLocation}</div>
        <div class="contact-line">${safeLinkedin}</div>

        <div class="side-heading">Core Competencies</div>
        ${profile.skills.map((s) => `<div class="skill-item">· ${escapeHtml(s)}</div>`).join('')}

        <div class="side-heading">Education</div>
        ${profile.education
          .map(
            (e) => `
          <div style="margin-bottom: 10px;">
            <div style="font-weight: 600; font-size: 12px; color: #ffffff;">${escapeHtml(e.degree)}</div>
            <div style="font-size: 11px; color: #cbd5e1;">${escapeHtml(e.institution)}</div>
            <div style="font-size: 11px; color: #34d399;">${escapeHtml(e.graduationYear)} · CGPA ${escapeHtml(e.cgpa)}</div>
          </div>`
          )
          .join('')}
      </div>

      <div>
        <h1 class="main-title">${safeName}</h1>
        <div class="sub-title">${safeTitle}</div>
        <p class="summary">${safeSummary}</p>

        <div class="sec-title">Food Industry Experience</div>
        ${profile.experience
          .map(
            (exp) => `
          <div class="item">
            <div class="item-head">
              <span>${escapeHtml(exp.jobTitle)}</span>
              <span style="font-size:11.5px; color:#64748b;">${escapeHtml(exp.duration)}</span>
            </div>
            <div class="item-meta">${escapeHtml(exp.company)} · ${escapeHtml(exp.sector)}</div>
            <div class="item-desc">${escapeHtml(exp.responsibilities)}</div>
          </div>`
          )
          .join('')}

        <div class="sec-title">Certifications & Food Safety Credentials</div>
        ${profile.certifications
          .map(
            (c) => `
          <div class="item" style="margin-bottom: 8px;">
            <div class="item-head">
              <span>${escapeHtml(c.name)}</span>
              <span style="font-size:11.5px; color:#64748b;">${escapeHtml(c.year)}</span>
            </div>
            <div class="item-desc">${escapeHtml(c.issuingBody)} · ID: ${escapeHtml(c.credentialId)}</div>
          </div>`
          )
          .join('')}

        <div class="sec-title">Industrial & Research Projects</div>
        ${profile.projects
          .map(
            (p) => `
          <div class="item">
            <div class="item-head">
              <span>${escapeHtml(p.title)}</span>
              <span style="font-size:11.5px; color:#64748b;">${escapeHtml(p.year)}</span>
            </div>
            <div class="item-meta">${escapeHtml(p.role)}</div>
            <div class="item-desc">${escapeHtml(p.outcomes)}</div>
          </div>`
          )
          .join('')}
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  if (templateId === 'ats-standard') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${safeName} — Curriculum Vitae</title>
  <style>
    ${baseStyles}
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
    .name { font-size: 24px; font-weight: 700; color: #0f172a; }
    .role { font-size: 14px; font-weight: 600; color: #334155; margin-top: 2px; }
    .meta { font-size: 12px; color: #475569; margin-top: 6px; }
    .sec-head { font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin: 16px 0 8px; }
    .row { margin-bottom: 10px; }
    .row-top { display: flex; justify-content: space-between; font-weight: 600; font-size: 13px; color: #0f172a; }
    .row-sub { font-size: 12px; color: #334155; font-weight: 500; margin-bottom: 2px; }
    .row-body { font-size: 12px; color: #334155; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="name">${safeName}</div>
      <div class="role">${safeTitle}</div>
      <div class="meta">${safeEmail} · ${safePhone} · ${safeLocation} · ${safeLinkedin}</div>
    </div>

    <div class="sec-head">Professional Summary</div>
    <p class="row-body">${safeSummary}</p>

    <div class="sec-head">Core Food Safety & Quality Competencies</div>
    <p class="row-body">${profile.skills.map((s) => escapeHtml(s)).join(' · ')}</p>

    <div class="sec-head">Certifications & Auditor Licenses</div>
    ${profile.certifications
      .map(
        (c) => `
      <div class="row" style="margin-bottom:6px;">
        <div class="row-top">
          <span>${escapeHtml(c.name)} — ${escapeHtml(c.issuingBody)}</span>
          <span>${escapeHtml(c.year)} (Credential: ${escapeHtml(c.credentialId)})</span>
        </div>
      </div>`
      )
      .join('')}

    <div class="sec-head">Professional Experience</div>
    ${profile.experience
      .map(
        (exp) => `
      <div class="row">
        <div class="row-top">
          <span>${escapeHtml(exp.jobTitle)} — ${escapeHtml(exp.company)}</span>
          <span>${escapeHtml(exp.duration)}</span>
        </div>
        <div class="row-sub">Sector: ${escapeHtml(exp.sector)}</div>
        <div class="row-body">${escapeHtml(exp.responsibilities)}</div>
      </div>`
      )
      .join('')}

    <div class="sec-head">Key Industrial & Research Projects</div>
    ${profile.projects
      .map(
        (p) => `
      <div class="row">
        <div class="row-top">
          <span>${escapeHtml(p.title)} (${escapeHtml(p.role)})</span>
          <span>${escapeHtml(p.year)}</span>
        </div>
        <div class="row-body">${escapeHtml(p.outcomes)}</div>
      </div>`
      )
      .join('')}

    <div class="sec-head">Education</div>
    ${profile.education
      .map(
        (e) => `
      <div class="row">
        <div class="row-top">
          <span>${escapeHtml(e.degree)} — ${escapeHtml(e.institution)}</span>
          <span>${escapeHtml(e.graduationYear)} · CGPA: ${escapeHtml(e.cgpa)}</span>
        </div>
      </div>`
      )
      .join('')}
  </div>
</body>
</html>`;
  }

  // Executive Specialist Template
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${safeName} — Curriculum Vitae</title>
  <style>
    ${baseStyles}
    .exec-banner { background: #0f172a; color: #ffffff; padding: 24px 28px; border-radius: 8px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
    .exec-name { font-size: 24px; font-weight: 700; color: #ffffff; }
    .exec-title { font-size: 13.5px; color: #34d399; font-weight: 600; margin-top: 4px; }
    .exec-contact { font-size: 11.5px; color: #cbd5e1; margin-top: 8px; }
    .cert-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 18px; margin-bottom: 18px; }
    .cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
    .sec-head { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #059669; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin: 16px 0 10px; }
    .item { margin-bottom: 12px; }
    .item-top { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; color: #0f172a; }
    .item-sub { font-size: 12px; color: #059669; font-weight: 600; margin-bottom: 3px; }
    .item-body { font-size: 12px; color: #334155; }
  </style>
</head>
<body>
  <div class="page">
    <div class="exec-banner">
      <div>
        <div class="exec-name">${safeName}</div>
        <div class="exec-title">${safeTitle}</div>
        <div class="exec-contact">${safeEmail} · ${safePhone} · ${safeLocation} · ${safeLinkedin}</div>
      </div>
    </div>

    <div class="cert-box">
      <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#0f172a;">
        Accredited Food Safety & Quality Certifications
      </div>
      <div class="cert-grid">
        ${profile.certifications
          .map(
            (c) => `
          <div>
            <div style="font-weight:600; font-size:12px; color:#0f172a;">${escapeHtml(c.name)}</div>
            <div style="font-size:11px; color:#475569;">${escapeHtml(c.issuingBody)} · ${escapeHtml(c.year)} (${escapeHtml(c.credentialId)})</div>
          </div>`
          )
          .join('')}
      </div>
    </div>

    <div class="sec-head">Executive Profile</div>
    <p class="item-body">${safeSummary}</p>

    <div class="sec-head">Leadership & Audit Experience</div>
    ${profile.experience
      .map(
        (exp) => `
      <div class="item">
        <div class="item-top">
          <span>${escapeHtml(exp.jobTitle)} — ${escapeHtml(exp.company)}</span>
          <span>${escapeHtml(exp.duration)}</span>
        </div>
        <div class="item-sub">${escapeHtml(exp.sector)}</div>
        <div class="item-body">${escapeHtml(exp.responsibilities)}</div>
      </div>`
      )
      .join('')}

    <div class="sec-head">Industrial Process & Compliance Projects</div>
    ${profile.projects
      .map(
        (p) => `
      <div class="item">
        <div class="item-top">
          <span>${escapeHtml(p.title)}</span>
          <span>${escapeHtml(p.year)}</span>
        </div>
        <div class="item-sub">${escapeHtml(p.role)}</div>
        <div class="item-body">${escapeHtml(p.outcomes)}</div>
      </div>`
      )
      .join('')}

    <div class="sec-head">Academic Credentials & Technical Competencies</div>
    ${profile.education
      .map(
        (e) => `
      <div class="item" style="margin-bottom:6px;">
        <div class="item-top">
          <span>${escapeHtml(e.degree)} — ${escapeHtml(e.institution)}</span>
          <span>${escapeHtml(e.graduationYear)} · CGPA ${escapeHtml(e.cgpa)}</span>
        </div>
      </div>`
      )
      .join('')}
    <div style="margin-top:8px; font-size:12px; color:#334155;">
      <strong>Technical Domains:</strong> ${profile.skills.map((s) => escapeHtml(s)).join(' · ')}
    </div>
  </div>
</body>
</html>`;
}

export function triggerCvPdfPrint(profile: UserProfile, templateId: CvTemplateId): void {
  const htmlContent = buildCvHtmlDocument(profile, templateId);
  const existingFrame = document.getElementById('cv-print-iframe') as HTMLIFrameElement | null;
  if (existingFrame) {
    existingFrame.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'cv-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(htmlContent);
    doc.close();
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        // Fallback to direct file download if sandboxed iframe restricts print
        downloadCvStandaloneFile(profile, templateId);
      }
    }, 350);
  } else {
    downloadCvStandaloneFile(profile, templateId);
  }
}

export function downloadCvStandaloneFile(profile: UserProfile, templateId: CvTemplateId): void {
  const htmlContent = buildCvHtmlDocument(profile, templateId);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = (profile.fullName || 'food-specialist')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  a.href = url;
  a.download = `${slug}-cv-${templateId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
