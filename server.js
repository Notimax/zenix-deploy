const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { Readable } = require("node:stream");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 4173);
const REMOTE_API_BASE = "https://api.purstream.co/api/v1";
const PURSTREAM_API_BASE = "https://api.purstream.co/api/v1";
const PURSTREAM_WEB_BASE = "https://purstream.co";
const ANIME_PLANNING_URL = "https://anime-sama.tv/planning/";
const PROXY_TIMEOUT_MS = 16000;
const CALENDAR_CACHE_MS = 6 * 60 * 1000;
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
const HLS_PROXY_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";
const DISCORD_STATS_STATE_FILE = path.join(ROOT, ".discord-stats-state.json");
const proxyCache = new Map();
const calendarCache = new Map();
const analyticsClients = new Map();
const analyticsEvents = [];
let analyticsTotalSeen = 0;
let analyticsLastPushAt = 0;
let discordStatsMessageId = "";
let discordNextAllowedAt = 0;
let discordPushInFlight = null;
let discordRateLimitedStreak = 0;
let discordWebhookCandidateIndex = 0;
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

function getRemoteAddress(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded)
    ? String(forwarded[0] || "")
    : String(forwarded || "");
  const forwardedIp = firstForwarded.split(",")[0].trim();
  const raw = forwardedIp || String(req.socket?.remoteAddress || "");
  const normalized = raw.replace(/^::ffff:/, "");
  return normalized === "::1" ? "127.0.0.1" : normalized || "0.0.0.0";
}

function isPublicIpAddress(value) {
  const raw = String(value || "").trim();
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
}

function markAnalyticsHeartbeat(req, payload) {
  const now = Date.now();
  pruneAnalytics(now);

  const clientId = sanitizeToken(payload?.clientId, 64) || "guest";
  const page = sanitizeToken(payload?.page, 140);
  const ip = sanitizeToken(getRemoteAddress(req), 60);
  const key = `${clientId}@${ip}`;

  let row = analyticsClients.get(key);
  if (!row) {
    row = {
      firstSeen: now,
      lastSeen: now,
      lastEventAt: 0,
      page: "",
    };
    analyticsTotalSeen += 1;
  }

  row.lastSeen = now;
  if (page) {
    row.page = page;
  }

  if (now - Number(row.lastEventAt || 0) >= ANALYTICS_MIN_EVENT_MS) {
    row.lastEventAt = now;
    analyticsEvents.push(now);
  }
  analyticsClients.set(key, row);
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
  let activeNow = 0;
  for (const row of analyticsClients.values()) {
    if (Number(row?.lastSeen || 0) >= activeThreshold) {
      activeNow += 1;
    }
  }
  return {
    generatedAt: new Date(now).toISOString(),
    activeNow,
    unique24h: analyticsClients.size,
    heartbeats24h: analyticsEvents.length,
    totalSeen: analyticsTotalSeen,
    uptimeMs: Math.max(0, process.uptime() * 1000),
    uptimeLabel: formatDuration(process.uptime() * 1000),
  };
}

function loadDiscordStatsState() {
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

function buildDiscordStatsEmbed(stats, reason) {
  return {
    title: "Zenix - Statistiques Live",
    description: "Mise a jour en temps reel (message unique).",
    color: 0xf11424,
    timestamp: stats.generatedAt,
    fields: [
      { name: "Connectes maintenant", value: String(stats.activeNow), inline: true },
      { name: "Total 24h (uniques)", value: String(stats.unique24h), inline: true },
      { name: "Heartbeats 24h", value: String(stats.heartbeats24h), inline: true },
      { name: "Total depuis lancement", value: String(stats.totalSeen), inline: true },
      { name: "Uptime serveur", value: stats.uptimeLabel, inline: true },
      {
        name: "Rafraichissement",
        value: `Toutes les ${Math.max(1, Math.round(DISCORD_PUSH_INTERVAL_MS / 1000))} s`,
        inline: true,
      },
    ],
    footer: {
      text: reason === "startup" ? "Demarrage service" : "Mise a jour automatique",
    },
  };
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
  if (!forceSend && now < discordNextAllowedAt) {
    return;
  }
  if (!forceSend && now - analyticsLastPushAt < DISCORD_PUSH_INTERVAL_MS - 1000) {
    return;
  }
  analyticsLastPushAt = now;

  const stats = buildAnalyticsSnapshot();
  const payload = {
    username: "Zenix Monitor",
    allowed_mentions: { parse: [] },
    embeds: [buildDiscordStatsEmbed(stats, reason)],
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
      return;
    }
    if (patched.status === 429) {
      discordRateLimitedStreak += 1;
      discordNextAllowedAt = now + getDiscordBackoffMs(patched.retryAfterMs);
    } else if (patched.status > 0) {
      discordRateLimitedStreak = 0;
      discordNextAllowedAt = now + Math.max(DISCORD_PUSH_INTERVAL_MS, 30000);
    }
    if (patched.status === 404 || patched.status === 400) {
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

function normalizeTypeFromPurstream(movie) {
  if (!movie || movie.type !== "tv") {
    return "film";
  }
  const urls = String(movie.urls || "").toLowerCase();
  if (urls.includes("animes/")) {
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
    if (type === "anime") {
      continue;
    }
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
      language: String(movie.lang || "").trim().toUpperCase(),
      supplemental: String(movie.calendarSupplemental || "").trim(),
      season: Number(movie.season || 0),
      episode: Number(movie.episode || 0),
      poster: String(posters.small || posters.large || posters.wallpaper || ""),
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

function buildMergedCalendar(purstreamItems, animeItems) {
  const dedupe = new Map();
  const pushMerged = (entry) => {
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

async function fetchRemote(target, extraHeaders = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);
  try {
    const response = await fetch(target, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (ZenixStream)",
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

async function fetchRemoteText(target, accept = "text/html") {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);
  try {
    const response = await fetch(target, {
      method: "GET",
      headers: {
        Accept: accept,
        "User-Agent": "Mozilla/5.0 (ZenixStream)",
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

function buildHlsProxyPath(targetUrl) {
  return `/api/hls-proxy?url=${encodeURIComponent(String(targetUrl || "").trim())}`;
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

  const lines = text
    .split(/\r?\n/)
    .map((line) => String(line || "").trim())
    .filter(Boolean);
  if (lines.length >= 6 && lines.length <= 60000 && lines.every((line) => /^\d{1,3}$/.test(line))) {
    const bytes = lines.map((line) => Number(line));
    if (!bytes.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
      try {
        const decoded = Buffer.from(bytes).toString("utf8").trim();
        if (decoded.includes("#EXTM3U")) {
          return decoded;
        }
      } catch {
        // fallback below
      }
    }
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

async function fetchHlsUpstreamWithFallback(target, range, signal) {
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
      method: "GET",
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
  if (req.method !== "GET") {
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
    const upstream = await fetchHlsUpstreamWithFallback(target, range, controller.signal);

    const status = Number(upstream.status || 502);
    const contentType = String(upstream.headers.get("content-type") || "").toLowerCase();
    const isPlaylist =
      target.pathname.toLowerCase().endsWith(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("vnd.apple.mpegurl");

    if (isPlaylist) {
      const buffer = Buffer.from(await upstream.arrayBuffer());
      const bodyText = decodeNumericPlaylistBody(buffer.toString("utf8"));
      const rewritten = rewriteHlsPlaylistBody(bodyText, target.href);
      res.writeHead(status, {
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
    await pipeUpstreamBodyToResponse(upstream, res);
    return true;
  } catch (error) {
    const code = String(error?.name || "").toLowerCase().includes("abort") ? 504 : 502;
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
    const [purstreamResult, animeResult] = await Promise.allSettled([
      fetchPurstreamCalendarMonth(month, year),
      fetchAnimePlanningPage(),
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

    if (purstream.items.length === 0 && anime.items.length === 0) {
      sendJson(res, 502, { error: "Calendar providers unavailable" });
      return true;
    }

    const merged = buildMergedCalendar(purstream.items, anime.items);

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
        mergedCount: merged.length,
        merged,
        sourceLinks: {
          purstream: `${PURSTREAM_WEB_BASE}/calendar`,
          animeSama: ANIME_PLANNING_URL,
        },
        providerStatus: {
          catalog: purstreamResult.status === "fulfilled",
          anime: animeResult.status === "fulfilled",
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
      return handleCalendarOverview(req, res, requestUrl);
    })
    .then((handledCalendar) => {
      if (handledCalendar) {
        return true;
      }
      return handleHlsProxy(req, res, requestUrl);
    })
    .then((handledHlsProxy) => {
      if (handledHlsProxy) {
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

server.listen(PORT, () => {
  console.log(`Zenix Stream: http://localhost:${PORT}`);
});
