const API_BASE = "https://api.purstream.co/api/v1";
const STORAGE_KEY = "zenix-progress-v4";
const FAVORITES_KEY = "zenix-favorites-v1";
const CLEANUP_KEY = "zenix-sw-cleaned-v4";
const REFRESH_FEED_MS = 10 * 60 * 1000;
const REFRESH_TOP_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15000;
const RETRY_DELAYS_MS = [350, 900];
const INITIAL_CATALOG_WARMUP_PAGES = 4;
const BACKGROUND_CATALOG_DELAY_MS = 70;
const BACKGROUND_CATALOG_RENDER_EVERY = 8;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const HLS_JS_URL = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";
const HLS_MIME = "application/vnd.apple.mpegurl";
const DASH_MIME = "application/dash+xml";

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
  view: "all",
  chip: "all",
  sortBy: "featured",
  query: "",
  searchToken: 0,
  page: 0,
  totalPages: 0,
  catalogSyncPage: 0,
  hasMore: true,
  loadingCatalog: false,
  backgroundSyncRunning: false,
  loadingTop: false,
  seriesSupported: true,
  catalog: [],
  topDaily: [],
  activeHeroId: null,
  selectedDetailId: null,
  detailsCache: new Map(),
  trailersCache: new Map(),
  seasonsCache: new Map(),
  progress: loadProgress(),
  favorites: loadFavorites(),
  nowPlaying: null,
  sourcePool: [],
  sourceIndex: -1,
  hlsScriptPromise: null,
  hlsInstance: null,
  playToken: 0,
  lastSyncAt: null,
  refreshFeedTimer: null,
  refreshTopTimer: null,
};

const refs = {
  heroTitle: document.getElementById("heroTitle"),
  heroDescription: document.getElementById("heroDescription"),
  heroMeta: document.getElementById("heroMeta"),
  heroArt: document.getElementById("heroArt"),
  heroPlayBtn: document.getElementById("heroPlayBtn"),
  heroInfoBtn: document.getElementById("heroInfoBtn"),
  heroTrailerBtn: document.getElementById("heroTrailerBtn"),
  heroRandomBtn: document.getElementById("heroRandomBtn"),

  syncInfo: document.getElementById("syncInfo"),
  supportInfo: document.getElementById("supportInfo"),

  topSection: document.getElementById("topSection"),
  topGrid: document.getElementById("topGrid"),

  searchInput: document.getElementById("searchInput"),
  navPills: Array.from(document.querySelectorAll(".nav-pill[data-view]")),
  quickLinks: Array.from(document.querySelectorAll(".quick-link[data-view-jump]")),
  filterChips: document.getElementById("filterChips"),
  sortSelect: document.getElementById("sortSelect"),
  refreshNowBtn: document.getElementById("refreshNowBtn"),
  shareBrowseBtn: document.getElementById("shareBrowseBtn"),
  clearContinueBtn: document.getElementById("clearContinueBtn"),
  clearListBtn: document.getElementById("clearListBtn"),
  communityStats: document.getElementById("communityStats"),
  latestSection: document.getElementById("latestSection"),
  latestGrid: document.getElementById("latestGrid"),
  popularSection: document.getElementById("popularSection"),
  popularGrid: document.getElementById("popularGrid"),
  listSection: document.getElementById("listSection"),
  listGrid: document.getElementById("listGrid"),

  continueSection: document.getElementById("continueSection"),
  continueGrid: document.getElementById("continueGrid"),

  catalogGrid: document.getElementById("catalogGrid"),
  loadMoreBtn: document.getElementById("loadMoreBtn"),
  emptyState: document.getElementById("emptyState"),

  detailModal: document.getElementById("detailModal"),
  detailCloseBtn: document.getElementById("detailCloseBtn"),
  detailPoster: document.getElementById("detailPoster"),
  detailKicker: document.getElementById("detailKicker"),
  detailTitle: document.getElementById("detailTitle"),
  detailMeta: document.getElementById("detailMeta"),
  detailOverview: document.getElementById("detailOverview"),
  detailBadges: document.getElementById("detailBadges"),
  detailPlayBtn: document.getElementById("detailPlayBtn"),
  detailTrailerBtn: document.getElementById("detailTrailerBtn"),
  detailFavoriteBtn: document.getElementById("detailFavoriteBtn"),
  detailShareBtn: document.getElementById("detailShareBtn"),
  detailSeriesControls: document.getElementById("detailSeriesControls"),
  detailSeasonSelect: document.getElementById("detailSeasonSelect"),
  detailEpisodeSelect: document.getElementById("detailEpisodeSelect"),
  trailerWrap: document.getElementById("trailerWrap"),
  trailerFrame: document.getElementById("trailerFrame"),

  playerOverlay: document.getElementById("playerOverlay"),
  playerCloseBtn: document.getElementById("playerCloseBtn"),
  playerTitle: document.getElementById("playerTitle"),
  playerSeriesControls: document.getElementById("playerSeriesControls"),
  playerSeasonSelect: document.getElementById("playerSeasonSelect"),
  playerEpisodeSelect: document.getElementById("playerEpisodeSelect"),
  playerStatus: document.getElementById("playerStatus"),
  playerSourceMeta: document.getElementById("playerSourceMeta"),
  playerVideo: document.getElementById("playerVideo"),
  toast: document.getElementById("toast"),
};

let searchDebounce = null;
let lastProgressSave = 0;
let toastTimer = null;

init();

async function init() {
  cleanupLegacyServiceWorker().catch(() => {
    // cleanup best effort only
  });
  bindEvents();

  refs.syncInfo.textContent = "Synchronisation initiale en cours...";
  refs.supportInfo.textContent = "Test episodes series > 2 en cours...";

  await detectSeriesSupport();
  applyBrowseStateFromRoute();
  renderFilterChips();
  setActiveNav(state.view);

  await Promise.allSettled([loadTopDaily(), loadInitialCatalog()]);

  if (state.catalog.length === 0) {
    state.catalog = FALLBACK_ITEMS.slice();
    state.page = 1;
    state.hasMore = false;
  }
  if (state.topDaily.length === 0) {
    state.topDaily = buildTopFromCatalog();
  }

  if (!state.activeHeroId) {
    const first = state.topDaily[0] || state.catalog[0];
    state.activeHeroId = first ? first.id : null;
  }

  renderAll();
  await applyInitialRoute();
  startAutoRefresh();
}

function bindEvents() {
  refs.navPills.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view || "all";
      state.view = view;
      setActiveNav(view);
      renderAll();
    });
  });

  refs.quickLinks.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.viewJump || "all";
      state.view = view;
      if (view === "top") {
        state.chip = "all";
      } else if (view === "movie" || view === "tv" || view === "anime") {
        state.chip = view;
      }
      setActiveNav(view);
      renderFilterChips();
      renderAll();
      document.getElementById("catalogSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  refs.searchInput.addEventListener("input", (event) => {
    state.query = String(event.target.value || "").trim();
    const token = ++state.searchToken;

    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    searchDebounce = setTimeout(async () => {
      if (token !== state.searchToken) {
        return;
      }

      if (state.query.length > 1) {
        try {
          await handleRemoteSearch(token);
        } catch {
          // keep local filtering only
        }
      }

      if (token === state.searchToken) {
        renderAll();
      }
    }, 320);
  });

  refs.sortSelect.addEventListener("change", (event) => {
    state.sortBy = String(event.target.value || "featured");
    renderAll();
  });

  refs.refreshNowBtn.addEventListener("click", () => {
    refs.refreshNowBtn.disabled = true;
    refs.refreshNowBtn.textContent = "Synchronisation...";
    Promise.allSettled([loadTopDaily(), refreshCatalogHead()])
      .then(() => {
        renderAll();
        showToast("Catalogue synchronise.");
      })
      .catch(() => {
        showToast("Erreur de synchronisation temporaire.", true);
      })
      .finally(() => {
        refs.refreshNowBtn.disabled = false;
        refs.refreshNowBtn.textContent = "Synchroniser maintenant";
      });
  });

  refs.shareBrowseBtn.addEventListener("click", () => {
    copyBrowseLink().catch(() => {
      showToast("Impossible de copier le lien de cette vue.", true);
    });
  });

  refs.clearContinueBtn.addEventListener("click", () => {
    if (!window.confirm("Vider tout l'historique Continuer ?")) {
      return;
    }
    state.progress = {};
    saveProgress(state.progress);
    renderAll();
    showToast("Historique 'Continuer' vide.");
  });

  refs.clearListBtn.addEventListener("click", () => {
    if (!window.confirm("Vider completement Ma liste ?")) {
      return;
    }
    state.favorites = {};
    saveFavorites(state.favorites);
    if (state.view === "list") {
      state.view = "all";
      setActiveNav("all");
    }
    renderAll();
    showToast("Ma liste a ete videe.");
  });

  refs.heroPlayBtn.addEventListener("click", () => {
    if (!state.activeHeroId) {
      return;
    }
    openPlayer(state.activeHeroId).catch(() => {
      showMessage("Lecture indisponible pour ce titre.", true);
    });
  });

  refs.heroInfoBtn.addEventListener("click", () => {
    if (!state.activeHeroId) {
      return;
    }
    openDetails(state.activeHeroId).catch(() => {
      showMessage("Impossible de charger la fiche detaillee.", true);
    });
  });

  refs.heroTrailerBtn.addEventListener("click", () => {
    if (!state.activeHeroId) {
      return;
    }
    openTrailerFromHero(state.activeHeroId).catch(() => {
      showMessage("Bande-annonce indisponible.", true);
    });
  });

  refs.heroRandomBtn.addEventListener("click", () => {
    const pool = getVisibleCatalog();
    if (pool.length === 0) {
      showToast("Aucun titre disponible pour une suggestion.", true);
      return;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    state.activeHeroId = pick.id;
    renderAll();
    openDetails(pick.id).catch(() => {
      showToast("Impossible d'ouvrir la suggestion.", true);
    });
  });

  refs.loadMoreBtn.addEventListener("click", () => {
    loadMoreCatalog().catch(() => {
      updateLoadMoreButton();
    });
  });

  refs.detailCloseBtn.addEventListener("click", closeDetails);
  refs.detailModal.addEventListener("click", (event) => {
    if (event.target === refs.detailModal) {
      closeDetails();
    }
  });

  refs.detailPlayBtn.addEventListener("click", () => {
    if (!state.selectedDetailId) {
      return;
    }
    const season = Number(refs.detailSeasonSelect.value || "1");
    const episode = Number(refs.detailEpisodeSelect.value || "1");
    openPlayer(state.selectedDetailId, { season, episode }).catch(() => {
      showMessage("Impossible de lancer la lecture.", true);
    });
  });

  refs.detailTrailerBtn.addEventListener("click", () => {
    if (!state.selectedDetailId) {
      return;
    }
    toggleTrailerInline(state.selectedDetailId).catch(() => {
      showMessage("Bande-annonce indisponible.", true);
    });
  });

  refs.detailFavoriteBtn.addEventListener("click", () => {
    if (!state.selectedDetailId) {
      return;
    }
    toggleFavorite(state.selectedDetailId);
    updateDetailFavoriteButton(state.selectedDetailId);
  });

  refs.detailShareBtn.addEventListener("click", () => {
    copyCurrentLink().catch(() => {
      showToast("Impossible de copier le lien.", true);
    });
  });

  refs.detailSeasonSelect.addEventListener("change", () => {
    const id = state.selectedDetailId;
    if (!id) {
      return;
    }
    const seasons = state.seasonsCache.get(id) || [];
    const season = Number(refs.detailSeasonSelect.value || "1");
    const episodes = getEpisodesForSeason(seasons, season);
    const selectedEpisode = episodes[0] ? episodes[0].episode : 1;
    populateEpisodeSelect(refs.detailEpisodeSelect, episodes, selectedEpisode);
  });

  refs.playerCloseBtn.addEventListener("click", closePlayer);
  refs.playerOverlay.addEventListener("click", (event) => {
    if (event.target === refs.playerOverlay) {
      closePlayer();
    }
  });

  refs.playerSeasonSelect.addEventListener("change", () => {
    if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
      return;
    }
    const season = Number(refs.playerSeasonSelect.value || "1");
    const seasons = state.seasonsCache.get(state.nowPlaying.id) || [];
    const episodes = getEpisodesForSeason(seasons, season);
    const episode = episodes[0] ? episodes[0].episode : 1;
    populateEpisodeSelect(refs.playerEpisodeSelect, episodes, episode);
    switchPlayerEpisode(season, episode).catch(() => {
      showMessage("Impossible de charger cet episode.", true);
    });
  });

  refs.playerEpisodeSelect.addEventListener("change", () => {
    if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
      return;
    }
    const season = Number(refs.playerSeasonSelect.value || "1");
    const episode = Number(refs.playerEpisodeSelect.value || "1");
    switchPlayerEpisode(season, episode).catch(() => {
      showMessage("Impossible de charger cet episode.", true);
    });
  });

  refs.playerVideo.addEventListener("timeupdate", onPlayerProgress);
  refs.playerVideo.addEventListener("ended", onPlayerEnded);
  refs.playerVideo.addEventListener("error", () => {
    trySwitchToNextSource().catch(() => {
      setPlayerStatus("Erreur video detectee. Choisis un autre titre.", true);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== refs.searchInput) {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (!typing) {
        event.preventDefault();
        refs.searchInput.focus();
      }
    }

    if (event.key !== "Escape") {
      return;
    }
    if (!refs.playerOverlay.hidden) {
      closePlayer();
      return;
    }
    if (!refs.detailModal.hidden) {
      closeDetails();
    }
  });

  window.addEventListener("popstate", () => {
    handlePopState().catch(() => {
      // no-op
    });
  });
}

function setActiveNav(view) {
  refs.navPills.forEach((entry) => {
    entry.classList.toggle("active", (entry.dataset.view || "") === view);
  });
}

function startAutoRefresh() {
  if (state.refreshFeedTimer) {
    clearInterval(state.refreshFeedTimer);
  }
  if (state.refreshTopTimer) {
    clearInterval(state.refreshTopTimer);
  }

  state.refreshFeedTimer = setInterval(() => {
    refreshCatalogHead().catch(() => {
      // retry later
    });
  }, REFRESH_FEED_MS);

  state.refreshTopTimer = setInterval(() => {
    loadTopDaily()
      .then(() => renderAll())
      .catch(() => {
        // retry later
      });
  }, REFRESH_TOP_MS);
}

async function detectSeriesSupport() {
  let probeOk = true;
  try {
    const payload = await fetchJson(`${API_BASE}/stream/3830/episode?season=1&episode=3`);
    const source = pickSource(payload);
    probeOk = Boolean(source?.url);
  } catch {
    probeOk = false;
  }

  state.seriesSupported = probeOk;
  refs.supportInfo.textContent = probeOk
    ? "Series et animes actives: episodes multiples accessibles, sans inscription."
    : "Series indisponibles: mode films gratuit active.";

  applySeriesSupportToNav();
}

function applySeriesSupportToNav() {
  refs.navPills.forEach((pill) => {
    const view = pill.dataset.view || "";
    const blocked = !state.seriesSupported && (view === "tv" || view === "anime");
    pill.style.display = blocked ? "none" : "";
  });
  refs.quickLinks.forEach((link) => {
    const view = link.dataset.viewJump || "";
    const blocked = !state.seriesSupported && (view === "tv" || view === "anime");
    link.style.display = blocked ? "none" : "";
  });

  if (!state.seriesSupported && (state.view === "tv" || state.view === "anime")) {
    state.view = "movie";
    state.chip = "movie";
    setActiveNav("movie");
    renderFilterChips();
    return;
  }
  setActiveNav(state.view);
}

function renderFilterChips() {
  const chips = [
    { id: "all", label: "Tous" },
    { id: "recent", label: "Recents" },
    { id: "movie", label: "Films" },
  ];
  if (state.seriesSupported) {
    chips.push({ id: "tv", label: "Series" });
    chips.push({ id: "anime", label: "Anime" });
  }

  if (!chips.some((chip) => chip.id === state.chip)) {
    state.chip = "all";
  }

  refs.filterChips.innerHTML = "";
  for (const chip of chips) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip${state.chip === chip.id ? " active" : ""}`;
    button.textContent = chip.label;
    button.addEventListener("click", () => {
      state.chip = chip.id;
      renderFilterChips();
      renderAll();
    });
    refs.filterChips.appendChild(button);
  }
}

async function loadInitialCatalog() {
  state.loadingCatalog = true;
  updateLoadMoreButton();

  try {
    state.catalog = [];
    state.page = 0;
    state.totalPages = 0;
    state.catalogSyncPage = 0;
    state.hasMore = true;

    const firstResult = await fetchCatalogPage(1);
    upsertCatalogItems(firstResult.items, { prepend: false });
    state.page = firstResult.currentPage;
    state.totalPages = firstResult.lastPage;
    state.catalogSyncPage = firstResult.currentPage;
    state.hasMore = firstResult.currentPage < firstResult.lastPage;

    const warmupLastPage = Math.min(firstResult.lastPage, INITIAL_CATALOG_WARMUP_PAGES);
    for (let page = 2; page <= warmupLastPage; page += 1) {
      const result = await fetchCatalogPage(page);
      upsertCatalogItems(result.items, { prepend: false });
      state.page = result.currentPage;
      state.totalPages = result.lastPage;
      state.catalogSyncPage = result.currentPage;
      state.hasMore = result.currentPage < result.lastPage;
    }
    state.lastSyncAt = new Date();

    if (state.page < state.totalPages) {
      startBackgroundCatalogSync(state.page + 1, state.totalPages);
    }
  } catch {
    state.catalog = FALLBACK_ITEMS.slice();
    state.page = 1;
    state.totalPages = 1;
    state.catalogSyncPage = 1;
    state.hasMore = false;
  } finally {
    state.loadingCatalog = false;
  }

  if (!state.activeHeroId && state.catalog[0]) {
    state.activeHeroId = state.catalog[0].id;
  }
}

async function loadMoreCatalog() {
  if (state.loadingCatalog || state.backgroundSyncRunning || !state.hasMore || state.view === "top") {
    return;
  }

  state.loadingCatalog = true;
  updateLoadMoreButton();

  try {
    const result = await fetchCatalogPage(state.page + 1);
    upsertCatalogItems(result.items, { prepend: false });
    state.page = result.currentPage;
    state.totalPages = Math.max(state.totalPages, result.lastPage);
    state.catalogSyncPage = result.currentPage;
    state.hasMore = state.page < state.totalPages;
    state.lastSyncAt = new Date();
    renderAll();
  } finally {
    state.loadingCatalog = false;
    updateLoadMoreButton();
  }
}

async function startBackgroundCatalogSync(startPage, lastPage) {
  if (state.backgroundSyncRunning || startPage > lastPage) {
    return;
  }

  state.backgroundSyncRunning = true;
  updateLoadMoreButton();

  try {
    for (let page = startPage; page <= lastPage; page += 1) {
      const result = await fetchCatalogPage(page);
      upsertCatalogItems(result.items, { prepend: false });

      state.page = Math.max(state.page, result.currentPage);
      state.totalPages = Math.max(state.totalPages, result.lastPage);
      state.catalogSyncPage = result.currentPage;
      state.hasMore = state.page < state.totalPages;
      state.lastSyncAt = new Date();

      if (page === lastPage || page % BACKGROUND_CATALOG_RENDER_EVERY === 0) {
        renderAll();
      } else {
        updateSyncText();
      }

      if (BACKGROUND_CATALOG_DELAY_MS > 0) {
        await wait(BACKGROUND_CATALOG_DELAY_MS);
      }
    }
  } catch {
    showToast("Sync catalogue complete interrompue. Nouvelle tentative auto plus tard.", true);
  } finally {
    state.backgroundSyncRunning = false;
    state.hasMore = state.page < state.totalPages;
    updateLoadMoreButton();
    updateSyncText();
  }
}

async function refreshCatalogHead() {
  try {
    const result = await fetchCatalogPage(1);
    const beforeCount = state.catalog.length;
    upsertCatalogItems(result.items, { prepend: true });
    state.totalPages = Math.max(state.totalPages, result.lastPage);
    state.catalogSyncPage = Math.max(state.catalogSyncPage, result.currentPage);
    state.lastSyncAt = new Date();
    if (state.catalog.length !== beforeCount) {
      renderAll();
    } else {
      updateSyncText();
    }
  } catch {
    updateSyncText("Synchronisation auto: echec temporaire, nouvelle tentative plus tard.");
  }
}

async function loadTopDaily() {
  state.loadingTop = true;

  try {
    const payload = await fetchJson(`${API_BASE}/catalog/top-10-for-home`);
    const rows = Array.isArray(payload?.data?.items) ? payload.data.items : [];
    const mapped = rows.map(normalizeCatalogItem);
    state.topDaily = state.seriesSupported ? mapped : mapped.filter((item) => item.type === "movie");
    if (!state.activeHeroId && mapped[0]) {
      state.activeHeroId = mapped[0].id;
    }
    updateSyncText();
  } catch {
    state.topDaily = buildTopFromCatalog();
  } finally {
    state.loadingTop = false;
  }
}

async function handleRemoteSearch(token) {
  const query = state.query.trim();
  if (query.length < 2) {
    return;
  }

  const payload = await fetchJson(`${API_BASE}/search-bar/search/${encodeURIComponent(query)}`);
  if (token !== state.searchToken) {
    return;
  }

  const rows = payload?.data?.items?.movies?.items;
  if (!Array.isArray(rows)) {
    return;
  }

  const mapped = rows.map(normalizeCatalogItem);
  upsertCatalogItems(mapped, { prepend: true });
}

function upsertCatalogItems(items, { prepend }) {
  const map = new Map(state.catalog.map((item) => [item.id, item]));
  const incoming = [];

  for (const raw of items) {
    const item = !state.seriesSupported && raw.type === "tv" ? null : raw;
    if (!item) {
      continue;
    }

    if (map.has(item.id)) {
      map.set(item.id, { ...map.get(item.id), ...item });
    } else {
      incoming.push(item);
      map.set(item.id, item);
    }
  }

  const merged = Array.from(map.values());
  if (prepend && incoming.length > 0) {
    const incomingIds = new Set(incoming.map((entry) => entry.id));
    state.catalog = [...incoming, ...merged.filter((entry) => !incomingIds.has(entry.id))];
    return;
  }

  state.catalog = merged;
}

async function fetchCatalogPage(page) {
  const payload = await fetchJson(`${API_BASE}/catalog/movies?page=${page}`);
  const items = payload?.data?.items || {};
  const rows = Array.isArray(items.data) ? items.data : [];

  return {
    items: rows.map(normalizeCatalogItem),
    currentPage: Number(items.current_page || page),
    lastPage: Number(items.last_page || page),
  };
}

function normalizeCatalogItem(raw) {
  return {
    id: Number(raw?.id || 0),
    type: raw?.type === "tv" ? "tv" : "movie",
    title: String(raw?.title || "Sans titre"),
    poster: raw?.large_poster_path || raw?.small_poster_path || "",
    backdrop: raw?.wallpaper_poster_path || raw?.small_poster_path || raw?.large_poster_path || "",
    runtime: typeof raw?.runtime === "number" ? raw.runtime : null,
    releaseDate: raw?.release_date || null,
    endDate: raw?.end_date || null,
    isAnime: Boolean(raw?.isAnime),
  };
}

function buildTopFromCatalog() {
  const base = state.seriesSupported ? state.catalog : state.catalog.filter((item) => item.type === "movie");
  return base
    .slice()
    .sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate))
    .slice(0, 10);
}

function renderAll() {
  const visible = getVisibleCatalog();
  const heroItem = getHeroItem(visible);

  renderHero(heroItem);
  renderTopDaily();
  renderCommunityStats();
  renderSpotlights();
  renderMyList();
  renderContinue();
  renderCatalog(visible);

  refs.emptyState.hidden = visible.length > 0;
  refs.topSection.hidden = state.topDaily.length === 0;

  syncBrowseRoute();
  updateLoadMoreButton();
  updateSyncText();
}

function getVisibleCatalog() {
  let list = state.catalog.slice();
  if (state.view === "top") {
    list = state.topDaily.slice();
  } else if (state.view === "list") {
    list = getFavoriteCatalog();
  }

  if (state.view === "movie") {
    list = list.filter((item) => item.type === "movie");
  } else if (state.view === "tv") {
    list = list.filter((item) => item.type === "tv");
  } else if (state.view === "anime") {
    list = list.filter((item) => item.isAnime);
  }

  if (state.chip === "movie") {
    list = list.filter((item) => item.type === "movie");
  } else if (state.chip === "tv") {
    list = list.filter((item) => item.type === "tv");
  } else if (state.chip === "anime") {
    list = list.filter((item) => item.isAnime);
  }

  if (state.chip === "recent") {
    list.sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate));
  }

  if (!state.seriesSupported) {
    list = list.filter((item) => item.type === "movie");
  }

  const query = state.query.trim().toLowerCase();
  if (query.length > 1) {
    list = list.filter((item) => item.title.toLowerCase().includes(query));
  }

  if (state.sortBy === "recent") {
    list.sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate));
  } else if (state.sortBy === "title-asc") {
    list.sort((a, b) => a.title.localeCompare(b.title, "fr", { sensitivity: "base" }));
  } else if (state.sortBy === "title-desc") {
    list.sort((a, b) => b.title.localeCompare(a.title, "fr", { sensitivity: "base" }));
  } else if (state.sortBy === "runtime-desc") {
    list.sort((a, b) => Number(b.runtime || 0) - Number(a.runtime || 0));
  }

  return list;
}

function renderCommunityStats() {
  const total = state.catalog.length;
  const movies = state.catalog.filter((item) => item.type === "movie").length;
  const series = state.catalog.filter((item) => item.type === "tv").length;
  const anime = state.catalog.filter((item) => item.isAnime).length;
  const favorites = Object.keys(state.favorites).length;
  const activeWatch = Object.values(state.progress).filter((entry) => Number(entry?.time || 0) > 0).length;

  const stats = [
    { label: "Titres", value: total },
    { label: "Films", value: movies },
    { label: "Series", value: series },
    { label: "Anime", value: anime },
    { label: "Ma liste", value: favorites },
    { label: "En cours", value: activeWatch },
  ];

  refs.communityStats.innerHTML = "";
  stats.forEach((stat) => {
    const card = document.createElement("article");
    card.className = "stat-card";
    card.innerHTML = `
      <p class="stat-label">${escapeHtml(stat.label)}</p>
      <p class="stat-value">${escapeHtml(stat.value)}</p>
    `;
    refs.communityStats.appendChild(card);
  });
}

function renderSpotlights() {
  const latest = state.catalog
    .slice()
    .sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate))
    .slice(0, 10);

  const popularMap = new Map();
  state.topDaily.forEach((item) => {
    if (!popularMap.has(item.id)) {
      popularMap.set(item.id, item);
    }
  });

  const watchedIds = Object.values(state.progress)
    .sort((a, b) => Number(b.lastPlayed || 0) - Number(a.lastPlayed || 0))
    .map((entry) => Number(entry.id || 0))
    .filter((id) => id > 0);
  watchedIds.forEach((id) => {
    const item = findItemById(id);
    if (item && !popularMap.has(item.id)) {
      popularMap.set(item.id, item);
    }
  });

  const popular = Array.from(popularMap.values()).slice(0, 10);

  refs.latestGrid.innerHTML = "";
  latest.forEach((item) => refs.latestGrid.appendChild(buildMediaCard(item, false)));
  refs.latestSection.hidden = latest.length === 0;

  refs.popularGrid.innerHTML = "";
  popular.forEach((item) => refs.popularGrid.appendChild(buildMediaCard(item, false)));
  refs.popularSection.hidden = popular.length === 0;
}

function getFavoriteCatalog() {
  const ids = Object.keys(state.favorites)
    .map((id) => Number(id))
    .filter((id) => id > 0);

  const list = ids
    .map((id) => {
      const item = findItemById(id);
      if (item) {
        return { ...item, addedAt: Number(state.favorites[item.id]?.addedAt || 0) };
      }
      const favorite = state.favorites[id] || {};
      return {
        id,
        type: favorite.type === "tv" ? "tv" : "movie",
        title: String(favorite.title || "Titre"),
        poster: "",
        backdrop: "",
        runtime: null,
        releaseDate: null,
        endDate: null,
        isAnime: false,
        addedAt: Number(favorite.addedAt || 0),
      };
    })
    .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

  return list;
}

function renderMyList() {
  const items = getFavoriteCatalog().slice(0, 15);
  refs.listGrid.innerHTML = "";
  items.forEach((item) => refs.listGrid.appendChild(buildMediaCard(item, false)));
  refs.listSection.hidden = items.length === 0;
}

function getHeroItem(visible) {
  if (state.activeHeroId) {
    const fromVisible = visible.find((item) => item.id === state.activeHeroId);
    if (fromVisible) {
      return fromVisible;
    }
    const fromAll = findItemById(state.activeHeroId);
    if (fromAll) {
      return fromAll;
    }
  }

  const fallback = state.topDaily[0] || visible[0] || state.catalog[0] || null;
  state.activeHeroId = fallback ? fallback.id : null;
  return fallback;
}

function renderHero(item) {
  if (!item) {
    refs.heroTitle.textContent = "Catalogue indisponible";
    refs.heroDescription.textContent = "Aucune source disponible actuellement.";
    refs.heroArt.src = "";
    refs.heroMeta.innerHTML = "";
    return;
  }

  const details = state.detailsCache.get(item.id);
  const overview = details?.overview || "Streaming rapide, sans compte et sans abonnement.";

  refs.heroTitle.textContent = item.title;
  refs.heroDescription.textContent = overview;
  refs.heroArt.src = details?.posters?.wallpaper || details?.posters?.small || item.backdrop || item.poster;
  refs.heroArt.alt = item.title;
  wireImageFallback(refs.heroArt, item.title, true);

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

  const topRank = state.topDaily.findIndex((entry) => entry.id === item.id);
  if (topRank >= 0) {
    tags.push(`Top #${topRank + 1}`);
  }

  tags.push("Gratuit");

  for (const tag of tags) {
    const span = document.createElement("span");
    span.className = "hero-tag";
    span.textContent = tag;
    refs.heroMeta.appendChild(span);
  }

  ensureDetails(item.id).catch(() => {
    // keep card data only
  });
}

function renderTopDaily() {
  refs.topGrid.innerHTML = "";

  state.topDaily.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "top-card";

    card.innerHTML = `
      <div class="top-thumb">
        <img src="${escapeHtml(item.backdrop || item.poster)}" alt="${escapeHtml(item.title)}" loading="lazy" />
        <span class="top-rank">${index + 1}</span>
      </div>
      <div class="top-body">
        <h3 class="top-title">${escapeHtml(item.title)}</h3>
        <p class="top-meta">${item.type === "tv" ? "Serie" : "Film"} - ${escapeHtml(getYear(item.releaseDate) || "-")}</p>
        <div class="media-actions">
          <button type="button" class="btn-small btn-play" data-top-play="${item.id}">Lire</button>
          <button type="button" class="btn-small btn-info" data-top-info="${item.id}">Details</button>
        </div>
      </div>
    `;

    const topImg = card.querySelector("img");
    if (topImg) {
      wireImageFallback(topImg, item.title, true);
    }

    card.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement && event.target.tagName.toLowerCase() === "button") {
        return;
      }
      state.activeHeroId = item.id;
      renderAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const play = card.querySelector(`[data-top-play="${item.id}"]`);
    const info = card.querySelector(`[data-top-info="${item.id}"]`);

    if (play) {
      play.addEventListener("click", () => {
        openPlayer(item.id).catch(() => {
          showMessage("Lecture indisponible pour ce titre.", true);
        });
      });
    }
    if (info) {
      info.addEventListener("click", () => {
        openDetails(item.id).catch(() => {
          showMessage("Impossible de charger la fiche detaillee.", true);
        });
      });
    }

    refs.topGrid.appendChild(card);
  });
}

function renderCatalog(items) {
  refs.catalogGrid.innerHTML = "";
  items.forEach((item) => {
    refs.catalogGrid.appendChild(buildMediaCard(item, false));
  });
}

function renderContinue() {
  const entries = Object.values(state.progress)
    .filter((entry) => Number(entry?.lastPlayed || 0) > 0)
    .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0))
    .slice(0, 6);

  refs.continueGrid.innerHTML = "";
  refs.continueSection.hidden = entries.length === 0;

  entries.forEach((entry) => {
    const item = findItemById(entry.id) || {
      id: entry.id,
      type: entry.type,
      title: entry.title,
      poster: entry.poster,
      backdrop: entry.poster,
      runtime: null,
      releaseDate: null,
      isAnime: false,
    };
    refs.continueGrid.appendChild(buildMediaCard(item, true, entry));
  });
}

function buildMediaCard(item, resume = false, progressEntry = null) {
  const card = document.createElement("article");
  card.className = "media-card";
  card.dataset.cardId = String(item.id);

  const year = getYear(item.releaseDate) || "-";
  const runtime = item.runtime ? toHumanRuntime(item.runtime) : "Episode";
  const favorite = isFavorite(item.id);
  const progress = progressEntry || state.progress[item.id] || null;
  const ratioRaw = progress && Number(progress.duration || 0) > 0
    ? (Number(progress.time || 0) / Number(progress.duration || 1)) * 100
    : 0;
  const ratio = Math.max(0, Math.min(100, Math.round(ratioRaw)));
  const isRecent = parseReleaseDate(item.releaseDate) > Date.now() - 90 * 24 * 60 * 60 * 1000;

  card.innerHTML = `
    <div class="media-thumb">
      <img src="${escapeHtml(item.backdrop || item.poster)}" alt="${escapeHtml(item.title)}" loading="lazy" />
      <div class="media-flags">
        <span class="flag good">FREE</span>
        <span class="flag">${item.type === "tv" ? "SERIE" : "FILM"}</span>
        ${isRecent ? '<span class="flag hot">NEW</span>' : ""}
        ${item.isAnime ? '<span class="flag">ANIME</span>' : ""}
      </div>
      ${ratio > 0 ? `<div class="progress-track"><span style="width:${ratio}%"></span></div>` : ""}
    </div>
    <div class="media-body">
      <h3 class="media-title">${escapeHtml(item.title)}</h3>
      <p class="media-meta">${escapeHtml(year)} - ${escapeHtml(runtime)}</p>
      <div class="media-actions">
        <button type="button" class="btn-small btn-play" data-card-play="${item.id}">${resume ? "Reprendre" : "Lire"}</button>
        <button type="button" class="btn-small btn-info" data-card-info="${item.id}">Details</button>
        <button type="button" class="btn-small btn-fav${favorite ? " active" : ""}" data-card-fav="${item.id}">${favorite ? "Retirer" : "+ Liste"}</button>
      </div>
    </div>
  `;

  const mediaImg = card.querySelector("img");
  if (mediaImg) {
    wireImageFallback(mediaImg, item.title, false);
  }

  const play = card.querySelector(`[data-card-play="${item.id}"]`);
  const info = card.querySelector(`[data-card-info="${item.id}"]`);
  const fav = card.querySelector(`[data-card-fav="${item.id}"]`);

  if (play) {
    play.addEventListener("click", () => {
      if (resume && progressEntry) {
        openPlayer(item.id, {
          season: progressEntry.season || 1,
          episode: progressEntry.episode || 1,
          resumeTime: Number(progressEntry.time || 0),
        }).catch(() => {
          showMessage("Impossible de reprendre la lecture.", true);
        });
        return;
      }
      openPlayer(item.id).catch(() => {
        showMessage("Lecture indisponible pour ce titre.", true);
      });
    });
  }

  if (info) {
    info.addEventListener("click", () => {
      openDetails(item.id).catch(() => {
        showMessage("Impossible de charger les details.", true);
      });
    });
  }

  if (fav) {
    fav.addEventListener("click", () => {
      toggleFavorite(item.id);
      const nowFavorite = isFavorite(item.id);
      fav.classList.toggle("active", nowFavorite);
      fav.textContent = nowFavorite ? "Retirer" : "+ Liste";
    });
  }

  return card;
}

function updateLoadMoreButton() {
  if (state.backgroundSyncRunning || state.view === "top" || state.view === "list" || !state.hasMore) {
    refs.loadMoreBtn.hidden = true;
    refs.loadMoreBtn.disabled = false;
    refs.loadMoreBtn.textContent = "Charger plus";
    return;
  }

  refs.loadMoreBtn.hidden = false;
  refs.loadMoreBtn.disabled = state.loadingCatalog;
  refs.loadMoreBtn.textContent = state.loadingCatalog ? "Chargement..." : "Charger plus";
}

function updateSyncText(customText = "") {
  if (customText) {
    refs.syncInfo.textContent = customText;
    return;
  }

  const topLabel = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (state.backgroundSyncRunning && state.totalPages > 0) {
    const current = Math.min(state.catalogSyncPage || state.page || 0, state.totalPages);
    refs.syncInfo.textContent = `Top du jour ${topLabel}. Synchronisation Purstream (/movie) ${current}/${state.totalPages}...`;
    return;
  }

  if (!state.lastSyncAt) {
    refs.syncInfo.textContent = `Top du jour ${topLabel}. Synchronisation initiale Purstream (/movie) en cours.`;
    return;
  }

  const timeLabel = state.lastSyncAt.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  refs.syncInfo.textContent = `Top du jour ${topLabel}. Derniere synchro catalogue Purstream: ${timeLabel}.`;
}

async function ensureDetails(id) {
  if (!id || state.detailsCache.has(id)) {
    return state.detailsCache.get(id) || null;
  }

  const payload = await fetchJson(`${API_BASE}/media/${id}/sheet`);
  const details = payload?.data?.items;
  if (details && typeof details === "object") {
    state.detailsCache.set(id, details);
    return details;
  }
  return null;
}

async function ensureTrailers(id) {
  if (!id) {
    return [];
  }
  if (state.trailersCache.has(id)) {
    return state.trailersCache.get(id);
  }

  try {
    const payload = await fetchJson(`${API_BASE}/media/${id}/trailers`);
    const rows = Array.isArray(payload?.data?.items) ? payload.data.items : [];
    const trailers = rows
      .map((entry) => String(entry?.youtubeId || "").trim())
      .filter((entry) => entry.length > 0);
    state.trailersCache.set(id, trailers);
    return trailers;
  } catch {
    state.trailersCache.set(id, []);
    return [];
  }
}

async function ensureSeasons(id) {
  if (state.seasonsCache.has(id)) {
    return state.seasonsCache.get(id);
  }

  const payload = await fetchJson(`${API_BASE}/media/${id}/seasons`);
  const rows = Array.isArray(payload?.data?.items) ? payload.data.items : [];

  const seasons = rows
    .map((entry) => ({
      season: Number(entry?.season || 0),
      episodes: Array.isArray(entry?.episodes)
        ? entry.episodes
            .map((episode) => ({
              episode: Number(episode?.episode || 0),
              name: String(episode?.name || `Episode ${episode?.episode || "?"}`),
              runtime: Number(episode?.runtime?.minutes || 0),
            }))
            .filter((episode) => episode.episode > 0)
        : [],
    }))
    .filter((entry) => entry.season > 0 && entry.episodes.length > 0)
    .sort((a, b) => a.season - b.season);

  state.seasonsCache.set(id, seasons);
  return seasons;
}

function getEpisodesForSeason(seasons, seasonNumber) {
  const season = seasons.find((entry) => entry.season === seasonNumber);
  return season ? season.episodes : [];
}

function populateSeasonSelect(select, seasons, selectedSeason) {
  select.innerHTML = "";
  seasons.forEach((entry) => {
    const option = document.createElement("option");
    option.value = String(entry.season);
    option.textContent = `Saison ${entry.season}`;
    option.selected = entry.season === selectedSeason;
    select.appendChild(option);
  });
}

function populateEpisodeSelect(select, episodes, selectedEpisode) {
  select.innerHTML = "";
  episodes.forEach((entry) => {
    const option = document.createElement("option");
    option.value = String(entry.episode);
    option.textContent = `E${String(entry.episode).padStart(2, "0")} - ${entry.name}`;
    option.selected = entry.episode === selectedEpisode;
    select.appendChild(option);
  });
}

async function openDetails(id, options = {}) {
  state.selectedDetailId = id;
  const item = findItemById(id) || (await buildItemFromDetails(id));
  if (!item) {
    throw new Error("Item not found");
  }
  if (!state.seriesSupported && item.type === "tv") {
    showMessage("Series indisponibles actuellement. Mode films actif.", true);
    return;
  }
  state.activeHeroId = id;
  if (options.syncRoute !== false) {
    setAppRoute({ detail: id });
  }

  const details = await ensureDetails(id);
  const trailers = await ensureTrailers(id);

  refs.detailPoster.src = details?.posters?.large || details?.posters?.small || item.poster || item.backdrop;
  refs.detailPoster.alt = item.title;
  wireImageFallback(refs.detailPoster, item.title, false);
  refs.detailKicker.textContent = item.type === "tv" ? "Serie detail" : "Film detail";
  refs.detailTitle.textContent = details?.title || item.title;

  const parts = [];
  const year = getYear(item.releaseDate || details?.releaseDate || "");
  if (year) {
    parts.push(year);
  }
  if (details?.runtime?.human) {
    parts.push(details.runtime.human);
  } else if (item.runtime) {
    parts.push(toHumanRuntime(item.runtime));
  }
  if (details?.note?.tmdb?.average) {
    parts.push(`TMDB ${Number(details.note.tmdb.average).toFixed(1)}`);
  }
  parts.push(item.type === "tv" ? "Serie" : "Film");
  refs.detailMeta.textContent = parts.join(" - ");

  refs.detailOverview.textContent =
    details?.overview || "Aucune description detaillee disponible pour ce titre.";

  refs.detailBadges.innerHTML = "";
  const badges = [];
  if (item.isAnime) {
    badges.push("Anime");
  }

  const categories = Array.isArray(details?.categories) ? details.categories : [];
  categories.slice(0, 8).forEach((category) => {
    if (category?.name) {
      badges.push(String(category.name));
    }
  });
  if (badges.length === 0) {
    badges.push("Streaming communautaire");
  }

  badges.forEach((label) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = label;
    refs.detailBadges.appendChild(span);
  });

  refs.detailTrailerBtn.disabled = trailers.length === 0;
  updateDetailFavoriteButton(id);

  if (item.type === "tv") {
    try {
      const seasons = await ensureSeasons(id);
      if (seasons.length > 0) {
        const defaultSeason = seasons[0].season;
        const episodes = getEpisodesForSeason(seasons, defaultSeason);
        const defaultEpisode = episodes[0] ? episodes[0].episode : 1;
        populateSeasonSelect(refs.detailSeasonSelect, seasons, defaultSeason);
        populateEpisodeSelect(refs.detailEpisodeSelect, episodes, defaultEpisode);
        refs.detailSeriesControls.hidden = false;
      } else {
        refs.detailSeriesControls.hidden = true;
      }
    } catch {
      refs.detailSeriesControls.hidden = true;
    }
  } else {
    refs.detailSeriesControls.hidden = true;
  }

  refs.trailerWrap.hidden = true;
  refs.trailerFrame.src = "";

  refs.detailModal.hidden = false;
  updateBodyScrollLock();
}

function closeDetails(options = {}) {
  refs.detailModal.hidden = true;
  refs.trailerWrap.hidden = true;
  refs.trailerFrame.src = "";
  if (options.syncRoute !== false && refs.playerOverlay.hidden) {
    setAppRoute({}, { replace: true });
  }
  updateBodyScrollLock();
}

async function openTrailerFromHero(id) {
  await openDetails(id);
  await toggleTrailerInline(id, true);
}

async function toggleTrailerInline(id, forceOpen = false) {
  const trailers = await ensureTrailers(id);
  if (trailers.length === 0) {
    throw new Error("No trailer");
  }

  if (!forceOpen && !refs.trailerWrap.hidden) {
    refs.trailerWrap.hidden = true;
    refs.trailerFrame.src = "";
    return;
  }

  const trailerId = trailers[0];
  refs.trailerFrame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
    trailerId
  )}?autoplay=1&rel=0`;
  refs.trailerWrap.hidden = false;
}

async function openPlayer(id, options = {}) {
  const item = findItemById(id) || (await buildItemFromDetails(id));
  if (!item) {
    throw new Error("Item not found");
  }
  if (!state.seriesSupported && item.type === "tv") {
    throw new Error("Series disabled");
  }

  const token = ++state.playToken;
  const resume = state.progress[id] || null;

  refs.playerOverlay.hidden = false;
  refs.playerTitle.textContent = item.title;
  setPlayerStatus("Preparation de la lecture...");
  if (refs.playerSourceMeta) {
    refs.playerSourceMeta.textContent = "";
  }
  updateBodyScrollLock();
  try {
    if (item.type === "tv") {
      const seasons = await ensureSeasons(id);
      if (token !== state.playToken) {
        return;
      }
      if (seasons.length === 0) {
        throw new Error("No seasons available");
      }

      let season = Number(options.season || resume?.season || seasons[0].season);
      if (!seasons.some((entry) => entry.season === season)) {
        season = seasons[0].season;
      }

      const episodes = getEpisodesForSeason(seasons, season);
      if (episodes.length === 0) {
        throw new Error("No episode for selected season");
      }

      let episode = Number(options.episode || resume?.episode || episodes[0].episode);
      if (!episodes.some((entry) => entry.episode === episode)) {
        episode = episodes[0].episode;
      }

      populateSeasonSelect(refs.playerSeasonSelect, seasons, season);
      populateEpisodeSelect(refs.playerEpisodeSelect, episodes, episode);
      refs.playerSeriesControls.hidden = false;

      await loadEpisodeStream(
        item,
        season,
        episode,
        Number(options.resumeTime || resume?.time || 0),
        token,
        options.syncRoute !== false
      );
      return;
    }

    refs.playerSeriesControls.hidden = true;
    await loadMovieStream(
      item,
      Number(options.resumeTime || resume?.time || 0),
      token,
      options.syncRoute !== false
    );
  } catch (error) {
    closePlayer({ syncRoute: false });
    throw error;
  }
}

async function loadMovieStream(item, resumeTime, token, syncRoute = true) {
  setPlayerStatus("Connexion au flux film...");
  const payload = await fetchJson(`${API_BASE}/stream/${item.id}`);
  if (token !== state.playToken) {
    return;
  }

  state.sourcePool = extractSources(payload);
  if (state.sourcePool.length === 0) {
    throw new Error("No movie source");
  }
  state.sourceIndex = -1;
  await playFromSourcePool(resumeTime, token, 0);
  state.nowPlaying = {
    id: item.id,
    type: "movie",
    title: item.title,
    poster: item.poster,
    season: 1,
    episode: 1,
  };
  if (syncRoute) {
    setAppRoute({ watch: item.id }, { replace: true });
  }
}

async function loadEpisodeStream(item, season, episode, resumeTime, token, syncRoute = true) {
  setPlayerStatus(`Chargement S${season}E${episode}...`);

  const payload = await fetchJson(
    `${API_BASE}/stream/${item.id}/episode?season=${season}&episode=${episode}`
  );
  if (token !== state.playToken) {
    return;
  }

  state.sourcePool = extractSources(payload);
  if (state.sourcePool.length === 0) {
    throw new Error("No episode source");
  }
  state.sourceIndex = -1;
  await playFromSourcePool(resumeTime, token, 0);

  state.nowPlaying = {
    id: item.id,
    type: "tv",
    title: item.title,
    poster: item.poster,
    season,
    episode,
  };
  if (syncRoute) {
    setAppRoute({ watch: item.id, season, episode }, { replace: true });
  }
  setPlayerStatus(`Lecture S${season}E${episode}`);
}

async function switchPlayerEpisode(season, episode) {
  if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
    return;
  }

  const item = findItemById(state.nowPlaying.id) || (await buildItemFromDetails(state.nowPlaying.id));
  if (!item) {
    return;
  }

  const token = ++state.playToken;
  await loadEpisodeStream(item, season, episode, 0, token);
}

function pickSource(payload) {
  const sources = extractSources(payload);
  return sources[0] || null;
}

function extractSources(payload) {
  const items = payload?.data?.items;
  const rawSources = Array.isArray(items?.sources)
    ? items.sources
    : Array.isArray(items)
      ? items
      : [];

  const normalized = rawSources
    .map((entry, index) => normalizeSourceEntry(entry, index))
    .filter(Boolean)
    .sort((left, right) => right.score - left.score);

  const seen = new Set();
  return normalized.filter((entry) => {
    if (seen.has(entry.url)) {
      return false;
    }
    seen.add(entry.url);
    return true;
  });
}

async function trySwitchToNextSource() {
  if (!state.sourcePool.length || state.sourceIndex < 0) {
    setPlayerStatus("Erreur video detectee. Choisis un autre titre.", true);
    return;
  }

  const nextIndex = state.sourceIndex + 1;
  if (nextIndex >= state.sourcePool.length) {
    setPlayerStatus("Source indisponible. Aucun secours disponible.", true);
    return;
  }

  const token = ++state.playToken;
  const resumeTime = Number(refs.playerVideo.currentTime || 0);
  await playFromSourcePool(resumeTime, token, nextIndex);
  showToast("Source alternative active.");
}

async function playFromSourcePool(resumeTime, token, startIndex = 0) {
  let lastError = null;
  for (let index = startIndex; index < state.sourcePool.length; index += 1) {
    state.sourceIndex = index;
    const source = state.sourcePool[index];
    setPlayerStatus(`Connexion source ${index + 1}/${state.sourcePool.length}...`);
    try {
      await startPlayerSource(source, resumeTime, token);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("No playable source");
}

function normalizeSourceEntry(entry, index) {
  const url = String(
    entry?.stream_url ||
      entry?.url ||
      entry?.file ||
      entry?.src ||
      ""
  ).trim();
  if (!url) {
    return null;
  }

  const format = guessSourceFormat(entry, url);
  const quality = String(entry?.quality || entry?.resolution || entry?.label || "").trim();
  const host = getSourceHost(url);
  const score = getSourceScore(format, quality, index);

  return {
    url,
    format,
    quality,
    host,
    score,
  };
}

function guessSourceFormat(entry, url) {
  const raw = String(entry?.format || entry?.type || "").toLowerCase();
  if (raw.includes("m3u8") || raw.includes("hls")) {
    return "hls";
  }
  if (raw.includes("mp4")) {
    return "mp4";
  }
  if (raw.includes("webm")) {
    return "webm";
  }
  if (raw.includes("mpd") || raw.includes("dash")) {
    return "dash";
  }

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

  return "unknown";
}

function getSourceHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getSourceScore(format, quality, index) {
  let score = 0;
  if (format === "mp4") {
    score += 300;
  } else if (format === "hls") {
    score += 260;
  } else if (format === "webm") {
    score += 230;
  } else if (format === "dash") {
    score += 180;
  } else {
    score += 110;
  }

  const qualityText = String(quality || "").toLowerCase();
  const qualityMatch = qualityText.match(/\d{3,4}/);
  if (qualityMatch) {
    score += Number(qualityMatch[0]) / 10;
  } else if (qualityText.includes("hd")) {
    score += 70;
  }

  score += Math.max(0, 30 - index);
  return score;
}

function formatSourceLabel(source, index, total) {
  const chunks = [`Source ${index + 1}/${total}`];
  if (source?.quality) {
    chunks.push(String(source.quality));
  }
  if (source?.format && source.format !== "unknown") {
    chunks.push(source.format.toUpperCase());
  }
  if (source?.host) {
    chunks.push(source.host);
  }
  return chunks.join(" · ");
}

async function startPlayerSource(source, resumeTime, token) {
  const streamUrl = String(source?.url || "").trim();
  if (!streamUrl) {
    throw new Error("Missing source URL");
  }

  const video = refs.playerVideo;
  teardownPlayerEngine(video);
  if (refs.playerSourceMeta) {
    refs.playerSourceMeta.textContent = formatSourceLabel(
      source,
      Math.max(0, state.sourceIndex),
      state.sourcePool.length || 1
    );
  }

  if (source?.format === "hls") {
    await startHlsPlayback(video, streamUrl, token);
  } else {
    if (source?.format === "dash" && !video.canPlayType(DASH_MIME)) {
      throw new Error("DASH not supported");
    }
    video.src = streamUrl;
    video.load();
    await waitVideoReady(video);
  }

  if (token !== state.playToken) {
    return;
  }

  if (resumeTime > 5 && Number.isFinite(video.duration) && resumeTime < video.duration - 8) {
    video.currentTime = resumeTime;
  }

  try {
    await video.play();
    setPlayerStatus("Lecture en cours.");
  } catch {
    setPlayerStatus("Clique sur Play dans le lecteur pour demarrer.");
  }
}

async function startHlsPlayback(video, streamUrl, token) {
  if (video.canPlayType(HLS_MIME)) {
    video.src = streamUrl;
    video.load();
    await waitVideoReady(video);
    return;
  }

  const Hls = await loadHlsLibrary();
  if (!Hls || !Hls.isSupported()) {
    throw new Error("HLS not supported");
  }

  const hls = new Hls({
    enableWorker: true,
    lowLatencyMode: false,
    maxBufferLength: 30,
  });
  state.hlsInstance = hls;

  await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("HLS timeout"));
    }, 15000);

    const onMediaAttached = () => {
      hls.loadSource(streamUrl);
    };
    const onManifestParsed = () => {
      cleanup();
      resolve();
    };
    const onError = (_event, data) => {
      if (!data?.fatal) {
        return;
      }
      cleanup();
      reject(new Error(`HLS fatal error: ${String(data?.type || "unknown")}`));
    };

    function cleanup() {
      clearTimeout(timeoutId);
      hls.off(Hls.Events.MEDIA_ATTACHED, onMediaAttached);
      hls.off(Hls.Events.MANIFEST_PARSED, onManifestParsed);
      hls.off(Hls.Events.ERROR, onError);
    }

    hls.on(Hls.Events.MEDIA_ATTACHED, onMediaAttached);
    hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);
    hls.on(Hls.Events.ERROR, onError);
    hls.attachMedia(video);
  });

  if (token !== state.playToken) {
    return;
  }

  hls.on(Hls.Events.ERROR, (_event, data) => {
    if (!data?.fatal) {
      return;
    }
    if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
      try {
        hls.recoverMediaError();
        return;
      } catch {
        // continue to fallback source
      }
    }
    trySwitchToNextSource().catch(() => {
      setPlayerStatus("Source indisponible. Aucun secours disponible.", true);
    });
  });

  await waitVideoReady(video);
}

function teardownPlayerEngine(video) {
  destroyHlsInstance();
  video.pause();
  video.removeAttribute("src");
  video.load();
}

function destroyHlsInstance() {
  if (!state.hlsInstance) {
    return;
  }
  try {
    state.hlsInstance.destroy();
  } catch {
    // ignore teardown errors
  }
  state.hlsInstance = null;
}

async function loadHlsLibrary() {
  if (window.Hls) {
    return window.Hls;
  }
  if (state.hlsScriptPromise) {
    return state.hlsScriptPromise;
  }

  state.hlsScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = HLS_JS_URL;
    script.async = true;
    script.onload = () => {
      if (!window.Hls) {
        state.hlsScriptPromise = null;
        reject(new Error("hls.js unavailable"));
        return;
      }
      resolve(window.Hls);
    };
    script.onerror = () => {
      state.hlsScriptPromise = null;
      reject(new Error("Failed to load hls.js"));
    };
    document.head.appendChild(script);
  });

  return state.hlsScriptPromise;
}

function waitVideoReady(video) {
  if (video.readyState >= 1) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("Video timeout"));
    }, 15000);

    function onReady() {
      cleanup();
      resolve();
    }

    function onError() {
      cleanup();
      reject(new Error("Video error"));
    }

    function cleanup() {
      clearTimeout(timeoutId);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("error", onError);
    }

    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

function setPlayerStatus(message, isError = false) {
  refs.playerStatus.textContent = message || "";
  refs.playerStatus.style.color = isError ? "var(--danger)" : "#9bdfff";
}

function closePlayer(options = {}) {
  refs.playerOverlay.hidden = true;
  refs.playerSeriesControls.hidden = true;
  teardownPlayerEngine(refs.playerVideo);

  setPlayerStatus("");
  if (refs.playerSourceMeta) {
    refs.playerSourceMeta.textContent = "";
  }
  state.sourcePool = [];
  state.sourceIndex = -1;
  state.nowPlaying = null;
  if (options.syncRoute !== false && !refs.detailModal.hidden && state.selectedDetailId) {
    setAppRoute({ detail: state.selectedDetailId }, { replace: true });
  } else if (options.syncRoute !== false) {
    setAppRoute({}, { replace: true });
  }
  updateBodyScrollLock();
}

function onPlayerProgress() {
  if (!state.nowPlaying) {
    return;
  }

  const now = Date.now();
  if (now - lastProgressSave < 1400) {
    return;
  }
  lastProgressSave = now;

  state.progress[state.nowPlaying.id] = {
    id: state.nowPlaying.id,
    type: state.nowPlaying.type,
    title: state.nowPlaying.title,
    poster: state.nowPlaying.poster,
    season: state.nowPlaying.season || 1,
    episode: state.nowPlaying.episode || 1,
    time: refs.playerVideo.currentTime,
    duration: Number.isFinite(refs.playerVideo.duration) ? refs.playerVideo.duration : 0,
    lastPlayed: now,
  };

  saveProgress(state.progress);
}

function onPlayerEnded() {
  if (!state.nowPlaying) {
    return;
  }

  const ended = { ...state.nowPlaying };
  const current = state.progress[state.nowPlaying.id];
  if (current) {
    current.time = 0;
    current.lastPlayed = Date.now();
    saveProgress(state.progress);
  }

  if (ended.type === "tv") {
    autoAdvanceEpisode(ended).catch(() => {
      showToast("Fin d'episode. Selectionne le suivant.", false);
    });
  }
  renderContinue();
}

async function autoAdvanceEpisode(ended) {
  const seasons = state.seasonsCache.get(ended.id) || (await ensureSeasons(ended.id));
  const season = seasons.find((entry) => entry.season === ended.season);
  if (!season) {
    return;
  }

  const sortedEpisodes = season.episodes.slice().sort((a, b) => a.episode - b.episode);
  const currentIndex = sortedEpisodes.findIndex((entry) => entry.episode === ended.episode);
  if (currentIndex < 0 || currentIndex >= sortedEpisodes.length - 1) {
    showToast("Fin de saison atteinte.");
    return;
  }

  const nextEpisode = sortedEpisodes[currentIndex + 1].episode;
  populateEpisodeSelect(refs.playerEpisodeSelect, sortedEpisodes, nextEpisode);
  refs.playerEpisodeSelect.value = String(nextEpisode);

  await switchPlayerEpisode(ended.season, nextEpisode);
  showToast(`Episode suivant lance: S${ended.season}E${nextEpisode}.`);
}

async function buildItemFromDetails(id) {
  const details = await ensureDetails(id);
  if (!details) {
    return null;
  }

  const item = {
    id: Number(details.id || id),
    type: details.type === "tv" ? "tv" : "movie",
    title: String(details.title || "Sans titre"),
    poster: details?.posters?.large || details?.posters?.small || details?.posters?.wallpaper || "",
    backdrop: details?.posters?.wallpaper || details?.posters?.small || details?.posters?.large || "",
    runtime: Number(details?.runtime?.minutes || 0) || null,
    releaseDate: details?.releaseDate || null,
    endDate: null,
    isAnime: Boolean(details?.isAnime),
  };

  if (!state.catalog.some((entry) => entry.id === item.id)) {
    state.catalog.unshift(item);
  }
  return item;
}

function findItemById(id) {
  return (
    state.catalog.find((item) => item.id === id) ||
    state.topDaily.find((item) => item.id === id) ||
    null
  );
}

function updateBodyScrollLock() {
  const lock = !refs.playerOverlay.hidden || !refs.detailModal.hidden;
  document.body.style.overflow = lock ? "hidden" : "";
}

function parseReleaseDate(value) {
  if (!value) {
    return 0;
  }
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function toHumanRuntime(minutes) {
  const total = Number(minutes || 0);
  if (!Number.isFinite(total) || total <= 0) {
    return "-";
  }
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return hours > 0 ? `${hours}h${String(mins).padStart(2, "0")}` : `${mins} min`;
}

function getYear(value) {
  if (!value) {
    return "";
  }
  const match = String(value).match(/\d{4}/);
  return match ? match[0] : "";
}

function showMessage(message, isError = false) {
  if (isError) {
    showToast(message, true);
    return;
  }
  refs.syncInfo.textContent = message;
}

function showToast(message, isError = false) {
  if (!refs.toast) {
    return;
  }

  refs.toast.textContent = message;
  refs.toast.className = `toast${isError ? " error" : ""}`;
  refs.toast.hidden = false;

  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    refs.toast.hidden = true;
  }, 3400);
}

function wireImageFallback(img, title, landscape = false) {
  if (!img) {
    return;
  }

  const fallback = buildImagePlaceholder(title, landscape);
  img.dataset.fallbackSrc = fallback;
  if (!img.getAttribute("src")) {
    img.src = fallback;
  }

  if (img.dataset.fallbackBound !== "1") {
    img.dataset.fallbackBound = "1";
    img.addEventListener("error", onImageFallbackError);
  }
}

function buildImagePlaceholder(title, landscape = false) {
  const label = String(title || "Zenix")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .slice(0, 28);
  const width = landscape ? 1280 : 600;
  const height = landscape ? 720 : 900;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#0f1117'/><stop offset='100%' stop-color='#2a0d12'/></linearGradient></defs>
<rect width='100%' height='100%' fill='url(#g)'/>
<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#f3f4f8' font-family='Arial, sans-serif' font-size='${landscape ? 42 : 34}'>${label || "Zenix"}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function onImageFallbackError(event) {
  const img = event.currentTarget;
  if (!(img instanceof HTMLImageElement)) {
    return;
  }

  const fallback = img.dataset.fallbackSrc || "";
  if (fallback && img.src !== fallback) {
    img.src = fallback;
  }
}

function isFavorite(id) {
  return Boolean(state.favorites[id]);
}

function toggleFavorite(id) {
  if (!id) {
    return;
  }

  const item = findItemById(id);
  if (isFavorite(id)) {
    delete state.favorites[id];
    saveFavorites(state.favorites);
    showToast("Retire de ta liste.");
  } else {
    state.favorites[id] = {
      id,
      type: item?.type || "movie",
      title: item?.title || "",
      addedAt: Date.now(),
    };
    saveFavorites(state.favorites);
    showToast("Ajoute a ta liste.");
  }
  renderAll();
}

function updateDetailFavoriteButton(id) {
  if (!refs.detailFavoriteBtn) {
    return;
  }
  refs.detailFavoriteBtn.textContent = isFavorite(id) ? "Retirer de ma liste" : "Ajouter a ma liste";
}

async function copyCurrentLink() {
  const url = window.location.href;
  await copyText(url);
  showToast("Lien copie.");
}

async function copyBrowseLink() {
  syncBrowseRoute({ replace: true });
  const url = window.location.href;
  await copyText(url);
  showToast("Lien de la vue copie.");
}

async function copyText(value) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) {
    throw new Error("Clipboard unavailable");
  }
}

function applyBrowseStateFromRoute() {
  const url = new URL(window.location.href);

  const view = String(url.searchParams.get("view") || "");
  const chip = String(url.searchParams.get("chip") || "");
  const sort = String(url.searchParams.get("sort") || "");
  const query = String(url.searchParams.get("q") || "").trim();

  const allowedViews = new Set(["all", "top", "movie", "tv", "anime", "list"]);
  const allowedChips = new Set(["all", "recent", "movie", "tv", "anime"]);
  const allowedSort = new Set(["featured", "recent", "title-asc", "title-desc", "runtime-desc"]);

  if (allowedViews.has(view)) {
    state.view = view;
  }
  if (allowedChips.has(chip)) {
    state.chip = chip;
  }
  if (allowedSort.has(sort)) {
    state.sortBy = sort;
  }

  state.query = query;
  refs.searchInput.value = query;
  refs.sortSelect.value = state.sortBy;
}

function syncBrowseRoute(options = {}) {
  const route = readAppRoute();
  if (route.watch > 0 || route.detail > 0) {
    return;
  }

  const replace = options.replace !== false;
  const url = new URL(window.location.href);

  if (state.view && state.view !== "all") {
    url.searchParams.set("view", state.view);
  } else {
    url.searchParams.delete("view");
  }

  if (state.chip && state.chip !== "all") {
    url.searchParams.set("chip", state.chip);
  } else {
    url.searchParams.delete("chip");
  }

  if (state.sortBy && state.sortBy !== "featured") {
    url.searchParams.set("sort", state.sortBy);
  } else {
    url.searchParams.delete("sort");
  }

  if (state.query && state.query.length > 0) {
    url.searchParams.set("q", state.query);
  } else {
    url.searchParams.delete("q");
  }

  const next =
    url.pathname + (url.searchParams.toString().length > 0 ? `?${url.searchParams.toString()}` : "");
  const current = window.location.pathname + window.location.search;
  if (next === current) {
    return;
  }

  if (replace) {
    history.replaceState({}, "", next);
  } else {
    history.pushState({}, "", next);
  }
}

function setAppRoute(route, options = {}) {
  const replace = Boolean(options.replace);
  const url = new URL(window.location.href);

  url.searchParams.delete("detail");
  url.searchParams.delete("watch");
  url.searchParams.delete("s");
  url.searchParams.delete("e");

  if (route?.watch) {
    url.searchParams.set("watch", String(route.watch));
    if (route.season) {
      url.searchParams.set("s", String(route.season));
    }
    if (route.episode) {
      url.searchParams.set("e", String(route.episode));
    }
  } else if (route?.detail) {
    url.searchParams.set("detail", String(route.detail));
  }

  const next =
    url.pathname + (url.searchParams.toString().length > 0 ? `?${url.searchParams.toString()}` : "");
  const current = window.location.pathname + window.location.search;
  if (next === current) {
    return;
  }

  if (replace) {
    history.replaceState({}, "", next);
  } else {
    history.pushState({}, "", next);
  }
}

function readAppRoute() {
  const url = new URL(window.location.href);
  const watch = Number(url.searchParams.get("watch") || 0);
  const detail = Number(url.searchParams.get("detail") || 0);
  const season = Number(url.searchParams.get("s") || 0);
  const episode = Number(url.searchParams.get("e") || 0);
  return {
    watch: watch > 0 ? watch : 0,
    detail: detail > 0 ? detail : 0,
    season: season > 0 ? season : 0,
    episode: episode > 0 ? episode : 0,
  };
}

async function applyInitialRoute() {
  const route = readAppRoute();
  if (route.watch > 0) {
    try {
      await openPlayer(route.watch, {
        season: route.season || 1,
        episode: route.episode || 1,
        syncRoute: false,
      });
    } catch {
      showToast("Lien de lecture invalide ou indisponible.", true);
      setAppRoute({}, { replace: true });
    }
    return;
  }

  if (route.detail > 0) {
    try {
      await openDetails(route.detail, { syncRoute: false });
    } catch {
      showToast("Lien detail invalide ou indisponible.", true);
      setAppRoute({}, { replace: true });
    }
  }
}

async function handlePopState() {
  applyBrowseStateFromRoute();
  renderFilterChips();
  applySeriesSupportToNav();
  renderAll();

  const route = readAppRoute();
  if (route.watch > 0) {
    await openPlayer(route.watch, {
      season: route.season || 1,
      episode: route.episode || 1,
      syncRoute: false,
    });
    return;
  }

  if (route.detail > 0) {
    await openDetails(route.detail, { syncRoute: false });
    return;
  }

  if (!refs.playerOverlay.hidden) {
    closePlayer({ syncRoute: false });
  }
  if (!refs.detailModal.hidden) {
    closeDetails({ syncRoute: false });
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

function saveProgress(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveFavorites(value) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(value));
}

async function fetchJson(url) {
  let lastError = null;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

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
        const retryable = RETRYABLE_STATUS.has(response.status);
        if (retryable && attempt < RETRY_DELAYS_MS.length) {
          await wait(RETRY_DELAYS_MS[attempt]);
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      lastError = error;
      const retryable =
        String(error?.name || "") === "AbortError" ||
        String(error?.message || "").toLowerCase().includes("network");

      if (retryable && attempt < RETRY_DELAYS_MS.length) {
        await wait(RETRY_DELAYS_MS[attempt]);
        continue;
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError || new Error("Request failed");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
