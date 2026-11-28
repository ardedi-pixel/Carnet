
{
const I={
pyramide:'<path d="M12 3l9 17H3z"/><path d="M7.2 12h9.6M5 16h14"/>',
emom:'<circle cx="12" cy="14" r="7.5"/><path d="M12 14V10M10 2.5h4M12 2.5v4M18.5 7l1.5-1.5"/>',
classique:'<path d="M5 19a8 8 0 1 1 14 0"/><path d="M12 14l4-5"/><circle cx="12" cy="14" r="1.4" fill="currentColor"/>',
controle:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4"/>',
explo:'<path d="M13 2L5 14h6l-1 8 8-12h-6z" fill="currentColor"/>',
force:'<path d="M4 12h16M7 7v10M17 7v10M4 9v6M20 9v6"/>'};
const ic=k=>I[k]?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+I[k]+'</svg>':'';
/* v7.1 : la saison des décors vient du système central (56_ill7.js : seaNow, illScene), plus de la date de la séance */
const SV='<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">';
const GAR=SV+'<rect width="160" height="100" fill="url(#gGar)"/><rect x="6" y="14" width="56" height="62" rx="2" fill="#6b7486"/><g stroke="#4a5262" stroke-width="2"><path d="M6 24h56M6 34h56M6 44h56M6 54h56M6 64h56"/></g><rect x="6" y="64" width="56" height="12" fill="#ffd166" opacity=".35"/><path d="M84 0h40L154 80H54z" fill="url(#gLamp)"/><rect x="100" y="2" width="8" height="5" rx="1" fill="#ffe9a8"/>'
 +'<g stroke="#1f232c" stroke-width="3" stroke-linecap="round"><path d="M70 80V18M88 80V18M66 20h26M70 44h18M70 62l-4 0M88 62h4"/></g><g stroke="#1f232c" stroke-width="2.4"><path d="M73 44v-6M85 44v-6"/></g>'
 +'<g stroke="#1f232c" stroke-width="3.5" stroke-linecap="round"><path d="M108 80V26M140 80V26M104 30h40M102 52h44"/></g><rect x="100" y="44" width="5" height="16" rx="1.5" fill="#f2b705"/><rect x="143" y="44" width="5" height="16" rx="1.5" fill="#f2b705"/>'
 +'<g fill="none" stroke-width="2.2" stroke-linecap="round"><path d="M112 30c-3 10-3 20 1 24" stroke="#e63946"/><path d="M116 30c-2 12-1 22 3 26" stroke="#2a9d8f"/><path d="M135 30c3 9 2 18-2 22" stroke="#ff8c1a"/></g>'
 +'<rect y="78" width="160" height="22" fill="#8c8f96"/><rect y="78" width="160" height="2.5" fill="#a5a8ae"/><path d="M0 94h160" stroke="#f2b705" stroke-width="3" stroke-dasharray="10 8"/>'
 +'<g fill="#1f232c"><rect x="12" y="81" width="34" height="4.5" rx="2"/><rect x="15" y="85" width="3.5" height="6"/><rect x="40" y="85" width="3.5" height="6"/></g>'
 +'<g><circle cx="116" cy="86" r="6" fill="#1f232c"/><circle cx="116" cy="86" r="2" fill="#8c8f96"/><circle cx="130" cy="88" r="4.5" fill="#2a2e38"/><circle cx="130" cy="88" r="1.5" fill="#8c8f96"/><rect x="140" y="85" width="14" height="3" rx="1.5" fill="#1f232c"/><rect x="139" y="83" width="4" height="7" rx="1.5" fill="#e63946"/><rect x="151" y="83" width="4" height="7" rx="1.5" fill="#e63946"/></g>'
 +'<path d="M56 86c4-6 12-6 14 0s-10 6-14 0z" fill="none" stroke="#2a9d8f" stroke-width="2"/></svg>';
const GYM=SV+'<rect width="160" height="100" fill="url(#gBF)"/><g fill="#f4f4f4" opacity=".9"><rect x="10" y="4" width="34" height="2.5" rx="1"/><rect x="62" y="4" width="34" height="2.5" rx="1"/><rect x="114" y="4" width="34" height="2.5" rx="1"/></g>'
 +'<rect y="24" width="160" height="9" fill="#ff7800"/><rect y="35" width="160" height="2" fill="#ff7800" opacity=".6"/><g fill="url(#gMir)"><rect x="8" y="40" width="44" height="34"/><rect x="58" y="40" width="44" height="34"/><rect x="108" y="40" width="44" height="34"/></g>'
 +'<g fill="#121214"><path d="M14 74l8-16h18l-2 4H25l-5 12z"/><rect x="12" y="73" width="30" height="4" rx="2"/><path d="M40 58v-8h3v8z"/><path d="M60 74l8-16h18l-2 4H71l-5 12z"/><rect x="58" y="73" width="30" height="4" rx="2"/><path d="M86 58v-8h3v8z"/></g>'
 +'<g fill="#121214"><rect x="112" y="52" width="40" height="3" rx="1"/><rect x="114" y="55" width="3" height="22"/><rect x="147" y="55" width="3" height="22"/><rect x="112" y="63" width="40" height="3" rx="1"/></g><g fill="#ff7800"><circle cx="119" cy="51" r="3"/><circle cx="127" cy="51" r="3"/><circle cx="137" cy="51" r="3"/><circle cx="145" cy="51" r="3"/><circle cx="119" cy="62" r="3.4"/><circle cx="128" cy="62" r="3.4"/><circle cx="137" cy="62" r="3.4"/><circle cx="146" cy="62" r="3.4"/></g>'
 +'<rect y="77" width="160" height="23" fill="#2b2b30"/><g stroke="#3a3a40" stroke-width="1"><path d="M0 85h160M0 93h160M40 77v23M80 77v23M120 77v23"/></g><rect y="77" width="160" height="2" fill="#ff7800"/></svg>';
const scene=(p,k,o)=>illScene(p,o);
const PL=[['street','Street'],['garage','Garage'],['salle','Salle']];
const TY=[['classique','Classique (80 %)','','#e0a300'],['pyramide','Pyramide','','#8a5cf6'],['emom','EMOM','','#0ea5c6'],['controle','Contrôle','perfectionnement de skills','#0f9d8a'],['explo','Explosivité','','#ff5a1f'],['force','Force','salle ou poids basique','#d41f4f']];
const EXG0=[['Poids du corps',['Tractions','Chin-ups','Traction grosse barre','Pompes','Pompes surélevées','Dips','Muscle-up','Barre de singe','Montées de jambes','Rowing Superman','Dead hang','Déviation ulnaire']],
 ['Haltères & charges',['Bench press','Rowing à la barre','Rowing haltère','Élévations latérales haltères','Élévations latérales élastiques','Halo']]];
const tyC=Object.fromEntries(TY.map(t=>[t[0],t[3]])),tyN=Object.fromEntries(TY.map(t=>[t[0],t[1]])),plN=Object.fromEntries(PL);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const key=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parse=k=>{const[a,b,c]=k.split('-').map(Number);return new Date(a,b-1,c)};
const monday=d=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x};
const add=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const wkOf=k=>key(monday(parse(k)));
const fmtDay=d=>d.toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long'});
const mName=(y,m,f)=>new Date(y,m,1).toLocaleDateString(LOC(),{month:f||'short'}).replace('.','');
const rot=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return (Math.abs(h)%17)-8};
const f1=v=>v.toFixed(1).replace('.',DEC());
const T=new Date(),TK=key(T),TW=wkOf(TK);
const clone=x=>JSON.parse(JSON.stringify(x));
let S={sessions:[],rest:[],exg:clone(EXG0),comps:[],recs:[],demo:false},view=new Date(T.getFullYear(),T.getMonth(),1),sel=TK,form=null,edit=false,store=null,DB=null,USER=null,MYID=null,others=[];
const $=id=>document.getElementById(id);
const okT=t=>tyC[t]!==undefined;

function demo(){let r=11;const rnd=()=>(r=r*16807%2147483647)/2147483647;const out=[],rest=[];const ty=TY.map(t=>t[0]),exs=EXG0[0][1];let n=0;
  for(let d=add(T,-200);key(d)<=TK;d=add(d,1)){const m=d.getMonth(),p={7:.62,6:.5,5:.45,8:.42,9:.36,10:.3}[m]??.35;
    if(rnd()<p){const place=PL[Math.floor(rnd()*3)][0],t=[ty[Math.floor(rnd()*6)]],ex=[exs[Math.floor(rnd()*6)],exs[6+Math.floor(rnd()*6)]];if(place==='garage')ex.push(EXG0[1][1][Math.floor(rnd()*6)]);out.push({id:'d'+(n++),date:key(d),place,types:t,ex})}
    else if(rnd()<.25)rest.push(key(d))}
  return{sessions:out,rest}}

const sOf=k=>S.sessions.filter(s=>s.date===k);
const isRest=k=>S.rest.includes(k);
const stk=(t,cls)=>'<span class="st'+(cls||'')+'" style="background:'+tyC[t]+';transform:rotate('+rot(t+cls)+'deg)" title="'+esc(tyN[t])+'">'+ic(t)+'</span>';
const streak=()=>{let n=0,d=new Date(T);if(!sOf(key(d)).length)d=add(d,-1);while(sOf(key(d)).length){n++;d=add(d,-1)}return n};
const weekCounts=()=>{const w={};S.sessions.forEach(s=>{const k=wkOf(s.date);w[k]=(w[k]||0)+1});return w};

let lastH='#accueil',curV='home';
function setHead(){const v=curV,hc=v==='home',T2={cal:['Calendrier','Tes séances'],pr:['Progrès','Tes performances'],tools:['Outils',{tm:'Minuteurs',wu:'Échauffement',adv:'Conseils',tuto:'Tutos'}[S.xtab]||'Outils'],set:['Carnet de séances','Réglages'],nut:['Nutrition',S.ntab==='supp'?'Compléments':typeof nutHead==='function'?nutHead():'Aujourd\'hui'],notes:['Carnet','Mes notes']};
  document.body.dataset.v=v;$('hLogo').hidden=!hc;$('figs').hidden=!hc;$('back').hidden=v!=='set';$('gear').hidden=v==='set';
  if(hc){$('hKick').textContent='Carnet de séances';$('hello').textContent=shownName()?'Salut '+shownName()+' !':'Salut !'}else{$('hKick').textContent=T2[v][0];$('hello').textContent=T2[v][1]}}
function route5(){const h=location.hash.slice(1);
  const M={calendrier:'cal',programmes:'cal',progres:'pr',mesures:'pr',stats:'pr',graphiques:'pr',records:'pr',skills:'pr',outils:'tools',seance:'tools',minuteurs:'tools',plus:'tools',echauffement:'tools',conseils:'tools',tutos:'tools',nutrition:'nut',repas:'nut',complements:'nut',carnet:'notes',reglages:'set'},v=h.startsWith('reglages')?'set':(M[h]||'home');
  if(v==='pr'&&h!=='progres')S.ptab=h==='graphiques'?'stats':h==='mesures'?'mz':h;
  if(v==='tools')S.xtab={echauffement:'wu',conseils:'adv',tutos:'tuto',plus:S.xtab&&S.xtab!=='tm'?S.xtab:'wu'}[h]||'tm';
  if(v==='nut'){if(h==='complements')S.ntab='supp';else if(h==='repas')S.ntab='meal';if(S.ntab!=='supp')S.ntab='meal'} /* v7.5 : Nutrition = Repas | Compléments */
  if(v!=='set')lastH='#'+(h||'accueil');curV=v;const pt=S.ptab,xt=S.xtab;
  const show={vHome:v==='home',vCal:v==='cal',progBar:v==='pr',vMz:v==='pr'&&pt==='mz',vGr:v==='pr'&&pt==='stats',vRe:v==='pr'&&pt==='records',vSk:v==='pr'&&pt==='skills',vTools:v==='tools'&&xt==='tm',plusBar:v==='tools',vWu:v==='tools'&&xt==='wu',vAdv:v==='tools'&&xt==='adv',vTuto:v==='tools'&&xt==='tuto',nutBar:v==='nut',vNut:v==='nut'&&S.ntab!=='supp',vSupp:v==='nut'&&S.ntab==='supp',vNotes:v==='notes',vSet:v==='set',vCo:false};
  Object.keys(show).forEach(id=>{$(id).hidden=!show[id]});$('fab').hidden=v!=='cal';
  [['tHome','home'],['tCal','cal'],['tNut','nut'],['tTools','tools'],['tPr','pr'],['tNotes','notes']].forEach(([id,x])=>{const e=$(id);if(e)e.setAttribute('aria-current',v===x?'page':'false')});
  setHead();
  if(v==='pr')$('progSeg').innerHTML=[['mz','Mesures'],['stats','Stats'],['records','Records'],['skills','Skills']].map(x=>'<button type="button" data-pt="'+x[0]+'" aria-pressed="'+(pt===x[0])+'">'+x[1]+'</button>').join('');
  if(v==='tools')$('plusSeg').innerHTML=[['tm','Minuteurs'],['wu','Échauffement'],['adv','Conseils'],['tuto','Tutos']].map(x=>'<button type="button" data-xt="'+x[0]+'" aria-pressed="'+(xt===x[0])+'">'+x[1]+'</button>').join('');
  if(v==='home')renderHome();if(v==='cal')render();
  if(v==='pr'){if(pt==='mz')renderMz();else if(pt==='stats')renderStatsPage();else if(pt==='records'){renderTests();renderGoals();renderRecs();renderBadges()}else renderSkills()}
  if(v==='tools'){if(xt==='tm')renderTm();else if(xt==='wu')renderWU();else if(xt==='adv')renderAdv();else{renderLinks();renderGuideList()}}
  if(v==='nut')$('nutSeg').innerHTML=[['meal','Repas'],['supp','Compléments']].map(x=>'<button type="button" data-nt="'+x[0]+'" aria-pressed="'+((S.ntab==='supp'?'supp':'meal')===x[0])+'">'+x[1]+'</button>').join('');
  if(v==='nut'&&S.ntab!=='supp'&&typeof renderNut==='function')renderNut();
  if(v==='nut'&&S.ntab==='supp'&&typeof renderSupp==='function')renderSupp();
  if(v==='notes'&&typeof renderNotes==='function')renderNotes();
  if(v==='set'){renderSet();renderSet2()}
  window.scrollTo(0,0);if(v==='home')countUp($('figs'));const cur=Object.keys(show).find(id=>show[id]&&id!=='progBar'&&id!=='plusBar'&&id!=='nutBar');if(cur)countUp($(cur))}
function render(){
  const spc=typeof spCalOn==='function'&&spCalOn(),cm=S.calMode==='c'&&spc,wkm=S.calMode==='w',g=$('grid');
  $('calSeg').innerHTML='<button type="button" data-cal="m" aria-pressed="'+(!wkm&&!cm)+'">Mois</button><button type="button" data-cal="w" aria-pressed="'+(wkm&&!cm)+'">Semaine</button>'+(spc?'<button type="button" data-cal="c" aria-pressed="'+cm+'">Compléments</button>':'');
  /* v7.5 : calendrier « Compléments alimentaires », distinct du calendrier des séances */
  /* v7.7 : page « Programmes » (dans l'onglet Calendrier) et bandeau du programme actif */
  const pv=location.hash==='#programmes',cpl=$('calPl'),pst=$('plStrip');
  if(cpl){cpl.hidden=!pv;$('calSeg').hidden=pv;$('banner').hidden=pv;if(pst){pst.hidden=pv||cm;pst.innerHTML=!pv&&!cm&&typeof plStrip==='function'?plStrip():''}
    if(pv){if($('calSp'))$('calSp').hidden=true;document.querySelector('#vCal .calhead').hidden=true;document.querySelector('.dow').hidden=true;g.hidden=true;$('detail').hidden=true;$('fab').hidden=true;cpl.innerHTML=plPage();return}}
  const csp=$('calSp');if(csp){csp.hidden=!cm;document.querySelector('#vCal .calhead').hidden=cm;g.hidden=cm;$('detail').hidden=cm;$('fab').hidden=cm||curV!=='cal';
    if(cm){document.querySelector('.dow').hidden=true;csp.innerHTML=spCalHtml();return}}
  document.querySelector('.dow').hidden=wkm;
  if(wkm){const m0=monday(parse(sel)),days=[0,1,2,3,4,5,6].map(i=>add(m0,i)),e=days[6];
    $('month').innerHTML='Semaine '+isoW(m0)+'<small>'+esc(m0.getDate()+(m0.getMonth()!==e.getMonth()?' '+mName(m0.getFullYear(),m0.getMonth()):'')+' – '+e.getDate()+' '+mName(e.getFullYear(),e.getMonth())+' '+e.getFullYear())+'</small>';
    g.className='wlist';
    g.innerHTML=days.map(d=>{const k=key(d),ss=sOf(k),rest=!ss.length&&isRest(k);let body;
      if(ss.length){const s0=ss[0],ty=[...new Set(ss.flatMap(x=>x.types.filter(okT)))],ex=[...new Set(ss.flatMap(x=>x.ex))],dur=ss.reduce((a,x)=>a+sDur(x),0);
        body='<span class="wst">'+ty.slice(0,4).map(t=>stk(t,'')).join('')+'</span><span class="wex">'+esc(ex.length?ex.slice(0,3).join(', ')+(ex.length>3?' +'+(ex.length-3):''):(ss.length>1?ss.length+' séances':'Séance'))+'</span><span class="wmeta">'+esc([ss.length>1?ss.length+' séances':(plN[s0.place]||''),s0.tod?todN[s0.tod]:'',dur?fmtDur(dur):''].filter(Boolean).join(' · '))+(feelOf(s0)?' '+feelOf(s0)[1]:'')+'</span>'}
      else if(rest)body='<span class="wrest"><span>Repos</span></span>';
      else body=(typeof plWeekRow==='function'&&plWeekRow(k))||'<span class="wnone">'+(k>TK?'À venir':'Rien de noté')+'</span>';
      return '<button type="button" class="wrow'+(k===TK?' today':'')+(k===sel?' sel':'')+(ss.length?' has':'')+'" data-k="'+k+'" aria-label="'+esc(fmtDay(d))+'"><span class="wd"><b>'+esc(d.toLocaleDateString(LOC(),{weekday:'short'}).replace('.',''))+'</b><i>'+d.getDate()+'</i></span><span class="wbody">'+body+'</span>'+(ss.length?'<span class="wpic">'+scene(ss[0].place,k,{who:1,fam:i7fam(ss,ss[0].place)})+'</span>':rest?'<span class="wpic">'+illTile('rest')+'</span>':'')+'</button>'}).join('')}
  else{const mo=view.getMonth();$('month').textContent=view.toLocaleDateString(LOC(),{month:'long',year:'numeric'});g.className='grid';
    const start=monday(view),cells=[];for(let i=0;i<42;i++){const d=add(start,i);if(i>=35&&d.getMonth()!==mo)break;cells.push(d)}
    g.innerHTML=cells.map((d,i)=>{const k=key(d),ss=sOf(k),ty=[];ss.forEach(s=>s.types.filter(okT).forEach(t=>{if(!ty.includes(t))ty.push(t)}));
      const rest=!ss.length&&isRest(k),scn=ss.length||rest?'<span class="scn">'+illDay(k)+'</span>':illDeco(k),st=ty.slice(0,3).map(t=>stk(t,'')).join('')+(ty.length>3?'<span class="more">+'+(ty.length-3)+'</span>':'');
      const plc=typeof plCell==='function'?plCell(k):'',plk=plc?(plc.includes('st-miss')?' plh plm':plc.includes('st-plan')?' plh':''):'';
      return (i%7===0?'<span class="wn" aria-hidden="true">'+isoW(d)+'</span>':'')+'<button type="button" class="day'+(d.getMonth()!==mo?' out':'')+(k===TK?' today':'')+(k===sel?' sel':'')+(ss.length?' has':'')+(rest?' rest':'')+plk+'" data-k="'+k+'" aria-label="'+esc(fmtDay(d))+(rest?', repos':', '+ss.length+' séance(s)')+'"'+(plk?' data-plk="'+esc(plCellLab(k))+'"':'')+'>'+scn+'<span class="n">'+d.getDate()+'</span>'+(ss.length?'<span class="stk">'+st+'</span>':'')+plc+'</button>'}).join('')}
  const run=noRestRun();$('banner').innerHTML=run>=7&&S.restAck!==TK?'<div class="banner rest"><span class="bimg">'+BED+'</span><span><b>'+run+' jours d\'affilée sans repos</b>Ton corps progresse pendant la récupération : pense à t\'accorder une journée off.</span><button type="button" id="restOk">OK</button></div>':'';
  renderDetail();renderStats();if(!$('vHome').hidden)renderHome();if(!$('vGr').hidden)renderStatsPage();
}
function renderDetail(){
  const ss=sOf(sel),rest=isRest(sel),ph=typeof plDayHtml==='function'?plDayHtml(sel):'',hasPl=!!ph&&plOn(sel).some(i=>!i.sid&&plSt(i)!=='skip');
  /* v7.7 : jour de repos aussi pour un jour à venir (planification), sauf s'il a une séance prévue (la reporter d'abord) */
  $('detail').innerHTML='<div class="dh"><h3>'+esc(fmtDay(parse(sel)))+'</h3><div class="row">'+(ss.length||hasPl?'':'<button type="button" class="btn ghost" id="rest">'+(rest?'Retirer le repos':'Jour de repos')+'</button>')+(sel<=TK?'<button type="button" class="btn" id="add">+ Séance</button>':'')+'</div></div>'
  +ph+(!ss.length&&!rest&&ph?'':ss.length?ss.map(s=>{const f=feelOf(s),meta=[s.tod?todN[s.tod]:'',s.dur?fmtDur(s.dur):'',f?f[1]+' '+f[2]:'',sVol(s)?'Volume '+fmtKg(sVol(s)):''].filter(Boolean);
    return '<div class="sess"><div class="pic">'+scene(s.place,s.date,{who:1,fam:i7fam([s],s.place)})+'<b class="tagp">'+esc(plN[s.place]||s.place)+'</b></div><div><div class="stickers">'+s.types.filter(okT).map(t=>'<span class="stkr" style="background:'+tyC[t]+';transform:rotate('+(rot(s.id+t)/3)+'deg)"><span class="ic">'+ic(t)+'</span>'+esc(tyN[t])+'</span>').join('')+'</div>'+(meta.length?'<div class="smeta">'+meta.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>':'')+(s.ex.length?'<div class="exl">'+s.ex.map(x=>'<span>'+esc(x)+perfTxt(s,x)+'</span>').join('')+'</div>':'')+(s.note?'<p class="snote">'+esc(s.note)+'</p>':'')+'</div><div class="sbtn"><button type="button" class="ib" data-edit="'+esc(s.id)+'" aria-label="Modifier la séance">'+PEN+'</button><button type="button" class="ib" data-more="'+esc(s.id)+'" aria-label="Partager, dupliquer, déplacer ou supprimer">'+DOTS+'</button></div></div>'}).join('')
  :rest?'<div class="empty"><span class="bedbig r7">'+illTile('rest')+'</span><span><b>Repos</b>'+emo('Récupération, ça fait partie de l\'entraînement. 😴')+'</span></div>'
  :(sel>TK?emptyArt('Pas encore passé','Ce jour n\'est pas encore arrivé.','sleep'):emptyArt('Rien de noté','Ajoute une séance ou marque ce jour comme repos.','idle')));
}
function stats(list){const t={},p={};list.forEach(s=>{s.types.filter(okT).forEach(x=>t[x]=(t[x]||0)+1);p[s.place]=(p[s.place]||0)+1});return{n:list.length,days:new Set(list.map(s=>s.date)).size,t,p}}
function weeksIn(y,mo){const dim=new Date(y,mo+1,0).getDate(),cur=y===T.getFullYear()&&mo===T.getMonth();return Math.max(1,(cur?T.getDate():dim)/7)}
function tyBars(el,t){const max=Math.max(1,...Object.values(t));el.innerHTML=TY.map(x=>{const v=t[x[0]]||0;return '<div class="bar"><span class="lb">'+stk(x[0],'')+esc(x[1])+'</span><span class="tr"><span class="fl" style="width:'+(v/max*100)+'%;background:'+x[3]+'"></span></span><span class="v">'+v+'</span></div>'}).join('')}
function plTiles(el,p){el.innerHTML=PL.map(x=>'<div class="ptile">'+scene(x[0],TK)+'<b>'+(p[x[0]]||0)+'</b><span>'+x[1]+'</span></div>').join('')}
function renderStats(){
  const wm=monday(T),wk=[];for(let i=0;i<7;i++)wk.push(key(add(wm,i)));
  const wss=S.sessions.filter(s=>wk.includes(s.date)),n=wss.length,wdur=wss.reduce((a,s)=>a+sDur(s),0),goal=S.goal||3,ws=wStreak();
  $('figs').innerHTML='<div class="fig fi"><span class="fic">'+ring(n,goal)+'</span><div><b data-n="'+n+'" data-suf="/'+goal+'">'+n+'/'+goal+'</b><span>'+(n>=goal?'objectif atteint !':'cette semaine')+'</span></div></div>'
   +'<div class="fig fi"><span class="fic">'+flame(ws)+'</span><div><b data-n="'+ws+'">'+ws+'</b><span>semaine'+(ws>1?'s':'')+' d\'affilée</span></div></div>'
   +'<div class="fig"><b data-n="'+wdur+'" data-f="dur">'+fmtDur(wdur)+'</b><span>d\'entraînement cette semaine</span></div>';
}
const charts={};
function lineChart(id,pts,avg,every){const box=$(id),s=box.querySelector('svg');charts[id]={pts,avg,every};
  const draw=()=>{const c=charts[id],W=s.clientWidth,H=s.clientHeight;if(!W||!H)return;const p=c.pts,n=p.length,L=30,R=16,Tp=26,B=28,max=Math.max(4,...p.map(x=>x.v),...(c.avg||[]).map(x=>x||0));
    const X=i=>L+(n<2?0:i*(W-L-R)/(n-1)),Y=v=>Tp+(H-Tp-B)*(1-v/max);let g='';
    const step=max<=6?1:max<=12?2:5;for(let v=0;v<=max;v+=step){g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#2f2427"/><text x="'+(L-8)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+v+'</text>'}
    const path=p.map((x,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(x.v).toFixed(1)).join('');
    g+='<path d="'+path+'L'+X(n-1)+' '+Y(0)+'L'+X(0)+' '+Y(0)+'Z" fill="url(#gArea)"/><path d="'+path+'" fill="none" stroke="'+acc()+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    if(c.avg){const a=c.avg.map((v,i)=>v==null?'':(c.avg[i-1]==null?'M':'L')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join('');g+='<path d="'+a+'" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2" stroke-dasharray="5 5"/>'}
    const ev=W<520?c.every*2:c.every,mi=p.reduce((b,x,i)=>x.v>p[b].v?i:b,0);
    p.forEach((x,i)=>{const lab=i%ev===(n-1)%ev;g+='<circle cx="'+X(i)+'" cy="'+Y(x.v)+'" r="'+(i===n-1||i===mi?5:3)+'" fill="'+(i===n-1?'#fff':acc())+'" stroke="#171214" stroke-width="2"/>';
      if(n<=12||i===n-1||i===mi)g+='<text class="v" x="'+X(i)+'" y="'+(Y(x.v)-10)+'" text-anchor="middle">'+esc(x.t||x.v)+'</text>';
      if(lab)g+='<text x="'+X(i)+'" y="'+(H-8)+'" text-anchor="middle">'+esc(x.l)+'</text>'});
    s.innerHTML=g;chart6(s,c)};
  if(!box._ro){box._ro=new ResizeObserver(()=>draw());box._ro.observe(s)}draw()}
function renderGraphs(){renderStatsPage()}
/* ---------- compétition ---------- */
const genCode=()=>{const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',b=new Uint8Array(12);crypto.getRandomValues(b);return Array.from(b,x=>a[x%a.length]).join('')};
const rhex=()=>{const b=new Uint8Array(10);crypto.getRandomValues(b);return Array.from(b,x=>x.toString(16).padStart(2,'0')).join('')};
const fmtCode=c=>c.replace(/(.{4})(?=.)/g,'$1-');
async function hsh(c){try{const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('carnet:'+c));return Array.from(new Uint8Array(d).slice(0,10),x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let h=0;for(const ch of c)h=(h*131+ch.charCodeAt(0))>>>0;return ('00000000000000000000'+h.toString(16)).slice(-20)}}
const rowsOf=res=>{const a=Array.isArray(res)?res:(res?.docs||res?.items||res?.rows||[]);return a.map(d=>({id:d.id??d.key,data:typeof d.data==='function'?d.data():(d.data??d)}))};
const hashesOf=d=>(Array.isArray(d?.c)?d.c:[]).map(x=>typeof x==='string'?x:x&&x.h);
const MC=['#e4ff1a','#ffffff','#f2b705','#0ea5c6','#8a5cf6','#0f9d8a'];
const TROPHY='<svg viewBox="0 0 64 64"><path d="M20 12h-7a8 8 0 0 0 8 11M44 12h7a8 8 0 0 1-8 11" fill="none" stroke="#c8930f" stroke-width="4" stroke-linecap="round"/><path d="M19 8h26v13a13 13 0 0 1-26 0z" fill="url(#gGold)"/><path d="M24 12v9a8 8 0 0 0 3 6" stroke="#fff" stroke-opacity=".6" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M32 12.5l2 4.2 4.6.6-3.3 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.3-3.2 4.6-.6z" fill="#fff8d6"/><path d="M28 33h8l1 8h-10z" fill="#d9a514"/><rect x="21" y="41" width="22" height="5" rx="2" fill="#c8930f"/><rect x="17" y="46" width="30" height="9" rx="3" fill="#3a2a10"/><rect x="24" y="49" width="16" height="3" rx="1.5" fill="#f5c542"/></svg>';
const POOP='<svg viewBox="0 0 64 64"><path d="M13 52c-6 0-6-11 3-11h32c9 0 9 11 3 11z" fill="#6e4220"/><path d="M17 42c-5 0-5-10 3-10h24c8 0 8 10 3 10z" fill="#85542a"/><path d="M22 33c-4 0-4-9 3-9h14c7 0 7 9 3 9z" fill="#9c6a35"/><path d="M27 25c-3-7 5-10 9-14 1 5 5 7 2 14z" fill="#9c6a35"/><path d="M20 37c3 1 6 1 9 0" stroke="#b07a40" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="25.5" cy="38" r="3.6" fill="#fff"/><circle cx="38.5" cy="38" r="3.6" fill="#fff"/><circle cx="26.2" cy="38.7" r="1.7" fill="#1a1010"/><circle cx="39.2" cy="38.7" r="1.7" fill="#1a1010"/><path d="M26 46q6 4 12 0" stroke="#3a2010" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
const sk=(svg,c)=>'<span class="sk'+(c?' '+c:'')+'">'+svg+'</span>';
async function publish(){if(!DB||!MYID)return;try{
  if(!Array.isArray(S.decoys)||S.decoys.length<8){S.decoys=Array.from({length:8},rhex)}
  const real=[];for(const c of S.comps)real.push(c.h||(c.h=await hsh(c.code)));
  const slots=real.concat(S.decoys.slice(0,Math.max(0,8-real.length))).sort();
  const wc=S.demo?{}:weekCounts(),w={},mo={};let m=monday(T);for(let i=0;i<26;i++){const k=key(m);if(wc[k])w[k]=wc[k];m=add(m,-7)}
  for(let i=0;i<13;i++){const d=new Date(T.getFullYear(),T.getMonth()-i,1),k=d.getFullYear()+'-'+pad(d.getMonth()+1),n=S.demo?0:S.sessions.filter(s=>s.date.startsWith(k)).length;if(n)mo[k]=n}
  await DB.collection('sc').doc(MYID).set(real.length?{w,mo,c:slots,t:new Date().toISOString()}:{w:{},mo:{},c:slots,t:new Date().toISOString()})}catch(e){const el=$('cMsg');if(el)el.textContent='Impossible de partager tes scores : vérifie que tu as un accès qui permet d\'utiliser l\'appli (pas seulement la consulter).'}}
async function fetchOthers(){if(!DB)return;try{others=rowsOf(await DB.collection('sc').get())}catch(e){others=[]}}
let names={};
async function loadNames(ids){if(!USER||!ids.length)return;try{const ps=await USER.profiles(ids);ids.forEach(id=>{names[id]=(ps&&ps[id]&&ps[id].name)||names[id]||''})}catch(e){}}
const nameOf=id=>id===MYID?'Toi':(names[id]||'Membre');
function membersOf(c){const mem=others.filter(o=>o.id!==MYID&&hashesOf(o.data).includes(c.h));const mo={};S.sessions.forEach(s=>{const k=s.date.slice(0,7);mo[k]=(mo[k]||0)+1});mem.unshift({id:MYID,data:{w:weekCounts(),mo}});return mem}
function monthResult(mem,y,m){const last=new Date(y,m+1,0),weeks=[];for(let d=monday(new Date(y,m,1));d<=last;d=add(d,7)){const th=add(d,3);if(th.getMonth()===m&&th.getFullYear()===y)weeks.push(key(d))}
  const pts={};mem.forEach(x=>pts[x.id]=0);let winner=null,decided=false;
  for(const k of weeks){if(k>=TW)break;const vals=mem.map(x=>({id:x.id,v:(x.data.w||{})[k]||0})),mx=Math.max(...vals.map(v=>v.v));if(mx>0){const top=vals.filter(v=>v.v===mx);top.forEach(t=>pts[t.id]+=top.length>1?1:3)}
    if(!decided){const reach=mem.filter(x=>pts[x.id]>=5).sort((a,b)=>pts[b.id]-pts[a.id]);if(reach.length&&(reach.length===1||pts[reach[0].id]>pts[reach[1].id])){winner=reach[0].id;decided=true}}}
  const ended=weeks.length&&weeks[weeks.length-1]<TW;
  if(!decided&&ended){const sorted=mem.slice().sort((a,b)=>pts[b.id]-pts[a.id]);if(sorted.length>1&&pts[sorted[0].id]>0&&pts[sorted[0].id]>pts[sorted[1].id])winner=sorted[0].id}
  return{weeks,pts,winner,done:decided||ended}}
function mlChart(box,labels,series){const s=box.querySelector('svg');box._d={labels,series};
  const draw=()=>{const{labels:lb,series:se}=box._d,W=s.clientWidth,H=s.clientHeight;if(!W||!H)return;const n=lb.length,L=30,R=14,Tp=18,B=26,max=Math.max(4,...se.flatMap(x=>x.vals));
    const X=i=>L+i*(W-L-R)/Math.max(1,n-1),Y=v=>Tp+(H-Tp-B)*(1-v/max);let g='';const step=max<=8?2:max<=20?5:10;
    for(let v=0;v<=max;v+=step)g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#2f2427"/><text x="'+(L-8)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+v+'</text>';
    se.forEach(x=>{g+='<path d="'+x.vals.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join('')+'" fill="none" stroke="'+x.color+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';x.vals.forEach((v,i)=>{g+='<circle cx="'+X(i)+'" cy="'+Y(v)+'" r="3" fill="'+x.color+'"/>'})});
    const ev=W<520?3:2;lb.forEach((l,i)=>{if(i%ev===(n-1)%ev)g+='<text x="'+X(i)+'" y="'+(H-6)+'" text-anchor="middle">'+esc(l)+'</text>'});s.innerHTML=g};
  if(!box._ro){box._ro=new ResizeObserver(()=>draw());box._ro.observe(s)}draw()}
const THUMB='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 10.5h3.5V21H2zM7 21V10.2l4.2-7.4a2.2 2.2 0 0 1 3.9 1.7L14.3 9H20a2 2 0 0 1 2 2.4l-1.6 8A2 2 0 0 1 18.4 21z"/></svg>';
const CROWN='<svg class="crown" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>';
function race(wk,mx,lead){const top=wk.filter(x=>x.v===mx).length,lanes=wk.map(x=>{const st=mx===0?'tie':x.v===mx?(top===1?'win':'tie'):'lose',h=mx?18+82*x.v/mx:18;
    return '<div class="lane '+st+'"><span class="thumb">'+THUMB+'</span><div class="tower" style="height:'+h+'%"><b>'+x.v+'</b></div><span class="nm">'+(st==='win'?CROWN:'')+esc(nameOf(x.id))+'</span></div>'});
  const html=lanes.length===2?lanes[0]+'<span class="vs">VS</span>'+lanes[1]:lanes.join('');
  const msg=mx===0?'Personne n\'a encore de séance cette semaine.':top>1?'Égalité pour l\'instant.':(wk[0].id===MYID?'Tu mènes ! Garde le rythme.':esc(nameOf(wk[0].id))+' mène. À toi de jouer.');
  return '<div class="race">'+html+'</div><p class="racenote">'+msg+' Séances cette semaine.</p>'}
async function renderComp(refresh){
  const head=$('coHead');
  if(!DB||!MYID){head.innerHTML='<h2 class="t">Compétition</h2><p class="findsub">La compétition marche quand l\'appli est ouverte sur claude.ai, connecté à ton compte Claude. Les personnes invitées doivent aussi avoir un compte et un accès qui leur permet d\'utiliser l\'appli.</p>';$('coList').innerHTML='';return}
  if(refresh){await publish();await fetchOthers()}
  const mems=S.comps.map(c=>membersOf(c)),ids=new Set();mems.forEach(m=>m.forEach(x=>{if(x.id!==MYID)ids.add(x.id)}));await loadNames([...ids]);
  let tro=0,poo=0;const res=S.comps.map((c,ci)=>{const mem=mems[ci],sm=(c.since||TK).slice(0,7),hist=[];let d=new Date(Number(sm.slice(0,4)),Number(sm.slice(5,7))-1,1);
    while(d<=T){const r=monthResult(mem,d.getFullYear(),d.getMonth());r.y=d.getFullYear();r.m=d.getMonth();hist.push(r);if(r.done&&r.winner){r.winner===MYID?tro++:poo++}d=new Date(d.getFullYear(),d.getMonth()+1,1)}return hist});
  head.innerHTML='<div class="ch"><div><h3>Tes compétitions</h3><p>Une compétition se joue sur un mois. Chaque semaine, celui qui a fait le plus de séances gagne 3 points (égalité : 1 point chacun). Premier à 5 points, ou meilleur score à la fin du mois : trophée. Les autres : caca.</p></div><div class="row"><div class="tally"><span>'+sk(TROPHY,'sm')+tro+'</span><span>'+sk(POOP,'sm')+poo+'</span></div><button type="button" class="btn ghost sm" id="cRef">Actualiser</button></div></div>';
  $('coList').innerHTML=S.comps.length?S.comps.map((c,ci)=>{const mem=mems[ci],hist=res[ci],cur=hist[hist.length-1],col=id=>MC[mem.findIndex(x=>x.id===id)%MC.length];
    const wk=mem.map(x=>({id:x.id,v:(x.data.w||{})[TW]||0})).sort((a,b)=>b.v-a.v),mx=wk[0]?.v||0,lead=wk.filter(x=>x.v===mx).length===1&&mx>0;
    const prog=mem.map(x=>({id:x.id,p:cur.pts[x.id]||0})).sort((a,b)=>b.p-a.p);
    const past=hist.filter(h=>h.done).slice().reverse();
    return '<section class="panel comp"><div class="ch"><div style="display:flex;gap:12px;align-items:center">'+sk(TROPHY,'lg')+'<div><h3>'+esc(c.name)+'</h3><p>Code : '+esc(fmtCode(c.code))+' · '+mem.length+' membre'+(mem.length>1?'s':'')+'</p></div></div><div class="row"><button type="button" class="btn ghost sm" data-copy="'+ci+'">Copier le code</button><button type="button" class="btn ghost sm" data-leave="'+ci+'">Quitter</button></div></div>'
    +(mem.length<2?'<p class="note" style="margin-top:0">Personne n\'a encore rejoint. Envoie le code '+esc(fmtCode(c.code))+' à ton adversaire.</p>':'')
    +'<h2 class="t" style="font-size:18px;margin-top:6px">'+esc(mName(cur.y,cur.m,'long').replace(/^./,x=>x.toUpperCase()))+' <span class="status">'+(cur.done&&cur.winner?'Gagné par '+esc(nameOf(cur.winner)):'Premier à 5 points')+'</span></h2><div class="prog">'+prog.map(x=>'<div class="pr"><span class="nm">'+esc(nameOf(x.id))+'</span><span class="tr"><span class="fl" style="width:'+Math.min(100,x.p*20)+'%;background:'+col(x.id)+'"></span></span><span class="v">'+x.p+'/5</span></div>').join('')+'</div>'
    +'<h2 class="t" style="font-size:18px;margin-top:18px">Cette semaine</h2>'+race(wk,mx,lead)+'<h2 class="t" style="font-size:18px;margin-top:18px">Historique</h2>'+(past.length?'<div class="hist">'+past.map(h=>'<div class="hr"><span class="mo">'+esc(mName(h.y,h.m,'long')+' '+h.y)+'</span>'+mem.map(x=>'<span class="who">'+(h.winner?sk(x.id===h.winner?TROPHY:POOP,'sm'):'')+esc(nameOf(x.id))+' · '+(h.pts[x.id]||0)+' pts</span>').join('')+(h.winner?'':'<span class="status">Égalité</span>')+'</div>').join('')+'</div>':'<p class="note" style="margin-top:0">Le premier mois n\'est pas encore terminé.</p>')
    +'<h2 class="t" style="font-size:18px;margin-top:18px">Sur l\'année · séances par mois</h2><div class="chart sm" id="yc'+ci+'"><svg></svg></div><div class="leg">'+mem.map(x=>'<span><i style="background:'+col(x.id)+'"></i>'+esc(nameOf(x.id))+'</span>').join('')+'</div></section>'}).join('')
  :'<section class="panel"><div class="empty" style="margin:0">'+sk(TROPHY,'lg')+'<span><b>Aucune compétition</b>Crée-en une ou rejoins celle d\'un ami avec son code.</span></div></section>';
  S.comps.forEach((c,ci)=>{const mem=mems[ci],lb=[],ks=[];for(let i=11;i>=0;i--){const d=new Date(T.getFullYear(),T.getMonth()-i,1);ks.push(d.getFullYear()+'-'+pad(d.getMonth()+1));lb.push(mName(d.getFullYear(),d.getMonth()))}
    const box=$('yc'+ci);if(box)mlChart(box,lb,mem.map((x,i)=>({color:MC[i%MC.length],vals:ks.map(k=>(x.data.mo||{})[k]||0)})))});
}
/* ---------- records ---------- */
const CHEERS=['Bien joué ! 💪','Continue comme ça ! 🔥','T\'es fort ! 🦾','Nouveau record ! 🏆','Énorme ! 🚀','Rien ne t\'arrête ! ⚡'];
const isLoad=n=>S.exg.some(g=>/halt|charge/i.test(g[0])&&g[1].includes(n));
const recMax=r=>Math.max(...r.hist.map(h=>h.v));
function celebrate5(name,v,unit){boomMsg(CHEERS[Math.floor(Math.random()*CHEERS.length)],name+' : '+fmtN(v)+' '+unitL(unit))}
function boomMsg(msg,sub,art){const o=$('boom');
  /* v6.3 : plus de pouces qui volent ni de smiley ; le perso (ou une coche) suffit */
  o.innerHTML='<div class="bx">'+(art||'<span class="bxok" aria-hidden="true">'+ico('check')+'</span>')+'<p class="bt">'+esc(msg)+'</p>'+(sub?'<p class="bs">'+esc(sub)+'</p>':'')+'</div>';
  o.classList.remove('on');void o.offsetWidth;o.classList.add('on');clearTimeout(o._t);o._t=setTimeout(()=>o.classList.remove('on'),art?2400:2000)} /* v7.6 : plus courte */
/* v7.6 : changer un record (+, −, saisie) n'ouvre plus l'écran « Nouveau record » plein écran : un petit message rapide
   avec « Annuler » (plusieurs touches de suite = une seule annulation, qui remet la valeur d'avant). L'écran de fête reste
   pour les records battus en notant une séance. */
let recU=null;
function setRec(r,v){v=Math.max(0,Math.round(v*10)/10);const snap={id:r.id,hist:JSON.stringify(r.hist),beat:r.beat||0},prev=recMax(r),last=r.hist[r.hist.length-1];if(last.d===TK)last.v=v;else r.hist.push({d:TK,v});
  const up=v>prev;if(up)r.beat=(r.beat||0)+1;const gh=checkGoals();save();renderRecs();
  if(!recU||recU.id!==r.id||$('snack').hidden)recU=snap;const u=recU;
  snack(up?(r.unit==='kg'?'Bien joué ! Charge augmentée':'Bien joué ! Nouveau record'):'Record mis à jour','Annuler',()=>{const x=S.recs.find(q=>q.id===u.id);if(!x)return;x.hist=JSON.parse(u.hist);x.beat=u.beat;recU=null;save();renderRecs()},3500);
  if(gh.length)setTimeout(()=>boomMsg('Objectif atteint !',goalTxt(gh[0])),600)}
function spark(r){const h=r.hist.length>1?r.hist:[r.hist[0],r.hist[0]],W=200,H=56,mn=Math.min(...h.map(x=>x.v)),mx=Math.max(...h.map(x=>x.v)),rg=Math.max(1,mx-mn),X=i=>h.length<2?W/2:6+i*(W-12)/(h.length-1),Y=v=>H-6-(v-mn)/rg*(H-14);
  const d=h.map((x,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(x.v).toFixed(1)).join('');return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><path d="'+d+'L'+X(h.length-1)+' '+H+'L'+X(0)+' '+H+'Z" fill="url(#gArea)"/><path d="'+d+'" fill="none" style="stroke:var(--acct)" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>'}
function renderRecs(){
  const all=S.exg.flatMap(g=>g[1]);$('rEx').innerHTML='<option value="">Choisis un exercice…</option>'+all.filter(n=>!S.recs.some(r=>r.name===n)).map(n=>'<option>'+esc(n)+'</option>').join('')+'<option value="__autre">Autre…</option>';
  $('rList').innerHTML=S.recs.length?S.recs.map((r,i)=>{const cur=r.hist[r.hist.length-1].v,first=r.hist[0].v,gain=Math.round((cur-first)*10)/10,u=unitL(r.unit);
    return '<div class="rc"><div class="rh"><h3>'+esc(r.name)+'</h3><button type="button" class="ib sm2" data-rdel="'+i+'" aria-label="Supprimer ce record"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/></svg></button></div>'
    +'<div class="rv"><button type="button" class="pm" data-rminus="'+i+'" aria-label="Moins 1">−</button><label class="big"><input type="number" inputmode="decimal" min="0" step="'+(r.unit==='kg'?'0.5':'1')+'" value="'+cur+'" data-rset="'+i+'" aria-label="Record '+esc(r.name)+'"><span>'+u+'</span></label><button type="button" class="pm plus" data-rplus="'+i+'" aria-label="Plus 1">+</button></div>'
    +'<div class="spk">'+spark(r)+'</div><p class="rn">'+(r.hist.length>1?(gain>=0?'+':'')+String(gain).replace('.',',')+' '+u+' depuis le '+esc(parse(r.hist[0].d).toLocaleDateString(LOC(),{day:'numeric',month:'short',year:'numeric'})):'Premier record noté le '+esc(parse(r.hist[0].d).toLocaleDateString(LOC(),{day:'numeric',month:'short'})))+' · '+r.hist.length+' mise'+(r.hist.length>1?'s':'')+' à jour</p></div>'}).join('')
  :'<div class="panel" style="grid-column:1/-1">'+emptyArt('Aucun record','Ajoute tes max : tractions, dips, bench press… Tu verras ta progression au fil des mois.','flex')+'</div>';
}
/* ---------- formulaire ---------- */
function favList(){const c={};S.sessions.forEach(s=>s.ex.forEach(x=>c[x]=(c[x]||0)+1));return Object.keys(c).filter(x=>S.exg.some(g=>g[1].includes(x))).sort((a,b)=>c[b]-c[a]).slice(0,6)}
function lastPerfOf(x){const ed=form&&form.editId,L=S.sessions.filter(s=>s.id!==ed&&s.perf&&s.perf[x]).sort((a,b)=>a.date<b.date?1:-1);return L.length?L[0].perf[x]:null}
function drawPerf(){const el=$('cPerf');if(!form||!form.ex.length){el.innerHTML='';return}const LB={s:'séries',r:'répétitions',sec:'secondes',kg:'kg'};
  el.innerHTML=(typeof plPerfHead==='function'?plPerfHead():'')+'<h5>Tes performances</h5><p class="findsub" style="margin:-6px 0 10px;font-size:13px">Facultatif. En gris : ta dernière fois. Si tu bats un record, l\'appli le détecte toute seule.</p><div class="pfh"><span></span><span>Séries</span><span>Rép. / s</span><span>Kg</span></div><div class="perf">'+form.ex.map(x=>{const p=form.perf[x]||{},tm=isTimed(x),lp=lastPerfOf(x)||{};const f=(k,ph,st)=>'<input type="number" inputmode="decimal" min="0" step="'+(st||'1')+'" placeholder="'+ph+'" value="'+(p[k]||'')+'" data-pf="'+esc(x)+'" data-pk="'+k+'" aria-label="'+esc(x)+' : '+LB[k]+'">';const ep=form.pl&&form.pl[x],pr=ep?{s:ep.s,r:ep.r,sec:ep.sec,kg:ep.kg}:lp; /* v7.7 : valeurs prévues en gris quand la séance vient du programme */
    return '<div class="pf"><b>'+esc(x)+(tm?'<small>en secondes</small>':'')+'</b>'+f('s',pr.s||'–')+(tm?f('sec',pr.sec||'s'):f('r',pr.r||'–'))+f('kg',pr.kg?String(pr.kg).replace('.',','):'–','0.5')+(typeof plPerfExtra==='function'?plPerfExtra(x):'')+'</div>'}).join('')+'</div>'}
function drawForm(){
  $('cPl').innerHTML=PL.map(p=>'<button type="button" class="plc" data-pl="'+p[0]+'" aria-pressed="'+(form.place===p[0])+'">'+scene(p[0],form.date||sel)+'<span class="tagp">'+p[1]+'</span></button>').join('');
  $('cTy').innerHTML=TY.map(t=>'<button type="button" class="chip ty" data-ty="'+t[0]+'" style="--c:'+t[3]+'" aria-pressed="'+form.types.includes(t[0])+'">'+stk(t[0],' big')+'<span>'+esc(t[1])+(t[2]?'<small>'+esc(t[2])+'</small>':'')+'</span></button>').join('');
  const qi=$('fxQ'),raw=edit?'':(qi.value||'').trim(),q=norm(raw);qi.parentNode.hidden=edit;
  const chip=x=>'<button type="button" class="chip ex" data-ex="'+esc(x)+'" aria-pressed="'+form.ex.includes(x)+'">'+esc(x)+'</button>';
  if(q){const L=allEx().filter(x=>norm(x).includes(q));$('cEx').innerHTML='<div class="chips">'+L.map(chip).join('')+(L.some(x=>norm(x)===q)?'':'<button type="button" class="chip addx" data-addq="1">+ Ajouter « '+esc(raw)+' »</button>')+'</div>';drawPerf();drawMeta();return}
  const fv=edit?[]:favList();
  $('cEx').innerHTML=(fv.length?'<h5><span>Tes plus fréquents</span></h5><div class="chips">'+fv.map(chip).join('')+'</div>':'')+S.exg.map((g,gi)=>'<h5><span>'+esc(g[0])+'</span>'+(gi===0?'<button type="button" class="btn ghost sm" id="edit">'+(edit?'Terminé':'Modifier la liste')+'</button>':'')+'</h5>'+(edit
    ?'<div class="mg">'+g[1].map((x,xi)=>'<div class="mrow" data-x="'+xi+'"><span class="hdl" data-g="'+gi+'" role="button" aria-label="Glisser pour déplacer '+esc(x)+'">'+GRIP+'</span><input value="'+esc(x)+'" data-g="'+gi+'" data-x="'+xi+'" aria-label="Nom de l\'exercice" maxlength="40"><button type="button" class="ib" data-rm="'+gi+'-'+xi+'" aria-label="Retirer '+esc(x)+'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>').join('')+'<div><input id="new'+gi+'" placeholder="Nouvel exercice…" maxlength="40"><button type="button" class="btn sm" data-addx="'+gi+'">Ajouter</button></div></div>'
    :'<div class="chips">'+g[1].map(chip).join('')+'</div>')).join('');
  drawPerf();drawMeta()
}
function openForm(eid){const es=eid?S.sessions.find(s=>s.id===eid):null,lastP=(lastSess()||{}).place||'';
  form=es?{editId:es.id,date:es.date,place:es.place,types:es.types.filter(okT),ex:es.ex.slice(),perf:clone(es.perf||{}),tod:es.tod||'',dur:es.dur||'',feel:es.feel||0,note:es.note||''}
    :{date:sel>TK?TK:sel,place:lastP||'street',types:[],ex:[],perf:{},tod:(sel===TK||sel>TK)?todNow():'',dur:'',feel:0,note:''};
  if(typeof plFormOpen==='function')plFormOpen(es);$('redo').hidden=!!es||!S.sessions.length;edit=false;$('ok').textContent=es?'Enregistrer':'Coller la séance';$('err').textContent='';$('plHint').hidden=true;$('cPl').classList.remove('need');$('fxQ').value='';drawForm();$('sheet').classList.add('open');$('sheet').querySelector('.box').scrollTop=0}
function needPlace(){const b=document.querySelector('.box');b.scrollTo({top:0,behavior:'smooth'});const c=$('cPl');c.classList.remove('need');void c.offsetWidth;c.classList.add('need');$('plHint').hidden=false}
function toast(m){let el=$('toast');if(!el){el=document.createElement('div');el.id='toast';document.body.appendChild(el)}el.textContent=m;el.className='on';clearTimeout(el._t);el._t=setTimeout(()=>el.className='',1900)} /* v7.6 : 1,9 s au lieu de 2,6 s */
function close(){$('sheet').classList.remove('open');form=null;edit=false}
function toggle(a,v){const i=a.indexOf(v);i<0?a.push(v):a.splice(i,1)}
let pending=false;
function warnLocal(m){if(!navigator.onLine)return;try{if(localStorage.getItem('carnet-info')===m)return}catch(e){}let b=$('warn');if(!b){b=document.createElement('div');b.id='warn';b.setAttribute('role','alert');b.innerHTML='<span></span><button type="button" class="ib" aria-label="Fermer">✕</button>';b.querySelector('button').addEventListener('click',()=>{try{localStorage.setItem('carnet-info',b.firstChild.textContent)}catch(e){}b.remove()});document.body.prepend(b)}b.firstChild.textContent=m}

async function save(){S.upd=Date.now();const data=JSON.parse(JSON.stringify(packData()));
  try{localStorage.setItem('carnet-seances',JSON.stringify(data));bkSaveOk()}catch(e){bkSaveFail(e)} /* v7.6 : échec signalé, sauvegarde automatique (15_backup.js) */
  if(!store){$('save').textContent='Enregistré sur ce téléphone.';return}
  if(!navigator.onLine){pending=true;$('save').textContent='Hors ligne : enregistré sur ce téléphone, synchronisé au retour du réseau.';return}
  try{await store.set(data);pending=false;$('save').textContent='Enregistré sur ton compte Claude : retrouvé sur tous tes appareils.'}catch(e){pending=true;$('save').textContent='Enregistré sur ce téléphone, synchronisation dès que possible.';warnLocal('Tes séances sont enregistrées sur ce téléphone. Pour plus de sécurité, copie ta sauvegarde de temps en temps (Réglages ⚙️).')}
  if(S.comps.length)try{publish()}catch(e){}}
window.addEventListener('online',()=>{if(pending)save()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&pending&&navigator.onLine)save()});
function load(v,q){try{v=v?JSON.parse(JSON.stringify(v)):null}catch(e){v=null} /* q : sans affichage (aperçu d'une sauvegarde) */const exg=v&&Array.isArray(v.exg)&&v.exg.length?v.exg:clone(EXG0);if(v&&Array.isArray(v.custom)&&v.custom.length)exg.push(['Mes exercices',v.custom]);const comps=v&&Array.isArray(v.comps)?v.comps:[],recs=v&&Array.isArray(v.recs)?v.recs:[];
  if(v&&Array.isArray(v.sessions)&&!v.demo&&v.sessions.length+((v.rest||[]).length)+((v.recs||[]).length)>=0){S={sessions:v.sessions,rest:Array.isArray(v.rest)?v.rest:[],exg,comps,decoys:Array.isArray(v.decoys)?v.decoys:[],recs,demo:false}}else{S={sessions:[],rest:[],exg,comps,decoys:[],recs,demo:false}}S.upd=v&&v.upd||0;S.name=v&&v.name||'';S.fav=v&&Array.isArray(v.fav)?v.fav:[];S.onb=!!(v&&v.onb);loadExtra(v);if(!q)render()}
const BED='<svg viewBox="0 0 80 56" aria-hidden="true"><rect x="4" y="12" width="7" height="40" rx="2" fill="#a59c90"/><rect x="69" y="30" width="6" height="22" rx="2" fill="#a59c90"/><rect x="4" y="40" width="71" height="6" rx="2" fill="#a59c90"/><rect x="11" y="32" width="58" height="9" rx="3" fill="#f4f1ea"/><rect x="12" y="24" width="19" height="10" rx="5" fill="#fff"/><circle cx="21" cy="24" r="7" fill="#f2c29b"/><path d="M14 23a7 7 0 0 1 14-2q-5-3-10 0z" fill="#2b1d14"/><path d="M18 26q2 1.6 4 0" stroke="#2b1d14" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M27 34q2-12 18-11q16 1 24 6v5z" fill="#e4ff1a"/><path d="M30 30q14-5 38 1" stroke="#9fb300" stroke-width="1.6" fill="none"/><text x="31" y="17" font-family="Archivo,sans-serif" font-weight="900" font-size="9" fill="#fff">z</text><text x="38" y="10" font-family="Archivo,sans-serif" font-weight="900" font-size="11" fill="#fff">Z</text></svg>';

const lastSess=()=>S.sessions.slice().sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:a.id<b.id?-1:1).pop();
/* v7.7 : « 10/9/8 · 20 kg » (détail par série) */
function perfSets(p){const L=p.sets,kg=[...new Set(L.map(z=>+z.kg||0))];return L.map(z=>z.sec?z.sec+' s':(z.r||'–')).join('/')+(kg.some(Boolean)?' · '+(kg.length===1?String(kg[0]).replace('.',','):L.map(z=>String(+z.kg||0).replace('.',',')).join('/'))+' kg':'')}
function perfTxt(s,x){const p=s.perf&&s.perf[x];if(!p)return '';if(Array.isArray(p.sets)&&p.sets.length)return ' <i>'+esc(perfSets(p))+'</i>';let t='';if(p.sec)t+=' '+(p.s>1?p.s+'×':'')+p.sec+' s';else if(p.s&&p.r)t+=' '+p.s+'×'+p.r;else if(p.r)t+=' '+p.r+' rép.';else if(p.s)t+=' '+p.s+' série'+(p.s>1?'s':'');if(p.kg)t+=' · '+String(p.kg).replace('.',',')+' kg';return t?' <i>'+esc(t.trim())+'</i>':''}
function autoRecs(perf,d){let beat=null;Object.entries(perf).forEach(([x,p])=>{let r=S.recs.find(q=>q.name===x);const unit=r?r.unit:(p.sec>0?'sec':p.kg>0?'kg':'reps'),v=unit==='kg'?p.kg:unit==='sec'?p.sec:p.r;if(!(v>0))return;
  if(!r){S.recs.push({id:'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:x,unit,hist:[{d,v}]});return}
  const prev=recMax(r);if(v>prev){r.beat=(r.beat||0)+1;const last=r.hist[r.hist.length-1];if(last.d===d)last.v=v;else r.hist.push({d,v});if(!beat||v-prev>0)beat={name:x,v,unit,prev}}});return beat}
function wStreakFrom(set,start){let n=0,d=new Date(start);while(set.has(key(d))){n++;d=add(d,-7)}return n}
function wStreak(){const w=new Set(S.sessions.map(s=>wkOf(s.date)));let st=monday(T);if(!w.has(key(st)))st=add(st,-7);return wStreakFrom(w,st)}
function bestWStreak(){const w=new Set(S.sessions.map(s=>wkOf(s.date)));let b=0;w.forEach(k=>{b=Math.max(b,wStreakFrom(w,parse(k)))});return b}
function goalWeeksBest(){const w=weekCounts(),g=S.goal||3;let best=0;Object.keys(w).forEach(k=>{if(w[k]<g)return;let n=0,d=parse(k);while((w[key(d)]||0)>=g&&n<520){n++;d=add(d,-7)}best=Math.max(best,n)});return best}
function testMonthsStreak(){const has=k=>Object.keys(obj(S.tests[k])).length>0;let best=0;Object.keys(S.tests).filter(has).forEach(k=>{const [y,m]=k.split('-').map(Number);let n=0,d=new Date(y,m-1,1);while(has(d.getFullYear()+'-'+pad(d.getMonth()+1))&&n<240){n++;d=new Date(d.getFullYear(),d.getMonth()-1,1)}best=Math.max(best,n)});return best}
/* v7.3 : 10 badges de plus (200 séances, 26 et 52 semaines, 10 records, les quatre saisons, 24 h, soir, week-end, défi, mesures) ; l = étiquette affichée si différente de la clé */
function recN(){return S.recs.reduce((a,r)=>a+arr(r.hist).filter((h,i,H)=>i>0&&h.v>Math.max(...H.slice(0,i).map(x=>x.v))).length,0)}
function badgeList(){const n=S.sessions.length,bw=bestWStreak(),pl=new Set(S.sessions.map(s=>s.place)),rb=S.recs.some(r=>r.beat||r.hist.length>1),c=obj(S.cnt),skc=SKILLS.reduce((a,sk)=>a+Object.keys(skDone(sk.k)).length,0),skf=SKILLS.some(sk=>Object.keys(skDone(sk.k)).length>=sk.st.length);
  const sea=new Set(S.sessions.map(s=>['h','h','p','p','p','e','e','e','a','a','a','h'][+s.date.slice(5,7)-1])),we=S.sessions.filter(s=>[0,6].includes(parse(s.date).getDay())).length,mz=arr(S.bw).length+arr(obj(S.meas).taille).length,df=arr(S.chalH).some(x=>x.done)||!!(S.chal&&S.chal.won);
  return [['1','Première séance',n>=1],['10','10 séances',n>=10],['25','25 séances',n>=25],['50','50 séances',n>=50],['100','100 séances',n>=100],['200','200 séances',n>=200],
   ['4s','4 semaines d\'affilée',bw>=4],['12s','12 semaines d\'affilée',bw>=12],['26s','26 semaines d\'affilée',bw>=26],['52s','52 semaines d\'affilée',bw>=52],['R','Premier record battu',rb],['10R','10 records battus',recN()>=10],
   ['3L','Street, garage et salle',pl.size>=3],['4sa','Une séance à chaque saison',sea.size>=4,' '],
   ['EM','EMOM terminé',(c.emom||0)>=1],['E5','5 EMOM terminés',(c.emom||0)>=5],['PY','Pyramide terminée',(c.pyr||0)>=1],['P5','5 pyramides terminées',(c.pyr||0)>=5],['10↑','Pyramide jusqu\'à 10',(c.pyr10||0)>=1],
   ['2h','Séance de 2 h',S.sessions.some(s=>sDur(s)>=120)],['24h','24 h d\'entraînement au total',S.sessions.reduce((a,s)=>a+sDur(s),0)>=1440],['AM','5 séances le matin',S.sessions.filter(s=>s.tod==='matin').length>=5],['PM','5 séances le soir',S.sessions.filter(s=>s.tod==='soir').length>=5],['WE','10 séances le week-end',we>=10],
   ['🔥','10 séances « au top »',S.sessions.filter(s=>s.feel===3).length>=10,'TOP'],['4×','Objectif de la semaine 4 fois d\'affilée',goalWeeksBest()>=4],['DF','Défi du mois réussi',df],
   ['MAX','Test max 3 mois d\'affilée',testMonthsStreak()>=3],['KG','10 mesures notées',mz>=10],['S1','Première étape de skill',skc>=1],['S10','10 étapes de skills',skc>=10],['★','Un skill complet',skf]].map(b=>({k:b[0],t:b[1],on:!!b[2],l:b[3]||b[0]}))}
function renderBadges5(){const b=badgeList(),on=b.filter(x=>x.on).length;$('bdSub').textContent=on+' badge'+(on>1?'s':'')+' sur '+b.length+' · série actuelle : '+wStreak()+' semaine'+(wStreak()>1?'s':'')+' d\'affilée';$('badges').innerHTML=b.map(x=>'<div class="bd'+(x.on?' on':'')+'"><i>'+esc(x.k)+'</i>'+esc(x.t)+'</div>').join('')}
function renderSet(){$('setName').value=S.name||'';const n=$('setNick');if(n)n.value=S.nick||'';const g=$('setGoalT');if(g)g.value=S.goalT||''}
let onbStep=0;
function showOnb(n){onbStep=n;let o=$('onb');if(!o){o=document.createElement('div');o.id='onb';o.className='onb';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');document.body.appendChild(o)}
  const dots='<div class="dots">'+[0,1,2].map(i=>'<i class="'+(i<=n?'on':'')+'"></i>').join('')+'</div>',inst=window.navigator.standalone||matchMedia('(display-mode: standalone)').matches;
  if(n===0)o.innerHTML='<div class="in">'+dots+'<p class="kick">Bienvenue</p><h2>Ton carnet d\'entraînement</h2><p>Note tes séances en quelques secondes, suis tes stats et bats tes records. Comment tu t\'appelles ?</p><input id="onbName" placeholder="Ton prénom" maxlength="24" autocomplete="given-name" value="'+esc(S.name||'')+'"><button type="button" class="btn" data-onb="1">Suivant</button><button type="button" class="btn ghost sm onbc" data-onbcode="1">'+ico('copy')+' J\'ai un code de transfert</button><div class="lgs">'+LANGS.map(l=>'<button type="button" class="chip" data-c6="lang:'+l[0]+'" aria-pressed="'+(S.lang===l[0])+'">'+l[1]+'</button>').join('')+'</div></div>';
  else if(n===1)o.innerHTML='<div class="in">'+dots+'<h2>Choisis ton personnage</h2><p>Il devient ton icône et ta mascotte. Tu pourras le personnaliser dans les réglages.</p><div class="icg">'+iconTiles()+'</div><button type="button" class="btn" data-onb="2">Suivant</button></div>';
  else o.innerHTML='<div class="in">'+dots+'<h2>C\'est parti !</h2><p>Touche « Noter une séance » sur l\'accueil après chaque entraînement. Tes séances restent sur ce téléphone.</p><button type="button" class="btn" data-onb="done">Commencer</button>'+(inst?'':'<button type="button" class="btn ghost sm onbc" data-inst="open">'+ico('phone')+' Installer l\'appli sur l\'écran d\'accueil</button>')+'</div>';
  o.querySelector('input')?.focus()}
function onbGo(a){if(onbStep===0){const v=($('onbName')||{}).value;S.name=(v||'').trim()}if(a==='done'){S.onb=true;S.lastSeen=Date.now();$('onb')?.remove();save();route();return}save();showOnb(Number(a))}
/* ===================== v4 ===================== */
const APP_V='7.7.0';
const ACC={jaune:['#e4ff1a','#7d8c00','Jaune fluo','#5c6800'],vert:['#3dff8b','#0c8a45','Vert','#08773a'],orange:['#ff9f1c','#a35a00','Orange','#9a4f00'],bleu:['#38c8ff','#0a6f99','Bleu','#0a6a92'],rose:['#ff5fa8','#a3245f','Rose','#a3245f'],violet:['#b18cff','#5b3fb0','Violet','#5b3fb0']};
const arr=x=>Array.isArray(x)?x:[],obj=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
const EXTRA=['name','fav','onb','live','bw','goals','acc','goal','bilanSeen','restAck','calMode','tmc','v','tset','skills','tests','presets','tpls','snd','voice','theme','cnt','deloads','notes','wuNote','wuMode','wuW','fPl','fTy','evo','ptab','icon','links','lastSeen','xtab'];
function packData(){const d={sessions:S.sessions,rest:S.rest,exg:S.exg,comps:S.comps,decoys:S.decoys||[],recs:S.recs||[],demo:S.demo,upd:S.upd};EXTRA.forEach(k=>{if(S[k]!==undefined)d[k]=S[k]});return d}
const PYR0=[{b:5,x:15,y:30},{b:8,x:45,y:60},{b:10,x:90,y:120}];
const PYEX=[['Tractions',10,[{b:5,x:15,y:30},{b:8,x:45,y:60},{b:10,x:90,y:120}]],['Dips',11,[{b:5,x:15,y:30},{b:7,x:45,y:60},{b:10,x:90,y:120},{b:11,x:150,y:150}]],['Pompes',17,[{b:5,x:15,y:30},{b:9,x:45,y:60},{b:13,x:90,y:120},{b:17,x:150,y:150}]]];
function loadExtra(v){EXTRA.filter(k=>k!=='name'&&k!=='fav'&&k!=='onb').forEach(k=>{S[k]=v&&v[k]!==undefined&&v[k]!==null?clone(v[k]):undefined});
  S.bw=arr(S.bw);S.goals=arr(S.goals);S.links=arr(S.links);S.icon=CH_SP[S.icon]?S.icon:'homme';S.xtab=['wu','adv','tuto'].includes(S.xtab)?S.xtab:'wu';S.lastSeen=+S.lastSeen||0;S.presets=arr(S.presets);S.tpls=arr(S.tpls);S.deloads=arr(S.deloads);S.tset=obj(S.tset);S.skills=obj(S.skills);S.tests=obj(S.tests);S.cnt=obj(S.cnt);S.notes=obj(S.notes);
  S.goal=Math.min(7,Math.max(1,Math.round(+S.goal||3)));S.acc=ACC[S.acc]?S.acc:'jaune';S.calMode=S.calMode==='w'?'w':'m';S.snd=SNDS[S.snd]?S.snd:'bip';S.voice=!!S.voice;S.theme=['dark','light','auto'].includes(S.theme)?S.theme:'dark';
  S.wuMode=S.wuMode==='street'?'street':'salle';S.wuNote=typeof S.wuNote==='string'?S.wuNote:'';S.wuW=+S.wuW||0;S.fPl=S.fPl||'';S.fTy=S.fTy||'';S.evo=['n','dur','vol'].includes(S.evo)?S.evo:'n';S.ptab=['mz','stats','records','skills'].includes(S.ptab)?S.ptab:'mz';
  S.tmc=Object.assign({emN:10,emI:60,emT:'',pyEx:'Tractions',pyId:'',pyStart:1,pyTop:10,pyStep:1,pyShape:'ud',pyMode:'prog',pyFix:30,pyR:clone(PYR0)},obj(S.tmc));
  if(!Array.isArray(S.tmc.pyR)||!S.tmc.pyR.length)S.tmc.pyR=clone(PYR0);if(S.tmc.pyTop<2)S.tmc.pyTop=10;
  if(S.live&&!(Array.isArray(S.live.ex)&&S.live.start))S.live=undefined;S.bilanSeen=S.bilanSeen||'';S.restAck=S.restAck||'';
  if((+S.v||0)<4){const mp={1:1,2:1,3:2,4:3};S.sessions.forEach(s=>{if(s.feel)s.feel=mp[s.feel]||0});if(S.live&&S.live.feel)S.live.feel=mp[S.live.feel]||0;if(+S.tmc.pyTop===5)S.tmc.pyTop=10;delete S.tmc.pyRest;S.v=4}
  if(S.v<5){S.live=undefined;delete S.tmc.pyAnch;delete S.tmc.lrest;
    S.presets.forEach(p=>{if(p.k==='pyr'&&p.c&&!p.c.pyR){const A=arr(p.c.pyAnch).slice().sort((a,b)=>a[0]-b[0]);p.c.pyR=A.length>1?A.slice(1).map((a,j)=>({b:a[0],x:A[j][1],y:a[1]})):clone(PYR0);delete p.c.pyAnch;p.c.pyEx=p.c.pyEx||p.name}});
    PYEX.forEach((e,i)=>{if(!S.presets.some(p=>p.k==='pyr'&&norm(p.name)===norm(e[0])))S.presets.push({id:'px'+i,k:'pyr',name:e[0],c:{pyEx:e[0],pyStart:1,pyTop:e[1],pyStep:1,pyShape:'ud',pyMode:'prog',pyFix:30,pyR:clone(e[2])}})});
    S.v=5}
  v6Load()}

/* ---------- petits outils ---------- */
const TODS=[['matin','Matin'],['midi','Midi'],['aprem','Après-midi'],['soir','Soir']],todN=Object.fromEntries(TODS);
const todOf=h=>h<11?'matin':h<14?'midi':h<18?'aprem':'soir';
const todNow=()=>todOf(new Date().getHours());
const FEEL=[[1,'😕','Bof'],[2,'💪','Bien'],[3,'🔥','Au top']];
const feelOf=s=>s&&s.feel&&FEEL[s.feel-1]?FEEL[s.feel-1]:null;
const fmtDur=m=>{m=Math.round(m);if(!(m>0))return '0 min';if(m<60)return m+' min';const h=Math.floor(m/60),r=m%60;return h+' h'+(r?' '+pad(r):'')};
const sDur=s=>+s.dur||0;
const sVol=s=>Object.values(s.perf||{}).reduce((a,p)=>a+(Array.isArray(p.sets)&&p.sets.length?p.sets.reduce((b,z)=>b+(z.kg>0&&z.r>0?z.r*z.kg:0),0):p.kg>0&&p.r>0?(p.s||1)*p.r*p.kg:0),0); /* v7.7 : détail par série compté série par série */
const fmtKg=v=>Math.round(v).toLocaleString(LOC())+' kg';
const fmtN=v=>String(Math.round(v*10)/10).replace('.',DEC());
const dShort=k=>{const d=parse(k);return d.getDate()+'/'+(d.getMonth()+1)};
const dLong=k=>parse(k).toLocaleDateString(LOC(),{day:'numeric',month:'long'});
const isoW=d=>{const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())),dn=(t.getUTCDay()+6)%7;t.setUTCDate(t.getUTCDate()-dn+3);const f=new Date(Date.UTC(t.getUTCFullYear(),0,4));return 1+Math.round(((t-f)/864e5-3+(f.getUTCDay()+6)%7)/7)};
const mmss=s=>Math.floor(s/60)+':'+pad(s%60);
const mmssL=s=>s<60?s+' s':Math.floor(s/60)+' min'+(s%60?' '+(s%60):'');
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const unitL=u=>u==='kg'?'kg':u==='sec'?'s':'rép.';
const TIMED_RE=/dead hang|gainage|\bplanche\b(?! sur)|plank|l-?sit|v-?sit|chaise|hollow|isom|suspension|maintien|hold|front lever|back lever|drapeau|poirier|handstand|corde a sauter|corde à sauter/i;
const isTimed=x=>{if(x in S.tset)return !!S.tset[x];const n=norm(x);return !/pompe|push/.test(n)&&TIMED_RE.test(n)};
const CHK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const GRIP='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.7"/><circle cx="15" cy="6" r="1.7"/><circle cx="9" cy="12" r="1.7"/><circle cx="15" cy="12" r="1.7"/><circle cx="9" cy="18" r="1.7"/><circle cx="15" cy="18" r="1.7"/></svg>';
const PEN='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/></svg>';
const TRASH='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/></svg>';
const DOTS='<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';
const SHARE='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
const LINK='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>';
const PLAY='<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
const pick=a=>a[Math.floor(Math.random()*a.length)];
const stepper=(l,k,v,u)=>'<div class="stp"><span>'+l+'</span><button type="button" class="ib" data-stp="'+k+':-1" aria-label="Moins">−</button><b>'+v+(u||'')+'</b><button type="button" class="ib" data-stp="'+k+':1" aria-label="Plus">+</button></div>';
const allEx=()=>[...new Set(S.exg.flatMap(g=>g[1]))];
function addExercise(raw){const n=String(raw||'').trim().replace(/\s+/g,' ').slice(0,40);if(!n)return '';const ex=allEx().find(x=>norm(x)===norm(n));if(ex)return ex;let g=S.exg.find(g=>g[0]==='Mes exercices');if(!g){g=['Mes exercices',[]];S.exg.push(g)}g[1].push(n);save();return n}

/* ---------- chiffres animés ---------- */
/* ---------- anneau d'objectif et flamme ---------- */
/* ---------- pictos ---------- */
const pl_=a=>'<polyline points="'+a.join(' ')+'"/>';
const FG=(h,L)=>'<g class="fg">'+L.map(pl_).join('')+'</g><circle class="hd" cx="'+h[0]+'" cy="'+h[1]+'" r="6"/>';
const LEGS=[[47,46,46,61,46,76],[53,46,54,61,54,76]];
const FLOOR='<line class="eq" x1="4" y1="76" x2="96" y2="76"/>';
const PX={
 'Tractions':'<line class="eq" x1="8" y1="16" x2="92" y2="16"/>'+FG([50,9],[[50,18,50,44],[42,23,58,23],[42,23,31,31,30,16],[58,23,69,31,70,16],[47,44,46,59,46,73],[53,44,54,59,54,73]]),
 'Chin-ups':'<line class="eq" x1="8" y1="16" x2="92" y2="16"/>'+FG([50,9],[[50,18,50,44],[42,23,58,23],[42,23,37,34,43,16],[58,23,63,34,57,16],[47,44,46,59,46,73],[53,44,54,59,54,73]]),
 'Traction grosse barre':'<line class="eq" x1="8" y1="16" x2="92" y2="16" style="stroke-width:10"/>'+FG([50,6],[[50,18,50,44],[42,24,58,24],[42,24,31,32,30,16],[58,24,69,32,70,16],[47,44,46,59,46,73],[53,44,54,59,54,73]]),
 'Dead hang':'<line class="eq" x1="8" y1="8" x2="92" y2="8"/>'+FG([50,20],[[50,27,50,52],[43,29,57,29],[43,29,41,8],[57,29,59,8],[47,52,46,64,46,77],[53,52,54,64,54,77]]),
 'Pompes':'<line class="eq" x1="4" y1="75" x2="96" y2="75"/>'+FG([80,42],[[72,46,43,58,14,70],[71,47,71,72]]),
 'Pompes surélevées':'<line class="eq" x1="4" y1="75" x2="96" y2="75"/><rect class="eq" x="4" y="39" width="20" height="36" rx="2"/>'+FG([79,46],[[70,48,42,42,14,36],[70,49,70,72]]),
 'Dips':'<path class="eq" d="M22 40H38M62 40H78M30 40V77M70 40V77"/>'+FG([50,14],[[50,21,50,48],[41,26,59,26],[41,26,32,31,30,40],[59,26,68,31,70,40],[47,48,45,60,49,68],[53,48,55,60,51,68]]),
 'Muscle-up':'<line class="eq" x1="8" y1="42" x2="92" y2="42"/>'+FG([50,12],[[50,19,50,46],[43,24,57,24],[43,24,40,33,38,42],[57,24,60,33,62,42]].concat(LEGS))+'<path class="ac" d="M84 68Q92 48 82 28"/><path class="ac" d="M77 31L82 27L86 33"/>',
 'Barre de singe':'<line class="eq" x1="4" y1="12" x2="96" y2="12"/><g class="eqf"><circle cx="22" cy="12" r="3.5"/><circle cx="42" cy="12" r="3.5"/><circle cx="62" cy="12" r="3.5"/><circle cx="82" cy="12" r="3.5"/></g>'+FG([47,26],[[45,32,45,56],[45,34,42,12],[45,34,61,13],[45,56,42,67,43,78],[45,56,49,67,50,78]]),
 'Montées de jambes':'<line class="eq" x1="16" y1="10" x2="84" y2="10"/>'+FG([43,21],[[40,28,40,50],[40,29,37,10],[40,50,62,50,84,50]])+'<path class="ac" d="M76 74Q88 70 86 58"/><path class="ac" d="M82 60L86 55L90 61"/>',
 'Rowing Superman':'<line class="eq" x1="4" y1="75" x2="96" y2="75"/>'+FG([77,58],[[12,58,31,65,50,67,68,64],[68,63,79,49,93,43]])+'<path class="ac" d="M12 48V36M8 40L12 36L16 40"/>',
 'Déviation ulnaire':FG([42,11],[[42,18,42,46],[42,22,42,36,43,50],[42,46,40,61,40,76],[42,46,45,61,46,76]])+'<line class="eq" x1="49" y1="50" x2="23" y2="53"/><circle class="acf" cx="21" cy="53" r="5.5"/><path class="ac" d="M12 64Q8 54 13 45"/><path class="ac" d="M9 48L13 44L17 49"/>',
 'Bench press':'<path class="eq" d="M22 55H80M30 55V76M72 55V76"/>'+FG([78,48],[[70,50,38,50],[38,50,27,42,23,76],[66,50,66,26]])+'<circle class="acf" cx="66" cy="21" r="8"/>',
 'Rowing à la barre':'<line class="eq" x1="20" y1="78" x2="90" y2="78"/>'+FG([71,29],[[45,49,64,35],[64,35,55,45,60,55],[45,49,51,62,46,76]])+'<circle class="acf" cx="60" cy="59" r="6.5"/>',
 'Rowing haltère':'<path class="eq" d="M40 54H88M46 54V77M82 54V77"/>'+FG([89,30],[[54,38,80,33],[54,38,62,52,46,52],[54,38,48,57,46,77],[80,34,83,52],[77,34,69,26,71,42]])+'<path class="ac" d="M66 43H76" style="stroke-width:6"/>',
 'Élévations latérales haltères':FG([50,12],[[50,18,50,46],[44,23,56,23],[44,23,34,24,23,25],[56,23,66,24,77,25]].concat(LEGS))+'<path class="ac" d="M20 19V31M80 19V31" style="stroke-width:6"/>',
 'Élévations latérales élastiques':FG([50,12],[[50,18,50,46],[44,23,56,23],[44,23,34,24,23,25],[56,23,66,24,77,25]].concat(LEGS))+'<path class="ac" d="M46 76Q29 52 23 25M54 76Q71 52 77 25" style="stroke-width:2.5;stroke-dasharray:4 3"/>',
 'Halo':FG([50,19],[[50,26,50,50],[44,30,56,30],[44,30,38,20,45,9],[56,30,62,20,55,9],[47,50,46,63,46,77],[53,50,54,63,54,77]])+'<circle class="acf" cx="50" cy="6" r="6"/><ellipse class="ac" cx="50" cy="19" rx="21" ry="7" style="stroke-dasharray:4 3"/>',
 squat:FLOOR+FG([57,22],[[53,28,44,48],[44,48,62,54,56,74],[51,32,69,38]]),
 curl:FG([50,12],[[50,18,50,46],[50,22,50,38,62,30],[50,46,48,61,48,76],[50,46,53,61,54,76]])+'<path class="ac" d="M63 25V35" style="stroke-width:6"/>',
 press:FG([50,13],[[50,20,50,47],[44,24,56,24],[44,24,37,15,40,5],[56,24,63,15,60,5],[47,47,46,62,46,77],[53,47,54,62,54,77]])+'<line class="ac" x1="26" y1="5" x2="74" y2="5" style="stroke-width:3"/><circle class="acf" cx="25" cy="5" r="4.5"/><circle class="acf" cx="75" cy="5" r="4.5"/>',
 plank:FLOOR+FG([82,57],[[74,61,44,66,14,71],[74,61,74,72,86,72]]),
 crunch:FLOOR+FG([64,57],[[40,71,58,62],[40,71,28,56,16,73],[57,63,67,67]]),
 dead:'<line class="eq" x1="20" y1="78" x2="90" y2="78"/>'+FG([67,30],[[42,48,62,36],[60,37,58,62],[42,48,48,61,44,76]])+'<circle class="acf" cx="58" cy="66" r="6.5"/>',
 hip:'<path class="eq" d="M6 54H30M10 54V77M26 54V77"/>'+FG([19,49],[[26,51,52,44,68,48,66,76]])+'<circle class="acf" cx="52" cy="37" r="6"/>',
 kick:'<line class="eq" x1="20" y1="78" x2="90" y2="78"/>'+FG([70,30],[[44,48,64,36],[62,37,56,44,40,42],[44,48,50,62,46,76]])+'<path class="ac" d="M37 37V47" style="stroke-width:6"/>',
 _:FG([50,12],[[50,18,50,46],[44,23,56,23],[44,23,40,36,40,48],[56,23,60,36,60,48]].concat(LEGS))
};

/* ---------- conseils pour n'importe quel exercice ---------- */
const GUIDE={
 'Tractions':['Pars bras tendus, épaules engagées : descends les omoplates avant de tirer.','Monte jusqu\'à passer le menton au-dessus de la barre, sans élan.','Redescends en contrôlant sur 2 à 3 secondes.'],
 'Chin-ups':['Prise en supination (paumes vers toi), mains écartées de la largeur des épaules.','Garde les coudes près du corps pendant la montée.','Plus de biceps que les tractions : idéal pour progresser vers tes premières tractions.'],
 'Traction grosse barre':['La barre épaisse travaille surtout la prise et les avant-bras.','Serre fort toute la main, pouce bien autour de la barre.','Commence avec moins de répétitions qu\'à la barre normale.'],
 'Pompes':['Corps gainé comme une planche : fesses ni trop hautes ni trop basses.','Mains un peu plus larges que les épaules, coudes à environ 45° du corps.','Descends la poitrine près du sol, puis remonte bras tendus.'],
 'Pompes surélevées':['Pieds posés sur un support : le haut des pectoraux et les épaules travaillent plus.','Garde le gainage, ne creuse pas le bas du dos.','Plus le support est haut, plus c\'est difficile.'],
 'Dips':['Garde les épaules basses, loin des oreilles.','Descends jusqu\'à avoir les coudes à 90° environ, pas plus bas si l\'avant de l\'épaule tire.','Buste penché en avant : plus de pectoraux. Buste droit : plus de triceps.'],
 'Muscle-up':['Tire de façon explosive vers le bas de la poitrine, la barre près du corps.','Bascule poignets et buste au-dessus de la barre.','Termine par un dips jusqu\'aux bras tendus. Maîtrise d\'abord les tractions hautes et les dips.'],
 'Barre de singe':['Avance main après main en gardant les épaules engagées.','Un léger balancement du corps aide à passer d\'un barreau à l\'autre.','Excellent pour la prise, les avant-bras et le dos.'],
 'Montées de jambes':['Suspendu, monte les jambes sans élan jusqu\'à l\'horizontale, ou plus haut.','Enroule le bassin en haut du mouvement pour vraiment faire travailler les abdos.','Redescends lentement, sans te balancer.'],
 'Rowing Superman':['À plat ventre, décolle les bras, la poitrine et les jambes du sol.','Regarde le sol pour garder la nuque dans l\'alignement.','Ramène les coudes vers les côtes en serrant les omoplates, puis tends à nouveau les bras.'],
 'Dead hang':['Bras tendus, épaules légèrement actives plutôt que complètement relâchées.','Respire calmement et augmente le temps de 5 à 10 secondes à la fois.','Idéal pour la prise et pour décompresser le dos.'],
 'Déviation ulnaire':['Bras le long du corps, tiens un marteau ou une barre lestée d\'un seul côté, le poids vers l\'arrière.','Lève le poids en inclinant le poignet côté petit doigt, sans bouger le coude.','Mouvement lent et charge légère : les tendons du poignet aiment la progressivité.'],
 'Bench press':['Omoplates serrées et pieds bien ancrés au sol.','Descends la barre vers le bas des pectoraux, coudes à environ 45 à 70° du corps.','Utilise un pareur ou des sécurités dès que la charge devient lourde.'],
 'Rowing à la barre':['Dos plat, buste penché à environ 45°, genoux légèrement fléchis.','Tire la barre vers le nombril en serrant les omoplates.','Pas d\'élan avec le dos : contrôle la descente.'],
 'Rowing haltère':['Un genou et une main sur le banc, dos bien plat.','Tire le coude vers la hanche plutôt que vers le plafond.','Descends en contrôle jusqu\'au bras tendu.'],
 'Élévations latérales haltères':['Monte les bras sur les côtés jusqu\'à hauteur d\'épaules, coudes légèrement fléchis.','Pas d\'élan : une charge légère suffit.','Pense à pousser vers l\'extérieur plutôt que vers le haut.'],
 'Élévations latérales élastiques':['Élastique sous les pieds, même mouvement qu\'avec des haltères.','La résistance augmente en haut : contrôle bien la descente.','Pratique au garage ou en voyage.'],
 'Halo':['Tiens un disque ou un kettlebell près de la tête et fais des cercles autour.','Gaine les abdos et garde le buste immobile.','Alterne les sens, mouvement lent : très bon pour la mobilité des épaules.']
};
const EXDB=[
 [/kick ?back/,['Version triceps : buste penché, coude collé au corps et fixe, tends l\'avant-bras vers l\'arrière.','Version fessiers : à quatre pattes ou à la poulie, pousse la jambe vers l\'arrière sans cambrer le bas du dos.','Mouvement lent, contracte 1 seconde en fin de mouvement.'],{Triceps:1,Fessiers:.6},'kick'],
 [/marteau|hammer/,['Pouces vers le haut, coudes collés au corps.','Monte sans balancer le buste.','Travaille aussi beaucoup les avant-bras.'],{Biceps:1,'Avant-bras':.7},'curl'],
 [/curl (jambe|ischio|allong|couch|assis)|leg curl|ischio|nordic/,['Bassin bien calé, ne décolle pas les hanches.','Ramène les talons vers les fesses en contrôle.','Descente lente pour protéger les ischios.'],{Jambes:1},'_'],
 [/curl|biceps/,['Coudes fixes le long du corps, seuls les avant-bras bougent.','Pas d\'élan avec le dos : baisse la charge si tu te balances.','Descends lentement jusqu\'au bras presque tendu.'],{Biceps:1,'Avant-bras':.4},'curl'],
 [/poignet|wrist|avant-bras|radial/,['Avant-bras posés, seuls les poignets bougent.','Amplitude complète, charge légère.','Travaille les deux sens : paumes vers le haut et vers le bas.'],{'Avant-bras':1},'curl'],
 [/barre au front|skull|extension.*(triceps|nuque|poulie|corde)|triceps.*(poulie|corde|extension)|french press/,['Garde les coudes fixes, sans les écarter.','Tends complètement les bras sans verrouiller brutalement.','Descends en contrôle : c\'est là que le triceps travaille le plus.'],{Triceps:1},'press'],
 [/militaire|overhead|developpe (epaule|assis|haltere)|shoulder press|arnold|push press/,['Gaine les abdos et serre les fessiers pour ne pas cambrer.','Pousse au-dessus de la tête, en ligne avec les oreilles.','Descends jusqu\'au niveau du menton, coudes légèrement devant.'],{'Épaules':1,Triceps:.5},'press'],
 [/incline/,['Banc à 30–45° : plus de haut des pectoraux.','Omoplates serrées, pieds bien ancrés.','Descends vers le haut de la poitrine, en contrôle.'],{Pectoraux:1,'Épaules':.6,Triceps:.4},'Bench press'],
 [/decline/,['Bas des pectoraux plus sollicité.','Bloque bien les jambes, omoplates serrées.','Descends vers le bas de la poitrine.'],{Pectoraux:1,Triceps:.5},'Bench press'],
 [/developpe couche|chest press|bench|developpe halter/,['Omoplates serrées et pieds bien ancrés au sol.','Descends vers le bas des pectoraux, coudes à environ 45 à 70° du corps.','Utilise un pareur ou des sécurités dès que la charge devient lourde.'],{Pectoraux:1,Triceps:.5,'Épaules':.5},'Bench press'],
 [/ecarte|fly|pec deck|butterfly|cable cross/,['Coudes légèrement fléchis et fixes tout le mouvement.','Ouvre jusqu\'à sentir l\'étirement des pectoraux, sans aller trop loin.','Rapproche les bras comme pour enlacer un arbre.'],{Pectoraux:1,'Épaules':.3},'_'],
 [/pull[- ]?over/,['Bras quasi tendus, descends derrière la tête en contrôle.','Garde les côtes basses, ne cambre pas.','Remonte jusqu\'au-dessus de la poitrine.'],{Dos:.8,Pectoraux:.6},'_'],
 [/tirage (vertical|poitrine|nuque|haut)|lat ?pull|pulldown/,['Tire la barre vers le haut de la poitrine, pas derrière la nuque.','Descends les omoplates avant de tirer avec les bras.','Remonte lentement jusqu\'aux bras tendus.'],{Dos:1,Biceps:.5},'Tractions'],
 [/face ?pull/,['Tire la corde vers le visage, coudes hauts.','Écarte les mains en fin de mouvement (rotation externe).','Excellent pour la santé des épaules : charge légère.'],{'Épaules':1,Dos:.5},'_'],
 [/tirage (horizontal|bas|assis)|rowing (assis|poulie|machine)|seated row|low row/,['Dos droit, poitrine sortie.','Tire les coudes vers l\'arrière en serrant les omoplates.','Ne recule pas le buste pour tricher.'],{Dos:1,Biceps:.5},'Rowing à la barre'],
 [/oiseau|reverse fly|rear delt|deltoide post/,['Buste penché, dos plat.','Écarte les bras sur les côtés, coudes légèrement fléchis.','Serre les omoplates en haut, charge légère.'],{'Épaules':1,Dos:.5},'Élévations latérales haltères'],
 [/shrug|haussement|trapeze/,['Monte les épaules vers les oreilles, sans les rouler.','Tiens 1 seconde en haut.','Bras tendus, ne plie pas les coudes.'],{Dos:.8,'Épaules':.4},'_'],
 [/frontale/,['Monte les bras devant toi jusqu\'à hauteur d\'épaules.','Pas d\'élan, buste immobile.','Charge légère, descente lente.'],{'Épaules':1},'Élévations latérales haltères'],
 [/laterale/,['Monte les bras sur les côtés jusqu\'à hauteur d\'épaules, coudes légèrement fléchis.','Pas d\'élan : une charge légère suffit.','Pense à pousser vers l\'extérieur plutôt que vers le haut.'],{'Épaules':1},'Élévations latérales haltères'],
 [/rotation externe|coiffe|rotateur/,['Coude collé au corps, plié à 90°.','Tourne l\'avant-bras vers l\'extérieur lentement.','Charge très légère : c\'est de l\'entretien pour les épaules.'],{'Épaules':1},'Élévations latérales élastiques'],
 [/pull[- ]?apart|ecartes? (a l'?)?elastique/,['Bras tendus devant toi à hauteur d\'épaules.','Écarte l\'élastique en serrant les omoplates.','Reviens lentement.'],{'Épaules':.8,Dos:.6},'Élévations latérales élastiques'],
 [/dislocation|passage d'?epaule|pass ?through/,['Élastique ou bâton, prise large.','Passe au-dessus de la tête puis derrière, bras tendus.','Resserre la prise petit à petit.'],{'Épaules':1},'press'],
 [/bulgare|bulgarian|split squat/,['Pied arrière sur un banc, buste légèrement penché.','Descends le genou arrière vers le sol, genou avant aligné avec le pied.','Pousse dans le talon avant pour remonter.'],{Jambes:1,Fessiers:.8},'squat'],
 [/pistol/,['Commence avec un appui (poteau, TRX) ou assis sur une box.','Garde le talon au sol et le genou aligné avec le pied.','Jambe libre tendue devant, gaine les abdos.'],{Jambes:1,Fessiers:.6},'squat'],
 [/front squat|squat avant|goblet/,['Buste bien droit, coudes hauts.','Descends entre les talons, genoux vers l\'extérieur.','Pousse dans tout le pied pour remonter.'],{Jambes:1,Fessiers:.6,Abdos:.3},'squat'],
 [/squat/,['Pieds largeur d\'épaules, pointes légèrement ouvertes.','Descends en poussant les fesses en arrière, dos droit, genoux dans l\'axe des pieds.','Remonte en poussant dans les talons.'],{Jambes:1,Fessiers:.8},'squat'],
 [/fente|lunge/,['Grand pas, descends le genou arrière près du sol.','Genou avant au-dessus de la cheville, buste droit.','Pousse dans le talon avant pour revenir.'],{Jambes:1,Fessiers:.8},'squat'],
 [/roumain|rdl|jambes tendues|stiff/,['Jambes presque tendues, pousse les fesses loin en arrière.','Barre ou haltères collés aux jambes, dos plat.','Descends jusqu\'à sentir l\'étirement des ischios, puis remonte en serrant les fessiers.'],{Jambes:.8,Fessiers:.8,Lombaires:.6},'dead'],
 [/souleve de terre|deadlift/,['Barre au-dessus du milieu du pied, dos plat avant de tirer.','Pousse le sol avec les jambes, barre collée aux tibias.','Verrouille en serrant les fessiers, sans te pencher en arrière.'],{Lombaires:1,Jambes:.8,Dos:.6,Fessiers:.8},'dead'],
 [/hip thrust/,['Haut du dos sur un banc, pieds à plat, tibias verticaux en haut du mouvement.','Monte le bassin en serrant les fessiers, menton rentré.','Ne cambre pas : bassin légèrement basculé vers l\'arrière en haut.'],{Fessiers:1,Jambes:.4},'hip'],
 [/pont fessier|glute bridge|releve de bassin/,['Allongé, pieds à plat près des fesses.','Monte le bassin en serrant les fessiers, tiens 1 seconde.','Garde les abdos gainés, sans cambrer.'],{Fessiers:1,Lombaires:.3},'hip'],
 [/presse|leg press/,['Pieds largeur d\'épaules au milieu de la plateforme.','Descends jusqu\'à 90° sans décoller le bas du dos.','Ne verrouille pas les genoux en haut.'],{Jambes:1,Fessiers:.5},'squat'],
 [/leg extension|extension (des )?jambes|extension quadri/,['Dos bien calé, genoux alignés avec l\'axe de la machine.','Tends les jambes sans à-coup, tiens 1 seconde en haut.','Descends lentement.'],{Jambes:1},'_'],
 [/mollet|calf/,['Monte le plus haut possible sur la pointe des pieds.','Tiens 1 seconde en haut, descends sous le niveau de la marche.','Mouvement lent, sans rebond.'],{Jambes:1},'_'],
 [/abduct/,['Mouvement lent, sans élan.','Garde le buste immobile.','Tiens 1 seconde jambes écartées.'],{Fessiers:1},'_'],
 [/adduct/,['Contrôle le retour, sans laisser claquer les charges.','Buste droit.','Amplitude confortable.'],{Jambes:1},'_'],
 [/gainage lat|planche lat|side plank/,['Coude sous l\'épaule, corps aligné de la tête aux pieds.','Monte le bassin, ne le laisse pas tomber.','Respire calmement pendant la tenue.'],{Abdos:1},'plank'],
 [/gainage|plank|planche (abdo|sur les coudes)/,['Coudes sous les épaules, corps droit comme une planche.','Serre les fessiers et les abdos, ne cambre pas.','Mieux vaut 3 tenues propres qu\'une longue tenue qui s\'affaisse.'],{Abdos:1,'Épaules':.3},'plank'],
 [/russian twist|rotation (du )?buste/,['Buste légèrement penché en arrière, dos droit.','Tourne les épaules, pas seulement les bras.','Pieds au sol pour débuter, levés pour corser.'],{Abdos:1},'crunch'],
 [/roue|ab ?wheel|roulette/,['Commence à genoux, abdos gainés.','Avance tant que le bas du dos ne se creuse pas.','Reviens en contractant les abdos, pas en pliant les hanches.'],{Abdos:1,'Épaules':.4},'plank'],
 [/hollow/,['Bas du dos plaqué au sol.','Bras et jambes tendus, décollés du sol.','Plie les genoux pour faciliter.'],{Abdos:1},'crunch'],
 [/crunch|abdo|releve de jambes|sit[- ]?up/,['Enroule le haut du dos, sans tirer sur la nuque.','Expire en montant, contracte 1 seconde en haut.','Mouvement lent et contrôlé.'],{Abdos:1},'crunch'],
 [/l-?sit|v-?sit/,['Bras tendus, épaules basses : pousse le sol.','Jambes tendues, pointes de pieds tirées.','Commence genoux pliés (L-sit groupé).'],{Abdos:1,Triceps:.4},'_'],
 [/front lever/,['Bras tendus, tire la barre vers les hanches.','Corps gainé, bassin basculé vers l\'arrière.','Progresse : groupé, groupé avancé, une jambe, jambes écartées, complet.'],{Dos:1,Abdos:.6},'Dead hang'],
 [/back lever/,['Prépare les épaules avec le skin the cat.','Bras tendus, corps gainé.','Progresse par étapes groupées avant de tendre les jambes.'],{Dos:.6,'Épaules':.8,Biceps:.5},'Dead hang'],
 [/planche/,['Bras tendus, épaules penchées loin devant les mains.','Pousse le sol et arrondis légèrement le haut du dos.','Commence par le planche lean, puis la tuck planche.'],{'Épaules':1,Pectoraux:.5,Abdos:.5},'Pompes'],
 [/poirier|handstand|equilibre/,['Commence ventre face au mur.','Bras tendus, épaules poussées vers les oreilles, corps gainé.','Regarde entre tes mains et serre les fessiers.'],{'Épaules':1,Triceps:.4,Abdos:.4},'press'],
 [/drapeau|human flag/,['Le bras du haut tire, celui du bas pousse.','Gaine tout le corps, surtout les obliques.','Progresse groupé, puis une jambe, puis jambes tendues.'],{'Épaules':1,Abdos:.8,Dos:.6},'_'],
 [/diamant|diamond/,['Mains rapprochées sous la poitrine, index et pouces en losange.','Coudes près du corps.','Plus de triceps que les pompes classiques.'],{Triceps:1,Pectoraux:.6},'Pompes'],
 [/pike|piquee/,['Hanches hautes, corps en V inversé.','Descends la tête vers le sol entre les mains.','Préparation idéale pour les pompes en poirier.'],{'Épaules':1,Triceps:.5},'Pompes'],
 [/archer/,['Un bras travaille, l\'autre reste presque tendu sur le côté.','Descends ou monte vers la main qui travaille.','Étape vers les versions à un bras.'],{Pectoraux:.7,Dos:.7,Triceps:.4,Biceps:.4},'_'],
 [/australienne|rowing inverse|australian|inverted row/,['Corps gainé et droit sous la barre.','Tire la poitrine vers la barre en serrant les omoplates.','Plus tes pieds avancent, plus c\'est dur.'],{Dos:1,Biceps:.5},'Rowing à la barre'],
 [/pompe|push[- ]?up/,['Corps gainé comme une planche.','Mains un peu plus larges que les épaules, coudes à environ 45°.','Descends la poitrine près du sol, puis remonte bras tendus.'],{Pectoraux:1,Triceps:.5,'Épaules':.5},'Pompes'],
 [/traction|pull[- ]?up|chin/,['Pars bras tendus, épaules engagées.','Monte jusqu\'à passer le menton au-dessus de la barre, sans élan.','Redescends en contrôlant.'],{Dos:1,Biceps:.5,'Avant-bras':.4},'Tractions'],
 [/dips/,['Épaules basses, loin des oreilles.','Descends jusqu\'à environ 90° aux coudes.','Remonte jusqu\'aux bras tendus, sans balancer.'],{Pectoraux:1,Triceps:1,'Épaules':.5},'Dips'],
 [/burpee/,['Descends en squat, mains au sol, pieds en arrière.','Pompe si tu veux, ramène les pieds, puis saute.','Garde un rythme régulier plutôt que de t\'épuiser.'],{Jambes:.7,Pectoraux:.5},'squat'],
 [/corde a sauter|jump rope/,['Petits sauts sur l\'avant des pieds.','Les poignets font tourner la corde, coudes près du corps.','Idéal pour monter en température avant la séance.'],{Jambes:.6},'_'],
 [/course|footing|running|sprint/,['Commence doucement et augmente progressivement.','Foulée légère, sous le bassin.','Respiration régulière.'],{Jambes:1},'_'],
 [/velo|bike/,['Règle la selle : jambe presque tendue en bas.','5 minutes suffisent pour l\'échauffement.','Augmente la résistance progressivement.'],{Jambes:.7},'_'],
 [/mountain climber/,['Position de pompe, ramène les genoux vers la poitrine en alternance.','Hanches basses, gainage.','Rythme rapide mais contrôlé.'],{Abdos:.8,Jambes:.5},'plank'],
 [/kettlebell|swing/,['C\'est un mouvement de hanches, pas un squat.','Bras détendus : la kettlebell monte grâce aux fessiers.','Dos plat, gainage en haut.'],{Fessiers:1,Lombaires:.6,Jambes:.5},'dead'],
 [/fermier|farmer/,['Charges lourdes, épaules basses, buste droit.','Petits pas réguliers.','Excellent pour la prise.'],{'Avant-bras':1,Dos:.4},'_'],
 [/rowing/,['Dos plat, buste stable.','Tire les coudes vers l\'arrière en serrant les omoplates.','Contrôle la descente.'],{Dos:1,Biceps:.5},'Rowing à la barre'],
 [/developpe|press/,['Omoplates serrées, gainage.','Pousse dans l\'axe, sans à-coup.','Descente contrôlée.'],{Pectoraux:.6,'Épaules':.6,Triceps:.5},'press']
];
const GEN={Dos:['Tire avec les coudes et serre les omoplates.','Garde le buste stable, sans élan.','Contrôle la phase de retour.'],Pectoraux:['Omoplates serrées, poitrine sortie.','Descends en contrôle.','Amplitude complète, sans douleur à l\'épaule.'],'Épaules':['Charge raisonnable : les épaules aiment la technique propre.','Gaine les abdos pour ne pas cambrer.','Mouvement contrôlé, sans à-coup.'],Biceps:['Coudes fixes, sans élan.','Descente lente.','Amplitude complète.'],Triceps:['Coudes fixes.','Tends complètement le bras.','Descente contrôlée.'],'Avant-bras':['Charge légère, mouvement lent.','Amplitude complète au poignet.','Progresse petit à petit : les tendons s\'adaptent lentement.'],Abdos:['Gaine sans retenir ta respiration.','Bas du dos protégé, sans cambrer.','La qualité avant la quantité.'],Lombaires:['Dos neutre, sans arrondir.','Mouvement lent.','Serre les fessiers en fin de mouvement.'],Jambes:['Genoux dans l\'axe des pieds.','Pousse dans tout le pied.','Amplitude complète et contrôlée.'],Fessiers:['Serre les fessiers en fin de mouvement.','Ne compense pas avec le bas du dos.','Mouvement contrôlé.']};
const GEN0=['Échauffe-toi bien avant les séries lourdes.','Amplitude complète et mouvement contrôlé.','Arrête la série dès que la technique se dégrade.'];
const MG={'Tractions':{Dos:1,Biceps:.5,'Avant-bras':.5},'Chin-ups':{Dos:1,Biceps:1,'Avant-bras':.5},'Traction grosse barre':{'Avant-bras':1,Dos:1,Biceps:.5},'Pompes':{Pectoraux:1,Triceps:.5,'Épaules':.5},'Pompes surélevées':{Pectoraux:1,'Épaules':.6,Triceps:.5},'Dips':{Pectoraux:1,Triceps:1,'Épaules':.5},'Muscle-up':{Dos:1,Pectoraux:.5,Triceps:.5,Biceps:.5},'Barre de singe':{'Avant-bras':1,Dos:.6,'Épaules':.4},'Montées de jambes':{Abdos:1,'Avant-bras':.4},'Rowing Superman':{Lombaires:1,Dos:.5},'Dead hang':{'Avant-bras':1,'Épaules':.4},'Déviation ulnaire':{'Avant-bras':1},'Bench press':{Pectoraux:1,Triceps:.5,'Épaules':.5},'Rowing à la barre':{Dos:1,Biceps:.5,Lombaires:.4},'Rowing haltère':{Dos:1,Biceps:.5},'Élévations latérales haltères':{'Épaules':1},'Élévations latérales élastiques':{'Épaules':1},'Halo':{'Épaules':1,Abdos:.4}};
const dbOf=x=>{const n=norm(x);return EXDB.find(e=>e[0].test(n))||null};
function mgOf(x){if(MG[x])return MG[x];const d=dbOf(x);return d?d[2]:{}}
function tipsFor(x){if(GUIDE[x])return {t:GUIDE[x],gen:false};const d=dbOf(x);if(d)return {t:d[1],gen:false};const m=Object.entries(mgOf(x)).sort((a,b)=>b[1]-a[1])[0];return {t:m?GEN[m[0]]:GEN0,gen:true}}
const pxFor=x=>PX[x]||(()=>{const d=dbOf(x);return d&&PX[d[3]]?PX[d[3]]:PX._})();
const picto=(x,c)=>'<svg class="px'+(c?' '+c:'')+'" viewBox="0 0 100 80" aria-hidden="true">'+pxFor(x)+'</svg>';
let guideFor='';
function showGuide(x){guideFor=x;const tf=tipsFor(x),ms=Object.entries(mgOf(x)).sort((a,b)=>b[1]-a[1]).map(e=>e[0]),tm=isTimed(x);
  $('gbox').innerHTML='<div class="ghead"><div class="gpic">'+picto(x)+'</div><div><h3>'+esc(x)+'</h3>'+(ms.length?'<p class="gm">'+ms.map(z=>'<span>'+esc(z)+'</span>').join('')+'</p>':'')+'</div></div>'
   +'<h5>Conseils</h5><ul class="tips">'+tf.t.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>'+(tf.gen?'<p class="note">Conseils généraux : ajoute les tiens juste en dessous.</p>':'')
   +'<h5>Mes notes</h5><textarea id="gNote" rows="2" maxlength="600" placeholder="Tes repères, réglages de machine, sensations…">'+esc(S.notes[x]||'')+'</textarea>'
   +'<h5>Tutos vidéo</h5><div class="sktu">'+S.links.filter(l=>l.c==='ex'&&l.k===x).map(l=>linkHtml(l,1)).join('')+'<button type="button" class="chip addx sm" data-lknew="ex:'+esc(x)+'">+ Ajouter une vidéo</button></div>'
   +'<button type="button" class="tglrow" data-tgltimed="1" aria-pressed="'+tm+'"><span><b>Se mesure en secondes</b>Pour les tenues (gainage, dead hang, L-sit…)</span><i></i></button>'
   +'<div class="acts"><button type="button" class="btn" id="gClose">OK</button></div>';
  $('gsheet').classList.add('open')}
function openSheet(html){guideFor='';$('gbox').innerHTML=html;$('gsheet').classList.add('open')}
const closeSheet=()=>$('gsheet').classList.remove('open');
/* ---------- formulaire : date, moment, durée, ressenti, note ---------- */
function drawMeta5(){if(!form)return;const d=form.date||sel,yest=key(add(T,-1)),other=d!==TK&&d!==yest;
  $('shT').textContent=(form.editId?'Modifier · ':'')+fmtDay(parse(d));
  $('cDate').innerHTML='<button type="button" class="chip" data-fd="'+TK+'" aria-pressed="'+(d===TK)+'">Aujourd\'hui</button><button type="button" class="chip" data-fd="'+yest+'" aria-pressed="'+(d===yest)+'">Hier</button><label class="chip dpick'+(other?' on':'')+'">'+(other?'Le '+esc(parse(d).toLocaleDateString(LOC(),{day:'numeric',month:'short'})):'Autre jour')+'<input type="date" id="fDate" max="'+TK+'" value="'+d+'" aria-label="Choisir un autre jour"></label>';
  const D=[30,45,60,75,90,120];
  $('cMeta').innerHTML='<h5>Moment</h5><div class="chips">'+TODS.map(t=>'<button type="button" class="chip" data-tod="'+t[0]+'" aria-pressed="'+(form.tod===t[0])+'">'+t[1]+'</button>').join('')+'</div>'
   +'<h5>Durée <small>facultatif</small></h5><div class="chips">'+D.map(m=>'<button type="button" class="chip" data-dur="'+m+'" aria-pressed="'+(+form.dur===m)+'">'+fmtDur(m)+'</button>').join('')+'<label class="chip dmin"><input type="number" inputmode="numeric" min="1" max="600" id="fDur" placeholder="autre" value="'+(D.includes(+form.dur)?'':(form.dur||''))+'"> min</label></div>';
  $('cFeel').innerHTML='<h5>Ressenti <small>facultatif</small></h5><div class="chips feel">'+FEEL.map(f=>'<button type="button" class="chip" data-feel="'+f[0]+'" aria-pressed="'+(form.feel===f[0])+'"><span class="emo">'+f[1]+'</span>'+f[2]+'</button>').join('')+'</div><h5>Note <small>facultatif</small></h5><textarea id="fNote" rows="2" maxlength="500" placeholder="Ex. douleur à l\'épaule, nouvelle prise…">'+esc(form.note||'')+'</textarea>'}
function ctxSnap(){const wk=monday(T).getTime(),on=badgeList().filter(b=>b.on);return {bad:on.length,badk:on.map(b=>b.k),wn:S.sessions.filter(s=>monday(parse(s.date)).getTime()===wk).length,last:lastSess()}}
function submitForm(){if(!form)return;const d=form.date&&form.date<=TK?form.date:(sel<=TK?sel:TK);if(!form.place)form.place='street';clearDemo();
  const perf={};form.ex.forEach(x=>{const p=form.perf[x];if(!p)return;const sets=(Array.isArray(p.sets)?p.sets:[]).map(z=>({r:+z.r||0,kg:+z.kg||0,sec:+z.sec||0})).filter(z=>z.r||z.kg||z.sec);
    if(sets.length)perf[x]={s:sets.length,r:Math.max(...sets.map(z=>z.r)),kg:Math.max(...sets.map(z=>z.kg)),sec:Math.max(...sets.map(z=>z.sec)),sets}; /* v7.7 : détail par série (le résumé reste pour les records) */
    else if(+p.s||+p.r||+p.kg||+p.sec)perf[x]={s:+p.s||0,r:+p.r||0,kg:+p.kg||0,sec:+p.sec||0}});
  const ss={id:form.editId||('s'+Date.now().toString(36)),date:d,place:form.place,types:form.types.filter(okT),ex:form.ex.slice(),u:Date.now()}; /* u : dernière modification (fusion de sauvegardes) */
  if(Object.keys(perf).length)ss.perf=perf;if(form.tod)ss.tod=form.tod;if(+form.dur>0)ss.dur=Math.min(600,Math.round(+form.dur));if(form.feel)ss.feel=form.feel;const nt=(form.note||'').trim();if(nt)ss.note=nt.slice(0,500);
  const c=ctxSnap(),wasEdit=!!form.editId;S.rest=S.rest.filter(k=>k!==d);
  if(wasEdit){const i=S.sessions.findIndex(s=>s.id===ss.id);if(i>=0)S.sessions[i]=ss;else S.sessions.push(ss)}else S.sessions.push(ss);
  if(typeof plOnSave==='function')plOnSave(ss,form); /* v7.7 : relie la séance à la séance prévue */
  const beat=autoRecs(perf,d);sel=d;view=new Date(parse(d).getFullYear(),parse(d).getMonth(),1);close();render();save();
  if(wasEdit){const gh=checkGoals();if(beat)celebrate(beat.name,beat.v,beat.unit);else if(gh.length)boomMsg('Objectif atteint !',goalTxt(gh[0]));else toast('Séance modifiée ✓');return}
  afterAdd(ss,beat,c)}
const goalTxt=g=>g.ex+' : '+fmtN(g.target)+' '+unitL(g.unit);
/* ---------- bandeau du bas (annuler, partager) ---------- */
let snackFn=null;
/* v7.6 : bandeau plus rapide et plus court (4 s avec « Annuler », 3 s sinon), disparition en douceur, toucher le texte le ferme */
function snackHide(){const el=$('snack');if(el.hidden)return;clearTimeout(el._t);el.classList.remove('on');el.classList.add('off');el._t=setTimeout(()=>{el.hidden=true;el.classList.remove('off');snackFn=null},170)}
function snack(m,label,fn,ms){const el=$('snack'),ub=$('undo'),lb=label||'Annuler',und=lb==='Annuler';$('snackT').textContent=m;ub.classList.toggle('notr',und);ub.textContent=und&&S.lang!=='fr'?trS('Annuler l\'action'):lb; /* « Annuler » d'un bandeau = Undo / Ongedaan maken (pas Cancel) */snackFn=fn||null;el.hidden=false;el.classList.remove('on','off');void el.offsetWidth;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(snackHide,ms||(fn?4000:3000))}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#snackT'))snackHide()});
function delSession(id){const i=S.sessions.findIndex(s=>s.id===id);if(i<0)return;const s=S.sessions[i],lk=typeof plOnDel==='function'?plOnDel(id):null;S.sessions.splice(i,1);render();save();snack('Séance supprimée','Annuler',()=>{S.sessions.splice(Math.min(i,S.sessions.length),0,s);if(lk)lk.forEach(it=>{it.sid=id});render();save();toast('Séance restaurée ✓')})}

/* ---------- calendrier : semaine, glisser, repos ---------- */
function noRestRun(){let d=new Date(T);if(!sOf(key(d)).length)d=add(d,-1);let n=0;while(sOf(key(d)).length&&!isRest(key(d))&&n<60){n++;d=add(d,-1)}return n}
function calStep(dir){if(S.calMode==='w'){const d=add(parse(sel),7*dir);sel=key(d);view=new Date(d.getFullYear(),d.getMonth(),1)}else view=new Date(view.getFullYear(),view.getMonth()+dir,1);render();const g=$('grid');g.classList.remove('swL','swR');void g.offsetWidth;g.classList.add(dir>0?'swL':'swR')}
(()=>{const g=$('grid');let x0=0,y0=0,t0=0;g.addEventListener('touchstart',e=>{const p=e.changedTouches[0];x0=p.clientX;y0=p.clientY;t0=Date.now()},{passive:true});
  g.addEventListener('touchend',e=>{const p=e.changedTouches[0],dx=p.clientX-x0,dy=p.clientY-y0;if(!window.__cdrag&&Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.6&&Date.now()-t0<800)calStep(dx<0?1:-1)},{passive:true})})();

/* ---------- objectifs ---------- */
function goalCur(g){const r=S.recs.find(q=>q.name===g.ex);let best=0;if(r&&r.unit===g.unit)best=recMax(r);S.sessions.forEach(s=>{const p=s.perf&&s.perf[g.ex];if(p){const v=g.unit==='kg'?p.kg:g.unit==='sec'?p.sec:p.r;if(v>best)best=v}});return best}
function checkGoals(){const hit=[];S.goals.forEach(g=>{if(!g.done&&goalCur(g)>=g.target){g.done=TK;hit.push(g)}});return hit}
function renderGoals(){$('goalList').innerHTML=S.goals.length?S.goals.map((g,i)=>{const c=goalCur(g),p=Math.min(1,c/g.target),u=unitL(g.unit),done=c>=g.target,days=g.by?Math.round((parse(g.by)-parse(TK))/864e5):null;
    return '<div class="goal'+(done?' done':'')+'"><div class="gh"><b>'+esc(g.ex)+' : '+fmtN(g.target)+' '+u+'</b><button type="button" class="ib sm2" data-gdel="'+i+'" aria-label="Supprimer l\'objectif">'+TRASH+'</button></div><span class="track big"><i style="width:'+(p*100).toFixed(1)+'%"></i></span><p class="note">'+(done?'Objectif atteint ✓':fmtN(c)+' / '+fmtN(g.target)+' '+u+' · encore '+fmtN(g.target-c)+' '+u)+(days!==null&&!done?' · '+(days>0?'J-'+days:days===0?'échéance aujourd\'hui':'échéance passée'):'')+'</p></div>'}).join('')
   :'<p class="findsub">Aucun objectif pour l\'instant. Fixe-toi un défi, par exemple 20 tractions d\'ici mars.</p>';
  const cur=$('gEx').value;$('gEx').innerHTML='<option value="">Exercice…</option>'+allEx().map(x=>'<option'+(x===cur?' selected':'')+'>'+esc(x)+'</option>').join('')}

/* ---------- graphiques ---------- */
function vChart(id,pts,unit,o){o=o||{};const box=$(id),s=box.querySelector('svg');box._v={pts,o};
  const draw=()=>{const c=box._v,W=s.clientWidth,H=s.clientHeight;if(!W||!H||!c.pts.length)return;const p=c.pts,n=p.length,f=c.o.fmt||fmtN;let mn=Math.min(...p.map(x=>x.v)),mx=Math.max(...p.map(x=>x.v));
    if(c.o.zero){mn=0;mx=Math.max(mx,1)*1.22}else{if(mx===mn){mx+=1;mn=Math.max(0,mn-1)}const pd=(mx-mn)*.18;mn=Math.max(0,mn-pd);mx+=pd}
    const L=c.o.zero?12:38,R=18,Tp=26,B=26,X=i=>L+(n<2?(W-L-R)/2:i*(W-L-R)/(n-1)),Y=v=>Tp+(H-Tp-B)*(1-(v-mn)/((mx-mn)||1));let g='';
    (c.o.zero?[0]:[0,1,2,3]).forEach(k=>{const v=mn+(mx-mn)*k/3;g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v).toFixed(1)+'" y2="'+Y(v).toFixed(1)+'" style="stroke:var(--line)"/>'+(c.o.zero?'':'<text x="'+(L-6)+'" y="'+(Y(v)+4).toFixed(1)+'" text-anchor="end">'+fmtN(v)+'</text>')});
    const path=p.map((x,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(x.v).toFixed(1)).join('');
    if(n>1)g+='<path d="'+path+'L'+X(n-1).toFixed(1)+' '+Y(mn).toFixed(1)+'L'+X(0).toFixed(1)+' '+Y(mn).toFixed(1)+'Z" fill="url(#gArea)"/><path d="'+path+'" fill="none" style="stroke:var(--acct)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    const every=Math.max(1,Math.ceil(n/(W<500?5:9))),mi=p.reduce((b,x,i)=>x.v>p[b].v?i:b,0);
    p.forEach((x,i)=>{const big=i===n-1||(i===mi&&x.v>0);g+='<circle cx="'+X(i).toFixed(1)+'" cy="'+Y(x.v).toFixed(1)+'" r="'+(big?5:3)+'" style="fill:'+(i===n-1?'var(--ink)':'var(--acct)')+';stroke:var(--card)" stroke-width="2"/>';
      if(big||n<=7)g+='<text class="v" x="'+X(i).toFixed(1)+'" y="'+(Y(x.v)-10).toFixed(1)+'" text-anchor="middle">'+esc(f(x.v))+'</text>';if((n-1-i)%every===0)g+='<text x="'+X(i).toFixed(1)+'" y="'+(H-7)+'" text-anchor="middle">'+esc(x.l)+'</text>'});
    s.innerHTML=g;chart6(s,c)};
  if(!box._ro){box._ro=new ResizeObserver(()=>draw());box._ro.observe(s)}draw()}
/* barres : pour des totaux par semaine (séances, temps, volume) */
function bChart(id,pts,o){o=o||{};const box=$(id),s=box.querySelector('svg');box._v={pts,o};
  const draw=()=>{const c=box._v,W=s.clientWidth,H=s.clientHeight;if(!W||!H||!c.pts.length)return;const p=c.pts,n=p.length,f=c.o.fmt||fmtN,mx=Math.max(1,...p.map(x=>x.v))*1.2,L=6,R=6,Tp=24,B=26,bw=(W-L-R)/n,Y=v=>Tp+(H-Tp-B)*(1-v/mx),mi=p.reduce((b,x,i)=>x.v>p[b].v?i:b,0);
    let g='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(0).toFixed(1)+'" y2="'+Y(0).toFixed(1)+'" style="stroke:var(--line)"/>';const every=Math.max(1,Math.ceil(n/(W<500?6:12)));
    p.forEach((x,i)=>{const w=Math.min(34,bw*.64),bx=L+i*bw+(bw-w)/2,y=Y(x.v),last=i===n-1;
      if(x.v>0)g+='<rect x="'+bx.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+Math.max(2,Y(0)-y).toFixed(1)+'" rx="'+Math.min(6,w/2).toFixed(1)+'" style="fill:'+(last?'var(--acct)':'color-mix(in srgb,var(--acct) 50%,var(--card2))')+'"/>';
      else g+='<rect x="'+bx.toFixed(1)+'" y="'+(Y(0)-2).toFixed(1)+'" width="'+w.toFixed(1)+'" height="2" rx="1" style="fill:var(--line)"/>';
      if(x.v>0&&(c.o.all||last||i===mi))g+='<text class="v" x="'+(bx+w/2).toFixed(1)+'" y="'+(y-7).toFixed(1)+'" text-anchor="middle">'+esc(f(x.v))+'</text>';
      if((n-1-i)%every===0)g+='<text x="'+(bx+w/2).toFixed(1)+'" y="'+(H-7)+'" text-anchor="middle">'+esc(x.l)+'</text>'});
    s.innerHTML=g;chart6(s,c)};
  if(!box._ro){box._ro=new ResizeObserver(()=>draw());box._ro.observe(s)}draw()}

/* ---------- stats (simplifiées, avec filtres) ---------- */
const fS=()=>S.sessions.filter(s=>(!S.fPl||s.place===S.fPl)&&(!S.fTy||s.types.includes(S.fTy)));
function renderStatsPage5(){
  $('fPl').innerHTML=[['','Partout']].concat(PL).map(p=>'<button type="button" class="chip" data-fpl="'+p[0]+'" aria-pressed="'+(S.fPl===p[0])+'">'+p[1]+'</button>').join('');
  $('fTy').innerHTML='<option value="">Tous les types</option>'+TY.map(t=>'<option value="'+t[0]+'"'+(S.fTy===t[0]?' selected':'')+'>'+esc(t[1])+'</option>').join('');
  const L=fS(),y=T.getFullYear(),m=T.getMonth(),day=T.getDate(),mk=y+'-'+pad(m+1),pd=new Date(y,m-1,1),pk=pd.getFullYear()+'-'+pad(pd.getMonth()+1),dim=new Date(y,m,0).getDate();
  const per=(a,b)=>{const ss=L.filter(s=>s.date>=a&&s.date<=b);return {n:ss.length,dur:ss.reduce((x,s)=>x+sDur(s),0),days:new Set(ss.map(s=>s.date)).size,vol:ss.reduce((x,s)=>x+sVol(s),0)}};
  const A=per(mk+'-01',TK),B=per(pk+'-01',pk+'-'+pad(Math.min(day,dim)));
  $('mT').textContent=mName(y,m,'long').replace(/^./,c=>c.toUpperCase());
  $('mS').textContent='Comparé à '+mName(pd.getFullYear(),pd.getMonth(),'long')+' à la même date'+(S.fPl||S.fTy?' · filtre actif':'')+'.';
  const fm=(v,f)=>f==='dur'?fmtDur(v):f==='k'?fmtKg(v):String(v);
  const tile=(v,lab,f,b)=>{const d=v-b;return '<div><b data-n="'+v+'"'+(f?' data-f="'+f+'"':'')+'>'+fm(v,f)+'</b><span>'+lab+'</span><em class="'+(d>0?'up':d<0?'dn':'eq')+'">'+(d>0?'▲ +'+fm(d,f):d<0?'▼ −'+fm(-d,f):'= pareil')+'</em></div>'};
  $('mK').innerHTML=tile(A.n,'séances','',B.n)+tile(A.dur,'d\'entraînement','dur',B.dur)+tile(A.days,'jours actifs','',B.days)+tile(A.vol,'soulevés','k',B.vol);
  $('evoSeg').innerHTML=[['n','Séances'],['dur','Temps'],['vol','Volume']].map(x=>'<button type="button" data-evo="'+x[0]+'" aria-pressed="'+(S.evo===x[0])+'">'+x[1]+'</button>').join('');
  const wm=monday(T),pts=[];for(let i=11;i>=0;i--){const k=key(add(wm,-7*i)),ss=L.filter(s=>wkOf(s.date)===k);pts.push({l:dShort(k),v:S.evo==='n'?ss.length:S.evo==='dur'?ss.reduce((a,s)=>a+sDur(s),0):ss.reduce((a,s)=>a+sVol(s),0)})}
  const tot=pts.reduce((a,p)=>a+p.v,0),avg4=pts.slice(-4).reduce((a,p)=>a+p.v,0)/4,F=S.evo==='n'?(v=>fmtN(v)):S.evo==='dur'?(v=>fmtDur(v)):(v=>v>=1000?fmtN(v/1000)+' t':Math.round(v)+' kg');
  $('evoS').textContent=!tot?(S.evo==='dur'?'Indique la durée de tes séances pour voir ton temps d\'entraînement.':S.evo==='vol'?'Note séries × répétitions × kg dans tes séances pour voir le volume.':'Pas encore de séances sur ces 12 semaines.'):(S.evo==='n'?'Séances par semaine':S.evo==='dur'?'Temps d\'entraînement par semaine':'Volume soulevé par semaine')+' · moyenne sur 4 semaines : '+F(avg4)+'.';
  bChart('cEvo',pts,{fmt:F,all:S.evo==='n'});
  renderProg();
  const from=key(new Date(y,m-2,1)),R3=stats(L.filter(s=>s.date>=from));plTiles($('gPl'),R3.p);
  const used=TY.filter(t=>R3.t[t[0]]),mx=Math.max(1,...used.map(t=>R3.t[t[0]]));
  $('gTy').innerHTML=used.length?used.map(t=>'<div class="bar"><span class="lb">'+stk(t[0],'')+esc(t[1])+'</span><span class="tr"><span class="fl" style="width:'+(R3.t[t[0]]/mx*100).toFixed(1)+'%;background:'+t[3]+'"></span></span><span class="v">'+R3.t[t[0]]+'</span></div>').join(''):'<p class="note">Aucun type de séance noté sur cette période.</p>';
  renderBW()}
function progList(){const set=new Set();fS().forEach(s=>Object.keys(s.perf||{}).forEach(x=>set.add(x)));if(!S.fPl&&!S.fTy)S.recs.forEach(r=>set.add(r.name));return [...set]}
function progData(x){const r=S.recs.find(q=>q.name===x),L=fS(),anyKg=L.some(s=>s.perf&&s.perf[x]&&s.perf[x].kg>0),unit=r?r.unit:(isTimed(x)?'sec':anyKg?'kg':'reps'),m={};const put=(d,v)=>{if(v>0&&(!(d in m)||v>m[d]))m[d]=v};
  L.forEach(s=>{const p=s.perf&&s.perf[x];if(p)put(s.date,unit==='kg'?p.kg:unit==='sec'?p.sec:p.r)});if(r&&!S.fPl&&!S.fTy)r.hist.forEach(h=>put(h.d,h.v));return {unit,pts:Object.keys(m).sort().map(d=>({d,v:m[d],l:dShort(d)}))}}
let progSel='';
function renderProg(){const L=progList(),sl=$('prSel');if(!L.length){sl.hidden=true;$('cProg').hidden=true;$('prSub').textContent='Note tes performances (séries × rép. × kg) dans tes séances ou ajoute un record : ta courbe apparaîtra ici.';return}
  if(!L.includes(progSel))progSel=L[0];sl.hidden=false;sl.innerHTML=L.map(x=>'<option'+(x===progSel?' selected':'')+'>'+esc(x)+'</option>').join('');
  const D=progData(progSel),u=unitL(D.unit);$('cProg').hidden=!D.pts.length;
  if(!D.pts.length){$('prSub').textContent='Pas encore de données chiffrées pour cet exercice.';return}
  const f=D.pts[0].v,l=D.pts[D.pts.length-1].v,best=Math.max(...D.pts.map(p=>p.v));
  $('prSub').textContent=D.pts.length<2?'Un seul point pour l\'instant ('+fmtN(l)+' '+u+'). Continue à noter tes perfs !':('Meilleur : '+fmtN(best)+' '+u+' · '+(l-f>=0?'+':'−')+fmtN(Math.abs(l-f))+' '+u+' depuis le '+dLong(D.pts[0].d)+'.');
  vChart('cProg',D.pts,u,{fmt:v=>fmtN(v)})}
function renderBW5(){const L=S.bw.slice().sort((a,b)=>a.d<b.d?-1:1),last=L[L.length-1];
  $('bwSub').textContent=last?'Dernière pesée : '+fmtN(last.v)+' kg le '+dLong(last.d)+(L.length>1?' · '+(last.v-L[0].v>=0?'+':'−')+fmtN(Math.abs(last.v-L[0].v))+' kg depuis le '+dLong(L[0].d):'')+'.':'Note ton poids de temps en temps pour suivre son évolution.';
  $('cBW').hidden=L.length<2;if(L.length>=2)vChart('cBW',L.map(x=>({v:x.v,l:dShort(x.d),d:x.d})),'kg');
  $('bwList').innerHTML=L.slice(-6).reverse().map(x=>'<span class="bwi">'+esc(dShort(x.d))+' · <b>'+fmtN(x.v)+' kg</b><button type="button" data-bwdel="'+x.d+'" aria-label="Supprimer cette pesée">×</button></span>').join('')}
const lastBw=()=>{const L=S.bw.slice().sort((a,b)=>a.d<b.d?-1:1);return L.length?L[L.length-1].v:0};

/* ---------- bilan du mois ---------- */
function bilanData(mk){const ss=S.sessions.filter(s=>s.date.startsWith(mk)),exc={},plc={},wkc={};ss.forEach(s=>{s.ex.forEach(x=>exc[x]=(exc[x]||0)+1);plc[s.place]=(plc[s.place]||0)+1;const w=wkOf(s.date);wkc[w]=(wkc[w]||0)+1});
  const top=o=>Object.keys(o).sort((a,b)=>o[b]-o[a])[0],te=top(exc);return {n:ss.length,dur:ss.reduce((a,s)=>a+sDur(s),0),days:new Set(ss.map(s=>s.date)).size,vol:ss.reduce((a,s)=>a+sVol(s),0),ex:te,exN:te?exc[te]:0,pl:top(plc),bw:Math.max(0,...Object.values(wkc)),recs:S.recs.reduce((a,r)=>a+r.hist.filter((h,i)=>i>0&&h.d.startsWith(mk)).length,0)}}
function prevMk(){const d=new Date(T.getFullYear(),T.getMonth()-1,1);return d.getFullYear()+'-'+pad(d.getMonth()+1)}
function showBilan5(mk){const [y,m]=mk.split('-').map(Number),D=bilanData(mk),pd=new Date(y,m-2,1),P=bilanData(pd.getFullYear()+'-'+pad(pd.getMonth()+1)),mn=mName(y,m-1,'long'),pn=mName(pd.getFullYear(),pd.getMonth(),'long'),d=D.n-P.n,de=/^[aeiouyh]/i.test(mn)?'d\'':'de ';
  let o=$('bil');if(!o){o=document.createElement('div');o.id='bil';o.className='onb bil';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');document.body.appendChild(o)}
  const li=[D.ex?'<li>Exercice le plus fait : <b>'+esc(D.ex)+'</b> ('+D.exN+' fois)</li>':'',D.pl?'<li>Lieu favori : <b>'+esc(plN[D.pl]||D.pl)+'</b></li>':'',D.bw?'<li>Meilleure semaine : <b>'+D.bw+' séance'+(D.bw>1?'s':'')+'</b></li>':'',D.vol?'<li>Volume soulevé : <b>'+fmtKg(D.vol)+'</b></li>':'',(P.n||D.n)?'<li>'+(d>0?'<b>+'+d+' séance'+(d>1?'s':'')+'</b> par rapport à '+esc(pn):d<0?'<b>'+d+' séance'+(d<-1?'s':'')+'</b> par rapport à '+esc(pn):'Autant de séances qu\'en '+esc(pn))+'</li>':''].join('');
  o.innerHTML='<div class="in"><p class="kick">Bilan du mois</p><h2>Ton mois '+de+esc(mn)+'</h2><div class="kp"><div><b data-n="'+D.n+'">'+D.n+'</b><span>séances</span></div><div><b data-n="'+D.days+'">'+D.days+'</b><span>jours actifs</span></div><div><b data-n="'+D.dur+'" data-f="dur">'+fmtDur(D.dur)+'</b><span>temps total</span></div><div><b data-n="'+D.recs+'">'+D.recs+'</b><span>record'+(D.recs>1?'s':'')+' battu'+(D.recs>1?'s':'')+'</span></div></div>'+(li?'<ul class="bl">'+li+'</ul>':'')+'<p>'+esc(D.n>=12?'Mois énorme. Continue sur cette lancée !':D.n>=6?'Belle régularité, continue comme ça !':D.n>0?'Chaque séance compte. On vise un peu plus ce mois-ci ?':'Nouveau mois, nouveau départ !')+'</p><button type="button" class="btn" id="bilOk">Continuer</button></div>';
  o.hidden=false;countUp(o)}
function maybeBilan(){const mk=prevMk();if(S.bilanSeen===mk)return false;S.bilanSeen=mk;save();if(S.sessions.some(s=>s.date.startsWith(mk))){setTimeout(()=>showBilan(mk),1500);return true}return false}

/* ---------- page Plus : réglages ---------- */
function renderSet25(){$('iconBox').innerHTML=iconTiles();$('iconNote').textContent=(navigator.standalone||matchMedia('(display-mode: standalone)').matches)?'Sur iPhone, l\'icône déjà posée sur ton écran d\'accueil ne change pas toute seule. Pour la changer : copie ta sauvegarde, supprime l\'appli de l\'écran d\'accueil, rouvre le lien dans Safari, choisis l\'icône puis rajoute l\'appli et restaure ta sauvegarde.':'Choisis ton icône avant d\'ajouter l\'appli à ton écran d\'accueil : c\'est elle qui sera utilisée.';
  $('accBox').innerHTML=Object.entries(ACC).map(([k,a])=>'<button type="button" class="acsw" data-acc="'+k+'" aria-pressed="'+(S.acc===k)+'" style="--c:'+a[0]+'"><i></i><span>'+a[2]+'</span></button>').join('');
  $('thBox').innerHTML=[['dark','Sombre'],['light','Clair'],['auto','Comme le téléphone']].map(t=>'<button type="button" class="chip" data-thm="'+t[0]+'" aria-pressed="'+(S.theme===t[0])+'">'+t[1]+'</button>').join('');
  $('sndBox').innerHTML=Object.entries(SNDS).map(([k,v])=>'<button type="button" class="chip" data-snd="'+k+'" aria-pressed="'+(S.snd===k)+'">'+v+'</button>').join('');
  $('voiceBox').innerHTML='<button type="button" class="tglrow" data-voice="1" aria-pressed="'+S.voice+'"><span><b>Annonce vocale</b>« 3, 2, 1, go » en plus du son</span><i></i></button>';
  $('goalWBox').innerHTML=stepper('Séances par semaine','goal',S.goal,'')}
function renderGuideList(){const raw=(($('gxQ')||{}).value||'').trim(),q=norm(raw),L=allEx().filter(x=>!q||norm(x).includes(q));
  $('guideList').innerHTML=L.map(x=>'<button type="button" class="gcard" data-guide="'+esc(x)+'">'+picto(x)+'<span>'+esc(x)+'</span></button>').join('')+(q&&!L.some(x=>norm(x)===q)?'<button type="button" class="gcard gadd" data-gadd="1"><b>+</b><span>Ajouter « '+esc(raw)+' »</span></button>':'')}

/* ---------- export ---------- */
const perfPlain=(s,x)=>{const p=s.perf&&s.perf[x];if(!p)return '';if(Array.isArray(p.sets)&&p.sets.length)return ' '+perfSets(p);let t='';if(p.sec)t=' '+(p.s>1?p.s+'x':'')+p.sec+' s';else if(p.s&&p.r)t=' '+p.s+'x'+p.r;else if(p.r)t=' '+p.r+' rép.';else if(p.s)t=' '+p.s+' série'+(p.s>1?'s':'');if(p.kg)t+=' '+String(p.kg).replace('.',',')+' kg';return t};
async function shareFile(blob,name){let f=null;try{f=new File([blob],name,{type:blob.type})}catch(e){}
  try{if(f&&navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});return}}catch(e){if(e&&e.name==='AbortError')return}
  const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},5000)}
function exportCSV(){const H=['Date','Jour','Moment','Lieu','Types','Exercices','Durée (min)','Ressenti','Volume (kg)','Note'].map(trS),q=v=>{v=String(v==null?'':v);return /[;"\r\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
  const rows=S.sessions.slice().sort((a,b)=>a.date<b.date?1:-1).map(s=>[s.date.split('-').reverse().join('/'),parse(s.date).toLocaleDateString(LOC(),{weekday:'long'}),trS(s.tod?todN[s.tod]:''),trS(plN[s.place]||s.place),s.types.filter(okT).map(t=>trS(tyN[t])).join(', '),s.ex.map(x=>trS(x)+trS(perfPlain(s,x))).join(', '),s.dur||'',trS(feelOf(s)?feelOf(s)[2]:''),sVol(s)?Math.round(sVol(s)):'',s.note||'']);
  shareFile(new Blob(['﻿'+[H].concat(rows).map(r=>r.map(q).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}),'carnet-seances-'+TK+'.csv')}
function makePDF(lines){const W=595,H=842,M=46,pages=[];let cur=[],y=H-M;
  const enc=s=>String(s).replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—−]/g,'-').replace(/…/g,'...').replace(/[  ]/g,' ').replace(/œ/g,'oe').replace(/Œ/g,'OE').replace(/[^\x20-\xff]/g,'').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
  lines.forEach(L=>{L=Object.assign({},L,{t:trS(String(L.t))}); /* v7.6 : le PDF suit la langue de l'appli */const sz=L.s||10,lh=sz*1.4,maxc=Math.floor((W-2*M)/(sz*(L.b?.56:.51))),rows=[];let row='';String(L.t).split(' ').forEach(w=>{const nx=row?row+' '+w:w;if(nx.length>maxc&&row){rows.push(row);row=w}else row=nx});rows.push(row);
    if(L.gap)y-=L.gap;rows.forEach(r=>{if(y-lh<M){pages.push(cur);cur=[];y=H-M}y-=lh;cur.push('BT /'+(L.b?'F2':'F1')+' '+sz+' Tf '+(L.c||'0 0 0')+' rg '+M+' '+y.toFixed(1)+' Td ('+enc(r)+') Tj ET')})});pages.push(cur);
  const objs=['<< /Type /Catalog /Pages 2 0 R >>','','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'],kids=[];
  pages.forEach(pc=>{const st=pc.join('\n');objs.push('<< /Length '+st.length+' >>\nstream\n'+st+'\nendstream');const cid=objs.length;objs.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+W+' '+H+'] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+cid+' 0 R >>');kids.push(objs.length)});
  objs[1]='<< /Type /Pages /Kids ['+kids.map(k=>k+' 0 R').join(' ')+'] /Count '+kids.length+' >>';
  let out='%PDF-1.4\n%\xe2\xe3\xcf\xd3\n';const off=[];objs.forEach((o,i)=>{off.push(out.length);out+=(i+1)+' 0 obj\n'+o+'\nendobj\n'});
  const xr=out.length;out+='xref\n0 '+(objs.length+1)+'\n0000000000 65535 f \n'+off.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+(objs.length+1)+' /Root 1 0 R >>\nstartxref\n'+xr+'\n%%EOF';
  const b=new Uint8Array(out.length);for(let i=0;i<out.length;i++)b[i]=out.charCodeAt(i)&255;return new Blob([b],{type:'application/pdf'})}
function exportPDF(){const L=[],ss=S.sessions.slice().sort((a,b)=>a.date<b.date?1:a.date>b.date?-1:0),td=ss.reduce((a,s)=>a+sDur(s),0);
  L.push({t:'Carnet de séances'+(S.name?' de '+S.name:''),s:20,b:1});L.push({t:'Export du '+parse(TK).toLocaleDateString(LOC(),{day:'numeric',month:'long',year:'numeric'})+' · '+ss.length+' séance'+(ss.length>1?'s':'')+(td?' · '+fmtDur(td)+' au total':''),s:10,c:'0.4 0.4 0.4',gap:4});
  let cm='';ss.forEach(s=>{const mk=s.date.slice(0,7);if(mk!==cm){cm=mk;const d=parse(s.date);L.push({t:(mName(d.getFullYear(),d.getMonth(),'long')+' '+d.getFullYear()).replace(/^./,c=>c.toUpperCase()),s:13,b:1,gap:14})}
    L.push({t:[parse(s.date).toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long'}).replace(/^./,c=>c.toUpperCase()),plN[s.place]||s.place,s.tod?todN[s.tod]:'',s.dur?fmtDur(s.dur):'',feelOf(s)?'Ressenti : '+feelOf(s)[2]:''].filter(Boolean).join(' · '),s:10.5,b:1,gap:7});
    const ty=s.types.filter(okT).map(t=>tyN[t]).join(', ');if(ty)L.push({t:'Type : '+ty,s:9.5});if(s.ex.length)L.push({t:'Exercices : '+s.ex.map(x=>x+perfPlain(s,x)).join(', '),s:9.5});if(sVol(s))L.push({t:'Volume : '+fmtKg(sVol(s)),s:9.5});if(s.note)L.push({t:'Note : '+s.note,s:9.5,c:'0.35 0.35 0.35'})});
  if(!ss.length)L.push({t:'Aucune séance notée pour l\'instant.',s:11,gap:10});
  shareFile(makePDF(L),'carnet-seances-'+TK+'.pdf')}

/* ---------- glisser pour réorganiser les exercices ---------- */
let drg=null;
document.addEventListener('pointerdown',e=>{const h=e.target.closest('.hdl');if(!h)return;e.preventDefault();if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();const row=h.closest('.mrow');drg={row,list:row.parentNode,g:+h.dataset.g,id:e.pointerId};row.classList.add('drag');try{h.setPointerCapture(e.pointerId)}catch(_){}});
document.addEventListener('pointermove',e=>{if(!drg||e.pointerId!==drg.id)return;e.preventDefault();const y=e.clientY,rows=[...drg.list.querySelectorAll('.mrow')].filter(r=>r!==drg.row);let before=null;for(const r of rows){const b=r.getBoundingClientRect();if(y<b.top+b.height/2){before=r;break}}
  if(before){if(drg.row.nextElementSibling!==before)drg.list.insertBefore(drg.row,before)}else if(rows.length){const lr=rows[rows.length-1];if(lr.nextElementSibling!==drg.row)lr.after(drg.row)}},{passive:false});
const drgEnd=e=>{if(!drg||e.pointerId!==drg.id)return;const g=drg.g,old=S.exg[g][1].slice(),order=[...drg.list.querySelectorAll('.mrow')].map(r=>+r.dataset.x);drg.row.classList.remove('drag');drg=null;const nw=order.map(i=>old[i]).filter(v=>v!==undefined);if(nw.length===old.length&&nw.some((v,i)=>v!==old[i])){S.exg[g][1]=nw;save()}drawForm()};
document.addEventListener('pointerup',drgEnd);document.addEventListener('pointercancel',drgEnd);
/* ---------- son, voix, vibration, écran allumé ---------- */
const SNDS={bip:'Bip',gong:'Gong',cloche:'Clochette',sifflet:'Sifflet',muet:'Aucun son'};
let actx=null,wl=null,spOk=false;
function audioOn(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume()}catch(e){}if(S.voice&&!spOk&&'speechSynthesis' in window){try{const u=new SpeechSynthesisUtterance(' '),v=pickVoice();u.volume=0;u.lang=v?v.lang:voiceLang();if(v)u.voice=v;speechSynthesis.speak(u);spOk=true}catch(e){}}}
function tone(f,d,v,type,dl){if(!actx)return;try{const t=actx.currentTime+(dl||0),o=actx.createOscillator(),g=actx.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,(v||.25)*(S.vol===undefined?1:S.vol)),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+d+.05)}catch(e){}}
/* v7.2 : voix. Cause des voix allemandes : la voix choisie était retrouvée par son NOM ; sur iPhone, les mêmes noms
   (Eddy, Flo, Grandma, Reed, Sandy, Shelley…) existent dans plusieurs langues et la première trouvée était souvent l'allemande.
   Désormais : identifiant unique (voiceURI), seulement des voix de la langue de l'appli, meilleure voix choisie d'office. */
const VOICE_ROBOT=/eloquence|novelty|\b(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|albert|bahh|bells|boing|bubbles|cellos|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph|bad news|good news)\b/i;
const voiceLang=()=>({fr:'fr-FR',en:'en-GB',nl:'nl-BE'})[S.lang]||'fr-FR';
function voiceList(){if(!('speechSynthesis' in window))return [];const lg=(S.lang||'fr').slice(0,2);let L=[];try{L=speechSynthesis.getVoices()}catch(e){}return L.filter(v=>String(v.lang||'').toLowerCase().replace('_','-').slice(0,2)===lg&&!VOICE_ROBOT.test(v.name+' '+v.voiceURI))}
function voiceScore(v){const n=(v.name+' '+v.voiceURI).toLowerCase(),lc=String(v.lang||'').toLowerCase().replace('_','-'),P={fr:['fr-fr','fr-be','fr-ch','fr-ca'],en:['en-gb','en-us','en-ie','en-au'],nl:['nl-be','nl-nl']}[S.lang]||[],i=P.indexOf(lc);
  return (/premium|enhanced|amélioré|neural|natural|siri/.test(n)?40:0)+(/google/.test(n)?14:0)+(i>=0?(P.length-i)*3:0)+(v.localService?3:0)+(v.default?2:0)}
function pickVoice(){const L=voiceList();if(!L.length)return null;if(S.voiceU){const v=L.find(x=>x.voiceURI===S.voiceU);if(v)return v}
  if(S.voiceN){const v=L.find(x=>x.name===S.voiceN);S.voiceU=v?v.voiceURI:'';S.voiceN='';save();if(v)return v} /* ancien réglage (par nom) : repris seulement dans la bonne langue */
  return L.slice().sort((a,b)=>voiceScore(b)-voiceScore(a))[0]}
function say(t){if(!S.voice||!t||!('speechSynthesis' in window))return;try{const ss=speechSynthesis,v=pickVoice(),u=new SpeechSynthesisUtterance(typeof trS==='function'?trS(t):t);
  u.lang=v?v.lang:voiceLang();if(v)u.voice=v;u.rate=1;u.pitch=1;u.volume=S.vol===undefined?1:S.vol;
  if(ss.speaking||ss.pending){ss.cancel();setTimeout(()=>ss.speak(u),70)}else ss.speak(u)}catch(e){}} /* jamais deux annonces en même temps ; petit délai après cancel (iPhone) */
function sTick(n){const k=S.snd;if(k==='bip')tone(660,.12,.25);else if(k==='gong')tone(330,.4,.22);else if(k==='cloche'){tone(1320,.3,.16);tone(2640,.2,.05)}else if(k==='sifflet')tone(1900,.09,.1,'square');if(n)say(String(n))}
function sGo(w){const k=S.snd;if(k==='bip')tone(990,.6,.35);else if(k==='gong'){tone(196,1.8,.35);tone(392,1.2,.12);tone(588,.8,.05)}else if(k==='cloche'){tone(1568,.9,.25);tone(3136,.6,.07);tone(1568,.9,.2,'sine',.28)}else if(k==='sifflet'){tone(2100,.16,.12,'square');tone(2600,.3,.12,'square',.2)}say(w)}
function sWin(){if(S.snd==='muet')return;tone(784,.14,.2);tone(988,.14,.2,'sine',.12);tone(1319,.34,.24,'sine',.24)}
function sTest(){audioOn();sTick(3);setTimeout(()=>sTick(2),800);setTimeout(()=>sTick(1),1600);setTimeout(()=>sGo('Go'),2400)}
const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
async function wakeOn(){try{if('wakeLock' in navigator&&!wl){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>{wl=null})}}catch(e){}}
function wakeOff(){try{if(wl)wl.release()}catch(e){}wl=null}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&TM)wakeOn()});

/* ---------- minuteurs : repos, EMOM, pyramide ---------- */
let TM=null,tmIv=null,tmCk='',tmTab='rest',tmRun=null;
const TC=2*Math.PI*118;
const fmtR=s=>s<60?s+' s':Math.floor(s/60)+':'+pad(s%60);
function tmStart(c){audioOn();wakeOn();const now=Date.now();tmRun={k:c.k,start:now,name:c.name||'',steps:c.steps||null,n:c.n||0,iv:c.iv||0,target:c.target||0};
  if(c.k==='rest')TM={k:'rest',total:c.sec,end:now+c.sec*1000,next:c.next||'',lab:c.lab||'Repos',ls:-1};
  else if(c.k==='emom')TM={k:'emom',n:c.n,iv:c.iv,target:c.target,start:now+10000,ls:-1,lr:-1};
  else TM={k:'pyr',steps:c.steps,name:c.name||'',i:0,phase:'work',end:0,rt:1,reps:0,ls:-1};
  tmCk='';clearInterval(tmIv);tmIv=setInterval(tmLoop,200);tmShow(true);tmLoop();tmSave()}
function tmStop(){TM=null;clearInterval(tmIv);tmIv=null;tmShow(null);wakeOff();tmSave();tmNotifClose()} /* v7.4 : tmShow, tmSave… dans 80_timers6.js */
function tmFin(title,sub,word){sGo(word||'Terminé');buzz([300,150,300]);TM={k:'fin',title:emo(title),sub}}
function tmLoop5(){if(!TM)return;const now=Date.now();let lab='',big='',sub='',prog=0,ck='',ctl='';
  if(TM.k==='rest'){const rem=Math.max(0,TM.end-now),s=Math.ceil(rem/1000);if(rem<=0){sGo('Go');buzz([250,120,250]);TM={k:'go',until:now+1600,msg:TM.next||''};return tmLoop()}
    if(s!==TM.ls){TM.ls=s;if(s<=3)sTick(s)}lab=TM.lab;big=mmss(s);sub=TM.next||'Récupère bien';prog=1-rem/(TM.total*1000);ck='rest';
    ctl='<button type="button" class="tbtn" data-tm="m15">−15 s</button><button type="button" class="tbtn" data-tm="p15">+15 s</button><button type="button" class="tbtn main" data-tm="skip">'+(TM.lab==='Échauffement'?'Terminer l\'échauffement':'Terminer le repos')+'</button>'}
  else if(TM.k==='go'){if(now>TM.until){tmStop();return}lab='C\'est reparti';big='Go !';sub=TM.msg||'';prog=1;ck='go'}
  else if(TM.k==='emom'){const t=TM.pausedAt||now,el=t-TM.start;
    if(el<0){const s=Math.ceil(-el/1000);if(s!==TM.ls){TM.ls=s;if(s<=3&&!TM.pausedAt)sTick(s)}lab='EMOM · prépare-toi';big=String(s);sub=TM.n+' × '+mmssL(TM.iv);prog=1+el/10000}
    else{const r=Math.floor(el/(TM.iv*1000));if(r>=TM.n){S.cnt.emom=(S.cnt.emom||0)+1;save();tmFin('EMOM terminé ! 🎉',TM.n+' intervalle'+(TM.n>1?'s':'')+(TM.target?' · '+(TM.target*TM.n)+' rép. au total':''));return tmLoop()}
      const inI=el-r*TM.iv*1000,rem=TM.iv*1000-inI,s=Math.ceil(rem/1000);if(r!==TM.lr){TM.lr=r;TM.ls=s;sGo('Go');buzz(200)}else if(s!==TM.ls){TM.ls=s;if(s<=3&&!TM.pausedAt)sTick(s)}
      lab='EMOM · Intervalle '+(r+1)+'/'+TM.n;big=mmss(s);sub=TM.target?TM.target+' rép. à faire, puis récupère':'Fais tes répétitions, puis récupère';prog=inI/(TM.iv*1000)}
    if(TM.pausedAt)sub='En pause';ck='emom'+(TM.pausedAt?'p':'');ctl=TM.pausedAt?'<button type="button" class="tbtn main" data-tm="resume">Reprendre</button>':'<button type="button" class="tbtn" data-tm="pause">Pause</button>'} /* v7.4 : « Arrêter » seulement en haut (pas de doublon) */
  else if(TM.k==='pyr'){const st=TM.steps,i=TM.i,nm=TM.name?TM.name+' · ':'Pyramide · ';
    if(TM.phase==='work'){lab=nm+'Marche '+(i+1)+'/'+st.length;big=String(st[i]);sub='répétition'+(st[i]>1?'s':'')+' · touche « Fait » quand c\'est bon';prog=i/st.length;ck='pw'+i;ctl='<button type="button" class="tbtn main" data-tm="pdone">Fait ✓</button>'}
    else{const rem=Math.max(0,TM.end-now),s=Math.ceil(rem/1000);if(rem<=0){sGo('Go');buzz(200);TM.i++;TM.phase='work';return tmLoop()}if(s!==TM.ls){TM.ls=s;if(s<=3)sTick(s)}
      lab='Repos · prochaine marche : '+st[i+1]+' rép.';big=mmss(s);sub=TM.reps+' rép. faites';prog=1-rem/TM.rt;ck='pr'+i;ctl='<button type="button" class="tbtn" data-tm="pskip">Passer le repos</button>'}}
  else if(TM.k==='fin'){lab=TM.title;big=CHK;sub=TM.sub;prog=1;ck='fin';ctl='<button type="button" class="tbtn main" data-tm="stop">Terminer</button>'}
  const tl=$('tLab');if(tl.dataset.v!==lab){tl.dataset.v=lab;tl.innerHTML=lab.split(' · ').map(x=>'<span>'+esc(x)+'</span>').join(' · ')} /* v7.4 : chaque morceau se traduit (nom de l'exercice, « Marche 1/3 ») */
  const bg=$('tBig');if(big.charAt(0)==='<'){if(bg.dataset.k!==ck){bg.innerHTML=big;bg.dataset.k=ck}}else{bg.textContent=big;bg.dataset.k=''}
  $('tSub').textContent=sub;$('tArc').style.strokeDasharray=(TC*Math.max(0,Math.min(1,prog))).toFixed(1)+' '+TC.toFixed(1);
  if(ck!==tmCk){tmCk=ck;$('tCtl').innerHTML=ctl;$('tDots').innerHTML=TM.k==='pyr'?TM.steps.map((v,j)=>'<i class="'+(j<TM.i||(j===TM.i&&TM.phase==='rest')?'d':j===TM.i?'c':'')+'">'+v+'</i>').join(''):''}} /* v7.4 : le mini-lecteur est rempli par tmMiniSync (80_timers6.js) */
function tmAct(a){if(a==='min'){tmShow(false);return}if(a==='stop'){tmStopU();return}if(!TM)return;const now=Date.now();
  if(TM.k==='rest'){if(a==='p15'){TM.end+=15000;TM.total+=15}else if(a==='m15')TM.end=Math.max(now+1000,TM.end-15000);else if(a==='skip'){tmStop();return}}
  else if(TM.k==='emom'){if(a==='pause'&&!TM.pausedAt)TM.pausedAt=now;else if(a==='resume'&&TM.pausedAt){TM.start+=now-TM.pausedAt;delete TM.pausedAt}}
  else if(TM.k==='pyr'){if(a==='pdone'&&TM.phase==='work'){audioOn();TM.reps+=TM.steps[TM.i];if(TM.i>=TM.steps.length-1){S.cnt.pyr=(S.cnt.pyr||0)+1;if(Math.max(...TM.steps)>=10)S.cnt.pyr10=(S.cnt.pyr10||0)+1;save();tmFin('Pyramide terminée ! 🎉',TM.reps+' répétitions au total')}else{const sec=pyRest(TM.steps[TM.i]);TM.phase='rest';TM.rt=sec*1000;TM.end=now+TM.rt;TM.ls=-1}}else if(a==='pskip'&&TM.phase==='rest')TM.end=now}
  tmLoop();tmSave()}

/* ---------- pyramide : marches, tranches de repos, pyramides enregistrées ---------- */
function pySteps(c){c=c||S.tmc;const a=Math.max(1,+c.pyStart||1),b=Math.max(a+1,+c.pyTop||10),st=Math.max(1,+c.pyStep||1),up=[];for(let r=a;r<=b;r+=st)up.push(r);if(up[up.length-1]!==b)up.push(b);return c.pyShape==='u'?up:c.pyShape==='d'?up.slice().reverse():up.concat(up.slice(0,-1).reverse())}
function normR(c){c=c||S.tmc;const top=Math.max(2,+c.pyTop||10),st=Math.max(1,+c.pyStart||1);let R=arr(c.pyR).map(r=>({b:Math.round(+r.b)||top,x:Math.max(0,Math.round(+r.x)||0),y:Math.max(0,Math.round(+r.y)||0)}));if(!R.length)R=[{b:top,x:30,y:30}];
  const out=[];let a=Math.min(st,top);for(const r of R){if(a>top)break;const b=Math.min(top,Math.max(a,r.b));out.push({a,b,x:r.x,y:r.y});a=b+1}
  out[out.length-1].b=top;c.pyR=out;return out}
function pyRest(r,c){c=c||S.tmc;if(c.pyMode==='fix')return Math.max(5,+c.pyFix||30);const R=normR(c);let g=R.find(x=>r>=x.a&&r<=x.b);if(!g)g=r<R[0].a?R[0]:R[R.length-1];
  if(g.b===g.a)return Math.max(1,g.x);return Math.max(1,Math.round(g.x+(g.y-g.x)*(Math.min(g.b,Math.max(g.a,r))-g.a)/(g.b-g.a)))}
const rLine=r=>(r.a===r.b?'Marche '+r.a:'Marches '+r.a+' à '+r.b)+' : '+(r.a===r.b||r.x===r.y?fmtR(r.x):fmtR(r.x)+'/'+fmtR(r.y));
function pyCard(p){const c=clone(p.c),st=pySteps(c),tot=st.reduce((a,b)=>a+b,0);
  return '<div class="pyc'+(S.tmc.pyId===p.id?' on':'')+'"><button type="button" class="pym" data-pre="'+p.id+'"><b>'+esc(p.name)+' · '+c.pyTop+' <small>('+tot+')</small></b><span>'+(c.pyMode==='fix'?'<i>Repos fixe : '+fmtR(+c.pyFix||30)+'</i>':normR(c).map(r=>'<i>'+esc(rLine(r))+'</i>').join(''))+'</span></button><button type="button" class="pyplay" data-pyrun="'+p.id+'" aria-label="Lancer '+esc(p.name)+'">'+PLAY+'</button><button type="button" class="pdel" data-predel="'+p.id+'" aria-label="Supprimer '+esc(p.name)+'">×</button></div>'}
const rStep=(i,f,v)=>'<span class="mini"><button type="button" class="ib" data-rx="'+i+':'+f+':-5" aria-label="Moins de repos">−</button><b>'+fmtR(v)+'</b><button type="button" class="ib" data-rx="'+i+':'+f+':5" aria-label="Plus de repos">+</button></span>';
function rangesHtml(R){return '<div class="trs">'+R.map((r,i)=>'<div class="trg"><div class="tra"><span>'+(r.a===r.b?'Marche <b>'+r.a+'</b>':'Marches <b>'+r.a+' à '+r.b+'</b>')+'</span>'+(i<R.length-1?'<span class="mini"><button type="button" class="ib" data-rb="'+i+':-1" aria-label="Finir la tranche une marche plus tôt">−</button><button type="button" class="ib" data-rb="'+i+':1" aria-label="Finir la tranche une marche plus tard">+</button></span>':'<em>jusqu\'au sommet</em>')+(R.length>1?'<button type="button" class="pdel" data-rdl="'+i+'" aria-label="Supprimer cette tranche">×</button>':'')+'</div><div class="trb"><span>Repos</span>'+rStep(i,'x',r.x)+(r.a===r.b?'':'<span class="arr">→</span>'+rStep(i,'y',r.y))+'</div></div>').join('')+'</div><button type="button" class="btn ghost sm" data-radd="1">+ Ajouter une tranche</button><p class="note">Exemple : marches 1 à 5, repos de 15 s à 30 s. Le repos compte après chaque marche, à la montée comme à la descente.</p>'}
function pyHtml(){const c=S.tmc,R=normR(),st=pySteps(),tot=st.reduce((a,b)=>a+b,0),lv=[...new Set(st)].sort((a,b)=>a-b),P=S.presets.filter(p=>p.k==='pyr'),cur=c.pyId?P.find(p=>p.id===c.pyId):null;
  return '<div class="pyhd"><h5 class="h5">Mes pyramides</h5><button type="button" class="btn ghost sm" data-pynew="1">+ Nouvelle</button></div>'+(P.length?'<div class="pyl">'+P.map(pyCard).join('')+'</div>':'<p class="note">Enregistre tes pyramides pour les relancer en un geste.</p>')
   +'<h5 class="h5">'+(cur?'Réglage de « '+esc(cur.name)+' »':'Nouvelle pyramide')+'</h5>'
   +'<div class="fld"><input id="pyEx" list="exDl" maxlength="40" autocomplete="off" placeholder="Exercice (ex. Tractions)" value="'+esc(c.pyEx||'')+'"></div><datalist id="exDl">'+allEx().map(x=>'<option value="'+esc(x)+'"></option>').join('')+'</datalist>'
   +stepper('Départ','pyStart',c.pyStart,' rép.')+stepper('Sommet','pyTop',c.pyTop,' rép.')
   +'<h5 class="h5">Pas entre les marches</h5><div class="chips">'+[1,2].map(n=>'<button type="button" class="chip" data-pystep="'+n+'" aria-pressed="'+(+c.pyStep===n)+'">+'+n+' rép.</button>').join('')+'</div>'
   +'<h5 class="h5">Forme</h5><div class="chips">'+[['ud','Montée + descente'],['u','Montée'],['d','Descente']].map(o=>'<button type="button" class="chip" data-pys="'+o[0]+'" aria-pressed="'+(c.pyShape===o[0])+'">'+o[1]+'</button>').join('')+'</div>'
   +'<h5 class="h5">Repos</h5><div class="chips">'+[['prog','Par tranches de marches'],['fix','Fixe']].map(o=>'<button type="button" class="chip" data-pymode="'+o[0]+'" aria-pressed="'+(c.pyMode===o[0])+'">'+o[1]+'</button>').join('')+'</div>'
   +(c.pyMode==='fix'?stepper('Repos','pyFix',c.pyFix,' s'):rangesHtml(R))
   +'<p class="pyprev">Marches : '+st.join(' · ')+' <b>= '+tot+' rép.</b></p>'+(c.pyMode==='prog'?'<div class="rests">'+lv.map(r=>'<span>'+r+' rép. <b>'+fmtR(pyRest(r))+'</b></span>').join('')+'</div>':'')
   +'<button type="button" class="btn big" data-tmgo="pyr">Lancer la pyramide</button>'
   +'<div class="fld" style="margin-top:12px"><input id="preName" maxlength="30" placeholder="Nom de la pyramide" value="'+esc(cur?cur.name:(c.pyEx||''))+'"><button type="button" class="btn ghost" data-presave="pyr">'+(cur?'Mettre à jour':'Enregistrer')+'</button></div>'}
function emHtml(){const c=S.tmc,P=S.presets.filter(p=>p.k==='emom');
  return (P.length?'<h5 class="h5">Mes réglages</h5><div class="chips">'+P.map(p=>'<span class="pchip"><button type="button" class="chip" data-pre="'+p.id+'">'+esc(p.name)+'</button><button type="button" class="pdel" data-predel="'+p.id+'" aria-label="Supprimer ce réglage">×</button></span>').join('')+'</div>':'')
   +'<p class="findsub">Every Minute On the Minute : au signal, fais tes répétitions, puis récupère jusqu\'au signal suivant.</p>'+stepper('Nombre d\'intervalles','emN',c.emN,'')
   +'<h5 class="h5">Durée d\'un intervalle</h5><div class="chips">'+[[60,'1 min'],[90,'1 min 30'],[120,'2 min']].map(o=>'<button type="button" class="chip" data-emi="'+o[0]+'" aria-pressed="'+(+c.emI===o[0])+'">'+o[1]+'</button>').join('')+'</div>'
   +'<h5 class="h5">Répétitions par intervalle <small>facultatif</small></h5><div class="fld"><input id="emT" type="number" inputmode="numeric" min="0" placeholder="Ex. 5" value="'+(c.emT||'')+'"></div><p class="pyprev">Durée totale : <b>'+fmtDur(c.emN*c.emI/60)+'</b></p><button type="button" class="btn big" data-tmgo="emom">Lancer l\'EMOM</button>'
   +'<h5 class="h5">Garder ce réglage</h5><div class="fld"><input id="preName" maxlength="30" placeholder="Nom du réglage" value="'+esc('EMOM '+c.emN+' × '+mmssL(+c.emI)+(c.emT?' · '+c.emT+' rép.':''))+'"><button type="button" class="btn ghost" data-presave="emom">Enregistrer</button></div>'}
function lestHtml(){const bw=lastBw();return '<p class="findsub">Pour les tractions et les dips lestés : ton lest en pourcentage de ton poids du corps.</p><div class="lc"><label>Poids du corps (kg)<input id="lcBw" type="number" inputmode="decimal" min="20" max="300" step="0.1" value="'+(bw||'')+'" placeholder="Ex. 75"></label><label>Lest (kg)<input id="lcL" type="number" inputmode="decimal" min="0" max="200" step="0.5" placeholder="Ex. 15"></label></div><div id="lcOut" class="lco"></div><h5 class="h5">Lest pour un pourcentage donné</h5><div class="lc"><label>Objectif (% du poids)<input id="lcP" type="number" inputmode="decimal" min="0" max="150" step="1" placeholder="Ex. 25"></label></div><div id="lcOut2" class="lco"></div><div id="lcTab" class="lctab"></div>'}
function renderTm(){$('tmSeg').innerHTML=[['rest','Repos'],['emom','EMOM'],['pyr','Pyramide'],['lest','Lest']].map(x=>'<button type="button" data-tmtab="'+x[0]+'" aria-pressed="'+(tmTab===x[0])+'">'+x[1]+'</button>').join('');
  $('tmBox').innerHTML=tmTab==='rest'?'<p class="findsub">Touche une durée pour lancer le repos.</p><div class="tgrid">'+[30,45,60,90,120,150,165,180].map(s=>'<button type="button" class="tchip" data-rsec="'+s+'">'+mmssL(s)+'</button>').join('')+'</div><p class="note">Conseil : 2 min 45 à 3 min entre chaque série.</p>':tmTab==='emom'?emHtml():tmTab==='pyr'?pyHtml():lestHtml();
  if(tmTab==='lest')renderLC()}
function renderLC(){const bw=parseFloat(($('lcBw')||{}).value)||0,l=parseFloat(($('lcL')||{}).value)||0,p=parseFloat(($('lcP')||{}).value)||0,r5=v=>Math.round(v*2)/2;
  $('lcOut').innerHTML=bw?(l?'<div><b>'+fmtN(l/bw*100)+' %</b><span>de ton poids du corps</span></div><div><b>'+fmtN(bw+l)+' kg</b><span>charge totale soulevée</span></div>':'<p class="note">Entre ton lest pour voir le pourcentage.</p>'):'<p class="note">Entre ton poids du corps. Il est repris de tes mesures (Progrès → Mesures) si tu l\'as noté.</p>';
  $('lcOut2').innerHTML=bw&&p?'<div><b>'+fmtN(r5(bw*p/100))+' kg</b><span>de lest pour '+fmtN(p)+' % de ton poids</span></div>':'';
  $('lcTab').innerHTML=bw?[10,20,30,40,50].map(q=>'<span>+'+q+' % <b>'+fmtN(r5(bw*q/100))+' kg</b></span>').join(''):''}

/* ---------- échauffement ---------- */
const WU={salle:[['5 min de vélo','Pour réveiller le cœur et le corps.','t300'],
  ['Échauffement articulaire','Chauffer la colonne avec des rotations de colonne, puis :',['Rotations de bras','Rotations de coudes','Rotations de poignets','Rotations de cou pour les cervicales']],
  ['Élastique : coiffe des rotateurs','Juste la coiffe des rotateurs :',['Rotations externes','Rotations internes']],
  ['Échauffement musculaire','Important. Pour chaque exercice, monter en charge :','ramp'],
  ['1 minute de repos','Puis commencer les séries de travail.','t60']],
 street:[['5 min de corde à sauter','Pour réveiller le cœur et le corps.','t300'],
  ['Élastique','Échauffe le haut du corps :',['Coiffe des rotateurs : rotations externes et internes','Omoplates','Pecs','Biceps','Triceps','Dislocations d\'épaule']],
  ['Anneaux','Rotations d\'épaule avec les anneaux.',null]]};
function wuCalc(){const w=+S.wuW;if(!w)return '<p class="note">Entre ta charge de travail pour voir tes charges d\'échauffement.</p>';const r=v=>fmtN(Math.round(v/2.5)*2.5);return '<span>5 × <b>'+r(w*.5)+' kg</b></span><span>3 × <b>'+r(w*.75)+' kg</b></span><span>1 × <b>'+r(w*.9)+' kg</b></span>'}
const ramp=()=>'<div class="wuramp"><div><b>5 reps</b><span>50 %</span></div><div><b>3 reps</b><span>75 %</span></div><div><b>1 rep</b><span>90 %</span></div></div><label class="wuw">Ta charge de travail (kg)<input id="wuW" type="number" inputmode="decimal" min="0" step="0.5" placeholder="Ex. 80" value="'+(S.wuW||'')+'"></label><div id="wuCalc" class="wucalc">'+wuCalc()+'</div>';
function renderWU(){const sal=S.wuMode!=='street',L=WU[sal?'salle':'street'];
  $('wuBox').innerHTML='<div class="seg full" role="group" aria-label="Lieu"><button type="button" data-wum="salle" aria-pressed="'+sal+'">🏋️ Salle</button><button type="button" data-wum="street" aria-pressed="'+!sal+'">🌳 Street</button></div>'
   +'<ol class="wus">'+L.map((x,i)=>'<li><span class="wnum">'+(i+1)+'</span><div><h3>'+x[0]+'</h3><p class="wum">'+x[1]+'</p>'+(Array.isArray(x[2])?'<ul class="wul">'+x[2].map(y=>'<li>'+y+'</li>').join('')+'</ul>':x[2]==='ramp'?ramp():x[2]?'<button type="button" class="btn ghost sm" data-wut="'+x[2].slice(1)+'">'+PLAY+' Lancer '+mmssL(+x[2].slice(1))+'</button>':'')+'</div></li>').join('')+'</ol>'
   +(sal?'<p class="note wuf">N\'oublie pas le travail de mobilité et de souplesse à la maison.</p>':'')}

/* ---------- conseils : progression et récupération ---------- */
function deloadInfo(){const last=S.deloads.slice().sort().pop(),cur=key(monday(T)),wks=new Set(S.sessions.map(s=>wkOf(s.date)).filter(k=>k<=cur&&(!last||k>last)));return {last,n:wks.size,on:S.deloads.includes(cur)}}
function advHtml(){const dl=deloadInfo();return [
  ['⏱️ Repos','2 min 45 à 3 min entre chaque série, quel que soit l\'exercice. Sur les exercices unilatéraux, prévoir aussi un temps de récupération entre chaque bras.','<button type="button" class="btn ghost sm" data-adv="rest">'+PLAY+' Lancer un repos de 3 min</button>'],
  ['📈 Surcharge progressive','Viser la progression sur chaque exercice en augmentant la charge ou les répétitions d\'une séance à l\'autre.','<p class="note">Quand tu notes une séance, tes perfs de la dernière fois s\'affichent en gris dans les cases.</p>'],
  ['🪶 Semaine d\'allègement','Toutes les 6 à 8 semaines, une semaine avec environ 50 % de volume en moins, avec la même charge.','<p class="note">'+(dl.on?'Cette semaine est notée comme semaine d\'allègement.':dl.last?'Dernière semaine d\'allègement : semaine du '+dLong(dl.last)+' · '+dl.n+' semaine'+(dl.n>1?'s':'')+' d\'entraînement depuis.':dl.n+' semaine'+(dl.n>1?'s':'')+' d\'entraînement sans semaine d\'allègement notée.')+'</p><button type="button" class="btn ghost sm" data-adv="deload">'+(dl.on?'Retirer l\'allègement de cette semaine':'Cette semaine est une semaine d\'allègement')+'</button>'],
  ['📝 Suivi','Noter les charges et les répétitions chaque semaine pour voir s\'il faut modifier le programme, et demander conseil à Diego.','<button type="button" class="btn ghost sm" data-adv="prog">Voir ma progression</button>']
 ].map(a=>'<div class="adv"><h3>'+a[0]+'</h3><p>'+a[1]+'</p>'+a[2]+'</div>').join('')}
function renderAdv(){$('advBox').innerHTML=advHtml()}

/* ---------- skills : étapes, XP, médailles ---------- */
const SKILLS=[{k:'traction',n:'Traction',e:'💪',st:['Suspension active (omoplates)','Traction australienne','Traction négative de 5 s','1 traction stricte','5 tractions','10 tractions','15 tractions','Traction lestée +10 kg']},
 {k:'dips',n:'Dips',e:'🦾',st:['Dips sur banc','Dips négatifs','1 dips','10 dips','20 dips','Dips lestés +20 kg']},
 {k:'muscleup',n:'Muscle-up',e:'🚀',st:['10 tractions strictes','15 dips','Traction poitrine à la barre','Traction explosive (hanches à la barre)','Muscle-up négatif','Muscle-up avec élastique','1 muscle-up','5 muscle-ups']},
 {k:'lsit',n:'L-sit',e:'📐',st:['L-sit groupé 10 s','L-sit une jambe 10 s','L-sit 10 s','L-sit 30 s','V-sit']},
 {k:'poirier',n:'Poirier',e:'🤸',st:['Poirier ventre au mur 30 s','Pompes piquées (pike)','Poirier ventre au mur 60 s','Poirier libre 5 s','Poirier libre 30 s','Pompe en poirier au mur']},
 {k:'frontlever',n:'Front lever',e:'🦅',st:['Front lever groupé 10 s','Groupé avancé 10 s','Une jambe 10 s','Jambes écartées 5 s','Front lever complet']},
 {k:'backlever',n:'Back lever',e:'🦇',st:['Skin the cat','Back lever groupé 10 s','Groupé avancé 10 s','Jambes écartées 5 s','Back lever complet']},
 {k:'planche',n:'Planche',e:'✈️',st:['Planche lean 30 s','Tuck planche 10 s','Tuck planche avancée 10 s','Jambes écartées 5 s','Planche complète']},
 {k:'drapeau',n:'Drapeau',e:'🚩',st:['Gainage latéral 60 s','Drapeau groupé','Drapeau une jambe','Drapeau jambes écartées','Drapeau complet']},
 {k:'pistol',n:'Pistol squat',e:'🦵',st:['Squat sur une jambe vers une box','Pistol avec appui','Pistol négatif','1 pistol squat','5 pistols par jambe']}];
const skDone=k=>obj(S.skills[k]);
const skXp=i=>20+10*i;
const LVL=[[0,'Débutant'],[100,'Initié'],[250,'Confirmé'],[500,'Avancé'],[900,'Expert'],[1400,'Élite'],[2000,'Maître'],[2600,'Légende']];
const TIER=[['À commencer','#62626a'],['Bronze','#d08a4b'],['Argent','#c6ccd6'],['Or','#f5c542']];
const tierOf=(n,t)=>n<=0?0:n>=t?3:n/t>=.5?2:1;
const xpTot=()=>SKILLS.reduce((a,sk)=>a+Object.keys(skDone(sk.k)).reduce((b,i)=>b+skXp(+i),0),0);
const lvlOf=x=>{let i=0;LVL.forEach((l,j)=>{if(x>=l[0])i=j});return i};
function medal(sk,sz){const n=Object.keys(skDone(sk.k)).length,t=sk.st.length,tr=tierOf(n,t),C=2*Math.PI*21;return '<span class="medal t'+tr+'" style="--mc:'+TIER[tr][1]+(sz?';--ms:'+sz+'px':'')+'"><svg viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="21" class="mtr"/><circle cx="25" cy="25" r="21" class="mpr" stroke-dasharray="'+(C*n/t).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 25 25)"/></svg><em>'+sk.e+'</em>'+(tr===3?'<i class="mcr">👑</i>':'')+'</span>'}
let skOpen=[],skArm='';
function renderSkills5(){const x=xpTot(),li=lvlOf(x),cur=LVL[li],nx=LVL[li+1],cnt=[0,0,0,0];SKILLS.forEach(sk=>cnt[tierOf(Object.keys(skDone(sk.k)).length,sk.st.length)]++);
  $('skLv').innerHTML='<div class="lvl"><span class="lvb"><small>niveau</small><b>'+(li+1)+'</b></span><div class="lvt"><p class="kick">Ton rang</p><h3>'+cur[1]+'</h3><span class="track big"><i style="width:'+(nx?(x-cur[0])/(nx[0]-cur[0])*100:100).toFixed(1)+'%"></i></span><small>'+x+' XP'+(nx?' · encore '+(nx[0]-x)+' XP pour « '+nx[1]+' »':' · rang maximum, respect ! 👑')+'</small></div></div>'
   +'<div class="shelf">'+SKILLS.map(sk=>'<button type="button" class="shm" data-skgo="'+sk.k+'" aria-label="'+esc(sk.n)+'">'+medal(sk,46)+'<span>'+esc(sk.n)+'</span></button>').join('')+'</div><p class="mcount"><span>🥇 '+cnt[3]+'</span><span>🥈 '+cnt[2]+'</span><span>🥉 '+cnt[1]+'</span></p>';
  $('skList').innerHTML=SKILLS.map(sk=>{const d=skDone(sk.k),n=Object.keys(d).length,t=sk.st.length,tr=tierOf(n,t),nx=sk.st.findIndex((s,i)=>!d[i]),op=skOpen.includes(sk.k),tut=S.links.filter(l=>l.c==='skill'&&l.k===sk.k);
    return '<div class="skc t'+tr+(op?' op':'')+'" id="sk-'+sk.k+'"><button type="button" class="skh" data-skopen="'+sk.k+'" aria-expanded="'+op+'">'+medal(sk)+'<span class="skt"><b>'+esc(sk.n)+'</b><small>'+(tr?TIER[tr][0]+' · ':'')+n+'/'+t+' étapes</small><span class="skn">'+(nx<0?'Skill maîtrisé, bravo ! 🏆':'Prochaine : '+esc(sk.st[nx]))+'</span></span><span class="chev" aria-hidden="true">›</span></button>'
     +(op?'<ol class="path">'+sk.st.map((s,i)=>{const dn=!!d[i],stt=dn?'done':i===nx?'next':'lock';return '<li class="'+stt+'"><button type="button" class="node" data-sk="'+sk.k+':'+i+'" aria-pressed="'+dn+'" aria-label="'+esc(s)+'">'+(dn?CHK:stt==='next'?(i+1):'🔒')+'</button><div class="pst"><b>'+esc(s)+'</b><small>'+(dn?'Validé le '+dLong(d[i])+' · +'+skXp(i)+' XP':stt==='next'?'À toi de jouer ! · +'+skXp(i)+' XP':'+'+skXp(i)+' XP')+'</small></div></li>'}).join('')+'</ol>'
       +'<div class="sktu">'+tut.map(l=>linkHtml(l,1)).join('')+'<button type="button" class="chip addx sm" data-lknew="skill:'+sk.k+'">+ Tuto vidéo</button></div>':'')+'</div>'}).join('')}
function skNext(){let best=null;SKILLS.forEach(sk=>{const d=skDone(sk.k),n=Object.keys(d).length,nx=sk.st.findIndex((s,i)=>!d[i]);if(n&&nx>=0&&(!best||n/sk.st.length>best.done/best.tot))best={n:sk.n,e:sk.e,next:sk.st[nx],done:n,tot:sk.st.length}});return best}
function skTap(v){const [k,ii]=v.split(':'),i=+ii,sk=SKILLS.find(x=>x.k===k);if(!sk)return;const d=obj(S.skills[k]),tr0=tierOf(Object.keys(d).length,sk.st.length),l0=lvlOf(xpTot());
  if(d[i]){const a=k+':'+i;if(skArm!==a){skArm=a;toast('Touche encore pour annuler cette étape (et les suivantes)');setTimeout(()=>{if(skArm===a)skArm=''},3500);return}skArm='';for(let j=i;j<sk.st.length;j++)delete d[j];S.skills[k]=d;save();renderSkills();toast('Étape annulée');return}
  let add=0,xp=0;for(let j=0;j<=i;j++)if(!d[j]){d[j]=TK;add++;xp+=skXp(j)}S.skills[k]=d;save();renderSkills();
  const tr1=tierOf(Object.keys(d).length,sk.st.length),l1=lvlOf(xpTot());audioOn();
  if(tr1===3)reward('🏆','Skill maîtrisé !',sk.n+' · médaille d\'or · +'+xp+' XP');
  else if(l1>l0)reward('⭐','Niveau '+(l1+1)+' !','Tu passes « '+LVL[l1][1]+' » · +'+xp+' XP');
  else if(tr1>tr0)reward(tr1===2?'🥈':'🥉',tr1===2?'Médaille d\'argent !':'Médaille de bronze !',sk.n+' · +'+xp+' XP');
  else reward('🎉',add>1?add+' étapes validées !':'Étape débloquée !',sk.st[i]+' · +'+xp+' XP')}

/* ---------- récompenses : confettis ---------- */
function confetti(){const c=document.createElement('div');c.className='cfw';c.setAttribute('aria-hidden','true');const a=typeof curAcc==='function'?curAcc():'#e4ff1a',cols=[a,'#ffffff',a,'#a9aeb8'];let h='';
  for(let i=0;i<36;i++){const x=(Math.random()*2-1)*200,y=-(140+Math.random()*260),r=Math.random()*720-360;h+='<i style="--x:'+x.toFixed(0)+'px;--y:'+y.toFixed(0)+'px;--r:'+r.toFixed(0)+'deg;background:'+cols[i%cols.length]+';animation-delay:'+(Math.random()*.2).toFixed(2)+'s;left:'+(44+Math.random()*12).toFixed(1)+'%"></i>'}
  c.innerHTML=h;document.body.appendChild(c);setTimeout(()=>c.remove(),2400)}
function reward5(em,title,sub){const o=$('boom');if(!S.emo){em='<span class="bxok" aria-hidden="true">'+ico(em==='⭐'?'star':em==='🎉'?'check':em==='🏅'||em==='🥈'||em==='🥉'?'medal':'trophy')+'</span>';title=noEmo(title)}o.innerHTML='<div class="bx rw"><div class="rwe">'+em+'</div><p class="bt">'+esc(title)+'</p><p class="bs">'+esc(sub)+'</p></div>';o.classList.remove('on');void o.offsetWidth;o.classList.add('on');clearTimeout(o._t);o._t=setTimeout(()=>o.classList.remove('on'),2800);if(!rmOn())confetti();sWin();buzz([40,60,40])}

/* ---------- test max mensuel ---------- */
const TESTS=['Tractions','Pompes','Dips'];
let tstSel='Tractions';
function renderTests(){const mk=TK.slice(0,7),cur=obj(S.tests[mk]),mn=mName(T.getFullYear(),T.getMonth(),'long'),done=Object.keys(cur).length,months=Object.keys(S.tests).filter(k=>S.tests[k]&&S.tests[k][tstSel]>0).sort();
  $('tstBox').innerHTML='<h2 class="t">Test max du mois</h2><p class="findsub">Une fois par mois, fais le maximum de répétitions propres en une seule série, et note-le ici.'+(done?'':' <b>Pas encore fait en '+esc(mn)+'.</b>')+'</p><div class="tst">'+TESTS.map(x=>'<label>'+esc(x)+'<input type="number" inputmode="numeric" min="0" max="500" data-tst="'+esc(x)+'" value="'+(cur[x]||'')+'" placeholder="–"></label>').join('')+'</div><button type="button" class="btn" id="tstSave">Enregistrer pour '+esc(mn)+'</button>'
   +'<div class="seg" style="margin-top:18px" role="group" aria-label="Courbe">'+TESTS.map(x=>'<button type="button" data-tsel="'+esc(x)+'" aria-pressed="'+(tstSel===x)+'">'+esc(x)+'</button>').join('')+'</div>'+(months.length?'<div class="chart sm" id="cTst"><svg></svg></div>':'<p class="note">Ta courbe apparaîtra après ton premier test.</p>');
  if(months.length)vChart('cTst',months.map(k=>{const [y,m]=k.split('-').map(Number);return {v:S.tests[k][tstSel],l:mName(y,m-1),d:k}}),'rép.',{fmt:v=>fmtN(v)})}
function saveTests(){const mk=TK.slice(0,7),o={},perf={};document.querySelectorAll('[data-tst]').forEach(i=>{const v=parseInt(i.value,10);if(v>0){o[i.dataset.tst]=v;perf[i.dataset.tst]={s:1,r:v,kg:0,sec:0}}});if(!Object.keys(o).length){toast('Entre au moins un résultat');return}
  S.tests[mk]=o;const beat=autoRecs(perf,TK),gh=checkGoals();save();renderTests();if(beat)celebrate(beat.name,beat.v,beat.unit);else if(gh.length)boomMsg('Objectif atteint ! 🎯',goalTxt(gh[0]));else boomMsg('Test max enregistré ! 📈',Object.entries(o).map(e=>e[0]+' '+e[1]).join(' · '))}

/* ---------- tutos et liens (YouTube, notes…) ---------- */
const ytId=u=>{const m=String(u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/);return m?m[1]:''};
const urlOf=t=>{const m=String(t||'').match(/(https?:\/\/[^\s<>"']+|mobilenotes:\/\/[^\s<>"']*)/i);return m?m[1]:''};
const hostOf=u=>{if(/^mobilenotes:/i.test(u))return 'Notes';try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}};
const isIOS=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
let lkDraft=null;
function lkLab(l){if(l.c==='skill'){const sk=SKILLS.find(x=>x.k===l.k);return sk?sk.n:''}return l.c==='ex'?l.k:''}
function linkHtml(l,mini){const y=ytId(l.u),ico=l.c==='note'?'📝':y?'🎬':'🔗',href=esc(l.u);
  if(mini)return '<a class="lkm" href="'+href+'" target="_blank" rel="noopener">'+ico+' '+esc(l.t)+'</a>';
  return '<div class="lk"><a class="lka" href="'+href+'" target="_blank" rel="noopener">'+(y?'<span class="lkth"><img src="https://i.ytimg.com/vi/'+y+'/mqdefault.jpg" alt="" loading="lazy" onerror="this.remove()"><i>▶</i></span>':'<span class="lkic">'+ico+'</span>')+'<span class="lkt"><b>'+esc(l.t)+'</b><small>'+esc([hostOf(l.u),lkLab(l)].filter(Boolean).join(' · '))+'</small></span></a><button type="button" class="pdel" data-lkdel="'+l.id+'" aria-label="Supprimer ce lien">×</button></div>'}
function lkKeys(){const c=$('lkC').value,k=$('lkK'),cur=k.value;k.hidden=!(c==='skill'||c==='ex');k.innerHTML=c==='skill'?SKILLS.map(s=>'<option value="'+s.k+'">'+esc(s.n)+'</option>').join(''):c==='ex'?allEx().map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join(''):'';if(cur&&[...k.options].some(o=>o.value===cur))k.value=cur}
function renderLinks(){const L=S.links;
  $('linkList').innerHTML=L.length?[['skill','🤸 Skills'],['ex','🏋️ Exercices'],['note','📝 Notes'],['autre','🔗 Autres']].map(g=>{const a=L.filter(l=>l.c===g[0]);return a.length?'<h5 class="h5">'+g[1]+'</h5><div class="lks">'+a.map(l=>linkHtml(l)).join('')+'</div>':''}).join('')
   :emptyArt('Aucun lien pour l\'instant','Ajoute tes vidéos tuto YouTube, tes notes ou n\'importe quel lien utile.','wave');
  if(lkDraft)$('lkC').value=lkDraft.c;lkKeys();if(lkDraft){if(lkDraft.k)$('lkK').value=lkDraft.k;lkDraft=null;setTimeout(()=>{const u=$('lkU');if(u){u.scrollIntoView({behavior:'smooth',block:'center'});u.focus()}},150)}
  $('lkHelp').innerHTML=isIOS?'Pour une note iPhone : dans Notes, partage la note, copie son lien et colle-le ici. <a href="mobilenotes://" class="lnk">Ouvrir Notes</a>':'Pour une note : copie le lien de partage de ta note (Google Keep, Notes…) et colle-le ici.'}
function addLink(){const u=urlOf($('lkU').value);if(!u){toast('Colle un lien qui commence par https://');return}const c=$('lkC').value,k=(c==='skill'||c==='ex')?$('lkK').value:'',y=ytId(u);let ti=$('lkT').value.trim();if(!ti)ti=y?'Vidéo YouTube':c==='note'?'Ma note':hostOf(u)||'Lien';
  S.links.unshift({id:'l'+Date.now().toString(36),t:ti.slice(0,60),u,c,k,d:TK});$('lkU').value='';$('lkT').value='';save();renderLinks();toast('Lien ajouté ✓')}

/* ---------- accueil ---------- */
const TIPS=[['Repos','2 min 45 à 3 min entre chaque série, quel que soit l\'exercice.','adv'],['Surcharge progressive','Vise un peu plus de charge ou de répétitions qu\'à la séance précédente.','adv'],['Semaine d\'allègement','Toutes les 6 à 8 semaines : environ 50 % de volume en moins, avec la même charge.','adv'],['Échauffement','Monte en charge : 5 reps à 50 %, 3 reps à 75 %, 1 rep à 90 %, puis 1 minute de repos.','wu'],['Suivi','Note tes charges et tes répétitions chaque semaine pour voir s\'il faut modifier le programme.','adv'],['Mobilité','N\'oublie pas le travail de mobilité et de souplesse à la maison.','wu'],['Épaules','Échauffe ta coiffe des rotateurs à l\'élastique avant de tirer lourd.','wu']];
function relDay(k){const n=Math.round((parse(TK)-parse(k))/864e5);return n===0?'aujourd\'hui':n===1?'hier':n<7?'il y a '+n+' jours':dLong(k)}
function goTo(w){if(w==='note'){sel=TK;view=new Date(T.getFullYear(),T.getMonth(),1);openForm();return}
  if(['rest','emom','pyr','lest','tm'].includes(w)){if(w!=='tm')tmTab=w;S.xtab='tm';if(location.hash==='#outils')route();else location.hash='#outils';return}
  if(w==='wu'||w==='adv'||w==='tuto'){S.xtab=w;const h={wu:'#echauffement',adv:'#conseils',tuto:'#tutos'}[w];if(location.hash===h)route();else location.hash=h;return}
  if(w==='tests'||w==='records'){S.ptab='records';if(location.hash==='#records')route();else location.hash='#records';setTimeout(()=>{const el=$(w==='tests'?'tstBox':'goalList');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},350);return}
  if(w==='skills'){S.ptab='skills';location.hash='#skills'}}

/* ---------- pop-up « bon retour » ---------- */
function showHello(){if($('hey')||$('onb')||$('bil')||$('gsheet').classList.contains('open')||$('sheet').classList.contains('open')||!$('tmo').hidden)return;const m=helloPick(),o=document.createElement('div');o.id='hey';o.className='hey';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
  o.innerHTML='<div class="hbx'+(m[0]?'':' rcpop')+'"><div class="hem">'+(m[0]||charSvg(myChar({pose:'wave',ex:'happy'})))+'</div><h2>'+esc(m[1])+'</h2><p>'+esc(m[2])+'</p><button type="button" class="btn" id="heyOk">'+emo(S.tone==='sobre'?'C\'est parti':'C\'est parti ! 💪')+'</button></div>';
  document.body.appendChild(o);const cl=()=>{if(!o.isConnected)return;o.classList.add('out');setTimeout(()=>o.remove(),280)};o.addEventListener('click',e=>{if(e.target===o||e.target.id==='heyOk')cl()});setTimeout(cl,7000)}
function maybeHello5(){const last=+S.lastSeen||0,now=Date.now();S.lastSeen=now;save();if(!S.onb)return;if(!last||now-last>=6*3600e3)setTimeout(showHello,1100)}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&S.onb)maybeHello()});

/* ---------- menu d'une séance : partager, dupliquer, déplacer, supprimer ---------- */
function actSheet(id){const s=S.sessions.find(x=>x.id===id);if(!s)return;openSheet('<h3>Séance du '+esc(dLong(s.date))+'</h3><p class="findsub">'+esc([plN[s.place],s.tod?todN[s.tod]:''].filter(Boolean).join(' · '))+'</p><div class="acl"><button type="button" class="arow" data-sact="share:'+esc(id)+'">'+SHARE+'<span>Partager en image</span></button><div class="arow"><span>Dupliquer le</span><input type="date" id="dupD" max="'+TK+'" value="'+TK+'" aria-label="Date de la copie"><button type="button" class="btn sm" data-sact="dup:'+esc(id)+'">OK</button></div><div class="arow"><span>Déplacer au</span><input type="date" id="movD" max="'+TK+'" value="'+s.date+'" aria-label="Nouvelle date"><button type="button" class="btn sm" data-sact="mov:'+esc(id)+'">OK</button></div><button type="button" class="arow danger" data-sact="del:'+esc(id)+'">'+TRASH+'<span>Supprimer la séance</span></button></div><div class="acts"><button type="button" class="btn ghost" id="gClose">Fermer</button></div>')}
function sAct(v){const p=v.indexOf(':'),a=v.slice(0,p),id=v.slice(p+1),s=S.sessions.find(x=>x.id===id);if(!s)return;
  if(a==='share'){closeSheet();shareCard(id);return}if(a==='del'){closeSheet();delSession(id);return}
  const d=$(a==='dup'?'dupD':'movD').value;if(!d||d>TK){toast('Choisis un jour passé');return}
  if(a==='dup'){const n=clone(s);n.id='s'+Date.now().toString(36);n.date=d;n.u=Date.now();S.sessions.push(n)}else{s.date=d;s.u=Date.now()}
  S.rest=S.rest.filter(k=>k!==d);sel=d;view=new Date(parse(d).getFullYear(),parse(d).getMonth(),1);closeSheet();render();save();toast((a==='dup'?'Séance dupliquée le ':'Séance déplacée au ')+dLong(d)+' ✓')}

/* ---------- carte de séance en image ---------- */
function svgImg(svg){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)})}
function rrect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function fitTxt(g,t,w){if(g.measureText(t).width<=w)return t;while(t.length>1&&g.measureText(t+'…').width>w)t=t.slice(0,-1);return t+'…'}
async function shareCard5(id){const s=S.sessions.find(x=>x.id===id);if(!s)return;try{await document.fonts.ready}catch(e){}
  const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),A=acc(),F='Archivo, Inter, system-ui, sans-serif',ink='#f3f3f1',mute='#9b9ba1';
  g.fillStyle='#0b0b0c';g.fillRect(0,0,W,H);const gr=g.createRadialGradient(W*.9,80,30,W*.9,80,760);gr.addColorStop(0,A+'55');gr.addColorStop(1,A+'00');g.fillStyle=gr;g.fillRect(0,0,W,H);
  const lg=await svgImg(iconDoc(S.icon));g.save();rrect(g,72,72,120,120,30);g.clip();g.fillStyle=A;g.fillRect(72,72,120,120);if(lg)g.drawImage(lg,72,72,120,120);g.restore();
  g.fillStyle=ink;g.font='900 42px '+F;g.fillText('Carnet de séances',222,124);g.fillStyle=mute;g.font='600 30px '+F;g.fillText(S.name?'La séance de '+S.name:'Ma séance',222,170);
  g.fillStyle=A;g.font='800 34px '+F;g.fillText(parse(s.date).toLocaleDateString(LOC(),{weekday:'long'}).toUpperCase(),72,300);
  g.fillStyle=ink;g.font='900 96px '+F;g.fillText(dLong(s.date),72,396);
  const f=feelOf(s);g.fillStyle=mute;g.font='600 34px '+F;g.fillText([plN[s.place],s.tod?todN[s.tod]:'',s.dur?fmtDur(s.dur):''].filter(Boolean).join(' · ')+(f?'   '+f[1]+' '+f[2]:''),72,456);
  let x=72,y=500;s.types.filter(okT).forEach(t=>{g.font='800 30px '+F;const w=g.measureText(tyN[t]).width+48;if(x+w>W-72){x=72;y+=70}rrect(g,x,y,w,56,28);g.fillStyle=tyC[t];g.fill();g.fillStyle='#fff';g.fillText(tyN[t],x+24,y+38);x+=w+14});
  y+=s.types.length?100:30;g.fillStyle='#1e1e21';rrect(g,72,y,W-144,Math.min(8,Math.max(1,s.ex.length))*82+40,28);g.fill();let yy=y+70;
  (s.ex.length?s.ex.slice(0,8):['Séance notée']).forEach(n=>{const p=s.perf&&s.perf[n];let r='';if(p){if(p.sec)r=(p.s>1?p.s+' × ':'')+p.sec+' s';else if(p.s&&p.r)r=p.s+' × '+p.r;else if(p.r)r=p.r+' rép.';else if(p.s)r=p.s+' série'+(p.s>1?'s':'');if(p.kg)r+=(r?' · ':'')+fmtN(p.kg)+' kg'}
    g.font='800 38px '+F;g.fillStyle=ink;g.fillText(fitTxt(g,n,r?560:W-220),112,yy);if(r){g.font='800 36px '+F;g.fillStyle=A;g.textAlign='right';g.fillText(r,W-112,yy);g.textAlign='left'}yy+=82});
  const sets=Object.values(s.perf||{}).reduce((a,p)=>a+(p.s||0),0),vol=sVol(s),stats=[[sets?String(sets):'–','séries'],[s.dur?fmtDur(s.dur):'–','durée'],[vol?fmtKg(vol):'–','soulevés']];
  const by=H-250;stats.forEach((st,i)=>{const bx=72+i*((W-144-40)/3+20),bw=(W-144-40)/3;rrect(g,bx,by,bw,150,26);g.fillStyle='#1e1e21';g.fill();g.fillStyle=A;g.font='900 50px '+F;g.fillText(fitTxt(g,st[0],bw-40),bx+28,by+78);g.fillStyle=mute;g.font='700 28px '+F;g.fillText(st[1],bx+28,by+120)});
  g.fillStyle=A;g.fillRect(72,H-62,120,8);g.fillStyle=mute;g.font='700 26px '+F;g.fillText('Fait avec Carnet de séances',214,H-50);
  S.cnt.cards=(S.cnt.cards||0)+1;save();c.toBlob(b=>{if(b)shareFile(b,'seance-'+s.date+'.png')},'image/png')}

/* ---------- nouvelle version disponible ---------- */
let updShown=false;
async function checkUpd(){if(updShown||!/^https?:/.test(location.protocol))return;try{const r=await fetch('version.json',{cache:'no-store'});if(!r.ok)return;const j=await r.json();if(j&&j.v&&j.v!==APP_V){updShown=true;const b=document.createElement('div');b.id='upd';b.className='upd';b.setAttribute('role','status');b.innerHTML='<span><b>'+emo('Nouvelle version disponible ! 🎉')+'</b>Touche « Mettre à jour » pour en profiter.</span><button type="button" id="updGo">Mettre à jour</button>';document.body.appendChild(b)}}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpd()});
setInterval(checkUpd,30*60*1000);

/* ---------- pas de zoom ---------- */
['gesturestart','gesturechange','gestureend'].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault(),{passive:false}));
document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});

/* ---------- clics ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const ds=t.dataset;
  if(form&&ds.fd){form.date=ds.fd;drawForm();return}
  if(form&&ds.tod){form.tod=form.tod===ds.tod?'':ds.tod;drawMeta();return}
  if(form&&ds.dur){form.dur=+form.dur===+ds.dur?'':+ds.dur;drawMeta();return}
  if(form&&ds.feel){form.feel=form.feel===+ds.feel?0:+ds.feel;drawMeta();return}
  if(form&&ds.addq){const n=addExercise($('fxQ').value);if(n){if(!form.ex.includes(n))form.ex.push(n);$('fxQ').value='';drawForm();toast('« '+n+' » ajouté à ta liste ✓')}return}
  if(ds.edit){openForm(ds.edit);return}
  if(ds.more){actSheet(ds.more);return}
  if(ds.sact){sAct(ds.sact);return}
  if(t.id==='undo'){const f=snackFn;clearTimeout($('snack')._t);$('snack').hidden=true;$('snack').classList.remove('on','off');snackFn=null;if(f)f();return}
  if(t.id==='updGo'){location.reload();return}
  if(t.id==='back'){location.hash=lastH||'#accueil';return}
  if(ds.cal){S.calMode=ds.cal;save();render();return}
  if(t.id==='restOk'){S.restAck=TK;save();render();return}
  if(ds.acc){S.acc=ds.acc;applyAcc();save();renderSet2();render();return}
  if(ds.thm){S.theme=ds.thm;applyAcc();save();renderSet2();render();return}
  if(ds.icon){S.icon=ds.icon;applyIcon();save();if($('onb'))showOnb(1);else renderSet2();return}
  if(ds.snd){S.snd=ds.snd;save();renderSet2();audioOn();sGo('');return}
  if(ds.voice){S.voice=!S.voice;save();renderSet2();if(S.voice){audioOn();say('Annonce vocale activée')}return}
  if(t.id==='sndTest'){sTest();return}
  if(ds.guide!==undefined){showGuide(ds.guide);return}
  if(ds.gadd){const n=addExercise($('gxQ').value);if(n){$('gxQ').value='';renderGuideList();showGuide(n)}return}
  if(ds.tgltimed){if(!guideFor)return;S.tset[guideFor]=!isTimed(guideFor);save();showGuide(guideFor);return}
  if(t.id==='gClose'){closeSheet();return}
  if(t.id==='bilOk'){$('bil')?.remove();return}
  if(t.id==='bilBtn'){showBilan(prevMk());return}
  if(t.id==='bwAdd'){const v=parseFloat(String($('bwIn').value).replace(',','.'));if(!(v>=20&&v<=400)){toast('Entre un poids entre 20 et 400 kg');return}S.bw=S.bw.filter(x=>x.d!==TK);S.bw.push({d:TK,v:Math.round(v*10)/10});$('bwIn').value='';save();renderBW();toast('Poids noté ✓');return}
  if(ds.bwdel){S.bw=S.bw.filter(x=>x.d!==ds.bwdel);save();renderBW();return}
  if(t.id==='gAdd'){const ex=$('gEx').value,v=parseFloat(String($('gVal').value).replace(',','.'));if(!ex){$('gMsg').textContent='Choisis un exercice.';return}if(!(v>0)){$('gMsg').textContent='Entre la valeur à atteindre.';return}
    const g={ex,target:v,unit:$('gUnit').value,by:$('gBy').value||'',done:''};if(goalCur(g)>=v)g.done=TK;S.goals.push(g);$('gVal').value='';$('gBy').value='';$('gMsg').textContent='';save();renderGoals();return}
  if(ds.gdel!==undefined){S.goals.splice(+ds.gdel,1);save();renderGoals();return}
  if(t.id==='expCsv'){exportCSV();return}
  if(t.id==='expPdf'){exportPDF();return}
  if(ds.fpl!==undefined){S.fPl=ds.fpl;save();renderStatsPage();countUp($('mK'));return}
  if(ds.evo){S.evo=ds.evo;save();renderStatsPage();return}
  if(ds.pt){S.ptab=ds.pt;save();location.hash='#'+(ds.pt==='mz'?'mesures':ds.pt);return}
  if(ds.xt){goTo(ds.xt);return}
  if(ds.go){goTo(ds.go);return}
  if(ds.goday){sel=ds.goday;const d=parse(sel);view=new Date(d.getFullYear(),d.getMonth(),1);location.hash='#calendrier';render();return}
  if(ds.adv==='rest'){tmStart({k:'rest',sec:180});return}
  if(ds.adv==='deload'){const cur=key(monday(T));S.deloads=S.deloads.includes(cur)?S.deloads.filter(k=>k!==cur):S.deloads.concat(cur);save();renderAdv();toast(S.deloads.includes(cur)?'Semaine d\'allègement notée ✓':'Allègement retiré');return}
  if(ds.adv==='prog'){S.ptab='stats';location.hash='#stats';return}
  if(ds.skopen){toggle(skOpen,ds.skopen);renderSkills();return}
  if(ds.skgo){if(!skOpen.includes(ds.skgo))skOpen.push(ds.skgo);renderSkills();setTimeout(()=>{const el=$('sk-'+ds.skgo);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},60);return}
  if(ds.sk){skTap(ds.sk);return}
  if(t.id==='tstSave'){saveTests();return}
  if(ds.tsel){tstSel=ds.tsel;renderTests();return}
  if(ds.stp){const [k,dd]=ds.stp.split(':'),d=+dd,c=S.tmc;
    if(k==='goal'){S.goal=Math.min(7,Math.max(1,S.goal+d));save();renderSet2();renderStats()}
    else{if(k==='emN')c.emN=Math.min(60,Math.max(1,c.emN+d));else if(k==='pyStart')c.pyStart=Math.min(c.pyTop-1,Math.max(1,c.pyStart+d));else if(k==='pyTop')c.pyTop=Math.min(40,Math.max(c.pyStart+1,c.pyTop+d));else if(k==='pyFix')c.pyFix=Math.min(600,Math.max(5,c.pyFix+d*5));normR();save();renderTm()}return}
  if(ds.tm){tmAct(ds.tm);return}
  if(t.id==='tpOpen'){tmShow(true);tmLoop();return}
  if(ds.wum){S.wuMode=ds.wum;save();renderWU();return}
  if(ds.wut){const sec=+ds.wut;tmStart({k:'rest',sec,lab:sec>=120?'Échauffement':'Repos',next:sec>=120?(S.wuMode==='street'?'Ensuite : l\'élastique':'Ensuite : l\'échauffement articulaire'):'Ensuite : tes séries de travail'});return}
  if(ds.tmtab){tmTab=ds.tmtab;renderTm();return}
  if(ds.rsec){tmStart({k:'rest',sec:+ds.rsec});return}
  if(ds.emi){S.tmc.emI=+ds.emi;save();renderTm();return}
  if(ds.pys){S.tmc.pyShape=ds.pys;save();renderTm();return}
  if(ds.pystep){S.tmc.pyStep=+ds.pystep;save();renderTm();return}
  if(ds.pymode){S.tmc.pyMode=ds.pymode;save();renderTm();return}
  if(ds.rb){const [i,d]=ds.rb.split(':').map(Number),R=normR(),r=R[i],nx=R[i+1];if(r&&nx){r.b=Math.min(nx.b-1,Math.max(r.a,r.b+d));normR();save();renderTm()}return}
  if(ds.rx){const p=ds.rx.split(':'),R=normR(),r=R[+p[0]];if(r){r[p[1]]=Math.min(900,Math.max(0,r[p[1]]+(+p[2])));if(r.a===r.b)r.y=r.x;save();renderTm()}return}
  if(ds.rdl!==undefined){const R=normR(),i=+ds.rdl;if(R.length>1){const rm=R.splice(i,1)[0];if(i>0)R[i-1].b=rm.b;normR();save();renderTm()}return}
  if(ds.radd){const R=normR(),L=R[R.length-1];if(L.a>=L.b){toast('Augmente le sommet pour ajouter une tranche');return}const nb={b:L.b,x:L.y+15,y:L.y+30};L.b=Math.floor((L.a+L.b)/2);R.push(nb);normR();save();renderTm();return}
  if(ds.pynew){S.tmc.pyId='';S.tmc.pyEx='';save();renderTm();setTimeout(()=>{const i=$('pyEx');if(i)i.focus()},60);return}
  if(ds.pre){const p=S.presets.find(x=>x.id===ds.pre);if(p){Object.assign(S.tmc,clone(p.c));if(p.k==='pyr'){S.tmc.pyId=p.id;normR()}save();renderTm();toast(p.k==='pyr'?'Pyramide « '+p.name+' » prête':'Réglage « '+p.name+' » chargé')}return}
  if(ds.pyrun){const p=S.presets.find(x=>x.id===ds.pyrun);if(p){Object.assign(S.tmc,clone(p.c));S.tmc.pyId=p.id;normR();save();renderTm();tmStart({k:'pyr',steps:pySteps(),name:S.tmc.pyEx||p.name})}return}
  if(ds.predel){if(ds.sure){S.presets=S.presets.filter(x=>x.id!==ds.predel);if(S.tmc.pyId===ds.predel)S.tmc.pyId='';save();renderTm()}else{t.dataset.sure='1';t.classList.add('armed');toast('Touche encore × pour supprimer')}return}
  if(ds.presave){const k=ds.presave,c=S.tmc,nm=((($('preName')||{}).value||'').trim()||(k==='emom'?'EMOM':(c.pyEx||'Ma pyramide'))).slice(0,30);
    if(k==='emom')S.presets.push({id:'p'+Date.now().toString(36),k,name:nm,c:{emN:c.emN,emI:c.emI,emT:c.emT}});
    else{normR();const cfg={pyEx:c.pyEx||'',pyStart:c.pyStart,pyTop:c.pyTop,pyStep:c.pyStep,pyShape:c.pyShape,pyMode:c.pyMode,pyFix:c.pyFix,pyR:clone(c.pyR)},ex=c.pyId&&S.presets.find(p=>p.id===c.pyId);if(ex){ex.name=nm;ex.c=cfg}else{const id='p'+Date.now().toString(36);S.presets.push({id,k,name:nm,c:cfg});c.pyId=id}}
    save();renderTm();toast(k==='emom'?'Réglage enregistré ✓':'Pyramide enregistrée ✓');return}
  if(ds.tmgo==='emom'){tmStart({k:'emom',n:S.tmc.emN,iv:+S.tmc.emI,target:+S.tmc.emT||0});return}
  if(ds.tmgo==='pyr'){normR();tmStart({k:'pyr',steps:pySteps(),name:S.tmc.pyEx||''});return}
  if(t.id==='lkAdd'){addLink();return}
  if(ds.lkdel){if(ds.sure){S.links=S.links.filter(l=>l.id!==ds.lkdel);save();renderLinks()}else{t.dataset.sure='1';t.classList.add('armed');toast('Touche encore × pour supprimer ce lien')}return}
  if(ds.lknew){const i=ds.lknew.indexOf(':');lkDraft={c:ds.lknew.slice(0,i),k:ds.lknew.slice(i+1)};closeSheet();goTo('tuto');return}
});
document.addEventListener('input',e=>{const t=e.target;
  if(t.id==='fxQ'){if(form)drawForm();return}
  if(form&&t.id==='fNote'){form.note=t.value;return}
  if(form&&t.id==='fDur'){form.dur=t.value?+t.value:'';$('cMeta').querySelectorAll('[data-dur]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.dur===+form.dur)));return}
  if(t.id==='gxQ'){renderGuideList();return}
  if(t.id==='gNote'&&guideFor){S.notes[guideFor]=t.value;return}
  if(t.id==='wuW'){S.wuW=parseFloat(t.value)||0;$('wuCalc').innerHTML=wuCalc();return}
  if(t.id==='lcBw'||t.id==='lcL'||t.id==='lcP'){renderLC();return}
  if(t.id==='emT'){S.tmc.emT=t.value;return}
  if(t.id==='pyEx'){S.tmc.pyEx=t.value.slice(0,40);const pn=$('preName');if(pn&&!S.tmc.pyId)pn.value=S.tmc.pyEx;return}});
document.addEventListener('change',e=>{const t=e.target;
  if(form&&t.id==='fDate'&&t.value){form.date=t.value>TK?TK:t.value;drawForm();return}
  if(t.id==='prSel'){progSel=t.value;renderProg();return}
  if(t.id==='fTy'){S.fTy=t.value;save();renderStatsPage();countUp($('mK'));return}
  if(t.id==='gEx'&&t.value){$('gUnit').value=isTimed(t.value)?'sec':isLoad(t.value)?'kg':'reps';return}
  if(t.id==='lkC'){lkKeys();return}
  if(t.id==='gNote'||t.id==='wuW'||t.id==='emT'||t.id==='pyEx'){save();return}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSheet();$('bil')?.remove();$('hey')?.remove()}
  if(e.key==='Enter'){const id=e.target.id;if(id==='fxQ'){e.preventDefault();const b=document.querySelector('[data-addq]');if(b)b.click()}else if(id==='gxQ'){e.preventDefault();const b=document.querySelector('[data-gadd]');if(b)b.click()}else if(id==='lkU'||id==='lkT'){e.preventDefault();$('lkAdd').click()}}});
$('gsheet').addEventListener('click',e=>{if(e.target.id==='gsheet')closeSheet()});

const clearDemo=()=>{if(S.demo){S.sessions=[];S.rest=[];S.demo=false}};

document.addEventListener('click',async e=>{
  const t=e.target.closest('button');if(!t)return;
  if(t.dataset.k){sel=t.dataset.k;const d=parse(sel);if(d.getMonth()!==view.getMonth())view=new Date(d.getFullYear(),d.getMonth(),1);render();return}
  if(t.id==='prev'){calStep(-1)}
  else if(t.id==='next'){calStep(1)}
  else if(t.id==='today'){view=new Date(T.getFullYear(),T.getMonth(),1);sel=TK;render()}
  else if(t.id==='add'||t.id==='fab')openForm();
  else if(t.id==='redo'&&form){const l=lastSess();if(l){form.place=l.place;form.types=l.types.filter(okT);form.ex=l.ex.slice();form.perf=clone(l.perf||{});form.dur=l.dur||form.dur;drawForm();toast('Dernière séance reprise : modifie si besoin')}}
  else if(t.dataset.fav!==undefined){S.fav=S.fav&&S.fav.length?S.fav:favList();toggle(S.fav,t.dataset.fav);t.setAttribute('aria-pressed',S.fav.includes(t.dataset.fav));save()}
  else if(t.dataset.onb!==undefined)onbGo(t.dataset.onb);
  else if(t.id==='onbAgain'){S.onb=false;showOnb(0)}
  else if(t.id==='rest'){clearDemo();isRest(sel)?S.rest=S.rest.filter(k=>k!==sel):S.rest.push(sel);render();save()}
  else if(t.id==='cancel')close();
  else if(t.id==='clr'){clearDemo();render();save()}
  else if(t.dataset.del){delSession(t.dataset.del)}
  else if(form&&t.dataset.pl){form.place=t.dataset.pl;$('plHint').hidden=true;$('cPl').classList.remove('need');if($('err').textContent.includes('entraîné'))$('err').textContent='';drawForm()}
  else if(form&&t.dataset.ty){toggle(form.types,t.dataset.ty);drawForm()}
  else if(form&&t.dataset.ex!==undefined){toggle(form.ex,t.dataset.ex);drawForm()}
  else if(t.id==='edit'){edit=!edit;drawForm();if(!edit)save()}
  else if(t.dataset.rm){const[g,x]=t.dataset.rm.split('-').map(Number),nm=S.exg[g][1][x];S.exg[g][1].splice(x,1);form.ex=form.ex.filter(v=>v!==nm);drawForm();save()}
  else if(t.dataset.addx!==undefined){const g=Number(t.dataset.addx),inp=$('new'+g),v=inp.value.trim();if(v&&!S.exg.some(gr=>gr[1].includes(v))){S.exg[g][1].push(v);save()}drawForm();$('new'+g)?.focus()}
  else if(t.id==='ok'){try{submitForm()}catch(err){toast('Erreur : '+(err&&err.message||err))}}
  else if(t.id==='cCreate'){const nm=$('cName').value.trim();if(!nm){$('cMsg').textContent='Donne un nom à la compétition.';return}if(!DB){$('cMsg').textContent='Ouvre l\'appli sur claude.ai, connecté, pour créer une compétition.';return}
    if(S.comps.length>=8){$('cMsg').textContent='8 compétitions maximum.';return}const code=genCode();clearDemo();S.comps.push({code,name:nm,since:TK.slice(0,7),h:await hsh(code)});render();$('cName').value='';await save();await renderComp(true);$('cMsg').textContent='Créée ! Envoie ce code : '+fmtCode(code)}
  else if(t.id==='cJoin'){const code=$('jCode').value.toUpperCase().replace(/[^A-Z0-9]/g,''),nm=$('jName').value.trim()||'Compétition';if(code.length!==12){$('jMsg').textContent='Le code fait 12 caractères (XXXX-XXXX-XXXX).';return}if(!DB){$('jMsg').textContent='Ouvre l\'appli sur claude.ai, connecté, pour rejoindre.';return}
    if(S.comps.some(c=>c.code===code)){$('jMsg').textContent='Tu fais déjà partie de cette compétition.';return}
    if(S.comps.length>=8){$('jMsg').textContent='8 compétitions maximum.';return}const h=await hsh(code);await fetchOthers();const ex=others.find(o=>o.id!==MYID&&hashesOf(o.data).includes(h));
    clearDemo();S.comps.push({code,name:nm,since:TK.slice(0,7),h});render();$('jCode').value='';$('jName').value='';await save();await renderComp(true);$('jMsg').textContent=ex?'C\'est bon, tu as rejoint la compétition.':'Rejoint. Le créateur n\'apparaît pas encore : vérifie le code avec lui.'}
  else if(t.id==='cRef')renderComp(true);
  else if(t.id==='rAdd'){let n=$('rEx').value;if(n==='__autre')n=addExercise($('rOther').value);const v=parseFloat(String($('rVal').value).replace(',','.'));if(!n){$('rMsg').textContent='Choisis un exercice.';return}if(isNaN(v)){$('rMsg').textContent='Entre ta valeur actuelle.';return}if(S.recs.some(r=>r.name===n)){$('rMsg').textContent='Ce record existe déjà.';return}
    S.recs.push({id:'r'+Date.now().toString(36),name:n,unit:$('rUnit').value,hist:[{d:TK,v}]});$('rUnit').value='reps';$('rVal').value='';$('rOther').value='';$('rOther').hidden=true;$('rMsg').textContent='';save();renderRecs()}
  else if(t.dataset.rplus!==undefined){const r=S.recs[Number(t.dataset.rplus)];setRec(r,r.hist[r.hist.length-1].v+1)}
  else if(t.dataset.rminus!==undefined){const r=S.recs[Number(t.dataset.rminus)];setRec(r,r.hist[r.hist.length-1].v-1)}
  else if(t.dataset.rdel!==undefined){const i=Number(t.dataset.rdel);if(t.dataset.sure){S.recs.splice(i,1);save();renderRecs()}else{t.dataset.sure='1';t.style.borderColor='#e4ff1a';t.setAttribute('aria-label','Confirmer la suppression')}}
  else if(t.dataset.copy!==undefined){const c=S.comps[Number(t.dataset.copy)];try{await navigator.clipboard.writeText(fmtCode(c.code));t.textContent='Copié !'}catch(err){t.textContent=fmtCode(c.code)}}
  else if(t.dataset.leave!==undefined){const i=Number(t.dataset.leave);if(t.dataset.sure){S.comps.splice(i,1);await save();await publish();renderComp(true)}else{t.dataset.sure='1';t.textContent='Confirmer ?'}}
});
document.addEventListener('input',e=>{const t=e.target;if(form&&t.dataset&&t.dataset.pf!==undefined){const x=t.dataset.pf;form.perf[x]=form.perf[x]||{};form.perf[x][t.dataset.pk]=t.value}});
document.addEventListener('change',e=>{const t=e.target;if(t.id==='setName'){S.name=t.value.trim();save();setHead();return}
  if(t.id==='rEx'){$('rOther').hidden=t.value!=='__autre';if(t.value&&t.value!=='__autre')$('rUnit').value=isTimed(t.value)?'sec':isLoad(t.value)?'kg':'reps';return}
  if(t.dataset&&t.dataset.rset!==undefined){const v=parseFloat(String(t.value).replace(',','.'));if(!isNaN(v))setRec(S.recs[Number(t.dataset.rset)],v);return}if(t.dataset&&t.dataset.g!==undefined){const g=Number(t.dataset.g),x=Number(t.dataset.x),old=S.exg[g][1][x],v=t.value.trim();if(!v){t.value=old;return}S.exg[g][1][x]=v;if(form){const i=form.ex.indexOf(old);if(i>=0)form.ex[i]=v}save()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&form)close();if(e.key==='Enter'&&e.target.id&&e.target.id.startsWith('new')){e.preventDefault();document.querySelector('[data-addx="'+e.target.id.slice(3)+'"]')?.click()}});
$('sheet').addEventListener('click',e=>{if(e.target.id==='sheet')close()});
window.addEventListener('hashchange',route);

let local=null;try{local=JSON.parse(localStorage.getItem('carnet-seances')||'null')}catch(e){}
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
let canStore=true;try{localStorage.setItem('carnet-t','1');canStore=localStorage.getItem('carnet-t')==='1'}catch(e){canStore=false}
const bkData=()=>JSON.stringify(packData());
$('bk').addEventListener('toggle',()=>{if($('bk').open&&!$('bkT').value)$('bkT').value=bkData()});
$('bkC').addEventListener('click',async()=>{const t=$('bkT');t.value=bkData();t.focus();t.select();try{await navigator.clipboard.writeText(t.value);toast('Sauvegarde copiée ✓')}catch(e){try{document.execCommand('copy')?toast('Sauvegarde copiée ✓'):toast('Sélectionne le texte et copie-le')}catch(_){toast('Sélectionne le texte et copie-le')}}});
$('bkR').addEventListener('click',()=>{bkFromText($('bkT').value)}); /* v7.6 : aperçu puis fusionner ou remplacer */
/*@@MODS@@*/
load(local);route();if(!S.onb&&!S.sessions.length){if(instFirst())instShow(()=>{if(!S.onb&&!$('onb'))showOnb(0)});else showOnb(0)}else if(!S.onb){S.onb=true} /* v7.4 : nouvel utilisateur sur téléphone, pas encore installée : le tutoriel d'installation d'abord */
v6Init();setTimeout(checkUpd,3000);if(S.onb&&!$('onb')){if(!maybeBilan())maybeHello()}else S.lastSeen=Date.now();if(!canStore)setTimeout(()=>{const b=document.createElement('div');b.id='warn';b.setAttribute('role','alert');b.innerHTML='<span>Ce navigateur bloque l\'enregistrement : tes séances seront perdues à la fermeture. Ouvre le lien dans '+(PLAT.ios?'Safari':PLAT.and?'Chrome':'ton navigateur habituel')+' (pas en navigation privée).</span>';document.body.prepend(b)},0);$('save').textContent='Enregistré sur ce téléphone.';
bkBoot(!!local); /* v7.6 : sauvegardes automatiques ; rappel d'export discret (remplace l'ancien bandeau) */
}
