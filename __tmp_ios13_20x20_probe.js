const { webkit, devices } = require('playwright');

const BASE_URL = process.env.ZENIX_BASE_URL || 'https://zenix.best/';
const WATCH_MS = 20000;
const SAMPLE_MS = 1000;
const MOVIE_TARGET = 10;
const SERIES_TARGET = 10;
const CATALOG_PAGES_MAX = 10;

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
    if (cur + 0.8 < prev) {
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
  const videoPass = videoRows.length >= 8 && maxTime >= 6 && resets <= 1;
  const iframePass = iframeRows.length >= 12 && !statusHasError;

  return {
    sampleCount: rows.length,
    videoSampleCount: videoRows.length,
    iframeSampleCount: iframeRows.length,
    maxVideoTime: Number(maxTime.toFixed(2)),
    resets,
    stalls,
    statusHasError,
    pass: Boolean(videoPass || iframePass),
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'accept': 'application/json,text/plain,*/*',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${url}`);
  }
  return await response.json();
}

async function gatherCandidates() {
  const moviePool = [];
  const seriesPool = [];
  const seen = new Set();

  for (let page = 1; page <= CATALOG_PAGES_MAX; page += 1) {
    let payload;
    try {
      payload = await fetchJson(`${BASE_URL.replace(/\/$/, '')}/api/catalog/movies?page=${page}`);
    } catch {
      continue;
    }
    const rows = toArray(payload?.data?.items);
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
      const type = String(row?.type || '').toLowerCase();
      const isAnime = Boolean(row?.isAnime);
      if (!title || isAnime) {
        continue;
      }
      if (type === 'movie') {
        moviePool.push({ id, title, type: 'movie' });
      } else if (type === 'tv') {
        seriesPool.push({ id, title, type: 'tv' });
      }
    }

    if (moviePool.length >= 40 && seriesPool.length >= 40) {
      break;
    }
  }

  const movies = moviePool.slice(0, 40);
  const series = seriesPool.slice(0, 40).map((item) => ({ ...item, season: 1, episode: 1 }));

  return { movies, series };
}

async function openAndPlay(page, entry) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(2800);

  const opened = await page.evaluate(async (payload) => {
    const id = Number(payload?.id || 0);
    const season = Number(payload?.season || 1);
    const episode = Number(payload?.episode || 1);
    if (id <= 0 || typeof window.openPlayer !== 'function') {
      return false;
    }
    try {
      if (String(payload?.type || '') === 'tv') {
        await window.openPlayer(id, { season, episode, syncRoute: false });
      } else {
        await window.openPlayer(id, { syncRoute: false });
      }
      return true;
    } catch {
      return false;
    }
  }, entry);

  if (!opened) {
    throw new Error(`openPlayer failed for ${entry.title}`);
  }

  await page.waitForTimeout(1800);
}

async function runOne(page, entry) {
  const out = {
    id: entry.id,
    title: entry.title,
    type: entry.type,
    season: entry.season || 0,
    episode: entry.episode || 0,
    pageErrors: [],
    requestFailed: [],
    responseErrors: [],
    samples: [],
    analysis: null,
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
    await openAndPlay(page, entry);
    const start = Date.now();
    while (Date.now() - start < WATCH_MS) {
      const sample = await page.evaluate(() => {
        const status = String(document.getElementById('playerStatus')?.textContent || '').trim();
        const source = String(document.getElementById('playerSourceSelect')?.value || '').trim();
        const video = document.getElementById('playerVideo');
        const iframe = document.getElementById('playerEmbedFrame');
        const videoVisible = video instanceof HTMLVideoElement ? !video.hidden : false;
        const iframeVisible = iframe instanceof HTMLIFrameElement ? !iframe.hidden : false;
        return {
          ts: Date.now(),
          status,
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
  }

  return out;
}

async function runSuite() {
  const selection = await gatherCandidates();

  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  const movieResults = [];
  const seriesResults = [];
  const skipped = [];
  try {
    for (const target of selection.movies) {
      if (movieResults.length >= MOVIE_TARGET) {
        break;
      }
      const row = await runOne(page, target);
      if (String(row.fatal || '').includes('openPlayer failed')) {
        skipped.push({ ...target, reason: 'openPlayer-failed' });
        process.stderr.write(`[SKIP] MOVIE ${target.title} => openPlayer failed\\n`);
        continue;
      }
      movieResults.push(row);
      process.stderr.write(`[RUN] ${target.type.toUpperCase()} ${target.title} => pass=${row.analysis?.pass && !row.fatal}\n`);
    }
    for (const target of selection.series) {
      if (seriesResults.length >= SERIES_TARGET) {
        break;
      }
      const row = await runOne(page, target);
      if (String(row.fatal || '').includes('openPlayer failed')) {
        skipped.push({ ...target, reason: 'openPlayer-failed' });
        process.stderr.write(`[SKIP] TV ${target.title} => openPlayer failed\\n`);
        continue;
      }
      seriesResults.push(row);
      process.stderr.write(`[RUN] ${target.type.toUpperCase()} ${target.title} => pass=${row.analysis?.pass && !row.fatal}\n`);
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const results = [...movieResults, ...seriesResults];
  const passed = results.filter((row) => row.analysis?.pass && !row.fatal).length;
  const failed = results.length - passed;

  return {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    selected: {
      movies: movieResults.map((row) => ({ id: row.id, title: row.title, type: row.type })),
      series: seriesResults.map((row) => ({
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
      passed,
      failed,
      movieFailed: movieResults.filter((row) => !(row.analysis?.pass && !row.fatal)).length,
      seriesFailed: seriesResults.filter((row) => !(row.analysis?.pass && !row.fatal)).length,
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
