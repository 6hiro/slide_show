// self.addEventListener('install', function (e) {
//     console.log('ServiceWorker install')
// })

// self.addEventListener('activate', function (e) {
//     console.log('ServiceWorker activate')
// })

// self.addEventListener('fetch', function (event) {})

// https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps/Offline_Service_workers
// https://blog.capilano-fw.com/?p=6722
const CACHE_NAME = 'vlides-v1';
// const urlsToCache = ['/index.html', '/offline.html'];
const urlsToCache = [
    '/', 
    '/js/index.js', 
    'css/index.css', 
    '/offline.html', 
    'images/Logo.png', 
    'images/LogoOGP.png', 
    'images/vlidesProf.png', 
    'images/vlidesDetail.png',
];

// Install SW (Service Worker がインストールされたとき)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Listen for requests (HTTP 要求がアプリから発するたびに発生)
// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.match(event.request).then(() => {
//             return fetch(event.request).catch(() => {
//                 caches.match('offline.html')
//             });
//         })
//     );
// });
self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((r) => {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
        return r || fetch(e.request).then((response) => {
                  return caches.open(CACHE_NAME).then((cache) => {
                console.log('[Service Worker] Caching new resource: '+e.request.url);
                cache.put(e.request, response.clone());
                return response;
            })
            .catch(() => {
                caches.match('offline.html')
            });
        });
      })
    );
  });
  
// Activate the SW
// activate は ServiceWorkerGlobalScope インターフェイスのイベントで、
// ServiceWorkerRegistration が新しいアクティブワーカー（ServiceWorkerRegistration.active worker）を取得すると発生します。
self.addEventListener('activate', (event) => {
    const casheWhitelist = [];
    casheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((casheNames) =>
            Promise.all(
                casheNames.map((casheName) => {
                if (!casheWhitelist.includes(casheName)) {
                    return cashes.delete(casheName);
                }
                })
            )
        )
    );
});