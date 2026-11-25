# 📐 Règles

Les règles que ds suit, et que chaque appli suit en le prenant : les noms, les couleurs, le texte, les jetons, les largeurs.
[← Retour au README](../README.md)

## Une seule façon de nommer et d’appeler

Depuis 3.0, une seule convention partout :

* Un état s’écrit `is-…` (`is-on`, `is-open`, `is-selected`, `is-focused`, `is-loading`, `is-late`…), ou par l’attribut aria quand il existe (`aria-pressed`, `aria-selected`, `aria-current`, `aria-expanded`, `aria-invalid`).
* Un ton s’écrit `is-good`, `is-bad` ou `is-mid`, partout : un message, une case, son écart, un verdict, un point de synchro ou de source, une ligne du journal.
* Les noms sont longs et uniques (`row-title`, `tile-delta`, `status-dot`, `sheet-close`…) : aucun nom d’une ou deux lettres, aucun suffixe qui change de sens.
* Une fonction qui dessine s’appelle `ds.chose(holder, données, options)`.

| Option | Pour |
|:--|:--|
| `value` | le choix |
| `onPick` | quand on choisit |
| `format` | écrire un chiffre |
| `tip` | les mots au survol |
| `label` | le nom que lit un lecteur d’écran |

Appelée deux fois sur le même holder, une fonction rend le même composant. Sans holder, rien ne plante : un dessin rend
seulement son élément, un composant rend `null`.

> [!NOTE]
> `checks/names.js` refuse dans `dist/` tout nom d’avant 3.0. Leur liste, avec chaque nouveau nom, est dans le CHANGELOG à 3.0.0.

## Les couleurs

* Toutes vivent ici. Une appli ne nomme qu’un jeton (`var(--c-bleu)`, `var(--good)`…), jamais un code couleur.
* `--good`, `--bad` et `--mid` sont réservés aux entrées, aux sorties et à ce qui demande un coup d’œil.
* Le rouge, le vert et le jaune de la palette nomment une banque, une catégorie ou un agenda.
* Deux choses montrées ensemble (les banques, les dépenses d’un mois, un voyage, les réseaux et les agendas de Studio) ne prennent jamais la même couleur.
* Un mot dans une couleur de la palette s’écrit avec `.tint` (ou `color-mix` avec `--tint-ink`) : en Vitrine, il prend de l’encre pour se lire sur le blanc.
* Un mot en or prend `--accent-text`.

## Le texte : seize rôles

Aucune autre taille, graisse ou espacement de lettres, dans ds comme dans les applis (5.0.0, 5.6.0, 5.16.0).

| Rôle | Jetons | Pour |
|:--|:--|:--|
| le grand titre | `--type-display-…` | une couverture, un très grand chiffre |
| le titre de couverture | `--type-cover-…` | le titre de la couverture plein écran d’une page d’événement |
| la ligne de couverture | `--type-cover-line-…` | le lieu sur cette couverture |
| le prix | `--type-price-…` | le prix d’une page d’événement, entre le titre de couverture et le grand titre (5.16.0) |
| les titres 1, 2 et 3 | `--type-title-1-…` à `-3-…` | une page ; une section ou une fenêtre ; un bloc |
| le chiffre | `--type-figure-…` | le chiffre d’une case, le prix sur la carte d’un événement |
| le sous-titre | `--type-subtitle-…` | la ligne espacée sous un grand titre, la date d’une couverture, la phrase d’un bandeau |
| le texte | `--type-text-…` | le texte courant |
| le texte fort | `--type-strong-…` | un nom, le titre d’une ligne |
| le petit texte | `--type-small-…` | une précision : la ligne sous un champ, un lieu, une note |
| la légende | `--type-caption-…` | ce qui est serré : un calendrier, un graphique |
| les capitales | `--type-caps-…` | un menu, les détails d’une carte |
| les petites capitales | `--type-smallcaps-…` | l’étiquette d’un champ, l’en-tête d’une section, d’une carte ou d’un tableau, un onglet, un badge |
| le bouton | `--type-button-…` | un bouton |

* Chaque rôle a une police, une taille, une graisse, un espacement et une casse (`-font`, `-size`, `-weight`, `-ls`, `-case`), que chaque thème règle.
* Un composant choisit un rôle, jamais une taille. `--type-card-title-…` n’est pas un rôle : le titre 3 en Atelier, le titre 1 en Vitrine.
* Un mot peut passer en mono (un chiffre, une date) ou prendre la graisse du texte fort.
* Le nom à gauche d’une barre (`--brand-…`) est un logo, seul à part.
* Aucun texte n’a moins de 11px.
* Aucun multiplicateur : une taille qui manque devient un rôle, nommé et montré.
* Une phrase grise sous un titre est du texte, jamais un sous-titre : le sous-titre est la ligne en capitales espacées, dorée (un lieu).

Sur un téléphone, debout ou couché (jusqu’à 956px de large à l’horizontale, dans le kit du site) : le grand titre fait
36px au plus, le titre 1 22px, le titre de couverture 48px et le prix 40px.

L’italique a un sens et jamais un rôle de décor : une citation (un témoignage), une note (celle d’une opération, en or) et
le titre d’une œuvre (`<cite>`). `node checks/roles.js` refuse tout autre texte en italique.

Sur un téléphone, le texte courant du site qui se lit depuis la gauche est justifié, sans jamais couper un mot
(5.18.0, `src/sitetext.css` et les pages légales). Ce qui est centré le reste.

## Les écarts entre les lettres

Cinq écarts et aucun autre (5.9.0). Chaque rôle en prend un dans chaque thème.

| Jeton | Écart | En Vitrine | En Atelier |
|:--|:--|:--|:--|
| `--track-0` | aucun | le texte, le texte fort, la légende | tous les rôles qui ne sont pas plus bas |
| `--track-s` | petit, 0,04 em | le petit texte | |
| `--track-m` | moyen, 0,10 em | le grand titre, les titres, le titre de couverture, le prix, le chiffre | les capitales, les petites capitales |
| `--track-l` | large, 0,15 em | les capitales, les petites capitales, le bouton | |
| `--track-xl` | très large, 0,18 em | le sous-titre, la ligne de couverture | le sous-titre, la ligne de couverture |

Le nom à gauche d’une barre (`--brand-ls`) reste à part : c’est un logo.

## Les jetons

* Interlignes, marges, superpositions, durées et ombres sont des jetons (`--lh-text`, `--s-12`, `--z-sheet`…).
* Un composant ne décide pas de son caractère : il lit les rôles de son thème (`--type-…`, `--btn-h`, `--field-px`, `--card-pad`…), déclarés dans `src/tokens.css`.
* Une appli n’utilise que les rôles (`--accent`, `--panel`…) et ne les redéfinit jamais.
* Un champ, un menu et un bouton côte à côte ont la même hauteur, `--control-h` : 34px en Atelier, 45px en Vitrine.

## Les largeurs

| Page | Jeton | Largeur |
|:--|:--|:--|
| un outil : Bank, Studio, Selecta | `--page-max` | 1500px |
| les pages d’un site : alexispaoleschi.com | `--page-site` | 1200px |
| une page de texte (`body.doc`, 5.8.0) | `--read-l` | 720px de texte |

Les largeurs d’écran sont les mêmes partout, celles d’alexispaoleschi.com. `checks/bundles.js` le vérifie.

| Largeur d’écran | Pour |
|:--|:--|
| 480, 768 et 1024px | les trois largeurs du site |
| 769px | plus large qu’un téléphone |
| 1280px | un très grand écran |
| `(max-width: 956px) and (orientation: landscape)` | le téléphone tenu couché, dans le seul kit du site ; les rôles y gardent leur taille de téléphone |

## Les boutons

| Bouton | Pour |
|:--|:--|
| gris, `.btn` | aller ailleurs |
| or, `.btn.is-act` | agir |
| or plein, `.btn.is-save` | enregistrer |
| rouge, `.btn.is-danger` | supprimer, se déconnecter |

## Ce qui vit ici

* Une appli ne garde dans ses pages que ce qui tient à son métier. Tout ce qui sert à deux applis vit ici.
* Une pièce générique vit ici même si une seule appli s’en sert aujourd’hui, pour que les outils futurs la reprennent.
* Le site n’a plus de feuille de style : tout ce qu’il dessine vit dans le kit du site, que les applis ne chargent pas.
* La vitrine montre tout ce qui existe : `checks/coverage.js` le vérifie.

## Les tests des applis

Chaque appli a un test qui échoue si une page écrit une couleur, une taille, un espace, un arrondi, une superposition,
une durée ou une ombre au lieu de nommer un jeton.

| Appli | Ses tests |
|:--|:--|
| Bank et Studio | `tests/test_design_system.py`, et `tests/test_ds_parts.py` : une page ne redessine pas ce que ds dessine |
| Selecta | `src/test/java/…/design/DesignSystemTest.java` et `DesignSystemPartsTest.java` |
| alexispaoleschi.com | `tests/check_design_system.py` |
