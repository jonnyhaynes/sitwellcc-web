# Plan: drive the `/rides` header + meta from Sanity

## Problem

Editing the rides intro copy in Sanity Studio has no effect on the live site.
`/rides` is the one content page that was **not** included in the web#66
page-header/meta migration: `src/pages/rides.astro` renders its title, subtitle
and intro as hard-coded HTML (`rides.astro:198-204`) and never imports
`../lib/sanity` or calls `getPage`. It also sets its `<Layout>` title/description
as literal strings rather than from the `page` doc's `seo`.

Result: an author publishes intro changes in Studio, the webhook fires, the site
rebuilds successfully — and nothing changes, because the page doesn't read Sanity.
This has already caused real confusion.

## Goal

Bring `/rides` in line with the other 10 CMS-driven pages (`index, membership,
charity, about, kit, races, contact, coaching, news, brand`): its header
(title/subtitle/intro) and SEO meta come from the `page` doc with slug `rides`,
falling back to the current hard-coded values when no doc exists.

## Non-goals

- **No change to ride event data.** The ride listings still come from Ticket
  Tailor + the Apollo events API via `getUpcomingRides()`. Untouched.
- **No change to the four ride-category cards** (green/amber/red/off-road) or the
  20 "top tips" accordion. Those stay hard-coded in `rides.astro` for now.
- **No API/schema change.** The existing `page` schema (title, subtitle, intro,
  seo) already covers the rides header. A `rides` doc just needs authoring in
  Studio (separate repo, done by an editor — see "Content" below).

## Approach

`/rides` currently hand-rolls its header instead of using the shared
`PageHeader` component. We adopt the exact pattern `coaching.astro` uses.

### 1. `src/pages/rides.astro`

- Add imports: `PageHeader` from `../components/PageHeader.astro`, and `getPage`
  from `../lib/sanity` (alongside the existing rides import).
- After the existing `const rides = await getUpcomingRides();`, add
  `const page = await getPage('rides');`.
  - Note: `/rides` is already SSR (`prerender = false`), so this fetch runs at
    request time and content updates go live within the existing 60s edge cache
    window — no rebuild needed once the doc exists. (Nicer than the static pages,
    which need a deploy to pick up Sanity changes.)
- Drive `<Layout>` meta from the doc with the current strings as fallback:
  - `title={page?.seo?.metaTitle ?? 'Club rides // Sitwell Cycling Club'}`
  - `description={page?.seo?.metaDescription ?? "We're here for the smiles, not the miles."}`
- Replace the hard-coded header `<section class="title">…</section>`
  (`rides.astro:198-204`) with:

  ```astro
  <PageHeader
    page={page}
    title="Club rides"
    subtitle="We're here for the smiles, not the miles."
  >
    <p class="lg:w-3/4">
      Ten social rides a week on Wednesday evenings, and Saturday and Sunday
      mornings. … (the existing intro paragraph, verbatim, as the default slot)
    </p>
  </PageHeader>
  ```

  `PageHeader` renders the CMS title/subtitle/intro when the `rides` doc exists,
  and falls back to these props + the slotted `<p>` when it doesn't — so the page
  is unchanged visually until the doc is authored.

- Leave the `<script type="application/ld+json">`, the SVG `<symbol>` sprite, the
  ride-category cards section, the `Upcoming rides` list and the tips accordion
  exactly as they are.

### 2. No other code changes

`getPage`, the `Page` type, `PageHeader`, and `PortableTextContent` already exist
and are used by 10 pages. Nothing to add there.

## Content (Studio)

A `page` doc with slug `rides` **already exists** in Sanity with title, subtitle
and intro authored (this is the doc whose intro edit — "Ten" → "Nine social rides
a week" — prompted this work; it was invisible only because the page didn't read
Sanity). Both inline intro links (the S60 4HY map link and The Sitwell Arms link)
are correctly recreated as Portable Text annotations. So once this code ships the
CMS content drives the page immediately — no further authoring required.

The hard-coded props/slot remain as a safe fallback for the no-doc case.

## Verification

- `npm run astro check` passes (types clean).
- `npm test` passes (no logic touched, but confirm nothing broke).
- Manual smoke test (done, `astro dev` + curl against live Sanity):
  - The existing `rides` doc drives the H1 ("Club Rides") and the intro renders
    the authored copy ("Nine social rides a week…") inside `.wysiwyg`, i.e. the
    CMS Portable Text path — not the fallback slot.
  - Both intro links (S60 4HY map, The Sitwell Arms) render correctly.
  - `<title>` falls back to the hard-coded string (the doc's seo.metaTitle is
    unset), confirming the fallback chain works.
  - Ride listings, the four category cards, and the tips accordion unaffected.

## Risk

Low. The pattern is established across 10 pages; `PageHeader`'s fallback design
means shipping the code before the doc exists is safe. The only page-specific
wrinkle is the intro's inline links, handled at authoring time via Portable Text
annotations.

## Rollout

Standard: branch off `main`, PR titled `[ai-assisted]`, reference this plan, human
reviews the diff and merges (merge auto-deploys to Vercel prod).
