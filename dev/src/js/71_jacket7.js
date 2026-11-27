/* ===================== v7.3 : la veste des badges, une par saison =====================
   Remplace la veste en jean (D9). La veste suit la saison active, comme toutes les illustrations (seaNow()) :
   hiver = doudoune à capuche, printemps = bomber, été = coupe-vent, automne = veste en velours côtelé.
   Les quatre ont la même silhouette, donc les mêmes emplacements de pin's (JK_XY, repère 320 x 300). */
const JK_SL='M86 44C66 48 48 54 38 62C26 72 21 86 19 102L9 213C8 222 13 227 21 228L55 232C63 233 67 228 67 220L77 122Z';
const JK_B='M86 44C108 37 132 33 160 33C188 33 212 37 234 44L243 122L249 256C222 264 192 267 160 267C128 267 98 264 71 256L77 122Z';
const jkM=d=>d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g,(m,x,y)=>(Math.round((320-x)*10)/10)+' '+y); /* miroir gauche-droite (coordonnées absolues) */
const JK_SR=jkM(JK_SL);
/* emplacements des pin's, dans l'ordre de remplissage : poitrine, puis on descend en alternant avec les manches */
const JK_XY=[[100,72],[220,72],[134,74],[186,74],[100,105],[186,107],[134,107],[220,105],[62,88],[258,88],
  [100,138],[220,138],[134,140],[186,140],[54,124],[266,124],[100,171],[186,173],[134,173],[220,171],[46,160],[274,160],
  [100,204],[220,204],[134,206],[186,206],[38,196],[282,196],[100,237],[220,237],[134,238],[186,238],[160,252],[160,120]];
const JK_OL='#1b1b1f';
const jkP=(d,f,x)=>'<path d="'+d+'" fill="'+f+'"'+(x||'')+'/>';
const jkS=(d,c,w,x)=>'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
/* silhouette commune : manches puis corps (remplissage), détails coupés à la forme, contour par-dessus */
function jkBase(c,inSL,inSR,inB){return '<defs><clipPath id="jkcL"><path d="'+JK_SL+'"/></clipPath><clipPath id="jkcR"><path d="'+JK_SR+'"/></clipPath><clipPath id="jkcB"><path d="'+JK_B+'"/></clipPath>'+(c.defs||'')+'</defs>'
  +(c.back||'')+jkP(JK_SL,c.sl||c.base)+jkP(JK_SR,c.sl||c.base)+'<g clip-path="url(#jkcL)">'+inSL+'</g><g clip-path="url(#jkcR)">'+inSR+'</g>'
  +jkS(JK_SL,JK_OL,2.6)+jkS(JK_SR,JK_OL,2.6)+jkP(JK_B,c.base)+'<g clip-path="url(#jkcB)">'+inB+'</g>'+jkS(JK_B,JK_OL,2.6)}
/* ---- hiver : doudoune bleu glacier, capuche bordée de fourrure, col montant ---- */
function jkWinter(){const c={base:'#8fb9e6',defs:'<linearGradient id="jkWg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6eafc"/><stop offset=".45" stop-color="#9cc3ec"/><stop offset="1" stop-color="#6d9bd3"/></linearGradient>'};
  const fur=[];for(let i=0;i<=12;i++){const a=Math.PI*(1-i/12),x=160+Math.cos(a)*50,y=44-Math.sin(a)*32;fur.push('<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(i%2?7:8.4)+'"/>')}
  c.back=jkP('M110 50C106 26 130 9 160 9C190 9 214 26 210 50Z','#7aa8dc')+jkS('M110 50C106 26 130 9 160 9C190 9 214 26 210 50',JK_OL,2.6)
   +'<g fill="'+JK_OL+'">'+fur.join('').replace(/r="([\d.]+)"/g,(m,r)=>'r="'+(+r+1.6)+'"')+'</g><g fill="#f3eee4">'+fur.join('')+'</g>'
   +'<g fill="#ddd5c6">'+fur.filter((f,i)=>i%3===1).join('').replace(/r="([\d.]+)"/g,(m,r)=>'r="'+(r*.45).toFixed(1)+'"')+'</g>';
  let b='';const Y=[44,80,114,148,182,216,250,284];
  for(let i=0;i<Y.length-1;i++){const a=Y[i],e=Y[i+1];b+=jkP('M60 '+a+'C120 '+(a+7)+' 200 '+(a+7)+' 260 '+a+'L260 '+e+'C200 '+(e+7)+' 120 '+(e+7)+' 60 '+e+'Z','url(#jkWg)')}
  b+=Y.slice(1,-1).map(y=>jkS('M60 '+y+'C120 '+(y+7)+' 200 '+(y+7)+' 260 '+y,'#5a86c2',1.8)).join('');
  b+=jkS('M86 232L112 226M234 232L208 226','#2c3e5a',2.4)+jkP('M60 252C120 260 200 260 260 252L262 272L58 272Z','#6f9bd3')+jkS('M60 252C120 260 200 260 260 252','#5a86c2',1.6);
  const sl=m=>{let s='';const L=[60,96,132,168,204,240];for(let i=0;i<L.length-1;i++){const a=L[i],e=L[i+1];s+=jkP(m('M0 '+a+' L100 '+(a+8)+' L100 '+(e+8)+' L0 '+e+' Z'),'url(#jkWg)')}
    return s+L.slice(1,-1).map(y=>jkS(m('M0 '+y+' L100 '+(y+8)),'#5a86c2',1.8)).join('')+jkP(m('M0 206 L100 214 L100 260 L0 260 Z'),'#6f9bd3')+jkS(m('M0 206 L100 214'),'#5a86c2',1.6)};
  let s=jkBase(c,sl(d=>d),sl(jkM),b);
  s+=jkP('M124 54C121 42 125 33 130 31C142 27 178 27 190 31C195 33 199 42 196 54C184 48 136 48 124 54Z','#9cc3ec')+jkS('M124 54C121 42 125 33 130 31C142 27 178 27 190 31C195 33 199 42 196 54C184 48 136 48 124 54Z',JK_OL,2.4);
  s+=jkS('M160 30V264','#24364f',4.2)+jkS('M160 32V262','#9fb4cf',1.4,' stroke-dasharray="1.6 2.4"')+'<rect x="155.5" y="46" width="9" height="15" rx="3" fill="#24364f"/><rect x="158" y="50" width="4" height="7" rx="1.5" fill="#9fb4cf"/>';
  return s}
/* ---- printemps : bomber rose poudré, bords-côtes verts rayés crème, poche de manche ---- */
function jkSpring(){const c={base:'#f4b9c8'},rib='#3a9452',st='#fbf3e3';
  const band=(m,y0,y1)=>{let s=jkP(m('M-10 '+y0+' L340 '+y0+' L340 '+y1+' L-10 '+y1+' Z'),rib);const h=(y1-y0)/5;s+=jkS(m('M-10 '+(y0+h*1.6)+' L340 '+(y0+h*1.6)),st,2.2)+jkS(m('M-10 '+(y0+h*3)+' L340 '+(y0+h*3)),st,2.2);for(let x=-8;x<340;x+=5)s+=jkS(m('M'+x+' '+y0+' L'+x+' '+y1),'#2f7d44',.8,' opacity=".55"');return s};
  let b=jkP('M60 30L260 30L260 120C200 128 120 128 60 120Z','#f8c9d4',' opacity=".55"')+jkS('M78 250C130 256 190 256 242 250','#de95a8',2)+band(d=>d,244,272);
  b+=['<g transform="rotate(62 108 196)">','<g transform="rotate(-62 212 196)">'].map((g,i)=>{const x=i?196:92;return g+'<rect x="'+x+'" y="193" width="30" height="5" rx="2.5" fill="#e9a7b8" stroke="#b9707f" stroke-width="1.3"/>'+'</g>'}).join('');
  const sl=(m,pocket)=>{let s=jkP(m('M0 40 L100 40 L100 120 L0 112 Z'),'#f8c9d4',' opacity=".5"')+band(m,206,240);
    if(pocket)s+='<g transform="rotate(5 46 120)">'+jkP('M32 104H60V132H32Z','#efa9bb')+jkS('M32 104H60V132H32Z',JK_OL,1.8)+jkS('M35 111H57','#d9b45a',2)+jkS('M38 112V128M44 112V128','#de95a8',1.4)+'</g>';
    return s};
  let s=jkBase(c,sl(d=>d,1),sl(jkM,0),b);
  s+=jkP('M120 48C118 38 126 30 134 30C148 27 172 27 186 30C194 30 202 38 200 48C188 42 132 42 120 48Z',rib)+jkS('M121 41C138 35 182 35 199 41',st,2)+jkS('M120 48C118 38 126 30 134 30C148 27 172 27 186 30C194 30 202 38 200 48C188 42 132 42 120 48Z',JK_OL,2.4);
  s+=jkS('M160 46V246','#c98394',3)+jkS('M160 48V244','#fbe7ec',1.2,' stroke-dasharray="1.5 2.3"')+'<rect x="156" y="50" width="8" height="13" rx="2.6" fill="#d9b45a" stroke="'+JK_OL+'" stroke-width="1.4"/>';
  return s}
/* ---- été : coupe-vent bicolore mer et soleil, capuche roulée dans le col, poche kangourou ---- */
function jkSummer(){const c={base:'#fdfbf6'},tq='#2ec5df',oc='#1689c2',or='#ffa21f';
  const blocks=m=>jkP(m('M-10 0 L340 0 L340 96 C240 104 80 104 -10 96 Z'),tq)+jkP(m('M-10 98 C80 106 240 106 340 98 L340 103 C240 111 80 111 -10 103 Z'),or)+jkP(m('M-10 160 C80 168 240 168 340 160 L340 320 L-10 320 Z'),oc)+jkS(m('M-10 160 C80 168 240 168 340 160'),'#f6dba1',3);
  let b=blocks(d=>d)+jkP('M112 186C112 180 116 176 122 176H198C204 176 208 180 208 186V226C208 232 204 236 198 236H122C116 236 112 232 112 226Z','#1a93cc')+jkS('M112 186C112 180 116 176 122 176H198C204 176 208 180 208 186V226C208 232 204 236 198 236H122C116 236 112 232 112 226Z','#0f6a99',2)+jkS('M117 186C117 183 119 181 122 181H198C201 181 203 183 203 186','#8fdcef',1.2,' stroke-dasharray="2.4 2.4"');
  b+=jkS('M70 252C130 260 190 260 250 252','#0f6a99',2.4)+[84,108,132,156,180,204,228].map(x=>jkS('M'+x+' 254V266','#0f6a99',1.2)).join('');
  const sl=m=>blocks(d=>m(d))+jkS(m('M0 214 L100 222'),'#0f6a99',2.4)+[16,30,44,58].map(x=>jkS(m('M'+x+' 217 L'+(x-1)+' 230'),'#0f6a99',1.2)).join('');
  let s=jkBase(c,sl(d=>d),sl(jkM),b);
  s+=jkP('M114 52C108 40 120 26 136 24C150 22 170 22 184 24C200 26 212 40 206 52C190 44 130 44 114 52Z',tq)+jkS('M118 44C136 34 184 34 202 44','#1fa6c0',2)+jkS('M114 52C108 40 120 26 136 24C150 22 170 22 184 24C200 26 212 40 206 52C190 44 130 44 114 52Z',JK_OL,2.4);
  s+=jkS('M160 46V128','#0e5f8a',3.4)+'<rect x="155.5" y="56" width="9" height="13" rx="3" fill="'+or+'" stroke="'+JK_OL+'" stroke-width="1.4"/>';
  s+=jkS('M140 48C138 62 140 74 136 86M180 48C182 62 180 74 184 86','#ffffff',2.6)+'<rect x="132.5" y="84" width="7" height="9" rx="2.6" fill="'+or+'" stroke="'+JK_OL+'" stroke-width="1.2"/><rect x="180.5" y="84" width="7" height="9" rx="2.6" fill="'+or+'" stroke="'+JK_OL+'" stroke-width="1.2"/>';
  return s}
/* ---- automne : veste en velours côtelé rouille, col moumoute, poches plaquées, boutons ---- */
function jkAutumn(){const c={base:'#b85b2d'},dk='#93451f',top='#e9a873';
  const ribs=(x0,x1)=>{let s='';for(let x=x0;x<x1;x+=5.5)s+=jkS('M'+x+' 0V320','#7e3a1b',1.3,' opacity=".38"');return s};
  let b=jkP('M60 0H160V320H60Z','#c56634',' opacity=".35"')+ribs(58,262);
  const pk=(x,y,w,h,fl)=>jkP('M'+x+' '+y+'H'+(x+w)+'V'+(y+h-6)+'Q'+(x+w)+' '+(y+h)+' '+(x+w-6)+' '+(y+h)+'H'+(x+6)+'Q'+x+' '+(y+h)+' '+x+' '+(y+h-6)+'Z',dk)+jkS('M'+(x+3)+' '+(y+3)+'V'+(y+h-5)+'Q'+(x+3)+' '+(y+h-3)+' '+(x+6)+' '+(y+h-3)+'H'+(x+w-6)+'Q'+(x+w-3)+' '+(y+h-3)+' '+(x+w-3)+' '+(y+h-5)+'V'+(y+3),top,1.2,' stroke-dasharray="3 2.6"')
    +(fl?jkP('M'+(x-2)+' '+(y-4)+'H'+(x+w+2)+'V'+(y+9)+'Q'+(x+w/2)+' '+(y+16)+' '+(x-2)+' '+(y+9)+'Z','#a5512a')+jkS('M'+(x-2)+' '+(y-4)+'H'+(x+w+2)+'V'+(y+9)+'Q'+(x+w/2)+' '+(y+16)+' '+(x-2)+' '+(y+9)+'Z',JK_OL,1.6)+'<circle cx="'+(x+w/2)+'" cy="'+(y+9)+'" r="2.6" fill="#4a2f1d"/>':'')+jkS('M'+x+' '+y+'H'+(x+w)+'V'+(y+h-6)+'Q'+(x+w)+' '+(y+h)+' '+(x+w-6)+' '+(y+h)+'H'+(x+6)+'Q'+x+' '+(y+h)+' '+x+' '+(y+h-6)+'Z',JK_OL,1.6);
  b+=pk(90,112,40,34,1)+pk(190,112,40,34,1)+pk(84,190,50,48,0)+pk(186,190,50,48,0);
  b+=jkS('M70 250C130 258 190 258 250 250',dk,2.2)+jkS('M72 255C130 263 190 263 248 255',top,1,' stroke-dasharray="3 2.6"');
  const sl=m=>{let q=jkP(m('M0 0 L100 0 L100 320 L0 320 Z'),'#c56634',' opacity=".25"');for(let x=-4;x<104;x+=5.5)q+=jkS(m('M'+x+' 0 L'+x+' 320'),'#7e3a1b',1.3,' opacity=".38"');return q+jkP(m('M0 204 L100 211 L100 260 L0 260 Z'),dk)+jkS(m('M0 208 L100 215'),top,1,' stroke-dasharray="3 2.6"')};
  let s=jkBase(c,sl(d=>d),sl(jkM),b);
  const col='M120 40C124 30 140 26 160 26C180 26 196 30 200 40L214 58L186 100L160 70L134 100L106 58Z';
  s+=jkP(col,'#f1e5d0')+'<g clip-path="url(#jkcC)">'+Array.from({length:26},(_,i)=>{const x=108+(i*37)%104,y=30+(i*53)%68;return '<path d="M'+x+' '+y+'q2.4-2.6 4.8 0" fill="none" stroke="#d6c4a6" stroke-width="1.3" stroke-linecap="round"/>'}).join('')+'</g>'+jkS(col,JK_OL,2.4)+jkS('M134 100L160 70L186 100',JK_OL,2.2);
  s=s.replace('</defs>','<clipPath id="jkcC"><path d="'+col+'"/></clipPath></defs>');
  s+=jkS('M160 72V262',JK_OL,2)+jkS('M164 76V260',top,1,' stroke-dasharray="3 2.6"')+[118,150,182,214,244].map(y=>'<circle cx="160" cy="'+y+'" r="4.6" fill="#4a2f1d" stroke="'+JK_OL+'" stroke-width="1.4"/><circle cx="158.8" cy="'+(y-1.2)+'" r="1.4" fill="#8a6446"/>').join('');
  return s}
const JK_FN={winter:jkWinter,spring:jkSpring,summer:jkSummer,autumn:jkAutumn};
function jacketSvg(sea){const f=JK_FN[sea]||jkAutumn;return '<svg viewBox="0 0 320 300" aria-hidden="true" data-jk="'+(JK_FN[sea]?sea:'autumn')+'">'+f()+'</svg>'}
