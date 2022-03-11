const cacheName = 'pong game';
const staticAssets = [
    './',
    // html files
    '../index.html',
    '../HTML/home.html',
    '../HTML/selectPage.html',

    //css files
    '../CSS/style.css',
    
    //js files
    '../JS//index.js',
    
    //images file
    '../Images/loginPage.jpg',
    '../Images/ReadyPage.jpg',
    '../Images/medium1.jpg',
    '../Images/PongBackground.png',
    '../Images/PongHard.jpg',
    
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
    'https://code.jquery.com/jquery-3.2.1.slim.min.js',
    'https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js'
];

self.addEventListener('install', async e => {

    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();

});

self.addEventListener('activate', e => {
    self.clients.claim();
});

self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkAndCache(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}
