# Images de la PWA (v7.4) : python3 dev/tools/pwa_assets.py   (serveur local sur le port 8768)
# - og-image.png (1200 x 630) : aperçu du lien dans WhatsApp, iMessage, Messenger… (balises og: dans src/head.html)
# - screen-1..3.jpg (1080 x 2340) : captures montrées par Android dans la fenêtre d'installation (manifestes)
# - met à jour tous les manifest*.webmanifest (captures, catégories, description)
import os,json,glob
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
DEV=Path(__file__).resolve().parents[1];ROOT=DEV.parent
CHROME={'executable_path':'/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
U='http://127.0.0.1:8768/'
SEED=json.load(open(DEV/'seed.json'));SEED['musSeen']=2;SEED['th']='nuit';SEED['onb']=True;SEED['name']='Alex'
CARD="""(()=>{const sc=illScene('street',{who:1,fam:'pull'});document.body.innerHTML='<div id="og"><div class="tx"><span class="ic">'+charSvg(charOf('homme',{pose:'icon',bg:1}))+'</span><h1>Carnet<br>de séances</h1><p>Ton carnet d\\'entraînement : séances, minuteurs, records.</p><p class="sm">Gratuit · iPhone et Android · s\\'installe sur l\\'écran d\\'accueil</p></div><div class="ph"><div class="scr">'+sc+'</div></div></div>';
 const st=document.createElement('style');st.textContent='html,body{margin:0;background:#0b0b0c}#og{width:1200px;height:630px;box-sizing:border-box;padding:64px 70px;display:grid;grid-template-columns:1fr 430px;gap:56px;align-items:center;background:radial-gradient(700px 420px at 92% 8%,rgba(228,255,26,.16),transparent 62%),linear-gradient(160deg,#141416,#0b0b0c);color:#f3f3f1;font-family:var(--ft,Inter),system-ui,sans-serif}'
 +'#og .ic{display:block;width:118px;height:118px;border-radius:28px;overflow:hidden;box-shadow:0 14px 34px rgba(0,0,0,.45)}#og .ic svg{width:100%;height:100%;display:block}'
 +'#og h1{font:900 82px/0.95 var(--fd,Archivo),system-ui,sans-serif;letter-spacing:-.02em;margin:30px 0 22px;text-transform:none}#og p{margin:0;font-size:29px;line-height:1.3;color:#d9d9d6}#og p.sm{margin-top:20px;font-size:21px;color:#e4ff1a;font-weight:700;letter-spacing:.01em}'
 +'#og .ph{height:500px;border-radius:44px;padding:12px;background:#1e1e21;box-shadow:0 24px 60px rgba(0,0,0,.55),inset 0 0 0 2px #2a2a2f}#og .scr{height:100%;border-radius:34px;overflow:hidden}#og .scr svg{width:100%;height:100%;display:block}';document.head.appendChild(st)})()"""
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME)
    ctx=b.new_context(viewport={'width':1200,'height':630},device_scale_factor=1)
    ctx.add_init_script('localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(SEED))+');localStorage.setItem("carnet-info","x");localStorage.setItem("carnet-inst","1");localStorage.setItem("carnet-splash","off")')
    pg=ctx.new_page();pg.goto(U);pg.wait_for_timeout(2500);pg.evaluate(CARD);pg.wait_for_timeout(600)
    pg.screenshot(path=str(ROOT/'og-image.png'));ctx.close();print('og-image.png')
    ctx=b.new_context(viewport={'width':360,'height':780},device_scale_factor=3,is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36')
    ctx.add_init_script('localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(SEED))+');localStorage.setItem("carnet-info","x");localStorage.setItem("carnet-inst","1");localStorage.setItem("carnet-splash","off")')
    pg=ctx.new_page();pg.goto(U);pg.wait_for_timeout(2800);pg.add_style_tag(content='#warn,#hey,#bil{display:none!important}');pg.mouse.click(5,5);pg.wait_for_timeout(300)
    for i,h in enumerate(['accueil','calendrier','records'],1):
        pg.evaluate('location.hash="#'+h+'"');pg.wait_for_timeout(1400)
        if h=='records':pg.evaluate("(document.getElementById('bdJkt')||document.body).scrollIntoView({block:'center'})");pg.wait_for_timeout(500)
        f=str(ROOT/('screen-%d.png'%i));pg.screenshot(path=f);Image.open(f).convert('RGB').save(f.replace('.png','.jpg'),quality=82,optimize=True);os.remove(f);print('screen-%d.jpg'%i)
    b.close()
SHOTS=[{'src':'screen-%d.jpg'%i,'sizes':'1080x2340','type':'image/jpeg','form_factor':'narrow','label':l} for i,l in [(1,'Accueil : ta semaine et ton perso'),(2,'Calendrier illustré'),(3,'Badges et records')]]
for f in sorted(glob.glob(str(ROOT/'manifest*.webmanifest'))):
    m=json.load(open(f,encoding='utf-8'))
    m['description']='Ton carnet d\'entraînement : séances, minuteurs, skills et records. Gratuit, iPhone et Android.'
    m['categories']=['health','fitness','lifestyle'];m['screenshots']=SHOTS;m['dir']='ltr'
    json.dump(m,open(f,'w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'));print(os.path.basename(f))
