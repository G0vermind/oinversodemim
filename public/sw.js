const CACHE_NAME = 'inverso-v2.2';

const PRECACHE_URLS = [
  '/',
  '/poesias',
  '/musicas',
  '/biografia',
  '/contato',
  '/brand/logo-oficial.png',
  '/fonts/EBGaramond-Regular.ttf',
  '/fonts/EBGaramond-Italic.ttf',
  '/fonts/CormorantGaramond-Regular.ttf',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('SW Precache aviso:', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Não intercepta arquivos de áudio (deve permitir range requests nativas do navegador) nem origens externas
  if (
    request.headers.get('range') ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.wav') ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // 1. Assets de Marca (/brand/): Network-First (Garante que logos atualizados reflitam imediatamente)
  if (url.pathname.startsWith('/brand/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 2. Gravuras /art/ e Fontes /fonts/: Cache-First
  if (
    url.pathname.startsWith('/art/') ||
    url.pathname.startsWith('/fonts/')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // 2. Navegação de páginas HTML: Network-First com Fallback resiliente para Cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallbackPoesias = await caches.match('/poesias');
          if (fallbackPoesias) return fallbackPoesias;
          return caches.match('/');
        })
    );
  }
});
