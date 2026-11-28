/* ===================== v7.5 : compléments : calendrier, historique, fiches, réglages, actions =====================
   Calendrier « Compléments alimentaires » (jour, semaine, mois), distinct du calendrier des séances : dans Nutrition > Compléments
   et dans l'onglet Calendrier (3e choix « Compléments », masquable dans Rappels et horaires). Pas d'identifiant (id) dans ce HTML :
   il peut être affiché à deux endroits. */
function spCalOn(){return !!S.supp&&SP().list.length>0&&SP().cal!==false}
function spCalHtml(){const s=SP(),k=spToday();if(!spIsD(s.cd))s.cd=k;const cv=['d','w','m'].includes(s.cv)?s.cv:'m',d=s.cd,F=s.list.filter(x=>x.mode!=='def'&&(!s.cf||x.id===s.cf));
  const pd=parse(d),cap=t=>t.charAt(0).toUpperCase()+t.slice(1),title=cv==='m'?cap(pd.toLocaleDateString(LOC(),{month:'long',year:'numeric'})):cv==='w'?spP([spS('Semaine du'),spS(spDl(spMon(d)))]):esc(cap(spDL(d)));
  let h='<div class="sp7ch"><div class="seg sm" role="group" aria-label="Affichage">'+[['d','Jour'],['w','Semaine'],['m','Mois']].map(v=>'<button type="button" data-spcv="'+v[0]+'" aria-pressed="'+(cv===v[0])+'">'+v[1]+'</button>').join('')+'</div>'
   +'<div class="sp7cnv"><button type="button" class="ib" data-spcn="-1" aria-label="Précédent">'+ico('left')+'</button><h3>'+(cv==='m'?esc(title):title)+'</h3><button type="button" class="ib" data-spcn="0" aria-label="Aujourd\'hui">'+ico('target')+'</button><button type="button" class="ib" data-spcn="1" aria-label="Suivant">'+ico('right')+'</button></div></div>';
  if(s.list.length>1)h+='<div class="mz8m sp7cf" role="group" aria-label="Filtrer">'+'<button type="button" data-spcf="" aria-pressed="'+!s.cf+'">Tous</button>'+s.list.filter(x=>x.mode!=='def').map(x=>'<button type="button" data-spcf="'+x.id+'" aria-pressed="'+(s.cf===x.id)+'"><i class="sp7dot" style="--c:'+spCol(x)+'"></i><span class="notr">'+esc(x.n)+'</span></button>').join('')+'</div>';
  h+=cv==='m'?spMonth(d,F):cv==='w'?spWeek(d,F):spDayV(d,F);
  if(cv==='m')h+='<div class="sp7lg"><span><i class="r-on"></i>ON</span><span><i class="r-off"></i>OFF</span><span><i class="r-sus"></i>Pause</span><span><i class="r-res"></i>Reprise</span><span><i class="r-ok"></i>Tout pris</span></div>';
  h+='<button type="button" class="sp7ag" data-sp="agenda">'+ico('cal')+'<span><b>Agenda du téléphone</b><small>'+esc(({none:'Ajoute les rappels à un calendrier séparé « Compléments alimentaires »',old:'À mettre à jour : ton programme a changé',soon:'Rappels bientôt finis : ajoute-les à nouveau',ok:''})[spIcsState()]||'')+(spIcsState()==='ok'?spP([spS('Rappels ajoutés jusqu\'au'),spS(spDl(s.ics.to||k))]):'')+'</small></span>'+ico('right')+'</button>';
  return h}
const spMon=k=>spAdd(k,-(spDow(k)-1));
/* transitions d'un jour (début, OFF, reprise, pause, fin, dose) */
function spDayEv(x,k){return spNext(x,k,0)}
function spMonth(d,F0){const F=SP().cf?F0:F0.filter(x=>x.mode==='cyc'||x.mode==='ponc'||x.sus.length||x.dz.length),k=spToday(),m0=d.slice(0,8)+'01',st=spMon(m0),mm=d.slice(5,7);let h='<div class="sp7mg"><div class="sp7dw">'+DOWI().split('').map(c=>'<span>'+c+'</span>').join('')+'</div><div class="sp7mgr">';
  for(let i=0;i<42;i++){const day=spAdd(st,i);if(i%7===0&&i>=28&&day>m0&&day.slice(5,7)!==mm)break;const P=spDay(day).filter(it=>F0.includes(it.x)),T=P.filter(it=>spTaken(spLog(day,it.key))).length;
    const lines=F.slice(0,4).map(x=>{const p=spPh(x,day),t=p.k==='on'?'on':p.k==='off'?'off':p.k==='sus'?'sus':'no',E=spDayEv(x,day);
      return '<i class="l-'+t+(E.some(e=>e.k==='res'||e.k==='start'||e.k==='back')?' res':'')+(E.some(e=>e.k==='dose')?' dz':'')+'" style="--c:'+spCol(x)+'"></i>'}).join('');
    const mk=day<=k&&P.length?'<i class="sp7mk '+(T===P.length?'k-full':T?'k-part':day<k?'k-none':'k-todo')+'"></i>':'';
    h+='<button type="button" class="sp7mc'+(day.slice(5,7)!==mm?' out':'')+(day===k?' td':'')+(day===d?' sel':'')+'" data-spd="'+day+'" aria-label="'+esc(spDL(day))+'"><b>'+(+day.slice(8))+'</b>'+mk+'<span class="sp7ml">'+lines+(F.length>4?'<em>+'+(F.length-4)+'</em>':'')+'</span></button>'}
  return h+'</div></div>'}
function spWeek(d,F){const k=spToday(),m=spMon(d);let h='<div class="sp7wk">';
  for(let i=0;i<7;i++){const day=spAdd(m,i),P=spDay(day).filter(it=>F.includes(it.x)),T=P.filter(it=>spTaken(spLog(day,it.key))).length,E=[];
    F.forEach(x=>spDayEv(x,day).forEach(e=>E.push(Object.assign({x},e))));const byT={};P.forEach(it=>{(byT[it.t]=byT[it.t]||[]).push(it)});
    h+='<div class="sp7wd'+(day===k?' td':'')+'"><button type="button" class="sp7wdh" data-spd="'+day+'"><b>'+esc(parse(day).toLocaleDateString(LOC(),{weekday:'short',day:'numeric'}))+'</b>'+(P.length&&day<=k?'<small>'+esc(T+'/'+P.length)+'</small>':'')+'</button><div class="sp7wl">'
     +E.map(e=>'<span class="sp7we"><i class="sp7dot" style="--c:'+spCol(e.x)+'"></i><span class="notr">'+esc(e.x.n)+'</span><span class="sp7sep"> · </span>'+spEvL(e)+'</span>').join('')
     +Object.keys(byT).sort((a,b)=>spSortT(a)-spSortT(b)).map(t=>'<span class="sp7wc"><b>'+esc(t)+'</b>'+byT[t].map(it=>{const e=spLog(day,it.key);return '<span class="sp7wi w-'+(e?e.s:day<k?'due':'todo')+'"><i class="sp7dot" style="--c:'+spCol(it.x)+'"></i><span class="notr">'+esc(it.x.n)+'</span></span>'}).join('')+'</span>').join('')
     +(!P.length&&!E.length?'<span class="sp7wn">—</span>':'')+'</div></div>'}
  return h+'</div>'}
function spDayV(d,F){const s=SP(),k=spToday(),R=spDayAll(d).filter(it=>F.includes(it.x)||(it.extra&&!s.cf)),fut=d>k,E=[];
  F.forEach(x=>spDayEv(x,d).forEach(e=>E.push(Object.assign({x},e))));let h='';
  if(E.length)h+='<div class="sp7de">'+E.map(e=>'<span class="sp7we"><i class="sp7dot" style="--c:'+spCol(e.x)+'"></i><span class="notr">'+esc(e.x.n)+'</span><span class="sp7sep"> · </span>'+spEvL(e)+'</span>').join('')+'</div>';
  const G=spGroups(R.filter(it=>!it.dem));h+=G.length?G.map(g=>spGroupHtml(d,g,{ro:fut})).join(''):'<p class="nfs">'+(fut?'Aucune prise prévue ce jour-là.':'Aucune prise prévue ou notée ce jour-là.')+'</p>';
  const dem=R.filter(it=>it.dem&&spTaken(spLog(d,it.key)));if(dem.length)h+='<div class="sp7g sp7dd"><div class="sp7gh"><b>À la demande</b></div>'+dem.map(it=>'<div class="sp7r s-ok ro"><button type="button" class="sp7rb" data-spm="'+d+'~'+esc(it.key)+'"><i class="sp7dot" style="--c:'+spCol(it.x)+'"></i><span class="sp7rn">'+spNm(it.x)+'<small>'+spJ([it.q!==null&&it.q!==undefined?spS(spU(it.q,it.x.u)):''])+'</small></span><span class="sp7rs">'+spJ([spS('Prise'),spS(spHM(spLog(d,it.key).t))])+'</span></button></div>').join('')+'</div>';
  const off=F.filter(x=>['off','sus','none'].includes(spPh(x,d).k));if(off.length)h+='<div class="sp7off sp7dd"><h3 class="sp7h3">Pas ce jour-là</h3>'+off.map(x=>'<button type="button" class="sp7or" data-spe="'+x.id+'"><i class="sp7dot" style="--c:'+spCol(x)+'"></i>'+spNm(x)+'<small>'+spWhy(x,d)+'</small></button>').join('')+'</div>';
  return h}
/* ---- historique et statistiques ---- */
function spHistV(){const s=SP(),k=spToday(),f=s.hf&&spById(s.hf)?s.hf:'',S7=spStats(spAdd(k,-6),k,f),S30=spStats(spAdd(k,-29),k,f),tot=spCount(f),sn=spSnzCount(spAdd(k,-29),k);
  const tile=(lab,v,sub)=>'<div class="sp7tile"><span>'+esc(lab)+'</span><b>'+v+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</div>';
  let h='<section class="panel wide sp7st"><h2 class="t">Suivi</h2><div class="sp7tiles">'+tile('7 jours',S7.pct===null?'—':S7.pct+' %',S7.plan?esc(S7.taken+'/'+S7.plan):'')+tile('30 jours',S30.pct===null?'—':S30.pct+' %',S30.plan?esc(S30.taken+'/'+S30.plan):'')+tile('Prises effectuées',String(tot),spS('au total'))+'</div>'
   +'<div class="sp7tiles sm">'+tile('Non prises',String(S30.miss+S30.unv),spS('30 jours'))+tile('Reportées',String(sn),spS('30 jours'))+tile('Ignorées',String(S30.skip),spS('30 jours'))+'</div>';
  const L=s.list.filter(x=>x.mode!=='def'&&(!f||x.id===f));
  if(L.length)h+='<h3 class="sp7h3">Régularité sur 30 jours</h3>'+L.map(x=>{const t=spStats(spAdd(k,-29),k,x.id);return '<div class="sp7reg"><span class="sp7rgn"><i class="sp7dot" style="--c:'+spCol(x)+'"></i><span class="notr">'+esc(x.n)+'</span></span><span class="sp7bar" style="--c:'+spCol(x)+'"><i style="width:'+(t.pct||0)+'%"></i></span><b>'+(t.pct===null?'—':t.pct+' %')+'</b></div>'}).join('');
  h+='<p class="sp7note">'+spS('Une prise non validée n\'est jamais comptée comme prise.')+'</p></section>';
  if(s.list.length+Object.keys(s.log).length===0)return h;
  const n=Math.max(14,+s.hn||14),hd=spIsD(s.hd)&&s.hd<=k?s.hd:k;let days='';
  for(let i=0;i<n;i++){const day=spAdd(hd,-i);if(day<spAdd(k,-3650))break;const R=spDayAll(day).filter(it=>!f||it.x.id===f),P=R.filter(it=>!it.dem&&!(it.extra&&!spLog(day,it.key))),T=R.filter(it=>spTaken(spLog(day,it.key))).length,sus=s.list.filter(x=>(!f||x.id===f)&&spPh(x,day).k==='sus');
    if(!R.length&&!sus.length)continue;
    days+='<div class="sp7hd2"><div class="sp7hdh"><b>'+esc(spDL(day))+'</b>'+(P.length?'<small>'+esc(P.filter(it=>spTaken(spLog(day,it.key))).length+'/'+P.length)+'</small>':'')+(P.length&&!T&&day<k?'<i class="sp7b b-none">Jour sans prise</i>':'')+'</div>'
     +R.map(it=>{const e=spLog(day,it.key),st=e?e.s:day<k||(day===k&&spAt(day,it.t)<=Date.now())?'due':'todo';return '<button type="button" class="sp7hr h-'+st+'" data-spm="'+day+'~'+esc(it.key)+'"><span class="sp7ht">'+esc(it.t)+'</span><i class="sp7dot" style="--c:'+spCol(it.x)+'"></i><span class="sp7hn"><span class="notr">'+esc(it.x.n)+'</span>'+(it.q!==null&&it.q!==undefined?'<small>'+esc(spU(it.q,it.x.u))+'</small>':'')+'</span><span class="sp7hs">'+(it.dem?spJ([spS('À la demande'),spS(spHM(e.t))]):spStLab(day,it,e,Date.now())||spS('Prévue'))+'</span></button>'}).join('')
     +sus.map(x=>'<p class="sp7hsus">'+spJ([spS('En pause'),'<span class="notr">'+esc(x.n)+'</span>'])+'</p>').join('')+'</div>'}
  h+='<section class="panel wide sp7hl"><div class="sp7lh"><h2 class="t">Historique</h2><label class="sp7go">'+ico('cal')+'<input type="date" data-sphd="1" value="'+hd+'" max="'+k+'" aria-label="Aller à une date"></label></div>'
   +(s.list.length>1?'<div class="mz8m sp7cf" role="group" aria-label="Filtrer"><button type="button" data-sphf="" aria-pressed="'+!f+'">Tous</button>'+s.list.map(x=>'<button type="button" data-sphf="'+x.id+'" aria-pressed="'+(f===x.id)+'"><i class="sp7dot" style="--c:'+spCol(x)+'"></i><span class="notr">'+esc(x.n)+'</span></button>').join('')+'</div>':'')
   +(days||'<p class="nfs">Rien de noté sur cette période.</p>')+'<button type="button" class="btn ghost sm sp7more" data-sphm="1">Voir les jours précédents</button></section>';
  const C=s.list.filter(x=>!f||x.id===f).map(x=>({x,L:spDoneCycles(x)})).filter(c=>c.L.length);
  if(C.length)h+='<section class="panel wide sp7cy"><h2 class="t">Cycles terminés</h2>'+C.map(c=>'<div class="sp7cyr"><p><i class="sp7dot" style="--c:'+spCol(c.x)+'"></i>'+spNm(c.x)+'<small>'+spS(c.L.length===1?'1 cycle':c.L.length+' cycles')+'</small></p>'+c.L.slice().reverse().map(z=>'<span>'+spJ([spS(spDl(z.a)+' → '+spDl(z.b)),spS(spWk(spDn(z.b)-spDn(z.a)+1))])+'</span>').join('')+'</div>').join('')+'</section>';
  const EV=s.ev.filter(e=>!f||e.id===f).slice(-80).reverse();
  if(EV.length)h+='<section class="panel wide sp7evs"><details><summary>'+spJ([spS('Modifications des programmes'),spS(String(EV.length))])+'</summary>'+EV.map(e=>'<p><span class="sp7evd">'+esc(spDl(key(new Date(e.t))))+'</span><span class="'+(e.id?'notr ':'')+'sp7evn">'+esc(e.n)+'</span>'+spEvTxt(e.x)+'</p>').join('')+'</details></section>';
  return h}
/* texte d'une modification (codes simples, traduits à l'affichage) */
function spEvTxt(x){const p=String(x).split('|'),k=p[0],L={add:'Ajouté',edit:'Fiche modifiée',cyc:'Cycle modifié',mode:'Mode de prise changé',start:'Date de départ du cycle changée',pause:'Mis en pause',res:'Repris',resx:'Repris (cycle décalé)',end:'Terminé',react:'Réactivé',del:'Supprimé',dose:'Changement de dose programmé',stock:'Stock rechargé',time:'Horaire changé',shift:'Routine décalée'};
  return '<span class="sp7evx">'+spS(L[k]||k)+(p[1]?'<span class="sp7sep"> · </span>'+p.slice(1).join(' ').split(' → ').map(z=>spS(z)).join('<span> → </span>'):'')+'</span>'}
/* ---- fiche d'un complément (ajout rapide, tout le reste facultatif) ---- */
let spF=null,spF0b=null;
function spEdit(id,pre){const x=id?spById(id):null;const td=spToday();
  spF=x?JSON.parse(JSON.stringify(x)):{n:'',b:'',q:null,u:'mg',tk:[{m:'m',t:''}],r:'indif',rn:'',mode:'cont',d0:td,d1:'',cy:[],pw:[],pd:[],sus:[],dz:[],no:'',pr:'',c:spNextC(),far:[],farH:0,stock:{on:false,q:0,su:'gélules',pi:1,at:td,low:7,add:[]},hist:[]};
  spF._new=!x;spF0b=x?JSON.parse(JSON.stringify(x)):null;const g=x&&x.cy.length?spSeg(x,td>=spF0(x)?td:spF0(x)):null;
  spF._on=g?g.on:56;spF._off=g?g.off:28;spF._ou=spF._on%7===0?7:1;spF._fu=spF._off%7===0&&spF._off?7:1;spF._a=x&&x.mode==='cyc'?spCycA(x,td):(x?td:'');
  if(pre&&pre.mode){spF.mode=pre.mode;if(pre.mode==='cyc'&&!spF._a)spF._a=td}
  openSheet(spFormHtml());spFormSync();if(!x)setTimeout(()=>{const i=$('spN');if(i)i.focus()},250)}
function spNextC(){const u=SP().list.map(x=>x.c);for(let i=0;i<SPC.length;i++)if(!u.includes(i))return i;return SP().list.length%SPC.length}
const spChip=(attr,v,lab,on,extra)=>'<button type="button" class="sp7chip" '+attr+'="'+esc(v)+'" aria-pressed="'+!!on+'"'+(extra||'')+'>'+lab+'</button>';
function spFormHtml(){const f=spF,td=spToday(),ex=!f._new,others=SP().list.filter(x=>x.id!==f.id);
  let h='<div class="nsh sp7f"><h2 class="t">'+(ex?'Modifier le complément':'Nouveau complément')+'</h2>'
   +'<label class="nfl">Nom<input id="spN" maxlength="60" value="'+esc(f.n)+'" placeholder="Ex. magnésium bisglycinate" autocomplete="off"></label>'
   +'<label class="nfl">Marque et produit<input id="spB" maxlength="80" value="'+esc(f.b)+'" placeholder="Facultatif" autocomplete="off"></label>'
   +'<div class="nrow2"><label class="nfl">Dose par prise<input id="spQ" type="number" inputmode="decimal" step="any" min="0" value="'+(f.q===null?'':f.q)+'" placeholder="À préciser"></label><label class="nfl">Unité<select id="spU">'+SPU.map(u=>'<option value="'+u+'"'+(f.u===u?' selected':'')+'>'+esc(SPUP[u]||u)+'</option>').join('')+'</select></label></div>'
   +'<p class="sp7fl">Moments de prise</p><div class="sp7chips" id="spTk">'+SPM_O.map(m=>spChip('data-spfm',m,esc(SPM[m][0]),f.tk.some(t=>t.m===m))).join('')+'</div><div id="spTkT"></div><p class="sp7day" id="spDayQ"></p>'
   +'<p class="sp7fl">Avec les repas</p><div class="sp7chips">'+Object.keys(SPR).map(r=>spChip('data-spfr',r,esc(SPR[r]),f.r===r)).join('')+'</div><input id="spRn" class="sp7in" maxlength="80" value="'+esc(f.rn)+'" placeholder="Précise (ex. 30 min avant le repas)"'+(f.r==='autre'?'':' hidden')+'>'
   +'<p class="sp7fl">Mode de prise</p><div class="sp7chips">'+Object.keys(SPMODE).map(m=>spChip('data-spfmo',m,esc(SPMODE[m]),f.mode===m)).join('')+'</div><div id="spModeP" class="sp7mp"></div>'
   +'<div class="nrow2"><label class="nfl">Début<input id="spD0" type="date" value="'+f.d0+'"></label><label class="nfl">Fin (facultatif)<input id="spD1" type="date" value="'+(f.d1||'')+'"></label></div>';
  if(ex){const st=spStat(spById(f.id),td),x=spById(f.id),su=spSusOn(x,td)||x.sus.find(z=>z.a>td);
    h+='<p class="sp7fl">Statut</p><div class="sp7stb"><i class="sp7b b-'+st+'">'+esc(SPST[st])+'</i>'+(su?'<small>'+spJ([spP([spS(su.a>td?'Pause prévue le':'En pause depuis le'),spS(spDl(su.a))]),su.b?spP([spS('reprise le'),spS(spDl(spAdd(su.b,1)))]):''])+'</small>':'')+'</div><div class="sp7ab">'
     +(st==='fini'?'<button type="button" class="btn sm ghost" data-spf="react">Réactiver</button>':su?'<button type="button" class="btn sm ghost" data-spf="resume">Reprendre</button>':'<button type="button" class="btn sm ghost" data-spf="pause">Mettre en pause</button>')
     +(st!=='fini'?'<button type="button" class="btn sm ghost" data-spf="end">Terminer</button>':'')+'</div>'}
  h+='<details class="sp7more2"'+(ex&&(f.no||f.pr||f.dz.length||f.stock.on||f.far.length)?' open':'')+'><summary>Plus d\'options</summary>'
   +'<label class="nfl">Notes et instructions<textarea id="spNo" rows="2" maxlength="600" placeholder="Ex. avec un grand verre d\'eau, d\'après la notice">'+esc(f.no)+'</textarea></label>'
   +'<label class="nfl">Précautions<textarea id="spPr" rows="2" maxlength="600" placeholder="Contre-indications, interactions : d\'après la notice ou ton professionnel de santé">'+esc(f.pr)+'</textarea></label>'
   +'<p class="sp7fl">Changements de dose programmés</p><div id="spDzL"></div><div class="sp7add3"><input id="spDzD" type="date" min="'+td+'" aria-label="Date du changement"><input id="spDzQ" type="number" inputmode="decimal" step="any" min="0" placeholder="Nouvelle dose" aria-label="Nouvelle dose"><button type="button" class="btn sm ghost" data-spf="dzadd">Ajouter</button></div>'
   +(others.length?'<p class="sp7fl">À espacer de</p><div class="sp7chips">'+others.map(o=>spChip('data-spffar',o.id,'<i class="sp7dot" style="--c:'+spCol(o)+'"></i><span class="notr">'+esc(o.n)+'</span>',f.far.includes(o.id))).join('')+'</div><label class="sp7inl">D\'au moins<input id="spFarH" type="number" inputmode="numeric" min="0" max="12" step="1" value="'+(f.farH||'')+'" placeholder="2"><span>h, d\'après tes instructions</span></label>':'')
   +'<button type="button" class="tglrow" data-spf="stock" aria-pressed="'+f.stock.on+'"><span><b>Suivre le stock</b>Estime quand le flacon sera vide</span><i></i></button><div id="spStkP"'+(f.stock.on?'':' hidden')+'>'
   +'<div class="nrow2"><label class="nfl">Quantité restante<input id="spSq" type="number" inputmode="decimal" step="any" min="0" value="'+(ex&&f.stock.on?(spStock(spById(f.id))||{left:f.stock.q}).left:f.stock.q||'')+'" placeholder="Ex. 120"></label><label class="nfl">Unité<select id="spSu">'+SPSU.map(u=>'<option'+(f.stock.su===u?' selected':'')+'>'+u+'</option>').join('')+'</select></label></div>'
   +'<div class="nrow2"><label class="nfl">Par prise<input id="spSp" type="number" inputmode="decimal" step="any" min="0" value="'+(f.stock.pi||1)+'"></label><label class="nfl">Alerte à moins de (jours)<input id="spSl" type="number" inputmode="numeric" min="1" max="90" value="'+(f.stock.low||7)+'"></label></div></div>'
   +'<p class="sp7fl">Couleur</p><div class="sp7cols">'+SPC.map((c,i)=>'<button type="button" class="sp7col" data-spfc="'+i+'" aria-pressed="'+(f.c===i)+'" style="--c:'+c+'" aria-label="Couleur '+(i+1)+'"></button>').join('')+'</div></details>'
   +'<div id="spWarnL"></div><button type="button" class="btn nbig" data-spf="save">Enregistrer</button>'+(ex?'<button type="button" class="nlink sp7del" data-spf="del">Supprimer ce complément</button>':'')+'</div>';
  return h}
/* lit les champs dans le brouillon */
function spFormRead(){const f=spF;if(!f||!$('spN'))return;f.n=$('spN').value.trim();f.b=$('spB').value.trim();const q=String($('spQ').value).replace(',','.').trim();f.q=q===''||isNaN(+q)?null:+q;f.u=$('spU').value;
  f.rn=$('spRn').value.trim();f.d0=$('spD0').value||spToday();f.d1=$('spD1').value||'';f.no=$('spNo').value;f.pr=$('spPr').value;const fh=$('spFarH');f.farH=fh?Math.max(0,Math.min(12,+fh.value||0)):0;
  document.querySelectorAll('#spTkT input[data-sptk]').forEach(i=>{const t=f.tk[+i.dataset.sptk];if(!t)return;const v=spIsT(i.value)?i.value:'';t.t=t.m==='a'?(v||'10:00'):(v&&v!==SP().mt[t.m]?v:'')});
  const on=$('spOn'),off=$('spOff');if(on){f._on=Math.max(1,Math.round((+on.value||0)*(+$('spOnU').value||1)));f._off=Math.max(0,Math.round((+off.value||0)*(+$('spOffU').value||1)));f._ou=+$('spOnU').value;f._fu=+$('spOffU').value;const a=$('spA');if(a&&a.value)f._a=a.value}
  if($('spSq')){f.stock.q=Math.max(0,+String($('spSq').value).replace(',','.')||0);f.stock.su=$('spSu').value;f.stock.pi=Math.max(0,+String($('spSp').value).replace(',','.')||1);f.stock.low=Math.max(1,Math.round(+$('spSl').value||7))}}
/* parties qui changent pendant la saisie */
function spFormSync(){const f=spF;if(!f||!$('spTkT'))return;const td=spToday(),mt=SP().mt;
  $('spTkT').innerHTML=f.tk.map((t,i)=>'<label class="sp7tkr"><span>'+esc(SPM[t.m][0])+'</span><input type="time" data-sptk="'+i+'" value="'+(t.t||mt[t.m]||'10:00')+'" aria-label="'+esc(trS('Heure')+' : '+trS(SPM[t.m][0]))+'"></label>').join('');
  $('spDayQ').innerHTML=f.q!==null&&f.tk.length?spJ([spS('Par jour'),spS(f.tk.length>1?f.tk.length+' × '+spU(f.q,f.u)+' = '+spU(Math.round(f.q*f.tk.length*1000)/1000,f.u):spU(f.q,f.u))]):'';
  const M=$('spModeP'),ex=!f._new;let h='';
  if(f.mode==='cont')h='<p class="sp7mh">'+spS('Tous les jours, sans période d\'arrêt.')+'</p>';
  else if(f.mode==='cyc'){const ou=f._ou||7,fu=f._fu||7,a=f._a||(f._new?f.d0:td);
    h='<p class="sp7mh">'+spS('Alternance de jours de prise (ON) et d\'arrêt (OFF), recalculée toute seule.')+'</p><div class="sp7cyf"><label class="nfl"><b class="sp7pl">ON</b><span class="sp7dur"><input id="spOn" type="number" inputmode="numeric" min="1" step="1" value="'+Math.round(f._on/ou)+'"><select id="spOnU"><option value="7"'+(ou===7?' selected':'')+'>semaines</option><option value="1"'+(ou===1?' selected':'')+'>jours</option></select></span></label>'
      +'<label class="nfl"><b class="sp7pl">OFF</b><span class="sp7dur"><input id="spOff" type="number" inputmode="numeric" min="1" step="1" value="'+Math.round(f._off/fu)+'"><select id="spOffU"><option value="7"'+(fu===7?' selected':'')+'>semaines</option><option value="1"'+(fu===1?' selected':'')+'>jours</option></select></span></label></div>'
      +'<div class="sp7chips sm">'+[[14,14],[21,7],[56,28],[5,2]].map(p=>spChip('data-spfq',p[0]+'/'+p[1],esc(spWk(p[0])+' / '+spWk(p[1])),f._on===p[0]&&f._off===p[1])).join('')+'</div>'
      +'<label class="nfl">Début du cycle (1er jour ON)<input id="spA" type="date" value="'+a+'"></label><div class="sp7cyp" id="spCyP"></div>'
      +(ex&&spF0b&&spF0b.mode==='cyc'&&spF0b.d0<td?'<p class="sp7mh">'+spS('Une nouvelle durée s\'applique à partir d\'aujourd\'hui : les jours passés et l\'historique ne changent pas. Changer le début du cycle recalcule tout le cycle.')+'</p>':'')}
  else if(f.mode==='ponc')h='<p class="sp7mh">'+spS('Seulement certains jours, ou à la demande.')+'</p><div class="sp7chips">'+[1,2,3,4,5,6,7].map(n=>spChip('data-spfw',n,esc(spDays([n])),f.pw.includes(n))).join('')+'</div>'
      +'<div class="sp7chips sm">'+f.pd.map(d=>'<button type="button" class="sp7chip on" data-spfpd="'+d+'" aria-label="'+esc(trS('Retirer')+' '+spDl(d))+'">'+esc(spDl(d))+' ✕</button>').join('')+'</div><div class="sp7add3"><input id="spPdD" type="date" aria-label="Date précise"><button type="button" class="btn sm ghost" data-spf="pdadd">Ajouter une date</button></div>'
      +'<p class="sp7mh">'+spS(f.pw.length||f.pd.length?'Rappels seulement ces jours-là.':'Aucun jour choisi : prise à la demande, tu notes chaque prise.')+'</p>';
  else h='<div class="sp7a a-def"><span class="sp7ai">'+ico('info')+'</span><div><b>'+spS('Cycle non renseigné')+'</b><small>'+spS('Aucune alternance ON/OFF n\'a été configurée pour ce complément.')+'</small><small>'+spS('Tu pourras choisir plus tard : prise continue, cycle personnalisé (durée de prise et d\'arrêt) ou ponctuelle. En attendant : aucun rappel, et il n\'est jamais mis en OFF.')+'</small></div></div>';
  M.innerHTML=h;spCyPrev();
  const dz=$('spDzL');if(dz)dz.innerHTML=f.dz.map((z,i)=>'<div class="sp7dzr"><span>'+spJ([spS(spDl(z.d)),spS(spU(z.q,f.u))])+'</span><button type="button" class="ib sm" data-spfdz="'+i+'" aria-label="Retirer">'+ico('close')+'</button></div>').join('');
  const w=spWarn(Object.assign({},f,{q:f.q,mode:f.mode,pr:f.pr||''}));$('spWarnL').innerHTML=w.length?'<div class="sp7wl2"><p class="sp7fl">Points à vérifier</p>'+w.map(t=>'<p>'+ico('warn')+spS(t)+'</p>').join('')+'</div>':''}
/* aperçu des dates du cycle */
function spCyPrev(){const f=spF,b=$('spCyP');if(!b||f.mode!=='cyc')return;const a=(($('spA')||{}).value)||f._a||f.d0,on=f._on,off=f._off;if(!spIsD(a)||!(on>=1)){b.innerHTML='';return}
  const td=spToday();let st=a;while(spDn(st)+on+off<=spDn(td))st=spAdd(st,on+off);const R=[];for(let i=0;i<2;i++){const e=spAdd(st,on-1);R.push('<p>'+spJ([spS('ON'),spS(spDl(st)+' → '+spDl(e))])+'</p>');if(off){R.push('<p>'+spJ([spS('OFF'),spS(spDl(spAdd(e,1))+' → '+spDl(spAdd(e,off)))])+'</p>');R.push('<p class="sp7res">'+spJ([spS('Reprise'),spS(spDl(spAdd(e,off+1)))])+'</p>')}st=spAdd(st,on+off);if(!off)break}
  b.innerHTML=R.join('')}
/* enregistre la fiche */
function spSave(){spFormRead();const f=spF,s=SP(),td=spToday();if(!f.n){toast('Donne un nom au complément');const i=$('spN');if(i)i.focus();return}
  if(!f.tk.length){toast('Choisis au moins un moment de prise');return}if(f.d1&&f.d1<f.d0){toast('La date de fin est avant le début');return}
  if(f.mode==='cyc'){if(!(f._on>=1)){toast('Durée ON : au moins 1 jour');return}if(!(f._off>=1)){toast('Durée OFF : au moins 1 jour (sinon choisis Prise continue)');return}}
  const keep=['n','b','q','u','tk','r','rn','d1','no','pr','c','far','farH','dz'];
  if(f._new){const x={id:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),cr:Date.now()};keep.forEach(k=>x[k]=JSON.parse(JSON.stringify(f[k])));x.d0=f.d0;x.mode=f.mode;x.pw=f.pw;x.pd=f.pd;x.sus=[];x.hist=[];
    if(f.mode==='cyc'){const a=spIsD(f._a)?f._a:f.d0;if(a<x.d0)x.d0=a;x.cy=[{f:x.d0,a,on:f._on,off:f._off}]}else x.cy=[];
    x.stock=Object.assign({},f.stock,{at:td,add:[]});spFix(x);s.list.push(x);spEv(x,'add|'+SPMODE[x.mode]);save();closeSheet();toast('Complément ajouté');s.tab=s.tab==='hist'?'today':s.tab;spRefresh();spTickStart();return}
  const x=spById(f.id);if(!x){closeSheet();return}const o=spF0b,ch=[];keep.forEach(k=>{if(JSON.stringify(x[k])!==JSON.stringify(f[k]))ch.push(k);x[k]=JSON.parse(JSON.stringify(f[k]))});
  if(f.d0!==x.d0){x.d0=f.d0;ch.push('d0');if(x.mode==='cyc'&&x.cy.length&&!x.hist.length&&x.cy[0].f!==x.d0)x.cy[0].f=x.d0}
  const pchg=f.mode!==x.mode||(f.mode==='ponc'&&(JSON.stringify(f.pw)!==JSON.stringify(x.pw)||JSON.stringify(f.pd)!==JSON.stringify(x.pd)));
  if(pchg){const old=SPMODE[x.mode];spProgSet(x,{mode:f.mode,pw:f.pw,pd:f.pd,on:f._on,off:f._off,a:spIsD(f._a)?f._a:td});spEv(x,'mode|'+old+' → '+SPMODE[f.mode])}
  else if(f.mode==='cyc'){const g=spSeg(x,td>=spF0(x)?td:spF0(x)),a0=spCycA(x,td);
    if(spIsD(f._a)&&f._a!==a0){spCycStart(x,f._a,f._on,f._off);spEv(x,'start|'+spDl(f._a))}
    else if(g.on!==f._on||g.off!==f._off){const ol=spCycL(g);spCycleSet(x,f._on,f._off);spEv(x,'cyc|'+ol+' → '+spCycL({on:f._on,off:f._off}))}}
  if(f.stock.on!==x.stock.on||(f.stock.on&&(spStock(x)||{}).left!==f.stock.q)||f.stock.su!==x.stock.su||f.stock.pi!==x.stock.pi||f.stock.low!==x.stock.low){x.stock=Object.assign({},f.stock,{at:td,add:[]});if(f.stock.on)ch.push('stock')}
  if(ch.length){if(ch.includes('dz')&&JSON.stringify(o.dz)!==JSON.stringify(x.dz))spEv(x,'dose');if(ch.includes('tk'))spEv(x,'time');if(ch.some(c=>!['dz','tk','c','stock'].includes(c)))spEv(x,'edit')}
  x.up=Date.now();spFix(x);save();closeSheet();toast('Fiche enregistrée');spRefresh()}
/* ---- actions de la fiche ---- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-spf],[data-spfm],[data-spfr],[data-spfmo],[data-spfq],[data-spfw],[data-spfpd],[data-spffar],[data-spfc],[data-spfdz]');if(!t||!spF)return;const f=spF,d=t.dataset;
  if(d.spf!=='del'&&d.spf!=='save')spFormRead();
  if(d.spfm){const m=d.spfm,i=f.tk.findIndex(z=>z.m===m);if(i>=0){if(f.tk.length>1)f.tk.splice(i,1);else{toast('Au moins un moment de prise');return}}else{f.tk.push({m,t:m==='a'?'10:00':''});f.tk.sort((a,b)=>SPM_O.indexOf(a.m)-SPM_O.indexOf(b.m))}t.setAttribute('aria-pressed',i<0);spFormSync();return}
  if(d.spfr){f.r=d.spfr;t.parentNode.querySelectorAll('[data-spfr]').forEach(b=>b.setAttribute('aria-pressed',b===t));$('spRn').hidden=f.r!=='autre';return}
  if(d.spfmo){f.mode=d.spfmo;if(f.mode==='cyc'&&!f._a)f._a=f._new?f.d0:spToday();t.parentNode.querySelectorAll('[data-spfmo]').forEach(b=>b.setAttribute('aria-pressed',b===t));spFormSync();return}
  if(d.spfq){const[a,b]=d.spfq.split('/').map(Number);f._on=a;f._off=b;f._ou=a%7===0?7:1;f._fu=b%7===0?7:1;spFormSync();return}
  if(d.spfw){const n=+d.spfw,i=f.pw.indexOf(n);if(i>=0)f.pw.splice(i,1);else f.pw.push(n);f.pw.sort();spFormSync();return}
  if(d.spfpd){f.pd=f.pd.filter(x=>x!==d.spfpd);spFormSync();return}
  if(d.spffar){const i=f.far.indexOf(d.spffar);if(i>=0)f.far.splice(i,1);else f.far.push(d.spffar);t.setAttribute('aria-pressed',i<0);if(i<0&&!f.farH){f.farH=2;const fh=$('spFarH');if(fh)fh.value=2}return}
  if(d.spfc!==undefined){f.c=+d.spfc;t.parentNode.querySelectorAll('[data-spfc]').forEach(b=>b.setAttribute('aria-pressed',b===t));return}
  if(d.spfdz!==undefined){f.dz.splice(+d.spfdz,1);spFormSync();return}
  const a=d.spf;
  if(a==='save'){spSave();return}
  if(a==='pdadd'){const v=$('spPdD').value;if(!spIsD(v)){toast('Choisis une date');return}if(!f.pd.includes(v))f.pd.push(v);f.pd.sort();spFormSync();return}
  if(a==='dzadd'){const v=$('spDzD').value,q=String($('spDzQ').value).replace(',','.');if(!spIsD(v)||q===''||isNaN(+q)){toast('Choisis une date et une dose');return}f.dz=f.dz.filter(z=>z.d!==v).concat({d:v,q:+q}).sort((a2,b2)=>a2.d<b2.d?-1:1);spFormSync();return}
  if(a==='stock'){f.stock.on=!f.stock.on;t.setAttribute('aria-pressed',f.stock.on);$('spStkP').hidden=!f.stock.on;return}
  if(a==='del'){const x=spById(f.id);if(!x)return;const s=SP(),i=s.list.indexOf(x),bk=JSON.stringify(x);s.list.splice(i,1);spEv(x,'del');save();closeSheet();spRefresh();
    snack('Complément supprimé (historique gardé)','Annuler',()=>{const y=JSON.parse(bk);spFix(y);s.list.splice(Math.min(i,s.list.length),0,y);save();spRefresh()});return}
  if(a==='pause'){spPauseSheet(f.id);return}
  if(a==='resume'){spResumeSheet(f.id);return}
  if(a==='end'){const x=spById(f.id);if(!x)return;const bk=x.d1;x.d1=spToday();spEv(x,'end');save();closeSheet();spRefresh();snack('Complément terminé aujourd\'hui','Annuler',()=>{x.d1=bk;save();spRefresh()});return}
  if(a==='react'){const x=spById(f.id);if(!x)return;x.d1='';spEv(x,'react');save();closeSheet();toast('Complément réactivé');spRefresh();return}});
document.addEventListener('input',e=>{if(!spF||!e.target.closest||!e.target.closest('.sp7f'))return;if(['spQ','spU','spOn','spOff','spOnU','spOffU','spA','spD0'].includes(e.target.id)||e.target.dataset.sptk!==undefined){spFormRead();
  if(e.target.id==='spQ'||e.target.id==='spU'){const q=$('spDayQ');if(q)q.innerHTML=spF.q!==null&&spF.tk.length?spJ([spS('Par jour'),spS(spF.tk.length>1?spF.tk.length+' × '+spU(spF.q,spF.u)+' = '+spU(Math.round(spF.q*spF.tk.length*1000)/1000,spF.u):spU(spF.q,spF.u))]):'';const w=$('spWarnL');if(w){const W=spWarn(spF);w.innerHTML=W.length?'<div class="sp7wl2"><p class="sp7fl">Points à vérifier</p>'+W.map(t=>'<p>'+ico('warn')+spS(t)+'</p>').join('')+'</div>':''}}
  if(e.target.id==='spD0'&&spF._new&&spF.mode==='cyc'){const a=$('spA');if(a&&(!spF._aT)){a.value=spF.d0;spF._a=spF.d0}}
  if(e.target.id==='spA')spF._aT=1;spCyPrev()}
  if(e.target.id==='spPr'){spF.pr=e.target.value;const w=$('spWarnL');if(w){const W=spWarn(spF);w.innerHTML=W.length?'<div class="sp7wl2"><p class="sp7fl">Points à vérifier</p>'+W.map(t=>'<p>'+ico('warn')+spS(t)+'</p>').join('')+'</div>':''}}});
/* pause : à partir d'aujourd'hui (ou d'une date), jusqu'à une date facultative ; le cycle n'est pas modifié */
function spPauseSheet(id){const x=spById(id);if(!x)return;const td=spToday();
  openSheet('<div class="nsh sp7f"><h2 class="t">Mettre en pause</h2><p class="nfs notr">'+esc(x.n)+'</p><div class="nrow2"><label class="nfl">À partir du<input id="spPa" type="date" value="'+td+'" min="'+td+'"></label><label class="nfl">Jusqu\'au (facultatif)<input id="spPb" type="date" min="'+td+'"></label></div>'
   +'<p class="sp7mh">'+spS('Pendant la pause : aucun rappel. Le cycle n\'est pas modifié.')+'</p><button type="button" class="btn nbig" data-spps="'+id+'">Mettre en pause</button></div>')}
function spResumeSheet(id){const x=spById(id);if(!x)return;
  if(x.mode!=='cyc'){spDoResume(x,false);return}
  openSheet('<div class="nsh sp7f"><h2 class="t">Reprendre</h2><p class="nfs notr">'+esc(x.n)+'</p><button type="button" class="sp7opt" data-sprs="'+id+'~0"><b>Garder les dates prévues du cycle</b><small>Le cycle a continué pendant la pause.</small></button>'
   +'<button type="button" class="sp7opt" data-sprs="'+id+'~1"><b>Reprendre le cycle là où il en était</b><small>Les jours de pause ne comptent pas : les dates suivantes sont décalées.</small></button></div>')}
function spDoResume(x,shift){const td=spToday();spResume(x,td,shift);spEv(x,shift?'resx':'res');save();closeSheet();toast('Complément repris');spRefresh()}
/* stock racheté */
function spRefill(id){const x=spById(id);if(!x)return;const st=spStock(x);
  openSheet('<div class="nsh sp7f"><h2 class="t">Stock racheté</h2><p class="nfs notr">'+esc(x.n)+'</p><label class="nfl"><span>Quantité ajoutée <small>'+esc(x.stock.su)+'</small></span><input id="spRq" type="number" inputmode="decimal" step="any" min="0" placeholder="Ex. 120"></label>'
   +(st?'<p class="sp7mh">'+spJ([spS('Restant estimé'),spS(fmtN(st.left)+' '+st.su)])+'</p>':'')+'<button type="button" class="btn nbig" data-sprq="'+id+'">Ajouter au stock</button></div>');setTimeout(()=>{const i=$('spRq');if(i)i.focus()},250)}
/* ---- prise : valider, reporter, ignorer, oubli, corriger ---- */
function spFindIt(k,kk){return spDayAll(k).find(it=>it.key===kk)}
function spIntake(k,kk){const it=spFindIt(k,kk);if(!it)return;const x=it.x,e=spLog(k,kk),td=spToday(),fut=k>td,now=Date.now(),past=k<td||spAt(k,it.t)<=now;
  let h='<div class="nsh sp7ia"><h2 class="t notr">'+esc(x.n)+'</h2><p class="sp7iam">'+spJ([it.q!==null&&it.q!==undefined?spS(spU(it.q,x.u)):spS('Dose à préciser','sp7miss'),it.dem?spS('À la demande'):spS(SPMP[it.m]||'Prise'),spS(it.t),x.r!=='indif'&&SPR[x.r]?(x.r==='autre'&&x.rn?'<span class="notr">'+esc(x.rn)+'</span>':spS(SPR[x.r])):''])+'</p>'
   +'<p class="sp7iad">'+spJ([spS(spDL(k)),e?spStLab(k,it,e,now):spS(fut?'Prévue':past?'Pas encore validée':'À prendre')])+'</p>'
   +(x.no?'<div class="sp7nt"><b>Instructions</b><p class="notr">'+esc(x.no)+'</p></div>':'');
  if(!fut&&!it.gone){const st=e&&e.s;h+='<div class="sp7iab">'
     +(st!=='ok'?'<button type="button" class="btn" data-spia="'+k+'~'+esc(kk)+'~ok">'+ico('check')+'<span>'+(past&&k===td&&now-spAt(k,it.t)>3600000?'Prise à l\'heure':'Prise')+'</span></button>':'')
     +(past&&st!=='late'?'<button type="button" class="btn ghost" data-spia="'+k+'~'+esc(kk)+'~late">Prise en retard</button>':'')
     +(k===td&&!spDone(e)?'<div class="sp7snz"><span>Reporter</span><button type="button" class="btn sm ghost" data-spia="'+k+'~'+esc(kk)+'~s10">10 min</button><button type="button" class="btn sm ghost" data-spia="'+k+'~'+esc(kk)+'~s30">30 min</button><button type="button" class="btn sm ghost" data-spia="'+k+'~'+esc(kk)+'~s60">1 h</button></div>':'')
     +(st!=='skip'?'<button type="button" class="btn ghost" data-spia="'+k+'~'+esc(kk)+'~skip">Ignorer cette prise</button>':'')
     +(past&&st!=='miss'?'<button type="button" class="btn ghost" data-spia="'+k+'~'+esc(kk)+'~miss">Oubliée</button>':'')
     +(e?'<button type="button" class="nlink" data-spia="'+k+'~'+esc(kk)+'~clr">Remettre à faire</button>':'')+'</div>'}
  if(!it.gone)h+='<button type="button" class="nlink sp7iaf" data-spe="'+x.id+'">Voir la fiche</button>';
  openSheet(h+'</div>')}
function spAct(k,kk,a){const it=spFindIt(k,kk);if(!it)return;const prev=spLog(k,kk),bk=prev?JSON.parse(JSON.stringify(prev)):null,now=Date.now(),kc=prev&&prev.k?{k:prev.k}:{};
  if(a==='ok'){const st=k===spToday()&&now-spAt(k,it.t)>3600000?'ok':spTakeSt(k,it,now);spSet(k,it,k<spToday()?'ok':st,kc)}
  else if(a==='late')spSet(k,it,'late',kc);else if(a==='skip')spSet(k,it,'skip',kc);else if(a==='miss')spSet(k,it,'miss',kc);
  else if(a==='clr')spUnset(k,kk);else if(a[0]==='s'){const m=+a.slice(1);spSet(k,it,'snz',{u:now+m*60000,k:((prev&&prev.k)||0)+1})}
  save();closeSheet();spRefresh();const undo=()=>{if(bk){const L=SP().log[k]=obj(SP().log[k]);L[kk]=bk}else spUnset(k,kk);save();spRefresh()};
  if(a==='miss'){openSheet('<div class="nsh sp7ia"><h2 class="t">Oubli noté</h2><p class="sp7iam">'+spS('L\'oubli est enregistré dans ton historique.')+'</p><div class="sp7nt"><b>'+spS('Ne double pas la prise suivante sans avis.')+'</b><p>'+spS('Suis la notice du produit ou l\'avis d\'un professionnel de santé.')+'</p>'+(it.x.no?'<p class="notr">'+esc(it.x.no)+'</p>':'')+'</div><button type="button" class="btn nbig" data-spclose="1">Compris</button></div>');return}
  const M={ok:'Prise notée',late:'Prise en retard notée',skip:'Prise ignorée',clr:'Prise remise à faire'};snack(a[0]==='s'?'Rappel reporté':M[a]||'Noté','Annuler',undo)}
/* ---- réglages : heures des moments, décalage, rappels, agenda, calendrier ---- */
function spSettings(){const s=SP(),ok=spNotifOk(),on=!!s.ntf&&ok&&Notification.permission==='granted';
  const how=PLAT.ios&&!isStandalone()?'Sur iPhone, les notifications d\'une appli web demandent qu\'elle soit installée sur l\'écran d\'accueil.':PLAT.ios?'L\'iPhone envoie la notification quand l\'appli est ouverte. Appli fermée, il ne laisse pas une appli web la programmer : ajoute aussi les rappels à l\'agenda du téléphone, ils sonnent même appli fermée.':PLAT.and?'Notification à l\'heure de chaque prise tant que l\'appli tourne (ouverte ou laissée en arrière-plan). Appli fermée, Android ne laisse pas une appli web la programmer : ajoute aussi les rappels à l\'agenda du téléphone.':'Notification à l\'heure de chaque prise tant que l\'appli est ouverte dans le navigateur.';
  openSheet('<div class="nsh sp7f sp7set"><h2 class="t">Rappels et horaires</h2><p class="sp7fl">Heures des moments</p><div class="sp7mts">'+['m','d','s','c'].map(m=>'<label class="sp7tkr"><span>'+esc(SPM[m][0])+'</span><input type="time" data-spmt="'+m+'" value="'+s.mt[m]+'"></label>').join('')+'</div>'
   +'<p class="sp7mh">'+spS('Les compléments sans heure propre suivent ces heures.')+'</p><p class="sp7fl">Décaler toute la routine</p><div class="sp7chips">'+[-60,-30,-15,15,30,60].map(n=>'<button type="button" class="sp7chip" data-spsh="'+n+'">'+(n>0?'+':'−')+(Math.abs(n)===60?'1 h':Math.abs(n)+' min')+'</button>').join('')+'</div>'
   +'<p class="sp7fl">Notifications</p>'+(ok?'<button type="button" class="tglrow" data-spntf="1" aria-pressed="'+on+'"><span><b>Rappels de prise</b>Regroupés quand plusieurs compléments tombent à la même heure</span><i></i></button>':'')+'<p class="sp7mh">'+spS(how)+'</p>'
   +'<button type="button" class="sp7opt" data-sp="agenda"><b>Agenda du téléphone</b><small>'+spS('Un calendrier séparé « Compléments alimentaires » avec une alarme à chaque prise.')+'</small></button>'
   +'<p class="sp7fl">Calendrier</p><button type="button" class="tglrow" data-spcal="1" aria-pressed="'+(s.cal!==false)+'"><span><b>Calendrier des compléments</b>Dans l\'onglet Calendrier, à côté de Mois et Semaine</span><i></i></button>'
   +'<p class="sp7disc2">'+spS('Outil d\'organisation et de suivi : il ne remplace pas l\'avis d\'un professionnel de santé.')+'</p></div>')}
/* agenda du téléphone : explication honnête et ajout du fichier */
function spAgenda(){const s=SP(),st=spIcsState(),can=!!(navigator.canShare&&window.File);
  const steps=PLAT.ios?['Touche « Ajouter à l\'agenda » : l\'iPhone propose « Tout ajouter ».','Si l\'iPhone demande un calendrier, choisis « Compléments alimentaires » (crée-le avant dans l\'app Calendrier : Calendriers, Ajouter un calendrier).','Les alarmes sonnent à l\'heure de chaque prise, même appli fermée.']
    :PLAT.and?['Touche « Ajouter à l\'agenda » : le fichier est enregistré sur le téléphone.','Ouvre-le avec ton agenda (Samsung Calendrier, par exemple) ; avec Google Agenda, importe-le depuis un ordinateur sur calendar.google.com (Paramètres, Importer) dans un agenda « Compléments alimentaires » créé pour l\'occasion.','Dans Google Agenda, règle les notifications de cet agenda sur « au moment de l\'événement ».']
    :['Touche « Ajouter à l\'agenda » : le fichier est téléchargé.','Importe-le dans Google Agenda (Paramètres, Importer) ou dans Calendrier (Fichier, Importer), dans un agenda « Compléments alimentaires » séparé.'];
  openSheet('<div class="nsh sp7f"><h2 class="t">Agenda du téléphone</h2><p class="sp7mh">'+spS('Crée un calendrier séparé « Compléments alimentaires » : une alarme à chaque prise (regroupées par heure), la fin des périodes ON, les reprises et les changements de dose, pour les 6 prochains mois. Rien ne se mélange avec tes autres agendas.')+'</p>'
   +'<div class="sp7stb"><i class="sp7b b-'+(st==='ok'?'actif':st==='none'?'def':'pause')+'">'+esc(({none:'Pas encore ajouté',old:'À mettre à jour',soon:'Bientôt fini',ok:'À jour'})[st])+'</i>'+(s.ics.at?'<small>'+spP([spS('Dernier ajout le'),spS(spDl(s.ics.at))])+'</small>':'')+'</div>'
   +'<ol class="sp7ol">'+steps.map(t=>'<li>'+spS(t)+'</li>').join('')+'</ol>'
   +'<button type="button" class="btn nbig" data-spics="open">'+ico('cal')+'<span>Ajouter à l\'agenda</span></button>'+(can?'<button type="button" class="btn ghost sp7w" data-spics="share">Partager le fichier</button>':'')
   +'<div class="sp7nt"><b>'+spS('Après une modification')+'</b><p>'+spS('Supprime le calendrier « Compléments alimentaires » de ton agenda, puis ajoute le nouveau fichier : pas de doublon, tout est à jour.')+'</p><p>'+spS('Une mise à jour automatique (abonnement) demanderait un serveur en ligne : l\'appli fonctionne sans serveur, tes données restent sur ton téléphone.')+'</p></div></div>')}
/* ---- actions des écrans ---- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-sp],[data-spt],[data-spe],[data-spk],[data-spm],[data-spall],[data-spdem],[data-spdef],[data-sprf],[data-spmv],[data-sptw],[data-spcv],[data-spcn],[data-spd],[data-spcf],[data-sphf],[data-sphm],[data-spia],[data-spps],[data-sprs],[data-sprq],[data-spsh],[data-spntf],[data-spcal],[data-spics],[data-spclose],[data-nt]');if(!t)return;const d=t.dataset,s=SP(),re=()=>{save();spRefresh()};
  if(d.nt){S.ntab=d.nt;save();const h=d.nt==='supp'?'#complements':'#nutrition';if(location.hash===h)route();else location.hash=h;return}
  if(d.sp==='add'){spEdit();return}if(d.sp==='set'){spSettings();return}if(d.sp==='agenda'){spAgenda();return}
  if(d.spt){s.tab=d.spt;save();if(curV==='nut'&&S.ntab==='supp'){renderSupp();scrollTo(0,0)}else{S.ntab='supp';location.hash='#complements'}return}
  if(d.spe){spEdit(d.spe);return}
  if(d.spk){const [k,kk]=d.spk.split('~'),it=spFindIt(k,kk);if(!it)return;const e0=spLog(k,kk);
    if(k<spToday()&&!spTaken(e0)){spIntake(k,kk);return}
    if(spTaken(e0)){const bk=JSON.parse(JSON.stringify(e0));spUnset(k,kk);re();snack('Prise annulée','Annuler',()=>{const L=SP().log[k]=obj(SP().log[k]);L[kk]=bk;re()})}
    else{spSet(k,it,spTakeSt(k,it),e0&&e0.k?{k:e0.k}:{});re();if(spBnr&&spBnr.keys.includes(kk))spBannerHide();snack('Prise notée','Annuler',()=>{if(e0){const L=SP().log[k]=obj(SP().log[k]);L[kk]=e0}else spUnset(k,kk);re()})}return}
  if(d.spm){const [k,kk]=d.spm.split('~');spIntake(k,kk);return}
  if(d.spall){const [k,ks]=d.spall.split('~'),bk={};ks.split(',').forEach(kk=>{const it=spFindIt(k,kk);if(!it)return;const e0=spLog(k,kk);bk[kk]=e0||null;if(!spDone(e0))spSet(k,it,spTakeSt(k,it),e0&&e0.k?{k:e0.k}:{})});re();
    snack('Prises notées','Annuler',()=>{Object.keys(bk).forEach(kk=>{if(bk[kk]){const L=SP().log[k]=obj(SP().log[k]);L[kk]=bk[kk]}else spUnset(k,kk)});re()});return}
  if(d.spdem){const x=spById(d.spdem);if(!x)return;const k=spToday(),kk=x.id+'|x'+Date.now().toString(36);spSet(k,{x,key:kk,q:spDose(x,k),m:'a',t:spHM(Date.now())},'ok');re();snack('Prise notée','Annuler',()=>{spUnset(k,kk);re()});return}
  if(d.spdef){const [id,m]=d.spdef.split('~');spEdit(id,{mode:m});return}
  if(d.sprf){spRefill(d.sprf);return}
  if(d.spmv){const [kk,to]=d.spmv.split('~'),[id,i]=kk.split('|'),x=spById(id);if(!x||!x.tk[+i])return;const bk=x.tk[+i].t;x.tk[+i].t=to;spEv(x,'time|'+to);re();snack('Horaire changé : '+to,'Annuler',()=>{x.tk[+i].t=bk;re()});return}
  if(d.sptw){s.tw=+d.sptw;re();return}
  if(d.spcv){s.cv=d.spcv;re();return}
  if(d.spcn!==undefined){const n=+d.spcn,cv=s.cv||'m';if(!n)s.cd=spToday();else if(cv==='m'){const p=parse(s.cd||spToday()),m=new Date(p.getFullYear(),p.getMonth()+n,1);s.cd=key(m)}else s.cd=spAdd(s.cd||spToday(),n*(cv==='w'?7:1));re();return}
  if(d.spd){s.cd=d.spd;s.cv='d';re();return}
  if(d.spcf!==undefined){s.cf=d.spcf;re();return}
  if(d.sphf!==undefined){s.hf=d.sphf;re();return}
  if(d.sphm){s.hn=(Math.max(14,+s.hn||14))+14;re();return}
  if(d.spia){const [k,kk,a]=d.spia.split('~');spAct(k,kk,a);return}
  if(d.spps){const x=spById(d.spps);if(!x)return;const a=$('spPa').value||spToday(),b=$('spPb').value||'';if(b&&b<a){toast('La reprise est avant le début de la pause');return}spPause(x,a,b);spEv(x,'pause|'+spDl(a)+(b?' → '+spDl(b):''));save();closeSheet();toast('Complément en pause');spRefresh();return}
  if(d.sprs){const [id,sh]=d.sprs.split('~'),x=spById(id);if(x)spDoResume(x,sh==='1');return}
  if(d.sprq){const x=spById(d.sprq),q=+String(($('spRq')||{}).value||'').replace(',','.');if(!x||!(q>0)){toast('Indique la quantité ajoutée');return}x.stock.add.push({d:spToday(),q});spEv(x,'stock|+'+fmtN(q)+' '+x.stock.su);save();closeSheet();toast('Stock mis à jour');spRefresh();return}
  if(d.spsh){const n=+d.spsh;spShift(n);save();document.querySelectorAll('[data-spmt]').forEach(i=>{i.value=s.mt[i.dataset.spmt]});toast('Routine décalée de '+(n>0?'+':'−')+(Math.abs(n)===60?'1 h':Math.abs(n)+' min'));s.ev.push({t:Date.now(),id:'',n:'Routine',x:'shift|'+(n>0?'+':'−')+Math.abs(n)+' min'});spRefresh();return}
  if(d.spntf){spNotifToggle().then(()=>{const b=document.querySelector('[data-spntf]');if(b)b.setAttribute('aria-pressed',!!SP().ntf&&Notification.permission==='granted');spRefresh()});return}
  if(d.spcal){s.cal=s.cal===false;t.setAttribute('aria-pressed',s.cal!==false);save();return}
  if(d.spics){spIcsOpen(d.spics).then(r=>{if(r==='file')toast('Fichier d\'agenda enregistré');spRefresh()});return}
  if(d.spclose){closeSheet();return}});
document.addEventListener('change',e=>{const t=e.target;if(!t.dataset)return;const s=SP();
  if(t.dataset.spmt){if(!spIsT(t.value))return;s.mt[t.dataset.spmt]=t.value;save();spRefresh();return}
  if(t.dataset.sphd){if(spIsD(t.value)){s.hd=t.value;s.hn=14;save();spRefresh()}return}});
