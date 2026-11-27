/* ===================== v7.1 : système central des illustrations de saison =====================
   Une seule source pour tous les dessins qui dépendent de la saison :
   - seaNow()        saison active : celle du thème de saison, sinon la saison réelle
                     (déc.-fév. hiver, mars-mai printemps, juin-août été, sept.-nov. automne).
   - ILL7[saison]    palette de la saison (ciel, sol, végétation, mer).
   - illScene(lieu,o) décor large 160 x 100 (cartes de séance, semaine, accueil, partages, carte postale) ;
                     o.who = 1 ajoute le perso en train de s'entraîner (o.fam : pull, dip, push, sq).
   - illTile(type,o) petite scène portrait 48 x 88 pour les cases du calendrier :
                     'train' (le perso s'entraîne au bon lieu et au bon exercice) ou 'rest' (le perso se repose, avec « Zzz »).
   - illDay(k)       choisit la scène d'une journée : séance → entraînement ; repos → repos ; jour vide → rien.
   Les dessins ne dépendent jamais de la date de la séance : changer de saison change tout, partout.
   Les tuiles sont mises en cache (clé saison | type | lieu | exercice | perso) et servies en <img>. */
const SEA4={printemps:'spring',ete:'summer',automne:'autumn',hiver:'winter'};
function seaNow(){const t=curTh()||{};return t.season||SEA4[seasonNow()]||'autumn'}
const ILL7={
 winter:{sky:['#9db3cb','#e9f0f7'],sky2:['#a9bdd3','#edf3f9'],snow:'#f6f9fc',snow2:'#dde7f1'},
 spring:{sky:['#86cdf5','#e7f8ff'],sky2:['#94d5f7','#eefaff'],hill:'#b5e29c',hill2:'#98d47e',grass:'#7cc564',grass2:'#62b04f'},
 summer:{sky:['#33aef0','#c9efff'],sky2:['#3ab3f1','#d2f2ff'],sea:['#2ec5df','#1391c1'],sand:'#f6dba1',sand2:'#e9c27c'},
 autumn:{sky:['#e88c4c','#ffdcae'],sky2:['#ee9a58','#ffe3ba'],ground:'#5e4535',ground2:'#4a372b'}
};
const i7=v=>Math.round(v*10)/10;
function i7rnd(seed){let r=seed>>>0||1;return()=>(r=r*16807%2147483647)/2147483647}
function i7scat(n,seed,x0,y0,x1,y1,fn){const r=i7rnd(seed);let s='';for(let i=0;i<n;i++)s+=fn(x0+r()*(x1-x0),y0+r()*(y1-y0),r(),i);return s}
const i7grad=(id,a,b)=>'<linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient>';
/* ---- éléments de décor ---- */
function i7fir(x,y,h,snow){const w=h*.64,T=[[.62,.14,.5],[.84,.42,.4],[1,.66,.28]];let s='<rect x="'+i7(x-h*.05)+'" y="'+i7(y-h*.16)+'" width="'+i7(h*.1)+'" height="'+i7(h*.16)+'" fill="#5a3a24"/>';
  T.forEach(t=>{s+='<path d="M'+i7(x)+' '+i7(y-h*t[0])+'L'+i7(x+w*t[2])+' '+i7(y-h*t[1])+'H'+i7(x-w*t[2])+'Z" fill="#2f5d4f"/>';if(snow)s+='<path d="M'+i7(x)+' '+i7(y-h*t[0])+'L'+i7(x+w*t[2]*.5)+' '+i7(y-h*(t[0]*.6+t[1]*.4))+'Q'+i7(x)+' '+i7(y-h*(t[0]*.5+t[1]*.5))+' '+i7(x-w*t[2]*.5)+' '+i7(y-h*(t[0]*.6+t[1]*.4))+'Z" fill="#fff"/>'});return s}
function i7tree(x,y,h,c){/* c = [feuillage foncé, moyen, clair, points] */let s='<path d="M'+i7(x-h*.05)+' '+i7(y)+'L'+i7(x-h*.03)+' '+i7(y-h*.52)+'H'+i7(x+h*.03)+'L'+i7(x+h*.05)+' '+i7(y)+'Z" fill="#6b4630"/><path d="M'+i7(x)+' '+i7(y-h*.42)+'l'+i7(-h*.14)+' '+i7(-h*.12)+'M'+i7(x)+' '+i7(y-h*.48)+'l'+i7(h*.13)+' '+i7(-h*.1)+'" stroke="#6b4630" stroke-width="'+i7(h*.035)+'" stroke-linecap="round"/>';
  [[0,.66,.3,0],[-.2,.56,.21,1],[.2,.58,.22,1],[-.1,.82,.2,2],[.12,.8,.19,2],[0,.95,.13,2]].forEach(q=>{s+='<circle cx="'+i7(x+h*q[0])+'" cy="'+i7(y-h*q[1])+'" r="'+i7(h*q[2])+'" fill="'+c[q[3]]+'"/>'});
  if(c[3])s+=i7scat(9,Math.round(x*7+h),x-h*.32,y-h*1.02,x+h*.32,y-h*.42,(a,b,r)=>'<circle cx="'+i7(a)+'" cy="'+i7(b)+'" r="'+i7(h*(.022+r*.02))+'" fill="'+c[3]+'"/>');return s}
const I7BLOOM=['#f48fb6','#ffb3cf','#ffd3e3','#ffffff'],I7FALL=['#c4452f','#e8792a','#f2b33d','#ffd36b'],I7GREEN=['#3f9a4b','#58b85a','#7fd06c',''];
const I7APPLE=['#3f9a4b','#5dbb57','#86d26f','#ffffff'];
const I7PALE=['#7cbf6a','#95d07e','#b3e09a','']; /* v7.2 : arbres lointains du printemps */
const i7bush=(x,y,s,c)=>'<circle cx="'+i7(x-3*s)+'" cy="'+i7(y-2.2*s)+'" r="'+i7(3*s)+'" fill="#4fa54c"/><circle cx="'+i7(x+2.6*s)+'" cy="'+i7(y-2.4*s)+'" r="'+i7(3.2*s)+'" fill="#5dbb57"/><circle cx="'+i7(x)+'" cy="'+i7(y-4.2*s)+'" r="'+i7(3.1*s)+'" fill="#6cc562"/>'+(c?i7scat(5,Math.round(x*3),x-5*s,y-6.5*s,x+5*s,y-1.5*s,(a,b)=>'<circle cx="'+i7(a)+'" cy="'+i7(b)+'" r="'+i7(.7*s)+'" fill="'+c+'"/>'):''); /* arbre vert en fleurs (pommier) : le printemps ne se résume pas aux cerisiers */
function i7tulip(x,y,s,c){return '<path d="M'+i7(x)+' '+i7(y)+'V'+i7(y-6*s)+'" stroke="#3f9a4b" stroke-width="'+i7(.8*s)+'" stroke-linecap="round"/><path d="M'+i7(x)+' '+i7(y-1.5*s)+'q'+i7(2.2*s)+' '+i7(-1.6*s)+' '+i7(2.4*s)+' '+i7(-3.8*s)+'q'+i7(-1.6*s)+' '+i7(1*s)+' '+i7(-2.4*s)+' '+i7(2.6*s)+'z" fill="#58b85a"/><path d="M'+i7(x-1.8*s)+' '+i7(y-8.6*s)+'l'+i7(.9*s)+' '+i7(1.4*s)+'l'+i7(.9*s)+' '+i7(-1.4*s)+'l'+i7(.9*s)+' '+i7(1.4*s)+'l'+i7(.9*s)+' '+i7(-1.4*s)+'v'+i7(1.6*s)+'q0 '+i7(1.6*s)+' '+i7(-1.8*s)+' '+i7(1.6*s)+'q'+i7(-1.8*s)+' 0 '+i7(-1.8*s)+' '+i7(-1.6*s)+'z" fill="'+c+'"/>'}
const I7TUL=['#e5484d','#ffc53d','#ff8fbf','#ffffff','#f76b15'];
const i7tulips=(n,seed,x0,x1,y,s)=>i7scat(n,seed,x0,y,x1,y+.01,(x,yy,r,i)=>i7tulip(x,y+r*1.5,s*(.85+r*.3),I7TUL[i%I7TUL.length]));
function i7fly(x,y,s,c){return '<g transform="rotate(-12 '+i7(x)+' '+i7(y)+')"><ellipse cx="'+i7(x-1.3*s)+'" cy="'+i7(y-.8*s)+'" rx="'+i7(1.4*s)+'" ry="'+i7(1.1*s)+'" fill="'+c+'"/><ellipse cx="'+i7(x+1.3*s)+'" cy="'+i7(y-.8*s)+'" rx="'+i7(1.4*s)+'" ry="'+i7(1.1*s)+'" fill="'+c+'"/><ellipse cx="'+i7(x-1*s)+'" cy="'+i7(y+.9*s)+'" rx="'+i7(.9*s)+'" ry="'+i7(.8*s)+'" fill="'+c+'" opacity=".85"/><ellipse cx="'+i7(x+1*s)+'" cy="'+i7(y+.9*s)+'" rx="'+i7(.9*s)+'" ry="'+i7(.8*s)+'" fill="'+c+'" opacity=".85"/><rect x="'+i7(x-.3*s)+'" y="'+i7(y-1.8*s)+'" width="'+i7(.6*s)+'" height="'+i7(3.4*s)+'" rx="'+i7(.3*s)+'" fill="#3a2a20"/></g>'}
/* développé couché : banc, perso allongé bras tendus, disque vu de profil (u = 1 pour une tuile) ; rep = une répétition au toucher (barre jusqu'à la poitrine) */
CH_POSE.bench={hd:[100,39],ty:73,el:[[150,84],[150,84]],ha:[[178,84],[178,84]],tl:'fist',tr:'fist',lg:'stand',nosh:1};
CH_POSE.benchB={hd:[100,39],ty:73,el:[[112,100],[112,100]],ha:[[135,86],[135,86]],tl:'fist',tr:'fist',lg:'stand',nosh:1};
const I7REP=d=>' dur="'+d+'s" begin="indefinite" fill="remove" calcMode="spline" keyTimes="0;.45;1" keySplines=".45 0 .4 1;.45 0 .4 1"'; /* même rythme que charAnim(…, once) */
const i7plate=(x,y,u,mv,d)=>'<g>'+(mv?'<animateTransform attributeName="transform" type="translate" values="0 0;'+i7(mv[0])+' '+i7(mv[1])+';0 0"'+I7REP(d)+'/>':'')+'<circle cx="'+i7(x)+'" cy="'+i7(y)+'" r="'+i7(6.4*u)+'" fill="#2c2c33" stroke="#141418" stroke-width="'+i7(.7*u)+'"/><circle cx="'+i7(x)+'" cy="'+i7(y)+'" r="'+i7(4*u)+'" fill="none" stroke="#4a4a54" stroke-width="'+i7(.9*u)+'"/><circle cx="'+i7(x)+'" cy="'+i7(y)+'" r="'+i7(1.3*u)+'" fill="#c9c9cf"/></g>';
function i7bench(cx,cy,u,fy,rep){if(myChar({}).sp==='femme')return i7hip(cx,fy,u,rep); /* v7.3 : perso « Femme » : hip thrust */
  return '<rect x="'+i7(cx-10*u)+'" y="'+i7(cy+7*u)+'" width="'+i7(1.8*u)+'" height="'+i7(fy-cy-7*u)+'" fill="#1d1d22"/><rect x="'+i7(cx+11*u)+'" y="'+i7(cy+7*u)+'" width="'+i7(1.8*u)+'" height="'+i7(fy-cy-7*u)+'" fill="#1d1d22"/><rect x="'+i7(cx-14*u)+'" y="'+i7(cy+4.8*u)+'" width="'+i7(30*u)+'" height="'+i7(3.2*u)+'" rx="'+i7(1.6*u)+'" fill="#33333b"/><rect x="'+i7(cx-13*u)+'" y="'+i7(cy+5.3*u)+'" width="'+i7(28*u)+'" height="'+i7(.8*u)+'" rx="'+i7(.4*u)+'" fill="#ffffff" opacity=".18"/>'
  +i7who('bench',cx-20*u,cy-20*u,40*u,Object.assign({rot:-90,ex:'effort',sea:''},rep?{alt:'benchB',dur:1.4}:{}))
  +i7plate(cx-3.2*u,cy-15.6*u,u,rep?[.4*u,8.6*u]:0,1.4)} /* main tendue (178,84) → poitrine (135,86), dans le repère tourné */
/* v7.3 : hip thrust (perso « Femme ») : haut du dos posé sur le bord d'un banc vu de bout, pieds à plat, barre sur les hanches.
   Repos = hanches en haut (corps à l'horizontale) ; la répétition fait descendre les hanches en pivotant sur le bord du banc.
   Les genoux sont recalculés pour que les pieds restent posés (même longueur de cuisse et de tibia). */
function i7hip(cx,fy,u,rep){const k=.2*u,M=Math.max(0,Math.min(2,myChar({}).mus|0)),W=23+M*2,bx=cx-6*u,bt=fy-4.2*u,x0=bx-(100-W)*k,y0=bt-78*k,aA=-90,aB=-66,D=1.4,ty=73;
  const T=(p,a)=>{const r=a*Math.PI/180,dx=x0+p[0]*k-bx,dy=y0+p[1]*k-bt;return [bx+dx*Math.cos(r)-dy*Math.sin(r),bt+dx*Math.sin(r)+dy*Math.cos(r)]},
    Ti=(q,a)=>{const r=-a*Math.PI/180,dx=q[0]-bx,dy=q[1]-bt;return [(bx+dx*Math.cos(r)-dy*Math.sin(r)-x0)/k,(bt+dx*Math.sin(r)+dy*Math.cos(r)-y0)/k]},
    knee=(h,f,L1,L2)=>{const dx=f[0]-h[0],dy=f[1]-h[1],d=Math.hypot(dx,dy)||1,a=(L1*L1-L2*L2+d*d)/(2*d),hh=Math.sqrt(Math.max(0,L1*L1-a*a)),mx=h[0]+a*dx/d,my=h[1]+a*dy/d,p1=[mx+hh*dy/d,my-hh*dx/d],p2=[mx-hh*dy/d,my+hh*dx/d];return p1[1]<p2[1]?p1:p2},
    Lt=32*k,LEG=[[96,2],[100,0]]; /* jambe du fond puis jambe devant : position de la hanche dans le perso */
  const feet=LEG.map(l=>{const h=T([l[0],ty+58+l[1]],aA),kn=[h[0]+Lt,h[1]];return {kn,an:[kn[0]+.6*k,fy-6.2*k]}});
  const pose=a=>{const lp=LEG.map((l,i)=>{const hp=[l[0],ty+58+l[1]],f=feet[i],kn=a===aA?f.kn:knee(T(hp,a),f.an,Lt,Math.hypot(f.an[0]-f.kn[0],f.an[1]-f.kn[1])),r=q=>{const v=Ti(q,a);return [f2(v[0]-100),f2(v[1]-ty)]};return [[hp[0]-100,hp[1]-ty],r(kn),r(f.an)]});
    return {hd:[100,39],ty,el:[[102,101],[100+W+10,97]],ha:[[100+W+2,116],[100+W+4,118]],tl:'grip',tr:'grip',lg:'ht',lp,sr:-a,nosh:1}};
  CH_POSE.htA=pose(aA);CH_POSE.htB=pose(aB);
  const o=myChar({ex:'effort',sea:''}),svg=(rep?charAnim(o,D,'htA','htB',1):charSvg(Object.assign({},o,{pose:'htA'}))).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
  const bar=[100+W+6,120],pA=T(bar,aA),pB=T(bar,aB);
  return '<rect x="'+i7(bx-8.6*u)+'" y="'+i7(bt)+'" width="'+i7(9.2*u)+'" height="'+i7(2.8*u)+'" rx="'+i7(1.2*u)+'" fill="#33333b"/><rect x="'+i7(bx-8*u)+'" y="'+i7(bt+.5*u)+'" width="'+i7(8*u)+'" height="'+i7(.7*u)+'" rx="'+i7(.35*u)+'" fill="#ffffff" opacity=".18"/>'
   +'<rect x="'+i7(bx-5*u)+'" y="'+i7(bt+2.8*u)+'" width="'+i7(2.2*u)+'" height="'+i7(fy-bt-3.8*u)+'" fill="#1d1d22"/><rect x="'+i7(bx-8*u)+'" y="'+i7(fy-1.2*u)+'" width="'+i7(8*u)+'" height="'+i7(1.2*u)+'" rx="'+i7(.5*u)+'" fill="#1d1d22"/>'
   +'<g class="hip7" transform="rotate('+aA+' '+i7(bx)+' '+i7(bt)+')">'+(rep?'<animateTransform attributeName="transform" type="rotate" values="'+aA+' '+i7(bx)+' '+i7(bt)+';'+aB+' '+i7(bx)+' '+i7(bt)+';'+aA+' '+i7(bx)+' '+i7(bt)+'"'+I7REP(D)+'/>':'')
   +'<svg x="'+i7(x0)+'" y="'+i7(y0)+'" width="'+i7(200*k)+'" height="'+i7(200*k)+'" viewBox="0 0 200 200" overflow="visible">'+svg+'</svg></g>'
   +i7plate(pA[0],pA[1],u*.74,rep?[pB[0]-pA[0],pB[1]-pA[1]]:0,D)}
/* pique-nique : couverture à carreaux et panier */
function i7picnic(x,y,w,h){let s='<rect x="'+i7(x)+'" y="'+i7(y)+'" width="'+i7(w)+'" height="'+i7(h)+'" rx="1.2" fill="#ffffff"/>';const n=8,m=3,cw=w/n,ch=h/m;
  for(let i=0;i<n;i++)for(let j=0;j<m;j++)if((i+j)%2===0)s+='<rect x="'+i7(x+i*cw)+'" y="'+i7(y+j*ch)+'" width="'+i7(cw)+'" height="'+i7(ch)+'" fill="#e5484d" opacity=".85"/>';
  for(let i=1;i<n;i+=2)s+='<rect x="'+i7(x+i*cw)+'" y="'+i7(y)+'" width="'+i7(cw)+'" height="'+i7(h)+'" fill="#e5484d" opacity=".25"/>';return s}
function i7basket(x,y,s){return '<path d="M'+i7(x-4*s)+' '+i7(y-4.4*s)+'Q'+i7(x)+' '+i7(y-10*s)+' '+i7(x+4*s)+' '+i7(y-4.4*s)+'" fill="none" stroke="#8a5a2e" stroke-width="'+i7(.9*s)+'"/><path d="M'+i7(x+1*s)+' '+i7(y-4.6*s)+'l'+i7(5*s)+' '+i7(-4.4*s)+'" stroke="#e7b56b" stroke-width="'+i7(1.8*s)+'" stroke-linecap="round"/><circle cx="'+i7(x-2*s)+'" cy="'+i7(y-4.8*s)+'" r="'+i7(1.5*s)+'" fill="#e5484d"/>'
  +'<path d="M'+i7(x-5*s)+' '+i7(y-4.6*s)+'H'+i7(x+5*s)+'L'+i7(x+4*s)+' '+i7(y)+'H'+i7(x-4*s)+'Z" fill="#c08a4e"/><path d="M'+i7(x-4.7*s)+' '+i7(y-3*s)+'H'+i7(x+4.7*s)+'M'+i7(x-4.4*s)+' '+i7(y-1.5*s)+'H'+i7(x+4.4*s)+'" stroke="#8a5a2e" stroke-width="'+i7(.5*s)+'"/>'}
function i7palm(x,y,h,flip){const k=flip?-1:1,tx=x+k*h*.16,ty=y-h;let s='<path d="M'+i7(x)+' '+i7(y)+'Q'+i7(x+k*h*.2)+' '+i7(y-h*.5)+' '+i7(tx)+' '+i7(ty)+'" fill="none" stroke="#9a6a3f" stroke-width="'+i7(h*.07)+'" stroke-linecap="round"/>';
  [[-1,.05],[-.6,-.35],[0,-.45],[.6,-.35],[1,.05],[.35,.3],[-.35,.3]].forEach((f,i)=>{const ex=tx+f[0]*h*.42,ey=ty+f[1]*h*.42+h*.12,cx=tx+f[0]*h*.22,cy=ty-h*.12+f[1]*h*.1;s+='<path d="M'+i7(tx)+' '+i7(ty)+'Q'+i7(cx)+' '+i7(cy-h*.06)+' '+i7(ex)+' '+i7(ey)+'Q'+i7(cx)+' '+i7(cy+h*.06)+' '+i7(tx)+' '+i7(ty)+'Z" fill="'+(i%2?'#2f9a52':'#3fb563')+'"/>'});
  return s+'<circle cx="'+i7(tx-h*.03)+'" cy="'+i7(ty+h*.05)+'" r="'+i7(h*.04)+'" fill="#7a4a24"/><circle cx="'+i7(tx+h*.04)+'" cy="'+i7(ty+h*.06)+'" r="'+i7(h*.04)+'" fill="#8a5a2e"/>'}
function i7parasol(cx,cy,r,px,py){/* toile rayée (centre du bord cx,cy), mât jusqu'à px,py */const a=[cx,cy-r*.62],rim=[0,1,2,3,4].map(i=>[cx-r+i*r/2,cy]);let s='<path d="M'+i7(a[0])+' '+i7(a[1])+'L'+i7(px)+' '+i7(py)+'" stroke="#f4efe6" stroke-width="'+i7(r*.09)+'" stroke-linecap="round"/><path d="M'+i7(a[0])+' '+i7(a[1])+'L'+i7(px)+' '+i7(py)+'" stroke="#9a8f80" stroke-width="'+i7(r*.035)+'" stroke-linecap="round" opacity=".6"/>';
  for(let i=0;i<4;i++)s+='<path d="M'+i7(a[0])+' '+i7(a[1])+'L'+i7(rim[i][0])+' '+i7(rim[i][1])+'Q'+i7((rim[i][0]+rim[i+1][0])/2)+' '+i7(cy+r*.16)+' '+i7(rim[i+1][0])+' '+i7(rim[i+1][1])+'Z" fill="'+(i%2?'#fff7ec':'#ff5f4f')+'"/>';
  return s+'<circle cx="'+i7(a[0])+'" cy="'+i7(a[1])+'" r="'+i7(r*.07)+'" fill="#ff5f4f"/>'}
function i7snowman(x,y,s){return '<ellipse cx="'+i7(x)+'" cy="'+i7(y)+'" rx="'+i7(8*s)+'" ry="'+i7(1.6*s)+'" fill="#c9d7e6" opacity=".7"/><path d="M'+i7(x-5*s)+' '+i7(y-17*s)+'l'+i7(-5*s)+' '+i7(-3.5*s)+'M'+i7(x+5*s)+' '+i7(y-17*s)+'l'+i7(5*s)+' '+i7(-4*s)+'" stroke="#6b4630" stroke-width="'+i7(.8*s)+'" stroke-linecap="round"/>'
  +[[7,7],[17,5.2],[25,3.9]].map(c=>'<circle cx="'+i7(x)+'" cy="'+i7(y-c[0]*s)+'" r="'+i7(c[1]*s)+'" fill="#fff" stroke="#cfdbe8" stroke-width="'+i7(.5*s)+'"/>').join('')
  +'<path d="M'+i7(x-3.6*s)+' '+i7(y-21.6*s)+'h'+i7(7.2*s)+'" stroke="#e2483d" stroke-width="'+i7(1.5*s)+'" stroke-linecap="round"/><path d="M'+i7(x+1.6*s)+' '+i7(y-21.6*s)+'l'+i7(1*s)+' '+i7(4*s)+'" stroke="#e2483d" stroke-width="'+i7(1.3*s)+'" stroke-linecap="round"/>'
  +'<path d="M'+i7(x)+' '+i7(y-25*s)+'l'+i7(3.4*s)+' '+i7(.9*s)+'l'+i7(-3.4*s)+' '+i7(.8*s)+'z" fill="#ff8a2a"/><circle cx="'+i7(x-1.4*s)+'" cy="'+i7(y-26.2*s)+'" r="'+i7(.5*s)+'" fill="#2a2d38"/><circle cx="'+i7(x+1.3*s)+'" cy="'+i7(y-26.2*s)+'" r="'+i7(.5*s)+'" fill="#2a2d38"/>'
  +'<rect x="'+i7(x-3.4*s)+'" y="'+i7(y-29.6*s)+'" width="'+i7(6.8*s)+'" height="'+i7(1.2*s)+'" rx="'+i7(.5*s)+'" fill="#2a2d38"/><rect x="'+i7(x-2.3*s)+'" y="'+i7(y-33*s)+'" width="'+i7(4.6*s)+'" height="'+i7(3.8*s)+'" rx="'+i7(.6*s)+'" fill="#2a2d38"/>'
  +[15,18.4].map(b=>'<circle cx="'+i7(x)+'" cy="'+i7(y-b*s)+'" r="'+i7(.55*s)+'" fill="#2a2d38"/>').join('')}
function i7sun(x,y,r,rays){let s='';if(rays)s+='<g stroke="#ffe27a" stroke-width="'+i7(r*.22)+'" stroke-linecap="round" opacity=".85">'+[0,45,90,135,180,225,270,315].map(a=>{const c=Math.cos(a*Math.PI/180),d=Math.sin(a*Math.PI/180);return '<path d="M'+i7(x+c*r*1.4)+' '+i7(y+d*r*1.4)+'L'+i7(x+c*r*1.85)+' '+i7(y+d*r*1.85)+'"/>'}).join('')+'</g>';
  return s+'<circle cx="'+i7(x)+'" cy="'+i7(y)+'" r="'+i7(r)+'" fill="#ffd23f"/><circle cx="'+i7(x)+'" cy="'+i7(y)+'" r="'+i7(r*.72)+'" fill="#ffe680"/>'}
const i7cloud=(x,y,s)=>'<g fill="#fff" opacity=".95"><circle cx="'+i7(x)+'" cy="'+i7(y)+'" r="'+i7(4*s)+'"/><circle cx="'+i7(x+4.5*s)+'" cy="'+i7(y+.8*s)+'" r="'+i7(3.2*s)+'"/><circle cx="'+i7(x-4.4*s)+'" cy="'+i7(y+1.2*s)+'" r="'+i7(2.8*s)+'"/><rect x="'+i7(x-7*s)+'" y="'+i7(y+1*s)+'" width="'+i7(14.5*s)+'" height="'+i7(3*s)+'" rx="'+i7(1.5*s)+'"/></g>';
const i7flakes=(n,seed,x0,y0,x1,y1,k)=>i7scat(n,seed,x0,y0,x1,y1,(x,y,r)=>'<circle cx="'+i7(x)+'" cy="'+i7(y)+'" r="'+i7((.45+r*.55)*(k||1))+'" fill="#fff" opacity=".92"/>');
const i7petals=(n,seed,x0,y0,x1,y1,k)=>i7scat(n,seed,x0,y0,x1,y1,(x,y,r)=>'<ellipse cx="'+i7(x)+'" cy="'+i7(y)+'" rx="'+i7(1.1*(k||1))+'" ry="'+i7(.6*(k||1))+'" fill="'+(r<.4?'#ff9cc4':r<.7?'#ffd0e2':'#ffffff')+'" transform="rotate('+Math.round(r*180)+' '+i7(x)+' '+i7(y)+')"/>');
const i7leaves=(n,seed,x0,y0,x1,y1,k)=>i7scat(n,seed,x0,y0,x1,y1,(x,y,r)=>'<path d="M'+i7(x-1.6*(k||1))+' '+i7(y)+'Q'+i7(x)+' '+i7(y-1.3*(k||1))+' '+i7(x+1.6*(k||1))+' '+i7(y)+'Q'+i7(x)+' '+i7(y+1.3*(k||1))+' '+i7(x-1.6*(k||1))+' '+i7(y)+'Z" fill="'+I7FALL[Math.floor(r*4)%4]+'" transform="rotate('+Math.round(r*360)+' '+i7(x)+' '+i7(y)+')"/>');
const i7flowers=(n,seed,x0,y0,x1,y1,k)=>i7scat(n,seed,x0,y0,x1,y1,(x,y,r)=>'<circle cx="'+i7(x)+'" cy="'+i7(y)+'" r="'+i7(.95*(k||1))+'" fill="'+['#ffffff','#ffd23f','#ff8fbf','#ffffff'][Math.floor(r*4)%4]+'"/><circle cx="'+i7(x)+'" cy="'+i7(y)+'" r="'+i7(.36*(k||1))+'" fill="'+(r<.5?'#ffb000':'#ffffff')+'"/>');
function i7zzz(x,y,s){let p='';[[0,0,1],[1.25,-1.5,.78],[2.3,-2.8,.6]].forEach(z=>{const w=s*z[2],X=x+z[0]*s,Y=y+z[1]*s;p+='M'+i7(X)+' '+i7(Y)+'h'+i7(w)+'l'+i7(-w)+' '+i7(w)+'h'+i7(w)});
  return '<path d="'+p+'" fill="none" stroke="#1d2433" stroke-opacity=".5" stroke-width="'+i7(s*.62)+'" stroke-linecap="round" stroke-linejoin="round"/><path d="'+p+'" fill="none" stroke="#fff" stroke-width="'+i7(s*.3)+'" stroke-linecap="round" stroke-linejoin="round"/>'}
/* ---- le perso de l'utilisateur, dessiné par le moteur des persos (même style partout) ---- */
function i7who(pose,x,y,w,o){o=o||{};const co=myChar(Object.assign({pose},o.ex?{ex:o.ex}:{},o.sea!==undefined?{sea:o.sea}:{})),svg=o.alt?charAnim(co,o.dur||1.4,pose,o.alt,1):charSvg(co),m=svg.match(/viewBox="([^"]+)"/),vb=m?m[1]:'0 0 200 200',p=vb.split(' ').map(Number),h=w*p[3]/p[2];
  let s='<svg x="'+i7(x)+'" y="'+i7(y)+'" width="'+i7(w)+'" height="'+i7(h)+'" viewBox="'+vb+'" overflow="visible">'+svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')+'</svg>';
  if(o.rot)s='<g transform="rotate('+o.rot+' '+i7(x+w/2)+' '+i7(y+h/2)+')">'+s+'</g>';return s}
/* exercice dominant d'une séance → pose (tractions par défaut dehors, squat en salle) */
function i7fam(ss,place){const f=ss&&ss.length?exFam(mainEx(ss[0])):'cheer';return f==='cheer'?(place==='salle'?'sq':'pull'):f==='push'?'dip':f} /* pompes → dips : la pompe de face se lit mal en petit */
const I7POSE={pull:'pullB',dip:'dipB',push:'pushB',sq:'sqB'};
const I7ALT={pullB:['pullA',1.5],dipB:['dipA',1.3],pushB:['pushA',1.2],sqB:['sqA',1.4]}; /* v7.3 : pose de l'autre bout de la répétition, durée (s) */
const I7DOOR='<rect x="6" y="14" width="56" height="62" rx="2" fill="#6b7486"/><g stroke="#4a5262" stroke-width="2"><path d="M6 24h56M6 34h56M6 44h56M6 54h56M6 64h56"/></g><rect x="6" y="64" width="56" height="12" fill="#ffd166" opacity=".35"/>',
  I7MIR='<g fill="url(#gMir)"><rect x="8" y="40" width="44" height="34"/><rect x="58" y="40" width="44" height="34"/><rect x="108" y="40" width="44" height="34"/></g>';
/* vue sur l'extérieur (porte de garage ouverte, fenêtres de la salle) : même en intérieur, la saison se voit */
function i7view(sea,R,id){const P=ILL7[sea],x=Math.min(...R.map(r=>r[0])),y=Math.min(...R.map(r=>r[1])),x2=Math.max(...R.map(r=>r[0]+r[2])),y2=Math.max(...R.map(r=>r[1]+r[3])),w=x2-x,h=y2-y,gy=y+h*.74;
  let d='<clipPath id="'+id+'c">'+R.map(r=>'<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'"/>').join('')+'</clipPath>'+i7grad(id+'s',P.sky[0],P.sky[1]),s='<g clip-path="url(#'+id+'c)"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="url(#'+id+'s)"/>';
  const k=Math.min(w,h*1.6)/40;
  if(sea==='winter')s+=i7flakes(Math.round(w/3),5,x,y,x2,gy,k)+'<path d="M'+x+' '+i7(gy-h*.08)+'Q'+i7(x+w*.3)+' '+i7(gy-h*.2)+' '+i7(x+w*.6)+' '+i7(gy-h*.1)+'T'+x2+' '+i7(gy-h*.12)+'V'+y2+'H'+x+'Z" fill="'+P.snow2+'"/>'+i7fir(x+w*.78,gy+h*.04,h*.62,1)+i7fir(x+w*.2,gy+h*.04,h*.4,1)+'<rect x="'+x+'" y="'+i7(gy)+'" width="'+w+'" height="'+i7(y2-gy)+'" fill="'+P.snow+'"/>';
  else if(sea==='spring')s+=i7cloud(x+w*.3,y+h*.22,k*.8)+'<path d="M'+x+' '+i7(gy-h*.06)+'Q'+i7(x+w*.4)+' '+i7(gy-h*.24)+' '+i7(x+w*.75)+' '+i7(gy-h*.1)+'T'+x2+' '+i7(gy-h*.14)+'V'+y2+'H'+x+'Z" fill="'+P.hill+'"/>'+i7tree(x+w*.76,gy+h*.04,h*.7,I7APPLE)+'<rect x="'+x+'" y="'+i7(gy)+'" width="'+w+'" height="'+i7(y2-gy)+'" fill="'+P.grass+'"/>'+i7tulips(Math.max(3,Math.round(w/8)),7,x+2,x2-2,y2-1.5,k*.75)+i7fly(x+w*.3,y+h*.45,k*1.1,'#ffc53d');
  else if(sea==='summer'){d+=i7grad(id+'m',P.sea[0],P.sea[1]);s+=i7sun(x+w*.78,y+h*.24,h*.11,1)+'<rect x="'+x+'" y="'+i7(gy-h*.2)+'" width="'+w+'" height="'+i7(h*.22)+'" fill="url(#'+id+'m)"/><rect x="'+x+'" y="'+i7(gy)+'" width="'+w+'" height="'+i7(y2-gy)+'" fill="'+P.sand+'"/>'+i7palm(x+w*.16,gy+h*.06,h*.66,0)}
  else s+='<circle cx="'+i7(x+w*.3)+'" cy="'+i7(y+h*.38)+'" r="'+i7(h*.16)+'" fill="#ffe6b0" opacity=".9"/>'+i7tree(x+w*.74,gy+h*.04,h*.7,I7FALL)+'<rect x="'+x+'" y="'+i7(gy)+'" width="'+w+'" height="'+i7(y2-gy)+'" fill="'+P.ground+'"/>'+i7leaves(Math.round(w/3),9,x,gy+1,x2,y2-1,k*.8)+i7leaves(Math.round(w/7),4,x,y,x2,gy,k*.8);
  return [d,s+'</g>']}
/* ---- décor large 160 x 100 ---- */
function illScene(place,o){o=o||{};const sea=seaNow();if(place!=='street'){let s=place==='garage'?GAR:place==='salle'?GYM:'';if(!s)return '';
    if(place==='garage'){const v=i7view(sea,[[6,30,56,46]],'v7g'+sea.slice(0,2));s=s.replace(I7DOOR,'<defs>'+v[0]+'</defs>'+v[1]+'<rect x="6" y="14" width="56" height="16" rx="2" fill="#6b7486"/><g stroke="#4a5262" stroke-width="2"><path d="M6 20h56M6 26h56"/></g><rect x="6" y="29" width="56" height="2.4" fill="#3e4554"/>')}
    else{const v=i7view(sea,[[8,40,44,34],[58,40,44,34],[108,40,44,34]],'v7y'+sea.slice(0,2));s=s.replace(I7MIR,'<defs>'+v[0]+'</defs>'+v[1]+'<g fill="none" stroke="#121214" stroke-width="2"><rect x="8" y="40" width="44" height="34"/><rect x="58" y="40" width="44" height="34"/><rect x="108" y="40" width="44" height="34"/><path d="M30 40v34M80 40v34M130 40v34"/></g>')}
    s=s.replace('<svg ','<svg data-sea="'+sea+'" ');if(o.who)s=s.replace(/<\/svg>$/,i7sceneWho(place,o.fam||'pull',o.rep)+'</svg>');return s}
  const P=ILL7[sea],id='i7'+sea.slice(0,2);let d=i7grad(id+'k',P.sky[0],P.sky[1]),s='<rect width="160" height="100" fill="url(#'+id+'k)"/>';
  if(sea==='winter'){s+='<circle cx="120" cy="30" r="11" fill="#f4f7fb" opacity=".85"/><g fill="#8a9cb3" opacity=".75"><rect x="0" y="40" width="15" height="42"/><rect x="17" y="30" width="12" height="52"/><rect x="31" y="46" width="16" height="36"/><rect x="96" y="50" width="14" height="32"/><rect x="132" y="36" width="20" height="46"/></g><g fill="#fff"><rect x="0" y="38" width="15" height="3" rx="1.5"/><rect x="17" y="28" width="12" height="3" rx="1.5"/><rect x="31" y="44" width="16" height="3" rx="1.5"/><rect x="96" y="48" width="14" height="3" rx="1.5"/><rect x="132" y="34" width="20" height="3" rx="1.5"/></g>'
    +i7fir(12,82,30,1)+i7fir(26,82,20,1)+'<path d="M0 79Q20 75 40 79T80 78T120 79T160 78V100H0Z" fill="'+P.snow+'"/><path d="M0 90Q30 86 60 90T120 89T160 90" fill="none" stroke="'+P.snow2+'" stroke-width="2"/>'+i7snowman(146,90,1.05)+i7flakes(30,7,0,0,160,78,1.3)}
  else if(sea==='spring'){s+=i7sun(126,24,9,0)+i7cloud(34,20,1.2)+i7cloud(98,14,.9)+'<path d="M0 64Q40 50 80 62T160 58V84H0Z" fill="'+P.hill+'"/>'
    +[[24,66,12,I7PALE],[36,63,10,I7BLOOM],[58,62,13,I7PALE],[70,64,10,I7APPLE],[98,65,12,I7PALE],[110,63,10,I7BLOOM],[136,61,13,I7PALE]].map(t=>i7tree(t[0],t[1],t[2],t[3])).join('') /* v7.2 : rangée d'arbres au loin (visible même quand la scène est recadrée) */
    +'<path d="M0 72Q50 62 100 72T160 70V84H0Z" fill="'+P.hill2+'"/>'+i7bush(29,81,1.1,'#ff8fbf')+i7bush(134,81,1,'#ffffff')
    +i7tree(16,82,42,I7BLOOM)+i7tree(147,82,46,I7APPLE)+i7tree(130,82,30,I7GREEN)+'<rect y="80" width="160" height="20" fill="'+P.grass+'"/><path d="M0 80Q40 77 80 80T160 80V83H0Z" fill="'+P.grass2+'" opacity=".5"/>'+i7flowers(14,11,2,86,158,98,1.3)+i7tulips(9,12,4,154,92,1.3)+i7petals(10,5,0,4,160,76,1.3)+i7fly(104,30,1.4,'#ffc53d')+i7fly(30,52,1.2,'#7ec8ff')}
  else if(sea==='summer'){d+=i7grad(id+'m',P.sea[0],P.sea[1]);s+=i7sun(128,22,11,1)+'<rect y="56" width="160" height="22" fill="url(#'+id+'m)"/><g fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".7"><path d="M10 63q5-3 10 0t10 0M70 68q5-3 10 0t10 0M120 62q5-3 10 0t10 0M40 73q5-3 10 0t10 0"/></g>'
    +'<path d="M96 62l9-18 1 18z" fill="#fff"/><path d="M106 46l9 15h-8z" fill="#ff6b5b"/><path d="M93 63h24l-3 4H96z" fill="#2f4458"/><g fill="none" stroke="#2f4458" stroke-width="1.4" stroke-linecap="round"><path d="M30 18q3-3 6 0q3-3 6 0M52 28q2-2 4 0q2-2 4 0"/></g>'
    +'<path d="M0 76Q40 73 80 76T160 75V100H0Z" fill="'+P.sand+'"/>'+i7scat(26,3,2,80,158,99,(x,y,r)=>'<circle cx="'+i7(x)+'" cy="'+i7(y)+'" r=".7" fill="'+P.sand2+'"/>')+i7palm(150,82,52,1)+i7parasol(17,68,15,20,92)+'<rect x="4" y="90" width="26" height="6" rx="1.5" fill="#2ec5df"/><rect x="4" y="92" width="26" height="1.6" fill="#fff" opacity=".8"/>'}
  else{s+='<circle cx="118" cy="40" r="14" fill="#ffe6b0" opacity=".9"/><g fill="#a6603a" opacity=".55"><rect x="0" y="40" width="15" height="42"/><rect x="17" y="30" width="12" height="52"/><rect x="31" y="46" width="16" height="36"/><rect x="96" y="50" width="14" height="32"/><rect x="134" y="38" width="20" height="44"/></g>'
    +i7tree(14,82,42,I7FALL)+i7tree(146,82,46,I7FALL)+'<path d="M0 79Q40 77 80 79T160 79V100H0Z" fill="'+P.ground+'"/><path d="M0 79H160" stroke="'+P.ground2+'" stroke-width="2"/>'+i7leaves(34,9,2,82,158,98,1.4)+i7leaves(12,4,0,6,160,74,1.3)}
  s+='<g stroke="#1b1e26" stroke-width="3.2" stroke-linecap="round"><path d="M44 81V40M84 81V40M124 81V52M42 41h44M84 53h42"/></g><g stroke="#c8e600" stroke-width="2"><path d="M44 81V64M84 81V64M124 81V68"/></g>';
  if(sea==='winter')s+='<g fill="#fff"><rect x="40" y="37.5" width="48" height="3" rx="1.5"/><rect x="82" y="49.5" width="46" height="3" rx="1.5"/></g>';
  if(o.who)s+=i7sceneWho('street',o.fam||'pull',o.rep);
  return '<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" data-sea="'+sea+'"><defs>'+d+'</defs>'+s+'</svg>'}
/* v7.2 : groupe du perso (respiration) ; v7.3 : rep = 1 prépare une répétition jouée au toucher (data-rd = durée en s) */
function i7sceneWho(place,fam,rep){const pull=fam==='pull'||fam==='cheer'||!I7POSE[fam],ps=pull?'pullB':I7POSE[fam],d=place==='salle'?1.4:(I7ALT[ps]||[0,1.4])[1];return '<g class="who7" data-ex="'+(place==='salle'?(myChar({}).sp==='femme'?'hip':'bench'):pull?'pull':fam)+'"'+(rep?' data-rd="'+d+'"':'')+'>'+i7sceneWho0(place,fam,rep)+'</g>'}
function i7sceneWho0(place,fam,rep){const sea=place==='street'?undefined:'',pull=fam==='pull'||fam==='cheer'||!I7POSE[fam],ps=pull?'pullB':I7POSE[fam],o=x=>Object.assign(x||{},rep&&I7ALT[ps]?{alt:I7ALT[ps][0],dur:I7ALT[ps][1]}:{});
  if(place==='garage')return pull?i7who('pullB',66,12.2,26,o({sea})):i7who(ps,94,77-(fam==='push'?230:fam==='sq'?241:260)*.2,40,o({sea}));
  if(place==='salle')return i7bench(82,60,1.5,77,rep); /* à la salle : développé couché (hip thrust pour le perso « Femme ») */
  return pull?i7who('pullB',44,28,40,o()):i7who(ps,88,81-(fam==='push'?230:fam==='sq'?241:260)*.2,40,o())}
/* ---- petite scène portrait 48 x 88 (cases du calendrier) ---- */
function i7tileSvg(kind,sea,place,fam){const P=ILL7[sea],id='t7'+sea.slice(0,2);let d=i7grad(id+'k',P.sky2[0],P.sky2[1]),s='',top='';
  const indoor=kind==='train'&&place!=='street';
  if(indoor){if(place==='garage'){d+=i7grad(id+'g','#3a4150','#59627a');const v=i7view(sea,[[5,31,38,43]],id+'v');d+=v[0];s='<rect width="48" height="88" fill="url(#'+id+'g)"/>'+v[1]+'<rect x="5" y="20" width="38" height="11" rx="1.5" fill="#6b7486"/><path d="M5 24h38M5 28h38" stroke="#4a5262" stroke-width="1.4"/><rect x="5" y="30.4" width="38" height="1.6" fill="#3e4554"/><path d="M14 0h20l12 70H2z" fill="#ffe9a8" opacity=".1"/><rect y="74" width="48" height="14" fill="#8c8f96"/><path d="M0 84h48" stroke="#f2b705" stroke-width="1.6" stroke-dasharray="5 4"/>'}
    else{d+=i7grad(id+'g','#232327','#38383e');const v=i7view(sea,[[4,27,40,38]],id+'v');d+=v[0];s='<rect width="48" height="88" fill="url(#'+id+'g)"/><rect y="18" width="48" height="4" fill="#ff7800"/>'+v[1]+'<g fill="none" stroke="#121214" stroke-width="1.6"><rect x="4" y="27" width="40" height="38"/><path d="M24 27v38M4 46h40"/></g><rect y="74" width="48" height="14" fill="#2b2b30"/><path d="M0 81h48M16 74v14M32 74v14" stroke="#3a3a40" stroke-width=".8"/><rect y="74" width="48" height="1.2" fill="#ff7800"/>'}}
  else{s='<rect width="48" height="88" fill="url(#'+id+'k)"/>';
    if(sea==='winter')s+=i7flakes(16,kind==='rest'?3:7,2,3,46,62)+'<path d="M0 60Q12 53 24 58T48 56V88H0Z" fill="'+P.snow2+'"/>';
    else if(sea==='spring')s+=i7cloud(31,14,.75)+'<path d="M0 62Q14 54 28 60T48 57V88H0Z" fill="'+P.hill+'"/>';
    else if(sea==='summer'){d+=i7grad(id+'m',P.sea[0],P.sea[1]);s+=(kind==='rest'?i7sun(39,11,4.6,1):'')+'<rect y="'+(kind==='rest'?47:55)+'" width="48" height="16" fill="url(#'+id+'m)"/><path d="M5 '+(kind==='rest'?52:60)+'q3-2 6 0t6 0M27 '+(kind==='rest'?57:65)+'q3-2 6 0t6 0" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".75"/>'}
    else s+='<circle cx="12" cy="46" r="7" fill="#ffe6b0" opacity=".8"/><path d="M0 62Q14 56 26 60T48 58V88H0Z" fill="#b7703f" opacity=".55"/>'}
  if(kind==='train'){
    if(!indoor){if(sea==='winter')s+=i7fir(41,76,30,1)+i7fir(6,75,17,1);else if(sea==='spring')s+=i7tree(42,77,36,I7APPLE);else if(sea==='summer')s+=i7palm(44,76,40,1);else s+=i7tree(41,77,36,I7FALL);
      const g=sea==='winter'?'<path d="M0 74Q10 71 20 74T40 73T48 74V88H0Z" fill="'+P.snow+'"/><path d="M0 81Q14 78 28 81T48 80" fill="none" stroke="'+P.snow2+'" stroke-width="1.2"/>'
        :sea==='spring'?'<rect y="74" width="48" height="14" fill="'+P.grass+'"/><path d="M0 74Q12 72 24 74T48 74V76H0Z" fill="'+P.grass2+'" opacity=".55"/>'+i7flowers(5,13,2,79,46,87)+i7tulips(4,6,3,45,86,.9)
        :sea==='summer'?'<path d="M0 70Q12 68 24 70T48 70V88H0Z" fill="'+P.sand+'"/>'+i7scat(12,5,2,73,46,87,(x,y)=>'<circle cx="'+i7(x)+'" cy="'+i7(y)+'" r=".5" fill="'+P.sand2+'"/>')
        :'<rect y="74" width="48" height="14" fill="'+P.ground+'"/>'+i7leaves(14,9,1,76,47,87,.9);s+=g}
    if(indoor&&place==='salle')top=i7bench(24,58,1,74);
    else if(fam==='pull'||fam==='cheer'||!I7POSE[fam]){s+='<g stroke="#1b1e26" stroke-width="2.6" stroke-linecap="round"><path d="M4.6 33V77M43.4 33V77M4.6 33H43.4"/></g><g stroke="#c8e600" stroke-width="1.6"><path d="M4.6 77V68M43.4 77V68"/></g>';
      top=i7who('pullB',4,21,40,indoor?{sea:''}:{});if(sea==='winter'&&!indoor)top+='<rect x="3.2" y="31" width="7" height="2" rx="1" fill="#fff"/><rect x="37.8" y="31" width="7" height="2" rx="1" fill="#fff"/>'}
    else{const b=fam==='push'?226:fam==='sq'?241:260,w=fam==='push'?44:40;top=i7who(I7POSE[fam],24-w/2,77-b*w/200,w,indoor?{sea:''}:{})}
    if(!indoor)top+=sea==='winter'?i7flakes(6,9,2,40,46,72):sea==='spring'?i7petals(3,8,2,38,46,70)+i7fly(37,44,1,'#ffc53d'):sea==='autumn'?i7leaves(5,6,2,36,46,70,.9):'';
    s+=top}
  else{/* repos : le perso dort, le décor raconte la saison */
    const sl={ex:'sleep'};
    if(sea==='summer'){s+=i7parasol(25,33,16,30,79)+'<path d="M0 58Q12 56 24 58T48 58V88H0Z" fill="'+P.sand+'"/>'+i7scat(10,8,2,62,46,87,(x,y)=>'<circle cx="'+i7(x)+'" cy="'+i7(y)+'" r=".5" fill="'+P.sand2+'"/>')
        +'<g stroke="#b8865a" stroke-width="1.3" stroke-linecap="round"><path d="M7 58l4 21M41 75l2 6M13 72l-1 8"/></g><path d="M3.5 56.5L7.5 53.5L46 76L43 79.5Z" fill="#2ec5df"/><path d="M5 55.5l4-3M13 60.2l4-3M21 65l4-3M29 69.7l4-3M37 74.4l4-3" stroke="#fff" stroke-width="1.6" opacity=".9"/>'
        +i7who('idle',5,47.2,40,Object.assign({rot:-61},sl))+i7zzz(14,47,3)}
    else if(sea==='spring'){s+=i7tree(34,72,56,I7APPLE)+'<rect y="68" width="48" height="20" fill="'+P.grass+'"/><path d="M0 68Q12 66 24 68T48 68V70H0Z" fill="'+P.grass2+'" opacity=".55"/>'+i7tulips(4,17,3,46,87,.95)
        +i7picnic(3,69,42,12)+i7basket(40,72,1)+'<ellipse cx="8.5" cy="74.5" rx="5.5" ry="2.4" fill="#fff3c4"/>'+i7who('idle',3,54,40,Object.assign({rot:-90},sl))+i7fly(12,40,1.1,'#ffc53d')+i7petals(4,14,2,30,46,60)+i7zzz(7,64,3)}
    else if(sea==='autumn'){s+=i7tree(33,74,58,I7FALL)+'<rect y="70" width="48" height="18" fill="'+P.ground+'"/>'+i7leaves(12,23,1,74,47,87,.9)
        +'<ellipse cx="9" cy="75.5" rx="7" ry="3" fill="#f3e3c4"/>'+i7who('idle',4,51.5,40,Object.assign({rot:-90},sl))
        +'<rect x="13" y="65.5" width="33" height="12.5" rx="4" fill="#c2412d"/><path d="M19 65.5v12.5M27 65.5v12.5M35 65.5v12.5M13 71.5h33" stroke="#8f2d1f" stroke-width="1.4"/><path d="M23 65.5v12.5M31 65.5v12.5M39 65.5v12.5" stroke="#f0c27a" stroke-width=".6"/><rect x="13" y="65.5" width="4" height="12.5" rx="2" fill="#e05a3f"/>'
        +i7leaves(4,31,20,66,44,70,1)+i7leaves(7,12,2,30,46,62,.9)+i7zzz(8,58,3)}
    else{s+=i7fir(7,66,24,1)+i7snowman(36,66,1)+'<path d="M0 64Q12 61 24 64T48 63V88H0Z" fill="'+P.snow+'"/><path d="M0 73Q14 70 28 73T48 72" fill="none" stroke="'+P.snow2+'" stroke-width="1.2"/>'
        +i7who('idle',4,56.5,40,Object.assign({rot:-90},sl))+'<rect x="13" y="71" width="33" height="12" rx="6" fill="#3d6fb6"/><path d="M21 71v12M29 71v12M37 71v12" stroke="#2c5592" stroke-width="1.1"/><rect x="13" y="71" width="5" height="12" rx="2.5" fill="#5a8fd8"/>'
        +i7flakes(12,4,2,4,46,60)+i7zzz(8,64,3)}}
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 88" preserveAspectRatio="xMidYMid slice"><defs>'+d+'</defs>'+s+'</svg>'}
const I7C=new Map();
function illTile(kind,o){o=o||{};const sea=seaNow(),place=kind==='train'?(o.place||'street'):'',fam=kind==='train'?(o.fam||'pull'):'',key=[sea,kind,place,fam,JSON.stringify(myChar({}))].join('|');let u=I7C.get(key);
  if(!u){u='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(i7tileSvg(kind,sea,place,fam));if(I7C.size>80)I7C.clear();I7C.set(key,u)}
  return '<img class="ill7" src="'+u+'" alt="" draggable="false" data-sea="'+sea+'" data-ill="'+kind+(place?'-'+place:'')+'">'}
/* scène d'une journée : séance → entraînement ; repos → repos ; jour vide → rien */
function illDay(k){const ss=sOf(k);if(ss.length){const pl=ss[0].place||'street';return illTile('train',{place:pl,fam:i7fam(ss,pl)})}return isRest(k)?illTile('rest'):''}

/* ---- paysage du bas de page (au-dessus de la barre d'onglets) et sol du perso de l'accueil ---- */
function i7bandSvg(sea){const P=ILL7[sea];let d='',s='';
  if(sea==='winter')s='<path d="M0 52Q60 36 130 48T260 44T400 46V90H0Z" fill="'+P.snow2+'"/>'+i7fir(34,70,34,1)+i7fir(58,72,24,1)+i7fir(318,70,30,1)+i7snowman(366,76,1.25)+'<path d="M0 66Q80 58 160 66T320 64T400 66V90H0Z" fill="'+P.snow+'"/>'+i7flakes(24,3,0,4,400,60,1.4);
  else if(sea==='spring')s='<path d="M0 54Q70 36 150 50T300 44T400 48V90H0Z" fill="'+P.hill+'"/>'+i7tree(42,72,40,I7BLOOM)+i7tree(84,72,30,I7GREEN)+i7tree(312,70,36,I7APPLE)+i7tree(352,72,28,I7GREEN)+'<path d="M0 66Q90 58 180 66T360 64T400 66V90H0Z" fill="'+P.grass+'"/>'+i7flowers(16,9,4,72,396,88,1.4)+i7tulips(14,5,120,290,84,1.5)+i7fly(200,30,1.6,'#ffc53d')+i7fly(268,46,1.3,'#7ec8ff')+i7petals(8,4,0,4,400,60,1.3);
  else if(sea==='summer'){d=i7grad('b7m',P.sea[0],P.sea[1]);s='<rect y="40" width="400" height="26" fill="url(#b7m)"/><g fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"><path d="M30 50q6-3 12 0t12 0M150 56q6-3 12 0t12 0M250 48q6-3 12 0t12 0M330 58q6-3 12 0t12 0"/></g>'
    +'<path d="M196 50l11-22 1 22z" fill="#fff"/><path d="M208 30l11 18h-10z" fill="#ff6b5b"/><path d="M192 51h29l-4 5h-21z" fill="#2f4458"/><path d="M0 64Q100 60 200 64T400 63V90H0Z" fill="'+P.sand+'"/>'+i7scat(30,6,4,68,396,88,(x,y)=>'<circle cx="'+i7(x)+'" cy="'+i7(y)+'" r=".8" fill="'+P.sand2+'"/>')+i7parasol(66,58,16,70,86)+i7palm(352,76,56,1)}
  else s='<path d="M0 52Q70 38 150 50T300 44T400 48V90H0Z" fill="#b7703f" opacity=".75"/>'+i7tree(40,72,38,I7FALL)+i7tree(88,72,28,I7FALL)+i7tree(330,70,36,I7FALL)+'<path d="M0 66Q90 60 180 66T360 64T400 66V90H0Z" fill="'+P.ground+'"/>'+i7leaves(34,7,4,70,396,88,1.4)+i7leaves(12,3,0,4,400,60,1.3);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 90" preserveAspectRatio="xMidYMax slice"><defs>'+d+'</defs>'+s+'</svg>'}
function i7groundSvg(sea){const P=ILL7[sea];let d='',s='';
  if(sea==='winter')s=i7fir(83,77,30,1)+i7fir(16,79,18,1)+'<path d="M0 74Q25 67 50 72T100 70V100H0Z" fill="'+P.snow+'"/><path d="M0 84Q30 79 60 84T100 83" fill="none" stroke="'+P.snow2+'" stroke-width="1.6"/>'+i7flakes(12,5,6,6,94,62,1.6);
  else if(sea==='spring')s=i7tree(84,77,32,I7APPLE)+'<path d="M0 74Q25 68 50 73T100 71V100H0Z" fill="'+P.grass+'"/>'+i7flowers(6,9,4,80,96,96,1.6)+i7tulips(5,3,8,92,94,1.5)+i7fly(18,36,1.6,'#ffc53d')+i7petals(4,3,8,10,92,62,1.6);
  else if(sea==='summer'){d=i7grad('g7m',P.sea[0],P.sea[1]);s='<rect y="62" width="100" height="14" fill="url(#g7m)"/><path d="M0 74Q25 71 50 74T100 73V100H0Z" fill="'+P.sand+'"/>'+i7parasol(83,60,12,86,90)+i7scat(10,4,6,78,94,96,(x,y)=>'<circle cx="'+i7(x)+'" cy="'+i7(y)+'" r=".9" fill="'+P.sand2+'"/>')}
  else s=i7tree(84,77,32,I7FALL)+'<path d="M0 74Q25 68 50 73T100 71V100H0Z" fill="'+P.ground+'"/>'+i7leaves(16,9,4,77,96,96,1.6)+i7leaves(6,3,8,10,92,62,1.6);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>'+d+'</defs>'+s+'</svg>'}
function illGround(){const sea=seaNow(),key='g|'+sea;let u=I7C.get(key);if(!u){u='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(i7groundSvg(sea));I7C.set(key,u)}return '<img src="'+u+'" alt="" draggable="false" data-sea="'+sea+'">'}
/* ---- v7.2 : petits détails de saison dans les cases vides du calendrier ----
   Un « sol » discret au bas de la case (neige, herbe, sable, terre et feuilles), parfois un détail
   (flocons, bonhomme de neige, fleur, papillon, coquillage, étoile de mer, gland, champignon).
   Variante fixe pour une date donnée (pas de clignotement), seulement avec un thème de saison. */
function i7decoSvg(sea,v){const P=ILL7[sea];let s='';
  if(sea==='winter'){s='<path d="M0 78Q7 73.5 15 76.5T31 75.5T48 77V88H0Z" fill="'+P.snow+'"/><path d="M0 82.5Q12 80 24 82.5T48 82" fill="none" stroke="'+P.snow2+'" stroke-width="1.1"/>';
    if(v===0||v===3)s+=i7flakes(v===3?4:3,11+v,5,26,43,64,1.9);if(v===5)s+=i7flakes(2,5,24,34,42,58,2.1);if(v===2)s=i7snowman(37,80.5,.82)+s;if(v===4)s=i7fir(10,79.5,24,1)+s}
  else if(sea==='spring'){s='<path d="M0 79Q8 76.5 16 78.5T32 78T48 78.8V88H0Z" fill="'+P.grass+'"/><path d="M3 79.5l1.4-4.5 1.4 4.5M9 79l1.6-5 1.4 5M28 78.6l1.2-4 1.2 4M44 79l1.2-4 1.3 4" fill="'+P.grass2+'"/>';
    const fl=(x,h,c)=>'<path d="M'+x+' 79V'+(79-h)+'" stroke="#3f9a4b" stroke-width="1"/><path d="M'+x+' '+(79-h*.45)+'q2.2-.6 2.8-2.4q-2 .2-2.8 2.4z" fill="#58b85a"/>'+[0,72,144,216,288].map(a=>'<circle cx="'+i7(x+Math.cos(a*Math.PI/180)*1.9)+'" cy="'+i7(79-h+Math.sin(a*Math.PI/180)*1.9)+'" r="1.45" fill="'+c+'"/>').join('')+'<circle cx="'+x+'" cy="'+(79-h)+'" r="1.1" fill="#ffd23f"/>';
    if(v===0)s+=fl(35,9,'#ff8fbf')+fl(42,6.5,'#ffc53d');if(v===1)s=i7bush(12,80,1.25,'#ff8fbf')+s+i7tulip(39,79.5,1.25,'#e5484d');if(v===2)s=i7tree(12,79.5,25,I7BLOOM)+s;if(v===3)s+=fl(40,8,'#ff8fbf')+i7petals(2,4,26,36,42,56,2);if(v===4)s=i7tree(38,79.5,24,I7APPLE)+s+fl(13,6,'#ff8fbf');if(v===5)s+=i7fly(37,56,1.9,'#ffc53d')+fl(13,6,'#ff8fbf')}
  else if(sea==='summer'){s='<path d="M0 76.5Q6 74.5 12 76.5T24 76.5T36 76.5T48 76.5" fill="none" stroke="'+P.sea[0]+'" stroke-width="1.6" stroke-linecap="round"/><path d="M0 79.5Q12 77.6 24 79.5T48 79V88H0Z" fill="'+P.sand+'"/>'+i7scat(6,7+v,3,82,45,87,(x,y)=>'<circle cx="'+i7(x)+'" cy="'+i7(y)+'" r=".6" fill="'+P.sand2+'"/>');
    if(v===1||v===4)s+='<path d="M35 84.6a4.6 4.6 0 0 1 9.2 0z" fill="#ffb199"/><path d="M36.8 84.6l2.3-4.1M39.6 84.6v-4.5M42.4 84.6l-2.3-4.1" stroke="#e8836b" stroke-width=".7"/>';
    if(v===2)s+='<path d="M39.5 77.6l1.4 3.1 3.4.4-2.5 2.3.7 3.4-3-1.7-3 1.7.7-3.4-2.5-2.3 3.4-.4z" fill="#ff8a3d"/><circle cx="39.5" cy="81.9" r=".6" fill="#ffd0a8"/>';if(v===5)s+='<ellipse cx="37" cy="84.6" rx="2.4" ry="1.5" fill="#c9b79a"/><ellipse cx="42.5" cy="85.4" rx="1.7" ry="1.1" fill="#b9a585"/>'}
  else{s='<path d="M0 80Q12 78 24 80T48 79.4V88H0Z" fill="#8a5a3a"/><path d="M0 80Q12 78 24 80T48 79.4" fill="none" stroke="#b07a4f" stroke-width="1"/>';
    const lf=(x,y,r,c,k)=>{k=k||1;return '<g transform="rotate('+r+' '+x+' '+y+')"><path d="M'+(x-3.4*k)+' '+y+'Q'+x+' '+(y-2.8*k)+' '+(x+3.4*k)+' '+y+'Q'+x+' '+(y+2.8*k)+' '+(x-3.4*k)+' '+y+'Z" fill="'+c+'"/><path d="M'+(x-3.4*k)+' '+y+'H'+(x+3.4*k)+'" stroke="rgba(0,0,0,.25)" stroke-width=".5"/></g>'};
    if(v===0||v===2)s+=lf(33,82.5,-20,'#e8792a')+lf(41,83.8,35,'#d9482b')+(v===2?lf(11,84,10,'#f2b33d'):'');if(v===1)s+=lf(39,83,15,'#f2b33d')+lf(34,56,55,'#e8792a',.9);if(v===5)s+=lf(38,83,-10,'#d9482b');
    if(v===3)s+='<ellipse cx="39" cy="82.6" rx="2.5" ry="3.1" fill="#c48a48"/><path d="M36.2 81.2a2.8 2.1 0 0 1 5.6 0z" fill="#6b4630"/><path d="M39 79.1v-1.4" stroke="#6b4630" stroke-width=".8"/>';
    if(v===4)s+='<rect x="38" y="79.6" width="2.2" height="4.4" rx="1" fill="#f3e3c4"/><path d="M34.7 80.2a4.4 3.6 0 0 1 8.8 0z" fill="#d9482b"/><circle cx="37.6" cy="78.4" r=".7" fill="#fff"/><circle cx="40.8" cy="78.9" r=".6" fill="#fff"/>'}
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 88" preserveAspectRatio="xMidYMax slice">'+s+'</svg>'}
function illDeco(k){if(!(curTh()||{}).season)return '';const sea=seaNow(),d=parse(k),v=(d.getFullYear()*7+d.getMonth()*13+d.getDate()*5)%6,key='d|'+sea+'|'+v;let u=I7C.get(key);
  if(!u){u='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(i7decoSvg(sea,v));I7C.set(key,u)}
  return '<img class="dco8" src="'+u+'" alt="" draggable="false" data-sea="'+sea+'">'}
