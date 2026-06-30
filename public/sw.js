const CACHE_NAME = 'andanzas-go-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/index.tsx',
  '/manifest.json',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png'
];

// Install Event: Pre-cache core assets resiliently
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching app shell assets resiliently');
      return Promise.all(
        PRECACHE_ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.warn(`[SW] Failed to precache asset: ${asset}`, err);
          });
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Cleaning up old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Smart routing & caching strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Determine origins to handle
  const isSelf = requestUrl.origin === self.location.origin;
  const isSupabase = requestUrl.hostname.includes('supabase.co');
  const isCDN = requestUrl.hostname.includes('esm.sh') || requestUrl.hostname.includes('tailwindcss.com');

  // Bypasses third-party assets (like Unsplash, Wikimedia, placeholder images)
  // so they are loaded natively by the browser without SW interference.
  if (!isSelf && !isSupabase && !isCDN) {
    return;
  }

  // 1. Supabase API Requests: Network-First, fallback to Cache
  if (isSupabase) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful GET API responses
          if (response.status === 200) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseCopy);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline, return the last cached API response
          console.log('[SW] Network failed. Serving cached API request:', event.request.url);
          return caches.match(event.request).then((cached) => cached || new Response(JSON.stringify([]), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }));
        })
    );
    return;
  }

  // 2. ESM.sh & CDN Libraries: Cache-First, falling back to Network (since they are immutable)
  if (isCDN) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseCopy);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // 3. Local App Shell & static files: Network-First falling back to Cache
  // This ensures updates are immediately visible during active dev/deployment.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache static files
        if (response.status === 200) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If the page request fails, fallback to index.html / root path
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          // Safety: Return a 404 Response instead of undefined to prevent TypeError
          return new Response('Not found', { status: 404 });
        });
      })
  );
});
