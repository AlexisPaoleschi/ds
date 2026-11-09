# Changelog

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

## 2.11.0 · 8 novembre 2026

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
