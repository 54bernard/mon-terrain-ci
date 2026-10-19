// Générateur du site : lit data/*.json et fabrique toutes les pages dans _site/.
// Usage : node scripts/build.mjs            (SITE_URL=https://mon-domaine.com/ pour changer l'adresse)
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tr, totalOf, terrainUrl, asset, hasGps, statusRank } from "../js/shared.js";
import { T, layout, homePage, terrainPage, notFoundPage } from "./templates.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "_site");
const read = f => JSON.parse(readFileSync(join(ROOT, f), "utf8"));

const site = read("data/site.json");
if (process.env.SITE_URL) site.url = process.env.SITE_URL.replace(/\/?$/, "/");
const terrains = read("data/terrains.json").terrains;
const docs = site.documents;

/* ---------- validation des données ---------- */
const errors = [];
const ids = new Set();
for (const [i, t] of terrains.entries()) {
  const where = `terrain n°${i + 1} (${t.id || "sans identifiant"})`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.id || "")) errors.push(`${where} : identifiant invalide (minuscules, chiffres et tirets)`);
  if (ids.has(t.id)) errors.push(`${where} : identifiant en double`);
  ids.add(t.id);
  for (const k of ["zone", "lieu", "titre", "doc", "image", "fiche"]) if (!t[k]) errors.push(`${where} : « ${k} » manquant`);
  if (!["lot", "surface"].includes(t.type)) errors.push(`${where} : type doit être lot ou surface`);
  if (!["disponible", "reserve", "vendu"].includes(t.statut)) errors.push(`${where} : statut doit être disponible, reserve ou vendu`);
  if (!["lot", "m²", ""].includes(t.unite ?? "")) errors.push(`${where} : unité doit être lot, m² ou vide`);
  if (!(Number.isInteger(t.prix) && t.prix > 0)) errors.push(`${where} : prix invalide`);
  if (!(t.m2 > 0)) errors.push(`${where} : surface invalide`);
  if (!Array.isArray(t.points) || t.points.length < 1) errors.push(`${where} : au moins un point fort`);
  for (const k of ["image", "fiche", ...(t.photos || [])].map(k => t[k] ?? k)) {
    if (k && !/^https?:/.test(k) && !existsSync(join(ROOT, String(k).replace(/^\/+/, "")))) errors.push(`${where} : image introuvable ${k}`);
  }
  if (t.gps && (t.gps.lat != null || t.gps.lng != null) && !hasGps(t)) errors.push(`${where} : coordonnées GPS incomplètes`);
  if (hasGps(t) && !(t.gps.lat > 4 && t.gps.lat < 11 && t.gps.lng > -9 && t.gps.lng < -2)) errors.push(`${where} : coordonnées GPS hors de Côte d'Ivoire`);
}
if (errors.length) { console.error("Données invalides :\n- " + errors.join("\n- ")); process.exit(1); }

/* ---------- préparation ---------- */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const d of ["css", "js", "fonts", "images", "vendor"]) if (existsSync(join(ROOT, d))) cpSync(join(ROOT, d), join(OUT, d), { recursive: true });
cpSync(join(ROOT, "favicon.png"), join(OUT, "favicon.png"));

const fontFile = readdirSync(join(ROOT, "fonts")).find(f => f.startsWith("montserrat"));
const anyGps = terrains.some(hasGps);
const CSP = ["default-src 'self'", "script-src 'self' 'inline-speculation-rules'", "style-src 'self'", "font-src 'self'",
  "img-src 'self' data: https://tile.openstreetmap.org", "connect-src 'self'", "manifest-src 'self'", "worker-src 'self'",
  "object-src 'none'", "base-uri 'self'", "form-action 'none'", "upgrade-insecure-requests"].join("; ");
const now = new Date();
const month = L => now.toLocaleDateString(L === "en" ? "en-GB" : "fr-FR", { month: "long", year: "numeric" });
const ogFor = t => existsSync(join(ROOT, `images/og/${t.id}.jpg`)) ? `images/og/${t.id}.jpg` : "images/og.jpg";
const sorted = [...terrains].sort((a, b) => statusRank(a) - statusRank(b));
const write = (p, s) => { mkdirSync(dirname(join(OUT, p)), { recursive: true }); writeFileSync(join(OUT, p), s); };
const agent = { "@type": "RealEstateAgent", "@id": site.url + "#agence", name: site.nom, url: site.url, telephone: site.telephone,
  logo: site.url + "images/icon-512.png", image: site.url + "images/og.jpg", address: { "@type": "PostalAddress", addressCountry: "CI" },
  areaServed: [...new Set(terrains.map(t => t.zone))].map(name => ({ "@type": "Place", name })) };
const offer = (t, L) => ({ "@type": "Offer", name: `${tr(t, L, "titre")} · ${t.lieu}`, url: site.url + terrainUrl(t, L, ""),
  price: t.prix, priceCurrency: "XOF", seller: { "@id": site.url + "#agence" },
  availability: t.statut === "vendu" ? "https://schema.org/SoldOut" : t.statut === "reserve" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
  priceSpecification: { "@type": "UnitPriceSpecification", price: t.prix, priceCurrency: "XOF", unitText: t.unite === "m²" ? "m²" : "lot" },
  itemOffered: { "@type": "Place", name: t.lieu, description: tr(t, L, "points").join(" ; "),
    ...(hasGps(t) ? { geo: { "@type": "GeoCoordinates", latitude: t.gps.lat, longitude: t.gps.lng } } : {}) },
  image: site.url + asset("", t.fiche) });

/* ---------- pages ---------- */
const urls = [];
for (const L of ["fr", "en"]) {
  const pre = L === "en" ? "en/" : "";
  const R = L === "en" ? "../" : "";
  write(pre + "index.html", layout({
    L, R, site, page: "home", title: T[L].title, desc: T[L].desc, ogTitle: T[L].ogTitle, path: pre, altPath: L === "en" ? "" : "en/",
    ogImage: "images/og.jpg", csp: CSP, fontFile,
    ld: { "@context": "https://schema.org", "@graph": [agent, { "@type": "ItemList", name: L === "en" ? "Land for sale" : "Terrains à vendre",
      itemListElement: sorted.map((t, i) => ({ "@type": "ListItem", position: i + 1, item: offer(t, L) })) }] },
    body: homePage({ L, R, site, terrains, docs, month: month(L) })
  }));
  urls.push(pre);
  sorted.forEach((x, i) => {
    const Rt = L === "en" ? "../../../" : "../../";
    const prev = sorted[(i - 1 + sorted.length) % sorted.length], next = sorted[(i + 1) % sorted.length];
    const related = sorted.filter(r => r.id !== x.id && r.statut !== "vendu")
      .sort((a, b) => (b.zone === x.zone) - (a.zone === x.zone) || (b.type === x.type) - (a.type === x.type)).slice(0, 3);
    const path = `${pre}terrains/${x.id}/`, alt = `${L === "en" ? "" : "en/"}terrains/${x.id}/`;
    const titre = tr(x, L, "titre");
    write(path + "index.html", layout({
      L, R: Rt, site, page: "terrain", path, altPath: alt, csp: CSP, fontFile, ogImage: ogFor(x),
      title: `${titre} · ${x.lieu} | Mon Terrain en Côte d'Ivoire`,
      desc: `${x.lieu} : ${titre}. ${tr(x, L, "points").join(". ")}. Document : ${tr(x, L, "doc")}. ${L === "en" ? "Signed at the notary's office." : "Signature chez le notaire."}`,
      ld: { "@context": "https://schema.org", "@graph": [agent, offer(x, L), { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: T[L].crumbHome, item: site.url + pre },
        { "@type": "ListItem", position: 2, name: T[L].crumbTerrains, item: site.url + pre + "#terrains" },
        { "@type": "ListItem", position: 3, name: x.lieu, item: site.url + path }] }] },
      body: terrainPage({ L, R: Rt, site, x, docs, prev, next, related, anyGps })
    }));
    urls.push(path);
  });
}
const base = new URL(site.url).pathname;
write("404.html", layout({ L: "fr", R: base, site, page: "404", title: "Page introuvable · Mon Terrain en Côte d'Ivoire", desc: T.fr.desc,
  path: "404.html", altPath: "404.html", ogImage: "images/og.jpg", csp: CSP, fontFile, ld: { "@context": "https://schema.org", ...agent },
  body: notFoundPage({ L: "fr", R: base, site }) }).replace("<head>", '<head>\n<meta name="robots" content="noindex">'));

/* ---------- données pour le navigateur ---------- */
write("data/terrains.json", JSON.stringify({ site: { url: site.url, whatsapp: site.whatsapp, telephone: site.telephone, taux_eur: site.taux_eur },
  documents: docs, terrains: sorted }));

/* ---------- référencement ---------- */
const today = now.toISOString().slice(0, 10);
const altOf = p => p.startsWith("en/") ? p.slice(3) : "en/" + p;
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(p => `  <url><loc>${site.url}${p}</loc><lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="${p.startsWith("en/") ? "en" : "fr"}" href="${site.url}${p}"/>
    <xhtml:link rel="alternate" hreflang="${p.startsWith("en/") ? "fr" : "en"}" href="${site.url}${altOf(p)}"/>
  </url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site.url}sitemap.xml\n`);
write("manifest.webmanifest", JSON.stringify({ name: site.nom, short_name: "Mon Terrain", description: T.fr.desc, lang: "fr",
  start_url: "./", scope: "./", display: "standalone", background_color: "#0f2e1f", theme_color: "#0f2e1f",
  icons: [{ src: "images/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "images/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }] }, null, 2));

/* ---------- service worker (version calculée automatiquement) ---------- */
const files = [];
const walk = d => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); } };
walk(OUT);
const hash = createHash("sha256");
for (const f of files.sort()) hash.update(f).update(readFileSync(f));
const VERSION = "mt-" + hash.digest("hex").slice(0, 12);
const core = ["./", "en/", "css/style.css", "js/main.js", "js/shared.js", "data/terrains.json", "favicon.png", "images/logo.png",
  ...readdirSync(join(OUT, "fonts")).map(f => "fonts/" + f)];
write("sw.js", readFileSync(join(ROOT, "scripts/sw.template.js"), "utf8").replace("__VERSION__", VERSION).replace("__CORE__", JSON.stringify(core)));

/* ---------- contrôle de sécurité du résultat ---------- */
const bad = [];
for (const f of files.filter(f => f.endsWith(".html"))) {
  const h = readFileSync(f, "utf8");
  if (/ style="/.test(h)) bad.push(`${f} : attribut style en ligne`);
  if (/<script(?![^>]*(\bsrc=|\btype="(application\/ld\+json|speculationrules)"))[^>]*>/.test(h)) bad.push(`${f} : script en ligne`);
  if (/\son[a-z]+="/.test(h)) bad.push(`${f} : gestionnaire d'événement en ligne`);
  if (/target="_blank"(?![^>]*noopener)/.test(h)) bad.push(`${f} : lien externe sans noopener`);
}
if (bad.length) { console.error("Contrôle de sécurité échoué :\n- " + bad.join("\n- ")); process.exit(1); }
console.log(`Site généré : ${urls.length} pages + 404, ${files.length + 1} fichiers, version ${VERSION}, adresse ${site.url}`);
