import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { roundedMembers, memberCountLabel, extractMemberCount } from './members';

describe('roundedMembers', () => {
  it('rounds down to the nearest 25', () => {
    expect(roundedMembers(180)).toBe(175);
    expect(roundedMembers(199)).toBe(175);
    expect(roundedMembers(200)).toBe(200);
    expect(roundedMembers(175)).toBe(175);
  });
  it('returns 0 for counts below the rounding step', () => {
    expect(roundedMembers(24)).toBe(0);
    expect(roundedMembers(0)).toBe(0);
  });
  it('returns 0 for nonsensical input', () => {
    expect(roundedMembers(-5)).toBe(0);
    expect(roundedMembers(NaN)).toBe(0);
    expect(roundedMembers(Infinity)).toBe(0);
  });
});

describe('memberCountLabel', () => {
  it('formats a usable count as "N+"', () => {
    expect(memberCountLabel(180)).toBe('175+');
    expect(memberCountLabel(200)).toBe('200+');
  });
  it('returns null when there is no usable number', () => {
    expect(memberCountLabel(10)).toBeNull();
    expect(memberCountLabel(NaN)).toBeNull();
  });
});

describe('extractMemberCount', () => {
  // A real snippet of the British Cycling profile page as delivered by the Jina
  // reader proxy, so the regex is tested against the actual markup (the number
  // is separated from the label by "</b> ").
  const fixture = readFileSync(
    fileURLToPath(new URL('./__fixtures__/bc-profile-snippet.html', import.meta.url)),
    'utf8',
  );

  it('pulls the count out of the real page markup', () => {
    expect(extractMemberCount(fixture)).toBe(180);
  });
  it('handles a plain colon-and-space form', () => {
    expect(extractMemberCount('Total club members: 342 more text')).toBe(342);
  });
  it('returns null when the label is absent', () => {
    expect(extractMemberCount('<p>nothing relevant here</p>')).toBeNull();
  });
  it('rejects an implausibly small number (likely a broken scrape)', () => {
    expect(extractMemberCount('Total club members: 0')).toBeNull();
  });
  it('rejects an implausibly large number', () => {
    expect(extractMemberCount('Total club members: 99999')).toBeNull();
  });
});
