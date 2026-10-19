// Service worker : le site s'ouvre instantanément et reste consultable sans réseau.
// Changez VERSION à chaque mise en ligne pour vider l'ancien cache.
const VERSION = "mt-2026-10-19-1";
const CORE = ["./", "index.html", "css/style.css", "js/main.js", "data/terrains.json", "manifest.webmanifest", "favicon.png", "images/logo.png", "images/icon-192.png", "fonts/manrope-0.woff2", "fonts/montserrat-1.woff2"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const fresh = req.mode === "navigate" || req.url.endsWith(".json");
  if (fresh) {
    // Pages et données : réseau d'abord (prix toujours à jour), cache si hors ligne
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
  } else {
    // Images, polices, CSS, JS : cache d'abord (chargement instantané)
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
