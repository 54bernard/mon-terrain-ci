# Mon Terrain en Côte d'Ivoire

Site vitrine : terrains à vendre, signature chez le notaire.
En ligne : https://54bernard.github.io/mon-terrain-ci/

## Les langages du site

| Fichier | Langage | Rôle |
|---|---|---|
| `index.html`, `404.html` | HTML5 | Structure et contenu des pages |
| `css/style.css` | CSS3 | Mise en page, couleurs, animations, mode sombre, mobile |
| `js/main.js` | JavaScript (module ES) | Filtres, favoris, simulateur, fiches, carrousel |
| `data/terrains.json` | JSON | **Les terrains et les prix : le seul fichier à modifier** |
| `<script type="application/ld+json">` dans `index.html` | JSON-LD (Schema.org) | Fiche de l'agence et des offres pour Google |
| `sitemap.xml` | XML | Plan du site pour les moteurs de recherche |
| `manifest.webmanifest` | JSON | Installation du site comme une application sur téléphone |
| `sw.js` | JavaScript (service worker) | Ouverture instantanée et consultation sans réseau |
| `.github/workflows/pages.yml` | YAML | Vérification puis mise en ligne automatique |

Pas de PHP, de base de données ni de serveur : un site statique n'a rien à pirater côté serveur.

## Sécurité
- Politique de sécurité du contenu (CSP) stricte : seuls les fichiers du site peuvent s'exécuter, aucun script externe.
- Polices hébergées sur le site (aucun appel à Google, aucun pistage).
- Liens externes en `noopener noreferrer`, données affichées échappées.
- Chaque mise en ligne est d'abord vérifiée (JSON, XML, absence de code en ligne).

## Modifier un terrain
1. Ouvrir `data/terrains.json`, changer le prix ou ajouter un bloc terrain.
2. Changer `mis_a_jour` en haut du fichier, et `VERSION` dans `sw.js`.
3. Enregistrer : le site se met à jour en 1 à 2 minutes.
