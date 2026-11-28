/* ===================== v7.6 : sauvegarde fiable (automatique, historique, fichier, aperçu, fusion) =====================
   Trois couches, sans serveur (choix de Diego : pas de cloud pour l'instant) :
   1. localStorage 'carnet-seances' à chaque modification (comme avant) ; un échec d'écriture (espace plein…) est signalé.
   2. Sauvegardes automatiques dans IndexedDB 'carnet-bk' (magasin 'snap') : au plus une toutes les 3 h après une
      modification, et toujours avant une opération risquée (import, remplacement, restauration). On garde tout sur 2 jours,
      puis une par jour sur 30 jours, puis une par semaine (60 au plus). Compressées (gzip) quand le téléphone le permet.
   3. Fichier .json exporté par la personne (Fichiers, iCloud Drive, Google Drive…). Import = aperçu, puis
      « Fusionner » (rien n'est supprimé ; si un élément existe des deux côtés avec des contenus différents, on garde le plus
      récent quand on le sait, sinon celui du téléphone) ou « Remplacer » (sauvegarde automatique juste avant, annulable).
   La langue choisie sur le téléphone est toujours conservée. bkMerge() servira aussi à une future synchronisation.
   Fonctions visibles des tests : bkSnap(), bkList(), bkGet(), bkMerge(), bkDiff(), bkCount(), bkParse(), bkApply(). */
Object.assign(ICO,{dl:'<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',ul:'<path d="M12 16V5"/><path d="M7 10l5-5 5 5"/><path d="M5 20h14"/>'});
const BK_DB='carnet-bk',BK_GAP=3*3600e3;let bkDbP=null,bkPend=null,bkErr='';
function bkDb(){if(bkDbP)return bkDbP;bkDbP=new Promise((res,rej)=>{try{const r=indexedDB.open(BK_DB,1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('snap'))db.createObjectStore('snap',{keyPath:'id'})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}});bkDbP.catch(()=>{bkDbP=null});return bkDbP}
function bkTx(mode,fn){return bkDb().then(db=>new Promise((res,rej)=>{const tx=db.transaction('snap',mode),st=tx.objectStore('snap');let rq;try{rq=fn(st)}catch(e){rej(e);return}tx.oncomplete=()=>res(rq&&'result' in rq?rq.result:undefined);tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error)}))}
const bkLs=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,String(v))}catch(e){return null}};
/* ---- compter ce que contient une sauvegarde (aperçu, historique) ---- */
function bkCount(d){d=d||{};const ss=Array.isArray(d.sessions)?d.sessions:[],ds=ss.map(s=>s.date).filter(Boolean).sort(),meas=d.meas&&typeof d.meas==='object'?Object.values(d.meas).reduce((a,L)=>a+(Array.isArray(L)?L.length:0),0):0,
    nd=d.nut&&d.nut.days?Object.values(d.nut.days).filter(x=>x&&Object.values(x).some(L=>Array.isArray(L)&&L.length)).length:0;
  return {s:ss.length,d0:ds[0]||'',d1:ds[ds.length-1]||'',r:(d.recs||[]).length,m:(d.bw||[]).length+meas,n:(d.carnet||[]).length,c:d.supp&&Array.isArray(d.supp.list)?d.supp.list.length:0,j:nd,g:(d.goals||[]).length}}
/* ---- sauvegardes automatiques (IndexedDB) ---- */
function bkZip(s){try{if(window.CompressionStream){const cs=new Blob([s]).stream().pipeThrough(new CompressionStream('gzip'));return new Response(cs).arrayBuffer().then(b=>new Uint8Array(b)).catch(()=>null)}}catch(e){}return Promise.resolve(null)}
function bkUnzip(u){const ds=new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));return new Response(ds).text()}
function bkSnap(k,why){return bkSnapA(k||'auto',why||'')}
async function bkSnapA(k,why){try{if(k==='auto'&&Date.now()-(+bkLs('carnet-bkt')||0)<BK_GAP)return null;const data=JSON.parse(JSON.stringify(packData()));if(k==='auto'&&!data.sessions.length&&!(data.recs||[]).length&&!(data.bw||[]).length)return null;
    const s=JSON.stringify(data),z=await bkZip(s),t=Date.now(),o={id:'b'+t,t,k,why,n:bkCount(data),sz:s.length,v:APP_V,z:!!z,d:z||s};
    await bkTx('readwrite',st=>st.put(o));if(k==='auto')bkLs('carnet-bkt',t);await bkPrune();bkRender();return o.id}catch(e){return null}}
function bkList(){return bkTx('readonly',st=>st.getAll()).then(L=>(L||[]).map(o=>({id:o.id,t:o.t,k:o.k,why:o.why,n:o.n,sz:o.sz,v:o.v})).sort((a,b)=>b.t-a.t)).catch(()=>[])}
function bkGet(id){return bkTx('readonly',st=>st.get(id)).then(async o=>{if(!o)return null;const s=o.z?await bkUnzip(o.d):o.d;return JSON.parse(s)}).catch(()=>null)}
function bkDel(id){return bkTx('readwrite',st=>st.delete(id)).catch(()=>{})}
async function bkPrune(){const L=await bkList(),now=Date.now(),keep=new Set(),seen=new Set();
  L.filter(o=>o.k!=='auto').slice(0,20).forEach(o=>{if(now-o.t<60*864e5)keep.add(o.id)});
  L.filter(o=>o.k==='auto').forEach(o=>{const age=now-o.t;let slot;if(age<2*864e5)slot='h'+o.id;else if(age<30*864e5)slot='d'+Math.floor(o.t/864e5);else slot='w'+Math.floor(o.t/(7*864e5));if(!seen.has(slot)){seen.add(slot);keep.add(o.id)}});
  const ids=L.filter(o=>keep.has(o.id)).slice(0,60).map(o=>o.id);for(const o of L)if(!ids.includes(o.id))await bkDel(o.id)}
/* après chaque enregistrement : une sauvegarde automatique si la dernière date de plus de 3 h (5 s de calme avant) */
function bkAfterSave(){if(!window.indexedDB)return;const last=+bkLs('carnet-bkt')||0;if(Date.now()-last<BK_GAP)return;clearTimeout(bkPend);bkPend=setTimeout(()=>bkSnap('auto'),5000)}
function bkSaveOk(){bkAfterSave();if(bkErr){bkErr='';const w=$('bkWarn');if(w&&!w.classList.contains('soft'))w.remove();bkRender()}}
/* enregistrement impossible (espace plein, navigation privée…) : alerte discrète, une fois par session */
function bkSaveFail(e){if(bkErr)return;bkErr=String(e&&e.name||'err');bkRender();let b=$('bkWarn');if(b)return;b=document.createElement('div');b.id='bkWarn';b.className='bk7warn';b.setAttribute('role','alert');
  b.innerHTML='<span>Impossible d\'enregistrer sur ce téléphone (espace plein ?). Exporte une sauvegarde pour ne rien perdre.</span><button type="button" class="btn sm" data-bk="exp">Exporter</button><button type="button" class="ib" data-bk="wx" aria-label="Fermer">✕</button>';document.body.prepend(b)}
/* ---- fichier de sauvegarde ---- */
function bkFile(){return new Blob([JSON.stringify({app:'carnet-de-seances',format:1,exported:new Date().toISOString(),appV:APP_V,data:JSON.parse(JSON.stringify(packData()))})],{type:'application/json'})}
function bkExport(){shareFile(bkFile(),'carnet-sauvegarde-'+TK+'.json');bkLs('carnet-bkx',Date.now());setTimeout(bkRender,300)}
/* lire un fichier, un code de transfert (CARNET6…) ou un ancien code JSON ; renvoie {data, src} ou null */
function bkParse(txt){return bkParseA(txt)}
async function bkParseA(txt){txt=String(txt||'').trim();if(!txt)return null;let v=null,meta={};
  try{if(txt.startsWith('CARNET6'))v=await unpackCode(txt);else{const j=JSON.parse(txt);if(j&&j.app==='carnet-de-seances'&&j.data){v=j.data;meta={at:j.exported,v:j.appV}}else v=j}}catch(e){return null}
  if(!v||typeof v!=='object'||!Array.isArray(v.sessions))return null;return {data:v,meta}}
/* même nettoyage qu'au démarrage (anciennes versions mises à jour), sans toucher aux données de ce téléphone */
function bkNorm(v){const keep=S;let out=null;try{load(v,1);out=JSON.parse(JSON.stringify(packData()))}catch(e){out=null}finally{S=keep}return out}
/* ---- fusion : rien n'est supprimé ; différence = le plus récent si connu (champ u ou t), sinon ce téléphone ---- */
const bkJ=x=>JSON.stringify(x),bkTs=o=>+(o&&(o.u||o.t))||0;
function bkById(A,B,R,lab){const out=(A||[]).map(x=>x),idx={};out.forEach((x,i)=>{if(x&&x.id!==undefined)idx[x.id]=i});
  (B||[]).forEach(y=>{if(!y||y.id===undefined)return;const i=idx[y.id];if(i===undefined){out.push(y);idx[y.id]=out.length-1;R.add[lab]=(R.add[lab]||0)+1;return}
    const x=out[i];if(bkJ(x)===bkJ(y))return;if(bkTs(y)>bkTs(x)){out[i]=y;R.upd[lab]=(R.upd[lab]||0)+1}else R.kept[lab]=(R.kept[lab]||0)+1});return out}
function bkByDate(A,B,R,lab){const out=(A||[]).map(x=>x),idx={};out.forEach((x,i)=>{if(x)idx[x.d]=i});
  (B||[]).forEach(y=>{if(!y||!y.d)return;const i=idx[y.d];if(i===undefined){out.push(y);idx[y.d]=out.length-1;R.add[lab]=(R.add[lab]||0)+1}else if(bkJ(out[i])!==bkJ(y))R.kept[lab]=(R.kept[lab]||0)+1});
  return out.sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:0)}
const bkUnion=(A,B)=>{const o=(A||[]).slice();(B||[]).forEach(x=>{if(!o.some(y=>bkJ(y)===bkJ(x)))o.push(x)});return o};
function bkMerge(cur,inc){const R={add:{},upd:{},kept:{}},m=JSON.parse(JSON.stringify(cur)),b=JSON.parse(JSON.stringify(inc));
  m.sessions=bkById(m.sessions,b.sessions,R,'s');m.rest=bkUnion(m.rest,b.rest).filter(k=>!m.sessions.some(s=>s.date===k));
  /* records : même id, sinon même nom et unité ; historiques réunis par date (même jour = la plus grande valeur) */
  m.recs=(m.recs||[]).slice();(b.recs||[]).forEach(r=>{const x=m.recs.find(q=>q.id===r.id)||m.recs.find(q=>q.name===r.name&&q.unit===r.unit);if(!x){m.recs.push(r);R.add.r=(R.add.r||0)+1;return}
    const H={};(x.hist||[]).forEach(h=>{H[h.d]=h.v});let ch=0;(r.hist||[]).forEach(h=>{if(H[h.d]===undefined||h.v>H[h.d]){H[h.d]=h.v;ch=1}});if(ch){x.hist=Object.keys(H).sort().map(d=>({d,v:H[d]}));R.upd.r=(R.upd.r||0)+1}});
  m.bw=bkByDate(m.bw,b.bw,R,'m');if(b.meas&&typeof b.meas==='object'){m.meas=m.meas&&typeof m.meas==='object'?m.meas:{};for(const k in b.meas)m.meas[k]=bkByDate(m.meas[k],b.meas[k],R,'m')}
  m.carnet=bkById(m.carnet,b.carnet,R,'n');m.goals=bkUnion(m.goals,b.goals);m.deloads=bkUnion(m.deloads,b.deloads).sort();m.links=bkUnion(m.links,b.links);m.chalH=bkUnion(m.chalH,b.chalH);
  m.presets=bkById(m.presets,b.presets,R,'p');m.tpls=bkUnion(m.tpls,b.tpls);m.fav=bkUnion(m.fav,b.fav);
  if(Array.isArray(b.exg)){m.exg=Array.isArray(m.exg)?m.exg:[];b.exg.forEach(g=>{const x=m.exg.find(h=>h[0]===g[0]);if(!x)m.exg.push(g);else (g[1]||[]).forEach(e=>{if(!x[1].includes(e))x[1].push(e)})})}
  if(b.notes&&typeof b.notes==='object'){m.notes=m.notes||{};for(const k in b.notes){if(!m.notes[k])m.notes[k]=b.notes[k];else if(m.notes[k]!==b.notes[k])R.kept.n=(R.kept.n||0)+1}}
  if(b.skills){m.skills=m.skills||{};for(const k in b.skills){m.skills[k]=m.skills[k]||{};for(const i in b.skills[k]){const a=m.skills[k][i],c=b.skills[k][i];if(!a||(c&&c<a))m.skills[k][i]=c}}}
  if(b.tests){m.tests=m.tests||{};for(const mk in b.tests){m.tests[mk]=m.tests[mk]||{};for(const x in b.tests[mk])if(m.tests[mk][x]===undefined)m.tests[mk][x]=b.tests[mk][x]}}
  if(b.cnt){m.cnt=m.cnt||{};for(const k in b.cnt)m.cnt[k]=Math.max(+m.cnt[k]||0,+b.cnt[k]||0)}
  /* nutrition : jours réunis, entrées du même moment réunies (même heure d'ajout = même entrée) */
  if(b.nut&&typeof b.nut==='object'){m.nut=m.nut&&typeof m.nut==='object'?m.nut:{};const A=m.nut.days=m.nut.days||{};for(const d in (b.nut.days||{})){const y=b.nut.days[d]||{};if(!A[d]){A[d]=y;R.add.j=(R.add.j||0)+1;continue}
      for(const mo in y){if(!Array.isArray(y[mo]))continue;const L=A[d][mo]=Array.isArray(A[d][mo])?A[d][mo]:[];y[mo].forEach(e=>{if(!L.some(z=>bkJ(z)===bkJ(e)||(e.t&&z.t===e.t&&z.n===e.n)))L.push(e)})}}
    m.nut.pins=bkUnion(m.nut.pins,b.nut.pins);if(!m.nut.kG&&b.nut.kG)m.nut.kG=b.nut.kG;if(!m.nut.pG&&b.nut.pG)m.nut.pG=b.nut.pG;for(const k in b.nut)if(m.nut[k]===undefined)m.nut[k]=b.nut[k]}
  /* compléments : fiches par id, prises réunies (même prise des deux côtés = la plus récente), journal réuni */
  if(b.supp&&typeof b.supp==='object'){m.supp=m.supp&&typeof m.supp==='object'?m.supp:{};m.supp.list=bkById(m.supp.list,b.supp.list,R,'c');const LG=m.supp.log=m.supp.log||{};
    for(const d in (b.supp.log||{})){LG[d]=LG[d]||{};for(const k in b.supp.log[d]){const x=LG[d][k],y=b.supp.log[d][k];if(!x||bkTs(y)>bkTs(x))LG[d][k]=y}}
    m.supp.ev=bkUnion(m.supp.ev,b.supp.ev).sort((a,c)=>(a.t||0)-(c.t||0));for(const k in b.supp)if(m.supp[k]===undefined)m.supp[k]=b.supp[k]}
  /* planificateur (v7.7) : programmes et séances prévues par id, le plus récent gagne */
  if(b.plan&&typeof b.plan==='object'){m.plan=m.plan&&typeof m.plan==='object'?m.plan:{};m.plan.progs=bkById(m.plan.progs,b.plan.progs,R,'p');m.plan.it=bkById(m.plan.it,b.plan.it,R,'i');
    if(m.plan.progs.filter(p=>p.act).length>1){const a=m.plan.progs.filter(p=>p.act).sort((x,y)=>(y.u||0)-(x.u||0));a.slice(1).forEach(p=>{p.act=false})}}
  /* le reste (réglages, perso, compteurs…) : ce téléphone d'abord, la sauvegarde seulement si absent ici */
  for(const k in b)if(m[k]===undefined||m[k]===null||m[k]==='')m[k]=b[k];m.onb=!!(cur.onb||inc.onb);
  return {data:m,rep:R}}
/* ---- comparer avant d'importer (aperçu) ---- */
function bkDiff(cur,inc){const o={nw:0,same:0,dif:0},ids={};(cur.sessions||[]).forEach(s=>{ids[s.id]=bkJ(s)});(inc.sessions||[]).forEach(s=>{const x=ids[s.id];if(x===undefined)o.nw++;else if(x===bkJ(s))o.same++;else o.dif++});
  o.gone=(cur.sessions||[]).filter(s=>!(inc.sessions||[]).some(y=>y.id===s.id)).length;return o}
/* ---- appliquer : fusionner ou remplacer (sauvegarde automatique avant, annulable) ---- */
function bkApply(mode,inc){return bkApplyA(mode,inc)}
async function bkApplyA(mode,inc){const cur=JSON.parse(JSON.stringify(packData())),lang=S.lang;await bkSnapA('safe',mode);
  let data,rep=null;if(mode==='merge'){const r=bkMerge(cur,inc);data=r.data;rep=r.rep}else data=JSON.parse(JSON.stringify(inc));
  data.lang=lang;data.onb=true;load(data);S.lang=lang;await save();bkAfterLoad();
  const nS=rep?(rep.add.s||0):0,msg=mode==='merge'?(nS?'Fusion terminée : '+nS+' séance'+(nS>1?'s':'')+' ajoutée'+(nS>1?'s':''):'Fusion terminée'):'Données remplacées';
  snack(msg,'Annuler',()=>{load(cur);S.lang=lang;save();bkAfterLoad();toast('Données d\'avant remises')},6000);return rep}
function bkAfterLoad(){try{applyAcc();applyIcon()}catch(e){}try{route()}catch(e){}bkRender()}
/* ---- écrans ---- */
const BKK={auto:'Automatique',safe:'Avant une modification',man:'Manuelle'},BKW={merge:'Avant une fusion',replace:'Avant un remplacement',restore:'Avant une restauration'};
function bkWhen(t,abs){const d=new Date(t),k=key(d),hm=d.toLocaleTimeString(LOC(),{hour:'2-digit',minute:'2-digit'});return (!abs&&k===TK?'Aujourd\'hui':!abs&&k===key(add(T,-1))?'Hier':d.toLocaleDateString(LOC(),{day:'numeric',month:'short',year:d.getFullYear()===T.getFullYear()?undefined:'numeric'}))+' · '+hm}
function bkNTxt(n){if(!n)return '';const p=[n.s+' séance'+(n.s>1?'s':'')];if(n.r)p.push(n.r+' record'+(n.r>1?'s':''));if(n.m)p.push(n.m+' mesure'+(n.m>1?'s':''));return p.join(' · ')}
function bkRender(){const el=$('bk7');if(!el)return;const x=+bkLs('carnet-bkx')||0,lt=+bkLs('carnet-bkt')||0,days=x?Math.floor((Date.now()-x)/864e5):-1,cnt=bkCount(packData());
  el.innerHTML='<div class="bk7st'+(bkErr?' err':'')+'"><span class="bk7ic">'+ico(bkErr?'warn':'check')+'</span><div><b>'+(bkErr?'Enregistrement impossible sur ce téléphone':'Enregistré sur ce téléphone')+'</b>'
    +'<small>'+(lt?'Sauvegarde automatique : '+bkWhen(lt):'Sauvegarde automatique : bientôt')+'</small>'
    +'<small class="'+(cnt.s>=5&&(days<0||days>=30)?'bk7old':'')+'">'+(x?'Dernier fichier exporté : '+(days===0?'aujourd\'hui':days===1?'hier':'il y a '+days+' jours'):'Aucun fichier exporté pour l\'instant')+'</small></div></div>'
    +'<p class="note bk7tip">Un fichier de sauvegarde garde tout (séances, records, mesures, notes, nutrition, compléments, réglages). Range-le dans Fichiers, iCloud Drive ou Google Drive pour le retrouver sur un autre appareil.</p>'
    +'<div class="row bk7acts"><button type="button" class="btn" data-bk="exp">'+ico('dl')+' Exporter</button><button type="button" class="btn ghost" data-bk="imp">'+ico('ul')+' Importer</button></div>'
    +'<details class="bk7h" id="bk7h"'+(el._open?' open':'')+'><summary>Historique des sauvegardes</summary><div id="bk7l"><p class="note">Chargement…</p></div><button type="button" class="btn ghost sm" data-bk="now">Créer une sauvegarde maintenant</button></details>';
  if(el._open)bkHist()}
function bkHist(){const box=$('bk7l');if(!box)return;bkList().then(L=>{if(!L.length){box.innerHTML='<p class="note">Aucune sauvegarde automatique pour l\'instant : la première sera faite après ta prochaine modification.</p>';return}
  box.innerHTML='<div class="bk7list">'+L.map(o=>'<div class="bk7row"><div><b>'+esc(bkWhen(o.t))+'</b><small>'+esc(o.k==='safe'?(BKW[o.why]||BKK.safe):(BKK[o.k]||BKK.auto))+'</small><small>'+esc(bkNTxt(o.n))+'</small></div>'
    +'<div class="bk7ra"><button type="button" class="btn ghost sm" data-bkr="'+o.id+'">Restaurer</button><button type="button" class="ib" data-bkx="'+o.id+'" aria-label="Exporter cette sauvegarde">'+ico('dl')+'</button></div></div>').join('')+'</div>'})}
/* aperçu avant import / restauration */
let bkIn=null,bkOnbBack=0;
function bkPreview(p,srcLab){const inc=bkNorm(p.data);if(!inc){toast('Sauvegarde illisible');return}bkIn=inc;const cur=JSON.parse(JSON.stringify(packData())),n=bkCount(inc),df=bkDiff(cur,inc),fd=d=>d?dLong(d):'';
  const row=(lab,v)=>v?'<li><span>'+lab+'</span><b>'+v+'</b></li>':'';
  openSheet('<h3>'+(srcLab||'Importer une sauvegarde')+'</h3>'+(p.meta&&p.meta.at?'<p class="findsub">'+esc('Fichier du '+bkWhen(Date.parse(p.meta.at),1))+(p.meta.v?'<span> · version '+esc(p.meta.v)+'</span>':'')+'</p>':'')
    +'<ul class="bk7cnt">'+row('Séances',n.s)+(n.s?'<li class="bk7sub"><span>'+esc(fd(n.d0)+' → '+fd(n.d1))+'</span></li>':'')+row('Records',n.r)+row('Mesures',n.m)+row('Notes',n.n)+row('Jours de nutrition',n.j)+row('Compléments',n.c)+row('Objectifs',n.g)+'</ul>'
    +'<p class="bk7cmp"><b>Comparé à ce téléphone</b><span>'+df.nw+' séance'+(df.nw>1?'s':'')+' en plus</span><span>'+df.same+' déjà présente'+(df.same>1?'s':'')+'</span>'+(df.dif?'<span>'+df.dif+' différente'+(df.dif>1?'s':'')+'</span>':'')+(df.gone?'<span>'+df.gone+' seulement sur ce téléphone</span>':'')+'</p>'
    +'<div class="bk7ch"><button type="button" class="bk7opt on" data-bkm="merge"><b>Fusionner</b><small>Ajoute ce qui manque, ne supprime rien. Si une séance existe des deux côtés avec des différences, la version la plus récente est gardée (sinon celle de ce téléphone).</small></button>'
    +'<button type="button" class="bk7opt" data-bkm="replace"><b>Remplacer</b><small>Remplace toutes les données de ce téléphone par cette sauvegarde. Une sauvegarde automatique est faite juste avant.</small></button></div>'
    +'<p class="note">Ta langue reste celle de ce téléphone.</p><div class="acts"><button type="button" class="btn ghost" data-bk="close">Annuler</button><button type="button" class="btn" data-bk="go" id="bkGo">Fusionner</button></div>')}
function bkImport(){openSheet('<h3>Importer une sauvegarde</h3><p class="findsub">Choisis un fichier de sauvegarde (.json) ou colle un code de transfert. Tu verras ce qu\'il contient avant que quoi que ce soit change.</p>'
  +'<button type="button" class="btn big" data-bk="file">'+ico('ul')+' Choisir un fichier</button><p class="bk7or"><span>ou</span></p><textarea id="bk7c" rows="3" spellcheck="false" placeholder="Colle ici un code de transfert" aria-label="Code de transfert"></textarea>'
  +'<div class="acts"><button type="button" class="btn ghost" data-bk="paste">Coller</button><button type="button" class="btn" data-bk="code">Continuer</button></div>')}
function bkPick(){const i=document.createElement('input');i.type='file';i.accept='.json,application/json,text/plain';i.onchange=()=>{const f=i.files&&i.files[0];if(!f)return;const r=new FileReader();r.onload=async()=>{const p=await bkParseA(r.result);if(!p){toast('Ce fichier n\'est pas une sauvegarde de Carnet');return}bkPreview(p)};r.readAsText(f)};i.click()}
async function bkFromText(t,srcLab){const p=await bkParseA(t);if(!p){toast('Code de transfert invalide');return false}bkPreview(p,srcLab);return true}
async function bkRestore(id){const d=await bkGet(id);if(!d){toast('Sauvegarde illisible');return}bkPreview({data:d,meta:{}},'Restaurer une sauvegarde');const m=document.querySelector('[data-bkm="replace"]');if(m)m.click()}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-bk],[data-bkm],[data-bkr],[data-bkx]');if(!b)return;const a=b.dataset.bk;
  if(b.dataset.bkm){document.querySelectorAll('.bk7opt').forEach(x=>x.classList.toggle('on',x===b));const g=$('bkGo');if(g){g.dataset.mode=b.dataset.bkm;g.textContent=b.dataset.bkm==='merge'?'Fusionner':'Remplacer';delete g.dataset.sure}return}
  if(b.dataset.bkr){bkRestore(b.dataset.bkr);return}
  if(b.dataset.bkx){const d=await bkGet(b.dataset.bkx);if(d)shareFile(new Blob([JSON.stringify({app:'carnet-de-seances',format:1,exported:new Date().toISOString(),appV:APP_V,data:d})],{type:'application/json'}),'carnet-sauvegarde-'+TK+'.json');return}
  if(a==='exp'){bkExport();const w=$('bkWarn');if(w&&w.classList.contains('soft'))w.remove();return}if(a==='imp'){bkImport();return}if(a==='file'){bkPick();return}if(a==='close'){closeSheet();if(bkOnbBack&&!S.onb){bkOnbBack=0;showOnb(0)}return}if(a==='wx'){const w=$('bkWarn');if(w)w.remove();return}
  if(a==='paste'){try{$('bk7c').value=await navigator.clipboard.readText()}catch(_){toast('Appuie longuement dans la case puis « Coller »')}return}
  if(a==='code'){bkFromText(($('bk7c')||{}).value);return}
  if(a==='now'){const id=await bkSnapA('man','');toast(id?'Sauvegarde créée ✓':'Sauvegarde impossible sur ce téléphone');return}
  if(a==='go'){if(!bkIn)return;const mode=b.dataset.mode||'merge';if(mode==='replace'&&!b.dataset.sure){b.dataset.sure='1';b.textContent='Confirmer le remplacement';return}const inc=bkIn;bkIn=null;closeSheet();await bkApplyA(mode,inc);return}});
document.addEventListener('toggle',e=>{if(e.target&&e.target.id==='bk7h'){const el=$('bk7');if(el)el._open=e.target.open;if(e.target.open)bkHist()}},true);
/* au démarrage : sauvegarde automatique si la dernière est ancienne ; données introuvables mais sauvegarde présente = proposer de la restaurer */
function bkBoot(hadLocal){setTimeout(bkNudge,6000);if(!window.indexedDB)return;setTimeout(()=>{const last=+bkLs('carnet-bkt')||0;if(Date.now()-last>=BK_GAP)bkSnap('auto')},4000);
  if(hadLocal||S.sessions.length)return;bkList().then(L=>{const o=L.find(x=>x.n&&x.n.s>0);if(!o)return;const ob=$('onb');if(ob){ob.remove();bkOnbBack=1}const ins=$('inst');if(ins){ins.remove();bkOnbBack=1}
    openSheet('<h3>Données retrouvées</h3><p class="findsub">'+esc('Sauvegarde automatique · '+bkWhen(o.t))+'</p><p class="bk7nb">'+esc(bkNTxt(o.n))+'</p><p class="note">Ce téléphone n\'a plus tes données (stockage vidé ?). Tu peux les remettre maintenant.</p><div class="acts"><button type="button" class="btn ghost" data-bk="close">Plus tard</button><button type="button" class="btn" data-bkr="'+o.id+'">Voir et restaurer</button></div>')})}
/* rappel discret (au plus une fois par mois, à partir de 10 séances) d'exporter un fichier : sans cloud, c'est la copie de
   sécurité hors du téléphone. Petit message en bas (6 s), jamais par-dessus une autre fenêtre ; sinon on réessaie plus tard. */
function bkNudge(tr){const n=S.sessions.length,x=+bkLs('carnet-bkx')||0,r=+bkLs('carnet-bkn')||0,now=Date.now();if(n<10||now-x<30*864e5||now-r<30*864e5)return;
  const busy=$('onb')||$('inst')||$('hey')||$('bil')||$('rec6')||$('rw6')||!$('snack').hidden||$('gsheet').classList.contains('open')||$('sheet').classList.contains('open');
  if(busy){if((tr||0)<4)setTimeout(()=>bkNudge((tr||0)+1),30000);return}
  bkLs('carnet-bkn',now);snack(x?'Ta sauvegarde date de plus d\'un mois':'Pense à exporter une sauvegarde','Exporter',bkExport,6000)}
