// Icônes de l'appli (une par perso) : node art/gen_icons.js puis conversion PNG (voir PLAN.md)
// v6.3 : style « Athlète », cadrage buste à la barre (viewBox de la pose icon)
const fs=require('fs');eval(fs.readFileSync('./src/js/20_chars.js','utf8')+';global.charSvg=charSvg;global.CH_ORDER=CH_ORDER;global.chLt=chLt;global.chDk=chDk;');
const out='./art/icons/';const A='#e4ff1a';
CH_ORDER.forEach(k=>{const o={sp:k,pose:'icon',acc:A};
  fs.writeFileSync(out+k+'.svg',charSvg(Object.assign({bg:1},o)));
  /* version « maskable » (Android) : même cadrage, réduit dans la zone de sécurité (80 %) */
  const inner=charSvg(o).replace(/^<svg [^>]*viewBox="([^"]+)"[^>]*>/,(m,vb)=>'<svg x="20" y="20" width="160" height="160" viewBox="'+vb+'">');
  fs.writeFileSync(out+k+'-mask.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+chLt(A,.22)+'"/><stop offset="1" stop-color="'+chDk(A,.14)+'"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/>'+inner+'</svg>')});
console.log('svg ok',CH_ORDER.length);
