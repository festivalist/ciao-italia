/* Offline-Cache für Ciao Italia. Bei Inhaltsänderungen die
   Versionsnummer erhöhen, damit installierte Geräte aktualisieren. */
const CACHE = "ciaoit-v24";
const SHELL = [
  ".",
  "index.html",
  "styles.css",
  "app.js",
  "data.js",
  "vocabulary-a1.js",
  "vocabulary-a2.js",
  "vocabulary-b1.js",
  "verbs-a1.js",
  "verbs-a2.js",
  "verbs-b1.js",
  "sentences.js",
  "phrases.js",
  "stories.js",
  "illustrations.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-512-maskable.png",
  "icons/apple-touch-icon-180.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Sync-Endpunkt immer frisch vom Netz (niemals cachen)
  if (url.pathname.endsWith("/sync.php")) {
    event.respondWith(fetch(request).catch(() => new Response("", { status: 503 })));
    return;
  }

  if (url.pathname.includes("/audio/")) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return new Response("", { status: 404 });
        }
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => hit || fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
      return response;
    }).catch(() => caches.match("index.html")))
  );
});
