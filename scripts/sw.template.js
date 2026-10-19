// Service worker : ouverture instantanée et consultation sans réseau.
// La version est calculée automatiquement à chaque génération du site.
const VERSION = "__VERSION__";
const CORE = __CORE__;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const put = res => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; };
  if (req.mode === "navigate" || req.url.endsWith(".json")) {
    // Pages et données : réseau d'abord (prix toujours à jour), cache si hors ligne
    e.respondWith(fetch(req).then(put).catch(() => caches.match(req).then(r => r || caches.match("./"))));
  } else {
    // Images, polices, CSS, JS : cache d'abord (chargement instantané)
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(put)));
  }
});
