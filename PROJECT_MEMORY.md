# Zenix Project Memory

Last update: 2026-03-16

## Core product constraints
- Domain: `https://zenix.best`
- SEO:
  - target brand query indexing for `zenix` and `zenix stream` with strong title/meta/schema.
  - keep canonical domain set to `zenix.best` (no duplicate host indexing).
  - maintain `robots.txt` + `sitemap.xml` consistency with canonical URL.
  - keep icon stack coherent with Zenix branding (`favicon.svg`, `favicon.ico`, png icons, `og:image`).
- Mobile priority: iPhone Safari playback stability
- Toast notifications: desktop only (no mobile toast)
- Toast placement: bottom-right on desktop
- Recommendation strategy:
  - "Pour toi" excludes watched and liked titles
  - Focus on unseen content based on searches, likes, and watch history

## Current external provider (2026-03-16)
- FastFlux is now the only external provider for movies/series.
- Nakios / Filmer2 / Movix / Noctaflix / YouTube integrations are disabled.
- Supplemental catalog + calendar + /api/zenix-source + admin search/import/suggestions use FastFlux.
- VPS env required: `FASTFLUX_API_KEY` (optional tuning envs: `FASTFLUX_MOVIES_PAGES_PER_FEED`, `FASTFLUX_MOVIES_MAX_PAGES_PER_FEED`,
  `FASTFLUX_SERIES_PAGES_PER_FEED`, `FASTFLUX_SERIES_MAX_PAGES_PER_FEED`, `FASTFLUX_FEED_PAGE_SIZE_ESTIMATE`, `FASTFLUX_CATALOG_CACHE_MS`).
- c299 follow-up:
  - Frontend accepts only external provider `zenix` (FastFlux) and blocks external anime rows.
  - Filmer2 merge path removed; external rescue uses Zenix/FastFlux only.
  - Admin data auto-prunes disallowed external custom entries.
- c300 follow-up:
  - FastFlux sources now keep their label (`FastFlux`) and show a FastFlux badge in player chips.
- c301 follow-up:
  - FastFlux source lookup retries the opposite media type (movie/tv) when the first pass is empty.
- c302 follow-up:
  - FastFlux external entries now override Purstream duplicates.
  - External playback uses FastFlux sources only.
- c303 follow-up:
  - Cars : Quatre roues now prefers FastFlux sources (tv fallback) before debug sources.
- c304 follow-up:
  - Admin repair now retries FastFlux with movie/tv fallback and year-less lookup when needed.
- c305 follow-up:
  - Player repair button label updated to "CLIQUE ICI POR REPARER".
- c306 follow-up:
  - Added asset version guard and JS/CSS preloads + inline fallback to reduce blank UI risk.
- c307 follow-up:
  - Boot retry now arms on DOMContentLoaded (not just window load) and adds an inline watchdog reload if boot never completes.
  - Init no longer blocks on the initial catalog fetch (3.2s max wait) so popups + UI render even if API stalls; catalog refresh renders once it arrives.
- c308 follow-up:
  - CSS fallback now arms on DOMContentLoaded to avoid unstyled pages when load stalls.
  - Core ref rehydration + critical DOM guard added to prevent null refs from breaking nav/popups/player; one-time reload if DOM is incomplete.
- c309 follow-up:
  - Inline JS fallback now triggers only on core script error to avoid double-load `Identifier has already been declared` crashes.
- c310 follow-up:
  - Booting flag prevents fallback/watchdog JS injection while main script is executing (avoids duplicate const errors).
- c311 follow-up:
  - `.m3u8` URLs containing `/embed/` are now treated as HLS (not iframe) in server + frontend, so FastFlux sources proxy correctly on iOS.
- c312 follow-up:
  - Frontend embed detection now ignores `.m3u8` even when format says embed (forces proxy HLS on iOS).
- c313 follow-up:
  - Boot watchdog no longer reinjects zenix.js when core is already loaded or a boot error is flagged
    (prevents duplicate-const crashes). It triggers a recovery kick instead.
  - Added `window.__zenixKick` so inline watchdogs can request UI recovery without reloading scripts.
  - Frontend now forces proxy-only playback for fastflux/xalaflix/fsvid hosts (except r1 direct),
    keeping proxy routing consistent with FSVID rules.
- c314 follow-up:
- Proxy-only enforcement now inspects the proxy target host, so xalaflix/fastflux URLs remain
  proxy-only even when the source URL is already wrapped by /api/hls-proxy.

## c315 follow-up (2026-03-16)
- Adblock now runs in soft mode: UI stays visible and interactive even when a blocker is detected.
- Support strip shows a "lecture bloquee" message while adblock is active.
- Gate now protects playback endpoints only; catalog/calendar/search/media/seasons are exempt so UI always loads.
- Cache-bust updated to `20260316-c315`.

## c316 follow-up (2026-03-16)
- HLS proxy now preserves referer across redirects; playlist rewrites use the final URL (FastFlux CDN fix).
- External FastFlux items no longer swap to internal duplicates (FastFlux stays preferred).
- Card meta cleaned: runtime text removed, year displayed as a pill.
- Mobile nav redesigned with left drawer (hamburger), topbar on mobile shows Zenix + search + online badge.
- Announcement banner stickiness now follows topbar height to avoid half-scroll on phone.

## c317 follow-up (2026-03-16)
- Admin analytics counters added (live/24h/48h/total) and total persists across restarts.
- Discord join popup icon centering refined.

## c318 follow-up (2026-03-16)
- Mobile navbar now uses drawer only (no horizontal category pills on phone).
- FastFlux strict title matching tightened to prevent wrong-film playback.
- FastFlux embed player links are allowed when needed; format detection prefers real media extensions.

## c319 follow-up (2026-03-16)
- FastFlux title search now only accepts strict title/year matches when tmdbId is missing (prevents wrong-film playback).
- FastFlux format detection now prefers real file extensions; embed player links stay embed (no proxy).
- Mobile nav drawer enforced across all mobile blocks (no horizontal pills on phone).

## c320 follow-up (2026-03-17)
- Added lightweight source probe to filter obviously invalid playback URLs and auto-add proxy fallback.
- Mobile topbar hides the Z logo and shows the online badge next to the Zenix title.

## c321 follow-up (2026-03-17)
- External (FastFlux) items now expose only FastFlux sources in the player.
- Proxied MP4 sources are treated as valid playback candidates (fixes FastFlux MP4 on mobile).
- Mobile topbar badge moved to the far right (next to search), spaced from the title.

## c322 follow-up (2026-03-17)
- Adblock detection now double-checks before marking blocked (reduces false positives).
- Adblock detection no longer clears the last gate token (prevents sudden playback lockouts).
- Gate token keepalive refresh added (avoids mid-session expiry).
- Mobile search input padding reduced so placeholder text fits on phone.
- Mobile nav drawer styling polished.

## c323 follow-up (2026-03-17)
- Playback now silently refreshes the gate token on each “Démarrer”.
- If the refresh succeeds, adblock false-positives are cleared.

## c324 follow-up (2026-03-17)
- Player opening force-closes Discord/Backup gates and clears lingering lock classes.
- Discord/Backup gates never show while player/detail overlays are open.
- Mobile nav drawer height uses dynamic viewport units (fixes top-of-page cut-off).
- Mobile cover warmup refreshed after closing player/detail for smoother scrolling.

## c325 follow-up (2026-03-17)
- Topbar now accounts for iOS safe-area (prevents cut-off at top before scroll).
- VisualViewport events refresh topbar height on mobile address bar changes.

## c326 follow-up (2026-03-17)
- Mobile navbar redesigned as a full-screen streaming overlay.
- Drawer now slides up full height with premium backdrop styling.

## c327 follow-up (2026-03-17)
- Mobile search input font-size forced to 16px to prevent iOS zoom on focus.

## c328 follow-up (2026-03-17)
- Mobile nav overlay now shows a blurred catalogue preview background.
- Mobile nav items now include category icons + glow on press.

## c329 follow-up (2026-03-17)
- Player auto-validation now triggers an automatic repair if no reader validates.
- After auto-repair, validation is re-run (2s per reader) and the first valid reader is locked.
- If no reader works after repair, player shows: "Aucun lecteur en marche. Mentionner sur Discord \"Astrax\"."

## c330 follow-up (2026-03-17)
- Mobile nav category icons refreshed (Films/Séries/Anime).
- Calendar taps are now safe-touch (scroll no longer opens titles).
- Backup popup now shows only once per session (no repeated reopen after refresh).

## c331 follow-up (2026-03-17)
- Backup popup now uses session-only gating (no 24h suppression), so it appears after Discord on each new session.

## Visual system policy (c137)
- Keep unified visual tokens across the UI:
  - coherent radii/shadows/spacing
  - typography hierarchy (display headings + readable body text)
  - premium layered background (gradient + light grain texture)
- Navigation:
  - topbar must stay glassmorphism-like and readable
  - desktop navbar keeps animated active indicator
  - if nav overflows on desktop, use overflow menu (`Plus`) instead of clipping
  - mobile uses fixed bottom tabbar
- Cards and statuses:
  - poster ratio remains consistent (`2/3`) across grids
  - badges/ribbons must be coherent by status (`Nouveau`, `Bientot dispo`, `En attente`)
  - continue-progress is displayed directly on cards
  - keep skeleton loading states for covers/details while images resolve
- Player:
  - source selection remains chip-based (not raw select)
  - show readable source metadata (language/quality/format/source name + compatibility)
  - keep playback step timeline visual (`Connexion`, `Fallback`, `Lecture`)
- Layout polish:
  - maintain visual framing for sponsor zones (separated from core content)
  - keep footer and design-updates section styled and consistent with theme switch.
  - startup splash keeps current intro but ends with a cinematic logo-out phase:
    - class flow: `is-ending` then `is-leaving`
    - letter burst + light sweep + backdrop transparency transition before app reveal.
  - user-directed rollback (c139):
    - navbar + category section visuals reverted to legacy look.
    - keep modern look in player/start menu and detail modal.
  - c140 tuning:
    - legacy background restored for browse/category surfaces.
    - category cover rendering forced to immediate visibility (no skeleton opacity gating).
    - category grids use immediate rendering mode to reduce delayed appearance artifacts.
  - c141 follow-up:
    - homepage `Tendances` removed from UI and runtime render path.
    - `FREE` chip and footer status/version block removed.
    - mobile nav restored to tabbar mode on phone widths (desktop nav hidden on small screens).
    - safe tap handling hardened against scroll/touch ghost-open on cards.
    - calendar type resolver now prioritizes explicit/anime entry signals before stale ID map hints.
  - c142 follow-up:
    - mobile navbar moved back to top horizontal nav; bottom tabbar hidden again on phone.
    - `Haut` button hidden on compact/mobile viewport.
    - category cover loading tuned for faster/fuller first paint (higher eager budgets + render batching + warmer detail hydration).
  - c143 follow-up:
    - player source chip UI cleaned up for desktop + phone to avoid overlapping labels.
    - source metadata now uses pill layout (language/quality/format) with truncation safety.
    - source chip header now separates source number and compatibility badge for better readability.
  - c144 follow-up:
    - mobile top navbar now enforces horizontal swipe behavior with non-shrinking category pills.
    - sponsor sections bypass content-visibility deferral; native iframe is eager-loaded with larger mobile heights.
    - category cover loading aggressively boosted (eager/priority limits + warmup budgets + larger immediate render threshold).
  - c145 follow-up:
    - cover assignment no longer waits on a separate image preloader gate before applying new card cover URLs.
    - detail cover hydration now runs with bounded concurrency to reduce request bursts and improve cover fill consistency.
    - browse/category/sponsor sections and grids now force visible rendering path (no deferred content-visibility) for instant category display.
  - c146 follow-up:
    - category/image loading switched from aggressive mass-eager to staged budgets to reduce pending covers in large views.
    - large category render-all-at-once threshold lowered to avoid saturating desktop/mobile rendering and networking.
    - cover prime + detail-hydration limits rebalanced to prioritize above-the-fold reliability first.
  - c148 follow-up:
    - initial catalog warmup no longer collapses to hard fallback when a later warmup page fetch fails after page 1 already succeeded.
    - initial catalog first paint is now non-blocking: page 1 is loaded first, then warmup pages/supplemental merge continue asynchronously.
  - c149 follow-up:
    - root page scrollbar is visually hidden across modern browsers while keeping scrolling enabled.
  - c151 follow-up:
    - startup splash timing reduced by ~1 second (`STARTUP_SPLASH_MIN_MS` and `STARTUP_SPLASH_MAX_MS` lowered).
    - startup ending now triggers a short low-volume cinematic chime via WebAudio (best effort; autoplay policy may block on some browsers).
  - c152 follow-up:
    - calendar mobile layout hardened for phone widths.
    - toolbar now stacks cleanly with full-width search and refresh action.
    - type filters are swipeable horizontally instead of wrapping/compressing.
    - calendar cards use single-column layout on phone for better legibility.
  - c153 follow-up:
    - detail modal and player surfaces now visually hide scrollbars while preserving scroll behavior.
    - applied to overlay/panel containers and player source chips for cleaner modal/player UI.
- c154 follow-up:

## Admin + announcement (c201, 2026-03-12)
- Private admin panel at `/admin` with server-side password (env `ZENIX_ADMIN_PASSWORD`).
- Admin API endpoints: `/api/admin/*` + public `/api/announcement`.
- Admin can set announcement (duration), import titles by URL (Nakios/Anime-Sama),
  and apply overrides (title/overview/poster/status/hidden).
- Announcement banner is shown on site (desktop + mobile) when active.

## c202 follow-up (2026-03-12)
- Adblock gate now exempts `/api/admin/*` and `/api/announcement` to keep admin login functional under adblock.
- External playback can query internal search for a Purstream candidate when Nakios has no sources.

## c203 follow-up (2026-03-12)
- Admin session cookie `Path` set to `/` so `/api/admin/*` receives it (fixes admin login showing nothing).

## c204 follow-up (2026-03-12)
- Added a CSS load guard in `index.html` that retries `zenix.css` if the stylesheet fails to attach.
- Cache-bust version updated for `zenix.css` + `zenix.js` to reduce stale/unstyled refreshes.

## c205 follow-up (2026-03-12)
- External items now merge owned sources + Nakios sources, then add relay proxies to maximize readers.

## c206 follow-up (2026-03-12)
- Admin search endpoint returns Purstream + Nakios results for fast import.
- Admin repair endpoint fills missing metadata/tmdbId for custom entries and reports source counts.
- Admin owned-sources manager allows attaching manual sources to any media id.

## c207 follow-up (2026-03-12)
- Filmer2 integration added: catalog parsing + detail sources/episodes extraction.
- Filmer2 titles are merged into supplemental catalog with Nakios-aware dedupe.
- New endpoints: `/api/filmer2-source`, `/api/filmer2-seasons`.
- Admin import/search supports Filmer2 URLs and search results.
- Added public `/api/filmer2-search` endpoint for title lookups.
- Share buttons now use native `navigator.share` when available (fallback copy).
- Pending playback now triggers auto-rescue (Purstream search -> Filmer2 sources) before showing "En attente".
- Admin search is live (debounced) with Auto-fix + Selection actions; IDs are auto-filled on selection.
    - added a themed anti-adblock access gate (desktop + mobile) with live retry/unlock flow.
    - gate blocks interaction while adblock is detected, then restores access immediately after successful recheck.
    - copy explains free model funding (small non-intrusive ads for hosting/domain).
  - c155 follow-up:
    - anime provider policy tightened: Nakios is excluded from anime catalog/source paths.
    - calendar anime classification is now restricted to Anime-Sama sourced entries.
  - c156 follow-up:
    - detail modal action buttons now include icons with labels (start/like/dislike and related actions).
    - dynamic detail button label updates preserve icon markup via `.btn-label` updates.
  - c157 follow-up:
    - player source chips no longer render raw host/provider names.
    - source chip bottom tag now uses neutral text only (`Source standard` / `Source premium`).
    - this explicitly prevents exposing labels like `zebi.xalaflix.design`, `api.nakios.site`, or `cdn...` in the UI.
  - c158 follow-up:
    - catalog scroll sync now uses append-only rendering when new pages extend the current list.
    - full grid rebuild is avoided during infinite scroll if already-rendered cards match incoming prefix order.
    - objective: no visible refresh/flicker while users scroll through films/series.
  - c160 follow-up:
    - calendar covers now prefer the same internal cover resolution path as catalog/new-release cards.
    - added calendar catalog/title match helper so calendar rows can inherit local poster quality when available.
    - calendar image loading/fetch priority now follows shared card image profile budgets for consistency.
  - c161 follow-up:
    - mobile catalog layout is now forced to 2 columns (catalog-grid) at <=740px.
    - applied as a late CSS override to prevent earlier responsive blocks from reverting to 3 columns.
  - c162 follow-up:
    - calendar anime/type resolver now treats anime as valid only from Anime-Sama sources in calendar view.
    - anime-like non-Anime-Sama rows are excluded from calendar merge rendering to avoid serie/anime cross-contamination.
    - player source chip display now sanitizes labels and removes provider-origin bubble tags from UI.
  - c163 follow-up:
    - source quality labels are now strict-normalized to quality tokens only (`2160p/1440p/1080p/720p/480p/360p/4K/HD/SD`).
    - provider/raw quality strings are hidden (`Auto` fallback) to prevent any source-origin disclosure in UI.

## Streaming/source policy
- External embed fallback sources (e.g. generic `vidsrc`) are removed.
- Keep FR-first behavior:
  - preferred order: `VF`, `VOSTFR`, `MULTI`, then `VO`
  - avoid pure `VO` when a French-friendly source exists
- Auto-switch source must trigger when playback is blocked.
- Player loading UX:
  - show styled in-player loading animation while source is connecting.
  - hide loader as soon as playback starts (`play/playing`) or on terminal error state.
- Player controls UX:
  - quick action button row in player was removed from UI to keep layout clean.
  - keyboard shortcuts remain available (`space/k`, arrows, `f`, etc.).
- Desktop playback resize-loop hardening:
  - nav-fit recalculation is deferred while player/detail overlays are open.
  - deferred nav-fit recalculation is flushed on overlay close.
  - CSS scrollbar gutter is kept stable to avoid width/scrollbar oscillation on laptop resolutions.
- Added iOS-specific resilience:
  - if native HLS manifest playback fails, fallback to direct TS segment chain playback.
  - this is intended to avoid instant playback block in iPhone/WebKit edge cases.
  - iOS bootstrap sequence is optimized:
    - shorter native HLS bootstrap timeout.
    - segment fallback is attempted before decoded HLS blob fallback on iOS.
    - iOS segment fallback timeouts are tighter for faster source recovery.
  - segment fallback chain is capped when alternate sources exist, to reduce repeated timeline resets.
  - source ordering for movies is now stricter at runtime: `VF`, then `MULTI`, then `VOSTFR`.
  - when audio tracks are exposed, player attempts to force French track.
  - hard filter now removes known non-playable embed/gate URLs before playback (ad-gate hosts, store links).
  - for movies, direct media formats (`hls/mp4/webm/dash`) are prioritized and embeds are dropped when at least one direct source exists.
  - auto fallback reaction was tightened:
    - playback guard interval reduced.
    - startup stall and status-driven recovery thresholds reduced for faster source switch.
- Frontend detail warmup hardening:
  - `ensureDetails()` now caches missing sheet IDs (`detailsMissing`) and skips repeat `/api/media/{id}/sheet` calls.
  - external provider IDs are excluded from Purstream sheet fetches to avoid mass 404 noise.
- Owned source providers supported in backend:
  - `cloudflare_stream` (`customer_code` + `uid`)
  - `bunny_stream` (`pull_zone_url` + `video_id`)
  - Intended for legal/self-hosted VF streams.
- Legacy providers removed from runtime:
  - `pidoov.com`
  - `notarielles.fr`
  - `rendezvousmusical.fr`
- Nakios provider integration (owner-confirmed):
  - Backend endpoint `/api/nakios-source` resolves movie/episode fallback sources using `tmdbId`
    or title-based lookup (`title + type + year`) against `api.nakios.site`.
  - Frontend source merge now uses Nakios as the external fallback pool for movies and series.
  - Supplemental catalog endpoint `/api/catalog/supplemental` is now fed by Nakios movie/series feeds only.
  - Supplemental rows carry `external_provider: nakios` and `external_tmdb_id` for source resolution.
  - Calendar overview still merges supplemental entries and now exposes Nakios as the supplemental source link.
  - Tuning keys:
    - `NAKIOS_CATALOG_PAGES_PER_FEED`
    - `NAKIOS_LOOKUP_CACHE_MS`
    - `SUPPLEMENTAL_CATALOG_CACHE_MS`
    - `SUPPLEMENTAL_CATALOG_PAGE_SIZE`
    - `SUPPLEMENTAL_CALENDAR_LIMIT`
  - Availability automation:
    - backend annotates supplemental rows with availability status (`available` / `pending`) by probing Nakios sources with cache.
    - calendar cards show `En attente` badge for pending titles and suppress direct detail opening while pending.
    - frontend suppresses `Nouveau` badge for pending titles.
    - semantic dedupe now prefers available entries over pending entries.
  - iOS auto-switch hardening:
    - playback guard is active even during segment fallback sessions.
    - bootstrap stall at `readyState=0` now triggers source failure instead of waiting indefinitely.
    - fallback-stall guard forces source switch when `Fallback iOS actif...` remains blocked.
    - mobile auto-switch can now use premium fallback candidates when free-path chain is exhausted.
    - `IOS_SEGMENT_CHAIN_MAX` raised to avoid premature forced hops between sources.
  - c150 provider strategy hardening:
    - semantic dedupe keeps internal provider ownership when internal and external rows collide.
    - episode loader now runs Purstream and Nakios fetch in parallel with soft fallback windows.
    - if Purstream is slow/empty, Nakios preloaded sources are injected immediately.
    - external TV rows can switch to internal Purstream twin only when Purstream episode stream is verifiably playable.
    - player route/state now follows the effective selected provider item.
  - c155 anime policy:
    - Nakios sources are skipped for anime playback merges.
    - Nakios anime rows are dropped at catalog normalization stage.
    - calendar anime lane is Anime-Sama only (non Anime-Sama anime rows are rejected).

## Mobile robustness
- Startup splash must never block app forever.
- Keep a hard timeout fallback to force-hide splash and unlock body scroll.

## Sponsor ad policy
- Sponsor remains restricted to UI slots (`Sponsorise` sections only: home/catalog/detail).
- Native script runs inside a sandboxed iframe (`allow-scripts allow-same-origin`) mounted in sponsor slots.
- Top document must not inject ad script tags directly (`maddenwiped.com` should stay iframe-contained).
- Objective: keep sponsor impressions in dedicated blocks while minimizing forced top-level redirects/popups.
- Anti-adblock flow:
  - adblock detection uses a bait probe and periodic checks.
  - when detected, access gate is shown and main UI interaction is locked until user disables blocker and rechecks.

## In-app browser loading policy
- Detect in-app/webview environments (including Snapchat) at runtime.
- Apply `body` flags:
  - `in-app-browser`
  - `snap-browser` (when Snapchat detected)
- In in-app mode:
  - disable `content-visibility` optimization on key sections/grids
  - use direct cover image assignment (skip preload gate) for first paint reliability.

## Source language labeling policy
- Keep all sources; never remove a source only because language metadata is uncertain.
- Source language label must be reconciled from:
  1) upstream language field
  2) source name hints
  3) source URL hints
- If metadata conflicts between `VF` and `VOSTFR`, prefer `MULTI` instead of a wrong hard label.
- During playback, if audio tracks reveal French or multi-audio, update active source label accordingly.

## iPhone auto-switch behavior
- On mobile/iPhone, startup stall detection is intentionally more aggressive than desktop:
  - shorter guard interval
  - shorter startup/status recovery thresholds
  - quicker failover on prolonged `connexion/chargement/fallback` states.

## Webhook analytics policy
- Discord webhook stats are designed for ops readability:
  - active users + active IPs + 24h totals
  - country counters (IP-based)
  - device/platform/browser counters
  - top active pages
- Webhook includes active IP lines (context-rich) in dedicated embeds.
- Country enrichment is best-effort with cached GEO lookup and provider fallback.
- Keep public `/api/analytics/webhook-status` summary rich but avoid exposing full raw IP list there.

## Deployment workflow
- Main code repo remote: `origin` (`Notimax/zenix`)
- Public deploy mirror remote: `deploypublic` (`Notimax/zenix-deploy`)
- Typical release:
  1. commit on `main`
  2. push `origin main`
  3. push `deploypublic main`
  4. verify `https://zenix.best` serves latest `zenix.js?v=...`

## Verification checklist (before marking done)
- iPhone 13 simulation (WebKit) run at least 3 x 20s on target title.
- For deeper iOS audits, run stress battery:
  - `node __tmp_ios13_20x20_probe.js`
  - target: 10 films + 10 series, 20s each
  - inspect resets/stalls/fatal per run and iterate until stable.
- Confirm no mobile toast visible.
- Confirm startup splash disappears on mobile.
- Confirm source fallback behavior in player status and source selector.
- For iOS fallback validation, expect statuses like `Fallback iOS actif...` then `Lecture en cours.` and segment progression.

## Mandatory test failure loop
- If a playback test fails (block, freeze, error, micro bug), never stop at diagnostics.
- Apply a fix immediately, then rerun the same test conditions.
- Keep iterating fix + retest until all mandatory checks are green.

## c164 follow-up (2026-03-09)
- Calendar merge/render path now prioritizes provider rows (`purstream`, `animeSama`, `supplemental`) with policy filtering before compact dedupe.
- Anime lane enforcement strengthened in both frontend and backend:
  - frontend calendar policy keeps anime rows only when Anime-Sama source checks pass.
  - backend Nakios catalog builder now drops likely anime TV entries before supplemental exposure.
- Calendar render budget raised to `420` rows for dense months.
- Phone calendar cards now render in 2-column layout inside `#calendarSection`.
- Catalog scroll synchronization now uses visible-gain batching (`+30` target) to reduce perceived incremental refresh.
- Added loose semantic dedupe and tolerant provider title compatibility checks to reduce duplicate/mis-matched fallback swaps.

## c165 follow-up (2026-03-10)
- Anime sources are now strictly Anime-Sama only at playback merge (non Anime-Sama anime sources are dropped).
- Anime-Sama Sibnet probe accepts catalog URL hints; Sibnet source is injected first when missing.
- Added HLS manifest language probing (cached) to correct mislabeled `VOSTFR` -> `VF/MULTI` when audio metadata indicates French.
- Movie playback startup no longer blocks on Nakios; owned sources start immediately and Nakios merges in background.
- Playback guard now detects early hard stalls even if `readyState` stays high.
- Discord stats message can be pinned via `DISCORD_STATS_MESSAGE_ID` to prevent duplicate logs on restarts.
- Added Playwright dependency for local brute tests.
- Local brute matrix (F1 + Mercredi, 2026-03-10): total 8, passed 8, failed 0.
- Anime Sibnet probe (Hunter x Hunter S1E1) resolved to Anime-Sama Sibnet VOSTFR.

## c166 follow-up (2026-03-10)
- Anime-Sama backend now returns multiple hoster URLs per episode (not only Sibnet).
- Frontend keeps Anime-Sama sources via `origin=anime-sama` tagging, so VF hosters remain available.
- Anime language preference now tries VF first, with automatic fallback to VOSTFR when VF missing.
- Frontend VF lookup now falls back to VOSTFR on 404/timeout (prevents empty anime source lists).
- Anime source ordering prefers direct HLS/MP4 before embeds.
- Local brute matrix (c166, 2026-03-10): total 8, passed 8, failed 0.

## c167 follow-up (2026-03-10)
- Anime panel language inference expanded (VF labels like `version fr`, `francais`, `french` are recognized).
- Panel selection now uses inferred label language when path does not contain explicit `vf/vostfr`.
- Episodes parser now accepts `var/let/const` (and bare) `epsN` arrays to keep multi-hoster sources visible.
- Local brute matrix (c167, 2026-03-10): total 8, passed 8, failed 0.

## c168 follow-up (2026-03-10)
- Anime playback now keeps all readers (Anime-Sama + internal + Nakios) instead of filtering to Anime-Sama only.
- Source ordering is re-sorted by score after merge to prioritize VF/MULTI over VOSTFR/VO.
- This supersedes the earlier “anime sources restricted to Anime-Sama” policy for playback only.

## c169 follow-up (2026-03-10)
- Anime VF override now probes hidden `/vf` panels even if missing in the panel list.
- Panel selection now prefers exact `saisonN/` paths over `saisonNhs/` when both exist.

## c170 follow-up (2026-03-10)
- Ignore spurious HTML5 `error` events with code `0` to reduce false auto-switch resets on iPhone.

## c172 follow-up (2026-03-10)
- Anime-Sama fetch now pulls both VF and VOSTFR sources when available (respecting preference order).
- VF remains default, but VOSTFR stays in the pool so auto-switch can recover if VF stalls.
- Local brute matrix (F1 + Mercredi, 2026-03-10):
  - Source: `__tmp_brut_f1_mercredi_matrix_result_local_c172_2026-03-10.json`
  - Summary: total 8, passed 8, failed 0.

## c173 follow-up (2026-03-10)
- Anime playback now keeps only Anime-Sama sources and filters to `VF` / `MULTI` (no VO/VOSTFR).
- VF panel probing now prioritizes exact `saisonN/vf` before `saisonNhs/vf`.
- Anime catalogue search scoring now prefers non-year slugs to avoid wrong series variants (e.g., HxH 1999).

## c174 follow-up (2026-03-10)
- Added `/api/anime-seasons` (Anime-Sama VF) to build seasons/episodes when internal seasons are empty.
- Frontend `ensureSeasons` falls back to Anime-Sama for anime to avoid 0 episode / no source.
- Discord webhook recovery: clears message id on 401/403 and bypasses long backoff when stale.

## c175 follow-up (2026-03-10)
- Anime seasons now load Anime-Sama first to avoid slow internal season fetch on iOS.
- Webhook now bypasses long backoff if no successful push for a while.

## c176 follow-up (2026-03-10)
- Anime titles are auto-marked as anime if Anime-Sama seasons resolve, ensuring sources load.
- Local HXH brute (desktop + iPhone 13 WebKit, 20s): 2/2 passed.
- HXH brute rerun (2026-03-10): 2/2 passed. Source: `__tmp_brut_hxh_matrix_result_local_c177_2026-03-10.json`.

## c177 follow-up (2026-03-10)
- Embed iframe load now soft-resolves after timeout, avoiding long source blocking.
- Embed guard auto-switches when an embedded player stays stuck too long.
- Episode playback primes Anime-Sama seasons before resolving sources to enforce anime-only pool.
- Local HXH brute (2026-03-10): 2/2 passed. Source: `__tmp_brut_hxh_matrix_result_local_c177_embedfix2_2026-03-10.json`.

## c178 follow-up (2026-03-10)
- Anime playback now probes Anime-Sama seasons directly before resolving sources.
- Anime-only tagging only flips when Anime-Sama responds (prevents false anime tagging on regular series).
- Local HXH brute (2026-03-10): 2/2 passed. Source: `__tmp_brut_hxh_matrix_result_local_c178_2026-03-10.json`.

## c179 follow-up (2026-03-10)
- Anime playback now bypasses Purstream/Nakios episode fetches (Anime-Sama only).
- Nakios merge skipped for anime playback to reduce delays and enforce source policy.
- Local HXH brute (2026-03-10): 2/2 passed. Source: `__tmp_brut_hxh_matrix_result_local_c179_2026-03-10.json`.

## c180 follow-up (2026-03-10)
- Empty season caches are no longer persisted (forces retry if Anime-Sama was temporarily unavailable).
- Local HXH brute (2026-03-10): 2/2 passed. Source: `__tmp_brut_hxh_matrix_result_local_c180_2026-03-10.json`.
- Live HXH brute (2026-03-10): 2/2 passed. Source: `__tmp_brut_hxh_matrix_result_live_c180_2026-03-10.json`.

## c181 follow-up (2026-03-10)
- Discord webhook interval raised to 30s (min 15s) to reduce rate-limit 429s.

## Webhook pin fallback (2026-03-11)
- Added a fallback Discord stats message ID in server config to force PATCH updates if state file is missing.

## c182 follow-up (2026-03-11)
- Episodes marked "soon" are revalidated for series/anime; if playable, the soon flag is cleared and titles
  are refreshed from `/api/media/{id}/seasons`.
- Added a dedicated "Episode suivant" button in the player (desktop + mobile).
  It resolves the next playable episode (including next-season progression), updates selects, and launches playback.
- Next-episode button auto-updates on season/episode/language changes and after playback load,
  and disables itself when no next episode exists.

## c183 follow-up (2026-03-11)
- Discord webhook now patches the pinned fallback message ID in addition to the active message ID.
- This prevents stale/zero stats when the pinned message differs from the current message ID.

## c184 follow-up (2026-03-11)
- TV season loading now fast-paths from detail url lists for huge catalogs (ex: Les Simpson),
  avoiding `/media/{id}/seasons` timeouts and restoring episode lists.
- If `/media/{id}/seasons` is empty, frontend builds seasons from `/media/{id}/sheet` urls as fallback.
- Anime-Sama panel detection treats `multi` as VF-compatible, so VF requests keep Multi panels
  and expose more VF/MULTI readers in anime playback.

## c185 follow-up (2026-03-11)
- Header network badge now shows `Total en lignes` with a 40+ active boost (pulls from `/api/analytics/online`).
- Added a Discord join prompt on entry (desktop + mobile), styled like the adblock gate.
- Discord prompt is suppressed while adblock gate is active and is shown once per session.

## c186 follow-up (2026-03-11)
- Added theme filter chips for Films / Series / Anime catalog views (multi-select).
  - filters appear only when not searching and sit above the catalog grid.
  - detail prefetch primes genre tags to keep filtering accurate on big lists.
- Catalog render/cover budgets increased:
  - `INITIAL_CATALOG_WARMUP_PAGES` -> 3
  - `CATALOG_RENDER_CHUNK_MAX` -> 140
- Anime-Sama hoster aggregation expanded:
  - panel resolution cap raised (`ANIME_PANEL_RESOLUTION_LIMIT = 6`) to expose more VF/MULTI readers.
  - `multi` is treated as VF-compatible in Anime-Sama language parsing.
- Provider fallback hardening:
  - anime playback prefers Anime-Sama sources but falls back to existing sources if Anime-Sama is missing.
  - external series seasons can reuse internal provider seasons (fixes missing episode lists on titles like The Rookie).

## c187 follow-up (2026-03-11)
- Supplemental catalog now pulls Nakios `discover` feeds for movies and series.
- Default `NAKIOS_CATALOG_PAGES_PER_FEED` raised to 3 to surface more titles
  (ex: Nakios movie id `1629382` now appears via `movies/discover` page 3).

## c188 follow-up (2026-03-11)
- Theme filter UI switched to a single "Filtre" button that opens a checkbox panel.
- Filter list regrouped (Famille/Jeunesse, Super-heros, etc) and auto-hides empty filters per view.
- Panel is responsive (desktop dropdown, mobile bottom sheet) with clear/apply actions.

## c189 follow-up (2026-03-11)
- Per-episode progress now stores time/duration for series/anime when available (SxEy map).
- Progress saving avoids overwriting saved times with 0 when the player does not expose time.
- Episode resume uses per-episode time when switching season/episode; auto-next starts at 0.

## c190 follow-up (2026-03-11)
- Theme filter panel stacking fixed so the backdrop no longer blocks checkbox clicks.

## c191 follow-up (2026-03-11)
- Nakios supplemental catalog now deepens pages on demand to surface more titles as users scroll.
- Added dynamic page expansion up to `NAKIOS_CATALOG_MAX_PAGES_PER_FEED` with a dedupe cushion.

## c192 follow-up (2026-03-11)
- Adaptive performance tuning uses device/network tiering to scale catalog batch sizes and image budgets.
- Supplemental catalog per-page size now scales with device performance to show more titles on fast devices.

## c193 follow-up (2026-03-11)
- Added preconnect to ad host and early native banner warmup for faster sponsor rendering.
- Sponsor slot shows a lightweight loading placeholder that fades when the iframe initializes.

## c194 follow-up (2026-03-11)
- Added a server-side adblock gate token flow (challenge + proof + short-lived cookie).
  - protected `/api/*` calls now require a valid gate token.
  - adblock overlay removal via DevTools no longer bypasses playback/API access.
- Removed direct upstream API calls from the frontend (proxy-only) to reduce exposed provider names.
- Gate bootstrap now retries on first 403 and uses a neutral proof script path to reduce false positives.

## c196 follow-up (2026-03-11)
- Branded Nakios-facing labels as Zenix in API responses/UI (no provider names exposed in payload labels).
- Added pinned Nakios titles to supplemental catalog: Go Karts + Minions (2015, Rise of Gru) + Moi, Moche et Mechant (1-4).
- Player now pre-issues the gate token before playback to avoid first-load source misses.

## c199 follow-up (2026-03-11)
- Movie playback now retries sources if the initial pool is empty (prevents refresh-needed starts).
- If still empty, shows a clear "En attente" (external/pending) or "Lecture indisponible" message and stops the guard.
- Nakios source timeout increased (frontend + server) to tolerate slower source API responses.
- Go Karts pinned year corrected to 2020 for better matching.

## c200 follow-up (2026-03-11)
- Mobile stream prefetch now warms the first HLS manifest (best-effort) to reduce iOS first-play stalls.
- Added `ZENIX_GATE_DISABLE=1` server flag for local brute tests (gate remains enabled in production).
- Local brute matrix (F1 + Mercredi, 2026-03-11) with gate disabled:
  - Source: `__tmp_brut_f1_mercredi_matrix_result_local_c207.json`
  - Summary: total 8, passed 8, failed 0, `/api/media/*/sheet` 404 count: 0
## c210 follow-up (2026-03-12)
- Added `/api/repair-sources` + `/api/repair-store` endpoints to persist player repair results.
- Admin data now preserves `repairs` entries (TTL pruning in server).
- Episode playback forces external rescue after repeated source failures.
- Filmer2 search retries without year for better title matching.
- Cache-bust updated to `20260312-c210`.


## c211 follow-up (2026-03-13)
- Public API masking hardening:
  - new neutral endpoints `/api/zenix-source` and `/api/zenix-seasons` (frontend uses these)
  - anime aliases `/api/zenix-anime-source` and `/api/zenix-anime-seasons`
  - calendar payload uses `primary`/`anime`/`supplemental` keys, `sourceLinks` removed
  - external detail URLs/keys stripped from calendar + supplemental payloads via `sanitizePublicEntry`
  - anime planning cards now use neutral `source: "anime"` keys (no upstream URLs in payload)

## c212 follow-up (2026-03-13)
- Startup splash is now hidden by default in HTML.
- Added a minimal inline failsafe to force-hide the splash and remove `startup-lock`
  if the JS intro flow does not complete (prevents infinite animation lock).
- Cache-bust updated to `20260313-c212`.

## c214 follow-up (2026-03-13)
- Fixed `zenix.js` parse errors by normalizing UTF-8 output and cleaning invalid escaped
  tokens in nav group logic (restores JS execution).
- Cache-bust updated to `20260313-c214`.

## c215 follow-up (2026-03-13)
- Fixed `isRecommendationView` scope in `renderAll()` to prevent JS crash on load.
- Cache-bust updated to `20260313-c215`.

## c216 follow-up (2026-03-13)
- Gate issuance now uses a shared promise so parallel API calls wait for the token.
- Prevents initial 403 cascades that left the UI empty.
- Cache-bust updated to `20260313-c216`.

## c217 follow-up (2026-03-13)
- Zenix-source retries Nakios lookup with cleaned title + no-year fallback when sources are empty
  (improves Go Karts and other edge matches).
- Pending messaging now ignores stale pending flags for older releases.
- Mobile nav dropdowns: tap handling improved and submenu no longer clipped.
- Cache-bust updated to `20260313-c217`.

## c218 follow-up (2026-03-13)
- Infos is now a direct nav item (no empty submenu).
- Mobile nav toggles use touch-first handler for reliable submenu open on iPhone.
- Submenu overflow unclipped at topbar level on mobile.
- Hero carousel hidden on phone to remove auto-rotating cards at top of categories.
- Cache-bust updated to `20260313-c218`.

## c219 follow-up (2026-03-13)
- Added mobile nav submenu backdrop + fixed-position sheet for dropdowns.
- Dropdowns now open reliably on iPhone with tap-to-close backdrop.
- Cache-bust updated to `20260313-c219`.

## c220 follow-up (2026-03-13)
- Mobile nav dropdowns now use a dedicated sheet with explicit list items.
- Default nav submenu is hidden on mobile to avoid blank overlay.
- Cache-bust updated to `20260313-c220`.

## c221 follow-up (2026-03-13)
- Nav submenu sheet is now created dynamically if missing (cached HTML safe).
- Discover fallback list injected when submenu items are missing.
- Cache-bust updated to `20260313-c221`.

## c222 follow-up (2026-03-13)
- Nav submenu backdrop/sheet now only activate on mobile, preventing desktop blur.
- Cache-bust updated to `20260313-c222`.

## c223 follow-up (2026-03-13)
- Desktop submenu now opens again with overflow visible and no blur/backdrop.
- Cache-bust updated to `20260313-c223`.

## c224 follow-up (2026-03-13)
- Admin custom delete now supports external_key fallback so "Supprimer" works even when the id is missing.
- Admin assets now include a cache-bust param to force admin.js refresh under long cache headers.

## c225 follow-up (2026-03-13)
- Pending status normalization now detects Nakios suggestion/pending flags (suggestion/attente/mise en ligne).
- Pending badge is displayed whenever a title is pending (prevents "Nouveau" on pending items).
- Player source scoring now favors direct formats more and penalizes embeds on mobile for faster starts.
- Playback stall thresholds tightened for quicker auto-switch.
- Cache-bust updated to `20260313-c225`.

## c226 follow-up (2026-03-13)
- Sources display a "Lecture OK" badge after successful playback (per user).
- Sources include a mobile compatibility indicator.
- Cards show a quality badge (HD/Full HD/4K) based on successful playback.
- Desktop hover preview plays a silent 10s clip when a direct MP4/WebM preview is available.
- Cache-bust updated to `20260313-c226`.

## c227 follow-up (2026-03-13)
- Added YouTube playlist support for admin imports.
- Zenix seasons/source endpoints now serve YouTube playlist episodes for external TV entries.
- Playlist episodes map to S1 and return a YouTube embed source.

## c228 follow-up (2026-03-13)
- Card preview now accepts HLS sources (desktop only, hls.js when needed).
- Quality badge defaults to Full HD/4K via global rule if no playback success exists.
- Cache-bust updated to `20260313-c228`.

## c229 follow-up (2026-03-13)
- Added backup-domain popup on zenix.best (zenix.lol, once per day/session).
- Added a static vitrine project at `site/zenix-lol-vitrine` with editable `config.js`.
- Cache-bust updated to `20260313-c229`.

## c230 follow-up (2026-03-13)
- Gate token is now returned by `/api/gate/issue` and stored in localStorage for clients that block cookies.
- Frontend sends `X-Zenix-Gate` header when a token is available.
- Server accepts header token when cookie is missing (keeps adblock gate intact).
- Cache-bust updated to `20260313-c230`.

## c231 follow-up (2026-03-13)
- Backup popup now waits for Discord prompt to close (no collision).
- Backup popup supports share sheet on mobile and shows device-specific bookmark hints.
- Backup URL rendered as a clickable link (opens zenix.lol).
- Cache-bust updated to `20260313-c231`.

## c232 follow-up (2026-03-13)
- Backup popup now waits for the Discord prompt session before showing.
- Added /api/backup-config (public GET + admin POST) with CORS for zenix.lol admin.
- zenix.lol displays current + previous URL (previous is struck through).
- Cache-bust updated to `20260313-c232`.

## c233 follow-up (2026-03-13)
- Added 10 extra pinned Nakios films for catalog coverage (Inception, Interstellar, The Dark Knight, Parasite, Dune,
  Blade Runner 2049, The Prestige, Mad Max: Fury Road, Whiplash, Joker).
- Admin announcement card now shows the active message and allows deletion.
- Added admin suggestion workflow:
  - `/api/admin/suggestions` (GET) returns missing-title suggestions.
  - `/api/admin/suggestions/accept` (POST) imports the title.
  - `/api/admin/suggestions/skip` (POST) defers the suggestion.
- Admin UI includes a Suggestions panel (validate/refuse/next).
- zenix.lol admin now uses a password-only login screen and shows the panel after login.
- Admin assets cache-bust updated to `20260313-c233`.

## c234 follow-up (2026-03-13)
- Backup popup (zenix.lol) now shows on every visit (still after Discord prompt).
- Cache-bust updated to `20260313-c234`.

## c235 follow-up (2026-03-14)
- Backup popup link layout improved (no text overlap, better wrapping).
- zenix.lol admin forms now never reload the page (submit blocked + button click handlers + Enter key handling).
- Cache-bust updated to `20260313-c235`.

## c236 follow-up (2026-03-14)
- Backup popup URL is now centered as a standalone block.
- zenix.lol admin gets an inline fallback so login/update works even if admin.js fails to load.
- Cache-bust updated to `20260314-c236`.

## c237 follow-up (2026-03-14)
- iPhone backup popup now triggers the share sheet on first tap (uses click handler on iOS).
- Online count base boosted to +50.
- Cache-bust updated to `20260314-c237`.

## c238 follow-up (2026-03-14)
- Desktop backup popup now opens zenix.lol and tells the user to bookmark that tab (Ctrl/Cmd+D).
- Cache-bust updated to `20260314-c238`.

## c239 follow-up (2026-03-14)
- Backup popup now attempts anchor-click open for zenix.lol and reports popup-block status.
- Cache-bust updated to `20260314-c239`.

## c240 follow-up (2026-03-14)
- Added a boot guard to re-inject zenix.js once if init does not complete after load.
- init now records `__zenixBooted` / `__zenixBootError` for recovery and debugging.
- Cache-bust updated to `20260314-c240`.

## c241 follow-up (2026-03-14)
- Mobile popups now arm the ghost-tap shield on close (Discord/Backup/Adblock).
- Prevents tap-through opening content behind popups on phone.
- Cache-bust updated to `20260314-c241`.

## c242 follow-up (2026-03-14)
- Added new card badges: Favori + Vu.
- Repair now reports actual new sources added (no fake count).
- Cache-bust updated to `20260314-c242`.

## c243 follow-up (2026-03-14)
- Added inline SW/cache cleanup before JS boot to avoid stale blank UI.
- Cache-bust updated to `20260314-c243`.

## c244 follow-up (2026-03-14)
- Added a one-time hard reload if boot still fails after retry.
- Cache-bust updated to `20260314-c244`.

## Movix import (2026-03-14)
- Admin import supports Movix URLs (movie/series/anime watch links).
- Backend resolves sources via MOVIX_API_BASE and optional MOVIX_ACCESS_KEY.

## c245 follow-up (2026-03-14)
- Admin imports are marked as force-duplicate, so they remain visible even if a title already exists in the main catalog.
- Client catalog merge now skips semantic dedupe for forced entries.
- Cache-bust updated to `20260314-c245`.

## c246 follow-up (2026-03-14)
- Admin-forced entries display an "Admin" badge on cards.
- Cache-bust updated to `20260314-c246`.

## c249 follow-up (2026-03-14)
- Boot retry now runs only if the initial `zenix.js` failed to load (prevents duplicate eval errors).
- Added `zenixCoreScript` load/error flags to guard against double-injection.
- Cache-bust updated to `20260314-c249`.

## c250 follow-up (2026-03-14)
- Manual source lock no longer blocks auto-switch when the selected source is Zenix.
- Auto-rescue + fallback can engage even after a user clicks the Zenix source chip.
- Cache-bust updated to `20260314-c250`.

## iPhone 13 Zenix reader probe (live, 2026-03-14)
- 5s WebKit playback battery on live:
  - Movies: Zootopie 2, F1® Le Film
  - Series: Stranger Things, Mercredi
  - Anime: One Piece
- Result: 5/5 passed with Zenix reader active.
- Note: `La Femme de ménage` openPlayer failed in the harness; needs a dedicated rerun.
