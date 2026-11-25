# 🚀 Publier

Comment une version naît : d’un changement dans `src/` jusqu’à sa copie dans les quatre applis.
[← Retour au README](../README.md)

## Les étapes

| | Étape | Comment |
|:--|:--|:--|
| 1 | Changer les sources | dans `src/`, jamais dans `dist/` |
| 2 | Le montrer sur la vitrine | `index.html`, `site.html` ou la page qui convient |
| 3 | Choisir le numéro | voir plus bas |
| 4 | Écrire `VERSION` et le CHANGELOG | le numéro dans `VERSION`, une entrée en tête de `CHANGELOG.md` |
| 5 | Refaire `dist/` | `sh scripts/build.sh` |
| 6 | Lancer les vérifications | voir [Vérifications](verifications.md) |
| 7 | Faire le commit | un seul, son numéro à la fin du message |
| 8 | Pousser sur `main` | GitHub pose le tag `vX.Y.Z` |
| 9 | Copier dans les applis | `scripts/sync.sh`, dans les quatre |

> [!WARNING]
> `checks/coverage.js` échoue si une classe ou une fonction n’est montrée sur aucune page de la vitrine.

## Choisir le numéro

| Chiffre | Quand |
|:--|:--|
| le dernier, `5.19.2` → `5.19.3` | une correction |
| celui du milieu, `5.19.2` → `5.20.0` | un composant de plus |
| le premier, `5.19.2` → `6.0.0` | un nom de classe change ou disparaît |

## Le CHANGELOG

Une entrée par version, la plus récente en haut, son titre fait du numéro et du jour :

```markdown
## 5.19.2 · 25 novembre 2026

- Ce qui change, pour qui, et ce qui se voit.
```

## Refaire `dist/` et vérifier

```bash
sh scripts/build.sh
for c in checks/*.js; do node "$c"; done
```

`build.sh` écrit le numéro de `VERSION` en tête des feuilles de style, des scripts et de `icons.svg`.

## Le commit et le tag

* Une version est un commit : `src/`, `dist/`, `VERSION` et le CHANGELOG ensemble.
* Son message finit par le numéro entre parenthèses, « (5.19.2) ». Le reste suit les [Consignes pour Claude](../CLAUDE.md#commits).
* Une retouche de la vitrine qui ne publie rien fait son propre commit, sans numéro.
* À chaque poussée sur `main`, `.github/workflows/tag.yml` pose le tag `vX.Y.Z` sur le commit qui a publié la version.

## La copie dans les applis

`sync.sh` télécharge la version par son tag : on l’attend avant de copier.

```bash
scripts/sync.sh X.Y.Z ../bank tools
scripts/sync.sh X.Y.Z ../studio tools
scripts/sync.sh X.Y.Z ../selecta/src/main/resources
scripts/sync.sh X.Y.Z ../bio site
```

Puis, dans chaque appli :

* lier la nouvelle version dans les pages, à la place de la précédente ;
* copier le kit mail à part pour Selecta et le site (voir [Dans une appli](dans-une-appli.md#prendre-une-nouvelle-version)) ;
* comparer ses pages avant et après (voir [Dans une appli](dans-une-appli.md#comparer-avant-et-après)) ;
* faire le commit : la copie va dans le commit du changement qui s’en sert, ou seule dans « Moved to ds X.Y.Z ».

> [!IMPORTANT]
> Toutes les applis (Bank, Studio, Selecta et le site) reçoivent chaque version, même quand elle ne change rien pour elles.
