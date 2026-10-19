# Mon Terrain en Côte d'Ivoire

Site vitrine : terrains à vendre, signature chez le notaire.
En ligne : https://54bernard.github.io/mon-terrain-ci/ (français) · https://54bernard.github.io/mon-terrain-ci/en/ (anglais)

## Modifier les terrains (sans code)
1. Ouvrir https://app.pagescms.org et se connecter avec GitHub (compte 54bernard).
2. Choisir le dépôt `mon-terrain-ci`, puis « Terrains ».
3. Modifier un prix, un statut (Disponible / Réservé / Vendu), ajouter des photos ou des coordonnées GPS, ou ajouter un terrain.
4. Enregistrer : le site est vérifié puis mis en ligne automatiquement en 1 à 2 minutes.

Si une donnée est invalide (prix vide, image introuvable, GPS hors de Côte d'Ivoire…), la mise en ligne est bloquée et l'ancien site reste en ligne.

## Fonctionnement
| Fichier | Langage | Rôle |
|---|---|---|
| `data/terrains.json` | JSON | Les terrains (modifiés via l'espace d'administration) |
| `data/site.json` | JSON | Adresse du site, WhatsApp, documents fonciers |
| `scripts/build.mjs`, `scripts/templates.mjs` | JavaScript (Node.js) | Génère les 30 pages (accueil + une page par terrain, FR et EN), le plan du site, le service worker |
| `js/shared.js` | JavaScript (module ES) | Code commun au navigateur et au générateur |
| `js/main.js`, `js/map.js` | JavaScript (module ES) | Filtres, favoris, simulateur, carrousel, carte, demande de visite |
| `css/style.css` | CSS | Design, animations, mode sombre, transitions entre pages |
| `.pages.yml` | YAML | Formulaires de l'espace d'administration |
| `.github/workflows/pages.yml` | YAML | Vérification, génération puis mise en ligne |
| `vendor/leaflet/` | — | Bibliothèque de carte, hébergée sur le site |

## Sécurité
- Site statique : pas de serveur, pas de base de données, pas de PHP.
- Politique de sécurité du contenu (CSP) stricte : aucun script externe, aucun code en ligne (vérifié à chaque génération).
- Polices et bibliothèque de carte hébergées sur le site (aucun pistage par un tiers). Seuls les fonds de carte viennent d'OpenStreetMap.

## Passer à un nom de domaine
Changer `url` dans `data/site.json` (ex. `https://www.monterrain-ci.com/`), puis configurer le domaine dans Settings → Pages.

## Générer en local
`node scripts/build.mjs` puis ouvrir `_site/`.
