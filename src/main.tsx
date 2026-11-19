import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const APP_BUILD_VERSION = 'fsp-2026-11-18-v8';

declare global {
  interface Window {
    __fspDeferredInstallPrompt?: Event | null;
    __fspAppInstalled?: boolean;
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

  try {
    const prevVersion = window.localStorage.getItem('fsp_app_build_version');
    if (prevVersion !== APP_BUILD_VERSION) {
      window.localStorage.setItem('fsp_app_build_version', APP_BUILD_VERSION);
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => {
            caches.delete(key).catch(() => {});
          });
        });
      }
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
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('./sw.js')
            .then((reg) => {
              reg.update().catch(() => {});
            })
            .catch(() => {});
        });
      }
    }
  } catch {
    // Ignore storage access errors in restricted webviews
  }
}

createRoot(document.getElementById('root')!).render(<App />);
