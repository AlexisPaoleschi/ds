# Changelog

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
