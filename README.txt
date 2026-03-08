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
- "Pour toi" should avoid watched and liked items.
- Movie/series language priority for FR audience:
  VF > VOSTFR > MULTI > VO.
- External generic embed fallback sources were removed.

STREAMING/PLAYBACK NOTES
- Auto-switch source is active when playback is blocked.
- HLS proxy endpoint: /api/hls-proxy
- Some upstream providers return numeric-encoded playlists.
  Server now decodes numeric playlists more robustly before rewriting.

MOBILE DEBUG CHECKLIST
- Confirm startup splash hidden after load.
- Confirm no toast shown on mobile.
- Run 3 x 20s iPhone 13 WebKit playback checks on target content.
- If playback still fails, inspect source validity upstream and add FR-compatible backups.

RELEASE QUALITY GATE (MANDATORY)
- Before closing any streaming fix, run brute tests on BOTH desktop and phone:
  - Desktop: open detail + play + verify at least 20s continuous playback.
  - Phone simulation (iPhone 13 WebKit): run 3 tests of 20s each.
  - If any run fails, keep iterating and redeploy until stable.

KEY FILES
- zenix.js (frontend logic/player/notifications)
- zenix.css (layout/toast/splash styles)
- server.js (API proxy + HLS proxy)
- PROJECT_MEMORY.md (extended working memory)
