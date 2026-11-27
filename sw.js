/* Offline-Cache für Ciao Italia. Bei Inhaltsänderungen die
   Versionsnummer erhöhen, damit installierte Geräte aktualisieren. */
const CACHE = "ciaoit-v32";
const SHELL = [
  ".",
  "index.html",
  "styles.css?v=32",
  "app.js?v=32",
  "data.js?v=32",
  "vocabulary-a1.js?v=32",
  "vocabulary-a2.js?v=32",
  "vocabulary-b1.js?v=32",
  "verbs-a1.js?v=32",
  "verbs-a2.js?v=32",
  "verbs-b1.js?v=32",
  "sentences.js?v=32",
  "phrases.js?v=32",
  "stories.js?v=32",
  "illustrations.js?v=32",
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

  // CDN-Audio (jsDelivr liefert die Neural-MP3s aus dem GitHub-Repo) —
  // ZWINGEND vor dem /audio/-Pfad-Zweig prüfen, denn die CDN-URLs
  // enthalten ebenfalls „/audio/“ im Pfad. Beim ersten Hören in den
  // Offline-Cache übernehmen; Audio-Elemente fragen no-cors (Antwort
  // wäre opaque, response.ok=false) — deshalb expliziter CORS-Refetch
  // (jsDelivr sendet ACAO: *).
  if (url.origin === "https://cdn.jsdelivr.net") {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        try {
          const response = await fetch(new Request(request.url, { mode: "cors", credentials: "omit" }));
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return new Response("", { status: 404 });
        }
      })
    );
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
