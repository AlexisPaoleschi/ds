# Passer à ds 3.0.0

ds 3.0.0 renomme sans garder les anciens noms : chaque appli a sa copie de ds, elle change ses classes et ses appels dans le commit où elle prend 3.0.0. Rien ne change à l’écran quand tout est renommé.

Les chiffres des colonnes Bank, Studio, Selecta et site comptent les lignes où chaque appli écrit l’ancien nom au 12 novembre 2026 (pages, feuilles de style, scripts, gabarits). Un nom très court peut y être aussi une classe à elle (un `td.d` de Bank n’est pas l’écart d’une case) : on ne change que ceux qui veulent le style de ds.

## 48 · Les états en is-… (ou l’attribut aria)

| Avant | Après | Où | Bank | Studio | Selecta | site |
|---|---|---|---|---|---|---|
| `.on` | l’attribut aria | onglets | 1 | 1 | 0 | 0 |
| `.on` | l’attribut aria | choix de dates (dessiné par ds) | ″ | ″ | ″ | ″ |
| `.on` | l’attribut aria | onglet du tiroir (dessiné par ds) | ″ | ″ | ″ | ″ |
| `.active` | `.is-open` | menu du site (ds-site.js) | 0 | 0 | 0 | 1 |
| `.active` | `.is-on` | points de défilement du site | ″ | ″ | ″ | ″ |
| `.open` | `.is-open` | tiroir de filtres (ds.drawer) | 0 | 0 | 0 | 0 |
| `.is-active` | `.is-focused` | sélecteur : l’option où sont les flèches | 0 | 0 | 2 | 0 |
| `.is-sel` | `.is-selected` | calendrier : le jour choisi | 0 | 0 | 0 | 0 |
| `.visible` | `.is-visible` | barre et points du site | 0 | 0 | 0 | 0 |
| `.hidden` | `.is-hidden` | chargement du site | 0 | 0 | 0 | 0 |
| `.loading` | `.is-loading` | en-tête pendant ds.busy | 0 | 0 | 0 | 0 |
| `.loading-done` | `.is-loaded` | en-tête après ds.busy | 0 | 0 | 0 | 0 |
| `.gone` | `.is-gone` | premier chargement | 1 | 2 | 0 | 0 |
| `.failed` | `.is-failed` | premier chargement en échec | 1 | 1 | 0 | 0 |
| `.off` | `.is-off` | flèches de période | 1 | 0 | 0 | 0 |
| `.out` | `.is-leaving` | bulle qui s’en va (ds.toast) | 0 | 0 | 0 | 0 |
| `.late` | `.is-late` | état des sources (ds.status) | 2 | 15 | 0 | 0 |
| `.run` | `.is-running` | réglages : point d’une synchro qui tourne | 0 | 0 | 0 | 0 |
| `.changed` | `.is-changed` | réglages : champ modifié | 0 | 1 | 0 | 0 |
| `.wrong` | `aria-invalid="true"` | réglages : champ refusé → aria-invalid="true" | 0 | 2 | 0 | 0 |

## 49 · Les tons : is-good, is-bad, is-mid

| Avant | Après | Où | Bank | Studio | Selecta | site |
|---|---|---|---|---|---|---|
| `.good` | `.is-good` | message: .msg.good | 0 | 0 | 0 | 0 |
| `.bad` | `.is-bad` | message: .msg.bad; settings: .dot.bad, .sum.bad | 0 | 0 | 2 | 0 |
| `.ok` | `.is-good` | settings: .dot.ok, .bar .msg.ok | 0 | 0 | 0 | 0 |
| `.up` | `.is-good` | tiles: .tile.up | 1 | 0 | 0 | 0 |
| `.down` | `.is-bad` | tiles: .tile.down | 1 | 0 | 0 | 0 |
| `.neg` | `.is-bad` | tile's change: .d.neg | 0 | 0 | 0 | 0 |
| `.n` | (retiré) | tile's change: .d.n | 0 | 2 | 0 | 0 |
| `.is-weak` | `.is-bad` | verdict: .verdict.is-weak | 0 | 0 | 0 | 0 |
| `.warn` | `.is-mid` | sources' state: .dot.warn | 0 | 0 | 0 | 0 |
| `.lwarn` | `.is-mid` | jobs' journal: .ll.lwarn | 0 | 0 | 0 | 0 |
| `.lbad` | `.is-bad` | jobs' journal: .ll.lbad | 0 | 0 | 0 | 0 |

## 51 · Des noms longs et uniques

| Avant | Après | Où | Bank | Studio | Selecta | site |
|---|---|---|---|---|---|---|
| `.t` | `.row-date` | rows: a line's date or time | 10 | 4 | 0 | 0 |
| `.v` | `.row-value` | rows: a line's amount or figure | 12 | 0 | 0 | 0 |
| `.x` | `.row-sub` | rows: the small line under a figure (.v .x) | 0 | 0 | 0 | 0 |
| `.x` | `.toast-close` | bubble: its cross (.toast .x) | ″ | ″ | ″ | ″ |
| `.pl` | `.row-place` | rows: a line's place | 0 | 9 | 0 | 0 |
| `.ttl` | `.row-title` | rows and calendar: a line's title | 16 | 7 | 0 | 0 |
| `.late` | `.late-tag` | rows and calendar: the red late badge (span.late) | ″ | ″ | ″ | ″ |
| `.empty` | `.empty-note` | rows, ranking, calendar: the words of an empty list | 16 | 6 | 0 | 0 |
| `.kv` | `.facts` | sheet and rows: a list of pairs of words (dl.kv) | 4 | 0 | 0 | 0 |
| `.u` | `.tile-unit` | tiles: the unit after a figure | 0 | 5 | 0 | 0 |
| `.h` | `.tile-note` | tiles: the note under a figure | 0 | 3 | 0 | 0 |
| `.d` | `.tile-delta` | tiles: the change under a figure | 3 | 10 | 0 | 0 |
| `.dot` | `.status-dot` | sources' state: details.status .dot | 3 | 1 | 0 | 1 |
| `.dot` | `.sync-dot` | settings: a job's or a connection's dot (:where(body.settings) .dot) | ″ | ″ | ″ | ″ |
| `.dot` | `.scroll-dot` | site home: the scroll dots | ″ | ″ | ″ | ″ |
| `.sn` | `.status-name` | sources' state | 0 | 0 | 0 | 0 |
| `.sw` | `.status-state` | sources' state | 0 | 1 | 0 | 0 |
| `.sw` | `.switch` | settings: the on/off switch (label.sw) | ″ | ″ | ″ | ″ |
| `.sf` | `.status-every` | sources' state | 0 | 0 | 0 | 0 |
| `.sd` | `.status-detail` | sources' state | 0 | 0 | 0 | 0 |
| `.sl` | `.status-link` | sources' state | 0 | 2 | 0 | 0 |
| `.okc` | `.busy-ok` | header's loading: the tick | 1 | 1 | 0 | 0 |
| `.pc` | `.busy-share` | header's loading: the share | 1 | 1 | 0 | 0 |
| `.bt` | `.busy-text` | header's loading: the words | 2 | 1 | 0 | 0 |
| `.boot-t` | `.boot-title` | first loading screen | 1 | 1 | 0 | 0 |
| `.boot-s` | `.boot-text` | first loading screen | 1 | 1 | 0 | 0 |
| `.boot-p` | `.boot-progress` | first loading screen | 1 | 1 | 0 | 0 |
| `.boot-x` | `.boot-retry` | first loading screen: the retry button | 1 | 1 | 0 | 0 |
| `.dialog-x` | `.dialog-text` | ds.confirm's text | 0 | 0 | 0 | 0 |
| `.sheet-x` | `.sheet-close` | a sheet's cross | 2 | 0 | 0 | 0 |
| `.ll` | `.log-line` | jobs' journal | 0 | 0 | 0 | 0 |
| `.lt` | `.log-time` | jobs' journal | 0 | 0 | 0 | 0 |
| `.lx` | `.log-text` | jobs' journal | 0 | 0 | 0 | 0 |
| `.mx` | `.wide-only` | jobs: « maintenant », hidden on a phone | 0 | 0 | 0 | 0 |
| `.sum` | `.job-sum` | jobs: a job's summary | 0 | 0 | 0 | 0 |
| `.none` | `.log-empty` | jobs' journal: nothing yet | 2 | 0 | 0 | 0 |
| `.jl` | `.btn` | jobs: the journal button | 0 | 0 | 0 | 0 |
| `.go` | `.btn.is-act` | jobs: the run button | 0 | 0 | 0 | 0 |
| `.pv` | `.pill-value` | pills: what the menu chose | 3 | 0 | 0 | 0 |
| `.tl` | `.tab-label` | view tabs: a tab's word | 1 | 1 | 0 | 0 |
| `.vt` | `.edgetab-label` | filters' edge tab: its word | 1 | 1 | 0 | 0 |
| `.yr` | `.periodtitle-year` | period title: the year | 0 | 0 | 0 | 0 |
| `.fdot` | `.filter-pip` | filters: the gold dot of a filter in use | 0 | 0 | 0 | 0 |
| `.fall` | `.filter-all` | filters' panel: « Tout » | 1 | 1 | 0 | 0 |
| `.only` | `.filter-only` | filters' panel: the eye « Seulement » | 1 | 1 | 0 | 0 |
| `.sq` | `.swatch` | a filter's square | 1 | 3 | 0 | 0 |

## Retirés avec 3.0.0

Les anciens boutons des réglages : `.back`, `.reload`, `.jump a`, `button.jl`, `.go`, `button.save` (et `.reload .pip`, `.reload.new`). Leurs remplaçants, depuis 2.40 : `.btn`, `.btn.is-act`, `.btn.is-save`, `.btn.is-danger`, `.btn.is-icon.newver`. `ds.jobs` dessine désormais ces boutons, trouvés par `[data-job="run"]` et `[data-job="journal"]`.

## 50 · Une seule façon d’appeler

Une fonction qui dessine s’appelle `ds.chose(holder, données, options)` : `value` pour le choix, `onPick` quand on choisit, `format` pour écrire un chiffre, `tip` pour les mots au survol, `label` pour le nom lu par un lecteur d’écran. Un deuxième appel sur le même holder rend le même composant ; sans holder, rien ne plante.

| Avant | Après |
|---|---|
| `ds.rank(rows, options)` | `ds.rank(holder, rows, options)` ; `null` pour seulement l’élément |
| `ds.minitiles(items)` | `ds.minitiles(holder, items)` ; une case peut avoir `tone: "good"`, `"bad"` ou `"mid"` |
| `ds.verdict(ratio, options)` | `ds.verdict(holder, ratio, options)` |
| `ds.periodPick(options, current, pick, {label})` | `ds.periodPick(holder, options, {value, onPick, label})` |
| `ds.picker(holder, {items, …})` | `ds.picker(holder, items, {…})` |
| `ds.viewer(items, {el, …})` | `ds.viewer(holder, items, {…})`, holder la `.viewer` de la page ou `null` |
| `ds.drawer(name, options)` | `ds.drawer(holder, options)`, holder la mise en page `[data-drawer="name"]` |
| `ds.avatar(name, src, cls)` | `ds.avatar(holder, {name, src}, {cls})` |
| `ds.calendar(holder, {day})`, `state().day`, `set({day})` | `{value}`, `state().value`, `set({value})` |
| `ds.selection(holder, {onChange})` | `{onPick}` |
| `ds.chart.bars` / `ds.chart.donut` : `selected`, `pick` | `value`, `onPick` |
| `ds.chart.line` : `value`, `label` | `format`, `formatDay` |
| `ds.chart.heat` / `ds.chart.spark` : `title` | `tip` |
| `ds.datePick.today()` | `ds.today()` |
| `ds.jobs` : `.jl`, `.go` | `.btn` (`.is-act`), `[data-job="journal"]`, `[data-job="run"]` |

Les appels par appli au 12 novembre 2026 :

| Changement | Bank | Studio | Selecta | site |
|---|---|---|---|---|
| ds.calendar | 0 | 2 | 0 | 0 |
| ds.chart.bars / donut | 2 | 1 | 0 | 0 |
| ds.chart.heat / spark | 0 | 2 | 0 | 0 |
| ds.chart.line | 2 | 1 | 0 | 0 |
| ds.drawer(holder, options) | 1 | 1 | 0 | 0 |
| ds.jobs draws .btn | 1 | 2 | 0 | 0 |
| ds.minitiles(holder, items) | 0 | 1 | 0 | 0 |
| ds.periodPick(holder, options, {value, onPick, label}) | 1 | 5 | 0 | 0 |
| ds.picker(holder, items, options) | 2 | 0 | 0 | 0 |
| ds.rank(holder, rows, options) | 0 | 7 | 0 | 0 |
| ds.selection | 1 | 0 | 0 | 0 |
| ds.verdict(holder, ratio, options) | 0 | 4 | 0 | 0 |
| ds.viewer(holder, items, options) | 0 | 0 | 1 | 0 |
