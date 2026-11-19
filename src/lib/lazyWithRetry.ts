import React, { lazy, type ComponentType } from 'react';

const CHUNK_RELOAD_SESSION_KEY = 'fsp_lazy_chunk_reload_ts';

function isChunkLoadError(err: unknown): boolean {
  const msg = String(
    err instanceof Error ? `${err.name}: ${err.message}` : err || ''
  ).toLowerCase();
  return (
    msg.includes('failed to fetch dynamically imported module') ||
    msg.includes('importing a module script failed') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('chunkloaderror') ||
    msg.includes('loading chunk') ||
    msg.includes('mime type') ||
    msg.includes('networkerror') ||
    msg.includes('load failed')
  );
}

async function purgeCachesForChunkRecovery(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k).catch(() => false)));
  } catch {
    // Ignore restricted cache APIs
  }
}

/**
 * Resilient React.lazy wrapper that:
 * 1. Retries transient network errors up to 2 times before failing.
 * 2. Detects stale chunk 404/MIME failures right after a fresh GitHub Pages deploy,
 *    purges stale caches, and cleanly reloads once so users never see a blank white screen.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await factory();
      } catch (err) {
        lastError = err;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
        }
      }
    }

    if (typeof window !== 'undefined' && isChunkLoadError(lastError)) {
      try {
        const lastReload = Number(
          window.sessionStorage.getItem(CHUNK_RELOAD_SESSION_KEY) || '0'
        );
        if (Date.now() - lastReload > 15000) {
          window.sessionStorage.setItem(
            CHUNK_RELOAD_SESSION_KEY,
            String(Date.now())
          );
          await purgeCachesForChunkRecovery();
          window.location.reload();
          // Keep Suspense pending while browser reloads so no error flash renders
          return await new Promise<{ default: T }>(() => {});
        }
      } catch {
        // Fall through to ErrorBoundary
      }
    }

    throw lastError;
  });
}
