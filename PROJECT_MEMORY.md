# Zenix Project Memory

Last update: 2026-03-09

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

## Mobile robustness
- Startup splash must never block app forever.
- Keep a hard timeout fallback to force-hide splash and unlock body scroll.

## Sponsor ad policy
- Sponsor remains restricted to UI slots (`Sponsorise` sections only: home/catalog/detail).
- Native script runs inside a sandboxed iframe (`allow-scripts allow-same-origin`) mounted in sponsor slots.
- Top document must not inject ad script tags directly (`maddenwiped.com` should stay iframe-contained).
- Objective: keep sponsor impressions in dedicated blocks while minimizing forced top-level redirects/popups.

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
