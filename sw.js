const CACHE_NAME = 'loc-ministries-v10'; // नया वर्शन
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './images_logo.png',
  './images_logo.jpeg',
  './images_qr_code.jpeg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install: Cache files
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  )
});

// Fetch: इंटरनेट न होने पर कैशे से फाइल देना
// Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests like Google Fonts if needed, 
  // or handle them specifically. Here we try cache first.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }).catch(() => {
        // जब इंटरनेट न हो और फाइल कैशे में भी न हो
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});