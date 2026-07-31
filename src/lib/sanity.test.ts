import { vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// getPage/getTeamMembers live in ./sanity, so we can't mock ./sanity itself.
// Instead stub the Sanity SDK the module builds its client from, so the real
// functions run against a fake fetch. imageUrlBuilder is stubbed to a no-op so
// the module loads without a real client.
// vi.mock is hoisted above top-level consts, so the shared fetch mock must be
// created via vi.hoisted to be in scope inside the factory.
const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));
vi.mock('@sanity/client', () => ({
  createClient: () => ({ fetch: fetchMock }),
}));
vi.mock('@sanity/image-url', () => ({
  default: () => ({ image: () => ({ url: () => '' }) }),
}));

import { surname, getPage, featureFor, rideGradeImageFor, getKitItems } from './sanity';
import type { Feature, Page, RideGrade } from './sanity';

describe('surname', () => {
  it('returns the last word of a two-part name', () => {
    expect(surname('Jude Daly')).toBe('Daly');
  });
  it('returns the last word of a multi-part name', () => {
    expect(surname('Janice Anne McWilliam')).toBe('McWilliam');
  });
  it('collapses extra whitespace between parts', () => {
    expect(surname('Ted   Daly')).toBe('Daly');
  });
  it('trims leading and trailing whitespace', () => {
    expect(surname('  Phil Smith  ')).toBe('Smith');
  });
  it('falls back to the whole name when there is no space', () => {
    expect(surname('Cher')).toBe('Cher');
  });
  it('sorts a list by surname', () => {
    const names = ['Jonny Haynes', 'Erin Avill', 'Ted Daly'];
    const sorted = [...names].sort((a, b) => surname(a).localeCompare(surname(b)));
    expect(sorted).toEqual(['Erin Avill', 'Ted Daly', 'Jonny Haynes']);
  });
});

describe('getPage', () => {
  const resolved = fetchMock as unknown as Mock<() => Promise<unknown>>;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('queries the page doc for the given slug', async () => {
    resolved.mockResolvedValue(null);
    await getPage('coaching');
    const [query, params] = fetchMock.mock.calls[0];
    expect(query).toContain('_type == "page"');
    expect(query).toContain('slug.current == $slug');
    expect(params).toEqual({ slug: 'coaching' });
  });

  it('returns the page when one exists', async () => {
    const page = {
      title: 'Go-Ride coaching',
      subtitle: "We're coaching the next generation.",
      intro: [{ _type: 'block', children: [] }],
      gallery: null,
      features: null,
      rideGrades: null,
      seo: { metaTitle: null, metaDescription: null },
    };
    resolved.mockResolvedValue(page);
    await expect(getPage('coaching')).resolves.toEqual(page);
  });

  it('returns null when no page doc exists yet (fallback path)', async () => {
    resolved.mockResolvedValue(null);
    await expect(getPage('coaching')).resolves.toBeNull();
  });

  it('requests the gallery field so pages can render CMS photos', async () => {
    resolved.mockResolvedValue(null);
    await getPage('membership');
    const [query] = fetchMock.mock.calls[0];
    expect(query).toContain('gallery');
  });

  it('returns gallery entries with their alt text', async () => {
    const gallery = [
      { _key: 'a', asset: { _ref: 'image-abc-285x285-webp' }, alt: 'Members at a cafe' },
      { _key: 'b', asset: { _ref: 'image-def-285x285-webp' }, alt: null },
    ];
    resolved.mockResolvedValue({
      title: 'Membership',
      subtitle: null,
      intro: null,
      gallery,
      features: null,
      rideGrades: null,
      seo: null,
    });
    const page = await getPage('membership');
    expect(page?.gallery).toHaveLength(2);
    expect(page?.gallery?.[0].alt).toBe('Members at a cafe');
    expect(page?.gallery?.[1].alt).toBeNull();
  });
});

describe('featureFor', () => {
  const feature = (key: Feature['key']): Feature => ({
    key,
    image: null,
    eyebrow: `${key} eyebrow`,
    heading: null,
    body: null,
    linkHref: null,
    linkLabel: null,
  });

  const pageWith = (features: Feature[] | null): Page => ({
    title: 'Home',
    subtitle: null,
    intro: null,
    gallery: null,
    features,
    rideGrades: null,
    seo: null,
  });

  it('returns null when no page doc is authored', () => {
    expect(featureFor(null, 'rides')).toBeNull();
  });

  it('returns null when the page has no features', () => {
    expect(featureFor(pageWith(null), 'rides')).toBeNull();
  });

  it('returns null when that particular card is missing', () => {
    expect(featureFor(pageWith([feature('charity')]), 'rides')).toBeNull();
  });

  it('finds a card by key', () => {
    const page = pageWith([feature('charity'), feature('rides')]);
    expect(featureFor(page, 'rides')?.eyebrow).toBe('rides eyebrow');
  });

  // The whole point of keying rather than indexing: the design must not depend on
  // the order an editor happens to leave the array in.
  it('is unaffected by the order of the array', () => {
    const forwards = pageWith([feature('rides'), feature('races')]);
    const backwards = pageWith([feature('races'), feature('rides')]);
    expect(featureFor(forwards, 'races')?.eyebrow).toBe(
      featureFor(backwards, 'races')?.eyebrow,
    );
  });
});

// The 4-above / 8-below split that Coaching and Membership share. The pages map
// fallback filenames onto gallery indices, so this guards the arithmetic that
// decides which photo lands in which slot.
describe('gallery slot mapping', () => {
  const ABOVE = ['one', 'seven', 'eight', 'two'];
  const BELOW = ['nine', 'three', 'five', 'four', 'six', 'ten', 'eleven', 'twelve'];

  const slots = (gallery: unknown[]) => ({
    above: ABOVE.map((name, i) => ({ image: gallery[i] ?? null, name })),
    below: BELOW.map((name, i) => ({ image: gallery[ABOVE.length + i] ?? null, name })),
  });

  it('leaves every slot null when no gallery is authored', () => {
    const { above, below } = slots([]);
    expect(above.every((s) => s.image === null)).toBe(true);
    expect(below.every((s) => s.image === null)).toBe(true);
  });

  it('fills the first four slots then the rest in order', () => {
    const gallery = Array.from({ length: 12 }, (_, i) => `photo-${i}`);
    const { above, below } = slots(gallery);
    expect(above.map((s) => s.image)).toEqual(['photo-0', 'photo-1', 'photo-2', 'photo-3']);
    expect(below[0].image).toBe('photo-4');
    expect(below[7].image).toBe('photo-11');
  });

  it('keeps the slot count fixed when fewer photos are authored', () => {
    const { above, below } = slots(['photo-0', 'photo-1']);
    expect(above).toHaveLength(4);
    expect(below).toHaveLength(8);
    expect(above[2].image).toBeNull();
    expect(below[0].image).toBeNull();
  });

  it('ignores extra photos beyond the twelve slots', () => {
    const gallery = Array.from({ length: 20 }, (_, i) => `photo-${i}`);
    const { above, below } = slots(gallery);
    expect(above.length + below.length).toBe(12);
    expect(below[7].image).toBe('photo-11');
  });
});

describe('rideGradeImageFor', () => {
  const grade = (key: RideGrade['key'], alt: string | null): RideGrade => ({
    key,
    image: { asset: { _ref: `image-${key}` }, alt } as RideGrade['image'],
  });

  const pageWith = (rideGrades: RideGrade[] | null): Page => ({
    title: 'Rides',
    subtitle: null,
    intro: null,
    gallery: null,
    features: null,
    rideGrades,
    seo: null,
  });

  it('returns null when no page doc is authored', () => {
    expect(rideGradeImageFor(null, 'green')).toBeNull();
  });

  it('returns null when the page has no ride grades', () => {
    expect(rideGradeImageFor(pageWith(null), 'green')).toBeNull();
  });

  it('returns null when that grade has no entry', () => {
    expect(rideGradeImageFor(pageWith([grade('red', 'a peloton')]), 'green')).toBeNull();
  });

  it('returns null when the grade exists but its photo is empty', () => {
    const empty: RideGrade = { key: 'green', image: null };
    expect(rideGradeImageFor(pageWith([empty]), 'green')).toBeNull();
  });

  it('finds a grade photo by key', () => {
    const page = pageWith([grade('red', 'a peloton'), grade('green', 'a cafe table')]);
    expect(rideGradeImageFor(page, 'green')?.alt).toBe('a cafe table');
  });

  // Guards the reason for keying: an editor reordering the array in the Studio
  // must not move a photo onto a different grade's card.
  it('is unaffected by the order of the array', () => {
    const forwards = pageWith([grade('green', 'green photo'), grade('offroad', 'mtb')]);
    const backwards = pageWith([grade('offroad', 'mtb'), grade('green', 'green photo')]);
    expect(rideGradeImageFor(forwards, 'offroad')?.alt).toBe(
      rideGradeImageFor(backwards, 'offroad')?.alt,
    );
  });
});

describe('getKitItems', () => {
  const resolved = fetchMock as unknown as Mock<() => Promise<unknown>>;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('resolves the video file asset to a URL', async () => {
    resolved.mockResolvedValue([]);
    await getKitItems();
    const [query] = fetchMock.mock.calls[0];
    // Without the `->` dereference this returns an asset ref, not a playable URL.
    expect(query).toContain('video.asset->url');
  });

  it('orders by the editor order, then label as a tiebreak', async () => {
    resolved.mockResolvedValue([]);
    await getKitItems();
    const [query] = fetchMock.mock.calls[0];
    expect(query).toContain('order(order asc, label asc)');
  });

  it('returns an empty array when nothing is authored (fallback path)', async () => {
    resolved.mockResolvedValue([]);
    await expect(getKitItems()).resolves.toEqual([]);
  });

  it('passes through the poster and order link', async () => {
    resolved.mockResolvedValue([
      {
        _id: 'k1',
        label: 'S/S Jersey',
        poster: { asset: { _ref: 'image-jersey' }, alt: 'The club jersey' },
        videoUrl: 'https://cdn.sanity.io/files/x/production/jersey.mp4',
        orderUrl: null,
      },
    ]);
    const items = await getKitItems();
    expect(items[0].poster?.alt).toBe('The club jersey');
    expect(items[0].videoUrl).toContain('.mp4');
    expect(items[0].orderUrl).toBeNull();
  });
});

// kit.astro only takes over from its built-in clips when an authored item actually
// has a video, so a half-finished doc can't blank the page.
describe('kit item fallback selection', () => {
  const pick = (authored: { videoUrl: string | null }[]) => {
    const withVideo = authored.filter((i) => i.videoUrl);
    return withVideo.length ? 'cms' : 'fallback';
  };

  it('uses the built-in clips when nothing is authored', () => {
    expect(pick([])).toBe('fallback');
  });

  it('uses the built-in clips when an authored item has no video yet', () => {
    expect(pick([{ videoUrl: null }])).toBe('fallback');
  });

  it('uses the CMS items once one has a video', () => {
    expect(pick([{ videoUrl: 'a.mp4' }, { videoUrl: null }])).toBe('cms');
  });
});
