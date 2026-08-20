// The club's member count, scraped weekly from British Cycling into
// src/data/member-count.json (see docs/plans/member-count-scrape.md). These
// helpers turn the raw count into the footer's display figure. Pure and
// side-effect-free so they unit-test cleanly.

// The stat box has always shown a vague, round-ish figure ("200+"), not an exact
// headcount. We keep that feel by rounding the real number DOWN to the nearest 25
// and suffixing "+": 180 -> "175+". Rounding down never over-claims.
const ROUND_TO = 25;

// Round the raw count down to the nearest 25. Guards against a nonsensical count
// (negative or below the rounding step) by returning 0, which the caller treats
// as "no usable number" and falls back to the original stat image.
export function roundedMembers(count: number): number {
  if (!Number.isFinite(count) || count < ROUND_TO) return 0;
  return Math.floor(count / ROUND_TO) * ROUND_TO;
}

// The footer label, e.g. "175+". Returns null when the count isn't usable, so the
// footer can fall back to the built-in stat image rather than render "0+".
export function memberCountLabel(count: number): string | null {
  const rounded = roundedMembers(count);
  return rounded > 0 ? `${rounded}+` : null;
}
