/* FixClever 2.3.3 QA / Offline stability update (2026-10-13).
   Keep the official release number until the HTML and all assets are versioned together. */
'use strict';
const VERSION='2.3.3';
const CACHE='fixclever-core-2.3.3-quality-20261013';
const CORE=[
 './index.html','./','./style.css?v=2.3.3',
 './lessons.js?v=2.3.3','./questions.js?v=2.3.3','./curriculum-extra.js?v=2.3.3',
 './fc231-inhalte.js?v=2.3.3','./app.js?v=2.3.3',
 './quiz.js?v=2.3.3','./fc231-tests.js?v=2.3.3',
 './examples-extra.js?v=2.3.3','./fc233-lernhilfen.js?v=2.3.3',
 './icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./favicon-32.png',
 './manifest.webmanifest?v=2.3.3'
];
const urls=CORE.map(p=>new URL(p,self.registration.scope).href);
const entry=new URL('./index.html',self.registration.scope).href;
let working=null;
async function missingFiles(){
 const cache=await caches.open(CACHE),missing=[];
 for(const url of urls)if(!await cache.match(url))missing.push(url);
 return missing;
}
async function notify(){
 const missing=await missingFiles();
 for(const client of await self.clients.matchAll({type:'window',includeUncontrolled:true})){
  client.postMessage({type:'FC233_CACHE_PROGRESS',version:VERSION,ready:missing.length===0,
   done:urls.length-missing.length,total:urls.length,missing:missing.map(s=>new URL(s).pathname)});
 }
}
async function withTimeout(request,ms){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),ms);
 try{return await fetch(request,{cache:'no-store',signal:controller.signal});}
 finally{clearTimeout(timer);}
}
async function prepareOffline(){
 if(working)return working;
 working=(async()=>{
  const cache=await caches.open(CACHE);
  for(const url of await missingFiles()){
   try{
    const res=await withTimeout(url,25000);
    if(res.ok)await cache.put(url,res.clone());
   }catch(err){console.warn('FixClever offline file unavailable:',new URL(url).pathname);}
   await notify();
  }
  if(!(await missingFiles()).length){
   for(const name of await caches.keys())if(name.startsWith('fixclever-core-')&&name!==CACHE)await caches.delete(name);
  }
  await notify();
 })().finally(()=>{working=null;});
 return working;
}
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 try{const res=await withTimeout(entry,10000);if(res.ok)await cache.put(entry,res);}catch{}
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{
 if(event.data?.type==='FC_PREPARE_OFFLINE'){
  event.waitUntil(prepareOffline());return;
 }
 if(event.data?.type!=='FC_CHECK_OFFLINE'||!event.ports?.[0])return;
 event.waitUntil((async()=>{
  const missing=await missingFiles();
  event.ports[0].postMessage({type:'FC_OFFLINE_STATUS',version:VERSION,
    ready:missing.length===0,count:urls.length,missing:missing.map(s=>new URL(s).pathname)});
  if(missing.length)event.waitUntil(prepareOffline());
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url),scope=new URL(self.registration.scope);
 if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  // Online: fetch a current HTML/JS/CSS file first; never permanently pin old
  // code behind the same ?v= URL. Offline: fall back to the verified cache.
  const isCode=/\.(?:js|css)$/i.test(url.pathname);
  if(req.mode==='navigate'||isCode){
   try{
    const res=await withTimeout(req,isCode?18000:8500);
    if(res.ok){if(isCode||url.pathname===new URL(entry).pathname)await cache.put(req,res.clone());return res;}
   }catch{}
   const saved=await cache.match(req);
   if(saved)return saved;
   if(isCode){
    for(const key of await cache.keys())if(new URL(key.url).pathname===url.pathname)return await cache.match(key);
    return Response.error();
   }
   return await cache.match(entry)||new Response('FixClever ist noch nicht vollständig offline gespeichert.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
  const saved=await cache.match(req);
  if(saved)return saved;
  try{
   const res=await withTimeout(req,18000);
   if(res.ok)await cache.put(req,res.clone());
   return res;
  }catch(e){
   for(const key of await cache.keys())if(new URL(key.url).pathname===url.pathname)return await cache.match(key);
   return Response.error();
  }
 })());
});
