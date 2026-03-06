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
const ACTIVE_VIEW_SYNC_MS = 2 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15000;
const RETRY_DELAYS_MS = [350, 900];
const SEARCH_DEBOUNCE_MS = 180;
const API_CACHE_TTL_MS = 45 * 1000;
const STREAM_CACHE_TTL_MS = 2 * 60 * 1000;
const STREAM_PREFETCH_COOLDOWN_MS = 15 * 1000;
const PROGRESS_SAVE_INTERVAL_MS = 2400;
const HERO_ROTATE_MS = 8000;
const STARTUP_SPLASH_MIN_MS = 4650;
const STARTUP_SPLASH_MAX_MS = 8200;
const IMAGE_WARMUP_BATCH = 28;
const IMAGE_WARMUP_DELAY_MS = 12;
const INITIAL_IMAGE_WARMUP_LIMIT = 260;
const CALENDAR_YEAR_RANGE = 3;
const CALENDAR_CACHE_KEY = "zenix-calendar-cache-v1";
const CALENDAR_CACHE_MAX_ENTRIES = 8;
const INITIAL_CATALOG_WARMUP_PAGES = 2;
const BACKGROUND_CATALOG_DELAY_MS = 8;
const BACKGROUND_CATALOG_RENDER_EVERY = 8;
const CATALOG_RENDER_CHUNK_MIN = 28;
const CATALOG_RENDER_CHUNK_MAX = 68;
const MOBILE_VIEWPORT_MAX_WIDTH = 740;
const MOBILE_CATALOG_FIRST_PAINT = 66;
const MOBILE_CATALOG_CHUNK_MIN = 42;
const MOBILE_EAGER_IMAGE_LIMIT = 120;
const MOBILE_HIGH_PRIORITY_IMAGE_LIMIT = 52;
const DESKTOP_EAGER_IMAGE_LIMIT = 96;
const DESKTOP_HIGH_PRIORITY_IMAGE_LIMIT = 26;
const CRITICAL_COVER_PRIME_MOBILE = 140;
const CRITICAL_COVER_PRIME_DESKTOP = 84;
const CRITICAL_COVER_PRIME_WAIT_MS = 700;
const LIVE_RENDER_INTERACTION_GRACE_MS = 1200;
const SCROLL_SYNC_THRESHOLD_PX = 900;
const SCROLL_SYNC_DEBOUNCE_MS = 140;
const SCROLL_SYNC_MIN_INTERVAL_MS = 420;
const SEARCH_ASSIST_STEP_PAGES = 6;
const SEARCH_ASSIST_MAX_STEPS = 3;
const SEARCH_ASSIST_COOLDOWN_MS = 1200;
const STREAM_PROXY_TIMEOUT_MS = 6500;
const STREAM_PROXY_PREFETCH_TIMEOUT_MS = 4200;
const STREAM_DIRECT_TIMEOUT_MS = 5200;
const STREAM_DIRECT_PREFETCH_TIMEOUT_MS = 3600;
const EPISODE_SOON_VERIFY_TTL_MS = 3 * 60 * 1000;
const EPISODE_SOON_VERIFY_LIMIT = 40;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const HLS_JS_URL = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";
const HLS_JS_FALLBACK_URLS = ["/hls.min.js", HLS_JS_URL, "https://unpkg.com/hls.js@1.5.17/dist/hls.min.js"];
const HLS_MIME = "application/vnd.apple.mpegurl";
const DASH_MIME = "application/dash+xml";
const VIDEO_READY_TIMEOUT_MS = 15000;
const HLS_READY_TIMEOUT_MS = 28000;
const HLS_MANIFEST_TIMEOUT_MS = 30000;
const HEARTBEAT_INTERVAL_MS = 30 * 1000;
const HEARTBEAT_KEY = "zenix-client-id-v1";
const UI_PREFS_KEY = "zenix-ui-prefs-v1";
const RECENT_SEARCHES_KEY = "zenix-recent-searches-v1";
const BROWSE_STATE_KEY = "zenix-browse-state-v1";
const VIEW_SCROLL_KEY = "zenix-view-scroll-v1";
const RECENT_SEARCHES_LIMIT = 8;
const SCROLL_RESTORE_MAX = 8000;
const SLOW_NET_TYPES = new Set(["slow-2g", "2g", "3g"]);
const NEW_RELEASE_DAYS = 45;
const WATCH_HISTORY_MAX = 250;
const WATCH_HISTORY_MAX_AGE_MS = 120 * 24 * 60 * 60 * 1000;

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
  episodePlayableCache: new Map(),
  episodePlayableInFlight: new Map(),
  coverPreloadInFlight: new Map(),
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
  ignoreVideoErrorUntil: 0,
  manualSourceLock: false,
  manualSourceLockedIndex: -1,
  lastSyncAt: null,
  refreshFeedTimer: null,
  refreshTopTimer: null,
  pendingCatalogUpdate: false,
  userInteractingUntil: 0,
  pendingRenderTimer: 0,
  analyticsClientId: "",
  analyticsDisabled: false,
  analyticsInFlight: false,
  heartbeatTimer: null,
  heartbeatBound: false,
  startupSplashForceTimer: 0,
  activeViewSyncTimer: 0,
  modalScrollY: 0,
  modalScrollCaptured: false,
  postCloseTapGuardUntil: 0,
  scrollSyncTimer: 0,
  lastScrollSyncAt: 0,
  searchAssistInFlight: false,
  searchAssistQuery: "",
  searchAssistAt: 0,
  uiPrefs: loadUiPrefs(),
  recentSearches: loadRecentSearches(),
  viewScrollPositions: loadViewScrollPositions(),
  pendingScrollRestoreView: "",
  networkOnline: navigator.onLine !== false,
  cardViewportObserver: null,
};

const refs = {
  startupSplash: document.getElementById("startupSplash"),
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
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  searchSuggestPanel: document.getElementById("searchSuggestPanel"),
  networkBadge: document.getElementById("networkBadge"),
  scrollProgress: document.getElementById("scrollProgress"),
  scrollProgressFill: document.getElementById("scrollProgressFill"),
  backToTopBtn: document.getElementById("backToTopBtn"),
  navPills: Array.from(document.querySelectorAll(".nav-pill[data-view]")),
  quickLinks: Array.from(document.querySelectorAll(".quick-link[data-view-jump]")),
  filterChips: document.getElementById("filterChips"),
  sortSelect: document.getElementById("sortSelect"),
  refreshNowBtn: document.getElementById("refreshNowBtn"),
  shareBrowseBtn: document.getElementById("shareBrowseBtn"),
  clearContinueBtn: document.getElementById("clearContinueBtn"),
  clearListBtn: document.getElementById("clearListBtn"),
  toggleCompactBtn: document.getElementById("toggleCompactBtn"),
  toggleAutonextBtn: document.getElementById("toggleAutonextBtn"),
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
  playerSkipIntroBtn: document.getElementById("playerSkipIntroBtn"),
  playerFullscreenBtn: document.getElementById("playerFullscreenBtn"),
  playerPipBtn: document.getElementById("playerPipBtn"),
  playerSpeedSelect: document.getElementById("playerSpeedSelect"),
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

function replayStartupSplashAnimations() {
  if (!refs.startupSplash) {
    return;
  }
  refs.startupSplash.classList.add("is-replaying");
  void refs.startupSplash.offsetWidth;
  refs.startupSplash.classList.remove("is-replaying");
}

function startStartupSplash() {
  if (!refs.startupSplash) {
    return performance.now();
  }
  refs.startupSplash.hidden = false;
  refs.startupSplash.classList.remove("is-leaving");
  replayStartupSplashAnimations();
  document.body.classList.add("startup-lock");

  if (state.startupSplashForceTimer) {
    clearTimeout(state.startupSplashForceTimer);
  }
  state.startupSplashForceTimer = window.setTimeout(() => {
    completeStartupSplash(0, { force: true }).catch(() => {
      // fallback only
    });
  }, STARTUP_SPLASH_MAX_MS);

  return performance.now();
}

async function completeStartupSplash(startedAt = 0, options = {}) {
  if (!refs.startupSplash) {
    return;
  }

  const force = options.force === true;
  const elapsed = Math.max(0, performance.now() - Number(startedAt || 0));
  const wait = force ? 0 : Math.max(0, STARTUP_SPLASH_MIN_MS - elapsed);
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }

  if (state.startupSplashForceTimer) {
    clearTimeout(state.startupSplashForceTimer);
    state.startupSplashForceTimer = 0;
  }

  const splash = refs.startupSplash;
  if (splash.hidden) {
    document.body.classList.remove("startup-lock");
    return;
  }

  splash.classList.add("is-leaving");
  await new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) {
        return;
      }
      done = true;
      resolve();
    };
    splash.addEventListener(
      "transitionend",
      (event) => {
        if (event.target === splash) {
          finish();
        }
      },
      { once: true }
    );
    setTimeout(finish, 620);
  });

  splash.hidden = true;
  splash.classList.remove("is-leaving");
  document.body.classList.remove("startup-lock");
}

init();

async function init() {
  const splashStartedAt = startStartupSplash();
  pruneProgressEntries();
  applyUiPrefs({ syncControls: true });
  updateNetworkBadge();
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
  applySavedBrowseState();
  renderFilterChips();
  setActiveNav(state.view);
  state.pendingScrollRestoreView = state.view;

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

  await primeCriticalCovers(
    [...state.topDaily, ...state.catalog],
    isCompactViewport() ? CRITICAL_COVER_PRIME_MOBILE : CRITICAL_COVER_PRIME_DESKTOP,
    CRITICAL_COVER_PRIME_WAIT_MS
  ).catch(() => {
    // best effort only
  });

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
  await completeStartupSplash(splashStartedAt);
}

function bindFastPress(target, callback, options = {}) {
  if (!target || typeof callback !== "function") {
    return;
  }
  const dedupeMs = Math.max(90, Number(options.dedupeMs || 280));
  let lastTouchLikeAt = 0;
  target.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType === "mouse") {
        return;
      }
      if (Number(event.button || 0) !== 0) {
        return;
      }
      if (options.preventDefault !== false) {
        event.preventDefault();
      }
      if (options.stopPropagation === true) {
        event.stopPropagation();
      }
      lastTouchLikeAt = Date.now();
      callback(event);
    },
    { passive: false }
  );
  target.addEventListener("click", (event) => {
    if (Date.now() - lastTouchLikeAt < dedupeMs) {
      return;
    }
    callback(event);
  });
}

function bindSafeTap(target, callback, options = {}) {
  if (!target || typeof callback !== "function") {
    return;
  }

  const moveThreshold = Math.max(6, Number(options.moveThreshold || 14));
  const tapTimeoutMs = Math.max(120, Number(options.tapTimeoutMs || 640));
  const dedupeMs = Math.max(120, Number(options.dedupeMs || 360));

  let activePointerId = null;
  let startX = 0;
  let startY = 0;
  let startAt = 0;
  let moved = false;
  let lastTouchTapAt = 0;

  const clearPointer = () => {
    activePointerId = null;
    startX = 0;
    startY = 0;
    startAt = 0;
    moved = false;
  };

  target.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType === "mouse") {
        return;
      }
      if (Number(event.button || 0) !== 0) {
        return;
      }
      activePointerId = event.pointerId;
      startX = Number(event.clientX || 0);
      startY = Number(event.clientY || 0);
      startAt = Date.now();
      moved = false;
    },
    { passive: true }
  );

  target.addEventListener(
    "pointermove",
    (event) => {
      if (activePointerId === null || event.pointerId !== activePointerId) {
        return;
      }
      const deltaX = Math.abs(Number(event.clientX || 0) - startX);
      const deltaY = Math.abs(Number(event.clientY || 0) - startY);
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        moved = true;
      }
    },
    { passive: true }
  );

  target.addEventListener(
    "pointercancel",
    () => {
      clearPointer();
    },
    { passive: true }
  );

  target.addEventListener(
    "pointerup",
    (event) => {
      if (activePointerId === null || event.pointerId !== activePointerId) {
        return;
      }
      const duration = Date.now() - startAt;
      const shouldTrigger = !moved && duration <= tapTimeoutMs;
      clearPointer();
      if (!shouldTrigger) {
        return;
      }
      lastTouchTapAt = Date.now();
      callback(event);
    },
    { passive: true }
  );

  target.addEventListener("click", (event) => {
    if (Date.now() - lastTouchTapAt < dedupeMs) {
      return;
    }
    callback(event);
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
    bindFastPress(button, () => {
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
    updateSearchInputControls(nextQuery);
    renderSearchSuggestions(nextQuery);
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

      if (token === state.searchToken && state.query.length > 1) {
        await ensureSearchCoverage(token).catch(() => {
          // keep partial local list if background sync fails
        });
      }

      if (token === state.searchToken) {
        if (state.query.length > 1) {
          rememberSearchQuery(state.query);
        }
        renderAll();
      }
    }, SEARCH_DEBOUNCE_MS);
  });

  refs.searchInput.addEventListener("focus", () => {
    updateSearchInputControls(refs.searchInput.value || "");
    renderSearchSuggestions(String(refs.searchInput.value || "").trim());
  });

  refs.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      refs.searchSuggestPanel.hidden = true;
      return;
    }
    if (event.key !== "Enter") {
      return;
    }
    const query = String(refs.searchInput.value || "").trim();
    if (query.length > 1) {
      rememberSearchQuery(query);
    }
    refs.searchSuggestPanel.hidden = true;
  });

  if (refs.searchSuggestPanel) {
    refs.searchSuggestPanel.addEventListener("click", (event) => {
      const target = event.target instanceof HTMLElement ? event.target.closest("[data-suggest-query]") : null;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const query = String(target.dataset.suggestQuery || "").trim();
      if (!query) {
        return;
      }
      applySearchQuery(query, { persist: true, focus: true });
    });
  }

  if (refs.clearSearchBtn) {
    bindFastPress(refs.clearSearchBtn, () => {
      applySearchQuery("", { persist: false, focus: true });
      refs.searchSuggestPanel.hidden = true;
    });
  }

  refs.sortSelect.addEventListener("change", (event) => {
    state.sortBy = String(event.target.value || "featured");
    renderAll();
  });

  bindFastPress(refs.refreshNowBtn, () => {
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

  bindFastPress(refs.shareBrowseBtn, () => {
    copyBrowseLink().catch(() => {
      showToast("Impossible de copier le lien de cette vue.", true);
    });
  });

  bindFastPress(refs.clearContinueBtn, () => {
    if (!window.confirm("Vider tout l'historique Continuer ?")) {
      return;
    }
    state.progress = {};
    saveProgress(state.progress);
    renderAll();
    showToast("Historique 'Continuer' vide.");
  });

  bindFastPress(refs.clearListBtn, () => {
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

  bindFastPress(refs.toggleCompactBtn, () => {
    state.uiPrefs.compactCards = !Boolean(state.uiPrefs.compactCards);
    saveUiPrefs(state.uiPrefs);
    applyUiPrefs({ syncControls: true });
    renderAll();
  });

  bindFastPress(refs.toggleAutonextBtn, () => {
    state.uiPrefs.autoNextEpisode = !isAutoNextEnabled();
    saveUiPrefs(state.uiPrefs);
    applyUiPrefs({ syncControls: true });
    showToast(isAutoNextEnabled() ? "Auto-episode active." : "Auto-episode desactive.");
  });

  bindFastPress(refs.heroPlayBtn, () => {
    if (!state.activeHeroId) {
      return;
    }
    openPlayer(state.activeHeroId).catch(() => {
      showMessage("Lecture indisponible pour ce titre.", true);
    });
  });

  bindFastPress(refs.heroInfoBtn, () => {
    if (!state.activeHeroId) {
      return;
    }
    openDetails(state.activeHeroId).catch(() => {
      showMessage("Impossible de charger la fiche detaillee.", true);
    });
  });

  bindFastPress(refs.heroTrailerBtn, () => {
    if (!state.activeHeroId) {
      return;
    }
    openTrailerFromHero(state.activeHeroId).catch(() => {
      showMessage("Bande-annonce indisponible.", true);
    });
  });

  bindFastPress(refs.heroRandomBtn, () => {
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

  bindFastPress(refs.loadMoreBtn, () => {
    loadMoreCatalog().catch(() => {
      updateLoadMoreButton();
    });
  });

  bindFastPress(refs.backToTopBtn, () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  bindFastPress(refs.detailCloseBtn, () => {
    closeDetails();
  }, { stopPropagation: true });
  refs.detailModal.addEventListener("click", (event) => {
    if (event.target === refs.detailModal) {
      closeDetails();
    }
  });

  bindFastPress(refs.detailPlayBtn, () => {
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

  bindFastPress(refs.detailTrailerBtn, () => {
    if (!state.selectedDetailId) {
      return;
    }
    toggleTrailerInline(state.selectedDetailId).catch(() => {
      showMessage("Bande-annonce indisponible.", true);
    });
  });

  bindFastPress(refs.detailFavoriteBtn, () => {
    if (!state.selectedDetailId) {
      return;
    }
    toggleFavorite(state.selectedDetailId);
    updateDetailFavoriteButton(state.selectedDetailId);
  });

  bindFastPress(refs.detailShareBtn, () => {
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
    verifySoonEpisodesForSeason(id, season, episodes)
      .then((changed) => {
        if (!changed || state.selectedDetailId !== id) {
          return;
        }
        if (Number(refs.detailSeasonSelect.value || "0") !== season) {
          return;
        }
        const currentEpisode = Number(refs.detailEpisodeSelect.value || selectedEpisode);
        populateEpisodeSelect(refs.detailEpisodeSelect, episodes, currentEpisode);
      })
      .catch(() => {
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

  bindFastPress(refs.playerCloseBtn, () => {
    closePlayer();
  }, { stopPropagation: true });
  refs.playerOverlay.addEventListener("click", (event) => {
    if (event.target === refs.playerOverlay) {
      closePlayer();
    }
  });

  refs.playerSeasonSelect.addEventListener("change", () => {
    if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
      return;
    }
    const mediaId = Number(state.nowPlaying.id || 0);
    const season = Number(refs.playerSeasonSelect.value || "1");
    const seasons = state.seasonsCache.get(mediaId) || [];
    const episodes = getEpisodesForSeason(seasons, season);
    const episode = getFirstPlayableEpisode(episodes);
    populateEpisodeSelect(refs.playerEpisodeSelect, episodes, episode);
    const language = String(refs.playerLanguageSelect?.value || "").trim();
    verifySoonEpisodesForSeason(mediaId, season, episodes)
      .then((changed) => {
        if (!changed || Number(state.nowPlaying?.id || 0) !== mediaId) {
          return;
        }
        if (Number(refs.playerSeasonSelect.value || "0") !== season) {
          return;
        }
        const currentEpisode = Number(refs.playerEpisodeSelect.value || episode);
        populateEpisodeSelect(refs.playerEpisodeSelect, episodes, currentEpisode);
      })
      .catch(() => {
        // no-op
      });
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

  bindFastPress(refs.playerSourceApplyBtn, () => {
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
    if (shouldIgnoreVideoErrorFallback()) {
      return;
    }
    trySwitchToNextSource().catch(() => {
      setPlayerStatus("Erreur video detectee. Choisis un autre titre.", true);
    });
  });
  bindFastPress(refs.playerRestartBtn, async () => {
    refs.playerVideo.currentTime = 0;
    try {
      await refs.playerVideo.play();
    } catch {
      // no-op
    }
  });
  bindFastPress(refs.playerRewindBtn, () => {
    refs.playerVideo.currentTime = Math.max(0, Number(refs.playerVideo.currentTime || 0) - 10);
  });
  bindFastPress(refs.playerForwardBtn, () => {
    const duration = Number(refs.playerVideo.duration || 0);
    const next = Number(refs.playerVideo.currentTime || 0) + 10;
    refs.playerVideo.currentTime = Number.isFinite(duration) && duration > 0 ? Math.min(duration, next) : next;
  });
  bindFastPress(refs.playerSkipIntroBtn, () => {
    const duration = Number(refs.playerVideo.duration || 0);
    const next = Number(refs.playerVideo.currentTime || 0) + 85;
    refs.playerVideo.currentTime = Number.isFinite(duration) && duration > 0 ? Math.min(duration, next) : next;
  });
  bindFastPress(refs.playerFullscreenBtn, () => {
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
  bindFastPress(refs.playerPipBtn, async () => {
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

  refs.playerSpeedSelect?.addEventListener("change", () => {
    const rate = Number(refs.playerSpeedSelect.value || "1");
    applyPlayerRate(rate, { save: true });
  });

  refs.playerVideo.addEventListener("volumechange", () => {
    state.uiPrefs.playerVolume = Math.max(0, Math.min(1, Number(refs.playerVideo.volume || 0)));
    state.uiPrefs.playerMuted = Boolean(refs.playerVideo.muted);
    saveUiPrefs(state.uiPrefs);
  });

  refs.playerVideo.addEventListener("ratechange", () => {
    const rate = Number(refs.playerVideo.playbackRate || 1);
    if (!Number.isFinite(rate)) {
      return;
    }
    state.uiPrefs.playbackRate = Math.min(2, Math.max(0.75, rate));
    saveUiPrefs(state.uiPrefs);
    if (refs.playerSpeedSelect) {
      refs.playerSpeedSelect.value = String(state.uiPrefs.playbackRate);
    }
  });

  refs.playerVideo.addEventListener("dblclick", () => {
    if (typeof refs.playerVideo.requestFullscreen === "function") {
      refs.playerVideo.requestFullscreen().catch(() => {
        // no-op
      });
    }
  });

  window.addEventListener("keydown", (event) => {
    bumpInteractionWindow(850);
    const target = event.target;
    const typing =
      target instanceof HTMLElement &&
      (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
    if (event.key === "/" && document.activeElement !== refs.searchInput) {
      if (!typing) {
        event.preventDefault();
        refs.searchInput.focus();
      }
    }

    if (!refs.playerOverlay.hidden && !typing) {
      const key = String(event.key || "").toLowerCase();
      if (key === " " || key === "k") {
        event.preventDefault();
        if (refs.playerVideo.paused) {
          refs.playerVideo.play().catch(() => {
            // no-op
          });
        } else {
          refs.playerVideo.pause();
        }
      } else if (key === "j" || key === "arrowleft") {
        event.preventDefault();
        refs.playerVideo.currentTime = Math.max(0, Number(refs.playerVideo.currentTime || 0) - 10);
      } else if (key === "l" || key === "arrowright") {
        event.preventDefault();
        const duration = Number(refs.playerVideo.duration || 0);
        const next = Number(refs.playerVideo.currentTime || 0) + 10;
        refs.playerVideo.currentTime = Number.isFinite(duration) && duration > 0 ? Math.min(duration, next) : next;
      } else if (key === "m") {
        event.preventDefault();
        refs.playerVideo.muted = !refs.playerVideo.muted;
      } else if (key === "f") {
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {
            // no-op
          });
        } else if (typeof refs.playerVideo.requestFullscreen === "function") {
          refs.playerVideo.requestFullscreen().catch(() => {
            // no-op
          });
        }
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

  const swallowGhostTap = (event) => {
    if (!isPostCloseTapGuardActive()) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
  };

  window.addEventListener("pointerdown", swallowGhostTap, true);
  window.addEventListener("click", swallowGhostTap, true);
  window.addEventListener("mousedown", swallowGhostTap, true);
  window.addEventListener("mouseup", swallowGhostTap, true);
  window.addEventListener("pointerup", swallowGhostTap, true);
  window.addEventListener("touchstart", swallowGhostTap, { capture: true, passive: false });
  window.addEventListener("touchend", swallowGhostTap, { capture: true, passive: false });

  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      refs.searchSuggestPanel.hidden = true;
      return;
    }
    if (target.closest(".search-wrap")) {
      return;
    }
    refs.searchSuggestPanel.hidden = true;
  });

  const markInteraction = () => {
    bumpInteractionWindow();
  };
  window.addEventListener("pointerdown", markInteraction, { passive: true });
  window.addEventListener("touchstart", markInteraction, { passive: true });
  window.addEventListener("wheel", markInteraction, { passive: true });

  window.addEventListener(
    "scroll",
    () => {
      bumpInteractionWindow(520);
      updateScrollUI();
      consumePendingCatalogUpdate();
      scheduleScrollDrivenCatalogSync();
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      bumpInteractionWindow(420);
      updateNetworkBadge();
      updateScrollUI();
      consumePendingCatalogUpdate();
      scheduleScrollDrivenCatalogSync({ immediate: true });
    }
  });

  window.addEventListener("online", () => {
    state.networkOnline = true;
    updateNetworkBadge();
    showToast("Connexion retablie. Sync en cours.");
    syncCurrentViewData("online").catch(() => {
      // best effort
    });
  });

  window.addEventListener("offline", () => {
    state.networkOnline = false;
    updateNetworkBadge();
    showToast("Mode hors ligne actif.", true);
  });

  syncUiToggleButtons();
  updateSearchInputControls(refs.searchInput?.value || "");
  updateScrollUI();
}

function handleViewSelection(view) {
  rememberCurrentViewScroll();
  const normalizedView = view === "catalog" || view === "search" ? "all" : view;
  state.view = normalizedView;
  if (isCatalogCategoryView(normalizedView)) {
    state.chip = normalizedView;
  } else {
    state.chip = "all";
  }
  if (refs.searchInput) {
    refs.searchInput.value = normalizedView === "calendar" ? state.calendarQuery : state.query;
    updateSearchInputControls(refs.searchInput.value || "");
  }
  refs.searchSuggestPanel.hidden = true;
  setActiveNav(normalizedView);
  renderFilterChips();
  state.pendingScrollRestoreView = normalizedView;
  renderAll();

  if (normalizedView !== "calendar") {
    syncCurrentViewData("manual").catch(() => {
      // best effort only
    });
  }

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

function isCatalogBrowseView(view) {
  return view === "all" || view === "latest" || view === "popular" || isCatalogCategoryView(view);
}

function getCatalogSyncProfile(view = resolveCatalogViewForSearch()) {
  const compact = isCompactViewport();
  const slow = isSlowConnection();
  const tune = (profile) => {
    if (!slow) {
      return profile;
    }
    return {
      initialPages: Math.max(2, Math.floor(Number(profile.initialPages || 2) * 0.7)),
      activeBatch: Math.max(2, Math.floor(Number(profile.activeBatch || 2) * 0.65)),
      manualBatch: Math.max(3, Math.floor(Number(profile.manualBatch || 3) * 0.7)),
      scrollBatch: Math.max(2, Math.floor(Number(profile.scrollBatch || 2) * 0.65)),
    };
  };
  const defaults = compact
    ? { initialPages: 4, activeBatch: 5, manualBatch: 8, scrollBatch: 6 }
    : { initialPages: 3, activeBatch: 4, manualBatch: 7, scrollBatch: 5 };

  if (view === "movie" || view === "tv" || view === "anime") {
    return tune(
      compact
      ? { initialPages: 6, activeBatch: 7, manualBatch: 10, scrollBatch: 9 }
      : { initialPages: 5, activeBatch: 6, manualBatch: 9, scrollBatch: 8 }
    );
  }
  if (view === "latest" || view === "popular") {
    return tune(
      compact
      ? { initialPages: 5, activeBatch: 6, manualBatch: 9, scrollBatch: 8 }
      : { initialPages: 4, activeBatch: 5, manualBatch: 8, scrollBatch: 7 }
    );
  }
  return tune(defaults);
}

function getLoadedCatalogPage() {
  return Math.max(0, Number(state.page || 0), Number(state.catalogSyncPage || 0));
}

function resolveCatalogViewForSearch() {
  const query = String(state.query || "").trim();
  if (query.length === 0) {
    return state.view;
  }
  if (state.view === "all" || isCatalogCategoryView(state.view)) {
    return state.view;
  }
  return "all";
}

function isSlowConnection() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) {
    return false;
  }
  if (connection.saveData === true) {
    return true;
  }
  const effectiveType = String(connection.effectiveType || "").toLowerCase();
  return SLOW_NET_TYPES.has(effectiveType);
}

function isAutoNextEnabled() {
  return state.uiPrefs.autoNextEpisode !== false;
}

function syncUiToggleButtons() {
  if (refs.toggleCompactBtn) {
    refs.toggleCompactBtn.textContent = `Mode compact: ${state.uiPrefs.compactCards ? "ON" : "OFF"}`;
  }
  if (refs.toggleAutonextBtn) {
    refs.toggleAutonextBtn.textContent = `Auto-episode: ${isAutoNextEnabled() ? "ON" : "OFF"}`;
  }
}

function applyUiPrefs(options = {}) {
  const compact = Boolean(state.uiPrefs.compactCards);
  document.body.classList.toggle("compact-cards", compact);

  const rate = Number(state.uiPrefs.playbackRate || 1);
  if (refs.playerSpeedSelect) {
    const normalized = Number.isFinite(rate) && rate >= 0.5 && rate <= 3 ? rate : 1;
    refs.playerSpeedSelect.value = String(normalized);
  }

  if (options.syncControls !== false) {
    syncUiToggleButtons();
  }
}

function applyPlayerRate(rate, options = {}) {
  const normalized = Number.isFinite(rate) ? Math.min(2, Math.max(0.75, rate)) : 1;
  refs.playerVideo.playbackRate = normalized;
  if (refs.playerSpeedSelect) {
    refs.playerSpeedSelect.value = String(normalized);
  }
  if (options.save !== false) {
    state.uiPrefs.playbackRate = normalized;
    saveUiPrefs(state.uiPrefs);
  }
}

function updateNetworkBadge() {
  if (!refs.networkBadge) {
    return;
  }
  const online = navigator.onLine !== false;
  state.networkOnline = online;
  refs.networkBadge.textContent = online ? "En ligne" : "Hors ligne";
  refs.networkBadge.classList.toggle("offline", !online);
}

function updateScrollUI() {
  const y = Math.max(0, Number(window.scrollY || 0));
  const viewport = Math.max(1, Number(window.innerHeight || 1));
  const total = Math.max(0, Number(document.documentElement?.scrollHeight || 0) - viewport);
  const progress = total > 0 ? Math.max(0, Math.min(1, y / total)) : 0;
  if (refs.scrollProgressFill) {
    refs.scrollProgressFill.style.width = `${(progress * 100).toFixed(2)}%`;
  }
  if (refs.backToTopBtn) {
    refs.backToTopBtn.hidden = y < 420;
  }
}

function updateSearchInputControls(value = "") {
  const hasValue = String(value || "").trim().length > 0;
  if (refs.clearSearchBtn) {
    refs.clearSearchBtn.hidden = !hasValue;
  }
}

function rememberSearchQuery(value) {
  const query = String(value || "").trim();
  if (query.length < 2) {
    return;
  }
  const next = [query, ...state.recentSearches.filter((entry) => entry.toLowerCase() !== query.toLowerCase())].slice(
    0,
    RECENT_SEARCHES_LIMIT
  );
  state.recentSearches = next;
  saveRecentSearches(next);
}

function renderSearchSuggestions(value = "") {
  if (!refs.searchSuggestPanel) {
    return;
  }
  const query = String(value || "").trim();
  const rows = [];

  if (!query) {
    state.recentSearches.slice(0, RECENT_SEARCHES_LIMIT).forEach((entry) => {
      rows.push({ title: entry, meta: "Recherche recente", query: entry });
    });
  } else {
    const queryKey = normalizeTitleKey(query);
    const candidates = getVisibleCatalog()
      .filter((item) => normalizeTitleKey(item?.title || "").includes(queryKey))
      .slice(0, 6);
    candidates.forEach((item) => {
      rows.push({
        title: item.title,
        meta: `${getItemTypeLabel(item)}${item?.isAnime ? " - Anime" : ""}`,
        query: item.title,
      });
    });
  }

  refs.searchSuggestPanel.innerHTML = "";
  if (rows.length === 0) {
    refs.searchSuggestPanel.hidden = true;
    return;
  }

  const fragment = document.createDocumentFragment();
  rows.forEach((row) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-suggest-item";
    button.dataset.suggestQuery = row.query;
    button.innerHTML = `
      <span class="search-suggest-title">${escapeHtml(row.title)}</span>
      <span class="search-suggest-meta">${escapeHtml(row.meta)}</span>
    `;
    fragment.appendChild(button);
  });
  refs.searchSuggestPanel.appendChild(fragment);
  refs.searchSuggestPanel.hidden = false;
}

function applySearchQuery(query, options = {}) {
  const next = String(query || "").trim();
  refs.searchInput.value = next;
  updateSearchInputControls(next);
  if (state.view === "calendar") {
    state.calendarQuery = next;
    if (refs.calendarSearchInput) {
      refs.calendarSearchInput.value = next;
    }
    if (options.persist !== false) {
      rememberSearchQuery(next);
    }
    renderCalendarSection();
    syncBrowseRoute({ replace: true });
    if (options.focus !== false) {
      refs.searchInput.focus();
    }
    return;
  }

  state.query = next;
  if (options.persist !== false) {
    rememberSearchQuery(next);
  }
  if (searchDebounce) {
    clearTimeout(searchDebounce);
    searchDebounce = null;
  }
  if (state.searchAbortController) {
    state.searchAbortController.abort();
    state.searchAbortController = null;
  }
  state.searchToken += 1;
  renderAll();
  if (next.length > 1) {
    const token = state.searchToken;
    handleRemoteSearch(token)
      .then(() => ensureSearchCoverage(token, { force: true }))
      .catch(() => {
        // best effort
      })
      .finally(() => {
        if (token === state.searchToken) {
          renderAll();
        }
      });
  }
  if (options.focus !== false) {
    refs.searchInput.focus();
  }
}

function rememberCurrentViewScroll() {
  if (!refs.playerOverlay.hidden || !refs.detailModal.hidden) {
    return;
  }
  const safeView = String(state.view || "all");
  state.viewScrollPositions[safeView] = Math.max(0, Number(window.scrollY || 0));
  saveViewScrollPositions(state.viewScrollPositions);
}

function restoreScrollForView(view) {
  const y = Number(state.viewScrollPositions[String(view || "all")] || 0);
  const safeY = Math.max(0, Math.min(SCROLL_RESTORE_MAX, y));
  requestAnimationFrame(() => {
    window.scrollTo(0, safeY);
    updateScrollUI();
  });
}

function setHidden(node, hidden) {
  if (node) {
    node.hidden = Boolean(hidden);
  }
}

function isCompactViewport() {
  if (typeof window.matchMedia === "function") {
    return window.matchMedia(`(max-width: ${MOBILE_VIEWPORT_MAX_WIDTH}px)`).matches;
  }
  return Number(window.innerWidth || 0) <= MOBILE_VIEWPORT_MAX_WIDTH;
}

function getCardImageProfile() {
  const slow = isSlowConnection();
  if (isCompactViewport()) {
    return {
      eagerLimit: slow ? Math.max(34, Math.floor(MOBILE_EAGER_IMAGE_LIMIT * 0.55)) : MOBILE_EAGER_IMAGE_LIMIT,
      highPriorityLimit: slow
        ? Math.max(16, Math.floor(MOBILE_HIGH_PRIORITY_IMAGE_LIMIT * 0.6))
        : MOBILE_HIGH_PRIORITY_IMAGE_LIMIT,
    };
  }
  return {
    eagerLimit: slow ? Math.max(32, Math.floor(DESKTOP_EAGER_IMAGE_LIMIT * 0.58)) : DESKTOP_EAGER_IMAGE_LIMIT,
    highPriorityLimit: slow
      ? Math.max(12, Math.floor(DESKTOP_HIGH_PRIORITY_IMAGE_LIMIT * 0.62))
      : DESKTOP_HIGH_PRIORITY_IMAGE_LIMIT,
  };
}

function bumpInteractionWindow(ms = LIVE_RENDER_INTERACTION_GRACE_MS) {
  const delay = Math.max(120, Number(ms || LIVE_RENDER_INTERACTION_GRACE_MS));
  const until = Date.now() + delay;
  if (until > state.userInteractingUntil) {
    state.userInteractingUntil = until;
  }

  if (state.pendingRenderTimer) {
    clearTimeout(state.pendingRenderTimer);
  }
  state.pendingRenderTimer = window.setTimeout(() => {
    state.pendingRenderTimer = 0;
    consumePendingCatalogUpdate();
  }, delay + 140);
}

function shouldRenderLiveCatalogUpdates() {
  if (!refs.playerOverlay.hidden || !refs.detailModal.hidden) {
    return false;
  }
  if (document.visibilityState === "hidden") {
    return false;
  }
  if (Date.now() < Number(state.userInteractingUntil || 0)) {
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

function isNearCatalogBottom(thresholdPx = SCROLL_SYNC_THRESHOLD_PX) {
  const viewport = Number(window.innerHeight || 0);
  const scrollY = Number(window.scrollY || window.pageYOffset || 0);
  const doc = document.documentElement;
  const body = document.body;
  const scrollHeight = Math.max(
    Number(doc?.scrollHeight || 0),
    Number(body?.scrollHeight || 0),
    Number(doc?.offsetHeight || 0)
  );
  if (scrollHeight <= 0 || viewport <= 0) {
    return false;
  }
  return scrollHeight - (scrollY + viewport) <= Math.max(260, Number(thresholdPx || SCROLL_SYNC_THRESHOLD_PX));
}

async function syncCatalogBatch(reason = "active", options = {}) {
  const activeView = resolveCatalogViewForSearch();
  if (!isCatalogBrowseView(activeView)) {
    return false;
  }
  if (state.loadingCatalog || state.backgroundSyncRunning || !state.hasMore) {
    return false;
  }
  const loadedPage = getLoadedCatalogPage();
  const totalPages = Math.max(loadedPage, Number(state.totalPages || 0));
  if (totalPages <= loadedPage) {
    return false;
  }

  const profile = getCatalogSyncProfile(activeView);
  const preferredBatch = Number(options.batchPages || 0);
  let batchPages = preferredBatch > 0 ? preferredBatch : Number(profile.activeBatch || 4);
  if (reason === "manual") {
    batchPages = Math.max(batchPages, Number(profile.manualBatch || batchPages));
  } else if (reason === "scroll") {
    batchPages = Math.max(batchPages, Number(profile.scrollBatch || batchPages));
  } else if (reason === "search-assist") {
    batchPages = Math.max(batchPages, SEARCH_ASSIST_STEP_PAGES);
  }
  batchPages = Math.max(1, Math.round(batchPages));

  const startPage = loadedPage + 1;
  const endPage = Math.min(totalPages, startPage + batchPages - 1);
  if (startPage > endPage) {
    return false;
  }
  await startBackgroundCatalogSync(startPage, endPage);
  return true;
}

function scheduleScrollDrivenCatalogSync(options = {}) {
  const immediate = options.immediate === true;
  const force = options.force === true;
  const run = () => {
    state.scrollSyncTimer = 0;
    syncCatalogForScroll({ force })
      .catch(() => {
        // best effort only
      });
  };

  if (state.scrollSyncTimer) {
    if (immediate) {
      clearTimeout(state.scrollSyncTimer);
      state.scrollSyncTimer = 0;
      run();
    }
    return;
  }

  if (immediate) {
    run();
    return;
  }

  state.scrollSyncTimer = window.setTimeout(run, SCROLL_SYNC_DEBOUNCE_MS);
}

async function syncCatalogForScroll(options = {}) {
  if (!refs.playerOverlay.hidden || !refs.detailModal.hidden) {
    return;
  }
  if (state.view === "calendar" || state.view === "top" || state.view === "list" || state.view === "info") {
    return;
  }
  if (!isCatalogBrowseView(resolveCatalogViewForSearch())) {
    return;
  }
  if (!isNearCatalogBottom()) {
    return;
  }
  const now = Date.now();
  if (!options.force && now - Number(state.lastScrollSyncAt || 0) < SCROLL_SYNC_MIN_INTERVAL_MS) {
    return;
  }
  state.lastScrollSyncAt = now;

  if (state.query.trim().length > 1) {
    await ensureSearchCoverage(state.searchToken, { force: true });
    if (refs.playerOverlay.hidden && refs.detailModal.hidden) {
      renderAll();
    }
    return;
  }
  const didSync = await syncCatalogBatch("scroll");
  if (didSync && refs.playerOverlay.hidden && refs.detailModal.hidden) {
    renderAll();
  }
}

async function ensureSearchCoverage(token, options = {}) {
  const query = String(state.query || "").trim();
  if (query.length < 2 || token !== state.searchToken) {
    return;
  }
  if (state.searchAssistInFlight || state.loadingCatalog) {
    return;
  }
  const now = Date.now();
  if (
    !options.force &&
    state.searchAssistQuery === query &&
    now - Number(state.searchAssistAt || 0) < SEARCH_ASSIST_COOLDOWN_MS
  ) {
    return;
  }

  state.searchAssistInFlight = true;
  state.searchAssistQuery = query;
  state.searchAssistAt = now;

  try {
    let step = 0;
    while (
      step < SEARCH_ASSIST_MAX_STEPS &&
      token === state.searchToken &&
      query === String(state.query || "").trim() &&
      state.hasMore
    ) {
      const localCount = getVisibleCatalog().length;
      if (localCount > 0 && !options.force) {
        break;
      }
      const didSync = await syncCatalogBatch("search-assist", { batchPages: SEARCH_ASSIST_STEP_PAGES });
      if (!didSync) {
        break;
      }
      step += 1;
      if (getVisibleCatalog().length > 0 && !options.force) {
        break;
      }
    }
  } finally {
    state.searchAssistInFlight = false;
  }
}

function activatePostCloseTapGuard(ms = 820) {
  const delay = Math.max(420, Number(ms || 820));
  state.postCloseTapGuardUntil = Date.now() + delay;
}

function isPostCloseTapGuardActive() {
  return Date.now() < Number(state.postCloseTapGuardUntil || 0);
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

  bindFastPress(refs.calendarRefreshBtn, () => {
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
    card.className = "calendar-merged-card media-card calendar-media-card";
    const detailId = resolveCalendarDetailId(entry);
    const hasDetails = detailId > 0;
    const linkLabel = hasDetails ? "Voir details" : "Bientot";
    const typeLabel = typeMap[String(entry.type || entry.kind || "").toLowerCase()] || "Titre";
    const poster = normalizeImageUrl(entry.poster || "");
    const dateLabel =
      entry.source === "purstream"
        ? `${String(entry.dayNumber || "").padStart(2, "0")}/${String(state.calendarMonth).padStart(2, "0")}`
        : entry.dateLabel || entry.dayName || "Sans date";
    card.innerHTML = `
      <div class="media-shell">
        <div class="media-thumb calendar-media-thumb">
          <img
            src="${escapeHtml(poster)}"
            alt="${escapeHtml(entry.title || "Affiche")}"
            loading="${index < 24 ? "eager" : "lazy"}"
            decoding="async"
            fetchpriority="${index < 10 ? "high" : "auto"}"
          />
          <span class="calendar-date-pill">${escapeHtml(dateLabel)}</span>
          ${
            hasDetails
              ? `<button type="button" class="media-open" data-calendar-open="${detailId}" aria-label="Voir les details de ${escapeHtml(entry.title || "ce titre")}"></button>`
              : ""
          }
        </div>
        <div class="media-body calendar-merged-body">
          <button type="button" class="title-link media-title-link" data-calendar-open="${detailId}" ${hasDetails ? "" : "disabled"}>${escapeHtml(entry.title || "Sans titre")}</button>
          <p class="media-meta calendar-merged-meta">
            <span class="meta-pill">${escapeHtml(typeLabel)}</span>
            <span class="meta-dot" aria-hidden="true"></span>
            <span>${escapeHtml(entry.language || "Auto")}</span>
            <span class="meta-dot" aria-hidden="true"></span>
            <span>${escapeHtml(hasDetails ? "Disponible" : "Soon")}</span>
          </p>
          <div class="calendar-merged-actions">
            ${
              hasDetails
                ? `<button type="button" class="btn-small btn-info" data-calendar-open="${detailId}">${linkLabel}</button>`
                : `<span class="btn-small btn-info is-disabled">${linkLabel}</span>`
            }
          </div>
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
      mergedRows.map((entry) => ({ poster: normalizeImageUrl(entry.poster || ""), backdrop: "" })),
      80
    );
  }

  refs.calendarMergedGrid.querySelectorAll("[data-calendar-open]").forEach((button) => {
    bindFastPress(button, () => {
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
  const value = normalizeImageUrl(url);
  if (!value || value.startsWith("data:") || state.warmedImages.has(value)) {
    return;
  }
  state.warmedImages.add(value);
  state.imageWarmQueue.push(value);
  if (state.imageWarmQueue.length > 1400) {
    state.imageWarmQueue = state.imageWarmQueue.slice(0, 1400);
  }
  pumpWarmImageQueue();
}

function primeImageUrl(url, timeoutMs = 4200) {
  const value = normalizeImageUrl(url);
  if (!value || value.startsWith("data:")) {
    return Promise.resolve(false);
  }
  if (state.coverPreloadInFlight.has(value)) {
    return state.coverPreloadInFlight.get(value);
  }
  if (state.warmedImages.has(value)) {
    return Promise.resolve(true);
  }

  state.warmedImages.add(value);
  const task = new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    let settled = false;
    const finish = (ok) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeoutId);
      if (!ok) {
        state.warmedImages.delete(value);
      }
      resolve(ok);
    };
    const timeoutId = window.setTimeout(() => finish(false), Math.max(1200, Number(timeoutMs || 0)));
    image.addEventListener("load", () => finish(true), { once: true });
    image.addEventListener("error", () => finish(false), { once: true });
    image.src = value;
    if (image.complete) {
      finish(true);
    }
  }).finally(() => {
    state.coverPreloadInFlight.delete(value);
  });

  state.coverPreloadInFlight.set(value, task);
  return task;
}

function collectCoverUrls(items, limit = 36) {
  if (!Array.isArray(items) || items.length === 0 || limit <= 0) {
    return [];
  }
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (out.length >= limit) {
      break;
    }
    if (!item) {
      continue;
    }
    const backdrop = normalizeImageUrl(item.backdrop || "");
    const poster = normalizeImageUrl(item.poster || "");
    const primary = normalizeImageUrl(resolvePreferredCover(item));
    [primary, backdrop, poster].forEach((url) => {
      if (!url || seen.has(url) || out.length >= limit) {
        return;
      }
      seen.add(url);
      out.push(url);
    });
  }
  return out;
}

async function primeCriticalCovers(items, limit = 36, waitBudgetMs = 0) {
  const urls = collectCoverUrls(items, Math.max(0, Number(limit || 0)));
  if (urls.length === 0) {
    return;
  }
  const jobs = urls.map((url) => primeImageUrl(url, waitBudgetMs > 0 ? waitBudgetMs + 1800 : 3600));
  if (waitBudgetMs > 0) {
    await Promise.race([
      Promise.allSettled(jobs),
      wait(Math.max(140, Number(waitBudgetMs || 0))),
    ]);
  }
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
    const compact = isCompactViewport();
    const batchSize = compact ? IMAGE_WARMUP_BATCH + 12 : IMAGE_WARMUP_BATCH;
    const delayMs = compact ? Math.max(10, IMAGE_WARMUP_DELAY_MS - 18) : IMAGE_WARMUP_DELAY_MS;
    let count = 0;
    while (state.imageWarmQueue.length > 0 && count < batchSize) {
      const next = state.imageWarmQueue.shift();
      if (!next) {
        continue;
      }
      primeImageUrl(next, compact ? 3600 : 4800).catch(() => {
        // best effort only
      });
      count += 1;
    }

    if (state.imageWarmQueue.length > 0) {
      state.imageWarmTimer = window.setTimeout(pump, delayMs);
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

async function syncCurrentViewData(reason = "interval") {
  if (state.view === "calendar") {
    await ensureCalendarData().catch(() => {
      // best effort sync only
    });
    return;
  }

  const activeView = resolveCatalogViewForSearch();
  const shouldSyncCatalog =
    activeView === "all" ||
    isCatalogCategoryView(activeView) ||
    activeView === "latest" ||
    activeView === "popular" ||
    state.view === "top" ||
    state.view === "list" ||
    state.view === "info";

  if (shouldSyncCatalog) {
    await refreshCatalogHead().catch(() => {
      // retry next interval
    });
  }

  if (state.view === "top" || state.view === "all") {
    await loadTopDaily().catch(() => {
      // retry next interval
    });
  }

  const hasQuery = state.query.trim().length > 1;
  if (hasQuery) {
    await handleRemoteSearch(state.searchToken).catch(() => {
      // keep local filtering only
    });
    await ensureSearchCoverage(state.searchToken).catch(() => {
      // best effort
    });
  }

  if (!hasQuery && !state.backgroundSyncRunning && state.page > 0 && state.page < state.totalPages) {
    const activeView = resolveCatalogViewForSearch();
    if (isCatalogBrowseView(activeView)) {
      await syncCatalogBatch(reason === "manual" ? "manual" : "active").catch(() => {
        // retry next cycle
      });
    }
  }

  if (refs.playerOverlay.hidden && refs.detailModal.hidden) {
    renderAll();
  } else {
    renderTopDaily();
    renderCommunityStats();
    updateSyncText();
  }
}

function startAutoRefresh() {
  if (state.refreshFeedTimer) {
    clearInterval(state.refreshFeedTimer);
  }
  if (state.refreshTopTimer) {
    clearInterval(state.refreshTopTimer);
  }
  if (state.activeViewSyncTimer) {
    clearInterval(state.activeViewSyncTimer);
  }

  state.refreshFeedTimer = setInterval(() => {
    syncCurrentViewData("feed").catch(() => {
      // retry later
    });
  }, REFRESH_FEED_MS);

  state.refreshTopTimer = setInterval(() => {
    syncCurrentViewData("top").catch(() => {
      // retry later
    });
  }, REFRESH_TOP_MS);

  state.activeViewSyncTimer = setInterval(() => {
    syncCurrentViewData("active").catch(() => {
      // retry next cycle
    });
  }, ACTIVE_VIEW_SYNC_MS);
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
    bindFastPress(button, () => {
      rememberCurrentViewScroll();
      state.chip = chip.id;
      if (isCatalogCategoryView(chip.id)) {
        state.view = chip.id;
      } else if (isCatalogCategoryView(state.view)) {
        state.view = "all";
      }
      setActiveNav(state.view);
      renderFilterChips();
      state.pendingScrollRestoreView = state.view;
      renderAll();
    });
    refs.filterChips.appendChild(button);
  }
}

function applyCatalogSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object" || !Array.isArray(snapshot.items) || snapshot.items.length === 0) {
    return false;
  }
  const items = snapshot.items.map(normalizeCatalogItem).filter(Boolean);
  if (items.length === 0) {
    return false;
  }

  state.catalog = items;
  state.page = Math.max(1, Number(snapshot.page || 1));
  state.totalPages = Math.max(state.page, Number(snapshot.totalPages || state.page || 1));
  state.catalogSyncPage = Math.max(1, Number(snapshot.catalogSyncPage || state.page || 1));
  state.hasMore = Boolean(snapshot.hasMore);
  state.lastSyncAt = new Date(Number(snapshot.savedAt || Date.now()));
  return true;
}

async function loadInitialCatalog() {
  state.loadingCatalog = true;
  updateLoadMoreButton();

  const hasSnapshot = applyCatalogSnapshot(loadCatalogSnapshot());
  if (hasSnapshot) {
    if (!state.activeHeroId && state.catalog[0]) {
      state.activeHeroId = state.catalog[0].id;
    }
    if (state.topDaily.length === 0) {
      state.topDaily = buildTopFromCatalog();
    }
    renderAll();
    warmImageCacheFromPool(state.catalog, isCompactViewport() ? 360 : 220);
  }

  try {
    const firstResult = await fetchCatalogPage(1);
    state.catalog = [];
    state.page = 0;
    state.totalPages = 0;
    state.catalogSyncPage = 0;
    state.hasMore = true;
    upsertCatalogItems(firstResult.items, { prepend: false });
    state.page = firstResult.currentPage;
    state.totalPages = firstResult.lastPage;
    state.catalogSyncPage = firstResult.currentPage;
    state.hasMore = firstResult.currentPage < firstResult.lastPage;

    const initialProfile = getCatalogSyncProfile(resolveCatalogViewForSearch());
    const warmupTargetPages = Math.max(INITIAL_CATALOG_WARMUP_PAGES, Number(initialProfile.initialPages || 1));
    const warmupLastPage = Math.min(firstResult.lastPage, warmupTargetPages);
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
      const batchPages = Math.max(1, Number(initialProfile.activeBatch || 4));
      const endPage = Math.min(state.totalPages, state.page + batchPages);
      if (state.page + 1 <= endPage) {
        startBackgroundCatalogSync(state.page + 1, endPage);
      }
    }
    saveCatalogSnapshot();
  } catch {
    if (hasSnapshot) {
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
    if (state.hasMore) {
      scheduleScrollDrivenCatalogSync();
    }
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
    updateSyncText();
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

function extractSearchRows(payload) {
  const blocks = payload?.data?.items;
  const merged = [];
  const append = (candidate) => {
    if (!Array.isArray(candidate) || candidate.length === 0) {
      return;
    }
    candidate.forEach((entry) => {
      if (entry && typeof entry === "object") {
        merged.push(entry);
      }
    });
  };

  append(payload?.data?.items?.movies?.items);
  append(payload?.data?.items?.items);
  append(payload?.data?.movies?.items);
  append(payload?.data?.results);

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
    const id = Number(entry?.id || 0);
    if (!Number.isFinite(id) || id <= 0) {
      return;
    }
    if (!dedupe.has(id)) {
      dedupe.set(id, entry);
    }
  });
  return Array.from(dedupe.values());
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

  const rows = extractSearchRows(payload);
  if (rows.length === 0) {
    return;
  }

  const mapped = rows.map(normalizeCatalogItem).filter(Boolean);
  if (mapped.length === 0) {
    return;
  }
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
    poster: normalizeImageUrl(raw?.large_poster_path || raw?.small_poster_path || ""),
    backdrop: normalizeImageUrl(raw?.wallpaper_poster_path || raw?.small_poster_path || raw?.large_poster_path || ""),
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
  const hasQuery = state.query.trim().length > 0;
  const heroItem = getHeroItem(visible);
  const isInfoView = !hasQuery && state.view === "info";
  const isCalendarView = state.view === "calendar";
  const isListView = !hasQuery && state.view === "list";
  const isTopView = !hasQuery && state.view === "top";
  const showBrowseView = !isInfoView && !isCalendarView && !isTopView && !isListView;

  if (showBrowseView) {
    const primePool = [heroItem, ...visible].filter(Boolean);
    primeCriticalCovers(
      primePool,
      isCompactViewport() ? CRITICAL_COVER_PRIME_MOBILE : CRITICAL_COVER_PRIME_DESKTOP,
      0
    ).catch(() => {
      // best effort only
    });
    renderHero(heroItem);
    renderCommunityStats();
    renderCatalog(visible);
    if (!hasQuery) {
      renderContinue();
    }
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
  const showContinue = showBrowseView && !hasQuery && refs.continueGrid.children.length > 0;
  setHidden(refs.continueSection, !showContinue);

  state.pendingCatalogUpdate = false;
  updateSearchInputControls(refs.searchInput?.value || "");
  saveBrowseState();
  syncBrowseRoute();
  updateLoadMoreButton();
  updateSyncText();
  if (state.pendingScrollRestoreView) {
    const pending = state.pendingScrollRestoreView;
    state.pendingScrollRestoreView = "";
    restoreScrollForView(pending);
  }
  if (showBrowseView && state.hasMore) {
    scheduleScrollDrivenCatalogSync();
  }
}

function getVisibleCatalog() {
  const activeView = resolveCatalogViewForSearch();
  let list = state.catalog.slice();
  if (activeView === "top") {
    list = state.topDaily.slice();
  } else if (activeView === "list") {
    list = getFavoriteCatalog();
  } else if (activeView === "latest") {
    list.sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate));
  } else if (activeView === "popular") {
    list = getPopularCatalog();
  }

  if (activeView === "movie") {
    list = list.filter((item) => item.type === "movie" && !item.isAnime);
  } else if (activeView === "tv") {
    list = list.filter((item) => item.type === "tv" && !item.isAnime);
  } else if (activeView === "anime") {
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
  if (hasQuery) {
    refs.catalogTitle.textContent = "Recherche";
    refs.catalogSubtitle.textContent = `${resultCount} titre(s) trouve(s) pour "${state.query}".`;
    return;
  }
  refs.catalogTitle.textContent = titleByView[state.view] || "Streaming";

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

function normalizeImageUrl(url) {
  const raw = String(url || "").trim();
  if (!raw || raw.startsWith("data:")) {
    return raw;
  }

  try {
    const parsed = new URL(raw, window.location.origin);
    const host = String(parsed.hostname || "").toLowerCase();
    if (
      parsed.pathname.startsWith("/t/p/") &&
      (host === "www.themoviedb.org" || host === "themoviedb.org" || host === "image.tmdb.org")
    ) {
      return `https://image.tmdb.org${parsed.pathname}${parsed.search || ""}`;
    }
    return parsed.href;
  } catch {
    return raw;
  }
}

function resolvePreferredCover(item, details = null) {
  const mediaId = Number(item?.id || 0);
  const fromCache = mediaId > 0 ? state.detailsCache.get(mediaId) : null;
  const resolved = details || fromCache || null;
  return normalizeImageUrl(
    resolved?.posters?.wallpaper || resolved?.posters?.small || resolved?.posters?.large || item?.backdrop || item?.poster || ""
  );
}

function resolveCardCover(item, details = null) {
  const mediaId = Number(item?.id || 0);
  const fromCache = mediaId > 0 ? state.detailsCache.get(mediaId) : null;
  const resolved = details || fromCache || null;
  return normalizeImageUrl(
    resolved?.posters?.large || resolved?.posters?.small || resolved?.posters?.wallpaper || item?.poster || item?.backdrop || ""
  );
}

function setImageSourceSafely(node, nextSrc, title = "", cover = true) {
  if (!(node instanceof HTMLImageElement)) {
    return;
  }
  const url = normalizeImageUrl(nextSrc);
  if (!url) {
    wireImageFallback(node, title || "Zenix", cover);
    return;
  }

  const currentSrc = String(node.currentSrc || node.src || "").trim();
  if (currentSrc === url || node.dataset.pendingSrc === url) {
    wireImageFallback(node, title || "Zenix", cover);
    return;
  }

  node.dataset.pendingSrc = url;
  const preloader = new Image();
  preloader.decoding = "async";
  preloader.src = url;

  const apply = () => {
    if (node.dataset.pendingSrc !== url) {
      return;
    }
    node.src = url;
    delete node.dataset.pendingSrc;
    wireImageFallback(node, title || "Zenix", cover);
  };

  if (preloader.complete) {
    apply();
    return;
  }

  preloader.addEventListener("load", apply, { once: true });
  preloader.addEventListener(
    "error",
    () => {
      if (node.dataset.pendingSrc === url) {
        delete node.dataset.pendingSrc;
      }
      wireImageFallback(node, title || "Zenix", cover);
    },
    { once: true }
  );
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
        src="${escapeHtml(resolvePreferredCover(item))}"
        alt="${escapeHtml(item.title)}"
        loading="${index < 10 ? "eager" : "lazy"}"
        decoding="async"
        fetchpriority="${index < 4 ? "high" : "auto"}"
        data-cover-id="${item.id}"
      />
      <span>${escapeHtml(item.title)}</span>
      ${topRank >= 0 ? `<small>Top ${topRank + 1}</small>` : ""}
    `;
    const image = button.querySelector("img");
    if (image) {
      wireImageFallback(image, item.title, true);
    }
    button.addEventListener("pointerdown", () => {
      ensureDetails(item.id)
        .then((entry) => {
          updateCardCoverFromDetails(item.id, entry);
        })
        .catch(() => {
          // optional warmup only
        });
    });
    bindFastPress(button, () => {
      openDetails(item.id).catch(() => {
        showToast("Impossible d'ouvrir ce titre.", true);
      });
    });
    fragment.appendChild(button);
  });
  refs.featureRailTrack.appendChild(fragment);
  warmVisibleDetailCovers(source, 18);
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
  observeMediaCards(refs.listGrid);
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
  setImageSourceSafely(refs.heroArt, resolvePreferredCover(item, details), item.title, true);
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
    card.dataset.cardId = String(item.id);
    const details = state.detailsCache.get(item.id) || null;
    const cover = resolveCardCover(item, details);
    const runtime = item.runtime ? toHumanRuntime(item.runtime) : item.type === "tv" ? "Episodes" : "Film";
    const year = getYear(item.releaseDate) || "-";
    const languageLabel = resolveDetailLanguageLabel(details, item.id);
    const isNewRelease = isRecentlyReleased(item, NEW_RELEASE_DAYS);
    const hasResume = Number(state.progress?.[item.id]?.time || 0) > 45;

    card.innerHTML = `
      <div class="top-shell">
      <div class="top-thumb">
        <span class="top-rank">#${index + 1}</span>
        <img
          src="${escapeHtml(cover)}"
          alt="${escapeHtml(item.title)}"
          loading="${index < 6 ? "eager" : "lazy"}"
          decoding="async"
          fetchpriority="${index < 2 ? "high" : "auto"}"
          data-cover-id="${item.id}"
        />
        <div class="card-hover-actions" aria-hidden="true">
          <button type="button" class="card-action-btn" data-top-play="${item.id}" aria-label="Demarrer ${escapeHtml(item.title)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>
          </button>
          <button type="button" class="card-action-btn" data-top-info="${item.id}" aria-label="Voir les details de ${escapeHtml(item.title)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 9h2V7h-2zm0 8h2v-6h-2zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path></svg>
          </button>
        </div>
        <button type="button" class="media-open" data-top-open="${item.id}" aria-label="Voir la fiche de ${escapeHtml(item.title)}"></button>
      </div>
      <div class="top-body">
        <button type="button" class="title-link top-title-link" data-top-open="${item.id}">${escapeHtml(item.title)}</button>
        <p class="top-meta">
          <span class="meta-pill">${escapeHtml(getItemTypeLabel(item))}</span>
          ${isNewRelease ? '<span class="meta-pill meta-pill-new">Nouveau</span>' : ""}
          ${hasResume ? '<span class="meta-pill meta-pill-resume">Reprise</span>' : ""}
          <span class="meta-dot" aria-hidden="true"></span>
          <span>${escapeHtml(runtime)}</span>
          <span class="meta-dot" aria-hidden="true"></span>
          <span>${escapeHtml(year)}</span>
          ${languageLabel ? `<span class="meta-dot" aria-hidden="true"></span><span>${escapeHtml(languageLabel)}</span>` : ""}
        </p>
      </div>
      </div>
    `;

    const topImg = card.querySelector("img");
    if (topImg) {
      wireImageFallback(topImg, item.title, false);
    }
    card.addEventListener("pointerenter", () => {
      prefetchStreamForItem(item);
    });
    card.addEventListener("pointerdown", () => {
      ensureDetails(item.id)
        .then((entry) => {
          updateCardCoverFromDetails(item.id, entry);
        })
        .catch(() => {
          // best effort
        });
    });

    bindSafeTap(card, (event) => {
      if (event.target instanceof HTMLElement && event.target.closest("button")) {
        return;
      }
      state.activeHeroId = item.id;
      openDetails(item.id).catch(() => {
        showMessage("Impossible de charger la fiche detaillee.", true);
      });
    });

    const play = card.querySelector(`[data-top-play="${item.id}"]`);
    const info = card.querySelector(`[data-top-info="${item.id}"]`);
    const openButtons = card.querySelectorAll(`[data-top-open="${item.id}"]`);

    if (play) {
      bindFastPress(play, () => {
        openPlayer(item.id).catch(() => {
          showMessage("Lecture indisponible pour ce titre.", true);
        });
      });
    }
    if (info) {
      bindFastPress(info, () => {
        openDetails(item.id).catch(() => {
          showMessage("Impossible de charger la fiche detaillee.", true);
        });
      });
    }
    openButtons.forEach((button) => {
      bindSafeTap(button, () => {
        state.activeHeroId = item.id;
        openDetails(item.id).catch(() => {
          showMessage("Impossible de charger la fiche detaillee.", true);
        });
      });
    });

    fragment.appendChild(card);
  });
  refs.topGrid.appendChild(fragment);
  warmVisibleDetailCovers(state.topDaily, 20);
  observeMediaCards(refs.topGrid);
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
  const compact = isCompactViewport();
  const baseChunk = Math.max(
    CATALOG_RENDER_CHUNK_MIN,
    Math.min(CATALOG_RENDER_CHUNK_MAX, Math.ceil(total / 9))
  );
  const chunkSize = compact ? Math.max(baseChunk, MOBILE_CATALOG_CHUNK_MIN) : baseChunk;
  const firstPaintCount = Math.min(
    total,
    compact ? Math.max(chunkSize, MOBILE_CATALOG_FIRST_PAINT) : chunkSize
  );
  const imageProfile = getCardImageProfile();
  let index = 0;

  const firstPaintFragment = document.createDocumentFragment();
  for (; index < firstPaintCount; index += 1) {
    const entry = items[index];
    if (!entry || Number(entry.id || 0) <= 0) {
      continue;
    }
    firstPaintFragment.appendChild(buildMediaCard(entry, false, null, index, imageProfile));
  }
  refs.catalogGrid.replaceChildren(firstPaintFragment);

  const appendChunk = () => {
    if (token !== state.catalogRenderToken) {
      return;
    }
    const stop = Math.min(total, index + chunkSize);
    const fragment = document.createDocumentFragment();
    for (; index < stop; index += 1) {
      const entry = items[index];
      if (!entry || Number(entry.id || 0) <= 0) {
        continue;
      }
      fragment.appendChild(buildMediaCard(entry, false, null, index, imageProfile));
    }
    refs.catalogGrid.appendChild(fragment);
    observeMediaCards(refs.catalogGrid);

    if (index < total) {
      state.catalogRenderFrame = requestAnimationFrame(appendChunk);
    } else {
      state.catalogRenderFrame = 0;
    }
  };

  if (index < total) {
    state.catalogRenderFrame = requestAnimationFrame(appendChunk);
  } else {
    state.catalogRenderFrame = 0;
  }
  warmVisibleDetailCovers(items, 42);
  observeMediaCards(refs.catalogGrid);
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
  observeMediaCards(refs.continueGrid);
}

function buildMediaCard(item, resume = false, progressEntry = null, position = 0, imageProfile = null) {
  const card = document.createElement("article");
  card.className = "media-card";
  card.dataset.cardId = String(item.id);

  const details = state.detailsCache.get(item.id) || null;
  const cover = resolveCardCover(item, details);
  const eagerLimit = Number(imageProfile?.eagerLimit || DESKTOP_EAGER_IMAGE_LIMIT);
  const highPriorityLimit = Number(imageProfile?.highPriorityLimit || DESKTOP_HIGH_PRIORITY_IMAGE_LIMIT);

  const year = getYear(item.releaseDate) || "-";
  const runtime = item.runtime ? toHumanRuntime(item.runtime) : item.type === "tv" ? "Episodes" : "Film";
  const typeLabel = getItemTypeLabel(item);
  const languageLabel = resolveDetailLanguageLabel(details, item.id);
  const favorite = isFavorite(item.id);
  const progress = progressEntry || state.progress[item.id] || null;
  const isNewRelease = isRecentlyReleased(item, NEW_RELEASE_DAYS);
  const hasResume = Number(progress?.time || 0) > 45;
  const ratioRaw = progress && Number(progress.duration || 0) > 0
    ? (Number(progress.time || 0) / Number(progress.duration || 1)) * 100
    : 0;
  const ratio = Math.max(0, Math.min(100, Math.round(ratioRaw)));

  card.innerHTML = `
    <div class="media-shell">
    <div class="media-thumb">
      <img
        src="${escapeHtml(cover)}"
        alt="${escapeHtml(item.title)}"
        loading="${position < eagerLimit ? "eager" : "lazy"}"
        decoding="async"
        fetchpriority="${position < highPriorityLimit ? "high" : "auto"}"
        data-cover-id="${item.id}"
      />
      <div class="card-hover-actions" aria-hidden="true">
        <button type="button" class="card-action-btn" data-card-play="${item.id}" aria-label="${resume ? "Reprendre" : "Demarrer"} ${escapeHtml(item.title)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>
        </button>
        <button type="button" class="card-action-btn" data-card-info="${item.id}" aria-label="Voir les details de ${escapeHtml(item.title)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 9h2V7h-2zm0 8h2v-6h-2zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path></svg>
        </button>
        <button type="button" class="card-action-btn card-action-fav${favorite ? " active" : ""}" data-card-fav="${item.id}" aria-label="${favorite ? "Retirer de ma liste" : "Ajouter a ma liste"}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c-1.8-2.1-5-2.4-7.1-.4-2.4 2.2-2.5 6-.2 8.4l7.3 7.5 7.3-7.5c2.3-2.4 2.2-6.2-.2-8.4-2.1-2-5.3-1.7-7.1.4z"></path></svg>
        </button>
      </div>
      <button type="button" class="media-open" data-card-open="${item.id}" aria-label="Voir la fiche de ${escapeHtml(item.title)}"></button>
      ${ratio > 0 ? `<div class="progress-track"><span style="width:${ratio}%"></span></div>` : ""}
    </div>
    <div class="media-body">
      <button type="button" class="title-link media-title-link" data-card-open="${item.id}">${escapeHtml(item.title)}</button>
      <p class="media-meta">
        <span class="meta-pill">${escapeHtml(typeLabel)}</span>
        ${isNewRelease ? '<span class="meta-pill meta-pill-new">Nouveau</span>' : ""}
        ${hasResume ? '<span class="meta-pill meta-pill-resume">Reprise</span>' : ""}
        <span class="meta-dot" aria-hidden="true"></span>
        <span>${escapeHtml(runtime)}</span>
        <span class="meta-dot" aria-hidden="true"></span>
        <span>${escapeHtml(year)}</span>
        ${languageLabel ? `<span class="meta-dot" aria-hidden="true"></span><span>${escapeHtml(languageLabel)}</span>` : ""}
      </p>
      ${resume ? '<p class="media-resume">Reprendre la lecture</p>' : ""}
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
  const openButtons = card.querySelectorAll(`[data-card-open="${item.id}"]`);

  if (play) {
    bindFastPress(play, () => {
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
    bindFastPress(info, () => {
      openDetails(item.id).catch(() => {
        showMessage("Impossible de charger les details.", true);
      });
    });
  }

  if (fav) {
    bindFastPress(fav, () => {
      toggleFavorite(item.id);
      const nowFavorite = isFavorite(item.id);
      fav.classList.toggle("active", nowFavorite);
      fav.setAttribute("aria-label", nowFavorite ? "Retirer de ma liste" : "Ajouter a ma liste");
    });
  }
  openButtons.forEach((button) => {
    bindSafeTap(button, () => {
      openDetails(item.id).catch(() => {
        showMessage("Impossible de charger les details.", true);
      });
    });
  });

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
    ensureDetails(item.id)
      .then((entry) => {
        updateCardCoverFromDetails(item.id, entry);
      })
      .catch(() => {
        // optional warmup only
      });
  });

  bindSafeTap(card, (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("button")) {
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
  const item = findItemById(Number(id));
  const cover = resolveCardCover(item, details);
  if (!cover) {
    return;
  }

  if (item) {
    item.poster = cover;
    item.backdrop = cover;
  }

  document.querySelectorAll(`[data-cover-id="${id}"]`).forEach((node) => {
    if (node instanceof HTMLImageElement) {
      setImageSourceSafely(node, cover, item?.title || details?.title || "Zenix", true);
    }
  });
}

function warmVisibleDetailCovers(items, limit = 32) {
  const rows = Array.isArray(items) ? items.slice(0, Math.max(0, limit)) : [];
  if (rows.length === 0) {
    return;
  }

  const hydrate = () => {
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
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(hydrate, { timeout: 750 });
  } else {
    window.setTimeout(hydrate, 0);
  }
}

function ensureCardViewportObserver() {
  if (state.cardViewportObserver || typeof IntersectionObserver !== "function") {
    return;
  }
  state.cardViewportObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const target = entry.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        observer.unobserve(target);
        const mediaId = Number(target.dataset.cardId || 0);
        if (!Number.isInteger(mediaId) || mediaId <= 0) {
          return;
        }
        const item = findItemById(mediaId);
        if (item) {
          prefetchStreamForItem(item);
        }
        ensureDetails(mediaId)
          .then((details) => {
            updateCardCoverFromDetails(mediaId, details);
          })
          .catch(() => {
            // optional warmup only
          });
      });
    },
    {
      root: null,
      rootMargin: "320px 0px 320px 0px",
      threshold: 0.01,
    }
  );
}

function observeMediaCards(container) {
  if (!(container instanceof HTMLElement)) {
    return;
  }
  ensureCardViewportObserver();
  if (!state.cardViewportObserver) {
    return;
  }
  container.querySelectorAll("[data-card-id]").forEach((card) => {
    if (card instanceof HTMLElement) {
      state.cardViewportObserver.observe(card);
    }
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
                isSoon:
                  isEpisodeSoon(episode) ||
                  isGenericEpisodePlaceholderName(episode?.name, Number(episode?.episode || 0)),
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

function isGenericEpisodePlaceholderName(value, expectedEpisode = 0) {
  const raw = String(value || "").trim();
  if (!raw) {
    return false;
  }
  const normalized = raw.replace(/\s+/g, " ").trim();
  const genericEpisode = normalized.match(/^episode\s*0*(\d{1,3})$/i);
  if (genericEpisode) {
    const parsed = Number(genericEpisode[1] || 0);
    return !expectedEpisode || parsed <= 0 || parsed === Number(expectedEpisode || 0);
  }

  const prefixedEpisode = normalized.match(/^(?:eo?|ep?)\s*0*(\d{1,3})\s*-\s*episode\s*0*(\d{1,3})$/i);
  if (!prefixedEpisode) {
    return false;
  }

  const first = Number(prefixedEpisode[1] || 0);
  const second = Number(prefixedEpisode[2] || 0);
  if (!expectedEpisode) {
    return true;
  }
  const expected = Number(expectedEpisode || 0);
  return first === expected || second === expected;
}

function hasPlaceholderEpisodeMetadata(rawEpisode) {
  const overview = String(rawEpisode?.overview || "").trim();
  const poster = String(rawEpisode?.poster || "").trim();
  const tmdbCount = Number(rawEpisode?.note?.tmdb?.count || 0);
  const tmdbAverage = Number(rawEpisode?.note?.tmdb?.average || 0);
  return !overview && !poster && tmdbCount <= 0 && tmdbAverage <= 0;
}

function isEpisodeSoon(rawEpisode) {
  const title = String(rawEpisode?.name || rawEpisode?.formattedName || "").toLowerCase();
  if (/soon|bientot|a venir|coming/.test(title)) {
    return true;
  }

  const episodeNumber = Number(rawEpisode?.episode || 0);
  const placeholderName = isGenericEpisodePlaceholderName(title, episodeNumber);
  if (placeholderName && hasPlaceholderEpisodeMetadata(rawEpisode)) {
    return true;
  }

  const airDateTs = parseEpisodeAirDate(rawEpisode?.airDate || rawEpisode?.air_date || "");
  if (airDateTs > Date.now() + 2 * 60 * 60 * 1000) {
    return true;
  }
  if (placeholderName && airDateTs > Date.now() - 2 * 60 * 60 * 1000) {
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
    const genericPlaceholder = isGenericEpisodePlaceholderName(entry?.name, entry?.episode);
    const showSoon = Boolean(entry?.isSoon || genericPlaceholder);
    const soonSuffix = showSoon ? " | soon" : "";
    if (genericPlaceholder) {
      option.textContent = `EO${Number(entry.episode || 0)} - Episode ${Number(entry.episode || 0)}${soonSuffix}`;
    } else {
      option.textContent = `E${String(entry.episode).padStart(2, "0")} - ${entry.name}${soonSuffix}`;
    }
    option.selected = entry.episode === selectedEpisode;
    option.disabled = Boolean(entry?.isSoon);
    select.appendChild(option);
  });

  if (select.options.length > 0 && (!select.value || select.selectedOptions[0]?.disabled)) {
    const fallback = getFirstPlayableEpisode(episodes);
    select.value = String(fallback);
  }
}

function buildEpisodePlayableKey(id, season, episode) {
  return `${Number(id || 0)}:${Number(season || 0)}:${Number(episode || 0)}`;
}

function readEpisodePlayableCache(id, season, episode) {
  const key = buildEpisodePlayableKey(id, season, episode);
  const entry = state.episodePlayableCache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() >= Number(entry.expiresAt || 0)) {
    state.episodePlayableCache.delete(key);
    return null;
  }
  return Boolean(entry.playable);
}

function writeEpisodePlayableCache(id, season, episode, playable) {
  const key = buildEpisodePlayableKey(id, season, episode);
  state.episodePlayableCache.set(key, {
    playable: Boolean(playable),
    expiresAt: Date.now() + EPISODE_SOON_VERIFY_TTL_MS,
  });
  if (state.episodePlayableCache.size > 800) {
    const entries = Array.from(state.episodePlayableCache.entries()).sort(
      (left, right) => Number(left[1]?.expiresAt || 0) - Number(right[1]?.expiresAt || 0)
    );
    entries.slice(0, state.episodePlayableCache.size - 800).forEach(([cacheKey]) => {
      state.episodePlayableCache.delete(cacheKey);
    });
  }
}

async function isEpisodePlayableByStream(id, season, episode) {
  const cached = readEpisodePlayableCache(id, season, episode);
  if (cached !== null) {
    return cached;
  }

  const key = buildEpisodePlayableKey(id, season, episode);
  if (state.episodePlayableInFlight.has(key)) {
    return state.episodePlayableInFlight.get(key);
  }

  const task = (async () => {
    try {
      const payload = await fetchStreamJson(`/stream/${id}/episode?season=${season}&episode=${episode}`, {
        prefetch: true,
      });
      const playable = extractSources(payload).length > 0;
      writeEpisodePlayableCache(id, season, episode, playable);
      return playable;
    } catch {
      writeEpisodePlayableCache(id, season, episode, false);
      return false;
    }
  })();
  state.episodePlayableInFlight.set(key, task);

  try {
    return await task;
  } finally {
    state.episodePlayableInFlight.delete(key);
  }
}

async function verifySoonEpisodesForSeason(id, season, episodes) {
  if (!Number.isInteger(Number(id)) || !Number.isInteger(Number(season)) || !Array.isArray(episodes)) {
    return false;
  }

  const candidates = episodes
    .filter((entry) => Boolean(entry?.isSoon) && isGenericEpisodePlaceholderName(entry?.name, entry?.episode))
    .slice(0, EPISODE_SOON_VERIFY_LIMIT);
  if (candidates.length === 0) {
    return false;
  }

  let changed = false;
  for (const entry of candidates) {
    const playable = await isEpisodePlayableByStream(id, season, Number(entry.episode || 0));
    if (playable && entry.isSoon) {
      entry.isSoon = false;
      changed = true;
    }
  }
  return changed;
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
  captureModalScrollPosition();
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
  refs.detailPoster.src = normalizeImageUrl(item.poster || item.backdrop || "");
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
    normalizeImageUrl(
      details?.posters?.wallpaper || details?.posters?.small || item.backdrop || details?.posters?.large || item.poster
    );
  if (refs.detailPanel) {
    refs.detailPanel.style.setProperty("--detail-backdrop-image", toCssImage(detailBackdrop));
  }

  refs.detailPoster.src = normalizeImageUrl(
    details?.posters?.large || details?.posters?.small || item.poster || item.backdrop
  );
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
        verifySoonEpisodesForSeason(id, defaultSeason, episodes)
          .then((changed) => {
            if (!changed || state.detailToken !== detailToken || state.selectedDetailId !== id) {
              return;
            }
            if (Number(refs.detailSeasonSelect.value || "0") !== defaultSeason) {
              return;
            }
            const currentEpisode = Number(refs.detailEpisodeSelect.value || defaultEpisode);
            populateEpisodeSelect(refs.detailEpisodeSelect, episodes, currentEpisode);
          })
          .catch(() => {
            // no-op
          });
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
  activatePostCloseTapGuard(900);
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
  if (refs.playerOverlay.hidden && refs.detailModal.hidden) {
    restoreModalScrollPosition();
  }
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
  captureModalScrollPosition();
  const item = findItemById(id) || (await buildItemFromDetails(id));
  if (!item) {
    throw new Error("Item not found");
  }

  const token = ++state.playToken;
  const resume = state.progress[id] || null;
  const cachedDetails = state.detailsCache.get(id) || null;
  const playerBackdrop = normalizeImageUrl(
    cachedDetails?.posters?.wallpaper ||
      cachedDetails?.posters?.small ||
      item.backdrop ||
      item.poster ||
      cachedDetails?.posters?.large ||
      ""
  );
  refs.playerOverlay.hidden = false;
  refs.playerTitle.textContent = item.title;
  setPlayerPill(refs.playerTypePill, formatPlayerKind(item), true);
  setPlayerPill(refs.playerLanguagePill, item.type === "tv" ? "Langue auto" : "Auto");
  setPlayerPill(refs.playerQualityPill, "Qualite auto");
  refs.playerVideo.volume = Math.max(0, Math.min(1, Number(state.uiPrefs.playerVolume ?? 1)));
  refs.playerVideo.muted = Boolean(state.uiPrefs.playerMuted);
  applyPlayerRate(Number(state.uiPrefs.playbackRate || 1), { save: false });
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

      let firstPlayable = getFirstPlayableEpisode(episodes);
      let episode = Number(options.episode || resume?.episode || firstPlayable);
      if (!episodes.some((entry) => entry.episode === episode)) {
        episode = firstPlayable;
      }
      let foundEpisode = episodes.find((entry) => entry.episode === episode);
      if (foundEpisode?.isSoon && isGenericEpisodePlaceholderName(foundEpisode?.name, foundEpisode?.episode)) {
        const selectedPlayable = await isEpisodePlayableByStream(id, season, episode);
        if (selectedPlayable) {
          foundEpisode.isSoon = false;
          firstPlayable = getFirstPlayableEpisode(episodes);
        }
      }
      if (foundEpisode?.isSoon) {
        episode = firstPlayable;
      }

      populateSeasonSelect(refs.playerSeasonSelect, seasons, season);
      populateEpisodeSelect(refs.playerEpisodeSelect, episodes, episode);
      verifySoonEpisodesForSeason(id, season, episodes)
        .then((changed) => {
          if (!changed || token !== state.playToken) {
            return;
          }
          if (Number(refs.playerSeasonSelect.value || "0") !== season) {
            return;
          }
          const currentEpisode = Number(refs.playerEpisodeSelect.value || episode);
          populateEpisodeSelect(refs.playerEpisodeSelect, episodes, currentEpisode);
        })
        .catch(() => {
          // no-op
        });
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
    const message =
      state.sourcePool.length > 0
        ? "Lecture impossible sur cette source. Essaie une autre source."
        : "Lecture impossible pour ce titre.";
    setPlayerStatus(message, true);
    renderPlayerSourceOptions();
    throw error;
  }
}

async function loadMovieStream(item, resumeTime, token, syncRoute = true) {
  setPlayerStatus("Connexion au flux film...");
  const payload = await fetchStreamJson(`/stream/${item.id}`);
  if (token !== state.playToken) {
    return;
  }

  clearManualSourceLock();
  state.sourcePool = extractSources(payload);
  if (state.sourcePool.length === 0) {
    throw new Error("No movie source");
  }
  state.sourceIndex = -1;
  renderPlayerSourceOptions();
  await playFromSourcePool(resumeTime, token, 0, { skipPremiumFallback: true });
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

  clearManualSourceLock();
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
  await playFromSourcePool(resumeTime, token, 0, { skipPremiumFallback: true });

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
    .filter(Boolean);

  const seen = new Set();
  const deduped = normalized.filter((entry) => {
    if (seen.has(entry.url)) {
      return false;
    }
    seen.add(entry.url);
    return true;
  });
  deduped.sort((left, right) => {
    const premiumDelta = Number(Boolean(left?.premiumHint)) - Number(Boolean(right?.premiumHint));
    if (premiumDelta !== 0) {
      return premiumDelta;
    }
    return Number(right?.score || 0) - Number(left?.score || 0);
  });
  return deduped;
}

function clearManualSourceLock() {
  state.manualSourceLock = false;
  state.manualSourceLockedIndex = -1;
}

function shouldIgnoreVideoErrorFallback() {
  if (Date.now() < Number(state.ignoreVideoErrorUntil || 0)) {
    return true;
  }
  const videoErrorCode = Number(refs.playerVideo?.error?.code || 0);
  if (videoErrorCode === 1) {
    return true;
  }
  return false;
}

async function trySwitchToNextSource() {
  if (state.manualSourceLock) {
    setPlayerStatus("Source selectionnee indisponible. Choisis une autre source.", true);
    return;
  }
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

async function playFromSourcePool(resumeTime, token, startIndex = 0, options = {}) {
  const strictIndex = Boolean(options?.strictIndex);
  const skipPremiumFallback = Boolean(options?.skipPremiumFallback);
  const startSource = state.sourcePool[startIndex] || null;
  const startIsPremium = Boolean(startSource?.premiumHint);
  let lastError = null;
  for (let index = startIndex; index < state.sourcePool.length; index += 1) {
    state.sourceIndex = index;
    renderPlayerSourceOptions();
    const source = state.sourcePool[index];
    if (skipPremiumFallback && !startIsPremium && index > startIndex && source?.premiumHint) {
      break;
    }
    setPlayerStatus(`Connexion source ${index + 1}/${state.sourcePool.length}...`);
    try {
      await startPlayerSource(source, resumeTime, token);
      return;
    } catch (error) {
      lastError = error;
      if (strictIndex) {
        break;
      }
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
  const premiumHint = isPremiumLikeSource({
    url,
    source_name: entry?.source_name,
    language,
    quality,
  });

  return {
    url,
    format,
    quality,
    language,
    host,
    score,
    premiumHint,
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
  if (source?.premiumHint) {
    chunks.push("Premium");
  }
  return chunks.join(" - ");
}

function isPremiumLikeSource(source) {
  const raw = [source?.url, source?.source_name, source?.language, source?.quality]
    .map((entry) => String(entry || "").toLowerCase())
    .join(" ");
  if (!raw) {
    return false;
  }
  return /premium|vip|payant|abonn|subscrib/i.test(raw) || /\/premium[-_/]/i.test(raw);
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
  const previousIndex = Number(state.sourceIndex);
  state.manualSourceLock = true;
  state.manualSourceLockedIndex = safeIndex;
  const token = ++state.playToken;
  const resumeTime = Number(refs.playerVideo.currentTime || 0);
  try {
    await playFromSourcePool(resumeTime, token, safeIndex, { strictIndex: true });
    showToast("Source changee.");
  } catch (error) {
    state.manualSourceLock = false;
    state.manualSourceLockedIndex = -1;
    if (Number.isInteger(previousIndex) && previousIndex >= 0 && previousIndex < state.sourcePool.length) {
      state.sourceIndex = previousIndex;
      renderPlayerSourceOptions();
    }
    throw error;
  }
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

function buildPlayableSourceUrl(source) {
  const raw = String(source?.url || "").trim();
  if (!raw) {
    return "";
  }
  if (/\/api\/hls-proxy\?url=/i.test(raw)) {
    return raw;
  }
  const looksLikeHls = source?.format === "hls" || /m3u8/i.test(raw);
  if (!looksLikeHls) {
    return raw;
  }

  try {
    const absolute = new URL(raw, window.location.href).href;
    if (!/^https?:\/\//i.test(absolute)) {
      return raw;
    }
    return `${API_BASE}/hls-proxy?url=${encodeURIComponent(absolute)}`;
  } catch {
    return raw;
  }
}

async function startPlayerSource(source, resumeTime, token) {
  const streamUrl = buildPlayableSourceUrl(source);
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
    await waitVideoReady(video, VIDEO_READY_TIMEOUT_MS);
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
    await waitVideoReady(video, HLS_READY_TIMEOUT_MS);
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
    }, HLS_MANIFEST_TIMEOUT_MS);

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

  await waitVideoReady(video, HLS_READY_TIMEOUT_MS);
}

function teardownPlayerEngine(video) {
  state.ignoreVideoErrorUntil = Date.now() + 1400;
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
    const urls = Array.from(new Set(HLS_JS_FALLBACK_URLS.filter(Boolean)));
    let cursor = 0;

    const tryNext = () => {
      if (window.Hls) {
        resolve(window.Hls);
        return;
      }
      if (cursor >= urls.length) {
        state.hlsScriptPromise = null;
        reject(new Error("Failed to load hls.js"));
        return;
      }

      const script = document.createElement("script");
      script.src = urls[cursor];
      script.async = true;
      cursor += 1;
      script.onload = () => {
        if (window.Hls) {
          resolve(window.Hls);
          return;
        }
        tryNext();
      };
      script.onerror = () => {
        tryNext();
      };
      document.head.appendChild(script);
    };

    tryNext();
  });

  return state.hlsScriptPromise;
}

function waitVideoReady(video, timeoutMs = VIDEO_READY_TIMEOUT_MS) {
  if (video.readyState >= 1) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("Video timeout"));
    }, Math.max(2000, Number(timeoutMs || VIDEO_READY_TIMEOUT_MS)));

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
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", onError);
    }

    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("canplay", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

function setPlayerStatus(message, isError = false) {
  refs.playerStatus.textContent = message || "";
  refs.playerStatus.classList.toggle("error", Boolean(isError));
}

function closePlayer(options = {}) {
  activatePostCloseTapGuard(900);
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
  clearManualSourceLock();
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
  renderContinue();
  if (refs.playerOverlay.hidden && refs.detailModal.hidden) {
    restoreModalScrollPosition();
  }
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
    if (!isAutoNextEnabled()) {
      showToast("Fin d'episode. Auto-episode desactive.");
      renderContinue();
      return;
    }
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
    poster: normalizeImageUrl(details?.posters?.large || details?.posters?.small || details?.posters?.wallpaper || ""),
    backdrop: normalizeImageUrl(details?.posters?.wallpaper || details?.posters?.small || details?.posters?.large || ""),
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

function captureModalScrollPosition() {
  if (state.modalScrollCaptured) {
    return;
  }
  state.modalScrollY = Math.max(0, Number(window.scrollY || 0));
  state.modalScrollCaptured = true;
}

function restoreModalScrollPosition() {
  if (!state.modalScrollCaptured) {
    return;
  }
  const targetY = Math.max(0, Number(state.modalScrollY || 0));
  state.modalScrollCaptured = false;
  state.modalScrollY = 0;
  requestAnimationFrame(() => {
    window.scrollTo(0, targetY);
  });
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

function isRecentlyReleased(item, days = NEW_RELEASE_DAYS) {
  const ts = parseReleaseDate(item?.releaseDate || "");
  if (!ts) {
    return false;
  }
  const limit = Math.max(1, Number(days || NEW_RELEASE_DAYS)) * 24 * 60 * 60 * 1000;
  return Date.now() - ts <= limit;
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

function saveBrowseState() {
  try {
    const payload = {
      view: state.view,
      chip: state.chip,
      sortBy: state.sortBy,
      query: state.query,
      calendarQuery: state.calendarQuery,
      savedAt: Date.now(),
    };
    localStorage.setItem(BROWSE_STATE_KEY, JSON.stringify(payload));
  } catch {
    // ignore private mode/quota
  }
}

function loadBrowseState() {
  try {
    const raw = localStorage.getItem(BROWSE_STATE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function applySavedBrowseState() {
  const url = new URL(window.location.href);
  const hasExplicitBrowseParams =
    url.searchParams.has("view") || url.searchParams.has("chip") || url.searchParams.has("sort") || url.searchParams.has("q");
  const hasRoute = url.searchParams.has("watch") || url.searchParams.has("detail");
  if (hasExplicitBrowseParams || hasRoute) {
    return;
  }

  const saved = loadBrowseState();
  if (!saved) {
    return;
  }

  const allowedViews = new Set(["all", "calendar", "top", "movie", "tv", "anime", "latest", "popular", "list", "info"]);
  const allowedChips = new Set(["all", "recent", "movie", "tv", "anime"]);
  const allowedSort = new Set(["featured", "recent", "title-asc", "title-desc", "runtime-desc"]);

  if (allowedViews.has(String(saved.view || ""))) {
    state.view = String(saved.view);
  }
  if (allowedChips.has(String(saved.chip || ""))) {
    state.chip = String(saved.chip);
  }
  if (allowedSort.has(String(saved.sortBy || ""))) {
    state.sortBy = String(saved.sortBy);
  }
  state.query = String(saved.query || "").trim();
  state.calendarQuery = String(saved.calendarQuery || "").trim();

  refs.searchInput.value = state.view === "calendar" ? state.calendarQuery : state.query;
  if (refs.calendarSearchInput) {
    refs.calendarSearchInput.value = state.calendarQuery;
  }
  refs.sortSelect.value = state.sortBy;
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
  updateSearchInputControls(refs.searchInput.value || "");
}

function applyBrowseParamsToUrl(url) {
  if (!(url instanceof URL)) {
    return;
  }

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
}

function syncBrowseRoute(options = {}) {
  const route = readAppRoute();
  if (route.watch > 0 || route.detail > 0) {
    return;
  }

  const replace = options.replace !== false;
  const url = new URL(window.location.href);
  applyBrowseParamsToUrl(url);

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
  applyBrowseParamsToUrl(url);

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
  refs.searchSuggestPanel.hidden = true;
  renderFilterChips();
  setActiveNav(state.view);
  state.pendingScrollRestoreView = state.view;
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
        rememberCurrentViewScroll();
        saveBrowseState();
      }
      sendAnalyticsHeartbeat(false);
    });
    window.addEventListener("pagehide", () => {
      saveNowPlayingProgress({ force: true });
      rememberCurrentViewScroll();
      saveBrowseState();
      sendAnalyticsHeartbeat(true);
    });
    window.addEventListener("beforeunload", () => {
      saveNowPlayingProgress({ force: true });
      rememberCurrentViewScroll();
      saveBrowseState();
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

function loadUiPrefs() {
  const defaults = {
    compactCards: false,
    autoNextEpisode: true,
    playbackRate: 1,
    playerVolume: 1,
    playerMuted: false,
  };
  try {
    const raw = localStorage.getItem(UI_PREFS_KEY);
    if (!raw) {
      return defaults;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return defaults;
    }
    const playbackRate = Number(parsed.playbackRate || 1);
    const playerVolume = Number(parsed.playerVolume);
    return {
      compactCards: Boolean(parsed.compactCards),
      autoNextEpisode: parsed.autoNextEpisode !== false,
      playbackRate: Number.isFinite(playbackRate) ? Math.min(2, Math.max(0.75, playbackRate)) : 1,
      playerVolume: Number.isFinite(playerVolume) ? Math.min(1, Math.max(0, playerVolume)) : 1,
      playerMuted: Boolean(parsed.playerMuted),
    };
  } catch {
    return defaults;
  }
}

function saveUiPrefs(value) {
  try {
    const payload = {
      compactCards: Boolean(value?.compactCards),
      autoNextEpisode: value?.autoNextEpisode !== false,
      playbackRate: Number(value?.playbackRate || 1),
      playerVolume: Number(value?.playerVolume ?? 1),
      playerMuted: Boolean(value?.playerMuted),
    };
    localStorage.setItem(UI_PREFS_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((entry) => String(entry || "").trim())
      .filter((entry) => entry.length >= 2)
      .slice(0, RECENT_SEARCHES_LIMIT);
  } catch {
    return [];
  }
}

function saveRecentSearches(values) {
  try {
    const safe = Array.isArray(values)
      ? values
          .map((entry) => String(entry || "").trim())
          .filter((entry) => entry.length >= 2)
          .slice(0, RECENT_SEARCHES_LIMIT)
      : [];
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(safe));
  } catch {
    // ignore
  }
}

function loadViewScrollPositions() {
  try {
    const raw = localStorage.getItem(VIEW_SCROLL_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveViewScrollPositions(value) {
  try {
    const safe = value && typeof value === "object" ? value : {};
    localStorage.setItem(VIEW_SCROLL_KEY, JSON.stringify(safe));
  } catch {
    // ignore
  }
}

function pruneProgressEntries() {
  const now = Date.now();
  const rows = Object.entries(state.progress || {}).sort(
    (left, right) => Number(right?.[1]?.lastPlayed || 0) - Number(left?.[1]?.lastPlayed || 0)
  );
  const next = {};
  rows.forEach(([id, entry], index) => {
    const lastPlayed = Number(entry?.lastPlayed || 0);
    const isFresh = lastPlayed <= 0 || now - lastPlayed <= WATCH_HISTORY_MAX_AGE_MS;
    if (!isFresh || index >= WATCH_HISTORY_MAX) {
      return;
    }
    next[id] = entry;
  });
  const changed = Object.keys(next).length !== Object.keys(state.progress || {}).length;
  if (changed) {
    state.progress = next;
    saveProgress(state.progress);
  }
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
