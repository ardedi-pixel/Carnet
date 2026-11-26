/* ===================== v6 : minuteurs ===================== */
let tmPh='',tmFinDone=false;
function tmLoop(){tmLoop5();tm6Post()}
function tm6Post(){const o=$('tmo');if(!o)return;if(!TM){o.dataset.ph='';return}const now=Date.now();let ph='work',s=99,nx='';
  if(TM.k==='rest'){s=Math.ceil(Math.max(0,TM.end-now)/1000);ph='rest'}
  else if(TM.k==='go')ph='go';
  else if(TM.k==='emom'){const t=TM.pausedAt||now,el=t-TM.start;if(el<0){ph='prep';s=Math.ceil(-el/1000)}else{const r=Math.floor(el/(TM.iv*1000));s=Math.ceil((TM.iv*1000-(el-r*TM.iv*1000))/1000);ph='work';nx=r+1<TM.n?'Ensuite : intervalle '+(r+2)+'/'+TM.n:'Dernier intervalle !'}if(TM.pausedAt)ph='pause'}
  else if(TM.k==='pyr'){const st=TM.steps,i=TM.i;if(TM.phase==='work'){ph='work';nx=i+1<st.length?'Ensuite : marche '+(i+2)+' · '+st[i+1]+' rép.':'Dernière marche !'}else{s=Math.ceil(Math.max(0,TM.end-now)/1000);ph='rest';nx=i+2<st.length?'Puis : marche '+(i+3)+' · '+st[i+2]+' rép.':''}}
  else if(TM.k==='fin')ph='fin';
  if(s<=3&&(ph==='rest'||ph==='work'||ph==='prep'))ph+=' last';
  if(ph!==tmPh){o.dataset.ph=ph;tmPh=ph}
  const n=$('tNext');if(n){n.hidden=!nx;if(n.textContent!==nx)n.textContent=nx}
  if(TM.k==='pyr')stairs6();
  if(TM.k==='fin'&&!tmFinDone){tmFinDone=true;finSum6()}else if(TM.k!=='fin')tmFinDone=false;
  const a=$('tArc'),pa=$('tpArc');if(a&&pa){const m=/([\d.]+)\s/.exec(a.style.strokeDasharray||'');const p=m?(+m[1])/TC:0;pa.setAttribute('stroke-dasharray',(59.7*Math.min(1,p)).toFixed(1)+' 60');$('tpill').dataset.ph=ph}}
/* ---- M3 : la pyramide dessinée en escalier ---- */
function stairs6(){const d=$('tDots');if(!d||!TM||TM.k!=='pyr')return;const st=TM.steps,mx=Math.max(...st),i=TM.i,k='st'+i+TM.phase;if(d.dataset.k===k&&d.querySelector('.stairs'))return;d.dataset.k=k;
  const W=Math.max(220,st.length*16),bw=W/st.length;
  d.innerHTML='<svg class="stairs" viewBox="0 0 '+W+' 86" preserveAspectRatio="none" aria-hidden="true">'+st.map((v,j)=>{const h=10+v/mx*70,x=j*bw,done=j<i||(j===i&&TM.phase==='rest'),cur=j===i&&TM.phase==='work';return '<rect x="'+(x+1.5).toFixed(1)+'" y="'+(84-h).toFixed(1)+'" width="'+(bw-3).toFixed(1)+'" height="'+h.toFixed(1)+'" rx="3" class="'+(done?'d':cur?'c':'')+'"/>'+(st.length<=21?'<text x="'+(x+bw/2).toFixed(1)+'" y="'+(80-h).toFixed(1)+'" text-anchor="middle">'+v+'</text>':'')}).join('')+'</svg>'}
/* ---- M6 : résumé de fin ---- */
function finSum6(){const r=tmRun,d=$('tDots');if(!r||!d)return;const dur=Math.round((Date.now()-r.start)/1000);let tot=0,rec=false,lab='';
  if(r.k==='pyr'&&r.steps){tot=r.steps.reduce((a,b)=>a+b,0);S.tmH=arr(S.tmH);const prev=S.tmH.filter(x=>x.k==='pyr'&&norm(x.name)===norm(r.name)).reduce((m,x)=>Math.max(m,x.t),0);rec=prev>0&&tot>prev;S.tmH.push({k:'pyr',name:r.name,t:tot,dur,d:TK});S.tmH=S.tmH.slice(-60);save();lab='répétitions'}
  else if(r.k==='emom'){tot=r.target?r.target*r.n:0;lab='répétitions';S.tmH=arr(S.tmH);S.tmH.push({k:'emom',n:r.n,iv:r.iv,t:tot,dur,d:TK});S.tmH=S.tmH.slice(-60);save()}
  d.dataset.k='fin';d.innerHTML='<div class="fsum">'+(tot?'<div><b data-n="'+tot+'">'+tot+'</b><span>'+lab+'</span></div>':'')+'<div><b>'+mmss(dur)+'</b><span>durée</span></div>'+(rec?'<div class="rec"><b>'+ico('trophy')+'</b><span>record !</span></div>':'')+'</div>';countUp(d);if(rec)setTimeout(()=>{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)confetti()},300)}
if(!EXTRA.includes('tmH'))EXTRA.push('tmH');
