# Zenix Project Memory

Last update: 2026-03-08

## Core product constraints
- Domain: `https://zenix.best`
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
- Added iOS-specific resilience:
  - if native HLS manifest playback fails, fallback to direct TS segment chain playback.
  - this is intended to avoid instant playback block in iPhone/WebKit edge cases.
  - source ordering for movies is now stricter at runtime: `VF`, then `MULTI`, then `VOSTFR`.
  - when audio tracks are exposed, player attempts to force French track.
- Owned source providers supported in backend:
  - `cloudflare_stream` (`customer_code` + `uid`)
  - `bunny_stream` (`pull_zone_url` + `video_id`)
  - Intended for legal/self-hosted VF streams.

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
