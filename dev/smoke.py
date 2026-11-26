import json,sys,time
from playwright.sync_api import sync_playwright
U='http://localhost:8768/'
data=json.load(open('./seed.json')) if len(sys.argv)>1 and sys.argv[1]=='seed' else None
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,has_touch=True)
    if data: ctx.add_init_script('if(!sessionStorage.getItem("seeded")){localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(data))+');sessionStorage.setItem("seeded","1")}')
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('console: '+m.text) if m.type=='error' and 'fonts.g' not in m.text and 'Failed to load' not in m.text else None)
    pg.goto(U);pg.wait_for_timeout(2500)
    for h in (sys.argv[2:] if len(sys.argv)>2 else ['accueil']):
        if h.startswith('js:'):pg.evaluate(h[3:]);pg.wait_for_timeout(700);continue
        pg.evaluate('location.hash="#'+h+'"');pg.wait_for_timeout(900);pg.screenshot(path='./shot_'+h.replace('/','_')+'.png',full_page=False)
    print('ERRORS:',errs[:10])
    b.close()
