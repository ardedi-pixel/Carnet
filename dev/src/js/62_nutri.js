/* ===================== v7 : module Nutrition (objectifs, tableau du jour, journal, idées de repas, historique) =====================
   Données dans S.nut : objectif, profil, objectifs manuels, jours {date:{b,l,d,s:[{f,g,(n,v)}],w}}, favoris, aliments perso, repas enregistrés, récents. */
const NMEAL=[['b','Petit-déjeuner'],['l','Déjeuner'],['d','Dîner'],['s','Collations']];
const NMN={b:'Petit-déjeuner',l:'Déjeuner',d:'Dîner',s:'Collations'},NMTO={b:'au petit-déjeuner',l:'au déjeuner',d:'au dîner',s:'aux collations'};
const NGOAL={bulk:['Prise de masse sèche','Léger surplus pour gagner du muscle en limitant le gras',1.1,1.8,.25],maint:['Maintien','Garder ton poids actuel',1,1.8,.3],cut:['Sèche','Perdre du gras en gardant tes muscles',.8,2.2,.25]};
const NACT=[[1,'Très peu actif','Assis la plupart du temps',1.2],[2,'Peu actif','Un peu de marche chaque jour',1.3],[3,'Actif','Debout ou en mouvement une bonne partie de la journée',1.45],[4,'Très actif','Travail physique',1.6]];
let nutD='',nutH={m:'k',r:7},nutDraft=null,naS=null;
const r1=v=>Math.round(v*10)/10,nfmt=v=>fmtN(Math.round(v)),gfmt=v=>fmtN(r1(v));
const nrm=s=>String(s||'').toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae').normalize('NFD').replace(/[̀-ͯ]/g,'');
function nutLoad(){const n=obj(S.nut);n.goal=NGOAL[n.goal]?n.goal:'';n.sex=n.sex==='f'||n.sex==='h'?n.sex:'';n.age=Math.max(0,Math.min(110,+n.age||0));n.ht=Math.max(0,Math.min(250,+n.ht||0));n.act=[1,2,3,4].includes(+n.act)?+n.act:2;
  n.tf=n.tf===undefined||n.tf===''||!Number.isFinite(+n.tf)?null:Math.max(0,Math.min(14,+n.tf));n.auto=n.auto!==false;n.tgt=obj(n.tgt);n.tw=+n.tw||0;n.days=obj(n.days);n.fav=arr(n.fav);n.my=arr(n.my).filter(x=>x&&x.id&&x.n);n.meals=arr(n.meals).filter(m=>m&&m.n&&Array.isArray(m.it));n.rec=arr(n.rec).slice(0,16);S.nut=n}
/* ---- aliments ---- */
let NF=null;
function nfMap(){if(!NF){NF={};FOODS.forEach(x=>{NF[x[0]]={id:x[0],n:x[1],cat:x[2],k:x[3],p:x[4],c:x[5],f:x[6],fib:x[7],por:x[8],mic:x[9],q:x[10],pr:x[11]}})}return NF}
function nf(id){const b=nfMap()[id];if(b)return b;const u=S.nut.my.find(x=>x.id===id);return u?{id:u.id,n:u.n,cat:'my',k:+u.k||0,p:+u.p||0,c:+u.c||0,f:+u.f||0,fib:+u.fib||0,por:u.pg?[[u.pl||'1 portion',+u.pg]]:[],mic:'',q:'',pr:0,my:1}:null}
function itFood(it){const f=nf(it.f);if(f)return f;if(it.v)return{id:it.f,n:it.n||'Aliment',cat:'my',k:it.v[0],p:it.v[1],c:it.v[2],f:it.v[3],fib:it.v[4]||0,por:[],mic:'',q:'',pr:0,my:1,gone:1};return null}
function itv(it){const f=itFood(it),g=+it.g||0;if(!f)return{k:0,p:0,c:0,f:0,fib:0};return{k:f.k*g/100,p:f.p*g/100,c:f.c*g/100,f:f.f*g/100,fib:f.fib*g/100}}
const nAdd=(a,b)=>({k:a.k+b.k,p:a.p+b.p,c:a.c+b.c,f:a.f+b.f,fib:a.fib+b.fib}),N0={k:0,p:0,c:0,f:0,fib:0};
function nDay(d){return S.nut.days[d]||{b:[],l:[],d:[],s:[],w:0}}
function nDayW(d){let x=S.nut.days[d];if(!x){x={b:[],l:[],d:[],s:[],w:0};S.nut.days[d]=x}NMEAL.forEach(m=>{x[m[0]]=arr(x[m[0]])});return x}
function mealTot(d,m){return arr(nDay(d)[m]).reduce((a,it)=>nAdd(a,itv(it)),N0)}
function dayTot(d){return NMEAL.reduce((a,m)=>nAdd(a,mealTot(d,m[0])),N0)}
const dayHas=d=>{const x=S.nut.days[d];return !!x&&NMEAL.some(m=>arr(x[m[0]]).length)};
function nSave(){Object.keys(S.nut.days).forEach(d=>{const x=S.nut.days[d];if(!NMEAL.some(m=>arr(x[m[0]]).length)&&!(+x.w))delete S.nut.days[d]});save()}
/* ---- besoins : estimation de départ (Mifflin-St Jeor x activité), à ajuster selon le poids ---- */
function nutTf(){return S.nut.tf===null?(S.goal||3):S.nut.tf}
function nutCalc(src){const n=src||S.nut,w=src&&src.w?+src.w:lastBw(),g=NGOAL[n.goal];if(!g||!w||!n.age||!n.ht||!n.sex)return null;
  const bmr=10*w+6.25*n.ht-5*n.age+(n.sex==='f'?-161:5),tf=n.tf===null||n.tf===undefined?(S.goal||3):+n.tf,pal=Math.min(2,(NACT[(n.act||2)-1]||NACT[1])[3]+.025*tf),tdee=bmr*pal;
  const kcal=Math.round(tdee*g[2]/10)*10,p=Math.round(g[3]*w),f=Math.max(Math.round(.7*w),Math.round(kcal*g[4]/9)),c=Math.max(0,Math.round((kcal-p*4-f*9)/4));
  return{kcal,p,c,f,fib:Math.max(25,Math.round(kcal/1000*14)),wat:Math.round(w*35/100)*100,bmr:Math.round(bmr),tdee:Math.round(tdee),w,pal}}
function nutTgt(){const n=S.nut;if(!n.goal)return null;const c=nutCalc();if(n.auto)return c;const t=n.tgt,b=c||{kcal:2200,p:140,c:250,f:70,fib:30,wat:2500};
  return{kcal:+t.kcal||b.kcal,p:+t.p||b.p,c:+t.c||b.c,f:+t.f||b.f,fib:+t.fib||b.fib,wat:+t.wat||b.wat,man:1}}
const nutGoalLbl=()=>S.nut&&S.nut.goal?NGOAL[S.nut.goal][0]:'';
/* ---- le poids suit-il l'objectif ? (tendance sur 4 semaines) ---- */
function nutWeightCheck(){const g=S.nut&&S.nut.goal;if(!g)return null;const tr=bwTrend(28),w=lastBw();if(tr===null||!w)return null;const pc=tr/w*100,rate=sgn(r1(tr))+' kg par semaine';
  const R={bulk:[.1,.4],maint:[-.15,.15],cut:[-1,-.5]}[g];let st='in',txt='Dans ta cible : '+rate,tip='';
  if(pc<R[0]){st=g==='cut'?'fast':g==='bulk'?'slow':'down';txt=(g==='cut'?'Perte rapide : ':g==='bulk'?'Plus lent que prévu : ':'Ton poids baisse : ')+rate;tip=g==='cut'?'Si ça dure 2 à 3 semaines, ajoute environ 150 kcal par jour pour préserver tes muscles.':'Si ça dure 2 à 3 semaines, ajoute environ 150 kcal par jour.'}
  else if(pc>R[1]){st=g==='cut'?'slow':g==='bulk'?'fast':'up';txt=(g==='cut'?'Plus lent que prévu : ':g==='bulk'?'Plus rapide que prévu : ':'Ton poids monte : ')+rate;tip='Si ça dure 2 à 3 semaines, retire environ 150 kcal par jour.'}
  return{st,txt,tip,rate:tr}}
/* ---- visuels ---- */
function nRing(v,t,sz){const p=t?Math.min(1,v/t):0,C=2*Math.PI*42;return '<svg class="nring" viewBox="0 0 100 100" aria-hidden="true" style="width:'+sz+'px;height:'+sz+'px"><circle cx="50" cy="50" r="42" class="nrt"/><circle cx="50" cy="50" r="42" class="nrp'+(t&&v>t*1.05?' over':'')+'" stroke-dasharray="'+(C*p).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 50 50)"/></svg>'}
function nBar(lab,v,t,u){const p=t?Math.min(1,v/t):0;return '<div class="nbar"><div class="nbl"><span>'+lab+'</span><b>'+nfmt(v)+'<small> / '+nfmt(t)+' '+u+'</small></b></div><span class="nbt"><i style="width:'+(p*100).toFixed(1)+'%"></i></span></div>'}
function nutHead(){return !nutD||nutD===TK?'Aujourd\'hui':fmtDay(parse(nutD))}
function nutSlot(){const h=new Date().getHours();return h<10?'b':h<14?'l':h<18?'s':'d'}
/* ---- carte de l'accueil ---- */
function nutriCard(){if(!S.nut.goal)return '<button type="button" class="h7c nu7 empty7" data-nu="go"><span class="hcic">'+ico('nut')+'</span><div class="h7b"><p class="kick">Nutrition</p><b>Calories et macros</b><p>Choisis ton objectif (prise de masse sèche, maintien ou sèche) pour suivre tes repas.</p></div>'+ico('chev','hcv')+'</button>';
  const t=nutTgt();if(!t)return '<button type="button" class="h7c nu7 empty7" data-nu="go"><span class="hcic">'+ico('nut')+'</span><div class="h7b"><p class="kick">Nutrition</p><b>Complète ton profil</b><p>Âge, taille et poids pour estimer tes besoins.</p></div>'+ico('chev','hcv')+'</button>';
  const x=dayTot(TK),left=t.kcal-x.k;
  return '<div class="h7c nu7"><button type="button" class="nu7m" data-nu="go" aria-label="Ouvrir la nutrition"><span class="nu7r">'+nRing(x.k,t.kcal,64)+'<b>'+Math.round(Math.min(100,x.k/t.kcal*100))+'%</b></span><span class="h7b"><span class="kick">Nutrition</span><b>'+(left>=0?nfmt(left)+' kcal restantes':nfmt(-left)+' kcal au-dessus')+'</b><span class="nu7p">Protéines '+nfmt(x.p)+' / '+nfmt(t.p)+' g</span><span class="nbt sm"><i style="width:'+(Math.min(1,x.p/t.p)*100).toFixed(1)+'%"></i></span></span></button><button type="button" class="ib pw7a" data-nu="add" aria-label="Ajouter un aliment">'+ico('add')+'</button></div>'}
/* ---- page Nutrition ---- */
function renderNut(){const v=$('vNut');if(!v)return;if(!nutD||nutD>TK)nutD=TK;
  if(!S.nut.goal||!nutTgt()){if(!nutDraft)nutDraft=nDraft();v.innerHTML='<section class="panel wide nsu7"><h2 class="t">Ton objectif</h2><p class="nfs">L\'appli estime tes besoins pour démarrer. Tu pourras tout ajuster ensuite.</p><div id="nuForm">'+nFormHtml(nutDraft,0)+'</div><button type="button" class="btn nbig" data-nu="start">Commencer</button></section>';return}
  const t=nutTgt(),x=dayTot(nutD),day=nDay(nutD),left=t.kcal-x.k,w=+day.w||0;
  let h='<section class="panel wide nd7"><div class="ndh"><button type="button" class="ib" data-nu="prev" aria-label="Jour précédent">'+ico('left')+'</button><b>'+esc(nutHead())+'</b><button type="button" class="ib" data-nu="next" aria-label="Jour suivant"'+(nutD>=TK?' disabled':'')+'>'+ico('right')+'</button></div>'
   +'<div class="ndg"><div class="ndr">'+nRing(x.k,t.kcal,128)+'<span><b>'+nfmt(Math.abs(left))+'</b><small>'+(left>=0?'kcal restantes':'kcal au-dessus')+'</small></span></div><div class="ndb"><p class="ndk"><b>'+nfmt(x.k)+'</b> / '+nfmt(t.kcal)+' kcal</p>'+nBar('Protéines',x.p,t.p,'g')+nBar('Glucides',x.c,t.c,'g')+nBar('Lipides',x.f,t.f,'g')+'</div></div>'
   +'<div class="ndc"><span class="nch">Fibres <b>'+nfmt(x.fib)+' / '+nfmt(t.fib)+' g</b></span><span class="nch nw">'+ico('drop')+'Eau <b>'+gfmt(w/1000)+' / '+gfmt(t.wat/1000)+' L</b><button type="button" class="nwb" data-nu="w-" aria-label="Retirer 250 ml">−</button><button type="button" class="nwb" data-nu="w+" aria-label="Ajouter 250 ml">+</button></span></div></section>';
  h+='<section class="panel wide nj7"><h2 class="t">Journal</h2>'+NMEAL.map(m=>{const L=arr(day[m[0]]),mt=mealTot(nutD,m[0]);
    return '<div class="nml"><div class="nmh"><b>'+m[1]+'</b><span>'+(L.length?nfmt(mt.k)+' kcal':'')+'</span><button type="button" class="nadd" data-na="open:'+m[0]+'">'+ico('add')+'Ajouter</button></div>'
     +(L.length?'<div class="nits">'+L.map((it,i)=>{const f=itFood(it),vv=itv(it);return '<button type="button" class="nit" data-ne="'+m[0]+':'+i+'"><span class="nin">'+esc(f?f.n:'Aliment')+'<small>'+gfmt(it.g)+' g · P '+nfmt(vv.p)+' · G '+nfmt(vv.c)+' · L '+nfmt(vv.f)+'</small></span><b>'+nfmt(vv.k)+'</b></button>'}).join('')+'</div><button type="button" class="nsv" data-nm="save:'+m[0]+'">Enregistrer ce repas</button>':'')+'</div>'}).join('')+'</section>';
  const R=nutRemain(nutD);
  h+='<section class="panel wide ni7"><h2 class="t">Idées de repas</h2><p class="nfs">'+(R.k>=150?'Il te reste '+nfmt(R.k)+' kcal · P '+nfmt(Math.max(0,R.p))+' g · G '+nfmt(Math.max(0,R.c))+' g · L '+nfmt(Math.max(0,R.f))+' g.':'Tes objectifs du jour sont presque atteints.')+'</p><button type="button" class="btn ghost nbig" data-nu="ideas">Proposer des repas</button></section>';
  h+=nutHistHtml(t);
  h+='<section class="panel wide no7"><div class="nob"><div><p class="kick">Objectif</p><b>'+esc(nutGoalLbl())+'</b><p class="nfs">'+nfmt(t.kcal)+' kcal · P '+nfmt(t.p)+' g · G '+nfmt(t.c)+' g · L '+nfmt(t.f)+' g'+(t.man?' · objectifs personnalisés':' · calculé avec '+gfmt(t.w)+' kg')+'</p></div><button type="button" class="btn ghost sm" data-nu="goal">Modifier</button></div>'+nutTwHint()+'<button type="button" class="nlib" data-nu="lib">'+ico('search')+'<span><b>Bibliothèque d\'aliments</b><small>'+FOODS.length+' aliments entiers, critères de qualité, favoris</small></span>'+ico('chev','hcv')+'</button></section>';
  v.innerHTML=h}
function nutTwHint(){const n=S.nut,w=lastBw();if(n.auto||!n.tw||!w||Math.abs(w-n.tw)<2)return '';return '<p class="nhint">Ton poids a changé de '+sgn(r1(w-n.tw))+' kg depuis que tu as fixé tes objectifs. <button type="button" class="nlink" data-nu="auto">Recalculer</button></p>'}
function nutRemain(d){const t=nutTgt(),x=dayTot(d);return{k:t.kcal-x.k,p:t.p-x.p,c:t.c-x.c,f:t.f-x.f}}
/* ---- historique : calories ou protéines sur 7 ou 30 jours, moyennes, lien avec le poids ---- */
function nutHistHtml(t){const n=nutH.r,days=[];for(let i=n-1;i>=0;i--)days.push(key(add(T,-i)));const logged=days.filter(dayHas),m=nutH.m;
  const val=d=>{const x=dayTot(d);return m==='k'?x.k:x.p},tv=m==='k'?t.kcal:t.p,vals=days.map(d=>dayHas(d)?val(d):0),mx=Math.max(tv*1.25,...vals,1),W=300,H=110,bw=W/n;
  let bars='';days.forEach((d,i)=>{const v=vals[i],hh=v/mx*(H-16);bars+='<rect x="'+(i*bw+bw*.18).toFixed(1)+'" y="'+(H-hh).toFixed(1)+'" width="'+(bw*.64).toFixed(1)+'" height="'+Math.max(dayHas(d)?2:0,hh).toFixed(1)+'" rx="'+(n>7?1.5:4)+'" class="'+(d===nutD?'nhs':'nhb')+'"/>'});
  const ty=(H-tv/mx*(H-16)).toFixed(1),avg=logged.length?logged.reduce((a,d)=>a+val(d),0)/logged.length:0,ck=nutWeightCheck();
  const lab=n===7?'<div class="nhl">'+days.map(d=>'<span>'+esc(parse(d).toLocaleDateString(LOC(),{weekday:'narrow'}))+'</span>').join('')+'</div>':'';
  return '<section class="panel wide nh7"><h2 class="t">Historique</h2><div class="nhs2"><div class="seg" role="group" aria-label="Mesure"><button type="button" data-nh="m:k" aria-pressed="'+(m==='k')+'">Calories</button><button type="button" data-nh="m:p" aria-pressed="'+(m==='p')+'">Protéines</button></div><div class="seg" role="group" aria-label="Période"><button type="button" data-nh="r:7" aria-pressed="'+(n===7)+'">7 j</button><button type="button" data-nh="r:30" aria-pressed="'+(n===30)+'">30 j</button></div></div>'
   +'<svg class="nhc" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true">'+bars+'<line x1="0" x2="'+W+'" y1="'+ty+'" y2="'+ty+'" class="nht" vector-effect="non-scaling-stroke"/></svg>'+lab
   +'<p class="nfs">'+(logged.length?(logged.length>1?'Moyenne des '+logged.length+' jours notés : ':'Moyenne du jour noté : ')+'<b>'+nfmt(avg)+' '+(m==='k'?'kcal':'g de protéines')+'</b> pour un objectif de '+nfmt(tv)+'.':'Note tes repas : ta moyenne et l\'écart avec ton objectif apparaîtront ici.')+'</p>'
   +'<div class="nwk'+(ck?' st-'+ck.st:'')+'"><span class="hcic">'+ico('scale')+'</span><p>'+(ck?'<b>'+esc(ck.txt)+'</b>'+(ck.tip?' '+esc(ck.tip):''):'Pèse-toi 2 à 3 fois par semaine : l\'appli comparera l\'évolution de ton poids à ton objectif.')+'</p></div>'
   +(logged.length?'<div class="ndl">'+logged.slice(-7).reverse().map(d=>{const x=dayTot(d);return '<button type="button" class="ndi" data-nu="day:'+d+'"><span>'+esc(d===TK?'Aujourd\'hui':fmtDay(parse(d)))+'</span><b>'+nfmt(x.k)+' kcal</b><small>P '+nfmt(x.p)+' g</small></button>'}).join('')+'</div>':'')+'</section>'}
/* ---- formulaire objectif + profil (configuration et modification) ---- */
function nDraft(){const n=S.nut,w=lastBw();return{goal:n.goal||'',sex:n.sex||'',age:n.age||'',ht:n.ht||'',w:w||'',act:n.act||2,tf:n.tf===null?(S.goal||3):n.tf,auto:n.auto!==false,tgt:Object.assign({},n.tgt)}}
function nFormHtml(d,sheet){const c=nutCalc({goal:d.goal,sex:d.sex,age:+d.age,ht:+d.ht,w:+d.w,act:d.act,tf:d.tf});
  return '<div class="ngo">'+Object.keys(NGOAL).map(k=>'<button type="button" class="ngb" data-nd="goal:'+k+'" aria-pressed="'+(d.goal===k)+'"><b>'+NGOAL[k][0]+'</b><span>'+NGOAL[k][1]+'</span></button>').join('')+'</div>'
   +'<div class="nfg"><div class="nfl">Sexe<div class="nseg">'+[['h','Homme'],['f','Femme']].map(x=>'<button type="button" data-nd="sex:'+x[0]+'" aria-pressed="'+(d.sex===x[0])+'">'+x[1]+'</button>').join('')+'</div></div>'
   +'<label class="nfl">Âge<input type="number" inputmode="numeric" min="14" max="99" data-ni="age" value="'+esc(String(d.age||''))+'" placeholder="30"></label>'
   +'<label class="nfl">Taille (cm)<input type="number" inputmode="numeric" min="120" max="230" data-ni="ht" value="'+esc(String(d.ht||''))+'" placeholder="178"></label>'
   +'<label class="nfl">Poids (kg)<input type="number" inputmode="decimal" step="0.1" min="30" max="300" data-ni="w" value="'+esc(String(d.w||''))+'" placeholder="75"></label>'
   +'<label class="nfl">Séances par semaine<input type="number" inputmode="numeric" min="0" max="14" data-ni="tf" value="'+esc(String(d.tf))+'"></label></div>'
   +'<div class="nfl">Activité en dehors du sport<div class="nact">'+NACT.map(a=>'<button type="button" data-nd="act:'+a[0]+'" aria-pressed="'+(+d.act===a[0])+'"><b>'+a[1]+'</b><span>'+a[2]+'</span></button>').join('')+'</div></div>'
   +'<div class="nprev" id="nuPrev">'+nPrevHtml(c,d,sheet)+'</div>'}
function nPrevHtml(c,d,sheet){if(!c)return '<p class="nfs">Remplis ton objectif, ton sexe, ton âge, ta taille et ton poids pour voir l\'estimation.</p>';
  let h='<div class="npk"><span><b>'+nfmt(c.kcal)+'</b><small>kcal</small></span><span><b>'+c.p+'</b><small>g protéines</small></span><span><b>'+c.c+'</b><small>g glucides</small></span><span><b>'+c.f+'</b><small>g lipides</small></span></div><p class="nnote">Estimation de départ (formule de Mifflin-St Jeor : '+nfmt(c.bmr)+' kcal au repos, '+nfmt(c.tdee)+' kcal avec ton activité). Ce n\'est pas une valeur exacte : ajuste après 2 à 3 semaines selon ton poids et tes performances.</p>';
  if(sheet){const t=d.tgt||{};h+='<div class="nman"><button type="button" class="tglrow" data-nd="auto" aria-pressed="'+!d.auto+'"><span><b>Objectifs personnalisés</b>Saisis tes propres valeurs</span><i></i></button>'
   +(d.auto?'':'<div class="nfg">'+[['kcal','Calories (kcal)',c.kcal],['p','Protéines (g)',c.p],['c','Glucides (g)',c.c],['f','Lipides (g)',c.f],['fib','Fibres (g)',c.fib],['wat','Eau (ml)',c.wat]].map(x=>'<label class="nfl">'+x[1]+'<input type="number" inputmode="numeric" min="0" data-nt="'+x[0]+'" value="'+esc(String(t[x[0]]||x[2]))+'"></label>').join('')+'</div>')+'</div>'}
  return h}
function nFormRead(box,d){box.querySelectorAll('[data-ni]').forEach(i=>{d[i.dataset.ni]=String(i.value).replace(',','.')});box.querySelectorAll('[data-nt]').forEach(i=>{d.tgt[i.dataset.nt]=+i.value||0})}
function nFormCommit(d){const age=+d.age,ht=+d.ht,w=+String(d.w).replace(',','.'),tf=+d.tf;
  if(!d.goal){toast('Choisis ton objectif');return false}if(!d.sex){toast('Choisis homme ou femme');return false}
  if(!(age>=14&&age<=99)){toast('Entre un âge entre 14 et 99 ans');return false}if(!(ht>=120&&ht<=230)){toast('Entre une taille entre 120 et 230 cm');return false}
  if(!(w>=30&&w<=300)){toast('Entre un poids entre 30 et 300 kg');return false}if(!(tf>=0&&tf<=14)){toast('Entre un nombre de séances entre 0 et 14');return false}
  const n=S.nut;n.goal=d.goal;n.sex=d.sex;n.age=age;n.ht=ht;n.act=+d.act||2;n.tf=tf;
  if(Math.abs((lastBw()||0)-w)>=.05){S.bw=S.bw.filter(x=>x.d!==TK);S.bw.push({d:TK,v:r1(w)})} /* le poids va dans le suivi du poids : on ne le redemandera pas */
  n.auto=!!d.auto;if(!n.auto){const c=nutCalc();n.tgt={};['kcal','p','c','f','fib','wat'].forEach(k=>{n.tgt[k]=+d.tgt[k]||(c?c[k]:0)});n.tw=r1(w)}nSave();return true}
function nutGoalSheet(){nutDraft=nDraft();openSheet('<div class="nsh"><h2 class="t">Objectif et profil</h2><div id="nuForm">'+nFormHtml(nutDraft,1)+'</div><button type="button" class="btn nbig" data-nu="gsave">Enregistrer</button></div>')}
/* ---- ajout d'un aliment (recherche, favoris, repas enregistrés, nouvel aliment) ---- */
function nAll(){return Object.values(nfMap()).concat(S.nut.my.map(u=>nf(u.id)))}
function nSearch(q){const Q=nrm(q).trim();let L=nAll();if(Q){const words=Q.split(/\s+/);L=L.filter(f=>{const s=nrm(f.n)+' '+nrm(typeof trS==='function'?trS(f.n):'');return words.every(w=>s.includes(w))})}
  const fav=S.nut.fav,rec=S.nut.rec;return L.sort((a,b)=>(fav.includes(b.id)-fav.includes(a.id))||((rec.indexOf(a.id)+1||99)-(rec.indexOf(b.id)+1||99))||(b.pr-a.pr)||a.n.localeCompare(b.n,'fr'))}
function nRow(f){const fav=S.nut.fav.includes(f.id);return '<button type="button" class="nfr" data-na="pick:'+f.id+'"><span class="nfn">'+esc(f.n)+'<small>'+nfmt(f.k)+' kcal · P '+gfmt(f.p)+' · G '+gfmt(f.c)+' · L '+gfmt(f.f)+' (100 g)</small></span>'+(f.pr===2?'<i class="nq" title="À privilégier"></i>':'')+(fav?'<span class="nst on">'+ico('star2')+'</span>':'')+'</button>'}
function nutAdd(meal){naS={meal:meal||nutSlot(),tab:'all',q:'',sel:null,g:0};openSheet('<div class="nsh nash"><div class="nahd"><h2 class="t" id="naT"></h2><button type="button" class="ib" data-na="close" aria-label="Fermer">'+ico('close')+'</button></div><div id="naBody"></div></div>');naRender()}
function naRender(){const b=$('naBody');if(!b||!naS)return;$('naT').textContent='Ajouter '+NMTO[naS.meal];
  if(naS.sel){b.innerHTML=naQtyHtml();return}
  const tabs=[['all','Aliments'],['fav','Favoris'],['meals','Repas'],['new','Nouveau']];
  let h='<div class="nmsel">'+NMEAL.map(m=>'<button type="button" data-na="meal:'+m[0]+'" aria-pressed="'+(naS.meal===m[0])+'">'+m[1]+'</button>').join('')+'</div><div class="seg full ntab">'+tabs.map(t=>'<button type="button" data-na="tab:'+t[0]+'" aria-pressed="'+(naS.tab===t[0])+'">'+t[1]+'</button>').join('')+'</div>';
  if(naS.tab==='all')h+='<label class="nsrch">'+ico('search')+'<input type="search" id="naQ" placeholder="Œufs, riz, sardines…" autocomplete="off" value="'+esc(naS.q)+'"></label><div id="naList">'+naListHtml()+'</div>';
  else if(naS.tab==='fav'){const L=S.nut.fav.map(nf).filter(Boolean);h+='<div id="naList">'+(L.length?L.map(nRow).join(''):'<p class="nfs nempty">Touche l\'étoile d\'un aliment pour le retrouver ici.</p>')+'</div>'}
  else if(naS.tab==='meals')h+='<div id="naList">'+(S.nut.meals.length?S.nut.meals.map(m=>{const t=m.it.reduce((a,it)=>nAdd(a,itv(it)),N0);return '<div class="nmr"><button type="button" class="nfr" data-nm="use:'+m.id+'"><span class="nfn">'+esc(m.n)+'<small>'+m.it.length+' aliment'+(m.it.length>1?'s':'')+' · '+nfmt(t.k)+' kcal · P '+nfmt(t.p)+' g</small></span></button><button type="button" class="ib" data-nm="del:'+m.id+'" aria-label="Supprimer ce repas">'+ico('trash')+'</button></div>'}).join(''):'<p class="nfs nempty">Dans le journal, touche « Enregistrer ce repas » sous un repas pour le réutiliser en un geste.</p>')+'</div>';
  else h+=naNewHtml();
  b.innerHTML=h}
function naListHtml(){const L=nSearch(naS.q);if(!L.length)return '<p class="nfs nempty">Aucun aliment trouvé. Ajoute-le dans « Nouveau » avec les valeurs de l\'étiquette.</p>';
  if(naS.q.trim())return L.slice(0,60).map(nRow).join('');
  const rec=S.nut.rec.map(nf).filter(Boolean).slice(0,6);let h=rec.length?'<p class="ncat">Récents</p>'+rec.map(nRow).join(''):'';
  Object.keys(NCAT).concat(['my']).forEach(c=>{const G=L.filter(f=>f.cat===c);if(G.length)h+='<p class="ncat">'+(c==='my'?'Mes aliments':NCAT[c])+'</p>'+G.map(nRow).join('')});return h}
function naQtyHtml(){const f=nf(naS.sel);if(!f)return '';const g=naS.g||(f.por[0]?f.por[0][1]:100),v={k:f.k*g/100,p:f.p*g/100,c:f.c*g/100,f:f.f*g/100},fav=S.nut.fav.includes(f.id);
  return '<button type="button" class="nback" data-na="back">'+ico('left')+'Retour</button><div class="nqh"><b>'+esc(f.n)+'</b><button type="button" class="ib nstb'+(fav?' on':'')+'" data-na="fav:'+f.id+'" aria-label="Favori" aria-pressed="'+fav+'">'+ico('star2')+'</button></div>'
   +'<p class="nfs">Pour 100 g : '+nfmt(f.k)+' kcal · P '+gfmt(f.p)+' g · G '+gfmt(f.c)+' g · L '+gfmt(f.f)+' g'+(f.fib?' · fibres '+gfmt(f.fib)+' g':'')+'</p>'
   +'<div class="npc">'+f.por.concat([['100 g',100]]).map(p=>'<button type="button" data-na="por:'+p[1]+'" aria-pressed="'+(Math.abs(g-p[1])<.01)+'">'+esc(p[0])+(p[0]!=='100 g'?' <small>'+gfmt(p[1])+' g</small>':'')+'</button>').join('')+'</div>'
   +'<label class="nfl">Quantité (g)<input type="number" inputmode="decimal" step="1" min="1" max="3000" id="naG" value="'+String(r1(g))+'"></label>'
   +'<div class="ntot" id="naTot">'+naTotHtml(v)+'</div><div class="nqa"><button type="button" class="btn nbig" data-na="add">Ajouter '+NMTO[naS.meal]+'</button>'+(f.my?'':'<button type="button" class="nlink" data-nf="'+f.id+'">Voir la fiche et les critères de qualité</button>')+'</div>'}
const naTotHtml=v=>'<span><b>'+nfmt(v.k)+'</b><small>kcal</small></span><span><b>'+gfmt(v.p)+'</b><small>g P</small></span><span><b>'+gfmt(v.c)+'</b><small>g G</small></span><span><b>'+gfmt(v.f)+'</b><small>g L</small></span>';
function naNewHtml(){return '<div class="nnew"><p class="nfs">Recopie les valeurs pour 100 g de l\'étiquette : l\'aliment sera gardé dans « Mes aliments ».</p><label class="nfl">Nom<input id="nnN" maxlength="60" autocomplete="off" placeholder="Sardines de ma marque"></label><div class="nfg">'
  +[['k','Calories (kcal)'],['p','Protéines (g)'],['c','Glucides (g)'],['f','Lipides (g)'],['fib','Fibres (g, facultatif)']].map(x=>'<label class="nfl">'+x[1]+'<input type="number" inputmode="decimal" step="0.1" min="0" id="nn'+x[0]+'"></label>').join('')
  +'<label class="nfl">Portion (facultatif)<input id="nnPl" maxlength="30" placeholder="1 boîte"></label><label class="nfl">Poids de la portion (g)<input type="number" inputmode="decimal" min="0" id="nnPg"></label></div><p class="nhint" id="nnW" hidden></p><button type="button" class="btn nbig" data-na="create">Enregistrer l\'aliment</button></div>'}
function naCreate(){const g=id=>parseFloat(String(($(id)||{}).value||'').replace(',','.')),n=String($('nnN').value||'').trim(),k=g('nnk'),p=g('nnp')||0,c=g('nnc')||0,f=g('nnf')||0,fib=g('nnfib')||0,pg=g('nnPg')||0;
  if(!n){toast('Donne un nom à l\'aliment');return}if(!(k>=0&&k<=900)){toast('Entre des calories entre 0 et 900 pour 100 g');return}if([p,c,f,fib].some(x=>x<0)||p+c+f>100){toast('Vérifie les valeurs : le total des macros dépasse 100 g');return}
  const est=p*4+c*4+f*9,w=$('nnW');if(k>40&&Math.abs(est-k)/k>.25&&w.hidden){w.hidden=false;w.textContent='Les calories ne collent pas avec les macros ('+nfmt(est)+' kcal calculées). Vérifie l\'étiquette, puis touche à nouveau « Enregistrer » si c\'est correct.';return}
  const u={id:'u'+Date.now().toString(36),n,k,p,c,f,fib};if(pg>0){u.pg=pg;u.pl=String($('nnPl').value||'').trim()||'1 portion'}S.nut.my.push(u);nSave();naS.sel=u.id;naS.g=0;naRender();toast('Aliment enregistré')}
function naAddItem(){const f=nf(naS.sel),g=parseFloat(String($('naG').value).replace(',','.'));if(!f)return;if(!(g>0&&g<=3000)){toast('Entre une quantité entre 1 et 3000 g');return}
  const it={f:f.id,g:r1(g)};if(f.my){it.n=f.n;it.v=[f.k,f.p,f.c,f.f,f.fib]}nDayW(nutD)[naS.meal].push(it);S.nut.rec=[f.id].concat(S.nut.rec.filter(x=>x!==f.id)).slice(0,16);nSave();
  toast('Ajouté');naS.sel=null;naS.g=0;naS.q='';naRender();nutRefresh()}
function nutRefresh(){if(curV==='nut')renderNut();if(curV==='home')renderHome()}
/* ---- modifier un aliment du journal ---- */
function nutEdit(m,i){const it=arr(nDay(nutD)[m])[i];if(!it)return;const f=itFood(it);if(!f)return;const fav=S.nut.fav.includes(f.id),v=itv(it);
  openSheet('<div class="nsh"><div class="nqh"><b>'+esc(f.n)+'</b>'+(f.gone?'':'<button type="button" class="ib nstb'+(fav?' on':'')+'" data-ed="fav" aria-label="Favori" aria-pressed="'+fav+'">'+ico('star2')+'</button>')+'</div><p class="nfs"><span>'+NMN[m]+'</span><span> · </span><span>'+esc(nutHead())+'</span></p>'
   +(f.por&&f.por.length?'<div class="npc">'+f.por.map(p=>'<button type="button" data-ed="por:'+p[1]+'">'+esc(p[0])+' <small>'+gfmt(p[1])+' g</small></button>').join('')+'</div>':'')
   +'<label class="nfl">Quantité (g)<input type="number" inputmode="decimal" step="1" min="1" max="3000" id="edG" value="'+String(it.g)+'"></label><div class="ntot" id="edTot">'+naTotHtml(v)+'</div>'
   +'<div class="nqa"><button type="button" class="btn nbig" data-ed="save">Enregistrer</button><button type="button" class="btn ghost nbig ndel" data-ed="del">'+ico('trash')+'Retirer du journal</button></div></div>');
  $('gbox').dataset.ed=m+':'+i}
/* ---- fiche d'un aliment (bibliothèque) ---- */
function nutFood(id){const f=nf(id);if(!f)return;const q=NQ[f.q],fav=S.nut.fav.includes(f.id);
  openSheet('<div class="nsh"><div class="nqh"><b>'+esc(f.n)+'</b><button type="button" class="ib nstb'+(fav?' on':'')+'" data-nf2="fav:'+f.id+'" aria-label="Favori" aria-pressed="'+fav+'">'+ico('star2')+'</button></div><p class="kick"><span>'+esc(f.my?'Mes aliments':NCAT[f.cat])+'</span>'+(f.pr===2?'<span> · </span><span>à privilégier</span>':'')+'</p>'
   +'<div class="nft"><span><b>'+nfmt(f.k)+'</b><small>kcal</small></span><span><b>'+gfmt(f.p)+'</b><small>g protéines</small></span><span><b>'+gfmt(f.c)+'</b><small>g glucides</small></span><span><b>'+gfmt(f.f)+'</b><small>g lipides</small></span><span><b>'+gfmt(f.fib)+'</b><small>g fibres</small></span></div><p class="nnote">Valeurs moyennes pour 100 g'+(f.my?' (ton étiquette)':' (tables CIQUAL et USDA), approximatives selon le produit et la cuisson')+'.</p>'
   +(f.mic?'<h5 class="h5">Micronutriments intéressants</h5><p class="nfs">'+esc(f.mic)+'</p>':'')
   +(q?'<h5 class="h5">Bien le choisir</h5><ul class="nql">'+q.c.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+(q.l?'<p class="nlab">'+ico('info')+esc(q.l)+'</p>':''):'')
   +(f.por.length?'<h5 class="h5">Portions</h5><p class="nfs">'+f.por.map(p=>'<span>'+esc(p[0])+'</span> ≈ '+gfmt(p[1])+' g').join(' · ')+'</p>':'')
   +'<div class="nqa"><button type="button" class="btn nbig" data-nf2="add:'+f.id+'">Ajouter au journal</button>'+(f.my?'<button type="button" class="btn ghost nbig ndel" data-nf2="del:'+f.id+'">'+ico('trash')+'Supprimer de mes aliments</button>':'')+'</div></div>')}
function nutLib(){naS={meal:nutSlot(),tab:'all',q:'',sel:null,g:0,lib:1};openSheet('<div class="nsh nash"><div class="nahd"><h2 class="t">Bibliothèque d\'aliments</h2><button type="button" class="ib" data-na="close" aria-label="Fermer">'+ico('close')+'</button></div><label class="nsrch">'+ico('search')+'<input type="search" id="naQ" placeholder="Rechercher un aliment" autocomplete="off"></label><p class="nfs nlegend"><i class="nq"></i> à privilégier : aliments entiers, peu transformés</p><div id="naList">'+naListHtml().replace(/data-na="pick:/g,'data-nf="')+'</div></div>')}
/* ---- idées de repas : quantités calculées pour coller aux macros restantes ---- */
function nutMealTarget(m,full){const R=nutRemain(nutD),t=nutTgt(),T0={k:Math.max(0,R.k),p:Math.max(0,R.p),c:Math.max(0,R.c),f:Math.max(0,R.f)};if(full)return T0;
  if(m==='s'){const s=T0.k>0?Math.min(1,t.kcal*.15/T0.k):0;return{k:T0.k*s,p:T0.p*s,c:T0.c*s,f:T0.f*s}}
  const day=nDay(nutD),order=['b','l','d'],left=order.slice(order.indexOf(m)).filter(x=>!arr(day[x]).length||x===m).length||1;return{k:T0.k/left,p:T0.p/left,c:T0.c/left,f:T0.f/left}}
function genMeals(T,m){const sq=x=>x*x,out=[];
  NMEALS.forEach(tp=>{if(m&&!tp[1].includes(m))return;const items=tp[2],vars=items.map(x=>{const a=[];if(x[3]>0&&x[2]>x[1]){for(let g=x[1];g<=x[2]+.001;g+=x[3])a.push(g)}else a.push(x[1]);return a});
    let best=null;const idx=vars.map(()=>0);
    for(;;){let k=0,p=0,c=0,f=0,fib=0;items.forEach((x,i)=>{const F=nf(x[0]),g=vars[i][idx[i]];k+=F.k*g/100;p+=F.p*g/100;c+=F.c*g/100;f+=F.f*g/100;fib+=F.fib*g/100});
      const e=sq((p-T.p)/Math.max(T.p,15))*1.6+sq((c-T.c)/Math.max(T.c,20))+sq((f-T.f)/Math.max(T.f,10))+sq((k-T.k)/Math.max(T.k,150))*1.2+(k>T.k*1.1?sq((k-T.k*1.1)/Math.max(T.k,150))*3:0);
      if(!best||e<best.e)best={e,k,p,c,f,fib,g:idx.map((j,i)=>vars[i][j])};
      let i=0;while(i<idx.length){idx[i]++;if(idx[i]<vars[i].length)break;idx[i]=0;i++}if(i===idx.length)break}
    const it=items.map((x,i)=>({f:x[0],g:best.g[i]})).filter(x=>x.g>0);out.push(Object.assign(best,{n:tp[0],it}))});
  return out.sort((a,b)=>a.e-b.e).slice(0,4)}
function nQual(M){const F=M.it.map(x=>nf(x.f)),b=[];if(F.every(f=>f.pr===2))b.push('Aliments bruts');if(M.p>=30)b.push('Riche en protéines');if(M.fib>=7)b.push('Fibres');if(M.it.some(x=>['sardine_huile','saumon_sauvage','saumon_elevage','maquereau','hareng'].includes(x.f)))b.push('Oméga-3');
  const veg=F.some(f=>f.cat==='leg'||f.cat==='fru');return{b,lab:F.every(f=>f.pr===2)&&veg?'très bonne':F.every(f=>f.pr>=1)?'bonne':'correcte'}}
function nutIdeas(m,full){m=m||nutSlot();const T=nutMealTarget(m,full),LIST=T.k<120?[]:genMeals(T,m);
  let h='<div class="nsh"><div class="nahd"><h2 class="t">Idées de repas</h2><button type="button" class="ib" data-na="close" aria-label="Fermer">'+ico('close')+'</button></div><div class="nmsel">'+NMEAL.map(x=>'<button type="button" data-ni2="m:'+x[0]+'" aria-pressed="'+(m===x[0])+'">'+x[1]+'</button>').join('')+'</div>'
   +'<button type="button" class="tglrow" data-ni2="full:'+m+'" aria-pressed="'+!!full+'"><span><b>Tout ce qui reste aujourd\'hui</b>Sinon : la part de ce repas</span><i></i></button>';
  if(T.k<120)h+='<p class="nfs nempty">Il te reste très peu pour '+(full?'aujourd\'hui':'ce repas')+' : un fruit ou un yaourt nature suffit.</p>';
  else{h+='<p class="nfs">Objectif : ~'+nfmt(T.k)+' kcal · P '+nfmt(T.p)+' g · G '+nfmt(T.c)+' g · L '+nfmt(T.f)+' g</p>';
    h+=LIST.map((M,i)=>{const q=nQual(M),dk=Math.round(M.k-T.k);return '<div class="nid"><b>'+esc(M.n)+'</b><ul>'+M.it.map(x=>{const F=nf(x.f),ne=Math.max(1,Math.round(x.g/50)),eggs=x.f==='oeuf'?'<span> (</span><span>'+ne+' œuf'+(ne>1?'s':'')+'</span><span>)</span>':'';return '<li><span><span>'+esc(F.n)+'</span>'+eggs+'</span><b>'+gfmt(x.g)+' g</b></li>'}).join('')+'</ul>'
      +'<div class="ntot sm"><span><b>'+nfmt(M.k)+'</b><small>kcal</small></span><span><b>'+nfmt(M.p)+'</b><small>g P</small></span><span><b>'+nfmt(M.c)+'</b><small>g G</small></span><span><b>'+nfmt(M.f)+'</b><small>g L</small></span></div>'
      +'<p class="nfs"><span>'+(Math.abs(dk)<=60?'Proche de l\'objectif':(dk>0?'+':'−')+nfmt(Math.abs(dk))+' kcal par rapport à l\'objectif')+'</span><span> · </span><span>qualité '+q.lab+'</span></p>'+(q.b.length?'<div class="nbd">'+q.b.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>':'')
      +'<button type="button" class="btn ghost nbig" data-ni2="add:'+m+':'+i+'">Ajouter '+NMTO[m]+'</button></div>'}).join('');
    if(LIST.length&&LIST.every(M=>M.k<T.k-400))h+='<p class="nhint">Il te reste beaucoup pour un seul repas : complète avec une collation (yaourt grec, fruits, noix).</p>';
    h+='<p class="nnote">Valeurs approximatives : elles varient selon les marques et la cuisson. Grammes de viande et de poisson crus, féculents cuits sauf mention.</p>'}
  openSheet(h+'</div>');$('gbox')._ideas={m,full,list:LIST}}
/* ---- événements ---- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-nu],[data-na],[data-ne],[data-nm],[data-nh],[data-nd],[data-ed],[data-nf],[data-nf2],[data-ni2]');if(!b)return;const d=b.dataset;
  if(d.nu){const a=d.nu;
    if(a==='go'){if(location.hash==='#nutrition')route();else location.hash='#nutrition';return}
    if(a==='add'){nutD=TK;nutAdd(nutSlot());return}
    if(a==='prev'){nutD=key(add(parse(nutD||TK),-1));renderNut();setHead();return}
    if(a==='next'){if(nutD<TK){nutD=key(add(parse(nutD),1));renderNut();setHead()}return}
    if(a.startsWith('day:')){nutD=a.slice(4);renderNut();setHead();scrollTo({top:0,behavior:'smooth'});return}
    if(a==='w+'||a==='w-'){const x=nDayW(nutD);x.w=Math.max(0,(+x.w||0)+(a==='w+'?250:-250));nSave();renderNut();return}
    if(a==='ideas'){nutIdeas(nutSlot(),false);return}
    if(a==='goal'){nutGoalSheet();return}
    if(a==='lib'){nutLib();return}
    if(a==='auto'){S.nut.auto=true;nSave();renderNut();toast('Objectifs recalculés');return}
    if(a==='start'){const box=$('nuForm');nFormRead(box,nutDraft);if(nFormCommit(nutDraft)){nutDraft=null;renderNut();scrollTo(0,0);toast('Objectifs prêts')}return}
    if(a==='gsave'){const box=$('nuForm');nFormRead(box,nutDraft);if(nFormCommit(nutDraft)){nutDraft=null;closeSheet();nutRefresh();toast('Objectifs enregistrés')}return}
    return}
  if(d.nd){const box=$('nuForm');if(!box||!nutDraft)return;nFormRead(box,nutDraft);const [k,v]=d.nd.split(':');if(k==='auto')nutDraft.auto=!nutDraft.auto;else nutDraft[k]=k==='act'?+v:v;box.innerHTML=nFormHtml(nutDraft,!!box.closest('#gsheet'));return}
  if(d.nh){const [k,v]=d.nh.split(':');nutH[k]=k==='r'?+v:v;renderNut();return}
  if(d.ne){const [m,i]=d.ne.split(':');nutEdit(m,+i);return}
  if(d.nm){const [k,v]=d.nm.split(':');
    if(k==='save'){const L=arr(nDay(nutD)[v]);if(!L.length)return;openSheet('<div class="nsh"><h2 class="t">Enregistrer ce repas</h2><p class="nfs">'+L.length+' aliment'+(L.length>1?'s':'')+' · '+nfmt(mealTot(nutD,v).k)+' kcal. Tu le retrouveras dans « Ajouter » › « Repas ».</p><label class="nfl">Nom<input id="nmN" maxlength="40" value="'+esc(trS(NMN[v]==='Collations'?'Ma collation':'Mon '+NMN[v].toLowerCase()))+'"></label><button type="button" class="btn nbig" data-nm="ok:'+v+'">Enregistrer</button></div>');return}
    if(k==='ok'){const n=String($('nmN').value||'').trim();if(!n){toast('Donne un nom au repas');return}S.nut.meals.push({id:'m'+Date.now().toString(36),n,it:arr(nDay(nutD)[v]).map(it=>Object.assign({},it))});nSave();closeSheet();toast('Repas enregistré');return}
    if(k==='use'){const M=S.nut.meals.find(x=>x.id===v);if(!M||!naS)return;const L=nDayW(nutD)[naS.meal];M.it.forEach(it=>L.push(Object.assign({},it)));nSave();toast('Ajouté');closeSheet();nutRefresh();return}
    if(k==='del'){S.nut.meals=S.nut.meals.filter(x=>x.id!==v);nSave();naRender();return}
    return}
  if(d.na){const [k,v]=d.na.split(':');if(k==='open'){nutAdd(v);return}if(!naS&&k!=='close')return;
    if(k==='close'){closeSheet();naS=null;return}
    if(k==='meal'){naS.meal=v;naRender();return}
    if(k==='tab'){naS.tab=v;naRender();return}
    if(k==='pick'){naS.sel=v;naS.g=0;naRender();return}
    if(k==='back'){naS.sel=null;naRender();return}
    if(k==='por'){naS.g=+v;naRender();return}
    if(k==='fav'){S.nut.fav=S.nut.fav.includes(v)?S.nut.fav.filter(x=>x!==v):S.nut.fav.concat(v);nSave();naRender();return}
    if(k==='add'){naAddItem();return}
    if(k==='create'){naCreate();return}
    return}
  if(d.ed){const [m,i]=($('gbox').dataset.ed||':').split(':'),L=arr(nDay(nutD)[m]),it=L[+i];if(!it)return;const [k,v]=d.ed.split(':');
    if(k==='por'){$('edG').value=v;$('edG').dispatchEvent(new Event('input',{bubbles:true}));return}
    if(k==='fav'){const f=it.f;S.nut.fav=S.nut.fav.includes(f)?S.nut.fav.filter(x=>x!==f):S.nut.fav.concat(f);nSave();b.classList.toggle('on');b.setAttribute('aria-pressed',String(S.nut.fav.includes(f)));return}
    if(k==='save'){const g=parseFloat(String($('edG').value).replace(',','.'));if(!(g>0&&g<=3000)){toast('Entre une quantité entre 1 et 3000 g');return}it.g=r1(g);nSave();closeSheet();nutRefresh();return}
    if(k==='del'){L.splice(+i,1);nSave();closeSheet();nutRefresh();toast('Retiré du journal');return}
    return}
  if(d.nf){nutFood(d.nf);return}
  if(d.nf2){const [k,v]=d.nf2.split(':');
    if(k==='fav'){S.nut.fav=S.nut.fav.includes(v)?S.nut.fav.filter(x=>x!==v):S.nut.fav.concat(v);nSave();b.classList.toggle('on');b.setAttribute('aria-pressed',String(S.nut.fav.includes(v)));return}
    if(k==='add'){nutD=nutD||TK;naS={meal:nutSlot(),tab:'all',q:'',sel:v,g:0};openSheet('<div class="nsh nash"><div class="nahd"><h2 class="t" id="naT"></h2><button type="button" class="ib" data-na="close" aria-label="Fermer">'+ico('close')+'</button></div><div id="naBody"></div></div>');naRender();return}
    if(k==='del'){S.nut.my=S.nut.my.filter(x=>x.id!==v);S.nut.fav=S.nut.fav.filter(x=>x!==v);nSave();closeSheet();toast('Aliment supprimé');return}
    return}
  if(d.ni2){const [k,v,w]=d.ni2.split(':'),I=$('gbox')._ideas||{};
    if(k==='m'){nutIdeas(v,I.full);return}
    if(k==='full'){nutIdeas(v,!I.full);return}
    if(k==='add'){const M=(I.list||[])[+w];if(!M)return;const L=nDayW(nutD)[v];M.it.forEach(x=>L.push({f:x.f,g:x.g}));nSave();closeSheet();nutRefresh();toast('Repas ajouté '+NMTO[v]);return}}});
document.addEventListener('input',e=>{const t=e.target;
  if(t.id==='naQ'&&naS){naS.q=t.value;const l=$('naList');if(l)l.innerHTML=naS.lib?naListHtml().replace(/data-na="pick:/g,'data-nf="'):naListHtml();return}
  if(t.id==='naG'&&naS){const f=nf(naS.sel),g=parseFloat(String(t.value).replace(',','.'))||0;naS.g=g;if(f)$('naTot').innerHTML=naTotHtml({k:f.k*g/100,p:f.p*g/100,c:f.c*g/100,f:f.f*g/100});return}
  if(t.id==='edG'){const [m,i]=($('gbox').dataset.ed||':').split(':'),it=arr(nDay(nutD)[m])[+i];if(!it)return;const g=parseFloat(String(t.value).replace(',','.'))||0;$('edTot').innerHTML=naTotHtml(itv({f:it.f,g,v:it.v,n:it.n}));return}
  if(t.dataset&&(t.dataset.ni||t.dataset.nt)&&nutDraft){const box=t.closest('#nuForm');if(!box)return;nFormRead(box,nutDraft);const c=nutCalc({goal:nutDraft.goal,sex:nutDraft.sex,age:+nutDraft.age,ht:+nutDraft.ht,w:+nutDraft.w,act:nutDraft.act,tf:nutDraft.tf});if(t.dataset.ni){const p=$('nuPrev');if(p)p.innerHTML=nPrevHtml(c,nutDraft,!!box.closest('#gsheet'))}}});
