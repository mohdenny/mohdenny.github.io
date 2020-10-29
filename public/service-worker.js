importScripts('/js/workbox-sw.js');

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  { url: "/", revision: '1' },
  { url: "/nav.html", revision: '1' },
  { url: "/index.html", revision: '1' },
  { url: "/team.html", revision: '1' },
  { url: "/schedule.html", revision: '1' },
  { url: "/pages/home.html", revision: '1' },
  { url: "/pages/favorit.html", revision: '1' },
  { url: "/pages/klasemen.html", revision: '1' },
  { url: "/pages/klub.html", revision: '1' },
  { url: "/pages/about.html", revision: '1' },
  { url: "/pages/contact.html", revision: '1' },
  { url: "/css/materialize.min.css", revision: '1' },
  { url: "/css/style.css", revision: '1' },
  { url: "/css/material_icons.css", revision: '1' },
  { url: "/css/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2", revision: '1' },
  { url: "https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js", revision: '1' },
  { url: "/js/workbox-sw.js", revision: '1' },
  { url: "/js/materialize.min.js", revision: '1' },
  { url: "/manifest.json", revision: '1' },
  { url: "/js/nav.js", revision: '1' },
  { url: "/js/db.js", revision: '1' },
  { url: "/js/idb.js", revision: '1' },
  { url: "/js/jquery-3.5.1.min.js", revision: '1' },
  { url: "/js/api.js", revision: '1' },
  { url: "/img/icon-brand.png", revision: '1' },
  { url: "/img/icon-line.png", revision: '1' },
  { url: "/img/icon-144x144.png", revision: '1' },
  { url: "/img/profile.png", revision: '1' }
], {
  ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  /\.(?:html)$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'html-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
)
workbox.routing.registerRoute(
  new RegExp('/pages/'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'pages'
  })
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg|ico)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  let options = {
    body: body,
    icon: 'img/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});