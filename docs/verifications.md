# 🧪 Vérifications

Les scripts de `checks/` et ce que vérifie chacun. On les lance tous avant de publier une version.
[← Retour au README](../README.md)

## Tout lancer

```bash
for c in checks/*.js; do node "$c"; done
```

```bash
# un seul
node checks/roles.js
```

> [!NOTE]
> Toutes demandent Playwright, sauf `checks/mail.js`. Chacune sert le dépôt elle-même, sur un port libre de la machine.

Une ligne `ok` par point vérifié, `ÉCHEC` sinon. Les pages `checks/*.html` sont celles qu’elles ouvrent.

## Ce que vérifie chacune

| Script | Ce qu’il vérifie |
|:--|:--|
| `access.js` | au clavier seul, chaque fenêtre et chaque menu (Tab, Maj+Tab, Entrée, Espace, Échap, les flèches), le focus revenant où il était ; ce qu’entend un lecteur d’écran |
| `bank.js` | les pièces de Bank : la fiche, le tableau et ses cartes sur téléphone, le choix de plusieurs lignes, la pilule, le sélecteur, la poignée, les barres |
| `behaviours.js` | les comportements de `ds.js` : le tiroir, l’état des sources, l’heure en mots, la roue de l’en-tête, une source en échec, la barre des vues |
| `bundles.js` | ce que charge chaque appli (une page de Selecta n’a rien des outils, une page de Bank a les outils et les icônes) et les largeurs d’écran de toutes les feuilles |
| `coverage.js` | la vitrine montre tout : chaque classe et chaque fonction paraît sur l’une de ses pages ; `EXCEPT` dit ce qui est laissé de côté, et pourquoi |
| `date.js` | le choix de dates, le donut et les barres en paires |
| `gestures.js` | les gestes : annuler et refaire, la case cochée tout de suite, copier, le panneau sous un bouton, la langue de recherche, les filtres |
| `kit.js` | les petits outils (`ds.text`, les mots, `ds.store`, `ds.poll`, `ds.boot`, `ds.delta`…) et les constructeurs |
| `mail.js` | le kit mail : ses morceaux n’écrivent que ses valeurs, son bouton est une cellule qu’Outlook colore |
| `names.js` | une seule façon d’appeler et de nommer ; aucun ancien nom d’avant 3.0 dans `dist/` |
| `photo.js` | la visionneuse, la grille de photos et son zoom, le bandeau photo et le lien retour |
| `roles.js` | les quinze rôles du texte, dans les sources et à l’écran, dans les deux thèmes ; l’italique |
| `showcase.js` | la vitrine : lisibilité, 11px au moins, une seule hauteur de contrôle, rien qui déborde ni rien de coupé sur un téléphone de 375px, le titre d’une carte à la même place avec ses outils ou sans, la légende d’une photo au-dessus de ses boutons |
| `site.js` | le kit du site : la barre et son menu, le lien retour, l’écran de chargement, les galeries, les icônes, la newsletter |
| `studio.js` | les pièces de Studio : le calendrier, les graphiques, les classements, le choix de période, la nouvelle version, le direct |

Les vérifications des pièces (`bank.js`, `photo.js`, `site.js`) contrôlent aussi que leurs feuilles nomment un jeton pour chaque valeur.

## Ce qu’elles ne vérifient pas

Les applis ont leurs propres tests du design system : voir [Règles](regles.md#les-tests-des-applis).
Pour voir une appli avec une nouvelle version avant de la prendre : [Comparer avant et après](dans-une-appli.md#comparer-avant-et-après).
