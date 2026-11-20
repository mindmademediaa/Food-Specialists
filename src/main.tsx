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

async function purgeAllBrowserCaches(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key).catch(() => false)));
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
        purgeAllBrowserCaches().finally(() => {
          window.location.reload();
        });
      }
    } catch {
      window.location.reload();
    }
  });

  try {
    const prevVersion = window.localStorage.getItem('fsp_app_build_version');
    if (prevVersion && prevVersion !== APP_BUILD_VERSION) {
      window.localStorage.setItem('fsp_app_build_version', APP_BUILD_VERSION);
      purgeAllBrowserCaches();
    } else if (!prevVersion) {
      window.localStorage.setItem('fsp_app_build_version', APP_BUILD_VERSION);
    }

    if ('serviceWorker' in navigator) {
      if (import.meta.env.DEV) {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => {
            registrations.forEach((reg) => {
              reg.unregister().catch(() => {});
            });
          })
          .catch(() => {});
      } else {
        let reloadingForUpdate = false;
        const reloadOnceForVersion = (targetVersion: string) => {
          if (reloadingForUpdate) return;
          try {
            if (window.sessionStorage.getItem('fsp_reloaded_for_version') === targetVersion) {
              return;
            }
            window.sessionStorage.setItem('fsp_reloaded_for_version', targetVersion);
          } catch {
            // Ignore sessionStorage restrictions
          }
          reloadingForUpdate = true;
          purgeAllBrowserCaches().finally(() => {
            window.location.reload();
          });
        };

        let swReg: ServiceWorkerRegistration | null = null;
        let lastVersionCheckMs = 0;

        const checkRemoteDeployVersion = async (force = false) => {
          const now = Date.now();
          if (!force && now - lastVersionCheckMs < 45000) return;
          lastVersionCheckMs = now;
          try {
            const res = await fetch(`/version.json?t=${now}`, {
              cache: 'no-store',
              headers: {'Cache-Control': 'no-cache'},
            });
            if (!res.ok) return;
            const data = (await res.json()) as {version?: string};
            if (data?.version && data.version !== APP_BUILD_VERSION) {
              if (swReg) {
                swReg.update().catch(() => {});
                if (swReg.waiting) {
                  swReg.waiting.postMessage({type: 'SKIP_WAITING'});
                }
              }
              reloadOnceForVersion(data.version);
            }
          } catch {
            // Offline or preview without version.json — silently skip
          }
        };

        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js', {scope: '/', updateViaCache: 'none'})
            .then((reg) => {
              swReg = reg;
              if (reg.waiting) {
                reg.waiting.postMessage({type: 'SKIP_WAITING'});
              }
              reg.addEventListener('updatefound', () => {
                const installing = reg.installing;
                if (!installing) return;
                installing.addEventListener('statechange', () => {
                  if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                    installing.postMessage({type: 'SKIP_WAITING'});
                  }
                });
              });
              reg.update().catch(() => {});
            })
            .catch(() => {});

          // Check right after boot in case an older cached HTML booted right as a new deploy landed
          checkRemoteDeployVersion(true);
        });

        // When user switches back to an already-open tab, detect any fresh push immediately (never reloads unless a NEW version deployed)
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            if (swReg) swReg.update().catch(() => {});
            checkRemoteDeployVersion(false);
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
      <App />
    </SectionErrorBoundary>
  </>
);
