/* ===================== v7.2 : Carnet (bloc-notes personnel) =====================
   Aussi simple qu'un bloc-notes : créer, modifier, supprimer, épingler, ranger par catégorie, rechercher.
   S.carnet = [{id, c (catégorie), t (titre), b (texte), pin, d (création, ms), u (modification, ms)}].
   Les notes écrites dans le guide des exercices (S.notes[exercice]) apparaissent aussi dans « Exercices » :
   une seule source, pas de doublon. Enregistrement automatique pendant la frappe. */
const NCATS=[['nut','Nutrition'],['train','Entraînement'],['ex','Exercices'],['prog','Progression'],['misc','Divers']];
const NCN=Object.fromEntries(NCATS);
const NSUG={nut:['Mes repas types','Mes aliments habituels','Mes objectifs','Observations'],train:['Mes repères d\'entraînement','Ma semaine type'],ex:['Technique'],prog:['Observations sur ma progression'],misc:['Idées']};
let ncat='',nbQ='',nEd=null;
function notesLoad(){S.carnet=arr(S.carnet).filter(n=>n&&n.id).map(n=>({id:String(n.id),c:NCN[n.c]?n.c:'misc',t:String(n.t||'').slice(0,120),b:String(n.b||'').slice(0,20000),pin:!!n.pin,d:+n.d||Date.now(),u:+n.u||+n.d||Date.now()}))}
const nbDate=ms=>{const d=new Date(ms),k=key(d),n=Math.round((parse(TK)-parse(k))/864e5);return n===0?'Aujourd\'hui':n===1?'Hier':d.toLocaleDateString(LOC(),{day:'numeric',month:'short',year:d.getFullYear()===T.getFullYear()?undefined:'numeric'})};
const exNotes=()=>Object.entries(obj(S.notes)).filter(([x,t])=>typeof t==='string'&&t.trim()).map(([x,t])=>({x,t:t.trim()}));
function nbMatch(txt,Q){return !Q||Q.split(/\s+/).every(w=>nrm(txt).includes(w))}
function noteCard(n){const prev=n.b.trim().split('\n').map(s=>s.trim()).filter(Boolean).slice(0,3).join(' · ');
  return '<button type="button" class="nb8n" data-nbo="'+esc(n.id)+'"><span class="nb8h"><b>'+esc(n.t||'Sans titre')+'</b>'+(n.pin?'<span class="nb8pin" aria-label="Épinglée">'+ico('pin')+'</span>':'')+'</span>'+(prev?'<span class="nb8p">'+esc(prev)+'</span>':'')+'<span class="nb8m"><span>'+NCN[n.c]+'</span><span>'+esc(nbDate(n.u))+'</span></span></button>'}
function renderNotes(){const v=$('vNotes');if(!v)return;const all=S.carnet,Q=nrm(nbQ).trim(),L=all.filter(n=>(!ncat||n.c===ncat)&&nbMatch(n.t+' '+n.b,Q)).sort((a,b)=>(b.pin-a.pin)||(b.u-a.u)),X=!ncat||ncat==='ex'?exNotes().filter(e=>nbMatch(e.x+' '+e.t,Q)):[];
  const cnt=c=>all.filter(n=>n.c===c).length+(c==='ex'?exNotes().length:0);
  let h='<section class="panel wide nb8"><div class="nb8top"><label class="nb8s">'+ico('search')+'<input type="search" id="nbQ" placeholder="Rechercher" value="'+esc(nbQ)+'" autocomplete="off" enterkeyhint="search" aria-label="Rechercher dans mes notes"></label><button type="button" class="btn nb8new" data-nb="new">'+ico('add')+'<span>Note</span></button></div>'
   +'<div class="nb8c" role="group" aria-label="Catégories">'+[['','Toutes']].concat(NCATS).map(c=>{const k=c[0]?cnt(c[0]):all.length+exNotes().length;return '<button type="button" class="nb8k" data-nbc="'+c[0]+'" aria-pressed="'+(ncat===c[0])+'"><span>'+c[1]+'</span>'+(k?'<small>'+k+'</small>':'')+'</button>'}).join('')+'</div></section>';
  if(!L.length&&!X.length){const sug=ncat?NSUG[ncat]:NSUG.nut.slice(0,2).concat(NSUG.train.slice(0,1)),c0=ncat||'';
    h+='<section class="panel wide nb8e0"><b>'+(Q?'Aucune note ne correspond.':ncat?'Rien dans « '+NCN[ncat]+' » pour l\'instant.':'Ton carnet est vide.')+'</b>'+(Q?'':'<p class="nfs">Garde ici tes repères, tes observations et ce que tu apprends. Pour commencer :</p><div class="nb8sg">'+sug.map((t,i)=>'<button type="button" class="chip" data-nbs="'+(c0||(i<2?'nut':'train'))+'|'+esc(t)+'">'+ico('add')+'<span>'+esc(t)+'</span></button>').join('')+'</div>')+'</section>'}
  else h+='<div class="wide nb8l">'+L.map(noteCard).join('')+X.map(e=>'<button type="button" class="nb8n nb8x" data-nbx="'+esc(e.x)+'"><span class="nb8h"><b>'+esc(e.x)+'</b></span><span class="nb8p">'+esc(e.t.split('\n').filter(Boolean).slice(0,3).join(' · '))+'</span><span class="nb8m"><span>Exercices</span><span>Guide de l\'exercice</span></span></button>').join('')+'</div>';
  v.innerHTML=h}
/* ---- éditeur (feuille du bas), enregistrement automatique ---- */
function noteOpen(id,preset){const n=id?S.carnet.find(x=>x.id===id):null;if(id&&!n)return;nEd={id:n?n.id:'',c:n?n.c:(preset&&preset.c)||ncat||'misc',pin:n?n.pin:false};
  openSheet('<div class="nsh nb8ed"><div class="nb8ec" role="group" aria-label="Catégorie">'+NCATS.map(c=>'<button type="button" class="nb8k" data-nbe="c:'+c[0]+'" aria-pressed="'+(nEd.c===c[0])+'"><span>'+c[1]+'</span></button>').join('')+'</div>'
   +'<input id="nbT" class="nb8tt" maxlength="120" placeholder="Titre" value="'+esc(n?n.t:(preset&&preset.t)||'')+'" autocomplete="off" enterkeyhint="next">'
   +'<textarea id="nbB" class="nb8tx" rows="8" placeholder="Écris ta note…">'+esc(n?n.b:'')+'</textarea>'
   +'<div class="nb8ef"><button type="button" class="ib" data-nbe="pin" aria-pressed="'+nEd.pin+'" aria-label="Épingler en haut du carnet">'+ico('pin')+'</button>'+(n?'<button type="button" class="ib" data-nbe="del" aria-label="Supprimer la note">'+ico('trash')+'</button>':'')+'<span class="nb8d" id="nbD">'+(n?ico('edit')+'<span>'+esc(nbDate(n.u))+'</span>':'')+'</span><button type="button" class="btn nb8ok" data-nbe="ok">OK</button></div></div>');
  nbGrow();setTimeout(()=>{const t=$(n||(preset&&preset.t)?'nbB':'nbT');if(t&&!n)t.focus()},260)}
function nbGrow(){const t=$('nbB');if(!t)return;t.style.height='auto';t.style.height=Math.min(innerHeight*.55,Math.max(180,t.scrollHeight+4))+'px'}
function noteSave(){if(!nEd)return;const ti=$('nbT'),bi=$('nbB');if(!ti||!bi)return;const t=ti.value.trim(),b=bi.value.replace(/\s+$/,''),now=Date.now();
  if(!nEd.id){if(!t&&!b.trim())return;nEd.id='n'+now.toString(36);S.carnet.push({id:nEd.id,c:nEd.c,t,b,pin:nEd.pin,d:now,u:now})}
  else{const n=S.carnet.find(x=>x.id===nEd.id);if(!n)return;if(n.t===t&&n.b===b&&n.c===nEd.c&&n.pin===nEd.pin)return;Object.assign(n,{t,b,c:nEd.c,pin:nEd.pin,u:now})}
  save();const d=$('nbD');if(d)d.textContent='Enregistré'}
function notesRefresh(){if(curV==='notes')renderNotes();if(curV==='home')renderHome()}
/* fermeture de la feuille (bouton, toucher à côté, glisser) : on enregistre ce qui a été écrit */
(()=>{const g=$('gsheet');if(!g)return;new MutationObserver(()=>{if(!g.classList.contains('open')&&nEd){clearTimeout(noteSave._t);noteSave();nEd=null;notesRefresh()}}).observe(g,{attributes:true,attributeFilter:['class']})})();
/* carte de l'accueil actuel */
function notesCard(){const L=S.carnet.slice().sort((a,b)=>(b.pin-a.pin)||(b.u-a.u)),n=L.length+exNotes().length;
  return '<div class="h7c nb7"><a class="nb7m" href="#carnet"><span class="hcic">'+ico('note')+'</span><span class="h7b"><span class="kick">Carnet</span><b>'+(L.length?esc(L[0].t||'Sans titre'):'Tes notes personnelles')+'</b><span class="nb7s">'+(n?n+' note'+(n>1?'s':''):'Nutrition, entraînement, observations')+'</span></span></a><button type="button" class="ib pw7a" data-nb="new" aria-label="Nouvelle note">'+ico('add')+'</button></div>'}
document.addEventListener('click',e=>{const b=e.target.closest('[data-nb],[data-nbc],[data-nbo],[data-nbe],[data-nbs],[data-nbx],[data-ncat]');if(!b)return;const d=b.dataset;
  if(d.ncat!==undefined){ncat=d.ncat;nbQ='';if(location.hash==='#carnet')renderNotes();return}
  if(d.nb==='new'){noteOpen('');return}
  if(d.nbc!==undefined){ncat=d.nbc;renderNotes();return}
  if(d.nbo){noteOpen(d.nbo);return}
  if(d.nbs){const [c,t]=d.nbs.split('|');noteOpen('',{c,t});return}
  if(d.nbx){showGuide(d.nbx);return}
  if(d.nbe&&nEd){const a=d.nbe;
    if(a.startsWith('c:')){nEd.c=a.slice(2);b.parentNode.querySelectorAll('[data-nbe^="c:"]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));noteSave();return}
    if(a==='pin'){nEd.pin=!nEd.pin;b.setAttribute('aria-pressed',String(nEd.pin));noteSave();return}
    if(a==='ok'){clearTimeout(noteSave._t);noteSave();closeSheet();return}
    if(a==='del'){const id=nEd.id,i=S.carnet.findIndex(x=>x.id===id);if(i<0)return;const rm=S.carnet.splice(i,1)[0];nEd=null;save();closeSheet();notesRefresh();snack('Note supprimée','Annuler',()=>{S.carnet.splice(Math.min(i,S.carnet.length),0,rm);save();notesRefresh()});return}}});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='nbT'||t.id==='nbB'){if(t.id==='nbB')nbGrow();const d=$('nbD');if(d)d.textContent='';clearTimeout(noteSave._t);noteSave._t=setTimeout(noteSave,500);return}
  if(t.id==='nbQ'){nbQ=t.value;const pos=t.selectionStart;renderNotes();const q=$('nbQ');if(q){q.focus();try{q.setSelectionRange(pos,pos)}catch(_){}}}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='nbT'){e.preventDefault();const b=$('nbB');if(b)b.focus()}});
