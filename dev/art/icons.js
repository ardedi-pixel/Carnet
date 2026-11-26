const fs=require('fs');eval(fs.readFileSync('./src/js/20_chars.js','utf8')+';global.charSvg=charSvg;global.CH_ORDER=CH_ORDER;global.CH_SP=CH_SP;');
const out='./art/icons/';
CH_ORDER.forEach(k=>{const o=Object.assign({sp:k,pose:'icon',bg:1,acc:'#e4ff1a'},CH_SP[k].def);if(k==='femme'){o.hs='queue';o.hc='chatain'}fs.writeFileSync(out+k+'.svg',charSvg(o))});
// icônes de raccourcis (Android)
const ICO={plus:'<path d="M12 5v14M5 12h14"/>',emom:'<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/><path d="M12 8v4l2.5 2"/>',pyr:'<path d="M3 20h18M5.5 20v-4h13v4M8 16v-4h8v4M10.5 12V8h3v4"/>'};
Object.entries(ICO).forEach(([k,p])=>fs.writeFileSync(out+'sc-'+k+'.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#e4ff1a"/><g transform="translate(18 18) scale(2.5)" fill="none" stroke="#111114" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+p+'</g></svg>'));
