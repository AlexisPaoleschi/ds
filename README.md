<div align="center">

# ds

**Le design system commun à Bank, Studio, Selecta et au site alexispaoleschi.com**

[alexispaoleschi-ds.onrender.com](https://alexispaoleschi-ds.onrender.com) &nbsp;·&nbsp; public

</div>

<br>

## En bref

| | |
|:--|:--|
| **Ce qu’il fait** | Les jetons, les composants, les icônes et les polices des quatre applis, en deux thèmes : Atelier et Vitrine |
| **Où il tourne** | La vitrine sur Render ; dans chaque appli, une copie figée d’une version |
| **Versions** | La version en cours dans [`VERSION`](VERSION), chacune avec son tag `vX.Y.Z` et son histoire dans le [CHANGELOG](CHANGELOG.md) |
| **Fait avec** | CSS · JavaScript · les icônes de Lucide et Simple Icons · Node et Playwright pour les vérifications |

<br>

## Démarrer

```bash
# refaire dist/ à partir de src/ (la vitrine, index.html, lit dist/)
sh scripts/build.sh
```

```bash
# lancer toutes les vérifications, dans un vrai navigateur
for c in checks/*.js; do node "$c"; done
```

> [!NOTE]
> Les vérifications demandent Node et Playwright. Chacune sert le dépôt elle-même, sur un port libre de la machine.

<br>

## Documentation

| | |
|:--|:--|
| 🗂️ [Contenu](docs/contenu.md) | les deux thèmes, les fichiers de `dist/` et leurs sources, les kits, la vitrine |
| 🧩 [Composants](docs/composants.md) | chaque feuille de style et les classes qu’elle dessine |
| 🧰 [Fonctions](docs/fonctions.md) | les fonctions `ds.*` de chaque fichier JavaScript |
| 📦 [Dans une appli](docs/dans-une-appli.md) | ce que chaque appli copie et lie, le thème, comparer avant et après |
| 🚀 [Publier](docs/publier.md) | d’un changement dans `src/` à la copie dans les quatre applis |
| 🧪 [Vérifications](docs/verifications.md) | ce que vérifie chaque script de `checks/` |
| 📐 [Règles](docs/regles.md) | une seule façon de nommer, les quinze rôles du texte, les jetons, les largeurs |
| 🤖 [Consignes pour Claude](CLAUDE.md) | les règles à suivre dans ce dépôt |
