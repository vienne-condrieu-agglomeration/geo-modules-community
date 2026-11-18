---
icon: lucide/database
---

# Données et intégrateurs

Certains modules ont besoin de données qu'aucun service GEO ne fournit. Plutôt que d'exiger un serveur ou une base de données, la bibliothèque
publie ces données sous forme de **fichiers statiques** (JSON), préparés à partir d'une source ouverte par un **intégrateur** : un petit programme
Python (bibliothèque standard, sans dépendance) qui télécharge la source, la contrôle et la convertit. Le module les lit directement dans le
navigateur : pas de serveur, pas de base de données, aucun mot de passe.

!!! note "Projets indépendants"
    Les intégrateurs et leurs données sont des projets communautaires, **non affiliés à Business Geografic** ni à l'administration qui produit la
    source. GEO est un produit de Business Geografic.

## Comment ça fonctionne

Chaque famille de données a **deux dépôts** :

| Dépôt | Rôle |
|---|---|
| `geo-community-integrator-<nom>` | Le code de l'intégrateur, versionné (une version = un tag). Sa documentation décrit le format des fichiers produits : c'est le contrat avec le module. |
| `geo-community-data-<nom>` | Un workflow GitHub Actions qui lance l'intégrateur et publie le résultat sur GitHub Pages. Selon la source, il vérifie chaque semaine si elle a changé et ne republie que si c'est le cas (DFI), ou se lance à la demande (city3d, dont la source change rarement). |

Le **format de sortie** porte un numéro de version (`format` dans `index.json`). Un module refuse un format qu'il ne connaît pas et demande sa
mise à jour, au lieu d'afficher des résultats faux. Les champs ajoutés sans casser l'existant (par exemple le nom des communes) ne changent pas ce
numéro.

## Filiation des parcelles (DFI)

Alimente le module [Filiation des parcelles](modules/dfi/index.md) : l'historique des divisions, réunions, lotissements et remaniements de chaque
parcelle cadastrale, d'après les **Documents de filiation informatisés** de la DGFiP.

- **Source** : [DFI des parcelles](https://www.data.gouv.fr/datasets/documents-de-filiation-informatises-dfi-des-parcelles) sur data.gouv.fr, publiés
  chaque trimestre sous **Licence Ouverte 2.0**. Le module affiche la source et la date de mise à jour, comme la licence l'exige.
- **Intégrateur** : [geo-community-integrator-dfi](https://github.com/vienne-condrieu-agglomeration/geo-community-integrator-dfi) (GPL-3.0-or-later).
  Il produit un fichier JSON par commune et un `index.json` qui porte le nom des communes (API Géo) et la date de la situation. Il sait traiter un
  ou plusieurs départements, ou toute la France (environ 1,5 Go de JSON pour 34 900 communes, converties en cinq minutes).
- **Données** : [geo-community-data-dfi](https://github.com/vienne-condrieu-agglomeration/geo-community-data-dfi), publiées sur GitHub Pages.
  Les départements publiés sont réglés par une variable du dépôt (`DFI_DEPARTMENTS`).

### Utiliser vos propres données

Le module lit par défaut les données publiées par la bibliothèque. Une collectivité qui veut d'autres départements, ou ses propres données, peut
**publier les siennes** : le module accepte une autre adresse (réglage « Adresse des données » dans le Générateur). Deux possibilités :

1. Copier le dépôt `geo-community-data-dfi` (fork), régler sa variable `DFI_DEPARTMENTS` et activer GitHub Pages (source : GitHub Actions) ;
2. Lancer l'intégrateur sur un poste et déposer le dossier produit sur n'importe quel serveur web qui répond en **HTTPS** avec l'en-tête
   `Access-Control-Allow-Origin` (sans cela, le navigateur bloque la lecture depuis GEO).

!!! warning "Limite de GitHub Pages"
    Un site GitHub Pages ne dépasse pas **1 Go**. Toute la France (1,5 Go) n'y tient donc pas : choisissez vos départements, ou un autre hébergement.

## Maquette 3D de la ville (city3d)

Alimente le module [LiDAR HD 3D (IGN)](modules/lidar-hd/index.md) : les **bâtiments reconstruits en 3D** (LoD2, toits en pente et murs droits) et les
**arbres 3D** de la Maquette, qui remplacent les bâtiments et les cônes bruités du modèle numérique de surface.

- **Sources** : le nuage de points [LiDAR HD](https://geoservices.ign.fr/lidarhd) et les emprises des bâtiments de la
  [BD TOPO®](https://geoservices.ign.fr/bdtopo) de l'IGN, sous **Licence Ouverte 2.0**. Mention à reprendre : « Source : IGN, LiDAR HD et BD TOPO®,
  traitement Vienne Condrieu Agglomération ».
- **Intégrateur** : [geo-community-integrator-city3d](https://github.com/vienne-condrieu-agglomeration/geo-community-integrator-city3d)
  (GPL-3.0-or-later). Python (bibliothèque standard) et **Docker** : [roofer](https://github.com/3DBAG/roofer) reconstruit les bâtiments,
  [PDAL](https://pdal.io) lit la végétation dans le nuage. Pour chaque dalle LiDAR HD de 1 km², il produit un fichier de bâtiments (`.bld`) et un fichier de
  canopée (`.veg`) : environ 2 Mo par dalle en ville, trois minutes de calcul. Ses commandes : `download` (télécharge, reconstruit, convertit),
  `convert` (hors ligne, depuis le cache) et `merge` (rassemble des résultats avec les dalles déjà publiées). Une dalle déjà à jour n'est pas refaite.
- **Données** : [geo-community-data-city3d](https://github.com/vienne-condrieu-agglomeration/geo-community-data-city3d), publiées sur GitHub Pages à
  l'adresse `https://vienne-condrieu-agglomeration.github.io/geo-community-data-city3d`. Neuf dalles autour du centre de Vienne pour commencer. Le
  `index.json` liste les dalles disponibles avec leur taille et leur empreinte (`sha256`), la date d'édition du nuage de l'IGN et les versions des outils.

### Brancher les données dans le module

Dans le Générateur, section « Maquette 3D » de la configuration du module, renseigner **URL des données 3D de la ville** avec l'adresse du **site**
GitHub Pages, sans `/` final : `https://vienne-condrieu-agglomeration.github.io/geo-community-data-city3d`.

!!! warning "Adresse du site, pas du dépôt"
    L'adresse du dépôt (`https://github.com/…`) répond 404 sans les en-têtes qui permettent au navigateur de lire la réponse : les bâtiments et les arbres
    n'apparaissent pas, avec des lignes `[geo-lidar-hd] … ignorés` dans la console. Il faut celle du site, de la forme `https://<organisation>.github.io/<dépôt>`.

Les cases « Bâtiments LoD2 » et « Arbres » apparaissent alors dans le panneau **Maquette**. Le module lit d'abord `index.json` et ne demande que les dalles
qu'il liste ; une dalle sans fichier reste comme sans le réglage, sans message.

### Utiliser vos propres données

Pour d'autres communes ou d'autres dalles, deux possibilités :

1. **Copier le dépôt** `geo-community-data-city3d` (fork), indiquer vos dalles dans `tiles.txt` (une dalle `XXXX-YYYY`, coin nord-ouest en km en Lambert-93,
   ou `around XXXX-YYYY` pour une dalle et ses 8 voisines), activer GitHub Pages (source : GitHub Actions) puis lancer à la main le workflow
   « Données city3d » (*Actions > Run workflow*, avec en option les dalles à produire). Il traite une dalle par job, trois en parallèle, et rassemble le
   résultat avec les dalles déjà publiées (un déploiement Pages remplace tout le site) ;
2. **Lancer l'intégrateur** sur un poste (Python 3, Docker, accès à `data.geopf.fr`), par exemple
   `python3 -I integrator_city3d.py download --around 0846-6494 --output site/`, et déposer le dossier produit sur un serveur web **HTTPS** qui répond avec
   l'en-tête `Access-Control-Allow-Origin` (sans cela, le navigateur bloque la lecture depuis GEO).

!!! note "Limites"
    Fonction en prototype : les bâtiments sont des reconstructions automatiques (toits simplifiés) et les arbres des volumes simples, sans distinction entre
    résineux et feuillus, sans valeur de relevé. À 2 Mo par dalle, la limite de 1 Go de GitHub Pages laisse de la place pour plusieurs centaines de dalles.

## Proposer un intégrateur

Un nouvel intégrateur suit la même convention : un dossier de code et un dépôt de données, une version de format de sortie, une licence de la
source citée dans les données. Voir [Contribuer](contribuer.md) pour proposer l'idée avant d'écrire du code.
