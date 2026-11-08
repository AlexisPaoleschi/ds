# ds

Le design system commun à mes applis : Bank, Studio, Selecta et alexispaoleschi.com. Le site de Katline garde sa propre identité.

La page vitrine, `index.html`, montre chaque composant dans les deux thèmes.

## Ce qu’il contient

- `src/tokens.css` : les couleurs, les polices, les trois tailles d’arrondi (`--r-s`, `--r-m`, `--r-l`), la palette de huit couleurs (`--c-bleu`, `--c-ciel`, `--c-turquoise`, `--c-violet`, `--c-mauve`, `--c-rose`, `--c-orange`, `--c-ardoise`) et les deux thèmes, **Atelier** (sombre, les outils) et **Vitrine** (clair, les sites publics), tous deux à l’or `#c9a961` du site.
- `src/base.css` : les champs, les cases à cocher et le focus, les mêmes dans toutes les pages.
- `src/shell.css` : la coque des applis Bank et Studio : page, en-tête et onglets, chargement, cartes, messages, listes, sources en bas de page.
- `src/buttons.css` : les boutons, `.btn` et ses variantes `is-act`, `is-save`, `is-danger`, `is-icon`.
- `src/tiles.css` : les chiffres en tuiles (`.tiles`, `.tile`), et leur forme compacte pour le haut d’un écran (`.tiles.is-compact`).
- `src/panel.css` : le panneau de filtres, venu de Studio : l’onglet sur le bord, le panneau, ses groupes de boutons à allumer ou éteindre, le tiroir sur téléphone.
- `src/period.css` : l’en-tête de période, le même pour les opérations de Bank et le calendrier de Studio : le grand titre qui ouvre le sélecteur, les flèches à droite.
- `src/settings.css` : la page de réglages commune, rangée sous `body.settings`.
- `dist/ds.css` : tout réuni, le seul fichier que les applis copient. Il se refait avec `scripts/build.sh`.

## Dans une appli

Chaque appli garde une copie figée d’une version : `static/ds/ds-2.6.0.css`, liée avant ses propres styles. On ne la modifie jamais à la main : on change ce dépôt, on publie une version (une étiquette `v1.0.1`), puis on la copie avec `scripts/sync.sh 1.0.1 ../bank`.

Le thème se choisit sur la balise `<html>` : `data-theme="atelier"` (par défaut) ou `data-theme="vitrine"`.

## Règles

- Couleurs : toutes ici. Une appli ne nomme qu’un jeton (`var(--c-bleu)`, `var(--good)`…), jamais un code couleur. Le vert, le rouge et le jaune sont réservés aux entrées, aux sorties et à ce qui demande un coup d’œil.
- Réglages : toutes les tailles de texte, interlignes, espacements de lettres, marges, superpositions, durées et ombres sont des jetons (`--fs-14`, `--s-12`, `--z-sheet`…). Les largeurs d’écran sont les quatre mêmes partout : 420, 640, 980, 1280px.
- Boutons : gris pour aller ailleurs, or pour agir, or plein pour enregistrer, rouge pour supprimer.
- Une appli n’utilise que les rôles (`--accent`, `--panel`…) et ne les redéfinit jamais.
- Une appli ne garde dans ses pages que ce qui lui est propre (le calendrier de Studio, les voyages de Bank…). Tout ce qui sert à deux applis vit ici.
- Un composant naît dans une appli et monte ici quand une deuxième en a besoin.
- Versions : le dernier chiffre corrige, celui du milieu ajoute un composant, le premier change ou retire un nom de classe.
