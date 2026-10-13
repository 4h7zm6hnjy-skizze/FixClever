/* FixClever 3.0.0 offline release. Legacy messages retain protocol 2.3.3. */
'use strict';
const RELEASE='3.0.0',PROTOCOL='2.3.3',CACHE='fixclever-core-3.0.0',
 FILES=['./index.html','./','./style.css?v=2.3.3','./lessons.js?v=2.3.3',
 './questions.js?v=2.3.3','./curriculum-extra.js?v=2.3.3',
 './fc231-inhalte.js?v=2.3.3','./app.js?v=2.3.3',
 './quiz.js?v=2.3.3','./fc231-tests.js?v=2.3.3',
 './examples-extra.js?v=2.3.3','./fc233-lernhilfen.js?v=2.3.3',
 './fc300-suite.js?v=3.0.0','./fc300-style.css?v=3.0.0',
 './version.json','./manifest.webmanifest?v=2.3.3',
 './icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon-32.png'];
const urls=FILES.map(x=>new URL(x,self.registration.scope).href),entry=new URL('./index.html',self.registration.scope).href;
let preparation=null;
const timeoutFetch=(request,ms)=>{
 const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),ms);
 return fetch(request,{cache:'no-store',signal:ctl.signal}).finally(()=>clearTimeout(timer));
};
async function missing(){const c=await caches.open(CACHE),out=[];for(const url of urls)if(!await c.match(url))out.push(url);return out;}
async function progress(){const absent=await missing(),clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 for(const client of clients)client.postMessage({type:'FC233_CACHE_PROGRESS',version:PROTOCOL,release:RELEASE,ready:absent.length===0,done:urls.length-absent.length,total:urls.length,missing:absent.map(x=>new URL(x).pathname)});
}
function prepare(){if(preparation)return preparation;
 preparation=(async()=>{
  const c=await caches.open(CACHE);for(const url of await missing()){
   try{const r=await timeoutFetch(url,30000);if(r.ok)await c.put(url,r.clone());}catch(e){console.warn('FixClever 3.0 Offline-Datei nicht speicherbar',new URL(url).pathname);}
   await progress();
  }
  if(!(await missing()).length){for(const name of await caches.keys())if(name.startsWith('fixclever-core-')&&name!==CACHE)await caches.delete(name);}
  await progress();
 })().finally(()=>{preparation=null;});return preparation;
}
self.addEventListener('install',event=>event.waitUntil((async()=>{try{
 const r=await timeoutFetch(entry,10000);if(r.ok)await(await caches.open(CACHE)).put(entry,r.clone());
 }catch{}await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{
 const d=event.data||{};
 if(d.type==='FC_PREPARE_OFFLINE'){event.waitUntil(prepare());return;}
 if(d.type==='FC_CHECK_OFFLINE'&&event.ports?.[0])event.waitUntil((async()=>{
 const absent=await missing();event.ports[0].postMessage({type:'FC_OFFLINE_STATUS',version:PROTOCOL,release:RELEASE,ready:absent.length===0,count:urls.length,missing:absent.map(x=>new URL(x).pathname)});
 if(absent.length)await prepare();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;
 const u=new URL(req.url),scope=new URL(self.registration.scope);
 if(u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname))return;
 event.respondWith((async()=>{
  const c=await caches.open(CACHE),code=/\.(?:js|css|json|webmanifest)$/i.test(u.pathname);
  if(req.mode==='navigate'||code){
   try{const r=await timeoutFetch(req,code?18000:8000);if(r.ok){
    if(code||u.pathname===new URL(entry).pathname)await c.put(req,r.clone());return r;
   }}catch{}
   const cached=await c.match(req);if(cached)return cached;
   if(code){for(const key of await c.keys())if(new URL(key.url).pathname===u.pathname)return await c.match(key);return Response.error();}
   return await c.match(entry)||new Response('FixClever muss einmal vollständig online geladen werden.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
  }
  const cached=await c.match(req);if(cached)return cached;
  try{const r=await timeoutFetch(req,18000);if(r.ok)await c.put(req,r.clone());return r;}catch{
   for(const key of await c.keys())if(new URL(key.url).pathname===u.pathname)return await c.match(key);return Response.error();
  }
 })());
});
