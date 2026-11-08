# Changelog

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
