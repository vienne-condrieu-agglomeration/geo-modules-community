# geo-modules-community

Site de documentation des [modules d'extension GEO](https://vienne-condrieu-agglomeration.github.io/geo-modules-community/) de Vienne Condrieu
Agglomération : catalogue, installation, retours d'expérience de développement et contribution.

Le site est construit avec [Zensical](https://zensical.org/) et publié par GitHub Pages.

## Structure

```
docs/                    Pages écrites à la main : accueil, installer, contribuer, gouvernance, developper/
docs/modules/            Pages de chaque module : GÉNÉRÉES (non versionnées)
scripts/modules.json     Liste des modules affichés
scripts/collect_modules.py   Lit le dépôt de chaque module (fiche, README, CHANGELOG, GUIDE-DEV) et génère docs/modules/
zensical.toml            Configuration du site
requirements.txt         Version de Zensical (figée)
.github/workflows/docs.yml   Construction et déploiement
```

## Travailler en local

```bash
python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
python scripts/collect_modules.py     # génère docs/modules/ (accès réseau à GitHub)
zensical serve                        # http://localhost:8000 (utiliser le Zensical du .venv : la version est figée)
```

Contrôler les liens du site construit :

```bash
zensical build --clean
python scripts/check_links.py         # code de sortie 1 en cas de lien interne ou externe mort
```

## Ajouter un module au site

Ajouter une entrée `{ "repo": "geo-module-<nom>", "slug": "<nom>" }` dans `scripts/modules.json`. Le dépôt du module doit être public et contenir
`src/plugin.geoext.json` et `README.md` ; `CHANGELOG.md` et `GUIDE-DEV.md` sont repris s'ils existent.

## Le script de collecte (`scripts/collect_modules.py`)

Il génère les pages « modules » du site à partir des dépôts GitHub des modules. Il tourne avant `zensical build`, en local comme dans le workflow.
Il n'utilise que la bibliothèque standard de Python.

1. Lit `scripts/modules.json` (dépôts, slugs, organisation, branche).
2. Récupère pour chaque module, sur `raw.githubusercontent.com` : `src/plugin.geoext.json` et `README.md` (obligatoires), `CHANGELOG.md` et
   `GUIDE-DEV.md` (facultatifs).
3. Écrit dans `docs/modules/<slug>/` : `index.md` (en-tête avec version, GEO minimum, licence et boutons ZIP / dépôt / issues, puis le README),
   `changelog.md` et `guide-dev.md` s'ils existent.
4. Réécrit les liens du README : liens vers `CHANGELOG.md` et `GUIDE-DEV.md` rendus internes au site, autres liens et images relatifs rendus absolus
   vers le dépôt. Les blocs de code ne sont pas modifiés.
5. Génère `docs/modules/index.md`, le catalogue en cartes : accroche (`accroche` de `modules.json`, sinon début du README), version, GEO
   minimum, bouton de téléchargement et, si le dépôt contient `docs/apercu.gif`, un aperçu animé (le même GIF s'affiche en
   tête du README du module, donc de sa page sur le site).
6. Met à jour le `nav` de `zensical.toml`, **uniquement** entre les marqueurs `# >>> modules` et `# <<< modules`.

À savoir :

- `docs/modules/` est **effacé et recréé** à chaque exécution et n'est pas versionné : ne jamais l'éditer à la main.
- Le script s'arrête au moindre échec sur un fichier obligatoire (dépôt introuvable, erreur réseau) : mieux vaut ne rien publier qu'un site à moitié construit.
- Il modifie `zensical.toml` (zone entre les marqueurs) : après l'ajout d'un module, ce fichier apparaît dans `git diff` et doit être commité.
- Il lit la branche indiquée dans `modules.json` (`main`), c'est-à-dire le dernier état poussé, pas la dernière release.

## Mettre à jour le site

- **Déploiement** : chaque push sur `main` reconstruit et publie le site.
- **Demandes de fusion** : le site est construit sans être déployé (`check.yml`), pour détecter une erreur avant la fusion.
- **Pages des modules** : le workflow les régénère chaque lundi, et à la demande (onglet *Actions*, « Run workflow »). Elles reprennent le dernier
  état de la branche `main` de chaque module.
- **Liens** : `links.yml` construit le site et lance `scripts/check_links.py` chaque lundi ; un lien interne ou externe mort fait échouer le
  workflow, ce qui prévient par mail.
- **Dépendances** : Dependabot ouvre chaque mois une demande de fusion groupée pour Zensical et pour les actions GitHub, assignée à `allfab` ; la
  construction en PR vérifie qu'elles passent.
- Réglage requis une fois : *Settings > Pages > Source : GitHub Actions*.

## Modèles d'issue, de PR et labels

- Ce dépôt a ses modèles : *Proposer un nouveau module*, *Corriger ou améliorer le site*, et un modèle de demande de fusion (`.github/`).
- Les modèles des **dépôts de modules** (*Signaler un problème*, *Proposer une fonctionnalité*, demande de fusion) vivent dans le dépôt
  `vienne-condrieu-agglomeration/.github` (dossier `.github/ISSUE_TEMPLATE/` de ce dépôt) : ils s'appliquent par défaut à tout dépôt de l'organisation
  qui n'a pas les siens. Un label demandé par un modèle doit exister dans le dépôt `.github` **et** dans chaque dépôt qui l'utilise.
- Les labels communs sont décrits dans `scripts/labels.json` ; `scripts/sync_labels.sh organisation/depot …` les crée ou les met à jour
  (nécessite `gh auth login`, agit sur GitHub). À lancer aussi sur `vienne-condrieu-agglomeration/.github`.

## Licence

Contenu sous [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/deed.fr), code des scripts sous GPL-3.0-or-later.
