const fs=require('fs');eval(fs.readFileSync('./src/js/20_chars.js','utf8')+';global.charSvg=charSvg;global.CH_ORDER=CH_ORDER;global.CH_SP=CH_SP;global.chLt=chLt;global.chDk=chDk;');
const out='./art/icons/';const A='#e4ff1a';
CH_ORDER.forEach(k=>{const o={sp:k,pose:'icon',acc:A};
  fs.writeFileSync(out+k+'.svg',charSvg(Object.assign({bg:1},o)));
  const inner=charSvg(o).replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true">','<svg x="22" y="22" width="156" height="156" viewBox="0 0 200 200">');
  fs.writeFileSync(out+k+'-mask.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+chLt(A,.22)+'"/><stop offset="1" stop-color="'+chDk(A,.14)+'"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/>'+inner+'</svg>')});
console.log('svg ok');
