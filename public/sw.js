const CACHE_NAME = 'food-science-portal-__BUILD_VERSION__';
const CORE_SHELL_URLS = ['/', '/index.html', '/manifest.json'];
const SHARE_TARGET_DB_NAME = 'fsp_share_target_db';
const SHARE_TARGET_STORE_NAME = 'shared_items';

function openShareTargetDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(SHARE_TARGET_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(SHARE_TARGET_STORE_NAME)) {
        db.createObjectStore(SHARE_TARGET_STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveSharedTargetToIdb(record) {
  const db = await openShareTargetDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SHARE_TARGET_STORE_NAME, 'readwrite');
    tx.objectStore(SHARE_TARGET_STORE_NAME).put(record);
    tx.oncomplete = () => {
      db.close();
      resolve(true);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

function fetchFreshUrl(urlString, cacheMode) {
  return fetch(urlString, {
    cache: cacheMode || 'no-store',
    credentials: 'same-origin',
    redirect: 'follow',
  });
}

function raceWithTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Network timeout')), timeoutMs);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function offlineFallbackHtmlResponse() {
  return new Response(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Food Science Portal — Offline</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;background:#f8fafc;color:#0f172a;padding:24px;text-align:center}.card{max-width:380px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px 24px;box-shadow:0 12px 30px rgba(15,23,42,.08)}h1{font-size:18px;margin:0 0 8px}p{font-size:14px;color:#475569;margin:0 0 18px;line-height:1.5}button{background:#1673b8;color:#fff;border:none;border-radius:10px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer}</style></head><body><div class="card"><h1>Connection Interrupted</h1><p>Please check your internet connection and tap reload to open Food Science Portal.</p><button onclick="location.reload()">Reload Page</button></div></body></html>',
    {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    }
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          CORE_SHELL_URLS.map((url) =>
            fetchFreshUrl(url, 'no-store')
              .then((res) => (res && res.status === 200 ? cache.put(url, res) : null))
              .catch(() => null)
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Handle explicit SKIP_WAITING & offline URL warming messages
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  if (data.type !== 'CACHE_OFFLINE_URLS' || !Array.isArray(data.urls)) {
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        data.urls.map((url) =>
          fetchFreshUrl(url, 'no-cache')
            .then((res) => (res && res.status === 200 ? cache.put(url, res) : null))
            .catch(() => null)
        )
      )
    )
  );
});

// Handle PWA Push / Notification clicks to open the deep link inside the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) {
            client.navigate(targetUrl).catch(() => {});
          }
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});

// Handle Android/Chrome Web Share Target POST (/share-target) + Reliable Navigation + Immutable Hashed Asset Cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Intercept Web Share Target multipart/form-data image shares from WhatsApp / Gallery / Chrome
  if (
    event.request.method === 'POST' &&
    (url.pathname === '/share-target' || url.pathname.endsWith('/share-target'))
  ) {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const title = String(formData.get('title') || '');
          const text = String(formData.get('text') || '');
          const sharedUrl = String(formData.get('url') || '');
          const rawFiles = formData.getAll('media');
          const imageFile =
            rawFiles.find(
              (item) =>
                item &&
                typeof item === 'object' &&
                'size' in item &&
                Number(item.size) > 0
            ) || null;

          let fileBlob = null;
          let fileName = 'shared-flyer.jpg';
          let fileType = 'image/jpeg';

          if (imageFile && typeof imageFile.arrayBuffer === 'function') {
            const buffer = await imageFile.arrayBuffer();
            fileType = imageFile.type || 'image/jpeg';
            fileName = imageFile.name || 'shared-flyer.jpg';
            fileBlob = new Blob([buffer], { type: fileType });
          }

          await saveSharedTargetToIdb({
            id: 'latest',
            fileBlob,
            fileName,
            fileType,
            title,
            text,
            url: sharedUrl,
            receivedAt: Date.now()
          });

          if (typeof BroadcastChannel !== 'undefined') {
            try {
              const ch = new BroadcastChannel('fsp-share-target');
              ch.postMessage({ type: 'NEW_SHARED_TARGET', receivedAt: Date.now() });
              ch.close();
            } catch {
              // Ignore BroadcastChannel unavailability
            }
          }

          return Response.redirect('/?share-target=1', 303);
        } catch {
          return Response.redirect('/?share-target=error', 303);
        }
      })()
    );
    return;
  }

  if (event.request.method !== 'GET') return;

  // Never intercept Vite dev server, module scripts, API calls, or version.json checks
  if (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.endsWith('/version.json')
  ) {
    return;
  }

  // Fallback if browser visits /share-target directly via GET
  if (url.pathname === '/share-target' || url.pathname.endsWith('/share-target')) {
    event.respondWith(Response.redirect('/?share-target=1', 302));
    return;
  }

  // 1. HTML Navigations & index.html:
  // Never pass RequestInit to a mode:'navigate' Request (causes Chrome ERR_FAILED).
  // Always fetch by clean string URL with redirect:'follow' and only apply a short timeout when a cached fallback exists.
  if (
    event.request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname.endsWith('/index.html')
  ) {
    const isInstalledPwaLaunch = url.searchParams.get('source') === 'pwa';
    const isRootOrSpaNav =
      url.pathname === '/' ||
      url.pathname.endsWith('/index.html') ||
      !/\.[a-z0-9]+$/i.test(url.pathname);
    const targetFetchUrl = isRootOrSpaNav ? '/index.html' : url.href;

    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME).catch(() => null);
        const cachedShell = cache
          ? (await cache.match('/index.html')) || (await cache.match('/'))
          : null;

        const doFreshFetch = async () => {
          const networkResponse = await fetchFreshUrl(targetFetchUrl, 'no-store');
          if (networkResponse && networkResponse.status === 200 && isRootOrSpaNav && cache) {
            cache.put('/index.html', networkResponse.clone()).catch(() => {});
          }
          if (networkResponse && networkResponse.ok) {
            return networkResponse;
          }
          if (isRootOrSpaNav && targetFetchUrl !== '/') {
            const rootRes = await fetchFreshUrl('/', 'no-store');
            if (rootRes && rootRes.status === 200 && cache) {
              cache.put('/index.html', rootRes.clone()).catch(() => {});
            }
            if (rootRes && rootRes.ok) return rootRes;
          }
          return networkResponse;
        };

        // Installed Mobile App launch (/?source=pwa): Instant Stale-While-Revalidate (<30ms shell boot)
        if (isInstalledPwaLaunch && cachedShell) {
          event.waitUntil(doFreshFetch().catch(() => null));
          return cachedShell;
        }

        // Regular browser tabs & reloads: Network-First.
        // Only race a timeout when cachedShell is ready so a slow network never triggers ERR_FAILED.
        try {
          if (cachedShell) {
            return await raceWithTimeout(doFreshFetch(), 4500);
          }
          return await doFreshFetch();
        } catch {
          if (cachedShell) return cachedShell;
          try {
            return await fetch(event.request);
          } catch {
            return offlineFallbackHtmlResponse();
          }
        }
      })()
    );
    return;
  }

  // 2. Immutable Vite content-hashed bundles inside /assets/: CACHE-FIRST for instant sub-second loads
  const isImmutableHashedAsset =
    url.pathname.includes('/assets/') &&
    /-[A-Za-z0-9_-]{6,}\.(?:js|mjs|css|woff2?|ttf|png|jpg|jpeg|webp|svg)$/i.test(url.pathname);

  if (isImmutableHashedAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cloned).catch(() => {});
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Manifest, favicons, and other unhashed static files: Safe Network-First with cache fallback
  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request).catch(() => null);
      try {
        const reqPromise = fetchFreshUrl(event.request.url, 'no-cache');
        const networkResponse = cached ? await raceWithTimeout(reqPromise, 4500) : await reqPromise;
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned).catch(() => {});
          });
        }
        return networkResponse;
      } catch {
        if (cached) return cached;
        return fetch(event.request);
      }
    })()
  );
});
