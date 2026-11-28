/* ===================== v6 : récompenses ===================== */
/* ---- R11 : récompenses surprises (4 semaines d'objectif d'affilée) ---- */
const REWARDS=[['theme:or','Thème Or','gift'],['theme:aurore','Thème Aurore','gift']]; /* v6.3 : robot et ninja retirés */
function goalBlocks(){const w=weekCounts(),g=S.goal||3,ks=Object.keys(w).filter(k=>w[k]>=g).sort();let blocks=0,run=0,prev=null;
  ks.forEach(k=>{if(prev&&key(add(parse(prev),7))===k)run++;else{blocks+=Math.floor(run/4);run=1}prev=k});blocks+=Math.floor(run/4);
  return blocks}
const rwEarned=()=>Math.min(REWARDS.length,goalBlocks());
const rwHas=it=>{const i=REWARDS.findIndex(r=>r[0]===it);return i>=0&&i<rwEarned()};
const thOk=k=>!!THEMES[k]&&(!THEMES[k].lock||rwHas('theme:'+k));
function rwReveal(i){const r=REWARDS[i];if(!r)return;const isCh=r[0].startsWith('char:'),k=r[0].split(':')[1];let o=$('rw6');if(o)o.remove();o=document.createElement('div');o.id='rw6';o.className='rec6 rwv';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
  const prev=isCh?charSvg(charOf(k,{pose:'cheer',bg:0})):'<span class="thprev" style="--a:'+THEMES[k].acc+';--b:'+THEMES[k].v.bg+'"><i style="background:'+THEMES[k].top+'"></i><b></b><b></b></span>';
  o.innerHTML='<div class="recin"><div class="gbox"><span class="lid"></span><span class="bxb"></span></div><div class="rwgot">'+prev+'</div><p class="kick">Récompense surprise</p><h2>'+esc(r[1])+'</h2><p class="rws">4 semaines d\'objectif d\'affilée : c\'est débloqué.</p><div class="acts"><button type="button" class="btn ghost" data-rw="close">Plus tard</button><button type="button" class="btn" data-rw="'+esc(r[0])+'">L\'utiliser</button></div></div>';
  document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));setTimeout(()=>{o.classList.add('open');if(!rmOn())confetti();sWin()},900)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-rw]');if(!b)return;const v=b.dataset.rw,o=$('rw6');if(o)o.remove();if(v==='close')return;const [t,k]=v.split(':');
  if(t==='theme'){S.th=k;S.accX='';applyAcc();applyIcon()}else{S.icon=k;S.useP=false;applyIcon()}save();route();toast('C\'est appliqué ✓')});
/* D10 : écran « Ton perso prend du muscle » quand la série passe 4 puis 12 semaines */
function musCheck(){const L=musLvl();if(typeof S.musSeen!=='number')S.musSeen=0;if(L<S.musSeen){S.musSeen=L;save();return false}if(L===S.musSeen)return false;S.musSeen=L;save();
  let o=$('rw6');if(o)o.remove();o=document.createElement('div');o.id='rw6';o.className='rec6 on';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
  o.innerHTML='<div class="recin"><div class="recch">'+charSvg(myChar({pose:'flex',ex:'grin'}))+'</div><p class="kick">'+wStreak()+' semaines d\'affilée</p><h2>'+(L>1?'Ton perso est encore plus musclé':'Ton perso prend du muscle')+'</h2><p class="rws">'+(L>1?'Ta régularité paie. Garde ta série pour le rester.':'Ta régularité se voit. Continue : à 12 semaines, il sera encore plus costaud.')+'</p><div class="acts"><button type="button" class="btn" data-rw="close">Continuer</button></div></div>';
  document.body.appendChild(o);setTimeout(()=>{if(!rmOn())confetti();sWin()},300);return true}
function afterRewards(){setTimeout(()=>{if($('rec6')||$('rw6')||$('hey')){setTimeout(afterRewards,2500);return}if(musCheck())return;const e=rwEarned();if(e>S.rw){const i=S.rw;S.rw=i+1;save();rwReveal(i)}},3400)}
function reward(em,title,sub){reward5(em,title,sub);afterRewards()}
/* ---- R1 : écran « Nouveau record » ---- */
function celebrate(name,v,unit,prev){const u=unitL(unit),hasP=prev!==undefined&&prev>0&&prev<v;let o=$('rec6');if(o)o.remove();o=document.createElement('div');o.id='rec6';o.className='rec6';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Nouveau record');
  o.innerHTML='<div class="recin"><p class="kick">'+emo(S.emo?'Nouveau record ! 🏆':'Nouveau record')+'</p><h2>'+esc(name)+'</h2><div class="rba">'+(hasP?'<span class="rb">'+fmtN(prev)+'</span><span class="rarr">'+ico('chev')+'</span>':'')+'<span class="ra" data-n="'+v+'" data-d="'+(v%1?1:0)+'">'+fmtN(v)+'</span><small>'+esc(u)+'</small></div>'+(hasP?'<p class="rws">+'+fmtN(Math.round((v-prev)*10)/10)+' '+esc(u)+' par rapport à ton ancien record</p>':'')+'<div class="recch">'+charSvg(myChar({pose:'flex',ex:'grin'}))+'</div><div class="acts"><button type="button" class="btn ghost" id="recX">Fermer</button><button type="button" class="btn" id="recS">'+ico('share')+' Partager</button></div></div>';
  document.body.appendChild(o);requestAnimationFrame(()=>{o.classList.add('on');countUp(o)});if(!rmOn())setTimeout(confetti,250);sWin();
  const shut=()=>{clearTimeout(o._t);o.classList.remove('on');setTimeout(()=>o.remove(),250)};o._t=setTimeout(shut,4500); /* v7.6 : se ferme seul après 4,5 s */
  o.addEventListener('pointerdown',()=>clearTimeout(o._t));
  o.addEventListener('click',e=>{if(e.target.id==='recX'||e.target===o)shut();else if(e.target.closest('#recS')){if(typeof recordCard==='function')recordCard(name,prev,v,unit)}})}
/* ---- R5 : récap du dimanche soir ---- */
function recapWeek(){const d=new Date(),dow=d.getDay(),h=d.getHours();if(dow===0&&h>=17)return key(monday(T));if(dow===1)return key(add(monday(T),-7));return ''}
function weekData(wk){const days=[0,1,2,3,4,5,6].map(i=>key(add(parse(wk),i))),ss=S.sessions.filter(s=>days.includes(s.date)),dur=ss.reduce((a,s)=>a+sDur(s),0),recs=S.recs.reduce((a,r)=>a+r.hist.filter((h,i)=>i>0&&days.includes(h.d)&&h.v>Math.max(...r.hist.slice(0,i).map(x=>x.v))).length,0),vol=ss.reduce((a,s)=>a+sVol(s),0);return {days,ss,n:ss.length,dur,recs,vol}}
function recapCard(){const wk=recapWeek();if(!wk)return '';const D=weekData(wk);if(!D.n)return '';
  return '<div class="hc rcp"><span class="hcic">'+ico('sparkles')+'</span><div><p class="kick">'+(new Date().getDay()===1?'Ta semaine dernière':'Ta semaine')+'</p><div class="r3"><span><b data-n="'+D.n+'">'+D.n+'</b>séance'+(D.n>1?'s':'')+'</span><span><b data-n="'+D.dur+'" data-f="dur">'+fmtDur(D.dur)+'</b>d\'entraînement</span><span><b data-n="'+D.recs+'">'+D.recs+'</b>record'+(D.recs>1?'s':'')+'</span></div><button type="button" class="btn ghost sm" data-shw="'+wk+'">'+ico('share')+' Partager ma semaine</button></div></div>'}
function maybeRecap(){const wk=recapWeek();if(!wk||S.recapW===wk||S.pops==='never'||$('onb')||$('inst')||$('bil')||$('hey'))return false;const D=weekData(wk);if(!D.n)return false;S.recapW=wk;save();
  const o=document.createElement('div');o.id='hey';o.className='hey';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
  o.innerHTML='<div class="hbx rcpop"><div class="hem">'+charSvg(myChar({pose:'cheer',ex:'grin'}))+'</div><h2>'+(new Date().getDay()===1?'Ta semaine dernière':'Ta semaine')+'</h2><div class="r3 big"><span><b data-n="'+D.n+'">'+D.n+'</b>séance'+(D.n>1?'s':'')+'</span><span><b data-n="'+D.dur+'" data-f="dur">'+fmtDur(D.dur)+'</b>au total</span><span><b data-n="'+D.recs+'">'+D.recs+'</b>record'+(D.recs>1?'s':'')+'</span></div><div class="acts"><button type="button" class="btn ghost" data-shw="'+wk+'">'+ico('share')+' Partager</button><button type="button" class="btn" id="heyOk">Super !</button></div></div>';
  document.body.appendChild(o);countUp(o);o.addEventListener('click',e=>{if(e.target===o||e.target.id==='heyOk'||e.target.closest('[data-shw]')){o.classList.add('out');setTimeout(()=>o.remove(),280)}});return true}
document.addEventListener('click',e=>{const b=e.target.closest('[data-shw]');if(b&&typeof weekCard==='function')weekCard(b.dataset.shw)});
/* ---- R8 : défi du mois ---- */
const CHAL_N=n=>({n:'séances',dur:'minutes'})[n]||'';
function chalProg(c){if(!c)return 0;const ss=S.sessions.filter(s=>s.date.startsWith(c.m));if(c.k==='n')return ss.length;if(c.k==='dur')return ss.reduce((a,s)=>a+sDur(s),0);
  return ss.reduce((a,s)=>{const p=s.perf&&s.perf[c.ex];if(!p)return a;return a+(p.sec?(p.s||1)*p.sec:(p.r?(p.s||1)*p.r:0))},0)}
function chalSync(){const mk=TK.slice(0,7);if(S.chal&&S.chal.m!==mk){const c=S.chal;S.chalH.push({m:c.m,k:c.k,ex:c.ex,t:c.t,done:chalProg(c)>=c.t});S.chal=null;save()}}
const chalLab=c=>c.k==='n'?c.t+' séances':c.k==='dur'?fmtDur(c.t):c.t+' '+(isTimed(c.ex)?'secondes de ':'')+c.ex.toLowerCase();
function chalCard(){chalSync();const mn=mName(T.getFullYear(),T.getMonth(),'long'),won=S.chalH.filter(c=>c.done).length;
  if(!S.chal)return hcard(' data-chal="pick"',icBox('trophy'),'Défi de '+esc(mn),'Choisis ton défi du mois',won?won+' défi'+(won>1?'s':'')+' réussi'+(won>1?'s':'')+' 🏅':'300 tractions, 12 séances… à toi de voir !');
  const c=S.chal,p=chalProg(c),r=Math.min(1,p/c.t),dl=new Date(T.getFullYear(),T.getMonth()+1,0).getDate()-T.getDate();
  if(r>=1&&!c.won){c.won=1;save();setTimeout(()=>reward('🏅','Défi réussi !',chalLab(c)),600)}
  return '<button type="button" class="hc chal'+(r>=1?' won':'')+'" data-chal="pick"><span class="hcic">'+(r>=1?ico('medal'):Math.round(r*100)+'%')+'</span><div><p class="kick">Défi de '+esc(mn)+(r>=1?' · réussi !':' · encore '+dl+' jour'+(dl>1?'s':''))+'</p><b>'+esc(chalLab(c))+'</b><span class="track"><i style="width:'+(r*100).toFixed(1)+'%"></i></span><p>'+(c.k==='dur'?fmtDur(p)+' sur '+fmtDur(c.t):Math.round(p)+' sur '+c.t)+'</p></div>'+ico('chev','hcv')+'</button>'}
function chalSugg(){const out=[],prevM=key(new Date(T.getFullYear(),T.getMonth()-1,1)).slice(0,7),ex=favList().slice(0,4);
  const mk=TK.slice(0,7),dim=new Date(T.getFullYear(),T.getMonth()+1,0).getDate(),proj=v=>v*dim/Math.max(1,T.getDate());
  ex.forEach(x=>{const last=chalProg({m:prevM,k:'ex',ex:x}),cur=chalProg({m:mk,k:'ex',ex:x}),b=Math.max(last*1.15,proj(cur)*1.1,cur*1.2);const base=b>0?Math.ceil(b/10)*10:(/pompe/i.test(x)?600:/dip/i.test(x)?300:/traction|chin/i.test(x)?200:150);out.push({k:'ex',ex:x,t:base})});
  const ln=chalProg({m:prevM,k:'n'}),cn=chalProg({m:mk,k:'n'});out.push({k:'n',t:Math.max(8,ln+2,Math.ceil(proj(cn))+2,cn+2)});const ld=chalProg({m:prevM,k:'dur'}),cd=chalProg({m:mk,k:'dur'});out.push({k:'dur',t:Math.max(480,Math.ceil(Math.max(ld*1.1,proj(cd)*1.1,cd+60)/60)*60)});return out}
function chalPick(){const L=chalSugg(),c=S.chal;openSheet('<h3>Défi du mois</h3><p class="findsub">Choisis un objectif pour '+esc(mName(T.getFullYear(),T.getMonth(),'long'))+'. Tout ce que tu notes ce mois-ci compte.</p><div class="acl">'+L.map((x,i)=>'<button type="button" class="arow" data-chg="'+i+'">'+ico(x.k==='ex'?'target':x.k==='n'?'cal':'timer')+'<span>'+esc(chalLab(x))+'</span></button>').join('')+'</div><h5>Ou ton propre défi</h5><div class="fld"><select id="chEx" aria-label="Exercice">'+allEx().map(x=>'<option>'+esc(x)+'</option>').join('')+'</select><input id="chT" type="number" inputmode="numeric" min="1" placeholder="Total" style="max-width:110px"><button type="button" class="btn" data-chg="own">OK</button></div>'+(c?'<button type="button" class="btn ghost sm" data-chg="del" style="margin-top:14px">Retirer le défi</button>':'')+'<div class="acts"><button type="button" class="btn ghost" id="gClose">Fermer</button></div>');
  chalPick.L=L}
document.addEventListener('click',e=>{const b=e.target.closest('[data-chal],[data-chg]');if(!b)return;if(b.dataset.chal){chalPick();return}const v=b.dataset.chg,mk=TK.slice(0,7);
  if(v==='del'){S.chal=null}else if(v==='own'){const t=Math.round(+$('chT').value);if(!(t>0)){toast('Entre un total');return}S.chal={m:mk,k:'ex',ex:$('chEx').value,t}}else{const x=chalPick.L[+v];S.chal=Object.assign({m:mk},x)}
  save();closeSheet();renderHome();if(S.chal)toast('Défi lancé : '+chalLab(S.chal)+' 💪')});
