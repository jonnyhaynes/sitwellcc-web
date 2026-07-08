import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import {
  parseGpx,
  getRoutes,
  routeDistanceMeters,
  elevationGainMeters,
  elevationGainFeet,
  gpxDownloadName,
} from './routes';

vi.mock('./sanity', () => ({ client: { fetch: vi.fn() } }));
import { client } from './sanity';

// The real client.fetch is heavily overloaded; view the mock through a simple
// async signature so mockResolvedValue/mockReset type-check cleanly.
const fetchMock = client.fetch as unknown as Mock<() => Promise<unknown>>;

const fixture = readFileSync(
  fileURLToPath(new URL('./__fixtures__/sample.gpx', import.meta.url)),
  'utf8',
);

describe('parseGpx', () => {
  it('extracts every track point in document order', () => {
    const coords = parseGpx(fixture);
    expect(coords).toHaveLength(3);
    expect(coords[0]).toMatchObject({ lat: 53.4053, lng: -1.3273 });
    expect(coords.at(-1)).toMatchObject({ lat: 53.421, lng: -1.355 });
  });
  it('reads the <ele> child of a point when present', () => {
    const coords = parseGpx(fixture);
    expect(coords.map((c) => c.ele)).toEqual([80, 120, 95]);
  });
  it('leaves ele undefined for points with no elevation', () => {
    const noEle = '<gpx><trk><trkseg><trkpt lat="53.4" lon="-1.3"></trkpt></trkseg></trk></gpx>';
    expect(parseGpx(noEle)[0].ele).toBeUndefined();
  });
  it('returns [] when there are no points', () => {
    expect(parseGpx('<gpx></gpx>')).toEqual([]);
  });
  it('parses route points (<rtept>) as well as track points', () => {
    const rte = '<gpx><rte><rtept lat="53.4" lon="-1.3"></rtept></rte></gpx>';
    expect(parseGpx(rte)).toEqual([{ lat: 53.4, lng: -1.3 }]);
  });
  it('parses points regardless of lat/lon attribute order', () => {
    const rev = '<gpx><trk><trkseg><trkpt lon="-1.3" lat="53.4"></trkpt></trkseg></trk></gpx>';
    expect(parseGpx(rev)).toEqual([{ lat: 53.4, lng: -1.3 }]);
  });
  it('parses single-quoted attributes', () => {
    const sq = "<gpx><rte><rtept lat='53.4' lon='-1.3'></rtept></rte></gpx>";
    expect(parseGpx(sq)).toEqual([{ lat: 53.4, lng: -1.3 }]);
  });
  it('parses self-closing points (no children, no ele)', () => {
    const sc = '<gpx><trk><trkseg><trkpt lat="53.4" lon="-1.3"/></trkseg></trk></gpx>';
    expect(parseGpx(sc)).toEqual([{ lat: 53.4, lng: -1.3 }]);
  });
});

describe('routeDistanceMeters', () => {
  it('is 0 for fewer than two points', () => {
    expect(routeDistanceMeters([])).toBe(0);
    expect(routeDistanceMeters([{ lat: 53.4, lng: -1.3 }])).toBe(0);
  });
  it('measures a known one-degree-of-latitude hop (~111 km) within tolerance', () => {
    const d = routeDistanceMeters([
      { lat: 53, lng: -1.3 },
      { lat: 54, lng: -1.3 },
    ]);
    expect(d).toBeGreaterThan(111_000);
    expect(d).toBeLessThan(111_400);
  });
  it('sums consecutive hops', () => {
    const two = routeDistanceMeters([
      { lat: 53, lng: -1.3 },
      { lat: 53.5, lng: -1.3 },
      { lat: 54, lng: -1.3 },
    ]);
    const one = routeDistanceMeters([
      { lat: 53, lng: -1.3 },
      { lat: 54, lng: -1.3 },
    ]);
    expect(two).toBeCloseTo(one, 0);
  });
});

describe('elevationGainMeters', () => {
  it('returns null when fewer than two points carry elevation', () => {
    expect(elevationGainMeters([{ lat: 0, lng: 0 }])).toBeNull();
    expect(elevationGainMeters([{ lat: 0, lng: 0, ele: 100 }])).toBeNull();
  });
  it('sums positive climbs and ignores descents', () => {
    // 80 -> 120 (+40) -> 95 (-25): only the +40 counts.
    const coords = parseGpx(fixture);
    expect(elevationGainMeters(coords)).toBe(40);
  });
  it('ignores climbs below the 3 m noise threshold', () => {
    const noisy = [
      { lat: 0, lng: 0, ele: 100 },
      { lat: 0, lng: 0, ele: 101 }, // +1, below threshold
      { lat: 0, lng: 0, ele: 102 }, // +1, below threshold
      { lat: 0, lng: 0, ele: 112 }, // +10, counts
    ];
    expect(elevationGainMeters(noisy)).toBe(10);
  });
  it('returns 0 for a flat-or-descending profile', () => {
    const down = [
      { lat: 0, lng: 0, ele: 200 },
      { lat: 0, lng: 0, ele: 150 },
      { lat: 0, lng: 0, ele: 150 },
    ];
    expect(elevationGainMeters(down)).toBe(0);
  });
});

describe('elevationGainFeet', () => {
  it('converts the metres gain to whole feet', () => {
    // fixture: 80 -> 120 -> 95 = +40 m; 40 × 3.28084 ≈ 131 ft
    const coords = parseGpx(fixture);
    expect(elevationGainFeet(coords)).toBe(131);
  });
  it('returns null when there is no usable elevation data', () => {
    expect(elevationGainFeet([{ lat: 0, lng: 0, ele: 100 }])).toBeNull();
  });
});

describe('gpxDownloadName', () => {
  it('slugifies the route name into sitwell-<slug>.gpx', () => {
    expect(gpxDownloadName('Cadeby Loop')).toBe('sitwell-cadeby-loop.gpx');
  });
  it('collapses punctuation and trims stray hyphens', () => {
    expect(gpxDownloadName("Whiston  &  Ulley (long)")).toBe('sitwell-whiston-ulley-long.gpx');
  });
  it('falls back to "route" when the name has no usable characters', () => {
    expect(gpxDownloadName('!!!')).toBe('sitwell-route.gpx');
  });
});

const gpx =
  '<gpx><trk><trkseg><trkpt lat="53.4" lon="-1.3"><ele>50</ele></trkpt><trkpt lat="53.5" lon="-1.4"><ele>90</ele></trkpt></trkseg></trk></gpx>';

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => vi.unstubAllGlobals());

describe('getRoutes', () => {
  it('computes distance and elevation from GPX when no override is set', async () => {
    fetchMock.mockResolvedValue([
      {
        _id: 'r1',
        name: 'Cadeby Loop',
        color: 'green',
        cafeStop: 'Cusworth',
        gpxUrl: 'https://cdn/x.gpx',
        distance: null,
        elevation: null,
      },
    ]);
    vi.mocked(fetch).mockResolvedValue(new Response(gpx, { status: 200 }));
    const routes = await getRoutes();
    expect(routes).toHaveLength(1);
    expect(routes[0]).toMatchObject({
      id: 'r1',
      name: 'Cadeby Loop',
      color: 'green',
      gpxUrl: 'https://cdn/x.gpx',
      downloadName: 'sitwell-cadeby-loop.gpx',
      elevationGain: 131, // GPX 50->90 = +40 m, converted to feet
    });
    expect(routes[0].coords).toHaveLength(2);
    expect(routes[0].distanceMeters).toBeGreaterThan(0);
  });
  it('prefers the Sanity distance/elevation overrides over the GPX values', async () => {
    fetchMock.mockResolvedValue([
      {
        _id: 'r1',
        name: 'Overridden',
        color: 'green',
        cafeStop: '',
        gpxUrl: 'https://cdn/x.gpx',
        distance: 50, // miles → 80467.2 m
        elevation: 700, // feet — used as-is, no conversion
      },
    ]);
    vi.mocked(fetch).mockResolvedValue(new Response(gpx, { status: 200 }));
    const routes = await getRoutes();
    expect(routes[0].distanceMeters).toBeCloseTo(50 * 1609.344, 3);
    expect(routes[0].elevationGain).toBe(700); // feet, unchanged
  });
  it('still lists a route whose GPX fetch fails, using overrides or 0/null fallbacks', async () => {
    fetchMock.mockResolvedValue([
      {
        _id: 'r2',
        name: 'Broken',
        color: 'red',
        cafeStop: '',
        gpxUrl: 'https://cdn/bad.gpx',
        distance: null,
        elevation: null,
      },
    ]);
    vi.mocked(fetch).mockResolvedValue(new Response('', { status: 500 }));
    const routes = await getRoutes();
    expect(routes).toHaveLength(1);
    expect(routes[0].coords).toEqual([]);
    expect(routes[0].distanceMeters).toBe(0);
    expect(routes[0].elevationGain).toBeNull();
    expect(routes[0].downloadName).toBe('sitwell-broken.gpx');
  });
  it('uses overrides even when the GPX failed to parse', async () => {
    fetchMock.mockResolvedValue([
      {
        _id: 'r2',
        name: 'Broken but tagged',
        color: 'red',
        cafeStop: '',
        gpxUrl: 'https://cdn/bad.gpx',
        distance: 30,
        elevation: 400,
      },
    ]);
    vi.mocked(fetch).mockResolvedValue(new Response('', { status: 500 }));
    const routes = await getRoutes();
    expect(routes[0].distanceMeters).toBeCloseTo(30 * 1609.344, 3);
    expect(routes[0].elevationGain).toBe(400);
  });
  it('maps a mixed batch positionally without cross-contamination', async () => {
    fetchMock.mockResolvedValue([
      {
        _id: 'r1',
        name: 'Good',
        color: 'green',
        cafeStop: 'Cusworth',
        gpxUrl: 'https://cdn/good.gpx',
        distance: null,
        elevation: null,
      },
      {
        _id: 'r2',
        name: 'Bad',
        color: 'red',
        cafeStop: '',
        gpxUrl: 'https://cdn/bad.gpx',
        distance: null,
        elevation: null,
      },
    ]);
    vi.mocked(fetch).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('good')) return Promise.resolve(new Response(gpx, { status: 200 }));
      return Promise.resolve(new Response('', { status: 500 }));
    });
    const routes = await getRoutes();
    expect(routes).toHaveLength(2);
    expect(routes[0].coords.length).toBeGreaterThan(0);
    expect(routes[1].coords).toEqual([]);
  });
  it('drops docs with no gpxUrl', async () => {
    fetchMock.mockResolvedValue([
      {
        _id: 'r3',
        name: 'No file',
        color: 'amber',
        cafeStop: '',
        gpxUrl: null,
        distance: null,
        elevation: null,
      },
    ]);
    const routes = await getRoutes();
    expect(routes).toEqual([]);
  });
});
