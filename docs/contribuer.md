---
icon: lucide/git-pull-request
---

# Contribuer

Les contributions (corrections, améliorations, documentation) sont les bienvenues.

## Échanger avec la communauté

Le **Club Utilisateurs GEO** est un serveur Discord où les utilisateurs de GEO échangent sur son usage et son administration. Il compte des fils
de discussion consacrés à certains de ces modules (comparaison de rasters, vues immersives Panoramax). Pour poser une question, partager un retour
d'expérience ou discuter d'une idée avant d'ouvrir une issue, rejoignez le [Club Utilisateurs GEO](https://discord.gg/dkqJbz79tU).

Ce serveur est animé par la communauté des utilisateurs de GEO, indépendamment de ce site.

## Signaler un problème ou proposer une idée

Ouvrez une *issue* sur le **dépôt du module concerné** (lien « Signaler un problème » sur la page de chaque [module](modules/index.md)).
Indiquez la version du module, la version de GEO, ce que vous attendiez, ce qui se passe et, si possible, le message de la console (F12).

Pour une question sur ce site ou sur la démarche générale, utilisez les issues de
[geo-modules-community](https://github.com/vienne-condrieu-agglomeration/geo-modules-community/issues).

## Proposer une modification

1. Ouvrez une issue pour une nouveauté, ou directement une demande de fusion (*pull request*) pour une correction simple.
2. Respectez les conventions du module, décrites dans son `CONTRIBUTING.md` :
    - messages de commit en [Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/), en français, à l'impératif ;
    - **commentaires du code en français, code en anglais**, textes affichés à l'utilisateur en français ;
    - `CHANGELOG.md` (pour les utilisateurs) et version mis à jour ;
    - un commit par changement logique.
3. **Signez vos commits** (`git commit -s`) : la ligne `Signed-off-by` atteste que vous avez le droit de proposer votre contribution sous la
   licence du projet ([Developer Certificate of Origin](https://developercertificate.org/)).
4. **Essayez votre modification dans un vrai GEO** avant de proposer : `npm run package` produit le ZIP à importer. Le plugin de publication
   de Business Geografic n'est pas nécessaire pour contribuer.

## Comment une idée est décidée

Le parcours d'une proposition (issue, discussion, décision, critères d'intégration, délais) est décrit dans la page [Gouvernance](gouvernance.md).

## Licence de vos contributions

En contribuant, vous acceptez que votre contribution soit publiée sous les licences du projet : **GPL-3.0-or-later** pour le code,
**CC-BY-4.0** pour la documentation.

## Après la fusion

Le code de ces modules est maintenu dans un dépôt source de la collectivité, qui alimente les dépôts GitHub. Une contribution fusionnée sur
GitHub est reprise dans ce dépôt source, **vos commits et votre nom conservés**, puis republiée avec la version suivante du module. Les
contributions sont mentionnées dans le `README.md` du module concerné.
