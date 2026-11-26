# Planche des scènes saisonnières : python3 ill7prev.py
import os,sys
from pathlib import Path
DEV=Path(__file__).resolve().parents[1]
OUT=DEV/'tools'/'out';OUT.mkdir(exist_ok=True)
CHROME={'executable_path':'/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
sys.path.insert(0,str(DEV/'tools'))
import json
from playwright.sync_api import sync_playwright
U='http://127.0.0.1:8768/';O=str(OUT/'ill7_')+''
JS="""(sea)=>{const T=[['train','street','pull'],['train','street','dip'],['train','street','push'],['train','street','sq'],['train','garage','pull'],['train','salle','sq'],['rest','','']];
const enc=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
let h='<div style="font:600 14px system-ui;padding:8px;color:#222;background:#fff">'+sea+'</div><div style="display:flex;gap:10px;padding:8px;background:#fff;align-items:flex-end">';
T.forEach(t=>{const u=enc(i7tileSvg(t[0],sea,t[1],t[2]));h+='<div style="text-align:center;font:11px system-ui"><img src="'+u+'" style="width:144px;height:264px;border-radius:14px;object-fit:cover;display:block"><div style="display:flex;gap:6px;justify-content:center;margin-top:6px"><img src="'+u+'" style="width:39px;height:70px;border-radius:10px;object-fit:cover"><img src="'+u+'" style="width:37px;height:70px;border-radius:10px;object-fit:cover"></div>'+t.join(' ')+'</div>'});
h+='</div><div style="display:flex;gap:10px;padding:8px;background:#fff">';
[['street','pull'],['garage','pull'],['salle','sq']].forEach(f=>{h+='<div style="width:320px;height:200px;border-radius:14px;overflow:hidden">'+illScene(f[0],{who:1,fam:f[1]}).replace('<svg ','<svg width="320" height="200" ')+'</div>'});
h+='<div style="width:124px;height:92px;border-radius:10px;overflow:hidden">'+illScene('street',{who:1,fam:'pull'}).replace('<svg ','<svg width="124" height="92" ')+'</div>';
h+='</div>';document.body.innerHTML=h;document.body.style.background='#fff';return 1}"""
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME)
    for th,sea in [('hiver','winter'),('printemps','spring'),('ete','summer'),('automne','autumn')]:
        SEED=json.load(open(str(DEV/'seed.json')));SEED['musSeen']=2;SEED['th']=th
        ctx=b.new_context(viewport={'width':1200,'height':760},device_scale_factor=1)
        ctx.add_init_script('if(!sessionStorage.getItem("s")){localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(SEED))+');localStorage.setItem("carnet-info","x");sessionStorage.setItem("s","1")}')
        pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.goto(U);pg.wait_for_timeout(2500)
        pg.evaluate(JS,sea);pg.wait_for_timeout(500);pg.screenshot(path=O+sea+'.png',full_page=True);print(sea,errs[:3]);ctx.close()
    b.close()
