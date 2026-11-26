const fs=require('fs');eval(fs.readFileSync('./src/js/20_chars.js','utf8')+';global.charSvg=charSvg;global.charAnim=charAnim;global.CH_ORDER=CH_ORDER;global.CH_SP=CH_SP;');
const poses=(process.argv[2]||'icon,idle,cheer,flex,thumbs,wave,sleep,pullA,pullB').split(',');
const sps=(process.argv[3]||CH_ORDER.join(',')).split(',');
const extra=JSON.parse(process.argv[4]||'{}');
let h='<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#3a3d46;font:12px sans-serif;color:#ddd}table{border-collapse:collapse}td{padding:4px;text-align:center}svg{width:150px;height:auto;display:block;background:#e9ebef;border-radius:14px}td.ic svg{background:none}</style><table><tr><td></td>'+poses.map(p=>'<td>'+p+'</td>').join('')+'</tr>';
for(const k of sps){h+='<tr><td>'+k+'</td>';for(const p of poses){const o=Object.assign({sp:k,pose:p,acc:'#e4ff1a'},extra);if(p==='icon')o.bg=1;h+='<td class="'+(p==='icon'?'ic':'')+'">'+charSvg(o)+'</td>'}h+='</tr>'}
fs.writeFileSync(process.argv[5]||'./art/rig.html',h+'</table>');
