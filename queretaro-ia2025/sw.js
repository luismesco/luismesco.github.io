const CACHE = 'qro-ia2025-ec1c64e63e2c';
const PREFIX = 'qro-ia2025-';
const ASSETS = ["./", "./analisis.pdf", "./app.js", "./evidencia.json", "./evidencia/anexo18-cotejo.webp", "./evidencia/dictamen-175.webp", "./evidencia/dictamen-184.webp", "./evidencia/dictamen-221.webp", "./evidencia/dictamen-233.webp", "./evidencia/dictamen-234.webp", "./evidencia/dictamen-247.webp", "./evidencia/dictamen-250.webp", "./evidencia/dictamen-253.webp", "./evidencia/dictamen-254.webp", "./evidencia/dictamen-259.webp", "./evidencia/dictamen-264.webp", "./evidencia/dictamen-265.webp", "./evidencia/dictamen-271.webp", "./evidencia/dictamen-272.webp", "./evidencia/dictamen-295.webp", "./evidencia/dictamen-298.webp", "./evidencia/dictamen-299.webp", "./evidencia/dictamen-357.webp", "./evidencia/dictamen-37.webp", "./evidencia/dictamen-65.webp", "./evidencia/dictamen-71.webp", "./evidencia/dictamen-96.webp", "./evidencia/resolucion-906.webp", "./evidencia/resolucion-908.webp", "./evidencia/resolucion-957.webp", "./evidencia/resolucion-958.webp", "./evidencia/segunda-vuelta-131.webp", "./ficha.html", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./index.html", "./manifest.webmanifest", "./assets.json"];
const base = new URL('./',self.location.href);
const urls = ASSETS.map(path=>new URL(path,base).href);
async function notify(message){const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});clients.filter(c=>c.url.startsWith(base.href)).forEach(c=>c.postMessage(message));}
async function prepare(clearOnError=false){
 const cache=await caches.open(CACHE);let done=0;
 try{
  for(let start=0;start<urls.length;start+=4){
   await Promise.all(urls.slice(start,start+4).map(async url=>{
    const response=await fetch(new Request(url,{cache:'reload',credentials:'same-origin'}));
    if(!response.ok)throw new Error('No fue posible guardar un recurso.');
    await cache.put(url,response);
    done++;await notify({type:'OFFLINE_PROGRESS',done,total:urls.length});
   }));
  }
  const result=await status();if(!result.complete)throw new Error('Guardado incompleto.');
  await notify({type:'OFFLINE_READY'});return result;
 }catch(error){if(clearOnError)await caches.delete(CACHE);await notify({type:'OFFLINE_ERROR'});throw error;}
}
async function status(){const cache=await caches.open(CACHE);const present=await Promise.all(urls.map(async url=>Boolean(await cache.match(url))));return {complete:present.every(Boolean),saved:present.filter(Boolean).length,total:urls.length};}
self.addEventListener('install',event=>event.waitUntil((async()=>{await prepare(true);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(name=>name.startsWith(PREFIX)&&name!==CACHE).map(name=>caches.delete(name)));await self.clients.claim();await notify({type:'OFFLINE_READY'});})()));
self.addEventListener('message',event=>{
 if(!['STATUS','REPAIR'].includes(event.data?.type))return;
 event.waitUntil((async()=>{try{const result=event.data.type==='REPAIR'?await prepare(false):await status();event.ports[0]?.postMessage(result);}catch(_){event.ports[0]?.postMessage({complete:false});}})());
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(event.request,{ignoreSearch:true});if(cached)return cached;
  try{return await fetch(event.request);}catch(_){
   if(event.request.mode==='navigate')return await cache.match(new URL('./index.html',base).href);
   return new Response('Contenido pendiente de guardar.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
  }
 })());
});
