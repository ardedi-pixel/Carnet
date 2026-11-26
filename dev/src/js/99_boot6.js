/* ===================== v6 : démarrage ===================== */
function maybeHello(){const last=+S.lastSeen||0,now=Date.now();S.lastSeen=now;save();if(!S.onb)return;
  setTimeout(()=>{if(maybeRecap())return;if(S.pops==='never')return;const gap=S.pops==='some'?24:6;if(!last||now-last>=gap*3600e3)showHello()},1100)}
function splash6(){const sp=$('splash');if(!sp)return;try{localStorage.setItem('carnet-splash',S.splash)}catch(e){}
  if(S.splash==='off'||!S.onb){sp.remove();return}const lg=sp.querySelector('.lg');
  if(S.splash==='anim'&&lg){lg.classList.add('anim');lg.innerHTML=charAnim(myChar({bg:1,mus:0,sea:'',vb:CH_VBI}),1.1)}
  let done=0;const end=()=>{if(done)return;done=1;sp.classList.add('out');setTimeout(()=>sp.remove(),420)};
  sp.addEventListener('click',end);setTimeout(end,S.splash==='anim'?2350:1100)}
function v6Init(){measureDyn();applyAcc();applyIcon();renderTabs();sheetDrag($('sheet'),close,()=>!form||(!form.ex.length&&!Object.keys(form.perf||{}).length&&!(form.note||'').trim()));sheetDrag($('gsheet'),closeSheet);
  rmSync();chalSync();splash6();miniSync();i18nStart();if(S.onb&&!$('onb'))setTimeout(()=>{if(!$('bil'))afterRewards()},2500);route()}
