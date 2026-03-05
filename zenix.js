const API_BASE = "https://api.purstream.co/api/v1";
const STORAGE_KEY = "zenix-progress-v3";
const CLEANUP_KEY = "zenix-sw-cleaned-v3";

const FALLBACK_ITEMS = [
  {
    id: 2203,
    type: "movie",
    title: "Avatar",
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/7mzJl74fmqvyFPET7tj53NoBbyd.jpg",
    backdrop: "https://www.themoviedb.org/t/p/w1920_and_h1080_bestv2/lVaY1Z4SKN14LgKWxhmgScgZr9F.jpg",
    runtime: 166,
    releaseDate: "2009-12-16 00:00:00",
    isAnime: false,
  },
  {
    id: 3830,
    type: "tv",
    title: "Stranger Things",
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    backdrop: "https://www.themoviedb.org/t/p/w1920_and_h1080_bestv2/nviyFKko4Uk1mqHxehvxGhnMHFV.jpg",
    runtime: null,
    releaseDate: "2016-07-15 00:00:00",
    isAnime: false,
  },
];

const state = {
  query: "",
  nav: "all",
  chip: "all",
  searchMode: false,
  searchToken: 0,
  page: 0,
  hasMore: true,
  loadingCatalog: false,
  items: [],
  activeId: null,
  detailsCache: new Map(),
  seriesCache: new Map(),
  progress: loadProgress(),
};

const refs = {
  heroTitle: document.getElementById("heroTitle"),
  heroDescription: document.getElementById("heroDescription"),
  heroMeta: document.getElementById("heroMeta"),
  heroArt: document.getElementById("heroArt"),
  heroPlayBtn: document.getElementById("heroPlayBtn"),
  heroInfoBtn: document.getElementById("heroInfoBtn"),
  searchInput: document.getElementById("searchInput"),
  genreChips: document.getElementById("genreChips"),
  catalogGrid: document.getElementById("catalogGrid"),
  emptyState: document.getElementById("emptyState"),
  continueSection: document.getElementById("continueSection"),
  continueGrid: document.getElementById("continueGrid"),
  loadMoreBtn: document.getElementById("loadMoreBtn"),
  navPills: Array.from(document.querySelectorAll(".nav-pill[data-nav]")),
};

let searchTimer = null;

init();

async function init() {
  cleanupLegacyServiceWorker();
  renderFilterChips();
  bindEvents();
  await loadInitialCatalog();
  renderAll();
}

function bindEvents() {
  refs.searchInput.addEventListener("input", (event) => {
    const raw = String(event.target.value || "").trim();
    state.query = raw;

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const token = ++state.searchToken;
    searchTimer = setTimeout(() => {
      handleSearch(token).catch(() => {
        if (token !== state.searchToken) {
          return;
        }
        state.searchMode = false;
        renderAll();
      });
    }, 380);
  });

  refs.heroPlayBtn.addEventListener("click", () => {
    if (!state.activeId) {
      return;
    }
    openPlayer(state.activeId).catch(() => {
      showUserError("Lecture indisponible pour ce titre.");
    });
  });

  refs.heroInfoBtn.addEventListener("click", () => {
    if (!state.activeId) {
      return;
    }

    const card = document.querySelector(`[data-card-id="${state.activeId}"]`);
    if (!card) {
      return;
    }

    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.animate(
      [
        { boxShadow: "0 0 0 0 rgba(34, 211, 238, 0.62)" },
        { boxShadow: "0 0 0 12px rgba(34, 211, 238, 0)" },
      ],
      { duration: 900, easing: "ease-out" }
    );
  });

  refs.navPills.forEach((button) => {
    button.addEventListener("click", () => {
      state.nav = button.dataset.nav || "all";
      refs.navPills.forEach((entry) => entry.classList.toggle("active", entry === button));
      renderAll();
    });
  });

  refs.loadMoreBtn.addEventListener("click", () => {
    loadMoreCatalog().catch(() => {
      updateLoadMoreButton();
    });
  });
}

function renderFilterChips() {
  const chips = [
    { value: "all", label: "Tous" },
    { value: "movie", label: "Films" },
    { value: "tv", label: "Series" },
    { value: "anime", label: "Anime" },
  ];

  refs.genreChips.innerHTML = "";
  for (const chip of chips) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip${state.chip === chip.value ? " active" : ""}`;
    button.textContent = chip.label;
    button.addEventListener("click", () => {
      state.chip = chip.value;
      renderFilterChips();
      renderAll();
    });
    refs.genreChips.appendChild(button);
  }
}

async function loadInitialCatalog() {
  state.loadingCatalog = true;
  updateLoadMoreButton();

  try {
    state.items = [];
    for (let page = 1; page <= 2; page += 1) {
      const result = await fetchCatalogPage(page);
      mergeCatalogItems(result.items);
      state.page = result.currentPage;
      state.hasMore = result.currentPage < result.lastPage;
    }
  } catch {
    state.items = FALLBACK_ITEMS.slice();
    state.page = 1;
    state.hasMore = false;
  } finally {
    state.loadingCatalog = false;
  }

  if (!state.activeId && state.items[0]) {
    state.activeId = state.items[0].id;
  }
}

async function loadMoreCatalog() {
  if (state.loadingCatalog || !state.hasMore || state.searchMode) {
    return;
  }

  state.loadingCatalog = true;
  updateLoadMoreButton();

  try {
    const nextPage = state.page + 1;
    const result = await fetchCatalogPage(nextPage);
    mergeCatalogItems(result.items);
    state.page = result.currentPage;
    state.hasMore = result.currentPage < result.lastPage;
    renderAll();
  } finally {
    state.loadingCatalog = false;
    updateLoadMoreButton();
  }
}

async function handleSearch(token) {
  const query = state.query.trim();
  if (query.length < 2) {
    state.searchMode = false;
    await resetToCatalog();
    return;
  }

  state.searchMode = true;
  updateLoadMoreButton();

  try {
    const payload = await fetchJson(`${API_BASE}/search-bar/search/${encodeURIComponent(query)}`);
    if (token !== state.searchToken) {
      return;
    }

    const movieResults = payload?.data?.items?.movies?.items;
    const list = Array.isArray(movieResults) ? movieResults : [];
    state.items = list.map(normalizeCatalogItem);
    state.hasMore = false;
    state.page = 1;

    if (!state.items.some((item) => item.id === state.activeId)) {
      state.activeId = state.items[0] ? state.items[0].id : null;
    }

    renderAll();
  } catch {
    if (token !== state.searchToken) {
      return;
    }
    state.items = [];
    state.hasMore = false;
    renderAll();
  }
}

async function resetToCatalog() {
  state.loadingCatalog = true;
  updateLoadMoreButton();

  try {
    const result = await fetchCatalogPage(1);
    state.items = [];
    mergeCatalogItems(result.items);
    state.page = result.currentPage;
    state.hasMore = result.currentPage < result.lastPage;

    if (!state.items.some((item) => item.id === state.activeId)) {
      state.activeId = state.items[0] ? state.items[0].id : null;
    }
  } catch {
    if (state.items.length === 0) {
      state.items = FALLBACK_ITEMS.slice();
    }
    state.hasMore = false;
  } finally {
    state.loadingCatalog = false;
  }

  renderAll();
}

function mergeCatalogItems(items) {
  for (const item of items) {
    if (!state.items.some((entry) => entry.id === item.id)) {
      state.items.push(item);
    }
  }
}

async function fetchCatalogPage(page) {
  const payload = await fetchJson(`${API_BASE}/catalog/movies?page=${page}`);
  const pagination = payload?.data?.items || {};
  const rows = Array.isArray(pagination.data) ? pagination.data : [];

  return {
    items: rows.map(normalizeCatalogItem),
    currentPage: Number(pagination.current_page || page),
    lastPage: Number(pagination.last_page || page),
  };
}

function normalizeCatalogItem(raw) {
  const id = Number(raw?.id || 0);
  const title = String(raw?.title || "Sans titre");

  return {
    id,
    type: raw?.type === "tv" ? "tv" : "movie",
    title,
    poster: raw?.large_poster_path || raw?.small_poster_path || "",
    backdrop: raw?.wallpaper_poster_path || raw?.small_poster_path || raw?.large_poster_path || "",
    runtime: typeof raw?.runtime === "number" ? raw.runtime : null,
    releaseDate: raw?.release_date || null,
    endDate: raw?.end_date || null,
    isAnime: Boolean(raw?.isAnime),
    summary: `Lecture directe ${raw?.type === "tv" ? "serie" : "film"} depuis le catalogue distant.`,
  };
}

function renderAll() {
  const visible = applyViewFilters(state.items);
  if (!visible.some((item) => item.id === state.activeId)) {
    state.activeId = visible[0] ? visible[0].id : null;
  }

  renderHero();
  renderCatalog(visible);
  renderContinue();
  refs.emptyState.hidden = visible.length > 0;
  updateLoadMoreButton();
}

function applyViewFilters(items) {
  let list = items.slice();

  if (state.nav === "movie") {
    list = list.filter((item) => item.type === "movie");
  } else if (state.nav === "tv") {
    list = list.filter((item) => item.type === "tv");
  }

  if (state.chip === "movie") {
    list = list.filter((item) => item.type === "movie");
  } else if (state.chip === "tv") {
    list = list.filter((item) => item.type === "tv");
  } else if (state.chip === "anime") {
    list = list.filter((item) => item.isAnime);
  }

  if (state.nav === "recent") {
    list.sort((a, b) => {
      const left = a.releaseDate ? Date.parse(a.releaseDate) : 0;
      const right = b.releaseDate ? Date.parse(b.releaseDate) : 0;
      return right - left;
    });
  }

  if (!state.searchMode) {
    const query = state.query.trim().toLowerCase();
    if (query.length > 0) {
      list = list.filter((item) => {
        const text = `${item.title} ${item.type}`.toLowerCase();
        return text.includes(query);
      });
    }
  }

  return list;
}

function renderHero() {
  const item = getItemById(state.activeId);
  if (!item) {
    refs.heroTitle.textContent = "Catalogue indisponible";
    refs.heroDescription.textContent = "Relance la page pour recharger le catalogue.";
    refs.heroArt.src = "";
    refs.heroMeta.innerHTML = "";
    return;
  }

  const details = state.detailsCache.get(item.id);
  refs.heroTitle.textContent = details?.title || item.title;
  refs.heroDescription.textContent =
    details?.overview || item.summary || "Choisis un titre et lance la lecture immediatement.";

  const poster = details?.posters?.wallpaper || details?.posters?.small || item.backdrop || item.poster;
  refs.heroArt.src = poster;
  refs.heroArt.alt = item.title;

  refs.heroMeta.innerHTML = "";
  const tags = [];
  tags.push(item.type === "tv" ? "Serie" : "Film");
  tags.push(item.isAnime ? "Anime" : "HD");

  if (details?.runtime?.human) {
    tags.push(details.runtime.human);
  } else if (item.runtime) {
    tags.push(toHumanRuntime(item.runtime));
  }

  const year = getYear(item.releaseDate);
  if (year) {
    tags.push(year);
  }

  tags.push("Gratuit");

  for (const tag of tags) {
    const span = document.createElement("span");
    span.className = "hero-tag";
    span.textContent = tag;
    refs.heroMeta.appendChild(span);
  }

  ensureDetails(item.id).catch(() => {
    // silent fallback
  });
}

function renderCatalog(items) {
  refs.catalogGrid.innerHTML = "";

  for (const item of items) {
    const progress = state.progress[item.id] || null;
    refs.catalogGrid.appendChild(buildCard(item, progress));
  }
}

function renderContinue() {
  const resumable = Object.values(state.progress)
    .filter((entry) => Number(entry?.lastPlayed || 0) > 0)
    .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0))
    .slice(0, 4);

  refs.continueGrid.innerHTML = "";
  refs.continueSection.hidden = resumable.length === 0;

  for (const entry of resumable) {
    const item = getItemById(entry.id) || {
      id: entry.id,
      title: entry.title,
      type: entry.type,
      poster: entry.poster,
      backdrop: entry.poster,
      runtime: null,
      releaseDate: null,
      isAnime: false,
      summary: "Reprise de lecture sauvegardee.",
    };

    const card = buildCard(item, entry);
    const playButton = card.querySelector("[data-play]");
    if (playButton) {
      playButton.textContent = "Reprendre";
      playButton.addEventListener("click", (event) => {
        event.preventDefault();
        openPlayer(item.id, {
          season: entry.season || 1,
          episode: entry.episode || 1,
        }).catch(() => {
          showUserError("Impossible de reprendre cette lecture.");
        });
      });
    }

    refs.continueGrid.appendChild(card);
  }
}

function buildCard(item, progress) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.cardId = String(item.id);

  const details = state.detailsCache.get(item.id);
  const description = details?.overview || item.summary || "";
  const runtime = details?.runtime?.human || (item.runtime ? toHumanRuntime(item.runtime) : "Episode");
  const year = getYear(item.releaseDate) || "-";

  const progressPercent = progress && progress.time
    ? Math.max(0, Math.min(100, Math.round((progress.time / (progress.duration || 100)) * 100)))
    : 0;

  card.innerHTML = `
    <div class="card-media">
      <img src="${escapeHtml(item.poster || item.backdrop || "")}" alt="${escapeHtml(item.title)}" loading="lazy" />
      <span class="free-label">FREE</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <div class="card-meta">${item.type === "tv" ? "Serie" : "Film"} - ${year} - ${escapeHtml(runtime)}</div>
      <p class="card-desc">${escapeHtml(description || "Lecture rapide sans abonnement.")}</p>
      ${progress ? `<div class="progress-wrap"><div class="progress-bar" style="width:${progressPercent}%"></div></div>` : ""}
      <div class="card-actions">
        <button type="button" class="btn-small btn-play" data-play="${item.id}">Lire</button>
        <button type="button" class="btn-small btn-lite" data-feature="${item.id}">A la une</button>
      </div>
    </div>
  `;

  const playButton = card.querySelector("[data-play]");
  const featureButton = card.querySelector("[data-feature]");

  if (playButton) {
    playButton.addEventListener("click", () => {
      openPlayer(item.id).catch(() => {
        showUserError("Lecture indisponible pour ce titre.");
      });
    });
  }

  if (featureButton) {
    featureButton.addEventListener("click", () => {
      state.activeId = item.id;
      renderHero();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  return card;
}

function updateLoadMoreButton() {
  if (state.searchMode || !state.hasMore) {
    refs.loadMoreBtn.hidden = true;
    refs.loadMoreBtn.disabled = false;
    refs.loadMoreBtn.textContent = "Charger plus";
    return;
  }

  refs.loadMoreBtn.hidden = false;
  refs.loadMoreBtn.disabled = state.loadingCatalog;
  refs.loadMoreBtn.textContent = state.loadingCatalog ? "Chargement..." : "Charger plus";
}

async function ensureDetails(id) {
  if (!id || state.detailsCache.has(id)) {
    return state.detailsCache.get(id) || null;
  }

  const payload = await fetchJson(`${API_BASE}/media/${id}/sheet`);
  const details = payload?.data?.items;
  if (details && typeof details === "object") {
    state.detailsCache.set(id, details);
  }

  if (state.activeId === id) {
    renderHero();
  }

  return details || null;
}

async function getSeriesSeasons(id) {
  if (state.seriesCache.has(id)) {
    return state.seriesCache.get(id);
  }

  const payload = await fetchJson(`${API_BASE}/media/${id}/seasons`);
  const rows = Array.isArray(payload?.data?.items) ? payload.data.items : [];
  const mapped = rows
    .map((entry) => ({
      season: Number(entry?.season || 0),
      episodes: Array.isArray(entry?.episodes)
        ? entry.episodes.map((episode) => ({
            episode: Number(episode?.episode || 0),
            name: String(episode?.name || `Episode ${episode?.episode || "?"}`),
          }))
        : [],
    }))
    .filter((entry) => entry.season > 0 && entry.episodes.length > 0)
    .sort((a, b) => a.season - b.season);

  state.seriesCache.set(id, mapped);
  return mapped;
}

function getEpisodesForSeason(seasons, seasonNumber) {
  const current = seasons.find((entry) => entry.season === seasonNumber);
  return current ? current.episodes : [];
}

async function openPlayer(id, resume = {}) {
  const item = getItemById(id);
  if (!item) {
    return;
  }

  const remembered = state.progress[item.id] || {};
  const viewer = openLoadingWindow(item.title);

  try {
    let streamUrl = "";
    let season = 1;
    let episode = 1;

    if (item.type === "tv") {
      const seasons = await getSeriesSeasons(item.id);
      if (seasons.length === 0) {
        throw new Error("No seasons available");
      }

      season = Number(resume.season || remembered.season || seasons[0].season);
      if (!seasons.some((entry) => entry.season === season)) {
        season = seasons[0].season;
      }

      const episodes = getEpisodesForSeason(seasons, season);
      if (episodes.length === 0) {
        throw new Error("No episodes available");
      }

      episode = Number(resume.episode || remembered.episode || episodes[0].episode);
      if (!episodes.some((entry) => entry.episode === episode)) {
        episode = episodes[0].episode;
      }

      const payload = await fetchJson(
        `${API_BASE}/stream/${item.id}/episode?season=${season}&episode=${episode}`
      );
      const source = pickSource(payload);
      if (!source) {
        throw new Error("No source available");
      }

      streamUrl = source.stream_url;
    } else {
      const payload = await fetchJson(`${API_BASE}/stream/${item.id}`);
      const source = pickSource(payload);
      if (!source) {
        throw new Error("No source available");
      }

      streamUrl = source.stream_url;
    }

    registerLaunch(item, { season, episode });
    navigatePlayerWindow(viewer, streamUrl);
    renderContinue();
  } catch (error) {
    if (viewer && !viewer.closed) {
      viewer.close();
    }
    throw error;
  }
}

function pickSource(payload) {
  const sources = payload?.data?.items?.sources;
  if (!Array.isArray(sources) || sources.length === 0) {
    return null;
  }

  const mp4 = sources.find((source) => String(source.format || "").toLowerCase() === "mp4");
  return mp4 || sources[0];
}

function registerLaunch(item, playback) {
  state.progress[item.id] = {
    id: item.id,
    type: item.type,
    title: item.title,
    poster: item.poster,
    season: playback.season || 1,
    episode: playback.episode || 1,
    time: 30,
    duration: 100,
    lastPlayed: Date.now(),
  };
  saveProgress(state.progress);
}

function openLoadingWindow(title) {
  const viewer = window.open("about:blank", "_blank", "noopener");
  if (!viewer) {
    return null;
  }

  const safeTitle = escapeHtml(title || "Lecteur");
  viewer.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${safeTitle}</title><style>body{font-family:Segoe UI,Arial,sans-serif;background:#09152d;color:#e8efff;display:grid;place-items:center;height:100vh;margin:0}p{opacity:.88}</style></head><body><p>Chargement de la video...</p></body></html>`);
  viewer.document.close();
  return viewer;
}

function navigatePlayerWindow(viewer, streamUrl) {
  if (viewer && !viewer.closed) {
    viewer.location.replace(streamUrl);
    return;
  }

  const opened = window.open(streamUrl, "_blank", "noopener");
  if (!opened) {
    window.location.href = streamUrl;
  }
}

function getItemById(id) {
  return state.items.find((item) => item.id === id) || null;
}

function toHumanRuntime(minutes) {
  const total = Number(minutes || 0);
  if (!Number.isFinite(total) || total <= 0) {
    return "-";
  }

  const hour = Math.floor(total / 60);
  const minute = total % 60;

  if (hour > 0) {
    return `${hour}h${String(minute).padStart(2, "0")}`;
  }

  return `${minute} min`;
}

function getYear(releaseDate) {
  if (!releaseDate) {
    return "";
  }

  const value = String(releaseDate);
  const match = value.match(/\d{4}/);
  return match ? match[0] : "";
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showUserError(message) {
  window.alert(message);
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function cleanupLegacyServiceWorker() {
  if (sessionStorage.getItem(CLEANUP_KEY)) {
    return;
  }
  sessionStorage.setItem(CLEANUP_KEY, "1");

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
}
