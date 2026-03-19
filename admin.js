const refs = {
  loginCard: document.getElementById("adminLoginCard"),
  loginBtn: document.getElementById("adminLoginBtn"),
  loginStatus: document.getElementById("adminLoginStatus"),
  password: document.getElementById("adminPassword"),
  logoutBtn: document.getElementById("adminLogoutBtn"),
  app: document.getElementById("adminApp"),
  annMessage: document.getElementById("annMessage"),
  annDuration: document.getElementById("annDuration"),
  annEnabled: document.getElementById("annEnabled"),
  annSaveBtn: document.getElementById("annSaveBtn"),
  annStatus: document.getElementById("annStatus"),
  annCurrentText: document.getElementById("annCurrentText"),
  annClearBtn: document.getElementById("annClearBtn"),
  suggestType: document.getElementById("suggestType"),
  suggestContainer: document.getElementById("suggestContainer"),
  suggestPoster: document.getElementById("suggestPoster"),
  suggestTitle: document.getElementById("suggestTitle"),
  suggestMeta: document.getElementById("suggestMeta"),
  suggestTags: document.getElementById("suggestTags"),
  suggestOverview: document.getElementById("suggestOverview"),
  suggestAcceptBtn: document.getElementById("suggestAcceptBtn"),
  suggestSkipBtn: document.getElementById("suggestSkipBtn"),
  suggestNextBtn: document.getElementById("suggestNextBtn"),
  suggestStatus: document.getElementById("suggestStatus"),
  importUrl: document.getElementById("importUrl"),
  importBtn: document.getElementById("importBtn"),
  importStatus: document.getElementById("importStatus"),
  importResult: document.getElementById("importResult"),
  overrideId: document.getElementById("overrideId"),
  overrideExternalKey: document.getElementById("overrideExternalKey"),
  overrideTitle: document.getElementById("overrideTitle"),
  overrideOverview: document.getElementById("overrideOverview"),
  overridePoster: document.getElementById("overridePoster"),
  overrideBackdrop: document.getElementById("overrideBackdrop"),
  overrideStatus: document.getElementById("overrideStatus"),
  overrideHide: document.getElementById("overrideHide"),
  overrideSaveBtn: document.getElementById("overrideSaveBtn"),
  overrideStatusMsg: document.getElementById("overrideStatusMsg"),
  customList: document.getElementById("customList"),
  overrideList: document.getElementById("overrideList"),
  adminSearchQuery: document.getElementById("adminSearchQuery"),
  adminSearchType: document.getElementById("adminSearchType"),
  adminSearchBtn: document.getElementById("adminSearchBtn"),
  adminSearchClearBtn: document.getElementById("adminSearchClearBtn"),
  adminSearchStatus: document.getElementById("adminSearchStatus"),
  adminSearchResults: document.getElementById("adminSearchResults"),
  repairId: document.getElementById("repairId"),
  repairExternalKey: document.getElementById("repairExternalKey"),
  repairBtn: document.getElementById("repairBtn"),
  repairStatus: document.getElementById("repairStatus"),
  repairResult: document.getElementById("repairResult"),
  ownedMediaId: document.getElementById("ownedMediaId"),
  ownedType: document.getElementById("ownedType"),
  ownedSeason: document.getElementById("ownedSeason"),
  ownedEpisode: document.getElementById("ownedEpisode"),
  ownedStreamUrl: document.getElementById("ownedStreamUrl"),
  ownedFormat: document.getElementById("ownedFormat"),
  ownedQuality: document.getElementById("ownedQuality"),
  ownedLanguage: document.getElementById("ownedLanguage"),
  ownedName: document.getElementById("ownedName"),
  ownedPriority: document.getElementById("ownedPriority"),
  ownedAddBtn: document.getElementById("ownedAddBtn"),
  ownedLoadBtn: document.getElementById("ownedLoadBtn"),
  ownedStatus: document.getElementById("ownedStatus"),
  ownedList: document.getElementById("ownedList"),
  selectedInfo: document.getElementById("adminSelectedInfo"),
  selectedAutoFixBtn: document.getElementById("adminSelectedAutoFixBtn"),
  selectedImportBtn: document.getElementById("adminSelectedImportBtn"),
  selectedHideBtn: document.getElementById("adminSelectedHideBtn"),
  selectedShowBtn: document.getElementById("adminSelectedShowBtn"),
  selectedDeleteBtn: document.getElementById("adminSelectedDeleteBtn"),
  selectedStatus: document.getElementById("adminSelectedStatus"),
  customStatus: document.getElementById("customStatus"),
  analyticsLive: document.getElementById("adminAnalyticsLive"),
  analyticsWatching: document.getElementById("adminAnalyticsWatching"),
  analytics24h: document.getElementById("adminAnalytics24h"),
  analytics48h: document.getElementById("adminAnalytics48h"),
  analyticsTotal: document.getElementById("adminAnalyticsTotal"),
  analyticsUpdated: document.getElementById("adminAnalyticsUpdated"),
  analyticsStatus: document.getElementById("adminAnalyticsStatus"),
  healthLastRun: document.getElementById("adminHealthLastRun"),
  healthLastOk: document.getElementById("adminHealthLastOk"),
  healthFailStreak: document.getElementById("adminHealthFailStreak"),
  healthLastRepair: document.getElementById("adminHealthLastRepair"),
  healthWarmupOk: document.getElementById("adminHealthWarmupOk"),
  healthGlobalRepair: document.getElementById("adminHealthGlobalRepair"),
  healthMeta: document.getElementById("adminHealthMeta"),
  healthStatus: document.getElementById("adminHealthStatus"),
  requestList: document.getElementById("adminRequestList"),
  requestEmpty: document.getElementById("adminRequestEmpty"),
  requestStatus: document.getElementById("adminRequestStatus"),
  tvChannelName: document.getElementById("tvChannelName"),
  tvChannelUrl: document.getElementById("tvChannelUrl"),
  tvChannelType: document.getElementById("tvChannelType"),
  tvChannelLogo: document.getElementById("tvChannelLogo"),
  tvChannelGroup: document.getElementById("tvChannelGroup"),
  tvChannelAddBtn: document.getElementById("tvChannelAddBtn"),
  tvChannelStatus: document.getElementById("tvChannelStatus"),
  tvChannelList: document.getElementById("tvChannelList"),
};

const FASTFLUX_BASE = "https://fastflux.xyz";

const state = {
  data: null,
  searchSeq: 0,
  searchTimer: 0,
  analyticsTimer: 0,
  healthTimer: 0,
  lastQuery: "",
  selectedItem: null,
  customById: new Map(),
  customByExternalKey: new Map(),
  overridesById: {},
  overridesByExternalKey: {},
  suggestions: {
    queue: [],
    loading: false,
  },
  requests: [],
  tvChannels: [],
};

const REQUEST_STATUS_LABELS = {
  pending: "En attente",
  in_progress: "En cours",
  refused: "Refuse",
  in_catalog: "En catalogue",
};

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

function getRequestStatusLabel(value) {
  const normalized = normalizeRequestStatus(value);
  return REQUEST_STATUS_LABELS[normalized] || REQUEST_STATUS_LABELS.pending;
}

function setAdminRequestStatus(message, isError = false) {
  if (!refs.requestStatus) return;
  refs.requestStatus.textContent = String(message || "").trim();
  refs.requestStatus.style.color = isError ? "#ff949b" : "";
}

function extractSearchRows(payload) {
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

function extractYear(value) {
  const raw = String(value || "");
  const match = raw.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : "";
}

function normalizePurstreamRow(row) {
  const id = Number(row?.id || 0);
  if (!id) return null;
  const title =
    String(row?.title || row?.name || row?.original_title || row?.original_name || "").trim();
  const typeRaw = String(row?.type || row?.media_type || row?.mediaType || "").toLowerCase();
  const type = typeRaw === "tv" || typeRaw === "serie" || typeRaw === "series" ? "tv" : "movie";
  const year = extractYear(row?.release_date || row?.first_air_date || row?.year || "");
  const poster =
    row?.poster_path || row?.poster || row?.image || row?.cover || "";
  return { id, title, type, year, poster };
}

function normalizeFastfluxRow(row) {
  const id = Number(row?.tmdb_id || row?.tmdbId || row?.id || 0);
  if (!id) return null;
  const title =
    String(row?.title || row?.series_name || row?.name || row?.original_title || row?.original_name || "").trim();
  const typeRaw = String(row?.media_type || row?.type || "").toLowerCase();
  const type = typeRaw === "tv" || typeRaw === "series" ? "tv" : "movie";
  const year = extractYear(row?.release_date || row?.first_air_date || row?.year || "");
  const poster = row?.poster || row?.poster_path || "";
  return { id, title, type, year, poster };
}

function buildFastfluxImportUrl(row) {
  const type = row.type === "tv" ? "series" : "movie";
  return `${FASTFLUX_BASE}/${type}/${row.id}`;
}

function isAlreadyCustom(row) {
  const custom = state.data?.custom || [];
  if (row.provider === "fastflux") {
    return custom.some((entry) => Number(entry?.external_tmdb_id || 0) === row.id);
  }
  return false;
}

function renderSearchResults(results) {
  if (!refs.adminSearchResults) return;
  refs.adminSearchResults.innerHTML = "";
  if (!results || results.length === 0) {
    refs.adminSearchResults.innerHTML = "<div class=\"admin-muted\">Aucun resultat.</div>";
    return;
  }
  results.forEach((row) => {
    const wrapper = document.createElement("div");
    wrapper.className = "admin-item";
    const alreadyCustom = isAlreadyCustom(row);
    const showImport = row.provider !== "purstream";
    const importDisabled = alreadyCustom;
    const canRepair = row.provider === "purstream";
    wrapper.innerHTML = `
      <div class="admin-item-title">${row.title || "Sans titre"}</div>
      <div class="admin-item-meta">${row.type === "tv" ? "Serie" : "Film"}${row.year ? ` - ${row.year}` : ""} - ${row.provider}</div>
      <div class="admin-actions">
        ${
          showImport
            ? `<button class="admin-btn" data-action="import" ${importDisabled ? "disabled" : ""}>Importer</button>`
            : ""
        }
        <button class="admin-btn admin-ghost" data-action="autofix">Auto-fix</button>
        ${canRepair ? "<button class=\"admin-btn admin-ghost\" data-action=\"repair\">Analyser</button>" : ""}
        <button class="admin-btn admin-ghost" data-action="select">Selectionner</button>
      </div>
    `;
    const importBtn = wrapper.querySelector("[data-action='import']");
    if (importBtn) {
      importBtn.addEventListener("click", async () => {
        if (isAlreadyCustom(row)) {
          refs.adminSearchStatus.textContent = "Deja ajoute (custom).";
          return;
        }
        try {
          const importUrl = row.provider === "fastflux" ? buildFastfluxImportUrl(row) : row.url;
          await apiFetch("/api/admin/import", {
            method: "POST",
            body: JSON.stringify({ url: importUrl }),
          });
          refs.adminSearchStatus.textContent = `Importe: ${row.title}`;
          await loadData();
        } catch (err) {
          refs.adminSearchStatus.textContent = err.message || "Import impossible.";
        }
      });
    }
    const repairBtn = wrapper.querySelector("[data-action='repair']");
    if (repairBtn) {
      repairBtn.addEventListener("click", async () => {
        if (refs.repairId) refs.repairId.value = String(row.provider === "purstream" ? row.id : "");
        if (refs.repairExternalKey) refs.repairExternalKey.value = "";
        await handleRepair();
      });
    }
    const autoFixBtn = wrapper.querySelector("[data-action='autofix']");
    if (autoFixBtn) {
      autoFixBtn.addEventListener("click", async () => {
        await handleAutoFix(row);
      });
    }
    const selectBtn = wrapper.querySelector("[data-action='select']");
    if (selectBtn) {
      selectBtn.addEventListener("click", () => {
        applySelectionFromRow(row);
      });
    }
    refs.adminSearchResults.appendChild(wrapper);
  });
}

function normalizeAdminTitleKey(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";
  let cleaned = raw;
  try {
    cleaned = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } catch {
    cleaned = raw;
  }
  cleaned = cleaned.replace(/[^a-z0-9]+/g, " ").trim();
  return cleaned.replace(/\s+/g, " ");
}

function buildSelectedFromCustom(entry) {
  if (!entry) return null;
  return {
    id: Number(entry.id || 0) || 0,
    title: String(entry.title || "").trim(),
    type: String(entry.type || "movie").toLowerCase() === "tv" ? "tv" : "movie",
    provider: "purstream",
    year: entry.year || "",
    customEntry: entry,
    externalKey: String(entry.external_key || "").trim(),
    externalDetailUrl: String(entry.external_detail_url || "").trim(),
  };
}

function resolveCustomEntryForRow(row) {
  if (!row || !state.data || !Array.isArray(state.data.custom)) return null;
  if (row.provider === "fastflux") {
    return state.data.custom.find((entry) => Number(entry?.external_tmdb_id || 0) === row.id) || null;
  }
  if (row.provider === "purstream") {
    return state.data.custom.find((entry) => Number(entry?.id || 0) === Number(row.id || 0)) || null;
  }
  return null;
}

function buildSelectedFromRow(row) {
  if (!row) return null;
  const customEntry = resolveCustomEntryForRow(row);
  if (customEntry) {
    const built = buildSelectedFromCustom(customEntry);
    if (built) {
      return { ...built, provider: row.provider || built.provider };
    }
  }
  return {
    id: Number(row.id || 0) || 0,
    title: String(row.title || "").trim(),
    type: String(row.type || "movie").toLowerCase() === "tv" ? "tv" : "movie",
    provider: row.provider || "purstream",
    year: row.year || "",
    url: String(row.url || "").trim(),
    tmdbId: row.provider === "fastflux" ? Number(row.id || 0) || 0 : 0,
    customEntry: customEntry || null,
  };
}

function setSelectedItem(item) {
  state.selectedItem = item || null;
  renderSelectedItem();
}

function resolveOverrideTarget(item) {
  if (!item) return null;
  if (item.customEntry && Number(item.customEntry.id || 0) > 0) {
    return { id: Number(item.customEntry.id || 0) };
  }
  if (item.provider === "purstream" && Number(item.id || 0) > 0) {
    return { id: Number(item.id || 0) };
  }
  if (item.customEntry && String(item.customEntry.external_key || "")) {
    return { external_key: String(item.customEntry.external_key || "").trim() };
  }
  return null;
}

function buildCustomDeleteUrl(entry) {
  if (!entry) return "";
  const id = Number(entry.id || 0);
  const externalKey = String(entry.external_key || "").trim();
  if (id > 0 && externalKey) {
    return `/api/admin/custom?id=${id}&external_key=${encodeURIComponent(externalKey)}`;
  }
  if (id > 0) {
    return `/api/admin/custom?id=${id}`;
  }
  if (externalKey) {
    return `/api/admin/custom?external_key=${encodeURIComponent(externalKey)}`;
  }
  return "";
}

function isHiddenOverride(target) {
  if (!target) return false;
  if (target.id && state.overridesById) {
    const entry = state.overridesById[String(target.id)] || state.overridesById[target.id];
    return Boolean(entry?.hidden);
  }
  if (target.external_key && state.overridesByExternalKey) {
    const entry = state.overridesByExternalKey[String(target.external_key)] || null;
    return Boolean(entry?.hidden);
  }
  return false;
}

function renderSelectedItem() {
  if (!refs.selectedInfo) return;
  const item = state.selectedItem;
  if (!item) {
    refs.selectedInfo.textContent = "Aucune selection.";
    if (refs.selectedAutoFixBtn) refs.selectedAutoFixBtn.disabled = true;
    if (refs.selectedImportBtn) refs.selectedImportBtn.hidden = true;
    if (refs.selectedHideBtn) refs.selectedHideBtn.hidden = true;
    if (refs.selectedShowBtn) refs.selectedShowBtn.hidden = true;
    if (refs.selectedDeleteBtn) refs.selectedDeleteBtn.hidden = true;
    if (refs.selectedStatus) refs.selectedStatus.textContent = "";
    return;
  }
  const customLabel = item.customEntry ? "Oui" : "Non";
  refs.selectedInfo.innerHTML = `
    <div class="admin-item-title">${item.title || "Sans titre"}</div>
    <div class="admin-item-meta">${item.type === "tv" ? "Serie" : "Film"}${item.year ? ` - ${item.year}` : ""} - ${item.provider}</div>
    <div class="admin-item-meta">Ajoute: ${customLabel}</div>
  `;
  const canImport = item.provider !== "purstream" && !item.customEntry;
  const target = resolveOverrideTarget(item);
  const hidden = isHiddenOverride(target);
  if (refs.selectedAutoFixBtn) refs.selectedAutoFixBtn.disabled = false;
  if (refs.selectedImportBtn) refs.selectedImportBtn.hidden = !canImport;
  if (refs.selectedHideBtn) refs.selectedHideBtn.hidden = !target || hidden;
  if (refs.selectedShowBtn) refs.selectedShowBtn.hidden = !target || !hidden;
  if (refs.selectedDeleteBtn) refs.selectedDeleteBtn.hidden = !item.customEntry;
  if (refs.selectedStatus) {
    refs.selectedStatus.textContent = hidden ? "Statut: masqué" : "";
  }
}

async function applyOverridePatch(patch) {
  const target = resolveOverrideTarget(state.selectedItem);
  if (!target) {
    if (refs.selectedStatus) refs.selectedStatus.textContent = "Action indisponible.";
    return;
  }
  const body = { patch };
  if (target.id) {
    body.id = target.id;
  } else if (target.external_key) {
    body.external_key = target.external_key;
  }
  await apiFetch("/api/admin/override", {
    method: "POST",
    body: JSON.stringify(body),
  });
  await loadData();
}

async function handleSelectedImport() {
  const item = state.selectedItem;
  if (!item || item.provider === "purstream") return;
  if (item.customEntry) {
    if (refs.selectedStatus) refs.selectedStatus.textContent = "Deja ajoute.";
    return;
  }
  const importUrl = item.provider === "fastflux" ? buildFastfluxImportUrl(item) : item.url;
  if (!importUrl) {
    if (refs.selectedStatus) refs.selectedStatus.textContent = "URL introuvable.";
    return;
  }
  const payload = await apiFetch("/api/admin/import", {
    method: "POST",
    body: JSON.stringify({ url: importUrl }),
  });
  if (refs.selectedStatus) refs.selectedStatus.textContent = "Import termine.";
  await loadData();
  const entry = payload?.data || null;
  if (entry) {
    setSelectedItem(buildSelectedFromCustom(entry));
  }
}

async function handleSelectedAutoFix() {
  const item = state.selectedItem;
  if (!item) return;
  await handleAutoFix(item);
  await loadData();
  if (item.customEntry) {
    setSelectedItem(buildSelectedFromCustom(item.customEntry));
  } else {
    setSelectedItem(item);
  }
}

async function handleSelectedHide() {
  await applyOverridePatch({ hidden: true });
}

async function handleSelectedShow() {
  await applyOverridePatch({ hidden: false });
}

async function handleSelectedDelete() {
  const item = state.selectedItem;
  if (!item || !item.customEntry) return;
  const url = buildCustomDeleteUrl(item.customEntry);
  if (!url) {
    if (refs.selectedStatus) refs.selectedStatus.textContent = "Suppression impossible.";
    return;
  }
  await apiFetch(url, { method: "DELETE" });
  if (refs.selectedStatus) refs.selectedStatus.textContent = "Supprime.";
  if (refs.customStatus) refs.customStatus.textContent = "Suppression terminee.";
  setSelectedItem(null);
  await loadData();
}

function applySelectionFromRow(row) {
  const selected = buildSelectedFromRow(row);
  setSelectedItem(selected);
  if (refs.adminSearchStatus) {
    refs.adminSearchStatus.textContent = `Selection: ${row?.title || "Titre"}`;
  }
}

async function handleAutoFix(row) {
  if (!row) return;
  if (refs.adminSearchStatus) {
    refs.adminSearchStatus.textContent = `Auto-fix en cours: ${row.title || ""}`;
  }
  try {
    let targetId = 0;
    if (row.provider === "purstream") {
      targetId = Number(row.id || 0);
    } else {
      const importUrl = row.provider === "fastflux" ? buildFastfluxImportUrl(row) : row.url;
      const payload = await apiFetch("/api/admin/import", {
        method: "POST",
        body: JSON.stringify({ url: importUrl }),
      });
      const entry = payload?.data || null;
      targetId = Number(entry?.id || 0);
      if (entry) {
        setSelectedItem(buildSelectedFromCustom(entry));
      }
    }
    if (targetId > 0) {
      await apiFetch("/api/admin/repair", {
        method: "POST",
        body: JSON.stringify({ id: targetId }),
      });
    }
    if (refs.adminSearchStatus) {
      refs.adminSearchStatus.textContent = `Auto-fix termine: ${row.title || ""}`;
    }
    await loadData();
  } catch (err) {
    if (refs.adminSearchStatus) {
      refs.adminSearchStatus.textContent = err.message || "Auto-fix impossible.";
    }
  }
}

async function apiFetch(path, options = {}) {
  const init = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };
  const response = await fetch(path, init);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Erreur serveur");
  }
  return payload;
}

function setVisible(el, visible) {
  if (!el) return;
  el.hidden = !visible;
}

function renderCustomList(items) {
  if (!refs.customList) return;
  refs.customList.innerHTML = "";
  if (!Array.isArray(items) || items.length === 0) {
    refs.customList.innerHTML = "<div class=\"admin-muted\">Aucune entree custom.</div>";
    return;
  }
  items.forEach((entry) => {
    const wrapper = document.createElement("div");
    wrapper.className = "admin-item";
    wrapper.innerHTML = `
      <div class="admin-item-title">${entry.title || "Sans titre"}</div>
      <div class="admin-item-meta">ID: ${entry.id} - ${entry.type} - ${entry.external_key || ""}</div>
      <div class="admin-actions">
        <button class="admin-btn admin-ghost" data-action="select">Selectionner</button>
        <button class="admin-btn admin-danger" data-action="delete" type="button">Supprimer</button>
      </div>
    `;
    const deleteBtn = wrapper.querySelector("[data-action='delete']");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", async () => {
        try {
          const url = buildCustomDeleteUrl(entry);
          if (!url) {
            if (refs.customStatus) refs.customStatus.textContent = "Suppression impossible.";
            return;
          }
          await apiFetch(url, { method: "DELETE" });
          if (refs.customStatus) refs.customStatus.textContent = "Suppression terminee.";
          await loadData();
        } catch (err) {
          if (refs.customStatus) refs.customStatus.textContent = err.message || "Suppression impossible.";
        }
      });
    }
    const selectBtn = wrapper.querySelector("[data-action='select']");
    if (selectBtn) {
      selectBtn.addEventListener("click", () => {
        applySelectionFromRow({ id: entry.id, title: entry.title, provider: "purstream" });
      });
    }
    refs.customList.appendChild(wrapper);
  });
}

function renderOverrideList(data) {
  if (!refs.overrideList) return;
  refs.overrideList.innerHTML = "";
  const byId = data?.overrides?.byId || {};
  const byExternal = data?.overrides?.byExternalKey || {};
  const entries = [
    ...Object.entries(byId).map(([key, value]) => ({ key: `id:${key}`, value, isId: true })),
    ...Object.entries(byExternal).map(([key, value]) => ({ key: `external:${key}`, value, isId: false })),
  ];
  if (entries.length === 0) {
    refs.overrideList.innerHTML = "<div class=\"admin-muted\">Aucun override actif.</div>";
    return;
  }
  entries.forEach((row) => {
    const wrapper = document.createElement("div");
    wrapper.className = "admin-item";
    wrapper.innerHTML = `
      <div class="admin-item-title">${row.key}</div>
      <div class="admin-item-meta">${Object.keys(row.value || {}).join(", ")}</div>
      <button class="admin-btn admin-danger" type="button">Supprimer</button>
    `;
    const btn = wrapper.querySelector("button");
    if (btn) {
      btn.addEventListener("click", async () => {
        const url = row.isId
          ? `/api/admin/override?id=${row.key.replace("id:", "")}`
          : `/api/admin/override?external_key=${encodeURIComponent(row.key.replace("external:", ""))}`;
        await apiFetch(url, { method: "DELETE" });
        await loadData();
      });
    }
    refs.overrideList.appendChild(wrapper);
  });
}

function renderAnnouncement(data) {
  if (!data?.announcement) return;
  const ann = data.announcement;
  if (refs.annMessage) refs.annMessage.value = ann.message || "";
  if (refs.annEnabled) refs.annEnabled.checked = Boolean(ann.enabled);
  if (refs.annDuration) {
    const remainingMs = Number(ann.expiresAt || 0) - Date.now();
    const hours = remainingMs > 0 ? Math.ceil(remainingMs / 3600000) : 0;
    refs.annDuration.value = hours > 0 ? String(hours) : "";
  }
  const active = Boolean(ann.enabled && ann.message);
  if (refs.annCurrentText) {
    if (!active) {
      refs.annCurrentText.textContent = "Aucune annonce active.";
    } else {
      const expiresAt = Number(ann.expiresAt || 0);
      const expiryLabel = expiresAt ? ` (expire ${new Date(expiresAt).toLocaleString("fr-FR")})` : "";
      refs.annCurrentText.textContent = `${ann.message}${expiryLabel}`;
    }
  }
  if (refs.annClearBtn) {
    refs.annClearBtn.disabled = !active;
  }
}

function renderRequestList(items = []) {
  if (!refs.requestList || !refs.requestEmpty) {
    return;
  }
  refs.requestList.innerHTML = "";
  const list = Array.isArray(items) ? items.slice() : [];
  list.sort((a, b) => {
    const left = Number(a?.updatedAt || a?.createdAt || 0);
    const right = Number(b?.updatedAt || b?.createdAt || 0);
    return right - left;
  });
  if (list.length === 0) {
    refs.requestEmpty.hidden = false;
    return;
  }
  refs.requestEmpty.hidden = true;
  list.forEach((entry) => {
    const status = normalizeRequestStatus(entry?.status || "pending");
    const typeLabel = entry?.type === "tv" ? "Serie" : "Film";
    const year = entry?.year ? ` - ${entry.year}` : "";
    const urlValue = String(entry?.url || "").replace(/"/g, "&quot;");
    const wrapper = document.createElement("div");
    wrapper.className = "admin-item";
    wrapper.dataset.requestId = String(entry?.id || "");
    wrapper.innerHTML = `
      <div class="admin-request-row">
        <div class="admin-item-title">${entry?.title || "Sans titre"}</div>
        <div class="admin-request-meta">${typeLabel}${year}</div>
        <span class="admin-request-status ${status}">${getRequestStatusLabel(status)}</span>
      </div>
      <div class="admin-field admin-request-url">
        <label>URL directe</label>
        <input type="url" placeholder="https://... (mp4 / m3u8)" data-request-url value="${urlValue}" />
      </div>
      <div class="admin-request-actions">
        <select class="admin-select" data-request-status>
          <option value="pending"${status === "pending" ? " selected" : ""}>En attente</option>
          <option value="in_progress"${status === "in_progress" ? " selected" : ""}>En cours</option>
          <option value="refused"${status === "refused" ? " selected" : ""}>Refuse</option>
          <option value="in_catalog"${status === "in_catalog" ? " selected" : ""}>En catalogue</option>
        </select>
        <button class="admin-btn" type="button" data-request-action="approve-url">Valider URL</button>
        <button class="admin-btn admin-danger" type="button" data-request-action="delete">Supprimer</button>
      </div>
    `;
    refs.requestList.appendChild(wrapper);
  });
}

async function updateRequestStatus(id, status, url = "") {
  if (!id) return;
  setAdminRequestStatus("Mise a jour...");
  try {
    await apiFetch("/api/admin/requests/update", {
      method: "POST",
      body: JSON.stringify({ id, status, url }),
    });
    setAdminRequestStatus("Statut mis a jour.");
    await loadData();
  } catch (err) {
    setAdminRequestStatus(err.message || "Erreur mise a jour.", true);
  }
}

async function deleteRequest(id) {
  if (!id) return;
  setAdminRequestStatus("Suppression...");
  try {
    await apiFetch("/api/admin/requests/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    setAdminRequestStatus("Supprime.");
    await loadData();
  } catch (err) {
    setAdminRequestStatus(err.message || "Suppression impossible.", true);
  }
}

function renderTvChannelList(items = []) {
  if (!refs.tvChannelList) {
    return;
  }
  refs.tvChannelList.innerHTML = "";
  const list = Array.isArray(items) ? items.slice() : [];
  if (list.length === 0) {
    refs.tvChannelList.innerHTML = "<div class=\"admin-muted\">Aucune chaine pour le moment.</div>";
    return;
  }
  list.forEach((entry) => {
    const wrapper = document.createElement("div");
    wrapper.className = "admin-item";
    wrapper.dataset.tvId = String(entry?.id || "");
    wrapper.innerHTML = `
      <div class="admin-tv-row">
        <div class="admin-tv-name">${entry?.name || "Sans titre"}</div>
        <div class="admin-tv-meta">${entry?.type || "hls"} • ${entry?.url || ""}</div>
      </div>
      <div class="admin-actions">
        <button class="admin-btn admin-danger" type="button" data-tv-action="delete">Supprimer</button>
      </div>
    `;
    refs.tvChannelList.appendChild(wrapper);
  });
}

async function handleAddTvChannel() {
  if (!refs.tvChannelName || !refs.tvChannelUrl || !refs.tvChannelType) return;
  const name = refs.tvChannelName.value.trim();
  const url = refs.tvChannelUrl.value.trim();
  const type = refs.tvChannelType.value.trim();
  const logo = refs.tvChannelLogo ? refs.tvChannelLogo.value.trim() : "";
  const group = refs.tvChannelGroup ? refs.tvChannelGroup.value.trim() : "";
  if (!name || !url) {
    if (refs.tvChannelStatus) refs.tvChannelStatus.textContent = "Nom et URL requis.";
    return;
  }
  if (refs.tvChannelStatus) refs.tvChannelStatus.textContent = "Ajout...";
  try {
    await apiFetch("/api/admin/tv-channels", {
      method: "POST",
      body: JSON.stringify({ name, url, type, logo, group }),
    });
    if (refs.tvChannelStatus) refs.tvChannelStatus.textContent = "Chaine ajoutee.";
    refs.tvChannelName.value = "";
    refs.tvChannelUrl.value = "";
    if (refs.tvChannelLogo) refs.tvChannelLogo.value = "";
    if (refs.tvChannelGroup) refs.tvChannelGroup.value = "";
    await loadData();
  } catch (err) {
    if (refs.tvChannelStatus) refs.tvChannelStatus.textContent = err.message || "Erreur ajout.";
  }
}

async function deleteTvChannel(id) {
  if (!id) return;
  if (refs.tvChannelStatus) refs.tvChannelStatus.textContent = "Suppression...";
  try {
    await apiFetch("/api/admin/tv-channels", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (refs.tvChannelStatus) refs.tvChannelStatus.textContent = "Supprime.";
    await loadData();
  } catch (err) {
    if (refs.tvChannelStatus) refs.tvChannelStatus.textContent = err.message || "Erreur suppression.";
  }
}

function renderAnalyticsCounters(payload) {
  if (!payload) return;
  if (refs.analyticsLive) refs.analyticsLive.textContent = String(payload.activeNow ?? 0);
  if (refs.analyticsWatching) refs.analyticsWatching.textContent = String(payload.watchingNow ?? 0);
  if (refs.analytics24h) refs.analytics24h.textContent = String(payload.unique24h ?? 0);
  if (refs.analytics48h) refs.analytics48h.textContent = String(payload.unique48h ?? 0);
  if (refs.analyticsTotal) refs.analyticsTotal.textContent = String(payload.totalSeen ?? 0);
  if (refs.analyticsUpdated) {
    const stamp = payload.generatedAt ? new Date(payload.generatedAt).toLocaleString("fr-FR") : "";
    refs.analyticsUpdated.textContent = stamp ? `Maj: ${stamp}` : "";
  }
  if (refs.analyticsStatus) refs.analyticsStatus.textContent = "";
}

function formatAdminStamp(value) {
  const ts = Number(value || 0);
  if (!ts) return "-";
  try {
    return new Date(ts).toLocaleString("fr-FR");
  } catch {
    return "-";
  }
}

function renderHealthCounters(payload) {
  if (!payload) return;
  const data = payload.data || payload;
  const fastflux = data.fastflux || {};
  if (refs.healthLastRun) refs.healthLastRun.textContent = formatAdminStamp(fastflux.healthLastRunAt);
  if (refs.healthLastOk) refs.healthLastOk.textContent = formatAdminStamp(fastflux.healthLastOkAt);
  if (refs.healthFailStreak) refs.healthFailStreak.textContent = String(fastflux.healthFailStreak ?? 0);
  if (refs.healthLastRepair) refs.healthLastRepair.textContent = formatAdminStamp(fastflux.healthLastRepairAt);
  if (refs.healthWarmupOk) refs.healthWarmupOk.textContent = formatAdminStamp(fastflux.warmupLastOkAt);
  if (refs.healthGlobalRepair) refs.healthGlobalRepair.textContent = formatAdminStamp(data.globalRepairEpoch);
  if (refs.healthMeta) {
    const healthIntervalMin = Math.round(Number(fastflux.healthIntervalMs || 0) / 60000);
    const warmupMin = Math.round(Number(fastflux.warmupIntervalMs || 0) / 60000);
    const cooldownMin = Math.round(Number(fastflux.healthCooldownMs || 0) / 60000);
    const threshold = Number(fastflux.healthFailThreshold || 0);
    const stateLabel = fastflux.degraded ? "DEGRADE" : "OK";
    const failWindowMin = Math.round(Number(data.playbackFailWindowMs || 0) / 60000);
    const failCooldownMin = Math.round(Number(data.playbackFailCooldownMs || 0) / 60000);
    const failThreshold = Number(data.playbackFailThreshold || 0);
    refs.healthMeta.textContent = `Etat FastFlux: ${stateLabel} • Health ${healthIntervalMin} min • Warmup ${warmupMin} min • Seuil health ${threshold} • Cooldown ${cooldownMin} min • Auto-repair: ${failThreshold} echec(s) / ${failWindowMin} min (cooldown ${failCooldownMin} min)`;
  }
  if (refs.healthStatus) refs.healthStatus.textContent = "";
}

async function refreshHealth() {
  if (!refs.healthLastRun) return;
  try {
    const payload = await apiFetch("/api/admin/health");
    renderHealthCounters(payload || {});
  } catch (err) {
    if (refs.healthStatus) refs.healthStatus.textContent = err.message || "Erreur health.";
  }
}

function startHealthPolling() {
  if (!refs.healthLastRun) return;
  stopHealthPolling();
  refreshHealth();
  state.healthTimer = setInterval(refreshHealth, 30000);
}

function stopHealthPolling() {
  if (state.healthTimer) {
    clearInterval(state.healthTimer);
    state.healthTimer = 0;
  }
}

async function refreshAnalytics() {
  if (!refs.analyticsLive) return;
  try {
    const payload = await apiFetch("/api/admin/analytics");
    renderAnalyticsCounters(payload.data || {});
  } catch (err) {
    if (refs.analyticsStatus) {
      refs.analyticsStatus.textContent = err.message || "Erreur compteurs.";
    }
  }
}

function startAnalyticsPolling() {
  if (!refs.analyticsLive) return;
  stopAnalyticsPolling();
  refreshAnalytics();
  state.analyticsTimer = setInterval(refreshAnalytics, 30000);
}

function stopAnalyticsPolling() {
  if (state.analyticsTimer) {
    clearInterval(state.analyticsTimer);
    state.analyticsTimer = 0;
  }
}

function setSuggestStatus(message = "", isError = false) {
  if (!refs.suggestStatus) return;
  refs.suggestStatus.textContent = message;
  refs.suggestStatus.style.color = isError ? "#fca5a5" : "";
}

function getCurrentSuggestion() {
  return state.suggestions.queue.length > 0 ? state.suggestions.queue[0] : null;
}

function renderSuggestion(item) {
  if (!refs.suggestTitle || !refs.suggestPoster || !refs.suggestMeta || !refs.suggestOverview || !refs.suggestTags) {
    return;
  }
  if (!item) {
    refs.suggestTitle.textContent = "Aucune suggestion.";
    refs.suggestMeta.textContent = "";
    refs.suggestOverview.textContent = "";
    refs.suggestPoster.style.backgroundImage = "";
    refs.suggestTags.innerHTML = "";
    if (refs.suggestAcceptBtn) refs.suggestAcceptBtn.disabled = true;
    if (refs.suggestSkipBtn) refs.suggestSkipBtn.disabled = true;
    if (refs.suggestNextBtn) refs.suggestNextBtn.disabled = true;
    return;
  }
  const typeLabel = item.type === "tv" ? "Serie" : item.type === "anime" ? "Anime" : "Film";
  const metaParts = [typeLabel];
  if (item.year) metaParts.push(String(item.year));
  refs.suggestTitle.textContent = item.title || "Sans titre";
  refs.suggestMeta.textContent = metaParts.join(" · ");
  refs.suggestOverview.textContent = item.overview || "Pas de resume disponible.";
  refs.suggestPoster.style.backgroundImage = item.poster ? `url('${item.poster}')` : "";
  refs.suggestTags.innerHTML = "";
  const tags = Array.isArray(item.tags) ? item.tags : [];
  tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "admin-tag";
    span.textContent = tag;
    refs.suggestTags.appendChild(span);
  });
  if (refs.suggestAcceptBtn) refs.suggestAcceptBtn.disabled = false;
  if (refs.suggestSkipBtn) refs.suggestSkipBtn.disabled = false;
  if (refs.suggestNextBtn) refs.suggestNextBtn.disabled = false;
}

async function loadSuggestions(reset = false) {
  if (state.suggestions.loading) {
    return;
  }
  state.suggestions.loading = true;
  setSuggestStatus("Chargement...");
  try {
    const type = refs.suggestType?.value || "movie";
    const payload = await apiFetch(`/api/admin/suggestions?type=${encodeURIComponent(type)}&limit=4`);
    const list = Array.isArray(payload.data) ? payload.data : [];
    state.suggestions.queue = reset ? list : list;
    const current = getCurrentSuggestion();
    renderSuggestion(current);
    setSuggestStatus(current ? "" : "Aucune suggestion pour le moment.");
  } catch (err) {
    setSuggestStatus(err.message || "Erreur suggestions.", true);
  } finally {
    state.suggestions.loading = false;
  }
}

async function handleSuggestAccept() {
  const item = getCurrentSuggestion();
  if (!item) return;
  setSuggestStatus("Ajout en cours...");
  try {
    await apiFetch("/api/admin/suggestions/accept", {
      method: "POST",
      body: JSON.stringify({ key: item.key, url: item.importUrl }),
    });
    setSuggestStatus(`Ajoute: ${item.title}`);
    await loadData();
    await loadSuggestions(true);
  } catch (err) {
    setSuggestStatus(err.message || "Ajout impossible.", true);
  }
}

async function handleSuggestSkip() {
  const item = getCurrentSuggestion();
  if (!item) return;
  setSuggestStatus("Mis de cote...");
  try {
    await apiFetch("/api/admin/suggestions/skip", {
      method: "POST",
      body: JSON.stringify({ key: item.key }),
    });
    await loadSuggestions(true);
  } catch (err) {
    setSuggestStatus(err.message || "Action impossible.", true);
  }
}

async function handleSuggestNext() {
  if (state.suggestions.queue.length > 1) {
    state.suggestions.queue.shift();
    renderSuggestion(getCurrentSuggestion());
    return;
  }
  await loadSuggestions(true);
}

async function loadData() {
  const payload = await apiFetch("/api/admin/data");
  state.data = payload.data;
  state.customById = new Map();
  state.customByExternalKey = new Map();
  if (Array.isArray(state.data?.custom)) {
    state.data.custom.forEach((entry) => {
      const id = Number(entry?.id || 0);
      if (id > 0) {
        state.customById.set(id, entry);
      }
      const extKey = String(entry?.external_key || "").trim();
      if (extKey) {
        state.customByExternalKey.set(extKey, entry);
      }
    });
  }
  state.overridesById = state.data?.overrides?.byId || {};
  state.overridesByExternalKey = state.data?.overrides?.byExternalKey || {};
  state.requests = Array.isArray(state.data?.requests) ? state.data.requests : [];
  state.tvChannels = Array.isArray(state.data?.tvChannels) ? state.data.tvChannels : [];
  renderAnnouncement(state.data);
  renderCustomList(state.data.custom || []);
  renderOverrideList(state.data);
  renderRequestList(state.requests);
  renderTvChannelList(state.tvChannels);
  renderSelectedItem();
}

async function checkSession() {
  try {
    const payload = await apiFetch("/api/admin/session");
    if (payload.ok) {
      setVisible(refs.loginCard, false);
      setVisible(refs.app, true);
      setVisible(refs.logoutBtn, true);
      await loadData();
      await loadSuggestions(true);
      startAnalyticsPolling();
      startHealthPolling();
      return;
    }
  } catch {
    // ignore
  }
  setVisible(refs.loginCard, true);
  setVisible(refs.app, false);
  setVisible(refs.logoutBtn, false);
  stopAnalyticsPolling();
  stopHealthPolling();
}

async function handleLogin() {
  if (!refs.password) return;
  const password = refs.password.value.trim();
  refs.loginStatus.textContent = "";
  if (!password) {
    refs.loginStatus.textContent = "Mot de passe requis.";
    return;
  }
  try {
    await apiFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    refs.password.value = "";
    await checkSession();
  } catch (err) {
    refs.loginStatus.textContent = err.message || "Connexion impossible.";
  }
}

async function handleLogout() {
  await apiFetch("/api/admin/logout", { method: "POST" });
  await checkSession();
}

async function saveAnnouncement() {
  if (!refs.annMessage || !refs.annDuration || !refs.annEnabled) return;
  refs.annStatus.textContent = "";
  const message = refs.annMessage.value.trim();
  const durationHours = Number(refs.annDuration.value || 0);
  const enabled = refs.annEnabled.checked;
  try {
    await apiFetch("/api/admin/announcement", {
      method: "POST",
      body: JSON.stringify({ message, durationHours, enabled }),
    });
    refs.annStatus.textContent = "Annonce enregistree.";
    await loadData();
  } catch (err) {
    refs.annStatus.textContent = err.message || "Erreur.";
  }
}

async function clearAnnouncement() {
  if (!refs.annStatus) return;
  refs.annStatus.textContent = "";
  try {
    await apiFetch("/api/admin/announcement", {
      method: "POST",
      body: JSON.stringify({ message: "", durationHours: 0, enabled: false }),
    });
    refs.annStatus.textContent = "Annonce supprimee.";
    await loadData();
  } catch (err) {
    refs.annStatus.textContent = err.message || "Erreur.";
  }
}

async function handleImport() {
  if (!refs.importUrl) return;
  refs.importStatus.textContent = "";
  refs.importResult.textContent = "";
  const url = refs.importUrl.value.trim();
  if (!url) {
    refs.importStatus.textContent = "URL requise.";
    return;
  }
  try {
    const payload = await apiFetch("/api/admin/import", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    const entry = payload.data;
    refs.importResult.textContent = entry
      ? `OK: ${entry.title} (${entry.type})`
      : "Import termine.";
    refs.importUrl.value = "";
    if (entry) {
      setSelectedItem(buildSelectedFromCustom(entry));
    }
    await loadData();
  } catch (err) {
    refs.importStatus.textContent = err.message || "Erreur import.";
  }
}

async function handleOverrideSave() {
  if (!refs.overrideStatusMsg) return;
  refs.overrideStatusMsg.textContent = "";
  const id = Number(refs.overrideId?.value || 0) || 0;
  const externalKey = String(refs.overrideExternalKey?.value || "").trim();
  const patch = {};
  if (refs.overrideTitle?.value) patch.title = refs.overrideTitle.value.trim();
  if (refs.overrideOverview?.value) patch.overview = refs.overrideOverview.value.trim();
  if (refs.overridePoster?.value) patch.poster = refs.overridePoster.value.trim();
  if (refs.overrideBackdrop?.value) patch.backdrop = refs.overrideBackdrop.value.trim();
  if (refs.overrideStatus?.value) patch.availability_status = refs.overrideStatus.value;
  if (refs.overrideHide?.checked) patch.hidden = true;
  try {
    await apiFetch("/api/admin/override", {
      method: "POST",
      body: JSON.stringify({ id, external_key: externalKey, patch }),
    });
    refs.overrideStatusMsg.textContent = "Override applique.";
    await loadData();
  } catch (err) {
    refs.overrideStatusMsg.textContent = err.message || "Erreur override.";
  }
}

async function handleAdminSearch(options = {}) {
  if (!refs.adminSearchQuery || !refs.adminSearchStatus || !refs.adminSearchResults) return;
  const query = refs.adminSearchQuery.value.trim();
  refs.adminSearchStatus.textContent = "";
  refs.adminSearchResults.innerHTML = "";
  if (query.length < 2) {
    refs.adminSearchStatus.textContent = "Requete trop courte.";
    return;
  }
  const seq = (state.searchSeq || 0) + 1;
  state.searchSeq = seq;
  const type = refs.adminSearchType?.value || "all";
  refs.adminSearchStatus.textContent = options.silent ? "Recherche..." : "Recherche...";
  try {
    const payload = await apiFetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
    if (seq !== state.searchSeq) {
      return;
    }
    const purstreamRows = extractSearchRows(payload.purstream || payload.primary || {});
    const fastfluxRows = Array.isArray(payload.fastflux) ? payload.fastflux : [];
    const results = [];
    purstreamRows.forEach((row) => {
      const mapped = normalizePurstreamRow(row);
      if (!mapped) return;
      if (type !== "all" && mapped.type !== type) return;
      results.push({ ...mapped, provider: "purstream" });
    });
    fastfluxRows.forEach((row) => {
      const mapped = normalizeFastfluxRow(row);
      if (!mapped) return;
      if (type !== "all" && mapped.type !== type) return;
      results.push({ ...mapped, provider: "fastflux" });
    });
    refs.adminSearchStatus.textContent = `${results.length} resultat(s).`;
    renderSearchResults(results);
    state.lastQuery = query;
  } catch (err) {
    if (seq !== state.searchSeq) {
      return;
    }
    const message = err.message || "Erreur recherche.";
    if (message.toLowerCase().includes("unauthorized")) {
      await checkSession();
    }
    refs.adminSearchStatus.textContent = message;
  }
}

function scheduleAdminSearch() {
  if (!refs.adminSearchQuery) return;
  if (state.searchTimer) {
    clearTimeout(state.searchTimer);
  }
  const query = refs.adminSearchQuery.value.trim();
  if (query.length < 2) {
    refs.adminSearchStatus.textContent = "Tape au moins 2 lettres.";
    refs.adminSearchResults.innerHTML = "";
    return;
  }
  state.searchTimer = setTimeout(() => {
    handleAdminSearch({ silent: true });
  }, 320);
}

function clearAdminSearch() {
  if (refs.adminSearchQuery) refs.adminSearchQuery.value = "";
  if (refs.adminSearchStatus) refs.adminSearchStatus.textContent = "";
  if (refs.adminSearchResults) refs.adminSearchResults.innerHTML = "";
}

async function handleRepair() {
  if (!refs.repairStatus || !refs.repairResult) return;
  refs.repairStatus.textContent = "";
  refs.repairResult.textContent = "";
  const id = Number(refs.repairId?.value || 0) || 0;
  const externalKey = String(refs.repairExternalKey?.value || "").trim();
  if (!id && !externalKey) {
    refs.repairStatus.textContent = "ID ou external key requis.";
    return;
  }
  try {
    const payload = await apiFetch("/api/admin/repair", {
      method: "POST",
      body: JSON.stringify({ id, external_key: externalKey }),
    });
    const data = payload.data || {};
    refs.repairStatus.textContent = payload.repaired ? "Repare." : "Analyse terminee.";
    refs.repairResult.textContent =
      `Sources: Zenix=${data.purstreamCount ?? 0} | Owned=${data.ownedCount ?? 0} | FastFlux=${data.fastfluxCount ?? 0}`;
    await loadData();
  } catch (err) {
    refs.repairStatus.textContent = err.message || "Erreur analyse.";
  }
}

async function loadOwnedSources() {
  if (!refs.ownedMediaId || !refs.ownedStatus || !refs.ownedList) return;
  const mediaId = Number(refs.ownedMediaId.value || 0);
  const type = refs.ownedType?.value || "movie";
  const season = Number(refs.ownedSeason?.value || 1) || 1;
  const episode = Number(refs.ownedEpisode?.value || 1) || 1;
  if (!mediaId) {
    refs.ownedStatus.textContent = "Media ID requis.";
    return;
  }
  try {
    const payload = await apiFetch(
      `/api/admin/owned?mediaId=${mediaId}&type=${encodeURIComponent(type)}&season=${season}&episode=${episode}`
    );
    const sources = Array.isArray(payload?.data?.sources) ? payload.data.sources : [];
    refs.ownedStatus.textContent = `${sources.length} source(s).`;
    refs.ownedList.innerHTML = "";
    if (sources.length === 0) {
      refs.ownedList.innerHTML = "<div class=\"admin-muted\">Aucune source.</div>";
      return;
    }
    sources.forEach((row) => {
      const wrapper = document.createElement("div");
      wrapper.className = "admin-item";
      wrapper.innerHTML = `
        <div class="admin-item-title">${row.source_name || "Zenix Source"}</div>
        <div class="admin-item-meta">${row.language || "Auto"} • ${row.quality || "Auto"} • ${row.format || "Auto"}</div>
        <div class="admin-item-meta">${row.stream_url || ""}</div>
        <button class="admin-btn admin-danger" type="button">Supprimer</button>
      `;
      const btn = wrapper.querySelector("button");
      if (btn) {
        btn.addEventListener("click", async () => {
          await apiFetch("/api/admin/owned", {
            method: "DELETE",
            body: JSON.stringify({
              mediaId,
              type,
              season,
              episode,
              stream_url: row.stream_url,
            }),
          });
          await loadOwnedSources();
        });
      }
      refs.ownedList.appendChild(wrapper);
    });
  } catch (err) {
    refs.ownedStatus.textContent = err.message || "Erreur.";
  }
}

async function handleOwnedAdd() {
  if (!refs.ownedStatus) return;
  const mediaId = Number(refs.ownedMediaId?.value || 0);
  const type = refs.ownedType?.value || "movie";
  const season = Number(refs.ownedSeason?.value || 1) || 1;
  const episode = Number(refs.ownedEpisode?.value || 1) || 1;
  const stream_url = String(refs.ownedStreamUrl?.value || "").trim();
  if (!mediaId || !stream_url) {
    refs.ownedStatus.textContent = "Media ID et URL requis.";
    return;
  }
  try {
    await apiFetch("/api/admin/owned", {
      method: "POST",
      body: JSON.stringify({
        mediaId,
        type,
        season,
        episode,
        source: {
          stream_url,
          format: refs.ownedFormat?.value || "",
          quality: refs.ownedQuality?.value || "",
          language: refs.ownedLanguage?.value || "",
          source_name: refs.ownedName?.value || "",
          priority: Number(refs.ownedPriority?.value || 0) || 0,
        },
      }),
    });
    refs.ownedStatus.textContent = "Source ajoutee.";
    refs.ownedStreamUrl.value = "";
    await loadOwnedSources();
  } catch (err) {
    refs.ownedStatus.textContent = err.message || "Erreur.";
  }
}

function bindEvents() {
  if (refs.loginBtn) refs.loginBtn.addEventListener("click", handleLogin);
  if (refs.logoutBtn) refs.logoutBtn.addEventListener("click", handleLogout);
  if (refs.annSaveBtn) refs.annSaveBtn.addEventListener("click", saveAnnouncement);
  if (refs.annClearBtn) refs.annClearBtn.addEventListener("click", clearAnnouncement);
  if (refs.suggestType) refs.suggestType.addEventListener("change", () => loadSuggestions(true));
  if (refs.suggestAcceptBtn) refs.suggestAcceptBtn.addEventListener("click", handleSuggestAccept);
  if (refs.suggestSkipBtn) refs.suggestSkipBtn.addEventListener("click", handleSuggestSkip);
  if (refs.suggestNextBtn) refs.suggestNextBtn.addEventListener("click", handleSuggestNext);
  if (refs.importBtn) refs.importBtn.addEventListener("click", handleImport);
  if (refs.overrideSaveBtn) refs.overrideSaveBtn.addEventListener("click", handleOverrideSave);
  if (refs.adminSearchBtn) refs.adminSearchBtn.addEventListener("click", () => handleAdminSearch());
  if (refs.adminSearchQuery) {
    refs.adminSearchQuery.addEventListener("input", scheduleAdminSearch);
  }
  if (refs.adminSearchType) {
    refs.adminSearchType.addEventListener("change", scheduleAdminSearch);
  }
  if (refs.adminSearchClearBtn) {
    refs.adminSearchClearBtn.addEventListener("click", clearAdminSearch);
  }
  if (refs.repairBtn) refs.repairBtn.addEventListener("click", handleRepair);
  if (refs.ownedLoadBtn) refs.ownedLoadBtn.addEventListener("click", loadOwnedSources);
  if (refs.ownedAddBtn) refs.ownedAddBtn.addEventListener("click", handleOwnedAdd);
  if (refs.selectedAutoFixBtn) refs.selectedAutoFixBtn.addEventListener("click", handleSelectedAutoFix);
  if (refs.selectedImportBtn) refs.selectedImportBtn.addEventListener("click", handleSelectedImport);
  if (refs.selectedHideBtn) refs.selectedHideBtn.addEventListener("click", handleSelectedHide);
  if (refs.selectedShowBtn) refs.selectedShowBtn.addEventListener("click", handleSelectedShow);
  if (refs.selectedDeleteBtn) refs.selectedDeleteBtn.addEventListener("click", handleSelectedDelete);
  if (refs.requestList) {
    refs.requestList.addEventListener("change", (event) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (!(target instanceof HTMLSelectElement) || !target.matches("[data-request-status]")) {
        return;
      }
      const wrapper = target.closest("[data-request-id]");
      if (!(wrapper instanceof HTMLElement)) {
        return;
      }
      const id = String(wrapper.dataset.requestId || "").trim();
      if (!id) {
        return;
      }
      const urlInput = wrapper.querySelector("[data-request-url]");
      const urlValue = urlInput instanceof HTMLInputElement ? urlInput.value.trim() : "";
      updateRequestStatus(id, target.value, target.value === "in_catalog" ? urlValue : "");
    });
    refs.requestList.addEventListener("click", (event) => {
      const target = event.target instanceof HTMLElement ? event.target.closest("[data-request-action]") : null;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const wrapper = target.closest("[data-request-id]");
      if (!(wrapper instanceof HTMLElement)) {
        return;
      }
      const id = String(wrapper.dataset.requestId || "").trim();
      if (!id) {
        return;
      }
      if (target.dataset.requestAction === "approve-url") {
        const urlInput = wrapper.querySelector("[data-request-url]");
        const urlValue = urlInput instanceof HTMLInputElement ? urlInput.value.trim() : "";
        updateRequestStatus(id, "in_catalog", urlValue);
        return;
      }
      if (target.dataset.requestAction === "delete") {
        deleteRequest(id);
      }
    });
  }
  if (refs.tvChannelAddBtn) {
    refs.tvChannelAddBtn.addEventListener("click", handleAddTvChannel);
  }
  if (refs.tvChannelList) {
    refs.tvChannelList.addEventListener("click", (event) => {
      const target = event.target instanceof HTMLElement ? event.target.closest("[data-tv-action]") : null;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const wrapper = target.closest("[data-tv-id]");
      if (!(wrapper instanceof HTMLElement)) {
        return;
      }
      const id = String(wrapper.dataset.tvId || "").trim();
      if (!id) {
        return;
      }
      if (target.dataset.tvAction === "delete") {
        deleteTvChannel(id);
      }
    });
  }
}

bindEvents();
checkSession();
