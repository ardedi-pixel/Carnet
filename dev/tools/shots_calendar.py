# Calendrier par saison (mois, détail repos, semaine) : python3 cal7.py [W H]
import os,sys
from pathlib import Path
DEV=Path(__file__).resolve().parents[1]
OUT=DEV/'tools'/'out';OUT.mkdir(exist_ok=True)
CHROME={'executable_path':'/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
sys.path.insert(0,str(DEV/'tools'))
import json,sys
from playwright.sync_api import sync_playwright
from PIL import Image
VW=int(sys.argv[1]) if len(sys.argv)>1 else 390;VH=int(sys.argv[2]) if len(sys.argv)>2 else 844
U='http://127.0.0.1:8768/';O=str(OUT/'c71_')+''
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME)
    for th in ['hiver','printemps','ete','automne','nuit']:
        SEED=json.load(open(str(DEV/'seed.json')));SEED['musSeen']=2;SEED['th']=th;SEED['bkAsk']='x'
        ctx=b.new_context(viewport={'width':VW,'height':VH},device_scale_factor=2,has_touch=True)
        ctx.add_init_script('if(!sessionStorage.getItem("s")){localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(SEED))+');localStorage.setItem("carnet-info","x");sessionStorage.setItem("s","1")}')
        pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.goto(U);pg.wait_for_timeout(2600);pg.mouse.click(5,5)
        pg.evaluate("document.querySelectorAll('.bkb,.bkbar,#bkBan,.banner').forEach(e=>e.remove())")
        pg.evaluate('location.hash="#calendrier"');pg.wait_for_timeout(900)
        fs=[O+th+'_m.png'];pg.evaluate("document.getElementById('grid').scrollIntoView({block:'center'})");pg.wait_for_timeout(300);pg.screenshot(path=fs[0])
        if pg.locator('#grid .day.rest').count():pg.click('#grid .day.rest');pg.wait_for_timeout(500);pg.evaluate("document.getElementById('detail').scrollIntoView({block:'center'})");pg.wait_for_timeout(300);fs.append(O+th+'_r.png');pg.screenshot(path=fs[-1])
        pg.evaluate("window.scrollTo(0,0)");pg.click('[data-cal="w"]');pg.wait_for_timeout(600);fs.append(O+th+'_w.png');pg.screenshot(path=fs[-1])
        ims=[Image.open(x) for x in fs];w,h=ims[0].size;sc=.5;sh=Image.new('RGB',(int(w*sc)*len(ims)+10*(len(ims)-1),int(h*sc)),'white')
        for i,im in enumerate(ims):sh.paste(im.resize((int(w*sc),int(h*sc))),(i*(int(w*sc)+10),0))
        sh.save(O+th+'_%d_sheet.png'%VW);print(th,errs[:3]);ctx.close()
    b.close()
