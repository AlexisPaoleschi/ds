# Consignes pour Claude

## Où trouver quoi

Les sources sont dans `src/`. `dist/` se refait avec `scripts/build.sh`, jamais à la main.

| Pour | Voir |
|:--|:--|
| ce que contient le dépôt, fichier par fichier | [docs/contenu.md](docs/contenu.md) |
| les classes de chaque feuille de style | [docs/composants.md](docs/composants.md) |
| les fonctions `ds.*` | [docs/fonctions.md](docs/fonctions.md) |
| ce que chaque appli copie et lie | [docs/dans-une-appli.md](docs/dans-une-appli.md) |
| publier une version, pas à pas | [docs/publier.md](docs/publier.md) |
| les vérifications de `checks/` | [docs/verifications.md](docs/verifications.md) |
| les règles des noms, du texte, des jetons et des largeurs | [docs/regles.md](docs/regles.md) |
| l'histoire de chaque version | [CHANGELOG.md](CHANGELOG.md) |

Une classe ou une fonction nouvelle se montre sur une page de la vitrine : `checks/coverage.js` échoue sinon.

## Commits

Chaque changement a son propre commit, qu'on comprend et qu'on peut annuler seul ; on ne réunit jamais tout un projet en un seul commit, et on ne réécrit l'historique publié qu'à la demande.

Le message est en anglais, sur une seule ligne : `feat:` ou `fix:`, puis une phrase qui commence par un participe passé (« Added », « Moved », « Kept »…).

L'auteur et le committer sont toujours Alexis Paoleschi <40610397+AlexisPaoleschi@users.noreply.github.com>, sans co-auteur ni ligne ajoutée au message (ni `Co-Authored-By`, ni `Claude-Session`).

Une version publiée est un commit : son numéro entre parenthèses à la fin du message (« (5.19.2) »), `VERSION` et le CHANGELOG à jour dans le même commit, et le tag `vX.Y.Z` posé dessus. Une retouche de la vitrine qui ne publie rien fait son propre commit, sans numéro.

Toutes les applis (Bank, Studio, Selecta et le site) reçoivent chaque version publiée, même quand elle ne change rien pour elles.
