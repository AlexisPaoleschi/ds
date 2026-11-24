# Changelog

## 5.18.0 · 24 novembre 2026

- Sur un téléphone, debout ou couché, le texte courant du site qui se lit depuis la gauche est justifié, sans jamais couper un mot en fin de ligne (`src/sitetext.css`, à la fin du kit du site) : les paragraphes d’une page d’événement, le programme, la FAQ, le paiement, la note sur le transport, la liste de ce qui est compris, les cartes et les témoignages de la liste des événements, la phrase des bandeaux d’inscription, et les pages légales (`body.doc`). La présentation des organisateurs passe de centrée à justifiée. Ce qui est centré le reste (une couverture, la ligne sous un titre, les mots d’un modèle). Rien ne change sur un ordinateur.

## 5.17.2 · 24 novembre 2026

- Sur un téléphone, dans l’encadré « Getting there » d’une page d’événement, la carte de l’aéroport ou de la gare (`.location-map-destinations`) prend toute la largeur de l’encadré, comme la note sur le transport en dessous, au lieu de se resserrer au milieu.

## 5.17.1 · 24 novembre 2026

- Les liens du photographe (`.portfolio-links`) passent au-dessus du portfolio, sous son titre, pour qu’on les voie avant les photos plutôt qu’après la grille.

## 5.17.0 · 24 novembre 2026

- Sous le portfolio d’une page d’événement, les liens du photographe (son site, son Patreon) se centrent sous la grille (`.portfolio-links`) : quand deux personnes organisent, leurs liens communs restent à côté d’eux (`.organizer-links`), ceux du photographe vont avec ses photos. La vitrine le montre.

## 5.16.0 · 24 novembre 2026

- Un nouveau rôle de texte, le prix (`--type-price-*`) : en Vitrine, la police des titres à 70px (40px sur un téléphone, debout ou couché), entre le titre de couverture (84px) et le grand titre (56px) ; en Atelier, 56px. Le prix d’une page d’événement (`.price-display .big-fig-value`) le prend au lieu du titre de couverture. Le texte a seize rôles ; `node checks/roles.js` les vérifie, la vitrine les montre.
- La vitrine écrit « Bring a companion » comme le site, en minuscules après la première lettre, comme « Payment terms ».

## 5.15.0 · 24 novembre 2026

- Le prix d’une page d’événement (`.price-display .big-fig-value`) prend le titre de couverture, 84px (48px sur un téléphone) au lieu de 56px : la taille du titre de la couverture, la plus grande du site.
- La date sous le titre d’une couverture d’événement (`.hero.is-full .hero-meta`) prend le sous-titre, en capitales espacées, en blanc sous le lieu doré : le titre, le lieu et la date se lisent comme un seul bloc.
- Le chapô (`--type-lead-*`) est retiré : il ne servait plus qu’à cette date. Le texte a quinze rôles ; `node checks/roles.js` les vérifie, la vitrine les montre.
- La case « Bring a Companion » d’une page d’événement (`.companion-info`) prend celle des conditions de paiement (`.payment-info`) : un trait fin autour d’un titre doré et de mots alignés à gauche, sans fond beige.
- La vitrine montre le titre de couverture avant le grand titre, le plus grand en premier.

## 5.14.1 · 24 novembre 2026

- La couverture d’une galerie de Selecta (`.hero.gallery-cover`) aligne ses mots sur la colonne de la page (`main.page` : `--page-max`, la même marge de chaque côté), comme le lien « Mes galeries » et les cartes en dessous, et donne à son titre toute la largeur de cette colonne : il partait 90px plus à gauche sur un grand écran et passait à la ligne à 720px.

## 5.14.0 · 24 novembre 2026

- La phrase d’un bandeau photo (`.hero.is-band .hero-meta`) prend le sous-titre doré, en capitales espacées comme le lieu d’une couverture, en lignes de même longueur. Il lui faut quelques mots : sur le site, les six bandeaux de Lyon et du Sénégal ont désormais une phrase courte (« Three models · Three styles »), chaque groupe de mots soudé par des espaces insécables.
- Le chapô ne sert plus qu’à la date sous le titre d’une couverture.

## 5.13.0 · 24 novembre 2026

- En Vitrine, le chapô (`--type-lead-*`) prend la police des titres, droite, sans espace entre les lettres, en graisse normale (20px, 16px sur un téléphone) : la phrase d’un bandeau photo (« Three exceptional artists… ») et la date d’une couverture d’événement. La phrase d’un bandeau n’est plus en italique et ses lignes ont la même longueur ; `node checks/roles.js` ne la compte plus parmi les italiques permis.

## 5.12.0 · 24 novembre 2026

- Dans la visionneuse, la position (« 2 / 9 », `.viewer-count`) quitte le bas de la photo pour le coin en bas à droite, sous la flèche suivante, dans la même pastille.
- Une appli qui a sa barre d’outils sous la photo (Selecta) met la position dans ses outils, à côté du cœur : la même pastille, à un autre endroit (`.viewer-tools .viewer-count`). La vitrine le montre.

## 5.11.0 · 24 novembre 2026

- Les modèles d’une page d’événement alternent : un sur deux a son portrait à droite, son nom, sa description, ses liens et ses vignettes à gauche. Sur un téléphone, rien ne change.

## 5.10.0 · 24 novembre 2026

- Le bloc d’un modèle sur la page d’un événement se dessine comme la présentation de l’organisateur : sa première photo en grand portrait à gauche, son nom, sa description et ses liens en haut à droite, alignés à gauche, ses trois autres photos en vignettes en bas à droite. Le bloc est un peu moins haut qu’avant et la description ne s’étire plus sur toute la largeur de la page. Sur un téléphone, il reste empilé, avec une description d’au plus 640px en lignes de même longueur.
- Le nom d’un modèle (`.model-name`) passe en or, comme celui de l’organisateur.

## 5.9.1 · 24 novembre 2026

- Le nom d’un modèle sur la page d’un événement (`.model-name`, « Katline Roddes ») est un titre 1 et non plus un grand titre : 28px en Vitrine, 24px sur un téléphone (56px et 31px avant ; le site d’origine l’écrivait à 42px).

## 5.9.0 · 24 novembre 2026

- Cinq écarts entre les lettres et aucun autre (`--track-0`, `--track-s`, `--track-m`, `--track-l`, `--track-xl` : 0, 0,04, 0,10, 0,15 et 0,18 em) ; chaque rôle en prend un dans chaque thème, et `node checks/roles.js` refuse toute autre valeur.
  - Vitrine : titres, titre de couverture, chiffre et chapô à 0,10 em ; boutons, capitales et petites capitales à 0,15 em (0,18 et 0,15 avant) ; sous-titre et ligne de couverture à 0,18 em (0,17 et 0,19) ; petit texte à 0,04 em (0,07) ; légende et texte sans écart (0,07 et 0).
  - Atelier : les titres sans écart (−0,015 em avant), les capitales et petites capitales à 0,10 em (0,12), le sous-titre et la ligne de couverture à 0,18 em (0,19).

## 5.8.1 · 24 novembre 2026

- Dans un tableau serré (`.tbl.is-dense`, les personnes de Studio), une cellule qui dit quelque chose reprend sa couleur : vert, rouge ou orange (`.is-good`, `.is-bad`, `.is-mid`), or (`.tone.is-gold`, un jour prévu), encre (`.tone.is-ink`). Le gris de ses cellules les couvrait depuis 4.14.0.
- La ligne sous un chiffre (`small.cell-note`, « prévu 28 nov. ») prend dans un tableau serré le même mono que son chiffre.

## 5.8.0 · 24 novembre 2026

- Une phrase grise sous un titre redevient du texte, comme le site l’écrivait (sans capitales ni espacement) : sous « What Photographers Say » (`.testimonials-banner-subtitle`), « Portfolio Highlights » (`.portfolio-subtitle`) et « Explore the Venue » (`.gallery-subtitle`). Le sous-titre reste la ligne dorée en capitales (un lieu).
- En Vitrine, les lettres s’espacent comme sur le site d’origine : 0,1 em pour le grand titre, les titres 1 et 2, le titre de couverture et le chapô (0,08 em et 0 avant), 0,18 em pour un bouton (0,12), 0,15 em pour les capitales et les petites capitales (0,12), 0,17 em pour le sous-titre (0,19), 0,07 em pour le petit texte et la légende (0,04 et 0). Atelier ne change pas.
- Une marge de côté pour tous les blocs d’une page du site (`--site-gutter` : 40px, 24px sur une tablette ou un téléphone couché, 16px sur un téléphone) : le bandeau de la newsletter, les cartes d’événement, les témoignages, les réseaux et les sections d’une page d’événement s’alignent sur les mêmes bords (1120px dans les 1200px de la page ; le bandeau de la newsletter allait à 1200px, les sections d’un événement à 1104px).
- Une page de texte (`body.doc` : des conditions, une autorisation, une politique de confidentialité) a une colonne de 720px (608px avant).

## 5.7.0 · 24 novembre 2026

- L’italique a un sens, jamais un rôle de décor : une citation (`.testimonial-text`), une note (`.row-note`), la phrase d’un bandeau photo (`.hero.is-band .hero-meta`) et le titre d’une œuvre (`.gallery-publication cite`). Les autres textes se redressent : la phrase sous « Getting there » (`.location-subtitle`), le lieu sous la carte (`.location-map-detail`), la remarque d’un jour du programme (`.day-note`), les sous-titres de galerie et de portfolio (`.gallery-subtitle`, `.portfolio-subtitle`, qui étaient en capitales et en italique), la publication d’une série (seul le nom du magazine reste en italique) et la ligne d’une galerie sans client de Selecta (`.pending-gallery-clients--empty`). `node checks/roles.js` le vérifie.
- En Vitrine, un bouton doré qui a fini (désactivé, comme « Subscribed » après une inscription) garde son or, pâli : ses lettres blanches restaient sur du blanc.
- Un téléphone tenu à l’horizontale (jusqu’à 956px de large) garde, dans le kit du site, la taille de téléphone du titre de couverture (48px) et du chapô (16px), comme celles du grand titre et du titre 1 : la couverture d’une page d’événement tient dans sa hauteur, son bouton ne sort plus de l’écran.
- L’icône de Bluesky (`#i-bsky`) est le papillon officiel, pris chez Simple Icons comme ceux de X et de Patreon : celui dessiné à la main était trop plat (18 de large pour 12 de haut, le vrai fait 600 sur 530).

## 5.6.0 · 24 novembre 2026

- Plus aucun multiplicateur : `--photo-scale` (5.4.0, 5.5.0) disparaît, et les tailles qu’il donnait deviennent trois rôles nommés, montrés sur la vitrine et vérifiés comme les autres. Le texte a seize rôles :
  - le titre de couverture (`--type-cover-*`) : le titre d’une couverture plein écran, la page d’un événement (84px en Vitrine, 48px sur un téléphone) ;
  - la ligne de couverture (`--type-cover-line-*`) : son lieu, en capitales espacées (24px) ;
  - le chapô (`--type-lead-*`) : une phrase courte sous un grand titre, la date d’une couverture et la phrase d’un bandeau photo, en italique (20px, 16px sur un téléphone).
- Le titre d’un bandeau photo redevient un grand titre (56px).

## 5.5.0 · 24 novembre 2026

- Sur une couverture aussi haute que l’écran (`.hero.is-full`, la page d’un événement), les mots grandissent comme sur un bandeau : le titre et le lieu ×1,5 (84px et 24px), la date, en texte tel qu’il est écrit, ×1,25 (20px ; 16px sur un téléphone). Le bouton garde la taille des boutons du site.

## 5.4.0 · 24 novembre 2026

- Un mot sur une photo aussi large que l’écran grandit : il garde la police, la graisse, la casse et l’espacement de son rôle, et sa taille est multipliée par `--photo-scale`. Sur un bandeau photo du site (`.hero.is-band`), le titre ×1,15 (64px, comme avant la 5.0.0) et la phrase dessous, en texte italique, ×1,25 (20px ; 16px sur un téléphone). `node checks/roles.js` lit le rôle d’un tel mot à sa taille d’origine. `.hero-meta.is-text` (5.2.0) n’existe plus : toute phrase d’un bandeau est un texte.
- Les points forts d’une page d’événement (`.highlight-text`, `.highlight-list`) s’écrivent en capitales (14px), et tiennent sur une ligne sur un ordinateur.
- La phrase du transport sous « Getting there » (`.location-transport-note`) est un texte (16px), comme le site l’écrivait.

## 5.3.0 · 24 novembre 2026

- Une ligne qui passe sur deux sur un téléphone, à l’endroit choisi (`.phone-break`) : ce qui suit commence une ligne à soi, et le séparateur juste avant (`.sep`, un « · ») disparaît ; plus large, tout reste sur une ligne. Bank s’en sert sous le nom d’un voyage : les dates et le nombre de jours, puis la dépense par jour et le nombre d’opérations.

## 5.2.0 · 24 novembre 2026

Après l’étude du texte de Bank, de Studio et du site, page par page :

- Le mono ne sert plus qu’aux chiffres (montants, dates, nombres) et à ce qui se copie tel quel (le libellé brut d’une banque, une commande à taper dans la recherche, un journal, une erreur technique). Les mots prennent la police de leur rôle : une étiquette (`.tag`, `.late-tag`), la fréquence d’une source (`.status-every`), la note d’une case (`.tile .tile-note`, comme dans une liste de cases), les mots d’un graphique (`.chart-now-l`, `.chart-ref-l`, les mois et les jours du calendrier), l’unité d’un réglage (`.field .unit`), la mémoire du serveur (`.mem`) et le chargement (`header.top .busy`, ses chiffres restent en mono).
- Un nom dans une légende de graphique s’écrit en légende (12px), partout : le camembert (`.chart-donut-l`) comme la barre et les colonnes, au lieu du petit texte demi-gras.
- Une tête de groupe s’écrit pareil dans une liste et dans un tableau : petit texte demi-gras, tel qu’il est écrit (`ul.rows > li.rows-head`, avant en petites capitales), comme les jours du tableau des opérations.
- Le site : la phrase du bandeau d’inscription (`.signup-banner-subtitle`) est un texte, comme sur la page de la newsletter ; la phrase sous « Getting there » (`.location-subtitle`) aussi, toujours en italique ; une ligne de couverture qui est une phrase entière prend `.hero-meta.is-text` ; « Sold out » (`.sold-out-label`) s’écrit en petites capitales, comme l’étiquette de la carte.

## 5.1.0 · 23 novembre 2026

- Un titre coupé sur deux lignes se lit comme un seul titre : en Vitrine, ses lignes sont espacées de 1,3 au lieu de 1,8, et l’écart rendu au-dessus et au-dessous, si bien qu’un titre d’une ligne garde exactement sa place (`.title-1`, `.title-2`, `.title-3`, `.card-title`). Deux jetons le disent, `--title-wrap-lh` et `--title-wrap-pad` ; en Atelier, rien ne change.
- Le kit galerie, après l’étude du texte de Selecta page par page :
  - un nom de fichier s’écrit partout en légende, sans mono : la liste « Ma sélection » (`.selection-panel-name`, 16px avant), les notes photo par photo (`.photo-note-name`) et la visionneuse (`.viewer-name`, 13px avant). Le mono reste à ce qu’on copie : l’identifiant d’une galerie (`.slug-value`, dans un tableau aussi) ;
  - le compte d’une sélection (`.export-count`) passe des petites capitales au petit texte, comme partout ailleurs ;
  - les détails et l’heure d’une ligne de la cloche (`.bell-item-detail`, `.bell-item-time`) passent de la légende au petit texte, comme sur la page des notifications ;
  - le nombre de notes d’un tableau (`.notes-count`) n’est plus en gras : une valeur du tableau comme les autres.
- `.metric-inline` et `.settings-fact` n’existent plus : Selecta montre ces valeurs par la liste de faits (`.facts`), comme ses réglages de sécurité.

## 5.0.1 · 23 novembre 2026

- La petite étiquette rouge (`.late-tag`, « lecture en échec ») ne se coupe plus sur plusieurs lignes ; sur une ligne de carte trop étroite (`.sum-line`), elle passe sous le nom au lieu de le recouvrir, et un chiffre au bout de la ligne reste à droite. Dans Bank, sur un téléphone, « Compte facture » n’est plus caché sous l’étiquette, et « Compte courant » tient sur une ligne.
- Ménage : les règles laissées vides par la 5.0.0 et les commentaires qui donnaient encore une taille de texte d’avant les rôles. `.site-footer.is-spaced` n’existe plus (il ne faisait plus rien).

## 5.0.0 · 23 novembre 2026

Le texte n’a plus que treize rôles. Avant, ds offrait 25 tailles et une quarantaine d’espacements de lettres, et chaque composant choisissait les siens : la vitrine dessinait 129 styles de texte en Vitrine et 60 en Atelier. Désormais, chaque thème donne à treize rôles une police, une taille, une graisse, un espacement et une casse, et rien d’autre n’existe.

- Les rôles (`--type-<rôle>-font`, `-size`, `-weight`, `-ls`, `-case`) : `display` (le grand titre : une couverture, un très grand chiffre ; 36px sur un téléphone), `title-1` (une page, les grandes cartes du site ; un cran de moins sur un téléphone), `title-2` (une section, une fenêtre), `title-3` (un bloc, le titre d’une carte de Bank, d’un pli, d’une petite case), `figure` (le chiffre d’une case, un prix, une année), `subtitle` (la ligne espacée sous un grand titre), `text`, `strong` (un nom, le titre d’une ligne, les mots d’une case à cocher), `small` (la ligne sous un champ, un lieu, une note, une puce), `caption` (un calendrier, un graphique, l’unité d’une case), `caps` (un menu, les détails d’une carte du site), `smallcaps` (l’étiquette d’un champ, l’en-tête d’une section, d’une carte ou d’un tableau, un onglet, un badge) et `button`.
- En Vitrine : Gilda Display pour les titres et les chiffres (56, 28, 24, 20 et 28px, espacés de .08em, les deux premiers en capitales), Urbanist pour le reste (texte 16px léger, texte fort 16px moyen, petit texte 13px moyen, légende 12px, capitales 14px, petites capitales 12px, bouton 14px en capitales). En Atelier : Archivo pour les titres, les chiffres et les petites capitales (50, 28, 22, 17, 28 et 11px), IBM Plex Sans pour le reste (texte 15px, texte fort 15px gras, petit texte 13px, légende 12px, capitales 13px, bouton 13px).
- Ce qui se voit : les couvertures du site prennent une seule taille de grand titre (56px, 36px sur un téléphone) au lieu de quatre, le titre d’une galerie, le nom d’un modèle et le très grand chiffre aussi ; la date et le lieu sous une couverture deviennent un sous-titre ; les tableaux et les valeurs de Selecta passent en texte de 16px léger ; l’étiquette d’un champ en petites capitales de 12px ; le gros bouton du site prend l’espacement de tous les boutons ; le titre d’une ligne de liste prend le texte fort ; les petites capitales passent toutes à 12px en Vitrine et 11px en Atelier (l’en-tête d’une carte de Bank, à 13px, aussi).
- Un mot mis en avant (`b`, `strong`) prend la graisse du texte fort, jamais le gras du navigateur.
- `node checks/roles.js` vérifie que chaque taille, graisse, espacement, casse et police des sources vient d’un rôle, et qu’à l’écran chaque texte de la vitrine, dans les deux thèmes, sur un ordinateur et un téléphone, porte l’un des treize rôles. La vitrine montre les rôles à la place de l’ancienne échelle de tailles.
- Pour les applis : les jetons `--fs-*`, `--ls-*`, `--text-md`, `--text-lg`, `--text-xl`, `--text-2xl`, `--text-size`, `--text-weight` et ceux des composants (`--btn-size`, `--label-weight`, `--title-1-size`, `--field-note-size`…) n’existent plus : une appli prend `var(--type-…)`. `--text-lh` reste (une interligne). `ds.fitTitles` et les classes `.ct-fit-*` disparaissent (un titre de carte a une seule taille), comme `.title-3.is-caps` (un titre suit son rôle).

## 4.27.1 · 23 novembre 2026

- Pour toutes les applis : le texte garde sa taille quand un téléphone se tourne (`text-size-adjust`), et une image, une vidéo ou un canevas ne dépasse jamais sa place. Studio et Selecta l’écrivaient eux-mêmes.
- Une page peut régler la taille et l’interligne de son texte par deux jetons, `--text-size` et `--text-lh`, que le `body` de ds lit (Selecta : 15px puis 16px sur un ordinateur, interligne 1,8).
- La page vitrine reprend toute la largeur : la règle de la page d’une galerie (4.26.0) ne vise plus que `main.page`, la balise de Selecta, et plus le `div.page` de la vitrine.
- La cloche de Selecta : ses lignes ne sont plus soulignées, leur titre devient doré au survol, comme une ligne de liste.
- En Vitrine, tout ce qui appartient à un formulaire est en moyen (500) : l’aide sous une case à cocher (`.check-hint`) est dessinée comme la ligne sous un champ, et les mots de la case passent en moyen ; seul le texte autour reste léger.

## 4.27.0 · 23 novembre 2026

- Un message durable d’erreur (`.msg.is-bad`) s’écrit en rouge, dans tous les thèmes, et plus seulement dans son cadre rosé : ce que Selecta faisait seul devient la règle (Bank, Studio et le site aussi).
- Selecta prend les boutons, les messages et la ligne sous un champ tels que le site les dessine : ses messages en 16px au lieu de 14, la ligne sous un champ en 13px, ses boutons inchangés (déjà de la hauteur d’un champ).

## 4.26.1 · 23 novembre 2026

Les derniers ajustements que les applis faisaient sur les pièces de ds passent dans ds, et une erreur de 4.25.0 est réparée.

- 4.25.0 avait appelé `.row-note` la courte ligne d’une ligne de liste, alors que ds avait déjà ce nom pour la note d’une opération (en or et en italique) : les notes de Bank étaient passées à 12px. Elle s’appelle `.row-line`, et les notes sont revenues comme avant.
- `.tbl td.is-quiet` (une cellule plus discrète), `small.cell-note` et `.is-inline` (la petite ligne d’une cellule, en or), la case d’un tableau en cartes alignée sur la première ligne du texte, `.flag` (un drapeau dans la police du texte), une étiquette droite dans un classement (`.rank-t .tag`), `.row-break` (un retour à la ligne dans une ligne de liste, sur un téléphone).
- `.topbar.is-compact` (une barre plus serrée, son nom en encre : celle de Selecta), `.site-footer.is-spaced` (ses mots un peu espacés), le pied de page tient compte de l’encoche et de la barre d’accueil d’un iPhone, et la couverture d’une galerie a sa taille sur un ordinateur (`.hero.gallery-cover`).
- Bank et Studio n’ajustent plus rien eux-mêmes ; Selecta ne garde que ce que ses consignes lui donnent : la hauteur de ses contrôles et le ton de ses messages.

## 4.26.0 · 23 novembre 2026

Ce que Bank et Selecta dessinaient encore eux-mêmes passe dans ds : les trois applis ne dessinent plus rien à elles (Bank 0, Studio 1, Selecta 0, au lieu de 34 et 26, 19, 135).

- Les réglages de Bank : `.pair` (une règle : ce qu’elle reconnaît, où elle range, sa note dessous ; `.is-off` barrée quand elle est gardée sans servir), `.fold-t` et `.fold-d` (le titre en or d’un groupe qui se plie et sa phrase), `.groups` (des blocs l’un sous l’autre, séparés d’un filet), `.apart` (un bloc à part sous un filet), et dans un tableau `tr.is-cont` (une ligne qui continue celle du dessus).
- Le kit galerie (`src/gallery.css`) : ce qu’une appli qui montre les galeries d’un photographe à ses clients dessine, repris de Selecta tel qu’il le dessinait (rien ne bouge sur ses pages, captures avant et après) : sa page (`.page`) et sa page de connexion (`.auth-page`), les galeries en attente, l’erreur d’une ligne, l’adresse d’une galerie, un chiffre dans une ligne, les boutons d’une couverture, l’icône discrète d’une barre d’outils, les tuiles à choisir et leur cœur (`.like-btn`, son battement), les photos choisies, l’export d’une sélection, la note d’une cliente et les notes sur les photos, les notifications de la cloche, un curseur entre deux icônes, le pied de page et ses liens de contact, la couverture d’une galerie sans photo. Le cœur prend les tailles des pictogrammes de ds (24 et 32px, au lieu de 26 et 32), et les photos choisies passent en colonne à 1024px comme le reste de ds.
- La vitrine montre le kit galerie : une copie de chaque page de Selecta dessinée par `dist/` (`gallery-*.html`, faites par `scripts/gallery-pages.py`, ses photos remplacées par un fond doré) et une carte « Kit galerie » pour les états que ses données de démonstration n’ont pas. `checks/coverage.js` les parcourt.

## 4.25.0 · 23 novembre 2026

La fenêtre, le choix dans une liste et les réglages passent dans les fichiers communs, et ds reprend ce que Bank et Studio dessinaient encore eux-mêmes.

- `ds.sheet`, `ds.picker` et `ds.pills` (avec leurs pilules), `ds.switch`, `ds.conn`, `ds.conns` et `ds.fields` passent de `ds-tools.js` à `ds.js` (`src/settings.js`), et leurs feuilles (`sheet.css`, `pick.css`, `settings.css`) de `ds-tools.css` à `ds.css` : Selecta et le site les ont aussi. `ds.jobs` (les synchros et leur journal) reste dans les outils. Aucune page ne bouge (captures des quatre applis avant et après). `checks/bundles.js` vérifie la nouvelle répartition, et lit désormais la feuille elle-même : une page ne peut pas lire les règles d’une feuille venue d’une autre adresse, et le contrôle d’avant ne vérifiait rien.
- Les tons d’un mot : `.tone.is-gold` (« en attente », un jour prévu, un cadeau), `.tone.is-ink` (un chiffre parmi d’autres plus discrets), `.tone.is-strong` (le même en gras).
- `a.big-fig-link` : un lien à part sous un grand chiffre (« Ce mois-ci : +2 100 € · −1 830 € »).
- `a.sum-note` : une note sous la ligne d’une carte, lien vers son détail (« fin du mois estimée 412 € → »), `.is-bad` quand il faut verser.
- `h4.sect > .sect-note` : une courte note après un titre de section, dans le texte courant (« +1,2 % à 17h »).
- `.figline` : une ligne de petits chiffres en mono (l’heure dorée).
- `a.link > small` : la seconde ligne d’un lien ; `a.icon-link` : un lien discret d’une seule icône (les profils d’une personne).
- `.row-note` : une courte ligne à part dans une ligne de liste, en petit, avec son ton (« Remboursé 120 € »).
- `.parts` : ce dont un total est fait (l’argent d’un voyage, sorte par sorte), `.is-head`, `.is-sub`, `.is-good`, `.is-ruled`.
- Bank et Studio passent dessus : la page de Bank ne dessine plus qu’une déclaration à elle (34 avant), celle de Studio une (19 avant).

## 4.24.0 · 23 novembre 2026

- Un tap sur la vue déjà ouverte dans la barre des vues d’une appli (`.tabs.is-bar`, l’onglet `aria-selected`) remonte en haut de la page, en douceur sauf si le mouvement est réduit, comme dans les applis d’un téléphone. Rien à faire dans les applis : `ds.js` l’écoute pour toute la page, avant que la page ne redessine ses onglets ; un tap sur une autre vue reste à l’appli. `checks/behaviours.js` le vérifie.

## 4.23.0 · 23 novembre 2026

- `ds.verdict(holder, null, {words: true, text, note, title})` : un verdict encore à venir (un post prévu, pas encore sorti). Son mot en or à la place du chiffre (« Prévu »), sa petite ligne dessous (« dans 5j »), son bord en pointillé pour ne pas le prendre pour un verdict moyen, aussi large que les autres pour que la colonne reste alignée (`.verdict.is-soon`). Studio s’en sert pour la ligne d’un post prévu en haut de la liste d’une modèle, au lieu d’une quatrième case qui passait sur deux lignes sur un téléphone. La vitrine en montre un dans sa fenêtre de liste (X), et `checks/studio.js` le vérifie.

## 4.22.2 · 23 novembre 2026

- Sous un titre souligné (`h4.sect.is-ruled`), juste après lui ou en haut de la liste d’une fenêtre dont le haut finit par lui, la première ligne de `ul.rows` garde sa place au-dessus, comme les suivantes sous leur filet : elle touchait presque le trait (les posts d’une modèle dans Studio). `checks/showcase.js` le mesure.

## 4.22.1 · 23 novembre 2026

Un tableau trié garde sa place, et la vitrine montre tout ce que ds dessine.

- `ds.sortable` : un tableau redessiné après un tri (`onSort`) reste là où on l’avait fait défiler de côté, et le titre de sa colonne garde le focus ; avant, il revenait à gauche (le tableau des modèles de Studio sur un téléphone).
- La vitrine montre chaque pièce de ds : la page de réglages (`settings.html`, ses synchros, ses réglages, ses connexions), une copie de chaque sorte de page du site dessinée par `dist/` (`site-home.html`, `site-event.html`, `site-senegal.html`, `site-events.html`, `site-newsletter.html`, `site-doc.html`, faites par `scripts/site-render.js` et `scripts/site-pages.py`, ses photos remplacées par un fond doré), et une carte « Le reste » pour ce qui n’avait pas encore sa place (l’ancien en-tête, le chargement, les lignes, le dépôt compact, la confirmation, le choix dans une liste…). Le calendrier montre un jour trop plein (« +N ») et une ligne qui compte, l’anneau une catégorie qui dit comment elle bouge et s’ouvre.
- `checks/coverage.js` vérifie que la vitrine montre chaque classe et se sert de chaque fonction de ds.
- `header.top .gear`, que plus aucune appli n’emploie, s’en va : un bouton d’icône garde la hauteur des autres sur un téléphone.

## 4.22.0 · 23 novembre 2026

Le kit mail : un client mail ne lit ni feuille de style ni variable CSS, alors ds écrit ses valeurs en clair.

- `ds-mail.json` : les couleurs de ds pour un mail (la page beige, la carte blanche, son filet doré, l’or, l’encre, le texte, le détail, le pied), ses polices (Georgia et Helvetica, à la place de Gilda et Urbanist qu’un client mail n’a pas), sa largeur (560 px), ses tailles, ses interlignes et ses marges.
- `ds-mail.html` : les morceaux d’un mail à recopier, faits de ces valeurs : la page et sa carte au filet doré, le nom, le titre, un paragraphe, un détail, une étiquette sur une liste, le bouton dessiné par une cellule de tableau pour qu’Outlook lui donne sa couleur et sa place, le pied avec les réseaux et le désabonnement. `checks/mail.js` vérifie qu’ils n’écrivent que les valeurs du kit.
- Selecta reçoit le kit avec ses autres fichiers (`ds-mail-X.json`) : ses deux mails en prennent le bouton, et `MailKitTest` vérifie qu’ils n’écrivent que ses couleurs, à sa largeur.
- Les 23 mails de la newsletter du site gardent leur allure pour l’instant : les passer sur le kit les changerait, à revoir un par un.

## 4.21.0 · 23 novembre 2026

Le kit photo : ce qu’une appli qui reçoit et montre des photos dessine autour d’elles (les galeries de Selecta).

- `.dropzone` et `ds.dropzone` : le cadre en pointillé qui prend les fichiers glissés ou ouvre le choix, doré pendant le glisser (`.is-over`), son bouton d’abord et en travers sur un téléphone ; `.is-compact` pour un petit cadre à côté d’une photo.
- `ds.upload` : une ligne par fichier (`li.upload-row`) avec sa jauge et « Réessayer », trois envois à la fois, la jauge du lot et « 3 sur 12 » (`.upload-total`), la ligne qui s’en va une fois le fichier envoyé.
- Sur une tuile de `.photogrid` : ses boutons sur le voile au survol ou au focus, en barre au pied de la photo sur un écran tactile (`.tile-acts`) ; une case claire dans son coin (`button.box.on-photo`) ; l’anneau doré d’une photo choisie (`.is-pickable.is-picked`) ; la roue au milieu pendant le travail (`.is-busy`) ; une légende au pied (`.tile-caption`). Une photo seule dans son cadre (`.photo-frame`, une couverture).
- `ds.selection` passe dans `ds.js` et choisit aussi des tuiles : une case à cocher ou un bouton `box`, Maj pour toute une plage, la classe de ce qui est choisi au choix (`cls`).
- `ds.photogrid({layoutKey, layouts})` retient la disposition (grille ou mosaïque) sur l’appareil et tient son interrupteur à jour.
- `ds.images.renew()` : une image signée qui a expiré redemande son adresse, avec toutes celles du même moment, et la remet en place sans recharger la page ; deux essais au plus.
- `.thumb-x` : la croix qui retire une vignette, dans son coin et de la taille du doigt sur un téléphone ou une tablette, un petit rond à côté sur un ordinateur, avec la croix du sprite.
- La barre de la visionneuse avec ses outils (`.viewer-bar.is-tools`, `.viewer-tools`, `.viewer-name`, `.viewer-hint`).
- Selecta passe ses deux dépôts, ses envois, ses tuiles, ses cases, son anneau, sa couverture, sa croix, la barre de sa visionneuse, sa disposition retenue et ses adresses d’images dessus : sa feuille de style dessine 130 déclarations elle-même au lieu de 240.

## 4.20.0 · 23 novembre 2026

Les gestes que chaque appli écrivait pour elle : annuler, chercher, filtrer, cocher, copier, ouvrir, une fenêtre sous un bouton, arriver et partir.

- `ds.toast({key})` : une bulle par sujet ; la suivante avec la même clé change celle qui est là (l’attente devient sa réponse) au lieu de s’empiler.
- `ds.undo({undo, redo, run, key})` : annuler et rétablir les changements de la page. Ctrl+Z (⌘Z), Ctrl+Maj+Z ou Ctrl+Y, sauf dans un champ ; les deux boutons, grisés quand ils n’ont rien à faire, disent ce qu’ils feraient ; « Annuler » puis « Rétablir » dans la bulle. L’appli ne fait que l’appel au serveur.
- `ds.optimistic(id, {change, save, revert})` : une case cochée à l’instant, enregistrée ensuite, qui revient si le serveur refuse ; une à la fois par élément.
- `ds.copy(texte)` et les boutons `[data-copy]` : copié dans le presse-papiers, « Copié » dans la bulle.
- `ds.openAll(adresses, {ask})` : chaque lien dans son onglet ; au-delà de dix la page demande d’abord, et les onglets que le navigateur bloque sont comptés et dits.
- `ds.pop(bouton, panneau)`, `.pop`, `.pop-panel`, `.pop-head`, `.pop-foot` et `.pop-count` : une fenêtre sous un bouton de la barre du haut, fermée par un clic ailleurs ou Échap (le focus revient au bouton), son chiffre « 99+ » au plus (`ds.pop.count`).
- `ds.enter` et `ds.leave` : un élément qui arrive d’un peu plus haut ou une tuile qui s’efface en rétrécissant, à la durée du thème ; rien ne bouge quand l’appareil demande moins de mouvement.
- `ds.redraw(holder, signature, build)` : redessiner seulement si ce qu’on montre a changé, en gardant le défilement et le focus.
- `ds.highlight` (les mots cherchés allumés, `mark.hit`), `ds.suggest` (« Vouliez-vous dire… », le mot le plus proche) et `ds.text.exact`.
- `ds.query` : le langage de recherche de Bank, pour toute liste (mots, « phrases », -sans, OU, parenthèses, champ:, montants, dates) ; Bank lui donne ses champs, et ses cas de test vérifient toujours qu’il dit la même chose que le serveur.
- `ds.filters` (le panneau de filtres : « Tout », l’œil « Seulement », retenu sur l’appareil, et ses lignes en HTML) et `ds.filterChips` (les filtres en cours en pastilles dorées, « Tout effacer », `.filter-chips`).
- Bank passe son annulation, sa bulle, sa recherche, son surlignage, son « vouliez-vous dire », son panneau de filtres et ses filtres en cours dessus ; Studio ses cases, ses onglets ouverts d’un coup, sa fenêtre des posts et ses filtres ; Selecta sa cloche, sa copie et ses tuiles qui partent : sa feuille de style dessine 240 déclarations elle-même au lieu de 267.
- Page vitrine : « Gestes ».

## 4.19.0 · 23 novembre 2026

Les titres, la tête d’une page, les listes et les champs que chaque appli dessinait pour elle.

- Les titres : `.title-1` (le titre d’une page), `.title-2` (une section), `.title-3` (un bloc), dans la police, la graisse et l’espacement des titres du thème, et `.is-caps` pour l’un d’eux en capitales. La tête d’une page (`.page-head`) : son petit mot doré au-dessus (`.eyebrow`), son titre, ce qu’elle fait à droite sur un ordinateur ; une phrase dessous à la largeur de lecture (`.lede`). Les trois espaces qui grandissent d’un cran sur un ordinateur (`--space-md`, `--space-lg`, `--space-xl`) sont ceux de ds.
- Les champs hors d’une page de réglages : `.field-group` (le libellé, le champ sur toute la largeur, la ligne dessous), `.card.is-form` (un formulaire à la largeur de lecture), `.field-row` (un champ et ses boutons sur une ligne, en colonne sur un téléphone), `.check` et `.check-hint` (une case et ses mots, à hauteur de doigt), `fieldset.checks`, `.field-pair` (« du … au … »), `.pager` (les pages plus récentes et plus anciennes).
- Un bouton qui reste enfoncé (`.btn[aria-pressed="true"]`, un filtre) : plein d’or, par-dessus `is-act`. Un champ qu’on ne peut pas changer est grisé ; une zone de texte ne grandit que vers le bas. Un champ dans la barre de la visionneuse s’écrit clair sur le voile sombre.
- `ds.rows` : des lignes qu’on ouvre d’un clic n’importe où (sauf sur ce qu’elles contiennent d’autre à cliquer), d’Entrée ou d’Espace. `ds.password` : « Afficher » et « Générer » pour un mot de passe. `ds.autosave` : un champ qui s’enregistre quand on le quitte, s’il a changé, sa ligne dessous en rouge si ça n’a pas marché ; il envoie tout de suite ce que le champ contient, même si la page y montre aussitôt autre chose, et jamais deux fois le même texte.
- Les totaux d’une carte (`.sum-head`, `.sum-line`, `.sum-link`, une banque et ses comptes), le total d’une section (`h4.sect > .sect-sum`), une carte en barre (`.card.is-bar`), un pli en tête de section (`details.fold.is-lead`).
- Un tableau groupé par jour : `tr.tbl-group`, sa tête (`.tbl-group-head`) et son total (`.tbl-group-sum`), en cartes aussi. Les lignes : le libellé de la banque (`.row-label`), une note (`.row-note`), une vignette (`.row-thumb`), une liste dans une liste (`ul.rows.is-tree`).
- Bank passe ses cartes de banques, ses jours d’opérations, ses libellés, ses notes et ses dates dessus ; Studio ses lignes de mois (`ds.rows`) et ses réglages (`ds.switch`, `ds.conns`, `ds.fields`) ; Selecta ses titres, ses formulaires, ses cases, ses plis, ses notes (`ds.autosave`) et ses mots de passe (`ds.password`) : sa feuille de style dessine 267 déclarations elle-même au lieu de 370.
- Page vitrine : « Titres, listes et champs ».

## 4.18.0 · 23 novembre 2026

Les constructeurs : ce que ds dessine mais que chaque appli écrivait à la main, balisage compris.

- `ds.card` : une carte, son icône, son titre, ses outils à droite (un choix de période, des onglets) qui ne la plient jamais, pliée et retenue sous une clé ; une carte pliée cache ses outils.
- `ds.tile`, `ds.tiles` et `ds.tile.html` : une tuile complète, son libellé et sa pastille, son chiffre, sa variation dans son ton, ce qui se dessine dessous, sa note ou son lien.
- `ds.tabs` : des onglets, ceux de la barre d’une appli (une icône, son mot) ou ceux qui défilent de côté et gardent leur place ; les flèches, Début et Fin vont de l’un à l’autre.
- `ds.meter` et `ds.legend` (et leurs `.html`) : une jauge et la légende dessous.
- `.stats` et `.stat` : quelques chiffres en ligne, sans boîte (la sélection de Selecta) ; `.tile-list` : une petite liste dans une tuile (les paliers de Studio).
- `ds.median`, `ds.mean`, `ds.verdict.level` (les seuils du verdict, 1,2 et 0,8), `ds.ico.html`, `ds.busy.expect` et `ds.busy.remember` (le travail qu’a pris le dernier chargement).
- `ds.seek` prend aussi un élément et `{block: "center"}` ; `ds.route.go(…, {push: true})` fait un pas d’historique que la page suit.
- Le retour après la connexion ouvre aussi une autre page de l’appli (les réglages de Studio).
- Les tons d’un tableau : `.is-mid` et `.is-faint` (« jamais ») ; `.tone.is-faint` ; `.pip.is-ringed` sur une photo.
- Page vitrine : « Constructeurs ».

## 4.17.0 · 23 novembre 2026

Les petits outils que chaque appli avait écrits pour elle (l’audit du 23 novembre) : une seule copie, dans `ds.js`.

- `ds.text` : `fold` (accents et majuscules à part), `matches` (tous les mots d’une recherche), `compare` (l’ordre de la langue de la page, « Élodie » avec les E, « 10 » après « 9 »), `slug`. Le sélecteur et le tri des tableaux s’en servent.
- Les mots : `ds.plural`, `ds.count` (« 3 opérations »), `ds.list` (« Léa, Irina et Zoé »), `ds.duration` (« 1 an et 3 mois »), `ds.every` (« toutes les 2h »), `ds.since` (« 2h05 »), et deux styles pour `ds.date` : `"relative"` (« dans 3 jours », « hier ») et `"heading"` (« Vendredi 6 novembre » au-dessus de ses lignes).
- Les jours : `ds.day.addMonths`, `ds.day.monthEnd`, `ds.day.diff`, que le choix de dates utilise aussi.
- La mémoire de l’appareil : `ds.store.get` et `ds.store.set` (en JSON, sans jamais casser dans une fenêtre privée) ; `ds.periodPick` retient son choix avec `key` et le relit avec `ds.periodPick.stored`.
- `ds.poll` relit tant que la page est vue (jamais deux fois en même temps, de nouveau dès qu’on revient) ; `ds.onSeen` quand on revient sur la page.
- `ds.boot` pilote l’écran du premier chargement : ce qu’il lit, son fondu, son échec et son « Réessayer ».
- `ds.ext` : un lien vers un autre site, seulement en https ; `ds.h` laisse tomber une adresse qui lancerait un script.
- Les tons hors des tableaux et des tuiles (`.tone.is-good`, `is-bad`, `is-mid`) et une variation signée dans son ton (`.delta`, `ds.delta`), « ±0 » sans ton.
- `.note` suit la taille de son thème (14 px en Vitrine) ; `.note.is-faint` est plus discrète encore. Les petites phrases grises de Selecta passent dessus.
- Page vitrine : « Petits outils ».

## 4.16.0 · 23 novembre 2026

Les dernières pièces génériques que les applis dessinaient encore elles-mêmes.

- Un tableau peut avoir une ligne de groupes de colonnes au-dessus de ses titres (`.tbl thead tr.is-group`) : plus discrète, un trait continu dessous sur toutes les colonnes sauf la première, les titres un peu plus bas. Le tableau des modèles de Studio l’utilise ; son tri passe entièrement par celui du design system (la flèche garde sa place, son anneau de focus est celui de partout).
- Nouveau `.field-label` : le libellé au-dessus d’un champ, dans les petites capitales du thème (`--field-label-size`, 14 px en Vitrine). La connexion de Selecta l’utilise.
- Les notes d’un client sur une photo et les photos en cours d’envoi de Selecta sont des lignes-cartes du design system (`ul.rows.is-cards`).
- Une ligne-carte qui s’ouvre et dont le titre est un lien s’ouvre d’un clic n’importe où sur la carte (`ul.rows.is-cards > li.is-link`, `.row-title > a`) ; ce qu’elle contient d’autre qu’on clique (un pli, un autre lien) reste au-dessus. La page des notifications de Selecta passe sur ces lignes : un point doré pour ce qui n’est pas lu, le détail et l’heure sous le titre, comme l’activité d’une galerie.
- Page vitrine : la ligne de groupes dans le tableau serré, un libellé de champ, une ligne-carte qui s’ouvre.

## 4.15.0 · 23 novembre 2026

Les pièces génériques qu’une seule appli dessinait passent dans le design system, pour que les outils à venir les reprennent (la règle a changé : une pièce générique y va même si une seule appli s’en sert).

- Nouveau `.big-fig` : un grand chiffre mis en avant, seul sur sa ligne et centré, sa petite étiquette au-dessus (`.big-fig-label`), le chiffre en or (`.big-fig-value`), ce qu’il représente dessous (`.big-fig-note`). En Atelier en Archivo gras (le total de tous les comptes de Bank), en Vitrine en Gilda fin et très grand (le prix d’un workshop sur le site, dont les classes `.price-amount` et `.price-period` disparaissent).
- L’aide d’une recherche : un « i » à côté de la croix (`.search-field.has-help`, `.search-info`, `.search-help`), qui montre au survol ce que la recherche comprend et reste ouvert sur un clic ; `ds.js` l’ouvre, la ferme d’un clic ailleurs ou par Échap. C’était celle de Bank.
- Nouveau `.topbar.is-solid` : la barre du haut sur le fond de la page plutôt que sur une photo, pleine, sans le verre (Selecta).
- Nouveau `.card.is-raised` : une carte parmi d’autres côte à côte, sur le fond plus clair, un peu plus serrée (les banques de Bank).
- Page vitrine : « Pièces génériques ».

## 4.14.0 · 23 novembre 2026

Ce que Bank, Studio et Selecta dessinaient chacun à leur façon est maintenant une seule pièce du design system (le tour des différences du 23 novembre).

- Les lignes de liste : un titre de ligne peut être un lien, gris dans la ligne et doré sous le pointeur (`.row-title > a`) ; les chiffres derrière leur petite icône (likes, réponses, vues) sont une pièce (`.figs`, `.fig`), la même dans une liste, un jour de l’agenda et une fenêtre. Une ligne non lue a son point doré et son titre en gras (`li.is-unread`), une ligne en cours son point qui respire (`li.is-live`) ; une ligne-carte qui s’ouvre s’éclaire sous le pointeur (`ul.rows.is-cards > li.is-link`). Le montant d’une ligne-carte passe en chiffres à chasse fixe, comme celui des autres lignes.
- Les lignes et les paires clé/valeur (`.facts`) passent de `ds-tools.css` à `ds.css` : Selecta les a aussi.
- Nouveau `.go-link` : le lien « vers », jumeau du lien retour, ses mots puis une flèche qui avance (« Tout Patreon Alexis → », « Voir la commande ↗ », « Tout l’historique »).
- Nouveau `a.link` : un lien dans le texte (une personne, un jour, une opération liée), dans la couleur de ses mots, doré sous le pointeur.
- Nouveau `button.box` : la case qu’un clic enregistre (le Planning de Studio), dessinée comme les cases à cocher, dorée une fois cochée (`aria-pressed`).
- Nouveau `.tbl.is-dense` : un tableau serré de chiffres (les modèles de Studio, ses mois), ses cellules en chiffres discrets, sa colonne de noms (`.tbl-name`) dans la police du texte.
- `ds.date(jour, "row")` : la date d’une ligne, « 9 nov. » cette année et « 9 nov. 2025 » sinon, dans toutes les listes de Bank et de Studio.
- Page vitrine : « Lignes, liens et cases », toutes ces pièces ensemble.

## 4.13.0 · 23 novembre 2026

Des pièces que Bank et Studio dessinaient eux-mêmes passent dans le design system, et la ligne au-dessus d’une liste est la même partout.

- Nouveau `h4.sect.is-ruled` : le petit titre de section, juste au-dessus d’une liste, avec un trait dessous et son action à sa droite. Studio l’avait recopié sous un autre nom (« Du plus récent au plus ancien », « Derniers posts ») ; le nouveau voyage de Bank y met ses opérations cochées et leur total, à la place d’une petite phrase. Les autres petits titres de Studio (« Payants par palier ») sont le `h4.sect` du design system, identique.
- En Atelier, une carte a un peu moins de place à l’intérieur sur un téléphone : 14 px au lieu de 16 (`--card-pad`), comme Bank le faisait sur son accueil. Les cartes de Studio et des réglages de Bank y passent aussi.
- Le titre d’une carte qui se plie (`.ct.fold`) garde la hauteur d’un contrôle (`--control-h`), qu’il porte un choix de période ou non : l’écart jusqu’au contenu est le même dans chaque carte, et la plier ne fait rien bouger. Pliée (`.card.is-folded`), elle garde 14 px sous son titre. C’était dans Studio, qui ne change pas.
- Nouveau `.acts` : une rangée d’actions sous un bloc, sur une ligne tant qu’elles tiennent ; sur un petit téléphone (480 px), ses boutons se partagent la rangée, aussi larges les uns que les autres. Les liens d’un voyage de Bank l’utilisent, sans changer.
- Page vitrine : la liste dans sa fenêtre a son titre de liste.

## 4.12.0 · 23 novembre 2026

Toutes les fenêtres ont la même taille, et des onglets qui défilent sur le côté sont les mêmes partout.

- Toute fiche (`.sheet`) fait 720 × 640 px sur un ordinateur (nouveaux jetons `--sheet-w` et `--sheet-h`, qui remplacent `--sheet-list-h`), 86 % de la hauteur de l’écran au plus, et 88 % de sa hauteur sur un téléphone, quoi qu’elle montre : choisir des dates, un onglet ou une liste plus courte ne la fait plus bouger, elle défile à l’intérieur. Avant, une fiche faisait 560 px de large et la hauteur de ce qu’elle montrait. La petite fenêtre qui pose une question (`ds.confirm`) ne change pas.
- Une fiche qui montre une liste (`.sheet.is-list`) garde ses actions (`.sheet-acts`) en bas, toujours en vue, après sa liste qui défile : le nouveau voyage de Bank, son bouton « Enregistrer ».
- Nouveau `.tabs.is-scroll` : des onglets qui restent sur une ligne et défilent sur le côté quand ils ne tiennent pas (un téléphone), un peu plus serrés à partir d’un portable (1280 px). Ce sont ceux que Studio dessinait lui-même en haut de l’analyse.
- `ds.periodPick` prend l’option `tabs` (`.periodpick.is-tabs`) : sur un téléphone, il garde ses onglets, ceux qui défilent, au lieu du menu, et amène le choisi en vue. Sans elle rien ne change : les périodes de Bank gardent leur menu sur un téléphone.
- Page vitrine : la liste dans sa fenêtre a ses quatre réseaux en onglets qui défilent ; `checks/showcase.js` vérifie, sur un téléphone, les onglets à la place du menu, sur une ligne dans la fenêtre, et le dernier choisi en vue.

## 4.11.1 · 22 novembre 2026

Une fenêtre qui montre une liste est moins haute sur un ordinateur.

- `.sheet.is-list` fait 640 px de haut au plus (nouveau jeton `--sheet-list-h`), au lieu de 86 % de l’écran : sur un écran de 900 px, 640 au lieu de 774, la place de six posts sous le haut de la fenêtre dans Studio. Un écran plus petit garde 86 % de sa hauteur au plus ; un téléphone ne change pas (88 %).
- `checks/showcase.js` vérifie les 640 px sur un ordinateur.

## 4.11.0 · 22 novembre 2026

Une fenêtre qui montre une liste garde sa taille : changer d’onglet ne la fait plus grandir ni rétrécir.

- Nouveau `.sheet.is-list` : une fiche (`ds.sheet`) qui montre une liste, comme les posts d’une personne réseau par réseau dans Studio. Sur un ordinateur, elle fait 720 px de large (`--read-l`) au lieu de 560, et toute sa hauteur (86 % de l’écran) dès qu’elle s’ouvre ; sur un téléphone, toute la largeur et 88 % de la hauteur. Son haut (`.sheet-head` : la ligne, le titre, les onglets, les chiffres) reste en place, seule sa liste (`.sheet-list`) défile dessous, jusqu’aux bords de la fenêtre ; la croix reste dans son coin.
- La fiche d’une opération de Bank, un formulaire, ne change pas : 560 px, et la hauteur de ce qu’elle montre.
- `ds.sheet` dit ce qu’il rend aussi : `el` (le voile) et `panel` (sa `.sheet-panel`).
- Page vitrine : « Une liste dans sa fenêtre », 24 posts, 3 ou 1 selon le réseau ; `checks/showcase.js` vérifie, sur un ordinateur et un téléphone, que la hauteur ne bouge pas et que le haut reste quand la liste défile.

## 4.10.0 · 22 novembre 2026

Les pictogrammes du site en trois tailles, comme les icônes en quatre : 24, 32 et 48 px.

- Nouveaux jetons `--picto-s` (24 px), `--picto-m` (32 px) et `--picto-l` (48 px), pour ce qui est plus grand qu’une icône.
- 48 px : un point fort et le contact d’un événement, l’épingle d’un lieu (40 avant), l’icône du bandeau d’inscription (40 avant ; 32 px sous 1024 px, comme avant).
- 32 px : la destination d’un lieu ; les réseaux de l’accueil (34 avant, 30 sur tablette).
- 24 px : le transport et ce qu’un voyage comprend ; les réseaux de l’accueil sur un téléphone (28 avant) et couché (24).
- Seul le téléphone couché (80 px, l’avertissement du mode paysage) reste une illustration à part ; `checks/bundles.js` le nomme et refuse tout autre pictogramme en pixels.

## 4.9.1 · 22 novembre 2026

Les icônes du kit du site que 4.9.0 n’avait pas vues (leur taille était écrite sur une classe à elles, pas sur `.ico`), et les dernières icônes à 1 px de leurs mots.

- Sur l’échelle : la flèche « défiler » de l’accueil (20 et 16 px, déjà sur l’échelle, maintenant par ses jetons), l’icône d’un grand bouton de l’accueil (20 px, 18 → 16 px sur tablette), celle d’un bandeau des réseaux et celle du lien d’un organisateur ou d’un modèle (18 → 16 px), celle d’un point fort d’une carte d’événement (14 px).
- Les grands pictogrammes du site (24 à 80 px : un point fort, un lieu, un contact, les réseaux de l’accueil, le téléphone couché) restent à leur taille en attendant une décision ; le contrôle les nomme un par un.
- `checks/bundles.js` voit aussi une icône nommée par sa classe (`-icon`, `-arrow`), plus seulement `.ico` et `svg`.
- En Vitrine, l’icône d’une méta de carte (`.card-meta svg`) monte de 0,06em, sur le milieu de ses capitales (elle était 0,6 à 1 px trop bas, sur un téléphone surtout).
- La coche du bandeau, une fois les sources lues (`.busy-ok`), monte de 0,1em, sur le milieu des capitales du nom de l’appli (1,1 px trop bas).
- En Atelier, l’icône d’un message durable (`.msg .ico`) est au milieu de sa première ligne (`--msg-icon-top` la calcule), plus 2 px sous son haut : elle était 0,6 à 0,9 px trop haut.
- Page vitrine : les flèches des périodes et les marques des messages sont celles de la planche, plus des caractères tapés ; la grille des icônes les montre à 20 px.

## 4.9.0 · 22 novembre 2026

Les icônes en quatre tailles, et aucune autre, dans ds comme dans les applis : 12, 14, 16 et 20 px. Jusqu’ici, ds n’en nommait que deux (12 et 16) et ses composants en écrivaient neuf autres en pixels (de 11 à 20).

- Nouveau jeton `--ico-l` (20 px) : les onglets de la barre, les icônes de la barre du haut, les infos d’un événement. Avec `--ico-s` (12 px), `--ico-sm` (14 px, depuis 4.8.0) et `--ico-m` (16 px).
- Chaque icône de ds passe sur la taille la plus proche : la coche du bandeau de 11 à 12, l’action d’un message, l’état des sources et le bouton « plus » des filtres de 13 à 14, le bouton « seulement » des filtres de 15 à 16, la poignée pour déplacer et l’icône d’une méta de carte de 18 à 16, les onglets de la barre de 19 à 20, les icônes de la barre du haut de 18 à 20.
- L’icône d’un message durable (`--msg-icon`) prend la même échelle : 14 px en Atelier, 20 px en Vitrine (24 avant).
- `checks/bundles.js` le vérifie : quatre tailles et pas une de plus, aucune icône en pixels.

## 4.8.0 · 22 novembre 2026

Ce que deux applis dessinaient chacune de leur côté, ou ce qui manquait à une pièce déjà là.

- Ce qu’on enregistre ou qu’on travaille (`.is-busy`) passe en retrait avec un nouveau jeton, `--o-busy` (0,5) : la ligne d’un tableau (`.tbl tr.is-busy`) ou d’une liste (`ul.rows > li.is-busy`) en entier, la photo d’une tuile ou d’une couverture (`.is-busy > img`). Bank l’utilise pour la ligne qu’il enregistre, Selecta pour la photo qu’il envoie.
- Le lien d’une ligne (`a.row-link`) garde le texte de sa ligne partout, plus seulement dans une tuile : dans un tableau, dans une liste.
- Nouveau `.tbl-wrap.is-card` : un tableau dans une carte à lui (les listes de Selecta), avec le cadre et l’ombre d’une carte, ses titres sur le bandeau (`--band`), des cases plus aérées et sans trait sous la dernière ligne. Sur un téléphone, ses lignes deviennent des cartes posées sur la page, sans le cadre.
- La ligne d’un tableau sous le pointeur prend `--row-lit` : la touche d’encre d’avant en Atelier, le bandeau en Vitrine. En Vitrine, le nom d’une ligne (`.tbl-main`) garde le poids de son texte.
- Un titre qui trie garde la place de sa flèche, même quand ce n’est pas lui qui trie : les colonnes ne bougent plus quand on change de tri. Au-dessus de chiffres (`th.is-num`), la flèche passe devant le titre, qui reste aligné sur eux.
- Nouveau `ul.rows.is-sub` : des lignes sous une ligne (les cours d’une personne dans Studio), séparées par un trait pointillé, plus serrées, leur titre plus petit et plus discret.
- Une ligne vide dans une liste (`li.empty-note`) a la hauteur des lignes.
- Nouveau `.folds` : des sections pliantes (`details.fold`) l’une sous l’autre, un trait entre elles et de la place autour de chaque titre (les règles de Bank, par qui les a faites).
- Réglages : la ligne d’une connexion en échec (`.conn .det.is-bad`) est en rouge, comme le résumé d’une synchro.
- Nouveau jeton d’icône `--ico-sm` (14 px), entre `--ico-s` (12 px) et `--ico-m` (16 px) : à côté d’une ligne de petit texte.

## 4.7.0 · 22 novembre 2026

Un seul style pour toute liste qui s’ouvre : le cadre et le fond d’un champ, le chevron fin du sprite à droite.

- Un menu (`select`) perd la flèche que chaque navigateur dessine à sa façon : il prend le chevron du sprite (`--chev-faint`, dans le gris discret de chaque thème).
- La pastille (`.pill`) prend le cadre et le fond d’un champ, son texte en encre, et le même chevron à la place du « ▾ » écrit ; allumée (`.is-on`), son chevron est doré.
- Nouveau `.combo` : une liste dont on cherche les choix (`ds.picker` dessous, ouvert par lui), qui dit son choix, du même style. `.is-empty` quand rien n’est choisi (le « À classer » de Bank, en tirets dorés), `.is-compact` dans les lignes d’une liste serrée. Bank y passe sa catégorie et son voyage.
- Le chevron du titre de période passe de 12 à 16 px : à côté d’un titre de 28 px, il se voyait à peine.
- `--chev` : le chevron du sprite en masque, pour qui veut dessiner une liste qui s’ouvre.

## 4.6.0 · 22 novembre 2026

Les icônes au milieu de leurs mots, partout où l’audit du 22 novembre en a trouvé de travers (mesuré dans Chromium, à 375 et 1280 px, avant et après).

- En Vitrine, l’icône d’un bouton est montée sur le milieu de ses capitales (elle était 0,9 px trop bas), et la roue d’un bouton qui travaille monte de 0,06em au lieu de 0,1em (4.5.1 la mettait 0,5 px trop haut).
- En Atelier, l’icône et la pastille d’un titre de carte (`.ct`) sont sur le milieu de ses capitales (0,9 px trop bas), sauf sur un titre rapetissé pour tenir (`ct-fit-2`, `ct-fit-3`).
- Le chevron d’une section pliante ouverte (`details.fold`, `.ct.fold`) est sur le milieu de son titre : son V était 2 à 3 px trop bas.
- Le titre d’une période (`.periodtitle`) prend le chevron du sprite (`<svg class="ico caret"><use href="#i-chevron-down"/></svg>`), petit et au milieu du titre (monté de 0,075em en Vitrine, de 0,06em sur un téléphone en Atelier) ; `ds.calendar` le dessine. Un « ▾ » en texte, qu’aucune police de ds ne dessine, reste possible et se met lui aussi au milieu.
- Tableaux : en Atelier, la flèche de tri est sur le milieu des capitales ; la case de l’en-tête est au milieu des titres (elle était en bas), celle d’une ligne au milieu de la ligne sur un ordinateur (les cartes d’un téléphone l’avaient déjà).
- En Vitrine, le chevron du titre du calendrier (`.dp-title.is-zoom`) est sur le milieu de ses capitales.
- La pastille d’une légende (`.chart-split-legend`, `.chart-bars-legend`) est au milieu des mots, plus sur leur ligne de base.
- Le nom d’une fiche (`.sheet-t`) passe de 22 à 28 px, la taille de son montant : à côté de lui, ses boutons carrés (renommer, voir) paraissaient plus gros que lui.
- `ds.picker` : une recherche qui s’ouvre par son bouton (`opener`) ferme celle qui était ouverte, une seule à la fois (dans la fiche de Bank, la catégorie et le voyage).
- Pages d’événement : l’icône d’une ligne d’infos (`.info-list`) est au milieu de sa première ligne, et le point entre deux capitales (`.highlight-separator`) au milieu d’elles.

## 4.5.1 · 22 novembre 2026

- En Vitrine, la roue d’un bouton qui travaille (`.btn.is-busy`) est centrée sur ses capitales : elle était 1,4 px trop bas, parce que des mots en capitales n’ont rien sous leur ligne de base. Rien ne change en Atelier.

## 4.5.0 · 21 novembre 2026

Une liste vide, pour toutes les applis.

- `.empty-note` passe des outils (`ds-tools.css`) au socle (`ds.css`) : Selecta et le site peuvent s’en servir.
- `.empty-note.is-box`, une case vide encadrée de tirets, quand elle tient la place de tout un bloc (aucune galerie pour l’instant, une carte qui se charge) : Studio et Selecta dessinaient chacun la leur.
- La vitrine montre une liste vide, simple et encadrée.

## 4.4.0 · 21 novembre 2026

D’autres pièces que Bank et Studio dessinaient eux-mêmes.

- `.note`, une courte phrase sous un bloc, plus discrète que le texte : ce qu’un chiffre veut dire, d’où il vient. La vitrine l’employait déjà sans qu’elle soit dessinée.
- Des lignes en petites cartes, `ul.rows.is-cards` (un voyage et ce qu’il contient) : chacune sur le fond plus clair, à part de la suivante, son nom et son chiffre d’un cran plus grands.
- Un titre au-dessus d’un groupe de lignes, dans la liste, `li.rows-head` (une année au-dessus de ses voyages) : en petites capitales, sans le trait des lignes, ce que le groupe fait à sa droite.
- La vitrine montre des lignes en cartes sous leur titre.

## 4.3.0 · 21 novembre 2026

Des pièces que Bank et Studio dessinaient chacune de leur côté, maintenant dans le design system. Rien ne change dans Selecta ni sur le site.

- La page d’une appli (Atelier) laisse elle-même la place de l’encoche et de la barre du bas d’un téléphone, et un saut vers une ancre s’arrête sous l’encoche : Bank et Studio l’écrivaient sur leur racine. Les sites publics (Vitrine) gardent leur barre du haut et leur pied de page.
- Une icône avant le titre d’une carte ou d’une section (`.ct > .ico`, `h4.sect > .ico`) : en or, de la taille de ses capitales.
- Ce qui agit sur la ligne d’un titre (un bouton, les flèches d’un mois, des onglets), `.ct-tools` : à droite, dans les mots d’un contrôle plutôt que dans les capitales du titre.
- Les lignes : la deuxième ligne sous le titre d’une ligne (`.row-title small`), petite et pâle ; une ligne faite (`li.is-done`, une tâche cochée, une facture payée), pâlie comme une ligne faite de l’agenda ; une ligne qui ouvre quelque chose (`li.is-link`, ou un titre `a.row-title`), son titre en or sous le pointeur.
- Une ligne de tableau atteinte avec Tab (`tabindex="0"`) a l’anneau de focus en dedans, le long des lignes du tableau.
- La vitrine montre l’icône d’un titre, le bouton sur la ligne d’un titre, la deuxième ligne, la ligne faite et la ligne qui s’ouvre.

## 4.2.1 · 21 novembre 2026

Des listes qui s'ouvrent plus vite, sur téléphone surtout.

- Une date ou un chiffre écrits par `ds.date`, `ds.money`, `ds.number`, `ds.when`, `ds.day`, les graphiques et les journaux prennent un outil de mise en forme fait une fois pour leur langue et leur style, puis gardé : en faire un coûte bien plus que s'en servir, sur Safari surtout. L'onglet Opérations de Bank en faisait 386 à chaque ouverture, il en fait quelques-uns une fois pour toutes. Les modules s'en servent par `ds._.intl(type, langue, options)`.
- Les cases dont le chiffre rapetisse (`.tiles.is-shrink`) : quand une page redessine les siennes, seules celles-là sont mesurées de nouveau, plus toutes celles de la page ; des cases cachées (une autre vue, une carte pliée) attendent de se montrer. Toutes les largeurs se lisent d'un coup avant de rien changer, et la bonne taille se trouve en quelques essais au lieu d'un essai par pixel. Le résultat est le même qu'avant, au pixel près.
- `checks/behaviours.js` vérifie que 300 dates et montants ne font que quelques outils, et que redessiner des cases laisse les autres telles quelles.

## 4.2.0 · 19 novembre 2026

Un jour loin en arrière, en quelques touches.

- `ds.datePick` : le mois écrit entre les flèches est un bouton. Il recule d'un cran : les douze mois de l'année, puis les années. Une année puis un mois choisis là ramènent aux jours : un jour de 2023 est à quatre touches au lieu de trente-six flèches. Les mois (l'onglet « Mois », le saut de mois du calendrier) reculent de même vers les années. La grille qui remplace l'autre grandit ou rétrécit un court instant (`--t-fast`, rien quand le système demande moins de mouvement).
- Au clavier, Échap revient aux jours avant de fermer le choix.

## 4.1.0 · 18 novembre 2026

Choisir d'un clic toutes les lignes d'un groupe.

- `ds.selection` : la ligne d'en-tête d'un groupe (un jour, dans une liste par jour) peut porter une case `.sel-group`. Elle choisit, ou laisse, toutes les lignes qui la suivent jusqu'à l'en-tête suivant, et se montre à moitié cochée quand une partie seulement l'est.

## 4.0.1 · 18 novembre 2026

Le battement d'une chose en cours, pour toutes les applis.

- `@keyframes pulse` passe des outils (`ds-tools.css`) au socle (`ds.css`), que toutes les applis chargent : le point « en direct » d'une galerie de Selecta, qui ne charge pas les outils, n'avait aucun battement.

## 4.0.0 · 18 novembre 2026

Une seule taille de bouton, partout.

- `.btn.is-small` disparaît, avec ses jetons `--btn-s-h`, `--btn-s-px`, `--btn-s-size` et `--btn-s-ls` : chaque bouton d’un thème a la hauteur d’un champ et une seule taille de texte (Atelier : 34px, 13px en 600 ; Vitrine : 45px, 14px). La barre de sélection, les flèches du calendrier et du choix de dates prennent ces boutons-là. Seuls le grand bouton du site (`.is-large`) et le bouton de sa barre du haut gardent leur taille d’appel.
- Un bouton d’icône (`.is-icon`) est un carré aussi haut que les autres boutons : 34px en Atelier au lieu de 32. La pastille d’un menu (`.pill`) a la hauteur et le texte d’un bouton.
- La croix d’un champ de recherche garde sa petite taille, qui fait partie du champ : `--field-btn-h`.
- Une icône posée avant les mots se rapproche du bord de ce qu’elle a de vide dans son dessin : l’écart paraît le même à gauche et à droite (« × Proxi »).
- La vitrine vérifie que champs, menus et boutons ont une seule hauteur, que boutons et menus ont une seule taille de texte et qu’un bouton d’icône est carré, dans les deux thèmes, sur ordinateur et sur téléphone.

## 3.7.0 · 18 novembre 2026

Des pastilles aux coins de tous les boutons.

- `.btn.is-pill` et les actions de `.selbar` gardent leur fond or léger et leur icône, mais prennent les coins de tous les boutons (`--r-m`) au lieu d’être toutes rondes : rien d’autre n’est rond dans les applis. Le jeton `--r-pill` disparaît.
- `.selbar` sur un téléphone : plus rien n’est coupé net. Quand la place manque vraiment, le mot d’une liste finit par « … ». La vitrine donne à ses cartes, sur téléphone, la largeur qu’elles ont dans une appli : « Renommer » y était coupé depuis 3.6.0, la barre posée dans un cadre de plus que dans Bank.
- La pastille sert aussi aux actions d’un compte dans les Réglages (Renommer, Masquer, Supprimer), à celles de la fiche d’une opération (Retirer, Délier, Lier) et aux filtres posés au-dessus d’une liste, et les liens « Aller à » des Réglages (`.jump`) la prennent avec une icône chacun.

## 3.6.0 · 18 novembre 2026

Une barre de sélection plus lisible, des boutons en pastilles et des sous-lignes qu’on déplie dans les filtres.

- `.selbar` : les actions deviennent des pastilles dorées (le fond or léger de `--accent-soft`, le texte et l’icône en or), toutes du même rang, et gardent leur icône sur un petit téléphone. Après le nombre de lignes choisies, leur total (`.selbar-sum`), que la page donne à `ds.selection` par `sum(keys)` (« −128,40 € ») ; vide, il ne prend pas de place.
- `.btn.is-pill` : le même bouton en pastille, pour une rangée d’actions du même rang hors de la barre (les boutons d’un voyage ouvert : Opérations, Modifier, Supprimer) ; `.is-pill.is-danger` sur le fond rouge léger. Ronds dans l’Atelier (`--r-pill`), carrés dans la Vitrine comme ses autres coins.
- Le panneau des filtres (`.side`) : une ligne qui a des lignes sous elle (une catégorie et ses sous-catégories) prend un chevron après son nom (`.filter-more`, `aria-expanded`), qui montre ou cache le `.fsub` qui la suit, en retrait, en plus petit. Fermé par défaut, pour que le panneau reste court ; `ds.js` l’ouvre et le ferme, la page garde l’état quand elle redessine le panneau.
- La vitrine montre la barre avec son total, les pastilles d’un voyage et une catégorie dépliée.

## 3.5.0 · 18 novembre 2026

Un champ de recherche qui s’efface d’un geste.

- `.search-field` : un champ de recherche et sa croix (`<span class="search-field"><input type="search" placeholder="…"><button type="button" class="search-clear" aria-label="Effacer"><svg class="ico"><use href="#i-close"/></svg></button></span>`). La croix n’apparaît que quand le champ n’est pas vide, sur téléphone aussi, où le navigateur n’en dessinait pas ; elle suit le champ même quand la page le vide elle-même (le champ doit avoir un texte d’exemple). Un appui le vide, prévient la page comme une frappe (un évènement `input`) et lui rend le focus. La croix du navigateur, qui n’apparaissait que sur ordinateur, disparaît.
- `ds.picker` : son champ a la même croix ; un appui rend toute la liste.
- La vitrine montre le champ avec sa croix, sous les autres champs.

## 3.4.0 · 14 novembre 2026

La barre de choix de plusieurs lignes, plus claire sur téléphone.

- `.selbar` : le nombre de lignes choisies et une croix pour tout lâcher (`.selbar-x`, `data-sel-clear`) sur la première ligne, puis les actions dans `.selbar-acts`, toutes du même rang, aucune en or (Bank avait son « Renommer » doré à côté du menu des catégories : on croyait devoir le toucher pour changer la catégorie). Sur téléphone, les actions partagent la deuxième ligne, aussi larges ; sur ordinateur, tout tient sur une ligne. « Annuler » en toutes lettres laisse la place à la croix.
- `.btn.is-select` : un bouton qui ouvre une liste (une catégorie, un voyage), `<label class="btn is-select">` avec ses mots, son icône et le `<select>` natif posé dessus, invisible, qui s’ouvre où l’on touche (la roue d’un iPhone) ; le menu porte le nom lu à voix haute.
- La vitrine montre la nouvelle barre (catégorie, nom, voyage) ; `checks/bank.js` vérifie sa mise en page à 390 et à 1280px, et que chaque menu couvre tout son bouton.

## 3.3.1 · 13 novembre 2026

Un seul survol pour tous les boutons de l’Atelier, et des boutons d’en-tête qui se grisent.

- Au survol et à l’appui (`:active`, sur téléphone aussi pendant qu’on touche), chaque bouton de l’Atelier a son icône ou son texte et son bord en or, comme `.btn` : les boutons carrés de l’en-tête, dont le bord restait gris, le bouton d’un message (`.msg .act`, qui passait au gris), les boutons du choix de période (`.periodpop`), la croix de la fiche, la ligne « plus tôt » de l’agenda et l’onglet du tiroir. La croix et l’action d’une bulle et la croix du tiroir, qui n’ont pas de bord, prennent un bord doré tracé à l’intérieur. `is-act`, `is-save` et `is-danger` gardent leur ton, à l’appui comme au survol. La Vitrine ne change pas.
- Un bouton carré de l’en-tête qui n’a rien à faire (`disabled`, comme l’annulation et le rétablissement de Bank quand il n’y a rien à annuler ou à rétablir) reste à sa place mais se grise nettement (`--o-off`), au lieu d’avoir l’air d’un bouton actif, et ne s’allume pas. La vitrine en montre un dans l’en-tête de démonstration.
- `checks/behaviours.js` vérifie, à la souris et au clavier, l’or du survol et de l’appui sur chacun, et le bouton d’en-tête grisé qui ne bouge pas.

## 3.3.0 · 13 novembre 2026

- Kit du site : le nom d’un lieu trop long pour une ligne de téléphone à côté de son code (« Dakar-Blaise Diagne Airport DSS ») se donne en deux formes dans `.location-dest-name` : `.is-long`, le nom entier, à partir de 481px, et `.is-short` (« Dakar Airport ») sur un téléphone ; le code reste sur la même ligne. `checks/site.js` le vérifie à 390 et à 1280px.

## 3.2.0 · 13 novembre 2026

Les boutons faits d’une seule icône, carrés partout, et une case pour dire à quoi sert un choix.

- Un bouton fait d’une seule icône (`.btn.is-icon`) est carré, toujours : sa hauteur suit sa largeur, en petit (`.is-small`) aussi, où il était plus large que haut (34 × 28 pour le crayon de Bank). Une seule taille en Atelier, `--btn-icon-h` (32px), sur téléphone comme sur ordinateur : l’en-tête passait de 32 à 34 sur ordinateur, il reste à 32. En Vitrine, il garde la hauteur des boutons. Les flèches de l’agenda sont aussi hautes que la ligne et aussi larges, au lieu d’être plus hautes que larges.
- Les croix sont celles des icônes, au milieu de leur carré : la fiche (`.sheet-close`), le tiroir des filtres (`.sidehead`) et la bulle (`ds.toast`, qui la dessine elle-même) ne portent plus la lettre « × », qui tombait à côté du milieu. Une page écrit `<svg class="ico"><use href="#i-close"/></svg>` dans le bouton. La croix de la fiche prend la taille d’un bouton icône.
- `ds.confirm({…, check: {label, checked}})` : une case sous le champ ou le texte ; la réponse devient `{value, checked}`, toujours `false` quand on annule.
- `ds.picker(holder, items, {…, check: {label, checked}})` : une case au pied de la liste, toujours visible sous une longue liste ; `onPick(item, {checked})` reçoit son état, `checked()` le lit.
- La vitrine montre le crayon carré de la fiche, la case dans la fenêtre du nom et au pied de la liste des catégories. `checks/behaviours.js` vérifie que chaque bouton icône est carré dans les deux thèmes, son icône au milieu à moins d’un demi-pixel, et les deux cases.

## 3.1.0 · 12 novembre 2026

Les derniers points de l’étude (52, 53 et 54) : des vérifications au clavier et sur téléphone, une page vitrine qui montre tout ce que ds sait faire, des graphiques, un agenda et des synchros lisibles sans la couleur. Rien ne change à l’écran dans les applis.

- Au clavier : `checks/access.js` passe par chaque fenêtre et chaque menu avec Tab, Maj+Tab, Entrée, Espace, Échap et les flèches, le focus revenant où il était : `ds.confirm`, la fiche, la visionneuse, le tiroir du téléphone, le choix de dates, le choix de période, le sélecteur, l’action d’une bulle, le menu du site et ses galeries.
- Sur téléphone : `checks/showcase.js` vérifie qu’à 375px ni `index.html` ni `site.html` ne débordent, dans les deux thèmes, et qu’aucun bouton, champ ou menu n’est coupé. La vitrine débordait de 8px : l’en-tête de démonstration y garde la barre des vues (posée dans l’en-tête au lieu du bas de l’écran) à côté de ses deux boutons, qui sortaient de la colonne ; sur un petit téléphone, la barre y passe désormais sur sa propre ligne, et les bulles prennent la largeur de la colonne.
- La vitrine montre, chacun avec sa vérification : le tiroir des filtres (`ds.drawer`, les filtres déjà là devenus un vrai tiroir), l’état des sources (`ds.status`), les synchros et leur journal (`ds.jobs`), l’adresse après # (`ds.route`, `ds.route.go`, `ds.seek`), le direct du serveur (`ds.stream`), la tête de période stable (`.periodhead.is-steady`), les formats (`ds.date`, `ds.time`, `ds.when`, `ds.ago`, `ds.soon`, `ds.number`, `ds.money`, `ds.percent`, `ds.compact`, `ds.today`) et les avatars (`ds.avatar`) ; la pilule (`ds.pills`) est vérifiée.
- Lisible sans la couleur : chaque graphique (la courbe, les barres, les barres en paires, la carte de chaleur, les petites barres, le donut) dit à un lecteur d’écran ses chiffres en une phrase (le plus haut, le plus bas, le premier, le dernier, le total, les parts), sans rien changer à l’écran ; `summary` la remplace par les mots de la page. Une synchro dit son état en mots (« dernier passage réussi », « en erreur », « en cours », « pas encore passé »), plus seulement par la couleur de sa pastille. Les vues de l’agenda (Mois, Semaine, Liste) suivent ← → Début Fin comme les onglets du choix de dates, en un seul arrêt de Tab.
- La page de réglages est rangée sous `.settings` plutôt que `body.settings` (sans poids ajouté, comme avant), pour que la vitrine puisse y montrer ses synchros.
- `ds.chart.line` prend `floor` : l’échelle descend jusqu’à cette valeur (0 pour un solde), et le niveau `ref` (la marge de Bank) se pose à sa vraie hauteur au-dessus, au lieu d’être le bas de la courbe.
- Sur iPhone et iPad, toucher un champ ne zoome plus la page : le noyau commun ajoute `maximum-scale=1` à la balise viewport, sur iOS seulement (iOS laisse toujours zoomer en pinçant ; Android, lui, ne le laisserait plus). Vérifié pour une page d’appli et pour le site.

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
