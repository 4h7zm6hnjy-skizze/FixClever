/* FixClever 2.3.3 – schneller Offline-Start, kontrollierte vollständige Speicherung. */
'use strict';
const VERSION='2.3.3';
const CACHE='fixclever-core-2.3.3-repaired-start';
const CORE=[
 './index.html', './', './style.css?v=2.3.3',
 './lessons.js?v=2.3.3','./questions.js?v=2.3.3','./curriculum-extra.js?v=2.3.3',
 './fc231-inhalte.js?v=2.3.3','./app.js?v=2.3.3',
 './quiz.js?v=2.3.3','./fc231-tests.js?v=2.3.3',
 './examples-extra.js?v=2.3.3','./fc233-lernhilfen.js?v=2.3.3',
 './icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon-32.png',
 './manifest.webmanifest?v=2.3.3'
];
const urls=CORE.map(path=>new URL(path,self.registration.scope).href);
const entry=new URL('./index.html',self.registration.scope).href;
let working=null;
async function getMissing(){const cache=await caches.open(CACHE);const missing=[];
 for(const url of urls){if(!await cache.match(url))missing.push(url);}return missing;}
async function notify(){const missing=await getMissing();for(const client of await self.clients.matchAll({type:'window',includeUncontrolled:true})){
 client.postMessage({type:'FC233_CACHE_PROGRESS',version:VERSION,ready:missing.length===0,done:urls.length-missing.length,total:urls.length,missing:missing.map(x=>new URL(x).pathname)});
 }}
async function finishCache(){if(working)return working;
 working=(async()=>{
  const cache=await caches.open(CACHE);
  for(const url of await getMissing()){
   try{await cache.add(new Request(url,{cache:'reload'}));}catch(e){/* Retry from the offline button later; never block app start. */}
   await notify();
  }
  const missing=await getMissing();
  if(missing.length===0){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('fixclever-core-')&&k!==CACHE).map(k=>caches.delete(k)));}
  await notify();
 })().finally(()=>working=null);return working;
}
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 // Do not hold back a new version because one 4MB optional data bundle fails.
 try{await cache.add(new Request(entry,{cache:'reload'}));}catch(e){/* Network loading still works. */}
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{
 if(event.data?.type==='FC_PREPARE_OFFLINE'){event.waitUntil(finishCache());return;}
 if(event.data?.type!=='FC_CHECK_OFFLINE'||!event.ports?.[0])return;
 event.waitUntil((async()=>{const missing=await getMissing();event.ports[0].postMessage({type:'FC_OFFLINE_STATUS',version:VERSION,ready:missing.length===0,count:urls.length,missing:missing.map(x=>new URL(x).pathname)});
 if(missing.length)void finishCache();})());
});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url),base=new URL(self.registration.scope);
 if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(request.mode==='navigate'){
   // Prefer latest cached shell only for offline/no-network. Online allows a fresh update.
   try{const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),6500);try{const response=await fetch(request,{signal:controller.signal});if(response.ok)return response;}finally{clearTimeout(timeout);}}catch(e){}
   return await cache.match(entry)||await cache.match(new URL('./',base).href)||new Response('Bitte FixClever einmal online öffnen, damit die Offline-Dateien vollständig gespeichert werden.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
  const saved=await cache.match(request);if(saved)return saved;
  try{const result=await fetch(request);if(result.ok&&result.type==='basic')await cache.put(request,result.clone());return result;}
  catch(e){
   for(const key of await cache.keys()){if(new URL(key.url).pathname===url.pathname)return await cache.match(key);}
   return Response.error();
  }
 })());
});
