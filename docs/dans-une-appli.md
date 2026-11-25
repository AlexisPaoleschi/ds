# 📦 Dans une appli

Ce que chaque appli copie et lie, comment elle choisit son thème, et comment comparer ses pages avant d’en changer.
[← Retour au README](../README.md)

## Les quatre applis

| Appli | Thème | Sa copie | Ce qu’elle copie |
|:--|:--|:--|:--|
| Bank | Atelier | `static/ds/` | `ds.css`, `ds.js`, `ds-tools.css`, `ds-tools.js`, `ds-icons.js`, `fonts/` |
| Studio | Atelier | `static/ds/` | les mêmes que Bank |
| Selecta | Vitrine | `src/main/resources/static/ds/` | `ds.css`, `ds.js`, `ds-photo.js`, `icons.svg`, `fonts/`, et le kit mail |
| alexispaoleschi.com | Vitrine | `ds/` | `ds.css`, `ds-photo.js`, `ds-site.css`, `ds-site.js`, `icons.svg`, `fonts/`, et le kit mail |

Le site de Katline garde sa propre identité.

Chaque fichier porte son numéro : `ds-5.19.2.css`, `ds-tools-5.19.2.js`, `icons-5.19.2.svg`, `ds-mail-5.19.2.json`.

> [!IMPORTANT]
> On ne modifie jamais la copie d’une appli : on change ce dépôt, on publie une version, puis on la copie.

## Lier une version

La copie se lie avant les styles et les scripts de l’appli.

| Fichier | Où il se lie | Qui |
|:--|:--|:--|
| `ds-X.Y.Z.css` | en premier | toutes |
| `ds-tools-X.Y.Z.css` | après `ds.css` | Bank et Studio, dans les pages qui dessinent les outils |
| `ds-site-X.Y.Z.css` | après `ds.css` | le site |
| `ds-X.Y.Z.js` | en premier des scripts | Bank, Studio, Selecta |
| `ds-icons-X.Y.Z.js` | juste après `ds.js` | Bank et Studio |
| `ds-tools-X.Y.Z.js` | après `ds.js` | Bank et Studio |
| `ds-site-X.Y.Z.js` | en premier des scripts | le site |
| `ds-photo-X.Y.Z.js` | après `ds.js`, ou après `ds-site.js` sur le site | les pages qui montrent des photos |

Le site ne charge pas `ds.js` : `ds-site.js` et `ds-photo.js` ont leur propre noyau.

## Le thème

Il se choisit sur la balise `<html>` : `data-theme="atelier"` (par défaut) ou `data-theme="vitrine"`.

## Les icônes

| Qui | Comment une page écrit une icône |
|:--|:--|
| Bank et Studio | `<svg class="ico" aria-hidden="true"><use href="#i-wallet"/></svg>`, la planche posée par `ds-icons.js` |
| Selecta et le site | `<svg class="ico"><use href="ds/icons-X.Y.Z.svg#i-mail"/></svg>`, sans aucun script |

Dans les deux cas, le navigateur garde les icônes d’une visite à l’autre. Une page n’a plus de copie à elle.

## Prendre une nouvelle version

`scripts/sync.sh` télécharge une version par son tag, l’écrit dans le dossier de l’appli et remplace la précédente.

```bash
scripts/sync.sh X.Y.Z ../bank tools
scripts/sync.sh X.Y.Z ../studio tools
scripts/sync.sh X.Y.Z ../selecta/src/main/resources
scripts/sync.sh X.Y.Z ../bio site
```

* Sans mot de plus : `ds.css`, `ds.js`, `ds-photo.js` et `icons.svg`, pour Selecta.
* `tools` : `ds.css`, `ds.js`, `ds-tools.css`, `ds-tools.js` et `ds-icons.js`, pour Bank et Studio.
* `site` : `ds.css`, `ds-photo.js`, `ds-site.css`, `ds-site.js` et `icons.svg`, dans `ds/` à la racine du site.
* Chaque fois, il remplace aussi les polices, dans `fonts/` à côté.

Il reste à lier la nouvelle version dans les pages, à la place de la précédente.

> [!NOTE]
> `sync.sh` ne copie pas le kit mail : Selecta et le site prennent `dist/ds-mail.json` à part, sous le nom `ds-mail-X.Y.Z.json`.

Toutes les applis prennent chaque version publiée, même quand elle ne change rien pour elles.

## Comparer avant et après

Avant qu’une appli prenne une nouvelle version, ou qu’un changement parte en ligne, on compare chaque page, sur ordinateur et sur téléphone.

```bash
node scripts/compare.js config.json
```

| Clé de la configuration | Ce qu’elle dit |
|:--|:--|
| `before`, `after` | le serveur d’avant et celui d’après ; le même quand `ds` est donné |
| `ds` | un dossier qui tient un `ds.css` et un `ds.js` candidats ; avec `"ds": "dist"`, les pages d’après prennent ceux de ce dépôt, sans toucher à l’appli |
| `pages` | les pages, avec `click` pour ouvrir quelque chose d’abord et `full: false` pour l’écran seul |

`scripts/compare.example.json` en donne un exemple. L’outil écrit une page qui montre, pour chaque page et chaque taille
d’écran, l’avant, l’après et en rouge ce qui a changé. Il demande Node et Playwright.
