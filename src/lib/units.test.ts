import {
  metersToMiles,
  metersToKm,
  feetToMeters,
  formatDistance,
  formatElevation,
} from './units';

describe('conversions', () => {
  it('converts metres to miles', () => {
    expect(metersToMiles(1609.344)).toBeCloseTo(1, 6);
  });
  it('converts metres to km', () => {
    expect(metersToKm(2500)).toBe(2.5);
  });
  it('converts feet to metres', () => {
    expect(feetToMeters(328.084)).toBeCloseTo(100, 2);
  });
});

describe('formatDistance', () => {
  it('formats miles to one decimal', () => {
    // ~78,000 m ≈ 48.5 miles
    expect(formatDistance(78_000, 'mi')).toBe('48.5 miles');
  });
  it('formats km to one decimal', () => {
    expect(formatDistance(78_000, 'km')).toBe('78.0 km');
  });
});

describe('formatElevation', () => {
  // Input is feet (the stored unit).
  it('passes feet through with a thousands separator', () => {
    expect(formatElevation(1772, 'ft')).toBe('1,772 ft');
  });
  it('converts feet to metres for the metric option', () => {
    // 1772 ft ÷ 3.28084 ≈ 540 m
    expect(formatElevation(1772, 'm')).toBe('540 m');
  });
  it('renders an em dash for null', () => {
    expect(formatElevation(null, 'm')).toBe('—');
    expect(formatElevation(null, 'ft')).toBe('—');
  });
});
