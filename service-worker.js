const CACHE_VERSION = "20260615-admin-settings";
const SHELL_CACHE = `seaweed-tide-planner-shell-${CACHE_VERSION}`;
const DATA_CACHE = "seaweed-tide-planner-data-v1";
const MAP_TILE_CACHE = "seaweed-tide-planner-map-tiles-v1";

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./admin.html",
  "./admin_settings.html",
  "./locations.html",
  "./map.html",
  "./calibration.html",
  "./importer.html",
  "./observation.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./assets/css/tides.css",
  "./assets/data/locations.js",
  "./assets/data/source_files.js",
  "./assets/data/tide_profiles.js",
  "./assets/icons/tide-planner-icon.svg",
  "./assets/icons/tide-planner-maskable.svg",
  "./assets/vendor/leaflet/leaflet.css",
  "./assets/vendor/leaflet/leaflet.js",
  "./assets/vendor/leaflet/images/layers.png",
  "./assets/vendor/leaflet/images/layers-2x.png",
  "./assets/vendor/leaflet/images/marker-icon.png",
  "./assets/vendor/leaflet/images/marker-icon-2x.png",
  "./assets/vendor/leaflet/images/marker-shadow.png",
  "./assets/js/admin_page.js",
  "./assets/js/calibration_page.js",
  "./assets/js/config.js",
  "./assets/js/disclaimer.js",
  "./assets/js/importer_page_v2.js",
  "./assets/js/language.js",
  "./assets/js/map_page.js",
  "./assets/js/observation_form.js",
  "./assets/js/offline_store.js",
  "./assets/js/pwa.js",
  "./assets/js/tide_charts.js",
  "./assets/js/tide_core.js",
  "./assets/js/tide_data.js",
  "./assets/js/tide_format.js",
  "./assets/js/tide_page.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("seaweed-tide-planner-shell-") && key !== SHELL_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (isMapTileRequest(url)) {
    event.respondWith(cacheFirstMapTile(request));
    return;
  }

  if (isSupabaseReadRequest(url)) {
    event.respondWith(networkFirstData(request));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (shouldBypassCache(url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

function shouldBypassCache(url) {
  const path = url.pathname.split("/").pop() || "";
  return [
    "admin.html",
    "admin_settings.html",
    "calibration.html",
    "index.html",
    "importer.html",
    "locations.html",
    "observation.html",
    "admin_page.js",
    "calibration_page.js",
    "disclaimer.js",
    "importer_page.js",
    "importer_page_v2.js",
    "language.js",
    "map.html",
    "map_page.js",
    "observation_form.js",
    "tide_data.js",
    "tide_page.js",
    "tides.css"
  ].includes(path);
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(SHELL_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    return (
      await caches.match(request, { ignoreSearch: true }) ||
      await caches.match("./offline.html", { ignoreSearch: true })
    );
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  const networkFetch = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(SHELL_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkFetch;
}

async function networkFirstData(request) {
  const cache = await caches.open(DATA_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response("[]", {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}

async function cacheFirstMapTile(request) {
  const cache = await caches.open(MAP_TILE_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok || response.type === "opaque") {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return offlineTileResponse();
  }
}

function isMapTileRequest(url) {
  return /(^|\.)tile\.openstreetmap\.org$/i.test(url.hostname) && /\/\d+\/\d+\/\d+\.png$/i.test(url.pathname);
}

function isSupabaseReadRequest(url) {
  return /\.supabase\.co$/i.test(url.hostname) && url.pathname.includes("/rest/v1/");
}

function offlineTileResponse() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" fill="#eef8f5"/><path d="M0 128h256M128 0v256" stroke="#c9e3dc" stroke-width="1"/><text x="128" y="132" text-anchor="middle" fill="#6f9189" font-family="Arial, sans-serif" font-size="13">offline map tile</text></svg>`;
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store"
    }
  });
}
