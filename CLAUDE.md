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
- Comportement d'appli (v7.3.1) : pas de sélection de texte ni de menu au long appui (`body{user-select:none;-webkit-touch-callout:none}`), sauf champs de saisie et code de transfert.
- **Ne jamais commit ni push sans son accord explicite.** Quand il l'a donné, finir par le lien et la version entre guillemets : `https://ardedi-pixel.github.io/Carnet/ « 7.6.0 »`.
- Ne jamais dire « testé » sans l'avoir réellement testé (tests automatiques + captures).
- Tenir `dev/PLAN.md` à jour à chaque version (section « vX.Y.Z »).

## Architecture
- Appli en **un seul fichier** : `index.html` à la racine est **généré**. Ne jamais le modifier à la main : modifier `dev/src/` puis lancer `python3 dev/build.py`.
- `dev/build.py` assemble : `src/head.html` + `src/style.css` + `src/css/*.css` (ordre alphabétique) + `src/body.html` + `src/app.js`, où les modules `src/js/*.js` (ordre alphabétique) sont insérés au marqueur `/*@@MODS@@*/`.
- Tout le JavaScript est dans **un seul bloc `{ … }`** : les `const`/`let` d'un module sont visibles des autres modules, mais pas depuis la console ou `page.evaluate` ; les déclarations `function` deviennent globales (testables depuis Playwright). Les `const` d'un module ne sont prêts qu'une fois ce module exécuté : à l'appel au chargement, attention à l'ordre des fichiers.
- État : objet `S` dans `localStorage` (clé `carnet-seances`). Toute nouvelle clé doit être ajoutée à `EXTRA` (`src/js/10_core6.js`). Version des données `S.v` = 10 (migrations dans `v6Load`, `10_core6.js`).
- Service worker `sw.js` : cache `carnet-v7-6-0`, à changer à chaque version (le cache `carnet-ics`, fichier d'agenda des compléments, est gardé).
- Onglets : Accueil · Calendrier (Mois, Semaine, Compléments) · Nutrition (Repas, Compléments) · Outils (Minuteurs, Échauffement, Conseils, Tutos) · Progrès (Mesures, Stats, Records, Skills) + Carnet (`notes`, masqué par défaut, donc lien en haut d'Outils) (`TABS6`, `src/js/30_ui6.js`).
- **v7.6.0 publiée** (fondations : traductions sûres et vérifiées dans le code, néerlandais sans anglais, messages plus courts, animation d'entrée raccourcie, sauvegarde automatique avec historique, fichier, aperçu et fusion) ; chantier en cours par étapes : 7.7 planificateur, 7.8 mode séance + analyse + bibliothèque, 7.9+ analyses avancées (voir `dev/PLAN.md` v7.6.0) ; v7.5.0 : compléments alimentaires (cycles ON/OFF automatiques, routine du jour, rappels, calendrier dédié, historique, stock, agenda du téléphone) ; v7.4.0 : plus de sélection de texte, iPhone et Android, tutoriel d'installation, partage par lien, traductions complètes, nouvelles mensurations, minuteur indépendant ; détails dans `dev/PLAN.md`. Accueil choisi par Diego : piste C « Immersif » + widgets de la piste B (`43_home72.js`) ; la scène suit le lieu le plus fréquent (`homePlace()`, réglage `S.hscn`).

### Modules importants
| Fichier | Rôle |
|---|---|
| `src/app.js` | routeur, calendrier (vues mois et semaine, détail du jour), formulaire de séance ; `scene()` délègue à `illScene()` |
| `src/js/10_core6.js` | thèmes (`THEMES`, dont les 4 saisons), `applyAcc()`, migrations, `EXTRA` |
| `src/js/15_backup.js` | **sauvegarde (v7.6)** : sauvegardes automatiques IndexedDB `carnet-bk` (`bkSnap()`, `bkList()`, `bkGet()`, `bkPrune()`), export `.json` (`bkExport()`), import avec aperçu (`bkParse()`, `bkPreview()`), **fusion** `bkMerge()` (rien supprimé, le plus récent gagne si connu par `u`/`t`, sinon ce téléphone ; langue du téléphone gardée), `bkApply('merge'|'replace')` annulable, alerte d'échec d'écriture `bkSaveFail()`, données retrouvées au démarrage `bkBoot()` |
| `src/js/12_plat.js` | **iPhone / Android** : `PLAT` (ios, and, br, inapp), `isStandalone()`, classes `html.ios`/`html.android`, long appui bloqué hors champs, bouton Retour d'Android qui ferme les feuilles |
| `src/js/20_chars.js` | moteur des persos (style « Athlète ») : `charSvg()`, poses `CH_POSE`, primitives `chLimb`, `chP`… ; `charAnim(o,dur,p1,p2,once)` (once = une répétition lancée par `beginElement()`) ; jambes libres `P.lp` + chaussure tournée `chShoeR` (hip thrust) |
| `src/js/25_icon6.js` | `charOf()` / `myChar()` (perso de l'utilisateur), `seaOf()` (tenue de saison) ; coupe par perso `S.char.hsp[homme|femme]` |
| `src/js/40_home6.js`, `41_home7.js` | accueil : cartes `HCARDS`, carte « Mesures » (`poidsCard`, `bwSheet` = feuille « Nouvelle mesure »), poids (`bwTrend`, `bwStatus`), icônes `note`, `pin` |
| `src/js/43_home72.js` | accueil v7.2 : scène de saison avec le perso, 3 chiffres, semaine en petites scènes, widgets Mesures / Nutrition / Carnet / Progrès (`home72()`, `w72()`) ; `renderHome()` (40_home6.js) n'ajoute que les cartes optionnelles |
| `src/js/56_ill7.js` | **système central des illustrations de saison** (voir plus bas) |
| `src/js/57_season7.js` | décor au trait des thèmes de saison (glyphes, liseré de la barre du bas), particules `#fx7`, `sea7Sync()` |
| `src/js/58_foods.js` | base d'aliments (100 aliments, valeurs pour 100 g CIQUAL/USDA, portions) : aide à la saisie et lecture des anciennes entrées |
| `src/js/62_nutri.js` | nutrition « carnet » (v7.2) |
| `src/js/63_supp.js` | **compléments (moteur)** : données `S.supp` (champs décrits en tête), `SP()`, phases `spPh()` (modes, cycles `spCyc`, programmes `spProg`), prises `spDay()`/`spLog()`/`spSet()`, stats `spStats()`, stock `spStock()`, conflits `spConf()`, `spCycleSet()`, `spProgSet()`, `spPause()`/`spResume()` |
| `src/js/63_suppn.js` | compléments : rappels `spTick()` (bandeau `spBanner()`, notification `spNotify()`), actions du service worker `spDrain()`, agenda `.ics` (`spIcs()`, `spIcsOpen()`, `spIcsState()`) |
| `src/js/63_suppui.js`, `63_suppv.js` | compléments : écrans (`renderSupp()`, Aujourd'hui, Mes compléments, Cycles, `spHome()` de l'accueil), calendrier `spCalHtml()`, historique, fiche `spEdit()`, prise `spIntake()`, réglages `spSettings()`, agenda `spAgenda()` |
| `src/js/64_notes.js` | Carnet de notes (`#carnet`) |
| `src/js/66_mesures.js` | page Mesures (`#mesures`, 1er sous-onglet de Progrès) : poids, tour de taille, **bras G/D, distance claviculaire, taille (m)** ; champs partagés `mzFields`/`mzRead`/`mzWrite` |
| `src/js/70_stats6.js` | Progrès, « Poids et mensurations » (`renderBW`, consigne `#mzTip`) ; badges en pin's sur la veste (`renderJacket`, `PIN_C`) ; liste des badges : `badgeList()` dans `app.js` (32, étiquette `l`) |
| `src/js/71_jacket7.js` | veste des badges, **une par saison** (`jacketSvg(saison)` : doudoune, bomber, coupe-vent, velours ; emplacements `JK_XY`) |
| `src/js/74_install.js` | **tutoriel d'installation** (`instShow()`, `instKind()`, illustrations `i8svg()`, `beforeinstallprompt`), partage de l'appli (`appShare()`, `APP_URL`) |
| `src/js/80_timers6.js` | minuteurs v6 + **minuteur indépendant (v7.4)** : `tmShow(full)`, mini-lecteur `tmMiniSync()`, `tmSave()`/`tmRestore()` (`localStorage carnet-tm`), `tmResync()`, arrêt annulable `tmStopU()`, notification au choix |
| `src/js/85_share6.js` | cartes de partage, `exFam()` / `mainEx()` (famille d'exercice) |
| `src/js/94_dict.js`, `95_i18n.js` | traductions EN/NL |
| `src/css/66_v7.css`, `67_nutri.css`, `68_v71.css`, `70_v72.css`, `71_v73.css`, `72_v74.css`, `73_v75.css`, `74_v76.css` | styles v7 (saisons, nutrition, scènes, mesures, carnet, réglages compacts, été v7.2, veste et pin's v7.3, tutoriel d'installation v7.4, compléments v7.5 : préfixe `sp7`, sauvegarde v7.6 : préfixe `bk7`) |

### Système d'illustrations de saison (v7.1, `src/js/56_ill7.js`)
- `seaNow()` = saison active : celle du thème de saison (`printemps`, `ete`, `automne`, `hiver`, ou « Selon la saison ») ; avec un autre thème (Nuit, Minimal…), la **saison réelle** (déc.-fév. hiver, mars-mai printemps, juin-août été, sept.-nov. automne). Choix de Diego.
- `illScene(lieu,{who,fam})` : décor large 160 x 100 (cartes de séance, semaine, accueil, partages). Street propre à chaque saison ; garage et salle montrent la saison par la porte ou les fenêtres. `who:1` ajoute le perso.
- `illTile('train'|'rest',{place,fam})` : scène portrait 48 x 88 des cases du calendrier, servie en `<img>` (data URL mise en cache par clé saison | type | lieu | exercice | perso).
- `illDay(k)` : séance → entraînement (tractions, dips, squat ; **salle = développé couché**, pose `CH_POSE.bench`) ; repos → transat (été), **pique-nique** (printemps), couverture et feuilles (automne), sac de couchage près d'un bonhomme de neige (hiver), avec « Zzz » ; jour vide → rien.
- Accueil (v7.3) : **toucher le perso = une répétition** de l'exercice montré (`illScene(…,{rep:1})`, `mascRep()` dans `40_home6.js`) : traction, dips, squat, développé couché (barre à la poitrine) ; perso « Femme » à la salle : **hip thrust** (`i7hip()`, aussi dans le calendrier). `.who7` porte `data-ex` et `data-rd`. Dans Chrome chaque `<svg>` imbriqué a sa propre horloge SMIL (pour figer une image : pause + heure sur chaque `<svg>`).
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
- Poids dans `S.bw`, tour de taille dans `S.meas.taille`, bras `S.meas.brasG` / `brasD`, distance claviculaire `S.meas.clav` (cm), taille `S.meas.haut` (m) (`[{d, v}]`). « Taille (hauteur) » ≠ « Tour de taille » (clés de traduction distinctes). Page Mesures (1er sous-onglet de Progrès, `#mesures`) : derniers chiffres, « Nouvelle mesure », consigne exacte « Pèse-toi le matin à jeun, après être allé aux toilettes et avant de manger ou de boire. », courbe à l'échelle du temps, historique modifiable. Carte « Mesures » de l'accueil → `#mesures`. Aucun conseil automatique.

### iPhone et Android, installation, partage (v7.4)
- L'appli vise **iPhone et Android à égalité** (PWA, pas de store). Ne jamais écrire « iPhone » dans un texte vu sur Android : utiliser `PLAT` (`12_plat.js`) ou un texte neutre (« le téléphone »).
- Première ouverture d'un **nouvel utilisateur sur téléphone, pas encore installée** : `instShow()` avant l'accueil des nouveaux (`instFirst()`, clé `localStorage carnet-inst`). Variantes par appareil dans `instKind()` / `instSteps()`. Réglages : « Installer l'appli » (masqué une fois installée) et « Partager l'appli ».
- Sur iPhone, l'appli installée et Safari n'ont pas les mêmes données : installer d'abord, puis faire l'accueil dans l'appli installée.
- Aperçu du lien : balises `og:` dans `src/head.html` + `og-image.png` ; captures des manifestes `screen-1..3.jpg`. Refaire avec `python3 dev/tools/pwa_assets.py` (serveur local lancé) si l'apparence change.
- Feuilles (`#gsheet`, `#sheet`) : le bouton Retour d'Android les ferme (historique géré dans `12_plat.js`) ; ne pas appeler `history.back()` ailleurs pour les fermer.

### Minuteur (v7.4)
- Le minuteur (`TM`, `app.js` + `80_timers6.js`) ne dépend d'aucun écran : temps calculé sur l'heure réelle, état gardé dans `localStorage carnet-tm`, repris au démarrage (`tmRestore()` dans `v6Init`). Ne jamais l'arrêter en changeant de page.
- Écran plein (`#tmo`, la barre d'onglets reste au-dessus) ou mini-lecteur (`#tpill`) sur toutes les pages ; bouton Retour d'Android = réduire.
- Notifications : seulement ce que le téléphone permet (Android ; iPhone si l'appli est installée) ; elles ne se mettent pas à jour en direct, et les bips ne sonnent pas appli fermée. Ne pas prétendre le contraire.

### Compléments alimentaires (v7.5, `63_supp*.js`)
- Même principe que la nutrition : **pas un coach**. L'appli organise et enregistre ce que la personne saisit ; elle n'invente, ne calcule ni ne conseille aucun dosage, cycle ou supplémentation, ne suppose aucune compatibilité, et ne conseille jamais de doubler une dose oubliée. Avertissement « outil d'organisation » visible.
- Nutrition > Compléments (`#complements`, `S.ntab`), bloc d'accueil (`supp` dans `HCARDS`), 3e choix « Compléments » du Calendrier (`S.calMode='c'`, `#calSp`).
- Quatre modes distincts : `cont`, `cyc`, `ponc` (jours, dates ou à la demande), `def` (à définir : jamais en OFF, aucun rappel) ; la suspension (`sus`) est à part et ne touche pas au cycle.
- Le passé ne bouge jamais : durée de cycle modifiée = nouveau segment `cy` à partir d'aujourd'hui ; changement de mode = ancien programme dans `hist`. Jours comptés en UTC (`spDn`/`spDk`), heures en heure locale. Une prise non validée n'est jamais comptée comme prise ; le journal garde nom, dose et heure (historique juste même si la fiche change).
- Rappels : seulement quand l'appli tourne (bandeau, ou notification Android / iPhone installé) ; appli fermée = agenda du téléphone (`.ics`, calendrier séparé « Compléments alimentaires », alarmes). Ne pas prétendre à des notifications programmées appli fermée : il faudrait un serveur (Web Push), non retenu.
- Fonctions `async` non visibles depuis Playwright : `spDrain()` et `spIcsOpen()` sont des fonctions normales qui renvoient une promesse.

### Voix (v7.2)
- Ne jamais retrouver une voix par son nom : sur iPhone, les mêmes noms existent dans plusieurs langues (cause des voix allemandes). Toujours `pickVoice()` (`app.js`) : voix de la langue de l'appli seulement, identifiant `S.voiceU` (voiceURI), sinon meilleure voix ; texte dit passé par `trS()`.

## Traductions (EN / NL)
- Le français est la source. Un `MutationObserver` traduit les nœuds de texte et les attributs (`placeholder`, `aria-label`, `title`) avec `trS()`.
- `shape()` remplace dans la clé : le prénom par `{N0}`, les noms de mois et de jours par `{M0}`/`{D0}`, les nombres par `{0}`, `{1}`… Exemple de clé : `"Reste {0} g"`.
- `trS()` (v7.6) cherche dans l'ordre : texte exact ; clé mise en forme avec puis **sans** le prénom (un texte qui contient « Diego » doit aussi exister tel quel) ; **modèles à trou** `{*}` (ex. `"Pyramide « {*} » prête"`) : la phrase est traduite et le trou à part (nom d'exercice traduit, même en minuscules ; texte de l'utilisateur gardé) ; enfin « A · B » partie par partie. Résultats mis en mémoire. Dans un modèle à trou, écrire les nombres `{*}` aussi (leur numéro dépend de ce qui précède).
- Une phrase construite par morceaux : préférer un modèle à trou `{*}`, ou mettre chaque morceau dans son propre élément, ou ajouter la phrase complète avec toutes ses variantes de signe (`+`, `−`, `±`).
- Textes hors de la page (PDF, CSV, partage, notifications, agenda) : passer par `trS()` explicitement.
- **Vérification du code** : `python3 dev/tools/i18n_static.py` (lit toutes les chaînes du code, même des écrans rarement ouverts ; doit afficher `total 0`) ; `--frag` liste aussi les morceaux à vérifier. Code mort ignoré (compétition de l'époque claude.ai).
- Néerlandais : vrais termes (optrekken, opdrukken, uitvalspassen, sportschool…), pas d'anglais quand un mot néerlandais existe ; noms de skills internationaux gardés (front lever, L-sit…).
- Parcours de l'appli : `NAME=Isabel python3 dev/tools/i18n_full.py en` (un autre prénom que Diego) (parcourt chaque écran, chaque guide d'exercice, le tutoriel sur iPhone/Android) ; pour tout attraper, `ALL=1` en `fr` puis `en` et comparer : un texte identique dans les deux langues n'est pas traduit (sauf noms anglais, unités, dates).
- Les zones de texte (`textarea`) : seul leur texte d'aide (`placeholder`) est traduit, jamais leur contenu.
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
- Captures : `shots_seasons.py` montre accueil, calendrier, nutrition, mesures, carnet, outils et la veste des badges.

## Publier (seulement avec l'accord de Diego)
1. Monter la version à 4 endroits : `APP_V` (`dev/src/app.js`), `APP6` (`dev/src/js/10_core6.js`), `version.json`, cache `C` de `sw.js` (`carnet-vX-Y-Z`).
2. `python3 dev/build.py`, tests, captures ; supprimer les `dev/t16_*.png`.
3. Ajouter une section à `dev/PLAN.md`.
4. Commit en français, puis `git push origin main` (ne pas ajouter `dev/art/icons/`, dossier intermédiaire non suivi).
5. Vérifier `https://ardedi-pixel.github.io/Carnet/version.json?v=<aléatoire>` (le cache de github.io peut être en retard), puis donner le lien et la version entre guillemets.
- Sur iPhone, l'appli se met à jour en la fermant puis en la rouvrant.

## Décisions de Diego (à respecter)
- v7.6 (« évolution majeure » en 14 parties) : avancer **par étapes**, fondations d'abord ; **publier chaque étape testée** (accord donné pour ce chantier) ; **pas de cloud pour l'instant** (sauvegardes sur le téléphone + fichier, fusion sans écraser) ; **pas de journal photo** ; messages de confirmation courts avec annulation ; animation d'entrée = une traction et demie ; l'appli analyse et propose, ne modifie jamais un programme ou une charge sans validation.
- v7.5 : module compléments alimentaires complet (fiches, cycles ON/OFF automatiques, calendrier dédié, rappels, routine du jour cochable, historique et statistiques, stock, frise, oublis, conflits d'horaires, décalage de routine) ; intégré au design existant ; aucune supposition médicale.
- v7.4 : nouvelles mensurations (bras gauche et droit, distance claviculaire, taille) ; minuteur EMOM utilisable en naviguant partout, avec un mini-lecteur permanent et une reprise exacte ; pas de sélection de texte (aspect appli) ; iPhone et Android à égalité ; partage par simple lien ; tutoriel d'installation à la première ouverture, adapté à l'appareil, passable, une seule fois (à retrouver dans Réglages) ; tout traduit en FR et EN (NL gardé).
- v7.3 : toucher le perso = une répétition (développé couché, traction…) ; perso « Femme » = hip thrust à la place du développé couché ; plus d'accessoires à débloquer ; plus de badges ; veste des badges différente par saison (suit le thème, saison réelle avec un thème sans saison).
- v7.2 : accueil = piste C « Immersif » (scène de saison avec le perso, au lieu où la personne s'entraîne le plus : street, garage ou salle, réglable) + widgets de la piste B (Mesures, Nutrition, puis Carnet, Progrès) ; printemps personnalisé (arbres en fleurs, verts, pommiers, buissons) ; appli personnelle, pas de coach : objectifs nutrition saisis par l'utilisateur (Kcal et Prot seulement) ; carnet de notes ; Mesures en 1er sous-onglet de Progrès avec la consigne de pesée ; Outils et Réglages gardés tels quels ; été plus « mer et soleil », hiver inchangé ; nouvel accueil seulement après validation d'une des maquettes.
- v7.1 : système central saison × activité ; thème sans saison = saison réelle ; salle = développé couché ; repos du printemps = pique-nique ; printemps varié ; nutrition en carnet simple ; mesures (poids + tour de taille) mises en avant.
- v7.0 : accueil minimaliste sans répétitions (perso, Mesures, Nutrition du jour, une seule carte « À la une » ; les autres cartes restent activables dans Réglages) ; onglet Nutrition à la place de « Plus » ; décor de saison « Mix ».
- v6.3 : persos en style « Athlète » (adultes, sobres, contour fin) ; robot et ninja retirés ; animaux gardés en version adulte ; animations toujours actives par défaut ; ton « Sobre » sans émojis ; pas de vibrations.
- Idées D (dossier d'idées) : oui pour D1, D3, D7, D9, D10, D13, D14 ; non pour D2, D4, D5, D6, D8, D11, D12.
