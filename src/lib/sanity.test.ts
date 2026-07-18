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

import { surname, getPage } from './sanity';

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
      seo: { metaTitle: null, metaDescription: null },
    };
    resolved.mockResolvedValue(page);
    await expect(getPage('coaching')).resolves.toEqual(page);
  });

  it('returns null when no page doc exists yet (fallback path)', async () => {
    resolved.mockResolvedValue(null);
    await expect(getPage('coaching')).resolves.toBeNull();
  });
});
