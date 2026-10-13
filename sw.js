/* FixClever 2.0.0 – vollständiger Kern-Cache; keine Profile oder Testantworten werden übertragen. */
'use strict';
const VERSION='2.0.0';
const CACHE='fixclever-core-'+VERSION+'-3000-lernmodule';
const CORE=[
 './index.html', './',
 './style.css?v=2.0.0',
 './lessons.js?v=2.0.0',
 './questions.js?v=2.0.0',
 './curriculum-extra.js?v=2.0.0',
 './app.js?v=2.0.0',
 './subjects-extra.js?v=2.0.0',
 './quiz.js?v=2.0.0',
 './examples-extra.js?v=2.0.0',
 './icon.svg',
 './icon-192.png', './icon-512.png', './apple-touch-icon.png', './favicon-32.png',
 './manifest.webmanifest?v=2.0.0'
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
     try{return await fetch(request);}
     catch{
       const cache=await caches.open(CACHE);
       return await cache.match(indexUrl)||await cache.match(new URL('./',scope).href)||new Response('FixClever: Offline-Inhalte noch nicht gespeichert.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
     }
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
