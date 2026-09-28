// StudentOS Progressive Web App Service Worker
// Version: 1.1.0 (Production for Windows 10 Web/PWA)

const CACHE_NAME = 'studentos-cache-v1.1.0';
const OFFLINE_URL = '/';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/logo.svg',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/pwa-64x64.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/maskable-icon-192x192.png',
  '/maskable-icon-512x512.png',
  '/apple-touch-icon.png'
];

// Install event: Precache core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[StudentOS SW] Precache warning:', err);
      });
    }).then(() => {
      // Don't force active immediately to allow safe update notification
    })
  );
});

// Activate event: Clean old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[StudentOS SW] Removing old cache version:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Message event: Listen for SKIP_WAITING from app update UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event: Cache-First for static assets, Network-First for navigations
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Skip non-GET requests or browser-extension schemes
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // Navigation requests: Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match(OFFLINE_URL);
          return fallback || new Response('Offline - StudentOS', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        })
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts): Cache-first with network revalidation
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache for next time
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Not in cache: fetch from network and store
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Avoid caching large external media or audio streams
          if (!request.url.includes('youtube.com') && !request.url.includes('googlevideo.com')) {
            cache.put(request, responseToCache);
          }
        });

        return networkResponse;
      }).catch(async (err) => {
        // Return a safe dummy fallback for images if missing
        if (request.destination === 'image') {
          const cachedLogo = await caches.match('/logo.svg');
          if (cachedLogo) return cachedLogo;
        }
        return new Response('Offline Resource Unavailable', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
