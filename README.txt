ZENIX STREAM - OPERATIONS MEMORY
Last updated: 2026-03-17

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
- External provider for movies/series is FastFlux only.
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

LATEST FIX LOG (2026-03-17, c340)
- Removed the Top du jour Zenix block from home; top view now uses the main catalog grid.
- Fixed Discover view crash (request/tv views) and added the Aleatoire view.
- TV Directs now pulls Livewatch API with country + search filters (admin list still merges).
- Mobile hero is forced hidden to avoid the blank top poster on phone.
- Added TV Directs controls (country + search).
- Cache-bust bumped to 20260317-c340.

LATEST FIX LOG (2026-03-17, c341)
- Request search now merges FastFlux + TMDB (if TMDB_API_KEY is set) and sorts results so
  missing titles appear first.
- TV Directs: mobile channel list now opens as a clean sub-menu sheet, with a backdrop + close,
  channel cards no longer blink on refresh, and French priority ordering (TF1/France2/etc).
- HLS proxy is no longer gate-protected to prevent playback failures when gate tokens expire.
- Cache-bust bumped to 20260317-c341.

LATEST FIX LOG (2026-03-17, c342)
- FastFlux sources now allow direct fallback for MP4 while keeping proxy preferred.
- Client respects `allowDirect`/`proxyPreferred` so FastFlux can recover if proxy fails.
- TV Directs FR feed now filters to TNT channels 1-26 and preserves channel order.
- TV Directs mobile text-size adjusted to reduce iOS zoom.
- Cache-bust bumped to 20260317-c342.

LATEST FIX LOG (2026-03-17, c343)
- FastFlux MP4 now tries proxy first (even when direct exists) to avoid hotlink failures.
- Mobile/scroll perf tuned: smaller render chunks, lower warmup limits, slower hydrate concurrency.
- Card detail prefetch is deferred on mobile and uses tighter viewport margins.
- Cache-bust bumped to 20260317-c343.

LATEST FIX LOG (2026-03-17, c344)
- Admin data persistence hardened: fallback to `.data/admin-data.json` if /var/lib/zenix is unavailable.
- Demander Contenu now force-refreshes the request list when the view opens and list is empty.
- Source caching guard: /api/zenix-source no longer cached; empty /stream payloads are not cached.
- Cache-bust bumped to 20260317-c344.

LATEST FIX LOG (2026-03-18, c345)
- Demander Contenu desktop cards compacted to match Nakios-style suggestions.
- TV Directs now uses iptv-org API (FR TNT 1-26 only); admin/livewatch list is cleared.
- TV Directs mobile layout tightened (smaller cards, no zoomy feel).
- Source format detection now treats /e/ and /player URLs as embeds to avoid broken video loads.
- Cache-bust bumped to 20260318-c345.

LATEST FIX LOG (2026-03-18, c346)
- Added live "En lecture" counter in admin (watching now).
- Heartbeat now reports playback state to analytics.
- Admin analytics payload includes watchingNow.
- Cache-bust bumped to 20260318-c346.

LATEST FIX LOG (2026-03-18, c347)
- FastFlux sources are now forced through the proxy (proxy-only) to avoid hotlink/CORS failures.
- Player validation timeout raised for heavy MP4 sources (improves FastFlux start reliability).
- Catalog rendering tuned for smoother scroll (smaller chunks + lower warmup budgets).
- Cache-bust bumped to 20260318-c347.

LATEST FIX LOG (2026-03-18, c348)
- Mobile validation now uses a longer probe timeout (6.5s) to avoid false negatives on slow starts.
- Mobile playback bootstrap window increased (4.2s) for iPhone/Safari stability.
- Probe-only validation no longer calls `video.play()` (avoids iOS autoplay blocks during validation).
- Cache-bust bumped to 20260318-c348.

LATEST FIX LOG (2026-03-18, c349)
- TV Directs mobile layout tightened (no overflow), long channel names now ellipsized.
- TV Directs client-side hard cap to TNT 1-26 if any extra channels leak.
- Aleatoire now has a dedicated Nakios-style view (pick Film/Serie/Anime + animation + result card).
- Cache-bust bumped to 20260318-c349.

LATEST FIX LOG (2026-03-18, c350)
- TV Directs now returns all FR channels (not just TNT 1-26); TNT order stays on top.
- Mobile TV Direct controls are forced to full width (no overflow on search/inputs).
- Client no longer caps TV Direct channels to 26.
- Cache-bust bumped to 20260318-c350.

LATEST FIX LOG (2026-03-18, c351)
- TV Directs now pulls FR channels from the iptv-org FR M3U (more reliable + faster).
- If M3U fails, fallback keeps the JSON API path.
- Mobile TV Direct controls forced to full width to stop overflow on search.
- Cache-bust bumped to 20260318-c351.

LATEST FIX LOG (2026-03-18, c352)
- TV Direct mobile layout hardened again: controls + player are forced inside viewport.
- Added box-sizing + width constraints to stop any horizontal overflow on phone.
- Cache-bust bumped to 20260318-c352.

LATEST FIX LOG (2026-03-18, c353)
- TV Direct now tries proxy-first for HLS streams, with direct fallback if needed.
- Improves TV playback reliability on mobile + desktop when streams block cross-origin.
- Cache-bust bumped to 20260318-c353.

LATEST FIX LOG (2026-03-18, c354)
- FastFlux sources now allow direct fallback when proxy stalls (proxy still preferred).
- Player validation adds a fast same-origin proxy HEAD probe for MP4 to avoid false negatives.
- If validation fails, player does a real playback attempt before auto-repair (prevents 0-lecteur stalls).
- Cache-bust bumped to 20260318-c354.

LATEST FIX LOG (2026-03-18, c355)
- FastFlux source resolution now trusts TMDB id match even if the title label differs (fixes Scream 7 / Banlieusards 3).
- TV Direct video now re-shows the player after candidate fallback (fixes audio-only with hidden video).
- Cache-bust bumped to 20260318-c355.

LATEST FIX LOG (2026-03-18, c356)
- HLS proxy now retries MP4 requests without Range when upstream rejects byte ranges (fixes FastFlux MP4 not playing).

LATEST FIX LOG (2026-03-18, c357)
- Debug-only titles (Scream 7 / Banlieusards 3 / Cars) now fall back to normal sources if debug sources are missing.
- Cache-bust bumped to 20260318-c357.

LATEST FIX LOG (2026-03-18, c358)
- Mobile FastFlux playback now waits longer before failing, and tolerates slow metadata on MP4.
- Prevents “URL not read” on iPhone when the file responds slowly.
- Cache-bust bumped to 20260318-c358.

LATEST FIX LOG (2026-03-18, c359)
- iOS/mobile playback unlock added (pre-warms the video element on user gesture).
- Mobile validation now skips probe-only and goes straight to real playback with auto-repair fallback.
- Mobile auto-switch guard relaxed to avoid rapid source bouncing.
- Cache-bust bumped to 20260318-c359.

LATEST FIX LOG (2026-03-18, c360)
- Scream 7 / Banlieusards 3 now return a dedicated debug MP4 source (FastFlux CDN via proxy).
- Ensures the correct URL is always used for these titles.

LATEST FIX LOG (2026-03-18, c361)
- HLS proxy now retries more FastFlux responses (401/403/404/405/416/429) across header variants.
- Fixes FastFlux MP4 debug URLs returning HTML/403 on some clients.

LATEST FIX LOG (2026-03-17, c326)
- Mobile navbar redesigned as a full-screen streaming menu (premium overlay).
- Mobile nav now occupies the full viewport with slide-up animation.

LATEST FIX LOG (2026-03-17, c328)
- Mobile nav overlay now includes a blurred catalogue preview background.
- Mobile nav items now include category icons + glow on press.

LATEST FIX LOG (2026-03-17, c329)
- Player auto-validation now triggers auto-repair when no reader validates.
- After auto-repair, readers are re-validated (2s) and the first valid reader is locked.
- If still no reader works, player shows: "Aucun lecteur en marche. Mentionner sur Discord \"Astrax\"."

LATEST FIX LOG (2026-03-17, c330)
- Mobile nav category icons refreshed (Films/Séries/Anime).
- Calendar taps are now safe-touch (scroll no longer opens titles).
- Backup popup now shows only once per session (no repeated reopen after refresh).

LATEST FIX LOG (2026-03-17, c331)
- Backup popup now respects session-only (no 24h suppression), so it appears after Discord on each new session.

LATEST FIX LOG (2026-03-17, c332)
- Recommandation: scoring now uses interest signals + stricter filters for more precise matches.
- Recommandation options no longer "blink" (hover animation softened).

LATEST FIX LOG (2026-03-17, c333)
- Recommandation UI: removed animations/transitions that caused blinking on choices and cover cards.

LATEST FIX LOG (2026-03-17, c334)
- Recommandation cover cards now bypass image loading effects to stop blinking.

LATEST FIX LOG (2026-03-17, c335)
- Recommandation cover cards are now memoized to avoid rerenders/blinking during auto-refresh.

LATEST FIX LOG (2026-03-17, c336)
- Recommandation: added "Quand veux-tu regarder" (matin/aprem/soir) with smart scoring.
- Recommandation: cover map stabilizes image selection to prevent blinking.

LATEST FIX LOG (2026-03-17, c337)
- Player loading now plays a subtle "Netflix vibe" sting (best-effort, user-gesture gated).
- Top du jour Zenix is now based on local playback counts with fallback merge.
- Local cover cache added for visible covers to speed repeat visits.

LATEST FIX LOG (2026-03-17, c338)
- Auto-validation now probes in background then starts the fastest reader for real playback.
- If the chosen reader fails to play, we continue to the next one instead of getting stuck.

LATEST FIX LOG (2026-03-17, c339)
- Added "Demander Contenu" public requests flow + admin moderation (status + delete).
- Added "TV Directs" with admin-managed channel list (HLS/MP4/embed).
- Added public endpoints `/api/requests` and `/api/tv-channels` (adblock gate exempt).
- FastFlux search now returns overview/backdrop for request previews.

LATEST FIX LOG (2026-03-17, c327)
- Mobile search input font-size forced to 16px to prevent iOS zoom on focus.
LATEST FIX LOG (2026-03-17, c325)
- Topbar now accounts for iOS safe-area (prevents cut-off at top before scroll).
- VisualViewport events refresh topbar height on mobile address bar changes.
LATEST FIX LOG (2026-03-17, c324)
- Player opening now force-closes Discord/Backup gates and clears any lingering lock classes.
- Discord/Backup gates will not appear while a player/detail overlay is open.
- Mobile nav drawer height now uses dynamic viewport units (fixes top-of-page cut-off).
- Mobile cover warmup is refreshed after closing player/detail for smoother scrolling.
LATEST FIX LOG (2026-03-17, c323)
- Playback now silently refreshes the gate token on every “Démarrer”.
- If the token refresh succeeds, adblock false-positives are cleared.

LATEST FIX LOG (2026-03-17, c322)
- Adblock detection hardened (double-check) to reduce false positives that can block playback.
- Gate token keepalive added to avoid expiry mid-session.
- Adblock detection no longer clears the last gate token (prevents sudden “no playback” after a while).
- Mobile search input padding reduced so placeholder text fits on phone.
- Mobile nav drawer styling improved.

LATEST FIX LOG (2026-03-16)
- FastFlux proxy now preserves referer across redirects; playlists rewrite using final URL.
- External FastFlux items no longer swap to internal duplicates (FastFlux stays preferred).
- Card meta cleaned: runtime text removed, year displayed as pill.
- Mobile nav redesigned with left drawer (hamburger), topbar shows Zenix + search + online badge.
- Announcement banner stickiness now uses topbar height (no mid-scroll drift on phone).
- Admin analytics counters added (live/24h/48h/total), total persists across restarts.
- Discord popup icon centering refined.
- Mobile nav now uses drawer only (no scrolling pills on phone).
- FastFlux matching tightened + embed player allowed when needed.

STREAMING/PLAYBACK NOTES
- Auto-switch source is active when playback is blocked.
- HLS proxy endpoint: /api/hls-proxy
- Some upstream providers return numeric-encoded playlists.
  Server now decodes numeric playlists more robustly before rewriting.
- FastFlux CDN redirects now preserve referer inside the proxy (fixes 403 on FastFlux readers).
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

LATEST FIX LOG (2026-03-15)
- Anti-adblock gate UI hardening:
  - renamed gate DOM classes/ids to avoid adblock CSS hiding the overlay.
  - body lock class renamed to `access-locked`.
  - UI recovery now stops if adblock is detected to avoid reload loops hiding the gate.
- Access gate renamed again to avoid filters on "gate" keyword (access-layer).
- Player start menu fallback:
  - added delegated click fallback for play buttons (card/top/reco/detail) if bindings fail.
  - guards against double open within 360ms to avoid duplicate overlays.
- Nakios compatibility guard:
  - incompatible Nakios sources are filtered by title match to avoid wrong-film playback.
  - player warns when incompatible sources are removed and no reliable reader remains.
- Scream 7 debug hard override:
  - player now forces the debug-only Scream 7 source and ignores all other readers.
- Banlieusards 3 debug hard override:
  - player now forces the debug-only Banlieusards 3 source and ignores all other readers.
- Cars : Quatre roues debug hard override:
  - player now forces the debug-only Cars source and ignores all other readers.
  - added a second debug reader for iPhone fallback (FULL HD MULTI).
  - added a mobile-only debug reader that forces proxy-only playback.
  - mobile debug uses a dedicated `/api/hls-proxy-mobile` allowlisted to Cars for iPhone resilience.
- Start menu validation behavior:
  - sequentially probes all readers (2s window) before locking the first valid one.
  - auto-switch is locked after validation to avoid mid-play source hopping.
- Scream 7 Noctaflix hardening:
  - forced Noctaflix override now triggers by TMDB id/media id + title.
  - Noctaflix fetch headers include full browser UA to avoid HTML blocks.
  - owned-source fetch now passes title/year to server for better overrides.
- UI recovery hardening:
  - recovery path now re-initializes popups, announcement, and event bindings if boot failed.
- Scream 7 debug source:
  - added a fixed MP4 debug source from fastflux for Scream 7.
  - routed via `/api/hls-proxy` with Noctaflix referer fallback for fastflux hosts.
  - forced Scream 7 to only expose the debug proxy source (all other sources hidden).
- Debug badges:
  - player source chips now show a Debug badge when a source is flagged debug.
  - Nakios sources now include one debug proxy source per title.
- Strict Nakios matching enabled (tmdbId required, no fuzzy search fallback).
- Cache-bust bumped to `20260315-c286`.
- Manual source lock hardens:
  - auto-switch disabled after user-selected source; user stays on chosen source.

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

LATEST FIX LOG (2026-03-11)
- Episode progress now stores per-episode time (SxEy) for series/anime when available.
- Progress saving no longer overwrites saved time with 0 when the player doesn't expose playback time.
- Resume picks per-episode time when switching season/episode; auto-next forces start at 0.
- Theme filter panel stacking fixed (panel above backdrop, checkboxes clickable).
- Nakios supplemental catalog now deepens pages on demand to surface more titles.
- Added adaptive performance tuning (device/network) for catalog batches, image budgets, and supplemental page size.
- Ads now preconnect to the ad host and warm the native banner earlier; sponsor slot shows a fast-loading placeholder.
- Adblock enforcement is now server-side gated: protected API calls require a short-lived gate token.
- Direct upstream API calls removed from frontend (proxy only) to reduce exposed provider names in DevTools.
- Gate bootstrap now retries on first 403 and uses a neutral proof script path to avoid false positives.
- Nakios-facing labels are now branded as Zenix in API responses and UI (no provider names exposed).
- Pinned Nakios titles added: Go Karts, Minions (2015, Rise of Gru) + Moi, Moche et Mechant (1-4).
- Player now pre-issues the gate token before playback to avoid first-load source misses.
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

LATEST MOVIE SOURCE RETRY + NAKIOS TIMEOUT (2026-03-11, c199)
- If the movie source pool is empty on first load, player now performs an automatic refresh before failing.
- If still empty, shows a clear "En attente" (external/pending) or "Lecture indisponible" message and stops the guard.
- Nakios source fetch timeout increased (frontend + server) to reduce first-load failures on slow source API.
- Go Karts pinned year corrected to 2020 for better matching.

LATEST IOS PREFETCH + TEST GATE BYPASS (2026-03-11, c200)
- Mobile prefetch now warms the first HLS manifest (best-effort) to reduce iOS first-play stalls.
- Added `ZENIX_GATE_DISABLE=1` server flag for local test runs (gate still active in production).

LOCAL BRUTE RESULT (c200, 2026-03-11)
- Source: `__tmp_brut_f1_mercredi_matrix_result_local_c207.json`
- Env: `ZENIX_GATE_DISABLE=1`
- Summary: total 8, passed 8, failed 0, `/api/media/*/sheet` 404 count: 0

LATEST ADMIN + ANNOUNCEMENT (2026-03-12, c201)
- Added private admin panel at `/admin` (not linked from main UI).
- Admin auth uses server-side password (env `ZENIX_ADMIN_PASSWORD`) + secure HttpOnly session cookie.
- Admin features:
  - announcement message with duration (shown on desktop + mobile).
  - import by URL (Nakios + Anime-Sama) to add custom entries.
  - overrides (edit title/overview/poster/status or hide entries).
- Public announcement endpoint: `/api/announcement`.

LATEST ADMIN GATE + EXTERNAL SEARCH FALLBACK (2026-03-12, c202)
- Adblock gate now exempts `/api/admin/*` and `/api/announcement` so admin login works even with adblock.
- External playback can now query internal search to find a playable Purstream candidate when Nakios has no sources
  (helps titles like "Go Karts" if they exist in the main catalog).

LATEST ADMIN COOKIE FIX (2026-03-12, c203)
- Admin session cookie now uses `Path=/` so `/api/admin/*` can see it (fixes "login does nothing").

LATEST CSS LOAD GUARD (2026-03-12, c204)
- Added a stylesheet retry guard in `index.html` to re-attach `zenix.css` if it fails to load.
- Bumped `zenix.css` + `zenix.js` cache-bust version to `20260312-c203`.

LATEST EXTERNAL SOURCE MERGE (2026-03-12, c205)
- External items now merge owned sources + Nakios sources, then add Zenix relay proxies to maximize readers.

LATEST ADMIN TOOLS (2026-03-12, c206)
- Added admin search across Zenix (Purstream) + Nakios via `/api/admin/search`.
- Added admin repair tool (`/api/admin/repair`) to fill missing metadata + tmdb id for custom entries.
- Added admin owned-sources manager (`/api/admin/owned`) to attach manual sources to titles.

LATEST FILMER2 INTEGRATION (2026-03-12, c207)
- Filmer2 catalog + sources parser added (home list + detail pages).
- Filmer2 titles are merged into supplemental catalog (dedupe by title/year vs Nakios).
- Filmer2 sources available via `/api/filmer2-source`, seasons via `/api/filmer2-seasons`.
- Admin import now accepts Filmer2 URLs; admin search lists Filmer2 results.

LATEST SHARE + PENDING RESCUE + ADMIN LIVE SEARCH (2026-03-12, c208)
- Share buttons use native `navigator.share` when available, fallback to copy with visible feedback.
- When playback returns empty/pending sources, auto-rescue tries Purstream search then Filmer2 sources and auto-switches if playable.
- Added public Filmer2 search endpoint: `/api/filmer2-search`.
- Admin search is now live (debounced) with Auto-fix + Selection actions; IDs are auto-filled when you pick a result.

LATEST REPAIR ENDPOINTS + FILMER2 FALLBACK (2026-03-12, c210)
- Added `/api/repair-sources` and `/api/repair-store` endpoints so the player "R?paration" button persists new sources.
- Admin data now stores `repairs` entries with TTL pruning.
- Episode playback now forces external rescue after repeated source failures (helps broken readers like Young Sherlock).
- Filmer2 search retries without year to improve match rate on tricky titles.
- Cache-bust bumped to `20260312-c210`.

VPS ACCESS (ADKYNET) - OPERATIONAL NOTES (2026-03-12)
- VPS IP: 185.218.21.29
- SSH user: root (no "ubuntu" user on this VPS)
- SSH auth: key-based only (password auth not available in this automation context)
- Local key path (this machine): C:\Users\user\.ssh\zenix_adkynet
- Public key to authorize on VPS (authorized_keys):
  ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILik7g3tcw5oNECzWAjunQuzjNBDHkp1pnUwTUy6yr68 zenix

DO NOT STORE PASSWORDS OR PRIVATE KEYS IN THIS REPO.
If credentials change, store them privately (not in README).

SERVICE LAYOUT (VPS)
- App path: /opt/zenix (git clone of https://github.com/Notimax/zenix-deploy)
- Node version: 20.x (installed via NodeSource)
- Service: /etc/systemd/system/zenix.service
- Env file: /etc/zenix.env
- Nginx site: /etc/nginx/sites-available/zenix (enabled via sites-enabled/zenix)
- TLS cert: /etc/letsencrypt/live/zenix.best

DEPLOY FLOW (VPS)
1) SSH: ssh -i C:\Users\user\.ssh\zenix_adkynet root@185.218.21.29
2) Update code:
   cd /opt/zenix
   git pull --rebase
   npm ci --omit=dev
3) Restart:
   systemctl restart zenix.service
   systemctl status zenix.service --no-pager
4) Verify:
   curl -I https://zenix.best

NGINX PROXY (current)
- HTTP -> Node on 127.0.0.1:4173
- HTTPS handled by Certbot (auto-renew via systemd timer)

LATEST PROVIDER MASKING (2026-03-13, c211)
- Added neutral endpoints for public use:
  - /api/zenix-source (replaces nakios/filmer2 endpoints in frontend)
  - /api/zenix-seasons (replaces nakios/filmer2 seasons in frontend)
  - /api/zenix-anime-source + /api/zenix-anime-seasons aliases
- Calendar + supplemental payloads sanitized:
  - provider keys renamed to `primary` / `anime` / `supplemental`
  - `sourceLinks` removed, external detail URLs/keys stripped
  - provider labels normalized to `Zenix`
- Anime planning cards use neutral `source: "anime"` and safe keys (no upstream URLs in payload).

LATEST STARTUP FAILSAFE (2026-03-13, c212)
- Startup splash is now hidden by default in HTML.
- Added an inline unlock timer to force-hide the splash and remove `startup-lock`
  if JS fails to complete the intro (prevents infinite animation lock).
- Cache-bust bumped to `20260313-c212`.

LATEST JS PARSE FIX (2026-03-13, c214)
- `zenix.js` normalized to UTF-8 and cleaned invalid escaped tokens that broke parsing.
- Fix restores JS execution (nav, covers, popups, announcements).
- Cache-bust bumped to `20260313-c214`.

LATEST RECOMMENDATION VIEW FIX (2026-03-13, c215)
- Fixed `isRecommendationView` ReferenceError in `renderAll()` that halted JS boot.
- Cache-bust bumped to `20260313-c215`.

LATEST GATE CONCURRENCY FIX (2026-03-13, c216)
- Gate token issuance is now awaited by concurrent API calls (prevents 403 bursts on load).
- Fix restores initial catalog rendering and popups when gate is enabled.
- Cache-bust bumped to `20260313-c216`.

LATEST GO KARTS + REPAIR + NAV FIX (2026-03-13, c217)
- Zenix-source lookup now retries Nakios search with a cleaned title and without year when sources are empty.
  (Improves matches like Go Karts and avoids false "trop recent".)
- Repair/pending messaging now ignores stale pending flags for older releases.
- Nav dropdowns now open reliably on mobile (tap + overflow unclipped).
- Cache-bust bumped to `20260313-c217`.

LATEST MOBILE NAV + HERO TUNING (2026-03-13, c218)
- Info submenu removed (Infos is now a direct nav item).
- Mobile nav toggles use touch-first handler for reliable submenu open on iPhone.
- Nav submenu overflow unclipped at topbar level on mobile.
- Hero carousel hidden on phone to avoid auto-scrolling cards at top of categories.
- Cache-bust bumped to `20260313-c218`.

LATEST MOBILE SUBMENU SHEET (2026-03-13, c219)
- Added a dedicated mobile backdrop and fixed-position submenu sheet for nav dropdowns.
- Dropdowns now open reliably on iPhone with proper overlay and tap-to-close.
- Cache-bust bumped to `20260313-c219`.

LATEST MOBILE SUBMENU FIX (2026-03-13, c220)
- Nav dropdowns now render inside a dedicated mobile sheet with list items.
- Default navbar submenu is hidden on mobile to avoid empty blur state.
- Cache-bust bumped to `20260313-c220`.

LATEST MOBILE SUBMENU FAILSAFE (2026-03-13, c221)
- Nav submenu sheet is now created dynamically if missing (handles cached HTML).
- Discover fallback list injected if no items are found.
- Cache-bust bumped to `20260313-c221`.

LATEST DESKTOP SUBMENU BLUR FIX (2026-03-13, c222)
- Nav backdrop/sheet now only activate on mobile; desktop clicks no longer show blur.
- Cache-bust bumped to `20260313-c222`.

LATEST DESKTOP SUBMENU RESTORE (2026-03-13, c223)
- Desktop submenu now opens again (overflow visible without blur/backdrop).
- Cache-bust bumped to `20260313-c223`.

LATEST ADMIN CUSTOM DELETE FIX (2026-03-13, c224)
- Admin custom delete now supports `external_key` fallback, so the Supprimer button works even when IDs are missing.
- Admin assets now use a cache-bust param so updated admin.js loads despite long cache headers.

LATEST PENDING BADGE + PLAYER SPEED TUNING (2026-03-13, c225)
- Pending status now recognizes Nakios suggestion/pending flags (incl. suggestion/attente/mise en ligne).
- Pending badge displays whenever a title is pending (no more "Nouveau" on pending entries).
- Player source ranking favors direct formats harder and penalizes embed on mobile for faster starts.
- Playback stall thresholds tightened for quicker auto-switch.
- Cache-bust bumped to `20260313-c225`.

LATEST SOURCE BADGES + PREVIEW (2026-03-13, c226)
- Sources show a "Lecture OK" badge after successful playback for the user.
- Sources include a mobile compatibility indicator.
- Cards show a quality badge (HD / Full HD / 4K) based on successful playback.
- Desktop hover preview plays a silent 10s clip when a direct MP4/WebM preview is available.
- Cache-bust bumped to `20260313-c226`.

LATEST YOUTUBE PLAYLIST SUPPORT (2026-03-13, c227)
- Admin import now accepts YouTube playlist URLs.
- Zenix seasons + sources now resolve YouTube playlist entries for TV items.
- Playlist episodes map to S1E1.. and return a YouTube embed source.

LATEST PREVIEW + QUALITY RULE (2026-03-13, c228)
- Card preview now supports HLS sources (desktop only).
- Quality badges default to Full HD/4K via global rule when no playback success is cached.
- Cache-bust bumped to `20260313-c228`.

LATEST BACKUP POPUP + VITRINE (2026-03-13, c229)
- Added a backup-domain popup on zenix.best (shows zenix.lol once per day/session).
- New static vitrine project in `site/zenix-lol-vitrine` with configurable active URL.
- Cache-bust bumped to `20260313-c229`.

LATEST GATE TOKEN HEADER FALLBACK (2026-03-13, c230)
- Gate tokens now returned by /api/gate/issue and stored in localStorage as a fallback when cookies are blocked.
- API calls include X-Zenix-Gate header when available.
- Server now accepts gate tokens from header if cookie is missing.
- Cache-bust bumped to `20260313-c230`.

LATEST BACKUP POPUP SEQUENCING + BOOKMARK UX (2026-03-13, c231)
- Backup popup now waits for the Discord prompt to close (no collision).
- Mobile backup popup uses share sheet when available and provides device-specific bookmark hints.
- Backup URL is a clickable link and opens in a new tab.
- Cache-bust bumped to `20260313-c231`.

LATEST BACKUP POPUP + BACKUP CONFIG API (2026-03-13, c232)
- Backup popup now always waits for the Discord prompt session before showing.
- Backup config API added at /api/backup-config (public GET + admin POST) with CORS for zenix.lol.
- zenix.lol now pulls active/previous URL from the API and shows previous link struck through.
- Cache-bust bumped to `20260313-c232`.

LATEST ADMIN SUGGESTIONS + ANNOUNCE MGMT + ZENIX.LOL ADMIN (2026-03-13, c233)
- Added 10 Nakios pinned films (Inception, Interstellar, The Dark Knight, Parasite, Dune, Blade Runner 2049, The Prestige,
  Mad Max: Fury Road, Whiplash, Joker) to surface missing titles.
- Admin announcement card now shows active announcement and allows deletion.
- Added admin suggestion workflow:
  - `/api/admin/suggestions` (GET) returns missing-title suggestions.
  - `/api/admin/suggestions/accept` (POST) imports the title.
  - `/api/admin/suggestions/skip` (POST) defers the suggestion for a few days.
- Admin UI now includes a Suggestions card (validate/refuse/next).
- zenix.lol admin now uses a password-only login screen, stores the password in session,
  and shows the panel after login (no mixed password+URL page).
- Admin assets cache-bust bumped to `20260313-c233`.

LATEST BACKUP POPUP ALWAYS-ON (2026-03-13, c234)
- Backup popup (zenix.lol) now shows on every site visit (still after Discord prompt).
- Cache-bust bumped to `20260313-c234`.

LATEST BACKUP POPUP LINK LAYOUT + ZENIX.LOL ADMIN NO-REFRESH (2026-03-14, c235)
- Backup popup link layout improved (no overlap with text, better wrapping).
- zenix.lol admin forms now never reload the page (submit blocked + button clicks + Enter handled).
- Cache-bust bumped to `20260313-c235`.

LATEST BACKUP POPUP LINK CENTER + ZENIX.LOL ADMIN FALLBACK (2026-03-14, c236)
- Backup popup URL is now centered and displayed as a standalone block.
- zenix.lol admin adds an inline fallback handler so login/update works even if admin.js cache fails.
- Cache-bust bumped to `20260314-c236`.

LATEST IOS SHARE + ONLINE COUNT BOOST (2026-03-14, c237)
- iPhone backup popup now triggers the share sheet on first tap (uses click handler on iOS).
- Online count base boosted from +40 to +50.
- Cache-bust bumped to `20260314-c237`.

LATEST DESKTOP BOOKMARK FLOW (2026-03-14, c238)
- Backup popup desktop button now opens zenix.lol and instructs to bookmark that tab.
- Cache-bust bumped to `20260314-c238`.

LATEST DESKTOP BOOKMARK OPEN FIX (2026-03-14, c239)
- Backup popup now tries anchor-click open for zenix.lol and reports popup-block status.
- Cache-bust bumped to `20260314-c239`.

LATEST BOOT FAILSAFE (2026-03-14, c240)
- Added a boot guard: if JS doesn't finish init, re-inject zenix.js once after load.
- init now sets a boot flag and logs init failures to console.
- Cache-bust bumped to `20260314-c240`.

LATEST MOBILE POPUP TAP SHIELD (2026-03-14, c241)
- Closing Discord/Backup/Adblock popups now arms the ghost-tap guard on mobile.
- Prevents tap-through opening cards behind the popup.
- Cache-bust bumped to `20260314-c241`.

LATEST BADGES + REPAIR MESSAGE (2026-03-14, c242)
- Added new card badges: Favori + Vu.
- Repair now reports actual new sources added (no fake count).
- Cache-bust bumped to `20260314-c242`.

LATEST SW CLEANUP FAILSAFE (2026-03-14, c243)
- Inline service-worker + cache cleanup added before JS boot (prevents stale blank UI).
- Cache-bust bumped to `20260314-c243`.

LATEST BOOT HARD RELOAD (2026-03-14, c244)
- If boot still fails after retry, page reloads once per session to clear stale state.
- Cache-bust bumped to `20260314-c244`.

LATEST MOVIX IMPORT (2026-03-14)
- Admin import now accepts Movix URLs and resolves sources via MOVIX_API_BASE.
- Requires MOVIX_BASE_URL + MOVIX_API_BASE in /etc/zenix.env (optional MOVIX_ACCESS_KEY).

LATEST ADMIN DUPLICATE ENTRIES (2026-03-14, c245)
- Admin imports now mark entries as force-duplicate, so they appear even if a title already exists.
- Catalog merge skips semantic dedupe for these forced entries.
- Cache-bust bumped to `20260314-c245`.

LATEST ADMIN BADGE (2026-03-14, c246)
- Admin-forced duplicates now show an "Admin" badge on cards.
- Cache-bust bumped to `20260314-c246`.

LATEST BOOT RETRY GUARD (2026-03-14, c249)
- Boot retry now triggers only if the initial `zenix.js` failed to load (prevents duplicate script execution).
- Added `zenixCoreScript` load/error flags to avoid double-eval errors.
- Cache-bust bumped to `20260314-c249`.

LATEST ZENIX AUTOSWITCH LOCK (2026-03-14, c250)
- Manual source lock no longer blocks auto-switch when the selected source is Zenix.
- Auto-rescue + fallback can engage even after a user clicks the Zenix chip.
- Cache-bust bumped to `20260314-c250`.

LATEST MOBILE NAKIOS WARMUP (2026-03-14, c256)
- Mobile now waits longer for Nakios sources during warmup (5.2s vs 2.2s).
- Applied to movie refresh + episode warmup to reduce missing Nakios sources on iPhone.
- Cache-bust bumped to `20260314-c256`.

LATEST MOBILE HLS PROXY PRIORITY (2026-03-14, c257)
- On iPhone, Zenix sources and known hotlink-sensitive hosts now prefer proxy-first HLS.
- Reduces direct 403 stalls on hosts like `xalaflix/fastflux` by trying the relay before direct.
- Cache-bust bumped to `20260314-c257`.

LATEST MOBILE ZENIX BOOST (2026-03-14, c258)
- Zenix relay sources now get a mobile-only score boost to rank ahead of premium hotlink sources.
- Helps iPhone pick the proxy path faster on titles like La Femme de menage.
- Cache-bust bumped to `20260314-c258`.

LATEST MOBILE ZENIX SORT (2026-03-14, c259)
- On mobile, Zenix relay sources are sorted to the top of the pool before premium scoring.
- Ensures iPhone tries proxy-backed sources first to avoid hotlink 403s.
- Cache-bust bumped to `20260314-c259`.

LATEST VFQ LABEL NORMALIZATION (2026-03-14, c260)
- Language parser now treats `VFQ` / `TRUEFRENCH` as `VF`.
- Prevents VFQ sources from being ranked below MULTI on mobile.
- Cache-bust bumped to `20260314-c260`.

LATEST MOVIE SOURCE MERGE (2026-03-14, c261)
- Movie playback now merges Nakios sources with internal/Zenix sources instead of replacing them.
- Keeps the Zenix relay from direct internal sources even when Nakios sources are present.
- Cache-bust bumped to `20260314-c261`.

LATEST PERSISTENCE + MATCH FIXES (2026-03-14, c262)
- Admin data + backup config now stored in `/var/lib/zenix` by default (prevents clears on deploy).
- Removed auto-reload loop in UI recovery; now shows a sync hint instead of forcing refresh.
- Title matching now enforces numeric sequel alignment (prevents Scream 7 -> Scream 6 mismaps).
- Purstream base updated to `purstream.cc`.
- Cache-bust bumped to `20260314-c262`.

LATEST BOOT RELOAD REMOVED (2026-03-14, c263)
- Removed the hard reload fallback in `index.html` to avoid visible refresh loops.
- Boot retry now only injects `zenix.js` once if the first load fails.
- Cache-bust bumped to `20260314-c263`.

LATEST SOURCE + REPAIR EXPANSION (2026-03-14, c264)
- Movie source filter now keeps all languages (VF/MULTI/VOSTFR/VO) and embeds; no more source trimming.
- Repair now retries playback immediately after updating the source pool.
- Provider matching now checks TMDB ids when present to avoid wrong-title mapping (e.g. Scream 7).
- Cache-bust bumped to `20260314-c264`.

LATEST STRICT EXTERNAL MATCH (2026-03-14, c265)
- External items now require matching TMDB ids when an internal candidate has none.
- Prevents external titles (e.g. Scream 7) from mapping to a wrong internal match.
- Cache-bust bumped to `20260314-c265`.

LATEST MOBILE AUTOSWITCH STABILITY (2026-03-15, c266)
- Added a mobile auto-switch cooldown to prevent rapid source hopping on phone.
- Auto-switch now suppresses itself once playback is stable on mobile (time advancing + ready state OK).
- Health monitor stops early on stable mobile playback to avoid redundant switches.
- Cache-bust bumped to `20260315-c266`.

LATEST EXTERNAL TMDB URL FIX (2026-03-15, c267)
- External entries now extract TMDB id from `external_detail_url` when missing.
- Prevents external titles (e.g. Scream 7) from resolving to wrong internal films.
- Cache-bust bumped to `20260315-c267`.

LATEST EXTERNAL MATCH HARDENING (2026-03-15, c268)
- Catalog semantic dedupe now prefers TMDB id when available (stops title-only merges).
- External items without TMDB id will no longer swap to internal candidates for playback.
- Cache-bust bumped to `20260315-c268`.

LATEST MOBILE AUTOSWITCH LOCK (2026-03-15, c269)
- Mobile auto-switch is now locked out once playback is stable (prevents source hopping mid-play).
- Only a true hard-freeze/error can trigger a switch during the stable lock window.
- Cache-bust bumped to `20260315-c269`.

LATEST SOURCE VALIDATION PASS (2026-03-15, c270)
- Added a 2s per-source validation pass on entry to pick a working reader quickly.
- Validation prefers non-embed readers first, then falls back to normal playback if none validate.
- Validated reader shows a local badge "Lecteur valide" on the source chip.
- Cache-bust bumped to `20260315-c270`.

LATEST UI RECOVERY HARD RELOAD (2026-03-15, c271)
- If the UI is still empty after recovery attempts, a one-time hard reload is triggered.
- Clears catalog cache + unregisters service workers before reloading to prevent blank states.
- Cache-bust bumped to `20260315-c271`.

LATEST PRETTY URLS + SHARE (2026-03-15, c272)
- URLs now reflect the current view (e.g., `/movie/1234-title`, `/series/5678-title`, `/anime/9876-title`).
- Watch routes use `/watch/...` with season/episode query when needed.
- Share now uses the pretty URL for details and playback.
- Cache-bust bumped to `20260315-c272`.

LATEST NOCTA PROVIDER + DUPLICATE HIDE (2026-03-15, c273)
- Added Noctaflix admin import + source resolver (Livewire snapshot + embed decrypt).
- Zenix source routing can now return Noctaflix sources for matching admin entries.
- Forced Noctaflix override for "Scream 7" title key.
- Hard-hide duplicate media id `1507947720`.
- Provider masking now strips `noctaflix` from public payloads.

IOS13 ZENIX READER BRUTE (LIVE, 2026-03-14)
- Script: `__tmp_ios13_zenix_5s_battery.js` (5s per title, WebKit iPhone 13).
- Selection:
  - Movies: Zootopie 2, F1® Le Film
  - Series: Stranger Things, Mercredi
  - Anime: One Piece
- Result: 5/5 passed (Zenix reader active, playback/iframe stable for 5s).
- Note: `La Femme de ménage` was attempted but openPlayer failed in the harness; requires a targeted rerun.

LATEST FIX LOG (2026-03-15, c289)
- iOS debug fallback now keeps proxy path for segment fallback and prefers decoded HLS on debug mobile sources.
- Mobile-only debug fallback lock window extended to reduce mid-play source hopping.
- Debug sources on mobile skip validation to avoid false manual locks.
- Cache-bust bumped to `20260315-c289`.

BRUTE TEST (LIVE, 2026-03-15)
- Script: `__tmp_ios13_cars_debug_20s.js`
- Result: 3/3 failed in Playwright WebKit (error code 4, HLS not playable in this environment).
- Direct HLS probe on WebKit (public stream) also fails, indicating a WebKit/HLS limitation in this environment.
- Action: rely on real iPhone Safari check; find alternate MP4 source if real device still fails.

LATEST UI EMPTY FIX (2026-03-15, c292)
- Guard missing DOM nodes so `bindEvents()` cannot crash on partial HTML loads.
- Fix prevents: categories unclickable, popups missing, catalog not rendering.
- Keep this guard on every future change if the “UI vide” bug reappears.

LATEST UI BOOT WATCHDOG (2026-03-15, c293)
- If core JS fails to boot, a one-time watchdog re-injects `zenix.js` and reloads.
- Prevents intermittent blank UI when CDN or network drops the JS/CSS load.

LATEST CSS INLINE FALLBACK (2026-03-15, c294)
- If CSS fails to load, we retry link and inject inline CSS as a fallback.
- Prevents the “CSS missing” blank style bug on weak connections/CDN hiccups.

LATEST UI SELF-HEAL MONITOR (2026-03-15, c295)
- Added a periodic UI health monitor (20s) to re-init popups, rebind events, reload catalog if empty, and retry CSS silently.
- Exposed __zenixCssEnsure in index.html and invoked it during health checks when CSS is missing.
- One-time hard reload only if repeated health failures and no overlay is open (to avoid disrupting playback).

LATEST UI HEALTH TUNING (2026-03-15, c296)
- UI health monitor now runs every 12s with a 3.5s first check.
- Health checks now re-run on tab focus and when the network returns (online).

LATEST SOURCE MATCH + ADBLOCK FALLBACK (2026-03-15, c297)
- Nakios strict matching tightened: strong title match required in search, stricter token checks + year compatibility in source filtering.
- If tmdbId appears mismatched with title/year, we invalidate it and perform a strict title search before returning sources.
- Added adblock fallback overlay (inline styles) to ensure gate is visible even when blockers hide standard UI.
- Added global error/rejection hooks to trigger UI recovery if runtime errors occur.

LATEST FASTFLUX MIGRATION (2026-03-16, c298)
- External provider switched to FastFlux (noctaflix partner):
  - Supplemental catalog + calendar now pull from FastFlux only.
  - /api/zenix-source resolves FastFlux sources (movies + series).
  - /api/zenix-seasons builds seasons from FastFlux series episodes.
- Disabled runtime integrations for Nakios / Filmer2 / Movix / Noctaflix / YouTube (kept only Purstream + Anime-Sama).
- Admin:
  - Search now queries FastFlux.
  - Import accepts https://fastflux.xyz/movie/{tmdbId} or /series/{tmdbId}.
  - Repair reports FastFlux source counts.
  - Suggestions pull from FastFlux catalog.
- Provider masking now also strips FastFlux in public payloads.
- HLS proxy referer for fastflux hosts uses fastflux.xyz.
- New env required on VPS:
  - FASTFLUX_API_KEY=<key>
  - optional tuning: FASTFLUX_MOVIES_PAGES_PER_FEED, FASTFLUX_MOVIES_MAX_PAGES_PER_FEED,
    FASTFLUX_SERIES_PAGES_PER_FEED, FASTFLUX_SERIES_MAX_PAGES_PER_FEED,
    FASTFLUX_FEED_PAGE_SIZE_ESTIMATE, FASTFLUX_CATALOG_CACHE_MS.

LATEST FASTFLUX CLEANUP (2026-03-16, c299)
- Frontend now only accepts external provider "zenix" (FastFlux) and excludes external anime rows.
- Removed Filmer2 merge calls to avoid duplicate /api/zenix-source fetches.
- External rescue now relies on Zenix/FastFlux sources only.
- Embed blocklist updated for fastflux host.
- Admin data auto-prunes disallowed external custom entries on load.
- Admin UI removed Filmer2-specific custom matching.
- Cache-bust bumped to `20260316-c299`.

FASTFLUX BADGE DISPLAY (2026-03-16, c300)
- FastFlux sources now keep `source_name = FastFlux` and carry `origin = fastflux`.
- Player chips show a FastFlux badge on those sources (no longer forced to Zenix label).
- Cache-bust bumped to `20260316-c300`.

FASTFLUX TYPE FALLBACK (2026-03-16, c301)
- If a FastFlux lookup returns no sources, the backend now retries the opposite type (movie <-> tv)
  using title search to recover sources (helps cases like War Machine).
- Cache-bust bumped to `20260316-c301`.

FASTFLUX PRIORITY + SOURCES ONLY (2026-03-16, c302)
- Duplicate catalog entries now prefer FastFlux (`externalProvider=zenix`) over Purstream.
- External titles use only FastFlux sources (no owned/repair/relay merges).
- Cache-bust bumped to `20260316-c302`.

FASTFLUX CARS OVERRIDE (2026-03-16, c303)
- Cars : Quatre roues now returns FastFlux sources first when available (tv fallback),
  and only falls back to the debug sources if FastFlux has none.
- Cache-bust bumped to `20260316-c303`.

FASTFLUX REPAIR STRATEGY (2026-03-16, c304)
- Admin repair now retries FastFlux with opposite media type and year-less fallback.
- Repair counts now reflect the real FastFlux source availability across movie/tv matches.
- Cache-bust bumped to `20260316-c304`.

REPAIR BUTTON LABEL (2026-03-16, c305)
- Player repair button label updated to "CLIQUE ICI POR REPARER".
- Cache-bust bumped to `20260316-c305`.

BOOT HARDENING (2026-03-16, c306)
- Added asset version guard to force a one-time hard reload if HTML/JS versions mismatch.
- Added JS/CSS preloads plus a fetch+inline JS fallback if the main script fails.
- Cache-bust bumped to `20260316-c306`.

BOOT FAILSAFE + NON-BLOCKING INIT (2026-03-16, c307)
- Boot retry now arms on DOMContentLoaded (not just window load) and adds an inline watchdog reload
  if boot never completes (prevents blank UI when load stalls).
- Init no longer blocks on initial catalog fetch (3.2s max wait); UI + popups render even if API stalls,
  and the catalog re-renders as soon as data arrives.
- Cache-bust bumped to `20260316-c307`.

BOOT + REF HYDRATION GUARD (2026-03-16, c308)
- CSS fallback now arms on DOMContentLoaded (not just load) to avoid unstyled pages if load stalls.
- Core refs are rehydrated before event binding + recovery; missing critical DOM triggers a one-time reload.
- Cache-bust bumped to `20260316-c308`.

BOOT INLINE DUPLICATE GUARD (2026-03-16, c309)
- Inline JS fallback now fires only when the main script reports a load error,
  preventing duplicate script execution and the `Identifier has already been declared` crash.
- Cache-bust bumped to `20260316-c309`.

BOOT DOUBLE-LOAD GUARD (2026-03-16, c310)
- Added `__zenixBooting` flag so fallback/watchdog scripts do not inject while main JS is already running,
  preventing duplicate `const` declarations.
- Cache-bust bumped to `20260316-c310`.

FASTFLUX EMBED HLS FIX (2026-03-16, c311)
- `.m3u8` URLs (even if they contain `/embed/`) are now treated as HLS, not iframe embeds.
- This forces FastFlux HLS sources through the proxy and fixes iOS X-Frame-Options blocks.
- Cache-bust bumped to `20260316-c311`.

EMBED DETECTION OVERRIDE (2026-03-16, c312)
- Frontend now treats `.m3u8` as HLS even if the source format says embed,
  ensuring proxy playback and avoiding iframe blocks on iOS.
- Cache-bust bumped to `20260316-c312`.

BOOT WATCHDOG + PROXY GUARD (2026-03-16, c313)
- Boot watchdog no longer reinjects zenix.js when core already loaded or boot error is flagged.
  It triggers a recovery kick instead (prevents duplicate const errors).
- Added `window.__zenixKick` so inline watchdogs can request UI recovery without reloading scripts.
- Frontend now forces proxy-only playback for fastflux/xalaflix/fsvid hosts (except r1 direct),
  aligning with the FSVID routing rules.
- Cache-bust bumped to `20260316-c313`.

PROXY ENFORCEMENT (2026-03-16, c314)
- Proxy-only enforcement now uses the proxy target host (not just the proxied URL host),
  so xalaflix/fastflux sources stay proxy-only even when already wrapped.
- Cache-bust bumped to `20260316-c314`.

SAFE ADBLOCK UI (2026-03-16, c315)
- Adblock now runs in soft mode: UI stays visible and interactive even when a blocker is detected.
- Support strip shows a "lecture bloquee" message while adblock is active.
- Gate now protects playback endpoints only; catalog/calendar/search/media/seasons are exempt so UI always loads.
- Cache-bust bumped to `20260316-c315`.

FASTFLUX MATCH HARDENING + MOBILE DRAWER ENFORCED (2026-03-16, c319)
- FastFlux title search now accepts only strict title/year matches when tmdbId is missing (prevents wrong-film playback).
- FastFlux format detection now prefers real file extensions; embed player links stay embed (no proxy).
- Mobile nav drawer is enforced across all mobile blocks (no horizontal pills on phone).
- Cache-bust bumped to `20260316-c319`.

SOURCE PROBE + MOBILE BADGE LAYOUT (2026-03-17, c320)
- Added lightweight source probing (HEAD/Range) to drop clearly invalid URLs and proxy-fallback when possible.
- FastFlux/Purstream source selection now avoids obvious HTML/JSON links before playback.
- Mobile topbar: Zenix logo icon hidden, online badge shown next to title (visible size).
- Cache-bust bumped to `20260317-c320`.

FASTFLUX-ONLY SOURCES + PROXY MP4 FIX (2026-03-17, c321)
- External (FastFlux) items now show only FastFlux sources (other readers ignored).
- Proxied MP4 sources are now valid playback candidates (fixes FastFlux MP4 on mobile).
- Mobile topbar badge moved to the far right (search row) and spaced from title.
- Cache-bust bumped to `20260317-c321`.


FASTFLUX PROXY RETRY (2026-03-18, c361)
- HLS proxy now retries FastFlux responses on 401/403/404/405/416/429 across header variants (fixes MP4 debug URLs returning HTML).

FASTFLUX SMARTLINK GATE (2026-03-18, c362)
- Added FastFlux smartlink modal: shown once per session before FastFlux playback; user continues to open sponsor tab and then playback starts.
- New fastflux gate overlay + body lock, and external guard allows the smartlink host.
- Cache-bust bumped to 20260318-c362.

FASTFLUX SMARTLINK PASS-THROUGH (2026-03-18, c363)
- Continue now always unblocks playback even if the popup is blocked; shows a note but resolves the gate.
- Cache-bust bumped to 20260318-c363.

FASTFLUX SMARTLINK SESSION FIX (2026-03-18, c364)
- FastFlux smartlink now persists per session using in-memory + sessionStorage, with localStorage TTL fallback (2h) for browsers that block sessionStorage.
- Cache-bust bumped to 20260318-c364.

FASTFLUX SMARTLINK PERSISTENCE (2026-03-18, c365)
- Smartlink suppression now persists across content changes using sessionStorage + localStorage TTL + cookie + window.name fallback.
- Cache-bust bumped to 20260318-c365.

FASTFLUX CANCEL FEEDBACK (2026-03-18, c366)
- Cancelling the FastFlux gate now shows a clear message and stops fallback playback; user can reselect FastFlux to retry.
- Cache-bust bumped to 20260318-c366.

FASTFLUX PER-FILM POPUP (2026-03-18, c367)
- FastFlux smartlink now reappears for each new content (per-film/session map).
- Cancel now shows a clear message to reselect FastFlux.
- Cache-bust bumped to 20260318-c367.

FASTFLUX MOBILE/PRIORITY FIX (2026-03-18, c368)
- Mobile hotlink hosts (Purstream/FastFlux/etc) now prefer proxy-first playback to fix iPhone URL stalls.
- FastFlux sources are prioritized globally in source sorting (desktop + mobile).
- Scream 7 now includes FastFlux sources (debug fallback kept).
- FastFlux catalog cache default lowered to 8 min for faster updates.
- Cache-bust bumped to 20260318-c368.

FASTFLUX START + TV MOBILE FIX (2026-03-18, c369)
- When FastFlux exists, playback now starts directly on it (no validation loop).
- When FastFlux is absent, validation runs to pick the fastest working reader, then auto-repair retries.
- TV Direct mobile layout forced inside viewport (no horizontal overflow).
- Cache-bust bumped to 20260318-c369.

FASTFLUX VALIDATION + TV VIEWPORT (2026-03-18, c370)
- Mobile validation now runs when FastFlux is absent (background reader test before play).
- TV Direct view locks to viewport on mobile via tv-live class.
- Cache-bust bumped to 20260318-c370.

SOURCE GATE RELAX (2026-03-18, c371)
- /api/zenix-source and /api/zenix-anime-source are now gate-exempt to prevent “adblock_required” stalls.
- Fixes “chargement infini” when gate token fails on mobile/desktop.

FASTFLUX CDN REWRITE (2026-03-18, c372)
- FastFlux CDN URLs (cdn.fastflux.xyz) are rewritten to fastflux.xyz/api/video_proxy.php?file=...
- Prevents CDN 403 hotlink blocks that caused “chargement infini”.

FASTFLUX EMBED FALLBACK (2026-03-18, c373)
- FastFlux sources now include an embedded player fallback (API /player) when direct MP4 blocks.
- Keeps playback alive even if CDN hotlinking fails.

FASTFLUX NO-EMBED + REDIRECT COOKIES (2026-03-18, c374)
- Removed FastFlux embed fallback per request (FastFlux now uses direct MP4 only).
- HLS proxy now preserves cookies across redirects to keep FastFlux CDN sessions alive.

REPAIR BUTTON HARDEN + FORCE REFRESH (2026-03-18, c375)
- Repair button label fixed ("APPUYER ICI POUR REPARER").
- Repair now forces a fresh FastFlux lookup via /api/zenix-source?force=1 and refreshes gate token.

FASTFLUX PROBE BYPASS (2026-03-18, c376)
- Server probe no longer drops FastFlux sources (keeps playback even if HEAD/GET probe fails).

FASTFLUX GATE LOCK (2026-03-18, c377)
- FastFlux popup can no longer be dismissed via "Annuler" or backdrop click.
- Only the "OUI, OUVRIR" button continues.

REPAIR HARD RESET (2026-03-18, c378)
- Repair now clears local playback locks/caches and bypasses FastFlux priority to test all sources.

REPAIR CACHE FALLBACK (2026-03-18, c379)
- /api/zenix-source now falls back to stored repair sources when FastFlux API returns empty.
- Repair is more reliable after leaving/returning to a title.

GLOBAL REPAIR TRIGGER (2026-03-18, c380)
- Repair button now triggers a global cache reset (/api/repair-global) for all users.
- FastFlux caches + probe cache cleared, and all requests force fresh lookup for a few minutes.

VF LABEL EXPANSION (2026-03-18, c381)
- Language detection now recognizes TRUEFRENCH/VFF/VFI/VFB/VFQ so VF sources don't disappear.

VF VISIBILITY FIX (2026-03-18, c382)
- Language filter now keeps VF sources visible alongside the selected language (avoids VF-only loss).
- Cache-bust bumped to 20260318-c382.

PURSTREAM VF FALLBACK (2026-03-18, c383)
- If FastFlux has no VF for a title, VF/MULTI sources are pulled from Purstream.
- Purstream sources are excluded from probe drops to avoid hotlink false negatives.
- Cache-bust bumped to 20260318-c383.

FASTFLUX AUTO-SWITCH LOCK (2026-03-19, c384)
- Auto-switch is blocked when FastFlux is active (no silent source change unless user clicks).
- Repair now clears manual lock and keeps FastFlux priority after refresh.
- Cache-bust bumped to 20260319-c384.

GLOBAL REPAIR CACHE CLEAR (2026-03-19, c384b)
- Global repair now clears Purstream search cache too (ensures VF fallback refresh for everyone).

AUTO GLOBAL REPAIR (2026-03-19, c385)
- When multiple playback failures happen in a short window, a global repair is auto-triggered.
- Global repair clears FastFlux+Purstream caches and refreshes playback for everyone.
- Cache-bust bumped to 20260319-c385.

GLOBAL FAIL AGGREGATOR + WARMUP (2026-03-19, c386)
- Playback failure reports are aggregated server-side; multiple users failing triggers global repair.
- FastFlux warmup runs every ~25 min (plus at startup) and clears Purstream search cache.
- Cache-bust bumped to 20260319-c386.

AUTO-REPAIR SENSITIVITY (2026-03-19, c387)
- Global repair triggers at 2 concurrent failures (faster recovery).
- Warmup interval lowered to ~20 min and repair cooldown reduced for faster retries.
- Repair rate-limit reduced to 15s to allow quicker manual retries.
- Cache-bust bumped to 20260319-c387.

AUTO-REPAIR MAX (2026-03-19, c388)
- Global repair triggers from a single failure (threshold = 1).
- Global repair cooldown reduced to 60s; manual repair rate-limit now 10s.
- FastFlux stall report throttled to 8s for faster detection.
- Cache-bust bumped to 20260319-c388.
