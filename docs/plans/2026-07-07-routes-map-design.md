# Club routes map — design

**Status:** design, awaiting approval
**Date:** 2026-07-07
**Slug:** routes-map

A map of the club's rides at `routes.sitwell.cc`, with each route plotted as a
coloured line, a RAG (red/amber/green) + off-road colour filter, and a detail
panel giving each route's name, distance, café stop, and a GPX download.

## Decisions (locked with the requester)

| Decision | Choice | Rationale |
|---|---|---|
| Route data store | **Sanity** (source of truth) | Matches the "content lives in Sanity" principle; committee edits without a deploy. |
| CSV | **Bulk import/export tool, Sanity authoritative** — Phase 2 | Convenience for spreadsheet/offline editing; not built in v1 (see Phase 2). |
| Route geometry | **Uploaded `.gpx` file per route** | Simplest reliable input (what people export from Strava/Komoot); serves as both the map line and a guaranteed-valid download. |
| Map library | **Google Maps JavaScript API** | Visual consistency with the existing embed on `/contact`. Needs a referrer-restricted browser key + billing enabled. |
| Colour filter | **Multi-select toggles, all on by default** | Lets users compare categories; doubles as the legend. |
| Route display | **All selected routes drawn at once** | Overview-first; click one to focus. |
| Detail location | **Side panel** (grouped with the filter) | More room than a popup; better on mobile. |
| GPX download | **Single "Download GPX" button** | GPX imports into Garmin/Wahoo/Strava/Komoot; per-service buttons are YAGNI. |
| Placement | **`routes.sitwell.cc`, same repo** | Served via Vercel subdomain + rewrite → `/routes`. Reuses Sanity/Tailwind/colours; not in the main nav. Like `brand.astro`. |
| Rendering | **Static (build-time Sanity fetch)** | Route data changes rarely and isn't request-time-sensitive; contrast `/rides` (SSR, live feeds). |

## Layout

Filter and detail share one panel/column. The map's visual position moves between
breakpoints; DOM/reading order stays filter → detail → map so tab-order and
screen-reader flow are sane. Implement the reordering with **CSS grid areas**, not
`order:` hacks.

**Desktop (wide):** left column = filter (top) + detail (below); right column = map.

```
┌──────────────────┬──────────────────────────┐
│  RAG colour key  │                          │
│  [x] Green ...   │        Google Map         │
│  ───────────     │   (coloured route lines)  │
│  Route detail    │                          │
└──────────────────┴──────────────────────────┘
```

**Mobile (small):** filter, then map, then detail — stacked.

```
┌──────────────────────────┐
│  RAG colour key          │
├──────────────────────────┤
│        Google Map         │
├──────────────────────────┤
│  Route detail             │
└──────────────────────────┘
```

## Phase 1 — the map (build first)

### Data model — new Sanity `route` document type

Lives in the **separate Sanity Studio project**, not this repo. Spec:

| Field | Type | Notes |
|---|---|---|
| `name` | string | e.g. "Cadeby Loop" |
| `colour` | string (enum: `green` / `amber` / `red` / `brown`) | reuses `RideColor` |
| `distance` | number | miles |
| `cafeStop` | string | e.g. "Cusworth Hall" |
| `gpxFile` | file asset | the uploaded `.gpx`; used for both the map line and the download |

### Build-time pipeline

`src/pages/routes.astro` (static) calls `getRoutes()` from a new `src/lib/routes.ts`:

1. GROQ-fetch published `route` docs from Sanity (mirrors `src/lib/rides.ts`).
2. For each, fetch the `gpxFile` asset URL, fetch the GPX text, parse the XML to
   an array of `{ lat, lng }` points (small parser; GPX is simple XML).
3. Pass to the client: `{ name, colour, distance, cafeStop, gpxUrl, coords }[]`.
   `gpxUrl` is the untouched Sanity file URL (the download); `coords` draws the line.

### Map island — `src/components/RoutesMap.tsx`

- Loaded `client:only="react"` (Google Maps needs the DOM; nothing to SSR).
- Loads the Maps script via `@googlemaps/js-api-loader`.
- API key from a `PUBLIC_GOOGLE_MAPS_API_KEY` env var; **referrer-restricted** to
  `*.sitwell.cc` in Google Cloud (the key ships to the browser, so the restriction
  is what protects it).
- Each route → a `google.maps.Polyline`, `strokeColor` from the brand hex
  (Green `#109A49`, Amber `#EF9014`, Red `#D61E1E`, Brown `#A15433`).
- On load, `fitBounds` to all visible routes.
- Base map: standard roadmap tiles (matches the `/contact` embed).

### Interaction

- **Filter:** multi-select coloured-chip toggles, all on by default. State is
  `useState<Set<RideColor>>`. Toggling off removes those polylines and refits
  bounds. The key is also the legend.
- **Select a route** (click a polyline): highlight it (thicker stroke, others
  dimmed), populate the detail panel, pan/zoom to its bounds. Clicking empty map
  space or a "clear" affordance deselects.
- **Detail panel:** name, colour + distance, café stop, and a
  `<a href={gpxUrl} download>` "Download GPX" button (plain anchor, no JS, serves
  the untouched original file). Before any selection: "Click a route to see details".

### Failure modes (all graceful — matches the "degrade without keys" principle)

- **No Maps API key:** render filter + a "Map unavailable" notice, still list routes
  with their GPX download links.
- **GPX parse failure on one route:** skip plotting that line, log a build warning,
  still surface the route in the panel with its download link.
- **Zero routes in Sanity:** map centred on the Whiston start, "No routes published yet".
- **Maps script fails to load:** caught, same "Map unavailable" fallback.

### Files (Phase 1)

| File | Change |
|---|---|
| `src/lib/routes.ts` | **new** — `Route` type, `getRoutes()` GROQ fetch, GPX→coords parser |
| `src/pages/routes.astro` | **new** — fetches routes, renders `Layout` + island |
| `src/components/RoutesMap.tsx` | **new** — the map island (filter, polylines, panel) |
| Sanity Studio (separate repo) | **new** `route` document type (spec above) |
| Vercel dashboard | `routes.sitwell.cc` domain + rewrite → `/routes`; `PUBLIC_GOOGLE_MAPS_API_KEY` |
| `package.json` | add `@googlemaps/js-api-loader` |

### Verification

- `npm run astro check` passes (strict TS, no `any`).
- Manual smoke test: routes plot in the right colours, filter toggles work,
  clicking a route fills the panel and the GPX downloads and imports into a device app.
- (No test suite exists in the repo — consistent with current practice.)

## Phase 2 — CSV import/export (documented, built after Phase 1)

Sanity stays the source of truth; the CSV is a bulk convenience.

- **Export (easy):** dump all `route` docs to a CSV (name, colour, distance, café).
  A script or Studio action. Geometry (the GPX) is *not* representable in a CSV cell,
  so export covers metadata only.
- **Import (harder):** the open problem is that a route is metadata **plus a GPX
  file**, and a CSV can't carry the line. An import therefore needs the GPX files
  supplied alongside the CSV — e.g. a zip of `.gpx` files matched to CSV rows by a
  `gpx_filename` column — then upserted into Sanity (create/update doc + upload
  asset). This is why import is deferred: it's real work, orthogonal to the map, and
  better designed once we know the real volume of routes.

Decide export-only vs. full import at the start of Phase 2.

## Out of scope (v1)

Per-service GPX buttons (Send to Garmin/Strava), elevation profiles, turn-by-turn,
route search/sort. Revisit if asked.
