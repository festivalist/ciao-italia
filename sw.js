/* Offline-Cache für Ciao Italia. Bei Inhaltsänderungen die
   Versionsnummer erhöhen, damit installierte Geräte aktualisieren. */
const CACHE = "ciaoit-v31";
const SHELL = [
  ".",
  "index.html",
  "styles.css?v=31",
  "app.js.js?v=31",
  "data.js.js?v=31",
  "vocabulary-a1.js.js?v=31",
  "vocabulary-a2.js.js?v=31",
  "vocabulary-b1.js.js?v=31",
  "verbs-a1.js.js?v=31",
  "verbs-a2.js.js?v=31",
  "verbs-b1.js.js?v=31",
  "sentences.js.js?v=31",
  "phrases.js.js?v=31",
  "stories.js.js?v=31",
  "illustrations.js.js?v=31",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-512-maskable.png",
  "icons/apple-touch-icon-180.png"
];

self.addEventListener("install", (event) => {
  // Einzelne fehlgeschlagene Shell-Dateien (z. B. Binärdateien, die der
  // Hoster nicht ausliefert) dürfen die Installation nicht blockieren —
  // sonst bekämen installierte Geräte keine Updates mehr.
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.allSettled(SHELL.map((file) => cache.add(file))))
      .then(() => self.skipWaiting())
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

  // CDN-Audio (jsDelivr liefert die Neural-MP3s aus dem GitHub-Repo):
  // beim ersten Hören in den Offline-Cache übernehmen.
  if (url.origin === "https://cdn.jsdelivr.net") {
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
