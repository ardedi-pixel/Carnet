/* ===================== v6 : accueil ===================== */
const HCARDS={perso:['Ton objectif perso','target'],defi:['Défi du mois','trophy'],recap:['Récap de la semaine','sparkles'],outils:['Tes outils','tools'],last:['Dernière séance','cal'],tip:['Astuce du jour','bulb'],test:['Test max du mois','bars'],deload:['Semaine d\'allègement','wave'],objectif:['Objectif en cours','target'],skills:['Prochain skill','star'],compare:['Toi il y a 3 mois','chart',0]};
const TOOLS6=[['rest','timer','Repos'],['emom','emom','EMOM'],['pyr','pyr','Pyramide'],['wu','flame','Échauffement']];
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
function mascHtml(){if(S.masc==='off')return '';const m=mascState(),sc=mascScene();return '<button type="button" class="masc m-'+m[0]+(S.masc==='mini'?' mini':'')+(sc?' scn':'')+'" id="masc" data-say="'+m[2]+'" aria-label="Ton personnage">'+(sc?'<span class="msc sc-'+sc+'" aria-hidden="true"></span>':'')+charSvg(myChar({pose:m[0],ex:m[1]}))+'</button>'}
function mascSay(){const b=$('masc');if(!b)return;b.classList.remove('jump');void b.offsetWidth;b.classList.add('jump');b.addEventListener('animationend',()=>b.classList.remove('jump'),{once:true});let bub=$('mbub');if(bub)bub.remove();bub=document.createElement('div');bub.id='mbub';bub.className='mbub';bub.textContent=msg(b.dataset.say||'mIdle');b.parentNode.appendChild(bub);clearTimeout(mascSay._t);mascSay._t=setTimeout(()=>{bub.classList.add('out');setTimeout(()=>bub.remove(),300)},3200)}
/* ---- illustration d'écran vide (V5) ---- */
const emptyArt=(t,sub,pose)=>'<div class="emp6"><span class="empc">'+charSvg(myChar({pose:pose||'idle',ex:pose==='sleep'?'sleep':'neutral'}))+'</span><div><b>'+esc(t)+'</b>'+(sub?'<p>'+esc(sub)+'</p>':'')+'</div></div>';
/* ---- en-tête ---- */
function hdr6(){const v=curV,hc=v==='home'||v==='cal';const h=$('hLogo');if(h&&hc&&!h.firstChild)h.innerHTML=myIconHtml();
  if(v==='set'&&S.setSub&&typeof SETSUB==='object'&&SETSUB[S.setSub]){$('hKick').textContent='Réglages';$('hello').textContent=SETSUB[S.setSub][0]}
  const ts=$('hTools');if(ts&&ts.closest('section'))ts.closest('section').hidden=true;
  animRings()}
/* ---- accueil ---- */
function relDay2(k){return relDay(k)}
function hcard(attrs,ic,kick,title,sub,extra){return '<button type="button" class="hc"'+attrs+'>'+ic+'<div>'+(kick?'<p class="kick">'+kick+'</p>':'')+(title?'<b>'+title+'</b>':'')+(sub?'<p>'+sub+'</p>':'')+(extra||'')+'</div>'+ico('chev','hcv')+'</button>'}
const icBox=(k,txt)=>'<span class="hcic">'+(txt?esc(txt):ico(k))+'</span>';
function renderHome(){const wm=monday(T),days=[0,1,2,3,4,5,6].map(i=>key(add(wm,i))),goal=S.goal||3,wn=S.sessions.filter(s=>days.includes(s.date)).length,left=goal-wn,ls=lastSess(),mk=TK.slice(0,7),tdone=Object.keys(obj(S.tests[mk])).length,dl=deloadInfo(),run=noRestRun(),tds=sOf(TK),cards=[];
  const gap=ls?Math.round((parse(TK)-parse(ls.date))/864e5):-1;
  let hm;if(!S.sessions.length)hm=msg('first')[2];else if(tds.length)hm=msg('hDone');else if(isRest(TK))hm=msg('hRest');else if(wn>=goal)hm=msg('hGoal');else if(gap>=4)hm=msg('hGap',{d:gap});else if(wn===0)hm=msg('hNew',{k:goal});else hm=msg('hLeft',{g:left});
  const tdTxt=tds.length?'<div class="tdsum">'+tds.map(s=>'<span class="tdp">'+ico(s.place==='salle'?'salle':s.place==='garage'?'garage':'street')+'<span><span>'+esc(plN[s.place]||'')+'</span>'+(s.ex.length?' · '+s.ex.slice(0,3).map(x=>'<span>'+esc(x)+'</span>').join(', ')+(s.ex.length>3?' +'+(s.ex.length-3):''):'')+'</span></span>').join('')+'</div>':'';
  $('hStart').innerHTML='<div class="hero'+(S.masc==='off'?' nom':'')+'">'+mascHtml()+'<div class="herot"><p class="kick">'+esc(fmtDay(T))+'</p><h2 class="hbig">Aujourd\'hui</h2><p class="hmsg">'+esc(hm)+'</p>'+tdTxt+'</div></div>'
   +'<div class="wdots">'+days.map((k,i)=>{const n=sOf(k).length,r=!n&&isRest(k);return '<button type="button" class="wdot'+(n?' on':'')+(r?' rest':'')+(k===TK?' td':'')+(k>TK?' fut':'')+'" data-goday="'+k+'" aria-label="'+esc(fmtDay(parse(k)))+(n?', séance':r?', repos':'')+'"><b>'+DOWI()[i]+'</b><i>'+(n?CHK:r?'💤':parse(k).getDate())+'</i></button>'}).join('')+'</div>'
   +'<button type="button" class="btn big'+(tds.length?' ghost':'')+'" data-go="note"><span class="pl6">'+ico('check','okic')+'<b class="plus">+</b></span>'+(tds.length?'Noter une autre séance':'Noter une séance')+'</button>';
  if(run>=7&&S.restAck!==TK)cards.push('<div class="hc warnc"><span class="bimg">'+BED+'</span><div><b>'+run+' jours d\'affilée sans repos</b><p>Ton corps progresse pendant la récupération : pense à t\'accorder une journée off. 😴</p></div></div>');
  S.cards.filter(c=>c.on).forEach(c=>{const k=c.k;let h='';
    if(k==='perso'&&S.goalT)h=hcard(' data-go6="profil"',icBox('target'),'Ton objectif',esc(S.goalT),'');
    else if(k==='defi'&&typeof chalCard==='function')h=chalCard();
    else if(k==='recap'&&typeof recapCard==='function')h=recapCard();
    else if(k==='outils')h='<section class="panel hcp"><h2 class="t">Tes outils</h2><div class="qt">'+TOOLS6.map(x=>'<button type="button" class="qtb" data-go="'+x[0]+'"><span>'+ico(x[1])+'</span>'+x[2]+'</button>').join('')+'</div></section>';
    else if(k==='last'&&ls){const f=feelOf(ls);h='<button type="button" class="hc" data-goday="'+ls.date+'"><span class="hcpic">'+scene(ls.place,ls.date)+'</span><div><p class="kick">Dernière séance · '+esc(relDay(ls.date))+'</p><b>'+(ls.ex.length?ls.ex.slice(0,3).map(x=>'<span>'+esc(x)+'</span>').join(', ')+(ls.ex.length>3?' +'+(ls.ex.length-3):''):esc(plN[ls.place]||'Séance'))+'</b><p>'+esc([plN[ls.place],ls.tod?todN[ls.tod]:'',ls.dur?fmtDur(ls.dur):''].filter(Boolean).join(' · '))+(f?' · '+f[1]+' '+f[2]:'')+'</p></div>'+ico('chev','hcv')+'</button>'}
    else if(k==='tip'){const tp=TIPS[Math.floor((T-new Date(T.getFullYear(),0,0))/864e5)%TIPS.length];h=hcard(' data-go="'+tp[2]+'"',icBox('bulb'),'Astuce du jour · '+esc(tp[0]),'',esc(tp[1]),'').replace('<p>','<p class="tipt">')}
    else if(k==='test'&&!tdone)h=hcard(' data-go="tests"',icBox('','MAX'),'Test max de '+esc(mName(T.getFullYear(),T.getMonth(),'long')),'Pas encore fait','Tractions, pompes et dips : note ton maximum du mois. 📈');
    else if(k==='deload'&&dl.n>=6&&!dl.on)h=hcard(' data-go="adv"',icBox('','−50%'),'Semaine d\'allègement',dl.n+' semaines depuis la dernière','Environ 50 % de volume en moins, même charge.');
    else if(k==='objectif'){const g=S.goals.find(x=>!x.done);if(g){const cur=goalCur(g),p=Math.min(1,cur/g.target);h=hcard(' data-go="records"',icBox('',Math.round(p*100)+'%'),'Objectif en cours',esc(goalTxt(g)),'','<span class="track"><i style="width:'+(p*100).toFixed(1)+'%"></i></span>')}}
    else if(k==='skills'){const sk=skNext();if(sk)h=hcard(' data-go="skills"','<span class="hcic emo">'+sk.e+'</span>','Skills · <span>'+esc(sk.n)+'</span> · '+sk.done+'/'+sk.tot,esc(sk.next),'Ta prochaine étape à débloquer')}
    else if(k==='compare'&&typeof cmpCard==='function')h=cmpCard();
    if(h)cards.push(h)});
  $('hCards').innerHTML=cards.join('');animRings();plxTick()}
document.addEventListener('click',e=>{const b=e.target.closest('#masc');if(b){mascSay();return}const g=e.target.closest('[data-go6]');if(g){location.hash='#reglages-'+g.dataset.go6}});
