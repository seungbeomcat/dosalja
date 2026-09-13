const CACHE="dosaljang-v112-20260913b";
const STATIC_ASSETS=["./dosaljang-profile-v112-clean.png","./dosaljang-preview-20260913-v112-measured.png","./manifest.webmanifest"];
self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC_ASSETS)).catch(()=>{}));
});
self.addEventListener("activate",e=>{
  e.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.mode==="navigate"||r.destination==="document"){
    e.respondWith(fetch(r,{cache:"no-store"}).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{
    const cp=res.clone();
    caches.open(CACHE).then(x=>x.put(r,cp)).catch(()=>{});
    return res;
  })));
});
