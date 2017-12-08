// Cache ID Version
const cacheID = 'v1';
// Files to precache
const cacheFiles = [
  // HTML Files
  './statistics-admin.html',
  './create-event.html',
  './create-player.html',
  './create-statistics.html',
  './edit-event.html',
  './edit-player.html',
  './edit-statistics.html',
  './login.html',
  './register.html',
  './roster-admin.html',
  './schedule-admin.html',
  // CSS Files
  './bootstrap.css',
  // JS Files
  './sw.js',
  './app.js',
  './jquery-3.2.1.slim.min.js',
  './bootstrap.min.js',
  './firebase.js',
  './popper.min.js',
  // Img Files
  './soccer-ball.png',
  // SVG Files
  './bar-chart.svg',
  './calendar.svg',
  './listing-option.svg',
  './pencil.svg',
  './plus.svg',
  './remove.svg',
];

// Service Worker Install Event
self.addEventListener('install', function(event) {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(cacheID)
    .then(function(cache) {
      return cache.addAll(cacheFiles);
    })
    .catch(function(error) {
      console.log(`Unable to add cached assets: ${error}`);
    })
  );
});

// Service Worker Activate Event
self.addEventListener('activate', function(e) {
  e.waitUntil(
    // Load up all items from cache, and check if cache items are not outdated
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheID) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Service Worker Fetch Event
self.addEventListener('fetch', function(e) {
  e.respondWith(
    // If request matches with something in cache, then return reponse
    // from cache, otherwise fetch it
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
