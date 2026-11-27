/* ===================== v7.2 : Mesures ; v7.4 : tour de bras (gauche, droit), distance claviculaire, taille =====================
   Premier sous-onglet de Progrès (#mesures). Un espace de suivi, sans conseil :
   dernières mesures, ajout en un geste, consigne de pesée, courbe dans le temps, historique modifiable.
   Données : S.bw [{d,v}] (kg) ; S.meas.taille, brasG, brasD, clav [{d,v}] (cm) ; S.meas.haut [{d,v}] (m).
   S.meas.bras (ancien tour de bras sans côté, v6) reste lu et affiché (« sans côté »). */
const MZP=[[30,'1 mois'],[91,'3 mois'],[182,'6 mois'],[365,'1 an'],[0,'Tout']];
let mzM='poids',mzP=91,mzAll=false;
const MZTIP='Pèse-toi le matin à jeun, après être allé aux toilettes et avant de manger ou de boire.';
/* champs : clé, nom, unité, min, max, pas (saisie et modification) */
const MZF=[['w','Poids','kg',20,400,.1,'Entre un poids entre 20 et 400 kg'],['t','Tour de taille','cm',40,200,.5,'Entre un tour de taille entre 40 et 200 cm'],['bg','Bras gauche','cm',15,80,.5,'Entre un tour de bras gauche entre 15 et 80 cm'],['bd','Bras droit','cm',15,80,.5,'Entre un tour de bras droit entre 15 et 80 cm'],['c','Distance claviculaire','cm',20,70,.5,'Entre une distance claviculaire entre 20 et 70 cm'],['h','Taille','m',1,2.5,.01,'Entre ta taille en mètres, par exemple 1,75']]; /* + message d'erreur complet (traduisible) */
const MZKEY={t:'taille',bg:'brasG',bd:'brasD',c:'clav',h:'haut',b:'bras'};
const mzSer=k=>k==='w'?S.bw:arr(S.meas[MZKEY[k]]);
function mzPut(k,L){if(k==='w')S.bw=L;else S.meas[MZKEY[k]]=L}
const mzSorted=k=>mzSer(k).slice().sort((a,b)=>a.d<b.d?-1:1);
const mzFmt=(k,v)=>k==='h'?(Math.round(v*100)/100).toFixed(2).replace('.',DEC()):fmtN(v);
/* vues de la courbe : clé, nom, séries [clé, légende] */
const MZV=[['poids','Poids',[['w','']]],['taille','Tour de taille',[['t','']]],['bras','Bras',[['bg','Gauche'],['bd','Droit'],['b','Sans côté']]],['clav','Clavicule',[['c','']]],['haut','Taille (hauteur)',[['h','']]]];
function mzRows(){const m={};['w','t','bg','bd','c','h','b'].forEach(k=>mzSer(k).forEach(x=>{(m[x.d]=m[x.d]||{d:x.d})[k]=x.v}));return Object.values(m).sort((a,b)=>a.d<b.d?1:-1)}
const mzD=d=>parse(d).toLocaleDateString(LOC(),{weekday:'short',day:'numeric',month:'short'});
const mzDl=d=>parse(d).toLocaleDateString(LOC(),{day:'numeric',month:'long',year:parse(d).getFullYear()===T.getFullYear()?undefined:'numeric'});
function mzAgo(d){const n=Math.round((parse(TK)-parse(d))/864e5);return n===0?'aujourd\'hui':n===1?'hier':'il y a '+n+' jours'}
/* courbe dans le temps (l'axe suit les dates, pas l'ordre des mesures) ; v7.4 : plusieurs séries (bras gauche et droit) */
function mzChart(SR,k){const box=$('mzC');if(!box)return;const s=box.querySelector('svg');const draw=()=>{const W=s.clientWidth,H=s.clientHeight;if(!W||!H)return;const all=[].concat(...SR.map(x=>x.L));if(all.length<2){s.innerHTML='';return}
  const t=x=>parse(x.d).getTime(),t0=Math.min(...all.map(t)),t1=Math.max(...all.map(t)),span=Math.max(864e5,t1-t0),f=v=>mzFmt(k,v);let mn=Math.min(...all.map(x=>x.v)),mx=Math.max(...all.map(x=>x.v));const g0=k==='h'?.02:1;if(mx-mn<g0){const c=(mx+mn)/2;mn=c-g0/2;mx=c+g0/2}const pd=(mx-mn)*.2;mn-=pd;mx+=pd;
  const l=40,r=14,tp=22,b=24,X=x=>l+(t(x)-t0)/span*(W-l-r),Y=v=>tp+(H-tp-b)*(1-(v-mn)/(mx-mn));let g='<defs><linearGradient id="mzG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acct);stop-opacity:.28"/><stop offset="1" style="stop-color:var(--acct);stop-opacity:0"/></linearGradient></defs>';
  [0,1,2,3].forEach(q=>{const v=mn+(mx-mn)*q/3;g+='<line x1="'+l+'" x2="'+(W-r)+'" y1="'+Y(v).toFixed(1)+'" y2="'+Y(v).toFixed(1)+'" style="stroke:var(--line)"/><text x="'+(l-6)+'" y="'+(Y(v)+4).toFixed(1)+'" text-anchor="end">'+f(v)+'</text>'});
  const n=Math.min(5,Math.max(2,Math.floor((W-l-r)/70)));for(let i=0;i<n;i++){const tt=t0+span*i/(n-1),d=new Date(tt);g+='<text x="'+(l+(W-l-r)*i/(n-1)).toFixed(1)+'" y="'+(H-6)+'" text-anchor="'+(i===0?'start':i===n-1?'end':'middle')+'">'+esc(d.toLocaleDateString(LOC(),{day:'numeric',month:'short'}).replace('.',''))+'</text>'}
  const pts=[];SR.forEach((sr,si)=>{const L=sr.L;if(!L.length)return;const path=L.map((x,i)=>(i?'L':'M')+X(x).toFixed(1)+' '+Y(x.v).toFixed(1)).join(''),col=si===0?'var(--acct)':si===1?'var(--ink)':'var(--mute)';
    if(si===0&&L.length>1)g+='<path d="'+path+'L'+X(L[L.length-1]).toFixed(1)+' '+(H-b)+'L'+X(L[0]).toFixed(1)+' '+(H-b)+'Z" fill="url(#mzG)"/>';
    if(L.length>1)g+='<path d="'+path+'" fill="none" style="stroke:'+col+'" stroke-width="'+(si?2.2:2.6)+'" stroke-linejoin="round" stroke-linecap="round"'+(si===1?' stroke-dasharray="6 5"':'')+'/>';
    L.forEach((x,i)=>{const last=i===L.length-1;g+='<circle cx="'+X(x).toFixed(1)+'" cy="'+Y(x.v).toFixed(1)+'" r="'+(last?4.6:L.length>40?1.6:2.8)+'" style="fill:'+(last?'var(--ink)':col)+';stroke:var(--card)" stroke-width="'+(last?2:1)+'"/>';pts.push({v:x.v,t:f(x.v)+' '+MZU(k),l:mzD(x.d)+(sr.n?' · '+sr.n:'')})})});
  const lx=SR[0].L[SR[0].L.length-1];if(lx&&SR.filter(x=>x.L.length).length===1)g+='<text class="v" x="'+Math.min(W-r,X(lx)).toFixed(1)+'" y="'+(Y(lx.v)-11).toFixed(1)+'" text-anchor="end">'+esc(f(lx.v))+'</text>';
  s.innerHTML=g;s._sig='';chart6(s,{pts,o:{fmt:v=>f(v)+' '+MZU(k)}})};
  box._mz=draw;if(!box._ro){box._ro=new ResizeObserver(()=>box._mz&&box._mz());box._ro.observe(s)}draw()}
const MZU=k=>({w:'kg',h:'m'})[k]||'cm';
/* petite case de la grille 2 x 2 (bras gauche, bras droit, clavicule, taille) ; w : sur toute la largeur */
function mzTile(lab,val,u,d,w){return '<div class="mz8t'+(w?' mz8w':'')+'"><span class="mz8l">'+lab+'</span>'+(val?'<b class="mz8tv">'+val+(u?'<small> '+u+'</small>':'')+'</b><span class="mz8d">'+esc(mzDl(d))+'</span>':'<b class="mz8tv mz8n">—</b><span class="mz8d">Pas encore noté</span>')+'</div>'}
function renderMz(){const v=$('vMz');if(!v)return;const Lw=bwSorted(),Lt=waistSorted(),lw=Lw[Lw.length-1],lt=Lt[Lt.length-1],dw=mzDelta(Lw,30),dt=mzDelta(Lt,30),R=mzRows(),last=k=>{const L=mzSorted(k);return L[L.length-1]};
  const big=(lab,x,u,d)=>'<div class="mz8b"><span class="mz8l">'+lab+'</span>'+(x?'<b class="mz8v"><span>'+fmtN(x.v)+'</span><small> '+u+'</small></b><span class="mz8d">'+esc(mzDl(x.d))+'</span>'+(d?'<span class="mz8x">'+sgn(d.v)+' '+u+' <span>en '+d.d+' j</span></span>':''):'<b class="mz8v mz8n">—</b><span class="mz8d">Pas encore noté</span>')+'</div>';
  const bg=last('bg'),bd=last('bd'),bo=last('b'),c=last('c'),hh=last('h');
  /* ancien tour de bras sans côté (avant v7.4) : une case sur toute la largeur tant qu'aucun côté n'est noté */
  const arm=!bg&&!bd&&bo?mzTile('Tour de bras',fmtN(bo.v),'cm',bo.d,1):mzTile('Tour de bras gauche',bg?fmtN(bg.v):'','cm',bg&&bg.d)+mzTile('Tour de bras droit',bd?fmtN(bd.v):'','cm',bd&&bd.d);
  let h='<section class="panel wide mz8"><div class="mz8g">'+big('Poids',lw,'kg',dw)+big('Tour de taille',lt,'cm',dt)+'</div>'
   +'<div class="mz8g3">'+arm+mzTile('Distance claviculaire',c?fmtN(c.v):'','cm',c&&c.d)+mzTile('Taille (hauteur)',hh?mzFmt('h',hh.v):'','m',hh&&hh.d)+'</div>'
   +'<button type="button" class="btn big mz8add" data-bw7="add">'+ico('add')+'<span>Nouvelle mesure</span></button>'
   +'<p class="mz8tip">'+ico('info')+'<span><b>'+MZTIP+'</b> Garde les mêmes conditions d\'une pesée à l\'autre pour bien comparer.</span></p></section>';
  const V=MZV.find(x=>x[0]===mzM)||MZV[0],SR=V[2].map(x=>({k:x[0],n:x[1],L:mzSorted(x[0]).filter(q=>!mzP||q.d>=key(add(T,-mzP)))})).filter(x=>x.k!=='b'||x.L.length),u=MZU(V[2][0][0]),nAll=SR.reduce((a,x)=>a+x.L.length,0);
  h+='<section class="panel wide mz8c"><div class="mz8m" role="group" aria-label="Mesure">'+MZV.map(x=>'<button type="button" data-mzm="'+x[0]+'" aria-pressed="'+(mzM===x[0])+'">'+x[1]+'</button>').join('')+'</div>'
   +'<div class="mz8p" role="group" aria-label="Période">'+MZP.map(p=>'<button type="button" data-mzp="'+p[0]+'" aria-pressed="'+(mzP===p[0])+'">'+p[1]+'</button>').join('')+'</div>';
  if(nAll>=2){const k0=V[2][0][0];h+=(SR.length>1?'<div class="mz8lg">'+SR.filter(x=>x.L.length).map((x,i)=>'<span class="s'+i+'"><i></i>'+x.n+'</span>').join('')+'</div>':'')+'<div class="chart mz8ch" id="mzC"><svg></svg></div>';
    if(V[0]==='bras'){const g=SR.find(x=>x.k==='bg'),d=SR.find(x=>x.k==='bd'),gl=g&&g.L[g.L.length-1],dl=d&&d.L[d.L.length-1];h+='<div class="mz8s"><span><small>Gauche</small><b>'+(gl?fmtN(gl.v)+' cm':'—')+'</b></span><span><small>Droit</small><b>'+(dl?fmtN(dl.v)+' cm':'—')+'</b></span><span><small>Écart</small><b>'+(gl&&dl?fmtN(Math.abs(gl.v-dl.v))+' cm':'—')+'</b></span></div>'}
    else{const L=SR[0].L,vs=L.map(x=>x.v),a=L[0],z=L[L.length-1];h+='<div class="mz8s"><span><small>Plus bas</small><b>'+mzFmt(k0,Math.min(...vs))+' '+u+'</b></span><span><small>Plus haut</small><b>'+mzFmt(k0,Math.max(...vs))+' '+u+'</b></span><span><small>Évolution</small><b>'+(k0==='h'?(z.v-a.v>=0?'+':'−')+mzFmt('h',Math.abs(z.v-a.v)):sgn(Math.round((z.v-a.v)*10)/10))+' '+u+'</b></span></div>'}}
  else h+='<p class="nfs nempty">'+(nAll?'Une seule mesure sur cette période : la courbe apparaîtra dès la deuxième.':'Aucune mesure sur cette période.')+'</p>';
  h+='</section>';
  const show=mzAll?R:R.slice(0,8),xtra=r=>{const o=[];if(r.bg!==undefined||r.bd!==undefined)o.push('<span>Bras '+(r.bg!==undefined?fmtN(r.bg):'—')+' / '+(r.bd!==undefined?fmtN(r.bd):'—')+' cm</span>');else if(r.b!==undefined)o.push('<span>Bras '+fmtN(r.b)+' cm</span>');if(r.c!==undefined)o.push('<span>Clavicule '+fmtN(r.c)+' cm</span>');if(r.h!==undefined)o.push('<span>Taille '+mzFmt('h',r.h)+' m</span>');return o.length?'<span class="mz8rx">'+o.join('')+'</span>':''};
  h+='<section class="panel wide mz8h"><h2 class="t">Historique</h2>'+(R.length?'<div class="mz8hh"><span>Date</span><span>Poids</span><span>Tour de taille</span></div><div class="mz8hl">'+show.map((r,i)=>{const nx=R.slice(i+1).find(q=>q.w!==undefined),dv=r.w!==undefined&&nx?Math.round((r.w-nx.w)*10)/10:null;
      return '<button type="button" class="mz8r" data-mze="'+r.d+'"><span>'+esc(mzD(r.d))+'</span><span>'+(r.w!==undefined?'<b>'+fmtN(r.w)+'</b>'+(dv!==null&&dv!==0?'<small class="'+(dv>0?'up':'dn')+'">'+sgn(dv)+'</small>':''):'<i>—</i>')+'</span><span>'+(r.t!==undefined?'<b>'+fmtN(r.t)+'</b>':'<i>—</i>')+'</span>'+xtra(r)+'</button>'}).join('')+'</div>'
     +(R.length>8?'<button type="button" class="nlink mz8all" data-mza="1">'+(mzAll?'Afficher moins':'Voir tout l\'historique ('+R.length+')')+'</button>':''):'<p class="nfs nempty">Tes mesures s\'afficheront ici, de la plus récente à la plus ancienne.</p>')+'</section>';
  v.innerHTML=h;if(nAll>=2)mzChart(SR,V[2][0][0])}
/* champs de saisie (nouvelle mesure et modification) : r = valeurs déjà notées ce jour-là */
function mzFields(r,ph){r=r||{};ph=ph||{};const fl=(k,lab,step,mn,mx)=>'<label class="nfl">'+lab+'<input id="mz_'+k+'" type="number" inputmode="decimal" step="'+step+'" min="'+mn+'" max="'+mx+'" value="'+(r[k]!==undefined?r[k]:'')+'"'+(ph[k]?' placeholder="'+ph[k]+'"':'')+'></label>';
  return '<div class="nrow2">'+fl('w','Poids (kg)',.1,20,400)+fl('t','Tour de taille (cm)',.5,40,200)+'</div><p class="mz8sub">Tour de bras (cm)</p><div class="nrow2">'+fl('bg','Gauche',.5,15,80)+fl('bd','Droit',.5,15,80)+'</div><div class="nrow2">'+fl('c','Distance claviculaire (cm)',.5,20,70)+fl('h','Taille (m)',.01,1,2.5)+'</div>'}
/* lit les champs ; renvoie les valeurs ou un message d'erreur */
function mzRead(){const o={},num=id=>{const t=String(($(id)||{}).value||'').trim().replace(',','.');return t===''?null:parseFloat(t)};
  for(const f of MZF){let v=num('mz_'+f[0]);if(v===null)continue;if(f[0]==='h'&&v>=100&&v<=250)v=v/100; /* 175 → 1,75 m */
    if(!(v>=f[3]&&v<=f[4]))return {err:f[6]};o[f[0]]=f[0]==='h'?Math.round(v*100)/100:Math.round(v*10)/10}
  if(!Object.keys(o).length)return {err:'Note au moins une mesure'};return {v:o}}
/* enregistre les valeurs à la date nd (modification : remplace celles de la date od ; add : seulement les champs remplis) */
function mzWrite(v,nd,od,add){MZF.forEach(f=>{const k=f[0];if(add&&v[k]===undefined)return; /* ajout : on ne touche qu'aux mesures notées */
  let L=mzSer(k).filter(x=>x.d!==nd&&(od===undefined||x.d!==od));if(v[k]!==undefined)L=L.concat({d:nd,v:v[k]});mzPut(k,L)})}
/* modifier ou supprimer une mesure */
function mzEdit(d){const r=mzRows().find(x=>x.d===d);if(!r)return;
  openSheet('<div class="nsh"><h2 class="t">Mesure</h2>'+mzFields(r)+'<label class="nfl">Date<input id="mzDt" type="date" value="'+d+'" max="'+TK+'"></label>'
   +'<div class="nqa"><button type="button" class="btn nbig" data-mzs="'+d+'">Enregistrer</button><button type="button" class="btn ghost nbig ndel" data-mzx="'+d+'">'+ico('trash')+'Supprimer cette mesure</button></div></div>')}
function mzRefresh(){if(curV==='pr'&&S.ptab==='mz')renderMz();if(curV==='home')renderHome()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-mzm],[data-mzp],[data-mze],[data-mzs],[data-mzx],[data-mza]');if(!b)return;const d=b.dataset;
  if(d.mzm){mzM=d.mzm;renderMz();return}
  if(d.mzp!==undefined){mzP=+d.mzp;renderMz();return}
  if(d.mza){mzAll=!mzAll;renderMz();return}
  if(d.mze){mzEdit(d.mze);return}
  if(d.mzs){const o=d.mzs,nd=$('mzDt').value||o,r=mzRead();if(r.err){toast(r.err);return}if(nd>TK){toast('Choisis une date passée');return}
    const old=mzRows().find(x=>x.d===o)||{};if(old.b!==undefined&&(r.v.bg!==undefined||r.v.bd!==undefined))mzPut('b',mzSer('b').filter(x=>x.d!==o)); /* l'ancien bras sans côté est remplacé par gauche/droit */
    mzWrite(r.v,nd,o);if(old.b!==undefined&&nd!==o&&r.v.bg===undefined&&r.v.bd===undefined)mzPut('b',mzSer('b').map(x=>x.d===o?{d:nd,v:x.v}:x));
    save();closeSheet();mzRefresh();toast('Mesure enregistrée');return}
  if(d.mzx){const o=d.mzx,keep={};['w','t','bg','bd','c','h','b'].forEach(k=>{keep[k]=mzSer(k).filter(x=>x.d===o);mzPut(k,mzSer(k).filter(x=>x.d!==o))});save();closeSheet();mzRefresh();
    snack('Mesure supprimée','Annuler',()=>{Object.entries(keep).forEach(([k,L])=>{if(L.length)mzPut(k,mzSer(k).concat(L))});save();mzRefresh()});return}});
