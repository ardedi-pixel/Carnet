/* ===================== v6 : noter une séance ===================== */
/* ---- S6 (v6.1) : ressenti en curseur avec une jauge d'énergie ---- */
const EG_C=['#6b7280','#ff6b5b','#ffc83d','#2fd27a'];
function egHtml(v){return '<div class="eg v'+v+'" style="--v:'+v+';--ec:'+EG_C[v]+'"><span class="egc"></span><span class="egb"><i></i><em></em></span><svg class="egz" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4.5 13.5h6.2L9.6 22l9.4-12h-6.3z"/></svg></div>'}
function egSet(f,v){const g=f&&f.querySelector('.eg');if(!g)return;g.className='eg v'+v;g.style.setProperty('--v',v);g.style.setProperty('--ec',EG_C[v]);g.classList.remove('pop');void g.offsetWidth;g.classList.add('pop')}
function feel6(){const box=$('cFeel');if(!box||!form)return;const old=box.querySelector('.chips.feel');if(!old)return;const v=form.feel||0;
  const w=document.createElement('div');w.className='feel6'+(v?'':' unset');w.innerHTML='<div class="fface" aria-hidden="true">'+egHtml(v)+'</div><div class="fsl"><b class="flab">'+(v?FEEL[v-1][2]:'Comment c\'était ?')+'</b><input type="range" min="1" max="3" step="1" value="'+(v||2)+'" id="fFeel" aria-label="Ressenti"><div class="fticks"><span>Bof</span><span>Bien</span><span>Au top</span></div></div>'+(v?'<button type="button" class="ib fclr" data-fclr="1" aria-label="Effacer le ressenti">'+ico('close')+'</button>':'');
  old.replaceWith(w)}
function drawMeta(){drawMeta5();feel6()}
document.addEventListener('input',e=>{if(e.target.id!=='fFeel'||!form)return;const v=+e.target.value;form.feel=v;const w=e.target.closest('.feel6');w.classList.remove('unset');egSet(w.querySelector('.fface'),v);w.querySelector('.flab').textContent=FEEL[v-1][2];if(!w.querySelector('.fclr')){const b=document.createElement('button');b.type='button';b.className='ib fclr';b.dataset.fclr='1';b.setAttribute('aria-label','Effacer le ressenti');b.innerHTML=ico('close');w.appendChild(b)}});
document.addEventListener('pointerdown',e=>{const r=e.target.closest('#fFeel');if(r&&form&&!form.feel){form.feel=+r.value;setTimeout(()=>r.dispatchEvent(new Event('input',{bubbles:true})),0)}});
document.addEventListener('click',e=>{if(e.target.closest('[data-fclr]')&&form){form.feel=0;feel6r()}});
function feel6r(){const w=document.querySelector('.feel6');if(!w)return;const p=document.createElement('div');p.className='chips feel';w.replaceWith(p);feel6()}
/* ---- S7 : le clavier ne cache jamais le champ + bouton Suivant ---- */
let kbEl=null;
function kbFields(){const b=document.querySelector('#sheet.open .box');return b?[...b.querySelectorAll('input:not([type=range]):not([type=date]):not([type=search]):not([type=checkbox]),textarea')].filter(x=>x.offsetParent!==null):[]}
function kbOpen(){const vv=window.visualViewport;return !!vv&&innerHeight-vv.height>120}
function kbPos(){const n=$('kbNext');if(!n||!kbEl)return;const vv=window.visualViewport;const bottom=vv?vv.offsetTop+vv.height:innerHeight;n.style.top=(bottom-54)+'px';n.hidden=!kbOpen()}
document.addEventListener('focusin',e=>{const t=e.target;if(!t.closest||!t.closest('#sheet .box')||!t.matches('input,textarea')||t.type==='range'||t.type==='date'||t.type==='search')return;kbEl=t;
  setTimeout(()=>{if(document.activeElement===t)t.scrollIntoView({block:'center',behavior:'smooth'})},320);
  let n=$('kbNext');if(!n){n=document.createElement('button');n.type='button';n.id='kbNext';n.className='kbn';document.body.appendChild(n)}const L=kbFields(),i=L.indexOf(t);n.innerHTML=i>=0&&i<L.length-1?'Suivant '+ico('chev'):'OK '+ico('check');kbPos();setTimeout(kbPos,350);setTimeout(kbPos,800)});
document.addEventListener('focusout',()=>{setTimeout(()=>{const a=document.activeElement;if(!a||!a.closest||!a.closest('#sheet .box')||!a.matches('input,textarea')){const n=$('kbNext');if(n)n.hidden=true;kbEl=null}},120)});
document.addEventListener('pointerdown',e=>{if(e.target.closest('#kbNext'))e.preventDefault()});
document.addEventListener('click',e=>{if(!e.target.closest('#kbNext')||!kbEl)return;const L=kbFields(),i=L.indexOf(kbEl);if(i>=0&&i<L.length-1){L[i+1].focus();L[i+1].select&&L[i+1].select()}else{kbEl.blur();const n=$('kbNext');if(n)n.hidden=true}});
if(window.visualViewport){visualViewport.addEventListener('resize',kbPos);visualViewport.addEventListener('scroll',kbPos)}
document.addEventListener('keydown',e=>{if(e.key!=='Enter'||!kbEl||kbEl.tagName==='TEXTAREA')return;const L=kbFields(),i=L.indexOf(kbEl);if(i>=0&&i<L.length-1){e.preventDefault();L[i+1].focus()}});
/* ---- S8 : mini-récap avant d'enregistrer ---- */
let recapOK=false;
document.addEventListener('click',e=>{const b=e.target.closest('#ok');if(!b||!form||recapOK||form.editId)return;e.stopPropagation();e.preventDefault();showRecap6()},true);
function showRecap6(){const d=form.date&&form.date<=TK?form.date:(sel<=TK?sel:TK),pl=form.place||'street',f=form.feel?FEEL[form.feel-1]:null;
  const perfL=form.ex.map(x=>{const p=form.perf[x]||{},o={perf:{}};o.perf[x]={s:+p.s||0,r:+p.r||0,kg:+p.kg||0,sec:+p.sec||0};return '<li><b>'+esc(x)+'</b>'+perfTxt(o,x)+'</li>'}).join('');
  let o=$('rc6');if(o)o.remove();o=document.createElement('div');o.id='rc6';o.className='rc6';
  o.innerHTML='<div class="rcard"><div class="rcpic">'+scene(pl,d)+'<b class="tagp">'+esc(plN[pl]||pl)+'</b></div><div class="rcb"><p class="kick">Vérifie avant de coller</p><h3>'+esc(fmtDay(parse(d)))+'</h3>'+(form.types.length?'<div class="stickers">'+form.types.filter(okT).map(t=>'<span class="stkr" style="background:'+tyC[t]+'"><span class="ic">'+ic(t)+'</span>'+esc(tyN[t])+'</span>').join('')+'</div>':'')
   +'<p class="rcm">'+esc([form.tod?todN[form.tod]:'',+form.dur>0?fmtDur(+form.dur):''].filter(Boolean).join(' · '))+(f?' · '+f[1]+' '+f[2]:'')+'</p>'+(perfL?'<ul class="rcl">'+perfL+'</ul>':'<p class="rcm">Aucun exercice coché. Tu peux quand même coller la séance.</p>')+'</div><div class="acts"><button type="button" class="btn ghost" id="rcBack">'+ico('edit')+' Modifier</button><button type="button" class="btn" id="rcGo">'+ico('check')+' Coller la séance</button></div></div>';
  $('sheet').appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
  o.addEventListener('click',e=>{if(e.target.closest('#rcBack')||e.target===o){o.classList.remove('on');setTimeout(()=>o.remove(),220)}else if(e.target.closest('#rcGo')){o.remove();recapOK=true;try{submitForm()}catch(err){toast('Erreur : '+(err&&err.message||err))}recapOK=false}})}
