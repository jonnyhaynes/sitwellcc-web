import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ROUTE_HEX,
  routeShareUrl,
  routeSlug,
  routeSlugFromBarePath,
  routeSlugFromPath,
  routeSlugFromSearch,
  type Route,
  type RouteColor,
} from '../lib/routes';
import { isRoutesMicrosite } from '../lib/microsites';
import {
  formatDistance,
  formatElevation,
  type DistanceUnit,
  type ElevationUnit,
} from '../lib/units';

const DISTANCE_UNIT_KEY = 'routes.distanceUnit';
const ELEVATION_UNIT_KEY = 'routes.elevationUnit';

// Where routes live on the main site. On the routes microsite they live at the site
// root instead — see shareBasePath.
const ROUTES_PATH = '/routes';

// How long the "Link copied" confirmation stays up, in ms.
const COPY_FEEDBACK_MS = 2000;

// The base a route's path hangs off: '' on the routes microsite, whose root already
// *is* the routes page (so routes.sitwell.cc/<slug> — no repeated "routes"), and
// /routes everywhere else.
function shareBasePath(): string {
  return isRoutesMicrosite(window.location.hostname) ? '' : ROUTES_PATH;
}

// Resolve the route a URL points at: /routes/<slug>, the bare /<slug> form the routes
// microsite shares, or the ?route= fallback (no rewrite at all under `astro dev`).
// Returns null for no slug, an unrecognised slug, or a slug that matches no published
// route — the page then renders with nothing selected rather than erroring.
function routeIdFromUrl(routes: Route[]): string | null {
  const { pathname, search, hostname } = window.location;
  // A bare segment only means "a route" where the whole site is the routes page;
  // on www.sitwell.cc it would collide with the site's own pages.
  const bareSlug = isRoutesMicrosite(hostname) ? routeSlugFromBarePath(pathname) : null;
  const slug = bareSlug ?? routeSlugFromPath(pathname) ?? routeSlugFromSearch(search);
  if (!slug) return null;
  return routes.find((route) => routeSlug(route.name) === slug)?.id ?? null;
}

// Is the primary input a touchscreen? The OS share sheet is the right affordance
// on a phone, but on desktop it varies by OS and browser — Windows' flyout offers
// no plain "copy link", and Firefox doesn't implement it at all — so desktop
// always takes the predictable copy path instead. `pointer: coarse` describes the
// primary input, so a touchscreen laptop with a mouse attached still copies.
function isTouchDevice(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}

// Read a persisted unit choice, falling back to the default. Guarded so it's
// safe under SSR / storage-disabled browsers (the island is client:only, but be
// defensive anyway).
function readUnit<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  return stored && (allowed as readonly string[]).includes(stored) ? (stored as T) : fallback;
}

const ALL_COLORS: RouteColor[] = ['green', 'amber', 'red', 'brown'];

const COLOR_LABEL: Record<RouteColor, string> = {
  green: 'Green',
  amber: 'Amber',
  red: 'Red',
  brown: 'Off-road',
};

// Default camera, as a Leaflet [lat, lng] tuple.
const WHISTON: [number, number] = [53.405298, -1.327339];

interface RoutesMapProps {
  routes: Route[];
}

export default function RoutesMap({ routes }: RoutesMapProps) {
  const [active, setActive] = useState<Set<RouteColor>>(() => new Set(ALL_COLORS));

  // The route the URL pointed at on first load, if any — i.e. a shared link.
  // While it's set the page is *focused* on that one route: the map plots only
  // it and the panel shows its detail with a Back link where the filters would
  // be. It never changes after mount; leaving the focused view is a plain
  // navigation to the routes page, not a state change here.
  const [sharedRouteId] = useState<string | null>(() => routeIdFromUrl(routes));

  // Whether the page was opened on a shared link. Decides the one-off scroll to
  // the detail panel, and nothing else.
  const cameFromUrl = useRef(false);

  const [selectedId, setSelectedId] = useState<string | null>(() => {
    cameFromUrl.current = sharedRouteId !== null;
    return sharedRouteId;
  });

  // "Link copied" is only worth showing until the member moves on, so it resets
  // when the selection changes and after a short delay.
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const copyTimer = useRef<number | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(() =>
    readUnit(DISTANCE_UNIT_KEY, ['mi', 'km'] as const, 'mi'),
  );
  const [elevationUnit, setElevationUnit] = useState<ElevationUnit>(() =>
    readUnit(ELEVATION_UNIT_KEY, ['m', 'ft'] as const, 'ft'),
  );

  useEffect(() => {
    localStorage.setItem(DISTANCE_UNIT_KEY, distanceUnit);
  }, [distanceUnit]);
  useEffect(() => {
    localStorage.setItem(ELEVATION_UNIT_KEY, elevationUnit);
  }, [elevationUnit]);

  // The shared-link route, resolved against the routes we have. An unrecognised
  // slug already resolves to null in routeIdFromUrl, so this is only ever a real
  // route — but resolve defensively rather than assuming.
  const sharedRoute = sharedRouteId
    ? routes.find((r) => r.id === sharedRouteId) ?? null
    : null;
  const focused = sharedRoute !== null;

  // Selecting a route never rewrites the address bar: browsing stays on the
  // routes page (/routes, or the site root on the microsite) and the Share button
  // mints the link instead — see shareUrlFor.

  // In the focused view the shared route is the only one plotted, so the colour
  // filters don't apply.
  const visible = useMemo(
    () => (focused && sharedRoute ? [sharedRoute] : routes.filter((r) => active.has(r.color))),
    [routes, active, focused, sharedRoute],
  );

  const selected = focused ? sharedRoute : routes.find((r) => r.id === selectedId) ?? null;

  // Land a shared link on the route itself: on mobile the detail panel sits below
  // the map, so without this the visitor arrives at the map with no sign of what
  // was sent. Only for the initial URL selection — a route someone clicks is
  // already in front of them.
  useEffect(() => {
    if (!cameFromUrl.current || !selectedId) return;
    cameFromUrl.current = false;
    detailRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedId]);

  // Moving to another route clears the copy confirmation (and any pending timer).
  useEffect(() => {
    setShareState('idle');
    return () => {
      if (copyTimer.current !== null) {
        window.clearTimeout(copyTimer.current);
        copyTimer.current = null;
      }
    };
  }, [selectedId]);

  // --- Leaflet map -------------------------------------------------------
  // Leaflet owns its own DOM, so the map is imperative: the instance lives in a
  // ref/state and the React state above drives it, exactly like the panel.
  const mapRef = useRef<HTMLDivElement | null>(null);
  const lineGroupRef = useRef<L.LayerGroup | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  // Create the map once; everything below reacts to state changes on it.
  useEffect(() => {
    if (!mapRef.current) return;
    const instance = L.map(mapRef.current, {
      center: WHISTON,
      zoom: 11,
      // Leaflet's equivalent of Google's `gestureHandling="cooperative"`: the
      // wheel scrolls the page, not the map, unless the member opts in (⌘/ctrl+wheel).
      scrollWheelZoom: false,
    });

    // OSM tiles are free and keyless. The attribution is required by OSM's tile
    // usage policy, and Leaflet renders it from this option.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(instance);

    lineGroupRef.current = L.layerGroup().addTo(instance);
    setMap(instance);

    return () => {
      instance.remove();
      lineGroupRef.current = null;
      setMap(null);
    };
  }, []);

  // A background click clears the selection — except in the focused (shared-link)
  // view, whose single route must stay put.
  useEffect(() => {
    if (!map) return;
    const clear = () => {
      if (!focused) setSelectedId(null);
    };
    map.on('click', clear);
    return () => {
      map.off('click', clear);
    };
  }, [map, focused]);

  // Redraw the routes as polylines whenever the visible set or the selection
  // changes. `bubblingMouseEvents: false` stops a line click from also reaching
  // the map's click handler and clearing the selection it just made.
  useEffect(() => {
    const group = lineGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    for (const route of visible) {
      const isSelected = route.id === selectedId;
      const isDimmed = selectedId !== null && !isSelected;
      const line = L.polyline(
        route.coords.map((point) => [point.lat, point.lng] as [number, number]),
        {
          color: ROUTE_HEX[route.color],
          weight: isSelected ? 6 : 3,
          opacity: isDimmed ? 0.3 : 1,
          bubblingMouseEvents: false,
        },
      );
      line.on('click', () => setSelectedId(route.id));
      line.addTo(group);
      if (isSelected) line.bringToFront();
    }
  }, [map, visible, selectedId]);

  // Fit the map to the visible routes. Leaflet measures the container, which in
  // this grid can size after first paint, so invalidateSize() runs first — the
  // equivalent of the old "fit again once idle" trick — inside a frame so the
  // layout has settled.
  useEffect(() => {
    if (!map) return;

    const points = visible.flatMap((route) =>
      route.coords.map((point) => [point.lat, point.lng] as [number, number]),
    );
    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    const frame = requestAnimationFrame(() => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [32, 32] });
    });
    return () => cancelAnimationFrame(frame);
  }, [map, visible]);

  const toggle = (color: RouteColor) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(color)) next.delete(color);
      else next.add(color);
      return next;
    });
  };

  // The absolute URL for a route: the share sheet and the clipboard are both no
  // use with a relative path.
  const shareUrlFor = (route: Route) =>
    new URL(routeShareUrl(shareBasePath(), routeSlug(route.name)), window.location.origin).href;

  const share = async (route: Route) => {
    const url = shareUrlFor(route);

    // Phones get the native sheet — that's where sharing a route into the group
    // chat happens. Desktop deliberately copies instead: see isTouchDevice.
    if (isTouchDevice() && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: route.name, url });
        return;
      } catch (err) {
        // Dismissing the sheet is a decision, not a failure: don't then copy.
        if (err instanceof DOMException && err.name === 'AbortError') return;
        // Anything else (unsupported payload, no share target) falls through to
        // the clipboard so the member still ends up with a usable link.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareState('copied');
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setShareState('idle'), COPY_FEEDBACK_MS);
    } catch {
      // Clipboard blocked (insecure context, permission denied): show the URL so
      // it can still be selected and copied by hand.
      setShareState('manual');
    }
  };

  const unitGroup = <T extends string>(
    label: string,
    value: T,
    options: readonly { value: T; label: string }[],
    onChange: (value: T) => void,
  ) => (
    <div className="routes-unit-group" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="routes-unit-btn"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const panel = (
    <div className="routes-panel">
      {/* A shared link has a single fixed route on the map, so the colour filters
          don't apply and are dropped. */}
      {!focused && (
        <fieldset className="routes-filter">
          <legend className="visually-hidden">Filter routes by colour</legend>
          {ALL_COLORS.map((color) => (
            <label
              key={color}
              className="routes-chip"
              style={{ '--chip': ROUTE_HEX[color] } as React.CSSProperties}
            >
              <input
                type="checkbox"
                checked={active.has(color)}
                onChange={() => toggle(color)}
              />
              {COLOR_LABEL[color]}
            </label>
          ))}
        </fieldset>
      )}

      <div className="routes-units">
        {unitGroup<DistanceUnit>(
          'Distance units',
          distanceUnit,
          [
            { value: 'mi', label: 'Miles' },
            { value: 'km', label: 'Km' },
          ],
          setDistanceUnit,
        )}
        {unitGroup<ElevationUnit>(
          'Elevation units',
          elevationUnit,
          [
            { value: 'ft', label: 'Feet' },
            { value: 'm', label: 'Metres' },
          ],
          setElevationUnit,
        )}
      </div>

      {!focused && (
        <ul className="routes-list">
          {visible.length === 0 ? (
            <li className="routes-list-empty">
              {routes.length === 0
                ? 'No routes published yet.'
                : 'No routes match the selected colours.'}
            </li>
          ) : (
            visible.map((route) => (
              <li key={route.id}>
                <button
                  type="button"
                  className={
                    route.id === selectedId
                      ? 'routes-list-item routes-list-item--selected'
                      : 'routes-list-item'
                  }
                  style={{ '--chip': ROUTE_HEX[route.color] } as React.CSSProperties}
                  aria-pressed={route.id === selectedId}
                  onClick={() => setSelectedId(route.id)}
                >
                  <span className="routes-list-name">{route.name}</span>
                  <span className="routes-list-meta">
                    {formatDistance(route.distanceMeters, distanceUnit)}
                    {route.rating !== null && (
                      <>
                        {' · '}
                        <span className="routes-rating">{route.rating}/5</span>
                      </>
                    )}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {selected && (
        <div
          ref={detailRef}
          className="routes-detail"
          style={{ '--chip': ROUTE_HEX[selected.color] } as React.CSSProperties}
        >
          {/* The focused view's page heading already names the ride, so repeating
              it here would just duplicate it. */}
          {!focused && <h2 className="text-2xl font-ropa leading-none">{selected.name}</h2>}
          <p>
            {formatDistance(selected.distanceMeters, distanceUnit)}
            {selected.elevationGain !== null && (
              <> · {formatElevation(selected.elevationGain, elevationUnit)}</>
            )}
          </p>
          {selected.rating !== null && (
            <p className="routes-rating">Difficulty: {selected.rating}/5</p>
          )}
          {selected.cafeStop && <p>Café stop: {selected.cafeStop}</p>}
          <div className="routes-actions">
            <a className="btn" href={selected.gpxUrl} download={selected.downloadName}>
              Download GPX
            </a>
            <button type="button" className="btn btn--secondary" onClick={() => share(selected)}>
              Share
            </button>
            <span className="routes-share-status" role="status">
              {shareState === 'copied' ? 'Link copied' : ''}
            </span>
          </div>
          {shareState === 'manual' && (
            // Copying was blocked, so hand the member the URL to copy by hand.
            <input
              className="routes-share-fallback"
              type="text"
              readOnly
              aria-label={`Link to ${selected.name}`}
              value={shareUrlFor(selected)}
              onFocus={(event) => event.currentTarget.select()}
            />
          )}
        </div>
      )}
    </div>
  );

  // The page heading. On a shared link it names the ride, in the ride's colour,
  // and drops the intro; otherwise it stays the browse view's heading. It lives
  // here rather than in routes.astro because only the island knows whether the
  // URL pointed at a route: the page is one static document serving every link.
  const heading = (
    <section className="w-full px-5 lg:px-10 mb-10">
      {focused && sharedRoute ? (
        <h1
          className="text-6xl font-ropa-bold"
          style={{ color: ROUTE_HEX[sharedRoute.color] }}
        >
          {sharedRoute.name}
        </h1>
      ) : (
        <>
          <h1 className="text-6xl font-ropa-bold mb-5">Club routes</h1>
          <p className="lg:w-3/4">
            Every club route, plotted. Filter by ride colour, click a route for its distance,
            café stop and a GPX download for your Garmin, Wahoo or Strava.
          </p>
        </>
      )}
    </section>
  );

  // The focused (shared-link) view drops the filter and list rows, so it needs
  // its own areas. See .routes-layout--focused in routes.css.
  const layoutClass = focused
    ? 'routes-layout routes-layout--focused mb-20'
    : 'routes-layout mb-20';

  return (
    <>
      {heading}
      <div className={layoutClass}>
        {panel}
        <div className="routes-map">
          <div ref={mapRef} className="routes-map-canvas" />
        </div>
      </div>
    </>
  );
}
