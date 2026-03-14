const { webkit, devices } = require('playwright');

const BASE_URL = (process.env.ZENIX_BASE_URL || 'https://zenix.best/').replace(/\/+$/, '');
const WATCH_MS = Number(process.env.ZENIX_WATCH_MS || 5000);
const SAMPLE_MS = 900;
const MOVIE_TARGET = Number(process.env.ZENIX_MOVIE_TARGET || 10);
const SERIES_TARGET = Number(process.env.ZENIX_SERIES_TARGET || 10);
const ANIME_TARGET = Number(process.env.ZENIX_ANIME_TARGET || 6);
const CATALOG_PAGES_MAX = Number(process.env.ZENIX_CATALOG_PAGES || 8);
const OPEN_TIMEOUT_MS = Number(process.env.ZENIX_OPEN_TIMEOUT_MS || 15000);
const FORCE_ID = Number(process.env.ZENIX_FORCE_ID || 0);
const FORCE_TYPE = String(process.env.ZENIX_FORCE_TYPE || 'movie').toLowerCase();
const FORCE_TITLE = String(process.env.ZENIX_FORCE_TITLE || '').trim();
const SKIP_GATE = String(process.env.ZENIX_SKIP_GATE || '') === '1';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (value && Array.isArray(value.data)) {
    return value.data;
  }
  return [];
}

function toInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeTitle(value) {
  return String(value || '').trim();
}

function parseProof(scriptBody) {
  if (!scriptBody) {
    return '';
  }
  const proofMatch = scriptBody.match(/__zenixAdProof\s*=\s*([^;]+);/i);
  if (!proofMatch) {
    return '';
  }
  const raw = proofMatch[1].trim();
  try {
    return JSON.parse(raw);
  } catch {
    return raw.replace(/^['"]|['"]$/g, '');
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJson(url, token) {
  const headers = {
    accept: 'application/json,text/plain,*/*',
    'user-agent': UA,
  };
  if (token) {
    headers['X-Zenix-Gate'] = token;
  }
  const response = await fetchWithTimeout(url, { headers }, 15000);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${url}`);
  }
  return await response.json();
}

async function issueGateToken() {
  const challengeUrl = `${BASE_URL}/api/gate/challenge`;
  process.stderr.write('[GATE] challenge...\n');
  const challengeRes = await fetchWithTimeout(challengeUrl, { headers: { 'user-agent': UA } }, 12000);
  if (!challengeRes.ok) {
    throw new Error(`Gate challenge failed: ${challengeRes.status}`);
  }
  const challenge = await challengeRes.json();
  const nonce = String(challenge?.nonce || '');
  const scriptPath = String(challenge?.script || '');
  if (!nonce || !scriptPath) {
    throw new Error('Gate challenge invalid payload');
  }
  const scriptUrl = scriptPath.startsWith('http') ? scriptPath : `${BASE_URL}${scriptPath}`;
  process.stderr.write('[GATE] proof script...\n');
  const scriptRes = await fetchWithTimeout(scriptUrl, { headers: { 'user-agent': UA } }, 12000);
  if (!scriptRes.ok) {
    throw new Error(`Gate script failed: ${scriptRes.status}`);
  }
  const scriptBody = await scriptRes.text();
  const proof = parseProof(scriptBody);
  if (!proof) {
    throw new Error('Gate proof missing');
  }
  process.stderr.write('[GATE] issue...\n');
  const issueRes = await fetchWithTimeout(`${BASE_URL}/api/gate/issue`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'user-agent': UA,
    },
    body: JSON.stringify({ nonce, proof }),
  }, 12000);
  if (!issueRes.ok) {
    throw new Error(`Gate issue failed: ${issueRes.status}`);
  }
  const payload = await issueRes.json();
  const token = String(payload?.token || '');
  if (!token) {
    throw new Error('Gate token missing');
  }
  return token;
}

async function gatherCandidates(token) {
  const moviePool = [];
  const seriesPool = [];
  const animePool = [];
  const seen = new Set();

  for (let page = 1; page <= CATALOG_PAGES_MAX; page += 1) {
    let payload;
    try {
      payload = await fetchJson(`${BASE_URL}/api/catalog/movies?page=${page}`, token);
    } catch {
      continue;
    }
    const rows = toArray(payload?.data?.items?.data || payload?.data?.items || payload?.items || payload?.data);
    if (!rows.length) {
      continue;
    }

    for (const row of rows) {
      const id = toInt(row?.id, 0);
      if (id <= 0 || seen.has(id)) {
        continue;
      }
      seen.add(id);
      const title = normalizeTitle(row?.title);
      if (!title) {
        continue;
      }
      const type = String(row?.type || row?.media_type || '').toLowerCase();
      const isAnime = Boolean(row?.isAnime || row?.is_anime || row?.anime);
      if (isAnime) {
        animePool.push({ id, title, type: 'tv', isAnime: true, season: 1, episode: 1 });
      } else if (type === 'tv' || type === 'serie' || type === 'series') {
        seriesPool.push({ id, title, type: 'tv', season: 1, episode: 1 });
      } else {
        moviePool.push({ id, title, type: 'movie' });
      }
    }

    if (moviePool.length >= MOVIE_TARGET * 3 && seriesPool.length >= SERIES_TARGET * 3 && animePool.length >= ANIME_TARGET * 2) {
      break;
    }
  }

  return {
    movies: moviePool.slice(0, MOVIE_TARGET * 2),
    series: seriesPool.slice(0, SERIES_TARGET * 2),
    anime: animePool.slice(0, ANIME_TARGET * 2),
  };
}

function analyzeSamples(samples) {
  const rows = Array.isArray(samples) ? samples : [];
  const videoRows = rows.filter((row) => row.videoVisible);
  const iframeRows = rows.filter((row) => row.iframeVisible);

  let resets = 0;
  let stalls = 0;
  let maxTime = 0;
  for (let i = 1; i < videoRows.length; i += 1) {
    const prev = Number(videoRows[i - 1].time || 0);
    const cur = Number(videoRows[i].time || 0);
    if (cur + 0.6 < prev) {
      resets += 1;
    }
    if (videoRows[i].paused !== true && cur <= prev + 0.05) {
      stalls += 1;
    }
  }
  videoRows.forEach((row) => {
    maxTime = Math.max(maxTime, Number(row.time || 0));
  });

  const latestStatus = String(rows[rows.length - 1]?.status || '').toLowerCase();
  const statusHasError = /erreur|indisponible|bloqu|impossible|failed/.test(latestStatus);
  const zenixStatus = String(rows[rows.length - 1]?.zenixStatus || '').toLowerCase();
  const zenixActive = /zenix/.test(zenixStatus);
  const videoPass = videoRows.length >= 3 && maxTime >= 2.0 && resets <= 1;
  const iframePass = iframeRows.length >= 3 && !statusHasError;

  return {
    sampleCount: rows.length,
    videoSampleCount: videoRows.length,
    iframeSampleCount: iframeRows.length,
    maxVideoTime: Number(maxTime.toFixed(2)),
    resets,
    stalls,
    statusHasError,
    zenixActive,
    pass: Boolean((videoPass || iframePass) && zenixActive),
  };
}

async function ensureZenixSourceSelected(page) {
  const result = await page.evaluate(() => {
    const chip = document.querySelector('.player-source-chip-zenix')?.closest('.player-source-chip');
    if (!chip) {
      return { found: false, clicked: false, index: -1 };
    }
    const index = Number(chip.dataset.sourceIndex || -1);
    try {
      chip.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    } catch {
      // ignore
    }
    try {
      chip.click();
    } catch {
      // ignore
    }
    return { found: true, clicked: true, index };
  });
  await wait(800);
  return result;
}

async function preparePage(page) {
  process.stderr.write('[STEP] preparePage\\n');
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2200);
  await page.waitForFunction(() => window.__zenixBooted === true && !window.__zenixBootError, { timeout: 30000 });
  await page.waitForFunction(() => typeof window.openPlayer === 'function', { timeout: 20000 });
  await page.waitForFunction(() => Boolean(document.querySelector('.media-card[data-card-id]')), { timeout: 25000 });
  process.stderr.write('[STEP] page ready\\n');
}

async function closePlayerOverlay(page) {
  await page.evaluate(() => {
    const btn = document.getElementById('playerCloseBtn');
    if (btn) {
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  });
  await page.waitForFunction(() => {
    const overlay = document.getElementById('playerOverlay');
    return overlay ? overlay.hidden === true : true;
  }, { timeout: 12000 }).catch(() => {});
}

async function openAndPlay(page, entry) {
  process.stderr.write(`[STEP] openAndPlay ${entry.title}\\n`);
  const opened = await page.evaluate(async (payload) => {
    const id = Number(payload?.id || 0);
    const season = Number(payload?.season || 1);
    const episode = Number(payload?.episode || 1);
    const timeoutMs = Number(payload?.timeoutMs || 12000);
    if (id <= 0 || typeof window.openPlayer !== 'function') {
      return 'openPlayer-missing';
    }
    try {
      const openPromise = (async () => {
        if (String(payload?.type || '') === 'tv') {
          await window.openPlayer(id, { season, episode, syncRoute: false });
        } else {
          await window.openPlayer(id, { syncRoute: false });
        }
        return true;
      })();
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('openPlayer-timeout'), timeoutMs));
      return await Promise.race([openPromise, timeoutPromise]);
    } catch {
      return 'openPlayer-error';
    }
  }, { ...entry, timeoutMs: OPEN_TIMEOUT_MS });

  if (opened !== true) {
    throw new Error(`openPlayer failed (${opened || 'unknown'}) for ${entry.title}`);
  }

  await page.waitForTimeout(1600);
  process.stderr.write(`[STEP] player opened ${entry.title}\\n`);
  return ensureZenixSourceSelected(page);
}

async function runOne(page, entry) {
  const out = {
    id: entry.id,
    title: entry.title,
    type: entry.type,
    season: entry.season || 0,
    episode: entry.episode || 0,
    isAnime: Boolean(entry.isAnime),
    pageErrors: [],
    requestFailed: [],
    responseErrors: [],
    samples: [],
    analysis: null,
    zenixSelect: null,
    fatal: '',
  };

  const onPageError = (error) => out.pageErrors.push(String(error));
  const onRequestFailed = (req) => out.requestFailed.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText || 'failed'}`);
  const onResponse = (res) => {
    const status = res.status();
    if (status >= 400) {
      const url = res.url();
      if (/\/api\/|m3u8|\.ts|stream|hls-proxy/i.test(url)) {
        out.responseErrors.push(`${status} ${url}`);
      }
    }
  };

  page.on('pageerror', onPageError);
  page.on('requestfailed', onRequestFailed);
  page.on('response', onResponse);

  try {
    let opened = false;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        out.zenixSelect = await openAndPlay(page, entry);
        opened = true;
        break;
      } catch (error) {
        if (attempt >= 1) {
          throw error;
        }
        process.stderr.write(`[WARN] openPlayer retry for ${entry.title}\\n`);
        await preparePage(page);
      }
    }
    if (!opened) {
      throw new Error(`openPlayer failed for ${entry.title}`);
    }
    const start = Date.now();
    while (Date.now() - start < WATCH_MS) {
      const sample = await page.evaluate(() => {
        const status = String(document.getElementById('playerStatus')?.textContent || '').trim();
        const zenixStatus = String(document.getElementById('playerZenixStatus')?.textContent || '').trim();
        const source = String(document.getElementById('playerSourceSelect')?.value || '').trim();
        const video = document.getElementById('playerVideo');
        const iframe = document.getElementById('playerEmbedFrame');
        const videoVisible = video instanceof HTMLVideoElement ? !video.hidden : false;
        const iframeVisible = iframe instanceof HTMLIFrameElement ? !iframe.hidden : false;
        return {
          ts: Date.now(),
          status,
          zenixStatus,
          source,
          videoVisible,
          iframeVisible,
          time: videoVisible ? Number(video.currentTime || 0) : 0,
          paused: videoVisible ? Boolean(video.paused) : null,
          readyState: videoVisible ? Number(video.readyState || 0) : null,
          errorCode: videoVisible && video.error ? Number(video.error.code || 0) : 0,
        };
      });
      out.samples.push(sample);
      await wait(SAMPLE_MS);
    }
  } catch (error) {
    out.fatal = String(error?.stack || error?.message || error || 'Unknown');
  } finally {
    out.analysis = analyzeSamples(out.samples);
    out.sheet404Count = out.responseErrors.filter((line) => /\/api\/media\/\d+\/sheet/i.test(line)).length;
    page.off('pageerror', onPageError);
    page.off('requestfailed', onRequestFailed);
    page.off('response', onResponse);
    await closePlayerOverlay(page);
  }

  return out;
}

async function runSuite() {
  const gateToken = SKIP_GATE ? '' : await issueGateToken();
  const selection = FORCE_ID
    ? {
        movies: FORCE_TYPE === 'movie' ? [{ id: FORCE_ID, title: FORCE_TITLE || `ID ${FORCE_ID}`, type: 'movie' }] : [],
        series:
          FORCE_TYPE === 'tv'
            ? [{ id: FORCE_ID, title: FORCE_TITLE || `ID ${FORCE_ID}`, type: 'tv', season: 1, episode: 1 }]
            : [],
        anime:
          FORCE_TYPE === 'anime'
            ? [{ id: FORCE_ID, title: FORCE_TITLE || `ID ${FORCE_ID}`, type: 'tv', season: 1, episode: 1, isAnime: true }]
            : [],
      }
    : await gatherCandidates(gateToken);

  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    ignoreHTTPSErrors: true,
  });

  const cookieDomain = new URL(BASE_URL).hostname;
  if (gateToken) {
    await context.addCookies([
      {
        name: 'zenix_gate',
        value: gateToken,
        domain: cookieDomain,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      },
    ]);
  }

  const page = await context.newPage();
  if (gateToken) {
    await page.addInitScript((token) => {
      try {
        localStorage.setItem('zenix-gate-token-v1', token);
      } catch {
        // ignore
      }
    }, gateToken);
  }

  await preparePage(page);

  const movieResults = [];
  const seriesResults = [];
  const animeResults = [];
  const skipped = [];

  try {
    for (const target of selection.movies) {
      if (movieResults.length >= MOVIE_TARGET) {
        break;
      }
      const row = await runOne(page, target);
      if (String(row.fatal || '').includes('openPlayer failed')) {
        skipped.push({ ...target, reason: 'openPlayer-failed' });
        process.stderr.write(`[SKIP] MOVIE ${target.title} => openPlayer failed\n`);
        continue;
      }
      movieResults.push(row);
      process.stderr.write(`[RUN] MOVIE ${target.title} => pass=${row.analysis?.pass && !row.fatal}\n`);
    }

    for (const target of selection.series) {
      if (seriesResults.length >= SERIES_TARGET) {
        break;
      }
      const row = await runOne(page, target);
      if (String(row.fatal || '').includes('openPlayer failed')) {
        skipped.push({ ...target, reason: 'openPlayer-failed' });
        process.stderr.write(`[SKIP] TV ${target.title} => openPlayer failed\n`);
        continue;
      }
      seriesResults.push(row);
      process.stderr.write(`[RUN] TV ${target.title} => pass=${row.analysis?.pass && !row.fatal}\n`);
    }

    for (const target of selection.anime) {
      if (animeResults.length >= ANIME_TARGET) {
        break;
      }
      const row = await runOne(page, target);
      if (String(row.fatal || '').includes('openPlayer failed')) {
        skipped.push({ ...target, reason: 'openPlayer-failed' });
        process.stderr.write(`[SKIP] ANIME ${target.title} => openPlayer failed\n`);
        continue;
      }
      animeResults.push(row);
      process.stderr.write(`[RUN] ANIME ${target.title} => pass=${row.analysis?.pass && !row.fatal}\n`);
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const results = [...movieResults, ...seriesResults, ...animeResults];
  const passed = results.filter((row) => row.analysis?.pass && !row.fatal).length;
  const failed = results.length - passed;

  return {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    watchMs: WATCH_MS,
    selected: {
      movies: movieResults.map((row) => ({ id: row.id, title: row.title, type: row.type })),
      series: seriesResults.map((row) => ({
        id: row.id,
        title: row.title,
        type: row.type,
        season: row.season,
        episode: row.episode,
      })),
      anime: animeResults.map((row) => ({
        id: row.id,
        title: row.title,
        type: row.type,
        season: row.season,
        episode: row.episode,
      })),
      skipped,
    },
    results,
    summary: {
      total: results.length,
      movieTotal: movieResults.length,
      seriesTotal: seriesResults.length,
      animeTotal: animeResults.length,
      passed,
      failed,
      movieFailed: movieResults.filter((row) => !(row.analysis?.pass && !row.fatal)).length,
      seriesFailed: seriesResults.filter((row) => !(row.analysis?.pass && !row.fatal)).length,
      animeFailed: animeResults.filter((row) => !(row.analysis?.pass && !row.fatal)).length,
      totalSheet404: results.reduce((sum, row) => sum + Number(row.sheet404Count || 0), 0),
    },
  };
}

runSuite()
  .then((result) => {
    process.stdout.write(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    process.stderr.write(String(error?.stack || error?.message || error));
    process.exit(1);
  });

