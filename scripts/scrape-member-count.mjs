// Scrape the club's member count from British Cycling and write it into
// src/data/stats.json. Run weekly by .github/workflows/member-count.yml; the
// workflow commits the changed file, which triggers a normal Vercel build.
//
// British Cycling sits behind Cloudflare's bot challenge, so a plain fetch gets
// a 403. We go through the Jina reader proxy (r.jina.ai), which *usually* renders
// the page for us — but the free proxy is intermittent: sometimes it returns the
// real page, sometimes Cloudflare's "Just a moment" challenge instead. That's an
// expected transient condition, not a bug in this script, so we:
//   - retry a few times, and
//   - if every attempt is blocked, exit 0 without writing (the site keeps the
//     last good number). Only a genuinely broken parse — the real page rendered
//     but the label is gone — is treated as a hard failure worth surfacing.
//
// The parse + plausibility guard live in src/lib/members.ts so they're shared
// with the site and unit-tested.
//
// Usage:
//   node scripts/scrape-member-count.mjs            # scrape and write if changed
//   node scripts/scrape-member-count.mjs --dry-run  # scrape and print, write nothing

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { extractMemberCount } from '../src/lib/members.ts';

const PROFILE_URL =
  'https://www.britishcycling.org.uk/club/profile/7596/sitwell-cycling-club';
const JINA_URL = `https://r.jina.ai/${PROFILE_URL}`;
const STATS_PATH = fileURLToPath(new URL('../src/data/stats.json', import.meta.url));

const dryRun = process.argv.includes('--dry-run');

const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 5000;

// Hard failure: non-zero exit + stderr. Reserved for "the page rendered but we
// still couldn't parse it" — i.e. the markup probably changed and someone should
// look. We exit before writing, so this never clobbers a good number.
function fail(message) {
  console.error(`scrape-member-count: ${message}`);
  process.exit(1);
}

// Soft skip: exit 0 without writing. Used when the proxy is blocked — a normal,
// expected outcome for the free tier. The site keeps the last good number.
function skip(message) {
  console.log(`scrape-member-count: ${message}`);
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Cloudflare's interstitial. If we got this, the proxy didn't render the real
// page — retry rather than trying to parse it.
const isChallenge = (html) => /just a moment|cf-mitigated|challenge-platform/i.test(html);

// Try the proxy up to MAX_ATTEMPTS times. Returns the count on success, or null
// if every attempt was blocked/failed. Throws only via fail() for a rendered-
// but-unparseable page.
async function scrapeCount() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let html = null;
    try {
      const res = await fetch(JINA_URL, {
        headers: { 'x-return-format': 'html', 'x-timeout': '30' },
      });
      if (res.ok) html = await res.text();
      else console.log(`attempt ${attempt}: proxy returned HTTP ${res.status}`);
    } catch (err) {
      console.log(`attempt ${attempt}: request failed (${err.message})`);
    }

    if (html && !isChallenge(html)) {
      const count = extractMemberCount(html);
      if (count !== null) return count;
      // Real page, no count: the markup changed. That's worth a hard failure.
      fail('the page rendered but no plausible member count was found — the markup may have changed');
    } else if (html) {
      console.log(`attempt ${attempt}: proxy returned a Cloudflare challenge`);
    }

    if (attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
  }
  return null;
}

const count = await scrapeCount();

if (count === null) {
  skip('proxy was blocked on every attempt; keeping the existing count.');
}

const stats = JSON.parse(readFileSync(STATS_PATH, 'utf8'));

if (stats.memberCount === count) {
  console.log(`member count unchanged (${count}); nothing to write.`);
  process.exit(0);
}

const previous = stats.memberCount;
stats.memberCount = count;
// A fixed-format UTC stamp (no Date parsing needed on read); lets us spot a
// stalled scraper by eye in the committed file.
stats.memberCountUpdated = new Date().toISOString();

if (dryRun) {
  console.log(`[dry run] would update member count ${previous} -> ${count}`);
  process.exit(0);
}

writeFileSync(STATS_PATH, `${JSON.stringify(stats, null, 2)}\n`);
console.log(`updated member count ${previous} -> ${count}`);
