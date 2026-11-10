import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const APP_BUILD_VERSION = 'fsp-2026-11-10-v3';

if (typeof window !== 'undefined') {
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
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('./sw.js')
          .then((reg) => {
            reg.update().catch(() => {});
          })
          .catch(() => {});
      });
    }
  } catch {
    // Ignore storage access errors in restricted webviews
  }
}

createRoot(document.getElementById('root')!).render(<App />);


