# Plan: live member count in the footer stats box

## Goal

Replace the hard-coded "200+ members" stat in the footer with a real member
count scraped weekly from British Cycling, displayed as a rounded-down "N+"
figure (e.g. 180 → **"175+ members"**).

## Background / what we found

- The footer (`src/components/Footer.astro:11`) shows four stats, each a
  **baked-in SVG image** (`public/img/stat-1.svg` … `stat-4.svg`). Stat 2 is
  "200+ MEMBERS": a yellow box with green text, drawn as vector paths — there is
  no text to edit, so this stat is rebuilt as an inline SVG with a real `<text>`.
- The real number lives on the club's British Cycling profile
  (`https://www.britishcycling.org.uk/club/profile/7596/sitwell-cycling-club`)
  as the line **"Total club members: 180"**.
- That page sits behind **Cloudflare's bot challenge** (`cf-mitigated: challenge`).
  Direct `fetch`/`curl` — including a Vercel serverless function — gets a **403**.
  A real browser or a rendering proxy is required.
- The **Jina reader proxy** (`https://r.jina.ai/<url>`) renders the page and gets
  past Cloudflare. With `x-return-format: html` it returns the full page, and the
  count extracts cleanly with a regex. **This is the scrape mechanism.**
- This repo already runs a **daily GitHub Actions cron**
  (`.github/workflows/scheduled-rebuild.yml`) that POSTs a Vercel deploy hook.
  That is the established cron pattern here — the scraper fits alongside it.

## Decisions already taken

- **Display format:** round the count **down to the nearest 25** and suffix `+`.
  180 → "175+". Keeps the vague, marketing-friendly feel of "200+" while being
  honest and self-updating. (Rounding down never over-claims.)
- **No Sanity.** This number does not belong in the CMS — it's scraped, not
  authored, and no editor should hand-type it. It lives in a **committed data
  file in this repo**; the Footer reads it at build time.
- **Data flow:** weekly Action scrapes → writes the number to a repo file →
  commits it → the commit triggers a Vercel build (same as any push to `main`) →
  the Footer reads the file. Site stays static; no page becomes SSR; no CMS
  write token anywhere.

## Host decision

**GitHub Actions cron.** The repo already has a scheduled GitHub Action and the
secrets pattern for it; a second scheduled job is zero new infra and matches how
this project already works. A Vercel Cron would mean adding a serverless
function purely to run a scheduled task, cutting against "static by default".

## Where the number is stored

A committed data file: **`src/data/member-count.json`**

```json
{ "count": 180, "updated": "2026-08-24T05:30:00Z" }
```

- Checked into the repo, so it's the site's source of truth at build time, visible
  in git history, and works with zero external calls during the build.
- `count` is the **raw** scraped number; the rounding-to-25 happens at render time
  (so we can change the display rule without re-scraping).
- `updated` is an ISO timestamp — lets us spot a stalled scraper at a glance.
- Seeded with a real value (180) in the PR that introduces it, so the Footer shows
  a real number from day one — no empty-state gap before the first cron run.

Why a file, not the CMS: the count is machine-written weekly and site-wide (it's
in the footer on every page). A Sanity field would need a write token in CI and a
new Studio singleton for data no human edits — more moving parts for no gain. A
file keeps the whole thing inside this repo, and the commit *is* the deploy
trigger, so we don't even need the deploy-hook step.

## The scraper

New workflow: `.github/workflows/member-count.yml`

- **Schedule:** weekly. `cron: '30 5 * * 1'` (Mondays 05:30 UTC — off the hour,
  before the day's traffic, same rationale as the existing rebuild job).
- `workflow_dispatch:` too, so it can be run by hand from the Actions tab.
- Needs `contents: write` permission so the job can commit the updated file.
- Steps (a small Node script in `scripts/scrape-member-count.mjs`, run by the
  Action — keeps the logic testable and out of YAML):
  1. `GET https://r.jina.ai/https://www.britishcycling.org.uk/club/profile/7596/sitwell-cycling-club`
     with `x-return-format: html`, `x-timeout: 20`.
  2. Extract with `/Total club members[:\s]+(\d+)/i`. **Fail loudly** (non-zero
     exit, no write) if the pattern is missing or the number is implausible
     (e.g. `< 20` or `> 5000`) — a broken scrape must not overwrite a good number
     with garbage or zero.
  3. If the scraped number **equals** the one already in
     `src/data/member-count.json`, do nothing and exit (no commit, no build).
  4. Otherwise write `{ count, updated }` to the file.
  5. Commit the file back to `main` (bot identity, message like
     `chore: update member count to 180 [skip-ci-noise]`). The push triggers the
     normal Vercel production build, so the new number goes live.

### Secrets

- **None new.** The Action uses the built-in `GITHUB_TOKEN` to commit. No Sanity
  token, no deploy hook needed for this job (the commit is the trigger).

## The footer change

`src/components/Footer.astro`:

- Import the data file directly: `import memberData from '../data/member-count.json'`
  (build-time, static — no fetch). Astro/Vite resolve JSON imports natively.
- Replace the `stat-2.svg` `<img>` with an **inline `<svg>`** rendered by Astro,
  identical to the other stats' box (same `viewBox`, yellow `#FBDF08` rect, green
  `#109A49`, same `285×104`/`order-2` footprint) but with the number in a
  **`<text>` element** fed the live count. Because it's still an SVG it scales
  exactly like the three neighbouring image stats — no separate HTML box to
  pixel-match. Accessible name stays "N+ members" (`role="img"` +
  `<title>`/`aria-label`).
  - **Font:** the `<text>` uses **Ropa Sans Pro ExtraBold**, the site's display
    face — already self-hosted and loaded globally via `src/styles/fonts.css`,
    and exposed as the `--font-ropa-bold` CSS variable (`brand.astro` labels it
    the "Display" weight). Set on the SVG text as
    `font-family: 'Ropa Sans Pro ExtraBold', ui-sans-serif, sans-serif`. This is
    the real club font, so the number matches the neighbours' traced glyphs
    closely rather than being an eyeballed substitute. (The originals are traced
    paths with no font, so it won't be pixel-identical, but it's the same
    typeface.)
- **Rounding helper** (pure, unit-tested), e.g. `src/lib/members.ts`:
  `roundedMembers(n) => Math.floor(n / 25) * 25`, rendered as `"{value}+ members"`.
- **Fallback:** if the count is missing or implausible (shouldn't happen — the
  file is committed and validated — but belt and braces), fall back to the
  original `stat-2.svg` image so the footer never breaks.

### Visual-match risk (much reduced)

Rendering stat 2 as inline SVG (not an HTML box) means the **box** matches the
neighbours exactly — same file type, same scaling. The only open question is the
**font** of the number, since the originals are traced paths. Mitigation: pick a
close bold face, then a **manual smoke test** in the browser at mobile + desktop
widths (the stats reflow 2-col → 4-col) to confirm it sits right beside the
others. Fallback to the original image remains the escape hatch.

## Testing

- **Unit (Vitest):** `roundedMembers` boundaries — 175→175, 180→175, 199→175,
  200→200, 24→0, plus a guard for values `< 25`. And the extract-from-HTML regex
  against a saved fixture of the Jina output (store a trimmed fixture, not the
  whole 388 KB page).
- **Scraper script:** a `--dry-run` mode that scrapes and prints the number
  without writing the file, for manual verification.
- **`npm run astro check`** for types.
- **Manual smoke test:** footer renders correctly with a real number, and (by
  temporarily breaking the value) with the fallback image, at both breakpoints.

## Out of scope

- Turning stats 1, 3, 4 into text (they stay images).
- Live/on-request scraping — weekly is enough and avoids hammering Jina/BC.

## Rollout / risks

- **Bot commits to `main`:** the scraper commits weekly when the number changes.
  Minor commit noise, but auditable and it's what triggers the deploy. Acceptable
  for a rarely-changing weekly value.
- **Scrape breaks:** guarded by the plausibility check + "no match → no write";
  the committed file keeps the last good number. A stale `updated` timestamp in
  the file is the tell.
- **British Cycling changes the label/markup:** regex stops matching → no commit →
  stale-but-valid number. Caught by eyeballing `updated` occasionally.
- **Jina proxy availability / rate limits:** free third-party proxy. If it becomes
  unreliable, the committed file holds the last number and we revisit (self-hosted
  headless browser, or just hand-editing the file).
- **Terms:** reading a public club profile weekly via a rendering proxy. Low
  volume, public data. Flagged as a conscious choice.

## Sequence of PRs

1. **This repo:** `src/data/member-count.json` (seeded with 180) +
   `roundedMembers()` + Footer inline-SVG text stat with image fallback + unit
   tests. Ships showing the real number immediately.
2. **This repo:** `scripts/scrape-member-count.mjs` +
   `.github/workflows/member-count.yml`. First manual `workflow_dispatch` run
   confirms the scrape→commit→deploy loop works end to end.

Each PR is `[ai-assisted]`, references this doc, human-reviewed and human-merged.
