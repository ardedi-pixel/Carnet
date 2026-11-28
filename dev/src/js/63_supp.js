/* ===================== v7.5 : compléments alimentaires (moteur) =====================
   Outil d'organisation et de suivi : l'appli enregistre ce que la personne saisit. Elle ne calcule, n'invente ni ne conseille
   aucun dosage, aucun cycle, aucune supplémentation (même principe que la nutrition : pas un coach).
   Données S.supp (clé dans EXTRA, donc dans la sauvegarde et le transfert) :
   - list : fiches {id, n (nom), b (marque, produit), q (dose par prise, null = à préciser), u (unité), tk:[{m,t}] (une entrée par prise :
     moment m = m|d|s|c|a, heure t propre au complément, vide = heure du moment), r (repas : jeun|repas|indif|autre), rn,
     mode, d0 (début), d1 (fin, facultative), cy:[{f,a,on,off}] (cycle : à partir du jour f, phases comptées depuis a, en jours),
     pw:[1-7] (ponctuel : jours de la semaine, 1 = lundi), pd:[dates], sus:[{a,b}] (suspensions, b vide = en cours),
     dz:[{d,q}] (changements de dose programmés), no (notes), pr (précautions), c (couleur), far:[ids] + farH (à espacer de),
     stock:{on,q,su,pi,at,low,add:[{d,q}]}, hist:[{to,mode,cy,pw,pd}] (programmes précédents, valables jusqu'au jour to inclus)}
   - mode : 'cont' prise continue ; 'cyc' alternance ON/OFF ; 'ponc' ponctuelle (jours choisis, dates, ou à la demande) ; 'def' à définir.
     Une suspension interrompt sans modifier le cycle. Une fiche sans cycle n'est JAMAIS mise en OFF.
   - Modifier un cycle en cours ajoute un segment à partir d'aujourd'hui ; changer de mode (continu, cycle, ponctuel) range l'ancien
     programme dans hist : le passé (phases, prises prévues, prises notées) reste tel quel.
   - log[date][id|n° de prise] : {s:'ok'|'late'|'miss'|'skip'|'snz', t, u (reportée jusqu'à), k (nb de reports), n, q, un, m, h}
     (nom, dose, unité, moment et heure copiés : l'historique reste juste même si la fiche change ou est supprimée).
     Une prise sans validation n'est jamais comptée comme prise.
   - mt : heures des moments ; ev : journal des modifications ; nt : rappels déjà faits (aucun doublon) ; ics : dernier ajout à l'agenda. */
['supp','ntab'].forEach(k=>{if(!EXTRA.includes(k))EXTRA.push(k)});
const SPM={m:['Matin','08:00'],d:['Midi','12:30'],s:['Soir','19:30'],c:['Coucher','22:30'],a:['Autre heure','']};
const SPM_O=['m','d','s','c','a'];
const SPMP={m:'Prise du matin',d:'Prise du midi',s:'Prise du soir',c:'Prise du coucher',a:'Prise'};
const SPU=['mg','µg','g','UI','gélule','comprimé','goutte','ml','dose','sachet','cuillère'];
const SPUP={gélule:'gélules',comprimé:'comprimés',goutte:'gouttes',dose:'doses',sachet:'sachets',cuillère:'cuillères'};
const SPR={jeun:'À jeun',repas:'Avec un repas',indif:'Peu importe',autre:'Autre'};
const SPC=['#e4573d','#f2994a','#d4a72c','#4caf50','#26a69a','#3a86ff','#7b61ff','#e05aa0'];
const SPMODE={cont:'Prise continue',cyc:'Cycle ON/OFF',ponc:'Ponctuelle',def:'À définir'};
const SPSU=['gélules','comprimés','g','ml','doses','sachets'];
/* ---- dates : jours entiers en UTC (aucun décalage d'heure d'été), heures en heure locale du téléphone ---- */
const spDn=k=>{const[a,b,c]=String(k).split('-').map(Number);return Math.round(Date.UTC(a,b-1,c)/864e5)};
const spDk=n=>{const d=new Date(n*864e5);return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate())};
const spAdd=(k,n)=>spDk(spDn(k)+n);
const spToday=()=>key(new Date());
const spIsD=k=>typeof k==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(k)&&!isNaN(spDn(k));
const spIsT=t=>typeof t==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(t);
const spMinT=t=>{const[h,m]=t.split(':').map(Number);return h*60+m};
const spTm=m=>pad(Math.floor(((m%1440)+1440)%1440/60))+':'+pad(((m%1440)+1440)%1440%60);
const spAt=(k,t)=>{const d=parse(k),[h,m]=t.split(':').map(Number);return new Date(d.getFullYear(),d.getMonth(),d.getDate(),h,m).getTime()};
const spDow=k=>((parse(k).getDay()+6)%7)+1;
/* ---- accès aux données (normalisées une fois par objet chargé) ---- */
const SP_OK=new WeakSet();
function SP(){let s=S.supp;if(!s||typeof s!=='object'||Array.isArray(s))s=S.supp={};if(SP_OK.has(s))return s;
  s.list=arr(s.list).filter(x=>x&&typeof x==='object');s.log=obj(s.log);s.mt=Object.assign({m:'08:00',d:'12:30',s:'19:30',c:'22:30'},obj(s.mt));
  Object.keys(s.mt).forEach(k=>{if(!spIsT(s.mt[k]))s.mt[k]=SPM[k]?SPM[k][1]:'08:00'});s.ev=arr(s.ev);s.nt=obj(s.nt);s.ics=obj(s.ics);
  if(typeof s.tab!=='string')s.tab='today';if(typeof s.cv!=='string')s.cv='m';s.list.forEach(spFix);SP_OK.add(s);return s}
function spFix(x){const td=spToday();x.id=typeof x.id==='string'&&x.id?x.id:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  x.n=String(x.n||'').slice(0,60)||'Complément';x.b=String(x.b||'').slice(0,80);x.q=x.q===null||x.q===''||x.q===undefined||isNaN(+x.q)?null:+x.q;x.u=typeof x.u==='string'&&x.u?x.u:'mg';
  x.tk=arr(x.tk).filter(t=>t&&SPM[t.m]).map(t=>({m:t.m,t:spIsT(t.t)?t.t:''}));if(!x.tk.length)x.tk=[{m:'m',t:''}];x.tk.forEach(t=>{if(t.m==='a'&&!t.t)t.t='10:00'});
  x.r=SPR[x.r]?x.r:'indif';x.rn=String(x.rn||'').slice(0,80);x.mode=SPMODE[x.mode]?x.mode:'def';x.d0=spIsD(x.d0)?x.d0:td;x.d1=spIsD(x.d1)?x.d1:'';
  x.cy=arr(x.cy).filter(g=>g&&spIsD(g.f)&&spIsD(g.a)&&+g.on>=1).map(g=>({f:g.f,a:g.a,on:Math.round(+g.on),off:Math.max(0,Math.round(+g.off||0))})).sort((a,b)=>a.f<b.f?-1:1);
  x.hist=arr(x.hist).filter(h=>h&&spIsD(h.to)&&SPMODE[h.mode]).map(h=>({to:h.to,mode:h.mode,cy:arr(h.cy).filter(g=>g&&spIsD(g.f)&&spIsD(g.a)&&+g.on>=1).map(g=>({f:g.f,a:g.a,on:+g.on,off:+g.off||0})),pw:arr(h.pw).map(Number),pd:arr(h.pd).filter(spIsD)})).filter(h=>h.mode!=='cyc'||h.cy.length).sort((a,b)=>a.to<b.to?-1:1);
  if(x.mode==='cyc'&&!x.cy.length)x.mode='def';const f0=spF0(x);if(x.cy.length&&x.cy[0].f>f0)x.cy[0].f=f0;
  x.pw=arr(x.pw).map(Number).filter(n=>n>=1&&n<=7);x.pd=arr(x.pd).filter(spIsD).sort();x.sus=arr(x.sus).filter(s=>s&&spIsD(s.a)).map(s=>({a:s.a,b:spIsD(s.b)?s.b:''}));
  x.dz=arr(x.dz).filter(z=>z&&spIsD(z.d)&&!isNaN(+z.q)).map(z=>({d:z.d,q:+z.q})).sort((a,b)=>a.d<b.d?-1:1);x.no=String(x.no||'');x.pr=String(x.pr||'');
  x.c=Number.isInteger(x.c)&&x.c>=0&&x.c<SPC.length?x.c:0;x.far=arr(x.far).filter(i=>typeof i==='string');x.farH=Math.max(0,Math.min(12,+x.farH||0));
  const st=obj(x.stock);x.stock={on:!!st.on,q:Math.max(0,+st.q||0),su:typeof st.su==='string'&&st.su?st.su:'gélules',pi:Math.max(0,+st.pi||1),at:spIsD(st.at)?st.at:td,low:Math.max(1,Math.round(+st.low||7)),add:arr(st.add).filter(z=>z&&spIsD(z.d)&&+z.q>0).map(z=>({d:z.d,q:+z.q}))};
  x.cr=+x.cr||Date.now();x.up=+x.up||x.cr;return x}
const spById=id=>SP().list.find(x=>x.id===id);
/* premier jour du programme actuel (après les programmes précédents) */
const spF0=x=>x.hist&&x.hist.length?spAdd(x.hist[x.hist.length-1].to,1):x.d0;
/* programme valable un jour donné : un ancien (hist) ou l'actuel */
function spProg(x,k){if(x.hist)for(const h of x.hist)if(k<=h.to)return h;return x}
/* ---- phase d'un complément un jour donné ---- */
function spSusOn(x,k){return x.sus.find(s=>s.a<=k&&(!s.b||k<=s.b))}
function spSeg(P,k){let g=P.cy[0];for(const s of P.cy)if(s.f<=k)g=s;return g}
function spCyc(P,k){const g=spSeg(P,k),L=g.on+g.off,dd=spDn(k)-spDn(g.a),p=((dd%L)+L)%L,c0=spDn(k)-p;
  if(p<g.on)return {k:'on',day:p+1,len:g.on,start:spDk(c0),end:spDk(c0+g.on-1),next:g.off?spDk(c0+g.on):'',nlen:g.off,g};
  return {k:'off',day:p-g.on+1,len:g.off,start:spDk(c0+g.on),end:spDk(c0+L-1),next:spDk(c0+L),nlen:g.on,g}}
function spPonc(P,k){return P.pd.includes(k)||P.pw.includes(spDow(k))}
/* k : def (à définir), pre (pas commencé), end (terminé), sus (suspendu ; b = phase sous-jacente), on, off, none (ponctuel, pas ce jour-là), dem (à la demande) */
function spPh(x,k){if(k<x.d0)return {k:'pre'};if(x.d1&&k>x.d1)return {k:'end'};const P=spProg(x,k);if(P.mode==='def')return {k:'def'};
  let b;if(P.mode==='cyc')b=spCyc(P,k);else if(P.mode==='ponc')b=spPonc(P,k)?{k:'on'}:{k:P.pw.length||P.pd.length?'none':'dem'};else b={k:'on'};
  const s=spSusOn(x,k);return s?{k:'sus',s,b}:b}
const spDue=(x,k)=>spPh(x,k).k==='on';
function spDose(x,k){let q=x.q;x.dz.forEach(z=>{if(z.d<=k)q=z.q});return q}
function spTime(x,i){const t=x.tk[i];return t&&t.t?t.t:SP().mt[t?t.m:'m']||'08:00'}
const spSortT=t=>(spMinT(t)-300+1440)%1440; /* journée de 5 h à 5 h pour l'ordre (une prise à 0 h 30 reste en fin de liste) */
/* prises prévues un jour donné, dans l'ordre de la journée */
function spDay(k){const R=[];SP().list.forEach(x=>{if(!spDue(x,k))return;x.tk.forEach((t,i)=>R.push({x,i,m:t.m,t:spTime(x,i),q:spDose(x,k),key:x.id+'|'+i}))});
  return R.sort((a,b)=>spSortT(a.t)-spSortT(b.t)||SPM_O.indexOf(a.m)-SPM_O.indexOf(b.m)||a.x.n.localeCompare(b.x.n))}
/* regroupe les prises par moment (heure du moment) ; une heure propre au complément garde son moment */
function spGroups(R){const G=[];R.forEach(it=>{const gk=it.m==='a'?'a'+it.t:it.m;let g=G.find(z=>z.k===gk);if(!g){g={k:gk,m:it.m,t:it.m==='a'?it.t:SP().mt[it.m],L:[]};G.push(g)}g.L.push(it)});
  return G.sort((a,b)=>spSortT(a.L[0].t)-spSortT(b.L[0].t))}
/* ---- journal des prises ---- */
const spLog=(k,kk)=>{const L=SP().log[k];return L?L[kk]:undefined};
const spTaken=e=>!!e&&(e.s==='ok'||e.s==='late');
const spDone=e=>!!e&&e.s!=='snz';
function spSet(k,it,st,ex){const s=SP(),L=s.log[k]=obj(s.log[k]),o=Object.assign({},L[it.key]||{});
  Object.assign(o,{s:st,t:Date.now(),n:it.x.n,q:it.q,un:it.x.u,m:it.m,h:it.t},ex||{});if(st!=='snz')delete o.u;L[it.key]=o;return o}
function spUnset(k,kk){const L=SP().log[k];if(L){delete L[kk];if(!Object.keys(L).length)delete SP().log[k]}}
/* prise du jour : à l'heure, ou en retard si plus d'une heure après l'heure prévue */
function spTakeSt(k,it,now){now=now||Date.now();return now-spAt(k,it.t)>3600000?'late':'ok'}
/* prises d'un jour avec les entrées du journal qui ne sont plus prévues (fiche supprimée, horaire changé, prise à la demande) */
function spDayAll(k){const R=spDay(k),L=SP().log[k]||{},seen=new Set(R.map(r=>r.key));
  Object.keys(L).forEach(kk=>{if(seen.has(kk))return;const e=L[kk],id=kk.split('|')[0],x=spById(id);
    R.push({x:x||{id,n:e.n||'Complément',u:e.un||'',c:0,tk:[],gone:1},i:-1,m:e.m||'a',t:spIsT(e.h)?e.h:'12:00',q:e.q,key:kk,extra:1,dem:kk.includes('|x')})});
  return R.sort((a,b)=>spSortT(a.t)-spSortT(b.t))}
/* ---- statistiques (une prise non validée compte comme non prise) ---- */
function spStats(from,to,id){const today=spToday(),now=Date.now();let plan=0,ok=0,late=0,miss=0,skip=0,unv=0,snz=0,dem=0;
  for(let n=spDn(from);n<=spDn(to);n++){const k=spDk(n);if(k>today)break;
    spDayAll(k).forEach(it=>{if(id&&it.x.id!==id)return;const e=spLog(k,it.key);if(it.dem){if(spTaken(e))dem++;return}
      if(it.extra&&!e)return;if(k===today&&spAt(k,it.t)>now&&!spDone(e))return;plan++;
      const s=e&&e.s;if(s==='ok')ok++;else if(s==='late')late++;else if(s==='skip')skip++;else if(s==='miss')miss++;else{unv++;if(s==='snz')snz++}})}
  return {plan,ok,late,miss,skip,unv,snz,dem,taken:ok+late,pct:plan?Math.round((ok+late)/plan*100):null}}
/* nombre total de prises notées comme prises */
function spCount(id){let n=0;const L=SP().log;for(const k in L)for(const kk in L[k]){if(id&&kk.split('|')[0]!==id)continue;if(spTaken(L[k][kk]))n++}return n}
/* reports enregistrés (une prise reportée garde son nombre de reports même une fois prise) */
function spSnzCount(from,to){let n=0;const L=SP().log;for(const k in L){if(k<from||k>to)continue;for(const kk in L[k])n+=+L[k][kk].k||0}return n}
/* ---- statut affiché : actif, en pause, terminé, à définir ---- */
function spStat(x,k){k=k||spToday();if(x.mode==='def')return 'def';if(x.d1&&x.d1<k)return 'fini';if(spSusOn(x,k))return 'pause';return 'actif'}
const SPST={actif:'Actif',pause:'En pause',fini:'Terminé',def:'À définir'};
/* ---- prochains changements (phase, reprise, fin, dose) ---- */
function spPk(p){return p.k==='sus'?'sus':p.k}
function spNext(x,from,days){const E=[];let prev=spPk(spPh(x,spAdd(from,-1)));
  for(let n=0;n<=days;n++){const k=spAdd(from,n),p=spPh(x,k),pk=spPk(p);
    if(pk!==prev){if(pk==='on'&&x.mode==='cyc'&&prev==='off')E.push({d:k,k:'res',len:p.len});else if(pk==='on'&&prev==='pre')E.push({d:k,k:'start',len:p.len});
      else if(pk==='off')E.push({d:k,k:'off',len:p.len});else if(pk==='on'&&prev==='sus')E.push({d:k,k:'back'});else if(pk==='sus')E.push({d:k,k:'sus'});else if(pk==='end')E.push({d:k,k:'end'})}
    x.dz.forEach(z=>{if(z.d===k&&n>0)E.push({d:k,k:'dose',q:z.q})});prev=pk}
  return E}
/* cycles ON terminés (avant aujourd'hui), pour l'historique */
function spDoneCycles(x){if(x.mode!=='cyc')return [];const td=spToday(),R=[];let st=null;
  for(let n=spDn(x.d0);n<spDn(td);n++){const k=spDk(n),p=spPh(x,k),on=p.k==='on'||(p.k==='sus'&&p.b&&p.b.k==='on');
    if(on&&!st)st=k;if(!on&&st){R.push({a:st,b:spAdd(k,-1)});st=null}if(p.k==='end')break}return R}
/* ---- modifications (avec le journal) ---- */
function spEv(x,txt){const s=SP();s.ev.push({t:Date.now(),id:x.id,n:x.n,x:txt});if(s.ev.length>600)s.ev.splice(0,s.ev.length-600)}
/* change le cycle : avant le début, il remplace tout ; en cours, il s'applique à partir d'aujourd'hui en gardant la phase actuelle */
function spCycleSet(x,on,off){const td=spToday();on=Math.max(1,Math.round(on));off=Math.max(0,Math.round(off));
  if(x.mode!=='cyc'||!x.cy.length||td<=spF0(x)){const a=x.cy.length?x.cy[0].a:spF0(x);x.cy=[{f:spF0(x),a,on,off}];return}
  const c=spCyc(x,td),c0=c.k==='on'?c.start:spAdd(c.start,-c.g.on);
  x.cy=x.cy.filter(g=>g.f<td).concat({f:td,a:c0,on,off})}
/* date de départ du cycle (1er jour ON) corrigée : tout le cycle actuel est recalculé depuis cette date */
function spCycStart(x,a,on,off){if(a<x.d0&&!x.hist.length)x.d0=a;x.cy=[{f:spF0(x),a,on:Math.max(1,Math.round(on)),off:Math.max(0,Math.round(off))}]}
/* départ du cycle actuel (1er jour ON du cycle en cours, ou à venir) */
function spCycA(x,k){if(x.mode!=='cyc'||!x.cy.length)return '';k=k||spToday();if(k<spF0(x))return spSeg(x,spF0(x)).a;const c=spCyc(x,k);return c.k==='on'?c.start:spAdd(c.start,-c.g.on)}
/* nouveau programme (changement de mode ou de jours) : l'ancien est gardé pour les jours passés */
function spProgSet(x,np){const td=spToday(),y=spAdd(td,-1);if(x.d0<td&&y>=spF0(x))x.hist.push({to:y,mode:x.mode,cy:JSON.parse(JSON.stringify(x.cy)),pw:x.pw.slice(),pd:x.pd.slice()});
  x.mode=np.mode;x.pw=np.pw||[];x.pd=np.pd||[];x.cy=np.mode==='cyc'?[{f:spF0(x),a:np.a||spF0(x),on:np.on,off:np.off}]:[]}
/* suspension temporaire (ne touche pas au cycle) */
function spPause(x,a,b){x.sus=x.sus.filter(s=>!(s.a>=a));x.sus.push({a,b:b||''})}
/* reprise ; shift : reprendre le cycle là où il en était (les jours de pause ne comptent pas) */
function spResume(x,k,shift){const s=x.sus.find(z=>z.a<=k&&(!z.b||z.b>=k))||x.sus.find(z=>z.a>k);if(!s)return;const y=spAdd(k,-1);
  if(s.a>y)x.sus=x.sus.filter(z=>z!==s);else s.b=y;
  if(shift&&x.mode==='cyc'&&x.cy.length&&s.a<k){const g=spSeg(x,k),dd=spDn(k)-spDn(s.a);x.cy=x.cy.filter(z=>z.f<k).concat({f:k,a:spAdd(g.a,dd),on:g.on,off:g.off})}}
/* ---- stock (facultatif) : restant estimé et date d'épuisement selon le programme (périodes OFF comprises) ---- */
function spStock(x){const st=x.stock;if(!st||!st.on)return null;let used=0;const L=SP().log;
  for(const k in L){if(k<st.at)continue;for(const kk in L[k])if(kk.split('|')[0]===x.id&&spTaken(L[k][kk]))used+=st.pi}
  const left=Math.max(0,Math.round((st.q+st.add.reduce((a,z)=>a+z.q,0)-used)*100)/100),td=spToday();let rem=left,out=null;
  for(let n=0;n<730;n++){const k=spAdd(td,n);if(!spDue(x,k))continue;let need=0;x.tk.forEach((t,i)=>{if(n===0&&spDone(spLog(k,x.id+'|'+i)))return;need+=st.pi});
    if(need>rem+1e-9){out=k;break}rem-=need}
  const days=out?spDn(out)-spDn(td):null;return {left,out,days,low:days!==null&&days<=st.low,su:st.su}}
/* ---- points d'attention (aucune supposition médicale : seulement ce que la personne a saisi) ---- */
function spWarn(x){const W=[];if(x.mode==='def')W.push('Cycle non renseigné : aucune alternance ON/OFF n\'a été configurée pour ce complément.');
  if(x.q===null)W.push('Dosage non renseigné : note la dose exacte indiquée sur le produit.');
  if(!x.pr.trim())W.push('Précautions non renseignées : contre-indications et interactions à vérifier sur la notice ou avec un professionnel de santé.');return W}
/* conflits d'horaires d'un jour : à jeun et avec un repas à la même heure ; compléments à espacer trop proches */
function spConf(k){const D=spDay(k),W=[],byT={};D.forEach(it=>{(byT[it.t]=byT[it.t]||[]).push(it)});
  Object.keys(byT).forEach(t=>{const L=byT[t],j=L.filter(i=>i.x.r==='jeun'),r=L.filter(i=>i.x.r==='repas');if(j.length&&r.length)W.push({k:'jr',t,a:j[0],b:r[0]})});
  const seen=new Set();D.forEach(a=>{if(!a.x.farH)return;a.x.far.forEach(id=>{D.filter(b=>b.x.id===id).forEach(b=>{const gap=Math.abs(spMinT(a.t)-spMinT(b.t)),pk=[a.key,b.key].sort().join('~');
    if(gap<a.x.farH*60&&!seen.has(pk)){seen.add(pk);const late=spMinT(b.t)>=spMinT(a.t)?b:a,early=late===b?a:b,nt=spMinT(early.t)+a.x.farH*60;W.push({k:'far',a,b,h:a.x.farH,mv:late,to:nt<24*60?spTm(Math.ceil(nt/5)*5):''})}})})});
  return W}
/* décaler toute la routine (heures des moments et heures propres aux compléments) */
function spShift(min){const s=SP();Object.keys(s.mt).forEach(k=>{s.mt[k]=spTm(spMinT(s.mt[k])+min)});s.list.forEach(x=>x.tk.forEach(t=>{if(t.t)t.t=spTm(spMinT(t.t)+min)}))}
/* ---- unités et textes ---- */
function spU(q,u){if(q===null||q===undefined)return '';const pl=SPUP[u]&&q>1?SPUP[u]:u;return fmtN(q)+' '+pl}
const spDl=k=>parse(k).toLocaleDateString(LOC(),{day:'numeric',month:'short'});
const spDL=k=>parse(k).toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long'});
function spWk(n){return n%7===0?(n/7)+' sem.':n+' j'}
function spCycL(g){return spWk(g.on)+' ON / '+(g.off?spWk(g.off)+' OFF':'sans OFF')}
