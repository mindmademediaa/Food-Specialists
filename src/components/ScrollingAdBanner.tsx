import React from 'react';
import { Megaphone, Sparkles, ExternalLink, Award, ArrowRight } from 'lucide-react';
import { CustomAdBannerItem } from '../types/hub';

export const DEFAULT_SCROLLING_AD_BANNERS: CustomAdBannerItem[] = [
  {
    id: 'default-ad-haccp-l3',
    badgeText: 'UPCOMING TRAINING',
    headline:
      'Highfield Level 3 Award in HACCP for Food Manufacturing & Catering — New Batch Starting 1st of Next Month!',
    subtext: 'Official QR-Verified Certificate & Study Material Included',
    ctaLabel: 'Enroll / Details',
    linkUrl: '?section=trainings&course=cert-2026-haccp-level-03',
    theme: 'navy-amber',
    isActive: true,
    createdAt: '2026-11-12T10:00:00Z'
  },
  {
    id: 'default-ad-cdm-cert',
    badgeText: 'FEATURED CREDENTIAL',
    headline:
      'Certified Dietary Manager (CDM) & ISO 22000 / FSSC 22000 Lead Auditor Preparation — Free Course Study & 40-MCQ Exam Open Now!',
    subtext: 'Save 25% on Official Certificate Bundles',
    ctaLabel: 'View Bundles',
    linkUrl: '?section=trainings',
    theme: 'royal-blue',
    isActive: true,
    createdAt: '2026-11-12T10:05:00Z'
  }
];

interface ScrollingAdBannerProps {
  ads?: CustomAdBannerItem[];
  showAds?: boolean;
  scrollSpeedSeconds?: number;
  onNavigateInternal?: (url: string) => void;
}

export const ScrollingAdBanner: React.FC<ScrollingAdBannerProps> = ({
  ads,
  showAds = true,
  scrollSpeedSeconds = 32,
  onNavigateInternal
}) => {
  if (showAds === false) return null;

  const sourceAds = Array.isArray(ads) ? ads : DEFAULT_SCROLLING_AD_BANNERS;
  const activeAds = sourceAds.filter((a) => a && a.isActive !== false && a.headline?.trim());

  if (activeAds.length === 0) return null;

  const durationSec = Math.max(14, Math.min(90, Number(scrollSpeedSeconds) || 32));

  const handleAdClick = (ad: CustomAdBannerItem) => {
    const rawLink = (ad.linkUrl || '').trim();
    if (!rawLink) return;
    if (rawLink.startsWith('?') && onNavigateInternal) {
      onNavigateInternal(rawLink);
      return;
    }
    if (/^https?:\/\//i.test(rawLink)) {
      window.open(rawLink, '_blank', 'noopener,noreferrer');
      return;
    }
    if (onNavigateInternal) {
      onNavigateInternal(rawLink);
    }
  };

  // Duplicate activeAds so the right-to-left ticker loops seamlessly
  const tickerItems = [...activeAds, ...activeAds];

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-[#0C182D] via-[#104A7F] to-[#1673B8] text-white border border-[#1673B8]/50 shadow-sm overflow-hidden">
      <style>{`
        @keyframes fspMarqueeRtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .fsp-marquee-track {
          display: flex;
          width: max-content;
          animation: fspMarqueeRtl ${durationSec}s linear infinite;
        }
        .fsp-marquee-track:hover,
        .fsp-marquee-track:active {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex items-center min-h-[42px] sm:min-h-[46px] px-2.5 sm:px-3.5 py-1.5 gap-2.5">
        {/* Left Fixed Pin Badge */}
        <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-400 text-[#0C182D] text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-2xs">
          <Megaphone className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
          <span className="hidden xs:inline"> Announcement</span>
          <span className="xs:hidden">Live</span>
        </div>

        {/* Scrolling Right-to-Left Ticker Viewport */}
        <div className="flex-1 overflow-hidden relative">
          <div className="fsp-marquee-track items-center gap-8 sm:gap-12 pr-8">
            {tickerItems.map((ad, idx) => (
              <div
                key={`${ad.id}-${idx}`}
                onClick={() => handleAdClick(ad)}
                className={`inline-flex items-center gap-2.5 whitespace-nowrap ${
                  ad.linkUrl ? 'cursor-pointer group' : ''
                }`}
              >
                {ad.bannerImageUrl && (
                  <img
                    src={ad.bannerImageUrl}
                    alt={ad.badgeText || 'Banner'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-white/30 shrink-0"
                  />
                )}

                {ad.badgeText && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/25 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                    <span>{ad.badgeText}</span>
                  </span>
                )}

                <span className="text-xs sm:text-[13px] font-extrabold text-white group-hover:text-amber-200 transition-colors">
                  {ad.headline}
                </span>

                {ad.subtext && (
                  <span className="text-[11px] sm:text-xs font-semibold text-sky-200">
                    • {ad.subtext}
                  </span>
                )}

                {ad.ctaLabel && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-300 group-hover:bg-amber-200 text-[#0C182D] text-[10.5px] font-black transition-colors shadow-2xs">
                    <span>{ad.ctaLabel}</span>
                    {ad.linkUrl?.startsWith('http') ? (
                      <ExternalLink className="w-3 h-3" />
                    ) : (
                      <ArrowRight className="w-3 h-3" />
                    )}
                  </span>
                )}

                <span className="text-sky-300/50 pl-2">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
