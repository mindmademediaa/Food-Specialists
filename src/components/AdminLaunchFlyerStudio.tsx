import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Crown,
  Download,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  Linkedin,
  Megaphone,
  MessageSquare,
  RotateCcw,
  Share2,
  Sparkles,
  Users,
  Wrench
} from 'lucide-react';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';

type FlyerThemeId = 'navy-launch' | 'executive-white' | 'sapphire-modern';
type FlyerFormatId = 'portrait' | 'landscape';

interface AdminLaunchFlyerStudioProps {
  monthlyFeeRs: number;
  yearlyFeeRs: number;
  monthlyFeeUsd?: number;
  yearlyFeeUsd?: number;
  whatsappContact?: string;
  onSetBanner?: (msg: string) => void;
}

const DEFAULT_PORTAL_URL = 'https://foodscienceportal.com';

export const AdminLaunchFlyerStudio: React.FC<AdminLaunchFlyerStudioProps> = ({
  monthlyFeeRs = 100,
  yearlyFeeRs = 900,
  monthlyFeeUsd = 1,
  yearlyFeeUsd = 9,
  whatsappContact = '+92 324 0906384',
  onSetBanner
}) => {
  const [theme, setTheme] = useState<FlyerThemeId>('navy-launch');
  const [format, setFormat] = useState<FlyerFormatId>('portrait');

  const [kicker, setKicker] = useState('OFFICIAL WEBSITE & APP LAUNCH · NOW LIVE');
  const [headline, setHeadline] = useState(
    'Food Science Portal — One Complete Hub for Food Scientists, QA/QC & Students'
  );
  const [subheadline, setSubheadline] = useState(
    'Verified Industry Jobs, Funded Scholarships, 16 Industrial QA/QC Calculators, Exam Prep & Study Materials — All in One Place.'
  );
  const [websiteUrl, setWebsiteUrl] = useState(DEFAULT_PORTAL_URL);
  const [contactLine, setContactLine] = useState(whatsappContact);

  const [freeTitle, setFreeTitle] = useState('FREE FOR ALL USERS');
  const [freePointsText, setFreePointsText] = useState(
    [
      'Daily Verified Food Science, QA/QC & R&D Jobs',
      'Global Fully Funded MSc / PhD Scholarships',
      '100% Free Course Study Materials (13 Tracks)',
      '2,000+ Exam Prep MCQs & Interview Q&A Bank',
      'Live On-Screen Lab, Dairy & Production Calculations'
    ].join('\n')
  );

  const [paidTitle, setPaidTitle] = useState('PAID PREMIUM MEMBERSHIP (ADVANCED WORK)');
  const [paidPointsText, setPaidPointsText] = useState(
    [
      'Company-Branded ISO 9001, FSSC 22000 & HACCP Vault Exports',
      'Unlimited QR Complaint Portal, CAPA Tracking & Signed PDFs',
      'Cloud History Sync, ANOVA Exports & Offline Factory Pack',
      'Verified Specialist Community Profile & Direct Employer Access',
      `Only Rs. ${monthlyFeeRs}/Month (Rs. ${yearlyFeeRs}/Year) in Pakistan · $${monthlyFeeUsd}/Month International`
    ].join('\n')
  );

  const [captionEdited, setCaptionEdited] = useState(false);
  const [customCaption, setCustomCaption] = useState('');
  const [copiedState, setCopiedState] = useState<'caption' | 'link' | 'image' | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);

  const freePoints = freePointsText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
  const paidPoints = paidPointsText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);

  const defaultCaption = `🚀 ${kicker}\n${headline}\n\n${subheadline}\n\nWhat is inside Food Science Portal:\n💼 Verified QA/QC, R&D & Production Jobs\n🎓 Funded International MSc / PhD Scholarships\n🧪 16 Industrial Tools (Pearson Square, ISO 9001/FSSC/HACCP Vault, QR CAPA, OEE, Molarity, FDA/GCC Labels)\n📚 2,000+ Exam Prep MCQs, Interview Q&A & Free Study Materials\n🏅 Accredited HACCP, ISO 22000, FSSC v7 & BRCGS Certifications\n\n🆓 Free Access: Jobs, Scholarships, Study Materials, Exam Practice & On-Screen Calculations\n⭐ Paid Membership (Advanced Cloud, PDFs & Audits): Only Rs. ${monthlyFeeRs}/month (Pakistan) or $${monthlyFeeUsd}/month (International)\n\n🌐 Visit Now: ${websiteUrl}\n📲 Support & Info: ${contactLine}\n\n#FoodSciencePortal #FoodScience #QAQC #FoodSafety #HACCP #ISO22000 #FoodTechJobs #Scholarships #ExamPrep`;

  const activeCaption = captionEdited ? customCaption : defaultCaption;

  const handleResetDefaults = () => {
    setKicker('OFFICIAL WEBSITE & APP LAUNCH · NOW LIVE');
    setHeadline(
      'Food Science Portal — One Complete Hub for Food Scientists, QA/QC & Students'
    );
    setSubheadline(
      'Verified Industry Jobs, Funded Scholarships, 16 Industrial QA/QC Calculators, Exam Prep & Study Materials — All in One Place.'
    );
    setWebsiteUrl(DEFAULT_PORTAL_URL);
    setContactLine(whatsappContact);
    setFreeTitle('FREE FOR ALL USERS');
    setFreePointsText(
      [
        'Daily Verified Food Science, QA/QC & R&D Jobs',
        'Global Fully Funded MSc / PhD Scholarships',
        '100% Free Course Study Materials (13 Tracks)',
        '2,000+ Exam Prep MCQs & Interview Q&A Bank',
        'Live On-Screen Lab, Dairy & Production Calculations'
      ].join('\n')
    );
    setPaidTitle('PAID PREMIUM MEMBERSHIP (ADVANCED WORK)');
    setPaidPointsText(
      [
        'Company-Branded ISO 9001, FSSC 22000 & HACCP Vault Exports',
        'Unlimited QR Complaint Portal, CAPA Tracking & Signed PDFs',
        'Cloud History Sync, ANOVA Exports & Offline Factory Pack',
        'Verified Specialist Community Profile & Direct Employer Access',
        `Only Rs. ${monthlyFeeRs}/Month (Rs. ${yearlyFeeRs}/Year) in Pakistan · $${monthlyFeeUsd}/Month International`
      ].join('\n')
    );
    setCaptionEdited(false);
    setCustomCaption('');
    if (onSetBanner) onSetBanner('Launch Flyer content reset to defaults.');
  };

  const renderFlyerToCanvas = async (): Promise<HTMLCanvasElement> => {
    const isPortrait = format === 'portrait';
    const W = isPortrait ? 1080 : 1200;
    const H = isPortrait ? 1350 : 630;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    const drawRoundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const wrapLines = (
      text: string,
      maxWidth: number,
      font: string,
      maxLines: number
    ): string[] => {
      ctx.font = font;
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let cur = '';
      for (const word of words) {
        const test = cur ? `${cur} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && cur) {
          lines.push(cur);
          cur = word;
          if (lines.length >= maxLines) break;
        } else {
          cur = test;
        }
      }
      if (cur && lines.length < maxLines) lines.push(cur);
      return lines;
    };

    const isLight = theme === 'executive-white';
    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    if (theme === 'navy-launch') {
      bgGrad.addColorStop(0, '#0B162C');
      bgGrad.addColorStop(0.55, '#132A4F');
      bgGrad.addColorStop(1, '#105E9A');
    } else if (theme === 'sapphire-modern') {
      bgGrad.addColorStop(0, '#0E3A5F');
      bgGrad.addColorStop(0.55, '#1673B8');
      bgGrad.addColorStop(1, '#0F766E');
    } else {
      bgGrad.addColorStop(0, '#F8FBFF');
      bgGrad.addColorStop(1, '#EBF4FC');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid lines
    ctx.strokeStyle = isLight
      ? 'rgba(22, 115, 184, 0.06)'
      : 'rgba(255, 255, 255, 0.045)';
    ctx.lineWidth = 1;
    for (let x = 40; x < W; x += 52) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 40; y < H; y += 52) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    const loadLogo = () =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = FS_PORTAL_LOGO_DATA_URI;
      });
    const logoImg = await loadLogo();

    if (isPortrait) {
      // ==================== PORTRAIT 1080x1350 LAUNCH FLYER ====================
      // Header bar with Logo & Launch Kicker
      ctx.fillStyle = '#FFFFFF';
      drawRoundRect(56, 48, 72, 72, 16);
      ctx.fill();
      if (logoImg) {
        ctx.save();
        drawRoundRect(62, 54, 60, 60, 12);
        ctx.clip();
        ctx.drawImage(logoImg, 62, 54, 60, 60);
        ctx.restore();
      }

      ctx.fillStyle = isLight ? '#1673B8' : '#38BDF8';
      ctx.font = '800 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(kicker.toUpperCase().slice(0, 48), 148, 74);

      ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
      ctx.font = '800 28px system-ui, -apple-system, sans-serif';
      ctx.fillText('Food Science Portal', 148, 108);

      // Hero Headline
      const headLines = wrapLines(
        headline,
        960,
        '800 42px system-ui, -apple-system, sans-serif',
        3
      );
      ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
      ctx.font = '800 42px system-ui, -apple-system, sans-serif';
      headLines.forEach((l, i) => ctx.fillText(l, 56, 178 + i * 52));

      const afterHeadY = 178 + headLines.length * 52 + 8;
      const subLines = wrapLines(
        subheadline,
        960,
        '500 22px system-ui, -apple-system, sans-serif',
        2
      );
      ctx.fillStyle = isLight ? '#334155' : '#DBEAFE';
      ctx.font = '500 22px system-ui, -apple-system, sans-serif';
      subLines.forEach((l, i) => ctx.fillText(l, 56, afterHeadY + i * 30));

      // 6 Feature Highlights Bento Grid
      const gridStartY = afterHeadY + subLines.length * 30 + 28;
      const features = [
        { tag: 'CAREERS', title: 'Verified Food Jobs', desc: 'Daily QA/QC, R&D, Production & Food Safety vacancies' },
        { tag: 'FUNDING', title: 'Global Scholarships', desc: 'Erasmus Mundus, DAAD, CSC & MSc/PhD grants' },
        { tag: 'TOOLKIT', title: '16 QA/QC Calculators', desc: 'Pearson Square, ISO/FSSC Vault, QR CAPA & OEE' },
        { tag: 'PREP BANK', title: '2,000+ Exam & Interview', desc: 'MCQ Mock Tests, Food Officer Prep & Audit Q&A' },
        { tag: 'TRAINING', title: 'Free Study Materials', desc: '13 Accredited Courses + QR-Verified Certificates' },
        { tag: 'NETWORK', title: 'Specialist Community', desc: 'Verified profiles, CVs & direct hiring connections' }
      ];

      const cardW = 310;
      const cardH = 128;
      const gapX = 19;
      const gapY = 18;
      features.forEach((feat, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const cx = 56 + col * (cardW + gapX);
        const cy = gridStartY + row * (cardH + gapY);

        ctx.fillStyle = isLight ? '#FFFFFF' : 'rgba(255,255,255,0.09)';
        drawRoundRect(cx, cy, cardW, cardH, 16);
        ctx.fill();
        ctx.strokeStyle = isLight ? '#CBD5E1' : 'rgba(147,197,253,0.28)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = isLight ? '#1673B8' : '#38BDF8';
        ctx.font = '800 13px system-ui, -apple-system, sans-serif';
        ctx.fillText(feat.tag, cx + 18, cy + 28);

        ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
        ctx.font = '800 20px system-ui, -apple-system, sans-serif';
        ctx.fillText(feat.title, cx + 18, cy + 58);

        ctx.fillStyle = isLight ? '#475569' : '#CBD5E1';
        ctx.font = '500 14px system-ui, -apple-system, sans-serif';
        const dLines = wrapLines(
          feat.desc,
          cardW - 36,
          '500 14px system-ui, -apple-system, sans-serif',
          2
        );
        dLines.forEach((dl, di) => ctx.fillText(dl, cx + 18, cy + 84 + di * 20));
      });

      // Free vs Paid Two-Column Comparison Box
      const tierY = gridStartY + 2 * (cardH + gapY) + 22;
      const tierW = 472;
      const tierH = 385;

      // Left Card: FREE TIER
      ctx.fillStyle = isLight ? '#FFFFFF' : 'rgba(16, 185, 129, 0.12)';
      drawRoundRect(56, tierY, tierW, tierH, 20);
      ctx.fill();
      ctx.strokeStyle = isLight ? '#10B981' : 'rgba(52, 211, 153, 0.45)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = isLight ? '#047857' : '#6EE7B7';
      ctx.font = '800 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(freeTitle.slice(0, 34), 80, tierY + 38);

      let fy = tierY + 76;
      freePoints.forEach((pt) => {
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(88, fy - 6, 8, 0, Math.PI * 2);
        ctx.fill();
        const pLines = wrapLines(
          pt,
          tierW - 72,
          '600 17px system-ui, -apple-system, sans-serif',
          2
        );
        ctx.fillStyle = isLight ? '#0F172A' : '#F8FAFC';
        ctx.font = '600 17px system-ui, -apple-system, sans-serif';
        pLines.forEach((pl, pi) => ctx.fillText(pl, 108, fy + pi * 22));
        fy += pLines.length * 23 + 14;
      });

      // Right Card: PAID PREMIUM
      const rightX = 56 + tierW + 24;
      ctx.fillStyle = isLight ? '#EFF6FF' : 'rgba(245, 158, 11, 0.13)';
      drawRoundRect(rightX, tierY, tierW, tierH, 20);
      ctx.fill();
      ctx.strokeStyle = isLight ? '#1673B8' : 'rgba(251, 191, 36, 0.55)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = isLight ? '#105E9A' : '#FCD34D';
      ctx.font = '800 17px system-ui, -apple-system, sans-serif';
      ctx.fillText(paidTitle.slice(0, 36), rightX + 24, tierY + 38);

      let py = tierY + 76;
      paidPoints.forEach((pt) => {
        ctx.fillStyle = isLight ? '#1673B8' : '#FBBF24';
        ctx.beginPath();
        ctx.arc(rightX + 32, py - 6, 8, 0, Math.PI * 2);
        ctx.fill();
        const pLines = wrapLines(
          pt,
          tierW - 72,
          '600 17px system-ui, -apple-system, sans-serif',
          2
        );
        ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
        ctx.font = '600 17px system-ui, -apple-system, sans-serif';
        pLines.forEach((pl, pi) => ctx.fillText(pl, rightX + 52, py + pi * 22));
        py += pLines.length * 23 + 14;
      });

      // Bottom Footer CTA Strip
      const ctaY = H - 150;
      ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
      drawRoundRect(56, ctaY, W - 112, 106, 20);
      ctx.fill();

      ctx.fillStyle = isLight ? '#38BDF8' : '#1673B8';
      ctx.font = '800 15px system-ui, -apple-system, sans-serif';
      ctx.fillText('VISIT THE PORTAL TODAY · DESKTOP & MOBILE READY', 84, ctaY + 36);

      ctx.fillStyle = isLight ? '#FFFFFF' : '#0F172A';
      ctx.font = '800 30px monospace';
      ctx.fillText(websiteUrl.replace(/^https?:\/\//, ''), 84, ctaY + 78);

      ctx.fillStyle = isLight ? '#CBD5E1' : '#475569';
      ctx.font = '700 18px system-ui, -apple-system, sans-serif';
      const waLabel = `WhatsApp: ${contactLine}`;
      const waW = ctx.measureText(waLabel).width;
      ctx.fillText(waLabel, W - 84 - waW, ctaY + 74);
    } else {
      // ==================== LANDSCAPE 1200x630 AD BANNER ====================
      ctx.fillStyle = '#FFFFFF';
      drawRoundRect(48, 36, 56, 56, 14);
      ctx.fill();
      if (logoImg) {
        ctx.save();
        drawRoundRect(52, 40, 48, 48, 10);
        ctx.clip();
        ctx.drawImage(logoImg, 52, 40, 48, 48);
        ctx.restore();
      }

      ctx.fillStyle = isLight ? '#1673B8' : '#38BDF8';
      ctx.font = '800 13px system-ui, -apple-system, sans-serif';
      ctx.fillText(kicker.toUpperCase().slice(0, 50), 118, 56);

      ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
      ctx.font = '800 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('Food Science Portal', 118, 84);

      const hLines = wrapLines(
        headline,
        620,
        '800 32px system-ui, -apple-system, sans-serif',
        3
      );
      ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
      ctx.font = '800 32px system-ui, -apple-system, sans-serif';
      hLines.forEach((l, i) => ctx.fillText(l, 48, 138 + i * 40));

      const afterHY = 138 + hLines.length * 40 + 8;
      const sLines = wrapLines(
        subheadline,
        610,
        '500 16px system-ui, -apple-system, sans-serif',
        2
      );
      ctx.fillStyle = isLight ? '#334155' : '#DBEAFE';
      ctx.font = '500 16px system-ui, -apple-system, sans-serif';
      sLines.forEach((l, i) => ctx.fillText(l, 48, afterHY + i * 22));

      // Bottom CTA box left
      ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
      drawRoundRect(48, 526, 610, 68, 14);
      ctx.fill();
      ctx.fillStyle = isLight ? '#38BDF8' : '#1673B8';
      ctx.font = '800 12px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        `FREE STUDY & TOOLS · PAID MEMBERSHIP RS. ${monthlyFeeRs}/MO OR $${monthlyFeeUsd}/MO`,
        68,
        550
      );
      ctx.fillStyle = isLight ? '#FFFFFF' : '#0F172A';
      ctx.font = '800 22px monospace';
      ctx.fillText(websiteUrl, 68, 578);

      // Right Column: Free vs Paid Summary Card
      const RX = 690;
      const RW = 462;
      ctx.fillStyle = isLight ? '#FFFFFF' : 'rgba(255,255,255,0.1)';
      drawRoundRect(RX, 36, RW, 265, 18);
      ctx.fill();
      ctx.strokeStyle = isLight ? '#10B981' : 'rgba(52, 211, 153, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = isLight ? '#047857' : '#6EE7B7';
      ctx.font = '800 14px system-ui, -apple-system, sans-serif';
      ctx.fillText(freeTitle.slice(0, 36), RX + 20, 68);
      freePoints.slice(0, 4).forEach((pt, idx) => {
        ctx.fillStyle = isLight ? '#0F172A' : '#F8FAFC';
        ctx.font = '600 14px system-ui, -apple-system, sans-serif';
        ctx.fillText(`✓ ${pt.slice(0, 48)}`, RX + 20, 98 + idx * 38);
      });

      ctx.fillStyle = isLight ? '#EFF6FF' : 'rgba(245, 158, 11, 0.14)';
      drawRoundRect(RX, 320, RW, 274, 18);
      ctx.fill();
      ctx.strokeStyle = isLight ? '#1673B8' : 'rgba(251, 191, 36, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = isLight ? '#105E9A' : '#FCD34D';
      ctx.font = '800 14px system-ui, -apple-system, sans-serif';
      ctx.fillText(paidTitle.slice(0, 38), RX + 20, 352);
      paidPoints.slice(0, 4).forEach((pt, idx) => {
        ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
        ctx.font = '600 14px system-ui, -apple-system, sans-serif';
        ctx.fillText(`★ ${pt.slice(0, 48)}`, RX + 20, 384 + idx * 42);
      });
    }

    return canvas;
  };

  const handleDownloadFlyerPng = async () => {
    setIsExporting(true);
    try {
      const canvas = await renderFlyerToCanvas();
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `foodscienceportal-launch-flyer-${format}.png`;
      link.href = url;
      link.click();
      if (onSetBanner) {
        onSetBanner(
          `Downloaded Launch Flyer PNG (${format === 'portrait' ? '1080×1350 Poster' : '1200×630 Ad Banner'}). Ready to share with your users!`
        );
      }
    } catch {
      if (onSetBanner) onSetBanner('Could not export Flyer PNG in this browser.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyFlyerImage = async () => {
    setIsExporting(true);
    try {
      const canvas = await renderFlyerToCanvas();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (
        blob &&
        typeof ClipboardItem !== 'undefined' &&
        navigator.clipboard?.write
      ) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopiedState('image');
        setTimeout(() => setCopiedState(null), 2400);
        if (onSetBanner) {
          onSetBanner(
            'Copied Launch Flyer image to clipboard! Paste directly on WhatsApp Web, LinkedIn, or Facebook.'
          );
        }
      } else {
        await handleDownloadFlyerPng();
      }
    } catch {
      await handleDownloadFlyerPng();
    } finally {
      setIsExporting(false);
    }
  };

  const copyTextSilently = (text: string, type: 'caption' | 'link') => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopiedState(type);
        setTimeout(() => setCopiedState(null), 2200);
        if (onSetBanner) {
          onSetBanner(
            type === 'caption'
              ? 'Copied Launch Advertisement text & portal link!'
              : `Copied Portal URL: ${websiteUrl}`
          );
        }
      })
      .catch(() => {});
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(activeCaption)}`;
  const linkedInShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
    activeCaption
  )}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    websiteUrl
  )}&quote=${encodeURIComponent(activeCaption)}`;

  const isLightTheme = theme === 'executive-white';

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 shadow-xs space-y-5">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D2DEEA] pb-3.5">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-[#1A2138] flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#1673B8]" />
              <span>Website Launch Advertisement &amp; Shareable Flyer Builder</span>
            </h2>
            <p className="text-xs text-[#4A5568] font-medium">
              Customize, download (PNG), and share your official Food Science Portal launch flyer highlighting Jobs, Scholarships, 16 Tools, Exam Prep, Study Materials &amp; Free vs Paid Membership.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-[#F0F6FC] hover:bg-[#DCE9F6] border border-[#D2DEEA] text-[#1A2138] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#1673B8]" />
            <span>Reset Flyer Text</span>
          </button>
        </div>

        {/* Format & Theme Selector Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-extrabold text-[#1A2138] mr-1">
              Flyer Size:
            </span>
            {(
              [
                { id: 'portrait', label: 'Poster Flyer (1080×1350)' },
                { id: 'landscape', label: 'Wide Ad Banner (1200×630)' }
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormat(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                  format === opt.id
                    ? 'bg-[#1673B8] text-white'
                    : 'bg-white text-[#1A2138] hover:bg-[#EBF4FC]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-extrabold text-[#1A2138] mr-1">
              Theme:
            </span>
            {(
              [
                { id: 'navy-launch', label: 'Official Navy' },
                { id: 'sapphire-modern', label: 'Sapphire & Teal' },
                { id: 'executive-white', label: 'Clean White Poster' }
              ] as const
            ).map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setTheme(th.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                  theme === th.id
                    ? 'bg-[#1A2138] text-white'
                    : 'bg-white text-[#1A2138] hover:bg-[#EBF4FC]'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: LIVE FLYER VISUAL PREVIEW */}
          <div className="lg:col-span-7 space-y-3">
            <div
              className={`rounded-[22px] p-5 sm:p-7 border shadow-md space-y-5 ${
                theme === 'navy-launch'
                  ? 'bg-gradient-to-br from-[#0B162C] via-[#132A4F] to-[#105E9A] text-white border-[#105E9A]'
                  : theme === 'sapphire-modern'
                  ? 'bg-gradient-to-br from-[#0E3A5F] via-[#1673B8] to-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-gradient-to-br from-[#F8FBFF] to-[#EBF4FC] text-[#0F172A] border-[#1673B8]/40'
              }`}
            >
              {/* Brand Header */}
              <div className="flex items-center gap-3.5">
                <img
                  src={FS_PORTAL_LOGO_DATA_URI}
                  alt="Food Science Portal Logo"
                  className="w-12 h-12 rounded-xl bg-white p-1 object-contain shadow-xs shrink-0"
                />
                <div>
                  <div
                    className={`text-[11px] font-extrabold tracking-wider ${
                      isLightTheme ? 'text-[#1673B8]' : 'text-sky-300'
                    }`}
                  >
                    {kicker}
                  </div>
                  <div className="text-lg font-extrabold leading-tight">
                    Food Science Portal
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                  {headline}
                </h3>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isLightTheme ? 'text-slate-700' : 'text-sky-100'
                  }`}
                >
                  {subheadline}
                </p>
              </div>

              {/* 6 Feature Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    icon: Briefcase,
                    title: 'Verified Jobs',
                    desc: 'QA/QC, R&D & Food Safety vacancies'
                  },
                  {
                    icon: GraduationCap,
                    title: 'Scholarships',
                    desc: 'Erasmus, DAAD, CSC & PhD grants'
                  },
                  {
                    icon: Wrench,
                    title: '16 Industry Tools',
                    desc: 'Pearson Square, ISO Vault & QR CAPA'
                  },
                  {
                    icon: Award,
                    title: 'Exam Prep Bank',
                    desc: '2,000+ MCQs & 2,000+ Interview Q&A'
                  },
                  {
                    icon: BookOpen,
                    title: 'Study Materials',
                    desc: '13 Free Courses + QR Certificates'
                  },
                  {
                    icon: Users,
                    title: 'Community',
                    desc: 'Verified specialists & hiring CVs'
                  }
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border ${
                        isLightTheme
                          ? 'bg-white border-slate-200'
                          : 'bg-white/10 border-white/15'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 mb-1.5 ${
                          isLightTheme ? 'text-[#1673B8]' : 'text-sky-300'
                        }`}
                      />
                      <div className="text-xs font-extrabold">{card.title}</div>
                      <div
                        className={`text-[10.5px] mt-0.5 leading-snug ${
                          isLightTheme ? 'text-slate-600' : 'text-slate-200'
                        }`}
                      >
                        {card.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Free vs Paid Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={`p-3.5 rounded-2xl border space-y-2 ${
                    isLightTheme
                      ? 'bg-white border-emerald-400'
                      : 'bg-emerald-500/15 border-emerald-300/40'
                  }`}
                >
                  <div
                    className={`text-xs font-extrabold flex items-center gap-1.5 ${
                      isLightTheme ? 'text-emerald-800' : 'text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{freeTitle}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {freePoints.map((pt, idx) => (
                      <li
                        key={idx}
                        className={`text-[11px] font-semibold flex items-start gap-1.5 leading-snug ${
                          isLightTheme ? 'text-slate-800' : 'text-slate-100'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border space-y-2 ${
                    isLightTheme
                      ? 'bg-[#EFF6FF] border-[#1673B8]'
                      : 'bg-amber-400/15 border-amber-300/45'
                  }`}
                >
                  <div
                    className={`text-xs font-extrabold flex items-center gap-1.5 ${
                      isLightTheme ? 'text-[#105E9A]' : 'text-amber-300'
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    <span>{paidTitle}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {paidPoints.map((pt, idx) => (
                      <li
                        key={idx}
                        className={`text-[11px] font-semibold flex items-start gap-1.5 leading-snug ${
                          isLightTheme ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        <Sparkles
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isLightTheme ? 'text-[#1673B8]' : 'text-amber-300'
                          }`}
                        />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer CTA Strip */}
              <div
                className={`p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 ${
                  isLightTheme
                    ? 'bg-[#0F172A] text-white'
                    : 'bg-white text-[#0F172A]'
                }`}
              >
                <div>
                  <div
                    className={`text-[10px] font-extrabold tracking-wide ${
                      isLightTheme ? 'text-sky-300' : 'text-[#1673B8]'
                    }`}
                  >
                    VISIT TODAY · DESKTOP &amp; MOBILE APP
                  </div>
                  <div className="text-sm sm:text-base font-extrabold font-mono">
                    {websiteUrl}
                  </div>
                </div>
                <div className="text-xs font-extrabold">
                  WhatsApp: {contactLine}
                </div>
              </div>
            </div>

            {/* Export Image & Share Bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA]">
              <button
                type="button"
                onClick={handleDownloadFlyerPng}
                disabled={isExporting}
                className="px-4 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isExporting
                    ? 'Rendering High-Res Flyer...'
                    : 'Download Launch Flyer (PNG)'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleCopyFlyerImage}
                disabled={isExporting}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedState === 'image' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Flyer Image Copied!</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 text-[#1673B8]" />
                    <span>Copy Flyer Image</span>
                  </>
                )}
              </button>

              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1673B8] text-xs font-extrabold inline-flex items-center gap-1.5 ml-auto"
              >
                <span>Open Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* RIGHT: EDIT FLYER DETAILS & 1-CLICK SOCIAL SHARE */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-3">
              <div className="text-xs font-extrabold text-[#1A2138]">
                Customize Flyer Content (Updates Preview &amp; Download Instantly)
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                  Launch Badge / Top Label
                </label>
                <input
                  type="text"
                  value={kicker}
                  onChange={(e) => setKicker(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                  Main Flyer Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                  Subheadline Description
                </label>
                <textarea
                  rows={2}
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-medium text-[#1A2138]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                    Website Link
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-mono font-bold text-[#1673B8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1A2138] mb-1">
                    WhatsApp / Contact
                  </label>
                  <input
                    type="text"
                    value={contactLine}
                    onChange={(e) => setContactLine(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-semibold text-[#1A2138]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-800 mb-1">
                  Free Features List (1 per line, max 5)
                </label>
                <textarea
                  rows={4}
                  value={freePointsText}
                  onChange={(e) => setFreePointsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-[11px] font-medium text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#105E9A] mb-1">
                  Paid Premium Membership Highlights (1 per line, max 5)
                </label>
                <textarea
                  rows={4}
                  value={paidPointsText}
                  onChange={(e) => setPaidPointsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-[11px] font-medium text-[#1A2138]"
                />
              </div>
            </div>

            {/* Shareable Launch Post Text */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[#1A2138]">
                  Shareable Launch Post Caption (WhatsApp / LinkedIn / FB)
                </label>
                {captionEdited && (
                  <button
                    type="button"
                    onClick={() => {
                      setCaptionEdited(false);
                      setCustomCaption('');
                    }}
                    className="text-[11px] font-bold text-[#1673B8] hover:underline cursor-pointer"
                  >
                    Auto-Sync
                  </button>
                )}
              </div>
              <textarea
                rows={7}
                value={activeCaption}
                onChange={(e) => {
                  setCaptionEdited(true);
                  setCustomCaption(e.target.value);
                }}
                className="w-full p-3 rounded-xl bg-white border border-[#D2DEEA] text-[11.5px] font-medium text-[#1A2138] leading-relaxed"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => copyTextSilently(activeCaption, 'caption')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </a>

                <a
                  href={linkedInShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => copyTextSilently(activeCaption, 'caption')}
                  className="px-3.5 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>Post on LinkedIn</span>
                </a>

                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => copyTextSilently(activeCaption, 'caption')}
                  className="px-3.5 py-2 rounded-xl bg-[#1877F2] hover:bg-[#0D65D9] text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on Facebook</span>
                </a>

                <button
                  type="button"
                  onClick={() => copyTextSilently(activeCaption, 'caption')}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedState === 'caption' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="w-3.5 h-3.5 text-[#1673B8]" />
                      <span>Copy Post Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
