/* ===================== v6.1 : skills en carte de progression (façon jeu) ===================== */
let skSel='';
function skCur(){if(skSel&&SKILLS.some(s=>s.k===skSel))return skSel;let best='',bp=-1;
  SKILLS.forEach(sk=>{const n=Object.keys(skDone(sk.k)).length,t=sk.st.length;if(n<t&&n/t>bp){bp=n/t;best=sk.k}});return best||SKILLS[0].k}
function skLvHtml(){const x=xpTot(),li=lvlOf(x),cur=LVL[li],nx=LVL[li+1],pc=nx?(x-cur[0])/(nx[0]-cur[0]):1,C=2*Math.PI*42,cnt=[0,0,0,0];
  SKILLS.forEach(sk=>cnt[tierOf(Object.keys(skDone(sk.k)).length,sk.st.length)]++);const sel=skCur();
  return '<div class="lv6"><span class="lvs"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" class="lvt0"/><circle cx="50" cy="50" r="42" class="lvt1'+(pc<=0?' z':'')+'" stroke-dasharray="'+(C*pc).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 50 50)"/></svg><b>'+(li+1)+'</b><small>niveau</small></span>'
   +'<div class="lvx"><p class="kick">Ton rang</p><h3>'+esc(cur[1])+'</h3><p class="lvn">'+(nx?'Prochain rang : <b>'+esc(nx[1])+'</b>':'Rang maximum, respect ! 👑')+'</p><p class="mcount6"><span class="mt3">'+cnt[3]+'</span><span class="mt2">'+cnt[2]+'</span><span class="mt1">'+cnt[1]+'</span></p></div></div>'
   +'<div class="shelf6" role="tablist">'+SKILLS.map(sk=>'<button type="button" class="shm6'+(sk.k===sel?' on':'')+'" data-sksel="'+sk.k+'" role="tab" aria-selected="'+(sk.k===sel)+'">'+medal(sk,50)+'<span>'+esc(sk.n)+'</span></button>').join('')+'</div>'}
/* carte d'un skill : chemin en zigzag, le perso se tient à côté de l'étape à faire */
function skMapHtml(sk){const d=skDone(sk.k),n=Object.keys(d).length,t=sk.st.length,nx=sk.st.findIndex((s,i)=>!d[i]),R=112,T0=118,X=i=>i%2?72:28,Y=i=>T0+i*R,H=Y(t)+86;
  const pts=[];for(let i=0;i<=t;i++)pts.push([X(i),Y(i)]);
  let dDone='',dTodo='';for(let i=0;i<t;i++){const a=pts[i],b=pts[i+1],seg='M'+a[0]+' '+a[1]+' C'+a[0]+' '+(a[1]+R*.55)+' '+b[0]+' '+(b[1]-R*.55)+' '+b[0]+' '+b[1];if(i<n-1||(n===t&&i===t-1))dDone+=seg;else dTodo+=seg}
  let h='<div class="smap" style="height:'+H+'px"><svg class="spath" viewBox="0 0 100 '+H+'" preserveAspectRatio="none" aria-hidden="true">'
   +'<path d="'+dTodo+'" class="sp0" vector-effect="non-scaling-stroke"/><path d="'+dDone+'" class="sp1" vector-effect="non-scaling-stroke"/></svg>';
  h+='<div class="smh"><span class="smt">'+medal(sk,40)+'<b>'+esc(sk.n)+'</b></span><span class="smp">'+(n>=t?'Maîtrisé':TIER[tierOf(n,t)][0])+'</span></div>';
  sk.st.forEach((s,i)=>{const dn=!!d[i],st=dn?'done':i===nx?'next':'lock',left=X(i)<50;
    h+='<div class="mpn '+st+(left?' l':' r')+'" style="left:'+X(i)+'%;top:'+Y(i)+'px"><button type="button" class="mnode" data-sk="'+sk.k+':'+i+'" aria-pressed="'+dn+'" aria-label="'+esc(s)+'">'+(dn?CHK:st==='next'?'<b>'+(i+1)+'</b>':ico('lock'))+'</button>'
     +'<div class="mlab"><b>'+esc(s)+'</b><small>'+(dn?'Validé · '+dLong(d[i]):st==='next'?'À toi de jouer ! +'+skXp(i)+' XP':'+'+skXp(i)+' XP')+'</small></div>'
     +(st==='next'?'<span class="mchar">'+charSvg(myChar({pose:'idle',ex:'neutral'}))+'</span>':'')+'</div>'});
  const fin=n>=t;h+='<div class="mpn fin'+(fin?' done':'')+(X(t)<50?' l':' r')+'" style="left:'+X(t)+'%;top:'+Y(t)+'px"><span class="mnode mtro">'+ico('trophy')+'</span><div class="mlab"><b>'+(fin?'Skill maîtrisé !':'Objectif final')+'</b><small>'+(fin?'Médaille d\'or':'Toutes les étapes')+'</small></div>'+(fin?'<span class="mchar">'+charSvg(myChar({pose:'cheer',ex:'grin'}))+'</span>':'')+'</div>';
  return h+'</div>'}
function renderSkills(){const k=skCur(),sk=SKILLS.find(s=>s.k===k)||SKILLS[0];skSel=sk.k;
  $('skLv').innerHTML=skLvHtml();
  const tut=S.links.filter(l=>l.c==='skill'&&l.k===sk.k);
  $('skList').innerHTML='<section class="panel smapc">'+skMapHtml(sk)+'<div class="sktu"><h5 class="h5">Tutos vidéo</h5>'+tut.map(l=>linkHtml(l,1)).join('')+'<button type="button" class="chip addx sm" data-lknew="skill:'+sk.k+'">+ Tuto vidéo</button></div><p class="note">Touche une étape pour la valider. Touche deux fois une étape validée pour l\'annuler.</p></section>';
  const sh=document.querySelector('.shelf6 .on');if(sh&&sh.scrollIntoView)sh.scrollIntoView({block:'nearest',inline:'center'});
  const nx=document.querySelector('.smap .mpn.next');if(nx)nx.querySelector('.mchar')?.classList.add('hop')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-sksel]');if(!b)return;e.stopPropagation();skSel=b.dataset.sksel;renderSkills();
  const m=$('skList');if(m){const r=m.getBoundingClientRect();if(r.top<0||r.top>innerHeight*.6)m.scrollIntoView({behavior:'smooth',block:'start'})}},true);
