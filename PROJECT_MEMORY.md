# Zenix Project Memory

Last update: 2026-03-08

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

## Mobile robustness
- Startup splash must never block app forever.
- Keep a hard timeout fallback to force-hide splash and unlock body scroll.

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
- Confirm no mobile toast visible.
- Confirm startup splash disappears on mobile.
- Confirm source fallback behavior in player status and source selector.
- For iOS fallback validation, expect statuses like `Fallback iOS actif...` then `Lecture en cours.` and segment progression.

## Mandatory test failure loop
- If a playback test fails (block, freeze, error, micro bug), never stop at diagnostics.
- Apply a fix immediately, then rerun the same test conditions.
- Keep iterating fix + retest until all mandatory checks are green.
