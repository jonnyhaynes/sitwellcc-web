# Focus a shared route link on the one route

**Status:** Approved — implementing
**Author:** Claude (AI-assisted), for Jonny Haynes
**Date:** 2026-09-25

## Goal

Change how a shared route link behaves, after using the shipped version:

1. Opening a normal `/routes` and clicking a route must **not** rewrite the
   address bar — browsing stays on the routes page.
2. Opening a shared link (`routes.sitwell.cc/<slug>`, or `/routes/<slug>`) should
   **focus on that one route**: only it is plotted, and the panel shows its
   detail. The colour filters and route list are dropped.
3. The page heading on a shared link is the **ride's name, in the ride's colour**,
   with the browse intro removed. The detail panel does **not** repeat the name.

## Why this changes a previous decision

`docs/plans/clearer-route-share-urls.md` (decision 3 / the URL-sync effect) kept
the address bar in step with the selected route via `history.replaceState`, so a
hand-copied URL matched the Share button. That is **reversed here**: selecting a
route no longer touches the URL. The Share button still mints the same
`/<slug>` link, so sharing is unaffected — only the incidental address-bar sync
goes. Flagged explicitly, as the workflow asks, because it was a load-bearing
decision in that plan.

## Decisions

1. **No URL sync on selection.** The `replaceState` effect is deleted. The Share
   button remains the one way to obtain a route link (`shareUrlFor`), so the
   canonical share URL is unchanged.
2. **A shared link is a distinct, focused view.** The island (which alone can see
   the URL) holds the resolved slug in state for the life of the page. While set,
   `visible` is just that route, the filters and list are not rendered, and the
   map's background-click-clear is disabled so the detail can't be dismissed.
   An unusable slug still falls back to the normal browse view.
3. **The page heading moves into the island.** The heading has to differ by view,
   and only the client can know the slug (the page is one static document served
   for every share link — the microsite rewrite means the server never sees it).
   `RoutesMap` now renders the heading: focused → the ride name in
   `ROUTE_HEX[color]`; otherwise the existing "Club routes" + intro. `astro-island`
   is `display: contents`, so the DOM around `<main>` is unchanged. This is the
   first time the routes page ships **no server-rendered heading**; accepted for
   a heading that must vary by URL, flagged under Risks.
4. **No duplicate title.** In the focused view the page heading already names the
   ride, so the detail panel's `<h2>` is suppressed. In the browse view it stays
   (it's the only title there).
5. **No Back button.** Considered and dropped — the header nav already provides a
   way off the page, so a bespoke control was redundant.

## Changes

### `src/components/RoutesMap.tsx`

- Add `sharedRouteId` (from `routeIdFromUrl` on mount); derive `sharedRoute` and
  `focused`. `selected`/`visible` respect focus mode; the map `onClick` is guarded.
- Delete the `replaceState` effect.
- Render the heading (section + `h1` [+ intro when browsing]) above the layout.
- Suppress the detail `<h2>` when focused.

### `src/pages/routes.astro`

- Drop the static heading section; the island owns it now.

### `src/styles/components/routes.css`

- Add `.routes-layout--focused`, which drops the `filter` and `list` rows for the
  focused view (mobile and the desktop two-column grid).

## Verification

- `npm test`, `npm run astro check`, `npm run build` green.
- Headless Chrome (CDP) against `npm run dev`, `?route=` form:
  - shared: h1 "Barlow" in `rgb(239,144,20)`; no intro; no filters; no list; no
    detail heading; URL untouched.
  - browse: h1 "Club routes" + intro; 4 filters; 57 list items; clicking a route
    keeps the URL and titles the detail.
- The map itself is not exercised locally (no `PUBLIC_GOOGLE_MAPS_API_KEY`, so the
  island shows the "Map unavailable" fallback). The single-route filter follows
  directly from `visible` and should be eyeballed on the PR preview.

## Risks / open items

- **No static heading on `/routes`.** The page's only server-rendered content was
  the heading + intro; both are now client-rendered. `/routes` (the canonical
  target) loses its H1 for crawlers and for no-JS. A server-rendered fallback is
  possible but the heading genuinely depends on the URL, so it would flash the
  wrong title on a share link. Left as-is, flagged.
- **Map filtering unverified locally** (see Verification) — check on the preview.

## Out of scope

- Per-route `<title>`/OG tags (unchanged; still the generic `/routes` card).
- The dashboard `www` redirect fix noted in `clearer-route-share-urls.md`.

## Rollout

1. Commit the plan (first commit on the branch), then the implementation.
2. `[ai-assisted]` PR referencing this doc; check the preview's map behaviour.
3. A human merges (auto-deploys to Vercel).
