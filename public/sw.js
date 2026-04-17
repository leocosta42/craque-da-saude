self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Necessário para que o Chrome considere o PWA "instalável"
  // Mesmo que não façamos cache offline pesado agora, o evento deve existir.
  event.respondWith(fetch(event.request));
});
