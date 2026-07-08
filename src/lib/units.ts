// Unit conversion and display formatting for route distance and elevation.
// Distance source values are metres; elevation source values are feet (matching
// the Sanity elevation field). These helpers convert to the user's chosen
// display unit. Pure and side-effect-free so they unit-test cleanly and can be
// shared between components.

export type DistanceUnit = 'mi' | 'km';
export type ElevationUnit = 'm' | 'ft';

const METERS_PER_MILE = 1609.344;
const FEET_PER_METER = 3.28084;

export const metersToMiles = (m: number): number => m / METERS_PER_MILE;
export const metersToKm = (m: number): number => m / 1000;
export const feetToMeters = (ft: number): number => ft / FEET_PER_METER;

// Distances read as one decimal place ("48.7 miles") — the tenth is meaningful
// at ride scale and matches how cyclists quote routes.
export function formatDistance(meters: number, unit: DistanceUnit): string {
  if (unit === 'km') {
    return `${metersToKm(meters).toFixed(1)} km`;
  }
  return `${metersToMiles(meters).toFixed(1)} miles`;
}

// Elevation is stored and passed in as feet (matching the Sanity field), so
// "ft" is the pass-through unit and "m" converts feet→metres. Reads as a whole
// number with a thousands separator ("1,772 ft"). A null gain (no elevation
// data) renders as an em dash.
export function formatElevation(feet: number | null, unit: ElevationUnit): string {
  if (feet === null) return '—';
  const value = unit === 'm' ? feetToMeters(feet) : feet;
  return `${Math.round(value).toLocaleString('en-GB')} ${unit}`;
}
