/* ===================== v6 : icône de l'appli, avatar, photo ===================== */
const lvlNow=()=>lvlOf(xpTot());
const accUnlocked=()=>CH_ACC.filter(a=>lvlNow()>=a[2]).map(a=>a[0]);
const spUnl=k=>!!CH_SP[k]&&(!CH_SP[k].lock||rwHas('char:'+k));
/* D10 : le perso se muscle avec la série de semaines (4 puis 12, comme les badges) ; D1 : tenue selon le thème de saison */
const musLvl=()=>{const w=wStreak();return w>=12?2:w>=4?1:0};
const seaOf=()=>{const s=seaNow();return s==='winter'?'hiver':s==='summer'?'ete':''}; /* tenue de saison : suit la saison active (56_ill7.js) */
function charOf(sp,extra){sp=CH_SP[sp]?sp:'homme';const d=CH_SP[sp].def,c=obj(S.char),col=obj(c.col),pal=CH_SP[sp].pal,np=pal==='skin'?6:pal.length,ci=col[sp];
  const o={sp,acc:curAcc(),c:Number.isInteger(ci)&&ci>=0&&ci<np?ci:d.c,hs:c.hs||d.hs||'court',hc:c.hc||d.hc||'brun',sh:CH_SHIRT[c.sh]!==undefined?c.sh:'',ac:arr(c.ac).filter(a=>accUnlocked().includes(a)),mus:musLvl(),sea:seaOf()};
  if(sp==='femme'&&!c.hs)o.hs='queue';if(sp==='femme'&&!c.hc)o.hc='chatain';
  return Object.assign(o,extra||{})}
const myChar=extra=>charOf(S.icon,extra);
const iconSvg=k=>charSvg(k===S.icon||!k?myChar({pose:'icon',bg:1}):charOf(k,{pose:'icon',bg:1,ac:[],sh:''}));
const myIconHtml=()=>S.useP&&S.photo?'<img class="phi" src="'+S.photo+'" alt="">':iconSvg(S.icon);
function iconDoc(k){if(S.useP&&S.photo)return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200"><image href="'+S.photo+'" xlink:href="'+S.photo+'" width="200" height="200" preserveAspectRatio="xMidYMid slice"/></svg>';return iconSvg(k||S.icon)}
const iconTiles=()=>CH_ORDER.map(k=>{const ok=spUnl(k);return '<button type="button" class="ict'+(ok?'':' lk')+'" data-icon="'+k+'" aria-pressed="'+(!S.useP&&S.icon===k)+'"'+(ok?'':' aria-disabled="true"')+'><span class="itile">'+iconSvg(k)+(ok?'':'<i class="lki">'+ico('lock')+'</i>')+'</span><span>'+esc(CH_SP[k].n)+'</span></button>'}).join('')+(S.photo?'<button type="button" class="ict" data-icon="photo" aria-pressed="'+S.useP+'"><span class="itile"><img class="phi" src="'+S.photo+'" alt=""></span><span>Ma photo</span></button>':'');
/* image PNG d'une icône (canvas) */
async function iconPng(size){const im=await svgImg(iconDoc(S.icon));if(!im)return '';const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');g.drawImage(im,0,0,size,size);try{return c.toDataURL('image/png')}catch(e){return ''}}
const isDefIcon=()=>!S.useP&&!S.char.sh&&!arr(S.char.ac).length&&!obj(S.char.col)[S.icon]&&!S.char.hs&&!S.char.hc&&!S.accX&&S.th==='nuit';
let iconTok=0;
async function applyIcon(){const k=CH_SP[S.icon]?S.icon:'homme',h=$('hLogo'),html=myIconHtml();if(h)h.innerHTML=html;document.querySelectorAll('#splash .lg').forEach(e=>e.innerHTML=html);
  const ml=document.querySelector('link[rel=manifest]');if(ml)ml.setAttribute('href','manifest-'+k+'.webmanifest');
  const setL=u=>document.querySelectorAll('link[rel="apple-touch-icon"]').forEach(l=>l.setAttribute('href',u));
  try{localStorage.setItem('carnet-icon',k)}catch(e){}
  if(isDefIcon()){setL('icon-'+k+'-180.png');try{localStorage.removeItem('carnet-ati')}catch(e){}return}
  const tok=++iconTok,u=await iconPng(180);if(tok!==iconTok)return;if(u){setL(u);try{localStorage.setItem('carnet-ati',u)}catch(e){}}else setL('icon-'+k+'-180.png')}
/* ---- photo perso : recadrage carré ---- */
function photoPick(){const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>{const f=i.files&&i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>photoCrop(r.result);r.readAsDataURL(f)};i.click()}
function photoCrop(src){const im=new Image();im.onload=()=>{let z=1,ox=0,oy=0;const V=260;
  openSheet('<h3>Ta photo</h3><p class="findsub">Glisse pour centrer, règle le zoom.</p><div class="pcrop"><canvas id="pcC" width="'+V*2+'" height="'+V*2+'"></canvas></div><label class="pzoom">'+ico('photo')+'<input type="range" id="pcZ" min="1" max="3" step="0.01" value="1" aria-label="Zoom"></label><div class="acts"><button type="button" class="btn ghost" id="gClose">Annuler</button><button type="button" class="btn" id="pcOk">Utiliser cette photo</button></div>');
  const c=$('pcC'),g=c.getContext('2d'),base=Math.max(V*2/im.width,V*2/im.height);
  const draw=()=>{const s=base*z,w=im.width*s,h=im.height*s;ox=Math.min(0,Math.max(V*2-w,ox));oy=Math.min(0,Math.max(V*2-h,oy));g.clearRect(0,0,V*2,V*2);g.drawImage(im,ox,oy,w,h)};
  ox=(V*2-im.width*base)/2;oy=(V*2-im.height*base)/2;draw();
  $('pcZ').addEventListener('input',e=>{const cx=V-ox,cy=V-oy,old=z;z=+e.target.value;ox=V-cx*z/old;oy=V-cy*z/old;draw()});
  let p0=null;c.addEventListener('pointerdown',e=>{p0=[e.clientX,e.clientY,ox,oy];c.setPointerCapture(e.pointerId)});c.addEventListener('pointermove',e=>{if(!p0)return;ox=p0[2]+(e.clientX-p0[0])*2;oy=p0[3]+(e.clientY-p0[1])*2;draw()});c.addEventListener('pointerup',()=>{p0=null});
  $('pcOk').addEventListener('click',()=>{const o=document.createElement('canvas');o.width=o.height=256;o.getContext('2d').drawImage(c,0,0,256,256);S.photo=o.toDataURL('image/jpeg',.86);S.useP=true;save();applyIcon();closeSheet();if(typeof renderSet6==='function')renderSet6();toast('Photo enregistrée ✓')})};
  im.onerror=()=>toast('Impossible de lire cette image');im.src=src}
