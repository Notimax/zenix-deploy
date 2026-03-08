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
- Desktop playback resize-loop hardening:
  - nav-fit recalculation is deferred while player/detail overlays are open.
  - deferred nav-fit recalculation is flushed on overlay close.
  - CSS scrollbar gutter is kept stable to avoid width/scrollbar oscillation on laptop resolutions.
- Added iOS-specific resilience:
  - if native HLS manifest playback fails, fallback to direct TS segment chain playback.
  - this is intended to avoid instant playback block in iPhone/WebKit edge cases.
  - source ordering for movies is now stricter at runtime: `VF`, then `MULTI`, then `VOSTFR`.
  - when audio tracks are exposed, player attempts to force French track.
  - hard filter now removes known non-playable embed/gate URLs before playback (Notarielles/Rendezvous page wrappers, ad-gate hosts, store links).
  - for movies, direct media formats (`hls/mp4/webm/dash`) are prioritized and embeds are dropped when at least one direct source exists.
- Owned source providers supported in backend:
  - `cloudflare_stream` (`customer_code` + `uid`)
  - `bunny_stream` (`pull_zone_url` + `video_id`)
  - Intended for legal/self-hosted VF streams.
- Pidoov provider integration added (owner-confirmed):
  - Backend endpoint `/api/pidoov-source` resolves by title/year and extracts embed/player URLs.
  - Static fallback source index file: `pidoov-static-sources.json` for environments where live crawl is blocked.
  - Frontend injects pidoov sources automatically for movies and episodes (not only F1).
  - Matching logic favors strict title/year and FR-friendly labels to reduce wrong picks.
  - Caching/env tuning keys:
    - `PIDOOV_INDEX_CACHE_MS`
    - `PIDOOV_LOOKUP_CACHE_MS`
    - `PIDOOV_DETAIL_CACHE_MS`
    - `PIDOOV_BOOTSTRAP_PAGES_PER_CATEGORY`
    - `PIDOOV_MAX_PAGES_PER_CATEGORY`
    - `PIDOOV_FETCH_CONCURRENCY`
    - `PIDOOV_MAX_MATCH_CANDIDATES`
- Notarielles provider integration added (owner-confirmed):
  - Backend endpoint `/api/notarielles-source` resolves series episode sources by `title + season + episode`.
  - Backend index is resilient: uses sitemap when possible and also scrapes episode links from seed pages
    (`/`, `/series-en-streaming/`, `series-VF`, `series-VOSTFR`) plus extra category probes.
  - Static fallback file `notarielles-static-sources.json` is merged to keep results when live crawl is blocked upstream.
  - Frontend injects Notarielles sources for TV non-anime episodes before other fallback providers.
  - backend page-level embed fallback is disabled to avoid `notarielles.fr refused to connect` playback traps.
  - Caching/env tuning keys:
    - `NOTARIELLES_INDEX_CACHE_MS`
    - `NOTARIELLES_SEARCH_CACHE_MS`
    - `NOTARIELLES_PAGE_CACHE_MS`
    - `NOTARIELLES_MAX_SITEMAPS`
    - `NOTARIELLES_PAGE_PROBE_COUNT`
    - `NOTARIELLES_FETCH_CONCURRENCY`
    - `NOTARIELLES_MAX_MATCH_CANDIDATES`
    - `NOTARIELLES_STATIC_SOURCES_FILE`
- Rendezvous provider integration added (owner-confirmed):
  - Backend endpoint `/api/rendezvous-source` resolves movie/episode fallback sources by
    `title + year` (movie) and `title + season + episode` (tv).
  - Backend index is resilient: uses sitemap when possible and also scrapes stream links from seed pages
    (`/`, `/films-gratuit/`, `/telecharger-series/`, `/page/2/`) plus sitemap page probes.
  - Static fallback file `rendezvous-static-sources.json` is merged to keep results when live crawl is blocked upstream.
  - Frontend injects Rendezvous as additional fallback pool:
    - movies: appended after existing providers
    - TV non-anime episodes: after Notarielles/Pidoov, before anime sibnet fallback
  - Parser support expanded for Rendezvous player rows:
    - captures host aliases from tabs: `younetu/netu`, `dood/doodstream`, `fembed`, `uqload`, `uptostream`, `vidoza`, `upvid`
    - parses text-form host lists (`Lien 1: ...`) when present
    - parses outbound `a.php?b=...` entries (Rakuten/Google/Primevideo) as low-priority extras so core stream hosts stay preferred
  - Caching/env tuning keys:
    - `RENDEZVOUS_INDEX_CACHE_MS`
    - `RENDEZVOUS_SEARCH_CACHE_MS`
    - `RENDEZVOUS_PAGE_CACHE_MS`
    - `RENDEZVOUS_MAX_SITEMAPS`
    - `RENDEZVOUS_PAGE_PROBE_COUNT`
    - `RENDEZVOUS_FETCH_CONCURRENCY`
    - `RENDEZVOUS_MAX_MATCH_CANDIDATES`
    - `RENDEZVOUS_STATIC_SOURCES_FILE`
- Multi-provider catalog/calendar fusion added:
  - Backend endpoint `/api/catalog/supplemental` exposes normalized provider entries
    (currently Pidoov + Rendezvous) with pagination.
  - Frontend catalog sync merges Purstream + supplemental entries on each page.
  - Semantic dedupe now prevents duplicates across providers using
    `title + mediaType + year + season + episode`.
  - Calendar overview (`/api/calendar/overview`) now includes `supplemental` items and provider status.
  - Supplemental entries are integrated in merged calendar without perturbing existing anime/purstream flows.
  - Tuning keys:
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
