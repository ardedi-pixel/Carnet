/* ===================== v6 : minuteurs ===================== */
let tmPh='',tmFinDone=false;
function tmLoop(){const c0=tmCk;tmLoop5();tm6Post();tmMiniSync();if(tmCk!==c0)tmSave()} /* v7.4 : mini-lecteur et sauvegarde à chaque changement de phase */
function tm6Post(){const o=$('tmo');if(!o)return;if(!TM){o.dataset.ph='';return}const now=Date.now();let ph='work',s=99,nx='';
  if(TM.k==='rest'){s=Math.ceil(Math.max(0,TM.end-now)/1000);ph='rest'}
  else if(TM.k==='go')ph='go';
  else if(TM.k==='emom'){const t=TM.pausedAt||now,el=t-TM.start;if(el<0){ph='prep';s=Math.ceil(-el/1000)}else{const r=Math.floor(el/(TM.iv*1000));s=Math.ceil((TM.iv*1000-(el-r*TM.iv*1000))/1000);ph='work';nx=r+1<TM.n?'Ensuite : intervalle '+(r+2)+'/'+TM.n:'Dernier intervalle !'}if(TM.pausedAt)ph='pause'}
  else if(TM.k==='pyr'){const st=TM.steps,i=TM.i;if(TM.phase==='work'){ph='work';nx=i+1<st.length?'Ensuite : marche '+(i+2)+' · '+st[i+1]+' rép.':'Dernière marche !'}else{s=Math.ceil(Math.max(0,TM.end-now)/1000);ph='rest';nx=i+2<st.length?'Puis : marche '+(i+3)+' · '+st[i+2]+' rép.':''}}
  else if(TM.k==='fin')ph='fin';
  if(s<=3&&(ph==='rest'||ph==='work'||ph==='prep'))ph+=' last';
  if(ph!==tmPh){o.dataset.ph=ph;tmPh=ph}
  const n=$('tNext');if(n){n.hidden=!nx;if(n.textContent!==nx)n.textContent=nx}
  if(TM.k==='pyr')stairs6();
  if(TM.k==='fin'&&!tmFinDone){tmFinDone=true;finSum6()}else if(TM.k!=='fin')tmFinDone=false;
  const a=$('tArc'),pa=$('tpArc');if(a&&pa){const m=/([\d.]+)\s/.exec(a.style.strokeDasharray||'');const p=m?(+m[1])/TC:0;pa.setAttribute('stroke-dasharray',(59.7*Math.min(1,p)).toFixed(1)+' 60');$('tpill').dataset.ph=ph}}
/* ---- M3 : la pyramide dessinée en escalier ---- */
function stairs6(){const d=$('tDots');if(!d||!TM||TM.k!=='pyr')return;const st=TM.steps,mx=Math.max(...st),i=TM.i,k='st'+i+TM.phase;if(d.dataset.k===k&&d.querySelector('.stairs'))return;d.dataset.k=k;
  const W=Math.max(220,st.length*16),bw=W/st.length;
  d.innerHTML='<svg class="stairs" viewBox="0 0 '+W+' 86" preserveAspectRatio="none" aria-hidden="true">'+st.map((v,j)=>{const h=10+v/mx*70,x=j*bw,done=j<i||(j===i&&TM.phase==='rest'),cur=j===i&&TM.phase==='work';return '<rect x="'+(x+1.5).toFixed(1)+'" y="'+(84-h).toFixed(1)+'" width="'+(bw-3).toFixed(1)+'" height="'+h.toFixed(1)+'" rx="3" class="'+(done?'d':cur?'c':'')+'"/>'+(st.length<=21?'<text x="'+(x+bw/2).toFixed(1)+'" y="'+(80-h).toFixed(1)+'" text-anchor="middle">'+v+'</text>':'')}).join('')+'</svg>'}
/* ---- M6 : résumé de fin ---- */
function finSum6(){const r=tmRun,d=$('tDots');if(!r||!d)return;const dur=Math.round((Date.now()-r.start)/1000);let tot=0,rec=false,lab='';
  if(r.k==='pyr'&&r.steps){tot=r.steps.reduce((a,b)=>a+b,0);S.tmH=arr(S.tmH);const prev=S.tmH.filter(x=>x.k==='pyr'&&norm(x.name)===norm(r.name)).reduce((m,x)=>Math.max(m,x.t),0);rec=prev>0&&tot>prev;S.tmH.push({k:'pyr',name:r.name,t:tot,dur,d:TK});S.tmH=S.tmH.slice(-60);save();lab='répétitions'}
  else if(r.k==='emom'){tot=r.target?r.target*r.n:0;lab='répétitions';S.tmH=arr(S.tmH);S.tmH.push({k:'emom',n:r.n,iv:r.iv,t:tot,dur,d:TK});S.tmH=S.tmH.slice(-60);save()}
  d.dataset.k='fin';d.innerHTML='<div class="fsum">'+(tot?'<div><b data-n="'+tot+'">'+tot+'</b><span>'+lab+'</span></div>':'')+'<div><b>'+mmss(dur)+'</b><span>durée</span></div>'+(rec?'<div class="rec"><b>'+ico('trophy')+'</b><span>record !</span></div>':'')+'</div>';countUp(d);if(rec)setTimeout(()=>{if(!rmOn())confetti()},300)}
if(!EXTRA.includes('tmH'))EXTRA.push('tmH');

/* ===================== v7.4 : le minuteur vit indépendamment des écrans =====================
   - L'état (TM) repose sur l'heure réelle : naviguer, ouvrir une feuille ou changer d'onglet ne l'arrête jamais.
   - tmShow(true) : écran du minuteur (la barre d'onglets reste accessible : toucher un onglet le réduit) ;
     tmShow(false) : mini-lecteur au-dessus des onglets, sur toutes les pages (intervalle, temps restant, pause, « Fait »,
     arrêt annulable) ; le toucher rouvre l'écran du minuteur, exactement où il en est.
   - tmSave() garde l'état dans localStorage (carnet-tm) : appli fermée puis rouverte, le minuteur reprend.
   - Retour de l'arrière-plan : recalage sur l'heure réelle, sans rejouer de signal manqué (tmResync).
   - Notification (au choix) : Android, et iPhone si l'appli est installée ; elle dit où on en est quand on quitte l'appli.
     Elle ne défile pas en direct : le téléphone met les applis web en veille en arrière-plan (les bips aussi). */
const TM_KEY='carnet-tm';
if(!EXTRA.includes('tmNotif'))EXTRA.push('tmNotif');
const TPI={pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.4" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.4" fill="currentColor"/></svg>',
  resume:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
  pdone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pskip:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l8 6-8 6z" fill="currentColor"/><rect x="15.5" y="6" width="3" height="12" rx="1.2" fill="currentColor"/></svg>',p15:'<b>+15</b>'};
function tmShow(full){const o=$('tmo'),p=$('tpill'),on=!!TM&&full!==null&&full!==undefined;if(!o||!p)return;o.hidden=!(on&&full);p.hidden=!(on&&!full);
  document.body.classList.toggle('tm-full',on&&!!full);document.body.classList.toggle('tm-mini',on&&!full);if(on&&full)tmNotifRow();if(on&&!full)tmMiniSync();if(TM)tmSave()}
function tmSave(){try{if(!TM||TM.k==='go'||TM.k==='fin'){localStorage.removeItem(TM_KEY);return}localStorage.setItem(TM_KEY,JSON.stringify({tm:TM,run:tmRun,full:!$('tmo').hidden,at:Date.now()}))}catch(e){}}
/* au démarrage : reprendre un minuteur en cours (EMOM fini pendant l'absence : on montre la fin s'il date de moins d'un quart d'heure) */
function tmRestore(){if(TM)return false;let o=null;try{o=JSON.parse(localStorage.getItem(TM_KEY)||'null')}catch(e){}if(!o||!o.tm||typeof o.tm!=='object')return false;
  const t=o.tm,now=Date.now(),drop=()=>{try{localStorage.removeItem(TM_KEY)}catch(e){}return false};
  if(t.k==='rest'){if(!(t.end>now))return drop();t.ls=-1}
  else if(t.k==='emom'){const tot=t.n*t.iv*1000,el=(t.pausedAt||now)-t.start;if(!(t.n>0&&t.iv>0))return drop();if(el>=tot&&now-(t.start+tot)>15*60000)return drop();t.lr=el<0?-1:Math.min(t.n-1,Math.floor(el/(t.iv*1000)));t.ls=-1}
  else if(t.k==='pyr'){if(!Array.isArray(t.steps)||!t.steps.length)return drop();if(t.phase==='rest'&&!(t.end>now)){t.i=Math.min(t.steps.length-1,t.i+1);t.phase='work'}t.ls=-1}
  else return drop();
  TM=t;tmRun=o.run||null;tmCk='';clearInterval(tmIv);tmIv=setInterval(tmLoop,200);wakeOn();tmShow(!!o.full);tmLoop();return true}
/* retour au premier plan : se recaler sur l'heure réelle sans rejouer le « Go » d'un intervalle déjà commencé */
function tmResync(){if(!TM)return;const now=Date.now();if(TM.k==='emom'){const el=(TM.pausedAt||now)-TM.start;if(el>=0)TM.lr=Math.min(TM.n-1,Math.floor(el/(TM.iv*1000)))}TM.ls=-1;wakeOn();tmLoop()}
/* arrêter (bouton ✕ ou « Arrêter ») : annulable, le minuteur repart comme s'il n'avait jamais été arrêté */
function tmStopU(){if(!TM||TM.k==='fin'||TM.k==='go'){tmStop();return}const bk=JSON.stringify({tm:TM,run:tmRun}),full=!$('tmo').hidden;tmStop();
  snack('Minuteur arrêté','Annuler',()=>{if(TM)return;const o=JSON.parse(bk);TM=o.tm;tmRun=o.run;tmCk='';TM.ls=-1;clearInterval(tmIv);tmIv=setInterval(tmLoop,200);wakeOn();tmResync();tmShow(full)})}
/* mini-lecteur : ce qui compte en un coup d'œil, et l'action utile du moment */
const tmHM=(ms,sec)=>new Date(ms).toLocaleTimeString(LOC(),sec?{hour:'2-digit',minute:'2-digit',second:'2-digit'}:{hour:'2-digit',minute:'2-digit'});
function tmMiniSync(){const p=$('tpill');if(!p||p.hidden||!TM)return;const now=Date.now();let L='',Sb='',B='',a='',al='';
  if(TM.k==='emom'){const el=(TM.pausedAt||now)-TM.start;
    if(el<0){const s=Math.ceil(-el/1000);L='EMOM';Sb='Départ dans '+s+' s';B=String(s)}
    else{const r=Math.min(TM.n-1,Math.floor(el/(TM.iv*1000))),rem=TM.iv*1000-(el-r*TM.iv*1000),left=TM.n-r-1;L='EMOM · '+(r+1)+'/'+TM.n;B=mmss(Math.max(0,Math.ceil(rem/1000)));
      Sb=TM.pausedAt?'En pause':left?(left===1?'1 restant':left+' restants')+' · fin '+tmHM(TM.start+TM.n*TM.iv*1000):'Dernier intervalle'}
    a=TM.pausedAt?'resume':'pause';al=TM.pausedAt?'Reprendre':'Pause'}
  else if(TM.k==='rest'){L=TM.lab||'Repos';Sb=TM.next||'Récupère bien';B=mmss(Math.ceil(Math.max(0,TM.end-now)/1000));a='p15';al='Ajouter 15 secondes'}
  else if(TM.k==='pyr'){const st=TM.steps,i=TM.i;if(TM.phase==='work'){L=(TM.name||'Pyramide')+' · '+(i+1)+'/'+st.length;Sb=st[i]+' rép., puis « Fait »';B=String(st[i]);a='pdone';al='Fait'}
    else{L='Repos · marche '+(i+2)+'/'+st.length;Sb=TM.reps+' rép. faites';B=mmss(Math.ceil(Math.max(0,TM.end-now)/1000));a='pskip';al='Passer le repos'}}
  else if(TM.k==='go'){L='C\'est reparti';B='Go'}
  else if(TM.k==='fin'){L=TM.title;Sb=TM.sub;B='✓'}
  const set=(id,v)=>{const e=$(id);if(e&&e.dataset.v!==v){e.dataset.v=v;e.textContent=v}};set('tpL',L);set('tpS',Sb);set('tpB',B);
  const A=$('tpA');if(A){A.hidden=!a;if(a&&A.dataset.ic!==a){A.dataset.ic=a;A.dataset.tm=a;A.innerHTML=TPI[a]||'';A.setAttribute('aria-label',al)}}}
/* toucher un onglet (ou changer de page) pendant que l'écran du minuteur est ouvert : on le réduit, il continue */
document.addEventListener('click',e=>{if(TM&&!$('tmo').hidden&&e.target.closest('.tabs a'))tmShow(false)},true);
addEventListener('hashchange',()=>{if(TM&&!$('tmo').hidden)tmShow(false)});
/* ---- notification quand on quitte l'appli (selon ce que le téléphone permet vraiment) ---- */
const tmNotifOk=()=>'Notification' in window&&'serviceWorker' in navigator&&(PLAT.and||(PLAT.ios&&isStandalone())||!PLAT.mobile);
function tmNotifRow(){const b=$('tNotif');if(!b)return;if(!tmNotifOk()){b.innerHTML='';return}const on=!!S.tmNotif&&Notification.permission==='granted';
  b.innerHTML='<button type="button" class="tglrow tnot" data-tmnot="1" aria-pressed="'+on+'"><span><b>Notification si je quitte l\'appli</b>'+(on?'Elle dit où tu en es, sans défiler en direct':'Voir où tu en es depuis l\'écran verrouillé')+'</span><i></i></button>'}
async function tmNotifToggle(){if(!tmNotifOk())return;if(S.tmNotif&&Notification.permission==='granted'){S.tmNotif=false;save();tmNotifRow();return}
  let p=Notification.permission;try{if(p==='default')p=await Notification.requestPermission()}catch(e){}S.tmNotif=p==='granted';save();tmNotifRow();toast(S.tmNotif?'Notification activée':'Notifications bloquées : autorise-les dans les réglages du téléphone')}
function tmDesc(){const now=Date.now();let t='',b='';
  if(TM.k==='emom'){const el=(TM.pausedAt||now)-TM.start,r=Math.max(0,Math.min(TM.n-1,Math.floor(el/(TM.iv*1000))));t='EMOM en cours';b=TM.pausedAt?'En pause · intervalle '+(r+1)+' sur '+TM.n:el<0?'Départ à '+tmHM(TM.start,1):'Intervalle '+(r+1)+' sur '+TM.n+' · fin prévue à '+tmHM(TM.start+TM.n*TM.iv*1000)}
  else if(TM.k==='rest'){t='Repos en cours';b='Fin du repos à '+tmHM(TM.end,1)}
  else if(TM.k==='pyr'){t='Pyramide en cours';b=TM.phase==='work'?'Marche '+(TM.i+1)+' sur '+TM.steps.length+' : '+TM.steps[TM.i]+' rép.':'Repos jusqu\'à '+tmHM(TM.end,1)}
  return {t:trS(t),b:trS(b)}}
async function tmNotifShow(){try{if(!TM||!S.tmNotif||!tmNotifOk()||Notification.permission!=='granted'||TM.k==='fin'||TM.k==='go')return;const r=await navigator.serviceWorker.ready,d=tmDesc();
  await r.showNotification(d.t,{body:d.b,tag:'carnet-tm',renotify:false,silent:true,icon:'icon-192.png',badge:'icon-192.png',data:{u:location.href}})}catch(e){}}
async function tmNotifClose(){try{if(!('serviceWorker' in navigator))return;const r=await navigator.serviceWorker.getRegistration();if(!r||!r.getNotifications)return;(await r.getNotifications({tag:'carnet-tm'})).forEach(n=>n.close())}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(document.hidden){tmSave();tmNotifShow()}else{tmNotifClose();if(TM)tmResync()}});
document.addEventListener('click',e=>{if(e.target.closest('[data-tmnot]'))tmNotifToggle()});
