/* ===================== v7.5 : compléments : rappels, notifications, agenda du téléphone =====================
   Ce que le téléphone permet vraiment à une appli web (PWA), sans serveur :
   - Rappels de l'appli : à l'heure prévue, tant que l'appli tourne (ouverte, ou en arrière-plan récent sur Android) :
     bandeau dans l'appli si elle est à l'écran, sinon notification du système (Android ; iPhone si l'appli est installée).
     Les prises de plusieurs compléments à la même heure sont regroupées ; chaque rappel n'est fait qu'une fois (S.supp.nt).
     Rien pour un complément en OFF, suspendu, terminé ou à définir. Le jour d'une reprise, le rappel le dit.
   - Notification « Pris » (Android) : le service worker garde l'action (IndexedDB) et l'appli l'enregistre dès qu'elle tourne.
   - Appli fermée : une appli web ne peut pas programmer seule une notification à heure fixe (iPhone et Android) ; il faudrait un
     serveur d'envoi (Web Push). Solution fiable sans serveur : le fichier d'agenda (.ics) d'un calendrier séparé
     « Compléments alimentaires », avec une alarme à chaque prise, la fin des périodes ON et les reprises : c'est l'agenda du
     téléphone qui sonne, même appli fermée. Identifiants stables ; mise à jour = remplacer ce calendrier. */
const spNotifOk=()=>'Notification' in window&&'serviceWorker' in navigator&&(PLAT.and||(PLAT.ios&&isStandalone())||!PLAT.mobile);
let spIv=null,spBnr=null;
function spTickStart(){clearInterval(spIv);spIv=setInterval(spTick,30000);setTimeout(spTick,1200)}
/* nom d'un moment pour un rappel (« Prise du soir ») */
const spMomL=m=>SPMP[m]||'Prise';
/* le rappel est-il dû ? : heure (ou fin du report) passée depuis moins de 20 min, jamais deux fois */
function spDueNow(k,now){const s=SP(),nt=arr(s.nt[k]);return spDay(k).filter(it=>{const e=spLog(k,it.key);if(spDone(e))return false;const at=e&&e.s==='snz'?+e.u:spAt(k,it.t);
  return at<=now&&now-at<20*60000&&!nt.includes(it.key+'@'+at)}).map(it=>{const e=spLog(k,it.key);return Object.assign({at:e&&e.s==='snz'?+e.u:spAt(k,it.t)},it)})}
/* reprise ce jour-là (premier jour d'une période ON après une période OFF) */
function spIsRes(x,k){if(x.mode!=='cyc')return false;const p=spPh(x,k),q=spPh(x,spAdd(k,-1));return p.k==='on'&&q.k==='off'}
function spTick(){if(!S.supp)return;const s=SP();if(!s.list.length)return;const k=spToday(),now=Date.now();
  Object.keys(s.nt).forEach(d=>{if(d<spAdd(k,-3))delete s.nt[d]});const nt=s.nt[k]=arr(s.nt[k]);let ch=false;
  const due=spDueNow(k,now);if(due.length){due.forEach(it=>nt.push(it.key+'@'+it.at));ch=true;spRemind(k,due)}
  /* stock faible : une fois par jour et par complément */
  s.list.forEach(x=>{const st=spStock(x);if(st&&st.low&&spStat(x,k)==='actif'&&!nt.includes('stk|'+x.id)){nt.push('stk|'+x.id);ch=true;
    if(document.hidden)spNotify(trS('Stock faible')+' · '+x.n,st.days===0?trS('Plus assez pour aujourd\'hui'):trS('Environ '+st.days+' jours restants'),'supp-stk-'+x.id,{supp:1,u:'./#complements'})}});
  if(ch)save();const sig=k+'|'+spDay(k).filter(it=>spAt(k,it.t)<=now).length+'|'+ch;
  if((ch||sig!==spSigR)&&!document.hidden&&!$('gsheet').classList.contains('open')){spSigR=sig;if(curV==='nut'&&S.ntab==='supp')renderSupp();else if(curV==='home'&&ch)renderHome()}} /* redessiner seulement si quelque chose a changé */
let spSigR='';
/* texte d'un rappel : seul ou groupé */
function spRemTxt(k,L){const m=L[0].m,t=L[0].t,lab=trS(spMomL(m))+' · '+t,res=L.filter(it=>spIsRes(it.x,k));
  const one=it=>it.x.n+(it.q!==null&&it.q!==undefined?' — '+trS(spU(it.q,it.x.u)):'')+(it.x.r==='jeun'||it.x.r==='repas'?' — '+trS(SPR[it.x.r].toLowerCase()):'');
  const title=L.length===1?lab:lab+' · '+trS(L.length+' compléments'),body=(res.length?trS('Reprise aujourd\'hui')+' : '+res.map(it=>it.x.n).join(', ')+'. ':'')+(L.length===1?one(L[0]):L.map(it=>it.x.n+(it.q!==null&&it.q!==undefined?' '+trS(spU(it.q,it.x.u)):'')).join(' · '));
  return {title,body}}
function spRemind(k,L){if(!document.hidden){spBanner(k,L);return}const r=spRemTxt(k,L);
  spNotify(r.title,r.body,'supp-'+k+'-'+L[0].t,{supp:1,day:k,keys:L.map(it=>it.key),u:'./#complements'},[{action:'take',title:trS(L.length>1?'Tout pris':'Pris')}])}
async function spNotify(title,body,tag,data,actions){try{if(!spNotifOk()||!SP().ntf||Notification.permission!=='granted')return false;const r=await navigator.serviceWorker.ready;
  const o={body,tag,renotify:true,icon:'icon-192.png',badge:'icon-192.png',data};if(actions&&(Notification.maxActions||0)>0)o.actions=actions;await r.showNotification(title,o);return true}catch(e){return false}}
async function spNotifToggle(){if(!spNotifOk())return;const s=SP();if(s.ntf&&Notification.permission==='granted'){s.ntf=false;save();return}
  let p=Notification.permission;try{if(p==='default')p=await Notification.requestPermission()}catch(e){}s.ntf=p==='granted';save();
  toast(s.ntf?'Rappels activés':'Notifications bloquées : autorise-les dans les réglages du téléphone')}
/* bandeau dans l'appli (l'appli est à l'écran) */
function spBanner(k,L){let b=$('sp7rb');if(!b){b=document.createElement('div');b.id='sp7rb';b.className='sp7bnr';b.setAttribute('role','status');document.body.appendChild(b)}
  const res=L.filter(it=>spIsRes(it.x,k));spBnr={k,keys:L.map(it=>it.key)};
  b.innerHTML='<div class="sp7bni"><span class="sp7bnic">'+ico('pill')+'</span><div class="sp7bnt"><b><span>'+esc(spMomL(L[0].m))+'</span> · <span>'+esc(L[0].t)+'</span></b>'+(res.length?'<small><span>Reprise aujourd\'hui</span> : <span class="notr">'+esc(res.map(it=>it.x.n).join(', '))+'</span></small>':'')
   +'<small class="notr">'+esc(L.map(it=>it.x.n+(it.q!==null&&it.q!==undefined?' '+spU(it.q,it.x.u):'')).join(' · '))+'</small></div><button type="button" class="ib sp7bnx" data-sprb="x" aria-label="Fermer">'+ico('close')+'</button></div>'
   +'<div class="sp7bna"><button type="button" class="btn sm" data-sprb="ok">'+(L.length>1?'Tout pris':'Pris')+'</button><button type="button" class="btn sm ghost" data-sprb="snz">Dans 10 min</button><button type="button" class="btn sm ghost" data-sprb="go">Voir</button></div>';
  b.hidden=false;b.classList.remove('on');void b.offsetWidth;b.classList.add('on');try{sTick(0)}catch(e){}}
function spBannerHide(){const b=$('sp7rb');if(b){b.classList.remove('on');b.hidden=true}spBnr=null}
document.addEventListener('click',e=>{const a=e.target.closest('[data-sprb]');if(!a||!spBnr)return;const {k,keys}=spBnr,act=a.dataset.sprb,now=Date.now();
  const L=spDay(k).filter(it=>keys.includes(it.key));
  if(act==='ok'){L.forEach(it=>{if(!spTaken(spLog(k,it.key))){const e0=spLog(k,it.key);spSet(k,it,spTakeSt(k,it,now),e0&&e0.k?{k:e0.k}:{})}});save();toast(L.length>1?'Prises notées':'Prise notée');spRefresh()}
  else if(act==='snz'){L.forEach(it=>{const e0=spLog(k,it.key);if(!spDone(e0))spSet(k,it,'snz',{u:now+600000,k:((e0&&e0.k)||0)+1})});save();toast('Rappel dans 10 min');spRefresh()}
  else if(act==='go'){S.ntab='supp';SP().tab='today';if(location.hash==='#complements')route();else location.hash='#complements'}
  spBannerHide()});
/* ---- actions faites depuis une notification (gardées par le service worker) ---- */
function spIdb(){return new Promise((ok,ko)=>{if(!('indexedDB' in window)){ko();return}const r=indexedDB.open('carnet-sw',1);r.onupgradeneeded=()=>{r.result.createObjectStore('q',{autoIncrement:true})};r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)})}
function spDrain(){return spDrainA()}
async function spDrainA(){let all=[];try{const db=await spIdb();all=await new Promise((ok,ko)=>{const tx=db.transaction('q','readwrite'),st=tx.objectStore('q'),g=st.getAll();g.onsuccess=()=>{st.clear();ok(g.result||[])};g.onerror=()=>ko(g.error)});db.close()}catch(e){return 0}
  if(!all.length)return 0;let n=0;all.forEach(a=>{if(!a||a.k!=='take'||!spIsD(a.day))return;arr(a.keys).forEach(kk=>{const it=spDay(a.day).find(i=>i.key===kk);if(it&&!spTaken(spLog(a.day,kk))){const e0=spLog(a.day,kk);spSet(a.day,it,spTakeSt(a.day,it,+a.t||Date.now()),Object.assign({t:+a.t||Date.now(),via:'notif'},e0&&e0.k?{k:e0.k}:{}));n++}})});
  if(n){save();spRefresh()}return n}
if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('message',e=>{if(!e.data||!e.data.supp)return;if(e.data.supp==='open'){S.ntab='supp';SP().tab='today';if(location.hash==='#complements')route();else location.hash='#complements'}spDrain()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&S.supp){spDrain();spTick()}});
/* ---- agenda du téléphone : fichier .ics d'un calendrier séparé ---- */
const SP_HZ=183; /* 6 mois de rappels à l'avance */
function spIcsEsc(t){return String(t).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n')}
/* lignes de 75 octets maximum (UTF-8), sans couper un caractère */
function spFold(l){const enc=new TextEncoder();if(enc.encode(l).length<=75)return l;let out='',cur='',n=0;for(const ch of l){const b=enc.encode(ch).length;if(n+b>(out?74:75)){out+=(out?'\r\n ':'')+cur;cur='';n=0}cur+=ch;n+=b}return out+(cur?'\r\n '+cur:'')}
function spHash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h.toString(36)}
const spIcsD=k=>k.replace(/-/g,'');
/* événements : prises (regroupées par heure, une suite de jours identiques = un événement répété), périodes ON/OFF, reprises, doses */
function spIcsData(from){const s=SP(),td=from||spToday(),days=[];
  for(let n=0;n<SP_HZ;n++){const k=spAdd(td,n),G={};spDay(k).forEach(it=>{(G[it.t]=G[it.t]||[]).push(it)});days.push({k,G})}
  const runs=[],open={};days.forEach(({k,G},n)=>{const seen=new Set();Object.keys(G).forEach(t=>{const L=G[t],sig=t+'#'+L.map(it=>it.x.id+':'+it.i+':'+it.q+':'+it.x.n).join('|'),o=open[t];
      seen.add(t);if(o&&o.sig===sig&&o.last===n-1){o.last=n;o.count++}else{if(o)runs.push(o);open[t]={sig,t,L,start:k,last:n,count:1}}});
    Object.keys(open).forEach(t=>{if(!seen.has(t)){runs.push(open[t]);delete open[t]}})});
  Object.keys(open).forEach(t=>runs.push(open[t]));
  const ph=[];s.list.forEach(x=>{if(x.mode!=='cyc'&&!x.dz.length&&!(x.d0>td))return;
    if(x.mode==='cyc'){let cur=null;for(let n=0;n<SP_HZ;n++){const k=spAdd(td,n),p=spPh(x,k),pk=p.k==='on'||p.k==='off'?p.k:'';
      if(!cur||cur.k!==pk){if(cur&&cur.k)ph.push(cur);cur={x,k:pk,a:k,b:k,len:p.len}}else cur.b=k}if(cur&&cur.k)ph.push(cur)}
    spNext(x,td,SP_HZ-1).forEach(e=>{if(e.k==='res'||e.k==='start'||e.k==='dose'||e.k==='end'||e.k==='back')ph.push({x,k:e.k,a:e.d,b:e.d,q:e.q,len:e.len,one:1})})});
  return {runs,ph}}
function spIcs(){const s=SP(),{runs,ph}=spIcsData(),now=new Date(),st=now.toISOString().replace(/[-:]/g,'').replace(/\.\d+/,''),U=APP_URL+'#complements',L=[];
  const push=(...a)=>a.forEach(l=>L.push(spFold(l)));
  push('BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Carnet de seances//Complements//FR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:'+spIcsEsc(trS('Compléments alimentaires')),'X-WR-CALDESC:'+spIcsEsc(trS('Rappels de prise préparés par Carnet de séances. Outil d\'organisation : il ne remplace pas l\'avis d\'un professionnel de santé.')));
  runs.forEach(r=>{const one=r.L.length===1,lab=trS(spMomL(r.L[0].m)),items=r.L.map(it=>it.x.n+(it.q!==null&&it.q!==undefined?' — '+trS(spU(it.q,it.x.u)):'')+(it.x.r==='jeun'||it.x.r==='repas'?' ('+trS(SPR[it.x.r].toLowerCase())+')':''));
    const sum=one?items[0]+' — '+lab.toLowerCase():lab+' : '+r.L.map(it=>it.x.n).join(', '),desc=items.join('\n')+r.L.filter(it=>it.x.no).map(it=>'\n'+it.x.n+' : '+it.x.no).join('')+'\n\n'+U;
    const [h,m]=r.t.split(':');push('BEGIN:VEVENT','UID:carnet-supp-'+spHash(r.sig)+'-'+spIcsD(r.start)+'@ardedi-pixel.github.io','DTSTAMP:'+st,'DTSTART:'+spIcsD(r.start)+'T'+h+m+'00','DURATION:PT10M');
    if(r.count>1)push('RRULE:FREQ=DAILY;COUNT='+r.count);
    push('SUMMARY:'+spIcsEsc(sum),'DESCRIPTION:'+spIcsEsc(desc),'URL:'+U,'TRANSP:TRANSPARENT','CATEGORIES:'+spIcsEsc(trS('Compléments alimentaires')),'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+spIcsEsc(sum),'TRIGGER:PT0M','END:VALARM','END:VEVENT')});
  ph.forEach(p=>{const nm=p.x.n;let sum='',alarm=false;
    if(p.k==='on')sum=nm+' · '+trS('période ON')+(p.len?' ('+trS(spWk(p.len))+')':'');else if(p.k==='off')sum=nm+' · '+trS('période OFF')+(p.len?' ('+trS(spWk(p.len))+')':'');
    else if(p.k==='res'){sum=trS('Reprise')+' : '+nm;alarm=true}else if(p.k==='start'){sum=trS('Début')+' : '+nm;alarm=true}else if(p.k==='back'){sum=trS('Fin de la pause')+' : '+nm;alarm=true}
    else if(p.k==='end')sum=trS('Fin du programme')+' : '+nm;else if(p.k==='dose'){sum=nm+' : '+trS('nouvelle dose')+' '+trS(spU(p.q,p.x.u));alarm=true}
    push('BEGIN:VEVENT','UID:carnet-supp-'+p.k+'-'+spHash(p.x.id)+'-'+spIcsD(p.a)+'@ardedi-pixel.github.io','DTSTAMP:'+st,'DTSTART;VALUE=DATE:'+spIcsD(p.a),'DTEND;VALUE=DATE:'+spIcsD(spAdd(p.b,1)),'SUMMARY:'+spIcsEsc(sum),'DESCRIPTION:'+spIcsEsc(U),'TRANSP:TRANSPARENT');
    if(alarm)push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+spIcsEsc(sum),'TRIGGER:PT9H','END:VALARM');push('END:VEVENT')});
  push('END:VCALENDAR');return L.join('\r\n')+'\r\n'}
/* empreinte du programme : l'appli sait si l'agenda du téléphone est à jour */
function spSig(){const s=SP();return spHash(JSON.stringify([s.mt,s.list.map(x=>[x.id,x.n,x.q,x.u,x.tk,x.r,x.mode,x.d0,x.d1,x.cy,x.pw,x.pd,x.sus,x.dz,x.no])]))}
function spIcsState(){const s=SP();if(!s.ics.at)return 'none';if(s.ics.sig!==spSig())return 'old';if(spDn(s.ics.to||s.ics.at)-spDn(spToday())<30)return 'soon';return 'ok'}
const SP_ICSN='complements-alimentaires.ics';
function spIcsOpen(mode){return spIcsOpenA(mode)}
async function spIcsOpenA(mode){const txt=spIcs(),s=SP();s.ics={at:spToday(),sig:spSig(),to:spAdd(spToday(),SP_HZ-1)};save();
  const blob=new Blob([txt],{type:'text/calendar;charset=utf-8'});
  if(mode==='share'){try{const f=new File([blob],SP_ICSN,{type:'text/calendar'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:trS('Compléments alimentaires')});return 'share'}}catch(e){if(e&&e.name==='AbortError')return 'abort'}}
  /* iPhone : ouvrir le fichier comme une vraie adresse (servie par le service worker, rien ne part sur internet) fait apparaître « Tout ajouter » de l'app Calendrier */
  if(PLAT.ios&&navigator.serviceWorker&&navigator.serviceWorker.controller&&'caches' in window){try{const c=await caches.open('carnet-ics');await c.put(SP_ICSN,new Response(blob,{headers:{'Content-Type':'text/calendar; charset=utf-8'}}));location.href=SP_ICSN+'?v='+Date.now();return 'open'}catch(e){}}
  const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=SP_ICSN;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},4000);return 'file'}
