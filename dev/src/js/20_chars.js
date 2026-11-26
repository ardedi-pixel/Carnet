/* ===================== v6.1 : personnages style autocollant (DA d'origine) ===================== */
const CH_SKIN=['#fde3cf','#f5cba7','#f0bf8e','#d49a68','#a4693f','#6b4327'];
const CH_HAIRC={noir:'#1f1a17',brun:'#3b2416',chatain:'#7a4524',blond:'#e0b45c',roux:'#c0582b',gris:'#b4b0aa'};
const CH_HAIRN={noir:'Noir',brun:'Brun',chatain:'Châtain',blond:'Blond',roux:'Roux',gris:'Gris'};
const CH_SHIRT={'':'',acc:'',noir:'#2a2b33',blanc:'#f1f2f4',gris:'#8a909a',rouge:'#e0453f',bleu:'#3d7be0',vert:'#2fae63',rose:'#ff5fa8',orange:'#ff8a2a',violet:'#8a5ee0'};
const CH_SHIRTN={'':'Par défaut',acc:'Couleur de l\'appli',noir:'Noir',blanc:'Blanc',gris:'Gris',rouge:'Rouge',bleu:'Bleu',vert:'Vert',rose:'Rose',orange:'Orange',violet:'Violet'};
const CH_HS=[['court','Court'],['degrade','Dégradé'],['boucle','Bouclé'],['rase','Rasé'],['queue','Queue-de-cheval'],['chignon','Chignon'],['long','Longs'],['carre','Carré']];
/* espèces : k, nom, type, palettes de pelage/peau [couleur, nom] */
const CH_SP={
 homme:{n:'Homme',t:'human',pal:'skin',def:{c:2,hs:'court',hc:'brun'}},
 femme:{n:'Femme',t:'human',fem:1,pal:'skin',def:{c:1,hs:'queue',hc:'chatain'}},
 chat:{n:'Chat',t:'cat',pal:[['#f4a25a','Roux'],['#a4abb5','Gris'],['#34343a','Noir'],['#f1e6d4','Crème'],['#e0954a','Tigré']],def:{c:0}},
 loup:{n:'Loup',t:'wolf',pal:[['#9aa6b5','Gris'],['#8d6847','Brun'],['#ebe8e2','Blanc'],['#3a3c44','Noir']],def:{c:0}},
 ours:{n:'Ours',t:'bear',pal:[['#8f5c36','Brun'],['#33302d','Noir'],['#f0eadd','Polaire']],def:{c:0}},
 gorille:{n:'Gorille',t:'gorilla',pal:[['#3a3633','Noir'],['#5d5853','Gris argent']],def:{c:0}},
 panda:{n:'Panda',t:'panda',pal:[['#f6f4ef','Classique']],def:{c:0}},
 robot:{n:'Robot',t:'robot',pal:[['#bcc6d1','Argent'],['#e3b84c','Or'],['#4a4f5a','Noir'],['#5e96e0','Bleu']],def:{c:0},lock:1},
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
/* ---- traits de base : contour noir épais, aplats ---- */
const CK='#1b1b1f',COL=4.4;
const chPt=p=>f2(p[0])+' '+f2(p[1]);
const chLn=pts=>'M'+pts.map(chPt).join(' L');
const chSt=(d,w,c,x)=>'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+f2(w)+'" stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
const chTube=(pts,w,c)=>{const d=chLn(pts);return chSt(d,w+COL*2,CK)+chSt(d,w,c)};
const chP=(d,fill,sw,x)=>'<path d="'+d+'" fill="'+fill+'"'+(sw===0?'':' stroke="'+CK+'" stroke-width="'+(sw||COL)+'" stroke-linejoin="round"')+(x||'')+'/>';
const chC=(x,y,r,fill,sw,ex)=>'<circle cx="'+f2(x)+'" cy="'+f2(y)+'" r="'+f2(r)+'" fill="'+fill+'"'+(sw===0?'':' stroke="'+CK+'" stroke-width="'+(sw||COL)+'"')+(ex||'')+'/>';
const chE=(x,y,rx,ry,fill,sw,ex)=>'<ellipse cx="'+f2(x)+'" cy="'+f2(y)+'" rx="'+f2(rx)+'" ry="'+f2(ry)+'" fill="'+fill+'"'+(sw===0?'':' stroke="'+CK+'" stroke-width="'+(sw||COL)+'"')+(ex||'')+'/>';
const chG=(x,y,inner,ex)=>'<g transform="translate('+f2(x)+' '+f2(y)+')'+(ex||'')+'">'+inner+'</g>';
/* deux passes : contour commun puis remplissage (formes fusionnées) */
const chBlob=(parts,fill)=>'<g fill="'+CK+'" stroke="'+CK+'" stroke-width="'+(COL*2)+'" stroke-linejoin="round">'+parts+'</g><g fill="'+fill+'">'+parts+'</g>';
/* ---- palette résolue d'un personnage ---- */
function chCols(o){const sp=CH_SP[o.sp]||CH_SP.homme,t=sp.t;let base;
  if(sp.pal==='skin')base=CH_SKIN[Math.max(0,Math.min(5,o.c|0))];else base=(sp.pal[o.c|0]||sp.pal[0])[0];
  const dark=chLum(base)<.32,r={t,base,fur:base,arm:base,hand:base,fem:!!sp.fem,dark,light:chLt(base,.62),stripes:o.sp==='chat'&&((o.c|0)===0||(o.c|0)===4)};
  if(t==='cat')r.hand=r.light='#fff4e6';
  if(t==='wolf'){r.light=chLum(base)>.8?'#ffffff':'#f1f3f5';r.hand=base}
  if(t==='bear'){r.light=chMix(base,'#f6e7cf',.55);r.hand=chDk(base,.12)}
  if(t==='gorilla'){r.face=chMix(base,'#b5a597',.5);r.hand=chMix(base,'#8d8178',.45)}
  if(t==='panda'){r.arm=r.hand='#26262b';r.fur='#f6f4ef'}
  if(t==='robot'){r.arm=chDk(base,.06);r.hand=chDk(base,.32)}
  return r}
/* haut : '' = tenue d'origine ; acc = couleur de l'appli ; sinon la couleur choisie */
function chDefShirt(sp){const t=(CH_SP[sp]||CH_SP.homme).t;return sp==='femme'?'#ff5fa8':t==='human'?'#3a405c':t==='ninja'?'#2b2d38':''}
function chShirtCol(o){if(o.sh==='acc')return o.acc||'#e4ff1a';if(o.sh&&CH_SHIRT[o.sh])return CH_SHIRT[o.sh];return chDefShirt(o.sp)}
/* ---- poses (repère 200 x 200 ; tractions : 200 x 260) ---- */
const CH_POSE={
 icon:{hd:[100,51],ty:96,bar:87.2,sl:[77,104],sr:[123,104],el:[54,115],er:[146,115],hl:[49,88.4],hr:[151,88.4],tl:'grip',tr:'grip',lg:'hang'},
 hang:{hd:[100,92],ty:137,bar:40,sl:[77,145],sr:[123,145],el:[66,94],er:[134,94],hl:[60,41],hr:[140,41],tl:'grip',tr:'grip',lg:'hang'},
 idle:{hd:[100,56],ty:101,sl:[77,109],sr:[123,109],el:[69,134],er:[131,134],hl:[67,158],hr:[133,158],tl:'fist',tr:'fist',lg:'stand'},
 cheer:{hd:[100,56],ty:101,sl:[77,109],sr:[123,109],el:[60,90],er:[140,90],hl:[50,68],hr:[150,68],tl:'fist',tr:'fist',lg:'stand',hop:1},
 flex:{hd:[100,56],ty:101,sl:[77,109],sr:[123,109],el:[51,106],er:[149,106],hl:[54,81],hr:[146,81],tl:'fist',tr:'fist',lg:'stand',bic:1},
 thumbs:{hd:[98,56],ty:101,sl:[77,109],sr:[123,109],el:[69,134],er:[147,121],hl:[67,158],hr:[149,97],tl:'fist',tr:'thumb',lg:'stand'},
 wave:{hd:[98,56],ty:101,sl:[77,109],sr:[123,109],el:[69,134],er:[146,97],hl:[67,158],hr:[153,72],tl:'fist',tr:'open',lg:'stand'},
 sleep:{hd:[102,58],hrot:10,ty:101,sl:[77,109],sr:[123,109],el:[71,134],er:[129,134],hl:[70,158],hr:[130,158],tl:'fist',tr:'fist',lg:'stand',zz:1},
 pullA:{hd:[100,108],ty:153,bar:88,sl:[77,161],sr:[123,161],el:[64,125],er:[136,125],hl:[60,88],hr:[140,88],tl:'grip',tr:'grip',lg:'hang',H:260},
 pullB:{hd:[100,53],ty:98,bar:88,sl:[77,106],sr:[123,106],el:[42,124],er:[158,124],hl:[60,88],hr:[140,88],tl:'grip',tr:'grip',lg:'hang',H:260}
};
/* ---- mains ---- */
function chHand(P,type,col,side,gl,C){const c=gl||col,x=P[0],y=P[1],ln=gl?'#5b5d66':CK,paw=!gl&&(C.t==='cat'||C.t==='wolf'||C.t==='bear');let o='';
  if(C.t==='robot'&&!gl){return chG(x,y,chC(0,0,10,c)+chSt('M-5 1 H5',2.4,CK)+chC(0,-4.5,2,chLt(c,.35),0))}
  if(type==='thumb'){const tx=side>0?-6:6;o+=chP('M'+(tx-4)+' -4 L'+(tx-4)+' -16 Q'+(tx-4)+' -21.5 '+tx+' -21.5 Q'+(tx+4)+' -21.5 '+(tx+4)+' -16 L'+(tx+4)+' -4 Z',c,3.6)}
  if(type==='open'){const F=[[-6.5,-3,-9,-17],[-2.2,-5,-2.8,-20],[2.4,-5,3.4,-20],[6.6,-3,9.4,-16.5],[8,3,16,-2]];
    const fp=F.map(f=>'<path d="M'+f[0]+' '+f[1]+' L'+f[2]+' '+f[3]+'" stroke-width="5.6" stroke-linecap="round" fill="none"/>').join('');
    o+='<g stroke="'+CK+'" fill="'+CK+'">'+F.map(f=>chSt('M'+f[0]+' '+f[1]+' L'+f[2]+' '+f[3],5.6+COL*2,CK)).join('')+chC(0,0,9.6,CK,COL*2)+'</g>'+F.map(f=>chSt('M'+f[0]+' '+f[1]+' L'+f[2]+' '+f[3],5.6,c)).join('')+chC(0,0,9.6,c,0);
    o+=chSt('M-4.6 4.4 Q0 6.6 4.6 4.4',2,ln);return chG(x,y,o)}
  const r=type==='grip'?10.4:9.8;o+=chC(0,0,r,c);
  if(paw&&type!=='thumb')o+=chSt('M-3.6 4.4 V8',2.2,CK)+chSt('M3.6 4.4 V8',2.2,CK);
  else if(type==='grip')o+=chSt('M-5.2 -2.4 Q0 -4.8 5.2 -2.4',2.2,ln)+chSt('M-5.2 2.4 Q0 0 5.2 2.4',2.2,ln);
  else o+=chSt('M-5 -1.6 Q0 -4 5 -1.6',2.2,ln)+chSt('M-4 3 Q0 1.4 4 3',1.8,ln);
  if(gl)o+=chP('M-9.4 5.4 Q0 10.6 9.4 5.4 L8.6 9.6 Q0 14.4 -8.6 9.6 Z',chLt(gl,.25),2.4);
  return chG(x,y,o)}
/* ---- visages ---- */
const CH_BLUSH='#ff7a8a';
function chEyesH(ex,fem,ec){const k=ec||CK;let s='';
  [-1,1].forEach(d=>{const x=d*11.2;
    if(ex==='happy'||ex==='grin2')s+=chSt('M'+(x-5)+' 7 Q'+x+' -.4 '+(x+5)+' 7',3.2,CK);
    else if(ex==='sleep')s+=chSt('M'+(x-5)+' 4 Q'+x+' 9.4 '+(x+5)+' 4',3,CK);
    else{const r=ex==='wow'?4.8:3.9;s+=chC(x,5.2,r,k,0)+chC(x+1.3,3.7,1.3,'#fff',0);if(fem)s+=chSt('M'+(x+d*3.8)+' 2.6 L'+(x+d*7.4)+' .2',2.6,CK)}});
  return s}
function chBrowsH(ex,col){const c=col||CK;
  if(ex==='effort'||ex==='focus')return chSt('M-16.8 -4.2 L-6.4 -1.4',4,c)+chSt('M16.8 -4.2 L6.4 -1.4',4,c);
  if(ex==='sleep')return chSt('M-16 -2 Q-11.5 -3.6 -7 -2',3,c)+chSt('M16 -2 Q11.5 -3.6 7 -2',3,c);
  const y=ex==='wow'?-9:-5;return chSt('M-17 '+(y+1)+' Q-11.6 '+(y-3)+' -6 '+(y+.4),3.4,c)+chSt('M17 '+(y+1)+' Q11.6 '+(y-3)+' 6 '+(y+.4),3.4,c)}
function chMouthH(ex,y){y=y||0;
  if(ex==='grin'||ex==='happy')return chP('M-10.6 '+(15.6+y)+' Q0 '+(30.5+y)+' 10.6 '+(15.6+y)+' Z','#7a2330',3.4)+chP('M-5.6 '+(23.6+y)+' Q0 '+(19.6+y)+' 5.6 '+(23.6+y)+' Q3.6 '+(27.2+y)+' 0 '+(27.2+y)+' Q-3.6 '+(27.2+y)+' -5.6 '+(23.6+y)+' Z','#ff8796',0);
  if(ex==='effort')return '<rect x="-9" y="'+(15+y)+'" width="18" height="8.4" rx="3.2" fill="#fff" stroke="'+CK+'" stroke-width="3"/>'+chSt('M-8 '+(19.2+y)+' H8 M-3 '+(16+y)+' V'+(22.4+y)+' M3 '+(16+y)+' V'+(22.4+y),1.5,CK);
  if(ex==='wow')return chE(0,19.6+y,5,6,'#7a2330',3.2);
  if(ex==='sleep')return chSt('M-4.6 '+(18+y)+' Q0 '+(21+y)+' 4.6 '+(18+y),3,CK);
  return chSt('M-9.6 '+(17.2+y)+' Q0 '+(24.8+y)+' 9.6 '+(17.2+y),3.6,CK)}
const chBlushes=(x,y)=>chE(-x,y,5.2,3,CH_BLUSH,0,' opacity=".45"')+chE(x,y,5.2,3,CH_BLUSH,0,' opacity=".45"');
const chSweat=(x,y)=>chP('M'+x+' '+y+' Q'+(x+5.6)+' '+(y+8)+' '+x+' '+(y+11.2)+' Q'+(x-5.6)+' '+(y+8)+' '+x+' '+y+' Z','#7fd3ff',2.4);
/* ---- cheveux (repère tête, r = 30.4) ---- */
function chHairBack(hs,col){const dk=chDk(col,.12);
  if(hs==='queue')return chP('M17.2 -26.8 C41.2 -31.2 57.6 -12 51.2 12.8 C49.2 21.2 44.4 27.6 37.2 32 C41.2 18.8 40.8 5.2 28.8 -5.6 Z',dk)+chC(29.2,-23.2,4.8,'#ff5fa8',3);
  if(hs==='long')return chP('M-32 -6 C-37 22 -35 46 -28 62 Q-16 68 0 66 Q16 68 28 62 C35 46 37 22 32 -6 Z',dk);
  if(hs==='carre')return chP('M-32.5 -4 C-35 14 -33 28 -27 35 Q0 41 27 35 C33 28 35 14 32.5 -4 Z',dk);
  if(hs==='chignon')return chC(0,-36,13,col)+chSt('M-6 -40 Q0 -44 6 -40',2.2,chDk(col,.3));
  return ''}
function chHairFront(hs,col,skin){
  if(hs==='rase')return chP('M-29.6 -5 C-30.4 -23 -16.4 -32.4 0 -32.4 C16.4 -32.4 30.4 -23 29.6 -5 C26 -13 17 -18.6 0 -18.6 C-17 -18.6 -26 -13 -29.6 -5 Z',chMix(skin,col,.62),3.4);
  if(hs==='degrade')return chP('M-30.4 -1.6 C-32 -16 -26 -26 -16 -31 C-12 -42 8 -46 20 -38 C30 -32 33 -18 30.4 -1.6 C27.6 -9 23 -13 16 -14.6 C10 -11.4 1 -10.4 -8 -12.6 C-17 -12.4 -25 -8.4 -30.4 -1.6 Z',col)+chSt('M-6 -36 Q6 -41 16 -34',2.2,chLt(col,.25));
  if(hs==='boucle'){const pts=[[-27,-8],[-24,-19],[-16,-28],[-5,-32],[6,-32],[17,-28],[25,-19],[28,-8],[-11,-20],[2,-22],[14,-19]];return chBlob(pts.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(p[1]<-20?10.4:8.8)+'"/>').join(''),col)+pts.slice(0,8).map(p=>chSt('M'+(p[0]-3.4)+' '+(p[1]-1)+' q3.4 -3.4 6.8 0',1.8,chLt(col,.28))).join('')}
  if(hs==='queue'||hs==='chignon')return chP('M-30.8 0.4 C-32.8 -20.8 -18 -34 0 -34 C18 -34 32.8 -20.8 30.8 0.4 C22.4 -2.8 14.8 -9.2 10 -17.2 C2.8 -7.6 -11.2 -2 -30.8 0.4 Z',col);
  if(hs==='long'||hs==='carre')return chP('M-31.4 8 C-34 -20 -18 -34 0 -34 C18 -34 34 -20 31.4 8 C28.4 1 27 -6 23 -11.4 C14 -7.4 3 -9.4 -5 -17.6 C-11 -9.6 -20 -6.4 -27.4 -6.2 C-29.6 -1.6 -31 3 -31.4 8 Z',col);
  return chP('M-30.4 -0.8 C-32.8 -20 -19 -33.6 0 -33.6 C19 -33.6 32.8 -20 30.4 -0.8 C26.8 -8.8 20.8 -12.8 13.2 -14 C14.8 -10.8 14.4 -7.6 12.4 -5.6 C9.2 -10.8 2 -13.2 -6.4 -12.8 C-15.2 -12.4 -24.4 -8.8 -30.4 -0.8 Z',col)}
/* ---- têtes par espèce (repère local, centre 0,0) ; renvoie aussi le haut de la tête ---- */
function chAnimalEyes(ex,C,x,y,rx,ry,iris){let s='';[-1,1].forEach(d=>{const X=d*x;
  if(ex==='happy')s+=chSt('M'+(X-5.6)+' '+(y+3)+' Q'+X+' '+(y-4.6)+' '+(X+5.6)+' '+(y+3),3.2,CK);
  else if(ex==='sleep')s+=chSt('M'+(X-5.6)+' '+y+' Q'+X+' '+(y+5.4)+' '+(X+5.6)+' '+y,3,CK);
  else{const k=ex==='wow'?1.15:1;if(iris){s+=chE(X,y,rx*k,ry*k,iris,2.4)+chE(X,y,rx*.36,ry*.82,CK,0)}else s+=chE(X,y,rx*k,ry*k,CK,0);s+=chC(X+rx*.34,y-ry*.36,rx*.38,'#fff',0)+chC(X-rx*.24,y+ry*.26,rx*.17,'#fff',0)}});return s}
function chHead(C,o,ex){const t=C.t,b=C.base;let s='',top=-34,band=[-13,30.4];
  if(t==='human'){const hs=o.hs||'court',hc=CH_HAIRC[o.hc]||CH_HAIRC.brun,fem=C.fem;
    s+=chC(-30.8,2.8,6.6,b)+chC(30.8,2.8,6.6,b)+chC(0,0,30.4,b);
    s+=chHairFront(hs,hc,b)+chBrowsH(ex,chDk(hc,.25))+chEyesH(ex,fem)+chBlushes(18.4,13.6)+chMouthH(ex);
    if(fem)s+=chC(-31.2,11.2,2.6,'#ffd23f',2)+chC(31.2,11.2,2.6,'#ffd23f',2);
    top=hs==='boucle'?-42:hs==='degrade'?-44:hs==='chignon'?-48:-34}
  else if(t==='ninja'){const m=chShirtCol(o)||'#2b2d38',md=chDk(m,.35);
    s+=chC(0,0,30.4,m)+chP('M-28 -7 Q0 -12.6 28 -7 L27 11.6 Q0 16 -27 11.6 Z',b,3);
    s+=chSt('M-16.6 -1.6 L-6.6 1.2',3.6,CK)+chSt('M16.6 -1.6 L6.6 1.2',3.6,CK);
    s+=(ex==='sleep'||ex==='happy'?chEyesH(ex,0).replace(/ 7 Q/g,' 6 Q'):chC(-11,5,3.6,CK,0)+chC(11,5,3.6,CK,0)+chC(-9.8,3.6,1.2,'#fff',0)+chC(12.2,3.6,1.2,'#fff',0));
    s+=chSt('M-14 22 Q0 27 14 22',2.2,md);
    const hb='#e53935';s+=chP('M-30 -13 Q0 -22.4 30 -13 L30.2 -6.6 Q0 -16 -30.2 -6.6 Z',hb,3)+chTube([[30,-10],[42,-6],[48,2]],4.6,hb)+chTube([[30,-10],[44,-14],[52,-10]],4.6,hb)+chC(30,-10,4.6,chDk(hb,.15),2.6);
    top=-31;band=null}
  else if(t==='cat'){const L=C.light,st=chDk(b,.2);
    s+=chP('M-29.2 -15.2 L-32.4 -42.8 L-7.6 -26.4 Z',b)+chP('M-25.2 -22 L-26.8 -34.4 L-14.4 -26 Z','#ffb1c4',0)+chP('M29.2 -15.2 L32.4 -42.8 L7.6 -26.4 Z',b)+chP('M25.2 -22 L26.8 -34.4 L14.4 -26 Z','#ffb1c4',0);
    s+=chE(0,0,34,28.4,b)+chE(0,11.6,15.6,10.8,L,0);
    if(C.stripes)s+=chSt('M0 -25.6 V-17.2',3.2,st)+chSt('M-8.8 -24 L-6.8 -16.8',3.2,st)+chSt('M8.8 -24 L6.8 -16.8',3.2,st);
    if(ex==='effort')s+=chSt('M-21 -10.4 L-9 -7.2',3.4,CK)+chSt('M21 -10.4 L9 -7.2',3.4,CK);
    s+=chAnimalEyes(ex,C,14,-.8,6.6,7.8,C.dark?'#d7e05a':'')+chBlushes(20.8,9.2);
    s+=chP('M-3.4 7.2 H3.4 L0 11.2 Z','#ff86a2',2);
    s+=ex==='grin'||ex==='happy'?chP('M-6.6 13.4 Q0 25 6.6 13.4 Z','#7a2330',2.6):chSt('M-6.4 13.2 Q-3.2 17.2 0 13.6 Q3.2 17.2 6.4 13.2',2.8,CK);
    s+=chSt('M-18.8 9.6 L-36.8 6.8',2,CK)+chSt('M-18.8 13.6 L-36.4 15.2',2,CK)+chSt('M18.8 9.6 L36.8 6.8',2,CK)+chSt('M18.8 13.6 L36.4 15.2',2,CK);
    top=-36;band=[-15,32]}
  else if(t==='wolf'){const L=C.light,dk=chDk(b,.28);
    s+=chP('M-30 -11.2 L-37.2 -44.8 L-7.6 -24.8 Z',b)+chP('M-26.4 -18.4 L-30.8 -35.2 L-14.8 -24 Z',dk,0)+chP('M30 -11.2 L37.2 -44.8 L7.6 -24.8 Z',b)+chP('M26.4 -18.4 L30.8 -35.2 L14.8 -24 Z',dk,0);
    s+=chP('M-33.6 -0.4 C-33.6 -19.6 -18 -29.6 0 -29.6 C18 -29.6 33.6 -19.6 33.6 -0.4 L39.2 6 L33.2 9.2 L37.2 16.4 L29.2 18.4 C22 28 12 32.4 0 32.4 C-12 32.4 -22 28 -29.2 18.4 L-37.2 16.4 L-33.2 9.2 L-39.2 6 Z',b);
    s+=chP('M-23.2 -12.8 C-15.2 -24.8 15.2 -24.8 23.2 -12.8 C15.6 -14.8 8 -11.6 0 -4.8 C-8 -11.6 -15.6 -14.8 -23.2 -12.8 Z',dk,0);
    s+=chP('M-18 11.2 C-16 23.2 -8.8 30 0 30.4 C8.8 30 16 23.2 18 11.2 C12 16 6 17.2 0 17.2 C-6 17.2 -12 16 -18 11.2 Z',L,0);
    s+=ex==='effort'||ex==='neutral'?chSt('M-21.2 -6.8 L-7.2 -2.8',4,CK)+chSt('M21.2 -6.8 L7.2 -2.8',4,CK):chSt('M-20 -5.4 Q-14 -8 -8 -5.4',3.4,CK)+chSt('M20 -5.4 Q14 -8 8 -5.4',3.4,CK);
    s+=chAnimalEyes(ex,C,13.2,2.4,5.4,6.2,C.dark?'#f2b544':'')+chBlushes(22.4,13.2);
    s+=chP('M-6.8 9.2 Q0 6 6.8 9.2 Q3.6 16 0 16.4 Q-3.6 16 -6.8 9.2 Z',CK,0);
    s+=ex==='grin'||ex==='happy'?chP('M-7.4 18.6 Q0 30 7.4 18.6 Q0 21.6 -7.4 18.6 Z','#7a2330',2.4):chSt('M0 16.4 V20 M-7.2 20.8 Q-3.2 24.4 0 20 Q3.2 24.4 7.2 20.8',2.6,CK);
    top=-40;band=[-13,33.6]}
  else if(t==='bear'){const L=C.light;
    s+=chC(-24,-21,10.4,b)+chC(-24,-21,5.4,L,0)+chC(24,-21,10.4,b)+chC(24,-21,5.4,L,0);
    s+=chE(0,0,32,29,b)+chE(0,11,15.4,11.6,L,0);
    if(ex==='effort')s+=chSt('M-19 -9.6 L-7.6 -6.4',3.6,CK)+chSt('M19 -9.6 L7.6 -6.4',3.6,CK);
    s+=chAnimalEyes(ex,C,12.4,-1.6,4,4.6,C.dark?'#e9b36a':'')+chBlushes(21,8.6);
    s+=chP('M-6.4 3.2 Q0 0 6.4 3.2 Q3.2 9.4 0 9.6 Q-3.2 9.4 -6.4 3.2 Z',CK,0);
    s+=ex==='grin'||ex==='happy'?chP('M-6.6 12.6 Q0 23.4 6.6 12.6 Q0 15 -6.6 12.6 Z','#7a2330',2.4):chSt('M0 9.6 V13 M-5.6 14 Q-2.8 17.2 0 13.6 Q2.8 17.2 5.6 14',2.6,CK);
    top=-33;band=[-14,31]}
  else if(t==='gorilla'){const F=C.face;
    s+=chC(-29.6,3,6.4,F)+chC(29.6,3,6.4,F)+chP('M0 -31 C18 -31 31 -20 31 -2 C31 18 18 30 0 30 C-18 30 -31 18 -31 -2 C-31 -20 -18 -31 0 -31 Z',b);
    s+=chP('M0 -12 C10 -21 26 -16 24.4 -2 C29.6 7 23 24.4 0 25.4 C-23 24.4 -29.6 7 -24.4 -2 C-26 -16 -10 -21 0 -12 Z',F,3);
    s+=chSt('M-21 -7 Q-11 -14.6 -1.4 -8.4',4.6,CK)+chSt('M21 -7 Q11 -14.6 1.4 -8.4',4.6,CK);
    s+=ex==='happy'||ex==='sleep'?[-1,1].map(d=>chSt(ex==='sleep'?'M'+(d*9.6-4.6)+' -2 Q'+(d*9.6)+' 2.6 '+(d*9.6+4.6)+' -2':'M'+(d*9.6-4.6)+' 0 Q'+(d*9.6)+' -5.6 '+(d*9.6+4.6)+' 0',3,CK)).join(''):chC(-9.6,-1,3.6,CK,0)+chC(9.6,-1,3.6,CK,0)+chC(-8.4,-2.4,1.2,'#fff',0)+chC(10.8,-2.4,1.2,'#fff',0);
    s+=chE(-3.8,8,2.6,1.9,CK,0)+chE(3.8,8,2.6,1.9,CK,0)+chBlushes(17,11);
    s+=ex==='grin'||ex==='happy'?chP('M-9 14.6 Q0 25 9 14.6 Q0 17.4 -9 14.6 Z','#5a1d24',2.6):ex==='effort'?chMouthH('effort',-1.6):chSt('M-8 15.6 Q0 19.6 8 15.6',3,CK);
    top=-31;band=[-15,31]}
  else if(t==='panda'){
    s+=chC(-24.6,-22,10.6,'#26262b')+chC(24.6,-22,10.6,'#26262b')+chE(0,0,33,29,b);
    s+=chE(-12.6,1.4,8,10.6,'#26262b',0,' transform="rotate(26 -12.6 1.4)"')+chE(12.6,1.4,8,10.6,'#26262b',0,' transform="rotate(-26 12.6 1.4)"');
    if(ex==='happy'||ex==='sleep')s+=[-1,1].map(d=>chSt(ex==='sleep'?'M'+(d*12.4-4.4)+' 1 Q'+(d*12.4)+' 5.4 '+(d*12.4+4.4)+' 1':'M'+(d*12.4-4.4)+' 3 Q'+(d*12.4)+' -2.6 '+(d*12.4+4.4)+' 3',2.6,'#fff')).join('');
    else s+=chC(-12,1.4,3.8,'#fff',0)+chC(12,1.4,3.8,'#fff',0)+chC(-11.4,1.8,2.2,CK,0)+chC(12.6,1.8,2.2,CK,0);
    if(ex==='effort')s+=chSt('M-20 -11 L-9.6 -8',3.4,CK)+chSt('M20 -11 L9.6 -8',3.4,CK);
    s+=chBlushes(21,12.4)+chP('M-5.2 7.6 Q0 5 5.2 7.6 Q2.6 12.4 0 12.6 Q-2.6 12.4 -5.2 7.6 Z',CK,0);
    s+=ex==='grin'||ex==='happy'?chP('M-6.6 15.4 Q0 25.6 6.6 15.4 Q0 17.6 -6.6 15.4 Z','#7a2330',2.4):chSt('M0 12.6 V15.6 M-5.4 16.4 Q-2.7 19.4 0 15.8 Q2.7 19.4 5.4 16.4',2.6,CK);
    top=-33;band=[-14,32]}
  else if(t==='robot'){const a=o.acc||'#e4ff1a',bd=chDk(b,.3);
    s+=chSt('M0 -29 V-41',3.4,CK)+chC(0,-44.6,5.2,a,3);
    s+='<rect x="-37.2" y="-11" width="9" height="18" rx="3.4" fill="'+bd+'" stroke="'+CK+'" stroke-width="3.4"/><rect x="28.2" y="-11" width="9" height="18" rx="3.4" fill="'+bd+'" stroke="'+CK+'" stroke-width="3.4"/>';
    s+='<rect x="-30" y="-30" width="60" height="56" rx="14" fill="'+b+'" stroke="'+CK+'" stroke-width="'+COL+'"/>'+chSt('M-22 -24 H-8',3,chLt(b,.4));
    s+='<rect x="-23.4" y="-16.4" width="46.8" height="28.8" rx="10" fill="#141b26" stroke="'+CK+'" stroke-width="3"/>';
    const E=ex==='happy'||ex==='grin'?[-1,1].map(d=>chSt('M'+(d*10.4-5)+' 1.4 Q'+(d*10.4)+' -5.4 '+(d*10.4+5)+' 1.4',3.4,a)).join(''):ex==='sleep'?chSt('M-15 -.4 H-6 M6 -.4 H15',3.2,a):ex==='effort'?chSt('M-15 -5 L-6 -1.6 L-15 1.8 M15 -5 L6 -1.6 L15 1.8',3,a):chC(-10.4,-1.4,ex==='wow'?5.6:4.6,a,0)+chC(10.4,-1.4,ex==='wow'?5.6:4.6,a,0);
    s+=E+(ex==='sleep'?'':chSt(ex==='wow'?'M-3 6.8 H3':'M-6.4 6.2 Q0 9.8 6.4 6.2',2.4,a));
    s+=chE(-22,17,4,2.4,CH_BLUSH,0,' opacity=".55"')+chE(22,17,4,2.4,CH_BLUSH,0,' opacity=".55"');
    top=-31;band=null}
  if(ex==='effort'||ex==='focus')s+=chSweat(t==='robot'?36:35.2,t==='wolf'||t==='cat'?-28:-22.8);
  return {s,top,band}}
/* ---- accessoires de tête ---- */
function chHeadAcc(acc,C,H){let s='';const t=C.t;
  if(acc.includes('bandeau')&&H.band){const y=H.band[0],w=H.band[1],c='#e53935';s+=chP('M'+(-w)+' '+y+' Q0 '+(y-11)+' '+w+' '+y+' L'+(w+.4)+' '+(y+7.4)+' Q0 '+(y-3.4)+' '+(-w-.4)+' '+(y+7.4)+' Z',c,3.2)+chTube([[w-1,y+3],[w+12,y+8],[w+16,y+16]],4.4,c)+chTube([[w-1,y+3],[w+13,y-1],[w+20,y+3]],4.4,c)+chC(w-1,y+3,4.4,chDk(c,.15),2.6)}
  if(acc.includes('couronne')){const y=H.top+4;s+='<g transform="rotate(-9 0 '+y+')">'+chP('M-15 '+y+' L-17.4 '+(y-16)+' L-8 '+(y-8)+' L0 '+(y-20)+' L8 '+(y-8)+' L17.4 '+(y-16)+' L15 '+y+' Z','#f5c542',3.2)+chC(0,y-20,2.8,'#ff4d6d',2)+chC(-17.4,y-16,2.4,'#4dd2ff',2)+chC(17.4,y-16,2.4,'#4dd2ff',2)+chSt('M-13 '+(y-3.6)+' H13',2.2,'#c8930f')+'</g>'}
  return s}
/* ---- corps ---- */
function chBody(P,C,o,shirt,acc,id){const t=C.t,b=C.base,hum=t==='human'||t==='ninja',ty=P.ty,hang=P.lg==='hang';let back='',front='',legs='';
  if(hum){const fem=C.fem,ninja=t==='ninja',sk=b,suit=ninja?shirt:'',pants=ninja?chDk(shirt,.12):fem?'#43306a':'#1f2130',acol=o.acc||'#e4ff1a';
    const lc=ninja?chDk(shirt,.05):sk;const lx=hang?[[-12,62.8],[-12.4,81.6]]:[[-12,62.8],[-12,81.6]];
    legs+=chTube(lx,11.6,lc)+chTube(lx.map(p=>[-p[0],p[1]]),11.6,lc);
    const shoe=ninja?'#1e1f26':fem?'#ffffff':'#2a2b38',sole=ninja?'#3b3d48':fem?shirt:'#ffffff';
    legs+='<rect x="-23" y="79.4" width="21.4" height="11.4" rx="5.7" fill="'+shoe+'" stroke="'+CK+'" stroke-width="'+COL+'"/><rect x="1.6" y="79.4" width="21.4" height="11.4" rx="5.7" fill="'+shoe+'" stroke="'+CK+'" stroke-width="'+COL+'"/>'+chSt('M-20 87.4 H-5',2.4,sole)+chSt('M5 87.4 H20',2.4,sole);
    if(fem&&!ninja){front+=chP('M-21.2 22 L21.2 22 L22 36.4 L-22 36.4 Z',sk)+chP('M-21.6 34.8 L21.6 34.8 L20.4 80.8 L5.2 80.8 L0 49.6 L-5.2 80.8 L-20.4 80.8 Z',pants)+chP('M-24.8 0 Q0 -5.2 24.8 0 L21.6 24.8 Q0 28 -21.6 24.8 Z',shirt)+chSt('M-13.2 2.8 Q0 10.8 13.2 2.8',2.6,'#ffffff')}
    else{const tank=chP('M-25.2 0 Q0 -5.2 25.2 0 L21.6 46 Q0 49.2 -21.6 46 Z',shirt);
      front+=tank+chSt('M-10 8.8 Q0 13.8 10 8.8',2.6,chLum(shirt)>.6?chDk(shirt,.25):chLt(shirt,.22));
      if(ninja)front+=chSt('M-12 4 L6 30 M12 4 L-6 30',2.6,chDk(shirt,.35))+chP('M-22.4 36 L22.4 36 L22 44 L-22 44 Z',chDk(shirt,.45),3)+chP('M2 38 L12 46 L8 48 L0 42 Z',chDk(shirt,.45),2.4);
      front+=chP('M-22 43.2 L22 43.2 L24.4 64 L2.8 64 L0 54 L-2.8 64 L-24.4 64 Z',pants)+(ninja?'':chSt('M-20.8 46.8 L-22.4 61.6',2.2,acol)+chSt('M20.8 46.8 L22.4 61.6',2.2,acol))}
    if(acc.includes('medaille'))front+=chSt('M-10 1 L-2 26 M10 1 L2 26',5.4,'#3d7be0')+chC(0,33,9,'#f5c542',3.2)+chP('M0 27.6 l1.7 3.5 3.8 .5 -2.8 2.6 .7 3.8 -3.4 -1.8 -3.4 1.8 .7 -3.8 -2.8 -2.6 3.8 -.5 Z','#c8930f',0);
    return {legs:chG(100,ty,legs),front:chG(100,ty,front),back:''}}
  /* animaux et robot : corps ovale */
  const by=31,rx=t==='gorilla'?28:t==='bear'?27:t==='robot'?26:25.4,ry=t==='gorilla'||t==='bear'?31:30.2;
  const lc=t==='panda'?'#26262b':t==='robot'?chDk(b,.12):b,fc=t==='cat'?C.light:t==='panda'?'#26262b':t==='robot'?chDk(b,.34):t==='gorilla'?C.hand:b;
  if(hang)legs+=chE(-12,by+32.8,10.4,12.4,lc)+chE(12,by+32.8,10.4,12.4,lc)+chE(-12,by+43.2,7.2,4.4,fc,2.8)+chE(12,by+43.2,7.2,4.4,fc,2.8);
  else legs+=chTube([[-12,by+16],[-12,by+42]],12,lc)+chTube([[12,by+16],[12,by+42]],12,lc)+chE(-13,by+49.6,11.6,7.4,fc)+chE(13,by+49.6,11.6,7.4,fc);
  if(t==='robot')legs=legs.replace(/<ellipse cx="(-?13)" cy="([\d.]+)" rx="11.6" ry="7.4"/g,(m,x,y)=>'<rect x="'+(+x-12)+'" y="'+(+y-6.6)+'" width="24" height="13.2" rx="5" ry="5"');
  /* queue */
  if(t==='cat'){const d='M20 '+(by+19.2)+' C40 '+(by+28.8)+' 55.2 '+(by+20)+' 52.8 '+(by-.8)+' C52 '+(by-8)+' 46.4 '+(by-12)+' 41.2 '+(by-10);back+=chSt(d,20,CK)+chSt(d,11.2,b);if(C.stripes)back+=chSt('M42.4 '+(by+24.8)+' L45.2 '+(by+19.2),2.8,chDk(b,.2))+chSt('M51.2 '+(by+12)+' L46.4 '+(by+9.6),2.8,chDk(b,.2))}
  if(t==='wolf'){back+=chP('M16 '+(by+23.2)+' C40 '+(by+36.8)+' 65.2 '+(by+24.8)+' 61.2 '+(by-4)+' C60 '+(by-12.4)+' 53.6 '+(by-18)+' 47.2 '+(by-16)+' C50.4 '+(by-6)+' 48.4 '+(by+4.4)+' 40.4 '+(by+10.4)+' C34 '+(by+15.2)+' 24.4 '+(by+16.4)+' 16 '+(by+12.4)+' Z',b)+chP('M60.8 '+(by-5.2)+' C60 '+(by-12)+' 54.8 '+(by-16.8)+' 49.2 '+(by-15.6)+' C51.2 '+(by-10)+' 51.2 '+(by-5.2)+' 50 '+(by-1.2)+' C54 '+(by-.8)+' 58 '+(by-2.4)+' 60.8 '+(by-5.2)+' Z',C.light,0)}
  if(t==='bear')back+=chC(20,by+20,8,b);
  const wear=!!o.sh&&t!=='robot',bodyC=t==='panda'?C.fur:b;
  front+=chE(0,by,rx,ry,wear?shirt:bodyC);
  if(wear){front+=chP('M-11 '+(by-28.6)+' Q0 '+(by-14)+' 11 '+(by-28.6)+' Q0 '+(by-31)+' -11 '+(by-28.6)+' Z',bodyC,0)+chSt('M-11.6 '+(by-28)+' Q0 '+(by-13.6)+' 11.6 '+(by-28),2.6,chLum(shirt)>.6?chDk(shirt,.25):chLt(shirt,.22))}
  else if(t==='cat'){front+=chE(0,by+6.8,14.8,19.2,C.light,0);if(C.stripes)front+=chSt('M-20.4 '+(by-8)+' L-14 '+(by-5.6),2.8,chDk(b,.2))+chSt('M-21.2 '+(by+2)+' L-14.8 '+(by+3.2),2.8,chDk(b,.2))+chSt('M20.4 '+(by-8)+' L14 '+(by-5.6),2.8,chDk(b,.2))+chSt('M21.2 '+(by+2)+' L14.8 '+(by+3.2),2.8,chDk(b,.2))}
  else if(t==='wolf')front+=chP('M-13.6 '+(by-21.6)+' L13.6 '+(by-21.6)+' L11.2 '+(by-13.2)+' L14.8 '+(by-6.8)+' L10 '+(by-.8)+' L12.8 '+(by+6.8)+' L6 '+(by+14)+' L0 '+(by+22.8)+' L-6 '+(by+14)+' L-12.8 '+(by+6.8)+' L-10 '+(by-.8)+' L-14.8 '+(by-6.8)+' L-11.2 '+(by-13.2)+' Z',C.light,0);
  else if(t==='bear')front+=chE(0,by+6,15.6,19.6,C.light,0);
  else if(t==='gorilla')front+=chE(-10.4,by-8.6,11.2,9,C.face,2.6)+chE(10.4,by-8.6,11.2,9,C.face,2.6)+chE(0,by+12,9,9.6,chMix(b,C.face,.35),0);
  else if(t==='robot'){const a=o.acc||'#e4ff1a';front+='<rect x="-15" y="'+(by-17)+'" width="30" height="26" rx="7" fill="'+chDk(b,.16)+'" stroke="'+CK+'" stroke-width="3"/>'+chC(0,by-4,6.4,a,2.6)+chC(-1.6,by-5.6,2,'#fff',0,' opacity=".7"')+chC(-8,by+15,2.2,chDk(b,.4),0)+chC(0,by+15,2.2,chDk(b,.4),0)+chC(8,by+15,2.2,chDk(b,.4),0)}
  if(acc.includes('medaille')&&t!=='robot')front+=chSt('M-10 '+(by-28)+' L-2 '+(by-6)+' M10 '+(by-28)+' L2 '+(by-6),5.4,'#3d7be0')+chC(0,by+1,9,'#f5c542',3.2)+chP('M0 '+(by-4.4)+' l1.7 3.5 3.8 .5 -2.8 2.6 .7 3.8 -3.4 -1.8 -3.4 1.8 .7 -3.8 -2.8 -2.6 3.8 -.5 Z','#c8930f',0);
  return {legs:chG(100,ty,legs),front:chG(100,ty,front),back:chG(100,ty,back)}}
/* ---- le personnage complet ---- */
function charSvg(o){o=o||{};const sp0=CH_SP[o.sp]?o.sp:'homme';o=Object.assign({},CH_SP[sp0].def,o,{sp:sp0});const sp=sp0,P=CH_POSE[o.pose]||CH_POSE.idle,H=P.H||200,id='q'+(++CHN)+'_',C=chCols(o),shirt=chShirtCol(o),acc=Array.isArray(o.ac)?o.ac:[];
  const ex=o.ex||(o.pose==='sleep'?'sleep':o.pose==='icon'?(sp==='homme'?'focus':'neutral'):o.pose==='hang'?'neutral':o.pose&&o.pose.startsWith('pull')?'effort':'grin');
  const gl=acc.includes('gants')?'#26272c':'';let s='',defs='';
  if(o.bg){const a=o.bgc||o.acc||'#e4ff1a';defs+='<linearGradient id="'+id+'bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+chLt(a,.22)+'"/><stop offset="1" stop-color="'+chDk(a,.14)+'"/></linearGradient>';s+='<rect width="200" height="'+H+'" fill="url(#'+id+'bg)"/>'}
  if(P.lg==='stand'&&!o.bg)s+=chE(100,P.ty+92,42,5.4,'#000',0,' opacity=".13"');
  const hum=C.t==='human'||C.t==='ninja',B=chBody(P,C,o,shirt,acc,id);
  s+=B.back;
  /* bras (derrière le corps) */
  const sh=hum?[P.sl,P.sr]:[[P.sl[0]+7,P.sl[1]+3],[P.sr[0]-7,P.sr[1]+3]],aw=C.t==='gorilla'?13.6:C.t==='robot'?10:hum?10.8:11.2,ac=C.t==='ninja'?chDk(shirt,.05):C.arm;
  const arm=(S,E,Hh,side)=>{let a=chTube([S,E,Hh],aw,ac);
    if(P.bic&&C.t!=='robot'){const m=[(S[0]+E[0])/2,(S[1]+E[1])/2-5];a+=chC(m[0],m[1],8.4,ac,COL)+chC(m[0],m[1],8.6,ac,0)}
    if(C.t==='robot')a+=chC(E[0],E[1],6.4,chDk(C.base,.38),3);
    return a};
  s+=arm(sh[0],P.el,P.hl,-1)+arm(sh[1],P.er,P.hr,1);
  s+=B.legs;
  /* cheveux derrière */
  const hd=P.hd,hsc=o.hsc||1,hT='translate('+f2(hd[0])+' '+f2(hd[1])+')'+(P.hrot?' rotate('+P.hrot+')':'')+(hsc!==1?' scale('+hsc+')':'');
  if(C.t==='human'){const hb=chHairBack(o.hs||'court',CH_HAIRC[o.hc]||CH_HAIRC.brun);if(hb)s+='<g transform="'+hT+'">'+hb+'</g>'}
  s+=B.front;
  if(P.bar)s+='<rect x="6" y="'+f2(P.bar-6)+'" width="188" height="12" rx="6" fill="#222228"/><rect x="10" y="'+f2(P.bar-4.4)+'" width="180" height="2.8" rx="1.4" fill="#ffffff" opacity=".28"/>';
  const Hd=chHead(C,o,ex);
  s+='<g transform="'+hT+'">'+Hd.s+chHeadAcc(acc,C,Hd)+'</g>';
  const hc=C.t==='ninja'?chDk(shirt,.18):C.hand;s+=chHand(P.hl,P.tl,hc,-1,gl,C)+chHand(P.hr,P.tr,hc,1,gl,C);
  if(P.zz)s+='<g fill="none" stroke-linecap="round" stroke-linejoin="round">'+[[136,50,9],[152,32,7],[164,18,5]].map(z=>{const d='M'+z[0]+' '+z[1]+' h'+z[2]+' l'+(-z[2])+' '+(z[2]*1.15)+' h'+z[2];return chSt(d,z[2]*.42+5,CK)+chSt(d,z[2]*.42,o.zc||'#bfe6ff')}).join('')+'</g>';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 '+H+'"'+(o.cls?' class="'+o.cls+'"':'')+' aria-hidden="true">'+(defs?'<defs>'+defs+'</defs>':'')+s+'</svg>'}
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
