/* ===================== v7.2 : Mesures (poids et tour de taille) =====================
   Premier sous-onglet de Progrès (#mesures). Un espace de suivi, sans conseil :
   dernières mesures, ajout en un geste, consigne de pesée, courbe dans le temps, historique modifiable.
   Données inchangées : S.bw [{d,v}] (kg) et S.meas.taille [{d,v}] (cm). */
const MZP=[[30,'1 mois'],[91,'3 mois'],[182,'6 mois'],[365,'1 an'],[0,'Tout']];
let mzM='poids',mzP=91,mzAll=false;
const MZTIP='Pèse-toi le matin à jeun, après être allé aux toilettes et avant de manger ou de boire.';
function mzRows(){const m={};S.bw.forEach(x=>{(m[x.d]=m[x.d]||{d:x.d}).w=x.v});arr(S.meas.taille).forEach(x=>{(m[x.d]=m[x.d]||{d:x.d}).t=x.v});return Object.values(m).sort((a,b)=>a.d<b.d?1:-1)}
const mzD=d=>parse(d).toLocaleDateString(LOC(),{weekday:'short',day:'numeric',month:'short'});
const mzDl=d=>parse(d).toLocaleDateString(LOC(),{day:'numeric',month:'long',year:parse(d).getFullYear()===T.getFullYear()?undefined:'numeric'});
function mzAgo(d){const n=Math.round((parse(TK)-parse(d))/864e5);return n===0?'aujourd\'hui':n===1?'hier':'il y a '+n+' jours'}
/* courbe dans le temps (l'axe suit les dates, pas l'ordre des mesures) */
function mzChart(L,unit){const box=$('mzC');if(!box)return;const s=box.querySelector('svg');const draw=()=>{const W=s.clientWidth,H=s.clientHeight;if(!W||!H)return;if(L.length<2){s.innerHTML='';return}
  const t=x=>parse(x.d).getTime(),t0=t(L[0]),t1=t(L[L.length-1]),span=Math.max(864e5,t1-t0);let mn=Math.min(...L.map(x=>x.v)),mx=Math.max(...L.map(x=>x.v));if(mx-mn<1){const c=(mx+mn)/2;mn=c-.5;mx=c+.5}const pd=(mx-mn)*.2;mn-=pd;mx+=pd;
  const l=40,r=14,tp=22,b=24,X=x=>l+(t(x)-t0)/span*(W-l-r),Y=v=>tp+(H-tp-b)*(1-(v-mn)/(mx-mn));let g='<defs><linearGradient id="mzG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acct);stop-opacity:.28"/><stop offset="1" style="stop-color:var(--acct);stop-opacity:0"/></linearGradient></defs>';
  [0,1,2,3].forEach(k=>{const v=mn+(mx-mn)*k/3;g+='<line x1="'+l+'" x2="'+(W-r)+'" y1="'+Y(v).toFixed(1)+'" y2="'+Y(v).toFixed(1)+'" style="stroke:var(--line)"/><text x="'+(l-6)+'" y="'+(Y(v)+4).toFixed(1)+'" text-anchor="end">'+fmtN(v)+'</text>'});
  const n=Math.min(5,Math.max(2,Math.floor((W-l-r)/70)));for(let i=0;i<n;i++){const tt=t0+span*i/(n-1),d=new Date(tt);g+='<text x="'+(l+(W-l-r)*i/(n-1)).toFixed(1)+'" y="'+(H-6)+'" text-anchor="'+(i===0?'start':i===n-1?'end':'middle')+'">'+esc(d.toLocaleDateString(LOC(),{day:'numeric',month:'short'}).replace('.',''))+'</text>'}
  const path=L.map((x,i)=>(i?'L':'M')+X(x).toFixed(1)+' '+Y(x.v).toFixed(1)).join('');
  g+='<path d="'+path+'L'+X(L[L.length-1]).toFixed(1)+' '+(H-b)+'L'+X(L[0]).toFixed(1)+' '+(H-b)+'Z" fill="url(#mzG)"/><path d="'+path+'" fill="none" style="stroke:var(--acct)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
  L.forEach((x,i)=>{const last=i===L.length-1;g+='<circle cx="'+X(x).toFixed(1)+'" cy="'+Y(x.v).toFixed(1)+'" r="'+(last?5:L.length>40?1.6:2.8)+'" style="fill:'+(last?'var(--ink)':'var(--acct)')+';stroke:var(--card)" stroke-width="'+(last?2:1)+'"/>'});
  const lx=L[L.length-1];g+='<text class="v" x="'+Math.min(W-r,X(lx)).toFixed(1)+'" y="'+(Y(lx.v)-11).toFixed(1)+'" text-anchor="end">'+esc(fmtN(lx.v))+'</text>';
  s.innerHTML=g;s._sig='';chart6(s,{pts:L.map(x=>({v:x.v,l:mzD(x.d)})),o:{fmt:v=>fmtN(v)+' '+unit}})};
  box._mz=draw;if(!box._ro){box._ro=new ResizeObserver(()=>box._mz&&box._mz());box._ro.observe(s)}draw()}
function renderMz(){const v=$('vMz');if(!v)return;const Lw=bwSorted(),Lt=waistSorted(),lw=Lw[Lw.length-1],lt=Lt[Lt.length-1],dw=mzDelta(Lw,30),dt=mzDelta(Lt,30),R=mzRows();
  const big=(lab,x,u,d)=>'<div class="mz8b"><span class="mz8l">'+lab+'</span>'+(x?'<b class="mz8v"><span>'+fmtN(x.v)+'</span><small> '+u+'</small></b><span class="mz8d">'+esc(mzDl(x.d))+'</span>'+(d?'<span class="mz8x">'+sgn(d.v)+' '+u+' <span>en '+d.d+' j</span></span>':''):'<b class="mz8v mz8n">—</b><span class="mz8d">Pas encore noté</span>')+'</div>';
  let h='<section class="panel wide mz8"><div class="mz8g">'+big('Poids',lw,'kg',dw)+big('Tour de taille',lt,'cm',dt)+'</div><button type="button" class="btn big mz8add" data-bw7="add">'+ico('add')+'<span>Nouvelle mesure</span></button>'
   +'<p class="mz8tip">'+ico('info')+'<span><b>'+MZTIP+'</b> Garde les mêmes conditions d\'une pesée à l\'autre pour bien comparer.</span></p></section>';
  const L=(mzM==='poids'?Lw:Lt).filter(x=>!mzP||x.d>=key(add(T,-mzP))),u=mzM==='poids'?'kg':'cm';
  h+='<section class="panel wide mz8c"><div class="seg full" role="group" aria-label="Mesure"><button type="button" data-mzm="poids" aria-pressed="'+(mzM==='poids')+'">Poids</button><button type="button" data-mzm="taille" aria-pressed="'+(mzM==='taille')+'">Tour de taille</button></div>'
   +'<div class="mz8p" role="group" aria-label="Période">'+MZP.map(p=>'<button type="button" data-mzp="'+p[0]+'" aria-pressed="'+(mzP===p[0])+'">'+p[1]+'</button>').join('')+'</div>';
  if(L.length>=2){const vs=L.map(x=>x.v),a=L[0],z=L[L.length-1];h+='<div class="chart mz8ch" id="mzC"><svg></svg></div><div class="mz8s"><span><small>Plus bas</small><b>'+fmtN(Math.min(...vs))+' '+u+'</b></span><span><small>Plus haut</small><b>'+fmtN(Math.max(...vs))+' '+u+'</b></span><span><small>Évolution</small><b>'+sgn(Math.round((z.v-a.v)*10)/10)+' '+u+'</b></span></div>'}
  else h+='<p class="nfs nempty">'+(L.length?'Une seule mesure sur cette période : la courbe apparaîtra dès la deuxième.':'Aucune mesure sur cette période.')+'</p>';
  h+='</section>';
  const show=mzAll?R:R.slice(0,8);
  h+='<section class="panel wide mz8h"><h2 class="t">Historique</h2>'+(R.length?'<div class="mz8hh"><span>Date</span><span>Poids</span><span>Taille</span></div><div class="mz8hl">'+show.map((r,i)=>{const nx=R.slice(i+1).find(q=>q.w!==undefined),dv=r.w!==undefined&&nx?Math.round((r.w-nx.w)*10)/10:null;
      return '<button type="button" class="mz8r" data-mze="'+r.d+'"><span>'+esc(mzD(r.d))+'</span><span>'+(r.w!==undefined?'<b>'+fmtN(r.w)+'</b>'+(dv!==null&&dv!==0?'<small class="'+(dv>0?'up':'dn')+'">'+sgn(dv)+'</small>':''):'<i>—</i>')+'</span><span>'+(r.t!==undefined?'<b>'+fmtN(r.t)+'</b>':'<i>—</i>')+'</span></button>'}).join('')+'</div>'
     +(R.length>8?'<button type="button" class="nlink mz8all" data-mza="1">'+(mzAll?'Afficher moins':'Voir tout l\'historique ('+R.length+')')+'</button>':''):'<p class="nfs nempty">Tes mesures s\'afficheront ici, de la plus récente à la plus ancienne.</p>')+'</section>';
  v.innerHTML=h;if(L.length>=2)mzChart(L,u)}
/* modifier ou supprimer une mesure */
function mzEdit(d){const r=mzRows().find(x=>x.d===d);if(!r)return;
  openSheet('<div class="nsh"><h2 class="t">Mesure</h2><div class="nrow2"><label class="nfl">Poids (kg)<input id="mzW" type="number" inputmode="decimal" step="0.1" min="20" max="400" value="'+(r.w!==undefined?r.w:'')+'"></label><label class="nfl">Tour de taille (cm)<input id="mzT" type="number" inputmode="decimal" step="0.5" min="40" max="200" value="'+(r.t!==undefined?r.t:'')+'"></label></div><label class="nfl">Date<input id="mzDt" type="date" value="'+d+'" max="'+TK+'"></label>'
   +'<div class="nqa"><button type="button" class="btn nbig" data-mzs="'+d+'">Enregistrer</button><button type="button" class="btn ghost nbig ndel" data-mzx="'+d+'">'+ico('trash')+'Supprimer cette mesure</button></div></div>')}
function mzRefresh(){if(curV==='pr'&&S.ptab==='mz')renderMz();if(curV==='home')renderHome()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-mzm],[data-mzp],[data-mze],[data-mzs],[data-mzx],[data-mza]');if(!b)return;const d=b.dataset;
  if(d.mzm){mzM=d.mzm;renderMz();return}
  if(d.mzp!==undefined){mzP=+d.mzp;renderMz();return}
  if(d.mza){mzAll=!mzAll;renderMz();return}
  if(d.mze){mzEdit(d.mze);return}
  if(d.mzs){const o=d.mzs,num=id=>{const t=String(($(id)||{}).value||'').trim().replace(',','.');return t===''?null:parseFloat(t)},w=num('mzW'),t=num('mzT'),nd=$('mzDt').value||o;
    if(w===null&&t===null){toast('Note ton poids ou ton tour de taille');return}if(w!==null&&!(w>=20&&w<=400)){toast('Entre un poids entre 20 et 400 kg');return}if(t!==null&&!(t>=40&&t<=200)){toast('Entre un tour de taille entre 40 et 200 cm');return}if(nd>TK){toast('Choisis une date passée');return}
    S.bw=S.bw.filter(x=>x.d!==o&&x.d!==nd);S.meas.taille=arr(S.meas.taille).filter(x=>x.d!==o&&x.d!==nd);if(w!==null)S.bw.push({d:nd,v:Math.round(w*10)/10});if(t!==null)S.meas.taille.push({d:nd,v:Math.round(t*10)/10});
    save();closeSheet();mzRefresh();toast('Mesure enregistrée');return}
  if(d.mzx){const o=d.mzx,bw=S.bw.filter(x=>x.d===o),ta=arr(S.meas.taille).filter(x=>x.d===o);S.bw=S.bw.filter(x=>x.d!==o);S.meas.taille=arr(S.meas.taille).filter(x=>x.d!==o);save();closeSheet();mzRefresh();
    snack('Mesure supprimée','Annuler',()=>{S.bw=S.bw.concat(bw);S.meas.taille=arr(S.meas.taille).concat(ta);save();mzRefresh()});return}});
