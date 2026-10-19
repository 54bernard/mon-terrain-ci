// Carte des terrains (Leaflet + OpenStreetMap). Chargée uniquement sur les pages qui ont une carte.
const loadLeaflet = R => window.L ? Promise.resolve(window.L) : new Promise((ok, ko) => {
  const css = document.createElement("link");
  css.rel = "stylesheet"; css.href = R + "vendor/leaflet/leaflet.css";
  document.head.append(css);
  const js = document.createElement("script");
  js.src = R + "vendor/leaflet/leaflet.js"; js.onload = () => ok(window.L); js.onerror = ko;
  document.head.append(js);
});

const escHtml = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export async function drawMap(el, points, R) {
  const L = await loadLeaflet(R);
  const map = L.map(el, { scrollWheelZoom: false, attributionControl: true });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
  }).addTo(map);
  const icon = L.divIcon({ className: "pin", html: "<span></span>", iconSize: [30, 40], iconAnchor: [15, 40], popupAnchor: [0, -36] });
  const bounds = points.map(p => {
    const m = L.marker([p.lat, p.lng], { icon, title: p.label }).addTo(map);
    if (p.href) m.bindPopup(`<a class="pop" href="${escHtml(p.href)}"><b>${escHtml(p.label)}</b><span>${escHtml(p.sub)}</span></a>`);
    return [p.lat, p.lng];
  });
  if (bounds.length === 1) map.setView(bounds[0], 15);
  else map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  el.addEventListener("click", () => map.scrollWheelZoom.enable(), { once: true });
}
