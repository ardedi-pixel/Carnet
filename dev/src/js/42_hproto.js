/* ===================== MAQUETTES de l'accueil (v7.2, à valider par Diego) =====================
   Trois propositions rendues avec les vrais composants de l'appli. Inactives pour l'utilisateur :
   elles ne s'affichent qu'avec l'adresse ?hp=a, ?hp=b ou ?hp=c (outil de captures). À retirer
   une fois la direction choisie. */
function hpV(){try{const q=new URLSearchParams(location.search).get('hp');if(q!==null)sessionStorage.setItem('hp',q);const v=sessionStorage.getItem('hp');return ['a','b','c'].includes(v)?v:''}catch(e){return ''}}
if(hpV())document.body.classList.add('hp','hp-'+hpV());
const HPGEAR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
function hpData(){const wm=monday(T),days=[0,1,2,3,4,5,6].map(i=>key(add(wm,i))),goal=S.goal||3,wss=S.sessions.filter(s=>days.includes(s.date)),n=wss.length,min=wss.reduce((a,s)=>a+sDur(s),0),ws=wStreak();
  const L=bwSorted(),lw=L[L.length-1],dl=mzDelta(L,30),Wt=waistSorted(),lt=Wt[Wt.length-1],t=typeof nutTgt==='function'&&nutTgt()&&nutTgt().kcal?nutTgt():null,x=typeof dayTot==='function'?dayTot(TK):{k:0,p:0},notes=arr(S.carnet);
  const rec=S.recs.filter(r=>r.hist&&r.hist.length).map(r=>({x:r.name,v:r.hist[r.hist.length-1].v,u:r.unit,d:r.hist[r.hist.length-1].d})).sort((a,b)=>a.d<b.d?1:-1)[0];
  return{days,goal,n,min,ws,lw,dl,lt,t,x,notes,rec,P:L.filter(q=>q.d>=key(add(T,-60))).map(q=>q.v)}}
const hpDay=(k,i)=>{const n=sOf(k).length,r=!n&&isRest(k);return '<button type="button" class="hpd'+(n?' on':'')+(r?' rest':'')+(k===TK?' td':'')+(k>TK?' fut':'')+'" data-goday="'+k+'" aria-label="'+esc(fmtDay(parse(k)))+'"><b>'+DOWI()[i]+'</b><i>'+(n?CHK:r?'<em>z</em>':parse(k).getDate())+'</i></button>'};
const hpNote=()=>ico('note');
function hpVals(D){const kc=D.t?Math.max(0,Math.round(D.t.kcal-D.x.k)):null;
  return{nut:D.t?fmtN(Math.round(D.x.k))+' / '+fmtN(D.t.kcal)+' kcal':'Kcal et protéines',nutS:D.t?'Reste '+fmtN(kc)+' kcal · P '+fmtN(Math.round(D.x.p))+' / '+fmtN(D.t.p)+' g':'',nutP:D.t?Math.min(1,D.x.k/D.t.kcal):0,
    bw:D.lw?fmtN(D.lw.v)+' kg':'À noter',bwS:[D.dl?sgn(D.dl.v)+' kg en '+D.dl.d+' j':'',D.lt?fmtN(D.lt.v)+' cm de taille':''].filter(Boolean).join(' · '),
    pr:D.rec?'<span>'+esc(D.rec.x)+'</span> · <span>'+fmtN(D.rec.v)+' '+esc(unitL(D.rec.u))+'</span>':'Stats et records',prS:'Records, skills, graphiques',
    nt:D.notes.length?D.notes.length+' note'+(D.notes.length>1?'s':''):'Tes notes',ntS:D.notes.length?esc(D.notes.slice().sort((a,b)=>(b.u||0)-(a.u||0))[0].t||''):'Nutrition, exercices, observations'}}
function hpRender(v){const D=hpData(),V=hpVals(D),hs=$('hStart'),hc=$('hCards');hs.className='wide hp-'+v;hc.innerHTML='';
  const days='<div class="hpw">'+D.days.map(hpDay).join('')+'</div>',cta='<button type="button" class="btn big hpcta" data-go="note"><span class="pl6">'+ico('check','okic')+'<b class="plus">+</b></span>'+(sOf(TK).length?'Noter une autre séance':'Noter une séance')+'</button>';
  const st3=cls=>'<div class="'+cls+'"><div class="hps"><span class="hpsi">'+ring(D.n,D.goal)+'</span><span><b>'+D.n+'/'+D.goal+'</b><small>'+(D.n>=D.goal?'objectif atteint':'séances')+'</small></span></div><div class="hps"><span class="hpsi">'+flame(D.ws)+'</span><span><b>'+D.ws+'</b><small>semaine'+(D.ws>1?'s':'')+' d\'affilée</small></span></div><div class="hps"><span><b>'+fmtDur(D.min)+'</b><small>cette semaine</small></span></div></div>';
  $('hKick').textContent=fmtDay(T);
  if(v==='a'){ /* A « Épuré » : trois niveaux, rien d'autre */
    hs.innerHTML=st3('hpA3')+'<section class="hpA1"><div class="hph"><b>Ta semaine</b><a href="#calendrier">Calendrier</a></div>'+days+cta+'</section>'
     +'<nav class="hpA2" aria-label="Accès rapides">'
     +'<a class="hpT" href="#nutrition"><span class="hpi">'+ico('nut')+'</span><b>Nutrition</b><span>'+V.nut+'</span>'+(D.t?'<i class="hpbar"><i style="width:'+(V.nutP*100).toFixed(1)+'%"></i></i>':'')+'</a>'
     +'<button type="button" class="hpT" data-bw7="open"><span class="hpi">'+ico('scale')+'</span><b>Mesures</b><span>'+V.bw+'</span>'+(D.dl?'<small>'+sgn(D.dl.v)+' kg en '+D.dl.d+' j</small>':'')+'</button>'
     +'<a class="hpT" href="#progres"><span class="hpi">'+ico('chart')+'</span><b>Progrès</b><span>'+V.pr+'</span></a>'
     +'<a class="hpT" href="#carnet"><span class="hpi">'+hpNote()+'</span><b>Carnet</b><span>'+V.nt+'</span></a></nav>'}
  else if(v==='b'){ /* B « Centre » : la semaine en bandeau discret, puis une grille de raccourcis riches (l'essentiel de chaque espace) */
    const td=sOf(TK),pk=D.t?Math.min(1,D.x.k/D.t.kcal):0,C=2*Math.PI*20;
    hs.innerHTML='<section class="hpB0"><div class="hpB0d">'+D.days.map((k,i)=>{const n=sOf(k).length,r=!n&&isRest(k);return '<button type="button" class="hpb'+(n?' on':'')+(r?' rest':'')+(k===TK?' td':'')+(k>TK?' fut':'')+'" data-goday="'+k+'" aria-label="'+esc(fmtDay(parse(k)))+'"><b>'+DOWI()[i]+'</b><i></i></button>'}).join('')+'</div>'
     +'<p class="hpB0s"><span><b>'+D.n+'/'+D.goal+'</b> séances</span><span>'+flame(D.ws)+'<b>'+D.ws+'</b> sem.</span><span><b>'+fmtDur(D.min)+'</b></span></p></section>'
     +'<div class="hpBg">'
     +'<button type="button" class="hpBt hpBn" data-go="note"><span class="hpBpl">'+ico('add')+'</span><b>Noter une séance</b><span>'+(td.length?td.length+' séance'+(td.length>1?'s':'')+' notée'+(td.length>1?'s':'')+' aujourd\'hui':'Rien de noté aujourd\'hui')+'</span></button>'
     +'<a class="hpBt" href="#nutrition"><span class="hpBk">Nutrition</span><span class="hpBrg"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="20" class="t"/><circle cx="24" cy="24" r="20" class="p" stroke-dasharray="'+(C*pk).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 24 24)"/></svg><b>'+(D.t?Math.round(pk*100)+'%':'—')+'</b></span><span class="hpBv">'+(D.t?fmtN(Math.max(0,Math.round(D.t.kcal-D.x.k)))+' kcal restantes':'Kcal et protéines')+'</span>'+(D.t?'<small>Prot '+fmtN(Math.round(D.x.p))+' / '+fmtN(D.t.p)+' g</small>':'')+'</a>'
     +'<button type="button" class="hpBt" data-bw7="open"><span class="hpBk">Mesures</span><b class="hpBbig">'+(D.lw?fmtN(D.lw.v)+'<small> kg</small>':'—')+'</b>'+(D.P.length>1?spark7(D.P,'hpsp'):'')+'<small>'+(D.dl?sgn(D.dl.v)+' kg en '+D.dl.d+' j':'Poids, tour de taille')+'</small></button>'
     +'<a class="hpBt" href="#carnet"><span class="hpBk">Carnet</span><span class="hpi">'+hpNote()+'</span><span class="hpBv">'+(D.notes.length?V.ntS:'Tes notes')+'</span><small>'+V.nt+'</small></a>'
     +'<a class="hpBt hpBw" href="#progres"><span class="hpi">'+ico('chart')+'</span><span class="hpRt"><span class="hpBk">Progrès</span><span class="hpBv">'+V.pr+'</span></span>'+ico('chev','hpcv')+'</a></div>'}
  else{ /* C « Immersif » : la scène de saison en grand, le perso, la semaine en petites scènes */
    const ls=lastSess(),fam=ls?i7fam([ls],'street'):'pull',sc=illScene('street',{who:1,fam:fam==='sq'?'pull':fam});
    const tiles='<div class="hpC3">'+D.days.map((k,i)=>{const n=sOf(k).length,r=!n&&isRest(k);return '<button type="button" class="hpct'+(n?' on':'')+(r?' rest':'')+(k===TK?' td':'')+(k>TK?' fut':'')+'" data-goday="'+k+'" aria-label="'+esc(fmtDay(parse(k)))+'"><span class="hpctp">'+(n||r?illDay(k):'<span class="hpce">'+parse(k).getDate()+'</span>')+'</span><b>'+DOWI()[i]+'</b></button>'}).join('')+'</div>';
    hs.innerHTML='<section class="hpC1"><div class="hpC1s" aria-hidden="true">'+sc+'</div><div class="hpC1t"><p class="kick">'+esc(fmtDay(T))+'</p><h2>'+esc(shownName()?'Salut '+shownName():'Salut')+'</h2></div><a href="#reglages" class="hpC1g" aria-label="Réglages">'+HPGEAR+'</a></section>'
     +st3('hpC2')+'<section class="hpC4"><div class="hph"><b>Ta semaine</b><a href="#calendrier">Calendrier</a></div>'+tiles+cta+'</section>'
     +'<nav class="hpC5" aria-label="Accès rapides"><a href="#nutrition"><span>'+ico('nut')+'</span>Nutrition</a><button type="button" data-bw7="open"><span>'+ico('scale')+'</span>Mesures</button><a href="#progres"><span>'+ico('chart')+'</span>Progrès</a><a href="#carnet"><span>'+hpNote()+'</span>Carnet</a></nav>'}
  animRings()}
