# 🗂️ Contenu

Ce que le dépôt contient : les deux thèmes, les fichiers que chargent les applis, leurs sources, les kits et la vitrine.
[← Retour au README](../README.md)

## Les deux thèmes

Le thème se choisit sur la balise `<html>`. Les deux portent l’or du site, `#c9a961`.

| Thème | Attribut | Pour | Hauteur d’un contrôle | Arrondis |
|:--|:--|:--|:--|:--|
| **Atelier** | `data-theme="atelier"`, par défaut | sombre, les outils : Bank, Studio | 34px | 4, 6 et 8px |
| **Vitrine** | `data-theme="vitrine"` | clair, les sites publics : Selecta, alexispaoleschi.com | 45px | 0, des angles carrés comme le site |

Les deux thèmes partagent les composants et leur comportement. Chacun remplit les rôles à sa façon, dans `src/tokens.css`.

## Les fichiers de `dist/`

`scripts/build.sh` les refait à partir de `src/` : on ne les écrit jamais à la main.

| Fichier | Ce qu’il contient | Qui le charge |
|:--|:--|:--|
| `ds.css` | les fondations, les composants communs, les pièces publiques, les tableaux | toutes les applis et le site |
| `ds.js` | le noyau, la bulle, la fenêtre, les formulaires, les dates et les chiffres, le serveur | Bank, Studio, Selecta |
| `ds-tools.css`, `ds-tools.js` | les outils : périodes, choix de dates, poignée, nouvelle version, filtres, état des sources, classements, graphiques, calendrier | Bank et Studio |
| `ds-icons.js` | les 214 icônes, posées en haut de la page par leur propre script | Bank et Studio |
| `icons.svg` | les mêmes icônes, visées sans script | Selecta, le site |
| `ds-photo.js` | la visionneuse, la grille de photos et le kit photo, avec le noyau | les pages qui montrent des photos |
| `ds-site.css`, `ds-site.js` | le kit du site, avec le noyau | alexispaoleschi.com seulement |
| `ds-mail.json`, `ds-mail.html` | le kit mail | les mails de Selecta et du site |
| `fonts/` | les polices des deux thèmes, listées dans `fonts/index.txt` | chaque appli, à côté de sa copie |

## Les sources, dans l’ordre où `build.sh` les assemble

Les feuilles de style sont rangées par rôle. `chosen.css` ferme chaque liste, pour l’emporter sur le survol des contrôles.

| Rôle | Dans `ds.css` | Dans `ds-tools.css` |
|:--|:--|:--|
| Fondations | `fonts.css`, `tokens.css`, `base.css`, `heads.css`, `forms.css`, `page.css` | |
| Marques | `marks.css` | |
| Contrôles | `buttons.css`, `tabs.css`, `pick.css` | `period.css`, `periodpick.css`, `datepick.css`, `reorder.css`, `live.css` |
| Surfaces | `card.css`, `avatar.css`, `msg.css`, `toast.css`, `dialog.css`, `viewer.css`, `pop.css`, `sheet.css` | `panel.css` |
| Données | `tiles.css`, `meter.css`, `table.css`, `rows.css` | `status.css`, `figures.css`, `chart.css`, `calendar.css` |
| Pièces publiques | `public.css`, `hero.css`, `topbar.css`, `backlink.css`, `photogrid.css`, `photokit.css`, `gallery.css` | |
| Pages | `doc.css`, `settings.css` | |
| Le choix fait | `chosen.css` | `chosen.css` |

Les scripts :

| Fichier de `dist/` | Ses sources, dans l’ordre |
|:--|:--|
| `ds.js` | `core.js`, `ds.js`, `kit.js`, `build.js`, `forms.js`, `validate.js`, `gestures.js`, `selection.js`, `images.js`, `sheet.js`, `pick.js`, `settings.js` |
| `ds-tools.js` | `tools.js`, `query.js`, `table.js`, `calendar.js`, `chart.js`, `figures.js`, `reorder.js`, `datepick.js`, `live.js` (sans noyau : il a besoin de `ds.js`) |
| `ds-photo.js` | `core.js`, `viewer.js`, `photogrid.js`, `photokit.js` |
| `ds-site.js` | `core.js`, `site.js`, `validate.js` |
| `ds-icons.js` et `icons.svg` | `icons.js` |
| `ds-mail.json` et `ds-mail.html` | `mail.json` et `mail.html`, copiés tels quels |

Le noyau, `core.js`, ouvre `ds.js`, `ds-photo.js` et `ds-site.js`. Une page qui en lie plusieurs garde le premier.

## Les kits

| Kit | Fichiers | Ce qu’il dessine |
|:--|:--|:--|
| Le kit du site | `ds-site.css`, `ds-site.js` | tout ce que les pages d’alexispaoleschi.com dessinent et qu’aucune appli n’utilise ; Vitrine seulement |
| Le kit galerie | `src/gallery.css`, dans `ds.css` | ce qu’une appli qui montre ses galeries à des clients dessine, venu de Selecta |
| Le kit photo | `src/photokit.css` et `src/photokit.js` | recevoir et montrer des photos : dépôt, envois, boutons sur une photo |
| Le kit mail | `ds-mail.json`, `ds-mail.html` | les valeurs de ds écrites en clair, et les morceaux d’un mail à recopier |

Le site n’a plus aucune feuille de style à lui : tout ce qu’il dessine vit dans son kit, que les applis ne chargent pas.

Un client mail ne lit pas les variables CSS : le kit mail écrit donc ses couleurs, ses polices (Georgia et Helvetica) et sa largeur (560px).

## Les icônes

* 214 icônes, une seule planche de traits sur une grille de 24, dans `src/icons.js`.
* Elles viennent de Lucide, et de Simple Icons pour les logos des marques.
* `.ico` leur donne le trait et sa couleur. Une croix est l’icône `#i-close`, jamais la lettre « × ».

Comment une page les écrit : voir [Dans une appli](dans-une-appli.md#les-icônes).

## Les polices

Archivo, IBM Plex Sans et Mono, Gilda Display et Urbanist, dans `dist/fonts`. Chaque appli les sert à côté de sa copie :
aucune page ne les demande à Google.

```bash
# reprendre les polices chez Google Fonts quand l’une d’elles change
python3 scripts/fonts.py
```

## La vitrine

En ligne sur [alexispaoleschi-ds.onrender.com](https://alexispaoleschi-ds.onrender.com). Ses pages lisent `dist/`.

| Page | Ce qu’elle montre |
|:--|:--|
| `index.html` | chaque composant, dans les deux thèmes |
| `site.html` | le kit du site, comme une page d’événement le dessine |
| `site-*.html` | une copie des vraies pages du site : l’accueil, deux événements, leur liste, la newsletter, un document légal |
| `gallery.html` et `gallery-*.html` | une copie des vraies pages de Selecta, de la connexion aux réglages |
| `settings.html` | la page de réglages |
| `demos/` | les scripts des démonstrations d’`index.html` |

Les copies se refont quand le site ou Selecta change. Les photos y sont remplacées par un fond doré.

```bash
# les pages du site, à partir d’une copie du site
node scripts/site-render.js /chemin/du/site /tmp/site-drawn
python3 scripts/site-pages.py /chemin/du/site /tmp/site-drawn
```

```bash
# les pages de Selecta, à partir de ses pages dessinées (Selecta lancé sur sa base de démo)
python3 scripts/gallery-pages.py /chemin/de/selecta /chemin/des/pages-dessinees
```
