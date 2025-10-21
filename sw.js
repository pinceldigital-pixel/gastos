const CACHE_NAME = 'gastos-tracker-v1';
const urlsToCache = [
    '/',
    '/index.html',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/@phosphor-icons/web@2.0.3/dist/phosphor.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalar el Service Worker y cachear los recursos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierta');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting(); // Forzar al nuevo Service Worker a activarse
});

// Activar el Service Worker y limpiar cachés antiguas
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // Tomar control inmediato de las páginas
});

// Interceptar las peticiones de red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el recurso está en la caché, lo devuelve
                if (response) {
                    return response;
                }
                // Si no, lo busca en la red
                return fetch(event.request);
            })
    );
});
