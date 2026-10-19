// Code partagé entre le navigateur (js/main.js) et le générateur de pages (scripts/build.mjs).

export const STR = {
  fr: {
    locale: "fr-FR", other: "en", otherLabel: "EN", otherName: "English",
    lot: "lot", lots: "lots", plot1: "1 lot", block: "Bloc entier",
    kindLot: "Lot", kindSurface: "Grande surface", lastLot: "Dernier lot",
    statut: { disponible: "Disponible", reserve: "Réservé", vendu: "Vendu" },
    surface: "Surface", document: "Document", dispo: "Dispo",
    thatsFor: (fcfa, eur, s) => `Soit ${fcfa} FCFA (≈ ${eur}) pour ${s}`,
    interested: "Ce terrain m'intéresse", details: "Détails", sold: "Vendu",
    favAdd: l => `Ajouter ${l} aux favoris`, seeFiche: l => `Voir la fiche : ${l}`,
    favOn: "Ajouté aux favoris", favOff: "Retiré des favoris",
    billion: "milliards",
    waInterest: (t, l, p) => `Bonjour, je suis intéressé(e) par le terrain « ${t} » à ${l} (${p}). Est-il toujours disponible ?`,
    n: n => `${n} terrain${n > 1 ? "s" : ""}`
  },
  en: {
    locale: "en-US", other: "fr", otherLabel: "FR", otherName: "Français",
    lot: "plot", lots: "plots", plot1: "1 plot", block: "Whole block",
    kindLot: "Plot", kindSurface: "Large site", lastLot: "Last plot",
    statut: { disponible: "Available", reserve: "Reserved", vendu: "Sold" },
    surface: "Area", document: "Document", dispo: "Available",
    thatsFor: (fcfa, eur, s) => `That is ${fcfa} FCFA (≈ ${eur}) for ${s}`,
    interested: "I'm interested", details: "Details", sold: "Sold",
    favAdd: l => `Add ${l} to favourites`, seeFiche: l => `See the listing: ${l}`,
    favOn: "Added to favourites", favOff: "Removed from favourites",
    billion: "billion",
    waInterest: (t, l, p) => `Hello, I am interested in the land "${t}" in ${l} (${p}). Is it still available?`,
    n: n => `${n} propert${n > 1 ? "ies" : "y"}`
  }
};

export const RATE_EUR = 655.957; // parité fixe FCFA (XOF) / euro

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const fmt = (n, L = "fr") => Math.round(n).toLocaleString(STR[L].locale).replace(/[  ]/g, " ");
export const eur = (n, L = "fr") => L === "en" ? `€${fmt(n / RATE_EUR, "en")}` : `${fmt(n / RATE_EUR, "fr")} €`;
export const tr = (t, L, k) => (L === "en" && t.en && t.en[k]) ? t.en[k] : t[k];
export const totalOf = t => t.unite === "m²" ? t.prix * t.m2 : t.prix;
export const big = (n, L = "fr") => n >= 1e9 ? (n / 1e9).toLocaleString(STR[L].locale, { maximumFractionDigits: 2 }) + " " + STR[L].billion : fmt(n, L);
export const surf = (m, L = "fr") => m >= 10000 ? fmt(m / 10000, L) + " ha" : fmt(m, L) + " m²";
export const unitOf = (t, L = "fr") => t.unite === "m²" ? "FCFA / m²" : t.unite ? `FCFA / ${STR[L].lot}` : "FCFA";
export const avail = (t, L = "fr") => t.lots ? (t.lots === 1 ? STR[L].plot1 : `${t.lots} ${STR[L].lots}`) : STR[L].block;
export const hasGps = t => t.gps && Number.isFinite(t.gps.lat) && Number.isFinite(t.gps.lng);
export const asset = (R, p) => /^https?:/.test(p) ? p : R + String(p).replace(/^\/+/, "");
export const terrainUrl = (t, L, R) => `${R}${L === "en" ? "en/" : ""}terrains/${t.id}/`;
export const homeUrl = (L, R) => `${R}${L === "en" ? "en/" : ""}`;
export const waLink = (num, msg) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
export const priceText = (t, L) => `${fmt(t.prix, L)} ${unitOf(t, L)}`;

const pin = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
export const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.3 4.5 7 4.5c2 0 3.3 1 5 3 1.7-2 3-3 5-3 3.7 0 6 3.5 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg>';

export function statusBadge(t, L) {
  if (t.statut === "vendu") return `<span class="badge sold">${STR[L].statut.vendu}</span>`;
  if (t.statut === "reserve") return `<span class="badge resv">${STR[L].statut.reserve}</span>`;
  return t.lots === 1 ? `<span class="badge hot">${STR[L].lastLot}</span>` : "";
}

export function priceBlock(t, L) {
  const tot = t.unite === "m²" ? `<span class="total">${STR[L].thatsFor(big(totalOf(t), L), eur(totalOf(t), L), surf(t.m2, L))}</span>` : "";
  return `<span class="amt">${fmt(t.prix, L)}</span><span class="unit">${unitOf(t, L)}</span><span class="eur">≈ ${eur(t.prix, L)}${t.unite === "m²" ? " / m²" : ""}</span>${tot}`;
}

export function specs(t, L) {
  const S = STR[L];
  return `<div><span>${S.surface}</span><b>${surf(t.m2, L)}</b></div><div><span>${S.document}</span><b>${esc(tr(t, L, "doc"))}</b></div><div><span>${S.dispo}</span><b>${t.statut === "vendu" ? S.statut.vendu : avail(t, L)}</b></div>`;
}

export function cardHTML(t, L, R, site, isFav = false) {
  const S = STR[L], titre = tr(t, L, "titre"), url = terrainUrl(t, L, R);
  const sold = t.statut === "vendu";
  const cta = sold
    ? `<span class="btn btn-soft is-disabled" aria-disabled="true">${S.sold}</span>`
    : `<a class="btn btn-primary" href="${waLink(site.whatsapp, S.waInterest(titre, t.lieu, priceText(t, L)))}" target="_blank" rel="noopener noreferrer">${S.interested}</a>`;
  return `<article class="card${sold ? " is-sold" : ""}">
    <div class="media">
      <img src="${asset(R, t.image)}" alt="" loading="lazy" decoding="async" width="960" height="323">
      <a class="open" href="${url}" aria-label="${esc(S.seeFiche(t.lieu))}"></a>
      <div class="badges"><span class="badge o">${t.type === "lot" ? S.kindLot : S.kindSurface}</span>${statusBadge(t, L)}</div>
      <button class="fav" type="button" data-fav="${esc(t.id)}" aria-pressed="${isFav}" aria-label="${esc(S.favAdd(t.lieu))}">${heart}</button>
      <div class="where"><small>${pin}${esc(t.zone)}</small><b>${esc(t.lieu)}</b></div>
    </div>
    <div class="body">
      <h3><a href="${url}">${esc(titre)}</a></h3>
      <div class="price">${priceBlock(t, L)}</div>
      <div class="specs">${specs(t, L)}</div>
      <ul class="checks">${tr(t, L, "points").slice(1).map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      <div class="foot">${cta}<a class="btn btn-soft" href="${url}">${S.details}</a></div>
    </div>
  </article>`;
}

// Ordre d'affichage : disponibles, puis réservés, puis vendus
export const statusRank = t => ({ disponible: 0, reserve: 1, vendu: 2 }[t.statut] ?? 0);
