import json,sys
from playwright.sync_api import sync_playwright
data=json.load(open('./seed.json'))
W,H=int(sys.argv[1]),int(sys.argv[2]);out=sys.argv[3];hs=sys.argv[4:]
with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':W,'height':H},device_scale_factor=1,has_touch=True)
    ctx.add_init_script('if(!sessionStorage.getItem("seeded")){localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(data))+');localStorage.setItem("carnet-info","x");sessionStorage.setItem("seeded","1")}')
    pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8768/');pg.wait_for_timeout(2600)
    for i,h in enumerate(hs):
        if h.startswith('js:'):pg.evaluate(h[3:]);pg.wait_for_timeout(900);continue
        pg.evaluate('location.hash="#'+h+'"');pg.wait_for_timeout(1400);pg.screenshot(path=out+'_'+str(i)+'.png')
    print('ERR',errs[:5]);b.close()
