import React, { useEffect, useState } from 'react';
import { SPLASH_LOGO_LAYERS } from '../lib/splashLogoLayers';

const SPLASH_SESSION_KEY = 'fsp_launch_splash_seen_v1';
const ANIMATION_DURATION_MS = 2800;
const FADE_OUT_MS = 380;

function shouldShowLaunchSplash(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SPLASH_SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}

export const AppLaunchSplash: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(() => shouldShowLaunchSplash());
  const [fadingOut, setFadingOut] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;

    try {
      window.sessionStorage.setItem(SPLASH_SESSION_KEY, '1');
    } catch {
      // Ignore storage access errors in restricted webviews
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fadeDelay = prefersReducedMotion ? 500 : ANIMATION_DURATION_MS;

    const fadeTimer = window.setTimeout(() => {
      setFadingOut(true);
    }, fadeDelay);

    const unmountTimer = window.setTimeout(() => {
      setVisible(false);
    }, fadeDelay + FADE_OUT_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Food Science Portal loading"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white select-none overflow-hidden transition-opacity duration-[380ms] ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle brand ambient glow */}
      <div
        aria-hidden="true"
        className="fsp-splash-glow pointer-events-none absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full"
      />

      {/* Exact 640:231 authentic logo stage — Style 2: 3D Rotate Combine, Smooth 2.8s, Single-Play */}
      <div className="fsp-splash-stage relative w-[min(82vw,340px)] sm:w-[min(68vw,400px)] overflow-visible">
        <img
          src={SPLASH_LOGO_LAYERS.fNavy}
          alt=""
          aria-hidden="true"
          decoding="sync"
          className="fsp-splash-layer fsp-splash-f-navy pointer-events-none absolute inset-0 w-full h-full object-contain"
        />
        <img
          src={SPLASH_LOGO_LAYERS.fBlue}
          alt=""
          aria-hidden="true"
          decoding="sync"
          className="fsp-splash-layer fsp-splash-f-blue pointer-events-none absolute inset-0 w-full h-full object-contain"
        />
        <img
          src={SPLASH_LOGO_LAYERS.wordFood}
          alt=""
          aria-hidden="true"
          decoding="sync"
          className="fsp-splash-layer fsp-splash-word-food pointer-events-none absolute inset-0 w-full h-full object-contain"
        />
        <img
          src={SPLASH_LOGO_LAYERS.wordScience}
          alt=""
          aria-hidden="true"
          decoding="sync"
          className="fsp-splash-layer fsp-splash-word-science pointer-events-none absolute inset-0 w-full h-full object-contain"
        />
        <img
          src={SPLASH_LOGO_LAYERS.wordPortal}
          alt="Food Science Portal"
          decoding="sync"
          className="fsp-splash-layer fsp-splash-word-portal pointer-events-none absolute inset-0 w-full h-full object-contain"
        />
        <div
          aria-hidden="true"
          className="fsp-splash-sheen pointer-events-none absolute -inset-x-[10%] -inset-y-[12%]"
        />
      </div>

      {/* Slim brand progress indicator */}
      <div
        aria-hidden="true"
        className="fsp-splash-track absolute bottom-14 sm:bottom-16 w-32 h-[3px] rounded-full bg-slate-200 overflow-hidden"
      >
        <div className="fsp-splash-bar w-full h-full" />
      </div>
    </div>
  );
};
