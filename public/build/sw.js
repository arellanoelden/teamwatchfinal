// Cache ID version
const cacheID = 'v1';
// Files to precache
const cacheFiles = [
  // HTML Files
  './index.html',
  './sign_up.html',
  './login.html',
  './player/player_list.html',
  './game/game_schedule.html',
  './manage/view_profile.html',
  './game/add_game.html',
  './player/add_player.html',
  './player/view_player.html',
  './player/edit_player.html',
  './game/edit_game.html',
  './game/edit_stats.html',
  './game/view_stats.html',
  './manage/edit_profile.html',
  './offline.html',
  './deleted.html',
  // CSS Files
  './css/main.css',
  // Image Files
  './images/profile_pic25.jpg',
  // JS Files
  './firebase-firestore.js',
  './firebase.js',
  './sw.js',
  './app.js',
  './init.js',
  // Misc. Files
  './manifest.json',
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
// self.addEventListener('fetch', function(e) {
//   console.log('Attempting to fetch');
//   e.respondWith(
//     // If request matches with something in cache, then return reponse
//     // from cache, otherwise fetch it
//     caches.match(e.request).then(function(response) {
//       return response || fetch(e.request);
//     })
//   );
// });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheID).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          if (event.request.method != "POST") {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(function(error) {
          console.log("error: " + error);
          return caches.match('./offline.html');
        });;
      });
    })
  );
});
