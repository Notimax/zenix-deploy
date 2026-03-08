ZENIX STREAM - OPERATIONS MEMORY
Last updated: 2026-03-08

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
  - non-playable embed/gate URLs are filtered before entering the player pool (Notarielles/Rendezvous page wrappers, ad/gate hosts, store links).
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

PIDOOV INTEGRATION (GLOBAL FALLBACK)
- New backend endpoint: `/api/pidoov-source`
- Purpose: title/year matching + extraction of pidoov player iframe URLs as extra fallback sources.
- Includes static fallback file: `pidoov-static-sources.json` (used when runtime crawl is blocked upstream).
- Frontend now injects pidoov sources automatically in:
  - movie playback source pool
  - episode playback source pool
  - detail language compatibility sync
- Server-side cache controls:
  - `PIDOOV_INDEX_CACHE_MS`
  - `PIDOOV_LOOKUP_CACHE_MS`
  - `PIDOOV_DETAIL_CACHE_MS`
- `PIDOOV_BOOTSTRAP_PAGES_PER_CATEGORY`
- `PIDOOV_MAX_PAGES_PER_CATEGORY`
- `PIDOOV_FETCH_CONCURRENCY`
- `PIDOOV_MAX_MATCH_CANDIDATES`

NOTARIELLES INTEGRATION (SERIES FALLBACK)
- New backend endpoint: `/api/notarielles-source`
- Target: series episodes by `title + season + episode`.
- Index strategy:
  - reads `https://notarielles.fr/sitemaps.xml` when available
  - extracts episode URLs from seed pages (`/`, `/series-en-streaming/`, `series-VF`, `series-VOSTFR`)
  - probes extra category pages from sitemap for recent episode links
  - merges static fallback file `notarielles-static-sources.json` when live crawl is blocked
- Frontend injection:
  - `zenix.js` now appends Notarielles sources for TV (non-anime) episodes.
  - Merge order for episodes: Owned -> Notarielles -> Pidoov -> Anime Sibnet fallback.
- Page-level Notarielles fallbacks are disabled in backend source resolution to avoid `refused to connect` embeds.
- Server-side cache controls:
  - `NOTARIELLES_INDEX_CACHE_MS`
  - `NOTARIELLES_SEARCH_CACHE_MS`
  - `NOTARIELLES_PAGE_CACHE_MS`
  - `NOTARIELLES_MAX_SITEMAPS`
  - `NOTARIELLES_PAGE_PROBE_COUNT`
  - `NOTARIELLES_FETCH_CONCURRENCY`
  - `NOTARIELLES_MAX_MATCH_CANDIDATES`
  - `NOTARIELLES_STATIC_SOURCES_FILE`

RENDEZVOUS INTEGRATION (MOVIES + SERIES FALLBACK)
- New backend endpoint: `/api/rendezvous-source`
- Target: movies by `title + year` and episodes by `title + season + episode`.
- Index strategy:
  - reads `https://rendezvousmusical.fr/sitemaps.xml` when available
  - extracts stream entry URLs from seed pages (`/`, `/films-gratuit/`, `/telecharger-series/`, `/page/2/`)
  - probes sitemap pagination pages for fresh links
  - merges static fallback file `rendezvous-static-sources.json` when live crawl is blocked
- Frontend injection:
  - `zenix.js` appends Rendezvous sources as additional fallback for movies and TV non-anime.
  - Merge order for episodes: Owned -> Notarielles -> Pidoov -> Rendezvous -> Anime Sibnet fallback.
  - Merge order for movies: existing sources -> Pidoov -> Rendezvous fallback.
- Reader parsing now supports extended provider rows from source pages:
  - server aliases in player tabs (`younetu/netu`, `dood/doodstream`, `fembed`, `uqload`, `uptostream`, `vidoza`, `upvid`)
  - fallback text patterns like `Lien 1: netu ...`
  - external `a.php?b=...` links (Rakuten/Google/Primevideo) are parsed but kept lower priority than streaming hosts.
- Server-side cache controls:
  - `RENDEZVOUS_INDEX_CACHE_MS`
  - `RENDEZVOUS_SEARCH_CACHE_MS`
  - `RENDEZVOUS_PAGE_CACHE_MS`
  - `RENDEZVOUS_MAX_SITEMAPS`
  - `RENDEZVOUS_PAGE_PROBE_COUNT`
  - `RENDEZVOUS_FETCH_CONCURRENCY`
  - `RENDEZVOUS_MAX_MATCH_CANDIDATES`
  - `RENDEZVOUS_STATIC_SOURCES_FILE`

MULTI-PROVIDER CATALOG + CALENDAR FUSION
- New backend endpoint: `/api/catalog/supplemental`
  - exposes normalized catalog rows from owned external providers (currently Pidoov + Rendezvous).
  - page-compatible structure with `current_page`, `last_page`, `data`.
- Frontend catalog sync now merges:
  - Purstream catalog page + supplemental provider page
  - semantic dedupe (`title + type + year + season + episode`) to avoid duplicates across providers.
- Calendar overview now merges supplemental provider entries too:
  - `/api/calendar/overview` includes `data.supplemental` block and `providerStatus.supplemental`.
  - merged stream is now: Purstream + supplemental providers + Anime planning.
- Supplemental tuning keys:
  - `SUPPLEMENTAL_CATALOG_CACHE_MS`
  - `SUPPLEMENTAL_CATALOG_PAGE_SIZE`
  - `SUPPLEMENTAL_CALENDAR_LIMIT`
