import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileImage,
  Loader2,
  Share2,
  X
} from 'lucide-react';
import {
  OfficialCertificatePdfParams,
  downloadOfficialCourseCertificatePdf,
  renderOfficialCourseCertificatePng
} from '../utils/certificatePdfGenerator';
import {
  buildLinkedInAddCertificateUrl,
  buildLinkedInCertificatePostCaption,
  buildLinkedInFeedPostUrl
} from '../lib/pwaNotifications';

export interface LinkedInPostShareTarget {
  certParams: OfficialCertificatePdfParams;
  verifyUrl: string;
}

interface LinkedInPostShareModalProps {
  target: LinkedInPostShareTarget | null;
  onClose: () => void;
}

export const LinkedInPostShareModal: React.FC<LinkedInPostShareModalProps> = ({
  target,
  onClose
}) => {
  const [pngResult, setPngResult] = useState<{
    blob: Blob;
    dataUrl: string;
    fileName: string;
  } | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [postCaption, setPostCaption] = useState('');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [downloadedPng, setDownloadedPng] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!target) {
      setPngResult(null);
      setRenderError(null);
      setDownloadedPng(false);
      setCopiedCaption(false);
      setShareFeedback(null);
      return;
    }

    const { certParams, verifyUrl } = target;
    setPostCaption(
      buildLinkedInCertificatePostCaption({
        courseTitle: certParams.courseTitle,
        certificateNumber: certParams.certificateNumber,
        accreditationStandard: certParams.accreditationStandard,
        scorePercentage: certParams.scorePercentage,
        distinction: certParams.distinction,
        verifyUrl
      })
    );

    let cancelled = false;
    setIsRendering(true);
    setRenderError(null);
    setPngResult(null);

    renderOfficialCourseCertificatePng(certParams, 2.0)
      .then((res) => {
        if (!cancelled) {
          setPngResult(res);
          setIsRendering(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRenderError(
            err instanceof Error
              ? err.message
              : 'Could not render certificate image preview.'
          );
          setIsRendering(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [target]);

  if (!target) return null;

  const { certParams, verifyUrl } = target;

  const triggerPngDownload = () => {
    if (!pngResult) return;
    const url = URL.createObjectURL(pngResult.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = pngResult.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setDownloadedPng(true);
    setShareFeedback(
      'Certificate image downloaded! Attach this PNG inside your LinkedIn post.'
    );
  };

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(postCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const canShareImageFile = (() => {
    if (
      !pngResult ||
      typeof navigator === 'undefined' ||
      typeof navigator.share !== 'function' ||
      typeof navigator.canShare !== 'function'
    ) {
      return false;
    }
    try {
      const testFile = new File([pngResult.blob], pngResult.fileName, {
        type: 'image/png'
      });
      return navigator.canShare({ files: [testFile] });
    } catch {
      return false;
    }
  })();

  const handleNativeMobileShare = async () => {
    if (!pngResult || typeof navigator === 'undefined' || !navigator.share) {
      return;
    }
    try {
      const pngFile = new File([pngResult.blob], pngResult.fileName, {
        type: 'image/png'
      });
      await copyCaption();
      await navigator.share({
        title: `${certParams.courseTitle} — Food Science Portal Certificate`,
        text: postCaption,
        files: [pngFile]
      });
      setShareFeedback(
        'Shared certificate image and caption via your device share sheet.'
      );
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        setShareFeedback(
          'Use "Download Certificate Image (PNG)" below and attach it on LinkedIn.'
        );
      }
    }
  };

  const linkedInFeedUrl = buildLinkedInFeedPostUrl(postCaption);
  const linkedInProfileUrl = buildLinkedInAddCertificateUrl({
    courseTitle: certParams.courseTitle,
    certificateNumber: certParams.certificateNumber,
    issueDate: certParams.issueDate,
    verifyUrl
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0C182D]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-[#D2DEEA] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#0A66C2]">
              LinkedIn Post Composer · Credential {certParams.certificateNumber}
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-[#1A2138] leading-snug mt-0.5">
              Share Certificate as a LinkedIn Post
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Share Modal"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left: Generated Certificate Image Preview */}
          <div className="md:col-span-5 space-y-3">
            <div className="rounded-xl border border-[#D2DEEA] bg-[#F8FAFC] p-2.5 flex flex-col items-center justify-center min-h-[260px]">
              {isRendering ? (
                <div className="py-12 flex flex-col items-center gap-2.5 text-center">
                  <Loader2 className="w-7 h-7 text-[#1673B8] animate-spin" />
                  <p className="text-xs font-semibold text-slate-600">
                    Preparing high-resolution certificate image...
                  </p>
                </div>
              ) : renderError ? (
                <div className="py-8 px-3 text-center space-y-2">
                  <FileImage className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600">{renderError}</p>
                </div>
              ) : pngResult ? (
                <img
                  src={pngResult.dataUrl}
                  alt={`${certParams.courseTitle} Official Certificate`}
                  className="w-full h-auto max-h-[340px] object-contain rounded-lg border border-slate-200 bg-white shadow-2xs"
                />
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!pngResult || isRendering}
                onClick={triggerPngDownload}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                {downloadedPng ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Download className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{downloadedPng ? 'PNG Saved' : 'Save Image (PNG)'}</span>
              </button>
              <button
                type="button"
                onClick={() => downloadOfficialCourseCertificatePdf(certParams)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1A2138] font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Right: LinkedIn Post Caption & Direct Actions */}
          <div className="md:col-span-7 space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="linkedin-post-caption-input"
                  className="text-xs font-bold text-[#1A2138]"
                >
                  LinkedIn Post Text &amp; Verification Link
                </label>
                <button
                  type="button"
                  onClick={copyCaption}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#1A2138] text-[11px] font-bold cursor-pointer transition-colors whitespace-nowrap"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="linkedin-post-caption-input"
                rows={7}
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                className="w-full rounded-xl border border-[#D2DEEA] bg-[#F8FAFC] focus:bg-white focus:border-[#0A66C2] focus:outline-none p-3 text-xs text-[#1A2138] leading-relaxed"
              />
            </div>

            {shareFeedback && (
              <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                {shareFeedback}
              </div>
            )}

            <div className="space-y-2 pt-1">
              {canShareImageFile && (
                <button
                  type="button"
                  onClick={handleNativeMobileShare}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Share2 className="w-4 h-4 shrink-0" />
                  <span>Share Certificate Image to LinkedIn App</span>
                </button>
              )}

              <a
                href={linkedInFeedUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  copyCaption();
                }}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors whitespace-nowrap ${
                  canShareImageFile
                    ? 'bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#0A66C2]/30 text-[#0A66C2]'
                    : 'bg-[#0A66C2] hover:bg-[#004182] text-white'
                }`}
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>Open LinkedIn Post Composer (Pre-Filled Text)</span>
              </a>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                LinkedIn&apos;s browser composer pre-fills your post text and verification link automatically. Save the PNG image on the left and tap LinkedIn&apos;s Photo icon to attach your certificate visual (or use{' '}
                <strong>Share Certificate Image</strong> on mobile).
              </p>

              <div className="pt-1 flex items-center justify-between gap-3 border-t border-slate-100">
                <a
                  href={linkedInProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#0A66C2] hover:underline inline-flex items-center gap-1"
                >
                  <span>Also add to LinkedIn Licenses &amp; Certifications</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1A2138] text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
