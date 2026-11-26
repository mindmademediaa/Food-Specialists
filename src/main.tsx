import {Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {AppLaunchSplash} from './components/AppLaunchSplash';
import {SectionErrorBoundary} from './components/SectionErrorBoundary';
import './index.css';

declare const __APP_BUILD_VERSION__: string;
const APP_BUILD_VERSION =
  typeof __APP_BUILD_VERSION__ !== 'undefined' ? __APP_BUILD_VERSION__ : 'fsp-dev';

declare global {
  interface Window {
    __fspDeferredInstallPrompt?: Event | null;
    __fspAppInstalled?: boolean;
  }
}

async function purgeStaleBrowserCaches(keepVersion?: string): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const keepKey = keepVersion ? `food-science-portal-${keepVersion}` : '';
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => !keepKey || key !== keepKey)
        .map((key) => caches.delete(key).catch(() => false))
    );
  } catch {
    // Ignore cache API restrictions
  }
}

if (typeof window !== 'undefined') {
  // Capture Chrome/Android/Desktop beforeinstallprompt as early as possible before React hydrates
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    window.__fspDeferredInstallPrompt = e;
    window.dispatchEvent(new CustomEvent('fsp-install-prompt-ready'));
  });
  window.addEventListener('appinstalled', () => {
    window.__fspDeferredInstallPrompt = null;
    window.__fspAppInstalled = true;
    window.dispatchEvent(new CustomEvent('fsp-app-installed'));
  });

  // Auto-recover if user clicks a lazy tab right after a fresh GitHub deploy replaced old hashed chunks
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    try {
      const key = 'fsp_chunk_reload_ts';
      const last = Number(window.sessionStorage.getItem(key) || '0');
      if (Date.now() - last > 15000) {
        window.sessionStorage.setItem(key, String(Date.now()));
        purgeStaleBrowserCaches().finally(() => {
          window.location.reload();
        });
      }
    } catch {
      window.location.reload();
    }
  });

  try {
    const isAiStudioPreview =
      window.location.hostname.endsWith('.run.app') || window.self !== window.top;

    const prevVersion = window.localStorage.getItem('fsp_app_build_version');
    if (prevVersion && prevVersion !== APP_BUILD_VERSION) {
      window.localStorage.setItem('fsp_app_build_version', APP_BUILD_VERSION);
      purgeStaleBrowserCaches(APP_BUILD_VERSION);
    } else if (!prevVersion) {
      window.localStorage.setItem('fsp_app_build_version', APP_BUILD_VERSION);
    }

    if ('serviceWorker' in navigator) {
      if (import.meta.env.DEV || isAiStudioPreview) {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => {
            registrations.forEach((reg) => {
              reg.unregister().catch(() => {});
            });
          })
          .catch(() => {});
        if (isAiStudioPreview) {
          purgeStaleBrowserCaches().catch(() => {});
        }
      } else {
        let swReg: ServiceWorkerRegistration | null = null;

        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js', {scope: '/', updateViaCache: 'none'})
            .then((reg) => {
              swReg = reg;
              if (reg.waiting) {
                reg.waiting.postMessage({type: 'SKIP_WAITING'});
              }
              reg.update().catch(() => {});
            })
            .catch(() => {});
        });

        // Silently check for updated Service Worker when returning to an open tab
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible' && swReg) {
            swReg.update().catch(() => {});
          }
        });
      }
    }
  } catch {
    // Ignore storage access errors in restricted webviews
  }
}

createRoot(document.getElementById('root')!).render(
  <>
    <AppLaunchSplash />
    <SectionErrorBoundary sectionName="Food Science Portal">
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <App />
      </Suspense>
    </SectionErrorBoundary>
  </>
);
