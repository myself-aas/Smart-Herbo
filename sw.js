// Simple Service Worker for caching model assets
const CACHE_NAME = 'smart-herbo-model-cache-v1';
const ASSETS_TO_CACHE = [
  '/model.json',
  '/group1-shard1of1.bin'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only handle GET requests for our cached assets
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (ASSETS_TO_CACHE.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});
