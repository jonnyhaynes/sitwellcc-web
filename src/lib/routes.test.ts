import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { parseGpx, getRoutes } from './routes';

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

const gpx =
  '<gpx><trk><trkseg><trkpt lat="53.4" lon="-1.3"></trkpt><trkpt lat="53.5" lon="-1.4"></trkpt></trkseg></trk></gpx>';

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => vi.unstubAllGlobals());

describe('getRoutes', () => {
  it('maps Sanity docs to Route[] with parsed coords', async () => {
    fetchMock.mockResolvedValue([
      {
        _id: 'r1',
        name: 'Cadeby Loop',
        color: 'green',
        distance: 34,
        cafeStop: 'Cusworth',
        gpxUrl: 'https://cdn/x.gpx',
      },
    ]);
    vi.mocked(fetch).mockResolvedValue(new Response(gpx, { status: 200 }));
    const routes = await getRoutes();
    expect(routes).toHaveLength(1);
    expect(routes[0]).toMatchObject({
      id: 'r1',
      name: 'Cadeby Loop',
      color: 'green',
      distance: 34,
      gpxUrl: 'https://cdn/x.gpx',
    });
    expect(routes[0].coords).toHaveLength(2);
  });
  it('still lists a route whose GPX fetch fails, with empty coords', async () => {
    fetchMock.mockResolvedValue([
      {
        _id: 'r2',
        name: 'Broken',
        color: 'red',
        distance: 50,
        cafeStop: '',
        gpxUrl: 'https://cdn/bad.gpx',
      },
    ]);
    vi.mocked(fetch).mockResolvedValue(new Response('', { status: 500 }));
    const routes = await getRoutes();
    expect(routes).toHaveLength(1);
    expect(routes[0].coords).toEqual([]);
  });
  it('drops docs with no gpxUrl', async () => {
    fetchMock.mockResolvedValue([
      {
        _id: 'r3',
        name: 'No file',
        color: 'amber',
        distance: 20,
        cafeStop: '',
        gpxUrl: null,
      },
    ]);
    const routes = await getRoutes();
    expect(routes).toEqual([]);
  });
});
