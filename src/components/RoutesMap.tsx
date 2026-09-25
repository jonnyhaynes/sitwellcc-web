/// <reference types="google.maps" />
import { useEffect, useMemo, useRef, useState } from 'react';
import { APIProvider, Map, Polyline, useMap } from '@vis.gl/react-google-maps';
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

const WHISTON = { lat: 53.405298, lng: -1.327339 };

interface RoutesMapProps {
  routes: Route[];
  apiKey: string | undefined;
}

/**
 * Fits the map to the bounds of the currently-visible routes whenever that set
 * changes. If nothing plottable is visible it does nothing, leaving the default
 * camera in place.
 */
function FitBounds({ routes }: { routes: Route[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    let hasPoints = false;
    for (const route of routes) {
      for (const point of route.coords) {
        bounds.extend(point);
        hasPoints = true;
      }
    }
    if (!hasPoints) return;

    // fitBounds derives zoom from the map's pixel size, so it must run once the
    // map has laid out. On first mount the container may still be sizing (grid),
    // giving a wrong zoom — so fit now and again after the map goes idle.
    const fit = () => map.fitBounds(bounds, 32);
    fit();
    const listener = google.maps.event.addListenerOnce(map, 'idle', fit);
    return () => listener.remove();
  }, [map, routes]);

  return null;
}

export default function RoutesMap({ routes, apiKey }: RoutesMapProps) {
  const [active, setActive] = useState<Set<RouteColor>>(() => new Set(ALL_COLORS));

  // Whether the page was opened on a shared link. Decides the one-off scroll to
  // the detail panel, and nothing else.
  const cameFromUrl = useRef(false);

  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const id = routeIdFromUrl(routes);
    cameFromUrl.current = id !== null;
    return id;
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

  const visible = useMemo(
    () => routes.filter((r) => active.has(r.color)),
    [routes, active],
  );

  const selected = routes.find((r) => r.id === selectedId) ?? null;

  // Keep the address bar on the selected route, so copying the URL by hand gives
  // the same link the Share button copies. replaceState, not pushState: picking
  // through the list shouldn't stack up history entries, and Back should still
  // leave the page in one press. A route whose name yields no usable slug is left
  // out of the URL rather than linked as a path that can never match it.
  useEffect(() => {
    const base = shareBasePath();
    const slug = selected ? routeSlug(selected.name) : '';
    const next = slug ? routeShareUrl(base, slug) : base || '/';
    window.history.replaceState(null, '', next);
  }, [selected]);

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

      {selected && (
        <div
          ref={detailRef}
          className="routes-detail"
          style={{ '--chip': ROUTE_HEX[selected.color] } as React.CSSProperties}
        >
          <h2 className="text-2xl font-ropa leading-none">{selected.name}</h2>
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

  if (!apiKey) {
    return (
      <div className="routes-layout mb-20">
        {panel}
        <div className="routes-map-fallback">
          <p>Map unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="routes-layout mb-20">
      {panel}
      <div className="routes-map">
        <APIProvider apiKey={apiKey}>
          <Map
            style={{ width: '100%', height: '100%' }}
            gestureHandling="cooperative"
            defaultCenter={WHISTON}
            defaultZoom={11}
            onClick={() => setSelectedId(null)}
          >
            <FitBounds routes={visible} />
            {visible.map((route) => {
              const isSelected = route.id === selectedId;
              const isDimmed = selectedId !== null && !isSelected;
              return (
                <Polyline
                  key={route.id}
                  path={route.coords}
                  strokeColor={ROUTE_HEX[route.color]}
                  strokeWeight={isSelected ? 6 : 3}
                  strokeOpacity={isDimmed ? 0.3 : 1}
                  zIndex={isSelected ? 10 : 1}
                  onClick={() => setSelectedId(route.id)}
                />
              );
            })}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
