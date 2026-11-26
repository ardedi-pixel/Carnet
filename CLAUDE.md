# Carnet de séances : instructions pour Claude Code

Ce fichier est lu automatiquement au début de chaque session. Il résume tout ce qu'il faut savoir pour continuer le projet au même niveau. L'historique détaillé des versions est dans `dev/PLAN.md` ; en cas de doute, le code fait foi.

## Le projet et la personne
- PWA de suivi d'entraînement (street workout, garage, salle) de **Diego**, kiné à Bruxelles. Utilisée surtout sur iPhone, depuis l'écran d'accueil. Il la fait tester à des amis et à un client potentiel.
- En ligne : https://ardedi-pixel.github.io/Carnet/ (GitHub Pages, branche `main`).
- Langue : français (l'appli est aussi traduite en anglais et en néerlandais).
- Diego n'est pas développeur professionnel : expliquer les choix importants en une phrase, sans jargon.

## Comment travailler avec Diego
- **Réponses très courtes** (il a demandé le « mode caveman ») tant qu'il ne demande pas autre chose.
- Rôle attendu : développeur web senior, designer UI/UX, product designer, architecte, QA. Être force de proposition ; si une meilleure approche existe, la recommander.
- **Clarifier avant de coder** quand une demande est vague ou que plusieurs directions sont possibles : 2 à 4 questions avec des propositions concrètes et une option recommandée. Ne pas poser de question inutile quand c'est clair.
- Pour un travail visuel, montrer un brouillon tôt (planche d'images) **et continuer le travail pendant qu'il regarde** ; corriger en route selon ses retours. Ne jamais s'arrêter en attendant sa réponse.
- Design : minimaliste, moderne, cohérent, pensé mobile d'abord. Pas de doublons, pas d'éléments décoratifs gratuits, pas d'émojis ni de look enfantin.
- **Ne jamais commit ni push sans son accord explicite.** Quand il l'a donné, finir par le lien et la version entre guillemets : `https://ardedi-pixel.github.io/Carnet/ « 7.1.0 »`.
- Ne jamais dire « testé » sans l'avoir réellement testé (tests automatiques + captures).
- Tenir `dev/PLAN.md` à jour à chaque version (section « vX.Y.Z »).

## Architecture
- Appli en **un seul fichier** : `index.html` à la racine est **généré**. Ne jamais le modifier à la main : modifier `dev/src/` puis lancer `python3 dev/build.py`.
- `dev/build.py` assemble : `src/head.html` + `src/style.css` + `src/css/*.css` (ordre alphabétique) + `src/body.html` + `src/app.js`, où les modules `src/js/*.js` (ordre alphabétique) sont insérés au marqueur `/*@@MODS@@*/`.
- Tout le JavaScript est dans **un seul bloc `{ … }`** : les `const`/`let` d'un module sont visibles des autres modules, mais pas depuis la console ou `page.evaluate` ; les déclarations `function` deviennent globales (testables depuis Playwright). Les `const` d'un module ne sont prêts qu'une fois ce module exécuté : à l'appel au chargement, attention à l'ordre des fichiers.
- État : objet `S` dans `localStorage` (clé `carnet-seances`). Toute nouvelle clé doit être ajoutée à `EXTRA` (`src/js/10_core6.js`). Version des données `S.v` = 8 (migrations dans `10_core6.js`).
- Service worker `sw.js` : cache `carnet-v7-1-0`, à changer à chaque version.
- Onglets : Accueil · Calendrier · Nutrition · Outils (Minuteurs, Échauffement, Conseils, Tutos) · Progrès (`TABS6`, `src/js/30_ui6.js`).

### Modules importants
| Fichier | Rôle |
|---|---|
| `src/app.js` | routeur, calendrier (vues mois et semaine, détail du jour), formulaire de séance ; `scene()` délègue à `illScene()` |
| `src/js/10_core6.js` | thèmes (`THEMES`, dont les 4 saisons), `applyAcc()`, migrations, `EXTRA` |
| `src/js/20_chars.js` | moteur des persos (style « Athlète ») : `charSvg()`, poses `CH_POSE`, primitives `chLimb`, `chP`… |
| `src/js/25_icon6.js` | `charOf()` / `myChar()` (perso de l'utilisateur), `seaOf()` (tenue de saison) |
| `src/js/40_home6.js`, `41_home7.js` | accueil : cartes `HCARDS`, carte « Mesures » (`poidsCard`, `bwSheet`), poids (`bwTrend`, `bwStatus`) |
| `src/js/56_ill7.js` | **système central des illustrations de saison** (voir plus bas) |
| `src/js/57_season7.js` | décor au trait des thèmes de saison (glyphes, liseré de la barre du bas), particules `#fx7`, `sea7Sync()` |
| `src/js/58_foods.js` | base d'aliments (100 aliments, valeurs pour 100 g CIQUAL/USDA, portions, critères de qualité `NQ`, modèles de repas `NMEALS`) |
| `src/js/62_nutri.js` | nutrition « carnet simple » |
| `src/js/70_stats6.js` | Progrès, « Poids et mensurations » (`renderBW`, consigne `#mzTip`) |
| `src/js/85_share6.js` | cartes de partage, `exFam()` / `mainEx()` (famille d'exercice) |
| `src/js/94_dict.js`, `95_i18n.js` | traductions EN/NL |
| `src/css/66_v7.css`, `67_nutri.css`, `68_v71.css` | styles v7 (saisons, nutrition, scènes, mesures) |

### Système d'illustrations de saison (v7.1, `src/js/56_ill7.js`)
- `seaNow()` = saison active : celle du thème de saison (`printemps`, `ete`, `automne`, `hiver`, ou « Selon la saison ») ; avec un autre thème (Nuit, Minimal…), la **saison réelle** (déc.-fév. hiver, mars-mai printemps, juin-août été, sept.-nov. automne). Choix de Diego.
- `illScene(lieu,{who,fam})` : décor large 160 x 100 (cartes de séance, semaine, accueil, partages). Street propre à chaque saison ; garage et salle montrent la saison par la porte ou les fenêtres. `who:1` ajoute le perso.
- `illTile('train'|'rest',{place,fam})` : scène portrait 48 x 88 des cases du calendrier, servie en `<img>` (data URL mise en cache par clé saison | type | lieu | exercice | perso).
- `illDay(k)` : séance → entraînement (tractions, dips, squat ; **salle = développé couché**, pose `CH_POSE.bench`) ; repos → transat (été), **pique-nique** (printemps), couverture et feuilles (automne), sac de couchage près d'un bonhomme de neige (hiver), avec « Zzz » ; jour vide → rien.
- `illGround()` (sol du perso de l'accueil), `i7bandSvg()` (paysage coloré au-dessus de la barre d'onglets, variable CSS `--sband`).
- Règle : **aucun dessin ne dépend de la date de la séance** ; tout passe par `seaNow()`. Chaque élément porte `data-sea` (utilisé par les tests).
- Printemps varié (demande de Diego) : pommiers en fleurs, arbres verts, tulipes, papillons, pas seulement des cerisiers.
- L'attribut `html[data-season]` n'existe qu'avec un thème de saison (jamais vide : les règles CSS testent sa présence).

### Nutrition « carnet simple » (v7.1, `src/js/62_nutri.js`)
- Retour du client : il suit surtout **Kcal et Prot**. Page : compteurs Kcal et Prot (mangé / objectif / reste), liste du jour (aliment, quantité, kcal, prot, total), ajout rapide (suggestions de la base avec calcul selon les grammes, ou saisie libre), détails repliés (glucides, lipides, fibres, eau), boutons Bibliothèque et Idées de repas.
- Données : `S.nut` (objectif, profil, `days[date] = {b,l,d,s,w}`, favoris, aliments perso `my`, repas `meals`, récents). Les repas restent rangés par créneau horaire dans les données mais ne sont plus affichés. Saisie libre : `{f:'q', n, q, g:100, v:[kcal, prot, 0, 0, 0]}`.
- Besoins : Mifflin-St Jeor × activité (1,2 / 1,3 / 1,45 / 1,6 + 0,025 par séance hebdo, max 2) × objectif (prise de masse sèche 1,1 / maintien 1 / sèche 0,8). Protéines 1,8 / 1,8 / 2,2 g/kg ; lipides max(0,7 g/kg ; 25 / 30 / 25 % des kcal) ; glucides = reste ; fibres max(25 ; 14 g/1000 kcal) ; eau 35 ml/kg. Présentés comme estimation de départ, modifiables.
- Pas d'API externe (choix de Diego : base intégrée + ajout manuel, marche hors ligne). Un scan de code-barres demanderait Open Food Facts et internet.

### Mesures
- Poids dans `S.bw`, tour de taille dans `S.meas.taille` (`[{d, v}]`). Carte « Mesures » sur l'accueil, feuille « Nouvelle mesure » (poids et tour de taille en une fois) avec la consigne : le matin, à jeun, après être allé aux toilettes, avant de manger ou de boire, dans les mêmes conditions.

## Traductions (EN / NL)
- Le français est la source. Un `MutationObserver` traduit les nœuds de texte et les attributs (`placeholder`, `aria-label`, `title`) avec `trS()`.
- `shape()` remplace dans la clé : le prénom par `{N0}`, les noms de mois et de jours par `{M0}`/`{D0}`, les nombres par `{0}`, `{1}`… Exemple de clé : `"Reste {0} g"`.
- Une phrase construite par morceaux ne se traduit pas : mettre chaque morceau dans son propre élément, ou ajouter la phrase complète avec toutes ses variantes de signe (`+`, `−`, `±`).
- Ajouter : un fichier JSON `{"texte FR": ["EN", "NL"]}` puis `python3 dev/tools/i18n_set.py fichier.json` (ajoute ou corrige dans `src/js/94_dict.js` et `dev/i18n/extra.json`). Vérifier : `python3 dev/tools/i18n_collect.py dev/tools/out/manque.json` (parcourt l'appli en anglais et liste les textes restés en français ; « Comté » est normal).
- Anglais américain (fiber, color, favorite). Guillemets “ ” dans les traductions.

## Construire, tester, vérifier
```bash
python3 dev/build.py                                    # génère index.html
python3 -m http.server 8768 --bind 127.0.0.1            # à la racine du dépôt, dans un autre terminal
cd dev && python3 t16.py                                # 154 tests Playwright (~5 min), tous OK en v7.1.0
```
- Playwright (Python) : `pip install playwright` puis `playwright install chromium` si aucun Chrome n'est installé ; les outils utilisent `/usr/bin/google-chrome` s'il existe.
- Captures (dans `dev/tools/out/`, ignoré par git) : `python3 dev/tools/shots_seasons.py 390 844 printemps ete automne hiver nuit` (planche par thème : accueil, calendrier, nutrition, outils, progrès, idées) ; `python3 dev/tools/shots_calendar.py 375 667` (calendrier mois, repos, semaine) ; `python3 dev/tools/preview_scenes.py` (planche de toutes les scènes par saison).
- Toujours vérifier en **390 x 844 et 375 x 667**, dans les 4 saisons et en Nuit / Minimal, puis regarder les images.
- Connu : la section B de `t16.py` contient deux dates en dur (`2026-11-26`) qui échouent un autre jour ; à rendre dynamiques comme `TK` dans les sections G à I.

## Publier (seulement avec l'accord de Diego)
1. Monter la version à 4 endroits : `APP_V` (`dev/src/app.js`), `APP6` (`dev/src/js/10_core6.js`), `version.json`, cache `C` de `sw.js` (`carnet-vX-Y-Z`).
2. `python3 dev/build.py`, tests, captures ; supprimer les `dev/t16_*.png`.
3. Ajouter une section à `dev/PLAN.md`.
4. Commit en français, puis `git push origin main` (ne pas ajouter `dev/art/icons/`, dossier intermédiaire non suivi).
5. Vérifier `https://ardedi-pixel.github.io/Carnet/version.json?v=<aléatoire>` (le cache de github.io peut être en retard), puis donner le lien et la version entre guillemets.
- Sur iPhone, l'appli se met à jour en la fermant puis en la rouvrant.

## Décisions de Diego (à respecter)
- v7.1 : système central saison × activité ; thème sans saison = saison réelle ; salle = développé couché ; repos du printemps = pique-nique ; printemps varié ; nutrition en carnet simple ; mesures (poids + tour de taille) mises en avant.
- v7.0 : accueil minimaliste sans répétitions (perso, Mesures, Nutrition du jour, une seule carte « À la une » ; les autres cartes restent activables dans Réglages) ; onglet Nutrition à la place de « Plus » ; décor de saison « Mix ».
- v6.3 : persos en style « Athlète » (adultes, sobres, contour fin) ; robot et ninja retirés ; animaux gardés en version adulte ; animations toujours actives par défaut ; ton « Sobre » sans émojis ; pas de vibrations.
- Idées D (dossier d'idées) : oui pour D1, D3, D7, D9, D10, D13, D14 ; non pour D2, D4, D5, D6, D8, D11, D12.
