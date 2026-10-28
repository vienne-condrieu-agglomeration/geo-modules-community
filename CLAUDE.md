# CLAUDE.md — geo-modules-community

Site de documentation des modules d'extension GEO de Vienne Condrieu Agglomération, construit avec [Zensical](https://zensical.org/) et publié par
GitHub Pages. Les modules eux-mêmes vivent dans leurs dépôts `geo-module-<nom>` (alimentés depuis un dépôt source interne) : **ce dépôt ne contient
aucun code de module**.

## Structure

```
docs/                       Pages écrites à la main : index, installer, contribuer, gouvernance, developper/
docs/modules/               GÉNÉRÉ par scripts/collect_modules.py, non versionné : ne jamais l'éditer
docs/javascripts/external-links.js   Ouvre les liens externes dans un nouvel onglet (chargé par extra_javascript)
docs/javascripts/module-preview.js   Aperçus du catalogue : image fixe, GIF animé au survol seulement
docs/stylesheets/extra.css  Couleurs du thème (bleu de la favicon)
scripts/modules.json        Modules affichés (repo + slug)
scripts/collect_modules.py  Lit fiche, README, CHANGELOG et GUIDE-DEV de chaque dépôt de module
scripts/check_links.py      Contrôle les liens internes, ancres et liens externes du site construit
zensical.toml               Configuration ; la zone « # >>> modules » … « # <<< modules » du nav est réécrite par le script
requirements.txt            Version de Zensical figée
.github/workflows/docs.yml  Construction et déploiement (Pages, source « GitHub Actions »)
.github/workflows/check.yml Construction sans déploiement à chaque PR
.github/workflows/links.yml Contrôle hebdomadaire des liens (scripts/check_links.py)
.github/dependabot.yml     Mises à jour mensuelles et groupées (pip, actions), assignées à allfab
.github/ISSUE_TEMPLATE/    Modèles d'issue du site (proposer un module, corriger le site) ; PULL_REQUEST_TEMPLATE.md à côté
scripts/labels.json         Labels communs ; scripts/sync_labels.sh les applique aux dépôts (action sur GitHub : demander l'accord)
```

## Commandes

```bash
python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt
python scripts/collect_modules.py    # génère docs/modules/ et met à jour le nav de zensical.toml (accès réseau à GitHub)
zensical serve                       # prévisualisation sur http://localhost:8000
zensical build --clean               # génère site/ (non versionné)
```

## Règles

- **Navigation explicite** : une page absente du `nav` de `zensical.toml` n'apparaît pas dans le menu. Une nouvelle page écrite à la main s'ajoute
  au `nav` ; les pages des modules sont gérées par le script.
- **Liens externes dans un nouvel onglet** : tout lien vers un autre nom d'hôte que celui du site (documentation de l'éditeur, GitHub, sites tiers, pages
  générées des modules comprises) s'ouvre dans un nouvel onglet (`target="_blank"`, `rel="noopener noreferrer"`), posé par `docs/javascripts/external-links.js`.
  Ne pas ajouter `{ target="_blank" }` à la main ni modifier ce comportement. Les liens **internes** restent dans l'onglet courant. Pour écrire un lien,
  utiliser le Markdown ordinaire : `[texte](https://…)`.
- **Vérifier les liens avant de pousser** : `zensical build --clean && python scripts/check_links.py`. Les liens internes, les ancres et les liens externes
  morts (404, 410, domaine introuvable) font échouer le script ; les autres échecs (403, 429, délai, certificat incomplet côté serveur distant) sont des
  avertissements. Le même contrôle tourne chaque semaine dans `links.yml`.
- **Mises à jour du site** : push sur `main` (déploiement), construction sans déploiement à chaque PR, reconstruction hebdomadaire (lundi) et manuelle pour
  reprendre les modules publiés entre-temps. Les PR de Dependabot (mensuelles, groupées) portent un préfixe `build(deps)` ou `ci(deps)` : leur description
  commence par une majuscule (« Bump … »), seule exception tolérée à la convention de commits.
- **Ajouter un module** : une entrée dans `scripts/modules.json` (dépôt public avec `src/plugin.geoext.json` et `README.md`), puis relancer le script.
- **Version de Zensical figée** dans `requirements.txt` : le projet évolue vite. La changer volontairement, après un `zensical build` sans avertissement.
- Les pages `developper/` sont la version publique des retours d'expérience : pas d'identifiants, pas de chemins de services internes, pas de noms de
  modules non publiés. Marquer ❓ ce qui n'est pas validé sur un GEO.
- Langue : texte du site en français ; code et noms de fichiers en anglais ou en slug ASCII.
- Shell : `cp` et `rm` sont aliasés en interactif → `command cp -f`, `rm -f`.
- Ne pas pousser ni créer de ressource GitHub sans accord explicite de l'utilisateur ; jamais de force push.

## Convention de commits (Conventional Commits 1.0)

Tous les commits suivent [Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/) :

```
<type>(<portée>): <description>

[corps optionnel : pourquoi, symptôme, cause, correction]

[pied optionnel : BREAKING CHANGE, refs, Co-Authored-By]
```

- **Type** : `feat` (nouvelle page ou fonctionnalité du site), `fix` (correction de contenu, de lien ou de build), `docs` (README, CLAUDE.md), `refactor`,
  `build` (Zensical, dépendances, script), `ci` (workflow GitHub Actions), `chore`, `style`, `revert`.
- **Portée** : `site` (config, thème, navigation), `docs` (pages de `docs/`), `scripts` (collecte des modules), `ci`, `deps`, ou le nom du module concerné
  (`panoramax`, `compare-swipe`) pour un contenu qui lui est propre.
- **Description** : en français, à l'impératif présent, sans majuscule initiale ni point final, **72 caractères au plus** (portée comprise).
- **Changement incompatible** (URL de page modifiée, clé de `modules.json` renommée) : `!` après la portée et un pied `BREAKING CHANGE: …`.
- Un commit = un changement logique, sans jeton ni secret.
- Pied de commit quand il est généré avec Claude : `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

Exemples :

```
feat(docs): ajouter la page sur la mise à jour d'un module
fix(scripts): réécrire les liens relatifs des README vers les pages du site
build(deps): passer Zensical à la version 0.0.80
ci(site): déclencher la reconstruction à la publication d'un module
docs(docs): documenter l'ajout d'un module au site
```
