/* FixClever 2.3.2 – vollständiger Kern-Cache; keine Profile oder Testantworten werden übertragen. */
'use strict';
const VERSION='2.3.2';
const CACHE='fixclever-core-'+VERSION+'-startfix-v232-2026-10-13-final';
const CORE=[
 './index.html', './',
 './style.css?v=2.3.2',
 './lessons.js?v=2.3.2',
 './questions.js?v=2.3.2',
 './curriculum-extra.js?v=2.3.2',
 './app.js?v=2.3.2',
 './quiz.js?v=2.3.2',
 './examples-extra.js?v=2.3.2',
 './icon.svg',
 './icon-192.png', './icon-512.png', './apple-touch-icon.png', './favicon-32.png',
 './fc231-inhalte.js?v=2.3.2',
 './fc231-tests.js?v=2.3.2', './fc231-lernhilfen.js?v=2.3.2',
 './manifest.webmanifest?v=2.3.2'
];
const urls=CORE.map(p=>new URL(p,self.registration.scope).href);
const indexUrl=new URL('./index.html',self.registration.scope).href;
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
   const cache=await caches.open(CACHE);
   // Installation only succeeds if every core resource was downloaded successfully.
   await cache.addAll(urls.map(url=>new Request(url,{cache:'reload'})));
   await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
   const keys=await caches.keys();
   await Promise.all(keys.filter(k=>k.startsWith('fixclever-core-')&&k!==CACHE).map(k=>caches.delete(k)));
   await self.clients.claim();
 })());
});
self.addEventListener('message',event=>{
 if(event.data?.type!=='FC_CHECK_OFFLINE'||!event.ports?.[0])return;
 event.waitUntil((async()=>{
   const cache=await caches.open(CACHE);
   const missing=[];
   for(const url of urls){if(!await cache.match(url))missing.push(new URL(url).pathname);}
   event.ports[0].postMessage({type:'FC_OFFLINE_STATUS',version:VERSION,ready:missing.length===0,count:urls.length,missing});
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 const scope=new URL(self.registration.scope);
 if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(request.mode==='navigate'){
   event.respondWith((async()=>{
     const cache=await caches.open(CACHE);
     const saved=await cache.match(indexUrl)||await cache.match(new URL('./',scope).href);
     // Bei bestehender Verbindung die neue Version bevorzugen. Nach kurzer Zeit
     // auf den vollständig gespeicherten Offline-Stand zurückfallen.
     const controller=new AbortController();
     const timer=setTimeout(()=>controller.abort(),4000);
     try{
       const online=await fetch(request,{signal:controller.signal,cache:'no-store'});
       if(online.ok){
         if(online.type==='basic')await cache.put(indexUrl,online.clone());
         return online;
       }
       return saved||online;
     }catch{
       return saved||new Response('FixClever: Offline-Inhalte noch nicht gespeichert. Bitte einmal online öffnen.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
     }finally{clearTimeout(timer);}
   })());
   return;
 }
 event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const cached=await cache.match(request);
   if(cached)return cached;
   try{
     const response=await fetch(request);
     if(response.ok&&response.type==='basic')await cache.put(request,response.clone());
     return response;
   }catch{
     // Query strings may differ if a bookmark was created on an earlier version.
     const wanted=new URL(request.url);
     for(const key of await cache.keys()){
       const stored=new URL(key.url);
       if(stored.pathname===wanted.pathname)return await cache.match(key);
     }
     return Response.error();
   }
 })());
});
