# Route elevation + GPX-computed distance (with Sanity overrides) + units toggle

**Status:** Proposed — awaiting review
**Author:** Claude (AI-assisted), for Jonny Haynes
**Date:** 2026-07-08

## Goal

Show total elevation gain for each club route on routes.sitwell.cc, derive
distance and elevation from the GPX by default, let an editor override those in
Sanity, give members a metric/imperial toggle, and serve the GPX download under
a tidy filename.

## Decisions (agreed with Jonny)

1. **GPX is the default source; Sanity overrides win.** GPX track points carry
   `<ele>` (metres); we already fetch and parse every GPX in `getRoutes()`, so we
   compute distance (haversine) and total ascent from the coords. If the editor
   has set the optional `distance` / `elevation` fields in Sanity, those take
   precedence: `display = sanityValue ?? gpxComputedValue`.
2. **Units toggle.** A control switches distance mi↔km and elevation m↔ft,
   persisted in `localStorage`. Default: **miles + feet**.
3. **Tidy download filename.** The download link requests
   `sitwell-<slug>.gpx` derived from the route name.
   **Caveat:** the HTML `download` attribute's *filename* is only honoured for
   same-origin URLs. Sanity assets are served cross-origin from
   `cdn.sanity.io`, so browsers will ignore the requested name and use the
   asset's own filename. Fully fixing this is a **Studio-side** job (set the
   asset `originalFilename` at upload). We keep `download={downloadName}` here
   anyway: it still forces a download over navigation, documents intent, and
   becomes effective if assets ever move same-origin.

## Split of work (site vs Studio)

This ticket is the **site** half. The **Studio** half (separate repo) is a
follow-up:

- On GPX upload, auto-populate the document's title, distance and elevation from
  the parsed GPX (custom input / document action).
- Set the asset `originalFilename` so the cross-origin download name is tidy.

Site-first is the intended merge order.

## Non-goals

- No elevation *profile* chart — a single total-ascent number only.
- No Studio changes in this ticket.

## Changes (site)

### `src/lib/routes.ts`

- `LatLng` gains optional `ele?: number`.
- `parseGpx` also reads the `<ele>` child of each `<trkpt>`/`<rtept>`
  (namespace- and self-closing-tolerant). Points without `<ele>` omit it.
- `haversineMeters` (private), `routeDistanceMeters(coords)`,
  `elevationGainMeters(coords)` — the latter sums positive deltas above a **3 m
  noise threshold** and returns `null` when fewer than two points carry `ele`.
- `gpxDownloadName(name)` — filename-safe `sitwell-<slug>.gpx`.
- `Route`: `distance` removed; adds `distanceMeters`, `elevationGain`
  (metres | null), `downloadName`.
- `RawRoute` / GROQ: re-add optional `distance` (miles) and `elevation`
  (metres) as editor overrides. `getRoutes` resolves
  `distanceMeters = override(mi→m) ?? haversine(coords)` and
  `elevationGain = override ?? gpxGain`, and sets `downloadName`.

### `src/lib/units.ts` (new)

Pure helpers: `metersToMiles/Km/Feet`, `formatDistance`, `formatElevation`
(null → em dash), `DistanceUnit`/`ElevationUnit` types.

### `src/components/RoutesMap.tsx`

- `distanceUnit` / `elevationUnit` state, initialised from and persisted to
  `localStorage` (SSR-guarded).
- Segmented units toggle in the panel (flat bordered idiom, hard offset shadow).
- List meta + detail use the formatters; elevation line hidden when null.
- Download link uses `download={downloadName}`.

### `src/styles/components/routes.css`

`units` grid area (mobile + desktop) and `.routes-unit-*` segmented-control
styles.

### `src/lib/__fixtures__/sample.gpx`

`<ele>` on all three points for the distance/elevation tests.

### Tests

- `routes.test.ts`: `parseGpx` asserts `ele` + self-closing;
  `routeDistanceMeters`, `elevationGainMeters` (threshold / null / flat);
  `gpxDownloadName`; `getRoutes` covers override-wins and GPX-fallback for both
  distance and elevation, plus `downloadName`.
- `units.test.ts` (new): conversions + formatters.

## Verification

- `npm test` green · `npm run astro check` clean · `npm run build` prerenders
  `/routes` against live Sanity+GPX.
- Manual: distances/elevation look right, override beats GPX where set, toggle
  flips both units and survives reload, broken-GPX route still lists.

## Risks / call-outs

- **Cross-origin download name** won't take effect until the Studio sets
  `originalFilename` (see decision 3).
- **`distance`/`elevation` must exist as Studio fields** for overrides to be
  authored; until then they're simply absent and the GPX values are used. The
  GROQ projection tolerates their absence (`null`).
