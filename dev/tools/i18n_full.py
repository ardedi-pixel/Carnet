# Parcours complet de l'appli dans une langue (v7.4) : python3 dev/tools/i18n_full.py en dev/tools/out/manque_en.json
# Visite tous les écrans et sous-écrans, ouvre le guide de CHAQUE exercice, chaque skill, les minuteurs, les réglages,
# le formulaire de séance, le jour de repos, l'accueil des nouveaux et le tutoriel d'installation (iPhone, Android, Instagram),
# et liste les textes restés en français (texte visible, placeholder, aria-label, title).
import os,sys,json,datetime
from pathlib import Path
from playwright.sync_api import sync_playwright
DEV=Path(__file__).resolve().parents[1]
CHROME={'executable_path':'/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
U='http://127.0.0.1:8768/';LANG=sys.argv[1] if len(sys.argv)>1 else 'en';OUT=sys.argv[2] if len(sys.argv)>2 else str(DEV/'tools'/'out'/('manque_'+LANG+'.json'))
TD=datetime.date.today().isoformat()
SEED=json.load(open(DEV/'seed.json'));SEED.update({'musSeen':2,'th':'hiver','lang':LANG,'onb':True,'rest':[TD]})
SEED['carnet']=[{'id':'n1','c':'nut','t':'Repas','b':'Test','pin':True,'d':1764100000000,'u':1764150000000}]
SEED['bw']=[{'d':'2026-11-05','v':77.6},{'d':'2026-11-19','v':78.1},{'d':TD,'v':78.4}];SEED['meas']={'taille':[{'d':TD,'v':82}],'brasG':[{'d':'2026-11-05','v':36},{'d':TD,'v':36.5}],'brasD':[{'d':'2026-11-05','v':36.5},{'d':TD,'v':37}],'clav':[{'d':TD,'v':41}],'haut':[{'d':TD,'v':1.78}]}
FR=r"[àâçéèêëîïôûùüÿœ]|\b(le|la|les|des|du|une|un|ton|ta|tes|pour|avec|et|sans|par|jours?|repas|aliments?|séances?|semaine|touche|choisis|ouvre|installe)\b"
if os.environ.get('ALL'):FR=r"[A-Za-zÀ-ÿ]{3,}"  # ALL=1 : tous les textes visibles (pour comparer deux langues)
JS="""(fr)=>{const re=new RegExp(fr,'i'),out=new Set(),w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const t=n.nodeValue.trim();if(!t||!/[a-zA-Zàâçéèêëîïôûùüÿœ]{3,}/.test(t))continue;const p=n.parentElement;if(!p||p.closest('script,style,textarea,.notr,.snote,code'))continue;
  const e=p.closest('svg')||p,cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||e.closest('[hidden]'))continue;if(re.test(t))out.add(t)}
 document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e=>{if(e.closest('[hidden]'))return;['placeholder','aria-label','title'].forEach(a=>{const v=e.getAttribute(a);if(v&&re.test(v))out.add(v)})});return [...out]}"""
IOS='Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1'
AND='Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36'
IG='Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 390.0.0.28.85'
SAM='Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36'
allT={}
LOCALE={'fr':'fr-FR','en':'en-US','nl':'nl-NL'}.get(LANG,'fr-FR')
def mk(b,seed,ua=None):
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=bool(ua),user_agent=ua,locale=LOCALE) if ua else b.new_context(viewport={'width':390,'height':844},has_touch=True,locale=LOCALE)
    init='localStorage.setItem("carnet-info","x");'+('localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(seed))+');localStorage.setItem("carnet-inst","1");' if seed else 'localStorage.setItem("carnet-lang","'+LANG+'");')
    ctx.add_init_script('if(!sessionStorage.getItem("s")){'+init+'sessionStorage.setItem("s","1")}');return ctx
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME)
    ctx=mk(b,SEED);pg=ctx.new_page();pg.goto(U+'_dbg.html' if os.path.exists(DEV.parent/'_dbg.html') else U);pg.wait_for_timeout(3200);pg.mouse.click(5,5)
    def grab(where):
        pg.wait_for_timeout(350)
        for t in pg.evaluate(JS,FR):allT.setdefault(t,where)
    def close():pg.evaluate("document.getElementById('gsheet').classList.remove('open');if(document.getElementById('sheet').classList.contains('open'))close();['rec6','rw6','hey','bil'].forEach(i=>{const e=document.getElementById(i);if(e)e.remove()})")
    for h in ['accueil','calendrier','nutrition','outils','echauffement','conseils','tutos','mesures','stats','records','skills','carnet','reglages']+['reglages-'+s for s in ['profil','perso','apparence','accueil','messages','sons','langue','donnees']]:
        pg.evaluate('location.hash="#'+h+'"');pg.wait_for_timeout(700);grab(h)
    pg.evaluate('location.hash="#echauffement"');pg.wait_for_timeout(500)
    for sel in pg.locator('[data-wum]').all():
        try:sel.click();grab('echauffement')
        except Exception:pass
    pg.evaluate('location.hash="#skills"');pg.wait_for_timeout(500)
    for k in pg.evaluate("[...document.querySelectorAll('[data-sksel]')].map(e=>e.dataset.sksel)"):
        pg.click('[data-sksel="'+k+'"]');grab('skill '+k)
    pg.evaluate('location.hash="#records"');pg.wait_for_timeout(500)
    if pg.locator('#bdMore').count():pg.click('#bdMore');grab('badges')
    # chaque exercice : guide complet
    exs=pg.evaluate("window.__dbg?[...new Set([].concat(...window.__dbg.EXG0.map(g=>g[1]),Object.keys(window.__dbg.MG),window.__dbg.PYEX.map(x=>x[0])))]:[]")
    for x in exs:
        pg.evaluate("x=>showGuide(x)",x);grab('guide '+x);close()
    # mesures : chaque courbe ; minuteurs : écran, mini-lecteur, fin (v7.4)
    pg.evaluate('location.hash="#mesures"');pg.wait_for_timeout(600)
    for k in ['poids','taille','bras','clav','haut']:
        pg.click('[data-mzm="'+k+'"]');grab('mesures '+k)
    for stt in ["tmStart({k:'emom',n:3,iv:60,target:5})","tmStart({k:'rest',sec:30})","tmStart({k:'pyr',steps:[1,2,1],name:'Tractions'})"]:
        pg.evaluate(stt);pg.wait_for_timeout(700);grab('minuteur');pg.evaluate("tmAct('min')");pg.wait_for_timeout(500);grab('mini-lecteur')
        if 'pyr' in stt:
            pg.evaluate("tmAct('pdone')");pg.wait_for_timeout(500);grab('mini-lecteur repos');pg.evaluate("tmShow(true)");pg.wait_for_timeout(400);grab('minuteur repos')
        pg.evaluate("tmStop()");pg.wait_for_timeout(300);grab('arrêt')
    pg.evaluate("tmStart({k:'pyr',steps:[1],name:''})");pg.wait_for_timeout(300);pg.evaluate("tmAct('pdone')");pg.wait_for_timeout(700);grab('fin pyramide');pg.evaluate("tmStop()")
    # formulaire de séance, jour de repos, défi
    pg.evaluate('location.hash="#calendrier"');pg.wait_for_timeout(500);grab('repos')
    pg.evaluate("openForm()");pg.wait_for_timeout(500);grab('formulaire');close()
    pg.evaluate("location.hash='#accueil'");pg.wait_for_timeout(500)
    for fn in ["chalPick()","bwSheet()","nutGoalSheet()","noteOpen('')","mzEdit()"]:
        try:pg.evaluate(fn);grab(fn);close()
        except Exception:pass
    ctx.close()
    # nouveaux utilisateurs : tutoriel d'installation puis accueil des nouveaux
    for lab,ua in [('iphone',IOS),('android',AND),('instagram',IG),('samsung',SAM)]:
        ctx=mk(b,None,ua);pg=ctx.new_page();pg.goto(U+('_dbg.html' if os.path.exists(DEV.parent/'_dbg.html') else ''));pg.wait_for_timeout(2600)
        for i in range(4):
            grab('tuto '+lab)
            nx=pg.locator('#inst [data-inst="next"],#inst [data-inst="fin"]')
            if nx.count():nx.first.click();pg.wait_for_timeout(400)
        grab('tuto '+lab+' fin')
        if pg.locator('#inst [data-inst="done"],#inst [data-inst="skip"]').count():pg.locator('#inst [data-inst="done"],#inst [data-inst="skip"]').first.click();pg.wait_for_timeout(500)
        for i in range(3):
            grab('accueil nouveaux '+lab)
            if pg.locator('#onb [data-onb]').count():
                if pg.locator('#onbName').count():pg.fill('#onbName','Alex')
                pg.locator('#onb [data-onb]').first.click();pg.wait_for_timeout(400)
        ctx.close()
    b.close()
res=[{'t':t,'ou':w} for t,w in sorted(allT.items())]
json.dump(res,open(OUT,'w'),ensure_ascii=False,indent=0);print(len(res))
