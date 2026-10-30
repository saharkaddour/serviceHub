const CACHE_VERSION = "servicehub-next-v1";
const USER_CACHE = "servicehub-user-v1";

const APP_SHELL = ["/", "/offline", "/manifest.webmanifest", "/icons/Icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => undefined))),
    ).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION && key !== USER_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_USER_CACHE") {
    event.waitUntil(caches.delete(USER_CACHE));
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isApiUser =
    url.pathname === "/api/me" || url.pathname === "/api/addresses";

  if (request.mode === "navigate") {
    event.respondWith(navigationFallback(request));
    return;
  }

  if (isApiUser) {
    // Network First with cache fallback for profile/address GET APIs.
    event.respondWith(networkFirst(request, USER_CACHE));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons/") ||
    /\.(png|jpg|jpeg|svg|webp|woff2?|ttf|css)$/i.test(url.pathname)
  ) {
    // Cache First for static assets (JS chunks, icons, fonts, images).
    event.respondWith(cacheFirst(request));
    return;
  }

  if (url.origin === self.location.origin) {
    // Stale-While-Revalidate for other same-origin GET pages.
    event.respondWith(staleWhileRevalidate(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  const cache = await caches.open(CACHE_VERSION);
  cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function navigationFallback(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_VERSION);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (
      (await caches.match("/offline")) ||
      (await caches.match("/")) ||
      Response.error()
    );
  }
}
