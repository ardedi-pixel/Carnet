/* ===================== v6 : démarrage ===================== */
function maybeHello(){const last=+S.lastSeen||0,now=Date.now();S.lastSeen=now;save();if(!S.onb)return;
  setTimeout(()=>{if(maybeRecap())return;if(S.pops==='never')return;const gap=S.pops==='some'?24:6;if(!last||now-last>=gap*3600e3)showHello()},1100)}
function splash6(){const sp=$('splash');if(!sp)return;try{localStorage.setItem('carnet-splash',S.splash)}catch(e){}
  if(S.splash==='off'||!S.onb){sp.remove();return}const lg=sp.querySelector('.lg');
  if(S.splash==='anim'&&lg){lg.classList.add('anim');lg.innerHTML=charAnim(myChar({bg:1,mus:0,sea:'',vb:CH_VBI}),1.1)}
  /* v7.6 : une traction et demie (1,6 s au lieu de deux tractions) ; le perso s'arrête menton au-dessus de la barre pendant le fondu */
  let done=0;const end=()=>{if(done)return;done=1;sp.querySelectorAll('svg').forEach(v=>{try{v.pauseAnimations();v.setCurrentTime(splTop())}catch(e){}});sp.classList.add('out');setTimeout(()=>sp.remove(),420)};
  sp.addEventListener('click',end);setTimeout(end,S.splash==='anim'?1600:1100)}
function splTop(){return 1.1*1.45} /* 1 répétition (1,1 s) + la montée suivante (45 % du cycle) */
function v6Init(){measureDyn();applyAcc();applyIcon();renderTabs();sheetDrag($('sheet'),close,()=>!form||(!form.ex.length&&!Object.keys(form.perf||{}).length&&!(form.note||'').trim()));sheetDrag($('gsheet'),closeSheet);
  rmSync();chalSync();splash6();miniSync();i18nStart();if(S.onb&&!$('onb'))setTimeout(()=>{if(!$('bil'))afterRewards()},2500);if(typeof plBoot==='function')plBoot();route();tmRestore();if(typeof spTickStart==='function'&&S.supp){spTickStart();spDrain()}} /* v7.4 : un minuteur en cours reprend où il en était */
