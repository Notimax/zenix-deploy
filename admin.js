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
};

const state = {
  data: null,
  searchSeq: 0,
  searchTimer: 0,
  lastQuery: "",
  selectedItem: null,
  customById: new Map(),
  customByExternalKey: new Map(),
  overridesById: {},
  overridesByExternalKey: {},
};

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

function normalizeNakiosRow(row) {
  const id = Number(row?.id || 0);
  if (!id) return null;
  const title =
    String(row?.title || row?.name || row?.original_title || row?.original_name || "").trim();
  const typeRaw = String(row?.media_type || row?.type || "").toLowerCase();
  const type = typeRaw === "tv" ? "tv" : "movie";
  const year = extractYear(row?.release_date || row?.first_air_date || "");
  const poster = row?.poster_path || "";
  return { id, title, type, year, poster };
}

function buildNakiosImportUrl(row) {
  const type = row.type === "tv" ? "series" : "movie";
  return `https://nakios.site/${type}/${row.id}`;
}

function isAlreadyCustom(row) {
  const custom = state.data?.custom || [];
  if (row.provider === "nakios") {
    return custom.some((entry) => Number(entry?.external_tmdb_id || 0) === row.id);
  }
  if (row.provider === "filmer2") {
    return custom.some((entry) => String(entry?.external_detail_url || "") === String(row.url || ""));
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
          const importUrl = row.provider === "nakios" ? buildNakiosImportUrl(row) : row.url;
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
  if (row.provider === "nakios") {
    return state.data.custom.find((entry) => Number(entry?.external_tmdb_id || 0) === row.id) || null;
  }
  if (row.provider === "filmer2") {
    return state.data.custom.find((entry) => String(entry?.external_detail_url || "") === String(row.url || "")) || null;
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
    tmdbId: row.provider === "nakios" ? Number(row.id || 0) || 0 : 0,
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
  const importUrl = item.provider === "nakios" ? buildNakiosImportUrl(item) : item.url;
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
      const importUrl = row.provider === "nakios" ? buildNakiosImportUrl(row) : row.url;
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
  renderAnnouncement(state.data);
  renderCustomList(state.data.custom || []);
  renderOverrideList(state.data);
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
      return;
    }
  } catch {
    // ignore
  }
  setVisible(refs.loginCard, true);
  setVisible(refs.app, false);
  setVisible(refs.logoutBtn, false);
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
    const purstreamRows = extractSearchRows(payload.purstream || {});
    const nakiosRows = Array.isArray(payload.nakios?.results) ? payload.nakios.results : [];
    const filmer2Rows = Array.isArray(payload.filmer2) ? payload.filmer2 : [];
    const results = [];
    purstreamRows.forEach((row) => {
      const mapped = normalizePurstreamRow(row);
      if (!mapped) return;
      if (type !== "all" && mapped.type !== type) return;
      results.push({ ...mapped, provider: "purstream" });
    });
    nakiosRows.forEach((row) => {
      const mapped = normalizeNakiosRow(row);
      if (!mapped) return;
      if (type !== "all" && mapped.type !== type) return;
      results.push({ ...mapped, provider: "nakios" });
    });
    filmer2Rows.forEach((row) => {
      const mapped = {
        id: Number(row?.id || 0) || 0,
        title: String(row?.title || "").trim(),
        type: String(row?.type || "movie").toLowerCase() === "tv" ? "tv" : "movie",
        year: row?.year || "",
        url: String(row?.url || "").trim(),
      };
      if (!mapped.title || !mapped.url) return;
      if (type !== "all" && mapped.type !== type) return;
      results.push({ ...mapped, provider: "filmer2", url: mapped.url });
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
      `Sources: Zenix=${data.purstreamCount ?? 0} | Owned=${data.ownedCount ?? 0} | Nakios=${data.nakiosCount ?? 0}`;
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
}

bindEvents();
checkSession();
