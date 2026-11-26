/* ===================== v6 : personnages dessinés (rig SVG) ===================== */
const CH_SKIN=['#f6d8c4','#ebbd99','#d69c70','#b97b4f','#8f5a37','#5f3a25'];
const CH_HAIRC={noir:'#1c1613',brun:'#4a2d1c',chatain:'#7e5230',blond:'#d6ad5f',roux:'#b0512a',gris:'#aaa6a0'};
const CH_HAIRN={noir:'Noir',brun:'Brun',chatain:'Châtain',blond:'Blond',roux:'Roux',gris:'Gris'};
const CH_SHIRT={acc:'',noir:'#23242b',blanc:'#eceef1',gris:'#7b818b',rouge:'#cf3434',bleu:'#2d6cd4',vert:'#2a9a58',rose:'#df5196',orange:'#ec7b1f',violet:'#7653d4'};
const CH_SHIRTN={acc:'Couleur de l\'appli',noir:'Noir',blanc:'Blanc',gris:'Gris',rouge:'Rouge',bleu:'Bleu',vert:'Vert',rose:'Rose',orange:'Orange',violet:'Violet'};
const CH_HS=[['court','Court'],['degrade','Dégradé'],['boucle','Bouclé'],['rase','Rasé'],['queue','Queue-de-cheval'],['chignon','Chignon'],['long','Longs'],['carre','Carré']];
/* espèces : k, nom, type, palettes de pelage/peau [couleur, nom] */
const CH_SP={
 homme:{n:'Homme',t:'human',pal:'skin',def:{c:2,hs:'court',hc:'brun'}},
 femme:{n:'Femme',t:'human',fem:1,pal:'skin',def:{c:1,hs:'queue',hc:'chatain'}},
 chat:{n:'Chat',t:'cat',pal:[['#d4873f','Roux'],['#8c9198','Gris'],['#2b2b30','Noir'],['#ece2d3','Crème'],['#c98a4a','Tigré']],def:{c:0}},
 loup:{n:'Loup',t:'wolf',pal:[['#878b93','Gris'],['#7a5a3e','Brun'],['#e6e3dd','Blanc'],['#2e2f35','Noir']],def:{c:0}},
 ours:{n:'Ours',t:'bear',pal:[['#6c4426','Brun'],['#2b2420','Noir'],['#ece5d6','Polaire']],def:{c:0}},
 gorille:{n:'Gorille',t:'gorilla',pal:[['#2c2a29','Noir'],['#4b4845','Gris argent']],def:{c:0}},
 panda:{n:'Panda',t:'panda',pal:[['#f1efe9','Classique']],def:{c:0}},
 robot:{n:'Robot',t:'robot',pal:[['#aeb8c3','Argent'],['#d2a744','Or'],['#3c4049','Noir'],['#4f86d2','Bleu']],def:{c:0},lock:1},
 ninja:{n:'Ninja',t:'ninja',pal:'skin',def:{c:2},lock:1}
};
const CH_ORDER=['homme','femme','chat','loup','ours','gorille','panda','robot','ninja'];
const CH_ACC=[['bandeau','Bandeau',1],['gants','Gants',3],['medaille','Médaille',5],['couronne','Couronne',7]]; /* débloqué au niveau de skills (index LVL) */
let CHN=0;
/* ---- couleurs ---- */
function chHex(h){h=String(h||'#888').replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255]}
function chMix(a,b,t){const x=chHex(a),y=chHex(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')}
const chDk=(c,t)=>chMix(c,'#000000',t),chLt=(c,t)=>chMix(c,'#ffffff',t);
const chLum=c=>{const[r,g,b]=chHex(c);return(.299*r+.587*g+.114*b)/255};
const f2=v=>Math.round(v*10)/10;
/* ---- membres effilés avec dégradé perpendiculaire ---- */
function chLimb(id,A,B,wa,wb,bul,col,defs,mus){const dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,ux=dx/L,uy=dy/L;
  const p=(P,w,o)=>[f2(P[0]+nx*w*o),f2(P[1]+ny*w*o)];
  const M=[A[0]+dx*.4,A[1]+dy*.4],wm=Math.max(wa,wb)*.98;
  const a1=p(A,wa/2,1),a2=p(A,wa/2,-1),b1=p(B,wb/2,1),b2=p(B,wb/2,-1),m1=p(M,wm/2+bul,1),m2=p(M,wm/2+bul*.45,-1);
  const g=id+'l'+defs.length;defs.push('<linearGradient id="'+g+'" gradientUnits="userSpaceOnUse" x1="'+a1[0]+'" y1="'+a1[1]+'" x2="'+a2[0]+'" y2="'+a2[1]+'"><stop offset="0" stop-color="'+chLt(col,.2)+'"/><stop offset=".38" stop-color="'+chLt(col,.04)+'"/><stop offset=".7" stop-color="'+col+'"/><stop offset="1" stop-color="'+chDk(col,.34)+'"/></linearGradient>');
  const c1=[f2(m1[0]-ux*L*.2),f2(m1[1]-uy*L*.2)],c2=[f2(m1[0]+ux*L*.24),f2(m1[1]+uy*L*.24)],d1=[f2(m2[0]+ux*L*.24),f2(m2[1]+uy*L*.24)],d2=[f2(m2[0]-ux*L*.2),f2(m2[1]-uy*L*.2)];
  let s='<path d="M'+a1+' Q'+c1+' '+m1+' Q'+c2+' '+b1+' A'+f2(wb/2)+' '+f2(wb/2)+' 0 0 0 '+b2+' Q'+d1+' '+m2+' Q'+d2+' '+a2+' A'+f2(wa/2)+' '+f2(wa/2)+' 0 0 0 '+a1+'Z" fill="url(#'+g+')"/>';
  if(mus){const q1=p([A[0]+dx*.18,A[1]+dy*.18],wa*.08,-1),q2=p([A[0]+dx*.62,A[1]+dy*.62],wm*.18,1),q3=p([A[0]+dx*.86,A[1]+dy*.86],wb*.05,1);
    s+='<path d="M'+q1+' Q'+q2+' '+q3+'" fill="none" stroke="'+chDk(col,.3)+'" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>';
    const h1=p([A[0]+dx*.25,A[1]+dy*.25],wa*.28,1),h2=p([A[0]+dx*.55,A[1]+dy*.55],wm*.42,1);s+='<path d="M'+h1+' L'+h2+'" stroke="'+chLt(col,.35)+'" stroke-width="2.2" stroke-linecap="round" opacity=".35"/>'}
  return s}
const chCirc=(P,r,f,extra)=>'<circle cx="'+f2(P[0])+'" cy="'+f2(P[1])+'" r="'+f2(r)+'" fill="'+f+'"'+(extra||'')+'/>';
/* ---- mains ---- */
function chHand(P,type,col,side,gl,defs,id){const s=side,c=gl||col,dk=chDk(c,.35),x=P[0],y=P[1];let o='';
  if(type==='grip'){o='<g transform="translate('+f2(x)+' '+f2(y)+')"><rect x="-10" y="-7" width="20" height="15" rx="6.5" fill="'+c+'"/><path d="M-6.5 -6.5v9M-2.2 -7v9.5M2.2 -7v9.5M6.5 -6.5v9" stroke="'+dk+'" stroke-width="1" stroke-linecap="round" opacity=".55"/><rect x="-10" y="3" width="20" height="5" rx="2.5" fill="'+dk+'" opacity=".35"/></g>'}
  else if(type==='thumb'){o='<g transform="translate('+f2(x)+' '+f2(y)+')"><rect x="-9" y="-6" width="18" height="16" rx="6" fill="'+c+'"/><path d="M-9 0h18M-9 4.5h18" stroke="'+dk+'" stroke-width="1" opacity=".5"/><rect x="'+(s>0?-8:2)+'" y="-19" width="7" height="16" rx="3.5" fill="'+c+'"/><path d="M'+(s>0?-6.5:3.5)+' -15.5h4" stroke="'+dk+'" stroke-width=".9" opacity=".5"/></g>'}
  else if(type==='open'){o='<g transform="translate('+f2(x)+' '+f2(y)+') rotate('+(s*-8)+')"><rect x="-9" y="-8" width="18" height="17" rx="6" fill="'+c+'"/>'+[-6.5,-2.2,2.2,6.5].map((fx,i)=>'<rect x="'+(fx-2)+'" y="'+(-19+Math.abs(i-1.5)*1.8)+'" width="4" height="13" rx="2" fill="'+c+'"/>').join('')+'<rect x="'+(s>0?7:-13)+'" y="-4" width="6" height="11" rx="3" fill="'+c+'" transform="rotate('+(s*35)+' '+(s>0?10:-10)+' 2)"/><path d="M-7 3q7 3 14 0" stroke="'+dk+'" stroke-width="1" fill="none" opacity=".45"/></g>'}
  else{o='<g transform="translate('+f2(x)+' '+f2(y)+')"><rect x="-9.5" y="-8" width="19" height="17" rx="7" fill="'+c+'"/><path d="M-9 -1.5h18M-9 3h18" stroke="'+dk+'" stroke-width="1" opacity=".5"/><path d="M'+(s>0?-9:9)+' -4q'+(s>0?6:-6)+' 0 '+(s>0?9:-9)+' 6" stroke="'+dk+'" stroke-width="1" fill="none" opacity=".55"/></g>'}
  if(gl)o+=chCirc([x,y+8.5],0,'none');
  return o}
/* ---- palette résolue d'un personnage ---- */
function chCols(o){const sp=CH_SP[o.sp]||CH_SP.homme,t=sp.t;let base;
  if(sp.pal==='skin')base=CH_SKIN[Math.max(0,Math.min(5,o.c|0))];else base=(sp.pal[o.c|0]||sp.pal[0])[0];
  const r={t,base,skin:base,arm:base,hand:base,fem:!!sp.fem,stripes:o.sp==='chat'&&(o.c|0)===4};
  if(t==='panda'){r.arm='#2a2a2e';r.hand='#2a2a2e'}
  if(t==='gorilla'){r.hand=chMix(base,'#5a5550',.45);r.face='#3d3a38'}
  if(t==='bear'){r.hand=chDk(base,.25)}
  if(t==='robot'){r.arm=chDk(base,.08);r.hand=chDk(base,.2)}
  return r}
function chShirtCol(o){return o.sh&&CH_SHIRT[o.sh]?CH_SHIRT[o.sh]:(o.acc||'#e4ff1a')}
/* ---- poses (repère 200 x 200 ; pull : 200 x 260) ---- */
const CH_POSE={
 icon:{hd:[100,104],hs:1.3,sl:[46,184],sr:[154,184],el:[28,104],er:[172,104],hl:[34,20],hr:[166,20],tl:'grip',tr:'grip',bar:20,ty:172},
 hang:{hd:[100,104],hs:.96,sl:[60,154],sr:[140,154],el:[44,94],er:[156,94],hl:[42,32],hr:[158,32],tl:'grip',tr:'grip',bar:32,ty:146},
 idle:{hd:[100,76],hs:1,sl:[54,146],sr:[146,146],el:[44,204],er:[156,204],hl:[50,256],hr:[150,256],tl:'fist',tr:'fist',ty:128},
 cheer:{hd:[100,82],hs:.96,sl:[56,148],sr:[144,148],el:[30,104],er:[170,104],hl:[30,56],hr:[170,56],tl:'fist',tr:'fist',ty:132},
 flex:{hd:[100,82],hs:.96,sl:[56,148],sr:[144,148],el:[20,142],er:[180,142],hl:[30,92],hr:[170,92],tl:'fist',tr:'fist',ty:132,bul:8},
 thumbs:{hd:[94,78],hs:1,sl:[50,146],sr:[140,146],el:[40,204],er:[160,190],hl:[46,256],hr:[132,148],tl:'fist',tr:'thumb',ty:128},
 wave:{hd:[96,80],hs:1,sl:[52,148],sr:[142,148],el:[42,206],er:[172,116],hl:[48,256],hr:[168,60],tl:'fist',tr:'open',ty:130},
 sleep:{hd:[102,82],hs:1,rot:9,sl:[54,148],sr:[146,148],el:[46,206],er:[154,206],hl:[52,256],hr:[148,256],tl:'fist',tr:'fist',ty:130},
 pullA:{hd:[100,138],hs:.86,sl:[62,188],sr:[138,188],el:[46,126],er:[154,126],hl:[46,62],hr:[154,62],tl:'grip',tr:'grip',bar:62,ty:180,H:260},
 pullB:{hd:[100,34],hs:.86,sl:[62,100],sr:[138,100],el:[24,120],er:[176,120],hl:[46,62],hr:[154,62],tl:'grip',tr:'grip',bar:62,ty:92,H:260}
};
/* ---- torse + débardeur ---- */
function chTorso(P,C,shirt,id,defs,o){const sl=P.sl,sr=P.sr,ty=P.ty,H=P.H||200,w=(sr[0]-sl[0]),cx=(sl[0]+sr[0])/2,bot=H+10,t=C.t;
  const skin=C.arm,gS=id+'ts';defs.push('<linearGradient id="'+gS+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+chDk(skin,.25)+'"/><stop offset=".5" stop-color="'+chLt(skin,.06)+'"/><stop offset="1" stop-color="'+chDk(skin,.3)+'"/></linearGradient>');
  const lat=w*.12,waist=w*.36;let s='';
  /* corps (peau / pelage) */
  s+='<path d="M'+f2(sl[0]-6)+' '+f2(sl[1]+2)+' Q'+f2(sl[0]-4)+' '+f2(ty-4)+' '+f2(cx-10)+' '+f2(ty-6)+' L'+f2(cx+10)+' '+f2(ty-6)+' Q'+f2(sr[0]+4)+' '+f2(ty-4)+' '+f2(sr[0]+6)+' '+f2(sr[1]+2)+' Q'+f2(sr[0]+lat)+' '+f2((sr[1]+bot)/2)+' '+f2(cx+waist)+' '+bot+' L'+f2(cx-waist)+' '+bot+' Q'+f2(sl[0]-lat)+' '+f2((sl[1]+bot)/2)+' '+f2(sl[0]-6)+' '+f2(sl[1]+2)+'Z" fill="url(#'+gS+')"/>';
  if(t==='robot'){s+='<path d="M'+f2(cx-w*.34)+' '+f2(ty+14)+' h'+f2(w*.68)+' l-6 '+f2(bot-ty)+' h'+f2(-w*.68+12)+'z" fill="'+chDk(C.base,.12)+'" stroke="'+chDk(C.base,.35)+'" stroke-width="1.5"/><circle cx="'+cx+'" cy="'+f2(ty+38)+'" r="9" fill="#0e1520" stroke="'+chDk(C.base,.4)+'" stroke-width="2"/><circle cx="'+cx+'" cy="'+f2(ty+38)+'" r="5" fill="'+(o.acc||'#e4ff1a')+'" opacity=".95"/>'+[-1,1].map(k=>'<circle cx="'+f2(cx+k*w*.27)+'" cy="'+f2(ty+20)+'" r="1.8" fill="'+chDk(C.base,.4)+'"/>').join('');return s}
  /* débardeur */
  const sc=shirt,gT=id+'tt';defs.push('<linearGradient id="'+gT+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+chDk(sc,.32)+'"/><stop offset=".42" stop-color="'+chLt(sc,.07)+'"/><stop offset=".62" stop-color="'+sc+'"/><stop offset="1" stop-color="'+chDk(sc,.36)+'"/></linearGradient>');
  const nk=w*.17,ax=w*.11,top=ty-3;
  s+='<path d="M'+f2(cx-nk-9)+' '+f2(top)+' Q'+f2(cx)+' '+f2(top+22)+' '+f2(cx+nk+9)+' '+f2(top)+' L'+f2(cx+nk+17)+' '+f2(top)+' Q'+f2(sr[0]-ax)+' '+f2(sr[1]+20)+' '+f2(sr[0]+lat*.6)+' '+f2(sr[1]+40)+' Q'+f2(sr[0]+lat*.9)+' '+f2((sr[1]+bot)/2+10)+' '+f2(cx+waist+2)+' '+bot+' L'+f2(cx-waist-2)+' '+bot+' Q'+f2(sl[0]-lat*.9)+' '+f2((sl[1]+bot)/2+10)+' '+f2(sl[0]-lat*.6)+' '+f2(sl[1]+40)+' Q'+f2(sl[0]+ax)+' '+f2(sl[1]+20)+' '+f2(cx-nk-17)+' '+f2(top)+'Z" fill="url(#'+gT+')"/>';
  /* coutures, plis */
  s+='<path d="M'+f2(cx-nk-9)+' '+f2(top)+' Q'+f2(cx)+' '+f2(top+22)+' '+f2(cx+nk+9)+' '+f2(top)+'" fill="none" stroke="'+chDk(sc,.28)+'" stroke-width="2.4"/>';
  s+='<path d="M'+f2(cx-14)+' '+f2(top+34)+' q14 7 28 0" fill="none" stroke="'+chDk(sc,.22)+'" stroke-width="1.4" opacity=".55"/><path d="M'+f2(cx-waist*.7)+' '+f2(bot-26)+' q'+f2(waist*.4)+' -8 '+f2(waist*.9)+' -4" fill="none" stroke="'+chDk(sc,.25)+'" stroke-width="1.3" opacity=".4"/>';
  if(t==='ninja')s+='<path d="M'+f2(cx-nk-6)+' '+f2(top+2)+' L'+f2(cx+8)+' '+f2(top+48)+' M'+f2(cx+nk+6)+' '+f2(top+2)+' L'+f2(cx-8)+' '+f2(top+48)+'" stroke="'+chDk(sc,.4)+'" stroke-width="3" fill="none"/>';
  else s+='<path d="M'+f2(cx+w*.13)+' '+f2(top+30)+' l6 -2 l2 6 l-6 2z" fill="'+chLt(sc,.5)+'" opacity=".55"/>';
  return s}
/* ---- deltoïdes ---- */
function chDelt(P,col,id,defs){const g=id+'dg';defs.push('<radialGradient id="'+g+'" cx=".42" cy=".3" r=".75"><stop offset="0" stop-color="'+chLt(col,.22)+'"/><stop offset=".55" stop-color="'+col+'"/><stop offset="1" stop-color="'+chDk(col,.3)+'"/></radialGradient>');
  const one=(S,E)=>{const a=Math.atan2(E[1]-S[1],E[0]-S[0]),dx=E[0]-S[0],dy=E[1]-S[1],L=Math.hypot(dx,dy)||1,c=[S[0]+dx/L*11,S[1]+dy/L*11],rx=17,ry=14.2,ca=Math.cos(a),sa=Math.sin(a),p1=[f2(c[0]+ca*rx),f2(c[1]+sa*rx)],p2=[f2(c[0]-ca*rx),f2(c[1]-sa*rx)],deg=f2(a*180/Math.PI);
    return '<path d="M'+p1+' A'+rx+' '+ry+' '+deg+' 1 1 '+p2+' A'+rx+' '+ry+' '+deg+' 1 1 '+p1+'Z" fill="url(#'+g+')"/>'};
  return one(P.sl,P.el)+one(P.sr,P.er)}
/* ---- visage : yeux, sourcils, bouche selon l'expression ---- */
function chEyes(ex,C,iris,lash,slit){const ink='#1c1714';let s='';
  [-1,1].forEach(k=>{const x=k*10.5;
    if(ex==='sleep'||ex==='happy'){s+='<path d="M'+(x-5.5)+' '+(ex==='sleep'?1:1.5)+' Q'+x+' '+(ex==='sleep'?4.2:-3.2)+' '+(x+5.5)+' '+(ex==='sleep'?1:1.5)+'" fill="none" stroke="'+ink+'" stroke-width="1.7" stroke-linecap="round"/>';return}
    s+='<path d="M'+(x-6)+' 0.6 Q'+x+' -4.6 '+(x+6)+' 0.6 Q'+x+' 4 '+(x-6)+' 0.6Z" fill="#fbfaf7"/>';
    s+='<circle cx="'+(x+k*.3)+'" cy="0.3" r="3.3" fill="'+iris+'"/>'+(slit?'<ellipse cx="'+(x+k*.3)+'" cy="0.3" rx="0.9" ry="3" fill="#111"/>':'<circle cx="'+(x+k*.3)+'" cy="0.3" r="1.55" fill="#111"/>')+'<circle cx="'+(x+k*.3+1.1)+'" cy="-0.9" r="0.85" fill="#fff"/>';
    s+='<path d="M'+(x-6.4)+' 0.8 Q'+x+' -5.2 '+(x+6.4)+' 0.8" fill="none" stroke="'+ink+'" stroke-width="1.5" stroke-linecap="round"/>';
    if(lash)s+='<path d="M'+(x+k*5.6)+' -0.4 l'+(k*2.4)+' -1.6M'+(x+k*4)+' -2.3 l'+(k*1.6)+' -2" stroke="'+ink+'" stroke-width="1" stroke-linecap="round"/>';});
  return s}
function chMouth(ex,lip,dk){if(ex==='grin'||ex==='happy')return '<path d="M-9 22.5 Q0 33 9 22.5 Q0 25.5 -9 22.5Z" fill="#5a1d1d"/><path d="M-7.6 23.4 Q0 25.8 7.6 23.4 L7 25 Q0 27 -7 25Z" fill="#fff"/><path d="M-9 22.5 Q0 33 9 22.5" fill="none" stroke="'+dk+'" stroke-width="1.2"/>';
  if(ex==='effort')return '<rect x="-7.5" y="21.5" width="15" height="5.5" rx="2.2" fill="#fff" stroke="'+dk+'" stroke-width="1.2"/><path d="M-7.5 24.2h15M-3.5 21.5v5.5M0 21.5v5.5M3.5 21.5v5.5" stroke="'+dk+'" stroke-width=".7" opacity=".6"/>';
  if(ex==='wow')return '<ellipse cx="0" cy="24.5" rx="4" ry="5" fill="#4a1717"/>';
  if(ex==='sleep')return '<path d="M-5 24 Q0 26 5 24" fill="none" stroke="'+dk+'" stroke-width="1.4" stroke-linecap="round"/>';
  return '<path d="M-8 22.6 Q0 28.4 8 22.6" fill="none" stroke="'+dk+'" stroke-width="1.6" stroke-linecap="round"/>'+(lip?'<path d="M-6 25.2 Q0 28.6 6 25.2 Q0 27 -6 25.2Z" fill="'+lip+'" opacity=".7"/>':'')}
function chBrows(ex,col,thick){const y=ex==='effort'?-7.5:ex==='wow'?-11:-9.2,ang=ex==='effort'?2.2:0,t=thick||2.4;
  return [-1,1].map(k=>'<path d="M'+(k*4.5)+' '+(y+ang)+' Q'+(k*10.5)+' '+(y-2.6)+' '+(k*16.5)+' '+(y+.3)+'" fill="none" stroke="'+col+'" stroke-width="'+t+'" stroke-linecap="round"/>').join('')}
/* ---- cheveux ---- */
function chHairBack(hs,col,fem){const dk=chDk(col,.25);if(hs==='long')return '<path d="M-29 -4 C-33 26 -30 50 -24 66 L24 66 C30 50 33 26 29 -4Z" fill="'+dk+'"/>';
  if(hs==='queue')return '<path d="M20 -26 C40 -24 44 4 36 30 C33 40 26 44 24 40 C30 22 30 0 18 -18Z" fill="'+dk+'"/>';
  if(hs==='carre')return '<path d="M-30 -6 C-32 14 -30 28 -24 34 L24 34 C30 28 32 14 30 -6Z" fill="'+dk+'"/>';
  if(hs==='chignon')return '<ellipse cx="0" cy="-40" rx="13" ry="11" fill="'+col+'"/><path d="M-7 -44 q7 -5 14 0" stroke="'+chLt(col,.2)+'" stroke-width="1.5" fill="none"/>';
  return ''}
function chHairFront(hs,col){const hl=chLt(col,.22),dk=chDk(col,.3);
  const top='<path d="M-27.5 -1 C-30 -28 -14 -42 1 -41.5 C17 -41 30 -29 27.5 -1 L25 -9 C23.5 -21 13 -27.5 0 -27.5 C-12 -27.5 -23 -21 -25 -9Z" fill="'+col+'"/>';
  if(hs==='rase')return '<path d="M-26.5 -6 C-28 -27 -14 -37.5 0 -37.5 C14 -37.5 28 -27 26.5 -6 L24.5 -11 C23 -22 12 -28.5 0 -28.5 C-12 -28.5 -23 -22 -24.5 -11Z" fill="'+col+'" opacity=".55"/>';
  if(hs==='degrade')return '<path d="M-26.5 -6 C-28 -26 -16 -32 -10 -33 C-12 -44 14 -48 20 -38 C28 -33 28 -18 26.5 -6 L24.5 -12 C23 -22 12 -27 0 -27 C-12 -27 -23 -22 -24.5 -12Z" fill="'+col+'"/><path d="M-26.5 -6 L-24.5 -12 C-24 -18 -22 -24 -18 -27 C-25 -22 -27 -14 -26.5 -6Z" fill="'+dk+'" opacity=".5"/><path d="M-6 -42 Q6 -46 16 -40" stroke="'+hl+'" stroke-width="2" fill="none" opacity=".7"/>';
  if(hs==='boucle'){let s='';const P=[[-24,-14],[-20,-24],[-12,-31],[-2,-34],[8,-33],[17,-28],[23,-20],[26,-11],[-26,-5],[25,-3]];P.forEach(p=>{s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="7.6" fill="'+col+'"/>'});P.slice(1,8).forEach(p=>{s+='<path d="M'+(p[0]-3)+' '+(p[1]-1)+' q3 -3 6 0" stroke="'+hl+'" stroke-width="1.3" fill="none"/>'});return s}
  if(hs==='queue'||hs==='chignon')return '<path d="M-27.5 0 C-30 -28 -14 -41 1 -40.5 C17 -40 30 -28 27.5 0 L25.5 -6 C24 -19 14 -26 4 -27 C-6 -24 -16 -22 -25.5 -6Z" fill="'+col+'"/><path d="M4 -27 C-2 -33 -12 -34 -18 -30" stroke="'+dk+'" stroke-width="1.4" fill="none" opacity=".6"/><path d="M-14 -36 Q0 -41 14 -36" stroke="'+hl+'" stroke-width="1.8" fill="none" opacity=".7"/>';
  if(hs==='long'||hs==='carre')return '<path d="M-29 4 C-32 -28 -14 -42 1 -41.5 C17 -41 32 -28 29 4 L26 -3 C25 -12 21 -20 14 -24 C8 -18 -6 -16 -12 -24 C-20 -20 -25 -12 -26 -3Z" fill="'+col+'"/><path d="M-12 -24 C-10 -32 4 -36 14 -24" stroke="'+dk+'" stroke-width="1.3" fill="none" opacity=".5"/><path d="M-20 -32 Q-6 -40 10 -37" stroke="'+hl+'" stroke-width="1.8" fill="none" opacity=".7"/>';
  return top+'<path d="M-14 -36 Q0 -40 16 -35" stroke="'+hl+'" stroke-width="1.8" fill="none" opacity=".7"/><path d="M-25 -9 L-27.5 -1 C-28 -6 -27.5 -10 -25 -9Z" fill="'+dk+'"/>'}
/* ---- têtes par espèce (repère local, centre 0,0 ; hauteur ~70) ---- */
function chHead(C,o,ex,id,defs){const t=C.t,b=C.base;let s='';const gF=id+'hf';
  const faceGrad=(c,cx,cy)=>{defs.push('<radialGradient id="'+gF+'" cx="'+(cx||.45)+'" cy="'+(cy||.38)+'" r=".72"><stop offset="0" stop-color="'+chLt(c,.12)+'"/><stop offset=".62" stop-color="'+c+'"/><stop offset="1" stop-color="'+chDk(c,.3)+'"/></radialGradient>');return 'url(#'+gF+')'};
  if(t==='human'||t==='ninja'){const fem=C.fem,hs=o.hs||'court',hc=CH_HAIRC[o.hc]||CH_HAIRC.brun,ff=faceGrad(b);
    const head=fem?'M0 -35 C16 -35 26 -24 26 -8 C26 6 23 17 18 25 C13 32 7 36 0 36 C-7 36 -13 32 -18 25 C-23 17 -26 6 -26 -8 C-26 -24 -16 -35 0 -35Z':'M0 -35 C16.5 -35 26.5 -24 26.5 -8 C26.5 6 25 16 21 24 C17 31 9 36 0 36 C-9 36 -17 31 -21 24 C-25 16 -26.5 6 -26.5 -8 C-26.5 -24 -16.5 -35 0 -35Z';
    if(t==='human')s+=chHairBack(hs,hc,fem);
    s+='<ellipse cx="-25.5" cy="2" rx="5.2" ry="9" fill="'+chDk(b,.08)+'"/><ellipse cx="25.5" cy="2" rx="5.2" ry="9" fill="'+chDk(b,.08)+'"/><path d="M-26 -2 q-3 4 0 9M26 -2 q3 4 0 9" stroke="'+chDk(b,.3)+'" stroke-width="1.2" fill="none"/>';
    s+='<path d="'+head+'" fill="'+ff+'"/>';
    s+='<path d="M-18 25 C-13 32 -7 36 0 36 C7 36 13 32 18 25 C12 30 6 32.5 0 32.5 C-6 32.5 -12 30 -18 25Z" fill="'+chDk(b,.18)+'" opacity=".6"/>';
    if(t==='ninja'){const mc=chShirtCol(o),md=chDk(mc,.25);s+='<path d="'+head+'" fill="'+mc+'"/><path d="M-26.5 -8 C-26.5 -24 -16.5 -35 0 -35 C16.5 -35 26.5 -24 26.5 -8" fill="none" stroke="'+md+'" stroke-width="2"/><path d="M-22 -9 Q0 -14 22 -9 L22 6 Q0 10 -22 6Z" fill="'+b+'"/><path d="M-22 -9 Q0 -14 22 -9" fill="none" stroke="'+md+'" stroke-width="1.6"/><path d="M-24 18 Q0 30 24 18" fill="none" stroke="'+md+'" stroke-width="1.4" opacity=".6"/>';
      const hb='#d62828';s+='<path d="M-26.6 -19 Q0 -27 26.6 -19 L26.6 -12 Q0 -20 -26.6 -12Z" fill="'+hb+'"/><path d="M25 -17 C34 -20 40 -16 46 -20 C42 -12 34 -12 26 -13Z M25 -14 C33 -10 38 -4 44 -2 C36 0 30 -6 25 -11Z" fill="'+chDk(hb,.15)+'"/><circle cx="25.5" cy="-15.5" r="3" fill="'+chDk(hb,.25)+'"/>';
      s+='<path d="M-14 22 q14 6 28 0 M-10 28 q10 4 20 0" stroke="'+md+'" stroke-width="1.2" fill="none" opacity=".5"/>';
      s+=chBrows(ex==='effort'?'effort':'neutral','#1c1714',2.6)+chEyes(ex==='grin'?'neutral':ex,C,'#3b2a1e');return s}
    s+='<path d="M-1.5 3 Q-2.5 11 -5.2 15.2 Q-2 17.6 0 16.6 Q2 17.6 5.2 15.2" fill="none" stroke="'+chDk(b,.32)+'" stroke-width="1.5" stroke-linecap="round"/><path d="M-1 14.5 q1 1.4 2 0" stroke="'+chLt(b,.25)+'" stroke-width="1.3" fill="none"/>';
    s+='<ellipse cx="-15" cy="12" rx="5.5" ry="3.4" fill="'+(fem?'#e88a7a':chDk(b,.1))+'" opacity="'+(fem?.35:.25)+'"/><ellipse cx="15" cy="12" rx="5.5" ry="3.4" fill="'+(fem?'#e88a7a':chDk(b,.1))+'" opacity="'+(fem?.35:.25)+'"/>';
    s+=chEyes(ex,C,o.eye||'#5a3b22',fem)+chBrows(ex,chDk(hc,.15),fem?1.9:2.7)+chMouth(ex,fem?'#c8605a':'',chDk(b,.5));
    s+=chHairFront(hs,hc);return s}
  if(t==='cat'){const ff=faceGrad(b),dk=chDk(b,.35),lt=chLt(b,.55),pink='#e79a9a';
    s+='<path d="M-25 -12 L-28 -42 L-6 -30Z" fill="'+b+'"/><path d="M25 -12 L28 -42 L6 -30Z" fill="'+b+'"/><path d="M-22 -16 L-24.5 -36 L-10 -28Z" fill="'+pink+'"/><path d="M22 -16 L24.5 -36 L10 -28Z" fill="'+pink+'"/>';
    s+='<path d="M0 -33 C18 -33 29 -20 29 -4 C29 13 22 24 13 30 C9 33 4 34 0 34 C-4 34 -9 33 -13 30 C-22 24 -29 13 -29 -4 C-29 -20 -18 -33 0 -33Z" fill="'+ff+'"/>';
    s+='<path d="M-29 4 l-6 2 l6 3 l-5 4 l7 1M29 4 l6 2 l-6 3 l5 4 l-7 1" fill="'+b+'"/>';
    if(C.stripes)s+='<path d="M0 -32 v9 M-6 -31 l2 8 M6 -31 l-2 8 M-27 -6 h7 M-28 0 h6 M27 -6 h-7 M28 0 h-6" stroke="'+dk+'" stroke-width="2.4" stroke-linecap="round"/>';
    s+='<path d="M-15 10 C-15 2 -4 4 0 9 C4 4 15 2 15 10 C15 20 8 25 0 25 C-8 25 -15 20 -15 10Z" fill="'+lt+'"/>';
    s+=chEyes(ex==='grin'?'neutral':ex,C,'#9bc24a',0,ex!=='sleep'&&ex!=='happy').replace(/10\.5/g,'11');
    s+='<path d="M-3.4 9.5 h6.8 l-3.4 4.2z" fill="'+pink+'"/><path d="M0 13.7 v3 M0 16.7 q-3 3 -6 1.6 M0 16.7 q3 3 6 1.6" stroke="'+dk+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
    if(ex==='grin'||ex==='happy')s+='<path d="M-5 19 Q0 26 5 19Z" fill="#7a2a2a"/>';
    s+='<g stroke="'+chLt(b,.75)+'" stroke-width=".9" stroke-linecap="round" opacity=".9"><path d="M-12 15 l-14 -2 M-12 17.5 l-14 2 M12 15 l14 -2 M12 17.5 l14 2"/></g>';
    s+='<path d="M-15 -11 Q-10.5 -13.4 -6 -11.6 M15 -11 Q10.5 -13.4 6 -11.6" stroke="'+dk+'" stroke-width="1.5" fill="none" stroke-linecap="round"/>';return s}
  if(t==='wolf'){const ff=faceGrad(b),dk=chDk(b,.38),lt=chLt(b,.6);
    s+='<path d="M-24 -10 L-27 -46 L-6 -28Z" fill="'+chDk(b,.08)+'"/><path d="M24 -10 L27 -46 L6 -28Z" fill="'+chDk(b,.08)+'"/><path d="M-21 -15 L-23 -38 L-10 -27Z" fill="'+chDk(b,.45)+'"/><path d="M21 -15 L23 -38 L10 -27Z" fill="'+chDk(b,.45)+'"/>';
    s+='<path d="M0 -32 C17 -32 28 -20 29 -4 C30 6 34 14 30 20 L22 22 C18 30 10 36 0 36 C-10 36 -18 30 -22 22 L-30 20 C-34 14 -30 6 -29 -4 C-28 -20 -17 -32 0 -32Z" fill="'+ff+'"/>';
    s+='<path d="M-22 22 L-30 20 L-25 15 L-31 11 M22 22 L30 20 L25 15 L31 11" fill="'+lt+'"/>';
    s+='<path d="M0 -10 C7 -10 11 0 13 10 C15 20 10 31 0 32 C-10 31 -15 20 -13 10 C-11 0 -7 -10 0 -10Z" fill="'+lt+'"/>';
    s+='<path d="M-6 -30 C-4 -20 -3 -12 0 -8 C3 -12 4 -20 6 -30 C3 -32 -3 -32 -6 -30Z" fill="'+dk+'" opacity=".35"/>';
    s+=chEyes(ex==='grin'?'neutral':ex,C,'#e0a526').replace(/10\.5/g,'12');
    s+='<path d="M-17.5 -6 Q-12 -9.5 -6 -7 M17.5 -6 Q12 -9.5 6 -7" stroke="'+dk+'" stroke-width="2" fill="none" stroke-linecap="round"/>';
    s+='<path d="M-5.5 14 Q0 11.5 5.5 14 Q5 19 0 20 Q-5 19 -5.5 14Z" fill="#1e1e22"/><path d="M-2 14.2 q2 -1 4 0" stroke="#555" stroke-width="1" fill="none"/>';
    s+='<path d="M0 20 v4.5 M0 24.5 q-4 3.5 -8 1.5 M0 24.5 q4 3.5 8 1.5" stroke="#2a2a2e" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
    if(ex==='grin'||ex==='happy')s+='<path d="M-6 26.5 Q0 33 6 26.5Z" fill="#7a2a2a"/><path d="M-4 27 l1 2 l1 -2M2 27 l1 2 l1 -2" fill="#fff"/>';return s}
  if(t==='bear'||t==='panda'){const pd=t==='panda',fc=pd?'#f4f2ec':b,ff=faceGrad(fc),dk=pd?'#222226':chDk(b,.4),mz=pd?'#f8f7f3':chLt(b,.42);
    s+='<circle cx="-22" cy="-24" r="11" fill="'+(pd?'#222226':b)+'"/><circle cx="22" cy="-24" r="11" fill="'+(pd?'#222226':b)+'"/><circle cx="-22" cy="-24" r="5.5" fill="'+(pd?'#3a3a40':chDk(b,.3))+'"/><circle cx="22" cy="-24" r="5.5" fill="'+(pd?'#3a3a40':chDk(b,.3))+'"/>';
    s+='<path d="M0 -32 C19 -32 30 -19 30 -2 C30 15 21 30 0 33 C-21 30 -30 15 -30 -2 C-30 -19 -19 -32 0 -32Z" fill="'+ff+'"/>';
    if(pd)s+='<ellipse cx="-11.5" cy="0" rx="7.5" ry="9.5" fill="#222226" transform="rotate(28 -11.5 0)"/><ellipse cx="11.5" cy="0" rx="7.5" ry="9.5" fill="#222226" transform="rotate(-28 11.5 0)"/>';
    s+='<ellipse cx="0" cy="17" rx="13" ry="10.5" fill="'+mz+'"/>';
    if(pd){s+=[-1,1].map(k=>ex==='sleep'||ex==='happy'?'<path d="M'+(k*11.5-4)+' 1 Q'+(k*11.5)+' '+(ex==='sleep'?4:-2.5)+' '+(k*11.5+4)+' 1" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>':'<circle cx="'+(k*11.5)+'" cy="0" r="3.4" fill="#fff"/><circle cx="'+(k*11.5+k*.4)+'" cy=".3" r="2" fill="#111"/><circle cx="'+(k*11.5+1)+'" cy="-.8" r=".7" fill="#fff"/>').join('')}
    else s+=chEyes(ex==='grin'?'neutral':ex,C,'#3a2414').replace(/10\.5/g,'11');
    s+='<path d="M-5.5 12 Q0 9.5 5.5 12 Q5 16.5 0 17.5 Q-5 16.5 -5.5 12Z" fill="#1d1d21"/><path d="M0 17.5 v3.5 M0 21 q-4 3 -7 1 M0 21 q4 3 7 1" stroke="'+dk+'" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
    if(ex==='grin'||ex==='happy')s+='<path d="M-5 23 Q0 29 5 23Z" fill="#7a2a2a"/>';
    if(!pd)s+='<path d="M-16 -9 Q-11 -11.5 -6 -9.5 M16 -9 Q11 -11.5 6 -9.5" stroke="'+dk+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';return s}
  if(t==='gorilla'){const ff=faceGrad(b),fc=C.face||'#3d3a38',gM=id+'gm';defs.push('<radialGradient id="'+gM+'" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="'+chLt(fc,.18)+'"/><stop offset="1" stop-color="'+chDk(fc,.25)+'"/></radialGradient>');
    s+='<circle cx="-28" cy="2" r="6" fill="'+fc+'"/><circle cx="28" cy="2" r="6" fill="'+fc+'"/>';
    s+='<path d="M0 -40 C10 -40 16 -36 22 -30 C29 -24 31 -12 31 0 C31 18 22 32 0 35 C-22 32 -31 18 -31 0 C-31 -12 -29 -24 -22 -30 C-16 -36 -10 -40 0 -40Z" fill="'+ff+'"/>';
    s+='<path d="M0 -16 C12 -18 22 -14 23 -4 C24 6 20 12 22 20 C20 30 10 34 0 34 C-10 34 -20 30 -22 20 C-20 12 -24 6 -23 -4 C-22 -14 -12 -18 0 -16Z" fill="url(#'+gM+')"/>';
    s+='<path d="M-21 -7 Q-11 -14 0 -9 Q11 -14 21 -7 Q12 -9 0 -5 Q-12 -9 -21 -7Z" fill="'+chDk(fc,.4)+'"/>';
    s+=(ex==='sleep'||ex==='happy'?[-1,1].map(k=>'<path d="M'+(k*9.5-4)+' -1 Q'+(k*9.5)+' '+(ex==='sleep'?2:-4)+' '+(k*9.5+4)+' -1" stroke="#111" stroke-width="1.6" fill="none"/>').join(''):[-1,1].map(k=>'<ellipse cx="'+(k*9.5)+'" cy="-1.5" rx="3.6" ry="2.6" fill="#2a1a10"/><circle cx="'+(k*9.5+k*.3)+'" cy="-1.5" r="1.5" fill="#000"/><circle cx="'+(k*9.5+.9)+'" cy="-2.4" r=".6" fill="#fff"/>').join(''));
    s+='<path d="M-9 8 Q0 2 9 8 Q10 14 4 15 Q0 13 -4 15 Q-10 14 -9 8Z" fill="'+chDk(fc,.35)+'"/><ellipse cx="-4" cy="11" rx="2.4" ry="1.6" fill="#111"/><ellipse cx="4" cy="11" rx="2.4" ry="1.6" fill="#111"/>';
    s+=ex==='grin'||ex==='happy'?'<path d="M-10 21 Q0 30 10 21 Q0 24 -10 21Z" fill="#4a1414"/><path d="M-8 21.8 Q0 23.8 8 21.8 L7.5 23 Q0 25 -7.5 23Z" fill="#f2efe6"/>':'<path d="M-9 22 Q0 25.5 9 22" stroke="#111" stroke-width="1.6" fill="none" stroke-linecap="round"/>';return s}
  if(t==='robot'){const gM=id+'rm';defs.push('<linearGradient id="'+gM+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+chLt(b,.35)+'"/><stop offset=".5" stop-color="'+b+'"/><stop offset="1" stop-color="'+chDk(b,.35)+'"/></linearGradient>');const ac=o.acc||'#e4ff1a',dk=chDk(b,.45);
    s+='<path d="M0 -42 v-8" stroke="'+dk+'" stroke-width="2.5"/><circle cx="0" cy="-51" r="4" fill="'+ac+'"/>';
    s+='<rect x="-32" y="-6" width="8" height="18" rx="3" fill="'+chDk(b,.2)+'"/><rect x="24" y="-6" width="8" height="18" rx="3" fill="'+chDk(b,.2)+'"/>';
    s+='<rect x="-27" y="-40" width="54" height="72" rx="17" fill="url(#'+gM+')" stroke="'+dk+'" stroke-width="1.6"/>';
    s+='<rect x="-21" y="-14" width="42" height="22" rx="10" fill="#0d141c"/>';
    s+=ex==='sleep'?'<path d="M-15 -3 h10 M5 -3 h10" stroke="'+ac+'" stroke-width="2.6" stroke-linecap="round"/>':ex==='happy'||ex==='grin'?'<path d="M-15 -1 q5 -7 10 0 M5 -1 q5 -7 10 0" stroke="'+ac+'" stroke-width="2.8" fill="none" stroke-linecap="round"/>':'<rect x="-15.5" y="-8" width="10" height="10" rx="3" fill="'+ac+'"/><rect x="5.5" y="-8" width="10" height="10" rx="3" fill="'+ac+'"/><rect x="-13.5" y="-6.5" width="3" height="3" rx="1" fill="#fff" opacity=".7"/><rect x="7.5" y="-6.5" width="3" height="3" rx="1" fill="#fff" opacity=".7"/>';
    s+='<rect x="-12" y="16" width="24" height="8" rx="3" fill="#0d141c"/>'+(ex==='grin'||ex==='happy'?'<path d="M-9 19 q9 5 18 0" stroke="'+ac+'" stroke-width="2" fill="none"/>':'<path d="M-8 20 h16" stroke="'+ac+'" stroke-width="2" stroke-dasharray="2.5 1.6"/>');
    s+='<path d="M-27 -26 h54 M-27 28 h54" stroke="'+dk+'" stroke-width="1" opacity=".5"/><circle cx="-21" cy="-33" r="1.6" fill="'+dk+'"/><circle cx="21" cy="-33" r="1.6" fill="'+dk+'"/><path d="M-22 -36 q10 -6 20 -4" stroke="#fff" stroke-width="2" opacity=".35" fill="none"/>';return s}
  return s}
/* ---- accessoires sur la tête (repère local) ---- */
function chHeadAcc(acc,C,o){let s='';const t=C.t,top=t==='robot'?-40:t==='gorilla'?-38:-34;
  if(acc.includes('bandeau')&&t!=='ninja'&&t!=='robot'){const c='#e53935';s+='<path d="M-28 '+(top+16)+' Q0 '+(top+8)+' 28 '+(top+16)+' L28 '+(top+24)+' Q0 '+(top+16)+' -28 '+(top+24)+'Z" fill="'+c+'"/><path d="M-28 '+(top+16)+' Q0 '+(top+8)+' 28 '+(top+16)+'" stroke="'+chLt(c,.3)+'" stroke-width="1.2" fill="none"/><path d="M27 '+(top+18)+' l12 -4 l-3 7z M27 '+(top+21)+' l10 7 l1 -7z" fill="'+chDk(c,.15)+'"/>'}
  if(acc.includes('couronne')){const y=top-6;s+='<g transform="rotate(-8 0 '+y+')"><path d="M-15 '+(y+6)+' L-17 '+(y-9)+' L-8 '+(y-2)+' L0 '+(y-13)+' L8 '+(y-2)+' L17 '+(y-9)+' L15 '+(y+6)+'Z" fill="url(#gGold)" stroke="#a87a0c" stroke-width="1.2"/><circle cx="0" cy="'+(y-13)+'" r="2.2" fill="#ff4d6d"/><circle cx="-17" cy="'+(y-9)+'" r="1.8" fill="#4dd2ff"/><circle cx="17" cy="'+(y-9)+'" r="1.8" fill="#4dd2ff"/><rect x="-15" y="'+(y+1)+'" width="30" height="5" fill="#c8930f" opacity=".5"/></g>'}
  return s}
/* ---- le personnage complet ---- */
function charSvg(o){o=o||{};const sp0=CH_SP[o.sp]?o.sp:'homme';o=Object.assign({},CH_SP[sp0].def,o);const sp=sp0,P=CH_POSE[o.pose]||CH_POSE.idle,H=P.H||200,id='q'+(++CHN)+'_',defs=[],C=chCols(Object.assign({},o,{sp})),shirt=chShirtCol(o),acc=Array.isArray(o.ac)?o.ac:[];
  const ex=o.ex||(o.pose==='sleep'?'sleep':o.pose==='hang'?'neutral':o.pose&&o.pose.startsWith('pull')?'effort':'grin');
  const gl=acc.includes('gants')?'#26272c':'';let body='';
  /* fond */
  if(o.bg){const a=o.bgc||o.acc||'#e4ff1a',g=id+'bg';defs.push('<linearGradient id="'+g+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+chLt(a,.25)+'"/><stop offset="1" stop-color="'+chDk(a,.18)+'"/></linearGradient><radialGradient id="'+g+'r" cx=".3" cy=".2" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>');
    body+='<rect width="200" height="'+H+'" fill="url(#'+g+')"/><rect width="200" height="'+H+'" fill="url(#'+g+'r)"/>'}
  /* barre derrière les mains */
  const barSvg=P.bar?'<rect x="-10" y="'+(P.bar-5)+'" width="220" height="10" rx="5" fill="#2a2c33"/><rect x="-10" y="'+(P.bar-4)+'" width="220" height="3" rx="1.5" fill="#fff" opacity=".28"/>':'';
  body+=barSvg;
  /* cheveux longs derrière (dans le repère de la tête) */
  const hd=P.hd,hs=(P.hs||1)*(o.hsc||1),rot=P.rot||0,hT='translate('+hd[0]+' '+hd[1]+') rotate('+rot+') scale('+hs+')';
  if(C.t==='human'&&(o.hs==='long'||o.hs==='carre'))body+='<g transform="'+hT+'">'+chHairBack(o.hs,CH_HAIRC[o.hc]||CH_HAIRC.brun,C.fem)+'</g>';
  /* torse */
  body+=chTorso(P,C,shirt,id,defs,o);
  /* cou */
  const nc=C.t==='robot'?chDk(C.base,.25):C.t==='panda'?'#f0eee8':C.base,nw=C.t==='gorilla'?44*hs:20*hs+2,ny=hd[1]+(C.t==='gorilla'?18:24)*hs;
  body+='<rect x="'+f2(hd[0]-nw/2)+'" y="'+f2(ny)+'" width="'+f2(nw)+'" height="'+f2(P.ty-ny+8)+'" rx="6" fill="'+chDk(nc,.12)+'"/><rect x="'+f2(hd[0]-nw/2)+'" y="'+f2(ny)+'" width="'+f2(nw)+'" height="10" fill="'+chDk(nc,.3)+'" opacity=".5"/>';
  if(acc.includes('medaille')&&C.t!=='robot')body+='<path d="M'+f2(hd[0]-12)+' '+f2(P.ty-4)+' L'+f2(hd[0]-2)+' '+f2(P.ty+30)+' L'+f2(hd[0]+2)+' '+f2(P.ty+30)+' L'+f2(hd[0]+12)+' '+f2(P.ty-4)+'" fill="none" stroke="#2d6cd4" stroke-width="5"/><circle cx="'+hd[0]+'" cy="'+f2(P.ty+38)+'" r="10" fill="url(#gGold)" stroke="#a87a0c" stroke-width="1.5"/><path d="M'+hd[0]+' '+f2(P.ty+33)+' l1.6 3.4 3.6 .4 -2.7 2.4 .8 3.6 -3.3 -1.9 -3.3 1.9 .8 -3.6 -2.7 -2.4 3.6 -.4z" fill="#a87a0c"/>';
  /* bras */
  const armC=C.arm,b=(P.bul||3);
  const arm=(S,E,Hh,side)=>{let a=chLimb(id,S,E,27,18,b,armC,defs,1)+chLimb(id,E,Hh,19,13.5,1.6,chDk(armC,.03),defs,1);
    if(C.t==='robot')a+=chCirc(E,6,chDk(C.base,.35))+chCirc(E,3,chLt(C.base,.2));
    if(C.t==='gorilla'||C.t==='bear'||C.t==='wolf'||C.t==='cat'){const dx=Hh[0]-E[0],dy=Hh[1]-E[1],L=Math.hypot(dx,dy)||1;a+='<path d="M'+f2(E[0]+dx*.3-dy/L*7)+' '+f2(E[1]+dy*.3+dx/L*7)+' l'+f2(-dy/L*4-dx/L*3)+' '+f2(dx/L*4-dy/L*3)+' M'+f2(E[0]+dx*.55-dy/L*6)+' '+f2(E[1]+dy*.55+dx/L*6)+' l'+f2(-dy/L*4-dx/L*3)+' '+f2(dx/L*4-dy/L*3)+'" stroke="'+chDk(armC,.25)+'" stroke-width="1.4" stroke-linecap="round"/>'}
    return a};
  const armsBehind=P.bar&&P.hd[1]<P.bar+10;
  const arms=arm(P.sl,P.el,P.hl,-1)+arm(P.sr,P.er,P.hr,1);
  body+=arms;
  body+=chDelt(P,armC,id,defs);
  /* tête */
  body+='<g transform="'+hT+'">'+chHead(C,o,ex,id,defs)+chHeadAcc(acc,C,o)+'</g>';
  /* mains (par-dessus) */
  if(P.bar)body+='<rect x="-10" y="'+(P.bar-5)+'" width="220" height="10" rx="5" fill="#2a2c33" opacity="0"/>';
  body+=chHand(P.hl,P.tl,C.hand,-1,gl,defs,id)+chHand(P.hr,P.tr,C.hand,1,gl,defs,id);
  if(o.pose==='sleep')body+='<g fill="'+(o.zc||'#9ad0ff')+'" font-family="Archivo,Arial,sans-serif" font-weight="900"><text x="138" y="52" font-size="18">z</text><text x="152" y="36" font-size="13">z</text><text x="162" y="24" font-size="9">z</text></g>';
  if(body.includes('url(#gGold)')){body=body.split('url(#gGold)').join('url(#'+id+'gd)');defs.push('<linearGradient id="'+id+'gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset=".55" stop-color="#f5c542"/><stop offset="1" stop-color="#c8930f"/></linearGradient>')}
  const vb='0 0 200 '+H;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+vb+'"'+(o.cls?' class="'+o.cls+'"':'')+' aria-hidden="true"><defs>'+defs.join('')+'</defs>'+body+'</svg>'}
/* ---- animation de traction (SMIL) : fusion des poses pullA et pullB ---- */
function charAnim(o,dur){o=Object.assign({},o);const n0=CHN;const a=charSvg(Object.assign({},o,{pose:'pullA'}));CHN=n0;const b=charSvg(Object.assign({},o,{pose:'pullB'}));
  const re=/<([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g,ta=[...a.matchAll(re)],tb=[...b.matchAll(re)];if(ta.length!==tb.length)return a;
  const pa=s=>{const m={};for(const x of s.matchAll(/([\w:-]+)="([^"]*)"/g))m[x[1]]=x[2];return m},AN=['d','x','y','cx','cy','r','rx','ry','width','height','x1','y1','x2','y2'],D=(dur||1.5)+'s';
  const sp=' calcMode="spline" keyTimes="0;.45;1" keySplines=".45 0 .4 1;.45 0 .4 1" dur="'+D+'" repeatCount="indefinite"';
  let out='',last=0;for(let i=0;i<ta.length;i++){const A=ta[i],B=tb[i];out+=a.slice(last,A.index);last=A.index+A[0].length;const xa=pa(A[2]),xb=pa(B[2]);let an='';
    AN.forEach(k=>{if(xa[k]!==undefined&&xa[k]!==xb[k])an+='<animate attributeName="'+k+'" values="'+xa[k]+';'+xb[k]+';'+xa[k]+'"'+sp+'/>'});
    if(xa.transform&&xa.transform!==xb.transform){const t1=/translate\(([-\d.]+)[ ,]([-\d.]+)\)/.exec(xa.transform),t2=/translate\(([-\d.]+)[ ,]([-\d.]+)\)/.exec(xb.transform||''),sc=/scale\(([-\d.]+)\)/.exec(xa.transform),s=sc?+sc[1]:1;
      if(t1&&t2){const dx=f2((t2[1]-t1[1])/s),dy=f2((t2[2]-t1[2])/s);an+='<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;'+dx+' '+dy+';0 0"'+sp+'/>'}}
    if(!an){out+=A[0];continue}out+=A[3]?'<'+A[1]+A[2]+'>'+an+'</'+A[1]+'>':'<'+A[1]+A[2]+'>'+an}
  return out+a.slice(last)}
