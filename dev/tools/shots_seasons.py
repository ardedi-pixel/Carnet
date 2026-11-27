# Captures par thème (saisons, clair, nuit) : python3 sea7shots.py W H theme1 theme2 ...
import os,sys
from pathlib import Path
DEV=Path(__file__).resolve().parents[1]
OUT=DEV/'tools'/'out';OUT.mkdir(exist_ok=True)
CHROME={'executable_path':'/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
sys.path.insert(0,str(DEV/'tools'))
import json,sys,datetime
TD=datetime.date.today();D0=TD.isoformat();D1=(TD-datetime.timedelta(days=1)).isoformat()
from playwright.sync_api import sync_playwright
from PIL import Image
VW,VH=int(sys.argv[1]),int(sys.argv[2]);TH=sys.argv[3:]
U='http://127.0.0.1:8768/';O=str(OUT/'s7_')+''
NUT={'goal':'bulk','sex':'h','age':30,'ht':178,'act':2,'tf':3,'auto':True,'days':{D0:{'b':[{'f':'oeuf','g':120},{'f':'banane','g':120},{'f':'avoine','g':50}],'l':[{'f':'poulet_blanc','g':150},{'f':'riz_cuit','g':200}],'d':[],'s':[],'w':750},D1:{'b':[{'f':'avoine','g':60}],'l':[{'f':'boeuf_hache5','g':150}],'d':[{'f':'saumon_sauvage','g':150}],'s':[],'w':1500}},'fav':['oeuf'],'my':[],'meals':[],'rec':['oeuf','banane']}
NOTES=[{'id':'n1','c':'nut','t':'Mes repas types','b':'Matin : flocons d\'avoine 60 g, 3 œufs, banane\nMidi : riz 200 g, poulet 150 g','pin':True,'d':1764100000000,'u':1764150000000},{'id':'n2','c':'train','t':'Tractions lestées','b':'2 min de repos entre les séries. +2,5 kg quand 5 x 5 passe.','d':1764000000000,'u':1764000000000}]
BW=[{'d':'2026-10-29','v':77.1},{'d':'2026-11-05','v':77.6},{'d':'2026-11-12','v':77.9},{'d':'2026-11-19','v':78.1},{'d':D0,'v':78.4}]
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME)
    for th in TH:
        SEED=json.load(open(str(DEV/'seed.json')));SEED['musSeen']=2;SEED['th']=th;SEED['nut']=NUT;SEED['bw']=BW;SEED['carnet']=NOTES;SEED['meas']={'taille':[{'d':'2026-10-29','v':83},{'d':'2026-11-12','v':82.5},{'d':'2026-11-26','v':82}]}
        ctx=b.new_context(viewport={'width':VW,'height':VH},device_scale_factor=2,has_touch=True)
        ctx.add_init_script('if(!sessionStorage.getItem("s")){localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(SEED))+');localStorage.setItem("carnet-info","x");sessionStorage.setItem("s","1")}')
        pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('console:'+m.text) if m.type=='error' else None)
        pg.goto(U);pg.wait_for_timeout(3300);pg.add_style_tag(content='#warn{display:none!important}');pg.mouse.click(5,5);pg.wait_for_timeout(300)
        fs=[]
        for h in ['accueil','calendrier','nutrition','mesures','carnet','outils']:
            pg.evaluate('location.hash="#'+h+'"');pg.wait_for_timeout(1300);f=O+'%s_%d_%s.png'%(th,VW,h);pg.screenshot(path=f);fs.append(f)
        ims=[Image.open(x) for x in fs];w,h=ims[0].size;sc=0.5
        sh=Image.new('RGB',(int(w*sc)*len(ims)+10*(len(ims)-1),int(h*sc)),'white')
        for i,im in enumerate(ims):sh.paste(im.resize((int(w*sc),int(h*sc))),(i*(int(w*sc)+10),0))
        sh.save(O+'%s_%d_sheet.png'%(th,VW));print(th,'ERR',errs[:5]);ctx.close()
    b.close()
