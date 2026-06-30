const CACHE = 'linkvault-v2';
const ASSETS = ['/', '/site/', '/painel/'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      // addAll falha inteiro se qualquer recurso der erro (ex: 404).
      // Usamos add individual com catch pra não derrubar a instalação do SW
      // por causa de um único asset indisponível.
      Promise.all(ASSETS.map(url => c.add(url).catch(err => console.warn('SW: falha ao cachear', url, err))))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
