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
    '/css/index.css', 
    '/offline.html', 
    '/images/Logo.png', 
    '/images/LogoOGP.png', 
    '/images/vlidesProf.png', 
    '/images/vlidesDetail.png',
];

// Install SW (Service Worker がインストールされたとき)
self.addEventListener('install', (event) => {
    // https://developer.mozilla.org/ja/docs/Web/API/ExtendableEvent/waitUntil
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
self.addEventListener('fetch', (event) => {
    // fetch イベント時に介入したい処理
    event.respondWith(
      caches.match(event.request).then((r) => {
            // console.log('[Service Worker] Fetching resource: '+e.request.url);
        // キャッシュがあった場合は、キャッシュの内容(r)を返す。
        // キャッシュが見つからなかったので取得(fetch)
        return r || fetch(event.request).then((response) => {
                  return caches
                    .open(CACHE_NAME)
                    .then((cache) => {
                        // console.log('[Service Worker] Caching new resource: '+e.request.url);
                        // cache に登録する
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    // .catch(() => {
                    //     caches.match('offline.html')
                    // });
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




/*
Copyright 2015, 2019 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// // Incrementing OFFLINE_VERSION will kick off the install event and force
// // previously cached resources to be updated from the network.
// const OFFLINE_VERSION = 1;
// const CACHE_NAME = 'offline';
// // Customize this with a different URL if needed.
// const OFFLINE_URL = 'offline.html';

// self.addEventListener('install', (event) => {
//   event.waitUntil((async () => {
//     const cache = await caches.open(CACHE_NAME);
//     // Setting {cache: 'reload'} in the new request will ensure that the response
//     // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
//     await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
//   })());
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil((async () => {
//     // Enable navigation preload if it's supported.
//     // See https://developers.google.com/web/updates/2017/02/navigation-preload
//     if ('navigationPreload' in self.registration) {
//       await self.registration.navigationPreload.enable();
//     }
//   })());

//   // Tell the active service worker to take control of the page immediately.
//   self.clients.claim();
// });

// self.addEventListener('fetch', (event) => {
//   // We only want to call event.respondWith() if this is a navigation request
//   // for an HTML page.
//   if (event.request.mode === 'navigate') {
//     event.respondWith((async () => {
//       try {
//         // First, try to use the navigation preload response if it's supported.
//         const preloadResponse = await event.preloadResponse;
//         if (preloadResponse) {
//           return preloadResponse;
//         }

//         const networkResponse = await fetch(event.request);
//         return networkResponse;
//       } catch (error) {
//         // catch is only triggered if an exception is thrown, which is likely
//         // due to a network error.
//         // If fetch() returns a valid HTTP response with a response code in
//         // the 4xx or 5xx range, the catch() will NOT be called.
//         console.log('Fetch failed; returning offline page instead.', error);

//         const cache = await caches.open(CACHE_NAME);
//         const cachedResponse = await cache.match(OFFLINE_URL);
//         return cachedResponse;
//       }
//     })());
//   }

//   // If our if() condition is false, then this fetch handler won't intercept the
//   // request. If there are any other fetch handlers registered, they will get a
//   // chance to call event.respondWith(). If no fetch handlers call
//   // event.respondWith(), the request will be handled by the browser as if there
//   // were no service worker involvement.
// });