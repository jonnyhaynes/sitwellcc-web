import { client } from './sanity';
import type { RideColor } from './rides';

export type RouteColor = Extract<RideColor, 'green' | 'amber' | 'red' | 'brown'>;

export interface LatLng {
  lat: number;
  lng: number;
  ele?: number; // metres above sea level, when the GPX point carries an <ele> child
}

// Ignore climbs smaller than this (metres) between consecutive points: consumer
// GPS elevation is noisy, and summing every tiny wobble massively overstates
// total ascent. 3m is a common smoothing threshold for cycling ascent figures.
const ELEVATION_NOISE_THRESHOLD_M = 3;

export interface Route {
  id: string;
  name: string;
  color: RouteColor;
  distanceMeters: number; // Sanity override (mi→m) if set, else computed from GPX coords (haversine); 0 if not plottable
  cafeStop: string;
  gpxUrl: string; // untouched Sanity file URL — the source of the download
  downloadName: string; // tidy filename for the download, e.g. "sitwell-cadeby-loop.gpx"
  coords: LatLng[]; // parsed from the GPX — the map line
  elevationGain: number | null; // Sanity override (m) if set, else total ascent from GPX <ele>; null if neither available
}

const METERS_PER_MILE = 1609.344;

// Turn a route name into a filename-safe slug for the GPX download, so members
// get "sitwell-cadeby-loop.gpx" rather than "komoot_export_final(3).gpx".
export function gpxDownloadName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `sitwell-${slug || 'route'}.gpx`;
}

export const ROUTE_HEX: Record<RouteColor, string> = {
  green: '#109A49',
  amber: '#EF9014',
  red: '#D61E1E',
  brown: '#A15433',
};

// Parse GPX text to an ordered list of coordinates. Reads <trkpt>/<rtept>
// lat/lon attributes independently, so attribute order and quote style don't
// matter (real exporters vary). Elevation, when present as an <ele> child of
// the point, is captured too. Returns [] if none found; a malformed point
// (missing lat or lon) is skipped rather than throwing.
export function parseGpx(gpx: string): LatLng[] {
  // Match a point's opening tag, then everything up to its close tag, so the
  // <ele> child (if any) is in reach. Non-greedy body; also tolerate the
  // self-closing form (<trkpt .../>), which simply has no children.
  const pointRe = /<(?:\w+:)?(trkpt|rtept)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:\w+:)?\1\s*>)/gi;
  const num = (source: string, re: RegExp): number | null => {
    const m = source.match(re);
    return m ? Number(m[1]) : null;
  };
  const attr = (body: string, name: string) =>
    num(body, new RegExp(`\\b${name}\\s*=\\s*["'](-?\\d+(?:\\.\\d+)?)["']`, 'i'));
  const coords: LatLng[] = [];
  let point: RegExpExecArray | null;
  while ((point = pointRe.exec(gpx)) !== null) {
    const attrs = point[2];
    const inner = point[3] ?? '';
    const lat = attr(attrs, 'lat');
    const lng = attr(attrs, 'lon');
    if (lat === null || lng === null) continue;
    const ele = num(inner, /<(?:\w+:)?ele\s*>\s*(-?\d+(?:\.\d+)?)\s*<\/(?:\w+:)?ele\s*>/i);
    coords.push(ele === null ? { lat, lng } : { lat, lng, ele });
  }
  return coords;
}

// Great-circle distance between two points, in metres (haversine).
function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000; // mean Earth radius, metres
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Total path length in metres: sum of great-circle hops between consecutive
// points. Returns 0 for fewer than two points.
export function routeDistanceMeters(coords: LatLng[]): number {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineMeters(coords[i - 1], coords[i]);
  }
  return total;
}

// Total ascent in metres: sum of positive elevation deltas between consecutive
// points that both carry <ele>, ignoring climbs below the noise threshold.
// Returns null when fewer than two points have elevation data (i.e. the GPX
// carries no usable elevation).
export function elevationGainMeters(coords: LatLng[]): number | null {
  const withEle = coords.filter((c): c is Required<LatLng> => c.ele !== undefined);
  if (withEle.length < 2) return null;
  let gain = 0;
  for (let i = 1; i < withEle.length; i++) {
    const delta = withEle[i].ele - withEle[i - 1].ele;
    if (delta >= ELEVATION_NOISE_THRESHOLD_M) gain += delta;
  }
  return Math.round(gain);
}

interface RawRoute {
  _id: string;
  name: string;
  color: RouteColor;
  cafeStop: string;
  gpxUrl: string | null;
  distance: number | null; // optional editor override, in miles
  elevation: number | null; // optional editor override, in metres
}

// Fetch route documents from Sanity and enrich each with parsed GPX coords, plus
// distance and elevation. Both prefer the editor's Sanity override when set and
// fall back to values computed from the GPX. A route with no GPX file is
// dropped; one whose GPX fetch/parse fails is still listed (for its download
// link) using its overrides (or zero distance / null elevation).
export async function getRoutes(): Promise<Route[]> {
  const query = `*[_type == "route" && defined(gpxFile.asset)]{
    _id, name, "color": colour, cafeStop, distance, elevation,
    "gpxUrl": gpxFile.asset->url
  } | order(name asc)`;

  const raw = await client.fetch<RawRoute[]>(query);

  // Prefer the editor override; fall back to the GPX-computed value.
  const distanceOf = (r: RawRoute, coords: LatLng[]) =>
    r.distance != null ? r.distance * METERS_PER_MILE : routeDistanceMeters(coords);
  const elevationOf = (r: RawRoute, coords: LatLng[]) =>
    r.elevation != null ? r.elevation : elevationGainMeters(coords);

  const routes = await Promise.all(
    raw.map(async (r): Promise<Route | null> => {
      if (!r.gpxUrl) return null;
      const base = {
        id: r._id,
        name: r.name,
        color: r.color,
        cafeStop: r.cafeStop,
        gpxUrl: r.gpxUrl,
        downloadName: gpxDownloadName(r.name),
      };
      try {
        const res = await fetch(r.gpxUrl);
        if (!res.ok) throw new Error(`GPX fetch ${res.status}`);
        const coords = parseGpx(await res.text());
        if (coords.length === 0) {
          console.warn(
            `Route "${r.name}" (${r._id}): GPX had no points; still listed, not plotted.`,
          );
        }
        return {
          ...base,
          coords,
          distanceMeters: distanceOf(r, coords),
          elevationGain: elevationOf(r, coords),
        };
      } catch (err) {
        console.warn(
          `Route "${r.name}" (${r._id}): GPX parse/fetch failed; still listed, not plotted.`,
          err,
        );
        return {
          ...base,
          coords: [],
          distanceMeters: distanceOf(r, []),
          elevationGain: elevationOf(r, []),
        };
      }
    }),
  );

  return routes.filter((r): r is Route => r !== null);
}
