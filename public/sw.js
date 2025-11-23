const CACHE_NAME = 'graamgyaan-v1';
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/offline-api.json'
];

self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt) => {
  const url = new URL(evt.request.url);

  if (url.pathname.startsWith('/api/')) {
    evt.respondWith(fetch(evt.request).catch(() => caches.match('/offline-api.json')));
    return;
  }

  if (evt.request.mode === 'navigate' || evt.request.destination === 'document') {
    evt.respondWith(
      caches.match(evt.request).then(cached => cached || fetch(evt.request).catch(() => caches.match('/')))
    );
    return;
  }

  evt.respondWith(
    caches.match(evt.request).then(cached => {
      if (cached) return cached;
      return fetch(evt.request).then(response => {
        if (evt.request.method === 'GET' && response && response.status === 200) {
          caches.open(CACHE_NAME).then(cache => cache.put(evt.request, response.clone()));
        }
        return response;
      }).catch(() => caches.match('/'));
    })
  );
});
