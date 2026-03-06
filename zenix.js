const API_BASE = "/api";
const STREAM_API_BASE = "https://api.purstream.co/api/v1";
const STORAGE_KEY = "zenix-progress-v4";
const FAVORITES_KEY = "zenix-favorites-v1";
const FAVORITES_BACKUP_KEY = "zenix-favorites-backup-v1";
const LANGUAGE_PREFS_KEY = "zenix-language-prefs-v1";
const CATALOG_CACHE_KEY = "zenix-catalog-cache-v2";
const CLEANUP_KEY = "zenix-sw-cleaned-v4";
const REFRESH_FEED_MS = 10 * 60 * 1000;
const REFRESH_TOP_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15000;
const RETRY_DELAYS_MS = [350, 900];
const SEARCH_DEBOUNCE_MS = 180;
const API_CACHE_TTL_MS = 45 * 1000;
const STREAM_CACHE_TTL_MS = 2 * 60 * 1000;
const STREAM_PREFETCH_COOLDOWN_MS = 15 * 1000;
const PROGRESS_SAVE_INTERVAL_MS = 2400;
const HERO_ROTATE_MS = 8000;
const IMAGE_WARMUP_BATCH = 16;
const IMAGE_WARMUP_DELAY_MS = 30;
const INITIAL_IMAGE_WARMUP_LIMIT = 180;
const CALENDAR_YEAR_RANGE = 3;
const CALENDAR_CACHE_KEY = "zenix-calendar-cache-v1";
const CALENDAR_CACHE_MAX_ENTRIES = 8;
const INITIAL_CATALOG_WARMUP_PAGES = 2;
const BACKGROUND_CATALOG_DELAY_MS = 8;
const BACKGROUND_CATALOG_RENDER_EVERY = 8;
const CATALOG_RENDER_CHUNK_MIN = 28;
const CATALOG_RENDER_CHUNK_MAX = 68;
const STREAM_PROXY_TIMEOUT_MS = 6500;
const STREAM_PROXY_PREFETCH_TIMEOUT_MS = 4200;
const STREAM_DIRECT_TIMEOUT_MS = 5200;
const STREAM_DIRECT_PREFETCH_TIMEOUT_MS = 3600;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const HLS_JS_URL = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";
const HLS_MIME = "application/vnd.apple.mpegurl";
const DASH_MIME = "application/dash+xml";
const HEARTBEAT_INTERVAL_MS = 30 * 1000;
const HEARTBEAT_KEY = "zenix-client-id-v1";

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
    id: 3473,
    type: "tv",
    title: "Solo Leveling",
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
    backdrop: "https://www.themoviedb.org/t/p/w1920_and_h1080_bestv2/gmN3iFPEIYf3fQsa4hRY0JxQIBN.jpg",
    runtime: null,
    releaseDate: "2024-01-07 00:00:00",
    isAnime: true,
  },
];

const state = {
  view: "all",
  chip: "all",
  sortBy: "featured",
  query: "",
  calendarQuery: "",
  calendarMonth: new Date().getMonth() + 1,
  calendarYear: new Date().getFullYear(),
  calendarLoading: false,
  calendarData: null,
  calendarOverviewUnavailable: false,
  searchToken: 0,
  page: 0,
  totalPages: 0,
  catalogSyncPage: 0,
  hasMore: true,
  loadingCatalog: false,
  backgroundSyncRunning: false,
  loadingTop: false,
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
  allEpisodeSources: [],
  availableLanguages: [],
  languagePreferences: loadLanguagePrefs(),
  selectedLanguageByMedia: new Map(),
  hlsScriptPromise: null,
  hlsInstance: null,
  searchAbortController: null,
  apiCache: new Map(),
  streamPayloadCache: new Map(),
  streamInFlight: new Map(),
  streamPrefetchAt: new Map(),
  detailsInFlight: new Map(),
  trailersInFlight: new Map(),
  seasonsInFlight: new Map(),
  warmedImages: new Set(),
  imageWarmQueue: [],
  imageWarmTimer: null,
  catalogRenderToken: 0,
  catalogRenderFrame: 0,
  heroRotateTimer: null,
  heroSwapTimer: null,
  detailLangCache: new Map(),
  detailToken: 0,
  playToken: 0,
  lastSyncAt: null,
  refreshFeedTimer: null,
  refreshTopTimer: null,
  pendingCatalogUpdate: false,
  analyticsClientId: "",
  analyticsDisabled: false,
  analyticsInFlight: false,
  heartbeatTimer: null,
  heartbeatBound: false,
};

const refs = {
  heroSection: document.getElementById("hero"),
  statusStrip: document.getElementById("statusStrip"),
  quickLinksSection: document.getElementById("quickLinksSection"),
  filtersPanel: document.getElementById("filtersPanel"),
  communityPanel: document.getElementById("communityPanel"),
  calendarSection: document.getElementById("calendarSection"),
  infoSection: document.getElementById("infoSection"),

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

  catalogSection: document.getElementById("catalogSection"),
  catalogTitle: document.getElementById("catalogTitle"),
  catalogSubtitle: document.getElementById("catalogSubtitle"),
  catalogGrid: document.getElementById("catalogGrid"),
  loadMoreBtn: document.getElementById("loadMoreBtn"),
  emptyState: document.getElementById("emptyState"),
  calendarMonthSelect: document.getElementById("calendarMonthSelect"),
  calendarYearSelect: document.getElementById("calendarYearSelect"),
  calendarSearchInput: document.getElementById("calendarSearchInput"),
  calendarRefreshBtn: document.getElementById("calendarRefreshBtn"),
  calendarMergedGrid: document.getElementById("calendarMergedGrid"),
  calendarMergedMeta: document.getElementById("calendarMergedMeta"),

  detailModal: document.getElementById("detailModal"),
  detailPanel: document.getElementById("detailPanel"),
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
  detailLanguageSelect: document.getElementById("detailLanguageSelect"),
  trailerWrap: document.getElementById("trailerWrap"),
  trailerFrame: document.getElementById("trailerFrame"),

  playerOverlay: document.getElementById("playerOverlay"),
  playerPanel: document.getElementById("playerPanel"),
  playerCloseBtn: document.getElementById("playerCloseBtn"),
  playerTitle: document.getElementById("playerTitle"),
  playerSeriesControls: document.getElementById("playerSeriesControls"),
  playerSeasonSelect: document.getElementById("playerSeasonSelect"),
  playerEpisodeSelect: document.getElementById("playerEpisodeSelect"),
  playerLanguageSelect: document.getElementById("playerLanguageSelect"),
  playerStatus: document.getElementById("playerStatus"),
  playerSourceMeta: document.getElementById("playerSourceMeta"),
  playerVideo: document.getElementById("playerVideo"),
  playerRestartBtn: document.getElementById("playerRestartBtn"),
  playerRewindBtn: document.getElementById("playerRewindBtn"),
  playerForwardBtn: document.getElementById("playerForwardBtn"),
  playerFullscreenBtn: document.getElementById("playerFullscreenBtn"),
  playerPipBtn: document.getElementById("playerPipBtn"),
  playerTypePill: document.getElementById("playerTypePill"),
  playerLanguagePill: document.getElementById("playerLanguagePill"),
  playerQualityPill: document.getElementById("playerQualityPill"),
  playerSourceControl: document.getElementById("playerSourceControl"),
  playerSourceSelect: document.getElementById("playerSourceSelect"),
  playerSourceApplyBtn: document.getElementById("playerSourceApplyBtn"),
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
  hydrateLanguagePrefsMap();
  initCalendarControls();
  state.analyticsClientId = getOrCreateAnalyticsClientId();

  refs.syncInfo.textContent = "Synchronisation initiale en cours...";
  refs.supportInfo.textContent = "Films, series et anime gratuits, lecture directe sans compte.";
  applyBrowseStateFromRoute();
  renderFilterChips();
  setActiveNav(state.view);

  const topTask = loadTopDaily();
  await loadInitialCatalog().catch(() => {
    // fallback handled below
  });

  if (state.catalog.length === 0) {
    state.catalog = FALLBACK_ITEMS.slice();
    state.page = 1;
    state.hasMore = false;
  }
  if (state.topDaily.length === 0) {
    state.topDaily = buildTopFromCatalog();
  }
  warmImageCacheFromPool([...state.topDaily, ...state.catalog], Math.max(INITIAL_IMAGE_WARMUP_LIMIT, 320));

  if (!state.activeHeroId) {
    const first = state.topDaily[0] || state.catalog[0];
    state.activeHeroId = first ? first.id : null;
  }

  renderAll();
  topTask
    .then(() => {
      if (state.topDaily.length === 0) {
        state.topDaily = buildTopFromCatalog();
      }
      if (!state.activeHeroId) {
        const first = state.topDaily[0] || state.catalog[0];
        state.activeHeroId = first ? first.id : null;
      }
      if (refs.playerOverlay.hidden && refs.detailModal.hidden) {
        renderAll();
      } else {
        renderTopDaily();
        renderCommunityStats();
        updateSyncText();
      }
    })
    .catch(() => {
      if (state.topDaily.length === 0) {
        state.topDaily = buildTopFromCatalog();
      }
      if (refs.playerOverlay.hidden && refs.detailModal.hidden) {
        renderAll();
      }
    });

  if (state.view === "calendar") {
    await ensureCalendarData().catch(() => {
      showToast("Calendrier indisponible temporairement.", true);
    });
  }
  await applyInitialRoute();
  startAutoRefresh();
  startHeroRotation();
  startAnalyticsHeartbeat();
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      loadHlsLibrary().catch(() => {
        // optional warmup only
      });
    }, { timeout: 2500 });
  } else {
    setTimeout(() => {
      loadHlsLibrary().catch(() => {
        // optional warmup only
      });
    }, 1200);
  }
  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });
}

function bindEvents() {
  refs.navPills.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view || "all";
      handleViewSelection(view);
    });
  });

  refs.quickLinks.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.viewJump || "all";
      handleViewSelection(view);
      const targetId =
        view === "info"
          ? "infoSection"
          : view === "calendar"
            ? "calendarSection"
            : view === "top"
              ? "topSection"
              : view === "list"
                ? "listSection"
                : "catalogSection";
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  refs.searchInput.addEventListener("input", (event) => {
    const nextQuery = String(event.target.value || "").trim();
    if (state.view === "calendar") {
      state.calendarQuery = nextQuery;
      if (refs.calendarSearchInput && refs.calendarSearchInput.value !== nextQuery) {
        refs.calendarSearchInput.value = nextQuery;
      }
      renderCalendarSection();
      syncBrowseRoute({ replace: true });
      return;
    }

    state.query = nextQuery;

    const token = ++state.searchToken;
    renderAll();

    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }
    if (state.searchAbortController) {
      state.searchAbortController.abort();
      state.searchAbortController = null;
    }

    searchDebounce = setTimeout(async () => {
      if (token !== state.searchToken) {
        return;
      }

      if (state.query.length > 1) {
        try {
          const controller = new AbortController();
          state.searchAbortController = controller;
          await handleRemoteSearch(token, controller.signal);
        } catch {
          // keep local filtering only
        } finally {
          if (token === state.searchToken) {
            state.searchAbortController = null;
          }
        }
      }

      if (token === state.searchToken) {
        renderAll();
      }
    }, SEARCH_DEBOUNCE_MS);
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
        if (refs.playerOverlay.hidden) {
          renderAll();
        } else {
          renderTopDaily();
          renderCommunityStats();
          renderCatalog(getVisibleCatalog());
          updateSyncText();
        }
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
    const language = String(refs.detailLanguageSelect?.value || "").trim();
    openPlayer(state.selectedDetailId, { season, episode, language }).catch(() => {
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
    const selectedEpisode = getFirstPlayableEpisode(episodes);
    populateEpisodeSelect(refs.detailEpisodeSelect, episodes, selectedEpisode);
    syncDetailLanguageOptions(id, season, selectedEpisode).catch(() => {
      // no-op
    });
  });

  refs.detailEpisodeSelect.addEventListener("change", () => {
    const id = state.selectedDetailId;
    if (!id) {
      return;
    }
    const season = Number(refs.detailSeasonSelect.value || "1");
    const episode = Number(refs.detailEpisodeSelect.value || "1");
    syncDetailLanguageOptions(id, season, episode).catch(() => {
      // no-op
    });
  });

  refs.detailLanguageSelect?.addEventListener("change", () => {
    const id = state.selectedDetailId;
    if (!id) {
      return;
    }
    const language = String(refs.detailLanguageSelect.value || "").trim().toUpperCase();
    if (language) {
      state.selectedLanguageByMedia.set(id, language);
      state.detailLangCache.set(id, language);
      saveLanguagePrefsMap(state.selectedLanguageByMedia);
    }
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
    const episode = getFirstPlayableEpisode(episodes);
    populateEpisodeSelect(refs.playerEpisodeSelect, episodes, episode);
    const language = String(refs.playerLanguageSelect?.value || "").trim();
    switchPlayerEpisode(season, episode, { language }).catch(() => {
      showMessage("Impossible de charger cet episode.", true);
    });
  });

  refs.playerEpisodeSelect.addEventListener("change", () => {
    if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
      return;
    }
    const season = Number(refs.playerSeasonSelect.value || "1");
    const episode = Number(refs.playerEpisodeSelect.value || "1");
    const language = String(refs.playerLanguageSelect?.value || "").trim();
    switchPlayerEpisode(season, episode, { language }).catch(() => {
      showMessage("Impossible de charger cet episode.", true);
    });
  });

  refs.playerLanguageSelect?.addEventListener("change", () => {
    if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
      return;
    }
    const season = Number(refs.playerSeasonSelect.value || "1");
    const episode = Number(refs.playerEpisodeSelect.value || "1");
    const language = String(refs.playerLanguageSelect.value || "").trim();
    if (language) {
      state.selectedLanguageByMedia.set(state.nowPlaying.id, language);
      saveLanguagePrefsMap(state.selectedLanguageByMedia);
    }
    switchPlayerEpisode(season, episode, { language }).catch(() => {
      showMessage("Impossible de charger cet episode.", true);
    });
  });

  refs.playerSourceSelect?.addEventListener("change", () => {
    const index = Number(refs.playerSourceSelect.value || "-1");
    if (!Number.isInteger(index) || index < 0) {
      return;
    }
    switchPlayerSource(index).catch(() => {
      showToast("Impossible de changer de source.", true);
    });
  });

  refs.playerSourceApplyBtn?.addEventListener("click", () => {
    const index = Number(refs.playerSourceSelect?.value || "-1");
    if (!Number.isInteger(index) || index < 0) {
      return;
    }
    switchPlayerSource(index).catch(() => {
      showToast("Impossible de changer de source.", true);
    });
  });

  refs.playerVideo.addEventListener("timeupdate", onPlayerProgress);
  refs.playerVideo.addEventListener("pause", () => {
    saveNowPlayingProgress({ force: true });
  });
  refs.playerVideo.addEventListener("seeked", () => {
    saveNowPlayingProgress({ force: true });
  });
  refs.playerVideo.addEventListener("ended", onPlayerEnded);
  refs.playerVideo.addEventListener("error", () => {
    trySwitchToNextSource().catch(() => {
      setPlayerStatus("Erreur video detectee. Choisis un autre titre.", true);
    });
  });
  refs.playerRestartBtn?.addEventListener("click", async () => {
    refs.playerVideo.currentTime = 0;
    try {
      await refs.playerVideo.play();
    } catch {
      // no-op
    }
  });
  refs.playerRewindBtn?.addEventListener("click", () => {
    refs.playerVideo.currentTime = Math.max(0, Number(refs.playerVideo.currentTime || 0) - 10);
  });
  refs.playerForwardBtn?.addEventListener("click", () => {
    const duration = Number(refs.playerVideo.duration || 0);
    const next = Number(refs.playerVideo.currentTime || 0) + 10;
    refs.playerVideo.currentTime = Number.isFinite(duration) && duration > 0 ? Math.min(duration, next) : next;
  });
  refs.playerFullscreenBtn?.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        // no-op
      });
      return;
    }
    if (typeof refs.playerVideo.requestFullscreen === "function") {
      refs.playerVideo.requestFullscreen().catch(() => {
        showToast("Plein ecran indisponible sur cet appareil.", true);
      });
      return;
    }
    showToast("Plein ecran non supporte sur cet appareil.");
  });
  refs.playerPipBtn?.addEventListener("click", async () => {
    const pipAvailable =
      Boolean(document.pictureInPictureEnabled) &&
      typeof refs.playerVideo.requestPictureInPicture === "function";
    if (!pipAvailable) {
      showToast("Mode flottant indisponible sur cet appareil.");
      return;
    }
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
      }
      await refs.playerVideo.requestPictureInPicture();
    } catch {
      showToast("Impossible d'activer le mode flottant.", true);
    }
  });
  if (refs.playerPipBtn) {
    refs.playerPipBtn.disabled =
      !document.pictureInPictureEnabled || typeof refs.playerVideo.requestPictureInPicture !== "function";
  }

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

  window.addEventListener(
    "scroll",
    () => {
      consumePendingCatalogUpdate();
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      consumePendingCatalogUpdate();
    }
  });
}

function handleViewSelection(view) {
  const normalizedView = view === "catalog" || view === "search" ? "all" : view;
  state.view = normalizedView;
  if (isCatalogCategoryView(normalizedView)) {
    state.chip = normalizedView;
  } else {
    state.chip = "all";
  }
  if (refs.searchInput) {
    refs.searchInput.value = normalizedView === "calendar" ? state.calendarQuery : state.query;
  }
  setActiveNav(normalizedView);
  renderFilterChips();
  renderAll();

  if (normalizedView === "calendar") {
    if (!state.calendarData) {
      const cached = loadCalendarSnapshot(state.calendarMonth, state.calendarYear);
      if (cached) {
        state.calendarData = cached;
        renderCalendarSection();
        if (refs.calendarMergedMeta) {
          refs.calendarMergedMeta.textContent = "Mode cache actif. Chargement reseau en cours...";
        }
      }
    }
    ensureCalendarData().catch(() => {
      showToast("Calendrier indisponible temporairement.", true);
    });
  }
}

function setActiveNav(view) {
  const normalizedView = view === "catalog" || view === "search" ? "all" : view;
  const hasMatch = refs.navPills.some((entry) => (entry.dataset.view || "") === normalizedView);
  const targetView = hasMatch ? normalizedView : "all";
  refs.navPills.forEach((entry) => {
    entry.classList.toggle("active", (entry.dataset.view || "") === targetView);
  });
}

function isCatalogCategoryView(view) {
  return view === "movie" || view === "tv" || view === "anime";
}

function setHidden(node, hidden) {
  if (node) {
    node.hidden = Boolean(hidden);
  }
}

function shouldRenderLiveCatalogUpdates() {
  if (!refs.playerOverlay.hidden || !refs.detailModal.hidden) {
    return false;
  }
  if (document.visibilityState === "hidden") {
    return false;
  }
  if (state.query.trim().length > 0 || state.view === "calendar" || state.view === "top" || state.view === "list") {
    return false;
  }
  if (Number(window.scrollY || 0) > 110) {
    return false;
  }
  return true;
}

function consumePendingCatalogUpdate() {
  if (!state.pendingCatalogUpdate) {
    return;
  }
  if (!shouldRenderLiveCatalogUpdates()) {
    return;
  }
  state.pendingCatalogUpdate = false;
  renderAll();
}

function monthLabelFr(monthNumber) {
  const safe = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  const date = new Date(2026, safe - 1, 1);
  return date.toLocaleDateString("fr-FR", { month: "long" });
}

function initCalendarControls() {
  if (!refs.calendarMonthSelect || !refs.calendarYearSelect || !refs.calendarRefreshBtn) {
    return;
  }

  refs.calendarMonthSelect.innerHTML = "";
  for (let month = 1; month <= 12; month += 1) {
    const option = document.createElement("option");
    option.value = String(month);
    option.textContent = monthLabelFr(month);
    option.selected = month === state.calendarMonth;
    refs.calendarMonthSelect.appendChild(option);
  }

  refs.calendarYearSelect.innerHTML = "";
  const baseYear = new Date().getFullYear();
  for (let year = baseYear - CALENDAR_YEAR_RANGE; year <= baseYear + CALENDAR_YEAR_RANGE; year += 1) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    option.selected = year === state.calendarYear;
    refs.calendarYearSelect.appendChild(option);
  }

  refs.calendarMonthSelect.addEventListener("change", () => {
    state.calendarMonth = Number(refs.calendarMonthSelect.value || state.calendarMonth);
    ensureCalendarData(true).catch(() => {
      showToast("Calendrier indisponible pour ce mois.", true);
    });
  });

  refs.calendarYearSelect.addEventListener("change", () => {
    state.calendarYear = Number(refs.calendarYearSelect.value || state.calendarYear);
    ensureCalendarData(true).catch(() => {
      showToast("Calendrier indisponible pour cette annee.", true);
    });
  });

  refs.calendarRefreshBtn.addEventListener("click", () => {
    ensureCalendarData(true).catch(() => {
      showToast("Calendrier indisponible temporairement.", true);
    });
  });

  if (refs.calendarSearchInput) {
    refs.calendarSearchInput.value = state.calendarQuery || "";
    refs.calendarSearchInput.addEventListener("input", (event) => {
      state.calendarQuery = String(event.target.value || "").trim();
      if (state.view === "calendar" && refs.searchInput) {
        refs.searchInput.value = state.calendarQuery;
      }
      renderCalendarSection();
      syncBrowseRoute({ replace: true });
    });
  }
}

async function ensureCalendarData(force = false) {
  if (state.calendarLoading) {
    return;
  }
  state.calendarLoading = true;
  if (refs.calendarMergedMeta) {
    refs.calendarMergedMeta.textContent = "Chargement en cours...";
  }

  let directError = null;
  let overviewError = null;

  try {
    if (!state.calendarOverviewUnavailable || force) {
      try {
        const payload = await fetchJson(
          `${API_BASE}/calendar/overview?month=${state.calendarMonth}&year=${state.calendarYear}`,
          { force }
        );
        const data = payload?.data || null;
        if (!data || typeof data !== "object") {
          throw new Error("Invalid calendar payload");
        }
        if (Array.isArray(data.merged) && data.merged.length === 0) {
          throw new Error("Calendar payload empty");
        }
        state.calendarOverviewUnavailable = false;
        state.calendarData = data;
        saveCalendarSnapshot(state.calendarMonth, state.calendarYear, data);
        renderCalendarSection();
        return true;
      } catch (error) {
        overviewError = error;
        const message = String(error?.message || "").toLowerCase();
        if (message.includes("404") || message.includes("unknown api route")) {
          state.calendarOverviewUnavailable = true;
        }
      }
    }

    try {
      const direct = await fetchJson(
        `${STREAM_API_BASE}/calendar/${state.calendarMonth}/${state.calendarYear}/days`,
        {
          force,
          timeoutMs: 4800,
          retryDelays: [350],
        }
      );
      const rebuilt = buildCalendarFallbackFromDirect(direct, state.calendarMonth, state.calendarYear);
      if (rebuilt && Number(rebuilt.mergedCount || 0) > 0) {
        state.calendarData = rebuilt;
        saveCalendarSnapshot(state.calendarMonth, state.calendarYear, rebuilt);
        renderCalendarSection();
        if (refs.calendarMergedMeta) {
          refs.calendarMergedMeta.textContent = `${rebuilt.mergedCount} sorties detectees (mode direct).`;
        }
        return true;
      }
    } catch (error) {
      directError = error;
    }

    const cached = loadCalendarSnapshot(state.calendarMonth, state.calendarYear);
    if (cached) {
      state.calendarData = cached;
      renderCalendarSection();
      if (refs.calendarMergedMeta) {
        refs.calendarMergedMeta.textContent = "Mode cache actif. Derniere version locale affichee.";
      }
      showToast("Calendrier charge depuis le cache local.");
      return false;
    }

    if (state.calendarData) {
      renderCalendarSection();
      if (refs.calendarMergedMeta) {
        refs.calendarMergedMeta.textContent = "Source indisponible. Derniere version conservee.";
      }
      showToast("Source calendrier temporairement indisponible.");
      return false;
    }
    throw overviewError || directError || new Error("Calendar unavailable");
  } finally {
    state.calendarLoading = false;
  }
}

function normalizeDirectCalendarType(movie) {
  if (!movie || String(movie.type || "").toLowerCase() !== "tv") {
    return "film";
  }
  return Boolean(movie.isAnime) ? "anime" : "serie";
}

function buildCalendarFallbackFromDirect(payload, month, year) {
  const rows = Array.isArray(payload?.data?.items?.days) ? payload.data.items.days : [];
  const merged = [];
  const dedupe = new Set();
  const monthSafe = String(month).padStart(2, "0");
  const yearSafe = Number(year || new Date().getFullYear());

  rows.forEach((entry) => {
    const dayNumber = Math.max(1, Math.min(31, Number(entry?.number || 0)));
    const movie = entry?.movie;
    const mediaId = Number(movie?.id || 0);
    if (!movie || dayNumber <= 0 || mediaId <= 0) {
      return;
    }

    const type = normalizeDirectCalendarType(movie);
    if (type === "anime") {
      return;
    }

    const key = String(movie?.calendarId || `${yearSafe}-${monthSafe}-${dayNumber}-${mediaId}`);
    if (dedupe.has(key)) {
      return;
    }
    dedupe.add(key);

    const posters = movie?.posters || {};
    const daySafe = String(dayNumber).padStart(2, "0");

    merged.push({
      source: "purstream",
      key,
      mediaId,
      dayNumber,
      dateIso: `${yearSafe}-${monthSafe}-${daySafe}`,
      title: String(movie?.title || "Sans titre"),
      type,
      kind: type,
      language: String(movie?.lang || "").trim().toUpperCase(),
      season: Number(movie?.season || 0),
      episode: Number(movie?.episode || 0),
      supplemental: String(movie?.calendarSupplemental || ""),
      poster: String(posters.small || posters.large || posters.wallpaper || ""),
      url: "",
    });
  });

  merged.sort((left, right) => {
    const leftDate = Date.parse(left.dateIso || "");
    const rightDate = Date.parse(right.dateIso || "");
    const safeLeft = Number.isFinite(leftDate) ? leftDate : Number.MAX_SAFE_INTEGER;
    const safeRight = Number.isFinite(rightDate) ? rightDate : Number.MAX_SAFE_INTEGER;
    if (safeLeft !== safeRight) {
      return safeLeft - safeRight;
    }
    return String(left.title || "").localeCompare(String(right.title || ""), "fr", { sensitivity: "base" });
  });

  const monthName = monthLabelFr(month);
  return {
    month,
    year: yearSafe,
    mergedCount: merged.length,
    merged,
    purstream: {
      month,
      year: yearSafe,
      monthName,
      count: merged.length,
      items: merged,
    },
    animeSama: {
      count: 0,
      days: [],
      items: [],
    },
    sourceLinks: {
      purstream: "https://purstream.co/calendar",
      animeSama: "https://anime-sama.tv/planning/",
    },
    providerStatus: {
      catalog: merged.length > 0,
      anime: false,
    },
  };
}

function normalizeTitleKey(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return "";
  }
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveCalendarDetailId(entry) {
  const directId = Number(entry?.mediaId || 0);
  if (directId > 0) {
    return directId;
  }

  const titleKey = normalizeTitleKey(entry?.title || "");
  if (!titleKey) {
    return 0;
  }

  const rawType = String(entry?.type || entry?.kind || "").toLowerCase();
  const expectedType = rawType === "film" ? "movie" : rawType === "serie" || rawType === "anime" ? "tv" : "";
  const expectedAnime = rawType === "anime";

  const seen = new Set();
  const pool = [...state.catalog, ...state.topDaily].filter((item) => {
    const id = Number(item?.id || 0);
    if (id <= 0 || seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });

  let match = pool.find(
    (item) =>
      normalizeTitleKey(item.title) === titleKey &&
      (!expectedType || item.type === expectedType) &&
      (!expectedAnime || Boolean(item.isAnime))
  );

  if (!match && expectedAnime) {
    match = pool.find((item) => normalizeTitleKey(item.title) === titleKey && Boolean(item.isAnime));
  }

  if (!match) {
    match = pool.find((item) => normalizeTitleKey(item.title) === titleKey);
  }

  return Number(match?.id || 0);
}

function renderCalendarSection() {
  if (!refs.calendarSection || !refs.calendarMergedGrid) {
    return;
  }
  if (!state.calendarData) {
    refs.calendarMergedGrid.innerHTML = '<p class="empty">Aucune donnee calendrier disponible.</p>';
    if (refs.calendarMergedMeta) {
      refs.calendarMergedMeta.textContent = "En attente de donnees.";
    }
    return;
  }

  const mergedPrimary = Array.isArray(state.calendarData?.merged) ? state.calendarData.merged : [];
  const mergedFallback = [
    ...(Array.isArray(state.calendarData?.purstream?.items) ? state.calendarData.purstream.items : []),
    ...(Array.isArray(state.calendarData?.animeSama?.items) ? state.calendarData.animeSama.items : []),
  ];
  const sourceRows = mergedPrimary.length > 0 ? mergedPrimary : mergedFallback;
  const compact = new Map();
  sourceRows.forEach((entry) => {
    const titleKey = normalizeTitleKey(entry?.title || "");
    const typeKey = normalizeTitleKey(entry?.type || entry?.kind || "");
    const dateKey = String(entry?.dateIso || "").trim() || String(entry?.dayNumber || "");
    const key = `${titleKey}::${typeKey}::${dateKey}`;
    const current = compact.get(key);
    if (!current) {
      compact.set(key, entry);
      return;
    }
    const currentPoster = String(current?.poster || "").trim();
    const nextPoster = String(entry?.poster || "").trim();
    if (!currentPoster && nextPoster) {
      compact.set(key, entry);
      return;
    }
    const currentHasId = Number(current?.mediaId || 0) > 0;
    const nextHasId = Number(entry?.mediaId || 0) > 0;
    if (!currentHasId && nextHasId) {
      compact.set(key, entry);
    }
  });

  const query = normalizeTitleKey(state.calendarQuery || "");
  const mergedRows = Array.from(compact.values())
    .filter((entry) => {
      if (!query) {
        return true;
      }
      return normalizeTitleKey(entry?.title || "").includes(query);
    })
    .slice(0, 180);

  refs.calendarMergedGrid.innerHTML = "";
  const mergedFragment = document.createDocumentFragment();
  const typeMap = {
    film: "Film",
    serie: "Serie",
    anime: "Anime",
    movie: "Film",
    tv: "Serie",
    scan: "Anime",
  };

  mergedRows.forEach((entry, index) => {
    const card = document.createElement("article");
    card.className = "calendar-merged-card";
    const detailId = resolveCalendarDetailId(entry);
    const hasDetails = detailId > 0;
    const linkLabel = hasDetails ? "Voir details" : "Bientot";
    const typeLabel = typeMap[String(entry.type || entry.kind || "").toLowerCase()] || "Titre";
    const dateLabel =
      entry.source === "purstream"
        ? `${String(entry.dayNumber || "").padStart(2, "0")}/${String(state.calendarMonth).padStart(2, "0")}`
        : entry.dateLabel || entry.dayName || "Sans date";
    card.innerHTML = `
      <img
        src="${escapeHtml(entry.poster || "")}"
        alt="${escapeHtml(entry.title || "Affiche")}"
        loading="${index < 24 ? "eager" : "lazy"}"
        decoding="async"
        fetchpriority="${index < 10 ? "high" : "auto"}"
      />
      <div class="calendar-merged-body">
        <p class="calendar-merged-title">${escapeHtml(entry.title || "Sans titre")}</p>
        <p class="calendar-merged-meta">
          <span>${escapeHtml(dateLabel)}</span>
          <span>${escapeHtml(typeLabel)}</span>
          <span>${escapeHtml(entry.language || "Auto")}</span>
        </p>
        <div class="calendar-merged-actions">
          ${
            hasDetails
              ? `<button type="button" class="btn-small btn-info" data-calendar-open="${detailId}">${linkLabel}</button>`
              : `<span class="btn-small btn-info is-disabled">${linkLabel}</span>`
          }
        </div>
      </div>
    `;
    const image = card.querySelector("img");
    if (image) {
      wireImageFallback(image, entry.title || "Affiche", false);
    }

    if (hasDetails) {
      card.classList.add("clickable");
      card.addEventListener("click", (event) => {
        const target = event.target;
        if (target instanceof HTMLElement && target.closest("button, a")) {
          return;
        }
        openDetails(detailId).catch(() => {
          showToast("Impossible d'ouvrir ce titre.", true);
        });
      });
    }
    mergedFragment.appendChild(card);
  });
  if (mergedRows.length === 0) {
    const providerStatus = state.calendarData?.providerStatus || {};
    const sourceHint =
      providerStatus.catalog === false && providerStatus.anime === false
        ? "Sources calendrier temporairement indisponibles."
        : "Aucune sortie fusionnee pour cette periode.";
    refs.calendarMergedGrid.innerHTML = `<p class="empty">${escapeHtml(sourceHint)}</p>`;
  } else {
    refs.calendarMergedGrid.appendChild(mergedFragment);
    warmImageCacheFromPool(
      mergedRows.map((entry) => ({ poster: entry.poster || "", backdrop: "" })),
      80
    );
  }

  refs.calendarMergedGrid.querySelectorAll("[data-calendar-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.getAttribute("data-calendar-open") || 0);
      if (id > 0) {
        openDetails(id).catch(() => {
          showToast("Impossible d'ouvrir ce titre.", true);
        });
      }
    });
  });

  if (refs.calendarMergedMeta) {
    if (query) {
      refs.calendarMergedMeta.textContent = `${mergedRows.length} resultat(s) pour "${state.calendarQuery}".`;
    } else {
      refs.calendarMergedMeta.textContent = `${mergedRows.length} sorties detectees.`;
    }
  }
}

function queueWarmImage(url) {
  const value = String(url || "").trim();
  if (!value || value.startsWith("data:") || state.warmedImages.has(value)) {
    return;
  }
  state.warmedImages.add(value);
  state.imageWarmQueue.push(value);
  if (state.imageWarmQueue.length > 600) {
    state.imageWarmQueue = state.imageWarmQueue.slice(0, 600);
  }
  pumpWarmImageQueue();
}

function warmImageCacheFromPool(items, limit = 60) {
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }
  const max = Math.max(0, Number(limit || 0));
  let pushed = 0;
  for (const item of items) {
    if (pushed >= max) {
      break;
    }
    if (!item) {
      continue;
    }
    const poster = String(item.poster || "");
    const backdrop = String(item.backdrop || "");
    if (backdrop) {
      queueWarmImage(backdrop);
      pushed += 1;
    }
    if (pushed >= max) {
      break;
    }
    if (poster) {
      queueWarmImage(poster);
      pushed += 1;
    }
  }
}

function pumpWarmImageQueue() {
  if (state.imageWarmTimer) {
    return;
  }

  const pump = () => {
    let count = 0;
    while (state.imageWarmQueue.length > 0 && count < IMAGE_WARMUP_BATCH) {
      const next = state.imageWarmQueue.shift();
      if (!next) {
        continue;
      }
      const image = new Image();
      image.decoding = "async";
      image.src = next;
      count += 1;
    }

    if (state.imageWarmQueue.length > 0) {
      state.imageWarmTimer = window.setTimeout(pump, IMAGE_WARMUP_DELAY_MS);
    } else {
      state.imageWarmTimer = null;
    }
  };

  pump();
}

function animateHeroSwap() {
  if (!refs.heroSection) {
    return;
  }
  refs.heroSection.classList.remove("hero-swap");
  void refs.heroSection.offsetWidth;
  refs.heroSection.classList.add("hero-swap");
  if (state.heroSwapTimer) {
    clearTimeout(state.heroSwapTimer);
  }
  state.heroSwapTimer = setTimeout(() => {
    refs.heroSection?.classList.remove("hero-swap");
  }, 680);
}

function startHeroRotation() {
  if (state.heroRotateTimer) {
    clearInterval(state.heroRotateTimer);
  }
  state.heroRotateTimer = setInterval(() => {
    if (state.view !== "all" || !refs.playerOverlay.hidden || !refs.detailModal.hidden) {
      return;
    }

    const pool = state.topDaily.length > 0 ? state.topDaily : state.catalog;
    if (pool.length < 2) {
      return;
    }

    const currentIndex = Math.max(0, pool.findIndex((item) => item.id === state.activeHeroId));
    const next = pool[(currentIndex + 1) % pool.length];
    if (!next || next.id === state.activeHeroId) {
      return;
    }

    state.activeHeroId = next.id;
    animateHeroSwap();
    renderHero(next);
    warmImageCacheFromPool(pool.slice(currentIndex + 1, currentIndex + 7), 12);
  }, HERO_ROTATE_MS);
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
      .then(() => {
        if (refs.playerOverlay.hidden) {
          renderAll();
        } else {
          renderTopDaily();
          renderCommunityStats();
          updateSyncText();
        }
      })
      .catch(() => {
        // retry later
      });
  }, REFRESH_TOP_MS);
}

function renderFilterChips() {
  const chips = [
    { id: "all", label: "Tous" },
    { id: "recent", label: "Recents" },
    { id: "movie", label: "Films" },
    { id: "tv", label: "Series" },
    { id: "anime", label: "Anime" },
  ];

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
      if (isCatalogCategoryView(chip.id)) {
        state.view = chip.id;
      } else if (isCatalogCategoryView(state.view)) {
        state.view = "all";
      }
      setActiveNav(state.view);
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
    saveCatalogSnapshot();
  } catch {
    const cached = loadCatalogSnapshot();
    if (cached && Array.isArray(cached.items) && cached.items.length > 0) {
      state.catalog = cached.items.map(normalizeCatalogItem).filter(Boolean);
      state.page = Number(cached.page || 1);
      state.totalPages = Number(cached.totalPages || state.page || 1);
      state.catalogSyncPage = Number(cached.catalogSyncPage || state.page || 1);
      state.hasMore = Boolean(cached.hasMore);
      state.lastSyncAt = new Date(Number(cached.savedAt || Date.now()));
      showToast("Mode cache actif: dernier catalogue local charge.");
    } else {
      state.catalog = FALLBACK_ITEMS.slice();
      state.page = 1;
      state.totalPages = 1;
      state.catalogSyncPage = 1;
      state.hasMore = false;
    }
  } finally {
    state.loadingCatalog = false;
  }

  if (!state.activeHeroId && state.catalog[0]) {
    state.activeHeroId = state.catalog[0].id;
  }
}

async function loadMoreCatalog() {
  if (
    state.loadingCatalog ||
    state.backgroundSyncRunning ||
    !state.hasMore ||
    state.view === "top" ||
    state.view === "list" ||
    state.view === "info" ||
    state.view === "calendar" ||
    state.query.trim().length > 0
  ) {
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
    saveCatalogSnapshot();
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
      if (page % 3 === 0 || page === lastPage) {
        saveCatalogSnapshot();
      }

      if (shouldRenderLiveCatalogUpdates() && (page === lastPage || page % BACKGROUND_CATALOG_RENDER_EVERY === 0)) {
        renderAll();
      } else {
        state.pendingCatalogUpdate = true;
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
    consumePendingCatalogUpdate();
  }
}

async function refreshCatalogHead() {
  try {
    const result = await fetchCatalogPage(1);
    const beforeCount = state.catalog.length;
    const preferPrepend =
      Number(window.scrollY || 0) < 120 &&
      state.view !== "calendar" &&
      state.view !== "list" &&
      state.view !== "top";
    upsertCatalogItems(result.items, { prepend: preferPrepend });
    state.totalPages = Math.max(state.totalPages, result.lastPage);
    state.catalogSyncPage = Math.max(state.catalogSyncPage, result.currentPage);
    state.lastSyncAt = new Date();
    saveCatalogSnapshot();
    if (state.catalog.length !== beforeCount) {
      if (shouldRenderLiveCatalogUpdates()) {
        renderAll();
      } else {
        state.pendingCatalogUpdate = true;
        renderCommunityStats();
        updateLoadMoreButton();
        updateSyncText();
      }
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
    const mapped = rows.map(normalizeCatalogItem).filter(Boolean);
    state.topDaily = mapped;
    warmImageCacheFromPool(mapped, 40);
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

async function handleRemoteSearch(token, signal) {
  const query = state.query.trim();
  if (query.length < 2) {
    return;
  }

  const payload = await fetchJson(`${API_BASE}/search-bar/search/${encodeURIComponent(query)}`, {
    signal,
  });
  if (token !== state.searchToken) {
    return;
  }

  const rows = payload?.data?.items?.movies?.items;
  if (!Array.isArray(rows)) {
    return;
  }

  const mapped = rows.map(normalizeCatalogItem);
  upsertCatalogItems(mapped, { prepend: true });
  saveCatalogSnapshot();
}

function upsertCatalogItems(items, { prepend }) {
  const map = new Map(state.catalog.map((item) => [item.id, item]));
  const incoming = [];

  for (const raw of items) {
    const item = raw || null;
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
    items: rows.map(normalizeCatalogItem).filter(Boolean),
    currentPage: Number(items.current_page || page),
    lastPage: Number(items.last_page || page),
  };
}

function normalizeCatalogItem(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const isAnime = Boolean(raw?.isAnime);
  const type = raw?.type === "tv" ? "tv" : "movie";

  const id = Number(raw?.id || 0);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const title = String(raw?.title || "Sans titre");
  return {
    id,
    type,
    title,
    titleLower: title.toLowerCase(),
    titleKey: normalizeTitleKey(title),
    poster: raw?.large_poster_path || raw?.small_poster_path || "",
    backdrop: raw?.wallpaper_poster_path || raw?.small_poster_path || raw?.large_poster_path || "",
    runtime: typeof raw?.runtime === "number" ? raw.runtime : null,
    releaseDate: raw?.release_date || null,
    endDate: raw?.end_date || null,
    isAnime,
  };
}

function buildTopFromCatalog() {
  return state.catalog
    .slice()
    .sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate))
    .slice(0, 10);
}

function renderAll() {
  if (state.view === "catalog" || state.view === "search") {
    state.view = "all";
  }

  const visible = getVisibleCatalog();
  const heroItem = getHeroItem(visible);
  const hasQuery = state.query.trim().length > 0;
  const isInfoView = state.view === "info";
  const isCalendarView = state.view === "calendar";
  const isListView = state.view === "list";
  const isTopView = state.view === "top";
  const showBrowseView = !isInfoView && !isCalendarView && !isTopView && !isListView;

  if (showBrowseView) {
    renderHero(heroItem);
    renderCommunityStats();
    renderCatalog(visible);
    warmImageCacheFromPool(visible, 260);
  }

  if (isTopView) {
    renderTopDaily();
  }
  if (isListView) {
    renderMyList();
  }

  if (isCalendarView) {
    renderCalendarSection();
  }

  updateCatalogHeading(hasQuery, visible.length);

  setHidden(refs.heroSection, !showBrowseView);
  setHidden(refs.statusStrip, isInfoView || isCalendarView);
  setHidden(refs.quickLinksSection, true);
  setHidden(refs.filtersPanel, isInfoView || isCalendarView || isTopView || isListView);
  setHidden(refs.communityPanel, isInfoView || isCalendarView || isTopView || isListView);
  setHidden(refs.infoSection, !isInfoView);
  setHidden(refs.calendarSection, !isCalendarView);

  setHidden(refs.topSection, !isTopView);
  setHidden(refs.featureRailSection, true);

  const showCatalog = showBrowseView;
  setHidden(refs.catalogSection, !showCatalog);
  setHidden(refs.emptyState, !showCatalog || visible.length > 0);
  refs.emptyState.textContent =
    hasQuery && state.query.length > 0
      ? `Aucun resultat pour "${state.query}".`
      : "Aucun resultat.";

  setHidden(refs.listSection, !(isListView && refs.listGrid.children.length > 0));
  setHidden(refs.latestSection, true);
  setHidden(refs.popularSection, true);
  setHidden(refs.continueSection, true);

  state.pendingCatalogUpdate = false;
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
  } else if (state.view === "latest") {
    list.sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate));
  } else if (state.view === "popular") {
    list = getPopularCatalog();
  }

  if (state.view === "movie") {
    list = list.filter((item) => item.type === "movie" && !item.isAnime);
  } else if (state.view === "tv") {
    list = list.filter((item) => item.type === "tv" && !item.isAnime);
  } else if (state.view === "anime") {
    list = list.filter((item) => item.isAnime);
  }

  if (state.chip === "movie") {
    list = list.filter((item) => item.type === "movie" && !item.isAnime);
  } else if (state.chip === "tv") {
    list = list.filter((item) => item.type === "tv" && !item.isAnime);
  } else if (state.chip === "anime") {
    list = list.filter((item) => item.isAnime);
  }

  if (state.chip === "recent") {
    list.sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate));
  }

  const query = state.query.trim().toLowerCase();
  if (query.length > 0) {
    const queryKey = normalizeTitleKey(query);
    list = list.filter((item) => {
      const title = item.titleLower || item.title.toLowerCase();
      if (title.includes(query)) {
        return true;
      }
      const normalized = item.titleKey || normalizeTitleKey(item.title || "");
      return queryKey.length > 0 && normalized.includes(queryKey);
    });
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

function getPopularCatalog() {
  const map = new Map();
  const push = (entry) => {
    if (!entry || Number(entry.id || 0) <= 0 || map.has(entry.id)) {
      return;
    }
    map.set(entry.id, entry);
  };

  state.topDaily.forEach(push);

  Object.values(state.progress)
    .sort((a, b) => Number(b?.lastPlayed || 0) - Number(a?.lastPlayed || 0))
    .forEach((row) => {
      const item = findItemById(Number(row?.id || 0));
      if (item) {
        push(item);
      }
    });

  state.catalog.forEach(push);
  return Array.from(map.values());
}

function updateCatalogHeading(hasQuery, resultCount) {
  if (!refs.catalogTitle || !refs.catalogSubtitle) {
    return;
  }
  refs.catalogSection?.classList.toggle("search-mode", Boolean(hasQuery));

  const titleByView = {
    all: "Streaming",
    movie: "Films",
    tv: "Series",
    anime: "Anime",
    latest: "Nouveautes",
    popular: "Populaires",
  };
  refs.catalogTitle.textContent = titleByView[state.view] || "Streaming";

  if (hasQuery) {
    refs.catalogSubtitle.textContent = `${resultCount} titre(s) trouve(s) pour "${state.query}".`;
    return;
  }

  if (state.view === "latest") {
    refs.catalogSubtitle.textContent = "Derniers ajouts detectes automatiquement.";
    return;
  }
  if (state.view === "popular") {
    refs.catalogSubtitle.textContent = "Titres les plus regardes par la communaute.";
    return;
  }
  refs.catalogSubtitle.textContent = "Catalogue fusionne films, series et anime.";
}

function renderFeatureRail(items) {
  if (!refs.featureRailTrack) {
    return;
  }
  const source = Array.isArray(items) ? items.filter(Boolean).slice(0, 14) : [];
  if (source.length === 0) {
    refs.featureRailTrack.innerHTML = "";
    state.featureRailSignature = "";
    return;
  }

  const signature = source.map((item) => item.id).join(",");
  if (signature === state.featureRailSignature && refs.featureRailTrack.children.length > 0) {
    return;
  }
  state.featureRailSignature = signature;

  refs.featureRailTrack.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const looped = source.concat(source);
  looped.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "feature-card";
    button.dataset.featureId = String(item.id);
    const topRank = state.topDaily.findIndex((entry) => entry.id === item.id);
    button.innerHTML = `
      <img
        src="${escapeHtml(item.backdrop || item.poster)}"
        alt="${escapeHtml(item.title)}"
        loading="${index < 10 ? "eager" : "lazy"}"
        decoding="async"
        fetchpriority="${index < 4 ? "high" : "auto"}"
      />
      <span>${escapeHtml(item.title)}</span>
      ${topRank >= 0 ? `<small>Top ${topRank + 1}</small>` : ""}
    `;
    const image = button.querySelector("img");
    if (image) {
      wireImageFallback(image, item.title, true);
    }
    button.addEventListener("click", () => {
      openDetails(item.id).catch(() => {
        showToast("Impossible d'ouvrir ce titre.", true);
      });
    });
    fragment.appendChild(button);
  });
  refs.featureRailTrack.appendChild(fragment);
}

function renderCommunityStats() {
  const total = state.catalog.length;
  const movies = state.catalog.filter((item) => item.type === "movie" && !item.isAnime).length;
  const series = state.catalog.filter((item) => item.type === "tv" && !item.isAnime).length;
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
  const latestFragment = document.createDocumentFragment();
  latest.forEach((item, index) => latestFragment.appendChild(buildMediaCard(item, false, null, index)));
  refs.latestGrid.appendChild(latestFragment);
  refs.latestSection.hidden = latest.length === 0;

  refs.popularGrid.innerHTML = "";
  const popularFragment = document.createDocumentFragment();
  popular.forEach((item, index) => popularFragment.appendChild(buildMediaCard(item, false, null, index)));
  refs.popularGrid.appendChild(popularFragment);
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
        isAnime: Boolean(favorite.isAnime),
        addedAt: Number(favorite.addedAt || 0),
      };
    })
    .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

  return list;
}

function renderMyList() {
  const items = getFavoriteCatalog().slice(0, 15);
  refs.listGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();
  items.forEach((item, index) => fragment.appendChild(buildMediaCard(item, false, null, index)));
  refs.listGrid.appendChild(fragment);
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

function getItemCategory(item) {
  if (item?.isAnime) {
    return "anime";
  }
  if (item?.type === "tv") {
    return "tv";
  }
  return "movie";
}

function getItemTypeLabel(item) {
  if (item?.isAnime) {
    return "Anime";
  }
  if (item?.type === "tv") {
    return "Serie";
  }
  return "Film";
}

function normalizeLanguageLabel(value) {
  if (value === null || value === undefined) {
    return "";
  }
  const raw = String(value).trim().toUpperCase();
  if (!raw) {
    return "";
  }
  if (raw === "1" || raw === "VF" || raw === "FR" || raw.includes("FRENCH")) {
    return "VF";
  }
  if (raw === "2" || raw.includes("VOST") || raw.includes("SUB")) {
    return "VOSTFR";
  }
  if (raw === "3" || raw.includes("MULTI")) {
    return "MULTI";
  }
  return raw;
}

function resolveDetailLanguageLabel(details, mediaId = 0) {
  const fromDetails = normalizeLanguageLabel(details?.lang);
  if (fromDetails) {
    return fromDetails;
  }
  if (mediaId > 0) {
    const fromMemory = normalizeLanguageLabel(
      state.detailLangCache.get(mediaId) || state.selectedLanguageByMedia.get(mediaId) || ""
    );
    if (fromMemory) {
      return fromMemory;
    }
  }
  return "";
}

function toCssImage(url) {
  const value = String(url || "").trim();
  if (!value) {
    return "none";
  }
  return `url(\"${value.replace(/\"/g, "\\\"")}\")`;
}

function prefetchStreamForItem(item) {
  if (!item || Number(item.id || 0) <= 0) {
    return;
  }

  const now = Date.now();
  const itemId = Number(item.id || 0);
  const lastPrefetchAt = Number(state.streamPrefetchAt.get(itemId) || 0);
  if (now - lastPrefetchAt < STREAM_PREFETCH_COOLDOWN_MS) {
    return;
  }
  state.streamPrefetchAt.set(itemId, now);

  const preferredSeason = Math.max(1, Number(state.progress[itemId]?.season || 1));
  const preferredEpisode = Math.max(1, Number(state.progress[itemId]?.episode || 1));
  const paths =
    item.type === "tv"
      ? [`/stream/${itemId}/episode?season=${preferredSeason}&episode=${preferredEpisode}`, `/stream/${itemId}`]
      : [`/stream/${itemId}`];

  paths.forEach((path) => {
    fetchStreamJson(path, { prefetch: true }).catch(() => {
      // best effort prefetch only
    });
  });
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
  refs.heroArt.decoding = "async";
  refs.heroArt.fetchPriority = "high";
  wireImageFallback(refs.heroArt, item.title, true);

  refs.heroMeta.innerHTML = "";
  const tags = [];
  tags.push(getItemTypeLabel(item));
  tags.push(item.type === "movie" ? "HD" : "Episodes");

  if (details?.runtime?.human) {
    tags.push(details.runtime.human);
  } else if (item.runtime) {
    tags.push(toHumanRuntime(item.runtime));
  }

  const year = getYear(item.releaseDate);
  if (year) {
    tags.push(year);
  }

  const languageLabel = resolveDetailLanguageLabel(details, item.id);
  if (languageLabel) {
    tags.push(languageLabel);
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
  const fragment = document.createDocumentFragment();

  state.topDaily.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "top-card";

    card.innerHTML = `
      <div class="top-thumb">
        <img
          src="${escapeHtml(item.backdrop || item.poster)}"
          alt="${escapeHtml(item.title)}"
          loading="${index < 6 ? "eager" : "lazy"}"
          decoding="async"
          fetchpriority="${index < 2 ? "high" : "auto"}"
        />
        <span class="top-rank">${index + 1}</span>
      </div>
      <div class="top-body">
        <h3 class="top-title">${escapeHtml(item.title)}</h3>
        <p class="top-meta">${escapeHtml(getItemTypeLabel(item))} - ${escapeHtml(getYear(item.releaseDate) || "-")}</p>
        <div class="media-actions">
          <button type="button" class="btn-small btn-play" data-top-play="${item.id}">Demarrer</button>
          <button type="button" class="btn-small btn-info" data-top-info="${item.id}">Details</button>
        </div>
      </div>
    `;

    const topImg = card.querySelector("img");
    if (topImg) {
      wireImageFallback(topImg, item.title, true);
    }
    card.addEventListener("pointerenter", () => {
      prefetchStreamForItem(item);
    });

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

    fragment.appendChild(card);
  });
  refs.topGrid.appendChild(fragment);
}

function renderCatalog(items) {
  state.catalogRenderToken += 1;
  const token = state.catalogRenderToken;
  if (state.catalogRenderFrame) {
    cancelAnimationFrame(state.catalogRenderFrame);
    state.catalogRenderFrame = 0;
  }
  refs.catalogGrid.innerHTML = "";
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  const total = items.length;
  const chunkSize = Math.max(
    CATALOG_RENDER_CHUNK_MIN,
    Math.min(CATALOG_RENDER_CHUNK_MAX, Math.ceil(total / 9))
  );
  let index = 0;

  const appendChunk = () => {
    if (token !== state.catalogRenderToken) {
      return;
    }
    const stop = Math.min(total, index + chunkSize);
    const fragment = document.createDocumentFragment();
    for (; index < stop; index += 1) {
      fragment.appendChild(buildMediaCard(items[index], false, null, index));
    }
    refs.catalogGrid.appendChild(fragment);

    if (index < total) {
      state.catalogRenderFrame = requestAnimationFrame(appendChunk);
    } else {
      state.catalogRenderFrame = 0;
    }
  };

  appendChunk();
  warmVisibleDetailCovers(items, 42);
}

function renderContinue() {
  const entries = Object.values(state.progress)
    .filter((entry) => Number(entry?.lastPlayed || 0) > 0)
    .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0))
    .slice(0, 6);

  refs.continueGrid.innerHTML = "";
  refs.continueSection.hidden = entries.length === 0;
  const fragment = document.createDocumentFragment();

  entries.forEach((entry, index) => {
    const item = findItemById(entry.id) || {
      id: entry.id,
      type: entry.type,
      title: entry.title,
      poster: entry.poster,
      backdrop: entry.poster,
      runtime: null,
      releaseDate: null,
      isAnime: Boolean(entry.isAnime),
    };
    fragment.appendChild(buildMediaCard(item, true, entry, index));
  });
  refs.continueGrid.appendChild(fragment);
}

function buildMediaCard(item, resume = false, progressEntry = null, position = 0) {
  const card = document.createElement("article");
  card.className = "media-card";
  card.dataset.cardId = String(item.id);

  const details = state.detailsCache.get(item.id) || null;
  const cover =
    details?.posters?.wallpaper ||
    details?.posters?.small ||
    details?.posters?.large ||
    item.backdrop ||
    item.poster;

  const year = getYear(item.releaseDate) || "-";
  const runtime = item.runtime ? toHumanRuntime(item.runtime) : item.type === "tv" ? "Episodes" : "Film";
  const typeLabel = getItemTypeLabel(item).toUpperCase();
  const favorite = isFavorite(item.id);
  const progress = progressEntry || state.progress[item.id] || null;
  const ratioRaw = progress && Number(progress.duration || 0) > 0
    ? (Number(progress.time || 0) / Number(progress.duration || 1)) * 100
    : 0;
  const ratio = Math.max(0, Math.min(100, Math.round(ratioRaw)));
  const isRecent = parseReleaseDate(item.releaseDate) > Date.now() - 90 * 24 * 60 * 60 * 1000;

  card.innerHTML = `
    <div class="media-thumb">
      <img
        src="${escapeHtml(cover)}"
        alt="${escapeHtml(item.title)}"
        loading="${position < 58 ? "eager" : "lazy"}"
        decoding="async"
        fetchpriority="${position < 14 ? "high" : "auto"}"
        data-cover-id="${item.id}"
      />
      <div class="media-flags">
        <span class="flag good">FREE</span>
        <span class="flag">${escapeHtml(typeLabel)}</span>
        ${isRecent ? '<span class="flag hot">NEW</span>' : ""}
        ${item.type === "tv" ? '<span class="flag">EPISODES</span>' : ""}
      </div>
      ${ratio > 0 ? `<div class="progress-track"><span style="width:${ratio}%"></span></div>` : ""}
    </div>
    <div class="media-body">
      <h3 class="media-title">${escapeHtml(item.title)}</h3>
      <p class="media-meta">${escapeHtml(year)} - ${escapeHtml(runtime)}</p>
      <div class="media-actions">
        <button type="button" class="btn-small btn-play" data-card-play="${item.id}">${resume ? "Reprendre" : "Demarrer"}</button>
        <button type="button" class="btn-small btn-info" data-card-info="${item.id}">Details</button>
        <button type="button" class="btn-small btn-fav${favorite ? " active" : ""}" data-card-fav="${item.id}">${favorite ? "Retirer" : "+ Liste"}</button>
      </div>
    </div>
  `;

  const mediaImg = card.querySelector("img");
  if (mediaImg) {
    wireImageFallback(mediaImg, item.title, true);
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

  card.addEventListener("pointerdown", () => {
    ensureDetails(item.id)
      .then((entry) => {
        updateCardCoverFromDetails(item.id, entry);
      })
      .catch(() => {
        // optional warmup only
      });
  });

  card.addEventListener("pointerenter", () => {
    prefetchStreamForItem(item);
  });

  card.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("button, a")) {
      return;
    }
    openDetails(item.id).catch(() => {
      showMessage("Impossible de charger les details.", true);
    });
  });

  return card;
}

function updateCardCoverFromDetails(id, details) {
  if (!details || Number(id) <= 0) {
    return;
  }
  const cover = details?.posters?.wallpaper || details?.posters?.small || details?.posters?.large || "";
  if (!cover) {
    return;
  }

  const item = findItemById(Number(id));
  if (item) {
    item.backdrop = cover;
  }

  document.querySelectorAll(`[data-cover-id="${id}"]`).forEach((node) => {
    if (node instanceof HTMLImageElement) {
      if (node.src !== cover) {
        node.src = cover;
      }
      wireImageFallback(node, item?.title || details?.title || "Zenix", true);
    }
  });
}

function warmVisibleDetailCovers(items, limit = 32) {
  const rows = Array.isArray(items) ? items.slice(0, Math.max(0, limit)) : [];
  rows.forEach((entry) => {
    if (!entry || Number(entry.id || 0) <= 0) {
      return;
    }
    ensureDetails(entry.id)
      .then((details) => {
        updateCardCoverFromDetails(entry.id, details);
      })
      .catch(() => {
        // best effort only
      });
  });
}

function updateLoadMoreButton() {
  if (
    state.backgroundSyncRunning ||
    state.view === "top" ||
    state.view === "list" ||
    state.view === "info" ||
    state.view === "calendar" ||
    state.query.trim().length > 0 ||
    !state.hasMore
  ) {
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

  if (state.backgroundSyncRunning && state.totalPages > 0) {
    const current = Math.min(state.catalogSyncPage || state.page || 0, state.totalPages);
    refs.syncInfo.textContent = `Synchronisation catalogue ${current}/${state.totalPages}...`;
    return;
  }

  if (!state.lastSyncAt) {
    refs.syncInfo.textContent = "Synchronisation initiale en cours.";
    return;
  }

  const timeLabel = state.lastSyncAt.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  refs.syncInfo.textContent = `Derniere synchro catalogue: ${timeLabel}.`;
}

async function ensureDetails(id) {
  if (!id || state.detailsCache.has(id)) {
    return state.detailsCache.get(id) || null;
  }
  if (state.detailsInFlight.has(id)) {
    return state.detailsInFlight.get(id);
  }

  const task = (async () => {
    const payload = await fetchJson(`${API_BASE}/media/${id}/sheet`);
    const details = payload?.data?.items;
    if (details && typeof details === "object") {
      state.detailsCache.set(id, details);
      return details;
    }
    return null;
  })();
  state.detailsInFlight.set(id, task);

  try {
    return await task;
  } finally {
    state.detailsInFlight.delete(id);
  }
}

async function ensureTrailers(id) {
  if (!id) {
    return [];
  }
  if (state.trailersCache.has(id)) {
    return state.trailersCache.get(id);
  }
  if (state.trailersInFlight.has(id)) {
    return state.trailersInFlight.get(id);
  }

  const task = (async () => {
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
  })();
  state.trailersInFlight.set(id, task);

  try {
    return await task;
  } finally {
    state.trailersInFlight.delete(id);
  }
}

async function ensureSeasons(id) {
  if (state.seasonsCache.has(id)) {
    return state.seasonsCache.get(id);
  }
  if (state.seasonsInFlight.has(id)) {
    return state.seasonsInFlight.get(id);
  }

  const task = (async () => {
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
                airDate: String(episode?.airDate || episode?.air_date || "").trim(),
                isSoon: isEpisodeSoon(episode),
              }))
              .filter((episode) => episode.episode > 0)
          : [],
      }))
      .filter((entry) => entry.season > 0 && entry.episodes.length > 0)
      .sort((a, b) => a.season - b.season);

    state.seasonsCache.set(id, seasons);
    return seasons;
  })();
  state.seasonsInFlight.set(id, task);

  try {
    return await task;
  } finally {
    state.seasonsInFlight.delete(id);
  }
}

function getEpisodesForSeason(seasons, seasonNumber) {
  const season = seasons.find((entry) => entry.season === seasonNumber);
  return season ? season.episodes : [];
}

function parseEpisodeAirDate(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return 0;
  }
  const direct = Date.parse(raw);
  if (Number.isFinite(direct)) {
    return direct;
  }

  const normalized = raw
    .replaceAll("fevrier", "fevrier")
    .replaceAll("ao t", "aout")
    .replaceAll("decembre", "decembre");
  const match = normalized.match(/^(\d{1,2})\s+([a-z\u00e9\u00ea\u00e8\u00f4\u00fb\u00ee\u00ef]+)\s+(\d{4})$/i);
  if (!match) {
    return 0;
  }
  const monthMap = {
    janvier: 0,
    fevrier: 1,
    "f\u00e9vrier": 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    aout: 7,
    "ao\u00fbt": 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    decembre: 11,
    "d\u00e9cembre": 11,
  };
  const day = Number(match[1]);
  const month = monthMap[match[2]];
  const year = Number(match[3]);
  if (!Number.isInteger(day) || !Number.isInteger(year) || month === undefined) {
    return 0;
  }
  const parsed = new Date(year, month, day).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function isEpisodeSoon(rawEpisode) {
  const title = String(rawEpisode?.name || rawEpisode?.formattedName || "").toLowerCase();
  if (/soon|bientot|a venir|coming/.test(title)) {
    return true;
  }
  const airDateTs = parseEpisodeAirDate(rawEpisode?.airDate || rawEpisode?.air_date || "");
  if (airDateTs > Date.now() + 2 * 60 * 60 * 1000) {
    return true;
  }
  if (Number(rawEpisode?.runtime?.minutes || 0) <= 0 && airDateTs > 0) {
    return true;
  }
  return false;
}

function getFirstPlayableEpisode(episodes) {
  const row = (episodes || []).find((entry) => !entry?.isSoon);
  return row ? Number(row.episode || 1) : Number(episodes?.[0]?.episode || 1);
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
    const soonSuffix = entry?.isSoon ? " | soon" : "";
    option.textContent = `E${String(entry.episode).padStart(2, "0")} - ${entry.name}${soonSuffix}`;
    option.selected = entry.episode === selectedEpisode;
    option.disabled = Boolean(entry?.isSoon);
    select.appendChild(option);
  });

  if (select.options.length > 0 && (!select.value || select.selectedOptions[0]?.disabled)) {
    const fallback = getFirstPlayableEpisode(episodes);
    select.value = String(fallback);
  }
}

function populateLanguageSelect(select, languages, selectedLanguage) {
  if (!select) {
    return;
  }
  select.innerHTML = "";
  const normalized = Array.from(new Set(languages.filter(Boolean)));
  if (normalized.length === 0) {
    const fallback = document.createElement("option");
    fallback.value = "";
    fallback.textContent = "Auto";
    fallback.selected = true;
    select.appendChild(fallback);
    return;
  }
  normalized.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang;
    option.selected = lang === selectedLanguage;
    select.appendChild(option);
  });
}

function getAvailableLanguages(sources) {
  const set = new Set();
  (sources || []).forEach((entry) => {
    if (entry.language) {
      set.add(entry.language);
    }
  });
  const ordered = Array.from(set);
  ordered.sort((left, right) => {
    if (left === "VOSTFR") {
      return -1;
    }
    if (right === "VOSTFR") {
      return 1;
    }
    return left.localeCompare(right, "fr");
  });
  return ordered;
}

function resolvePreferredLanguage(mediaId, requestedLanguage, availableLanguages) {
  const direct = String(requestedLanguage || "").trim().toUpperCase();
  if (direct && availableLanguages.includes(direct)) {
    return direct;
  }
  const remembered = String(state.selectedLanguageByMedia.get(mediaId) || "").trim().toUpperCase();
  if (remembered && availableLanguages.includes(remembered)) {
    return remembered;
  }
  return availableLanguages[0] || "";
}

function filterSourcesByLanguage(sources, language) {
  const selected = String(language || "").trim().toUpperCase();
  if (!selected) {
    return (sources || []).slice();
  }
  const filtered = (sources || []).filter((entry) => entry.language === selected);
  return filtered.length > 0 ? filtered : (sources || []).slice();
}

async function syncDetailLanguageOptions(id, season, episode) {
  const item = findItemById(id);
  if (!item || item.type !== "tv") {
    populateLanguageSelect(refs.detailLanguageSelect, [], "");
    refs.detailLanguageSelect.disabled = true;
    state.detailLangCache.delete(id);
    return;
  }
  const payload = await fetchStreamJson(`/stream/${id}/episode?season=${season}&episode=${episode}`);
  const sources = extractSources(payload);
  const languages = getAvailableLanguages(sources);
  const selected = resolvePreferredLanguage(id, refs.detailLanguageSelect?.value || "", languages);
  populateLanguageSelect(refs.detailLanguageSelect, languages, selected);
  refs.detailLanguageSelect.disabled = languages.length <= 1;
  if (selected) {
    state.detailLangCache.set(id, selected);
  } else {
    state.detailLangCache.delete(id);
  }
}

async function openDetails(id, options = {}) {
  state.selectedDetailId = id;
  const detailToken = ++state.detailToken;
  let item = findItemById(id);
  if (!item) {
    item = await buildItemFromDetails(id);
  }
  if (!item) {
    throw new Error("Item not found");
  }

  state.activeHeroId = id;
  if (options.syncRoute !== false) {
    setAppRoute({ detail: id });
  }

  const quickBackdrop = item.backdrop || item.poster || "";
  if (refs.detailPanel) {
    refs.detailPanel.style.setProperty("--detail-backdrop-image", toCssImage(quickBackdrop));
  }
  refs.detailPoster.src = item.poster || item.backdrop || "";
  refs.detailPoster.alt = item.title;
  wireImageFallback(refs.detailPoster, item.title, false);
  refs.detailKicker.textContent = `${getItemTypeLabel(item)} detail`;
  refs.detailTitle.textContent = item.title;
  refs.detailMeta.textContent = [getYear(item.releaseDate || ""), getItemTypeLabel(item)].filter(Boolean).join(" - ");
  refs.detailOverview.textContent = "Chargement des informations...";
  refs.detailBadges.innerHTML = "";
  [getItemTypeLabel(item), item.type === "tv" ? "Episodes" : "HD", "Gratuit"].forEach((label) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = label;
    refs.detailBadges.appendChild(span);
  });
  refs.detailTrailerBtn.disabled = true;
  updateDetailFavoriteButton(id);
  refs.detailSeriesControls.hidden = true;
  refs.detailLanguageSelect.innerHTML = "";
  refs.detailLanguageSelect.disabled = true;
  refs.trailerWrap.hidden = true;
  refs.trailerFrame.src = "";
  refs.detailModal.hidden = false;
  updateBodyScrollLock();

  const [details, trailers] = await Promise.all([
    ensureDetails(id).catch(() => null),
    ensureTrailers(id).catch(() => []),
  ]);
  if (state.detailToken !== detailToken || state.selectedDetailId !== id) {
    return;
  }

  const detailBackdrop =
    details?.posters?.wallpaper || details?.posters?.small || item.backdrop || details?.posters?.large || item.poster;
  if (refs.detailPanel) {
    refs.detailPanel.style.setProperty("--detail-backdrop-image", toCssImage(detailBackdrop));
  }

  refs.detailPoster.src = details?.posters?.large || details?.posters?.small || item.poster || item.backdrop;
  refs.detailPoster.alt = item.title;
  wireImageFallback(refs.detailPoster, item.title, false);
  refs.detailKicker.textContent = `${getItemTypeLabel(item)} detail`;
  refs.detailTitle.textContent = details?.title || item.title;

  const parts = [];
  const year = getYear(item.releaseDate || details?.releaseDate || "");
  if (year) {
    parts.push(year);
  }
  const languageLabel = resolveDetailLanguageLabel(details, id);
  if (languageLabel) {
    parts.push(languageLabel);
    state.detailLangCache.set(id, languageLabel);
  }
  if (details?.runtime?.human) {
    parts.push(details.runtime.human);
  } else if (item.runtime) {
    parts.push(toHumanRuntime(item.runtime));
  }
  if (details?.note?.tmdb?.average) {
    parts.push(`TMDB ${Number(details.note.tmdb.average).toFixed(1)}`);
  }
  parts.push(getItemTypeLabel(item));
  refs.detailMeta.textContent = parts.join(" - ");

  refs.detailOverview.textContent =
    details?.overview || "Aucune description detaillee disponible pour ce titre.";

  refs.detailBadges.innerHTML = "";
  const badges = [getItemTypeLabel(item)];
  if (languageLabel) {
    badges.push(languageLabel);
  }
  if (item.type === "tv") {
    badges.push("Episodes");
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

  refs.detailLanguageSelect.innerHTML = "";
  refs.detailLanguageSelect.disabled = true;

  if (item.type === "tv") {
    try {
      const seasons = await ensureSeasons(id);
      if (state.detailToken !== detailToken || state.selectedDetailId !== id) {
        return;
      }
      if (seasons.length > 0) {
        const progress = state.progress[id] || null;
        const defaultSeason = Number(progress?.season || seasons[0].season);
        const episodes = getEpisodesForSeason(seasons, defaultSeason);
        const fallbackEpisode = getFirstPlayableEpisode(episodes);
        const defaultEpisode = Number(progress?.episode || fallbackEpisode);
        populateSeasonSelect(refs.detailSeasonSelect, seasons, defaultSeason);
        populateEpisodeSelect(refs.detailEpisodeSelect, episodes, defaultEpisode);
        await syncDetailLanguageOptions(id, defaultSeason, defaultEpisode);
        if (state.detailToken !== detailToken || state.selectedDetailId !== id) {
          return;
        }
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
}

function closeDetails(options = {}) {
  refs.detailModal.hidden = true;
  refs.trailerWrap.hidden = true;
  refs.trailerFrame.src = "";
  if (refs.detailPanel) {
    refs.detailPanel.style.setProperty("--detail-backdrop-image", "none");
  }
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

  const token = ++state.playToken;
  const resume = state.progress[id] || null;
  const cachedDetails = state.detailsCache.get(id) || null;
  const playerBackdrop =
    cachedDetails?.posters?.wallpaper ||
    cachedDetails?.posters?.small ||
    item.backdrop ||
    item.poster ||
    cachedDetails?.posters?.large ||
    "";

  refs.playerOverlay.hidden = false;
  refs.playerTitle.textContent = item.title;
  setPlayerPill(refs.playerTypePill, formatPlayerKind(item), true);
  setPlayerPill(refs.playerLanguagePill, item.type === "tv" ? "Langue auto" : "Auto");
  setPlayerPill(refs.playerQualityPill, "Qualite auto");
  if (refs.playerPanel) {
    refs.playerPanel.style.setProperty("--player-backdrop-image", toCssImage(playerBackdrop));
    refs.playerPanel.setAttribute("data-player-type", item.type === "tv" ? "series" : "movie");
  }
  setPlayerStatus("Preparation de la lecture...");
  if (refs.playerSourceMeta) {
    refs.playerSourceMeta.textContent = "";
  }
  renderPlayerSourceOptions();
  populateLanguageSelect(refs.playerLanguageSelect, [], "");
  refs.playerLanguageSelect.disabled = true;
  updateBodyScrollLock();
  try {
    if (item.type === "tv") {
      const seasons = await ensureSeasons(id);
      if (token !== state.playToken) {
        return;
      }
      if (seasons.length === 0) {
        refs.playerSeriesControls.hidden = true;
        await loadMovieStream(
          item,
          Number(options.resumeTime || resume?.time || 0),
          token,
          options.syncRoute !== false
        );
        return;
      }

      let season = Number(options.season || resume?.season || seasons[0].season);
      if (!seasons.some((entry) => entry.season === season)) {
        season = seasons[0].season;
      }

      const episodes = getEpisodesForSeason(seasons, season);
      if (episodes.length === 0) {
        throw new Error("No episode for selected season");
      }

      const firstPlayable = getFirstPlayableEpisode(episodes);
      let episode = Number(options.episode || resume?.episode || firstPlayable);
      if (!episodes.some((entry) => entry.episode === episode)) {
        episode = firstPlayable;
      }
      const foundEpisode = episodes.find((entry) => entry.episode === episode);
      if (foundEpisode?.isSoon) {
        episode = firstPlayable;
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
        String(options.language || resume?.language || ""),
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
  const payload = await fetchStreamJson(`/stream/${item.id}`);
  if (token !== state.playToken) {
    return;
  }

  state.sourcePool = extractSources(payload);
  if (state.sourcePool.length === 0) {
    throw new Error("No movie source");
  }
  state.sourceIndex = -1;
  renderPlayerSourceOptions();
  await playFromSourcePool(resumeTime, token, 0);
  state.nowPlaying = {
    id: item.id,
    type: "movie",
    title: item.title,
    poster: item.poster,
    isAnime: false,
    season: 1,
    episode: 1,
  };
  if (syncRoute) {
    setAppRoute({ watch: item.id }, { replace: true });
  }
}

async function loadEpisodeStream(
  item,
  season,
  episode,
  resumeTime,
  token,
  preferredLanguage = "",
  syncRoute = true
) {
  setPlayerStatus(`Chargement S${season}E${episode}...`);

  const payload = await fetchStreamJson(`/stream/${item.id}/episode?season=${season}&episode=${episode}`);
  if (token !== state.playToken) {
    return;
  }

  state.allEpisodeSources = extractSources(payload);
  state.availableLanguages = getAvailableLanguages(state.allEpisodeSources);
  const language = resolvePreferredLanguage(item.id, preferredLanguage, state.availableLanguages);
  state.sourcePool = filterSourcesByLanguage(state.allEpisodeSources, language);
  state.selectedLanguageByMedia.set(item.id, language);
  saveLanguagePrefsMap(state.selectedLanguageByMedia);

  populateLanguageSelect(refs.playerLanguageSelect, state.availableLanguages, language);
  refs.playerLanguageSelect.disabled = state.availableLanguages.length <= 1;
  setPlayerPill(refs.playerLanguagePill, language || "Auto");

  if (state.sourcePool.length === 0) {
    throw new Error("No episode source");
  }
  state.sourceIndex = -1;
  renderPlayerSourceOptions();
  await playFromSourcePool(resumeTime, token, 0);

  state.nowPlaying = {
    id: item.id,
    type: "tv",
    title: item.title,
    poster: item.poster,
    isAnime: Boolean(item.isAnime),
    language,
    season,
    episode,
  };
  if (syncRoute) {
    setAppRoute({ watch: item.id, season, episode }, { replace: true });
  }
  setPlayerStatus(`Lecture S${season}E${episode}${language ? ` (${language})` : ""}`);
}

async function switchPlayerEpisode(season, episode, options = {}) {
  if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
    return;
  }

  const item = findItemById(state.nowPlaying.id) || (await buildItemFromDetails(state.nowPlaying.id));
  if (!item) {
    return;
  }

  const token = ++state.playToken;
  await loadEpisodeStream(
    item,
    season,
    episode,
    0,
    token,
    String(options.language || state.nowPlaying.language || "")
  );
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
    if (state.allEpisodeSources.length > state.sourcePool.length) {
      state.sourcePool = state.allEpisodeSources.slice();
      state.sourceIndex = -1;
      showToast("Bascule automatique vers une autre langue/source.");
    } else {
      setPlayerStatus("Source indisponible. Aucun secours disponible.", true);
      return;
    }
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
    renderPlayerSourceOptions();
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
  const language = normalizeSourceLanguage(entry);
  const host = getSourceHost(url);
  const score = getSourceScore(format, quality, language, index);

  return {
    url,
    format,
    quality,
    language,
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

function getSourceScore(format, quality, language, index) {
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
  if (language === "VOSTFR") {
    score += 22;
  } else if (language === "VF") {
    score += 20;
  }

  score += Math.max(0, 30 - index);
  return score;
}

function formatSourceLabel(source, index, total) {
  const chunks = [`Source ${index + 1}/${total}`];
  if (source?.quality) {
    chunks.push(String(source.quality));
  }
  if (source?.language) {
    chunks.push(source.language);
  }
  if (source?.format && source.format !== "unknown") {
    chunks.push(source.format.toUpperCase());
  }
  return chunks.join(" - ");
}

function renderPlayerSourceOptions() {
  if (!refs.playerSourceSelect || !refs.playerSourceApplyBtn) {
    return;
  }

  refs.playerSourceSelect.innerHTML = "";
  if (!Array.isArray(state.sourcePool) || state.sourcePool.length === 0) {
    refs.playerSourceSelect.disabled = true;
    refs.playerSourceApplyBtn.disabled = true;
    if (refs.playerSourceControl) {
      refs.playerSourceControl.hidden = true;
    }
    return;
  }

  const fragment = document.createDocumentFragment();
  state.sourcePool.forEach((entry, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = formatSourceLabel(entry, index, state.sourcePool.length);
    option.selected = index === state.sourceIndex;
    fragment.appendChild(option);
  });
  refs.playerSourceSelect.appendChild(fragment);
  refs.playerSourceSelect.disabled = state.sourcePool.length <= 1;
  refs.playerSourceApplyBtn.disabled = state.sourcePool.length <= 1;
  if (state.sourceIndex >= 0) {
    refs.playerSourceSelect.value = String(state.sourceIndex);
  }
  if (refs.playerSourceControl) {
    refs.playerSourceControl.hidden = false;
  }
}

async function switchPlayerSource(index) {
  const safeIndex = Number(index);
  if (!Number.isInteger(safeIndex) || safeIndex < 0 || safeIndex >= state.sourcePool.length) {
    return;
  }
  if (safeIndex === state.sourceIndex) {
    return;
  }
  const token = ++state.playToken;
  const resumeTime = Number(refs.playerVideo.currentTime || 0);
  await playFromSourcePool(resumeTime, token, safeIndex);
  showToast("Source changee.");
}

function formatPlayerKind(item) {
  if (!item) {
    return "Lecture";
  }
  if (item.type === "tv") {
    return item.isAnime ? "Anime" : "Serie";
  }
  return "Film";
}

function setPlayerPill(target, value, accent = false) {
  if (!target) {
    return;
  }
  const text = String(value || "").trim();
  target.textContent = text || "Auto";
  target.classList.toggle("accent", Boolean(accent));
}

function normalizeSourceLanguage(entry) {
  const raw = String(entry?.source_name || entry?.language || entry?.lang || "")
    .trim()
    .toUpperCase();
  if (!raw) {
    return "";
  }
  if (raw.includes("VOST") || raw.includes("SUB") || raw === "VJ") {
    return "VOSTFR";
  }
  if (raw.includes("VF") || raw.includes("FRENCH") || raw === "FR") {
    return "VF";
  }
  return raw;
}

async function startPlayerSource(source, resumeTime, token) {
  const streamUrl = String(source?.url || "").trim();
  if (!streamUrl) {
    throw new Error("Missing source URL");
  }

  const video = refs.playerVideo;
  video.preload = "auto";
  teardownPlayerEngine(video);
  if (refs.playerSourceMeta) {
    refs.playerSourceMeta.textContent = formatSourceLabel(
      source,
      Math.max(0, state.sourceIndex),
      state.sourcePool.length || 1
    );
  }
  const qualityLabel = [String(source?.quality || "").trim(), String(source?.format || "").toUpperCase().trim()]
    .filter(Boolean)
    .join(" - ");
  setPlayerPill(refs.playerQualityPill, qualityLabel || "Qualite auto");
  if (source?.language) {
    setPlayerPill(refs.playerLanguagePill, source.language);
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
  refs.playerStatus.classList.toggle("error", Boolean(isError));
}

function closePlayer(options = {}) {
  refs.playerOverlay.hidden = true;
  refs.playerSeriesControls.hidden = true;
  saveNowPlayingProgress({ force: true });
  teardownPlayerEngine(refs.playerVideo);
  if (refs.playerPanel) {
    refs.playerPanel.style.setProperty("--player-backdrop-image", "none");
    refs.playerPanel.removeAttribute("data-player-type");
  }

  setPlayerStatus("");
  if (refs.playerSourceMeta) {
    refs.playerSourceMeta.textContent = "";
  }
  setPlayerPill(refs.playerTypePill, "Lecture", true);
  setPlayerPill(refs.playerLanguagePill, "Auto");
  setPlayerPill(refs.playerQualityPill, "Qualite auto");
  state.sourcePool = [];
  state.sourceIndex = -1;
  state.allEpisodeSources = [];
  state.availableLanguages = [];
  state.nowPlaying = null;
  renderPlayerSourceOptions();
  populateLanguageSelect(refs.playerLanguageSelect, [], "");
  refs.playerLanguageSelect.disabled = true;
  if (options.syncRoute !== false && !refs.detailModal.hidden && state.selectedDetailId) {
    setAppRoute({ detail: state.selectedDetailId }, { replace: true });
  } else if (options.syncRoute !== false) {
    setAppRoute({}, { replace: true });
  }
  updateBodyScrollLock();
}

function saveNowPlayingProgress(options = {}) {
  if (!state.nowPlaying) {
    return false;
  }

  const now = Date.now();
  if (!options.force && now - lastProgressSave < PROGRESS_SAVE_INTERVAL_MS) {
    return false;
  }

  const currentTime = Number(refs.playerVideo.currentTime || 0);
  const duration = Number(refs.playerVideo.duration || 0);
  state.progress[state.nowPlaying.id] = {
    id: state.nowPlaying.id,
    type: state.nowPlaying.type,
    title: state.nowPlaying.title,
    poster: state.nowPlaying.poster,
    isAnime: Boolean(state.nowPlaying.isAnime),
    language: String(state.nowPlaying.language || ""),
    season: state.nowPlaying.season || 1,
    episode: state.nowPlaying.episode || 1,
    time: Number.isFinite(currentTime) ? Math.max(0, currentTime) : 0,
    duration: Number.isFinite(duration) ? Math.max(0, duration) : 0,
    lastPlayed: now,
  };
  saveProgress(state.progress);
  lastProgressSave = now;
  return true;
}

function onPlayerProgress() {
  saveNowPlayingProgress();
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

  const nextPlayable = sortedEpisodes.slice(currentIndex + 1).find((entry) => !entry.isSoon);
  if (!nextPlayable) {
    showToast("Prochain episode pas encore disponible.");
    return;
  }
  const nextEpisode = nextPlayable.episode;
  populateEpisodeSelect(refs.playerEpisodeSelect, sortedEpisodes, nextEpisode);
  refs.playerEpisodeSelect.value = String(nextEpisode);

  await switchPlayerEpisode(ended.season, nextEpisode, {
    language: String(ended.language || ""),
  });
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
      isAnime: Boolean(item?.isAnime),
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
  const normalizedView = view === "catalog" || view === "search" ? "all" : view;
  const chip = String(url.searchParams.get("chip") || "");
  const sort = String(url.searchParams.get("sort") || "");
  const query = String(url.searchParams.get("q") || "").trim();

  const allowedViews = new Set(["all", "calendar", "top", "movie", "tv", "anime", "latest", "popular", "list", "info"]);
  const allowedChips = new Set(["all", "recent", "movie", "tv", "anime"]);
  const allowedSort = new Set(["featured", "recent", "title-asc", "title-desc", "runtime-desc"]);

  if (allowedViews.has(normalizedView)) {
    state.view = normalizedView;
  }
  if (allowedChips.has(chip)) {
    state.chip = chip;
  }
  if (allowedSort.has(sort)) {
    state.sortBy = sort;
  }
  if (!isCatalogCategoryView(state.view) && state.view !== "all") {
    state.chip = "all";
  }

  if (state.view === "calendar") {
    state.calendarQuery = query;
    state.query = "";
    if (refs.calendarSearchInput) {
      refs.calendarSearchInput.value = query;
    }
    refs.searchInput.value = query;
  } else {
    state.query = query;
    refs.searchInput.value = query;
    if (refs.calendarSearchInput) {
      refs.calendarSearchInput.value = state.calendarQuery || "";
    }
  }
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

  const queryValue = state.view === "calendar" ? state.calendarQuery : state.query;
  if (queryValue && queryValue.length > 0) {
    url.searchParams.set("q", queryValue);
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
  setActiveNav(state.view);
  renderAll();
  if (state.view === "calendar") {
    ensureCalendarData().catch(() => {
      showToast("Calendrier indisponible temporairement.", true);
    });
  }

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

function createAnalyticsClientId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function getOrCreateAnalyticsClientId() {
  try {
    const existing = String(localStorage.getItem(HEARTBEAT_KEY) || "").trim();
    if (existing.length >= 12 && existing.length <= 80) {
      return existing;
    }
    const generated = createAnalyticsClientId();
    localStorage.setItem(HEARTBEAT_KEY, generated);
    return generated;
  } catch {
    return createAnalyticsClientId();
  }
}

function disableAnalyticsHeartbeat() {
  state.analyticsDisabled = true;
  if (state.heartbeatTimer) {
    clearInterval(state.heartbeatTimer);
    state.heartbeatTimer = null;
  }
}

function sendAnalyticsHeartbeat(useBeacon = false) {
  if (state.analyticsDisabled || state.analyticsInFlight) {
    return;
  }
  const clientId = String(state.analyticsClientId || "").trim();
  if (!clientId) {
    return;
  }

  const payload = {
    clientId,
    page: window.location.pathname,
    view: state.view,
    ts: Date.now(),
  };
  const endpoint = `${API_BASE}/analytics/heartbeat`;

  if (useBeacon && navigator.sendBeacon) {
    try {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json; charset=utf-8",
      });
      navigator.sendBeacon(endpoint, blob);
      return;
    } catch {
      // fallback to fetch
    }
  }

  state.analyticsInFlight = true;
  fetch(endpoint, {
    method: "POST",
    credentials: "omit",
    keepalive: true,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok && (response.status === 404 || response.status === 405 || response.status === 501)) {
        disableAnalyticsHeartbeat();
      }
    })
    .catch(() => {
      // best effort only
    })
    .finally(() => {
      state.analyticsInFlight = false;
    });
}

function startAnalyticsHeartbeat() {
  if (state.analyticsDisabled) {
    return;
  }
  if (!state.analyticsClientId) {
    state.analyticsClientId = getOrCreateAnalyticsClientId();
  }

  sendAnalyticsHeartbeat(false);

  if (state.heartbeatTimer) {
    clearInterval(state.heartbeatTimer);
  }
  state.heartbeatTimer = setInterval(() => {
    sendAnalyticsHeartbeat(document.visibilityState === "hidden");
  }, HEARTBEAT_INTERVAL_MS);

  if (!state.heartbeatBound) {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        saveNowPlayingProgress({ force: true });
      }
      sendAnalyticsHeartbeat(false);
    });
    window.addEventListener("pagehide", () => {
      saveNowPlayingProgress({ force: true });
      sendAnalyticsHeartbeat(true);
    });
    window.addEventListener("beforeunload", () => {
      saveNowPlayingProgress({ force: true });
    });
    state.heartbeatBound = true;
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
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
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
  const payload = JSON.stringify(value);
  localStorage.setItem(STORAGE_KEY, payload);
  sessionStorage.setItem(STORAGE_KEY, payload);
}

function loadCatalogSnapshot() {
  try {
    const raw = localStorage.getItem(CATALOG_CACHE_KEY) || sessionStorage.getItem(CATALOG_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveCatalogSnapshot() {
  try {
    if (!Array.isArray(state.catalog) || state.catalog.length === 0) {
      return;
    }
    const payload = JSON.stringify({
      savedAt: Date.now(),
      page: state.page,
      totalPages: state.totalPages,
      catalogSyncPage: state.catalogSyncPage,
      hasMore: state.hasMore,
      items: state.catalog.slice(0, 900),
    });
    localStorage.setItem(CATALOG_CACHE_KEY, payload);
    sessionStorage.setItem(CATALOG_CACHE_KEY, payload);
  } catch {
    // ignore quota/private mode issues
  }
}

function getCalendarCacheEntryKey(month, year) {
  const safeMonth = String(Math.max(1, Math.min(12, Number(month || 1)))).padStart(2, "0");
  const safeYear = String(Math.max(2000, Math.min(2099, Number(year || new Date().getFullYear()))));
  return `${safeYear}-${safeMonth}`;
}

function loadCalendarCacheStore() {
  try {
    const raw = localStorage.getItem(CALENDAR_CACHE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveCalendarCacheStore(store) {
  try {
    localStorage.setItem(CALENDAR_CACHE_KEY, JSON.stringify(store || {}));
  } catch {
    // ignore quota / private mode failures
  }
}

function loadCalendarSnapshot(month, year) {
  const store = loadCalendarCacheStore();
  const key = getCalendarCacheEntryKey(month, year);
  const entry = store[key];
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const data = entry.data;
  if (!data || typeof data !== "object") {
    return null;
  }
  return data;
}

function saveCalendarSnapshot(month, year, data) {
  if (!data || typeof data !== "object") {
    return;
  }

  const store = loadCalendarCacheStore();
  const key = getCalendarCacheEntryKey(month, year);
  store[key] = {
    savedAt: Date.now(),
    data,
  };

  const entries = Object.entries(store)
    .filter(([, value]) => value && typeof value === "object")
    .sort((left, right) => Number(right[1].savedAt || 0) - Number(left[1].savedAt || 0))
    .slice(0, CALENDAR_CACHE_MAX_ENTRIES);

  const nextStore = {};
  entries.forEach(([entryKey, value]) => {
    nextStore[entryKey] = value;
  });
  saveCalendarCacheStore(nextStore);
}

function loadFavorites() {
  const keys = [FAVORITES_KEY, FAVORITES_BACKUP_KEY];
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (!raw) {
        continue;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const mapped = {};
        parsed.forEach((entry) => {
          const id = Number(entry?.id || 0);
          if (id > 0) {
            mapped[id] = {
              id,
              type: entry?.type === "tv" ? "tv" : "movie",
              isAnime: Boolean(entry?.isAnime),
              title: String(entry?.title || ""),
              addedAt: Number(entry?.addedAt || Date.now()),
            };
          }
        });
        return mapped;
      }
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch {
      // continue
    }
  }
  return {};
}

function saveFavorites(value) {
  const payload = JSON.stringify(value);
  localStorage.setItem(FAVORITES_KEY, payload);
  localStorage.setItem(FAVORITES_BACKUP_KEY, payload);
  sessionStorage.setItem(FAVORITES_KEY, payload);
}

function loadLanguagePrefs() {
  try {
    const raw = localStorage.getItem(LANGUAGE_PREFS_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveLanguagePrefsMap(map) {
  const asObject = {};
  for (const [key, value] of map.entries()) {
    if (value) {
      asObject[key] = value;
    }
  }
  localStorage.setItem(LANGUAGE_PREFS_KEY, JSON.stringify(asObject));
}

function hydrateLanguagePrefsMap() {
  const saved = loadLanguagePrefs();
  Object.entries(saved).forEach(([id, lang]) => {
    if (lang) {
      state.selectedLanguageByMedia.set(Number(id), String(lang).toUpperCase());
    }
  });
}

function isCacheableApiUrl(url) {
  return !/\/stream\//i.test(url);
}

function readApiCache(url) {
  const entry = state.apiCache.get(url);
  if (!entry) {
    return null;
  }
  if (Date.now() >= entry.expiresAt) {
    state.apiCache.delete(url);
    return null;
  }
  return entry.value;
}

function writeApiCache(url, value) {
  state.apiCache.set(url, {
    expiresAt: Date.now() + API_CACHE_TTL_MS,
    value,
  });
}

function readStreamPayloadCache(path) {
  const key = String(path || "").trim();
  if (!key) {
    return null;
  }
  const entry = state.streamPayloadCache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() >= Number(entry.expiresAt || 0)) {
    state.streamPayloadCache.delete(key);
    return null;
  }
  return entry.value;
}

function writeStreamPayloadCache(path, value) {
  const key = String(path || "").trim();
  if (!key) {
    return;
  }
  state.streamPayloadCache.set(key, {
    expiresAt: Date.now() + STREAM_CACHE_TTL_MS,
    value,
  });

  if (state.streamPayloadCache.size > 80) {
    const entries = Array.from(state.streamPayloadCache.entries()).sort(
      (left, right) => Number(left[1].expiresAt || 0) - Number(right[1].expiresAt || 0)
    );
    const toDelete = entries.slice(0, state.streamPayloadCache.size - 80);
    toDelete.forEach(([cacheKey]) => state.streamPayloadCache.delete(cacheKey));
  }
}

async function fetchStreamJson(path, options = {}) {
  const safePath = String(path || "").startsWith("/") ? String(path) : `/${String(path || "")}`;
  const force = Boolean(options.force);
  const prefetch = Boolean(options.prefetch);
  const requestOptions = { ...options };
  delete requestOptions.force;
  delete requestOptions.prefetch;
  if (!force) {
    const cached = readStreamPayloadCache(safePath);
    if (cached) {
      return cached;
    }
  }

  if (!force && state.streamInFlight.has(safePath)) {
    return state.streamInFlight.get(safePath);
  }

  const directUrl = `${STREAM_API_BASE}${safePath}`;
  const proxyUrl = `${API_BASE}${safePath}`;
  const proxyOptions = {
    ...requestOptions,
    timeoutMs: prefetch ? STREAM_PROXY_PREFETCH_TIMEOUT_MS : STREAM_PROXY_TIMEOUT_MS,
    retryDelays: [],
  };
  const directOptions = {
    ...requestOptions,
    timeoutMs: prefetch ? STREAM_DIRECT_PREFETCH_TIMEOUT_MS : STREAM_DIRECT_TIMEOUT_MS,
    retryDelays: [],
  };

  const task = (async () => {
    try {
      const direct = await fetchJson(directUrl, directOptions);
      writeStreamPayloadCache(safePath, direct);
      return direct;
    } catch {
      const proxy = await fetchJson(proxyUrl, proxyOptions);
      writeStreamPayloadCache(safePath, proxy);
      return proxy;
    }
  })();

  if (!force) {
    state.streamInFlight.set(safePath, task);
  }

  try {
    return await task;
  } finally {
    if (!force) {
      state.streamInFlight.delete(safePath);
    }
  }
}

async function fetchJson(url, options = {}) {
  const force = Boolean(options.force);
  const signal = options.signal;
  const retryDelays = Array.isArray(options.retryDelays) ? options.retryDelays : RETRY_DELAYS_MS;
  const timeoutMs = Number(options.timeoutMs || 0) > 0 ? Number(options.timeoutMs) : REQUEST_TIMEOUT_MS;
  const canCache = isCacheableApiUrl(url);
  if (canCache && !force) {
    const cached = readApiCache(url);
    if (cached) {
      return cached;
    }
  }

  let lastError = null;

  for (let attempt = 0; attempt <= retryDelays.length; attempt += 1) {
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    if (signal) {
      if (signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      signal.addEventListener("abort", onAbort, { once: true });
    }
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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
        if (retryable && attempt < retryDelays.length) {
          await wait(retryDelays[attempt]);
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (canCache) {
        writeApiCache(url, data);
      }
      return data;
    } catch (error) {
      lastError = error;
      if (signal?.aborted) {
        throw error;
      }
      const retryable =
        String(error?.name || "") === "AbortError" ||
        String(error?.message || "").toLowerCase().includes("network");

      if (retryable && attempt < retryDelays.length) {
        await wait(retryDelays[attempt]);
        continue;
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }
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
