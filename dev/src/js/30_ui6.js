/* ===================== v6 : navigation, onglets, animations ===================== */
const TABS6={home:['#accueil','Accueil','home','tHome'],cal:['#calendrier','Calendrier','cal','tCal'],tools:['#outils','Outils','tools','tTools'],pr:['#progres','Progrès','chart','tPr'],plus:['#plus','Plus','plus','tPlus']};
function renderTabs(){const nav=document.querySelector('nav.tabs');if(!nav)return;const vis=S.tabs.order.filter(k=>!S.tabs.off.includes(k));
  const html=S.tabs.order.map(k=>{const t=TABS6[k],h=S.tabs.off.includes(k);return '<a href="'+t[0]+'" id="'+t[3]+'"'+(h?' hidden':'')+' aria-current="'+(curV===k?'page':'false')+'">'+ico(t[2])+'<span>'+t[1]+'</span></a>'}).join('')+'<a href="#competition" id="tCo" hidden style="display:none">Compétition</a>';
  if(nav._h!==html){nav.innerHTML=html;nav._h=html}nav.style.setProperty('grid-template-columns','repeat('+vis.length+',1fr)','important')}
/* ---- ordre des vues pour le sens des transitions ---- */
let prevKey='',prevIdx=0;
function viewKey(){const v=curV;return v==='pr'?'pr:'+S.ptab:v==='plus'?'plus:'+S.xtab:v==='set'?'set:'+(S.setSub||''):v}
function viewIdx(){const v=curV,base=S.tabs.order.indexOf(v==='set'?'plus':v),sub=v==='pr'?['stats','records','skills'].indexOf(S.ptab):v==='plus'?['wu','adv','tuto'].indexOf(S.xtab):v==='set'?(S.setSub?1:0)+.5:0;return (base<0?9:base)*10+sub}
function route(){const h=location.hash.slice(1);if(h==='noter'){history.replaceState(null,'','#accueil');route();setTimeout(()=>goTo('note'),300);return}if(h.startsWith('outils-')){tmTab=h.slice(7)==='pyr'?'pyr':h.slice(7)==='emom'?'emom':'rest';history.replaceState(null,'','#outils')}
  S.setSub=location.hash.slice(1).startsWith('reglages-')?location.hash.slice(10):'';
  route5();renderTabs();if(curV==='plus'){const pb=$('plusBar');let h=$('hidT');if(S.tabs.off.length){if(!h){h=document.createElement('div');h.id='hidT';h.className='hidT';pb.prepend(h)}h.innerHTML=S.tabs.off.map(k=>'<a href="'+TABS6[k][0]+'">'+ico(TABS6[k][2])+TABS6[k][1]+'</a>').join('')}else if(h)h.remove()}
  if(curV==='set'){if(typeof renderSet6==='function')renderSet6()}
  if(typeof hdr6==='function')hdr6();helpify();
  const k=viewKey(),i=viewIdx();
  if(prevKey&&k!==prevKey&&!rmOn()){const dir=i>=prevIdx?'r':'l';
    document.querySelectorAll('main>div:not([hidden])').forEach(el=>{if(el.classList.contains('pbar'))return;el.classList.remove('vin-r','vin-l');void el.offsetWidth;el.classList.add('vin-'+dir)})}
  prevKey=k;prevIdx=i;seasonSync();miniSync();plxTick()}
/* ---- N3 : grand titre qui se réduit en défilant ---- */
function miniSync(){let m=$('mini');if(!m){m=document.createElement('div');m.id='mini';m.setAttribute('aria-hidden','true');m.innerHTML='<span id="miniT"></span>';document.body.appendChild(m)}
  $('miniT').textContent=$('hello').textContent;const th=(document.querySelector('.top')||{}).offsetHeight||120;m.classList.toggle('on',scrollY>th-56)}
addEventListener('scroll',()=>{if(!miniSync._r){miniSync._r=requestAnimationFrame(()=>{miniSync._r=0;miniSync();plxTick()})}},{passive:true});
/* ---- A11 : profondeur sur les illustrations de lieu ---- */
function plxTick(){const H=innerHeight;document.querySelectorAll('.hcpic,.sess .pic,.wpic,.plx').forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>H)return;el.style.setProperty('--py',(((r.top+r.height/2)-H/2)*-.06).toFixed(1)+'px')})}
/* ---- A2 : boutons qui s'enfoncent (iOS a besoin d'un touchstart) ---- */
document.addEventListener('touchstart',()=>{},{passive:true});
/* ---- A4 : feuilles à tirer vers le bas ---- */
function sheetDrag(sheet,onClose,canClose){const box=sheet.querySelector('.box');if(!box||box._dr)return;box._dr=1;let y0=0,dy=0,t0=0,on=false;
  box.addEventListener('touchstart',e=>{if(box.scrollTop>2||e.touches.length>1)return;const tg=e.target;if(tg.closest('input,textarea,select,.perf,canvas,[data-nodrag]'))return;y0=e.touches[0].clientY;t0=Date.now();dy=0;on=true;box.style.transition='none'},{passive:true});
  box.addEventListener('touchmove',e=>{if(!on)return;dy=e.touches[0].clientY-y0;if(dy<=0){box.style.transform='';return}if(box.scrollTop>2){on=false;box.style.transform='';return}e.preventDefault();box.style.transform='translateY('+(dy*.9)+'px)'},{passive:false});
  box.addEventListener('touchend',()=>{if(!on)return;on=false;const v=dy/Math.max(1,Date.now()-t0);box.style.transition='transform .28s cubic-bezier(.2,.9,.3,1)';
    if((dy>110||v>.65&&dy>40)&&(!canClose||canClose())){box.style.transform='translateY(110%)';setTimeout(()=>{box.style.transition='';box.style.transform='';onClose()},230)}
    else{box.style.transform='';if(dy>110&&canClose&&!canClose())toast('Touche « Annuler » pour quitter sans enregistrer')}})}
/* ---- A10 : le « + » devient une coche ---- */
function v6Saved(){['fab'].forEach(id=>{const b=$(id);if(!b)return;b.classList.remove('did');void b.offsetWidth;b.classList.add('did');setTimeout(()=>b.classList.remove('did'),1600)});
  document.querySelectorAll('[data-go="note"]').forEach(b=>{b.classList.remove('did');void b.offsetWidth;b.classList.add('did');setTimeout(()=>b.classList.remove('did'),1600)})}
/* ---- N7 : appui long sur une séance ---- */
let lpT=0,lpFired=0;
function lpTarget(el){const sess=el.closest('.sess');if(sess){const b=sess.querySelector('[data-edit]');return b?b.dataset.edit:null}
  const w=el.closest('.wrow.has,.hc[data-goday]');if(w){const k=w.dataset.k||w.dataset.goday,ss=sOf(k);return ss.length?ss[ss.length-1].id:null}return null}
document.addEventListener('pointerdown',e=>{if(e.button>0)return;const id=lpTarget(e.target);if(!id)return;const x0=e.clientX,y0=e.clientY,el=e.target.closest('.sess,.wrow,.hc');
  clearTimeout(lpT);el.classList.add('lp');const cancel=()=>{clearTimeout(lpT);el.classList.remove('lp');document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',cancel);document.removeEventListener('pointercancel',cancel)};
  const mv=ev=>{if(Math.hypot(ev.clientX-x0,ev.clientY-y0)>9)cancel()};document.addEventListener('pointermove',mv);document.addEventListener('pointerup',cancel);document.addEventListener('pointercancel',cancel);
  lpT=setTimeout(()=>{cancel();lpFired=Date.now();ctxMenu(id,x0,y0)},470)});
document.addEventListener('click',e=>{if(Date.now()-lpFired<600&&!(e.target.closest&&e.target.closest('#ctx'))){e.stopPropagation();e.preventDefault()}},true);
document.addEventListener('contextmenu',e=>{if(lpTarget(e.target))e.preventDefault()});
function ctxMenu(id,x,y){const s=S.sessions.find(q=>q.id===id);if(!s)return;closeCtx();const o=document.createElement('div');o.id='ctx';o.className='ctx';
  const rows=[['edit','edit','Modifier'],['dup','copy','Dupliquer aujourd\'hui'],['share','share','Partager en image'],['move','move','Déplacer ou dupliquer…'],['del','trash','Supprimer']];
  o.innerHTML='<div class="ctxm" role="menu"><p class="ctxh">'+esc(dLong(s.date))+' · '+esc(plN[s.place]||'')+'</p>'+rows.map(r=>'<button type="button" role="menuitem" data-ctx="'+r[0]+'"'+(r[0]==='del'?' class="danger"':'')+'>'+ico(r[1])+'<span>'+r[2]+'</span></button>').join('')+'</div>';
  document.body.appendChild(o);const m=o.firstChild,W=innerWidth,H=innerHeight,mw=250,mh=rows.length*50+44;m.style.left=Math.max(12,Math.min(W-mw-12,x-mw/2))+'px';m.style.top=Math.max(12+(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sat'))||0),Math.min(H-mh-90,y+12))+'px';
  o.addEventListener('click',e=>{const b=e.target.closest('[data-ctx]');if(!b){closeCtx();return}const a=b.dataset.ctx;closeCtx();
    if(a==='edit')openForm(id);else if(a==='share')shareCard(id);else if(a==='move')actSheet(id);else if(a==='del')delSession(id);
    else if(a==='dup'){const n=clone(s);n.id='s'+Date.now().toString(36);n.date=TK;S.sessions.push(n);S.rest=S.rest.filter(k=>k!==TK);sel=TK;view=new Date(T.getFullYear(),T.getMonth(),1);render();save();toast('Séance dupliquée aujourd\'hui ✓')}});
  requestAnimationFrame(()=>o.classList.add('on'))}
function closeCtx(){const o=$('ctx');if(o)o.remove()}
/* ---- A8 : chiffres qui défilent façon compteur ---- */
function rollNum(el,to,txt){const t=String(txt!==undefined?txt:to);if(rmOn()){el.textContent=t;return}
  el.classList.add('roll');el.setAttribute('aria-label',t);el.innerHTML=[...t].map((ch,i)=>/\d/.test(ch)?'<r-d><r-s style="--d:'+ch+';transition-delay:'+(i*45)+'ms">'+'0123456789'.split('').map(x=>'<r-n>'+x+'</r-n>').join('')+'</r-s></r-d>':'<r-c>'+esc(ch)+'</r-c>').join('');
  requestAnimationFrame(()=>requestAnimationFrame(()=>el.querySelectorAll('r-s').forEach(s=>s.classList.add('go'))))}
function countUp(root){if(!root)return;root.querySelectorAll('[data-n]').forEach(el=>{const to=parseFloat(el.dataset.n);if(!(to>=0))return;const f=el.dataset.f||'',suf=el.dataset.suf||'',dec=el.dataset.d?+el.dataset.d:0;
  const txt=f==='dur'?fmtDur(to):f==='k'?fmtKg(to):(dec?to.toFixed(dec).replace('.',','):String(Math.round(to)))+suf;rollNum(el,to,txt)})}

/* ---- N9 : les longues explications deviennent des aides (i) qui s'ouvrent au toucher ---- */
let hlpN=0;
function helpify(){document.querySelectorAll('main section.panel p.findsub:not([id]):not([data-h]),main section.panel p.note:not([id]):not([data-h])').forEach(p=>{if(p.closest('#sheet,#gsheet,.onb,.hbx'))return;const t=p.textContent.trim();p.dataset.h='1';if(t.length<56)return;
  const sec=p.closest('section'),h=sec&&sec.querySelector('h2,h3');if(!h)return;let b=h.querySelector('.hlpb');
  if(!b){const id='hg'+(++hlpN);b=document.createElement('button');b.type='button';b.className='hlpb';b.dataset.hg=id;b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Aide');b.innerHTML=ico('info');h.appendChild(b)}
  p.classList.add('hlp');p.dataset.hgid=b.dataset.hg})}
document.addEventListener('click',e=>{const b=e.target.closest('.hlpb');if(!b)return;e.stopPropagation();const on=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',on);document.querySelectorAll('p.hlp[data-hgid="'+b.dataset.hg+'"]').forEach(p=>p.classList.toggle('open',on))},true);
