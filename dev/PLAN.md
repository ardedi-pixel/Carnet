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
