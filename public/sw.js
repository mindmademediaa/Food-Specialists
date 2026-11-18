const CACHE_NAME = 'food-science-portal-v20261118-v7';
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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_SHELL_URLS).catch(() => {}))
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

// Warm-cache Factory Floor Offline Mode URLs on explicit user action
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'CACHE_OFFLINE_URLS' || !Array.isArray(data.urls)) {
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

// Handle Android/Chrome Web Share Target POST (/share-target) + Network-First GET caching
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

  // Never intercept Vite dev server or module script paths
  if (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/@')
  ) {
    return;
  }

  // Fallback if browser visits /share-target directly via GET
  if (url.pathname === '/share-target' || url.pathname.endsWith('/share-target')) {
    event.respondWith(Response.redirect('/?share-target=1', 302));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html') || caches.match('./');
          }
          return Response.error();
        })
      )
  );
});
