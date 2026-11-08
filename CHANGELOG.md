# Changelog

## 2.6.0 · 8 novembre 2026

Un seul en-tête de période.

- Nouveau : l’en-tête de période (`period.css`) : le grand titre qui ouvre le sélecteur, les flèches (et « Aujourd’hui ») à droite, le sélecteur sous le titre avec ses boutons qui s’allument en or. Sur téléphone, les flèches passent sous le titre.
- Bank prend le grand titre à gauche de Studio, ses flèches deviennent des boutons carrés comme ceux de Studio. Le calendrier de Studio et le sélecteur de période de Bank ont le même panneau.

## 2.5.0 · 8 novembre 2026

Moins de valeurs différentes, une seule échelle par réglage.

- Texte : 10 tailles (`--fs-9` à `--fs-28`) au lieu de 25, 3 interlignes au lieu de 12, 4 espacements de lettres au lieu de 16.
- Espaces : une échelle de 12 valeurs (`--s-2` à `--s-48`) au lieu de 26 pour les marges et les écarts.
- Superpositions nommées (`--z-raise` à `--z-toast`), deux durées (`--t-fast`, `--t-mid`), deux ombres (`--shadow-pop`, `--shadow-sheet`).
- Largeurs d’écran : les quatre mêmes partout, 420, 640, 980 et 1280px, au lieu de 13.
- Bank et Studio passent sur ces jetons.

## 2.4.0 · 8 novembre 2026

Toutes les couleurs ici, et « seul » dans le panneau de filtres.

- Nouveau : une palette de huit couleurs de même clarté et de même intensité (`--c-bleu`, `--c-ciel`, `--c-turquoise`, `--c-violet`, `--c-mauve`, `--c-rose`, `--c-orange`, `--c-ardoise`), plus `--black` et `--white`. Banques, catégories, types de voyage, réseaux et agendas y prennent leur couleur.
- Le vert, le rouge et le jaune ne servent plus qu’aux entrées, aux sorties et aux alertes (Revenus garde le vert : ce sont des entrées).
- Les transparences sont calculées depuis les jetons (`color-mix`) au lieu d’être écrites à la main. Bank et Studio n’ont plus aucun code couleur, sauf la couleur de barre du navigateur, qu’une balise meta ne sait pas lire depuis un jeton.
- Le panneau de filtres gagne « seul », au bout de chaque ligne, qui garde une source seule dans son groupe, et « Tout », dans l’en-tête du groupe, qui rallume tout.

## 2.3.0 · 8 novembre 2026

Des angles plus nets.

- Trois jetons d’arrondi : `--r-s` 4px (badges, cases à cocher), `--r-m` 6px (boutons, champs, tuiles, pastilles), `--r-l` 8px (cartes, panneaux, fiches). Ils remplacent les arrondis écrits en dur, jusqu’à 22px, dans le design system et dans Bank et Studio.
- Les pastilles en gélule (999px) prennent l’arrondi moyen. Les ronds (50%) et les petits traits restent tels quels.

## 2.2.0 · 8 novembre 2026

Un seul panneau de filtres pour les deux applis.

- Nouveau : le panneau de filtres (`panel.css`), celui de Studio : l’onglet « Filtres » sur le bord avec son point quand un filtre est actif, le panneau à côté du contenu sur ordinateur, le tiroir sur téléphone, les groupes de boutons à allumer ou éteindre avec leur carré de couleur (`.sq`).
- La mise en page s’appelle `.side-layout` (dans Studio, elle s’appelait `.cal-layout`).
- Bank filtre avec ce panneau : ses comptes, le sens, ses catégories et l’ordre. Ses menus de filtres disparaissent ; en haut restent la période, la recherche et les chiffres.

## 2.1.0 · 8 novembre 2026

Un nom, un seul sens, et un seul composant pour les chiffres.

- Nouveau : les tuiles de chiffres (`tiles.css`), venues de l’analyse de Studio, et leur forme compacte (`.tiles.is-compact`) pour le haut des écrans de Bank.
- Nouveau dans la coque : la date (`.t`) et le montant (`.v`) d’une ligne de liste, une seule version pour les deux applis.
- Studio renomme ce qui portait un nom de Bank pour autre chose : `.pill` devient `.score`, `.bar` devient `.tick`, `.sub` devient `.subtitle`, `.more` devient `.count`.

## 2.0.0 · 8 novembre 2026

Bank et Studio prennent dans le design system tout ce qu’ils partagent, et ne gardent que ce qui leur est propre.

- Nouveau : la coque des applis (`shell.css`) avec la page, l’en-tête et ses onglets, le chargement, les cartes et leurs titres, les messages, les listes et les sources en bas de page. Les règles qui avaient dérivé entre les deux applis n’ont plus qu’une version.
- Nouveau : la base (`base.css`) avec les champs, les cases à cocher et le focus.
- Nouveau : la page de réglages commune (`settings.css`), sous `body.settings`.
- Les boutons s’appellent `.btn` (plus de préfixe `ds-`) ; Studio les prend aussi.
- Retirés, faute d’appli qui les utilise : `ds-field`, `ds-check`, `ds-dates`, `ds-pill`, `ds-card`, `ds-tiles`, `ds-chip`, `ds-group`, `ds-amount`, `ds-spin`, `ds-progress`, `ds-sheet`.

## 1.0.0 · 8 novembre 2026

Première version, tirée de Bank et Studio.

- Jetons : thème Atelier (sombre, outils) et thème Vitrine (clair, sites publics), tous deux à l’or `#c9a961` du site.
- Composants : boutons (`ds-btn`, `is-act`, `is-save`, `is-danger`, `is-icon`), champs (`ds-field`, `ds-check`, `ds-dates`), pastilles de menu (`ds-pill`), cartes (`ds-card`, `ds-card-title`), chiffres (`ds-tiles`, `ds-tile`), étiquettes (`ds-chip`), titres de groupe (`ds-group`), montants (`ds-amount`), chargement (`ds-spin`, `ds-progress`), fiches (`ds-sheet`).
- Bank et Studio passent leurs couleurs et leurs polices au design system ; Bank prend ses boutons.
