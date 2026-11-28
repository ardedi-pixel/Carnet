/* ===================== v7.7 : planificateur (programmes, séances prévues, prévu / réalisé) =====================
   Données S.plan (clé dans EXTRA, donc dans la sauvegarde, l'export et la fusion) :
   progs : [{id, n (nom), ds (description), d0 (début AAAA-MM-JJ), wk (durée en semaines, 0 = sans fin), act (actif), arch (archivé), u,
            ts : [{id, n (nom de la séance), dow:[1..7] (jours, 1 = lundi), pl (lieu ou ''), no (consignes),
                   ex : [{x (exercice), s (séries), r (rép. : '10', '8-12', 'max'), kg, sec, rest (s), no}]}]}]
   it : [{id, pid, tid, d (date prévue), d0 (date d'origine), st ('plan' | 'skip'), sid (séance faite liée), u,
          sn : copie de la séance prévue au moment où elle a été planifiée ({n, pl, no, ex}) }]
   Statut affiché (plSt) : faite (séance liée qui couvre le prévu), incomplète (séance liée partielle), non faite (skip),
   manquée (jour passé, rien de lié), reportée (date ≠ date d'origine), prévue.
   - Le prévu n'est jamais remplacé par le réalisé : la comparaison lit sn (prévu) et la séance (réalisé, détail par série).
   - Un seul programme actif ; en changer garde l'historique (séances faites et jours passés). Les séances prévues sont
     créées 6 semaines à l'avance, à partir d'aujourd'hui (jamais dans le passé).
   - L'appli propose (reporter, déplacer) ; rien ne change sans validation ; jamais deux séances prévues le même jour
     par une proposition automatique, jamais sur un jour de repos noté. */
if(!EXTRA.includes('plan'))EXTRA.push('plan');
const PLH=42;
function PLN(){const p=S.plan=S.plan&&typeof S.plan==='object'?S.plan:{};p.progs=Array.isArray(p.progs)?p.progs:[];p.it=Array.isArray(p.it)?p.it:[];return p}
const plId=()=>'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const plDow=k=>((parse(k).getDay()+6)%7)+1;
function plAct(){return PLN().progs.find(p=>p.act&&!p.arch)||null}
function plProg(id){return PLN().progs.find(p=>p.id===id)||null}
function plEnd(p){return p&&p.wk>0?key(add(parse(p.d0),p.wk*7-1)):''}
const plSnap=t=>JSON.parse(JSON.stringify({n:t.n||'',pl:t.pl||'',no:t.no||'',ex:(t.ex||[]).filter(e=>e&&e.x)}));
/* séances prévues du programme actif, d'aujourd'hui (ou du début) jusqu'à 6 semaines */
function plGen(){const P=PLN(),p=plAct();if(!p)return 0;let n=0;const from=p.d0>TK?p.d0:TK,e0=key(add(T,PLH)),pe=plEnd(p),end=pe&&pe<e0?pe:e0;
  for(let d=parse(from);key(d)<=end;d=add(d,1)){const k=key(d),dw=plDow(k);
    (p.ts||[]).forEach(t=>{if(!(t.dow||[]).includes(dw)||P.it.some(i=>i.pid===p.id&&i.tid===t.id&&i.d0===k))return;P.it.push({id:plId(),pid:p.id,tid:t.id,d:k,d0:k,st:'plan',sn:plSnap(t),u:Date.now()});n++})}
  return n}
/* retirer les séances à venir d'un programme qui ne sont ni faites ni déplacées à la main (modification ou changement) */
function plDrop(pid,all){const P=PLN();P.it=P.it.filter(i=>!(i.pid===pid&&!i.sid&&i.d>=TK&&(all?['plan','skip'].includes(i.st):i.st==='plan'&&i.d===i.d0)))} /* changement de programme : tout l'à-venir non fait part ; modification : seulement ce qui n'a pas été touché */
function plRegen(p){plDrop(p.id,false);if(p.act)plGen()}
function plActivate(id){const P=PLN();P.progs.forEach(p=>{if(p.act&&p.id!==id){p.act=false;plDrop(p.id,true)}});const p=plProg(id);if(!p)return;p.act=true;p.arch=false;if(!p.d0||p.d0<TK&&!P.it.some(i=>i.pid===p.id))p.d0=TK;p.u=Date.now();plGen()}
function plStop(id){const p=plProg(id);if(!p)return;p.act=false;p.u=Date.now();plDrop(p.id,true)}
/* ---- séances faites ---- */
function plSets(p){if(!p)return [];if(Array.isArray(p.sets)&&p.sets.length)return p.sets;const n=+p.s||0;return n?Array.from({length:n},()=>({r:+p.r||0,kg:+p.kg||0,sec:+p.sec||0})):[]}
function plExDone(e,s){if(!s||!s.ex.includes(e.x))return 0;const p=s.perf&&s.perf[e.x];if(!p)return 2;const n=plSets(p).length;return !e.s||!n||n>=e.s?2:1} /* 2 fait, 1 partiel, 0 non fait */
function plSt(i){if(i.st==='skip')return 'skip';const s=i.sid?S.sessions.find(x=>x.id===i.sid):null;if(s){const ex=(i.sn&&i.sn.ex)||[];return ex.every(e=>plExDone(e,s)===2)?'done':'part'}
  if(i.d<TK)return 'miss';return i.d!==i.d0?'post':'plan'}
const PLST={plan:'Prévue',post:'Reportée',done:'Faite',part:'Incomplète',skip:'Non faite',miss:'Manquée'};
function plOn(k){return PLN().it.filter(i=>i.d===k).sort((a,b)=>(a.sn&&a.sn.n||'').localeCompare(b.sn&&b.sn.n||''))}
/* lier une séance notée à la séance prévue du même jour (ou à celle choisie depuis le planning) */
function plOnSave(ss,fm){const P=PLN();if(!P.it.length)return;P.it.forEach(i=>{if(i.sid===ss.id&&(!fm||fm.plan!==i.id)&&i.d!==ss.date)i.sid=''});
  let it=fm&&fm.plan?P.it.find(i=>i.id===fm.plan):null;
  if(!it)it=P.it.find(i=>i.d===ss.date&&!i.sid&&i.st!=='skip'&&(!(i.sn&&i.sn.ex||[]).length||(i.sn.ex||[]).some(e=>ss.ex.includes(e.x))));
  if(it){it.sid=ss.id;if(it.d!==ss.date)it.d=ss.date;it.st='plan';it.u=Date.now()}}
function plOnDel(id){const L=PLN().it.filter(i=>i.sid===id);L.forEach(i=>{i.sid='';i.u=Date.now()});return L}
/* ---- textes ---- */
function plRx(e){const r=e.sec?e.sec+' s':(e.r||'');return [e.s?e.s+(r?' × '+r:' séries'):r,e.kg?fmtN(+e.kg)+' kg':''].filter(Boolean).join(' · ')}
function plDone(s,x){const p=s&&s.perf&&s.perf[x];if(!p)return s&&s.ex.includes(x)?'Fait':'';const L=Array.isArray(p.sets)&&p.sets.length?p.sets:null;
  if(L){const v=L.map(z=>z.sec?z.sec+' s':z.r||'–').join(' / '),kgs=[...new Set(L.map(z=>+z.kg||0))];return v+(kgs.some(Boolean)?' · '+(kgs.length===1?fmtN(kgs[0]):kgs.map(fmtN).join('/'))+' kg':'')}
  return (p.s?p.s+' × ':'')+(p.sec?p.sec+' s':p.r||'')+(p.kg?' · '+fmtN(p.kg)+' kg':'')}
const PLDN=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
function plDaysTxt(dw){return (dw||[]).slice().sort().map(n=>PLDN[n-1]).join(' · ')}
function plWeekOf(p){if(!p||!p.d0)return 0;const n=Math.floor((parse(TK)-parse(p.d0))/864e5/7)+1;return n<1?0:n}
/* ---- propositions : reporter une séance (rien ne change sans validation) ---- */
function plFree(k){return !plOn(k).some(i=>plSt(i)!=='skip')&&!isRest(k)&&!sOf(k).length}
function plNextFree(from,lim){let d=parse(from);for(let n=0;n<(lim||21);n++){d=add(d,1);const k=key(d);if(k>=TK&&plFree(k))return k}return ''}
function plProps(i){const base=i.d<TK?key(add(T,-1)):i.d,a=plNextFree(base,14),w=key(add(parse(i.d0),7)),b=w>=TK&&plFree(w)?w:plNextFree(key(add(monday(parse(i.d0)),6)),14);
  const o=[];if(a)o.push({k:'next',d:a});if(b&&b!==a)o.push({k:'week',d:b});return o}
/* ---- calendrier : marques des séances prévues ---- */
function plCell(k){const L=plOn(k);if(!L.length)return '';const st=L.map(plSt),top=st.includes('miss')?'miss':st.includes('plan')||st.includes('post')?'plan':st.includes('part')?'part':st.includes('done')?'done':'skip';
  return top==='done'?'':'<span class="pl7c st-'+top+'" aria-hidden="true"></span>'}
function plCellLab(k){const L=plOn(k);return L.length?', '+L.map(i=>(i.sn&&i.sn.n||'Séance prévue')+' : '+PLST[plSt(i)].toLowerCase()).join(', '):''}
function plWeekRow(k){const L=plOn(k).filter(i=>!i.sid);if(!L.length)return '';const i=L[0],st=plSt(i),ex=(i.sn&&i.sn.ex||[]).map(e=>trS(e.x));
  return '<span class="pl7w st-'+st+'"><b>'+esc(i.sn&&i.sn.n||'Séance prévue')+'</b><span class="pl7chip st-'+st+'">'+PLST[st]+'</span><small>'+esc(ex.slice(0,3).join(', ')+(ex.length>3?' +'+(ex.length-3):''))+'</small></span>'}
/* ---- détail du jour : séance prévue (prévu / réalisé, actions) ---- */
function plDayHtml(k){const L=plOn(k);if(!L.length)return '';return L.map(i=>{const st=plSt(i),s=i.sid?S.sessions.find(x=>x.id===i.sid):null,p=plProg(i.pid),sn=i.sn||{ex:[]};
  const rows=(sn.ex||[]).map(e=>{const dn=s?plExDone(e,s):0;return '<li class="pl7x'+(s?' d'+dn:'')+'"><span class="pl7xn">'+esc(e.x)+'</span><span class="pl7xp"><small>Prévu</small><b>'+esc(plRx(e)||'—')+'</b></span>'+(s?'<span class="pl7xd"><small>Fait</small><b>'+esc(plDone(s,e.x)||'—')+'</b></span>':'')+(e.rest?'<span class="pl7xr">'+ico('timer')+'<span>'+esc(mmssL(+e.rest))+'</span></span>':'')+(e.no?'<em class="pl7xno notr">'+esc(e.no)+'</em>':'')+'</li>'}).join('');
  const acts=st==='done'||st==='part'?'':st==='skip'?'<button type="button" class="btn ghost sm" data-pla="undo:'+i.id+'">Remettre au programme</button>'
    :(k<=TK?'<button type="button" class="btn sm" data-pla="log:'+i.id+'">'+ico('check')+' Noter cette séance</button>':'')+'<button type="button" class="btn ghost sm" data-pla="move:'+i.id+'">Reporter…</button><button type="button" class="btn ghost sm" data-pla="skip:'+i.id+'">Non faite</button>';
  return '<div class="pl7card st-'+st+'"><div class="pl7h"><span class="pl7dot"></span><div><b>'+esc(sn.n||'Séance prévue')+'</b><small>'+esc(spJn([p?p.n:'',sn.pl?plN[sn.pl]||'':'',i.d!==i.d0?'prévue le '+dLong(i.d0):'']))+'</small></div><span class="pl7chip st-'+st+'">'+PLST[st]+'</span></div>'
    +(sn.no?'<p class="pl7no notr">'+esc(sn.no)+'</p>':'')+(rows?'<ul class="pl7xs">'+rows+'</ul>':'')+(acts?'<div class="pl7acts">'+acts+'</div>':'')+'</div>'}).join('')}
const spJn=a=>a.filter(Boolean).join(' · ');
/* ---- bandeau du programme en haut du calendrier ---- */
function plStrip(){const p=plAct();if(!p)return '<button type="button" class="pl7strip none" data-pla="page">'+ico('cal')+'<span><b>Planifier mes séances</b><small>Crée un programme : il remplit ton calendrier</small></span><span class="chev">›</span></button>';
  const nx=PLN().it.filter(i=>i.pid===p.id&&i.d>=TK&&plSt(i)!=='skip'&&!i.sid).sort((a,b)=>a.d<b.d?-1:1)[0],wk=plWeekOf(p),miss=PLN().it.filter(i=>i.pid===p.id&&plSt(i)==='miss'&&i.d>=key(add(T,-7))).length;
  return '<button type="button" class="pl7strip" data-pla="page">'+ico('cal')+'<span><b>'+esc(p.n)+'</b><small>'+esc(spJn([p.wk?'Semaine '+Math.min(wk,p.wk)+' sur '+p.wk:wk?'Semaine '+wk:'',nx?'Prochaine : '+(nx.d===TK?'aujourd\'hui':dLong(nx.d))+' · '+(nx.sn&&nx.sn.n||''):'']))+'</small>'+(miss?'<small class="pl7miss">'+esc(miss===1?'1 séance manquée cette semaine':miss+' séances manquées cette semaine')+'</small>':'')+'</span><span class="chev">›</span></button>'}
/* ---- page « Programmes » (dans l'onglet Calendrier) ---- */
function plPage(){const P=PLN(),L=P.progs.filter(p=>!p.arch),A=P.progs.filter(p=>p.arch);
  const card=p=>{const nd=new Set((p.ts||[]).flatMap(t=>t.dow||[])).size,ne=(p.ts||[]).reduce((a,t)=>a+(t.ex||[]).length,0),done=P.it.filter(i=>i.pid===p.id&&['done','part'].includes(plSt(i))).length;
    return '<div class="pl7p'+(p.act?' on':'')+'"><div class="pl7ph"><div><b>'+esc(p.n)+'</b><small>'+esc(spJn([nd?nd+' jour'+(nd>1?'s':'')+' par semaine':'',p.wk?p.wk+' semaine'+(p.wk>1?'s':''):'Sans fin',done?done+' séance'+(done>1?'s':'')+' faite'+(done>1?'s':''):'']))+'</small></div>'+(p.act?'<span class="pl7chip st-done">Actif</span>':'')+'</div>'
      +(p.ds?'<p class="pl7ds notr">'+esc(p.ds)+'</p>':'')
      +'<ul class="pl7tl">'+(p.ts||[]).map(t=>'<li><b class="notr">'+esc(t.n||'Séance')+'</b><span>'+esc(plDaysTxt(t.dow))+'</span><small>'+esc((t.ex||[]).map(e=>trS(e.x)).join(', '))+'</small></li>').join('')+'</ul>'
      +'<div class="pl7pa">'+(p.act?'<button type="button" class="btn ghost sm" data-pla="stop:'+p.id+'">Arrêter</button>':'<button type="button" class="btn sm" data-pla="act:'+p.id+'">Commencer</button>')+'<button type="button" class="btn ghost sm" data-pla="edit:'+p.id+'">Modifier</button><button type="button" class="btn ghost sm" data-pla="dup:'+p.id+'">Dupliquer</button><button type="button" class="ib" data-pla="arch:'+p.id+'" aria-label="Archiver ce programme">'+ico('trash')+'</button></div></div>'};
  return '<div class="pl7top"><button type="button" class="ib" data-pla="back" aria-label="Retour au calendrier">'+ico('chev','flip')+'</button><h2 class="t">Programmes</h2><button type="button" class="btn sm" data-pla="new">'+ico('add')+' Nouveau</button></div>'
    +'<p class="note pl7intro">Un programme remplit ton calendrier : séances prévues avec exercices, séries, répétitions, charges et repos. Tu restes libre : tout se déplace, et ce que tu fais est comparé au prévu sans jamais le remplacer.</p>'
    +(L.length?L.map(card).join(''):'<div class="pl7empty"><b>Aucun programme</b><small>Crée ton premier programme, par exemple « Haut / Bas » sur 3 jours.</small></div>')
    +(A.length?'<details class="pl7arch"><summary>Programmes archivés ('+A.length+')</summary>'+A.map(p=>'<div class="pl7ar"><span class="notr">'+esc(p.n)+'</span><button type="button" class="btn ghost sm" data-pla="unarch:'+p.id+'">Restaurer</button><button type="button" class="ib" data-pla="del:'+p.id+'" aria-label="Supprimer définitivement">'+ico('trash')+'</button></div>').join('')+'</details>':'')}
/* ---- éditeur de programme (feuille) : copie de travail plEd, enregistrée seulement avec « Enregistrer » ---- */
let plEd=null;
const PLRS=[0,30,45,60,90,120,150,180,240];
function plNew(){return {id:plId(),n:'',ds:'',d0:TK,wk:0,act:false,arch:false,ts:[{id:plId(),n:'Séance A',dow:[1,4],pl:'',no:'',ex:[]}]}}
function plEdit(id){const p=id?plProg(id):null;plEd=p?JSON.parse(JSON.stringify(p)):plNew();plEd._new=!p;plEdDraw()}
function plEdDraw(){const p=plEd,used=new Set(p.ts.flatMap(t=>t.dow||[])),rest=[1,2,3,4,5,6,7].filter(n=>!used.has(n));
  const exRow=(t,e,j)=>'<div class="pl7er" data-t="'+t.id+'" data-j="'+j+'"><div class="pl7er1"><input class="pl7in" value="'+esc(e.x)+'" data-plf="x" list="pl7exl" aria-label="Exercice" maxlength="40"><button type="button" class="ib sm2" data-ple="up" aria-label="Monter">'+ico('up')+'</button><button type="button" class="ib sm2" data-ple="rm" aria-label="Retirer">'+ico('close')+'</button></div>'
    +'<div class="pl7er2"><label><small>Séries</small><input type="number" inputmode="numeric" min="0" max="20" value="'+(e.s||'')+'" data-plf="s" placeholder="3"></label>'
    +(isTimed(e.x)?'<label><small>Secondes</small><input type="number" inputmode="numeric" min="0" max="600" value="'+(e.sec||'')+'" data-plf="sec" placeholder="30"></label>':'<label><small>Rép.</small><input value="'+esc(e.r||'')+'" data-plf="r" placeholder="8-10" maxlength="7"></label>')
    +'<label><small>Kg</small><input type="number" inputmode="decimal" min="0" step="0.5" value="'+(e.kg||'')+'" data-plf="kg" placeholder="–"></label>'
    +'<label><small>Repos</small><select data-plf="rest">'+PLRS.map(v=>'<option value="'+v+'"'+((+e.rest||0)===v?' selected':'')+'>'+(v?mmssL(v):'–')+'</option>').join('')+'</select></label></div>'
    +'<input class="pl7in pl7eno" value="'+esc(e.no||'')+'" data-plf="no" placeholder="Consigne (facultatif)" maxlength="120"></div>';
  const tBlock=(t,ti)=>'<div class="pl7t" data-t="'+t.id+'"><div class="pl7th"><input class="pl7in pl7tn" value="'+esc(t.n)+'" data-plt="n" aria-label="Nom de la séance" maxlength="30"><button type="button" class="ib sm2" data-plt-rm="'+t.id+'" aria-label="Supprimer cette séance">'+ico('trash')+'</button></div>'
    +'<div class="pl7dw" role="group" aria-label="Jours">'+PLDN.map((d,n)=>'<button type="button" class="pl7d'+((t.dow||[]).includes(n+1)?' on':'')+'" data-pld="'+(n+1)+'" aria-pressed="'+(t.dow||[]).includes(n+1)+'">'+d+'</button>').join('')+'</div>'
    +'<div class="pl7pls">'+[['','Lieu libre']].concat(PL).map(x=>'<button type="button" class="chip sm'+((t.pl||'')===x[0]?' on':'')+'" data-plp="'+x[0]+'" aria-pressed="'+((t.pl||'')===x[0])+'">'+esc(x[1])+'</button>').join('')+'</div>'
    +'<div class="pl7ers">'+(t.ex||[]).map((e,j)=>exRow(t,e,j)).join('')+'</div>'
    +'<div class="pl7add"><input class="pl7in" data-pladd="'+t.id+'" list="pl7exl" placeholder="Ajouter un exercice…" maxlength="40"><button type="button" class="btn sm" data-pla="addx:'+t.id+'">Ajouter</button></div>'
    +'<input class="pl7in" value="'+esc(t.no||'')+'" data-plt="no" placeholder="Consignes de la séance (facultatif)" maxlength="160"></div>';
  openSheet('<h3>'+(p._new?'Nouveau programme':'Modifier le programme')+'</h3>'
    +'<label class="pl7f"><small>Nom</small><input class="pl7in" id="plN" value="'+esc(p.n)+'" placeholder="Ex. Force 3 jours" maxlength="40"></label>'
    +'<label class="pl7f"><small>Description (facultatif)</small><textarea id="plDs" rows="2" maxlength="300" placeholder="Objectif, niveau, remarques…">'+esc(p.ds||'')+'</textarea></label>'
    +'<div class="pl7f2"><label class="pl7f"><small>Début</small><input type="date" id="plD0" value="'+esc(p.d0||TK)+'"></label><label class="pl7f"><small>Durée</small><select id="plWk">'+[0,4,6,8,10,12,16].map(w=>'<option value="'+w+'"'+(+p.wk===w?' selected':'')+'>'+(w?w+' semaines':'Sans fin')+'</option>').join('')+'</select></label></div>'
    +'<h5 class="h5">Séances</h5><div class="pl7ts">'+p.ts.map(tBlock).join('')+'</div><button type="button" class="btn ghost sm" data-pla="addt">'+ico('plus')+' Ajouter une séance</button>'
    +'<p class="pl7rest">'+(rest.length?'<span>Jours de repos</span> · <b>'+esc(plDaysTxt(rest))+'</b>':'<span>Aucun jour de repos dans la semaine</span>')+'</p>'
    +'<datalist id="pl7exl">'+allEx().map(x=>'<option value="'+esc(x)+'">').join('')+'</datalist>'
    +(p._new?'<label class="pl7chk"><input type="checkbox" id="plGo"'+(plAct()?'':' checked')+'> <span>Commencer ce programme (remplit le calendrier)</span></label>':'')
    +'<p class="err" id="plErr"></p><div class="acts"><button type="button" class="btn ghost" data-pla="cancel">Annuler</button><button type="button" class="btn" data-pla="save">Enregistrer</button></div>')}
function plRead(){const p=plEd;if(!p||!$('plN'))return;p.n=$('plN').value.trim();p.ds=$('plDs').value.trim();p.d0=$('plD0').value||TK;p.wk=+$('plWk').value||0;
  document.querySelectorAll('#gbox .pl7t').forEach(b=>{const t=p.ts.find(x=>x.id===b.dataset.t);if(!t)return;b.querySelectorAll('[data-plt]').forEach(i=>{t[i.dataset.plt]=i.value.trim()});
    b.querySelectorAll('.pl7er').forEach(r=>{const e=t.ex[+r.dataset.j];if(!e)return;r.querySelectorAll('[data-plf]').forEach(i=>{const f=i.dataset.plf,v=i.value.trim();e[f]=f==='x'||f==='r'||f==='no'?v:(v===''?'':+String(v).replace(',','.'))})})})}
function plSave(){plRead();const p=plEd,err=$('plErr');p.ts=p.ts.filter(t=>t.n||t.ex.length||(t.dow||[]).length);p.ts.forEach(t=>{t.ex=t.ex.filter(e=>e.x)});
  if(!p.n){err.textContent='Donne un nom au programme.';return}if(!p.ts.some(t=>(t.dow||[]).length)){err.textContent='Choisis au moins un jour pour une séance.';return}
  const P=PLN(),i=P.progs.findIndex(x=>x.id===p.id),go=p._new&&$('plGo')&&$('plGo').checked;delete p._new;p.u=Date.now();if(i<0)P.progs.push(p);else P.progs[i]=p;
  if(go)plActivate(p.id);else if(p.act)plRegen(p);plEd=null;closeSheet();save();plRefresh();toast(go?'Programme commencé ✓':'Programme enregistré ✓')}
function plRefresh(){try{render()}catch(e){}if(typeof renderHome==='function'&&!$('vHome').hidden)renderHome()}
/* ---- reporter : propositions à valider ---- */
function plMoveSheet(id){const i=PLN().it.find(x=>x.id===id);if(!i)return;const pr=plProps(i),nm=i.sn&&i.sn.n||'Séance prévue';
  openSheet('<h3>Reporter la séance</h3><p class="findsub"><span class="notr">'+esc(nm)+'</span> · <span>'+esc('prévue le '+dLong(i.d0))+'</span></p>'
    +'<div class="pl7opts">'+pr.map(o=>'<button type="button" class="pl7opt" data-plmv="'+i.id+'~'+o.d+'"><b>'+(o.k==='next'?'Prochain jour libre':'La semaine suivante')+'</b><small>'+esc(fmtDay(parse(o.d)))+'</small></button>').join('')
    +'<label class="pl7opt pl7od"><b>Choisir un jour</b><input type="date" id="plMvD" min="'+TK+'" value="'+(pr[0]?pr[0].d:TK)+'"><button type="button" class="btn sm" data-pla="mvd:'+i.id+'">Déplacer</button></label>'
    +'<button type="button" class="pl7opt" data-pla="keep:'+i.id+'"><b>Garder le programme</b><small>Rien ne change</small></button>'
    +'<button type="button" class="pl7opt" data-pla="skip:'+i.id+'"><b>Marquer non faite</b><small>Elle reste visible dans l\'historique</small></button></div>'
    +'<p class="note">Les jours proposés n\'ont ni autre séance prévue, ni repos noté.</p>')}
function plMoveTo(id,d,quiet){const i=PLN().it.find(x=>x.id===id);if(!i||!d)return;const from=i.d,other=plOn(d).find(x=>x.id!==id&&!x.sid&&plSt(x)!=='skip');
  if(other){other.d=from;other.u=Date.now()} /* déposer sur un jour qui a déjà une séance prévue = les échanger */
  i.d=d;i.u=Date.now();save();closeSheet();plRefresh();if(!quiet)snack(other?'Séances échangées':'Séance reportée au '+dLong(d),'Annuler',()=>{i.d=from;if(other)other.d=d;save();plRefresh()})}
/* ---- noter une séance prévue : formulaire prérempli (exercices, lieu, séries prévues en gris) ---- */
function plLog(id){const i=PLN().it.find(x=>x.id===id);if(!i)return;closeSheet();sel=i.d<=TK?i.d:TK;openForm();const sn=i.sn||{ex:[]};form.plan=i.id;if(sn.pl)form.place=sn.pl;
  form.ex=(sn.ex||[]).map(e=>e.x);form.pl={};(sn.ex||[]).forEach(e=>{form.pl[e.x]=e;form.perf[e.x]={}});drawForm()}
/* ---- clics ---- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-pla],[data-plmv],[data-pld],[data-plp],[data-plt-rm],[data-ple]');if(!b)return;
  if(b.dataset.plmv){const [id,d]=b.dataset.plmv.split('~');plMoveTo(id,d);return}
  if(b.dataset.pld){plRead();const t=plEd.ts.find(x=>x.id===b.closest('.pl7t').dataset.t),n=+b.dataset.pld;t.dow=(t.dow||[]).includes(n)?t.dow.filter(x=>x!==n):(t.dow||[]).concat(n);plEdDraw();return}
  if(b.dataset.plp!==undefined){plRead();const t=plEd.ts.find(x=>x.id===b.closest('.pl7t').dataset.t);t.pl=b.dataset.plp;plEdDraw();return}
  if(b.dataset.pltRm){plRead();plEd.ts=plEd.ts.filter(t=>t.id!==b.dataset.pltRm);if(!plEd.ts.length)plEd.ts.push({id:plId(),n:'Séance A',dow:[],pl:'',no:'',ex:[]});plEdDraw();return}
  if(b.dataset.ple){plRead();const r=b.closest('.pl7er'),t=plEd.ts.find(x=>x.id===r.dataset.t),j=+r.dataset.j;if(b.dataset.ple==='rm')t.ex.splice(j,1);else if(j>0){const x=t.ex[j];t.ex[j]=t.ex[j-1];t.ex[j-1]=x}plEdDraw();return}
  const [a,id]=String(b.dataset.pla).split(':'),P=PLN();
  if(a==='page'){location.hash='#programmes';return}if(a==='back'){location.hash='#calendrier';return}
  if(a==='new'){plEdit();return}if(a==='edit'){plEdit(id);return}if(a==='cancel'){plEd=null;closeSheet();return}if(a==='save'){plSave();return}
  if(a==='addt'){plRead();const n=plEd.ts.length;plEd.ts.push({id:plId(),n:'Séance '+String.fromCharCode(65+n),dow:[],pl:'',no:'',ex:[]});plEdDraw();return}
  if(a==='addx'){plRead();const inp=document.querySelector('[data-pladd="'+id+'"]'),v=(inp&&inp.value||'').trim().replace(/\s+/g,' ').slice(0,40);if(!v){inp&&inp.focus();return}const t=plEd.ts.find(x=>x.id===id);t.ex.push({x:v,s:3,r:isTimed(v)?'':'10',sec:isTimed(v)?30:'',kg:'',rest:120,no:''});plEdDraw();return}
  if(a==='act'){plActivate(id);save();plRefresh();toast('Programme commencé ✓');return}
  if(a==='stop'){const p=plProg(id);plStop(id);save();plRefresh();snack('Programme arrêté','Annuler',()=>{plActivate(id);save();plRefresh()});return}
  if(a==='dup'){const p=plProg(id);if(!p)return;const c=JSON.parse(JSON.stringify(p));c.id=plId();c.n=(p.n+' (copie)').slice(0,40);c.act=false;c.ts.forEach(t=>t.id=plId());P.progs.push(c);save();plRefresh();toast('Programme dupliqué ✓');return}
  if(a==='arch'){const p=plProg(id);if(!p)return;if(p.act)plStop(id);p.arch=true;save();plRefresh();snack('Programme archivé','Annuler',()=>{p.arch=false;save();plRefresh()});return}
  if(a==='unarch'){const p=plProg(id);if(p){p.arch=false;save();plRefresh()}return}
  if(a==='del'){if(!b.dataset.sure){b.dataset.sure='1';b.classList.add('sure');b.setAttribute('aria-label','Confirmer la suppression');toast('Touche encore pour supprimer définitivement');return}
    const p=plProg(id);P.progs=P.progs.filter(x=>x.id!==id);const keep=P.it.filter(i=>i.pid===id);P.it=P.it.filter(i=>i.pid!==id||i.sid);save();plRefresh();snack('Programme supprimé','Annuler',()=>{P.progs.push(p);keep.forEach(i=>{if(!P.it.includes(i))P.it.push(i)});save();plRefresh()});return}
  if(a==='log'){plLog(id);return}if(a==='move'){plMoveSheet(id);return}if(a==='keep'){closeSheet();return}
  if(a==='mvd'){const d=$('plMvD').value;if(!d||d<TK){toast('Choisis aujourd\'hui ou un jour à venir');return}plMoveTo(id,d);return}
  if(a==='skip'){const i=P.it.find(x=>x.id===id);if(!i)return;closeSheet();i.st='skip';i.u=Date.now();save();plRefresh();snack('Séance marquée non faite','Annuler',()=>{i.st='plan';save();plRefresh()});return}
  if(a==='undo'){const i=P.it.find(x=>x.id===id);if(i){i.st='plan';i.u=Date.now();save();plRefresh()}return}});
document.addEventListener('keydown',e=>{const t=e.target;if(e.key==='Enter'&&t.dataset&&t.dataset.pladd){e.preventDefault();const b=document.querySelector('[data-pla="addx:'+t.dataset.pladd+'"]');if(b)b.click()}});
/* au démarrage et chaque jour : prolonger le planning (6 semaines devant) */
function plBoot(){if(plAct()&&plGen())save()}
/* ---- formulaire de séance : prérempli par la séance prévue, détail par série ---- */
function plFormOpen(es){const P=PLN();if(!P.it.length||!form)return;
  if(es){const it=P.it.find(i=>i.sid===es.id);if(it){form.plan=it.id;form.pl={};(it.sn&&it.sn.ex||[]).forEach(e=>{form.pl[e.x]=e})}return}
  const it=plOn(form.date).find(i=>!i.sid&&plSt(i)!=='skip');if(!it)return;const sn=it.sn||{ex:[]};form.plan=it.id;form.plPre=1;if(sn.pl)form.place=sn.pl;
  form.pl={};(sn.ex||[]).forEach(e=>{form.pl[e.x]=e;if(!form.ex.includes(e.x))form.ex.push(e.x);form.perf[e.x]=form.perf[e.x]||{}})}
function plFormClear(){if(!form||!form.plan)return;const it=PLN().it.find(i=>i.id===form.plan),xs=it&&it.sn?(it.sn.ex||[]).map(e=>e.x):[];
  form.ex=form.ex.filter(x=>!xs.includes(x)||Object.values(form.perf[x]||{}).some(v=>v&&(typeof v!=='object'||v.length)));form.plan='';form.pl={};form.plPre=0;drawForm()}
/* résumé d'un exercice depuis ses séries (le nombre de séries = séries remplies, les valeurs = les meilleures) */
function plSum(x){const p=form.perf[x];if(!p||!Array.isArray(p.sets))return;const L=p.sets.filter(z=>+z.r||+z.kg||+z.sec);p.s=L.length||'';p.r=L.length?Math.max(...L.map(z=>+z.r||0))||'':'';p.kg=L.length?Math.max(...L.map(z=>+z.kg||0))||'':'';p.sec=L.length?Math.max(...L.map(z=>+z.sec||0))||'':'';
  ['s','r','kg','sec'].forEach(k=>{const i=document.querySelector('#cPerf [data-pf="'+CSS.escape(x)+'"][data-pk="'+k+'"]');if(i&&document.activeElement!==i)i.value=p[k]||''})}
function plSetRows(x){const p=form.perf[x]=form.perf[x]||{},e=form.pl&&form.pl[x],tm=isTimed(x),lp=lastPerfOf(x)||{};p.sets=Array.isArray(p.sets)?p.sets:[];
  const n=Math.max(p.sets.length,+p.s||0,e&&+e.s||0,1);while(p.sets.length<n)p.sets.push({});const phr=e?(tm?e.sec:e.r):(tm?lp.sec:lp.r),phk=e?e.kg:lp.kg;
  return '<div class="pfd">'+p.sets.map((z,i)=>'<div class="pfs"><span>Série '+(i+1)+'</span><input type="number" inputmode="decimal" min="0" placeholder="'+esc(String(phr||'–'))+'" value="'+(z[tm?'sec':'r']||'')+'" data-ps="'+esc(x)+'" data-pi="'+i+'" data-pk="'+(tm?'sec':'r')+'" aria-label="'+esc(x+' · série '+(i+1)+(tm?' · secondes':' · répétitions'))+'"><input type="number" inputmode="decimal" min="0" step="0.5" placeholder="'+esc(phk?String(phk).replace('.',','):'kg')+'" value="'+(z.kg||'')+'" data-ps="'+esc(x)+'" data-pi="'+i+'" data-pk="kg" aria-label="'+esc(x+' · série '+(i+1)+' · kg')+'"></div>').join('')
    +'<div class="pfdb"><button type="button" class="btn ghost sm" data-psadd="'+esc(x)+'">+ Série</button>'+(e?'<button type="button" class="btn ghost sm" data-psplan="'+esc(x)+'">Comme prévu</button>':'')+(p.sets.length>1?'<button type="button" class="btn ghost sm" data-psrm="'+esc(x)+'">− Série</button>':'')+'</div></div>'}
function plPerfExtra(x){if(!form)return '';const e=form.pl&&form.pl[x],op=form.det&&form.det[x];return (e?'<p class="pfpl">'+esc('Prévu : '+(plRx(e)||'—'))+'</p>':'')+'<button type="button" class="pftg" data-pfd="'+esc(x)+'" aria-expanded="'+!!op+'">'+(op?'Masquer le détail':'Détail par série')+'</button>'+(op?plSetRows(x):'')}
function plPerfHead(){if(!form||!form.plan||!form.plPre)return '';const it=PLN().it.find(i=>i.id===form.plan);return it?'<p class="pfplh"><span>'+esc('Séance prévue : '+(it.sn&&it.sn.n||''))+'</span><button type="button" class="btn ghost sm" data-plclr="1">Ne pas l\'utiliser</button></p>':''}
document.addEventListener('click',e=>{const b=e.target.closest('[data-pfd],[data-psadd],[data-psplan],[data-psrm],[data-plclr]');if(!b||!form)return;
  if(b.dataset.plclr){plFormClear();return}
  const x=b.dataset.pfd||b.dataset.psadd||b.dataset.psplan||b.dataset.psrm,p=form.perf[x]=form.perf[x]||{};form.det=form.det||{};
  if(b.dataset.pfd!==undefined){form.det[x]=!form.det[x];if(form.det[x]&&!Array.isArray(p.sets)){const n=+p.s||0;p.sets=n?Array.from({length:n},()=>({r:p.r||'',kg:p.kg||'',sec:p.sec||''})):[]}}
  else if(b.dataset.psadd!==undefined){p.sets=Array.isArray(p.sets)?p.sets:[];const l=p.sets[p.sets.length-1]||{};p.sets.push({kg:l.kg||''})}
  else if(b.dataset.psrm!==undefined){if(Array.isArray(p.sets)&&p.sets.length>1)p.sets.pop()}
  else if(b.dataset.psplan!==undefined){const ep=form.pl&&form.pl[x];if(!ep)return;const n=+ep.s||1,r=parseInt(String(ep.r||'').split('-').pop())||'';p.sets=Array.from({length:n},()=>({r:isTimed(x)?'':r,sec:isTimed(x)?(+ep.sec||''):'',kg:+ep.kg||''}))}
  drawPerf();plSum(x)});
document.addEventListener('input',e=>{const t=e.target;if(!form||!t.dataset||t.dataset.ps===undefined)return;const x=t.dataset.ps,p=form.perf[x]=form.perf[x]||{};p.sets=Array.isArray(p.sets)?p.sets:[];const i=+t.dataset.pi;p.sets[i]=p.sets[i]||{};p.sets[i][t.dataset.pk]=t.value;plSum(x)});
/* ---- glisser une séance prévue vers un autre jour (vue mois, appui long) ; déposer sur une autre séance prévue = échanger ---- */
let plDg=null,plDgT=0;
document.addEventListener('pointerdown',e=>{const day=e.target.closest('#grid.grid .day.plh');if(!day||day.classList.contains('has')||e.button>0)return;const k=day.dataset.k,x0=e.clientX,y0=e.clientY;clearTimeout(plDgT);
  const it=plOn(k).find(i=>!i.sid&&plSt(i)!=='skip');if(!it)return;
  const cancel=()=>{clearTimeout(plDgT);document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',cancel)},mv=ev=>{if(!plDg&&Math.hypot(ev.clientX-x0,ev.clientY-y0)>9)cancel()};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerup',cancel);
  plDgT=setTimeout(()=>{cancel();window.__cdrag=1;lpFired=Date.now();const g=document.createElement('div');g.className='cdg pl7g';g.innerHTML='<b class="notr">'+esc(it.sn&&it.sn.n||'')+'</b>';document.body.appendChild(g);day.classList.add('lift');plDg={k,id:it.id,g,day,tgt:null};plDgMove(x0,y0)},430)});
function plDgMove(x,y){if(!plDg)return;plDg.g.style.transform='translate('+(x-40)+'px,'+(y-50)+'px) rotate(-3deg)';const el=document.elementFromPoint(x,y),d=el&&el.closest('#grid .day');document.querySelectorAll('#grid .day.drop').forEach(z=>z.classList.remove('drop'));plDg.tgt=null;
  if(d&&d.dataset.k!==plDg.k&&d.dataset.k>=TK&&!isRest(d.dataset.k)){d.classList.add('drop');plDg.tgt=d.dataset.k}}
document.addEventListener('pointermove',e=>{if(plDg)plDgMove(e.clientX,e.clientY)});
document.addEventListener('touchmove',e=>{if(plDg){e.preventDefault();const t=e.touches[0];plDgMove(t.clientX,t.clientY)}},{passive:false});
function plDgEnd(){if(!plDg)return;const c=plDg;plDg=null;c.g.remove();c.day.classList.remove('lift');document.querySelectorAll('#grid .day.drop').forEach(z=>z.classList.remove('drop'));setTimeout(()=>{window.__cdrag=0},60);if(c.tgt){sel=c.tgt;plMoveTo(c.id,c.tgt)}}
document.addEventListener('pointerup',plDgEnd);document.addEventListener('touchend',plDgEnd);document.addEventListener('pointercancel',plDgEnd);
/* ---- accueil : la séance prévue aujourd'hui (le bouton « Noter une séance » ouvre le formulaire prérempli) ---- */
function plHomeLine(){const it=plOn(TK).find(i=>!i.sid&&plSt(i)!=='skip');if(it)return '<p class="pl7home"><span class="pl7dot"></span><span>'+esc('Prévue aujourd\'hui : '+(it.sn&&it.sn.n||''))+'</span></p>';
  const nx=plAct()?PLN().it.filter(i=>i.d>TK&&!i.sid&&plSt(i)!=='skip').sort((a,b)=>a.d<b.d?-1:1)[0]:null;return nx?'<p class="pl7home off"><span class="pl7dot"></span><span>'+esc('Prochaine séance prévue : '+dLong(nx.d)+' · '+(nx.sn&&nx.sn.n||''))+'</span></p>':''}
