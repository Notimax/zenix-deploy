const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const crypto = require("node:crypto");
const { Readable } = require("node:stream");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 4173);
const CANONICAL_HOST = normalizeHostName(process.env.CANONICAL_HOST || "");
const CANONICAL_SCHEME =
  String(process.env.CANONICAL_SCHEME || "https").trim().toLowerCase() === "http" ? "http" : "https";
const REMOTE_API_BASE = "https://api.purstream.co/api/v1";
const PURSTREAM_API_BASE = "https://api.purstream.co/api/v1";
const PURSTREAM_WEB_BASE = "https://purstream.co";
const NAKIOS_BASE = "https://nakios.site";
const NAKIOS_HOST = "nakios.site";
const NAKIOS_API_BASE = "https://api.nakios.site";
const NAKIOS_API_HOST = "api.nakios.site";
const DEFAULT_BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const DEFAULT_ACCEPT_LANGUAGE = "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7";
const NAKIOS_CATALOG_PAGES_PER_FEED = Math.max(
  1,
  toInt(process.env.NAKIOS_CATALOG_PAGES_PER_FEED, 2, 1, 6)
);
const NAKIOS_LOOKUP_CACHE_MS = Math.max(
  60 * 1000,
  Number(process.env.NAKIOS_LOOKUP_CACHE_MS || 30 * 60 * 1000)
);
const NAKIOS_FETCH_HEADERS = {
  Referer: `${NAKIOS_BASE}/`,
  Origin: NAKIOS_BASE,
  "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
};
const NAKIOS_CATALOG_FEEDS = [
  { mediaType: "movie", path: "/api/movies/popular" },
  { mediaType: "movie", path: "/api/movies/trending" },
  { mediaType: "movie", path: "/api/movies/upcoming" },
  { mediaType: "movie", path: "/api/movies/top-rated" },
  { mediaType: "tv", path: "/api/series/popular" },
  { mediaType: "tv", path: "/api/series/trending" },
  { mediaType: "tv", path: "/api/series/top-rated" },
];
const PIDOOV_BASE = "https://pidoov.com";
const PIDOOV_HOST = "pidoov.com";
const PIDOOV_HOME_PATH = "/xv5lzk";
const PIDOOV_CATEGORY_IDS = [29, 1, 4, 6, 7, 8, 9, 10, 11, 12, 2, 26, 3];
const PIDOOV_INDEX_CACHE_MS = Math.max(5 * 60 * 1000, Number(process.env.PIDOOV_INDEX_CACHE_MS || 45 * 60 * 1000));
const PIDOOV_LOOKUP_CACHE_MS = Math.max(3 * 60 * 1000, Number(process.env.PIDOOV_LOOKUP_CACHE_MS || 25 * 60 * 1000));
const PIDOOV_DETAIL_CACHE_MS = Math.max(3 * 60 * 1000, Number(process.env.PIDOOV_DETAIL_CACHE_MS || 30 * 60 * 1000));
const PIDOOV_MAX_PAGES_PER_CATEGORY = Math.max(
  1,
  toInt(process.env.PIDOOV_MAX_PAGES_PER_CATEGORY, 25, 1, 120)
);
const PIDOOV_BOOTSTRAP_PAGES_PER_CATEGORY = Math.max(
  1,
  Math.min(
    PIDOOV_MAX_PAGES_PER_CATEGORY,
    toInt(process.env.PIDOOV_BOOTSTRAP_PAGES_PER_CATEGORY, 2, 1, 20)
  )
);
const PIDOOV_FETCH_CONCURRENCY = Math.max(1, toInt(process.env.PIDOOV_FETCH_CONCURRENCY, 4, 1, 8));
const PIDOOV_MAX_MATCH_CANDIDATES = Math.max(
  1,
  toInt(process.env.PIDOOV_MAX_MATCH_CANDIDATES, 3, 1, 6)
);
const PIDOOV_FETCH_HEADERS = {
  Referer: `${PIDOOV_BASE}/`,
  "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
};
const NOTARIELLES_BASE = "https://notarielles.fr";
const NOTARIELLES_HOST = "notarielles.fr";
const NOTARIELLES_SITEMAP_INDEX_URL = `${NOTARIELLES_BASE}/sitemaps.xml`;
const NOTARIELLES_INDEX_CACHE_MS = Math.max(
  5 * 60 * 1000,
  Number(process.env.NOTARIELLES_INDEX_CACHE_MS || 30 * 60 * 1000)
);
const NOTARIELLES_SEARCH_CACHE_MS = Math.max(
  60 * 1000,
  Number(process.env.NOTARIELLES_SEARCH_CACHE_MS || 15 * 60 * 1000)
);
const NOTARIELLES_PAGE_CACHE_MS = Math.max(
  60 * 1000,
  Number(process.env.NOTARIELLES_PAGE_CACHE_MS || 20 * 60 * 1000)
);
const NOTARIELLES_MAX_SITEMAPS = Math.max(1, toInt(process.env.NOTARIELLES_MAX_SITEMAPS, 40, 1, 80));
const NOTARIELLES_PAGE_PROBE_COUNT = Math.max(2, toInt(process.env.NOTARIELLES_PAGE_PROBE_COUNT, 8, 2, 24));
const NOTARIELLES_FETCH_CONCURRENCY = Math.max(
  1,
  toInt(process.env.NOTARIELLES_FETCH_CONCURRENCY, 4, 1, 8)
);
const NOTARIELLES_MAX_MATCH_CANDIDATES = Math.max(
  1,
  toInt(process.env.NOTARIELLES_MAX_MATCH_CANDIDATES, 3, 1, 6)
);
const NOTARIELLES_SEED_PATHS = ["/", "/series-en-streaming/", "/categorie-series/series-VF/", "/categorie-series/series-VOSTFR/"];
const NOTARIELLES_FETCH_HEADERS = {
  Referer: `${NOTARIELLES_BASE}/`,
  "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
};
const RENDEZVOUS_BASE = "https://rendezvousmusical.fr";
const RENDEZVOUS_HOST = "rendezvousmusical.fr";
const RENDEZVOUS_SITEMAP_INDEX_URL = `${RENDEZVOUS_BASE}/sitemaps.xml`;
const RENDEZVOUS_INDEX_CACHE_MS = Math.max(
  5 * 60 * 1000,
  Number(process.env.RENDEZVOUS_INDEX_CACHE_MS || 30 * 60 * 1000)
);
const RENDEZVOUS_SEARCH_CACHE_MS = Math.max(
  60 * 1000,
  Number(process.env.RENDEZVOUS_SEARCH_CACHE_MS || 15 * 60 * 1000)
);
const RENDEZVOUS_PAGE_CACHE_MS = Math.max(
  60 * 1000,
  Number(process.env.RENDEZVOUS_PAGE_CACHE_MS || 20 * 60 * 1000)
);
const RENDEZVOUS_MAX_SITEMAPS = Math.max(1, toInt(process.env.RENDEZVOUS_MAX_SITEMAPS, 40, 1, 90));
const RENDEZVOUS_PAGE_PROBE_COUNT = Math.max(2, toInt(process.env.RENDEZVOUS_PAGE_PROBE_COUNT, 10, 2, 30));
const RENDEZVOUS_FETCH_CONCURRENCY = Math.max(
  1,
  toInt(process.env.RENDEZVOUS_FETCH_CONCURRENCY, 4, 1, 8)
);
const RENDEZVOUS_MAX_MATCH_CANDIDATES = Math.max(
  1,
  toInt(process.env.RENDEZVOUS_MAX_MATCH_CANDIDATES, 4, 1, 8)
);
const RENDEZVOUS_SEED_PATHS = ["/", "/films-gratuit/", "/telecharger-series/", "/page/2/"];
const RENDEZVOUS_FETCH_HEADERS = {
  Referer: `${RENDEZVOUS_BASE}/`,
  "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
};
const SUPPLEMENTAL_CATALOG_CACHE_MS = Math.max(
  60 * 1000,
  Number(process.env.SUPPLEMENTAL_CATALOG_CACHE_MS || 20 * 60 * 1000)
);
const SUPPLEMENTAL_CATALOG_PAGE_SIZE = Math.max(
  20,
  toInt(process.env.SUPPLEMENTAL_CATALOG_PAGE_SIZE, 84, 20, 180)
);
const SUPPLEMENTAL_CALENDAR_LIMIT = Math.max(
  20,
  toInt(process.env.SUPPLEMENTAL_CALENDAR_LIMIT, 180, 20, 360)
);
const SUPPLEMENTAL_COVER_CACHE_MS = Math.max(
  5 * 60 * 1000,
  Number(process.env.SUPPLEMENTAL_COVER_CACHE_MS || 8 * 60 * 60 * 1000)
);
const SUPPLEMENTAL_COVER_EMPTY_CACHE_MS = Math.max(
  60 * 1000,
  Number(process.env.SUPPLEMENTAL_COVER_EMPTY_CACHE_MS || 20 * 60 * 1000)
);
const SUPPLEMENTAL_COVER_FETCH_CONCURRENCY = Math.max(
  1,
  toInt(process.env.SUPPLEMENTAL_COVER_FETCH_CONCURRENCY, 4, 1, 8)
);
const SUPPLEMENTAL_COVER_MAX_PER_RESPONSE = Math.max(
  6,
  toInt(process.env.SUPPLEMENTAL_COVER_MAX_PER_RESPONSE, 36, 6, 120)
);
const NAKIOS_AVAILABILITY_CACHE_MS = Math.max(
  5 * 60 * 1000,
  Number(process.env.NAKIOS_AVAILABILITY_CACHE_MS || 20 * 60 * 1000)
);
const NAKIOS_AVAILABILITY_PROBE_CONCURRENCY = Math.max(
  1,
  toInt(process.env.NAKIOS_AVAILABILITY_PROBE_CONCURRENCY, 6, 1, 12)
);
const NAKIOS_AVAILABILITY_MAX_PROBES_PER_RESPONSE = Math.max(
  12,
  toInt(process.env.NAKIOS_AVAILABILITY_MAX_PROBES_PER_RESPONSE, 72, 12, 180)
);
const NAKIOS_PENDING_SOON_GRACE_MS = Math.max(
  60 * 60 * 1000,
  Number(process.env.NAKIOS_PENDING_SOON_GRACE_MS || 6 * 60 * 60 * 1000)
);
const ANIME_PLANNING_URL = "https://anime-sama.tv/planning/";
const ANIME_SAMA_BASE = "https://anime-sama.to";
const ANIME_SAMA_SEARCH_ENDPOINT = `${ANIME_SAMA_BASE}/template-php/defaut/fetch.php`;
const PROXY_TIMEOUT_MS = 16000;
const CALENDAR_CACHE_MS = 6 * 60 * 1000;
const ANIME_SIBNET_CACHE_MS = 12 * 60 * 1000;
const ZENIX_OWNED_SOURCES_CACHE_MS = 5000;
const WEBHOOK_TIMEOUT_MS = 10000;
const DISCORD_WEBHOOK_FALLBACK_B64 =
  "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ3OTI2OTg4ODM3OTA2MDMxNi9ISGRVbTVYZkhpeENPXy0yRUhXYXJ1SjJDcHIweXl1eWdHNkRWLVp4Y0JLQWg4N0RNRzNvNnYzbTQzd29VMmZwenpBUw==";
const DISCORD_WEBHOOK_URL = resolveDiscordWebhookUrl();
const DISCORD_WEBHOOK_CANDIDATES = buildDiscordWebhookCandidates(DISCORD_WEBHOOK_URL);
const DISCORD_PUSH_INTERVAL_MS = Math.max(10000, Number(process.env.DISCORD_PUSH_INTERVAL_MS || 10 * 1000));
const DISCORD_CREATE_BACKOFF_MS = Math.max(
  30000,
  Number(process.env.DISCORD_CREATE_BACKOFF_MS || 3 * 60 * 1000)
);
const FORWARD_CLIENT_IP_TO_UPSTREAM =
  String(process.env.FORWARD_CLIENT_IP_TO_UPSTREAM || "").trim() === "1";
const ANALYTICS_RETENTION_MS = 24 * 60 * 60 * 1000;
const ANALYTICS_ACTIVE_WINDOW_MS = 2 * 60 * 1000;
const ANALYTICS_MIN_EVENT_MS = 10 * 1000;
const ANALYTICS_GEO_CACHE_MS = Math.max(
  15 * 60 * 1000,
  Number(process.env.ANALYTICS_GEO_CACHE_MS || 6 * 60 * 60 * 1000)
);
const ANALYTICS_GEO_TIMEOUT_MS = Math.max(800, Number(process.env.ANALYTICS_GEO_TIMEOUT_MS || 2500));
const ANALYTICS_GEO_ENABLED = String(process.env.ANALYTICS_GEO_ENABLED || "1").trim() !== "0";
const ANALYTICS_IP_LIST_EMBED_CHARS = Math.max(
  1200,
  Math.min(3900, Number(process.env.ANALYTICS_IP_LIST_EMBED_CHARS || 3600))
);
const ANALYTICS_IP_LIST_MAX_LINES = Math.max(20, Number(process.env.ANALYTICS_IP_LIST_MAX_LINES || 400));
const SUGGESTIONS_EMAIL_TO =
  normalizeSuggestionEmail(process.env.SUGGESTIONS_EMAIL_TO || "seekosint@gmail.com") || "seekosint@gmail.com";
const SUGGESTIONS_RELAY_BASE = String(process.env.SUGGESTIONS_RELAY_BASE || "https://formsubmit.co/ajax")
  .trim()
  .replace(/\/+$/, "");
const SUGGESTIONS_RATE_LIMIT_MS = Math.max(5000, Number(process.env.SUGGESTIONS_RATE_LIMIT_MS || 45 * 1000));
const SUGGESTIONS_MAX_MESSAGE_CHARS = Math.max(300, Number(process.env.SUGGESTIONS_MAX_MESSAGE_CHARS || 1600));
const SUGGESTIONS_MIN_MESSAGE_CHARS = Math.max(8, Number(process.env.SUGGESTIONS_MIN_MESSAGE_CHARS || 12));
const SUGGESTIONS_MIN_SUBMIT_MS = Math.max(500, Number(process.env.SUGGESTIONS_MIN_SUBMIT_MS || 2500));
const SUGGESTIONS_DUPLICATE_TTL_MS = Math.max(
  60 * 1000,
  Number(process.env.SUGGESTIONS_DUPLICATE_TTL_MS || 6 * 60 * 60 * 1000)
);
const HLS_PROXY_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";
const DISCORD_STATS_STATE_FILE = path.join(ROOT, ".discord-stats-state.json");
const ZENIX_OWNED_SOURCES_FILE = path.resolve(
  ROOT,
  path.isAbsolute(String(process.env.ZENIX_OWNED_SOURCES_FILE || "").trim())
    ? String(process.env.ZENIX_OWNED_SOURCES_FILE || "").trim()
    : String(process.env.ZENIX_OWNED_SOURCES_FILE || "zenix-owned-sources.json").trim()
);
const PIDOOV_STATIC_SOURCES_FILE = path.resolve(
  ROOT,
  path.isAbsolute(String(process.env.PIDOOV_STATIC_SOURCES_FILE || "").trim())
    ? String(process.env.PIDOOV_STATIC_SOURCES_FILE || "").trim()
    : String(process.env.PIDOOV_STATIC_SOURCES_FILE || "pidoov-static-sources.json").trim()
);
const NOTARIELLES_STATIC_SOURCES_FILE = path.resolve(
  ROOT,
  path.isAbsolute(String(process.env.NOTARIELLES_STATIC_SOURCES_FILE || "").trim())
    ? String(process.env.NOTARIELLES_STATIC_SOURCES_FILE || "").trim()
    : String(process.env.NOTARIELLES_STATIC_SOURCES_FILE || "notarielles-static-sources.json").trim()
);
const RENDEZVOUS_STATIC_SOURCES_FILE = path.resolve(
  ROOT,
  path.isAbsolute(String(process.env.RENDEZVOUS_STATIC_SOURCES_FILE || "").trim())
    ? String(process.env.RENDEZVOUS_STATIC_SOURCES_FILE || "").trim()
    : String(process.env.RENDEZVOUS_STATIC_SOURCES_FILE || "rendezvous-static-sources.json").trim()
);
const proxyCache = new Map();
const calendarCache = new Map();
const ANIME_SEASONS_CACHE_MS = 1000 * 60 * 20;
const animeSibnetCache = new Map();
const animeSeasonsCache = new Map();
const pidoovDetailCache = new Map();
const pidoovLookupCache = new Map();
const nakiosLookupCache = new Map();
const notariellesPageCache = new Map();
const rendezvousPageCache = new Map();
const zenixOwnedSourcesCache = {
  loadedAt: 0,
  mtimeMs: 0,
  data: {
    movies: {},
    tv: {},
    series: {},
  },
};
const pidoovIndexCache = {
  loadedAt: 0,
  entries: [],
  full: false,
  inFlight: null,
};
const notariellesIndexCache = {
  loadedAt: 0,
  entries: [],
  inFlight: null,
};
const rendezvousIndexCache = {
  loadedAt: 0,
  entries: [],
  inFlight: null,
};
const pidoovStaticCache = {
  loadedAt: 0,
  mtimeMs: 0,
  entries: [],
};
const notariellesStaticCache = {
  loadedAt: 0,
  mtimeMs: 0,
  entries: [],
};
const rendezvousStaticCache = {
  loadedAt: 0,
  mtimeMs: 0,
  entries: [],
};
const supplementalCatalogCache = {
  loadedAt: 0,
  entries: [],
  inFlight: null,
};
const nakiosCatalogCache = {
  loadedAt: 0,
  entries: [],
  inFlight: null,
};
const nakiosAvailabilityCache = new Map();
const nakiosAvailabilityInFlight = new Map();
const supplementalCoverCache = new Map();
const supplementalCoverInFlight = new Map();
const analyticsClients = new Map();
const analyticsEvents = [];
const analyticsGeoCache = new Map();
const analyticsGeoInFlight = new Map();
const suggestionRateLimitMap = new Map();
const suggestionFingerprintMap = new Map();
let analyticsTotalSeen = 0;
let analyticsLastPushAt = 0;
let discordStatsMessageId = "";
let discordNextAllowedAt = 0;
let discordPushInFlight = null;
let discordRateLimitedStreak = 0;
let discordWebhookCandidateIndex = 0;
let discordLastSuccessAt = 0;
let discordLastResult = {
  at: "",
  reason: "startup",
  phase: "idle",
  ok: null,
  status: 0,
  retryAfterMs: 0,
  code: "",
  message: "",
  global: false,
  host: "",
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function safeLocalPath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname);
  const cleaned = decoded.replace(/^\/+/, "");
  const fullPath = path.resolve(ROOT, cleaned);
  if (!fullPath.startsWith(path.resolve(ROOT))) {
    return null;
  }
  return fullPath;
}

function normalizeHostName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
}

function shouldBypassCanonicalRedirect(hostname) {
  const safe = normalizeHostName(hostname);
  if (!safe) {
    return true;
  }
  return safe === "localhost" || safe === "127.0.0.1" || safe === "::1" || safe.endsWith(".localhost");
}

function maybeRedirectToCanonical(req, res, requestUrl) {
  if (!CANONICAL_HOST) {
    return false;
  }

  const method = String(req.method || "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return false;
  }

  if (String(requestUrl.pathname || "").startsWith("/api/")) {
    return false;
  }

  const accept = String(req.headers.accept || "").toLowerCase();
  if (!accept.includes("text/html")) {
    return false;
  }

  const requestHost = normalizeHostName(requestUrl.hostname || req.headers.host || "");
  if (shouldBypassCanonicalRedirect(requestHost)) {
    return false;
  }
  if (requestHost === CANONICAL_HOST) {
    return false;
  }

  const location = `${CANONICAL_SCHEME}://${CANONICAL_HOST}${requestUrl.pathname}${requestUrl.search}`;
  res.writeHead(308, {
    Location: location,
    "Cache-Control": "no-cache",
  });
  res.end();
  return true;
}

function send404(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
}

function sendJson(res, statusCode, payload) {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache",
  });
  res.end(body);
}

function sanitizeToken(value, maxLength = 80) {
  return String(value || "")
    .trim()
    .replace(/[^\w\-./:@ ]+/g, "")
    .slice(0, maxLength);
}

function normalizeSuggestionEmail(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return "";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    return "";
  }
  return raw.slice(0, 180);
}

function sanitizeSuggestionText(value, maxLength = 1600) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[^\x09\x0A\x20-\x7E]/g, " ")
    .trim()
    .slice(0, Math.max(0, Number(maxLength) || 0));
}

function normalizeSuggestionType(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "content" || raw === "add" || raw === "ajout") {
    return "content";
  }
  return "improve";
}

function suggestionTypeLabel(value) {
  return normalizeSuggestionType(value) === "content" ? "Ajout film/serie/anime" : "Amelioration du site";
}

function buildSuggestionsRelayUrl() {
  if (!SUGGESTIONS_RELAY_BASE || !SUGGESTIONS_EMAIL_TO) {
    return "";
  }
  return `${SUGGESTIONS_RELAY_BASE}/${encodeURIComponent(SUGGESTIONS_EMAIL_TO)}`;
}

function checkSuggestionRateLimit(ip, now = Date.now()) {
  const key = sanitizeToken(ip, 80) || "unknown";
  const last = Number(suggestionRateLimitMap.get(key) || 0);
  if (now - last < SUGGESTIONS_RATE_LIMIT_MS) {
    return {
      limited: true,
      retryAfterMs: Math.max(0, SUGGESTIONS_RATE_LIMIT_MS - (now - last)),
    };
  }
  suggestionRateLimitMap.set(key, now);
  const staleBefore = now - SUGGESTIONS_RATE_LIMIT_MS * 12;
  for (const [entryKey, entryValue] of suggestionRateLimitMap.entries()) {
    if (Number(entryValue || 0) < staleBefore) {
      suggestionRateLimitMap.delete(entryKey);
    }
  }
  return { limited: false, retryAfterMs: 0 };
}

function buildSuggestionFingerprint(payload) {
  const raw = JSON.stringify(payload || {});
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function checkSuggestionDuplicate(fingerprint, now = Date.now()) {
  const key = String(fingerprint || "").trim();
  if (!key) {
    return { duplicate: false, retryAfterMs: 0 };
  }

  const staleBefore = now - SUGGESTIONS_DUPLICATE_TTL_MS * 2;
  for (const [entryKey, entryValue] of suggestionFingerprintMap.entries()) {
    if (Number(entryValue || 0) < staleBefore) {
      suggestionFingerprintMap.delete(entryKey);
    }
  }

  const last = Number(suggestionFingerprintMap.get(key) || 0);
  if (last > 0 && now - last < SUGGESTIONS_DUPLICATE_TTL_MS) {
    return {
      duplicate: true,
      retryAfterMs: Math.max(0, SUGGESTIONS_DUPLICATE_TTL_MS - (now - last)),
    };
  }
  return { duplicate: false, retryAfterMs: 0 };
}

function rememberSuggestionFingerprint(fingerprint, now = Date.now()) {
  const key = String(fingerprint || "").trim();
  if (!key) {
    return;
  }
  suggestionFingerprintMap.set(key, now);
}

function parseJsonSafe(value) {
  try {
    return JSON.parse(String(value || ""));
  } catch {
    return null;
  }
}

function decodeBase64Utf8(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  try {
    return Buffer.from(raw, "base64").toString("utf8").trim();
  } catch {
    return "";
  }
}

function resolveDiscordWebhookUrl() {
  const fromEnv = String(
    process.env.DISCORD_WEBHOOK_URL ||
      process.env.DISCORD_WEBHOOK ||
      process.env.WEBHOOK_DISCORD_URL ||
      ""
  ).trim();
  if (fromEnv) {
    return fromEnv;
  }

  const fromEnvB64 = decodeBase64Utf8(process.env.DISCORD_WEBHOOK_URL_B64 || "");
  if (fromEnvB64) {
    return fromEnvB64;
  }

  return decodeBase64Utf8(DISCORD_WEBHOOK_FALLBACK_B64);
}

function readDiscordStatsMessageIdFromEnv() {
  const direct = String(
    process.env.DISCORD_STATS_MESSAGE_ID || process.env.DISCORD_STATS_MESSAGE || ""
  ).trim();
  if (/^\d{8,30}$/.test(direct)) {
    return direct;
  }
  const b64 = decodeBase64Utf8(process.env.DISCORD_STATS_MESSAGE_ID_B64 || "");
  if (/^\d{8,30}$/.test(b64)) {
    return String(b64 || "").trim();
  }
  return "";
}

function buildDiscordWebhookCandidates(webhookUrl) {
  const base = String(webhookUrl || "").trim();
  if (!base) {
    return [];
  }

  let parsed;
  try {
    parsed = new URL(base);
  } catch {
    return [base];
  }

  if (parsed.protocol !== "https:") {
    return [base];
  }

  const hosts = [parsed.host, "discordapp.com", "ptb.discord.com", "canary.discord.com"];
  const urls = new Set();
  hosts.forEach((host) => {
    const candidate = new URL(parsed.href);
    candidate.host = host;
    urls.add(candidate.toString().replace(/\?wait=true$/i, ""));
  });
  return Array.from(urls);
}

function parseDiscordRetryAfterMs(value) {
  const raw = Number(value);
  if (!Number.isFinite(raw) || raw <= 0) {
    return 0;
  }
  // Discord may return retry-after in seconds (often fractional) or milliseconds.
  if (raw >= 1000) {
    return Math.round(raw);
  }
  if (Number.isInteger(raw) && raw >= 100) {
    return Math.round(raw);
  }
  return Math.round(raw * 1000);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
}

function normalizeIpForAnalytics(value) {
  let raw = String(value || "").trim();
  if (!raw) {
    return "0.0.0.0";
  }
  if (raw.startsWith("[") && raw.includes("]")) {
    raw = raw.slice(1, raw.indexOf("]"));
  }
  raw = raw.replace(/^::ffff:/i, "");
  if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(raw)) {
    raw = raw.replace(/:\d+$/, "");
  }
  const zoneSep = raw.indexOf("%");
  if (zoneSep > 0) {
    raw = raw.slice(0, zoneSep);
  }
  if (raw === "::1") {
    return "127.0.0.1";
  }
  return raw || "0.0.0.0";
}

function getRemoteAddress(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded)
    ? String(forwarded[0] || "")
    : String(forwarded || "");
  const forwardedIp = firstForwarded.split(",")[0].trim();
  const raw = forwardedIp || String(req.socket?.remoteAddress || "");
  return normalizeIpForAnalytics(raw);
}

function isPublicIpAddress(value) {
  const raw = normalizeIpForAnalytics(value);
  if (!raw || raw === "0.0.0.0" || raw === "127.0.0.1" || raw === "::1") {
    return false;
  }

  if (raw.includes(":")) {
    const lower = raw.toLowerCase();
    if (lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80:")) {
      return false;
    }
    return true;
  }

  const parts = raw.split(".");
  if (parts.length !== 4) {
    return false;
  }
  const octets = parts.map((entry) => Number(entry));
  if (octets.some((entry) => !Number.isInteger(entry) || entry < 0 || entry > 255)) {
    return false;
  }

  const [a, b] = octets;
  if (a === 10 || a === 127 || a === 0) {
    return false;
  }
  if (a === 169 && b === 254) {
    return false;
  }
  if (a === 192 && b === 168) {
    return false;
  }
  if (a === 172 && b >= 16 && b <= 31) {
    return false;
  }
  return true;
}

function isUnsafeTargetHost(hostname) {
  const raw = String(hostname || "").trim().toLowerCase();
  if (!raw) {
    return true;
  }
  if (raw === "localhost" || raw === "::1") {
    return true;
  }
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(raw)) {
    const parts = raw.split(".").map((entry) => Number(entry));
    if (parts.some((entry) => !Number.isInteger(entry) || entry < 0 || entry > 255)) {
      return true;
    }
    const [a, b] = parts;
    if (a === 10 || a === 127 || a === 0) {
      return true;
    }
    if (a === 169 && b === 254) {
      return true;
    }
    if (a === 192 && b === 168) {
      return true;
    }
    if (a === 172 && b >= 16 && b <= 31) {
      return true;
    }
  }
  if (raw.includes(":")) {
    if (raw.startsWith("fe80:") || raw.startsWith("fc") || raw.startsWith("fd")) {
      return true;
    }
  }
  return false;
}

function pickTopCountKey(map) {
  if (!(map instanceof Map) || map.size === 0) {
    return "";
  }
  return Array.from(map.entries())
    .sort((left, right) => {
      const delta = Number(right[1] || 0) - Number(left[1] || 0);
      if (delta !== 0) {
        return delta;
      }
      return String(left[0] || "").localeCompare(String(right[0] || ""), "fr");
    })[0]?.[0] || "";
}

function parseDeviceClassFromUA(userAgent) {
  const ua = String(userAgent || "").toLowerCase();
  if (!ua) {
    return "Autre";
  }
  if (/(bot|spider|crawler|crawl|slurp|bingpreview|mediapartners-google|facebookexternalhit|whatsapp)/i.test(ua)) {
    return "Bot";
  }
  if (
    /(ipad|tablet|kindle|silk|playbook|nexus 7|nexus 9|sm-t\d+|lenovo tab|tab \d|xoom)/i.test(ua) ||
    (/android/i.test(ua) && !/mobile/i.test(ua))
  ) {
    return "Tablette";
  }
  if (/(iphone|ipod|android.*mobile|windows phone|blackberry|iemobile|mobile)/i.test(ua)) {
    return "Telephone";
  }
  return "PC";
}

function parsePlatformFromUA(userAgent) {
  const ua = String(userAgent || "").toLowerCase();
  if (!ua) {
    return "Inconnu";
  }
  if (/windows nt/i.test(ua)) {
    return "Windows";
  }
  if (/(ipad|iphone|ipod)/i.test(ua)) {
    return "iOS";
  }
  if (/android/i.test(ua)) {
    return "Android";
  }
  if (/macintosh/i.test(ua) && /mobile/i.test(ua)) {
    return "iOS";
  }
  if (/cros/i.test(ua)) {
    return "ChromeOS";
  }
  if (/macintosh|mac os x/i.test(ua)) {
    return "macOS";
  }
  if (/linux/i.test(ua)) {
    return "Linux";
  }
  return "Autre";
}

function parseBrowserFromUA(userAgent) {
  const ua = String(userAgent || "");
  if (!ua) {
    return "Inconnu";
  }
  if (/Edg\/\d+/i.test(ua)) {
    return "Edge";
  }
  if (/OPR\/\d+|Opera\/\d+/i.test(ua)) {
    return "Opera";
  }
  if (/Firefox\/\d+/i.test(ua)) {
    return "Firefox";
  }
  if (/CriOS\/\d+|Chrome\/\d+/i.test(ua) && !/Edg\/|OPR\/|Opera\//i.test(ua)) {
    return "Chrome";
  }
  if (/Safari\/\d+/i.test(ua) && !/Chrome\/|CriOS\/|Edg\/|OPR\/|Opera\//i.test(ua)) {
    return "Safari";
  }
  return "Autre";
}

function parseUaProfile(userAgent) {
  const safeUa = sanitizeToken(String(userAgent || ""), 240);
  return {
    userAgent: safeUa,
    deviceClass: parseDeviceClassFromUA(safeUa),
    platform: parsePlatformFromUA(safeUa),
    browser: parseBrowserFromUA(safeUa),
  };
}

function readCachedGeoForIp(ip, now = Date.now()) {
  const safeIp = normalizeIpForAnalytics(ip);
  if (!safeIp || !isPublicIpAddress(safeIp)) {
    return {
      countryCode: "LAN",
      countryName: "Local",
    };
  }
  const cached = analyticsGeoCache.get(safeIp);
  if (!cached || Number(cached.expiresAt || 0) < now) {
    return null;
  }
  return {
    countryCode: sanitizeToken(cached.countryCode || "??", 8) || "??",
    countryName: sanitizeToken(cached.countryName || "Inconnu", 80) || "Inconnu",
  };
}

function writeCachedGeoForIp(ip, geo, now = Date.now()) {
  const safeIp = normalizeIpForAnalytics(ip);
  if (!safeIp || !isPublicIpAddress(safeIp)) {
    return;
  }
  const countryCode = sanitizeToken(String(geo?.countryCode || "").toUpperCase(), 8) || "??";
  const countryName = sanitizeToken(String(geo?.countryName || ""), 80) || "Inconnu";
  analyticsGeoCache.set(safeIp, {
    countryCode,
    countryName,
    expiresAt: now + ANALYTICS_GEO_CACHE_MS,
  });
  if (analyticsGeoCache.size > 3000) {
    const oldest = Array.from(analyticsGeoCache.entries()).sort(
      (left, right) => Number(left?.[1]?.expiresAt || 0) - Number(right?.[1]?.expiresAt || 0)
    );
    oldest.slice(0, analyticsGeoCache.size - 3000).forEach(([key]) => analyticsGeoCache.delete(key));
  }
}

function applyGeoToAnalyticsRows(ip, geo) {
  const safeIp = normalizeIpForAnalytics(ip);
  if (!safeIp || !geo) {
    return;
  }
  const countryCode = sanitizeToken(String(geo.countryCode || "").toUpperCase(), 8) || "??";
  const countryName = sanitizeToken(String(geo.countryName || ""), 80) || "Inconnu";
  for (const row of analyticsClients.values()) {
    if (String(row?.ip || "") !== safeIp) {
      continue;
    }
    row.countryCode = countryCode;
    row.countryName = countryName;
  }
}

async function resolveGeoForIp(ip) {
  const safeIp = normalizeIpForAnalytics(ip);
  if (!safeIp || !ANALYTICS_GEO_ENABLED || !isPublicIpAddress(safeIp)) {
    return {
      countryCode: "LAN",
      countryName: "Local",
    };
  }

  const cached = readCachedGeoForIp(safeIp);
  if (cached) {
    return cached;
  }
  if (analyticsGeoInFlight.has(safeIp)) {
    return analyticsGeoInFlight.get(safeIp);
  }

  const task = (async () => {
    const targets = [
      {
        url: `https://ipwho.is/${encodeURIComponent(safeIp)}?fields=success,country,country_code`,
        parse: (body) => {
          if (!body || body.success === false) {
            return null;
          }
          return {
            countryCode: sanitizeToken(String(body.country_code || "").toUpperCase(), 8) || "",
            countryName: sanitizeToken(String(body.country || ""), 80) || "",
          };
        },
      },
      {
        url: `https://ipapi.co/${encodeURIComponent(safeIp)}/json/`,
        parse: (body) => {
          if (!body || String(body.error || "").toLowerCase() === "true") {
            return null;
          }
          return {
            countryCode: sanitizeToken(String(body.country_code || "").toUpperCase(), 8) || "",
            countryName: sanitizeToken(String(body.country_name || ""), 80) || "",
          };
        },
      },
      {
        url: `https://ipinfo.io/${encodeURIComponent(safeIp)}/json`,
        parse: (body) => {
          if (!body) {
            return null;
          }
          return {
            countryCode: sanitizeToken(String(body.country || "").toUpperCase(), 8) || "",
            countryName: sanitizeToken(String(body.country_name || ""), 80) || "",
          };
        },
      },
    ];

    for (const candidate of targets) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ANALYTICS_GEO_TIMEOUT_MS);
      try {
        const response = await fetch(candidate.url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "ZenixStream/1.0 (+analytics-geo)",
          },
          signal: controller.signal,
        });
        if (!response.ok) {
          continue;
        }
        let body = null;
        try {
          body = await response.json();
        } catch {
          body = null;
        }
        const parsed = candidate.parse(body);
        if (!parsed) {
          continue;
        }
        const countryCode = sanitizeToken(String(parsed.countryCode || "").toUpperCase(), 8) || "";
        const countryName = sanitizeToken(String(parsed.countryName || ""), 80) || "";
        if (!countryCode && !countryName) {
          continue;
        }
        const result = {
          countryCode: countryCode || "??",
          countryName: countryName || "Inconnu",
        };
        writeCachedGeoForIp(safeIp, result);
        return result;
      } catch {
        // try next provider
      } finally {
        clearTimeout(timeoutId);
      }
    }

    const fallback = { countryCode: "??", countryName: "Inconnu" };
    writeCachedGeoForIp(safeIp, fallback);
    return fallback;
  })();

  analyticsGeoInFlight.set(safeIp, task);
  try {
    return await task;
  } finally {
    analyticsGeoInFlight.delete(safeIp);
  }
}

function parseSafeRemoteUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return null;
  }
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  const protocol = String(parsed.protocol || "").toLowerCase();
  if (protocol !== "http:" && protocol !== "https:") {
    return null;
  }
  if (isUnsafeTargetHost(parsed.hostname)) {
    return null;
  }
  return parsed;
}

function readJsonBody(req, maxBytes = 8192) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", (error) => reject(error));
  });
}

function pruneAnalytics(now = Date.now()) {
  const threshold = now - ANALYTICS_RETENTION_MS;
  while (analyticsEvents.length > 0 && analyticsEvents[0] < threshold) {
    analyticsEvents.shift();
  }
  for (const [key, row] of analyticsClients.entries()) {
    if (Number(row?.lastSeen || 0) < threshold) {
      analyticsClients.delete(key);
    }
  }
  for (const [ip, geo] of analyticsGeoCache.entries()) {
    if (Number(geo?.expiresAt || 0) < now) {
      analyticsGeoCache.delete(ip);
    }
  }
}

function markAnalyticsHeartbeat(req, payload) {
  const now = Date.now();
  pruneAnalytics(now);

  const clientId = sanitizeToken(payload?.clientId, 64) || "guest";
  const page = sanitizeToken(payload?.page, 140);
  const ip = sanitizeToken(normalizeIpForAnalytics(getRemoteAddress(req)), 60);
  const key = `${clientId}@${ip}`;
  const uaProfile = parseUaProfile(req.headers["user-agent"] || payload?.ua || "");
  const cachedGeo = readCachedGeoForIp(ip, now);

  let row = analyticsClients.get(key);
  if (!row) {
    row = {
      clientId,
      ip,
      firstSeen: now,
      lastSeen: now,
      lastEventAt: 0,
      page: "",
      view: "",
      userAgent: "",
      deviceClass: "Autre",
      platform: "Inconnu",
      browser: "Inconnu",
      countryCode: "??",
      countryName: "Inconnu",
    };
    analyticsTotalSeen += 1;
  }

  row.clientId = clientId;
  row.ip = ip;
  row.lastSeen = now;
  if (page) {
    row.page = page;
  }
  const view = sanitizeToken(payload?.view, 48);
  if (view) {
    row.view = view;
  }
  row.userAgent = uaProfile.userAgent;
  row.deviceClass = uaProfile.deviceClass;
  row.platform = uaProfile.platform;
  row.browser = uaProfile.browser;
  if (cachedGeo) {
    row.countryCode = cachedGeo.countryCode;
    row.countryName = cachedGeo.countryName;
  } else if (!isPublicIpAddress(ip)) {
    row.countryCode = "LAN";
    row.countryName = "Local";
  }

  if (now - Number(row.lastEventAt || 0) >= ANALYTICS_MIN_EVENT_MS) {
    row.lastEventAt = now;
    analyticsEvents.push(now);
  }
  analyticsClients.set(key, row);

  if (!cachedGeo && ANALYTICS_GEO_ENABLED && isPublicIpAddress(ip)) {
    resolveGeoForIp(ip)
      .then((geo) => {
        applyGeoToAnalyticsRows(ip, geo);
      })
      .catch(() => {
        // best effort only
      });
  }
}

function sortCountMapDesc(map, limit = 9999) {
  return Array.from(map.entries())
    .sort((left, right) => {
      const delta = Number(right[1] || 0) - Number(left[1] || 0);
      if (delta !== 0) {
        return delta;
      }
      return String(left[0] || "").localeCompare(String(right[0] || ""), "fr");
    })
    .slice(0, Math.max(1, Number(limit || 0)));
}

function incCount(map, key, amount = 1) {
  if (!(map instanceof Map)) {
    return;
  }
  const safeKey = sanitizeToken(String(key || ""), 80);
  if (!safeKey) {
    return;
  }
  map.set(safeKey, Number(map.get(safeKey) || 0) + Number(amount || 0));
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

function buildAnalyticsSnapshot() {
  const now = Date.now();
  pruneAnalytics(now);
  const activeThreshold = now - ANALYTICS_ACTIVE_WINDOW_MS;
  const rows24h = Array.from(analyticsClients.values());
  const activeRows = rows24h.filter((row) => Number(row?.lastSeen || 0) >= activeThreshold);

  const devicesActive = new Map();
  const platformsActive = new Map();
  const browsersActive = new Map();
  const pagesActive = new Map();

  const ipActiveMap = new Map();
  const ip24hMap = new Map();

  const mergeIpRow = (targetMap, row) => {
    const ip = sanitizeToken(row?.ip || "", 60);
    if (!ip) {
      return;
    }
    const current = targetMap.get(ip) || {
      ip,
      firstSeen: Number(row?.firstSeen || now),
      lastSeen: Number(row?.lastSeen || now),
      clientCount: 0,
      countryCode: "??",
      countryName: "Inconnu",
      deviceCounts: new Map(),
      platformCounts: new Map(),
      browserCounts: new Map(),
      pageCounts: new Map(),
    };
    current.firstSeen = Math.min(current.firstSeen, Number(row?.firstSeen || now));
    current.lastSeen = Math.max(current.lastSeen, Number(row?.lastSeen || now));
    current.clientCount += 1;

    const cachedGeo = readCachedGeoForIp(ip, now);
    const rowCountryCode = sanitizeToken(String(row?.countryCode || "").toUpperCase(), 8);
    const rowCountryName = sanitizeToken(String(row?.countryName || ""), 80);
    const geo = cachedGeo || (rowCountryCode ? { countryCode: rowCountryCode, countryName: rowCountryName } : null);
    if (geo) {
      current.countryCode = sanitizeToken(String(geo.countryCode || "").toUpperCase(), 8) || current.countryCode;
      current.countryName = sanitizeToken(String(geo.countryName || ""), 80) || current.countryName;
    } else if (!isPublicIpAddress(ip)) {
      current.countryCode = "LAN";
      current.countryName = "Local";
    }

    incCount(current.deviceCounts, row?.deviceClass || "Autre", 1);
    incCount(current.platformCounts, row?.platform || "Inconnu", 1);
    incCount(current.browserCounts, row?.browser || "Inconnu", 1);
    if (row?.page) {
      incCount(current.pageCounts, row.page, 1);
    }
    targetMap.set(ip, current);
  };

  rows24h.forEach((row) => {
    mergeIpRow(ip24hMap, row);
  });

  activeRows.forEach((row) => {
    incCount(devicesActive, row?.deviceClass || "Autre", 1);
    incCount(platformsActive, row?.platform || "Inconnu", 1);
    incCount(browsersActive, row?.browser || "Inconnu", 1);
    if (row?.page) {
      incCount(pagesActive, row.page, 1);
    }
    mergeIpRow(ipActiveMap, row);
  });

  const countryActive = new Map();
  const country24h = new Map();
  for (const entry of ipActiveMap.values()) {
    const code = sanitizeToken(String(entry?.countryCode || "").toUpperCase(), 8) || "??";
    const name = sanitizeToken(entry?.countryName || "", 80) || "Inconnu";
    incCount(countryActive, `${code}|${name}`, 1);
  }
  for (const entry of ip24hMap.values()) {
    const code = sanitizeToken(String(entry?.countryCode || "").toUpperCase(), 8) || "??";
    const name = sanitizeToken(entry?.countryName || "", 80) || "Inconnu";
    incCount(country24h, `${code}|${name}`, 1);
  }

  const activeIpRows = Array.from(ipActiveMap.values())
    .sort((left, right) => Number(right?.lastSeen || 0) - Number(left?.lastSeen || 0))
    .map((entry) => {
      const topDevice = pickTopCountKey(entry.deviceCounts) || "Autre";
      const topPlatform = pickTopCountKey(entry.platformCounts) || "Inconnu";
      const topBrowser = pickTopCountKey(entry.browserCounts) || "Inconnu";
      const topPage = pickTopCountKey(entry.pageCounts) || "/";
      return {
        ip: entry.ip,
        firstSeen: Number(entry.firstSeen || now),
        lastSeen: Number(entry.lastSeen || now),
        clientCount: Number(entry.clientCount || 0),
        countryCode: sanitizeToken(String(entry.countryCode || "").toUpperCase(), 8) || "??",
        countryName: sanitizeToken(entry.countryName || "", 80) || "Inconnu",
        device: topDevice,
        platform: topPlatform,
        browser: topBrowser,
        page: topPage,
      };
    });

  const countryRowsActive = sortCountMapDesc(countryActive, 80).map(([rawKey, count]) => {
    const [codeRaw, ...nameParts] = String(rawKey || "").split("|");
    const code = sanitizeToken(codeRaw || "??", 8) || "??";
    const name = sanitizeToken(nameParts.join("|") || "Inconnu", 80) || "Inconnu";
    return {
      code,
      name,
      count: Number(count || 0),
    };
  });

  const countryRows24h = sortCountMapDesc(country24h, 120).map(([rawKey, count]) => {
    const [codeRaw, ...nameParts] = String(rawKey || "").split("|");
    const code = sanitizeToken(codeRaw || "??", 8) || "??";
    const name = sanitizeToken(nameParts.join("|") || "Inconnu", 80) || "Inconnu";
    return {
      code,
      name,
      count: Number(count || 0),
    };
  });

  return {
    generatedAt: new Date(now).toISOString(),
    activeNow: activeRows.length,
    unique24h: analyticsClients.size,
    heartbeats24h: analyticsEvents.length,
    totalSeen: analyticsTotalSeen,
    activeIps: ipActiveMap.size,
    uniqueIps24h: ip24hMap.size,
    countriesActive: countryRowsActive.length,
    countries24h: countryRows24h.length,
    devicesActive: {
      pc: Number(devicesActive.get("PC") || 0),
      telephone: Number(devicesActive.get("Telephone") || 0),
      tablette: Number(devicesActive.get("Tablette") || 0),
      bot: Number(devicesActive.get("Bot") || 0),
      autre: Number(devicesActive.get("Autre") || 0),
    },
    platformsActive: sortCountMapDesc(platformsActive, 16).map(([name, count]) => ({
      name: sanitizeToken(name, 40) || "Inconnu",
      count: Number(count || 0),
    })),
    browsersActive: sortCountMapDesc(browsersActive, 16).map(([name, count]) => ({
      name: sanitizeToken(name, 40) || "Inconnu",
      count: Number(count || 0),
    })),
    pagesActive: sortCountMapDesc(pagesActive, 24).map(([name, count]) => ({
      name: sanitizeToken(name, 140) || "/",
      count: Number(count || 0),
    })),
    countryRowsActive,
    countryRows24h,
    activeIpRows,
    uptimeMs: Math.max(0, process.uptime() * 1000),
    uptimeLabel: formatDuration(process.uptime() * 1000),
  };
}

function loadDiscordStatsState() {
  const envId = readDiscordStatsMessageIdFromEnv();
  if (envId) {
    discordStatsMessageId = envId;
    return;
  }
  try {
    const raw = fs.readFileSync(DISCORD_STATS_STATE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const messageId = String(parsed?.messageId || "").trim();
    if (/^\d{8,30}$/.test(messageId)) {
      discordStatsMessageId = messageId;
      return;
    }
  } catch {
    // no persisted state
  }
  discordStatsMessageId = "";
}

function saveDiscordStatsState() {
  try {
    const payload = JSON.stringify({ messageId: discordStatsMessageId || "" });
    fs.writeFileSync(DISCORD_STATS_STATE_FILE, payload, "utf8");
  } catch {
    // best effort only
  }
}

function countryCodeToFlagEmoji(code) {
  const safe = sanitizeToken(String(code || "").toUpperCase(), 4);
  if (!/^[A-Z]{2}$/.test(safe)) {
    return "🌍";
  }
  const points = safe.split("").map((char) => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...points);
  } catch {
    return "🌍";
  }
}

function joinRankRows(rows, options = {}) {
  const limit = Math.max(1, Number(options.limit || 8));
  const fallback = options.fallback || "Aucune donnee";
  if (!Array.isArray(rows) || rows.length === 0) {
    return fallback;
  }
  return rows
    .slice(0, limit)
    .map((row) => {
      const name = sanitizeToken(row?.name || row?.code || "Inconnu", 80) || "Inconnu";
      return `• ${name}: ${Number(row?.count || 0)}`;
    })
    .join("\n");
}

function buildActiveIpLines(stats) {
  const rows = Array.isArray(stats?.activeIpRows) ? stats.activeIpRows : [];
  if (rows.length === 0) {
    return ["Aucune IP active."];
  }
  return rows.map((entry) => {
    const ip = sanitizeToken(entry?.ip || "0.0.0.0", 64) || "0.0.0.0";
    const code = sanitizeToken(String(entry?.countryCode || "??").toUpperCase(), 8) || "??";
    const country = sanitizeToken(entry?.countryName || "Inconnu", 80) || "Inconnu";
    const device = sanitizeToken(entry?.device || "Autre", 24) || "Autre";
    const platform = sanitizeToken(entry?.platform || "Inconnu", 24) || "Inconnu";
    const browser = sanitizeToken(entry?.browser || "Inconnu", 24) || "Inconnu";
    const page = sanitizeToken(entry?.page || "/", 80) || "/";
    const clients = Number(entry?.clientCount || 0);
    const age = formatDuration(Math.max(0, Date.now() - Number(entry?.lastSeen || 0)));
    return `\`${ip}\` • ${countryCodeToFlagEmoji(code)} ${code}/${country} • ${device} • ${platform}/${browser} • ${clients} client(s) • ${page} • vu il y a ${age}`;
  });
}

function chunkLinesForDiscord(lines, maxChars = ANALYTICS_IP_LIST_EMBED_CHARS) {
  const chunks = [];
  let current = [];
  let currentLen = 0;
  const safeMax = Math.max(1200, Number(maxChars || ANALYTICS_IP_LIST_EMBED_CHARS));
  for (const rawLine of lines) {
    const line = String(rawLine || "").trim();
    if (!line) {
      continue;
    }
    const addLen = line.length + (current.length > 0 ? 1 : 0);
    if (currentLen + addLen > safeMax && current.length > 0) {
      chunks.push(current.join("\n"));
      current = [line];
      currentLen = line.length;
    } else {
      current.push(line);
      currentLen += addLen;
    }
  }
  if (current.length > 0) {
    chunks.push(current.join("\n"));
  }
  return chunks;
}

function buildDiscordStatsEmbeds(stats, reason) {
  const devices = stats?.devicesActive || {};
  const countriesText = (Array.isArray(stats?.countryRowsActive) ? stats.countryRowsActive : [])
    .slice(0, 8)
    .map((entry) => {
      const code = sanitizeToken(String(entry?.code || "??").toUpperCase(), 8) || "??";
      const name = sanitizeToken(entry?.name || "Inconnu", 80) || "Inconnu";
      return `• ${countryCodeToFlagEmoji(code)} ${code}/${name}: ${Number(entry?.count || 0)}`;
    })
    .join("\n") || "Aucun pays detecte";

  const pagesText =
    (Array.isArray(stats?.pagesActive) ? stats.pagesActive : [])
      .slice(0, 6)
      .map((entry) => `• ${sanitizeToken(entry?.name || "/", 90) || "/"}: ${Number(entry?.count || 0)}`)
      .join("\n") || "Aucune page active";

  const mainEmbed = {
    title: "Zenix - Monitor Live",
    description: "Telemetrie nettoyee, enrichie et orientee ops.",
    color: 0xf11424,
    timestamp: stats.generatedAt,
    fields: [
      {
        name: "Actifs maintenant (2 min)",
        value:
          `Clients: **${Number(stats?.activeNow || 0)}**\n` +
          `IP actives: **${Number(stats?.activeIps || 0)}**\n` +
          `Pays actifs: **${Number(stats?.countriesActive || 0)}**`,
        inline: true,
      },
      {
        name: "Fenetre 24h",
        value:
          `Clients uniques: **${Number(stats?.unique24h || 0)}**\n` +
          `IP uniques: **${Number(stats?.uniqueIps24h || 0)}**\n` +
          `Heartbeats: **${Number(stats?.heartbeats24h || 0)}**`,
        inline: true,
      },
      {
        name: "Serveur",
        value:
          `Uptime: **${sanitizeToken(stats?.uptimeLabel || "0s", 32) || "0s"}**\n` +
          `Push: **${Math.max(1, Math.round(DISCORD_PUSH_INTERVAL_MS / 1000))}s**\n` +
          `Raison: **${sanitizeToken(reason || "interval", 20) || "interval"}**`,
        inline: true,
      },
      {
        name: "Appareils actifs",
        value:
          `PC: **${Number(devices.pc || 0)}**\n` +
          `Telephone: **${Number(devices.telephone || 0)}**\n` +
          `Tablette: **${Number(devices.tablette || 0)}**\n` +
          `Bot/Autre: **${Number(devices.bot || 0) + Number(devices.autre || 0)}**`,
        inline: true,
      },
      {
        name: "Plateformes actives",
        value: joinRankRows(stats?.platformsActive, { limit: 8 }),
        inline: true,
      },
      {
        name: "Navigateurs actifs",
        value: joinRankRows(stats?.browsersActive, { limit: 8 }),
        inline: true,
      },
      {
        name: "Pays (IP actives)",
        value: countriesText,
        inline: false,
      },
      {
        name: "Pages actives",
        value: pagesText,
        inline: false,
      },
    ],
    footer: {
      text: reason === "startup" ? "Demarrage service" : "Mise a jour automatique",
    },
  };

  const ipLinesRaw = buildActiveIpLines(stats);
  const cappedLines = ipLinesRaw.slice(0, ANALYTICS_IP_LIST_MAX_LINES);
  let hiddenCount = Math.max(0, ipLinesRaw.length - cappedLines.length);
  const chunks = chunkLinesForDiscord(cappedLines, ANALYTICS_IP_LIST_EMBED_CHARS);
  const ipEmbeds = [];
  const maxIpEmbeds = 9; // Discord limit 10 embeds per message (main + 9 IP embeds)
  chunks.slice(0, maxIpEmbeds).forEach((chunk, index) => {
    ipEmbeds.push({
      title:
        index === 0
          ? `IPs actives (${Number(stats?.activeIps || 0)})`
          : `IPs actives (suite ${index + 1}/${Math.min(chunks.length, maxIpEmbeds)})`,
      description: chunk,
      color: 0x8b0f19,
      timestamp: stats.generatedAt,
    });
  });

  if (chunks.length > maxIpEmbeds) {
    const notShownByEmbedCap = chunks
      .slice(maxIpEmbeds)
      .join("\n")
      .split("\n")
      .filter(Boolean).length;
    hiddenCount += notShownByEmbedCap;
  }
  if (hiddenCount > 0 && ipEmbeds.length > 0) {
    const last = ipEmbeds[ipEmbeds.length - 1];
    const suffix = `\n\n... +${hiddenCount} IP non affichee(s) (limites Discord).`;
    const next = `${String(last.description || "").trim()}${suffix}`;
    last.description = next.slice(0, 4096);
  }

  return [mainEmbed, ...ipEmbeds];
}

function isDiscordWebhookConfigured() {
  return DISCORD_WEBHOOK_URL.startsWith("https://discord.com/api/webhooks/");
}

function setDiscordLastResult(reason, phase, result = {}) {
  const body = result?.body && typeof result.body === "object" ? result.body : null;
  const code = body ? sanitizeToken(body.code, 32) : "";
  const message = body ? sanitizeToken(body.message, 200) : "";
  const host = sanitizeToken(result?.host, 60);
  discordLastResult = {
    at: new Date().toISOString(),
    reason: String(reason || ""),
    phase: String(phase || ""),
    ok: typeof result.ok === "boolean" ? result.ok : null,
    status: Number(result.status || 0),
    retryAfterMs: Math.max(0, Number(result.retryAfterMs || 0)),
    code,
    message,
    global: Boolean(body?.global),
    host,
  };
}

function getDiscordBackoffMs(retryAfterMs = 0) {
  const retry = Math.max(0, Number(retryAfterMs || 0));
  const base = Math.max(15000, DISCORD_PUSH_INTERVAL_MS, retry + 700);
  const multiplier = Math.max(1, Math.min(6, discordRateLimitedStreak));
  return Math.min(15 * 60 * 1000, base * multiplier);
}

async function sendDiscordWebhook(method, payload, options = {}) {
  const messageId = String(options.messageId || "").trim();
  const wait = Boolean(options.wait);
  const baseCandidate =
    DISCORD_WEBHOOK_CANDIDATES[discordWebhookCandidateIndex] ||
    DISCORD_WEBHOOK_CANDIDATES[0] ||
    DISCORD_WEBHOOK_URL;
  const urlBase =
    method === "PATCH" && messageId
      ? `${baseCandidate}/messages/${encodeURIComponent(messageId)}`
      : baseCandidate;
  const target = wait ? `${urlBase}?wait=true` : urlBase;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const response = await fetch(target, {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "ZenixStream/1.0 (+discord-webhook)",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    const headerRetryMs = parseDiscordRetryAfterMs(response.headers.get("retry-after") || 0);
    const bodyRetryMs = parseDiscordRetryAfterMs(body?.retry_after || 0);
    const retryAfterMs = Math.max(0, headerRetryMs, bodyRetryMs);

    return {
      ok: response.ok,
      status: response.status,
      body,
      retryAfterMs,
      host: sanitizeToken(new URL(baseCandidate).host, 60),
    };
  } catch {
    let host = "";
    try {
      host = sanitizeToken(new URL(baseCandidate).host, 60);
    } catch {
      host = "";
    }
    return {
      ok: false,
      status: 0,
      body: null,
      retryAfterMs: 0,
      host,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function sendDiscordWebhookWithRetry(method, payload, options = {}) {
  let last = {
    ok: false,
    status: 0,
    body: null,
    retryAfterMs: 0,
    host: "",
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const result = await sendDiscordWebhook(method, payload, options);
    last = result;
    if (result.ok || result.status !== 429) {
      return result;
    }
    const blockedMessage = String(result?.body?.message || "").toLowerCase();
    if (
      blockedMessage.includes("blocked from accessing our api temporarily") &&
      DISCORD_WEBHOOK_CANDIDATES.length > 1
    ) {
      discordWebhookCandidateIndex = (discordWebhookCandidateIndex + 1) % DISCORD_WEBHOOK_CANDIDATES.length;
    }
    const waitMs = Math.max(450, Math.min(10 * 60 * 1000, Number(result.retryAfterMs || 0) + 180));
    await sleep(waitMs);
  }

  return last;
}

async function pushDiscordStats(reason = "interval") {
  if (discordPushInFlight) {
    return discordPushInFlight;
  }

  const task = (async () => {
  if (!isDiscordWebhookConfigured()) {
    return;
  }

  const now = Date.now();
  const forceSend = reason === "startup" || reason === "manual";
  const staleWindow = Math.max(120000, DISCORD_PUSH_INTERVAL_MS * 6);
  const staleTooLong =
    Number(discordLastSuccessAt || 0) > 0 && now - Number(discordLastSuccessAt || 0) > staleWindow;
  const canBypassBackoff = staleTooLong && discordNextAllowedAt - now > DISCORD_PUSH_INTERVAL_MS;
  if (!forceSend && now < discordNextAllowedAt && !canBypassBackoff) {
    return;
  }
  if (canBypassBackoff) {
    discordNextAllowedAt = 0;
  }
  if (!forceSend && now - analyticsLastPushAt < DISCORD_PUSH_INTERVAL_MS - 1000) {
    return;
  }
  analyticsLastPushAt = now;

  const stats = buildAnalyticsSnapshot();
  const payload = {
    username: "Zenix Monitor",
    allowed_mentions: { parse: [] },
    embeds: buildDiscordStatsEmbeds(stats, reason),
  };

  if (!discordStatsMessageId) {
    loadDiscordStatsState();
  }

  if (discordStatsMessageId) {
    const patched = await sendDiscordWebhookWithRetry("PATCH", payload, {
      messageId: discordStatsMessageId,
      wait: false,
    });
    setDiscordLastResult(reason, "patch", patched);
    if (patched.ok) {
      discordRateLimitedStreak = 0;
      discordLastSuccessAt = now;
      return;
    }
    if (patched.status === 429) {
      discordRateLimitedStreak += 1;
      discordNextAllowedAt = now + getDiscordBackoffMs(patched.retryAfterMs);
    } else if (patched.status > 0) {
      discordRateLimitedStreak = 0;
      discordNextAllowedAt = now + Math.max(DISCORD_PUSH_INTERVAL_MS, 30000);
    }
    if (patched.status === 404 || patched.status === 400 || patched.status === 401 || patched.status === 403) {
      discordStatsMessageId = "";
      saveDiscordStatsState();
    }
  }

  const created = await sendDiscordWebhookWithRetry("POST", payload, { wait: true });
  setDiscordLastResult(reason, "create", created);
  if (created.status === 429) {
    discordRateLimitedStreak += 1;
    discordNextAllowedAt = now + Math.max(getDiscordBackoffMs(created.retryAfterMs), DISCORD_CREATE_BACKOFF_MS);
  } else if (created.status > 0) {
    discordRateLimitedStreak = 0;
    discordNextAllowedAt = now + Math.max(DISCORD_PUSH_INTERVAL_MS, 30000);
  }
  if (created.ok) {
    discordRateLimitedStreak = 0;
    discordLastSuccessAt = now;
    const nextId = String(created.body?.id || "").trim();
    if (/^\d{8,30}$/.test(nextId)) {
      discordStatsMessageId = nextId;
      saveDiscordStatsState();
    }
    return;
  }

  if (created.status > 0) {
    console.warn(`[discord] Webhook push failed (${created.status}) during ${reason}/${discordStatsMessageId ? "patch" : "create"}.`);
  } else {
    console.warn(`[discord] Webhook push failed (network/timeout) during ${reason}/${discordStatsMessageId ? "patch" : "create"}.`);
  }
  })();

  discordPushInFlight = task.finally(() => {
    discordPushInFlight = null;
  });
  return discordPushInFlight;
}

function toInt(value, fallback, min, max) {
  const asNumber = Number(value);
  if (!Number.isFinite(asNumber)) {
    return fallback;
  }
  const bounded = Math.max(min, Math.min(max, Math.trunc(asNumber)));
  return bounded;
}

function decodeHtmlEntities(value) {
  const raw = String(value || "");
  return raw
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : "";
    })
    .replace(/&#(\d+);/g, (_, digits) => {
      const code = Number.parseInt(digits, 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : "";
    });
}

function stripTags(value) {
  return decodeHtmlEntities(String(value || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function normalizeTitleKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizePidoovLanguage(value) {
  const raw = String(value || "").trim().toUpperCase();
  if (!raw) {
    return "";
  }
  if (raw.includes("VOSTFR")) {
    return "VOSTFR";
  }
  if (raw.includes("MULTI") || raw.includes("DUAL")) {
    return "MULTI";
  }
  if (/\bVF\b/.test(raw) || raw.includes("FRENCH") || raw.includes("FR")) {
    return "VF";
  }
  if (/\bVO\b/.test(raw) || raw.includes("ORIGINAL")) {
    return "VO";
  }
  return "";
}

function normalizePidoovPath(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  let parsed;
  try {
    parsed = new URL(raw, `${PIDOOV_BASE}/`);
  } catch {
    return "";
  }
  if (normalizeHostName(parsed.hostname) !== PIDOOV_HOST) {
    return "";
  }
  if (!String(parsed.pathname || "").startsWith(PIDOOV_HOME_PATH)) {
    return "";
  }
  return `${parsed.pathname}${parsed.search}`;
}

function parseYearFromText(value) {
  const text = String(value || "");
  const matches = text.match(/\((19|20)\d{2}\)/g);
  if (!matches || matches.length === 0) {
    return 0;
  }
  const last = String(matches[matches.length - 1] || "");
  const year = Number(last.replace(/[^\d]/g, ""));
  if (!Number.isInteger(year) || year < 1900 || year > 2099) {
    return 0;
  }
  return year;
}

function toIsoDate(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  const date = new Date(raw);
  if (!Number.isFinite(date.getTime())) {
    return "";
  }
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeNakiosAvailabilityStatus(value) {
  const raw = normalizeTitleKey(String(value || "").trim());
  if (!raw) {
    return "unknown";
  }
  if (
    raw === "available" ||
    raw === "disponible" ||
    raw === "ready" ||
    raw === "ok" ||
    raw === "online" ||
    raw === "publie"
  ) {
    return "available";
  }
  if (
    raw === "pending" ||
    raw === "waiting" ||
    raw === "en attente" ||
    raw === "attente" ||
    raw === "coming" ||
    raw === "upcoming"
  ) {
    return "pending";
  }
  return "unknown";
}

function getNakiosAvailabilityPriority(value) {
  const normalized = normalizeNakiosAvailabilityStatus(value);
  if (normalized === "available") {
    return 3;
  }
  if (normalized === "unknown") {
    return 2;
  }
  return 1;
}

function isNakiosLikelyPendingByDate(value) {
  const iso = toIsoDate(value);
  if (!iso) {
    return false;
  }
  const ts = Date.parse(`${iso}T00:00:00Z`);
  if (!Number.isFinite(ts)) {
    return false;
  }
  return ts >= Date.now() - NAKIOS_PENDING_SOON_GRACE_MS;
}

function buildNakiosAvailabilityCacheKey(mediaType, tmdbId, season = 0, episode = 0) {
  const safeType = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const safeTmdbId = toInt(tmdbId, 0, 0, 999999999);
  if (safeTmdbId <= 0) {
    return "";
  }
  const safeSeason = safeType === "tv" ? toInt(season, 1, 1, 999) : 0;
  const safeEpisode = safeType === "tv" ? toInt(episode, 1, 1, 99999) : 0;
  return `${safeType}:${safeTmdbId}:${safeSeason}:${safeEpisode}`;
}

function toNakiosAvailabilityProbeInput(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const provider = String(entry?.external_provider || entry?.provider || "").trim().toLowerCase();
  if (provider !== "nakios") {
    return null;
  }
  const mediaType = String(entry?.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  const tmdbId = toInt(entry?.external_tmdb_id ?? entry?.tmdb_id, 0, 0, 999999999);
  if (tmdbId <= 0) {
    return null;
  }
  const season = mediaType === "tv" ? toInt(entry?.external_season || 1, 1, 1, 999) : 0;
  const episode = mediaType === "tv" ? toInt(entry?.external_episode || 1, 1, 1, 99999) : 0;
  const cacheKey = buildNakiosAvailabilityCacheKey(mediaType, tmdbId, season, episode);
  if (!cacheKey) {
    return null;
  }
  return {
    cacheKey,
    mediaType,
    tmdbId,
    season,
    episode,
    releaseDate:
      String(entry?.supplemental_date || entry?.release_date || entry?.releaseDate || "").trim() ||
      String(entry?.dateIso || "").trim(),
  };
}

async function resolveNakiosAvailabilityStatus(input) {
  if (!input || typeof input !== "object") {
    return "unknown";
  }
  const cacheKey = String(input.cacheKey || "").trim();
  if (!cacheKey) {
    return "unknown";
  }

  const cached = nakiosAvailabilityCache.get(cacheKey);
  if (cached && Date.now() < Number(cached.expiresAt || 0)) {
    return normalizeNakiosAvailabilityStatus(cached.status);
  }
  if (nakiosAvailabilityInFlight.has(cacheKey)) {
    return nakiosAvailabilityInFlight.get(cacheKey);
  }

  const task = (async () => {
    let status = "unknown";
    try {
      const sources = await resolveNakiosSourcesByTmdbId(
        input.mediaType,
        input.tmdbId,
        input.season,
        input.episode
      );
      status = Array.isArray(sources) && sources.length > 0 ? "available" : "pending";
    } catch {
      status = isNakiosLikelyPendingByDate(input.releaseDate) ? "pending" : "unknown";
    }
    const ttlMs =
      status === "available"
        ? NAKIOS_AVAILABILITY_CACHE_MS
        : Math.max(5 * 60 * 1000, Math.min(NAKIOS_AVAILABILITY_CACHE_MS, 15 * 60 * 1000));
    nakiosAvailabilityCache.set(cacheKey, {
      status,
      expiresAt: Date.now() + ttlMs,
    });
    prunePidoovTimedCache(nakiosAvailabilityCache, 12000);
    return status;
  })();

  nakiosAvailabilityInFlight.set(cacheKey, task);
  try {
    return await task;
  } finally {
    nakiosAvailabilityInFlight.delete(cacheKey);
  }
}

async function annotateNakiosAvailability(entries, options = {}) {
  const rows = Array.isArray(entries) ? entries : [];
  if (rows.length === 0) {
    return rows;
  }

  const maxProbes = Math.max(
    0,
    toInt(
      options?.maxProbes,
      NAKIOS_AVAILABILITY_MAX_PROBES_PER_RESPONSE,
      0,
      Math.max(0, rows.length)
    )
  );
  const candidates = [];

  rows.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const provider = String(entry?.external_provider || entry?.provider || "").trim().toLowerCase();
    if (provider !== "nakios") {
      return;
    }
    const existing = normalizeNakiosAvailabilityStatus(
      entry?.availability_status || entry?.external_status || entry?.status
    );
    if (existing === "available" || existing === "pending") {
      entry.availability_status = existing;
      entry.external_status = existing;
      entry.is_pending_upload = existing === "pending";
      return;
    }
    const probe = toNakiosAvailabilityProbeInput(entry);
    if (!probe) {
      const pendingByDate = isNakiosLikelyPendingByDate(entry?.supplemental_date || entry?.release_date || "");
      if (pendingByDate) {
        entry.availability_status = "pending";
        entry.external_status = "pending";
        entry.is_pending_upload = true;
      }
      return;
    }
    candidates.push({
      entry,
      probe,
    });
  });

  const probes = candidates.slice(0, maxProbes);
  if (probes.length > 0) {
    await mapWithConcurrency(
      probes,
      Math.max(1, Math.min(NAKIOS_AVAILABILITY_PROBE_CONCURRENCY, probes.length)),
      async (row) => {
        const status = normalizeNakiosAvailabilityStatus(await resolveNakiosAvailabilityStatus(row.probe));
        row.entry.availability_status = status;
        row.entry.external_status = status;
        row.entry.is_pending_upload = status === "pending";
      }
    );
  }

  rows.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const provider = String(entry?.external_provider || entry?.provider || "").trim().toLowerCase();
    if (provider !== "nakios") {
      return;
    }
    let status = normalizeNakiosAvailabilityStatus(entry?.availability_status || entry?.external_status || entry?.status);
    if (status === "unknown" && isNakiosLikelyPendingByDate(entry?.supplemental_date || entry?.release_date || "")) {
      status = "pending";
    }
    if (status !== "unknown") {
      entry.availability_status = status;
      entry.external_status = status;
      entry.is_pending_upload = status === "pending";
    }
  });

  return rows;
}

function buildSupplementalMediaId(prefix, rawKey) {
  const safePrefix = String(prefix || "supp").trim().toLowerCase();
  const safeKey = String(rawKey || "").trim();
  if (!safeKey) {
    return 0;
  }
  const hashHex = crypto
    .createHash("sha1")
    .update(`${safePrefix}:${safeKey}`)
    .digest("hex")
    .slice(0, 8);
  const numeric = Number.parseInt(hashHex, 16);
  if (!Number.isInteger(numeric) || numeric <= 0) {
    return 0;
  }
  return 1_500_000_000 + (numeric % 400_000_000);
}

function parseSeasonEpisodeFromTitleText(value) {
  const text = String(value || "").trim();
  if (!text) {
    return { title: "", season: 0, episode: 0, kind: "movie" };
  }
  const decoded = stripTags(text);
  const withSpaces = decoded.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  const tvMatch = withSpaces.match(
    /^(?<title>.+?)\s+saison\s*(?<season>\d+)\s*episode\s*(?<episode>\d+)(?:\s+\d{4})?$/i
  );
  if (tvMatch) {
    return {
      title: String(tvMatch.groups?.title || "").trim(),
      season: toInt(tvMatch.groups?.season, 0, 0, 500),
      episode: toInt(tvMatch.groups?.episode, 0, 0, 50000),
      kind: "tv",
    };
  }
  return {
    title: withSpaces,
    season: 0,
    episode: 0,
    kind: "movie",
  };
}

function sanitizePidoovTitleLabel(value) {
  let text = stripTags(value);
  if (!text) {
    return "";
  }
  text = text
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/\((?:19|20)\d{2}\)/g, " ")
    .replace(/\b(?:HD|FULL\s*HD|FHD|UHD|4K|CAM|TS|HDTS|WEB[- ]?DL|WEBRIP|BLURAY|DVDRIP|HDRIP)\b/gi, " ")
    .replace(/[|]+/g, " ")
    .replace(/[-:]\s*$/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

function parsePidoovCategoryPage(categoryId, page, html) {
  const source = String(html || "");
  const anchorRegex = /<a\s+href=["'](?<href>\/xv5lzk\/b\/pidoov\/\d+)["'][^>]*>(?<label>[\s\S]*?)<\/a>/gi;
  const rows = [];
  let match = null;
  while ((match = anchorRegex.exec(source)) !== null) {
    const detailPath = normalizePidoovPath(match.groups?.href || "");
    if (!detailPath) {
      continue;
    }
    const rawLabel = stripTags(match.groups?.label || "");
    const title = sanitizePidoovTitleLabel(rawLabel);
    if (title.length < 2) {
      continue;
    }
    const year = parseYearFromText(rawLabel);
    const language = normalizePidoovLanguage(rawLabel) || "VF";
    const titleKey = normalizeTitleKey(title);
    if (!titleKey) {
      continue;
    }
    rows.push({
      detailPath,
      title,
      titleKey,
      language,
      year,
      categoryId,
      page,
      label: rawLabel,
    });
  }
  return rows;
}

function parsePidoovCategoryMaxPage(categoryId, html) {
  const source = String(html || "");
  const cat = String(categoryId || "").replace(/[^\d]/g, "");
  if (!cat) {
    return 0;
  }
  const regex = new RegExp(`${PIDOOV_HOME_PATH}/c/pidoov/${cat}/(\\d+)`, "gi");
  let maxPage = 0;
  let match = null;
  while ((match = regex.exec(source)) !== null) {
    const page = Number(match[1] || 0);
    if (Number.isInteger(page) && page > maxPage) {
      maxPage = page;
    }
  }
  return Math.max(0, maxPage);
}

async function mapWithConcurrency(values, concurrency, mapper) {
  const rows = Array.isArray(values) ? values : [];
  if (rows.length === 0) {
    return [];
  }
  const limit = Math.max(1, Math.min(Number(concurrency || 1), rows.length));
  const results = new Array(rows.length);
  let cursor = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (true) {
      const current = cursor;
      cursor += 1;
      if (current >= rows.length) {
        return;
      }
      try {
        results[current] = await mapper(rows[current], current);
      } catch {
        results[current] = null;
      }
    }
  });
  await Promise.all(workers);
  return results;
}

async function fetchPidoovCategoryEntries(categoryId, maxPagesPerCategory = PIDOOV_MAX_PAGES_PER_CATEGORY) {
  const cat = Number(categoryId || 0);
  if (!Number.isInteger(cat) || cat <= 0) {
    return [];
  }
  const firstUrl = `${PIDOOV_BASE}${PIDOOV_HOME_PATH}/c/pidoov/${cat}/0`;
  const firstResponse = await fetchRemoteText(firstUrl, "text/html,application/xhtml+xml", PIDOOV_FETCH_HEADERS);
  if (firstResponse.status < 200 || firstResponse.status >= 300) {
    throw new Error(`Pidoov category ${cat} unavailable`);
  }

  const firstRows = parsePidoovCategoryPage(cat, 0, firstResponse.body);
  const maxPage = parsePidoovCategoryMaxPage(cat, firstResponse.body);
  const cap = Math.max(1, toInt(maxPagesPerCategory, PIDOOV_MAX_PAGES_PER_CATEGORY, 1, 120));
  const cappedMaxPage = Math.max(0, Math.min(maxPage, cap - 1));
  if (cappedMaxPage <= 0) {
    return firstRows;
  }

  const pages = [];
  for (let page = 1; page <= cappedMaxPage; page += 1) {
    pages.push(page);
  }

  const nextRows = await mapWithConcurrency(pages, PIDOOV_FETCH_CONCURRENCY, async (pageNumber) => {
    const pageUrl = `${PIDOOV_BASE}${PIDOOV_HOME_PATH}/c/pidoov/${cat}/${pageNumber}`;
    const response = await fetchRemoteText(pageUrl, "text/html,application/xhtml+xml", PIDOOV_FETCH_HEADERS);
    if (response.status < 200 || response.status >= 300) {
      return [];
    }
    return parsePidoovCategoryPage(cat, pageNumber, response.body);
  });

  const merged = firstRows.slice();
  nextRows.forEach((entries) => {
    if (Array.isArray(entries) && entries.length > 0) {
      merged.push(...entries);
    }
  });
  return merged;
}

function prunePidoovTimedCache(map, maxEntries = 3200) {
  const now = Date.now();
  for (const [key, row] of map.entries()) {
    if (Number(row?.expiresAt || 0) <= now) {
      map.delete(key);
    }
  }
  if (map.size <= maxEntries) {
    return;
  }
  const sorted = Array.from(map.entries()).sort(
    (left, right) => Number(left?.[1]?.expiresAt || 0) - Number(right?.[1]?.expiresAt || 0)
  );
  sorted.slice(0, map.size - maxEntries).forEach(([key]) => map.delete(key));
}

function storePidoovLookupCache(key, payload, ttlMs = PIDOOV_LOOKUP_CACHE_MS) {
  pidoovLookupCache.set(String(key || ""), {
    value: Array.isArray(payload) ? payload : [],
    expiresAt: Date.now() + Math.max(1000, Number(ttlMs || 0)),
  });
  prunePidoovTimedCache(pidoovLookupCache, 1800);
}

function readPidoovLookupCache(key) {
  const row = pidoovLookupCache.get(String(key || ""));
  if (!row) {
    return null;
  }
  if (Date.now() >= Number(row.expiresAt || 0)) {
    pidoovLookupCache.delete(String(key || ""));
    return null;
  }
  return Array.isArray(row.value) ? row.value : [];
}

function loadPidoovStaticEntries() {
  const now = Date.now();
  const ttl = 10 * 1000;
  if (pidoovStaticCache.loadedAt > 0 && now - pidoovStaticCache.loadedAt < ttl) {
    return Array.isArray(pidoovStaticCache.entries) ? pidoovStaticCache.entries : [];
  }

  let entries = [];
  let mtimeMs = 0;
  try {
    const stats = fs.statSync(PIDOOV_STATIC_SOURCES_FILE);
    if (stats.isFile()) {
      mtimeMs = Number(stats.mtimeMs || 0);
      if (mtimeMs !== Number(pidoovStaticCache.mtimeMs || 0)) {
        const raw = fs.readFileSync(PIDOOV_STATIC_SOURCES_FILE, "utf8");
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed?.entries) ? parsed.entries : [];
        entries = list
          .map((entry) => {
            const title = String(entry?.title || "").trim();
            const titleKey = String(entry?.titleKey || normalizeTitleKey(title)).trim();
            const sources = Array.isArray(entry?.sources) ? entry.sources : [];
            if (!title || !titleKey || sources.length === 0) {
              return null;
            }
            return {
              title,
              titleKey,
              year: toInt(entry?.year, 0, 0, 2099),
              language: normalizePidoovLanguage(entry?.language || entry?.label || "") || "VF",
              detailPath: normalizePidoovPath(entry?.detailPath || ""),
              poster: normalizeSupplementalCoverCandidate(
                entry?.poster || entry?.cover || entry?.image || entry?.poster_url || "",
                PIDOOV_BASE
              ),
              backdrop: normalizeSupplementalCoverCandidate(
                entry?.backdrop || entry?.wallpaper || entry?.backdrop_url || "",
                PIDOOV_BASE
              ),
              sources: sources
                .map((source) => {
                  const parsedUrl = parseSafeRemoteUrl(source?.stream_url || source?.url || "");
                  if (!parsedUrl) {
                    return null;
                  }
                  const format = String(source?.format || "").trim().toLowerCase();
                  return {
                    stream_url: parsedUrl.href,
                    format: format === "hls" || format === "mp4" || format === "embed" ? format : "embed",
                  };
                })
                .filter(Boolean),
            };
          })
          .filter((entry) => entry && Array.isArray(entry.sources) && entry.sources.length > 0);
      } else {
        entries = Array.isArray(pidoovStaticCache.entries) ? pidoovStaticCache.entries : [];
      }
    }
  } catch {
    entries = [];
    mtimeMs = 0;
  }

  pidoovStaticCache.loadedAt = now;
  pidoovStaticCache.mtimeMs = mtimeMs;
  pidoovStaticCache.entries = entries;
  return entries;
}

function loadNotariellesStaticEntries() {
  const now = Date.now();
  const ttl = 10 * 1000;
  if (notariellesStaticCache.loadedAt > 0 && now - notariellesStaticCache.loadedAt < ttl) {
    return Array.isArray(notariellesStaticCache.entries) ? notariellesStaticCache.entries : [];
  }

  let entries = [];
  let mtimeMs = 0;
  try {
    const stats = fs.statSync(NOTARIELLES_STATIC_SOURCES_FILE);
    if (stats.isFile()) {
      mtimeMs = Number(stats.mtimeMs || 0);
      if (mtimeMs !== Number(notariellesStaticCache.mtimeMs || 0)) {
        const raw = fs.readFileSync(NOTARIELLES_STATIC_SOURCES_FILE, "utf8");
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed?.entries) ? parsed.entries : Array.isArray(parsed) ? parsed : [];
        entries = list
          .map((entry) => {
            if (entry && typeof entry === "object" && typeof entry.pageUrl === "string") {
              return parseNotariellesEntryFromUrl(entry.pageUrl);
            }
            return parseNotariellesEntryFromUrl(entry);
          })
          .filter(Boolean);
      } else {
        entries = Array.isArray(notariellesStaticCache.entries) ? notariellesStaticCache.entries : [];
      }
    }
  } catch {
    entries = [];
    mtimeMs = 0;
  }

  notariellesStaticCache.loadedAt = now;
  notariellesStaticCache.mtimeMs = mtimeMs;
  notariellesStaticCache.entries = entries;
  return entries;
}

function loadRendezvousStaticEntries() {
  const now = Date.now();
  const ttl = 10 * 1000;
  if (rendezvousStaticCache.loadedAt > 0 && now - rendezvousStaticCache.loadedAt < ttl) {
    return Array.isArray(rendezvousStaticCache.entries) ? rendezvousStaticCache.entries : [];
  }

  let entries = [];
  let mtimeMs = 0;
  try {
    const stats = fs.statSync(RENDEZVOUS_STATIC_SOURCES_FILE);
    if (stats.isFile()) {
      mtimeMs = Number(stats.mtimeMs || 0);
      if (mtimeMs !== Number(rendezvousStaticCache.mtimeMs || 0)) {
        const raw = fs.readFileSync(RENDEZVOUS_STATIC_SOURCES_FILE, "utf8");
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed?.entries) ? parsed.entries : Array.isArray(parsed) ? parsed : [];
        entries = list
          .map((entry) => {
            const pageUrl =
              typeof entry === "string"
                ? entry
                : String(entry?.pageUrl || entry?.url || "").trim();
            const baseEntry = parseRendezvousEntryFromUrl(pageUrl);
            if (!baseEntry) {
              return null;
            }

            const normalizedLanguage =
              normalizePidoovLanguage(entry?.language || entry?.label || "") || baseEntry.language || "VF";
            const normalizedPoster = normalizeSupplementalCoverCandidate(
              entry?.poster || entry?.cover || entry?.image || entry?.poster_url || "",
              pageUrl || `${RENDEZVOUS_BASE}/`
            );
            const normalizedBackdrop = normalizeSupplementalCoverCandidate(
              entry?.backdrop || entry?.wallpaper || entry?.backdrop_url || normalizedPoster,
              pageUrl || `${RENDEZVOUS_BASE}/`
            );
            const rawSources = Array.isArray(entry?.sources) ? entry.sources : [];
            const staticSources = rawSources
              .map((source, index) => {
                const parsedUrl = parseSafeRemoteUrl(source?.stream_url || source?.url || "");
                if (!parsedUrl) {
                  return null;
                }
                const format = String(source?.format || "").trim().toLowerCase();
                const sourceName = String(source?.source_name || source?.name || "Rendezvous").trim() || "Rendezvous";
                return {
                  stream_url: parsedUrl.href,
                  source_name: sourceName,
                  quality: "Rendezvous",
                  language: normalizedLanguage,
                  format: format === "hls" || format === "mp4" || format === "embed" ? format : "embed",
                  priority: 320 - Math.min(45, index * 5),
                };
              })
              .filter(Boolean);
            return {
              ...baseEntry,
              language: normalizedLanguage,
              poster: normalizedPoster,
              backdrop: normalizedBackdrop || normalizedPoster,
              lastmod: toIsoDate(entry?.lastmod || entry?.updatedAt || ""),
              staticSources,
            };
          })
          .filter(Boolean);
      } else {
        entries = Array.isArray(rendezvousStaticCache.entries) ? rendezvousStaticCache.entries : [];
      }
    }
  } catch {
    entries = [];
    mtimeMs = 0;
  }

  rendezvousStaticCache.loadedAt = now;
  rendezvousStaticCache.mtimeMs = mtimeMs;
  rendezvousStaticCache.entries = entries;
  return entries;
}

async function loadPidoovIndex(force = false) {
  const now = Date.now();
  const hasCache = Array.isArray(pidoovIndexCache.entries) && pidoovIndexCache.entries.length > 0;
  const isFresh = pidoovIndexCache.loadedAt > 0 && now - pidoovIndexCache.loadedAt < PIDOOV_INDEX_CACHE_MS;

  if (!force && hasCache && isFresh) {
    return Array.isArray(pidoovIndexCache.entries) ? pidoovIndexCache.entries : [];
  }
  if (force && pidoovIndexCache.full && hasCache && isFresh) {
    return Array.isArray(pidoovIndexCache.entries) ? pidoovIndexCache.entries : [];
  }
  if (pidoovIndexCache.inFlight) {
    if (!force && hasCache) {
      return Array.isArray(pidoovIndexCache.entries) ? pidoovIndexCache.entries : [];
    }
    return await pidoovIndexCache.inFlight;
  }

  const fullMode = Boolean(force);
  const pagesPerCategory = fullMode ? PIDOOV_MAX_PAGES_PER_CATEGORY : PIDOOV_BOOTSTRAP_PAGES_PER_CATEGORY;
  const crawlConcurrency = fullMode
    ? Math.max(1, Math.min(PIDOOV_FETCH_CONCURRENCY, 3))
    : Math.max(1, Math.min(PIDOOV_FETCH_CONCURRENCY, 2));

  const task = (async () => {
    const byPath = new Map();
    const categoryRows = await mapWithConcurrency(
      PIDOOV_CATEGORY_IDS,
      Math.min(crawlConcurrency, PIDOOV_CATEGORY_IDS.length),
      async (categoryId) => {
        try {
          return await fetchPidoovCategoryEntries(categoryId, pagesPerCategory);
        } catch {
          return [];
        }
      }
    );
    categoryRows.forEach((rows) => {
      if (!Array.isArray(rows) || rows.length === 0) {
        return;
      }
      rows.forEach((entry) => {
        const key = String(entry?.detailPath || "").trim();
        if (!key || byPath.has(key)) {
          return;
        }
        byPath.set(key, entry);
      });
    });
    const entries = Array.from(byPath.values());
    if (entries.length > 0 || !hasCache) {
      pidoovIndexCache.entries = entries;
      pidoovIndexCache.full = fullMode;
    } else if (fullMode && hasCache) {
      pidoovIndexCache.full = pidoovIndexCache.full || fullMode;
    }
    pidoovIndexCache.loadedAt = Date.now();
    return Array.isArray(pidoovIndexCache.entries) ? pidoovIndexCache.entries : entries;
  })();

  pidoovIndexCache.inFlight = task;
  try {
    const result = await task;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    const fallback = Array.isArray(pidoovIndexCache.entries) ? pidoovIndexCache.entries : [];
    if (fallback.length > 0) {
      return fallback;
    }
    throw error;
  } finally {
    pidoovIndexCache.inFlight = null;
  }
}

function triggerPidoovFullIndexRefresh() {
  if (pidoovIndexCache.full || pidoovIndexCache.inFlight) {
    return;
  }
  loadPidoovIndex(true).catch(() => {
    // best effort async refresh
  });
}

function getPidoovTitleTokens(value) {
  return normalizeTitleKey(value)
    .split(" ")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 1 || /^\d+$/.test(entry));
}

function scorePidoovCandidate(entry, queryKey, queryYear = 0) {
  const titleKey = String(entry?.titleKey || "").trim();
  if (!titleKey || !queryKey) {
    return 0;
  }

  let score = 0;
  if (titleKey === queryKey) {
    score += 420;
  } else if (titleKey.includes(queryKey) || queryKey.includes(titleKey)) {
    score += 210;
  }

  const queryTokens = getPidoovTitleTokens(queryKey);
  const candidateTokens = new Set(getPidoovTitleTokens(titleKey));
  let overlaps = 0;
  let missingNumericTokens = 0;
  queryTokens.forEach((token) => {
    if (candidateTokens.has(token)) {
      overlaps += 1;
      return;
    }
    if (/^\d+$/.test(token)) {
      missingNumericTokens += 1;
    }
  });
  score += overlaps * 26;
  if (missingNumericTokens > 0) {
    score -= missingNumericTokens * 140;
  }

  if (queryTokens.length > 0) {
    const ratio = overlaps / queryTokens.length;
    if (ratio >= 1) {
      score += 90;
    } else if (ratio >= 0.75) {
      score += 45;
    } else if (ratio >= 0.5) {
      score += 20;
    } else if (ratio < 0.25) {
      score -= 25;
    }
  }

  const year = Number(entry?.year || 0);
  if (Number.isInteger(queryYear) && queryYear > 1900) {
    if (year === queryYear) {
      score += 85;
    } else if (year > 0 && Math.abs(year - queryYear) <= 1) {
      score += 35;
    } else if (year > 0 && Math.abs(year - queryYear) >= 2) {
      score -= 95;
    }
  }

  const language = String(entry?.language || "").trim().toUpperCase();
  if (language === "VF" || language === "MULTI") {
    score += 20;
  } else if (language === "VOSTFR") {
    score += 12;
  } else if (language === "VO") {
    score -= 25;
  }

  const diff = Math.abs(titleKey.length - queryKey.length);
  if (diff >= 18) {
    score -= 18;
  } else if (diff <= 4) {
    score += 10;
  }
  return score;
}

function pickBestPidoovCandidates(entries, title, year = 0) {
  const queryKey = normalizeTitleKey(title || "");
  if (!queryKey) {
    return [];
  }

  const scored = (Array.isArray(entries) ? entries : [])
    .map((entry) => ({
      entry,
      score: scorePidoovCandidate(entry, queryKey, Number(year || 0)),
    }))
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score);

  if (scored.length === 0) {
    return [];
  }

  const topScore = Number(scored[0]?.score || 0);
  const minScore = topScore >= 420 ? 120 : Math.max(140, topScore - 160);
  const selected = [];
  const seenPath = new Set();
  for (const row of scored) {
    const pathKey = String(row?.entry?.detailPath || "").trim();
    if (!pathKey || seenPath.has(pathKey)) {
      continue;
    }
    if (row.score < minScore) {
      continue;
    }
    selected.push({
      ...row.entry,
      score: row.score,
    });
    seenPath.add(pathKey);
    if (selected.length >= PIDOOV_MAX_MATCH_CANDIDATES) {
      break;
    }
  }
  return selected;
}

function resolvePidoovSourcesFromStatic(title, options = {}) {
  const safeTitle = String(title || "").trim();
  if (safeTitle.length < 2) {
    return [];
  }
  const year = toInt(options?.year, 0, 0, 2099);
  const entries = loadPidoovStaticEntries();
  if (!Array.isArray(entries) || entries.length === 0) {
    return [];
  }

  const candidates = pickBestPidoovCandidates(entries, safeTitle, year);
  if (candidates.length === 0) {
    return [];
  }

  const merged = [];
  const seen = new Set();
  candidates.forEach((candidate) => {
    const language = normalizePidoovLanguage(candidate?.language || "") || "VF";
    const sourceName = candidate?.year ? `Pidoov ${candidate.year}` : "Pidoov";
    const basePriority = language === "VF" ? 380 : language === "MULTI" ? 360 : language === "VOSTFR" ? 340 : 320;
    const rows = Array.isArray(candidate?.sources) ? candidate.sources : [];
    rows.forEach((entry, index) => {
      const url = String(entry?.stream_url || "").trim();
      if (!url || seen.has(url)) {
        return;
      }
      seen.add(url);
      merged.push({
        stream_url: url,
        source_name: sourceName,
        quality: "Pidoov",
        language,
        format: String(entry?.format || "").trim() || "embed",
        priority: basePriority - Math.min(40, index * 6),
      });
    });
  });

  return merged;
}

function parsePidoovDetailSources(html) {
  const source = String(html || "");
  const output = [];
  const seen = new Set();
  const blockedHostKeywords = [
    "doubleclick",
    "googlesyndication",
    "google-analytics",
    "adsterra",
    "maddenwiped",
    "histats",
    "popads",
  ];

  const iframeRegex = /<iframe\b(?<attrs>[^>]*)\bsrc=["'](?<src>[^"']+)["'][^>]*>/gi;
  let iframeMatch = null;
  while ((iframeMatch = iframeRegex.exec(source)) !== null) {
    const rawSrc = String(iframeMatch.groups?.src || "").trim();
    if (!rawSrc) {
      continue;
    }
    let absolute = rawSrc;
    try {
      absolute = new URL(rawSrc, `${PIDOOV_BASE}/`).href;
    } catch {
      absolute = rawSrc;
    }
    const parsed = parseSafeRemoteUrl(absolute);
    if (!parsed) {
      continue;
    }
    const host = normalizeHostName(parsed.hostname || "");
    if (blockedHostKeywords.some((keyword) => host.includes(keyword))) {
      continue;
    }

    const tagRaw = String(iframeMatch[0] || "").toLowerCase();
    const likelyPlayer =
      tagRaw.includes("allowfullscreen") ||
      /\/(?:iframe|embed|player)\b/i.test(parsed.pathname) ||
      /video|stream|play/i.test(parsed.pathname);
    if (!likelyPlayer) {
      continue;
    }

    const key = parsed.href;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push({
      stream_url: key,
      format: "embed",
    });
  }

  const directRegex = /\b(?:src|file)\s*[:=]\s*["'](?<src>https?:\/\/[^"']+\.(?:m3u8|mp4)(?:\?[^"']*)?)["']/gi;
  let directMatch = null;
  while ((directMatch = directRegex.exec(source)) !== null) {
    const rawSrc = String(directMatch.groups?.src || "").trim();
    const parsed = parseSafeRemoteUrl(rawSrc);
    if (!parsed) {
      continue;
    }
    const key = parsed.href;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push({
      stream_url: key,
      format: key.includes(".m3u8") ? "hls" : "mp4",
    });
  }

  return output;
}

async function loadPidoovDetailSources(detailPath) {
  const safePath = normalizePidoovPath(detailPath);
  if (!safePath) {
    return [];
  }
  const cached = pidoovDetailCache.get(safePath);
  if (cached && Date.now() < Number(cached.expiresAt || 0)) {
    return Array.isArray(cached.sources) ? cached.sources : [];
  }

  const target = `${PIDOOV_BASE}${safePath}`;
  const response = await fetchRemoteText(target, "text/html,application/xhtml+xml", PIDOOV_FETCH_HEADERS);
  if (response.status < 200 || response.status >= 300) {
    throw new Error("Pidoov detail unavailable");
  }

  const sources = parsePidoovDetailSources(response.body);
  pidoovDetailCache.set(safePath, {
    sources,
    expiresAt: Date.now() + PIDOOV_DETAIL_CACHE_MS,
  });
  prunePidoovTimedCache(pidoovDetailCache, 1800);
  return sources;
}

async function resolvePidoovSourcesByTitle(title, options = {}) {
  const safeTitle = String(title || "").trim();
  if (safeTitle.length < 2) {
    return [];
  }

  const type = String(options?.type || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const year = toInt(options?.year, 0, 0, 2099);
  const season = toInt(options?.season, 1, 1, 500);
  const episode = toInt(options?.episode, 1, 1, 50000);
  const lookupKey = `${normalizeTitleKey(safeTitle)}|${type}|${year}|${season}|${episode}`;
  const cached = readPidoovLookupCache(lookupKey);
  if (cached) {
    return cached;
  }

  const staticSources = resolvePidoovSourcesFromStatic(safeTitle, { year, type, season, episode });
  if (staticSources.length > 0) {
    storePidoovLookupCache(lookupKey, staticSources);
    return staticSources;
  }

  const index = await loadPidoovIndex();
  const candidates = pickBestPidoovCandidates(index, safeTitle, year);
  if (candidates.length === 0) {
    storePidoovLookupCache(lookupKey, []);
    if (!pidoovIndexCache.full) {
      triggerPidoovFullIndexRefresh();
    }
    return [];
  }

  const merged = [];
  const seen = new Set();
  for (const candidate of candidates) {
    let detailSources = [];
    try {
      detailSources = await loadPidoovDetailSources(candidate.detailPath);
    } catch {
      detailSources = [];
    }
    if (!Array.isArray(detailSources) || detailSources.length === 0) {
      continue;
    }

    const candidateLanguage = normalizePidoovLanguage(candidate.language || candidate.label || "") || "VF";
    detailSources.forEach((entry, indexInDetail) => {
      const url = String(entry?.stream_url || "").trim();
      if (!url || seen.has(url)) {
        return;
      }
      seen.add(url);

      const language = candidateLanguage;
      const sourceName = candidate.year
        ? `Pidoov ${candidate.year}`
        : String(candidate?.title || "").trim()
          ? `Pidoov - ${candidate.title}`
          : "Pidoov";
      const basePriority = language === "VF" ? 380 : language === "MULTI" ? 360 : language === "VOSTFR" ? 340 : 320;
      merged.push({
        stream_url: url,
        source_name: sourceName,
        quality: "Pidoov",
        language,
        format: String(entry?.format || "").trim() || "embed",
        priority: basePriority - Math.min(40, indexInDetail * 6),
      });
    });
  }

  storePidoovLookupCache(lookupKey, merged);
  if (merged.length === 0 && !pidoovIndexCache.full) {
    triggerPidoovFullIndexRefresh();
  }
  return merged;
}

function normalizeNotariellesPath(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  let parsed;
  try {
    parsed = new URL(raw, `${NOTARIELLES_BASE}/`);
  } catch {
    return "";
  }
  if (normalizeHostName(parsed.hostname) !== NOTARIELLES_HOST) {
    return "";
  }
  return `${parsed.pathname}${parsed.search}`;
}

function parseXmlLocValues(xml) {
  const source = String(xml || "");
  const values = [];
  const regex = /<loc>([^<]+)<\/loc>/gi;
  let match = null;
  while ((match = regex.exec(source)) !== null) {
    const url = String(match[1] || "").trim();
    if (url) {
      values.push(url);
    }
  }
  return values;
}

function parseXmlLocRows(xml) {
  const source = String(xml || "");
  if (!source) {
    return [];
  }
  const rows = [];
  const regex = /<(?:url|sitemap)>([\s\S]*?)<\/(?:url|sitemap)>/gi;
  let match = null;
  while ((match = regex.exec(source)) !== null) {
    const block = String(match[1] || "");
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/i);
    const loc = String(locMatch?.[1] || "").trim();
    if (!loc) {
      continue;
    }
    const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/i);
    const lastmod = String(lastmodMatch?.[1] || "").trim();
    rows.push({
      loc,
      lastmod,
    });
  }
  if (rows.length > 0) {
    return rows;
  }
  return parseXmlLocValues(source).map((loc) => ({ loc, lastmod: "" }));
}

function parseNotariellesEpisodeUrlsFromHtml(html, baseUrl = `${NOTARIELLES_BASE}/`) {
  const source = String(html || "");
  if (!source) {
    return [];
  }
  const urls = [];
  const seen = new Set();
  const hrefRegex = /href=["'](?<href>[^"']+)["']/gi;
  let match = null;
  while ((match = hrefRegex.exec(source)) !== null) {
    const rawHref = String(match.groups?.href || "").trim();
    if (!rawHref) {
      continue;
    }
    if (!/\/categorie-series\//i.test(rawHref)) {
      continue;
    }
    if (!/-saison-\d+-episode-\d+-(vf|vostfr)(?:$|[/?#])/i.test(rawHref)) {
      continue;
    }
    let absolute = rawHref;
    try {
      absolute = new URL(rawHref, String(baseUrl || `${NOTARIELLES_BASE}/`)).href;
    } catch {
      absolute = rawHref;
    }
    const normalizedPath = normalizeNotariellesPath(absolute);
    if (!normalizedPath) {
      continue;
    }
    const canonicalUrl = `${NOTARIELLES_BASE}${normalizedPath}`;
    if (seen.has(canonicalUrl)) {
      continue;
    }
    seen.add(canonicalUrl);
    urls.push(canonicalUrl);
  }
  return urls;
}

async function loadNotariellesEpisodeEntriesFromPages(pageUrls) {
  const targets = Array.isArray(pageUrls) ? pageUrls.filter(Boolean) : [];
  if (targets.length === 0) {
    return [];
  }
  const pageRows = await mapWithConcurrency(
    targets,
    Math.min(NOTARIELLES_FETCH_CONCURRENCY, targets.length || 1),
    async (pageUrl) => {
      try {
        const response = await fetchRemoteText(
          pageUrl,
          "text/html,application/xhtml+xml",
          NOTARIELLES_FETCH_HEADERS
        );
        if (response.status < 200 || response.status >= 300) {
          return [];
        }
        const episodeUrls = parseNotariellesEpisodeUrlsFromHtml(response.body, pageUrl);
        return episodeUrls
          .map((url) => parseNotariellesEntryFromUrl(url))
          .filter(Boolean);
      } catch {
        return [];
      }
    }
  );
  return pageRows.flat();
}

function slugToReadableTitle(slug) {
  const raw = String(slug || "");
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  return decoded
    .replace(/\+/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeNotariellesLanguage(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return "";
  }
  if (raw.endsWith("-vf")) {
    return "VF";
  }
  if (raw.endsWith("-vostfr")) {
    return "VOSTFR";
  }
  return "";
}

function parseNotariellesEntryFromUrl(value) {
  const rawPath = normalizeNotariellesPath(value);
  if (!rawPath) {
    return null;
  }
  const parsed = parseSafeRemoteUrl(`${NOTARIELLES_BASE}${rawPath}`);
  if (!parsed) {
    return null;
  }
  const rawPathname = String(parsed.pathname || "");
  let pathname = rawPathname;
  try {
    pathname = decodeURIComponent(rawPathname);
  } catch {
    pathname = rawPathname;
  }
  const match = pathname.match(/\/categorie-series\/(?<id>\d+)-(?<slug>[^/?#]+)\/?$/i);
  if (!match) {
    return null;
  }
  const mediaId = toInt(match.groups?.id, 0, 0, 999999999);
  const slugRaw = String(match.groups?.slug || "").trim();
  const seasonEpisodeMatch = slugRaw.match(/^(?<title>.+)-saison-(?<season>\d+)-episode-(?<episode>\d+)-(?<lang>vf|vostfr)$/i);
  if (!seasonEpisodeMatch) {
    return null;
  }

  const season = toInt(seasonEpisodeMatch.groups?.season, 0, 0, 400);
  const episode = toInt(seasonEpisodeMatch.groups?.episode, 0, 0, 20000);
  if (season <= 0 || episode <= 0) {
    return null;
  }

  const title = slugToReadableTitle(seasonEpisodeMatch.groups?.title || "");
  const titleKey = normalizeTitleKey(title);
  if (!titleKey) {
    return null;
  }

  const language = normalizeNotariellesLanguage(`-${String(seasonEpisodeMatch.groups?.lang || "").toLowerCase()}`);
  return {
    mediaId,
    title,
    titleKey,
    season,
    episode,
    language: language || "VF",
    pageUrl: parsed.href,
  };
}

function scoreNotariellesCandidate(entry, queryTitleKey, season, episode) {
  if (!entry || !queryTitleKey) {
    return -9999;
  }
  let score = 0;
  if (Number(entry.season) === Number(season)) {
    score += 240;
  } else {
    score -= 220;
  }
  if (Number(entry.episode) === Number(episode)) {
    score += 240;
  } else {
    score -= 220;
  }

  const titleKey = String(entry.titleKey || "").trim();
  if (titleKey === queryTitleKey) {
    score += 360;
  } else if (titleKey.includes(queryTitleKey) || queryTitleKey.includes(titleKey)) {
    score += 160;
  }

  const queryTokens = getPidoovTitleTokens(queryTitleKey);
  const candidateTokens = new Set(getPidoovTitleTokens(titleKey));
  let overlaps = 0;
  queryTokens.forEach((token) => {
    if (candidateTokens.has(token)) {
      overlaps += 1;
    }
  });
  score += overlaps * 28;
  if (queryTokens.length > 0) {
    const ratio = overlaps / queryTokens.length;
    if (ratio >= 1) {
      score += 70;
    } else if (ratio >= 0.7) {
      score += 30;
    } else if (ratio < 0.3) {
      score -= 80;
    }
  }

  const language = String(entry.language || "").trim().toUpperCase();
  if (language === "VF") {
    score += 18;
  } else if (language === "VOSTFR") {
    score += 10;
  }
  return score;
}

async function loadNotariellesIndex(force = false) {
  const now = Date.now();
  if (
    !force &&
    notariellesIndexCache.loadedAt > 0 &&
    now - notariellesIndexCache.loadedAt < NOTARIELLES_INDEX_CACHE_MS &&
    Array.isArray(notariellesIndexCache.entries) &&
    notariellesIndexCache.entries.length > 0
  ) {
    return notariellesIndexCache.entries;
  }
  if (notariellesIndexCache.inFlight) {
    return notariellesIndexCache.inFlight;
  }

  const task = (async () => {
    let sitemapUrls = [];
    try {
      const indexResponse = await fetchRemoteText(
        NOTARIELLES_SITEMAP_INDEX_URL,
        "application/xml,text/xml",
        NOTARIELLES_FETCH_HEADERS
      );
      if (indexResponse.status >= 200 && indexResponse.status < 300) {
        sitemapUrls = parseXmlLocValues(indexResponse.body)
          .filter((entry) => {
            const parsed = parseSafeRemoteUrl(entry);
            return parsed && normalizeHostName(parsed.hostname) === NOTARIELLES_HOST;
          })
          .slice(0, NOTARIELLES_MAX_SITEMAPS);
      }
    } catch {
      sitemapUrls = [];
    }

    const sitemapRows =
      sitemapUrls.length > 0
        ? await mapWithConcurrency(
            sitemapUrls,
            Math.min(NOTARIELLES_FETCH_CONCURRENCY, sitemapUrls.length || 1),
            async (sitemapUrl) => {
              let response = null;
              try {
                response = await fetchRemoteText(sitemapUrl, "application/xml,text/xml", NOTARIELLES_FETCH_HEADERS);
              } catch {
                return [];
              }
              if (!response || response.status < 200 || response.status >= 300) {
                return [];
              }
              return parseXmlLocValues(response.body);
            }
          )
        : [];

    const dedupe = new Map();
    const sitemapPageCandidates = [];
    const sitemapPageSeen = new Set();
    sitemapRows.forEach((values) => {
      if (!Array.isArray(values)) {
        return;
      }
      values.forEach((url) => {
        const normalizedPath = normalizeNotariellesPath(url);
        if (normalizedPath && /\/categorie-series\//i.test(normalizedPath)) {
          const pageUrl = `${NOTARIELLES_BASE}${normalizedPath}`;
          if (!sitemapPageSeen.has(pageUrl)) {
            sitemapPageSeen.add(pageUrl);
            if (sitemapPageCandidates.length < NOTARIELLES_PAGE_PROBE_COUNT) {
              sitemapPageCandidates.push(pageUrl);
            }
          }
        }

        const entry = parseNotariellesEntryFromUrl(url);
        if (!entry) {
          return;
        }
        const key = `${entry.pageUrl}`;
        if (!dedupe.has(key)) {
          dedupe.set(key, entry);
        }
      });
    });

    const seedUrls = NOTARIELLES_SEED_PATHS.map((pathToken) => {
      try {
        return new URL(pathToken, `${NOTARIELLES_BASE}/`).href;
      } catch {
        return "";
      }
    }).filter(Boolean);
    const probeUrls = [];
    const probeSeen = new Set();
    seedUrls.concat(sitemapPageCandidates).forEach((entry) => {
      const safeUrl = String(entry || "").trim();
      if (!safeUrl || probeSeen.has(safeUrl)) {
        return;
      }
      probeSeen.add(safeUrl);
      probeUrls.push(safeUrl);
    });

    const seedEntries = await loadNotariellesEpisodeEntriesFromPages(probeUrls);
    seedEntries.forEach((entry) => {
      const key = String(entry?.pageUrl || "").trim();
      if (!key || dedupe.has(key)) {
        return;
      }
      dedupe.set(key, entry);
    });

    const staticEntries = loadNotariellesStaticEntries();
    staticEntries.forEach((entry) => {
      const key = String(entry?.pageUrl || "").trim();
      if (!key || dedupe.has(key)) {
        return;
      }
      dedupe.set(key, entry);
    });

    const entries = Array.from(dedupe.values());
    notariellesIndexCache.entries = entries;
    notariellesIndexCache.loadedAt = Date.now();
    return notariellesIndexCache.entries;
  })();

  notariellesIndexCache.inFlight = task;
  try {
    return await task;
  } catch (error) {
    if (Array.isArray(notariellesIndexCache.entries) && notariellesIndexCache.entries.length > 0) {
      return notariellesIndexCache.entries;
    }
    throw error;
  } finally {
    notariellesIndexCache.inFlight = null;
  }
}

function parseNotariellesPlayerPageUrl(html) {
  const source = String(html || "");
  const insideMatch = source.match(
    /<div[^>]+class=["'][^"']*insideIframe[^"']*["'][^>]*>[\s\S]{0,1800}?<iframe[^>]+src=["'](?<src>[^"']+)["']/i
  );
  const iframeMatch = insideMatch || source.match(/<iframe[^>]+src=["'](?<src>[^"']*serie-vf\.php[^"']*)["']/i);
  const rawSrc = String(iframeMatch?.groups?.src || "").trim();
  if (!rawSrc) {
    return "";
  }
  let absolute = rawSrc;
  try {
    absolute = new URL(rawSrc, `${NOTARIELLES_BASE}/`).href;
  } catch {
    absolute = rawSrc;
  }
  const parsed = parseSafeRemoteUrl(absolute);
  if (!parsed) {
    return "";
  }
  if (normalizeHostName(parsed.hostname) !== NOTARIELLES_HOST) {
    return "";
  }
  return parsed.href;
}

function parseNotariellesDirectStreamUrl(html, baseUrl) {
  const source = String(html || "");
  const match = source.match(/<source[^>]+src=['"](?<src>[^'"]+)['"]/i);
  const rawSrc = String(match?.groups?.src || "").trim();
  if (!rawSrc) {
    return "";
  }
  let absolute = rawSrc;
  try {
    absolute = new URL(rawSrc, String(baseUrl || `${NOTARIELLES_BASE}/`)).href;
  } catch {
    absolute = rawSrc;
  }
  const parsed = parseSafeRemoteUrl(absolute);
  if (!parsed) {
    return "";
  }
  if (/\/universal\.mp4(?:$|\?)/i.test(parsed.pathname || "")) {
    return "";
  }
  return parsed.href;
}

async function loadNotariellesEntrySources(entry) {
  const pageUrl = String(entry?.pageUrl || "").trim();
  if (!pageUrl) {
    return [];
  }
  const cached = notariellesPageCache.get(pageUrl);
  if (cached && Date.now() < Number(cached.expiresAt || 0)) {
    return Array.isArray(cached.sources) ? cached.sources : [];
  }

  const language = String(entry?.language || "VF").toUpperCase();
  const sources = [];
  let playerPageUrl = "";

  try {
    const pageResponse = await fetchRemoteText(pageUrl, "text/html,application/xhtml+xml", NOTARIELLES_FETCH_HEADERS);
    if (pageResponse.status >= 200 && pageResponse.status < 300) {
      playerPageUrl = parseNotariellesPlayerPageUrl(pageResponse.body);
    }
  } catch {
    playerPageUrl = "";
  }

  try {
    if (playerPageUrl) {
      const playerResponse = await fetchRemoteText(
        playerPageUrl,
        "text/html,application/xhtml+xml",
        NOTARIELLES_FETCH_HEADERS
      );
      if (playerResponse.status >= 200 && playerResponse.status < 300) {
        const directStreamUrl = parseNotariellesDirectStreamUrl(playerResponse.body, playerPageUrl);
        if (directStreamUrl) {
          sources.unshift({
            stream_url: directStreamUrl,
            source_name: "Notarielles Direct",
            quality: "Notarielles",
            language,
            format: directStreamUrl.includes(".m3u8") ? "hls" : "mp4",
            priority: language === "VF" ? 350 : 335,
          });
        }
      }
    }
  } catch {
    // keep embed fallback
  }

  const dedupe = new Set();
  const normalized = sources.filter((sourceRow) => {
    const key = String(sourceRow?.stream_url || "").trim();
    if (!key || dedupe.has(key)) {
      return false;
    }
    dedupe.add(key);
    return true;
  });
  notariellesPageCache.set(pageUrl, {
    sources: normalized,
    expiresAt: Date.now() + NOTARIELLES_PAGE_CACHE_MS,
  });
  prunePidoovTimedCache(notariellesPageCache, 1200);
  return normalized;
}

async function resolveNotariellesSourcesByEpisode(title, season, episode) {
  const safeTitle = String(title || "").trim();
  const safeSeason = toInt(season, 0, 0, 400);
  const safeEpisode = toInt(episode, 0, 0, 20000);
  if (safeTitle.length < 2 || safeSeason <= 0 || safeEpisode <= 0) {
    return [];
  }

  const queryTitleKey = normalizeTitleKey(safeTitle);
  if (!queryTitleKey) {
    return [];
  }

  const cacheKey = `${queryTitleKey}|${safeSeason}|${safeEpisode}`;
  const cached = readPidoovLookupCache(`notarielles:${cacheKey}`);
  if (cached) {
    return cached;
  }

  const index = await loadNotariellesIndex();
  const ranked = (Array.isArray(index) ? index : [])
    .map((entry) => ({
      entry,
      score: scoreNotariellesCandidate(entry, queryTitleKey, safeSeason, safeEpisode),
    }))
    .filter((row) => row.score > 120)
    .sort((left, right) => right.score - left.score)
    .slice(0, NOTARIELLES_MAX_MATCH_CANDIDATES);

  if (ranked.length === 0) {
    storePidoovLookupCache(`notarielles:${cacheKey}`, [], NOTARIELLES_SEARCH_CACHE_MS);
    return [];
  }

  const merged = [];
  const seen = new Set();
  for (const row of ranked) {
    let rows = [];
    try {
      rows = await loadNotariellesEntrySources(row.entry);
    } catch {
      rows = [];
    }
    rows.forEach((entry) => {
      const key = String(entry?.stream_url || "").trim();
      if (!key || seen.has(key)) {
        return;
      }
      seen.add(key);
      merged.push(entry);
    });
  }

  storePidoovLookupCache(`notarielles:${cacheKey}`, merged, NOTARIELLES_SEARCH_CACHE_MS);
  return merged;
}

function normalizeRendezvousPath(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  let parsed;
  try {
    parsed = new URL(raw, `${RENDEZVOUS_BASE}/`);
  } catch {
    return "";
  }
  if (normalizeHostName(parsed.hostname) !== RENDEZVOUS_HOST) {
    return "";
  }
  return `${parsed.pathname}${parsed.search}`;
}

function normalizeRendezvousLanguage(value) {
  const safe = normalizePidoovLanguage(value);
  if (safe) {
    return safe;
  }
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return "";
  }
  if (raw.includes("vostfr")) {
    return "VOSTFR";
  }
  if (raw.includes("vf")) {
    return "VF";
  }
  return "";
}

function parseRendezvousEntryFromUrl(value) {
  const rawPath = normalizeRendezvousPath(value);
  if (!rawPath) {
    return null;
  }
  const parsed = parseSafeRemoteUrl(`${RENDEZVOUS_BASE}${rawPath}`);
  if (!parsed) {
    return null;
  }

  const pathnameRaw = String(parsed.pathname || "");
  let pathname = pathnameRaw;
  try {
    pathname = decodeURIComponent(pathnameRaw);
  } catch {
    pathname = pathnameRaw;
  }
  const match = pathname.match(/\/vf-(?<id>\d+)-(?<lang>[^/]+)\/stream-(?<slug>[^/?#]+)\.html\/?$/i);
  if (!match) {
    return null;
  }

  const mediaId = toInt(match.groups?.id, 0, 0, 999999999);
  if (mediaId <= 0) {
    return null;
  }

  const languageHint = normalizeRendezvousLanguage(match.groups?.lang || "") || "VF";
  const slugRaw = String(match.groups?.slug || "").trim();
  if (!slugRaw) {
    return null;
  }
  let decodedSlug = slugRaw;
  try {
    decodedSlug = decodeURIComponent(slugRaw);
  } catch {
    decodedSlug = slugRaw;
  }
  decodedSlug = decodedSlug.replace(/\+/g, " ");

  const tvMatch = decodedSlug.match(
    /^(?<title>.+?)-+Saison-(?<season>\d+)-Episode-(?<episode>\d+)-(?<year>(?:19|20)\d{2})$/i
  );
  const episodeOnlyMatch = decodedSlug.match(
    /^(?<title>.+?)-+Episode-(?<episode>\d+)-(?<year>(?:19|20)\d{2})$/i
  );
  const movieMatch = decodedSlug.match(/^(?<title>.+)-(?<year>(?:19|20)\d{2})$/i);

  let mediaType = "movie";
  let season = 0;
  let episode = 0;
  let year = 0;
  let titleRaw = decodedSlug;

  if (tvMatch) {
    mediaType = "tv";
    season = toInt(tvMatch.groups?.season, 0, 0, 500);
    episode = toInt(tvMatch.groups?.episode, 0, 0, 50000);
    year = toInt(tvMatch.groups?.year, 0, 0, 2099);
    titleRaw = String(tvMatch.groups?.title || "");
  } else if (episodeOnlyMatch) {
    mediaType = "tv";
    season = 1;
    episode = toInt(episodeOnlyMatch.groups?.episode, 0, 0, 50000);
    year = toInt(episodeOnlyMatch.groups?.year, 0, 0, 2099);
    titleRaw = String(episodeOnlyMatch.groups?.title || "");
  } else if (movieMatch) {
    mediaType = "movie";
    year = toInt(movieMatch.groups?.year, 0, 0, 2099);
    titleRaw = String(movieMatch.groups?.title || "");
  } else {
    year = toInt(parseYearFromText(decodedSlug), 0, 0, 2099);
    titleRaw = decodedSlug.replace(/-(?:19|20)\d{2}$/i, "");
  }

  const title = slugToReadableTitle(titleRaw);
  const titleKey = normalizeTitleKey(title);
  if (!title || !titleKey) {
    return null;
  }

  return {
    mediaId,
    title,
    titleKey,
    mediaType,
    year,
    season,
    episode,
    language: languageHint,
    pageUrl: parsed.href,
  };
}

function parseRendezvousEntryUrlsFromHtml(html, baseUrl = `${RENDEZVOUS_BASE}/`) {
  const source = String(html || "");
  if (!source) {
    return [];
  }

  const urls = [];
  const seen = new Set();
  const hrefRegex = /href=["'](?<href>[^"']+)["']/gi;
  let match = null;
  while ((match = hrefRegex.exec(source)) !== null) {
    const rawHref = String(match.groups?.href || "").trim();
    if (!rawHref) {
      continue;
    }
    if (!/\/vf-\d+-[^/]+\/stream-[^"']+\.html(?:$|[?#])/i.test(rawHref)) {
      continue;
    }

    let absolute = rawHref;
    try {
      absolute = new URL(rawHref, String(baseUrl || `${RENDEZVOUS_BASE}/`)).href;
    } catch {
      absolute = rawHref;
    }
    const normalizedPath = normalizeRendezvousPath(absolute);
    if (!normalizedPath) {
      continue;
    }
    const canonicalUrl = `${RENDEZVOUS_BASE}${normalizedPath}`;
    if (seen.has(canonicalUrl)) {
      continue;
    }
    seen.add(canonicalUrl);
    urls.push(canonicalUrl);
  }
  return urls;
}

async function loadRendezvousEntriesFromPages(pageUrls) {
  const targets = Array.isArray(pageUrls) ? pageUrls.filter(Boolean) : [];
  if (targets.length === 0) {
    return [];
  }
  const pageRows = await mapWithConcurrency(
    targets,
    Math.min(RENDEZVOUS_FETCH_CONCURRENCY, targets.length || 1),
    async (pageUrl) => {
      try {
        const response = await fetchRemoteText(pageUrl, "text/html,application/xhtml+xml", RENDEZVOUS_FETCH_HEADERS);
        if (response.status < 200 || response.status >= 300) {
          return [];
        }
        const urls = parseRendezvousEntryUrlsFromHtml(response.body, pageUrl);
        return urls
          .map((url) => parseRendezvousEntryFromUrl(url))
          .filter(Boolean);
      } catch {
        return [];
      }
    }
  );
  return pageRows.flat();
}

function scoreRendezvousCandidate(entry, options = {}) {
  const queryTitleKey = String(options?.titleKey || "").trim();
  const mediaType = String(options?.mediaType || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const year = toInt(options?.year, 0, 0, 2099);
  const season = toInt(options?.season, 0, 0, 500);
  const episode = toInt(options?.episode, 0, 0, 50000);
  if (!entry || !queryTitleKey) {
    return -9999;
  }

  let score = 0;
  const entryType = String(entry.mediaType || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  if (entryType === mediaType) {
    score += 120;
  } else {
    score -= 150;
  }

  const titleKey = String(entry.titleKey || "").trim();
  if (titleKey === queryTitleKey) {
    score += 360;
  } else if (titleKey.includes(queryTitleKey) || queryTitleKey.includes(titleKey)) {
    score += 170;
  }
  const queryTokens = getPidoovTitleTokens(queryTitleKey);
  const candidateTokens = new Set(getPidoovTitleTokens(titleKey));
  let overlaps = 0;
  queryTokens.forEach((token) => {
    if (candidateTokens.has(token)) {
      overlaps += 1;
    }
  });
  score += overlaps * 28;
  if (queryTokens.length > 0) {
    const ratio = overlaps / queryTokens.length;
    if (ratio >= 1) {
      score += 90;
    } else if (ratio >= 0.7) {
      score += 40;
    } else if (ratio < 0.3) {
      score -= 85;
    }
  }

  if (mediaType === "tv") {
    if (season > 0) {
      if (Number(entry.season) === season) {
        score += 240;
      } else {
        score -= 180;
      }
    }
    if (episode > 0) {
      if (Number(entry.episode) === episode) {
        score += 260;
      } else {
        score -= 200;
      }
    }
  } else if (year > 0) {
    const candidateYear = toInt(entry.year, 0, 0, 2099);
    if (candidateYear === year) {
      score += 170;
    } else if (candidateYear > 0 && Math.abs(candidateYear - year) <= 1) {
      score += 85;
    } else if (candidateYear > 0 && Math.abs(candidateYear - year) >= 4) {
      score -= 40;
    }
  }

  const language = String(entry.language || "").trim().toUpperCase();
  if (language === "VF") {
    score += 20;
  } else if (language === "VOSTFR") {
    score += 12;
  }
  return score;
}

async function loadRendezvousIndex(force = false) {
  const now = Date.now();
  if (
    !force &&
    rendezvousIndexCache.loadedAt > 0 &&
    now - rendezvousIndexCache.loadedAt < RENDEZVOUS_INDEX_CACHE_MS &&
    Array.isArray(rendezvousIndexCache.entries) &&
    rendezvousIndexCache.entries.length > 0
  ) {
    return rendezvousIndexCache.entries;
  }
  if (rendezvousIndexCache.inFlight) {
    return rendezvousIndexCache.inFlight;
  }

  const task = (async () => {
    let sitemapUrls = [];
    try {
      const indexResponse = await fetchRemoteText(
        RENDEZVOUS_SITEMAP_INDEX_URL,
        "application/xml,text/xml",
        RENDEZVOUS_FETCH_HEADERS
      );
      if (indexResponse.status >= 200 && indexResponse.status < 300) {
        sitemapUrls = parseXmlLocRows(indexResponse.body)
          .map((entry) => String(entry?.loc || "").trim())
          .filter((entry) => {
            const parsed = parseSafeRemoteUrl(entry);
            return parsed && normalizeHostName(parsed.hostname) === RENDEZVOUS_HOST;
          })
          .slice(0, RENDEZVOUS_MAX_SITEMAPS);
      }
    } catch {
      sitemapUrls = [];
    }

    const lastmodByPageUrl = new Map();
    const sitemapRows =
      sitemapUrls.length > 0
        ? await mapWithConcurrency(
            sitemapUrls,
            Math.min(RENDEZVOUS_FETCH_CONCURRENCY, sitemapUrls.length || 1),
            async (sitemapUrl) => {
              try {
                const response = await fetchRemoteText(
                  sitemapUrl,
                  "application/xml,text/xml",
                  RENDEZVOUS_FETCH_HEADERS
                );
                if (response.status < 200 || response.status >= 300) {
                  return [];
                }
                return parseXmlLocRows(response.body);
              } catch {
                return [];
              }
            }
          )
        : [];

    const dedupe = new Map();
    const sitemapPageCandidates = [];
    const sitemapPageSeen = new Set();
    sitemapRows.forEach((rows) => {
      if (!Array.isArray(rows)) {
        return;
      }
      rows.forEach((row) => {
        const url = String(row?.loc || row || "").trim();
        const lastmod = toIsoDate(row?.lastmod || "");
        const normalizedPath = normalizeRendezvousPath(url);
        if (normalizedPath && /\/page\/\d+\/?$/i.test(normalizedPath)) {
          const pageUrl = `${RENDEZVOUS_BASE}${normalizedPath}`;
          if (!sitemapPageSeen.has(pageUrl)) {
            sitemapPageSeen.add(pageUrl);
            if (sitemapPageCandidates.length < RENDEZVOUS_PAGE_PROBE_COUNT) {
              sitemapPageCandidates.push(pageUrl);
            }
          }
        }

        const entry = parseRendezvousEntryFromUrl(url);
        const key = String(entry?.pageUrl || "").trim();
        if (key && lastmod && !lastmodByPageUrl.has(key)) {
          lastmodByPageUrl.set(key, lastmod);
        }
        if (entry && key && !dedupe.has(key)) {
          dedupe.set(key, {
            ...entry,
            lastmod,
          });
        }
      });
    });

    const seedUrls = RENDEZVOUS_SEED_PATHS.map((pathToken) => {
      try {
        return new URL(pathToken, `${RENDEZVOUS_BASE}/`).href;
      } catch {
        return "";
      }
    }).filter(Boolean);
    const probeUrls = [];
    const probeSeen = new Set();
    seedUrls.concat(sitemapPageCandidates).forEach((entry) => {
      const safeUrl = String(entry || "").trim();
      if (!safeUrl || probeSeen.has(safeUrl)) {
        return;
      }
      probeSeen.add(safeUrl);
      probeUrls.push(safeUrl);
    });

    const seedEntries = await loadRendezvousEntriesFromPages(probeUrls);
    seedEntries.forEach((entry) => {
      const key = String(entry?.pageUrl || "").trim();
      if (!key || dedupe.has(key)) {
        return;
      }
      dedupe.set(key, {
        ...entry,
        lastmod: String(lastmodByPageUrl.get(key) || ""),
      });
    });

    const staticEntries = loadRendezvousStaticEntries();
    staticEntries.forEach((entry) => {
      const key = String(entry?.pageUrl || "").trim();
      if (!key || dedupe.has(key)) {
        return;
      }
      dedupe.set(key, {
        ...entry,
        lastmod: String(entry?.lastmod || lastmodByPageUrl.get(key) || ""),
      });
    });

    const entries = Array.from(dedupe.values());
    rendezvousIndexCache.entries = entries;
    rendezvousIndexCache.loadedAt = Date.now();
    return rendezvousIndexCache.entries;
  })();

  rendezvousIndexCache.inFlight = task;
  try {
    return await task;
  } catch (error) {
    if (Array.isArray(rendezvousIndexCache.entries) && rendezvousIndexCache.entries.length > 0) {
      return rendezvousIndexCache.entries;
    }
    throw error;
  } finally {
    rendezvousIndexCache.inFlight = null;
  }
}

function decodeRendezvousHtmlEntities(value) {
  const source = String(value || "");
  if (!source) {
    return "";
  }
  return source
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => {
      const code = Number.parseInt(String(hex || ""), 16);
      if (!Number.isFinite(code) || code <= 0) {
        return "";
      }
      try {
        return String.fromCharCode(code);
      } catch {
        return "";
      }
    })
    .replace(/&#(\d+);/g, (_match, dec) => {
      const code = Number.parseInt(String(dec || ""), 10);
      if (!Number.isFinite(code) || code <= 0) {
        return "";
      }
      try {
        return String.fromCharCode(code);
      } catch {
        return "";
      }
    });
}

function normalizeRendezvousPlayerName(value) {
  const raw = sanitizeToken(value, 80).toLowerCase();
  if (!raw) {
    return "";
  }
  const compact = raw.replace(/[^a-z0-9]+/g, "");
  const aliasMap = new Map([
    ["lecteurhd", "hd"],
    ["hd", "hd"],
    ["younetu", "younetu"],
    ["netu", "netu"],
    ["dood", "dood"],
    ["doodstream", "doodstream"],
    ["fembed", "fembed"],
    ["uqload", "uqload"],
    ["uptostream", "uptostream"],
    ["vidoza", "vidoza"],
    ["upvid", "upvid"],
    ["rakuten", "rakuten"],
    ["google", "google"],
    ["primevideo", "primevideo"],
  ]);
  if (aliasMap.has(compact)) {
    return String(aliasMap.get(compact) || "");
  }
  return raw.replace(/\s+/g, " ").trim();
}

function toRendezvousGoCandidates(token, name) {
  const safeToken = sanitizeToken(token, 90);
  const safeName = normalizeRendezvousPlayerName(name);
  if (!safeToken || !safeName) {
    return [];
  }
  const variants = new Set([safeName]);
  if (safeName === "netu") {
    variants.add("younetu");
  }
  if (safeName === "younetu") {
    variants.add("netu");
  }

  const urls = [];
  variants.forEach((variant) => {
    [
      `${RENDEZVOUS_BASE}/go.php?id=${encodeURIComponent(safeToken)}&name=${encodeURIComponent(variant)}`,
      `${RENDEZVOUS_BASE}/go.php?name=${encodeURIComponent(variant)}&id=${encodeURIComponent(safeToken)}`,
      `${RENDEZVOUS_BASE}/go.php?data=${encodeURIComponent(safeToken)}&name=${encodeURIComponent(variant)}`,
    ].forEach((candidate) => {
      const parsed = parseSafeRemoteUrl(candidate);
      if (parsed && normalizeHostName(parsed.hostname) === RENDEZVOUS_HOST) {
        urls.push(parsed.href);
      }
    });
  });
  return urls;
}

function resolveRendezvousOutboundHref(rawHref, pageUrl) {
  const source = decodeRendezvousHtmlEntities(String(rawHref || "").trim());
  if (!source) {
    return "";
  }
  let absolute = source;
  try {
    absolute = new URL(source, String(pageUrl || `${RENDEZVOUS_BASE}/`)).href;
  } catch {
    absolute = source;
  }
  const parsed = parseSafeRemoteUrl(absolute);
  if (!parsed) {
    return "";
  }
  if (normalizeHostName(parsed.hostname) === RENDEZVOUS_HOST && /\/a\.php$/i.test(String(parsed.pathname || ""))) {
    const forwarded = decodeRendezvousHtmlEntities(parsed.searchParams.get("b") || "");
    const direct = parseSafeRemoteUrl(forwarded);
    if (direct) {
      return direct.href;
    }
  }
  return parsed.href;
}

function parseRendezvousPlayerRowsFromHtml(html, pageUrl) {
  const source = String(html || "");
  if (!source) {
    return [];
  }

  const rows = [];
  const knownTokens = [];
  const liRegex = /<li\b(?<attrs>[^>]*)>(?<body>[\s\S]*?)<\/li>/gi;
  let match = null;
  while ((match = liRegex.exec(source)) !== null) {
    const attrs = String(match.groups?.attrs || "");
    const body = String(match.groups?.body || "");
    const classMatch = attrs.match(/\sclass=["'](?<classes>[^"']+)["']/i);
    const className = String(classMatch?.groups?.classes || "").toLowerCase();
    if (!/(?:^|\s)(?:nopls|nopl|ser_pl)(?:\s|$)/i.test(className)) {
      continue;
    }

    const idMatch = attrs.match(/\sdata-id=["'](?<id>[^"']+)["']/i);
    const nameMatch = attrs.match(/\sdata-name=["'](?<name>[^"']+)["']/i);
    const pLinkMatch = attrs.match(/\sdata-plink=["'](?<plink>[^"']+)["']/i);
    const token = sanitizeToken(String(idMatch?.groups?.id || "").trim(), 90);
    if (token) {
      knownTokens.push(token);
    }

    const serverNameMatch = body.match(/pmovie__stream-select-server[^>]*>(?<label>[\s\S]*?)<\/div>/i);
    const labelText = sanitizeToken(
      decodeRendezvousHtmlEntities(String(serverNameMatch?.groups?.label || ""))
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " "),
      80
    );
    const rawName = String(nameMatch?.groups?.name || "").trim() || labelText;
    const safeName = normalizeRendezvousPlayerName(rawName) || "hd";

    const dataPLink = String(pLinkMatch?.groups?.plink || "").trim();
    if (dataPLink) {
      const href = resolveRendezvousOutboundHref(dataPLink, pageUrl);
      const parsed = parseSafeRemoteUrl(href);
      if (parsed) {
        rows.push({
          type: "plink",
          name: safeName,
          urls: [parsed.href],
        });
      }
    }

    if (token && safeName) {
      const candidates = toRendezvousGoCandidates(token, safeName);
      if (candidates.length > 0) {
        rows.push({
          type: "token",
          name: safeName,
          token,
          urls: candidates,
        });
      }
    }

    const anchorRegex = /<a[^>]+href=["'](?<href>[^"']+)["'][^>]*>/gi;
    let anchorMatch = null;
    while ((anchorMatch = anchorRegex.exec(body)) !== null) {
      const href = resolveRendezvousOutboundHref(anchorMatch.groups?.href || "", pageUrl);
      const parsed = parseSafeRemoteUrl(href);
      if (!parsed) {
        continue;
      }
      rows.push({
        type: "anchor",
        name: safeName,
        urls: [parsed.href],
      });
    }
  }

  const seedToken = knownTokens.find(Boolean) || "";
  if (seedToken) {
    const listedNameRegex = /Lien\s*\d+\s*:\s*(?<name>[A-Za-z0-9_-]{2,40})\s*(?:Add|Ajouter|HDTV)?/gi;
    let listed = null;
    while ((listed = listedNameRegex.exec(source)) !== null) {
      const safeName = normalizeRendezvousPlayerName(listed.groups?.name || "");
      if (!safeName) {
        continue;
      }
      const urls = toRendezvousGoCandidates(seedToken, safeName);
      if (urls.length === 0) {
        continue;
      }
      rows.push({
        type: "token-list",
        name: safeName,
        token: seedToken,
        urls,
      });
    }
  }

  const dedupe = new Set();
  return rows.filter((row) => {
    const key = `${row.type}:${row.name}:${(row.urls || []).join("|")}`;
    if (!key || dedupe.has(key)) {
      return false;
    }
    dedupe.add(key);
    return true;
  });
}

function parseRendezvousStreamUrlsFromHtml(html, baseUrl) {
  const source = String(html || "");
  if (!source) {
    return [];
  }
  const urls = [];
  const seen = new Set();

  const pushCandidate = (rawUrl) => {
    const value = String(rawUrl || "").trim();
    if (!value) {
      return;
    }
    let absolute = value;
    try {
      absolute = new URL(value, String(baseUrl || `${RENDEZVOUS_BASE}/`)).href;
    } catch {
      absolute = value;
    }
    const parsed = parseSafeRemoteUrl(absolute);
    if (!parsed) {
      return;
    }
    const href = parsed.href;
    if (!href || seen.has(href)) {
      return;
    }
    const pathname = String(parsed.pathname || "").toLowerCase();
    if (pathname.includes("/universal.mp4") || pathname.includes("/wb.php")) {
      return;
    }
    seen.add(href);
    urls.push(href);
  };

  const patterns = [
    /<iframe[^>]+src=["'](?<url>[^"']+)["']/gi,
    /<source[^>]+src=["'](?<url>[^"']+)["']/gi,
    /<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=(?<url>[^"']+)["']/gi,
    /(?:window\.)?location(?:\.href)?\s*=\s*["'](?<url>[^"']+)["']/gi,
    /top\.location\s*=\s*["'](?<url>[^"']+)["']/gi,
  ];

  patterns.forEach((regex) => {
    let match = null;
    while ((match = regex.exec(source)) !== null) {
      pushCandidate(match.groups?.url || "");
    }
  });

  return urls;
}

async function loadRendezvousEntrySources(entry) {
  const pageUrl = String(entry?.pageUrl || "").trim();
  if (!pageUrl) {
    return [];
  }
  const cached = rendezvousPageCache.get(pageUrl);
  if (cached && Date.now() < Number(cached.expiresAt || 0)) {
    return Array.isArray(cached.sources) ? cached.sources : [];
  }

  const language = String(entry?.language || "VF").toUpperCase() || "VF";
  const sources = [];
  const seen = new Set();
  const pushSource = (row) => {
    const safeUrl = String(row?.stream_url || "").trim();
    if (!safeUrl || seen.has(safeUrl)) {
      return;
    }
    seen.add(safeUrl);
    sources.push(row);
  };

  const staticRows = Array.isArray(entry?.staticSources) ? entry.staticSources : [];
  staticRows.forEach((sourceRow, index) => {
    const parsed = parseSafeRemoteUrl(sourceRow?.stream_url || "");
    if (!parsed) {
      return;
    }
    const format = String(sourceRow?.format || "").trim().toLowerCase();
    pushSource({
      stream_url: parsed.href,
      source_name: String(sourceRow?.source_name || "Rendezvous").trim() || "Rendezvous",
      quality: "Rendezvous",
      language,
      format: format === "hls" || format === "mp4" || format === "embed" ? format : "embed",
      priority: 350 - Math.min(40, index * 5),
    });
  });

  let pageHtml = "";
  try {
    const response = await fetchRemoteText(pageUrl, "text/html,application/xhtml+xml", {
      ...RENDEZVOUS_FETCH_HEADERS,
      Referer: pageUrl,
    });
    if (response.status >= 200 && response.status < 300) {
      pageHtml = String(response.body || "");
    }
  } catch {
    pageHtml = "";
  }

  if (pageHtml) {
    const playerRows = parseRendezvousPlayerRowsFromHtml(pageHtml, pageUrl);
    const probeTargets = [];

    playerRows.forEach((row, index) => {
      const rowName = String(row?.name || "").trim().toUpperCase() || "HD";
      const basePriority = language === "VF" ? 336 : 322;
      const rowPenalty = Math.min(36, index * 6);
      const rowType = String(row?.type || "").trim().toLowerCase();
      const typePenalty = rowType === "anchor" ? 72 : 0;
      (Array.isArray(row?.urls) ? row.urls : []).forEach((url, urlIndex) => {
        const parsed = parseSafeRemoteUrl(url);
        if (!parsed) {
          return;
        }
        const pathname = String(parsed.pathname || "").toLowerCase();
        if (normalizeHostName(parsed.hostname || "") === RENDEZVOUS_HOST && pathname === "/go.php" && !parsed.search) {
          return;
        }
        const href = parsed.href;
        const host = normalizeHostName(parsed.hostname || "");
        const canProbe =
          host === RENDEZVOUS_HOST ||
          /(?:^|\.)((?:netu|younetu|doodstream|dood|uqload|uptostream|upvid|vidoza|fembed))(?:\.|$)/i.test(host);
        pushSource({
          stream_url: href,
          source_name: rowName ? `Rendezvous ${rowName}` : "Rendezvous",
          quality: "Rendezvous",
          language,
          format: "embed",
          priority: basePriority - rowPenalty - typePenalty - Math.min(12, urlIndex * 3),
        });
        if (canProbe && probeTargets.length < 7) {
          probeTargets.push({
            url: href,
            sourceName: rowName ? `Rendezvous ${rowName}` : "Rendezvous",
          });
        }
      });
    });

    const probeRows = await mapWithConcurrency(
      probeTargets,
      Math.min(RENDEZVOUS_FETCH_CONCURRENCY, probeTargets.length || 1),
      async (target) => {
        try {
          const response = await fetchRemoteText(target.url, "text/html,application/xhtml+xml", {
            ...RENDEZVOUS_FETCH_HEADERS,
            Referer: pageUrl,
          });
          if (response.status < 200 || response.status >= 400) {
            return [];
          }
          return parseRendezvousStreamUrlsFromHtml(response.body, target.url).map((streamUrl) => ({
            stream_url: streamUrl,
            source_name: target.sourceName,
          }));
        } catch {
          return [];
        }
      }
    );

    probeRows.flat().forEach((row, index) => {
      const parsed = parseSafeRemoteUrl(row?.stream_url || "");
      if (!parsed) {
        return;
      }
      const isHls = /\.m3u8(?:$|\?)/i.test(parsed.href);
      const isMp4 = /\.mp4(?:$|\?)/i.test(parsed.href);
      pushSource({
        stream_url: parsed.href,
        source_name: String(row?.source_name || "Rendezvous Direct").trim() || "Rendezvous Direct",
        quality: "Rendezvous",
        language,
        format: isHls ? "hls" : isMp4 ? "mp4" : "embed",
        priority: (language === "VF" ? 358 : 344) - Math.min(34, index * 4),
      });
    });
  }

  rendezvousPageCache.set(pageUrl, {
    sources,
    expiresAt: Date.now() + RENDEZVOUS_PAGE_CACHE_MS,
  });
  prunePidoovTimedCache(rendezvousPageCache, 1600);
  return sources;
}

async function resolveRendezvousSourcesByTitle(title, options = {}) {
  const safeTitle = String(title || "").trim();
  if (safeTitle.length < 2) {
    return [];
  }
  const mediaType = String(options?.type || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const year = toInt(options?.year, 0, 0, 2099);
  const season = toInt(options?.season, 1, 1, 500);
  const episode = toInt(options?.episode, 1, 1, 50000);

  const queryTitleKey = normalizeTitleKey(safeTitle);
  if (!queryTitleKey) {
    return [];
  }

  const cacheKey = `${queryTitleKey}|${mediaType}|${year}|${season}|${episode}`;
  const cached = readPidoovLookupCache(`rendezvous:${cacheKey}`);
  if (cached) {
    return cached;
  }

  const index = await loadRendezvousIndex();
  const ranked = (Array.isArray(index) ? index : [])
    .map((entry) => ({
      entry,
      score: scoreRendezvousCandidate(entry, {
        titleKey: queryTitleKey,
        mediaType,
        year,
        season,
        episode,
      }),
    }))
    .filter((row) => row.score > (mediaType === "tv" ? 130 : 100))
    .sort((left, right) => right.score - left.score)
    .slice(0, RENDEZVOUS_MAX_MATCH_CANDIDATES);

  if (ranked.length === 0) {
    storePidoovLookupCache(`rendezvous:${cacheKey}`, [], RENDEZVOUS_SEARCH_CACHE_MS);
    return [];
  }

  const merged = [];
  const seen = new Set();
  for (const row of ranked) {
    let rows = [];
    try {
      rows = await loadRendezvousEntrySources(row.entry);
    } catch {
      rows = [];
    }
    rows.forEach((sourceRow) => {
      const key = String(sourceRow?.stream_url || "").trim();
      if (!key || seen.has(key)) {
        return;
      }
      seen.add(key);
      merged.push(sourceRow);
    });
  }

  storePidoovLookupCache(`rendezvous:${cacheKey}`, merged, RENDEZVOUS_SEARCH_CACHE_MS);
  return merged;
}

function normalizeSupplementalMediaType(value) {
  return String(value || "").toLowerCase() === "tv" ? "tv" : "movie";
}

function buildSupplementalSemanticKey(entry) {
  const titleKey = normalizeTitleKey(entry?.titleKey || entry?.title || "");
  const mediaType = normalizeSupplementalMediaType(entry?.type || entry?.mediaType || "");
  const year = toInt(entry?.year, 0, 0, 2099);
  const season = mediaType === "tv" ? toInt(entry?.season, 0, 0, 500) : 0;
  const episode = mediaType === "tv" ? toInt(entry?.episode, 0, 0, 50000) : 0;
  return `${titleKey}::${mediaType}::${year}::${season}::${episode}`;
}

function toSupplementalReleaseDate(entry) {
  const fromLastmod = toIsoDate(entry?.lastmod || entry?.updatedAt || "");
  if (fromLastmod) {
    return fromLastmod;
  }
  const year = toInt(entry?.year, 0, 0, 2099);
  if (year > 0) {
    return `${year}-01-01`;
  }
  return "";
}

function scoreSupplementalCandidate(entry) {
  if (!entry) {
    return -9999;
  }
  let score = 0;
  const language = normalizePidoovLanguage(entry?.language || "") || "VF";
  if (language === "VF") {
    score += 40;
  } else if (language === "MULTI") {
    score += 30;
  } else if (language === "VOSTFR") {
    score += 24;
  } else {
    score += 8;
  }
  const provider = String(entry.provider || "").trim().toLowerCase();
  if (provider === "nakios") {
    score += 16;
  } else if (provider === "pidoov") {
    score += 14;
  } else if (provider === "rendezvous") {
    score += 12;
  }
  const releaseDate = toSupplementalReleaseDate(entry);
  if (releaseDate) {
    score += 16;
  }
  if (String(entry?.detailUrl || entry?.pageUrl || "").trim()) {
    score += 8;
  }
  if (normalizeSupplementalMediaType(entry?.type || entry?.mediaType || "") === "tv") {
    const season = toInt(entry?.season, 0, 0, 500);
    const episode = toInt(entry?.episode, 0, 0, 50000);
    if (season > 0 && episode > 0) {
      score += 12;
    }
  }
  return score;
}

function sanitizeSupplementalTitle(value) {
  const parsed = parseSeasonEpisodeFromTitleText(value);
  const title = String(parsed?.title || "").trim();
  return title || String(value || "").trim();
}

function isAllowedSupplementalDetailHost(hostname) {
  const safeHost = normalizeHostName(hostname);
  if (!safeHost) {
    return false;
  }
  return (
    safeHost === NAKIOS_HOST ||
    safeHost.endsWith(`.${NAKIOS_HOST}`) ||
    safeHost === NAKIOS_API_HOST ||
    safeHost.endsWith(`.${NAKIOS_API_HOST}`) ||
    safeHost === PIDOOV_HOST ||
    safeHost.endsWith(`.${PIDOOV_HOST}`) ||
    safeHost === RENDEZVOUS_HOST ||
    safeHost.endsWith(`.${RENDEZVOUS_HOST}`) ||
    safeHost === NOTARIELLES_HOST ||
    safeHost.endsWith(`.${NOTARIELLES_HOST}`)
  );
}

function decodeHtmlAttribute(value) {
  return String(value || "")
    .replace(/&amp;/gi, "&")
    .replace(/&#x2f;/gi, "/")
    .replace(/&#47;/gi, "/")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'");
}

function normalizeSupplementalCoverCandidate(value, baseUrl = "") {
  const decoded = decodeHtmlAttribute(value);
  if (!decoded) {
    return "";
  }
  let candidate = String(decoded || "").trim();
  if (!candidate) {
    return "";
  }
  const wrapped = candidate.match(/^url\((?<inner>.+)\)$/i);
  if (wrapped) {
    candidate = String(wrapped.groups?.inner || "").trim();
  }
  candidate = candidate.replace(/^['"]+/, "").replace(/['"]+$/, "").trim();
  if (!candidate || /^data:/i.test(candidate) || /^javascript:/i.test(candidate)) {
    return "";
  }
  let absolute = candidate;
  try {
    absolute = new URL(candidate, String(baseUrl || "") || undefined).href;
  } catch {
    return "";
  }
  const parsed = parseSafeRemoteUrl(absolute);
  if (!parsed) {
    return "";
  }

  const host = normalizeHostName(parsed.hostname);
  const lowerPath = String(parsed.pathname || "").toLowerCase();
  const imageExtension = /\.(?:jpe?g|png|webp|avif)(?:$|\?)/i.test(lowerPath);
  const hasCoverToken =
    lowerPath.includes("/uploads/posts/covers/") ||
    lowerPath.includes("/t/p/") ||
    lowerPath.includes("cover") ||
    lowerPath.includes("poster");
  const blocked =
    lowerPath.includes("/templates/") ||
    lowerPath.includes("loading.gif") ||
    lowerPath.includes("favicon") ||
    lowerPath.includes("/logo");
  if (blocked) {
    return "";
  }

  const trustedHost =
    isAllowedSupplementalDetailHost(host) ||
    host === "themoviedb.org" ||
    host.endsWith(".themoviedb.org") ||
    host === "tmdb.org" ||
    host.endsWith(".tmdb.org");
  if (!trustedHost && !(imageExtension && hasCoverToken)) {
    return "";
  }
  if (!imageExtension && !hasCoverToken) {
    return "";
  }
  return parsed.href;
}

function scoreSupplementalCoverUrl(url) {
  const lower = String(url || "").toLowerCase();
  if (!lower) {
    return Number.NEGATIVE_INFINITY;
  }
  let score = 0;
  if (lower.includes("/uploads/posts/covers/")) {
    score += 320;
  }
  if (lower.includes("themoviedb.org/t/p/")) {
    score += 300;
  }
  if (lower.includes("/covers/")) {
    score += 190;
  }
  if (lower.includes("poster")) {
    score += 70;
  }
  if (/\.(?:jpe?g|png|webp|avif)(?:$|\?)/i.test(lower)) {
    score += 40;
  }
  if (lower.includes("logo") || lower.includes("favicon") || lower.includes("loading.gif")) {
    score -= 600;
  }
  return score;
}

function extractSupplementalCoverFromHtml(html, baseUrl = "") {
  const source = String(html || "");
  if (!source) {
    return "";
  }

  const rawCandidates = [];
  const collect = (regex) => {
    let match = null;
    while ((match = regex.exec(source)) !== null) {
      rawCandidates.push(String(match?.[1] || "").trim());
    }
  };

  collect(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi);
  collect(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/gi);
  collect(/background-image\s*:\s*url\(([^)]+)\)/gi);
  collect(/<div[^>]+class=["'][^"']*pmovie__poster[^"']*["'][\s\S]{0,1600}?<img[^>]+(?:data-src|src)=["']([^"']+)["']/gi);
  collect(/<p[^>]*>\s*<img[^>]+src=["']([^"']+)["'][^>]*>\s*<\/p>/gi);
  collect(/<img[^>]+(?:data-src|src)=["']([^"']+)["'][^>]*>/gi);

  let bestUrl = "";
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const candidate of rawCandidates) {
    const normalized = normalizeSupplementalCoverCandidate(candidate, baseUrl);
    if (!normalized) {
      continue;
    }
    const score = scoreSupplementalCoverUrl(normalized);
    if (score > bestScore) {
      bestScore = score;
      bestUrl = normalized;
    }
  }
  return bestScore > 0 ? bestUrl : "";
}

function supplementalRowNeedsCover(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }
  return !String(entry?.large_poster_path || entry?.small_poster_path || entry?.wallpaper_poster_path || "").trim();
}

function applySupplementalCoverToRow(entry, coverUrl) {
  const normalized = normalizeSupplementalCoverCandidate(coverUrl);
  if (!entry || !normalized) {
    return;
  }
  if (!String(entry.small_poster_path || "").trim()) {
    entry.small_poster_path = normalized;
  }
  if (!String(entry.large_poster_path || "").trim()) {
    entry.large_poster_path = normalized;
  }
  if (!String(entry.wallpaper_poster_path || "").trim()) {
    entry.wallpaper_poster_path = normalized;
  }
}

async function resolveSupplementalCoverFromDetail(entry) {
  const detailUrl = String(entry?.external_detail_url || entry?.detailUrl || entry?.pageUrl || "").trim();
  if (!detailUrl) {
    return "";
  }
  const parsedDetail = parseSafeRemoteUrl(detailUrl);
  if (!parsedDetail || !isAllowedSupplementalDetailHost(parsedDetail.hostname)) {
    return "";
  }
  const cacheKey = parsedDetail.href;
  const cached = supplementalCoverCache.get(cacheKey);
  if (cached && Date.now() < Number(cached.expiresAt || 0)) {
    return String(cached.cover || "");
  }
  if (supplementalCoverInFlight.has(cacheKey)) {
    return supplementalCoverInFlight.get(cacheKey);
  }

  const provider = String(entry?.external_provider || entry?.provider || "").trim().toLowerCase();
  const requestHeaders =
    provider === "pidoov"
      ? PIDOOV_FETCH_HEADERS
      : provider === "rendezvous"
      ? RENDEZVOUS_FETCH_HEADERS
      : provider === "notarielles"
        ? NOTARIELLES_FETCH_HEADERS
        : undefined;

  const task = (async () => {
    let cover = "";
    try {
      const response = await fetchRemoteText(
        parsedDetail.href,
        "text/html,application/xhtml+xml",
        requestHeaders || undefined
      );
      if (response.status >= 200 && response.status < 300) {
        cover = extractSupplementalCoverFromHtml(response.body, parsedDetail.href);
      }
    } catch {
      cover = "";
    }
    supplementalCoverCache.set(cacheKey, {
      cover,
      expiresAt: Date.now() + (cover ? SUPPLEMENTAL_COVER_CACHE_MS : SUPPLEMENTAL_COVER_EMPTY_CACHE_MS),
    });
    prunePidoovTimedCache(supplementalCoverCache, 9000);
    return cover;
  })();

  supplementalCoverInFlight.set(cacheKey, task);
  try {
    return await task;
  } finally {
    supplementalCoverInFlight.delete(cacheKey);
  }
}

async function hydrateSupplementalRowCovers(entries, limit = SUPPLEMENTAL_COVER_MAX_PER_RESPONSE) {
  const rows = Array.isArray(entries) ? entries : [];
  if (rows.length === 0) {
    return;
  }
  const cap = Math.max(1, Number(limit || SUPPLEMENTAL_COVER_MAX_PER_RESPONSE));
  const grouped = new Map();
  rows.forEach((entry) => {
    if (!supplementalRowNeedsCover(entry)) {
      return;
    }
    const detailUrl = String(entry?.external_detail_url || "").trim();
    if (!detailUrl) {
      return;
    }
    const parsed = parseSafeRemoteUrl(detailUrl);
    if (!parsed || !isAllowedSupplementalDetailHost(parsed.hostname)) {
      return;
    }
    const key = parsed.href;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(entry);
  });
  const targets = Array.from(grouped.entries()).slice(0, cap);
  if (targets.length === 0) {
    return;
  }

  await mapWithConcurrency(
    targets,
    Math.min(SUPPLEMENTAL_COVER_FETCH_CONCURRENCY, targets.length || 1),
    async ([, group]) => {
      const sample = Array.isArray(group) ? group[0] : null;
      if (!sample) {
        return;
      }
      const cover = await resolveSupplementalCoverFromDetail(sample);
      if (!cover) {
        return;
      }
      group.forEach((entry) => {
        applySupplementalCoverToRow(entry, cover);
      });
    }
  );
}

function buildPidoovSupplementalCandidates(entries, providerLabel = "Pidoov", isStatic = false) {
  const rows = [];
  const list = Array.isArray(entries) ? entries : [];
  list.forEach((entry) => {
    const detailPath = normalizePidoovPath(entry?.detailPath || "");
    const titleRaw = sanitizeSupplementalTitle(entry?.title || entry?.label || "");
    if (!titleRaw) {
      return;
    }
    const parsed = parseSeasonEpisodeFromTitleText(titleRaw);
    const title = String(parsed.title || titleRaw).trim();
    const titleKey = normalizeTitleKey(title);
    if (!titleKey) {
      return;
    }
    const mediaType = parsed.kind === "tv" ? "tv" : "movie";
    const season = mediaType === "tv" ? toInt(parsed.season, 0, 0, 500) : 0;
    const episode = mediaType === "tv" ? toInt(parsed.episode, 0, 0, 50000) : 0;
    const year = toInt(entry?.year || parseYearFromText(entry?.label || titleRaw), 0, 0, 2099);
    const language = normalizePidoovLanguage(entry?.language || entry?.label || "") || "VF";
    const detailUrl = detailPath ? `${PIDOOV_BASE}${detailPath}` : "";
    const rawKey = detailPath || `${titleKey}:${year}:${season}:${episode}:${language}`;
    const poster = normalizeSupplementalCoverCandidate(
      entry?.poster || entry?.cover || entry?.image || entry?.poster_url || "",
      detailUrl || `${PIDOOV_BASE}/`
    );
    const backdrop = normalizeSupplementalCoverCandidate(
      entry?.backdrop || entry?.wallpaper || entry?.backdrop_url || poster,
      detailUrl || `${PIDOOV_BASE}/`
    );

    rows.push({
      provider: "pidoov",
      providerLabel,
      isStatic: Boolean(isStatic),
      rawKey,
      title,
      titleKey,
      type: mediaType,
      year,
      season,
      episode,
      language,
      detailUrl,
      pageUrl: detailUrl,
      lastmod: "",
      poster,
      backdrop,
    });
  });
  return rows;
}

function buildRendezvousSupplementalCandidates(entries, providerLabel = "Rendezvous", isStatic = false) {
  const rows = [];
  const list = Array.isArray(entries) ? entries : [];
  list.forEach((entry) => {
    const pageUrl = String(entry?.pageUrl || "").trim();
    const parsedUrl = parseSafeRemoteUrl(pageUrl);
    if (!parsedUrl || normalizeHostName(parsedUrl.hostname) !== RENDEZVOUS_HOST) {
      return;
    }

    const titleRaw = sanitizeSupplementalTitle(entry?.title || "");
    if (!titleRaw) {
      return;
    }
    const titleKey = normalizeTitleKey(titleRaw);
    if (!titleKey) {
      return;
    }

    const mediaType = normalizeSupplementalMediaType(entry?.mediaType || entry?.type || "movie");
    const season = mediaType === "tv" ? toInt(entry?.season, 0, 0, 500) : 0;
    const episode = mediaType === "tv" ? toInt(entry?.episode, 0, 0, 50000) : 0;
    const year = toInt(entry?.year, 0, 0, 2099);
    const language = normalizePidoovLanguage(entry?.language || "") || "VF";
    const poster = normalizeSupplementalCoverCandidate(
      entry?.poster || entry?.cover || entry?.image || entry?.poster_url || "",
      pageUrl
    );
    const backdrop = normalizeSupplementalCoverCandidate(
      entry?.backdrop || entry?.wallpaper || entry?.backdrop_url || poster,
      pageUrl
    );

    rows.push({
      provider: "rendezvous",
      providerLabel,
      isStatic: Boolean(isStatic),
      rawKey: pageUrl || `${titleKey}:${year}:${season}:${episode}:${language}`,
      title: titleRaw,
      titleKey,
      type: mediaType,
      year,
      season,
      episode,
      language,
      detailUrl: pageUrl,
      pageUrl,
      lastmod: toIsoDate(entry?.lastmod || ""),
      poster,
      backdrop,
    });
  });
  return rows;
}

function chooseBestSupplementalCandidate(current, next) {
  if (!current) {
    return next;
  }
  if (!next) {
    return current;
  }
  const currentScore = scoreSupplementalCandidate(current);
  const nextScore = scoreSupplementalCandidate(next);
  if (nextScore > currentScore) {
    return next;
  }
  if (nextScore < currentScore) {
    return current;
  }
  const currentDate = Date.parse(toSupplementalReleaseDate(current) || "");
  const nextDate = Date.parse(toSupplementalReleaseDate(next) || "");
  const currentSafeDate = Number.isFinite(currentDate) ? currentDate : 0;
  const nextSafeDate = Number.isFinite(nextDate) ? nextDate : 0;
  if (nextSafeDate > currentSafeDate) {
    return next;
  }
  const currentPoster = String(current?.poster || "").trim();
  const nextPoster = String(next?.poster || "").trim();
  if (!currentPoster && nextPoster) {
    return next;
  }
  return current;
}

function mapSupplementalCandidateToCatalogRow(entry, fallbackIdSet) {
  const mediaType = normalizeSupplementalMediaType(entry?.type || entry?.mediaType || "");
  const title = String(entry?.title || "").trim();
  const titleKey = normalizeTitleKey(title);
  if (!title || !titleKey) {
    return null;
  }

  const language = normalizePidoovLanguage(entry?.language || "") || "VF";
  const year = toInt(entry?.year, 0, 0, 2099);
  const season = mediaType === "tv" ? toInt(entry?.season, 0, 0, 500) : 0;
  const episode = mediaType === "tv" ? toInt(entry?.episode, 0, 0, 50000) : 0;
  const releaseDate = toSupplementalReleaseDate(entry);
  const rawKey = String(entry?.rawKey || `${titleKey}:${mediaType}:${year}:${season}:${episode}`).trim();
  const detailUrl = String(entry?.detailUrl || entry?.pageUrl || "").trim();
  const poster = normalizeSupplementalCoverCandidate(
    entry?.poster || entry?.cover || entry?.image || entry?.poster_url || "",
    detailUrl || undefined
  );
  const backdrop = normalizeSupplementalCoverCandidate(
    entry?.backdrop || entry?.wallpaper || entry?.backdrop_url || poster,
    detailUrl || undefined
  );

  let id = buildSupplementalMediaId(entry?.provider || "supp", rawKey);
  if (id <= 0) {
    return null;
  }
  const reserved = fallbackIdSet instanceof Set ? fallbackIdSet : new Set();
  while (reserved.has(id)) {
    id += 1;
  }
  reserved.add(id);

  return {
    id,
    type: mediaType === "tv" ? "tv" : "movie",
    title,
    isAnime: false,
    runtime: null,
    release_date: releaseDate || null,
    end_date: null,
    lang: language,
    language,
    small_poster_path: poster,
    large_poster_path: poster,
    wallpaper_poster_path: backdrop || poster,
    external_provider: String(entry?.provider || "").trim(),
    external_key: rawKey,
    external_year: year,
    external_season: season,
    external_episode: episode,
    external_language: language,
    external_detail_url: detailUrl,
    external_label: String(entry?.providerLabel || "").trim(),
    supplemental_rank: scoreSupplementalCandidate(entry),
    supplemental_date: releaseDate || "",
    title_key: titleKey,
  };
}

function toNakiosTmdbPosterUrl(posterPath) {
  const pathRaw = String(posterPath || "").trim();
  if (!pathRaw) {
    return "";
  }
  const pathSafe = pathRaw.startsWith("/") ? pathRaw : `/${pathRaw}`;
  return `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${pathSafe}`;
}

function toNakiosTmdbBackdropUrl(backdropPath, fallbackPosterPath = "") {
  const pathRaw = String(backdropPath || fallbackPosterPath || "").trim();
  if (!pathRaw) {
    return "";
  }
  const pathSafe = pathRaw.startsWith("/") ? pathRaw : `/${pathRaw}`;
  return `https://www.themoviedb.org/t/p/w1920_and_h1080_bestv2${pathSafe}`;
}

function getNakiosTitle(entry, mediaType) {
  if (mediaType === "tv") {
    return String(entry?.name || entry?.title || "").trim();
  }
  return String(entry?.title || entry?.name || "").trim();
}

function getNakiosReleaseDate(entry, mediaType) {
  const raw = mediaType === "tv" ? String(entry?.first_air_date || "").trim() : String(entry?.release_date || "").trim();
  const iso = toIsoDate(raw);
  return iso || "";
}

function scoreNakiosCatalogEntry(entry, mediaType) {
  let score = 0;
  const popularity = Number(entry?.popularity || 0);
  const votes = Number(entry?.vote_count || 0);
  const average = Number(entry?.vote_average || 0);
  score += Math.max(0, Math.min(240, popularity / 2));
  score += Math.max(0, Math.min(60, average * 6));
  score += Math.max(0, Math.min(80, votes / 20));
  if (String(entry?.poster_path || "").trim()) {
    score += 24;
  }
  if (String(entry?.backdrop_path || "").trim()) {
    score += 16;
  }
  if (mediaType === "tv") {
    score += 6;
  } else {
    score += 8;
  }
  return Math.round(score);
}

function isLikelyNakiosAnimeEntry(entry, mediaType) {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  const animeFlags = [entry?.isAnime, entry?.is_anime, entry?.isanime, entry?.anime];
  if (
    animeFlags.some((value) => {
      if (value === true || value === 1) {
        return true;
      }
      const normalized = String(value || "").trim().toLowerCase();
      return normalized === "true" || normalized === "yes";
    })
  ) {
    return true;
  }

  const hintParts = [
    entry?.type,
    entry?.media_type,
    entry?.mediaType,
    entry?.kind,
    entry?.category,
    entry?.genre,
    entry?.status,
    entry?.state,
    entry?.suggestion,
    entry?.original_title,
    entry?.original_name,
  ];
  const hints = hintParts
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean)
    .join(" ");
  if (/\banime\b/.test(hints)) {
    return true;
  }

  if (mediaType !== "tv") {
    return false;
  }

  const genreIds = Array.isArray(entry?.genre_ids) ? entry.genre_ids.map((value) => Number(value || 0)) : [];
  const hasAnimationGenre = genreIds.includes(16);
  if (!hasAnimationGenre) {
    return false;
  }

  const language = String(entry?.original_language || "").trim().toLowerCase();
  const countries = Array.isArray(entry?.origin_country)
    ? entry.origin_country.map((value) => String(value || "").trim().toUpperCase())
    : [];
  return language === "ja" || countries.includes("JP");
}

function buildNakiosCatalogRow(entry, mediaType, fallbackIdSet) {
  const tmdbId = toInt(entry?.id, 0, 0, 999999999);
  if (tmdbId <= 0) {
    return null;
  }

  const title = getNakiosTitle(entry, mediaType);
  const titleKey = normalizeTitleKey(title);
  if (!title || !titleKey) {
    return null;
  }
  if (mediaType === "tv" && isLikelyNakiosAnimeEntry(entry, mediaType)) {
    return null;
  }

  const releaseDate = getNakiosReleaseDate(entry, mediaType);
  const year = toInt(parseYearFromText(releaseDate), 0, 0, 2099);
  const poster = toNakiosTmdbPosterUrl(entry?.poster_path || "");
  const backdrop = toNakiosTmdbBackdropUrl(entry?.backdrop_path || "", entry?.poster_path || "");
  const rawKey = `${mediaType}:${tmdbId}`;
  const rawStatus =
    entry?.availability_status ||
    entry?.external_status ||
    entry?.status ||
    entry?.state ||
    entry?.suggestion ||
    entry?.upload_state ||
    "";
  const normalizedStatus = normalizeNakiosAvailabilityStatus(rawStatus);
  const availabilityStatus =
    normalizedStatus !== "unknown"
      ? normalizedStatus
      : isNakiosLikelyPendingByDate(releaseDate)
        ? "pending"
        : "unknown";

  let id = buildSupplementalMediaId("nakios", rawKey);
  if (id <= 0) {
    return null;
  }
  const reserved = fallbackIdSet instanceof Set ? fallbackIdSet : new Set();
  while (reserved.has(id)) {
    id += 1;
  }
  reserved.add(id);

  return {
    id,
    type: mediaType === "tv" ? "tv" : "movie",
    title,
    isAnime: false,
    runtime: null,
    release_date: releaseDate || null,
    end_date: null,
    lang: "VF",
    language: "VF",
    small_poster_path: poster,
    large_poster_path: poster,
    wallpaper_poster_path: backdrop || poster,
    external_provider: "nakios",
    external_key: rawKey,
    external_tmdb_id: tmdbId,
    external_year: year,
    external_season: 0,
    external_episode: 0,
    external_language: "VF",
    external_detail_url: `${NAKIOS_BASE}/catalogue?q=${encodeURIComponent(title)}`,
    external_label: "NAKIOS",
    external_status: availabilityStatus,
    availability_status: availabilityStatus,
    is_pending_upload: availabilityStatus === "pending",
    supplemental_rank: scoreNakiosCatalogEntry(entry, mediaType),
    supplemental_date: releaseDate || "",
    title_key: titleKey,
  };
}

function buildNakiosSemanticKey(row) {
  const titleKey = normalizeTitleKey(row?.title || "");
  const mediaType = String(row?.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  const year = toInt(row?.external_year, 0, 0, 2099);
  return `${titleKey}::${mediaType}::${year}::0::0`;
}

function pickBestNakiosCatalogRow(current, next) {
  if (!current) {
    return next;
  }
  if (!next) {
    return current;
  }
  const currentAvailability = getNakiosAvailabilityPriority(current?.availability_status || current?.external_status);
  const nextAvailability = getNakiosAvailabilityPriority(next?.availability_status || next?.external_status);
  if (nextAvailability > currentAvailability) {
    return next;
  }
  if (nextAvailability < currentAvailability) {
    return current;
  }
  const currentScore = Number(current?.supplemental_rank || 0);
  const nextScore = Number(next?.supplemental_rank || 0);
  if (nextScore > currentScore) {
    return next;
  }
  if (nextScore < currentScore) {
    return current;
  }
  const currentDate = Date.parse(String(current?.supplemental_date || current?.release_date || ""));
  const nextDate = Date.parse(String(next?.supplemental_date || next?.release_date || ""));
  const currentSafeDate = Number.isFinite(currentDate) ? currentDate : 0;
  const nextSafeDate = Number.isFinite(nextDate) ? nextDate : 0;
  if (nextSafeDate > currentSafeDate) {
    return next;
  }
  const currentPoster = String(current?.large_poster_path || current?.small_poster_path || "").trim();
  const nextPoster = String(next?.large_poster_path || next?.small_poster_path || "").trim();
  if (!currentPoster && nextPoster) {
    return next;
  }
  return current;
}

async function fetchNakiosFeedPage(feed, page) {
  const mediaType = String(feed?.mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const path = String(feed?.path || "").trim();
  if (!path) {
    return [];
  }
  const target = `${NAKIOS_API_BASE}${path}?page=${Math.max(1, Number(page || 1))}`;
  const response = await fetchRemote(target, NAKIOS_FETCH_HEADERS);
  if (response.status < 200 || response.status >= 300) {
    return [];
  }
  const payload = parseJsonSafe(response.body);
  const rows = Array.isArray(payload?.results) ? payload.results : [];
  return rows.map((entry) => ({ mediaType, entry }));
}

async function loadNakiosCatalogEntries(force = false) {
  const now = Date.now();
  if (
    !force &&
    nakiosCatalogCache.loadedAt > 0 &&
    now - nakiosCatalogCache.loadedAt < SUPPLEMENTAL_CATALOG_CACHE_MS &&
    Array.isArray(nakiosCatalogCache.entries) &&
    nakiosCatalogCache.entries.length > 0
  ) {
    return nakiosCatalogCache.entries;
  }
  if (nakiosCatalogCache.inFlight) {
    return nakiosCatalogCache.inFlight;
  }

  const task = (async () => {
    const jobs = [];
    NAKIOS_CATALOG_FEEDS.forEach((feed) => {
      for (let page = 1; page <= NAKIOS_CATALOG_PAGES_PER_FEED; page += 1) {
        jobs.push({ feed, page });
      }
    });

    const results = await mapWithConcurrency(jobs, Math.min(6, jobs.length || 1), async (job) => {
      try {
        return await fetchNakiosFeedPage(job.feed, job.page);
      } catch {
        return [];
      }
    });

    const reservedIds = new Set();
    const candidates = results
      .flat()
      .map((row) => buildNakiosCatalogRow(row?.entry, row?.mediaType, reservedIds))
      .filter(Boolean);

    const bySemantic = new Map();
    candidates.forEach((row) => {
      const key = buildNakiosSemanticKey(row);
      if (!key || key.startsWith("::")) {
        return;
      }
      const currentBest = bySemantic.get(key);
      bySemantic.set(key, pickBestNakiosCatalogRow(currentBest, row));
    });

    const rows = Array.from(bySemantic.values());
    rows.sort((left, right) => {
      const leftRank = Number(left?.supplemental_rank || 0);
      const rightRank = Number(right?.supplemental_rank || 0);
      if (leftRank !== rightRank) {
        return rightRank - leftRank;
      }
      const leftDate = Date.parse(String(left?.supplemental_date || left?.release_date || ""));
      const rightDate = Date.parse(String(right?.supplemental_date || right?.release_date || ""));
      const leftSafeDate = Number.isFinite(leftDate) ? leftDate : 0;
      const rightSafeDate = Number.isFinite(rightDate) ? rightDate : 0;
      if (leftSafeDate !== rightSafeDate) {
        return rightSafeDate - leftSafeDate;
      }
      return String(left?.title || "").localeCompare(String(right?.title || ""), "fr", {
        sensitivity: "base",
      });
    });

    nakiosCatalogCache.entries = rows;
    nakiosCatalogCache.loadedAt = Date.now();
    return nakiosCatalogCache.entries;
  })();

  nakiosCatalogCache.inFlight = task;
  try {
    return await task;
  } finally {
    nakiosCatalogCache.inFlight = null;
  }
}

async function resolveNakiosTmdbIdBySearch(title, mediaType, year = 0) {
  const safeTitle = String(title || "").trim();
  if (safeTitle.length < 2) {
    return 0;
  }
  const normalizedType = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const safeYear = toInt(year, 0, 0, 2099);
  const titleKey = normalizeTitleKey(safeTitle);
  const cacheKey = `nakios:${titleKey}:${normalizedType}:${safeYear}`;
  const cached = nakiosLookupCache.get(cacheKey);
  if (cached && Date.now() < Number(cached.expiresAt || 0)) {
    return Number(cached.tmdbId || 0);
  }

  const target = `${NAKIOS_API_BASE}/api/search/multi?query=${encodeURIComponent(safeTitle)}`;
  const response = await fetchRemote(target, NAKIOS_FETCH_HEADERS);
  if (response.status < 200 || response.status >= 300) {
    nakiosLookupCache.set(cacheKey, {
      tmdbId: 0,
      expiresAt: Date.now() + Math.min(10 * 60 * 1000, NAKIOS_LOOKUP_CACHE_MS),
    });
    return 0;
  }

  const payload = parseJsonSafe(response.body);
  const rows = Array.isArray(payload?.results) ? payload.results : [];
  const queryTitleKey = normalizeTitleKey(safeTitle);
  const scored = rows
    .filter((entry) => {
      const type = String(entry?.media_type || "").toLowerCase();
      return type === normalizedType;
    })
    .map((entry) => {
      const rowTitle = String(entry?.title || entry?.name || "").trim();
      const rowTitleKey = normalizeTitleKey(rowTitle);
      const rowYearRaw =
        normalizedType === "tv"
          ? String(entry?.first_air_date || "").trim()
          : String(entry?.release_date || "").trim();
      const rowYear = toInt(parseYearFromText(rowYearRaw), 0, 0, 2099);
      let score = 0;
      if (rowTitleKey === queryTitleKey) {
        score += 140;
      } else if (rowTitleKey.includes(queryTitleKey) || queryTitleKey.includes(rowTitleKey)) {
        score += 80;
      }
      if (safeYear > 0 && rowYear > 0) {
        const diff = Math.abs(rowYear - safeYear);
        if (diff === 0) {
          score += 70;
        } else if (diff === 1) {
          score += 38;
        } else if (diff <= 2) {
          score += 16;
        } else {
          score -= diff * 4;
        }
      }
      score += Math.max(0, Math.min(120, Number(entry?.popularity || 0)));
      return {
        entry,
        score,
      };
    })
    .sort((left, right) => right.score - left.score);

  const best = scored[0]?.entry;
  const tmdbId = toInt(best?.id, 0, 0, 999999999);
  nakiosLookupCache.set(cacheKey, {
    tmdbId,
    expiresAt: Date.now() + NAKIOS_LOOKUP_CACHE_MS,
  });
  prunePidoovTimedCache(nakiosLookupCache, 3200);
  return tmdbId;
}

function normalizeNakiosSourceUrl(rawUrl) {
  const value = String(rawUrl || "").trim();
  if (!value) {
    return "";
  }
  if (value.startsWith("//")) {
    return `https:${value}`;
  }
  if (value.startsWith("/")) {
    return `${NAKIOS_API_BASE}${value}`;
  }
  return value;
}

function guessNakiosSourceFormat(source, resolvedUrl) {
  const raw = String(source?.format || "").trim().toLowerCase();
  if (raw === "embed" || raw === "hls" || raw === "mp4") {
    return raw;
  }
  if (source?.isEmbed === true) {
    return "embed";
  }
  if (source?.isM3U8 === true || /\.m3u8(?:$|\?)/i.test(resolvedUrl)) {
    return "hls";
  }
  if (/\.mp4(?:$|\?)/i.test(resolvedUrl)) {
    return "mp4";
  }
  return "embed";
}

async function resolveNakiosSourcesByTmdbId(mediaType, tmdbId, season = 1, episode = 1) {
  const safeTmdbId = toInt(tmdbId, 0, 0, 999999999);
  if (safeTmdbId <= 0) {
    return [];
  }
  const normalizedType = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const safeSeason = toInt(season, 1, 1, 500);
  const safeEpisode = toInt(episode, 1, 1, 50000);
  const target =
    normalizedType === "tv"
      ? `${NAKIOS_API_BASE}/api/sources/tv/${safeTmdbId}/${safeSeason}/${safeEpisode}`
      : `${NAKIOS_API_BASE}/api/sources/movie/${safeTmdbId}`;

  const response = await fetchRemote(target, NAKIOS_FETCH_HEADERS);
  if (response.status < 200 || response.status >= 300) {
    return [];
  }
  const payload = parseJsonSafe(response.body);
  const rows = Array.isArray(payload?.sources) ? payload.sources : [];
  const dedupe = new Set();
  const out = [];
  rows.forEach((sourceRow, index) => {
    const resolvedUrl = normalizeNakiosSourceUrl(sourceRow?.url || sourceRow?.stream_url || "");
    const parsed = parseSafeRemoteUrl(resolvedUrl);
    if (!parsed) {
      return;
    }
    const streamUrl = parsed.href;
    if (!streamUrl || dedupe.has(streamUrl)) {
      return;
    }
    dedupe.add(streamUrl);
    const language = normalizePidoovLanguage(sourceRow?.lang || sourceRow?.language || sourceRow?.name || "") || "VF";
    const sourceName = sanitizeToken(
      String(sourceRow?.name || sourceRow?.provider || sourceRow?.original_player || "NAKIOS").trim(),
      80
    );
    out.push({
      stream_url: streamUrl,
      source_name: sourceName || "NAKIOS",
      quality: sanitizeToken(String(sourceRow?.quality || "HD"), 24) || "HD",
      language,
      format: guessNakiosSourceFormat(sourceRow, streamUrl),
      priority: (language === "VF" ? 390 : language === "MULTI" ? 368 : language === "VOSTFR" ? 356 : 330) - Math.min(40, index * 4),
    });
  });
  return out;
}

async function loadSupplementalCatalogEntries(force = false) {
  const rows = await loadNakiosCatalogEntries(force);
  supplementalCatalogCache.entries = Array.isArray(rows) ? rows : [];
  supplementalCatalogCache.loadedAt = Date.now();
  supplementalCatalogCache.inFlight = null;
  return supplementalCatalogCache.entries;
}

function buildSupplementalCatalogPage(entries, page = 1, pageSize = SUPPLEMENTAL_CATALOG_PAGE_SIZE) {
  const rows = Array.isArray(entries) ? entries : [];
  const safePageSize = Math.max(1, Number(pageSize || SUPPLEMENTAL_CATALOG_PAGE_SIZE));
  const total = rows.length;
  const lastPage = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.max(1, Number(page || 1));
  if (safePage > lastPage) {
    return {
      data: [],
      current_page: safePage,
      last_page: lastPage,
      per_page: safePageSize,
      total,
    };
  }
  const start = (safePage - 1) * safePageSize;
  const data = rows.slice(start, start + safePageSize);
  return {
    data,
    current_page: safePage,
    last_page: lastPage,
    per_page: safePageSize,
    total,
  };
}

function buildSupplementalCalendarItems(entries, month, year, limit = SUPPLEMENTAL_CALENDAR_LIMIT) {
  const safeMonth = toInt(month, 1, 1, 12);
  const safeYear = toInt(year, new Date().getFullYear(), 2000, 2099);
  const rows = Array.isArray(entries) ? entries : [];
  const mapped = [];

  rows.forEach((entry) => {
    const dateIsoRaw = String(entry?.supplemental_date || entry?.release_date || "").trim();
    const dateIso = toIsoDate(dateIsoRaw);
    if (!dateIso) {
      return;
    }
    const match = dateIso.match(/^(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})$/);
    if (!match) {
      return;
    }
    const itemYear = Number(match.groups?.y || 0);
    const itemMonth = Number(match.groups?.m || 0);
    const itemDay = Number(match.groups?.d || 0);
    if (itemYear !== safeYear || itemMonth !== safeMonth || itemDay <= 0) {
      return;
    }

    const provider = String(entry?.external_provider || "").trim().toLowerCase();
    const type = String(entry?.type || "").toLowerCase() === "tv" ? "serie" : "film";
    let availabilityStatus = normalizeNakiosAvailabilityStatus(
      entry?.availability_status || entry?.external_status || entry?.status
    );
    if (availabilityStatus === "unknown" && provider === "nakios" && isNakiosLikelyPendingByDate(dateIso)) {
      availabilityStatus = "pending";
    }
    mapped.push({
      source: provider || "provider",
      key: `supp-${provider}-${entry.id}-${dateIso}`,
      dateIso,
      dayNumber: itemDay,
      mediaId: Number(entry?.id || 0),
      title: String(entry?.title || "").trim() || "Sans titre",
      type,
      poster: String(entry?.large_poster_path || entry?.small_poster_path || entry?.wallpaper_poster_path || "").trim(),
      backdrop: String(entry?.wallpaper_poster_path || entry?.large_poster_path || entry?.small_poster_path || "").trim(),
      season: Number(entry?.external_season || 0),
      episode: Number(entry?.external_episode || 0),
      supplemental: String(entry?.external_label || provider || "Provider"),
      categories: [],
      url: String(entry?.external_detail_url || "").trim(),
      languageHint: String(entry?.external_language || entry?.language || "").trim(),
      hasDetails: false,
      provider: provider || "provider",
      availabilityStatus,
      externalStatus: availabilityStatus,
      isPendingUpload: availabilityStatus === "pending",
    });
  });

  mapped.sort((left, right) => {
    const dayDiff = Number(left?.dayNumber || 0) - Number(right?.dayNumber || 0);
    if (dayDiff !== 0) {
      return dayDiff;
    }
    const leftTitle = String(left?.title || "");
    const rightTitle = String(right?.title || "");
    return leftTitle.localeCompare(rightTitle, "fr", { sensitivity: "base" });
  });

  const dedupe = new Set();
  const unique = [];
  mapped.forEach((entry) => {
    const semantic = `${normalizeTitleKey(entry.title)}::${entry.type}::${entry.dateIso}::${Number(entry.season || 0)}::${Number(
      entry.episode || 0
    )}`;
    if (!semantic || dedupe.has(semantic)) {
      return;
    }
    dedupe.add(semantic);
    unique.push(entry);
  });
  return unique.slice(0, Math.max(1, Number(limit || SUPPLEMENTAL_CALENDAR_LIMIT)));
}

function isTruthyFlag(value) {
  if (value === true || value === 1) {
    return true;
  }
  const raw = String(value || "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "oui";
}

function normalizeTypeFromPurstream(movie) {
  if (!movie || movie.type !== "tv") {
    return "film";
  }
  if (isTruthyFlag(movie?.isAnime)) {
    return "anime";
  }
  const urlsRaw = Array.isArray(movie?.urls) ? movie.urls.join(" ") : movie?.urls;
  const urls = String(urlsRaw || "").toLowerCase();
  if (urls.includes("/animes/") || urls.includes("/anime/")) {
    return "anime";
  }
  return "serie";
}

function parsePurstreamCalendar(payload, month, year) {
  const days = Array.isArray(payload?.data?.items?.days) ? payload.data.items.days : [];
  const dedupe = new Set();
  const semanticDedupe = new Set();
  const items = [];

  for (const entry of days) {
    const dayNumber = toInt(entry?.number, 0, 0, 31);
    const movie = entry?.movie;
    const mediaId = Number(movie?.id || 0);
    if (!movie || dayNumber <= 0 || mediaId <= 0) {
      continue;
    }

    const key = String(movie.calendarId || `${dayNumber}-${mediaId}-${movie.calendarSupplemental || ""}`);
    if (dedupe.has(key)) {
      continue;
    }
    dedupe.add(key);

    const monthSafe = String(month).padStart(2, "0");
    const daySafe = String(dayNumber).padStart(2, "0");
    const dateIso = `${year}-${monthSafe}-${daySafe}`;
    const posters = movie.posters || {};
    const type = normalizeTypeFromPurstream(movie);
    const semanticKey = `${normalizeTitleKey(movie.title || "")}::${type}::${dayNumber}::${Number(movie.season || 0)}::${Number(movie.episode || 0)}`;
    if (semanticDedupe.has(semanticKey)) {
      continue;
    }
    semanticDedupe.add(semanticKey);
    items.push({
      source: "purstream",
      key,
      dateIso,
      dayNumber,
      mediaId,
      title: String(movie.title || "Sans titre"),
      type,
      isAnime: type === "anime",
      language: String(movie.lang || "").trim().toUpperCase(),
      supplemental: String(movie.calendarSupplemental || "").trim(),
      season: Number(movie.season || 0),
      episode: Number(movie.episode || 0),
      poster: String(posters.large || posters.small || posters.wallpaper || ""),
      categories: Array.isArray(movie.categories) ? movie.categories : [],
      url: `${PURSTREAM_WEB_BASE}/calendar`,
    });
  }

  items.sort((left, right) => {
    if (left.dayNumber !== right.dayNumber) {
      return left.dayNumber - right.dayNumber;
    }
    return left.title.localeCompare(right.title, "fr", { sensitivity: "base" });
  });

  const monthName = String(payload?.data?.items?.name || "");
  return {
    month,
    year,
    monthName,
    items,
  };
}

function parseAnimeDateLabelToIso(dateLabel, fallbackYear) {
  const match = String(dateLabel || "").match(/(\d{2})\/(\d{2})/);
  if (!match) {
    return "";
  }
  const day = toInt(match[1], 0, 1, 31);
  const month = toInt(match[2], 0, 1, 12);
  if (day <= 0 || month <= 0) {
    return "";
  }
  return `${fallbackYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseAnimeCardsFromBlock(block, dayName, dateLabel, fallbackYear, limit = 180) {
  const rows = [];
  const cardRegex =
    /<div class="([^"]*planning-card[^"]*)"[^>]*data-title="([^"]*)"[\s\S]*?<a href="([^"]+)"[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/gi;

  let match;
  while ((match = cardRegex.exec(block)) !== null) {
    if (rows.length >= limit) {
      break;
    }
    const classes = String(match[1] || "").toLowerCase();
    const dataTitle = decodeHtmlEntities(match[2] || "");
    const href = String(match[3] || "").trim();
    const src = String(match[4] || "").trim();
    const alt = decodeHtmlEntities(match[5] || "").trim();
    const type = classes.includes("scan") ? "scan" : "anime";
    const language = classes.includes("vostfr") ? "VOSTFR" : classes.includes("vf") ? "VF" : "";
    const title = alt || dataTitle || "Sans titre";
    const absoluteUrl = href.startsWith("http")
      ? href
      : `https://anime-sama.tv${href.startsWith("/") ? href : `/${href}`}`;

    rows.push({
      source: "anime-sama",
      key: `${dayName}|${dateLabel}|${absoluteUrl}|${title}`,
      dayName,
      dateLabel,
      dateIso: parseAnimeDateLabelToIso(dateLabel, fallbackYear),
      title,
      type,
      language,
      poster: src,
      url: absoluteUrl,
    });
  }

  return rows;
}

function parseAnimePlanning(html, fallbackYear) {
  const source = String(html || "");
  const dayBlocks = [];
  const markers = [];
  const markerRegex = /<div id="(\d+)" class="selectedRow[\s\S]*?>/gi;
  let markerMatch;

  while ((markerMatch = markerRegex.exec(source)) !== null) {
    markers.push({ index: markerMatch.index });
  }

  const fixedAnchor = source.indexOf("Œuvres en cours sans jours fixes");

  for (let idx = 0; idx < markers.length; idx += 1) {
    const start = markers[idx].index;
    const nextStart = idx + 1 < markers.length ? markers[idx + 1].index : source.length;
    const end = fixedAnchor > start ? Math.min(nextStart, fixedAnchor) : nextStart;
    const block = source.slice(start, end);
    const dayName = stripTags((block.match(/<h2[^>]*class="[^"]*titreJours[^"]*"[^>]*>([\s\S]*?)<\/h2>/i) || [])[1]);
    const dateLabel = stripTags((block.match(/<p[^>]*>\s*(\d{2}\/\d{2})\s*<\/p>/i) || [])[1]);
    if (!dayName) {
      continue;
    }
    const items = parseAnimeCardsFromBlock(block, dayName, dateLabel, fallbackYear, 220);
    dayBlocks.push({
      dayName,
      dateLabel,
      items,
    });
  }

  if (fixedAnchor > 0) {
    const noDateBlock = source.slice(fixedAnchor);
    const noDateItems = parseAnimeCardsFromBlock(noDateBlock, "Sans jour fixe", "", fallbackYear, 120);
    if (noDateItems.length > 0) {
      dayBlocks.push({
        dayName: "Sans jour fixe",
        dateLabel: "",
        items: noDateItems,
      });
    }
  }

  const dedupe = new Set();
  const flatItems = [];
  dayBlocks.forEach((day) => {
    day.items.forEach((item) => {
      if (dedupe.has(item.key)) {
        return;
      }
      dedupe.add(item.key);
      flatItems.push(item);
    });
  });

  return {
    days: dayBlocks,
    items: flatItems,
  };
}

function isAnimeCalendarType(rawType) {
  const normalized = normalizeTitleKey(rawType || "");
  return normalized === "anime" || normalized === "scan" || normalized === "animation" || normalized === "japanimation";
}

function isAnimeSamaCalendarEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }
  const sourceHint = normalizeTitleKey(entry?.source || entry?.supplemental || entry?.provider || "");
  if (sourceHint.includes("anime sama") || sourceHint.includes("animesama")) {
    return true;
  }
  const urlHints = [
    entry?.url,
    entry?.external_detail_url,
    entry?.externalDetailUrl,
  ]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");
  return /anime-sama\.(tv|to)/i.test(urlHints);
}

function buildMergedCalendar(purstreamItems, animeItems, supplementalItems = []) {
  const dedupe = new Map();
  const pushMerged = (entry) => {
    if (isAnimeCalendarType(entry?.type || entry?.kind || "") && !isAnimeSamaCalendarEntry(entry)) {
      return;
    }
    const normalizedTitle = normalizeTitleKey(entry?.title || "");
    const normalizedType = normalizeTitleKey(entry?.type || entry?.kind || "");
    const dateIso = String(entry?.dateIso || "").trim();
    const season = Number(entry?.season || 0);
    const episode = Number(entry?.episode || 0);
    const key = `${normalizedTitle}::${normalizedType}::${dateIso}::${season}::${episode}`;
    const current = dedupe.get(key);
    if (!current) {
      dedupe.set(key, entry);
      return;
    }

    const currentAvailability = getNakiosAvailabilityPriority(
      current?.availabilityStatus || current?.externalStatus || current?.availability_status || current?.external_status
    );
    const nextAvailability = getNakiosAvailabilityPriority(
      entry?.availabilityStatus || entry?.externalStatus || entry?.availability_status || entry?.external_status
    );
    if (nextAvailability > currentAvailability) {
      dedupe.set(key, entry);
      return;
    }
    if (nextAvailability < currentAvailability) {
      return;
    }

    const currentPoster = String(current?.poster || "").trim();
    const nextPoster = String(entry?.poster || "").trim();
    if (!currentPoster && nextPoster) {
      dedupe.set(key, entry);
      return;
    }

    const currentHasId = Number(current?.mediaId || 0) > 0;
    const nextHasId = Number(entry?.mediaId || 0) > 0;
    if (!currentHasId && nextHasId) {
      dedupe.set(key, entry);
    }
  };

  purstreamItems.forEach((entry) => {
    pushMerged({
      ...entry,
      kind: entry.type,
    });
  });
  supplementalItems.forEach((entry) => {
    pushMerged({
      ...entry,
      kind: entry.type,
    });
  });
  animeItems.forEach((entry) => {
    pushMerged({
      ...entry,
      kind: entry.type,
    });
  });

  const merged = Array.from(dedupe.values());

  merged.sort((left, right) => {
    const leftDate = Date.parse(left.dateIso || "");
    const rightDate = Date.parse(right.dateIso || "");
    const leftSafe = Number.isFinite(leftDate) ? leftDate : Number.MAX_SAFE_INTEGER;
    const rightSafe = Number.isFinite(rightDate) ? rightDate : Number.MAX_SAFE_INTEGER;
    if (leftSafe !== rightSafe) {
      return leftSafe - rightSafe;
    }
    return String(left.title || "").localeCompare(String(right.title || ""), "fr", {
      sensitivity: "base",
    });
  });
  return merged.slice(0, 420);
}

function getProxyTTL(pathname) {
  if (/^\/stream\//i.test(pathname)) {
    return 0;
  }
  if (/^\/catalog\/top-10-for-home$/i.test(pathname)) {
    return 2 * 60 * 1000;
  }
  if (/^\/catalog\/movies$/i.test(pathname)) {
    return 60 * 1000;
  }
  if (/^\/search-bar\//i.test(pathname)) {
    return 45 * 1000;
  }
  if (/^\/media\/\d+\/(sheet|seasons|trailers)$/i.test(pathname)) {
    return 8 * 60 * 1000;
  }
  return 30 * 1000;
}

function isAllowedProxyPath(pathname) {
  return (
    /^\/catalog\//i.test(pathname) ||
    /^\/search-bar\//i.test(pathname) ||
    /^\/media\//i.test(pathname) ||
    /^\/stream\//i.test(pathname)
  );
}

function createEmptyOwnedSourcesData() {
  return {
    movies: {},
    tv: {},
    series: {},
  };
}

function readOwnedSourceArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (value && typeof value === "object" && Array.isArray(value.sources)) {
    return value.sources;
  }
  return [];
}

function normalizeOwnedSourceLanguage(value) {
  const raw = String(value || "").trim().toUpperCase();
  if (!raw) {
    return "";
  }
  if (raw === "FR" || raw === "FRENCH" || raw === "1" || raw === "VF") {
    return "VF";
  }
  if (raw.includes("VOST") || raw.includes("SUB")) {
    return "VOSTFR";
  }
  if (raw.includes("MULTI") || raw.includes("DUAL")) {
    return "MULTI";
  }
  if (raw === "VO" || raw.includes("ORIGINAL")) {
    return "VO";
  }
  return raw.slice(0, 16);
}

function inferOwnedSourceFormat(url, hint = "") {
  const rawHint = String(hint || "").trim().toLowerCase();
  if (rawHint.includes("embed") || rawHint.includes("iframe")) {
    return "embed";
  }
  if (rawHint.includes("m3u8") || rawHint.includes("hls")) {
    return "hls";
  }
  if (rawHint.includes("mp4")) {
    return "mp4";
  }
  if (rawHint.includes("webm")) {
    return "webm";
  }
  if (rawHint.includes("mpd") || rawHint.includes("dash")) {
    return "dash";
  }

  const cleanUrl = String(url || "").split("#")[0].split("?")[0].toLowerCase();
  if (/video\.sibnet\.ru\/shell\.php/i.test(cleanUrl) || /\/embed[-_/]/i.test(cleanUrl)) {
    return "embed";
  }
  if (cleanUrl.endsWith(".m3u8")) {
    return "hls";
  }
  if (cleanUrl.endsWith(".mp4")) {
    return "mp4";
  }
  if (cleanUrl.endsWith(".webm")) {
    return "webm";
  }
  if (cleanUrl.endsWith(".mpd")) {
    return "dash";
  }
  return "unknown";
}

function normalizeProviderName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function sanitizeDomainLike(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "")
    .replace(/^www\./, "");
}

function buildCloudflareStreamUrl(entry) {
  const uid = String(entry?.uid || entry?.video_uid || entry?.videoId || entry?.playback_id || "").trim();
  if (!uid) {
    return "";
  }
  const explicit = String(entry?.customer_code || entry?.customerCode || "").trim();
  const fallback = String(process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE || "").trim();
  const code = explicit || fallback;
  if (!code) {
    return "";
  }
  return `https://customer-${code}.cloudflarestream.com/${uid}/manifest/video.m3u8`;
}

function buildBunnyStreamUrl(entry) {
  const videoId = String(entry?.video_id || entry?.videoId || "").trim();
  if (!videoId) {
    return "";
  }
  const explicit = sanitizeDomainLike(entry?.pull_zone_url || entry?.pullZoneUrl || "");
  const fallback = sanitizeDomainLike(process.env.BUNNY_STREAM_PULL_ZONE || "");
  const pullZone = explicit || fallback;
  if (!pullZone) {
    return "";
  }
  return `https://${pullZone}.b-cdn.net/${videoId}/playlist.m3u8`;
}

function resolveOwnedProviderUrl(entry) {
  const provider = normalizeProviderName(entry?.provider || entry?.provider_name || "");
  if (!provider) {
    return "";
  }
  if (provider === "cloudflare" || provider === "cloudflare_stream") {
    return buildCloudflareStreamUrl(entry);
  }
  if (provider === "bunny" || provider === "bunny_stream") {
    return buildBunnyStreamUrl(entry);
  }
  return "";
}

function defaultOwnedSourceName(entry) {
  const provider = normalizeProviderName(entry?.provider || entry?.provider_name || "");
  if (provider === "cloudflare" || provider === "cloudflare_stream") {
    return "Cloudflare Stream";
  }
  if (provider === "bunny" || provider === "bunny_stream") {
    return "Bunny Stream";
  }
  return "Zenix Source";
}

function normalizeOwnedSourceEntry(entry, index = 0) {
  const providerUrl = resolveOwnedProviderUrl(entry);
  const url = String(entry?.stream_url || entry?.url || entry?.file || providerUrl || "").trim();
  if (!url) {
    return null;
  }
  const parsed = parseSafeRemoteUrl(url);
  if (!parsed) {
    return null;
  }

  return {
    stream_url: parsed.href,
    source_name: String(entry?.source_name || entry?.name || defaultOwnedSourceName(entry)).trim() || "Zenix Source",
    quality: String(entry?.quality || entry?.resolution || "Zenix").trim() || "Zenix",
    language: normalizeOwnedSourceLanguage(entry?.language || entry?.lang || ""),
    format: inferOwnedSourceFormat(parsed.href, entry?.format || entry?.type || "hls"),
    priority: toInt(entry?.priority, Math.max(0, 1000 - index), -100000, 100000),
  };
}

function loadZenixOwnedSourcesData() {
  const now = Date.now();
  const ttl = zenixOwnedSourcesCache.loadedAt + ZENIX_OWNED_SOURCES_CACHE_MS;
  if (zenixOwnedSourcesCache.loadedAt > 0 && ttl > now) {
    return zenixOwnedSourcesCache.data;
  }

  let nextData = createEmptyOwnedSourcesData();
  let nextMtime = 0;
  try {
    const stats = fs.statSync(ZENIX_OWNED_SOURCES_FILE);
    if (stats.isFile()) {
      nextMtime = Number(stats.mtimeMs || 0);
      if (nextMtime !== Number(zenixOwnedSourcesCache.mtimeMs || 0)) {
        const raw = fs.readFileSync(ZENIX_OWNED_SOURCES_FILE, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          nextData = {
            ...createEmptyOwnedSourcesData(),
            ...parsed,
          };
        }
      } else {
        nextData = zenixOwnedSourcesCache.data;
      }
    }
  } catch {
    nextData = createEmptyOwnedSourcesData();
    nextMtime = 0;
  }

  zenixOwnedSourcesCache.loadedAt = now;
  zenixOwnedSourcesCache.mtimeMs = nextMtime;
  zenixOwnedSourcesCache.data = nextData;
  return nextData;
}

function readOwnedMediaNode(collection, mediaId) {
  const map = collection && typeof collection === "object" ? collection : {};
  return map[String(mediaId)] || map[Number(mediaId)] || null;
}

function resolveOwnedTvSources(mediaNode, season, episode) {
  if (!mediaNode || typeof mediaNode !== "object") {
    return [];
  }

  const safeSeason = Math.max(1, Number(season || 1));
  const safeEpisode = Math.max(1, Number(episode || 1));
  const seasonKey = String(safeSeason);
  const episodeKey = String(safeEpisode);

  const seasonNode =
    mediaNode[seasonKey] ||
    mediaNode?.seasons?.[seasonKey] ||
    mediaNode?.season?.[seasonKey] ||
    null;

  const exactCandidates = [
    seasonNode?.[episodeKey],
    seasonNode?.episodes?.[episodeKey],
    seasonNode?.episode?.[episodeKey],
    mediaNode?.episodes?.[episodeKey],
    mediaNode?.episode?.[episodeKey],
  ];
  for (const candidate of exactCandidates) {
    const rows = readOwnedSourceArray(candidate);
    if (rows.length > 0) {
      return rows;
    }
  }

  const fallbackCandidates = [
    seasonNode?.default,
    seasonNode?.fallback,
    mediaNode?.default,
    mediaNode?.fallback,
    mediaNode,
  ];
  for (const candidate of fallbackCandidates) {
    const rows = readOwnedSourceArray(candidate);
    if (rows.length > 0) {
      return rows;
    }
  }
  return [];
}

function resolveOwnedSources(type, mediaId, season, episode) {
  const safeType = String(type || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const safeId = Math.max(1, Number(mediaId || 0));
  if (!safeId) {
    return [];
  }

  const data = loadZenixOwnedSourcesData();
  const movies = data?.movies && typeof data.movies === "object" ? data.movies : {};
  const tv = data?.tv && typeof data.tv === "object" ? data.tv : {};
  const series = data?.series && typeof data.series === "object" ? data.series : {};

  let rawRows = [];
  if (safeType === "movie") {
    const movieNode = readOwnedMediaNode(movies, safeId);
    rawRows = readOwnedSourceArray(movieNode);
  } else {
    const tvNode = readOwnedMediaNode(tv, safeId) || readOwnedMediaNode(series, safeId);
    rawRows = resolveOwnedTvSources(tvNode, season, episode);
  }

  const normalized = rawRows
    .map((entry, index) => normalizeOwnedSourceEntry(entry, index))
    .filter(Boolean)
    .sort((left, right) => Number(right?.priority || 0) - Number(left?.priority || 0));

  const dedupe = new Set();
  return normalized.filter((entry) => {
    const key = String(entry?.stream_url || "").trim();
    if (!key || dedupe.has(key)) {
      return false;
    }
    dedupe.add(key);
    return true;
  });
}

async function fetchRemote(target, extraHeaders = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);
  try {
    const response = await fetch(target, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": DEFAULT_BROWSER_UA,
        "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
        ...extraHeaders,
      },
      signal: controller.signal,
    });
    const body = await response.text();
    return {
      status: response.status,
      body,
      contentType: response.headers.get("content-type") || "application/json; charset=utf-8",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchRemoteText(target, accept = "text/html", extraHeaders = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);
  try {
    const response = await fetch(target, {
      method: "GET",
      headers: {
        Accept: accept,
        "User-Agent": DEFAULT_BROWSER_UA,
        "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
        ...extraHeaders,
      },
      signal: controller.signal,
    });
    const body = await response.text();
    return {
      status: response.status,
      body,
      contentType: response.headers.get("content-type") || "text/plain; charset=utf-8",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchRemoteForm(target, formData = {}, accept = "text/html", extraHeaders = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);
  try {
    const body = new URLSearchParams(formData).toString();
    const response = await fetch(target, {
      method: "POST",
      headers: {
        Accept: accept,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": DEFAULT_BROWSER_UA,
        "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
        ...extraHeaders,
      },
      body,
      signal: controller.signal,
    });
    return {
      status: response.status,
      body: await response.text(),
      contentType: response.headers.get("content-type") || "text/plain; charset=utf-8",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeAnimeEpisodeUrl(value) {
  let url = String(value || "").trim();
  if (!url) {
    return "";
  }
  if (url.startsWith("//")) {
    url = `https:${url}`;
  }
  if (/^http:\/\//i.test(url)) {
    url = url.replace(/^http:\/\//i, "https://");
  }
  if (!/^https?:\/\//i.test(url)) {
    return "";
  }
  return url;
}

function normalizeSibnetUrl(value) {
  const normalized = normalizeAnimeEpisodeUrl(value);
  if (!normalized) {
    return "";
  }
  return /sibnet\.ru/i.test(normalized) ? normalized : "";
}

function inferAnimeSourceFormat(url) {
  const cleanUrl = String(url || "").split("#")[0].split("?")[0].toLowerCase();
  if (cleanUrl.endsWith(".m3u8")) {
    return "hls";
  }
  if (cleanUrl.endsWith(".mp4")) {
    return "mp4";
  }
  if (cleanUrl.endsWith(".webm")) {
    return "webm";
  }
  if (cleanUrl.endsWith(".mpd")) {
    return "dash";
  }
  return "embed";
}

function inferAnimeSourceName(url, fallback = "") {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (!host) {
      return fallback || "Anime";
    }
    if (/sibnet\.ru$/i.test(host)) {
      return "Sibnet";
    }
    const parts = host.split(".").filter(Boolean);
    const base = parts.length >= 2 ? parts[parts.length - 2] : host;
    return base ? base.charAt(0).toUpperCase() + base.slice(1) : fallback || "Anime";
  } catch {
    return fallback || "Anime";
  }
}


function normalizeAnimeSearchTitle(value) {
  const raw = String(value || "").trim().replace(/\u00d7/g, "x");
  if (!raw) {
    return "";
  }
  const cleaned = raw
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/\b(19|20)\d{2}\b/g, " ")
    .replace(/\b(saison|season|part|episode|ep|cour|arc|version|ver|s\d+|e\d+)\b/gi, " ")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim();
  return cleaned;
}

function buildAnimeSearchQueries(title) {
  const direct = String(title || "").trim();
  const normalized = normalizeAnimeSearchTitle(direct);
  const fallback = normalizeAnimeSearchTitle(direct.replace(/\bthe\b/gi, " "));
  const queries = [direct, normalized, fallback]
    .map((value) => String(value || "").trim())
    .filter((value) => value.length >= 2);
  return Array.from(new Set(queries));
}

function extractAnimeCatalogueLinks(searchHtml) {
  const text = String(searchHtml || "");
  const matches = text.matchAll(/href="([^"]+)"/gi);
  const links = [];
  for (const match of matches) {
    const raw = String(match?.[1] || "").trim();
    if (!raw) {
      continue;
    }
    try {
      const absolute = new URL(raw, ANIME_SAMA_BASE).href;
      const parsed = new URL(absolute);
      if (/^\/catalogue\//i.test(parsed.pathname)) {
        links.push(absolute);
      }
    } catch {
      // ignore malformed links.
    }
  }
  return Array.from(new Set(links));
}

function scoreAnimeCatalogueCandidate(url, titleKey) {
  const safeTitleKey = normalizeTitleKey(titleKey || "");
  if (!safeTitleKey) {
    return 0;
  }
  try {
    const parsed = new URL(url);
    const slug = String(parsed.pathname || "")
      .replace(/^\/+/, "")
      .replace(/^catalogue\//i, "")
      .replace(/\/+$/, "");
    const slugKey = normalizeTitleKey(slug.replace(/\b(19|20)\d{2}\b/g, " "));
    if (!slugKey) {
      return 0;
    }
    const slugTokens = slugKey.split(" ").filter((token) => token.length >= 3);
    const titleTokens = safeTitleKey.split(" ").filter((token) => token.length >= 3);
    if (slugTokens.length === 0 || titleTokens.length === 0) {
      return 0;
    }
    const slugSet = new Set(slugTokens);
    let shared = 0;
    titleTokens.forEach((token) => {
      if (slugSet.has(token)) {
        shared += 1;
      }
    });
    let score = shared * 10 - Math.abs(slugTokens.length - titleTokens.length);
    if (slugKey === safeTitleKey) {
      score = 1000;
    }
    if (/\b(19|20)\d{2}\b/.test(slug)) {
      score -= 25;
    }
    if (/(^|\/)saison\d+hs\b|hors[-\s]?serie|ova|special/i.test(slug)) {
      score -= 12;
    }
    return score;
  } catch {
    return 0;
  }
}

function extractFirstAnimeCatalogueLink(searchHtml, targetTitle = "") {
  const links = extractAnimeCatalogueLinks(searchHtml);
  if (links.length === 0) {
    return "";
  }
  const titleKey = normalizeTitleKey(normalizeAnimeSearchTitle(targetTitle || ""));
  if (!titleKey) {
    return links[0];
  }
  let best = links[0];
  let bestScore = -1;
  links.forEach((link) => {
    const score = scoreAnimeCatalogueCandidate(link, titleKey);
    if (score > bestScore) {
      bestScore = score;
      best = link;
    }
  });
  return bestScore > 0 ? best : links[0];
}

function extractAnimePanels(catalogHtml) {
  const text = String(catalogHtml || "");
  const panels = [];
  const regex = /panneauAnime\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*\)/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const label = String(match?.[1] || "").trim();
    const pathValue = String(match?.[2] || "").trim();
    if (!pathValue) {
      continue;
    }
    panels.push({
      label,
      path: pathValue.replace(/^\/+/, ""),
    });
  }
  return panels;
}

function inferAnimePanelLanguage(panel) {
  const path = String(panel?.path || "").trim().toLowerCase();
  const label = String(panel?.label || "").trim().toLowerCase();
  const probe = `${path} ${label}`;
  if (/(^|\/|\s)vostfr($|\/|\s)/i.test(probe)) {
    return "vostfr";
  }
  if (/(^|\/|\s)(vf|vffr|version\s+fr|version\s+fran[cç]aise|fran[cç]ais|french)($|\/|\s)/i.test(probe)) {
    return "vf";
  }
  if (/(^|\/|\s)vo($|\/|\s)/i.test(probe)) {
    return "vo";
  }
  return "";
}

function chooseAnimePanelPath(panels, season = 1, language = "vostfr") {
  const rows = Array.isArray(panels) ? panels.filter(Boolean) : [];
  if (rows.length === 0) {
    return null;
  }
  const safeSeason = Math.max(1, Number(season || 1));
  const safeLang = String(language || "vostfr").toLowerCase() === "vf" ? "vf" : "vostfr";
  const seasonToken = `saison${safeSeason}`;
  const matchesLang = (entry) => {
    if (!entry) {
      return false;
    }
    const inferred = inferAnimePanelLanguage(entry);
    if (inferred && inferred === safeLang) {
      return true;
    }
    const value = String(entry.path || "").toLowerCase();
    return value.endsWith(`/${safeLang}`) || value.includes(`/${safeLang}/`) || value.endsWith(safeLang);
  };
  const toResult = (panel, matchedRequested = false) => {
    if (!panel) {
      return null;
    }
    return {
      path: String(panel.path || "").trim(),
      label: String(panel.label || "").trim(),
      language: inferAnimePanelLanguage(panel) || safeLang,
      matchedRequested: Boolean(matchedRequested),
    };
  };

  const withSeason = rows.filter((entry) => String(entry.path || "").toLowerCase().includes(seasonToken));
  const exactSeason = withSeason.filter((entry) =>
    new RegExp(`(^|/)${seasonToken}(/|$)`, "i").test(String(entry.path || ""))
  );
  const seasonAndLang =
    exactSeason.find((entry) => matchesLang(entry)) || withSeason.find((entry) => matchesLang(entry));
  if (seasonAndLang) {
    return toResult(seasonAndLang, true);
  }
  if (exactSeason.length > 0) {
    return toResult(exactSeason[0], false);
  }
  if (withSeason.length > 0) {
    return toResult(withSeason[0], false);
  }
  const langOnly = rows.find((entry) => matchesLang(entry));
  if (langOnly) {
    return toResult(langOnly, true);
  }
  return toResult(rows[0], false);
}

function normalizeAnimePanelPath(value) {
  return String(value || "").trim().replace(/^\/+/, "");
}

function buildAnimeVfCandidatePanels(panels, season = 1) {
  const rows = Array.isArray(panels) ? panels.filter(Boolean) : [];
  const safeSeason = Math.max(1, Number(season || 1));
  const seasonToken = `saison${safeSeason}`;
  const seen = new Set();
  const candidates = [];

  const pushCandidate = (path, label) => {
    const cleaned = normalizeAnimePanelPath(path);
    if (!cleaned) {
      return;
    }
    const key = cleaned.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    candidates.push({
      path: cleaned,
      label: String(label || "VF").trim(),
    });
  };

  rows.forEach((panel) => {
    const raw = normalizeAnimePanelPath(panel?.path);
    if (!raw) {
      return;
    }
    const lower = raw.toLowerCase();
    const matchesSeason = lower.includes(seasonToken);
    if (!matchesSeason && rows.length > 1) {
      return;
    }
    if (/\/vf(\/|$)/i.test(lower)) {
      pushCandidate(raw, panel?.label);
      return;
    }
    if (/\/(vostfr|vo)(\/|$)/i.test(lower)) {
      const candidate = raw.replace(/\/(vostfr|vo)(\/|$)/i, "/vf$2");
      pushCandidate(candidate, panel?.label);
      return;
    }
    pushCandidate(`${raw.replace(/\/+$/, "")}/vf`, panel?.label);
  });

  pushCandidate(`${seasonToken}/vf`, "VF");
  const scoreCandidate = (path) => {
    const lower = String(path || "").toLowerCase();
    let score = 0;
    if (new RegExp(`(^|/)${seasonToken}(/|$)`, "i").test(lower)) {
      score += 80;
    } else if (lower.includes(`/${seasonToken}`)) {
      score += 40;
    }
    if (/\/vf(\/|$)/i.test(lower)) {
      score += 10;
    }
    if (/(^|\/)saison\d+hs\b|hors[-\s]?serie|ova|special/i.test(lower)) {
      score -= 20;
    }
    return score;
  };
  candidates.sort((left, right) => scoreCandidate(right.path) - scoreCandidate(left.path));
  return candidates;
}

async function tryResolveAnimePanelSources(baseCatalogUrl, panelPath, episode = 1) {
  const safePath = normalizeAnimePanelPath(panelPath);
  if (!safePath) {
    return null;
  }
  const seasonPageUrl = new URL(`${safePath.replace(/^\/+/, "")}/`, baseCatalogUrl).href;
  const seasonPage = await fetchRemoteText(seasonPageUrl, "text/html");
  if (seasonPage.status < 200 || seasonPage.status >= 300) {
    return null;
  }
  const episodesScriptUrl =
    extractEpisodesScriptUrl(seasonPage.body, seasonPageUrl) ||
    new URL("episodes.js", seasonPageUrl).href;
  const episodesScript = await fetchRemoteText(episodesScriptUrl, "application/javascript, text/javascript, */*");
  if (episodesScript.status < 200 || episodesScript.status >= 300) {
    return null;
  }
  const arrays = parseEpisodeArrays(episodesScript.body);
  const episodeSources = rankAnimeEpisodeSources(pickEpisodeSources(arrays, episode));
  if (episodeSources.length === 0) {
    return null;
  }
  return {
    seasonPageUrl,
    episodesScriptUrl,
    arrays,
    episodeSources,
  };
}

function extractEpisodesScriptUrl(pageHtml, pageUrl) {
  const text = String(pageHtml || "");
  const match = text.match(/src=['"]([^'"]*episodes\.js(?:\?[^'"]*)?)['"]/i);
  if (!match) {
    return "";
  }
  const raw = String(match?.[1] || "").trim();
  if (!raw) {
    return "";
  }
  try {
    return new URL(raw, pageUrl).href;
  } catch {
    return "";
  }
}

function parseEpisodeArrays(episodesScript) {
  const text = String(episodesScript || "");
  const arrays = [];
  const regex = /(?:^|[;\r\n])\s*(?:var|let|const)?\s*eps(\d+)\s*=\s*\[([\s\S]*?)\];/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const name = `eps${String(match?.[1] || "").trim()}`;
    const body = String(match?.[2] || "");
    const urls = [];
    const urlRegex = /['"]([^'"]+)['"]/g;
    let urlMatch;
    while ((urlMatch = urlRegex.exec(body)) !== null) {
      const normalized = normalizeAnimeEpisodeUrl(String(urlMatch?.[1] || "").trim());
      if (!normalized) {
        continue;
      }
      urls.push(normalized);
    }
    if (urls.length > 0) {
      arrays.push({ name, urls });
    }
  }
  return arrays;
}

function pickEpisodeSources(episodeArrays, episode = 1) {
  const safeEpisode = Math.max(1, Number(episode || 1));
  const index = safeEpisode - 1;
  const rows = Array.isArray(episodeArrays) ? episodeArrays : [];
  const sources = [];
  const seen = new Set();
  rows.forEach((entry) => {
    const urls = Array.isArray(entry?.urls) ? entry.urls : [];
    const candidate = normalizeAnimeEpisodeUrl(urls[index] || "");
    if (!candidate) {
      return;
    }
    const key = candidate.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    sources.push({
      name: String(entry?.name || ""),
      candidate,
      format: inferAnimeSourceFormat(candidate),
      host: inferAnimeSourceName(candidate, String(entry?.name || "")),
    });
  });
  return sources;
}

function rankAnimeEpisodeSources(sources) {
  const rows = Array.isArray(sources) ? sources.slice() : [];
  const formatScore = new Map([
    ["hls", 4],
    ["mp4", 3],
    ["webm", 2],
    ["dash", 2],
    ["embed", 1],
    ["unknown", 0],
  ]);
  rows.sort((left, right) => {
    const leftScore = Number(formatScore.get(String(left?.format || "embed")) || 0);
    const rightScore = Number(formatScore.get(String(right?.format || "embed")) || 0);
    if (leftScore !== rightScore) {
      return rightScore - leftScore;
    }
    const leftIsSibnet = /sibnet\.ru/i.test(String(left?.candidate || ""));
    const rightIsSibnet = /sibnet\.ru/i.test(String(right?.candidate || ""));
    if (leftIsSibnet !== rightIsSibnet) {
      return leftIsSibnet ? -1 : 1;
    }
    return 0;
  });
  return rows;
}

function pickSibnetEpisodeUrl(episodeArrays, episode = 1) {
  const safeEpisode = Math.max(1, Number(episode || 1));
  const index = safeEpisode - 1;
  const rows = Array.isArray(episodeArrays) ? episodeArrays : [];
  const ranked = rows
    .map((entry) => {
      const urls = Array.isArray(entry?.urls) ? entry.urls : [];
      const sibnetCount = urls.reduce(
        (count, value) => (String(value || "").toLowerCase().includes("sibnet.ru") ? count + 1 : count),
        0
      );
      const candidate = normalizeSibnetUrl(urls[index] || "");
      return {
        name: String(entry?.name || ""),
        sibnetCount,
        candidate,
      };
    })
    .filter((entry) => Boolean(entry.candidate))
    .sort((left, right) => Number(right.sibnetCount || 0) - Number(left.sibnetCount || 0));

  const sibnetAtEpisode = ranked.find((entry) => String(entry.candidate || "").toLowerCase().includes("sibnet.ru"));
  if (sibnetAtEpisode) {
    return sibnetAtEpisode;
  }
  return ranked[0] || { name: "", sibnetCount: 0, candidate: "" };
}


function sanitizeAnimeSamaCatalogUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const absolute = new URL(raw, ANIME_SAMA_BASE).href;
    const parsed = new URL(absolute);
    if (!/anime-sama\.(tv|to)/i.test(parsed.hostname || "")) {
      return "";
    }
    if (!/^\/catalogue\//i.test(parsed.pathname || "")) {
      return "";
    }
    return parsed.href;
  } catch {
    return "";
  }
}

async function resolveAnimeSibnetSource(title, season, episode, language = "vostfr", options = {}) {
  const safeTitle = String(title || "").trim();
  if (!safeTitle) {
    throw new Error("Missing title");
  }

  const safeSeason = Math.max(1, Number(season || 1));
  const safeEpisode = Math.max(1, Number(episode || 1));
  const safeLanguage = String(language || "vostfr").toLowerCase() === "vf" ? "vf" : "vostfr";
  const cacheKey = `${safeTitle.toLowerCase()}|${safeSeason}|${safeEpisode}|${safeLanguage}`;
  const now = Date.now();
  const cached = animeSibnetCache.get(cacheKey);
  if (cached && Number(cached.expiresAt || 0) > now) {
    return cached.value;
  }

  let catalogUrl = sanitizeAnimeSamaCatalogUrl(options?.catalogUrl || "");
  if (!catalogUrl) {
    const queries = buildAnimeSearchQueries(safeTitle);
    for (const query of queries) {
      const searchResponse = await fetchRemoteForm(ANIME_SAMA_SEARCH_ENDPOINT, {
        query,
      });
      if (searchResponse.status < 200 || searchResponse.status >= 300) {
        continue;
      }
      catalogUrl = extractFirstAnimeCatalogueLink(searchResponse.body, query);
      if (catalogUrl) {
        break;
      }
    }
  }
  if (!catalogUrl) {
    throw new Error("Anime not found");
  }

  const catalogResponse = await fetchRemoteText(catalogUrl, "text/html");
  if (catalogResponse.status < 200 || catalogResponse.status >= 300) {
    throw new Error("Anime page unavailable");
  }
  const panels = extractAnimePanels(catalogResponse.body);
  const selectedPanel = chooseAnimePanelPath(panels, safeSeason, safeLanguage);
  if (!selectedPanel || !selectedPanel.path) {
    throw new Error("Anime panel unavailable");
  }
  let selectedPanelPath = selectedPanel.path;
  let resolvedLanguage = String(selectedPanel.language || safeLanguage).toLowerCase();
  let selectedPanelLabel = String(selectedPanel.label || "").trim();
  let matchedRequestedLanguage = Boolean(selectedPanel.matchedRequested);

  const baseCatalogUrl = catalogUrl.endsWith("/") ? catalogUrl : `${catalogUrl}/`;
  let panelResolution = null;
  if (safeLanguage === "vf" && resolvedLanguage !== "vf") {
    const vfCandidates = buildAnimeVfCandidatePanels(panels, safeSeason);
    for (const candidate of vfCandidates) {
      panelResolution = await tryResolveAnimePanelSources(baseCatalogUrl, candidate.path, safeEpisode);
      if (panelResolution) {
        selectedPanelPath = candidate.path;
        selectedPanelLabel = String(candidate.label || "VF").trim();
        resolvedLanguage = "vf";
        matchedRequestedLanguage = true;
        break;
      }
    }
  }
  if (!panelResolution) {
    panelResolution = await tryResolveAnimePanelSources(baseCatalogUrl, selectedPanelPath, safeEpisode);
  }
  if (!panelResolution) {
    throw new Error("Anime season page unavailable");
  }
  const { seasonPageUrl, episodesScriptUrl, arrays, episodeSources } = panelResolution;
  if (episodeSources.length === 0) {
    throw new Error("Anime sources unavailable");
  }
  const sibnetPick = episodeSources.find((entry) => /sibnet\.ru/i.test(String(entry?.candidate || "")));
  const primary = sibnetPick || episodeSources[0];
  const sourceUrl = normalizeAnimeEpisodeUrl(primary?.candidate || "");
  if (!sourceUrl) {
    throw new Error("Anime source unavailable");
  }
  const sources = episodeSources.map((entry) => ({
    stream_url: String(entry?.candidate || "").trim(),
    source_name: inferAnimeSourceName(entry?.candidate || "", String(entry?.host || entry?.name || "")),
    format: inferAnimeSourceFormat(entry?.candidate || ""),
    language: resolvedLanguage,
  }));

  const payload = {
    title: safeTitle,
    season: safeSeason,
    episode: safeEpisode,
    requestedLanguage: safeLanguage,
    language: resolvedLanguage,
    matchedRequestedLanguage,
    catalogUrl,
    seasonPageUrl,
    episodesScriptUrl,
    sourceUrl,
    sourceArray: primary?.name || "",
    panelPath: selectedPanelPath,
    panelLabel: selectedPanelLabel,
    sources,
  };

  animeSibnetCache.set(cacheKey, {
    expiresAt: now + ANIME_SIBNET_CACHE_MS,
    value: payload,
  });
  if (animeSibnetCache.size > 450) {
    const oldest = Array.from(animeSibnetCache.entries()).sort(
      (left, right) => Number(left?.[1]?.expiresAt || 0) - Number(right?.[1]?.expiresAt || 0)
    );
    oldest.slice(0, animeSibnetCache.size - 450).forEach(([key]) => animeSibnetCache.delete(key));
  }

  return payload;
}

function extractAnimeSeasonNumbers(panels) {
  const rows = Array.isArray(panels) ? panels : [];
  const set = new Set();
  rows.forEach((entry) => {
    const match = String(entry?.path || "").match(/saison(\d+)/i);
    if (!match) {
      return;
    }
    const value = Number(match[1]);
    if (Number.isFinite(value) && value > 0) {
      set.add(value);
    }
  });
  const seasons = Array.from(set).sort((a, b) => a - b);
  return seasons.length > 0 ? seasons : [1];
}

function getAnimeEpisodeCount(arrays) {
  const rows = Array.isArray(arrays) ? arrays : [];
  let max = 0;
  rows.forEach((entry) => {
    const count = Array.isArray(entry?.urls) ? entry.urls.length : 0;
    if (count > max) {
      max = count;
    }
  });
  return max;
}

function buildAnimeEpisodeList(count) {
  const total = Math.max(0, Number(count || 0));
  const episodes = [];
  for (let index = 1; index <= total; index += 1) {
    episodes.push({
      episode: index,
      name: `Episode ${index}`,
      runtime: 0,
      airDate: "",
      isSoon: false,
    });
  }
  return episodes;
}

async function resolveAnimeSeasons(title, language = "vf", options = {}) {
  const safeTitle = String(title || "").trim();
  if (!safeTitle) {
    throw new Error("Missing title");
  }
  const safeLanguage = String(language || "vf").toLowerCase() === "vostfr" ? "vostfr" : "vf";
  const cacheKey = `${safeTitle.toLowerCase()}|${safeLanguage}`;
  const now = Date.now();
  const cached = animeSeasonsCache.get(cacheKey);
  if (cached && Number(cached.expiresAt || 0) > now) {
    return cached.value;
  }

  let catalogUrl = sanitizeAnimeSamaCatalogUrl(options?.catalogUrl || "");
  if (!catalogUrl) {
    const queries = buildAnimeSearchQueries(safeTitle);
    for (const query of queries) {
      const searchResponse = await fetchRemoteForm(ANIME_SAMA_SEARCH_ENDPOINT, {
        query,
      });
      if (searchResponse.status < 200 || searchResponse.status >= 300) {
        continue;
      }
      catalogUrl = extractFirstAnimeCatalogueLink(searchResponse.body, query);
      if (catalogUrl) {
        break;
      }
    }
  }
  if (!catalogUrl) {
    throw new Error("Anime not found");
  }

  const catalogResponse = await fetchRemoteText(catalogUrl, "text/html");
  if (catalogResponse.status < 200 || catalogResponse.status >= 300) {
    throw new Error("Anime page unavailable");
  }
  const panels = extractAnimePanels(catalogResponse.body);
  const seasonNumbers = extractAnimeSeasonNumbers(panels);
  const baseCatalogUrl = catalogUrl.endsWith("/") ? catalogUrl : `${catalogUrl}/`;
  const seasons = [];

  for (const season of seasonNumbers) {
    const panelPick = chooseAnimePanelPath(panels, season, safeLanguage);
    let panelPath = panelPick?.path || "";
    let panelResolution = null;
    if (safeLanguage === "vf" && panelPick && String(panelPick.language || "") !== "vf") {
      const vfCandidates = buildAnimeVfCandidatePanels(panels, season);
      for (const candidate of vfCandidates) {
        panelResolution = await tryResolveAnimePanelSources(baseCatalogUrl, candidate.path, 1);
        if (panelResolution) {
          panelPath = candidate.path;
          break;
        }
      }
    }
    if (!panelResolution && panelPath) {
      panelResolution = await tryResolveAnimePanelSources(baseCatalogUrl, panelPath, 1);
    }
    if (!panelResolution) {
      continue;
    }
    const episodeCount = getAnimeEpisodeCount(panelResolution.arrays);
    if (episodeCount <= 0) {
      continue;
    }
    seasons.push({
      season,
      episodes: buildAnimeEpisodeList(episodeCount),
    });
  }

  if (seasons.length === 0) {
    throw new Error("Anime seasons unavailable");
  }

  const payload = {
    title: safeTitle,
    language: safeLanguage,
    catalogUrl,
    seasons,
  };
  animeSeasonsCache.set(cacheKey, {
    expiresAt: now + ANIME_SEASONS_CACHE_MS,
    value: payload,
  });
  if (animeSeasonsCache.size > 280) {
    const oldest = Array.from(animeSeasonsCache.entries()).sort(
      (left, right) => Number(left?.[1]?.expiresAt || 0) - Number(right?.[1]?.expiresAt || 0)
    );
    oldest.slice(0, animeSeasonsCache.size - 280).forEach(([key]) => animeSeasonsCache.delete(key));
  }

  return payload;
}

function buildHlsProxyPath(targetUrl) {
  return `/api/hls-proxy?url=${encodeURIComponent(String(targetUrl || "").trim())}`;
}

function decodeNumericPlaylistTokens(tokens) {
  if (!Array.isArray(tokens) || tokens.length < 6 || tokens.length > 120000) {
    return "";
  }
  if (!tokens.every((token) => /^\d{1,3}$/.test(String(token || "")))) {
    return "";
  }
  const bytes = tokens.map((token) => Number(token));
  if (bytes.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
    return "";
  }
  try {
    const decoded = Buffer.from(bytes)
      .toString("utf8")
      .replace(/^\uFEFF/, "")
      .trim();
    return decoded.includes("#EXTM3U") ? decoded : "";
  } catch {
    return "";
  }
}

function decodeNumericPlaylistBySeparators(rawBody) {
  const text = String(rawBody || "").replace(/\u0000/g, "").trim();
  if (!text) {
    return "";
  }

  const perLineTokens = text
    .split(/\r?\n/)
    .map((line) => String(line || "").trim())
    .filter(Boolean);
  const lineDecoded = decodeNumericPlaylistTokens(perLineTokens);
  if (lineDecoded) {
    return lineDecoded;
  }

  const packedTokens = text
    .split(/[^0-9]+/)
    .map((token) => String(token || "").trim())
    .filter(Boolean);
  return decodeNumericPlaylistTokens(packedTokens);
}

function decodeCompactNumericPlaylistBody(rawBody) {
  const digits = String(rawBody || "").replace(/\s+/g, "");
  if (!digits || !/^\d+$/.test(digits) || digits.length < 12 || digits.length > 250000) {
    return "";
  }

  const size = digits.length;
  const best = new Array(size + 1).fill(null);
  best[size] = { score: 0, next: -1, value: -1 };

  for (let cursor = size - 1; cursor >= 0; cursor -= 1) {
    let bestNode = null;
    for (const chunkLength of [2, 3]) {
      const next = cursor + chunkLength;
      if (next > size || !best[next]) {
        continue;
      }
      if (digits[cursor] === "0") {
        continue;
      }

      const value = Number(digits.slice(cursor, next));
      if (!Number.isInteger(value) || value < 0 || value > 255) {
        continue;
      }

      let score = best[next].score;
      if (value === 10 || value === 13 || value === 9) {
        score += 0.5;
      } else if (value >= 32 && value <= 126) {
        score += 6;
      } else {
        score -= 40;
      }
      if (value === 35 || value === 69 || value === 88 || value === 77 || value === 51 || value === 85) {
        score += 0.8;
      }

      if (!bestNode || score > bestNode.score) {
        bestNode = { score, next, value };
      }
    }
    best[cursor] = bestNode;
  }

  if (!best[0]) {
    return "";
  }

  const bytes = [];
  let pointer = 0;
  while (pointer < size) {
    const node = best[pointer];
    if (!node) {
      return "";
    }
    bytes.push(node.value);
    pointer = node.next;
  }

  if (bytes.length < 6) {
    return "";
  }

  try {
    return Buffer.from(bytes).toString("utf8").trim();
  } catch {
    return "";
  }
}

function decodeNumericPlaylistBody(rawBody) {
  const text = String(rawBody || "").trim();
  if (!text) {
    return "";
  }
  if (text.includes("#EXTM3U")) {
    return text;
  }

  const separatedDecoded = decodeNumericPlaylistBySeparators(text);
  if (separatedDecoded.includes("#EXTM3U")) {
    return separatedDecoded;
  }

  const compactDecoded = decodeCompactNumericPlaylistBody(text);
  if (compactDecoded.includes("#EXTM3U")) {
    return compactDecoded;
  }

  return text;
}

function rewriteHlsPlaylistUri(rawUri, baseUrl) {
  const value = String(rawUri || "").trim();
  if (!value || value.startsWith("data:")) {
    return value;
  }

  try {
    const absolute = new URL(value, baseUrl).href;
    const safe = parseSafeRemoteUrl(absolute);
    if (!safe) {
      return value;
    }
    return buildHlsProxyPath(safe.href);
  } catch {
    return value;
  }
}

function rewriteHlsPlaylistBody(playlistBody, baseUrl) {
  const text = String(playlistBody || "");
  const lines = text.split(/\r?\n/);
  const rewritten = lines.map((line) => {
    const rawLine = String(line || "");
    const trimmed = rawLine.trim();
    if (!trimmed) {
      return rawLine;
    }

    if (trimmed.startsWith("#")) {
      if (!rawLine.includes("URI=")) {
        return rawLine;
      }
      return rawLine.replace(/URI="([^"]+)"/g, (_match, uriValue) => {
        const proxied = rewriteHlsPlaylistUri(uriValue, baseUrl);
        return `URI="${proxied}"`;
      });
    }

    return rewriteHlsPlaylistUri(trimmed, baseUrl);
  });
  return rewritten.join("\n");
}

function pipeUpstreamBodyToResponse(upstream, res) {
  return new Promise((resolve, reject) => {
    if (!upstream?.body) {
      res.end();
      resolve();
      return;
    }

    const source = Readable.fromWeb(upstream.body);
    let done = false;
    const settle = (error) => {
      if (done) {
        return;
      }
      done = true;
      if (error) {
        reject(error);
        return;
      }
      resolve();
    };

    source.on("error", (error) => {
      if (!res.headersSent) {
        try {
          res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
        } catch {
          // ignore
        }
      }
      try {
        res.end();
      } catch {
        // ignore
      }
      settle(error);
    });
    res.on("error", (error) => settle(error));
    res.on("close", () => settle());
    source.pipe(res);
  });
}

async function fetchHlsUpstreamWithFallback(target, range, signal, method = "GET") {
  const safeMethod = String(method || "GET").toUpperCase() === "HEAD" ? "HEAD" : "GET";
  const baseHeaders = {
    Accept: "*/*",
    "User-Agent": HLS_PROXY_USER_AGENT,
  };
  const headerVariants = [
    {
      Referer: `${target.origin}/`,
      Origin: target.origin,
    },
    {
      Referer: `${PURSTREAM_WEB_BASE}/`,
      Origin: PURSTREAM_WEB_BASE,
    },
    {},
  ];

  let lastResponse = null;
  for (let index = 0; index < headerVariants.length; index += 1) {
    const headers = {
      ...baseHeaders,
      ...headerVariants[index],
    };
    if (range) {
      headers.Range = range;
    }

    const upstream = await fetch(target.href, {
      method: safeMethod,
      headers,
      redirect: "follow",
      signal,
    });
    lastResponse = upstream;
    const status = Number(upstream.status || 0);
    if (status !== 403 && status !== 429) {
      return upstream;
    }
    if (index < headerVariants.length - 1) {
      try {
        await upstream.arrayBuffer();
      } catch {
        // ignore body drain issues
      }
      await sleep(120 + index * 180);
    }
  }
  return lastResponse;
}

async function handleHlsProxy(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/hls-proxy") {
    return false;
  }
  const requestMethod = String(req.method || "GET").toUpperCase();
  if (requestMethod !== "GET" && requestMethod !== "HEAD") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const targetParam = requestUrl.searchParams.get("url");
  const target = parseSafeRemoteUrl(targetParam);
  if (!target) {
    sendJson(res, 400, { error: "Invalid HLS url" });
    return true;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), Math.max(18000, PROXY_TIMEOUT_MS));
  try {
    const range = String(req.headers.range || "").trim();
    const likelyPlaylistPath = String(target.pathname || "").toLowerCase().endsWith(".m3u8");
    let upstream = await fetchHlsUpstreamWithFallback(
      target,
      likelyPlaylistPath ? "" : range,
      controller.signal,
      requestMethod
    );
    if (
      requestMethod === "HEAD" &&
      [400, 401, 403, 404, 405, 429, 500, 501].includes(Number(upstream.status || 0))
    ) {
      // Some hosts don't support HEAD reliably; fall back to GET headers for player probes.
      upstream = await fetchHlsUpstreamWithFallback(target, likelyPlaylistPath ? "" : range, controller.signal, "GET");
    }

    const status = Number(upstream.status || 502);
    const contentType = String(upstream.headers.get("content-type") || "").toLowerCase();
    const isPlaylist =
      target.pathname.toLowerCase().endsWith(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("vnd.apple.mpegurl");

    if (isPlaylist) {
      // Always return full playlists to Safari/iOS. Partial ranged playlist responses can
      // break HLS parsing and trigger instant "no supported source" errors.
      if (range) {
        try {
          await upstream.arrayBuffer();
        } catch {
          // ignore body drain issues
        }
        upstream = await fetchHlsUpstreamWithFallback(target, "", controller.signal, "GET");
      }
      if (requestMethod === "HEAD") {
        const headers = {
          "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
          "Cache-Control": "no-cache",
        };
        const contentLength = upstream.headers.get("content-length");
        if (contentLength) {
          headers["Content-Length"] = String(contentLength);
        }
        res.writeHead(200, headers);
        res.end();
        return true;
      }
      const buffer = Buffer.from(await upstream.arrayBuffer());
      const rawPlaylist = buffer.toString("utf8");
      const bodyText = decodeNumericPlaylistBody(rawPlaylist);
      let rewritten = rewriteHlsPlaylistBody(bodyText, target.href);
      if (!rewritten.includes("#EXTM3U")) {
        const rescueDecoded = decodeNumericPlaylistBySeparators(rewritten) || decodeNumericPlaylistBySeparators(rawPlaylist);
        if (rescueDecoded.includes("#EXTM3U")) {
          rewritten = rewriteHlsPlaylistBody(rescueDecoded, target.href);
        }
      }
      if (!rewritten.includes("#EXTM3U")) {
        // If proxy-side rewriting still fails, hand off to the upstream playlist
        // instead of returning a hard 502. This improves iOS native HLS resilience.
        res.writeHead(302, {
          Location: target.href,
          "Cache-Control": "no-cache",
        });
        res.end();
        return true;
      }
      res.writeHead(200, {
        "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
        "Cache-Control": "no-cache",
      });
      res.end(rewritten);
      return true;
    }

    clearTimeout(timeoutId);

    const headers = {
      "Content-Type": String(upstream.headers.get("content-type") || "application/octet-stream"),
      "Cache-Control": "no-cache",
    };
    const contentRange = upstream.headers.get("content-range");
    if (contentRange) {
      headers["Content-Range"] = contentRange;
      headers["Accept-Ranges"] = "bytes";
    } else if (upstream.headers.get("accept-ranges")) {
      headers["Accept-Ranges"] = String(upstream.headers.get("accept-ranges"));
    }
    const contentLength = upstream.headers.get("content-length");
    if (contentLength) {
      headers["Content-Length"] = String(contentLength);
    }
    res.writeHead(status, headers);
    if (requestMethod === "HEAD") {
      res.end();
      return true;
    }
    await pipeUpstreamBodyToResponse(upstream, res);
    return true;
  } catch (error) {
    const code = String(error?.name || "").toLowerCase().includes("abort") ? 504 : 502;
    if (requestMethod === "GET" && target?.href) {
      res.writeHead(302, {
        Location: target.href,
        "Cache-Control": "no-cache",
      });
      res.end();
      return true;
    }
    sendJson(res, code, { error: "HLS proxy failed" });
    return true;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchPurstreamCalendarMonth(month, year) {
  const target = `${PURSTREAM_API_BASE}/calendar/${month}/${year}/days`;
  const upstream = await fetchRemote(target);
  if (upstream.status < 200 || upstream.status >= 300) {
    throw new Error("Purstream calendar unavailable");
  }
  return JSON.parse(upstream.body);
}

async function handleAnalyticsHeartbeat(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/analytics/heartbeat") {
    return false;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      Allow: "POST, OPTIONS",
      "Cache-Control": "no-cache",
    });
    res.end();
    return true;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  try {
    const payload = await readJsonBody(req);
    markAnalyticsHeartbeat(req, payload || {});
    pushDiscordStats("heartbeat").catch(() => {
      // best effort only
    });
    sendJson(res, 200, { type: "success" });
    return true;
  } catch {
    sendJson(res, 400, { error: "Invalid heartbeat payload" });
    return true;
  }
}

async function handleAnalyticsWebhookStatus(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/analytics/webhook-status") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const stats = buildAnalyticsSnapshot();
  sendJson(res, 200, {
    type: "success",
    webhookConfigured: isDiscordWebhookConfigured(),
    hasMessageId: /^\d{8,30}$/.test(String(discordStatsMessageId || "")),
    messageId: sanitizeToken(discordStatsMessageId, 32),
    activeWebhookHost: (() => {
      try {
        const active = DISCORD_WEBHOOK_CANDIDATES[discordWebhookCandidateIndex] || DISCORD_WEBHOOK_URL;
        return sanitizeToken(new URL(active).host, 60);
      } catch {
        return "";
      }
    })(),
    lastPushAt: analyticsLastPushAt ? new Date(analyticsLastPushAt).toISOString() : "",
    nextAllowedAt: discordNextAllowedAt ? new Date(discordNextAllowedAt).toISOString() : "",
    nextDelayMs: Math.max(0, Number(discordNextAllowedAt || 0) - Date.now()),
    intervalMs: DISCORD_PUSH_INTERVAL_MS,
    lastResult: discordLastResult,
    snapshot: {
      generatedAt: stats.generatedAt,
      activeNow: Number(stats.activeNow || 0),
      activeIps: Number(stats.activeIps || 0),
      unique24h: Number(stats.unique24h || 0),
      uniqueIps24h: Number(stats.uniqueIps24h || 0),
      heartbeats24h: Number(stats.heartbeats24h || 0),
      countriesActive: Number(stats.countriesActive || 0),
      devicesActive: stats.devicesActive || {},
      topPlatforms: (Array.isArray(stats.platformsActive) ? stats.platformsActive : []).slice(0, 6),
      topBrowsers: (Array.isArray(stats.browsersActive) ? stats.browsersActive : []).slice(0, 6),
    },
  });
  return true;
}

async function handleSuggestionSubmit(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/suggestions") {
    return false;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      Allow: "POST, OPTIONS",
      "Cache-Control": "no-cache",
    });
    res.end();
    return true;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const relayUrl = buildSuggestionsRelayUrl();
  if (!relayUrl) {
    sendJson(res, 503, { error: "Suggestions relay unavailable" });
    return true;
  }

  let payload;
  try {
    payload = await readJsonBody(req, 24 * 1024);
  } catch {
    sendJson(res, 400, { error: "Invalid request body" });
    return true;
  }

  const trapValue = sanitizeSuggestionText(payload?.website, 120);
  if (trapValue) {
    // Honeypot: pretend success to silently discard obvious bot submissions.
    sendJson(res, 200, { type: "success" });
    return true;
  }

  const type = normalizeSuggestionType(payload?.type);
  const title = sanitizeSuggestionText(payload?.title, 120);
  const message = sanitizeSuggestionText(payload?.message, SUGGESTIONS_MAX_MESSAGE_CHARS);
  const contactEmailRaw = String(payload?.email || "").trim();
  const contactEmail = normalizeSuggestionEmail(contactEmailRaw);
  const contactName = sanitizeSuggestionText(payload?.name, 80);
  const sourcePage = sanitizeToken(payload?.page, 180);
  const clientTs = Number(payload?.clientTs || 0);

  if (message.length < SUGGESTIONS_MIN_MESSAGE_CHARS) {
    sendJson(res, 400, { error: `Message too short (minimum ${SUGGESTIONS_MIN_MESSAGE_CHARS} chars)` });
    return true;
  }
  if (contactEmailRaw && !contactEmail) {
    sendJson(res, 400, { error: "Invalid email" });
    return true;
  }
  if (Number.isFinite(clientTs) && clientTs > 0) {
    const elapsed = Date.now() - clientTs;
    if (elapsed < SUGGESTIONS_MIN_SUBMIT_MS) {
      sendJson(res, 429, { error: "Please wait a moment before sending your suggestion." });
      return true;
    }
  }

  const remoteIp = getRemoteAddress(req);
  const rateLimit = checkSuggestionRateLimit(remoteIp);
  if (rateLimit.limited) {
    sendJson(res, 429, {
      error: "Too many requests, please try again in a moment.",
      retryAfterMs: rateLimit.retryAfterMs,
    });
    return true;
  }

  const suggestionFingerprint = buildSuggestionFingerprint({
    ip: sanitizeToken(remoteIp, 80),
    type,
    title,
    message,
    contactEmail,
    contactName,
    sourcePage,
  });
  const duplicate = checkSuggestionDuplicate(suggestionFingerprint);
  if (duplicate.duplicate) {
    sendJson(res, 429, {
      error: "Duplicate suggestion detected. Please wait before resending the same message.",
      retryAfterMs: duplicate.retryAfterMs,
    });
    return true;
  }

  const now = new Date();
  const submittedAt = now.toISOString();
  const subjectParts = ["Zenix suggestion", suggestionTypeLabel(type)];
  if (title) {
    subjectParts.push(title);
  }
  const subject = subjectParts.join(" | ").slice(0, 220);

  const detailsLines = [
    `Type: ${suggestionTypeLabel(type)}`,
    title ? `Titre: ${title}` : "",
    contactName ? `Pseudo: ${contactName}` : "",
    contactEmail ? `Email: ${contactEmail}` : "",
    sourcePage ? `Page: ${sourcePage}` : "",
    `IP: ${sanitizeToken(remoteIp, 80)}`,
    `Date: ${submittedAt}`,
    "",
    "Message:",
    message,
  ].filter(Boolean);

  const relayHost = CANONICAL_HOST || normalizeHostName(requestUrl.hostname || req.headers.host || "") || "zenix.best";
  const relayOrigin = `${CANONICAL_SCHEME}://${relayHost}`;

  try {
    const relayResponse = await fetchRemoteForm(
      relayUrl,
      {
        _subject: subject,
        _captcha: "false",
        _template: "table",
        name: contactName || "Visiteur Zenix",
        email: contactEmail || "noreply@zenix.best",
        message: detailsLines.join("\n"),
      },
      "application/json, text/plain, */*",
      {
        Origin: relayOrigin,
        Referer: `${relayOrigin}/`,
      }
    );

    if (relayResponse.status < 200 || relayResponse.status >= 300) {
      console.warn(`[suggestions] Relay failed with status ${relayResponse.status}.`);
      sendJson(res, 502, { error: "Suggestions relay failed" });
      return true;
    }

    const relayPayload = parseJsonSafe(relayResponse.body);
    if (relayPayload && String(relayPayload.success || "").toLowerCase() !== "true") {
      const relayMessage = sanitizeSuggestionText(relayPayload.message, 220);
      if (/activation|activate form/i.test(relayMessage)) {
        sendJson(res, 503, { error: "Email relay not activated yet. Check the activation email from FormSubmit." });
        return true;
      }
      console.warn(`[suggestions] Relay rejected payload: ${relayMessage || "unknown reason"}`);
      sendJson(res, 502, { error: "Suggestions relay rejected request" });
      return true;
    }

    rememberSuggestionFingerprint(suggestionFingerprint);
    sendJson(res, 200, { type: "success" });
    return true;
  } catch (error) {
    console.warn(`[suggestions] Relay error: ${String(error?.message || error || "unknown")}`);
    sendJson(res, 502, { error: "Suggestions relay unavailable" });
    return true;
  }
}

async function fetchAnimePlanningPage() {
  const upstream = await fetchRemoteText(ANIME_PLANNING_URL, "text/html");
  if (upstream.status < 200 || upstream.status >= 300) {
    throw new Error("Anime planning unavailable");
  }
  return upstream.body;
}

async function handleCalendarOverview(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/calendar/overview") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const now = new Date();
  const month = toInt(requestUrl.searchParams.get("month"), now.getMonth() + 1, 1, 12);
  const year = toInt(requestUrl.searchParams.get("year"), now.getFullYear(), 2024, 2099);
  const cacheKey = `calendar-overview:${year}-${month}`;
  const current = Date.now();
  const cached = calendarCache.get(cacheKey);

  if (cached && cached.expiresAt > current) {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Zenix-Cache": "HIT",
    });
    res.end(cached.body);
    return true;
  }

  try {
    const [purstreamResult, animeResult, supplementalResult] = await Promise.allSettled([
      fetchPurstreamCalendarMonth(month, year),
      fetchAnimePlanningPage(),
      loadSupplementalCatalogEntries(false),
    ]);

    let purstream = {
      month,
      year,
      monthName: "",
      items: [],
    };
    let anime = {
      days: [],
      items: [],
    };
    let supplemental = {
      items: [],
    };

    if (purstreamResult.status === "fulfilled") {
      try {
        purstream = parsePurstreamCalendar(purstreamResult.value, month, year);
      } catch {
        purstream = {
          month,
          year,
          monthName: "",
          items: [],
        };
      }
    }

    if (animeResult.status === "fulfilled") {
      try {
        anime = parseAnimePlanning(animeResult.value, year);
      } catch {
        anime = {
          days: [],
          items: [],
        };
      }
    }

    if (supplementalResult.status === "fulfilled") {
      try {
        const supplementalRows = Array.isArray(supplementalResult.value) ? supplementalResult.value : [];
        const monthToken = `${year}-${String(month).padStart(2, "0")}-`;
        const monthlyRows = supplementalRows.filter((entry) => {
          const dateIso = toIsoDate(String(entry?.supplemental_date || entry?.release_date || "").trim());
          return Boolean(dateIso) && dateIso.startsWith(monthToken);
        });
        if (monthlyRows.length > 0) {
          await hydrateSupplementalRowCovers(monthlyRows, SUPPLEMENTAL_COVER_MAX_PER_RESPONSE);
          await annotateNakiosAvailability(monthlyRows, {
            maxProbes: Math.max(
              24,
              Math.min(
                NAKIOS_AVAILABILITY_MAX_PROBES_PER_RESPONSE * 2,
                monthlyRows.length
              )
            ),
          });
        }
        supplemental = {
          items: buildSupplementalCalendarItems(monthlyRows, month, year),
        };
      } catch {
        supplemental = {
          items: [],
        };
      }
    }

    if (purstream.items.length === 0 && anime.items.length === 0 && supplemental.items.length === 0) {
      sendJson(res, 502, { error: "Calendar providers unavailable" });
      return true;
    }

    const merged = buildMergedCalendar(purstream.items, anime.items, supplemental.items);

    const payload = {
      apiVersion: "zenix-calendar-v1",
      type: "success",
      data: {
        generatedAt: new Date().toISOString(),
        month,
        year,
        purstream: {
          month: purstream.month,
          year: purstream.year,
          monthName: purstream.monthName,
          count: purstream.items.length,
          items: purstream.items,
        },
        animeSama: {
          count: anime.items.length,
          days: anime.days,
          items: anime.items,
        },
        supplemental: {
          count: supplemental.items.length,
          items: supplemental.items,
        },
        mergedCount: merged.length,
        merged,
        sourceLinks: {
          purstream: `${PURSTREAM_WEB_BASE}/calendar`,
          animeSama: ANIME_PLANNING_URL,
          nakios: NAKIOS_BASE,
        },
        providerStatus: {
          catalog: purstreamResult.status === "fulfilled",
          anime: animeResult.status === "fulfilled",
          supplemental: supplementalResult.status === "fulfilled",
        },
      },
    };
    const body = JSON.stringify(payload);
    calendarCache.set(cacheKey, {
      body,
      expiresAt: current + CALENDAR_CACHE_MS,
    });

    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Zenix-Cache": "MISS",
    });
    res.end(body);
    return true;
  } catch {
    sendJson(res, 502, { error: "Calendar providers unavailable" });
    return true;
  }
}

async function handleCatalogSupplemental(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/catalog/supplemental") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const page = toInt(requestUrl.searchParams.get("page"), 1, 1, 99999);
  const perPage = toInt(
    requestUrl.searchParams.get("perPage"),
    SUPPLEMENTAL_CATALOG_PAGE_SIZE,
    20,
    SUPPLEMENTAL_CATALOG_PAGE_SIZE
  );

  try {
    const entries = await loadSupplementalCatalogEntries(false);
    const pageData = buildSupplementalCatalogPage(entries, page, perPage);
    if (Array.isArray(pageData.data) && pageData.data.length > 0) {
      await hydrateSupplementalRowCovers(
        pageData.data,
        Math.max(12, Math.min(SUPPLEMENTAL_COVER_MAX_PER_RESPONSE, pageData.data.length))
      );
      await annotateNakiosAvailability(pageData.data, {
        maxProbes: Math.max(
          18,
          Math.min(NAKIOS_AVAILABILITY_MAX_PROBES_PER_RESPONSE, pageData.data.length)
        ),
      });
    }
    sendJson(res, 200, {
      apiVersion: "zenix-supplemental-catalog-v1",
      type: "success",
      data: {
        generatedAt: new Date().toISOString(),
        items: pageData,
        providers: {
          nakios: NAKIOS_BASE,
        },
      },
    });
    return true;
  } catch (error) {
    sendJson(res, 502, {
      error: "Supplemental catalog unavailable",
      reason: sanitizeToken(String(error?.message || ""), 120),
    });
    return true;
  }
}

async function handleAnimeSibnet(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/anime-sibnet") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const title = String(requestUrl.searchParams.get("title") || "").trim();
  if (title.length < 2) {
    sendJson(res, 400, { error: "Missing title" });
    return true;
  }

  const season = toInt(requestUrl.searchParams.get("season"), 1, 1, 200);
  const episode = toInt(requestUrl.searchParams.get("episode"), 1, 1, 20000);
  const language = String(requestUrl.searchParams.get("language") || "vostfr").toLowerCase() === "vf" ? "vf" : "vostfr";
  const catalogUrlParam = String(
    requestUrl.searchParams.get("catalogUrl") || requestUrl.searchParams.get("catalog") || ""
  ).trim();

  try {
    const data = await resolveAnimeSibnetSource(title, season, episode, language, {
      catalogUrl: catalogUrlParam,
    });
    sendJson(res, 200, {
      apiVersion: "zenix-anime-sibnet-v1",
      type: "success",
      data,
    });
    return true;
  } catch (error) {
    const reason = String(error?.message || "").toLowerCase();
    const status =
      reason.includes("not found") || reason.includes("unavailable") || reason.includes("missing") ? 404 : 502;
    sendJson(res, status, {
      error: "Anime sibnet unavailable",
      reason: sanitizeToken(String(error?.message || ""), 120),
    });
    return true;
  }
}

async function handleAnimeSeasons(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/anime-seasons") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const title = String(requestUrl.searchParams.get("title") || "").trim();
  if (title.length < 2) {
    sendJson(res, 400, { error: "Missing title" });
    return true;
  }

  const language = String(requestUrl.searchParams.get("language") || "vf").toLowerCase() === "vostfr" ? "vostfr" : "vf";
  const catalogUrlParam = String(
    requestUrl.searchParams.get("catalogUrl") || requestUrl.searchParams.get("catalog") || ""
  ).trim();

  try {
    const data = await resolveAnimeSeasons(title, language, {
      catalogUrl: catalogUrlParam,
    });
    sendJson(res, 200, {
      apiVersion: "zenix-anime-seasons-v1",
      type: "success",
      data: {
        title,
        language: data.language,
        catalogUrl: data.catalogUrl,
        items: data.seasons,
      },
    });
    return true;
  } catch (error) {
    sendJson(res, 502, {
      error: "Anime seasons unavailable",
      reason: sanitizeToken(String(error?.message || ""), 120),
    });
    return true;
  }
}

async function handleNakiosSource(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/nakios-source") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const mediaType = String(requestUrl.searchParams.get("type") || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const title = String(requestUrl.searchParams.get("title") || "").trim();
  const year = toInt(requestUrl.searchParams.get("year"), 0, 0, 2099);
  const season = toInt(requestUrl.searchParams.get("season"), 1, 1, 500);
  const episode = toInt(requestUrl.searchParams.get("episode"), 1, 1, 50000);
  let tmdbId = toInt(requestUrl.searchParams.get("tmdbId"), 0, 0, 999999999);

  if (tmdbId <= 0) {
    if (title.length < 2) {
      sendJson(res, 400, { error: "Missing title or tmdbId" });
      return true;
    }
    try {
      tmdbId = await resolveNakiosTmdbIdBySearch(title, mediaType, year);
    } catch {
      tmdbId = 0;
    }
  }

  if (tmdbId <= 0) {
    sendJson(res, 200, {
      apiVersion: "zenix-nakios-source-v1",
      type: "success",
      data: {
        title,
        mediaType,
        year,
        season: mediaType === "tv" ? season : 1,
        episode: mediaType === "tv" ? episode : 1,
        tmdbId: 0,
        count: 0,
        sources: [],
      },
    });
    return true;
  }

  try {
    const sources = await resolveNakiosSourcesByTmdbId(mediaType, tmdbId, season, episode);
    sendJson(res, 200, {
      apiVersion: "zenix-nakios-source-v1",
      type: "success",
      data: {
        title,
        mediaType,
        year,
        season: mediaType === "tv" ? season : 1,
        episode: mediaType === "tv" ? episode : 1,
        tmdbId,
        count: sources.length,
        sources,
      },
    });
    return true;
  } catch (error) {
    sendJson(res, 502, {
      error: "Nakios source unavailable",
      reason: sanitizeToken(String(error?.message || ""), 120),
    });
    return true;
  }
}

async function handlePidoovSource(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/pidoov-source") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const title = String(requestUrl.searchParams.get("title") || "").trim();
  if (title.length < 2) {
    sendJson(res, 400, { error: "Missing title" });
    return true;
  }
  const type = String(requestUrl.searchParams.get("type") || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const year = toInt(requestUrl.searchParams.get("year"), 0, 0, 2099);
  const season = toInt(requestUrl.searchParams.get("season"), 1, 1, 500);
  const episode = toInt(requestUrl.searchParams.get("episode"), 1, 1, 50000);
  const debugMode = String(requestUrl.searchParams.get("debug") || "").trim() === "1";

  try {
    const sources = await resolvePidoovSourcesByTitle(title, {
      type,
      year,
      season,
      episode,
    });
    const payload = {
      apiVersion: "zenix-pidoov-source-v1",
      type: "success",
      data: {
        title,
        mediaType: type,
        year,
        season: type === "tv" ? season : 1,
        episode: type === "tv" ? episode : 1,
        count: sources.length,
        sources,
      },
    };
    if (debugMode) {
      payload.data.debug = {
        indexSize: Array.isArray(pidoovIndexCache.entries) ? pidoovIndexCache.entries.length : 0,
        indexFull: Boolean(pidoovIndexCache.full),
        indexLoadedAt: Number(pidoovIndexCache.loadedAt || 0),
        staticSize: Array.isArray(loadPidoovStaticEntries()) ? loadPidoovStaticEntries().length : 0,
        lookupCacheSize: pidoovLookupCache.size,
        detailCacheSize: pidoovDetailCache.size,
        inFlight: Boolean(pidoovIndexCache.inFlight),
      };
    }
    sendJson(res, 200, payload);
    return true;
  } catch (error) {
    sendJson(res, 502, {
      error: "Pidoov source unavailable",
      reason: sanitizeToken(String(error?.message || ""), 120),
    });
    return true;
  }
}

async function handleNotariellesSource(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/notarielles-source") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const title = String(requestUrl.searchParams.get("title") || "").trim();
  if (title.length < 2) {
    sendJson(res, 400, { error: "Missing title" });
    return true;
  }
  const season = toInt(requestUrl.searchParams.get("season"), 0, 0, 400);
  const episode = toInt(requestUrl.searchParams.get("episode"), 0, 0, 20000);
  if (season <= 0 || episode <= 0) {
    sendJson(res, 400, { error: "Missing season/episode" });
    return true;
  }
  const debugMode = String(requestUrl.searchParams.get("debug") || "").trim() === "1";

  try {
    const sources = await resolveNotariellesSourcesByEpisode(title, season, episode);
    const payload = {
      apiVersion: "zenix-notarielles-source-v1",
      type: "success",
      data: {
        title,
        season,
        episode,
        count: sources.length,
        sources,
      },
    };
    if (debugMode) {
      payload.data.debug = {
        indexSize: Array.isArray(notariellesIndexCache.entries) ? notariellesIndexCache.entries.length : 0,
        loadedAt: Number(notariellesIndexCache.loadedAt || 0),
        inFlight: Boolean(notariellesIndexCache.inFlight),
        pageCacheSize: notariellesPageCache.size,
        staticSize: Array.isArray(loadNotariellesStaticEntries()) ? loadNotariellesStaticEntries().length : 0,
      };
    }
    sendJson(res, 200, payload);
    return true;
  } catch (error) {
    sendJson(res, 502, {
      error: "Notarielles source unavailable",
      reason: sanitizeToken(String(error?.message || ""), 120),
    });
    return true;
  }
}

async function handleRendezvousSource(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/rendezvous-source") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const title = String(requestUrl.searchParams.get("title") || "").trim();
  if (title.length < 2) {
    sendJson(res, 400, { error: "Missing title" });
    return true;
  }

  const type = String(requestUrl.searchParams.get("type") || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const year = toInt(requestUrl.searchParams.get("year"), 0, 0, 2099);
  const season = toInt(requestUrl.searchParams.get("season"), 1, 1, 500);
  const episode = toInt(requestUrl.searchParams.get("episode"), 1, 1, 50000);
  const debugMode = String(requestUrl.searchParams.get("debug") || "").trim() === "1";

  try {
    const sources = await resolveRendezvousSourcesByTitle(title, {
      type,
      year,
      season,
      episode,
    });
    const payload = {
      apiVersion: "zenix-rendezvous-source-v1",
      type: "success",
      data: {
        title,
        mediaType: type,
        year,
        season: type === "tv" ? season : 1,
        episode: type === "tv" ? episode : 1,
        count: sources.length,
        sources,
      },
    };
    if (debugMode) {
      payload.data.debug = {
        indexSize: Array.isArray(rendezvousIndexCache.entries) ? rendezvousIndexCache.entries.length : 0,
        loadedAt: Number(rendezvousIndexCache.loadedAt || 0),
        inFlight: Boolean(rendezvousIndexCache.inFlight),
        pageCacheSize: rendezvousPageCache.size,
        staticSize: Array.isArray(loadRendezvousStaticEntries()) ? loadRendezvousStaticEntries().length : 0,
      };
    }
    sendJson(res, 200, payload);
    return true;
  } catch (error) {
    sendJson(res, 502, {
      error: "Rendezvous source unavailable",
      reason: sanitizeToken(String(error?.message || ""), 120),
    });
    return true;
  }
}

async function handleZenixOwnedSource(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/zenix-source") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const mediaId = toInt(requestUrl.searchParams.get("mediaId"), 0, 0, 999999999);
  if (mediaId <= 0) {
    sendJson(res, 400, { error: "Missing mediaId" });
    return true;
  }
  const type = String(requestUrl.searchParams.get("type") || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const season = toInt(requestUrl.searchParams.get("season"), 1, 1, 500);
  const episode = toInt(requestUrl.searchParams.get("episode"), 1, 1, 50000);

  const sources = resolveOwnedSources(type, mediaId, season, episode);
  sendJson(res, 200, {
    apiVersion: "zenix-owned-source-v1",
    type: "success",
    data: {
      mediaId,
      mediaType: type,
      season: type === "tv" ? season : 1,
      episode: type === "tv" ? episode : 1,
      count: sources.length,
      sources,
    },
  });
  return true;
}

async function handleApiProxy(req, res, requestUrl) {
  if (!requestUrl.pathname.startsWith("/api/")) {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const upstreamPath = requestUrl.pathname.slice("/api".length) || "/";
  if (!isAllowedProxyPath(upstreamPath)) {
    sendJson(res, 404, { error: "Unknown API route" });
    return true;
  }

  const target = `${REMOTE_API_BASE}${upstreamPath}${requestUrl.search || ""}`;
  const ttl = getProxyTTL(upstreamPath);
  const cacheKey = target;
  const now = Date.now();
  const cached = proxyCache.get(cacheKey);
  const isStreamPath = /^\/stream\//i.test(upstreamPath);
  const clientIp = sanitizeToken(getRemoteAddress(req), 64);
  const upstreamHeaders = {};
  if (FORWARD_CLIENT_IP_TO_UPSTREAM && isStreamPath && isPublicIpAddress(clientIp)) {
    upstreamHeaders["X-Forwarded-For"] = clientIp;
    upstreamHeaders["X-Real-IP"] = clientIp;
    upstreamHeaders["CF-Connecting-IP"] = clientIp;
  }

  if (ttl > 0 && cached && cached.expiresAt > now) {
    res.writeHead(cached.status, {
      "Content-Type": cached.contentType,
      "Cache-Control": "no-cache",
      "X-Zenix-Cache": "HIT",
    });
    res.end(cached.body);
    return true;
  }

  try {
    const upstream = await fetchRemote(target, upstreamHeaders);
    if (ttl > 0 && upstream.status >= 200 && upstream.status < 300) {
      proxyCache.set(cacheKey, {
        status: upstream.status,
        body: upstream.body,
        contentType: upstream.contentType,
        expiresAt: now + ttl,
      });
    }
    res.writeHead(upstream.status, {
      "Content-Type": upstream.contentType,
      "Cache-Control": "no-cache",
      "X-Zenix-Cache": "MISS",
    });
    res.end(upstream.body);
    return true;
  } catch (error) {
    const code = String(error?.name || "").toLowerCase().includes("abort") ? 504 : 502;
    sendJson(res, code, { error: "Upstream request failed" });
    return true;
  }
}

function resolveCacheControl(filePath, ext) {
  const baseName = path.basename(filePath).toLowerCase();
  const noCacheFiles = new Set([
    "index.html",
    "sw.js",
    "manifest.webmanifest",
    "zenix.js",
    "zenix.css",
    "hls.min.js",
  ]);

  if (noCacheFiles.has(baseName) || ext === ".html" || ext === ".webmanifest") {
    return "no-cache";
  }

  return "public, max-age=31536000, immutable";
}

function streamFile(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      send404(res);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const cacheControl = resolveCacheControl(filePath, ext);
    const range = req.headers.range;

    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) {
        res.writeHead(416);
        res.end();
        return;
      }

      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Number(match[2]) : stats.size - 1;
      if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start < 0 ||
        end < start ||
        end >= stats.size
      ) {
        res.writeHead(416);
        res.end();
        return;
      }

      res.writeHead(206, {
        "Content-Type": contentType,
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Cache-Control": cacheControl,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size,
      "Accept-Ranges": "bytes",
      "Cache-Control": cacheControl,
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const requestUrl = new URL(req.url, `http://${host}`);
  if (maybeRedirectToCanonical(req, res, requestUrl)) {
    return;
  }
  let pathname = requestUrl.pathname;

  handleAnalyticsHeartbeat(req, res, requestUrl)
    .then((handledAnalytics) => {
      if (handledAnalytics) {
        return true;
      }
      return handleAnalyticsWebhookStatus(req, res, requestUrl);
    })
    .then((handledWebhookStatus) => {
      if (handledWebhookStatus) {
        return true;
      }
      return handleSuggestionSubmit(req, res, requestUrl);
    })
    .then((handledSuggestions) => {
      if (handledSuggestions) {
        return true;
      }
      return handleCalendarOverview(req, res, requestUrl);
    })
    .then((handledCalendar) => {
      if (handledCalendar) {
        return true;
      }
      return handleCatalogSupplemental(req, res, requestUrl);
    })
    .then((handledSupplementalCatalog) => {
      if (handledSupplementalCatalog) {
        return true;
      }
      return handleHlsProxy(req, res, requestUrl);
    })
    .then((handledHlsProxy) => {
      if (handledHlsProxy) {
        return true;
      }
      return handleAnimeSeasons(req, res, requestUrl);
    })
    .then((handledAnimeSeasons) => {
      if (handledAnimeSeasons) {
        return true;
      }
      return handleAnimeSibnet(req, res, requestUrl);
    })
    .then((handledAnimeSibnet) => {
      if (handledAnimeSibnet) {
        return true;
      }
      return handleNakiosSource(req, res, requestUrl);
    })
    .then((handledNakiosSource) => {
      if (handledNakiosSource) {
        return true;
      }
      return handleZenixOwnedSource(req, res, requestUrl);
    })
    .then((handledOwnedSource) => {
      if (handledOwnedSource) {
        return true;
      }
      return handleApiProxy(req, res, requestUrl);
    })
    .then((handled) => {
      if (handled) {
        return;
      }

      if (pathname === "/") {
        pathname = "/index.html";
      }

      const filePath = safeLocalPath(pathname);
      if (!filePath) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
      }

      fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
          streamFile(req, res, filePath);
          return;
        }

        const hasExtension = path.extname(pathname) !== "";
        const acceptsHtml = (req.headers.accept || "").includes("text/html");
        if (!hasExtension || acceptsHtml) {
          streamFile(req, res, path.join(ROOT, "index.html"));
          return;
        }

        send404(res);
      });
    })
    .catch(() => {
      sendJson(res, 500, { error: "Internal server error" });
    });
});

if (isDiscordWebhookConfigured()) {
  console.log(`[discord] Webhook active (interval ${DISCORD_PUSH_INTERVAL_MS}ms).`);
  loadDiscordStatsState();

  const timer = setInterval(() => {
    pushDiscordStats("interval").catch(() => {
      // best effort only
    });
  }, DISCORD_PUSH_INTERVAL_MS);
  if (typeof timer.unref === "function") {
    timer.unref();
  }

  const startupTimer = setTimeout(() => {
    pushDiscordStats("startup").catch(() => {
      // best effort only
    });
  }, 2000);
  if (typeof startupTimer.unref === "function") {
    startupTimer.unref();
  }
} else {
  console.warn("[discord] Webhook disabled: define DISCORD_WEBHOOK_URL (or DISCORD_WEBHOOK / WEBHOOK_DISCORD_URL).");
}

if (buildSuggestionsRelayUrl()) {
  console.log(`[suggestions] Relay enabled for ${SUGGESTIONS_EMAIL_TO}.`);
} else {
  console.warn("[suggestions] Relay disabled: define SUGGESTIONS_RELAY_BASE and SUGGESTIONS_EMAIL_TO.");
}

server.listen(PORT, () => {
  console.log(`Zenix Stream: http://localhost:${PORT}`);
});
