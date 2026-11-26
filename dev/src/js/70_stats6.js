/* ===================== v6 : calendrier, stats, mensurations ===================== */
/* ---- C4 : graphiques animés et touchables ---- */
function chart6(svg,c){const sig=JSON.stringify(c.pts.map(p=>p.v));const first=svg._sig!==sig;svg._sig=sig;
  if(first&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const ln=[...svg.querySelectorAll('path')].find(p=>p.getAttribute('fill')==='none'&&!p.getAttribute('stroke-dasharray'));
    if(ln){try{const L=ln.getTotalLength();ln.style.strokeDasharray=L;ln.style.strokeDashoffset=L;ln.getBoundingClientRect();ln.style.transition='stroke-dashoffset 1.1s cubic-bezier(.3,.8,.3,1)';ln.style.strokeDashoffset='0'}catch(e){}}
    svg.querySelectorAll('rect[rx]').forEach((r,i)=>{r.style.transformBox='fill-box';r.style.transformOrigin='50% 100%';r.style.animation='bgrow .7s '+(i*25)+'ms cubic-bezier(.3,1.3,.5,1) both'});
    svg.querySelectorAll('path[fill^="url(#gArea"]').forEach(a=>{a.style.animation='fadein .9s .4s both'})}
  const pts=[...svg.querySelectorAll('circle')].map(e=>[+e.getAttribute('cx'),+e.getAttribute('cy')]);const bars=[...svg.querySelectorAll('rect[rx]')].map(e=>[+e.getAttribute('x')+(+e.getAttribute('width'))/2,+e.getAttribute('y')]);const P=pts.length===c.pts.length?pts:bars.length===c.pts.length?bars:null;if(!P)return;
  const f=(c.o&&c.o.fmt)||fmtN;
  const show=x=>{const r=svg.getBoundingClientRect(),W=r.width;let i=0,b=1e9;P.forEach((p,j)=>{const d=Math.abs(p[0]-x);if(d<b){b=d;i=j}});const p=P[i],d=c.pts[i];let g=svg.querySelector('.tip6');if(!g){g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','tip6');svg.appendChild(g)}
    const t=esc((d.t||f(d.v))+'')+' · '+esc(d.l||''),w=Math.max(70,t.length*7.2+20),bx=Math.max(4,Math.min(W-w-4,p[0]-w/2)),by=Math.max(2,p[1]-44);
    g.innerHTML='<line x1="'+p[0]+'" x2="'+p[0]+'" y1="'+(by+30)+'" y2="'+(svg.clientHeight-24)+'" class="tl"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="7" class="tc"/><rect x="'+bx+'" y="'+by+'" width="'+w+'" height="28" rx="10" class="tb"/><text x="'+(bx+w/2)+'" y="'+(by+19)+'" text-anchor="middle" class="tt">'+t+'</text>'};
  if(svg._t6)return;svg._t6=1;svg.style.touchAction='pan-y';
  const loc=e=>{const r=svg.getBoundingClientRect();return e.clientX-r.left};
  svg.addEventListener('pointerdown',e=>{svg._P=P;show(loc(e))});svg.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')show(loc(e))});
  svg.addEventListener('pointerleave',()=>{setTimeout(()=>{const g=svg.querySelector('.tip6');if(g)g.remove()},1600)})}
/* ---- Z2 : mensurations (poids, tour de taille) ---- */
const MZ={poids:['Poids','kg','Ton poids en kg',20,400],taille:['Tour de taille','cm','Tour de taille en cm',40,200]};
let mzK='poids';
const mzList=k=>(k==='poids'?S.bw:S.meas[k]||[]).slice().sort((a,b)=>a.d<b.d?-1:1);
function renderBW(){const sec=$('bwIn').closest('section');const h=sec.querySelector('h2');if(h)h.textContent='Mensurations';
  let sg=$('mzSeg');if(!sg){sg=document.createElement('div');sg.id='mzSeg';sg.className='seg full';h.after(sg)}
  sg.innerHTML=Object.keys(MZ).map(k=>'<button type="button" data-mz="'+k+'" aria-pressed="'+(mzK===k)+'">'+MZ[k][0]+'</button>').join('');
  const m=MZ[mzK],L=mzList(mzK),last=L[L.length-1];$('bwIn').placeholder=m[2];$('bwIn').min=m[3];$('bwIn').max=m[4];
  $('bwSub').textContent=last?'Dernière mesure : '+fmtN(last.v)+' '+m[1]+' le '+dLong(last.d)+(L.length>1?' · '+(last.v-L[0].v>=0?'+':'−')+fmtN(Math.abs(last.v-L[0].v))+' '+m[1]+' depuis le '+dLong(L[0].d):'')+'.':(mzK==='poids'?'Note ton poids de temps en temps pour suivre son évolution.':'Mesure au même endroit à chaque fois, muscle relâché.');
  $('cBW').hidden=L.length<2;if(L.length>=2)vChart('cBW',L.map(x=>({v:x.v,l:dShort(x.d),d:x.d})),m[1]);
  $('bwList').innerHTML=L.slice(-6).reverse().map(x=>'<span class="bwi">'+esc(dShort(x.d))+' · <b>'+fmtN(x.v)+' '+m[1]+'</b><button type="button" data-mzdel="'+x.d+'" aria-label="Supprimer cette mesure">×</button></span>').join('')}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.dataset.mz){mzK=t.dataset.mz;renderBW();return}
  if(t.dataset.mzdel){if(mzK==='poids')S.bw=S.bw.filter(x=>x.d!==t.dataset.mzdel);else S.meas[mzK]=S.meas[mzK].filter(x=>x.d!==t.dataset.mzdel);save();renderBW();e.stopPropagation();return}
  if(t.id==='bwAdd'&&mzK!=='poids'){e.stopPropagation();const m=MZ[mzK],v=parseFloat(String($('bwIn').value).replace(',','.'));if(!(v>=m[3]&&v<=m[4])){toast('Entre une valeur entre '+m[3]+' et '+m[4]+' '+m[1]);return}S.meas[mzK]=S.meas[mzK].filter(x=>x.d!==TK);S.meas[mzK].push({d:TK,v:Math.round(v*10)/10});$('bwIn').value='';save();renderBW();toast('Mesure notée ✓')}},true);
/* ---- C5 : un graphique à la fois (carrousel) ---- */
function car6(){const v=$('vGr');if(!v||$('car6'))return;const ids=['cEvo','cProg','cBW'],secs=ids.map(i=>$(i)&&$(i).closest('section')).filter(Boolean);if(secs.length<2)return;
  const w=document.createElement('section');w.className='wide car6w';w.innerHTML='<div class="car6" id="car6"></div><div class="cdots" id="cdots"></div>';secs[0].before(w);const c=w.firstChild;secs.forEach(s=>{s.classList.add('slide6');c.appendChild(s)});
  $('cdots').innerHTML=secs.map((s,i)=>'<button type="button" data-cdot="'+i+'" aria-label="Graphique '+(i+1)+'"'+(i?'':' aria-current="true"')+'></button>').join('');
  c.addEventListener('scroll',()=>{const i=Math.round(c.scrollLeft/c.clientWidth);$('cdots').querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-current',String(j===i)))},{passive:true})}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cdot]');if(!b)return;const c=$('car6');c.scrollTo({left:c.clientWidth*+b.dataset.cdot,behavior:'smooth'})});
/* ---- C6 : toi il y a 3 mois / aujourd'hui ---- */
function bestIn(x,a,b){let best=null;S.sessions.forEach(s=>{if(s.date<a||s.date>b)return;const p=s.perf&&s.perf[x];if(!p)return;const v=p.kg>0?['kg',p.kg]:p.sec>0?['sec',p.sec]:p.r>0?['reps',p.r]:null;if(!v)return;if(!best||v[1]>best[1])best=v});return best}
function cmpData(){const now=TK,a1=key(add(T,-29)),b0=key(add(T,-89)),a0=key(add(T,-119));return favList().slice(0,5).map(x=>{const o=bestIn(x,a0,b0),n=bestIn(x,a1,now);return o&&n&&o[0]===n[0]?{x,u:n[0],o:o[1],n:n[1]}:null}).filter(Boolean).slice(0,4)}
function cmpHtml(D){return '<div class="cmp6">'+D.map(d=>{const df=Math.round((d.n-d.o)*10)/10,u=unitL(d.u);return '<div class="cmpr"><b>'+esc(d.x)+'</b><span class="co">'+fmtN(d.o)+'</span>'+ico('chev')+'<span class="cn">'+fmtN(d.n)+' <small>'+esc(u)+'</small></span><i class="'+(df>0?'up':df<0?'dn':'eq')+'">'+(df>0?'+':'')+fmtN(df)+'</i></div>'}).join('')+'</div>'}
function cmpCard(){const D=cmpData();if(!D.length)return '';return '<div class="hc cmpc"><span class="hcic">'+ico('chart')+'</span><div><p class="kick">Toi il y a 3 mois → aujourd\'hui</p>'+cmpHtml(D)+'</div></div>'}
function cmpPanel(){const v=$('vGr');if(!v)return;let p=$('cmp6p');if(!p){p=document.createElement('section');p.id='cmp6p';p.className='panel wide';const k=$('mK').closest('section');k.after(p)}const D=cmpData();
  p.innerHTML='<h2 class="t">Toi il y a 3 mois → aujourd\'hui</h2>'+(D.length?'<p class="findsub">Ta meilleure perf sur 30 jours, il y a 3 mois et maintenant.</p>'+cmpHtml(D):emptyArt('Pas encore assez d\'historique','Note tes perfs quelques semaines : la comparaison apparaîtra ici.','idle'))}
function statsExtras(){car6();cmpPanel();monthGlance();typesDonut()}
/* ---- v6.1 : le mois en un coup d'œil (calendrier à pastilles) ---- */
function monthGlance(){const k=$('mK');if(!k)return;k.classList.add('mk6');const y=T.getFullYear(),m=T.getMonth(),dim=new Date(y,m+1,0).getDate(),off=(new Date(y,m,1).getDay()+6)%7,L=fS(),by={};
  L.forEach(s=>{if(s.date.slice(0,7)===y+'-'+pad(m+1))(by[s.date]=by[s.date]||[]).push(s)});
  let h='<div class="mgl" aria-hidden="true">'+DOWI().split('').map(d=>'<i class="mgd">'+d+'</i>').join('');for(let i=0;i<off;i++)h+='<span class="mge"></span>';
  for(let d=1;d<=dim;d++){const dk=y+'-'+pad(m+1)+'-'+pad(d),ss=by[dk],fut=dk>TK,ty=ss&&ss[0].types&&ss[0].types.find(okT),c=ty?(TY.find(t=>t[0]===ty)||[])[3]:'';
    h+='<span class="mgc'+(ss?' on':'')+(fut?' fut':'')+(dk===TK?' td':'')+(isRest(dk)?' rs':'')+'"'+(ss?' style="--c:'+(c||curAcc())+'"':'')+'>'+(ss&&ss.length>1?'<b>'+ss.length+'</b>':'')+'</span>'}
  let g=$('mGlance');if(!g){g=document.createElement('div');g.id='mGlance';k.before(g)}g.innerHTML=h+'</div>'}
/* ---- v6.1 : types de séance en anneau ---- */
function typesDonut(){const box=$('gTy');if(!box)return;const y=T.getFullYear(),m=T.getMonth(),from=key(new Date(y,m-2,1)),R=stats(fS().filter(s=>s.date>=from)),used=TY.filter(t=>R.t[t[0]]),tot=used.reduce((a,t)=>a+R.t[t[0]],0);if(!tot)return;
  const C=2*Math.PI*40;let acc=0,arcs='';used.forEach(t=>{const v=R.t[t[0]],len=C*v/tot;arcs+='<circle cx="50" cy="50" r="40" fill="none" stroke="'+t[3]+'" stroke-width="16" stroke-dasharray="'+Math.max(0,len-1.5).toFixed(2)+' '+C.toFixed(2)+'" stroke-dashoffset="'+(-acc).toFixed(2)+'" transform="rotate(-90 50 50)"/>';acc+=len});
  const top=used.slice().sort((a,b)=>R.t[b[0]]-R.t[a[0]])[0];
  box.innerHTML='<div class="tyd"><span class="tyr"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--card2)" stroke-width="16"/>'+arcs+'</svg><span><b>'+Math.round(R.t[top[0]]/tot*100)+' %</b><small>'+esc(top[1].replace(/ \(.*\)/,''))+'</small></span></span><div class="tyl">'+used.map(t=>'<span class="tyc" style="--c:'+t[3]+'"><i></i>'+esc(t[1].replace(/ \(.*\)/,''))+'</span>').join('')+'</div></div>'}
function renderStatsPage(){renderStatsPage5();statsExtras()}
/* ---- C8 : bilan du mois en carte postale ---- */
function showBilan(mk){const [y,m]=mk.split('-').map(Number),D=bilanData(mk),pd=new Date(y,m-2,1),P=bilanData(pd.getFullYear()+'-'+pad(pd.getMonth()+1)),mn=mName(y,m-1,'long'),pn=mName(pd.getFullYear(),pd.getMonth(),'long'),d=D.n-P.n,de=/^[aeiouyh]/i.test(mn)?'d\'':'de ';
  let o=$('bil');if(!o){o=document.createElement('div');o.id='bil';o.className='onb bil pc6';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');document.body.appendChild(o)}
  const li=[D.ex?'<li>Exercice le plus fait : <b>'+esc(D.ex)+'</b> ('+D.exN+' fois)</li>':'',D.pl?'<li>Lieu favori : <b>'+esc(plN[D.pl]||D.pl)+'</b></li>':'',D.bw?'<li>Meilleure semaine : <b>'+D.bw+' séance'+(D.bw>1?'s':'')+'</b></li>':'',(P.n||D.n)?'<li>'+(d>0?'<b>+'+d+' séance'+(d>1?'s':'')+'</b> par rapport à '+esc(pn):d<0?'<b>'+d+' séance'+(d<-1?'s':'')+'</b> par rapport à '+esc(pn):'Autant de séances qu\'en '+esc(pn))+'</li>':''].join('');
  o.innerHTML='<div class="pcard"><div class="pcpic">'+scene(D.pl||'street',mk+'-15')+'<span class="stamp"><b>'+esc(mn.slice(0,4).toUpperCase())+'</b><i>'+y+'</i></span><span class="pmark">'+esc(mn)+'<br>'+y+'</span></div><div class="pcb"><p class="kick">Bilan du mois</p><h2>Ton mois '+de+esc(mn)+'</h2><div class="kp"><div><b data-n="'+D.n+'">'+D.n+'</b><span>séances</span></div><div><b data-n="'+D.days+'">'+D.days+'</b><span>jours actifs</span></div><div><b data-n="'+D.dur+'" data-f="dur">'+fmtDur(D.dur)+'</b><span>temps total</span></div><div><b data-n="'+D.recs+'">'+D.recs+'</b><span>record'+(D.recs>1?'s':'')+' battu'+(D.recs>1?'s':'')+'</span></div></div>'+(li?'<ul class="bl">'+li+'</ul>':'')+'<p class="pcsig">'+esc(D.n>=12?'Mois énorme. Continue sur cette lancée !':D.n>=6?'Belle régularité, continue comme ça !':D.n>0?'Chaque séance compte. On vise un peu plus ce mois-ci ?':'Nouveau mois, nouveau départ !')+'</p><div class="acts"><button type="button" class="btn ghost" data-shm="'+mk+'">'+ico('share')+' Partager</button><button type="button" class="btn" id="bilOk">Continuer</button></div></div></div>';
  o.hidden=false;countUp(o)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-shm]');if(b&&typeof monthCard==='function')monthCard(b.dataset.shm)});
/* ---- C3 : glisser une séance d'un jour à l'autre (vue mois) ---- */
let cdT=0,cd=null;
document.addEventListener('pointerdown',e=>{const day=e.target.closest('#grid.grid .day.has');if(!day||e.button>0)return;const k=day.dataset.k,x0=e.clientX,y0=e.clientY;clearTimeout(cdT);
  const cancel=()=>{clearTimeout(cdT);document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',cancel)};const mv=ev=>{if(!cd&&Math.hypot(ev.clientX-x0,ev.clientY-y0)>9)cancel()};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',cancel);
  cdT=setTimeout(()=>{cancel();const ss=sOf(k);if(!ss.length)return;window.__cdrag=1;lpFired=Date.now();const g=document.createElement('div');g.className='cdg';g.innerHTML=scene(ss[0].place,k)+'<b>'+parse(k).getDate()+'</b>';document.body.appendChild(g);day.classList.add('lift');cd={k,id:ss[ss.length-1].id,g,day,tgt:null};cdMove(x0,y0)},430)});
function cdMove(x,y){if(!cd)return;cd.g.style.transform='translate('+(x-36)+'px,'+(y-60)+'px) rotate(-4deg)';const el=document.elementFromPoint(x,y),d=el&&el.closest('#grid .day');document.querySelectorAll('#grid .day.drop').forEach(z=>z.classList.remove('drop'));cd.tgt=null;if(d&&d.dataset.k!==cd.k&&d.dataset.k<=TK){d.classList.add('drop');cd.tgt=d.dataset.k}}
document.addEventListener('pointermove',e=>{if(cd)cdMove(e.clientX,e.clientY)});
document.addEventListener('touchmove',e=>{if(cd){e.preventDefault();const t=e.touches[0];cdMove(t.clientX,t.clientY)}},{passive:false});
function cdEnd(){if(!cd)return;const c=cd;cd=null;c.g.remove();c.day.classList.remove('lift');document.querySelectorAll('#grid .day.drop').forEach(z=>z.classList.remove('drop'));setTimeout(()=>{window.__cdrag=0},60);
  if(!c.tgt)return;const s=S.sessions.find(q=>q.id===c.id);if(!s)return;const from=s.date;s.date=c.tgt;S.rest=S.rest.filter(k=>k!==c.tgt);sel=c.tgt;render();save();
  snack('Séance déplacée au '+dLong(c.tgt),'Annuler',()=>{s.date=from;sel=from;render();save()})}
document.addEventListener('pointerup',cdEnd);document.addEventListener('touchend',cdEnd);document.addEventListener('pointercancel',cdEnd);

/* ---- v6.1 : badges repliés (6 visibles, le reste au toucher) ---- */
let bdAll=false;
const BD_ICO={'1':'star','10':'star','25':'star','50':'star','100':'trophy','4s':'flame','12s':'flame','R':'trophy','3L':'pin','EM':'emom','E5':'emom','PY':'pyr','P5':'pyr','10↑':'pyr','2h':'clock','AM':'sun','🔥':'flame','4×':'target','MAX':'bolt','S1':'skill','S10':'skill','★':'medal'};
/* ---- D9 : la collection de badges en pin's sur une veste en jean (place fixe par badge) ---- */
const PIN_C={'1':'s','10':'s','25':'s','50':'s','100':'s','4s':'w','12s':'w','4×':'w','R':'r','MAX':'r','3L':'p','EM':'t','E5':'t','PY':'t','P5':'t','10↑':'t','2h':'m','AM':'m','🔥':'m','S1':'k','S10':'k','★':'k'};
const PIN_COL={s:'#ff5a5f',w:'#ff8a2a',r:'#f5c542',p:'#2fae63',t:'#3d7be0',m:'#8a5ee0',k:'#ff5fa8'};
const PIN_XY=[[143,66],[177,66],[92,113],[126,111],[160,115],[194,111],[228,113],[92,148],[126,150],[160,146],[194,150],[228,148],[92,184],[126,182],[160,186],[194,182],[228,184],[92,219],[126,221],[160,217],[194,221],[228,219],[42,128],[278,128],[36,172],[284,172],[31,212],[289,212]];
const JACKET='<svg viewBox="0 0 320 300" aria-hidden="true"><path d="M84 40L40 58Q24 64 20 84L8 214Q7 226 19 228L52 232Q62 233 63 222L74 120Z" fill="#3a66a8" stroke="#1b1b1f" stroke-width="4" stroke-linejoin="round"/><path d="M236 40L280 58Q296 64 300 84L312 214Q313 226 301 228L268 232Q258 233 257 222L246 120Z" fill="#3a66a8" stroke="#1b1b1f" stroke-width="4" stroke-linejoin="round"/><path d="M11 202L61 208M309 202L259 208" stroke="#1b1b1f" stroke-width="3"/><path d="M11 210L60 216M309 210L260 216" stroke="#f0a645" stroke-width="2" stroke-dasharray="5 4"/><path d="M84 40Q160 28 236 40L246 120L252 262Q160 272 68 262L74 120Z" fill="#4675b9" stroke="#1b1b1f" stroke-width="4" stroke-linejoin="round"/><path d="M78 92Q120 96 160 106Q200 96 242 92" fill="none" stroke="#1b1b1f" stroke-width="3"/><path d="M78 99Q120 103 160 113Q200 103 242 99" fill="none" stroke="#f0a645" stroke-width="2" stroke-dasharray="5 4"/><path d="M112 110L106 246M208 110L214 246" stroke="#2f5891" stroke-width="3"/><path d="M118 112L112 246M202 112L208 246" stroke="#f0a645" stroke-width="2" stroke-dasharray="5 4"/><path d="M112 34Q160 18 208 34L200 47Q160 37 120 47Z" fill="#35609e" stroke="#1b1b1f" stroke-width="4" stroke-linejoin="round"/><path d="M68 243Q160 253 252 243L253 264Q160 274 67 264Z" fill="#35609e" stroke="#1b1b1f" stroke-width="4" stroke-linejoin="round"/><path d="M72 250Q160 260 248 250" stroke="#f0a645" stroke-width="2" stroke-dasharray="5 4" fill="none"/><circle cx="92" cy="255" r="4.5" fill="#d9a441" stroke="#1b1b1f" stroke-width="2"/><circle cx="228" cy="255" r="4.5" fill="#d9a441" stroke="#1b1b1f" stroke-width="2"/><path d="M98 58Q130 50 160 48" stroke="#fff" stroke-opacity=".18" stroke-width="6" stroke-linecap="round" fill="none"/></svg>';
function renderJacket(b){let j=$('bdJkt');if(!j){j=document.createElement('div');j.id='bdJkt';$('badges').before(j)}const seen=Array.isArray(S.bdSeen)?S.bdSeen:null;let ni=0;
  j.innerHTML='<div class="jkt">'+JACKET+b.map((x,i)=>{const p=PIN_XY[i%PIN_XY.length],cat=PIN_C[x.k]||'m',nw=x.on&&(!seen||!seen.includes(x.k)),r=((i*37)%21)-10;return '<button type="button" class="pin'+(x.on?' on':'')+(cat==='r'?' lt':'')+(nw?' new':'')+'" data-pin="'+i+'" style="left:'+(p[0]/3.2).toFixed(2)+'%;top:'+(p[1]/3).toFixed(2)+'%;--r:'+r+'deg;--pc:'+PIN_COL[cat]+(nw?';--i:'+(ni++):'')+'" aria-label="'+esc(x.t)+'"><b>'+esc(x.k)+'</b></button>'}).join('')+'</div><p class="jinfo" id="bdInfo">Touche un pin\'s pour voir le badge.</p>';
  const on=b.filter(x=>x.on).map(x=>x.k);if(!seen||on.some(k=>!seen.includes(k))){S.bdSeen=on;save()}
  j.onclick=e=>{const p=e.target.closest('[data-pin]');if(!p)return;const x=b[+p.dataset.pin];j.querySelectorAll('.pin.sel').forEach(q=>q.classList.remove('sel'));p.classList.add('sel');$('bdInfo').innerHTML='<b>'+esc(x.t)+'</b> · <span>'+(x.on?'débloqué':'à débloquer')+'</span>'}}
function renderBadges(){const b=badgeList(),on=b.filter(x=>x.on),off=b.filter(x=>!x.on),ord=on.slice().reverse().concat(off),shown=bdAll?ord:ord.slice(0,6);
  $('bdSub').textContent=on.length+' badge'+(on.length>1?'s':'')+' sur '+b.length+' · série actuelle : '+wStreak()+' semaine'+(wStreak()>1?'s':'')+' d\'affilée';
  const box=$('badges');box.classList.add('bd6','jk');box.classList.toggle('all',bdAll);renderJacket(b);
  box.innerHTML=shown.map((x,i)=>'<div class="bd'+(x.on?' on':'')+'" style="--i:'+i+'"><span class="bdm"><b>'+esc(x.k)+'</b></span><span class="bdt">'+esc(x.t)+'</span></div>').join('');
  let more=$('bdMore');if(!more){more=document.createElement('button');more.type='button';more.id='bdMore';more.className='btn ghost sm bdmore';box.after(more)}
  more.hidden=false;more.innerHTML=bdAll?'Réduire '+ico('up'):'Voir les '+b.length+' badges '+ico('down');
  more.onclick=()=>{bdAll=!bdAll;renderBadges();if(!bdAll)box.closest('section').scrollIntoView({block:'start',behavior:'smooth'})}}
