import { roundedMembers, memberCountLabel } from './members';

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
