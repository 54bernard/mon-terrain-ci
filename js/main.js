// Mon Terrain en Côte d'Ivoire — script principal (module ES), commun à toutes les pages.
import { STR, esc, fmt, eur, tr, totalOf, big, surf, unitOf, asset, homeUrl, waLink, cardHTML, statusRank } from "./shared.js";

const LANG = document.documentElement.lang === "en" ? "en" : "fr";
const R = document.documentElement.dataset.root || "";
const PAGE = document.documentElement.dataset.page;
const S = STR[LANG];
const U = {
  fr: { from: "À partir de", see: "Voir les terrains →", copied: "Numéro copié", selected: "Numéro sélectionné", linkCopied: "Lien copié",
    noFav: ["Aucun favori pour l'instant.", "Touchez le cœur sur un terrain pour le retrouver ici."],
    noRes: ["Aucun terrain ne correspond à ces critères.", "Élargissez la recherche, ou écrivez-nous : d'autres lots peuvent se libérer."],
    showAll: "Afficher tous les terrains", available: "disponibles", typeLbl: { lot: "Lots", surface: "Grandes surfaces", fav: "Favoris" },
    qtyM2: "Surface souhaitée (m²)", qtyLots: "Nombre de lots", lot1: "1 lot", lotsN: n => `${n} lots`,
    detM2: (q, p, l) => `${q} m² × ${p} FCFA / m² à ${l}`, detLot: (q, p, l, s) => `${q} × ${p} FCFA à ${l} (${s}${q > 1 ? " chacun" : ""})`,
    offer: (l, t, q, p) => `Bonjour, je souhaite une offre pour ${l} (${t}) : ${q}, soit environ ${p} FCFA. Pouvez-vous me rappeler ?`,
    hello: n => `Bonjour, je m'appelle ${n}.`, interest: (l, t) => `Je suis intéressé(e) par : ${l}, ${t}.`, looking: "Je cherche un terrain.",
    visitOn: d => `Date de visite souhaitée : ${d}.`, myNum: n => `Mon numéro : ${n}`,
    visitMsg: (t, l, d, s) => `Bonjour, je souhaite visiter le terrain « ${t} » à ${l}. Date souhaitée : ${d}, ${s}.`,
    ready: url => `Votre message est prêt. <a href="${url}" target="_blank" rel="noopener noreferrer"><b>Ouvrir WhatsApp pour l'envoyer</b></a>.`,
    slots: { matin: "le matin", "apres-midi": "l'après-midi", indifferent: "à n'importe quel moment" }, name: "Nom", tel: "Tél" },
  en: { from: "From", see: "See the land →", copied: "Number copied", selected: "Number selected", linkCopied: "Link copied",
    noFav: ["No favourites yet.", "Tap the heart on a property to find it here."],
    noRes: ["No property matches these criteria.", "Widen your search, or message us: other plots may become available."],
    showAll: "Show all properties", available: "available", typeLbl: { lot: "Plots", surface: "Large sites", fav: "Favourites" },
    qtyM2: "Area wanted (m²)", qtyLots: "Number of plots", lot1: "1 plot", lotsN: n => `${n} plots`,
    detM2: (q, p, l) => `${q} m² × ${p} FCFA / m² in ${l}`, detLot: (q, p, l, s) => `${q} × ${p} FCFA in ${l} (${s}${q > 1 ? " each" : ""})`,
    offer: (l, t, q, p) => `Hello, I would like an offer for ${l} (${t}): ${q}, about ${p} FCFA. Could you call me back?`,
    hello: n => `Hello, my name is ${n}.`, interest: (l, t) => `I am interested in: ${l}, ${t}.`, looking: "I am looking for land.",
    visitOn: d => `Preferred visit date: ${d}.`, myNum: n => `My number: ${n}`,
    visitMsg: (t, l, d, s) => `Hello, I would like to visit the land "${t}" in ${l}. Preferred date: ${d}, ${s}.`,
    ready: url => `Your message is ready. <a href="${url}" target="_blank" rel="noopener noreferrer"><b>Open WhatsApp to send it</b></a>.`,
    slots: { matin: "in the morning", "apres-midi": "in the afternoon", indifferent: "at any time" }, name: "Name", tel: "Phone" }
}[LANG];

const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (_) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} } };
const toast = msg => { const t = $("toast"); if (!t) return; t.textContent = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 1800); };
const fmtDate = v => new Date(v + "T12:00:00").toLocaleDateString(S.locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const openWa = url => window.open(url, "_blank", "noopener,noreferrer");

/* ---------- commun : en-tête, menu, thème, favoris ---------- */
const hdr = $("siteHeader");
if (hdr) { const onScroll = () => hdr.classList.toggle("scrolled", scrollY > 40); addEventListener("scroll", onScroll, { passive: true }); onScroll(); }
const menuBtn = $("menuBtn"), nav = $("mainNav");
menuBtn?.addEventListener("click", () => { const o = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", String(o)); });
nav?.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });
const savedTheme = store.get("mt-theme", null);
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
$("themeBtn")?.addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next; store.set("mt-theme", next);
});

let favs = new Set(store.get("mt-favs", []));
const syncFavs = () => {
  const c = $("favCount"); if (c) { c.hidden = !favs.size; c.textContent = favs.size; }
  document.querySelectorAll("[data-fav]").forEach(b => b.setAttribute("aria-pressed", String(favs.has(b.dataset.fav))));
};
document.addEventListener("click", e => {
  const f = e.target.closest("[data-fav]"); if (!f) return;
  const id = f.dataset.fav;
  favs.has(id) ? favs.delete(id) : favs.add(id);
  store.set("mt-favs", [...favs]); syncFavs(); toast(favs.has(id) ? S.favOn : S.favOff);
  if (state.type === "fav") render();
});
const goFavs = () => { if (PAGE === "home") { state.type = "fav"; render(); $("terrains").scrollIntoView(); } else location.href = homeUrl(LANG, R) + "#favoris"; };
$("favBtn")?.addEventListener("click", goFavs);
$("dockFav")?.addEventListener("click", goFavs);

/* ---------- commun : carte ---------- */
const mapEl = $("map");

/* ---------- accueil ---------- */
const state = { zone: "", type: "", doc: "", budget: "", sort: "" };
let TERRAINS = [], SITE = {}, current = [];
let render = () => {};

if (PAGE === "home") {
  try {
    const data = await (await fetch(R + "data/terrains.json", { cache: "no-cache" })).json();
    TERRAINS = data.terrains; SITE = data.site;
  } catch (_) { /* le catalogue généré reste affiché, sans filtres dynamiques */ }

  if (TERRAINS.length) {
    const grid = $("grid");
    const filtered = () => {
      let list = TERRAINS.filter(t =>
        (!state.zone || t.zone === state.zone) &&
        (!state.type || (state.type === "fav" ? favs.has(t.id) : t.type === state.type)) &&
        (!state.doc || t.doc.includes(state.doc)) &&
        (!state.budget || (() => { const [a, b] = state.budget.split("-").map(Number); const v = totalOf(t); return v >= a && v < b; })()));
      const by = { asc: (a, b) => totalOf(a) - totalOf(b), desc: (a, b) => totalOf(b) - totalOf(a), surf: (a, b) => b.m2 - a.m2 }[state.sort];
      return [...list].sort((a, b) => statusRank(a) - statusRank(b) || (by ? by(a, b) : 0));
    };
    const paint = () => {
      current = filtered();
      const empty = state.type === "fav" ? U.noFav : U.noRes;
      grid.innerHTML = current.length ? current.map(t => cardHTML(t, LANG, R, SITE, favs.has(t.id))).join("") :
        `<div class="empty"><strong>${empty[0]}</strong><span>${empty[1]}</span><button class="btn btn-soft" type="button" id="resetAll">${U.showAll}</button></div>`;
      const tags = [state.zone, U.typeLbl[state.type], state.doc, state.budget ? $("fBudget").selectedOptions[0].text : ""].filter(Boolean);
      $("resultLine").textContent = S.n(current.length) + (tags.length ? " · " + tags.join(" · ") : " " + U.available);
      document.querySelectorAll(".seg button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.type === state.type)));
      $("fZone").value = state.zone; $("fDoc").value = state.doc; $("fBudget").value = state.budget; $("fSort").value = state.sort;
      $("fType").value = state.type === "fav" ? "" : state.type;
      $("resetAll")?.addEventListener("click", () => { Object.assign(state, { zone: "", type: "", doc: "", budget: "", sort: "" }); render(); });
    };
    render = () => document.startViewTransition && !reduce ? document.startViewTransition(paint) : paint();

    $("finder").addEventListener("submit", e => {
      e.preventDefault();
      Object.assign(state, { zone: $("fZone").value, type: $("fType").value, budget: $("fBudget").value });
      render(); $("terrains").scrollIntoView();
    });
    document.querySelectorAll(".seg button").forEach(b => b.addEventListener("click", () => { state.type = b.dataset.type; render(); }));
    $("fDoc").addEventListener("change", e => { state.doc = e.target.value; render(); });
    $("fSort").addEventListener("change", e => { state.sort = e.target.value; render(); });
    const goZone = z => { Object.assign(state, { zone: z, type: "", doc: "", budget: "" }); render(); $("terrains").scrollIntoView(); };
    $("docGrid").addEventListener("click", e => { const b = e.target.closest("[data-doc]"); if (!b) return; Object.assign(state, { doc: b.dataset.doc, type: "", zone: "", budget: "" }); render(); $("terrains").scrollIntoView(); });

    /* localités : bandeau + carrousel */
    const zones = [...new Set(TERRAINS.map(t => t.zone))];
    const ZONE_IMG = { "Vitré": "vitre1", "Songon": "songon-ile-de-paques", "Bingerville": "bingerville-barque", "Autoroute du Nord": "km22-autoroute" };
    const info = zones.map(z => {
      const list = TERRAINS.filter(t => t.zone === z && t.statut !== "vendu"), all = TERRAINS.filter(t => t.zone === z);
      const pool = (list.length ? list : all), lots = pool.filter(t => t.type === "lot"), base = lots.length ? lots : pool;
      const m = base.reduce((a, b) => a.prix <= b.prix ? a : b);
      const imgT = all.find(t => t.id === ZONE_IMG[z]) || all[0];
      return { z, n: list.length, from: `${fmt(m.prix, LANG)} ${unitOf(m, LANG)}`, img: imgT.image,
        places: [...new Set(all.map(t => t.lieu.includes("·") ? t.lieu.split("·")[1].trim() : t.lieu))] };
    });
    const item = (i, hide) => `<span class="item"${hide ? ' aria-hidden="true"' : ""}><button type="button" data-zone="${esc(i.z)}"${hide ? ' tabindex="-1"' : ""}>${esc(i.z)}<small>${S.n(i.n)}</small></button></span>`;
    $("marquee").innerHTML = info.map(i => item(i)).join("") + info.map(i => item(i, true)).join("");
    $("zc").innerHTML = info.map(i => `<button class="zcard" type="button" data-zone="${esc(i.z)}">
      <span class="zimg"><img src="${asset(R, i.img)}" alt="" loading="lazy" decoding="async"><span class="zcount">${S.n(i.n)}</span><span class="zname">${esc(i.z)}</span></span>
      <span class="zbody"><span class="zplaces">${i.places.map(p => `<span>${esc(p)}</span>`).join("")}</span>
      <span class="zfrom">${U.from}<b>${i.from}</b></span><span class="zgo">${U.see}</span></span></button>`).join("");
    [$("marquee"), $("zc"), $("footZones")].forEach(el => el?.addEventListener("click", e => { const b = e.target.closest("[data-zone]"); if (b) { e.preventDefault(); goZone(b.dataset.zone); } }));
    const zc = $("zc"), zStep = () => (zc.querySelector(".zcard")?.offsetWidth || 300) + 16;
    const zMove = d => {
      const max = zc.scrollWidth - zc.clientWidth;
      if (d > 0 && zc.scrollLeft >= max - 4) zc.scrollTo({ left: 0, behavior: "smooth" });
      else if (d < 0 && zc.scrollLeft <= 4) zc.scrollTo({ left: max, behavior: "smooth" });
      else zc.scrollBy({ left: d * zStep(), behavior: "smooth" });
    };
    $("zcPrev").onclick = () => zMove(-1); $("zcNext").onclick = () => zMove(1);
    let zPaused = false;
    ["mouseenter", "touchstart", "focusin"].forEach(ev => zc.addEventListener(ev, () => zPaused = true, { passive: true }));
    ["mouseleave", "focusout"].forEach(ev => zc.addEventListener(ev, () => zPaused = false));
    zc.addEventListener("touchend", () => setTimeout(() => zPaused = false, 4000), { passive: true });
    if (!reduce) setInterval(() => { if (!zPaused && !document.hidden) zMove(1); }, 3000);

    /* simulateur */
    const sSel = $("sTerrain");
    sSel.innerHTML = TERRAINS.filter(t => t.statut !== "vendu").map(t => `<option value="${esc(t.id)}">${esc(t.lieu)} · ${fmt(t.prix, LANG)} ${unitOf(t, LANG)}</option>`).join("");
    if (TERRAINS.some(t => t.id === "km22-autoroute" && t.statut !== "vendu")) sSel.value = "km22-autoroute";
    const sT = () => TERRAINS.find(x => x.id === sSel.value);
    const calc = () => {
      const t = sT(); if (!t) return;
      const q = +$("sQty").value, fees = +$("sFees").value, price = t.prix * q, fa = price * fees / 100;
      $("sQtyOut").textContent = t.unite === "m²" ? fmt(q, LANG) + " m²" : (q > 1 ? U.lotsN(q) : U.lot1);
      $("sFeesOut").textContent = fees.toLocaleString(S.locale) + " %";
      $("sAmount").textContent = big(price, LANG) + " FCFA";
      $("sEur").textContent = "≈ " + eur(price, LANG);
      $("sDetail").textContent = t.unite === "m²" ? U.detM2(fmt(q, LANG), fmt(t.prix, LANG), t.lieu) : U.detLot(q, fmt(t.prix, LANG), t.lieu, surf(t.m2, LANG));
      $("sPrice").textContent = fmt(price, LANG) + " FCFA";
      $("sFeesAmt").textContent = fmt(fa, LANG) + " FCFA";
      $("sTotal").textContent = `${fmt(price + fa, LANG)} FCFA · ≈ ${eur(price + fa, LANG)}`;
      $("sWa").href = waLink(SITE.whatsapp, U.offer(t.lieu, tr(t, LANG, "titre"), $("sQtyOut").textContent, fmt(price, LANG)));
    };
    const setupQty = () => {
      const t = sT(), q = $("sQty"); if (!t) return;
      if (t.unite === "m²") { $("sQtyLbl").textContent = U.qtyM2; q.min = Math.min(500, t.m2); q.max = t.m2; q.step = 100; q.value = Math.min(1000, t.m2); }
      else { $("sQtyLbl").textContent = U.qtyLots; q.min = 1; q.max = t.lots || 1; q.step = 1; q.value = 1; }
      $("sQtyWrap").hidden = t.unite !== "m²" && (t.lots || 1) === 1;
      calc();
    };
    sSel.addEventListener("change", setupQty); $("sQty").addEventListener("input", calc); $("sFees").addEventListener("input", calc);
    setupQty();

    /* formulaire de contact */
    const cDate = $("cDate"); cDate.min = todayISO();
    $("contactForm").addEventListener("submit", e => {
      e.preventDefault();
      const t = TERRAINS.find(x => x.id === $("cTerrain").value);
      const msg = [U.hello($("cName").value.trim()), t ? U.interest(t.lieu, tr(t, LANG, "titre")) : U.looking,
        cDate.value ? U.visitOn(fmtDate(cDate.value)) : "", $("cMsg").value.trim(), $("cTel").value.trim() ? U.myNum($("cTel").value.trim()) : ""].filter(Boolean).join("\n");
      const url = waLink(SITE.whatsapp, msg);
      $("formNote").innerHTML = U.ready(url);
      openWa(url);
    });

    if (location.hash === "#favoris") { state.type = "fav"; paint(); }
    else paint();
  }

  /* fiches en éventail */
  const deck = $("deck");
  if (deck) {
    const cards = [...deck.querySelectorAll("a")];
    let top = 0;
    const layoutDeck = () => cards.forEach((c, i) => {
      const k = (i - top + cards.length) % cards.length;
      const p = [[0, 0, 0, 1], [64, -14, 8, .92], [-64, -14, -8, .92], [110, -28, 14, .84], [-110, -28, -14, .84]][k] || [0, 0, 0, .8];
      c.style.transform = `translate(-50%,-50%) translateX(${p[0]}px) translateY(${p[1]}px) rotate(${p[2]}deg) scale(${p[3]})`;
      c.style.zIndex = 10 - k; c.style.filter = k ? `brightness(${1 - k * .1})` : "none"; c.tabIndex = k ? -1 : 0;
    });
    layoutDeck();
    let timer = reduce ? null : setInterval(() => { top = (top + 1) % cards.length; layoutDeck(); }, 3600);
    deck.addEventListener("mouseenter", () => clearInterval(timer));
  }

  /* fond animé : parcelles */
  const cv = $("plots");
  if (cv) {
    const ctx = cv.getContext("2d"); let w, h, cells = []; const SZ = 64, t0 = performance.now();
    const size = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = []; for (let y = 0; y < h / SZ + 1; y++) for (let x = 0; x < w / SZ + 1; x++) cells.push({ x, y, p: Math.random() * 6.28, hot: Math.random() < .035 });
    };
    let visible = true;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !reduce) requestAnimationFrame(draw); }).observe(cv);
    function draw(now) {
      const t = (now - t0) / 1000; ctx.clearRect(0, 0, w, h);
      for (const c of cells) {
        ctx.fillStyle = `rgba(110,190,130,${.05 + .04 * Math.sin(t * .6 + c.p)})`;
        ctx.beginPath(); ctx.roundRect(c.x * SZ + 4, c.y * SZ + 4, SZ - 8, SZ - 8, 6); ctx.fill();
        if (c.hot) { ctx.strokeStyle = `rgba(238,138,38,${.35 + .3 * Math.sin(t * 1.2 + c.p)})`; ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5; ctx.strokeRect(c.x * SZ + 4, c.y * SZ + 4, SZ - 8, SZ - 8); ctx.setLineDash([]); }
      }
      ctx.strokeStyle = "rgba(238,138,38,.18)"; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(0, h * .82); ctx.lineTo(w, h * .38); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1.5; ctx.setLineDash([14, 12]); ctx.lineDashOffset = -t * 20;
      ctx.beginPath(); ctx.moveTo(0, h * .82); ctx.lineTo(w, h * .38); ctx.stroke(); ctx.setLineDash([]);
      if (!reduce && visible) requestAnimationFrame(draw);
    }
    size(); addEventListener("resize", size); requestAnimationFrame(draw);
  }

  /* copier le numéro */
  $("copyBtn")?.addEventListener("click", () => {
    const fallback = () => { const r = document.createRange(); r.selectNodeContents($("phone")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast(U.selected); };
    try { navigator.clipboard.writeText($("phone").textContent.trim()).then(() => toast(U.copied), fallback); } catch (_) { fallback(); }
  });

  if (mapEl) {
    const pts = TERRAINS.filter(t => t.gps && Number.isFinite(t.gps.lat) && Number.isFinite(t.gps.lng))
      .map(t => ({ lat: t.gps.lat, lng: t.gps.lng, label: t.lieu, sub: tr(t, LANG, "titre"), href: `${R}${LANG === "en" ? "en/" : ""}terrains/${t.id}/` }));
    if (pts.length) import("./map.js").then(m => m.drawMap(mapEl, pts, R));
  }
}

/* ---------- fiche terrain ---------- */
if (PAGE === "terrain") {
  const vf = $("visitForm");
  if (vf) {
    const d = $("vDate"); d.min = todayISO();
    vf.addEventListener("submit", e => {
      e.preventDefault();
      const num = document.querySelector('a[href^="https://wa.me/"]').href.match(/wa\.me\/(\d+)/)[1];
      const msg = [U.visitMsg(vf.dataset.titre, vf.dataset.lieu, fmtDate(d.value), U.slots[$("vSlot").value]),
        `${U.name} : ${$("vName").value.trim()}`, $("vTel").value.trim() ? `${U.tel} : ${$("vTel").value.trim()}` : ""].filter(Boolean).join("\n");
      const url = waLink(num, msg), note = $("visitNote");
      note.hidden = false; note.innerHTML = U.ready(url);
      openWa(url);
    });
  }
  $("shareBtn")?.addEventListener("click", async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) { try { await navigator.share(data); return; } catch (err) { if (err.name === "AbortError") return; } }
    try { await navigator.clipboard.writeText(location.href); toast(U.linkCopied); } catch (_) { /* le bouton ne fait rien si le presse-papiers est refusé */ }
  });
  if (mapEl) import("./map.js").then(m => m.drawMap(mapEl, [{ lat: +mapEl.dataset.lat, lng: +mapEl.dataset.lng, label: mapEl.dataset.label }], R));
}

syncFavs();

/* ---------- ouverture instantanée et mode hors ligne ---------- */
if ("serviceWorker" in navigator && location.protocol === "https:") {
  addEventListener("load", () => navigator.serviceWorker.register(R + "sw.js").catch(() => {}));
}
