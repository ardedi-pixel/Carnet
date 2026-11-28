/* ===================== v6 : langues (FR / EN / NL) ===================== */
/* Le code écrit en français ; à l'affichage, chaque texte est traduit par le dictionnaire
   (clé = texte français dont les nombres, le prénom, les mois et les jours sont remplacés par des jetons). */
const DICT=(typeof DICT_EN!=='undefined'?{en:DICT_EN,nl:DICT_NL}:{});
function DOWI(){return ({fr:'LMMJVSD',en:'MTWTFSS',nl:'MDWDVZZ'})[S.lang]||'LMMJVSD'}
let dnCache={};
function dateNames(loc){if(dnCache[loc])return dnCache[loc];const L=[];for(let m=0;m<12;m++){const d=new Date(2026,m,15);L.push(['M',d.toLocaleDateString(loc,{month:'long'})]);L.push(['M',d.toLocaleDateString(loc,{month:'short'}).replace('.','')])}
  for(let i=0;i<7;i++){const d=new Date(2026,10,16+i);L.push(['D',d.toLocaleDateString(loc,{weekday:'long'})]);L.push(['D',d.toLocaleDateString(loc,{weekday:'short'}).replace('.','')])}
  const u=[];L.forEach(x=>{if(x[1]&&x[1].length>=3&&!u.some(y=>y[1].toLowerCase()===x[1].toLowerCase()))u.push(x)});u.sort((a,b)=>b[1].length-a[1].length);return dnCache[loc]=u}
const reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function shape(t,loc,nn){const tok={N:[],M:[],D:[]},vals=[];let k=t;const n=nn?'':shownName();if(n&&n.length>1&&k.includes(n)){k=k.split(n).join('\u0001N\u0001');tok.N.push(n)}
  dateNames(loc||LOC()).forEach(([ty,nm])=>{const re=new RegExp('(^|[^\\p{L}])('+reEsc(nm)+')(?![\\p{L}])','giu');k=k.replace(re,(m,a,b)=>{tok[ty].push(b);return a+'\u0001'+ty+'\u0001'})});
  k=k.replace(/\d+(?:[.,]\d+)?/g,m=>{vals.push(m);return '{'+(vals.length-1)+'}'});
  let ci={N:0,M:0,D:0};k=k.replace(/\u0001([NMD])\u0001/g,(m,ty)=>'{'+ty+(ci[ty]++)+'}');return [k,vals,tok]}
function fillT(v,vals,tok){return v.replace(/\{(\d+)\}/g,(m,i)=>vals[+i]!==undefined?vals[+i]:m).replace(/\{([NMD])(\d+)\}/g,(m,ty,i)=>tok[ty][+i]!==undefined?tok[ty][+i]:m)}
let DNE={};
function dictNE(){const L=S.lang;if(DNE[L])return DNE[L];const D=DICT[L],o={};for(const k in D){const nk=noEmo(k);if(nk!==k&&!(nk in D))o[nk]=noEmo(D[k])}return DNE[L]=o}
/* v7.6 : traduction plus sûre et centralisée
   1. texte exact ; 2. clé « mise en forme » (nombres {0}, prénom {N0}, mois {M0}, jours {D0}), avec puis sans le prénom
      (un texte qui contient « Diego » ne dépend plus du prénom de la personne) ;
   3. modèles à trou {*} : « Pyramide « {*} » prête » traduit la phrase et, à part, ce qui remplit le trou
      (nom d'exercice traduit s'il est connu, texte de l'utilisateur laissé tel quel). Fini les phrases à moitié traduites.
   Les résultats sont gardés en mémoire (même texte = même traduction, sans refaire le travail). */
let TRC={},WLD={};
function wildK(L){if(WLD[L])return WLD[L];const D=DICT[L]||{},o=[];for(const k in D)if(k.includes('{*}'))o.push([new RegExp('^'+reEsc(k).split('\\{\\*\\}').join('([\\s\\S]+?)')+'$'),D[k],k]);o.sort((a,b)=>b[2].length-a[2].length);return WLD[L]=o}
function trK(D,k){let v=D[k];if(v===undefined&&!S.emo)v=dictNE()[k];return v}
function trS0(t,D,dp){const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(t),core=m[2];if(!core)return t;
  let v=trK(D,core);if(v!==undefined)return m[1]+v+m[3];if(!/\d|\p{L}{3}/u.test(core))return t;
  const sh=shape(core);if(sh[0]!==core){v=trK(D,sh[0]);if(v!==undefined)return m[1]+fillT(v,sh[1],sh[2])+m[3]}
  if(sh[2].N.length){const s2=shape(core,undefined,1);v=trK(D,s2[0]);if(v!==undefined)return m[1]+fillT(v,s2[1],s2[2])+m[3]}
  if(dp<3&&core.length<500)for(const [re,val] of wildK(S.lang)){const mm=re.exec(sh[0]);if(!mm)continue;
    const caps=mm.slice(1).map(g=>trCap(fillT(g,sh[1],sh[2]),D,dp+1));let i=0;
    const o=fillT(val.replace(/\{\*(\d?)\}/g,(x,n)=>'\u0002'+(n?+n-1:i++)+'\u0002'),sh[1],sh[2]).replace(/\u0002(\d+)\u0002/g,(x,n)=>caps[+n]!==undefined?caps[+n]:'');
    return m[1]+o+m[3]}
  if(dp<3&&core.includes(' · ')){const ps=core.split(' · '),tr=ps.map(x=>trS0(x,D,dp+1));if(tr.some((x,i)=>x!==ps[i]))return m[1]+tr.join(' · ')+m[3]} /* « A · B » : chaque partie à part */
  return t}
/* trou d'un modèle : nom d'exercice écrit en minuscules (« 120 secondes de gainage ») -> cherché aussi avec une majuscule */
function trCap(g,D,dp){const r=trS0(g,D,dp);if(r!==g||!/^\p{Ll}/u.test(g))return r;const u=g[0].toUpperCase()+g.slice(1),r2=trS0(u,D,dp);return r2!==u?r2[0].toLowerCase()+r2.slice(1):r}
function trS(t){if(S.lang==='fr'||!t)return t;const D=DICT[S.lang];if(!D)return t;t=String(t);
  const ck=S.lang+(S.emo?1:0),C=TRC[ck]||(TRC[ck]=new Map()),c=C.get(t);if(c!==undefined)return c;
  const r=trS0(t,D,0);if(C.size>6000)C.clear();C.set(t,r);return r}
const NOTR='SCRIPT,STYLE,TEXTAREA,CODE,R-N,R-C';
function trNode(n){if(n.nodeType===3){const p=n.parentNode;if(!p||p.closest&&p.closest('textarea,script,style,.notr,.snote,code'))return;const o=n.data,v=trS(o);if(v!==o)n.data=v;return}
  if(n.nodeType!==1)return;if(n.matches&&n.matches('textarea,script,style,.notr,.snote,code')){if(n.tagName==='TEXTAREA')['placeholder','aria-label','title'].forEach(a=>{if(n.hasAttribute(a)){const o=n.getAttribute(a),v=trS(o);if(v!==o)n.setAttribute(a,v)}});return} /* v7.4 : le texte d'aide des zones de texte se traduit aussi (jamais leur contenu) */
  ['placeholder','aria-label','title','alt'].forEach(a=>{if(n.hasAttribute&&n.hasAttribute(a)){const o=n.getAttribute(a),v=trS(o);if(v!==o)n.setAttribute(a,v)}});
  if(n.tagName==='INPUT'&&(n.type==='button'||n.type==='submit')&&n.value){const v=trS(n.value);if(v!==n.value)n.value=v}
  const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let x;while((x=w.nextNode())){if(x.nodeType===1){['placeholder','aria-label','title','alt'].forEach(a=>{if(x.hasAttribute(a)){const o=x.getAttribute(a),v=trS(o);if(v!==o)x.setAttribute(a,v)}})}else trNode(x)}}
let trObs=null;
function i18nStart(){document.documentElement.lang=S.lang;if(S.lang==='fr'){if(trObs){trObs.disconnect();trObs=null}return}
  if(!DICT[S.lang])return;trNode(document.body);document.title=trS('Carnet de séances');
  document.querySelectorAll('.dow span:not(.wn)').forEach((e,i)=>{e.textContent=DOWI()[i]});
  if(!trObs){trObs=new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')trNode(m.target);else if(m.type==='attributes')trNode(m.target);else m.addedNodes.forEach(trNode)}});trObs.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']})}}
function i18nApply(){save();try{localStorage.setItem('carnet-lang',S.lang)}catch(e){}toast(S.lang==='en'?'Language: English ✓':S.lang==='nl'?'Taal: Nederlands ✓':'Langue : français ✓');setTimeout(()=>location.reload(),700)}
/* les images (canvas) passent aussi par le dictionnaire */
(()=>{const P=CanvasRenderingContext2D.prototype,ft=P.fillText,mt=P.measureText;P.fillText=function(t,...a){return ft.call(this,trS(String(t)),...a)};P.measureText=function(t){return mt.call(this,trS(String(t)))}})();
