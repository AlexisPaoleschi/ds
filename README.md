# ds

Le design system commun à mes applis : Bank, Studio, Selecta et alexispaoleschi.com. Le site de Katline garde sa propre identité.

La page vitrine, `index.html`, montre chaque composant dans les deux thèmes.

## Ce qu’il contient

- `src/tokens.css` : les couleurs, les polices et les deux thèmes, **Atelier** (sombre, les outils) et **Vitrine** (clair, les sites publics), tous deux à l’or `#c9a961` du site.
- `src/base.css` : les champs, les cases à cocher et le focus, les mêmes dans toutes les pages.
- `src/shell.css` : la coque des applis Bank et Studio : page, en-tête et onglets, chargement, cartes, messages, listes, sources en bas de page.
- `src/buttons.css` : les boutons, `.btn` et ses variantes `is-act`, `is-save`, `is-danger`, `is-icon`.
- `src/settings.css` : la page de réglages commune, rangée sous `body.settings`.
- `dist/ds.css` : tout réuni, le seul fichier que les applis copient. Il se refait avec `scripts/build.sh`.

## Dans une appli

Chaque appli garde une copie figée d’une version : `static/ds/ds-2.0.0.css`, liée avant ses propres styles. On ne la modifie jamais à la main : on change ce dépôt, on publie une version (une étiquette `v1.0.1`), puis on la copie avec `scripts/sync.sh 1.0.1 ../bank`.

Le thème se choisit sur la balise `<html>` : `data-theme="atelier"` (par défaut) ou `data-theme="vitrine"`.

## Règles

- Boutons : gris pour aller ailleurs, or pour agir, or plein pour enregistrer, rouge pour supprimer.
- Une appli n’utilise que les rôles (`--accent`, `--panel`…) et ne les redéfinit jamais.
- Une appli ne garde dans ses pages que ce qui lui est propre (le calendrier de Studio, les voyages de Bank…). Tout ce qui sert à deux applis vit ici.
- Un composant naît dans une appli et monte ici quand une deuxième en a besoin.
- Versions : le dernier chiffre corrige, celui du milieu ajoute un composant, le premier change ou retire un nom de classe.
