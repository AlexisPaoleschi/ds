# 🧰 Fonctions

Les fonctions `ds.*` de chaque fichier JavaScript, rangées par fichier de `dist/`. Chaque source décrit les siennes en tête.
[← Retour au README](../README.md)

## La convention

Une fonction qui dessine s’appelle `ds.chose(holder, données, options)`. Le détail est dans [Règles](regles.md#une-seule-façon-de-nommer-et-dappeler).

Les mots d’un composant suivent la langue de la page, `<html lang>` : l’anglais pour « en… », le français sinon.

## Le noyau, dans chaque fichier

`src/core.js` ouvre `ds.js`, `ds-photo.js` et `ds-site.js`.

| Fonction | Ce qu’elle fait |
|:--|:--|
| `ds.h(tag, attrs, kids)` | construit un nœud, sans jamais laisser passer un script |
| `ds.esc(text)` | rend un texte sans danger dans du HTML |
| `ds.ico(name, cls)` | une icône de la planche |
| `ds.today()` | le jour de Paris, « 2026-11-12 » |
| `ds.day` | les jours de Paris : `today()`, `key(date)`, `at(key)`, `add(key, n)`, `weekStart(key)`, `format(key, options)`, `hour()`, `addMonths()` |

Le noyau tient aussi les couches : la fenêtre, la fiche, la visionneuse, le tiroir, le choix de dates, le menu du site.
Échap ferme celle du dessus seulement ; Tab tourne dans les fenêtres, fiches, visionneuse et tiroir.

Sur iPhone et iPad, il ajoute `maximum-scale=1` à la balise viewport : toucher un champ ne zoome plus la page. Le pincement reste possible.

## `ds.js`, pour toutes les applis

| Source | Fonctions |
|:--|:--|
| `ds.js` | `ds.toast`, `ds.confirm`, `ds.when`, `ds.ago`, `ds.soon`, `ds.date`, `ds.time`, `ds.number`, `ds.money`, `ds.percent`, `ds.compact`, `ds.api`, `ds.avatar`, `ds.fold`, `ds.foldCard`, `ds.fitFigures`, `ds.route`, `ds.seek` |
| `kit.js` | `ds.text`, `ds.plural`, `ds.count`, `ds.list`, `ds.duration`, `ds.every`, `ds.since`, `ds.store`, `ds.poll`, `ds.onSeen`, `ds.boot`, `ds.ext`, `ds.delta` |
| `build.js` | `ds.tile`, `ds.tiles`, `ds.card`, `ds.tabs`, `ds.meter`, `ds.legend`, `ds.median`, `ds.mean` |
| `forms.js` | `ds.rows`, `ds.password`, `ds.autosave` |
| `validate.js` | `ds.validate(form, {words})` : les contrôles d’un formulaire, dans les mots de la page plutôt que les bulles du navigateur (aussi dans `ds-site.js`) |
| `gestures.js` | `ds.undo`, `ds.optimistic`, `ds.copy`, `ds.openAll`, `ds.pop`, `ds.enter`, `ds.leave`, `ds.redraw`, `ds.highlight`, `ds.suggest` |
| `selection.js` | `ds.selection(holder, {bar, count, sum, onPick, cls})` : choisir des lignes ou des tuiles, par leur case `.sel-box` (`.sel-all` pour toutes) |
| `images.js` | `ds.images.renew` : redemander l’adresse signée d’une image qui a expiré |
| `sheet.js` | `ds.sheet(el, {onOpen, onClose})` : ouvrir et fermer la fiche |
| `pick.js` | `ds.pills(root)`, `ds.picker(holder, items, {value, first, limit, empty, placeholder, label, onPick, opener, check})` |
| `settings.js` | `ds.switch`, `ds.conn`, `ds.conns`, `ds.fields` : la case qui enregistre, une connexion, les champs de chiffres |

Les plus utilisées :

* `ds.toast({type, text, action, duration, key})` : la bulle, de type `good`, `info`, `busy` ou `bad`. Une même `key` la change au lieu d’en ajouter une.
* `ds.confirm({title, text, ok, danger, value, placeholder, inputmode, autocomplete, maxlength, check})` répond par une promesse. Elle remplace `confirm()` et `prompt()`.
* `ds.number` et `ds.money` prennent `{decimals}`, `{min, max}` et `{signed}` ; `ds.percent(part, {decimals, signed})` écrit « 12 % » ; `ds.time(t, {pad})` « 9h05 ».
* `ds.foldCard(card, key, {open})` fait du titre d’une carte le bouton qui la plie ; l’appareil s’en souvient comme d’un `details.fold`.

Tant que `ds.confirm` est ouverte, Tab tourne à l’intérieur et la page derrière ne répond plus (`inert`).
Avec `check: {label, checked}`, une case paraît sous le champ et la réponse est `{value, checked}`.

## `ds.api`, le serveur de l’appli

```js
ds.api(method, url, body, {retry, headers, keepalive, progress, cache})
```

* Le jeton contre les requêtes forgées est celui que nomme `<html data-api="X-Bank">` ; une page Spring envoie aussi son jeton CSRF.
* Un objet part en JSON ; un formulaire (`FormData`, `URLSearchParams`) ou un fichier part tel quel.
* `progress(loaded, total)` suit un envoi ; `keepalive` le fait survivre à la page.
* `cache: "default"` laisse le navigateur garder une lecture servie avec son ETag : une base inchangée revient en 304.
* Il réessaie pendant un redémarrage : seule la page de la plateforme (un 502, 503 ou 504 qui n’est pas du JSON) ou l’absence de réponse en est un.
* Une erreur porte `err.status`, `err.code` et `err.body`. `err.code` vaut `restart` ou `offline` quand les essais s’épuisent.
* Après la connexion, la page rouvre où elle était.

## Ce qui marche sans code

| Balisage | Ce qu’il fait |
|:--|:--|
| `tr.is-link` avec un lien `a.row-link` ou un `data-href` | la ligne entière s’ouvre ; une case `.tile.is-link` aussi |
| `<form data-confirm="…" data-confirm-ok="…">` | le formulaire demande avant de supprimer |
| `.btn.is-busy` | le bouton occupé, qui tourne |
| `<template data-toast data-type data-text>` | la bulle laissée par le serveur après une redirection |
| `details.fold[data-fold]`, `.ct.fold[aria-expanded]` | les sections qui se replient, l’appareil s’en souvenant |
| `[data-copy]` | un bouton qui copie, sans script à lui |

## `ds-tools.js`, pour Bank et Studio

Il se lie après `ds.js`, dont il prend la bulle, le serveur et le noyau.

| Source | Fonctions |
|:--|:--|
| `tools.js` | `ds.drawer(holder, {onChange})`, `ds.status(holder, {summary, late, rows, link})`, `ds.jobs(holder, jobs, {logsLink, reload})`, `ds.busy`, `ds.trouble(key, {name, text, retry, check})` |
| `query.js` | `ds.query`, la langue de recherche ; `ds.filters`, le panneau de filtres ; `ds.filterChips`, les filtres en cours |
| `table.js` | `ds.sortable(table, {by, up, key, menu, onSort})` |
| `calendar.js` | `ds.calendar(holder, {view, value, today, items, panel, row, body, years, lines, onChange, ready})` |
| `chart.js` | `ds.chart.line`, `bars`, `donut`, `heat`, `spark`, `split` |
| `figures.js` | `ds.rank(holder, rows, options)`, `ds.minitiles(holder, items)`, `ds.verdict(holder, ratio, options)`, `ds.periodPick(holder, options, {value, onPick, label})` |
| `reorder.js` | `ds.reorder(list, {item, handle, onEnd})`, à la souris, au doigt ou au clavier |
| `datepick.js` | `ds.datePick(holder, {value, quick, modes, min, max, onPick, opener})` ; `ds.datePick.label`, `step`, `of`, `kind` |
| `live.js` | `ds.version`, le témoin de nouvelle version ; `ds.stream`, le direct du serveur ; `ds.keep`, la copie sur l’appareil (`get`, `put`, `del`, `fresh`) |

* `ds.drawer` : sa mise en page `.side-layout[data-drawer]`, `data-drawer-toggle`, `data-drawer-close` ; `mark(true)` pose le point d’or `.filter-pip`.
* `ds.busy` : `start(text, {key})`, `pct(p)`, `say(word)`, `done()`. Un lecteur d’écran entend les mots de `start`, puis « Chargement terminé ».
* `ds.jobs` dessine des boutons de ds, `[data-job="run"]` et `[data-job="journal"]`, et le point `.sync-dot` dans son ton.
* `ds.chart.line` prend `format`, `formatDay`, `floor` (une échelle jusqu’à 0) et `ref` (un niveau à sa vraie hauteur).
* `bars` et `donut` prennent `value` et `onPick` ; `heat` et `spark` prennent `tip` ; `bars` avec `pairs` dessine des barres en paires.
* `ds.calendar` avec `ready` garde le mois affiché tant que l’appli lit encore les jours demandés.

## `ds-photo.js`, pour les pages de photos

| Source | Fonctions |
|:--|:--|
| `viewer.js` | `ds.viewer(holder, items, {start, onChange, onClose, label, from})` ; `ds.viewer.bind(container, {item, label, onChange, onClose})`, ou `<div data-viewer>` sans code ; `ds.viewer.thumb(items, {label, caption})`, le carré des photos d’un post en tête de sa ligne |
| `photogrid.js` | `ds.photogrid(grid, {sizes, size, key, slider, masonry})` |
| `photokit.js` | `ds.dropzone(zone, {input, button, onFiles, one})`, `ds.upload(files, {url, list, field, concurrent, total, retry, done, fail})` |

Sans `ds.js`, la visionneuse n’a pas de bulle pour dire qu’une photo n’a pas pu s’ouvrir.

## `ds-site.js`, pour le site

| Balisage ou fonction | Ce qu’il fait |
|:--|:--|
| `<div id="nav" data-title data-links data-cta-href data-cta-label>` | devient la barre et son menu de téléphone ; un lien vers `#…` y descend en douceur |
| `<div id="back-button" data-href data-label data-menu-label>` | devient le lien retour, sur la photo, dans la barre et en tête du menu |
| les galeries d’une page d’événement | s’ouvrent dans la visionneuse quand `ds-photo.js` est là, d’un clic, d’Entrée ou d’Espace |
| `ds.icon(name, cls)` | une icône du fichier `icons-X.Y.Z.svg` posé à côté |
| `ds.json(url)` | lit un fichier JSON (les Gists du site) une seule fois par page |
| `ds.ready(...waits)` | ôte l’écran de chargement une fois ces attentes et la photo d’en-tête arrivées |
| `ds.photo(src)`, `ds.images(root)` | attendent des photos |
| `ds.screens()` | fait défiler l’accueil écran par écran, avec ses points |
| `ds.newsletter(form, {url, fields, check, sending, done})` | le formulaire de la newsletter : l’adresse vérifiée, le bouton occupé, les mots du serveur sous le champ |
| `ds.validate(form, {words})` | les contrôles d’un formulaire : à l’envoi, chaque champ obligatoire vide, chaque adresse fausse, chaque case à cocher le dit en rouge sous lui, et rien ne part ; ensuite il se corrige à mesure qu’on tape. Ses mots : le `data-error` du champ, sinon ceux de ds |

Cachés, la barre et le menu fermé ne se laissent pas atteindre au clavier. Ouvrir le menu y mène le clavier ; Échap le ramène au bouton.
