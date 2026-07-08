/// <reference types="google.maps" />
import { useEffect, useMemo, useState } from 'react';
import { APIProvider, Map, Polyline, useMap } from '@vis.gl/react-google-maps';
import { ROUTE_HEX, type Route, type RouteColor } from '../lib/routes';

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
    if (hasPoints) map.fitBounds(bounds, 32);
  }, [map, routes]);

  return null;
}

export default function RoutesMap({ routes, apiKey }: RoutesMapProps) {
  const [active, setActive] = useState<Set<RouteColor>>(() => new Set(ALL_COLORS));
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

      <div className="routes-detail">
        {selected ? (
          <>
            <h2 className="text-2xl font-ropa leading-none">{selected.name}</h2>
            <p>
              {COLOR_LABEL[selected.color]} · {selected.distance} miles
            </p>
            <p>Café stop: {selected.cafeStop}</p>
            <a className="btn" href={selected.gpxUrl} download>
              Download GPX
            </a>
          </>
        ) : (
          <p>
            {routes.length === 0
              ? 'No routes published yet.'
              : 'Click a route to see details.'}
          </p>
        )}
      </div>
    </div>
  );

  if (!apiKey) {
    return (
      <div className="routes-layout">
        {panel}
        <div className="routes-map-fallback">
          <p>Map unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="routes-layout">
      {panel}
      <div className="routes-map">
        <APIProvider apiKey={apiKey}>
          <Map
            mapId="scc-routes"
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
