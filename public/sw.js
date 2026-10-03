const CACHE_NAME =
  "nepali-voice-ai-writer-v2";

const STATIC_ASSETS = [
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
];

self.addEventListener(
  "install",
  (event) => {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) =>
          cache.addAll(STATIC_ASSETS),
        ),
    );

    self.skipWaiting();
  },
);

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) =>
          Promise.all(
            cacheNames
              .filter(
                (name) =>
                  name !== CACHE_NAME,
              )
              .map((name) =>
                caches.delete(name),
              ),
          ),
        )
        .then(() => self.clients.claim()),
    );
  },
);

self.addEventListener(
  "fetch",
  (event) => {
    const { request } = event;

    if (request.method !== "GET") {
      return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
      return;
    }

    // Never cache API requests.
    if (url.pathname.startsWith("/api/")) {
      return;
    }

    // Page navigation:
    // use network when online,
    // show offline page when network fails.
    if (request.mode === "navigate") {
      event.respondWith(
        fetch(request).catch(() =>
          caches.match("/offline"),
        ),
      );

      return;
    }

    const cacheableTypes = [
      "image",
      "style",
      "script",
      "font",
    ];

    if (
      !cacheableTypes.includes(
        request.destination,
      )
    ) {
      return;
    }

    // Static assets:
    // use cached copy first,
    // otherwise fetch and cache it.
    event.respondWith(
      caches
        .match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then(
            (networkResponse) => {
              if (
                !networkResponse ||
                !networkResponse.ok
              ) {
                return networkResponse;
              }

              const responseToCache =
                networkResponse.clone();

              caches
                .open(CACHE_NAME)
                .then((cache) =>
                  cache.put(
                    request,
                    responseToCache,
                  ),
                );

              return networkResponse;
            },
          );
        }),
    );
  },
);