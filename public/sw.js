const CACHE_NAME = 'food-science-portal-__BUILD_VERSION__';
const CORE_SHELL_URLS = ['./', './index.html', './manifest.json'];
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

function fetchWithTimeout(request, options, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Network timeout')), timeoutMs);
    fetch(request, options)
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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          CORE_SHELL_URLS.map((url) =>
            fetch(url, { cache: 'no-store' })
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
          fetch(url)
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

// Handle Android/Chrome Web Share Target POST (/share-target) + Fresh Network-First HTML + Immutable Hashed Asset Cache
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

  // 1. HTML Navigations & index.html: STRICT NETWORK-FIRST (cache: 'no-store') with 3.5s offline fallback
  // Guarantees every pushed deploy reflects immediately on the very first load/refresh!
  if (
    event.request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname.endsWith('/index.html')
  ) {
    event.respondWith(
      fetchWithTimeout(event.request, { cache: 'no-store' }, 3500)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('./index.html', copy).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(() =>
          caches.open(CACHE_NAME).then((cache) =>
            cache.match('./index.html').then((cached) => cached || cache.match('./') || Response.error())
          )
        )
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

  // 3. Manifest, favicons, and other unhashed static files: NETWORK-FIRST so icon/manifest updates show immediately
  event.respondWith(
    fetchWithTimeout(event.request, { cache: 'no-cache' }, 3000)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || Response.error()))
  );
});
