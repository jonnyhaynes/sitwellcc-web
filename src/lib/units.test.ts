import {
  metersToMiles,
  metersToKm,
  metersToFeet,
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
  it('converts metres to feet', () => {
    expect(metersToFeet(100)).toBeCloseTo(328.084, 2);
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
  it('formats metres as a whole number', () => {
    expect(formatElevation(540, 'm')).toBe('540 m');
  });
  it('formats feet with a thousands separator', () => {
    expect(formatElevation(540, 'ft')).toBe('1,772 ft');
  });
  it('renders an em dash for null', () => {
    expect(formatElevation(null, 'm')).toBe('—');
    expect(formatElevation(null, 'ft')).toBe('—');
  });
});
