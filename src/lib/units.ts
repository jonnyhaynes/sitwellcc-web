// Unit conversion and display formatting for route distance and elevation.
// Source values are always metres (as computed from the GPX); these helpers
// convert to the user's chosen display unit. Pure and side-effect-free so they
// unit-test cleanly and can be shared between components.

export type DistanceUnit = 'mi' | 'km';
export type ElevationUnit = 'm' | 'ft';

const METERS_PER_MILE = 1609.344;
const FEET_PER_METER = 3.280839895;

export const metersToMiles = (m: number): number => m / METERS_PER_MILE;
export const metersToKm = (m: number): number => m / 1000;
export const metersToFeet = (m: number): number => m * FEET_PER_METER;

// Distances read as one decimal place ("48.7 miles") — the tenth is meaningful
// at ride scale and matches how cyclists quote routes.
export function formatDistance(meters: number, unit: DistanceUnit): string {
  if (unit === 'km') {
    return `${metersToKm(meters).toFixed(1)} km`;
  }
  return `${metersToMiles(meters).toFixed(1)} miles`;
}

// Elevation reads as a whole number with a thousands separator ("1,772 ft").
// A null gain (GPX carried no elevation) renders as an em dash.
export function formatElevation(meters: number | null, unit: ElevationUnit): string {
  if (meters === null) return '—';
  const value = unit === 'ft' ? metersToFeet(meters) : meters;
  return `${Math.round(value).toLocaleString('en-GB')} ${unit}`;
}
