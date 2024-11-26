const CACHE_NAME = "Service Worker 0.0.5";
const PROJECT_PATH = "Summer-s-eye-website";
const ASSETS = [
    "/",
    "/index.html",
    "/index_style.css",
    "/js/weather.js",
    "/img/fog.png",
    "/img/heavy-rain.png",
    "/img/lightning.png",
    "/img/rainy.png",
    "/img/showers.png",
    "/img/sun.png",
    "/img/thunderstorm.png",
    "/img/warning.png",
    "/img/icons/icon-192x192.png",
    "/img/icons/icon-512x512.png"
];

// 安裝事件：緩存所需資源
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching assets...");
            const assetsWithPath = ASSETS.map(asset => PROJECT_PATH + asset);
            return cache.addAll(assetsWithPath);
        })
    );
});

// 激活事件：清理舊緩存
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 拦截网络请求
self.addEventListener("fetch", (event) => {
    if (event.request.url.startsWith('http://') || event.request.url.startsWith('https://')) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200) {
                        return networkResponse; // 如果响应不成功，不进行缓存
                      }
                      
                      return caches.open(CACHE_NAME).then((cache) => {
                        // 克隆响应进行缓存
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse; // 返回网络响应
                      }); 
                })
                .catch(()=>{
                    console.log('Network request failed, serving from cache');
                    return caches.match(event.request);
                })
        );
    }else {
        event.respondWith(fetch(event.request));
    }
});
