// Modèles HTML des pages (accueil + fiche terrain), en français et en anglais.
import { STR, esc, fmt, eur, tr, surf, avail, totalOf, big, unitOf, asset, terrainUrl, homeUrl, waLink, priceText,
  cardHTML, priceBlock, specs, statusBadge, hasGps, heart, statusRank } from "../js/shared.js";

const WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';
const I = {
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  house: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V10l7-6 7 6v11"/><path d="M10 21v-6h4v6"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>'
};

/* ------------------------------------------------------------------ textes */
export const T = {
  fr: {
    nav: [["localites", "Localités"], ["terrains", "Terrains"], ["carte", "Carte"], ["simulateur", "Simulateur"], ["diaspora", "Depuis l'étranger"], ["faq", "FAQ"], ["contact", "Contact"]],
    homeAria: "Mon Terrain en Côte d'Ivoire, accueil", theme: "Changer de thème", favs: "Voir mes favoris", menu: "Ouvrir le menu", waAria: "Écrire sur WhatsApp",
    langAria: "Read this page in English",
    title: "Mon Terrain en Côte d'Ivoire · Terrains à vendre, vente chez le notaire",
    desc: "Terrains à vendre en Côte d'Ivoire : Cocody, Bingerville, Anyama, Songon, Jacqueville, Assini, Vitré, Yamoussoukro. ACD, titre foncier ou approbation. Signature chez le notaire.",
    ogTitle: "Votre terrain, en toute sécurité · Mon Terrain en Côte d'Ivoire",
    pill: (n, m) => `${n} terrains disponibles · ${m}`,
    h1a: "Votre terrain,", h1b: "en toute sécurité.",
    lead: "<b>ACD, titre foncier ou approbation.</b> Chaque vente est signée chez le notaire. Des lots de 400 m² aux grandes surfaces de 10 hectares, d'Abidjan à Yamoussoukro.",
    searchAria: "Rechercher un terrain", zone: "Localité", all: "Toutes", type: "Type", lotsAndSurf: "Lots et surfaces", lots: "Lots", surfaces: "Grandes surfaces",
    budget: "Budget", allBudgets: "Tous budgets", budgets: ["Moins de 15 M", "15 à 30 M", "30 à 500 M", "Plus de 500 M"], search: "Rechercher",
    trust1: "Signature chez le notaire", trust2: "Document annoncé sur chaque fiche",
    deckAria: "Fiches de terrains à la une", from: "À partir de", upTo: "Jusqu'à", ha10: "10 hectares",
    marqueeAria: "Localités où se trouvent nos terrains",
    zKicker: "Nos localités", zTitle: "Où se trouvent nos terrains", zPrev: "Localité précédente", zNext: "Localité suivante", zAria: "Localités, faites défiler",
    wKicker: "Immobilier sécurisé &amp; foncier", wTitle: "Acheter un terrain sans mauvaise surprise",
    wLead: "Nous vendons des terrains dont le document est connu à l'avance. Vous visitez, vous vérifiez, puis vous signez chez le notaire.",
    b1t: "100 % des ventes chez le notaire", b1p: "Aucun paiement de la main à la main. L'acte et le paiement passent par l'étude notariale.",
    b2alt: "Terrain de 1 097 m² à Vitré 1, en bordure de grande voie", b2t: "Terrains réels, photos réelles", b2p: "Vitré 1 · 1 097 m² en bordure de grande voie",
    b3t: "lots disponibles", b3p: n => `répartis sur ${n} offres de lots`, b4t: "localités", b4p: "Abidjan, Grand Abidjan, littoral et Yamoussoukro",
    b5t: "types de documents", b5p: "ACD, TF, approbation, certificat foncier, attestation",
    b6t: "Pour tous les projets", b6p: "Un premier lot à 5 500 000 FCFA à Yamoussoukro, un terrain pour votre maison à Bingerville, ou 10 hectares à Eloka pour un programme immobilier.",
    cKicker: "Catalogue", cTitle: "Nos terrains disponibles", cLead: "Filtrez par type, document ou budget. Touchez le cœur pour garder un terrain en favori.",
    typeAria: "Type de terrain", tAll: "Tout", favsLbl: "Favoris", docAria: "Document", allDocs: "Tous documents",
    docOpts: [["ACD", "ACD"], ["TF", "Titre foncier"], ["Approbation", "Approbation"], ["Certificat foncier", "Certificat foncier"], ["Attestation", "Attestation"]],
    sortAria: "Trier", sorts: [["", "Recommandés"], ["asc", "Prix total croissant"], ["desc", "Prix total décroissant"], ["surf", "Plus grande surface"]],
    mKicker: "Carte", mTitle: "Tous nos terrains sur la carte", mLead: "Touchez un repère pour ouvrir la fiche du terrain.",
    sKicker: "Simulateur", sTitle: "Estimez votre budget", sLead: "Choisissez un terrain et la surface ou le nombre de lots. Le calcul utilise les prix affichés sur nos fiches.",
    sTerrain: "Terrain", sQty: "Surface souhaitée", sFees: "Frais de notaire et de mutation estimés", sPriceLbl: "Prix du terrain", sFeesLbl: "Frais estimés", sTotal: "Budget total estimé",
    sNote: "Estimation indicative. Le taux réel des frais est communiqué par le notaire. La surface minimale vendue sur une grande surface est à confirmer avec nous.",
    sWa: "Recevoir une offre sur WhatsApp",
    dKicker: "Depuis l'étranger", dTitle: "Vous vivez hors de Côte d'Ivoire ?",
    dLead: "Beaucoup de nos acheteurs vivent à l'étranger. Tous nos prix sont affichés aussi en euros, à la parité fixe 1 € = 655,957 FCFA.",
    dSteps: [["Choisissez à distance", "Nous vous envoyons sur WhatsApp les fiches, les photos et le document du terrain."],
      ["Faites visiter", "Vous visitez vous-même lors d'un séjour, ou vous envoyez une personne de confiance."],
      ["Vérifiez le document", "Le document du terrain (ACD, TF, approbation…) est vérifié avant tout paiement."],
      ["Signez via le notaire", "Le paiement et l'acte passent par l'étude notariale. Les modalités à distance se règlent avec le notaire."]],
    docKicker: "Sécurité foncière", docTitle: "Le document de chaque terrain est connu", docLead: "Cliquez sur un document pour voir les terrains qui l'ont.", see: "Voir →",
    pKicker: "Démarche", pTitle: "Du premier message à la signature", pLead: "Quatre étapes, dans cet ordre, pour chaque achat.",
    steps: [["Vous nous écrivez", "Sur WhatsApp, indiquez la localité, la surface et votre budget. Nous envoyons les fiches qui correspondent."],
      ["Visite du terrain", "Nous organisons la visite sur site pour voir le lot, l'accès et les voies."],
      ["Vérification du document", "Vous consultez l'ACD, le titre foncier, l'approbation ou l'attestation du terrain."],
      ["Signature chez le notaire", "La vente est signée devant notaire. Le paiement et l'acte sont sécurisés."]],
    fKicker: "Questions fréquentes", fTitle: "Vos questions avant d'acheter",
    faq: [["Qu'est-ce que l'ACD ?", "L'Arrêté de Concession Définitive est l'acte par lequel l'État attribue définitivement un terrain à son propriétaire. C'est le document de référence en Côte d'Ivoire. Le document de chaque terrain est indiqué sur sa fiche."],
      ["Où se signe la vente ?", "Toutes nos ventes sont signées chez le notaire. Le paiement passe par l'étude notariale, jamais de la main à la main."],
      ["Comment visiter un terrain ?", "Sur la fiche du terrain, choisissez une date dans « Demander une visite », ou écrivez-nous sur WhatsApp au +225 07 49 47 93 58."],
      ["Puis-je acheter plusieurs lots ?", "Oui, quand plusieurs lots sont disponibles. À Jacqueville, par exemple, 2 lots de 600 m² collés sont en vente. À Yamoussoukro, 100 lots sont disponibles."],
      ["J'habite à l'étranger, comment faire ?", "Contactez-nous sur WhatsApp. Nous vous envoyons les fiches, les photos et les informations sur le document du terrain, puis nous organisons la suite avec vous et le notaire."]],
    ctKicker: "Contact", ctTitle: "Parlons de votre futur terrain", ctLead: "Écrivez-nous sur WhatsApp. Nous répondons avec les fiches, les photos et le document du terrain qui vous intéresse.",
    copy: "Copier le numéro", name: "Nom complet", namePh: "Ex. Kouassi Aya", tel: "Téléphone", terrainQ: "Terrain qui vous intéresse", advise: "Conseillez-moi",
    visitDate: "Date de visite souhaitée", msg: "Message", msgPh: "Budget, surface souhaitée…", send: "Préparer mon message WhatsApp", note: "Le message s'ouvre dans WhatsApp. Vous l'envoyez vous-même.",
    fAbout: "Immobilier sécurisé &amp; foncier. Terrains à vendre avec ACD, titre foncier ou approbation. Signature chez le notaire.",
    fZones: "Localités", fContact: "Contact", fWrite: "Écrire sur WhatsApp", fSee: "Voir les terrains", fFaq: "Questions fréquentes",
    legal: "Prix en FCFA, sous réserve de disponibilité. Conversion en euros indicative.", dock: ["Terrains", "Favoris", "WhatsApp"], dockAria: "Actions rapides",
    // fiche terrain
    crumbHome: "Accueil", crumbTerrains: "Terrains", fullSheet: l => `Fiche officielle du terrain : ${l}`,
    share: "Partager", shareAria: "Partager ce terrain", fav: "Favori",
    galleryT: "Photos du terrain", mapT: "Emplacement", mapNote: "Position indicative. L'emplacement exact est montré lors de la visite.",
    visitT: "Demander une visite", visitLead: "Choisissez une date et un moment. Votre demande part sur WhatsApp, vous l'envoyez vous-même.",
    slot: "Moment", slots: [["matin", "Le matin"], ["apres-midi", "L'après-midi"], ["indifferent", "Peu importe"]], visitSend: "Envoyer ma demande sur WhatsApp",
    docT: "Le document de ce terrain", relT: "Terrains similaires", prevT: "Terrain précédent", nextT: "Terrain suivant", back: "← Tous les terrains",
    soldNote: "Ce terrain est vendu. Écrivez-nous : d'autres lots peuvent correspondre à votre projet.",
    resvNote: "Ce terrain est réservé. Écrivez-nous pour être prévenu s'il se libère.",
    t404: "Page introuvable", h404a: "Cette page", h404b: "n'existe pas.", p404: "Le terrain que vous cherchez est peut-être déjà vendu. Voyez les terrains disponibles ou écrivez-nous sur WhatsApp au <b>+225 07 49 47 93 58</b>."
  },
  en: {
    nav: [["localites", "Locations"], ["terrains", "Land"], ["carte", "Map"], ["simulateur", "Calculator"], ["diaspora", "From abroad"], ["faq", "FAQ"], ["contact", "Contact"]],
    homeAria: "Mon Terrain en Côte d'Ivoire, home", theme: "Switch theme", favs: "See my favourites", menu: "Open the menu", waAria: "Message us on WhatsApp",
    langAria: "Lire cette page en français",
    title: "Mon Terrain en Côte d'Ivoire · Land for sale, signed at the notary's office",
    desc: "Land for sale in Côte d'Ivoire: Cocody, Bingerville, Anyama, Songon, Jacqueville, Assini, Vitré, Yamoussoukro. ACD, land title or approval. Signed at the notary's office.",
    ogTitle: "Your land, fully secured · Mon Terrain en Côte d'Ivoire",
    pill: (n, m) => `${n} properties available · ${m}`,
    h1a: "Your land,", h1b: "fully secured.",
    lead: "<b>ACD, land title or approval.</b> Every sale is signed at the notary's office. From 400 m² plots to 10-hectare sites, from Abidjan to Yamoussoukro.",
    searchAria: "Search for land", zone: "Location", all: "All", type: "Type", lotsAndSurf: "Plots and sites", lots: "Plots", surfaces: "Large sites",
    budget: "Budget", allBudgets: "Any budget", budgets: ["Under 15 M", "15 to 30 M", "30 to 500 M", "Over 500 M"], search: "Search",
    trust1: "Signed at the notary's office", trust2: "Document stated on every listing",
    deckAria: "Featured listings", from: "From", upTo: "Up to", ha10: "10 hectares",
    marqueeAria: "Locations of our properties",
    zKicker: "Our locations", zTitle: "Where our land is", zPrev: "Previous location", zNext: "Next location", zAria: "Locations, scroll sideways",
    wKicker: "Secure real estate &amp; land", wTitle: "Buying land without bad surprises",
    wLead: "We sell land whose document is known in advance. You visit, you check, then you sign at the notary's office.",
    b1t: "100% of sales at the notary's", b1p: "No cash changes hands directly. The deed and the payment go through the notary's office.",
    b2alt: "1,097 m² plot in Vitré 1, on a main road", b2t: "Real land, real photos", b2p: "Vitré 1 · 1,097 m² on a main road",
    b3t: "plots available", b3p: n => `across ${n} plot offers`, b4t: "locations", b4p: "Abidjan, Greater Abidjan, the coast and Yamoussoukro",
    b5t: "document types", b5p: "ACD, TF, approval, land certificate, attestation",
    b6t: "For every project", b6p: "A first plot for 5,500,000 FCFA in Yamoussoukro, land for your home in Bingerville, or 10 hectares in Eloka for a housing scheme.",
    cKicker: "Catalogue", cTitle: "Our available land", cLead: "Filter by type, document or budget. Tap the heart to keep a property in your favourites.",
    typeAria: "Type of land", tAll: "All", favsLbl: "Favourites", docAria: "Document", allDocs: "All documents",
    docOpts: [["ACD", "ACD"], ["TF", "Land title"], ["Approbation", "Approval"], ["Certificat foncier", "Land certificate"], ["Attestation", "Attestation"]],
    sortAria: "Sort", sorts: [["", "Recommended"], ["asc", "Total price, low to high"], ["desc", "Total price, high to low"], ["surf", "Largest area"]],
    mKicker: "Map", mTitle: "All our land on the map", mLead: "Tap a marker to open the listing.",
    sKicker: "Calculator", sTitle: "Estimate your budget", sLead: "Choose a property and the area or number of plots. The calculation uses the prices on our listings.",
    sTerrain: "Property", sQty: "Area wanted", sFees: "Estimated notary and transfer fees", sPriceLbl: "Land price", sFeesLbl: "Estimated fees", sTotal: "Estimated total budget",
    sNote: "Indicative estimate. The notary gives the actual fee rate. The minimum area sold on a large site must be confirmed with us.",
    sWa: "Get an offer on WhatsApp",
    dKicker: "From abroad", dTitle: "Living outside Côte d'Ivoire?",
    dLead: "Many of our buyers live abroad. All prices are also shown in euros, at the fixed rate €1 = 655.957 FCFA.",
    dSteps: [["Choose remotely", "We send you the listings, photos and land document on WhatsApp."],
      ["Arrange a visit", "Visit yourself during a stay, or send someone you trust."],
      ["Check the document", "The land document (ACD, TF, approval…) is checked before any payment."],
      ["Sign through the notary", "Payment and the deed go through the notary's office. Remote arrangements are settled with the notary."]],
    docKicker: "Land security", docTitle: "Every property's document is known", docLead: "Click a document to see the properties that have it.", see: "See →",
    pKicker: "How it works", pTitle: "From the first message to signing", pLead: "Four steps, in this order, for every purchase.",
    steps: [["You message us", "On WhatsApp, tell us the location, area and budget. We send the matching listings."],
      ["Site visit", "We arrange a visit to see the plot, the access and the roads."],
      ["Document check", "You review the ACD, land title, approval or attestation of the land."],
      ["Signing at the notary's", "The sale is signed before a notary. Payment and the deed are secured."]],
    fKicker: "FAQ", fTitle: "Your questions before buying",
    faq: [["What is the ACD?", "The Arrêté de Concession Définitive (Final Concession Decree) is the deed by which the State definitively grants land to its owner. It is the reference document in Côte d'Ivoire. Each property's document is shown on its listing."],
      ["Where is the sale signed?", "All our sales are signed at the notary's office. Payment goes through the notary, never hand to hand."],
      ["How can I visit a property?", "On the property's page, pick a date under \"Request a visit\", or message us on WhatsApp at +225 07 49 47 93 58."],
      ["Can I buy several plots?", "Yes, when several plots are available. In Jacqueville, for example, 2 adjoining 600 m² plots are for sale. In Yamoussoukro, 100 plots are available."],
      ["I live abroad. How does it work?", "Message us on WhatsApp. We send you the listings, photos and information about the land document, then we arrange the next steps with you and the notary."]],
    ctKicker: "Contact", ctTitle: "Let's talk about your future land", ctLead: "Message us on WhatsApp. We reply with the listings, photos and document of the property you are interested in.",
    copy: "Copy the number", name: "Full name", namePh: "e.g. Aya Kouassi", tel: "Phone", terrainQ: "Property you are interested in", advise: "Advise me",
    visitDate: "Preferred visit date", msg: "Message", msgPh: "Budget, area wanted…", send: "Prepare my WhatsApp message", note: "The message opens in WhatsApp. You send it yourself.",
    fAbout: "Secure real estate &amp; land. Land for sale with ACD, land title or approval. Signed at the notary's office.",
    fZones: "Locations", fContact: "Contact", fWrite: "Message us on WhatsApp", fSee: "See the land", fFaq: "FAQ",
    legal: "Prices in FCFA, subject to availability. Euro conversion is indicative.", dock: ["Land", "Favourites", "WhatsApp"], dockAria: "Quick actions",
    crumbHome: "Home", crumbTerrains: "Land", fullSheet: l => `Official listing sheet: ${l}`,
    share: "Share", shareAria: "Share this property", fav: "Favourite",
    galleryT: "Photos", mapT: "Location", mapNote: "Approximate position. The exact location is shown during the visit.",
    visitT: "Request a visit", visitLead: "Pick a date and a time of day. Your request opens in WhatsApp and you send it yourself.",
    slot: "Time of day", slots: [["matin", "Morning"], ["apres-midi", "Afternoon"], ["indifferent", "Either"]], visitSend: "Send my request on WhatsApp",
    docT: "This property's document", relT: "Similar properties", prevT: "Previous property", nextT: "Next property", back: "← All properties",
    soldNote: "This property is sold. Message us: other plots may suit your project.",
    resvNote: "This property is reserved. Message us to be told if it becomes available.",
    t404: "Page not found", h404a: "This page", h404b: "does not exist.", p404: "The property you are looking for may already be sold. See the available land or message us on WhatsApp at <b>+225 07 49 47 93 58</b>."
  }
};

/* ------------------------------------------------------------------ gabarit commun */
export function layout({ L, R, site, title, desc, path, altPath, ogImage, ogTitle, ld, body, csp, fontFile, page }) {
  const url = site.url + path, alt = site.url + altPath;
  return `<!doctype html>
<html lang="${L}" data-page="${page}" data-root="${R}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="${L}" href="${url}">
<link rel="alternate" hreflang="${STR[L].other}" href="${alt}">
<link rel="alternate" hreflang="x-default" href="${L === "fr" ? url : alt}">
<meta name="theme-color" content="#0f2e1f">
<meta property="og:type" content="website">
<meta property="og:locale" content="${L === "fr" ? "fr_CI" : "en_GB"}">
<meta property="og:site_name" content="${esc(site.nom)}">
<meta property="og:title" content="${esc(ogTitle || title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.url + ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="${R}favicon.png">
<link rel="apple-touch-icon" href="${R}images/icon-192.png">
<link rel="manifest" href="${R}manifest.webmanifest">
<link rel="preload" href="${R}fonts/${fontFile}" as="font" type="font/woff2" crossorigin>
${page === "home" ? `<link rel="preload" href="${R}data/terrains.json" as="fetch" crossorigin>\n` : ""}<link rel="stylesheet" href="${R}css/style.css">
<script type="module" src="${R}js/main.js"></script>
<script type="speculationrules">{"prerender":[{"where":{"selector_matches":"a[href*='terrains/']"},"eagerness":"moderate"}]}</script>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
</head>
<body>
${body}
</body>
</html>
`;
}

function header(L, R, home, altHref, anyGps) {
  const t = T[L], S = STR[L], base = home ? "" : homeUrl(L, R);
  const nav = t.nav.filter(([id]) => id !== "carte" || anyGps);
  return `<div class="progress" aria-hidden="true"></div>
<header class="site" id="siteHeader">
  <div class="bar">
    <a class="brand" href="${home ? "#accueil" : homeUrl(L, R)}" aria-label="${t.homeAria}">
      <img src="${R}images/logo.png" alt="" width="44" height="44">
      <span><b>MON TERRAIN</b><small>${L === "fr" ? "EN CÔTE D'IVOIRE" : "IN CÔTE D'IVOIRE"}</small></span>
    </a>
    <nav class="main" id="mainNav">
      ${nav.map(([id, lbl]) => `<a href="${base}#${id}">${lbl}</a>`).join("\n      ")}
    </nav>
    <div class="bar-actions">
      <a class="icon-btn lang" href="${altHref}" hreflang="${S.other}" lang="${S.other}" aria-label="${t.langAria}">${S.otherLabel}</a>
      <button class="icon-btn" id="themeBtn" type="button" aria-label="${t.theme}">${I.moon}</button>
      <button class="icon-btn" id="favBtn" type="button" aria-label="${t.favs}">${heart.replace("<svg", '<svg fill="none" stroke="currentColor" stroke-width="2"')}<span class="count" id="favCount" hidden>0</span></button>
      <button class="icon-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="mainNav" aria-label="${t.menu}">${I.menu}</button>
      <a class="btn btn-primary" href="https://wa.me/WA_NUM" target="_blank" rel="noopener noreferrer" aria-label="${t.waAria}">${WA_SVG}<span class="btn-wa-label">WhatsApp</span></a>
    </div>
  </div>
</header>`;
}

function footer(L, R, zones, home) {
  const t = T[L], base = home ? "" : homeUrl(L, R);
  return `<footer>
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="brand" href="${homeUrl(L, R)}"><img src="${R}images/logo.png" alt="" width="44" height="44"><span><b>MON TERRAIN</b><small>${L === "fr" ? "EN CÔTE D'IVOIRE" : "IN CÔTE D'IVOIRE"}</small></span></a>
        <p class="foot-about">${t.fAbout}</p>
      </div>
      <div><h4>${t.fZones}</h4><ul id="footZones">${zones.map(z => `<li><a href="${base}#terrains" data-zone="${esc(z)}">${esc(z)}</a></li>`).join("")}</ul></div>
      <div><h4>${t.fContact}</h4><ul><li>WhatsApp : TEL_AFF</li><li><a href="https://wa.me/WA_NUM" target="_blank" rel="noopener noreferrer">${t.fWrite}</a></li><li><a href="${base}#terrains">${t.fSee}</a></li><li><a href="${base}#faq">${t.fFaq}</a></li></ul></div>
    </div>
    <div class="legal"><span>© ${new Date().getFullYear()} Mon Terrain en Côte d'Ivoire</span><span>${t.legal}</span></div>
  </div>
</footer>
<a class="wa-float" href="https://wa.me/WA_NUM" target="_blank" rel="noopener noreferrer" aria-label="${t.waAria} TEL_AFF">${WA_SVG}</a>
<nav class="dock" aria-label="${t.dockAria}">
  <a href="${base}#terrains">${I.grid}${t.dock[0]}</a>
  <button type="button" id="dockFav">${heart.replace("<svg", '<svg fill="none" stroke="currentColor" stroke-width="2"')}${t.dock[1]}</button>
  <a class="wa" href="https://wa.me/WA_NUM" target="_blank" rel="noopener noreferrer">${WA_SVG}${t.dock[2]}</a>
</nav>
<div class="toast" id="toast" role="status"></div>`;
}

const fill = (html, site) => html.replaceAll("WA_NUM", site.whatsapp).replaceAll("TEL_AFF", site.telephone);

/* ------------------------------------------------------------------ accueil */
export function homePage({ L, R, site, terrains, docs, month }) {
  const t = T[L], S = STR[L];
  const zones = [...new Set(terrains.map(x => x.zone))];
  const avl = terrains.filter(x => x.statut !== "vendu");
  const lotOffers = avl.filter(x => x.type === "lot");
  const lotsCount = lotOffers.reduce((a, x) => a + (x.lots || 0), 0);
  const deck = ["cocody-djorogobite2", "jacqueville", "yamoussoukro", "songon-ile-de-paques", "vitre1"].map(id => terrains.find(x => x.id === id)).filter(Boolean);
  const minLot = Math.min(...lotOffers.map(x => x.prix));
  const sorted = [...terrains].sort((a, b) => statusRank(a) - statusRank(b));
  const anyGps = terrains.some(hasGps);
  const body = `${header(L, R, true, homeUrl(S.other, R), anyGps)}
<main id="accueil">
  <section class="hero">
    <canvas id="plots" aria-hidden="true"></canvas>
    <div class="wrap">
      <div>
        <span class="pill"><i></i>${t.pill(avl.length, month)}</span>
        <h1><span class="line">${t.h1a}</span><span class="line o">${t.h1b}</span></h1>
        <p class="lead">${t.lead}</p>
        <form class="search" id="finder" aria-label="${t.searchAria}">
          <div class="f"><label for="fZone">${t.zone}</label><select id="fZone"><option value="">${t.all}</option>${zones.map(z => `<option value="${esc(z)}">${esc(z)}</option>`).join("")}</select></div>
          <div class="f"><label for="fType">${t.type}</label><select id="fType"><option value="">${t.lotsAndSurf}</option><option value="lot">${t.lots}</option><option value="surface">${t.surfaces}</option></select></div>
          <div class="f"><label for="fBudget">${t.budget}</label><select id="fBudget"><option value="">${t.allBudgets}</option>${["0-15000000", "15000000-30000000", "30000000-500000000", "500000000-1e13"].map((v, i) => `<option value="${v}">${t.budgets[i]}</option>`).join("")}</select></div>
          <button class="btn btn-primary" type="submit">${I.search}${t.search}</button>
        </form>
        <div class="trust"><span>${I.shield}${t.trust1}</span><span>${I.doc}${t.trust2}</span></div>
      </div>
      <div class="deck" id="deck" aria-label="${t.deckAria}">
        <div class="float f1"><span class="dot">${I.pin}</span><span>${t.from}<b>${fmt(minLot, L)} FCFA</b></span></div>
        <div class="float f2"><span class="dot">${I.house}</span><span>${t.upTo}<b>${t.ha10}</b></span></div>
        ${deck.map(x => `<a href="${terrainUrl(x, L, R)}" aria-label="${esc(S.seeFiche(x.lieu))}"><img src="${asset(R, x.fiche)}" alt="" width="800" height="1000"></a>`).join("")}
      </div>
    </div>
  </section>

  <div class="marquee" aria-label="${t.marqueeAria}"><div class="track" id="marquee"></div></div>

  <section class="zones-sec" id="localites" aria-labelledby="zcTitle">
    <div class="wrap zc-head">
      <div><span class="kicker">${t.zKicker}</span><h2 id="zcTitle">${t.zTitle}</h2></div>
      <div class="zc-nav"><button type="button" id="zcPrev" aria-label="${t.zPrev}">${I.prev}</button><button type="button" id="zcNext" aria-label="${t.zNext}">${I.next}</button></div>
    </div>
    <div class="zc-wrap"><div class="zc" id="zc" tabindex="0" aria-label="${t.zAria}"></div></div>
  </section>

  <section class="block" id="pourquoi">
    <div class="wrap">
      <div class="head reveal"><div><span class="kicker">${t.wKicker}</span><h2>${t.wTitle}</h2></div><p>${t.wLead}</p></div>
      <div class="bento">
        <div class="tile dark t-wide reveal"><span class="ic">${I.shield}</span><div><h3>${t.b1t}</h3><p>${t.b1p}</p></div><span class="plots" aria-hidden="true"></span></div>
        <div class="tile photo reveal"><img src="${R}images/vitre1.webp" alt="${t.b2alt}" loading="lazy" decoding="async"><div class="cap"><h3>${t.b2t}</h3><p>${t.b2p}</p></div></div>
        <div class="tile orange reveal"><span class="big">${lotsCount}</span><div><h3>${t.b3t}</h3><p>${t.b3p(lotOffers.length)}</p></div></div>
        <div class="tile reveal"><span class="big">${zones.length}</span><div><h3>${t.b4t}</h3><p>${t.b4p}</p></div></div>
        <div class="tile reveal"><span class="big">${docs.length}</span><div><h3>${t.b5t}</h3><p>${t.b5p}</p></div></div>
        <div class="tile t-wide reveal"><span class="ic">${I.house}</span><div><h3>${t.b6t}</h3><p>${t.b6p}</p></div></div>
      </div>
    </div>
  </section>

  <section class="block pt-1" id="terrains">
    <div class="wrap">
      <div class="head reveal"><div><span class="kicker">${t.cKicker}</span><h2>${t.cTitle}</h2></div><p>${t.cLead}</p></div>
      <div class="toolbar">
        <div class="seg" role="group" aria-label="${t.typeAria}">
          <button type="button" data-type="" aria-pressed="true">${t.tAll}</button><button type="button" data-type="lot" aria-pressed="false">${t.lots}</button><button type="button" data-type="surface" aria-pressed="false">${t.surfaces}</button><button type="button" data-type="fav" aria-pressed="false">${heart.replace("<svg", '<svg fill="currentColor"')}${t.favsLbl}</button>
        </div>
        <div class="tb-right">
          <select id="fDoc" aria-label="${t.docAria}"><option value="">${t.allDocs}</option>${t.docOpts.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select>
          <select id="fSort" aria-label="${t.sortAria}">${t.sorts.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select>
        </div>
      </div>
      <p class="result-line" id="resultLine" aria-live="polite">${S.n(terrains.length)}</p>
      <div class="grid" id="grid">${sorted.map(x => cardHTML(x, L, R, site)).join("\n")}</div>
    </div>
  </section>
${anyGps ? `
  <section class="block pt-2" id="carte">
    <div class="wrap">
      <div class="head reveal"><div><span class="kicker">${t.mKicker}</span><h2>${t.mTitle}</h2></div><p>${t.mLead}</p></div>
      <div class="map big-map" id="map" data-mode="all"></div>
    </div>
  </section>` : ""}
  <section class="block pt-2" id="simulateur">
    <div class="wrap">
      <div class="head reveal"><div><span class="kicker">${t.sKicker}</span><h2>${t.sTitle}</h2></div><p>${t.sLead}</p></div>
      <div class="sim reveal">
        <div class="sim-panel">
          <div><label for="sTerrain">${t.sTerrain}</label><select id="sTerrain"></select></div>
          <div id="sQtyWrap"><label for="sQty" id="sQtyLbl">${t.sQty}</label><div class="range-row"><input type="range" id="sQty"><output id="sQtyOut" for="sQty"></output></div></div>
          <div><label for="sFees">${t.sFees}</label><div class="range-row"><input type="range" id="sFees" min="0" max="15" step="0.5" value="10"><output id="sFeesOut" for="sFees">10 %</output></div></div>
        </div>
        <div class="sim-out">
          <span class="plots" aria-hidden="true"></span>
          <div><p class="lbl">${t.sPriceLbl}</p><p class="amount" id="sAmount">–</p><p class="detail" id="sEur"></p><p class="detail" id="sDetail"></p></div>
          <dl><dt>${t.sPriceLbl}</dt><dd id="sPrice">–</dd><dt>${t.sFeesLbl}</dt><dd id="sFeesAmt">–</dd><dt>${t.sTotal}</dt><dd id="sTotal" class="hl">–</dd></dl>
          <p class="sim-note">${t.sNote}</p>
          <a id="sWa" href="https://wa.me/WA_NUM" target="_blank" rel="noopener noreferrer" class="btn btn-primary self-start">${t.sWa}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="block pt-2" id="diaspora">
    <div class="wrap">
      <div class="diaspora reveal">
        <div class="dia-head"><span class="kicker">${t.dKicker}</span><h2 class="h2">${t.dTitle}</h2><p>${t.dLead}</p>
          <div class="fx"><span>1 €</span><b>=</b><span>655,957 FCFA</span></div></div>
        <ol class="dia-steps">${t.dSteps.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join("")}</ol>
      </div>
    </div>
  </section>

  <section class="block pt-2" id="documents">
    <div class="wrap">
      <div class="head reveal"><div><span class="kicker">${t.docKicker}</span><h2>${t.docTitle}</h2></div><p>${t.docLead}</p></div>
      <div class="docs" id="docGrid">${docs.map(d => { const n = terrains.filter(x => x.doc.includes(d.key)).length; return `<button class="doc reveal" type="button" data-doc="${esc(d.key)}"><span class="abbr">${d.abbr}</span><h3>${esc(L === "en" ? d.en.nom : d.nom)}</h3><p>${esc(L === "en" ? d.en.txt : d.txt)}</p><span class="n"><span>${S.n(n)}</span><span>${t.see}</span></span></button>`; }).join("")}</div>
    </div>
  </section>

  <section class="block process" id="demarche">
    <div class="wrap">
      <div class="head reveal"><div><span class="kicker">${t.pKicker}</span><h2>${t.pTitle}</h2></div><p>${t.pLead}</p></div>
      <ol class="steps">${t.steps.map(([h, p]) => `<li class="reveal"><h3>${h}</h3><p>${p}</p></li>`).join("")}</ol>
    </div>
  </section>

  <section class="block" id="faq">
    <div class="wrap faq-wrap">
      <div class="reveal"><span class="kicker">${t.fKicker}</span><h2 class="h2">${t.fTitle}</h2></div>
      <div class="faq">${t.faq.map(([q, a], i) => `<details${i ? "" : " open"}><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
    </div>
  </section>

  <section class="block pt-0" id="contact">
    <div class="wrap">
      <div class="cta reveal">
        <span class="plots" aria-hidden="true"></span>
        <div>
          <span class="kicker kicker-dark">${t.ctKicker}</span><h2 class="mt">${t.ctTitle}</h2><p>${t.ctLead}</p>
          <div class="phone-row"><span class="phone" id="phone">TEL_AFF</span><button class="copy" type="button" id="copyBtn">${t.copy}</button></div>
        </div>
        <form class="form" id="contactForm">
          <div><label for="cName">${t.name}</label><input id="cName" required placeholder="${t.namePh}" autocomplete="name"></div>
          <div><label for="cTel">${t.tel}</label><input id="cTel" type="tel" placeholder="+225 …" autocomplete="tel"></div>
          <div class="full"><label for="cTerrain">${t.terrainQ}</label><select id="cTerrain"><option value="">${t.advise}</option>${terrains.filter(x => x.statut !== "vendu").map(x => `<option value="${esc(x.id)}">${esc(x.lieu)} · ${esc(tr(x, L, "titre"))}</option>`).join("")}</select></div>
          <div class="full"><label for="cDate">${t.visitDate}</label><input id="cDate" type="date"></div>
          <div class="full"><label for="cMsg">${t.msg}</label><textarea id="cMsg" placeholder="${t.msgPh}"></textarea></div>
          <div class="full"><button class="btn btn-dark" type="submit">${t.send}</button></div>
          <p class="note full" id="formNote">${t.note}</p>
        </form>
      </div>
    </div>
  </section>
</main>
${footer(L, R, zones, true)}`;
  return fill(body, site);
}

/* ------------------------------------------------------------------ fiche terrain */
export function terrainPage({ L, R, site, x, docs, prev, next, related, anyGps }) {
  const t = T[L], S = STR[L], titre = tr(x, L, "titre");
  const doc = docs.find(d => x.doc.includes(d.key));
  const gallery = (x.photos || []).filter(Boolean);
  const sold = x.statut === "vendu";
  const note = sold ? t.soldNote : x.statut === "reserve" ? t.resvNote : "";
  const body = `${header(L, R, false, terrainUrl(x, S.other, R), anyGps)}
<main id="accueil" class="tp">
  <section class="tp-hero">
    <div class="wrap">
      <nav class="crumbs" aria-label="Fil d'Ariane"><a href="${homeUrl(L, R)}">${t.crumbHome}</a><span aria-hidden="true">›</span><a href="${homeUrl(L, R)}#terrains">${t.crumbTerrains}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(x.lieu)}</span></nav>
      <div class="tp-grid">
        <figure class="tp-sheet"><img src="${asset(R, x.fiche)}" alt="${esc(t.fullSheet(x.lieu + " · " + titre))}" width="800" height="1000" fetchpriority="high"></figure>
        <div class="tp-info">
          <span class="kicker">${esc(x.zone)}</span>
          <h1>${esc(titre)}</h1>
          <p class="tp-place">${I.pin}${esc(x.lieu)}</p>
          <div class="badges static"><span class="badge o">${x.type === "lot" ? S.kindLot : S.kindSurface}</span>${statusBadge(x, L) || `<span class="badge ok">${S.statut.disponible}</span>`}</div>
          <div class="price">${priceBlock(x, L)}</div>
          <div class="specs">${specs(x, L)}</div>
          <ul class="checks">${tr(x, L, "points").map(p => `<li>${esc(p)}</li>`).join("")}<li>${L === "fr" ? "Vente sécurisée chez le notaire" : "Secure sale at the notary's office"}</li></ul>
          ${note ? `<p class="tp-note">${note}</p>` : ""}
          <div class="tp-cta">
            ${sold ? `<a class="btn btn-primary" href="https://wa.me/WA_NUM" target="_blank" rel="noopener noreferrer">${WA_SVG}${t.fWrite}</a>`
              : `<a class="btn btn-primary" href="${waLink(site.whatsapp, S.waInterest(titre, x.lieu, priceText(x, L)))}" target="_blank" rel="noopener noreferrer">${WA_SVG}${S.interested}</a>`}
            <a class="btn btn-soft" href="#visite">${I.cal}${t.visitT}</a>
            <button class="icon-btn big" type="button" id="shareBtn" aria-label="${t.shareAria}">${I.share}</button>
            <button class="icon-btn big fav-one" type="button" data-fav="${esc(x.id)}" aria-pressed="false" aria-label="${esc(S.favAdd(x.lieu))}">${heart.replace("<svg", '<svg fill="none" stroke="currentColor" stroke-width="2"')}</button>
          </div>
        </div>
      </div>
    </div>
  </section>
${gallery.length ? `
  <section class="block pt-2"><div class="wrap"><h2 class="h3">${t.galleryT}</h2>
    <div class="gallery">${gallery.map((p, i) => `<a href="${asset(R, p)}" target="_blank" rel="noopener"><img src="${asset(R, p)}" alt="${esc(x.lieu)} · photo ${i + 1}" loading="lazy" decoding="async"></a>`).join("")}</div>
  </div></section>` : ""}
${hasGps(x) ? `
  <section class="block pt-2"><div class="wrap"><h2 class="h3">${t.mapT}</h2>
    <div class="map" id="map" data-mode="one" data-lat="${x.gps.lat}" data-lng="${x.gps.lng}" data-label="${esc(x.lieu)}"></div><p class="map-note">${t.mapNote}</p>
  </div></section>` : ""}
  <section class="block pt-2" id="visite">
    <div class="wrap tp-two">
      <form class="form visit" id="visitForm" data-titre="${esc(titre)}" data-lieu="${esc(x.lieu)}">
        <div class="full"><h2 class="h3">${t.visitT}</h2><p class="note">${t.visitLead}</p></div>
        <div><label for="vName">${t.name}</label><input id="vName" required placeholder="${t.namePh}" autocomplete="name"></div>
        <div><label for="vTel">${t.tel}</label><input id="vTel" type="tel" placeholder="+225 …" autocomplete="tel"></div>
        <div><label for="vDate">${t.visitDate}</label><input id="vDate" type="date" required></div>
        <div><label for="vSlot">${t.slot}</label><select id="vSlot">${t.slots.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select></div>
        <div class="full"><button class="btn btn-dark" type="submit">${WA_SVG}${t.visitSend}</button></div>
        <p class="note full" id="visitNote" hidden></p>
      </form>
      ${doc ? `<aside class="doc tp-doc"><span class="abbr">${doc.abbr}</span><h3>${t.docT} : ${esc(L === "en" ? doc.en.nom : doc.nom)}</h3><p>${esc(L === "en" ? doc.en.txt : doc.txt)}</p></aside>` : ""}
    </div>
  </section>

  <section class="block pt-2">
    <div class="wrap">
      <div class="head"><h2 class="h3">${t.relT}</h2><a class="btn btn-soft" href="${homeUrl(L, R)}#terrains">${t.back}</a></div>
      <div class="grid">${related.map(r => cardHTML(r, L, R, site)).join("\n")}</div>
      <nav class="pn" aria-label="${t.prevT} / ${t.nextT}">
        <a href="${terrainUrl(prev, L, R)}" rel="prev"><small>${t.prevT}</small><b>${esc(prev.lieu)}</b></a>
        <a href="${terrainUrl(next, L, R)}" rel="next"><small>${t.nextT}</small><b>${esc(next.lieu)}</b></a>
      </nav>
    </div>
  </section>
</main>
${footer(L, R, [...new Set([x.zone])], false)}`;
  return fill(body, site);
}

export function notFoundPage({ L, R, site }) {
  const t = T[L];
  return fill(`<main class="hero nf"><div class="wrap"><div>
<span class="kicker">404 · ${t.t404}</span><h1><span class="line">${t.h404a}</span><span class="line o">${t.h404b}</span></h1>
<p class="lead">${t.p404}</p>
<div class="trust"><a class="btn btn-primary" href="${R}#terrains">${t.fSee}</a><a class="btn btn-glass" href="${R}en/#terrains">See the land (English)</a></div>
</div></div></main>`, site);
}
