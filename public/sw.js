const CACHE="donext-v2.11.4";
const ASSETS=["./","./index.html","./manifest.json","./donext-logo-exact.png","./icon-192.png","./icon-512.png","./sw.js"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("donext-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 const r=e.request;
 if(r.method!=="GET")return;
 const u=new URL(r.url);
 if(u.pathname.startsWith("/api/"))return;
 if(r.mode==="navigate"){
  e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy));return res}).catch(()=>caches.match("./index.html")));
 }else{
  e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res})));
 }
});
