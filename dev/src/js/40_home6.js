/* ===================== v6 : accueil ===================== */
const HCARDS={poids:['Mesures','scale'],nutri:['Nutrition','nut'],notes:['Carnet','note'],prog:['Progrès','chart'],perso:['Ton objectif perso','target'],une:['À la une','sparkles',0],defi:['Défi du mois','trophy',0],recap:['Récap de la semaine','sparkles',0],last:['Dernière séance','cal',0],tip:['Astuce du jour','bulb',0],test:['Test max du mois','bars',0],deload:['Semaine d\'allègement','wave',0],objectif:['Objectif en cours','target',0],skills:['Prochain skill','star',0],compare:['Toi il y a 3 mois','chart',0]}; /* v7 : accueil épuré (poids, nutrition, une seule carte « À la une ») ; « Tes outils » retiré (doublon de l'onglet Outils) */
/* ---- anneau de la semaine animé (A7) ---- */
let ringPrev=null;
function ring(n,goal){const p=Math.min(1,n/goal),C=2*Math.PI*17,p0=ringPrev===null?0:ringPrev;ringPrev=p;
  return '<svg class="ring'+(p>=1?' full':'')+'" viewBox="0 0 44 44" aria-hidden="true" data-p="'+p.toFixed(3)+'"><circle class="rt" cx="22" cy="22" r="17" fill="none" stroke-width="5"/><circle class="rp" cx="22" cy="22" r="17" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="'+(C*p0).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 22 22)"/>'+(p>=1?'<path class="rk" d="M15 22.5l4.5 4.5L29 17.5" fill="none" style="stroke:var(--acct)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>':'')+'</svg>'}
function animRings(){const C=2*Math.PI*17;requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelectorAll('svg.ring[data-p]').forEach(s=>{const c=s.querySelector('.rp');if(c)c.setAttribute('stroke-dasharray',(C*+s.dataset.p).toFixed(1)+' '+C.toFixed(1))})))}
/* ---- flamme de régularité qui évolue (R3) ---- */
function flame(n){const t=n<=0?0:n<10?1:n<20?2:3,sc=n<=0?.72:n<10?.8+Math.min(9,n)*.03:n<20?1.1:1.2,o=['#55555c','#ff6a1a','#2f9bff','#9b5cff'][t],i=['#8a8a92','#ffd23f','#bfe8ff','#efdcff'][t];
  return '<svg class="flame f'+t+'" viewBox="0 0 40 48" style="--sc:'+sc.toFixed(2)+'" aria-hidden="true"><path d="M20 2C22 12 32 16 32 30a12 12 0 0 1-24 0c0-7 4-10 6-14 1 4 3 6 5 6-2-7 0-14 1-20z" fill="'+o+'"/><path d="M20 22c1 5 6 7 6 13a6 6 0 0 1-12 0c0-3 2-5 3-7 0 2 1 3 2 3-1-3 0-6 1-9z" fill="'+i+'"/>'+(t>=2?'<g class="spk" fill="'+(t===3?'#e9d6ff':'#bfe8ff')+'"><circle cx="5" cy="14" r="1.8"/><circle cx="35" cy="9" r="1.5"/><circle cx="37" cy="25" r="1.2"/>'+(t===3?'<circle cx="3" cy="30" r="1.3"/><circle cx="20" cy="1.5" r="1.2"/>':'')+'</g>':'')+'</svg>'}
/* ---- mascotte vivante (V4) ---- */
function mascState(){const td=sOf(TK).length>0,h=new Date().getHours(),wm=monday(T).getTime(),wn=S.sessions.filter(s=>monday(parse(s.date)).getTime()===wm).length,goal=S.goal||3,rec=S.recs.some(r=>r.hist.length>1&&r.hist[r.hist.length-1].d===TK&&r.hist[r.hist.length-1].v>Math.max(...r.hist.slice(0,-1).map(x=>x.v)));
  if(!S.sessions.length)return['wave','grin','mWave'];if(rec)return['flex','grin','mFlex'];if(td&&wn>=goal)return['cheer','grin','mCheer'];if(td)return['thumbs','grin','mDone'];
  if(isRest(TK)||h>=22||h<6)return['sleep','sleep','mSleep'];if(h<11)return['wave','grin','mWave'];return['idle','neutral','mIdle']}
/* D3 : décor derrière le perso selon l'heure (matin : lever de soleil ; soir et nuit : ciel étoilé ; journée : disque d'origine) */
function mascScene(){const h=new Date().getHours();return h>=5&&h<10?'morning':h>=17&&h<21?'evening':h>=21||h<5?'night':''}
function mascHtml(){if(S.masc==='off')return '';const m=mascState(),sc=mascScene();return '<button type="button" class="masc m-'+m[0]+(S.masc==='mini'?' mini':'')+(sc?' scn':'')+'" id="masc" data-say="'+m[2]+'" aria-label="Ton personnage">'+(sc?'<span class="msc sc-'+sc+'" aria-hidden="true"></span>':'')+'<span class="mgr7" aria-hidden="true">'+illGround()+'</span>'+charSvg(myChar({pose:m[0],ex:m[1]}))+'</button>'}
/* v7.3 : toucher le perso de la scène = une répétition de son exercice (animation SMIL préparée par illScene, rep = 1) ; sinon petit saut */
function mascRep(b){const A=b.querySelectorAll('animate,animateTransform');if(!A.length||rmOn())return false;if(b.classList.contains('rep'))return true;const g=b.querySelector('.who7'),d=(+(g&&g.dataset.rd)||1.4)*1000;
  b.classList.add('rep');A.forEach(a=>{try{a.beginElement()}catch(e){}});clearTimeout(mascRep._t);mascRep._t=setTimeout(()=>b.classList.remove('rep'),d+80);return true}
function mascSay(){const b=$('masc');if(!b)return;if(!mascRep(b)){b.classList.remove('jump');void b.offsetWidth;b.classList.add('jump');b.addEventListener('animationend',()=>b.classList.remove('jump'),{once:true})}const p=document.querySelector('#hStart .hmsg');if(!p)return;if(p.dataset.base===undefined)p.dataset.base=p.textContent;
  p.textContent=msg(b.dataset.say||'mIdle');p.classList.remove('say');void p.offsetWidth;p.classList.add('say');clearTimeout(mascSay._t);
  mascSay._t=setTimeout(()=>{if(!p.isConnected)return;p.textContent=p.dataset.base;delete p.dataset.base;p.classList.remove('say')},3600)}
/* ---- illustration d'écran vide (V5) ---- */
const emptyArt=(t,sub,pose)=>'<div class="emp6"><span class="empc">'+charSvg(myChar({pose:pose||'idle',ex:pose==='sleep'?'sleep':'neutral'}))+'</span><div><b>'+esc(t)+'</b>'+(sub?'<p>'+esc(sub)+'</p>':'')+'</div></div>';
/* ---- en-tête ---- */
function hdr6(){const v=curV,hc=v==='home';const h=$('hLogo');if(h&&hc&&!h.firstChild)h.innerHTML=myIconHtml();
  if(v==='set'&&S.setSub&&typeof SETSUB==='object'&&SETSUB[S.setSub]){$('hKick').textContent='Réglages';$('hello').textContent=SETSUB[S.setSub][0]}
  animRings()}
/* ---- accueil ---- */
function relDay2(k){return relDay(k)}
function hcard(attrs,ic,kick,title,sub,extra){return '<button type="button" class="hc"'+attrs+'>'+ic+'<div>'+(kick?'<p class="kick">'+kick+'</p>':'')+(title?'<b>'+title+'</b>':'')+(sub?'<p>'+sub+'</p>':'')+(extra||'')+'</div>'+ico('chev','hcv')+'</button>'}
const icBox=(k,txt)=>'<span class="hcic">'+(txt?esc(txt):ico(k))+'</span>';
/* message du jour (ton choisi dans Réglages > Messages) */
function homeMsg(){const wm=monday(T),days=[0,1,2,3,4,5,6].map(i=>key(add(wm,i))),goal=S.goal||3,wn=S.sessions.filter(s=>days.includes(s.date)).length,ls=lastSess(),gap=ls?Math.round((parse(TK)-parse(ls.date))/864e5):-1;
  if(!S.sessions.length)return msg('first')[2];if(sOf(TK).length)return msg('hDone');if(isRest(TK))return msg('hRest');if(wn>=goal)return msg('hGoal');if(gap>=4)return msg('hGap',{d:gap});if(wn===0)return msg('hNew',{k:goal});return msg('hLeft',{g:goal-wn})}
/* v7.2 : l'accueil est dessiné par home72() (43_home72.js) ; ici, seulement les cartes optionnelles activées dans Réglages */
function renderHome(){const ls=lastSess(),mk=TK.slice(0,7),tdone=Object.keys(obj(S.tests[mk])).length,dl=deloadInfo(),run=noRestRun(),cards=[];
  if(run>=7&&S.restAck!==TK)cards.push('<div class="hc warnc"><span class="bimg">'+BED+'</span><div><b>'+run+' jours d\'affilée sans repos</b><p>Ton corps progresse pendant la récupération : pense à t\'accorder une journée off. 😴</p></div></div>');
  const one=k=>{let h='';
    if(k==='defi'&&typeof chalCard==='function')h=chalCard();
    else if(k==='recap'&&typeof recapCard==='function')h=recapCard();
    else if(k==='last'&&ls){const f=feelOf(ls);h='<button type="button" class="hc" data-goday="'+ls.date+'"><span class="hcpic">'+scene(ls.place,ls.date,{who:1,fam:i7fam([ls],ls.place)})+'</span><div><p class="kick">Dernière séance · '+esc(relDay(ls.date))+'</p><b>'+(ls.ex.length?ls.ex.slice(0,3).map(x=>'<span>'+esc(x)+'</span>').join(', ')+(ls.ex.length>3?' +'+(ls.ex.length-3):''):esc(plN[ls.place]||'Séance'))+'</b><p>'+esc([plN[ls.place],ls.tod?todN[ls.tod]:'',ls.dur?fmtDur(ls.dur):''].filter(Boolean).join(' · '))+(f?' · '+f[1]+' '+f[2]:'')+'</p></div>'+ico('chev','hcv')+'</button>'}
    else if(k==='tip'){const tp=TIPS[Math.floor((T-new Date(T.getFullYear(),0,0))/864e5)%TIPS.length];h=hcard(' data-go="'+tp[2]+'"',icBox('bulb'),'Astuce du jour · '+esc(tp[0]),'',esc(tp[1]),'').replace('<p>','<p class="tipt">')}
    else if(k==='test'&&!tdone)h=hcard(' data-go="tests"',icBox('','MAX'),'Test max de '+esc(mName(T.getFullYear(),T.getMonth(),'long')),'Pas encore fait','Tractions, pompes et dips : note ton maximum du mois. 📈');
    else if(k==='deload'&&dl.n>=6&&!dl.on)h=hcard(' data-go="adv"',icBox('','−50%'),'Semaine d\'allègement',dl.n+' semaines depuis la dernière','Environ 50 % de volume en moins, même charge.');
    else if(k==='objectif'){const g=S.goals.find(x=>!x.done);if(g){const cur=goalCur(g),p=Math.min(1,cur/g.target);h=hcard(' data-go="records"',icBox('',Math.round(p*100)+'%'),'Objectif en cours',esc(goalTxt(g)),'','<span class="track"><i style="width:'+(p*100).toFixed(1)+'%"></i></span>')}}
    else if(k==='skills'){const sk=skNext();if(sk)h=hcard(' data-go="skills"','<span class="hcic emo">'+sk.e+'</span>','Skills · <span>'+esc(sk.n)+'</span> · '+sk.done+'/'+sk.tot,esc(sk.next),'Ta prochaine étape à débloquer')}
    else if(k==='compare'&&typeof cmpCard==='function')h=cmpCard();
    return h};
  /* « À la une » (si activée) : une seule carte, la plus utile du moment */
  const onK=S.cards.filter(c=>c.on).map(c=>c.k),UNE=[T.getDate()<=12?'test':'',dl.n>=6&&!dl.on?'deload':'',S.chal||T.getDate()<=7?'defi':'','objectif','skills','last','tip'].filter(k=>k&&!onK.includes(k));
  S.cards.filter(c=>c.on&&!W72.includes(c.k)&&c.k!=='perso').forEach(c=>{let h='';if(c.k==='une'){for(const k of UNE){h=one(k);if(h)break}if(h)h=h.replace(/^<(button|div|section) class="/,'<$1 class="une7 ')}else h=one(c.k);if(h)cards.push(h)});
  home72(cards.join(''))}
document.addEventListener('click',e=>{const b=e.target.closest('#masc');if(b){mascSay();return}const g=e.target.closest('[data-go6]');if(g){location.hash='#reglages-'+g.dataset.go6}});
