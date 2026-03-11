# Zenix Project Memory

Last update: 2026-03-11

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
