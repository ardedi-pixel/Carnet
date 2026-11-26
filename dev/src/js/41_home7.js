/* ===================== v7 : poids mis en avant (accueil + Progrès) ===================== */
Object.assign(ICO,{
 nut:'<path d="M12 7.5c-1.6-1.3-3.7-1.6-5.3-.6C4.3 8.4 3.9 12 5.4 15.4 6.6 18.2 8.5 20.5 10.5 20.5c.7 0 1-.4 1.5-.4s.8.4 1.5.4c2 0 3.9-2.3 5.1-5.1 1.5-3.4 1.1-7-1.3-8.5-1.6-1-3.7-.7-5.3.6z"/><path d="M12 7.5c0-2.1 1-3.7 3-4.5"/>',
 scale:'<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><path d="M8 10a5 5 0 0 1 8 0"/><path d="M12 10.5l1.6-2.2"/>',
 add:'<path d="M12 5v14M5 12h14"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
 star2:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
 drop:'<path d="M12 3.5c3 3.6 6 6.9 6 10.4a6 6 0 0 1-12 0c0-3.5 3-6.8 6-10.4z"/>',
 left:'<path d="M15 5l-7 7 7 7"/>',
 right:'<path d="M9 5l7 7-7 7"/>'
});
function bwSorted(){return S.bw.slice().sort((a,b)=>a.d<b.d?-1:1)}
/* tendance en kg par semaine sur les N derniers jours (régression linéaire) ; null s'il y a moins de 3 pesées sur au moins 7 jours */
function bwTrend(days){const L=bwSorted(),from=key(add(T,-(days||28))),P=L.filter(x=>x.d>=from);if(P.length<3)return null;
  const t0=parse(P[0].d).getTime(),xs=P.map(x=>(parse(x.d).getTime()-t0)/864e5);if(xs[xs.length-1]<7)return null;
  const n=P.length,mx=xs.reduce((a,b)=>a+b,0)/n,my=P.reduce((a,b)=>a+b.v,0)/n;let num=0,den=0;P.forEach((p,i)=>{num+=(xs[i]-mx)*(p.v-my);den+=(xs[i]-mx)*(xs[i]-mx)});return den?num/den*7:null}
const sgn=v=>(v>0?'+':v<0?'−':'±')+fmtN(Math.abs(v));
/* petite courbe (sparkline) */
function spark7(vals,cls){if(vals.length<2)return '';const mn=Math.min(...vals),mx=Math.max(...vals),r=mx-mn||1,W=200,H=44,pts=vals.map((v,i)=>[i/(vals.length-1)*W,H-4-(v-mn)/r*(H-10)]);
  const d=pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  return '<svg class="spk7'+(cls?' '+cls:'')+'" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,'+H+' '+d+' '+W+','+H+'" class="spa"/><polyline points="'+d+'" class="spl" vector-effect="non-scaling-stroke"/></svg>'}
/* ligne d'état du poids (avec l'objectif nutrition s'il est défini) */
function bwStatus(){const L=bwSorted(),last=L[L.length-1];if(!last)return '';const ago=Math.round((parse(TK)-parse(last.d))/864e5);
  const ck=typeof nutWeightCheck==='function'?nutWeightCheck():null;if(ck)return ck.txt;
  const tr=bwTrend(28);if(tr!==null)return 'Tendance : '+sgn(Math.round(tr*10)/10)+' kg par semaine';
  return ago>=7?'Dernière pesée il y a '+ago+' jours':'Pèse-toi 2 à 3 fois par semaine pour voir ta tendance'}
/* écart sur environ N jours pour une liste de mesures triée [{d,v}] */
function mzDelta(L,days){if(L.length<2)return null;const last=L[L.length-1],ref=key(add(parse(last.d),-(days||30)));let b=null;
  for(const x of L){if(x.d<=ref)b=x;else break}if(!b)b=L[0];if(b===last)return null;return{v:Math.round((last.v-b.v)*10)/10,d:Math.round((parse(last.d)-parse(b.d))/864e5)}}
const waistSorted=()=>arr(S.meas&&S.meas.taille).slice().sort((a,b)=>a.d<b.d?-1:1);
/* v7.1 : carte « Mesures » de l'accueil (poids + tour de taille), les deux chiffres clés d'une prise de masse ou d'une sèche */
function poidsCard(){const L=bwSorted(),last=L[L.length-1],Wt=waistSorted(),lw=Wt[Wt.length-1],g=typeof nutGoalLbl==='function'?nutGoalLbl():'';
  if(!last&&!lw)return '<div class="h7c pw7 empty7"><span class="hcic">'+ico('scale')+'</span><div class="h7b"><p class="kick">Mesures</p><b>Suis ton poids et ton tour de taille</b><p>Indispensable pour une prise de masse ou une sèche. Une mesure par semaine suffit pour commencer.</p></div><button type="button" class="btn sm pw7add" data-bw7="add">Ajouter</button></div>';
  const dl=mzDelta(L,30),dw=mzDelta(Wt,30),P=L.filter(x=>x.d>=key(add(T,-90))).map(x=>x.v),ck=typeof nutWeightCheck==='function'?nutWeightCheck():null;
  const col=(lab,x,u,d,emp)=>'<div class="mz7c"><span class="mz7l">'+lab+'</span>'+(x?'<b>'+fmtN(x.v)+'<small> '+u+'</small></b>'+(d?'<span class="pw7d">'+sgn(d.v)+' '+u+' en '+d.d+' j</span>':''):'<b class="mz7n">—</b><span class="pw7d">'+emp+'</span>')+'</div>';
  return '<div class="h7c pw7 mz7'+(ck?' st-'+ck.st:'')+'"><button type="button" class="pw7m" data-bw7="open" aria-label="Voir l\'évolution de tes mesures"><p class="kick">Mesures'+(g?'<span> · </span><span>'+esc(g)+'</span>':'')+'</p>'
   +'<div class="mz7g">'+col('Poids',last,'kg',dl,'à noter')+col('Tour de taille',lw,'cm',dw,'à noter')+'</div>'+spark7(P.length>=2?P:[])+(last?'<p class="pw7s">'+esc(bwStatus())+'</p>':'')+'</button><button type="button" class="ib pw7a" data-bw7="add" aria-label="Ajouter une mesure">'+ico('add')+'</button></div>'}
/* feuille « Nouvelle mesure » : poids et tour de taille en une fois, avec la bonne façon de mesurer */
function bwSheet(){const L=bwSorted(),last=L[L.length-1],Wt=waistSorted(),lw=Wt[Wt.length-1];
  openSheet('<div class="nsh"><h2 class="t">Nouvelle mesure</h2><div class="nrow2"><label class="nfl">Poids (kg)<input id="bw7v" type="number" inputmode="decimal" step="0.1" min="20" max="400" placeholder="'+(last?fmtN(last.v):'75')+'"></label><label class="nfl">Tour de taille (cm)<input id="bw7t" type="number" inputmode="decimal" step="0.5" min="40" max="200" placeholder="'+(lw?fmtN(lw.v):'Facultatif')+'"></label></div>'
   +'<label class="nfl">Date<input id="bw7d" type="date" value="'+TK+'" max="'+TK+'"></label>'
   +'<div class="mz7how"><p><b>Pesée</b><span>Le matin, à jeun, après être allé aux toilettes, avant de manger ou de boire. Garde les mêmes conditions à chaque fois pour bien comparer.</span></p><p><b>Tour de taille</b><span>Au niveau du nombril, debout, ventre relâché, en fin d\'expiration.</span></p></div>'
   +'<button type="button" class="btn nbig" data-bw7="save">Enregistrer</button></div>');
  setTimeout(()=>{const i=$('bw7v');if(i)i.focus()},250)}
function bwRefresh(){if(curV==='home')renderHome();if(curV==='nut'&&typeof renderNut==='function')renderNut();if(curV==='pr'&&!$('vGr').hidden)renderBW()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-bw7]');if(!b)return;const a=b.dataset.bw7;
  if(a==='add'){bwSheet();return}
  if(a==='open'){S.ptab='stats';if(location.hash==='#progres')route();else location.hash='#progres';setTimeout(()=>{const s=$('bwIn')&&$('bwIn').closest('section');if(s)s.scrollIntoView({behavior:'smooth',block:'start'})},380);return}
  if(a==='save'){const num=id=>{const t=String(($(id)||{}).value||'').trim().replace(',','.');return t===''?null:parseFloat(t)},v=num('bw7v'),w=num('bw7t'),d=$('bw7d').value||TK;
    if(v===null&&w===null){toast('Note ton poids ou ton tour de taille');return}
    if(v!==null&&!(v>=20&&v<=400)){toast('Entre un poids entre 20 et 400 kg');return}
    if(w!==null&&!(w>=40&&w<=200)){toast('Entre un tour de taille entre 40 et 200 cm');return}
    if(d>TK){toast('Choisis une date passée');return}
    if(v!==null){S.bw=S.bw.filter(x=>x.d!==d);S.bw.push({d,v:Math.round(v*10)/10})}
    if(w!==null){S.meas.taille=arr(S.meas.taille).filter(x=>x.d!==d);S.meas.taille.push({d,v:Math.round(w*10)/10})}
    save();closeSheet();toast('Mesure notée');bwRefresh()}});
/* ---- Progrès : le poids en tête de page, les statistiques secondaires repliées ---- */
function pr7Layout(){const v=$('vGr');if(!v||v.dataset.l7)return;v.dataset.l7='1';
  const bw=$('bwIn')&&$('bwIn').closest('section');if(bw){bw.classList.add('bw7p');v.prepend(bw)}
  const pl=$('gPl')&&$('gPl').closest('section'),ty=$('gTy')&&$('gTy').closest('section');
  if(pl&&ty){const d=document.createElement('details');d.className='wide more7';d.innerHTML='<summary>Lieux et types de séance</summary><div class="more7b"></div>';pl.before(d);d.lastChild.append(pl,ty)}}
