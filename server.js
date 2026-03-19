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
const REMOTE_API_BASE = "https://api.purstream.cc/api/v1";
const PURSTREAM_API_BASE = "https://api.purstream.cc/api/v1";
const PURSTREAM_WEB_BASE = "https://purstream.cc";
const FASTFLUX_BASE = "https://fastflux.xyz";
const FASTFLUX_API_BASE = `${FASTFLUX_BASE}/api/v1/index.php`;
const FASTFLUX_API_KEY = String(process.env.FASTFLUX_API_KEY || "").trim();
const FASTFLUX_ENABLED = Boolean(FASTFLUX_API_KEY);
const USE_FASTFLUX = FASTFLUX_ENABLED;
const TMDB_API_KEY = String(process.env.TMDB_API_KEY || "").trim();
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const LIVEWATCH_API_URL = "https://v2.livewatch.sbs/?action=api";
const LIVEWATCH_CACHE_MS = Math.max(2 * 60 * 1000, Number(process.env.LIVEWATCH_CACHE_MS || 12 * 60 * 1000));
const IPTV_CHANNELS_URL = "https://iptv-org.github.io/api/channels.json";
const IPTV_STREAMS_URL = "https://iptv-org.github.io/api/streams.json";
const IPTV_FR_M3U_URL = "https://iptv-org.github.io/iptv/countries/fr.m3u";
const IPTV_CACHE_MS = Math.max(5 * 60 * 1000, Number(process.env.IPTV_CACHE_MS || 20 * 60 * 1000));
const NAKIOS_BASE = "https://nakios.site";
const NAKIOS_HOST = "nakios.site";
const NAKIOS_API_BASE = "https://api.nakios.site";
const NAKIOS_API_HOST = "api.nakios.site";
const FILMER2_BASE = "https://filmer2.com";
const FILMER2_HOST = "filmer2.com";
const MOVIX_BASE_URL = String(process.env.MOVIX_BASE_URL || "https://movix.blog")
  .trim()
  .replace(/\/+$/, "");
const MOVIX_API_BASE = String(process.env.MOVIX_API_BASE || "https://api.movix.blog")
  .trim()
  .replace(/\/+$/, "");
const MOVIX_ACCESS_KEY = String(process.env.MOVIX_ACCESS_KEY || "").trim();
const MOVIX_HOSTS = new Set(["movix.blog", "movix.club", "movix.website"]);
const NOCTA_BASE = "https://noctaflix.lol";
const NOCTA_HOST = "noctaflix.lol";
const NOCTA_FORCE_OVERRIDES = new Map([
  ["scream 7", `${NOCTA_BASE}/movie/scream-7`],
  ["scream 7 2026", `${NOCTA_BASE}/movie/scream-7`],
  ["banlieusards 3", `${NOCTA_BASE}/movie/banlieusards-3`],
  ["banlieusards iii", `${NOCTA_BASE}/movie/banlieusards-3`],
]);
const NOCTA_FORCE_TMDB_IDS = new Set([1159559]);
const NOCTA_FORCE_MEDIA_IDS = new Set([1507947720]);
const NOCTA_SCREAM7_DEBUG_URL = "https://cdn.fastflux.xyz/movies/Scream-7-2026.mp4";
const NOCTA_BANLIEUSARDS3_DEBUG_URL = "https://cdn.fastflux.xyz/movies/Banlieusards-3-2026.mp4";
const PURSTREAM_CARS_DEBUG_URL = "https://zebi.xalaflix.design/movie/920/free-ibr0mx/master.m3u8";
const PURSTREAM_CARS_DEBUG_URL_ALT = "https://zebi.xalaflix.design/movie/920/premium-6g65wx/master.m3u8";
const USE_NAKIOS = false;
const USE_FILMER2 = false;
const USE_MOVIX = false;
const USE_NOCTA = false;
const USE_YOUTUBE = false;
const STRICT_NAKIOS_MATCH = true;
const MOVIX_BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DEFAULT_BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const DEFAULT_ACCEPT_LANGUAGE = "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7";
const NAKIOS_CATALOG_PAGES_PER_FEED = Math.max(
  1,
  toInt(process.env.NAKIOS_CATALOG_PAGES_PER_FEED, 3, 1, 12)
);
const FASTFLUX_MOVIES_PAGES_PER_FEED = Math.max(
  1,
  toInt(process.env.FASTFLUX_MOVIES_PAGES_PER_FEED, 4, 1, 60)
);
const FASTFLUX_MOVIES_MAX_PAGES_PER_FEED = Math.max(
  FASTFLUX_MOVIES_PAGES_PER_FEED,
  toInt(process.env.FASTFLUX_MOVIES_MAX_PAGES_PER_FEED, 40, 4, 120)
);
const FASTFLUX_SERIES_PAGES_PER_FEED = Math.max(
  1,
  toInt(process.env.FASTFLUX_SERIES_PAGES_PER_FEED, 4, 1, 12)
);
const FASTFLUX_SERIES_MAX_PAGES_PER_FEED = Math.max(
  FASTFLUX_SERIES_PAGES_PER_FEED,
  toInt(process.env.FASTFLUX_SERIES_MAX_PAGES_PER_FEED, 12, 4, 24)
);
const FASTFLUX_FEED_PAGE_SIZE_ESTIMATE = Math.max(
  10,
  toInt(process.env.FASTFLUX_FEED_PAGE_SIZE_ESTIMATE, 50, 10, 120)
);
const NAKIOS_CATALOG_MAX_PAGES_PER_FEED = Math.max(
  NAKIOS_CATALOG_PAGES_PER_FEED,
  toInt(process.env.NAKIOS_CATALOG_MAX_PAGES_PER_FEED, 12, 3, 30)
);
const NAKIOS_FEED_PAGE_SIZE_ESTIMATE = Math.max(
  10,
  toInt(process.env.NAKIOS_FEED_PAGE_SIZE_ESTIMATE, 20, 10, 50)
);
const NAKIOS_LOOKUP_CACHE_MS = Math.max(
  60 * 1000,
  Number(process.env.NAKIOS_LOOKUP_CACHE_MS || 30 * 60 * 1000)
);
const FASTFLUX_CATALOG_CACHE_MS = Math.max(
  60 * 1000,
  Number(process.env.FASTFLUX_CATALOG_CACHE_MS || 8 * 60 * 1000)
);
const FASTFLUX_SEARCH_CACHE_MS = Math.max(
  30 * 1000,
  Number(process.env.FASTFLUX_SEARCH_CACHE_MS || 6 * 60 * 1000)
);
const PLAYBACK_FAIL_WINDOW_MS = Math.max(
  30 * 1000,
  Number(process.env.PLAYBACK_FAIL_WINDOW_MS || 3 * 60 * 1000)
);
const PLAYBACK_FAIL_THRESHOLD = Math.max(
  1,
  Number(process.env.PLAYBACK_FAIL_THRESHOLD || 3)
);
const PLAYBACK_FAIL_COOLDOWN_MS = Math.max(
  60 * 1000,
  Number(process.env.PLAYBACK_FAIL_COOLDOWN_MS || 3 * 60 * 1000)
);
const FASTFLUX_WARMUP_INTERVAL_MS = Math.max(
  5 * 60 * 1000,
  Number(process.env.FASTFLUX_WARMUP_INTERVAL_MS || 20 * 60 * 1000)
);
const FASTFLUX_HEALTH_INTERVAL_MS = Math.max(
  3 * 60 * 1000,
  Number(process.env.FASTFLUX_HEALTH_INTERVAL_MS || 9 * 60 * 1000)
);
const FASTFLUX_HEALTH_FAIL_THRESHOLD = Math.max(
  1,
  Number(process.env.FASTFLUX_HEALTH_FAIL_THRESHOLD || 2)
);
const FASTFLUX_HEALTH_FAIL_COOLDOWN_MS = Math.max(
  60 * 1000,
  Number(process.env.FASTFLUX_HEALTH_FAIL_COOLDOWN_MS || 4 * 60 * 1000)
);
const TMDB_SEARCH_CACHE_MS = Math.max(60 * 1000, Number(process.env.TMDB_SEARCH_CACHE_MS || 10 * 60 * 1000));
const FASTFLUX_SOURCE_REMOTE_TIMEOUT_MS = Math.max(
  10_000,
  toInt(process.env.FASTFLUX_SOURCE_REMOTE_TIMEOUT_MS, 20_000, 8000, 60_000)
);
const NAKIOS_FETCH_HEADERS = {
  Referer: `${NAKIOS_BASE}/`,
  Origin: NAKIOS_BASE,
  "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
};
const GLOBAL_REPAIR_FORCE_MS = Math.max(2 * 60 * 1000, Number(process.env.GLOBAL_REPAIR_FORCE_MS || 12 * 60 * 1000));
const FILMER2_FETCH_HEADERS = {
  Referer: `${FILMER2_BASE}/`,
  Origin: FILMER2_BASE,
  "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
};
const MOVIX_FETCH_HEADERS = {
  ...(MOVIX_BASE_URL ? { Referer: `${MOVIX_BASE_URL}/`, Origin: MOVIX_BASE_URL } : {}),
  ...(MOVIX_ACCESS_KEY ? { "x-access-key": MOVIX_ACCESS_KEY } : {}),
  "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
};
const FASTFLUX_FETCH_HEADERS = {
  Referer: `${FASTFLUX_BASE}/`,
  Origin: FASTFLUX_BASE,
  "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
};
const NOCTA_FETCH_HEADERS = {
  Referer: `${NOCTA_BASE}/`,
  Origin: NOCTA_BASE,
  "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
};
const NAKIOS_CATALOG_FEEDS = [
  { mediaType: "movie", path: "/api/movies/popular" },
  { mediaType: "movie", path: "/api/movies/trending" },
  { mediaType: "movie", path: "/api/movies/discover" },
  { mediaType: "movie", path: "/api/movies/upcoming" },
  { mediaType: "movie", path: "/api/movies/top-rated" },
  { mediaType: "tv", path: "/api/series/popular" },
  { mediaType: "tv", path: "/api/series/trending" },
  { mediaType: "tv", path: "/api/series/discover" },
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
const FILMER2_CATALOG_CACHE_MS = Math.max(
  5 * 60 * 1000,
  Number(process.env.FILMER2_CATALOG_CACHE_MS || 45 * 60 * 1000)
);
const FILMER2_DETAIL_CACHE_MS = Math.max(
  5 * 60 * 1000,
  Number(process.env.FILMER2_DETAIL_CACHE_MS || 60 * 60 * 1000)
);
const NOCTA_DETAIL_CACHE_MS = Math.max(5 * 60 * 1000, Number(process.env.NOCTA_DETAIL_CACHE_MS || 20 * 60 * 1000));
const NOCTA_EMBED_CACHE_MS = Math.max(60 * 1000, Number(process.env.NOCTA_EMBED_CACHE_MS || 30 * 60 * 1000));
const NOCTA_SOURCE_TIMEOUT_MS = Math.max(8000, Number(process.env.NOCTA_SOURCE_TIMEOUT_MS || 16000));
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
const NAKIOS_SOURCE_REMOTE_TIMEOUT_MS = Math.max(
  PROXY_TIMEOUT_MS,
  toInt(process.env.NAKIOS_SOURCE_REMOTE_TIMEOUT_MS, 22000, 12000, 60000)
);
const CALENDAR_CACHE_MS = 6 * 60 * 1000;
const ANIME_SIBNET_CACHE_MS = 12 * 60 * 1000;
const ANIME_PANEL_RESOLUTION_LIMIT = 6;
const ZENIX_OWNED_SOURCES_CACHE_MS = 5000;
const WEBHOOK_TIMEOUT_MS = 10000;
const DISCORD_WEBHOOK_FALLBACK_B64 =
  "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ3OTI2OTg4ODM3OTA2MDMxNi9ISGRVbTVYZkhpeENPXy0yRUhXYXJ1SjJDcHIweXl1eWdHNkRWLVp4Y0JLQWg4N0RNRzNvNnYzbTQzd29VMmZwenpBUw==";
const DISCORD_STATS_MESSAGE_ID_FALLBACK = "1481081267830395010";
const DISCORD_WEBHOOK_URL = resolveDiscordWebhookUrl();
const DISCORD_WEBHOOK_CANDIDATES = buildDiscordWebhookCandidates(DISCORD_WEBHOOK_URL);
const DISCORD_PUSH_INTERVAL_MS = Math.max(15000, Number(process.env.DISCORD_PUSH_INTERVAL_MS || 30 * 1000));
const DISCORD_CREATE_BACKOFF_MS = Math.max(
  30000,
  Number(process.env.DISCORD_CREATE_BACKOFF_MS || 3 * 60 * 1000)
);
const ZENIX_BRAND_LABEL = "Zenix";
const ZENIX_EXTERNAL_PROVIDER = "zenix";
const GATE_COOKIE_NAME = "zenix_gate";
const GATE_CHALLENGE_TTL_MS = Math.max(15000, Number(process.env.GATE_CHALLENGE_TTL_MS || 90 * 1000));
const GATE_TOKEN_TTL_MS = Math.max(2 * 60 * 1000, Number(process.env.GATE_TOKEN_TTL_MS || 20 * 60 * 1000));
const GATE_CHALLENGE_MAX = Math.max(50, toInt(process.env.GATE_CHALLENGE_MAX, 420, 50, 1200));
const GATE_SECRET =
  String(process.env.ZENIX_GATE_SECRET || "").trim() || crypto.randomBytes(32).toString("hex");
const GATE_ADSCRIPT_PATH = "/_gate/zenix-proof.js";
const GATE_DISABLED = String(process.env.ZENIX_GATE_DISABLE || "").trim() === "1";
const gateChallenges = new Map();
const ADMIN_COOKIE_NAME = "zenix_admin";
const ADMIN_PASSWORD = String(process.env.ZENIX_ADMIN_PASSWORD || "").trim();
const ADMIN_SESSION_SECRET =
  String(process.env.ZENIX_ADMIN_SESSION_SECRET || "").trim() || crypto.randomBytes(32).toString("hex");
const ADMIN_SESSION_TTL_MS = Math.max(
  15 * 60 * 1000,
  Number(process.env.ZENIX_ADMIN_SESSION_TTL_MS || 12 * 60 * 60 * 1000)
);
const DEFAULT_DATA_DIR =
  String(process.env.ZENIX_DATA_DIR || "").trim() ||
  (process.platform === "win32" ? path.join(ROOT, ".data") : "/var/lib/zenix");
const DATA_DIR = path.resolve(DEFAULT_DATA_DIR);
try {
  fs.mkdirSync(DATA_DIR, { recursive: true });
} catch {
  // ignore mkdir failures
}
const FALLBACK_DATA_DIR = path.resolve(path.join(ROOT, ".data"));
try {
  fs.mkdirSync(FALLBACK_DATA_DIR, { recursive: true });
} catch {
  // ignore mkdir failures
}
const ADMIN_DATA_FILE = path.resolve(process.env.ZENIX_ADMIN_DATA_FILE || path.join(DATA_DIR, "admin-data.json"));
const ADMIN_DATA_FILE_FALLBACK = path.resolve(path.join(FALLBACK_DATA_DIR, "admin-data.json"));
const BACKUP_CONFIG_FILE = path.resolve(
  process.env.ZENIX_BACKUP_CONFIG_FILE || path.join(DATA_DIR, "backup-config.json")
);
const BACKUP_CACHE_FILE = path.resolve(
  process.env.ZENIX_BACKUP_CACHE_FILE || path.join(DATA_DIR, "backup-cache.json")
);
const BACKUP_CACHE_FILE_FALLBACK = path.resolve(path.join(FALLBACK_DATA_DIR, "backup-cache.json"));
const BACKUP_CACHE_TTL_MS = Math.max(
  60 * 60 * 1000,
  Number(process.env.ZENIX_BACKUP_CACHE_TTL_MS || 7 * 24 * 60 * 60 * 1000)
);
const BACKUP_CACHE_MAX_ENTRIES = Math.max(
  200,
  toInt(process.env.ZENIX_BACKUP_CACHE_MAX_ENTRIES, 4000, 200, 12000)
);
const BACKUP_CACHE_MAX_SOURCES = Math.max(
  1,
  toInt(process.env.ZENIX_BACKUP_CACHE_MAX_SOURCES, 5, 1, 12)
);
const ADMIN_LOGIN_WINDOW_MS = Math.max(60 * 1000, Number(process.env.ZENIX_ADMIN_LOGIN_WINDOW_MS || 5 * 60 * 1000));
const ADMIN_LOGIN_MAX_ATTEMPTS = Math.max(
  3,
  Number(process.env.ZENIX_ADMIN_LOGIN_MAX_ATTEMPTS || 8)
);
const adminLoginAttempts = new Map();
const adminSessions = new Map();
const adminDataCache = { loadedAt: 0, value: null };
const backupConfigCache = { loadedAt: 0, value: null };
const backupCacheStore = { loadedAt: 0, value: null };
let backupCacheSaveTimer = null;
const livewatchCache = { loadedAt: 0, payload: null, inFlight: null };
const iptvCache = { loadedAt: 0, payload: null, inFlight: null };
let tvChannelsPurged = false;
const HARD_HIDDEN_MEDIA_IDS = new Set([1507947720]);
const NAKIOS_PINNED_TITLES = [
  { title: "Go Karts", mediaType: "movie", year: 2020 },
  { title: "Minions", mediaType: "movie", year: 2015 },
  { title: "Minions: The Rise of Gru", mediaType: "movie", year: 2022 },
  { title: "Despicable Me", mediaType: "movie", year: 2010 },
  { title: "Despicable Me 2", mediaType: "movie", year: 2013 },
  { title: "Despicable Me 3", mediaType: "movie", year: 2017 },
  { title: "Despicable Me 4", mediaType: "movie", year: 2024 },
  { title: "Inception", mediaType: "movie", year: 2010 },
  { title: "Interstellar", mediaType: "movie", year: 2014 },
  { title: "The Dark Knight", mediaType: "movie", year: 2008 },
  { title: "Parasite", mediaType: "movie", year: 2019 },
  { title: "Dune", mediaType: "movie", year: 2021 },
  { title: "Blade Runner 2049", mediaType: "movie", year: 2017 },
  { title: "The Prestige", mediaType: "movie", year: 2006 },
  { title: "Mad Max: Fury Road", mediaType: "movie", year: 2015 },
  { title: "Whiplash", mediaType: "movie", year: 2014 },
  { title: "Joker", mediaType: "movie", year: 2019 },
];
const NAKIOS_PINNED_CACHE_MS = Math.max(
  15 * 60 * 1000,
  Number(process.env.NAKIOS_PINNED_CACHE_MS || 45 * 60 * 1000)
);
const nakiosPinnedCache = { entries: [], loadedAt: 0, inFlight: null };
const FORWARD_CLIENT_IP_TO_UPSTREAM =
  String(process.env.FORWARD_CLIENT_IP_TO_UPSTREAM || "").trim() === "1";
const ANALYTICS_RETENTION_MS = 48 * 60 * 60 * 1000;
const ANALYTICS_WINDOW_24H_MS = 24 * 60 * 60 * 1000;
const ANALYTICS_WINDOW_48H_MS = 48 * 60 * 60 * 1000;
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
const NAKIOS_SEASONS_CACHE_MS = Math.max(
  5 * 60 * 1000,
  Number(process.env.NAKIOS_SEASONS_CACHE_MS || 6 * 60 * 60 * 1000)
);
const REPAIR_STORE_TTL_MS = Math.max(
  15 * 60 * 1000,
  Number(process.env.REPAIR_STORE_TTL_MS || 6 * 60 * 60 * 1000)
);
const REPAIR_STORE_MAX_ENTRIES = Math.max(50, toInt(process.env.REPAIR_STORE_MAX_ENTRIES, 400, 50, 4000));
const REPAIR_STORE_MAX_SOURCES = Math.max(6, toInt(process.env.REPAIR_STORE_MAX_SOURCES, 40, 6, 120));
const REPAIR_RATE_LIMIT_MS = Math.max(10 * 1000, Number(process.env.REPAIR_RATE_LIMIT_MS || 10 * 1000));
const SUGGESTION_SKIP_TTL_MS = Math.max(
  6 * 60 * 60 * 1000,
  Number(process.env.SUGGESTION_SKIP_TTL_MS || 5 * 24 * 60 * 60 * 1000)
);
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
const REQUEST_RATE_LIMIT_MS = Math.max(5000, Number(process.env.REQUEST_RATE_LIMIT_MS || 25 * 1000));
const REQUEST_DUPLICATE_TTL_MS = Math.max(
  60 * 1000,
  Number(process.env.REQUEST_DUPLICATE_TTL_MS || 6 * 60 * 60 * 1000)
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
const YOUTUBE_PLAYLIST_CACHE_MS = Math.max(
  10 * 60 * 1000,
  Number(process.env.YOUTUBE_PLAYLIST_CACHE_MS || 20 * 60 * 1000)
);
const YOUTUBE_FETCH_HEADERS = {
  Referer: "https://www.youtube.com/",
  "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
  Cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+410",
};
const PURSTREAM_SEARCH_CACHE_MS = Math.max(
  60 * 1000,
  Number(process.env.PURSTREAM_SEARCH_CACHE_MS || 10 * 60 * 1000)
);
const proxyCache = new Map();
const calendarCache = new Map();
const ANIME_SEASONS_CACHE_MS = 1000 * 60 * 20;
const animeSibnetCache = new Map();
const animeSeasonsCache = new Map();
const nakiosSeasonsCache = new Map();
const nakiosSeasonsInFlight = new Map();
const nakiosDetailCache = new Map();
const repairRateLimit = new Map();
const purstreamSearchCache = new Map();
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
const fastfluxMovieCache = {
  loadedAt: 0,
  entries: [],
  inFlight: null,
  pagesLoaded: 0,
  totalPages: 0,
  map: new Map(),
};
const fastfluxSeriesCache = {
  loadedAt: 0,
  entries: [],
  inFlight: null,
  pagesLoaded: 0,
  totalPages: 0,
  map: new Map(),
};
const fastfluxSearchCache = new Map();
const tmdbSearchCache = new Map();
const filmer2CatalogCache = {
  loadedAt: 0,
  entries: [],
  inFlight: null,
};
const filmer2DetailCache = new Map();
const noctaDetailCache = new Map();
const noctaEmbedCache = new Map();
const nakiosCatalogCache = {
  loadedAt: 0,
  entries: [],
  inFlight: null,
  pagesPerFeed: 0,
};
const nakiosAvailabilityCache = new Map();
const nakiosAvailabilityInFlight = new Map();
const supplementalCoverCache = new Map();
const supplementalCoverInFlight = new Map();
const youtubePlaylistCache = new Map();
const analyticsClients = new Map();
const analyticsEvents = [];
const analyticsGeoCache = new Map();
const analyticsGeoInFlight = new Map();
const suggestionRateLimitMap = new Map();
const suggestionFingerprintMap = new Map();
const requestRateLimitMap = new Map();
const requestFingerprintMap = new Map();
const playbackFailureByIp = new Map();
let playbackFailureLastGlobalAt = 0;
let fastfluxWarmupInFlight = false;
let fastfluxWarmupTimer = null;
let fastfluxWarmupLastAt = 0;
let fastfluxWarmupLastOkAt = 0;
let fastfluxHealthInFlight = false;
let fastfluxHealthTimer = null;
let fastfluxHealthFailStreak = 0;
let fastfluxHealthLastOkAt = 0;
let fastfluxHealthLastRepairAt = 0;
let fastfluxHealthLastRunAt = 0;
let globalRepairEpoch = 0;
let analyticsTotalSeen = 0;
let analyticsTotalsHydrated = false;
let analyticsPersistTimer = null;
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

function sanitizeHttpUrl(value, maxLength = 420) {
  const raw = String(value || "").trim().slice(0, maxLength);
  if (!raw) {
    return "";
  }
  const cleaned = raw.replace(/[\u0000-\u001F\u007F"'<>]+/g, "");
  if (!cleaned) {
    return "";
  }
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

function normalizeRequestType(value) {
  return String(value || "").toLowerCase() === "tv" ? "tv" : "movie";
}

function normalizeRequestStatus(value) {
  const raw = String(value || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, " ")
    .trim();
  if (!raw) return "pending";
  if (["en attente", "attente", "pending"].includes(raw)) return "pending";
  if (["en cours", "in progress", "processing", "progress"].includes(raw)) return "in_progress";
  if (["refuse", "refused", "rejete"].includes(raw)) return "refused";
  if (["catalogue", "en catalogue", "in catalog", "in_catalog"].includes(raw)) return "in_catalog";
  return "pending";
}

function buildRequestKey(entry) {
  if (!entry) {
    return "";
  }
  const type = normalizeRequestType(entry.type);
  const tmdbId = toInt(entry.tmdbId || entry.tmdb_id || entry.external_tmdb_id, 0, 0, 999999999);
  if (tmdbId > 0) {
    return `tmdb:${tmdbId}:${type}`;
  }
  const titleKey = normalizeTitleKey(entry.title || "");
  if (!titleKey) {
    return "";
  }
  const year = toInt(entry.year, 0, 0, 2099);
  return `${titleKey}:${type}:${year}`;
}

function checkRequestRateLimit(ip, now = Date.now()) {
  const key = sanitizeToken(ip, 80) || "unknown";
  const last = Number(requestRateLimitMap.get(key) || 0);
  if (now - last < REQUEST_RATE_LIMIT_MS) {
    return {
      limited: true,
      retryAfterMs: Math.max(0, REQUEST_RATE_LIMIT_MS - (now - last)),
    };
  }
  requestRateLimitMap.set(key, now);
  const staleBefore = now - REQUEST_RATE_LIMIT_MS * 12;
  for (const [entryKey, entryValue] of requestRateLimitMap.entries()) {
    if (Number(entryValue || 0) < staleBefore) {
      requestRateLimitMap.delete(entryKey);
    }
  }
  return { limited: false, retryAfterMs: 0 };
}

function buildRequestFingerprint(payload) {
  const raw = JSON.stringify(payload || {});
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function checkRequestDuplicate(fingerprint, now = Date.now()) {
  const key = String(fingerprint || "").trim();
  if (!key) {
    return { duplicate: false, retryAfterMs: 0 };
  }
  const staleBefore = now - REQUEST_DUPLICATE_TTL_MS * 2;
  for (const [entryKey, entryValue] of requestFingerprintMap.entries()) {
    if (Number(entryValue || 0) < staleBefore) {
      requestFingerprintMap.delete(entryKey);
    }
  }
  const last = Number(requestFingerprintMap.get(key) || 0);
  if (last > 0 && now - last < REQUEST_DUPLICATE_TTL_MS) {
    return {
      duplicate: true,
      retryAfterMs: Math.max(0, REQUEST_DUPLICATE_TTL_MS - (now - last)),
    };
  }
  return { duplicate: false, retryAfterMs: 0 };
}

function rememberRequestFingerprint(fingerprint, now = Date.now()) {
  const key = String(fingerprint || "").trim();
  if (!key) {
    return;
  }
  requestFingerprintMap.set(key, now);
}

function normalizeRequestEntry(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const title = sanitizeSuggestionText(raw.title, 140);
  if (!title) {
    return null;
  }
  const type = normalizeRequestType(raw.type);
  const tmdbId = toInt(raw.tmdbId || raw.tmdb_id || raw.external_tmdb_id, 0, 0, 999999999);
  const year = toInt(raw.year, 0, 0, 2099);
  const poster = sanitizeHttpUrl(raw.poster, 420);
  const backdrop = sanitizeHttpUrl(raw.backdrop, 420);
  const overview = sanitizeSuggestionText(raw.overview, 600);
  const url = sanitizeHttpUrl(raw.url || raw.stream_url || raw.streamUrl, 900);
  const status = normalizeRequestStatus(raw.status || "pending");
  const id = sanitizeToken(raw.id, 80) || `req_${crypto.randomBytes(6).toString("hex")}`;
  const createdAt = raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString();
  const updatedAt = raw.updatedAt ? new Date(raw.updatedAt).toISOString() : createdAt;
  return {
    id,
    tmdbId,
    type,
    title,
    year,
    poster,
    backdrop,
    overview,
    url,
    status,
    createdAt,
    updatedAt,
  };
}

function normalizeTvChannelEntry(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const name = sanitizeSuggestionText(raw.name, 80);
  const url = sanitizeHttpUrl(raw.url || raw.stream_url, 520);
  if (!name || !url) {
    return null;
  }
  const type = sanitizeToken(raw.type, 24).toLowerCase();
  const logo = sanitizeHttpUrl(raw.logo, 420);
  const group = sanitizeSuggestionText(raw.group, 60);
  const country = sanitizeSuggestionText(raw.country, 60);
  const id = sanitizeToken(raw.id, 80) || `tv_${crypto.randomBytes(5).toString("hex")}`;
  const order = toInt(raw.order, 0, 0, 9999);
  return {
    id,
    name,
    url,
    type,
    logo,
    group,
    country,
    order,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeLivewatchQuery(value) {
  const cleaned = sanitizeSuggestionText(value, 120);
  return cleaned ? normalizeTitleKey(cleaned) : "";
}

function normalizeLivewatchCountry(value) {
  const cleaned = sanitizeSuggestionText(value, 80);
  if (!cleaned) {
    return "";
  }
  const lower = cleaned.toLowerCase();
  if (lower === "all" || lower === "tous" || lower === "tous les pays") {
    return "all";
  }
  return cleaned;
}

function getTntChannelOrder(name) {
  const key = normalizeTitleKey(String(name || ""));
  if (!key) {
    return 0;
  }
  if (key.includes("tf1seriesfilms") || key.includes("tf1seriesfilm") || key.includes("tf1sf")) {
    return 19;
  }
  if (key.includes("franceinfo") || key.includes("franceinfotv")) {
    return 26;
  }
  if (key.includes("cherie25") || key.includes("cherie")) {
    return 24;
  }
  if (key.includes("rmcdecouverte") || key.includes("rmcdecouverte")) {
    return 23;
  }
  if (key.includes("rmcstory") || key.includes("rmcstory")) {
    return 22;
  }
  if (key.includes("6ter") || key.includes("sixter")) {
    return 21;
  }
  if (key.includes("lequipe") || key.includes("equipe21")) {
    return 20;
  }
  if (key.includes("gulli")) {
    return 18;
  }
  if (key.includes("cstar") || key.includes("d17")) {
    return 17;
  }
  if (key.includes("cnews") || key.includes("itele")) {
    return 16;
  }
  if (key.includes("bfm")) {
    return 15;
  }
  if (key.includes("france4")) {
    return 14;
  }
  if (key.includes("lcp") || key.includes("publicsenat") || key.includes("publicsenat")) {
    return 13;
  }
  if (key.includes("nrj12") || key === "nrj12") {
    return 12;
  }
  if (key.includes("tfx")) {
    return 11;
  }
  if (key.includes("tmc")) {
    return 10;
  }
  if (key.includes("w9")) {
    return 9;
  }
  if (key.includes("c8")) {
    return 8;
  }
  if (key.includes("arte")) {
    return 7;
  }
  if (key.includes("m6")) {
    return 6;
  }
  if (key.includes("france5")) {
    return 5;
  }
  if (key.includes("canalplus") || (key.includes("canal") && key.includes("plus"))) {
    return 4;
  }
  if (key.includes("france3")) {
    return 3;
  }
  if (key.includes("france2")) {
    return 2;
  }
  if (key.includes("tf1")) {
    return 1;
  }
  return 0;
}

function normalizeLivewatchChannel(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const name = sanitizeSuggestionText(
    entry.cleanName ||
      entry.clean_name ||
      entry.name ||
      entry.title ||
      entry.tvg_name ||
      entry.stream_name ||
      entry.channel,
    120
  );
  const url = sanitizeHttpUrl(entry.embed_url || entry.url || entry.stream_url, 520);
  if (!name || !url) {
    return null;
  }
  const id = sanitizeToken(entry.id, 80) || `lw_${crypto.randomBytes(5).toString("hex")}`;
  const logo = sanitizeHttpUrl(entry.logo || entry.tvg_logo, 420);
  const group = sanitizeSuggestionText(entry.group || entry.genre || entry.category, 60);
  const country = sanitizeSuggestionText(entry.country, 60);
  const order = toInt(entry.order, 0, 0, 9999);
  return {
    id: `lw_${id}`,
    name,
    url,
    type: "embed",
    logo,
    group,
    country,
    order,
    updatedAt: new Date().toISOString(),
  };
}

async function fetchLivewatchPayload() {
  const now = Date.now();
  if (livewatchCache.payload && now - livewatchCache.loadedAt < LIVEWATCH_CACHE_MS) {
    return livewatchCache.payload;
  }
  if (livewatchCache.inFlight) {
    return livewatchCache.inFlight;
  }
  const task = (async () => {
    const response = await fetchRemote(LIVEWATCH_API_URL, {
      "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
      Accept: "application/json",
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Livewatch HTTP ${response.status}`);
    }
    const payload = parseJsonSafe(response.body) || {};
    livewatchCache.payload = payload;
    livewatchCache.loadedAt = Date.now();
    return payload;
  })();
  livewatchCache.inFlight = task;
  try {
    return await task;
  } catch (error) {
    if (livewatchCache.payload) {
      return livewatchCache.payload;
    }
    throw error;
  } finally {
    livewatchCache.inFlight = null;
  }
}

async function getLivewatchChannels(options = {}) {
  const payload = await fetchLivewatchPayload();
  const rows = Array.isArray(payload?.channels) ? payload.channels : [];
  const countries = new Set();
  rows.forEach((entry) => {
    const country = String(entry?.country || "").trim();
    if (country) {
      countries.add(country);
    }
  });

  let list = rows.slice();
  const targetCountry = normalizeLivewatchCountry(options.country) || "France";
  if (targetCountry && targetCountry !== "all") {
    const key = normalizeTitleKey(targetCountry);
    list = list.filter((entry) => normalizeTitleKey(entry?.country || "") === key);
  }

  const queryKey = normalizeLivewatchQuery(options.query);
  if (queryKey && queryKey.length > 1) {
    list = list.filter((entry) => {
      const haystack = [
        entry?.cleanName,
        entry?.name,
        entry?.group,
        entry?.genre,
        entry?.country,
      ]
        .map((val) => normalizeTitleKey(val || ""))
        .filter(Boolean)
        .join(" ");
      return haystack.includes(queryKey);
    });
  }

  const countryKey = normalizeTitleKey(targetCountry || "");
  const tntOnly = countryKey === "france" || countryKey === "fr";
  if (tntOnly) {
    const seen = new Set();
    list = list
      .map((entry) => {
        const name =
          entry?.cleanName ||
          entry?.clean_name ||
          entry?.name ||
          entry?.title ||
          entry?.tvg_name ||
          entry?.stream_name ||
          entry?.channel ||
          "";
        const order = getTntChannelOrder(name);
        if (!order || seen.has(order)) {
          return null;
        }
        seen.add(order);
        return { ...entry, order };
      })
      .filter(Boolean);
  }

  const limit = toInt(options.limit, 0, 0, 2000);
  if (limit > 0 && list.length > limit) {
    list = list.slice(0, limit);
  }

  const normalized = list.map(normalizeLivewatchChannel).filter(Boolean);
  const sortedCountries = Array.from(countries).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
  return {
    list: normalized,
    countries: sortedCountries,
    total: rows.length,
  };
}

function normalizeIptvChannelName(value) {
  const key = normalizeTitleKey(value || "");
  return key.replace(/[^a-z0-9]/g, "");
}

const IPTV_TNT_CHANNELS = [
  { order: 1, names: ["tf1"] },
  { order: 2, names: ["france2", "france 2"] },
  { order: 3, names: ["france3", "france 3"] },
  { order: 4, names: ["canal+", "canalplus"] },
  { order: 5, names: ["france5", "france 5"] },
  { order: 6, names: ["m6"] },
  { order: 7, names: ["arte"] },
  { order: 8, names: ["c8"] },
  { order: 9, names: ["w9"] },
  { order: 10, names: ["tmc"] },
  { order: 11, names: ["tfx"] },
  { order: 12, names: ["nrj12", "nrj 12"] },
  { order: 13, names: ["lcp", "publicsenat", "public senate", "public senat"] },
  { order: 14, names: ["france4", "france 4"] },
  { order: 15, names: ["bfmtv", "bfm tv"] },
  { order: 16, names: ["cnews", "c news"] },
  { order: 17, names: ["cstar", "c star"] },
  { order: 18, names: ["gulli"] },
  { order: 19, names: ["franceo", "france o", "franceô"] },
  { order: 20, names: ["tf1seriesfilms", "tf1 series films", "tf1 series"] },
  { order: 21, names: ["lequipe", "l'equipe", "equipe21", "equipe 21"] },
  { order: 22, names: ["6ter"] },
  { order: 23, names: ["rmcstory", "rmc story", "numero23", "numero 23"] },
  { order: 24, names: ["rmcdecouverte", "rmc decouverte"] },
  { order: 25, names: ["cherie25", "cherie 25", "chérie25", "chérie 25"] },
  { order: 26, names: ["lci"] },
];

async function fetchIptvPayload() {
  const now = Date.now();
  if (iptvCache.payload && now - iptvCache.loadedAt < IPTV_CACHE_MS) {
    return iptvCache.payload;
  }
  if (iptvCache.inFlight) {
    return iptvCache.inFlight;
  }
  const task = (async () => {
    const [channelsResponse, streamsResponse] = await Promise.all([
      fetchRemote(IPTV_CHANNELS_URL, { Accept: "application/json" }),
      fetchRemote(IPTV_STREAMS_URL, { Accept: "application/json" }),
    ]);
    if (channelsResponse.status < 200 || channelsResponse.status >= 300) {
      throw new Error(`IPTV channels HTTP ${channelsResponse.status}`);
    }
    if (streamsResponse.status < 200 || streamsResponse.status >= 300) {
      throw new Error(`IPTV streams HTTP ${streamsResponse.status}`);
    }
    const channels = parseJsonSafe(channelsResponse.body) || [];
    const streams = parseJsonSafe(streamsResponse.body) || [];
    iptvCache.payload = {
      channels: Array.isArray(channels) ? channels : [],
      streams: Array.isArray(streams) ? streams : [],
    };
    iptvCache.loadedAt = Date.now();
    return iptvCache.payload;
  })();
  iptvCache.inFlight = task;
  try {
    return await task;
  } catch (error) {
    if (iptvCache.payload) {
      return iptvCache.payload;
    }
    throw error;
  } finally {
    iptvCache.inFlight = null;
  }
}

function getIptvChannelNameKeys(channel) {
  const names = [];
  if (channel?.name) {
    names.push(channel.name);
  }
  if (Array.isArray(channel?.alt_names)) {
    names.push(...channel.alt_names);
  }
  return Array.from(
    new Set(
      names
        .map((entry) => normalizeIptvChannelName(entry))
        .filter(Boolean)
    )
  );
}

function matchesChannelNames(channel, targets) {
  const keys = getIptvChannelNameKeys(channel);
  if (keys.length === 0) {
    return false;
  }
  const normalizedTargets = targets.map((entry) => normalizeIptvChannelName(entry)).filter(Boolean);
  return normalizedTargets.some((target) =>
    keys.some((key) => key === target || key.includes(target) || target.includes(key))
  );
}

function pickBestStream(streams) {
  const list = Array.isArray(streams) ? streams.slice() : [];
  if (list.length === 0) {
    return null;
  }
  list.sort((left, right) => {
    const leftUrl = String(left?.url || "");
    const rightUrl = String(right?.url || "");
    const leftHttps = leftUrl.startsWith("https");
    const rightHttps = rightUrl.startsWith("https");
    if (leftHttps !== rightHttps) {
      return leftHttps ? -1 : 1;
    }
    const leftHls = /\.m3u8($|[?#])/i.test(leftUrl);
    const rightHls = /\.m3u8($|[?#])/i.test(rightUrl);
    if (leftHls !== rightHls) {
      return leftHls ? -1 : 1;
    }
    return 0;
  });
  return list[0] || null;
}

async function getIptvOrgFrChannels(options = {}) {
  const queryKey = normalizeTitleKey(options.query || "");
  try {
    const m3u = await fetchIptvFrM3u();
    const parsed = parseIptvFrM3u(m3u);
    const ordered = parsed
      .map((entry, index) => {
        const tntMatch = IPTV_TNT_CHANNELS.find((slot) =>
          matchesChannelNames({ name: entry.name || "" }, slot.names)
        );
        return {
          ...entry,
          order: tntMatch ? tntMatch.order : 1000 + index,
        };
      })
      .filter((entry) => {
        if (!queryKey) {
          return true;
        }
        return normalizeTitleKey(entry.name || "").includes(queryKey);
      });
    return ordered;
  } catch {
    // Fallback to JSON API if M3U fails
  }

  const payload = await fetchIptvPayload();
  const channels = Array.isArray(payload?.channels) ? payload.channels : [];
  const streams = Array.isArray(payload?.streams) ? payload.streams : [];

  const frChannels = channels.filter(
    (entry) => String(entry?.country || "").trim().toUpperCase() === "FR"
  );
  const channelById = new Map(
    frChannels
      .map((entry) => [String(entry?.id || "").trim(), entry])
      .filter(([key]) => Boolean(key))
  );
  const streamsByChannel = new Map();
  streams.forEach((entry) => {
    const channelId = String(entry?.channel || "").trim();
    const url = String(entry?.url || "").trim();
    if (!channelId || !url || !/^https?:\/\//i.test(url)) {
      return;
    }
    if (!channelById.has(channelId)) {
      return;
    }
    const rows = streamsByChannel.get(channelId) || [];
    rows.push(entry);
    streamsByChannel.set(channelId, rows);
  });

  const results = [];
  frChannels.forEach((channel, index) => {
    const channelId = String(channel?.id || "").trim();
    if (!channelId) {
      return;
    }
    const stream = pickBestStream(streamsByChannel.get(channelId) || []);
    if (!stream || !stream.url) {
      return;
    }
    const url = String(stream.url || "").trim();
    const metaName = String(channel.name || "").trim();
    if (queryKey) {
      const haystack = `${metaName} ${channel.alt_names ? channel.alt_names.join(" ") : ""}`;
      if (!normalizeTitleKey(haystack).includes(queryKey)) {
        return;
      }
    }
    const tntMatch = IPTV_TNT_CHANNELS.find((slot) => matchesChannelNames(channel, slot.names));
    const entry = normalizeTvChannelEntry({
      id: `iptv_${channelId}`,
      name: metaName || channelId,
      url,
      type: /\.m3u8($|[?#])/i.test(url) ? "hls" : /youtube|embed|player/i.test(url) ? "embed" : "mp4",
      logo: String(channel.logo || "").trim(),
      group: tntMatch ? "TNT" : String(channel.categories?.[0] || "France").trim(),
      country: "France",
      order: tntMatch ? tntMatch.order : 1000 + index,
    });
    if (entry) {
      results.push(entry);
    }
  });

  return results;
}

function purgeAdminTvChannelsOnce() {
  if (tvChannelsPurged) {
    return;
  }
  tvChannelsPurged = true;
  const data = loadAdminData(true);
  if (Array.isArray(data.tvChannels) && data.tvChannels.length > 0) {
    data.tvChannels = [];
    saveAdminData(data);
  }
}

function mergeTvChannelLists(primary, secondary) {
  const out = [];
  const seen = new Set();
  const add = (entry) => {
    if (!entry) {
      return;
    }
    const key = `${normalizeTitleKey(entry.name || "")}|${normalizeTitleKey(entry.country || "")}|${normalizeTitleKey(
      entry.url || ""
    )}`;
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    out.push(entry);
  };
  (Array.isArray(primary) ? primary : []).forEach(add);
  (Array.isArray(secondary) ? secondary : []).forEach(add);
  return out;
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

function buildRepairKey(mediaId, mediaType, season, episode) {
  const id = toInt(mediaId, 0, 0, 999999999);
  if (!id) {
    return "";
  }
  const type = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const safeSeason = toInt(season, 1, 1, 500);
  const safeEpisode = toInt(episode, 1, 1, 50000);
  return `${id}:${type}:${safeSeason}:${safeEpisode}`;
}
function parseRepairKey(input) {
  const raw = String(input || "").trim();
  if (!raw) {
    return null;
  }
  const legacyMatch = raw.match(/^(movie|tv):(\d+)(?::s(\d+)e(\d+))?$/i);
  if (legacyMatch) {
    const type = String(legacyMatch[1] || "").toLowerCase();
    const id = toInt(legacyMatch[2], 0, 0, 999999999);
    if (!id) {
      return null;
    }
    const season = toInt(legacyMatch[3], 1, 1, 500);
    const episode = toInt(legacyMatch[4], 1, 1, 50000);
    return {
      id,
      type,
      season,
      episode,
      key: buildRepairKey(id, type, season, episode),
    };
  }
  const parts = raw.split(":");
  if (parts.length < 4) {
    return null;
  }
  const [idPart, typePart, seasonPart, episodePart] = parts;
  const id = toInt(idPart, 0, 0, 999999999);
  if (!id) {
    return null;
  }
  const type = String(typePart || "").toLowerCase();
  if (type !== "tv" && type !== "movie") {
    return null;
  }
  const safeSeason = toInt(seasonPart, 1, 1, 500);
  const safeEpisode = toInt(episodePart, 1, 1, 50000);
  return {
    id,
    type,
    season: safeSeason,
    episode: safeEpisode,
    key: buildRepairKey(id, type, safeSeason, safeEpisode),
  };
}


function normalizeRepairSource(row) {
  const rawUrl = String(row?.stream_url || row?.url || "").trim();
  if (!rawUrl) {
    return null;
  }
  const parsed = parseSafeRemoteUrl(rawUrl);
  if (!parsed) {
    return null;
  }
  const streamUrl = parsed.href;
  const language = normalizePidoovLanguage(row?.language || row?.lang || row?.name || "") || "VF";
  const quality = sanitizeToken(String(row?.quality || "HD"), 16) || "HD";
  const rawFormat = sanitizeToken(String(row?.format || "").toLowerCase(), 10);
  const format =
    rawFormat === "hls" || rawFormat === "mp4" || rawFormat === "dash" || rawFormat === "webm" || rawFormat === "embed"
      ? rawFormat
      : /\.m3u8(?:$|\?)/i.test(streamUrl)
        ? "hls"
        : /\.mp4(?:$|\?)/i.test(streamUrl)
          ? "mp4"
          : "embed";
  const sourceName =
    sanitizeToken(String(row?.source_name || row?.name || ZENIX_BRAND_LABEL), 46) || ZENIX_BRAND_LABEL;
  const priority = toInt(row?.priority, 0, 0, 1000);
  return {
    stream_url: streamUrl,
    source_name: sourceName,
    quality,
    language,
    format,
    priority,
  };
}

function normalizeRepairSources(list) {
  const rows = Array.isArray(list) ? list : [];
  const dedupe = new Set();
  const out = [];
  rows.forEach((row) => {
    const normalized = normalizeRepairSource(row);
    if (!normalized) {
      return;
    }
    const key = normalized.stream_url;
    if (!key || dedupe.has(key)) {
      return;
    }
    dedupe.add(key);
    out.push(normalized);
  });
  return out.slice(0, REPAIR_STORE_MAX_SOURCES);
}

function normalizeBackupSource(row) {
  const rawUrl = String(row?.stream_url || row?.url || "").trim();
  if (!rawUrl) {
    return null;
  }
  const parsed = parseSafeRemoteUrl(rawUrl);
  if (!parsed) {
    return null;
  }
  const streamUrl = parsed.href;
  const language = normalizePidoovLanguage(row?.language || row?.lang || row?.name || "") || "VF";
  const quality = sanitizeToken(String(row?.quality || "HD"), 16) || "HD";
  const rawFormat = sanitizeToken(String(row?.format || "").toLowerCase(), 10);
  const format =
    rawFormat === "hls" || rawFormat === "mp4" || rawFormat === "dash" || rawFormat === "webm" || rawFormat === "embed"
      ? rawFormat
      : /\.m3u8(?:$|\?)/i.test(streamUrl)
        ? "hls"
        : /\.mp4(?:$|\?)/i.test(streamUrl)
          ? "mp4"
          : "embed";
  const sourceName =
    sanitizeToken(String(row?.source_name || row?.name || ZENIX_BRAND_LABEL), 46) || ZENIX_BRAND_LABEL;
  const priority = toInt(row?.priority, 0, 0, 1000);
  return {
    stream_url: streamUrl,
    source_name: sourceName,
    quality,
    language,
    format,
    priority,
    origin: String(row?.origin || row?.provider || row?.source || "").trim(),
  };
}

function normalizeBackupSources(list) {
  const rows = Array.isArray(list) ? list : [];
  const dedupe = new Set();
  const out = [];
  rows.forEach((row) => {
    const normalized = normalizeBackupSource(row);
    if (!normalized) {
      return;
    }
    const key = normalized.stream_url;
    if (!key || dedupe.has(key)) {
      return;
    }
    dedupe.add(key);
    out.push(normalized);
  });
  return out.slice(0, BACKUP_CACHE_MAX_SOURCES);
}

function buildBackupCacheKey(mediaType, mediaId, season = 1, episode = 1) {
  const safeId = toInt(mediaId, 0, 0, 999999999);
  if (!safeId) {
    return "";
  }
  const type = mediaType === "tv" ? "tv" : "movie";
  if (type === "tv") {
    const safeSeason = toInt(season, 1, 1, 500);
    const safeEpisode = toInt(episode, 1, 1, 50000);
    return `${type}:${safeId}:s${safeSeason}e${safeEpisode}`;
  }
  return `${type}:${safeId}`;
}

function loadBackupCacheStore(force = false) {
  const now = Date.now();
  if (!force && backupCacheStore.value && now - backupCacheStore.loadedAt < 2000) {
    return backupCacheStore.value;
  }
  let data = null;
  try {
    if (fs.existsSync(BACKUP_CACHE_FILE)) {
      const raw = fs.readFileSync(BACKUP_CACHE_FILE, "utf-8");
      data = parseJsonSafe(raw);
    }
  } catch {
    data = null;
  }
  if (!data) {
    try {
      if (fs.existsSync(BACKUP_CACHE_FILE_FALLBACK)) {
        const raw = fs.readFileSync(BACKUP_CACHE_FILE_FALLBACK, "utf-8");
        data = parseJsonSafe(raw);
      }
    } catch {
      data = null;
    }
  }
  if (!data || typeof data !== "object") {
    data = { items: {} };
  }
  if (!data.items || typeof data.items !== "object") {
    data.items = {};
  }
  backupCacheStore.value = data;
  backupCacheStore.loadedAt = now;
  return data;
}

function saveBackupCacheStore(data) {
  const payload = data && typeof data === "object" ? data : { items: {} };
  if (!payload.items || typeof payload.items !== "object") {
    payload.items = {};
  }
  let saved = false;
  try {
    const tmp = `${BACKUP_CACHE_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), "utf-8");
    fs.renameSync(tmp, BACKUP_CACHE_FILE);
    saved = true;
  } catch {
    saved = false;
  }
  if (!saved) {
    try {
      const tmp = `${BACKUP_CACHE_FILE_FALLBACK}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), "utf-8");
      fs.renameSync(tmp, BACKUP_CACHE_FILE_FALLBACK);
    } catch {
      // best effort
    }
  }
  backupCacheStore.value = payload;
  backupCacheStore.loadedAt = Date.now();
  return payload;
}

function scheduleBackupCacheSave(data) {
  if (backupCacheSaveTimer) {
    return;
  }
  backupCacheSaveTimer = setTimeout(() => {
    backupCacheSaveTimer = null;
    saveBackupCacheStore(data);
  }, 1200);
}

function pruneBackupCache(data) {
  if (!data || typeof data !== "object" || !data.items || typeof data.items !== "object") {
    return;
  }
  const now = Date.now();
  Object.entries(data.items).forEach(([key, entry]) => {
    const updatedAt = Number(entry?.updatedAt || 0);
    if (!updatedAt || now - updatedAt > BACKUP_CACHE_TTL_MS) {
      delete data.items[key];
    }
  });
  const keys = Object.keys(data.items);
  if (keys.length <= BACKUP_CACHE_MAX_ENTRIES) {
    return;
  }
  keys
    .sort((a, b) => Number(data.items[b]?.updatedAt || 0) - Number(data.items[a]?.updatedAt || 0))
    .slice(BACKUP_CACHE_MAX_ENTRIES)
    .forEach((key) => {
      delete data.items[key];
    });
}

function updateBackupCacheEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return;
  }
  const key = buildBackupCacheKey(entry.mediaType, entry.mediaId, entry.season, entry.episode);
  if (!key) {
    return;
  }
  const sources = normalizeBackupSources(entry.sources || []);
  if (sources.length === 0) {
    return;
  }
  const data = loadBackupCacheStore(true);
  const current = data.items[key] || {};
  data.items[key] = {
    mediaId: toInt(entry.mediaId, 0, 0, 999999999),
    mediaType: entry.mediaType === "tv" ? "tv" : "movie",
    season: toInt(entry.season, 1, 1, 500),
    episode: toInt(entry.episode, 1, 1, 50000),
    sources,
    provider: String(entry.provider || current.provider || "").trim(),
    successCount: Math.max(0, Number(current.successCount || 0)) + 1,
    updatedAt: Date.now(),
  };
  pruneBackupCache(data);
  scheduleBackupCacheSave(data);
}

function fetchBackupCacheEntry(mediaType, mediaId, season = 1, episode = 1) {
  const key = buildBackupCacheKey(mediaType, mediaId, season, episode);
  if (!key) {
    return null;
  }
  const data = loadBackupCacheStore(true);
  const entry = data.items && typeof data.items === "object" ? data.items[key] : null;
  if (!entry) {
    return null;
  }
  const updatedAt = Number(entry.updatedAt || 0);
  if (!updatedAt || Date.now() - updatedAt > BACKUP_CACHE_TTL_MS) {
    delete data.items[key];
    scheduleBackupCacheSave(data);
    return null;
  }
  return entry;
}

function getRepairSourcesFallback(mediaType, mediaId, season = 1, episode = 1) {
  const safeId = toInt(mediaId, 0, 0, 999999999);
  if (!safeId) {
    return [];
  }
  const type = mediaType === "tv" ? "tv" : "movie";
  const key =
    type === "tv"
      ? `tv:${safeId}:s${Math.max(1, Number(season || 1))}e${Math.max(1, Number(episode || 1))}`
      : `movie:${safeId}`;
  const data = loadRepairStore();
  const entry = data.repairs && typeof data.repairs === "object" ? data.repairs[key] : null;
  const fallback = normalizeRepairSources(entry?.sources || []);
  return Array.isArray(fallback) ? fallback : [];
}

function resetFastfluxCaches() {
  fastfluxMovieCache.loadedAt = 0;
  fastfluxMovieCache.entries = [];
  fastfluxMovieCache.inFlight = null;
  fastfluxMovieCache.pagesLoaded = 0;
  fastfluxMovieCache.totalPages = 0;
  fastfluxMovieCache.map = new Map();
  fastfluxSeriesCache.loadedAt = 0;
  fastfluxSeriesCache.entries = [];
  fastfluxSeriesCache.inFlight = null;
  fastfluxSeriesCache.pagesLoaded = 0;
  fastfluxSeriesCache.totalPages = 0;
  fastfluxSeriesCache.map = new Map();
  fastfluxSearchCache.clear();
  tmdbSearchCache.clear();
}

function resetBackupCacheStore() {
  const data = loadBackupCacheStore(true);
  data.items = {};
  saveBackupCacheStore(data);
}

function triggerGlobalRepair() {
  globalRepairEpoch = Date.now();
  resetFastfluxCaches();
  purstreamSearchCache.clear();
  SOURCE_PROBE_CACHE.clear();
  resetBackupCacheStore();
}

function shouldForceRefreshGlobal() {
  return globalRepairEpoch > 0 && Date.now() - globalRepairEpoch < GLOBAL_REPAIR_FORCE_MS;
}

function prunePlaybackFailures(now) {
  const cutoff = now - PLAYBACK_FAIL_WINDOW_MS;
  for (const [ip, ts] of playbackFailureByIp.entries()) {
    if (Number(ts || 0) < cutoff) {
      playbackFailureByIp.delete(ip);
    }
  }
}

function recordPlaybackFailure(ip) {
  const now = Date.now();
  const safeIp = sanitizeToken(normalizeIpForAnalytics(ip || ""), 80) || "unknown";
  playbackFailureByIp.set(safeIp, now);
  prunePlaybackFailures(now);
  const active = playbackFailureByIp.size;
  let triggered = false;
  if (
    active >= PLAYBACK_FAIL_THRESHOLD &&
    now - playbackFailureLastGlobalAt > PLAYBACK_FAIL_COOLDOWN_MS
  ) {
    triggerGlobalRepair();
    playbackFailureLastGlobalAt = now;
    triggered = true;
  }
  return { active, triggered, lastGlobalAt: playbackFailureLastGlobalAt };
}

async function runFastfluxWarmup(reason = "interval") {
  if (!USE_FASTFLUX || fastfluxWarmupInFlight) {
    return;
  }
  fastfluxWarmupInFlight = true;
  fastfluxWarmupLastAt = Date.now();
  try {
    purstreamSearchCache.clear();
    await loadFastfluxMovies(true, { minPages: FASTFLUX_MOVIES_PAGES_PER_FEED });
    await loadFastfluxSeries(true, { minPages: FASTFLUX_SERIES_PAGES_PER_FEED });
    fastfluxWarmupLastOkAt = Date.now();
    console.log(`[fastflux] Warmup OK (${reason}).`);
  } catch (error) {
    console.warn("[fastflux] Warmup failed.", sanitizeToken(String(error?.message || ""), 120));
  } finally {
    fastfluxWarmupInFlight = false;
  }
}

function scheduleFastfluxWarmup() {
  if (fastfluxWarmupTimer) {
    return;
  }
  if (!USE_FASTFLUX) {
    return;
  }
  fastfluxWarmupTimer = setInterval(() => {
    runFastfluxWarmup("interval").catch(() => {});
  }, FASTFLUX_WARMUP_INTERVAL_MS);
  if (typeof fastfluxWarmupTimer.unref === "function") {
    fastfluxWarmupTimer.unref();
  }
  setTimeout(() => {
    runFastfluxWarmup("startup").catch(() => {});
  }, 5000);
}

function isFastfluxHealthDegraded(now = Date.now()) {
  if (!USE_FASTFLUX) {
    return true;
  }
  const lastOk = Number(fastfluxHealthLastOkAt || 0);
  const lastRun = Number(fastfluxHealthLastRunAt || 0);
  if (!lastRun) {
    return false;
  }
  if (fastfluxHealthFailStreak >= FASTFLUX_HEALTH_FAIL_THRESHOLD) {
    return true;
  }
  if (lastOk > 0 && now - lastOk > FASTFLUX_HEALTH_INTERVAL_MS * 3) {
    return true;
  }
  if (!lastOk && lastRun > 0 && now - lastRun > FASTFLUX_HEALTH_INTERVAL_MS * 3) {
    return true;
  }
  return false;
}

async function runFastfluxHealthCheck(reason = "interval") {
  if (!USE_FASTFLUX || fastfluxHealthInFlight) {
    return;
  }
  fastfluxHealthInFlight = true;
  fastfluxHealthLastRunAt = Date.now();
  try {
    const response = await fetchFastfluxPage("movies", 1, { timeoutMs: 9000 });
    const items = Array.isArray(response?.items) ? response.items : [];
    const ok = items.length > 0;
    if (ok) {
      fastfluxHealthFailStreak = 0;
      fastfluxHealthLastOkAt = Date.now();
      return;
    }
    fastfluxHealthFailStreak += 1;
    if (
      fastfluxHealthFailStreak >= FASTFLUX_HEALTH_FAIL_THRESHOLD &&
      Date.now() - fastfluxHealthLastRepairAt > FASTFLUX_HEALTH_FAIL_COOLDOWN_MS
    ) {
      triggerGlobalRepair();
      fastfluxHealthLastRepairAt = Date.now();
    }
  } catch {
    fastfluxHealthFailStreak += 1;
    if (
      fastfluxHealthFailStreak >= FASTFLUX_HEALTH_FAIL_THRESHOLD &&
      Date.now() - fastfluxHealthLastRepairAt > FASTFLUX_HEALTH_FAIL_COOLDOWN_MS
    ) {
      triggerGlobalRepair();
      fastfluxHealthLastRepairAt = Date.now();
    }
  } finally {
    fastfluxHealthInFlight = false;
  }
}

function scheduleFastfluxHealthCheck() {
  if (fastfluxHealthTimer || !USE_FASTFLUX) {
    return;
  }
  fastfluxHealthTimer = setInterval(() => {
    runFastfluxHealthCheck("interval").catch(() => {});
  }, FASTFLUX_HEALTH_INTERVAL_MS);
  if (typeof fastfluxHealthTimer.unref === "function") {
    fastfluxHealthTimer.unref();
  }
  setTimeout(() => {
    runFastfluxHealthCheck("startup").catch(() => {});
  }, 8000);
}

function loadRepairStore() {
  const data = loadAdminData(true);
  if (!data.repairs || typeof data.repairs !== "object") {
    data.repairs = {};
  }
  return data;
}

function pruneRepairStore(data) {
  if (!data || typeof data !== "object" || !data.repairs) {
    return;
  }
  const now = Date.now();
  Object.entries(data.repairs).forEach(([key, entry]) => {
    const updatedAt = Number(entry?.updatedAt || 0);
    if (!updatedAt || now - updatedAt > REPAIR_STORE_TTL_MS) {
      delete data.repairs[key];
    }
  });
  const keys = Object.keys(data.repairs);
  if (keys.length <= REPAIR_STORE_MAX_ENTRIES) {
    return;
  }
  keys
    .sort((a, b) => Number(data.repairs[b]?.updatedAt || 0) - Number(data.repairs[a]?.updatedAt || 0))
    .slice(REPAIR_STORE_MAX_ENTRIES)
    .forEach((key) => {
      delete data.repairs[key];
    });
}

function isRepairAllowed(ip, key, now = Date.now()) {
  const safeIp = sanitizeToken(ip || "0.0.0.0", 64) || "0.0.0.0";
  const bucket = `${safeIp}:${key}`;
  const last = Number(repairRateLimit.get(bucket) || 0);
  if (last && now - last < REPAIR_RATE_LIMIT_MS) {
    return false;
  }
  repairRateLimit.set(bucket, now);
  return true;
}

function pruneSuggestionSkips(data) {
  if (!data || typeof data !== "object") {
    return;
  }
  const skips = data?.suggestions?.skips;
  if (!skips || typeof skips !== "object") {
    return;
  }
  const now = Date.now();
  Object.entries(skips).forEach(([key, entry]) => {
    const updatedAt = Number(entry?.updatedAt || 0);
    if (!updatedAt || now - updatedAt > SUGGESTION_SKIP_TTL_MS) {
      delete skips[key];
    }
  });
}

function buildSuggestionKey(entry) {
  if (!entry || typeof entry !== "object") {
    return "";
  }
  const provider = String(entry.provider || "").trim().toLowerCase();
  const titleKey = normalizeTitleKey(entry.title || "");
  const type = String(entry.type || entry.mediaType || "").trim().toLowerCase();
  const year = toInt(entry.year, 0, 0, 2099);
  if (provider === "nakios" && entry.tmdbId) {
    return `nakios:${entry.tmdbId}`;
  }
  if (provider === "fastflux" && entry.tmdbId) {
    return `fastflux:${entry.tmdbId}`;
  }
  if (provider === "filmer2" && entry.url) {
    return `filmer2:${toBase64Url(String(entry.url || "").trim())}`;
  }
  if (provider === "anime" && entry.catalogUrl) {
    return `anime:${toBase64Url(String(entry.catalogUrl || "").trim())}`;
  }
  if (titleKey) {
    return `suggest:${provider || "misc"}:${titleKey}:${type || "movie"}:${year || 0}`;
  }
  return "";
}

function isSuggestionSkipped(data, key) {
  if (!data || !key) {
    return false;
  }
  const skips = data?.suggestions?.skips;
  if (!skips || typeof skips !== "object") {
    return false;
  }
  const entry = skips[key];
  if (!entry) {
    return false;
  }
  const updatedAt = Number(entry?.updatedAt || 0);
  if (!updatedAt || Date.now() - updatedAt > SUGGESTION_SKIP_TTL_MS) {
    delete skips[key];
    return false;
  }
  return true;
}

function markSuggestionSkipped(data, key, reason = "") {
  if (!data || !key) {
    return;
  }
  if (!data.suggestions || typeof data.suggestions !== "object") {
    data.suggestions = { skips: {} };
  }
  if (!data.suggestions.skips || typeof data.suggestions.skips !== "object") {
    data.suggestions.skips = {};
  }
  data.suggestions.skips[key] = {
    updatedAt: Date.now(),
    reason: String(reason || "").trim(),
  };
}

function clearSuggestionSkip(data, key) {
  if (!data || !key) {
    return;
  }
  if (data?.suggestions?.skips && typeof data.suggestions.skips === "object") {
    delete data.suggestions.skips[key];
  }
}

function toBase64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const normalized = String(input || "").replace(/-/g, "+").replace(/_/g, "/");
  const padLength = normalized.length % 4 ? 4 - (normalized.length % 4) : 0;
  const padded = normalized + "=".repeat(padLength);
  return Buffer.from(padded, "base64").toString("utf8");
}

function safeTimingEqual(left, right) {
  const leftBuf = Buffer.from(String(left || ""));
  const rightBuf = Buffer.from(String(right || ""));
  if (leftBuf.length !== rightBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(leftBuf, rightBuf);
}

function parseCookies(req) {
  const header = String(req.headers.cookie || "");
  if (!header) {
    return {};
  }
  return header.split(";").reduce((acc, part) => {
    const trimmed = part.trim();
    if (!trimmed) {
      return acc;
    }
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) {
      return acc;
    }
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!key) {
      return acc;
    }
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

function timingSafeEqualStrings(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

function buildDefaultAdminData() {
  return {
    announcement: {
      message: "",
      enabled: false,
      expiresAt: 0,
      updatedAt: "",
    },
    custom: [],
    overrides: {
      byId: {},
      byExternalKey: {},
    },
    repairs: {},
    suggestions: {
      skips: {},
    },
    requests: [],
    tvChannels: [],
    analytics: {
      totalSeen: 0,
      updatedAt: "",
    },
  };
}

function normalizeAdminData(raw) {
  const base = buildDefaultAdminData();
  if (!raw || typeof raw !== "object") {
    return base;
  }
  const ann = raw.announcement || {};
  base.announcement = {
    message: String(ann.message || "").trim(),
    enabled: Boolean(ann.enabled),
    expiresAt: Number(ann.expiresAt || 0),
    updatedAt: String(ann.updatedAt || ""),
  };
  base.custom = Array.isArray(raw.custom) ? raw.custom.filter(Boolean) : [];
  const overrides = raw.overrides || {};
  base.overrides = {
    byId: overrides.byId && typeof overrides.byId === "object" ? overrides.byId : {},
    byExternalKey: overrides.byExternalKey && typeof overrides.byExternalKey === "object" ? overrides.byExternalKey : {},
  };
  base.repairs = raw.repairs && typeof raw.repairs === "object" ? raw.repairs : {};
  const suggestions = raw.suggestions || {};
  base.suggestions = {
    skips: suggestions.skips && typeof suggestions.skips === "object" ? suggestions.skips : {},
  };
  base.requests = Array.isArray(raw.requests)
    ? raw.requests.map((entry) => normalizeRequestEntry(entry)).filter(Boolean)
    : [];
  base.tvChannels = Array.isArray(raw.tvChannels)
    ? raw.tvChannels.map((entry) => normalizeTvChannelEntry(entry)).filter(Boolean)
    : [];
  const analytics = raw.analytics || {};
  base.analytics = {
    totalSeen: Number(analytics.totalSeen || 0) || 0,
    updatedAt: String(analytics.updatedAt || ""),
  };
  return base;
}

function loadAdminData(force = false) {
  const now = Date.now();
  if (!force && adminDataCache.value && now - adminDataCache.loadedAt < 2000) {
    return adminDataCache.value;
  }
  let data = null;
  try {
    if (fs.existsSync(ADMIN_DATA_FILE)) {
      const raw = fs.readFileSync(ADMIN_DATA_FILE, "utf-8");
      data = parseJsonSafe(raw);
    }
  } catch {
    data = null;
  }
  if (!data) {
    try {
      if (fs.existsSync(ADMIN_DATA_FILE_FALLBACK)) {
        const raw = fs.readFileSync(ADMIN_DATA_FILE_FALLBACK, "utf-8");
        data = parseJsonSafe(raw);
      }
    } catch {
      data = null;
    }
  }
  const normalized = normalizeAdminData(data);
  adminDataCache.value = normalized;
  adminDataCache.loadedAt = now;
  return normalized;
}

function saveAdminData(data) {
  const normalized = normalizeAdminData(data);
  let saved = false;
  try {
    const tmp = `${ADMIN_DATA_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(normalized, null, 2), "utf-8");
    fs.renameSync(tmp, ADMIN_DATA_FILE);
    saved = true;
  } catch {
    saved = false;
  }
  if (!saved) {
    try {
      const tmp = `${ADMIN_DATA_FILE_FALLBACK}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(normalized, null, 2), "utf-8");
      fs.renameSync(tmp, ADMIN_DATA_FILE_FALLBACK);
      saved = true;
    } catch {
      // best effort
    }
  }
  adminDataCache.value = normalized;
  adminDataCache.loadedAt = Date.now();
  return normalized;
}

function hydrateAnalyticsTotals() {
  if (analyticsTotalsHydrated) {
    return;
  }
  analyticsTotalsHydrated = true;
  const data = loadAdminData(true);
  const stored = Number(data?.analytics?.totalSeen || 0) || 0;
  if (stored > analyticsTotalSeen) {
    analyticsTotalSeen = stored;
  }
}

function persistAnalyticsTotals(force = false) {
  const data = loadAdminData(true);
  const current = Number(data?.analytics?.totalSeen || 0) || 0;
  if (!force && current >= analyticsTotalSeen) {
    return;
  }
  data.analytics = {
    totalSeen: analyticsTotalSeen,
    updatedAt: new Date().toISOString(),
  };
  saveAdminData(data);
}

function scheduleAnalyticsTotalsPersist() {
  if (analyticsPersistTimer) {
    return;
  }
  analyticsPersistTimer = setTimeout(() => {
    analyticsPersistTimer = null;
    persistAnalyticsTotals();
  }, 1500);
}

function extractPurstreamSearchRows(payload) {
  const merged = [];
  const append = (list) => {
    if (Array.isArray(list)) {
      list.forEach((row) => {
        if (row) merged.push(row);
      });
    }
  };

  append(payload?.data?.items?.items);
  append(payload?.data?.items?.movies?.items);
  append(payload?.data?.items?.series?.items);
  append(payload?.data?.items?.tv?.items);
  append(payload?.data?.movies?.items);
  append(payload?.data?.results);

  const blocks = payload?.data?.items?.blocks || payload?.data?.blocks;
  if (blocks && typeof blocks === "object") {
    Object.values(blocks).forEach((entry) => {
      append(entry?.items);
      append(entry);
    });
  }

  if (merged.length === 0 && Array.isArray(payload?.data?.items)) {
    append(payload.data.items);
  }

  const dedupe = new Map();
  merged.forEach((entry) => {
    const id = toInt(entry?.id, 0, 0, 999999999);
    if (id <= 0) {
      return;
    }
    if (!dedupe.has(id)) {
      dedupe.set(id, entry);
    }
  });
  return Array.from(dedupe.values());
}

function normalizePurstreamSearchRow(row) {
  const id = toInt(row?.id, 0, 0, 999999999);
  if (id <= 0) {
    return null;
  }
  const title =
    String(row?.title || row?.name || row?.original_title || row?.original_name || "").trim();
  if (!title) {
    return null;
  }
  const typeRaw = String(row?.type || row?.media_type || row?.mediaType || "").toLowerCase();
  const type = typeRaw === "tv" || typeRaw === "series" || typeRaw === "serie" ? "tv" : "movie";
  const year = toInt(
    parseYearFromText(row?.release_date || row?.first_air_date || row?.year || ""),
    0,
    0,
    2099
  );
  return { id, title, type, year };
}

async function fetchPurstreamSearchRows(query) {
  const safeQuery = String(query || "").trim();
  if (!safeQuery) {
    return [];
  }
  const key = normalizeTitleKey(safeQuery);
  const now = Date.now();
  const cached = purstreamSearchCache.get(key);
  if (cached && Number(cached.expiresAt || 0) > now) {
    return cached.rows || [];
  }
  const target = `${PURSTREAM_API_BASE}/search-bar/search/${encodeURIComponent(safeQuery)}`;
  const response = await fetchRemote(target, {
    Referer: `${PURSTREAM_WEB_BASE}/`,
    Origin: PURSTREAM_WEB_BASE,
    "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
  });
  const payload = response.status >= 200 && response.status < 300 ? parseJsonSafe(response.body) : null;
  const items = payload ? extractPurstreamSearchRows(payload).map(normalizePurstreamSearchRow).filter(Boolean) : [];
  purstreamSearchCache.set(key, {
    expiresAt: now + PURSTREAM_SEARCH_CACHE_MS,
    rows: items,
  });
  if (purstreamSearchCache.size > 240) {
    const entries = Array.from(purstreamSearchCache.entries()).sort(
      (left, right) => Number(left?.[1]?.expiresAt || 0) - Number(right?.[1]?.expiresAt || 0)
    );
    entries.slice(0, purstreamSearchCache.size - 200).forEach(([cacheKey]) => purstreamSearchCache.delete(cacheKey));
  }
  return items;
}

async function isTitleOnPurstream(title, type, year = 0) {
  const safeTitle = String(title || "").trim();
  if (!safeTitle) {
    return false;
  }
  const safeType = String(type || "").toLowerCase() === "tv" ? "tv" : "movie";
  const safeYear = toInt(year, 0, 0, 2099);
  const titleKey = normalizeTitleKey(safeTitle);
  if (!titleKey) {
    return false;
  }
  const rows = await fetchPurstreamSearchRows(safeTitle);
  return rows.some((row) => {
    if (!row) {
      return false;
    }
    if (row.type !== safeType) {
      return false;
    }
    const rowKey = normalizeTitleKey(row.title || "");
    if (!rowKey) {
      return false;
    }
    if (rowKey !== titleKey && !rowKey.includes(titleKey) && !titleKey.includes(rowKey)) {
      return false;
    }
    if (!safeYear) {
      return true;
    }
    const rowYear = toInt(row.year, 0, 0, 2099);
    if (!rowYear) {
      return true;
    }
    return Math.abs(rowYear - safeYear) <= 1;
  });
}

function scorePurstreamCandidate(row, titleKey, year = 0) {
  if (!row) {
    return -1;
  }
  const rowKey = normalizeTitleKey(row.title || "");
  if (!rowKey) {
    return -1;
  }
  let score = 0;
  if (rowKey === titleKey) {
    score += 40;
  } else if (titleKey && (rowKey.includes(titleKey) || titleKey.includes(rowKey))) {
    score += 20;
  }
  const rowYear = toInt(row.year, 0, 0, 2099);
  const safeYear = toInt(year, 0, 0, 2099);
  if (safeYear > 0 && rowYear > 0) {
    const delta = Math.abs(rowYear - safeYear);
    if (delta === 0) {
      score += 10;
    } else if (delta === 1) {
      score += 6;
    } else if (delta <= 2) {
      score += 2;
    } else {
      score -= 2;
    }
  }
  return score;
}

function isPurstreamTitleMatch(rowKey, titleKey, year = 0, rowYear = 0) {
  if (!rowKey || !titleKey) {
    return false;
  }
  if (rowKey === titleKey) {
    return true;
  }
  if (rowKey.includes(titleKey) || titleKey.includes(rowKey)) {
    return true;
  }
  const titleTokens = titleKey.split(" ").filter((token) => token.length >= 2);
  const rowTokens = rowKey.split(" ").filter((token) => token.length >= 2);
  if (titleTokens.length === 0 || rowTokens.length === 0) {
    return false;
  }
  const rowSet = new Set(rowTokens);
  let matches = 0;
  titleTokens.forEach((token) => {
    if (rowSet.has(token)) {
      matches += 1;
    }
  });
  if (matches >= 2) {
    const ratio = matches / Math.max(1, titleTokens.length);
    if (ratio >= 0.5) {
      return true;
    }
  }
  const safeYear = toInt(year, 0, 0, 2099);
  const safeRowYear = toInt(rowYear, 0, 0, 2099);
  if (safeYear > 0 && safeRowYear > 0) {
    return Math.abs(safeYear - safeRowYear) <= 1;
  }
  if (titleTokens.length <= 1) {
    return true;
  }
  return false;
}

function pickBestPurstreamCandidate(rows, title, mediaType, year = 0) {
  const items = Array.isArray(rows) ? rows : [];
  if (items.length === 0) {
    return null;
  }
  const titleKey = normalizeTitleKey(title || "");
  const safeType = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const filtered = items.filter((row) => {
    if (!row || row.type !== safeType) {
      return false;
    }
    const rowKey = normalizeTitleKey(row.title || "");
    if (!rowKey || !titleKey) {
      return false;
    }
    const rowYear = toInt(row.year, 0, 0, 2099);
    return isPurstreamTitleMatch(rowKey, titleKey, year, rowYear);
  });
  if (filtered.length === 0) {
    return null;
  }
  let best = null;
  let bestScore = -Infinity;
  filtered.forEach((row) => {
    const score = scorePurstreamCandidate(row, titleKey, year);
    if (score > bestScore) {
      bestScore = score;
      best = row;
    }
  });
  return best || filtered[0];
}

async function fetchPurstreamStreamSources(id, mediaType, season = 1, episode = 1) {
  const safeId = toInt(id, 0, 0, 999999999);
  if (safeId <= 0) {
    return [];
  }
  const safeType = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const safeSeason = toInt(season, 1, 1, 500);
  const safeEpisode = toInt(episode, 1, 1, 50000);
  const headers = {
    Referer: `${PURSTREAM_WEB_BASE}/`,
    Origin: PURSTREAM_WEB_BASE,
    "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
  };
  const tryFetch = async (url) => {
    const response = await fetchRemote(url, headers);
    if (response.status < 200 || response.status >= 300) {
      return [];
    }
    const payload = parseJsonSafe(response.body);
    const sources = Array.isArray(payload?.data?.items?.sources) ? payload.data.items.sources : [];
    return sources;
  };
  if (safeType === "tv") {
    const episodePath = `${PURSTREAM_API_BASE}/stream/${safeId}/episode?season=${safeSeason}&episode=${safeEpisode}`;
    const episodeSources = await tryFetch(episodePath);
    if (episodeSources.length > 0) {
      return episodeSources;
    }
  }
  const moviePath = `${PURSTREAM_API_BASE}/stream/${safeId}`;
  return await tryFetch(moviePath);
}

function normalizePurstreamSourceEntry(sourceRow, index = 0, options = {}) {
  if (!sourceRow || typeof sourceRow !== "object") {
    return null;
  }
  const streamUrl = String(sourceRow?.stream_url || sourceRow?.url || "").trim();
  if (!streamUrl) {
    return null;
  }
  const label = String(sourceRow?.source_name || sourceRow?.name || sourceRow?.label || "").trim();
  const language = normalizePidoovLanguage(sourceRow?.language || sourceRow?.lang || label || "") || "";
  const allowAll = Boolean(options?.allowAllLanguages);
  if (!allowAll && language && language !== "VF" && language !== "MULTI") {
    return null;
  }
  const quality = sanitizeToken(String(sourceRow?.quality || label || "HD"), 24) || "HD";
  const format = inferOwnedSourceFormat(streamUrl, sourceRow?.format || sourceRow?.type || "m3u8");
  const normalizedLanguage = language || (allowAll ? "VO" : "VF");
  return {
    stream_url: streamUrl,
    source_name: "Purstream",
    origin: "purstream",
    quality,
    language: normalizedLanguage,
    format,
    priority:
      (normalizedLanguage === "VF" ? 388 : normalizedLanguage === "MULTI" ? 370 : 340) -
      Math.min(40, index * 4),
  };
}

async function resolvePurstreamSourcesByTitle(title, mediaType, year = 0, season = 1, episode = 1, options = {}) {
  const safeTitle = String(title || "").trim();
  if (!safeTitle) {
    return [];
  }
  const rows = await fetchPurstreamSearchRows(safeTitle);
  const candidate = pickBestPurstreamCandidate(rows, safeTitle, mediaType, year);
  if (!candidate) {
    return [];
  }
  const rawSources = await fetchPurstreamStreamSources(candidate.id, mediaType, season, episode);
  if (!Array.isArray(rawSources) || rawSources.length === 0) {
    return [];
  }
  const out = rawSources
    .map((row, index) => normalizePurstreamSourceEntry(row, index, options))
    .filter(Boolean);
  const dedupe = new Set();
  return out.filter((entry) => {
    const key = String(entry?.stream_url || "").trim();
    if (!key || dedupe.has(key)) {
      return false;
    }
    dedupe.add(key);
    return true;
  });
}

function isCustomAlreadyAdded(adminData, candidate) {
  if (!adminData || !candidate) {
    return false;
  }
  const custom = Array.isArray(adminData.custom) ? adminData.custom : [];
  const provider = String(candidate.provider || "").toLowerCase();
  if (provider === "nakios" && candidate.tmdbId) {
    return custom.some((entry) => Number(entry?.external_tmdb_id || 0) === Number(candidate.tmdbId || 0));
  }
  if (provider === "fastflux" && candidate.tmdbId) {
    return custom.some((entry) => Number(entry?.external_tmdb_id || 0) === Number(candidate.tmdbId || 0));
  }
  if (provider === "filmer2" && candidate.url) {
    return custom.some((entry) => String(entry?.external_detail_url || "") === String(candidate.url || ""));
  }
  if (provider === "anime" && candidate.catalogUrl) {
    return custom.some((entry) => String(entry?.external_detail_url || "") === String(candidate.catalogUrl || ""));
  }
  const titleKey = normalizeTitleKey(candidate.title || "");
  if (!titleKey) {
    return false;
  }
  return custom.some((entry) => normalizeTitleKey(entry?.title || "") === titleKey);
}

function buildNakiosImportUrlFromCandidate(candidate) {
  const tmdbId = toInt(candidate?.tmdbId, 0, 0, 999999999);
  if (!tmdbId) {
    return "";
  }
  const type = String(candidate?.type || "").toLowerCase() === "tv" ? "series" : "movie";
  return `https://nakios.site/${type}/${tmdbId}`;
}

function buildFastfluxImportUrlFromCandidate(candidate) {
  const tmdbId = toInt(candidate?.tmdbId, 0, 0, 999999999);
  if (!tmdbId) {
    return "";
  }
  const type = String(candidate?.type || "").toLowerCase() === "tv" ? "series" : "movie";
  return `${FASTFLUX_BASE}/${type}/${tmdbId}`;
}

async function enrichNakiosSuggestion(candidate) {
  const tmdbId = toInt(candidate?.tmdbId, 0, 0, 999999999);
  if (!tmdbId) {
    return candidate;
  }
  const mediaType = String(candidate?.type || "").toLowerCase() === "tv" ? "series" : "movies";
  const target = `${NAKIOS_API_BASE}/api/${mediaType}/${tmdbId}`;
  const response = await fetchRemote(target, NAKIOS_FETCH_HEADERS);
  if (response.status < 200 || response.status >= 300) {
    return candidate;
  }
  const detail = parseJsonSafe(response.body);
  if (!detail) {
    return candidate;
  }
  const overview = String(detail?.overview || "").trim();
  const poster = toNakiosTmdbPosterUrl(detail?.poster_path || "") || candidate.poster || "";
  const backdrop = toNakiosTmdbBackdropUrl(detail?.backdrop_path || "", detail?.poster_path || "");
  const year = toInt(
    parseYearFromText(detail?.release_date || detail?.first_air_date || ""),
    candidate.year || 0,
    0,
    2099
  );
  return {
    ...candidate,
    title: String(detail?.title || detail?.name || candidate.title || "").trim() || candidate.title,
    overview: overview || candidate.overview || "",
    poster,
    backdrop: backdrop || candidate.backdrop || poster,
    year: year || candidate.year || 0,
  };
}

async function enrichFastfluxSuggestion(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return candidate;
  }
  return {
    ...candidate,
    title: String(candidate.title || "").trim() || candidate.title,
    overview: String(candidate.overview || "").trim(),
    poster: String(candidate.poster || "").trim() || candidate.poster,
    backdrop: String(candidate.backdrop || candidate.poster || "").trim() || candidate.backdrop,
    importUrl: candidate.importUrl || buildFastfluxImportUrlFromCandidate(candidate),
  };
}

async function enrichFilmer2Suggestion(candidate) {
  const url = String(candidate?.url || "").trim();
  if (!url) {
    return candidate;
  }
  const detail = await fetchFilmer2Detail(url);
  if (!detail) {
    return candidate;
  }
  return {
    ...candidate,
    title: String(detail?.title || candidate.title || "").trim() || candidate.title,
    overview: String(detail?.description || "").trim() || candidate.overview || "",
    poster: String(detail?.poster || candidate.poster || "").trim() || candidate.poster || "",
    backdrop: String(detail?.backdrop || candidate.backdrop || "").trim() || candidate.backdrop || "",
    year: toInt(detail?.year, candidate.year || 0, 0, 2099) || candidate.year || 0,
  };
}

async function enrichAnimeSuggestion(candidate) {
  const catalogUrl = sanitizeAnimeSamaCatalogUrl(candidate?.catalogUrl || "");
  if (!catalogUrl) {
    return candidate;
  }
  const response = await fetchRemoteText(catalogUrl, "text/html");
  if (response.status < 200 || response.status >= 300) {
    return { ...candidate, catalogUrl };
  }
  const html = response.body || "";
  const title =
    extractMetaContent(html, "og:title") ||
    extractTagText(html, "h1") ||
    candidate.title ||
    "";
  const poster =
    extractMetaContent(html, "og:image") ||
    extractMetaContent(html, "twitter:image") ||
    candidate.poster ||
    "";
  const overview =
    extractMetaContent(html, "og:description") ||
    extractMetaContent(html, "description") ||
    candidate.overview ||
    "";
  return {
    ...candidate,
    title: String(title || "").replace(/\s*\|\s*anime-sama.*$/i, "").trim() || candidate.title,
    overview: String(overview || "").trim() || candidate.overview || "",
    poster: String(poster || "").trim() || candidate.poster || "",
    catalogUrl,
  };
}

function shuffleArray(values) {
  const rows = Array.isArray(values) ? values.slice() : [];
  for (let index = rows.length - 1; index > 0; index -= 1) {
    const pick = Math.floor(Math.random() * (index + 1));
    [rows[index], rows[pick]] = [rows[pick], rows[index]];
  }
  return rows;
}

async function buildAdminSuggestions(type = "movie", limit = 3) {
  const safeType = String(type || "movie").toLowerCase() === "anime" ? "anime" : String(type || "movie").toLowerCase();
  const safeLimit = Math.max(1, Math.min(8, Number(limit || 3)));
  const adminData = loadAdminData(true);
  pruneSuggestionSkips(adminData);
  const suggestions = [];
  const candidates = [];

  if (safeType === "anime") {
    try {
      const html = await fetchAnimePlanningPage();
      const planning = parseAnimePlanning(html, new Date().getFullYear());
      const entries = Array.isArray(planning?.items) ? planning.items : [];
      entries.forEach((entry) => {
        const catalogUrl = sanitizeAnimeSamaCatalogUrl(entry?.url || "");
        if (!catalogUrl) {
          return;
        }
        candidates.push({
          provider: "anime",
          type: "tv",
          title: entry?.title || "",
          year: 0,
          poster: entry?.poster || "",
          overview: "",
          catalogUrl,
          importUrl: catalogUrl,
          score: 50,
          availability: "available",
        });
      });
    } catch {
      // ignore
    }
  } else {
    const desiredType = safeType === "tv" ? "tv" : "movie";
    try {
      const fastfluxRows = await loadFastfluxCatalogEntries();
      fastfluxRows.forEach((row) => {
        if (!row || String(row.type || "").toLowerCase() !== desiredType) {
          return;
        }
        const tmdbId = toInt(row?.external_tmdb_id, 0, 0, 999999999);
        candidates.push({
          provider: "fastflux",
          type: desiredType,
          title: row?.title || "",
          year: toInt(row?.external_year, 0, 0, 2099),
          poster: row?.large_poster_path || row?.small_poster_path || "",
          backdrop: row?.wallpaper_poster_path || "",
          tmdbId,
          importUrl: buildFastfluxImportUrlFromCandidate({ tmdbId, type: desiredType }),
          availability: row?.availability_status || row?.external_status || "",
          score: Number(row?.supplemental_rank || 0),
        });
      });
    } catch {
      // ignore
    }
  }

  const ordered = shuffleArray(
    candidates
      .sort((left, right) => Number(right?.score || 0) - Number(left?.score || 0))
      .slice(0, 260)
  );

  for (const candidate of ordered) {
    if (suggestions.length >= safeLimit) {
      break;
    }
    const key = buildSuggestionKey(candidate);
    if (!key) {
      continue;
    }
    if (isSuggestionSkipped(adminData, key)) {
      continue;
    }
    if (isCustomAlreadyAdded(adminData, candidate)) {
      continue;
    }
    if (candidate.title && (await isTitleOnPurstream(candidate.title, candidate.type, candidate.year))) {
      continue;
    }

    let enriched = candidate;
    if (candidate.provider === "fastflux") {
      enriched = await enrichFastfluxSuggestion(candidate);
      enriched.importUrl = enriched.importUrl || buildFastfluxImportUrlFromCandidate(enriched);
    } else if (candidate.provider === "anime") {
      enriched = await enrichAnimeSuggestion(candidate);
    }

    suggestions.push({
      key,
      title: enriched.title || candidate.title || "Sans titre",
      type: String(enriched.type || candidate.type || "movie").toLowerCase(),
      year: toInt(enriched.year, 0, 0, 2099),
      poster: enriched.poster || candidate.poster || "",
      overview: enriched.overview || "",
      availability: normalizeNakiosAvailabilityStatus(enriched.availability || candidate.availability || "") || "",
      importUrl: enriched.importUrl || candidate.importUrl || "",
      provider: enriched.provider || candidate.provider || "external",
      tags: [],
    });
  }

  suggestions.forEach((item) => {
    const tags = [];
    tags.push(item.type === "tv" ? "Serie" : item.type === "anime" ? "Anime" : "Film");
    if (item.year) tags.push(String(item.year));
    if (item.availability === "pending") tags.push("En attente");
    item.tags = tags;
  });

  if (adminData?.suggestions?.skips) {
    saveAdminData(adminData);
  }

  return suggestions;
}

function normalizeBackupUrl(value) {
  let url = String(value || "").trim();
  if (!url) {
    return "";
  }
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url.replace(/^\/+/, "")}`;
  }
  return url;
}

function getDefaultBackupUrl() {
  if (CANONICAL_HOST) {
    return `${CANONICAL_SCHEME}://${CANONICAL_HOST}`;
  }
  return "https://zenix.best";
}

function loadBackupConfig(force = false) {
  const now = Date.now();
  if (!force && backupConfigCache.value && now - backupConfigCache.loadedAt < 2000) {
    return backupConfigCache.value;
  }
  let data = null;
  try {
    if (fs.existsSync(BACKUP_CONFIG_FILE)) {
      const raw = fs.readFileSync(BACKUP_CONFIG_FILE, "utf-8");
      data = parseJsonSafe(raw);
    }
  } catch {
    data = null;
  }
  const currentUrl = normalizeBackupUrl(data?.currentUrl) || getDefaultBackupUrl();
  const previousUrl = normalizeBackupUrl(data?.previousUrl);
  const updatedAt = Number(data?.updatedAt || 0);
  const normalized = { currentUrl, previousUrl, updatedAt };
  backupConfigCache.value = normalized;
  backupConfigCache.loadedAt = now;
  return normalized;
}

function saveBackupConfig(next) {
  const payload = {
    currentUrl: normalizeBackupUrl(next?.currentUrl) || getDefaultBackupUrl(),
    previousUrl: normalizeBackupUrl(next?.previousUrl),
    updatedAt: Number(next?.updatedAt || Date.now()),
  };
  try {
    fs.mkdirSync(path.dirname(BACKUP_CONFIG_FILE), { recursive: true });
    const tmp = `${BACKUP_CONFIG_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), "utf-8");
    fs.renameSync(tmp, BACKUP_CONFIG_FILE);
  } catch {
    // best effort
  }
  backupConfigCache.value = payload;
  backupConfigCache.loadedAt = Date.now();
  return payload;
}

function setBackupCors(res, origin) {
  const allowed = new Set(["https://zenix.lol", "https://www.zenix.lol"]);
  if (origin && allowed.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getActiveAnnouncement(data) {
  const payload = data?.announcement || {};
  const message = String(payload.message || "").trim();
  if (!payload.enabled || !message) {
    return null;
  }
  const expiresAt = Number(payload.expiresAt || 0);
  if (expiresAt > 0 && Date.now() > expiresAt) {
    const next = normalizeAdminData(data);
    next.announcement.enabled = false;
    saveAdminData(next);
    return null;
  }
  return {
    message,
    expiresAt,
    updatedAt: String(payload.updatedAt || ""),
  };
}

function getAdminSession(req) {
  const cookies = parseCookies(req);
  const token = String(cookies[ADMIN_COOKIE_NAME] || "").trim();
  if (!token) {
    return null;
  }
  const session = adminSessions.get(token);
  if (!session || Number(session.expiresAt || 0) < Date.now()) {
    adminSessions.delete(token);
    return null;
  }
  return session;
}

function setAdminCookie(res, token, ttlMs = ADMIN_SESSION_TTL_MS) {
  const maxAge = Math.max(60, Math.floor(ttlMs / 1000));
  res.setHeader("Set-Cookie", [
    `${ADMIN_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`,
  ]);
}

function clearAdminCookie(res) {
  res.setHeader("Set-Cookie", [
    `${ADMIN_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
  ]);
}

function isAdminAuthenticated(req) {
  if (!ADMIN_PASSWORD) {
    return false;
  }
  return Boolean(getAdminSession(req));
}

function isAdminLoginAllowed(ip, now = Date.now()) {
  const key = String(ip || "unknown");
  const existing = adminLoginAttempts.get(key) || { count: 0, resetAt: now + ADMIN_LOGIN_WINDOW_MS };
  if (now > existing.resetAt) {
    existing.count = 0;
    existing.resetAt = now + ADMIN_LOGIN_WINDOW_MS;
  }
  if (existing.count >= ADMIN_LOGIN_MAX_ATTEMPTS) {
    adminLoginAttempts.set(key, existing);
    return false;
  }
  existing.count += 1;
  adminLoginAttempts.set(key, existing);
  return true;
}

function applyAdminOverride(entry, adminData) {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const hardId = Number(entry?.id || 0);
  if (hardId > 0 && HARD_HIDDEN_MEDIA_IDS.has(hardId)) {
    return null;
  }
  const overrides = adminData?.overrides || {};
  const byId = overrides.byId || {};
  const byExternalKey = overrides.byExternalKey || {};
  const idKey = String(entry.id || "");
  const extKey = String(entry.external_key || "");
  const override = (extKey && byExternalKey[extKey]) || (idKey && byId[idKey]) || null;
  if (!override || typeof override !== "object") {
    return entry;
  }
  if (override.hidden === true) {
    return null;
  }
  const next = { ...entry };
  if (override.title) {
    next.title = String(override.title || "").trim() || next.title;
  }
  if (override.overview) {
    next.overview = String(override.overview || "").trim();
  }
  if (override.poster) {
    const poster = String(override.poster || "").trim();
    if (poster) {
      next.small_poster_path = poster;
      next.large_poster_path = poster;
      next.wallpaper_poster_path = next.wallpaper_poster_path || poster;
    }
  }
  if (override.backdrop) {
    const backdrop = String(override.backdrop || "").trim();
    if (backdrop) {
      next.wallpaper_poster_path = backdrop;
    }
  }
  if (override.release_date) {
    next.release_date = String(override.release_date || "").trim();
  }
  if (override.availability_status) {
    const status = normalizeNakiosAvailabilityStatus(override.availability_status);
    if (status) {
      next.availability_status = status;
      next.external_status = status;
    }
  }
  if (override.type) {
    next.type = String(override.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  }
  if (override.isAnime !== undefined) {
    next.isAnime = Boolean(override.isAnime);
  }
  if (override.external_detail_url) {
    next.external_detail_url = String(override.external_detail_url || "").trim();
  }
  return next;
}

function isDisallowedExternalEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }
  const externalKey = String(entry?.external_key || entry?.externalKey || "").toLowerCase();
  const detailUrl = String(entry?.external_detail_url || entry?.detailUrl || "").toLowerCase();
  const isDirect =
    externalKey.startsWith("direct:") ||
    /\.(m3u8|mp4|webm|mpd)(?:$|[?#])/i.test(detailUrl);
  if (isDirect) {
    return false;
  }
  const provider = String(entry?.external_provider || entry?.provider || "").toLowerCase();
  const detail = String(entry?.external_detail_url || entry?.detailUrl || "").toLowerCase();
  const key = String(entry?.external_key || entry?.externalKey || "").toLowerCase();
  const combined = `${provider} ${detail} ${key}`.trim();
  if (!combined) {
    return false;
  }
  if (entry.isAnime) {
    return !/anime-sama|animesama/.test(combined);
  }
  if (/fastflux|purstream|anime-sama|animesama/.test(combined)) {
    return false;
  }
  return true;
}

function mergeAdminCustomEntries(entries, adminData) {
  const base = Array.isArray(entries) ? entries.slice() : [];
  const custom = Array.isArray(adminData?.custom) ? adminData.custom.slice() : [];
  if (custom.length === 0) {
    return base;
  }
  const customPrepared = custom
    .map((entry) => applyAdminOverride(entry, adminData))
    .filter(Boolean)
    .filter((entry) => !isDisallowedExternalEntry(entry));
  const merged = [];
  const seen = new Set();
  const all = customPrepared.concat(base);
  all.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const isForced = Boolean(entry.force_duplicate ?? entry.forceDuplicate ?? entry.allow_duplicate ?? entry.allowDuplicate);
    const key = buildSupplementalSemanticKey(entry) || String(entry.id || "");
    if (!key) {
      return;
    }
    if (isForced) {
      merged.push(entry);
      return;
    }
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    merged.push(entry);
  });
  return merged;
}

function hashSha256(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function buildGateFingerprint(req) {
  const ip = getRemoteAddress(req);
  const ua = String(req.headers["user-agent"] || "").slice(0, 180);
  return hashSha256(`${ip}|${ua}`).slice(0, 48);
}

function pruneGateChallenges(now = Date.now()) {
  for (const [nonce, entry] of gateChallenges.entries()) {
    if (!entry || Number(entry.expiresAt || 0) <= now) {
      gateChallenges.delete(nonce);
    }
  }
  if (gateChallenges.size > GATE_CHALLENGE_MAX) {
    const overflow = gateChallenges.size - GATE_CHALLENGE_MAX;
    let removed = 0;
    for (const nonce of gateChallenges.keys()) {
      gateChallenges.delete(nonce);
      removed += 1;
      if (removed >= overflow) {
        break;
      }
    }
  }
}

function buildGateProof(nonce, fingerprint) {
  return toBase64Url(
    crypto.createHmac("sha256", GATE_SECRET).update(`proof:${nonce}:${fingerprint}`).digest()
  );
}

function buildGateToken(fingerprint, ttlMs) {
  const payload = {
    fp: fingerprint,
    iat: Date.now(),
    exp: Date.now() + ttlMs,
  };
  const body = toBase64Url(JSON.stringify(payload));
  const signature = toBase64Url(crypto.createHmac("sha256", GATE_SECRET).update(body).digest());
  return `${body}.${signature}`;
}

function verifyGateToken(token, req) {
  const raw = String(token || "");
  const [body, signature] = raw.split(".");
  if (!body || !signature) {
    return null;
  }
  const expected = toBase64Url(crypto.createHmac("sha256", GATE_SECRET).update(body).digest());
  if (!safeTimingEqual(signature, expected)) {
    return null;
  }
  let payload;
  try {
    payload = JSON.parse(fromBase64Url(body));
  } catch {
    return null;
  }
  if (!payload || Number(payload.exp || 0) <= Date.now()) {
    return null;
  }
  const fingerprint = buildGateFingerprint(req);
  if (payload.fp && payload.fp !== fingerprint) {
    return null;
  }
  return payload;
}

function shouldUseSecureCookies() {
  return CANONICAL_SCHEME === "https";
}

function setGateCookie(res, token, ttlMs) {
  const maxAge = Math.max(60, Math.floor(ttlMs / 1000));
  const parts = [
    `${GATE_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (shouldUseSecureCookies()) {
    parts.push("Secure");
  }
  res.setHeader("Set-Cookie", parts.join("; "));
}

function getGateCookie(req) {
  const cookies = parseCookies(req);
  return cookies[GATE_COOKIE_NAME] || "";
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
  hydrateAnalyticsTotals();
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
      playing: false,
      userAgent: "",
      deviceClass: "Autre",
      platform: "Inconnu",
      browser: "Inconnu",
      countryCode: "??",
      countryName: "Inconnu",
    };
    analyticsTotalSeen += 1;
    scheduleAnalyticsTotalsPersist();
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
  const playingRaw = payload?.playing;
  const playing =
    playingRaw === true ||
    playingRaw === 1 ||
    playingRaw === "1" ||
    String(playingRaw || "").toLowerCase() === "true";
  row.playing = Boolean(playing);
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
  hydrateAnalyticsTotals();
  pruneAnalytics(now);
  const activeThreshold = now - ANALYTICS_ACTIVE_WINDOW_MS;
  const threshold24h = now - ANALYTICS_WINDOW_24H_MS;
  const threshold48h = now - ANALYTICS_WINDOW_48H_MS;
  const rowsAll = Array.from(analyticsClients.values());
  const rows24h = rowsAll.filter((row) => Number(row?.lastSeen || 0) >= threshold24h);
  const rows48h = rowsAll.filter((row) => Number(row?.lastSeen || 0) >= threshold48h);
  const activeRows = rowsAll.filter((row) => Number(row?.lastSeen || 0) >= activeThreshold);
  const playingNowCount = activeRows.filter((row) => Boolean(row?.playing)).length;

  const devicesActive = new Map();
  const platformsActive = new Map();
  const browsersActive = new Map();
  const pagesActive = new Map();

  const ipActiveMap = new Map();
  const ip24hMap = new Map();
  const ip48hMap = new Map();

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
  rows48h.forEach((row) => {
    mergeIpRow(ip48hMap, row);
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

  const heartbeats24h = analyticsEvents.reduce(
    (acc, ts) => (Number(ts || 0) >= threshold24h ? acc + 1 : acc),
    0
  );
  const heartbeats48h = analyticsEvents.reduce(
    (acc, ts) => (Number(ts || 0) >= threshold48h ? acc + 1 : acc),
    0
  );

  return {
    generatedAt: new Date(now).toISOString(),
    activeNow: activeRows.length,
    playingNow: playingNowCount,
    unique24h: rows24h.length,
    unique48h: rows48h.length,
    heartbeats24h,
    heartbeats48h,
    totalSeen: analyticsTotalSeen,
    activeIps: ipActiveMap.size,
    uniqueIps24h: ip24hMap.size,
    uniqueIps48h: ip48hMap.size,
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
  const fallbackId = String(DISCORD_STATS_MESSAGE_ID_FALLBACK || "").trim();
  if (/^\d{8,30}$/.test(fallbackId)) {
    discordStatsMessageId = fallbackId;
    return;
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
  const fallbackMessageId = String(DISCORD_STATS_MESSAGE_ID_FALLBACK || "").trim();
  const hasFallbackMessageId = /^\d{8,30}$/.test(fallbackMessageId);
  if (!discordStatsMessageId && hasFallbackMessageId) {
    discordStatsMessageId = fallbackMessageId;
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
  if (hasFallbackMessageId && fallbackMessageId !== discordStatsMessageId) {
    sendDiscordWebhook("PATCH", payload, { messageId: fallbackMessageId, wait: false })
      .then((result) => {
        if (!result?.ok && result?.status && result.status !== 429) {
          console.warn(`[discord] Fallback stats patch failed (${result.status}).`);
        }
      })
      .catch(() => {
        // best effort only
      });
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

function extractFilenameTokens(streamUrl) {
  if (!streamUrl) {
    return [];
  }
  let pathname = "";
  let parsed = null;
  try {
    parsed = new URL(streamUrl);
    pathname = String(parsed.pathname || "");
  } catch {
    pathname = String(streamUrl || "");
  }
  if (parsed && pathname) {
    const lowerPath = pathname.toLowerCase();
    if (lowerPath === "/api/hls-proxy" || lowerPath === "/api/hls-proxy-mobile") {
      const target = parsed.searchParams.get("url");
      if (target && target !== streamUrl) {
        const nested = extractFilenameTokens(target);
        if (nested.length > 0) {
          return nested;
        }
      }
    }
    if (lowerPath === "/api/video_proxy.php") {
      const file = parsed.searchParams.get("file");
      if (file) {
        const nestedUrl = `https://fastflux.xyz${file.startsWith("/") ? "" : "/"}${file}`;
        const nested = extractFilenameTokens(nestedUrl);
        if (nested.length > 0) {
          return nested;
        }
      }
    }
  }
  const last = pathname.split("/").filter(Boolean).pop() || "";
  if (!last) {
    return [];
  }
  const decoded = decodeURIComponent(last);
  const stripped = decoded.replace(/\.(m3u8|mp4|mkv|webm|dash|ts|mov)(?:\?.*)?$/i, "");
  const normalized = normalizeTitleKey(stripped);
  if (!normalized) {
    return [];
  }
  return normalized
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !/^s\d+e\d+$/.test(token));
}

function shouldKeepFastfluxByTitle(streamUrl, title) {
  const titleKey = normalizeTitleKey(title);
  if (!titleKey) {
    return true;
  }
  const titleTokens = titleKey.split(" ").filter((token) => token.length >= 2);
  if (titleTokens.length < 2) {
    return true;
  }
  const fileTokens = extractFilenameTokens(streamUrl);
  if (fileTokens.length < 2) {
    return true;
  }
  const titleSet = new Set(titleTokens);
  let matches = 0;
  fileTokens.forEach((token) => {
    if (titleSet.has(token)) {
      matches += 1;
    }
  });
  const ratio = matches / Math.max(1, titleTokens.length);
  return ratio >= 0.34;
}

function isMovixHost(host) {
  const safe = String(host || "").toLowerCase();
  if (!safe) {
    return false;
  }
  for (const base of MOVIX_HOSTS) {
    if (safe === base || safe.endsWith(`.${base}`)) {
      return true;
    }
  }
  return false;
}

function decodeMovixBase62ToBytes(input) {
  const raw = String(input || "").trim();
  if (!raw) {
    return null;
  }
  let value = 0n;
  for (const char of raw) {
    const index = MOVIX_BASE62_ALPHABET.indexOf(char);
    if (index < 0) {
      return null;
    }
    value = value * 62n + BigInt(index);
  }
  if (value === 0n) {
    return Buffer.from([]);
  }
  const bytes = [];
  while (value > 0n) {
    bytes.unshift(Number(value & 255n));
    value >>= 8n;
  }
  return Buffer.from(bytes);
}

function decodeMovixId(raw) {
  const safe = String(raw || "").trim();
  if (!safe) {
    return "";
  }
  if (/^\d+$/.test(safe)) {
    return safe;
  }
  if (safe.includes("=")) {
    const base = safe.slice(0, -7);
    if (!base) {
      return "";
    }
    try {
      const decoded = Buffer.from(base, "base64").toString("utf8");
      return /^\d+$/.test(decoded) ? decoded : "";
    } catch {
      return "";
    }
  }
  const startIndex = Math.max(1, safe.length - 30);
  for (let i = startIndex; i >= 1; i -= 1) {
    const prefix = safe.slice(0, i);
    const bytes = decodeMovixBase62ToBytes(prefix);
    if (!bytes || bytes.length === 0) {
      continue;
    }
    const decoded = bytes.toString("utf8");
    if (/^\d+$/.test(decoded)) {
      return decoded;
    }
  }
  return "";
}

function parseMovixExternalKey(value) {
  const raw = String(value || "").trim();
  if (!raw.startsWith("movix:")) {
    return null;
  }
  const parts = raw.split(":").filter(Boolean);
  if (parts.length < 3) {
    return null;
  }
  const mediaType = parts[1] === "tv" ? "tv" : parts[1] === "movie" ? "movie" : "";
  const tmdbId = toInt(parts[2], 0, 0, 999999999);
  if (!mediaType || tmdbId <= 0) {
    return null;
  }
  return { mediaType, tmdbId };
}

function parseMovixUrl(input) {
  const raw = String(input || "").trim();
  if (!raw) {
    return null;
  }
  let parsed = null;
  try {
    parsed = new URL(raw, MOVIX_BASE_URL || "https://movix.blog");
  } catch {
    return null;
  }
  if (!isMovixHost(parsed.hostname)) {
    return null;
  }
  const segments = String(parsed.pathname || "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  let mediaType = "";
  let idToken = "";
  let season = 1;
  let episode = 1;
  let isAnime = false;

  if (segments[0] === "watch") {
    const kind = segments[1] || "";
    if (kind === "movie" || kind === "film") {
      mediaType = "movie";
      idToken = segments[2] || "";
    } else if (kind === "tv" || kind === "series" || kind === "serie") {
      mediaType = "tv";
      idToken = segments[2] || "";
    } else if (kind === "anime") {
      mediaType = "tv";
      isAnime = true;
      idToken = segments[2] || "";
    } else if (segments[1]) {
      idToken = segments[1];
    }
    const seasonIndex = segments.findIndex((segment) => segment === "s" || segment === "season");
    if (seasonIndex >= 0 && segments[seasonIndex + 1]) {
      season = toInt(segments[seasonIndex + 1], 1, 1, 500);
    }
    const episodeIndex = segments.findIndex((segment) => segment === "e" || segment === "episode");
    if (episodeIndex >= 0 && segments[episodeIndex + 1]) {
      episode = toInt(segments[episodeIndex + 1], 1, 1, 50000);
    }
  } else if (segments[0] === "movie" || segments[0] === "film") {
    mediaType = "movie";
    idToken = segments[1] || "";
  } else if (segments[0] === "tv" || segments[0] === "series" || segments[0] === "serie") {
    mediaType = "tv";
    idToken = segments[1] || "";
  }

  if (!mediaType || !idToken) {
    return null;
  }
  const decoded = decodeMovixId(idToken);
  const tmdbId = toInt(decoded || idToken, 0, 0, 999999999);
  if (tmdbId <= 0) {
    return null;
  }
  return {
    provider: "movix",
    mediaType,
    tmdbId,
    season,
    episode,
    isAnime,
    detailUrl: parsed.href,
  };
}

function isNoctaHost(host) {
  const safe = String(host || "").toLowerCase();
  if (!safe) {
    return false;
  }
  return safe === NOCTA_HOST || safe.endsWith(`.${NOCTA_HOST}`);
}

function parseNoctaExternalKey(value) {
  const raw = String(value || "").trim();
  if (!raw.startsWith("nocta:")) {
    return null;
  }
  const parts = raw.split(":").filter(Boolean);
  if (parts.length < 3) {
    return null;
  }
  const mediaType = parts[1] === "tv" ? "tv" : "movie";
  const slug = parts.slice(2).join(":").trim();
  if (!slug) {
    return null;
  }
  return { mediaType, slug, key: raw };
}

function parseNoctaUrl(input) {
  const raw = String(input || "").trim();
  if (!raw) {
    return null;
  }
  let parsed = null;
  try {
    parsed = new URL(raw, NOCTA_BASE);
  } catch {
    return null;
  }
  if (!isNoctaHost(parsed.hostname)) {
    return null;
  }
  const pathName = String(parsed.pathname || "").replace(/\/+$/, "");
  const match = pathName.match(/\/(movie|movies|film|films|serie|series|tv|show)\/([^/?#]+)/i);
  if (!match) {
    return null;
  }
  const typeToken = String(match[1] || "").toLowerCase();
  const slug = String(match[2] || "").trim();
  if (!slug) {
    return null;
  }
  const mediaType = /serie|series|tv|show/.test(typeToken) ? "tv" : "movie";
  return {
    provider: "nocta",
    mediaType,
    slug,
    detailUrl: parsed.href,
  };
}

function resolveNoctaForcedUrl(title, tmdbId = 0, mediaId = 0) {
  if (tmdbId > 0 && NOCTA_FORCE_TMDB_IDS.has(tmdbId)) {
    return NOCTA_FORCE_OVERRIDES.get("scream 7") || "";
  }
  if (mediaId > 0 && NOCTA_FORCE_MEDIA_IDS.has(mediaId)) {
    return NOCTA_FORCE_OVERRIDES.get("scream 7") || "";
  }
  const key = normalizeTitleKey(title || "");
  if (!key) {
    return "";
  }
  return NOCTA_FORCE_OVERRIDES.get(key) || "";
}

function isScream7Target(title, tmdbId = 0, mediaId = 0) {
  if (tmdbId > 0 && NOCTA_FORCE_TMDB_IDS.has(tmdbId)) {
    return true;
  }
  if (mediaId > 0 && NOCTA_FORCE_MEDIA_IDS.has(mediaId)) {
    return true;
  }
  const key = normalizeTitleKey(title || "");
  return key === "scream 7" || key === "scream 7 2026";
}

function isBanlieusards3Target(title) {
  const key = normalizeTitleKey(title || "");
  return key === "banlieusards 3" || key === "banlieusards iii";
}

function isCarsQuatreRouesTarget(title, tmdbId = 0) {
  if (tmdbId === 920) {
    return true;
  }
  const key = normalizeTitleKey(title || "");
  if (!key) {
    return false;
  }
  if (key === "cars quatre roues" || key === "cars 4 roues") {
    return true;
  }
  return /\bcars\b/.test(key) && /\b(4|quatre)\b/.test(key) && /\broues\b/.test(key);
}

function cleanNoctaTitle(raw) {
  const value = String(raw || "").replace(/\s+/g, " ").trim();
  if (!value) {
    return "";
  }
  let next = value;
  next = next.replace(/\s*[–-]\s*Film.+$/i, "");
  next = next.replace(/\s*\|\s*Noctaflix.+$/i, "");
  next = next.replace(/\s*-\s*Noctaflix.+$/i, "");
  return next.trim() || value;
}

function extractNoctaTitle(html) {
  const metaTitle = extractMetaContent(html, "og:title") || extractMetaContent(html, "twitter:title");
  const titleTag = extractTagText(html, "title");
  return cleanNoctaTitle(decodeHtmlEntities(metaTitle || titleTag || ""));
}

function extractNoctaDescription(html) {
  const metaDesc = extractMetaContent(html, "og:description") || extractMetaContent(html, "description");
  return decodeHtmlEntities(String(metaDesc || "")).replace(/\s+/g, " ").trim();
}

function extractNoctaPoster(html) {
  const meta = extractMetaContent(html, "og:image") || extractMetaContent(html, "twitter:image");
  return String(meta || "").trim();
}

function extractNoctaSnapshot(html) {
  const body = String(html || "");
  const match = body.match(/wire:snapshot=\"([^\"]+)\"/i) || body.match(/wire:snapshot='([^']+)'/i);
  if (!match?.[1]) {
    return null;
  }
  const decoded = decodeHtmlEntities(match[1]);
  return parseJsonSafe(decoded);
}

function isLivewireMarker(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 1 && value.s);
}

function stripLivewireMarkers(value) {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((entry) => stripLivewireMarkers(entry))
      .filter((entry) => entry !== null && !isLivewireMarker(entry));
    if (cleaned.length === 1) {
      return cleaned[0];
    }
    return cleaned;
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  if (isLivewireMarker(value)) {
    return null;
  }
  const next = {};
  for (const [key, entry] of Object.entries(value)) {
    if (key === "s" && Object.keys(value).length === 1) {
      continue;
    }
    const cleaned = stripLivewireMarkers(entry);
    if (cleaned !== null) {
      next[key] = cleaned;
    }
  }
  return next;
}

function extractNoctaVideos(html) {
  const snapshot = extractNoctaSnapshot(html);
  if (!snapshot || typeof snapshot !== "object") {
    return [];
  }
  const data = snapshot.data || snapshot?.effects?.data || {};
  const raw = stripLivewireMarkers(data?.videos ?? data?.video ?? data?.sources ?? null);
  if (!raw) {
    return [];
  }
  const collected = [];
  const visit = (node) => {
    if (!node) {
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node === "object") {
      if (node.link || node.url || node.src) {
        collected.push(node);
      } else {
        Object.values(node).forEach(visit);
      }
    }
  };
  visit(raw);
  return collected;
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
  if (value === true || value === 1) {
    return "pending";
  }
  if (value === false || value === 0) {
    return "unknown";
  }
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
    raw.includes("suggest") ||
    raw.includes("miseenligne") ||
    raw.includes("pasencoreenligne") ||
    raw.includes("nondisponible") ||
    raw.includes("indisponible") ||
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

function getGateHeaderToken(req) {
  const raw = req.headers["x-zenix-gate"];
  const header = Array.isArray(raw) ? String(raw[0] || "") : String(raw || "");
  return sanitizeToken(header, 2048);
}

function getGateToken(req) {
  const cookieToken = getGateCookie(req);
  if (cookieToken) {
    return cookieToken;
  }
  return getGateHeaderToken(req);
}

function cleanSearchTitle(value) {
  let title = String(value || "").trim();
  if (!title) {
    return "";
  }
  title = title
    .replace(/\((?:19|20)\d{2}\)/g, " ")
    .replace(/\b(?:19|20)\d{2}\b/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
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
    safeHost === FILMER2_HOST ||
    safeHost.endsWith(`.${FILMER2_HOST}`) ||
    safeHost === NOCTA_HOST ||
    safeHost.endsWith(`.${NOCTA_HOST}`) ||
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
    external_provider: ZENIX_EXTERNAL_PROVIDER,
    external_key: rawKey,
    external_tmdb_id: tmdbId,
    external_year: year,
    external_season: 0,
    external_episode: 0,
    external_language: "VF",
    external_detail_url: "",
    external_label: ZENIX_BRAND_LABEL,
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

function getSupplementalAvailabilityPriority(value) {
  const normalized = normalizeNakiosAvailabilityStatus(value || "");
  if (normalized === "available") {
    return 2;
  }
  if (normalized === "pending") {
    return 1;
  }
  return 0;
}

function isFilmer2Url(url) {
  const raw = String(url || "").trim();
  if (!raw) {
    return false;
  }
  try {
    const parsed = new URL(raw, FILMER2_BASE);
    return String(parsed.hostname || "").toLowerCase().endsWith(FILMER2_HOST);
  } catch {
    return false;
  }
}

function toAbsoluteFilmer2Url(url, baseUrl) {
  const raw = String(url || "").trim();
  if (!raw) {
    return "";
  }
  try {
    return new URL(raw, baseUrl || FILMER2_BASE).href;
  } catch {
    return raw;
  }
}

function extractFilmer2Title(html) {
  const h1Match = String(html || "").match(/<h1[^>]*itemprop=["']name["'][^>]*>([^<]+)<\/h1>/i);
  if (h1Match?.[1]) {
    return String(h1Match[1]).replace(/\s+/g, " ").trim();
  }
  const titleMatch = String(html || "").match(/<h1[^>]*class=["']title["'][^>]*>([^<]+)<\/h1>/i);
  if (titleMatch?.[1]) {
    return String(titleMatch[1]).replace(/\s+/g, " ").trim();
  }
  const metaTitle = extractMetaContent(html, "og:title") || extractMetaContent(html, "twitter:title");
  return String(metaTitle || "").replace(/\s+/g, " ").trim();
}

function extractFilmer2Description(html) {
  const match = String(html || "").match(/<div[^>]*itemprop=["']description["'][^>]*>([\s\S]*?)<\/div>/i);
  if (match?.[1]) {
    return String(match[1]).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const metaDesc = extractMetaContent(html, "og:description") || extractMetaContent(html, "description");
  return String(metaDesc || "").replace(/\s+/g, " ").trim();
}

function extractFilmer2Poster(html) {
  const match = String(html || "").match(/<img[^>]*itemprop=["']image["'][^>]*src=["']([^"']+)["']/i);
  if (match?.[1]) {
    return String(match[1]).trim();
  }
  return extractMetaContent(html, "og:image") || extractMetaContent(html, "twitter:image") || "";
}

function extractFilmer2Backdrop(html) {
  const match = String(html || "").match(/background-image:\s*url\(([^)]+)\)/i);
  if (match?.[1]) {
    return String(match[1]).replace(/['"]/g, "").trim();
  }
  return "";
}

function extractFilmer2Sources(html, detailUrl) {
  const body = String(html || "");
  const urls = new Set();
  const sourceRegex = /<source[^>]+src=["']([^"']+)["']/gi;
  let match = sourceRegex.exec(body);
  while (match) {
    const value = String(match[1] || "").trim();
    if (value) {
      urls.add(toAbsoluteFilmer2Url(value, detailUrl));
    }
    match = sourceRegex.exec(body);
  }

  const playerRegex = /player\.src\(\s*\{\s*src:\s*["']([^"']+)["']/gi;
  match = playerRegex.exec(body);
  while (match) {
    const value = String(match[1] || "").trim();
    if (value) {
      urls.add(toAbsoluteFilmer2Url(value, detailUrl));
    }
    match = playerRegex.exec(body);
  }

  return Array.from(urls).filter(Boolean);
}

function extractFilmer2Seasons(html) {
  const body = String(html || "");
  const seasons = [];
  const seasonRegex = /<ul[^>]*class=["']episodes["'][^>]*data-season=["'](\d+)["'][^>]*>([\s\S]*?)<\/ul>/gi;
  let match = seasonRegex.exec(body);
  while (match) {
    const seasonNumber = Number(match[1] || 0);
    const listBody = match[2] || "";
    if (!seasonNumber) {
      match = seasonRegex.exec(body);
      continue;
    }
    const episodeRegex = /<li[^>]*>\s*<a[^>]*>([^<]+)<\/a>/gi;
    const episodes = [];
    let epMatch = episodeRegex.exec(listBody);
    let episodeIndex = 1;
    while (epMatch) {
      const label = String(epMatch[1] || "").replace(/\s+/g, " ").trim();
      if (label) {
        const parsedNumberMatch = label.match(/Episode\s*(\d+)/i);
        const episodeNumber = parsedNumberMatch ? Number(parsedNumberMatch[1]) : episodeIndex;
        episodes.push({
          episode: episodeNumber,
          name: label,
          runtime: 0,
          airDate: "",
          isSoon: false,
        });
        episodeIndex += 1;
      }
      epMatch = episodeRegex.exec(listBody);
    }
    if (episodes.length > 0) {
      seasons.push({ season: seasonNumber, episodes });
    }
    match = seasonRegex.exec(body);
  }
  return seasons.sort((a, b) => a.season - b.season);
}

async function fetchFilmer2Detail(detailUrl) {
  const safeUrl = String(detailUrl || "").trim();
  if (!safeUrl || !isFilmer2Url(safeUrl)) {
    return null;
  }
  const cached = filmer2DetailCache.get(safeUrl);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }
  const response = await fetchRemoteText(safeUrl, "text/html", FILMER2_FETCH_HEADERS);
  if (response.status < 200 || response.status >= 300) {
    return null;
  }
  const html = response.body || "";
  const title = extractFilmer2Title(html);
  if (!title) {
    return null;
  }
  const year = toInt(parseYearFromText(title), 0, 0, 2099);
  const poster = extractFilmer2Poster(html);
  const backdrop = extractFilmer2Backdrop(html);
  const description = extractFilmer2Description(html);
  const sources = extractFilmer2Sources(html, safeUrl);
  const seasons = extractFilmer2Seasons(html);
  const detail = {
    url: safeUrl,
    title,
    year,
    poster,
    backdrop,
    description,
    sources,
    seasons,
  };
  filmer2DetailCache.set(safeUrl, {
    expiresAt: Date.now() + FILMER2_DETAIL_CACHE_MS,
    value: detail,
  });
  return detail;
}
async function resolveFilmer2DetailByTitle(title, mediaType, year = 0) {
  const safeTitle = String(title || "").trim();
  if (safeTitle.length < 2) {
    return null;
  }
  const queryKey = normalizeTitleKey(safeTitle);
  if (!queryKey) {
    return null;
  }
  const normalizedType = mediaType === "tv" ? "tv" : mediaType === "movie" ? "movie" : "";
  let rows = [];
  try {
    rows = await loadFilmer2CatalogEntries();
  } catch {
    rows = [];
  }
  const candidates = Array.isArray(rows)
    ? rows
        .filter((row) => {
          if (!row) {
            return false;
          }
          if (normalizedType) {
            const rowType = normalizeSupplementalMediaType(row?.type || row?.mediaType || "");
            if (rowType !== normalizedType) {
              return false;
            }
          }
          const titleKey = normalizeTitleKey(row?.title || "");
          return Boolean(titleKey) && (titleKey.includes(queryKey) || queryKey.includes(titleKey));
        })
        .map((row) => ({
          title: row?.title || "",
          type: row?.type || "movie",
          year: row?.external_year || row?.year || 0,
          url: row?.external_detail_url || row?.externalDetailUrl || "",
        }))
        .filter((row) => row.title && row.url)
    : [];
  if (candidates.length === 0) {
    return null;
  }
  const scored = candidates
    .map((row) => ({
      row,
      score: scoreFilmer2SearchEntry(row, queryKey, normalizedType, year),
    }))
    .sort((left, right) => right.score - left.score);
  const best = scored[0]?.row || null;
  if (!best || !best.url) {
    return null;
  }
  return fetchFilmer2Detail(best.url);
}

async function loadFilmer2CatalogEntries(force = false) {
  const now = Date.now();
  if (
    !force &&
    filmer2CatalogCache.loadedAt > 0 &&
    now - filmer2CatalogCache.loadedAt < FILMER2_CATALOG_CACHE_MS &&
    Array.isArray(filmer2CatalogCache.entries) &&
    filmer2CatalogCache.entries.length > 0
  ) {
    return filmer2CatalogCache.entries;
  }
  if (filmer2CatalogCache.inFlight) {
    return filmer2CatalogCache.inFlight;
  }

  const task = (async () => {
    const response = await fetchRemoteText(FILMER2_BASE, "text/html", FILMER2_FETCH_HEADERS);
    if (response.status < 200 || response.status >= 300) {
      return [];
    }
    const html = response.body || "";
    const linkRegex = /href=["']((?:movie|tv)\/[^"']+\.html)["']/gi;
    const links = new Set();
    let match = linkRegex.exec(html);
    while (match) {
      const href = String(match[1] || "").trim();
      if (href) {
        links.add(toAbsoluteFilmer2Url(href, FILMER2_BASE));
      }
      match = linkRegex.exec(html);
    }
    const detailUrls = Array.from(links);
    if (detailUrls.length === 0) {
      return [];
    }

    const reservedIds = new Set();
    const entries = await mapWithConcurrency(detailUrls, Math.min(6, detailUrls.length), async (url) => {
      const detail = await fetchFilmer2Detail(url);
      if (!detail) {
        return null;
      }
      const type = /\/tv\//i.test(url) ? "tv" : "movie";
      const rawKey = `filmer2:${type}:${normalizeTitleKey(detail.title)}`;
      const releaseDate = detail.year ? `${detail.year}-01-01` : "";
      const availability = detail.sources.length > 0 ? "available" : "pending";
      const row = mapSupplementalCandidateToCatalogRow(
        {
          provider: ZENIX_EXTERNAL_PROVIDER,
          providerLabel: ZENIX_BRAND_LABEL,
          rawKey,
          title: detail.title,
          year: detail.year,
          mediaType: type,
          release_date: releaseDate,
          poster: detail.poster,
          backdrop: detail.backdrop,
          detailUrl: detail.url,
          language: "VF",
        },
        reservedIds
      );
      if (!row) {
        return null;
      }
      row.external_detail_url = detail.url;
      row.external_label = ZENIX_BRAND_LABEL;
      row.availability_status = availability;
      row.external_status = availability;
      row.is_pending_upload = availability === "pending";
      row.supplemental_rank = scoreSupplementalCandidate(row);
      row.supplemental_date = releaseDate || row.supplemental_date || "";
      return row;
    });

    const filtered = entries.filter(Boolean);
    filmer2CatalogCache.entries = filtered;
    filmer2CatalogCache.loadedAt = Date.now();
    filmer2CatalogCache.inFlight = null;
    return filtered;
  })();

  filmer2CatalogCache.inFlight = task;
  try {
    return await task;
  } finally {
    filmer2CatalogCache.inFlight = null;
  }
}

function buildFastfluxApiUrl(route, params = {}) {
  if (!FASTFLUX_API_KEY) {
    return "";
  }
  const safeRoute = String(route || "").trim();
  if (!safeRoute) {
    return "";
  }
  const search = new URLSearchParams({ route: safeRoute, api_key: FASTFLUX_API_KEY });
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    const text = String(value).trim();
    if (!text) {
      return;
    }
    search.set(key, text);
  });
  return `${FASTFLUX_API_BASE}?${search.toString()}`;
}

function extractFastfluxRows(payload) {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  return [];
}

async function fetchFastfluxPage(route, page = 1, options = {}) {
  if (!USE_FASTFLUX) {
    return { items: [], pagination: null };
  }
  const target = buildFastfluxApiUrl(route, { page: String(page || 1), ...(options || {}) });
  if (!target) {
    return { items: [], pagination: null };
  }
  const response = await fetchRemoteWithTimeout(target, FASTFLUX_FETCH_HEADERS, FASTFLUX_SOURCE_REMOTE_TIMEOUT_MS);
  if (response.status < 200 || response.status >= 300) {
    return { items: [], pagination: null };
  }
  const payload = parseJsonSafe(response.body);
  return {
    items: extractFastfluxRows(payload),
    pagination: payload?.pagination || null,
  };
}

function parseFastfluxSeasonNumber(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return 0;
  }
  const match = raw.match(/S?(\d+)/i);
  if (!match) {
    return toInt(raw, 0, 0, 500);
  }
  return toInt(match[1], 0, 0, 500);
}

function parseFastfluxEpisodeNumber(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return 0;
  }
  const match = raw.match(/E?(\d+)/i);
  if (!match) {
    return toInt(raw, 0, 0, 50000);
  }
  return toInt(match[1], 0, 0, 50000);
}

function normalizeFastfluxQuality(value) {
  const raw = sanitizeToken(String(value || ""), 24);
  if (!raw || /unknown/i.test(raw)) {
    return "HD";
  }
  return raw;
}

const SOURCE_PROBE_CACHE = new Map();
const SOURCE_PROBE_TTL_MS = 6 * 60 * 1000;
const SOURCE_PROBE_TIMEOUT_MS = 4200;
const SOURCE_PROBE_MAX_PER_REQUEST = 4;
const SOURCE_PROXY_AVOID_HOSTS = new Set(["r1.fsvid.lol"]);

function normalizeHostName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
}

function shouldAvoidProxyTarget(host) {
  return SOURCE_PROXY_AVOID_HOSTS.has(normalizeHostName(host));
}

function extractProxyTargetUrl(rawUrl) {
  const input = String(rawUrl || "").trim();
  if (!input) {
    return "";
  }
  let parsed;
  try {
    parsed = new URL(input, "http://localhost");
  } catch {
    return input;
  }
  const pathname = String(parsed.pathname || "");
  if (pathname === "/api/hls-proxy" || pathname === "/api/hls-proxy-mobile") {
    const targetParam = parsed.searchParams.get("url");
    if (targetParam) {
      return targetParam;
    }
  }
  return input;
}

function buildProbeHeadersForHost(host) {
  const normalizedHost = normalizeHostName(host);
  const headers = {
    Accept: "*/*",
    "User-Agent": DEFAULT_BROWSER_UA,
    "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
  };
  if (normalizedHost.endsWith("fastflux.xyz") || normalizedHost.endsWith("cdn.fastflux.xyz")) {
    headers.Referer = `${FASTFLUX_BASE}/`;
    headers.Origin = FASTFLUX_BASE;
    return headers;
  }
  if (normalizedHost.endsWith("purstream.cc") || normalizedHost.endsWith("purstream.co") || normalizedHost.endsWith("fsvid.lol")) {
    headers.Referer = `${PURSTREAM_WEB_BASE}/`;
    headers.Origin = PURSTREAM_WEB_BASE;
    return headers;
  }
  if (normalizedHost.endsWith("nakios.site")) {
    headers.Referer = "https://nakios.site/";
    headers.Origin = "https://nakios.site";
    return headers;
  }
  return headers;
}

function classifyProbeResult(url, status, contentType) {
  const safeStatus = Number(status || 0);
  const type = String(contentType || "").toLowerCase();
  const hasMediaExt = /\.(m3u8|mp4|webm|mpd)(?:$|\?)/i.test(String(url || ""));
  if (safeStatus === 404) {
    return "invalid";
  }
  if (safeStatus === 403 || safeStatus === 429) {
    return "unknown";
  }
  if (safeStatus >= 400) {
    return "invalid";
  }
  if (type.includes("text/html") && !hasMediaExt) {
    return "invalid";
  }
  if (type.includes("application/json") && !hasMediaExt) {
    return "invalid";
  }
  if (
    type.includes("video/") ||
    type.includes("mpegurl") ||
    type.includes("vnd.apple.mpegurl") ||
    type.includes("octet-stream")
  ) {
    return "ok";
  }
  if (hasMediaExt) {
    return "ok";
  }
  return "unknown";
}

async function probeStreamUrl(rawUrl) {
  const targetRaw = extractProxyTargetUrl(rawUrl);
  const parsed = parseSafeRemoteUrl(targetRaw);
  if (!parsed) {
    return { status: "invalid" };
  }
  const cacheKey = parsed.href;
  const cached = SOURCE_PROBE_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SOURCE_PROBE_TIMEOUT_MS);
  let result = { status: "unknown" };
  try {
    const headers = buildProbeHeadersForHost(parsed.hostname || "");
    let response = await fetchWithManualRedirect(
      parsed.href,
      {
        method: "HEAD",
        headers,
        signal: controller.signal,
      },
      2
    );
    let status = Number(response?.status || 0);
    let contentType = String(response?.headers?.get("content-type") || "");
    if (status === 405 || status === 403 || status === 429 || !contentType) {
      const rangedHeaders = {
        ...headers,
        Range: "bytes=0-1",
      };
      response = await fetchWithManualRedirect(
        parsed.href,
        {
          method: "GET",
          headers: rangedHeaders,
          signal: controller.signal,
        },
        2
      );
      status = Number(response?.status || 0);
      contentType = String(response?.headers?.get("content-type") || "");
    }
    result = { status: classifyProbeResult(parsed.href, status, contentType) };
  } catch {
    result = { status: "unknown" };
  } finally {
    clearTimeout(timeoutId);
  }
  SOURCE_PROBE_CACHE.set(cacheKey, { result, expiresAt: Date.now() + SOURCE_PROBE_TTL_MS });
  return result;
}

function buildProxyFallbackSource(source) {
  const rawUrl = String(source?.stream_url || source?.url || "").trim();
  if (!/^https?:\/\//i.test(rawUrl)) {
    return null;
  }
  if (/\/api\/hls-proxy(?:-mobile)?\?url=/i.test(rawUrl)) {
    return null;
  }
  try {
    const host = new URL(rawUrl).hostname || "";
    if (shouldAvoidProxyTarget(host)) {
      return null;
    }
  } catch {
    return null;
  }
  const proxiedUrl = buildHlsProxyPath(rawUrl);
  if (!proxiedUrl) {
    return null;
  }
  return {
    ...source,
    stream_url: proxiedUrl,
    proxyOnly: true,
  };
}

function buildDirectSourceEntry(url, options = {}) {
  const safeUrl = sanitizeHttpUrl(url, 900);
  if (!safeUrl) {
    return null;
  }
  const format = inferOwnedSourceFormat(safeUrl, options?.format || "");
  let streamUrl = safeUrl;
  let host = "";
  try {
    host = new URL(safeUrl).hostname.toLowerCase();
  } catch {
    host = "";
  }
  const avoidProxy = host ? shouldAvoidProxyTarget(host) : false;
  const needsProxy = !avoidProxy && format !== "embed";
  if (needsProxy) {
    streamUrl = buildHlsProxyPath(safeUrl);
  }
  return {
    stream_url: streamUrl,
    source_name: String(options?.sourceName || "URL Directe").trim() || "URL Directe",
    origin: "direct",
    quality: String(options?.quality || "HD").trim() || "HD",
    language: String(options?.language || "VF").trim() || "VF",
    format,
    proxyOnly: needsProxy,
    priority: Number.isFinite(options?.priority) ? Number(options.priority) : 520,
  };
}

async function filterSourcesWithProbe(sources = []) {
  if (!Array.isArray(sources) || sources.length === 0) {
    return sources;
  }
  const results = [];
  let probes = 0;
  for (const source of sources) {
    if (!source) {
      continue;
    }
    const url = String(source?.stream_url || source?.url || "").trim();
    if (!url) {
      continue;
    }
    const probeTarget = extractProxyTargetUrl(url) || url;
    let probeHost = "";
    try {
      probeHost = new URL(probeTarget).hostname.toLowerCase();
    } catch {
      probeHost = "";
    }
    if (
      probeHost.endsWith("fastflux.xyz") ||
      probeHost.endsWith("cdn.fastflux.xyz") ||
      /purstream|xalaflix|fsvid/i.test(probeHost) ||
      String(source?.origin || "").toLowerCase() === "purstream"
    ) {
      results.push(source);
      continue;
    }
    const format = inferOwnedSourceFormat(url, source?.format || "");
    if (format === "embed") {
      results.push(source);
      continue;
    }
    if (probes >= SOURCE_PROBE_MAX_PER_REQUEST) {
      results.push(source);
      continue;
    }
    probes += 1;
    const verdict = await probeStreamUrl(url);
    if (verdict?.status === "invalid") {
      const fallback = buildProxyFallbackSource(source);
      if (fallback) {
        results.push(fallback);
      }
      continue;
    }
    results.push(source);
  }
  return results.length > 0 ? results : sources;
}

function buildFastfluxSourceEntry(sourceRow, index = 0) {
  if (!sourceRow || typeof sourceRow !== "object") {
    return null;
  }
  const rawStreamUrl = String(sourceRow?.url || sourceRow?.stream_url || "").trim();
  if (!rawStreamUrl) {
    return null;
  }
  const formatHint = String(sourceRow?.type || sourceRow?.format || "").trim();
  const originalFormat = inferOwnedSourceFormat(rawStreamUrl, formatHint || "mp4");
  const streamUrl = rewriteFastfluxCdnUrl(rawStreamUrl);
  let fastfluxHost = "";
  try {
    fastfluxHost = new URL(streamUrl).hostname.toLowerCase();
  } catch {
    fastfluxHost = "";
  }
  const isFastfluxHost =
    fastfluxHost.endsWith("fastflux.xyz") || fastfluxHost.endsWith("cdn.fastflux.xyz");
  const language = normalizePidoovLanguage(sourceRow?.language || sourceRow?.lang || "") || "VF";
  const quality = normalizeFastfluxQuality(sourceRow?.quality || sourceRow?.qlt || "");
  const format = originalFormat === "unknown" ? inferOwnedSourceFormat(streamUrl, formatHint || "mp4") : originalFormat;
  const isAlreadyProxied = /\/api\/hls-proxy(?:-mobile)?\?url=/i.test(streamUrl);
  const isEmbed = format === "embed";
  const looksHls = format === "hls" || /\.m3u8($|[?#])/i.test(streamUrl) || /hls/i.test(formatHint);
  const looksDirect =
    format === "mp4" ||
    format === "webm" ||
    format === "dash" ||
    /\.(mp4|webm|mpd)(?:$|[?#])/i.test(streamUrl);
  let needsProxy = looksHls || isFastfluxHost;
  if (isEmbed) {
    needsProxy = false;
  }
  const forceProxyHost = fastfluxHost === "s1.fsvid.lol";
  const allowDirect = Boolean(looksDirect && !forceProxyHost);
  const proxyPreferred = true;
  const finalUrl = isAlreadyProxied ? streamUrl : needsProxy ? buildHlsProxyPath(streamUrl) : streamUrl;
  return {
    stream_url: finalUrl,
    source_name: "FastFlux",
    origin: "fastflux",
    quality,
    language,
    format,
    proxyOnly: needsProxy && !allowDirect,
    allowDirect,
    proxyPreferred,
    priority:
      (language === "VF" ? 392 : language === "MULTI" ? 372 : language === "VOSTFR" ? 360 : 330) -
      Math.min(40, index * 4),
  };
}

function toFastfluxCatalogDetailUrl(mediaType, tmdbId) {
  const safeId = toInt(tmdbId, 0, 0, 999999999);
  if (!safeId) {
    return "";
  }
  const type = mediaType === "tv" ? "series" : "movie";
  return `${FASTFLUX_BASE}/${type}/${safeId}`;
}

function buildFastfluxCatalogRow(entry, mediaType, fallbackIdSet) {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const safeType = mediaType === "tv" ? "tv" : "movie";
  const tmdbId = toInt(entry?.tmdb_id || entry?.tmdbId, 0, 0, 999999999);
  const title = String(entry?.title || entry?.series_name || entry?.name || "").trim();
  if (!title) {
    return null;
  }
  const year = toInt(entry?.year, 0, 0, 2099);
  const poster = String(entry?.poster || "").trim();
  const addedAt = String(entry?.added_at || entry?.latest_added || entry?.created_at || "").trim();
  const releaseDate = toIsoDate(addedAt) || (year ? `${year}-01-01` : "");
  const rawKey = `fastflux:${safeType}:${tmdbId || normalizeTitleKey(title)}`;
  const availability = (() => {
    if (safeType === "movie") {
      const src = entry?.source || entry?.sources;
      return src && (src.url || src.stream_url) ? "available" : "unknown";
    }
    const episodes = Array.isArray(entry?.episodes) ? entry.episodes : [];
    return episodes.length > 0 ? "available" : "unknown";
  })();

  const row = mapSupplementalCandidateToCatalogRow(
    {
      provider: "fastflux",
      providerLabel: ZENIX_BRAND_LABEL,
      rawKey,
      title,
      year,
      mediaType: safeType,
      release_date: releaseDate,
      poster,
      backdrop: poster,
      detailUrl: toFastfluxCatalogDetailUrl(safeType, tmdbId),
      language: normalizePidoovLanguage(entry?.source?.language || entry?.language || "") || "VF",
    },
    fallbackIdSet
  );
  if (!row) {
    return null;
  }
  row.external_tmdb_id = tmdbId;
  row.availability_status = availability;
  row.external_status = availability;
  row.is_pending_upload = availability !== "available";
  row.supplemental_rank = scoreSupplementalCandidate(row);
  row.supplemental_date = releaseDate || row.supplemental_date || "";
  return row;
}

async function loadFastfluxMovies(force = false, options = {}) {
  if (!USE_FASTFLUX) {
    return [];
  }
  const now = Date.now();
  const minPages = Math.max(1, toInt(options?.minPages, 0, 1, FASTFLUX_MOVIES_MAX_PAGES_PER_FEED));
  const targetPages = Math.min(
    FASTFLUX_MOVIES_MAX_PAGES_PER_FEED,
    Math.max(FASTFLUX_MOVIES_PAGES_PER_FEED, minPages)
  );
  if (
    !force &&
    fastfluxMovieCache.loadedAt > 0 &&
    now - fastfluxMovieCache.loadedAt < FASTFLUX_CATALOG_CACHE_MS &&
    Array.isArray(fastfluxMovieCache.entries) &&
    fastfluxMovieCache.entries.length > 0 &&
    Number(fastfluxMovieCache.pagesLoaded || 0) >= targetPages
  ) {
    return fastfluxMovieCache.entries;
  }
  if (fastfluxMovieCache.inFlight) {
    return fastfluxMovieCache.inFlight;
  }

  const task = (async () => {
    const first = await fetchFastfluxPage("movies", 1);
    const totalPages = Math.max(
      1,
      toInt(first.pagination?.total_pages, targetPages, 1, FASTFLUX_MOVIES_MAX_PAGES_PER_FEED)
    );
    const pages = Math.min(targetPages, totalPages);
    const jobs = [];
    for (let page = 2; page <= pages; page += 1) {
      jobs.push(page);
    }
    const rest = jobs.length
      ? await mapWithConcurrency(jobs, Math.min(4, jobs.length), async (page) => fetchFastfluxPage("movies", page))
      : [];
    const rows = [first, ...rest].flatMap((entry) => entry?.items || []);
    const byTmdb = new Map();
    rows.forEach((entry) => {
      const tmdbId = toInt(entry?.tmdb_id || entry?.tmdbId, 0, 0, 999999999);
      if (!tmdbId) {
        return;
      }
      if (!byTmdb.has(tmdbId)) {
        byTmdb.set(tmdbId, entry);
        return;
      }
      const current = byTmdb.get(tmdbId);
      const currentHasSource = Boolean(current?.source?.url || current?.source?.stream_url);
      const nextHasSource = Boolean(entry?.source?.url || entry?.source?.stream_url);
      if (!currentHasSource && nextHasSource) {
        byTmdb.set(tmdbId, entry);
      }
    });
    const entries = Array.from(byTmdb.values());
    fastfluxMovieCache.entries = entries;
    fastfluxMovieCache.loadedAt = Date.now();
    fastfluxMovieCache.pagesLoaded = pages;
    fastfluxMovieCache.totalPages = totalPages;
    fastfluxMovieCache.map = byTmdb;
    fastfluxMovieCache.inFlight = null;
    return entries;
  })();

  fastfluxMovieCache.inFlight = task;
  try {
    return await task;
  } finally {
    fastfluxMovieCache.inFlight = null;
  }
}

async function loadFastfluxSeries(force = false, options = {}) {
  if (!USE_FASTFLUX) {
    return [];
  }
  const now = Date.now();
  const minPages = Math.max(1, toInt(options?.minPages, 0, 1, FASTFLUX_SERIES_MAX_PAGES_PER_FEED));
  const targetPages = Math.min(
    FASTFLUX_SERIES_MAX_PAGES_PER_FEED,
    Math.max(FASTFLUX_SERIES_PAGES_PER_FEED, minPages)
  );
  if (
    !force &&
    fastfluxSeriesCache.loadedAt > 0 &&
    now - fastfluxSeriesCache.loadedAt < FASTFLUX_CATALOG_CACHE_MS &&
    Array.isArray(fastfluxSeriesCache.entries) &&
    fastfluxSeriesCache.entries.length > 0 &&
    Number(fastfluxSeriesCache.pagesLoaded || 0) >= targetPages
  ) {
    return fastfluxSeriesCache.entries;
  }
  if (fastfluxSeriesCache.inFlight) {
    return fastfluxSeriesCache.inFlight;
  }

  const task = (async () => {
    const first = await fetchFastfluxPage("series", 1);
    const totalPages = Math.max(
      1,
      toInt(first.pagination?.total_pages, targetPages, 1, FASTFLUX_SERIES_MAX_PAGES_PER_FEED)
    );
    const pages = Math.min(targetPages, totalPages);
    const jobs = [];
    for (let page = 2; page <= pages; page += 1) {
      jobs.push(page);
    }
    const rest = jobs.length
      ? await mapWithConcurrency(jobs, Math.min(3, jobs.length), async (page) => fetchFastfluxPage("series", page))
      : [];
    const rows = [first, ...rest].flatMap((entry) => entry?.items || []);
    const byTmdb = new Map();
    rows.forEach((entry) => {
      const tmdbId = toInt(entry?.tmdb_id || entry?.tmdbId, 0, 0, 999999999);
      if (!tmdbId) {
        return;
      }
      if (!byTmdb.has(tmdbId)) {
        byTmdb.set(tmdbId, entry);
        return;
      }
      const current = byTmdb.get(tmdbId);
      const currentEpisodes = Array.isArray(current?.episodes) ? current.episodes.length : 0;
      const nextEpisodes = Array.isArray(entry?.episodes) ? entry.episodes.length : 0;
      if (nextEpisodes > currentEpisodes) {
        byTmdb.set(tmdbId, entry);
      }
    });
    const entries = Array.from(byTmdb.values());
    fastfluxSeriesCache.entries = entries;
    fastfluxSeriesCache.loadedAt = Date.now();
    fastfluxSeriesCache.pagesLoaded = pages;
    fastfluxSeriesCache.totalPages = totalPages;
    fastfluxSeriesCache.map = byTmdb;
    fastfluxSeriesCache.inFlight = null;
    return entries;
  })();

  fastfluxSeriesCache.inFlight = task;
  try {
    return await task;
  } finally {
    fastfluxSeriesCache.inFlight = null;
  }
}

async function loadFastfluxCatalogEntries(force = false, options = {}) {
  if (!USE_FASTFLUX) {
    return [];
  }
  const [movies, series] = await Promise.all([
    loadFastfluxMovies(force, { minPages: options?.minPages || 0 }),
    loadFastfluxSeries(force, { minPages: options?.minPages || 0 }),
  ]);
  const reservedIds = new Set();
  const rows = [];
  movies.forEach((entry) => {
    const row = buildFastfluxCatalogRow(entry, "movie", reservedIds);
    if (row) {
      rows.push(row);
    }
  });
  series.forEach((entry) => {
    const row = buildFastfluxCatalogRow(entry, "tv", reservedIds);
    if (row) {
      rows.push(row);
    }
  });
  return rows;
}

function scoreFastfluxSearchEntry(entry, queryKey, mediaType, safeYear) {
  if (!entry) {
    return -Infinity;
  }
  const rowTitle = String(entry?.title || entry?.series_name || entry?.name || "").trim();
  const rowKey = normalizeTitleKey(rowTitle);
  const rowYear = toInt(entry?.year, 0, 0, 2099);
  let score = 0;
  if (rowKey === queryKey) {
    score += 140;
  } else if (rowKey.includes(queryKey) || queryKey.includes(rowKey)) {
    score += 85;
  } else if (rowKey && queryKey && rowKey[0] === queryKey[0]) {
    score += 30;
  }
  if (mediaType) {
    const type = String(entry?.type || entry?.media_type || "").toLowerCase();
    const normalized = type === "series" || type === "tv" ? "tv" : "movie";
    if (normalized === mediaType) {
      score += 20;
    }
  }
  if (safeYear > 0 && rowYear > 0) {
    const diff = Math.abs(rowYear - safeYear);
    if (diff === 0) {
      score += 55;
    } else if (diff === 1) {
      score += 30;
    } else if (diff <= 2) {
      score += 10;
    } else {
      score -= diff * 3;
    }
  }
  if (entry?.poster) {
    score += 10;
  }
  return score;
}

function buildTmdbImageUrl(path, size = "w600_and_h900_bestv2") {
  const safe = String(path || "").trim();
  if (!safe) {
    return "";
  }
  const normalized = safe.startsWith("/") ? safe : `/${safe}`;
  return `${TMDB_IMAGE_BASE}/${size}${normalized}`;
}

function extractTmdbYear(dateString) {
  const raw = String(dateString || "").trim();
  if (!raw) {
    return 0;
  }
  const year = Number.parseInt(raw.slice(0, 4), 10);
  return Number.isFinite(year) ? year : 0;
}

async function searchTmdbCatalog(query, mediaType) {
  if (!TMDB_API_KEY) {
    return [];
  }
  const safeQuery = String(query || "").trim();
  if (safeQuery.length < 2) {
    return [];
  }
  const normalizedType = mediaType === "tv" ? "tv" : "movie";
  const cacheKey = `tmdb:${normalizedType}:${normalizeTitleKey(safeQuery)}`;
  const cached = tmdbSearchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.items || [];
  }
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "fr-FR",
    query: safeQuery,
    include_adult: "false",
  });
  const endpoint = normalizedType === "tv" ? "search/tv" : "search/movie";
  const target = `${TMDB_BASE_URL}/${endpoint}?${params.toString()}`;
  let results = [];
  try {
    const response = await fetchRemote(target, { headers: { "Accept-Language": DEFAULT_ACCEPT_LANGUAGE } });
    const payload = response.status >= 200 && response.status < 300 ? parseJsonSafe(response.body) : null;
    results = Array.isArray(payload?.results) ? payload.results : [];
  } catch {
    results = [];
  }
  const mapped = results
    .map((entry) => {
      const tmdbId = toInt(entry?.id, 0, 0, 999999999);
      const title = String(entry?.title || entry?.name || entry?.original_title || entry?.original_name || "").trim();
      if (!tmdbId || !title) {
        return null;
      }
      const year = extractTmdbYear(entry?.release_date || entry?.first_air_date);
      return {
        title,
        type: normalizedType,
        year,
        poster: buildTmdbImageUrl(entry?.poster_path || "", "w600_and_h900_bestv2"),
        backdrop: buildTmdbImageUrl(entry?.backdrop_path || "", "w1920_and_h1080_bestv2"),
        overview: String(entry?.overview || "").trim(),
        tmdbId,
      };
    })
    .filter(Boolean);
  tmdbSearchCache.set(cacheKey, {
    items: mapped,
    expiresAt: Date.now() + TMDB_SEARCH_CACHE_MS,
  });
  return mapped;
}

function isFastfluxTitleMatch(entry, title, year = 0) {
  const queryKey = normalizeTitleKey(String(title || ""));
  if (!queryKey) {
    return false;
  }
  const rowTitle = String(entry?.title || entry?.series_name || entry?.name || "").trim();
  const rowKey = normalizeTitleKey(rowTitle);
  if (!rowKey) {
    return false;
  }
  if (rowKey !== queryKey) {
    if (year > 0) {
      const rowYear = toInt(entry?.year, 0, 0, 2099);
      if (rowYear > 0 && Math.abs(rowYear - year) <= 1 && rowKey.startsWith(queryKey)) {
        return true;
      }
    }
    return false;
  }
  if (year > 0) {
    const rowYear = toInt(entry?.year, 0, 0, 2099);
    if (rowYear > 0 && Math.abs(rowYear - year) > 1) {
      return false;
    }
  }
  return true;
}

async function searchFastfluxCatalog(query, mediaType) {
  if (!USE_FASTFLUX) {
    return [];
  }
  const safeQuery = String(query || "").trim();
  if (safeQuery.length < 2) {
    return [];
  }
  const normalizedType = mediaType === "tv" ? "tv" : "movie";
  const cacheKey = `fastflux:${normalizedType}:${normalizeTitleKey(safeQuery)}`;
  const cached = fastfluxSearchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.items || [];
  }
  const route = normalizedType === "tv" ? "series/search" : "movies/search";
  const payload = await fetchFastfluxPage(route, 1, { q: safeQuery });
  const items = Array.isArray(payload?.items) ? payload.items : [];
  fastfluxSearchCache.set(cacheKey, {
    items,
    expiresAt: Date.now() + FASTFLUX_SEARCH_CACHE_MS,
  });
  return items;
}

async function resolveFastfluxTmdbIdBySearch(title, mediaType, year = 0) {
  const safeTitle = String(title || "").trim();
  if (safeTitle.length < 2) {
    return 0;
  }
  const normalizedType = mediaType === "tv" ? "tv" : "movie";
  const queryKey = normalizeTitleKey(safeTitle);
  const safeYear = toInt(year, 0, 0, 2099);
  const results = await searchFastfluxCatalog(safeTitle, normalizedType);
  if (!Array.isArray(results) || results.length === 0) {
    return 0;
  }
  const scored = results
    .map((entry) => ({
      entry,
      score: scoreFastfluxSearchEntry(entry, queryKey, normalizedType, safeYear),
    }))
    .sort((left, right) => right.score - left.score);
  const bestEntry = scored[0]?.entry;
  if (!bestEntry || !isFastfluxTitleMatch(bestEntry, safeTitle, safeYear)) {
    return 0;
  }
  return toInt(bestEntry?.tmdb_id || bestEntry?.tmdbId, 0, 0, 999999999);
}

async function resolveFastfluxEntryByTitle(mediaType, title, year = 0) {
  const normalizedType = mediaType === "tv" ? "tv" : "movie";
  const candidateId = await resolveFastfluxTmdbIdBySearch(title, normalizedType, year);
  if (!candidateId) {
    return null;
  }
  if (normalizedType === "movie") {
    let entry = fastfluxMovieCache.map.get(candidateId);
    if (!entry) {
      await loadFastfluxMovies(true, { minPages: FASTFLUX_MOVIES_MAX_PAGES_PER_FEED });
      entry = fastfluxMovieCache.map.get(candidateId);
    }
    if (!entry) {
      const searchRows = await searchFastfluxCatalog(title, normalizedType);
      entry = searchRows.find((row) => toInt(row?.tmdb_id || row?.tmdbId, 0, 0, 999999999) === candidateId) || null;
    }
    return entry || null;
  }
  let entry = fastfluxSeriesCache.map.get(candidateId);
  if (!entry) {
    await loadFastfluxSeries(true, { minPages: FASTFLUX_SERIES_MAX_PAGES_PER_FEED });
    entry = fastfluxSeriesCache.map.get(candidateId);
  }
  if (!entry) {
    const searchRows = await searchFastfluxCatalog(title, normalizedType);
    entry = searchRows.find((row) => toInt(row?.tmdb_id || row?.tmdbId, 0, 0, 999999999) === candidateId) || null;
  }
  return entry || null;
}

function buildFastfluxSeasonsFromEpisodes(episodes) {
  const rows = Array.isArray(episodes) ? episodes : [];
  const bySeason = new Map();
  rows.forEach((episode) => {
    const seasonNumber = parseFastfluxSeasonNumber(episode?.season);
    const episodeNumber = parseFastfluxEpisodeNumber(episode?.episode_number || episode?.episode || episode?.number);
    if (seasonNumber <= 0 || episodeNumber <= 0) {
      return;
    }
    if (!bySeason.has(seasonNumber)) {
      bySeason.set(seasonNumber, []);
    }
    bySeason.get(seasonNumber).push({
      episode: episodeNumber,
      name: `Episode ${episodeNumber}`,
      runtime: 0,
      airDate: "",
      isSoon: false,
    });
  });
  return Array.from(bySeason.entries())
    .map(([season, episodesList]) => ({
      season,
      episodes: episodesList.sort((a, b) => Number(a.episode || 0) - Number(b.episode || 0)),
    }))
    .sort((a, b) => Number(a.season || 0) - Number(b.season || 0));
}

async function resolveFastfluxSeasonsByTmdbId(tmdbId) {
  if (!USE_FASTFLUX) {
    return [];
  }
  const safeId = toInt(tmdbId, 0, 0, 999999999);
  if (!safeId) {
    return [];
  }
  let entry = fastfluxSeriesCache.map.get(safeId);
  if (!entry) {
    await loadFastfluxSeries(true, { minPages: FASTFLUX_SERIES_MAX_PAGES_PER_FEED });
    entry = fastfluxSeriesCache.map.get(safeId);
  }
  if (!entry) {
    return [];
  }
  return buildFastfluxSeasonsFromEpisodes(entry.episodes || []);
}

async function resolveFastfluxSourcesByTmdbId(mediaType, tmdbId, season = 1, episode = 1, options = {}) {
  if (!USE_FASTFLUX) {
    return [];
  }
  const safeTmdbId = toInt(tmdbId, 0, 0, 999999999);
  const normalizedType = mediaType === "tv" ? "tv" : "movie";
  const safeSeason = toInt(season, 1, 1, 500);
  const safeEpisode = toInt(episode, 1, 1, 50000);
  const strictTitle = String(options?.title || "").trim();
  const strictYear = toInt(options?.year, 0, 0, 2099);
  const forceRefresh = Boolean(options?.forceRefresh);
  const allowTitleFallback = safeTmdbId <= 0 && strictTitle.length >= 2;
  let entry = null;
  if (normalizedType === "movie") {
    if (forceRefresh) {
      await loadFastfluxMovies(true, { minPages: FASTFLUX_MOVIES_PAGES_PER_FEED });
    }
    if (safeTmdbId > 0) {
      entry = fastfluxMovieCache.map.get(safeTmdbId);
      if (!entry) {
        await loadFastfluxMovies(true, { minPages: FASTFLUX_MOVIES_MAX_PAGES_PER_FEED });
        entry = fastfluxMovieCache.map.get(safeTmdbId);
      }
    }
    if (!entry && allowTitleFallback) {
      const candidateId = await resolveFastfluxTmdbIdBySearch(strictTitle, "movie", strictYear || 0);
      if (candidateId) {
        entry = fastfluxMovieCache.map.get(candidateId);
      }
    }
    if (!entry || !entry.source) {
      return [];
    }
    if (strictTitle && !isFastfluxTitleMatch(entry, strictTitle, strictYear)) {
      const alt = await resolveFastfluxEntryByTitle("movie", strictTitle, strictYear);
      if (!alt || !isFastfluxTitleMatch(alt, strictTitle, strictYear)) {
        return [];
      }
      entry = alt;
    }
    const source = buildFastfluxSourceEntry(entry.source, 0);
    return source ? [source] : [];
  }

  if (forceRefresh) {
    await loadFastfluxSeries(true, { minPages: FASTFLUX_SERIES_PAGES_PER_FEED });
  }
  if (safeTmdbId > 0) {
    entry = fastfluxSeriesCache.map.get(safeTmdbId);
    if (!entry) {
      await loadFastfluxSeries(true, { minPages: FASTFLUX_SERIES_MAX_PAGES_PER_FEED });
      entry = fastfluxSeriesCache.map.get(safeTmdbId);
    }
  }
  if (!entry && allowTitleFallback) {
    const candidateId = await resolveFastfluxTmdbIdBySearch(strictTitle, "tv", strictYear || 0);
    if (candidateId) {
      entry = fastfluxSeriesCache.map.get(candidateId);
    }
  }
  if (!entry || !Array.isArray(entry.episodes)) {
    return [];
  }
  if (strictTitle && !isFastfluxTitleMatch(entry, strictTitle, strictYear)) {
    const alt = await resolveFastfluxEntryByTitle("tv", strictTitle, strictYear);
    if (!alt || !isFastfluxTitleMatch(alt, strictTitle, strictYear)) {
      return [];
    }
    entry = alt;
  }
  const match = entry.episodes.find((episodeRow) => {
    const seasonNumber = parseFastfluxSeasonNumber(episodeRow?.season);
    const episodeNumber = parseFastfluxEpisodeNumber(episodeRow?.episode_number || episodeRow?.episode);
    return seasonNumber === safeSeason && episodeNumber === safeEpisode;
  });
  const fallback = match || entry.episodes[0];
  if (!fallback) {
    return [];
  }
  const source = buildFastfluxSourceEntry(fallback, 0);
  return source ? [source] : [];
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

async function loadNakiosCatalogEntries(force = false, options = {}) {
  const now = Date.now();
  const minPages = Math.max(1, toInt(options?.minPages, 0, 1, NAKIOS_CATALOG_MAX_PAGES_PER_FEED));
  const targetPages = Math.min(
    NAKIOS_CATALOG_MAX_PAGES_PER_FEED,
    Math.max(NAKIOS_CATALOG_PAGES_PER_FEED, minPages)
  );
  if (
    !force &&
    nakiosCatalogCache.loadedAt > 0 &&
    now - nakiosCatalogCache.loadedAt < SUPPLEMENTAL_CATALOG_CACHE_MS &&
    Array.isArray(nakiosCatalogCache.entries) &&
    nakiosCatalogCache.entries.length > 0 &&
    Number(nakiosCatalogCache.pagesPerFeed || 0) >= targetPages
  ) {
    return nakiosCatalogCache.entries;
  }
  if (nakiosCatalogCache.inFlight) {
    return nakiosCatalogCache.inFlight;
  }

  const task = (async () => {
    const jobs = [];
    NAKIOS_CATALOG_FEEDS.forEach((feed) => {
      for (let page = 1; page <= targetPages; page += 1) {
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

    const pinned = await fetchNakiosPinnedEntries(rows);
    nakiosCatalogCache.entries = rows.concat(pinned);
    nakiosCatalogCache.loadedAt = Date.now();
    nakiosCatalogCache.pagesPerFeed = targetPages;
    return nakiosCatalogCache.entries;
  })();

  nakiosCatalogCache.inFlight = task;
  try {
    return await task;
  } finally {
    nakiosCatalogCache.inFlight = null;
  }
}

async function fetchNakiosPinnedEntries(existingRows) {
  const now = Date.now();
  if (
    !Array.isArray(NAKIOS_PINNED_TITLES) ||
    NAKIOS_PINNED_TITLES.length === 0
  ) {
    return [];
  }
  if (!existingRows) {
    existingRows = [];
  }
  if (nakiosPinnedCache.inFlight) {
    return nakiosPinnedCache.inFlight;
  }
  if (nakiosPinnedCache.loadedAt && now - nakiosPinnedCache.loadedAt < NAKIOS_PINNED_CACHE_MS) {
    return nakiosPinnedCache.entries || [];
  }

  const task = (async () => {
    const fallbackIds = new Set(existingRows.map((row) => Number(row?.id || 0)).filter((id) => id > 0));
    const existingKeys = new Set(existingRows.map((row) => buildNakiosSemanticKey(row)).filter(Boolean));
    const existingTmdb = new Set(
      existingRows.map((row) => Number(row?.external_tmdb_id || 0)).filter((id) => id > 0)
    );
    const results = [];

    for (const pin of NAKIOS_PINNED_TITLES) {
      const title = String(pin?.title || "").trim();
      if (!title) {
        continue;
      }
      const mediaType = String(pin?.mediaType || "movie").toLowerCase() === "tv" ? "tv" : "movie";
      const year = toInt(pin?.year, 0, 0, 2099);
      try {
        const entry = await resolveNakiosSearchEntry(title, mediaType, year);
        if (!entry) {
          continue;
        }
        const tmdbId = toInt(entry?.id, 0, 0, 999999999);
        if (tmdbId > 0 && existingTmdb.has(tmdbId)) {
          continue;
        }
        const row = buildNakiosCatalogRow(entry, mediaType, fallbackIds);
        if (!row) {
          continue;
        }
        const key = buildNakiosSemanticKey(row);
        if (key && existingKeys.has(key)) {
          continue;
        }
        if (key) {
          existingKeys.add(key);
        }
        if (tmdbId > 0) {
          existingTmdb.add(tmdbId);
        }
        results.push(row);
      } catch {
        // best effort only
      }
    }

    nakiosPinnedCache.entries = results;
    nakiosPinnedCache.loadedAt = Date.now();
    nakiosPinnedCache.inFlight = null;
    return results;
  })();

  nakiosPinnedCache.inFlight = task;
  return task;
}

async function resolveNakiosTmdbIdBySearch(title, mediaType, year = 0, options = {}) {
  const safeTitle = String(title || "").trim();
  if (safeTitle.length < 2) {
    return 0;
  }
  const normalizedType = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const safeYear = toInt(year, 0, 0, 2099);
  const requireStrongMatch = Boolean(options?.requireStrongMatch);
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
      if (type !== normalizedType) {
        return false;
      }
      if ((STRICT_NAKIOS_MATCH || requireStrongMatch) && !isStrongTitleMatch(safeTitle, entry?.title || entry?.name)) {
        return false;
      }
      return true;
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
      } else if ((STRICT_NAKIOS_MATCH || requireStrongMatch) && safeYear > 0 && rowYear > 0) {
        const diff = Math.abs(rowYear - safeYear);
        if (diff > 2) {
          score -= 80;
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

function scoreNakiosSearchEntry(entry, queryTitleKey, normalizedType, safeYear) {
  if (!entry) {
    return -Infinity;
  }
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
  } else if (rowTitleKey && queryTitleKey && rowTitleKey[0] === queryTitleKey[0]) {
    score += 35;
  }
  if (safeYear > 0 && rowYear > 0) {
    score += rowYear === safeYear ? 60 : Math.max(0, 45 - Math.abs(rowYear - safeYear) * 4);
  }
  if (entry?.poster_path) {
    score += 15;
  }
  return score;
}

function scoreFilmer2SearchEntry(entry, queryTitleKey, normalizedType, safeYear) {
  if (!entry) {
    return -Infinity;
  }
  const rowTitle = String(entry?.title || entry?.name || "").trim();
  const rowTitleKey = normalizeTitleKey(rowTitle);
  const rowYear = toInt(entry?.external_year || entry?.year, 0, 0, 2099);
  let score = 0;
  if (rowTitleKey === queryTitleKey) {
    score += 140;
  } else if (rowTitleKey.includes(queryTitleKey) || queryTitleKey.includes(rowTitleKey)) {
    score += 85;
  } else if (rowTitleKey && queryTitleKey && rowTitleKey[0] === queryTitleKey[0]) {
    score += 30;
  }
  if (normalizedType) {
    const rowType = normalizeSupplementalMediaType(entry?.type || entry?.mediaType || "");
    if (rowType === normalizedType) {
      score += 30;
    } else {
      score -= 15;
    }
  }
  if (safeYear > 0 && rowYear > 0) {
    const diff = Math.abs(rowYear - safeYear);
    if (diff === 0) {
      score += 60;
    } else if (diff === 1) {
      score += 35;
    } else if (diff <= 2) {
      score += 12;
    } else {
      score -= diff * 3;
    }
  }
  if (entry?.large_poster_path || entry?.small_poster_path) {
    score += 12;
  }
  return score;
}

function extractMetaContent(html, key) {
  const safeKey = String(key || "").trim();
  if (!safeKey) {
    return "";
  }
  const regex = new RegExp(
    `<meta[^>]+(?:property|name)=["']${safeKey}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = String(html || "").match(regex);
  return String(match?.[1] || "").trim();
}

function extractTagText(html, tag) {
  const safeTag = String(tag || "").trim();
  if (!safeTag) {
    return "";
  }
  const regex = new RegExp(`<${safeTag}[^>]*>([^<]+)</${safeTag}>`, "i");
  const match = String(html || "").match(regex);
  return String(match?.[1] || "").trim();
}

function parseYoutubePlaylistId(input) {
  const raw = String(input || "").trim();
  if (!raw) {
    return "";
  }
  const idMatch = raw.match(/^(?:PL|UU|LL|OLAK5uy|RD|UL)[A-Za-z0-9_-]+$/i);
  if (idMatch) {
    return idMatch[0];
  }
  let parsed = null;
  try {
    parsed = new URL(raw, "https://www.youtube.com/");
  } catch {
    return "";
  }
  const host = String(parsed.hostname || "").toLowerCase();
  if (!/(youtube\.com|youtu\.be)/i.test(host)) {
    return "";
  }
  const listParam = String(parsed.searchParams.get("list") || "").trim();
  if (listParam) {
    return listParam;
  }
  return "";
}

function extractBalancedJson(html, startIndex) {
  const input = String(html || "");
  if (!input || startIndex < 0) {
    return "";
  }
  let start = -1;
  const stack = [];
  let inString = false;
  let escaped = false;
  let quoteChar = "";
  for (let i = startIndex; i < input.length; i += 1) {
    const char = input[i];
    if (start < 0) {
      if (char === "{" || char === "[") {
        start = i;
        stack.push(char);
      }
      continue;
    }
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quoteChar) {
        inString = false;
      }
      continue;
    }
    if (char === "\"" || char === "'") {
      inString = true;
      quoteChar = char;
      continue;
    }
    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }
    if (char === "}" || char === "]") {
      stack.pop();
      if (stack.length === 0) {
        return input.slice(start, i + 1);
      }
    }
  }
  return "";
}

function extractJsonAssignment(html, token) {
  const input = String(html || "");
  if (!input || !token) {
    return null;
  }
  const markers = [
    `var ${token} =`,
    `let ${token} =`,
    `const ${token} =`,
    `${token} =`,
    `window[\"${token}\"] =`,
    `window['${token}'] =`,
  ];
  for (const marker of markers) {
    const index = input.indexOf(marker);
    if (index < 0) {
      continue;
    }
    const jsonText = extractBalancedJson(input, index + marker.length);
    if (!jsonText) {
      continue;
    }
    const parsed = parseJsonSafe(jsonText);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  }
  return null;
}

function pickLargestThumbnail(thumbnails) {
  const rows = Array.isArray(thumbnails) ? thumbnails : [];
  if (rows.length === 0) {
    return "";
  }
  let best = rows[0];
  rows.forEach((row) => {
    if (!row) {
      return;
    }
    const width = Number(row.width || 0);
    const height = Number(row.height || 0);
    const bestWidth = Number(best?.width || 0);
    const bestHeight = Number(best?.height || 0);
    if (width * height > bestWidth * bestHeight) {
      best = row;
    }
  });
  return String(best?.url || "").trim();
}

function findYoutubePlaylistTitle(data) {
  if (!data || typeof data !== "object") {
    return "";
  }
  const candidates = [
    data?.metadata?.playlistMetadataRenderer?.title,
    data?.header?.playlistHeaderRenderer?.title?.simpleText,
    data?.header?.playlistHeaderRenderer?.title?.runs?.[0]?.text,
    data?.header?.playlistHeaderRenderer?.playlistTitle?.simpleText,
    data?.header?.playlistHeaderRenderer?.playlistTitle?.runs?.[0]?.text,
  ];
  for (const candidate of candidates) {
    const text = String(candidate || "").trim();
    if (text) {
      return text;
    }
  }
  return "";
}

function findYoutubePlaylistVideos(data) {
  const videos = [];
  const stack = [data];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) {
      continue;
    }
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i += 1) {
        stack.push(node[i]);
      }
      continue;
    }
    if (typeof node !== "object") {
      continue;
    }
    if (node.playlistVideoRenderer) {
      videos.push(node.playlistVideoRenderer);
      continue;
    }
    for (const value of Object.values(node)) {
      if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }
  return videos;
}

async function fetchYoutubePlaylistInfo(playlistId, force = false) {
  const key = String(playlistId || "").trim();
  if (!key) {
    return null;
  }
  const now = Date.now();
  const cached = youtubePlaylistCache.get(key);
  if (!force && cached && cached.data && cached.expiresAt > now) {
    return cached.data;
  }
  if (cached && cached.inFlight) {
    return cached.inFlight;
  }

  const task = (async () => {
    const url = `https://www.youtube.com/playlist?list=${encodeURIComponent(key)}&hl=fr&gl=FR`;
    const response = await fetchRemoteText(url, "text/html", YOUTUBE_FETCH_HEADERS);
    if (response.status < 200 || response.status >= 300) {
      return null;
    }
    const html = String(response.body || "");
    const initialData = extractJsonAssignment(html, "ytInitialData");
    if (!initialData) {
      return null;
    }
    const playlistTitle = findYoutubePlaylistTitle(initialData);
    const videos = findYoutubePlaylistVideos(initialData);
    const items = videos
      .map((entry) => {
        const videoId = String(entry?.videoId || "").trim();
        if (!videoId) {
          return null;
        }
        const title =
          String(entry?.title?.runs?.[0]?.text || entry?.title?.simpleText || "").trim() || "Episode";
        const indexRaw = String(entry?.index?.simpleText || "").trim();
        const index = toInt(indexRaw, 0, 0, 50000);
        const thumb = pickLargestThumbnail(entry?.thumbnail?.thumbnails || []);
        return {
          videoId,
          title,
          index: index > 0 ? index : 0,
          thumbnail: thumb,
        };
      })
      .filter(Boolean);
    if (items.length === 0) {
      return null;
    }
    const poster = pickLargestThumbnail(
      [
        ...items
          .map((entry) => entry?.thumbnail)
          .filter((value) => typeof value === "string" && value.length > 0)
          .map((url) => ({ url })),
      ]
    );
    return {
      id: key,
      url,
      title: playlistTitle || "Playlist YouTube",
      poster: poster || items[0].thumbnail || "",
      items,
    };
  })();

  youtubePlaylistCache.set(key, {
    data: cached?.data || null,
    expiresAt: now + YOUTUBE_PLAYLIST_CACHE_MS,
    inFlight: task,
  });
  try {
    const data = await task;
    youtubePlaylistCache.set(key, {
      data,
      expiresAt: Date.now() + YOUTUBE_PLAYLIST_CACHE_MS,
      inFlight: null,
    });
    return data;
  } catch {
    youtubePlaylistCache.set(key, {
      data: cached?.data || null,
      expiresAt: Date.now() + YOUTUBE_PLAYLIST_CACHE_MS,
      inFlight: null,
    });
    return null;
  }
}

function buildYoutubePlaylistSeasons(info) {
  if (!info || !Array.isArray(info.items)) {
    return [];
  }
  const episodes = info.items.map((entry, idx) => ({
    season: 1,
    episode: Number(entry.index || idx + 1),
    name: String(entry.title || `Episode ${idx + 1}`).trim(),
    runtime: 0,
    airDate: "",
    isSoon: false,
  }));
  return episodes.length > 0 ? [{ season: 1, episodes }] : [];
}

function buildYoutubeEmbedUrl(videoId) {
  const safe = String(videoId || "").trim();
  if (!safe) {
    return "";
  }
  const params = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/${safe}?${params.toString()}`;
}

function normalizeAdminCustomEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const title = String(entry.title || "").trim();
  if (!title) {
    return null;
  }
  const forceDuplicate = Boolean(entry.force_duplicate ?? entry.forceDuplicate ?? entry.allow_duplicate ?? entry.allowDuplicate);
  const type = String(entry.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  const titleKey = normalizeTitleKey(entry.titleKey || title);
  const year = toInt(entry.year, 0, 0, 2099);
  const externalKey = String(entry.external_key || entry.externalKey || "").trim();
  const externalDetailUrl = String(entry.external_detail_url || entry.externalDetailUrl || "").trim();
  const poster =
    String(entry.large_poster_path || entry.small_poster_path || entry.poster || entry.cover || "").trim() || "";
  const backdrop =
    String(entry.wallpaper_poster_path || entry.backdrop || entry.poster_backdrop || poster).trim() || poster;
  const rawKey = externalKey || `admin:${titleKey}:${type}:${year || "0"}`;
  const id = toInt(entry.id, 0, 0, 999999999) || buildSupplementalMediaId("admin", rawKey);
  const releaseDate = String(entry.release_date || entry.releaseDate || "").trim();
  const normalized = {
    id,
    type,
    title,
    titleKey,
    year,
    isAnime: Boolean(entry.isAnime),
    runtime: Number(entry.runtime || 0) || null,
    release_date: releaseDate || null,
    end_date: String(entry.end_date || "").trim() || null,
    overview: String(entry.overview || "").trim(),
    detailUrl: String(entry.detailUrl || entry.external_detail_url || externalDetailUrl || "").trim(),
    pageUrl: String(entry.pageUrl || entry.external_detail_url || externalDetailUrl || "").trim(),
    lang: String(entry.lang || entry.language || "VF").trim() || "VF",
    language: String(entry.language || entry.lang || "VF").trim() || "VF",
    small_poster_path: poster,
    large_poster_path: poster,
    wallpaper_poster_path: backdrop || poster,
    external_provider: ZENIX_EXTERNAL_PROVIDER,
    external_key: rawKey,
    external_detail_url: externalDetailUrl,
    external_tmdb_id: toInt(entry.external_tmdb_id || entry.tmdbId, 0, 0, 999999999) || 0,
    availability_status: normalizeNakiosAvailabilityStatus(entry.availability_status || entry.external_status || "") || "",
    external_status: normalizeNakiosAvailabilityStatus(entry.availability_status || entry.external_status || "") || "",
    supplemental_rank: Number(entry.supplemental_rank || 0),
    supplemental_date: String(entry.supplemental_date || entry.release_date || "").trim(),
    providerLabel: String(entry.providerLabel || "Zenix").trim(),
    force_duplicate: forceDuplicate,
  };
  if (!normalized.supplemental_rank) {
    normalized.supplemental_rank = scoreSupplementalCandidate(normalized);
  }
  return normalized;
}

function buildAdminCustomEntryFromNakios(detail, mediaType) {
  if (!detail || typeof detail !== "object") {
    return null;
  }
  const normalizedType = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const title =
    String(detail?.title || detail?.name || detail?.original_title || detail?.original_name || "").trim();
  if (!title) {
    return null;
  }
  const releaseDateRaw =
    String(
      normalizedType === "tv"
        ? detail?.first_air_date || detail?.release_date || ""
        : detail?.release_date || detail?.first_air_date || ""
    ).trim();
  const year = toInt(parseYearFromText(releaseDateRaw), 0, 0, 2099);
  const poster = toNakiosTmdbPosterUrl(detail?.poster_path || "");
  const backdrop = toNakiosTmdbBackdropUrl(detail?.backdrop_path || "", detail?.poster_path || "");
  const tmdbId = toInt(detail?.id, 0, 0, 999999999);
  const externalKey = `${normalizedType}:${tmdbId || normalizeTitleKey(title)}`;
  return normalizeAdminCustomEntry({
    type: normalizedType,
    title,
    year,
    release_date: releaseDateRaw,
    overview: String(detail?.overview || "").trim(),
    small_poster_path: poster,
    large_poster_path: poster,
    wallpaper_poster_path: backdrop || poster,
    external_key: externalKey,
    external_tmdb_id: tmdbId,
    external_detail_url: "",
    providerLabel: ZENIX_BRAND_LABEL,
  });
}

function buildAdminCustomEntryFromAnimeSama(catalogUrl, html) {
  const safeUrl = sanitizeAnimeSamaCatalogUrl(catalogUrl || "");
  if (!safeUrl) {
    return null;
  }
  const titleRaw =
    extractTagText(html, "h1") ||
    extractMetaContent(html, "og:title") ||
    extractTagText(html, "title") ||
    "";
  let title = String(titleRaw || "").replace(/\s*\|\s*anime-sama.*$/i, "").trim();
  if (!title) {
    const parsed = new URL(safeUrl);
    const slug = String(parsed.pathname || "").split("/").filter(Boolean).pop() || "";
    title = slugToReadableTitle(slug || "");
  }
  if (!title) {
    return null;
  }
  const poster =
    extractMetaContent(html, "og:image") ||
    extractMetaContent(html, "twitter:image") ||
    "";
  return normalizeAdminCustomEntry({
    type: "tv",
    title,
    isAnime: true,
    small_poster_path: poster,
    large_poster_path: poster,
    wallpaper_poster_path: poster,
    external_key: `anime:${normalizeTitleKey(title)}`,
    external_detail_url: safeUrl,
    providerLabel: ZENIX_BRAND_LABEL,
  });
}

function buildAdminCustomEntryFromFilmer2(detail, mediaType) {
  if (!detail || typeof detail !== "object") {
    return null;
  }
  const normalizedType = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const title = String(detail?.title || "").trim();
  if (!title) {
    return null;
  }
  const year = toInt(detail?.year, 0, 0, 2099);
  const externalKey = `filmer2:${normalizedType}:${normalizeTitleKey(title)}`;
  return normalizeAdminCustomEntry({
    type: normalizedType,
    title,
    year,
    overview: String(detail?.description || "").trim(),
    small_poster_path: String(detail?.poster || "").trim(),
    large_poster_path: String(detail?.poster || "").trim(),
    wallpaper_poster_path: String(detail?.backdrop || detail?.poster || "").trim(),
    external_key: externalKey,
    external_detail_url: String(detail?.url || "").trim(),
    providerLabel: ZENIX_BRAND_LABEL,
  });
}

async function fetchFastfluxEntryByTmdbId(mediaType, tmdbId) {
  if (!USE_FASTFLUX) {
    return null;
  }
  const safeId = toInt(tmdbId, 0, 0, 999999999);
  if (!safeId) {
    return null;
  }
  const normalizedType = mediaType === "tv" ? "tv" : "movie";
  let entry = normalizedType === "tv"
    ? fastfluxSeriesCache.map.get(safeId)
    : fastfluxMovieCache.map.get(safeId);
  if (entry) {
    return entry;
  }
  if (normalizedType === "tv") {
    await loadFastfluxSeries(true, { minPages: FASTFLUX_SERIES_MAX_PAGES_PER_FEED });
    entry = fastfluxSeriesCache.map.get(safeId);
  } else {
    await loadFastfluxMovies(true, { minPages: FASTFLUX_MOVIES_MAX_PAGES_PER_FEED });
    entry = fastfluxMovieCache.map.get(safeId);
  }
  return entry || null;
}

function buildAdminCustomEntryFromFastflux(entry, mediaType) {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const normalizedType = mediaType === "tv" ? "tv" : "movie";
  const title = String(entry?.title || entry?.series_name || entry?.name || "").trim();
  if (!title) {
    return null;
  }
  const year = toInt(entry?.year, 0, 0, 2099);
  const poster = String(entry?.poster || "").trim();
  const tmdbId = toInt(entry?.tmdb_id || entry?.tmdbId, 0, 0, 999999999);
  const externalKey = `fastflux:${normalizedType}:${tmdbId || normalizeTitleKey(title)}`;
  return normalizeAdminCustomEntry({
    type: normalizedType,
    title,
    year,
    release_date: year ? `${year}-01-01` : "",
    overview: "",
    small_poster_path: poster,
    large_poster_path: poster,
    wallpaper_poster_path: poster,
    external_key: externalKey,
    external_tmdb_id: tmdbId,
    external_detail_url: toFastfluxCatalogDetailUrl(normalizedType, tmdbId),
    providerLabel: ZENIX_BRAND_LABEL,
  });
}

function buildDirectExternalKeyFromRequest(request, url) {
  const safeId = sanitizeToken(request?.id || "", 80);
  if (safeId) {
    return `direct:req:${safeId}`;
  }
  const safeUrl = String(url || "").trim();
  if (safeUrl) {
    const hash = crypto.createHash("sha256").update(safeUrl).digest("hex").slice(0, 16);
    return `direct:${hash}`;
  }
  return `direct:${crypto.randomBytes(6).toString("hex")}`;
}

function buildAdminCustomEntryFromDirectRequest(request, url) {
  if (!request || typeof request !== "object") {
    return null;
  }
  const safeUrl = sanitizeHttpUrl(url, 900);
  if (!safeUrl) {
    return null;
  }
  const title = String(request?.title || "").trim();
  if (!title) {
    return null;
  }
  const normalizedType = String(request?.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  const year = toInt(request?.year, 0, 0, 2099);
  const poster = sanitizeHttpUrl(request?.poster, 420);
  const backdrop = sanitizeHttpUrl(request?.backdrop, 420) || poster;
  const overview = sanitizeSuggestionText(request?.overview, 600);
  const externalKey = buildDirectExternalKeyFromRequest(request, safeUrl);
  return normalizeAdminCustomEntry({
    type: normalizedType,
    title,
    year,
    overview,
    small_poster_path: poster,
    large_poster_path: poster,
    wallpaper_poster_path: backdrop || poster,
    external_key: externalKey,
    external_detail_url: safeUrl,
    providerLabel: ZENIX_BRAND_LABEL,
    force_duplicate: true,
  });
}

async function buildAdminCustomEntryFromMovix(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return null;
  }
  const normalizedType = String(parsed.mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const tmdbId = toInt(parsed.tmdbId, 0, 0, 999999999);
  const movixKey = `movix:${normalizedType}:${tmdbId || normalizeTitleKey(parsed.title || "")}`;
  let entry = null;

  if (tmdbId > 0) {
    const target =
      normalizedType === "tv"
        ? `${NAKIOS_API_BASE}/api/series/${tmdbId}`
        : `${NAKIOS_API_BASE}/api/movies/${tmdbId}`;
    const response = await fetchRemote(target, NAKIOS_FETCH_HEADERS);
    if (response.status >= 200 && response.status < 300) {
      const detail = parseJsonSafe(response.body);
      entry = buildAdminCustomEntryFromNakios(detail, normalizedType);
    }
  }

  if (!entry) {
    const fallbackTitle = tmdbId > 0 ? `Movix ${tmdbId}` : "Movix";
    entry = normalizeAdminCustomEntry({
      type: normalizedType,
      title: fallbackTitle,
      year: 0,
      overview: "",
      external_key: movixKey,
      external_tmdb_id: tmdbId,
      external_detail_url: parsed.detailUrl || "",
      providerLabel: ZENIX_BRAND_LABEL,
      language: "VF",
      lang: "VF",
      availability_status: "available",
      external_status: "available",
    });
  }

  if (!entry) {
    return null;
  }

  entry.external_key = movixKey;
  if (tmdbId > 0) {
    entry.external_tmdb_id = tmdbId;
  }
  if (parsed.detailUrl) {
    entry.external_detail_url = parsed.detailUrl;
  }
  if (parsed.isAnime) {
    entry.isAnime = true;
  }
  return entry;
}

async function buildAdminCustomEntryFromNocta(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return null;
  }
  const normalizedType = String(parsed.mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const safeUrl = String(parsed.detailUrl || "").trim();
  if (!safeUrl) {
    return null;
  }
  const html = await fetchNoctaDetailHtml(safeUrl);
  const title = extractNoctaTitle(html) || String(parsed.slug || "").replace(/[-_]+/g, " ").trim() || "Noctaflix";
  const overview = extractNoctaDescription(html);
  const poster = extractNoctaPoster(html);
  const yearHint = parseYearFromText(`${title} ${overview}`) || parseYearFromText(extractTagText(html, "title"));
  const year = toInt(yearHint, 0, 0, 2099);
  const slugKey = normalizeTitleKey(parsed.slug || title);
  const externalKey = `nocta:${normalizedType}:${slugKey || normalizeTitleKey(title)}`;
  return normalizeAdminCustomEntry({
    type: normalizedType,
    title,
    year,
    overview,
    small_poster_path: poster,
    large_poster_path: poster,
    wallpaper_poster_path: poster,
    external_key: externalKey,
    external_detail_url: safeUrl,
    providerLabel: ZENIX_BRAND_LABEL,
    language: "VF",
    lang: "VF",
    availability_status: "available",
    external_status: "available",
  });
}

function extractYoutubePlaylistIdFromKey(externalKey) {
  const raw = String(externalKey || "").trim();
  if (!raw) {
    return "";
  }
  const prefix = "youtube:playlist:";
  if (raw.startsWith(prefix)) {
    return raw.slice(prefix.length).trim();
  }
  return "";
}

async function buildAdminCustomEntryFromYoutubePlaylist(playlistId) {
  const safeId = parseYoutubePlaylistId(playlistId);
  if (!safeId) {
    return null;
  }
  const info = await fetchYoutubePlaylistInfo(safeId);
  if (!info) {
    return null;
  }
  const title = String(info.title || "").trim() || "Playlist YouTube";
  const poster = String(info.poster || "").trim();
  const externalKey = `youtube:playlist:${safeId}`;
  const today = new Date().toISOString().slice(0, 10);
  return normalizeAdminCustomEntry({
    type: "tv",
    title,
    year: toInt(parseYearFromText(today), 0, 0, 2099),
    release_date: today,
    overview: "",
    small_poster_path: poster,
    large_poster_path: poster,
    wallpaper_poster_path: poster,
    external_key: externalKey,
    external_detail_url: info.url || "",
    providerLabel: ZENIX_BRAND_LABEL,
    language: "VO",
    lang: "VO",
    availability_status: "available",
    external_status: "available",
  });
}

function resolveMovixAdminEntry(options = {}) {
  const title = String(options.title || "").trim();
  const mediaType = String(options.mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const externalKeyParam = String(options.externalKey || "").trim();
  const tmdbId = toInt(options.tmdbId, 0, 0, 999999999);
  const adminData = loadAdminData();
  const custom = Array.isArray(adminData?.custom) ? adminData.custom : [];
  let entry = null;

  if (externalKeyParam) {
    const parsed = parseMovixExternalKey(externalKeyParam);
    if (parsed) {
      entry =
        custom.find((row) => String(row?.external_key || row?.externalKey || "") === externalKeyParam) || null;
    }
  }
  if (!entry && tmdbId > 0) {
    entry =
      custom.find((row) => {
        const parsed = parseMovixExternalKey(row?.external_key || row?.externalKey || "");
        return parsed && parsed.tmdbId === tmdbId;
      }) || null;
  }
  if (!entry && title) {
    const key = normalizeTitleKey(title);
    if (key) {
      entry =
        custom.find((row) => {
          const parsed = parseMovixExternalKey(row?.external_key || row?.externalKey || "");
          return parsed && normalizeTitleKey(row?.title || "") === key;
        }) || null;
    }
    if (!entry && key && key.length >= 4) {
      entry =
        custom.find((row) => {
          const parsed = parseMovixExternalKey(row?.external_key || row?.externalKey || "");
          if (!parsed) {
            return false;
          }
          const rowKey = normalizeTitleKey(row?.title || "");
          if (!rowKey) {
            return false;
          }
          const shorter = key.length <= rowKey.length ? key : rowKey;
          const longer = key.length <= rowKey.length ? rowKey : key;
          if (shorter.length < 4) {
            return false;
          }
          return longer.includes(shorter);
        }) || null;
    }
  }

  if (!entry) {
    return null;
  }
  const resolved = applyAdminOverride(entry, adminData);
  if (!resolved) {
    return null;
  }
  const entryType = String(resolved?.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  if (mediaType && mediaType !== entryType) {
    return null;
  }
  const parsed = parseMovixExternalKey(resolved?.external_key || "");
  if (!parsed) {
    return null;
  }
  return resolved;
}

function resolveNoctaAdminEntry(options = {}) {
  const title = String(options.title || "").trim();
  const mediaType = String(options.mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const externalKeyParam = String(options.externalKey || "").trim();
  const mediaId = toInt(options.mediaId, 0, 0, 999999999);
  const adminData = loadAdminData();
  const custom = Array.isArray(adminData?.custom) ? adminData.custom : [];
  let entry = null;

  if (externalKeyParam && externalKeyParam.startsWith("nocta:")) {
    entry = custom.find((row) => String(row?.external_key || row?.externalKey || "") === externalKeyParam) || null;
  }
  if (!entry && mediaId > 0) {
    entry =
      custom.find((row) => {
        const rowKey = String(row?.external_key || row?.externalKey || "");
        return Number(row?.id || 0) === mediaId && rowKey.startsWith("nocta:");
      }) || null;
  }
  if (!entry && title) {
    const key = normalizeTitleKey(title);
    if (key) {
      entry =
        custom.find((row) => {
          const rowKey = String(row?.external_key || row?.externalKey || "");
          if (!rowKey.startsWith("nocta:")) {
            return false;
          }
          return normalizeTitleKey(row?.title || "") === key;
        }) || null;
    }
    if (!entry && key && key.length >= 4) {
      entry =
        custom.find((row) => {
          const rowKey = String(row?.external_key || row?.externalKey || "");
          if (!rowKey.startsWith("nocta:")) {
            return false;
          }
          const rowTitleKey = normalizeTitleKey(row?.title || "");
          if (!rowTitleKey) {
            return false;
          }
          const shorter = key.length <= rowTitleKey.length ? key : rowTitleKey;
          const longer = key.length <= rowTitleKey.length ? rowTitleKey : key;
          if (shorter.length < 4) {
            return false;
          }
          return longer.includes(shorter);
        }) || null;
    }
  }

  if (!entry) {
    return null;
  }
  const resolved = applyAdminOverride(entry, adminData);
  if (!resolved) {
    return null;
  }
  const entryType = String(resolved?.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  if (mediaType && mediaType !== entryType) {
    return null;
  }
  const parsed = parseNoctaExternalKey(resolved?.external_key || "");
  if (!parsed) {
    return null;
  }
  return resolved;
}

function resolveYoutubeAdminEntry(options = {}) {
  const title = String(options.title || "").trim();
  const mediaType = String(options.mediaType || "").toLowerCase();
  const externalKeyParam = String(options.externalKey || "").trim();
  const mediaId = toInt(options.mediaId, 0, 0, 999999999);
  const adminData = loadAdminData();
  const custom = Array.isArray(adminData?.custom) ? adminData.custom : [];
  let entry = null;

  if (externalKeyParam) {
    entry = custom.find((row) => String(row?.external_key || row?.externalKey || "") === externalKeyParam) || null;
  }
  if (!entry && mediaId > 0) {
    entry = custom.find((row) => Number(row?.id || 0) === mediaId) || null;
  }
  if (!entry && title) {
    const key = normalizeTitleKey(title);
    if (key) {
      entry = custom.find((row) => normalizeTitleKey(row?.title || "") === key) || null;
    }
  }

  if (!entry) {
    return null;
  }
  const resolved = applyAdminOverride(entry, adminData);
  if (!resolved) {
    return null;
  }
  const entryType = String(resolved?.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  if (mediaType && mediaType !== entryType) {
    return null;
  }
  const externalKey = String(resolved?.external_key || "").trim();
  if (!externalKey.startsWith("youtube:playlist:")) {
    return null;
  }
  return resolved;
}

function resolveDirectAdminEntry(options = {}) {
  const title = String(options.title || "").trim();
  const mediaType = String(options.mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const externalKeyParam = String(options.externalKey || "").trim();
  const mediaId = toInt(options.mediaId, 0, 0, 999999999);
  const adminData = loadAdminData();
  const custom = Array.isArray(adminData?.custom) ? adminData.custom : [];
  let entry = null;

  if (externalKeyParam && externalKeyParam.startsWith("direct:")) {
    entry = custom.find((row) => String(row?.external_key || row?.externalKey || "") === externalKeyParam) || null;
  }
  if (!entry && mediaId > 0) {
    entry =
      custom.find((row) => {
        const rowKey = String(row?.external_key || row?.externalKey || "");
        return Number(row?.id || 0) === mediaId && rowKey.startsWith("direct:");
      }) || null;
  }
  if (!entry && title) {
    const key = normalizeTitleKey(title);
    if (key) {
      entry =
        custom.find((row) => {
          const rowKey = String(row?.external_key || row?.externalKey || "");
          return rowKey.startsWith("direct:") && normalizeTitleKey(row?.title || "") === key;
        }) || null;
    }
  }

  if (!entry) {
    return null;
  }
  const resolved = applyAdminOverride(entry, adminData);
  if (!resolved) {
    return null;
  }
  const entryType = String(resolved?.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  if (mediaType && mediaType !== entryType) {
    return null;
  }
  const externalKey = String(resolved?.external_key || "").trim();
  if (!externalKey.startsWith("direct:")) {
    return null;
  }
  return resolved;
}

function pickYoutubePlaylistItem(info, episode) {
  if (!info || !Array.isArray(info.items) || info.items.length === 0) {
    return null;
  }
  const target = Math.max(1, Number(episode || 1));
  const direct = info.items.find((entry) => Number(entry?.index || 0) === target);
  if (direct) {
    return direct;
  }
  const fallbackIndex = Math.min(info.items.length - 1, Math.max(0, target - 1));
  return info.items[fallbackIndex] || null;
}

async function resolveNakiosSearchEntry(title, mediaType, year = 0) {
  const safeTitle = String(title || "").trim();
  if (safeTitle.length < 2) {
    return null;
  }
  const normalizedType = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const safeYear = toInt(year, 0, 0, 2099);
  const queryTitleKey = normalizeTitleKey(safeTitle);
  const target = `${NAKIOS_API_BASE}/api/search/multi?query=${encodeURIComponent(safeTitle)}`;
  const response = await fetchRemoteWithTimeout(target, NAKIOS_FETCH_HEADERS, NAKIOS_SOURCE_REMOTE_TIMEOUT_MS);
  if (response.status < 200 || response.status >= 300) {
    return null;
  }
  const payload = parseJsonSafe(response.body);
  const rows = Array.isArray(payload?.results) ? payload.results : [];
  const filtered = rows.filter((entry) => {
    const type = String(entry?.media_type || "").toLowerCase();
    if (type !== normalizedType) {
      return false;
    }
    if (STRICT_NAKIOS_MATCH && !isStrongTitleMatch(safeTitle, entry?.title || entry?.name)) {
      return false;
    }
    return true;
  });
  if (filtered.length === 0) {
    return null;
  }
  let best = null;
  let bestScore = -Infinity;
  filtered.forEach((entry) => {
    const score = scoreNakiosSearchEntry(entry, queryTitleKey, normalizedType, safeYear);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  });
  return best;
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

const NAKIOS_TITLE_STOPWORDS = new Set([
  "le",
  "la",
  "les",
  "de",
  "du",
  "des",
  "un",
  "une",
  "the",
  "and",
  "of",
  "a",
  "an",
]);

function normalizeMatchText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function extractTitleTokens(title) {
  const normalized = normalizeMatchText(title);
  if (!normalized) {
    return [];
  }
  const tokens = normalized
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !NAKIOS_TITLE_STOPWORDS.has(token));
  return Array.from(new Set(tokens));
}

function extractYearCandidates(text) {
  const value = String(text || "");
  if (!value) {
    return [];
  }
  const years = new Set();
  const regex = /(19|20)\d{2}/g;
  let match = null;
  while ((match = regex.exec(value)) !== null) {
    const year = toInt(match[0], 0, 1900, 2099);
    if (year > 0) {
      years.add(year);
    }
  }
  return Array.from(years);
}

function isStrongTitleMatch(left, right) {
  const a = normalizeMatchText(left);
  const b = normalizeMatchText(right);
  if (!a || !b) {
    return false;
  }
  if (a === b) {
    return true;
  }
  const tokensA = extractTitleTokens(a);
  const tokensB = extractTitleTokens(b);
  if (tokensA.length === 0 || tokensB.length === 0) {
    return a === b;
  }
  const shared = tokensA.filter((token) => tokensB.includes(token));
  if (shared.length === 0) {
    return false;
  }
  if (shared.length >= 3) {
    return true;
  }
  const ratio = shared.length / Math.max(tokensA.length, tokensB.length);
  if (shared.length >= 2 && ratio >= 0.5) {
    return true;
  }
  if (tokensA.length === 1 && tokensB.length === 1 && shared.length === 1) {
    return true;
  }
  return false;
}

function isTitleYearCompatible(metaYear, haystack) {
  const year = toInt(metaYear, 0, 1900, 2099);
  if (year <= 0) {
    return true;
  }
  const years = extractYearCandidates(haystack);
  if (years.length === 0) {
    return true;
  }
  return years.some((entry) => Math.abs(entry - year) <= 1);
}

function isNakiosSourceCompatible(source, meta = {}) {
  if (!source) {
    return false;
  }
  if (source.debug) {
    return true;
  }
  const title = String(meta.title || "").trim();
  if (!title) {
    return true;
  }
  const haystack = normalizeMatchText(
    `${source?.stream_url || source?.url || ""} ${source?.source_name || source?.name || ""}`
  );
  if (!haystack) {
    return false;
  }
  const tmdbId = Number(meta.tmdbId || 0);
  if (Number.isFinite(tmdbId) && tmdbId > 0 && haystack.includes(String(tmdbId))) {
    return true;
  }
  const tokens = extractTitleTokens(title);
  if (tokens.length === 0) {
    return true;
  }
  if (!isTitleYearCompatible(meta.year, haystack)) {
    return false;
  }
  const matched = tokens.filter((token) => haystack.includes(token));
  if (matched.length === 0) {
    return false;
  }
  if (tokens.length >= 2) {
    return matched.length >= 2;
  }
  return matched.length >= 1;
}

function filterNakiosSourcesByTitle(sources, meta = {}) {
  const rows = Array.isArray(sources) ? sources : [];
  const filtered = [];
  let incompatible = 0;
  rows.forEach((entry) => {
    if (isNakiosSourceCompatible(entry, meta)) {
      filtered.push(entry);
    } else {
      incompatible += 1;
    }
  });
  return { sources: filtered, incompatible };
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
    const rawName = String(sourceRow?.name || sourceRow?.provider || sourceRow?.original_player || "").trim();
    const brandedName = /premium/i.test(rawName) ? `${ZENIX_BRAND_LABEL} Premium` : ZENIX_BRAND_LABEL;
    out.push({
      stream_url: streamUrl,
      source_name: brandedName,
      quality: sanitizeToken(String(sourceRow?.quality || "HD"), 24) || "HD",
      language,
      format: guessNakiosSourceFormat(sourceRow, streamUrl),
      priority: (language === "VF" ? 390 : language === "MULTI" ? 368 : language === "VOSTFR" ? 356 : 330) - Math.min(40, index * 4),
    });
  });
  if (out.length > 0) {
    const debugCandidate = out.find((entry) => entry && entry.format && entry.format !== "embed") || out[0];
    if (debugCandidate && debugCandidate.stream_url) {
      const debugUrl = buildHlsProxyPath(debugCandidate.stream_url);
      const alreadyDebug = out.some(
        (entry) => String(entry?.stream_url || "") === debugUrl && entry?.debug === true
      );
      if (!alreadyDebug) {
        out.unshift({
          ...debugCandidate,
          stream_url: debugUrl,
          source_name: "Debug",
          debug: true,
          priority: Number(debugCandidate.priority || 360) + 2,
        });
      }
    }
  }
  return out;
}

function extractMovixLinksFromPayload(payload, mediaType) {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  const data = payload.data;
  if (mediaType === "tv") {
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]?.links)) {
      return data[0].links;
    }
    if (Array.isArray(data?.links)) {
      return data.links;
    }
  }
  if (Array.isArray(data?.links)) {
    return data.links;
  }
  if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]?.links)) {
    return data[0].links;
  }
  return [];
}

function normalizeMovixLinks(links) {
  const rows = Array.isArray(links) ? links : [];
  const out = [];
  const dedupe = new Set();
  rows.forEach((entry, index) => {
    let url = "";
    let label = "";
    let language = "";
    let isVip = false;
    let formatHint = "";
    if (typeof entry === "string") {
      url = entry;
    } else if (entry && typeof entry === "object") {
      url = entry.url || entry.decoded_url || entry.link || entry.src || "";
      label = entry.label || entry.quality || "";
      language = entry.language || entry.lang || "";
      isVip = Boolean(entry.isVip || entry.vip);
      formatHint = entry.format || entry.type || "";
    }
    const parsed = parseSafeRemoteUrl(url);
    if (!parsed) {
      return;
    }
    const streamUrl = parsed.href;
    if (!streamUrl || dedupe.has(streamUrl)) {
      return;
    }
    dedupe.add(streamUrl);
    const normalizedLanguage = normalizePidoovLanguage(language || label) || "VF";
    const quality = sanitizeToken(String(label || "HD"), 24) || "HD";
    const format = inferOwnedSourceFormat(streamUrl, formatHint || "");
    const sourceName = isVip ? `${ZENIX_BRAND_LABEL} Premium` : ZENIX_BRAND_LABEL;
    const basePriority =
      normalizedLanguage === "VF"
        ? 370
        : normalizedLanguage === "MULTI"
          ? 350
          : normalizedLanguage === "VOSTFR"
            ? 340
            : 320;
    out.push({
      stream_url: streamUrl,
      source_name: sourceName,
      quality,
      language: normalizedLanguage,
      format,
      priority: basePriority - Math.min(30, index * 4),
    });
  });
  return out;
}

async function resolveMovixSourcesByTmdbId(mediaType, tmdbId, season = 1, episode = 1) {
  if (!MOVIX_API_BASE) {
    return [];
  }
  const safeTmdbId = toInt(tmdbId, 0, 0, 999999999);
  if (safeTmdbId <= 0) {
    return [];
  }
  const normalizedType = String(mediaType || "").toLowerCase() === "tv" ? "tv" : "movie";
  const safeSeason = toInt(season, 1, 1, 500);
  const safeEpisode = toInt(episode, 1, 1, 50000);
  const target =
    normalizedType === "tv"
      ? `${MOVIX_API_BASE}/api/links/tv/${safeTmdbId}?season=${safeSeason}&episode=${safeEpisode}`
      : `${MOVIX_API_BASE}/api/links/movie/${safeTmdbId}`;
  const response = await fetchRemote(target, MOVIX_FETCH_HEADERS);
  if (response.status < 200 || response.status >= 300) {
    return [];
  }
  const payload = parseJsonSafe(response.body);
  const links = extractMovixLinksFromPayload(payload, normalizedType);
  if (!Array.isArray(links) || links.length === 0) {
    return [];
  }
  return normalizeMovixLinks(links);
}

function decodeNoctaEncryptedSource(value) {
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

async function resolveNoctaEmbedSource(embedUrl) {
  const safeUrl = String(embedUrl || "").trim();
  if (!safeUrl) {
    return "";
  }
  const cached = noctaEmbedCache.get(safeUrl);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value || "";
  }
  const response = await fetchRemoteWithTimeout(
    safeUrl,
    { ...NOCTA_FETCH_HEADERS, Accept: "text/html" },
    NOCTA_SOURCE_TIMEOUT_MS
  );
  if (response.status < 200 || response.status >= 300) {
    return "";
  }
  const body = String(response.body || "");
  const match =
    body.match(/id=["']encrypted-source["'][^>]*value=["']([^"']+)["']/i) ||
    body.match(/encrypted-source\"[^>]+value=\"([^\"]+)\"/i);
  let resolved = "";
  if (match?.[1]) {
    resolved = decodeNoctaEncryptedSource(match[1]);
  }
  if (!resolved) {
    const sourceMatch = body.match(/<source[^>]+src=["']([^"']+)["']/i);
    if (sourceMatch?.[1]) {
      resolved = String(sourceMatch[1] || "").trim();
    }
  }
  let finalUrl = "";
  if (resolved) {
    const parsed = parseSafeRemoteUrl(resolved);
    if (parsed) {
      finalUrl = parsed.href;
    }
  }
  noctaEmbedCache.set(safeUrl, { value: finalUrl, expiresAt: Date.now() + NOCTA_EMBED_CACHE_MS });
  return finalUrl;
}

async function fetchNoctaDetailHtml(detailUrl) {
  const safeUrl = String(detailUrl || "").trim();
  if (!safeUrl) {
    return "";
  }
  const cached = noctaDetailCache.get(safeUrl);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value || "";
  }
  const response = await fetchRemoteWithTimeout(
    safeUrl,
    { ...NOCTA_FETCH_HEADERS, Accept: "text/html" },
    NOCTA_SOURCE_TIMEOUT_MS
  );
  if (response.status < 200 || response.status >= 300) {
    return "";
  }
  const html = String(response.body || "");
  noctaDetailCache.set(safeUrl, { value: html, expiresAt: Date.now() + NOCTA_DETAIL_CACHE_MS });
  return html;
}

async function resolveNoctaSourcesByDetailUrl(detailUrl) {
  const safeUrl = String(detailUrl || "").trim();
  if (!safeUrl) {
    return [];
  }
  const html = await fetchNoctaDetailHtml(safeUrl);
  if (!html) {
    return [];
  }
  const videos = extractNoctaVideos(html);
  if (!Array.isArray(videos) || videos.length === 0) {
    return [];
  }
  const dedupe = new Set();
  const out = [];
  for (let index = 0; index < videos.length; index += 1) {
    const entry = videos[index];
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const label = String(entry.label || entry.quality || entry.name || "").trim();
    let link = String(entry.link || entry.url || entry.src || "").trim();
    if (!link) {
      continue;
    }
    try {
      link = new URL(link, NOCTA_BASE).href;
    } catch {
      // keep original
    }
    let streamUrl = link;
    if (/\/embed\//i.test(link)) {
      const resolved = await resolveNoctaEmbedSource(link);
      if (resolved) {
        streamUrl = resolved;
      }
    }
    const parsed = parseSafeRemoteUrl(streamUrl);
    if (!parsed) {
      continue;
    }
    const finalUrl = parsed.href;
    if (!finalUrl || dedupe.has(finalUrl)) {
      continue;
    }
    dedupe.add(finalUrl);
    const language = normalizePidoovLanguage(label) || "VF";
    const format = inferOwnedSourceFormat(finalUrl, String(entry.type || ""));
    const quality = sanitizeToken(label || "HD", 24) || "HD";
    const sourceName = /premium/i.test(label) ? `${ZENIX_BRAND_LABEL} Premium` : ZENIX_BRAND_LABEL;
    const basePriority =
      language === "VF"
        ? 380
        : language === "MULTI"
          ? 360
          : language === "VOSTFR"
            ? 350
            : 320;
    out.push({
      stream_url: finalUrl,
      source_name: sourceName,
      quality,
      language,
      format,
      priority: basePriority - Math.min(30, index * 3),
    });
  }
  return out;
}

async function fetchNakiosDetailByTmdbId(mediaType, tmdbId) {
  const safeTmdbId = toInt(tmdbId, 0, 0, 999999999);
  if (safeTmdbId <= 0) {
    return null;
  }
  const normalizedType = String(mediaType || "").toLowerCase() === "tv" ? "series" : "movies";
  const cacheKey = `${normalizedType}:${safeTmdbId}`;
  const cached = nakiosDetailCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value || null;
  }
  const target = `${NAKIOS_API_BASE}/api/${normalizedType}/${safeTmdbId}`;
  const response = await fetchRemoteWithTimeout(target, NAKIOS_FETCH_HEADERS, NAKIOS_SOURCE_REMOTE_TIMEOUT_MS);
  if (response.status < 200 || response.status >= 300) {
    nakiosDetailCache.set(cacheKey, {
      value: null,
      expiresAt: Date.now() + Math.min(10 * 60 * 1000, NAKIOS_LOOKUP_CACHE_MS),
    });
    return null;
  }
  const detail = parseJsonSafe(response.body);
  nakiosDetailCache.set(cacheKey, {
    value: detail || null,
    expiresAt: Date.now() + Math.max(30 * 60 * 1000, NAKIOS_LOOKUP_CACHE_MS),
  });
  prunePidoovTimedCache(nakiosDetailCache, 3000);
  return detail || null;
}

async function fetchNakiosSeasonsByTmdbId(tmdbId) {
  const safeTmdbId = toInt(tmdbId, 0, 0, 999999999);
  if (safeTmdbId <= 0) {
    return [];
  }
  const cached = nakiosSeasonsCache.get(safeTmdbId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }
  if (nakiosSeasonsInFlight.has(safeTmdbId)) {
    return nakiosSeasonsInFlight.get(safeTmdbId);
  }

  const task = (async () => {
    try {
      const response = await fetchRemote(`${NAKIOS_API_BASE}/api/series/${safeTmdbId}`, NAKIOS_FETCH_HEADERS);
      if (response.status < 200 || response.status >= 300) {
        return [];
      }
      const payload = parseJsonSafe(response.body);
      const rows = Array.isArray(payload?.seasons) ? payload.seasons : [];
      const seasons = rows
        .map((row) => {
          const seasonNumber = toInt(row?.season_number || row?.seasonNumber, 0, 0, 500);
          const episodeCount = toInt(row?.episode_count || row?.episodeCount, 0, 0, 50000);
          if (!seasonNumber || episodeCount <= 0) {
            return null;
          }
          const airDate = String(row?.air_date || "").trim();
          const episodes = Array.from({ length: episodeCount }, (_, idx) => ({
            episode: idx + 1,
            name: `Episode ${idx + 1}`,
            runtime: 0,
            airDate,
            isSoon: false,
          }));
          return { season: seasonNumber, episodes };
        })
        .filter(Boolean)
        .sort((a, b) => a.season - b.season);
      nakiosSeasonsCache.set(safeTmdbId, {
        expiresAt: Date.now() + NAKIOS_SEASONS_CACHE_MS,
        value: seasons,
      });
      prunePidoovTimedCache(nakiosSeasonsCache, 4000);
      return seasons;
    } catch {
      return [];
    }
  })();

  nakiosSeasonsInFlight.set(safeTmdbId, task);
  try {
    return await task;
  } finally {
    nakiosSeasonsInFlight.delete(safeTmdbId);
  }
}

async function loadSupplementalCatalogEntries(force = false, options = {}) {
  const fastfluxRows = await loadFastfluxCatalogEntries(force, options);
  const adminData = loadAdminData();
  const baseRows = Array.isArray(fastfluxRows) ? fastfluxRows : [];
  const bySemantic = new Map();
  baseRows.forEach((row) => {
    const key = buildNakiosSemanticKey(row);
    if (!key || key.startsWith("::")) {
      return;
    }
    const current = bySemantic.get(key);
    bySemantic.set(key, pickBestNakiosCatalogRow(current, row));
  });
  const mergedRows = Array.from(bySemantic.values());
  const overridden = mergedRows.map((entry) => applyAdminOverride(entry, adminData)).filter(Boolean);
  const merged = mergeAdminCustomEntries(overridden, adminData);
  supplementalCatalogCache.entries = merged;
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
    const isAnime = Boolean(entry?.isAnime);
    const type = isAnime ? "anime" : String(entry?.type || "").toLowerCase() === "tv" ? "serie" : "film";
    let availabilityStatus = normalizeNakiosAvailabilityStatus(
      entry?.availability_status || entry?.external_status || entry?.status
    );
    if (availabilityStatus === "unknown" && provider === "nakios" && isNakiosLikelyPendingByDate(dateIso)) {
      availabilityStatus = "pending";
    }
    mapped.push({
      source: "supplemental",
      key: `supp-${entry.id}-${dateIso}`,
      dateIso,
      dayNumber: itemDay,
      mediaId: Number(entry?.id || 0),
      title: String(entry?.title || "").trim() || "Sans titre",
      type,
      poster: String(entry?.large_poster_path || entry?.small_poster_path || entry?.wallpaper_poster_path || "").trim(),
      backdrop: String(entry?.wallpaper_poster_path || entry?.large_poster_path || entry?.small_poster_path || "").trim(),
      season: Number(entry?.external_season || 0),
      episode: Number(entry?.external_episode || 0),
      supplemental: ZENIX_BRAND_LABEL,
      categories: [],
      url: "",
      languageHint: String(entry?.external_language || entry?.language || "").trim(),
      hasDetails: false,
      provider: ZENIX_EXTERNAL_PROVIDER,
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
      source: "primary",
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
      url: "",
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
      source: "anime",
      key: `anime-${dayName}|${dateLabel}|${normalizeTitleKey(title)}`,
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
  const sourceHint = normalizeTitleKey(entry?.source || entry?.supplemental || entry?.provider || entry?.origin || "");
  if (sourceHint === "anime") {
    return true;
  }
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
  if (/^\/calendar\//i.test(pathname)) {
    return 90 * 1000;
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
    /^\/calendar\//i.test(pathname) ||
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
  if (
    /video\.sibnet\.ru\/shell\.php/i.test(cleanUrl) ||
    /\/embed[-_/]/i.test(cleanUrl) ||
    /\/player\b/i.test(cleanUrl) ||
    /route=.*\/player/i.test(cleanUrl)
  ) {
    return "embed";
  }

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
  return "unknown";
}

function normalizeProviderName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function rewriteFastfluxCdnUrl(rawUrl) {
  const input = String(rawUrl || "").trim();
  if (!input) {
    return "";
  }
  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    return input;
  }
  const host = String(parsed.hostname || "").toLowerCase();
  if (host.endsWith("cdn.fastflux.xyz")) {
    const file = parsed.pathname || "";
    if (file) {
      return `${FASTFLUX_BASE}/api/video_proxy.php?file=${encodeURIComponent(file)}`;
    }
  }
  return input;
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

function normalizeOwnedSourcesData(data) {
  const base = createEmptyOwnedSourcesData();
  if (!data || typeof data !== "object") {
    return base;
  }
  return {
    ...base,
    ...data,
    movies: data.movies && typeof data.movies === "object" ? data.movies : {},
    tv: data.tv && typeof data.tv === "object" ? data.tv : {},
    series: data.series && typeof data.series === "object" ? data.series : {},
  };
}

function saveZenixOwnedSourcesData(data) {
  const normalized = normalizeOwnedSourcesData(data);
  const payload = `${JSON.stringify(normalized, null, 2)}\n`;
  fs.writeFileSync(ZENIX_OWNED_SOURCES_FILE, payload, "utf8");
  zenixOwnedSourcesCache.loadedAt = Date.now();
  zenixOwnedSourcesCache.mtimeMs = zenixOwnedSourcesCache.loadedAt;
  zenixOwnedSourcesCache.data = normalized;
  return normalized;
}

function readOwnedSourcesForSelection(data, type, mediaId, season = 1, episode = 1) {
  const safeType = String(type || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const safeId = Math.max(1, Number(mediaId || 0));
  if (!safeId) {
    return [];
  }
  const movies = data?.movies && typeof data.movies === "object" ? data.movies : {};
  const tv = data?.tv && typeof data.tv === "object" ? data.tv : {};
  const series = data?.series && typeof data.series === "object" ? data.series : {};
  if (safeType === "movie") {
    const movieNode = readOwnedMediaNode(movies, safeId);
    return readOwnedSourceArray(movieNode);
  }
  const tvNode = readOwnedMediaNode(tv, safeId) || readOwnedMediaNode(series, safeId);
  return resolveOwnedTvSources(tvNode, season, episode);
}

function upsertOwnedSource(data, payload) {
  const safeType = String(payload?.type || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const safeId = Math.max(1, Number(payload?.mediaId || 0));
  if (!safeId) {
    return data;
  }
  const source = payload?.source && typeof payload.source === "object" ? payload.source : {};
  const streamUrl = String(source.stream_url || source.url || "").trim();
  if (!streamUrl) {
    return data;
  }
  const normalized = normalizeOwnedSourcesData(data);
  const targetMap = safeType === "movie" ? normalized.movies : normalized.tv;
  const idKey = String(safeId);
  if (!targetMap[idKey] || typeof targetMap[idKey] !== "object") {
    targetMap[idKey] = {};
  }

  let bucket = null;
  if (safeType === "movie") {
    if (!Array.isArray(targetMap[idKey].sources)) {
      targetMap[idKey].sources = [];
    }
    bucket = targetMap[idKey].sources;
  } else {
    const safeSeason = Math.max(1, Number(payload?.season || 1));
    const safeEpisode = Math.max(1, Number(payload?.episode || 1));
    const seasonKey = String(safeSeason);
    const episodeKey = String(safeEpisode);
    if (!targetMap[idKey][seasonKey] || typeof targetMap[idKey][seasonKey] !== "object") {
      targetMap[idKey][seasonKey] = {};
    }
    const seasonNode = targetMap[idKey][seasonKey];
    if (!seasonNode[episodeKey] || typeof seasonNode[episodeKey] !== "object") {
      seasonNode[episodeKey] = {};
    }
    if (!Array.isArray(seasonNode[episodeKey].sources)) {
      seasonNode[episodeKey].sources = [];
    }
    bucket = seasonNode[episodeKey].sources;
  }

  const exists = bucket.some(
    (entry) => String(entry?.stream_url || entry?.url || "").trim() === streamUrl
  );
  if (!exists) {
    bucket.push({
      stream_url: streamUrl,
      format: String(source.format || "").trim() || undefined,
      quality: String(source.quality || "").trim() || undefined,
      language: String(source.language || "").trim() || undefined,
      source_name: String(source.source_name || source.name || "").trim() || undefined,
      priority: toInt(source.priority, 0, -100000, 100000) || undefined,
    });
  }

  return normalized;
}

function removeOwnedSource(data, payload) {
  const safeType = String(payload?.type || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const safeId = Math.max(1, Number(payload?.mediaId || 0));
  if (!safeId) {
    return data;
  }
  const streamUrl = String(payload?.stream_url || payload?.url || "").trim();
  if (!streamUrl) {
    return data;
  }
  const normalized = normalizeOwnedSourcesData(data);
  const targetMap = safeType === "movie" ? normalized.movies : normalized.tv;
  const idKey = String(safeId);
  const node = targetMap[idKey];
  if (!node || typeof node !== "object") {
    return normalized;
  }

  let bucket = null;
  if (safeType === "movie") {
    bucket = Array.isArray(node.sources) ? node.sources : [];
    node.sources = bucket.filter(
      (entry) => String(entry?.stream_url || entry?.url || "").trim() !== streamUrl
    );
  } else {
    const safeSeason = Math.max(1, Number(payload?.season || 1));
    const safeEpisode = Math.max(1, Number(payload?.episode || 1));
    const seasonKey = String(safeSeason);
    const episodeKey = String(safeEpisode);
    const seasonNode = node[seasonKey];
    const episodeNode = seasonNode?.[episodeKey];
    bucket = Array.isArray(episodeNode?.sources) ? episodeNode.sources : [];
    if (episodeNode && typeof episodeNode === "object") {
      episodeNode.sources = bucket.filter(
        (entry) => String(entry?.stream_url || entry?.url || "").trim() !== streamUrl
      );
    }
  }

  return normalized;
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

async function fetchIptvFrM3u() {
  const response = await fetchRemoteText(IPTV_FR_M3U_URL, "application/x-mpegURL");
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`IPTV FR m3u HTTP ${response.status}`);
  }
  return response.body;
}

function parseM3uAttributes(raw) {
  const attrs = {};
  const line = String(raw || "");
  const attrRegex = /([a-zA-Z0-9_-]+)=\"([^\"]*)\"/g;
  let match;
  while ((match = attrRegex.exec(line))) {
    attrs[match[1]] = match[2];
  }
  const nameSplit = line.split(",");
  const name = nameSplit.length > 1 ? nameSplit.slice(1).join(",").trim() : "";
  return { attrs, name };
}

function parseIptvFrM3u(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  const results = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith("#EXTINF")) {
      continue;
    }
    const { attrs, name } = parseM3uAttributes(line);
    const url = lines[i + 1] || "";
    if (!/^https?:\/\//i.test(url)) {
      continue;
    }
    const title = name || attrs["tvg-name"] || attrs["tvg-id"] || "";
    if (!title) {
      continue;
    }
    const entry = normalizeTvChannelEntry({
      id: `iptv_m3u_${normalizeTitleKey(attrs["tvg-id"] || title) || normalizeTitleKey(url)}`,
      name: title,
      url,
      type: /\.m3u8($|[?#])/i.test(url) ? "hls" : /youtube|embed|player/i.test(url) ? "embed" : "mp4",
      logo: String(attrs["tvg-logo"] || "").trim(),
      group: String(attrs["group-title"] || "France").trim(),
      country: "France",
    });
    if (entry) {
      results.push(entry);
    }
  }
  return results;
}

async function fetchRemoteWithTimeout(target, extraHeaders = {}, timeoutMs = PROXY_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), Math.max(1000, Number(timeoutMs || 0)));
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

async function fetchRemote(target, extraHeaders = {}) {
  return fetchRemoteWithTimeout(target, extraHeaders, PROXY_TIMEOUT_MS);
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
  if (/(^|\/|\s)multi($|\/|\s)/i.test(probe)) {
    return "multi";
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
    if (safeLang === "vf" && inferred === "multi") {
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
  const langInput = String(language || "vostfr").trim().toLowerCase();
  const safeLanguage = langInput === "vf" || langInput === "multi" ? "vf" : "vostfr";
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
  const baseCatalogUrl = catalogUrl.endsWith("/") ? catalogUrl : `${catalogUrl}/`;
  const seasonToken = `saison${safeSeason}`;
  const candidates = [];
  const seenPanelPaths = new Set();
  const pushCandidate = (panel, fallbackLanguage = "") => {
    if (!panel || !panel.path) {
      return;
    }
    const normalizedPath = normalizeAnimePanelPath(panel.path);
    if (!normalizedPath || seenPanelPaths.has(normalizedPath)) {
      return;
    }
    seenPanelPaths.add(normalizedPath);
    candidates.push({
      path: normalizedPath,
      label: String(panel.label || "").trim(),
      language: inferAnimePanelLanguage(panel) || String(fallbackLanguage || "").trim().toLowerCase() || safeLanguage,
    });
  };
  const matchesLanguage = (panel) => {
    const inferred = inferAnimePanelLanguage(panel);
    if (safeLanguage === "vf") {
      return inferred === "vf" || inferred === "multi";
    }
    return inferred === "vostfr";
  };

  panels.forEach((panel) => {
    const path = String(panel?.path || "").toLowerCase();
    if (!path.includes(seasonToken)) {
      return;
    }
    if (matchesLanguage(panel)) {
      pushCandidate(panel);
    }
  });
  if (candidates.length === 0) {
    panels.forEach((panel) => {
      if (matchesLanguage(panel)) {
        pushCandidate(panel);
      }
    });
  }
  if (safeLanguage === "vf" && candidates.length === 0) {
    const vfCandidates = buildAnimeVfCandidatePanels(panels, safeSeason);
    vfCandidates.forEach((candidate) => pushCandidate(candidate, "vf"));
  }
  if (candidates.length === 0) {
    const selectedPanel = chooseAnimePanelPath(panels, safeSeason, safeLanguage);
    if (!selectedPanel || !selectedPanel.path) {
      throw new Error("Anime panel unavailable");
    }
    pushCandidate(selectedPanel, selectedPanel.language || safeLanguage);
  }

  const panelResolutions = [];
  for (const candidate of candidates) {
    const resolved = await tryResolveAnimePanelSources(baseCatalogUrl, candidate.path, safeEpisode);
    if (!resolved) {
      continue;
    }
    panelResolutions.push({
      ...resolved,
      panelPath: candidate.path,
      panelLabel: candidate.label,
      language: candidate.language || safeLanguage,
    });
      if (panelResolutions.length >= ANIME_PANEL_RESOLUTION_LIMIT) {
        break;
      }
  }
  if (panelResolutions.length === 0) {
    throw new Error("Anime season page unavailable");
  }

  const primaryResolution = panelResolutions[0];
  const { seasonPageUrl, episodesScriptUrl, arrays } = primaryResolution;
  const primarySources = Array.isArray(primaryResolution.episodeSources) ? primaryResolution.episodeSources : [];
  if (primarySources.length === 0) {
    throw new Error("Anime sources unavailable");
  }
  const sibnetPick = primarySources.find((entry) => /sibnet\.ru/i.test(String(entry?.candidate || "")));
  const primary = sibnetPick || primarySources[0];
  const sourceUrl = normalizeAnimeEpisodeUrl(primary?.candidate || "");
  if (!sourceUrl) {
    throw new Error("Anime source unavailable");
  }

  const sources = [];
  const seenSources = new Set();
  panelResolutions.forEach((resolution) => {
    const lang = String(resolution.language || safeLanguage).toLowerCase();
    const episodeSources = Array.isArray(resolution.episodeSources) ? resolution.episodeSources : [];
    episodeSources.forEach((entry) => {
      const url = normalizeAnimeEpisodeUrl(entry?.candidate || "");
      if (!url || seenSources.has(url)) {
        return;
      }
      seenSources.add(url);
      sources.push({
        stream_url: url,
        source_name: inferAnimeSourceName(entry?.candidate || "", String(entry?.host || entry?.name || "")),
        format: inferAnimeSourceFormat(entry?.candidate || ""),
        language: lang,
      });
    });
  });
  if (sources.length === 0) {
    throw new Error("Anime sources unavailable");
  }
  const resolvedLanguage = String(primaryResolution.language || safeLanguage).toLowerCase();
  const selectedPanelPath = String(primaryResolution.panelPath || "").trim();
  const selectedPanelLabel = String(primaryResolution.panelLabel || "").trim();
  const matchedRequestedLanguage = safeLanguage === resolvedLanguage || (safeLanguage === "vf" && resolvedLanguage === "multi");

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
    if (safeLanguage === "vf" && panelPick && !["vf", "multi"].includes(String(panelPick.language || ""))) {
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

function buildHlsProxyPath(targetUrl, proxyPath = "/api/hls-proxy") {
  return `${proxyPath}?url=${encodeURIComponent(String(targetUrl || "").trim())}`;
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

function rewriteHlsPlaylistUri(rawUri, baseUrl, proxyPath = "/api/hls-proxy") {
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
    return buildHlsProxyPath(safe.href, proxyPath);
  } catch {
    return value;
  }
}

function rewriteHlsPlaylistBody(playlistBody, baseUrl, proxyPath = "/api/hls-proxy") {
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
        const proxied = rewriteHlsPlaylistUri(uriValue, baseUrl, proxyPath);
        return `URI="${proxied}"`;
      });
    }

    return rewriteHlsPlaylistUri(trimmed, baseUrl, proxyPath);
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

async function fetchWithManualRedirect(targetUrl, options, maxRedirects = 3) {
  let currentUrl = String(targetUrl || "");
  let response = null;
  let redirects = 0;
  let cookieJar = "";
  const baseHeaders = { ...(options?.headers || {}) };
  const updateCookieJar = (setCookieHeader) => {
    const raw = String(setCookieHeader || "").trim();
    if (!raw) {
      return;
    }
    const cookies = raw
      .split(/,(?=[^;]+?=)/)
      .map((chunk) => String(chunk || "").split(";")[0].trim())
      .filter(Boolean);
    if (cookies.length === 0) {
      return;
    }
    const existing = cookieJar ? cookieJar.split(/;\s*/).filter(Boolean) : [];
    const map = new Map();
    existing.forEach((entry) => {
      const [key] = entry.split("=");
      if (key) {
        map.set(key.trim(), entry);
      }
    });
    cookies.forEach((entry) => {
      const [key] = entry.split("=");
      if (key) {
        map.set(key.trim(), entry);
      }
    });
    cookieJar = Array.from(map.values()).join("; ");
  };
  while (currentUrl) {
    const headers = { ...baseHeaders };
    if (cookieJar) {
      headers.Cookie = cookieJar;
    }
    response = await fetch(currentUrl, { ...(options || {}), headers, redirect: "manual" });
    updateCookieJar(response.headers.get("set-cookie"));
    const status = Number(response.status || 0);
    if (![301, 302, 303, 307, 308].includes(status) || redirects >= maxRedirects) {
      try {
        response.__zenixFinalUrl = currentUrl;
      } catch {
        // ignore property assignment failures
      }
      return response;
    }
    const location = response.headers.get("location");
    if (!location) {
      try {
        response.__zenixFinalUrl = currentUrl;
      } catch {
        // ignore property assignment failures
      }
      return response;
    }
    try {
      await response.arrayBuffer();
    } catch {
      // ignore body drain issues
    }
    let nextUrl = "";
    try {
      nextUrl = new URL(location, currentUrl).href;
    } catch {
      nextUrl = "";
    }
    if (!nextUrl || nextUrl === currentUrl) {
      try {
        response.__zenixFinalUrl = currentUrl;
      } catch {
        // ignore property assignment failures
      }
      return response;
    }
    currentUrl = nextUrl;
    redirects += 1;
  }
  return response;
}

async function fetchHlsUpstreamWithFallback(target, range, signal, method = "GET") {
  const safeMethod = String(method || "GET").toUpperCase() === "HEAD" ? "HEAD" : "GET";
  const baseHeaders = {
    Accept: "*/*",
    "User-Agent": HLS_PROXY_USER_AGENT,
  };
  const targetHost = String(target?.hostname || "").toLowerCase();
  const fsvidHeaders = targetHost.endsWith("fsvid.lol")
    ? {
        Referer: "https://fsvid.lol/",
        Origin: "https://fsvid.lol",
      }
    : null;
  const fastfluxHeaders =
    targetHost.endsWith("fastflux.xyz") || targetHost.endsWith("cdn.fastflux.xyz")
      ? {
          Referer: `${FASTFLUX_BASE}/`,
          Origin: FASTFLUX_BASE,
        }
      : null;
  const nakiosHeaders = targetHost.endsWith("nakios.site")
    ? {
        Referer: "https://nakios.site/",
        Origin: "https://nakios.site",
      }
    : null;
  const headerVariants = [
    {
      Referer: `${target.origin}/`,
      Origin: target.origin,
    },
    ...(fsvidHeaders ? [fsvidHeaders] : []),
    ...(fastfluxHeaders ? [fastfluxHeaders] : []),
    ...(nakiosHeaders ? [nakiosHeaders] : []),
    {
      Referer: `${PURSTREAM_WEB_BASE}/`,
      Origin: PURSTREAM_WEB_BASE,
    },
    {},
  ];

  let lastResponse = null;
  const retryableStatuses = new Set([401, 403, 404, 405, 416, 429]);
  const isFastfluxHost = targetHost.endsWith("fastflux.xyz") || targetHost.endsWith("cdn.fastflux.xyz");
  for (let index = 0; index < headerVariants.length; index += 1) {
    const headers = {
      ...baseHeaders,
      ...headerVariants[index],
    };
    if (range) {
      headers.Range = range;
    }

    const upstream = await fetchWithManualRedirect(
      target.href,
      {
        method: safeMethod,
        headers,
        signal,
      },
      4
    );
    lastResponse = upstream;
    const status = Number(upstream.status || 0);
    const shouldRetry =
      status === 403 ||
      status === 429 ||
      (isFastfluxHost && retryableStatuses.has(status));
    if (!shouldRetry) {
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

function sendGateDenied(res) {
  res.writeHead(403, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Zenix-Gate": "required",
  });
  res.end(JSON.stringify({ error: "adblock_required" }));
}

function isGateProtectedPath(pathname) {
  if (!pathname.startsWith("/api/")) {
    return false;
  }
  if (/^\/api\/analytics\//i.test(pathname)) {
    return false;
  }
  if (/^\/api\/admin\//i.test(pathname)) {
    return false;
  }
  if (/^\/api\/catalog\//i.test(pathname)) {
    return false;
  }
  if (/^\/api\/calendar\//i.test(pathname)) {
    return false;
  }
  if (/^\/api\/search-bar\//i.test(pathname)) {
    return false;
  }
  if (/^\/api\/media\//i.test(pathname)) {
    return false;
  }
  if (pathname === "/api/zenix-seasons") {
    return false;
  }
  if (pathname === "/api/zenix-source") {
    return false;
  }
  if (pathname === "/api/zenix-anime-source") {
    return false;
  }
  if (pathname === "/api/repair-global") {
    return false;
  }
  if (pathname === "/api/repair-status") {
    return false;
  }
  if (pathname === "/api/zenix-anime-seasons") {
    return false;
  }
  if (pathname === "/api/announcement") {
    return false;
  }
  if (pathname === "/api/backup-config") {
    return false;
  }
  if (pathname === "/api/backup-cache") {
    return false;
  }
  if (pathname === "/api/requests") {
    return false;
  }
  if (pathname === "/api/tv-channels") {
    return false;
  }
  if (pathname === "/api/suggestions") {
    return false;
  }
  if (pathname === "/api/hls-proxy") {
    return false;
  }
  if (pathname === "/api/hls-proxy-mobile") {
    return false;
  }
  if (/^\/api\/gate\//i.test(pathname)) {
    return false;
  }
  return true;
}

async function handleGateGuard(req, res, requestUrl) {
  if (GATE_DISABLED) {
    return false;
  }
  if (!isGateProtectedPath(requestUrl.pathname)) {
    return false;
  }
  if (String(req.method || "").toUpperCase() === "OPTIONS") {
    return false;
  }
  const token = getGateToken(req);
  if (token && verifyGateToken(token, req)) {
    return false;
  }
  sendGateDenied(res);
  return true;
}

async function handleGateChallenge(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/gate/challenge") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  pruneGateChallenges();
  const nonce = crypto.randomBytes(16).toString("hex");
  const fingerprint = buildGateFingerprint(req);
  gateChallenges.set(nonce, { fingerprint, expiresAt: Date.now() + GATE_CHALLENGE_TTL_MS });
  sendJson(res, 200, {
    nonce,
    script: `${GATE_ADSCRIPT_PATH}?nonce=${encodeURIComponent(nonce)}`,
    expiresInMs: GATE_CHALLENGE_TTL_MS,
  });
  return true;
}

async function handleGateIssue(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/gate/issue") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  pruneGateChallenges();
  let payload;
  try {
    payload = await readJsonBody(req, 4096);
  } catch {
    sendJson(res, 400, { error: "Invalid request body" });
    return true;
  }
  const nonce = sanitizeToken(payload?.nonce, 120);
  const proof = sanitizeToken(payload?.proof, 256);
  const entry = gateChallenges.get(nonce);
  if (!entry || Number(entry.expiresAt || 0) <= Date.now()) {
    sendGateDenied(res);
    return true;
  }
  const fingerprint = buildGateFingerprint(req);
  if (entry.fingerprint !== fingerprint) {
    sendGateDenied(res);
    return true;
  }
  const expected = buildGateProof(nonce, entry.fingerprint);
  if (!safeTimingEqual(expected, proof)) {
    sendGateDenied(res);
    return true;
  }
  gateChallenges.delete(nonce);
  const token = buildGateToken(entry.fingerprint, GATE_TOKEN_TTL_MS);
  setGateCookie(res, token, GATE_TOKEN_TTL_MS);
  sendJson(res, 200, { ok: true, token: token, expiresInMs: GATE_TOKEN_TTL_MS });
  return true;
}

async function handleGateScript(req, res, requestUrl) {
  if (requestUrl.pathname !== GATE_ADSCRIPT_PATH) {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  const nonce = sanitizeToken(requestUrl.searchParams.get("nonce"), 120);
  const entry = gateChallenges.get(nonce);
  if (!entry || Number(entry.expiresAt || 0) <= Date.now()) {
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end("Not Found");
    return true;
  }
  const proof = buildGateProof(nonce, entry.fingerprint);
  res.writeHead(200, {
    "Content-Type": "application/javascript; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(
    `window.__zenixAdNonce=${JSON.stringify(nonce)};window.__zenixAdProof=${JSON.stringify(
      proof
    )};`
  );
  return true;
}

const HLS_PROXY_PATH = "/api/hls-proxy";
const HLS_PROXY_MOBILE_PATH = "/api/hls-proxy-mobile";

function isAllowedMobileProxyTarget(targetUrl) {
  const safe = String(targetUrl || "");
  return /https?:\/\/zebi\.xalaflix\.design\/movie\/920\//i.test(safe);
}

async function handleHlsProxy(req, res, requestUrl) {
  const isMobileProxy = requestUrl.pathname === HLS_PROXY_MOBILE_PATH;
  if (!isMobileProxy && requestUrl.pathname !== HLS_PROXY_PATH) {
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
  if (isMobileProxy && !isAllowedMobileProxyTarget(target.href)) {
    sendJson(res, 403, { error: "Forbidden" });
    return true;
  }
  const proxyPath = isMobileProxy ? HLS_PROXY_MOBILE_PATH : HLS_PROXY_PATH;

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

    let status = Number(upstream.status || 502);
    let contentType = String(upstream.headers.get("content-type") || "").toLowerCase();
    const isPlaylist =
      target.pathname.toLowerCase().endsWith(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("vnd.apple.mpegurl");

    if (!isPlaylist && range && [400, 401, 403, 404, 405, 416, 429].includes(status)) {
      try {
        await upstream.arrayBuffer();
      } catch {
        // ignore body drain issues
      }
      upstream = await fetchHlsUpstreamWithFallback(target, "", controller.signal, "GET");
      status = Number(upstream.status || 502);
      contentType = String(upstream.headers.get("content-type") || "").toLowerCase();
    }

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
      const rewriteBase = upstream?.__zenixFinalUrl || target.href;
      let rewritten = rewriteHlsPlaylistBody(bodyText, rewriteBase, proxyPath);
      if (!rewritten.includes("#EXTM3U")) {
        const rescueDecoded =
          decodeNumericPlaylistBySeparators(rewritten) || decodeNumericPlaylistBySeparators(rawPlaylist);
        if (rescueDecoded.includes("#EXTM3U")) {
          rewritten = rewriteHlsPlaylistBody(rescueDecoded, rewriteBase, proxyPath);
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

async function handleAnalyticsOnline(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/analytics/online") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  const stats = buildAnalyticsSnapshot();
  sendJson(res, 200, {
    type: "success",
    generatedAt: stats.generatedAt,
    activeNow: Number(stats.activeNow || 0),
    activeIps: Number(stats.activeIps || 0),
  });
  return true;
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

async function handleAnalyticsPlaybackFail(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/analytics/playback-fail") {
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
  let payload;
  try {
    payload = await readJsonBody(req, 4096);
  } catch {
    sendJson(res, 400, { error: "Invalid payload" });
    return true;
  }
  const ip = normalizeIpForAnalytics(getRemoteAddress(req));
  const result = recordPlaybackFailure(ip);
  sendJson(res, 200, {
    ok: true,
    active: result.active,
    triggered: result.triggered,
    lastGlobalAt: result.lastGlobalAt || 0,
  });
  return true;
}

async function handleRequestsPublic(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/requests") {
    return false;
  }
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      Allow: "GET, POST, OPTIONS",
      "Cache-Control": "no-cache",
    });
    res.end();
    return true;
  }
  if (req.method === "GET") {
    const data = loadAdminData(true);
    const list = Array.isArray(data.requests) ? data.requests : [];
    const sanitized = list.map((entry) => {
      if (!entry || typeof entry !== "object") {
        return entry;
      }
      const { url, ...rest } = entry;
      return rest;
    });
    sendJson(res, 200, { type: "success", data: sanitized });
    return true;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  let payload;
  try {
    payload = await readJsonBody(req, 16 * 1024);
  } catch {
    sendJson(res, 400, { error: "Invalid request body" });
    return true;
  }

  const sanitizedEntry = normalizeRequestEntry({
    ...payload,
    type: normalizeRequestType(payload?.type),
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  if (!sanitizedEntry) {
    sendJson(res, 400, { error: "Missing title" });
    return true;
  }

  const remoteIp = getRemoteAddress(req);
  const rateLimit = checkRequestRateLimit(remoteIp);
  if (rateLimit.limited) {
    sendJson(res, 429, {
      error: "Too many requests, please try again in a moment.",
      retryAfterMs: rateLimit.retryAfterMs,
    });
    return true;
  }

  const fingerprint = buildRequestFingerprint({
    ip: sanitizeToken(remoteIp, 80),
    tmdbId: sanitizedEntry.tmdbId,
    type: sanitizedEntry.type,
    title: sanitizedEntry.title,
    year: sanitizedEntry.year,
  });
  const dupe = checkRequestDuplicate(fingerprint);
  if (dupe.duplicate) {
    sendJson(res, 200, { ok: true, duplicate: true });
    return true;
  }

  const data = loadAdminData(true);
  const list = Array.isArray(data.requests) ? data.requests.slice() : [];
  const key = buildRequestKey(sanitizedEntry);
  if (key) {
    const existingIndex = list.findIndex((entry) => buildRequestKey(entry) === key);
    if (existingIndex >= 0) {
      const existing = normalizeRequestEntry(list[existingIndex]) || list[existingIndex];
      const updated = {
        ...existing,
        updatedAt: new Date().toISOString(),
      };
      list[existingIndex] = updated;
      data.requests = list;
      saveAdminData(data);
      rememberRequestFingerprint(fingerprint);
      sendJson(res, 200, { ok: true, duplicate: true, data: updated });
      return true;
    }
  }

  list.unshift(sanitizedEntry);
  if (list.length > 320) {
    list.length = 320;
  }
  data.requests = list;
  saveAdminData(data);
  rememberRequestFingerprint(fingerprint);
  sendJson(res, 200, { ok: true, data: sanitizedEntry });
  return true;
}

async function handleAdminRequestsUpdate(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/requests/update") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  let body = null;
  try {
    body = await readJsonBody(req, 4096);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return true;
  }
  const id = sanitizeToken(body?.id, 80);
  if (!id) {
    sendJson(res, 400, { error: "Missing request id" });
    return true;
  }
  const status = normalizeRequestStatus(body?.status || "pending");
  const url = sanitizeHttpUrl(body?.url || body?.stream_url || body?.streamUrl, 900);
  const data = loadAdminData(true);
  const list = Array.isArray(data.requests) ? data.requests.slice() : [];
  const idx = list.findIndex((entry) => String(entry?.id || "") === id);
  if (idx < 0) {
    sendJson(res, 404, { error: "Request not found" });
    return true;
  }
  const updated = {
    ...list[idx],
    status,
    url: url || list[idx]?.url || "",
    updatedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  data.requests = list;
  if (status === "in_catalog" && url) {
    const entry = buildAdminCustomEntryFromDirectRequest(updated, url);
    if (entry) {
      upsertAdminCustomEntry(data, entry);
    }
  }
  saveAdminData(data);
  sendJson(res, 200, { ok: true, data: updated });
  return true;
}

async function handleAdminRequestsDelete(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/requests/delete") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  let body = null;
  try {
    body = await readJsonBody(req, 4096);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return true;
  }
  const id = sanitizeToken(body?.id, 80);
  if (!id) {
    sendJson(res, 400, { error: "Missing request id" });
    return true;
  }
  const data = loadAdminData(true);
  const list = Array.isArray(data.requests) ? data.requests : [];
  const next = list.filter((entry) => String(entry?.id || "") !== id);
  data.requests = next;
  saveAdminData(data);
  sendJson(res, 200, { ok: true });
  return true;
}

async function handleTvChannelsPublic(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/tv-channels") {
    return false;
  }
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      Allow: "GET, OPTIONS",
      "Cache-Control": "no-cache",
    });
    res.end();
    return true;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  purgeAdminTvChannelsOnce();
  const source = "iptv-org";
  const country = "France";
  const query = String(requestUrl.searchParams.get("q") || "").trim();
  const limit = toInt(requestUrl.searchParams.get("limit"), 0, 0, 2000);

  let list = [];
  try {
    list = await getIptvOrgFrChannels({ query });
  } catch {
    list = [];
  }
  if (limit > 0 && list.length > limit) {
    list = list.slice(0, limit);
  }
  sendJson(res, 200, {
    type: "success",
    data: list,
    meta: {
      source,
      country,
      count: list.length,
      countries: [country],
    },
  });
  return true;
}

async function handleAdminTvChannels(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/tv-channels") {
    return false;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  if (req.method === "POST") {
    let body = null;
    try {
      body = await readJsonBody(req, 8192);
    } catch {
      sendJson(res, 400, { error: "Invalid JSON" });
      return true;
    }
    const entry = normalizeTvChannelEntry(body);
    if (!entry) {
      sendJson(res, 400, { error: "Invalid channel data" });
      return true;
    }
    const data = loadAdminData(true);
    const list = Array.isArray(data.tvChannels) ? data.tvChannels.slice() : [];
    const idx = list.findIndex(
      (channel) =>
        String(channel?.id || "") === entry.id ||
        (String(channel?.url || "") === entry.url && normalizeTitleKey(channel?.name || "") === normalizeTitleKey(entry.name))
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...entry, updatedAt: new Date().toISOString() };
    } else {
      list.push(entry);
    }
    list.sort((left, right) => {
      const orderDiff = Number(left?.order || 0) - Number(right?.order || 0);
      if (orderDiff !== 0) return orderDiff;
      return String(left?.name || "").localeCompare(String(right?.name || ""), "fr", { sensitivity: "base" });
    });
    data.tvChannels = list;
    saveAdminData(data);
    sendJson(res, 200, { ok: true, data: entry });
    return true;
  }
  if (req.method === "DELETE") {
    let body = null;
    try {
      body = await readJsonBody(req, 4096);
    } catch {
      sendJson(res, 400, { error: "Invalid JSON" });
      return true;
    }
    const id = sanitizeToken(body?.id, 80);
    if (!id) {
      sendJson(res, 400, { error: "Missing channel id" });
      return true;
    }
    const data = loadAdminData(true);
    const list = Array.isArray(data.tvChannels) ? data.tvChannels : [];
    data.tvChannels = list.filter((entry) => String(entry?.id || "") !== id);
    saveAdminData(data);
    sendJson(res, 200, { ok: true });
    return true;
  }
  sendJson(res, 405, { error: "Method Not Allowed" });
  return true;
}

async function handleAnnouncement(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/announcement") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  const data = loadAdminData();
  const active = getActiveAnnouncement(data);
  sendJson(res, 200, { data: active || null });
  return true;
}

async function handleBackupConfig(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/backup-config") {
    return false;
  }
  const origin = String(req.headers.origin || "");
  setBackupCors(res, origin);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }
  if (req.method === "GET") {
    const data = loadBackupConfig();
    sendJson(res, 200, { data });
    return true;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!ADMIN_PASSWORD) {
    sendJson(res, 503, { error: "Admin disabled" });
    return true;
  }
  const ip = getRemoteAddress(req);
  if (!isAdminLoginAllowed(ip)) {
    sendJson(res, 429, { error: "Too many attempts" });
    return true;
  }
  let body = null;
  try {
    body = await readJsonBody(req, 4096);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return true;
  }
  const password = String(body?.password || "");
  if (!timingSafeEqualStrings(password, ADMIN_PASSWORD)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  const nextUrl = normalizeBackupUrl(body?.url);
  if (!nextUrl) {
    sendJson(res, 400, { error: "Invalid URL" });
    return true;
  }
  const existing = loadBackupConfig(true);
  const updated = {
    currentUrl: nextUrl,
    previousUrl: existing.currentUrl && existing.currentUrl !== nextUrl ? existing.currentUrl : existing.previousUrl || "",
    updatedAt: Date.now(),
  };
  const saved = saveBackupConfig(updated);
  sendJson(res, 200, { ok: true, data: saved });
  return true;
}

async function handleBackupCache(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/backup-cache") {
    return false;
  }
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      Allow: "GET, POST, OPTIONS",
      "Cache-Control": "no-cache",
    });
    res.end();
    return true;
  }
  if (req.method === "GET") {
    const mediaType = String(requestUrl.searchParams.get("type") || "movie").toLowerCase() === "tv" ? "tv" : "movie";
    const mediaId = toInt(requestUrl.searchParams.get("mediaId"), 0, 0, 999999999);
    const season = toInt(requestUrl.searchParams.get("season"), 1, 1, 500);
    const episode = toInt(requestUrl.searchParams.get("episode"), 1, 1, 50000);
    if (!mediaId) {
      sendJson(res, 200, { ok: false, data: null });
      return true;
    }
    const entry = fetchBackupCacheEntry(mediaType, mediaId, season, episode);
    if (!entry) {
      sendJson(res, 200, { ok: false, data: null });
      return true;
    }
    sendJson(res, 200, { ok: true, data: entry });
    return true;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  let payload;
  try {
    payload = await readJsonBody(req, 64 * 1024);
  } catch {
    sendJson(res, 400, { error: "Invalid payload" });
    return true;
  }
  const mediaType = String(payload?.mediaType || payload?.type || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const mediaId = toInt(payload?.mediaId || payload?.id, 0, 0, 999999999);
  if (!mediaId) {
    sendJson(res, 400, { error: "Missing mediaId" });
    return true;
  }
  updateBackupCacheEntry({
    mediaType,
    mediaId,
    season: toInt(payload?.season, 1, 1, 500),
    episode: toInt(payload?.episode, 1, 1, 50000),
    sources: payload?.sources || [],
    provider: payload?.provider || "",
  });
  sendJson(res, 200, { ok: true });
  return true;
}

function normalizeAdminOverridePatch(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const patch = {};
  if (raw.title) {
    patch.title = String(raw.title || "").trim();
  }
  if (raw.overview) {
    patch.overview = String(raw.overview || "").trim();
  }
  if (raw.poster) {
    patch.poster = String(raw.poster || "").trim();
  }
  if (raw.backdrop) {
    patch.backdrop = String(raw.backdrop || "").trim();
  }
  if (raw.release_date) {
    patch.release_date = String(raw.release_date || "").trim();
  }
  if (raw.availability_status) {
    patch.availability_status = normalizeNakiosAvailabilityStatus(raw.availability_status) || "";
  }
  if (raw.type) {
    patch.type = String(raw.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  }
  if (raw.isAnime !== undefined) {
    patch.isAnime = Boolean(raw.isAnime);
  }
  if (raw.external_detail_url) {
    patch.external_detail_url = String(raw.external_detail_url || "").trim();
  }
  if (raw.hidden !== undefined) {
    patch.hidden = Boolean(raw.hidden);
  }
  return Object.keys(patch).length > 0 ? patch : null;
}

async function handleAdminSession(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/session") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  sendJson(res, 200, { ok: isAdminAuthenticated(req) });
  return true;
}

async function handleAdminLogin(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/login") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!ADMIN_PASSWORD) {
    sendJson(res, 503, { error: "Admin disabled" });
    return true;
  }
  const ip = getRemoteAddress(req);
  if (!isAdminLoginAllowed(ip)) {
    sendJson(res, 429, { error: "Too many attempts" });
    return true;
  }
  let body = null;
  try {
    body = await readJsonBody(req, 4096);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return true;
  }
  const password = String(body?.password || "");
  if (!timingSafeEqualStrings(password, ADMIN_PASSWORD)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  const token = crypto.randomBytes(32).toString("hex");
  adminSessions.set(token, {
    createdAt: Date.now(),
    expiresAt: Date.now() + ADMIN_SESSION_TTL_MS,
    ip,
    userAgent: String(req.headers["user-agent"] || ""),
  });
  setAdminCookie(res, token);
  sendJson(res, 200, { ok: true });
  return true;
}

async function handleAdminLogout(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/logout") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  const session = getAdminSession(req);
  if (session) {
    for (const [token, row] of adminSessions.entries()) {
      if (row === session) {
        adminSessions.delete(token);
        break;
      }
    }
  }
  clearAdminCookie(res);
  sendJson(res, 200, { ok: true });
  return true;
}

async function handleAdminData(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/data") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  const data = loadAdminData(true);
  if (Array.isArray(data.custom) && data.custom.length > 0) {
    const filtered = data.custom.filter((entry) => !isDisallowedExternalEntry(entry));
    if (filtered.length !== data.custom.length) {
      data.custom = filtered;
      saveAdminData(data);
    }
  }
  sendJson(res, 200, { data });
  return true;
}

async function handleAdminAnalytics(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/analytics") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  const stats = buildAnalyticsSnapshot();
  sendJson(res, 200, {
    type: "success",
    data: {
      generatedAt: stats.generatedAt,
      activeNow: Number(stats.activeNow || 0),
      watchingNow: Number(stats.playingNow || 0),
      unique24h: Number(stats.unique24h || 0),
      unique48h: Number(stats.unique48h || 0),
      totalSeen: Number(stats.totalSeen || 0),
    },
  });
  return true;
}

async function handleAdminHealth(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/health") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  const now = Date.now();
  const degraded = isFastfluxHealthDegraded(now);
  sendJson(res, 200, {
    type: "success",
    data: {
      generatedAt: new Date().toISOString(),
      globalRepairEpoch: Number(globalRepairEpoch || 0),
      playbackFailActive: playbackFailureByIp.size,
      playbackFailWindowMs: PLAYBACK_FAIL_WINDOW_MS,
      playbackFailThreshold: PLAYBACK_FAIL_THRESHOLD,
      playbackFailCooldownMs: PLAYBACK_FAIL_COOLDOWN_MS,
      fastflux: {
        enabled: USE_FASTFLUX,
        degraded,
        warmupIntervalMs: FASTFLUX_WARMUP_INTERVAL_MS,
        warmupLastAt: fastfluxWarmupLastAt,
        warmupLastOkAt: fastfluxWarmupLastOkAt,
        healthIntervalMs: FASTFLUX_HEALTH_INTERVAL_MS,
        healthLastRunAt: fastfluxHealthLastRunAt,
        healthLastOkAt: fastfluxHealthLastOkAt,
        healthFailStreak: fastfluxHealthFailStreak,
        healthFailThreshold: FASTFLUX_HEALTH_FAIL_THRESHOLD,
        healthCooldownMs: FASTFLUX_HEALTH_FAIL_COOLDOWN_MS,
        healthLastRepairAt: fastfluxHealthLastRepairAt,
      },
      serverTime: now,
    },
  });
  return true;
}

async function handleAdminAnnouncement(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/announcement") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  let body = null;
  try {
    body = await readJsonBody(req, 8192);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return true;
  }
  const message = String(body?.message || "").trim();
  const enabled = Boolean(body?.enabled);
  const durationHours = Number(body?.durationHours || 0);
  const expiresAt = enabled && durationHours > 0 ? Date.now() + durationHours * 3600 * 1000 : 0;
  const data = loadAdminData(true);
  data.announcement = {
    message,
    enabled: Boolean(enabled && message),
    expiresAt,
    updatedAt: new Date().toISOString(),
  };
  saveAdminData(data);
  sendJson(res, 200, { ok: true, data: data.announcement });
  return true;
}

function parseAdminImportUrl(input) {
  const raw = String(input || "").trim();
  if (!raw) {
    return null;
  }
  let parsed = null;
  try {
    parsed = new URL(raw, "https://zenix.best");
  } catch {
    return null;
  }
  const host = String(parsed.hostname || "").toLowerCase();
  const pathName = String(parsed.pathname || "").toLowerCase();
  if (host.endsWith("nakios.site")) {
    if (!USE_NAKIOS) {
      return null;
    }
    const match = pathName.match(/\/(movie|movies|film|serie|series|tv)\/(?<id>\d+)/i);
    if (!match) {
      return null;
    }
    const id = toInt(match.groups?.id, 0, 0, 999999999);
    if (id <= 0) {
      return null;
    }
    const typeToken = String(match[1] || "").toLowerCase();
    const mediaType = typeToken === "serie" || typeToken === "series" || typeToken === "tv" ? "tv" : "movie";
    return { provider: "nakios", mediaType, tmdbId: id };
  }
  if (host.endsWith("fastflux.xyz")) {
    const match = pathName.match(/\/(movie|movies|film|serie|series|tv)\/(?<id>\d+)/i);
    if (!match) {
      return null;
    }
    const id = toInt(match.groups?.id, 0, 0, 999999999);
    if (id <= 0) {
      return null;
    }
    const typeToken = String(match[1] || "").toLowerCase();
    const mediaType = typeToken === "serie" || typeToken === "series" || typeToken === "tv" ? "tv" : "movie";
    return { provider: "fastflux", mediaType, tmdbId: id };
  }
  if (/anime-sama\.(tv|to)$/i.test(host)) {
    const safe = sanitizeAnimeSamaCatalogUrl(parsed.href);
    if (!safe) {
      return null;
    }
    return { provider: "anime-sama", catalogUrl: safe };
  }
  if (host.endsWith(FILMER2_HOST)) {
    if (!USE_FILMER2) {
      return null;
    }
    const match = pathName.match(/\/(movie|tv)\/[^/]+\.html/i);
    if (!match) {
      return null;
    }
    const mediaType = match[1].toLowerCase() === "tv" ? "tv" : "movie";
    return { provider: "filmer2", mediaType, detailUrl: parsed.href };
  }
  if (USE_MOVIX) {
    const movixParsed = parseMovixUrl(parsed.href);
    if (movixParsed) {
      return movixParsed;
    }
  }
  if (USE_NOCTA) {
    const noctaParsed = parseNoctaUrl(parsed.href);
    if (noctaParsed) {
      return noctaParsed;
    }
  }
  if (USE_YOUTUBE && /youtube\.com|youtu\.be/i.test(host)) {
    const playlistId = parseYoutubePlaylistId(parsed.href);
    if (!playlistId) {
      return null;
    }
    return { provider: "youtube", playlistId };
  }
  return null;
}

async function importAdminEntryByUrl(url) {
  const parsed = parseAdminImportUrl(url);
  if (!parsed) {
    return null;
  }
  let entry = null;
  if (parsed.provider === "nakios") {
    const target =
      parsed.mediaType === "tv"
        ? `${NAKIOS_API_BASE}/api/series/${parsed.tmdbId}`
        : `${NAKIOS_API_BASE}/api/movies/${parsed.tmdbId}`;
    const response = await fetchRemote(target, NAKIOS_FETCH_HEADERS);
    if (response.status >= 200 && response.status < 300) {
      const detail = parseJsonSafe(response.body);
      entry = buildAdminCustomEntryFromNakios(detail, parsed.mediaType);
    }
  } else if (parsed.provider === "fastflux") {
    const detail = await fetchFastfluxEntryByTmdbId(parsed.mediaType, parsed.tmdbId);
    if (detail) {
      entry = buildAdminCustomEntryFromFastflux(detail, parsed.mediaType);
    }
  } else if (parsed.provider === "anime-sama") {
    const response = await fetchRemoteText(parsed.catalogUrl, "text/html", {
      "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
    });
    if (response.status >= 200 && response.status < 300) {
      entry = buildAdminCustomEntryFromAnimeSama(parsed.catalogUrl, response.body || "");
    }
  } else if (parsed.provider === "filmer2") {
    const detail = await fetchFilmer2Detail(parsed.detailUrl);
    if (detail) {
      entry = buildAdminCustomEntryFromFilmer2(detail, parsed.mediaType);
    }
  } else if (parsed.provider === "movix") {
    entry = await buildAdminCustomEntryFromMovix(parsed);
  } else if (parsed.provider === "nocta") {
    entry = await buildAdminCustomEntryFromNocta(parsed);
  } else if (parsed.provider === "youtube") {
    entry = await buildAdminCustomEntryFromYoutubePlaylist(parsed.playlistId);
  }
  if (entry) {
    entry.force_duplicate = true;
  }
  return entry;
}

function upsertAdminCustomEntry(data, entry) {
  if (!data || !entry) {
    return null;
  }
  const custom = Array.isArray(data.custom) ? data.custom.slice() : [];
  const externalKey = String(entry?.external_key || "").trim();
  const existingIndex = externalKey
    ? custom.findIndex((row) => String(row?.external_key || "") === externalKey)
    : -1;
  if (existingIndex >= 0) {
    custom[existingIndex] = entry;
  } else {
    custom.unshift(entry);
  }
  data.custom = custom;
  saveAdminData(data);
  return entry;
}

async function handleAdminImport(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/import") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  let body = null;
  try {
    body = await readJsonBody(req, 8192);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return true;
  }
  const url = String(body?.url || "").trim();
  const entry = await importAdminEntryByUrl(url);
  if (!entry) {
    sendJson(res, 404, { error: "Import failed" });
    return true;
  }
  const data = loadAdminData(true);
  const saved = upsertAdminCustomEntry(data, entry);
  sendJson(res, 200, { ok: true, data: saved });
  return true;
}

async function handleAdminSearch(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/search") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  const query = String(requestUrl.searchParams.get("q") || "").trim();
  if (query.length < 2) {
    sendJson(res, 400, { error: "Missing query" });
    return true;
  }

  const target = `${PURSTREAM_API_BASE}/search-bar/search/${encodeURIComponent(query)}`;
  const purstreamResponse = await fetchRemote(target, {
    Referer: `${PURSTREAM_WEB_BASE}/`,
    Origin: PURSTREAM_WEB_BASE,
    "Accept-Language": DEFAULT_ACCEPT_LANGUAGE,
  });
  const purstreamPayload = purstreamResponse.status >= 200 && purstreamResponse.status < 300
    ? parseJsonSafe(purstreamResponse.body)
    : null;
  let fastfluxResults = [];
  try {
    const [movieRows, seriesRows] = await Promise.all([
      searchFastfluxCatalog(query, "movie"),
      searchFastfluxCatalog(query, "tv"),
    ]);
    fastfluxResults = [...(movieRows || []), ...(seriesRows || [])];
  } catch {
    fastfluxResults = [];
  }

  sendJson(res, 200, {
    ok: true,
    query,
    purstream: purstreamPayload || null,
    primary: purstreamPayload || null,
    fastflux: fastfluxResults,
  });
  return true;
}

async function handleAdminSuggestions(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/suggestions") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  const type = String(requestUrl.searchParams.get("type") || "movie").trim().toLowerCase();
  const limit = toInt(requestUrl.searchParams.get("limit"), 3, 1, 8);
  const suggestions = await buildAdminSuggestions(type, limit);
  sendJson(res, 200, { ok: true, data: suggestions });
  return true;
}

async function handleAdminSuggestionSkip(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/suggestions/skip") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  let body = null;
  try {
    body = await readJsonBody(req, 4096);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return true;
  }
  const key = String(body?.key || "").trim();
  if (!key) {
    sendJson(res, 400, { error: "Missing key" });
    return true;
  }
  const data = loadAdminData(true);
  markSuggestionSkipped(data, key, "manual");
  pruneSuggestionSkips(data);
  saveAdminData(data);
  sendJson(res, 200, { ok: true });
  return true;
}

async function handleAdminSuggestionAccept(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/suggestions/accept") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  let body = null;
  try {
    body = await readJsonBody(req, 8192);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return true;
  }
  const key = String(body?.key || "").trim();
  const url = String(body?.url || body?.importUrl || "").trim();
  if (!url) {
    sendJson(res, 400, { error: "Missing URL" });
    return true;
  }
  const entry = await importAdminEntryByUrl(url);
  if (!entry) {
    sendJson(res, 404, { error: "Import failed" });
    return true;
  }
  const data = loadAdminData(true);
  if (key) {
    clearSuggestionSkip(data, key);
  }
  const saved = upsertAdminCustomEntry(data, entry);
  sendJson(res, 200, { ok: true, data: saved });
  return true;
}

async function handleFilmer2Search(req, res, requestUrl) {
  const isLegacy = requestUrl.pathname === "/api/filmer2-search";
  const isZenix = requestUrl.pathname === "/api/zenix-search";
  if (!isLegacy && !isZenix) {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  const query = String(requestUrl.searchParams.get("q") || "").trim();
  if (query.length < 2) {
    sendJson(res, 400, { error: "Query too short" });
    return true;
  }
  const typeParam = String(requestUrl.searchParams.get("type") || "").trim().toLowerCase();
  const normalizedType = typeParam === "tv" || typeParam === "movie" ? typeParam : "";
  const safeYear = toInt(requestUrl.searchParams.get("year"), 0, 0, 2099);
  const queryKey = normalizeTitleKey(query);
  let matches = [];
  try {
    if (normalizedType) {
      const rows = await searchFastfluxCatalog(query, normalizedType);
      matches = Array.isArray(rows) ? rows : [];
    } else {
      const [movies, series] = await Promise.all([
        searchFastfluxCatalog(query, "movie"),
        searchFastfluxCatalog(query, "tv"),
      ]);
      matches = [...(movies || []), ...(series || [])];
    }
  } catch {
    matches = [];
  }
  const normalizedMatches = matches
    .map((row) => {
      const tmdbId = toInt(row?.tmdb_id || row?.tmdbId, 0, 0, 999999999);
      const title = String(row?.title || row?.series_name || row?.name || "").trim();
      if (!title || !tmdbId) {
        return null;
      }
      const typeRaw = String(row?.type || row?.media_type || "").toLowerCase();
      const rowType = typeRaw === "series" || typeRaw === "tv" ? "tv" : "movie";
      const poster = String(row?.poster || row?.poster_path || "").trim();
      const backdrop = String(
        row?.backdrop || row?.backdrop_path || row?.backdrop_url || row?.fanart || ""
      ).trim();
      const overview = String(row?.overview || row?.description || row?.synopsis || row?.plot || "").trim();
      return {
        title,
        type: rowType,
        year: toInt(row?.year, 0, 0, 2099),
        url: buildFastfluxImportUrlFromCandidate({ tmdbId, type: rowType }),
        poster,
        backdrop,
        overview,
        tmdbId,
        source: "fastflux",
      };
    })
    .filter(Boolean)
    .filter((row) => (normalizedType ? row.type === normalizedType : true));
  let tmdbMatches = [];
  if (TMDB_API_KEY) {
    try {
      if (normalizedType) {
        tmdbMatches = await searchTmdbCatalog(query, normalizedType);
      } else {
        const [tmdbMovies, tmdbSeries] = await Promise.all([
          searchTmdbCatalog(query, "movie"),
          searchTmdbCatalog(query, "tv"),
        ]);
        tmdbMatches = [...(tmdbMovies || []), ...(tmdbSeries || [])];
      }
    } catch {
      tmdbMatches = [];
    }
  }

  const merged = [];
  const byKey = new Map();
  const mergeRow = (incoming, source) => {
    const tmdbId = toInt(incoming?.tmdbId || incoming?.tmdb_id, 0, 0, 999999999);
    const type = String(incoming?.type || "").trim();
    if (!tmdbId || !type) {
      return;
    }
    const key = `${type}:${tmdbId}`;
    const existing = byKey.get(key);
    if (!existing) {
      const row = { ...incoming, source: source || incoming?.source || "" };
      byKey.set(key, row);
      merged.push(row);
      return;
    }
    if (source === "fastflux" && existing.source !== "fastflux") {
      const row = {
        ...existing,
        ...incoming,
        source: "fastflux",
      };
      row.poster = incoming.poster || existing.poster || "";
      row.backdrop = incoming.backdrop || existing.backdrop || "";
      row.overview = incoming.overview || existing.overview || "";
      row.year = incoming.year || existing.year || 0;
      row.url = incoming.url || existing.url || "";
      byKey.set(key, row);
      const idx = merged.findIndex((entry) => entry === existing);
      if (idx >= 0) {
        merged[idx] = row;
      }
      return;
    }
    existing.poster = existing.poster || incoming.poster || "";
    existing.backdrop = existing.backdrop || incoming.backdrop || "";
    existing.overview = existing.overview || incoming.overview || "";
    existing.year = existing.year || incoming.year || 0;
    existing.url = existing.url || incoming.url || "";
    byKey.set(key, existing);
  };

  normalizedMatches.forEach((row) => mergeRow(row, "fastflux"));
  tmdbMatches.forEach((row) => mergeRow(row, "tmdb"));

  const scored = merged
    .map((row) => ({
      row,
      score: scoreFastfluxSearchEntry(row, queryKey, normalizedType, safeYear) + (row.source === "fastflux" ? 12 : 0),
    }))
    .sort((left, right) => right.score - left.score);
  const best = scored[0]?.row || null;
  sendJson(res, 200, {
    apiVersion: "zenix-search-v1",
    type: "success",
    data: {
      query,
      matches: scored.slice(0, 24).map((entry) => entry.row),
      best,
    },
  });
  return true;
}

async function handleAdminOwned(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/owned") {
    return false;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  if (req.method === "GET") {
    const mediaId = toInt(requestUrl.searchParams.get("mediaId"), 0, 0, 999999999);
    const type = String(requestUrl.searchParams.get("type") || "movie");
    const season = toInt(requestUrl.searchParams.get("season"), 1, 1, 500);
    const episode = toInt(requestUrl.searchParams.get("episode"), 1, 1, 50000);
    const data = loadZenixOwnedSourcesData();
    if (mediaId <= 0) {
      sendJson(res, 200, { ok: true, data });
      return true;
    }
    const sources = readOwnedSourcesForSelection(data, type, mediaId, season, episode);
    sendJson(res, 200, {
      ok: true,
      data: {
        mediaId,
        type,
        season,
        episode,
        sources,
      },
    });
    return true;
  }

  if (req.method === "POST") {
    let body = null;
    try {
      body = await readJsonBody(req, 16384);
    } catch {
      sendJson(res, 400, { error: "Invalid JSON" });
      return true;
    }
    const data = loadZenixOwnedSourcesData();
    const next = upsertOwnedSource(data, body);
    saveZenixOwnedSourcesData(next);
    const mediaId = toInt(body?.mediaId, 0, 0, 999999999);
    const type = String(body?.type || "movie");
    const season = toInt(body?.season, 1, 1, 500);
    const episode = toInt(body?.episode, 1, 1, 50000);
    const sources = readOwnedSourcesForSelection(next, type, mediaId, season, episode);
    sendJson(res, 200, {
      ok: true,
      data: {
        mediaId,
        type,
        season,
        episode,
        sources,
      },
    });
    return true;
  }

  if (req.method === "DELETE") {
    let body = null;
    try {
      body = await readJsonBody(req, 8192);
    } catch {
      sendJson(res, 400, { error: "Invalid JSON" });
      return true;
    }
    const data = loadZenixOwnedSourcesData();
    const next = removeOwnedSource(data, body);
    saveZenixOwnedSourcesData(next);
    sendJson(res, 200, { ok: true });
    return true;
  }

  sendJson(res, 405, { error: "Method Not Allowed" });
  return true;
}

async function handleAdminRepair(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/repair") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  let body = null;
  try {
    body = await readJsonBody(req, 8192);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return true;
  }
  const id = toInt(body?.id, 0, 0, 999999999);
  const externalKey = String(body?.external_key || body?.externalKey || "").trim();
  const data = loadAdminData(true);
  const custom = Array.isArray(data.custom) ? data.custom.slice() : [];
  const entryIndex = custom.findIndex((row) =>
    (id > 0 && Number(row?.id || 0) === id) ||
    (externalKey && String(row?.external_key || row?.externalKey || "") === externalKey)
  );

  if (entryIndex >= 0) {
    const entry = custom[entryIndex];
    const mediaType = String(entry?.type || "movie").toLowerCase() === "tv" ? "tv" : "movie";
    const title = String(entry?.title || "").trim();
    const year = toInt(entry?.year, 0, 0, 2099);
    let tmdbId = toInt(entry?.external_tmdb_id || entry?.externalTmdbId, 0, 0, 999999999);
    let repaired = false;

    if (!tmdbId && title.length >= 2) {
      tmdbId = await resolveFastfluxTmdbIdBySearch(title, mediaType, year);
      if (tmdbId <= 0) {
        const altType = mediaType === "movie" ? "tv" : "movie";
        tmdbId = await resolveFastfluxTmdbIdBySearch(title, altType, year);
      }
      if (tmdbId <= 0 && year > 0) {
        tmdbId = await resolveFastfluxTmdbIdBySearch(title, mediaType, 0);
      }
      if (tmdbId <= 0 && year > 0) {
        const altType = mediaType === "movie" ? "tv" : "movie";
        tmdbId = await resolveFastfluxTmdbIdBySearch(title, altType, 0);
      }
    }

    if (tmdbId > 0) {
      let detail = await fetchFastfluxEntryByTmdbId(mediaType, tmdbId);
      if (!detail) {
        const altType = mediaType === "movie" ? "tv" : "movie";
        detail = await fetchFastfluxEntryByTmdbId(altType, tmdbId);
      }
      const normalized = detail ? buildAdminCustomEntryFromFastflux(detail, mediaType) : null;
      if (normalized) {
        if (!entry.external_tmdb_id && normalized.external_tmdb_id) {
          entry.external_tmdb_id = normalized.external_tmdb_id;
          repaired = true;
        }
        if (!entry.overview && normalized.overview) {
          entry.overview = normalized.overview;
          repaired = true;
        }
        if ((!entry.small_poster_path || !entry.large_poster_path) && normalized.small_poster_path) {
          entry.small_poster_path = normalized.small_poster_path;
          entry.large_poster_path = normalized.large_poster_path || normalized.small_poster_path;
          repaired = true;
        }
        if (!entry.wallpaper_poster_path && normalized.wallpaper_poster_path) {
          entry.wallpaper_poster_path = normalized.wallpaper_poster_path;
          repaired = true;
        }
        if (!entry.release_date && normalized.release_date) {
          entry.release_date = normalized.release_date;
          repaired = true;
        }
        if (!entry.year && normalized.year) {
          entry.year = normalized.year;
          repaired = true;
        }
      }
    }

    custom[entryIndex] = entry;
    data.custom = custom;
    saveAdminData(data);

    let fastfluxCount = 0;
    if (tmdbId > 0) {
      try {
        let sources = await resolveFastfluxSourcesByTmdbId(mediaType, tmdbId, 1, 1, { title, year });
        if (sources.length === 0) {
          const altType = mediaType === "movie" ? "tv" : "movie";
          sources = await resolveFastfluxSourcesByTmdbId(altType, tmdbId, 1, 1, { title, year });
        }
        fastfluxCount = Array.isArray(sources) ? sources.length : 0;
      } catch {
        fastfluxCount = 0;
      }
    }
    const ownedCount = readOwnedSourcesForSelection(loadZenixOwnedSourcesData(), mediaType, entry.id, 1, 1).length;

    sendJson(res, 200, {
      ok: true,
      repaired,
      data: {
        id: entry.id,
        title: entry.title,
        type: mediaType,
        tmdbId: tmdbId || 0,
        ownedCount,
        fastfluxCount,
      },
    });
    return true;
  }

  if (id > 0) {
    let sheet = null;
    try {
      const response = await fetchRemote(`${PURSTREAM_API_BASE}/media/${id}/sheet`);
      if (response.status >= 200 && response.status < 300) {
        sheet = parseJsonSafe(response.body);
      }
    } catch {
      sheet = null;
    }
    const inferredType = String(sheet?.data?.media?.type || sheet?.data?.type || "").toLowerCase();
    const mediaType = inferredType === "tv" || inferredType === "serie" || inferredType === "series" ? "tv" : "movie";
    let purstreamCount = 0;
    try {
      const episodePath = `${PURSTREAM_API_BASE}/stream/${id}/episode?season=1&episode=1`;
      const payload = await fetchRemote(episodePath);
      const parsed = parseJsonSafe(payload.body);
      const sources = Array.isArray(parsed?.data?.items?.sources) ? parsed.data.items.sources : [];
      purstreamCount = sources.length;
    } catch {
      purstreamCount = 0;
    }
    if (purstreamCount === 0) {
      try {
        const payload = await fetchRemote(`${PURSTREAM_API_BASE}/stream/${id}`);
        const parsed = parseJsonSafe(payload.body);
        const sources = Array.isArray(parsed?.data?.items?.sources) ? parsed.data.items.sources : [];
        purstreamCount = sources.length;
      } catch {
        purstreamCount = 0;
      }
    }

    const tmdbId = toInt(sheet?.data?.media?.tmdbId || sheet?.data?.media?.tmdb_id, 0, 0, 999999999);
    let fastfluxCount = 0;
    if (tmdbId > 0) {
      try {
        let sources = await resolveFastfluxSourcesByTmdbId(mediaType, tmdbId, 1, 1, {
          title: sheet?.data?.media?.title || sheet?.data?.media?.name || "",
          year: toInt(sheet?.data?.media?.year, 0, 0, 2099),
        });
        if (sources.length === 0) {
          const altType = mediaType === "movie" ? "tv" : "movie";
          sources = await resolveFastfluxSourcesByTmdbId(altType, tmdbId, 1, 1, {
            title: sheet?.data?.media?.title || sheet?.data?.media?.name || "",
            year: toInt(sheet?.data?.media?.year, 0, 0, 2099),
          });
        }
        fastfluxCount = Array.isArray(sources) ? sources.length : 0;
      } catch {
        fastfluxCount = 0;
      }
    }
    const ownedCount = readOwnedSourcesForSelection(loadZenixOwnedSourcesData(), mediaType, id, 1, 1).length;

    sendJson(res, 200, {
      ok: true,
      repaired: false,
      data: {
        id,
        title: String(sheet?.data?.media?.title || sheet?.data?.media?.name || ""),
        type: mediaType,
        tmdbId: tmdbId || 0,
        ownedCount,
        purstreamCount,
        fastfluxCount,
      },
    });
    return true;
  }

  sendJson(res, 404, { error: "Entry not found" });
  return true;
}

async function handleAdminOverride(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/override") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  let body = null;
  try {
    body = await readJsonBody(req, 8192);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON" });
    return true;
  }
  const id = toInt(body?.id, 0, 0, 999999999);
  const externalKey = String(body?.external_key || body?.externalKey || "").trim();
  if (id <= 0 && !externalKey) {
    sendJson(res, 400, { error: "Missing id or external_key" });
    return true;
  }
  const patch = normalizeAdminOverridePatch(body?.patch || body);
  if (!patch) {
    sendJson(res, 400, { error: "No changes" });
    return true;
  }
  const data = loadAdminData(true);
  if (id > 0) {
    data.overrides.byId[String(id)] = patch;
  }
  if (externalKey) {
    data.overrides.byExternalKey[externalKey] = patch;
  }
  saveAdminData(data);
  sendJson(res, 200, { ok: true });
  return true;
}

async function handleAdminOverrideDelete(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/override") {
    return false;
  }
  if (req.method !== "DELETE") {
    return false;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  const id = toInt(requestUrl.searchParams.get("id"), 0, 0, 999999999);
  const externalKey = String(requestUrl.searchParams.get("external_key") || "").trim();
  if (id <= 0 && !externalKey) {
    sendJson(res, 400, { error: "Missing id or external_key" });
    return true;
  }
  const data = loadAdminData(true);
  if (id > 0) {
    delete data.overrides.byId[String(id)];
  }
  if (externalKey) {
    delete data.overrides.byExternalKey[externalKey];
  }
  saveAdminData(data);
  sendJson(res, 200, { ok: true });
  return true;
}

async function handleAdminCustomDelete(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/admin/custom") {
    return false;
  }
  if (req.method !== "DELETE") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "Unauthorized" });
    return true;
  }
  const id = toInt(requestUrl.searchParams.get("id"), 0, 0, 999999999);
  const externalKey = String(requestUrl.searchParams.get("external_key") || "").trim();
  if (id <= 0 && !externalKey) {
    sendJson(res, 400, { error: "Missing id or external_key" });
    return true;
  }
  const data = loadAdminData(true);
  let rows = Array.isArray(data.custom) ? data.custom : [];
  let removed = false;
  if (id > 0) {
    const next = rows.filter((row) => Number(row?.id || 0) !== id);
    removed = removed || next.length !== rows.length;
    rows = next;
  }
  if (externalKey) {
    const next = rows.filter((row) => String(row?.external_key || "").trim() !== externalKey);
    removed = removed || next.length !== rows.length;
    rows = next;
  }
  data.custom = rows;
  saveAdminData(data);
  sendJson(res, 200, { ok: true, removed });
  return true;
}
async function handleRepairSources(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/repair-sources") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  const parsed = parseRepairKey(requestUrl.searchParams.get("key"));
  if (!parsed || !parsed.key) {
    sendJson(res, 400, { error: "Invalid key" });
    return true;
  }
  const data = loadRepairStore();
  pruneRepairStore(data);
  const entry = data.repairs && typeof data.repairs === "object" ? data.repairs[parsed.key] : null;
  const sources = normalizeRepairSources(entry?.sources || []);
  sendJson(res, 200, {
    ok: true,
    data: {
      key: parsed.key,
      sources,
      updatedAt: Number(entry?.updatedAt || 0),
    },
  });
  return true;
}

async function handleRepairStore(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/repair-store") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  const body = await readJsonBody(req, 8192);
  const parsed = parseRepairKey(body?.key);
  if (!parsed || !parsed.key) {
    sendJson(res, 400, { error: "Invalid key" });
    return true;
  }
  const sources = normalizeRepairSources(body?.sources || []);
  if (sources.length === 0) {
    sendJson(res, 200, { ok: false, error: "No sources" });
    return true;
  }
  const ip = getRemoteAddress(req);
  if (!isRepairAllowed(ip, parsed.key)) {
    sendJson(res, 429, { error: "Rate limited" });
    return true;
  }
  const data = loadRepairStore(true);
  data.repairs = data.repairs && typeof data.repairs === "object" ? data.repairs : {};
  data.repairs[parsed.key] = {
    sources,
    updatedAt: Date.now(),
  };
  pruneRepairStore(data);
  saveAdminData(data);
  sendJson(res, 200, {
    ok: true,
    data: { key: parsed.key, count: sources.length },
  });
  return true;
}

async function handleGlobalRepair(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/repair-global") {
    return false;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  const ip = getRemoteAddress(req);
  if (!isRepairAllowed(ip, "global")) {
    sendJson(res, 429, { error: "Rate limited" });
    return true;
  }
  triggerGlobalRepair();
  sendJson(res, 200, { ok: true, epoch: globalRepairEpoch });
  return true;
}

async function handleRepairStatus(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/repair-status") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  sendJson(res, 200, {
    ok: true,
    epoch: Number(globalRepairEpoch || 0),
    serverTime: Date.now(),
  });
  return true;
}


async function fetchAnimePlanningPage() {
  const upstream = await fetchRemoteText(ANIME_PLANNING_URL, "text/html");
  if (upstream.status < 200 || upstream.status >= 300) {
    throw new Error("Anime planning unavailable");
  }
  return upstream.body;
}
function sanitizePublicEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return entry;
  }
  const next = { ...entry };
  next.external_provider = ZENIX_EXTERNAL_PROVIDER;
  next.externalProvider = ZENIX_EXTERNAL_PROVIDER;
  next.external_label = ZENIX_BRAND_LABEL;
  next.externalLabel = ZENIX_BRAND_LABEL;
  next.external_source = "";
  next.externalSource = "";
  next.external_detail_url = "";
  next.externalDetailUrl = "";
  next.external_key = "";
  next.externalKey = "";
  if ("detailUrl" in next) {
    next.detailUrl = "";
  }
  if ("pageUrl" in next) {
    next.pageUrl = "";
  }
  if (typeof next.provider === "string") {
    const provider = next.provider.toLowerCase();
    if (
      provider.includes("purstream") ||
      provider.includes("nakios") ||
      provider.includes("anime-sama") ||
      provider.includes("animesama") ||
      provider.includes("filmer2") ||
      provider.includes("noctaflix") ||
      provider.includes("fastflux")
    ) {
      next.provider = ZENIX_EXTERNAL_PROVIDER;
    }
  }
  if (typeof next.source === "string") {
    const source = next.source.toLowerCase();
    if (
      source.includes("purstream") ||
      source.includes("nakios") ||
      source.includes("anime-sama") ||
      source.includes("animesama") ||
      source.includes("filmer2") ||
      source.includes("noctaflix") ||
      source.includes("fastflux")
    ) {
      next.source = "zenix";
    }
  }
  if (typeof next.supplemental === "string") {
    if (/purstream|nakios|anime-sama|animesama|filmer2|noctaflix|fastflux/i.test(next.supplemental)) {
      next.supplemental = ZENIX_BRAND_LABEL;
    }
  }
  if (typeof next.url === "string") {
    if (/purstream|nakios|anime-sama|animesama|filmer2|noctaflix|fastflux/i.test(next.url)) {
      next.url = "";
    }
  }
  return next;
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

    const primaryItems = Array.isArray(purstream.items)
      ? purstream.items.map(sanitizePublicEntry)
      : [];
    const animeItems = Array.isArray(anime.items) ? anime.items.map(sanitizePublicEntry) : [];
    const animeDays = Array.isArray(anime.days)
      ? anime.days.map((day) => ({
          ...day,
          items: Array.isArray(day.items) ? day.items.map(sanitizePublicEntry) : [],
        }))
      : [];
    const supplementalItems = Array.isArray(supplemental.items)
      ? supplemental.items.map(sanitizePublicEntry)
      : [];
    const merged = buildMergedCalendar(primaryItems, animeItems, supplementalItems).map(sanitizePublicEntry);

    const payload = {
      apiVersion: "zenix-calendar-v1",
      type: "success",
      data: {
        generatedAt: new Date().toISOString(),
        month,
        year,
        primary: {
          month: purstream.month,
          year: purstream.year,
          monthName: purstream.monthName,
          count: primaryItems.length,
          items: primaryItems,
        },
        anime: {
          count: animeItems.length,
          days: animeDays,
          items: animeItems,
        },
        supplemental: {
          count: supplementalItems.length,
          items: supplementalItems,
        },
        mergedCount: merged.length,
        merged,
        providerStatus: {
          primary: purstreamResult.status === "fulfilled",
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
    const desiredCount = Math.max(1, page * perPage);
    let entries = await loadSupplementalCatalogEntries(false);
    if (
      entries.length < desiredCount &&
      FASTFLUX_MOVIES_MAX_PAGES_PER_FEED > FASTFLUX_MOVIES_PAGES_PER_FEED &&
      USE_FASTFLUX
    ) {
      const approxPerPage = Math.max(1, FASTFLUX_FEED_PAGE_SIZE_ESTIMATE);
      const pagesNeeded = Math.min(
        FASTFLUX_MOVIES_MAX_PAGES_PER_FEED,
        Math.max(
          FASTFLUX_MOVIES_PAGES_PER_FEED,
          Math.ceil((desiredCount * 1.25) / approxPerPage)
        )
      );
      if (pagesNeeded > Number(fastfluxMovieCache.pagesLoaded || 0)) {
        entries = await loadSupplementalCatalogEntries(false, { minPages: pagesNeeded });
      }
    }
    const pageData = buildSupplementalCatalogPage(entries, page, perPage);
    if (Array.isArray(pageData.data)) {
      pageData.data = pageData.data.map(sanitizePublicEntry);
    }
    sendJson(res, 200, {
      apiVersion: "zenix-supplemental-catalog-v1",
      type: "success",
      data: {
        generatedAt: new Date().toISOString(),
        items: pageData,
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
  const isLegacy = requestUrl.pathname === "/api/anime-sibnet";
  const isZenix = requestUrl.pathname === "/api/zenix-anime-source";
  if (!isLegacy && !isZenix) {
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
    const sources = Array.isArray(data?.sources)
      ? data.sources.map((entry) => ({
          ...entry,
          source_name: ZENIX_BRAND_LABEL,
        }))
      : [];
    const publicData = {
      title: data.title,
      season: data.season,
      episode: data.episode,
      requestedLanguage: data.requestedLanguage,
      language: data.language,
      matchedRequestedLanguage: data.matchedRequestedLanguage,
      sourceUrl: data.sourceUrl,
      sources,
    };
    sendJson(res, 200, {
      apiVersion: "zenix-anime-source-v1",
      type: "success",
      data: publicData,
    });
    return true;
  } catch (error) {
    const reason = String(error?.message || "").toLowerCase();
    const status =
      reason.includes("not found") || reason.includes("unavailable") || reason.includes("missing") ? 404 : 502;
    sendJson(res, status, {
      error: "Anime source unavailable",
      reason: sanitizeToken(String(error?.message || ""), 120),
    });
    return true;
  }
}

async function handleAnimeSeasons(req, res, requestUrl) {
  const isLegacy = requestUrl.pathname === "/api/anime-seasons";
  const isZenix = requestUrl.pathname === "/api/zenix-anime-seasons";
  if (!isLegacy && !isZenix) {
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

async function handleZenixSeasons(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/zenix-seasons") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  let tmdbId = toInt(requestUrl.searchParams.get("tmdbId"), 0, 0, 999999999);
  const title = String(requestUrl.searchParams.get("title") || "").trim();
  const year = toInt(requestUrl.searchParams.get("year"), 0, 0, 2099);
  const typeParam = String(requestUrl.searchParams.get("type") || "tv").toLowerCase();
  const mediaType = typeParam === "movie" ? "movie" : "tv";
  if (tmdbId <= 0 && title.length >= 2) {
    try {
      tmdbId = await resolveFastfluxTmdbIdBySearch(title, mediaType, year);
    } catch {
      tmdbId = 0;
    }
  }

  if (tmdbId > 0 && mediaType === "tv") {
    const seasons = await resolveFastfluxSeasonsByTmdbId(tmdbId);
    sendJson(res, 200, {
      apiVersion: "zenix-seasons-v1",
      type: "success",
      data: {
        tmdbId,
        items: seasons,
      },
    });
    return true;
  }

  sendJson(res, 200, {
    apiVersion: "zenix-seasons-v1",
    type: "success",
    data: {
      tmdbId: 0,
      items: [],
    },
  });
  return true;
}

async function handleFilmer2Seasons(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/filmer2-seasons") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!USE_FILMER2) {
    sendJson(res, 200, {
      apiVersion: "zenix-seasons-v1",
      type: "success",
      data: { title: "", items: [] },
    });
    return true;
  }
  const url = String(requestUrl.searchParams.get("url") || "").trim();
  if (!url || !isFilmer2Url(url)) {
    sendJson(res, 400, { error: "Invalid url" });
    return true;
  }
  const detail = await fetchFilmer2Detail(url);
  if (!detail) {
    sendJson(res, 404, { error: "Source unavailable" });
    return true;
  }
  const seasons = Array.isArray(detail.seasons) ? detail.seasons : [];
  sendJson(res, 200, {
    apiVersion: "zenix-seasons-v1",
    type: "success",
    data: {
      title: detail.title,
      items: seasons,
    },
  });
  return true;
}

async function handleNakiosSeasons(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/nakios-seasons") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!USE_NAKIOS) {
    sendJson(res, 200, {
      apiVersion: "zenix-seasons-v1",
      type: "success",
      data: { tmdbId: 0, items: [] },
    });
    return true;
  }
  let tmdbId = toInt(requestUrl.searchParams.get("tmdbId"), 0, 0, 999999999);
  const title = String(requestUrl.searchParams.get("title") || "").trim();
  const year = toInt(requestUrl.searchParams.get("year"), 0, 0, 2099);
  const typeParam = String(requestUrl.searchParams.get("type") || "tv").toLowerCase();
  const mediaType = typeParam === "movie" ? "movie" : "tv";

  if (tmdbId <= 0 && title.length >= 2) {
    try {
      tmdbId = await resolveNakiosTmdbIdBySearch(title, mediaType, year);
    } catch {
      tmdbId = 0;
    }
  }

  if (tmdbId <= 0) {
    sendJson(res, 200, {
      apiVersion: "zenix-seasons-v1",
      type: "success",
      data: {
        tmdbId: 0,
        items: [],
      },
    });
    return true;
  }

  const seasons = await fetchNakiosSeasonsByTmdbId(tmdbId);
  sendJson(res, 200, {
    apiVersion: "zenix-seasons-v1",
    type: "success",
    data: {
      tmdbId,
      items: seasons,
    },
  });
  return true;
}

async function handleZenixSource(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/zenix-source") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }

  const mediaType = String(requestUrl.searchParams.get("type") || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const title = String(requestUrl.searchParams.get("title") || "").trim();
  const cleanedTitle = cleanSearchTitle(title);
  const year = toInt(requestUrl.searchParams.get("year"), 0, 0, 2099);
  const season = toInt(requestUrl.searchParams.get("season"), 1, 1, 500);
  const episode = toInt(requestUrl.searchParams.get("episode"), 1, 1, 50000);
  const forceRefresh = requestUrl.searchParams.get("force") === "1" || shouldForceRefreshGlobal();
  const externalKeyParam = String(requestUrl.searchParams.get("externalKey") || "").trim();
  const mediaId = toInt(requestUrl.searchParams.get("mediaId"), 0, 0, 999999999);
  let tmdbId = toInt(requestUrl.searchParams.get("tmdbId"), 0, 0, 999999999);

  if (externalKeyParam.startsWith("direct:") || mediaId > 0) {
    const directEntry = resolveDirectAdminEntry({
      title,
      mediaType,
      externalKey: externalKeyParam,
      mediaId,
    });
    if (directEntry && directEntry.external_detail_url) {
      const directSource = buildDirectSourceEntry(directEntry.external_detail_url, {
        sourceName: "URL Directe",
        language: directEntry.language || "VF",
        quality: "HD",
      });
      if (directSource) {
        sendJson(res, 200, {
          apiVersion: "zenix-source-v1",
          type: "success",
          data: {
            title: String(directEntry.title || title || "").trim(),
            mediaType,
            year: directEntry.year || year,
            season: mediaType === "tv" ? season : 1,
            episode: mediaType === "tv" ? episode : 1,
            tmdbId: toInt(directEntry.external_tmdb_id || tmdbId, 0, 0, 999999999) || 0,
            count: 1,
            sources: [directSource],
          },
        });
        return true;
      }
    }
  }
  const isScream7 = mediaType === "movie" && isScream7Target(title, tmdbId, mediaId);
  if (isScream7) {
    const screamTmdbId = tmdbId > 0 ? tmdbId : 1159559;
    let fastfluxSources = [];
    if (USE_FASTFLUX) {
      try {
        fastfluxSources = await resolveFastfluxSourcesByTmdbId("movie", screamTmdbId, 1, 1, {
          title,
          year,
          forceRefresh,
        });
        if (fastfluxSources.length === 0) {
          fastfluxSources = await resolveFastfluxSourcesByTmdbId("tv", screamTmdbId, 1, 1, {
            title,
            year,
            forceRefresh,
          });
        }
      } catch {
        fastfluxSources = [];
      }
    }
    const debugSource = NOCTA_SCREAM7_DEBUG_URL
      ? {
          stream_url: buildHlsProxyPath(NOCTA_SCREAM7_DEBUG_URL),
          source_name: "Scream 7 Debug",
          debug: true,
          quality: "Full HD",
          language: "VF",
          format: "mp4",
          priority: 120,
        }
      : null;
    if (fastfluxSources.length > 0 || debugSource) {
      const sources = fastfluxSources.slice();
      if (debugSource) {
        sources.push(debugSource);
      }
      sendJson(res, 200, {
        apiVersion: "zenix-source-v1",
        type: "success",
        data: {
          title: String(title || "Scream 7").trim(),
          mediaType,
          year,
          season: 1,
          episode: 1,
          tmdbId: screamTmdbId > 0 ? screamTmdbId : 0,
          count: sources.length,
          sources,
        },
      });
      return true;
    }
  }
  if (mediaType === "movie" && isBanlieusards3Target(title) && NOCTA_BANLIEUSARDS3_DEBUG_URL) {
    const proxiedUrl = buildHlsProxyPath(NOCTA_BANLIEUSARDS3_DEBUG_URL);
    sendJson(res, 200, {
      apiVersion: "zenix-source-v1",
      type: "success",
      data: {
        title: String(title || "Banlieusards 3").trim(),
        mediaType,
        year,
        season: 1,
        episode: 1,
        tmdbId: tmdbId > 0 ? tmdbId : 0,
        count: 1,
        sources: [
          {
            stream_url: proxiedUrl,
            source_name: "Banlieusards 3 Debug",
            debug: true,
            quality: "Full HD",
            language: "VF",
            format: "mp4",
            priority: 418,
          },
        ],
      },
    });
    return true;
  }
  const isCarsQuatreRoues = isCarsQuatreRouesTarget(title, tmdbId);
  if (mediaType === "movie" && isCarsQuatreRoues) {
    let fastfluxSources = [];
    const carsTmdbId = tmdbId > 0 ? tmdbId : 920;
    if (USE_FASTFLUX) {
      try {
        fastfluxSources = await resolveFastfluxSourcesByTmdbId("movie", carsTmdbId, 1, 1, {
          title,
          year,
          forceRefresh,
        });
        if (fastfluxSources.length === 0) {
          fastfluxSources = await resolveFastfluxSourcesByTmdbId("tv", carsTmdbId, 1, 1, {
            title,
            year,
            forceRefresh,
          });
        }
      } catch {
        fastfluxSources = [];
      }
    }
    if (fastfluxSources.length > 0) {
      sendJson(res, 200, {
        apiVersion: "zenix-source-v1",
        type: "success",
        data: {
          title: String(title || "Cars : Quatre roues").trim(),
          mediaType,
          year,
          season: 1,
          episode: 1,
          tmdbId: carsTmdbId,
          count: fastfluxSources.length,
          sources: fastfluxSources,
        },
      });
      return true;
    }
    if (PURSTREAM_CARS_DEBUG_URL) {
      const proxiedUrl = buildHlsProxyPath(PURSTREAM_CARS_DEBUG_URL);
      const proxiedAlt = PURSTREAM_CARS_DEBUG_URL_ALT ? buildHlsProxyPath(PURSTREAM_CARS_DEBUG_URL_ALT) : "";
      const proxiedMobile = buildHlsProxyPath(PURSTREAM_CARS_DEBUG_URL, HLS_PROXY_MOBILE_PATH);
      sendJson(res, 200, {
        apiVersion: "zenix-source-v1",
        type: "success",
        data: {
          title: String(title || "Cars : Quatre roues").trim(),
          mediaType,
          year,
          season: 1,
          episode: 1,
          tmdbId: carsTmdbId,
          count: proxiedAlt ? 3 : 2,
          sources: [
            {
              stream_url: proxiedUrl,
              source_name: "Cars Debug",
              debug: true,
              quality: "HD",
              language: "VF",
              format: "m3u8",
              priority: 402,
            },
            {
              stream_url: proxiedMobile,
              source_name: "Cars Debug Mobile",
              debug: true,
              mobileOnly: true,
              proxyOnly: true,
              quality: "HD",
              language: "VF",
              format: "m3u8",
              priority: 410,
            },
            ...(proxiedAlt
              ? [
                  {
                    stream_url: proxiedAlt,
                    source_name: "Cars Debug 2",
                    debug: true,
                    quality: "Full HD",
                    language: "MULTI",
                    format: "m3u8",
                    priority: 398,
                  },
                ]
              : []),
          ],
        },
      });
      return true;
    }
  }
  if (tmdbId <= 0 && title.length >= 2) {
    try {
      tmdbId = await resolveFastfluxTmdbIdBySearch(title, mediaType, year);
      if (tmdbId <= 0 && cleanedTitle && cleanedTitle !== title) {
        tmdbId = await resolveFastfluxTmdbIdBySearch(cleanedTitle, mediaType, year);
      }
      if (tmdbId <= 0 && year > 0) {
        tmdbId = await resolveFastfluxTmdbIdBySearch(cleanedTitle || title, mediaType, 0);
      }
    } catch {
      tmdbId = 0;
    }
  }

  let sources = [];
  if (tmdbId > 0 || title.length >= 2) {
    try {
      sources = await resolveFastfluxSourcesByTmdbId(mediaType, tmdbId, season, episode, {
        title,
        year,
        forceRefresh,
      });
      if (sources.length === 0 && cleanedTitle && cleanedTitle !== title) {
        sources = await resolveFastfluxSourcesByTmdbId(mediaType, tmdbId, season, episode, {
          title: cleanedTitle,
          year,
          forceRefresh,
        });
      }
      if (sources.length === 0 && tmdbId <= 0 && title.length >= 2) {
        const altType = mediaType === "movie" ? "tv" : "movie";
        let altTmdbId = 0;
        try {
          altTmdbId = await resolveFastfluxTmdbIdBySearch(title, altType, year);
          if (altTmdbId <= 0 && cleanedTitle && cleanedTitle !== title) {
            altTmdbId = await resolveFastfluxTmdbIdBySearch(cleanedTitle, altType, year);
          }
          if (altTmdbId <= 0 && year > 0) {
            altTmdbId = await resolveFastfluxTmdbIdBySearch(cleanedTitle || title, altType, 0);
          }
        } catch {
          altTmdbId = 0;
        }
        if (altTmdbId > 0) {
          sources = await resolveFastfluxSourcesByTmdbId(altType, altTmdbId, season, episode, {
            title,
            year,
            forceRefresh,
          });
          if (sources.length === 0 && cleanedTitle && cleanedTitle !== title) {
            sources = await resolveFastfluxSourcesByTmdbId(altType, altTmdbId, season, episode, {
              title: cleanedTitle,
              year,
              forceRefresh,
            });
          }
          if (sources.length > 0) {
            tmdbId = altTmdbId;
          }
        }
      }
    } catch {
      sources = [];
    }
  }

  const fastfluxDegraded = isFastfluxHealthDegraded();
  let warning = !USE_FASTFLUX ? "FastFlux indisponible." : "";
  if (fastfluxDegraded && USE_FASTFLUX) {
    warning = "FastFlux instable, secours Purstream actif.";
  }

  let purstreamSources = [];
  const hasFastfluxVf = sources.some((entry) => {
    const lang = normalizePidoovLanguage(entry?.language || entry?.source_name || entry?.name || "") || "";
    return lang === "VF" || lang === "MULTI";
  });
  if ((sources.length === 0 || !hasFastfluxVf || fastfluxDegraded) && title.length >= 2) {
    try {
      const purstreamOptions = fastfluxDegraded ? { allowAllLanguages: true } : undefined;
      purstreamSources = await resolvePurstreamSourcesByTitle(title, mediaType, year, season, episode, purstreamOptions);
      if (purstreamSources.length === 0 && cleanedTitle && cleanedTitle !== title) {
        purstreamSources = await resolvePurstreamSourcesByTitle(
          cleanedTitle,
          mediaType,
          year,
          season,
          episode,
          purstreamOptions
        );
      }
      if (purstreamSources.length === 0 && year > 0) {
        purstreamSources = await resolvePurstreamSourcesByTitle(
          cleanedTitle || title,
          mediaType,
          0,
          season,
          episode,
          purstreamOptions
        );
      }
    } catch {
      purstreamSources = [];
    }
  }
  if (purstreamSources.length > 0) {
    const seen = new Set(sources.map((entry) => String(entry?.stream_url || "").trim()).filter(Boolean));
    purstreamSources.forEach((entry) => {
      const key = String(entry?.stream_url || "").trim();
      if (!key || seen.has(key)) {
        return;
      }
      seen.add(key);
      sources.push(entry);
    });
  }

  const relaxFastfluxGuard = /fastflux:/i.test(externalKeyParam);
  if (sources.length > 0 && title.length >= 2 && !relaxFastfluxGuard) {
    const filtered = sources.filter((entry) => {
      const streamUrl = String(entry?.stream_url || entry?.url || "").trim();
      if (!streamUrl) {
        return true;
      }
      const isFastflux = /fastflux/i.test(String(entry?.origin || entry?.provider || entry?.source || "")) ||
        /fastflux/i.test(String(entry?.source_name || entry?.name || "")) ||
        streamUrl.includes("fastflux.xyz") ||
        streamUrl.includes("cdn.fastflux.xyz");
      if (!isFastflux) {
        return true;
      }
      return shouldKeepFastfluxByTitle(streamUrl, title);
    });
    if (filtered.length !== sources.length) {
      sources = filtered;
      warning = warning
        ? `${warning} Sources FastFlux suspectes ignorees.`
        : "Sources FastFlux suspectes ignorees.";
    }
  }

  if (sources.length > 0) {
    try {
      sources = await filterSourcesWithProbe(sources);
    } catch {
      // keep original sources on probe failure
    }
  }

  if (sources.length === 0 && mediaId > 0) {
    const backupEntry = fetchBackupCacheEntry(mediaType, mediaId, season, episode);
    if (backupEntry && Array.isArray(backupEntry.sources) && backupEntry.sources.length > 0) {
      sources = normalizeBackupSources(backupEntry.sources);
      warning = warning ? `${warning} Sources recuperees du cache local.` : "Sources recuperees du cache local.";
    }
  }
  if (sources.length === 0 && mediaId > 0) {
    const fallback = getRepairSourcesFallback(mediaType, mediaId, season, episode);
    if (fallback.length > 0) {
      sources = fallback;
      warning = warning ? `${warning} Sources recuperees du cache local.` : "Sources recuperees du cache local.";
    }
  }
  sendJson(res, 200, {
    apiVersion: "zenix-source-v1",
    type: "success",
    data: {
      title,
      mediaType,
      year,
      season: mediaType === "tv" ? season : 1,
      episode: mediaType === "tv" ? episode : 1,
      tmdbId: tmdbId > 0 ? tmdbId : 0,
      count: sources.length,
      sources,
      warning,
    },
  });
  return true;
}

async function handleFilmer2Source(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/filmer2-source") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!USE_FILMER2) {
    sendJson(res, 200, { apiVersion: "zenix-source-v1", type: "success", data: { title: "", count: 0, sources: [] } });
    return true;
  }
  const url = String(requestUrl.searchParams.get("url") || "").trim();
  if (!url || !isFilmer2Url(url)) {
    sendJson(res, 400, { error: "Invalid url" });
    return true;
  }
  const detail = await fetchFilmer2Detail(url);
  if (!detail) {
    sendJson(res, 404, { error: "Source unavailable" });
    return true;
  }
  const dedupe = new Set();
  const sources = Array.isArray(detail.sources)
    ? detail.sources
        .map((src, index) => {
          const streamUrl = String(src || "").trim();
          if (!streamUrl || dedupe.has(streamUrl)) {
            return null;
          }
          dedupe.add(streamUrl);
          return {
            stream_url: streamUrl,
            source_name: ZENIX_BRAND_LABEL,
            quality: "HD",
            language: "VF",
            format: inferOwnedSourceFormat(streamUrl, "mp4"),
            priority: 320 - Math.min(40, index * 4),
          };
        })
        .filter(Boolean)
    : [];
  sendJson(res, 200, {
    apiVersion: "zenix-source-v1",
    type: "success",
    data: {
      title: detail.title,
      count: sources.length,
      sources,
    },
  });
  return true;
}

async function handleNakiosSource(req, res, requestUrl) {
  if (requestUrl.pathname !== "/api/nakios-source") {
    return false;
  }
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return true;
  }
  if (!USE_NAKIOS) {
    sendJson(res, 200, {
      apiVersion: "zenix-source-v1",
      type: "success",
      data: { title: "", mediaType: "movie", year: 0, season: 1, episode: 1, tmdbId: 0, count: 0, sources: [] },
    });
    return true;
  }

  const mediaType = String(requestUrl.searchParams.get("type") || "movie").toLowerCase() === "tv" ? "tv" : "movie";
  const title = String(requestUrl.searchParams.get("title") || "").trim();
  const year = toInt(requestUrl.searchParams.get("year"), 0, 0, 2099);
  const season = toInt(requestUrl.searchParams.get("season"), 1, 1, 500);
  const episode = toInt(requestUrl.searchParams.get("episode"), 1, 1, 50000);
  let tmdbId = toInt(requestUrl.searchParams.get("tmdbId"), 0, 0, 999999999);

  if (tmdbId <= 0) {
    if (STRICT_NAKIOS_MATCH) {
      sendJson(res, 200, {
        apiVersion: "zenix-source-v1",
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
      apiVersion: "zenix-source-v1",
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
      apiVersion: "zenix-source-v1",
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
      error: "Source unavailable",
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

function streamFile(req, res, filePath, extraHeaders = null) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      send404(res);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const cacheControl = resolveCacheControl(filePath, ext);
    const range = req.headers.range;
    const baseHeaders = {
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
    };
    if (extraHeaders && typeof extraHeaders === "object") {
      Object.assign(baseHeaders, extraHeaders);
    }

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
        ...baseHeaders,
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      ...baseHeaders,
      "Content-Length": stats.size,
      "Accept-Ranges": "bytes",
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

  handleGateChallenge(req, res, requestUrl)
    .then((handledGateChallenge) => {
      if (handledGateChallenge) {
        return true;
      }
      return handleGateIssue(req, res, requestUrl);
    })
    .then((handledGateIssue) => {
      if (handledGateIssue) {
        return true;
      }
      return handleGateScript(req, res, requestUrl);
    })
    .then((handledGateScript) => {
      if (handledGateScript) {
        return true;
      }
      return handleGateGuard(req, res, requestUrl);
    })
    .then((handledGateGuard) => {
      if (handledGateGuard) {
        return true;
      }
      return handleAnalyticsHeartbeat(req, res, requestUrl);
    })
    .then((handledAnalytics) => {
      if (handledAnalytics) {
        return true;
      }
      return handleAnalyticsPlaybackFail(req, res, requestUrl);
    })
    .then((handledPlaybackFail) => {
      if (handledPlaybackFail) {
        return true;
      }
      return handleAnalyticsOnline(req, res, requestUrl);
    })
    .then((handledAnalyticsOnline) => {
      if (handledAnalyticsOnline) {
        return true;
      }
      return handleAnalyticsWebhookStatus(req, res, requestUrl);
    })
    .then((handledWebhookStatus) => {
      if (handledWebhookStatus) {
        return true;
      }
      return handleAnnouncement(req, res, requestUrl);
    })
    .then((handledAnnouncement) => {
      if (handledAnnouncement) {
        return true;
      }
      return handleBackupConfig(req, res, requestUrl);
    })
    .then((handledBackupConfig) => {
      if (handledBackupConfig) {
        return true;
      }
      return handleBackupCache(req, res, requestUrl);
    })
    .then((handledBackupCache) => {
      if (handledBackupCache) {
        return true;
      }
      return handleAdminSession(req, res, requestUrl);
    })
    .then((handledAdminSession) => {
      if (handledAdminSession) {
        return true;
      }
      return handleAdminLogin(req, res, requestUrl);
    })
    .then((handledAdminLogin) => {
      if (handledAdminLogin) {
        return true;
      }
      return handleAdminLogout(req, res, requestUrl);
    })
    .then((handledAdminLogout) => {
      if (handledAdminLogout) {
        return true;
      }
      return handleAdminData(req, res, requestUrl);
    })
    .then((handledAdminData) => {
      if (handledAdminData) {
        return true;
      }
      return handleAdminAnalytics(req, res, requestUrl);
    })
    .then((handledAdminAnalytics) => {
      if (handledAdminAnalytics) {
        return true;
      }
      return handleAdminHealth(req, res, requestUrl);
    })
    .then((handledAdminHealth) => {
      if (handledAdminHealth) {
        return true;
      }
      return handleAdminAnnouncement(req, res, requestUrl);
    })
    .then((handledAdminAnnouncement) => {
      if (handledAdminAnnouncement) {
        return true;
      }
      return handleAdminImport(req, res, requestUrl);
    })
    .then((handledAdminImport) => {
      if (handledAdminImport) {
        return true;
      }
      return handleAdminSearch(req, res, requestUrl);
    })
    .then((handledAdminSearch) => {
      if (handledAdminSearch) {
        return true;
      }
      return handleAdminSuggestions(req, res, requestUrl);
    })
    .then((handledAdminSuggestions) => {
      if (handledAdminSuggestions) {
        return true;
      }
      return handleAdminSuggestionSkip(req, res, requestUrl);
    })
    .then((handledAdminSuggestSkip) => {
      if (handledAdminSuggestSkip) {
        return true;
      }
      return handleAdminSuggestionAccept(req, res, requestUrl);
    })
    .then((handledAdminSuggestAccept) => {
      if (handledAdminSuggestAccept) {
        return true;
      }
      return handleAdminRequestsUpdate(req, res, requestUrl);
    })
    .then((handledAdminRequestsUpdate) => {
      if (handledAdminRequestsUpdate) {
        return true;
      }
      return handleAdminRequestsDelete(req, res, requestUrl);
    })
    .then((handledAdminRequestsDelete) => {
      if (handledAdminRequestsDelete) {
        return true;
      }
      return handleAdminTvChannels(req, res, requestUrl);
    })
    .then((handledAdminTvChannels) => {
      if (handledAdminTvChannels) {
        return true;
      }
      return handleFilmer2Search(req, res, requestUrl);
    })
    .then((handledFilmer2Search) => {
      if (handledFilmer2Search) {
        return true;
      }
      return handleAdminOwned(req, res, requestUrl);
    })
    .then((handledAdminOwned) => {
      if (handledAdminOwned) {
        return true;
      }
      return handleAdminRepair(req, res, requestUrl);
    })
    .then((handledAdminRepair) => {
      if (handledAdminRepair) {
        return true;
      }
      return handleAdminOverrideDelete(req, res, requestUrl);
    })
    .then((handledAdminOverrideDelete) => {
      if (handledAdminOverrideDelete) {
        return true;
      }
      return handleAdminOverride(req, res, requestUrl);
    })
    .then((handledAdminOverride) => {
      if (handledAdminOverride) {
        return true;
      }
      return handleAdminCustomDelete(req, res, requestUrl);
    })
    .then((handledAdminCustomDelete) => {
      if (handledAdminCustomDelete) {
        return true;
      }
      return handleRepairSources(req, res, requestUrl);
    })
    .then((handledRepairSources) => {
      if (handledRepairSources) {
        return true;
      }
      return handleRepairStore(req, res, requestUrl);
    })
    .then((handledRepairStore) => {
      if (handledRepairStore) {
        return true;
      }
      return handleGlobalRepair(req, res, requestUrl);
    })
    .then((handledGlobalRepair) => {
      if (handledGlobalRepair) {
        return true;
      }
      return handleSuggestionSubmit(req, res, requestUrl);
    })
    .then((handledSuggestions) => {
      if (handledSuggestions) {
        return true;
      }
      return handleRequestsPublic(req, res, requestUrl);
    })
    .then((handledRequestsPublic) => {
      if (handledRequestsPublic) {
        return true;
      }
      return handleTvChannelsPublic(req, res, requestUrl);
    })
    .then((handledTvChannelsPublic) => {
      if (handledTvChannelsPublic) {
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
      return handleZenixSeasons(req, res, requestUrl);
    })
    .then((handledZenixSeasons) => {
      if (handledZenixSeasons) {
        return true;
      }
      return handleFilmer2Seasons(req, res, requestUrl);
    })
    .then((handledFilmer2Seasons) => {
      if (handledFilmer2Seasons) {
        return true;
      }
      return handleNakiosSeasons(req, res, requestUrl);
    })
    .then((handledNakiosSeasons) => {
      if (handledNakiosSeasons) {
        return true;
      }
      return handleAnimeSibnet(req, res, requestUrl);
    })
    .then((handledAnimeSibnet) => {
      if (handledAnimeSibnet) {
        return true;
      }
      return handleZenixSource(req, res, requestUrl);
    })
    .then((handledZenixSource) => {
      if (handledZenixSource) {
        return true;
      }
      return handleFilmer2Source(req, res, requestUrl);
    })
    .then((handledFilmer2Source) => {
      if (handledFilmer2Source) {
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
      return handleRepairStatus(req, res, requestUrl);
    })
    .then((handledRepairStatus) => {
      if (handledRepairStatus) {
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
      } else if (pathname === "/admin" || pathname === "/admin/") {
        pathname = "/admin.html";
      }

      const filePath = safeLocalPath(pathname);
      if (!filePath) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
      }

      fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
          const extraHeaders =
            pathname === "/admin.html" ? { "X-Robots-Tag": "noindex, nofollow" } : null;
          streamFile(req, res, filePath, extraHeaders);
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
      if (!res.headersSent) {
        sendJson(res, 500, { error: "Internal server error" });
      }
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

scheduleFastfluxWarmup();
scheduleFastfluxHealthCheck();

server.listen(PORT, () => {
  console.log(`Zenix Stream: http://localhost:${PORT}`);
});
