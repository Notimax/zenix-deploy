const API_BASE = "/api";
const STORAGE_KEY = "zenix-progress-v4";
if (typeof window !== "undefined") {
  window.__zenixBooted = false;
  window.__zenixBootError = false;
}
const FAVORITES_KEY = "zenix-favorites-v1";
const FAVORITES_BACKUP_KEY = "zenix-favorites-backup-v1";
const RATINGS_KEY = "zenix-ratings-v1";
const LANGUAGE_PREFS_KEY = "zenix-language-prefs-v1";
const CATALOG_CACHE_KEY = "zenix-catalog-cache-v3";
const CLEANUP_KEY = "zenix-sw-cleaned-v4";
const REFRESH_FEED_MS = 4 * 60 * 1000;
const REFRESH_TOP_MS = 20 * 60 * 1000;
const ACTIVE_VIEW_SYNC_MS = 45 * 1000;
const REQUEST_TIMEOUT_MS = 15000;
const RETRY_DELAYS_MS = [350, 900];
const SEARCH_DEBOUNCE_MS = 180;
const API_CACHE_TTL_MS = 45 * 1000;
const STREAM_CACHE_TTL_MS = 2 * 60 * 1000;
const STREAM_PREFETCH_COOLDOWN_MS = 15 * 1000;
const PROGRESS_SAVE_INTERVAL_MS = 2400;
const HERO_ROTATE_MS = 8000;
const STARTUP_SPLASH_MIN_MS = 1450;
const STARTUP_SPLASH_MAX_MS = 4200;
const STARTUP_SPLASH_END_ANIM_MS = 640;
const STARTUP_SPLASH_SOUND_VOLUME = 0.06;
const STARTUP_SPLASH_SOUND_COOLDOWN_MS = 1100;
const IMAGE_WARMUP_BATCH = 28;
const IMAGE_WARMUP_DELAY_MS = 12;
const INITIAL_IMAGE_WARMUP_LIMIT = 320;
const CALENDAR_YEAR_RANGE = 3;
const CALENDAR_CACHE_KEY = "zenix-calendar-cache-v2";
const CALENDAR_CACHE_MAX_ENTRIES = 8;
const CALENDAR_RENDER_LIMIT = 420;
const CALENDAR_TYPE_KEYS = ["film", "serie", "anime"];
const INITIAL_CATALOG_WARMUP_PAGES = 3;
const BACKGROUND_CATALOG_DELAY_MS = 8;
const BACKGROUND_CATALOG_RENDER_EVERY = 8;
const CATALOG_MIN_VISIBLE_APPEND = 45;
const CATALOG_VISIBLE_APPEND_BATCH_PAGES = 1;
const CATALOG_VISIBLE_APPEND_MAX_STEPS_SCROLL = 6;
const CATALOG_VISIBLE_APPEND_MAX_STEPS_MANUAL = 6;
const CATALOG_RENDER_CHUNK_MIN = 40;
const CATALOG_RENDER_CHUNK_MAX = 140;
const MOBILE_VIEWPORT_MAX_WIDTH = 740;
const MOBILE_CATALOG_FIRST_PAINT = 160;
const MOBILE_CATALOG_CHUNK_MIN = 120;
const MOBILE_EAGER_IMAGE_LIMIT = 320;
const MOBILE_HIGH_PRIORITY_IMAGE_LIMIT = 160;
const DESKTOP_EAGER_IMAGE_LIMIT = 300;
const DESKTOP_HIGH_PRIORITY_IMAGE_LIMIT = 140;
const CRITICAL_COVER_PRIME_MOBILE = 320;
const CRITICAL_COVER_PRIME_DESKTOP = 240;
const CRITICAL_COVER_PRIME_WAIT_MS = 900;
const DETAIL_COVER_HYDRATE_CONCURRENCY_MOBILE = 10;
const DETAIL_COVER_HYDRATE_CONCURRENCY_DESKTOP = 14;
const DETAIL_COVER_HYDRATE_LIMIT_CATEGORY_MOBILE = 420;
const DETAIL_COVER_HYDRATE_LIMIT_CATEGORY_DESKTOP = 340;
const DETAIL_COVER_HYDRATE_LIMIT_DEFAULT_MOBILE = 120;
const DETAIL_COVER_HYDRATE_LIMIT_DEFAULT_DESKTOP = 84;
const LIVE_RENDER_INTERACTION_GRACE_MS = 1200;
const SCROLL_SYNC_THRESHOLD_PX = 1800;
const SCROLL_SYNC_DEBOUNCE_MS = 80;
const SCROLL_SYNC_MIN_INTERVAL_MS = 220;
const HIDE_BROWSE_PANELS = true;
const SEARCH_ASSIST_STEP_PAGES = 6;
const SEARCH_ASSIST_MAX_STEPS = 3;
const SEARCH_ASSIST_COOLDOWN_MS = 1200;
const STREAM_PROXY_TIMEOUT_MS = 6500;
const STREAM_PROXY_PREFETCH_TIMEOUT_MS = 4200;
const STREAM_DIRECT_TIMEOUT_MS = 5200;
const STREAM_DIRECT_PREFETCH_TIMEOUT_MS = 3600;
const ANIME_SIBNET_TIMEOUT_MS = 11000;
const ZENIX_OWNED_SOURCE_TIMEOUT_MS = 7000;
const NAKIOS_SOURCE_TIMEOUT_MS = 20000;
const SUPPLEMENTAL_CATALOG_TIMEOUT_MS = 14000;
const EPISODE_SOON_VERIFY_TTL_MS = 3 * 60 * 1000;
const EPISODE_SOON_VERIFY_LIMIT = 40;
const EPISODE_NAME_REFRESH_TTL_MS = 10 * 60 * 1000;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const HLS_JS_URL = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";
const HLS_JS_FALLBACK_URLS = ["/hls.min.js", HLS_JS_URL, "https://unpkg.com/hls.js@1.5.17/dist/hls.min.js"];
const HLS_MIME = "application/vnd.apple.mpegurl";
const DASH_MIME = "application/dash+xml";
const VIDEO_READY_TIMEOUT_MS = 12000;
const HLS_READY_TIMEOUT_MS = 14000;
const HLS_MANIFEST_TIMEOUT_MS = 15000;
const HLS_LANG_PROBE_TIMEOUT_MS = 3800;
const HLS_LANG_PROBE_CACHE_MS = 18 * 60 * 1000;
const HLS_LANG_PROBE_EMPTY_CACHE_MS = 4 * 60 * 1000;
const HLS_LANG_PROBE_MAX = 6;
const SEGMENT_FALLBACK_MAX_SEGMENTS = 1200;
const IOS_NATIVE_HLS_BOOT_TIMEOUT_MS = 3600;
const IOS_DECODED_HLS_BOOT_TIMEOUT_MS = 4200;
const IOS_SEGMENT_BOOT_TIMEOUT_MS = 3400;
const IOS_SEGMENT_NEXT_TIMEOUT_MS = 4200;
const IOS_SEGMENT_CHAIN_MAX = 8;
const EMBED_READY_TIMEOUT_MS = 6000;
const HEARTBEAT_INTERVAL_MS = 30 * 1000;
const HEARTBEAT_REQUEST_TIMEOUT_MS = 9000;
const HEARTBEAT_KEY = "zenix-client-id-v1";
const ONLINE_COUNT_BASE = 50;
const ONLINE_COUNT_POLL_MS = 30 * 1000;
const ONLINE_COUNT_STALE_MS = ONLINE_COUNT_POLL_MS * 2;
const UI_PREFS_KEY = "zenix-ui-prefs-v1";
const RECENT_SEARCHES_KEY = "zenix-recent-searches-v1";
const SEARCH_SIGNALS_KEY = "zenix-search-signals-v1";
const BROWSE_STATE_KEY = "zenix-browse-state-v1";
const VIEW_SCROLL_KEY = "zenix-view-scroll-v1";
const SOURCE_HOST_HEALTH_KEY = "zenix-source-health-v1";
const SOURCE_SUCCESS_KEY = "zenix-source-success-v1";
const ITEM_QUALITY_KEY = "zenix-item-quality-v1";
const DISCORD_PROMPT_SESSION_KEY = "zenix-discord-prompt-session-v1";
const DISCORD_INVITE_URL = "https://discord.gg/xydTB8VmZT";
const BACKUP_PROMPT_SESSION_KEY = "zenix-backup-prompt-session-v1";
const BACKUP_PROMPT_STORAGE_KEY = "zenix-backup-prompt-last-v1";
const BACKUP_PROMPT_TTL_MS = 24 * 60 * 60 * 1000;
const BACKUP_PROMPT_DELAY_MS = 2400;
const BACKUP_PORTAL_URL = "https://zenix.lol";
const hlsLanguageProbeCache = new Map();
const RECENT_SEARCHES_LIMIT = 8;
const SCROLL_RESTORE_MAX = 8000;
const SLOW_NET_TYPES = new Set(["slow-2g", "2g", "3g"]);
const NEW_RELEASE_DAYS = 45;
const TOP_DAILY_LIMIT = 10;
const TOP_DAILY_RECENCY_WINDOW_DAYS = 160;
const TOP_DAILY_TYPE_CAPS = {
  movie: 5,
  tv: 4,
  anime: 3,
};
const SUPPLEMENTAL_MEDIA_ID_MIN = 1500000000;
const WATCH_HISTORY_MAX = 250;
const WATCH_HISTORY_MAX_AGE_MS = 120 * 24 * 60 * 60 * 1000;
const SOURCE_HOST_HEALTH_MAX = 140;
const SOURCE_SUCCESS_MAX = 360;
const SOURCE_SUCCESS_TTL_MS = 45 * 24 * 60 * 60 * 1000;
const SOURCE_FAILURE_PENALTY = 26;
const SOURCE_SUCCESS_BONUS = 12;
const SOURCE_RETRY_PER_INDEX = 1;
const FILTER_PREMIUM_SOURCES = false;
const AUTO_PREMIUM_FALLBACK = true;
const PLAYBACK_GUARD_INTERVAL_MS = 1200;
const PLAYBACK_STALL_HARD_MS = 4300;
const PLAYBACK_STALL_PAUSED_MS = 6200;
const PLAYBACK_STARTUP_STALL_MS = 2200;
const PLAYBACK_STATUS_RECOVERY_MS = 1500;
const PLAYBACK_HEALTH_FIRST_DELAY_MS = 1300;
const PLAYBACK_HEALTH_REPEAT_DELAY_MS = 1800;
const MOBILE_PLAYBACK_BOOTSTRAP_TIMEOUT_MS = 2300;
const MOBILE_VIDEO_READY_TIMEOUT_MS = 7000;
const MOBILE_EMBED_READY_TIMEOUT_MS = 6000;
const EMBED_STALL_SWITCH_MS = 7000;
const MOBILE_EMBED_STALL_SWITCH_MS = 6200;
const PREVIEW_ENABLED = true;
const PREVIEW_HOVER_DELAY_MS = 220;
const PREVIEW_DURATION_MS = 10000;
const PREVIEW_COOLDOWN_MS = 22000;
const PREVIEW_ALLOW_HLS = true;
const QUALITY_BADGE_DEFAULT = "Full HD";
const QUALITY_BADGE_4K_RECENT_YEARS = 2;
const SKIP_INTRO_SECONDS = 85;
const SKIP_RECAP_SECONDS = 45;
const INTEREST_QUERY_MAX = 40;
const INTEREST_SEED_MAX = 40;
const INTEREST_HOME_LIMIT = 10;
const RECOMMENDATION_MIN_RESULTS = 3;
const RECOMMENDATION_MAX_RESULTS = 5;
const RECOMMENDATION_QUESTIONS = [
  {
    id: "format",
    label: "Format",
    options: [
      { value: "movie", label: "Film" },
      { value: "tv", label: "Serie" },
      { value: "anime", label: "Anime" },
      { value: "any", label: "Je sais pas" },
    ],
  },
  {
    id: "duration",
    label: "Duree",
    options: [
      { value: "short", label: "-30min" },
      { value: "medium", label: "30-60min" },
      { value: "long", label: "1-2h" },
      { value: "epic", label: "+2h" },
    ],
  },
  {
    id: "mood",
    label: "Ambiance",
    options: [
      { value: "comedie", label: "Comedie" },
      { value: "horreur", label: "Peur" },
      { value: "emotion", label: "Emotion" },
      { value: "action", label: "Action" },
      { value: "romance", label: "Romance" },
      { value: "sf", label: "SF" },
    ],
  },
  {
    id: "era",
    label: "Epoque",
    options: [
      { value: "80s90s", label: "Annees 80/90" },
      { value: "2000s", label: "Annees 2000" },
      { value: "2010s", label: "Annees 2010+" },
      { value: "recent", label: "Recent" },
    ],
  },
  {
    id: "pace",
    label: "Rythme",
    options: [
      { value: "slow", label: "Lent" },
      { value: "fast", label: "Dynamique" },
      { value: "balanced", label: "Equilibre" },
    ],
  },
];
const REPAIR_SOURCE_CACHE_MS = 1000 * 60 * 8;
const REPAIR_SOURCE_TIMEOUT_MS = 4500;
const THEME_PREFETCH_LIMIT_IDLE = 120;
const THEME_PREFETCH_LIMIT_ACTIVE = 240;
const THEME_PREFETCH_BATCH = 8;
const SEARCH_SIGNAL_MAX = 220;
const SEARCH_SIGNAL_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
const LOCK_VISIBLE_ROOT_URL = true;
const EXTERNAL_GUARD_ALLOW_HOSTS = new Set(["zenix.best", "www.zenix.best", "discord.com", "www.discord.com", "discord.gg", "www.discord.gg"]);
const EXTERNAL_GUARD_TRUST_WINDOW_MS = 1300;
const NATIVE_AD_SCRIPT_SRC = "https://maddenwiped.com/6724b59b8680ca68d3195556ffa48409/invoke.js";
const NATIVE_AD_CONTAINER_ID = "container-6724b59b8680ca68d3195556ffa48409";
const NATIVE_AD_FRAME_CLASS = "native-banner-frame";
const NATIVE_AD_FRAME_SANDBOX = "allow-scripts allow-same-origin";
const ADBLOCK_MONITOR_INTERVAL_MS = 8500;
const ADBLOCK_BOOT_DELAY_MS = 950;
const GATE_CHALLENGE_PATH = "/api/gate/challenge";
const GATE_ISSUE_PATH = "/api/gate/issue";
const GATE_PROOF_TIMEOUT_MS = 3200;
const GATE_REFRESH_COOLDOWN_MS = 6 * 60 * 1000;
const GATE_TOKEN_KEY = "zenix-gate-token-v1";
const UI_THEME_ORDER = ["cine", "minimal", "neon"];
const runtimeEnv = detectRuntimeEnvironment();

const THEME_FILTERS = [
  { id: "famille", label: "Famille / Jeunesse", tokens: ["familial", "family", "enfant", "kids", "jeunesse"] },
  { id: "superhero", label: "Super-heros", tokens: ["hero", "super hero", "superhero", "marvel", "dc"] },
  { id: "action", label: "Action", tokens: ["action"] },
  { id: "aventure", label: "Aventure", tokens: ["aventure", "adventure"] },
  { id: "comedie", label: "Comedie", tokens: ["comedie", "comedy", "humour"] },
  { id: "drame", label: "Drame", tokens: ["drame", "drama"] },
  { id: "thriller", label: "Thriller", tokens: ["thriller", "suspense"] },
  { id: "horreur", label: "Horreur", tokens: ["horreur", "horror", "epouvante", "gore"] },
  { id: "sf", label: "Science-fiction", tokens: ["science fiction", "science-fiction", "sci fi", "sci-fi", "sf"] },
  { id: "fantastique", label: "Fantastique", tokens: ["fantastique", "fantasy"] },
  { id: "romance", label: "Romance", tokens: ["romance", "romantique", "love"] },
  { id: "mystere", label: "Mystere", tokens: ["mystere", "mystery"] },
  { id: "crime", label: "Crime", tokens: ["crime", "policier", "gangster"] },
  { id: "animation", label: "Animation", tokens: ["animation", "dessin anime", "anime", "japanimation"] },
  { id: "documentaire", label: "Documentaire", tokens: ["documentaire", "documentary"] },
  { id: "historique", label: "Historique", tokens: ["historique", "history", "epoque"] },
  { id: "guerre", label: "Guerre", tokens: ["guerre", "war"] },
  { id: "western", label: "Western", tokens: ["western"] },
  { id: "musique", label: "Musique", tokens: ["musique", "music", "musical"] },
  { id: "sport", label: "Sport", tokens: ["sport"] },
];
const THEME_FILTER_INDEX = new Map(THEME_FILTERS.map((entry) => [entry.id, entry]));
const THEME_TOKEN_INDEX = (() => {
  const index = new Map();
  THEME_FILTERS.forEach((filter) => {
    const tokens = new Set([filter.id, ...(filter.tokens || [])]);
    tokens.forEach((token) => {
      const normalized = normalizeThemeToken(token);
      if (!normalized) {
        return;
      }
      if (!index.has(normalized)) {
        index.set(normalized, new Set());
      }
      index.get(normalized).add(filter.id);
    });
  });
  return index;
})();

function detectRuntimeEnvironment() {
  const ua = String(navigator.userAgent || "").toLowerCase();
  const vendor = String(navigator.vendor || "").toLowerCase();
  const isSnapBrowser = /\bsnapchat\b|\bsnap\b/.test(`${ua} ${vendor}`);
  const isInAppBrowser = isSnapBrowser || /\bfbav\b|\bfban\b|instagram|line\/|micromessenger|wv\)|tiktok|twitter|linkedinapp/.test(ua);
  return {
    isInAppBrowser,
    isSnapBrowser,
  };
}

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
  randomSortSeed: Date.now(),
  calendarMonth: new Date().getMonth() + 1,
  calendarYear: new Date().getFullYear(),
  calendarLoading: false,
  calendarData: null,
  calendarOverviewUnavailable: false,
  calendarTypeFilters: { film: true, serie: true, anime: true },
  calendarTypeByMediaId: new Map(),
  calendarTypeReconcileTimer: 0,
  searchToken: 0,
  page: 0,
  totalPages: 0,
  catalogSyncPage: 0,
  supplementalLastPage: Number.POSITIVE_INFINITY,
  hasMore: true,
  loadingCatalog: false,
  backgroundSyncRunning: false,
  loadingTop: false,
  catalog: [],
  topDaily: [],
  topDailyDayKey: "",
  activeHeroId: null,
  selectedDetailId: null,
  detailsCache: new Map(),
  detailsMissing: new Set(),
  pendingMediaIds: new Set(),
  trailersCache: new Map(),
  seasonsCache: new Map(),
  progress: loadProgress(),
  favorites: loadFavorites(),
  ratings: loadRatings(),
  searchSignals: loadSearchSignals(),
  nowPlaying: null,
  sourcePool: [],
  sourceIndex: -1,
  sourceRetryAttempts: new Map(),
  sourceHostHealth: loadSourceHostHealth(),
  sourceSuccessMap: loadSourceSuccessMap(),
  itemQualityMap: loadItemQualityMap(),
  hlsLangProbeToken: 0,
  sourceLoading: false,
  sourceLoadingSince: 0,
  sourceLoadTicket: 0,
  embedLoadStartedAt: 0,
  embedLoadFinishedAt: 0,
  embedSourceKey: "",
  lastPlaybackHardRefreshAt: 0,
  playbackHealthTimer: 0,
  playbackGuardTimer: 0,
  allEpisodeSources: [],
  availableLanguages: [],
  languagePreferences: loadLanguagePrefs(),
  selectedLanguageByMedia: new Map(),
  hlsScriptPromise: null,
  hlsInstance: null,
  hlsPlaylistBlobUrls: [],
  segmentFallback: null,
  searchAbortController: null,
  apiCache: new Map(),
  streamPayloadCache: new Map(),
  streamInFlight: new Map(),
  streamPrefetchAt: new Map(),
  previewSourceCache: new Map(),
  previewCooldownAt: new Map(),
  previewActive: null,
  episodePlayableCache: new Map(),
  episodePlayableInFlight: new Map(),
  seasonNameRefreshAt: new Map(),
  coverPreloadInFlight: new Map(),
  detailsInFlight: new Map(),
  trailersInFlight: new Map(),
  seasonsInFlight: new Map(),
  detailCompatibilityCache: new Map(),
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
  awaitingUserPlayUntil: 0,
  lastSyncAt: null,
  refreshFeedTimer: null,
  refreshTopTimer: null,
  pendingCatalogUpdate: false,
  userInteractingUntil: 0,
  pendingRenderTimer: 0,
  perfTier: "mid",
  analyticsClientId: "",
  analyticsDisabled: false,
  analyticsInFlight: false,
  heartbeatTimer: null,
  heartbeatBound: false,
  onlineCount: null,
  onlineCountUpdatedAt: 0,
  onlineCountInFlight: false,
  onlineCountTimer: 0,
  startupSplashForceTimer: 0,
  startupAudioContext: null,
  lastStartupSoundAt: 0,
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
  navSubmenuOpen: false,
  cardViewportObserver: null,
  sectionRevealObserver: null,
  suggestionSubmitting: false,
  nativeAdActivated: false,
  navOverflowOpen: false,
  adblockDetected: false,
  adblockCheckTimer: 0,
  adblockProbeInFlight: false,
  gateReady: false,
  gateIssueInFlight: false,
  gateIssuePromise: null,
  gateLastIssuedAt: 0,
    gateToken: loadGateToken(),
themeFilters: {
    movie: new Set(),
    tv: new Set(),
    anime: new Set(),
  },
  themePrefetchAt: 0,
  themePrefetchInFlight: false,
  discordPromptReady: false,
  discordGateVisible: false,
  backupPromptReady: false,
  backupGateVisible: false,
  recommendation: {
    step: 0,
    answers: {},
    results: [],
    seed: Date.now(),
  },
  repairCache: new Map(),
  repairInFlight: new Map(),
};

const refs = {
  startupSplash: document.getElementById("startupSplash"),
  heroSection: document.getElementById("hero"),
  statusStrip: document.getElementById("statusStrip"),
  announcementBanner: document.getElementById("announcementBanner"),
  announcementText: document.getElementById("announcementText"),
  announcementClose: document.getElementById("announcementClose"),
  quickLinksSection: document.getElementById("quickLinksSection"),
  filtersPanel: document.getElementById("filtersPanel"),
  communityPanel: document.getElementById("communityPanel"),
  calendarSection: document.getElementById("calendarSection"),
  infoSection: document.getElementById("infoSection"),
  recommendationSection: document.getElementById("recommendationSection"),
  recommendationQuiz: document.getElementById("recommendationQuiz"),
  recommendationProgressBar: document.getElementById("recommendationProgressBar"),
  recommendationStepLabel: document.getElementById("recommendationStepLabel"),
  recommendationQuestion: document.getElementById("recommendationQuestion"),
  recommendationOptions: document.getElementById("recommendationOptions"),
  recommendationBackBtn: document.getElementById("recommendationBackBtn"),
  recommendationResetBtn: document.getElementById("recommendationResetBtn"),
  recommendationResults: document.getElementById("recommendationResults"),
  recommendationGrid: document.getElementById("recommendationGrid"),
  recommendationRestartBtn: document.getElementById("recommendationRestartBtn"),
  suggestionForm: document.getElementById("suggestionForm"),
  suggestionType: document.getElementById("suggestionType"),
  suggestionTitle: document.getElementById("suggestionTitle"),
  suggestionMessage: document.getElementById("suggestionMessage"),
  suggestionContact: document.getElementById("suggestionContact"),
  suggestionName: document.getElementById("suggestionName"),
  suggestionWebsite: document.getElementById("suggestionWebsite"),
  suggestionClientTs: document.getElementById("suggestionClientTs"),
  suggestionSubmitBtn: document.getElementById("suggestionSubmitBtn"),
  suggestionStatus: document.getElementById("suggestionStatus"),

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
  trendingSection: document.getElementById("trendingSection"),
  trendingTrack: document.getElementById("trendingTrack"),

  searchInput: document.getElementById("searchInput"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  searchSuggestPanel: document.getElementById("searchSuggestPanel"),
  themeSwitchBtn: document.getElementById("themeSwitchBtn"),
  motionToggleBtn: document.getElementById("motionToggleBtn"),
  networkBadge: document.getElementById("networkBadge"),
  scrollProgress: document.getElementById("scrollProgress"),
  scrollProgressFill: document.getElementById("scrollProgressFill"),
  backToTopBtn: document.getElementById("backToTopBtn"),
  mainNavShell: document.querySelector(".main-nav-shell"),
  mainNav: document.querySelector(".main-nav"),
  navActiveIndicator: document.getElementById("navActiveIndicator"),
  navOverflow: document.getElementById("navOverflow"),
  navOverflowBtn: document.getElementById("navOverflowBtn"),
  navOverflowMenu: document.getElementById("navOverflowMenu"),
  navOverflowList: document.getElementById("navOverflowList"),
  navPills: Array.from(document.querySelectorAll(".nav-pill[data-view]")),
  navGroups: Array.from(document.querySelectorAll(".nav-group[data-nav-group]")),
  navToggles: Array.from(document.querySelectorAll("[data-nav-toggle]")),
  navSubItems: Array.from(document.querySelectorAll(".nav-subitem[data-view]")),
  navSubmenuBackdrop: document.getElementById("navSubmenuBackdrop"),
  navSubmenuSheet: document.getElementById("navSubmenuSheet"),
  navSubmenuList: document.getElementById("navSubmenuList"),
  navSubmenuTitle: document.getElementById("navSubmenuTitle"),
  navSubmenuCloseBtn: document.getElementById("navSubmenuCloseBtn"),
  topbar: document.querySelector(".topbar"),
  mobileTabs: Array.from(document.querySelectorAll(".mobile-tab[data-mobile-view]")),
  quickLinks: Array.from(document.querySelectorAll(".quick-link[data-view-jump]")),
  filterChips: document.getElementById("filterChips"),
  sortSelect: document.getElementById("sortSelect"),
  refreshNowBtn: document.getElementById("refreshNowBtn"),
  resumeLastBtn: document.getElementById("resumeLastBtn"),
  randomPlayBtn: document.getElementById("randomPlayBtn"),
  shareBrowseBtn: document.getElementById("shareBrowseBtn"),
  exportListBtn: document.getElementById("exportListBtn"),
  importListBtn: document.getElementById("importListBtn"),
  importListInput: document.getElementById("importListInput"),
  clearContinueBtn: document.getElementById("clearContinueBtn"),
  clearListBtn: document.getElementById("clearListBtn"),
  toggleCompactBtn: document.getElementById("toggleCompactBtn"),
  toggleAutonextBtn: document.getElementById("toggleAutonextBtn"),
  toggleHideWatchedBtn: document.getElementById("toggleHideWatchedBtn"),
  toggleNewOnlyBtn: document.getElementById("toggleNewOnlyBtn"),
  toggleVfOnlyBtn: document.getElementById("toggleVfOnlyBtn"),
  toggleVostOnlyBtn: document.getElementById("toggleVostOnlyBtn"),
  communityStats: document.getElementById("communityStats"),
  latestSection: document.getElementById("latestSection"),
  latestGrid: document.getElementById("latestGrid"),
  popularSection: document.getElementById("popularSection"),
  popularGrid: document.getElementById("popularGrid"),
  listSection: document.getElementById("listSection"),
  listGrid: document.getElementById("listGrid"),

  continueSection: document.getElementById("continueSection"),
  continueGrid: document.getElementById("continueGrid"),
  homeInterestSection: document.getElementById("homeInterestSection"),
  homeInterestGrid: document.getElementById("homeInterestGrid"),
  nativeAdSection: document.getElementById("nativeAdSection"),
  nativeAdHomeMount: document.getElementById("nativeAdHomeMount"),
  nativeAdCatalogSection: document.getElementById("nativeAdCatalogSection"),
  nativeAdCatalogMount: document.getElementById("nativeAdCatalogMount"),
  nativeAdDetailSection: document.getElementById("nativeAdDetailSection"),
  nativeAdDetailMount: document.getElementById("nativeAdDetailMount"),
  nativeAdUnit: document.getElementById("nativeAdUnit"),
  adblockGate: document.getElementById("adblockGate"),
  adblockRetryBtn: document.getElementById("adblockRetryBtn"),
  adblockGateStatus: document.getElementById("adblockGateStatus"),
  discordGate: document.getElementById("discordGate"),
  discordJoinBtn: document.getElementById("discordJoinBtn"),
  discordLaterBtn: document.getElementById("discordLaterBtn"),
  backupGate: document.getElementById("backupGate"),
  backupGateCloseBtn: document.getElementById("backupGateCloseBtn"),
  backupGateBookmarkBtn: document.getElementById("backupGateBookmarkBtn"),
  backupGateOkBtn: document.getElementById("backupGateOkBtn"),
  backupGateUrl: document.getElementById("backupGateUrl"),
  backupGateStatus: document.getElementById("backupGateStatus"),

  catalogSection: document.getElementById("catalogSection"),
  catalogTitle: document.getElementById("catalogTitle"),
  catalogSubtitle: document.getElementById("catalogSubtitle"),
  catalogFilterShell: document.getElementById("catalogFilterShell"),
  themeFilterToggleBtn: document.getElementById("themeFilterToggleBtn"),
  themeFilterPanel: document.getElementById("themeFilterPanel"),
  themeFilterList: document.getElementById("themeFilterList"),
  themeFilterClearBtn: document.getElementById("themeFilterClearBtn"),
  themeFilterApplyBtn: document.getElementById("themeFilterApplyBtn"),
  themeFilterBackdrop: document.getElementById("themeFilterBackdrop"),
  catalogGrid: document.getElementById("catalogGrid"),
  loadMoreBtn: document.getElementById("loadMoreBtn"),
  emptyStateWrap: document.getElementById("emptyStateWrap"),
  emptyState: document.getElementById("emptyState"),
  emptyResetFiltersBtn: document.getElementById("emptyResetFiltersBtn"),
  calendarMonthSelect: document.getElementById("calendarMonthSelect"),
  calendarYearSelect: document.getElementById("calendarYearSelect"),
  calendarSearchInput: document.getElementById("calendarSearchInput"),
  calendarTypeFilterInputs: Array.from(document.querySelectorAll("[data-calendar-type-filter]")),
  calendarRefreshBtn: document.getElementById("calendarRefreshBtn"),
  calendarMergedGrid: document.getElementById("calendarMergedGrid"),
  calendarMergedMeta: document.getElementById("calendarMergedMeta"),
  calendarDayStats: document.getElementById("calendarDayStats"),

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
  detailLikeBtn: document.getElementById("detailLikeBtn"),
  detailDislikeBtn: document.getElementById("detailDislikeBtn"),
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
  playerSubTitle: document.getElementById("playerSubTitle"),
  playerSeriesControls: document.getElementById("playerSeriesControls"),
  playerSeasonSelect: document.getElementById("playerSeasonSelect"),
  playerEpisodeSelect: document.getElementById("playerEpisodeSelect"),
  playerLanguageSelect: document.getElementById("playerLanguageSelect"),
  playerNextEpisodeBtn: document.getElementById("playerNextEpisodeBtn"),
  playerStatus: document.getElementById("playerStatus"),
  playerSourceMeta: document.getElementById("playerSourceMeta"),
  playerLoadingIndicator: document.getElementById("playerLoadingIndicator"),
  playerLoadingText: document.getElementById("playerLoadingText"),
  playerVideo: document.getElementById("playerVideo"),
  playerEmbedFrame: document.getElementById("playerEmbedFrame"),
  playerRestartBtn: document.getElementById("playerRestartBtn"),
  playerRewindBtn: document.getElementById("playerRewindBtn"),
  playerForwardBtn: document.getElementById("playerForwardBtn"),
  playerRetryBtn: document.getElementById("playerRetryBtn"),
  playerSkipIntroBtn: document.getElementById("playerSkipIntroBtn"),
  playerSkipRecapBtn: document.getElementById("playerSkipRecapBtn"),
  playerFullscreenBtn: document.getElementById("playerFullscreenBtn"),
  playerPipBtn: document.getElementById("playerPipBtn"),
  playerSpeedSelect: document.getElementById("playerSpeedSelect"),
  playerTypePill: document.getElementById("playerTypePill"),
  playerLanguagePill: document.getElementById("playerLanguagePill"),
  playerQualityPill: document.getElementById("playerQualityPill"),
  playerSourceControl: document.getElementById("playerSourceControl"),
  playerSourceSelect: document.getElementById("playerSourceSelect"),
  playerSourceChips: document.getElementById("playerSourceChips"),
  playerSourceApplyBtn: document.getElementById("playerSourceApplyBtn"),
  playerZenixStatus: document.getElementById("playerZenixStatus"),
  playerRepairBtn: document.getElementById("playerRepairBtn"),
  playerRepairStatus: document.getElementById("playerRepairStatus"),
  playerStepper: document.getElementById("playerStepper"),
  toast: document.getElementById("toast"),
  footerNetworkState: document.getElementById("footerNetworkState"),
  footerVersion: document.getElementById("footerVersion"),
  openDesignUpdatesBtn: document.getElementById("openDesignUpdatesBtn"),
  designUpdatesSection: document.getElementById("designUpdatesSection"),
};

let searchDebounce = null;
let lastProgressSave = 0;
let toastTimer = null;
let floatingNotificationGuardTimer = 0;
let mainNavFitTimer = 0;
let mainNavFitDeferred = false;
let lastTrustedExternalIntentAt = 0;

function applyRuntimeBrowserHints() {
  if (runtimeEnv.isInAppBrowser) {
    document.body.classList.add("in-app-browser");
  }
  if (runtimeEnv.isSnapBrowser) {
    document.body.classList.add("snap-browser");
  }
}

function normalizeThemeName(value) {
  const safe = String(value || "").trim().toLowerCase();
  return UI_THEME_ORDER.includes(safe) ? safe : "cine";
}

function applyUiThemeClass() {
  const nextTheme = normalizeThemeName(state.uiPrefs.theme);
  state.uiPrefs.theme = nextTheme;
  document.body.classList.remove("theme-cine", "theme-minimal", "theme-neon");
  document.body.classList.add(`theme-${nextTheme}`);
}

function isReducedMotionEnabled() {
  return Boolean(state.uiPrefs.reduceMotion);
}

function applyUiMotionClass() {
  document.body.classList.toggle("reduce-motion", isReducedMotionEnabled());
}

function getNextUiTheme(current) {
  const active = normalizeThemeName(current);
  const index = UI_THEME_ORDER.indexOf(active);
  const nextIndex = index >= 0 ? (index + 1) % UI_THEME_ORDER.length : 0;
  return UI_THEME_ORDER[nextIndex];
}

function isLikelyFloatingThirdPartyNotification(node) {
  if (!(node instanceof HTMLElement)) {
    return false;
  }
  if (node === refs.toast || node === refs.backToTopBtn) {
    return false;
  }
  if (node.closest?.(".player-overlay, .detail-modal")) {
    return false;
  }

  const tag = String(node.tagName || "").toLowerCase();
  if (tag !== "iframe" && tag !== "div") {
    return false;
  }

  const style = window.getComputedStyle(node);
  if (style.position !== "fixed") {
    return false;
  }

  const rect = node.getBoundingClientRect();
  if (rect.width < 70 || rect.width > 520 || rect.height < 40 || rect.height > 420) {
    return false;
  }

  const top = Number.parseFloat(style.top);
  const right = Number.parseFloat(style.right);
  const nearTopRight = Number.isFinite(top) && top >= 0 && top <= 140 && Number.isFinite(right) && right >= 0 && right <= 140;

  const src = tag === "iframe" ? String(node.getAttribute("src") || "").toLowerCase() : "";
  const fromAdNetwork = src.includes("maddenwiped.com") || src.includes("adsterra") || src.includes("ads");
  const classHint = String(node.className || "").toLowerCase();
  const idHint = String(node.id || "").toLowerCase();
  const hasNotifHint = /notif|push|social|adsterra|banner/.test(`${classHint} ${idHint}`);

  return nearTopRight || fromAdNetwork || hasNotifHint;
}

function applyFloatingNotificationPosition(node) {
  if (!(node instanceof HTMLElement)) {
    return;
  }
  node.style.setProperty("top", "auto", "important");
  node.style.setProperty("left", "auto", "important");
  node.style.setProperty("right", "16px", "important");
  node.style.setProperty("bottom", "16px", "important");
  node.style.setProperty("z-index", "2147483000", "important");
}

function enforceFloatingNotificationsPlacement() {
  const candidates = Array.from(document.querySelectorAll("iframe, div"));
  candidates.forEach((entry) => {
    if (!isLikelyFloatingThirdPartyNotification(entry)) {
      return;
    }
    if (isLikelyMobileDevice()) {
      entry.style.setProperty("display", "none", "important");
      return;
    }
    applyFloatingNotificationPosition(entry);
  });
}

function scheduleFloatingNotificationGuard() {
  if (floatingNotificationGuardTimer) {
    clearTimeout(floatingNotificationGuardTimer);
  }
  floatingNotificationGuardTimer = window.setTimeout(() => {
    floatingNotificationGuardTimer = 0;
    enforceFloatingNotificationsPlacement();
  }, 90);
}

function initFloatingNotificationGuard() {
  enforceFloatingNotificationsPlacement();
  if (typeof MutationObserver !== "function") {
    return;
  }
  const observer = new MutationObserver(() => {
    scheduleFloatingNotificationGuard();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class", "id", "src"],
  });
  window.addEventListener("resize", () => {
    scheduleFloatingNotificationGuard();
  });
}

function isOverlayLayerOpen() {
  return Boolean((refs.playerOverlay && !refs.playerOverlay.hidden) || (refs.detailModal && !refs.detailModal.hidden));
}

function closeNavOverflowMenu() {
  if (!refs.navOverflowMenu || !refs.navOverflowBtn) {
    return;
  }
  refs.navOverflowMenu.hidden = true;
  refs.navOverflowBtn.setAttribute("aria-expanded", "false");
  state.navOverflowOpen = false;
}

function openNavOverflowMenu() {
  if (!refs.navOverflowMenu || !refs.navOverflowBtn) {
    return;
  }
  refs.navOverflowMenu.hidden = false;
  refs.navOverflowBtn.setAttribute("aria-expanded", "true");
  state.navOverflowOpen = true;
}

function toggleNavOverflowMenu() {
  if (state.navOverflowOpen) {
    closeNavOverflowMenu();
    return;
  }
  openNavOverflowMenu();
}

function closeNavGroups(except = null) {
  if (!refs.navGroups || refs.navGroups.length === 0) {
    return;
  }
  refs.navGroups.forEach((group) => {
    if (except && group === except) {
      return;
    }
    group.classList.remove("is-open");
    const toggle = group.querySelector("[data-nav-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  });
  if (!except) {
    state.navSubmenuOpen = false;
    document.body.classList.remove("nav-submenu-open");
    if (refs.mainNav) {
      refs.mainNav.classList.remove("submenu-open");
    }
    if (refs.navSubmenuBackdrop) {
      refs.navSubmenuBackdrop.hidden = true;
    }
    if (refs.navSubmenuSheet) {
      refs.navSubmenuSheet.hidden = true;
    }
  }
}

function openNavGroup(group) {
  if (!(group instanceof HTMLElement)) {
    return;
  }
  closeNavGroups(group);
  group.classList.add("is-open");
  const toggle = group.querySelector("[data-nav-toggle]");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "true");
  }
  const isMobileNav = isCompactViewport();
  if (refs.mainNav) {
    refs.mainNav.classList.add("submenu-open");
  }
  if (isMobileNav) {
    state.navSubmenuOpen = true;
    document.body.classList.add("nav-submenu-open");
    if (refs.navSubmenuBackdrop) {
      refs.navSubmenuBackdrop.hidden = false;
    }
    if (refs.topbar) {
      const rect = refs.topbar.getBoundingClientRect();
      const top = Math.max(56, Math.round(rect.bottom + 8));
      document.body.style.setProperty("--nav-submenu-top", `${top}px`);
    }
    ensureNavSubmenuSheet();
    openMobileNavSubmenu(group);
  } else {
    state.navSubmenuOpen = false;
    document.body.classList.remove("nav-submenu-open");
    if (refs.navSubmenuBackdrop) {
      refs.navSubmenuBackdrop.hidden = true;
    }
    if (refs.navSubmenuSheet) {
      refs.navSubmenuSheet.hidden = true;
    }
  }
}

function openMobileNavSubmenu(group) {
  if (!refs.navSubmenuSheet || !refs.navSubmenuList) {
    return;
  }
  const items = Array.from(group.querySelectorAll(".nav-subitem[data-view]"));
  const fallbackItems = getNavGroupFallbackItems(group);
  if (items.length === 0 && fallbackItems.length === 0) {
    refs.navSubmenuSheet.hidden = true;
    return;
  }
  refs.navSubmenuList.innerHTML = "";
  const title = group.querySelector("[data-nav-toggle]")?.textContent || "Menu";
  if (refs.navSubmenuTitle) {
    refs.navSubmenuTitle.textContent = String(title || "").trim() || "Menu";
  }
  const fragment = document.createDocumentFragment();
  const rows = items.length > 0
    ? items.map((item) => ({ view: String(item.dataset.view || "").trim(), label: item.textContent || "" }))
    : fallbackItems;
  rows.forEach((row) => {
    const view = String(row.view || "").trim();
    if (!view) {
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-submenu-sheet-item";
    button.dataset.view = view;
    button.textContent = String(row.label || view);
    fragment.appendChild(button);
  });
  refs.navSubmenuList.appendChild(fragment);
  refs.navSubmenuSheet.hidden = false;
  refs.navSubmenuSheet.style.display = "grid";
}

function getNavGroupFallbackItems(group) {
  const key = String(group?.dataset?.navGroup || "").trim().toLowerCase();
  if (key !== "discover") {
    return [];
  }
  return [
    { view: "calendar", label: "Calendrier" },
    { view: "latest", label: "Nouveautes" },
    { view: "popular", label: "Populaires" },
    { view: "top", label: "Top du jour" },
    { view: "list", label: "Ma liste" },
    { view: "recommendation", label: "Recommandation" },
  ];
}

function ensureNavSubmenuSheet() {
  if (refs.navSubmenuSheet && refs.navSubmenuList && refs.navSubmenuTitle && refs.navSubmenuCloseBtn) {
    return;
  }
  const sheet = document.createElement("div");
  sheet.className = "nav-submenu-sheet";
  sheet.id = "navSubmenuSheet";
  sheet.hidden = true;
  sheet.setAttribute("role", "dialog");
  sheet.setAttribute("aria-modal", "true");
  sheet.setAttribute("aria-label", "Navigation");
  sheet.innerHTML = `
    <div class="nav-submenu-sheet-head">
      <span id="navSubmenuTitle">Menu</span>
      <button class="nav-submenu-sheet-close" id="navSubmenuCloseBtn" type="button">Fermer</button>
    </div>
    <div class="nav-submenu-sheet-list" id="navSubmenuList"></div>
  `;
  document.body.appendChild(sheet);
  refs.navSubmenuSheet = sheet;
  refs.navSubmenuTitle = sheet.querySelector("#navSubmenuTitle");
  refs.navSubmenuCloseBtn = sheet.querySelector("#navSubmenuCloseBtn");
  refs.navSubmenuList = sheet.querySelector("#navSubmenuList");
  if (refs.navSubmenuCloseBtn) {
    bindFastPress(refs.navSubmenuCloseBtn, () => {
      closeNavGroups();
    });
  }
  if (refs.navSubmenuList) {
    refs.navSubmenuList.addEventListener("click", (event) => {
      const target = event.target instanceof HTMLElement ? event.target.closest(".nav-submenu-sheet-item[data-view]") : null;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const view = String(target.dataset.view || "all");
      closeNavGroups();
      handleViewSelection(view);
    });
  }
}

function toggleNavGroup(group) {
  if (!(group instanceof HTMLElement)) {
    return;
  }
  const isOpen = group.classList.contains("is-open");
  if (isOpen) {
    closeNavGroups();
    return;
  }
  openNavGroup(group);
}

function updateNavActiveIndicator() {
  if (!(refs.mainNav instanceof HTMLElement) || !(refs.navActiveIndicator instanceof HTMLElement)) {
    return;
  }
  const active = refs.navPills.find((entry) => entry.classList.contains("active") && !entry.classList.contains("is-overflow-hidden"));
  if (!(active instanceof HTMLElement) || active.offsetParent === null) {
    refs.navActiveIndicator.style.opacity = "0";
    refs.navActiveIndicator.style.width = "0px";
    refs.navActiveIndicator.style.transform = "translateX(0)";
    return;
  }
  const navRect = refs.mainNav.getBoundingClientRect();
  const pillRect = active.getBoundingClientRect();
  const x = Math.max(0, pillRect.left - navRect.left + refs.mainNav.scrollLeft);
  refs.navActiveIndicator.style.opacity = "1";
  refs.navActiveIndicator.style.width = `${Math.max(28, pillRect.width)}px`;
  refs.navActiveIndicator.style.transform = `translateX(${x}px)`;
}

function syncNavOverflowMenu() {
  if (!(refs.mainNav instanceof HTMLElement) || !refs.navPills || !refs.navOverflowBtn || !refs.navOverflowList) {
    return;
  }

  refs.navPills.forEach((entry) => {
    entry.classList.remove("is-overflow-hidden");
  });
  refs.navOverflowList.innerHTML = "";

  const isDesktop = window.matchMedia("(min-width: 1001px)").matches;
  if (!isDesktop) {
    refs.navOverflowBtn.hidden = true;
    closeNavOverflowMenu();
    updateNavActiveIndicator();
    return;
  }

  const reservedWidth = 84;
  const maxLoops = refs.navPills.length * 2;
  let loops = 0;
  while (refs.mainNav.scrollWidth > refs.mainNav.clientWidth - reservedWidth && loops < maxLoops) {
    const candidate = refs.navPills[refs.navPills.length - 1 - loops];
    loops += 1;
    if (!(candidate instanceof HTMLElement)) {
      continue;
    }
    if (candidate.classList.contains("active") || (candidate.dataset.view || "") === "all") {
      continue;
    }
    candidate.classList.add("is-overflow-hidden");
  }

  const hiddenPills = refs.navPills.filter((entry) => entry.classList.contains("is-overflow-hidden"));
  if (hiddenPills.length === 0) {
    refs.navOverflowBtn.hidden = true;
    closeNavOverflowMenu();
    updateNavActiveIndicator();
    return;
  }

  const listFragment = document.createDocumentFragment();
  hiddenPills.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-overflow-item";
    button.dataset.view = String(entry.dataset.view || "all");
    button.textContent = String(entry.textContent || "").trim();
    if ((entry.dataset.view || "") === String(state.view || "all")) {
      button.classList.add("active");
    }
    listFragment.appendChild(button);
  });
  refs.navOverflowList.appendChild(listFragment);
  refs.navOverflowBtn.hidden = false;
  updateNavActiveIndicator();
}

function flushDeferredDesktopMainNavFit(delayMs = 20) {
  if (!mainNavFitDeferred) {
    return;
  }
  if (isOverlayLayerOpen()) {
    return;
  }
  mainNavFitDeferred = false;
  scheduleDesktopMainNavFit(delayMs);
}

function applyDesktopMainNavFit() {
  if (!(refs.mainNav instanceof HTMLElement)) {
    return;
  }
  const isDesktop = window.matchMedia("(min-width: 1001px)").matches;
  if (!isDesktop) {
    refs.mainNav.classList.remove("is-tight", "is-ultra-tight");
    document.body.classList.remove("nav-fit-stack");
    mainNavFitDeferred = false;
    syncNavOverflowMenu();
    updateNavActiveIndicator();
    return;
  }
  if (isOverlayLayerOpen()) {
    mainNavFitDeferred = true;
    return;
  }
  mainNavFitDeferred = false;
  refs.mainNav.classList.remove("is-tight", "is-ultra-tight");
  document.body.classList.remove("nav-fit-stack");
  if (refs.mainNav.scrollWidth <= refs.mainNav.clientWidth + 1) {
    return;
  }
  refs.mainNav.classList.add("is-tight");
  if (refs.mainNav.scrollWidth <= refs.mainNav.clientWidth + 1) {
    return;
  }
  refs.mainNav.classList.add("is-ultra-tight");
  if (refs.mainNav.scrollWidth > refs.mainNav.clientWidth + 1) {
    document.body.classList.add("nav-fit-stack");
  }
  syncNavOverflowMenu();
  updateNavActiveIndicator();
}

function scheduleDesktopMainNavFit(delayMs = 60) {
  if (mainNavFitTimer) {
    clearTimeout(mainNavFitTimer);
    mainNavFitTimer = 0;
  }
  if (isOverlayLayerOpen()) {
    mainNavFitDeferred = true;
    return;
  }
  mainNavFitDeferred = false;
  mainNavFitTimer = window.setTimeout(() => {
    mainNavFitTimer = 0;
    applyDesktopMainNavFit();
  }, Math.max(0, Number(delayMs || 0)));
}

function normalizeHostname(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
}

function isExternalHostWhitelisted(url) {
  const raw = String(url || "").trim();
  if (!raw) {
    return false;
  }
  try {
    const parsed = new URL(raw, window.location.href);
    const host = normalizeHostname(parsed.hostname);
    const appHost = normalizeHostname(window.location.hostname);
    if (!host) {
      return false;
    }
    if (host === appHost) {
      return true;
    }
    return EXTERNAL_GUARD_ALLOW_HOSTS.has(host) || EXTERNAL_GUARD_ALLOW_HOSTS.has(`www.${host}`);
  } catch {
    return false;
  }
}

function initExternalNavigationGuard() {
  const nativeOpen = typeof window.open === "function" ? window.open.bind(window) : null;
  if (!nativeOpen) {
    return;
  }

  document.addEventListener(
    "pointerdown",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      if (target.closest(".sponsor-slot, .detail-native-ad, [data-allow-external='1']")) {
        lastTrustedExternalIntentAt = Date.now();
      }
    },
    { capture: true, passive: true }
  );

  window.open = function guardedWindowOpen(url, ...rest) {
    const targetUrl = String(url || "").trim();
    const allowByHost = isExternalHostWhitelisted(targetUrl);
    const allowByGesture = Date.now() - lastTrustedExternalIntentAt <= EXTERNAL_GUARD_TRUST_WINDOW_MS;
    if (!allowByHost && !allowByGesture) {
      showToast("Navigation externe bloquee hors zone sponsorisee.", true);
      return null;
    }
    return nativeOpen(url, ...rest);
  };
}

function replayStartupSplashAnimations() {
  if (!refs.startupSplash) {
    return;
  }
  refs.startupSplash.classList.add("is-replaying");
  void refs.startupSplash.offsetWidth;
  refs.startupSplash.classList.remove("is-replaying");
}

async function playStartupSplashSound() {
  const nowMs = Date.now();
  if (nowMs - Number(state.lastStartupSoundAt || 0) < STARTUP_SPLASH_SOUND_COOLDOWN_MS) {
    return;
  }
  state.lastStartupSoundAt = nowMs;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (typeof AudioContextClass !== "function") {
    return;
  }

  try {
    if (!state.startupAudioContext) {
      state.startupAudioContext = new AudioContextClass();
    }
    const ctx = state.startupAudioContext;
    if (!ctx) {
      return;
    }
    if (ctx.state === "suspended") {
      await ctx.resume().catch(() => {
        // autoplay policy can block this; no-op
      });
    }
    if (ctx.state !== "running") {
      return;
    }

    const baseTime = ctx.currentTime + 0.01;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, baseTime);
    master.gain.exponentialRampToValueAtTime(STARTUP_SPLASH_SOUND_VOLUME, baseTime + 0.05);
    master.gain.exponentialRampToValueAtTime(0.0001, baseTime + 0.6);
    master.connect(ctx.destination);

    const shimmer = ctx.createOscillator();
    shimmer.type = "triangle";
    shimmer.frequency.setValueAtTime(650, baseTime);
    shimmer.frequency.exponentialRampToValueAtTime(1180, baseTime + 0.22);
    shimmer.frequency.exponentialRampToValueAtTime(900, baseTime + 0.56);
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.0001, baseTime);
    shimmerGain.gain.exponentialRampToValueAtTime(0.52, baseTime + 0.08);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, baseTime + 0.56);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(master);
    shimmer.start(baseTime);
    shimmer.stop(baseTime + 0.58);

    const sparkle = ctx.createOscillator();
    sparkle.type = "sine";
    sparkle.frequency.setValueAtTime(1320, baseTime + 0.08);
    sparkle.frequency.exponentialRampToValueAtTime(1700, baseTime + 0.2);
    sparkle.frequency.exponentialRampToValueAtTime(1450, baseTime + 0.48);
    const sparkleGain = ctx.createGain();
    sparkleGain.gain.setValueAtTime(0.0001, baseTime);
    sparkleGain.gain.exponentialRampToValueAtTime(0.36, baseTime + 0.11);
    sparkleGain.gain.exponentialRampToValueAtTime(0.0001, baseTime + 0.5);
    sparkle.connect(sparkleGain);
    sparkleGain.connect(master);
    sparkle.start(baseTime + 0.08);
    sparkle.stop(baseTime + 0.52);
  } catch {
    // startup sound is best effort only
  }
}

function forceHideStartupSplash() {
  if (!refs.startupSplash) {
    return;
  }
  if (state.startupSplashForceTimer) {
    clearTimeout(state.startupSplashForceTimer);
    state.startupSplashForceTimer = 0;
  }
  refs.startupSplash.hidden = true;
  refs.startupSplash.classList.remove("is-leaving");
  refs.startupSplash.classList.remove("is-ending");
  refs.startupSplash.classList.remove("is-replaying");
  document.body.classList.remove("startup-lock");
}

function startStartupSplash() {
  if (!refs.startupSplash) {
    return performance.now();
  }
  refs.startupSplash.hidden = false;
  refs.startupSplash.classList.remove("is-leaving");
  refs.startupSplash.classList.remove("is-ending");
  replayStartupSplashAnimations();
  document.body.classList.add("startup-lock");

  if (state.startupSplashForceTimer) {
    clearTimeout(state.startupSplashForceTimer);
  }
  state.startupSplashForceTimer = window.setTimeout(() => {
    forceHideStartupSplash();
  }, STARTUP_SPLASH_MAX_MS + 1000);

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

  splash.classList.add("is-ending");
  playStartupSplashSound().catch(() => {
    // best effort only
  });
  await new Promise((resolve) => setTimeout(resolve, STARTUP_SPLASH_END_ANIM_MS));
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

  forceHideStartupSplash();
}

function scheduleUiRecovery(reason = "post-boot") {
  if (typeof window === "undefined") {
    return;
  }
  if (window.__zenixUiRecoveryScheduled) {
    return;
  }
  window.__zenixUiRecoveryScheduled = true;

  const runCheck = async () => {
    const cards = document.querySelectorAll(".media-card[data-card-id]").length;
    const hasNav = Array.isArray(refs.navPills) && refs.navPills.length > 0;
    if (cards >= 6 && hasNav) {
      return;
    }
    if (document.body.classList.contains("startup-lock")) {
      document.body.classList.remove("startup-lock");
      const splash = document.getElementById("startupSplash");
      if (splash && !splash.hidden) {
        splash.hidden = true;
        splash.classList.remove("is-leaving", "is-ending", "is-replaying");
      }
    }
    if (!state.loadingCatalog) {
      await refreshGateToken({ force: true }).catch(() => {});
      await loadInitialCatalog().catch(() => {});
      if (state.catalog.length === 0) {
        state.catalog = FALLBACK_ITEMS.slice();
        state.page = 1;
        state.hasMore = false;
      }
      renderAll();
    }
    if (state.discordPromptReady) {
      maybeShowDiscordGate({ delayMs: 200 });
      scheduleBackupAfterDiscord(BACKUP_PROMPT_DELAY_MS);
    }
    const refreshedCards = document.querySelectorAll(".media-card[data-card-id]").length;
    if (refreshedCards < 4 && !window.__zenixUiRecoveryReloaded) {
      window.__zenixUiRecoveryReloaded = true;
      location.reload();
    }
  };

  setTimeout(runCheck, 5200);
  setTimeout(runCheck, 11000);
}

init().catch((error) => {
  try {
    console.error("Zenix init failed", error);
  } catch {
    // ignore
  }
  if (typeof window !== "undefined") {
    window.__zenixBootError = true;
  }
  scheduleUiRecovery("boot-error");
});

async function init() {
  const splashStartedAt = startStartupSplash();
  applyRuntimeBrowserHints();
  initPerfTierMonitor();
  scheduleNativeAdWarmup();
  pruneProgressEntries();
  applyUiPrefs({ syncControls: true });
  if (refs.footerVersion) {
    refs.footerVersion.textContent = "c201";
  }
  updateNetworkBadge();
  startOnlineCountPolling();
  cleanupLegacyServiceWorker().catch(() => {
    // cleanup best effort only
  });
  bindEvents();
  initExternalNavigationGuard();
  initAdblockGuard();
  initDiscordGate();
  initBackupGate();
  loadAnnouncement();
  refreshSuggestionClientTimestamp();
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
  initSectionRevealObserver();
  scheduleDesktopMainNavFit(0);
  if (document.fonts?.ready && typeof document.fonts.ready.then === "function") {
    document.fonts.ready
      .then(() => {
        scheduleDesktopMainNavFit(0);
      })
      .catch(() => {
        // best effort only
      });
  }
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
  keepVisibleRootUrl({ replace: true });
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
  state.discordPromptReady = true;
  maybeShowDiscordGate({ delayMs: 420 });
  scheduleBackupAfterDiscord(BACKUP_PROMPT_DELAY_MS);
  initFloatingNotificationGuard();
  if (typeof window !== "undefined") {
    window.__zenixBooted = true;
  }
  scheduleUiRecovery("post-boot");
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

  const moveThreshold = Math.max(4, Number(options.moveThreshold || 10));
  const scrollThreshold = Math.max(2, Number(options.scrollThreshold || 8));
  const tapTimeoutMs = Math.max(120, Number(options.tapTimeoutMs || 640));
  const dedupeMs = Math.max(120, Number(options.dedupeMs || 360));

  let activePointerId = null;
  let startX = 0;
  let startY = 0;
  let startScrollX = 0;
  let startScrollY = 0;
  let startAt = 0;
  let moved = false;
  let lastTouchTapAt = 0;
  let ignoreClickUntil = 0;

  const clearPointer = () => {
    activePointerId = null;
    startX = 0;
    startY = 0;
    startScrollX = 0;
    startScrollY = 0;
    startAt = 0;
    moved = false;
  };

  const suppressGhostClick = (event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    if (event && typeof event.stopPropagation === "function") {
      event.stopPropagation();
    }
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
      startScrollX = Number(window.scrollX || window.pageXOffset || 0);
      startScrollY = Number(window.scrollY || window.pageYOffset || 0);
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
      ignoreClickUntil = Date.now() + dedupeMs;
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
      const scrollDeltaX = Math.abs((Number(window.scrollX || window.pageXOffset || 0) || 0) - startScrollX);
      const scrollDeltaY = Math.abs((Number(window.scrollY || window.pageYOffset || 0) || 0) - startScrollY);
      if (scrollDeltaX > scrollThreshold || scrollDeltaY > scrollThreshold) {
        moved = true;
      }
      const duration = Date.now() - startAt;
      const shouldTrigger = !moved && duration <= tapTimeoutMs;
      clearPointer();
      if (!shouldTrigger) {
        ignoreClickUntil = Date.now() + dedupeMs;
        return;
      }
      lastTouchTapAt = Date.now();
      ignoreClickUntil = lastTouchTapAt + dedupeMs;
      callback(event);
    },
    { passive: true }
  );

  target.addEventListener("click", (event) => {
    const now = Date.now();
    if (now - lastTouchTapAt < dedupeMs || now < ignoreClickUntil) {
      suppressGhostClick(event);
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

  refs.navSubItems.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view || "all";
      closeNavGroups();
      handleViewSelection(view);
    });
  });

  refs.navToggles.forEach((button) => {
    let lastTouchAt = 0;
    const handler = (event) => {
      event.stopPropagation();
      event.preventDefault();
      const group = button.closest(".nav-group");
      toggleNavGroup(group);
    };
    button.addEventListener(
      "touchstart",
      (event) => {
        lastTouchAt = Date.now();
        handler(event);
      },
      { passive: false }
    );
    button.addEventListener("click", (event) => {
      if (Date.now() - lastTouchAt < 550) {
        event.preventDefault();
        return;
      }
      handler(event);
    });
  });

  refs.mobileTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const view = String(button.dataset.mobileView || "all");
      handleViewSelection(view);
    });
  });

  if (refs.navOverflowBtn) {
    refs.navOverflowBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleNavOverflowMenu();
    });
  }

  if (refs.navOverflowList) {
    refs.navOverflowList.addEventListener("click", (event) => {
      const target = event.target instanceof HTMLElement ? event.target.closest(".nav-overflow-item[data-view]") : null;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const view = String(target.dataset.view || "all");
      closeNavOverflowMenu();
      handleViewSelection(view);
    });
  }

  if (refs.navSubmenuBackdrop) {
    bindFastPress(refs.navSubmenuBackdrop, () => {
      closeNavGroups();
    });
  }

  if (refs.navSubmenuCloseBtn) {
    bindFastPress(refs.navSubmenuCloseBtn, () => {
      closeNavGroups();
    });
  }

  if (refs.navSubmenuList) {
    refs.navSubmenuList.addEventListener("click", (event) => {
      const target = event.target instanceof HTMLElement ? event.target.closest(".nav-submenu-sheet-item[data-view]") : null;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const view = String(target.dataset.view || "all");
      closeNavGroups();
      handleViewSelection(view);
    });
  }

  document.addEventListener(
    "click",
    (event) => {
      if (!state.navOverflowOpen || !(event.target instanceof HTMLElement)) {
        return;
      }
      if (event.target.closest("#navOverflow")) {
        return;
      }
      closeNavOverflowMenu();
    },
    { capture: true }
  );
  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      if (event.target.closest(".nav-group")) {
        return;
      }
      closeNavGroups();
    },
    { capture: true }
  );

  window.addEventListener(
    "resize",
    () => {
      scheduleDesktopMainNavFit(50);
    },
    { passive: true }
  );

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

  if (refs.recommendationBackBtn) {
    refs.recommendationBackBtn.addEventListener("click", () => {
      state.recommendation.step = Math.max(0, Number(state.recommendation.step || 0) - 1);
      renderRecommendationView();
    });
  }

  if (refs.recommendationResetBtn) {
    refs.recommendationResetBtn.addEventListener("click", () => {
      resetRecommendationState({ resetSeed: true });
    });
  }

  if (refs.recommendationRestartBtn) {
    refs.recommendationRestartBtn.addEventListener("click", () => {
      resetRecommendationState({ resetSeed: true });
    });
  }

  if (refs.suggestionForm) {
    refs.suggestionForm.addEventListener("submit", (event) => {
      submitSuggestionFromInfo(event).catch(() => {
        setSuggestionStatus("Envoi impossible pour le moment.", true);
        showToast("Envoi impossible pour le moment.", true);
        setSuggestionSubmitting(false);
      });
    });
  }

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

  if (refs.emptyResetFiltersBtn) {
    bindFastPress(refs.emptyResetFiltersBtn, () => {
      state.query = "";
      state.chip = "all";
      state.sortBy = "featured";
      state.view = "all";
      refs.searchInput.value = "";
      renderFilterChips();
      setActiveNav("all");
      renderAll();
    });
  }

  if (refs.themeSwitchBtn) {
    bindFastPress(refs.themeSwitchBtn, () => {
      state.uiPrefs.theme = getNextUiTheme(state.uiPrefs.theme);
      saveUiPrefs(state.uiPrefs);
      applyUiPrefs({ syncControls: true });
      renderAll();
    });
  }

  if (refs.motionToggleBtn) {
    bindFastPress(refs.motionToggleBtn, () => {
      state.uiPrefs.reduceMotion = !Boolean(state.uiPrefs.reduceMotion);
      saveUiPrefs(state.uiPrefs);
      applyUiPrefs({ syncControls: true });
      showToast(isReducedMotionEnabled() ? "Animations reduites." : "Animations activees.");
    });
  }

  if (refs.themeFilterToggleBtn) {
    bindFastPress(refs.themeFilterToggleBtn, (event) => {
      event?.stopPropagation?.();
      toggleThemeFilterPanel();
    });
  }
  if (refs.themeFilterClearBtn) {
    bindFastPress(refs.themeFilterClearBtn, () => {
      const activeSet = getActiveThemeFilterSet();
      if (activeSet && activeSet.size > 0) {
        activeSet.clear();
        renderThemeFilters();
        renderAll();
      }
    });
  }
  if (refs.themeFilterApplyBtn) {
    bindFastPress(refs.themeFilterApplyBtn, () => {
      setThemeFilterPanelOpen(false);
    });
  }
  if (refs.themeFilterBackdrop) {
    bindFastPress(refs.themeFilterBackdrop, () => {
      setThemeFilterPanelOpen(false);
    });
  }
  document.addEventListener(
    "click",
    (event) => {
      if (!isThemeFilterPanelOpen() || !(event.target instanceof HTMLElement)) {
        return;
      }
      if (event.target.closest("#catalogFilterShell")) {
        return;
      }
      setThemeFilterPanelOpen(false);
    },
    { capture: true }
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setThemeFilterPanelOpen(false);
    }
  });

  if (refs.openDesignUpdatesBtn) {
    bindFastPress(refs.openDesignUpdatesBtn, () => {
      const currentlyHidden = Boolean(refs.designUpdatesSection?.hidden);
      if (refs.designUpdatesSection) {
        refs.designUpdatesSection.hidden = !currentlyHidden;
      }
      if (currentlyHidden) {
        refs.designUpdatesSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  refs.sortSelect.addEventListener("change", (event) => {
    const nextSort = String(event.target.value || "featured");
    if (nextSort === "random" && state.sortBy !== "random") {
      state.randomSortSeed = Date.now();
    }
    state.sortBy = nextSort;
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

  bindFastPress(refs.resumeLastBtn, () => {
    resumeLastPlayback().catch(() => {
      showToast("Aucune lecture recente a reprendre.", true);
    });
  });

  bindFastPress(refs.randomPlayBtn, () => {
    const pool = getVisibleCatalog();
    if (pool.length === 0) {
      showToast("Aucun titre disponible pour une lecture aleatoire.", true);
      return;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    openPlayer(pick.id).catch(() => {
      showToast("Lecture aleatoire indisponible.", true);
    });
  });

  bindFastPress(refs.exportListBtn, () => {
    exportFavoritesAsJson();
  });

  bindFastPress(refs.importListBtn, () => {
    if (!refs.importListInput) {
      return;
    }
    refs.importListInput.value = "";
    refs.importListInput.click();
  });

  refs.importListInput?.addEventListener("change", () => {
    importFavoritesFromInput().catch(() => {
      showToast("Import impossible. Verifie le fichier JSON.", true);
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

  bindFastPress(refs.toggleHideWatchedBtn, () => {
    state.uiPrefs.hideWatched = !Boolean(state.uiPrefs.hideWatched);
    saveUiPrefs(state.uiPrefs);
    applyUiPrefs({ syncControls: true });
    renderAll();
  });

  bindFastPress(refs.toggleNewOnlyBtn, () => {
    state.uiPrefs.newOnly = !Boolean(state.uiPrefs.newOnly);
    saveUiPrefs(state.uiPrefs);
    applyUiPrefs({ syncControls: true });
    renderAll();
  });

  bindFastPress(refs.toggleVfOnlyBtn, () => {
    const next = !Boolean(state.uiPrefs.vfOnly);
    state.uiPrefs.vfOnly = next;
    if (next) {
      state.uiPrefs.vostOnly = false;
    }
    saveUiPrefs(state.uiPrefs);
    applyUiPrefs({ syncControls: true });
    renderAll();
  });

  bindFastPress(refs.toggleVostOnlyBtn, () => {
    const next = !Boolean(state.uiPrefs.vostOnly);
    state.uiPrefs.vostOnly = next;
    if (next) {
      state.uiPrefs.vfOnly = false;
    }
    saveUiPrefs(state.uiPrefs);
    applyUiPrefs({ syncControls: true });
    renderAll();
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

  bindFastPress(refs.detailLikeBtn, () => {
    if (!state.selectedDetailId) {
      return;
    }
    toggleLike(state.selectedDetailId);
    updateDetailRatingButtons(state.selectedDetailId);
  });

  bindFastPress(refs.detailDislikeBtn, () => {
    if (!state.selectedDetailId) {
      return;
    }
    toggleDislike(state.selectedDetailId);
    updateDetailRatingButtons(state.selectedDetailId);
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
    syncDetailLanguageOptions(id, season, selectedEpisode)
      .then((result) => {
        if (!result || state.selectedDetailId !== id) {
          return;
        }
        if (result.compatibility) {
          setDetailCompatibilityBadge(result.compatibility);
        }
      })
      .catch(() => {
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
    syncDetailLanguageOptions(id, season, episode)
      .then((result) => {
        if (!result || state.selectedDetailId !== id) {
          return;
        }
        if (result.compatibility) {
          setDetailCompatibilityBadge(result.compatibility);
        }
      })
      .catch(() => {
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
    } else {
      state.selectedLanguageByMedia.delete(id);
      state.detailLangCache.delete(id);
    }
    saveLanguagePrefsMap(state.selectedLanguageByMedia);
  });

  bindFastPress(refs.playerCloseBtn, () => {
    closePlayer();
  }, { stopPropagation: true });
  refs.playerOverlay.addEventListener("click", (event) => {
    if (event.target === refs.playerOverlay) {
      closePlayer();
    }
  });

  if (refs.playerSeasonSelect) {
    refs.playerSeasonSelect.addEventListener("change", () => {
      if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
        return;
      }
      const mediaId = Number(state.nowPlaying.id || 0);
      const season = Number(refs.playerSeasonSelect?.value || "1");
      const seasons = state.seasonsCache.get(mediaId) || [];
      const episodes = getEpisodesForSeason(seasons, season);
      const episode = getFirstPlayableEpisode(episodes);
      populateEpisodeSelect(refs.playerEpisodeSelect, episodes, episode);
      const language = String(refs.playerLanguageSelect?.value || "").trim();
      updatePlayerNextEpisodeButton();
      verifySoonEpisodesForSeason(mediaId, season, episodes)
        .then((changed) => {
          if (!changed || Number(state.nowPlaying?.id || 0) !== mediaId) {
            return;
          }
          if (Number(refs.playerSeasonSelect?.value || "0") !== season) {
            return;
          }
          const currentEpisode = Number(refs.playerEpisodeSelect?.value || episode);
          populateEpisodeSelect(refs.playerEpisodeSelect, episodes, currentEpisode);
          updatePlayerNextEpisodeButton();
        })
        .catch(() => {
          // no-op
        });
      switchPlayerEpisode(season, episode, { language }).catch(() => {
        showMessage("Impossible de charger cet episode.", true);
      });
    });
  }

  if (refs.playerEpisodeSelect) {
    refs.playerEpisodeSelect.addEventListener("change", () => {
      if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
        return;
      }
      const season = Number(refs.playerSeasonSelect?.value || "1");
      const episode = Number(refs.playerEpisodeSelect?.value || "1");
      const language = String(refs.playerLanguageSelect?.value || "").trim();
      switchPlayerEpisode(season, episode, { language }).catch(() => {
        showMessage("Impossible de charger cet episode.", true);
      });
      updatePlayerNextEpisodeButton();
    });
  }

  if (refs.playerLanguageSelect) {
    refs.playerLanguageSelect.addEventListener("change", () => {
      if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
        return;
      }
      const season = Number(refs.playerSeasonSelect?.value || "1");
      const episode = Number(refs.playerEpisodeSelect?.value || "1");
      const language = String(refs.playerLanguageSelect?.value || "").trim();
      if (language) {
        state.selectedLanguageByMedia.set(state.nowPlaying.id, language);
      } else {
        state.selectedLanguageByMedia.delete(state.nowPlaying.id);
      }
      saveLanguagePrefsMap(state.selectedLanguageByMedia);
      switchPlayerEpisode(season, episode, { language }).catch(() => {
        showMessage("Impossible de charger cet episode.", true);
      });
      updatePlayerNextEpisodeButton();
    });
  }

  if (refs.playerNextEpisodeBtn) {
    bindFastPress(refs.playerNextEpisodeBtn, () => {
      if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
        return;
      }
      const mediaId = Number(state.nowPlaying.id || 0);
      const seasons = state.seasonsCache.get(mediaId) || [];
      const currentSeason = Number(refs.playerSeasonSelect?.value || state.nowPlaying.season || 1);
      const currentEpisode = Number(refs.playerEpisodeSelect?.value || state.nowPlaying.episode || 1);
      const next = resolveNextPlayableEpisode(seasons, currentSeason, currentEpisode);
      if (!next) {
        showToast("Prochain episode pas encore disponible.", false);
        updatePlayerNextEpisodeButton();
        return;
      }
      if (refs.playerSeasonSelect) {
        refs.playerSeasonSelect.value = String(next.season);
      }
      const episodes = getEpisodesForSeason(seasons, next.season);
      if (refs.playerEpisodeSelect) {
        populateEpisodeSelect(refs.playerEpisodeSelect, episodes, next.episode);
      }
      verifySoonEpisodesForSeason(mediaId, next.season, episodes)
        .then((changed) => {
          if (!changed || Number(state.nowPlaying?.id || 0) !== mediaId) {
            return;
          }
          if (Number(refs.playerSeasonSelect?.value || "0") !== next.season) {
            return;
          }
          const current = Number(refs.playerEpisodeSelect?.value || next.episode);
          populateEpisodeSelect(refs.playerEpisodeSelect, episodes, current);
        })
        .catch(() => {
          // no-op
        });
      const language = String(refs.playerLanguageSelect?.value || state.nowPlaying.language || "");
      switchPlayerEpisode(next.season, next.episode, { language }).catch(() => {
        showMessage("Impossible de charger cet episode.", true);
      });
      updatePlayerNextEpisodeButton();
    });
  }

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

  if (refs.playerRepairBtn) {
    bindFastPress(refs.playerRepairBtn, () => {
      runPlayerRepair().catch(() => {
        if (refs.playerRepairStatus) {
          refs.playerRepairStatus.textContent = "Reparation impossible pour le moment.";
        }
        refs.playerRepairBtn.disabled = false;
        refs.playerRepairBtn.classList.remove("is-loading");
      });
    });
  }

  refs.playerVideo.addEventListener("timeupdate", onPlayerProgress);
  refs.playerVideo.addEventListener("loadedmetadata", () => {
    updateActiveSourceLanguageFromPlayback(refs.playerVideo);
  });
  refs.playerVideo.addEventListener("canplay", () => {
    updateActiveSourceLanguageFromPlayback(refs.playerVideo);
  });
  refs.playerVideo.addEventListener("play", () => {
    clearAwaitingUserPlay();
    setPlayerLoading(false);
    updateActiveSourceLanguageFromPlayback(refs.playerVideo);
  });
  refs.playerVideo.addEventListener("playing", () => {
    clearAwaitingUserPlay();
    setPlayerLoading(false);
    updateActiveSourceLanguageFromPlayback(refs.playerVideo);
  });
  refs.playerVideo.addEventListener("pause", () => {
    saveNowPlayingProgress({ force: true });
    if (state.segmentFallback) {
      return;
    }
    const currentSource = state.sourcePool[state.sourceIndex] || null;
    if (isEmbedSource(currentSource)) {
      return;
    }
    const errorCode = Number(refs.playerVideo?.error?.code || 0);
    const nearStart = Number(refs.playerVideo?.currentTime || 0) < 1;
    if (
      errorCode > 0 &&
      nearStart &&
      !refs.playerOverlay.hidden &&
      !state.sourceLoading &&
      !isManualSourceLockActive()
    ) {
      window.setTimeout(() => {
        if (refs.playerOverlay.hidden || state.sourceLoading || isManualSourceLockActive()) {
          return;
        }
        const stillErrorCode = Number(refs.playerVideo?.error?.code || 0);
        if (stillErrorCode <= 0) {
          return;
        }
        trySwitchToNextSource().catch(() => {
          setPlayerStatus("Source indisponible. Aucun secours disponible.", true);
        });
      }, 140);
    }
  });
  refs.playerVideo.addEventListener("seeked", () => {
    saveNowPlayingProgress({ force: true });
  });
  refs.playerVideo.addEventListener("ended", onPlayerEnded);
  refs.playerVideo.addEventListener("error", () => {
    if (shouldIgnoreVideoErrorFallback()) {
      return;
    }
    handlePlayerPlaybackError().catch(() => {
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
  bindFastPress(refs.playerRetryBtn, () => {
    retryCurrentSource({ allowFallback: true })
      .then(() => {
        showToast("Source relancee.");
      })
      .catch(() => {
        showToast("Reessai impossible sur ce titre.", true);
      });
  });
  bindFastPress(refs.playerSkipIntroBtn, () => {
    const duration = Number(refs.playerVideo.duration || 0);
    const next = Number(refs.playerVideo.currentTime || 0) + SKIP_INTRO_SECONDS;
    refs.playerVideo.currentTime = Number.isFinite(duration) && duration > 0 ? Math.min(duration, next) : next;
  });
  bindFastPress(refs.playerSkipRecapBtn, () => {
    const duration = Number(refs.playerVideo.duration || 0);
    const next = Number(refs.playerVideo.currentTime || 0) + SKIP_RECAP_SECONDS;
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

    if (refs.playerOverlay.hidden && refs.detailModal.hidden && !typing) {
      const key = String(event.key || "").toLowerCase();
      if (key === "r") {
        event.preventDefault();
        const pool = getVisibleCatalog();
        if (pool.length === 0) {
          return;
        }
        const pick = pool[Math.floor(Math.random() * pool.length)];
        openDetails(pick.id).catch(() => {
          showToast("Suggestion indisponible.", true);
        });
      } else if (key === "s") {
        event.preventDefault();
        refs.refreshNowBtn?.click();
      } else if (key === "l") {
        event.preventDefault();
        handleViewSelection("list");
      } else if (key === "t") {
        event.preventDefault();
        handleViewSelection("top");
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

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) {
      return;
    }
    const splashStartedAt = startStartupSplash();
    completeStartupSplash(splashStartedAt).catch(() => {
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
      syncOnlineCount({ reason: "visibility" }).catch(() => {
        // best effort
      });
      updateScrollUI();
      consumePendingCatalogUpdate();
      scheduleScrollDrivenCatalogSync({ immediate: true });
    }
  });

  window.addEventListener("online", () => {
    state.networkOnline = true;
    updateNetworkBadge();
    syncOnlineCount({ reason: "online" }).catch(() => {
      // best effort
    });
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
  const normalizedView = view === "catalog" || view === "search" || view === "interest" ? "all" : view;
  state.view = normalizedView;
  closeNavGroups();
  if (normalizedView === "recommendation") {
    state.query = "";
  }
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
  const normalizedView = view === "catalog" || view === "search" || view === "interest" ? "all" : view;
  const groupedViews = new Set(["calendar", "latest", "popular", "top", "list", "recommendation"]);
  const group = normalizedView === "info" ? "info" : groupedViews.has(normalizedView) ? "discover" : "";
  const hasMatch = refs.navPills.some((entry) => (entry.dataset.view || "") === normalizedView);
  const targetView = hasMatch ? normalizedView : "all";
  refs.navPills.forEach((entry) => {
    entry.classList.toggle("active", (entry.dataset.view || "") === targetView);
  });
  refs.navGroups.forEach((entry) => {
    const key = String(entry.dataset.navGroup || "");
    const button = entry.querySelector(".nav-pill");
    const isActive = key && key === group;
    entry.classList.toggle("active", isActive);
    if (button) {
      button.classList.toggle("active", isActive);
    }
  });
  refs.navSubItems.forEach((entry) => {
    entry.classList.toggle("active", (entry.dataset.view || "") === normalizedView);
  });
  refs.mobileTabs.forEach((entry) => {
    const candidate = String(entry.dataset.mobileView || "all");
    const mobileTarget = ["top", "movie", "tv", "list"].includes(normalizedView) ? normalizedView : "all";
    entry.classList.toggle("active", candidate === mobileTarget);
  });
  closeNavOverflowMenu();
  scheduleDesktopMainNavFit(10);
  updateNavActiveIndicator();
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
    ? { initialPages: 6, activeBatch: 8, manualBatch: 12, scrollBatch: 10 }
    : { initialPages: 5, activeBatch: 7, manualBatch: 11, scrollBatch: 9 };

  if (view === "movie" || view === "tv" || view === "anime") {
    return scaleCatalogProfile(
      tune(
      compact
      ? { initialPages: 8, activeBatch: 10, manualBatch: 14, scrollBatch: 12 }
      : { initialPages: 7, activeBatch: 9, manualBatch: 13, scrollBatch: 11 }
    ));
  }
  if (view === "latest" || view === "popular") {
    return scaleCatalogProfile(
      tune(
      compact
      ? { initialPages: 7, activeBatch: 9, manualBatch: 13, scrollBatch: 11 }
      : { initialPages: 6, activeBatch: 8, manualBatch: 12, scrollBatch: 10 }
    ));
  }
  return scaleCatalogProfile(tune(defaults));
}

function getLoadedCatalogPage() {
  return Math.max(0, Number(state.page || 0), Number(state.catalogSyncPage || 0));
}

function resolveCatalogViewForSearch() {
  const query = String(state.query || "").trim();
  if (query.length === 0) {
    return state.view === "recommendation" ? "all" : state.view;
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

function clampIntRange(value, min, max) {
  const safe = Number(value);
  if (!Number.isFinite(safe)) {
    return min;
  }
  if (safe < min) {
    return min;
  }
  if (safe > max) {
    return max;
  }
  return Math.round(safe);
}

function resolvePerfTier() {
  if (isSlowConnection()) {
    return "low";
  }
  const memory = Number(navigator.deviceMemory || 0);
  const cores = Number(navigator.hardwareConcurrency || 0);
  if ((memory > 0 && memory <= 4) || (cores > 0 && cores <= 4)) {
    return "low";
  }
  if ((memory >= 12 && cores >= 8) || (memory >= 16 || cores >= 12)) {
    return "high";
  }
  if (memory >= 8 && cores >= 8) {
    return "high";
  }
  return "mid";
}

function updatePerfTier() {
  state.perfTier = resolvePerfTier();
}

function getPerfScale() {
  const tier = state.perfTier || resolvePerfTier();
  if (tier === "high") {
    return 1.15;
  }
  if (tier === "low") {
    return 0.78;
  }
  return 1;
}

function scaleCatalogProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return profile;
  }
  const scale = getPerfScale();
  if (scale === 1) {
    return profile;
  }
  return {
    initialPages: clampIntRange(Math.round(Number(profile.initialPages || 2) * scale), 2, 16),
    activeBatch: clampIntRange(Math.round(Number(profile.activeBatch || 2) * scale), 2, 24),
    manualBatch: clampIntRange(Math.round(Number(profile.manualBatch || 3) * scale), 3, 30),
    scrollBatch: clampIntRange(Math.round(Number(profile.scrollBatch || 2) * scale), 2, 26),
  };
}

function scaleImageProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return profile;
  }
  const scale = getPerfScale();
  if (scale === 1) {
    return profile;
  }
  return {
    eagerLimit: clampIntRange(Math.round(Number(profile.eagerLimit || 0) * scale), 48, 900),
    highPriorityLimit: clampIntRange(Math.round(Number(profile.highPriorityLimit || 0) * scale), 24, 520),
  };
}

function getSupplementalPerPage() {
  const compact = isCompactViewport();
  const base = compact ? 84 : 96;
  const scale = getPerfScale();
  const scaled = scale >= 1 ? base * Math.min(1.2, scale) : base * Math.max(0.82, scale);
  return clampIntRange(Math.round(scaled), 60, 140);
}

function isAutoNextEnabled() {
  return state.uiPrefs.autoNextEpisode !== false;
}

function syncToggleControl(button, label, enabled) {
  if (!button) {
    return;
  }
  button.textContent = `${label}: ${enabled ? "ON" : "OFF"}`;
  button.classList.toggle("is-active", Boolean(enabled));
}

function syncUiToggleButtons() {
  syncToggleControl(refs.toggleCompactBtn, "Mode compact", Boolean(state.uiPrefs.compactCards));
  syncToggleControl(refs.toggleAutonextBtn, "Auto-episode", isAutoNextEnabled());
  syncToggleControl(refs.toggleHideWatchedBtn, "Masquer vus", Boolean(state.uiPrefs.hideWatched));
  syncToggleControl(refs.toggleNewOnlyBtn, "Nouveautes", Boolean(state.uiPrefs.newOnly));
  syncToggleControl(refs.toggleVfOnlyBtn, "VF", Boolean(state.uiPrefs.vfOnly));
  syncToggleControl(refs.toggleVostOnlyBtn, "VOSTFR", Boolean(state.uiPrefs.vostOnly));
  if (refs.themeSwitchBtn) {
    const label = normalizeThemeName(state.uiPrefs.theme);
    refs.themeSwitchBtn.textContent = `Theme: ${label.charAt(0).toUpperCase()}${label.slice(1)}`;
  }
  if (refs.motionToggleBtn) {
    refs.motionToggleBtn.textContent = `Animations: ${isReducedMotionEnabled() ? "OFF" : "ON"}`;
    refs.motionToggleBtn.classList.toggle("is-active", !isReducedMotionEnabled());
  }
}

function applyUiPrefs(options = {}) {
  if (state.uiPrefs.vfOnly && state.uiPrefs.vostOnly) {
    state.uiPrefs.vostOnly = false;
    saveUiPrefs(state.uiPrefs);
  }
  const compact = Boolean(state.uiPrefs.compactCards);
  document.body.classList.toggle("compact-cards", compact);
  applyUiThemeClass();
  applyUiMotionClass();

  const rate = Number(state.uiPrefs.playbackRate || 1);
  if (refs.playerSpeedSelect) {
    const normalized = Number.isFinite(rate) && rate >= 0.5 && rate <= 3 ? rate : 1;
    refs.playerSpeedSelect.value = String(normalized);
  }

  if (options.syncControls !== false) {
    syncUiToggleButtons();
  }
}

function initPerfTierMonitor() {
  updatePerfTier();
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection && typeof connection.addEventListener === "function") {
    connection.addEventListener("change", updatePerfTier);
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

function getOnlineCountValue() {
  const count = Number(state.onlineCount || 0);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

function getOnlineCountDisplay() {
  const count = getOnlineCountValue();
  const base = ONLINE_COUNT_BASE;
  return base + Math.max(0, count);
}

function getOnlineCountSuffix() {
  if (!state.onlineCountUpdatedAt) {
    return "+";
  }
  if (Date.now() - state.onlineCountUpdatedAt > ONLINE_COUNT_STALE_MS) {
    return "+";
  }
  return "";
}

function updateNetworkBadge() {
  const online = navigator.onLine !== false;
  state.networkOnline = online;
  if (refs.networkBadge) {
    if (!online) {
      refs.networkBadge.textContent = "Hors ligne";
      refs.networkBadge.classList.add("offline");
    } else {
      const displayCount = getOnlineCountDisplay();
      const suffix = getOnlineCountSuffix();
      refs.networkBadge.textContent = `Total en lignes: ${displayCount}${suffix}`;
      refs.networkBadge.classList.remove("offline");
    }
  }
  if (refs.footerNetworkState) {
    refs.footerNetworkState.textContent = online ? "En ligne" : "Hors ligne";
  }
}

async function syncOnlineCount(options = {}) {
  if (state.onlineCountInFlight) {
    return;
  }
  if (navigator.onLine === false) {
    updateNetworkBadge();
    return;
  }
  state.onlineCountInFlight = true;
  try {
    const payload = await fetchJson(`${API_BASE}/analytics/online`, { timeoutMs: 6000 });
    const count = Math.max(0, Number(payload?.activeNow ?? payload?.active ?? 0));
    if (Number.isFinite(count)) {
      state.onlineCount = count;
      state.onlineCountUpdatedAt = Date.now();
    }
  } catch {
    // best effort
  } finally {
    state.onlineCountInFlight = false;
    updateNetworkBadge();
  }
}

function startOnlineCountPolling() {
  if (state.onlineCountTimer) {
    clearInterval(state.onlineCountTimer);
    state.onlineCountTimer = 0;
  }
  syncOnlineCount({ reason: "startup" }).catch(() => {
    // best effort
  });
  state.onlineCountTimer = window.setInterval(() => {
    syncOnlineCount({ reason: "interval" }).catch(() => {
      // best effort
    });
  }, ONLINE_COUNT_POLL_MS);
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
    refs.backToTopBtn.hidden = isCompactViewport() || y < 420;
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
  trackSearchSignal(query);
  const next = [query, ...state.recentSearches.filter((entry) => entry.toLowerCase() !== query.toLowerCase())].slice(
    0,
    RECENT_SEARCHES_LIMIT
  );
  state.recentSearches = next;
  saveRecentSearches(next);
}

function pruneSearchSignalsStore(store) {
  const source = store && typeof store === "object" ? store : {};
  const now = Date.now();
  const rows = Object.entries(source)
    .map(([key, value]) => {
      const normalizedKey = normalizeTitleKey(key);
      return {
        key: normalizedKey,
        query: String(value?.query || key || "").trim(),
        count: Math.max(0, Number(value?.count || 0)),
        lastAt: Math.max(0, Number(value?.lastAt || 0)),
      };
    })
    .filter((entry) => entry.key.length >= 2 && entry.count > 0)
    .filter((entry) => now - entry.lastAt <= SEARCH_SIGNAL_MAX_AGE_MS)
    .sort((left, right) => {
      if (left.lastAt !== right.lastAt) {
        return right.lastAt - left.lastAt;
      }
      return right.count - left.count;
    })
    .slice(0, SEARCH_SIGNAL_MAX);

  const next = {};
  rows.forEach((entry) => {
    next[entry.key] = {
      query: entry.query || entry.key,
      count: entry.count,
      lastAt: entry.lastAt,
    };
  });
  return next;
}

function trackSearchSignal(value) {
  const query = String(value || "").trim();
  const key = normalizeTitleKey(query);
  if (key.length < 2) {
    return;
  }
  const current = state.searchSignals?.[key];
  const nextCount = Math.min(999, Number(current?.count || 0) + 1);
  state.searchSignals[key] = {
    query: query.slice(0, 140) || key,
    count: nextCount,
    lastAt: Date.now(),
  };
  state.searchSignals = pruneSearchSignalsStore(state.searchSignals);
  saveSearchSignals(state.searchSignals);
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

function ensureNativeAdContainer() {
  if (!refs.nativeAdUnit) {
    return null;
  }
  let frame = refs.nativeAdUnit.querySelector(`iframe.${NATIVE_AD_FRAME_CLASS}`);
  if (!frame) {
    frame = document.createElement("iframe");
    frame.className = NATIVE_AD_FRAME_CLASS;
    frame.title = "Sponsorise";
    frame.loading = "eager";
    frame.setAttribute("fetchpriority", "high");
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.setAttribute("data-native-sponsor", "1");
    frame.setAttribute("sandbox", NATIVE_AD_FRAME_SANDBOX);
    const docHtml = `<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden;min-height:180px;}#${NATIVE_AD_CONTAINER_ID}{width:100%;min-height:180px;}</style></head><body><div id="${NATIVE_AD_CONTAINER_ID}"></div><script async data-cfasync="false" src="${NATIVE_AD_SCRIPT_SRC}"></script></body></html>`;
    frame.srcdoc = docHtml;
    refs.nativeAdUnit.classList.remove("is-loaded");
    frame.addEventListener("load", () => {
      window.setTimeout(() => {
        refs.nativeAdUnit?.classList.add("is-loaded");
      }, 300);
    });
    window.setTimeout(() => {
      refs.nativeAdUnit?.classList.add("is-loaded");
    }, 2400);
    refs.nativeAdUnit.innerHTML = "";
    refs.nativeAdUnit.appendChild(frame);
  }
  return frame;
}

function activateNativeAdIfNeeded() {
  if (state.nativeAdActivated) {
    return true;
  }
  const frame = ensureNativeAdContainer();
  state.nativeAdActivated = Boolean(frame);
  return state.nativeAdActivated;
}

function mountNativeAd(targetMount) {
  if (!targetMount || !refs.nativeAdUnit) {
    return;
  }
  if (refs.nativeAdUnit.parentElement !== targetMount) {
    targetMount.appendChild(refs.nativeAdUnit);
  }
}

function applyNativeAdPlacement() {
  const hasQuery = state.query.trim().length > 0;
  const isPlayerOpen = Boolean(refs.playerOverlay && !refs.playerOverlay.hidden);
  const isDetailOpen = Boolean(refs.detailModal && !refs.detailModal.hidden);
  const isInfoView = !hasQuery && state.view === "info";
  const isCalendarView = state.view === "calendar";
  const isListView = !hasQuery && state.view === "list";
  const isTopView = !hasQuery && state.view === "top";
  const isRecommendationView = !hasQuery && state.view === "recommendation";
  const showBrowseView = !isInfoView && !isCalendarView && !isTopView && !isListView && !isRecommendationView;

  const showNativeDetail = !isPlayerOpen && isDetailOpen;
  const showNativeHome = !showNativeDetail && !isPlayerOpen && showBrowseView && !hasQuery && state.view === "all";
  const showNativeCatalog = !showNativeDetail && !isPlayerOpen && showBrowseView && !hasQuery && state.view !== "all";

  setHidden(refs.nativeAdSection, !showNativeHome);
  setHidden(refs.nativeAdCatalogSection, !showNativeCatalog);
  setHidden(refs.nativeAdDetailSection, !showNativeDetail);

  if (showNativeDetail) {
    mountNativeAd(refs.nativeAdDetailMount);
    activateNativeAdIfNeeded();
    return;
  }
  if (showNativeHome) {
    mountNativeAd(refs.nativeAdHomeMount);
    activateNativeAdIfNeeded();
    return;
  }
  if (showNativeCatalog) {
    mountNativeAd(refs.nativeAdCatalogMount);
    activateNativeAdIfNeeded();
    return;
  }
  mountNativeAd(refs.nativeAdHomeMount);
  activateNativeAdIfNeeded();
}

function scheduleNativeAdWarmup() {
  const delay = state.perfTier === "low" ? 1100 : 420;
  window.setTimeout(() => {
    activateNativeAdIfNeeded();
  }, delay);
}

function hasDiscordPromptSession() {
  try {
    return sessionStorage.getItem(DISCORD_PROMPT_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markDiscordPromptSession() {
  try {
    sessionStorage.setItem(DISCORD_PROMPT_SESSION_KEY, "1");
  } catch {
    // ignore
  }
}

function setDiscordGateVisible(visible) {
  if (!refs.discordGate) {
    return;
  }
  const nextVisible = Boolean(visible);
  refs.discordGate.hidden = !nextVisible;
  state.discordGateVisible = nextVisible;
  document.body.classList.toggle("discord-locked", nextVisible);
  if (nextVisible) {
    markDiscordPromptSession();
  } else if (isLikelyMobileDevice()) {
    activatePostCloseTapGuard(900);
  }
}

function maybeShowDiscordGate(options = {}) {
  if (!refs.discordGate || !state.discordPromptReady) {
    return;
  }
  if (state.adblockDetected || !refs.adblockGate?.hidden) {
    return;
  }
  if (hasDiscordPromptSession()) {
    return;
  }
  if (state.discordGateVisible) {
    return;
  }
  const delayMs = Math.max(0, Number(options.delayMs || 0));
  if (delayMs > 0) {
    window.setTimeout(() => {
      maybeShowDiscordGate({ delayMs: 0 });
    }, delayMs);
    return;
  }
  setDiscordGateVisible(true);
}

function initDiscordGate() {
  if (refs.discordJoinBtn) {
    bindFastPress(refs.discordJoinBtn, () => {
      setDiscordGateVisible(false);
      window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
      scheduleBackupAfterDiscord(600);
    });
  }
  if (refs.discordLaterBtn) {
    bindFastPress(refs.discordLaterBtn, () => {
      setDiscordGateVisible(false);
      scheduleBackupAfterDiscord(600);
    });
  }
}

function hasBackupPromptSession() {
  try {
    return sessionStorage.getItem(BACKUP_PROMPT_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function hasBackupPromptRecent() {
  try {
    const last = Number(localStorage.getItem(BACKUP_PROMPT_STORAGE_KEY) || 0);
    return Number.isFinite(last) && last > 0 && Date.now() - last < BACKUP_PROMPT_TTL_MS;
  } catch {
    return false;
  }
}

function markBackupPromptSeen() {
  try {
    sessionStorage.setItem(BACKUP_PROMPT_SESSION_KEY, "1");
  } catch {
    // ignore
  }
  try {
    localStorage.setItem(BACKUP_PROMPT_STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

function setBackupGateVisible(visible) {
  if (!refs.backupGate) {
    return;
  }
  const nextVisible = Boolean(visible);
  refs.backupGate.hidden = !nextVisible;
  state.backupGateVisible = nextVisible;
  document.body.classList.toggle("backup-locked", nextVisible);
  if (nextVisible) {
    markBackupPromptSeen();
  } else if (isLikelyMobileDevice()) {
    activatePostCloseTapGuard(900);
  }
}

function setBackupGateStatus(message = "") {
  if (!refs.backupGateStatus) {
    return;
  }
  const text = String(message || "").trim();
  if (!text) {
    refs.backupGateStatus.hidden = true;
    refs.backupGateStatus.textContent = "";
    return;
  }
  refs.backupGateStatus.hidden = false;
  refs.backupGateStatus.textContent = text;
}

function maybeShowBackupGate(options = {}) {
  if (!refs.backupGate || !state.backupPromptReady) {
    return;
  }
  if (!hasDiscordPromptSession()) {
    return;
  }
  if (state.adblockDetected || !refs.adblockGate?.hidden) {
    return;
  }
  if (state.discordGateVisible) {
    return;
  }
  if (state.backupGateVisible) {
    return;
  }
  const delayMs = Math.max(0, Number(options.delayMs || 0));
  if (delayMs > 0) {
    window.setTimeout(() => {
      maybeShowBackupGate({ delayMs: 0 });
    }, delayMs);
    return;
  }
  setBackupGateVisible(true);
}

function scheduleBackupAfterDiscord(delayMs = BACKUP_PROMPT_DELAY_MS) {
  const waitMs = Math.max(0, Number(delayMs || 0));
  window.setTimeout(() => {
    if (state.discordGateVisible) {
      scheduleBackupAfterDiscord(700);
      return;
    }
    if (!hasDiscordPromptSession() && state.discordPromptReady) {
      if (!state.discordGateVisible) {
        maybeShowDiscordGate({ delayMs: 0 });
      }
      scheduleBackupAfterDiscord(700);
      return;
    }
    maybeShowBackupGate({ delayMs: 0 });
  }, waitMs);
}

function initBackupGate() {
  state.backupPromptReady = true;
  if (refs.backupGateUrl) {
    refs.backupGateUrl.textContent = BACKUP_PORTAL_URL;
    if (refs.backupGateUrl.tagName === "A") {
      refs.backupGateUrl.href = BACKUP_PORTAL_URL;
    }
  }
  if (refs.backupGateCloseBtn) {
    bindFastPress(refs.backupGateCloseBtn, () => {
      setBackupGateVisible(false);
    });
  }
  if (refs.backupGateOkBtn) {
    bindFastPress(refs.backupGateOkBtn, () => {
      setBackupGateVisible(false);
    });
  }
  if (refs.backupGateBookmarkBtn) {
    const handleBackupBookmark = async () => {
      const url = BACKUP_PORTAL_URL;
      let hinted = false;
      let shared = false;
      const isMobile = isLikelyMobileDevice();
      const wantsShare = isLikelyMobileDevice() && typeof navigator.share === "function";
      if (wantsShare) {
        try {
          await navigator.share({
            title: "Zenix",
            text: "Lien officiel Zenix",
            url,
          });
          shared = true;
          hinted = true;
        } catch {
          // ignore share failures
        }
      }
      if (!shared && !isMobile) {
        const opened = openBackupPortal({ reason: "bookmark" });
        try {
          await copyText(url);
          setBackupGateStatus(
            opened
              ? "Onglet zenix.lol ouvert. Utilise Ctrl+D / Cmd+D dans cet onglet."
              : "Popup bloque. Clique le lien zenix.lol puis Ctrl+D / Cmd+D."
          );
        } catch {
          setBackupGateStatus(
            opened
              ? "Onglet zenix.lol ouvert. Utilise Ctrl+D / Cmd+D dans cet onglet."
              : "Popup bloque. Clique le lien zenix.lol puis Ctrl+D / Cmd+D."
          );
        }
        return;
      }
      if (!shared) {
        try {
          if (window.sidebar && typeof window.sidebar.addPanel === "function") {
            window.sidebar.addPanel("Zenix", url, "");
            hinted = true;
          } else if (window.external && typeof window.external.AddFavorite === "function") {
            window.external.AddFavorite(url, "Zenix");
            hinted = true;
          }
        } catch {
          // ignore
        }
      }
      if (!shared) {
        openBackupPortal();
      }
      try {
        await copyText(url);
        const hint = getBackupBookmarkHint();
        setBackupGateStatus(hinted ? `Lien partage/copie. ${hint}` : `Lien copie. ${hint}`);
      } catch {
        setBackupGateStatus(getBackupBookmarkHint());
      }
    };
    if (isIOSDevice()) {
      refs.backupGateBookmarkBtn.addEventListener("click", (event) => {
        event.preventDefault();
        handleBackupBookmark();
      });
    } else {
      bindFastPress(refs.backupGateBookmarkBtn, handleBackupBookmark);
    }
  }
  if (refs.backupGate) {
    refs.backupGate.addEventListener("click", (event) => {
      if (event.target === refs.backupGate) {
        setBackupGateVisible(false);
      }
    });
  }
}

function setAnnouncementVisible(visible, message = "") {
  if (!refs.announcementBanner || !refs.announcementText) {
    return;
  }
  const nextVisible = Boolean(visible);
  refs.announcementBanner.hidden = !nextVisible;
  if (nextVisible) {
    refs.announcementText.textContent = message;
  }
}

function getAnnouncementDismissKey(message) {
  const safe = String(message || "").trim();
  if (!safe) {
    return "";
  }
  return `zenix-announcement:${safe.slice(0, 120)}`;
}

async function loadAnnouncement() {
  if (!refs.announcementBanner || !refs.announcementText) {
    return;
  }
  try {
    const payload = await fetchJson(`${API_BASE}/announcement`, { timeoutMs: 6000 });
    const data = payload?.data;
    const message = String(data?.message || "").trim();
    if (!message) {
      setAnnouncementVisible(false);
      return;
    }
    const dismissKey = getAnnouncementDismissKey(message);
    if (dismissKey) {
      try {
        if (sessionStorage.getItem(dismissKey) === "1") {
          setAnnouncementVisible(false);
          return;
        }
      } catch {
        // ignore
      }
    }
    setAnnouncementVisible(true, message);
    if (refs.announcementClose) {
      refs.announcementClose.onclick = () => {
        setAnnouncementVisible(false);
        if (dismissKey) {
          try {
            sessionStorage.setItem(dismissKey, "1");
          } catch {
            // ignore
          }
        }
      };
    }
  } catch {
    setAnnouncementVisible(false);
  }
}

function setAdblockGateStatus(message, isError = false) {
  if (!refs.adblockGateStatus) {
    return;
  }
  refs.adblockGateStatus.textContent = String(message || "").trim();
  refs.adblockGateStatus.classList.toggle("is-error", Boolean(isError));
}

function setAdblockGateVisible(visible) {
  if (!refs.adblockGate) {
    return;
  }
  const nextVisible = Boolean(visible);
  refs.adblockGate.hidden = !nextVisible;
  document.body.classList.toggle("adblock-locked", nextVisible);
  if (nextVisible) {
    setDiscordGateVisible(false);
  } else if (isLikelyMobileDevice()) {
    activatePostCloseTapGuard(900);
  }
}

async function detectAdblockBait() {
  if (!document.body) {
    return false;
  }
  const bait = document.createElement("div");
  bait.className = "adsbox ad-banner ad-unit ad-zone pub_300x250 sponsor-ad";
  bait.setAttribute("aria-hidden", "true");
  bait.style.cssText =
    "position:absolute !important;left:-99999px !important;top:-99999px !important;width:1px !important;height:1px !important;pointer-events:none !important;opacity:1 !important;z-index:-1 !important;";
  document.body.appendChild(bait);
  await wait(70);
  const style = window.getComputedStyle(bait);
  const blocked =
    !style ||
    style.display === "none" ||
    style.visibility === "hidden" ||
    Number(style.opacity || 1) === 0 ||
    bait.offsetHeight === 0 ||
    bait.clientHeight === 0 ||
    bait.offsetParent === null;
  bait.remove();
  return blocked;
}

function applyAdblockDetectionState(blocked, options = {}) {
  const nextBlocked = Boolean(blocked);
  const wasBlocked = Boolean(state.adblockDetected);
  state.adblockDetected = nextBlocked;
  setAdblockGateVisible(nextBlocked);
  if (nextBlocked) {
    state.gateReady = false;
    state.gateToken = "";
    saveGateToken("");
setAdblockGateStatus(
      "Desactive ton bloqueur de pub pour continuer, puis clique sur 'Verifier de nouveau'.",
      false
    );
    return;
  }
  setAdblockGateStatus("", false);
  if (wasBlocked && options.manual === true) {
    showToast("Merci. Acces restaure.");
  }
  refreshGateToken({ manual: options.manual === true }).catch(() => {
    // best effort only
  });
  maybeShowDiscordGate({ delayMs: 240 });
}

async function runAdblockDetection(options = {}) {
  if (state.adblockProbeInFlight) {
    return state.adblockDetected;
  }
  state.adblockProbeInFlight = true;
  try {
    const blocked = await detectAdblockBait();
    applyAdblockDetectionState(blocked, options);
    return blocked;
  } catch {
    if (options.manual === true) {
      setAdblockGateStatus("Verification impossible pour le moment. Reessaie.", true);
    }
    return state.adblockDetected;
  } finally {
    state.adblockProbeInFlight = false;
  }
}

function initAdblockGuard() {
  if (refs.adblockRetryBtn) {
    bindFastPress(refs.adblockRetryBtn, () => {
      setAdblockGateStatus("Verification en cours...");
      runAdblockDetection({ manual: true }).catch(() => {
        // handled in runAdblockDetection
      });
    });
  }
  if (state.adblockCheckTimer) {
    clearInterval(state.adblockCheckTimer);
    state.adblockCheckTimer = 0;
  }
  window.setTimeout(() => {
    runAdblockDetection({ manual: false }).catch(() => {
      // best effort only
    });
  }, ADBLOCK_BOOT_DELAY_MS);
  state.adblockCheckTimer = window.setInterval(() => {
    runAdblockDetection({ manual: false }).catch(() => {
      // best effort only
    });
  }, ADBLOCK_MONITOR_INTERVAL_MS);
}

function loadGateProofScript(scriptUrl, nonce) {
  return new Promise((resolve) => {
    if (!scriptUrl || !nonce || !document.head) {
      resolve(null);
      return;
    }
    const script = document.createElement("script");
    const cleanup = () => {
      script.onload = null;
      script.onerror = null;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
    const timer = window.setTimeout(() => {
      cleanup();
      resolve(null);
    }, GATE_PROOF_TIMEOUT_MS);
    script.async = true;
    script.src = scriptUrl;
    script.onload = () => {
      clearTimeout(timer);
      const proof =
        window.__zenixAdNonce === nonce && typeof window.__zenixAdProof === "string"
          ? window.__zenixAdProof
          : null;
      try {
        delete window.__zenixAdNonce;
        delete window.__zenixAdProof;
      } catch {
        // ignore cleanup errors
      }
      cleanup();
      resolve(proof);
    };
    script.onerror = () => {
      clearTimeout(timer);
      cleanup();
      resolve(null);
    };
    document.head.appendChild(script);
  });
}

async function refreshGateToken(options = {}) {
  if (state.adblockDetected && !options.force) {
    return false;
  }
  const force = Boolean(options.force);
  const now = Date.now();
  if (!force && state.gateLastIssuedAt && now - state.gateLastIssuedAt < GATE_REFRESH_COOLDOWN_MS) {
    return state.gateReady;
  }
  if (state.gateIssueInFlight && state.gateIssuePromise) {
    return state.gateIssuePromise;
  }
  state.gateIssueInFlight = true;
  state.gateIssuePromise = (async () => {
    try {
      const challenge = await fetchJson(GATE_CHALLENGE_PATH, {
        timeoutMs: 4500,
        retryDelays: [],
        noCache: true,
      });
      const nonce = String(challenge?.nonce || "");
      const scriptUrl = String(challenge?.script || "");
      if (!nonce || !scriptUrl) {
        throw new Error("Gate challenge invalide");
      }
      const proof = await loadGateProofScript(scriptUrl, nonce);
      if (!proof) {
        applyAdblockDetectionState(true, { manual: Boolean(options.manual) });
        setAdblockGateStatus(
          "Bloqueur de pub detecte. Desactive-le puis clique sur 'Verifier de nouveau'.",
          false
        );
        return false;
      }
      const response = await fetch(GATE_ISSUE_PATH, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ nonce, proof }),
      });
      if (!response.ok) {
        if (response.status === 403) {
          applyAdblockDetectionState(true, { manual: Boolean(options.manual) });
          setAdblockGateStatus(
            "Bloqueur de pub detecte. Desactive-le puis clique sur 'Verifier de nouveau'.",
            false
          );
        }
        state.gateReady = false;
        state.gateToken = "";
        saveGateToken("");
        return false;
      }
      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
      const token = String(payload?.token || "");
      if (token) {
        state.gateToken = token;
        saveGateToken(token);
      }
      state.gateReady = true;
      state.gateLastIssuedAt = Date.now();
      return true;
    } catch (error) {
      if (options.manual) {
        setAdblockGateStatus("Verification pub impossible pour le moment. Reessaie.", true);
      }
      state.gateReady = false;
      return false;
    }
  })();
  try {
    return await state.gateIssuePromise;
  } finally {
    state.gateIssueInFlight = false;
    state.gateIssuePromise = null;
  }
}

function isCompactViewport() {
  if (typeof window.matchMedia === "function") {
    return window.matchMedia(`(max-width: ${MOBILE_VIEWPORT_MAX_WIDTH}px)`).matches;
  }
  return Number(window.innerWidth || 0) <= MOBILE_VIEWPORT_MAX_WIDTH;
}

function isLikelyMobileDevice() {
  const ua = String(navigator.userAgent || "").toLowerCase();
  if (/(iphone|ipod|ipad|android|mobile|windows phone|blackberry)/i.test(ua)) {
    return true;
  }
  const touchPoints = Number(navigator.maxTouchPoints || 0);
  const screenWidth = Number(window.screen?.width || 0);
  if (touchPoints > 1 && screenWidth > 0 && screenWidth <= 1366) {
    return true;
  }
  return isCompactViewport();
}

function isIOSDevice() {
  return /(iphone|ipod|ipad)/i.test(String(navigator.userAgent || ""));
}

function getBackupBookmarkHint() {
  if (isLikelyMobileDevice()) {
    if (isIOSDevice()) {
      return "Sur iPhone: Partager > Ajouter a l'ecran d'accueil ou Ajouter aux favoris.";
    }
    return "Sur Android: menu ⋮ > Ajouter aux favoris ou Ajouter a l'ecran d'accueil.";
  }
  return "Sur PC: Ctrl+D / Cmd+D pour ajouter aux favoris.";
}

function openBackupPortal(options = {}) {
  const target = options?.sameTab ? "_self" : "_blank";
  const url = BACKUP_PORTAL_URL;
  let opened = false;
  try {
    if (refs.backupGateUrl && refs.backupGateUrl.tagName === "A") {
      const anchor = refs.backupGateUrl;
      anchor.rel = "noopener noreferrer";
      anchor.target = target;
      anchor.href = url;
      anchor.click();
      opened = true;
    }
  } catch {
    // ignore
  }
  if (!opened) {
    try {
      const win = window.open(url, target, "noopener,noreferrer");
      opened = Boolean(win);
    } catch {
      // ignore
    }
  }
  return opened;
}

function shouldBoostCoverLoading() {
  const activeView = resolveCatalogViewForSearch();
  return state.query.trim().length === 0 && isCatalogCategoryView(activeView);
}

function getCardImageProfile() {
  const slow = isSlowConnection();
  const boosted = shouldBoostCoverLoading();
  const inAppBrowser = runtimeEnv.isInAppBrowser;
  if (isCompactViewport()) {
    if (boosted) {
      const eagerLimit = inAppBrowser ? 520 : slow ? 160 : 360;
      const highPriorityLimit = inAppBrowser ? 260 : slow ? 68 : 180;
      return scaleImageProfile({
        eagerLimit,
        highPriorityLimit,
      });
    }
    const eagerBase = boosted ? Math.max(220, MOBILE_EAGER_IMAGE_LIMIT) : MOBILE_EAGER_IMAGE_LIMIT;
    const priorityBase = boosted ? Math.max(120, MOBILE_HIGH_PRIORITY_IMAGE_LIMIT) : MOBILE_HIGH_PRIORITY_IMAGE_LIMIT;
    const inAppEager = Math.max(eagerBase, 320);
    const inAppPriority = Math.max(priorityBase, 220);
    return scaleImageProfile({
      eagerLimit: inAppBrowser ? inAppEager : slow ? Math.max(72, Math.floor(eagerBase * 0.62)) : eagerBase,
      highPriorityLimit: inAppBrowser ? inAppPriority : slow ? Math.max(30, Math.floor(priorityBase * 0.64)) : priorityBase,
    });
  }
  const eagerBase = boosted ? Math.max(220, DESKTOP_EAGER_IMAGE_LIMIT) : DESKTOP_EAGER_IMAGE_LIMIT;
  const priorityBase = boosted ? Math.max(96, DESKTOP_HIGH_PRIORITY_IMAGE_LIMIT) : DESKTOP_HIGH_PRIORITY_IMAGE_LIMIT;
  if (boosted) {
    return scaleImageProfile({
      eagerLimit: inAppBrowser ? 620 : slow ? 220 : 420,
      highPriorityLimit: inAppBrowser ? 320 : slow ? 96 : 200,
    });
  }
  const inAppEager = Math.max(eagerBase, 240);
  const inAppPriority = Math.max(priorityBase, 120);
  return scaleImageProfile({
    eagerLimit: inAppBrowser ? inAppEager : slow ? Math.max(58, Math.floor(eagerBase * 0.6)) : eagerBase,
    highPriorityLimit: inAppBrowser ? inAppPriority : slow ? Math.max(24, Math.floor(priorityBase * 0.62)) : priorityBase,
  });
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
  const strictBatch = options.strictBatch === true;
  let batchPages = preferredBatch > 0 ? preferredBatch : Number(profile.activeBatch || 4);
  if (!strictBatch) {
    if (reason === "manual") {
      batchPages = Math.max(batchPages, Number(profile.manualBatch || batchPages));
    } else if (reason === "scroll") {
      batchPages = Math.max(batchPages, Number(profile.scrollBatch || batchPages));
    } else if (reason === "search-assist") {
      batchPages = Math.max(batchPages, SEARCH_ASSIST_STEP_PAGES);
    }
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

function getVisibleCatalogCountSnapshot() {
  try {
    const visible = getVisibleCatalog();
    return Array.isArray(visible) ? visible.length : Number(state.catalog?.length || 0);
  } catch {
    return Number(state.catalog?.length || 0);
  }
}

async function syncCatalogUntilVisibleGain(reason, minVisibleGain, options = {}) {
  const targetGain = Math.max(1, Number(minVisibleGain || 1));
  const maxSteps = Math.max(1, Number(options.maxSteps || 1));
  const batchPages = Math.max(1, Number(options.batchPages || 1));
  const beforeVisible = getVisibleCatalogCountSnapshot();
  let currentVisible = beforeVisible;
  let didSync = false;

  for (let step = 0; step < maxSteps && state.hasMore && currentVisible - beforeVisible < targetGain; step += 1) {
    const synced = await syncCatalogBatch(reason, { batchPages, strictBatch: true });
    if (!synced) {
      break;
    }
    didSync = true;
    currentVisible = getVisibleCatalogCountSnapshot();
  }
  return didSync;
}

function scheduleScrollDrivenCatalogSync(options = {}) {
  const immediate = options.immediate === true;
  const force = options.force === true;
  const nearBottom = isNearCatalogBottom();
  const run = () => {
    state.scrollSyncTimer = 0;
    syncCatalogForScroll({ force })
      .catch(() => {
        // best effort only
      });
  };

  if (state.scrollSyncTimer) {
    if (immediate || nearBottom) {
      clearTimeout(state.scrollSyncTimer);
      state.scrollSyncTimer = 0;
      run();
    }
    return;
  }

  if (immediate || nearBottom) {
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
  const didSync = await syncCatalogUntilVisibleGain("scroll", CATALOG_MIN_VISIBLE_APPEND, {
    maxSteps: CATALOG_VISIBLE_APPEND_MAX_STEPS_SCROLL,
    batchPages: CATALOG_VISIBLE_APPEND_BATCH_PAGES,
  });
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

function createDefaultCalendarTypeFilters() {
  return { film: true, serie: true, anime: true };
}

function sanitizeCalendarTypeFilters(value) {
  const defaults = createDefaultCalendarTypeFilters();
  if (!value || typeof value !== "object") {
    return defaults;
  }
  const next = { ...defaults };
  CALENDAR_TYPE_KEYS.forEach((type) => {
    if (Object.prototype.hasOwnProperty.call(value, type)) {
      next[type] = Boolean(value[type]);
    }
  });
  if (!Object.values(next).some(Boolean)) {
    return defaults;
  }
  return next;
}

function normalizeCalendarMediaType(value) {
  const raw = normalizeTitleKey(value || "");
  if (!raw) {
    return "";
  }
  if (raw === "film" || raw === "movie" || raw === "movies" || raw === "cinema") {
    return "film";
  }
  if (raw === "serie" || raw === "series" || raw === "tv" || raw === "show") {
    return "serie";
  }
  if (raw === "anime" || raw === "scan" || raw === "animation") {
    return "anime";
  }
  return "";
}

function isTruthyDataFlag(value) {
  if (value === true || value === 1) {
    return true;
  }
  const raw = String(value || "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "oui";
}

function hasCalendarAnimationCategory(entry) {
  const rows = Array.isArray(entry?.categories)
    ? entry.categories
    : Array.isArray(entry?.genres)
      ? entry.genres
      : [];
  return rows.some((row) => {
    const label = normalizeTitleKey(row?.name || row?.label || row || "");
    return (
      label.includes("anime") ||
      label.includes("japanimation") ||
      label.includes("dessin anime")
    );
  });
}

function isCalendarAnimeSamaSource(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }
  const explicitSource = normalizeTitleKey(
    [entry?.source, entry?.provider, entry?.origin]
      .map((value) => String(value || "").trim())
      .join(" ")
  );
  if (explicitSource.split(" ").includes("anime")) {
    return true;
  }
  const sourceHint = normalizeTitleKey(
    [
      entry?.source,
      entry?.provider,
      entry?.supplemental,
      entry?.externalProvider,
      entry?.external_provider,
      entry?.externalLabel,
      entry?.external_label,
      entry?.label,
      entry?.kind,
      entry?.category,
    ]
      .map((value) => String(value || "").trim())
      .join(" ")
  );
  if (sourceHint.includes("anime sama") || sourceHint.includes("animesama")) {
    return true;
  }
  const urlHints = [
    entry?.url,
    entry?.externalDetailUrl,
    entry?.external_detail_url,
    entry?.sourceUrl,
    entry?.source_url,
  ]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");
  return /anime-sama\.(tv|to)/i.test(urlHints);
}

function isCalendarLikelyAnime(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }
  const explicit = normalizeCalendarMediaType(
    entry.type || entry.kind || entry.mediaType || entry.media_type || entry.category || ""
  );
  if (explicit === "anime") {
    return true;
  }
  if (isTruthyDataFlag(entry.isAnime) || hasCalendarAnimationCategory(entry)) {
    return true;
  }
  const textHints = [
    entry?.title,
    entry?.supplemental,
    entry?.source,
    entry?.provider,
    entry?.url,
    entry?.externalDetailUrl,
    entry?.external_detail_url,
  ]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");
  return /anime|japanim|animesama|\/anime\//i.test(textHints);
}

function isCalendarSourceAllowedByPolicy(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }
  if (!isCalendarLikelyAnime(entry)) {
    return true;
  }
  return isCalendarAnimeSamaSource(entry);
}

function hasCalendarSeriesSignals(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }
  const season = Number(entry?.season ?? entry?.externalSeason ?? entry?.external_season ?? 0);
  const episode = Number(entry?.episode ?? entry?.externalEpisode ?? entry?.external_episode ?? 0);
  if (season > 0 || episode > 0) {
    return true;
  }
  const textSignals = [
    entry?.title,
    entry?.supplemental,
    entry?.source,
    entry?.url,
    entry?.externalDetailUrl,
    entry?.external_detail_url,
  ]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");
  return (
    /s\d{1,2}\s*e\d{1,3}/i.test(textSignals) ||
    textSignals.includes("episode") ||
    textSignals.includes("saison") ||
    textSignals.includes("/series/") ||
    textSignals.includes("/serie/")
  );
}

function scheduleCalendarTypeReconcile() {
  if (state.calendarTypeReconcileTimer) {
    return;
  }
  state.calendarTypeReconcileTimer = window.setTimeout(() => {
    state.calendarTypeReconcileTimer = 0;
    if (state.view !== "calendar") {
      return;
    }
    renderCalendarSection();
  }, 120);
}

function getCalendarEntryMediaType(entry) {
  if (!entry || typeof entry !== "object") {
    return "film";
  }
  const animeSamaSource = isCalendarAnimeSamaSource(entry);
  if (isCalendarLikelyAnime(entry)) {
    return animeSamaSource ? "anime" : "serie";
  }
  const explicit = normalizeCalendarMediaType(
    entry.type || entry.kind || entry.mediaType || entry.media_type || entry.category || ""
  );
  if (explicit === "film" || explicit === "serie") {
    return explicit;
  }
  if (hasCalendarSeriesSignals(entry)) {
    return "serie";
  }
  const mediaId = Number(entry.mediaId || 0);
  if (mediaId > 0) {
    const resolved = String(state.calendarTypeByMediaId.get(mediaId) || "").trim();
    if (resolved === "anime") {
      return "anime";
    }
    if (resolved === "film" || resolved === "serie") {
      return resolved;
    }
  }
  if (mediaId > 0) {
    const mapped = findItemById(mediaId);
    if (mapped?.isAnime) {
      return animeSamaSource ? "anime" : "serie";
    }
    if (mapped?.type === "tv") {
      return "serie";
    }
    if (mapped?.type === "movie") {
      return "film";
    }
  }
  return "film";
}

function getCalendarEntryAvailabilityStatus(entry) {
  if (!entry || typeof entry !== "object") {
    return "";
  }
  const direct = normalizeAvailabilityStatus(
    entry?.availabilityStatus ||
      entry?.externalStatus ||
      entry?.availability_status ||
      entry?.external_status ||
      entry?.status ||
      ""
  );
  if (direct) {
    return direct;
  }
  if (isTruthyDataFlag(entry?.isPendingUpload ?? entry?.is_pending_upload)) {
    return "pending";
  }
  const dateTs = parseReleaseDate(entry?.dateIso || entry?.releaseDate || entry?.release_date || "");
  if (dateTs > Date.now() + 2 * 60 * 60 * 1000) {
    return "pending";
  }
  return "";
}

function isCalendarEntryPending(entry) {
  return getCalendarEntryAvailabilityStatus(entry) === "pending";
}

function formatCalendarDateLabel(entry) {
  if (!entry || typeof entry !== "object") {
    return "Date inconnue";
  }

  const candidates = [
    entry.dateIso,
    entry.releaseDate,
    entry.release_date,
    entry.airDate,
    entry.air_date,
    entry.date,
    entry.datetime,
  ];
  for (const candidate of candidates) {
    const raw = String(candidate || "").trim();
    if (!raw) {
      continue;
    }
    const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|[ T])/);
    if (isoMatch) {
      const year = Number(isoMatch[1]);
      const month = String(Math.max(1, Math.min(12, Number(isoMatch[2])))).padStart(2, "0");
      const day = String(Math.max(1, Math.min(31, Number(isoMatch[3])))).padStart(2, "0");
      return year === state.calendarYear ? `${day}/${month}` : `${day}/${month}/${year}`;
    }
    const parsed = Date.parse(raw);
    if (!Number.isFinite(parsed)) {
      continue;
    }
    const date = new Date(parsed);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return year === state.calendarYear ? `${day}/${month}` : `${day}/${month}/${year}`;
  }

  const dayNumber = Number(entry.dayNumber || entry.day || entry.number || 0);
  if (Number.isFinite(dayNumber) && dayNumber > 0) {
    const safeDay = String(Math.max(1, Math.min(31, Math.trunc(dayNumber)))).padStart(2, "0");
    const safeMonth = String(state.calendarMonth).padStart(2, "0");
    return `${safeDay}/${safeMonth}`;
  }

  const rawLabel = String(entry.dateLabel || entry.dayName || "").trim();
  return rawLabel || "Date inconnue";
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

  if (Array.isArray(refs.calendarTypeFilterInputs) && refs.calendarTypeFilterInputs.length > 0) {
    refs.calendarTypeFilterInputs.forEach((input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      const type = normalizeCalendarMediaType(input.dataset.calendarTypeFilter || "");
      if (!type) {
        input.disabled = true;
        return;
      }
      input.checked = state.calendarTypeFilters[type] !== false;
      input.addEventListener("change", () => {
        state.calendarTypeFilters[type] = Boolean(input.checked);
        if (!CALENDAR_TYPE_KEYS.some((key) => state.calendarTypeFilters[key])) {
          state.calendarTypeFilters[type] = true;
          input.checked = true;
          showToast("Selectionne au moins un type.");
          return;
        }
        renderCalendarSection();
        saveBrowseState();
      });
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
        `${API_BASE}/calendar/${state.calendarMonth}/${state.calendarYear}/days`,
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
  if (isTruthyDataFlag(movie?.isAnime)) {
    return "anime";
  }
  if (hasCalendarAnimationCategory(movie)) {
    return "anime";
  }
  const urlsRaw = Array.isArray(movie?.urls) ? movie.urls.join(" ") : movie?.urls;
  const urls = String(urlsRaw || "").toLowerCase();
  if (urls.includes("/animes/") || urls.includes("/anime/")) {
    return "anime";
  }
  return "serie";
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
      // Calendar anime view is reserved for Anime-Sama feed only.
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
      source: "zenix",
      key,
      mediaId,
      dayNumber,
      dateIso: `${yearSafe}-${monthSafe}-${daySafe}`,
      title: String(movie?.title || "Sans titre"),
      type,
      kind: type,
      isAnime: type === "anime",
      language: String(movie?.lang || "").trim().toUpperCase(),
      season: Number(movie?.season || 0),
      episode: Number(movie?.episode || 0),
      supplemental: String(movie?.calendarSupplemental || ""),
      poster: String(posters.large || posters.small || posters.wallpaper || ""),
      categories: Array.isArray(movie?.categories) ? movie.categories : [],
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
    primary: {
      month,
      year: yearSafe,
      monthName,
      count: merged.length,
      items: merged,
    },
    anime: {
      count: 0,
      days: [],
      items: [],
    },
    providerStatus: {
      primary: merged.length > 0,
      anime: false,
      supplemental: false,
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

  const match = resolveCalendarCatalogMatch(entry);
  return Number(match?.id || 0);
}

function resolveCalendarCatalogMatch(entry) {
  const directId = Number(entry?.mediaId || 0);
  if (directId > 0) {
    const directItem = findItemById(directId);
    if (directItem) {
      return directItem;
    }
  }

  const titleKey = normalizeTitleKey(entry?.title || "");
  if (!titleKey) {
    return null;
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

  return match || null;
}

function resolveCalendarEntryCover(entry, detailId = 0) {
  const direct = normalizeImageUrl(entry?.poster || entry?.backdrop || "");
  const mediaId = Math.max(0, Number(detailId || entry?.mediaId || 0));
  let item = null;
  if (mediaId > 0) {
    item = findItemById(mediaId);
  }
  if (!item) {
    item = resolveCalendarCatalogMatch(entry);
  }
  if (!item) {
    return direct || getDefaultCoverDataUrl(entry?.title || "Affiche");
  }
  const cachedDetails = state.detailsCache.get(Number(item.id || 0)) || null;
  const cover = resolveCardCover(item, cachedDetails);
  return cover || direct || getDefaultCoverDataUrl(item.title || entry?.title || "Affiche");
}

function hydrateCalendarCardsForMedia(mediaId, details = null) {
  const safeId = Math.max(0, Number(mediaId || 0));
  if (safeId <= 0) {
    return;
  }

  const apply = (resolved) => {
    if (!resolved) {
      return;
    }
    const mediaType = resolved.type === "tv" ? (Boolean(resolved.isAnime) ? "anime" : "serie") : "film";
    const previousType = String(state.calendarTypeByMediaId.get(safeId) || "").trim();
    const typeChanged = previousType !== mediaType;
    if (typeChanged) {
      state.calendarTypeByMediaId.set(safeId, mediaType);
    }
    const typeMap = {
      film: "Film",
      serie: "Serie",
      anime: "Anime",
    };
    const item =
      findItemById(safeId) || {
        id: safeId,
        type: resolved.type === "tv" ? "tv" : "movie",
        title: String(resolved.title || "Sans titre"),
        poster: normalizeImageUrl(resolved?.posters?.large || resolved?.posters?.small || resolved?.posters?.wallpaper || ""),
        backdrop: normalizeImageUrl(
          resolved?.posters?.wallpaper || resolved?.posters?.small || resolved?.posters?.large || ""
        ),
        isAnime: Boolean(resolved.isAnime),
      };

    document
      .querySelectorAll(`.calendar-merged-card[data-calendar-media-id="${safeId}"]`)
      .forEach((card) => {
        const badge = card.querySelector(".meta-pill");
        if (badge) {
          badge.textContent = typeMap[mediaType] || "Titre";
        }
        const image = card.querySelector("img");
        if (image instanceof HTMLImageElement) {
          setImageSourceSafely(image, resolveCardCover(item, resolved), item.title || "Affiche", true);
        }
      });
    if (typeChanged) {
      scheduleCalendarTypeReconcile();
    }
  };

  if (details) {
    apply(details);
    return;
  }
  ensureDetails(safeId).then(apply).catch(() => {
    // best effort refresh only
  });
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
  const providerRows = [
    ...(Array.isArray(state.calendarData?.primary?.items) ? state.calendarData.primary.items : []),
    ...(Array.isArray(state.calendarData?.anime?.items) ? state.calendarData.anime.items : []),
    ...(Array.isArray(state.calendarData?.supplemental?.items) ? state.calendarData.supplemental.items : []),
  ];
  const sourceRowsAll = providerRows.length > 0 ? providerRows : mergedPrimary;
  const sourceRows = sourceRowsAll.filter((entry) => isCalendarSourceAllowedByPolicy(entry));
  const compact = new Map();
  sourceRows.forEach((entry) => {
    const titleKey = normalizeTitleKey(entry?.title || "");
    const typeKey = getCalendarEntryMediaType(entry);
    const dateKey = String(entry?.dateIso || "").trim() || String(entry?.dayNumber || "");
    const key = `${titleKey}::${typeKey}::${dateKey}`;
    const current = compact.get(key);
    if (!current) {
      compact.set(key, entry);
      return;
    }
    const currentPending = isCalendarEntryPending(current);
    const nextPending = isCalendarEntryPending(entry);
    if (currentPending && !nextPending) {
      compact.set(key, entry);
      return;
    }
    if (!currentPending && nextPending) {
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
  const activeCalendarTypes = new Set(
    CALENDAR_TYPE_KEYS.filter((type) => state.calendarTypeFilters[type] !== false)
  );
  const mergedRows = Array.from(compact.values())
    .filter((entry) => {
      if (!activeCalendarTypes.has(getCalendarEntryMediaType(entry))) {
        return false;
      }
      if (!query) {
        return true;
      }
      return normalizeTitleKey(entry?.title || "").includes(query);
    })
    .slice(0, CALENDAR_RENDER_LIMIT);

  if (refs.calendarDayStats) {
    const dayBuckets = new Map();
    mergedRows.forEach((entry) => {
      const label = formatCalendarDateLabel(entry);
      dayBuckets.set(label, Number(dayBuckets.get(label) || 0) + 1);
    });
    const topBuckets = Array.from(dayBuckets.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
      .slice(0, 8);
    refs.calendarDayStats.innerHTML = "";
    if (topBuckets.length > 0) {
      const fragment = document.createDocumentFragment();
      topBuckets.forEach(([day, count]) => {
        const row = document.createElement("span");
        row.className = "calendar-day-pill";
        row.textContent = `${day} (${count})`;
        fragment.appendChild(row);
      });
      refs.calendarDayStats.appendChild(fragment);
      refs.calendarDayStats.hidden = false;
    } else {
      refs.calendarDayStats.hidden = true;
    }
  }

  refs.calendarMergedGrid.innerHTML = "";
  const mergedFragment = document.createDocumentFragment();
  const pendingHydrateIds = new Set();
  const imageProfile = getCardImageProfile();
  const eagerLimit = Number(imageProfile?.eagerLimit || DESKTOP_EAGER_IMAGE_LIMIT);
  const highPriorityLimit = Number(imageProfile?.highPriorityLimit || DESKTOP_HIGH_PRIORITY_IMAGE_LIMIT);
  const typeMap = {
    film: "Film",
    serie: "Serie",
    anime: "Anime",
  };

  mergedRows.forEach((entry, index) => {
    const card = document.createElement("article");
    card.className = "calendar-merged-card media-card calendar-media-card";
    const detailId = resolveCalendarDetailId(entry);
    const isPendingRelease = isCalendarEntryPending(entry);
    const hasDetails = detailId > 0 && !isPendingRelease;
    if (hasDetails) {
      card.dataset.calendarMediaId = String(detailId);
      pendingHydrateIds.add(detailId);
    }
    const linkLabel = isPendingRelease ? "En attente" : hasDetails ? "Voir details" : "Bientot";
    const availabilityLabel = isPendingRelease ? "En attente" : hasDetails ? "Disponible" : "Bientot";
    const mediaType = getCalendarEntryMediaType(entry);
    const typeLabel = typeMap[mediaType] || "Titre";
    const poster = resolveCalendarEntryCover(entry, detailId);
    const dateLabel = formatCalendarDateLabel(entry);
    card.innerHTML = `
      <div class="media-shell">
        <div class="media-thumb calendar-media-thumb">
          ${isPendingRelease ? '<span class="calendar-waiting-pill">En attente</span>' : ""}
          <img
            src="${escapeHtml(poster)}"
            alt="${escapeHtml(entry.title || "Affiche")}"
            loading="${index < eagerLimit ? "eager" : "lazy"}"
            decoding="async"
            fetchpriority="${index < highPriorityLimit ? "high" : "auto"}"
            ${hasDetails ? `data-cover-id="${detailId}"` : ""}
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
            <span>${escapeHtml(availabilityLabel)}</span>
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
    let sourceHint =
      providerStatus.primary === false &&
      providerStatus.anime === false &&
      providerStatus.supplemental === false
        ? "Sources calendrier temporairement indisponibles."
        : "Aucune sortie fusionnee pour cette periode.";
    if (query) {
      sourceHint = `Aucun resultat pour "${state.calendarQuery}".`;
    } else if (compact.size > 0) {
      sourceHint = "Aucune sortie pour les filtres selectionnes.";
    }
    refs.calendarMergedGrid.innerHTML = `<p class="empty">${escapeHtml(sourceHint)}</p>`;
  } else {
    refs.calendarMergedGrid.appendChild(mergedFragment);
    pendingHydrateIds.forEach((mediaId) => {
      hydrateCalendarCardsForMedia(mediaId);
    });
    warmImageCacheFromPool(
      mergedRows.map((entry) => ({
        poster: resolveCalendarEntryCover(entry, resolveCalendarDetailId(entry)),
        backdrop: "",
      })),
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
    const selectedLabels = CALENDAR_TYPE_KEYS
      .filter((type) => state.calendarTypeFilters[type] !== false)
      .map((type) => typeMap[type]);
    const filterSuffix =
      selectedLabels.length < CALENDAR_TYPE_KEYS.length ? ` (${selectedLabels.join(", ")})` : "";
    if (query) {
      refs.calendarMergedMeta.textContent = `${mergedRows.length} resultat(s) pour "${state.calendarQuery}"${filterSuffix}.`;
    } else {
      refs.calendarMergedMeta.textContent = `${mergedRows.length} sorties detectees${filterSuffix}.`;
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
  if (isCompactViewport()) {
    if (state.heroRotateTimer) {
      clearInterval(state.heroRotateTimer);
    }
    state.heroRotateTimer = null;
    return;
  }
  if (state.heroRotateTimer) {
    clearInterval(state.heroRotateTimer);
  }
  state.heroRotateTimer = setInterval(() => {
    if (isCompactViewport()) {
      return;
    }
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
  if (HIDE_BROWSE_PANELS) {
    if (refs.filtersPanel) {
      refs.filtersPanel.hidden = true;
    }
    if (refs.filterChips) {
      refs.filterChips.innerHTML = "";
    }
    return;
  }
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

function getActiveThemeBucket(view = resolveCatalogViewForSearch()) {
  if (view === "movie") {
    return "movie";
  }
  if (view === "tv") {
    return "tv";
  }
  if (view === "anime") {
    return "anime";
  }
  return "";
}

function getActiveThemeFilterSet(view = resolveCatalogViewForSearch()) {
  const bucket = getActiveThemeBucket(view);
  if (!bucket) {
    return null;
  }
  return state.themeFilters?.[bucket] || null;
}

function isThemeFilterPanelOpen() {
  return Boolean(refs.themeFilterPanel && !refs.themeFilterPanel.hasAttribute("hidden"));
}

function setThemeFilterPanelOpen(open) {
  if (!refs.themeFilterPanel) {
    return;
  }
  const shouldOpen = Boolean(open);
  setHidden(refs.themeFilterPanel, !shouldOpen);
  setHidden(refs.themeFilterBackdrop, !shouldOpen);
  if (refs.themeFilterToggleBtn) {
    refs.themeFilterToggleBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  }
}

function toggleThemeFilterPanel() {
  renderThemeFilters();
  setThemeFilterPanelOpen(!isThemeFilterPanelOpen());
}

function getThemeFilterAvailability(items, activeSet) {
  const counts = new Map();
  const rows = Array.isArray(items) ? items : [];
  const limit = Math.min(rows.length, 1600);
  for (let index = 0; index < limit; index += 1) {
    const item = rows[index];
    const tokens = getItemThemeTokens(item);
    if (!tokens || tokens.size === 0) {
      continue;
    }
    const matched = new Set();
    tokens.forEach((token) => {
      const bucket = THEME_TOKEN_INDEX.get(token);
      if (!bucket) {
        return;
      }
      bucket.forEach((id) => matched.add(id));
    });
    matched.forEach((id) => {
      counts.set(id, (counts.get(id) || 0) + 1);
    });
  }
  const filters = THEME_FILTERS.filter(
    (filter) => (counts.get(filter.id) || 0) > 0 || (activeSet && activeSet.has(filter.id))
  );
  return { filters, counts };
}

function renderThemeFilters() {
  if (!refs.catalogFilterShell || !refs.themeFilterList) {
    return;
  }
  const activeView = resolveCatalogViewForSearch();
  const bucket = getActiveThemeBucket(activeView);
  const hasQuery = String(state.query || "").trim().length > 0;
  const shouldShow = Boolean(bucket) && !hasQuery;
  setHidden(refs.catalogFilterShell, !shouldShow);
  if (!shouldShow) {
    setThemeFilterPanelOpen(false);
    refs.themeFilterList.innerHTML = "";
    return;
  }

  const activeSet = getActiveThemeFilterSet(activeView) || new Set();
  const baseList = getVisibleCatalog({ skipThemeFilters: true });
  primeThemeDetailsForView(baseList, activeSet).catch(() => {
    // best effort only
  });
  const { filters, counts } = getThemeFilterAvailability(baseList, activeSet);

  refs.themeFilterList.innerHTML = "";
  if (filters.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Aucun filtre disponible pour cette vue.";
    refs.themeFilterList.appendChild(empty);
    return;
  }

  filters.forEach((filter) => {
    const label = document.createElement("label");
    label.className = "theme-filter-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = activeSet.has(filter.id);
    checkbox.dataset.filterId = filter.id;
    const name = document.createElement("span");
    name.className = "theme-filter-name";
    name.textContent = filter.label;
    const countValue = counts.get(filter.id) || 0;
    const count = document.createElement("span");
    count.className = "theme-filter-count";
    count.textContent = countValue > 0 ? String(countValue) : "";

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        activeSet.add(filter.id);
      } else {
        activeSet.delete(filter.id);
      }
      renderThemeFilters();
      renderAll();
    });

    label.appendChild(checkbox);
    label.appendChild(name);
    if (countValue > 0) {
      label.appendChild(count);
    }
    refs.themeFilterList.appendChild(label);
  });
}

function matchesThemeFilter(item, activeSet) {
  if (!activeSet || activeSet.size === 0) {
    return true;
  }
  const tokens = getItemThemeTokens(item);
  if (!tokens || tokens.size === 0) {
    return false;
  }
  for (const key of activeSet) {
    const filter = THEME_FILTER_INDEX.get(key);
    if (!filter) {
      continue;
    }
    if (tokens.has(key)) {
      return true;
    }
    const match = filter.tokens.some((token) => tokens.has(normalizeThemeToken(token)));
    if (match) {
      return true;
    }
  }
  return false;
}

async function primeThemeDetailsForView(items, activeSet) {
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }
  if (state.themePrefetchInFlight) {
    return;
  }
  const now = Date.now();
  if (state.themePrefetchAt && now - state.themePrefetchAt < 7000) {
    return;
  }
  const limit = activeSet && activeSet.size > 0 ? THEME_PREFETCH_LIMIT_ACTIVE : THEME_PREFETCH_LIMIT_IDLE;
  const targets = items
    .filter((item) => item && Number(item.id || 0) > 0)
    .filter((item) => !item.isExternal)
    .filter((item) => !state.detailsCache.has(item.id) && !state.detailsMissing.has(item.id))
    .slice(0, limit);
  if (targets.length === 0) {
    return;
  }
  state.themePrefetchInFlight = true;
  state.themePrefetchAt = now;
  try {
    for (let index = 0; index < targets.length; index += THEME_PREFETCH_BATCH) {
      const batch = targets.slice(index, index + THEME_PREFETCH_BATCH);
      await Promise.all(
        batch.map((entry) =>
          ensureDetails(entry.id).catch(() => {
            // best effort only
          })
        )
      );
    }
  } finally {
    state.themePrefetchInFlight = false;
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
  state.supplementalLastPage = Number(snapshot.supplementalLastPage || Number.POSITIVE_INFINITY);
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
    const firstResult = await fetchCatalogPage(1, { includeSupplemental: false });
    state.catalog = [];
    state.page = 0;
    state.totalPages = 0;
    state.catalogSyncPage = 0;
    state.supplementalLastPage = Number.POSITIVE_INFINITY;
    state.hasMore = true;
    upsertCatalogItems(firstResult.items, { prepend: false });
    state.page = firstResult.currentPage;
    state.totalPages = firstResult.lastPage;
    state.catalogSyncPage = firstResult.currentPage;
    state.hasMore = firstResult.currentPage < firstResult.lastPage;

    const initialProfile = getCatalogSyncProfile(resolveCatalogViewForSearch());
    state.lastSyncAt = new Date();

    if (state.page < state.totalPages) {
      const batchPages = Math.max(
        1,
        Math.max(
          Number(initialProfile.activeBatch || 4),
          Number(initialProfile.initialPages || INITIAL_CATALOG_WARMUP_PAGES) - 1
        )
      );
      const endPage = Math.min(state.totalPages, state.page + batchPages);
      if (state.page + 1 <= endPage) {
        startBackgroundCatalogSync(state.page + 1, endPage);
      }
    }
    window.setTimeout(() => {
      refreshCatalogHead().catch(() => {
        // best effort only
      });
    }, 900);
    saveCatalogSnapshot();
  } catch {
    if (state.catalog.length > 0) {
      state.page = Math.max(1, Number(state.page || 1));
      state.totalPages = Math.max(state.page, Number(state.totalPages || state.page));
      state.catalogSyncPage = Math.max(1, Number(state.catalogSyncPage || state.page));
      state.hasMore = state.page < state.totalPages;
      state.lastSyncAt = state.lastSyncAt || new Date();
      saveCatalogSnapshot();
    } else if (hasSnapshot) {
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
    const didSync = await syncCatalogUntilVisibleGain("manual", CATALOG_MIN_VISIBLE_APPEND, {
      maxSteps: CATALOG_VISIBLE_APPEND_MAX_STEPS_MANUAL,
      batchPages: CATALOG_VISIBLE_APPEND_BATCH_PAGES,
    });
    if (didSync) {
      state.lastSyncAt = new Date();
      saveCatalogSnapshot();
      renderAll();
    }
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
    const dayKey = getTopDailyDateKey();
    const computed = buildTopFromCatalog(dayKey);
    if (computed.length > 0) {
      state.topDaily = computed;
      state.topDailyDayKey = dayKey;
    } else if (state.topDaily.length === 0) {
      state.topDaily = buildTopFromCatalog(dayKey);
      state.topDailyDayKey = dayKey;
    }
    warmImageCacheFromPool(state.topDaily, 40);
    if (!state.activeHeroId && state.topDaily[0]) {
      state.activeHeroId = state.topDaily[0].id;
    }
    updateSyncText();
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
  const semanticToId = new Map();
  state.catalog.forEach((entry) => {
    const semantic = getCatalogSemanticKey(entry);
    if (semantic && !semanticToId.has(semantic)) {
      semanticToId.set(semantic, entry.id);
    }
  });
  const incoming = [];

  for (const raw of items) {
    const item = raw || null;
    if (!item) {
      continue;
    }
    if (item.forceDuplicate) {
      incoming.push(item);
      map.set(item.id, item);
      continue;
    }

    if (map.has(item.id)) {
      map.set(item.id, { ...map.get(item.id), ...item });
      const semantic = getCatalogSemanticKey(item);
      if (semantic && !semanticToId.has(semantic)) {
        semanticToId.set(semantic, item.id);
      }
      continue;
    }

    const semantic = getCatalogSemanticKey(item);
    if (semantic && semanticToId.has(semantic)) {
      const targetId = semanticToId.get(semantic);
      const existing = map.get(targetId);
      if (existing) {
        map.set(targetId, mergeCatalogSemanticItem(existing, item));
        continue;
      }
    }

    const looseTargetId = findCatalogLooseMergeTarget(map, item);
    if (looseTargetId > 0) {
      const existing = map.get(looseTargetId);
      if (existing) {
        map.set(looseTargetId, mergeCatalogSemanticItem(existing, item));
        continue;
      }
    }

    incoming.push(item);
    map.set(item.id, item);
    if (semantic && !semanticToId.has(semantic)) {
      semanticToId.set(semantic, item.id);
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

function getCatalogSemanticKey(item) {
  if (!item) {
    return "";
  }
  const titleKey = normalizeTitleKey(item.title || item.titleKey || "");
  if (!titleKey) {
    return "";
  }
  const mediaType = item.type === "tv" ? "tv" : "movie";
  const releaseYear = Number.parseInt(getYear(item.releaseDate || ""), 10);
  const externalYear = Number(item.externalYear || 0);
  const year = externalYear > 0 ? externalYear : Number.isFinite(releaseYear) ? releaseYear : 0;
  const season = mediaType === "tv" ? Math.max(0, Number(item.externalSeason || 0)) : 0;
  const episode = mediaType === "tv" ? Math.max(0, Number(item.externalEpisode || 0)) : 0;
  return `${titleKey}::${mediaType}::${year}::${season}::${episode}`;
}

function getCatalogSemanticLooseKey(item) {
  if (!item) {
    return "";
  }
  const titleKey = normalizeTitleKey(item.title || item.titleKey || "");
  if (!titleKey) {
    return "";
  }
  const mediaType = item.type === "tv" ? "tv" : "movie";
  const season = mediaType === "tv" ? Math.max(0, Number(item.externalSeason || 0)) : 0;
  const episode = mediaType === "tv" ? Math.max(0, Number(item.externalEpisode || 0)) : 0;
  return `${titleKey}::${mediaType}::${season}::${episode}`;
}

function getCatalogReleaseYear(item) {
  if (!item) {
    return 0;
  }
  const externalYear = Number(item.externalYear || 0);
  if (Number.isFinite(externalYear) && externalYear > 0) {
    return externalYear;
  }
  const releaseYear = Number.parseInt(getYear(item.releaseDate || ""), 10);
  return Number.isFinite(releaseYear) && releaseYear > 0 ? releaseYear : 0;
}

function areCatalogYearsCompatible(left, right, maxDelta = 1) {
  const leftYear = getCatalogReleaseYear(left);
  const rightYear = getCatalogReleaseYear(right);
  if (leftYear <= 0 || rightYear <= 0) {
    return true;
  }
  return Math.abs(leftYear - rightYear) <= Math.max(0, Number(maxDelta || 1));
}

function canMergeCatalogSemanticLoose(existing, incoming) {
  if (!existing || !incoming) {
    return false;
  }
  const existingLoose = getCatalogSemanticLooseKey(existing);
  const incomingLoose = getCatalogSemanticLooseKey(incoming);
  if (!existingLoose || !incomingLoose || existingLoose !== incomingLoose) {
    return false;
  }
  const existingExternal = Boolean(existing?.isExternal || existing?.externalProvider || existing?.external_provider);
  const incomingExternal = Boolean(incoming?.isExternal || incoming?.externalProvider || incoming?.external_provider);
  if (!existingExternal && !incomingExternal) {
    return false;
  }
  return areCatalogYearsCompatible(existing, incoming, 1);
}

function findCatalogLooseMergeTarget(map, incoming) {
  if (!(map instanceof Map) || !incoming) {
    return 0;
  }
  for (const [candidateId, candidate] of map.entries()) {
    if (canMergeCatalogSemanticLoose(candidate, incoming)) {
      return Number(candidateId || 0);
    }
  }
  return 0;
}

function getCatalogItemQualityScore(item) {
  if (!item) {
    return -9999;
  }
  let score = 0;
  if (String(item.poster || "").trim()) {
    score += 40;
  }
  if (String(item.backdrop || "").trim()) {
    score += 18;
  }
  if (String(item.releaseDate || "").trim()) {
    score += 14;
  }
  if (Number(item.runtime || 0) > 0) {
    score += 6;
  }
  if (!item.isExternal) {
    score += 20;
  }
  const lang = normalizeLanguageLabel(item.externalLanguage || item.languageHint || "");
  if (lang === "VF") {
    score += 12;
  } else if (lang === "MULTI") {
    score += 9;
  } else if (lang === "VOSTFR") {
    score += 6;
  }
  const availabilityStatus = getItemAvailabilityStatus(item);
  if (availabilityStatus === "available") {
    score += 8;
  } else if (availabilityStatus === "pending") {
    score -= 52;
  }
  return score;
}

function mergeCatalogSemanticItem(existing, incoming) {
  const keepExisting = getCatalogItemQualityScore(existing) >= getCatalogItemQualityScore(incoming);
  const winner = keepExisting ? existing : incoming;
  const base = keepExisting ? { ...incoming, ...existing } : { ...existing, ...incoming };
  base.id = Number(existing?.id || incoming?.id || 0);
  base.poster = String(base.poster || existing?.poster || incoming?.poster || "").trim();
  base.backdrop = String(base.backdrop || existing?.backdrop || incoming?.backdrop || "").trim();
  base.releaseDate = base.releaseDate || existing?.releaseDate || incoming?.releaseDate || null;
  base.languageHint = normalizeLanguageLabel(base.languageHint || existing?.languageHint || incoming?.languageHint || "");
  const mergedAvailability = pickPreferredAvailabilityStatus(
    getItemAvailabilityStatus(existing),
    getItemAvailabilityStatus(incoming)
  );
  base.availabilityStatus = mergedAvailability;
  base.externalStatus = mergedAvailability;
  base.isPendingUpload = mergedAvailability === "pending";
  const existingProvider = String(existing?.externalProvider || existing?.external_provider || "")
    .trim()
    .toLowerCase();
  const incomingProvider = String(incoming?.externalProvider || incoming?.external_provider || "")
    .trim()
    .toLowerCase();
  const existingIsExternal = Boolean(existingProvider || existing?.isExternal);
  const incomingIsExternal = Boolean(incomingProvider || incoming?.isExternal);
  let winnerProvider = String(
    winner?.externalProvider || winner?.external_provider || ""
  )
    .trim()
    .toLowerCase();
  if (existingIsExternal !== incomingIsExternal) {
    // If one side is internal and the other external, keep internal ownership after semantic merge.
    winnerProvider = "";
  }
  if (winnerProvider) {
    base.externalProvider = winnerProvider;
    base.external_provider = winnerProvider;
    base.isExternal = true;
  } else {
    base.externalProvider = "";
    base.external_provider = "";
    base.isExternal = false;
    base.externalKey = "";
    base.externalDetailUrl = "";
  }
  return base;
}

async function fetchCatalogPage(page, options = {}) {
  const includeSupplemental = options.includeSupplemental !== false;
  const shouldFetchSupplemental =
    includeSupplemental && Number(page || 1) <= Number(state.supplementalLastPage || Number.POSITIVE_INFINITY);
  const supplementalPerPage = getSupplementalPerPage();
  const [payload, supplementalPayload] = await Promise.all([
    fetchJson(`${API_BASE}/catalog/movies?page=${page}`),
    shouldFetchSupplemental
      ? fetchJson(`${API_BASE}/catalog/supplemental?page=${page}&perPage=${supplementalPerPage}`, {
          timeoutMs: SUPPLEMENTAL_CATALOG_TIMEOUT_MS,
          retryDelays: [400, 950],
        }).catch(() => null)
      : Promise.resolve(null),
  ]);
  const items = payload?.data?.items || {};
  const rows = Array.isArray(items.data) ? items.data : [];
  const supplementalLastPage = Number(supplementalPayload?.data?.items?.last_page || 0);
  if (supplementalLastPage > 0) {
    state.supplementalLastPage = supplementalLastPage;
  }
  const supplementalRows = Array.isArray(supplementalPayload?.data?.items?.data)
    ? supplementalPayload.data.items.data
    : [];

  return {
    items: rows.concat(supplementalRows).map(normalizeCatalogItem).filter(Boolean),
    currentPage: Number(items.current_page || page),
    lastPage: Number(items.last_page || page),
  };
}

function resolveCatalogMediaType(rawType, isAnimeFlag = false) {
  const normalized = normalizeCalendarMediaType(rawType);
  if (normalized === "anime" || normalized === "serie") {
    return "tv";
  }
  if (normalized === "film") {
    return "movie";
  }
  return isAnimeFlag ? "tv" : "movie";
}

function isLikelyAnimeCatalogRow(raw) {
  if (!raw || typeof raw !== "object") {
    return false;
  }
  if (isTruthyDataFlag(raw?.isAnime ?? raw?.is_anime ?? raw?.isanime ?? raw?.anime)) {
    return true;
  }

  const urlHints = Array.isArray(raw?.urls)
    ? raw.urls.join(" ")
    : String(raw?.urls || raw?.url || "");
  const categoryHints = Array.isArray(raw?.categories)
    ? raw.categories
        .map((entry) => (typeof entry === "string" ? entry : entry?.name || ""))
        .join(" ")
    : String(raw?.categories || "");
  const genreHints = Array.isArray(raw?.genres)
    ? raw.genres
        .map((entry) => (typeof entry === "string" ? entry : entry?.name || ""))
        .join(" ")
    : String(raw?.genres || "");

  const hintParts = [
    raw?.type,
    raw?.media_type,
    raw?.mediaType,
    raw?.kind,
    raw?.category,
    raw?.genre,
    raw?.source,
    raw?.provider,
    raw?.origin,
    raw?.external_provider,
    raw?.externalProvider,
    raw?.external_label,
    raw?.externalLabel,
    raw?.external_source,
    raw?.externalSource,
    urlHints,
    categoryHints,
    genreHints,
  ];
  const hints = hintParts
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean)
    .join(" ");
  if (/\banime\b|\banimation\b|\bjapanim\b/.test(hints)) {
    return true;
  }

  const sourceUrl = String(
    raw?.external_detail_url ??
      raw?.externalDetailUrl ??
      raw?.source_url ??
      raw?.sourceUrl ??
      raw?.url ??
      urlHints ??
      ""
  )
    .trim()
    .toLowerCase();
  if (sourceUrl.includes("anime-sama") || sourceUrl.includes("animesama")) {
    return true;
  }
  if (/\/animes?\//i.test(sourceUrl)) {
    return true;
  }

  return false;
}

function normalizeCatalogItem(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const rawType = raw?.type ?? raw?.media_type ?? raw?.mediaType ?? raw?.kind ?? "";
  const isAnime = isLikelyAnimeCatalogRow(raw);
  const type = resolveCatalogMediaType(rawType, isAnime);

  const id = Number(raw?.id || 0);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const title = String(raw?.title || "Sans titre");
  const forceDuplicate = Boolean(
    raw?.force_duplicate ??
    raw?.forceDuplicate ??
    raw?.allow_duplicate ??
    raw?.allowDuplicate
  );
  const languageHint = normalizeLanguageLabel(raw?.lang || raw?.language || raw?.langue || "");
  const releaseDate = raw?.release_date || raw?.releaseDate || null;
  const categories = Array.isArray(raw?.categories)
    ? raw.categories
    : Array.isArray(raw?.genres)
      ? raw.genres
      : [];
  const genreLabel = raw?.genre || "";
  const externalProvider = String(raw?.external_provider || raw?.externalProvider || "")
    .trim()
    .toLowerCase();
  if (externalProvider && externalProvider !== "nakios" && externalProvider !== "zenix") {
    return null;
  }
  if ((externalProvider === "nakios" || externalProvider === "zenix") && isAnime) {
    // Nakios anime rows are intentionally excluded.
    return null;
  }
  const externalSeason = Math.max(0, Number(raw?.external_season ?? raw?.externalSeason ?? 0));
  const externalEpisode = Math.max(0, Number(raw?.external_episode ?? raw?.externalEpisode ?? 0));
  const externalYearRaw = Number(raw?.external_year ?? raw?.externalYear ?? 0);
  const externalTmdbIdRaw = Number(raw?.external_tmdb_id ?? raw?.externalTmdbId ?? 0);
  const availabilityStatusRaw =
    raw?.availability_status ??
    raw?.availabilityStatus ??
    raw?.external_status ??
    raw?.externalStatus ??
    raw?.status ??
    "";
  const availabilityStatus = normalizeAvailabilityStatus(availabilityStatusRaw);
  const pendingUploadFlag = isTruthyDataFlag(raw?.is_pending_upload ?? raw?.isPendingUpload);
  const resolvedAvailabilityStatus = availabilityStatus || (pendingUploadFlag ? "pending" : "");
  const fallbackYear = Number.parseInt(getYear(releaseDate || ""), 10);
  const externalYear = Number.isFinite(externalYearRaw) && externalYearRaw > 0 ? externalYearRaw : fallbackYear > 0 ? fallbackYear : 0;
  const externalTmdbId = Number.isFinite(externalTmdbIdRaw) && externalTmdbIdRaw > 0 ? externalTmdbIdRaw : 0;
  return {
    id,
    type,
    title,
    forceDuplicate,
    titleLower: title.toLowerCase(),
    titleKey: normalizeTitleKey(title),
    poster: normalizeImageUrl(raw?.large_poster_path || raw?.small_poster_path || ""),
    backdrop: normalizeImageUrl(raw?.wallpaper_poster_path || raw?.small_poster_path || raw?.large_poster_path || ""),
    runtime: typeof raw?.runtime === "number" ? raw.runtime : null,
    releaseDate,
    endDate: raw?.end_date || null,
    languageHint,
    isAnime,
    categories,
    genres: Array.isArray(raw?.genres) ? raw.genres : [],
    genre: genreLabel,
    isExternal: Boolean(externalProvider),
    externalProvider,
    externalKey: String(raw?.external_key || raw?.externalKey || "").trim(),
    externalDetailUrl: String(raw?.external_detail_url || raw?.externalDetailUrl || "").trim(),
    externalLanguage: normalizeLanguageLabel(raw?.external_language || raw?.externalLanguage || ""),
    externalTmdbId,
    externalYear,
    externalSeason,
    externalEpisode,
    availabilityStatus: resolvedAvailabilityStatus,
    externalStatus: resolvedAvailabilityStatus,
    isPendingUpload: resolvedAvailabilityStatus === "pending",
    supplementalRank: Number(raw?.supplemental_rank || raw?.supplementalRank || 0),
    supplementalDate: String(raw?.supplemental_date || raw?.supplementalDate || "").trim(),
  };
}

function getTopDailyDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTopDailySeed(dayKey = getTopDailyDateKey()) {
  const numeric = Number(String(dayKey || "").replace(/\D+/g, "").slice(0, 8) || 0);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric;
  }
  return Math.max(1, Math.trunc(Date.now() / (24 * 60 * 60 * 1000)));
}

function getTopDailyTypeCap(typeBucket) {
  if (typeBucket === "anime") {
    return TOP_DAILY_TYPE_CAPS.anime;
  }
  if (typeBucket === "tv") {
    return TOP_DAILY_TYPE_CAPS.tv;
  }
  return TOP_DAILY_TYPE_CAPS.movie;
}

function computeTopDailyScore(item, daySeed, nowMs) {
  if (!item) {
    return Number.NEGATIVE_INFINITY;
  }

  const id = Number(item.id || 0);
  if (id <= 0) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = 0;
  const releaseTs = parseReleaseDate(item.releaseDate);
  if (releaseTs > 0) {
    const ageDays = (nowMs - releaseTs) / (24 * 60 * 60 * 1000);
    if (ageDays >= 0) {
      const freshness = Math.max(0, 1 - ageDays / TOP_DAILY_RECENCY_WINDOW_DAYS);
      score += freshness * 120;
      if (ageDays <= 14) {
        score += 34;
      } else if (ageDays <= 45) {
        score += 18;
      }
    } else {
      const daysUntil = Math.min(45, Math.max(0, -ageDays));
      score += Math.max(6, 30 - daysUntil * 0.55);
    }
  } else {
    score += 10;
  }

  if (isRecentlyReleased(item, NEW_RELEASE_DAYS + 20)) {
    score += 12;
  }

  const typeBucket = getItemTypeBucket(item);
  if (typeBucket === "anime") {
    score += 18;
  } else if (typeBucket === "tv") {
    score += 15;
  } else {
    score += 12;
  }

  const rating = getUserRating(id);
  if (rating > 0) {
    score += 40;
  } else if (rating < 0) {
    score -= 52;
  }

  if (isFavorite(id)) {
    score += 26;
  }

  const progress = state.progress?.[id];
  if (progress) {
    const age = Math.max(0, nowMs - Number(progress?.lastPlayed || 0));
    const recency = Math.exp(-age / (28 * 24 * 60 * 60 * 1000));
    const duration = Number(progress?.duration || 0);
    const time = Number(progress?.time || 0);
    const completion = duration > 0 ? Math.max(0, Math.min(1, time / duration)) : Math.min(1, time / 3600);
    score += 22 + recency * 44 + completion * 24;
    if (isItemMostlyWatched(item)) {
      score -= 10;
    }
  }

  const lang = normalizeLanguageLabel(item.languageHint || "");
  if (lang === "VF" || lang === "MULTI") {
    score += 7;
  } else if (lang === "VOSTFR") {
    score += 4;
  }

  const dayRoll = seededShuffleValue(id, daySeed);
  const tieRoll = seededShuffleValue(id + 17, daySeed * 7);
  score += dayRoll * 52 + (tieRoll - 0.5) * 18;
  return score;
}

function buildTopFromCatalog(dayKey = getTopDailyDateKey()) {
  const sourcePool = state.catalog.length > 0 ? state.catalog : FALLBACK_ITEMS;
  if (!Array.isArray(sourcePool) || sourcePool.length === 0) {
    return [];
  }

  const daySeed = getTopDailySeed(dayKey);
  const nowMs = Date.now();
  const scored = [];
  sourcePool.forEach((item) => {
    const id = Number(item?.id || 0);
    if (id <= 0) {
      return;
    }
    scored.push({
      item,
      score: computeTopDailyScore(item, daySeed, nowMs),
    });
  });

  scored.sort((left, right) => {
    const delta = Number(right.score || 0) - Number(left.score || 0);
    if (Math.abs(delta) > 0.001) {
      return delta;
    }
    const releaseDelta = parseReleaseDate(right.item?.releaseDate) - parseReleaseDate(left.item?.releaseDate);
    if (releaseDelta !== 0) {
      return releaseDelta;
    }
    return seededShuffleValue(right.item?.id || 0, daySeed) - seededShuffleValue(left.item?.id || 0, daySeed);
  });

  const picked = [];
  const usedIds = new Set();
  const typeCounts = {
    movie: 0,
    tv: 0,
    anime: 0,
  };

  for (const entry of scored) {
    const id = Number(entry?.item?.id || 0);
    if (id <= 0 || usedIds.has(id)) {
      continue;
    }
    const typeBucket = getItemTypeBucket(entry.item);
    const cap = getTopDailyTypeCap(typeBucket);
    if (Number(typeCounts[typeBucket] || 0) >= cap) {
      continue;
    }
    picked.push(entry.item);
    usedIds.add(id);
    typeCounts[typeBucket] = Number(typeCounts[typeBucket] || 0) + 1;
    if (picked.length >= TOP_DAILY_LIMIT) {
      break;
    }
  }

  if (picked.length < TOP_DAILY_LIMIT) {
    for (const entry of scored) {
      const id = Number(entry?.item?.id || 0);
      if (id <= 0 || usedIds.has(id)) {
        continue;
      }
      picked.push(entry.item);
      usedIds.add(id);
      if (picked.length >= TOP_DAILY_LIMIT) {
        break;
      }
    }
  }

  return picked.slice(0, TOP_DAILY_LIMIT);
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
  const isRecommendationView = !hasQuery && state.view === "recommendation";
  const showBrowseView = !isInfoView && !isCalendarView && !isTopView && !isListView && !isRecommendationView;

  const showHero = showBrowseView && !isCompactViewport();

  if (showBrowseView) {
    const primePool = [heroItem, ...visible].filter(Boolean);
    primeCriticalCovers(
      primePool,
      isCompactViewport() ? CRITICAL_COVER_PRIME_MOBILE : CRITICAL_COVER_PRIME_DESKTOP,
      0
    ).catch(() => {
      // best effort only
    });
    if (showHero) {
      renderHero(heroItem);
    }
    renderCommunityStats();
    renderThemeFilters();
    renderCatalog(visible);
    if (!hasQuery) {
      renderContinue();
      if (state.view === "all") {
        renderHomeInterest();
      }
    }
    const warmBase = shouldBoostCoverLoading()
      ? isCompactViewport()
        ? 900
        : 700
      : 620;
    const warmScale = getPerfScale();
    const warmLimit = clampIntRange(
      Math.round(warmBase * (warmScale >= 1 ? Math.min(1.2, warmScale) : warmScale)),
      220,
      1200
    );
    warmImageCacheFromPool(visible, warmLimit);
  }

  if (isTopView) {
    renderTopDaily();
  }
  if (isListView) {
    renderMyList();
  }

  if (isRecommendationView) {
    renderRecommendationView();
  }

  if (isCalendarView) {
    renderCalendarSection();
  }

  updateCatalogHeading(hasQuery, visible.length);

  setHidden(refs.heroSection, !showHero);
  setHidden(refs.statusStrip, isInfoView || isCalendarView || isRecommendationView);
  setHidden(refs.quickLinksSection, true);
  setHidden(refs.filtersPanel, HIDE_BROWSE_PANELS || isInfoView || isCalendarView || isTopView || isListView || isRecommendationView);
  setHidden(refs.communityPanel, HIDE_BROWSE_PANELS || isInfoView || isCalendarView || isTopView || isListView || isRecommendationView);
  setHidden(refs.infoSection, !isInfoView);
  setHidden(refs.calendarSection, !isCalendarView);
  setHidden(refs.recommendationSection, !isRecommendationView);

  setHidden(refs.topSection, !isTopView);
  setHidden(refs.trendingSection, true);
  setHidden(refs.featureRailSection, true);

  const showCatalog = showBrowseView;
  setHidden(refs.catalogSection, !showCatalog);
  setHidden(refs.emptyStateWrap, !showCatalog || visible.length > 0);
  setHidden(refs.emptyState, !showCatalog || visible.length > 0);
  refs.emptyState.textContent =
    hasQuery && state.query.length > 0
      ? `Aucun resultat pour "${state.query}".`
      : "Aucun resultat.";

  setHidden(refs.listSection, !(isListView && refs.listGrid.children.length > 0));
  setHidden(refs.latestSection, true);
  setHidden(refs.popularSection, true);
  const showContinue = showBrowseView && state.view === "all" && !hasQuery && refs.continueGrid.children.length > 0;
  setHidden(refs.continueSection, !showContinue);
  const hasHomeInterestCards = Boolean(refs.homeInterestGrid && refs.homeInterestGrid.children.length > 0);
  const showHomeInterest = showBrowseView && state.view === "all" && !hasQuery && hasHomeInterestCards;
  setHidden(refs.homeInterestSection, !showHomeInterest);
  applyNativeAdPlacement();
  initSectionRevealObserver();

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

function getVisibleCatalog(options = {}) {
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
    list = list.filter((item) => item.isAnime && !item.isExternal);
  }

  if (state.chip === "movie") {
    list = list.filter((item) => item.type === "movie" && !item.isAnime);
  } else if (state.chip === "tv") {
    list = list.filter((item) => item.type === "tv" && !item.isAnime);
  } else if (state.chip === "anime") {
    list = list.filter((item) => item.isAnime && !item.isExternal);
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

  if (!options.skipThemeFilters) {
    const activeThemeSet = query.length === 0 ? getActiveThemeFilterSet(activeView) : null;
    if (activeThemeSet) {
      primeThemeDetailsForView(list, activeThemeSet).catch(() => {
        // best effort only
      });
      if (activeThemeSet.size > 0) {
        list = list.filter((item) => matchesThemeFilter(item, activeThemeSet));
      }
    }
  }

  if (state.uiPrefs.hideWatched) {
    list = list.filter((item) => !isItemMostlyWatched(item));
  }

  if (state.uiPrefs.newOnly) {
    list = list.filter((item) => isRecentlyReleased(item, NEW_RELEASE_DAYS));
  }

  if (state.uiPrefs.vfOnly || state.uiPrefs.vostOnly) {
    const targetLanguage = state.uiPrefs.vfOnly ? "VF" : "VOSTFR";
    list = list.filter((item) => itemMatchesLanguagePreference(item, targetLanguage));
  }

  if (state.sortBy === "recent") {
    list.sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate));
  } else if (state.sortBy === "title-asc") {
    list.sort((a, b) => a.title.localeCompare(b.title, "fr", { sensitivity: "base" }));
  } else if (state.sortBy === "title-desc") {
    list.sort((a, b) => b.title.localeCompare(a.title, "fr", { sensitivity: "base" }));
  } else if (state.sortBy === "year-desc") {
    list.sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate));
  } else if (state.sortBy === "year-asc") {
    list.sort((a, b) => parseReleaseDate(a.releaseDate) - parseReleaseDate(b.releaseDate));
  } else if (state.sortBy === "resume-recent") {
    list.sort((a, b) => {
      const left = Number(state.progress?.[a.id]?.lastPlayed || 0);
      const right = Number(state.progress?.[b.id]?.lastPlayed || 0);
      if (left === right) {
        return b.id - a.id;
      }
      return right - left;
    });
  } else if (state.sortBy === "random") {
    const seed = Number(state.randomSortSeed || Date.now());
    list.sort((a, b) => seededShuffleValue(a.id, seed) - seededShuffleValue(b.id, seed));
  } else if (state.sortBy === "runtime-desc") {
    list.sort((a, b) => Number(b.runtime || 0) - Number(a.runtime || 0));
  }

  return list;
}

function seededShuffleValue(id, seed) {
  const safeId = Math.abs(Number(id || 0)) + 1;
  const safeSeed = Math.abs(Number(seed || 1)) + 1;
  const value = Math.sin((safeId * 9301 + safeSeed * 49297) % 233280) * 43758.5453;
  return value - Math.floor(value);
}

function isItemMostlyWatched(item) {
  if (!item || Number(item.id || 0) <= 0) {
    return false;
  }
  const progress = state.progress?.[item.id];
  if (!progress) {
    return false;
  }
  const duration = Number(progress.duration || 0);
  const time = Number(progress.time || 0);
  if (duration > 0) {
    return time / duration >= 0.9;
  }
  return time > 12 * 60;
}

function collectItemLanguageSignals(item) {
  const signals = new Set();
  const push = (value) => {
    const normalized = normalizeLanguageLabel(value);
    if (normalized) {
      signals.add(normalized);
    }
  };

  push(item?.languageHint || item?.language);
  push(state.progress?.[Number(item?.id || 0)]?.language || "");
  if (Number(item?.id || 0) > 0) {
    push(state.detailLangCache.get(Number(item.id)) || "");
    push(state.selectedLanguageByMedia.get(Number(item.id)) || "");
    const details = state.detailsCache.get(Number(item.id));
    push(details?.lang || "");
  }
  return signals;
}

function itemMatchesLanguagePreference(item, preference) {
  const target = normalizeLanguageLabel(preference);
  if (!target) {
    return true;
  }
  const signals = collectItemLanguageSignals(item);
  if (signals.size === 0) {
    return true;
  }
  if (signals.has(target)) {
    return true;
  }
  return signals.has("MULTI");
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
    refs.catalogSubtitle.textContent = appendActiveFilterSummary(
      `${resultCount} titre(s) trouve(s) pour "${state.query}".`
    );
    return;
  }
  refs.catalogTitle.textContent = titleByView[state.view] || "Streaming";

  if (state.view === "latest") {
    refs.catalogSubtitle.textContent = appendActiveFilterSummary("Derniers ajouts detectes automatiquement.");
    return;
  }
  if (state.view === "popular") {
    refs.catalogSubtitle.textContent = appendActiveFilterSummary("Titres les plus regardes par la communaute.");
    return;
  }
  refs.catalogSubtitle.textContent = appendActiveFilterSummary("Catalogue fusionne films, series et anime.");

}

function getActiveThemeFilterLabels() {
  const activeSet = getActiveThemeFilterSet(resolveCatalogViewForSearch());
  if (!activeSet || activeSet.size === 0) {
    return [];
  }
  const labels = [];
  activeSet.forEach((id) => {
    const filter = THEME_FILTER_INDEX.get(id);
    if (filter?.label) {
      labels.push(filter.label);
    }
  });
  return labels;
}

function getActiveCatalogFilterLabels() {
  const labels = [];
  if (state.uiPrefs.hideWatched) {
    labels.push("sans deja-vu");
  }
  if (state.uiPrefs.newOnly) {
    labels.push("nouveautes");
  }
  if (state.uiPrefs.vfOnly) {
    labels.push("VF");
  }
  if (state.uiPrefs.vostOnly) {
    labels.push("VOSTFR");
  }
  if (state.sortBy === "resume-recent") {
    labels.push("repris recemment");
  } else if (state.sortBy === "year-desc") {
    labels.push("annee recente");
  } else if (state.sortBy === "year-asc") {
    labels.push("annee ancienne");
  } else if (state.sortBy === "random") {
    labels.push("ordre aleatoire");
  }
  const themeLabels = getActiveThemeFilterLabels();
  if (themeLabels.length > 0) {
    labels.push(`themes: ${themeLabels.join(", ")}`);
  }
  return labels;
}

function appendActiveFilterSummary(baseText) {
  const base = String(baseText || "").trim();
  const labels = getActiveCatalogFilterLabels();
  if (labels.length === 0) {
    return base;
  }
  return `${base} Filtres actifs: ${labels.join(", ")}.`;
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

  const currentSrc = normalizeImageUrl(String(node.currentSrc || node.src || "").trim());
  if (currentSrc === url || node.dataset.pendingSrc === url) {
    wireImageFallback(node, title || "Zenix", cover);
    return;
  }

  node.dataset.pendingSrc = url;
  node.src = url;
  if (node.dataset.pendingSrc === url) {
    delete node.dataset.pendingSrc;
  }
  wireImageFallback(node, title || "Zenix", cover);
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
  if (HIDE_BROWSE_PANELS) {
    if (refs.communityPanel) {
      refs.communityPanel.hidden = true;
    }
    if (refs.communityStats) {
      refs.communityStats.innerHTML = "";
    }
    return;
  }
  const total = state.catalog.length;
  const movies = state.catalog.filter((item) => item.type === "movie" && !item.isAnime).length;
  const series = state.catalog.filter((item) => item.type === "tv" && !item.isAnime).length;
  const anime = state.catalog.filter((item) => item.isAnime).length;
  const favorites = Object.keys(state.favorites).length;
  const activeWatch = Object.values(state.progress).filter((entry) => Number(entry?.time || 0) > 0).length;
  const likes = Object.values(state.ratings || {}).filter((entry) => normalizeRatingValue(entry?.value || entry) > 0).length;
  const dislikes = Object.values(state.ratings || {}).filter((entry) => normalizeRatingValue(entry?.value || entry) < 0).length;

  const stats = [
    { label: "Titres", value: total },
    { label: "Films", value: movies },
    { label: "Series", value: series },
    { label: "Anime", value: anime },
    { label: "Ma liste", value: favorites },
    { label: "Likes", value: likes },
    { label: "Dislikes", value: dislikes },
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

function renderTrendingRail() {
  if (!refs.trendingSection || !refs.trendingTrack) {
    return;
  }
  const base = getPopularCatalog()
    .slice(0, 18)
    .sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate));

  refs.trendingTrack.innerHTML = "";
  if (base.length === 0) {
    refs.trendingSection.hidden = true;
    return;
  }

  const fragment = document.createDocumentFragment();
  base.forEach((item, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "trending-card";
    card.dataset.cardId = String(item.id);
    card.innerHTML = `
      <span class="trending-rank">#${index + 1}</span>
      <img src="${escapeHtml(resolveCardCover(item))}" alt="${escapeHtml(item.title)}" loading="${index < 8 ? "eager" : "lazy"}" decoding="async" fetchpriority="${index < 4 ? "high" : "auto"}" data-cover-id="${item.id}" />
      <span class="trending-title">${escapeHtml(item.title)}</span>
    `;
    const image = card.querySelector("img");
    if (image instanceof HTMLImageElement) {
      wireImageFallback(image, item.title, false);
    }
    bindFastPress(card, () => {
      openDetails(item.id).catch(() => {
        showToast("Impossible d'ouvrir ce titre.", true);
      });
    });
    fragment.appendChild(card);
  });
  refs.trendingTrack.appendChild(fragment);
  refs.trendingSection.hidden = false;
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
  if (raw === "4" || raw === "VO" || raw.includes("ORIGINAL")) {
    return "VO";
  }
  return raw;
}

function normalizeAvailabilityStatus(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (value === true || value === 1) {
    return "pending";
  }
  if (value === false || value === 0) {
    return "";
  }
  const raw = normalizeTitleKey(String(value || "").trim());
  if (!raw) {
    return "";
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
    raw.includes("mise en ligne") ||
    raw.includes("pas encore en ligne") ||
    raw.includes("non disponible") ||
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
  return "";
}

function getAvailabilityStatusPriority(value) {
  const normalized = normalizeAvailabilityStatus(value);
  if (normalized === "available") {
    return 3;
  }
  if (normalized) {
    return 1;
  }
  return 2;
}

function pickPreferredAvailabilityStatus(left, right) {
  const leftPriority = getAvailabilityStatusPriority(left);
  const rightPriority = getAvailabilityStatusPriority(right);
  if (leftPriority === rightPriority) {
    return normalizeAvailabilityStatus(right) || normalizeAvailabilityStatus(left) || "";
  }
  return rightPriority > leftPriority ? normalizeAvailabilityStatus(right) : normalizeAvailabilityStatus(left);
}

function getItemAvailabilityStatus(item) {
  if (!item || typeof item !== "object") {
    return "";
  }
  const id = Number(item?.id || 0);
  const direct = normalizeAvailabilityStatus(
    item?.availabilityStatus || item?.externalStatus || item?.availability_status || item?.external_status || item?.status || ""
  );
  if (direct) {
    return direct;
  }
  if (id > 0 && state.pendingMediaIds && state.pendingMediaIds.has(id)) {
    return "pending";
  }
  return isTruthyDataFlag(item?.isPendingUpload ?? item?.is_pending_upload) ? "pending" : "";
}

function isPendingUploadItem(item) {
  return getItemAvailabilityStatus(item) === "pending";
}

function isLikelyRecentPendingUpload(item) {
  if (!item || getItemAvailabilityStatus(item) !== "pending") {
    return false;
  }
  const year = getItemReleaseYear(item) || getCatalogReleaseYear(item);
  const now = new Date();
  const currentYear = now.getFullYear();
  if (year > 0 && year <= currentYear - 2) {
    return false;
  }
  const dateCandidates = [
    item?.releaseDate,
    item?.release_date,
    item?.firstAirDate,
    item?.first_air_date,
    item?.airDate,
    item?.date,
    item?.supplemental_date,
  ];
  for (const candidate of dateCandidates) {
    const raw = String(candidate || "").trim();
    if (!raw) {
      continue;
    }
    const ts = Date.parse(raw);
    if (!Number.isFinite(ts)) {
      continue;
    }
    const ageDays = (Date.now() - ts) / (24 * 60 * 60 * 1000);
    if (ageDays > NEW_RELEASE_DAYS * 4) {
      return false;
    }
    return true;
  }
  return true;
}

function applyAvailabilityToItem(item, status) {
  if (!item || typeof item !== "object") {
    return false;
  }
  const normalized = normalizeAvailabilityStatus(status);
  if (!normalized) {
    return false;
  }
  const changed = getItemAvailabilityStatus(item) !== normalized;
  item.availabilityStatus = normalized;
  item.externalStatus = normalized;
  item.isPendingUpload = normalized === "pending";
  item.is_pending_upload = normalized === "pending";
  return changed;
}

function markItemAvailability(mediaId, status) {
  const id = Number(mediaId || 0);
  const normalized = normalizeAvailabilityStatus(status);
  if (!Number.isFinite(id) || id <= 0 || !normalized) {
    return false;
  }
  if (normalized === "pending") {
    state.pendingMediaIds.add(id);
  } else {
    state.pendingMediaIds.delete(id);
  }
  let changed = false;
  const apply = (entry) => {
    if (entry && Number(entry?.id || 0) === id) {
      if (applyAvailabilityToItem(entry, normalized)) {
        changed = true;
      }
    }
  };
  state.catalog.forEach(apply);
  state.topDaily.forEach(apply);
  const detail = state.detailsCache.get(id);
  if (detail && typeof detail === "object") {
    if (applyAvailabilityToItem(detail, normalized)) {
      state.detailsCache.set(id, detail);
      changed = true;
    }
  }
  const calendarBuckets = [
    state.calendarData?.merged,
    state.calendarData?.primary?.items,
    state.calendarData?.anime?.items,
    state.calendarData?.supplemental?.items,
  ];
  calendarBuckets.forEach((bucket) => {
    if (!Array.isArray(bucket)) {
      return;
    }
    bucket.forEach((entry) => {
      const entryId = Number(entry?.mediaId || entry?.id || 0);
      if (entryId !== id) {
        return;
      }
      entry.availability_status = normalized;
      entry.external_status = normalized;
      entry.is_pending_upload = normalized === "pending";
      changed = true;
    });
  });
  if (changed) {
    renderAll();
  }
  return changed;
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

function buildDetailCompatibilityKey(item, season = 1, episode = 1) {
  if (!item || Number(item.id || 0) <= 0) {
    return "";
  }
  if (item.type === "tv") {
    return `${Number(item.id)}:tv:${Math.max(1, Number(season || 1))}:${Math.max(1, Number(episode || 1))}`;
  }
  return `${Number(item.id)}:movie`;
}

function inferCompatibilityLabelFromSources(sources) {
  const rows = Array.isArray(sources) ? sources.filter(Boolean) : [];
  if (rows.length === 0) {
    return "";
  }

  const hasNonPremium = rows.some((entry) => !entry?.premiumHint);
  const hasPremium = rows.some((entry) => Boolean(entry?.premiumHint));
  const hasHls = rows.some((entry) => entry?.format === "hls");
  const hasMp4 = rows.some((entry) => entry?.format === "mp4");
  const hasWebm = rows.some((entry) => entry?.format === "webm");
  const hasDash = rows.some((entry) => entry?.format === "dash");

  const phone = hasHls || hasMp4 || hasDash;
  const windows = hasMp4 || hasDash || hasWebm || (hasHls && (hasNonPremium || rows.length > 1 || !hasPremium));

  if (windows && phone) {
    return "Windows/Phone";
  }
  if (windows) {
    return "Windows";
  }
  if (phone) {
    return "Phone";
  }
  return "";
}

function setDetailCompatibilityBadge(label) {
  if (!refs.detailBadges) {
    return;
  }
  const value = String(label || "").trim();
  const existing = refs.detailBadges.querySelector('[data-badge-role="compat"]');
  if (!value) {
    if (existing) {
      existing.remove();
    }
    return;
  }

  const target =
    existing ||
    (() => {
      const span = document.createElement("span");
      span.className = "badge badge-compat";
      span.setAttribute("data-badge-role", "compat");
      refs.detailBadges.prepend(span);
      return span;
    })();
  target.textContent = value;
}

function cacheDetailCompatibilityLabel(item, label, season = 1, episode = 1) {
  const key = buildDetailCompatibilityKey(item, season, episode);
  const safeLabel = String(label || "").trim();
  if (!key) {
    return;
  }
  if (!safeLabel) {
    state.detailCompatibilityCache.delete(key);
    return;
  }
  state.detailCompatibilityCache.set(key, safeLabel);
}

function readDetailCompatibilityLabel(item, season = 1, episode = 1) {
  const key = buildDetailCompatibilityKey(item, season, episode);
  if (!key) {
    return "";
  }
  return String(state.detailCompatibilityCache.get(key) || "").trim();
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
    fetchStreamJson(path, { prefetch: true })
      .then((payload) => {
        if (payload) {
          prefetchHlsManifestFromPayload(payload);
          const preview = pickPreviewSource(payload);
          if (preview && preview.url) {
            const id = Number(item.id || 0);
            if (!state.previewSourceCache.has(id)) {
              state.previewSourceCache.set(id, preview);
            }
          }
        }
      })
      .catch(() => {
      // best effort prefetch only
      });
  });
}

function pickPreviewSource(payload) {
  const sources = extractSources(payload);
  if (!Array.isArray(sources) || sources.length === 0) {
    return null;
  }
  const direct = sources.filter((entry) => {
    const format = String(entry?.format || "").toLowerCase();
    return format === "mp4" || format === "webm";
  });
  if (direct.length === 0) {
    if (!PREVIEW_ALLOW_HLS) {
      return null;
    }
    const hlsSources = sources.filter((entry) => {
      const format = String(entry?.format || "").toLowerCase();
      const url = String(entry?.url || entry?.stream_url || "").toLowerCase();
      return format === "hls" || url.includes(".m3u8");
    });
    if (hlsSources.length === 0) {
      return null;
    }
    const sortedHls = sortSourcesByScore(hlsSources);
    const selectedHls = sortedHls[0] || null;
    if (!selectedHls) {
      return null;
    }
    return {
      url: String(selectedHls.url || "").trim(),
      format: "hls",
    };
  }
  const sorted = sortSourcesByScore(direct);
  const selected = sorted[0] || null;
  if (!selected) {
    return null;
  }
  return { url: String(selected.url || "").trim(), format: selected.format || "mp4" };
}

function stopCardPreview() {
  if (!state.previewActive) {
    return;
  }
  const active = state.previewActive;
  if (active.timeoutId) {
    clearTimeout(active.timeoutId);
  }
  if (active.hls && typeof active.hls.destroy === "function") {
    try {
      active.hls.destroy();
    } catch {
      // ignore
    }
  }
  if (active.video) {
    try {
      active.video.pause();
      active.video.removeAttribute("src");
      active.video.load();
    } catch {
      // ignore
    }
    active.video.remove();
  }
  if (active.thumb) {
    active.thumb.classList.remove("is-previewing");
  }
  state.previewActive = null;
}

function startCardPreview(card, item, thumb) {
  if (!PREVIEW_ENABLED || !card || !item || !thumb) {
    return;
  }
  if (isLikelyMobileDevice() || state.uiPrefs?.reduceMotion) {
    return;
  }
  const id = Number(item.id || 0);
  if (id <= 0) {
    return;
  }
  const cooldownUntil = Number(state.previewCooldownAt.get(id) || 0);
  if (Date.now() < cooldownUntil) {
    return;
  }
  const preview = state.previewSourceCache.get(id);
  if (!preview || !preview.url) {
    return;
  }
  stopCardPreview();

  const video = document.createElement("video");
  video.className = "card-preview-video";
  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.autoplay = true;
  video.loop = false;
  const previewUrl = String(preview.url || "").trim();
  const isHlsPreview =
    PREVIEW_ALLOW_HLS &&
    (/m3u8/i.test(previewUrl) || String(preview.format || "").toLowerCase() === "hls");
  let hlsInstance = null;
  let usesNativeHls = false;
  if (isHlsPreview) {
    const absolute = toAbsoluteUrl(previewUrl);
    const proxied = toHlsProxyUrl(absolute) || absolute;
    usesNativeHls = shouldUseNativeHls(video);
    if (usesNativeHls) {
      video.src = proxied;
    } else {
      loadHlsLibrary()
        .then((Hls) => {
          if (!Hls || !Hls.isSupported()) {
            throw new Error("HLS unsupported");
          }
          hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 12,
            maxBufferLength: 8,
            maxMaxBufferLength: 16,
          });
          if (!state.previewActive || state.previewActive.id !== id) {
            hlsInstance.destroy();
            return;
          }
          state.previewActive.hls = hlsInstance;
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MEDIA_ATTACHED, () => {
            hlsInstance.loadSource(proxied);
          });
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {
              // ignore
            });
          });
          hlsInstance.on(Hls.Events.ERROR, () => {
            stopCardPreview();
          });
        })
        .catch(() => {
          stopCardPreview();
        });
    }
  } else {
    video.src = previewUrl;
  }

  thumb.appendChild(video);
  thumb.classList.add("is-previewing");

  const timeoutId = window.setTimeout(() => {
    stopCardPreview();
    state.previewCooldownAt.set(id, Date.now() + PREVIEW_COOLDOWN_MS);
  }, PREVIEW_DURATION_MS);

  state.previewActive = { id, video, thumb, timeoutId, hls: hlsInstance };
  if (!isHlsPreview || usesNativeHls) {
    video.play().catch(() => {
      stopCardPreview();
    });
  }
}

function attachCardPreviewHandlers(card, item, thumb) {
  if (!card || !item || !thumb) {
    return;
  }
  if (isLikelyMobileDevice() || !PREVIEW_ENABLED) {
    return;
  }
  let hoverTimer = 0;
  const onEnter = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
    hoverTimer = window.setTimeout(() => {
      hoverTimer = 0;
      startCardPreview(card, item, thumb);
    }, PREVIEW_HOVER_DELAY_MS);
  };
  const onLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = 0;
    }
    stopCardPreview();
  };
  card.addEventListener("pointerenter", onEnter);
  card.addEventListener("pointerleave", onLeave);
  card.addEventListener("focusout", onLeave);
  card.addEventListener("blur", onLeave);
}

function prefetchHlsManifestFromPayload(payload) {
  if (!isLikelyMobileDevice()) {
    return;
  }
  const sources = extractSources(payload);
  if (!Array.isArray(sources) || sources.length === 0) {
    return;
  }
  const hlsSource = sources.find((entry) => {
    const format = String(entry?.format || "").toLowerCase();
    const url = String(entry?.url || entry?.stream_url || "").toLowerCase();
    return format === "hls" || url.includes(".m3u8");
  });
  if (!hlsSource) {
    return;
  }
  const url = toZenixRelayUrl(hlsSource) || String(hlsSource?.url || hlsSource?.stream_url || "").trim();
  if (!url) {
    return;
  }
  fetch(url, { mode: "no-cors", credentials: "omit" }).catch(() => {
    // optional warmup only
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
    const qualityBadge = getItemQualityBadge(item);
    const isPendingUpload = isPendingUploadItem(item);
    const isComingSoonRelease = !isPendingUpload && isComingSoon(item);
    const isNewRelease = !isPendingUpload && isRecentlyReleased(item, NEW_RELEASE_DAYS);
    const hasResume = Number(state.progress?.[item.id]?.time || 0) > 45;
    const ribbonLabel = isPendingUpload ? "En attente" : isComingSoonRelease ? "Bientot dispo" : isNewRelease ? "Nouveau" : "";
    const ribbonClass = isPendingUpload
      ? "media-thumb-ribbon media-thumb-ribbon-waiting"
      : isComingSoonRelease
        ? "media-thumb-ribbon media-thumb-ribbon-soon"
        : isNewRelease
          ? "media-thumb-ribbon media-thumb-ribbon-new"
          : "";

    card.innerHTML = `
      <div class="top-shell">
      <div class="top-thumb">
        <span class="top-rank">#${index + 1}</span>
        ${ribbonLabel ? `<span class="${ribbonClass}">${ribbonLabel}</span>` : ""}
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
          <span class="meta-pill meta-pill-quality">${escapeHtml(qualityBadge)}</span>
          ${isPendingUpload ? '<span class="meta-pill meta-pill-waiting">En attente</span>' : ""}
          ${!isPendingUpload && isComingSoonRelease ? '<span class="meta-pill meta-pill-soon">Bientot dispo</span>' : ""}
          ${!isPendingUpload && !isComingSoonRelease && isNewRelease ? '<span class="meta-pill meta-pill-new">Nouveau</span>' : ""}
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
    const thumb = card.querySelector(".top-thumb");

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
  if (!Array.isArray(items) || items.length === 0) {
    refs.catalogGrid.innerHTML = "";
    return;
  }
  const renderedIds = Array.from(refs.catalogGrid.querySelectorAll(".media-card[data-card-id]"))
    .map((node) => Number(node?.dataset?.cardId || 0))
    .filter((id) => id > 0);
  const canAppendOnly =
    renderedIds.length > 0 &&
    renderedIds.length <= items.length &&
    renderedIds.every((id, idx) => Number(items[idx]?.id || 0) === id);

  if (!canAppendOnly) {
    refs.catalogGrid.innerHTML = "";
  }

  const total = items.length;
  const compact = isCompactViewport();
  const activeView = resolveCatalogViewForSearch();
  const categoryBoost = state.query.trim().length === 0 && isCatalogCategoryView(activeView);
  const renderAllAtOnce = categoryBoost && total <= (compact ? 420 : 520);
  const baseChunk = Math.max(
    CATALOG_RENDER_CHUNK_MIN,
    Math.min(CATALOG_RENDER_CHUNK_MAX, Math.ceil(total / 9))
  );
  const perfScale = getPerfScale();
  const scaledBase = Math.max(
    CATALOG_RENDER_CHUNK_MIN,
    Math.min(CATALOG_RENDER_CHUNK_MAX, Math.round(baseChunk * perfScale))
  );
  const chunkSize = renderAllAtOnce
    ? total
    : compact
      ? Math.max(scaledBase, MOBILE_CATALOG_CHUNK_MIN)
      : scaledBase;
  const firstPaintCount = Math.min(
    total,
    renderAllAtOnce
      ? total
      : compact
        ? Math.max(chunkSize, MOBILE_CATALOG_FIRST_PAINT)
        : chunkSize
  );
  const imageProfile = getCardImageProfile();
  let index = canAppendOnly ? renderedIds.length : 0;

  if (!canAppendOnly) {
    const firstPaintFragment = document.createDocumentFragment();
    for (; index < firstPaintCount; index += 1) {
      const entry = items[index];
      if (!entry || Number(entry.id || 0) <= 0) {
        continue;
      }
      firstPaintFragment.appendChild(buildMediaCard(entry, false, null, index, imageProfile));
    }
    refs.catalogGrid.replaceChildren(firstPaintFragment);
  }

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

  if (index < total && (!renderAllAtOnce || canAppendOnly)) {
    state.catalogRenderFrame = requestAnimationFrame(appendChunk);
  } else {
    state.catalogRenderFrame = 0;
  }
  const hydratePool = canAppendOnly ? items.slice(renderedIds.length) : items;
  const detailHydrateLimit = categoryBoost
    ? compact
      ? DETAIL_COVER_HYDRATE_LIMIT_CATEGORY_MOBILE
      : DETAIL_COVER_HYDRATE_LIMIT_CATEGORY_DESKTOP
    : compact
      ? DETAIL_COVER_HYDRATE_LIMIT_DEFAULT_MOBILE
      : DETAIL_COVER_HYDRATE_LIMIT_DEFAULT_DESKTOP;
  warmVisibleDetailCovers(hydratePool, detailHydrateLimit);
  observeMediaCards(refs.catalogGrid);
}


function resetRecommendationState(options = {}) {
  state.recommendation.step = 0;
  state.recommendation.answers = {};
  state.recommendation.results = [];
  if (options.resetSeed !== false) {
    state.recommendation.seed = Date.now();
  }
  renderRecommendationView();
}

function recordRecommendationAnswer(questionId, value) {
  state.recommendation.answers[questionId] = value;
}

function buildRecommendationCandidates() {
  const base = getInterestCatalog();
  const liked = new Set();
  const disliked = new Set();
  Object.entries(state.ratings || {}).forEach(([idRaw, row]) => {
    const id = Number(idRaw || row?.id || 0);
    if (id <= 0) {
      return;
    }
    const rating = normalizeRatingValue(row?.value || row);
    if (rating > 0) {
      liked.add(id);
    } else if (rating < 0) {
      disliked.add(id);
    }
  });

  return base.filter((item) => {
    const id = Number(item?.id || 0);
    if (id <= 0) {
      return false;
    }
    if (disliked.has(id)) {
      return false;
    }
    if (liked.has(id)) {
      return false;
    }
    if (isItemMostlyWatched(item)) {
      return false;
    }
    if (isPendingUploadItem(item)) {
      return false;
    }
    return true;
  });
}

function scoreRecommendationItem(item, answers, index) {
  let score = Math.max(0, 60 - index);
  const typeBucket = getItemTypeBucket(item);
  const runtime = Number(item?.runtime || 0);
  const year = getItemReleaseYear(item);
  const tokens = getItemThemeTokens(item);

  if (answers.format && answers.format !== "any") {
    if (answers.format === "movie" && typeBucket === "movie") {
      score += 34;
    } else if (answers.format === "tv" && typeBucket === "tv") {
      score += 34;
    } else if (answers.format === "anime" && typeBucket === "anime") {
      score += 34;
    } else {
      score -= 22;
    }
  }

  if (answers.duration && runtime > 0) {
    if (answers.duration === "short" && runtime <= 30) {
      score += 12;
    } else if (answers.duration === "medium" && runtime > 30 && runtime <= 60) {
      score += 12;
    } else if (answers.duration === "long" && runtime > 60 && runtime <= 120) {
      score += 12;
    } else if (answers.duration === "epic" && runtime > 120) {
      score += 12;
    } else {
      score -= 6;
    }
  }

  if (answers.mood) {
    const moodMap = {
      comedie: ["comedie", "comedy", "humour"],
      horreur: ["horreur", "horror", "epouvante"],
      emotion: ["drame", "drama"],
      action: ["action", "aventure", "thriller", "combat"],
      romance: ["romance", "romantique", "love"],
      sf: ["science fiction", "sci fi", "sf"],
    };
    const hints = moodMap[answers.mood] || [];
    if (hints.some((hint) => tokens.has(normalizeThemeToken(hint)))) {
      score += 18;
    }
  }

  if (answers.era) {
    if (answers.era === "80s90s" && year >= 1980 && year <= 1999) {
      score += 12;
    } else if (answers.era === "2000s" && year >= 2000 && year <= 2009) {
      score += 12;
    } else if (answers.era === "2010s" && year >= 2010 && year <= 2018) {
      score += 12;
    } else if (answers.era === "recent") {
      if (isRecentlyReleased(item, 90) || year >= 2019) {
        score += 14;
      }
    }
  }

  if (answers.pace) {
    const fastHints = ["action", "aventure", "thriller", "combat"];
    const slowHints = ["drame", "romance", "biopic", "documentaire"];
    if (answers.pace === "fast" && fastHints.some((hint) => tokens.has(normalizeThemeToken(hint)))) {
      score += 10;
    } else if (answers.pace === "slow" && slowHints.some((hint) => tokens.has(normalizeThemeToken(hint)))) {
      score += 10;
    } else if (answers.pace === "balanced") {
      score += 4;
    }
  }

  const jitter = seededShuffleValue(Number(item?.id || 0) + 13, state.recommendation.seed) * 10;
  score += jitter;
  return score;
}

function pickRecommendationResults() {
  const answers = state.recommendation.answers || {};
  const candidates = buildRecommendationCandidates();
  if (candidates.length === 0) {
    return [];
  }
  const scored = candidates.map((item, index) => ({
    item,
    score: scoreRecommendationItem(item, answers, index),
  }));
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 50).map((entry) => entry.item);
  const desired = Math.min(
    RECOMMENDATION_MAX_RESULTS,
    Math.max(RECOMMENDATION_MIN_RESULTS, 3 + Math.floor((state.recommendation.seed % 1000) / 400))
  );

  const typeCounts = { movie: 0, tv: 0, anime: 0 };
  const maxPerType = answers.format && answers.format !== "any" ? desired : 2;
  const picks = [];

  top.forEach((item) => {
    if (picks.length >= desired) {
      return;
    }
    const typeBucket = getItemTypeBucket(item);
    if (typeCounts[typeBucket] >= maxPerType) {
      return;
    }
    typeCounts[typeBucket] += 1;
    picks.push(item);
  });

  if (picks.length < desired) {
    top.forEach((item) => {
      if (picks.length >= desired) {
        return;
      }
      if (picks.some((picked) => picked.id === item.id)) {
        return;
      }
      picks.push(item);
    });
  }

  return picks.slice(0, desired);
}

function renderRecommendationResults() {
  if (!refs.recommendationGrid) {
    return;
  }
  const results = state.recommendation.results;
  refs.recommendationGrid.innerHTML = "";
  if (!Array.isArray(results) || results.length === 0) {
    return;
  }
  const fragment = document.createDocumentFragment();
  results.forEach((item) => {
    const card = document.createElement("article");
    card.className = "recommendation-card";
    const cover = resolveCardCover(item);
    card.innerHTML = `
      <img src="${escapeHtml(cover || "")}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" />
      <div class="recommendation-card-body">
        <p class="recommendation-card-meta">${escapeHtml(getItemTypeLabel(item))}</p>
        <h3 class="recommendation-card-title">${escapeHtml(item.title)}</h3>
        <button class="btn btn-primary btn-compact" type="button" data-reco-play="${item.id}">Regarder</button>
      </div>
    `;
    const img = card.querySelector("img");
    if (img) {
      wireImageFallback(img, item.title, false);
    }
    const playBtn = card.querySelector("[data-reco-play]");
    if (playBtn) {
      bindFastPress(playBtn, () => {
        openPlayer(item.id).catch(() => {
          showMessage("Lecture indisponible pour ce titre.", true);
        });
      });
    }
    fragment.appendChild(card);
  });
  refs.recommendationGrid.appendChild(fragment);
}

function renderRecommendationQuestion() {
  if (!refs.recommendationQuestion || !refs.recommendationOptions) {
    return;
  }
  const step = Math.max(0, Number(state.recommendation.step || 0));
  const question = RECOMMENDATION_QUESTIONS[step];
  if (!question) {
    return;
  }
  const progress = Math.round(((step + 1) / RECOMMENDATION_QUESTIONS.length) * 100);
  if (refs.recommendationProgressBar) {
    refs.recommendationProgressBar.style.width = `${progress}%`;
  }
  if (refs.recommendationStepLabel) {
    refs.recommendationStepLabel.textContent = `Question ${step + 1}/${RECOMMENDATION_QUESTIONS.length}`;
  }
  refs.recommendationQuestion.textContent = question.label;
  refs.recommendationOptions.innerHTML = "";
  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "recommendation-option";
    button.textContent = option.label;
    bindFastPress(button, () => {
      recordRecommendationAnswer(question.id, option.value);
      state.recommendation.step += 1;
      renderRecommendationView();
    });
    refs.recommendationOptions.appendChild(button);
  });
  if (refs.recommendationBackBtn) {
    refs.recommendationBackBtn.disabled = step <= 0;
  }
}

function renderRecommendationView() {
  if (!refs.recommendationSection) {
    return;
  }
  const step = Math.max(0, Number(state.recommendation.step || 0));
  const finished = step >= RECOMMENDATION_QUESTIONS.length;
  if (refs.recommendationQuiz) {
    refs.recommendationQuiz.hidden = finished;
  }
  if (refs.recommendationResults) {
    refs.recommendationResults.hidden = !finished;
  }
  if (!finished) {
    renderRecommendationQuestion();
    return;
  }
  if (!Array.isArray(state.recommendation.results) || state.recommendation.results.length === 0) {
    state.recommendation.results = pickRecommendationResults();
  }
  renderRecommendationResults();
}
function getContinueEntries(limit = 6) {
  return Object.values(state.progress)
    .filter((entry) => Number(entry?.lastPlayed || 0) > 0)
    .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0))
    .slice(0, Math.max(1, Number(limit || 6)));
}

function getContinueDisplayLimit() {
  return isCompactViewport() ? 6 : 5;
}

function renderContinue() {
  if (!refs.continueGrid) {
    return;
  }
  const entries = getContinueEntries(getContinueDisplayLimit());
  refs.continueGrid.innerHTML = "";
  refs.continueSection.hidden = state.view !== "all" || entries.length === 0;
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

function renderHomeInterest() {
  if (!refs.homeInterestGrid) {
    return;
  }

  const collectRatedIds = (targetRating) => {
    const ids = new Set();
    Object.entries(state.ratings || {}).forEach(([idRaw, row]) => {
      const id = Number(idRaw || row?.id || 0);
      if (id <= 0) {
        return;
      }
      const rating = normalizeRatingValue(row?.value || row);
      if (rating === targetRating) {
        ids.add(id);
      }
    });
    return ids;
  };

  const collectSeenIds = () => {
    const ids = new Set();
    Object.values(state.progress || {}).forEach((entry) => {
      const id = Number(entry?.id || 0);
      if (id <= 0) {
        return;
      }
      const time = Number(entry?.time || 0);
      const lastPlayed = Number(entry?.lastPlayed || 0);
      if (time > 0 || lastPlayed > 0) {
        ids.add(id);
      }
    });
    return ids;
  };

  const likedIds = collectRatedIds(1);
  const dislikedIds = collectRatedIds(-1);
  const seenIds = collectSeenIds();
  const blockedIds = new Set([...likedIds, ...dislikedIds, ...seenIds]);
  const ranked = getInterestCatalog();
  const picks = [];
  const pickedIds = new Set();

  const appendFromPool = (pool) => {
    for (const item of pool) {
      const id = Number(item?.id || 0);
      if (id <= 0 || pickedIds.has(id) || blockedIds.has(id)) {
        continue;
      }
      pickedIds.add(id);
      picks.push(item);
      if (picks.length >= INTEREST_HOME_LIMIT) {
        return;
      }
    }
  };

  appendFromPool(ranked);

  if (picks.length < INTEREST_HOME_LIMIT) {
    appendFromPool(getPopularCatalog());
  }

  if (picks.length < INTEREST_HOME_LIMIT) {
    const recentCatalog = state.catalog
      .slice()
      .sort((a, b) => parseReleaseDate(b.releaseDate) - parseReleaseDate(a.releaseDate));
    appendFromPool(recentCatalog);
  }

  const finalPicks = picks.slice(0, INTEREST_HOME_LIMIT);
  refs.homeInterestGrid.innerHTML = "";
  refs.homeInterestSection.hidden = finalPicks.length === 0;
  const fragment = document.createDocumentFragment();
  const imageProfile = getCardImageProfile();

  finalPicks.forEach((item, index) => {
    fragment.appendChild(buildMediaCard(item, false, null, index, imageProfile));
  });

  refs.homeInterestGrid.appendChild(fragment);
  observeMediaCards(refs.homeInterestGrid);
}

function removeContinueProgressEntry(id, options = {}) {
  const mediaId = Number(id || 0);
  if (mediaId <= 0 || !state.progress || !state.progress[mediaId]) {
    return false;
  }
  delete state.progress[mediaId];
  saveProgress(state.progress);
  if (options.render !== false) {
    renderAll();
  }
  return true;
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
  const qualityBadge = getItemQualityBadge(item);
  const languageLabel = resolveDetailLanguageLabel(details, item.id);
  const favorite = isFavorite(item.id);
  const progress = progressEntry || state.progress[item.id] || null;
  const isPendingUpload = isPendingUploadItem(item);
  const isAdminForced = Boolean(item.forceDuplicate);
  const isComingSoonRelease = !isPendingUpload && isComingSoon(item);
  const isNewRelease = !isPendingUpload && isRecentlyReleased(item, NEW_RELEASE_DAYS);
  const ribbonLabel = isPendingUpload ? "En attente" : isComingSoonRelease ? "Bientot dispo" : isNewRelease ? "Nouveau" : "";
  const ribbonClass = isPendingUpload
    ? "media-thumb-ribbon media-thumb-ribbon-waiting"
    : isComingSoonRelease
      ? "media-thumb-ribbon media-thumb-ribbon-soon"
      : isNewRelease
        ? "media-thumb-ribbon media-thumb-ribbon-new"
        : "";
  const ratioRaw = progress && Number(progress.duration || 0) > 0
    ? (Number(progress.time || 0) / Number(progress.duration || 1)) * 100
    : 0;
  const ratio = Math.max(0, Math.min(100, Math.round(ratioRaw)));
  const hasWatched = progress && Number(progress.duration || 0) > 0
    ? Number(progress.time || 0) / Number(progress.duration || 1) >= 0.92
    : false;
  const hasResume = Number(progress?.time || 0) > 45 && !hasWatched;
  const removeContinueButton = resume
    ? `<button type="button" class="continue-remove-btn" data-card-remove-progress="${item.id}" aria-label="Retirer ${escapeHtml(item.title)} de Continuer">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.4 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3z"></path></svg>
      </button>`
    : "";

  card.innerHTML = `
    <div class="media-shell">
    <div class="media-thumb">
      ${ribbonLabel ? `<span class="${ribbonClass}">${ribbonLabel}</span>` : ""}
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
      ${removeContinueButton}
      <button type="button" class="media-open" data-card-open="${item.id}" aria-label="Voir la fiche de ${escapeHtml(item.title)}"></button>
      ${ratio > 0 ? `<div class="progress-track"><span style="width:${ratio}%"></span></div>` : ""}
    </div>
    <div class="media-body">
      <button type="button" class="title-link media-title-link" data-card-open="${item.id}">${escapeHtml(item.title)}</button>
        <p class="media-meta">
        <span class="meta-pill">${escapeHtml(typeLabel)}</span>
        <span class="meta-pill meta-pill-quality">${escapeHtml(qualityBadge)}</span>
        ${isPendingUpload ? '<span class="meta-pill meta-pill-waiting">En attente</span>' : ""}
        ${!isPendingUpload && isComingSoonRelease ? '<span class="meta-pill meta-pill-soon">Bientot dispo</span>' : ""}
        ${!isPendingUpload && !isComingSoonRelease && isNewRelease ? '<span class="meta-pill meta-pill-new">Nouveau</span>' : ""}
        ${hasResume ? '<span class="meta-pill meta-pill-resume">Reprise</span>' : ""}
        ${isAdminForced ? '<span class="meta-pill meta-pill-admin">Admin</span>' : ""}
        ${hasWatched ? '<span class="meta-pill meta-pill-watched">Vu</span>' : ""}
        ${favorite ? '<span class="meta-pill meta-pill-favorite">Favori</span>' : ""}
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
  const removeContinue = card.querySelector(`[data-card-remove-progress="${item.id}"]`);
  const openButtons = card.querySelectorAll(`[data-card-open="${item.id}"]`);
  const thumb = card.querySelector(".media-thumb");

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

  if (removeContinue) {
    bindFastPress(removeContinue, () => {
      if (removeContinueProgressEntry(item.id, { render: true })) {
        showToast("Retire de Continuer.");
      }
    });
  }
    openButtons.forEach((button) => {
      bindSafeTap(button, () => {
        openDetails(item.id).catch(() => {
          showMessage("Impossible de charger les details.", true);
        });
      });
    });

    attachCardPreviewHandlers(card, item, thumb);

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

  attachCardPreviewHandlers(card, item, thumb);

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

  const hydrate = async () => {
    let cursor = 0;
    const concurrency = Math.max(
      2,
      Math.min(
        rows.length,
        isCompactViewport() ? DETAIL_COVER_HYDRATE_CONCURRENCY_MOBILE : DETAIL_COVER_HYDRATE_CONCURRENCY_DESKTOP
      )
    );
    const worker = async () => {
      while (cursor < rows.length) {
        const index = cursor;
        cursor += 1;
        const entry = rows[index];
        if (!entry || Number(entry.id || 0) <= 0) {
          continue;
        }
        try {
          const details = await ensureDetails(entry.id);
          updateCardCoverFromDetails(entry.id, details);
        } catch {
          // best effort only
        }
      }
    };
    await Promise.allSettled(Array.from({ length: concurrency }, () => worker()));
  };

  const schedule = () => {
    hydrate().catch(() => {
      // best effort only
    });
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(schedule, { timeout: 900 });
  } else {
    window.setTimeout(schedule, 0);
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
      rootMargin: "1200px 0px 1200px 0px",
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

function initSectionRevealObserver() {
  const targets = Array.from(
    document.querySelectorAll("main > section, .site-footer, .design-updates")
  ).filter((node) => node instanceof HTMLElement);
  targets.forEach((node) => {
    node.classList.add("reveal-on-scroll");
  });

  if (state.sectionRevealObserver) {
    state.sectionRevealObserver.disconnect();
    state.sectionRevealObserver = null;
  }

  if (isReducedMotionEnabled() || typeof IntersectionObserver !== "function") {
    targets.forEach((node) => {
      node.classList.add("is-visible");
    });
    return;
  }

  state.sectionRevealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12,
    }
  );

  targets.forEach((node) => {
    if (!node.hidden) {
      state.sectionRevealObserver.observe(node);
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
  const mediaId = Number(id || 0);
  if (mediaId <= 0) {
    return null;
  }
  if (state.detailsCache.has(mediaId)) {
    return state.detailsCache.get(mediaId) || null;
  }
  if (state.detailsMissing.has(mediaId)) {
    return null;
  }
  if (mediaId >= SUPPLEMENTAL_MEDIA_ID_MIN) {
    state.detailsMissing.add(mediaId);
    return null;
  }

  const linkedItem = findItemById(mediaId);
  if (linkedItem?.isExternal) {
    state.detailsMissing.add(mediaId);
    return null;
  }
  if (state.detailsInFlight.has(mediaId)) {
    return state.detailsInFlight.get(mediaId);
  }

  const task = (async () => {
    try {
      const payload = await fetchJson(`${API_BASE}/media/${mediaId}/sheet`);
      const details = payload?.data?.items;
      if (details && typeof details === "object") {
        state.detailsCache.set(mediaId, details);
        return details;
      }
      state.detailsMissing.add(mediaId);
      return null;
    } catch (error) {
      const message = String(error?.message || "").toLowerCase();
      if (message.includes("http 404") || message.includes("not found")) {
        state.detailsMissing.add(mediaId);
        return null;
      }
      throw error;
    }
  })();
  state.detailsInFlight.set(mediaId, task);

  try {
    return await task;
  } finally {
    state.detailsInFlight.delete(mediaId);
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

function extractSeasonEpisodeFromUrl(rawUrl) {
  const text = String(rawUrl || "").trim();
  if (!text) {
    return null;
  }
  let match =
    text.match(/S(?:aison)?\s*0*(\d{1,3})[\\/_\-.]+E(?:p(?:isode)?)?\s*0*(\d{1,4})/i) ||
    text.match(/S\s*0*(\d{1,3})\s*E\s*0*(\d{1,4})/i) ||
    text.match(/S(\d{1,3})E(\d{1,4})/i);
  if (!match) {
    const seasonMatch =
      text.match(/(?:^|[\\/._-])S(?:aison)?\s*0*(\d{1,3})(?:[\\/._-]|$)/i) ||
      text.match(/season\s*0*(\d{1,3})/i);
    const episodeMatch =
      text.match(/(?:^|[\\/._-])E(?:p(?:isode)?)?\s*0*(\d{1,4})(?:[\\/._-]|$)/i) ||
      text.match(/episode\s*0*(\d{1,4})/i);
    if (seasonMatch && episodeMatch) {
      match = [null, seasonMatch[1], episodeMatch[1]];
    }
  }
  if (!match) {
    return null;
  }
  const season = Number(match[1]);
  const episode = Number(match[2]);
  if (!Number.isFinite(season) || !Number.isFinite(episode)) {
    return null;
  }
  if (season <= 0 || episode <= 0 || season > 200 || episode > 10000) {
    return null;
  }
  return { season, episode };
}

function buildSeasonsFromDetailUrls(details) {
  const urls = Array.isArray(details?.urls) ? details.urls : [];
  if (urls.length === 0) {
    return [];
  }
  const seasonMap = new Map();
  urls.forEach((entry) => {
    const rawUrl = String(
      entry?.url ||
        entry?.stream_url ||
        entry?.file ||
        entry?.src ||
        ""
    ).trim();
    if (!rawUrl) {
      return;
    }
    const parsed = extractSeasonEpisodeFromUrl(rawUrl);
    if (!parsed) {
      return;
    }
    const { season, episode } = parsed;
    if (!seasonMap.has(season)) {
      seasonMap.set(season, new Map());
    }
    const episodeMap = seasonMap.get(season);
    if (episodeMap.has(episode)) {
      return;
    }
    episodeMap.set(episode, {
      episode,
      name: `Episode ${episode}`,
      runtime: 0,
      airDate: "",
      isSoon: false,
    });
  });
  const seasons = [];
  const seasonNumbers = Array.from(seasonMap.keys()).sort((a, b) => a - b);
  seasonNumbers.forEach((season) => {
    const episodeMap = seasonMap.get(season);
    const episodes = Array.from(episodeMap.values()).sort((a, b) => a.episode - b.episode);
    if (episodes.length > 0) {
      seasons.push({ season, episodes });
    }
  });
  return seasons;
}

async function ensureSeasons(id, options = {}) {
  if (state.seasonsCache.has(id)) {
    const cached = state.seasonsCache.get(id);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  }
  if (state.seasonsInFlight.has(id)) {
    return state.seasonsInFlight.get(id);
  }

  const task = (async () => {
    const item = findItemById(id) || (await buildItemFromDetails(id).catch(() => null));
    const allowInternalFallback = options.allowInternalFallback !== false;
    let details = null;
    if (item && item.type === "tv" && !item.isAnime) {
      details = state.detailsCache.get(Number(id)) || null;
      if (!details) {
        try {
          details = await ensureDetails(id);
        } catch {
          details = null;
        }
      }
    }

    if (allowInternalFallback && item?.isExternal) {
      const internalCandidate = findInternalProviderCandidate(item);
      if (internalCandidate && Number(internalCandidate.id || 0) > 0 && internalCandidate.id !== id) {
        const internalSeasons = await ensureSeasons(internalCandidate.id, { allowInternalFallback: false });
        if (Array.isArray(internalSeasons) && internalSeasons.length > 0) {
          state.seasonsCache.set(id, internalSeasons);
          return internalSeasons;
        }
      }
    }

    if (item?.isExternal && item?.type === "tv" && !item?.isAnime) {
      const nakiosTmdbId = Number(item?.externalTmdbId || item?.external_tmdb_id || 0);
      if (nakiosTmdbId > 0) {
        try {
          const params = new URLSearchParams({ tmdbId: String(nakiosTmdbId) });
          const zenixPayload = await fetchJson(`${API_BASE}/zenix-seasons?${params.toString()}`, {
            timeoutMs: 8000,
            retryDelays: [350, 900],
          });
          const zenixSeasons = Array.isArray(zenixPayload?.data?.items) ? zenixPayload.data.items : [];
          if (zenixSeasons.length > 0) {
            state.seasonsCache.set(id, zenixSeasons);
            return zenixSeasons;
          }
        } catch {
          // continue
        }
      }
      const title = String(item?.title || "").trim();
      if (title) {
        const params = new URLSearchParams({
          title,
          type: "tv",
        });
        const year = getItemReleaseYear(item) || getCatalogReleaseYear(item) || Number(item?.externalYear || item?.external_year || 0);
        if (year > 0) {
          params.set("year", String(year));
        }
        try {
          const zenixPayload = await fetchJson(`${API_BASE}/zenix-seasons?${params.toString()}`, {
            timeoutMs: 8000,
            retryDelays: [350, 900],
          });
          const zenixSeasons = Array.isArray(zenixPayload?.data?.items) ? zenixPayload.data.items : [];
          if (zenixSeasons.length > 0) {
            state.seasonsCache.set(id, zenixSeasons);
            return zenixSeasons;
          }
        } catch {
          // continue
        }
      }
    }
    const detailSeasons = details ? buildSeasonsFromDetailUrls(details) : [];
    const detailFastPath =
      detailSeasons.length > 0 &&
      ((Array.isArray(details?.urls) && details.urls.length > 1200) || Number(details?.episodes || 0) > 380);
    if (detailFastPath) {
      state.seasonsCache.set(id, detailSeasons);
      return detailSeasons;
    }

    const fetchAnimeSeasons = async () => {
      if (!item || item.type !== "tv") {
        return [];
      }
      const title = String(item.title || "").trim();
      if (!title) {
        return [];
      }
      const params = new URLSearchParams({
        title,
        language: "vf",
      });
      try {
        const animePayload = await fetchJson(`${API_BASE}/zenix-anime-seasons?${params.toString()}`, {
          timeoutMs: ANIME_SIBNET_TIMEOUT_MS,
          retryDelays: [350, 900],
        });
        const animeRows = Array.isArray(animePayload?.data?.items) ? animePayload.data.items : [];
        return animeRows
          .map((entry) => ({
            season: Number(entry?.season || 0),
            episodes: Array.isArray(entry?.episodes)
              ? entry.episodes
                  .map((episode) => ({
                    episode: Number(episode?.episode || 0),
                    name: String(episode?.name || `Episode ${episode?.episode || "?"}`),
                    runtime: Number(episode?.runtime || 0),
                    airDate: String(episode?.airDate || "").trim(),
                    isSoon: Boolean(episode?.isSoon),
                  }))
                  .filter((episode) => episode.episode > 0)
              : [],
          }))
          .filter((entry) => entry.season > 0 && entry.episodes.length > 0)
          .sort((a, b) => a.season - b.season);
      } catch {
        return [];
      }
    };

    if (item?.isAnime) {
      const animeSeasons = await fetchAnimeSeasons();
      if (animeSeasons.length > 0) {
        item.isAnime = true;
        state.seasonsCache.set(id, animeSeasons);
        return animeSeasons;
      }
    }

    let payload = null;
    try {
      const detailUrlCount = Array.isArray(details?.urls) ? details.urls.length : 0;
      const seasonTimeout = detailUrlCount > 500 ? 22000 : detailUrlCount > 200 ? 18000 : 15000;
      payload = await fetchJson(`${API_BASE}/media/${id}/seasons`, {
        timeoutMs: seasonTimeout,
        retryDelays: [350, 900],
      });
    } catch {
      payload = null;
    }
    const rows = Array.isArray(payload?.data?.items) ? payload.data.items : [];

    let seasons = rows
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

    if (seasons.length === 0 && item) {
      const animeSeasons = await fetchAnimeSeasons();
      if (animeSeasons.length > 0) {
        item.isAnime = true;
        seasons = animeSeasons;
      }
    }

    if (seasons.length === 0 && detailSeasons.length > 0) {
      seasons = detailSeasons;
    }

    if (seasons.length > 0) {
      state.seasonsCache.set(id, seasons);
    } else {
      state.seasonsCache.delete(id);
    }
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

function findFirstPlayableSeasonEpisode(seasons) {
  const rows = Array.isArray(seasons) ? seasons : [];
  for (const seasonRow of rows) {
    const episodes = Array.isArray(seasonRow?.episodes) ? seasonRow.episodes : [];
    const playable = episodes.find((entry) => !entry?.isSoon);
    if (playable) {
      return {
        season: Number(seasonRow.season || 0),
        episode: Number(playable.episode || 1),
      };
    }
  }
  return null;
}

function resolveSeasonEpisodeForPlayback(seasons, preferredSeason, preferredEpisode) {
  const rows = Array.isArray(seasons) ? seasons : [];
  if (rows.length === 0) {
    return { season: 0, episode: 0, episodes: [], episodeMeta: null };
  }

  let season = Number(preferredSeason || rows[0].season || 1);
  if (!rows.some((entry) => entry.season === season)) {
    season = Number(rows[0].season || 1);
  }

  let episodes = getEpisodesForSeason(rows, season);
  if (episodes.length === 0) {
    const fallbackSeason = rows.find((entry) => Array.isArray(entry?.episodes) && entry.episodes.length > 0);
    if (fallbackSeason) {
      season = Number(fallbackSeason.season || season);
      episodes = getEpisodesForSeason(rows, season);
    }
  }

  if (episodes.length === 0) {
    return { season, episode: 0, episodes: [], episodeMeta: null };
  }

  let episode = Number(preferredEpisode || getFirstPlayableEpisode(episodes) || episodes[0]?.episode || 1);
  if (!episodes.some((entry) => entry.episode === episode)) {
    episode = getFirstPlayableEpisode(episodes);
  }

  let episodeMeta = episodes.find((entry) => entry.episode === episode) || null;
  if (episodeMeta?.isSoon) {
    const sameSeasonPlayable = episodes.find((entry) => !entry?.isSoon) || null;
    if (sameSeasonPlayable) {
      episode = Number(sameSeasonPlayable.episode || episode);
      episodeMeta = sameSeasonPlayable;
    } else {
      const crossSeason = findFirstPlayableSeasonEpisode(rows);
      if (crossSeason) {
        season = crossSeason.season;
        episodes = getEpisodesForSeason(rows, season);
        episode = crossSeason.episode;
        episodeMeta = episodes.find((entry) => entry.episode === episode) || null;
      }
    }
  }

  return { season, episode, episodes, episodeMeta };
}

function resolveNextPlayableEpisode(seasons, currentSeason, currentEpisode) {
  const rows = Array.isArray(seasons) ? seasons.slice() : [];
  if (rows.length === 0) {
    return null;
  }
  rows.sort((left, right) => Number(left?.season || 0) - Number(right?.season || 0));

  const safeSeason = Number(currentSeason || rows[0]?.season || 1);
  const safeEpisode = Math.max(0, Number(currentEpisode || 0));

  for (const seasonRow of rows) {
    const seasonNumber = Number(seasonRow?.season || 0);
    if (!seasonNumber || seasonNumber < safeSeason) {
      continue;
    }
    const episodes = Array.isArray(seasonRow?.episodes) ? seasonRow.episodes.slice() : [];
    if (episodes.length === 0) {
      continue;
    }
    episodes.sort((left, right) => Number(left?.episode || 0) - Number(right?.episode || 0));

    const candidate =
      seasonNumber === safeSeason
        ? episodes.find((entry) => Number(entry?.episode || 0) > safeEpisode && !entry?.isSoon)
        : episodes.find((entry) => !entry?.isSoon);
    if (candidate) {
      return { season: seasonNumber, episode: Number(candidate.episode || 1) };
    }
  }
  return null;
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
    const showSoon = Boolean(entry?.isSoon);
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

function updatePlayerNextEpisodeButton() {
  const button = refs.playerNextEpisodeBtn;
  if (!button) {
    return;
  }
  const label = button.querySelector(".btn-label");
  if (!state.nowPlaying || state.nowPlaying.type !== "tv") {
    button.hidden = true;
    button.disabled = true;
    button.removeAttribute("data-next-season");
    button.removeAttribute("data-next-episode");
    if (label) {
      label.textContent = "Episode suivant";
    }
    button.title = "";
    return;
  }

  const mediaId = Number(state.nowPlaying.id || 0);
  const seasons = state.seasonsCache.get(mediaId) || [];
  const currentSeason = Number(refs.playerSeasonSelect?.value || state.nowPlaying.season || 1);
  const currentEpisode = Number(refs.playerEpisodeSelect?.value || state.nowPlaying.episode || 1);
  const next = resolveNextPlayableEpisode(seasons, currentSeason, currentEpisode);

  button.hidden = false;
  if (!next) {
    button.disabled = true;
    button.removeAttribute("data-next-season");
    button.removeAttribute("data-next-episode");
    if (label) {
      label.textContent = "Fin de saison";
    }
    button.title = "Aucun episode suivant disponible";
    return;
  }

  button.disabled = false;
  button.dataset.nextSeason = String(next.season);
  button.dataset.nextEpisode = String(next.episode);
  if (label) {
    label.textContent = "Episode suivant";
  }
  button.title = `Episode suivant: S${next.season}E${String(next.episode).padStart(2, "0")}`;
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

async function refreshEpisodeTitlesFromApi(id, season, episodes) {
  if (!Number.isInteger(Number(id)) || !Number.isInteger(Number(season)) || !Array.isArray(episodes)) {
    return false;
  }
  const key = `${Number(id || 0)}:${Number(season || 0)}`;
  const last = Number(state.seasonNameRefreshAt.get(key) || 0);
  if (last && Date.now() - last < EPISODE_NAME_REFRESH_TTL_MS) {
    return false;
  }
  state.seasonNameRefreshAt.set(key, Date.now());

  let payload = null;
  try {
    payload = await fetchJson(`${API_BASE}/media/${id}/seasons`, { timeoutMs: 8000 });
  } catch {
    return false;
  }
  const rows = Array.isArray(payload?.data?.items) ? payload.data.items : [];
  const seasonRow = rows.find((entry) => Number(entry?.season || 0) === Number(season || 0));
  if (!seasonRow) {
    return false;
  }
  const episodeRows = Array.isArray(seasonRow?.episodes) ? seasonRow.episodes : [];
  if (episodeRows.length === 0) {
    return false;
  }

  let changed = false;
  episodes.forEach((entry) => {
    const episodeNumber = Number(entry?.episode || 0);
    if (!episodeNumber) {
      return;
    }
    const match = episodeRows.find((row) => Number(row?.episode || 0) === episodeNumber);
    if (!match) {
      return;
    }
    const candidateName = String(match?.name || match?.formattedName || match?.title || "").trim();
    if (candidateName && !isGenericEpisodePlaceholderName(candidateName, episodeNumber)) {
      entry.name = candidateName;
      changed = true;
    }
  });

  return changed;
}

async function verifySoonEpisodesForSeason(id, season, episodes) {
  if (!Number.isInteger(Number(id)) || !Number.isInteger(Number(season)) || !Array.isArray(episodes)) {
    return false;
  }

  const candidates = episodes
    .filter((entry) => Boolean(entry?.isSoon))
    .slice(0, EPISODE_SOON_VERIFY_LIMIT);
  if (candidates.length === 0) {
    return false;
  }

  let changed = false;
  let needsTitleRefresh = false;
  for (const entry of candidates) {
    const playable = await isEpisodePlayableByStream(id, season, Number(entry.episode || 0));
    if (playable && entry.isSoon) {
      entry.isSoon = false;
      changed = true;
      if (isGenericEpisodePlaceholderName(entry?.name, entry?.episode)) {
        needsTitleRefresh = true;
      }
    }
  }
  if (needsTitleRefresh) {
    const refreshed = await refreshEpisodeTitlesFromApi(id, season, episodes);
    if (refreshed) {
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
  const fallback = document.createElement("option");
  fallback.value = "";
  fallback.textContent = "Auto";
  fallback.selected = !String(selectedLanguage || "").trim();
  select.appendChild(fallback);
  if (normalized.length === 0) {
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
  const rank = new Map([
    ["VF", 0],
    ["MULTI", 1],
    ["VOSTFR", 2],
    ["VO", 3],
  ]);
  ordered.sort((left, right) => {
    const leftRank = Number(rank.get(String(left || "").toUpperCase()) ?? 10);
    const rightRank = Number(rank.get(String(right || "").toUpperCase()) ?? 10);
    if (leftRank !== rightRank) {
      return leftRank - rightRank;
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
  const fallbackOrder = ["VF", "VOSTFR", "MULTI", "VO"];
  for (const entry of fallbackOrder) {
    if (availableLanguages.includes(entry)) {
      return entry;
    }
  }
  return "";
}

function filterSourcesByLanguage(sources, language) {
  const rows = Array.isArray(sources) ? sources.slice() : [];
  const selected = String(language || "").trim().toUpperCase();
  if (!selected) {
    return rows;
  }
  const direct = rows.filter((entry) => entry.language === selected);
  if (selected === "MULTI") {
    return direct.length > 0 ? direct : rows;
  }

  const multi = rows.filter((entry) => entry.language === "MULTI");
  const merged = [];
  const seen = new Set();
  for (const entry of direct.concat(multi)) {
    const key = String(entry?.url || "").trim();
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    merged.push(entry);
  }
  return merged.length > 0 ? merged : rows;
}

function filterMovieSourcesForFrench(sources) {
  const rows = Array.isArray(sources) ? sources.slice() : [];
  if (rows.length <= 1) {
    return rows;
  }
  const indexed = rows.map((entry, index) => ({
    entry,
    index,
    language: String(entry?.language || "").trim().toUpperCase(),
  }));
  const hasFrenchFriendly = indexed.some(
    (entry) => entry.language === "VF" || entry.language === "VOSTFR" || entry.language === "MULTI"
  );
  if (!hasFrenchFriendly) {
    return rows;
  }
  const withoutVo = indexed.filter((entry) => entry.language !== "VO");
  const ranked = (withoutVo.length > 0 ? withoutVo : indexed).slice();
  const languageOrder = new Map([
    ["VF", 0],
    ["MULTI", 1],
    ["VOSTFR", 2],
    ["VO", 4],
  ]);
  const preferMp4 = isLikelyMobileDevice();
  const formatOrder = new Map(
    preferMp4
      ? [
          ["mp4", 0],
          ["hls", 1],
          ["webm", 2],
          ["dash", 3],
          ["embed", 6],
          ["unknown", 7],
        ]
      : [
          ["hls", 0],
          ["mp4", 1],
          ["webm", 2],
          ["dash", 3],
          ["embed", 6],
          ["unknown", 7],
        ]
  );
  ranked.sort((left, right) => {
    const leftLang = Number(languageOrder.get(left.language) ?? 3);
    const rightLang = Number(languageOrder.get(right.language) ?? 3);
    if (leftLang !== rightLang) {
      return leftLang - rightLang;
    }
    const leftFormat = Number(formatOrder.get(String(left.entry?.format || "").trim().toLowerCase()) ?? 5);
    const rightFormat = Number(formatOrder.get(String(right.entry?.format || "").trim().toLowerCase()) ?? 5);
    if (leftFormat !== rightFormat) {
      return leftFormat - rightFormat;
    }
    const leftPremium = left.entry?.premiumHint ? 1 : 0;
    const rightPremium = right.entry?.premiumHint ? 1 : 0;
    if (leftPremium !== rightPremium) {
      return leftPremium - rightPremium;
    }
    return left.index - right.index;
  });

  const directFormats = new Set(["hls", "mp4", "webm", "dash"]);
  const hasDirectCandidate = ranked.some((row) =>
    directFormats.has(String(row?.entry?.format || "").trim().toLowerCase())
  );
  const dedupe = new Set();
  const ordered = [];
  for (const row of ranked) {
    const format = String(row?.entry?.format || "").trim().toLowerCase();
    if (hasDirectCandidate && !directFormats.has(format)) {
      continue;
    }
    const key = String(row.entry?.url || "").trim();
    if (!key || dedupe.has(key)) {
      continue;
    }
    dedupe.add(key);
    ordered.push(row.entry);
  }
  return ordered.length > 0 ? ordered : rows;
}

function shouldAllowPremiumRescueForMovie(sources, video) {
  const rows = Array.isArray(sources) ? sources : [];
  if (!rows.length) {
    return false;
  }
  const premiumCount = rows.filter((entry) => Boolean(entry?.premiumHint)).length;
  const freeCount = rows.length - premiumCount;
  if (premiumCount === 0 || freeCount === 0) {
    return false;
  }
  const mobileNativeHls = shouldUseNativeHls(video) && isLikelyMobileDevice();
  if (!mobileNativeHls) {
    return true;
  }
  // On iPhone/iPad, allow premium rescue only when free catalog is too small.
  return freeCount <= 1;
}

async function syncDetailLanguageOptions(id, season, episode) {
  const item = findItemById(id);
  if (!item || item.type !== "tv") {
    populateLanguageSelect(refs.detailLanguageSelect, [], "");
    refs.detailLanguageSelect.disabled = true;
    state.detailLangCache.delete(id);
    return {
      sources: [],
      languages: [],
      selected: "",
      compatibility: "",
    };
  }
  const payload = await fetchStreamJson(`/stream/${id}/episode?season=${season}&episode=${episode}`);
  const baseSources = extractSources(payload);
  const autoSources = appendAutoZenixRelaySources(baseSources);
  const ownedSources = await appendZenixOwnedSources(item, season, episode, autoSources);
  const sources = await appendNakiosSources(item, season, episode, ownedSources);
  const languages = getAvailableLanguages(sources);
  const selected = resolvePreferredLanguage(id, refs.detailLanguageSelect?.value || "", languages);
  populateLanguageSelect(refs.detailLanguageSelect, languages, selected);
  refs.detailLanguageSelect.disabled = languages.length <= 1;
  if (selected) {
    state.detailLangCache.set(id, selected);
  } else {
    state.detailLangCache.delete(id);
  }
  const compatibility = inferCompatibilityLabelFromSources(sources);
  cacheDetailCompatibilityLabel(item, compatibility, season, episode);
  if (
    state.selectedDetailId === id &&
    Number(refs.detailSeasonSelect?.value || season) === season &&
    Number(refs.detailEpisodeSelect?.value || episode) === episode
  ) {
    setDetailCompatibilityBadge(compatibility);
  }
  return {
    sources,
    languages,
    selected,
    compatibility,
  };
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
  prefetchStreamForItem(item);

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
  updateDetailRatingButtons(id);
  refs.detailSeriesControls.hidden = true;
  refs.detailLanguageSelect.innerHTML = "";
  refs.detailLanguageSelect.disabled = true;
  refs.trailerWrap.hidden = true;
  refs.trailerFrame.src = "";
  refs.detailModal.hidden = false;
  updateBodyScrollLock();
  applyNativeAdPlacement();

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

  const pendingOverviewNote = isLikelyRecentPendingUpload(item)
    ? "Contenu encore trop recent. Mise en ligne en cours."
    : "";
  const detailOverviewBase = details?.overview || "Aucune description detaillee disponible pour ce titre.";
  refs.detailOverview.textContent = pendingOverviewNote
    ? `${pendingOverviewNote}
${detailOverviewBase}`
    : detailOverviewBase;

  refs.detailBadges.innerHTML = "";
  const badges = [getItemTypeLabel(item)];
  if (isPendingUploadItem(item)) {
    badges.unshift("En attente");
  }
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
  setDetailCompatibilityBadge(readDetailCompatibilityLabel(item, 1, 1));

  refs.detailTrailerBtn.disabled = trailers.length === 0;
  updateDetailFavoriteButton(id);
  updateDetailRatingButtons(id);

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
        const streamInfo = await syncDetailLanguageOptions(id, defaultSeason, defaultEpisode);
        if (streamInfo?.compatibility) {
          setDetailCompatibilityBadge(streamInfo.compatibility);
        }
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
    fetchStreamJson(`/stream/${id}`)
      .then((payload) => {
        if (state.detailToken !== detailToken || state.selectedDetailId !== id) {
          return;
        }
        const sources = extractSources(payload);
        const compatibility = inferCompatibilityLabelFromSources(sources);
        cacheDetailCompatibilityLabel(item, compatibility, 1, 1);
        setDetailCompatibilityBadge(compatibility);
      })
      .catch(() => {
        // best effort only
      });
  }
}

function closeDetails(options = {}) {
  activatePostCloseTapGuard(1400);
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
  applyNativeAdPlacement();
  if (refs.playerOverlay.hidden && refs.detailModal.hidden) {
    restoreModalScrollPosition();
  }
  flushDeferredDesktopMainNavFit(30);
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
  if (!state.gateReady && !state.adblockDetected) {
    await refreshGateToken({ force: true }).catch(() => {
      // handled later if still blocked
    });
  }
  ensureDetails(id).catch(() => null);

  const token = ++state.playToken;
  const resume = state.progress[id] || null;
  const explicitResumeTime = getExplicitResumeTime(options);
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
  if (refs.playerSubTitle) {
    refs.playerSubTitle.textContent = item.type === "tv" ? "Serie / anime" : "Film";
  }
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
  clearAwaitingUserPlay();
  renderPlayerSourceOptions();
  populateLanguageSelect(refs.playerLanguageSelect, [], "");
  refs.playerLanguageSelect.disabled = true;
  updateBodyScrollLock();
  applyNativeAdPlacement();
  startPlaybackGuard();
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
          resolveMovieResumeTime(resume, explicitResumeTime),
          token,
          options.syncRoute !== false
        );
        return;
      }

      let { season, episode, episodes, episodeMeta } = resolveSeasonEpisodeForPlayback(
        seasons,
        Number(options.season || resume?.season || seasons[0].season),
        Number(options.episode || resume?.episode || 0)
      );
      if (episodes.length === 0) {
        throw new Error("No episode for selected season");
      }

      if (episodeMeta?.isSoon && isGenericEpisodePlaceholderName(episodeMeta?.name, episodeMeta?.episode)) {
        const selectedPlayable = await isEpisodePlayableByStream(id, season, episode);
        if (selectedPlayable) {
          episodeMeta.isSoon = false;
        }
      }
      if (episodeMeta?.isSoon) {
        const fallback = resolveSeasonEpisodeForPlayback(seasons, season, 0);
        if (fallback.episodes.length > 0) {
          season = fallback.season;
          episode = fallback.episode;
          episodes = fallback.episodes;
          episodeMeta = fallback.episodeMeta;
        }
      }

      populateSeasonSelect(refs.playerSeasonSelect, seasons, season);
      populateEpisodeSelect(refs.playerEpisodeSelect, episodes, episode);
      updatePlayerNextEpisodeButton();
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
          updatePlayerNextEpisodeButton();
        })
        .catch(() => {
          // no-op
        });
      refs.playerSeriesControls.hidden = false;

      const resumeTime = resolveEpisodeResumeTime(resume, season, episode, explicitResumeTime);
      await loadEpisodeStream(
        item,
        season,
        episode,
        resumeTime,
        token,
        String(options.language || resume?.language || ""),
        options.syncRoute !== false
      );
      return;
    }

    refs.playerSeriesControls.hidden = true;
    await loadMovieStream(
      item,
      resolveMovieResumeTime(resume, explicitResumeTime),
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

function getExternalPlaybackContext(item) {
  const season = Math.max(1, Number(item?.externalSeason || 1));
  const episode = Math.max(1, Number(item?.externalEpisode || 1));
  const year = Math.max(0, Number(item?.externalYear || Number.parseInt(getYear(item?.releaseDate || ""), 10) || 0));
  return { season, episode, year };
}

function areProviderTitlesCompatible(leftTitle, rightTitle) {
  const leftKey = normalizeTitleKey(leftTitle || "");
  const rightKey = normalizeTitleKey(rightTitle || "");
  if (!leftKey || !rightKey) {
    return false;
  }
  if (leftKey === rightKey) {
    return true;
  }

  const leftCompact = leftKey.replace(/[^a-z0-9]+/g, " ").trim();
  const rightCompact = rightKey.replace(/[^a-z0-9]+/g, " ").trim();
  if (leftCompact && rightCompact) {
    if (leftCompact.length >= 6 && rightCompact.includes(leftCompact)) {
      return true;
    }
    if (rightCompact.length >= 6 && leftCompact.includes(rightCompact)) {
      return true;
    }
  }

  const stopWords = new Set(["le", "la", "les", "de", "du", "des", "the", "and", "of", "a", "an"]);
  const tokenize = (value) =>
    String(value || "")
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length >= 3 && !stopWords.has(token));

  const leftTokens = tokenize(leftCompact);
  const rightTokens = tokenize(rightCompact);
  if (leftTokens.length === 0 || rightTokens.length === 0) {
    return false;
  }

  const leftSet = new Set(leftTokens);
  let shared = 0;
  rightTokens.forEach((token) => {
    if (leftSet.has(token)) {
      shared += 1;
    }
  });

  const threshold = Math.max(2, Math.ceil(Math.min(leftSet.size, rightTokens.length) * 0.7));
  return shared >= threshold;
}

function findInternalProviderCandidate(item, options = {}) {
  if (!item) {
    return null;
  }
  const mediaType = item.type === "tv" ? "tv" : "movie";
  const titleKey = normalizeTitleKey(item.title || item.titleKey || "");
  if (!titleKey) {
    return null;
  }
  const targetYear = getItemReleaseYear(item);
  const maxYearDelta = Math.max(0, Number(options.maxYearDelta || 1));
  for (const candidate of state.catalog) {
    if (!candidate) {
      continue;
    }
    const candidateId = Number(candidate.id || 0);
    if (candidateId <= 0 || candidateId >= SUPPLEMENTAL_MEDIA_ID_MIN) {
      continue;
    }
    if (Boolean(candidate.isExternal)) {
      continue;
    }
    if ((candidate.type === "tv" ? "tv" : "movie") !== mediaType) {
      continue;
    }
    const candidateTitle = String(candidate.title || candidate.titleKey || "").trim();
    if (!areProviderTitlesCompatible(candidateTitle, item.title || item.titleKey || "")) {
      continue;
    }
    if (targetYear > 0) {
      const candidateYear = getItemReleaseYear(candidate);
      if (candidateYear > 0 && Math.abs(candidateYear - targetYear) > maxYearDelta) {
        continue;
      }
    }
    return candidate;
  }
  return null;
}

async function findInternalProviderCandidateFromSearch(item, options = {}) {
  if (!item) {
    return null;
  }
  const title = String(item.title || item.titleKey || "").trim();
  if (title.length < 2) {
    return null;
  }
  const mediaType = item.type === "tv" ? "tv" : "movie";
  const targetYear = getItemReleaseYear(item);
  const maxYearDelta = Math.max(0, Number(options.maxYearDelta || 2));
  let payload = null;
  try {
    payload = await fetchJson(`${API_BASE}/search-bar/search/${encodeURIComponent(title)}`, {
      timeoutMs: 4200,
    });
  } catch {
    payload = null;
  }
  if (!payload) {
    return null;
  }

  const rows = extractSearchRows(payload);
  if (rows.length === 0) {
    return null;
  }
  const candidates = rows.map(normalizeCatalogItem).filter(Boolean);
  if (candidates.length === 0) {
    return null;
  }

  let best = null;
  let bestScore = -Infinity;
  const targetTitleKey = normalizeTitleKey(title);
  for (const candidate of candidates) {
    const candidateId = Number(candidate?.id || 0);
    if (candidateId <= 0 || candidateId >= SUPPLEMENTAL_MEDIA_ID_MIN) {
      continue;
    }
    if (Boolean(candidate?.isExternal)) {
      continue;
    }
    if ((candidate.type === "tv" ? "tv" : "movie") !== mediaType) {
      continue;
    }
    const candidateTitle = String(candidate.title || candidate.titleKey || "").trim();
    if (!areProviderTitlesCompatible(candidateTitle, title)) {
      continue;
    }
    const candidateYear = getItemReleaseYear(candidate);
    if (targetYear > 0 && candidateYear > 0) {
      const delta = Math.abs(candidateYear - targetYear);
      if (delta > maxYearDelta) {
        continue;
      }
    }
    let score = 0;
    const candidateTitleKey = normalizeTitleKey(candidateTitle);
    if (candidateTitleKey && targetTitleKey && candidateTitleKey === targetTitleKey) {
      score += 2;
    }
    if (targetYear > 0 && candidateYear > 0) {
      const delta = Math.abs(candidateYear - targetYear);
      score += Math.max(0, 2 - delta);
    }
    if (candidate.poster) {
      score += 0.2;
    }
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best;
}

async function hasPlayablePurstreamSources(item, season = 1, episode = 1) {
  const mediaId = Number(item?.id || 0);
  if (mediaId <= 0 || mediaId >= SUPPLEMENTAL_MEDIA_ID_MIN) {
    return false;
  }

  if (item?.type === "tv") {
    try {
      const episodePayload = await fetchStreamJson(`/stream/${mediaId}/episode?season=${season}&episode=${episode}`, {
        force: true,
        timeoutMs: Math.max(4200, STREAM_DIRECT_PREFETCH_TIMEOUT_MS),
        retryDelays: [260],
      });
      if (extractSources(episodePayload).length > 0) {
        return true;
      }
    } catch {
      // continue below
    }
  }

  try {
    const payload = await fetchStreamJson(`/stream/${mediaId}`, {
      force: true,
      timeoutMs: Math.max(4200, STREAM_DIRECT_PREFETCH_TIMEOUT_MS),
      retryDelays: [260],
    });
    return extractSources(payload).length > 0;
  } catch {
    return false;
  }
}

async function resolvePlayableProviderItem(item, season = 1, episode = 1) {
  if (!item || !item.isExternal) {
    return item;
  }
  let internalCandidate = findInternalProviderCandidate(item);
  if (!internalCandidate) {
    internalCandidate = await findInternalProviderCandidateFromSearch(item);
  }
  if (!internalCandidate) {
    return item;
  }
  const playable = await hasPlayablePurstreamSources(internalCandidate, season, episode);
  return playable ? internalCandidate : item;
}

function buildSourcePayloadFromList(sources) {
  const rows = Array.isArray(sources) ? sources : [];
  return {
    data: {
      items: {
        sources: rows,
      },
    },
  };
}

function mergeSourceLists(baseSources, additionalSources) {
  const merged = Array.isArray(baseSources) ? baseSources.slice() : [];
  const existing = new Set(merged.map((entry) => getSourceDedupKey(entry)).filter(Boolean));
  const rows = Array.isArray(additionalSources) ? additionalSources : [];
  rows.forEach((entry, index) => {
    const normalized = normalizeSourceEntry(entry, merged.length + index);
    if (!normalized) {
      return;
    }
    const key = getSourceDedupKey(normalized);
    if (key && existing.has(key)) {
      return;
    }
    if (key) {
      existing.add(key);
    }
    merged.push(normalized);
  });
  return merged;
}

async function resolveEpisodePayloadWithStrategy(item, season = 1, episode = 1) {
  let selectedItem = item;
  const safeSeason = Math.max(1, Number(season || 1));
  const safeEpisode = Math.max(1, Number(episode || 1));
  if (item?.isExternal) {
    selectedItem = await resolvePlayableProviderItem(item, safeSeason, safeEpisode);
  }

  if (selectedItem?.isAnime) {
    return {
      selectedItem,
      payload: buildSourcePayloadFromList([]),
      preloadedNakios: [],
      nakiosPromise: Promise.resolve([]),
    };
  }

  const streamPath = `/stream/${selectedItem.id}/episode?season=${safeSeason}&episode=${safeEpisode}`;
  const streamPromise = fetchStreamJson(streamPath, { force: true })
    .then((payload) => ({
      payload,
      sources: extractSources(payload),
    }))
    .catch(() => ({
      payload: null,
      sources: [],
    }));
  const nakiosPromise = appendNakiosSources(selectedItem, safeSeason, safeEpisode, [])
    .then((sources) => (Array.isArray(sources) ? sources : []))
    .catch(() => []);

  const streamSoft = await Promise.race([streamPromise, wait(4600).then(() => null)]);
  if (streamSoft?.sources?.length > 0) {
    return {
      selectedItem,
      payload: streamSoft.payload,
      preloadedNakios: null,
      nakiosPromise,
    };
  }

  const nakiosSoft = await Promise.race([nakiosPromise, wait(3400).then(() => null)]);
  if (Array.isArray(nakiosSoft) && nakiosSoft.length > 0) {
    return {
      selectedItem,
      payload: buildSourcePayloadFromList(nakiosSoft),
      preloadedNakios: nakiosSoft,
      nakiosPromise: Promise.resolve(nakiosSoft),
    };
  }

  const streamFinal = streamSoft || (await streamPromise);
  if (streamFinal?.sources?.length > 0) {
    return {
      selectedItem,
      payload: streamFinal.payload,
      preloadedNakios: null,
      nakiosPromise,
    };
  }

  const nakiosFinal = Array.isArray(nakiosSoft) ? nakiosSoft : await nakiosPromise;
  if (nakiosFinal.length > 0) {
    return {
      selectedItem,
      payload: buildSourcePayloadFromList(nakiosFinal),
      preloadedNakios: nakiosFinal,
      nakiosPromise: Promise.resolve(nakiosFinal),
    };
  }

  if (streamFinal?.payload) {
    return {
      selectedItem,
      payload: streamFinal.payload,
      preloadedNakios: [],
      nakiosPromise: Promise.resolve([]),
    };
  }

  throw new Error("No episode source");
}

async function resolveExternalItemSources(item) {
  const { season, episode } = getExternalPlaybackContext(item);
  const ownedMerged = await appendZenixOwnedSources(item, season, episode, []);
  const nakiosMerged = await appendNakiosSources(item, season, episode, ownedMerged);
  const filmer2Merged = await appendFilmer2Sources(item, season, episode, nakiosMerged);
  const filtered = filterMovieSourcesForFrench(filmer2Merged);
  const repaired = await appendRepairSources(item, season, episode, filtered);
  const relayed = appendAutoZenixRelaySources(repaired);
  return {
    sources: relayed,
    season,
    episode,
  };
}

async function loadMovieStream(item, resumeTime, token, syncRoute = true) {
  const externalContext = getExternalPlaybackContext(item);
  let selectedItem = item;
  let isExternalItem = Boolean(item?.isExternal && item?.externalProvider);
  if (isExternalItem) {
    selectedItem = await resolvePlayableProviderItem(item, externalContext.season, externalContext.episode);
    isExternalItem = Boolean(selectedItem?.isExternal && selectedItem?.externalProvider);
  }

  const { season: externalSeason, episode: externalEpisode } = getExternalPlaybackContext(selectedItem || item);
  const streamPath = `/stream/${selectedItem?.id || item.id}`;
  const refreshMovieSourcePool = async (statusLabel) => {
    if (token !== state.playToken) {
      return [];
    }
    if (statusLabel) {
      setPlayerStatus(statusLabel);
    }
    if (isExternalItem) {
      const refreshedExternal = await resolveExternalItemSources(selectedItem);
      if (token !== state.playToken) {
        return [];
      }
      clearManualSourceLock();
      state.sourcePool = refreshedExternal.sources;
    } else {
      const isSeriesFallbackMode = selectedItem.type === "tv";
      if (!statusLabel) {
        setPlayerStatus(isSeriesFallbackMode ? "Actualisation des sources serie..." : "Actualisation des sources film...");
      }
      let refreshedPayload = null;
      if (isSeriesFallbackMode) {
        const episodePath = `/stream/${selectedItem.id}/episode?season=${externalSeason}&episode=${externalEpisode}`;
        try {
          refreshedPayload = await fetchStreamJson(episodePath, { force: true });
          if (extractSources(refreshedPayload).length === 0) {
            refreshedPayload = null;
          }
        } catch {
          refreshedPayload = null;
        }
      }
      if (!refreshedPayload) {
        refreshedPayload = await fetchStreamJson(streamPath, { force: true });
      }
      if (token !== state.playToken) {
        return [];
      }
      clearManualSourceLock();
      const refreshedMovieSources = extractSources(refreshedPayload);
      const refreshedAutoMovieSources = appendAutoZenixRelaySources(refreshedMovieSources);
      const refreshedOwnedMovieSources = await appendZenixOwnedSources(selectedItem, 1, 1, refreshedAutoMovieSources);
      const nakiosPromise = appendNakiosSources(selectedItem, 1, 1, refreshedOwnedMovieSources);
      let warmNakiosSources = [];
      if (refreshedOwnedMovieSources.length === 0) {
        warmNakiosSources = await nakiosPromise.then((sources) => (Array.isArray(sources) ? sources : [])).catch(() => []);
      } else {
        const warmNakiosWaitMs = isLikelyMobileDevice() ? 5200 : 2200;
        warmNakiosSources = await Promise.race([
          nakiosPromise.then((sources) => (Array.isArray(sources) ? sources : [])).catch(() => []),
          wait(warmNakiosWaitMs).then(() => []),
        ]);
      }
      const refreshedNakiosMovieSources =
        Array.isArray(warmNakiosSources) && warmNakiosSources.length > 0 ? warmNakiosSources : refreshedOwnedMovieSources;
      state.sourcePool = filterMovieSourcesForFrench(refreshedNakiosMovieSources);
      state.sourcePool = await appendRepairSources(selectedItem, 1, 1, state.sourcePool);
      nakiosPromise
        .then((sources) => {
          if (token !== state.playToken) {
            return;
          }
          const nextSources = Array.isArray(sources) ? sources : [];
          if (nextSources.length === 0) {
            return;
          }
          const merged = mergeSourceLists(state.allEpisodeSources, nextSources);
          if (merged.length === state.allEpisodeSources.length) {
            return;
          }
          state.allEpisodeSources = merged;
          state.sourcePool = filterMovieSourcesForFrench(merged);
          renderPlayerSourceOptions();
        })
        .catch(() => {});
    }
    state.allEpisodeSources = state.sourcePool.slice();
    state.sourceRetryAttempts.clear();
    state.sourceIndex = -1;
    renderPlayerSourceOptions();
    scheduleHlsLanguageProbe(state.allEpisodeSources);
    return state.sourcePool;
  };

  if (isExternalItem) {
    setPlayerStatus("Connexion aux sources externes...");
    const resolved = await resolveExternalItemSources(selectedItem);
    if (token !== state.playToken) {
      return;
    }
    clearManualSourceLock();
    state.sourcePool = resolved.sources;
  } else {
    const isSeriesFallbackMode = selectedItem.type === "tv";
    setPlayerStatus(isSeriesFallbackMode ? "Connexion au flux serie..." : "Connexion au flux film...");
    let payload = null;
    if (isSeriesFallbackMode) {
      const episodePath = `/stream/${selectedItem.id}/episode?season=${externalSeason}&episode=${externalEpisode}`;
      try {
        payload = await fetchStreamJson(episodePath, { force: true });
        if (extractSources(payload).length === 0) {
          payload = null;
        }
      } catch {
        payload = null;
      }
    }
    if (!payload) {
      payload = await fetchStreamJson(streamPath, { force: true });
    }
    if (token !== state.playToken) {
      return;
    }

    clearManualSourceLock();
    const baseMovieSources = extractSources(payload);
    const autoMovieSources = appendAutoZenixRelaySources(baseMovieSources);
    const ownedMovieSources = await appendZenixOwnedSources(selectedItem, 1, 1, autoMovieSources);
    const nakiosPromise = appendNakiosSources(selectedItem, 1, 1, ownedMovieSources);
    let warmNakiosSources = [];
    if (ownedMovieSources.length === 0) {
      warmNakiosSources = await nakiosPromise.then((sources) => (Array.isArray(sources) ? sources : [])).catch(() => []);
    } else {
      const warmNakiosWaitMs = isLikelyMobileDevice() ? 5200 : 2200;
      warmNakiosSources = await Promise.race([
        nakiosPromise.then((sources) => (Array.isArray(sources) ? sources : [])).catch(() => []),
        wait(warmNakiosWaitMs).then(() => []),
      ]);
    }
    const nakiosMovieSources =
      Array.isArray(warmNakiosSources) && warmNakiosSources.length > 0 ? warmNakiosSources : ownedMovieSources;
    state.sourcePool = filterMovieSourcesForFrench(nakiosMovieSources);
    state.sourcePool = await appendRepairSources(selectedItem, 1, 1, state.sourcePool);
    nakiosPromise
      .then((sources) => {
        if (token !== state.playToken) {
          return;
        }
        const nextSources = Array.isArray(sources) ? sources : [];
        if (nextSources.length === 0) {
          return;
        }
        const merged = mergeSourceLists(state.allEpisodeSources, nextSources);
        if (merged.length === state.allEpisodeSources.length) {
          return;
        }
        state.allEpisodeSources = merged;
        state.sourcePool = filterMovieSourcesForFrench(merged);
        renderPlayerSourceOptions();
      })
      .catch(() => {});
  }
  state.allEpisodeSources = state.sourcePool.slice();
  state.sourceRetryAttempts.clear();
  if (state.sourcePool.length === 0) {
    await refreshMovieSourcePool(
      isExternalItem ? "Actualisation des sources externes..." : "Actualisation des sources film..."
    );
    if (state.sourcePool.length === 0) {
      const rescue = await attemptExternalRescue(selectedItem, externalSeason, externalEpisode);
      if (rescue && rescue.item && rescue.item.id && rescue.item.id !== selectedItem.id) {
        notifyActionMessage("Source alternative trouvee, bascule en cours...");
        return loadMovieStream(rescue.item, resumeTime, token, syncRoute);
      }
      if (rescue && Array.isArray(rescue.sources) && rescue.sources.length > 0) {
        if (rescue.detailUrl) {
          selectedItem.externalDetailUrl = rescue.detailUrl;
          selectedItem.external_detail_url = rescue.detailUrl;
        }
        state.sourcePool = filterMovieSourcesForFrench(rescue.sources);
        state.allEpisodeSources = state.sourcePool.slice();
        state.sourceRetryAttempts.clear();
        renderPlayerSourceOptions();
        notifyActionMessage("Sources externes injectees automatiquement.");
      }
    }
    if (state.sourcePool.length === 0) {
      const pendingHint = isLikelyRecentPendingUpload(selectedItem);
      if (pendingHint) {
        markItemAvailability(selectedItem.id, "pending");
      }
      const message = pendingHint
        ? "En attente de mise en ligne. Contenu encore trop recent."
        : "Lecture indisponible pour ce titre.";
      clearPlaybackGuard();
      setPlayerStatus(message, true);
      showMessage(message, true);
      return;
    }
  }
  state.sourceIndex = -1;
  renderPlayerSourceOptions();
  scheduleHlsLanguageProbe(state.allEpisodeSources);
  const allowPremiumRescue = shouldAllowPremiumRescueForMovie(state.sourcePool, refs.playerVideo);
  try {
    await playFromSourcePoolWithRescue(resumeTime, token, {
      startIndex: 0,
      skipPremiumFallback: true,
      allowPremiumRescue,
    });
  } catch (firstError) {
    if (token !== state.playToken) {
      throw firstError;
    }
    await refreshMovieSourcePool(
      isExternalItem ? "Actualisation des sources externes..." : "Actualisation des sources film..."
    );
    if (state.sourcePool.length === 0) {
      throw firstError;
    }
    await playFromSourcePoolWithRescue(resumeTime, token, {
      startIndex: 0,
      skipPremiumFallback: true,
      allowPremiumRescue,
    });
    showToast("Source film actualisee automatiquement.");
  }
  state.nowPlaying = {
    id: selectedItem.id,
    type: "movie",
    title: selectedItem.title,
    poster: selectedItem.poster,
    isAnime: false,
    season: isExternalItem ? externalSeason : 1,
    episode: isExternalItem ? externalEpisode : 1,
  };
  setPlayerSubTitle(isExternalItem && selectedItem.type === "tv" ? `Episode S${externalSeason}E${externalEpisode}` : "Film");
  if (syncRoute) {
    setAppRoute({ watch: selectedItem.id }, { replace: true });
  }
  updatePlayerNextEpisodeButton();
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
  const safeSeason = Math.max(1, Number(season || 1));
  const safeEpisode = Math.max(1, Number(episode || 1));
  setPlayerStatus(`Chargement S${safeSeason}E${safeEpisode}...`);

  if (item && item.type === "tv" && !item.isAnime) {
    const title = String(item.title || "").trim();
    if (title) {
      const params = new URLSearchParams({
        title,
        language: "vf",
      });
      try {
        const animePayload = await fetchJson(`${API_BASE}/zenix-anime-seasons?${params.toString()}`, {
          timeoutMs: ANIME_SIBNET_TIMEOUT_MS,
          retryDelays: [350, 900],
        });
        const animeRows = Array.isArray(animePayload?.data?.items) ? animePayload.data.items : [];
        if (animeRows.length > 0) {
          item.isAnime = true;
          state.seasonsCache.set(item.id, animeRows);
        }
      } catch {
        // keep default classification
      }
    }
  }

  let resolved = await resolveEpisodePayloadWithStrategy(item, safeSeason, safeEpisode);
  if (token !== state.playToken) {
    return;
  }
  let selectedItem = resolved.selectedItem || item;

  const applyEpisodeSourcePayload = async (
    nextPayload,
    preferredLanguageInput = "",
    preloadedNakiosSources = null,
    nakiosWarmPromise = null
  ) => {
    clearManualSourceLock();
    const baseSources = extractSources(nextPayload);
    const autoMergedSources = appendAutoZenixRelaySources(baseSources);
    const ownedMergedSources = await appendZenixOwnedSources(selectedItem, safeSeason, safeEpisode, autoMergedSources);

    let nakiosMergedSources = ownedMergedSources;
    let warmNakiosSources = Array.isArray(preloadedNakiosSources) ? preloadedNakiosSources : [];
    if (!selectedItem?.isAnime) {
      if (warmNakiosSources.length === 0 && nakiosWarmPromise && typeof nakiosWarmPromise.then === "function") {
        const warmNakiosWaitMs = isLikelyMobileDevice() ? 5200 : 2200;
        warmNakiosSources = await Promise.race([
          nakiosWarmPromise.then((sources) => (Array.isArray(sources) ? sources : [])).catch(() => []),
          wait(warmNakiosWaitMs).then(() => []),
        ]);
      }
      if (
        warmNakiosSources.length === 0 &&
        ownedMergedSources.length === 0 &&
        nakiosWarmPromise &&
        typeof nakiosWarmPromise.then === "function"
      ) {
        warmNakiosSources = await nakiosWarmPromise
          .then((sources) => (Array.isArray(sources) ? sources : []))
          .catch(() => []);
      }
      if (warmNakiosSources.length > 0) {
        nakiosMergedSources = mergeSourceLists(ownedMergedSources, warmNakiosSources);
      }
    }

    const filmer2MergedSources = await appendFilmer2Sources(
      selectedItem,
      safeSeason,
      safeEpisode,
      nakiosMergedSources
    );
    state.allEpisodeSources = await appendAnimeSibnetSource(
      selectedItem,
      safeSeason,
      safeEpisode,
      filmer2MergedSources,
      preferredLanguageInput
    );
    state.allEpisodeSources = preferAnimeSamaSources(selectedItem, state.allEpisodeSources);
    state.allEpisodeSources = await appendRepairSources(selectedItem, safeSeason, safeEpisode, state.allEpisodeSources);
    if (selectedItem?.isAnime) {
      state.allEpisodeSources = preferAnimeSamaSources(selectedItem, state.allEpisodeSources);
    }
    state.availableLanguages = getAvailableLanguages(state.allEpisodeSources);
    let nextLanguage = resolvePreferredLanguage(selectedItem.id, preferredLanguageInput, state.availableLanguages);
    state.sourcePool = filterSourcesByLanguage(state.allEpisodeSources, nextLanguage);
    if (state.sourcePool.length === 0 && state.allEpisodeSources.length > 0) {
      nextLanguage = "";
      state.sourcePool = state.allEpisodeSources.slice();
    }
    state.sourceRetryAttempts.clear();
    if (nextLanguage) {
      state.selectedLanguageByMedia.set(selectedItem.id, nextLanguage);
    } else {
      state.selectedLanguageByMedia.delete(selectedItem.id);
    }
    saveLanguagePrefsMap(state.selectedLanguageByMedia);

    populateLanguageSelect(refs.playerLanguageSelect, state.availableLanguages, nextLanguage);
    refs.playerLanguageSelect.disabled = state.availableLanguages.length <= 1;
    setPlayerPill(refs.playerLanguagePill, nextLanguage || "Auto");
    if (state.sourcePool.length === 0) {
      throw new Error("No episode source");
    }
    state.sourceIndex = -1;
    renderPlayerSourceOptions();
    scheduleHlsLanguageProbe(state.allEpisodeSources);
    return nextLanguage;
  };

  const playEpisodeSources = async () => {
    try {
      await playFromSourcePoolWithRescue(resumeTime, token, {
        startIndex: 0,
        skipPremiumFallback: true,
        allowPremiumRescue: true,
      });
    } catch (error) {
      if (state.allEpisodeSources.length <= state.sourcePool.length) {
        throw error;
      }
      state.sourcePool = state.allEpisodeSources.slice();
      state.sourceRetryAttempts.clear();
      state.sourceIndex = -1;
      renderPlayerSourceOptions();
      setPlayerPill(refs.playerLanguagePill, "Auto");
      await playFromSourcePoolWithRescue(resumeTime, token, {
        startIndex: 0,
        skipPremiumFallback: true,
        allowPremiumRescue: true,
      });
      showToast("Bascule auto vers une source plus compatible.");
    }
  };

  let language = "";
  try {
    language = await applyEpisodeSourcePayload(
      resolved.payload,
      preferredLanguage,
      resolved.preloadedNakios,
      resolved.nakiosPromise
    );
  } catch (error) {
    if (token !== state.playToken) {
      throw error;
    }
    const rescue = await attemptExternalRescue(selectedItem, safeSeason, safeEpisode);
    if (token !== state.playToken) {
      return;
    }
    if (rescue && rescue.item && rescue.item.id && rescue.item.id !== selectedItem.id) {
      notifyActionMessage("Source alternative trouvee, bascule en cours...");
      return loadEpisodeStream(rescue.item, safeSeason, safeEpisode, resumeTime, token, preferredLanguage, syncRoute);
    }
    if (rescue && Array.isArray(rescue.sources) && rescue.sources.length > 0) {
      if (rescue.detailUrl) {
        selectedItem.externalDetailUrl = rescue.detailUrl;
        selectedItem.external_detail_url = rescue.detailUrl;
      }
      language = await applyEpisodeSourcePayload(buildSourcePayloadFromList(rescue.sources), preferredLanguage);
      notifyActionMessage("Sources externes injectees automatiquement.");
    } else {
      throw error;
    }
  }
  try {
    await playEpisodeSources();
  } catch (firstError) {
    if (token !== state.playToken) {
      throw firstError;
    }
    setPlayerStatus(`Actualisation des sources S${safeSeason}E${safeEpisode}...`);
    resolved = await resolveEpisodePayloadWithStrategy(selectedItem, safeSeason, safeEpisode);
    if (token !== state.playToken) {
      return;
    }
    selectedItem = resolved.selectedItem || selectedItem;
    language = await applyEpisodeSourcePayload(
      resolved.payload,
      preferredLanguage || language,
      resolved.preloadedNakios,
      resolved.nakiosPromise
    );
    try {
      await playEpisodeSources();
      showToast("Sources episode actualisees automatiquement.");
    } catch (secondError) {
      if (token !== state.playToken) {
        throw secondError;
      }
      const rescue = await attemptExternalRescue(selectedItem, safeSeason, safeEpisode, { forceExternal: true });
      if (token !== state.playToken) {
        return;
      }
      if (rescue && rescue.item && rescue.item.id && rescue.item.id !== selectedItem.id) {
        notifyActionMessage("Source alternative trouvee, bascule en cours...");
        return loadEpisodeStream(rescue.item, safeSeason, safeEpisode, resumeTime, token, preferredLanguage, syncRoute);
      }
      if (rescue && Array.isArray(rescue.sources) && rescue.sources.length > 0) {
        if (rescue.detailUrl) {
          selectedItem.externalDetailUrl = rescue.detailUrl;
          selectedItem.external_detail_url = rescue.detailUrl;
        }
        language = await applyEpisodeSourcePayload(buildSourcePayloadFromList(rescue.sources), preferredLanguage);
        await playEpisodeSources();
        showToast("Sources externes injectees automatiquement.");
        return;
      }
      throw secondError;
    }
  }

  state.nowPlaying = {
    id: selectedItem.id,
    type: "tv",
    title: selectedItem.title,
    poster: selectedItem.poster,
    isAnime: Boolean(selectedItem.isAnime),
    language,
    season: safeSeason,
    episode: safeEpisode,
  };
  setPlayerSubTitle(`S${safeSeason}E${safeEpisode}${language ? ` - ${language}` : ""}`);
  if (syncRoute) {
    setAppRoute({ watch: selectedItem.id, season: safeSeason, episode: safeEpisode }, { replace: true });
  }
  setPlayerStatus(`Lecture S${safeSeason}E${safeEpisode}${language ? ` (${language})` : ""}`);
  updatePlayerNextEpisodeButton();
}


async function collectRepairSourcesForItem(item, season = 1, episode = 1) {
  if (!item) {
    return [];
  }
  const safeSeason = Math.max(1, Number(season || 1));
  const safeEpisode = Math.max(1, Number(episode || 1));

  if (item.type !== "tv") {
    if (item.isExternal) {
      const resolved = await resolveExternalItemSources(item);
      return Array.isArray(resolved?.sources) ? resolved.sources : [];
    }
    let payload = null;
    try {
      payload = await fetchStreamJson(`/stream/${item.id}`, { force: true });
    } catch {
      payload = null;
    }
    const baseSources = extractSources(payload);
    const autoMergedSources = appendAutoZenixRelaySources(baseSources);
    const ownedMergedSources = await appendZenixOwnedSources(item, 1, 1, autoMergedSources);
    const nakiosMerged = await appendNakiosSources(item, 1, 1, ownedMergedSources);
    const filmer2Merged = await appendFilmer2Sources(item, 1, 1, nakiosMerged);
    return filterMovieSourcesForFrench(filmer2Merged);
  }

  let resolved = null;
  try {
    resolved = await resolveEpisodePayloadWithStrategy(item, safeSeason, safeEpisode);
  } catch {
    resolved = null;
  }
  const selectedItem = resolved?.selectedItem || item;
  const baseSources = extractSources(resolved?.payload || null);
  const autoMerged = appendAutoZenixRelaySources(baseSources);
  const ownedMerged = await appendZenixOwnedSources(selectedItem, safeSeason, safeEpisode, autoMerged);

  let nakiosMergedSources = ownedMerged;
  let warmNakiosSources = Array.isArray(resolved?.preloadedNakios) ? resolved.preloadedNakios : [];
  if (!selectedItem?.isAnime) {
    if (warmNakiosSources.length === 0 && resolved?.nakiosPromise) {
      const warmNakiosWaitMs = isLikelyMobileDevice() ? 5200 : 2200;
      warmNakiosSources = await Promise.race([
        resolved.nakiosPromise.then((sources) => (Array.isArray(sources) ? sources : [])).catch(() => []),
        wait(warmNakiosWaitMs).then(() => []),
      ]);
    }
    if (warmNakiosSources.length === 0 && ownedMerged.length === 0 && resolved?.nakiosPromise) {
      warmNakiosSources = await resolved.nakiosPromise.then((sources) => (Array.isArray(sources) ? sources : [])).catch(() => []);
    }
    if (warmNakiosSources.length > 0) {
      nakiosMergedSources = mergeSourceLists(ownedMerged, warmNakiosSources);
    }
  }

  const filmer2Merged = await appendFilmer2Sources(selectedItem, safeSeason, safeEpisode, nakiosMergedSources);
  let allSources = await appendAnimeSibnetSource(selectedItem, safeSeason, safeEpisode, filmer2Merged, "");
  allSources = preferAnimeSamaSources(selectedItem, allSources);
  return allSources;
}

async function runPlayerRepair() {
  if (!refs.playerRepairBtn) {
    return;
  }
  const activeId = Number(state.nowPlaying?.id || state.selectedDetailId || 0);
  if (!activeId) {
    showToast("Aucun contenu actif.", true);
    return;
  }
  const item = findItemById(activeId) || (await buildItemFromDetails(activeId));
  if (!item) {
    showToast("Impossible de reparer ce titre.", true);
    return;
  }
  const season = Number(refs.playerSeasonSelect?.value || state.nowPlaying?.season || 1);
  const episode = Number(refs.playerEpisodeSelect?.value || state.nowPlaying?.episode || 1);
  const key = buildRepairKey(item, season, episode);
  if (!key) {
    return;
  }
  refs.playerRepairBtn.disabled = true;
  refs.playerRepairBtn.classList.add("is-loading");
  if (refs.playerRepairStatus) {
    refs.playerRepairStatus.textContent = "Reparation en cours... ajout de lecteurs";
  }
  const sources = await collectRepairSourcesForItem(item, season, episode);
  if (!Array.isArray(sources) || sources.length === 0) {
    const pending = isLikelyRecentPendingUpload(item);
    const message = pending
      ? "Film trop recent, pas encore disponible."
      : "Aucune source exploitable pour le moment.";
    if (refs.playerRepairStatus) {
      refs.playerRepairStatus.textContent = message;
    }
    refs.playerRepairBtn.disabled = false;
    refs.playerRepairBtn.classList.remove("is-loading");
    return;
  }
  const normalizedSources = normalizeRepairSourceList(sources);
  const existingSources = Array.isArray(state.allEpisodeSources) ? state.allEpisodeSources : [];
  const existingKeys = new Set(existingSources.map((entry) => getSourceDedupKey(entry)).filter(Boolean));
  const addedSources = normalizedSources.filter((entry) => {
    const key = getSourceDedupKey(entry);
    if (!key) {
      return true;
    }
    if (existingKeys.has(key)) {
      return false;
    }
    existingKeys.add(key);
    return true;
  });

  await storeRepairSources(key, normalizedSources);
  const merged = mergeSourceLists(normalizedSources, existingSources);
  state.allEpisodeSources = merged;
  if (item.type === "tv") {
    const currentLang = String(refs.playerLanguageSelect?.value || state.nowPlaying?.language || "");
    const nextLang = resolvePreferredLanguage(item.id, currentLang, getAvailableLanguages(merged));
    state.sourcePool = filterSourcesByLanguage(merged, nextLang);
    if (state.sourcePool.length === 0) {
      state.sourcePool = merged.slice();
    }
  } else {
    state.sourcePool = filterMovieSourcesForFrench(merged);
  }
  state.sourceRetryAttempts.clear();
  state.sourceIndex = -1;
  renderPlayerSourceOptions();
  scheduleHlsLanguageProbe(state.allEpisodeSources);
  if (refs.playerRepairStatus) {
    refs.playerRepairStatus.textContent = addedSources.length > 0
      ? `Reparation terminee: ${addedSources.length} source(s) ajoutee(s).`
      : "Aucune nouvelle source. Lecteurs existants conserves.";
  }
  refs.playerRepairBtn.disabled = false;
  refs.playerRepairBtn.classList.remove("is-loading");
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
  const explicitResumeTime = getExplicitResumeTime(options);
  const progress = state.progress[item.id] || null;
  const resumeTime = resolveEpisodeResumeTime(progress, season, episode, explicitResumeTime);
  await loadEpisodeStream(
    item,
    season,
    episode,
    resumeTime,
    token,
    String(options.language || state.nowPlaying.language || "")
  );
}

function toAnimeSibnetLanguageToken(language) {
  const raw = String(language || "").trim().toUpperCase();
  return raw === "VF" ? "vf" : "vostfr";
}

function toZenixRelayUrl(source) {
  const rawUrl = String(source?.url || "").trim();
  if (!rawUrl) {
    return "";
  }

  let absolute = rawUrl;
  try {
    absolute = new URL(rawUrl, window.location.href).href;
  } catch {
    absolute = rawUrl;
  }

  if (!/^https?:\/\//i.test(absolute)) {
    return "";
  }
  if (/\/api\/hls-proxy\?url=/i.test(absolute)) {
    return absolute;
  }
  if (isEmbedSource(source, absolute)) {
    return "";
  }
  const isHls = String(source?.format || "").toLowerCase() === "hls" || /m3u8(?:$|\?)/i.test(absolute);
  if (isHls) {
    return `${API_BASE}/hls-proxy?url=${encodeURIComponent(absolute)}`;
  }
  return absolute;
}

function appendAutoZenixRelaySources(sources) {
  const base = Array.isArray(sources) ? sources.slice() : [];
  if (base.length === 0) {
    return base;
  }

  const alreadyZenix = base.some((entry) => entry && entry.isZenix);
  if (alreadyZenix) {
    return base;
  }

  const pickCandidate = () => {
    const direct = base.filter((entry) => entry && !entry.premiumHint && !isEmbedSource(entry));
    if (direct.length > 0) {
      return direct[0];
    }
    const nonEmbed = base.filter((entry) => entry && !isEmbedSource(entry));
    if (nonEmbed.length > 0) {
      return nonEmbed[0];
    }
    return base.find((entry) => entry) || null;
  };

  const candidate = pickCandidate();
  if (!candidate) {
    return base;
  }

  const isEmbedCandidate = isEmbedSource(candidate);
  const relayUrl = isEmbedCandidate
    ? String(candidate?.url || "").trim()
    : toZenixRelayUrl(candidate);
  const relayKey = canonicalizeSourceUrl(relayUrl);
  if (!relayUrl || !relayKey) {
    return base;
  }

  const relayEntry = normalizeSourceEntry(
    {
      stream_url: relayUrl,
      format: candidate.format || "",
      quality: candidate.quality || "HD",
      language: candidate.language || "",
      source_name: "Zenix",
      isZenix: true,
    },
    0
  );

  if (!relayEntry) {
    return base;
  }
  relayEntry.isZenix = true;
  relayEntry.zenixMode = isEmbedCandidate ? "embed" : "direct";

  return [relayEntry, ...base];
}

function getOwnedSourceMediaType(item) {
  return String(item?.type || "").toLowerCase() === "tv" ? "tv" : "movie";
}

function getItemReleaseYear(item) {
  const candidates = [
    item?.releaseDate,
    item?.release_date,
    item?.firstAirDate,
    item?.first_air_date,
    item?.airDate,
    item?.date,
    item?.year,
  ];
  for (const candidate of candidates) {
    const raw = String(candidate || "").trim();
    if (!raw) {
      continue;
    }
    const match = raw.match(/\b(19|20)\d{2}\b/);
    if (!match) {
      continue;
    }
    const year = Number(match[0]);
    if (Number.isInteger(year) && year >= 1900 && year <= 2099) {
      return year;
    }
  }
  return 0;
}


function buildRepairKey(item, season = 1, episode = 1) {
  const id = Number(item?.id || 0);
  if (!Number.isFinite(id) || id <= 0) {
    return "";
  }
  const mediaType = String(item?.type || "").toLowerCase() === "tv" ? "tv" : "movie";
  if (mediaType === "tv") {
    const safeSeason = Math.max(1, Number(season || 1));
    const safeEpisode = Math.max(1, Number(episode || 1));
    return `tv:${id}:s${safeSeason}e${safeEpisode}`;
  }
  return `movie:${id}`;
}

function normalizeRepairSourceList(list) {
  const rows = Array.isArray(list) ? list : [];
  const out = [];
  const seen = new Set();
  rows.forEach((entry, index) => {
    const normalized = normalizeSourceEntry(entry, index);
    if (!normalized) {
      return;
    }
    const key = getSourceDedupKey(normalized);
    if (key && seen.has(key)) {
      return;
    }
    if (key) {
      seen.add(key);
    }
    out.push(normalized);
  });
  return out;
}

async function fetchRepairSources(key, options = {}) {
  if (!key) {
    return [];
  }
  const force = options.force === true;
  const now = Date.now();
  const cached = state.repairCache.get(key);
  if (!force && cached && now - Number(cached.updatedAt || 0) < REPAIR_SOURCE_CACHE_MS) {
    return Array.isArray(cached.sources) ? cached.sources : [];
  }
  if (state.repairInFlight.has(key)) {
    try {
      const inflight = await state.repairInFlight.get(key);
      return Array.isArray(inflight) ? inflight : [];
    } catch {
      return [];
    }
  }
  const task = fetchJson(`${API_BASE}/repair-sources?key=${encodeURIComponent(key)}`, {
    timeoutMs: REPAIR_SOURCE_TIMEOUT_MS,
    retryDelays: [350, 800],
  })
    .then((payload) => normalizeRepairSourceList(payload?.data?.sources || []))
    .catch(() => []);
  state.repairInFlight.set(key, task);
  const sources = await task;
  state.repairInFlight.delete(key);
  state.repairCache.set(key, { sources, updatedAt: Date.now() });
  return sources;
}

async function storeRepairSources(key, sources) {
  const normalized = normalizeRepairSourceList(sources);
  if (!key || normalized.length === 0) {
    return { ok: false, sources: normalized };
  }
  try {
    await fetchJson(`${API_BASE}/repair-store`, {
      method: "POST",
      timeoutMs: REPAIR_SOURCE_TIMEOUT_MS,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, sources: normalized }),
      noCache: true,
    });
  } catch {
    // best effort only
  }
  state.repairCache.set(key, { sources: normalized, updatedAt: Date.now() });
  return { ok: true, sources: normalized };
}

async function appendRepairSources(item, season, episode, sources) {
  const base = Array.isArray(sources) ? sources.slice() : [];
  const key = buildRepairKey(item, season, episode);
  if (!key) {
    return base;
  }
  const repaired = await fetchRepairSources(key);
  if (!Array.isArray(repaired) || repaired.length === 0) {
    return base;
  }
  return mergeSourceLists(repaired, base);
}

async function appendZenixOwnedSources(item, season, episode, sources) {
  const base = Array.isArray(sources) ? sources.slice() : [];
  const mediaId = Number(item?.id || 0);
  if (!item || mediaId <= 0) {
    return base;
  }

  const mediaType = getOwnedSourceMediaType(item);
  const safeSeason = Math.max(1, Number(season || 1));
  const safeEpisode = Math.max(1, Number(episode || 1));
  const params = new URLSearchParams({
    mediaId: String(mediaId),
    type: mediaType,
    season: String(safeSeason),
    episode: String(safeEpisode),
  });

  try {
    const payload = await fetchJson(`${API_BASE}/zenix-source?${params.toString()}`, {
      timeoutMs: ZENIX_OWNED_SOURCE_TIMEOUT_MS,
      retryDelays: [260],
    });
    const raw = Array.isArray(payload?.data?.sources) ? payload.data.sources : [];
    if (raw.length === 0) {
      return base;
    }

    const existing = new Set(base.map((entry) => getSourceDedupKey(entry)).filter(Boolean));
    const owned = raw
      .map((entry, index) =>
        normalizeSourceEntry(
          {
            ...entry,
            source_name: String(entry?.source_name || entry?.name || "Zenix Source").trim() || "Zenix Source",
          },
          index
        )
      )
      .filter((entry) => {
        if (!entry) {
          return false;
        }
        const key = getSourceDedupKey(entry);
        if (!key || existing.has(key)) {
          return false;
        }
        existing.add(key);
        return true;
      });

    if (owned.length === 0) {
      return base;
    }

    return owned.concat(base);
  } catch {
    return base;
  }
}

async function resolveNakiosTmdbId(item) {
  const directTmdb = Number(
    item?.tmdbId ||
      item?.tmdb_id ||
      item?.externalTmdbId ||
      item?.external_tmdb_id ||
      0
  );
  if (Number.isFinite(directTmdb) && directTmdb > 0) {
    return directTmdb;
  }

  const mediaId = Number(item?.id || 0);
  if (mediaId <= 0 || mediaId >= SUPPLEMENTAL_MEDIA_ID_MIN) {
    return 0;
  }

  const cachedDetails = state.detailsCache.get(mediaId);
  const cachedTmdbId = Number(cachedDetails?.tmdbId || cachedDetails?.tmdb_id || 0);
  if (Number.isFinite(cachedTmdbId) && cachedTmdbId > 0) {
    return cachedTmdbId;
  }

  try {
    const details = await ensureDetails(mediaId);
    const tmdbId = Number(details?.tmdbId || details?.tmdb_id || 0);
    return Number.isFinite(tmdbId) && tmdbId > 0 ? tmdbId : 0;
  } catch {
    return 0;
  }
}

async function appendNakiosSources(item, season, episode, sources) {
  const base = Array.isArray(sources) ? sources.slice() : [];
  if (!item) {
    return base;
  }

  const title = String(item?.title || "").trim();
  const externalKey = String(item?.externalKey || item?.external_key || "").trim();
  if (title.length < 2) {
    return base;
  }

  const mediaType = getOwnedSourceMediaType(item);
  const safeSeason = Math.max(1, Number(season || 1));
  const safeEpisode = Math.max(1, Number(episode || 1));
  const year = getItemReleaseYear(item);
  const params = new URLSearchParams({
    title,
    type: mediaType,
    season: String(safeSeason),
    episode: String(safeEpisode),
  });
  if (externalKey) {
    params.set("externalKey", externalKey);
  }
  const tmdbId = await resolveNakiosTmdbId(item);
  if (tmdbId > 0) {
    params.set("tmdbId", String(tmdbId));
  }
  if (year > 0) {
    params.set("year", String(year));
  }

  const runFetch = async () =>
    fetchJson(`${API_BASE}/zenix-source?${params.toString()}`, {
      timeoutMs: NAKIOS_SOURCE_TIMEOUT_MS,
      retryDelays: [400, 1000],
    });

  try {
    let payload = await runFetch();
    let raw = Array.isArray(payload?.data?.sources) ? payload.data.sources : [];
    if (raw.length === 0 && !state.adblockDetected) {
      const gateOk = await refreshGateToken({ force: true }).catch(() => false);
      if (gateOk) {
        payload = await runFetch();
        raw = Array.isArray(payload?.data?.sources) ? payload.data.sources : [];
      }
    }
    if (raw.length === 0) {
      return base;
    }

    const existing = new Set(base.map((entry) => getSourceDedupKey(entry)).filter(Boolean));
    const nakiosSources = raw
      .map((entry, index) =>
        normalizeSourceEntry(
          {
            ...entry,
            source_name: String(entry?.source_name || entry?.name || "Zenix").trim() || "Zenix",
          },
          index
        )
      )
      .filter((entry) => {
        if (!entry) {
          return false;
        }
        const key = getSourceDedupKey(entry);
        if (!key || existing.has(key)) {
          return false;
        }
        existing.add(key);
        return true;
      });

    if (nakiosSources.length === 0) {
      return base;
    }
    return base.concat(nakiosSources);
  } catch {
    return base;
  }
}

// Legacy provider hooks intentionally disabled.
async function appendPidoovSources(item, season, episode, sources) {
  const base = Array.isArray(sources) ? sources.slice() : [];
  return base;
}

async function appendNotariellesSources(item, season, episode, sources) {
  const base = Array.isArray(sources) ? sources.slice() : [];
  return base;
}

async function appendRendezvousSources(item, season, episode, sources) {
  const base = Array.isArray(sources) ? sources.slice() : [];
  return base;
}

function isAnimeSamaSourceEntry(entry) {
  if (!entry) {
    return false;
  }
  const origin = String(entry?.origin || entry?.provider || entry?.source || "")
    .trim()
    .toLowerCase();
  if (origin.includes("anime-sama") || origin.includes("animesama")) {
    return true;
  }
  const raw = String(entry?.url || "").trim().toLowerCase();
  if (!raw) {
    return false;
  }
  return raw.includes("sibnet.ru") || /anime-sama\.(tv|to)/i.test(raw);
}

function isFilmer2DetailUrl(url) {
  return /filmer2\.com/i.test(String(url || ""));
}

async function appendFilmer2Sources(item, season, episode, sources) {
  const base = Array.isArray(sources) ? sources.slice() : [];
  if (!item) {
    return base;
  }
  const title = String(item?.title || "").trim();
  const externalKey = String(item?.externalKey || item?.external_key || "").trim();
  if (!title) {
    return base;
  }
  const mediaType = item?.type === "tv" ? "tv" : "movie";
  const year = getItemReleaseYear(item) || getCatalogReleaseYear(item);
  const params = new URLSearchParams({
    title,
    type: mediaType,
    season: String(Math.max(1, Number(season || 1))),
    episode: String(Math.max(1, Number(episode || 1))),
  });
  if (externalKey) {
    params.set("externalKey", externalKey);
  }
  const tmdbId = await resolveNakiosTmdbId(item);
  if (tmdbId > 0) {
    params.set("tmdbId", String(tmdbId));
  }
  if (year > 0) {
    params.set("year", String(year));
  }
  try {
    const payload = await fetchJson(`${API_BASE}/zenix-source?${params.toString()}`, {
      timeoutMs: NAKIOS_SOURCE_TIMEOUT_MS,
      retryDelays: [400, 900],
    });
    const raw = Array.isArray(payload?.data?.sources) ? payload.data.sources : [];
    if (raw.length === 0) {
      return base;
    }
    const existing = new Set(base.map((entry) => getSourceDedupKey(entry)).filter(Boolean));
    const filmer2Sources = raw
      .map((entry, index) =>
        normalizeSourceEntry(
          {
            ...entry,
            source_name: String(entry?.source_name || entry?.name || "Zenix").trim() || "Zenix",
          },
          index
        )
      )
      .filter(Boolean)
      .filter((entry) => {
        const key = getSourceDedupKey(entry);
        if (!key || existing.has(key)) {
          return false;
        }
        existing.add(key);
        return true;
      });
    if (filmer2Sources.length === 0) {
      return base;
    }
    return base.concat(filmer2Sources);
  } catch {
    return base;
  }
}


async function findFilmer2MatchByTitle(item) {
  if (!item) {
    return null;
  }
  const title = String(item?.title || "").trim();
  if (title.length < 2) {
    return null;
  }
  const type = item?.type === "tv" ? "tv" : "movie";
  const year = getItemReleaseYear(item) || getCatalogReleaseYear(item);

  const pickResult = (payload) => {
    if (!payload) {
      return null;
    }
    const best = payload?.data?.best || null;
    if (best && best.url) {
      return best;
    }
    const matches = Array.isArray(payload?.data?.matches) ? payload.data.matches : [];
    return matches[0] || null;
  };

  const runSearch = async (withYear) => {
    const params = new URLSearchParams({
      q: title,
      type,
    });
    if (withYear && year > 0) {
      params.set("year", String(year));
    }
    try {
      return await fetchJson(`${API_BASE}/zenix-search?${params.toString()}`, {
        timeoutMs: 6000,
        retryDelays: [320, 800],
      });
    } catch {
      return null;
    }
  };

  let payload = await runSearch(true);
  let result = pickResult(payload);
  if (result) {
    return result;
  }
  if (year > 0) {
    payload = await runSearch(false);
    result = pickResult(payload);
    if (result) {
      return result;
    }
  }
  return null;
}

async function fetchFilmer2SourcesForItem(item, season = 1, episode = 1) {
  const baseItem = item || {};
  const title = String(baseItem?.title || "").trim();
  if (!title) {
    return { sources: [], detailUrl: "" };
  }
  const mediaType = baseItem?.type === "tv" ? "tv" : "movie";
  const year = getItemReleaseYear(baseItem) || getCatalogReleaseYear(baseItem);
  const externalKey = String(baseItem?.externalKey || baseItem?.external_key || "").trim();
  const params = new URLSearchParams({
    title,
    type: mediaType,
    season: String(Math.max(1, Number(season || 1))),
    episode: String(Math.max(1, Number(episode || 1))),
  });
  if (externalKey) {
    params.set("externalKey", externalKey);
  }
  const tmdbId = await resolveNakiosTmdbId(baseItem);
  if (tmdbId > 0) {
    params.set("tmdbId", String(tmdbId));
  }
  if (year > 0) {
    params.set("year", String(year));
  }
  try {
    const payload = await fetchJson(`${API_BASE}/zenix-source?${params.toString()}`, {
      timeoutMs: NAKIOS_SOURCE_TIMEOUT_MS,
      retryDelays: [400, 900],
    });
    const raw = Array.isArray(payload?.data?.sources) ? payload.data.sources : [];
    const normalized = raw
      .map((entry, index) =>
        normalizeSourceEntry(
          {
            ...entry,
            source_name: String(entry?.source_name || entry?.name || "Zenix").trim() || "Zenix",
          },
          index
        )
      )
      .filter(Boolean);
    return { sources: normalized, detailUrl: "" };
  } catch {
    return { sources: [], detailUrl: "" };
  }
}


async function attemptExternalRescue(item, season = 1, episode = 1, options = {}) {
  if (!item || item.isAnime) {
    return null;
  }
  const safeSeason = Math.max(1, Number(season || 1));
  const safeEpisode = Math.max(1, Number(episode || 1));
  const forceExternal = options && options.forceExternal === true;
  let internalCandidate = null;
  if (!forceExternal || item?.isExternal) {
    internalCandidate = findInternalProviderCandidate(item);
    if (!internalCandidate) {
      internalCandidate = await findInternalProviderCandidateFromSearch(item);
    }
  }
  if (internalCandidate && internalCandidate.id !== item.id) {
    const playable = await hasPlayablePurstreamSources(internalCandidate, safeSeason, safeEpisode);
    if (playable) {
      return { item: internalCandidate, sources: [], detailUrl: "", mode: "purstream" };
    }
  }
  const filmer2Result = await fetchFilmer2SourcesForItem(item, safeSeason, safeEpisode);
  if (Array.isArray(filmer2Result.sources) && filmer2Result.sources.length > 0) {
    return {
      item,
      sources: filmer2Result.sources,
      detailUrl: filmer2Result.detailUrl,
      mode: "filmer2",
    };
  }
  return null;
}

function getAnimeSamaCatalogUrl(item) {
  if (!item) {
    return "";
  }
  const candidate = String(
    item?.externalDetailUrl || item?.external_detail_url || item?.url || ""
  ).trim();
  if (!candidate) {
    return "";
  }
  try {
    const absolute = new URL(candidate, "https://anime-sama.to").href;
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

function preferAnimeSamaSources(item, sources) {
  const base = Array.isArray(sources) ? sources.slice() : [];
  if (!item?.isAnime) {
    return base;
  }
  const animeOnly = base.filter((entry) => isAnimeSamaSourceEntry(entry));
  if (animeOnly.length === 0) {
    return base;
  }
  const frenchOnly = animeOnly.filter((entry) => {
    const lang = String(entry?.language || "").trim().toUpperCase();
    return lang === "VF" || lang === "MULTI";
  });
  if (frenchOnly.length > 0) {
    return sortSourcesByScore(frenchOnly);
  }
  const unknownLang = animeOnly.filter((entry) => !String(entry?.language || "").trim());
  if (unknownLang.length > 0) {
    return sortSourcesByScore(unknownLang);
  }
  return sortSourcesByScore(animeOnly);
}

function sortSourcesByScore(sources) {
  const rows = Array.isArray(sources) ? sources.slice() : [];
  rows.sort((left, right) => {
    if (isLikelyMobileDevice()) {
      const zenixDelta = Number(Boolean(right?.isZenix)) - Number(Boolean(left?.isZenix));
      if (zenixDelta !== 0) {
        return zenixDelta;
      }
    }
    const premiumDelta = Number(Boolean(left?.premiumHint)) - Number(Boolean(right?.premiumHint));
    if (premiumDelta !== 0) {
      return premiumDelta;
    }
    return Number(right?.score || 0) - Number(left?.score || 0);
  });
  return rows;
}
async function appendAnimeSibnetSource(item, season, episode, sources, language = "") {
  const base = Array.isArray(sources) ? sources.slice() : [];
  if (!item || !item.isAnime) {
    return base;
  }

  const safeTitle = String(item.title || "").trim();
  if (!safeTitle) {
    return base;
  }

  const safeSeason = Math.max(1, Number(season || 1));
  const safeEpisode = Math.max(1, Number(episode || 1));
  const languageTokens = ["vf"];

  try {
    const payloads = [];
    for (const token of languageTokens) {
      const params = new URLSearchParams({
        title: safeTitle,
        season: String(safeSeason),
        episode: String(safeEpisode),
        language: token,
      });
      let response = null;
      try {
        response = await fetchJson(`${API_BASE}/zenix-anime-source?${params.toString()}`, {
          timeoutMs: ANIME_SIBNET_TIMEOUT_MS,
          retryDelays: [350, 900],
        });
      } catch {
        continue;
      }
      const hasSources = Array.isArray(response?.data?.sources) && response.data.sources.length > 0;
      const hasUrl = Boolean(String(response?.data?.sourceUrl || "").trim());
      if (hasSources || hasUrl) {
        payloads.push({ token, response });
      }
    }
    if (payloads.length === 0) {
      return base;
    }

    const existing = new Set(base.map((entry) => getSourceDedupKey(entry)).filter(Boolean));
    const added = [];
    payloads.forEach(({ token, response }) => {
      const resolvedLanguage = normalizeLanguageLabel(response?.data?.language || "");
      const sourceLanguage =
        resolvedLanguage || (token === "vf" ? "VF" : token === "vostfr" ? "VOSTFR" : "");
      const rawSources = Array.isArray(response?.data?.sources) ? response.data.sources : [];
      const candidateSources =
        rawSources.length > 0
          ? rawSources
          : (() => {
              const sourceUrl = String(response?.data?.sourceUrl || "").trim();
              if (!sourceUrl) {
                return [];
              }
              return [
                {
                  stream_url: sourceUrl,
                  format: "embed",
                  quality: "Sibnet",
                  source_name: "Sibnet",
                },
              ];
            })();

      candidateSources.forEach((entry) => {
        const sourceEntry = normalizeSourceEntry(
          {
            ...entry,
            language: normalizeLanguageLabel(entry?.language || "") || sourceLanguage,
            source_name: String(entry?.source_name || entry?.name || "Anime-Sama").trim() || "Anime-Sama",
            origin: "anime-sama",
          },
          base.length + added.length
        );
        if (!sourceEntry) {
          return;
        }
        const key = getSourceDedupKey(sourceEntry);
        if (!key || existing.has(key)) {
          return;
        }
        existing.add(key);
        added.push(sourceEntry);
      });
    });
    if (added.length === 0) {
      return base;
    }
    return added.concat(base);
  } catch {
    // optional fallback source only
  }

  return base;
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
    const key = getSourceDedupKey(entry) || String(entry.url || "").trim();
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  deduped.sort((left, right) => {
    const premiumDelta = Number(Boolean(left?.premiumHint)) - Number(Boolean(right?.premiumHint));
    if (premiumDelta !== 0) {
      return premiumDelta;
    }
    return Number(right?.score || 0) - Number(left?.score || 0);
  });
  if (!FILTER_PREMIUM_SOURCES) {
    return deduped;
  }
  const freeOnly = deduped.filter((entry) => !entry?.premiumHint);
  return freeOnly.length > 0 ? freeOnly : deduped;
}

function clearManualSourceLock() {
  state.manualSourceLock = false;
  state.manualSourceLockedIndex = -1;
  state.sourceRetryAttempts.clear();
}

function markAwaitingUserPlay(ms = 45000) {
  state.awaitingUserPlayUntil = Date.now() + Math.max(3000, Number(ms || 0));
}

function clearAwaitingUserPlay() {
  state.awaitingUserPlayUntil = 0;
}

function isAwaitingUserPlay() {
  return Date.now() < Number(state.awaitingUserPlayUntil || 0);
}

function shouldIgnoreVideoErrorFallback() {
  if (state.segmentFallback) {
    return true;
  }
  const currentSource = state.sourcePool[state.sourceIndex] || null;
  if (isEmbedSource(currentSource)) {
    return true;
  }
  if (state.sourceLoading) {
    return true;
  }
  if (Date.now() < Number(state.ignoreVideoErrorUntil || 0)) {
    return true;
  }
  const videoErrorCode = Number(refs.playerVideo?.error?.code || 0);
  const errorTime = Number(refs.playerVideo?.currentTime || 0);
  if (videoErrorCode === 0 && errorTime > 2.2) {
    return true;
  }
  if (videoErrorCode === 1) {
    return true;
  }
  if (videoErrorCode > 0) {
    return false;
  }
  if (Date.now() < Number(state.ignoreVideoErrorUntil || 0)) {
    return true;
  }
  return false;
}

function clearPlaybackHealthMonitor() {
  if (state.playbackHealthTimer) {
    clearTimeout(state.playbackHealthTimer);
    state.playbackHealthTimer = 0;
  }
}

function clearPlaybackGuard() {
  if (state.playbackGuardTimer) {
    clearInterval(state.playbackGuardTimer);
    state.playbackGuardTimer = 0;
  }
}

function isManualSourceLockActive() {
  if (!state.manualSourceLock) {
    return false;
  }
  const current = state.sourcePool[state.sourceIndex] || null;
  if (isZenixSource(current)) {
    return false;
  }
  return true;
}

function startPlaybackGuard() {
  clearPlaybackGuard();
  const mobileGuard = isLikelyMobileDevice();
  const guardIntervalMs = mobileGuard ? Math.max(700, PLAYBACK_GUARD_INTERVAL_MS - 500) : PLAYBACK_GUARD_INTERVAL_MS;
  const startupStallMs = mobileGuard ? Math.max(1300, PLAYBACK_STARTUP_STALL_MS - 1100) : PLAYBACK_STARTUP_STALL_MS;
  const statusRecoveryMs = mobileGuard
    ? Math.max(900, PLAYBACK_STATUS_RECOVERY_MS - 800)
    : PLAYBACK_STATUS_RECOVERY_MS;
  const hardStallMs = mobileGuard ? Math.max(3200, PLAYBACK_STALL_HARD_MS - 1600) : PLAYBACK_STALL_HARD_MS;
  const pausedStallMs = mobileGuard ? Math.max(3800, PLAYBACK_STALL_PAUSED_MS - 1800) : PLAYBACK_STALL_PAUSED_MS;
  const fallbackStallMs = mobileGuard
    ? Math.max(3000, startupStallMs + 700)
    : Math.max(4200, PLAYBACK_STARTUP_STALL_MS + 1800);
  const startupLoadingStatusPattern = /connexion source|chargement du flux|chargement de la source|fallback ios actif/;
  let trackedPlayToken = Number(state.playToken || 0);
  let lastObservedTime = 0;
  let lastAdvanceAt = Date.now();
  let trackedSourceIndex = Number(state.sourceIndex || -1);
  let fallbackStatusSince = 0;
  let switchingSource = false;
  state.playbackGuardTimer = window.setInterval(() => {
    if (refs.playerOverlay.hidden) {
      clearPlaybackGuard();
      return;
    }
    if (switchingSource) {
      return;
    }
    const hasNextCandidate = state.sourceIndex + 1 < state.sourcePool.length;
    const loadingTooLong =
      state.sourceLoading &&
      state.sourceLoadingSince &&
      Date.now() - state.sourceLoadingSince > fallbackStallMs &&
      hasNextCandidate;
    if (state.sourceLoading || state.sourceIndex < 0 || isManualSourceLockActive()) {
      if (loadingTooLong) {
        switchingSource = true;
        setPlayerStatus("Lecture bloquee, bascule automatique...", true);
        trySwitchToNextSource()
          .catch(() => {
            setPlayerStatus("Erreur video detectee. Choisis une autre source.", true);
          })
          .finally(() => {
            switchingSource = false;
          });
      }
      return;
    }
    const activePlayToken = Number(state.playToken || 0);
    if (activePlayToken !== trackedPlayToken) {
      trackedPlayToken = activePlayToken;
      lastObservedTime = Number(refs.playerVideo?.currentTime || 0);
      lastAdvanceAt = Date.now();
      return;
    }
    const currentSource = state.sourcePool[state.sourceIndex] || null;
    const statusText = String(refs.playerStatus?.textContent || "").toLowerCase();
    if (isEmbedSource(currentSource)) {
      const embedSince = Number(state.embedLoadFinishedAt || 0) || Number(state.embedLoadStartedAt || 0);
      const embedStallMs = mobileGuard ? MOBILE_EMBED_STALL_SWITCH_MS : EMBED_STALL_SWITCH_MS;
      const embedStall =
        hasNextCandidate &&
        embedSince > 0 &&
        Date.now() - embedSince > embedStallMs &&
        /chargement source integree|lecture en cours|lecture bloquee|source indisponible|lecture impossible/.test(
          statusText
        );
      if (!embedStall) {
        return;
      }
      switchingSource = true;
      setPlayerStatus("Lecture bloquee, bascule automatique...", true);
      trySwitchToNextSource()
        .catch(() => {
          setPlayerStatus("Erreur video detectee. Choisis une autre source.", true);
        })
        .finally(() => {
          switchingSource = false;
        });
      return;
    }
    const currentSourceIndex = Number(state.sourceIndex || -1);
    if (currentSourceIndex !== trackedSourceIndex) {
      trackedSourceIndex = currentSourceIndex;
      fallbackStatusSince = 0;
    }
    const video = refs.playerVideo;
    if (!video || video.ended || video.seeking) {
      return;
    }
    const errorCode = Number(video.error?.code || 0);
    const currentTime = Number(video.currentTime || 0);
    const readyState = Number(video.readyState || 0);
    const networkState = Number(video.networkState || 0);
    const awaitingUser = isAwaitingUserPlay();
    const fallbackStatusActive = /fallback ios actif/.test(statusText);
    if (fallbackStatusActive) {
      if (!fallbackStatusSince) {
        fallbackStatusSince = Date.now();
      }
    } else {
      fallbackStatusSince = 0;
    }
    if (currentTime > lastObservedTime + 0.08) {
      lastObservedTime = currentTime;
      lastAdvanceAt = Date.now();
    }
    const stalledForMs = Date.now() - lastAdvanceAt;
    const canAutoRecoverWhileAwaiting =
      awaitingUser &&
      stalledForMs > statusRecoveryMs + (mobileGuard ? 800 : 1200) &&
      /fallback ios actif|connexion source|lecture bloquee|source indisponible|chargement du flux|chargement de la source/.test(statusText);
    const allowAutoRecover = !awaitingUser || canAutoRecoverWhileAwaiting;
    const startedPlayback = Math.max(lastObservedTime, currentTime) > 0.6;
    const blockedAtStart = allowAutoRecover && video.paused && currentTime < 1.2 && readyState >= 2;
    const noSourceAtStart =
      allowAutoRecover &&
      video.paused &&
      currentTime < 0.25 &&
      readyState === 0 &&
      (networkState === 0 || networkState === 2 || networkState === 3);
    const hardFreeze =
      allowAutoRecover &&
      startedPlayback &&
      !video.paused &&
      stalledForMs > hardStallMs &&
      (readyState <= 2 || networkState === 2 || networkState === 3);
    const hardFreezeAny =
      allowAutoRecover &&
      startedPlayback &&
      !video.paused &&
      stalledForMs > hardStallMs + 900 &&
      currentTime < 8;
    const pausedBufferStall =
      allowAutoRecover &&
      startedPlayback &&
      video.paused &&
      stalledForMs > pausedStallMs &&
      (readyState <= 2 || networkState === 3);
    const stalledDuringPlayback = hardFreeze || pausedBufferStall || hardFreezeAny;
    const startupStallWithAlternative =
      hasNextCandidate &&
      allowAutoRecover &&
      video.paused &&
      currentTime < 0.25 &&
      stalledForMs > startupStallMs &&
      readyState === 0 &&
      (networkState === 0 || networkState === 2 || networkState === 3);
    const startupLoadingStallWithAlternative =
      hasNextCandidate &&
      allowAutoRecover &&
      currentTime < 0.25 &&
      stalledForMs > statusRecoveryMs &&
      readyState <= 1 &&
      startupLoadingStatusPattern.test(statusText);
    const statusDrivenRecovery =
      hasNextCandidate &&
      allowAutoRecover &&
      stalledForMs > statusRecoveryMs &&
      /lecture impossible|source selectionnee indisponible|source indisponible|fallback ios actif|connexion source|chargement du flux|chargement de la source/.test(statusText);
    const prolongedFallbackStall =
      hasNextCandidate &&
      fallbackStatusSince > 0 &&
      Date.now() - fallbackStatusSince > fallbackStallMs &&
      currentTime < 0.25;
    if (
      errorCode <= 0 &&
      !blockedAtStart &&
      !noSourceAtStart &&
      !stalledDuringPlayback &&
      !startupStallWithAlternative &&
      !startupLoadingStallWithAlternative &&
      !statusDrivenRecovery &&
      !prolongedFallbackStall
    ) {
      return;
    }
    switchingSource = true;
    if (
      stalledDuringPlayback ||
      startupStallWithAlternative ||
      startupLoadingStallWithAlternative ||
      statusDrivenRecovery ||
      prolongedFallbackStall
    ) {
      setPlayerStatus("Lecture bloquee, bascule automatique...", true);
    }
    trySwitchToNextSource()
      .catch(() => {
        setPlayerStatus("Erreur video detectee. Choisis une autre source.", true);
      })
      .finally(() => {
        switchingSource = false;
        trackedPlayToken = Number(state.playToken || 0);
        lastObservedTime = Number(refs.playerVideo?.currentTime || 0);
        lastAdvanceAt = Date.now();
      });
  }, guardIntervalMs);
}

function schedulePlaybackHealthMonitor(token, step = 0) {
  clearPlaybackHealthMonitor();
  const mobileGuard = isLikelyMobileDevice();
  const firstDelay = mobileGuard ? Math.max(760, PLAYBACK_HEALTH_FIRST_DELAY_MS - 620) : PLAYBACK_HEALTH_FIRST_DELAY_MS;
  const repeatDelay = mobileGuard
    ? Math.max(1050, PLAYBACK_HEALTH_REPEAT_DELAY_MS - 900)
    : PLAYBACK_HEALTH_REPEAT_DELAY_MS;
  const delay = step === 0 ? firstDelay : repeatDelay;
  state.playbackHealthTimer = window.setTimeout(() => {
    if (token !== state.playToken) {
      return;
    }
    if (state.segmentFallback) {
      return;
    }
    const currentSource = state.sourcePool[state.sourceIndex] || null;
    if (isEmbedSource(currentSource)) {
      clearPlaybackHealthMonitor();
      return;
    }
    const video = refs.playerVideo;
    if (!video || video.ended) {
      return;
    }
    const errorCode = Number(video.error?.code || 0);
    const currentTime = Number(video.currentTime || 0);
    const readyState = Number(video.readyState || 0);
    const networkState = Number(video.networkState || 0);
    const awaitingUser = isAwaitingUserPlay();
    const statusText = String(refs.playerStatus?.textContent || "").toLowerCase();
    const canAutoRecoverWhileAwaiting =
      awaitingUser &&
      step >= 2 &&
      /fallback ios actif|connexion source|lecture bloquee|source indisponible|chargement du flux|chargement de la source/.test(statusText);
    const allowAutoRecover = !awaitingUser || canAutoRecoverWhileAwaiting;
    const blockedAtStart = allowAutoRecover && step >= 1 && video.paused && currentTime < 1.2 && readyState >= 2;
    const noSourceAtStart =
      allowAutoRecover &&
      step >= 2 &&
      video.paused &&
      currentTime < 0.25 &&
      readyState === 0 &&
      (networkState === 0 || networkState === 2 || networkState === 3);
    const startupLoadingStall =
      allowAutoRecover &&
      step >= (mobileGuard ? 2 : 3) &&
      currentTime < 0.25 &&
      readyState <= 1 &&
      /connexion source|chargement du flux|chargement de la source|fallback ios actif/.test(statusText);
    if (errorCode > 0 || blockedAtStart || noSourceAtStart || startupLoadingStall) {
      trySwitchToNextSource().catch(() => {
        setPlayerStatus("Erreur video detectee. Choisis une autre source.", true);
      });
      return;
    }
    if (step < 6) {
      schedulePlaybackHealthMonitor(token, step + 1);
    }
  }, delay);
}

async function retryCurrentSource(options = {}) {
  if (!state.sourcePool.length || state.sourceIndex < 0) {
    const recovered = await hardRefreshCurrentPlayback(false);
    if (recovered) {
      return;
    }
    throw new Error("No active source");
  }
  const source = state.sourcePool[state.sourceIndex] || null;
  if (!source) {
    const recovered = await hardRefreshCurrentPlayback(false);
    if (recovered) {
      return;
    }
    throw new Error("No active source");
  }
  const token = ++state.playToken;
  const resumeTime = Number(refs.playerVideo.currentTime || 0);
  setPlayerStatus("Nouvel essai sur la source active...");
  try {
    await playFromSourcePoolWithRescue(resumeTime, token, {
      startIndex: state.sourceIndex,
      strictIndex: true,
      skipPremiumFallback: false,
      allowPremiumRescue: false,
    });
  } catch (error) {
    if (options.allowFallback) {
      await trySwitchToNextSource();
      return;
    }
    throw error;
  }
}

async function handlePlayerPlaybackError() {
  const videoErrorCode = Number(refs.playerVideo?.error?.code || 0);
  const nearStart = Number(refs.playerVideo?.currentTime || 0) < 1.2;
  if (videoErrorCode === 3 && nearStart) {
    await trySwitchToNextSource();
    return;
  }
  const index = Number(state.sourceIndex);
  const source = state.sourcePool[index] || null;
  if (source && canRetryCurrentSourceOnce(index, source)) {
    markCurrentSourceRetried(index, source);
    await retryCurrentSource({ allowFallback: true });
    return;
  }
  await trySwitchToNextSource();
}

function getNextAutomaticSourceIndex(startIndex, avoidPremium = true, excludeKeys = null) {
  if (!Array.isArray(state.sourcePool) || state.sourcePool.length === 0) {
    return -1;
  }
  const from = Math.max(-1, Number(startIndex || -1)) + 1;
  const blockedKeys = excludeKeys instanceof Set ? excludeKeys : null;
  if (!avoidPremium) {
    for (let index = from; index < state.sourcePool.length; index += 1) {
      const key = getSourceDedupKey(state.sourcePool[index]);
      if (blockedKeys && key && blockedKeys.has(key)) {
        continue;
      }
      return index;
    }
    return -1;
  }

  for (let index = from; index < state.sourcePool.length; index += 1) {
    const source = state.sourcePool[index];
    if (source?.premiumHint) {
      continue;
    }
    const key = getSourceDedupKey(source);
    if (blockedKeys && key && blockedKeys.has(key)) {
      continue;
    }
    return index;
  }
  return -1;
}

function getFallbackSourceIndex(startIndex, excludeKeys = null) {
  let index = getNextAutomaticSourceIndex(startIndex, true, excludeKeys);
  if (index >= 0) {
    return index;
  }
  return getNextAutomaticSourceIndex(startIndex, false, excludeKeys);
}

async function trySwitchToNextSource() {
  if (isManualSourceLockActive()) {
    setPlayerStatus("Source selectionnee indisponible. Choisis une autre source.", true);
    return;
  }
  if (!state.sourcePool.length || state.sourceIndex < 0) {
    setPlayerStatus("Erreur video detectee. Choisis un autre titre.", true);
    return;
  }

  const currentSource = state.sourcePool[state.sourceIndex] || null;
  const avoidPremiumAuto = !currentSource?.premiumHint;
  const allowPremiumAutoFallback = AUTO_PREMIUM_FALLBACK;
  const attemptedKeys = new Set();
  const currentKey = getSourceDedupKey(currentSource);
  if (currentKey) {
    attemptedKeys.add(currentKey);
  }

  let nextIndex = getNextAutomaticSourceIndex(state.sourceIndex, avoidPremiumAuto, attemptedKeys);
  if (nextIndex < 0 && allowPremiumAutoFallback) {
    nextIndex = getFallbackSourceIndex(state.sourceIndex, attemptedKeys);
  }
  if (nextIndex < 0 || nextIndex >= state.sourcePool.length) {
    if (state.allEpisodeSources.length > state.sourcePool.length) {
      state.sourcePool = state.allEpisodeSources.slice();
      state.sourceRetryAttempts.clear();
      state.sourceIndex = -1;
      nextIndex = getNextAutomaticSourceIndex(-1, avoidPremiumAuto, attemptedKeys);
      if (nextIndex < 0 && allowPremiumAutoFallback) {
        nextIndex = getFallbackSourceIndex(-1, attemptedKeys);
      }
      showToast("Bascule automatique vers une autre langue/source.");
    } else {
      const recovered = await hardRefreshCurrentPlayback();
      if (recovered) {
        return;
      }
      setPlayerStatus("Source indisponible. Aucun secours disponible.", true);
      return;
    }
  }
  if (nextIndex < 0) {
    const recovered = await hardRefreshCurrentPlayback();
    if (recovered) {
      return;
    }
    setPlayerStatus("Source libre indisponible. Choisis une autre source.", true);
    return;
  }

  const token = ++state.playToken;
  const resumeTime = Number(refs.playerVideo.currentTime || 0);
  setPlayerLoading(true, "Bascule automatique vers une autre source...");
  await playFromSourcePool(resumeTime, token, nextIndex);
  showToast("Source alternative active.");
}

async function hardRefreshCurrentPlayback(showRecoveredToast = true) {
  const nowPlaying = state.nowPlaying;
  if (!nowPlaying || refs.playerOverlay.hidden) {
    return false;
  }
  const now = Date.now();
  if (now - Number(state.lastPlaybackHardRefreshAt || 0) < 15000) {
    return false;
  }
  state.lastPlaybackHardRefreshAt = now;

  const item =
    findItemById(Number(nowPlaying.id || 0)) ||
    (await buildItemFromDetails(Number(nowPlaying.id || 0)));
  if (!item || Number(item.id || 0) <= 0) {
    return false;
  }

  const token = ++state.playToken;
  setPlayerStatus("Resynchronisation complete des sources...");
  try {
    if (String(nowPlaying.type || "") === "tv") {
      const season = Math.max(1, Number(nowPlaying.season || 1));
      const episode = Math.max(1, Number(nowPlaying.episode || 1));
      const language = String(nowPlaying.language || "");
      await loadEpisodeStream(item, season, episode, 0, token, language, false);
    } else {
      await loadMovieStream(item, 0, token, false);
    }
    if (showRecoveredToast) {
      showToast("Lecture recuperee apres resynchronisation.");
    }
    return true;
  } catch {
    return false;
  }
}

async function playFromSourcePool(resumeTime, token, startIndex = 0, options = {}) {
  const strictIndex = Boolean(options?.strictIndex);
  const skipPremiumFallback = Boolean(options?.skipPremiumFallback);
  const hlsSupported = canAttemptHlsPlayback(refs.playerVideo);
  const startSource = state.sourcePool[startIndex] || null;
  const startIsPremium = Boolean(startSource?.premiumHint);
  const attemptedKeys = new Set();
  let lastError = null;
  for (let index = startIndex; index < state.sourcePool.length; index += 1) {
    const source = state.sourcePool[index];
    const isHlsSource = source?.format === "hls" || /m3u8/i.test(String(source?.url || ""));
    if (isHlsSource && !hlsSupported) {
      if (!lastError) {
        lastError = new Error("HLS not supported");
      }
      continue;
    }
    const key = getSourceDedupKey(source);
    if (key && attemptedKeys.has(key)) {
      continue;
    }
    if (key) {
      attemptedKeys.add(key);
    }
    if (skipPremiumFallback && !startIsPremium && index > startIndex && source?.premiumHint) {
      break;
    }

    state.sourceIndex = index;
    renderPlayerSourceOptions();
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

async function playFromSourcePoolWithRescue(resumeTime, token, options = {}) {
  const startIndex = Math.max(0, Number(options?.startIndex || 0));
  const strictIndex = Boolean(options?.strictIndex);
  const initialSkipPremiumFallback = Boolean(options?.skipPremiumFallback);
  const allowPremiumRescue = options?.allowPremiumRescue !== false;

  try {
    await playFromSourcePool(resumeTime, token, startIndex, {
      strictIndex,
      skipPremiumFallback: initialSkipPremiumFallback,
    });
    return;
  } catch (firstError) {
    if (strictIndex || !allowPremiumRescue || !initialSkipPremiumFallback || isManualSourceLockActive()) {
      throw firstError;
    }
    const hasPremium = state.sourcePool.some((entry) => Boolean(entry?.premiumHint));
    const hasFree = state.sourcePool.some((entry) => !entry?.premiumHint);
    if (!hasPremium || !hasFree) {
      throw firstError;
    }
    setPlayerStatus("Essai source de secours...");
    await playFromSourcePool(resumeTime, token, 0, {
      strictIndex: false,
      skipPremiumFallback: false,
    });
    showToast("Source de secours active.");
  }
}

function isBlockedPlaybackSourceUrl(rawUrl, formatHint = "") {
  const input = String(rawUrl || "").trim();
  if (!input) {
    return true;
  }

  let parsed = null;
  try {
    parsed = new URL(input, window.location.href);
  } catch {
    return true;
  }

  const host = String(parsed.hostname || "")
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
  const path = String(parsed.pathname || "").toLowerCase();
  const withQuery = `${path}${String(parsed.search || "").toLowerCase()}`;
  const format = String(formatHint || "").trim().toLowerCase();

  if (/maddenwiped\.com|imens-poort\.com|extravagant-streaming\.life/.test(host)) {
    return true;
  }
  if (/rakuten\.tv|play\.google\.com|primevideo\.com/.test(host)) {
    return true;
  }
  if (/\/universal\.mp4(?:$|\?)/i.test(withQuery)) {
    return true;
  }

  const looksDirectMedia = /\.(m3u8|mp4|webm|m4s|mpd)(?:$|\?)/i.test(withQuery);
  if (format === "embed" && !looksDirectMedia && /(?:^|\.)nakios\.site$/.test(host)) {
    return true;
  }

  return false;
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
  if (isBlockedPlaybackSourceUrl(url, format)) {
    return null;
  }
  const quality = String(entry?.quality || entry?.resolution || entry?.label || "").trim();
  const language = normalizeSourceLanguage(entry);
  const host = getSourceHost(url);
  const isZenix = Boolean(
    entry?.isZenix ||
      entry?.zenix ||
      /zenix/i.test(String(entry?.source_name || "")) ||
      /\/api\/hls-proxy\?url=/i.test(url)
  );
  let score = getSourceScore(format, quality, language, index, host);
  if (isZenix && isLikelyMobileDevice()) {
    score += 40;
  }
  const premiumHint = isPremiumLikeSource({
    url,
    source_name: entry?.source_name,
    language,
    quality,
  });
  const origin = String(entry?.origin || entry?.provider || entry?.source || "").trim();

  return {
    url,
    format,
    quality,
    language,
    host,
    score,
    premiumHint,
    origin,
    isZenix,
  };
}

function guessSourceFormat(entry, url) {
  const raw = String(entry?.format || entry?.type || "").toLowerCase();
  if (raw.includes("embed") || raw.includes("iframe")) {
    return "embed";
  }
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
  if (/video\.sibnet\.ru\/shell\.php/i.test(cleanUrl)) {
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

function getSourceHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getSourceHealthScore(host) {
  const key = String(host || "").trim().toLowerCase();
  if (!key) {
    return 0;
  }
  const row = state.sourceHostHealth.get(key);
  if (!row) {
    return 0;
  }
  const failures = Number(row.failures || 0);
  const successes = Number(row.successes || 0);
  return successes * SOURCE_SUCCESS_BONUS - failures * SOURCE_FAILURE_PENALTY;
}

function markSourceHostResult(host, ok) {
  const key = String(host || "").trim().toLowerCase();
  if (!key) {
    return;
  }
  const current = state.sourceHostHealth.get(key) || {
    failures: 0,
    successes: 0,
    updatedAt: 0,
  };
  if (ok) {
    current.successes = Math.min(18, Number(current.successes || 0) + 1);
    current.failures = Math.max(0, Number(current.failures || 0) - 1);
  } else {
    current.failures = Math.min(20, Number(current.failures || 0) + 1);
    current.successes = Math.max(0, Number(current.successes || 0) - 1);
  }
  current.updatedAt = Date.now();
  state.sourceHostHealth.set(key, current);

  if (state.sourceHostHealth.size > SOURCE_HOST_HEALTH_MAX) {
    const rows = Array.from(state.sourceHostHealth.entries()).sort(
      (left, right) => Number(left?.[1]?.updatedAt || 0) - Number(right?.[1]?.updatedAt || 0)
    );
    const remove = rows.slice(0, state.sourceHostHealth.size - SOURCE_HOST_HEALTH_MAX);
    remove.forEach(([entryKey]) => state.sourceHostHealth.delete(entryKey));
  }
  saveSourceHostHealth(state.sourceHostHealth);
}

function getSourceRetryKey(index, source) {
  const host = String(source?.host || "").trim().toLowerCase();
  const url = String(source?.url || "").trim();
  return `${Number(index)}|${host}|${url}`;
}

function canRetryCurrentSourceOnce(index, source) {
  const key = getSourceRetryKey(index, source);
  const attempts = Number(state.sourceRetryAttempts.get(key) || 0);
  return attempts < SOURCE_RETRY_PER_INDEX;
}

function markCurrentSourceRetried(index, source) {
  const key = getSourceRetryKey(index, source);
  const attempts = Number(state.sourceRetryAttempts.get(key) || 0) + 1;
  state.sourceRetryAttempts.set(key, attempts);
}

function markCurrentSourceSuccessful(index, source) {
  const key = getSourceRetryKey(index, source);
  state.sourceRetryAttempts.delete(key);
}

function hashStringToKey(value) {
  const raw = String(value || "");
  if (!raw) {
    return "";
  }
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function getSourceSuccessKey(source) {
  if (!source) {
    return "";
  }
  const host = String(source?.host || getSourceHost(source?.url || "")).trim().toLowerCase();
  const url = String(source?.url || "").trim();
  const hash = hashStringToKey(url);
  if (!hash) {
    return "";
  }
  return host ? `${host}|${hash}` : hash;
}

function getQualityBadgeFromSource(source) {
  const raw = String(source?.quality || source?.resolution || source?.label || "").toLowerCase();
  const token = raw.match(/(2160p|4k|1080p|720p|480p|360p)/i);
  if (token) {
    const normalized = String(token[1] || "").toLowerCase();
    if (normalized.includes("2160") || normalized.includes("4k")) {
      return "4K";
    }
    if (normalized.includes("1080")) {
      return "Full HD";
    }
    return "HD";
  }
  if (raw.includes("full hd")) {
    return "Full HD";
  }
  if (raw.includes("hd")) {
    return "HD";
  }
  return "HD";
}

function getGlobalQualityBadge(item) {
  if (!item || typeof item !== "object") {
    return QUALITY_BADGE_DEFAULT;
  }
  const year = getItemReleaseYear(item) || getCatalogReleaseYear(item);
  if (year > 0) {
    const currentYear = new Date().getFullYear();
    if (year >= currentYear - QUALITY_BADGE_4K_RECENT_YEARS) {
      return "4K";
    }
  }
  return QUALITY_BADGE_DEFAULT;
}

function getItemQualityBadge(itemOrId) {
  const item = itemOrId && typeof itemOrId === "object" ? itemOrId : null;
  const key = Number(item?.id || itemOrId || 0);
  if (key > 0 && state.itemQualityMap instanceof Map) {
    const value = String(state.itemQualityMap.get(key) || "").trim();
    if (value) {
      return value;
    }
  }
  return getGlobalQualityBadge(item);
}

function rememberSourceSuccess(source, itemId = 0) {
  const key = getSourceSuccessKey(source);
  if (!key) {
    return;
  }
  const now = Date.now();
  const map = state.sourceSuccessMap instanceof Map ? state.sourceSuccessMap : new Map();
  map.set(key, { ts: now });
  state.sourceSuccessMap = map;
  pruneSourceSuccessMap(map);
  saveSourceSuccessMap(map);

  const id = Number(itemId || 0);
  if (id > 0 && state.itemQualityMap instanceof Map) {
    const badge = getQualityBadgeFromSource(source);
    const current = String(state.itemQualityMap.get(id) || "").trim();
    const rank = badge === "4K" ? 3 : badge === "Full HD" ? 2 : 1;
    const currentRank = current === "4K" ? 3 : current === "Full HD" ? 2 : current ? 1 : 0;
    if (rank > currentRank) {
      state.itemQualityMap.set(id, badge);
      pruneItemQualityMap(state.itemQualityMap);
      saveItemQualityMap(state.itemQualityMap);
    }
  }
}

function hasSourceSuccess(source) {
  const key = getSourceSuccessKey(source);
  if (!key || !(state.sourceSuccessMap instanceof Map)) {
    return false;
  }
  const row = state.sourceSuccessMap.get(key);
  if (!row) {
    return false;
  }
  const ts = Number(row.ts || 0);
  if (!Number.isFinite(ts) || ts <= 0) {
    return false;
  }
  if (Date.now() - ts > SOURCE_SUCCESS_TTL_MS) {
    state.sourceSuccessMap.delete(key);
    saveSourceSuccessMap(state.sourceSuccessMap);
    return false;
  }
  return true;
}

function pruneSourceSuccessMap(map) {
  if (!(map instanceof Map)) {
    return;
  }
  const now = Date.now();
  const entries = Array.from(map.entries()).filter(([_, value]) => {
    const ts = Number(value?.ts || 0);
    return Number.isFinite(ts) && ts > 0 && now - ts <= SOURCE_SUCCESS_TTL_MS;
  });
  if (entries.length <= SOURCE_SUCCESS_MAX) {
    map.clear();
    entries.forEach(([k, v]) => map.set(k, v));
    return;
  }
  entries.sort((a, b) => Number(b?.[1]?.ts || 0) - Number(a?.[1]?.ts || 0));
  map.clear();
  entries.slice(0, SOURCE_SUCCESS_MAX).forEach(([k, v]) => map.set(k, v));
}

function pruneItemQualityMap(map) {
  if (!(map instanceof Map)) {
    return;
  }
  if (map.size <= 800) {
    return;
  }
  const entries = Array.from(map.entries());
  entries.sort((left, right) => Number(right?.[0] || 0) - Number(left?.[0] || 0));
  map.clear();
  entries.slice(0, 800).forEach(([key, value]) => map.set(key, value));
}

function getSourceScore(format, quality, language, index, host = "") {
  let score = 0;
  if (format === "mp4") {
    score += 320;
  } else if (format === "hls") {
    score += 290;
  } else if (format === "webm") {
    score += 250;
  } else if (format === "dash") {
    score += 210;
  } else if (format === "embed") {
    score += 160;
  } else {
    score += 100;
  }

  if (format === "embed" && isLikelyMobileDevice()) {
    score -= 40;
  }

  const qualityText = String(quality || "").toLowerCase();
  const qualityMatch = qualityText.match(/\d{3,4}/);
  if (qualityMatch) {
    score += Number(qualityMatch[0]) / 10;
  } else if (qualityText.includes("hd")) {
    score += 70;
  }
  if (language === "VF") {
    score += 30;
  } else if (language === "VOSTFR") {
    score += 26;
  } else if (language === "MULTI") {
    score += 18;
  } else if (language === "VO") {
    score += 4;
  }

  score += Math.max(0, 30 - index);
  score += getSourceHealthScore(host);
  return score;
}

function sanitizeSourceDisplayQuality(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "Auto";
  }
  const tokenMatch = raw.match(/(2160p|1440p|1080p|720p|480p|360p|4k|hd|sd)/i);
  if (tokenMatch) {
    return String(tokenMatch[1] || "").toUpperCase();
  }
  return "Auto";
}

function getSourceDisplayLanguage(source) {
  const normalized = normalizeLanguageLabel(source?.language || source?.lang || "");
  return normalized || "Auto";
}

function getSourceDisplayQuality(source) {
  return sanitizeSourceDisplayQuality(source?.quality || source?.resolution || source?.label || "");
}

function formatSourceLabel(source, index, total) {
  const chunks = [`Source ${index + 1}/${total}`];
  if (source?.isZenix) {
    chunks.push("Zenix");
  }
  const qualityLabel = getSourceDisplayQuality(source);
  const languageLabel = getSourceDisplayLanguage(source);
  if (qualityLabel && qualityLabel !== "Auto") {
    chunks.push(String(qualityLabel));
  }
  if (languageLabel && languageLabel !== "Auto") {
    chunks.push(languageLabel);
  }
  if (source?.format && source.format !== "unknown") {
    chunks.push(source.format.toUpperCase());
  }
  if (source?.premiumHint) {
    chunks.push("Premium");
  }
  return chunks.join(" - ");
}

function isZenixSource(source) {
  return Boolean(source?.isZenix);
}

function updateZenixStatus() {
  if (!refs.playerZenixStatus) {
    return;
  }
  if (!Array.isArray(state.sourcePool) || state.sourcePool.length === 0) {
    refs.playerZenixStatus.textContent = "";
    refs.playerZenixStatus.classList.remove("is-ok", "is-warn");
    return;
  }
  const hasZenix = state.sourcePool.some((entry) => isZenixSource(entry));
  if (hasZenix) {
    const zenixEntry = state.sourcePool.find((entry) => isZenixSource(entry));
    const mode = String(zenixEntry?.zenixMode || "").toLowerCase();
    if (mode === "embed") {
      refs.playerZenixStatus.textContent = "Lecteur Zenix actif (mode externe).";
    } else {
      refs.playerZenixStatus.textContent = "Lecteur Zenix actif (compatible).";
    }
    refs.playerZenixStatus.classList.add("is-ok");
    refs.playerZenixStatus.classList.remove("is-warn");
    return;
  }
  refs.playerZenixStatus.textContent = "Lecteur Zenix non compatible pour ce titre.";
  refs.playerZenixStatus.classList.add("is-warn");
  refs.playerZenixStatus.classList.remove("is-ok");
}

function isUnplayablePlayError(error) {
  const name = String(error?.name || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();
  if (name.includes("notsupported")) {
    return true;
  }
  if (message.includes("no supported sources")) {
    return true;
  }
  if (message.includes("media could not be loaded")) {
    return true;
  }
  if (message.includes("decoding") && message.includes("failed")) {
    return true;
  }
  return false;
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

function computeSourceCompatibilityScore(source) {
  const safe = Math.max(0, Number(source?.score || 0));
  if (!Number.isFinite(safe) || safe <= 0) {
    return 55;
  }
  return Math.max(35, Math.min(99, Math.round((safe / 220) * 100)));
}

function describeCompatibilityLabel(score) {
  if (score >= 86) {
    return "Excellent";
  }
  if (score >= 72) {
    return "Stable";
  }
  if (score >= 60) {
    return "Moyen";
  }
  return "Fragile";
}

function computeMobileCompatibilityScore(source) {
  const base = computeSourceCompatibilityScore(source);
  const format = String(source?.format || "").toLowerCase();
  let score = base;
  if (format === "embed") {
    score -= 18;
  } else if (format === "mp4") {
    score += 8;
  } else if (format === "hls") {
    score += 5;
  }
  if (source?.premiumHint) {
    score -= 4;
  }
  return Math.max(30, Math.min(99, Math.round(score)));
}

function renderPlayerSourceOptions() {
  if (!refs.playerSourceSelect || !refs.playerSourceApplyBtn) {
    return;
  }

  refs.playerSourceSelect.innerHTML = "";
  if (refs.playerSourceChips) {
    refs.playerSourceChips.innerHTML = "";
  }
  if (!Array.isArray(state.sourcePool) || state.sourcePool.length === 0) {
    refs.playerSourceSelect.disabled = true;
    refs.playerSourceApplyBtn.disabled = true;
    if (refs.playerSourceControl) {
      refs.playerSourceControl.hidden = true;
    }
    updateZenixStatus();
    return;
  }

  const fragment = document.createDocumentFragment();
  const chipsFragment = document.createDocumentFragment();
  state.sourcePool.forEach((entry, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = formatSourceLabel(entry, index, state.sourcePool.length);
    option.selected = index === state.sourceIndex;
    fragment.appendChild(option);

    if (refs.playerSourceChips) {
      const score = computeSourceCompatibilityScore(entry);
      const compatibilityLabel = describeCompatibilityLabel(score);
      const compatibilityBand = score >= 86 ? "high" : score >= 72 ? "medium" : score >= 60 ? "low" : "fragile";
      const mobileScore = computeMobileCompatibilityScore(entry);
      const mobileLabel = describeCompatibilityLabel(mobileScore);
      const mobileCompatText = `Mobile ${mobileLabel} ${mobileScore}%`;
      const okBadge = hasSourceSuccess(entry) ? '<span class="player-source-chip-meta-pill player-source-chip-ok">Lecture OK</span>' : "";
      const zenixBadge = entry?.isZenix ? '<span class="player-source-chip-meta-pill player-source-chip-zenix">Zenix</span>' : "";
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "player-source-chip";
      chip.dataset.sourceIndex = String(index);
      chip.dataset.compatBand = compatibilityBand;
      chip.setAttribute("role", "option");
      chip.setAttribute("aria-selected", index === state.sourceIndex ? "true" : "false");
      if (index === state.sourceIndex) {
        chip.classList.add("is-active");
      }
      const quality = getSourceDisplayQuality(entry);
      const language = getSourceDisplayLanguage(entry);
      const format = String(entry?.format || "").trim().toUpperCase() || "STREAM";
      chip.title = `Compatibilite ${score}% (${compatibilityLabel}) | Mobile ${mobileScore}% (${mobileLabel})`;
      chip.innerHTML = `
        <span class="player-source-chip-top">
          <span class="player-source-chip-head">Source ${index + 1}</span>
          <span class="player-source-chip-compat" data-score="${score}">${escapeHtml(compatibilityLabel)} ${score}%</span>
        </span>
        <span class="player-source-chip-meta">
          ${zenixBadge}
          <span class="player-source-chip-meta-pill">${escapeHtml(language)}</span>
          <span class="player-source-chip-meta-pill">${escapeHtml(quality)}</span>
          <span class="player-source-chip-meta-pill">${escapeHtml(format)}</span>
          <span class="player-source-chip-meta-pill player-source-chip-mobile">${escapeHtml(mobileCompatText)}</span>
          ${okBadge}
        </span>
      `;
      bindFastPress(chip, () => {
        switchPlayerSource(index).catch(() => {
          showToast("Impossible de changer de source.", true);
        });
      });
      chipsFragment.appendChild(chip);
    }
  });
  refs.playerSourceSelect.appendChild(fragment);
  refs.playerSourceSelect.disabled = state.sourcePool.length <= 1;
  refs.playerSourceApplyBtn.disabled = true;
  if (state.sourceIndex >= 0) {
    refs.playerSourceSelect.value = String(state.sourceIndex);
  }
  if (refs.playerSourceChips) {
    refs.playerSourceChips.appendChild(chipsFragment);
  }
  if (refs.playerSourceControl) {
    refs.playerSourceControl.hidden = false;
  }
  updateZenixStatus();
}

function scheduleHlsLanguageProbe(sources) {
  const rows = Array.isArray(sources) ? sources.filter(Boolean) : [];
  if (rows.length === 0) {
    return;
  }
  const candidates = rows.filter((entry) => {
    if (!entry) {
      return false;
    }
    if (isEmbedSource(entry)) {
      return false;
    }
    const format = String(entry?.format || "").trim().toLowerCase();
    const url = String(entry?.url || "");
    const looksHls = format === "hls" || /\.m3u8(?:$|\?)/i.test(url);
    if (!looksHls) {
      return false;
    }
    const lang = String(entry?.language || "").trim().toUpperCase();
    return !lang || lang === "VOSTFR" || lang === "VO";
  });
  if (candidates.length === 0) {
    return;
  }

  const token = (state.hlsLangProbeToken += 1);
  const picked = candidates.slice(0, HLS_LANG_PROBE_MAX);
  Promise.resolve()
    .then(async () => {
      let updated = false;
      for (const entry of picked) {
        if (token !== state.hlsLangProbeToken) {
          return;
        }
        const inferred = await probeHlsSourceLanguage(entry);
        if (!inferred || inferred === entry.language) {
          continue;
        }
        const poolIndex = state.sourcePool.indexOf(entry);
        entry.language = inferred;
        entry.score = getSourceScore(
          String(entry?.format || ""),
          String(entry?.quality || ""),
          inferred,
          poolIndex >= 0 ? poolIndex : 0,
          String(entry?.host || "")
        );
        updated = true;
      }

      if (!updated || token !== state.hlsLangProbeToken) {
        return;
      }
      state.availableLanguages = getAvailableLanguages(state.allEpisodeSources);
      const currentSelection = String(refs.playerLanguageSelect?.value || "")
        .trim()
        .toUpperCase();
      const safeSelection = state.availableLanguages.includes(currentSelection) ? currentSelection : "";
      if (refs.playerLanguageSelect) {
        populateLanguageSelect(refs.playerLanguageSelect, state.availableLanguages, safeSelection);
        refs.playerLanguageSelect.disabled = state.availableLanguages.length <= 1;
      }
      if (safeSelection) {
        setPlayerPill(refs.playerLanguagePill, safeSelection);
      }
      renderPlayerSourceOptions();
      if (refs.playerSourceMeta && state.sourceIndex >= 0) {
        const active = state.sourcePool[state.sourceIndex];
        if (active) {
          refs.playerSourceMeta.textContent = formatSourceLabel(active, state.sourceIndex, state.sourcePool.length || 1);
          if (active.language) {
            setPlayerPill(refs.playerLanguagePill, active.language);
          }
        }
      }
    })
    .catch(() => {
      // best effort language probe
    });
}

async function switchPlayerSource(index) {
  const safeIndex = Number(index);
  if (!Number.isInteger(safeIndex) || safeIndex < 0 || safeIndex >= state.sourcePool.length) {
    return;
  }
  if (safeIndex === state.sourceIndex) {
    return;
  }
  const nextSource = state.sourcePool[safeIndex] || null;
  const shouldLock = !isZenixSource(nextSource);
  state.manualSourceLock = shouldLock;
  state.manualSourceLockedIndex = shouldLock ? safeIndex : -1;
  const token = ++state.playToken;
  const resumeTime = Number(refs.playerVideo.currentTime || 0);
  try {
    await playFromSourcePool(resumeTime, token, safeIndex, { strictIndex: true });
    renderPlayerSourceOptions();
    showToast("Source changee.");
  } catch (error) {
    state.sourceIndex = safeIndex;
    renderPlayerSourceOptions();
    setPlayerStatus("Source selectionnee indisponible. Essaie une autre source.", true);
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

function setPlayerSubTitle(value = "") {
  if (!refs.playerSubTitle) {
    return;
  }
  refs.playerSubTitle.textContent = String(value || "").trim();
}

function collectLanguageSignals(value) {
  const raw = String(value || "").trim().toUpperCase();
  if (!raw) {
    return {
      raw: "",
      hasVf: false,
      hasVost: false,
      hasMulti: false,
      hasVo: false,
    };
  }
  const probe = raw
    .replace(/[%._]+/g, " ")
    .replace(/[=:+-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    raw: probe,
    hasVf:
      /\bVF\b/.test(probe) ||
      /\bFRENCH\b/.test(probe) ||
      /\bFRANCAIS\b/.test(probe) ||
      /\bFRANÇAIS\b/.test(probe),
    hasVost:
      /\bVOST(?:FR)?\b/.test(probe) ||
      /\bSUB(?:BED|TITLES?|FR|FRENCH)?\b/.test(probe) ||
      /\bSOUS TITRES?\b/.test(probe),
    hasMulti:
      /\bMULTI\b/.test(probe) ||
      /\bDUAL\b/.test(probe) ||
      /\bDUO\b/.test(probe) ||
      /\bMULTILINGUE\b/.test(probe),
    hasVo: /\bVO\b/.test(probe) || /\bORIGINAL\b/.test(probe) || /\bRAW\b/.test(probe),
  };
}

function resolveLanguageFromSignals(signals) {
  if (!signals || !signals.raw) {
    return "";
  }
  if (signals.hasMulti || (signals.hasVf && signals.hasVost)) {
    return "MULTI";
  }
  if (signals.hasVf) {
    return "VF";
  }
  if (signals.hasVost) {
    return "VOSTFR";
  }
  if (signals.hasVo) {
    return "VO";
  }
  return "";
}

function parseLanguageFromSourceName(value) {
  const signals = collectLanguageSignals(value);
  const resolved = resolveLanguageFromSignals(signals);
  if (resolved) {
    return resolved;
  }
  const raw = String(signals.raw || "").trim();
  if (!raw) {
    return "";
  }
  const chunks = raw.split(/[|/\\\-:,]+/).map((entry) => entry.trim()).filter(Boolean);
  for (const chunk of chunks) {
    const normalized = normalizeLanguageLabel(chunk);
    if (normalized === "VF" || normalized === "VOSTFR" || normalized === "MULTI" || normalized === "VO") {
      return normalized;
    }
  }
  return "";
}

function parseLanguageFromSourceUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  let probe = raw;
  try {
    const parsed = new URL(raw, window.location.href);
    probe = `${String(parsed.pathname || "")} ${String(parsed.search || "")}`;
  } catch {
    probe = raw;
  }
  const fromSignals = resolveLanguageFromSignals(collectLanguageSignals(probe));
  if (fromSignals) {
    return fromSignals;
  }
  const upper = String(probe || "").toUpperCase();
  if (/[?&](?:LANG|LANGUAGE|AUDIO|DUB)=VF(?:$|[&?#/])/i.test(upper)) {
    return "VF";
  }
  if (/[?&](?:LANG|LANGUAGE|AUDIO|DUB)=FR(?:$|[&?#/])/i.test(upper)) {
    return "VF";
  }
  if (/[?&](?:LANG|LANGUAGE|AUDIO|SUB)=VOSTFR(?:$|[&?#/])/i.test(upper)) {
    return "VOSTFR";
  }
  if (/[?&](?:LANG|LANGUAGE)=MULTI(?:$|[&?#/])/i.test(upper)) {
    return "MULTI";
  }
  return "";
}

function reconcileSourceLanguage(fieldLanguage, nameLanguage, urlLanguage) {
  const fromField = ["VF", "VOSTFR", "MULTI", "VO"].includes(fieldLanguage) ? fieldLanguage : "";
  const fromName = ["VF", "VOSTFR", "MULTI", "VO"].includes(nameLanguage) ? nameLanguage : "";
  const fromUrl = ["VF", "VOSTFR", "MULTI", "VO"].includes(urlLanguage) ? urlLanguage : "";
  const merged = Array.from(new Set([fromField, fromName, fromUrl].filter(Boolean)));
  if (merged.length === 0) {
    return "";
  }
  if (merged.length === 1) {
    return merged[0];
  }
  if (merged.includes("MULTI")) {
    return "MULTI";
  }
  if (merged.includes("VF") && merged.includes("VOSTFR")) {
    // Conflicting metadata: safer than wrong hard label.
    return "MULTI";
  }
  if (fromName) {
    return fromName;
  }
  if (fromUrl) {
    return fromUrl;
  }
  return fromField || merged[0];
}

function normalizeSourceLanguage(entry) {
  const fromFieldRaw = normalizeLanguageLabel(entry?.language || entry?.lang || "");
  const fromField =
    fromFieldRaw === "VF" || fromFieldRaw === "VOSTFR" || fromFieldRaw === "MULTI" || fromFieldRaw === "VO"
      ? fromFieldRaw
      : "";
  const fromName = parseLanguageFromSourceName(entry?.source_name || entry?.name || "");
  const fromUrl = parseLanguageFromSourceUrl(entry?.stream_url || entry?.url || entry?.file || entry?.src || "");
  const reconciled = reconcileSourceLanguage(fromField, fromName, fromUrl);
  if (reconciled) {
    return reconciled;
  }
  if (typeof entry?.language === "string") {
    const trimmed = String(entry.language || "").trim().toUpperCase();
    if (trimmed.length > 0 && trimmed.length <= 12) {
      return trimmed;
    }
  }
  return "";
}

function isEmbedSource(source, url = "") {
  const format = String(source?.format || "").trim().toLowerCase();
  if (format === "embed" || format === "iframe") {
    return true;
  }
  const raw = String(url || source?.url || "").trim().toLowerCase();
  if (!raw) {
    return false;
  }
  return /video\.sibnet\.ru\/shell\.php/i.test(raw) || /\/embed[-_/]/i.test(raw);
}

function markEmbedLoadStart(source, url = "") {
  state.embedLoadStartedAt = Date.now();
  state.embedLoadFinishedAt = 0;
  const key = getSourceDedupKey(source) || canonicalizeSourceUrl(url) || String(source?.url || url || "").trim();
  state.embedSourceKey = key;
}

function markEmbedLoadSuccess() {
  state.embedLoadFinishedAt = Date.now();
}

function clearEmbedLoadState() {
  state.embedLoadStartedAt = 0;
  state.embedLoadFinishedAt = 0;
  state.embedSourceKey = "";
}

function resetPlayerEmbedFrame() {
  if (!refs.playerEmbedFrame) {
    return;
  }
  clearEmbedLoadState();
  refs.playerEmbedFrame.hidden = true;
  const current = String(refs.playerEmbedFrame.getAttribute("src") || "").trim();
  if (!current || current === "about:blank") {
    return;
  }
  refs.playerEmbedFrame.setAttribute("src", "about:blank");
}

function showPlayerEmbedFrame(url, options = {}) {
  if (!refs.playerEmbedFrame) {
    throw new Error("Embed frame unavailable");
  }
  const frame = refs.playerEmbedFrame;
  const safeUrl = String(url || "").trim();
  if (!safeUrl) {
    throw new Error("Embed source missing");
  }

  const token = Number(options?.token || 0);
  const timeoutMs = Math.max(3000, Number(options?.timeoutMs || EMBED_READY_TIMEOUT_MS));

  refs.playerVideo.hidden = true;
  refs.playerVideo.controls = false;
  frame.hidden = false;

  return new Promise((resolve, reject) => {
    let settled = false;
    let armed = false;
    let timeoutId = 0;

    const done = (error = null) => {
      if (settled) {
        return;
      }
      settled = true;
      frame.removeEventListener("load", onLoad);
      frame.removeEventListener("error", onError);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = 0;
      }
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };

    const onLoad = () => {
      if (!armed) {
        return;
      }
      if (token && token !== state.playToken) {
        done();
        return;
      }
      const current = String(frame.getAttribute("src") || "").trim();
      if (!current || current === "about:blank") {
        done(new Error("Embed source reset"));
        return;
      }
      done();
    };

    const onError = () => {
      done(new Error("Embed load error"));
    };

    frame.addEventListener("load", onLoad);
    frame.addEventListener("error", onError);
    frame.setAttribute("src", safeUrl);
    armed = true;
    timeoutId = window.setTimeout(() => {
      if (token && token !== state.playToken) {
        done();
        return;
      }
      done();
    }, timeoutMs);
  });
}

function extractProxyTargetUrl(url) {
  const raw = String(url || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const parsed = new URL(raw, window.location.href);
    if (!/\/api\/hls-proxy$/i.test(parsed.pathname)) {
      return "";
    }
    const target = String(parsed.searchParams.get("url") || "").trim();
    if (!target) {
      return "";
    }
    const absolute = new URL(target, window.location.href).href;
    return /^https?:\/\//i.test(absolute) ? absolute : "";
  } catch {
    return "";
  }
}

function canonicalizeSourceUrl(url) {
  const raw = String(url || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const absolute = new URL(raw, window.location.href).href;
    const proxyTarget = extractProxyTargetUrl(absolute);
    return proxyTarget || absolute;
  } catch {
    const proxyTarget = extractProxyTargetUrl(raw);
    return proxyTarget || raw;
  }
}

function clearHlsPlaylistBlobs() {
  const rows = Array.isArray(state.hlsPlaylistBlobUrls) ? state.hlsPlaylistBlobUrls.slice() : [];
  state.hlsPlaylistBlobUrls = [];
  rows.forEach((entry) => {
    const url = String(entry || "").trim();
    if (!url) {
      return;
    }
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore cleanup errors
    }
  });
}

function clearSegmentFallbackSession() {
  const session = state.segmentFallback;
  if (!session) {
    return;
  }
  state.segmentFallback = null;
  const video = refs.playerVideo;
  if (video && session.onEnded) {
    video.removeEventListener("ended", session.onEnded);
  }
  if (video && session.onError) {
    video.removeEventListener("error", session.onError);
  }
}

function registerHlsPlaylistBlob(blobUrl) {
  const safe = String(blobUrl || "").trim();
  if (!safe) {
    return;
  }
  if (!Array.isArray(state.hlsPlaylistBlobUrls)) {
    state.hlsPlaylistBlobUrls = [];
  }
  state.hlsPlaylistBlobUrls.push(safe);
  while (state.hlsPlaylistBlobUrls.length > 10) {
    const dropped = String(state.hlsPlaylistBlobUrls.shift() || "").trim();
    if (!dropped) {
      continue;
    }
    try {
      URL.revokeObjectURL(dropped);
    } catch {
      // ignore cleanup errors
    }
  }
}

function toAbsoluteUrl(raw, fallbackBase = window.location.href) {
  const text = String(raw || "").trim();
  if (!text) {
    return "";
  }
  try {
    return new URL(text, fallbackBase).href;
  } catch {
    return text;
  }
}

function normalizeExistingHlsProxyUrl(rawUrl) {
  const absolute = toAbsoluteUrl(rawUrl);
  if (!absolute || !/\/api\/hls-proxy(?:\?|$)/i.test(absolute)) {
    return "";
  }
  const target = extractProxyTargetUrl(absolute);
  if (!target) {
    return "";
  }
  return `${API_BASE}/hls-proxy?url=${encodeURIComponent(target)}`;
}

function toHlsProxyUrl(rawUrl) {
  const absolute = toAbsoluteUrl(rawUrl);
  if (!absolute) {
    return "";
  }
  const normalizedExisting = normalizeExistingHlsProxyUrl(absolute);
  if (normalizedExisting) {
    return normalizedExisting;
  }
  if (!/^https?:\/\//i.test(absolute)) {
    return "";
  }
  return `${API_BASE}/hls-proxy?url=${encodeURIComponent(absolute)}`;
}

function decodeNumericPlaylistText(rawBody) {
  const text = String(rawBody || "").replace(/\u0000/g, "").trim();
  if (!text) {
    return "";
  }
  if (text.includes("#EXTM3U")) {
    return text;
  }
  const tokens = text
    .split(/[^0-9]+/)
    .map((entry) => String(entry || "").trim())
    .filter(Boolean);
  if (tokens.length < 6 || tokens.length > 120000) {
    return text;
  }
  if (!tokens.every((entry) => /^\d{1,3}$/.test(entry))) {
    return text;
  }
  const bytes = tokens.map((entry) => Number(entry));
  if (bytes.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
    return text;
  }
  try {
    const decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8") : null;
    const decoded = decoder ? decoder.decode(new Uint8Array(bytes)).trim() : String.fromCharCode(...bytes).trim();
    return decoded.includes("#EXTM3U") ? decoded : text;
  } catch {
    return text;
  }
}

function rewritePlaylistLineUriForClient(rawUri, baseUrl) {
  const value = String(rawUri || "").trim();
  if (!value || value.startsWith("data:")) {
    return value;
  }
  const absolute = toAbsoluteUrl(value, baseUrl);
  if (!absolute) {
    return value;
  }
  if (/^blob:/i.test(absolute)) {
    return absolute;
  }
  if (/\/api\/hls-proxy\?url=/i.test(absolute)) {
    const normalized = toHlsProxyUrl(absolute);
    return normalized ? toAbsoluteUrl(normalized) : absolute;
  }
  if (/^https?:\/\//i.test(absolute)) {
    const proxied = toHlsProxyUrl(absolute);
    return proxied ? toAbsoluteUrl(proxied) : absolute;
  }
  return absolute;
}

function rewritePlaylistTextForClient(playlistText, baseUrl) {
  const lines = String(playlistText || "").split(/\r?\n/);
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
        const next = rewritePlaylistLineUriForClient(uriValue, baseUrl);
        return `URI="${next}"`;
      });
    }
    return rewritePlaylistLineUriForClient(trimmed, baseUrl);
  });
  return rewritten.join("\n");
}

function pickFirstHlsVariantUrl(masterText, baseUrl) {
  const resolveBase = extractProxyTargetUrl(baseUrl) || baseUrl;
  const lines = String(masterText || "").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const current = String(lines[index] || "").trim();
    if (!current || !current.startsWith("#EXT-X-STREAM-INF")) {
      continue;
    }
    for (let lookAhead = index + 1; lookAhead < lines.length; lookAhead += 1) {
      const candidate = String(lines[lookAhead] || "").trim();
      if (!candidate || candidate.startsWith("#")) {
        continue;
      }
      const absolute = toAbsoluteUrl(candidate, resolveBase);
      if (/\/api\/hls-proxy\?url=/i.test(absolute)) {
        const normalized = toHlsProxyUrl(absolute);
        return normalized ? toAbsoluteUrl(normalized) : absolute;
      }
      return absolute;
    }
  }
  return "";
}

async function fetchDecodedHlsPlaylistText(url) {
  const requestUrl = toHlsProxyUrl(url) || toAbsoluteUrl(url);
  if (!requestUrl) {
    throw new Error("Missing HLS url");
  }
  const response = await fetch(requestUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Playlist request failed (${response.status})`);
  }
  const body = await response.text();
  return decodeNumericPlaylistText(body);
}

async function fetchDecodedHlsPlaylistTextWithTimeout(url, timeoutMs = HLS_LANG_PROBE_TIMEOUT_MS) {
  const requestUrl = toHlsProxyUrl(url) || toAbsoluteUrl(url);
  if (!requestUrl) {
    throw new Error("Missing HLS url");
  }
  const controller = new AbortController();
  const timeout = Math.max(1200, Number(timeoutMs || HLS_LANG_PROBE_TIMEOUT_MS));
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(requestUrl, { cache: "no-store", signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Playlist request failed (${response.status})`);
    }
    const body = await response.text();
    return decodeNumericPlaylistText(body);
  } finally {
    clearTimeout(timer);
  }
}

function parseHlsAttributeLine(line) {
  const attrs = {};
  const raw = String(line || "");
  const regex = /([A-Z0-9-]+)=("([^"]*)"|[^,]*)/gi;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    const key = String(match[1] || "").toUpperCase();
    if (!key) {
      continue;
    }
    const value = String(match[3] || match[2] || "")
      .replace(/^\"|\"$/g, "")
      .trim();
    attrs[key] = value;
  }
  return attrs;
}

function inferLanguageFromHlsManifest(manifestText) {
  const lines = String(manifestText || "").split(/\r?\n/);
  let hasFrench = false;
  let hasOther = false;
  for (const rawLine of lines) {
    const line = String(rawLine || "").trim();
    if (!line.startsWith("#EXT-X-MEDIA") || !/TYPE=AUDIO/i.test(line)) {
      continue;
    }
    const attrs = parseHlsAttributeLine(line);
    const samples = [attrs.LANGUAGE, attrs.NAME, attrs["GROUP-ID"]]
      .map((value) => String(value || "").toLowerCase())
      .filter(Boolean);
    samples.forEach((sample) => {
      if (/\bfr\b|french|fran[c\u00e7]ais/.test(sample)) {
        hasFrench = true;
      } else if (sample.trim().length > 0) {
        hasOther = true;
      }
    });
  }
  if (hasFrench && hasOther) {
    return "MULTI";
  }
  if (hasFrench) {
    return "VF";
  }
  if (hasOther) {
    return "VO";
  }
  return "";
}

function getHlsLanguageCacheKey(url) {
  const direct = extractProxyTargetUrl(url) || url;
  return String(direct || "").trim();
}

async function probeHlsSourceLanguage(source) {
  if (!source || isEmbedSource(source)) {
    return "";
  }
  const format = String(source?.format || "").trim().toLowerCase();
  if (format !== "hls" && !/\.m3u8(?:$|\?)/i.test(String(source?.url || ""))) {
    return "";
  }
  const cacheKey = getHlsLanguageCacheKey(source?.url || "");
  if (!cacheKey) {
    return "";
  }
  const now = Date.now();
  const cached = hlsLanguageProbeCache.get(cacheKey);
  if (cached && Number(cached.expiresAt || 0) > now) {
    return String(cached.value || "");
  }

  let inferred = "";
  try {
    const manifest = await fetchDecodedHlsPlaylistTextWithTimeout(cacheKey, HLS_LANG_PROBE_TIMEOUT_MS);
    inferred = inferLanguageFromHlsManifest(manifest);
  } catch {
    inferred = "";
  }

  const ttl = inferred ? HLS_LANG_PROBE_CACHE_MS : HLS_LANG_PROBE_EMPTY_CACHE_MS;
  hlsLanguageProbeCache.set(cacheKey, {
    value: inferred,
    expiresAt: now + ttl,
  });
  if (hlsLanguageProbeCache.size > 240) {
    const oldest = Array.from(hlsLanguageProbeCache.entries()).sort(
      (left, right) => Number(left?.[1]?.expiresAt || 0) - Number(right?.[1]?.expiresAt || 0)
    );
    oldest.slice(0, hlsLanguageProbeCache.size - 240).forEach(([key]) => hlsLanguageProbeCache.delete(key));
  }
  return inferred;
}

async function buildDecodedHlsBlobUrl(streamUrl) {
  const masterText = await fetchDecodedHlsPlaylistText(streamUrl);
  if (!masterText.includes("#EXTM3U")) {
    return "";
  }

  let finalPlaylistText = masterText;
  let finalBaseUrl = toAbsoluteUrl(streamUrl);

  if (/#EXT-X-STREAM-INF/i.test(masterText)) {
    const variantUrl = pickFirstHlsVariantUrl(masterText, finalBaseUrl);
    if (variantUrl) {
      const variantText = await fetchDecodedHlsPlaylistText(variantUrl);
      if (variantText.includes("#EXTM3U")) {
        finalPlaylistText = variantText;
        finalBaseUrl = variantUrl;
      }
    }
  }

  const rewritten = rewritePlaylistTextForClient(finalPlaylistText, finalBaseUrl);
  if (!rewritten.includes("#EXTM3U")) {
    return "";
  }
  const blob = new Blob([rewritten], { type: HLS_MIME });
  const blobUrl = URL.createObjectURL(blob);
  registerHlsPlaylistBlob(blobUrl);
  return blobUrl;
}

async function resolveHlsMediaPlaylist(streamUrl) {
  const masterText = await fetchDecodedHlsPlaylistText(streamUrl);
  if (!masterText.includes("#EXTM3U")) {
    throw new Error("Invalid HLS manifest");
  }

  let mediaText = masterText;
  let mediaBase = toAbsoluteUrl(streamUrl);

  if (/#EXT-X-STREAM-INF/i.test(masterText)) {
    const variantUrl = pickFirstHlsVariantUrl(masterText, mediaBase);
    if (variantUrl) {
      const variantText = await fetchDecodedHlsPlaylistText(variantUrl);
      if (variantText.includes("#EXTM3U")) {
        mediaText = variantText;
        mediaBase = variantUrl;
      }
    }
  }

  return {
    mediaText,
    mediaBase,
  };
}

function extractTsSegmentUrlsFromPlaylist(playlistText, baseUrl) {
  const originBase = extractProxyTargetUrl(baseUrl) || baseUrl;
  const lines = String(playlistText || "").split(/\r?\n/);
  const urls = [];
  for (const line of lines) {
    const trimmed = String(line || "").trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const absolute = toAbsoluteUrl(trimmed, originBase);
    if (!absolute || /\.m3u8(?:$|\?)/i.test(absolute)) {
      continue;
    }
    const direct = extractProxyTargetUrl(absolute) || absolute;
    if (!/^https?:\/\//i.test(direct)) {
      continue;
    }
    if (!/\.(ts|m4s|mp4)(?:$|\?)/i.test(direct)) {
      continue;
    }
    urls.push(direct);
    if (urls.length >= SEGMENT_FALLBACK_MAX_SEGMENTS) {
      break;
    }
  }
  return Array.from(new Set(urls));
}

function getSourceDedupKey(source) {
  if (!source) {
    return "";
  }
  return canonicalizeSourceUrl(source.url);
}

function buildPlayableSourceCandidates(source, options = {}) {
  const raw = String(source?.url || "").trim();
  if (!raw) {
    return [];
  }

  let absolute = raw;
  try {
    absolute = new URL(raw, window.location.href).href;
  } catch {
    absolute = raw;
  }

  if (isEmbedSource(source, absolute)) {
    return [absolute];
  }

  const candidates = [];
  const isProxied = /\/api\/hls-proxy\?url=/i.test(absolute);
  const isRemoteHttp = /^https?:\/\//i.test(absolute);
  const looksLikeHls = source?.format === "hls" || /m3u8/i.test(absolute);
  const normalizedProxyAbsolute = toAbsoluteUrl(toHlsProxyUrl(absolute) || absolute);
  const proxyUrl = !isProxied && isRemoteHttp ? `${API_BASE}/hls-proxy?url=${encodeURIComponent(absolute)}` : "";
  const proxiedTarget = isProxied ? extractProxyTargetUrl(absolute) : "";
  const forceProxyHls = Boolean(options.forceProxyHls);

  if (looksLikeHls && forceProxyHls) {
    if (isProxied) {
      const fallbackRows = [normalizedProxyAbsolute];
      if (proxiedTarget) {
        fallbackRows.push(proxiedTarget);
      }
      return Array.from(new Set(fallbackRows.filter(Boolean)));
    }
    if (proxyUrl) {
      return Array.from(new Set([proxyUrl, absolute].filter(Boolean)));
    }
    return Array.from(new Set([absolute].filter(Boolean)));
  }

  if (looksLikeHls && isProxied) {
    if (options.preferDirectHls && proxiedTarget) {
      candidates.push(proxiedTarget, normalizedProxyAbsolute);
    } else {
      candidates.push(normalizedProxyAbsolute);
      if (proxiedTarget) {
        candidates.push(proxiedTarget);
      }
    }
    return Array.from(new Set(candidates.filter(Boolean)));
  }

  if (looksLikeHls && options.preferDirectHls) {
    candidates.push(absolute);
    if (proxyUrl) {
      candidates.push(proxyUrl);
    }
    return Array.from(new Set(candidates.filter(Boolean)));
  }

  if (proxyUrl && looksLikeHls) {
    candidates.push(proxyUrl);
  }
  candidates.push(absolute);
  if (!looksLikeHls && proxyUrl) {
    // Non-HLS URLs usually play faster direct.
    candidates.unshift(absolute);
  }

  return Array.from(new Set(candidates.filter(Boolean)));
}

function shouldPreferProxyFirstForHls(video, source) {
  if (!shouldUseNativeHls(video)) {
    return false;
  }
  if (isLikelyMobileDevice()) {
    const absolute = toAbsoluteUrl(source?.url || "");
    const target = extractProxyTargetUrl(absolute) || absolute;
    if (source?.isZenix) {
      return true;
    }
    try {
      const targetHost = String(new URL(target).hostname || "")
        .trim()
        .toLowerCase()
        .replace(/^www\./, "");
      if (!targetHost) {
        return false;
      }
      if (/xalaflix|fastflux|fsvid|fsvideo|fembed|dood|uqload|uptostream|vidoza|netu|sibnet/.test(targetHost)) {
        return true;
      }
    } catch {
      return false;
    }
    // Default: prefer direct HLS first on iPhone/iPad.
    return false;
  }
  const absolute = toAbsoluteUrl(source?.url || "");
  if (!absolute) {
    return false;
  }
  const target = extractProxyTargetUrl(absolute) || absolute;
  try {
    const targetHost = String(new URL(target).hostname || "")
      .trim()
      .toLowerCase()
      .replace(/^www\./, "");
    const currentHost = String(window.location.hostname || "")
      .trim()
      .toLowerCase()
      .replace(/^www\./, "");
    if (!targetHost || !currentHost) {
      return false;
    }
    return targetHost !== currentHost;
  } catch {
    return false;
  }
}

async function startPlayerSource(source, resumeTime, token) {
  const video = refs.playerVideo;
  const mobilePlayback = isLikelyMobileDevice();
  const forceProxyHls = shouldPreferProxyFirstForHls(video, source);
  const preferDirectHls = shouldUseNativeHls(video) && !forceProxyHls;
  const streamCandidates = buildPlayableSourceCandidates(source, {
    // Native Safari/iOS often needs local relay for remote hosts with unstable playlists.
    preferDirectHls,
    forceProxyHls,
  });
  if (streamCandidates.length === 0) {
    throw new Error("Missing source URL");
  }

  const loadTicket = ++state.sourceLoadTicket;
  state.sourceLoading = true;
  state.sourceLoadingSince = Date.now();
  setPlayerLoading(true, "Chargement de la source...");
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
  const embedReadyTimeout = mobilePlayback ? Math.min(EMBED_READY_TIMEOUT_MS, MOBILE_EMBED_READY_TIMEOUT_MS) : EMBED_READY_TIMEOUT_MS;
  const directReadyTimeout = mobilePlayback ? Math.min(VIDEO_READY_TIMEOUT_MS, MOBILE_VIDEO_READY_TIMEOUT_MS) : VIDEO_READY_TIMEOUT_MS;
  const bootstrapTimeout = mobilePlayback ? MOBILE_PLAYBACK_BOOTSTRAP_TIMEOUT_MS : 4200;

  let lastError = null;
  let sourceStarted = false;
  try {
    for (const streamUrl of streamCandidates) {
      const useEmbed = isEmbedSource(source, streamUrl);
      const useHls = source?.format === "hls" || /m3u8/i.test(streamUrl);
      setPlayerLoading(
        true,
        useEmbed ? "Chargement du lecteur integre..." : useHls ? "Chargement du flux video..." : "Preparation du flux video..."
      );
      try {
        teardownPlayerEngine(video);
        if (useEmbed) {
          markEmbedLoadStart(source, streamUrl);
          setPlayerStatus("Chargement source integree...");
          await showPlayerEmbedFrame(streamUrl, {
            token,
            timeoutMs: embedReadyTimeout,
          });
          markEmbedLoadSuccess();
          setPlayerStatus("Lecture en cours.");
          setPlayerLoading(false);
        } else if (useHls) {
          resetPlayerEmbedFrame();
          video.hidden = false;
          video.controls = true;
          video.preload = "auto";
          await startHlsPlayback(video, streamUrl, token);
        } else {
          resetPlayerEmbedFrame();
          video.hidden = false;
          video.controls = true;
          video.preload = "auto";
          if (source?.format === "dash" && !video.canPlayType(DASH_MIME)) {
            throw new Error("DASH not supported");
          }
          video.src = streamUrl;
          video.load();
          await waitVideoReady(video, directReadyTimeout);
        }

        if (token !== state.playToken) {
          return;
        }

        if (!useEmbed && video.error && Number(video.error.code || 0) > 0) {
          throw new Error(`Video error code ${Number(video.error.code || 0)}`);
        }

        if (!useEmbed && resumeTime > 5 && Number.isFinite(video.duration) && resumeTime < video.duration - 8) {
          video.currentTime = resumeTime;
        }

        if (!useEmbed) {
          try {
            await video.play();
            clearAwaitingUserPlay();
            const forcedFrenchAudio = preferFrenchAudioTrack(video);
            updateActiveSourceLanguageFromPlayback(video);
            setPlayerStatus(forcedFrenchAudio ? "Lecture en cours (audio FR)." : "Lecture en cours.");
          } catch (playError) {
            if (isUnplayablePlayError(playError)) {
              throw playError;
            }
            let mutedRecovery = false;
            if (!video.muted) {
              try {
                video.muted = true;
                await video.play();
                mutedRecovery = true;
                preferFrenchAudioTrack(video);
                updateActiveSourceLanguageFromPlayback(video);
                clearAwaitingUserPlay();
                setPlayerStatus("Lecture en cours (mode muet).");
                showToast("Lecture demarree en mode muet. Active le son si besoin.");
              } catch (mutedError) {
                video.muted = false;
                if (isUnplayablePlayError(mutedError)) {
                  throw mutedError;
                }
              }
            }
            if (!mutedRecovery) {
              markAwaitingUserPlay(60000);
              setPlayerStatus("Clique sur Play dans le lecteur pour demarrer.");
            }
          }
          await waitForPlaybackBootstrap(video, token, bootstrapTimeout);
          preferFrenchAudioTrack(video);
          updateActiveSourceLanguageFromPlayback(video);
          setPlayerLoading(false);
        }
        sourceStarted = true;
        state.ignoreVideoErrorUntil = 0;
        markSourceHostResult(source?.host, true);
        if (!useEmbed) {
          schedulePlaybackHealthMonitor(token, 0);
        }
        return;
      } catch (error) {
        lastError = error;
      }
    }
  } finally {
    if (loadTicket === state.sourceLoadTicket) {
      state.sourceLoading = false;
      state.sourceLoadingSince = 0;
    }
    if (!sourceStarted) {
      setPlayerLoading(false);
    }
  }

  if (!sourceStarted) {
    markSourceHostResult(source?.host, false);
  }

  throw lastError || new Error("No playable stream candidate");
}

async function waitForPlaybackBootstrap(video, token, timeoutMs = 4200) {
  const mobileBootstrap = isLikelyMobileDevice();
  const effectiveTimeout = mobileBootstrap
    ? Math.min(
        Math.max(1400, Number(timeoutMs || MOBILE_PLAYBACK_BOOTSTRAP_TIMEOUT_MS)),
        MOBILE_PLAYBACK_BOOTSTRAP_TIMEOUT_MS
      )
    : Math.max(1200, Number(timeoutMs || 0));
  const deadline = Date.now() + effectiveTimeout;
  while (Date.now() < deadline) {
    if (token !== state.playToken) {
      return;
    }
    const errorCode = Number(video?.error?.code || 0);
    if (errorCode > 0) {
      throw new Error(`Video error code ${errorCode}`);
    }
    const currentTime = Number(video?.currentTime || 0);
    const readyState = Number(video?.readyState || 0);
    if (currentTime > 0.18 || (!video?.paused && readyState >= 2 && currentTime > 0)) {
      return;
    }
    await wait(220);
  }

  if (token !== state.playToken) {
    return;
  }
  const errorCode = Number(video?.error?.code || 0);
  if (errorCode > 0) {
    throw new Error(`Video error code ${errorCode}`);
  }
  const currentTime = Number(video?.currentTime || 0);
  const readyState = Number(video?.readyState || 0);
  const networkState = Number(video?.networkState || 0);
  const paused = Boolean(video?.paused);
  if (currentTime <= 0.18 && paused && readyState <= 1 && (networkState === 2 || networkState === 3 || networkState === 0)) {
    throw new Error("Source stalled at bootstrap");
  }
  if (currentTime <= 0.18 && paused && readyState >= 2) {
    markAwaitingUserPlay(60000);
    return;
  }
}

function shouldUseNativeHls(video) {
  if (!video || typeof video.canPlayType !== "function") {
    return false;
  }

  const ua = String(navigator.userAgent || "");
  const isIOS =
    /iP(hone|od|ad)/i.test(ua) ||
    (navigator.platform === "MacIntel" && Number(navigator.maxTouchPoints || 0) > 1);
  if (isIOS) {
    // iOS Safari natively supports HLS even when canPlayType can be inconsistent.
    return true;
  }
  const canPlayHls = Boolean(video.canPlayType(HLS_MIME) || video.canPlayType("application/x-mpegURL"));
  if (!canPlayHls) {
    return false;
  }
  const isAppleWebkit = /AppleWebKit/i.test(ua);
  const isDesktopSafari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/i.test(ua);
  return isIOS || (isDesktopSafari && isAppleWebkit);
}

function preferFrenchAudioTrack(video) {
  const tracks = video?.audioTracks;
  if (!tracks || typeof tracks.length !== "number" || tracks.length <= 0) {
    return false;
  }

  let frenchTrackIndex = -1;
  for (let index = 0; index < tracks.length; index += 1) {
    const track = tracks[index];
    if (!track) {
      continue;
    }
    const sample = [track.language, track.label, track.name]
      .map((entry) => String(entry || "").toLowerCase())
      .join(" ");
    if (/\bfr\b|french|fran[cç]ais/.test(sample)) {
      frenchTrackIndex = index;
      break;
    }
  }

  if (frenchTrackIndex < 0) {
    return false;
  }

  let applied = false;
  for (let index = 0; index < tracks.length; index += 1) {
    const track = tracks[index];
    if (!track || typeof track.enabled === "undefined") {
      continue;
    }
    try {
      track.enabled = index === frenchTrackIndex;
      if (index === frenchTrackIndex && track.enabled) {
        applied = true;
      }
    } catch {
      // Ignore read-only track toggles.
    }
  }
  return applied;
}

function inferLanguageFromAudioTracks(video) {
  const tracks = video?.audioTracks;
  if (!tracks || typeof tracks.length !== "number" || tracks.length <= 0) {
    return "";
  }
  let hasFrench = false;
  let hasNonFrench = false;
  for (let index = 0; index < tracks.length; index += 1) {
    const track = tracks[index];
    if (!track) {
      continue;
    }
    const sample = [track.language, track.label, track.name]
      .map((entry) => String(entry || "").toLowerCase())
      .join(" ");
    if (/\bfr\b|french|fran[cç]ais/.test(sample)) {
      hasFrench = true;
    } else if (sample.trim().length > 0) {
      hasNonFrench = true;
    }
  }
  if (hasFrench && hasNonFrench) {
    return "MULTI";
  }
  if (hasFrench) {
    return "VF";
  }
  if (hasNonFrench) {
    return "VO";
  }
  return "";
}

function updateActiveSourceLanguageFromPlayback(video = refs.playerVideo) {
  const activeIndex = Number(state.sourceIndex || -1);
  if (activeIndex < 0 || activeIndex >= state.sourcePool.length) {
    return;
  }
  const activeSource = state.sourcePool[activeIndex];
  if (!activeSource || isEmbedSource(activeSource)) {
    return;
  }
  const inferred = inferLanguageFromAudioTracks(video);
  if (!inferred) {
    return;
  }
  const current = String(activeSource.language || "").trim().toUpperCase();
  if (current === inferred) {
    return;
  }
  const canUpdate =
    !current ||
    (current === "VOSTFR" && (inferred === "VF" || inferred === "MULTI")) ||
    (current === "VO" && (inferred === "VF" || inferred === "MULTI")) ||
    (current === "VF" && inferred === "MULTI");
  if (!canUpdate) {
    return;
  }

  activeSource.language = inferred;
  activeSource.score = getSourceScore(
    String(activeSource.format || ""),
    String(activeSource.quality || ""),
    inferred,
    activeIndex,
    String(activeSource.host || "")
  );
  renderPlayerSourceOptions();
  if (refs.playerSourceMeta) {
    refs.playerSourceMeta.textContent = formatSourceLabel(activeSource, activeIndex, state.sourcePool.length || 1);
  }
  setPlayerPill(refs.playerLanguagePill, inferred);
}

function canAttemptHlsPlayback(video) {
  if (shouldUseNativeHls(video)) {
    return true;
  }
  if (typeof window.MediaSource !== "undefined" && window.MediaSource) {
    return true;
  }
  if (window.Hls && typeof window.Hls.isSupported === "function") {
    try {
      return Boolean(window.Hls.isSupported());
    } catch {
      return false;
    }
  }
  return false;
}

async function tryDecodedHlsBlobPlayback(video, streamUrl, timeoutMs = HLS_READY_TIMEOUT_MS + 2600) {
  const blobUrl = await buildDecodedHlsBlobUrl(streamUrl);
  if (!blobUrl) {
    throw new Error("Decoded HLS playlist unavailable");
  }
  video.src = blobUrl;
  video.load();
  await waitVideoReady(video, timeoutMs);
}

async function loadSegmentFallbackIndex(video, session, index) {
  if (!session || !Array.isArray(session.segments)) {
    throw new Error("Segment fallback unavailable");
  }
  const nextUrl = String(session.segments[index] || "").trim();
  if (!nextUrl) {
    throw new Error("Missing fallback segment");
  }
  video.src = nextUrl;
  video.load();
  const bootstrapTimeout = index <= 0 ? IOS_SEGMENT_BOOT_TIMEOUT_MS : IOS_SEGMENT_NEXT_TIMEOUT_MS;
  await waitVideoReady(video, Math.min(VIDEO_READY_TIMEOUT_MS, bootstrapTimeout));
  await video.play();
}

async function startTsSegmentFallbackPlayback(video, streamUrl, token) {
  if (!shouldUseNativeHls(video) || !isLikelyMobileDevice()) {
    return false;
  }

  const { mediaText, mediaBase } = await resolveHlsMediaPlaylist(streamUrl);
  const segments = extractTsSegmentUrlsFromPlaylist(mediaText, mediaBase);
  if (segments.length < 2) {
    return false;
  }

  clearSegmentFallbackSession();
  const session = {
    token,
    segments,
    index: 0,
    switching: false,
    onEnded: null,
    onError: null,
  };

  session.onEnded = () => {
    if (state.segmentFallback !== session || session.switching) {
      return;
    }
    if (session.token !== state.playToken) {
      clearSegmentFallbackSession();
      return;
    }
    const nextIndex = session.index + 1;
    if (nextIndex >= session.segments.length) {
      clearSegmentFallbackSession();
      onPlayerEnded();
      return;
    }

    const activeSourceIndex = Number(state.sourceIndex);
    const hasAlternativeSource =
      !isManualSourceLockActive() &&
      Number.isInteger(activeSourceIndex) &&
      activeSourceIndex >= 0 &&
      getFallbackSourceIndex(activeSourceIndex) >= 0;
    if (nextIndex >= IOS_SEGMENT_CHAIN_MAX && hasAlternativeSource) {
      clearSegmentFallbackSession();
      setPlayerStatus("Bascule source apres fallback iOS...");
      trySwitchToNextSource().catch(() => {
        setPlayerStatus("Erreur video detectee. Choisis une autre source.", true);
      });
      return;
    }

    session.switching = true;
    setPlayerStatus(`Lecture segment ${nextIndex + 1}/${session.segments.length}...`);
    loadSegmentFallbackIndex(video, session, nextIndex)
      .then(() => {
        if (state.segmentFallback !== session) {
          return;
        }
        session.index = nextIndex;
        session.switching = false;
        setPlayerStatus("Lecture en cours.");
      })
      .catch(() => {
        session.switching = false;
        clearSegmentFallbackSession();
        trySwitchToNextSource().catch(() => {
          setPlayerStatus("Erreur video detectee. Choisis une autre source.", true);
        });
      });
  };

  session.onError = () => {
    if (state.segmentFallback !== session || session.switching || shouldIgnoreVideoErrorFallback()) {
      return;
    }
    const code = Number(video?.error?.code || 0);
    if (code <= 0) {
      return;
    }
    const nextIndex = session.index + 1;
    if (nextIndex < session.segments.length) {
      session.onEnded();
      return;
    }
    clearSegmentFallbackSession();
    trySwitchToNextSource().catch(() => {
      setPlayerStatus("Erreur video detectee. Choisis une autre source.", true);
    });
  };

  state.segmentFallback = session;
  video.addEventListener("ended", session.onEnded);
  video.addEventListener("error", session.onError);
  setPlayerStatus("Fallback iOS actif...");
  try {
    await loadSegmentFallbackIndex(video, session, 0);
  } catch (error) {
    clearSegmentFallbackSession();
    throw error;
  }
  return true;
}

async function startHlsPlayback(video, streamUrl, token) {
  if (shouldUseNativeHls(video)) {
    const isIOSMobile = isLikelyMobileDevice();
    video.src = streamUrl;
    video.load();
    let nativeError = null;
    try {
      const nativeTimeout = isIOSMobile
        ? Math.min(HLS_READY_TIMEOUT_MS, IOS_NATIVE_HLS_BOOT_TIMEOUT_MS)
        : Math.min(HLS_READY_TIMEOUT_MS, 5200);
      await waitVideoReady(video, nativeTimeout);
      return;
    } catch (error) {
      nativeError = error;

      if (isIOSMobile) {
        try {
          const segmentFallbackStarted = await startTsSegmentFallbackPlayback(video, streamUrl, token);
          if (segmentFallbackStarted) {
            return;
          }
        } catch (segmentError) {
          try {
            await tryDecodedHlsBlobPlayback(
              video,
              streamUrl,
              Math.min(HLS_READY_TIMEOUT_MS + 2600, IOS_DECODED_HLS_BOOT_TIMEOUT_MS)
            );
            return;
          } catch (decodedError) {
            throw decodedError || segmentError || nativeError || new Error("Native HLS bootstrap failed");
          }
        }
      }

      // Retry once with a decoded blob playlist for encoded/quirky upstream manifests.
      // This is especially useful on Safari when native HLS rejects rewritten proxy URLs.
      try {
        await tryDecodedHlsBlobPlayback(video, streamUrl, Math.min(HLS_READY_TIMEOUT_MS + 2600, 7600));
        return;
      } catch (decodedError) {
        try {
          const segmentFallbackStarted = await startTsSegmentFallbackPlayback(video, streamUrl, token);
          if (segmentFallbackStarted) {
            return;
          }
        } catch {
          // Keep original bootstrap error below.
        }
        throw decodedError || nativeError || new Error("Native HLS bootstrap failed");
      }
    }
  }

  const Hls = await loadHlsLibrary();
  if (!Hls || !Hls.isSupported()) {
    if (video.canPlayType(HLS_MIME)) {
      try {
        video.src = streamUrl;
        video.load();
        await waitVideoReady(video, HLS_READY_TIMEOUT_MS);
        return;
      } catch {
        await tryDecodedHlsBlobPlayback(video, streamUrl);
        return;
      }
    }
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
  clearPlaybackHealthMonitor();
  clearSegmentFallbackSession();
  resetPlayerEmbedFrame();
  clearHlsPlaylistBlobs();
  destroyHlsInstance();
  video.hidden = false;
  video.controls = true;
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

function setPlayerLoading(active, message = "") {
  if (!refs.playerLoadingIndicator) {
    return;
  }
  const canShow = Boolean(active) && Boolean(refs.playerOverlay) && !refs.playerOverlay.hidden;
  refs.playerLoadingIndicator.hidden = !canShow;
  if (refs.playerLoadingText) {
    const safe = String(message || "").trim();
    refs.playerLoadingText.textContent = safe || "Chargement du lecteur...";
  }
}

function shouldShowPlayerLoadingFromStatus(message, isError = false) {
  if (isError) {
    return false;
  }
  const text = String(message || "").trim().toLowerCase();
  if (!text) {
    return false;
  }
  if (/lecture en cours|lecture s\d+e\d+|clique sur play/i.test(text)) {
    return false;
  }
  return /preparation|connexion|chargement|actualisation|fallback|resynchronisation|nouvel essai|bascule|segment|secours/i.test(
    text
  );
}

function updatePlayerStepperFromStatus(message, isError = false) {
  if (!refs.playerStepper) {
    return;
  }
  const text = String(message || "").trim().toLowerCase();
  const connectDone = /connexion|chargement|preparation|actualisation|resynchronisation|nouvel essai|source \d+\/\d+|fallback|segment|lecture/.test(
    text
  );
  const fallbackDone = /fallback|bascule|secours|segment|source \d+\/\d+|lecture/.test(text);
  const playDone = /lecture en cours|lecture s\d+e\d+|clique sur play/.test(text) && !isError;

  refs.playerStepper.querySelectorAll("li[data-step]").forEach((row) => {
    const step = String(row.getAttribute("data-step") || "");
    const done =
      (step === "connect" && connectDone) ||
      (step === "fallback" && fallbackDone) ||
      (step === "play" && playDone);
    row.classList.toggle("is-done", done);
    row.classList.toggle("is-error", Boolean(isError) && step === "play");
  });
}

function setPlayerStatus(message, isError = false) {
  const safeMessage = String(message || "");
  if (!refs.playerStatus) {
    return;
  }
  refs.playerStatus.textContent = safeMessage;
  refs.playerStatus.classList.toggle("error", Boolean(isError));
  setPlayerLoading(shouldShowPlayerLoadingFromStatus(safeMessage, isError), safeMessage);
  updatePlayerStepperFromStatus(safeMessage, isError);
}

function closePlayer(options = {}) {
  activatePostCloseTapGuard(1400);
  clearPlaybackGuard();
  clearAwaitingUserPlay();
  refs.playerOverlay.hidden = true;
  refs.playerSeriesControls.hidden = true;
  saveNowPlayingProgress({ force: true });
  teardownPlayerEngine(refs.playerVideo);
  if (refs.playerPanel) {
    refs.playerPanel.style.setProperty("--player-backdrop-image", "none");
    refs.playerPanel.removeAttribute("data-player-type");
  }

  setPlayerLoading(false);
  setPlayerStatus("");
  if (refs.playerSourceMeta) {
    refs.playerSourceMeta.textContent = "";
  }
  setPlayerSubTitle("");
  setPlayerPill(refs.playerTypePill, "Lecture", true);
  setPlayerPill(refs.playerLanguagePill, "Auto");
  setPlayerPill(refs.playerQualityPill, "Qualite auto");
  state.sourcePool = [];
  state.sourceIndex = -1;
  state.sourceLoading = false;
  state.sourceLoadingSince = 0;
  clearManualSourceLock();
  state.allEpisodeSources = [];
  state.availableLanguages = [];
  state.nowPlaying = null;
  updatePlayerNextEpisodeButton();
  renderPlayerSourceOptions();
  populateLanguageSelect(refs.playerLanguageSelect, [], "");
  refs.playerLanguageSelect.disabled = true;
  if (options.syncRoute !== false && !refs.detailModal.hidden && state.selectedDetailId) {
    setAppRoute({ detail: state.selectedDetailId }, { replace: true });
  } else if (options.syncRoute !== false) {
    setAppRoute({}, { replace: true });
  }
  updateBodyScrollLock();
  applyNativeAdPlacement();
  renderContinue();
  if (refs.playerOverlay.hidden && refs.detailModal.hidden) {
    restoreModalScrollPosition();
  }
  flushDeferredDesktopMainNavFit(30);
}

function getExplicitResumeTime(options) {
  if (!options || typeof options !== "object") {
    return null;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "resumeTime")) {
    return null;
  }
  const raw = Number(options.resumeTime || 0);
  if (!Number.isFinite(raw)) {
    return 0;
  }
  return Math.max(0, raw);
}

function getEpisodeProgressKey(season, episode) {
  const safeSeason = Number(season || 0);
  const safeEpisode = Number(episode || 0);
  if (!Number.isFinite(safeSeason) || !Number.isFinite(safeEpisode)) {
    return "";
  }
  return `S${Math.max(1, Math.round(safeSeason))}E${Math.max(1, Math.round(safeEpisode))}`;
}

function normalizeEpisodeProgressMap(value) {
  const safe = {};
  if (!value || typeof value !== "object") {
    return safe;
  }
  Object.entries(value).forEach(([key, entry]) => {
    if (!/^S\d+E\d+$/i.test(String(key || ""))) {
      return;
    }
    const time = Number(entry?.time || 0);
    const duration = Number(entry?.duration || 0);
    const lastPlayed = Number(entry?.lastPlayed || 0);
    safe[key] = {
      time: Number.isFinite(time) ? Math.max(0, time) : 0,
      duration: Number.isFinite(duration) ? Math.max(0, duration) : 0,
      lastPlayed: Number.isFinite(lastPlayed) ? Math.max(0, lastPlayed) : 0,
    };
  });
  return safe;
}

function resolveEpisodeResumeTime(progress, season, episode, explicitResume) {
  if (Number.isFinite(explicitResume)) {
    return Math.max(0, explicitResume);
  }
  if (!progress) {
    return 0;
  }
  const key = getEpisodeProgressKey(season, episode);
  if (key) {
    const episodes = normalizeEpisodeProgressMap(progress.episodes);
    const row = episodes[key];
    const time = Number(row?.time || 0);
    if (Number.isFinite(time) && time > 0) {
      return time;
    }
  }
  if (Number(progress.season || 0) === Number(season || 0) && Number(progress.episode || 0) === Number(episode || 0)) {
    const time = Number(progress.time || 0);
    if (Number.isFinite(time) && time > 0) {
      return time;
    }
  }
  return 0;
}

function resolveMovieResumeTime(progress, explicitResume) {
  if (Number.isFinite(explicitResume)) {
    return Math.max(0, explicitResume);
  }
  const time = Number(progress?.time || 0);
  return Number.isFinite(time) ? Math.max(0, time) : 0;
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
  const hasTimeSignal = Number.isFinite(currentTime) && currentTime > 0.2;
  const hasDurationSignal = Number.isFinite(duration) && duration > 0;
  const previous = state.progress[state.nowPlaying.id] || null;
  const nextTime = hasTimeSignal ? Math.max(0, currentTime) : Number(previous?.time || 0);
  const nextDuration = hasDurationSignal ? Math.max(0, duration) : Number(previous?.duration || 0);
  const isSeries = state.nowPlaying.type === "tv";
  const episodes = isSeries ? normalizeEpisodeProgressMap(previous?.episodes) : null;
  const episodeKey = isSeries ? getEpisodeProgressKey(state.nowPlaying.season || 1, state.nowPlaying.episode || 1) : "";

  if (isSeries && episodeKey) {
    const prevEpisode = episodes?.[episodeKey] || null;
    const episodeTime = hasTimeSignal ? Math.max(0, currentTime) : Number(prevEpisode?.time || 0);
    const episodeDuration = hasDurationSignal ? Math.max(0, duration) : Number(prevEpisode?.duration || 0);
    episodes[episodeKey] = {
      time: Number.isFinite(episodeTime) ? Math.max(0, episodeTime) : 0,
      duration: Number.isFinite(episodeDuration) ? Math.max(0, episodeDuration) : 0,
      lastPlayed: now,
    };
  }

  const nextEntry = {
    id: state.nowPlaying.id,
    type: state.nowPlaying.type,
    title: state.nowPlaying.title,
    poster: state.nowPlaying.poster,
    isAnime: Boolean(state.nowPlaying.isAnime),
    language: String(state.nowPlaying.language || ""),
    season: state.nowPlaying.season || 1,
    episode: state.nowPlaying.episode || 1,
    time: Number.isFinite(nextTime) ? Math.max(0, nextTime) : 0,
    duration: Number.isFinite(nextDuration) ? Math.max(0, nextDuration) : 0,
    lastPlayed: now,
  };
  if (isSeries) {
    nextEntry.episodes = episodes || {};
  }
  state.progress[state.nowPlaying.id] = nextEntry;
  saveProgress(state.progress);
  lastProgressSave = now;
  return true;
}

function onPlayerProgress() {
  const currentSource = state.sourcePool[state.sourceIndex] || null;
  if (currentSource && !isEmbedSource(currentSource)) {
    const currentTime = Number(refs.playerVideo?.currentTime || 0);
    const errorCode = Number(refs.playerVideo?.error?.code || 0);
    const paused = Boolean(refs.playerVideo?.paused);
    if (currentTime >= 1.2 && errorCode <= 0 && !paused) {
      markCurrentSourceSuccessful(state.sourceIndex, currentSource);
      rememberSourceSuccess(currentSource, state.nowPlaying?.id || 0);
    }
  }
  saveNowPlayingProgress();
}

function onPlayerEnded() {
  if (state.segmentFallback) {
    return;
  }
  clearPlaybackHealthMonitor();
  if (!state.nowPlaying) {
    return;
  }

  const ended = { ...state.nowPlaying };
  const current = state.progress[state.nowPlaying.id];
  if (current) {
    const now = Date.now();
    current.time = 0;
    current.lastPlayed = now;
    if (ended.type === "tv") {
      const episodes = normalizeEpisodeProgressMap(current.episodes);
      const key = getEpisodeProgressKey(ended.season, ended.episode);
      if (key) {
        const prevEpisode = episodes[key] || {};
        episodes[key] = {
          time: 0,
          duration: Number(prevEpisode.duration || 0),
          lastPlayed: now,
        };
        current.episodes = episodes;
      }
    }
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
    resumeTime: 0,
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
    languageHint: normalizeLanguageLabel(details?.lang || ""),
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

function setSuggestionStatus(message = "", isError = false) {
  if (!refs.suggestionStatus) {
    return;
  }
  refs.suggestionStatus.textContent = String(message || "").trim();
  refs.suggestionStatus.classList.toggle("error", Boolean(isError));
}

function refreshSuggestionClientTimestamp() {
  if (refs.suggestionClientTs) {
    refs.suggestionClientTs.value = String(Date.now());
  }
}

function setSuggestionSubmitting(isSubmitting) {
  state.suggestionSubmitting = Boolean(isSubmitting);
  if (refs.suggestionSubmitBtn) {
    refs.suggestionSubmitBtn.disabled = state.suggestionSubmitting;
    refs.suggestionSubmitBtn.textContent = state.suggestionSubmitting
      ? "Envoi en cours..."
      : "Envoyer la suggestion";
  }
}

function isValidSuggestionEmail(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return true;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
}

async function submitSuggestionFromInfo(event) {
  event.preventDefault();
  if (state.suggestionSubmitting) {
    return;
  }

  const type = String(refs.suggestionType?.value || "improve").trim();
  const title = String(refs.suggestionTitle?.value || "").trim();
  const message = String(refs.suggestionMessage?.value || "").trim();
  const email = String(refs.suggestionContact?.value || "").trim();
  const name = String(refs.suggestionName?.value || "").trim();
  const website = String(refs.suggestionWebsite?.value || "").trim();
  const clientTs = Number(refs.suggestionClientTs?.value || 0);

  if (message.length < 12) {
    setSuggestionStatus("Message trop court (minimum 12 caracteres).", true);
    showToast("Message trop court.", true);
    return;
  }
  if (!isValidSuggestionEmail(email)) {
    setSuggestionStatus("Email invalide.", true);
    showToast("Email invalide.", true);
    return;
  }

  setSuggestionSubmitting(true);
  setSuggestionStatus("Envoi de ta suggestion...");

  try {
    const response = await fetch(`${API_BASE}/suggestions`, {
      method: "POST",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        type,
        title,
        message,
        email,
        name,
        website,
        clientTs,
        page: window.location.pathname,
      }),
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const errorMessage =
        String(payload?.error || "").trim() ||
        (response.status === 429 ? "Trop de demandes. Reessaie dans un instant." : "Envoi indisponible.");
      throw new Error(errorMessage);
    }

    refs.suggestionForm?.reset();
    refreshSuggestionClientTimestamp();
    setSuggestionStatus("Suggestion envoyee.");
    showToast("Suggestion envoyee. Merci !");
  } catch (error) {
    const safeError = String(error?.message || "Envoi impossible pour le moment.");
    setSuggestionStatus(safeError, true);
    showToast(safeError, true);
  } finally {
    if (!refs.suggestionClientTs?.value) {
      refreshSuggestionClientTimestamp();
    }
    setSuggestionSubmitting(false);
  }
}

function parseReleaseDate(value) {
  if (!value) {
    return 0;
  }
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function isRecentlyReleased(item, days = NEW_RELEASE_DAYS) {
  if (getItemAvailabilityStatus(item) === "pending") {
    return false;
  }
  const ts = parseReleaseDate(item?.releaseDate || "");
  if (!ts) {
    return false;
  }
  const now = Date.now();
  if (ts > now) {
    return false;
  }
  const limit = Math.max(1, Number(days || NEW_RELEASE_DAYS)) * 24 * 60 * 60 * 1000;
  return now - ts <= limit;
}

function isComingSoon(item) {
  if (getItemAvailabilityStatus(item) === "pending") {
    return false;
  }
  const ts = parseReleaseDate(item?.releaseDate || "");
  if (!ts) {
    return false;
  }
  return ts > Date.now();
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
  if (isLikelyMobileDevice()) {
    refs.toast.hidden = true;
    return;
  }

  refs.toast.textContent = message;
  refs.toast.className = `toast${isError ? " error" : ""}`;
  refs.toast.style.setProperty("top", "auto", "important");
  refs.toast.style.setProperty("left", "auto", "important");
  refs.toast.style.setProperty("right", "16px", "important");
  refs.toast.style.setProperty("bottom", "16px", "important");
  refs.toast.hidden = false;

  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    refs.toast.hidden = true;
  }, 2000);
}

function notifyActionMessage(message, isError = false) {
  if (isLikelyMobileDevice()) {
    if (refs.syncInfo) {
      refs.syncInfo.textContent = message;
    }
    return;
  }
  showToast(message, isError);
}

function getImageLoadingTargets(img) {
  if (!(img instanceof HTMLImageElement)) {
    return [];
  }
  const targets = [img];
  const thumb = img.closest(".media-thumb, .top-thumb, .calendar-media-thumb, .trending-card");
  if (thumb instanceof HTMLElement) {
    targets.push(thumb);
  }
  if (img.id === "heroArt" && refs.heroSection instanceof HTMLElement) {
    targets.push(refs.heroSection);
  }
  if (img.classList.contains("detail-poster") && refs.detailPanel instanceof HTMLElement) {
    targets.push(refs.detailPanel);
  }
  return targets;
}

function setImageLoadingState(img, loading) {
  if (!(img instanceof HTMLImageElement)) {
    return;
  }
  img.dataset.imageReady = loading ? "0" : "1";
  getImageLoadingTargets(img).forEach((target) => {
    target.classList.toggle("is-loading", Boolean(loading));
  });
}

function onImageLoaded(event) {
  const img = event.currentTarget;
  if (!(img instanceof HTMLImageElement)) {
    return;
  }
  setImageLoadingState(img, false);
}

function wireImageFallback(img, title, landscape = false) {
  if (!img) {
    return;
  }

  setImageLoadingState(img, true);
  const fallback = buildImagePlaceholder(title, landscape);
  img.dataset.fallbackSrc = fallback;
  if (!img.getAttribute("src")) {
    img.src = fallback;
  }

  if (img.dataset.fallbackBound !== "1") {
    img.dataset.fallbackBound = "1";
    img.addEventListener("load", onImageLoaded);
    img.addEventListener("error", onImageFallbackError);
  }

  if (img.complete && Number(img.naturalWidth || 0) > 0) {
    setImageLoadingState(img, false);
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
    setTimeout(() => {
      setImageLoadingState(img, false);
    }, 120);
    return;
  }
  setImageLoadingState(img, false);
}

function normalizeRatingValue(value) {
  const numeric = Number(value || 0);
  if (numeric > 0) {
    return 1;
  }
  if (numeric < 0) {
    return -1;
  }
  return 0;
}

function getUserRating(id) {
  const mediaId = Number(id || 0);
  if (mediaId <= 0) {
    return 0;
  }
  const row = state.ratings?.[mediaId];
  return normalizeRatingValue(row?.value || row);
}

function setUserRating(id, value, options = {}) {
  const mediaId = Number(id || 0);
  if (mediaId <= 0) {
    return false;
  }
  const normalized = normalizeRatingValue(value);
  const current = getUserRating(mediaId);
  if (normalized === current) {
    return false;
  }

  if (normalized === 0) {
    delete state.ratings[mediaId];
  } else {
    const item = findItemById(mediaId);
    state.ratings[mediaId] = {
      id: mediaId,
      value: normalized,
      type: item?.type === "tv" ? "tv" : "movie",
      isAnime: Boolean(item?.isAnime),
      title: String(item?.title || ""),
      updatedAt: Date.now(),
    };
  }
  saveRatings(state.ratings);
  if (state.selectedDetailId === mediaId) {
    updateDetailRatingButtons(mediaId);
  }
  if (options.render !== false) {
    renderAll();
  }
  return true;
}

function toggleLike(id) {
  const mediaId = Number(id || 0);
  if (mediaId <= 0) {
    return;
  }
  const current = getUserRating(mediaId);
  if (current === 1) {
    setUserRating(mediaId, 0, { render: true });
    showToast("Like retire.");
    return;
  }
  setUserRating(mediaId, 1, { render: true });
  showToast("Like enregistre.");
}

function toggleDislike(id) {
  const mediaId = Number(id || 0);
  if (mediaId <= 0) {
    return;
  }
  const current = getUserRating(mediaId);
  if (current === -1) {
    setUserRating(mediaId, 0, { render: true });
    showToast("Dislike retire.");
    return;
  }
  setUserRating(mediaId, -1, { render: true });
  showToast("Dislike enregistre.");
}

function updateDetailRatingButtons(id) {
  if (!refs.detailLikeBtn || !refs.detailDislikeBtn) {
    return;
  }
  const rating = getUserRating(id);
  const likeActive = rating === 1;
  const dislikeActive = rating === -1;
  refs.detailLikeBtn.classList.toggle("is-positive", likeActive);
  refs.detailLikeBtn.classList.toggle("is-active", false);
  refs.detailLikeBtn.classList.toggle("is-negative", false);
  refs.detailDislikeBtn.classList.toggle("is-negative", dislikeActive);
  refs.detailDislikeBtn.classList.toggle("is-active", false);
  refs.detailDislikeBtn.classList.toggle("is-positive", false);
  setButtonTextPreserveIcon(refs.detailLikeBtn, "Like");
  setButtonTextPreserveIcon(refs.detailDislikeBtn, "Dislike");
}

function setButtonTextPreserveIcon(button, label) {
  if (!(button instanceof HTMLElement)) {
    return;
  }
  const safeLabel = String(label || "").trim();
  const textNode = button.querySelector(".btn-label");
  if (textNode instanceof HTMLElement) {
    textNode.textContent = safeLabel;
  } else {
    button.textContent = safeLabel;
  }
  if (safeLabel) {
    button.setAttribute("aria-label", safeLabel);
  }
}

function normalizeThemeToken(value) {
  return normalizeTitleKey(value).slice(0, 80);
}

function splitNormalizedTokens(value) {
  return normalizeTitleKey(value)
    .split(" ")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length >= 3);
}

function getItemTypeBucket(item) {
  if (!item) {
    return "movie";
  }
  if (item.isAnime) {
    return "anime";
  }
  return item.type === "tv" ? "tv" : "movie";
}

function getItemThemeTokens(item) {
  const tokens = new Set();
  if (!item) {
    return tokens;
  }

  const typeBucket = getItemTypeBucket(item);
  if (typeBucket === "anime") {
    tokens.add("anime");
  } else if (typeBucket === "tv") {
    tokens.add("serie");
  } else {
    tokens.add("film");
  }

  const details = state.detailsCache.get(Number(item.id || 0));
  const categories = Array.isArray(details?.categories)
    ? details.categories
    : Array.isArray(item?.categories)
      ? item.categories
      : Array.isArray(item?.genres)
        ? item.genres
        : [];
  categories.forEach((category) => {
    const name = normalizeThemeToken(category?.name || "");
    if (!name) {
      return;
    }
    tokens.add(name);
    splitNormalizedTokens(name).forEach((token) => {
      tokens.add(token);
    });
  });

  const genreHints = [
    item?.genre,
    item?.genres,
  ]
    .flat()
    .filter(Boolean)
    .map((value) => (typeof value === "string" ? value : value?.name || value?.label || ""))
    .filter(Boolean);
  genreHints.forEach((hint) => {
    const normalized = normalizeThemeToken(hint);
    if (!normalized) {
      return;
    }
    tokens.add(normalized);
    splitNormalizedTokens(normalized).forEach((token) => tokens.add(token));
  });
  return tokens;
}

function getSearchSignalRows(limit = INTEREST_QUERY_MAX) {
  const now = Date.now();
  const rows = Object.entries(state.searchSignals || {})
    .map(([key, value]) => {
      const normalizedKey = normalizeTitleKey(key);
      const count = Number(value?.count || 0);
      const lastAt = Number(value?.lastAt || 0);
      const age = Math.max(0, now - lastAt);
      const decay = Math.exp(-age / (45 * 24 * 60 * 60 * 1000));
      const score = Math.max(0, count) * decay;
      return {
        key: normalizedKey,
        count,
        lastAt,
        score,
        rawQuery: String(value?.query || key || "").trim(),
        tokens: splitNormalizedTokens(normalizedKey),
      };
    })
    .filter((entry) => entry.key.length >= 2 && entry.score > 0.05)
    .sort((left, right) => right.score - left.score);
  return rows.slice(0, Math.max(1, Number(limit || INTEREST_QUERY_MAX)));
}

function buildInterestProfile() {
  const typeWeights = {
    movie: 0,
    tv: 0,
    anime: 0,
  };
  const themeWeights = new Map();
  const titleTokenWeights = new Map();
  const likedIds = new Set();
  const dislikedIds = new Set();
  let hasSignals = false;

  const addTypeWeight = (item, weight) => {
    if (!item || !Number.isFinite(weight) || weight === 0) {
      return;
    }
    const key = getItemTypeBucket(item);
    typeWeights[key] = Number(typeWeights[key] || 0) + weight;
  };

  const addThemeWeight = (item, weight) => {
    if (!item || !Number.isFinite(weight) || weight === 0) {
      return;
    }
    const tokens = getItemThemeTokens(item);
    tokens.forEach((token) => {
      const safe = normalizeThemeToken(token);
      if (!safe) {
        return;
      }
      themeWeights.set(safe, Number(themeWeights.get(safe) || 0) + weight);
    });
  };

  const ratingRows = Object.entries(state.ratings || {}).slice(0, INTEREST_SEED_MAX * 2);
  ratingRows.forEach(([idRaw, row]) => {
    const id = Number(idRaw || 0);
    if (id <= 0) {
      return;
    }
    const rating = normalizeRatingValue(row?.value || row);
    if (rating === 0) {
      return;
    }
    hasSignals = true;
    const item = findItemById(id);
    if (rating > 0) {
      likedIds.add(id);
      addTypeWeight(item, 4.2);
      addThemeWeight(item, 4.6);
    } else {
      dislikedIds.add(id);
      addTypeWeight(item, -3.1);
      addThemeWeight(item, -5.2);
    }
  });

  const progressRows = Object.values(state.progress || {})
    .sort((left, right) => Number(right?.lastPlayed || 0) - Number(left?.lastPlayed || 0))
    .slice(0, INTEREST_SEED_MAX);
  progressRows.forEach((row, index) => {
    const id = Number(row?.id || 0);
    if (id <= 0) {
      return;
    }
    const item = findItemById(id);
    if (!item) {
      return;
    }
    hasSignals = true;
    const recencyAge = Math.max(0, Date.now() - Number(row?.lastPlayed || 0));
    const recencyBoost = Math.exp(-recencyAge / (35 * 24 * 60 * 60 * 1000));
    const duration = Number(row?.duration || 0);
    const time = Number(row?.time || 0);
    const completion = duration > 0 ? Math.max(0, Math.min(1, time / duration)) : Math.min(1, time / 3600);
    const positionPenalty = Math.max(0, 1 - index / INTEREST_SEED_MAX);
    const weight = 0.9 + recencyBoost * 1.8 + completion * 1.2 + positionPenalty * 0.8;
    addTypeWeight(item, weight);
    addThemeWeight(item, weight * 1.25);
  });

  Object.keys(state.favorites || {})
    .map((entry) => Number(entry))
    .filter((id) => id > 0)
    .slice(0, INTEREST_SEED_MAX)
    .forEach((id) => {
      const item = findItemById(id);
      if (!item) {
        return;
      }
      hasSignals = true;
      addTypeWeight(item, 0.9);
      addThemeWeight(item, 1.1);
    });

  const searchRows = getSearchSignalRows(INTEREST_QUERY_MAX);
  if (searchRows.length > 0) {
    hasSignals = true;
  }
  const genreHints = [
    { key: "action", tags: ["action", "combat", "guerre"] },
    { key: "horreur", tags: ["horreur", "horror", "epouvante"] },
    { key: "comedie", tags: ["comedie", "comedy", "humour"] },
    { key: "drame", tags: ["drame", "drama"] },
    { key: "romance", tags: ["romance", "romantique", "love"] },
    { key: "thriller", tags: ["thriller", "suspense"] },
    { key: "science fiction", tags: ["science fiction", "sci fi", "sf"] },
    { key: "animation", tags: ["animation", "dessin anime"] },
    { key: "documentaire", tags: ["documentaire", "docu"] },
  ];

  searchRows.forEach((row) => {
    row.tokens.forEach((token) => {
      const next = Number(titleTokenWeights.get(token) || 0) + row.score;
      titleTokenWeights.set(token, next);
    });
    genreHints.forEach((hint) => {
      if (hint.tags.some((tag) => row.key.includes(normalizeTitleKey(tag)))) {
        const themeKey = normalizeThemeToken(hint.key);
        themeWeights.set(themeKey, Number(themeWeights.get(themeKey) || 0) + row.score * 2.4);
      }
    });
  });

  return {
    typeWeights,
    themeWeights,
    titleTokenWeights,
    searchRows,
    likedIds,
    dislikedIds,
    hasSignals,
  };
}

function getInterestCatalog() {
  const base = Array.isArray(state.catalog) ? state.catalog.slice() : [];
  if (base.length === 0) {
    return [];
  }

  const profile = buildInterestProfile();
  if (!profile.hasSignals) {
    return getPopularCatalog();
  }

  const topRankById = new Map();
  state.topDaily.forEach((entry, index) => {
    const id = Number(entry?.id || 0);
    if (id > 0 && !topRankById.has(id)) {
      topRankById.set(id, index);
    }
  });

  const scored = [];
  base.forEach((item) => {
    const id = Number(item?.id || 0);
    if (id <= 0) {
      return;
    }
    if (profile.dislikedIds.has(id)) {
      return;
    }

    let score = 0;
    if (profile.likedIds.has(id)) {
      score += 220;
    }
    if (isFavorite(id)) {
      score += 18;
    }

    const progress = state.progress?.[id];
    if (progress) {
      const age = Math.max(0, Date.now() - Number(progress?.lastPlayed || 0));
      const recency = Math.exp(-age / (28 * 24 * 60 * 60 * 1000));
      score += 18 + recency * 28;
      if (isItemMostlyWatched(item)) {
        score -= 14;
      }
    }

    const typeBucket = getItemTypeBucket(item);
    score += Number(profile.typeWeights[typeBucket] || 0) * 14;

    const themeTokens = getItemThemeTokens(item);
    themeTokens.forEach((token) => {
      score += Number(profile.themeWeights.get(token) || 0) * 7.6;
    });

    const titleKey = item.titleKey || normalizeTitleKey(item.title || "");
    profile.searchRows.forEach((row) => {
      if (titleKey.includes(row.key)) {
        score += row.score * 20;
        return;
      }
      if (row.tokens.some((token) => token.length >= 3 && titleKey.includes(token))) {
        score += row.score * 4.4;
      }
    });

    splitNormalizedTokens(titleKey).forEach((token) => {
      score += Number(profile.titleTokenWeights.get(token) || 0) * 2.8;
    });

    const rank = topRankById.get(id);
    if (Number.isInteger(rank)) {
      score += Math.max(0, 20 - rank * 2);
    }
    if (isRecentlyReleased(item, 70)) {
      score += 10;
    }

    scored.push({ item, score });
  });

  scored.sort((left, right) => {
    const delta = Number(right.score || 0) - Number(left.score || 0);
    if (Math.abs(delta) > 0.001) {
      return delta;
    }
    return parseReleaseDate(right.item?.releaseDate) - parseReleaseDate(left.item?.releaseDate);
  });

  return scored.map((entry) => entry.item);
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
  setButtonTextPreserveIcon(refs.detailFavoriteBtn, isFavorite(id) ? "Retirer de ma liste" : "Ajouter a ma liste");
}

async function copyCurrentLink() {
  let url = window.location.href;
  let title = String(document.title || "Zenix").trim();
  if (state.nowPlaying && Number(state.nowPlaying.id || 0) > 0) {
    url = buildShareUrl({
      watchId: Number(state.nowPlaying.id || 0),
      season: Number(state.nowPlaying.season || 1),
      episode: Number(state.nowPlaying.episode || 1),
    });
    title = String(state.nowPlaying.title || title).trim();
  } else if (state.selectedDetailId) {
    const item = findItemById(state.selectedDetailId);
    url = buildShareUrl({ detailId: Number(state.selectedDetailId || 0) });
    title = String(item?.title || title).trim();
  }
  const usedNative = await shareLink(url, title);
  notifyActionMessage(usedNative ? "Partage ouvert." : "Lien copie.");
}

async function copyBrowseLink() {
  syncBrowseRoute({ replace: true });
  const url = window.location.href;
  const usedNative = await shareLink(url, "Zenix");
  notifyActionMessage(usedNative ? "Partage ouvert." : "Lien de la vue copie.");
}

async function shareLink(url, title) {
  const safeUrl = String(url || "").trim();
  if (!safeUrl) {
    return false;
  }
  if (navigator.share) {
    try {
      await navigator.share({
        title: String(title || "Zenix").trim(),
        text: String(title || "Zenix").trim(),
        url: safeUrl,
      });
      return true;
    } catch (err) {
      if (err && String(err.name || "").toLowerCase() === "aborterror") {
        return true;
      }
    }
  }
  await copyText(safeUrl);
  return false;
}

function buildShareUrl(options = {}) {
  const base = new URL("/", window.location.origin);
  const watchId = Number(options.watchId || 0);
  const detailId = Number(options.detailId || 0);
  if (watchId > 0) {
    base.searchParams.set("watch", String(watchId));
    const season = Number(options.season || 0);
    const episode = Number(options.episode || 0);
    if (season > 0) {
      base.searchParams.set("s", String(season));
    }
    if (episode > 0) {
      base.searchParams.set("e", String(episode));
    }
  } else if (detailId > 0) {
    base.searchParams.set("detail", String(detailId));
  }
  return base.toString();
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

function getLatestProgressEntry() {
  const rows = Object.values(state.progress || {})
    .filter((entry) => Number(entry?.id || 0) > 0 && Number(entry?.lastPlayed || 0) > 0)
    .sort((left, right) => Number(right?.lastPlayed || 0) - Number(left?.lastPlayed || 0));
  return rows[0] || null;
}

async function resumeLastPlayback() {
  const latest = getLatestProgressEntry();
  if (!latest) {
    throw new Error("No progress");
  }
  const id = Number(latest.id || 0);
  if (!id) {
    throw new Error("Invalid progress");
  }
  await openPlayer(id, {
    season: Number(latest.season || 1),
    episode: Number(latest.episode || 1),
    resumeTime: Number(latest.time || 0),
  });
}

function exportFavoritesAsJson() {
  const rows = Object.values(state.favorites || {})
    .filter((entry) => Number(entry?.id || 0) > 0)
    .sort((left, right) => Number(right?.addedAt || 0) - Number(left?.addedAt || 0));

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: "zenix-stream",
    items: rows,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const filename = `zenix-ma-liste-${stamp}.json`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast(`Ma liste exportee (${rows.length} titre${rows.length > 1 ? "s" : ""}).`);
}

function normalizeImportedFavorite(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const id = Number(entry.id || 0);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  const type = entry.type === "tv" ? "tv" : "movie";
  const title = String(entry.title || "").trim().slice(0, 180);
  return {
    id,
    type,
    title,
    isAnime: Boolean(entry.isAnime),
    addedAt: Number(entry.addedAt || Date.now()) || Date.now(),
  };
}

async function importFavoritesFromInput() {
  const file = refs.importListInput?.files?.[0] || null;
  if (!file) {
    return;
  }
  const text = await file.text();
  const parsed = JSON.parse(text);
  const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.items) ? parsed.items : [];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Empty import");
  }

  const next = { ...(state.favorites || {}) };
  let imported = 0;
  rows.forEach((row) => {
    const normalized = normalizeImportedFavorite(row);
    if (!normalized) {
      return;
    }
    next[normalized.id] = normalized;
    imported += 1;
  });

  if (imported === 0) {
    throw new Error("No valid item");
  }

  state.favorites = next;
  saveFavorites(state.favorites);
  renderAll();
  showToast(`Import termine: ${imported} titre${imported > 1 ? "s" : ""}.`);
}

function saveBrowseState() {
  try {
    const payload = {
      view: state.view,
      chip: state.chip,
      sortBy: state.sortBy,
      query: state.query,
      calendarQuery: state.calendarQuery,
      calendarTypeFilters: { ...state.calendarTypeFilters },
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

  const allowedViews = new Set([
    "all",
    "calendar",
    "top",
    "movie",
    "tv",
    "anime",
    "latest",
    "popular",
    "list",
    "info",
    "recommendation",
  ]);
  const allowedChips = new Set(["all", "recent", "movie", "tv", "anime"]);
  const allowedSort = new Set([
    "featured",
    "recent",
    "title-asc",
    "title-desc",
    "year-desc",
    "year-asc",
    "resume-recent",
    "random",
    "runtime-desc",
  ]);

  if (allowedViews.has(String(saved.view || ""))) {
    state.view = String(saved.view);
  }
  if (allowedChips.has(String(saved.chip || ""))) {
    state.chip = String(saved.chip);
  }
  if (allowedSort.has(String(saved.sortBy || ""))) {
    state.sortBy = String(saved.sortBy);
    if (state.sortBy === "random") {
      state.randomSortSeed = Date.now();
    }
  }
  state.query = String(saved.query || "").trim();
  state.calendarQuery = String(saved.calendarQuery || "").trim();
  state.calendarTypeFilters = sanitizeCalendarTypeFilters(saved.calendarTypeFilters);

  refs.searchInput.value = state.view === "calendar" ? state.calendarQuery : state.query;
  if (refs.calendarSearchInput) {
    refs.calendarSearchInput.value = state.calendarQuery;
  }
  if (Array.isArray(refs.calendarTypeFilterInputs)) {
    refs.calendarTypeFilterInputs.forEach((input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      const type = normalizeCalendarMediaType(input.dataset.calendarTypeFilter || "");
      if (!type) {
        return;
      }
      input.checked = state.calendarTypeFilters[type] !== false;
    });
  }
  refs.sortSelect.value = state.sortBy;
}

function applyBrowseStateFromRoute() {
  const url = new URL(window.location.href);

  const view = String(url.searchParams.get("view") || "");
  const normalizedView = view === "catalog" || view === "search" || view === "interest" ? "all" : view;
  const chip = String(url.searchParams.get("chip") || "");
  const sort = String(url.searchParams.get("sort") || "");
  const query = String(url.searchParams.get("q") || "").trim();

  const allowedViews = new Set([
    "all",
    "calendar",
    "top",
    "movie",
    "tv",
    "anime",
    "latest",
    "popular",
    "list",
    "info",
    "recommendation",
  ]);
  const allowedChips = new Set(["all", "recent", "movie", "tv", "anime"]);
  const allowedSort = new Set([
    "featured",
    "recent",
    "title-asc",
    "title-desc",
    "year-desc",
    "year-asc",
    "resume-recent",
    "random",
    "runtime-desc",
  ]);

  if (allowedViews.has(normalizedView)) {
    state.view = normalizedView;
  }
  if (allowedChips.has(chip)) {
    state.chip = chip;
  }
  if (allowedSort.has(sort)) {
    state.sortBy = sort;
    if (state.sortBy === "random") {
      state.randomSortSeed = Date.now();
    }
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

function keepVisibleRootUrl(options = {}) {
  if (!LOCK_VISIBLE_ROOT_URL || typeof window === "undefined" || typeof history === "undefined") {
    return;
  }
  const hasExtra = window.location.pathname !== "/" || window.location.search.length > 0 || window.location.hash.length > 0;
  if (!hasExtra) {
    return;
  }
  const replace = options.replace !== false;
  if (replace) {
    history.replaceState({}, "", "/");
  } else {
    history.pushState({}, "", "/");
  }
}

function syncBrowseRoute(options = {}) {
  if (LOCK_VISIBLE_ROOT_URL) {
    keepVisibleRootUrl({ replace: true });
    return;
  }

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
  if (LOCK_VISIBLE_ROOT_URL) {
    keepVisibleRootUrl({ replace: true });
    return;
  }

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
  const controller =
    typeof AbortController === "function"
      ? new AbortController()
      : null;
  const timeoutId = setTimeout(() => {
    if (controller) {
      controller.abort();
    }
  }, HEARTBEAT_REQUEST_TIMEOUT_MS);
  fetch(endpoint, {
    method: "POST",
    credentials: "omit",
    keepalive: true,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
    signal: controller ? controller.signal : undefined,
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
      clearTimeout(timeoutId);
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

function loadSourceHostHealth() {
  try {
    const raw = localStorage.getItem(SOURCE_HOST_HEALTH_KEY);
    if (!raw) {
      return new Map();
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return new Map();
    }
    const map = new Map();
    Object.entries(parsed).forEach(([host, value]) => {
      if (!host || !value || typeof value !== "object") {
        return;
      }
      map.set(String(host).toLowerCase(), {
        failures: Math.max(0, Number(value.failures || 0)),
        successes: Math.max(0, Number(value.successes || 0)),
        updatedAt: Math.max(0, Number(value.updatedAt || 0)),
      });
    });
    return map;
  } catch {
    return new Map();
  }
}

function saveSourceHostHealth(map) {
  try {
    const payload = {};
    map.forEach((value, host) => {
      payload[host] = {
        failures: Math.max(0, Number(value?.failures || 0)),
        successes: Math.max(0, Number(value?.successes || 0)),
        updatedAt: Math.max(0, Number(value?.updatedAt || 0)),
      };
    });
    localStorage.setItem(SOURCE_HOST_HEALTH_KEY, JSON.stringify(payload));
  } catch {
    // ignore private mode/quota
  }
}

function loadSourceSuccessMap() {
  try {
    const raw = localStorage.getItem(SOURCE_SUCCESS_KEY);
    if (!raw) {
      return new Map();
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return new Map();
    }
    const map = new Map();
    Object.entries(parsed).forEach(([key, value]) => {
      const ts = Number(value?.ts || 0);
      if (!key || !Number.isFinite(ts) || ts <= 0) {
        return;
      }
      map.set(String(key), { ts });
    });
    return map;
  } catch {
    return new Map();
  }
}

function saveSourceSuccessMap(map) {
  try {
    const payload = {};
    if (map instanceof Map) {
      map.forEach((value, key) => {
        const ts = Number(value?.ts || 0);
        if (ts > 0) {
          payload[String(key)] = { ts };
        }
      });
    }
    localStorage.setItem(SOURCE_SUCCESS_KEY, JSON.stringify(payload));
  } catch {
    // ignore private mode/quota
  }
}

function loadItemQualityMap() {
  try {
    const raw = localStorage.getItem(ITEM_QUALITY_KEY);
    if (!raw) {
      return new Map();
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return new Map();
    }
    const map = new Map();
    Object.entries(parsed).forEach(([key, value]) => {
      const id = Number(key || 0);
      const label = String(value || "").trim();
      if (!Number.isFinite(id) || id <= 0 || !label) {
        return;
      }
      map.set(id, label);
    });
    return map;
  } catch {
    return new Map();
  }
}

function saveItemQualityMap(map) {
  try {
    const payload = {};
    if (map instanceof Map) {
      map.forEach((value, key) => {
        const id = Number(key || 0);
        if (!Number.isFinite(id) || id <= 0) {
          return;
        }
        payload[id] = String(value || "").trim();
      });
    }
    localStorage.setItem(ITEM_QUALITY_KEY, JSON.stringify(payload));
  } catch {
    // ignore private mode/quota
  }
}

function loadGateToken() {
  try {
    return String(localStorage.getItem(GATE_TOKEN_KEY) || "");
  } catch {
    return "";
  }
}

function saveGateToken(token) {
  try {
    if (!token) {
      localStorage.removeItem(GATE_TOKEN_KEY);
      return;
    }
    localStorage.setItem(GATE_TOKEN_KEY, String(token));
  } catch {
    // ignore private mode/quota
  }
}

function loadUiPrefs() {
  const defaults = {
    compactCards: false,
    autoNextEpisode: true,
    hideWatched: false,
    newOnly: false,
    vfOnly: false,
    vostOnly: false,
    theme: "cine",
    reduceMotion: false,
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
    const vfOnly = Boolean(parsed.vfOnly);
    const vostOnly = Boolean(parsed.vostOnly) && !vfOnly;
    return {
      compactCards: Boolean(parsed.compactCards),
      autoNextEpisode: parsed.autoNextEpisode !== false,
      hideWatched: Boolean(parsed.hideWatched),
      newOnly: Boolean(parsed.newOnly),
      vfOnly,
      vostOnly,
      theme: normalizeThemeName(parsed.theme),
      reduceMotion: Boolean(parsed.reduceMotion),
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
    const vfOnly = Boolean(value?.vfOnly);
    const vostOnly = Boolean(value?.vostOnly) && !vfOnly;
    const payload = {
      compactCards: Boolean(value?.compactCards),
      autoNextEpisode: value?.autoNextEpisode !== false,
      hideWatched: Boolean(value?.hideWatched),
      newOnly: Boolean(value?.newOnly),
      vfOnly,
      vostOnly,
      theme: normalizeThemeName(value?.theme),
      reduceMotion: Boolean(value?.reduceMotion),
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

function loadSearchSignals() {
  try {
    const raw = localStorage.getItem(SEARCH_SIGNALS_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return pruneSearchSignalsStore(parsed);
  } catch {
    return {};
  }
}

function saveSearchSignals(value) {
  try {
    const safe = pruneSearchSignalsStore(value);
    localStorage.setItem(SEARCH_SIGNALS_KEY, JSON.stringify(safe));
  } catch {
    // ignore
  }
}

function normalizeStoredRating(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }
  const id = Number(entry.id || 0);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  const value = normalizeRatingValue(entry.value);
  if (value === 0) {
    return null;
  }
  return {
    id,
    value,
    type: entry.type === "tv" ? "tv" : "movie",
    isAnime: Boolean(entry.isAnime),
    title: String(entry.title || "").slice(0, 180),
    updatedAt: Number(entry.updatedAt || Date.now()) || Date.now(),
  };
}

function loadRatings() {
  try {
    const raw = localStorage.getItem(RATINGS_KEY) || sessionStorage.getItem(RATINGS_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    const next = {};
    Object.entries(parsed).forEach(([idRaw, value]) => {
      const normalized = normalizeStoredRating({
        ...(value && typeof value === "object" ? value : { value }),
        id: Number(idRaw || value?.id || 0),
      });
      if (!normalized) {
        return;
      }
      next[normalized.id] = normalized;
    });
    return next;
  } catch {
    return {};
  }
}

function saveRatings(value) {
  const safeSource = value && typeof value === "object" ? value : {};
  const safe = {};
  Object.values(safeSource).forEach((entry) => {
    const normalized = normalizeStoredRating(entry);
    if (!normalized) {
      return;
    }
    safe[normalized.id] = normalized;
  });
  const payload = JSON.stringify(safe);
  localStorage.setItem(RATINGS_KEY, payload);
  sessionStorage.setItem(RATINGS_KEY, payload);
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
      supplementalLastPage: state.supplementalLastPage,
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

  const proxyUrl = `${API_BASE}${safePath}`;
  const proxyOptions = {
    ...requestOptions,
    timeoutMs: prefetch ? STREAM_PROXY_PREFETCH_TIMEOUT_MS : STREAM_PROXY_TIMEOUT_MS,
    retryDelays: [],
  };

  const task = (async () => {
    const proxy = await fetchJson(proxyUrl, proxyOptions);
    writeStreamPayloadCache(safePath, proxy);
    return proxy;
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

function isSameOriginUrl(url) {
  try {
    const parsed = new URL(String(url || ""), window.location.origin);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

function isGateProtectedUrl(url) {
  try {
    const parsed = new URL(String(url || ""), window.location.origin);
    if (parsed.origin !== window.location.origin) {
      return false;
    }
    const pathname = parsed.pathname || "";
    if (!pathname.startsWith("/api/")) {
      return false;
    }
    if (pathname.startsWith("/api/analytics/")) {
      return false;
    }
    if (pathname === "/api/suggestions") {
      return false;
    }
    if (pathname.startsWith("/api/gate/")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function fetchJson(url, options = {}) {
  const force = Boolean(options.force);
  const skipCache = Boolean(options.noCache || options.skipCache);
  const signal = options.signal;
  const retryDelays = Array.isArray(options.retryDelays) ? options.retryDelays : RETRY_DELAYS_MS;
  const timeoutMs = Number(options.timeoutMs || 0) > 0 ? Number(options.timeoutMs) : REQUEST_TIMEOUT_MS;
  const gateRetried = Boolean(options.gateRetried);
  if (isGateProtectedUrl(url) && !state.gateReady) {
    await refreshGateToken({ force: true }).catch(() => {
      // handled below on 403
    });
  }
  const method = String(options.method || "GET").toUpperCase();
  const canCache = isCacheableApiUrl(url) && method === "GET" && !skipCache;
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
      const gateToken = state.gateToken;
      const response = await fetch(url, {
        method,
        mode: "cors",
        credentials: options.credentials || (isSameOriginUrl(url) ? "same-origin" : "omit"),
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...(gateToken ? { "X-Zenix-Gate": gateToken } : {}),
          ...(options.headers || {}),
        },
        ...(options.cache ? { cache: options.cache } : {}),
        ...(method !== "GET" && options.body !== undefined ? { body: options.body } : {}),
      });

      if (!response.ok) {
        if (response.status === 403 && response.headers.get("x-zenix-gate") === "required") {
          if (!gateRetried) {
            const gateOk = await refreshGateToken({ force: true }).catch(() => false);
            if (gateOk) {
              return fetchJson(url, {
                ...options,
                gateRetried: true,
                noCache: true,
              });
            }
          }
          applyAdblockDetectionState(true, { manual: false });
          setAdblockGateStatus(
            "Bloqueur de pub detecte. Desactive-le puis clique sur 'Verifier de nouveau'.",
            false
          );
        }
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

