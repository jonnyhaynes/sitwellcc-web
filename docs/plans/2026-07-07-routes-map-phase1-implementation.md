# Club Routes Map — Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship an interactive map of club rides at `routes.sitwell.cc` — routes plotted as coloured lines from Sanity-hosted GPX files, a RAG/off-road colour filter, and a click-to-detail side panel with a GPX download.

**Architecture:** A new static Astro page (`src/pages/routes.astro`) fetches `route` documents from Sanity at build time, dereferences each uploaded `.gpx` file to its URL, fetches and parses the GPX to coordinate arrays, and passes them to a single React island (`RoutesMap.tsx`). The island renders a Google Map via `@vis.gl/react-google-maps`, drawing one `<Polyline>` per route, and owns all interactivity (filter state, selection, side panel). Served at the subdomain via a Vercel rewrite; stays in this repo, reusing `Layout`, Tailwind, and `RideColor`.

**Tech Stack:** Astro 7 (static), React 19, TypeScript (strict), `@vis.gl/react-google-maps`, `@sanity/client` (existing), Tailwind v4. Google Maps JS API key via `PUBLIC_GOOGLE_MAPS_API_KEY`, referrer-restricted to `*.sitwell.cc`.

**Design doc:** `docs/plans/2026-07-07-routes-map-design.md`

---

## Repo conventions this plan follows

- **This plan introduces the repo's first test runner (Vitest).** The repo had no
  tests; per the requester's decision, Phase 1 adds Vitest and real unit tests for
  the pure logic (GPX parser, `getRoutes` fetch/error handling). This is a
  deliberate, approved addition — update CLAUDE.md's "no test suite" note as part of
  Task 0. Verification gates are now **`npm test` (Vitest) + `npm run astro check`**,
  plus a manual smoke test where the UI is involved.
- **What gets unit-tested vs. smoke-tested.** Pure, deterministic logic
  (`parseGpx`, `getRoutes`) is unit-tested with mocked `fetch`. The map island and
  page are verified by `astro check` + manual smoke test — DOM/Google-Maps rendering
  isn't worth the mocking cost for a single island (YAGNI). If a component test is
  wanted later, add `@testing-library/react` then; not now.
- **TDD for the testable logic:** write the failing test first, watch it fail,
  implement, watch it pass. Tasks 1 is written in that order below.
- **Strict TypeScript, no `any`.** Every fetch, parser, and prop is explicitly typed.
- **Static by default.** This page prerenders; do not add `export const prerender = false`.
- **Reuse, don't duplicate.** `RideColor` and colour hexes come from existing code.
- **Commit frequently**, one logical step per commit, keeping the `Co-Authored-By`
  trailer. Work on the `design/routes-map` branch (already created) or a fresh
  `feat/routes-map` branch off `main`.

---

## Task 0: Branch, dependencies, and test setup

**Files:**
- Modify: `package.json` (add deps + scripts)
- Create: `vitest.config.ts`
- Modify: `tsconfig.json` (add Vitest global types)
- Modify: `CLAUDE.md` (remove the "no test suite" note)

**Step 1: Ensure a clean feature branch**

The design doc is already committed on `design/routes-map`. Continue on it, or create
`feat/routes-map` off `main`. Confirm `git status` is clean before starting.

**Step 2: Add the map library and Vitest**

Run: `npm install @vis.gl/react-google-maps`
Run: `npm install -D vitest`

Expected: `@vis.gl/react-google-maps` under `dependencies`, `vitest` under
`devDependencies`; `package-lock.json` updates.

**Step 3: Add the test script**

In `package.json` `scripts`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Configure Vitest against Astro's Vite config**

Vitest is Vite-native; use Astro's helper so config (aliases, plugins) matches the app.

Create `vitest.config.ts`:

```ts
/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    globals: true,
    environment: 'node', // pure-logic tests need no DOM
    include: ['src/**/*.test.ts'],
  },
});
```

Add Vitest globals to `tsconfig.json` `compilerOptions`:

```json
"types": ["vitest/globals"]
```

> Confirm `getViteConfig` + `test` field usage against current Astro + Vitest docs
> during execution (Astro documents Vitest as its recommended unit-test setup); the
> import path or config shape may have shifted.

**Step 5: Sanity-check the runner with a trivial test**

Create `src/lib/_smoke.test.ts` with `test('runner works', () => expect(1).toBe(1))`.

Run: `npm test`
Expected: 1 passing test. Then **delete** `src/lib/_smoke.test.ts` — it was only to
prove the runner is wired up.

**Step 6: Update CLAUDE.md**

Change the stack note "There is no test suite or linter configured yet." to reflect
that Vitest now runs the unit tests (`npm test`), and that pure logic is unit-tested
while UI is verified via `astro check` + manual smoke test.

**Step 7: Verify type-check still passes**

Run: `npm run astro check`
Expected: 0 errors.

**Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tsconfig.json CLAUDE.md
git commit -m "Add Vitest and @vis.gl/react-google-maps; wire up the test runner"
```

---

## Task 1: Route type + GPX parser + fetch (`src/lib/routes.ts`), test-driven

The parser and `getRoutes` are the pure, testable logic. Write tests first.

**Files:**
- Create: `src/lib/routes.ts`
- Create: `src/lib/routes.test.ts`
- Create: `src/lib/__fixtures__/sample.gpx` (a small real-shaped GPX)

**Step 1: Write the failing tests for `parseGpx`**

Create the fixture `src/lib/__fixtures__/sample.gpx` — a minimal but real-shaped GPX
with a track of three South-Yorkshire points:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="test">
  <trk><name>Sample</name><trkseg>
    <trkpt lat="53.4053" lon="-1.3273"><ele>80</ele></trkpt>
    <trkpt lat="53.4102" lon="-1.3400"></trkpt>
    <trkpt lat="53.4210" lon="-1.3550"></trkpt>
  </trkseg></trk>
</gpx>
```

Create `src/lib/routes.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseGpx } from './routes';

const fixture = readFileSync(
  fileURLToPath(new URL('./__fixtures__/sample.gpx', import.meta.url)),
  'utf8',
);

describe('parseGpx', () => {
  it('extracts every track point in document order', () => {
    const coords = parseGpx(fixture);
    expect(coords).toHaveLength(3);
    expect(coords[0]).toEqual({ lat: 53.4053, lng: -1.3273 });
    expect(coords.at(-1)).toEqual({ lat: 53.421, lng: -1.355 });
  });

  it('returns [] when there are no points', () => {
    expect(parseGpx('<gpx></gpx>')).toEqual([]);
  });

  it('parses route points (<rtept>) as well as track points', () => {
    const rte = '<gpx><rte><rtept lat="53.4" lon="-1.3"></rtept></rte></gpx>';
    expect(parseGpx(rte)).toEqual([{ lat: 53.4, lng: -1.3 }]);
  });
});
```

**Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `parseGpx` is not exported yet (module/function not found).

**Step 3: Define the types and the coordinate type**

```ts
import type { RideColor } from './rides';

// Routes only use the four ride categories that have plotted routes.
export type RouteColor = Extract<RideColor, 'green' | 'amber' | 'red' | 'brown'>;

export interface LatLng {
  lat: number;
  lng: number;
}

// A route ready for the client: metadata + the parsed line + the raw file URL.
export interface Route {
  id: string;
  name: string;
  color: RouteColor;
  distance: number; // miles
  cafeStop: string;
  gpxUrl: string; // untouched Sanity file URL — the download
  coords: LatLng[]; // parsed from the GPX — the map line
}

// Brand hexes per route colour (mirrors src/pages/brand.astro's palette).
export const ROUTE_HEX: Record<RouteColor, string> = {
  green: '#109A49',
  amber: '#EF9014',
  red: '#D61E1E',
  brown: '#A15433',
};
```

**Step 4: Write the GPX parser**

GPX is XML with `<trkpt lat="…" lon="…">` (track points) and/or `<rtept …>` (route
points). Parse both, in document order. No DOM in a build/Node context, so use a
regex over the raw text — robust enough for well-formed exported GPX and avoids an
XML-parser dependency.

```ts
// Parse GPX text to an ordered list of coordinates. Reads <trkpt>/<rtept>
// lat/lon attributes. Returns [] if none found (caller decides what to do).
export function parseGpx(gpx: string): LatLng[] {
  const pointRe = /<(?:trkpt|rtept)\b[^>]*\blat="(-?\d+(?:\.\d+)?)"[^>]*\blon="(-?\d+(?:\.\d+)?)"/gi;
  const coords: LatLng[] = [];
  let m: RegExpExecArray | null;
  while ((m = pointRe.exec(gpx)) !== null) {
    coords.push({ lat: Number(m[1]), lng: Number(m[2]) });
  }
  return coords;
}
```

> Note: attribute order in GPX is conventionally `lat` before `lon`. If any real
> club file emits `lon` first, widen the regex to try both orders. Verify against a
> real exported file in Step 8.

**Step 5: Run the parser tests — verify they pass**

Run: `npm test`
Expected: the three `parseGpx` tests PASS.

**Step 6: Write the failing tests for `getRoutes`**

Append to `src/lib/routes.test.ts`. Mock the Sanity client and global `fetch` so the
test is deterministic and offline.

```ts
import { vi, beforeEach, afterEach } from 'vitest';
import { getRoutes } from './routes';

// Mock the Sanity client module — getRoutes imports { client } from './sanity'.
vi.mock('./sanity', () => ({
  client: { fetch: vi.fn() },
}));
import { client } from './sanity';

const gpx =
  '<gpx><trk><trkseg><trkpt lat="53.4" lon="-1.3"></trkpt><trkpt lat="53.5" lon="-1.4"></trkpt></trkseg></trk></gpx>';

beforeEach(() => {
  vi.mocked(client.fetch).mockReset();
  vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => vi.unstubAllGlobals());

describe('getRoutes', () => {
  it('maps Sanity docs to Route[] with parsed coords', async () => {
    vi.mocked(client.fetch).mockResolvedValue([
      { _id: 'r1', name: 'Cadeby Loop', color: 'green', distance: 34, cafeStop: 'Cusworth', gpxUrl: 'https://cdn/x.gpx' },
    ]);
    vi.mocked(fetch).mockResolvedValue(
      new Response(gpx, { status: 200 }),
    );

    const routes = await getRoutes();
    expect(routes).toHaveLength(1);
    expect(routes[0]).toMatchObject({ id: 'r1', name: 'Cadeby Loop', color: 'green', distance: 34, gpxUrl: 'https://cdn/x.gpx' });
    expect(routes[0].coords).toHaveLength(2);
  });

  it('still lists a route whose GPX fetch fails, with empty coords', async () => {
    vi.mocked(client.fetch).mockResolvedValue([
      { _id: 'r2', name: 'Broken', color: 'red', distance: 50, cafeStop: '', gpxUrl: 'https://cdn/bad.gpx' },
    ]);
    vi.mocked(fetch).mockResolvedValue(new Response('', { status: 500 }));

    const routes = await getRoutes();
    expect(routes).toHaveLength(1);
    expect(routes[0].coords).toEqual([]);
  });

  it('drops docs with no gpxUrl', async () => {
    vi.mocked(client.fetch).mockResolvedValue([
      { _id: 'r3', name: 'No file', color: 'amber', distance: 20, cafeStop: '', gpxUrl: null },
    ]);
    const routes = await getRoutes();
    expect(routes).toEqual([]);
  });
});
```

**Step 7: Run — verify the `getRoutes` tests fail**

Run: `npm test`
Expected: FAIL — `getRoutes` not exported yet.

**Step 8: Write the Sanity fetch (`getRoutes`)**

```ts
import { client } from './sanity';

interface RawRoute {
  _id: string;
  name: string;
  color: RouteColor;
  distance: number;
  cafeStop: string;
  gpxUrl: string | null;
}

export async function getRoutes(): Promise<Route[]> {
  const query = `*[_type == "route" && defined(gpxFile.asset)]{
    _id,
    name,
    "color": colour,
    distance,
    cafeStop,
    "gpxUrl": gpxFile.asset->url
  } | order(name asc)`;

  const raw = await client.fetch<RawRoute[]>(query);

  const routes = await Promise.all(
    raw.map(async (r): Promise<Route | null> => {
      if (!r.gpxUrl) return null;
      try {
        const res = await fetch(r.gpxUrl);
        if (!res.ok) throw new Error(`GPX fetch ${res.status}`);
        const coords = parseGpx(await res.text());
        if (coords.length === 0) {
          console.warn(`Route "${r.name}" (${r._id}): GPX had no points; still listed, not plotted.`);
        }
        return {
          id: r._id,
          name: r.name,
          color: r.color,
          distance: r.distance,
          cafeStop: r.cafeStop,
          gpxUrl: r.gpxUrl,
          coords,
        };
      } catch (err) {
        console.warn(`Route "${r.name}" (${r._id}): GPX parse/fetch failed; still listed, not plotted.`, err);
        return { id: r._id, name: r.name, color: r.color, distance: r.distance, cafeStop: r.cafeStop, gpxUrl: r.gpxUrl, coords: [] };
      }
    }),
  );

  return routes.filter((r): r is Route => r !== null);
}
```

**Step 9: Run the full test suite — verify all pass**

Run: `npm test`
Expected: all `parseGpx` and `getRoutes` tests PASS.

**Step 10: Sanity-check the parser against a real exported file**

The fixtures are synthetic; before depending on the regex, run it against one **real**
club `.gpx` (ask the requester, or export any route from Strava/Komoot). Drop it in
`src/lib/__fixtures__/` temporarily and add a one-off assertion, or check it in the
Vitest watch REPL:

```ts
it.skip('real file sanity check', () => {
  const real = readFileSync(fileURLToPath(new URL('./__fixtures__/real.gpx', import.meta.url)), 'utf8');
  const c = parseGpx(real);
  expect(c.length).toBeGreaterThan(10);
  expect(c[0].lat).toBeCloseTo(53, 0); // South Yorkshire
});
```

If the real file yields zero points, widen the regex per the Step 4 note (attribute
order), then re-run. Remove the real file / `.skip` test before committing unless
the requester is happy to check a sample route into the repo.

**Step 11: Type-check**

Run: `npm run astro check`
Expected: 0 errors.

**Step 12: Commit**

```bash
git add src/lib/routes.ts src/lib/routes.test.ts src/lib/__fixtures__/sample.gpx
git commit -m "Add route types, tested GPX parser, and Sanity getRoutes fetch"
```

---

## Task 2: The map island (`src/components/RoutesMap.tsx`)

The island owns filter state, polylines, selection, and the panel. Built with
`@vis.gl/react-google-maps` (`APIProvider` / `Map` / `Polyline`).

**Files:**
- Create: `src/components/RoutesMap.tsx`

**Step 1: Props and skeleton**

```tsx
import { useMemo, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import type { Route, RouteColor } from '../lib/routes';
import { ROUTE_HEX } from '../lib/routes';

interface Props {
  routes: Route[];
  apiKey: string | undefined;
}

const ALL_COLORS: RouteColor[] = ['green', 'amber', 'red', 'brown'];
const COLOR_LABEL: Record<RouteColor, string> = {
  green: 'Green', amber: 'Amber', red: 'Red', brown: 'Off-road',
};

// Club start (Brookside Pharmacy, Whiston) — fallback centre when no routes plot.
const WHISTON = { lat: 53.405298, lng: -1.327339 };
```

**Step 2: The `RoutePolyline` child component**

`@vis.gl/react-google-maps` does not ship a `<Polyline>` in every version; the
verified pattern uses a thin wrapper over `google.maps.Polyline` via `useMap`. Write
it as a child so it can register/unregister cleanly.

```tsx
import { useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

function RoutePolyline({
  route, selected, dimmed, onSelect,
}: {
  route: Route;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string) => void;
}) {
  const map = useMap();
  useEffect(() => {
    if (!map || route.coords.length === 0) return;
    const line = new google.maps.Polyline({
      path: route.coords,
      strokeColor: ROUTE_HEX[route.color],
      strokeWeight: selected ? 6 : 3,
      strokeOpacity: dimmed ? 0.3 : 1,
      map,
      zIndex: selected ? 10 : 1,
    });
    const click = line.addListener('click', () => onSelect(route.id));
    return () => {
      click.remove();
      line.setMap(null);
    };
  }, [map, route, selected, dimmed, onSelect]);
  return null;
}
```

> During execution, confirm the installed version's public API against the context7
> docs for `/visgl/react-google-maps`. If it exports a ready `<Polyline>` with
> `path`/`strokeColor`/`onClick` props (the docs show this), prefer that and delete
> the manual wrapper. Either way the props above are the contract.

**Step 3: Fit bounds to visible routes**

```tsx
function FitBounds({ routes }: { routes: Route[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const plottable = routes.filter((r) => r.coords.length > 0);
    if (plottable.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    plottable.forEach((r) => r.coords.forEach((c) => bounds.extend(c)));
    map.fitBounds(bounds, 32);
  }, [map, routes]);
  return null;
}
```

**Step 4: Main component — filter, map, panel**

```tsx
export default function RoutesMap({ routes, apiKey }: Props) {
  const [active, setActive] = useState<Set<RouteColor>>(new Set(ALL_COLORS));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(
    () => routes.filter((r) => active.has(r.color)),
    [routes, active],
  );
  const selected = routes.find((r) => r.id === selectedId) ?? null;

  const toggle = (c: RouteColor) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  // Filter (always) + detail panel share the left column / stack on mobile.
  const panel = (
    <div className="routes-panel">
      <fieldset className="routes-filter">
        <legend className="sr-only">Filter routes by colour</legend>
        {ALL_COLORS.map((c) => (
          <label key={c} className="routes-chip" style={{ '--chip': ROUTE_HEX[c] } as React.CSSProperties}>
            <input type="checkbox" checked={active.has(c)} onChange={() => toggle(c)} />
            {COLOR_LABEL[c]}
          </label>
        ))}
      </fieldset>
      <div className="routes-detail">
        {selected ? (
          <>
            <h2>{selected.name}</h2>
            <p>{COLOR_LABEL[selected.color]} · {selected.distance} miles</p>
            <p>Café stop: {selected.cafeStop}</p>
            <a className="btn" href={selected.gpxUrl} download>Download GPX</a>
          </>
        ) : (
          <p>{routes.length === 0 ? 'No routes published yet.' : 'Click a route to see details.'}</p>
        )}
      </div>
    </div>
  );

  if (!apiKey) {
    // Graceful degradation: no map, but filter + downloads still work.
    return (
      <div className="routes-layout">
        {panel}
        <div className="routes-map-fallback"><p>Map unavailable.</p></div>
      </div>
    );
  }

  return (
    <div className="routes-layout">
      {panel}
      <div className="routes-map">
        <APIProvider apiKey={apiKey}>
          <Map defaultCenter={WHISTON} defaultZoom={11} mapId="scc-routes" gestureHandling="cooperative" disableDefaultUI={false} onClick={() => setSelectedId(null)}>
            <FitBounds routes={visible} />
            {visible.map((r) => (
              <RoutePolyline
                key={r.id}
                route={r}
                selected={r.id === selectedId}
                dimmed={selectedId !== null && r.id !== selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
```

**Step 5: Type-check + test suite**

Run: `npm run astro check`
Expected: 0 errors. Fix any `any` or missing-type complaints before committing.

Run: `npm test`
Expected: Task 1's tests still green (the island has no unit tests — it's verified by
`astro check` here and the manual smoke test in Task 3).

**Step 6: Commit**

```bash
git add src/components/RoutesMap.tsx
git commit -m "Add RoutesMap island: filter, polylines, selection, detail panel"
```

---

## Task 3: The page (`src/pages/routes.astro`) + styles

**Files:**
- Create: `src/pages/routes.astro`
- Modify: `src/styles/global.css` (or a new `src/styles/components/routes.css` imported there) — add the grid layout + chip styles

**Step 1: The page**

```astro
---
import Layout from '../layouts/Layout.astro';
import RoutesMap from '../components/RoutesMap.tsx';
import { getRoutes } from '../lib/routes';

// Static (build-time). Route data changes rarely; no request-time data.
const routes = await getRoutes();
const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;
---

<Layout
  title="Club routes // Sitwell Cycling Club"
  description="Explore our club ride routes — plotted on the map, with GPX downloads."
>
  <section class="w-full px-5 lg:px-10 mb-10">
    <h1 class="text-6xl font-ropa-bold mb-5">Club routes</h1>
    <p class="lg:w-3/4">Every club route, plotted. Filter by ride colour, click a route for its distance, café stop and a GPX download for your Garmin, Wahoo or Strava.</p>
  </section>
  <RoutesMap routes={routes} apiKey={apiKey} client:only="react" />
</Layout>
```

**Step 2: Layout + chip styles**

The desktop/mobile reorder uses **CSS grid areas**, not `order:`, so DOM order
(filter → detail → map) stays the reading/tab order. Add to the styles:

```css
/* Routes map: mobile = filter, map, detail stacked; desktop = panel left, map right. */
.routes-layout {
  display: grid;
  gap: 1.25rem;
  padding: 0 1.25rem;
  grid-template-areas: 'filter' 'map' 'detail';
}
.routes-panel { display: contents; }         /* let filter + detail place independently */
.routes-filter { grid-area: filter; }
.routes-map, .routes-map-fallback { grid-area: map; min-height: 60vh; }
.routes-detail { grid-area: detail; }

@media (min-width: 1024px) {
  .routes-layout {
    padding: 0 2.5rem;
    grid-template-columns: 22rem 1fr;
    grid-template-areas:
      'filter map'
      'detail map';
    align-items: start;
  }
  .routes-map, .routes-map-fallback { min-height: 75vh; }
}

.routes-filter { display: flex; flex-wrap: wrap; gap: 0.5rem; border: 0; padding: 0; }
.routes-chip {
  display: inline-flex; align-items: center; gap: 0.4rem;
  border-left: 6px solid var(--chip); padding: 0.35rem 0.6rem;
  font-family: 'Ropa Sans Pro Bold', sans-serif; text-transform: uppercase;
  cursor: pointer; user-select: none;
}
```

> `.routes-panel { display: contents }` lets the filter and detail — rendered inside
> one wrapper in the island — participate directly in the outer grid, so each lands
> in its own named area at both breakpoints. Confirm this renders correctly in Step 4;
> if `display: contents` causes trouble, split the panel into two siblings instead.

**Step 3: Test, type-check + build**

Run: `npm test`
Expected: all unit tests green.

Run: `npm run astro check`
Expected: 0 errors.

Run: `npm run build`
Expected: build succeeds; `/routes` prerenders (or renders with an empty list if
Sanity has no `route` docs yet — that is fine and exercises the empty state).

**Step 4: Manual smoke test**

Run: `npm run dev`, open `/routes`. With `PUBLIC_GOOGLE_MAPS_API_KEY` set locally
and at least one `route` in Sanity:
- Routes draw in the correct colours; map fits to them.
- Unticking a colour removes its lines and refits bounds.
- Clicking a route highlights it, dims others, fills the panel, and the GPX
  downloads and imports into a device app.
- Without the env key, the page shows the filter + "Map unavailable" and downloads
  still work.
- With zero routes, the panel shows "No routes published yet."

**Step 5: Commit**

```bash
git add src/pages/routes.astro src/styles/
git commit -m "Add /routes page and responsive grid layout for the routes map"
```

---

## Task 4: Environment, Sanity schema, and Vercel wiring (human-assisted)

These are outside the app code and mostly need dashboard access. The plan documents
them; the requester (or Claude with access) performs them.

**Step 1: Sanity `route` schema (separate Studio repo)**

Add to the Studio project (NOT this repo). Field names must match the GROQ in
`getRoutes` (`colour`, `distance`, `cafeStop`, `gpxFile`):

```ts
// route.ts (Sanity schema)
export default {
  name: 'route',
  title: 'Route',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
    { name: 'colour', title: 'Colour', type: 'string',
      options: { list: [
        { title: 'Green', value: 'green' }, { title: 'Amber', value: 'amber' },
        { title: 'Red', value: 'red' }, { title: 'Off-road', value: 'brown' },
      ], layout: 'radio' }, validation: (r) => r.required() },
    { name: 'distance', title: 'Distance (miles)', type: 'number', validation: (r) => r.required().positive() },
    { name: 'cafeStop', title: 'Café stop', type: 'string' },
    { name: 'gpxFile', title: 'GPX file', type: 'file', options: { accept: '.gpx' }, validation: (r) => r.required() },
  ],
};
```

**Step 2: Google Cloud API key**

- Create a project, enable **Maps JavaScript API**, enable billing.
- Create a browser API key; restrict it to **HTTP referrers**: `*.sitwell.cc/*`
  (and `localhost:*` for dev if desired).
- This is what protects the key — it ships to the browser regardless.

**Step 3: Vercel env var**

- Add `PUBLIC_GOOGLE_MAPS_API_KEY` in the Vercel project (Production + Preview).
- Add it to a local `.env` for dev. The `PUBLIC_` prefix exposes it client-side in Astro.

**Step 4: Vercel subdomain + rewrite**

- Add domain `routes.sitwell.cc` to the Vercel project (DNS CNAME per Vercel).
- Add a `vercel.json` rewrite (create the file) so the subdomain serves `/routes`:

```json
{
  "rewrites": [
    { "source": "/", "has": [{ "type": "host", "value": "routes.sitwell.cc" }], "destination": "/routes" }
  ]
}
```

> Confirm the exact host-rewrite syntax against current Vercel docs during execution
> — rewrite/host-matching config changes between Vercel versions. Commit `vercel.json`
> once verified.

**Step 5: Verify end-to-end on a preview deploy**

Push the branch, open the Vercel preview, confirm the map, filter, selection, and
GPX download all work with the real key and real Sanity routes.

---

## Task 5: Open the PR

Per CLAUDE.md — Claude opens, a human merges (merging to `main` deploys to prod).

- Title: `[ai-assisted] Club routes map (routes.sitwell.cc) — Phase 1`
- Body references both docs (`docs/plans/2026-07-07-routes-map-design.md` and this
  plan), summarises the diff, and ends with `Manually reviewed by <name>`.
- Keep the `Co-Authored-By` trailer on commits. **Do not merge.**

---

## Out of scope (Phase 1)

CSV import/export (Phase 2 — see design doc), per-service GPX buttons, elevation
profiles, turn-by-turn, route search/sort. Do not build these now.
