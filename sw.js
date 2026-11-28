const C='carnet-v7-5-0';
const F=['./','./index.html','./manifest.webmanifest','./manifest-homme.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png','./icon-homme-180.png','./icon-femme-180.png','./icon-chat-180.png','./icon-loup-180.png','./icon-ours-180.png','./icon-gorille-180.png','./icon-panda-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!=='carnet-ics').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||e.request.url.includes('version.json'))return;
  /* v7.5 : fichier d'agenda des compléments, préparé sur le téléphone par l'appli (rien n'est envoyé sur internet) */
  if(e.request.url.includes('complements-alimentaires.ics')){e.respondWith(caches.open('carnet-ics').then(c=>c.match(e.request,{ignoreSearch:true})).then(r=>r||new Response('',{status:404})));return}
  e.respondWith(fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r})
  .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))))});
/* v7.5 : rappels de compléments : « Pris » est gardé (IndexedDB) et enregistré par l'appli dès qu'elle tourne */
function spQueue(a){return new Promise(ok=>{try{const r=indexedDB.open('carnet-sw',1);r.onupgradeneeded=()=>{r.result.createObjectStore('q',{autoIncrement:true})};
  r.onsuccess=()=>{const db=r.result,tx=db.transaction('q','readwrite');tx.objectStore('q').add(a);tx.oncomplete=()=>{db.close();ok(true)};tx.onerror=()=>{db.close();ok(false)}};r.onerror=()=>ok(false)}catch(e){ok(false)}})}
function spAct(d,action){if(action==='take')return spQueue({k:'take',day:d.day,keys:d.keys||[],t:Date.now()}).then(()=>clients.matchAll({type:'window',includeUncontrolled:true})).then(cs=>{cs.forEach(c=>c.postMessage({supp:'sync'}))});return Promise.resolve()}
/* v7.4 : toucher la notification du minuteur ramène dans l'appli */
self.addEventListener('notificationclick',e=>{e.notification.close();const d=e.notification.data||{};if(d.supp&&e.action==='take'){e.waitUntil(spAct(d,'take'));return}
  const u=d.u||'./';e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if('focus' in c){if(d.supp)c.postMessage({supp:'open'});return c.focus()}}return clients.openWindow(u)}))});
