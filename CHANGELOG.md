# Changelog

## 3.0.0 · 12 novembre 2026

Les noms et les appels, une seule façon partout (points 48 à 51 de l’étude). Rien ne change à l’écran : la page vitrine est la même au pixel près. Pas d’alias : chaque appli renomme ses classes et ses appels dans le commit où elle prend 3.0.0, avec `MIGRATION-3.md`.

- Les états en `is-…`, ou l’attribut aria quand il existe : `.on` des onglets, du choix de dates et de l’onglet du tiroir laisse la place à `aria-pressed`, `aria-selected`, `aria-current` ou `aria-expanded` ; `.active` devient `is-open` (le menu du site) ou `is-on` (ses points de défilement) ; `.open` du tiroir `is-open` ; `.is-active` d’une option du sélecteur `is-focused` ; `.is-sel` du calendrier `is-selected` ; `.visible`, `.hidden`, `.loading`, `.loading-done`, `.gone`, `.failed`, `.off`, `.out` deviennent `is-visible`, `is-hidden`, `is-loading`, `is-loaded`, `is-gone`, `is-failed`, `is-off`, `is-leaving` ; une source en retard est `li.is-late` ; une synchro qui tourne `is-running` ; un champ modifié `is-changed`, un champ refusé `aria-invalid="true"`.
- Les tons en `is-good`, `is-bad`, `is-mid` : le message (`.msg.good`, `.bad`), la case (`.tile.up`, `.down`), son écart (`.d`, `.neg`, `.n` : l’écart sans ton est désormais gris, `is-good` le met en vert), le verdict faible (`is-weak`), le point des sources (`warn`), les points des synchros (`ok`, `bad`, `run`), les lignes du journal (`lwarn`, `lbad`). `ds.minitiles` prend un ton par case (`tone`).
- Des noms longs et uniques : les lignes (`.t`, `.v`, `.v .x`, `.pl`, `.ttl` deviennent `row-date`, `row-value`, `row-sub`, `row-place`, `row-title`), le badge de retard (`late-tag`), une liste vide (`empty-note`), les paires de mots (`.kv` devient `facts`), les cases (`.u`, `.h`, `.d` deviennent `tile-unit`, `tile-note`, `tile-delta`), les trois `.dot` (`status-dot`, `sync-dot`, `scroll-dot`), l’état des sources (`status-name`, `status-state`, `status-every`, `status-detail`, `status-link`), la roue de l’en-tête (`busy-ok`, `busy-share`, `busy-text`), le premier chargement (`boot-title`, `boot-text`, `boot-progress`, `boot-retry`), les croix et les textes en `-x` (`sheet-close`, `toast-close`, `dialog-text`), le journal (`log-line`, `log-time`, `log-text`, `log-empty`), la pilule (`pill-value`), un onglet (`tab-label`), l’onglet du tiroir (`edgetab-label`), l’année d’une période (`periodtitle-year`), les filtres (`filter-pip`, `filter-all`, `filter-only`), l’interrupteur des réglages (`.sw` devient `switch`), le carré d’un filtre (`.sq` devient `.swatch`, sa couleur en `--n`).
- Une seule convention pour les fonctions : `ds.chose(holder, données, options)`. `ds.rank(holder, rows, options)`, `ds.minitiles(holder, items)`, `ds.verdict(holder, ratio, options)`, `ds.avatar(holder, {name, src}, {cls})` dessinent dans holder, ou rendent seulement leur élément sans lui ; `ds.periodPick(holder, options, {value, onPick, label})` ; `ds.picker(holder, items, options)` ; `ds.viewer(holder, items, options)` (holder : la `.viewer` de la page, ou null) ; `ds.drawer(holder, options)` (holder : la mise en page `[data-drawer]`). Les options : `value` pour le choix et `onPick` quand on choisit (`ds.chart.bars` et `ds.chart.donut` quittent `selected` et `pick`, `ds.selection` quitte `onChange`, `ds.calendar` quitte `day`, son `state()` et son `set()` aussi), `format` pour écrire un chiffre (`ds.chart.line` quitte `value` ; `label` y devient `formatDay`), `tip` pour les mots au survol (`ds.chart.heat` et `ds.chart.spark` quittent `title`). Les graphiques prennent aussi un sélecteur pour holder.
- Un deuxième appel sur le même holder rend le même composant, sans en ajouter un second ni rouvrir et refermer aussitôt : `ds.datePick` (à la valeur donnée), `ds.calendar`, `ds.picker`, `ds.periodPick`, `ds.status`, `ds.drawer`, `ds.version`, `ds.newsletter`, en plus de ceux qui le faisaient. Sans holder, rien ne plante.
- `ds.today()` donne le jour de Paris ; `ds.datePick.today` est retiré.
- Les réglages : les anciennes règles des boutons (`.back`, `.reload`, `.jump a`, `button.jl`, `.go`, `button.save`) sont retirées ; `ds.jobs` dessine des boutons de ds (`.btn`, `.is-act` pour « Lancer » et un « Journal » ouvert, trouvés par `[data-job="run"]` et `[data-job="journal"]`) et rend son holder.
- `ds.picker` : `set(items, options)` prend aussi les options avec la liste lue plus tard (`first`, `empty`…) ; avant, elles étaient ignorées, et les banques que la plupart ont n’apparaissaient pas en premier dans les réglages de Bank.
- Nouvelle vérification (`checks/names.js`) : aucun ancien nom dans `dist`, le même composant au deuxième appel, rien ne plante sans holder, `ds.today()`, les nouvelles options, les états dessinés par ds.

## 2.40.0 · 12 novembre 2026

Ce que les migrations des applis vont prendre (points 35 à 47 de l’étude), pour qu’elles se fassent sans toucher ds. Rien ne change dans Bank, Studio et Selecta tant qu’elles ne s’en servent pas ; sur le site, le bouton de la newsletter tourne pendant l’envoi au lieu de pâlir.

- `ds.api` couvre ce que les applis écrivaient à la main : un objet part en JSON, un formulaire (`FormData`, `URLSearchParams`) ou un fichier tels quels, avec le jeton CSRF d’une page Spring (les envois de photos de Selecta) ; `{progress}` suit un envoi, `{keepalive}` le fait survivre à la page, `{headers}` en ajoute. Seule la page de la plateforme pendant un déploiement (502, 503 ou 504 qui n’est pas du JSON) ou l’absence de réponse est prise pour un redémarrage et réessayée : l’erreur JSON d’une appli (le 502 « tool_error » de Studio) est la sienne, tout de suite. Quand les essais s’épuisent, `err.code` dit `restart` ou `offline`, avec des mots. Une erreur garde aussi `err.body`, et son `reason` comme code (Selecta). `{cache}` donne le mode de cache de la lecture (`no-store` par défaut) : avec `default`, une base que le serveur sert avec son ETag et `no-cache` revient en 304 de quelques octets quand elle n’a pas changé (Studio).
- Les chiffres : `ds.number` et `ds.money` prennent `{decimals}`, `{min, max}` (« 12,5 », les prix unitaires de Bank de 2 à 4 décimales) et `{signed}` (« + », et le vrai signe moins) ; `ds.percent(part, {decimals, signed})` écrit « 12 % » ; `ds.time(t, {pad})` l’heure de Paris, « 9h05 » ou « 09h05 » ; `ds.day.hour()` l’heure qu’il est à Paris.
- L’étiquette, `.tag` : un mot court dans un petit cadre, dans sa couleur (`--a`, l’or par défaut) ou un ton (`is-good`, `is-bad`, `is-mid`), pour les sept étiquettes refaites dans Bank et Studio. Selecta prendra `.badge`.
- Les boutons carrés de l’en-tête : `.btn.is-icon` dans `header.top` a l’allure du `.gear` de Bank et Studio (le fond du panneau, une icône discrète qui passe à l’or), 32px sur un petit téléphone ; une nouvelle version (`.newver.is-on`) garde son or.
- Les cases : un nombre de colonnes fixe (`.tiles.is-cols`, `--tile-cols`, `--tile-cols-phone`), une case qui s’ouvre (`.tile.is-link` et son `a.row-link`, comme une ligne), des chiffres qui rapetissent pour se lire en entier jusqu’à 11px, jamais en dessous (`.tiles.is-shrink`, `ds.fitFigures`).
- `ds.foldCard(card, key, {open})` : le titre d’une carte la plie (au clic, à Entrée ou Espace), sans que ce qu’il contient qui agit n’y touche ; l’appareil s’en souvient sous `ds-fold:<key>`, comme d’un `details.fold` ; `ds.seek` rouvre une carte pliée.
- Les onglets prennent aussi des liens (`aria-current`, la langue de Selecta), des boutons radio dans un `<label>` (un réglage) et des icônes seules (`.tabs.is-icons`), pour les deux contrôles segmentés de Selecta.
- Les tableaux reviennent dans `ds.css`, pour les listes de Selecta ; le menu de tri reste caché sur un ordinateur, la règle qui le cache pesant plus que celle des pilules. Leurs comportements (`ds.sortable`, `ds.selection`) restent dans `ds-tools.js`.
- Le site : `ds.newsletter(form, {url, fields, check, sending, done})` dans le kit, une seule façon pour le bandeau des événements et la page newsletter : l’adresse vérifiée, le bouton occupé (`.btn.is-busy`) qui tourne pendant l’envoi, les mots du serveur sous le champ.
- La page vitrine montre l’étiquette, les cases (colonnes, case qui s’ouvre, chiffre qui rapetisse), les onglets en liens, en boutons radio et en icônes, la carte qui se plie par son titre et les boutons carrés de l’en-tête.
- Nouvelles vérifications : `ds.api` (l’erreur JSON d’une appli n’est pas un redémarrage, un formulaire et un fichier tels quels, l’envoi suivi, le refus gardé entier, une lecture inchangée en 304 avec `{cache: "default"}`), les nouveaux formats, `ds.foldCard`, les cases, l’étiquette, les boutons de l’en-tête, les onglets, le menu de tri caché, les tableaux dans `ds.css`, et `ds.newsletter`.

## 2.39.0 · 12 novembre 2026

Des fichiers par appli, et les derniers réglages d’aspect de l’étude (26, 27, 32, 33 et 34). À l’écran : les flèches du calendrier et du choix de dates, quelques grands titres du site, l’espacement des titres réduits sur téléphone, l’accueil sur un écran de 1300px.

- Un fichier « outils » : ce que seuls Bank et Studio dessinent part dans `dist/ds-tools.css` (la pilule et le sélecteur, les périodes, le choix de dates, la poignée, la nouvelle version, la fiche, le panneau de filtres, les lignes, l’état des sources, les classements, les graphiques, le tableau, le calendrier, les réglages) et `dist/ds-tools.js` (ces composants, et `ds.drawer`, `ds.status`, `ds.jobs`, `ds.busy`, `ds.trouble`, désormais dans `src/tools.js`), liés après `ds.css` et `ds.js`. `ds-tools.js` n’a pas de noyau à lui : il prend celui de `ds.js`. L’or d’un choix (`chosen.css`) ferme les deux feuilles. La visionneuse et la grille de photos ne sont plus que dans `ds-photo.js`. Une page de Selecta télécharge 140 Ko au lieu de 445, une page du site 190 au lieu de 270 ; Bank et Studio, 425 au lieu de 445. L’API ne change pas.
- Les icônes, toutes les 214, dans un fichier à elles : `dist/ds-icons.js` met la planche en haut de la page, comme le faisait `ds.js`, au même moment (avant `DOMContentLoaded`), et le navigateur la garde d’une visite à l’autre. Bank et Studio le lient après `ds.js` ; Selecta et le site visent `icons.svg`, sans script. Les flèches ‹ › du calendrier et du choix de dates deviennent les chevrons de la planche. La visionneuse garde ses propres signes : elle tourne aussi sur le site, où la planche n’est pas dans la page.
- Les largeurs d’écran : 480, 768 et 1024px, 769 pour « plus large qu’un téléphone », 1280 pour un très grand écran ; le kit du site seul ajoute le téléphone tenu couché, 956px. La règle de l’accueil à 1376px est ramenée à 1280px.
- Les tailles de texte : les paires presque égales du site fusionnent (40 et 42 en 42, 48 et 52 en 48, 80 et 84 en 80) ; `--fs-40`, `--fs-52` et `--fs-84` sont retirés. Quatre tailles par rôle qui grandissent d’un cran sur ordinateur, venues de Selecta : `--text-md`, `--text-lg`, `--text-xl`, `--text-2xl`. Selecta les prend de ds ; le site s’en sert pour le texte et les titres d’encadré de ses pages d’événement, un téléphone tenu couché gardant le cran du téléphone ; les chiffres des petites cartes de Vitrine aussi.
- Les espacements de lettres en em partout : ceux du site et de Vitrine (`--ls-0-5` à `--ls-8`, en pixels, retirés) deviennent `--ls-031` à `--ls-214`, nommés en millièmes de la taille du texte, chacun donnant à la taille d’ordinateur les pixels d’avant. Sur téléphone, un titre qui rapetisse se resserre avec lui ; un réglage écrit exprès pour le téléphone garde ses pixels.
- Nouvelles vérifications (`checks/bundles.js`) : une page de Selecta (ds.css et ds.js seuls) a la bulle, la fenêtre et le formulaire qui demande, et rien des outils ; une page de Bank a les outils et les 214 icônes, dessinées ; `icons.svg` dessine ses icônes sans script ; les flèches du calendrier et du choix de dates sont les chevrons ; chaque fichier de `src` est dans le bon fichier de `dist` ; les largeurs d’écran de toutes les feuilles.

## 2.38.0 · 12 novembre 2026

Le ménage de l’intérieur : le même code écrit plusieurs fois devient une seule pièce. À l’écran, seulement ce que l’étude annonçait : les roues, les petits carrés, l’espacement des libellés, quelques teintes, la source en retard en jaune, l’onglet choisi en Vitrine.

- Un noyau JavaScript commun, `src/core.js`, en tête de `ds.js`, `ds-photo.js` et `ds-site.js`, chargé une seule fois quand une page en lie plusieurs : la langue et les mots communs, la fabrique d’éléments, le stockage de l’appareil, « moins d’animations », les durées des jetons, la couleur d’un jeton, `ds.h`, `ds.esc`, `ds.ico`, et `ds.day` (les jours de Paris, que le calendrier, les graphiques et le choix de dates partagent ; `ds.datePick.today` reste). Une quarantaine de petites fonctions en double sont retirées des modules ; l’API publique ne change pas.
- Les couches : la fenêtre de `ds.confirm`, la fiche, la visionneuse, le tiroir sur téléphone, le choix de dates ouvert et le menu du site s’empilent dans le noyau. Échap ferme celle du dessus seulement ; Tab tourne dans la fenêtre, la fiche, la visionneuse et le tiroir (qui ne gardait pas le clavier).
- Une seule roue de chargement : les six (le bouton occupé, l’action d’un message, l’en-tête, le premier chargement, la bulle, `.spinner`) sont dessinées par la même règle (`--spin-size`, `--spin-ring`, `--spin-top`) et tournent à la même vitesse dans les deux thèmes, 0,8 s.
- Un seul état « choisi » doré, `src/chosen.css` (la pilule en service, une période du choix de dates, le bouton doré, le jour choisi du calendrier), ses couleurs en jetons ; les onglets dans le choix de dates sont de vrais onglets, un peu plus serrés (`--tab-py`, `--tab-px`).
- Un seul petit carré de couleur, `.swatch` (`--swatch-size`, `.is-open`), et les carrés des filtres, du calendrier, des graphiques, des tuiles et du sélecteur sont celui-là, 10 px partout ; le filtre lit encore `--a`, pour une version. Le sélecteur passe sa couleur par le même `tone()` que les graphiques.
- Un seul point d’or, `.pip` (`--pip-size`), pour le filtre en service, la nouvelle version, la vue qui attend, le rechargement des réglages.
- Les mini-tuiles sont les petites cases : `ds.minitiles` dessine `.tiles.is-compact.is-fit` (la classe `.minitiles` reste pour les règles d’une appli), et les règles à part des mini-tuiles disparaissent.
- Les libellés en capitales prennent tous le même espacement (`--label-ls`) ; un titre de carte trop long se resserre (1 px) puis rapetisse. Les lignes séparées d’un trait (`ul.rows`, un classement, les paires d’une fiche, les tâches, connexions et champs des réglages) sont une seule règle (`--row-py`). La carte et toute sa famille sont dans `card.css`. Le voile (`--veil`) et le verre sur photo (`--glass-blur`) sont des jetons. Le kit du site partage ses deux bandeaux, le champ et le pot de miel de la newsletter, et la tuile photo de ses trois galeries.
- Les teintes calculées une seule fois : `--good-soft`, `--good-line`, `--mid-soft`, `--mid-line` à côté de `--bad-soft` et `--bad-line`, à la même part dans chaque thème (`--soft-mix`, `--line-mix`) ; la teinte d’une couleur d’élément, `--tint-soft` (14 %) ; toutes les couleurs transparentes partent de leur couleur de base (`color-mix`), plus aucun RVB recopié.
- Les jetons qui manquaient : `--s-18`, `--s-28`, `--s-36` (au lieu des calculs), `--page-site` au lieu des six 1200px, les largeurs de lecture (`--read-s`, `--read-m`, `--read-l`, `--read-xl`), les couches `--z-scrim` et `--z-dialog` (une fenêtre passe au-dessus d’une fiche ou de la visionneuse), les flous, `--o-off` et `--o-muted`, `--ico-s` et `--ico-m`, `--touch-target`, `--safe-top`, `--safe-right`, `--safe-bottom`, `--safe-left`, `--r-xs`.
- Les choix de Vitrine rangés dans les jetons : les règles Vitrine qui ne posaient que des variables (la fiche, la fenêtre, le tableau, la barre de sélection, le lien retour, le curseur de zoom) sont devenues des jetons des deux thèmes ; les arrondis, durées et ombres sont déclarés dans le bloc Atelier aussi, et les quatre jetons qui n’existaient qu’en Vitrine ont leur valeur Atelier.
- « Attention » en jaune partout : dans l’état des sources, le point et la ligne d’une source en retard prennent `--mid`, et non plus l’or.
- Vitrine : l’onglet choisi a un fond à 18 % d’or (`--tab-on-bg`) ; un choix encadré (« Ce mois ») garde ses 5 %.
- Supprimées, une fois montrées et validées : `.errs`, `.msg .txt small.again`, `.event-card-cta`, et trois règles `[hidden]` en double.
- Les fichiers rangés par rôle : `scripts/build.sh` assemble fondations, marques, contrôles, surfaces, données, pièces publiques, pages, puis l’état choisi ; `shell.css` est découpé (`page.css`, `card.css`, `rows.css`, `msg.css`, `status.css`, `tabs.css`, `avatar.css`), la visionneuse tient dans `viewer.css`, `site.css` devient `public.css`. Les fichiers de `dist` gardent leurs noms et leur contenu.
- Corrigé : depuis 2.37.0, un titre de carte dessiné dans une vue cachée n’était plus ajusté quand la vue s’affichait (le compte facture de Bank pouvait passer sur deux lignes) ; un titre l’est de nouveau dès que sa largeur change.
- Nouvelles vérifications : une seule roue à la même vitesse dans les deux thèmes, les six carrés pareils, les couches (Échap ferme la fenêtre puis la fiche, Tab reste dans chacune), un titre ajusté quand sa vue s’affiche, les mini-tuiles qui sont des petites cases.

## 2.37.0 · 12 novembre 2026

Des corrections, sans rien changer à l’aspect des applis.

- `ds.confirm` garde le clavier : Tab tourne à l’intérieur de la fenêtre, la page derrière ne répond plus tant qu’elle est ouverte (`inert`, les bulles exceptées), son titre la nomme et son texte la décrit pour les lecteurs d’écran, avec des noms propres à chaque fenêtre ; son champ porte le titre comme nom.
- Le kit du site au clavier : la barre cachée et le menu fermé ne se laissent plus atteindre avec Tab (ils passent en `visibility: hidden` une fois partis), ils ne sont plus cachés en permanence aux lecteurs d’écran ; le bouton du menu dit s’il est ouvert (`aria-expanded`, `aria-controls`), l’ouvrir mène le clavier au premier lien, Échap ou le voile le ramènent au bouton.
- Les galeries d’une page d’événement s’ouvrent au clavier : chaque photo se laisse atteindre avec Tab et s’ouvre avec Entrée ou Espace, et se nomme (« Open … »).
- L’ajustement des titres de carte ne mesure plus à chaque changement de la page : seulement quand un titre arrive ou que ce qu’il porte change. Le pourcentage du chargement, la bulle d’une courbe sous la souris ou un journal ouvert ne le déclenchent plus.
- Les bulles : ôtées une fois leur fondu fini (il durait 0,3 s en Vitrine, la bulle partait à 0,2 s), leur compte à rebours attend aussi quand le clavier est dessus, et elles sont lues à voix haute par deux lignes qui restent dans la page dès son chargement.
- « Moins d’animations » respecté partout, par une seule règle dans `tokens.css` : plus aucune durée, ni montée ni zoom au survol, et toutes les animations s’arrêtent, les roues et les pulsations du site comprises ; le site va d’un coup à une partie de la page au lieu d’y glisser.
- Le chargement n’est plus lu en boucle par les lecteurs d’écran : la part qui monte (`.pc`, et `#boot-pc` du premier chargement) reste affichée mais n’est plus lue ; ils entendent les mots de `ds.busy.start` une fois, puis « Chargement terminé » (« Loading done » en anglais).
- `ds.esc(text)` écrit un texte sans danger dans du HTML, et le kit du site reçoit `ds.h` et `ds.esc`, les mêmes que `ds.js`, pour une page qui ne charge que lui : le site s’en sert pour ce qui vient de ses Gists.
- Les quatre jetons que personne n’utilisait sont retirés : `--z-veil`, `--overlay-black-light`, `--overlay-black-lighter`, `--viewer-hover`.
- La règle du pied de page ne vise plus que celui d’une appli (`.wrap > footer`), sur une ligne qui se resserre au lieu de passer à la ligne : Selecta n’a plus à l’annuler, Bank et Studio retirent leurs corrections.
- Quelques plantages évités : `ds.date`, `ds.when`, `ds.ago` et `ds.soon` écrivent « — » pour une date illisible ; un lien du site vers un id comme `#2026` fonctionne ; une photo de galerie sans image n’empêche plus les autres galeries de s’ouvrir ; la visionneuse et la grille de photos chargées deux fois (`ds.js` et `ds-photo.js`) ne s’installent qu’une fois.
- README et CHANGELOG remis d’accord avec le code : signatures (`ds.periodPick`, `ds.calendar`, `ds.picker`, `ds.toast`, `ds.viewer`, `ds.confirm`), noms des paramètres tels qu’ils sont, taille de `ds.js`, test de chaque appli, largeurs 956 et 1376px du site, date de 2.11.0.
- Nouvelles vérifications : un chargement de 3 s entendu au début et à la fin seulement, `ds.h` et `ds.esc` du kit du site, Tab dans `ds.confirm`, le menu du site au clavier, une galerie ouverte avec Entrée, l’ajustement des titres qui ne mesure rien sur un changement de texte, la pause d’une bulle sous le clavier, les roues arrêtées quand l’appareil demande moins d’animations.

## 2.36.0 · 12 novembre 2026

- `ds.chart.donut` : avec `open(key, holder)`, la part choisie ouvre son détail juste sous sa ligne de la légende (holder, vide, que la page remplit tout de suite ou plus tard), et le referme quand on la laisse ou qu’on en choisit une autre. Bank y ouvre les sous-catégories et les opérations d’une catégorie, sous la catégorie elle-même.

## 2.35.1 · 12 novembre 2026

- Sur téléphone, sous un en-tête de période stable, le choix des dates avait la largeur du titre (« Toutes les dates », 180 px environ) : ses boutons se serraient sur trois lignes et ses onglets se chevauchaient. Il reprend la largeur de la carte (jusqu’à 480 px).

## 2.35.0 · 11 novembre 2026

- L’en-tête de période peut rester stable (`.periodhead.is-steady`) : ses flèches gardent leur place quand elles ne mènent nulle part, si bien que choisir une période qui en a ne fait plus descendre le titre ni ce qui suit ; sur téléphone, elles restent sur la ligne du titre. Dans les opérations de Bank, choisir un mois faisait sauter la page de quelques pixels.
- Kit du site : le « Book Now » de la barre du haut s’espace comme les autres boutons du site (2,5 px entre les lettres), et non comme un bouton d’appli (1,68 px).

## 2.34.0 · 11 novembre 2026

- `ds.chart.line` sait dire ce qui est prévu : avec `now` (le jour d’aujourd’hui), la courbe reste pleine jusqu’à lui puis passe en pointillé, sur un fond plus pâle, et un trait fin le marque, son nom au-dessus (`nowLabel`, « aujourd’hui »). Bank y dessine le solde de son compte facture au fil du mois : tel qu’il a été, puis tel qu’il devrait aller, chaque dépense à venir un point à son jour, la marge en pointillé. La vitrine le montre.

## 2.33.0 · 11 novembre 2026

Les petites cases de chiffres avaient deux apparences : chacune dans sa boîte (`.tiles.is-compact`, l’accueil et le compte facture de Bank, Selecta), ou toutes jointes dans une grille au libellé doré (`.minitiles`, les variations d’un cours dans Bank, les moyennes de Studio). Il n’en reste qu’une, celle du reste des pages.

- `.minitiles` : chaque mini-tuile dans sa propre boîte, comme une tuile compacte (même fond, même trait, même arrondi, 8 px entre elles), son libellé en capitales grises au lieu de dorées. Les grandes tuiles (`.tiles`), dont la couleur dit la série, restent jointes.

## 2.32.0 · 11 novembre 2026

- Un titre de carte qui porte quelque chose sur sa ligne (un menu, une période, un bouton, l’heure de lecture) le garde sur cette ligne quand il le peut : ses lettres se resserrent, puis rapetissent (12 px, puis 11 px au plus petit), seulement autant qu’il le faut ; au-delà, ce qu’il porte passe en dessous, comme avant. `ds.js` le refait au chargement, quand la fenêtre change de taille et quand une page redessine ses cartes (`ds.fitTitles()` le demande aussi).
- `ds.calendar` : ce qui dure plusieurs jours (un séjour, un voyage ; `span: {from, to}` sur l’élément de chacun de ses jours) devient dans le mois une seule barre à sa couleur, d’un jour à l’autre, à la même hauteur dans chaque case qu’elle traverse, son titre à son début et au lundi où elle continue, comme dans l’agenda de Google. Sur téléphone, un trait fin sous le numéro du jour.
- `ds.chart.donut` : une ligne de la légende peut porter un mot sous son nom (`note`), en rouge (`tone: "bad"`) ou en vert (`"good"`). Bank y dit ce qui a augmenté par rapport à d’habitude, à la place de sa carte « Ce qui augmente ».
- Les 39 premières icônes, dessinées à la main pour Bank et Studio, prennent le dessin de Lucide sous le même nom (35 ; `list` garde ses coches avec `list-checks`, `sliders` ses deux curseurs avec `settings-2`), comme toutes les autres. Seuls les trois logos de marque (Instagram, Bluesky, X) restent dessinés à la main : Lucide ne dessine plus de marques. Bank et Studio retirent leur propre copie de ces icônes : celles du design system suffisent.
- La visionneuse : ses trois boutons deviennent carrés, dans le verre sombre de son compteur, avec la croix et les flèches des icônes (celles de « ← Home » sur le site), et se remplissent d’or au survol comme les autres boutons du site ; ils restaient ronds, transparents et à peine teintés.
- L’icône de l’avion (`i-plane`, l’onglet Voyages de Bank, la destination des pages d’événement du site) était dessinée de travers : sa queue sortait de l’axe de l’avion. Elle prend le dessin de Lucide, symétrique.

## 2.31.0 · 11 novembre 2026

Bank et Studio choisissaient leurs périodes avec deux composants différents du design system : la pilule venue de Bank (« 12 mois ▾ ») et le choix de période venu de Studio (des onglets, et sur téléphone une liste dorée à sa propre flèche). Il n’en reste qu’un.

- `ds.periodPick` garde ses onglets sur ordinateur et prend la pilule sur téléphone (`label.pill.periodpick-list`), la même que pour un mois ou un tri : « 1 an ▾ » dans Studio comme « 12 mois ▾ » dans Bank. La liste dorée et sa flèche dessinée disparaissent. Dans un titre de carte (`.ct`), il se range à droite comme la pilule.
- Un titre de carte qui replie sa carte lui-même (`.ct.fold[aria-expanded]`, Studio) prend le chevron des sections repliables, au lieu d’un « ▾ » qui se lisait comme une deuxième flèche de menu à côté de la période.
- La vitrine montre une période avec `ds.periodPick` et garde la pilule pour un mois ou un sens.

## 2.30.0 · 11 novembre 2026

- Kit du site, `ds-site.js` : ce que les scripts du site faisaient chacun de leur côté. `ds.json(url)` lit un fichier JSON (les Gists du site), redemandé à chaque visite et une seule fois par page, quel que soit le nombre de scripts qui le demandent : la page Events le lisait deux fois. `ds.ready(...attentes)` ôte l’écran de chargement une fois ces attentes et la photo d’en-tête de la page arrivées, ou en échec ; `ds.photo(src)` et `ds.images(racine)` attendent une photo, ou toutes celles d’une partie de la page. `ds.screens()` fait défiler une page écran par écran (l’accueil) : un point par écran, celui de l’écran affiché allumé, l’invite à descendre, le saut vers un écran nommé dans l’adresse.
- `site.html`, la page du kit dans la vitrine, montre aussi une carte de la liste des événements, deux prix côte à côte, les témoignages et la carte de la newsletter.

## 2.29.0 · 11 novembre 2026

Tout ce qu’alexispaoleschi.com dessinait encore lui-même rejoint le kit du site : le site n’a plus de feuille de style à lui.

- Kit du site : l’accueil (`<body class="home">`, `src/home.css`), la liste des événements (`src/eventslist.css`), la page de la newsletter (`src/newsletter.css`) et le bandeau des témoignages (`src/testimonials.css`), tels quels. Les pièces de la page du Sénégal deviennent des variantes qu’une page d’événement peut prendre : deux prix côte à côte (`.price-display.is-pair`), un second titre de section (`.section-subtitle`, `.session-title`), un encadré lu depuis la gauche (`.info-box.is-left`), deux photos larges (`.gallery-grid-duo`).
- Bandeau photo : la page peut donner sa photo, `style="--hero-photo: url('/chemin/depuis/la/racine.jpg')"` ; les photos du site quittent ainsi ses feuilles de style pour ses pages, où est leur place. Le chemin part de la racine : c’est le fichier du design system qui le lit.

## 2.28.0 · 11 novembre 2026

Ce que les pages d’alexispaoleschi.com partagent entre elles monte ici, dans un kit à part que les applis ne chargent pas, et le site prend les pièces du design system qu’il redessinait encore.

- Le kit du site, `dist/ds-site.css` (40 Ko) et `dist/ds-site.js` (9 Ko) : la base d’une page du site, l’écran de chargement, l’invite à redresser un téléphone couché, le sous-titre et le filet d’or, les pastilles de lien dorées, le lien retour sur la photo d’en-tête, la barre qui apparaît une fois l’en-tête passé et son menu de téléphone, les bandeaux des réseaux et de la newsletter, et les blocs d’une page d’événement (sections, modèles, lieu, accès, programme, tarifs, réservation, FAQ, organisateur, galeries). Le script construit la barre et le lien retour depuis leurs attributs (`<div id="nav">`, `<div id="back-button">`), ouvre et ferme le menu, descend en douceur vers une partie de la page sous la barre, ôte l’écran de chargement (`window.hideLoader()`) et ouvre les galeries dans la visionneuse. Les règles sont celles du site, au pixel près ; les applis n’en voient rien. Les noms qu’une page seule du site utilise autrement changent : le titre d’une galerie d’événement devient `.gallery-heading`, l’animation du plan `map-pulse`.
- Les icônes dans un fichier à part, `dist/icons.svg`, pour une page sans `ds.js` : `<svg class="ico"><use href="ds/icons-2.28.0.svg#i-mail"/></svg>`, sans script, gardé en cache. `ds.icon(nom, classe)` (dans `ds-site.js`) écrit la même chose. Deux icônes de plus, celles du site : `i-users` et `i-leaf`.
- Page document : la page légale d’un site (`body.doc.is-legal`) avec son en-tête centré, ses parties, un mot à retenir (`.doc-notice`), le bloc à signer des deux parties (`.doc-sign` et ses champs) et son pied ; sur papier, chaque page garde 20 mm en haut et en bas.
- `scripts/sync.sh <version> <site> site` copie le kit, la visionneuse seule, les icônes et les polices dans le dossier `ds/` du site.
- `node checks/site.js` vérifie le kit dans un navigateur : la barre et son menu, les liens, le lien retour et son icône, l’écran de chargement, la visionneuse, les icônes du fichier.

## 2.27.0 · 10 novembre 2026

Ce que le site a demandé pour n’écrire plus aucune valeur à la main.

- Bandeau photo entre deux sections (`.hero.is-band`) : 60 % de la hauteur de l’écran (50 % sur téléphone), titre de 64px espacé de 6px (36px sur tablette), une ligne en italique fin dessous ; les bandeaux intermédiaires des pages d’événements du site le prennent. Sur un téléphone, son titre se réduit avec l’écran (de 24 à 36px, lettres espacées de 4px) : son mot le plus long (« PHOTOGRAPHERS ») y tient, alors qu’il débordait de l’écran.
- Tailles de texte du site : `--fs-26`, `--fs-32`, `--fs-40`, `--fs-42`, `--fs-48`, `--fs-52`, `--fs-64`, `--fs-80`, `--fs-104` (ses titres de galerie et d’encadré, son nom sur l’accueil, ses prix).
- Interlignes : `--lh-relaxed` (1,6, les notes du site) et `--lh-airy` (2, son texte courant ; `--text-lh` de Vitrine le prend).
- Espacement de lettres `--ls-5`.
- Durées : `--t-slow` (0,4 s en Atelier, 0,5 s en Vitrine) et `--t-loop` (2 s, un tour d’une animation qui boucle : une pastille qui rebondit, une flèche qui invite à défiler).

## 2.26.0 · 10 novembre 2026

Ce que la migration d’alexispaoleschi.com a demandé.

- `dist/ds-photo.js` : la visionneuse et la grille de photos seules (25 Ko), pour une page publique qui n’a pas besoin du reste de `ds.js` (245 Ko). Les pages d’événements du site ouvrent leurs galeries avec.
- Barre d’onglets sur téléphone : la place qu’elle garde au pied de la page (90px) n’est plus réservée que sur une page qui en a une (`.tabs.is-bar`). Le site et Selecta n’ont plus à la rendre.
- Lien retour sur une photo (`.back-link.on-photo`) : le bouton flottant du site tel qu’il est, un filet d’or doux (20 %) au lieu de l’or plein, son ombre légère qui grandit quand il monte (`--photo-shadow`, `--photo-shadow-up`), sa flèche un peu plus épaisse ; il ne bouge plus quand on appuie.
- Vitrine : le gris discret (`--faint`) revient à 60 % d’encre, celui du site, comme décidé ; la 2.24.0 l’avait passé à 62 %. Il fait 4,3 à 4,5:1 sur le beige, un choix que la vérification de la vitrine laisse de côté, comme l’or du site.
- Bandeau photo (`.hero`) : il prend les valeurs exactes des deux bandeaux du site. Sans variante, c’est celui des pages Events et newsletter : 420px de haut (360px sur tablette, 300px sur téléphone), titre de 56px espacé de 6px (36px sur téléphone) au-dessus d’un trait d’or, capitales d’or de 16px. `.is-full` est celui d’une page d’événement : la hauteur de l’écran, nom en 84px espacé de 8px (56px sur tablette et téléphone), lieu en capitales d’or de 28px, date de 20px, puis le bouton. Les titres gardent l’interligne de 1,8 des titres du site, et un mot trop long reste entier. Chaque taille et chaque écart est un jeton `--hero-*` qu’une page peut changer (le site le fait pour un téléphone tenu en largeur). `.is-short` et `.is-bottom` (la couverture de Selecta) ne changent pas.
- Page document (`body.doc`) : sur papier, chaque mot s’imprime en noir plein et un peu plus gras (400, le gras en 600), pour qu’une page à signer se lise bien. Les pages légales du site (conditions, autorisation de modèle) passent sur ce modèle.
- Jetons : `--fs-84`, `--ls-6`, `--ls-8`, et dans l’échelle des espaces `--s-40`, `--s-56`, `--s-60`, `--s-80`, des valeurs du site.
- Carte à couverture (`.card-cover`) : la photo garde son 16:9 et le trait d’or passe dessous, même sur une page qui compte les bordures dans les tailles (`box-sizing: border-box`, le site) ; elle y perdait 3px.

## 2.25.0 · 10 novembre 2026

- Courbe (`ds.chart.line`) : une forme haute, pour le cours d’une ligne de bourse (Bank, le PEA). `tall` la grandit (180px, 150px sur téléphone) et écrit aussi son jour du milieu sous elle ; `area` remplit son fond de la couleur de la série ; `ref: {v, label}` trace un niveau en pointillé avec son nom (un prix de revient), compris dans l’échelle ; `marks: [{x, label}]` pose un point sur chaque jour donné (des achats), son nom au survol ; `hover` montre, sous le pointeur ou le doigt, un curseur, un point et une bulle avec le jour et la valeur, qui reste dans la courbe. Sans ces options, la courbe ne change pas.
- La vitrine montre le cours d’une ligne sur un an, son prix de revient et ses achats.

## 2.24.1 · 10 novembre 2026

- Barre d’onglets sur téléphone : à cinq vues ou plus (Bank et ses Placements), elle prend la largeur de l’écran moins 8px de chaque côté, et les bulles au-dessus d’elle aussi (`--tabbar-w`), ses boutons se serrent un peu : chaque nom tient en entier. Sur les plus petits téléphones, un nom trop long finit par « … » au lieu de sortir de la barre.

## 2.24.0 · 10 novembre 2026

Ce que l’étude de la page vitrine a trouvé, dans les deux thèmes, sur ordinateur et sur téléphone.

- Barre du site (`.topbar.is-site`) : centrée tant qu’elle tient, elle ne pousse plus jamais ses liens sur le nom (`justify-content: safe center`). Sur téléphone, les liens marqués `.is-wide` la quittent, comme prévu ; la vitrine les marque.
- Boutons en Vitrine : 45px de haut (`--control-h`, la hauteur de Selecta), 28px de côté (20px sur téléphone), capitales espacées de 0,12em. Les 63px du site deviennent le gros bouton, `.btn.is-large` (`--btn-l-h`, `--btn-l-px`, `--btn-l-ls`), que prennent d’eux-mêmes les boutons d’un bandeau photo (`.hero-acts`). En Atelier, `.is-large` est le bouton habituel.
- Champs et menus : aussi hauts qu’un bouton à côté d’eux (`--control-h` : 34px en Atelier, 45px en Vitrine), leur texte centré dans cette hauteur ; seule une zone de texte garde de la place au-dessus et au-dessous de ses lignes (`--field-py`). Dans la barre d’une sélection (`.selbar`), les menus prennent la hauteur des petits boutons.
- Fenêtre (`.dialog`) : ses deux boutons gardent leur hauteur (ils s’étiraient à 62px quand la fenêtre était plus haute que son contenu) et passent l’un sous l’autre quand la ligne ne suffit pas ; sur téléphone ils se partagent la ligne, et Vitrine y laisse 20px de marge comme dans une fiche.
- Fiche (`.sheet-acts`) : ses boutons passent sur deux lignes quand ils ne tiennent pas sur une, au lieu d’être coupés (« ENOMMEI », « NREGISTRE »).
- Titre de carte (`.ct`) : 13px au lieu de 12px ; l’action à côté de lui passe dessous quand les deux ne tiennent pas sur la ligne, au lieu d’un titre écrasé sur quatre lignes.
- Plus aucun texte sous 11px : les libellés, les en-têtes de filtres et de tableaux, les onglets du bas sur téléphone, les codes de l’agenda, les axes des graphiques et les pastilles passent de 9 ou 10px à 11px. Les jetons `--fs-9` et `--fs-10` disparaissent.
- Mots en couleur de la palette (le nom d’une banque, un code de réseau) : `--tint-ink` dit ce qu’ils gardent de leur couleur, le reste étant l’encre : tout en Atelier, 55 % en Vitrine, pour se lire sur blanc et sur le beige. `.tint` écrit un mot ainsi (`<span class="tint" style="--n: var(--c-ciel)">`) ; les codes et les noms posés sur une teinte de leur couleur en gardent un peu moins (`--tint-ink-on-tint`), et cette teinte passe de 18 à 12 %.
- `--accent-text`, l’or d’un mot : le même or que les traits dans les deux thèmes, pour qu’un thème puisse un jour l’assombrir seul. Le blanc reste sur l’or.
- Vitrine : « ce qui demande un coup d’œil » (`--mid`, « À classer ») est une rouille lisible (`--rust-600`) ; le gris discret (`--faint`) passe de 60 à 62 % d’encre, et en Atelier `--mist-500` s’éclaircit un peu (#8892a0), pour se lire sur une ligne choisie.
- Pastille « bientôt » (`.badge.is-soft`) : un mot gris sur un or pâle, dans un filet d’or ; elle était illisible dans les deux thèmes. Sur le rouge, une pastille écrit dans la couleur du panneau.
- Plage de dates (`ds.datePick`) en Vitrine : les jours entre les deux bornes prennent un or à 20 %, celui à 5 % ne se voyait pas.
- Zones de clic d’au moins 24px : la croix et l’œil des filtres, le titre d’une période, les onglets, l’action et la croix d’une bulle, le titre d’un pli, les titres de colonne qui trient (leur zone dépasse la ligne de capitales). Sous un doigt, les cases à cocher font 20px.
- Les petits carrés de couleur (filtres, tuiles) suivent les angles du thème : carrés en Vitrine.
- La vitrine : la photo de la carte à couverture, un logo d’exemple qui ne se casse plus, « Annoncer une nouvelle version », un exemple de gros bouton, les mots en couleur écrits avec `.tint`.
- Un contrôle de plus, `node checks/showcase.js` : sur la vitrine, dans les deux thèmes, sur ordinateur et sur téléphone, chaque mot se lit sur ce qui est dessous (sauf l’or du site, et le blanc sur lui, gardés exprès), aucun texte n’a moins de 11px, champs, menus et boutons ont la même hauteur, la barre du site garde son nom à part, aucun bouton de fiche ou de fenêtre n’est coupé.

## 2.23.2 · 10 novembre 2026

- Bouton occupé (`.btn.is-busy`, le bouton d’un formulaire envoyé) : il garde ses couleurs et sa roue tourne. Le style d’un bouton indisponible ne s’applique plus à lui. En Vitrine, le texte d’un bouton « enregistrer » occupé disparaissait : blanc sur le fond blanc d’un bouton désactivé (« Se connecter » de Selecta).
- Roues : celle de l’en-tête (le chargement et son pourcentage), celle de l’écran de chargement et celle d’une bulle « occupé » montrent toutes leur quart doré qui tourne, sur un anneau plus clair (`--spin-ring`). Celle de l’en-tête restait un anneau uni dans les deux thèmes : sa couleur de quart était écrasée. En Vitrine, l’anneau des deux autres prenait l’or plein du trait fort : on ne la voyait pas tourner.
- Page de réglages : le message de la barre du bas (« 1 réglage modifié, pas encore enregistré. ») est une simple ligne de texte. Il prenait aussi le cadre d’un message durable (`.msg`) : vide, un petit carré restait visible ; écrit, la barre grandissait.
- Les contrôles du comportement attendent que le cadre caché qui reçoit un formulaire de démonstration ait fini de charger : il effaçait parfois l’adresse que le contrôle suivant attend après une reconnexion.

## 2.23.1 · 10 novembre 2026

- Deux jetons : `--lh-loose` (1,8), l’interligne aéré des sites publics, celui des titres de Vitrine et du texte de Selecta ; `--ls-loose` (0,07em), le peu d’air entre les lettres des titres et du pied de page de Selecta. Les titres de Vitrine prennent `--lh-loose`, à la même valeur qu’avant.
- Vitrine : `--shadow-soft`, l’ombre la plus légère du site (2px sous l’objet, 8px de flou), pour une barre ou un tableau, sous `--shadow-card`. Une carte la prend avec `--card-shadow: var(--shadow-soft)` ; une ligne de liste se passe d’ombre avec `--card-shadow: none`.

## 2.23.0 · 10 novembre 2026

- Zoom (`.zoom-slider`) : il reprend la barre de Selecta en ligne. Un rail de 6px aux bouts ronds, sur un fond d’or très pâle, presque blanc, avec un bord doux (le trait doux en Vitrine, le trait fort en Atelier), sous un curseur or de 18px cerclé de la couleur de la page. L’or ne remplit plus le rail jusqu’au curseur : `ds.photogrid` ne pose plus `--zoom-at`.
- Tuiles compactes (`.tiles.is-compact`) en Vitrine : ce sont les petites cartes du tableau de bord de Selecta. Séparées (20px, 16px sur téléphone), d’au moins 200px de large pour qu’un montant tienne (150px sur téléphone, où deux se tiennent côte à côte s’il y a la place), blanches, avec le bord et l’ombre douce des cartes du site, le chiffre or en Gilda (28px, 22px sur téléphone) au-dessus de son libellé en petites capitales. Une tuile qui monte ou qui descend garde son vert ou son rouge. En Atelier, rien ne change : les tuiles de Bank restent les mêmes.
- Les contrôles des feuilles de style acceptent la moitié d’un jeton (`calc(var(--s-6) / 2)`), comme le font déjà les graphiques.

## 2.22.0 · 9 novembre 2026

- Synchros (`ds.jobs`) : `ds.jobs.open(clé)` ouvre le journal d’une tâche comme son bouton « Journal », pour une adresse qui le demande (`/settings#patreon/journal`, les liens du brief du matin de Studio). Le bloc d’une tâche a l’identifiant `job-<clé>`.
- Page de réglages : la barre de liens vers les cartes (`.jump`) s’affiche d’elle-même sur téléphone. Bank et Studio l’y montraient chacun avec la même règle.

## 2.21.1 · 9 novembre 2026

- Classement (`ds.rank`) : un nom donné comme un élément (le lien d’une personne, un nom suivi de son étiquette) garde la couleur des noms, sans soulignement, et passe en or au survol, comme un nom donné en texte avec son adresse.
- Classement : le nom et sa ligne grise reprennent l’interligne du texte (1,5), celui des classements de Studio, au lieu de 1,3 : les lignes respirent comme dans Studio en ligne.
- Petites tuiles (`ds.minitiles`) sur téléphone : le titre ne passe sur deux lignes que pour quatre tuiles rangées deux par deux. Deux ou trois tuiles gardent leur titre sur une ligne, comme dans Studio, pour que leurs chiffres restent alignés.

## 2.21.0 · 9 novembre 2026

- Année de jours (`ds.chart.heat`) : ce qu’une semaine a gagné, écrit sous elle (`below`), peut dire plus au survol : `below(lundi)` rend un chiffre, ou `{text, title}` (« semaine du 2 nov. · +12 abonnés · 3 posts », comme dans Studio).
- Choix de période (`ds.periodPick`) : sur téléphone, la liste s’écrit dans la petite taille des onglets qu’elle remplace (13px), comme dans Studio, pour tenir à côté du titre d’une carte.

## 2.20.1 · 9 novembre 2026

- Calendrier : un mois qui a besoin d’une sixième semaine (novembre 2026, du lundi 26 octobre au lundi 30 novembre) la montre entière, jusqu’au dimanche, avec les premiers jours du mois suivant estompés comme sur les lignes du dessus. Elle s’arrêtait au dernier jour du mois.

## 2.20.0 · 9 novembre 2026

- Calendrier (`ds.calendar`) : `ready(state)` permet à une appli de dire qu’elle n’a pas encore lu les jours demandés. Tant qu’elle répond non, le calendrier garde à l’écran ce qu’il montrait (redessiné avec ce que l’appli a déjà), puis passe au nouveau mois au `draw()` suivant, une fois les jours lus. C’est ce que faisait l’agenda de Studio : un mois s’affiche une fois, avec tout ce qu’il montre, plutôt que vide puis rempli. Sans `ready`, rien ne change : il bouge tout de suite.
- Calendrier : un élément qui a un compte (`count`, « 2/4 » : un même titre sur plusieurs réseaux) donne dans sa case son titre d’abord, puis son compte, puis ses codes, que les cases étroites (1024px et moins) laissent tomber. Sinon, dans une case étroite, les codes cachaient le titre. Les autres éléments gardent leurs codes avant le titre.

## 2.19.6 · 9 novembre 2026

- La roue de l’en-tête : le pourcentage monte à vitesse régulière, de façon à arriver à 99 % à la fin prévue, la durée qu’a prise ce chargement la dernière fois. Il ne part plus vite pour ralentir ensuite, et ne compte plus par bonds. La toute première fois, sans durée connue, la part du travail que l’appli donne (`pct`, les lignes lues de Studio) guide la fin prévue, et la vitesse s’y plie en douceur ; ensuite elle ne compte plus pour la vitesse : les lignes de Studio ne prennent pas toutes le même temps à lire, et la faisaient ralentir. Il attend à 99 % un chargement plus long que prévu ; à la fin, il va à 100 % en un quart de seconde, puis la coche.

## 2.19.5 · 9 novembre 2026

- La roue de l’en-tête : `ds.busy.say(mot)` affiche un mot à la place du pourcentage jusqu’à la fin (le « calcul… » de Studio, une fois tout lu, pendant que la page se dessine). Pour qui demande moins d’animations, la roue ne tourne plus et la coche s’affiche d’un coup, comme Studio le faisait de son côté.

## 2.19.4 · 9 novembre 2026

- Choix de la période (`ds.datePick`) : au-dessus des mois, l’année est écrite simplement entre les deux flèches, comme dans Bank, et non plus dans un menu (venu du « aller à un mois » de Studio). Le choix du mois du calendrier aussi.

## 2.19.3 · 9 novembre 2026

- Tiroir de filtres : le mot « seul », qui garde une source seule dans son groupe, devient un œil (`#i-eye`, « ne voir que celle-ci »), nommé « Seulement … » pour les lecteurs d’écran et dans l’infobulle. Toujours caché sur ordinateur jusqu’au survol de la ligne, toujours visible sur téléphone.
- Tableau en cartes sur téléphone : dans une carte (`.card`), la ligne choisie est dorée d’un bord à l’autre de la carte, par-dessus sa marge intérieure (`--card-pad`), et non plus seulement sous son contenu.

## 2.19.2 · 9 novembre 2026

- La fiche (`.sheet`) s’ouvre au milieu de l’écran sur ordinateur, comme celle de Bank l’a toujours été : une fenêtre de 560px au plus, qui défile à l’intérieur quand elle est plus longue que l’écran. 2.18.0 l’avait mise en panneau à droite par erreur : aucune appli ne s’en servait encore. Sur téléphone, elle monte toujours du bas.

## 2.19.1 · 9 novembre 2026

- Atelier : le vert des entrées et le rouge des sorties reprennent les couleurs vives qu’ont Bank et Studio en ligne (`#4ec98a`, `#e8686b`), à la place de celles réglées sur la clarté de l’or en 2.14. Dans Atelier, plus aucune couleur ne suit l’or : l’or reste tel qu’il est, les couleurs qui ont un sens (vert, rouge, jaune) et la palette sont vives et lisibles sur le fond sombre. Le rouge de « Loisirs » (`--c-corail`) redevient le même que celui des sorties.
- Page vitrine : chaque partie d’Atelier est à la hauteur de la même partie de Vitrine. Les deux colonnes partagent les mêmes lignes ; la plus courte garde de la place en dessous.

## 2.19.0 · 9 novembre 2026

Ce qu’au moins deux des quatre projets (Bank, Studio, Selecta, le site) écrivaient chacun de leur côté, d’après l’étude des quatre.

- `ds.api` : un appel qui tombe sur le serveur en train de redémarrer (502, 503, 504, ou pas de réponse) réessaie toutes les 3 s pendant une minute, comme dure une mise en ligne (`{retry: false}` pour s’en passer) ; une page Spring envoie son jeton CSRF (`<meta name="_csrf">`, `<meta name="_csrf_header">`) avec tout ce qui n’est pas une lecture ; une erreur porte `err.status` et `err.code` (le code du serveur) ; une session finie (401, ou une requête renvoyée vers la page de connexion, comme le fait Spring) mène à la connexion, et la page rouvre ensuite à l’adresse où on l’avait laissée.
- `ds.confirm` : un champ pour un code reçu par SMS (`inputmode`, `autocomplete`, `maxlength`) : le clavier de chiffres, et le téléphone qui propose le code.
- Nouveau : `ds.h(tag, attrs, kids)` et `ds.ico(name)` pour construire une page sans gabarit de texte, comme le fait Studio ; `ds.compact(n)` pour un chiffre court (« 57,9k », « 1,2M ») ; `ds.avatar(nom, image)`, un logo avec son initiale dessous (`.avatar`).
- Nouveau : les sections repliables qui restent comme on les a laissées (`<details class="fold" data-fold="clé">`, `ds.fold(holder)`), dans une carte aussi (`details.card.fold`).
- Nouveau : les lignes qui s’ouvrent d’un clic (`tr.is-link` ou `[data-row-link]` avec un lien `.row-link` ou un `data-href`), sauf sur leurs boutons, à la fin d’une sélection de texte, et dans un nouvel onglet avec Ctrl ou ⌘ ; sur iPhone aussi.
- Nouveau : l’adresse après # comme état de la page (`ds.route(onRoute)`, `ds.route.go(parts, query)`) et `ds.seek(ancre)`, qui amène à `[data-anchor]`, ouvre les sections autour et l’éclaire un moment (`.is-lit`).
- Nouveau : un formulaire qui supprime demande d’abord, dans la fenêtre de ds (`data-confirm`, `data-confirm-ok`) ; tout formulaire envoyé montre son bouton occupé (`.btn.is-busy`) ; les messages qu’un serveur laisse après une redirection (`<template data-toast>`) passent dans la bulle à l’arrivée.
- Nouveau : `.visually-hidden`, et la grille de cartes qui s’adapte à la largeur (`.grid-cards`, `--grid-min`).
- Nouveau : la visionneuse prend vie, `ds.viewer(items, {start, onChange, onClose, label})` : la croix, le voile, Échap ou le doigt tiré vers le bas la ferment ; les flèches, ← → et le doigt tournent les photos ; « 3 / 24 » ; les deux voisines chargées d’avance ; la roue sur la photo tant qu’elle charge ; le curseur y entre et revient à ce qui l’a ouverte ; la page derrière ne défile plus. Une photo peut être donnée par une fonction, appelée quand on en a besoin (les liens signés de Selecta).
- Nouveau : `ds.viewer.bind(grille, {item})` et, sans une ligne de code, `<div data-viewer>` : une grille de liens ouvre ses photos dans la visionneuse, même sous `script-src 'self'` (le site).
- Nouveau : la grille de photos en colonnes de même hauteur (`.photogrid`, `ds.photogrid(grille, {sizes, size, key, slider})`), venue de Selecta, et son zoom (`.photogrid-zoom`, `.zoom-slider`) : il n’offre que les tailles qui changent la grille, l’appareil s’en souvient, les photos glissent à leur place.
- Nouveau : le bandeau photo (`.hero`, `.hero-img`, `.hero-t`, `.hero-sub`, `.hero-meta`, `.hero-acts`), venu des événements du site et de la couverture de Selecta : `.is-full`, `.is-short`, `.is-bottom`, `.is-parallax`.
- Nouveau : le lien retour (`.back-link`) ; sur une photo, le bouton du site (`.on-photo`).
- Nouveau : le choix de date et de période, venu des opérations de Bank (`ds.datePick`, `.datepick`) : des périodes rapides (« Ce mois-ci », « Le mois dernier », « Cette année »…), puis un jour, un mois, une année ou deux dates en onglets ; les jours depuis le lundi, aujourd’hui cerclé d’or, rien au-delà de `min` et `max` ; deux dates en deux touches ; ‹ › font défiler les mois ou les années, et `step(±1)` avance la période de sa propre longueur ; tout au clavier aussi ; les jours sont ceux de Paris. Le choix du mois du calendrier passe par lui.
- Nouveau : le donut des dépenses (`ds.chart.donut`), une part par ligne aux couleurs de la palette, le total au centre, la légende à côté ; une part choisie sort, et le centre dit son montant.
- Nouveau : les barres en paires (`ds.chart.bars(…, {pairs})`), les entrées et sorties côte à côte chaque mois, avec la légende qui additionne chaque série. Les barres simples ne changent pas.
- `node checks/behaviours.js` (33 vérifications), `node checks/photo.js` (43) et `node checks/date.js` (23) les vérifient dans un vrai navigateur.

## 2.18.0 · 9 novembre 2026

Ce que Bank et Studio avaient chacun et qu’une autre appli peut reprendre ; ce qui est leur métier (les voyages et les règles de Bank, la fiche d’une personne et les chiffres des posts de Studio) reste chez eux.

- Nouveau : la fiche (`.sheet`, `.sheet-panel`, `.sheet-x`, `.sheet-sub`, `.sheet-t`, `.sheet-fig`, `.sheet-acts`), venue de Bank : un panneau à droite sur ordinateur, qui monte du bas sur téléphone. `ds.sheet(el, {onOpen, onClose})` l’ouvre et la ferme : le curseur y entre et y reste, revient à ce qui l’a ouverte ; Échap, le voile ou la croix la ferment, une fenêtre de `ds.confirm` posée dessus d’abord ; sur téléphone la page derrière ne défile plus. Et les lignes clé et valeur (`<dl class="kv">`).
- Nouveau : le tableau (`table.tbl`, `.tbl-wrap`), venu de Bank pour ses opérations et prêt pour les personnes de Studio : les titres de colonne trient (`ds.sortable(table, {by, up, key, menu, onSort})`), la colonne en service montre son sens ; sur téléphone (`.is-cards`) chaque ligne devient une petite carte, et un menu (`.tbl-sortmenu`) remplace les titres.
- Nouveau : le choix de plusieurs lignes et sa barre (`.sel-box`, `.sel-all`, `.selbar`), `ds.selection(holder, {bar, count, onChange})` : Maj-clic pour une suite de lignes, le choix gardé quand la liste se redessine.
- Nouveau : la pilule (`.pill`, `.pv`, `.pills`) : un menu court qui dit son choix, le vrai menu posé dessus pour que le téléphone ouvre le sien ; `ds.pills`.
- Nouveau : le sélecteur avec recherche (`ds.picker(holder, {items, value, first, onPick, opener})`) : sans accents, au clavier, par groupes (une catégorie, puis ses sous-catégories) ; et le bouton pointillé qui ajoute (`.add-btn`).
- Nouveau : déplacer à la poignée (`.grip`, `ds.reorder(list, {item, handle, onEnd})`), à la souris, au doigt ou au clavier ; il remplacera Sortable.js dans les réglages de Bank.
- Nouveau : la carte au filet de sa couleur (`.card.is-ruled.is-tinted`, `--n`) et une barre par catégorie (`.meter`).
- Nouveau : le calendrier, venu de l’agenda de Studio (`ds.calendar`) : le mois en cases, chaque élément une ligne à sa marque de couleur (carré plein ou vide, point, barre fine ou épaisse), « +N » au-delà de huit, aujourd’hui en or et le jour choisi ouvert dessous ; la semaine en sept colonnes ; la liste des jours, la semaine d’avant dépliable ; le titre ouvre le choix du mois. Sur téléphone, une case ne garde que trois points de couleur, puis « +N ».
- Nouveau : les graphiques de Studio (`ds.chart`) : la courbe et son échelle (`line`), les barres sur une échelle ronde avec la moyenne et le mois en cours hachuré (`bars`), l’année de publications en cases (`heat`), les petites barres des stories (`spark`), la barre partagée et sa légende (`split`). La couleur d’une série vient d’un jeton de la palette.
- Nouveau : les classements (`.ranks`, `ds.rank`), la place, les trois premiers en or, une barre de part en option ; les mini-tuiles des chiffres de référence (`.minitiles`, `ds.minitiles`) ; le verdict d’un chiffre (`.verdict`, `ds.verdict`), avec « fort », « moyen » ou « faible ».
- Nouveau : le choix de période (`ds.periodPick`) : des boutons sur ordinateur, une liste sur téléphone.
- Nouveau : le témoin « nouvelle version » sur le bouton de rechargement (`.newver`, `ds.version`), le direct du serveur avec sa reconnexion (`ds.stream`), et la copie sur l’appareil qui ouvre la page tout de suite (`ds.keep`), sans rien casser là où l’appareil ne garde rien.
- La page vitrine tient dans un téléphone : la démo du panneau de filtres, forcée côte à côte, élargissait toute la colonne ; elle s’empile sur téléphone. Les cartes de la colonne Atelier n’ont plus d’espace vide en bas.
- `node checks/bank.js` (38 vérifications) et `node checks/studio.js` (31) vérifient ces composants dans un vrai navigateur.

## 2.17.0 · 9 novembre 2026

Ce que Bank et Studio écrivaient encore chacun de leur côté, autour de l’en-tête :

- La barre des vues sur téléphone : `<div class="tabs is-bar">`, dans l’en-tête sur ordinateur, en bas de l’écran sur téléphone, à portée du pouce, l’icône au-dessus du nom ; le point d’or `<i class="tabn">` sur le coin de l’icône quand quelque chose attend dans une vue. Bank (`#views`) et Studio (`#tabs`) avaient les mêmes règles sous deux noms.
- `ds.busy` : la roue de chargement de l’en-tête. `start(text, {key})` l’affiche à 0 % ; le pourcentage monte seul, au rythme qu’a pris la dernière fois ce chargement (`key`), sans jamais reculer ; `pct(p)` le pousse quand une étape est finie ; `done()` montre 100 % puis la coche verte qui s’efface. Le pourcentage du premier chargement, au milieu de la page, suit le même. La classe de l’en-tête est `loading` partout (Studio disait `loading-on`).
- `ds.trouble(key, {name, text, retry, check})` : une source qui n’a pas pu être lue le dit une fois par visite, dans la bulle d’erreur, avec « Réessayer » ; la même bulle dit ensuite « nouvel essai… », puis « à jour » ou « toujours impossible ». `ds.trouble.ok(key)` quand elle remarche : sa prochaine panne sera redite.
- `ds.drawer(…).mark(on)` : le point d’or sur l’onglet du tiroir quand un filtre cache quelque chose.
- `.boot` : la place du premier chargement, au milieu de la page, que les deux applis écrivaient pareil.
- Les outils gardent la place de la barre de défilement (`scrollbar-gutter: stable`), pour que la page ne bouge pas de côté quand une liste s’allonge ; les sites publics (Vitrine), qui ne l’ont pas, non.
- La page vitrine montre l’en-tête avec sa roue et ses vues, et deux boutons pour essayer la roue et une source en panne. `checks/behaviours.js` vérifie ces quatre comportements (24 vérifications).

## 2.16.0 · 9 novembre 2026

Ce que Bank et Studio écrivaient chacun de leur côté, dans `ds.js` :

- `ds.drawer(name, {onChange})` : le tiroir de filtres. L’onglet du bord, le voile et la croix l’ouvrent et le ferment, l’appareil se souvient s’il était ouvert ; nouveau : sur téléphone, Échap le ferme, le curseur y entre quand il s’ouvre et revient à l’onglet quand il se ferme, et l’onglet dit s’il ouvre ou ferme (`aria-expanded`). Le balisage porte `data-drawer`, `data-drawer-toggle` et `data-drawer-close` ; une page qui se redessine (Studio) lit `.open` dans `onChange`.
- `ds.status(holder, {summary, late, rows, link})` : la liste des sources en bas de page, le même balisage partout ; chaque appli ne donne que ses lignes. Ouverte, elle le reste d’une visite à l’autre.
- `ds.when(t)`, `ds.ago(t)`, `ds.soon(t)` : « aujourd’hui à 6h00 », « hier à 21h04 », « le 1er nov. à 9h00 », « il y a 3 min », « dans 12 min », à l’heure de Paris quel que soit l’appareil, en français ou en anglais selon la page. `ds.date(t, style)` écrit une date : « 9 novembre 2026 », « dimanche 1er novembre », « novembre 2026 », « 09/11/26 », « 9 nov. ».
- `ds.number(n, décimales)` et `ds.money(n, {currency, signed, decimals})` : « 1 061 499,82 », « −1 234,50€ », « +12€ », avec une espace que les polices dessinent (le français en met une fine qu’Archivo et IBM Plex Mono ne dessinent pas).
- `ds.api(method, url, body)` : l’appel au serveur de l’appli, avec l’en-tête que nomme sa balise `<html data-api="X-Bank">` ; une session finie renvoie vers `/login`, une erreur dit les mots du serveur (ceux de Bank comme ceux de Studio).
- `ds.jobs(holder, jobs, {logsLink, reload})` : la section Synchros des réglages. Une tâche par bloc (son état, son dernier et son prochain passage, ce qu’elle a trouvé, ses interrupteurs), « Lancer maintenant », et le journal en direct, relu toutes les 2 s, qui suit la fin tant qu’on ne remonte pas.
- `checks/behaviours.js` les vérifie dans un vrai navigateur : `node checks/behaviours.js`.

Et la palette vive de 2.10.4 remplace celle, plus douce, de 2.14.0 : les couleurs d’avant le design system, accordées.

## 2.15.0 · 9 novembre 2026

- Nouveau : les polices des deux thèmes viennent avec le design system (`dist/fonts`, `src/fonts.css`, faits par `scripts/fonts.py` depuis Google Fonts) : plus aucune page ne demande rien à Google. Ce sont les mêmes fichiers qu’avant, en alphabets latin et latin étendu ; Archivo, IBM Plex Sans et Urbanist sont des polices variables, un fichier pour toutes leurs graisses. Une appli copie `dist/fonts` dans `static/ds/fonts`, à côté de sa copie (`scripts/sync.sh` le fait), et retire ses liens vers Google Fonts.
- Nouveau : une seule planche d’icônes pour toutes les applis (`src/icons.js`), que `ds.js` met en haut de la page : 212 icônes. Les 39 de Bank et de Studio, dont les 10 qu’elles avaient en double, à l’identique (« retry » prend le dessin de « reload ») ; 156 de Lucide (licence ISC, quelques-unes de Feather, MIT), au même trait, pour l’interface, les états, les personnes, la photo et la galerie, l’agenda et les ateliers, l’argent, les catégories de dépenses et les réglages ; 17 logos de Simple Icons (CC0) : Patreon, YouTube, Facebook, TikTok, Threads, WhatsApp, Pinterest, Vimeo, Behance, Flickr, PayPal, Notion, Google, Gmail, Spotify, Mastodon, Telegram. Une page garde `<use href="#i-nom">` et peut retirer sa propre copie ; la page vitrine les montre toutes, par groupe.

## 2.14.0 · 9 novembre 2026

- Atelier : quatre teintes de plus dans la palette, à la même force que l’or : `--c-rouge`, `--c-vert`, `--c-jaune`, `--c-vert-eau`. Elles rendent aux catégories et aux voyages de Bank la famille de couleur qu’ils avaient avant la palette ; une banque n’en prend jamais une rouge, verte ou jaune, couleurs des entrées, des sorties et des alertes.

## 2.13.0 · 9 novembre 2026

Les largeurs du site partout, un message sous les champs, l’avant / après, et les couleurs à la force de l’or.

- Les largeurs d’écran deviennent celles du site, trois au lieu de quatre : 480, 768 et 1024px (au lieu de 420, 640, 980 et 1280). Dans les composants, 640 devient 768 et 420 devient 480. Une appli les reprend avec son avant/après.
- Nouveau : la ligne sous un champ (`.field-note`), la même pour le site et Selecta : or foncé pour un succès, rouge pour un refus (le champ prend alors un bord rouge), et sa place gardée même vide (`is-reserved`).
- Nouveau : `scripts/compare.js`, l’avant / après d’une appli, page par page, sur ordinateur et sur téléphone, avec ce qui a changé en rouge ; il peut montrer une appli avec une version candidate du design system.
- Atelier : les huit couleurs de la palette prennent la clarté et la vivacité de l’or (elles étaient un tiers plus vives, et quatre un peu plus sombres) ; le vert des entrées et le rouge des sorties prennent la clarté de l’or en restant un peu plus vifs que la palette ; le jaune des alertes ne change pas, pour qu’on le distingue toujours de l’or.

## 2.12.0 · 9 novembre 2026

Le thème Vitrine pris sur alexispaoleschi.com, et les pièces que le site et Selecta partagent.

- Les composants ne décident plus eux-mêmes de leur caractère : ils lisent des rôles que chaque thème remplit, pour les titres (`--title-*`, `--head-*`), les étiquettes en capitales (`--label-*`), le texte courant (`--text-*`), les boutons (`--btn-*`), les champs (`--field-*`), les cartes (`--card-*`) et le contour du clavier (`--focus`). Atelier y garde ses valeurs : rien ne change à l’écran.
- Vitrine prend les valeurs d’alexispaoleschi.com : page crème, cartes et champs blancs, traits or à 20%, deux gris (85% et 60%), titres en Gilda Display jamais grasse, en capitales espacées, interligne 1,8 ; texte de 16px léger à interligne 2 ; boutons de 14px en capitales espacées de 2,5px, 63px de haut, qui se remplissent d’or et montent au survol ; champs de 16px (le moins qui évite le zoom de l’iPhone) avec un halo or ; paragraphes à 85% et liens or soulignés ; un message pris sur les notes du site (texte de 16px léger, icône or de 24px) ; une bulle plus aérée ; une fenêtre dont la question est en Gilda de 24px ; ombres douces ; mouvements de 0,3 et 0,4s. Un succès s’écrit en or foncé. Le contour du clavier reste celui du navigateur.
- Nouveau : la barre du haut (`.topbar`), prise sur le site, et une deuxième largeur de page, 1200px pour un site (`--page-site`), à côté des 1500px d’un outil.
- Nouveau : la visionneuse de photos (`.viewer`), prise sur le site, avec la place sous la photo pour la barre de Selecta.
- Nouveau : les voiles et les ombres de texte sur photo (`--overlay-*`, `--text-shadow-*`), une seule roue de chargement (`.spinner`, `is-medium`, `is-large`, `on-photo`), la page document complète (titres, listes, impression), et les mots de `ds.js` en anglais pour une page en anglais.
- Nouveau : la pastille (`.badge`, `is-bad`, `is-soft`), le petit bouton (`.btn.is-small`), la carte au filet or (`.card.is-ruled`), son titre (`.card-title`) et ses lignes de détails (`.card-meta`), la carte avec photo de couverture (`.card.has-cover`, `.card-cover`, `.card-body`), en grand ou en petit (`.card.is-small`) et la carte qui se clique (`.card.is-link`), l’en-tête de section (`.section-head`, son sous-titre `.section-sub`) et le pied de page d’un site (`.site-footer`), dans `src/site.css`.

## 2.11.0 · 9 novembre 2026

Le thème Vitrine retrouve l’or et les angles d’alexispaoleschi.com.

- Vitrine : l’or est celui du site, `#c9a961`, la référence sur laquelle toutes les couleurs sont accordées ; l’or foncé `#b39654` reste pour ce qui demande plus de poids (`--accent-strong`).
- Vitrine : angles carrés, `--r-s`, `--r-m` et `--r-l` à 0, comme sur le site. Atelier garde 4, 6 et 8px.
- Le contour du focus prend l’arrondi `--r-s` au lieu de 3px : carré dans Vitrine, 4px dans Atelier.

## 2.10.4 · 9 novembre 2026

- Atelier : la palette reprend les couleurs vives qu’avaient les applis avant le design system, à la place des huit couleurs douces. Quatorze jetons : `--c-rouge`, `--c-corail`, `--c-orange`, `--c-ambre`, `--c-jaune`, `--c-vert`, `--c-emeraude`, `--c-turquoise`, `--c-ciel`, `--c-bleu`, `--c-violet`, `--c-mauve`, `--c-rose`, `--c-ardoise`. Les plus sombres d’avant sont éclaircies pour se lire sur le fond nuit (MAIF, Boursorama, Instagram, Katline) ; celles qui se confondaient dans un même graphique sont écartées (Déplacements et Administratif, Shopping, Abonnements et « À classer », Courses et Soins). L’or, le vert des entrées, le rouge des sorties et le jaune des alertes ne changent pas.

## 2.10.3 · 9 novembre 2026

- Correction : sur téléphone, la liste des sources en bas de page prend toute la largeur, même quand ses lignes sont courtes (Studio).
- Correction : sur téléphone, ce qui n’a pas marché pour une source passe sous toute sa ligne, aligné sur son nom, au lieu d’élargir la colonne de droite et de couper le nom en deux.
- Correction : une source en retard dans cette liste garde l’allure d’une ligne, en or, au lieu de prendre celle de la pastille rouge `.late`, qui porte le même nom de classe.

## 2.10.2 · 9 novembre 2026

- Correction : sur téléphone, le tiroir de filtres et son voile passent au-dessus de la barre d’onglets du bas, qui cachait ses dernières lignes et prenait le doigt à leur place. Nouvelle couche `--z-drawer`, entre la barre et les fenêtres.
- Correction : sur téléphone, tant que le tiroir de filtres est ouvert, le doigt fait défiler les filtres et la page derrière ne bouge plus ; une fois le tiroir fermé, la page défile de nouveau.

## 2.10.1 · 8 novembre 2026

- Correction : sur téléphone, la bulle (`ds.toast`) prend la largeur de la barre d’onglets du bas, centrée comme elle, au lieu de toute la largeur de l’écran. Les deux lisent le nouveau jeton `--tabbar-w` ; Bank l’utilise pour sa barre.
- `scripts/sync.sh` copie aussi `ds.js`.

## 2.10.0 · 8 novembre 2026

Plus de boîtes du navigateur.

- Nouveau : la fenêtre de confirmation (`dialog.css`, `ds.confirm`) : une question, « Annuler » et la réponse, rouge pour une suppression (le curseur part alors sur « Annuler »), ou un champ pour un court texte. Échap ou un clic à côté annulent.
- Bank et Studio n’ont plus d’`alert()`, de `confirm()` ni de `prompt()` : les erreurs passent dans la bulle, les questions dans la fenêtre.

## 2.9.2 · 8 novembre 2026

- Sélecteur de période : ses onglets se partagent sa largeur en quatre parts égales, sur une seule ligne, alignées sur les quatre colonnes de mois.

## 2.9.1 · 8 novembre 2026

- Les pages de réglages prennent la même largeur que le reste, `--page-max` (1500px), au lieu de 960px.
- Correction : une règle des réglages pour les très petits écrans était mal écrite et ignorée par les navigateurs.

## 2.9.0 · 8 novembre 2026

Une seule largeur, et le message passager.

- `--page-max: 1500px` et `.wrap` : toutes les applis ont la même largeur de page, celle de Studio (Bank passe de 1100 à 1500px).
- Nouveau : le message passager (`toast.css`) et le premier code commun (`dist/ds.js`) : `ds.toast({type, text, action, duration})`, en bas à droite, trois au plus, la même phrase ne s’empile pas, le compte à rebours attend tant qu’on le survole. Bank y passe ses messages.
- Bank : dans le panneau de filtres, chaque compte tient sur une ligne : la banque seule pour son compte principal, le nom du compte seul pour les autres.

## 2.8.0 · 8 novembre 2026

Un seul jeu d’onglets.

- Les onglets (`.tabs`) servent à tout choix entre quelques vues ou périodes : l’en-tête, la vue du calendrier, les périodes de l’analyse de Studio (avant `.seg`) et les sortes de période du sélecteur de Bank. Un onglet s’allume pour `aria-selected`, `aria-pressed` ou `.on`.

## 2.7.0 · 8 novembre 2026

Des garde-fous, et les dernières pages.

- Le texte pâle (`--faint`) est plus lisible : un contraste d’au moins 4,5 sur les fonds sombres et clairs, au lieu de 3,4.
- Nouveau : les petites pages d’une appli (`doc.css`, sous `body.doc`) : confidentialité, conditions, déconnexion.
- Nouveau : `--fs-display` et `--fs-display-2`, les deux tailles des grandes sommes en haut d’un écran.
- Chaque appli reçoit un test qui refuse toute valeur écrite en dur, et un CLAUDE.md qui rappelle les règles.

## 2.6.1 · 8 novembre 2026

- Panneau de filtres : l’en-tête d’un groupe garde la même hauteur, que « Tout » y soit ou non ; la liste ne bouge plus quand on passe en « seul ».

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
