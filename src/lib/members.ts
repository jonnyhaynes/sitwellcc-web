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

// A sanity range for the scraped count. A broken scrape (wrong page, markup
// change, Cloudflare block leaking a "0") must never overwrite a good number, so
// the scraper rejects anything outside this band rather than trusting it.
export const MIN_PLAUSIBLE_MEMBERS = 20;
export const MAX_PLAUSIBLE_MEMBERS = 5000;

// Pull the club member count out of the British Cycling profile page HTML (as
// rendered by the Jina reader proxy — see scripts/scrape-member-count.mjs). The
// page shows the line "Total club members: 180". Returns the number only when it
// parses and is plausible; otherwise null, which the scraper treats as "don't
// write" rather than clobbering the stored value.
export function extractMemberCount(html: string): number | null {
  // The number is separated from the label by a colon, a closing tag and a
  // space in the real markup ("Total club members:</b> 180"), so skip over any
  // run of non-digit characters — tags, whitespace, punctuation — in between.
  const match = /Total club members\D{0,20}(\d{1,5})/i.exec(html);
  if (!match) return null;

  const count = Number(match[1]);
  if (count < MIN_PLAUSIBLE_MEMBERS || count > MAX_PLAUSIBLE_MEMBERS) return null;

  return count;
}
