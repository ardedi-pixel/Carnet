import json,time,re
from playwright.sync_api import sync_playwright
U='http://localhost:8768/'
data=json.load(open('./seed.json'))
COL=r'''
window.__H={};
function __add(t){if(!t)return;t=String(t).trim();if(t.length<2||!/\p{L}/u.test(t))return;let k=t;try{k=shape(t,'fr-BE')[0]}catch(e){};if(!(k in __H))__H[k]=t}
function __scan(n){if(!n)return;if(n.nodeType===3){const p=n.parentNode;if(p&&p.closest&&p.closest('script,style,textarea,code,r-d'))return;__add(n.data);return}
 if(n.nodeType!==1)return;['placeholder','aria-label','title','alt'].forEach(a=>{if(n.hasAttribute&&n.hasAttribute(a))__add(n.getAttribute(a))});
 if(n.matches&&n.matches('script,style,textarea,code,r-d'))return;for(const c of n.childNodes)__scan(c)}
document.addEventListener('DOMContentLoaded',()=>{__scan(document.body);new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')__scan(m.target);else if(m.type==='attributes')__scan(m.target);else m.addedNodes.forEach(__scan)}}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title','alt']})});
'''
H={}
def grab(pg):
    try:H.update(pg.evaluate('window.__H'))
    except Exception as e:print('grab fail',e)
def js(pg,c,w=500):
    try:pg.evaluate(c)
    except Exception as e:print('JS',c[:60],e)
    pg.wait_for_timeout(w)
with sync_playwright() as p:
    b=p.chromium.launch()
    # ---- utilisateur avec données ----
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True)
    ctx.add_init_script('if(!sessionStorage.getItem("seeded")){localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(data))+');sessionStorage.setItem("seeded","1")}')
    ctx.add_init_script(COL)
    pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(U);pg.wait_for_timeout(3500)
    for h in ['accueil','calendrier','outils','progres','records','skills','echauffement','conseils','tutos','reglages']+['reglages-'+k for k in ['profil','perso','apparence','accueil','messages','sons','langue','donnees']]:
        js(pg,'location.hash="#'+h+'"',900)
    js(pg,'location.hash="#calendrier"',600)
    for b2 in ['[data-cal="w"]','[data-cal="m"]']:
        try:pg.click(b2);pg.wait_for_timeout(400)
        except Exception as e:print('cal',e)
    js(pg,'location.hash="#outils"',500)
    for t in ['rest','emom','pyr','lest']:
        try:pg.click('[data-tm6], #tmSeg [data-tmt="'+t+'"]',timeout=800)
        except Exception:pass
    segs=pg.evaluate("[...document.querySelectorAll('#tmSeg button')].map(b=>Object.keys(b.dataset).map(k=>'['+'data-'+k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())+'=\"'+b.dataset[k]+'\"]').join(''))")
    for s in segs:
        try:pg.click('#tmSeg '+s);pg.wait_for_timeout(400)
        except Exception as e:print('seg',s,e)
    js(pg,'location.hash="#echauffement"',500)
    for s in pg.evaluate("[...document.querySelectorAll('#wuBox button')].slice(0,6).map((b,i)=>i)"):
        try:pg.locator('#wuBox button').nth(s).click(timeout=600);pg.wait_for_timeout(250)
        except Exception:pass
    js(pg,'location.hash="#skills"',500)
    for i in range(6):
        try:pg.locator('[data-skopen]').nth(i).click(timeout=600);pg.wait_for_timeout(200)
        except Exception:pass
    js(pg,'location.hash="#tutos"',600)
    exs=pg.evaluate("[...document.querySelectorAll('#guideList [data-guide]')].map(b=>b.dataset.guide)")
    for x in exs:
        js(pg,'showGuide('+json.dumps(x)+')',150)
    js(pg,'document.getElementById("gsheet").classList.remove("open")',200)
    grab(pg)
    js(pg,'tmStop()',200)
    js(pg,'location.hash="#calendrier"',500)
    js(pg,'openForm()',600)
    for x in ['Tractions','Dips','Dead hang']:
        try:pg.click('#cEx [data-ex="'+x+'"]',timeout=800);pg.wait_for_timeout(200)
        except Exception as e:print('ex',x,e)
    try:pg.fill('[data-pf="Tractions"][data-pk="r"]','12')
    except Exception:pass
    try:pg.click('#ok',timeout=800);pg.wait_for_timeout(500)
    except Exception as e:print('ok',e)
    js(pg,"document.getElementById('rc6')&&document.getElementById('rc6').remove();close()",300)
    js(pg,"openForm(document.querySelector('.sess [data-edit]')?document.querySelector('.sess [data-edit]').dataset.edit:undefined)",500)
    js(pg,'close()',200)
    sid=pg.evaluate("(()=>{location.hash='#calendrier';const b=document.querySelector('[data-k=\"2026-11-25\"]');b&&b.click();const e=document.querySelector('.sess [data-edit]');return e?e.dataset.edit:''})()")
    pg.wait_for_timeout(400)
    if sid:
        for c in ['ctxMenu("%s",100,300)'%sid,'closeCtx()','actSheet("%s")'%sid,'document.getElementById("gsheet").classList.remove("open")','sharePick("sess","%s")'%sid,'stickSheet()','document.getElementById("gsheet").classList.remove("open")']:js(pg,c,300)
    for c in ['chalPick()','document.getElementById("gsheet").classList.remove("open")','document.getElementById("gsheet").classList.remove("open")','onbCode()','document.getElementById("gsheet").classList.remove("open")','celebrate("Tractions",16,"reps",14)','document.getElementById("rec6").remove()','rwReveal(0)','document.getElementById("rw6")&&document.getElementById("rw6").remove()','showBilan(prevMk())','document.getElementById("bil").remove()','showHello()','document.getElementById("hey")&&document.getElementById("hey").remove()','actSheet && 0']:
        js(pg,c,400)
    for c in ['tmStart({k:"rest",sec:4,next:"Série 2"})']:js(pg,c,1500)
    js(pg,'tmAct("min")',400);js(pg,'tmStop()',200)
    js(pg,'tmStart({k:"pyr",steps:[1,2,1],name:"Tractions"})',700);js(pg,'tmAct("pdone")',1600);js(pg,'tmAct("pskip")',400);js(pg,'tmAct("pdone")',300);js(pg,'tmAct("pskip")',300);js(pg,'tmAct("pdone")',800);js(pg,'tmStop()',200)
    js(pg,'tmStart({k:"emom",n:1,iv:3,target:5})',1000);js(pg,'tmAct("pause")',400);js(pg,'tmAct("resume")',11500);js(pg,'tmAct("pause")',300);js(pg,'tmStop()',200)
    grab(pg)
    print('errors',errs[:5]);ctx.close()
    # ---- nouvel utilisateur : introduction ----
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True);ctx.add_init_script(COL);pg=ctx.new_page()
    pg.goto(U);pg.wait_for_timeout(2500)
    try:
        pg.fill('#onbName','Léa');pg.click('[data-onb="1"]');pg.wait_for_timeout(400);pg.click('[data-onb="2"]');pg.wait_for_timeout(400);grab(pg);pg.click('[data-onb="done"]');pg.wait_for_timeout(800)
        for h in ['accueil','calendrier','progres','records','skills','tutos']:js(pg,'location.hash="#'+h+'"',600)
    except Exception as e:print('onb',e)
    grab(pg);ctx.close();b.close()
json.dump(H,open('./i18n/dyn.json','w'),ensure_ascii=False,indent=0)
print('keys',len(H))
