/* ===================== v7.4 : plateforme (iPhone, Android), mode installé, comportement d'appli =====================
   PLAT.ios / PLAT.and : système ; PLAT.br : navigateur (safari, chrome, firefox, edge, samsung, opera, desktop) ;
   PLAT.inapp : navigateur intégré à une autre appli (Instagram, Facebook, TikTok…), qui ne permet pas d'installer. */
const UA=navigator.userAgent||'';
const PLAT=(()=>{const ios=isIOS,and=!ios&&/Android/i.test(UA),inapp=/FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|Snapchat|musical_ly|BytedanceWebview|TikTok|Line\/|Pinterest|; wv\)/.test(UA)||(ios&&/GSA\//.test(UA)),
  br=ios?(/CriOS/.test(UA)?'chrome':/FxiOS/.test(UA)?'firefox':/EdgiOS/.test(UA)?'edge':/OPiOS|OPT\//.test(UA)?'opera':'safari'):and?(/SamsungBrowser/.test(UA)?'samsung':/Firefox/.test(UA)?'firefox':/EdgA/.test(UA)?'edge':/OPR|Opera/.test(UA)?'opera':'chrome'):'desktop';
  return {ios,and,inapp,br,mobile:ios||and}})();
function isStandalone(){try{return !!(navigator.standalone||matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||matchMedia('(display-mode: minimal-ui)').matches)}catch(e){return false}}
/* textes qui dépendent du téléphone : jamais « iPhone » sur Android */
const browserN=()=>PLAT.ios?(PLAT.br==='safari'?'Safari':PLAT.br==='chrome'?'Chrome':PLAT.br==='firefox'?'Firefox':PLAT.br==='edge'?'Edge':'Safari'):PLAT.and?(PLAT.br==='samsung'?'Samsung Internet':PLAT.br==='firefox'?'Firefox':PLAT.br==='edge'?'Edge':'Chrome'):'ton navigateur';
document.documentElement.classList.add(PLAT.ios?'ios':PLAT.and?'android':'desk');
/* comme une appli : pas de menu « Copier, Chercher… » ni de menu d'image au long appui (Android), sauf dans les champs */
document.addEventListener('contextmenu',e=>{if(!e.target.closest('input,textarea,select,[contenteditable="true"],.code'))e.preventDefault()});
/* bouton Retour d'Android (et glisser depuis le bord sur iPhone, dans le navigateur) : ferme d'abord ce qui est ouvert, comme une appli.
   Ordre : écran du minuteur (réduit en mini-lecteur, jamais arrêté), puis feuilles. Une entrée d'historique par couche ouverte ;
   fermée par l'appli → on retire l'entrée (skip évite de refermer la suivante). */
(()=>{let depth=0,skip=0,noPop=false;const L7=[['tmo',e=>!e.hidden,()=>tmShow(false)],['gsheet',e=>e.classList.contains('open'),()=>closeSheet()],['sheet',e=>e.classList.contains('open'),()=>close()]];
  const openN=()=>L7.filter(([id,f])=>{const e=$(id);return e&&f(e)}).length;
  const sync=()=>{const n=openN();while(depth<n){history.pushState({sh7:1},'');depth++}if(n<depth&&!noPop&&history.state&&history.state.sh7){const k=depth-n;depth=n;skip++;history.go(-k)}else if(n<depth)depth=n};
  /* un lien (onglet…) qui ferme une couche en changeant de page : ne pas revenir en arrière, sinon on annulerait la navigation */
  document.addEventListener('click',e=>{if(e.target.closest('a[href^="#"]')){noPop=true;setTimeout(()=>{noPop=false},0)}},true);
  const mo=new MutationObserver(sync);L7.forEach(([id])=>{const e=$(id);if(e)mo.observe(e,{attributes:true,attributeFilter:['class','hidden']})});
  addEventListener('popstate',()=>{if(skip){skip--;return}if(!depth)return;depth--;const t=L7.find(([id,f])=>{const e=$(id);return e&&f(e)});if(t)t[2]()})})();
