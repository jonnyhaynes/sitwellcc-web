# Switch all site maps from Google Maps to OpenStreetMap

## Why

Google Maps is a paid, key-gated dependency — `PUBLIC_GOOGLE_MAPS_API_KEY` must be
issued, referrer-restricted and billed in Google Cloud, and the key ships to the
browser. Every map on the site can be rendered with OpenStreetMap (OSM) instead: free,
keyless, and no third-party script or billing account to manage.

> **This reverses a decision** recorded in `docs/plans/2026-07-07-routes-map-design.md`
> (line 18: map library = "Google Maps JavaScript API … Needs a referrer-restricted
> browser key + billing enabled"). That doc stays as the historical record.

## Scope

Two map surfaces, both moved to OSM:

1. **`/routes`** — the interactive React island (`RoutesMap.tsx`) plotting GPX polylines.
   Rebuilt on **Leaflet**.
2. **`/contact`** — two static location embeds (club ride meet point + Go-Ride coaching
   meet point). Swapped to the keyless **OSM embed iframe**.

## Approach

- **Routes map → plain `leaflet`** (not `react-leaflet`). One runtime dependency, no
  wrapper peer-dep matrix, and the island already did imperative map work (the old
  `FitBounds`), so imperative Leaflet fits the existing shape.
- **Contact page → OSM `export/embed.html` iframe.** Keeps the page a plain static
  `.astro` with no new JS — a Leaflet island would be overkill for one fixed marker.
- **Kept `client:only="react"`** on the routes island: Leaflet touches `window`, so it
  must not run during SSR.
- **Tiles** from `tile.openstreetmap.org`, with the OSM attribution Leaflet renders from
  the tile-layer option (required by OSM's tile usage policy).

## Changes

| Area | Change |
| --- | --- |
| `package.json` | Add `leaflet` (dep) + `@types/leaflet` (dev). Remove `@vis.gl/react-google-maps` + `@types/google.maps` (and their transitive `@googlemaps/js-api-loader`). |
| `src/components/RoutesMap.tsx` | Drop the google import/types and the `apiKey` prop + "Map unavailable" fallback. Map internals rebuilt on Leaflet: create-once map + OSM tile layer, a polyline layer group redrawn on `visible`/`selectedId`, background-click clears selection, and `invalidateSize()` + `fitBounds()` on the visible set. Panel logic (filters, units, list, detail, Share, focused shared-link view) is unchanged. |
| `src/pages/routes.astro` | Remove the `PUBLIC_GOOGLE_MAPS_API_KEY` read and the `apiKey` prop. |
| `src/styles/components/routes.css` | Replace the google `.gm-style` height rule with `.routes-map-canvas { height:100%; width:100% }`; drop the now-unused `.routes-map-fallback` rules. |
| `src/pages/contact.astro` | Replace both `google.com/maps/embed` iframes with OSM `export/embed.html` embeds (same lat/lng as before), adding a `title` to each and dropping `allowfullscreen`. |
| `src/env.d.ts` | Remove `PUBLIC_GOOGLE_MAPS_API_KEY`. |

### Implementation notes

- **Polyline click must not bubble.** Leaflet vectors bubble mouse events to the map by
  default, so a line click would select the route *and* hit the map's background-click
  handler, clearing it again. Lines are created with `bubblingMouseEvents: false`.
- **Grid sizing.** Leaflet measures its container, which in the routes grid can size
  after first paint — so the fit effect calls `invalidateSize()` before `fitBounds()`,
  inside a `requestAnimationFrame` (the Leaflet equivalent of the old "fit again once
  idle" trick).
- **No default-marker pitfall.** The routes map draws polylines only and `/contact` uses
  iframe embeds, so Leaflet's classic "broken default icon under bundlers" problem never
  arises.

## Known caveats

- **The `/contact` embeds require WebGL.** `openstreetmap.org/export/embed.html` now
  renders with a WebGL (vector) map and shows "your browser does not support WebGL"
  where WebGL is unavailable. Verified working in Chrome/Chromium with WebGL enabled;
  WebGL is present on effectively all browsers from the last decade. The Google embed
  it replaces did not need WebGL, so this is the one behavioural difference to be aware
  of. If a no-WebGL fallback is ever wanted, the meet points can use a small Leaflet
  map instead (Leaflet's raster tiles need no WebGL) — the dependency is already in the
  tree for the routes map.
- **OSM tile usage policy.** `tile.openstreetmap.org` is a shared, best-effort service;
  fine for a low-traffic club site, with a self-hosted/CDN tile source as the escape
  hatch if traffic ever grows. Attribution (rendered by Leaflet from the tile-layer
  option) must stay visible.

## Out of scope

- **Google Analytics** (gtag) is unrelated and stays.
- Route data layer (`src/lib/routes.ts`, GPX parsing, `routes.test.ts`) is untouched;
  `coords: LatLng[]` is just mapped to Leaflet `[lat, lng]` tuples.

## Rollout

- Remove `PUBLIC_GOOGLE_MAPS_API_KEY` from the Vercel project (Production + Preview).
- The unneeded key/restriction in Google Cloud can be deleted.
- `vercel.json` needs no change (no CSP or header references Google Maps).

## Verification

- `npm run astro check`, `npm test`, `npm run build` all green.
- `/routes` in the browser: OSM tiles render, polylines draw, colour filters toggle,
  clicking a line selects it (thicker, others dimmed), background click clears the
  selection, the map fits the visible routes, and the wheel scrolls the page.
- `/routes/<slug>`: single route plotted, heading in the ride colour, background click
  does not clear it.
- `/contact`: both meet-point embeds render with tiles and a marker.
