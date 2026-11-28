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
if os.environ.get('NAME'):SEED['name']=os.environ['NAME']  # v7.6 : un autre prénom que Diego (les phrases ne doivent pas dépendre du prénom)
SEED['carnet']=[{'id':'n1','c':'nut','t':'Repas','b':'Test','pin':True,'d':1764100000000,'u':1764150000000}]
SEED['bw']=[{'d':'2026-11-05','v':77.6},{'d':'2026-11-19','v':78.1},{'d':TD,'v':78.4}];SEED['meas']={'taille':[{'d':TD,'v':82}],'brasG':[{'d':'2026-11-05','v':36},{'d':TD,'v':36.5}],'brasD':[{'d':'2026-11-05','v':36.5},{'d':TD,'v':37}],'clav':[{'d':TD,'v':41}],'haut':[{'d':TD,'v':1.78}]}
def _dd(n):return (datetime.date.today()+datetime.timedelta(days=n)).isoformat()
SEED['supp']={'list':[{'id':'ash','n':'Ashwagandha','q':600,'u':'mg','tk':[{'m':'s','t':''}],'r':'repas','mode':'cyc','d0':_dd(-33),'cy':[{'f':_dd(-33),'a':_dd(-33),'on':56,'off':28}],'c':6},
 {'id':'bore','n':'Bore','q':3,'u':'mg','tk':[{'m':'m','t':''}],'r':'jeun','mode':'cyc','d0':_dd(-20),'cy':[{'f':_dd(-20),'a':_dd(-20),'on':14,'off':14}],'c':2,'dz':[{'d':_dd(9),'q':2}]},
 {'id':'mg','n':'Magnésium','q':350,'u':'mg','tk':[{'m':'s','t':''},{'m':'c','t':''}],'r':'repas','mode':'cont','d0':_dd(-40),'c':5,'no':'x','far':['om'],'farH':2,'sus':[{'a':_dd(-12),'b':_dd(-10)}]},
 {'id':'om','n':'Oméga-3','q':2,'u':'gélule','tk':[{'m':'m','t':''},{'m':'s','t':''}],'r':'autre','rn':'x','mode':'cont','d0':_dd(-60),'c':4,'stock':{'on':True,'q':6,'su':'gélules','pi':1,'at':_dd(-2),'low':7}},
 {'id':'pre','n':'Pré','q':1,'u':'dose','tk':[{'m':'a','t':'17:30'}],'r':'indif','mode':'ponc','pw':[1,3],'d0':_dd(-30),'c':7},
 {'id':'dem','n':'Dem','q':1,'u':'sachet','tk':[{'m':'d','t':''}],'r':'indif','mode':'ponc','d0':_dd(-30),'c':3},
 {'id':'fut','n':'Fut','q':1,'u':'comprimé','tk':[{'m':'m','t':''}],'r':'indif','mode':'cont','d0':_dd(5),'d1':_dd(60),'c':1},
 {'id':'old','n':'Old','q':1,'u':'cuillère','tk':[{'m':'m','t':''}],'r':'indif','mode':'cont','d0':_dd(-90),'d1':_dd(-30),'c':0},
 {'id':'pau','n':'Pau','q':1,'u':'goutte','tk':[{'m':'m','t':''}],'r':'indif','mode':'cyc','d0':_dd(-50),'cy':[{'f':_dd(-50),'a':_dd(-50),'on':21,'off':7}],'sus':[{'a':_dd(-2),'b':''}],'c':6},
 {'id':'fer','n':'Fer','q':None,'u':'mg','tk':[{'m':'m','t':''}],'r':'jeun','mode':'def','d0':_dd(0),'c':0}],
 'log':{_dd(-1):{'om|0':{'s':'ok','t':0,'n':'Oméga-3','q':2,'un':'gélule','m':'m','h':'08:00'},'om|1':{'s':'late','t':0,'n':'Oméga-3','q':2,'un':'gélule','m':'s','h':'19:30'},'mg|0':{'s':'miss','t':0,'n':'Magnésium','q':350,'un':'mg','m':'s','h':'19:30'},'ash|0':{'s':'skip','t':0,'n':'Ashwagandha','q':600,'un':'mg','m':'s','h':'19:30'},'dem|x1':{'s':'ok','t':0,'n':'Dem','q':1,'un':'sachet','m':'a','h':'15:00'}},
  _dd(0):{'om|0':{'s':'snz','t':0,'u':0,'k':1,'n':'Oméga-3','q':2,'un':'gélule','m':'m','h':'08:00'}},_dd(-45):{'gone|0':{'s':'ok','t':0,'n':'Ancien','q':1,'un':'mg','m':'m','h':'08:00'}}},
 'ev':[{'t':0,'id':'ash','n':'Ashwagandha','x':k} for k in ['add|Prise continue','edit','cyc|8 sem. ON / 4 sem. OFF → 6 sem. ON / 2 sem. OFF','mode|x → y','start|1 déc.','pause|1 déc.','res','resx','end','react','del','dose','stock|+60 gélules','time|10:00','shift|+15 min']],'ics':{'at':_dd(-3),'sig':'x','to':_dd(100)}}
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
    init='localStorage.setItem("carnet-info","x");localStorage.setItem("carnet-bkn",String(Date.now()));'+('localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(seed))+');localStorage.setItem("carnet-inst","1");' if seed else 'localStorage.setItem("carnet-lang","'+LANG+'");')
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
    # compléments alimentaires (v7.5) : chaque vue, chaque feuille, le bandeau, l'accueil, le calendrier
    pg.evaluate('location.hash="#complements"');pg.wait_for_timeout(700);grab('compléments')
    for t in ['list','cyc','cal','hist','today']:
        pg.click('#vSupp [data-spt="'+t+'"]');grab('compléments '+t)
        if t=='cyc':
            for w in ['30','180']:pg.click('#vSupp [data-sptw="'+w+'"]');grab('frise '+w)
        if t=='cal':
            for v in ['w','d','m']:pg.click('#vSupp [data-spcv="'+v+'"]');grab('calendrier compléments '+v)
            pg.click('#vSupp [data-spcf="ash"]');grab('filtre');pg.click('#vSupp [data-spcf=""]')
        if t=='hist':
            pg.click('#vSupp [data-sphm]');grab('historique plus');pg.evaluate("document.querySelector('#vSupp .sp7evs details').open=true");grab('journal')
    for fn in ["spEdit()","spEdit('ash')","spEdit('pau')","spEdit('old')","spEdit('pre')","spEdit('fer')","spEdit(null,{mode:'cyc'})","spEdit(null,{mode:'ponc'})","spEdit(null,{mode:'def'})","spSettings()","spAgenda()","spPauseSheet('mg')","spResumeSheet('ash')","spRefill('om')"]:
        try:
            pg.evaluate(fn);pg.wait_for_timeout(250);pg.evaluate("document.querySelectorAll('#gbox details').forEach(d=>d.open=true)");grab(fn);close()
        except Exception:pass
    k=datetime.date.today().isoformat()
    for kk in ['om|0','om|1','mg|0','ash|0','pre|0']:
        for day in [k,_dd(-1),_dd(2)]:
            try:pg.evaluate("spIntake('"+day+"','"+kk+"')");grab('prise '+kk);close()
            except Exception:pass
    try:pg.evaluate("spIntake('"+_dd(-1)+"','mg|0')");pg.click('[data-spia$="~miss"]');grab('oubli');close()
    except Exception:pass
    pg.evaluate("spBanner('"+k+"',spDay('"+k+"').slice(0,2))");grab('bandeau');pg.evaluate("spBanner('"+k+"',spDay('"+k+"').slice(0,1))");grab('bandeau 1');pg.evaluate("typeof spBannerHide==='function'&&spBannerHide()")
    pg.evaluate('location.hash="#accueil"');pg.wait_for_timeout(600);grab('accueil compléments')
    pg.evaluate('location.hash="#calendrier"');pg.wait_for_timeout(500);pg.click('#calSeg [data-cal="c"]');grab('calendrier onglet compléments');pg.click('#calSeg [data-cal="m"]')
    pg.evaluate("document.querySelector('#hStart')&&0")
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
