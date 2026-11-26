# Carnet v6 — plan de travail (source de vérité, à relire après chaque compaction)

Doc des idées : https://claude.ai/artifact/KhHtdSShWfpiWFWEU3KQd4 (Diego a tout rempli, rev 123)
Repo : /home/claude/carnet-repo (GitHub Pages ardedi-pixel/Carnet). v5 = commit 30fbf21.
Sources v6 : /home/claude/v6/src (head.html, style.css, body.html, app.js, tail.html, js/*.js, css/*.css)
Build : `python3 /home/claude/v6/build.py` → écrit carnet-repo/index.html (single file). Les modules js/*.js
sont insérés à la place du marqueur `/*@@MODS@@*/` dans app.js (à placer avant le code de boot).
Tests : /home/claude/shots/t15.py (v5, 58 tests) → faire t16.py. Serveur : `python3 -m http.server 8768 --bind 127.0.0.1` depuis carnet-repo.

## Décisions de Diego (26/11, 05h)
- Faire UNIQUEMENT les « Oui » du doc + 3 corrections du chat. Les « Peut-être » : AUCUN (V8 A5 A9 R2 R9 N1 N4 C7 T1 T2 P11 P12 P15 P18 P20 P21 Z3).
- Corrections : T4 taille du texte = OUI ; P8 SANS vibrations (A1 reste Non) ; N8 raccourcis icône = OUI (ami Android).
- Images : « Dessins réalistes + ta photo » → redessiner tous les personnages plus détaillés/adultes (pas de photos possibles),
  + option photo perso comme icône/avatar.
- Icône : « Assistant de réinstallation » (iPhone ne permet pas de changer l'icône posée) : guide pas à pas + transfert des données (copier/coller).
- Langue : FR/EN/NL (P19 Oui).

## Liste des Oui (59 + corrections)
V1 thèmes complets (Nuit actuel, Néon, Béton street, Craie, Minimal blanc, Coucher de soleil) · V2 fonds selon l'heure ·
V3 ambiance de saison (neige déc., feuilles automne, désactivable) · V4 mascotte vivante (contente après séance, endormie repos, pouce au record) ·
V5 écrans vides illustrés (perso) · V6 cartes verre dépoli · V7 icônes maison partout (onglets, outils, lieux ; emojis restent dans les messages) ·
V11 démarrage animé (perso fait une traction)
A2 boutons qui s'enfoncent · A3 transitions qui glissent · A4 feuilles à tirer vers le bas · A7 anneau semaine animé · A8 chiffres qui défilent ·
A10 + devient coche animée · A11 profondeur (parallaxe) illustrations de lieu
R1 écran Nouveau record (avant/après, perso, partager) · R3 flamme qui évolue (orange, bleue 10 sem., violette 20, étincelles) ·
R4 perso gagne accessoires avec rang skills (bandeau, gants, médaille, couronne) · R5 récap du dimanche soir (3 chiffres) ·
R8 défi du mois (barre + médaille) · R11 récompense surprise (4 semaines d'affilée → thème/perso débloqué)
N3 grand titre qui se réduit · N5 carte Aujourd'hui intelligente · N7 appui long → menu (modifier, dupliquer, partager) ·
N8 raccourcis icône Android (manifest shortcuts) · N9 moins de texte, plus de visuel (aides au toucher)
S6 ressenti curseur + grands visages animés · S7 clavier ne cache pas le champ + bouton Suivant · S8 mini-récap avant enregistrer
C1 calendrier illustré + aujourd'hui respire · C3 déplacer séance en glissant · C4 graphiques animés/touchables · C5 un graphique à la fois (carrousel) ·
C6 toi il y a 3 mois / aujourd'hui · C8 bilan du mois en carte postale
M1 fond selon phase (accent effort, bleu repos, rouge pulse 3 dernières s) · M2 chiffres géants + paysage · M3 pyramide en escalier ·
M5 aperçu de la suite · M6 résumé de fin · M7 pastille mini-anneau
T4 taille du texte (+ texte plus grand iPhone) · T7 paysage/iPad deux colonnes
X1 designs de carte (story, carré, carte postale) · X2 carte record avec perso · X3 partager semaine/mois · X4 autocollants (fond transparent)
P1 thème + roue de couleurs · P3 plus de persos (gorille, ours, robot, ninja, panda) + tenue (t-shirt, cheveux, peau) · P4 mascotte visible/discrète/off ·
P5 police (sportive, arrondie, classique) + taille · P6 densité · P8 sons : volume, voix (PAS de vibrations, pas de sons d'interface A9) ·
P9 cartes de l'accueil (afficher/ordre) · P10 onglets (garder/ordre) · P13 ton des messages (motivant, détendu, coach strict, humour ; emojis on/off ; pop-ups souvent/parfois/jamais) ·
P16 écran de démarrage au choix/désactivé · P17 profil (surnom, avatar, objectif perso sur l'accueil) · P19 langue FR/EN/NL
Z2 mensurations (bras, taille, poids) + courbe
+ Icône : photo perso, persos redessinés réalistes, assistant de réinstallation iPhone, manifests par perso Android.

## NON (ne pas faire) : V9 V10 A1 A6 R6 R7 R10 N2 N6 S1–S5 C2 M4 T3 T5 T6 T8 T9 P2 P7 P14 O1–O5 Z1 Z4 (+ tous les Peut-être)

## Lots / avancement
- [x] L0 base : split sources, build, carte du code
- [x] L1 personnages : js/20_chars.js (charSvg, charAnim SMIL), js/25_icon6.js (iconSvg, applyIcon data-URL, photo) — RESTE : PNG statiques par espèce + manifests
- [x] L2 thèmes : js/10_core6.js (THEMES, applyAcc, FONTS, --fs, densité, tod, saison), css/60_theme.css
- [x] L3 navigation : js/30_ui6.js (route wrapper, renderTabs, mini titre, transitions, feuilles à tirer, appui long, rollNum)
- [x] L4 accueil : js/40_home6.js (HCARDS, renderHome, mascotte, ring, flame, emptyArt) + js/45_msg6.js (tons P13)
- [x] L5 récompenses : js/50_rewards6.js (REWARDS, accCheck, celebrate R1, recap R5, défi R8)
- [x] L6 formulaire : js/60_form6.js (feel6, kbNext, recap S8)
- [x] L7 stats : js/70_stats6.js (chart6, mensurations, carrousel, cmp, postcard, glisser)
- [x] L8 minuteurs : js/80_timers6.js
- [x] L9 partage : js/85_share6.js
- [x] L10 réglages : js/90_settings6.js (sous-pages #reglages-xxx, éditeur perso, assistant icône, code de transfert)
- [ ] T7 paysage/iPad deux colonnes (CSS) — à faire
- [ ] V5 écrans vides : calendrier/records/liens (emptyArt) — à brancher
- [ ] L11 langues FR/EN/NL (P19)
- [ ] L12 tests t16, version 6.0.0, sw cache carnet-v6, push

## Notes techniques

- app.js : fonctions renommées *5 (route5, renderSet25, drawMeta5, tmLoop5, shareCard5, renderStatsPage5, renderBW5, showBilan5, celebrate5, reward5, maybeHello5) ; supprimées : ICF, applyAcc v5, countUp, ring, flame, renderHome, helloPick, afterAdd.
- Test rapide : `python3 /home/claude/v6/smoke.py seed accueil reglages ...` (captures /home/claude/v6/shot_*.png, données /home/claude/v6/seed.json)

## État au 26/11 10h45 : v6.0.0 PUBLIÉE (commit 81d8b13 sur main). Tests t16.py : 64/64.
- Dictionnaires : i18n/keys.json + i18n/tr/*.json + i18n/extra.json → src/js/94_dict.js (régénérer si nouveaux textes).
- Icônes : art/icons.js + rsvg-convert → carnet-repo/icon-<k>-{180,192,512,mask}.png, manifest-<k>.webmanifest, sc-*.png.

## v6.1 (26/11/2026)
- DA d'origine (v5, style autocollant) remise partout : nouveau rig `20_chars.js` (9 espèces, 10 poses, tenues, accessoires), icônes PNG régénérées (`art/gen_icons.js`). Ancien rig gardé dans `art/20_chars.v60.js`.
- Splash : traction visible (filet CSS à 4,5 s, JS à 2,35 s, toucher pour passer).
- Thèmes de saison : printemps, été, automne, hiver + « Selon la saison » (S.th='saison', `thKey()`), illustrations d'en-tête, particules pétales/soleil/feuilles/neige.
- Ressenti : jauge d'énergie (pile) à la place des visages. Mensurations : poids + tour de taille. Badges : 6 visibles + « Voir les N badges ».
- Progrès : skills en carte de progression (`72_skills61.js`), mois en pastilles, types en anneau.
- Accueil : scène du perso, bulle, pastilles et boutons « autocollant », outils colorés.
- N9 : aides (i) à la place des longs textes (`helpify()`). V2 un peu plus visible.
- Dossier : sections « Nouvelles idées design (v6.1) » (D1-D14) et « Vérification : où trouver chaque Oui ».
- Tests : t16.py 79/79.

## v6.2.0 (26/11/2026) : PUBLIÉE
- Tâche 1 « persos plus dessin animé » : 3 variantes montrées (page https://claude.ai/artifact/LGCvbweZK7A4YJTvxqCEcX, prototype inclus dans la page).
  Décision de Diego : **style actuel gardé**, démarrage animé **inchangé** (style icône), **pas de changement des yeux ni de clignement**.
  Gardé : **rebond élastique** (écrasement/étirement) sur la mascotte, l'écran record/accessoire (.recch, keyframes `bounce`) et le perso de la carte des skills (mhop). Saut bas (-6 px + étirement) pour ne pas passer sous la bulle. La mascotte reprend sa respiration après un toucher.
- Idées D (choix de Diego 26/11 13 h) — Oui : D1 D3 D7 D9 D10 D13 D14 ; Non : D2 D4 D5 D6 D8 D11 D12.
  - D1 perso de saison (`20_chars.js` : chBeanie, chScarf, chShades ; `o.sea` = 'hiver' | 'ete' ; `seaOf()` dans 25_icon6.js) : bonnet + écharpe avec un thème Hiver (ou « Selon la saison » en hiver), lunettes de soleil en été. Jamais sur l'icône (pose icon) ni sur le démarrage.
  - D10 perso qui se muscle (`o.mus` 0/1/2, `musLvl()` : série de 4 puis 12 semaines, comme les badges) : épaules, bras, torse en V, pectoraux. Écran « Ton perso prend du muscle / est musclé ! » une fois par niveau (`musCheck()`, clé `musSeen`).
  - D3 décor selon l'heure derrière la mascotte (`mascScene()` : matin 5-10 h lever de soleil, soir 17-21 h ciel étoilé, nuit étoiles + lune, journée : disque d'origine). Images SVG en CSS (64_v62.css).
  - D7 respiration guidée pendant le repos : cercle 4 s inspire / 6 s expire dans l'anneau du minuteur (`.tbr`, body.html), masqué pendant les 3 dernières secondes.
  - D9 badges en pin's sur une veste en jean (`renderJacket()` dans 70_stats6.js, place fixe par badge, nouveaux pin's animés une fois, clé `bdSeen`) ; la liste détaillée reste sous « Voir les 22 badges ».
  - D13 pochette d'album du mois (format « Pochette » dans le partage du mois, `albumCard()`, titre choisi selon le mois `albumTitle()`).
  - D14 fin de séance animée : après l'enregistrement, le perso refait l'exercice principal en boucle (`sessArt`, poses dipA/B, pushA/B, sqA/B + traction ; `CH_ANIM`) ; format « Vidéo » dans le partage d'une séance (`sessAnim()` : MediaRecorder + canvas.captureStream, MP4 sur iPhone, image en secours).
- Correctif : en thème clair, le minuteur (fond sombre) gardait un texte sombre illisible → couleurs sombres forcées pendant les phases.
- Traductions : 35 textes ajoutés (i18n/extra.json, ajoutés en fin de 94_dict.js).
- Tests : t16.py 96/96 (17 tests v6.2 en B12b). Les tests posent `musSeen=2` pour que l'écran « perso musclé » n'interrompe pas les autres tests.

## v6.2.1 (26/11/2026) : correctif du démarrage animé
- Symptôme (vidéo de Diego, iPhone) : à l'ouverture, seulement « Carnet de séances » puis l'accueil, jamais la traction animée.
- Cause : l'iPhone a « Réduire les animations » activé (l'ouverture se fait en fondu dans la vidéo) et une ancienne règle v5 de style.css cachait #splash dans `@media(prefers-reduced-motion:reduce)`.
- Correctif : le démarrage suit le réglage de l'appli (Animé / Logo / Désactivé) même avec « Réduire les animations ». Test de non-régression : section E de t16.py (97/97).
- Boucle de diagnostic : contexte Playwright avec `reduced_motion='reduce'`, on vérifie que #splash est affiché avec le SVG animé.
- Reste coupé avec « Réduire les animations » : confettis, transitions de pages, chiffres qui défilent, particules de saison, respiration D7, pop des pin's.

## v6.3.0 (26/11/2026) : persos « Athlète » et look moins enfantin
Demande de Diego : appli et persos moins puérils. Choix : style **A « Athlète »**, robot et ninja **retirés**, icône refaite, animations **forcées**.
- Persos (`20_chars.js` réécrit, même interface : charSvg, charAnim, charAt, CH_*) : proportions adultes (tête ~1/5), visages sobres (sans joues roses ni goutte), contour plus fin (2,8), débardeur + short (femme : brassière + legging), baskets. Animaux : têtes d'origine réduites (x 0,6), sans joues ni goutte. Ancien moteur : `art/20_chars.v62.js`.
  - Muscles (D10), tenue de saison (D1), accessoires et poses d'exercice (D14) refaits dans le nouveau style.
  - Robot et ninja : retirés de CH_SP, des récompenses surprises (REWARDS = Or, Aurore) et du script de head.html. Un ancien choix robot/ninja repasse sur Homme (fallback existant).
- Icône : buste à la barre (pose `icon` = haut de traction, cadrage `vb:[30,8,140,140]`, constante `CH_VBI`). PNG régénérés (`node art/gen_icons.js` + rsvg-convert, voir plus haut). Le démarrage animé = l'icône animée (même cadrage, carré).
  - iPhone : l'icône de l'écran d'accueil ne change qu'en retirant puis rajoutant l'appli (iOS garde l'ancienne).
- Animations « Toujours » (nouveau réglage Apparence > Animations : Toujours / Selon l'iPhone, clé `anim`). `rmOn()` remplace tous les tests JS de prefers-reduced-motion ; en CSS les blocs `@media (prefers-reduced-motion)` deviennent `html.rm …` (classe posée par `rmSync()` et dès le head si `carnet-anim`=os).
- Look plus adulte (65_v63.css) : boutons à plat (fini contour noir + ombre dure), message de l'accueil en ligne d'info (le perso y affiche son message, plus de bulle), outils et icônes de cartes d'une seule couleur, médailles/carte des skills sans contour noir, fin de séance avec coche au lieu du smiley et sans pouces volants, confettis aux couleurs de l'appli, pin's en émail sourd avec anneau métal, veste en jean plus sombre.
- Ton « Sobre » (nouveau, par défaut) : phrases courtes, sans émoji. Migration (S.v 7) : ton Motivant d'origine → Sobre, émojis coupés (réactivables dans Réglages > Messages). « Trop bien ! » → « Continuer ».
- Fin de séance : cadrage serré par exercice (`EXVB` dans 85_share6.js).
- Correctifs thème clair / Minimal (accent sombre) : texte et coche de la fin de séance lisibles (`--on-lead`), écran record lisible (`--lead-dk`), plus de bande blanche sous les boutons des écrans plein écran (`.rec6 .acts`). Les pop-ups de récompense attendent la fin du « Bon retour ».
- Traductions : 59 textes ajoutés (EN/NL).
- Tests : t16.py 107/107 (section E : animations forcées + réglage ; section F : ton sobre, 7 persos dans toutes les poses, ligne d'info, coche).

## v7.0.0 (26/11/2026) : accueil minimaliste, univers de saison, module Nutrition
Demande de Diego : moins de détails et de répétitions, poids bien visible sur l'accueil et lié aux objectifs, univers de saison sur toute l'interface, module nutrition complet (objectifs, journal, idées de repas, bibliothèque d'aliments, historique).
Choix de Diego : Nutrition **remplace l'onglet « Plus »** (Accueil · Calendrier · Nutrition · Outils · Progrès ; Échauffement, Conseils et Tutos passent dans Outils) ; décor **« Mix »** (mini-illustrations en couleur dans les cases du calendrier, motifs au trait fin ailleurs) ; aliments = **base intégrée + ajout manuel** (pas d'API externe : aucune dépendance, marche hors ligne) ; **une seule publication** quand tout est fait et testé.
- Navigation : TABS6 home, cal, nut, tools, pr (30_ui6.js). Outils a 4 sous-onglets (Minuteurs, Échauffement, Conseils, Tutos ; `S.xtab`). Anciennes adresses (#plus, #echauffement, #conseils, #tutos) redirigées. Migration S.v 8 (10_core6.js) : onglet plus → nut, ordre par défaut, cartes d'accueil (perso, poids, nutrition, À la une ; les autres restent disponibles dans Réglages).
- Répétitions retirées : outils de l'accueil (déjà dans Outils), bandeau de stats et salutation du calendrier, points du mois dans Progrès. Accueil : perso + Poids + Nutrition du jour + une seule carte « À la une » (la plus utile du moment).
- Poids : carte d'accueil (dernier poids, écart sur 30 j, courbe, tendance, pesée en un toucher ; 41_home7.js) et en tête de Progrès (« Poids et mensurations »). La tendance (régression linéaire sur 28 jours) est comparée à l'objectif nutrition : prise de masse sèche +0,1 à +0,4 %/sem., maintien ±0,15 %, sèche −0,5 à −1 %.
- Saisons (57_season7.js + 66_v7.css) : glyphe au trait après les titres, liseré de la barre du bas, sol en filigrane, particules discrètes (canvas #fx7, ~30 i/s, coupé si onglet caché ou animations réduites), illustrations en couleur dans les jours vides du calendrier (`dcoOf`). Actif seulement avec un thème de saison (attribut `data-season` absent sinon).
- Nutrition (58_foods.js : 100 aliments entiers, valeurs pour 100 g CIQUAL/USDA, portions, micronutriments, critères de qualité NQ, 15 modèles de repas NMEALS ; 62_nutri.js ; 67_nutri.css). Données dans `S.nut` (objectif, profil, objectifs perso, jours {b,l,d,s,w}, favoris, aliments perso, repas enregistrés, récents).
  - Besoins : Mifflin-St Jeor × activité (1,2 / 1,3 / 1,45 / 1,6 + 0,025 par séance hebdo, max 2) × objectif (1,1 / 1 / 0,8). Protéines 1,8 / 1,8 / 2,2 g/kg ; lipides max(0,7 g/kg ; 25 / 30 / 25 % des kcal) ; glucides = reste ; fibres max(25 ; 14 g/1000 kcal) ; eau 35 ml/kg. Présentés comme estimation de départ, modifiables (objectifs personnalisés), recalculés quand le poids change (mode auto) ou proposés si l'écart dépasse 2 kg.
  - Idées de repas : recherche par pas de grammes sur les modèles pour coller aux macros restantes (repas ou journée), indicateur de qualité, valeurs approximatives signalées.
- Traductions : 317 textes de la base d'aliments + ~230 textes d'interface (EN/NL). Outil `tools/i18n_set.py` pour corriger une traduction existante.
- Correctifs visuels : glyphe de printemps à 5 pétales (le 4 pétales ressemblait à un « + »), mouettes d'été déplacées (chevauchaient « Salut … »), étoiles d'hiver hors des titres, illustration d'hiver calée en haut hors accueil, ombres des titres adaptées (claire en printemps/été), carrés gris dans les thèmes sans saison (attribut `data-season` vide) corrigés.
- Tests : t16.py sections G (saisons, poids, nutrition, calculs vérifiés : 2 190 kcal, P 173 / G 237 / L 61, journal 267 kcal) et H (thème Nuit sans décor, nutrition en anglais).
