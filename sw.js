// Service Worker — Professional PWA Architecture
const CACHE_NAME = 'vault-cache-v5';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // 1. تجاوز طلبات Firebase والـ API لتجنب تعارض الكاش مع قاعدة البيانات
  if (event.request.method !== 'GET' || event.request.url.includes('firebaseio.com') || event.request.url.includes('googleapis.com')) {
    return;
  }

  // 2. استراتيجية (Cache First, falling back to Network) للملفات الأساسية
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      
      return fetch(event.request).then(response => {
        // تخزين الملفات الجديدة الصالحة فقط
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // 3. إرجاع صفحة index.html فقط عند انقطاع الإنترنت أثناء "التنقل" بين الصفحات
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
