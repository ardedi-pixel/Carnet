import json, re, time
from playwright.sync_api import sync_playwright
U='http://localhost:8768/'
SH='/home/claude/shots/'
def sess(d,place,ex,perf=None,dur=60,tod='soir',types=None,feel=None):
    s={'id':'s'+d.replace('-','')+place,'date':d,'place':place,'types':types or ['classique'],'ex':ex,'dur':dur,'tod':tod}
    if perf: s['perf']=perf
    if feel: s['feel']=feel
    return s
S=[]
for i,d in enumerate(['2026-10-02','2026-10-06','2026-10-09','2026-10-13','2026-10-16','2026-10-20','2026-10-23','2026-10-27']):
    S.append(sess(d,'street' if i%2 else 'salle',['Tractions','Dips','Bench press'],{'Tractions':{'s':4,'r':10+i%4,'kg':0},'Bench press':{'s':4,'r':8,'kg':70+i}},feel=3))
for d in ['2026-11-02','2026-11-05','2026-11-09','2026-11-12','2026-11-16','2026-11-19','2026-11-20','2026-11-21','2026-11-22','2026-11-23','2026-11-24','2026-11-25']:
    S.append(sess(d,'garage',['Tractions','Pompes','Rowing haltère'],{'Tractions':{'s':4,'r':12,'kg':0},'Rowing haltère':{'s':3,'r':10,'kg':24}},dur=45,feel=2))
DATA={'v':4,'sessions':S,'rest':[],'comps':[],'decoys':[],'recs':[{'id':'r1','name':'Tractions','unit':'reps','hist':[{'d':'2026-10-01','v':12},{'d':'2026-11-10','v':14}]}],'demo':False,'upd':1,'name':'Diego','fav':['Tractions','Dips'],'onb':True,
 'bw':[{'d':'2026-10-01','v':77},{'d':'2026-11-01','v':78.2}],'goal':4,
 'presets':[{'id':'pold','k':'pyr','name':'Ma vieille','c':{'pyStart':1,'pyTop':8,'pyStep':1,'pyShape':'ud','pyMode':'prog','pyFix':30,'pyAnch':[[1,15],[5,30],[8,60]]}}],
 'live':{'start':int(time.time()*1000)-600000,'place':'salle','types':[],'feel':0,'note':'','ex':[{'n':'Tractions','done':[True,False],'r':'','kg':''}]},
 'tpls':[{'id':'t1','name':'Haut','pl':'','ex':[{'n':'Tractions','sets':3,'sup':False}]}]}
def seed(d):return 'if(!sessionStorage.getItem("seeded")){localStorage.setItem("carnet-seances",'+json.dumps(json.dumps(d))+');sessionStorage.setItem("seeded","1")}'
errs=[];log=[]
def ok(c,m): log.append(('OK   ' if c else 'FAIL ')+m)
def mk(b,data=None,vw=390):
    ctx=b.new_context(viewport={'width':vw,'height':844},device_scale_factor=2,has_touch=True,accept_downloads=True)
    if data is not None: ctx.add_init_script(seed(data))
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append('console: '+m.text) if m.type=='error' and 'fonts.g' not in m.text and 'ERR_' not in m.text and 'Failed to load resource' not in m.text else None)
    return ctx,pg
def store(pg): return json.loads(pg.evaluate("localStorage.getItem('carnet-seances')"))
def txt(pg,sel): return pg.text_content(sel) or ''
try:
 with sync_playwright() as p:
    b=p.chromium.launch()
    # ---------- A : nouvel utilisateur ----------
    ctx,pg=mk(b)
    pg.goto(U);pg.wait_for_timeout(2000)
    ok(pg.locator('#onb').count()==1,'A onboarding')
    pg.fill('#onbName','Léa');pg.click('[data-onb="1"]');pg.wait_for_timeout(200)
    ok(pg.locator('#onb .ict').count()==4,'A onboarding: 4 icon choices')
    pg.click('#onb [data-icon="chat"]');pg.wait_for_timeout(200)
    ok(pg.get_attribute('#onb [data-icon="chat"]','aria-pressed')=='true' and 'icon-chat-180.png' in pg.get_attribute('link[rel="apple-touch-icon"]','href'),'A icon choice sets the home-screen icon')
    pg.screenshot(path=SH+'v5_onb_icon.png')
    pg.click('[data-onb="2"]');pg.click('[data-onb="done"]');pg.wait_for_timeout(500)
    ok(txt(pg,'#hello')=='Salut Léa !','A header "Salut Léa !": '+txt(pg,'#hello'))
    ok(pg.locator('#hLogo svg').count()==1 and pg.locator('#gear').is_visible(),'A logo + settings button')
    ok('Noter une séance' in txt(pg,'#hStart') and 'Démarrer' not in txt(pg,'body'),'A home: note button, no live séance')
    ok(pg.locator('#hTools .qtb').count()==4,'A home: 4 tool tiles')
    ok(pg.locator('#hey').count()==0,'A no hello popup during first use')
    pg.screenshot(path=SH+'v5_home_new.png',full_page=True)
    ctx.close()
    # ---------- B : données existantes (v4) ----------
    ctx,pg=mk(b,DATA)
    pg.goto(U);pg.wait_for_timeout(3600)
    if pg.locator('#bil').count():pg.click('#bilOk')
    pg.wait_for_timeout(300)
    ok(txt(pg,'#hello')=='Salut Diego !' and pg.locator('#figs').is_visible(),'B home header + figs')
    ok(pg.locator('.wdot').count()==7 and pg.locator('.wdot.on').count()>=2,'B week bubbles')
    hc=txt(pg,'#hCards');ok('Astuce du jour' in hc and 'Dernière séance' in hc,'B home cards (tip, last session)')
    pg.screenshot(path=SH+'v5_home.png',full_page=True)
    st=store(pg);ok(st.get('v')==5 and not st.get('live'),'B migrated to v5, old live séance dropped')
    names=[x['name'] for x in st['presets'] if x['k']=='pyr'];ok(all(n in names for n in ['Tractions','Dips','Pompes','Ma vieille']),'B example pyramids added: '+str(names))
    old=[x for x in st['presets'] if x['id']=='pold'][0];ok('pyR' in old['c'] and 'pyAnch' not in old['c'],'B old pyramid converted to ranges')
    # progrès
    pg.click('#tPr');pg.wait_for_timeout(400)
    ok(txt(pg,'#hello')=='Tes performances' and not pg.locator('#figs').is_visible() and not pg.locator('#hLogo').is_visible(),'B Progrès title "Tes performances"')
    pg.click('[data-pt="skills"]');pg.wait_for_timeout(300)
    ok(pg.locator('#skLv .shm').count()==10 and 'Débutant' in txt(pg,'#skLv'),'B skills level panel + 10 medals')
    pg.click('[data-skopen="traction"]');pg.wait_for_timeout(200)
    ok(pg.locator('#sk-traction .path li').count()==8 and pg.locator('#sk-traction li.next').count()==1,'B skill path with next step')
    pg.click('[data-sk="traction:2"]');pg.wait_for_timeout(250)
    ok(pg.locator('#boom.on').count()==1 and 'bronze' in txt(pg,'#boom') and pg.locator('.cfw').count()==1 and pg.locator('#sk-traction li.done').count()==3,'B cascade validation (3 steps) + bronze reward + confetti: '+txt(pg,'#boom'))
    ok('90 XP' in txt(pg,'#skLv'),'B XP counted: '+re.sub(r'\s+',' ',txt(pg,'#skLv'))[:60])
    pg.screenshot(path=SH+'v5_skill_reward.png');pg.wait_for_timeout(2900)
    pg.click('[data-sk="traction:3"]');pg.wait_for_timeout(250)
    ok('Niveau 2' in txt(pg,'#boom'),'B level up reward: '+txt(pg,'#boom'))
    pg.wait_for_timeout(2900)
    ok('t2' in pg.get_attribute('#sk-traction','class'),'B silver tier at 4/8')
    pg.screenshot(path=SH+'v5_skills.png',full_page=True)
    pg.click('[data-sk="traction:3"]');pg.wait_for_timeout(100);pg.click('[data-sk="traction:3"]');pg.wait_for_timeout(200)
    ok(pg.locator('#sk-traction li.done').count()==3,'B un-validate a step (double tap)')
    # outils
    pg.click('#tTools');pg.wait_for_timeout(300)
    ok(txt(pg,'#hello')=='Outils' and pg.locator('#tmSeg button').count()==4,'B Outils page')
    pg.click('[data-tmtab="pyr"]');pg.wait_for_timeout(200)
    ok(pg.locator('.pyc').count()>=4 and 'Tractions · 10' in txt(pg,'.pyl'),'B saved pyramids list')
    pg.click('.pyc:has-text("Tractions") .pym');pg.wait_for_timeout(200)
    r=re.sub(r'\s+',' ',txt(pg,'.rests'))
    ok(all(t in r for t in ['1 rép. 15 s','2 rép. 19 s','5 rép. 30 s','6 rép. 45 s','8 rép. 1:00','9 rép. 1:30','10 rép. 2:00']),'B tractions rests from notes: '+r)
    ok('= 100 rép.' in txt(pg,'.pyprev'),'B tractions total 100')
    pg.screenshot(path=SH+'v5_pyr.png',full_page=True)
    pg.click('.pyc:has-text("Pompes") .pym');pg.wait_for_timeout(200)
    r=re.sub(r'\s+',' ',txt(pg,'.rests'));ok('= 289 rép.' in txt(pg,'.pyprev') and '17 rép. 2:30' in r and '14 rép. 2:30' in r,'B pompes 17 (289), 2:30 at 14-17')
    pg.click('.pyc:has-text("Dips") .pym');pg.wait_for_timeout(200)
    r=re.sub(r'\s+',' ',txt(pg,'.rests'));ok('11 rép. 2:30' in r and '= 121 rép.' in txt(pg,'.pyprev'),'B dips 11, last step 2:30')
    pg.click('.pyc:has-text("Tractions") .pym');pg.wait_for_timeout(200)
    n0=pg.locator('.trg').count();pg.click('[data-radd]');pg.wait_for_timeout(100);ok(pg.locator('.trg').count()==n0+1,'B add a range')
    pg.click('[data-rdl="%d"]'%n0);pg.wait_for_timeout(100);ok(pg.locator('.trg').count()==n0,'B remove a range')
    pg.click('[data-rx="0:x:5"]');pg.wait_for_timeout(100);ok('1 rép. 20 s' in re.sub(r'\s+',' ',txt(pg,'.rests')),'B edit range rest')
    pg.click('[data-pynew]');pg.fill('#pyEx','Muscle-up');pg.click('[data-stp="pyTop:-1"]');pg.click('[data-presave="pyr"]');pg.wait_for_timeout(200)
    ok('Muscle-up · 9' in txt(pg,'.pyl'),'B new pyramid saved')
    pg.click('[data-tmtab="rest"]');pg.click('[data-rsec="30"]');pg.wait_for_timeout(300);pg.click('#tmo [data-tm="min"]');pg.click('#tpill [data-tm="stop"]');pg.wait_for_timeout(1500)
    ok(not pg.locator('#tmo').is_visible() and not pg.locator('#tpill').is_visible(),'B rest timer cancel')
    # plus : échauffement / conseils / tutos
    pg.click('#tPlus');pg.wait_for_timeout(300)
    ok(pg.locator('#plusSeg button').count()==3 and txt(pg,'#hello')=='Échauffement','B Plus > Échauffement')
    pg.click('[data-wum="salle"]');pg.wait_for_timeout(100);w=txt(pg,'#wuBox')
    ok(all(t in w for t in ['5 min de vélo','Chauffer la colonne avec des rotations de colonne','Rotations de cou pour les cervicales','Juste la coiffe des rotateurs','Rotations externes','Rotations internes','monter en charge','1 minute de repos','mobilité et de souplesse']) and 'Diego' not in w,'B salle warm-up texts')
    pg.fill('#wuW','70');pg.wait_for_timeout(100);c=txt(pg,'#wuCalc');ok('35 kg' in c and '52,5 kg' in c and '62,5 kg' in c,'B 70 kg -> 5 x 35 kg: '+c)
    pg.screenshot(path=SH+'v5_wu.png',full_page=True)
    pg.click('[data-wum="street"]');pg.wait_for_timeout(100);w=txt(pg,'#wuBox')
    ok(all(t in w for t in ['corde à sauter','Coiffe des rotateurs','Omoplates','Pecs','Biceps','Triceps','Dislocations','Rotations d\'épaule avec les anneaux']) and 'articulaire' not in w,'B street warm-up texts')
    pg.screenshot(path=SH+'v5_wu_street.png',full_page=True)
    pg.click('[data-xt="adv"]');pg.wait_for_timeout(300);a=txt(pg,'#advBox')
    ok(txt(pg,'#hello')=='Conseils' and '2 min 45' in a and 'demander conseil à Diego' in a,'B Conseils page')
    pg.click('[data-adv="rest"]');pg.wait_for_timeout(300);ok(pg.locator('#tmo').is_visible() and '3:00' in txt(pg,'#tBig') or '2:59' in txt(pg,'#tBig'),'B advice starts a 3 min rest');pg.click('#tmo [data-tm="stop"]')
    pg.click('[data-xt="tuto"]');pg.wait_for_timeout(300)
    ok(txt(pg,'#hello')=='Tutos' and pg.locator('#guideList .gcard').count()>5,'B Tutos page with guide')
    pg.fill('#lkU','Regarde ça https://youtu.be/dQw4w9WgXcQ top');pg.select_option('#lkC','skill');pg.select_option('#lkK','traction');pg.click('#lkAdd');pg.wait_for_timeout(300)
    ok(pg.locator('.lk').count()==1 and pg.locator('.lk .lkth').count()==1 and pg.get_attribute('.lk a','href')=='https://youtu.be/dQw4w9WgXcQ','B YouTube link saved (thumbnail block)')
    pg.fill('#lkU','https://www.icloud.com/notes/0abcDEF');pg.select_option('#lkC','note');pg.fill('#lkT','Pyramide');pg.click('#lkAdd');pg.wait_for_timeout(200)
    ok('Pyramide' in txt(pg,'#linkList') and '📝 Notes' in txt(pg,'#linkList'),'B note link saved')
    pg.screenshot(path=SH+'v5_tutos.png',full_page=True)
    pg.click('#guideList [data-guide="Tractions"]');pg.wait_for_timeout(200);pg.click('#gbox [data-lknew]');pg.wait_for_timeout(500)
    ok(pg.input_value('#lkC')=='ex' and pg.input_value('#lkK')=='Tractions','B "+ vidéo" from guide pre-fills the form')
    pg.goto(U+'#skills');pg.wait_for_timeout(300)
    if not pg.locator('#sk-traction .path').count():pg.click('[data-skopen="traction"]')
    ok(pg.locator('#sk-traction .lkm').count()==1,'B tuto shown in the skill card')
    # réglages
    pg.click('#gear');pg.wait_for_timeout(300)
    ok(txt(pg,'#hello')=='Réglages' and pg.locator('#back').is_visible() and not pg.locator('#gear').is_visible(),'B settings page via gear')
    ok(pg.locator('#iconBox .ict').count()==4 and pg.locator('#setFav').count()==0,'B icon picker, no "habituels"')
    pg.click('#iconBox [data-icon="loup"]');pg.wait_for_timeout(200)
    ok('icon-loup-180.png' in pg.get_attribute('link[rel="apple-touch-icon"]','href'),'B icon change')
    pg.screenshot(path=SH+'v5_settings.png',full_page=True)
    pg.click('[data-thm="light"]');pg.wait_for_timeout(200)
    pg.click('#back');pg.wait_for_timeout(300);ok('#skills' in pg.url,'B back returns to previous page')
    pg.goto(U+'#accueil');pg.wait_for_timeout(400);pg.screenshot(path=SH+'v5_home_light.png',full_page=True)
    pg.goto(U+'#outils');pg.wait_for_timeout(300);pg.click('[data-tmtab="pyr"]');pg.wait_for_timeout(200);pg.screenshot(path=SH+'v5_pyr_light.png',full_page=True)
    pg.goto(U+'#reglages');pg.wait_for_timeout(200);pg.click('[data-thm="dark"]')
    # formulaire : dernière perf en gris
    pg.goto(U+'#accueil');pg.wait_for_timeout(300);pg.click('#hStart [data-go="note"]');pg.wait_for_timeout(300)
    ok('Tes plus fréquents' in txt(pg,'#cEx'),'B form: "Tes plus fréquents"')
    pg.click('#cEx [data-ex="Tractions"] >> nth=0');pg.wait_for_timeout(150)
    ok(pg.get_attribute('[data-pf="Tractions"][data-pk="r"]','placeholder')=='12','B form: last perf as placeholder')
    pg.click('#cancel')
    # carte image
    pg.goto(U+'#calendrier');pg.wait_for_timeout(300);pg.click('[data-k="2026-11-25"]');pg.click('#detail [data-more]');pg.wait_for_timeout(200)
    with pg.expect_download() as dl:pg.click('[data-sact^="share:"]')
    d=dl.value;d.save_as(SH+'v5_card.png');ok(d.suggested_filename.startswith('seance-'),'B share image')
    ok(txt(pg,'#hello')=='Salut Diego !','B calendar header "Salut Diego !"')
    ctx.close()
    # ---------- C : pop-up « bon retour » ----------
    D2=dict(DATA);D2['v']=4;D2['bilanSeen']='2026-10';D2['lastSeen']=int(time.time()*1000)-8*3600*1000;D2.pop('live',None)
    ctx,pg=mk(b,D2)
    pg.goto(U);pg.wait_for_timeout(2600)
    ok(pg.locator('#hey').is_visible() and '!' in txt(pg,'#hey h2'),'C welcome-back popup: '+txt(pg,'#hey h2')+' / '+txt(pg,'#hey p'))
    pg.screenshot(path=SH+'v5_hello.png')
    pg.click('#heyOk');pg.wait_for_timeout(400);ok(pg.locator('#hey').count()==0,'C popup closes')
    ctx.close()
    # ---------- D : pyramide avec horloge simulée ----------
    ctx,pg=mk(b,D2)
    pg.clock.install(time='2026-11-26T10:00:00');pg.goto(U+'#outils');pg.clock.run_for(2500)
    if pg.locator('#hey').count():pg.click('#heyOk');pg.clock.run_for(400)
    pg.click('[data-tmtab="pyr"]');pg.click('.pyc:has-text("Tractions") [data-pyrun]');pg.clock.run_for(300)
    ok('Tractions · Marche 1/19' in txt(pg,'#tLab'),'D pyramid run: '+txt(pg,'#tLab'))
    pg.click('[data-tm="pdone"]');pg.clock.run_for(300);ok('0:15' in txt(pg,'#tBig'),'D rest after step 1 = 15 s')
    for i in range(5):
        pg.click('[data-tm="pskip"]');pg.clock.run_for(400);pg.click('[data-tm="pdone"]');pg.clock.run_for(300)
    ok('0:45' in txt(pg,'#tBig') and '7 rép.' in txt(pg,'#tLab'),'D rest after step 6 = 45 s: '+txt(pg,'#tBig')+' '+txt(pg,'#tLab'))
    pg.click('#tmo [data-tm="stop"]')
    ctx.close()
    # ---------- E : nouvelle version ----------
    ctx,pg=mk(b,D2)
    ctx.route('**/version.json*',lambda r:r.fulfill(status=200,content_type='application/json',body='{"v":"9.9.9"}'))
    pg.goto(U);pg.wait_for_timeout(4200)
    ok(pg.locator('#upd').is_visible(),'E update banner')
    ctx.close()
    b.close()
except Exception as e:
    import traceback;tb=traceback.extract_tb(e.__traceback__);ln=[f for f in tb if f.filename.endswith('t15.py')][-1]
    log.append('FAIL exception line %d: %s | %s'%(ln.lineno,ln.line,str(e).split(chr(10))[0]))
print('\n'.join(log))
print('ERRORS:',errs if errs else 'none')
print('%d/%d OK'%(sum(1 for l in log if l.startswith('OK')),len(log)))
