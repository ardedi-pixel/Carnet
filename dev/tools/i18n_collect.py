# Collecte les textes affichés non traduits (lang en) sur les écrans v7 : python3 collect7.py out.json
import os,sys
from pathlib import Path
DEV=Path(__file__).resolve().parents[1]
OUT=DEV/'tools'/'out';OUT.mkdir(exist_ok=True)
CHROME={'executable_path':'/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
sys.path.insert(0,str(DEV/'tools'))
import json,sys
from playwright.sync_api import sync_playwright
U='http://127.0.0.1:8768/';SEED=json.load(open(str(DEV/'seed.json')));SEED['musSeen']=2;SEED['th']='hiver';SEED['lang']='en'
SEED['nut']={'goal':'bulk','sex':'h','age':30,'ht':178,'act':2,'tf':3,'auto':True,'days':{'2026-11-26':{'b':[{'f':'oeuf','g':120},{'f':'banane','g':120}],'l':[{'f':'u1','g':150,'n':'Skyr maison','v':[60,10,4,0.2,0]}],'d':[],'s':[],'w':500},'2026-11-25':{'b':[{'f':'avoine','g':60}],'l':[],'d':[{'f':'saumon_sauvage','g':150}],'s':[],'w':0}},'fav':['oeuf'],'my':[{'id':'u1','n':'Skyr maison','k':60,'p':10,'c':4,'f':0.2,'fib':0,'pg':150,'pl':'1 pot'}],'meals':[{'id':'m1','n':'Mon petit-déjeuner','it':[{'f':'oeuf','g':120}]}],'rec':['oeuf','banane']}
SEED['bw']=[{'d':'2026-11-05','v':77.6},{'d':'2026-11-12','v':77.9},{'d':'2026-11-19','v':78.1},{'d':'2026-11-26','v':78.4}]
JS="""(()=>{const out=new Set(),w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const t=n.nodeValue.trim();if(!t||!/[a-zA-Zàâçéèêëîïôûùüÿœ]{3,}/.test(t))continue;const p=n.parentElement;if(!p||p.closest('script,style,svg'))continue;const cs=getComputedStyle(p);if(cs.display==='none'||cs.visibility==='hidden')continue;if(/[àâçéèêëîïôûùüÿœ]|\\b(le|la|les|des|du|une|un|ton|ta|tes|pour|avec|et|sans|par|jours?|repas|aliments?|séances?)\\b/i.test(t))out.add(t)}
 document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e=>{['placeholder','aria-label','title'].forEach(a=>{const v=e.getAttribute(a);if(v&&/[àâçéèêëîïôûùüÿœ]|\\b(le|la|les|des|du|une|un|ton|ta|pour|avec|et)\\b/i.test(v))out.add(v)})});return [...out]})()"""
allT=set()
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME)
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True)
    ctx.add_init_script('if(!sessionStorage.getItem("s")){localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(SEED))+');localStorage.setItem("carnet-info","x");sessionStorage.setItem("s","1")}')
    pg=ctx.new_page();pg.goto(U);pg.wait_for_timeout(3400);pg.mouse.click(5,5);pg.wait_for_timeout(300)
    def grab():pg.wait_for_timeout(450);allT.update(pg.evaluate(JS))
    def close():pg.evaluate("document.getElementById('gsheet').classList.remove('open')")
    grab()
    for h in ['calendrier','outils','echauffement','conseils','tutos','progres','reglages-accueil','nutrition']:
        pg.evaluate('location.hash="#'+h+'"');pg.wait_for_timeout(700);grab()
    pg.evaluate("document.querySelector('details.more7')&&document.querySelector('details.more7').setAttribute('open','')")
    pg.evaluate('location.hash="#progres"');pg.wait_for_timeout(700);grab()
    pg.evaluate('location.hash="#nutrition"');pg.wait_for_timeout(700)
    for sel in ['[data-nh="m:p"]','[data-nh="r:30"]']:pg.click(sel);grab()
    pg.evaluate("document.querySelector('details.nd7x')&&document.querySelector('details.nd7x').setAttribute('open','')");grab()
    pg.fill('#nqN','sard');pg.wait_for_timeout(300);grab();pg.click('[data-nqf="sardine_huile"]');pg.wait_for_timeout(200);pg.click('[data-nu="qadd"]');pg.wait_for_timeout(400);grab()
    pg.fill('#nqN','Test');pg.fill('#nqK','100');pg.click('[data-nu="qadd"]');pg.wait_for_timeout(400);grab()
    pg.locator('.nl7 [data-ne]').last.click();pg.wait_for_timeout(300);grab();close()
    pg.locator('.nl7 [data-ne]').first.click();pg.wait_for_timeout(300);grab();close()
    pg.click('[data-nu="lib"]');grab();pg.click('#gbox [data-nf]');pg.wait_for_timeout(300);pg.click('[data-nf2^="add:"]');pg.wait_for_timeout(300);grab();pg.click('[data-na="back"]');pg.wait_for_timeout(300);grab()
    for t in ['fav','meals','new']:pg.click('[data-na="tab:'+t+'"]');grab()
    close()
    for m in ['b','l','d','s']:
        pg.click('[data-nu="ideas"]');pg.wait_for_timeout(300);pg.click('#gbox [data-ni2="m:'+m+'"]');grab();pg.click('#gbox [data-ni2^="full:"]');grab();close()
    pg.click('[data-nu="goal"]');grab();pg.click('#gbox [data-nd="auto"]');grab();close()
    pg.click('[data-nu="lib"]');grab();close()
    import re;ids=re.findall(r"^ \['([a-z0-9_]+)',",open(str(DEV/'src'/'js'/'58_foods.js')).read(),re.M)
    for i in ids+['u1']:
        pg.evaluate("nutFood('"+i+"')");pg.wait_for_timeout(60);allT.update(pg.evaluate(JS))
    close()
    pg.evaluate('location.hash="#accueil"');pg.wait_for_timeout(600);pg.click('#hCards [data-bw7="add"]');grab();close();pg.evaluate('location.hash="#calendrier"');pg.wait_for_timeout(500);pg.click('[data-cal="w"]');pg.wait_for_timeout(300);grab()
    d=dict(SEED);d.pop('nut');d['bw']=[]
    ctx2=b.new_context(viewport={'width':390,'height':844},has_touch=True)
    ctx2.add_init_script('if(!sessionStorage.getItem("s")){localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(d))+');localStorage.setItem("carnet-info","x");sessionStorage.setItem("s","1")}')
    pg=ctx2.new_page();pg.goto(U);pg.wait_for_timeout(3400);pg.mouse.click(5,5);grab()
    pg.evaluate('location.hash="#nutrition"');pg.wait_for_timeout(700);grab()
    pg.click('[data-nd="goal:maint"]');pg.click('[data-nd="sex:f"]');pg.fill('[data-ni="age"]','30');pg.fill('[data-ni="ht"]','168');pg.fill('[data-ni="w"]','60');grab()
    b.close()
json.dump(sorted(allT),open(sys.argv[1],'w'),ensure_ascii=False,indent=0);print(len(allT))
