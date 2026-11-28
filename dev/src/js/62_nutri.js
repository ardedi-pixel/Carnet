/* ===================== v7.2 : Nutrition « carnet » : Kcal et Prot, objectifs choisis par l'utilisateur =====================
   L'appli enregistre, range et affiche. Elle ne calcule pas de besoins et ne recommande rien.
   Données S.nut :
   - kG, pG : objectifs du jour saisis par l'utilisateur (0 = pas d'objectif, on suit seulement ce qui est mangé) ;
   - days {date:{b,l,d,s:[entrées],w}} : entrées rangées par moment de la journée (non affiché) ;
     entrée libre {f:'q', n, q, g:100, v:[kcal, prot, 0, 0, 0], t} ; les entrées « base d'aliments » {f:id, g} des v7.0-7.1 restent lues ;
   - pins [{n,q,k,p}] : favoris (raccourcis d'ajout en un geste).
   Clés des versions précédentes gardées telles quelles (goal, sex, age, ht, act, tf, auto, tgt, fav, my, meals, rec, w) : rien n'est supprimé. */
const NSLOT=['b','l','s','d'],NSORD={b:1,l:2,s:3,d:4};
let nutD='',nutHN=7;
const r1=v=>Math.round(v*10)/10,nfmt=v=>fmtN(Math.round(v)),gfmt=v=>fmtN(r1(v)),kfmt=v=>{const r=Math.round(v);return Math.abs(r)>=1000?r.toLocaleString(LOC()):String(r)}; /* kfmt : chiffre seul dans son élément (séparateur de milliers) */
const nrm=s=>String(s||'').toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae').normalize('NFD').replace(/[̀-ͯ]/g,'');
/* objectifs affichés par les v7.0-7.1 (estimation ou valeurs perso) : repris une seule fois, puis l'utilisateur décide */
function nutOld(n){if(!n.goal)return null;if(n.auto===false&&n.tgt&&+n.tgt.kcal)return{kcal:+n.tgt.kcal,p:+n.tgt.p||0};
  const G={bulk:[1.1,1.8],maint:[1,1.8],cut:[.8,2.2]}[n.goal],w=lastBw(),A=[1.2,1.3,1.45,1.6][(+n.act||2)-1]||1.3;if(!G||!w||!+n.age||!+n.ht||!n.sex)return null;
  const tf=n.tf===null||n.tf===undefined||n.tf===''?(S.goal||3):+n.tf,bmr=10*w+6.25*n.ht-5*n.age+(n.sex==='f'?-161:5);return{kcal:Math.round(bmr*Math.min(2,A+.025*tf)*G[0]/10)*10,p:Math.round(G[1]*w)}}
function nutLoad(){const n=obj(S.nut);n.days=obj(n.days);n.my=arr(n.my).filter(x=>x&&x.id&&x.n);n.fav=arr(n.fav);n.meals=arr(n.meals).filter(m=>m&&m.n&&Array.isArray(m.it));n.rec=arr(n.rec).slice(0,16);S.nut=n;
  if(n.kG===undefined){let o=null;try{o=nutOld(n)}catch(e){}n.kG=o?o.kcal:0;n.pG=o?o.p:0;
    n.pins=arr(n.pins);n.fav.forEach(id=>{const f=nf(id);if(!f)return;const g=f.por&&f.por[0]?f.por[0][1]:100;n.pins.push({n:f.n,q:f.por&&f.por[0]?f.por[0][0]:'100 g',k:Math.round(f.k*g/100),p:r1(f.p*g/100)})})}
  n.kG=Math.max(0,Math.min(9999,Math.round(+n.kG||0)));n.pG=Math.max(0,Math.min(999,Math.round(+n.pG||0)));n.pins=arr(n.pins).filter(x=>x&&x.n).slice(0,12)}
/* ---- base d'aliments (aide à la saisie : calcul selon la quantité) ---- */
let NF=null;
function nfMap(){if(!NF){NF={};FOODS.forEach(x=>{NF[x[0]]={id:x[0],n:x[1],k:x[3],p:x[4],por:x[8]||[]}})}return NF}
function nf(id){const b=nfMap()[id];if(b)return b;const u=arr(S.nut&&S.nut.my).find(x=>x.id===id);return u?{id:u.id,n:u.n,k:+u.k||0,p:+u.p||0,por:u.pg?[[u.pl||'1 portion',+u.pg]]:[],my:1}:null}
function itFood(it){if(it.f==='q')return{n:it.n||'Aliment',k:+(it.v||[])[0]||0,p:+(it.v||[])[1]||0};const f=nf(it.f);if(f)return f;if(it.v)return{n:it.n||'Aliment',k:+it.v[0]||0,p:+it.v[1]||0};return null}
function itv(it){const f=itFood(it),g=it.f==='q'?100:(+it.g||0);if(!f)return{k:0,p:0};return{k:f.k*g/100,p:f.p*g/100}}
const itName=it=>{const f=itFood(it);return f?f.n:'Aliment'},itQty=it=>it.f==='q'?String(it.q||''):gfmt(+it.g||0)+' g';
function nDay(d){return S.nut.days[d]||{b:[],l:[],d:[],s:[],w:0}}
function nDayW(d){let x=S.nut.days[d];if(!x){x={b:[],l:[],d:[],s:[],w:0};S.nut.days[d]=x}NSLOT.forEach(m=>{x[m]=arr(x[m])});return x}
/* entrées d'un jour dans l'ordre de saisie (les anciennes, sans heure, gardent l'ordre des repas) */
function nRows(d){const day=nDay(d),R=[];NSLOT.forEach(m=>arr(day[m]).forEach((it,i)=>R.push({m,i,it,o:+it.t||NSORD[m]})));return R.sort((a,b)=>a.o-b.o)}
function dayTot(d){return nRows(d).reduce((a,r)=>{const v=itv(r.it);return{k:a.k+v.k,p:a.p+v.p}},{k:0,p:0})}
const dayHas=d=>nRows(d).length>0;
function nSave(){Object.keys(S.nut.days).forEach(d=>{const x=S.nut.days[d];if(!NSLOT.some(m=>arr(x[m]).length)&&!(+x.w))delete S.nut.days[d]});save()}
function nutTgt(){const n=S.nut;return n&&(n.kG||n.pG)?{kcal:n.kG,p:n.pG}:null}
const nutGoalLbl=()=>'',nutWeightCheck=()=>null; /* v7.2 : plus de phase ni de conseil automatique */
function nutHead(){return !nutD||nutD===TK?'Aujourd\'hui':fmtDay(parse(nutD))}
function nutSlot(){const h=new Date().getHours();return h<10?'b':h<14?'l':h<18?'s':'d'}
function nPush(d,it){it.t=Date.now();nDayW(d)[d===TK?nutSlot():'d'].push(it)}
/* ---- carte de l'accueil actuel ---- */
function nutriCard(){const t=nutTgt(),x=dayTot(TK);
  if(!t&&!x.k)return '<button type="button" class="h7c nu7 empty7" data-nu="go"><span class="hcic">'+ico('nut')+'</span><div class="h7b"><p class="kick">Nutrition</p><b>Kcal et protéines</b><p>Note ce que tu manges, avec tes propres objectifs.</p></div>'+ico('chev','hcv')+'</button>';
  const pk=t&&t.kcal?Math.min(1,x.k/t.kcal):0,left=t&&t.kcal?t.kcal-x.k:0;
  return '<div class="h7c nu7"><button type="button" class="nu7m" data-nu="go" aria-label="Ouvrir la nutrition"><span class="nu7r">'+nRing(x.k,t&&t.kcal,64)+'<b>'+(t&&t.kcal?Math.round(pk*100)+'%':nfmt(x.k))+'</b></span><span class="h7b"><span class="kick">Nutrition</span><b>'+(t&&t.kcal?(left>=0?nfmt(left)+' kcal restantes':nfmt(-left)+' kcal au-dessus'):nfmt(x.k)+' kcal')+'</b><span class="nu7p">'+(t&&t.p?'Protéines '+nfmt(x.p)+' / '+nfmt(t.p)+' g':'Protéines '+nfmt(x.p)+' g')+'</span>'+(t&&t.p?'<span class="nbt sm"><i style="width:'+(Math.min(1,x.p/t.p)*100).toFixed(1)+'%"></i></span>':'')+'</span></button><button type="button" class="ib pw7a" data-nu="add" aria-label="Ajouter un aliment">'+ico('add')+'</button></div>'}
function nRing(v,t,sz){const p=t?Math.min(1,v/t):0,C=2*Math.PI*42;return '<svg class="nring" viewBox="0 0 100 100" aria-hidden="true" style="width:'+sz+'px;height:'+sz+'px"><circle cx="50" cy="50" r="42" class="nrt"/><circle cx="50" cy="50" r="42" class="nrp'+(t&&v>t*1.05?' over':'')+'" stroke-dasharray="'+(C*p).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 50 50)"/></svg>'}
/* ---- page Nutrition ---- */
function nCount(lab,val,goal,unit,cls){const u=unit?' '+unit:'',has=goal>0,left=goal-val,p=has?Math.min(1,val/goal):0;
  return '<div class="nc7c '+cls+'"><span class="nc7l">'+lab+'</span><b class="nc7v"><span>'+kfmt(val)+'</span>'+(has?'<small> / '+kfmt(goal)+u+'</small>':(u?'<small>'+u+'</small>':''))+'</b>'
   +(has?'<span class="nbt"><i style="width:'+(p*100).toFixed(1)+'%"></i></span><span class="nc7r'+(left<0&&cls==='k'?' over':'')+'">'+(left>=0?'Reste '+nfmt(left)+u:cls==='p'?'Objectif atteint':nfmt(-left)+u+' au-dessus')+'</span>':'<span class="nc7r nc8no">Pas d\'objectif</span>')+'</div>'}
/* raccourcis d'ajout : favoris, repas enregistrés (v7.0), puis ce que tu as noté récemment */
function nQuick(){const out=[],seen=new Set(),kf=x=>nrm(x.n)+'|'+Math.round(+x.k||0);
  S.nut.pins.forEach((x,i)=>{seen.add(kf(x));out.push({n:x.n,q:x.q||'',k:+x.k||0,p:+x.p||0,pin:i})});
  S.nut.meals.forEach(m=>{const t=m.it.reduce((a,it)=>{const v=itv(it);return{k:a.k+v.k,p:a.p+v.p}},{k:0,p:0});out.push({n:m.n,q:'',k:Math.round(t.k),p:r1(t.p),meal:m.id})});
  for(let i=0;i<30&&out.length<14;i++){const d=key(add(parse(TK),-i));nRows(d).slice().reverse().forEach(r=>{if(out.length>=14)return;const v=itv(r.it),x={n:itName(r.it),q:itQty(r.it),k:Math.round(v.k),p:r1(v.p)};const k=kf(x);if(seen.has(k))return;seen.add(k);out.push(x)})}
  return out}
let nQ=[];
function nutQuickHtml(){nQ=nQuick();if(!nQ.length)return '';return '<div class="nq8c" role="list" aria-label="Ajouter en un geste">'+nQ.map((x,i)=>'<button type="button" class="nq8k'+(x.pin!==undefined?' fav':'')+'" data-nqk="'+i+'" role="listitem"><span>'+(x.pin!==undefined?ico('star2'):'')+esc(x.n)+(x.q?' <small>'+esc(x.q)+'</small>':'')+'</span><small>'+nfmt(x.k)+' kcal · '+gfmt(x.p)+' g</small></button>').join('')+'</div>'}
function renderNut(){const v=$('vNut');if(!v)return;if(!nutD||nutD>TK)nutD=TK;const n=S.nut,x=dayTot(nutD),R=nRows(nutD),past=nutD<TK;
  let h='<section class="panel wide nc7 nc8"><div class="ndh"><button type="button" class="ib" data-nu="prev" aria-label="Jour précédent">'+ico('left')+'</button><label class="nd8d"><b>'+esc(nutHead())+'</b><input type="date" id="nuDate" value="'+nutD+'" max="'+TK+'" aria-label="Choisir un jour"></label><button type="button" class="ib" data-nu="next" aria-label="Jour suivant"'+(past?'':' disabled')+'>'+ico('right')+'</button></div>'
   +'<div class="nc7g">'+nCount('Kcal',x.k,n.kG,'','k')+nCount('Prot',x.p,n.pG,'g','p')+'</div>'
   +(past?'<button type="button" class="nlink nc8b" data-nu="today">Revenir à aujourd\'hui</button>':'')+'</section>';
  h+='<section class="panel wide nl7 nl8"><h2 class="t">Journal</h2>'+(R.length?'<div class="nl7t"><div class="nl7h"><span>Aliment</span><span>Kcal</span><span>Prot</span></div>'
     +R.map(r=>{const vv=itv(r.it),q=itQty(r.it);return '<button type="button" class="nl7r" data-ne="'+r.m+':'+r.i+'"><span class="nl7n"><span>'+esc(itName(r.it))+'</span>'+(q?'<small>'+esc(q)+'</small>':'')+'</span><span>'+nfmt(vv.k)+'</span><span>'+gfmt(vv.p)+'</span></button>'}).join('')
     +'<div class="nl7s"><span>Total</span><span>'+nfmt(x.k)+'</span><span>'+gfmt(x.p)+'</span></div></div>':'<p class="nfs nempty">'+(past?'Rien de noté ce jour-là.':'Rien de noté pour l\'instant. Un nom et des kcal suffisent, le reste est facultatif.')+'</p>')
   +'<div class="nq7"><div class="nq7a"><label class="nq7f nq7n"><span>Aliment</span><input id="nqN" autocomplete="off" maxlength="60" placeholder="Œufs, riz, poulet…"></label><label class="nq7f nq7q"><span>Quantité</span><input id="nqQ" autocomplete="off" maxlength="30" placeholder="200 g"></label></div><div class="nq7s" id="nqS" hidden></div>'
   +'<div class="nq7a"><label class="nq7f"><span>Kcal</span><input id="nqK" type="number" inputmode="decimal" min="0" step="1"></label><label class="nq7f"><span>Prot (g)</span><input id="nqP" type="number" inputmode="decimal" min="0" step="0.1"></label><button type="button" class="btn nq7b" data-nu="qadd">Ajouter</button></div></div>'
   +nutQuickHtml()+'</section>';
  h+=nutHistHtml();
  h+='<div class="nx7 nx8"><button type="button" class="btn ghost" data-nu="goal">'+ico('target')+'Mes objectifs</button><a class="btn ghost" href="#carnet" data-ncat="nut">'+ico('note')+'Carnet nutrition</a></div>';
  v.innerHTML=h;nq={f:null}}
/* jours précédents : une ligne par jour noté, avec l'objectif en repère */
const nDayS=d=>parse(d).toLocaleDateString(LOC(),{weekday:'short',day:'numeric',month:'short'});
function nutHistHtml(){const n=S.nut,days=[];for(let i=1;i<=nutHN;i++)days.push(key(add(parse(TK),-i)));const L=days.filter(dayHas);
  const bar=(v,g)=>g?'<i class="nh8b"><i style="width:'+(Math.min(1,v/g)*100).toFixed(1)+'%"></i></i>':'';
  let h='<section class="panel wide nh8"><h2 class="t">Jours précédents</h2>';
  if(!L.length)h+='<p class="nfs nempty">'+(nutHN===7?'Rien de noté ces 7 derniers jours.':'Rien de noté ces 30 derniers jours.')+'</p>';
  else{const T0=L.map(dayTot),avg={k:T0.reduce((a,x)=>a+x.k,0)/L.length,p:T0.reduce((a,x)=>a+x.p,0)/L.length};
    h+='<div class="nh8l">'+L.map((d,i)=>{const x=T0[i];return '<button type="button" class="nh8r'+(d===nutD?' on':'')+'" data-nu="day:'+d+'"><span class="nh8d">'+esc(nDayS(d))+'</span><span class="nh8v"><span><b>'+kfmt(x.k)+'</b> kcal</span>'+bar(x.k,n.kG)+'</span><span class="nh8v"><span><b>'+nfmt(x.p)+'</b> g</span>'+bar(x.p,n.pG)+'</span></button>'}).join('')+'</div>'
     +'<p class="nfs nh8a"><span>'+(L.length>1?'Moyenne des '+L.length+' jours notés':'Un seul jour noté')+'</span> : <b>'+kfmt(avg.k)+' kcal</b> · <b>'+nfmt(avg.p)+' g</b> <span>de protéines</span></p>'}
  return h+'<button type="button" class="nlink nh8m" data-nh="'+(nutHN===7?30:7)+'">'+(nutHN===7?'Voir les 30 derniers jours':'Voir seulement 7 jours')+'</button></section>'}
/* ---- ajout rapide : saisie libre (kcal, prot), aidée si besoin par la base d'aliments ---- */
let nq={f:null};
const nGrams=t=>{const m=String(t||'').trim().replace(',','.').match(/^(\d+(?:\.\d+)?)\s*(g|gr|grammes?)?$/i);return m?+m[1]:0};
function nqFill(){const f=nq.f;if(!f)return;const g=nGrams($('nqQ').value)||0;if(!g)return;$('nqK').value=Math.round(f.k*g/100);$('nqP').value=r1(f.p*g/100)}
function nqAdd(){const n=$('nqN').value.trim(),q=$('nqQ').value.trim(),num=id=>{const s=String($(id).value).trim().replace(',','.');return s===''?null:parseFloat(s)},k=num('nqK'),p=num('nqP');
  if(k===null||!(k>=0&&k<=5000)){toast('Entre les calories (kcal)');$('nqK').focus();return}if(p!==null&&!(p>=0&&p<=500)){toast('Entre des protéines entre 0 et 500 g');return}
  nPush(nutD,{f:'q',n:n||(nq.f?nq.f.n:'')||'Aliment',q,g:100,v:[r1(k),p===null?0:r1(p),0,0,0]});nSave();toast('Ajouté');nutRefresh();setTimeout(()=>{const i=$('nqN');if(i)i.focus({preventScroll:true})},60)}
function nutRefresh(){if(curV==='nut')renderNut();if(curV==='home')renderHome()}
/* ---- objectifs : deux chiffres, choisis par l'utilisateur ---- */
function nutGoalSheet(){const n=S.nut;openSheet('<div class="nsh"><h2 class="t">Mes objectifs</h2><p class="nfs">Tes repères par jour. Laisse vide pour suivre seulement ce que tu manges.</p><div class="nrow2"><label class="nfl">Kcal par jour<input id="ngK" type="number" inputmode="numeric" min="0" max="9999" step="10" value="'+(n.kG||'')+'" placeholder="2800"></label><label class="nfl">Protéines par jour (g)<input id="ngP" type="number" inputmode="numeric" min="0" max="999" value="'+(n.pG||'')+'" placeholder="150"></label></div><button type="button" class="btn nbig" data-nu="gsave">Enregistrer</button></div>');setTimeout(()=>{const i=$('ngK');if(i)i.focus()},250)}
/* ---- modifier une entrée ---- */
function nutEdit(m,i){const it=arr(nDay(nutD)[m])[i];if(!it)return;const v=itv(it),pin=S.nut.pins.some(x=>nrm(x.n)===nrm(itName(it))&&Math.round(+x.k)===Math.round(v.k));
  openSheet('<div class="nsh"><h2 class="t">Modifier</h2><div class="nfg"><label class="nfl">Aliment<input id="eqN" maxlength="60" value="'+esc(itName(it))+'"></label><label class="nfl">Quantité<input id="eqQ" maxlength="30" value="'+esc(itQty(it))+'"></label><label class="nfl">Kcal<input id="eqK" type="number" inputmode="decimal" min="0" value="'+esc(String(Math.round(v.k)))+'"></label><label class="nfl">Prot (g)<input id="eqP" type="number" inputmode="decimal" min="0" step="0.1" value="'+esc(String(r1(v.p)))+'"></label></div>'
   +'<button type="button" class="tglrow" data-eq="pin" aria-pressed="'+pin+'"><span><b>Favori</b>Toujours proposé en raccourci sous l\'ajout</span><i></i></button>'
   +'<div class="nqa"><button type="button" class="btn nbig" data-eq="save">Enregistrer</button><button type="button" class="btn ghost nbig ndel" data-eq="del">'+ico('trash')+'Retirer du journal</button></div></div>');$('gbox').dataset.ed=m+':'+i}
/* ---- événements ---- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-nu],[data-ne],[data-nh],[data-eq],[data-nqf],[data-nqk]');if(!b)return;const d=b.dataset;
  if(d.nu){const a=d.nu;
    if(a==='go'){S.ntab='meal';if(location.hash==='#nutrition')route();else location.hash='#nutrition';return}
    if(a==='add'){nutD=TK;S.ntab='meal';if(location.hash==='#nutrition')renderNut();else location.hash='#nutrition';setTimeout(()=>{const i=$('nqN');if(i){i.scrollIntoView({block:'center'});i.focus({preventScroll:true})}},450);return}
    if(a==='qadd'){nqAdd();return}
    if(a==='prev'){nutD=key(add(parse(nutD||TK),-1));renderNut();setHead();return}
    if(a==='next'){if(nutD<TK){nutD=key(add(parse(nutD),1));renderNut();setHead()}return}
    if(a==='today'){nutD=TK;renderNut();setHead();return}
    if(a.startsWith('day:')){nutD=a.slice(4);renderNut();setHead();scrollTo({top:0,behavior:'smooth'});return}
    if(a==='goal'){nutGoalSheet();return}
    if(a==='gsave'){const g=id=>{const s=String(($(id)||{}).value||'').trim().replace(',','.');return s===''?0:parseFloat(s)},k=g('ngK'),p=g('ngP');
      if(!(k>=0&&k<=9999)){toast('Entre des kcal entre 0 et 9999');return}if(!(p>=0&&p<=999)){toast('Entre des protéines entre 0 et 999 g');return}
      S.nut.kG=Math.round(k);S.nut.pG=Math.round(p);nSave();closeSheet();nutRefresh();toast('Objectifs enregistrés');return}
    return}
  if(d.nh){nutHN=+d.nh;renderNut();return}
  if(d.ne){const [m,i]=d.ne.split(':');nutEdit(m,+i);return}
  if(d.nqk!==undefined){const x=nQ[+d.nqk];if(!x)return;const day=nutD,slot=nDayW(day)[day===TK?nutSlot():'d'],added=[],t=Date.now();
    if(x.meal){const M=S.nut.meals.find(q=>q.id===x.meal);if(!M)return;M.it.forEach((it,j)=>{const c=Object.assign({},it);c.t=t+j;added.push(c)})}
    else added.push({f:'q',n:x.n,q:x.q,g:100,v:[x.k,x.p,0,0,0],t});
    added.forEach(c=>slot.push(c));nSave();nutRefresh();snack('Ajouté','Annuler',()=>{added.forEach(c=>{const j=slot.indexOf(c);if(j>=0)slot.splice(j,1)});nSave();nutRefresh()});return}
  if(d.nqf){const f=nf(d.nqf);if(!f)return;nq.f=f;$('nqN').value=f.n;$('nqQ').value=gfmt(f.por&&f.por[0]?f.por[0][1]:100)+' g';nqFill();const box=$('nqS');box.hidden=true;box.innerHTML='';const q=$('nqQ');q.focus();q.select();return}
  if(d.eq){const [m,i]=($('gbox').dataset.ed||':').split(':'),L=arr(nDay(nutD)[m]),it=L[+i];if(!it)return;
    if(d.eq==='pin'){b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));return}
    if(d.eq==='save'){const n2=id=>parseFloat(String($(id).value||'').replace(',','.')),k=n2('eqK'),p=String($('eqP').value).trim()===''?0:n2('eqP');
      if(!(k>=0&&k<=5000)){toast('Entre les calories (kcal)');return}if(!(p>=0&&p<=500)){toast('Entre des protéines entre 0 et 500 g');return}
      const nn=String($('eqN').value||'').trim()||'Aliment',qq=String($('eqQ').value||'').trim(),pin=$('gbox').querySelector('[data-eq="pin"]').getAttribute('aria-pressed')==='true';
      const old=itv(it),oldN=itName(it);L[+i]={f:'q',n:nn,q:qq,g:100,v:[r1(k),r1(p),0,0,0],t:it.t||0};if(!L[+i].t)delete L[+i].t;
      S.nut.pins=S.nut.pins.filter(x=>!(nrm(x.n)===nrm(oldN)&&Math.round(+x.k)===Math.round(old.k))&&!(nrm(x.n)===nrm(nn)&&Math.round(+x.k)===Math.round(k)));if(pin)S.nut.pins.unshift({n:nn,q:qq,k:r1(k),p:r1(p)});
      nSave();closeSheet();nutRefresh();return}
    if(d.eq==='del'){const rm=L.splice(+i,1)[0];nSave();closeSheet();nutRefresh();snack('Retiré du journal','Annuler',()=>{nDayW(nutD)[m].splice(+i,0,rm);nSave();nutRefresh()});return}}});
/* suggestions pendant la frappe (base d'aliments), calcul selon la quantité, Entrée pour ajouter, changement de jour */
document.addEventListener('input',e=>{const t=e.target;if(t.id==='nqN'){nq.f=null;const q=t.value.trim(),box=$('nqS');if(!box)return;if(q.length<2){box.hidden=true;box.innerHTML='';return}
    const Q=nrm(q).split(/\s+/),L=Object.values(nfMap()).concat(arr(S.nut.my).map(u=>nf(u.id)).filter(Boolean)).filter(f=>{const s=nrm(f.n)+' '+nrm(typeof trS==='function'?trS(f.n):'');return Q.every(w=>s.includes(w))}).slice(0,4);
    box.hidden=!L.length;box.innerHTML=L.map(f=>'<button type="button" class="nq7o" data-nqf="'+esc(f.id)+'"><span>'+esc(f.n)+'</span><small>'+nfmt(f.k)+' kcal · P '+gfmt(f.p)+' g pour 100 g</small></button>').join('');return}
  if(t.id==='nqQ'){nqFill();return}});
document.addEventListener('change',e=>{if(e.target.id==='nuDate'){const v=e.target.value;if(v&&v<=TK){nutD=v;renderNut();setHead()}}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.closest&&e.target.closest('.nq7')&&e.target.tagName==='INPUT'){e.preventDefault();nqAdd()}});
