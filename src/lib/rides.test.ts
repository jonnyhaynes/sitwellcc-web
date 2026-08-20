import { assignRideImages } from './rides';
import type { Ride, RideColor } from './rides';
import type { ImageWithAlt, RideImage } from './sanity';

// Minimal Ride factory — only the fields assignRideImages reads matter.
let seq = 0;
function ride(color: RideColor, overrides: Partial<Ride> = {}): Ride {
  seq += 1;
  return {
    id: overrides.id ?? `ride-${seq}`,
    title: overrides.title ?? `${color} ride`,
    startTime: overrides.startTime ?? '2026-08-22T08:00:00.000Z',
    url: overrides.url ?? 'https://example.test',
    color,
    image: null,
    goingCount: overrides.goingCount ?? null,
  };
}

// A bank image tagged with the given colours. The `alt` doubles as an identity
// tag so tests can assert which image landed where.
function bankImage(id: string, colours: RideColor[]): RideImage {
  return {
    image: { _type: 'image', alt: id, asset: { _ref: id, _type: 'reference' } } as unknown as ImageWithAlt,
    colours,
  };
}

const altOf = (r: Ride) => r.image?.alt ?? null;

describe('assignRideImages', () => {
  it('gives surplus rides a null image when a colour runs out', () => {
    const rides = [
      ride('red', { id: 'a' }),
      ride('red', { id: 'b' }),
      ride('red', { id: 'c' }),
    ];
    const bank = [bankImage('red-1', ['red'])];

    const result = assignRideImages(rides, bank);
    const withImage = result.filter((r) => r.image !== null);
    const withoutImage = result.filter((r) => r.image === null);

    expect(withImage).toHaveLength(1);
    expect(withoutImage).toHaveLength(2);
  });

  it('never repeats an image within a colour on one render', () => {
    const rides = [
      ride('red', { id: 'a' }),
      ride('red', { id: 'b' }),
    ];
    const bank = [bankImage('red-1', ['red']), bankImage('red-2', ['red'])];

    const alts = assignRideImages(rides, bank).map(altOf);

    expect(alts).toContain('red-1');
    expect(alts).toContain('red-2');
    expect(new Set(alts).size).toBe(2);
  });

  it('is stable: same ride id + same bank yields the same image', () => {
    const bank = [
      bankImage('red-1', ['red']),
      bankImage('red-2', ['red']),
      bankImage('red-3', ['red']),
    ];
    const rides = [ride('red', { id: 'stable-ride' })];

    const first = assignRideImages(rides, bank);
    const second = assignRideImages(rides, bank);

    expect(altOf(first[0])).toBe(altOf(second[0]));
  });

  it('only draws from images tagged with the ride colour', () => {
    const rides = [ride('brown', { id: 'offroad-ride' })];
    const bank = [
      bankImage('red-1', ['red']),
      bankImage('offroad-1', ['brown']),
      bankImage('green-1', ['green']),
    ];

    const result = assignRideImages(rides, bank);

    expect(altOf(result[0])).toBe('offroad-1');
  });

  it('gives every ride a null image when the bank is empty', () => {
    const rides = [ride('red'), ride('green'), ride('brown')];

    const result = assignRideImages(rides, []);

    expect(result.every((r) => r.image === null)).toBe(true);
  });

  it('lets a multi-colour image serve rides of either colour', () => {
    const shared = bankImage('shared', ['red', 'blue']);
    const redResult = assignRideImages([ride('red', { id: 'r' })], [shared]);
    const blueResult = assignRideImages([ride('blue', { id: 'b' })], [shared]);

    expect(altOf(redResult[0])).toBe('shared');
    expect(altOf(blueResult[0])).toBe('shared');
  });

  it('preserves the input order of rides', () => {
    const rides = [
      ride('red', { id: 'first', startTime: '2026-08-22T10:00:00.000Z' }),
      ride('red', { id: 'second', startTime: '2026-08-22T08:00:00.000Z' }),
    ];
    const bank = [bankImage('red-1', ['red']), bankImage('red-2', ['red'])];

    const result = assignRideImages(rides, bank);

    // Same objects, same order — assignment reorders internally only.
    expect(result.map((r) => r.id)).toEqual(['first', 'second']);
  });
});
