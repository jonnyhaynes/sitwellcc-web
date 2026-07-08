/// <reference types="google.maps" />
import { useEffect, useMemo, useState } from 'react';
import { APIProvider, Map, Polyline, useMap } from '@vis.gl/react-google-maps';
import { ROUTE_HEX, type Route, type RouteColor } from '../lib/routes';
import {
  formatDistance,
  formatElevation,
  type DistanceUnit,
  type ElevationUnit,
} from '../lib/units';

const DISTANCE_UNIT_KEY = 'routes.distanceUnit';
const ELEVATION_UNIT_KEY = 'routes.elevationUnit';

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const toggle = (color: RouteColor) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(color)) next.delete(color);
      else next.add(color);
      return next;
    });
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
                </span>
              </button>
            </li>
          ))
        )}
      </ul>

      {selected && (
        <div
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
          {selected.cafeStop && <p>Café stop: {selected.cafeStop}</p>}
          <a className="btn mt-2.5" href={selected.gpxUrl} download={selected.downloadName}>
            Download GPX
          </a>
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
