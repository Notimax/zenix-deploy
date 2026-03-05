const CATALOG = [
  {
    id: "bunny",
    title: "Big Buck Bunny",
    genre: "Animation",
    year: 2008,
    duration: "9 min",
    description: "Un court metrage libre, fluide et parfait pour tester la lecture rapide.",
    poster: "/images/dragons.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "elephant",
    title: "Elephant Dream",
    genre: "Sci-Fi",
    year: 2006,
    duration: "11 min",
    description: "Une aventure visuelle experimentale, gratuite et disponible instantanement.",
    poster: "/images/stitch.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "sintel",
    title: "Sintel",
    genre: "Fantasy",
    year: 2010,
    duration: "15 min",
    description: "Animation open-source culte, en lecture directe sans abonnement.",
    poster: "/images/superman.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
  {
    id: "tears",
    title: "Tears of Steel",
    genre: "Action",
    year: 2012,
    duration: "12 min",
    description: "Un mix cinema/VFX libre pour une experience premium sans paiement.",
    poster: "/images/ufc.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    id: "blazes",
    title: "For Bigger Blazes",
    genre: "Action",
    year: 2014,
    duration: "15 sec",
    description: "Clip ultra rapide pour tester le player et la fluidite mobile.",
    poster: "/images/tennis.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "escape",
    title: "For Bigger Escape",
    genre: "Action",
    year: 2014,
    duration: "15 sec",
    description: "Lecture immediate avec demarrage rapide et commandes simplifiees.",
    poster: "/images/foot.jpeg",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscape.mp4",
  },
  {
    id: "fun",
    title: "For Bigger Fun",
    genre: "Comedy",
    year: 2014,
    duration: "15 sec",
    description: "Format court, fun, et totalement gratuit pour enrichir le catalogue.",
    poster: "/images/dragons.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: "joyrides",
    title: "For Bigger Joyrides",
    genre: "Auto",
    year: 2014,
    duration: "15 sec",
    description: "Clip dynamique avec une lecture stable sur desktop et mobile.",
    poster: "/images/ufc.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: "meltdown",
    title: "For Bigger Meltdowns",
    genre: "Comedy",
    year: 2014,
    duration: "15 sec",
    description: "Demonstration rapide d'un playback instantane sans friction.",
    poster: "/images/superman.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    id: "subaru",
    title: "Subaru Outback Review",
    genre: "Documentary",
    year: 2013,
    duration: "2 min",
    description: "Contenu video public de demonstration pour enrichir la grille.",
    poster: "/images/stitch.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  },
  {
    id: "gti",
    title: "Volkswagen GTI Review",
    genre: "Documentary",
    year: 2013,
    duration: "2 min",
    description: "Lecture gratuite avec affichage propre, sans upsell ni paywall.",
    poster: "/images/dragons.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  },
  {
    id: "wearegoing",
    title: "We Are Going On Bullrun",
    genre: "Auto",
    year: 2013,
    duration: "2 min",
    description: "Un flux video direct pour une navigation rapide dans le catalogue.",
    poster: "/images/ufc.png",
    source: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  },
];

const STORAGE_KEY = "zenix-progress-v1";
const CLEANUP_KEY = "zenix-sw-cleaned-v1";

const state = {
  query: "",
  genre: "Tous",
  activeId: CATALOG[0].id,
  nowPlayingId: null,
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
  playerSheet: document.getElementById("playerSheet"),
  playerTitle: document.getElementById("playerTitle"),
  playerVideo: document.getElementById("playerVideo"),
  closePlayerBtn: document.getElementById("closePlayerBtn"),
};

let lastProgressWrite = 0;

init();

async function init() {
  cleanupLegacyServiceWorker();
  renderGenreChips();
  bindEvents();
  renderAll();
}

function bindEvents() {
  refs.searchInput.addEventListener("input", (event) => {
    state.query = String(event.target.value || "").trim().toLowerCase();
    renderAll();
  });

  refs.heroPlayBtn.addEventListener("click", () => {
    openPlayer(state.activeId);
  });

  refs.heroInfoBtn.addEventListener("click", () => {
    const card = document.querySelector(`[data-card-id="${state.activeId}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.animate(
      [{ boxShadow: "0 0 0 0 rgba(34, 211, 238, 0.6)" }, { boxShadow: "0 0 0 8px rgba(34, 211, 238, 0)" }],
      { duration: 850 }
    );
  });

  refs.closePlayerBtn.addEventListener("click", closePlayer);
  refs.playerSheet.addEventListener("click", (event) => {
    if (event.target === refs.playerSheet) {
      closePlayer();
    }
  });

  refs.playerVideo.addEventListener("timeupdate", onPlayerProgress);
  refs.playerVideo.addEventListener("ended", onPlayerEnded);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePlayer();
    }
  });
}

function renderAll() {
  const filtered = filterCatalog();
  if (!filtered.some((item) => item.id === state.activeId)) {
    state.activeId = filtered[0] ? filtered[0].id : CATALOG[0].id;
  }
  renderHero();
  renderCatalog(filtered);
  renderContinue();
}

function renderHero() {
  const item = getById(state.activeId) || CATALOG[0];
  refs.heroTitle.textContent = item.title;
  refs.heroDescription.textContent = item.description;
  refs.heroArt.src = item.poster;
  refs.heroArt.alt = item.title;
  refs.heroMeta.innerHTML = "";
  for (const tag of [item.genre, String(item.year), item.duration, "Gratuit"]) {
    const span = document.createElement("span");
    span.className = "hero-tag";
    span.textContent = tag;
    refs.heroMeta.appendChild(span);
  }
}

function renderGenreChips() {
  const genres = ["Tous", ...new Set(CATALOG.map((item) => item.genre))];
  refs.genreChips.innerHTML = "";
  for (const genre of genres) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip${genre === state.genre ? " active" : ""}`;
    button.textContent = genre;
    button.addEventListener("click", () => {
      state.genre = genre;
      renderGenreChips();
      renderAll();
    });
    refs.genreChips.appendChild(button);
  }
}

function filterCatalog() {
  return CATALOG.filter((item) => {
    const matchesGenre = state.genre === "Tous" || item.genre === state.genre;
    const haystack = `${item.title} ${item.genre} ${item.description}`.toLowerCase();
    const matchesSearch = !state.query || haystack.includes(state.query);
    return matchesGenre && matchesSearch;
  });
}

function renderCatalog(items) {
  refs.catalogGrid.innerHTML = "";
  refs.emptyState.hidden = items.length > 0;
  for (const item of items) {
    refs.catalogGrid.appendChild(buildCard(item, false));
  }
}

function renderContinue() {
  const resumable = CATALOG
    .map((item) => ({ item, progress: state.progress[item.id] }))
    .filter((entry) => entry.progress && entry.progress.time > 15)
    .sort((a, b) => (b.progress.lastPlayed || 0) - (a.progress.lastPlayed || 0))
    .slice(0, 4);

  refs.continueGrid.innerHTML = "";
  refs.continueSection.hidden = resumable.length === 0;
  for (const entry of resumable) {
    refs.continueGrid.appendChild(buildCard(entry.item, true));
  }
}

function buildCard(item, showProgress) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.cardId = item.id;

  const progressInfo = state.progress[item.id];
  const percent = progressInfo ? Math.max(0, Math.min(100, Math.round((progressInfo.time / 120) * 100))) : 0;

  card.innerHTML = `
    <div class="card-media">
      <img src="${item.poster}" alt="${escapeHtml(item.title)}" loading="lazy" />
      <span class="free-label">FREE</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <div class="card-meta">${escapeHtml(item.genre)} - ${item.year} - ${escapeHtml(item.duration)}</div>
      <p class="card-desc">${escapeHtml(item.description)}</p>
      ${showProgress ? `
        <div class="progress-wrap"><div class="progress-bar" style="width:${percent}%"></div></div>
      ` : ""}
      <div class="card-actions">
        <button type="button" class="btn-small btn-play" data-play="${item.id}">${showProgress ? "Reprendre" : "Lire"}</button>
        <button type="button" class="btn-small btn-lite" data-feature="${item.id}">A la une</button>
      </div>
    </div>
  `;

  const playBtn = card.querySelector(`[data-play="${item.id}"]`);
  const featureBtn = card.querySelector(`[data-feature="${item.id}"]`);

  playBtn.addEventListener("click", () => openPlayer(item.id));
  featureBtn.addEventListener("click", () => {
    state.activeId = item.id;
    renderHero();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  return card;
}

function openPlayer(id) {
  const item = getById(id);
  if (!item) return;

  state.nowPlayingId = id;
  state.activeId = id;
  renderHero();

  refs.playerTitle.textContent = item.title;
  refs.playerVideo.src = item.source;
  refs.playerSheet.hidden = false;
  document.body.style.overflow = "hidden";

  const saved = state.progress[id];
  refs.playerVideo.addEventListener(
    "loadedmetadata",
    () => {
      if (saved && saved.time > 5 && saved.time < refs.playerVideo.duration - 5) {
        refs.playerVideo.currentTime = saved.time;
      }
    },
    { once: true }
  );

  refs.playerVideo.play().catch(() => {});
}

function closePlayer() {
  refs.playerSheet.hidden = true;
  document.body.style.overflow = "";
  refs.playerVideo.pause();
}

function onPlayerProgress() {
  if (!state.nowPlayingId) return;
  const now = Date.now();
  if (now - lastProgressWrite < 1200) return;
  lastProgressWrite = now;

  state.progress[state.nowPlayingId] = {
    time: refs.playerVideo.currentTime,
    lastPlayed: now,
  };
  saveProgress(state.progress);
}

function onPlayerEnded() {
  if (!state.nowPlayingId) return;
  delete state.progress[state.nowPlayingId];
  saveProgress(state.progress);
  renderContinue();
}

function getById(id) {
  return CATALOG.find((item) => item.id === id) || null;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  renderContinue();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function cleanupLegacyServiceWorker() {
  if (sessionStorage.getItem(CLEANUP_KEY)) return;
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
