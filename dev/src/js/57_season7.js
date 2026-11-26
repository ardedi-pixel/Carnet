/* ===================== v7 : univers de saison sur toute l'interface =====================
   Choix de Diego : mini-illustrations en couleur dans les cases du calendrier, motifs au trait fin partout ailleurs.
   Actif avec un thème de saison (Printemps, Été, Automne, Hiver ou « Selon la saison »). */
const S7V=(vb,inner,extra)=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+vb+'"'+(extra||'')+'>'+inner+'</svg>';
const S7LN=' fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round"';
const SEA7={
 winter:{
  g:S7V('0 0 24 24','<path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9.4 4.1L12 5.8l2.6-1.7M9.4 19.9L12 18.2l2.6 1.7M3.6 10.1l2.8.3.2-2.9M20.4 13.9l-2.8-.3-.2 2.9M3.6 13.9l2.8-.3.2 2.9M20.4 10.1l-2.8.3-.2-2.9"/>',S7LN+' stroke-width="1.7"'),
  nav:S7V('0 0 120 10','<path d="M0 10V6.5c8-4 14-4 22-1s14 3 22-1 16-4 24 0 14 4 22 1 16-4 30-1V10z" fill="#000"/>'),
  gr:S7V('0 0 400 70','<path d="M0 60c40-14 80-14 120-4s80 10 120-2 100-14 160 2"/><path d="M60 52l8-16 8 16zM64 40l4-9 4 9M300 54l9-18 9 18zM305 41l4-9 4 9M68 52v5M309 54v5"/>',S7LN+' stroke-width="1.6"'),
  ill:[
   S7V('0 0 24 24','<circle cx="12" cy="16.4" r="6" fill="#fff" stroke="#c9d9ea" stroke-width=".8"/><circle cx="12" cy="8.2" r="4.2" fill="#fff" stroke="#c9d9ea" stroke-width=".8"/><path d="M8.4 11.2h7.2" stroke="#e2483d" stroke-width="1.8" stroke-linecap="round"/><path d="M12 8.6l3.1.8-3.1.6z" fill="#ff8a2a"/><circle cx="10.6" cy="7.2" r=".7" fill="#2a2d38"/><circle cx="13.4" cy="7.2" r=".7" fill="#2a2d38"/><circle cx="12" cy="15.2" r=".6" fill="#2a2d38"/><circle cx="12" cy="17.8" r=".6" fill="#2a2d38"/><path d="M8.6 4.2h6.8" stroke="#2a2d38" stroke-width="1.4" stroke-linecap="round"/><rect x="9.6" y="1.4" width="4.8" height="3" rx=".8" fill="#2a2d38"/>'),
   S7V('0 0 24 24','<path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9.4 4.1L12 5.8l2.6-1.7M9.4 19.9L12 18.2l2.6 1.7M3.6 10.1l2.8.3.2-2.9M20.4 13.9l-2.8-.3-.2 2.9M3.6 13.9l2.8-.3.2 2.9M20.4 10.1l-2.8.3-.2-2.9"/>',' fill="none" stroke="#bfe6ff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"'),
   S7V('0 0 24 24','<path d="M12 2l5 7h-2.5l4 6h-3l3.5 5h-14l3.5-5h-3l4-6H7z" fill="#2f8f5b"/><path d="M9.8 5.2c.8.5 1.5.5 2.2 0 .7.5 1.4.5 2.2 0M9.4 9.6c.9.6 1.8.6 2.6 0 .8.6 1.7.6 2.6 0M8 15.4c1.3.7 2.7.7 4 0 1.3.7 2.7.7 4 0" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/><rect x="11" y="20" width="2" height="2.6" fill="#7a4a2a"/>'),
   S7V('0 0 24 24','<path d="M8 20V10.5C8 7 9.8 5 12.3 5S16.5 7 16.5 10v2.3l1.6-1.6c.9-.9 2.3-.4 2.3.9 0 .5-.2 1-.6 1.4L16.5 16.4V20z" fill="#e2483d"/><rect x="7.4" y="18.4" width="9.8" height="3.4" rx="1.2" fill="#f7f3ee"/><path d="M10 9.5h4.5M10 12h4.5" stroke="#f7f3ee" stroke-width="1.1" stroke-linecap="round"/>')]},
 autumn:{
  g:S7V('0 0 24 24','<path d="M5 19.5C4.5 11 9.5 4.5 19.5 4c.5 9.5-5.5 15.5-14.5 15.5z"/><path d="M5 19.5L14 10M9.6 14.9l-.4-3.2M12 12.5l3.2.3"/>',S7LN+' stroke-width="1.7"'),
  nav:S7V('0 0 120 12','<path d="M0 11h120"/><path d="M30 11c-1-4 1-7 5-8 1 4-1 7-5 8zM30 11l4-6M86 11c2-3 5-4 8-3-1 3-4 5-8 3zM86 11l6-2"/>',S7LN+' stroke-width="1.3"'),
  gr:S7V('0 0 400 70','<path d="M0 62c50-10 100-10 150-2s100 8 150-2 70-6 100 0"/><path d="M80 56c-1-5 2-8 7-9 1 5-2 8-7 9zM80 56l5-7M230 58c2-4 6-5 10-3-2 4-6 5-10 3zM230 58l8-2M330 55c-2-4-1-8 3-10 2 4 1 8-3 10zM330 55l2-8"/>',S7LN+' stroke-width="1.6"'),
  ill:[
   S7V('0 0 24 24','<path d="M12 2l1.6 3.6 2.4-1-.6 3.8 3.4-1.4-1.2 3.2 3.4 1.2-3.6 2.4.8 1.6-4.6-.6.2 4.2h-3.6l.2-4.2-4.6.6.8-1.6-3.6-2.4 3.4-1.2L5 7l3.4 1.4L7.8 4.6l2.4 1z" fill="#e8792a"/><path d="M12 21.5v-9" stroke="#a6461c" stroke-width="1.2" stroke-linecap="round"/>'),
   S7V('0 0 24 24','<path d="M5 19C5 10 10 4 19 4c0 9-6 15-14 15z" fill="#c4521b"/><path d="M5 19L15 8M9 14.5l-.5-3M12 11.5l2.6.4" stroke="#7d2e10" stroke-width="1.1" stroke-linecap="round" fill="none"/>'),
   S7V('0 0 24 24','<ellipse cx="12" cy="14.5" rx="8.5" ry="6.5" fill="#f08a24"/><path d="M12 8.2c-2.2 1.6-2.2 11 0 12.6M12 8.2c2.2 1.6 2.2 11 0 12.6M7 9.5c-2 2.4-2 7.6 0 10M17 9.5c2 2.4 2 7.6 0 10" stroke="#c4621a" stroke-width="1" fill="none"/><path d="M12 8.5V5.2c0-1 .8-1.8 1.8-1.8" stroke="#3c7a3a" stroke-width="1.8" stroke-linecap="round" fill="none"/>'),
   S7V('0 0 24 24','<path d="M7 11h10c0 5.5-2.2 9.5-5 10.5C9.2 20.5 7 16.5 7 11z" fill="#c98b43"/><path d="M6 11.5c0-3 2.7-5 6-5s6 2 6 5z" fill="#7a4a24"/><path d="M12 6.5V4" stroke="#7a4a24" stroke-width="1.6" stroke-linecap="round"/>')]},
 spring:{
  g:S7V('0 0 24 24','<path d="M8.6 7.32A3.4 3.4 0 0 1 15.4 7.32A3.4 3.4 0 0 1 17.5 13.79A3.4 3.4 0 0 1 12 17.78A3.4 3.4 0 0 1 6.5 13.79A3.4 3.4 0 0 1 8.6 7.32z"/><circle cx="12" cy="12" r="1.5"/>',S7LN+' stroke-width="1.6"'),
  nav:S7V('0 0 120 12','<path d="M0 11h120M14 11l-2-5M18 11l1-6M22 11l3-4M70 11l-1-5M74 11l2-6"/><circle cx="46" cy="5" r="2"/><path d="M46 7v4"/><circle cx="98" cy="6" r="1.7"/><path d="M98 7.7V11"/>',S7LN+' stroke-width="1.3"'),
  gr:S7V('0 0 400 70','<path d="M0 64h400M30 64l-3-9M36 64l2-10M42 64l4-7M150 64l-2-8M156 64l3-9M270 64l-3-8M276 64l2-9M282 64l4-6"/><circle cx="95" cy="52" r="3"/><path d="M95 55v9"/><circle cx="215" cy="50" r="3.4"/><path d="M215 53.4V64"/><circle cx="350" cy="53" r="2.8"/><path d="M350 55.8V64"/>',S7LN+' stroke-width="1.6"'),
  ill:[
   S7V('0 0 24 24','<path d="M12 13v8.5" stroke="#3c8a4a" stroke-width="1.6" stroke-linecap="round"/><path d="M12 18c-2.8 0-4.6-1.6-5.2-4 2.4-.2 4.4.8 5.2 4zM12 19c2.6-.2 4.4-1.8 5-4.2-2.4 0-4.2 1.2-5 4.2z" fill="#4fa35a"/><path d="M7.5 5.5l2.2 2L12 4l2.3 3.5 2.2-2V10a4.5 4.5 0 0 1-9 0z" fill="#ff5f9e"/>'),
   S7V('0 0 24 24','<g fill="#fff" stroke="#e6dfee" stroke-width=".5"><ellipse cx="12" cy="6" rx="2.4" ry="4"/><ellipse cx="12" cy="18" rx="2.4" ry="4"/><ellipse cx="6" cy="12" rx="4" ry="2.4"/><ellipse cx="18" cy="12" rx="4" ry="2.4"/><ellipse cx="7.8" cy="7.8" rx="2.2" ry="3.8" transform="rotate(-45 7.8 7.8)"/><ellipse cx="16.2" cy="16.2" rx="2.2" ry="3.8" transform="rotate(-45 16.2 16.2)"/><ellipse cx="16.2" cy="7.8" rx="2.2" ry="3.8" transform="rotate(45 16.2 7.8)"/><ellipse cx="7.8" cy="16.2" rx="2.2" ry="3.8" transform="rotate(45 7.8 16.2)"/></g><circle cx="12" cy="12" r="3.2" fill="#ffc83d"/>'),
   S7V('0 0 24 24','<g fill="#ffb6d2"><circle cx="12" cy="7" r="3.6"/><circle cx="16.8" cy="10.5" r="3.6"/><circle cx="15" cy="16" r="3.6"/><circle cx="9" cy="16" r="3.6"/><circle cx="7.2" cy="10.5" r="3.6"/></g><circle cx="12" cy="12" r="2.1" fill="#ff7aa8"/>'),
   S7V('0 0 24 24','<path d="M12 21v-8" stroke="#3c8a4a" stroke-width="1.6" stroke-linecap="round"/><path d="M12 14c0-4-2.5-6.5-7-6.5 0 4 2.6 6.5 7 6.5zM12 12c0-3.6 2.3-6 6.5-6 0 3.6-2.4 6-6.5 6z" fill="#6cc070"/>')]},
 summer:{
  g:S7V('0 0 24 24','<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',S7LN+' stroke-width="1.7"'),
  nav:S7V('0 0 120 12','<path d="M0 8c10 0 10-5 20-5s10 5 20 5 10-5 20-5 10 5 20 5 10-5 20-5 10 5 20 5"/>',S7LN+' stroke-width="1.4"'),
  gr:S7V('0 0 400 70','<path d="M0 60c15 0 15-6 30-6s15 6 30 6 15-6 30-6 15 6 30 6 15-6 30-6 15 6 30 6 15-6 30-6 15 6 30 6 15-6 30-6 15 6 30 6 15-6 30-6 15 6 30 6 15-6 30-6 15 6 40 6"/><path d="M0 67c20 0 20-4 40-4s20 4 40 4 20-4 40-4 20 4 40 4 20-4 40-4 20 4 40 4 20-4 40-4 20 4 40 4 20-4 40-4 20 4 40 4"/>',S7LN+' stroke-width="1.6"'),
  ill:[
   S7V('0 0 24 24','<path d="M12 11.2l2.4 10" stroke="#8a6a4a" stroke-width="1.5" stroke-linecap="round"/><path d="M2.6 11.4a9.4 8 0 0 1 18.8 0z" fill="#ff5a4e"/><path d="M8.6 11.4C8.8 7 10.2 4.4 12 3.4c1.8 1 3.2 3.6 3.4 8z" fill="#fff"/><path d="M5 21.6h14" stroke="#f1d39a" stroke-width="2" stroke-linecap="round"/>'),
   S7V('0 0 24 24','<circle cx="12" cy="12" r="4.6" fill="#ffd23f"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="#ffb31a" stroke-width="1.8" stroke-linecap="round"/>'),
   S7V('0 0 24 24','<path d="M12 2.5l2.6 6.3 6.8.5-5.2 4.4 1.7 6.7L12 16.8l-5.9 3.6 1.7-6.7-5.2-4.4 6.8-.5z" fill="#ff8a3d" stroke="#e0662a" stroke-width=".8" stroke-linejoin="round"/><circle cx="12" cy="11" r=".7" fill="#fff"/><circle cx="12" cy="8" r=".5" fill="#fff"/><circle cx="14.6" cy="12" r=".5" fill="#fff"/><circle cx="9.4" cy="12" r=".5" fill="#fff"/>'),
   S7V('0 0 24 24','<path d="M2 14c2.5 0 2.5-2.5 5-2.5S9.5 14 12 14s2.5-2.5 5-2.5 2.5 2.5 5 2.5" stroke="#2cc0dc" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M2 19c2.5 0 2.5-2.5 5-2.5S9.5 19 12 19s2.5-2.5 5-2.5 2.5 2.5 5 2.5" stroke="#7fd4ff" stroke-width="2" fill="none" stroke-linecap="round"/>')]}
};
/* feuille de style générée : une variable par motif et par saison, réutilisée par 66_v7.css */
function sea7Css(){return Object.keys(SEA7).map(k=>{const s=SEA7[k];return 'html[data-season='+k+']{--sg:'+svgUrl(s.g)+';--snav:'+svgUrl(s.nav)+';--sgr:'+svgUrl(s.gr)+'}'+s.ill.map((x,i)=>'html[data-season='+k+'] .dco.v'+i+'{background-image:'+svgUrl(x)+'}').join('')}).join('\n')}
(function(){const st=document.createElement('style');st.id='sea7css';st.textContent=sea7Css();document.head.appendChild(st)})();
/* décor dans une case du calendrier : environ un jour vide sur trois, toujours le même pour une date donnée */
function dcoOf(k){let h=7;for(let i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))|0;h=Math.abs(h);return h%3?'':'<span class="dco v'+(Math.floor(h/3)%4)+'" aria-hidden="true"></span>'}
/* ---- saison active + ambiance animée discrète (neige, feuilles, pétales, reflets d'été) ---- */
let fx7Raf=0,fx7P=[],fx7T=0;
function sea7Sync(){const k=(curTh()||{}).season||'',d=document.documentElement;if(!k)delete d.dataset.season;else if(d.dataset.season!==k)d.dataset.season=k;
  let g=$('sgr7');if(k&&!g){g=document.createElement('div');g.id='sgr7';g.setAttribute('aria-hidden','true');document.body.appendChild(g)}else if(!k&&g)g.remove();
  fx7Sync()}
function fx7Sync(){const k=document.documentElement.dataset.season,on=!!k&&S.seas&&!document.hidden&&!rmOn();let c=$('fx7');
  if(!on){if(c)c.remove();cancelAnimationFrame(fx7Raf);fx7Raf=0;return}
  if(!c){c=document.createElement('canvas');c.id='fx7';c.setAttribute('aria-hidden','true');document.body.appendChild(c);fx7P=[]}
  if(!fx7Raf)fx7Raf=requestAnimationFrame(fx7Step)}
function fx7Step(t){const c=$('fx7');if(!c){fx7Raf=0;return}fx7Raf=requestAnimationFrame(fx7Step);if(t-fx7T<32)return;fx7T=t; /* ~30 images/s, suffisant et économe */
  const k=document.documentElement.dataset.season,dpr=Math.min(2,devicePixelRatio||1),W=innerWidth,H=innerHeight;if(c.width!==Math.round(W*dpr)||c.height!==Math.round(H*dpr)){c.width=Math.round(W*dpr);c.height=Math.round(H*dpr)}
  const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
  if(fx7P.k!==k){fx7P=[];fx7P.k=k}const N=k==='winter'?22:k==='summer'?12:12;
  const PC={spring:['#ffc1dc','#ff9cc7','#ffe3ef'],summer:['#ffe7a0','#ffd23f','#fff6d6'],autumn:['#e8792a','#c4521b','#d9a23a'],winter:['#ffffff']}[k];
  while(fx7P.length<N){const up=k==='summer';fx7P.push({x:Math.random()*W,y:up?H*Math.random()+H*.3:Math.random()*H-H,s:k==='winter'?1+Math.random()*2.2:k==='summer'?1.2+Math.random()*1.8:3+Math.random()*3,v:k==='winter'?.5+Math.random()*.7:k==='summer'?-(.25+Math.random()*.35):.6+Math.random()*.6,a:Math.random()*6.28,w:.5+Math.random(),c:PC[Math.floor(Math.random()*PC.length)]})}
  fx7P.forEach(p=>{p.y+=p.v;p.a+=.02*p.w;p.x+=Math.sin(p.a)*(k==='winter'?.5:k==='summer'?.3:1.1);
    if(p.y>H+14){p.y=-14;p.x=Math.random()*W}if(p.y<-14){p.y=H+14;p.x=Math.random()*W}
    g.save();g.translate(p.x,p.y);
    if(k==='winter'){g.globalAlpha=.55;g.fillStyle='#fff';g.beginPath();g.arc(0,0,p.s,0,6.28);g.fill()}
    else if(k==='summer'){g.globalAlpha=.25+.3*Math.abs(Math.sin(p.a*1.6));g.fillStyle=p.c;g.beginPath();g.arc(0,0,p.s,0,6.28);g.fill()}
    else{g.rotate(p.a);g.globalAlpha=.6;g.fillStyle=p.c;g.beginPath();if(k==='autumn'){g.moveTo(0,-p.s*1.3);g.quadraticCurveTo(p.s,0,0,p.s*1.3);g.quadraticCurveTo(-p.s,0,0,-p.s*1.3)}else g.ellipse(0,0,p.s,p.s*.6,0,0,6.28);g.fill()}
    g.restore()})}
document.addEventListener('visibilitychange',()=>{try{fx7Sync()}catch(e){}});
