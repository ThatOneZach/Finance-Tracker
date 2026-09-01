const CACHE_NAME = "finance-tracker-v2";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener(
  "install",
  function (event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function (cache) {
          return cache.addAll(APP_FILES);
        })
    );
  }
);

self.addEventListener(
  "fetch",
  function (event) {
    event.respondWith(
      caches.match(event.request)
        .then(function (cachedResponse) {
          return (
            cachedResponse ||
            fetch(event.request)
          );
        })
    );
  }
);