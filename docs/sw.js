/* XTIR placeholder service worker.
   Intentionally empty: removes 404 noise for /sw.js requests. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim()),
);
