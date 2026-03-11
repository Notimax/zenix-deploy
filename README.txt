ZENIX STREAM - OPERATIONS MEMORY
Last updated: 2026-03-11

LIVE DOMAIN
- https://zenix.best

DEPLOY FLOW
1) Commit on main
2) Push origin main
3) Push deploypublic main
4) Verify index versions:
   - /zenix.js?v=...
   - /zenix.css?v=...

CURRENT PRODUCT RULES
- Mobile startup splash must never block the app.
- Toast notifications are DESKTOP ONLY.
- Toast position on desktop: bottom-right.
- Brand assets:
  - app/social icons must always use the Zenix "Z" logo (no Purstream "P" icon).
  - keep `og:image`, favicon set (`svg/png/ico`) and manifest icons aligned.
- SEO baseline for brand queries:
  - keep canonical domain at `https://zenix.best`.
  - preserve optimized title/meta/schema in `index.html`.
  - keep `robots.txt` + `sitemap.xml` aligned with the canonical domain.
- "Pour toi" should avoid watched and liked items.
- Movie/series language priority for FR audience:
  VF > VOSTFR > MULTI > VO.
- External generic embed fallback sources were removed.

STREAMING/PLAYBACK NOTES
- Auto-switch source is active when playback is blocked.
- HLS proxy endpoint: /api/hls-proxy
- Some upstream providers return numeric-encoded playlists.
  Server now decodes numeric playlists more robustly before rewriting.
- Desktop playback resize-loop guard:
  - main nav fit recalculation is deferred while player/detail overlays are open.
  - deferred nav fit is flushed when overlays close.
  - stable scrollbar gutter is enforced to prevent width oscillation on laptop viewports.
- iOS fallback: when native HLS manifest bootstrap fails, player now switches to direct TS segment playback
  (segment chain) to avoid instant block on iPhone/WebKit environments.
- Movie source ordering for FR audience is now strict:
  VF first, then MULTI, then VOSTFR (VO removed when FR-friendly sources exist).
- Player tries to select French audio track automatically when a source exposes multiple audio tracks.
- Playback hardening:
  - non-playable embed/gate URLs are filtered before entering the player pool (ad/gate hosts, store links).
  - movie source ranking now prioritizes direct media formats (`hls/mp4/webm/dash`) over embeds.
  - if at least one direct movie source exists, embed-only alternatives are dropped for that movie.

MOBILE DEBUG CHECKLIST
- Confirm startup splash hidden after load.
- Confirm no toast shown on mobile.
- Run 3 x 20s iPhone 13 WebKit playback checks on target content.
- If playback still fails, inspect source validity upstream and add FR-compatible backups.
- If iOS WebKit logs show `Fallback iOS actif...` and `Lecture segment X/...`, segment fallback is engaged.

RELEASE QUALITY GATE (MANDATORY)
- Before closing any streaming fix, run brute tests on BOTH desktop and phone:
  - Desktop: open detail + play + verify at least 20s continuous playback.
  - Phone simulation (iPhone 13 WebKit): run 3 tests of 20s each.
  - Real phone check (iPhone Safari): run at least 1 manual 20s check on production, because automated WebKit in this environment can fail media codec playback.
  - If any run fails, keep iterating and redeploy until stable.
  - Mandatory fail loop:
    - If a test shows playback block/error (including micro bug), do not stop.
    - Debug the cause, apply a fix, then rerun the same tests.
    - Repeat fix + retest until all required runs pass.

KEY FILES
- zenix.js (frontend logic/player/notifications)
- zenix.css (layout/toast/splash styles)
- server.js (API proxy + HLS proxy)
- PROJECT_MEMORY.md (extended working memory)

OWNED SOURCES (LEGAL VF)
- `server.js` supports provider shortcuts in `zenix-owned-sources.json`:
  - Cloudflare Stream: `provider=cloudflare_stream`, `customer_code`, `uid`
  - Bunny Stream: `provider=bunny_stream`, `pull_zone_url`, `video_id`
- URLs are generated server-side to HLS manifests and injected as owned sources.
- Example ready for movie `3940` exists in `zenix-owned-sources.example.json`.

NAKIOS INTEGRATION (MAIN EXTERNAL PROVIDER)
- Legacy providers removed from runtime:
  - `pidoov.com`
  - `notarielles.fr`
  - `rendezvousmusical.fr`
- New backend endpoint: `/api/nakios-source`
  - resolves movie/episode sources from Nakios (`api.nakios.site`) using `tmdbId` or `title + type + year`.
  - frontend injection now uses Nakios as the external fallback pool for movies and series.
- Supplemental catalog now uses Nakios only:
  - endpoint remains `/api/catalog/supplemental`
  - rows are built from Nakios movie/series feeds with semantic dedupe.
  - provider marker is now `external_provider: nakios`.
- Calendar overview still merges supplemental entries through `/api/calendar/overview`,
  with source link set to Nakios.
- Nakios tuning keys:
  - `NAKIOS_CATALOG_PAGES_PER_FEED`
  - `NAKIOS_LOOKUP_CACHE_MS`

LATEST FIX LOG (2026-03-08)
- High 404 noise fix:
  - `zenix.js` now keeps a `detailsMissing` cache.
  - `ensureDetails()` no longer retries `/api/media/{id}/sheet` for known-missing IDs.
  - external provider IDs are skipped for Purstream sheet fetches.
- Cover fix for added providers (Pidoov/Rendezvous):
  - `server.js` now hydrates missing posters from provider detail pages (cached).
  - hydrated covers are injected into supplemental catalog rows and reused by calendar mapping.
  - first supplemental page now returns mostly real covers instead of placeholders.
- iframe warning fix:
  - removed redundant `allowfullscreen` attributes in `index.html` where `allow` already includes fullscreen.
- Provider migration:
  - removed runtime source/catalog integrations for Pidoov, Notarielles, and Rendezvous.
  - Nakios is now the single external provider for fallback sources + supplemental catalog entries.

BRUTE TEST COMMAND (REFERENCE)
- Test file: `__tmp_brut_f1_mercredi_matrix.js`
- Result file: `__tmp_brut_f1_mercredi_matrix_result.json`
- Local run command:
  - start server: `node server.js`
  - run matrix: `node __tmp_brut_f1_mercredi_matrix.js`
- Matrix includes:
  - Desktop Chromium: F1 (20s), Mercredi (20s)
  - iPhone 13 WebKit: F1 (3 x 20s), Mercredi (3 x 20s)

LAST BRUTE RESULT (LOCAL, 2026-03-08)
- Source: `__tmp_brut_f1_mercredi_matrix_result.json`
- Summary:
  - total runs: 8
  - passed: 8
  - failed: 0
  - `/api/media/*/sheet` 404 count during matrix: 0
- Notes:
  - iPhone runs can show iOS segment fallback status (`Lecture segment ...`) during playback.
  - playback remained valid for all required 20s runs.

LAST BRUTE RESULT (LIVE ZENIX.BEST, 2026-03-08)
- Source: `__tmp_brut_f1_mercredi_matrix_result_live.json`
- Command:
  - `ZENIX_BASE_URL=https://zenix.best/ node __tmp_brut_f1_mercredi_matrix.js`
- Summary:
  - total runs: 8
  - passed: 8
  - failed: 0
  - `/api/media/*/sheet` 404 count during matrix: 0

LAST BRUTE RESULT (LIVE RERUN, 2026-03-08)
- Source: `__tmp_brut_f1_mercredi_matrix_result_live_latest.json`
- Command:
  - `ZENIX_BASE_URL=https://zenix.best/ node __tmp_brut_f1_mercredi_matrix.js`
- Summary:
  - total runs: 8
  - passed: 8
  - failed: 0
  - `/api/media/*/sheet` 404 count during matrix: 0
- Notes:
  - F1 + Mercredi runs stayed stable on desktop and iPhone 13 WebKit.
  - iOS fallback statuses (`Fallback iOS actif`, `Lecture segment ...`) can appear transiently without playback failure.

LAST BRUTE RESULT (LOCAL AFTER NAKIOS MIGRATION, 2026-03-08)
- Source: `__tmp_brut_f1_mercredi_matrix_result_after_nakios_local_v2.json`
- Summary:
  - total runs: 8
  - passed: 8
  - failed: 0
  - `/api/media/*/sheet` 404 count during matrix: 0

LATEST FIX LOG (2026-03-09)
- Player UX cleanup:
  - removed quick action button bar in player (`Recommencer`, `-10s`, `+10s`, `Reessayer`, etc.) from UI.
  - keyboard shortcuts remain available for power users.
- New styled startup animation inside player:
  - animated loading overlay (`playerLoadingIndicator`) now appears while source is connecting.
  - overlay auto-hides when playback starts or on terminal error.
- Faster auto source switching when blocked:
  - playback guard interval reduced and stall thresholds tightened.
  - startup/status-based recovery now triggers earlier for quicker automatic fallback.

LAST BRUTE RESULT (LIVE AFTER PLAYER PATCH, 2026-03-09)
- Source: `__tmp_brut_f1_mercredi_matrix_result_live_after_player_patch_2026-03-09.json`
- Command:
  - `ZENIX_BASE_URL=https://zenix.best/ node __tmp_brut_f1_mercredi_matrix.js`
- Summary:
  - total runs: 8
  - passed: 8
  - failed: 0
  - `/api/media/*/sheet` 404 count during matrix: 0

LAST EPISODE PROBE (LIVE, 2026-03-09)
- Desktop source: `__tmp_series_20s_probe_desktop_after_player_patch_2026-03-09.json`
  - title: `Solo Leveling`
  - samples: 20
  - max video time: 14.82s
- iPhone 13 source: `__tmp_series_20s_probe_ios_after_player_patch_2026-03-09.json`
  - title: `Solo Leveling`
  - samples: 20
  - max video time: 10.09s

LATEST IPhone TUNING (2026-03-09)
- iOS HLS bootstrap path optimized for faster recovery:
  - native iOS HLS bootstrap timeout reduced.
  - iOS now tries segment fallback before decoded-blob fallback when native bootstrap fails.
  - iOS segment fallback boot/next timeouts tightened to avoid long startup stalls.
- Segment fallback chain now avoids excessive micro-resets:
  - if alternate sources exist, chain is capped and player auto-switches source instead of chaining too many TS segments.

LOCAL BRUTE RESULT (AFTER iOS TUNING, 2026-03-09)
- Source run1: `__tmp_brut_f1_mercredi_matrix_result_local_iosfix_run1_2026-03-09.json`
- Source run2: `__tmp_brut_f1_mercredi_matrix_result_local_iosfix_run2_2026-03-09.json`
- Summary:
  - run1: passed 8 / failed 0
  - run2: passed 8 / failed 0

IPHONE STRESS RESULT (LIVE, 2026-03-09)
- Test battery:
  - iPhone 13 WebKit
  - 20s per title
  - 10 films + 10 series (auto-selected from live catalog)
- Source: `__tmp_ios13_20x20_probe_live_result_after_ios_fix_v2_2026-03-09.json`
- Summary:
  - total runs: 20
  - passed: 20
  - failed: 0
  - movie failed: 0
  - series failed: 0
  - `/api/media/*/sheet` 404 count during battery: 0
- Notes:
  - one non-playable candidate was auto-skipped and replaced (`SKIPPED=1`).
  - iOS segment fallback chain is now minimized with faster handoff to alternate source when available.

LATEST CALENDAR/STATUS FIX (2026-03-09)
- Nakios availability is now auto-evaluated for supplemental entries:
  - backend probes Nakios source availability (`available`/`pending`) with cache and concurrency limits.
  - statuses are injected into `/api/calendar/overview` and `/api/catalog/supplemental`.
- Calendar cards now show `En attente` badge (top-left) when title is not uploaded yet.
  - pending entries are no longer opened as playable details from calendar.
  - date pill is moved to top-right to avoid overlap.
- `Nouveau` is now suppressed when a title is `En attente`.
- Merge/dedupe now prefers available entries over pending ones when semantic duplicates exist.

LATEST IOS AUTO-SWITCH FIX (2026-03-09)
- Playback guard now stays active during iOS segment fallback (no early guard skip).
- Auto-switch now accepts premium fallback candidates on mobile when needed (instead of stopping on free-only dead-end).
- Bootstrap stall detection now fails fast on true `readyState=0` source stalls so next source can be attempted.
- Added explicit guard rule: if `Fallback iOS actif...` stays blocked too long, force switch to the next source.
- iOS segment fallback chain limit increased (`IOS_SEGMENT_CHAIN_MAX=8`) to reduce premature forced source hops.
- Local brute matrix after fix:
  - file: `__tmp_brut_f1_mercredi_matrix_result_local_after_fallbackstall_patch4_2026-03-09.json`
  - summary: passed 8 / failed 0
  - iPhone 13 runs show source progression up to source 4 on Mercredi when fallback blocks.

LATEST SPONSOR + SNAP LOAD FIX (2026-03-09)
- Native sponsor is now rendered only inside `Sponsorise` slots (home/catalog/detail) through a sandboxed iframe.
- Third-party ad script is no longer present in the top document (`script[src*="maddenwiped.com"]` stays 0 outside iframe context).
- Removed manual sponsor gate button; sponsor display is automatic only inside sponsor blocks.
- Sandboxed frame policy prevents top-level pop/redirect behavior from sponsor script context.
- In-app browser hardening (Snapchat/WebView):
  - runtime class flags: `in-app-browser`, `snap-browser`
  - `content-visibility` is disabled in in-app mode for key sections/grids
  - cover assignment uses direct image source path (no preload gate) for faster first paint
  - result: covers load without needing category switch in Snap browser simulation.

POST-FIX VERIFICATION (2026-03-09)
- Local Snap UA probe:
  - first view covers loaded: 40/40
  - after category swap: 40/40
  - top document ad script count: 0
  - sponsor iframe sandbox: `allow-scripts allow-same-origin`
- Live Snap UA probe (`https://zenix.best`):
  - first view covers loaded: 40/40
  - top document ad script count: 0
  - sponsor iframe active in `Sponsorise`.
- Local brute playback matrix rerun (`F1` + `Mercredi`, desktop + iPhone 13):
  - total runs: 8
  - passed: 8
  - failed: 0

LATEST LANGUAGE LABEL + IOS AUTOSWITCH TUNING (2026-03-09)
- Source language labeling is now reconciled from multiple signals:
  - provider language field
  - source name hints
  - source URL hints
- Conflicting `VF` vs `VOSTFR` metadata now resolves to safer `MULTI` (instead of wrong hard label).
- Active source label can now auto-correct from real audio tracks after playback bootstrap.
  - example: source marked `VOSTFR` but exposing French audio is relabeled to `VF`/`MULTI`.
- iPhone/mobile auto-switch is more reactive on startup stalls:
  - faster playback guard interval on mobile
  - shorter startup/status recovery thresholds
  - extra stall pattern detection on prolonged `connexion/chargement/fallback` states
  - shorter mobile bootstrap/direct/embed readiness windows to fail over earlier.

LATEST WEBHOOK ANALYTICS REDESIGN (2026-03-09)
- Discord webhook message redesigned with richer operations data:
  - active clients, active IPs, unique 24h, heartbeats 24h
  - device counters (`PC`, `Telephone`, `Tablette`, `Bot/Autre`)
  - platform and browser breakdown
  - top active pages
  - active countries (IP-based counter)
- Active IP list is now included in webhook embeds with per-IP context:
  - country, device, platform/browser, active page, last-seen age, client count
- Geo enrichment:
  - IP-to-country lookup with cache + timeout + fallback providers
  - local/private IPs labeled as `LAN/Local`
- Public API `/api/analytics/webhook-status` now returns an enriched snapshot summary
  (without exposing full IP line list).

LATEST VISUAL SYSTEM REFRESH (2026-03-09, c137)
- New visual charter applied globally:
  - unified spacing/radius/shadow tokens
  - typography hierarchy tightened (display/body separation)
  - premium background layers with subtle texture
- Topbar/nav overhaul:
  - discrete glassmorphism topbar
  - animated active-nav indicator
  - desktop overflow nav menu (`Plus`) for small widths
  - mobile fixed bottom tabbar
- Card and catalog polish:
  - unified cover ratio and hover elevation/glow
  - visual ribbons on cards (`Nouveau`, `Bientot dispo`, `En attente`)
  - top medals style improved for ranks #1/#2/#3
  - skeleton loading states for covers/details while images resolve
  - continue progress bar styling reinforced directly on cards
- Player/detail polish:
  - source selector fully chip-based (quality/language/format/source + compatibility level)
  - playback stepper styled (`Connexion`, `Fallback`, `Lecture`)
  - modal/player transitions and spacing improved
- Calendar/footer/sponsor polish:
  - day counters styled in calendar overview
  - sponsor blocks visually framed and separated from content
  - real footer styling + design updates panel styling

LATEST STARTUP SPLASH END ANIMATION (2026-03-09, c138)
- Startup intro beginning is kept as-is.
- Added a dedicated final phase (`is-ending`) before splash hide:
  - cinematic letter burst inspired by Netflix-style ending timing/rendering.
  - chromatic ghost layers on the `Zenix` title for the exit flash.
  - sweep-light pass and bar collapse to finish the logo beat.
  - backdrop fades toward transparency, then transitions cleanly to the site.

LATEST UI ADJUSTMENT (2026-03-09, c139)
- Restored legacy visual appearance for:
  - main navbar (classic layout/look)
  - category sections/cards (home/catalog/calendar/list/continue/trending)
- Kept the current modern look for:
  - player start/watch menu
  - movie/series detail modal

LATEST VISUAL ROLLBACK TUNING (2026-03-09, c140)
- Restored legacy background/look for home + calendar + all category sections.
- Disabled category skeleton opacity gating to force instant cover visibility.
- Disabled category grid content-visibility containment to prioritize immediate rendering/fluidity.
- Player and detail modal visual style remains the modern one.

LATEST MOBILE/NAV/CALENDAR FIXES (2026-03-09, c141)
- Removed homepage `Tendances` section from HTML + runtime render path.
- Removed `FREE` chip and footer/version block (`Zenix Stream / Etat / Version`) from UI.
- Mobile navbar restored on phone widths (bottom tabbar visible, desktop nav hidden on small screens).
- `bindSafeTap` hardened to prevent accidental open while scrolling/touch-dragging cards on mobile.
- Calendar media type resolution now prioritizes explicit/anime signals before stale ID mappings to reduce serie/anime mixing.

LATEST COVER + MOBILE NAV TUNING (2026-03-09, c142)
- Cover loading tuned for category views:
  - larger eager/high-priority image windows
  - category catalog render can switch to all-at-once mode (no delayed chunk tails on normal list sizes)
  - stronger detail-cover warmup budget after category render
- Mobile navbar moved back to top layout (desktop-style horizontal nav), bottom mobile tabbar hidden.
- `Haut` button disabled on phone (hidden by viewport + scroll logic).

LATEST SOURCE CHIP UI CLEANUP (2026-03-09, c143)
- Player source selector redesigned to prevent overlap on all viewports:
  - top row: `Source n` + compatibility badge
  - middle row: language/quality/format as compact pills
  - bottom row: source host pill with safe truncation
- Responsive polish:
  - mobile-safe wrapping/ellipsis and spacing
  - source alert restyled for readability without crowding
  - source chip container scrolling behavior tuned for desktop and phone.

LATEST MOBILE/PERF RELIABILITY TUNING (2026-03-09, c144)
- Cover loading hardening for phone + desktop:
  - much higher eager/high-priority image budgets in category views
  - larger critical cover priming window
  - stronger warm-cache and detail-cover hydration after category render
  - category render all-at-once threshold increased to reduce delayed card/image tails
- Mobile top navbar usability:
  - explicit horizontal swipe navigation (pan-x) on categories
  - nav pills forced non-shrinking (`flex: 0 0 auto`) to avoid label overlap
- Sponsor visibility on mobile:
  - sponsor sections forced visible rendering path (no content-visibility deferral)
  - native sponsor iframe switched to eager loading
  - higher ad frame min-heights on phone so sponsor block is actually visible.

LATEST CATEGORY VISIBILITY STABILITY (2026-03-09, c145)
- Cover update path hardened:
  - `setImageSourceSafely` now applies cover URLs directly (no blocking preloader gate),
    preventing cards from staying visually empty when a preload stalls.
- Detail-cover hydration made more reliable:
  - `warmVisibleDetailCovers` now uses controlled concurrency instead of firing all requests at once.
  - category views now hydrate more covers by default (higher limits for mobile/desktop category mode).
- Immediate section rendering:
  - browse/category/sponsor sections and grids now force visible rendering path globally
    (no deferred `content-visibility` in normal mode), to avoid empty blocks while navigating categories.

LATEST COVER LOAD BALANCING (2026-03-09, c146)
- Switched category cover loading to staged mode (instead of aggressive mass-eager):
  - reduced eager/high-priority budgets for mobile and desktop.
  - reduced critical cover prime window to prioritize above-the-fold readiness.
- Category render pacing tuned:
  - render-all-at-once threshold lowered for large categories to avoid network/main-thread saturation.
- Detail-cover hydration budgets rebalanced:
  - lower per-category hydration caps while keeping bounded concurrency.
  - goal: faster visible covers with fewer pending images in heavy categories.

LATEST CATALOG WARMUP RESILIENCE (2026-03-09, c148)
- `loadInitialCatalog` no longer drops to hard fallback (2 items) when a secondary warmup page fails.
- If page 1 loaded successfully, fetched catalog rows are kept and cached even if later warmup fetches fail.
- Fast first paint strategy:
  - first catalog page is fetched without blocking on supplemental feed.
  - warmup pages are now synced in background instead of blocking initial render.
  - page 1 refresh with supplemental merge is triggered asynchronously right after initial paint.

LATEST SCROLLBAR VISUAL HIDE (2026-03-09, c149)
- Main page scrollbar is now visually hidden while scroll remains active.
- Kept mouse wheel, trackpad, keyboard and touch scrolling behavior unchanged.
- Applied cross-browser rules (`scrollbar-width`, `-ms-overflow-style`, `::-webkit-scrollbar`).

LATEST PROVIDER STRATEGY HARDENING (2026-03-09, c150)
- Semantic catalog merge now preserves internal ownership when an internal row and an external row
  collide on the same title key (prevents internal IDs from being wrongly flagged as external).
- Episode loading now uses a dual-provider strategy:
  - starts Purstream episode fetch and Nakios fallback fetch in parallel.
  - uses soft time windows to avoid long blocking states before first playable source appears.
  - if Purstream has playable sources quickly, it is kept as primary.
  - if Purstream is empty/slow, Nakios preloaded sources are injected immediately.
- External TV rows can now auto-switch to internal Purstream twin only when the internal stream is truly playable.
- Playback route/state now tracks the actually selected provider item (`state.nowPlaying` + `?watch=` sync).

TARGETED TEST - THE ROOKIE (LOCAL, 2026-03-09)
- Probe file: `__tmp_rookie_search_play_probe.js`
- Results:
  - `__tmp_rookie_search_play_probe_result_local_after_fix.json`
  - `__tmp_rookie_search_play_probe_run1_local.json`
  - `__tmp_rookie_search_play_probe_run2_local.json`
  - `__tmp_rookie_search_play_probe_run3_local.json`
- Summary:
  - desktop: sources detected and playback reaches `Lecture S1E1 (VF)` consistently.
  - iPhone 13 WebKit: sources detected and playback reaches `Lecture S1E1 (VF)` across all 3 reruns.

LOCAL BRUTE MATRIX AFTER c150 (2026-03-09)
- Source: `__tmp_brut_f1_mercredi_matrix_result_after_rookie_strategy.json`
- Summary:
  - total runs: 8
  - passed: 8
  - failed: 0
  - `/api/media/*/sheet` 404 count during matrix: 0

LATEST STARTUP SPLASH TUNING (2026-03-09, c151)
- Startup animation duration reduced by ~1 second:
  - `STARTUP_SPLASH_MIN_MS`: `2450 -> 1450`
  - `STARTUP_SPLASH_MAX_MS`: `5200 -> 4200`
- Added a short startup chime synchronized with the splash ending phase:
  - generated with WebAudio (small volume, cinematic style).
  - best effort only (can be blocked by browser autoplay policies on some devices).

LATEST CALENDAR MOBILE ADAPTATION (2026-03-09, c152)
- Calendar view on phone is now fully responsive:
  - toolbar switched to a clean 2-column grid (month/year), with search on full-width row.
  - type filters (`Film`, `Serie`, `Anime`) now stay on one horizontal line with swipe scroll.
  - refresh button is full-width on mobile for easier tap.
  - calendar cards switch to a single-column list on phone for better readability.
  - badge/date text sizes tightened on very small screens (`<=520px`).

LATEST MODAL/PLAYER SCROLLBAR HIDE (2026-03-09, c153)
- Scrollbar is now visually hidden (without disabling scroll) inside:
  - detail modal container/panel
  - player overlay/panel
  - source chips scroller
- Cross-browser rules applied (`scrollbar-width`, `-ms-overflow-style`, `::-webkit-scrollbar`).

LATEST TYPE + ADBLOCK GATE FIX (2026-03-09, c154)
- Film/serie classification hardening:
  - catalog item normalization now handles mixed upstream type labels (`movie/film`, `tv/serie/series`, `anime`).
  - `isAnime` coercion now uses truthy parsing (prevents string `"0"` from being treated as `true`).
  - calendar type resolver now adds stronger serie signals (`season/episode`, title/url hints) to reduce film/serie mismatches.
- Added anti-adblock access gate (desktop + mobile):
  - themed blocking modal appears when adblock is detected.
  - message explains free access model (small non-intrusive ads fund infra/domain).
  - retry button checks again and restores access immediately when adblock is disabled.

LATEST ANIME PROVIDER POLICY FIX (2026-03-09, c155)
- Nakios is now fully blocked for anime use-cases:
  - no Nakios anime rows kept in catalog normalization.
  - no Nakios source merge for anime playback.
- Calendar anime is now Anime-Sama only:
  - non-Anime-Sama entries cannot be classified as `anime` in calendar resolver.
  - direct Purstream fallback path no longer injects anime rows in calendar fallback mode.
  - backend merged calendar also drops anime entries not coming from Anime-Sama.

LATEST DETAIL BUTTON ICONS (2026-03-09, c156)
- Added icons in detail action buttons (including `Demarrer`, `Like`, `Dislike`).
- Detail buttons now use icon + label layout.
- JS detail button label updates now preserve icon markup (`.btn-label`) for dynamic states.

LATEST SOURCE HOST MASKING (2026-03-09, c157)
- Player source chips no longer expose raw provider/domain labels.
- Removed runtime display of host-like labels (e.g. `zebi.xalaflix.design`, `api.nakios.site`, `cdn...`) in source chip tags.
- Source chip footer now uses neutral labels only (`Source standard` / `Source premium`).

LATEST SCROLL REFRESH STABILITY (2026-03-09, c158)
- Catalog rendering now keeps existing cards and appends only new rows when scroll-sync loads more pages.
- Full catalog grid rebuild is skipped when incoming rows are a strict prefix extension of what is already rendered.
- Goal: remove visible "refresh" effect while users scroll to find titles.

LATEST CALENDAR COVER ALIGNMENT (2026-03-09, c160)
- Calendar cards now reuse the same cover resolution strategy as catalog/new releases when a local match exists.
- Calendar image loading priority now follows shared card profile logic (`eager/high`) instead of fixed hardcoded thresholds.
- Calendar warmup now resolves covers with `resolveCalendarDetailId(...)` for better poster consistency with `Nouveautes`.

LATEST MOBILE CATALOG 2-UP (2026-03-09, c161)
- On phone widths, `catalog-grid` is now forced to 2 covers per row (duo layout).
- Rule is applied in a late CSS block to avoid overrides from other responsive sections.


LATEST TYPE/ANIME-SOURCE HARDENING (2026-03-09, c162)
- Calendar type resolver now gates anime classification through Anime-Sama source checks.
- Calendar feed now drops anime-like rows when source is not Anime-Sama (prevents serie/anime mixing).
- Player source chips no longer render provider-origin bubble tags; labels are sanitized to avoid host/provider leaks.


LATEST SOURCE LABEL PRIVACY HARDENING (2026-03-09, c163)
- Source quality display now shows only normalized quality tokens (2160p/1080p/HD/SD) or `Auto`.
- Any provider-like/raw labels are dropped from source chips and selector labels.

LATEST CALENDAR/CATALOG CONSISTENCY (2026-03-09, c164)
- Calendar source merge now prefers provider rows (`purstream + animeSama + supplemental`) before fallback to merged rows.
- Calendar policy filter is applied before render: anime lane accepts Anime-Sama sourced rows only.
- Calendar render cap increased (`CALENDAR_RENDER_LIMIT=420`) to avoid missing visible items in dense months.
- Mobile calendar grid in `#calendarSection` now renders 2 cards per row (phone layout aligned with `Nouveautes`).
- Catalog infinite sync now loads until a visible gain target is reached (`+30` minimum) instead of tiny incremental appends.
- Added loose semantic dedupe to merge near-duplicate external rows while keeping stronger playable entries.
- Internal-provider candidate matching now supports tolerant title compatibility (subtitle/locale variants).
- Backend Nakios supplemental feed now drops likely anime TV rows to preserve Anime-Sama ownership of anime inventory.

LATEST ANIME + SOURCE STARTUP TUNING (2026-03-10, c165)
- Anime sources now strictly filtered to Anime-Sama; non-Anime-Sama anime sources are dropped.
- Added Anime-Sama Sibnet probe with catalog URL hint; `appendAnimeSibnetSource` injects Sibnet first when missing.
- HLS manifest language probing (cached) updates source labels when audio tracks indicate VF/MULTI.
- Movie source startup now uses Nakios in parallel to avoid blocking initial playback; late Nakios sources merge in background.
- Playback guard now detects early hard stalls even when readyState stays high.
- Webhook: support `DISCORD_STATS_MESSAGE_ID` env to pin a single Discord message and stop duplicate logs after restarts.
- Added Playwright dependency for local brute tests.

LATEST BRUTE RESULT (LOCAL, 2026-03-10)
- Source: `__tmp_brut_f1_mercredi_matrix_result_local_c165.json`
- Summary: total 8, passed 8, failed 0, `/api/media/*/sheet` 404: 0

ANIME SIBNET PROBE (LOCAL, 2026-03-10)
- Source: `__tmp_anime_sibnet_hxh_probe_local_c165.json`
- Summary: Hunter x Hunter S1E1 resolves to Anime-Sama Sibnet VOSTFR.

LATEST ANIME SOURCE RESTORE (2026-03-10, c166)
- Anime-Sama endpoint now returns multiple hosters per episode (not only Sibnet).
- Frontend injects Anime-Sama sources with origin tagging so all hosters stay available.
- Anime language strategy: try VF first, fallback to VOSTFR if VF is missing.
- Frontend VF lookup now falls back to VOSTFR on 404/timeout (prevents empty anime sources).
- Added anime source ranking on backend to prefer direct HLS/MP4 before embeds.

LOCAL BRUTE RESULT (c166, 2026-03-10)
- Source: `__tmp_brut_f1_mercredi_matrix_result_local_c166_fix7_2026-03-10.json`
- Summary: total 8, passed 8, failed 0, `/api/media/*/sheet` 404: 0

LATEST ANIME PANEL PARSING HARDENING (2026-03-10, c167)
- Anime panel language detection expanded (VF labels like `version fr`, `francais`, `french`).
- Panel selection now uses inferred panel language (label-based) when path lacks explicit `vf/vostfr`.
- Episodes parser now accepts `var/let/const` (and bare) `epsN` arrays for multi-hoster capture.

LOCAL BRUTE RESULT (c167, 2026-03-10)
- Source: `__tmp_brut_f1_mercredi_matrix_result_local_c167_2026-03-10.json`
- Summary: total 8, passed 8, failed 0, `/api/media/*/sheet` 404: 0

LATEST ANIME SOURCE POOL UNLOCK (2026-03-10, c168)
- Anime playback now keeps all available readers (Anime-Sama + internal + Nakios) instead of filtering Anime-Sama only.
- Source ordering is re-sorted by score after merge to keep VF/MULTI ahead of VOSTFR/VO.

LOCAL BRUTE RESULT (c168, 2026-03-10)
- Source: `__tmp_brut_f1_mercredi_matrix_result_local_c168_2026-03-10.json`
- Summary: total 8, passed 8, failed 0, `/api/media/*/sheet` 404: 0

LATEST ANIME VF OVERRIDE + PANEL PICK (2026-03-10, c169)
- Anime VF fallback now probes hidden `/vf` panels even if not listed in the catalogue panel list.
- Episode panel selection prefers exact `saisonN/` paths over `saisonNhs/` variants when both exist.
- Example: Dr Stone S4 VF resolved via `saison4/vf` even when only `saison4/vostfr` is listed.

LATEST IOS ERROR GUARD (2026-03-10, c170)
- Ignore spurious HTML5 `error` events with code `0` to prevent false auto-switch resets on iPhone.

LATEST ANIME VF/VOSTFR DUAL FETCH (2026-03-10, c172)
- Anime-Sama fetch now pulls both VF + VOSTFR sources when available (order respects preference).
- Default language still prefers VF, but VOSTFR is kept in the pool for auto-switch fallback if VF stalls.

LOCAL BRUTE RESULT (c172, 2026-03-10)
- Source: `__tmp_brut_f1_mercredi_matrix_result_local_c172_2026-03-10.json`
- Summary: total 8, passed 8, failed 0, `/api/media/*/sheet` 404: 0

LATEST ANIME VF-ONLY POLICY (2026-03-10, c173)
- Anime playback now keeps only Anime-Sama sources and filters to `VF` / `MULTI` (no VO/VOSTFR).
- Anime-Sama VF panel probing order now prioritizes exact `saisonN/vf` before `saisonNhs/vf`.
- Catalogue search scoring now prefers non-year slugs (fixes Hunter x Hunter 2011 vs 1999 mismatch).

LATEST ANIME SEASONS FALLBACK + WEBHOOK RECOVERY (2026-03-10, c174)
- Added `/api/anime-seasons` to build season/episode lists from Anime-Sama VF panels when internal seasons are empty.
- Frontend `ensureSeasons` now falls back to Anime-Sama for anime (fixes 0 episode / lecture impossible cases).
- Discord webhook recovery hardened: clears message id on 401/403 and bypasses long backoff if no success for a while.

LATEST ANIME FAST-PATH + WEBHOOK FAILSAFE (2026-03-10, c175)
- Anime seasons now load Anime-Sama first (avoid waiting on slow `/media/{id}/seasons`).
- Added stale-success bypass so webhook resumes even after long backoff.

LATEST ANIME AUTO-CLASSIFICATION (2026-03-10, c176)
- If Anime-Sama seasons are found for a TV title, it is auto-marked as anime for playback.
- Fixes Hunter x Hunter showing 0 sources/episodes when internal seasons fail.

LOCAL BRUTE RESULT (HXH, c176, 2026-03-10)
- Source: `__tmp_brut_hxh_matrix_result_local_c176_2026-03-10.json`
- Summary: total 2, passed 2, failed 0

LOCAL BRUTE RESULT (HXH RERUN, 2026-03-10)
- Source: `__tmp_brut_hxh_matrix_result_local_c177_2026-03-10.json`
- Summary: total 2, passed 2, failed 0

LATEST EMBED RECOVERY + ANIME FLAG PRELOAD (2026-03-10, c177)
- Embed iframe load now soft-resolves after timeout to avoid blocking playback forever.
- Embed auto-switch guard added to swap source if an embedded player stays stuck too long.
- Embed readiness timeouts shortened to accelerate fallback.
- Episode playback primes Anime-Sama seasons before source resolution to enforce anime-only sources.

LOCAL BRUTE RESULT (HXH, c177, 2026-03-10)
- Source: `__tmp_brut_hxh_matrix_result_local_c177_embedfix2_2026-03-10.json`
- Summary: total 2, passed 2, failed 0

LATEST ANIME CLASSIFICATION GUARD (2026-03-10, c178)
- Episode playback now probes Anime-Sama seasons directly before source resolution.
- Only marks anime when Anime-Sama responds (prevents false anime tagging on regular series).
- Ensures anime-only source filtering stays consistent for playback.

LOCAL BRUTE RESULT (HXH, c178, 2026-03-10)
- Source: `__tmp_brut_hxh_matrix_result_local_c178_2026-03-10.json`
- Summary: total 2, passed 2, failed 0

LATEST ANIME FAST-PATH (2026-03-10, c179)
- Anime episodes now bypass Purstream/Nakios fetches and use Anime-Sama sources directly.
- Nakios merge is skipped for anime playback to enforce Anime-Sama-only policy and reduce delays.

LOCAL BRUTE RESULT (HXH, c179, 2026-03-10)
- Source: `__tmp_brut_hxh_matrix_result_local_c179_2026-03-10.json`
- Summary: total 2, passed 2, failed 0

LATEST SEASONS CACHE SAFETY (2026-03-10, c180)
- Empty season caches are no longer persisted to avoid permanent “0 episode” fallbacks.
- Forces a fresh Anime-Sama retry on next open when a previous attempt failed.

LOCAL BRUTE RESULT (HXH, c180, 2026-03-10)
- Source: `__tmp_brut_hxh_matrix_result_local_c180_2026-03-10.json`
- Summary: total 2, passed 2, failed 0

LIVE BRUTE RESULT (HXH, c180, 2026-03-10)
- Source: `__tmp_brut_hxh_matrix_result_live_c180_2026-03-10.json`
- Summary: total 2, passed 2, failed 0

LATEST WEBHOOK RATE LIMIT FIX (2026-03-10, c181)
- Discord webhook push interval raised to 30s (min 15s) to avoid 429 spam blocks.
- Goal: stabilize message creation so a permanent message ID can be pinned.

LATEST WEBHOOK PIN FALLBACK (2026-03-11)
- Added a fallback Discord stats message ID in server config to force PATCH updates.
- Prevents repeated create calls (and 429s) when the state file is missing.

LATEST EPISODE SOON + NEXT BUTTON (2026-03-11, c182)
- Episodes marked "soon" are now revalidated across series/anime; if playable, the soon flag is cleared
  and episode titles are refreshed from `/api/media/{id}/seasons`.
- Player now includes a dedicated "Episode suivant" button (desktop + mobile).
  It resolves the next playable episode (including next season when needed) and launches it.
- Next-episode button auto-updates on season/episode/language changes and after playback load,
  and disables itself cleanly when no next episode exists.

LATEST WEBHOOK FALLBACK PATCH (2026-03-11, c183)
- Discord webhook now patches the pinned fallback message ID in addition to the active message ID.
- This prevents stale/zero stats when the pinned message differs from the current message ID.

LATEST SIMPSONS SEASONS FALLBACK + ANIME MULTI PANELS (2026-03-11, c184)
- TV seasons now fast-path from `/media/{id}/sheet` url lists when the catalog is huge
  (fixes Les Simpson opening when `/media/{id}/seasons` is slow/empty).
- If `/media/{id}/seasons` returns empty, we now build seasons from detail urls as a fallback.
- Anime-Sama panel language detection now treats `multi` as VF-compatible,
  so VF requests can keep multi panels and expose more VF/MULTI readers.

LATEST DISCORD PROMPT + ONLINE COUNT BADGE (2026-03-11, c185)
- Header badge now shows `Total en lignes: 40 + actifs` (uses `/api/analytics/online`).
- New Discord join prompt on arrival (desktop + mobile), styled like the adblock gate.
- Discord prompt is suppressed while adblock gate is active and only shown once per session.

LATEST THEME FILTERS + CATALOG BOOST (2026-03-11, c186)
- Added theme filter chips for Films / Series / Anime catalog views (Enfant, Hero, Horreur, etc).
  - filters show above the catalog only when not searching.
  - detail prefetch primes category/genre tags to improve filter accuracy.
- Increased catalog coverage budgets:
  - `INITIAL_CATALOG_WARMUP_PAGES` -> 3
  - `CATALOG_RENDER_CHUNK_MAX` -> 140
- Anime-Sama aggregation expanded:
  - panel resolution cap raised (`ANIME_PANEL_RESOLUTION_LIMIT = 6`) to expose more VF/MULTI hosters.
  - `multi` is treated as VF-compatible in Anime-Sama language parsing.
- Provider fallback hardening:
  - anime sources now prefer Anime-Sama when present, but can fallback to other sources if Anime-Sama is absent.
  - external series seasons can reuse internal provider seasons (fixes missing episodes on titles like The Rookie).

LATEST NAKIOS DISCOVER FEED (2026-03-11, c187)
- Added Nakios `discover` feeds for movies + series.
- Default Nakios pages per feed raised to 3 (surfaces titles missing from popular/trending/upcoming/top-rated).

LATEST FILTER PANEL UI (2026-03-11, c188)
- Replaced theme chips with a "Filtre" button that opens a checkbox panel (desktop + mobile).
- Filter list cleaned and regrouped (Famille/Jeunesse, Super-heros, Action, etc) and auto-hides empty filters.
- Panel includes clear/apply actions and closes on backdrop/escape.
