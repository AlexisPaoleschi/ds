# 🧩 Composants

Chaque feuille de style de `src/` et ce qu’elle dessine, rangée comme dans `dist/`. La vitrine les montre tous.
[← Retour au README](../README.md)

## Les fondations

| Fichier | Ce qu’il dessine |
|:--|:--|
| `tokens.css` | les couleurs, les polices, les arrondis (`--r-s`, `--r-m`, `--r-l`), la palette, les quinze rôles du texte, les deux thèmes |
| `fonts.css` | les polices des deux thèmes, faites par `scripts/fonts.py` |
| `base.css` | les champs, les cases à cocher et le focus, les mêmes partout ; la ligne sous un champ (`.field-note`, `is-good`, `is-bad`, `is-reserved`) ; l’étoile dorée d’un champ obligatoire (`.field-label.is-required`, ou `<span class="is-required">` dans une `.check`) |
| `heads.css` | les titres des parties d’une page (`.title-1`, `.title-2`, `.title-3`) ; l’en-tête d’une page (`.page-head`, `.eyebrow`, `.lede`) |
| `forms.css` | un champ et son étiquette (`.field-group`, `.field-label`), un formulaire en carte (`.card.is-form`), `.field-row`, les cases (`.check`, ses mots dans un `<span>` quand ils portent un lien, sans quoi le lien s’écarte d’eux ; `.check-hint`, `.checks`), `.pager` |
| `page.css` | la page de Bank et Studio : son en-tête et son chargement, sa largeur, la place de la barre d’onglets, ses boutons carrés `.btn.is-icon` |

La palette nomme les banques, les catégories, les réseaux et les agendas : `--c-rouge`, `--c-corail`, `--c-orange`, `--c-ambre`,
`--c-jaune`, `--c-vert`, `--c-emeraude`, `--c-turquoise`, `--c-ciel`, `--c-bleu`, `--c-violet`, `--c-mauve`, `--c-rose`, `--c-ardoise`.

Les boutons carrés de l’en-tête sont plus discrets que ceux de la page au repos. Ils passent à l’or au survol et à l’appui,
et restent gris sans s’allumer quand ils n’ont rien à faire (`disabled`).

## Les marques et les contrôles

| Fichier | Ce qu’il dessine |
|:--|:--|
| `marks.css` | le carré de couleur (`.swatch`, `--swatch-size`, `.is-open` pour le vide), le point d’or (`.pip`), la roue (`.spinner`, `--spin-size`, `--spin-time`), l’étiquette (`.tag`) |
| `buttons.css` | `.btn` et `is-act`, `is-save`, `is-danger`, `is-icon` (carré, `--btn-icon-h`), `is-select`, `is-large`, `is-busy` |
| `tabs.css` | les onglets ; les vues d’une appli (`.tabs.is-bar`) ; `.tabs.is-icons`, des icônes seules |
| `pick.css` | la pilule (`.pill`, `.pill-value`, `.pills`), le sélecteur avec recherche, le bouton pointillé qui ajoute (`.add-btn`) |
| `chosen.css` | l’or d’un choix fait, le même partout (`--chosen-ink`, `--chosen-bg`, `--chosen-line`) ; l’onglet choisi a le sien, `--tab-on-bg` |

* Chaque carré de couleur de ds est `.swatch` : ceux des filtres, du calendrier, des graphiques, des tuiles et du sélecteur.
* Chaque roue de ds est `.spinner`, à la même vitesse dans les deux thèmes.
* `.tag` est un mot court dans un petit cadre, dans sa couleur (`--a`, l’or par défaut) ou un ton (`.tag.is-good`, `.is-bad`, `.is-mid`).
* `is-select` est un `<label>` qui ouvre une liste : le menu natif, posé dessus et invisible, s’ouvre là où on touche.
* `is-large` est le gros bouton d’un site public, 63px en Vitrine.
* En Atelier, au survol et à l’appui, un bouton a son icône ou son texte et son bord en or. Sans bord (une croix de bulle), il prend un bord doré tracé à l’intérieur.
* Une vue de `.tabs.is-bar` : `<svg class="ico">`, `<span class="tab-label">` et le point d’or `<i class="tabn">`. Dans l’en-tête sur ordinateur, en barre en bas sur téléphone.
* Un onglet peut être un lien (la langue de la page en `aria-current`) ou un bouton radio dans un `<label>`.

## Les surfaces

| Fichier | Ce qu’il dessine |
|:--|:--|
| `card.css` | `.card`, son filet doré `.is-ruled`, sa couleur `.is-tinted`, la carte qu’on clique `.is-link`, son titre `.ct`, `.card-title` (un lien dedans garde l’allure du titre), `.card-meta`, la carte pliée `.is-folded`, la photo de couverture (`.has-cover`, `.card-cover`, `.card-body`), `.is-small`, `.grid-cards` |
| `avatar.css` | le logo à initiale (`ds.avatar`) et ce que l’adresse désigne (`ds.seek`) |
| `msg.css` | le message durable, avec son icône, son ton et son action |
| `toast.css` | la bulle, en bas à droite ; au-dessus de la barre d’onglets sur téléphone, de sa largeur (`--tabbar-w`) |
| `dialog.css` | la fenêtre qui demande avant une action sans retour, ou un court texte (`ds.confirm`) |
| `sheet.css` | la fiche (`.sheet`, `.sheet-panel`, `.sheet-close`, `.sheet-sub`, `.sheet-t`, `.sheet-fig`, `.sheet-acts`) : au milieu sur ordinateur, du bas sur téléphone |
| `pop.css` | le panneau sous un bouton de la barre du haut (`.pop`, `.pop-panel`, `.pop-head`, `.pop-foot`, `.pop-count`) |
| `viewer.css` | la visionneuse de photos (`.viewer`, `.viewer-count`), et ce que `ds.viewer` y ajoute |

Une carte se plie avec `details.fold`, ou par son titre avec `ds.foldCard`.

## Les données

| Fichier | Ce qu’il dessine |
|:--|:--|
| `tiles.css` | les chiffres en tuiles (`.tiles`, `.tile`), la forme compacte (`.tiles.is-compact`), `.is-cols`, `.tile.is-link`, `.is-shrink` |
| `meter.css` | une barre par catégorie (`.meter`) |
| `table.css` | le tableau qui se trie et se choisit (`table.tbl`, `.is-num`, `.tbl-ck`, `.tbl-main`, `.tbl-end`, `.tbl-wide`, `.tbl-phone`), en cartes sur téléphone (`.is-cards`, `.tbl-sortmenu`), la barre du choix (`.selbar`, `.selbar-n`, `.selbar-x`, `.selbar-acts`) |
| `rows.css` | les lignes séparées d’un trait (`ul.rows`, `--row-py`), en cartes (`.is-cards`), `.rows-head`, `.late-tag`, `.tint`, les paires de mots (`dl.facts`) |

* `.tiles.is-compact` est pour le haut d’un écran. Vitrine la dessine en petites cartes ombrées, le chiffre au-dessus.
* `.tiles.is-cols` fixe les colonnes : `--tile-cols` (4), `--tile-cols-phone` (2) sur téléphone.
* `.tile.is-link` s’ouvre d’un clic n’importe où, par son lien `a.row-link` (Tab l’atteint).
* `.tiles.is-shrink` (ou `ds.fitFigures`) rapetisse un chiffre trop long jusqu’à 11px, jamais en dessous, puis le passe à la ligne.
* Les règles du tableau sont dans `ds.css`, pour les listes de Selecta ; son tri et son choix restent dans `ds-tools.js`.

## Les pièces publiques et les pages

| Fichier | Ce qu’il dessine |
|:--|:--|
| `public.css` | la pastille (`.badge`), l’en-tête de section (`.section-head`, `.section-sub`), le pied de page (`.site-footer`), qui reste en bas d’une page courte ; un film cadré comme une photo (`.video-frame`) |
| `hero.css` | le bandeau photo (`.hero`) : `.is-full`, `.is-band`, `.is-short`, `.is-bottom`, `.is-parallax` ; ses tailles en jetons `--hero-*` ; un film à la place de la photo (`video.hero-img`), sur ordinateur seulement |
| `topbar.css` | la barre du haut (`.topbar`, `.topbar-in`, `.topbar-brand`, `.topbar-nav`, `.topbar-link`, `.topbar-icon`), `.is-site`, `.has-back` |
| `backlink.css` | le lien retour (`.back-link`), `.on-photo` sur une photo |
| `photogrid.css` | la grille de photos (`.photogrid`, `.is-flush`), son zoom (`.photogrid-zoom`, `input.zoom-slider`) |
| `photokit.css` | le kit photo : `.dropzone`, `.upload-total`, `.upload-row`, `.tile-acts`, `button.box.on-photo`, `.is-picked`, `.tile-caption`, `.thumb-x`, `.viewer-bar.is-tools` |
| `gallery.css` | le kit galerie, venu de Selecta : sa page, sa connexion, les cœurs, le choix, l’export, les notes, la cloche |
| `doc.css` | les petites pages d’une appli (`body.doc`) ; une page légale d’un site (`body.doc.is-legal`) |
| `settings.css` | la page de réglages, rangée sous `.settings` |

* `.hero` seul est le bandeau des pages du site ; `.is-full` celui d’une page d’événement ; `.is-short.is-bottom` la couverture de Selecta.
* La page donne sa photo au bandeau : `style="--hero-photo: url('/chemin/depuis/la/racine.jpg')"`. Le chemin part de la racine, puisque c’est le fichier du design system qui le lit.
* La barre s’aligne sur la page : 1500px pour un outil, 1200px pour un site (`.is-site`).
* Un lien retour dans la barre (`.back-link.topbar-back`) se tient au bord gauche de l’écran s’il y a la place, sinon juste avant le nom.
* Une page légale a son en-tête (`.doc-head`, `.doc-sub`), ses parties (`.doc-section`), `.doc-notice`, le bloc à signer (`.doc-sign`…) et `.doc-foot`.

## Les outils, dans `ds-tools.css`

| Fichier | Ce qu’il dessine |
|:--|:--|
| `period.css` | l’en-tête de période de Bank et Studio : le grand titre qui ouvre le sélecteur, les flèches à droite ; un mois entre ses flèches au bout du titre d’une carte (`.periodnav.is-step`), sous le titre sur un téléphone |
| `periodpick.css` | le choix de période : des onglets sur ordinateur, une pilule sur téléphone (« 1 an ▾ ») |
| `datepick.css` | le choix de date et de période, venu de Bank |
| `reorder.css` | déplacer à la poignée (`.grip`) |
| `live.css` | le témoin « nouvelle version » (`.btn.is-icon.newver`, `.newver-pip`) |
| `panel.css` | le panneau de filtres, venu de Studio : l’onglet sur le bord, le panneau, le tiroir sur téléphone |
| `status.css` | l’état des sources, en bas de page |
| `figures.css` | les classements (`.ranks`), les mini-tuiles (`.minitiles`, `.is-fit`), les verdicts (`.verdict`) |
| `chart.css` | les graphiques ; la couleur d’une série est un jeton de la palette, posé en `--n` |
| `calendar.css` | le calendrier, venu de l’agenda de Studio : le mois, la semaine, la liste |

## Le kit du site, dans `ds-site.css`

| Fichier | Ce qu’il dessine |
|:--|:--|
| `sitebase.css` | la base d’une page, l’écran de chargement (`.page-loader`), `.landscape-warning`, `.subtitle`, `.golden-divider-after`, `.pill-link` |
| `sitebar.css` | `.back-button`, la barre qui apparaît après l’en-tête (`.topbar.is-site.sticky-nav`), le menu du téléphone (`.mobile-menu`…) |
| `banners.css` | les bandeaux du pied des pages : réseaux (`.social-banner`), newsletter (`.signup-banner`) |
| `event.css` | les blocs d’une page d’événement : sections, modèles, lieu, accès, programme, réservation (son formulaire centré, l’accompagnant), FAQ, galeries |
| `home.css` | l’accueil (`<body class="home">`), qui défile écran par écran |
| `eventslist.css` | la liste des événements, en cartes à couverture ; le pied d’une carte, son bouton à droite, se cale en bas de la carte |
| `newsletter.css` | la page de la newsletter |
| `testimonials.css` | le bandeau des témoignages, chacun dans une carte |
| `sitetext.css` | le texte courant justifié sur téléphone, sans couper un mot |

* L’écran de chargement s’ôte par `window.hideLoader()`, au plus tard après 5 s.
* L’invite à redresser un téléphone couché paraît quand `window.dsLandscapeWarning` est vrai.
* Une page d’événement peut prendre `.section-subtitle`, `.info-box.is-left`, `.gallery-grid-duo`. Elle n’a plus de prix (6.0.0).
