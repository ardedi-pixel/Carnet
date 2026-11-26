/* ===================== v6.3 : personnages « Athlète » (proportions adultes, style autocollant sobre) ===================== */
/* Ancien rig (v6.2, style enfant) gardé dans art/20_chars.v62.js. Robot et ninja retirés en v6.3. */
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
 panda:{n:'Panda',t:'panda',pal:[['#f6f4ef','Classique']],def:{c:0}}
};
const CH_ORDER=['homme','femme','chat','loup','ours','gorille','panda'];
const CH_ACC=[['bandeau','Bandeau',1],['gants','Gants',3],['medaille','Médaille',5],['couronne','Couronne',7]]; /* débloqué au niveau de skills (index LVL) */
let CHN=0;
/* ---- couleurs ---- */
function chHex(h){h=String(h||'#888').replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255]}
function chMix(a,b,t){const x=chHex(a),y=chHex(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')}
const chDk=(c,t)=>chMix(c,'#000000',t),chLt=(c,t)=>chMix(c,'#ffffff',t);
const chLum=c=>{const[r,g,b]=chHex(c);return(.299*r+.587*g+.114*b)/255};
const f2=v=>Math.round(v*10)/10;
/* ---- traits de base : contour sombre, aplats ; CHOL = épaisseur du contour en cours ---- */
const CK='#1b1b1f',COL=2.8;let CHOL=COL;
const chPt=p=>f2(p[0])+' '+f2(p[1]);
const chLn=pts=>'M'+pts.map(chPt).join(' L');
const chSt=(d,w,c,x)=>'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+f2(w)+'" stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
const chTube=(pts,w,c)=>{const d=chLn(pts);return chSt(d,w+CHOL*2,CK)+chSt(d,w,c)};
const chP=(d,fill,sw,x)=>'<path d="'+d+'" fill="'+fill+'"'+(sw===0?'':' stroke="'+CK+'" stroke-width="'+(sw||CHOL)+'" stroke-linejoin="round"')+(x||'')+'/>';
const chC=(x,y,r,fill,sw,ex)=>'<circle cx="'+f2(x)+'" cy="'+f2(y)+'" r="'+f2(r)+'" fill="'+fill+'"'+(sw===0?'':' stroke="'+CK+'" stroke-width="'+(sw||CHOL)+'"')+(ex||'')+'/>';
const chE=(x,y,rx,ry,fill,sw,ex)=>'<ellipse cx="'+f2(x)+'" cy="'+f2(y)+'" rx="'+f2(rx)+'" ry="'+f2(ry)+'" fill="'+fill+'"'+(sw===0?'':' stroke="'+CK+'" stroke-width="'+(sw||CHOL)+'"')+(ex||'')+'/>';
const chG=(x,y,inner,ex)=>'<g transform="translate('+f2(x)+' '+f2(y)+')'+(ex||'')+'">'+inner+'</g>';
/* deux passes : contour commun puis remplissage (formes fusionnées) */
const chBlob=(parts,fill)=>'<g fill="'+CK+'" stroke="'+CK+'" stroke-width="'+(CHOL*2)+'" stroke-linejoin="round">'+parts+'</g><g fill="'+fill+'">'+parts+'</g>';
/* membre en deux segments (bras, jambe) : contour commun puis remplissage, épaisseurs différentes */
const chLimb=(a,b,c,w1,w2,col)=>chSt(chLn([a,b]),w1+CHOL*2,CK)+chSt(chLn([b,c]),w2+CHOL*2,CK)+chSt(chLn([a,b]),w1,col)+chSt(chLn([b,c]),w2,col);
/* ---- palette résolue d'un personnage ---- */
function chCols(o){const sp=CH_SP[o.sp]||CH_SP.homme,t=sp.t;let base;
  if(sp.pal==='skin')base=CH_SKIN[Math.max(0,Math.min(5,o.c|0))];else base=(sp.pal[o.c|0]||sp.pal[0])[0];
  const dark=chLum(base)<.32,r={t,base,fur:base,arm:base,hand:base,fem:!!sp.fem,dark,light:chLt(base,.62),stripes:o.sp==='chat'&&((o.c|0)===0||(o.c|0)===4)};
  if(t==='cat')r.light='#fff4e6';
  if(t==='wolf')r.light=chLum(base)>.8?'#ffffff':'#f1f3f5';
  if(t==='bear'){r.light=chMix(base,'#f6e7cf',.55);r.hand=chDk(base,.12)}
  if(t==='gorilla'){r.face=chMix(base,'#b5a597',.5);r.hand=chMix(base,'#8d8178',.45)}
  if(t==='panda'){r.arm=r.hand='#26262b';r.fur='#f6f4ef'}
  return r}
/* haut : '' = tenue d'origine ; acc = couleur de l'appli ; sinon la couleur choisie */
function chDefShirt(sp){return sp==='femme'?'#cf4f7a':'#2f3647'}
function chShirtCol(o){if(o.sh==='acc')return o.acc||'#e4ff1a';if(o.sh&&CH_SHIRT[o.sh])return CH_SHIRT[o.sh];return chDefShirt(o.sp)}
/* ---- poses (repère 200 x 200 ; tractions, dips, pompes, squat : 200 x 260). ty = ligne des épaules ; el, ha = coudes, mains ---- */
const CH_POSE={
 icon:{hd:[100,38],ty:72,el:[[52,88],[148,88]],ha:[[71,60],[129,60]],tl:'grip',tr:'grip',lg:'hang',bar:60,vb:[30,8,140,140]},
 hang:{hd:[100,44],ty:78,el:[[72,54],[128,54]],ha:[[74,30],[126,30]],tl:'grip',tr:'grip',lg:'hang',bar:30},
 idle:{hd:[100,39],ty:73,el:[[64,101],[136,101]],ha:[[66,126],[134,126]],tl:'fist',tr:'fist',lg:'stand'},
 cheer:{hd:[100,39],ty:73,el:[[56,56],[144,56]],ha:[[50,33],[150,33]],tl:'fist',tr:'fist',lg:'stand'},
 flex:{hd:[100,39],ty:73,el:[[46,76],[154,76]],ha:[[54,53],[146,53]],tl:'fist',tr:'fist',lg:'stand',bic:1},
 thumbs:{hd:[99,39],ty:73,el:[[64,101],[146,95]],ha:[[66,126],[150,76]],tl:'fist',tr:'thumb',lg:'stand'},
 wave:{hd:[99,39],ty:73,el:[[64,101],[147,73]],ha:[[66,126],[156,51]],tl:'fist',tr:'open',lg:'stand'},
 sleep:{hd:[101,41],hrot:10,ty:73,el:[[65,101],[135,101]],ha:[[68,126],[132,126]],tl:'fist',tr:'fist',lg:'stand',zz:1},
 pullA:{hd:[100,71],ty:105,el:[[71,83],[129,83]],ha:[[71,60],[129,60]],tl:'grip',tr:'grip',lg:'hang',bar:60,H:260},
 pullB:{hd:[100,38],ty:72,el:[[52,88],[148,88]],ha:[[71,60],[129,60]],tl:'grip',tr:'grip',lg:'hang',bar:60,H:260},
 dipA:{hd:[100,69],ty:103,el:[[66,127],[134,127]],ha:[[63,150],[137,150]],tl:'grip',tr:'grip',lg:'hang',dip:150,H:260},
 dipB:{hd:[100,97],ty:131,el:[[46,124],[154,124]],ha:[[63,150],[137,150]],tl:'grip',tr:'grip',lg:'hang',dip:150,H:260},
 pushA:{hd:[100,147],ty:181,el:[[64,204],[136,204]],ha:[[56,226],[144,226]],tl:'grip',tr:'grip',lg:'push',H:260},
 pushB:{hd:[100,173],ty:207,el:[[42,200],[158,200]],ha:[[56,226],[144,226]],tl:'grip',tr:'grip',lg:'push',H:260},
 sqA:{hd:[100,88],ty:122,el:[[64,149],[136,149]],ha:[[66,174],[134,174]],tl:'fist',tr:'fist',lg:'sq',sq:0,gy:241,H:260},
 sqB:{hd:[100,106],ty:140,el:[[62,152],[138,152]],ha:[[86,150],[114,150]],tl:'fist',tr:'fist',lg:'sq',sq:18,gy:241,H:260}
};
/* cadrage de l'icône (buste à la barre), aussi utilisé pour l'écran de démarrage animé */
const CH_VBI=[30,8,140,140];
/* paires de poses animées par exercice, durée d'un aller-retour (s) */
const CH_ANIM={pull:['pullA','pullB',1.5],dip:['dipA','dipB',1.3],push:['pushA','pushB',1.2],sq:['sqA','sqB',1.3],cheer:['idle','cheer',1.1]};
/* ---- mains (taille adulte) ---- */
function chHand(P,type,col,side,gl,C){const c=gl||col,x=P[0],y=P[1],ln=gl?'#5b5d66':chDk(col,.4),paw=!gl&&C.t!=='human'&&C.t!=='gorilla';let o='';
  if(type==='thumb'){const tx=side>0?-3.2:3.2;o+=chP('M'+(tx-2.4)+' -2 L'+(tx-2.4)+' -10 Q'+(tx-2.4)+' -13 '+tx+' -13 Q'+(tx+2.4)+' -13 '+(tx+2.4)+' -10 L'+(tx+2.4)+' -2 Z',c)}
  if(type==='open'){const F=[[-3.6,-2,-5.4,-10],[-1.2,-3,-1.6,-11.6],[1.4,-3,2,-11.6],[3.8,-2,5.6,-9.6],[4.8,1.6,9.4,-1.4]];
    o+=F.map(f=>chSt('M'+f[0]+' '+f[1]+' L'+f[2]+' '+f[3],3.4+CHOL*2,CK)).join('')+chC(0,0,5.6,CK,CHOL*2)+F.map(f=>chSt('M'+f[0]+' '+f[1]+' L'+f[2]+' '+f[3],3.4,c)).join('')+chC(0,0,5.6,c,0);
    return chG(x,y,o)}
  o+=chC(0,0,type==='grip'?6.6:6.4,c);
  if(paw)o+=chSt('M-2.2 2.6 V4.8',1.4,CK)+chSt('M2.2 2.6 V4.8',1.4,CK);
  else if(type==='grip')o+=chSt('M-3.2 -1.4 Q0 -3 3.2 -1.4',1.3,ln)+chSt('M-3.2 1.6 Q0 0 3.2 1.6',1.3,ln);
  else o+=chSt('M-2.6 -1.8 Q0 -3 2.6 -1.8',1.2,chDk(col,.22));
  if(gl)o+=chP('M-5.6 3.2 Q0 6.4 5.6 3.2 L5.2 5.8 Q0 8.6 -5.2 5.8 Z',chLt(gl,.25),1.6);
  return chG(x,y,o)}
/* ---- visage adulte (repère tête, ovale rx 15.6 x ry 18.6) ---- */
function chFace(ex,fem,hc,sk){let s='';const bc=chDk(hc,.15),lip=fem?'#a8505a':CK;
  if(ex==='effort'||ex==='focus')s+=chSt('M-10 -5 L-3.6 -2.8',2.4,bc)+chSt('M10 -5 L3.6 -2.8',2.4,bc);
  else if(ex==='wow')s+=chSt('M-9.8 -6.8 Q-6.6 -8.6 -3.4 -7',2.2,bc)+chSt('M9.8 -6.8 Q6.6 -8.6 3.4 -7',2.2,bc);
  else s+=chSt('M-9.6 -4.2 L-3.6 -4.8',2.2,bc)+chSt('M9.6 -4.2 L3.6 -4.8',2.2,bc);
  if(ex==='happy')s+=chSt('M-8.6 1.8 Q-6.2 -.6 -3.8 1.8',1.9,CK)+chSt('M8.6 1.8 Q6.2 -.6 3.8 1.8',1.9,CK);
  else if(ex==='sleep')s+=chSt('M-8.6 .8 Q-6.2 2.8 -3.8 .8',1.9,CK)+chSt('M8.6 .8 Q6.2 2.8 3.8 .8',1.9,CK);
  else if(ex==='effort')s+=chSt('M-8.6 .8 L-4 1.6',2,CK)+chSt('M8.6 .8 L4 1.6',2,CK);
  else{const r=ex==='wow'?2.3:1.9;s+=chC(-6.2,1.2,r,CK,0)+chC(6.2,1.2,r,CK,0)}
  if(fem&&ex!=='sleep'&&ex!=='happy')s+=chSt('M-8.4 -.2 L-9.8 -1.6',1.4,CK)+chSt('M8.4 -.2 L9.8 -1.6',1.4,CK);
  s+=chSt('M.4 2.8 L-.8 7.6 L1.6 7.8',1.5,chDk(sk,.35));
  if(ex==='grin')s+=chP('M-5.6 9.8 Q0 16 5.6 9.8 Q0 11.6 -5.6 9.8 Z','#ffffff',1.6);
  else if(ex==='happy')s+=chSt('M-4.6 10.4 Q0 14 4.6 10.4',2,lip);
  else if(ex==='effort')s+='<rect x="-5" y="9.4" width="10" height="4.4" rx="1.6" fill="#ffffff" stroke="'+CK+'" stroke-width="1.6"/>'+chSt('M-4 11.6 H4',1,CK);
  else if(ex==='wow')s+=chE(0,11.6,2.4,2.8,'#5a2a30',1.6);
  else if(ex==='sleep')s+=chSt('M-3 11.4 Q0 12.4 3 11.4',1.8,lip);
  else if(ex==='focus')s+=chSt('M-3.8 11.4 L3.8 11.4',1.9,lip);
  else s+=chSt('M-4 11 Q0 12.8 4 11',1.9,lip);
  return s}
/* ---- cheveux adultes (repère tête) ; renvoie aussi le haut de la coiffure ---- */
const CH_HTOP={court:-21,degrade:-23.5,boucle:-24,rase:-19.6,queue:-21,chignon:-27,long:-21,carre:-21};
function chHairBack(hs,col){const dk=chDk(col,.12);
  if(hs==='queue')return chP('M8 -14 C22 -14 25 2 20 16 C18 22 14 26 10 28 C14 14 14 2 6 -6 Z',dk)+chC(9,-15,2.6,'#cf4f7a',1.6);
  if(hs==='long')return chP('M-16.6 -4 C-19 12 -18 26 -14 34 Q0 37 14 34 C18 26 19 12 16.6 -4 Z',dk);
  if(hs==='carre')return chP('M-16.8 -2 C-18 8 -17 16 -14 20 Q0 23 14 20 C17 16 18 8 16.8 -2 Z',dk);
  if(hs==='chignon')return chC(0,-21,6.4,col)+chSt('M-3 -23 Q0 -25 3 -23',1.4,chDk(col,.3));
  return ''}
function chHairFront(hs,col,skin){
  if(hs==='rase')return chP('M-15.6 -3 C-16 -15 -9 -19.6 0 -19.6 C9 -19.6 16 -15 15.6 -3 C13 -9.6 8 -11.4 0 -11.4 C-8 -11.4 -13 -9.6 -15.6 -3 Z',chMix(skin,col,.62),2);
  if(hs==='degrade')return chP('M-15.6 -6 C-16 -2 -15.8 1 -15.2 3 L-13.6 3 C-13.8 0 -13.8 -3 -13.2 -6 Z',chMix(skin,col,.45),0)+chP('M15.6 -6 C16 -2 15.8 1 15.2 3 L13.6 3 C13.8 0 13.8 -3 13.2 -6 Z',chMix(skin,col,.45),0)+chP('M-14.6 -6 C-15.6 -17 -9 -23.5 1 -23.5 C10 -23.5 16 -17 14.6 -6 C12 -11 8 -13 2 -13 C-4 -13 -10 -11.6 -14.6 -6 Z',col);
  if(hs==='boucle'){const pts=[[-13,-7],[-11,-14],[-5,-18.6],[2,-19.4],[8.6,-17],[12.6,-11.4],[14,-5],[-4,-13],[5,-13.4]];return chBlob(pts.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(p[1]<-12?5.4:4.6)+'"/>').join(''),col)+pts.slice(0,7).map(p=>chSt('M'+(p[0]-2)+' '+(p[1]-.6)+' q2 -2 4 0',1.1,chLt(col,.25))).join('')}
  if(hs==='queue'||hs==='chignon')return chP('M-16 -1 C-17 -16 -9 -21 0 -21 C10 -21 17 -15 16 -1 C13 -8 8 -12 3 -13 C-2 -10 -9 -7 -16 -1 Z',col);
  if(hs==='long'||hs==='carre')return chP('M-16.4 6 C-17.6 -14 -9 -21 0 -21 C9 -21 17.6 -14 16.4 6 C14.4 0 13.4 -5 11.4 -8 C6 -5.6 0 -7 -4 -11.6 C-7 -6.6 -12 -4.6 -15 -4.4 C-15.8 -1 -16.2 2 -16.4 6 Z',col);
  return chP('M-15.6 -3 C-16.5 -15 -9 -21 0 -21 C9 -21 16.5 -15 15.6 -3 C14 -9 11 -12 7 -12.6 C2 -11.6 -6 -11.6 -10 -10.6 C-13 -9 -14.6 -7 -15.6 -3 Z',col)}
function chHeadHuman(C,o,ex){const hs=o.hs||'court',hc=CH_HAIRC[o.hc]||CH_HAIRC.brun,b=C.base;
  let s=chE(-15.6,1,3.4,4.4,b)+chE(15.6,1,3.4,4.4,b)+chE(0,0,15.6,18.6,b)+chHairFront(hs,hc,b)+chFace(ex,C.fem,hc,b);
  if(C.fem)s+=chC(-15.8,5.6,1.5,'#d9b44a',1.2)+chC(15.8,5.6,1.5,'#d9b44a',1.2);
  return {s,top:CH_HTOP[hs]||-21,eye:[6.2,1.2]}}
/* ---- têtes d'animaux : celles d'origine, sans joues roses ni goutte, yeux plus petits, puis réduites (x 0,6) ---- */
const AN_SC=.6;
function chAnimalEyes(ex,C,x,y,rx,ry,iris){let s='';rx*=.78;ry*=.78;[-1,1].forEach(d=>{const X=d*x;
  if(ex==='happy')s+=chSt('M'+(X-5.6)+' '+(y+3)+' Q'+X+' '+(y-4.6)+' '+(X+5.6)+' '+(y+3),3.2,CK);
  else if(ex==='sleep')s+=chSt('M'+(X-5.6)+' '+y+' Q'+X+' '+(y+5.4)+' '+(X+5.6)+' '+y,3,CK);
  else{const k=ex==='wow'?1.15:1;if(iris){s+=chE(X,y,rx*k,ry*k,iris,2.4)+chE(X,y,rx*.36,ry*.82,CK,0)}else s+=chE(X,y,rx*k,ry*k,CK,0);s+=chC(X+rx*.3,y-ry*.34,rx*.3,'#fff',0)}});return s}
function chHeadAnimal(C,o,ex){const t=C.t,b=C.base,eff=ex==='effort'||ex==='focus',smile=ex==='happy'||ex==='wow';let s='',top=-34,band=[-13,30.4],eye=[12,0];
  if(t==='cat'){const L=C.light,st=chDk(b,.2);
    s+=chP('M-29.2 -15.2 L-32.4 -42.8 L-7.6 -26.4 Z',b)+chP('M-25.2 -22 L-26.8 -34.4 L-14.4 -26 Z','#ffb1c4',0)+chP('M29.2 -15.2 L32.4 -42.8 L7.6 -26.4 Z',b)+chP('M25.2 -22 L26.8 -34.4 L14.4 -26 Z','#ffb1c4',0);
    s+=chE(0,0,34,28.4,b)+chE(0,11.6,15.6,10.8,L,0);
    if(C.stripes)s+=chSt('M0 -25.6 V-17.2',3.2,st)+chSt('M-8.8 -24 L-6.8 -16.8',3.2,st)+chSt('M8.8 -24 L6.8 -16.8',3.2,st);
    if(eff)s+=chSt('M-21 -10.4 L-9 -7.2',3.4,CK)+chSt('M21 -10.4 L9 -7.2',3.4,CK);
    s+=chAnimalEyes(ex,C,14,-.8,6.6,7.8,C.dark?'#d7e05a':'');
    s+=chP('M-3.4 7.2 H3.4 L0 11.2 Z','#ff86a2',2);
    s+=smile?chP('M-6.6 13.4 Q0 23 6.6 13.4 Z','#7a2330',2.6):chSt('M-6.4 13.2 Q-3.2 17.2 0 13.6 Q3.2 17.2 6.4 13.2',2.8,CK);
    s+=chSt('M-18.8 9.6 L-36.8 6.8',2,CK)+chSt('M-18.8 13.6 L-36.4 15.2',2,CK)+chSt('M18.8 9.6 L36.8 6.8',2,CK)+chSt('M18.8 13.6 L36.4 15.2',2,CK);
    top=-36;band=[-15,32];eye=[14,-.8]}
  else if(t==='wolf'){const L=C.light,dk=chDk(b,.28);
    s+=chP('M-30 -11.2 L-37.2 -44.8 L-7.6 -24.8 Z',b)+chP('M-26.4 -18.4 L-30.8 -35.2 L-14.8 -24 Z',dk,0)+chP('M30 -11.2 L37.2 -44.8 L7.6 -24.8 Z',b)+chP('M26.4 -18.4 L30.8 -35.2 L14.8 -24 Z',dk,0);
    s+=chP('M-33.6 -0.4 C-33.6 -19.6 -18 -29.6 0 -29.6 C18 -29.6 33.6 -19.6 33.6 -0.4 L39.2 6 L33.2 9.2 L37.2 16.4 L29.2 18.4 C22 28 12 32.4 0 32.4 C-12 32.4 -22 28 -29.2 18.4 L-37.2 16.4 L-33.2 9.2 L-39.2 6 Z',b);
    s+=chP('M-23.2 -12.8 C-15.2 -24.8 15.2 -24.8 23.2 -12.8 C15.6 -14.8 8 -11.6 0 -4.8 C-8 -11.6 -15.6 -14.8 -23.2 -12.8 Z',dk,0);
    s+=chP('M-18 11.2 C-16 23.2 -8.8 30 0 30.4 C8.8 30 16 23.2 18 11.2 C12 16 6 17.2 0 17.2 C-6 17.2 -12 16 -18 11.2 Z',L,0);
    s+=eff||ex==='neutral'?chSt('M-21.2 -6.8 L-7.2 -2.8',4,CK)+chSt('M21.2 -6.8 L7.2 -2.8',4,CK):chSt('M-20 -5.4 Q-14 -8 -8 -5.4',3.4,CK)+chSt('M20 -5.4 Q14 -8 8 -5.4',3.4,CK);
    s+=chAnimalEyes(ex,C,13.2,2.4,5.4,6.2,C.dark?'#f2b544':'');
    s+=chP('M-6.8 9.2 Q0 6 6.8 9.2 Q3.6 16 0 16.4 Q-3.6 16 -6.8 9.2 Z',CK,0);
    s+=smile?chP('M-7.4 18.6 Q0 28 7.4 18.6 Q0 21.6 -7.4 18.6 Z','#7a2330',2.4):chSt('M0 16.4 V20 M-7.2 20.8 Q-3.2 24.4 0 20 Q3.2 24.4 7.2 20.8',2.6,CK);
    top=-40;band=[-13,33.6];eye=[13.2,2.4]}
  else if(t==='bear'){const L=C.light;
    s+=chC(-24,-21,10.4,b)+chC(-24,-21,5.4,L,0)+chC(24,-21,10.4,b)+chC(24,-21,5.4,L,0);
    s+=chE(0,0,32,29,b)+chE(0,11,15.4,11.6,L,0);
    if(eff)s+=chSt('M-19 -9.6 L-7.6 -6.4',3.6,CK)+chSt('M19 -9.6 L7.6 -6.4',3.6,CK);
    s+=chAnimalEyes(ex,C,12.4,-1.6,4,4.6,C.dark?'#e9b36a':'');
    s+=chP('M-6.4 3.2 Q0 0 6.4 3.2 Q3.2 9.4 0 9.6 Q-3.2 9.4 -6.4 3.2 Z',CK,0);
    s+=smile?chP('M-6.6 12.6 Q0 22 6.6 12.6 Q0 15 -6.6 12.6 Z','#7a2330',2.4):chSt('M0 9.6 V13 M-5.6 14 Q-2.8 17.2 0 13.6 Q2.8 17.2 5.6 14',2.6,CK);
    top=-33;band=[-14,31];eye=[12.4,-1.6]}
  else if(t==='gorilla'){const F=C.face;
    s+=chC(-29.6,3,6.4,F)+chC(29.6,3,6.4,F)+chP('M0 -31 C18 -31 31 -20 31 -2 C31 18 18 30 0 30 C-18 30 -31 18 -31 -2 C-31 -20 -18 -31 0 -31 Z',b);
    s+=chP('M0 -12 C10 -21 26 -16 24.4 -2 C29.6 7 23 24.4 0 25.4 C-23 24.4 -29.6 7 -24.4 -2 C-26 -16 -10 -21 0 -12 Z',F,3);
    s+=chSt('M-21 -7 Q-11 -14.6 -1.4 -8.4',4.6,CK)+chSt('M21 -7 Q11 -14.6 1.4 -8.4',4.6,CK);
    s+=ex==='happy'||ex==='sleep'?[-1,1].map(d=>chSt(ex==='sleep'?'M'+(d*9.6-4.6)+' -2 Q'+(d*9.6)+' 2.6 '+(d*9.6+4.6)+' -2':'M'+(d*9.6-4.6)+' 0 Q'+(d*9.6)+' -5.6 '+(d*9.6+4.6)+' 0',3,CK)).join(''):chC(-9.6,-1,2.9,CK,0)+chC(9.6,-1,2.9,CK,0)+chC(-8.6,-2.2,.9,'#fff',0)+chC(10.6,-2.2,.9,'#fff',0);
    s+=chE(-3.8,8,2.6,1.9,CK,0)+chE(3.8,8,2.6,1.9,CK,0);
    s+=smile?chP('M-9 14.6 Q0 24 9 14.6 Q0 17.4 -9 14.6 Z','#5a1d24',2.6):ex==='effort'?'<rect x="-9" y="13.4" width="18" height="7.4" rx="2.8" fill="#fff" stroke="'+CK+'" stroke-width="3"/>'+chSt('M-8 17 H8',1.5,CK):chSt('M-8 15.6 Q0 19.6 8 15.6',3,CK);
    top=-31;band=[-15,31];eye=[9.6,-1]}
  else{ /* panda */
    s+=chC(-24.6,-22,10.6,'#26262b')+chC(24.6,-22,10.6,'#26262b')+chE(0,0,33,29,b);
    s+=chE(-12.6,1.4,8,10.6,'#26262b',0,' transform="rotate(26 -12.6 1.4)"')+chE(12.6,1.4,8,10.6,'#26262b',0,' transform="rotate(-26 12.6 1.4)"');
    if(ex==='happy'||ex==='sleep')s+=[-1,1].map(d=>chSt(ex==='sleep'?'M'+(d*12.4-4.4)+' 1 Q'+(d*12.4)+' 5.4 '+(d*12.4+4.4)+' 1':'M'+(d*12.4-4.4)+' 3 Q'+(d*12.4)+' -2.6 '+(d*12.4+4.4)+' 3',2.6,'#fff')).join('');
    else s+=chC(-12,1.4,3.2,'#fff',0)+chC(12,1.4,3.2,'#fff',0)+chC(-11.5,1.8,1.9,CK,0)+chC(12.5,1.8,1.9,CK,0);
    if(eff)s+=chSt('M-20 -11 L-9.6 -8',3.4,CK)+chSt('M20 -11 L9.6 -8',3.4,CK);
    s+=chP('M-5.2 7.6 Q0 5 5.2 7.6 Q2.6 12.4 0 12.6 Q-2.6 12.4 -5.2 7.6 Z',CK,0);
    s+=smile?chP('M-6.6 15.4 Q0 24 6.6 15.4 Q0 17.6 -6.6 15.4 Z','#7a2330',2.4):chSt('M0 12.6 V15.6 M-5.4 16.4 Q-2.7 19.4 0 15.8 Q2.7 19.4 5.4 16.4',2.6,CK);
    top=-33;band=[-14,32];eye=[12.3,1.4]}
  return {s,top,band,eye}}
/* ---- accessoires de tête ---- */
function chHeadAccHuman(acc,H){let s='';
  if(acc.includes('bandeau')){const c='#e53935';s+=chP('M-16.4 -9 Q0 -14 16.4 -9 L16.6 -4.6 Q0 -9.6 -16.6 -4.6 Z',c,2)+chTube([[15.6,-7],[22.6,-4.4],[25,.6]],2.6,c)+chTube([[15.6,-7],[23,-9.6],[27,-7.4]],2.6,c)+chC(15.6,-7,2.6,chDk(c,.15),1.6)}
  if(acc.includes('couronne')){const y=H.top+2;s+='<g transform="rotate(-8 0 '+y+')">'+chP('M-9 '+y+' L-10.4 '+(y-9.6)+' L-4.8 '+(y-4.8)+' L0 '+(y-12)+' L4.8 '+(y-4.8)+' L10.4 '+(y-9.6)+' L9 '+y+' Z','#f5c542',2)+chC(0,y-12,1.7,'#ff4d6d',1.2)+chC(-10.4,y-9.6,1.4,'#4dd2ff',1.2)+chC(10.4,y-9.6,1.4,'#4dd2ff',1.2)+'</g>'}
  return s}
function chHeadAccAnimal(acc,H){let s='';
  if(acc.includes('bandeau')&&H.band){const y=H.band[0],w=H.band[1],c='#e53935';s+=chP('M'+(-w)+' '+y+' Q0 '+(y-11)+' '+w+' '+y+' L'+(w+.4)+' '+(y+7.4)+' Q0 '+(y-3.4)+' '+(-w-.4)+' '+(y+7.4)+' Z',c,3.2)+chTube([[w-1,y+3],[w+12,y+8],[w+16,y+16]],4.4,c)+chTube([[w-1,y+3],[w+13,y-1],[w+20,y+3]],4.4,c)+chC(w-1,y+3,4.4,chDk(c,.15),2.6)}
  if(acc.includes('couronne')){const y=H.top+4;s+='<g transform="rotate(-9 0 '+y+')">'+chP('M-15 '+y+' L-17.4 '+(y-16)+' L-8 '+(y-8)+' L0 '+(y-20)+' L8 '+(y-8)+' L17.4 '+(y-16)+' L15 '+y+' Z','#f5c542',3.2)+chC(0,y-20,2.8,'#ff4d6d',2)+chC(-17.4,y-16,2.4,'#4dd2ff',2)+chC(17.4,y-16,2.4,'#4dd2ff',2)+chSt('M-13 '+(y-3.6)+' H13',2.2,'#c8930f')+'</g>'}
  return s}
/* ---- tenue de saison (D1) : bonnet et écharpe en hiver, lunettes de soleil en été ---- */
const CH_WOOL='#e2483d',CH_WOOLL='#f7f3ee';
function chBeanieHuman(H,acc){const top=Math.max(Math.min(H.top-4,-25),-29),c=CH_WOOL,cd=chDk(c,.2);
  let s=chP('M-15.4 -10 C-15.8 '+f2(top+8)+' -9 '+f2(top)+' 0 '+f2(top)+' C9 '+f2(top)+' 15.8 '+f2(top+8)+' 15.4 -10 Z',c,2.4);
  s+=chSt('M-7.6 -12 Q-7.4 '+f2(top+6)+' -3 '+f2(top+2)+'',1.4,cd)+chSt('M7.6 -12 Q7.4 '+f2(top+6)+' 3 '+f2(top+2),1.4,cd)+chSt('M0 -12 V'+f2(top+2),1.4,cd);
  s+='<rect x="-17" y="-13.6" width="34" height="7.6" rx="3.8" fill="'+CH_WOOLL+'" stroke="'+CK+'" stroke-width="2.4"/>'+[-.6,-.3,0,.3,.6].map(k=>chSt('M'+f2(17*k)+' -11.6 V-8',1.1,'#d9d2c7')).join('');
  if(!acc.includes('couronne'))s+=chC(0,top-2.6,4.2,CH_WOOLL,2.4);
  return {s,top}}
function chBeanieAnimal(C,H,acc){const t=C.t,b=H.band||[-13,30.4],y=t==='gorilla'?-21:b[0]-1,w=b[1]+1.5,top=Math.max(Math.min(H.top-3,-38),-44),c=CH_WOOL,cd=chDk(c,.2);
  let s=chP('M'+f2(-w+2)+' '+f2(y)+' C'+f2(-w+1)+' '+f2(top+9)+' '+f2(-w*.55)+' '+f2(top)+' 0 '+f2(top)+' C'+f2(w*.55)+' '+f2(top)+' '+f2(w-1)+' '+f2(top+9)+' '+f2(w-2)+' '+f2(y)+' Z',c);
  s+=chSt('M'+f2(-w*.5)+' '+f2(y-3)+' Q'+f2(-w*.47)+' '+f2(top+11)+' '+f2(-w*.2)+' '+f2(top+3.5),2,cd)+chSt('M'+f2(w*.5)+' '+f2(y-3)+' Q'+f2(w*.47)+' '+f2(top+11)+' '+f2(w*.2)+' '+f2(top+3.5),2,cd)+chSt('M0 '+f2(y-3)+' V'+f2(top+3),2,cd);
  s+='<rect x="'+f2(-w)+'" y="'+f2(y-5)+'" width="'+f2(w*2)+'" height="11" rx="5.5" fill="'+CH_WOOLL+'" stroke="'+CK+'" stroke-width="'+CHOL+'"/>'+[-.6,-.3,0,.3,.6].map(k=>chSt('M'+f2(w*k)+' '+f2(y-2.4)+' V'+f2(y+3.4),1.6,'#d9d2c7')).join('');
  if(!acc.includes('couronne'))s+=chC(0,top-3.5,6.5,CH_WOOLL);
  if(t==='bear'){const L=C.light;s+=chC(-24,-21,10.4,C.base)+chC(-24,-21,5.4,L,0)+chC(24,-21,10.4,C.base)+chC(24,-21,5.4,L,0)}
  if(t==='panda')s+=chC(-24.6,-22,10.6,'#26262b')+chC(24.6,-22,10.6,'#26262b');
  return {s,top}}
function chShades(e,big){const x=e[0],y=e[1],rx=big?Math.max(6.6,x*.74):5,ry=rx*.74,sw=big?3:2;
  let s=chSt('M'+f2(-x+rx*.55)+' '+f2(y-ry*.45)+' Q0 '+f2(y-ry*.95)+' '+f2(x-rx*.55)+' '+f2(y-ry*.45),sw,CK);
  [-1,1].forEach(d=>{s+=chE(d*x,y,rx,ry,'#2a2d38',sw)+chSt('M'+f2(d*x-rx*.48)+' '+f2(y-ry*.12)+' L'+f2(d*x-rx*.08)+' '+f2(y-ry*.58),big?2.2:1.4,'#ffffff',' opacity=".75"')});
  return s+chSt('M'+f2(-x-rx)+' '+f2(y-.6)+' L'+f2(-x-rx-(big?6:4))+' '+f2(y-2),sw,CK)+chSt('M'+f2(x+rx)+' '+f2(y-.6)+' L'+f2(x+rx+(big?6:4))+' '+f2(y-2),sw,CK)}
function chScarf(P){const y=P.ty-6,c=CH_WOOL,cl=CH_WOOLL;
  return '<rect x="86" y="'+f2(y-4.6)+'" width="28" height="9.6" rx="4.8" fill="'+c+'" stroke="'+CK+'" stroke-width="'+COL+'"/>'+chSt('M93 '+f2(y-2.6)+' V'+f2(y+2.6),2.2,cl)+chSt('M107 '+f2(y-2.6)+' V'+f2(y+2.6),2.2,cl)
   +chP('M104 '+f2(y+2)+' L111 '+f2(y+2)+' L112.4 '+f2(y+19)+' L105.4 '+f2(y+19.6)+' Z',c,2.4)+chSt('M106 '+f2(y+8.6)+' L111.6 '+f2(y+8.3),1.8,cl)+chSt('M106.4 '+f2(y+14)+' L112 '+f2(y+13.6),1.8,cl)+chSt('M106.6 '+f2(y+20.6)+' v2.6 M109 '+f2(y+20.4)+' v2.6 M111.4 '+f2(y+20.2)+' v2.6',1.4,CK)}
/* ---- queue (animaux), derrière le corps ---- */
function chTail(C,P){if(P.lg==='push')return '';const t=C.t,b=C.base,y=P.ty+52;
  if(t==='cat'){const d='M112 '+f2(y)+' C130 '+f2(y+4)+' 140 '+f2(y-10)+' 136 '+f2(y-28)+' C135 '+f2(y-34)+' 131 '+f2(y-37)+' 127 '+f2(y-36);let s=chSt(d,7.4+CHOL*2,CK)+chSt(d,7.4,b);if(C.stripes)s+=chSt('M133 '+f2(y-6)+' L137 '+f2(y-9),2,chDk(b,.2))+chSt('M138 '+f2(y-20)+' L134 '+f2(y-22),2,chDk(b,.2));return s}
  if(t==='wolf')return chP('M110 '+f2(y+2)+' C126 '+f2(y+10)+' 144 '+f2(y+2)+' 142 '+f2(y-18)+' C141 '+f2(y-24)+' 137 '+f2(y-28)+' 132 '+f2(y-27)+' C134 '+f2(y-20)+' 133 '+f2(y-12)+' 127 '+f2(y-8)+' C122 '+f2(y-5)+' 116 '+f2(y-4)+' 110 '+f2(y-6)+' Z',b)+chP('M141.8 '+f2(y-19)+' C141 '+f2(y-24)+' 137.6 '+f2(y-27.6)+' 133.6 '+f2(y-26.8)+' C135 '+f2(y-23)+' 135 '+f2(y-19.6)+' 134.2 '+f2(y-16.8)+' C137 '+f2(y-16.6)+' 140 '+f2(y-17.6)+' 141.8 '+f2(y-19)+' Z',C.light,0);
  return ''}
/* ---- jambes, chaussures, short ou legging, torse ---- */
function chShoe(ax,ay,d){const o=d>0?1:-1;return chP('M'+f2(ax-9.6*o)+' '+f2(ay+5.6)+' Q'+f2(ax-9.6*o)+' '+f2(ay-1.6)+' '+f2(ax-3*o)+' '+f2(ay-1.6)+' L'+f2(ax+4*o)+' '+f2(ay-1.6)+' Q'+f2(ax+10.4*o)+' '+f2(ay-.6)+' '+f2(ax+10.4*o)+' '+f2(ay+3.4)+' L'+f2(ax+10.4*o)+' '+f2(ay+6.2)+' L'+f2(ax-9.6*o)+' '+f2(ay+6.2)+' Z','#e9eaee')+chSt('M'+f2(ax-8*o)+' '+f2(ay+3.6)+' H'+f2(ax+8.6*o),1.4,'#9aa0aa')}
function chLegs(P,C,o,M){if(P.lg==='push')return '';const hum=C.t==='human',fem=C.fem,ty=P.ty,lc=fem?'#2b2a3d':hum?C.base:C.arm,sq=P.lg==='sq'?P.sq||0:0;let s='';
  const L=[-1,1].map(d=>P.lg==='hang'?[[d*10,58],[d*10.5,85],[d*9,109]]:P.lg==='sq'?[[d*11,58],[d*(12+sq*.95),58+(53-sq)*.55],[d*(11.5+sq*.35),111-sq]]:[[d*11,58],[d*12,86],[d*11.5,111]]);
  L.forEach((l,i)=>{s+=chLimb(l[0],l[1],l[2],14.5+M,11.5+M*.6,lc)});
  L.forEach((l,i)=>{s+=chShoe(l[2][0],l[2][1],i?1:-1)});
  return chG(100,ty,s)}
function chTorso(P,C,o,shirt,W,M,acc){const hum=C.t==='human',fem=C.fem,ty=P.ty,sk=C.base,bot=fem?'#2b2a3d':'#1f2130',psh=P.lg==='push',acol=o.acc||'#e4ff1a';let s='';
  const nl=chLum(shirt)>.6?chDk(shirt,.25):chLt(shirt,.18);
  if(!psh){if(fem)s+=chP('M-18.6 22 L18.6 22 L19.6 38 L-19.6 38 Z',hum?sk:C.fur)+chP('M-20 34 L20 34 L21 48 L-21 48 Z',bot);
    else s+=chP('M-21 40 L21 40 L23 68 L3 68 L0 57 L-3 68 L-23 68 Z',bot)+chSt('M-21.6 44 L-22.6 64',1.6,acol)+chSt('M21.6 44 L22.6 64',1.6,acol)}
  const yb=psh?22:fem?27:44,wb=psh?23:fem?18:21;
  s+=chP('M'+f2(-W)+' 3 Q'+f2(-W-2)+' -1 '+f2(-W+5)+' -3 Q0 -8 '+f2(W-5)+' -3 Q'+f2(W+2)+' -1 '+f2(W)+' 3 L'+wb+' '+yb+' Q0 '+(yb+3)+' '+(-wb)+' '+yb+' Z',shirt);
  s+=chSt('M-8 -4 Q0 4 8 -4',2,nl);
  if(M>1)s+=chSt('M'+f2(-W*.62)+' 12 Q'+f2(-W*.3)+' 17 -1.4 13.4 M'+f2(W*.62)+' 12 Q'+f2(W*.3)+' 17 1.4 13.4',1.8,chLum(shirt)>.6?chDk(shirt,.2):chLt(shirt,.14));
  if(acc.includes('medaille')&&!psh)s+=chSt('M-6.4 -3 L-1.6 15 M6.4 -3 L1.6 15',3.4,'#3d7be0')+chC(0,20,5.6,'#f5c542',2)+chP('M0 16.6 l1.1 2.2 2.4 .3 -1.8 1.7 .5 2.4 -2.2 -1.2 -2.2 1.2 .5 -2.4 -1.8 -1.7 2.4 -.3 Z','#c8930f',0);
  return chG(100,ty,s)}
/* ---- le personnage complet ---- */
function charSvg(o){o=o||{};const sp0=CH_SP[o.sp]?o.sp:'homme';o=Object.assign({},CH_SP[sp0].def,o,{sp:sp0});const sp=sp0,P=CH_POSE[o.pose]||CH_POSE.idle,H=P.H||200,id='q'+(++CHN)+'_',C=chCols(o),shirt=chShirtCol(o),acc=Array.isArray(o.ac)?o.ac:[],hum=C.t==='human';
  const ic=o.pose==='icon',M=ic?0:Math.max(0,Math.min(2,o.mus|0)),SEA=ic?'':o.sea==='hiver'||o.sea==='ete'?o.sea:'';CHOL=COL;
  const ex=o.ex||(o.pose==='sleep'?'sleep':ic?(sp==='homme'?'focus':'neutral'):o.pose==='hang'?'neutral':/^(pull|dip|push|sq)/.test(o.pose||'')?'effort':'grin');
  const gl=acc.includes('gants')?'#26272c':'',W=(C.fem?23:C.t==='gorilla'?33:30)+M*(C.fem?2:2.5);let s='',defs='';
  if(o.bg){const a=o.bgc||o.acc||'#e4ff1a';defs+='<linearGradient id="'+id+'bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+chLt(a,.22)+'"/><stop offset="1" stop-color="'+chDk(a,.14)+'"/></linearGradient>';s+='<rect width="200" height="'+H+'" fill="url(#'+id+'bg)"/>'}
  else if(P.lg==='stand')s+=chE(100,P.ty+119,34,4.4,'#000',0,' opacity=".13"');
  else if(P.lg==='sq')s+=chE(100,P.gy,34,4.4,'#000',0,' opacity=".13"');
  else if(P.lg==='push')s+=chE(100,P.ha[0][1]+10,56,4.4,'#000',0,' opacity=".13"');
  if(P.dip)s+=P.ha.map(h=>'<rect x="'+f2(h[0]-6)+'" y="'+f2(P.dip)+'" width="12" height="'+f2(H-P.dip+6)+'" rx="6" fill="#222228"/>').join('');
  s+=chTail(C,P);
  /* bras (derrière le corps) : épaules calées sur la largeur du torse */
  const sh=[[100-(W-4),P.ty+3],[100+(W-4),P.ty+3]],armC=hum?C.base:C.arm,uw=12.5+M*1.2,fw=10.5+M*.8;
  [0,1].forEach(i=>{const S=sh[i],E=P.el[i],Hh=P.ha[i];s+=chLimb(S,E,Hh,uw,fw,armC);
    if(P.bic){const m=[(S[0]+E[0])/2,(S[1]+E[1])/2-4.4];s+=chC(m[0],m[1],7.4+M*1.2,armC)+chC(m[0],m[1],7.5+M*1.2,armC,0)}
    else if(M>1){const m=[S[0]+(E[0]-S[0])*.4,S[1]+(E[1]-S[1])*.4],L=Math.hypot(E[0]-S[0],E[1]-S[1])||1,sd=i?1:-1,nx=-(E[1]-S[1])/L*sd,ny=(E[0]-S[0])/L*sd,c=[m[0]-nx*2.4,m[1]-ny*2.4];s+=chC(c[0],c[1],uw*.5,armC)+chC(c[0],c[1],uw*.5+.2,armC,0)}});
  s+=chLegs(P,C,o,M);
  /* cou */
  const hd=P.hd,hsc=o.hsc||1,hT='translate('+f2(hd[0])+' '+f2(hd[1])+')'+(P.hrot?' rotate('+P.hrot+')':'')+(hsc!==1?' scale('+hsc+')':'');
  s+='<rect x="'+f2(hd[0]-5.6)+'" y="'+f2(hd[1]+11)+'" width="11.2" height="'+f2(P.ty-hd[1]-8)+'" fill="'+(hum?C.base:C.fur)+'" stroke="'+CK+'" stroke-width="'+COL+'"/>';
  if(hum){const hb=chHairBack(o.hs||'court',CH_HAIRC[o.hc]||CH_HAIRC.brun);if(hb)s+='<g transform="'+hT+'">'+hb+'</g>'}
  s+=chTorso(P,C,o,shirt,W,M,acc);
  if(SEA==='hiver')s+=chScarf(P);
  if(P.bar)s+='<rect x="8" y="'+f2(P.bar-5)+'" width="184" height="10" rx="5" fill="#222228"/><rect x="12" y="'+f2(P.bar-3.6)+'" width="176" height="2.4" rx="1.2" fill="#ffffff" opacity=".26"/>';
  /* tête */
  let hs;
  if(hum){const Hd=chHeadHuman(C,o,ex);let hx='',ha=acc,hh=Hd;
    if(SEA==='hiver'){const bn=chBeanieHuman(Hd,acc);hx=bn.s;ha=acc.filter(a=>a!=='bandeau');hh=Object.assign({},Hd,{top:bn.top-2})}else if(SEA==='ete')hx=chShades(Hd.eye,0);
    hs=Hd.s+hx+chHeadAccHuman(ha,hh)}
  else{CHOL=4.4;const Hd=chHeadAnimal(C,o,ex);let hx='',ha=acc,hh=Hd;
    if(SEA==='hiver'){const bn=chBeanieAnimal(C,Hd,acc);hx=bn.s;ha=acc.filter(a=>a!=='bandeau');hh=Object.assign({},Hd,{top:bn.top})}else if(SEA==='ete')hx=chShades(Hd.eye,1);
    hs='<g transform="scale('+AN_SC+')">'+Hd.s+hx+chHeadAccAnimal(ha,hh)+'</g>';CHOL=COL}
  s+='<g transform="'+hT+'">'+hs+'</g>';
  const hc=C.hand;s+=chHand(P.ha[0],P.tl,hum?C.base:hc,-1,gl,C)+chHand(P.ha[1],P.tr,hum?C.base:hc,1,gl,C);
  if(P.zz)s+='<g fill="none" stroke-linecap="round" stroke-linejoin="round">'+[[22,-8,6.4],[33,-20,5],[42,-30,3.8]].map(z=>{const x=hd[0]+z[0],y=hd[1]+z[1],d='M'+x+' '+y+' h'+z[2]+' l'+(-z[2])+' '+f2(z[2]*1.15)+' h'+z[2];return chSt(d,z[2]*.42+4,CK)+chSt(d,z[2]*.42,o.zc||'#bfe6ff')}).join('')+'</g>';
  const vb=o.vb||P.vb;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+(vb?vb.join(' '):'0 0 200 '+H)+'"'+(o.cls?' class="'+o.cls+'"':'')+' aria-hidden="true">'+(defs?'<defs>'+defs+'</defs>':'')+s+'</svg>'}
/* ---- animation SMIL : fusion de deux poses (traction par défaut) ---- */
function charAnim(o,dur,p1,p2){o=Object.assign({},o);const n0=CHN;const a=charSvg(Object.assign({},o,{pose:p1||'pullA'}));CHN=n0;const b=charSvg(Object.assign({},o,{pose:p2||'pullB'}));
  const re=/<([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g,ta=[...a.matchAll(re)],tb=[...b.matchAll(re)];if(ta.length!==tb.length)return a;
  const pa=s=>{const m={};for(const x of s.matchAll(/([\w:-]+)="([^"]*)"/g))m[x[1]]=x[2];return m},AN=['d','x','y','cx','cy','r','rx','ry','width','height','x1','y1','x2','y2'],D=(dur||1.5)+'s';
  const sp=' calcMode="spline" keyTimes="0;.45;1" keySplines=".45 0 .4 1;.45 0 .4 1" dur="'+D+'" repeatCount="indefinite"';
  let out='',last=0;for(let i=0;i<ta.length;i++){const A=ta[i],B=tb[i];out+=a.slice(last,A.index);last=A.index+A[0].length;const xa=pa(A[2]),xb=pa(B[2]);let an='';
    AN.forEach(k=>{if(xa[k]!==undefined&&xa[k]!==xb[k])an+='<animate attributeName="'+k+'" values="'+xa[k]+';'+xb[k]+';'+xa[k]+'"'+sp+'/>'});
    if(xa.transform&&xa.transform!==xb.transform){const t1=/translate\(([-\d.]+)[ ,]([-\d.]+)\)/.exec(xa.transform),t2=/translate\(([-\d.]+)[ ,]([-\d.]+)\)/.exec(xb.transform||''),sc=/scale\(([-\d.]+)\)/.exec(xa.transform),s=sc&&!/^translate\([^)]*\)\s*scale/.test(xa.transform)?1:sc?+sc[1]:1;
      if(t1&&t2){const dx=f2((t2[1]-t1[1])/s),dy=f2((t2[2]-t1[2])/s);an+='<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;'+dx+' '+dy+';0 0"'+sp+'/>'}}
    if(!an){out+=A[0];continue}out+=A[3]?'<'+A[1]+A[2]+'>'+an+'</'+A[1]+'>':'<'+A[1]+A[2]+'>'+an}
  return out+a.slice(last)}
/* ---- image fixe entre deux poses (k de 0 à 1), pour fabriquer une vidéo image par image ---- */
function charAt(o,pa,pb,k){const A=CH_POSE[pa],B=CH_POSE[pb],P={};for(const n in A){const a=A[n],b=B[n];P[n]=Array.isArray(a)?a.map((v,i)=>Array.isArray(v)?v.map((w,j)=>w+(b[i][j]-w)*k):v+(b[i]-v)*k):typeof a==='number'&&typeof b==='number'?a+(b-a)*k:a}
  CH_POSE.__t=P;try{return charSvg(Object.assign({},o,{pose:'__t'}))}finally{delete CH_POSE.__t}}
