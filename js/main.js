// Mon Terrain en Côte d'Ivoire — script principal (module ES)
// Données reprises des fiches officielles (octobre 2026)
// Les données des terrains sont dans data/terrains.json : c'est le seul fichier à modifier pour changer un prix ou ajouter un terrain.
let DATA;
try {
  const res = await fetch("data/terrains.json", {cache: "no-cache"});
  if (!res.ok) throw new Error(res.status);
  DATA = await res.json();
} catch (err) {
  document.getElementById("grid").innerHTML = '<p class="loading">Impossible de charger les terrains. Rechargez la page ou écrivez-nous sur WhatsApp : +225 07 49 47 93 58.</p>';
  throw err;
}
const TERRAINS = DATA.terrains;
const WA = DATA.contact.whatsapp;
const DOCS = DATA.documents;

const $ = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString("fr-FR").replace(/[  ,]/g," ");
const totalOf = t => t.unite === "m²" ? t.prix * t.m2 : t.prix;
const big = n => n >= 1e9 ? (n/1e9).toLocaleString("fr-FR",{maximumFractionDigits:2}) + " milliards" : fmt(n);
const surf = m => m >= 10000 ? fmt(m/10000) + " ha" : fmt(m) + " m²";
const unitOf = t => t.unite ? "FCFA / " + t.unite : "FCFA";
const waLink = msg => "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pin = '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
const heart = '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.3 4.5 7 4.5c2 0 3.3 1 5 3 1.7-2 3-3 5-3 3.7 0 6 3.5 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg>';
const store = {get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(_){return d}}, set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}};
const toast = msg => { const t=$("toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toast.h); toast.h=setTimeout(()=>t.classList.remove("show"),1800); };
const interestMsg = t => `Bonjour, je suis intéressé(e) par le terrain « ${t.titre} » à ${t.lieu} (${fmt(t.prix)} ${unitOf(t)}). Est-il toujours disponible ?`;

let favs = new Set(store.get("mt-favs", []));
const state = {zone:"", type:"", doc:"", budget:"", sort:""};

/* ---------- catalogue ---------- */
function card(t){
  const tot = t.unite === "m²" ? `<span class="total">Soit ${big(totalOf(t))} FCFA pour ${surf(t.m2)}</span>` : "";
  const avail = t.lots ? (t.lots === 1 ? "1 lot" : t.lots + " lots") : "Bloc entier";
  return `<article class="card">
    <div class="media">
      <img src="images/${t.id}.webp" alt="" loading="lazy" width="960" height="323">
      <button class="open" type="button" data-open="${t.id}" aria-label="Voir la fiche : ${esc(t.lieu)}"></button>
      <div class="badges"><span class="badge o">${t.type === "lot" ? "Lot" : "Grande surface"}</span>${t.lots === 1 ? '<span class="badge hot">Dernier lot</span>' : ""}</div>
      <button class="fav" type="button" data-fav="${t.id}" aria-pressed="${favs.has(t.id)}" aria-label="Ajouter ${esc(t.lieu)} aux favoris">${heart}</button>
      <div class="where"><small>${pin}${esc(t.zone)}</small><b>${esc(t.lieu)}</b></div>
    </div>
    <div class="body">
      <h3>${esc(t.titre)}</h3>
      <div class="price"><span class="amt">${fmt(t.prix)}</span><span class="unit">${unitOf(t)}</span>${tot}</div>
      <div class="specs"><div><span>Surface</span><b>${surf(t.m2)}</b></div><div><span>Document</span><b>${esc(t.doc)}</b></div><div><span>Dispo</span><b>${avail}</b></div></div>
      <ul class="checks">${t.points.slice(1).map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      <div class="foot">
        <a class="btn btn-primary" href="${waLink(interestMsg(t))}" target="_blank" rel="noopener noreferrer">Ce terrain m'intéresse</a>
        <button class="btn btn-soft" type="button" data-open="${t.id}">Détails</button>
      </div>
    </div>
  </article>`;
}
function filtered(){
  let list = TERRAINS.filter(t =>
    (!state.zone || t.zone === state.zone) &&
    (!state.type || (state.type === "fav" ? favs.has(t.id) : t.type === state.type)) &&
    (!state.doc || t.doc.includes(state.doc)) &&
    (!state.budget || (() => { const [a,b] = state.budget.split("-").map(Number); const v = totalOf(t); return v >= a && v < b; })()));
  if (state.sort === "asc") list = [...list].sort((a,b) => totalOf(a) - totalOf(b));
  if (state.sort === "desc") list = [...list].sort((a,b) => totalOf(b) - totalOf(a));
  if (state.sort === "surf") list = [...list].sort((a,b) => b.m2 - a.m2);
  return list;
}
let current = [];
function paint(){
  current = filtered();
  $("grid").innerHTML = current.length ? current.map(card).join("") :
    `<div class="empty"><strong>${state.type === "fav" ? "Aucun favori pour l'instant." : "Aucun terrain ne correspond à ces critères."}</strong><span>${state.type === "fav" ? "Touchez le cœur sur un terrain pour le retrouver ici." : "Élargissez la recherche, ou écrivez-nous : d'autres lots peuvent se libérer."}</span><button class="btn btn-soft" type="button" id="resetAll">Afficher tous les terrains</button></div>`;
  const tags = [state.zone, state.type === "lot" ? "Lots" : state.type === "surface" ? "Grandes surfaces" : state.type === "fav" ? "Favoris" : "", state.doc, state.budget ? $("fBudget").selectedOptions[0].text : ""].filter(Boolean);
  $("resultLine").textContent = `${current.length} terrain${current.length > 1 ? "s" : ""}` + (tags.length ? " · " + tags.join(" · ") : " disponibles");
  document.querySelectorAll(".seg button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.type === state.type)));
  $("fZone").value = state.zone; $("fDoc").value = state.doc; $("fBudget").value = state.budget; $("fSort").value = state.sort;
  $("fType").value = state.type === "fav" ? "" : state.type;
  const r = $("resetAll"); if (r) r.onclick = () => { Object.assign(state,{zone:"",type:"",doc:"",budget:"",sort:""}); render(); };
}
const render = () => document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches ? document.startViewTransition(paint) : paint();

function updateFavCount(){ const n = favs.size; $("favCount").hidden = !n; $("favCount").textContent = n; }
function toggleFav(id){
  favs.has(id) ? favs.delete(id) : favs.add(id);
  store.set("mt-favs", [...favs]); updateFavCount();
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => b.setAttribute("aria-pressed", String(favs.has(id))));
  toast(favs.has(id) ? "Ajouté aux favoris" : "Retiré des favoris");
  if (state.type === "fav") render();
}
$("grid").addEventListener("click", e => {
  const f = e.target.closest("[data-fav]"); if (f) return toggleFav(f.dataset.fav);
  const o = e.target.closest("[data-open]"); if (o) openFiche(o.dataset.open);
});

/* ---------- selects & filters ---------- */
const zones = [...new Set(TERRAINS.map(t => t.zone))];
$("fZone").insertAdjacentHTML("beforeend", zones.map(z => `<option value="${esc(z)}">${esc(z)}</option>`).join(""));
$("cTerrain").insertAdjacentHTML("beforeend", TERRAINS.map(t => `<option value="${t.id}">${esc(t.lieu)} · ${esc(t.titre)}</option>`).join(""));
$("footZones").innerHTML = zones.map(z => `<li><a href="#terrains" data-zone="${esc(z)}">${esc(z)}</a></li>`).join("");
/* ---------- localités : bandeau + carrousel ---------- */
const ZONE_IMG = {"Yamoussoukro":"yamoussoukro","Jacqueville":"jacqueville","Vitré":"vitre1","Anyama":"anyama-adjame","Assini":"assini-koko-manzan","Bingerville":"bingerville-barque","Autoroute du Nord":"km22-autoroute","Songon":"songon-ile-de-paques","Cocody":"cocody-djorogobite2"};
const zoneInfo = zones.map(z => {
  const list = TERRAINS.filter(t => t.zone === z), lots = list.filter(t => t.type === "lot"), surfs = list.filter(t => t.type === "surface");
  const from = lots.length ? (() => { const m = lots.reduce((a,b) => a.prix <= b.prix ? a : b); return `${fmt(m.prix)} ${unitOf(m)}`; })()
                           : (() => { const m = surfs.reduce((a,b) => a.prix <= b.prix ? a : b); return `${fmt(m.prix)} FCFA / m²`; })();
  const places = [...new Set(list.map(t => t.lieu.includes("·") ? t.lieu.split("·")[1].trim() : t.lieu))];
  return {z, n:list.length, from, places, img: ZONE_IMG[z] || list[0].id};
});
const mItem = (i, hide) => `<span class="item"${hide ? ' aria-hidden="true"' : ""}><button type="button" data-zone="${esc(i.z)}"${hide ? ' tabindex="-1"' : ""}>${esc(i.z)}<small>${i.n} terrain${i.n > 1 ? "s" : ""}</small></button></span>`;
$("marquee").innerHTML = zoneInfo.map(i => mItem(i)).join("") + zoneInfo.map(i => mItem(i, true)).join("");
$("zc").innerHTML = zoneInfo.map(i => `<button class="zcard" type="button" data-zone="${esc(i.z)}">
  <span class="zimg"><img src="images/${i.img}.webp" alt="" loading="lazy"><span class="zcount">${i.n} terrain${i.n > 1 ? "s" : ""}</span><span class="zname">${esc(i.z)}</span></span>
  <span class="zbody"><span class="zplaces">${i.places.map(p => `<span>${esc(p)}</span>`).join("")}</span>
  <span class="zfrom">À partir de<b>${i.from}</b></span><span class="zgo">Voir les terrains →</span></span></button>`).join("");
const goZone = z => { Object.assign(state, {zone:z, type:"", doc:"", budget:""}); render(); $("terrains").scrollIntoView(); };
[$("marquee"), $("zc")].forEach(el => el.addEventListener("click", e => { const b = e.target.closest("[data-zone]"); if (b) goZone(b.dataset.zone); }));
// défilement automatique du carrousel
const zc = $("zc");
const zStep = () => (zc.querySelector(".zcard")?.offsetWidth || 300) + 16;
const zMove = d => {
  const max = zc.scrollWidth - zc.clientWidth;
  if (d > 0 && zc.scrollLeft >= max - 4) zc.scrollTo({left:0, behavior:"smooth"});
  else if (d < 0 && zc.scrollLeft <= 4) zc.scrollTo({left:max, behavior:"smooth"});
  else zc.scrollBy({left:d * zStep(), behavior:"smooth"});
};
$("zcPrev").onclick = () => zMove(-1); $("zcNext").onclick = () => zMove(1);
let zPaused = false;
["mouseenter","touchstart","focusin"].forEach(ev => zc.addEventListener(ev, () => zPaused = true, {passive:true}));
["mouseleave","focusout"].forEach(ev => zc.addEventListener(ev, () => zPaused = false));
zc.addEventListener("touchend", () => setTimeout(() => zPaused = false, 4000), {passive:true});
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(() => { if (!zPaused && !document.hidden) zMove(1); }, 3000);
$("finder").addEventListener("submit", e => {
  e.preventDefault();
  Object.assign(state, {zone:$("fZone").value, type:$("fType").value, budget:$("fBudget").value});
  render(); $("terrains").scrollIntoView();
});
document.querySelectorAll(".seg button").forEach(b => b.addEventListener("click", () => { state.type = b.dataset.type; render(); }));
$("fDoc").addEventListener("change", e => { state.doc = e.target.value; render(); });
$("fSort").addEventListener("change", e => { state.sort = e.target.value; render(); });
$("footZones").addEventListener("click", e => { const a = e.target.closest("[data-zone]"); if (a) { Object.assign(state,{zone:a.dataset.zone,type:"",doc:"",budget:""}); render(); } });
const showFavs = () => { state.type = "fav"; render(); $("terrains").scrollIntoView(); };
$("favBtn").addEventListener("click", showFavs);
$("dockFav").addEventListener("click", showFavs);

/* ---------- documents ---------- */
$("docGrid").innerHTML = DOCS.map(d => {
  const n = TERRAINS.filter(t => t.doc.includes(d.key)).length;
  return `<button class="doc reveal" type="button" data-doc="${esc(d.key)}"><span class="abbr">${d.abbr}</span><h3>${d.nom}</h3><p>${d.txt}</p><span class="n"><span>${n} terrain${n > 1 ? "s" : ""}</span><span>Voir →</span></span></button>`;
}).join("");
$("docGrid").addEventListener("click", e => { const b = e.target.closest("[data-doc]"); if (!b) return; Object.assign(state,{doc:b.dataset.doc,type:"",zone:"",budget:""}); render(); $("terrains").scrollIntoView(); });

/* ---------- fiche (dialog) ---------- */
const dlg = $("fiche"); let dIndex = 0;
function fillFiche(t){
  $("dImg").src = "images/fiche-" + t.id + ".webp";
  $("dImg").alt = `Fiche officielle : ${t.lieu}, ${t.titre}, ${fmt(t.prix)} ${unitOf(t)}, document ${t.doc}`;
  $("dZone").textContent = t.lieu;
  $("dTitle").textContent = t.titre;
  $("dPrice").innerHTML = `<span class="amt">${fmt(t.prix)}</span><span class="unit">${unitOf(t)}</span>` + (t.unite === "m²" ? `<span class="total">Soit ${big(totalOf(t))} FCFA pour ${surf(t.m2)}</span>` : "");
  $("dSpecs").innerHTML = `<div><span>Surface</span><b>${surf(t.m2)}</b></div><div><span>Document</span><b>${esc(t.doc)}</b></div><div><span>Dispo</span><b>${t.lots ? t.lots + (t.lots > 1 ? " lots" : " lot") : "Bloc entier"}</b></div>`;
  $("dChecks").innerHTML = t.points.map(p => `<li>${esc(p)}</li>`).join("") + "<li>Vente sécurisée chez le notaire</li>";
  $("dWa").href = waLink(interestMsg(t));
}
function openFiche(id){
  const list = current.length ? current : TERRAINS;
  dIndex = Math.max(0, list.findIndex(t => t.id === id));
  fillFiche(list[dIndex] || TERRAINS.find(t => t.id === id));
  if (!dlg.open) dlg.showModal ? dlg.showModal() : dlg.setAttribute("open","");
}
const step = d => { const list = current.length ? current : TERRAINS; dIndex = (dIndex + d + list.length) % list.length; fillFiche(list[dIndex]); };
$("dPrev").onclick = () => step(-1); $("dNext").onclick = () => step(1);
$("dClose").onclick = () => dlg.close();
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener("keydown", e => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
let tx = null;
dlg.addEventListener("touchstart", e => tx = e.touches[0].clientX, {passive:true});
dlg.addEventListener("touchend", e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1); tx = null; });

/* ---------- hero deck ---------- */
const DECK = ["cocody-djorogobite2","jacqueville","yamoussoukro","songon-ile-de-paques","vitre1"];
const deck = $("deck");
deck.insertAdjacentHTML("beforeend", DECK.map(id => { const t = TERRAINS.find(x => x.id === id); return `<button type="button" data-open="${id}" aria-label="Voir la fiche : ${esc(t.lieu)}"><img src="images/fiche-${id}.webp" alt=""></button>`; }).join(""));
const cards = [...deck.querySelectorAll("button")];
let deckTop = 0;
function layoutDeck(){
  cards.forEach((c,i) => {
    const k = (i - deckTop + cards.length) % cards.length;
    const pos = [[0,0,0,1],[64,-14,8,.92],[-64,-14,-8,.92],[110,-28,14,.84],[-110,-28,-14,.84]][k];
    c.style.transform = `translate(-50%,-50%) translateX(${pos[0]}px) translateY(${pos[1]}px) rotate(${pos[2]}deg) scale(${pos[3]})`;
    c.style.zIndex = 10 - k;
    c.style.filter = k ? `brightness(${1 - k*.1})` : "none";
    c.tabIndex = k ? -1 : 0;
  });
}
layoutDeck();
deck.addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openFiche(b.dataset.open); });
let deckTimer = matchMedia("(prefers-reduced-motion: reduce)").matches ? null : setInterval(() => { deckTop = (deckTop + 1) % cards.length; layoutDeck(); }, 3600);
deck.addEventListener("mouseenter", () => clearInterval(deckTimer));

/* ---------- hero canvas: parcel grid ---------- */
(() => {
  const cv = $("plots"), ctx = cv.getContext("2d");
  let w, h, cells = [], t0 = performance.now();
  const S = 64;
  function size(){
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height; cv.width = w*dpr; cv.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    cells = [];
    for (let y = 0; y < h/S + 1; y++) for (let x = 0; x < w/S + 1; x++) cells.push({x, y, p: Math.random()*Math.PI*2, hot: Math.random() < .035});
  }
  function draw(now){
    const t = (now - t0) / 1000;
    ctx.clearRect(0,0,w,h);
    for (const c of cells){
      const a = .05 + .04*Math.sin(t*.6 + c.p);
      ctx.fillStyle = `rgba(110,190,130,${a})`;
      ctx.beginPath(); ctx.roundRect(c.x*S + 4, c.y*S + 4, S - 8, S - 8, 6); ctx.fill();
      if (c.hot){
        ctx.strokeStyle = `rgba(238,138,38,${.35 + .3*Math.sin(t*1.2 + c.p)})`;
        ctx.setLineDash([6,5]); ctx.lineWidth = 1.5;
        ctx.strokeRect(c.x*S + 4, c.y*S + 4, S - 8, S - 8); ctx.setLineDash([]);
      }
    }
    // route
    ctx.strokeStyle = "rgba(238,138,38,.18)"; ctx.lineWidth = 18;
    ctx.beginPath(); ctx.moveTo(0, h*.82); ctx.lineTo(w, h*.38); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1.5; ctx.setLineDash([14,12]); ctx.lineDashOffset = -t*20;
    ctx.beginPath(); ctx.moveTo(0, h*.82); ctx.lineTo(w, h*.38); ctx.stroke(); ctx.setLineDash([]);
    if (!reduce) requestAnimationFrame(draw);
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  size(); addEventListener("resize", size); requestAnimationFrame(draw);
})();

/* ---------- simulateur ---------- */
$("sTerrain").innerHTML = TERRAINS.map(t => `<option value="${t.id}">${esc(t.lieu)} · ${fmt(t.prix)} ${unitOf(t)}</option>`).join("");
$("sTerrain").value = "km22-autoroute";
function setupQty(){
  const t = TERRAINS.find(x => x.id === $("sTerrain").value), q = $("sQty");
  if (t.unite === "m²"){ $("sQtyLbl").textContent = "Surface souhaitée (m²)"; q.min = 500; q.max = t.m2; q.step = 100; q.value = Math.min(1000, t.m2); }
  else { $("sQtyLbl").textContent = "Nombre de lots"; q.min = 1; q.max = t.lots || 1; q.step = 1; q.value = 1; }
  $("sQtyWrap").hidden = t.unite !== "m²" && (t.lots || 1) === 1;
  calc();
}
function calc(){
  const t = TERRAINS.find(x => x.id === $("sTerrain").value), q = +$("sQty").value, fees = +$("sFees").value;
  const price = t.unite === "m²" ? t.prix * q : t.prix * q;
  const fa = price * fees / 100;
  $("sQtyOut").textContent = t.unite === "m²" ? fmt(q) + " m²" : q + (q > 1 ? " lots" : " lot");
  $("sFeesOut").textContent = fees.toLocaleString("fr-FR") + " %";
  $("sAmount").textContent = big(price) + " FCFA";
  $("sDetail").textContent = t.unite === "m²" ? `${fmt(q)} m² × ${fmt(t.prix)} FCFA / m² à ${t.lieu}` : `${q} × ${fmt(t.prix)} FCFA à ${t.lieu} (${surf(t.m2)}${q > 1 ? " chacun" : ""})`;
  $("sPrice").textContent = fmt(price) + " FCFA";
  $("sFeesAmt").textContent = fmt(fa) + " FCFA";
  $("sTotal").textContent = fmt(price + fa) + " FCFA";
  $("sWa").href = waLink(`Bonjour, je souhaite une offre pour ${t.lieu} (${t.titre}) : ${$("sQtyOut").textContent}, soit environ ${fmt(price)} FCFA. Pouvez-vous me rappeler ?`);
}
$("sTerrain").addEventListener("change", setupQty);
$("sQty").addEventListener("input", calc);
$("sFees").addEventListener("input", calc);
setupQty();

/* ---------- header, menu, thème ---------- */
const hdr = $("siteHeader");
const onScroll = () => hdr.classList.toggle("scrolled", scrollY > 40);
addEventListener("scroll", onScroll, {passive:true}); onScroll();
const menuBtn = $("menuBtn"), nav = $("mainNav");
menuBtn.addEventListener("click", () => { const o = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", String(o)); });
nav.addEventListener("click", e => { if (e.target.closest("a")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded","false"); } });
const savedTheme = store.get("mt-theme", null);
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
$("themeBtn").addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next; store.set("mt-theme", next);
});

/* ---------- contact ---------- */
$("copyBtn").addEventListener("click", () => {
  const num = "+225 07 49 47 93 58";
  const fallback = () => { const r = document.createRange(); r.selectNodeContents($("phone")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Numéro sélectionné"); };
  try { navigator.clipboard.writeText(num).then(() => toast("Numéro copié"), fallback); } catch (_) { fallback(); }
});
$("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const t = TERRAINS.find(x => x.id === $("cTerrain").value);
  const msg = [`Bonjour, je m'appelle ${$("cName").value.trim()}.`, t ? `Je suis intéressé(e) par : ${t.lieu}, ${t.titre}.` : "Je cherche un terrain.", $("cMsg").value.trim(), $("cTel").value.trim() ? `Mon numéro : ${$("cTel").value.trim()}` : ""].filter(Boolean).join("\n");
  const url = waLink(msg);
  $("formNote").innerHTML = `Votre message est prêt. <a href="${url}" target="_blank" rel="noopener noreferrer"><b>Ouvrir WhatsApp pour l'envoyer</b></a>. Sinon, écrivez au +225 07 49 47 93 58.`;
  window.open(url, "_blank", "noopener,noreferrer");
});

updateFavCount();
paint();

/* ---------- mode hors ligne et chargement instantané (service worker) ---------- */
if ("serviceWorker" in navigator && location.protocol === "https:") {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

