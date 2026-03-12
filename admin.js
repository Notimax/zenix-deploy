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
};

const state = {
  data: null,
};

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
      <div class="admin-item-meta">ID: ${entry.id} • ${entry.type} • ${entry.external_key || ""}</div>
      <button class="admin-btn admin-danger" type="button">Supprimer</button>
    `;
    const btn = wrapper.querySelector("button");
    if (btn) {
      btn.addEventListener("click", async () => {
        await apiFetch(`/api/admin/custom?id=${entry.id}`, { method: "DELETE" });
        await loadData();
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
  renderAnnouncement(state.data);
  renderCustomList(state.data.custom || []);
  renderOverrideList(state.data);
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

function bindEvents() {
  if (refs.loginBtn) refs.loginBtn.addEventListener("click", handleLogin);
  if (refs.logoutBtn) refs.logoutBtn.addEventListener("click", handleLogout);
  if (refs.annSaveBtn) refs.annSaveBtn.addEventListener("click", saveAnnouncement);
  if (refs.importBtn) refs.importBtn.addEventListener("click", handleImport);
  if (refs.overrideSaveBtn) refs.overrideSaveBtn.addEventListener("click", handleOverrideSave);
}

bindEvents();
checkSession();
