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
- État : objet `S` dans `localStorage` (clé `carnet-seances`). Toute nouvelle clé doit être ajoutée à `EXTRA` (`src/js/10_core6.js`). Version des données `S.v` = 9 (migrations dans `v6Load`, `10_core6.js`).
- Service worker `sw.js` : cache `carnet-v7-1-0`, à changer à chaque version.
- Onglets : Accueil · Calendrier · Nutrition · Outils (Minuteurs, Échauffement, Conseils, Tutos) · Progrès (Mesures, Stats, Records, Skills) + Carnet (`notes`, masqué par défaut, donc lien en haut d'Outils) (`TABS6`, `src/js/30_ui6.js`).
- **v7.2 en cours, non publiée** : l'accueil attend le choix de Diego entre 3 maquettes (voir `dev/PLAN.md`, section v7.2.0). Les maquettes vivent dans `42_hproto.js` / `69_hproto.css` (actives seulement avec `?hp=a|b|c`) : à remplacer par la version choisie.

### Modules importants
| Fichier | Rôle |
|---|---|
| `src/app.js` | routeur, calendrier (vues mois et semaine, détail du jour), formulaire de séance ; `scene()` délègue à `illScene()` |
| `src/js/10_core6.js` | thèmes (`THEMES`, dont les 4 saisons), `applyAcc()`, migrations, `EXTRA` |
| `src/js/20_chars.js` | moteur des persos (style « Athlète ») : `charSvg()`, poses `CH_POSE`, primitives `chLimb`, `chP`… |
| `src/js/25_icon6.js` | `charOf()` / `myChar()` (perso de l'utilisateur), `seaOf()` (tenue de saison) |
| `src/js/40_home6.js`, `41_home7.js` | accueil : cartes `HCARDS`, carte « Mesures » (`poidsCard`, `bwSheet` = feuille « Nouvelle mesure »), poids (`bwTrend`, `bwStatus`), icônes `note`, `pin` |
| `src/js/42_hproto.js` | maquettes de l'accueil (temporaire, `?hp=a|b|c`) |
| `src/js/56_ill7.js` | **système central des illustrations de saison** (voir plus bas) |
| `src/js/57_season7.js` | décor au trait des thèmes de saison (glyphes, liseré de la barre du bas), particules `#fx7`, `sea7Sync()` |
| `src/js/58_foods.js` | base d'aliments (100 aliments, valeurs pour 100 g CIQUAL/USDA, portions) : aide à la saisie et lecture des anciennes entrées |
| `src/js/62_nutri.js` | nutrition « carnet » (v7.2) |
| `src/js/64_notes.js` | Carnet de notes (`#carnet`) |
| `src/js/66_mesures.js` | page Mesures (`#mesures`, 1er sous-onglet de Progrès) |
| `src/js/70_stats6.js` | Progrès, « Poids et mensurations » (`renderBW`, consigne `#mzTip`) |
| `src/js/85_share6.js` | cartes de partage, `exFam()` / `mainEx()` (famille d'exercice) |
| `src/js/94_dict.js`, `95_i18n.js` | traductions EN/NL |
| `src/css/66_v7.css`, `67_nutri.css`, `68_v71.css`, `70_v72.css` | styles v7 (saisons, nutrition, scènes, mesures, carnet, réglages compacts, été v7.2) |

### Système d'illustrations de saison (v7.1, `src/js/56_ill7.js`)
- `seaNow()` = saison active : celle du thème de saison (`printemps`, `ete`, `automne`, `hiver`, ou « Selon la saison ») ; avec un autre thème (Nuit, Minimal…), la **saison réelle** (déc.-fév. hiver, mars-mai printemps, juin-août été, sept.-nov. automne). Choix de Diego.
- `illScene(lieu,{who,fam})` : décor large 160 x 100 (cartes de séance, semaine, accueil, partages). Street propre à chaque saison ; garage et salle montrent la saison par la porte ou les fenêtres. `who:1` ajoute le perso.
- `illTile('train'|'rest',{place,fam})` : scène portrait 48 x 88 des cases du calendrier, servie en `<img>` (data URL mise en cache par clé saison | type | lieu | exercice | perso).
- `illDay(k)` : séance → entraînement (tractions, dips, squat ; **salle = développé couché**, pose `CH_POSE.bench`) ; repos → transat (été), **pique-nique** (printemps), couverture et feuilles (automne), sac de couchage près d'un bonhomme de neige (hiver), avec « Zzz » ; jour vide → rien.
- `illGround()` (sol du perso de l'accueil), `i7bandSvg()` (paysage coloré au-dessus de la barre d'onglets, variable CSS `--sband`).
- Règle : **aucun dessin ne dépend de la date de la séance** ; tout passe par `seaNow()`. Chaque élément porte `data-sea` (utilisé par les tests).
- Printemps varié (demande de Diego) : pommiers en fleurs, arbres verts, tulipes, papillons, pas seulement des cerisiers.
- L'attribut `html[data-season]` n'existe qu'avec un thème de saison (jamais vide : les règles CSS testent sa présence).

### Nutrition « carnet » (v7.2, `src/js/62_nutri.js`)
- Principe de Diego : **l'appli n'est pas un coach**. Elle enregistre et affiche ; elle ne calcule ni ne recommande d'objectif. Ne pas réintroduire de calcul de besoins, d'idées de repas, de conseils automatiques ni de phrases « dans ta cible ».
- Page : jour (flèches + sélecteur de date), compteurs Kcal et Prot (mangé / objectif / reste, deux barres), journal (toucher = modifier, retirer avec annulation), ajout rapide (nom, quantité, kcal, prot ; la base d'aliments ne sert qu'à préremplir selon les grammes), raccourcis en un geste (favoris, repas enregistrés v7.0, récents), jours précédents (7 ou 30 j + moyenne), boutons « Mes objectifs » et « Carnet nutrition ».
- Données `S.nut` : `kG`, `pG` (objectifs saisis, 0 = aucun), `days[date] = {b,l,d,s,w}` (rangement par moment, non affiché), `pins` (favoris `{n,q,k,p}`). Entrée : `{f:'q', n, q, g:100, v:[kcal, prot, 0, 0, 0], t}`. Les anciennes clés (goal, sex, age, ht, act, tf, auto, tgt, fav, my, meals, rec) restent dans les données.
- Pas d'API externe (choix de Diego : marche hors ligne).

### Carnet de notes (v7.2, `src/js/64_notes.js`)
- `S.carnet = [{id, c, t, b, pin, d, u}]`, catégories `nut`, `train`, `ex`, `prog`, `misc`. Aussi simple qu'un bloc-notes : créer, modifier, supprimer (annulation), épingler, filtrer, rechercher. Enregistrement pendant la frappe et à la fermeture de la feuille. Les notes du guide des exercices (`S.notes[exercice]`) s'affichent dans « Exercices » sans être copiées. Ne pas en faire un système complexe.

### Mesures (v7.2, `src/js/66_mesures.js`)
- Poids dans `S.bw`, tour de taille dans `S.meas.taille` (`[{d, v}]`). Page Mesures (1er sous-onglet de Progrès, `#mesures`) : derniers chiffres, « Nouvelle mesure », consigne exacte « Pèse-toi le matin à jeun, après être allé aux toilettes et avant de manger ou de boire. », courbe à l'échelle du temps, historique modifiable. Carte « Mesures » de l'accueil → `#mesures`. Aucun conseil automatique.

### Voix (v7.2)
- Ne jamais retrouver une voix par son nom : sur iPhone, les mêmes noms existent dans plusieurs langues (cause des voix allemandes). Toujours `pickVoice()` (`app.js`) : voix de la langue de l'appli seulement, identifiant `S.voiceU` (voiceURI), sinon meilleure voix ; texte dit passé par `trS()`.

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
cd dev && python3 t16.py                                # tests Playwright (~6 min), voir le total dans dev/PLAN.md
```
- Playwright (Python) : `pip install playwright` puis `playwright install chromium` si aucun Chrome n'est installé ; les outils utilisent `/usr/bin/google-chrome` s'il existe.
- Captures (dans `dev/tools/out/`, ignoré par git) : `python3 dev/tools/shots_seasons.py 390 844 printemps ete automne hiver nuit` (planche par thème : accueil, calendrier, nutrition, outils, progrès, idées) ; `python3 dev/tools/shots_calendar.py 375 667` (calendrier mois, repos, semaine) ; `python3 dev/tools/preview_scenes.py` (planche de toutes les scènes par saison).
- Toujours vérifier en **390 x 844 et 375 x 667**, dans les 4 saisons et en Nuit / Minimal, puis regarder les images.
- Les tests utilisent la date du jour (`TK0`, `TK`) : plus de date en dur.
- Captures : `shots_seasons.py` montre accueil, calendrier, nutrition, mesures, carnet, outils.

## Publier (seulement avec l'accord de Diego)
1. Monter la version à 4 endroits : `APP_V` (`dev/src/app.js`), `APP6` (`dev/src/js/10_core6.js`), `version.json`, cache `C` de `sw.js` (`carnet-vX-Y-Z`).
2. `python3 dev/build.py`, tests, captures ; supprimer les `dev/t16_*.png`.
3. Ajouter une section à `dev/PLAN.md`.
4. Commit en français, puis `git push origin main` (ne pas ajouter `dev/art/icons/`, dossier intermédiaire non suivi).
5. Vérifier `https://ardedi-pixel.github.io/Carnet/version.json?v=<aléatoire>` (le cache de github.io peut être en retard), puis donner le lien et la version entre guillemets.
- Sur iPhone, l'appli se met à jour en la fermant puis en la rouvrant.

## Décisions de Diego (à respecter)
- v7.2 : appli personnelle, pas de coach : objectifs nutrition saisis par l'utilisateur (Kcal et Prot seulement) ; carnet de notes ; Mesures en 1er sous-onglet de Progrès avec la consigne de pesée ; Outils et Réglages gardés tels quels ; été plus « mer et soleil », hiver inchangé ; nouvel accueil seulement après validation d'une des maquettes.
- v7.1 : système central saison × activité ; thème sans saison = saison réelle ; salle = développé couché ; repos du printemps = pique-nique ; printemps varié ; nutrition en carnet simple ; mesures (poids + tour de taille) mises en avant.
- v7.0 : accueil minimaliste sans répétitions (perso, Mesures, Nutrition du jour, une seule carte « À la une » ; les autres cartes restent activables dans Réglages) ; onglet Nutrition à la place de « Plus » ; décor de saison « Mix ».
- v6.3 : persos en style « Athlète » (adultes, sobres, contour fin) ; robot et ninja retirés ; animaux gardés en version adulte ; animations toujours actives par défaut ; ton « Sobre » sans émojis ; pas de vibrations.
- Idées D (dossier d'idées) : oui pour D1, D3, D7, D9, D10, D13, D14 ; non pour D2, D4, D5, D6, D8, D11, D12.
