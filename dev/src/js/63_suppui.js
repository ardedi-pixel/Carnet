/* ===================== v7.5 : compléments : écrans (aujourd'hui, mes compléments, cycles) et accueil =====================
   Nutrition > Compléments (#complements). Textes saisis (noms, marques, notes) dans .notr : jamais traduits.
   Chaque morceau de phrase dans son propre élément (traductions). */
Object.assign(ICO,{pill:'<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.6 8.6l4.8 6.8"/>',
  bell:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',box:'<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
  cycle:'<path d="M19 12a7 7 0 0 1-12.2 4.7M5 12a7 7 0 0 1 12.2-4.7"/><path d="M17.5 3.5v4h-4M6.5 20.5v-4h4"/>',warn:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.2v.3"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
  moon:'<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',noon:'<circle cx="12" cy="12" r="5"/><path d="M12 2.5v2.5M12 19v2.5"/>'});
const SPMI={m:'sun',d:'noon',s:'moon',c:'moon',a:'clock'};
const spCol=x=>SPC[(x&&x.c)||0]||SPC[0];
const spS=(t,c)=>'<span'+(c?' class="'+c+'"':'')+'>'+esc(t)+'</span>';
/* « a · b · c » : chaque morceau dans son élément */
const spJ=a=>a.filter(Boolean).join('<span class="sp7sep"> · </span>');
/* « reprise le 6 déc. » : libellé et valeur, séparés par une espace */
const spP=a=>a.filter(Boolean).join(' ');
const spNm=x=>'<b class="notr">'+esc(x.n)+'</b>';
function spRefresh(){if(curV==='nut'&&S.ntab==='supp')renderSupp();if(curV==='home')renderHome();if(curV==='cal'&&S.calMode==='c')render()}
/* ---- page ---- */
function renderSupp(){const v=$('vSupp');if(!v)return;const s=SP(),T5=[['today','Aujourd\'hui'],['list','Mes compléments'],['cyc','Cycles'],['cal','Calendrier'],['hist','Historique']];
  if(!T5.some(t=>t[0]===s.tab))s.tab='today';
  let h='<div class="wide sp7nav"><div class="mz8m" role="group" aria-label="Compléments">'+T5.map(t=>'<button type="button" data-spt="'+t[0]+'" aria-pressed="'+(s.tab===t[0])+'">'+t[1]+'</button>').join('')+'</div>'
   +'<button type="button" class="ib" data-sp="set" aria-label="Rappels et horaires">'+ico('bell')+'</button></div>';
  if(!s.list.length&&s.tab!=='hist')h+=spEmpty();
  else h+=s.tab==='list'?spLib():s.tab==='cyc'?spCycV():s.tab==='cal'?'<section class="panel wide sp7cal">'+spCalHtml()+'</section>':s.tab==='hist'?spHistV():spTodayV();
  h+='<p class="wide sp7disc">'+ico('info')+'<span>Outil d\'organisation et de suivi : il ne remplace pas l\'avis d\'un professionnel de santé. Suis la notice de chaque produit.</span></p>';
  v.innerHTML=h;const a=v.querySelector('.sp7nav [aria-pressed="true"]');if(a&&a.scrollIntoView)try{a.scrollIntoView({block:'nearest',inline:'nearest'})}catch(e){}}
function spEmpty(){return '<section class="panel wide sp7emp"><span class="sp7empi">'+ico('pill')+'</span><h2 class="t">Tes compléments, au même endroit</h2>'
  +'<p>Ajoute un complément : l\'appli calcule ses cycles, prépare ta routine du jour, te le rappelle et garde l\'historique.</p>'
  +'<button type="button" class="btn big" data-sp="add">'+ico('add')+'<span>Ajouter un complément</span></button></section>'}
/* ---- ligne d'une prise (routine du jour, jour du calendrier) ---- */
function spStLab(k,it,e,now){const s=e&&e.s;if(s==='ok')return spJ([spS('Prise'),spS(spHM(e.t))]);if(s==='late')return spJ([spS('Prise en retard'),spS(spHM(e.t))]);
  if(s==='miss')return spS('Oubliée');if(s==='skip')return spS('Ignorée');if(s==='snz')return spJ([spS('Reportée'),spS(spHM(+e.u))]);
  if(k<spToday()||(k===spToday()&&spAt(k,it.t)<=now))return spS('Pas encore validée','sp7wait');return ''}
const spHM=ms=>{const d=new Date(+ms);return pad(d.getHours())+':'+pad(d.getMinutes())};
function spRow(k,it,o){o=o||{};const e=spLog(k,it.key),now=Date.now(),s=e?e.s:(k<spToday()||(k===spToday()&&spAt(k,it.t)<=now)?'due':'todo'),tk=spTaken(e),x=it.x;
  const meta=[it.q!==null&&it.q!==undefined?spS(spU(it.q,x.u)):spS('Dose à préciser','sp7miss'),x.r==='jeun'||x.r==='repas'?spS(SPR[x.r].toLowerCase()):x.r==='autre'&&x.rn?'<span class="notr">'+esc(x.rn)+'</span>':'',
    o.time||(x.tk[it.i]&&x.tk[it.i].t&&it.m!=='a')?spS(it.t):'',spIsRes(x,k)?spS('reprise','sp7res'):''];
  const ck=o.ro?'':'<button type="button" class="sp7ck" data-spk="'+k+'~'+esc(it.key)+'" aria-pressed="'+tk+'" aria-label="'+esc(trS(tk?'Annuler':'Marquer comme pris')+' : '+x.n)+'">'+ico('check')+'</button>';
  return '<div class="sp7r s-'+s+(o.ro?' ro':'')+'">'+ck+'<button type="button" class="sp7rb" data-spm="'+k+'~'+esc(it.key)+'"><i class="sp7dot" style="--c:'+spCol(x)+'"></i><span class="sp7rn">'+spNm(x)+'<small>'+spJ(meta)+'</small></span><span class="sp7rs">'+spStLab(k,it,e,now)+'</span></button></div>'}
/* groupe d'un moment (Matin · 08:00), avec « Tout pris » */
function spGroupHtml(k,g,o){o=o||{};const left=g.L.filter(it=>!spDone(spLog(k,it.key)));
  return '<section class="panel wide sp7g"><div class="sp7gh"><span class="sp7gi">'+ico(SPMI[g.m]||'clock')+'</span><b>'+esc(SPM[g.m][0])+'</b><span class="sp7gt">'+esc(g.t)+'</span>'
   +(!o.ro&&left.length>1?'<button type="button" class="sp7all" data-spall="'+k+'~'+esc(left.map(it=>it.key).join(','))+'">Tout pris</button>':'')+'</div>'+g.L.map(it=>spRow(k,it,o)).join('')+'</section>'}
/* ---- Aujourd'hui ---- */
function spTodayV(){const s=SP(),k=spToday(),now=Date.now(),R=spDay(k),G=spGroups(R),tk=R.filter(it=>spTaken(spLog(k,it.key))).length,left=R.filter(it=>!spDone(spLog(k,it.key)));
  const late=left.filter(it=>spAt(k,it.t)<=now),nx=left.find(it=>spAt(k,it.t)>now),C=2*Math.PI*21,pc=R.length?tk/R.length:0;
  let sub='';if(!R.length)sub=spS('Aucune prise prévue aujourd\'hui');else if(!left.length)sub=spS('Tout est fait pour aujourd\'hui');
  else if(late.length)sub=spJ([spS(late.length===1?'1 prise en retard':late.length+' prises en retard','sp7lt'),nx?spJ([spS('Prochaine'),spS(SPM[nx.m][0]),spS(nx.t)]):''])
  else if(nx)sub=spJ([spS('Prochaine'),spS(SPM[nx.m][0]),spS(nx.t)]);
  let h='<section class="panel wide sp7hero"><div class="sp7hd"><div><p class="kick">'+esc(spDL(k))+'</p><h2 class="t">'+(R.length?spS(tk+' sur '+R.length+' prises'):spS('Aujourd\'hui'))+'</h2><p class="sp7sub">'+sub+'</p></div>'
   +'<span class="sp7ring"><svg viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="21" class="t"/><circle cx="25" cy="25" r="21" class="p" stroke-dasharray="'+(C*pc).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 25 25)"/></svg><b>'+(R.length?Math.round(pc*100)+'%':'—')+'</b></span></div>'
   +'<div class="sp7ha"><button type="button" class="btn sm" data-sp="add">'+ico('add')+'<span>Ajouter</span></button><button type="button" class="btn sm ghost" data-spt="cal">'+ico('cal')+'<span>Calendrier</span></button></div></section>';
  h+=spAlerts(k);G.forEach(g=>{h+=spGroupHtml(k,g)});
  const dem=s.list.filter(x=>spPh(x,k).k==='dem');
  if(dem.length)h+='<section class="panel wide sp7g"><div class="sp7gh"><span class="sp7gi">'+ico('add')+'</span><b>À la demande</b></div>'+dem.map(x=>{const L=Object.keys(s.log[k]||{}).filter(kk=>kk.startsWith(x.id+'|x')).map(kk=>s.log[k][kk]).filter(spTaken);
    return '<div class="sp7r"><button type="button" class="sp7rb" data-spe="'+x.id+'"><i class="sp7dot" style="--c:'+spCol(x)+'"></i><span class="sp7rn">'+spNm(x)+'<small>'+spJ([x.q!==null?spS(spU(x.q,x.u)):'',L.length?spS(L.length===1?'Pris 1 fois aujourd\'hui':'Pris '+L.length+' fois aujourd\'hui'):spS('Pas encore pris aujourd\'hui')])+'</small></span></button><button type="button" class="ib sp7plus" data-spdem="'+x.id+'" aria-label="'+esc(trS('Noter une prise')+' : '+x.n)+'">'+ico('add')+'</button></div>'}).join('')+'</section>';
  const off=s.list.filter(x=>{const p=spPh(x,k);return ['off','sus','none','pre'].includes(p.k)});
  if(off.length)h+='<section class="panel wide sp7off"><h3 class="sp7h3">Pas aujourd\'hui</h3>'+off.map(x=>'<button type="button" class="sp7or" data-spe="'+x.id+'"><i class="sp7dot" style="--c:'+spCol(x)+'"></i>'+spNm(x)+'<small>'+spWhy(x,k)+'</small></button>').join('')+'</section>';
  const N=[];s.list.forEach(x=>spNext(x,spAdd(k,1),30).forEach(e=>N.push(Object.assign({x},e))));N.sort((a,b)=>a.d<b.d?-1:1);
  if(N.length)h+='<section class="panel wide sp7nx"><h3 class="sp7h3">Prochains changements</h3>'+N.slice(0,5).map(e=>'<button type="button" class="sp7nr" data-spe="'+e.x.id+'"><span class="sp7nd">'+esc(spDl(e.d))+'</span><span class="sp7nt"><i class="sp7dot" style="--c:'+spCol(e.x)+'"></i>'+spNm(e.x)+'<small>'+spEvL(e)+'</small></span></button>').join('')+'</section>';
  return h}
/* pourquoi un complément n'est pas à prendre ce jour-là */
function spWhy(x,k){const p=spPh(x,k);
  if(p.k==='off')return spJ([spS('OFF'),spS('jour '+p.day+' sur '+p.len),spP([spS('reprise le'),spS(spDl(p.next))])]);
  if(p.k==='sus'){const r=p.s.b?spAdd(p.s.b,1):'';return spJ([spS('En pause'),r?spP([spS('reprise le'),spS(spDl(r))]):spS('sans date de reprise')])}
  if(p.k==='pre')return spP([spS('Commence le'),spS(spDl(x.d0))]);
  if(p.k==='none'){const n=spNextDay(x,k);return n?spP([spS('Prochaine prise'),spS(spDl(n))]):spS('Pas de prise prévue')}
  if(p.k==='end')return spS('Terminé');return ''}
function spNextDay(x,k){for(let n=1;n<370;n++){const d=spAdd(k,n);if(spDue(x,d))return d}return ''}
/* libellé d'un changement à venir */
function spEvL(e){if(e.k==='off')return spJ([spS('Passe en OFF'),e.len?spS(spWk(e.len)):'']);if(e.k==='res')return spJ([spS('Reprise (période ON)'),e.len?spS(spWk(e.len)):'']);
  if(e.k==='start')return spS('Début du programme');if(e.k==='back')return spS('Fin de la pause');if(e.k==='sus')return spS('Pause');if(e.k==='end')return spS('Fin du programme');
  if(e.k==='dose')return spJ([spS('Nouvelle dose'),spS(spU(e.q,e.x.u))]);return ''}
/* alertes du jour : reprise, stock, horaires à organiser, fiches à compléter, rappels, agenda */
function spAlerts(k){const s=SP(),A=[];
  s.list.filter(x=>spIsRes(x,k)).forEach(x=>{const p=spPh(x,k);A.push('<div class="sp7a a-res"><span class="sp7ai">'+ico('cycle')+'</span><div><b>'+spJ([spS('Reprise aujourd\'hui'),'<span class="notr">'+esc(x.n)+'</span>'])+'</b><small>'+spP([spS('Période ON'),spS(spWk(p.len)),spP([spS('jusqu\'au'),spS(spDl(p.end))])])+'</small></div></div>')});
  s.list.forEach(x=>{const st=spStock(x);if(st&&st.low&&spStat(x,k)==='actif')A.push('<div class="sp7a a-stk"><span class="sp7ai">'+ico('box')+'</span><div><b>'+spJ([spS('Stock faible'),'<span class="notr">'+esc(x.n)+'</span>'])+'</b><small>'+spJ([spS(st.days===0?'Plus assez pour aujourd\'hui':st.days===1?'Environ 1 jour restant':'Environ '+st.days+' jours restants'),spS(fmtN(st.left)+' '+st.su)])+'</small></div><button type="button" class="btn sm ghost" data-sprf="'+x.id+'">Racheté</button></div>')});
  spConf(k).forEach(c=>{if(c.k==='jr')A.push('<div class="sp7a a-conf"><span class="sp7ai">'+ico('warn')+'</span><div><b>'+spJ([spS('À jeun et avec un repas à la même heure'),spS(c.t)])+'</b><small>'+spJ(['<span class="notr">'+esc(c.a.x.n)+'</span>','<span class="notr">'+esc(c.b.x.n)+'</span>'])+'</small><small>'+spS('Vérifie les instructions et décale une prise si besoin.')+'</small></div><button type="button" class="btn sm ghost" data-spe="'+c.b.x.id+'">Horaires</button></div>');
    else A.push('<div class="sp7a a-conf"><span class="sp7ai">'+ico('warn')+'</span><div><b>'+spJ(['<span class="notr">'+esc(c.a.x.n)+'</span>','<span class="notr">'+esc(c.b.x.n)+'</span>'])+'</b><small>'+spS('À espacer d\'au moins '+c.h+' h, d\'après tes instructions.')+'</small></div>'+(c.to?'<button type="button" class="btn sm ghost" data-spmv="'+esc(c.mv.key)+'~'+c.to+'">'+spP([spS('Décaler à'),spS(c.to)])+'</button>':'<button type="button" class="btn sm ghost" data-spe="'+c.mv.x.id+'">Horaires</button>')+'</div>')});
  s.list.filter(x=>x.mode==='def').forEach(x=>A.push('<div class="sp7a a-def"><span class="sp7ai">'+ico('info')+'</span><div><b class="notr">'+esc(x.n)+'</b><small>'+spS('Cycle non renseigné : aucune alternance ON/OFF n\'a été configurée pour ce complément.')+'</small><div class="sp7ab"><button type="button" class="btn sm ghost" data-spdef="'+x.id+'~cont">Prise continue</button><button type="button" class="btn sm ghost" data-spdef="'+x.id+'~cyc">Cycle ON/OFF</button><button type="button" class="btn sm ghost" data-spdef="'+x.id+'~ponc">Ponctuelle</button></div></div></div>'));
  if(s.list.some(x=>x.mode!=='def')){const ag=spIcsState();
    if(spNotifOk()&&!(s.ntf&&Notification.permission==='granted'))A.push('<button type="button" class="sp7a a-tip" data-sp="set"><span class="sp7ai">'+ico('bell')+'</span><div><b>Rappels désactivés</b><small>Active les notifications ou ajoute les rappels à l\'agenda du téléphone.</small></div></button>');
    else if(ag==='old'||ag==='soon')A.push('<button type="button" class="sp7a a-tip" data-sp="agenda"><span class="sp7ai">'+ico('cal')+'</span><div><b>'+(ag==='old'?'Agenda du téléphone à mettre à jour':'Rappels de l\'agenda bientôt finis')+'</b><small>'+(ag==='old'?'Ton programme a changé depuis le dernier ajout.':'Ajoute-les à nouveau pour les 6 prochains mois.')+'</small></div></button>')}
  return A.length?'<section class="panel wide sp7al">'+A.join('')+'</section>':''}
/* ---- Mes compléments ---- */
function spCardSub(x,k){const p=spPh(x,k),P=[];
  if(x.mode==='cyc'&&x.cy.length)P.push(spS(spCycL(spSeg(x,k>=spF0(x)?k:spF0(x)))));else P.push(spS(SPMODE[x.mode]));
  if(p.k==='on'&&x.mode==='cyc')P.push(spS(p.len%7===0?'ON · sem. '+Math.ceil(p.day/7)+'/'+p.len/7:'ON · jour '+p.day+'/'+p.len));
  else if(p.k==='off')P.push(spJ([spS('OFF'),spP([spS('reprise le'),spS(spDl(p.next))])]));
  else if(p.k==='pre')P.push(spP([spS('Commence le'),spS(spDl(x.d0))]));
  if(x.mode==='ponc'&&x.pw.length)P.push(spS(spDays(x.pw)));return spJ(P)}
const spDays=pw=>pw.slice().sort().map(n=>parse(spAdd('2026-11-30',n-1)).toLocaleDateString(LOC(),{weekday:'short'}).replace('.','')).join(', ');
function spMoms(x){return x.tk.map(t=>spS(t.m==='a'?t.t:SPM[t.m][0])).join('<span>, </span>')}
function spCard(x,k){const st=spStat(x,k),stk=spStock(x);
  return '<button type="button" class="sp7card" data-spe="'+x.id+'"><i class="sp7dot lg" style="--c:'+spCol(x)+'"></i><span class="sp7cn">'+spNm(x)+(x.b?'<small class="notr">'+esc(x.b)+'</small>':'')
   +'<small>'+spJ([x.q!==null?spS(spU(x.q,x.u)):spS('Dose à préciser','sp7miss'),spMoms(x)])+'</small><small>'+spCardSub(x,k)+'</small>'+(stk?'<small class="'+(stk.low?'sp7lt':'')+'">'+spJ([spP([spS('Stock'),spS(fmtN(stk.left)+' '+stk.su)]),stk.out?spP([spS('jusqu\'au'),spS(spDl(spAdd(stk.out,-1)))]):''])+'</small>':'')
   +'</span><i class="sp7b b-'+st+'">'+esc(SPST[st])+'</i></button>'}
function spLib(){const s=SP(),k=spToday(),A=s.list.filter(x=>spStat(x,k)!=='fini'),F=s.list.filter(x=>spStat(x,k)==='fini');
  return '<section class="panel wide sp7lib"><div class="sp7lh"><h2 class="t">Mes compléments</h2><button type="button" class="btn sm" data-sp="add">'+ico('add')+'<span>Ajouter</span></button></div>'
   +(A.length?A.map(x=>spCard(x,k)).join(''):'<p class="nfs">Aucun complément en cours.</p>')
   +(F.length?'<details class="sp7fin"><summary>'+spJ([spS('Terminés'),spS(String(F.length))])+'</summary>'+F.map(x=>spCard(x,k)).join('')+'</details>':'')+'</section>'}
/* ---- Cycles : frise et progression ---- */
function spRuns(x,a,n){const R=[];let cur=null;for(let i=0;i<n;i++){const k=spAdd(a,i),p=spPh(x,k),t=p.k==='on'?'on':p.k==='off'?'off':p.k==='sus'?'sus':'';
  if(!cur||cur.t!==t){cur={t,i,n:1,res:p.k==='on'&&spIsRes(x,k)};R.push(cur)}else cur.n++}return R.filter(r=>r.t)}
function spCycV(){const s=SP(),k=spToday(),W=s.tw||90,a=spAdd(k,-Math.round(W*.2)),pc=i=>(i/W*100).toFixed(3);
  const L=s.list.filter(x=>x.mode!=='def'&&!(x.d1&&x.d1<a)&&!(x.d0>spAdd(a,W-1)));
  let ax='';for(let i=0;i<W;i++){const d=spAdd(a,i);if(d.slice(8)==='01'||i===0)ax+='<span style="left:'+pc(i)+'%">'+esc(mName(+d.slice(0,4),+d.slice(5,7)-1))+'</span>'}
  const td='<i class="sp7tday" style="left:'+pc(spDn(k)-spDn(a)+.5)+'%"></i>';
  let h='<section class="panel wide sp7tl"><div class="sp7lh"><h2 class="t">Frise des cycles</h2><div class="seg sm" role="group" aria-label="Période">'+[[30,'1 mois'],[90,'3 mois'],[180,'6 mois']].map(w=>'<button type="button" data-sptw="'+w[0]+'" aria-pressed="'+(W===w[0])+'">'+w[1]+'</button>').join('')+'</div></div>';
  h+=L.length?'<div class="sp7tw"><div class="sp7ax">'+ax+'</div>'+L.map(x=>'<button type="button" class="sp7tr" data-spe="'+x.id+'"><span class="sp7tn notr">'+esc(x.n)+'</span><span class="sp7tb" style="--c:'+spCol(x)+'">'+spRuns(x,a,W).map(r=>'<i class="r-'+r.t+(r.res?' res':'')+'" style="left:'+pc(r.i)+'%;width:'+pc(r.n)+'%"></i>').join('')+td+'</span></button>').join('')+'</div>'
    +'<div class="sp7lg"><span><i class="r-on"></i>ON</span><span><i class="r-off"></i>OFF</span><span><i class="r-sus"></i>Pause</span><span><i class="r-td"></i>Aujourd\'hui</span></div>':'<p class="nfs">Ajoute un complément pour voir sa frise.</p>';
  h+='</section>';const P=s.list.filter(x=>spStat(x,k)!=='fini');if(P.length)h+='<section class="panel wide sp7pg"><h2 class="t">Progression</h2>'+P.map(x=>spProg7(x,k)).join('')+'</section>';
  const done=s.list.reduce((n,x)=>n+spDoneCycles(x).length,0);if(done)h+='<button type="button" class="wide sp7link" data-spt="hist">'+spJ([spS(done===1?'1 cycle terminé':done+' cycles terminés'),spS('voir l\'historique')])+'</button>';
  return h}
/* carte de progression : semaine 5 sur 8, jours restants, fin de phase, OFF suivante, reprise */
function spProg7(x,k){const p=spPh(x,k),c=spCol(x),hd='<div class="sp7ph"><i class="sp7dot" style="--c:'+c+'"></i>'+spNm(x);let b='',m=[];
  const bar=(f,cls)=>'<div class="sp7bar '+(cls||'')+'" style="--c:'+c+'"><i style="width:'+Math.max(2,Math.min(100,f*100)).toFixed(1)+'%"></i></div>';
  if(p.k==='on'&&x.mode==='cyc'){b='<i class="sp7b b-on">ON</i>';const wk=p.len%7===0;
    m=['<p class="sp7pv">'+spS(wk?'Semaine '+Math.ceil(p.day/7)+' sur '+p.len/7:'Jour '+p.day+' sur '+p.len)+'</p>',bar(p.day/p.len),
      '<p class="sp7pm">'+spJ([spS(p.len-p.day===0?'Dernier jour ON':p.len-p.day===1?'1 jour restant':(p.len-p.day)+' jours restants'),spP([spS('fin le'),spS(spDl(p.end))])])+'</p>',
      p.nlen?'<p class="sp7pm">'+spJ([spP([spS('Puis OFF'),spS(spWk(p.nlen))]),spP([spS('reprise le'),spS(spDl(spAdd(p.next,p.nlen)))])])+'</p>':'']}
  else if(p.k==='off'){b='<i class="sp7b b-off">OFF</i>';const r=p.len-p.day+1;
    m=['<p class="sp7pv">'+spS('Jour '+p.day+' sur '+p.len)+'</p>',bar(p.day/p.len,'off'),'<p class="sp7pm">'+spJ([spS(r===1?'Reprise demain':'Reprise dans '+r+' jours'),spP([spS('le'),spS(spDl(p.next))])])+'</p>','<p class="sp7pm">'+spP([spS('Puis ON'),spS(spWk(p.nlen))])+'</p>']}
  else if(p.k==='sus'){b='<i class="sp7b b-pause">En pause</i>';m=['<p class="sp7pm">'+spJ([spP([spS('Depuis le'),spS(spDl(p.s.a))]),p.s.b?spP([spS('reprise prévue le'),spS(spDl(spAdd(p.s.b,1)))]):spS('sans date de reprise')])+'</p>',x.mode==='cyc'?'<p class="sp7pm">'+spS('Le cycle continue pendant la pause, sauf si tu choisis de le décaler à la reprise.')+'</p>':'']}
  else if(p.k==='pre'){const n=spDn(x.d0)-spDn(k);b='<i class="sp7b b-actif">Prévu</i>';m=['<p class="sp7pm">'+spJ([spP([spS('Commence le'),spS(spDl(x.d0))]),spS(n===1?'demain':'dans '+n+' jours')])+'</p>']}
  else if(x.mode==='def'){b='<i class="sp7b b-def">À définir</i>';m=['<p class="sp7pm">'+spS('Cycle non renseigné : aucune alternance ON/OFF n\'a été configurée pour ce complément.')+'</p>']}
  else if(x.mode==='ponc'){b='<i class="sp7b b-actif">Ponctuelle</i>';m=['<p class="sp7pm">'+(x.pw.length||x.pd.length?spJ([x.pw.length?spS(spDays(x.pw)):'',x.pd.length?spS(x.pd.filter(d=>d>=k).length+' dates prévues'):'']):spS('À la demande'))+'</p>']}
  else{b='<i class="sp7b b-actif">Continue</i>';m=['<p class="sp7pm">'+spJ([spP([spS('Depuis le'),spS(spDl(x.d0))]),x.d1?spP([spS('jusqu\'au'),spS(spDl(x.d1))]):spS('sans date de fin')])+'</p>'];
    if(x.d1){const t=spDn(x.d1)-spDn(x.d0)+1,d=spDn(k)-spDn(x.d0)+1;m.push(bar(d/t))}}
  return '<button type="button" class="sp7pc" data-spe="'+x.id+'">'+hd+b+'</div>'+m.join('')+'</button>'}
/* ---- accueil : la prochaine routine, cochable ---- */
function spHome(){if(!S.supp)return '';const s=SP();if(!s.list.length||!S.cards.some(c=>c.k==='supp'&&c.on))return '';const k=spToday(),R=spDay(k),now=Date.now();
  const tk=R.filter(it=>spTaken(spLog(k,it.key))).length,G=spGroups(R),g=G.find(z=>z.L.some(it=>!spDone(spLog(k,it.key))));
  let b='';if(!R.length){const N=[];s.list.forEach(x=>spNext(x,spAdd(k,1),30).forEach(e=>N.push(Object.assign({x},e))));N.sort((a,b2)=>a.d<b2.d?-1:1);
    b='<p class="h72spm">'+spS('Rien à prendre aujourd\'hui')+'</p>'+(N[0]?'<p class="h72sps">'+spJ([spS(spDl(N[0].d)),'<span class="notr">'+esc(N[0].x.n)+'</span>',spEvL(N[0])])+'</p>':'')}
  else if(!g)b='<p class="h72spm">'+ico('check','okic')+spS('Tout est pris pour aujourd\'hui')+'</p>';
  else b='<div class="h72spg"><span class="sp7gi">'+ico(SPMI[g.m]||'clock')+'</span><b>'+esc(SPM[g.m][0])+'</b><span class="sp7gt">'+esc(g.t)+'</span>'+(g.L.filter(it=>spAt(k,it.t)<=now&&!spDone(spLog(k,it.key))).length?'<span class="sp7lt">'+spS('à prendre')+'</span>':'')+'</div>'+g.L.slice(0,4).map(it=>spRow(k,it,{})).join('')+(g.L.length>4?'<p class="h72sps">'+spS('+'+(g.L.length-4)+' autres')+'</p>':'');
  return '<section class="h72sp"><div class="h72wh"><b>Compléments</b><span class="h72spc">'+(R.length?spS(tk+'/'+R.length):'')+'</span><a href="#complements" data-spgo="1">Tout voir</a></div>'+b+'</section>'}
