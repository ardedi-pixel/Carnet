/* ===================== v6 : base (état, thèmes, typo, ambiance) ===================== */
const APP6='7.1.0';
['th','accX','todBg','seas','font','fsz','fdyn','dens','masc','splash','cards','tabs','tone','emo','pops','vol','voiceN','lang','char','photo','useP','nick','goalT','meas','chal','chalH','rw','lvSeen','recapW','popLast','musSeen','bdSeen','anim','nut'].forEach(k=>{if(!EXTRA.includes(k))EXTRA.push(k)});
/* v6.3 : animations « Toujours » (par défaut, même si l'iPhone réduit les animations) ou « Selon l'iPhone » */
const RM_Q='(prefers-reduced-motion: reduce)';
function rmOn(){try{return S.anim==='os'&&matchMedia(RM_Q).matches}catch(e){return false}}
function rmSync(){document.documentElement.classList.toggle('rm',rmOn());if(typeof fx7Sync==='function')fx7Sync();try{localStorage.setItem('carnet-anim',S.anim==='os'?'os':'always')}catch(e){}}
try{matchMedia(RM_Q).addEventListener('change',()=>{try{rmSync()}catch(e){}})}catch(e){}
/* ---- icônes maison (même trait partout) ---- */
const ICO={
 home:'<path d="M3.5 11L12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="8.5" cy="14.5" r="1.1" fill="currentColor"/><circle cx="12" cy="14.5" r="1.1" fill="currentColor"/>',
 tools:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M10 2.5h4M12 2.5V6"/><path d="M18.3 7.2l1.4-1.4"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
 plus:'<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
 timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5l3-3M9.5 2.5h5"/>',
 emom:'<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/><path d="M12 8v4l2.5 2"/>',
 pyr:'<path d="M3 20h18M5.5 20v-4h13v4M8 16v-4h8v4M10.5 12V8h3v4"/>',
 weight:'<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
 flame:'<path d="M12 21c-3.9 0-6.5-2.7-6.5-6.3 0-3.4 2.4-5.2 3.6-7.7.5 1.8 1.6 2.8 2.6 3.1-.6-3 .4-5.8 2.3-7.6.5 3.6 4.5 6.1 4.5 11.6 0 4-2.6 6.9-6.5 6.9z"/>',
 bulb:'<path d="M9 18h6M10 21h4M8.5 14.5C7 13.2 6 11.4 6 9.5a6 6 0 0 1 12 0c0 1.9-1 3.7-2.5 5-.6.5-1 1.3-1 2.1V17h-5v-.4c0-.8-.4-1.6-1-2.1z"/>',
 play:'<rect x="3" y="5" width="18" height="14" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/>',
 star:'<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5v1.5A3.5 3.5 0 0 0 8 11M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11M12 13v4M8.5 20.5h7M9.5 17h5v3.5h-5z"/>',
 bars:'<rect x="4" y="11" width="4" height="9" rx="1.2"/><rect x="10" y="6" width="4" height="14" rx="1.2"/><rect x="16" y="14" width="4" height="6" rx="1.2"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/>',
 palette:'<path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.4 0 2-1 1.6-2.1-.5-1.3.4-2.6 1.8-2.6h1.6a3.5 3.5 0 0 0 3.5-3.6C20.4 7.3 16.6 3.5 12 3.5z"/><circle cx="7.8" cy="11" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7.3" r="1.2" fill="currentColor"/><circle cx="15" cy="7.5" r="1.2" fill="currentColor"/>',
 chat:'<path d="M4.5 18.5V6.5a2.5 2.5 0 0 1 2.5-2.5h10a2.5 2.5 0 0 1 2.5 2.5v7.5a2.5 2.5 0 0 1-2.5 2.5H8.5z"/><path d="M8.5 9h7M8.5 12.5h4.5"/>',
 sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
 globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5S9.6 5.9 12 3.5z"/>',
 data:'<ellipse cx="12" cy="6" rx="7.5" ry="2.8"/><path d="M4.5 6v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V6M4.5 12v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6"/>',
 layout:'<rect x="3.5" y="3.5" width="17" height="6" rx="2"/><rect x="3.5" y="12" width="7.5" height="8.5" rx="2"/><rect x="13" y="12" width="7.5" height="8.5" rx="2"/>',
 dock:'<rect x="3" y="14.5" width="18" height="6" rx="3"/><circle cx="7.5" cy="17.5" r="1" fill="currentColor"/><circle cx="12" cy="17.5" r="1" fill="currentColor"/><circle cx="16.5" cy="17.5" r="1" fill="currentColor"/><path d="M6 4.5h12M6 8.5h12"/>',
 street:'<path d="M4 20V8M4 8h9M13 8v12M4 12h9"/><path d="M17 20v-6a2.5 2.5 0 0 1 5 0v6"/><path d="M2 20h20"/>',
 garage:'<path d="M3 20V9l9-5 9 5v11"/><path d="M6.5 20v-8h11v8M6.5 15h11M6.5 17.5h11"/>',
 salle:'<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/><path d="M2 21h20" opacity=".5"/>',
 share:'<path d="M12 15V3.5M7.5 8L12 3.5 16.5 8M5 12.5v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
 camera:'<path d="M4 8.5a2 2 0 0 1 2-2h2l1.6-2.2h4.8L16 6.5h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.6"/>',
 lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
 copy:'<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5"/>',
 move:'<path d="M12 3.5v17M3.5 12h17M9 6.5l3-3 3 3M9 17.5l3 3 3-3M6.5 9l-3 3 3 3M17.5 9l3 3-3 3"/>',
 trash:'<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
 gift:'<rect x="3.5" y="8.5" width="17" height="4" rx="1.2"/><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5C10 4 6.5 4.2 6.8 6.6 7 8 9.5 8.5 12 8.5zM12 8.5c2-4.5 5.5-4.3 5.2-1.9C17 8 14.5 8.5 12 8.5z"/>',
 target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
 ruler:'<rect x="2.8" y="8" width="18.4" height="8" rx="2" transform="rotate(-30 12 12)"/><path d="M7.5 10.6l1 1.7M10.2 9l1.3 2.3M12.9 7.5l1 1.7M15.6 5.9l1.3 2.3"/>',
 sparkles:'<path d="M12 3l1.8 4.9L18.7 9.7 13.8 11.5 12 16.4 10.2 11.5 5.3 9.7 10.2 7.9z"/><path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
 info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r="1.1" fill="currentColor"/>',
 chev:'<path d="M9 5l7 7-7 7"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',
 up:'<path d="M6 14l6-6 6 6"/>',down:'<path d="M6 10l6 6 6-6"/>',
 photo:'<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4"/>',
 medal:'<path d="M8 3.5l2.5 6M16 3.5l-2.5 6"/><circle cx="12" cy="15" r="5.5"/><path d="M12 12.4l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z" fill="currentColor"/>',
 wave:'<path d="M3 15c3 0 3-3 6-3s3 3 6 3 3-3 6-3"/><path d="M3 19c3 0 3-3 6-3s3 3 6 3 3-3 6-3" opacity=".5"/>'
};
const ico=(k,cls)=>'<svg class="ico'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICO[k]||'')+'</svg>';
/* ---- thèmes complets ---- */
const THEMES={
 nuit:{n:'Nuit',acc:'#e4ff1a',v:{bg:'#0b0b0c',card:'#151517',card2:'#1e1e21',ink:'#f3f3f1',mute:'#9b9ba1',line:'#2a2a2f'},top:'linear-gradient(160deg,var(--lead),color-mix(in srgb,var(--lead) 70%,#000))',ti:'auto',bgi:'radial-gradient(900px 600px at 110% -10%,color-mix(in srgb,var(--lead) 14%,transparent),transparent 60%),radial-gradient(700px 500px at -20% 40%,rgba(120,120,160,.08),transparent 60%)',f:'classique'},
 neon:{n:'Néon',acc:'#ff3df2',v:{bg:'#0a0620',card:'#150c31',card2:'#201447',ink:'#f6f0ff',mute:'#a99cd3',line:'#33255f'},top:'linear-gradient(135deg,#ff3df2 0%,#7b2bff 52%,#00e0ff 100%)',ti:'#ffffff',bgi:'radial-gradient(800px 500px at 100% 0%,rgba(255,61,242,.22),transparent 60%),radial-gradient(700px 600px at 0% 70%,rgba(0,224,255,.16),transparent 60%)',glow:1,f:'sport'},
 beton:{n:'Béton street',acc:'#ff7a1a',v:{bg:'#25272b',card:'#2f3236',card2:'#393c42',ink:'#f1efe9',mute:'#aaa69e',line:'#45484f'},top:'repeating-linear-gradient(-45deg,#1d1f22 0 14px,#ff7a1a 14px 28px) bottom/100% 10px no-repeat,linear-gradient(180deg,#5c6066,#3c3f44)',ti:'#ffffff',bgi:'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.9%27 numOctaves=%272%27/%3E%3CfeColorMatrix values=%270 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .07 0%27/%3E%3C/filter%3E%3Crect width=%27160%27 height=%27160%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',f:'sport'},
 craie:{n:'Craie',acc:'#f6e27a',v:{bg:'#1c2a24',card:'#22332c',card2:'#2a3e35',ink:'#f3f1e7',mute:'#a8b9ae',line:'#3f564b'},top:'linear-gradient(170deg,#2f4a3e,#1f3029)',ti:'#f3f1e7',bgi:'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.55%27 numOctaves=%273%27/%3E%3CfeColorMatrix values=%270 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .06 0%27/%3E%3C/filter%3E%3Crect width=%27200%27 height=%27200%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',chalk:1,f:'craie'},
 minimal:{n:'Minimal blanc',acc:'#111114',light:1,v:{bg:'#f6f6f3',card:'#ffffff',card2:'#f0f0ec',ink:'#141416',mute:'#6b6b72',line:'#e3e2dc'},top:'#ffffff',ti:'#141416',bgi:'',f:'classique'},
 sunset:{n:'Coucher de soleil',acc:'#ff8a5b',v:{bg:'#190e22',card:'#24142e',card2:'#301b3b',ink:'#fff3ea',mute:'#c9aab9',line:'#43294e'},top:'linear-gradient(165deg,#ffc15c 0%,#ff7a59 42%,#b0418f 78%,#5a2a88 100%)',ti:'#2a0d1f',bgi:'radial-gradient(900px 520px at 50% -12%,rgba(255,138,91,.22),transparent 62%),radial-gradient(600px 500px at 100% 100%,rgba(176,65,143,.18),transparent 60%)',f:'rond'},
 or:{n:'Or',acc:'#f5c542',lock:1,v:{bg:'#0e0c08',card:'#18150e',card2:'#221d13',ink:'#f8f1dc',mute:'#b4a882',line:'#3a3221'},top:'linear-gradient(135deg,#fbe59a,#d9ad35 48%,#8c6714)',ti:'#1c1406',bgi:'radial-gradient(800px 500px at 100% 0%,rgba(245,197,66,.16),transparent 60%)',f:'classique'},
 aurore:{n:'Aurore',acc:'#5cffc8',lock:1,v:{bg:'#05121a',card:'#0b1f2a',card2:'#112a37',ink:'#eafff8',mute:'#8fb9b0',line:'#1e3e4c'},top:'linear-gradient(135deg,#0e3a4b,#178072 42%,#7b4fd6)',ti:'#eafff8',bgi:'radial-gradient(900px 400px at 20% -5%,rgba(92,255,200,.18),transparent 60%),radial-gradient(700px 500px at 100% 30%,rgba(123,79,214,.2),transparent 60%)',f:'classique'}
};
const TH_ORDER=['nuit','neon','beton','craie','minimal','sunset','or','aurore'];
/* ---- thèmes de saison (printemps, été, automne, hiver) + saison automatique ---- */
const SEAS_SVG={
spring:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 170" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#f3fbff"/></linearGradient></defs><rect width="400" height="170" fill="url(#s)"/><circle cx="318" cy="44" r="34" fill="#fff6c9" opacity=".55"/><circle cx="318" cy="44" r="20" fill="#fff1a6"/><g fill="#fff" opacity=".9"><path d="M196 52c4-12 22-12 26-2 8-4 18 2 16 10h-50c-3-4 2-9 8-8z"/><path d="M40 92c3-9 17-9 20-1 6-3 14 1 12 8h-38c-2-3 1-7 6-7z" opacity=".7"/></g><path d="M0 132 C60 112 120 114 190 128 C250 140 320 118 400 124 V170 H0Z" fill="#b9e3a2"/><path d="M0 150 C80 136 150 138 220 148 C290 158 350 142 400 146 V170 H0Z" fill="#8fd27a"/><g fill="#fff"><circle cx="60" cy="152" r="2.4"/><circle cx="120" cy="146" r="2"/><circle cx="250" cy="156" r="2.4"/><circle cx="330" cy="150" r="2"/></g><g fill="#ff9cc7"><circle cx="84" cy="156" r="2.4"/><circle cx="196" cy="150" r="2"/><circle cx="292" cy="158" r="2.4"/><circle cx="370" cy="152" r="2"/></g><path d="M400 6 C360 14 336 30 312 26 C296 23 286 34 268 30" fill="none" stroke="#7a4a35" stroke-width="5" stroke-linecap="round"/><path d="M352 18 C346 30 338 38 326 42" fill="none" stroke="#7a4a35" stroke-width="3" stroke-linecap="round"/><g fill="#ffc1dc"><circle cx="268" cy="30" r="7"/><circle cx="290" cy="22" r="6"/><circle cx="312" cy="27" r="7.5"/><circle cx="326" cy="42" r="6.5"/><circle cx="340" cy="18" r="6"/><circle cx="362" cy="12" r="7"/><circle cx="384" cy="16" r="6"/><circle cx="350" cy="34" r="5"/></g><g fill="#ff8fbf"><circle cx="268" cy="30" r="2.4"/><circle cx="290" cy="22" r="2"/><circle cx="312" cy="27" r="2.6"/><circle cx="326" cy="42" r="2.2"/><circle cx="340" cy="18" r="2"/><circle cx="362" cy="12" r="2.4"/><circle cx="384" cy="16" r="2"/><circle cx="350" cy="34" r="1.8"/></g></svg>',
summer:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 170" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd4ff"/><stop offset=".72" stop-color="#ffefc2"/></linearGradient><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2cc0dc"/><stop offset="1" stop-color="#1489b3"/></linearGradient></defs><rect width="400" height="170" fill="url(#s)"/><g stroke="#ffe27a" stroke-width="4" stroke-linecap="round" opacity=".8"><path d="M324 2v10M324 86v10M277 49h10M361 49h10M291 16l7 7M350 75l7 7M357 16l-7 7M298 75l-7 7"/></g><circle cx="324" cy="49" r="28" fill="#ffd23f"/><circle cx="324" cy="49" r="20" fill="#ffe073"/><path d="M0 116 H400 V170 H0Z" fill="url(#m)"/><g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"><path d="M20 128 q10 -6 20 0 t20 0"/><path d="M150 138 q10 -6 20 0 t20 0"/><path d="M290 130 q10 -6 20 0 t20 0"/><path d="M90 154 q10 -6 20 0 t20 0"/><path d="M230 158 q10 -6 20 0 t20 0"/></g><path d="M0 150 C40 144 70 152 100 170 H0Z" fill="#ffe0a3"/><g fill="none" stroke="#3d4b5c" stroke-width="2.6" stroke-linecap="round"><path d="M252 20 q5 -5 10 0 q5 -5 10 0"/><path d="M276 8 q4 -4 8 0 q4 -4 8 0"/></g><path d="M262 116 l14 -36 l2 36z" fill="#fff"/><path d="M276 82 l16 32 h-15z" fill="#ff6b5b"/><path d="M256 116 h40 l-6 8 h-28z" fill="#3d4b5c"/></svg>',
autumn:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 170" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb362"/><stop offset=".65" stop-color="#e2683a"/><stop offset="1" stop-color="#9b3a26"/></linearGradient></defs><rect width="400" height="170" fill="url(#s)"/><circle cx="322" cy="78" r="30" fill="#ffd98a" opacity=".85"/><path d="M0 118 C70 96 130 102 200 116 C270 128 330 104 400 110 V170 H0Z" fill="#a8432a"/><path d="M0 140 C90 124 160 128 230 138 C300 148 350 132 400 136 V170 H0Z" fill="#6e2a1d"/><g><rect x="58" y="112" width="5" height="26" fill="#3b2017"/><circle cx="60" cy="104" r="15" fill="#ff8f2e"/><rect x="104" y="116" width="4" height="22" fill="#3b2017"/><circle cx="106" cy="108" r="11" fill="#f2b33d"/><rect x="236" y="116" width="5" height="26" fill="#3b2017"/><circle cx="238" cy="106" r="16" fill="#d9482b"/><rect x="276" y="122" width="4" height="20" fill="#3b2017"/><circle cx="278" cy="114" r="11" fill="#ff8f2e"/><rect x="356" y="112" width="5" height="28" fill="#3b2017"/><circle cx="358" cy="102" r="17" fill="#f2b33d"/><circle cx="350" cy="96" r="9" fill="#ff8f2e"/></g><g fill="#4a1d14"><path d="M0 170 V156 C60 150 120 154 170 170Z"/><path d="M260 170 C300 156 350 152 400 158 V170Z"/></g></svg>',
winter:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 170" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1b36"/><stop offset="1" stop-color="#2b4c7a"/></linearGradient></defs><rect width="400" height="170" fill="url(#s)"/><g fill="#fff"><circle cx="30" cy="8" r="1.2"/><circle cx="90" cy="5" r="1"/><circle cx="156" cy="10" r="1.4"/><circle cx="222" cy="4" r="1"/><circle cx="250" cy="12" r="1.2"/><circle cx="296" cy="30" r="1.1"/><circle cx="380" cy="60" r="1.2"/><circle cx="120" cy="70" r=".9"/><circle cx="270" cy="62" r="1"/><circle cx="60" cy="64" r="1"/></g><path d="M336 22 a20 20 0 1 0 14 34 a16 16 0 1 1 -14 -34z" fill="#eef3ff"/><path d="M0 124 L60 82 L96 104 L150 62 L210 112 L260 78 L320 116 L360 90 L400 110 V170 H0Z" fill="#7f99c2"/><path d="M60 82 L74 92 L66 94 L56 88Z M150 62 L170 78 L156 80 L146 72 L138 76Z M260 78 L278 90 L266 92 L256 86Z M360 90 L374 99 L364 100Z" fill="#ffffff"/><path d="M0 146 C80 132 150 136 220 146 C290 156 350 140 400 144 V170 H0Z" fill="#e8f1ff"/><g fill="#16304c"><path d="M40 146 l10 -26 l10 26z"/><path d="M44 134 l6 -20 l6 20z"/><path d="M300 150 l11 -30 l11 30z"/><path d="M305 136 l6 -22 l6 22z"/><path d="M340 148 l8 -20 l8 20z"/></g><g fill="#fff"><path d="M46 125 l4 -8 l4 8z"/><path d="M307 124 l4 -9 l4 9z"/><path d="M344 134 l4 -7 l4 7z"/></g></svg>'
};
const svgUrl=s=>"url('data:image/svg+xml,"+encodeURIComponent(s).replace(/'/g,'%27')+"')";
const seaTop=(k,g)=>svgUrl(SEAS_SVG[k])+' center bottom/cover no-repeat,'+g;
Object.assign(THEMES,{
 saison:{n:'Selon la saison',auto:1,acc:'#ff8a2b',v:{bg:'#1b120c',card:'#271a12',card2:'#332217',ink:'#fbefe3',mute:'#c3a58d',line:'#45301f'},top:'',ti:'#ffffff',bgi:'',f:'classique'},
 printemps:{n:'Printemps',season:'spring',acc:'#2f8a48',light:1,v:{bg:'#ecf6e6',card:'#ffffff',card2:'#e3f1d9',ink:'#1b2a1e',mute:'#5b6f60',line:'#d0e5c4'},top:seaTop('spring','#cfeeff'),ti:'#1f2a22',bgi:'radial-gradient(760px 480px at 105% -5%,rgba(255,163,203,.34),transparent 60%),radial-gradient(700px 520px at -15% 40%,rgba(140,205,110,.24),transparent 62%),linear-gradient(180deg,#eef8e8,#e2f1d6)',f:'rond'},
 ete:{n:'Été',season:'summer',acc:'#ff8f1f',light:1,v:{bg:'#e8f6ff',card:'#ffffff',card2:'#fff2d9',ink:'#13283a',mute:'#57708a',line:'#d3e7f3'},top:seaTop('summer','#9fdcff'),ti:'#1d2b3a',bgi:'radial-gradient(520px 360px at 100% -4%,rgba(255,214,90,.45),transparent 62%),linear-gradient(180deg,#c9ecff 0%,#e9f8ff 36%,#fffaf0 68%,#ffe9c2 100%)',f:'sport'},
 automne:{n:'Automne',season:'autumn',acc:'#ff8a2b',v:{bg:'#1b120c',card:'#271a12',card2:'#332217',ink:'#fbefe3',mute:'#c3a58d',line:'#45301f'},top:seaTop('autumn','#e2683a'),ti:'#ffffff',bgi:'radial-gradient(800px 500px at 100% 0%,rgba(255,138,43,.18),transparent 60%),radial-gradient(600px 500px at 0% 90%,rgba(217,72,43,.14),transparent 60%)',f:'classique'},
 hiver:{n:'Hiver',season:'winter',acc:'#7fd3ff',v:{bg:'#0a1220',card:'#121e33',card2:'#192841',ink:'#eef5ff',mute:'#93a8c6',line:'#22344f'},top:seaTop('winter','#1a3157'),ti:'#ffffff',bgi:'radial-gradient(800px 500px at 100% 0%,rgba(127,211,255,.16),transparent 60%),radial-gradient(700px 500px at 0% 100%,rgba(140,160,255,.1),transparent 60%)',f:'classique'}
});
const TH_SEAS=['saison','printemps','ete','automne','hiver'];
/* saison du moment (Belgique) : printemps mars-mai, été juin-août, automne sept-nov, hiver déc-fév */
function seasonNow(){const m=new Date().getMonth()+1;return m>=3&&m<=5?'printemps':m>=6&&m<=8?'ete':m>=9&&m<=11?'automne':'hiver'}
const thKey=()=>{const k=THEMES[S.th]?S.th:'nuit';return THEMES[k].auto?seasonNow():k};
const FONTS={classique:['Classique','"Archivo","Arial Black",system-ui,sans-serif','"Inter",system-ui,sans-serif',''],
 sport:['Sportive','"Bebas Neue","Oswald","Archivo",Impact,sans-serif','"Barlow","Inter",system-ui,sans-serif','family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800'],
 rond:['Arrondie','ui-rounded,"SF Pro Rounded","Nunito",system-ui,sans-serif','ui-rounded,"SF Pro Rounded","Nunito",system-ui,sans-serif','family=Nunito:wght@400;600;700;800;900'],
 craie:['Craie','"Patrick Hand","Comic Relief","Archivo",sans-serif','"Inter",system-ui,sans-serif','family=Patrick+Hand']};
const curTh=()=>THEMES[thKey()];
function curAcc(){return /^#[0-9a-f]{6}$/i.test(S.accX||'')?S.accX:curTh().acc}
function v6Load(){S.th=THEMES[S.th]?S.th:(S.theme==='light'?'minimal':'nuit');if(S.accX===undefined){S.accX=S.acc&&S.acc!=='jaune'&&ACC[S.acc]?ACC[S.acc][0]:''}
  S.todBg=S.todBg!==false;S.seas=S.seas!==false;S.font=FONTS[S.font]||S.font==='auto'?S.font:'auto';if(S.font==='craie')S.font='auto';S.fsz=[.9,1,1.12,1.25].includes(+S.fsz)?+S.fsz:1;S.fdyn=S.fdyn!==false;S.dens=S.dens==='comp'?'comp':'conf';
  S.masc=['on','mini','off'].includes(S.masc)?S.masc:'on';S.splash=['anim','logo','off'].includes(S.splash)?S.splash:'anim';S.anim=S.anim==='os'?'os':'always';S.tone=['sobre','motiv','cool','coach','fun'].includes(S.tone)?S.tone:'sobre';S.emo=S.emo===true;if((+S.v||0)<7){if(S.tone==='motiv')S.tone='sobre';S.emo=false}S.pops=['often','some','never'].includes(S.pops)?S.pops:'often';
  S.vol=typeof S.vol==='number'?Math.max(0,Math.min(1,S.vol)):1;S.voiceN=typeof S.voiceN==='string'?S.voiceN:'';if(!['fr','en','nl'].includes(S.lang)){const n=String(navigator.language||'fr').slice(0,2).toLowerCase();S.lang=['en','nl'].includes(n)&&!S.sessions.length?n:'fr'}
  if(!CH_SP[S.icon])S.icon='homme';S.char=obj(S.char);S.photo=typeof S.photo==='string'&&S.photo.startsWith('data:image')?S.photo:'';S.useP=!!(S.useP&&S.photo);S.nick=typeof S.nick==='string'?S.nick:'';S.goalT=typeof S.goalT==='string'?S.goalT:'';
  S.meas=obj(S.meas);['bras','taille'].forEach(k=>{S.meas[k]=arr(S.meas[k])});S.chal=S.chal&&typeof S.chal==='object'?S.chal:null;S.chalH=arr(S.chalH);S.rw=+S.rw||0;S.lvSeen=S.lvSeen===undefined?-1:+S.lvSeen;S.recapW=S.recapW||'';S.popLast=+S.popLast||0;
  if((+S.v||0)<8){ /* v7 : onglet Nutrition à la place de Plus ; accueil épuré (poids, nutrition, une carte « À la une ») */
    const o=arr(S.tabs&&S.tabs.order);if(o.length){if(o.join()==='home,cal,tools,pr,plus')S.tabs.order=['home','cal','nut','tools','pr'];else{const i=o.indexOf('plus');if(i>=0)o[i]='nut'}}
    if(Array.isArray(S.cards)&&S.cards.length){const keep=S.cards.filter(c=>c&&c.k==='perso');S.cards=keep.concat([{k:'poids',on:true},{k:'nutri',on:true},{k:'une',on:true}],S.cards.filter(c=>c&&HCARDS[c.k]&&!['perso','poids','nutri','une'].includes(c.k)).map(c=>({k:c.k,on:false})))}}
  S.cards=Array.isArray(S.cards)?S.cards.filter(c=>c&&HCARDS[c.k]):[];Object.keys(HCARDS).forEach(k=>{if(!S.cards.some(c=>c.k===k))S.cards.push({k,on:HCARDS[k][2]!==0})});
  S.tabs=obj(S.tabs);S.tabs.order=arr(S.tabs.order).filter(k=>TABS6[k]);Object.keys(TABS6).forEach(k=>{if(!S.tabs.order.includes(k))S.tabs.order.push(k)});S.tabs.off=arr(S.tabs.off).filter(k=>TABS6[k]&&k!=='home'&&k!=='tools');
  if(typeof nutLoad==='function')nutLoad();
  if((+S.v||0)<8)S.v=8}
const shownName=()=>S.nick||S.name||'';
/* ---- appliquer le thème, l'accent, la typo, la taille, la densité ---- */
let dynF=1;
function measureDyn(){try{if(!(window.CSS&&CSS.supports&&CSS.supports('font','-apple-system-body'))){dynF=1;return}const e=document.createElement('span');e.style.cssText='font:-apple-system-body;position:absolute;visibility:hidden';e.textContent='x';document.body.appendChild(e);const px=parseFloat(getComputedStyle(e).fontSize)||17;e.remove();dynF=Math.max(.85,Math.min(1.45,px/17))}catch(e){dynF=1}}
function fontsLink(q){let l=document.getElementById('f6');if(!q){if(l)l.remove();return}const href='https://fonts.googleapis.com/css2?'+q+'&display=swap';if(!l){l=document.createElement('link');l.id='f6';l.rel='stylesheet';document.head.appendChild(l)}if(l.href!==href)l.href=href}
function applyAcc(){const th=curTh(),a=curAcc(),d=document.documentElement,r=d.style,L=!!th.light,dk=chDk(a,.45),lum=chLum(a);
  d.dataset.theme=L?'light':'dark';d.dataset.th=thKey();if(th.season)d.dataset.season=th.season;else delete d.dataset.season; /* pas d'attribut vide : les règles v7 testent sa présence */d.classList.toggle('glow',!!th.glow);d.classList.toggle('chalk',!!th.chalk);d.classList.toggle('compact',S.dens==='comp');
  const vars={'--bg':th.v.bg,'--card':th.v.card,'--card2':th.v.card2,'--ink':th.v.ink,'--mute':th.v.mute,'--line':th.v.line,'--lead':a,'--hi':L?(lum>.55?chDk(a,.5):a):a,'--deep':dk,'--acct':L?(lum>.55?chDk(a,.55):a):(lum<.3?chLt(a,.45):a),'--on-lead':lum>.55?'#111114':'#ffffff','--lead-dk':lum<.3?chLt(a,.6):a,'--top-bg':th.top,'--top-ink':th.ti==='auto'?(lum>.55?'#101010':'#ffffff'):th.ti,'--bgi':th.bgi||'none','--glass':'color-mix(in srgb,'+th.v.card+' '+(L?'86%':'74%')+',transparent)'};
  const fk=S.font==='auto'?th.f:S.font,F=FONTS[fk]||FONTS.classique;vars['--fd']=F[1];vars['--ft']=F[2];vars['--fs']=String(Math.round(S.fsz*(S.fdyn?dynF:1)*100)/100);
  Object.entries(vars).forEach(([k,v])=>r.setProperty(k,v));fontsLink(F[3]);
  const top=th.ti==='auto'?a:(th.light?'#ffffff':th.v.bg),m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',L?'#ffffff':th.v.bg);
  try{localStorage.setItem('carnet-vars',JSON.stringify(vars));localStorage.setItem('carnet-dt',L?'light':'dark');localStorage.setItem('carnet-acc','x');localStorage.setItem('carnet-theme',L?'light':'dark')}catch(e){}
  todTick();seasonSync();if(typeof sea7Sync==='function')sea7Sync()}
const acc=()=>curAcc();
const isLight=()=>!!curTh().light;
/* ---- V2 : fond selon l'heure ---- */
function todTick(){const h=new Date().getHours(),d=document.documentElement;let k='day';if(h>=5&&h<10)k='morning';else if(h>=17&&h<21)k='evening';else if(h>=21||h<5)k='night';d.dataset.tod=S.todBg?k:'off'}
setInterval(todTick,10*60*1000);
/* ---- V3 : ambiance de saison (feuilles en automne, neige en hiver) ---- */
let seasonRaf=0,seasonParts=[];
const SEA_PART={spring:'petal',summer:'sun',autumn:'leaf',winter:'snow'};
function seasonKind(){return SEA_PART[seaNow()]} /* même saison que tous les dessins (56_ill7.js) */
function seasonSync(){const on=S.seas&&seasonKind()&&curV==='home'&&!document.hidden&&!rmOn();let c=$('season');
  if(!on){if(c)c.remove();cancelAnimationFrame(seasonRaf);seasonRaf=0;return}
  if(!c){c=document.createElement('canvas');c.id='season';c.setAttribute('aria-hidden','true');document.querySelector('.top').appendChild(c);seasonParts=[]}
  if(!seasonRaf)seasonRaf=requestAnimationFrame(seasonStep)}
function seasonStep(t){const c=$('season');if(!c){seasonRaf=0;return}const k=seasonKind(),dpr=Math.min(2,devicePixelRatio||1),W=c.clientWidth,H=c.clientHeight;if(c.width!==Math.round(W*dpr)){c.width=Math.round(W*dpr);c.height=Math.round(H*dpr)}
  const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);const N=k==='snow'?28:k==='sun'?16:k==='petal'?14:10;
  if(seasonParts.k!==k){seasonParts=[];seasonParts.k=k}
  const PC={petal:['#ffc1dc','#ff9cc7','#fff0f6','#ffb0d0'],leaf:['#e8792a','#c4521b','#d9a23a','#a63d1c'],sun:['#fff3b0','#ffd23f','#ffffff'],snow:['#ffffff']}[k];
  while(seasonParts.length<N){const up=k==='sun';seasonParts.push({x:Math.random()*W,y:up?H+Math.random()*H:Math.random()*H-H,s:k==='snow'?1+Math.random()*2.4:k==='sun'?1.2+Math.random()*2.2:k==='petal'?4+Math.random()*3.5:6+Math.random()*5,v:k==='snow'?.25+Math.random()*.5:k==='sun'?-(.15+Math.random()*.3):k==='petal'?.3+Math.random()*.35:.35+Math.random()*.45,a:Math.random()*6.28,w:.5+Math.random(),c:PC[Math.floor(Math.random()*PC.length)]})}
  seasonParts.forEach(p=>{p.y+=p.v;p.a+=.012*p.w;p.x+=Math.sin(p.a)*(k==='snow'?.35:k==='sun'?.25:.8);if(p.y>H+12){p.y=-12;p.x=Math.random()*W}if(p.y<-12){p.y=H+12;p.x=Math.random()*W}
    g.save();g.translate(p.x,p.y);
    if(k==='snow'){g.globalAlpha=.85;g.fillStyle='#fff';g.beginPath();g.arc(0,0,p.s,0,6.28);g.fill()}
    else if(k==='sun'){const tw=.35+.65*Math.abs(Math.sin(p.a*2.2));g.globalAlpha=tw;g.fillStyle=p.c;g.shadowColor='#ffd23f';g.shadowBlur=8;g.beginPath();g.arc(0,0,p.s,0,6.28);g.fill();if(p.s>2.6){g.globalAlpha=tw*.7;g.strokeStyle=p.c;g.lineWidth=1;g.beginPath();g.moveTo(-p.s*2.4,0);g.lineTo(p.s*2.4,0);g.moveTo(0,-p.s*2.4);g.lineTo(0,p.s*2.4);g.stroke()}}
    else if(k==='petal'){g.rotate(p.a*1.3);g.scale(1,.55+.45*Math.abs(Math.sin(p.a*1.7)));g.globalAlpha=.92;g.fillStyle=p.c;g.beginPath();g.moveTo(0,-p.s);g.bezierCurveTo(p.s,-p.s*.6,p.s*.7,p.s*.7,0,p.s);g.bezierCurveTo(-p.s*.7,p.s*.7,-p.s,-p.s*.6,0,-p.s);g.fill()}
    else{g.rotate(p.a*1.6);g.globalAlpha=.9;g.fillStyle=p.c;g.beginPath();g.moveTo(0,-p.s);g.quadraticCurveTo(p.s*.8,0,0,p.s);g.quadraticCurveTo(-p.s*.8,0,0,-p.s);g.fill();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=.8;g.beginPath();g.moveTo(0,-p.s);g.lineTo(0,p.s);g.stroke()}
    g.restore()});
  seasonRaf=requestAnimationFrame(seasonStep)}
document.addEventListener('visibilitychange',()=>{if(typeof seasonSync==='function')seasonSync()});
/* ---- texte sans emojis (réglage P13) ---- */
const EMO_RE=/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{2B50}\u{2B06}\u{2194}-\u{21AA}\u{231A}-\u{23FF}]/gu;
const noEmo=t=>String(t).replace(EMO_RE,'').replace(/\s+([!?.,])/g,'$1').replace(/\s{2,}/g,' ').trim();
const emo=t=>S.emo?t:noEmo(t);
