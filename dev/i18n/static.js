const fs=require('fs');const D='./src/';
const files=['app.js',...fs.readdirSync(D+'js').filter(f=>f.endsWith('.js')).map(f=>'js/'+f)];
const out={};const add=(t,src)=>{if(!t)return;t=t.replace(/\\'/g,"'").replace(/\\n/g,' ').trim();if(t.length<2||!/\p{L}/u.test(t)||/^[<#.]|[{}<>]|^\w+$/.test(t)&&!/^[A-ZÀ-Ý][a-zà-ÿ]/.test(t))return;if(/^[a-z]+[A-Z]|^\w+:\w|\.js$|^https?:/.test(t))return;out[t]=src};
for(const f of files){const s=fs.readFileSync(D+f,'utf8');
  for(const re of [/(?:toast|snack|boomMsg|reward|emptyArt)\(\s*(?:emo\()?'((?:[^'\\]|\\.)*)'/g,/(?:boomMsg|reward|emptyArt)\([^,]*?,\s*(?:emo\()?'((?:[^'\\]|\\.)*)'/g,/reward\('[^']*','[^']*','((?:[^'\\]|\\.)*)'/g,/emptyArt\('[^']*','((?:[^'\\]|\\.)*)'/g])
    for(const m of s.matchAll(re))add(m[1],f)}
const code=fs.readdirSync(D+'js').filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(D+'js/'+f,'utf8')).join('\n');
function grabConst(name){const i=code.indexOf('const '+name+'=');if(i<0)return null;let j=code.indexOf('=',i)+1;const open=code[j];const close=open==='{'?'}':open==='['?']':null;if(!close)return null;let d=0,k=j,q=null;
  for(;k<code.length;k++){const c=code[k];if(q){if(c==='\\'){k++;continue}if(c===q)q=null;continue}if(c==="'"||c==='"'||c==='`'){q=c;continue}if(c===open)d++;else if(c===close){d--;if(d===0)break}}
  try{return eval('('+code.slice(j,k+1)+')')}catch(e){console.error('eval',name,e.message);return null}}
const M={};['MSG','SETSUB','HCARDS','CH_SP','CH_HAIRN','CH_SHIRTN','CH_HS','CH_ACC','THEMES','FONTS','REWARDS','TOOLS6','TABS6','MZ','FMT6','LANGS'].forEach(n=>{M[n]=grabConst(n)});
const lab=v=>{if(typeof v==='string')add(v,'v6');else if(Array.isArray(v))v.forEach(lab);else if(v&&typeof v==='object')Object.values(v).forEach(lab)};
['SETSUB','HCARDS','CH_HAIRN','CH_SHIRTN','CH_HS','CH_ACC','REWARDS','TOOLS6','TABS6','MZ','FMT6','LANGS'].forEach(k=>lab(M[k]));
Object.values(M.CH_SP).forEach(x=>{add(x.n,'sp');if(Array.isArray(x.pal))x.pal.forEach(p=>add(p[1],'pal'))});Object.values(M.THEMES).forEach(x=>add(x.n,'th'));Object.values(M.FONTS).forEach(x=>add(x[0],'font'));
// messages selon le ton : variantes avec/sans prénom, nombres en jetons
const msgs=[];Object.values(M.MSG).forEach(t=>Object.values(t).forEach(list=>list.forEach(it=>{(Array.isArray(it)?it:[it]).forEach(s=>String(s).split('|').forEach(x=>msgs.push(x)))})));
const toks=x=>{let i=0;return x.replace(/\{[kgd]\}/g,()=>'{'+(i++)+'}')};
msgs.forEach(m=>{const base=[m.replace(/\{n\}/g,' {N0}'),m.replace(/\{n\}/g,'')];base.forEach(b=>{const v=[];if(/\{s\}/.test(b)){v.push(b.replace(/\{s\}/g,''),b.replace(/\{s\}/g,'s'))}else v.push(b);v.forEach(x=>{if(/\{t\}/.test(x)){add(toks(x.replace('{t}','{T}')).replace('{T}','{X} h {Y}').replace(/\{X\}|\{Y\}/g,'#'),'msgt');add(toks(x.replace('{t}','{T}')).replace('{T}','{X} min'),'msgt2')}else add(toks(x),'msg')})})});
// renumérote les jetons {#} produits pour {t}
for(const k of Object.keys(out)){if(k.includes('#')||k.includes('{X}')){let src=out[k];delete out[k];let i=0;const nk=k.replace(/\{\d+\}|#|\{X\}/g,()=>'{'+(i++)+'}');out[nk]=src}}
fs.writeFileSync('./i18n/static.json',JSON.stringify(out,null,0));console.log('static',Object.keys(out).length);
// contenus de app.js (guides, conseils, skills, échauffement…)
{const app=fs.readFileSync(D+'app.js','utf8');const grabA=name=>{const i=app.indexOf('const '+name+'=');if(i<0)return null;let j=app.indexOf('=',i)+1;while(app[j]===' ')j++;const open=app[j],close=open==='{'?'}':open==='['?']':null;if(!close)return null;let d=0,k=j,q=null,re=false;
  for(;k<app.length;k++){const c=app[k];if(q){if(c==='\\'){k++;continue}if(c===q)q=null;continue}if(re){if(c==='\\'){k++;continue}if(c==='/')re=false;continue}if(c==="'"||c==='"'||c==='`'){q=c;continue}if(c==='/'&&/[\[,(:]\s*$/.test(app.slice(Math.max(0,k-3),k))){re=true;continue}if(c===open)d++;else if(c===close){d--;if(d===0)break}}
  try{return eval('('+app.slice(j,k+1)+')')}catch(e){console.error('evalA',name,e.message);return null}};
 const deep=(v)=>{if(typeof v==='string'){if(!/^#|^<|^[a-z]+$|^\d/.test(v)||/\s/.test(v))add(v,'app')}else if(Array.isArray(v))v.forEach(deep);else if(v&&typeof v==='object'&&!(v instanceof RegExp)){Object.keys(v).forEach(k=>{if(/[A-ZÀ-Ý]/.test(k[0])&&isNaN(k))add(k,'appk')});Object.values(v).forEach(deep)}};
 ['EXDB','GUIDE','GEN','GEN0','MG','TIPS','SKILLS','WU','TY','PL','EXG0','FEEL','TODS','LVL','TIER','SNDS','CHEERS','TESTS'].forEach(n=>{const v=grabA(n);if(v)deep(v);else console.error('missing',n)});
 fs.writeFileSync('./i18n/static.json',JSON.stringify(out,null,0));console.log('static+app',Object.keys(out).length)}
