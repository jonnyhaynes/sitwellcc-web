import { surname } from './sanity';

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
