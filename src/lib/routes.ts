import { client } from './sanity';
import type { RideColor } from './rides';

export type RouteColor = Extract<RideColor, 'green' | 'amber' | 'red' | 'brown'>;

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  name: string;
  color: RouteColor;
  distance: number; // miles
  cafeStop: string;
  gpxUrl: string; // untouched Sanity file URL — the download
  coords: LatLng[]; // parsed from the GPX — the map line
}

export const ROUTE_HEX: Record<RouteColor, string> = {
  green: '#109A49',
  amber: '#EF9014',
  red: '#D61E1E',
  brown: '#A15433',
};

// Parse GPX text to an ordered list of coordinates. Reads <trkpt>/<rtept>
// lat/lon attributes independently, so attribute order and quote style don't
// matter (real exporters vary). Returns [] if none found; a malformed point
// (missing lat or lon) is skipped rather than throwing.
export function parseGpx(gpx: string): LatLng[] {
  const tagRe = /<(?:\w+:)?(?:trkpt|rtept)\b([^>]*)>/gi;
  const attr = (body: string, name: string): number | null => {
    const m = body.match(new RegExp(`\\b${name}\\s*=\\s*["'](-?\\d+(?:\\.\\d+)?)["']`, 'i'));
    return m ? Number(m[1]) : null;
  };
  const coords: LatLng[] = [];
  let tag: RegExpExecArray | null;
  while ((tag = tagRe.exec(gpx)) !== null) {
    const lat = attr(tag[1], 'lat');
    const lng = attr(tag[1], 'lon');
    if (lat !== null && lng !== null) coords.push({ lat, lng });
  }
  return coords;
}

interface RawRoute {
  _id: string;
  name: string;
  color: RouteColor;
  distance: number;
  cafeStop: string;
  gpxUrl: string | null;
}

// Fetch route documents from Sanity and enrich each with parsed GPX coords.
// A route with no GPX file is dropped; one whose GPX fetch/parse fails is still
// listed (for its download link) but plotted with empty coords.
export async function getRoutes(): Promise<Route[]> {
  const query = `*[_type == "route" && defined(gpxFile.asset)]{
    _id, name, "color": colour, distance, cafeStop, "gpxUrl": gpxFile.asset->url
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
          console.warn(
            `Route "${r.name}" (${r._id}): GPX had no points; still listed, not plotted.`,
          );
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
        console.warn(
          `Route "${r.name}" (${r._id}): GPX parse/fetch failed; still listed, not plotted.`,
          err,
        );
        return {
          id: r._id,
          name: r.name,
          color: r.color,
          distance: r.distance,
          cafeStop: r.cafeStop,
          gpxUrl: r.gpxUrl,
          coords: [],
        };
      }
    }),
  );

  return routes.filter((r): r is Route => r !== null);
}
