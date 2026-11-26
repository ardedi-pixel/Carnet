# Sources de Carnet de séances

L'appli publiée est `../index.html` (un seul fichier). On ne la modifie jamais à la main : on modifie `src/`, puis on reconstruit.

- Construire : `python3 dev/build.py` (depuis la racine du dépôt)
- Serveur de test : `python3 -m http.server 8768 --bind 127.0.0.1` à la racine
- Tests : `cd dev && python3 t16.py` (Playwright, serveur lancé)
- Icônes : `cd dev && node art/gen_icons.js` puis conversion PNG (voir le PDF de passation)

Détails complets : PDF « Carnet de séances : passation » dans le projet Mon Appli, et `PLAN.md`.
