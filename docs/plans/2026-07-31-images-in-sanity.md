# Images in Sanity — plan

**Status:** plan, awaiting approval
**Date:** 2026-07-31
**Slug:** images-in-sanity
**Spans two repos:** website (`~/Projects/react/sitwellcc`) + Studio (`~/Projects/node/sitwellcc-api`)

The client has asked that **all images be managed via Sanity**. Team photos, news
`mainImage`, and Portable Text images already are. This plan covers the rest, and
extends the `page` document type introduced in
[`2026-07-18-page-header-cms.md`](./2026-07-18-page-header-cms.md) — which already
named "per-page hero image" as the intended next slice.

## What "all images" actually means here

An audit of every image reference in `src/` and every file in `public/` found ~180
image files. They are not one problem — they fall into four groups that need
different treatment, and the split matters more than the total:

| Group | Examples | In scope? |
|---|---|---|
| **Galleries** — loose photos in a grid, no per-photo copy | coaching ×12, membership ×12, brand mood shots ×7, charity body photo | **Yes** — cleanest possible case |
| **Card items** — a photo bound to its own heading/copy/link | homepage promos ×4, ride grades ×4, the Ranskill event card, kit items ×4 | **Yes**, with a caveat (below) |
| **Chrome** — brand marks and UI furniture | crest, logotype, stripes, favicons, stat badges, social/PDF icons, BC + EPiC logos | **No** — see push-back |
| **Orphans** — files nothing references | 28 files, verified 0 references | **No** — delete, don't migrate |

### Correction: there are no hero images

An earlier reading of the audit labelled `charity.astro:18` and `races.astro:19` as
"hero images". They are not. `charity` is a 1200×572 photo mid-body; `races` is a
285×285 tile inside a card. **No page on the site has a hero image**, so this plan
adds **no `heroImage` field** — that would be modelling a slot the design doesn't
have. Photos are placed by each page's own template.

### The caveat on card items (flagging, not deciding)

For galleries, "just the image" is a complete unit of content. For **cards it isn't**.
The homepage "Club rides" card is a photo *plus* an eyebrow, a heading, body copy and
a link. Giving an editor the photo but not the words means they can swap the picture
for something unrelated while the copy still describes the old one — and the
hand-written alt text from PR #68 goes stale silently.

So for card groups this plan models **the whole card item**, not just its image. That
is slightly more than "images in Sanity" as literally asked, and it's called out here
rather than smuggled in. The alternative — image-only fields on cards — is cheaper now
and worse later; if you'd rather sequence it that way, say so and Phases 2–4 shrink.

### Push-back: chrome stays in the repo

~35 files are brand marks and UI furniture: the crest, logotype, stripes, favicon
set, the four footer stat badges, social and PDF icons, and the British Cycling /
EPiC Kitemark logos. Recommendation: **leave these in `public/`.**

- They aren't editorial content — they're part of the design system, governed by the
  brand guidelines, at fixed dimensions with tight layout constraints.
- Several are SVG. Sanity's image pipeline doesn't transform SVG, so it would add a
  CMS round-trip and buy nothing.
- The favicon set and `site.webmanifest` must be static files at fixed paths.
- A wrong logo upload is a brand incident, and the Studio has no approval gate.

If the client specifically means "we want to swap the sponsor logos ourselves", note
that **every named sponsor logo is currently orphaned** — `aardvark-swift`,
`andy-bishop`, `expert-bike-repair` and `the-sitwell-arms` are referenced nowhere on
the site. That's a content gap to raise with them, not a CMS gap.

## Decisions (to lock with the requester)

| Decision | Choice | Rationale |
|---|---|---|
| Alt text | **Required, CMS-authored, per image** | A shared `imageWithAlt` type carries `alt` alongside the asset. Preserves the accessibility work in PR #68 — otherwise moving an image to Sanity loses its description. |
| Gallery model | **`gallery: [imageWithAlt]` on `page`**, ordered; the page template decides placement | Coaching and membership are the *same shape*: 4 photos → content block → 8 photos. One ordered array covers both, plus brand mood shots and the single charity photo. No new document type. |
| Card model | **Object-type arrays on `page`**, matched by a `key` field, **not array order** | Layout for these cards is bespoke and asymmetric (7/12 vs 5/12 widths, per-card text positioning). Keying by `rides`/`charity`/`races`/`coaching` means reordering in the Studio can't scramble the design. |
| Chrome | **Stays in `public/`** | See push-back above. |
| Rendering | **Static (build-time fetch)** | Same as team/routes/page-header. No new SSR. |
| Fallback | **Every slot keeps its current hard-coded image** until a Sanity asset exists | Same graceful-fallback pattern as the header work — nothing goes blank during content entry. |
| Format handling | **Sanity CDN `auto('format')` replaces hand-maintained `.jpg`/`.webp` pairs** | ~70 files are duplicate-format pairs maintained by hand, plus three `<picture>` blocks. The CDN negotiates webp/avif per browser, so these collapse to one `<img>`. |
| Studio version | **Sanity v2 syntax** | Studio is v2 (`part:` imports, plain object schemas). No `defineType`. |
| Events | **`event` document type**, replacing the hard-coded Ranskill card | Ranskill is one instance of a repeatable thing. Requires amending a `CLAUDE.md` scope boundary — flagged in A4. |
| Kit videos | **`kitItem` document type** with a `file` MP4 + poster image | The four clips total 3.2 MB; Sanity's asset CDN is adequate. Also fixes the missing `poster` attribute. See the kit section. |
| Rollout | **One plan, phased PRs** | Each phase is independently reviewable and mergeable behind the fallback. |

## Part A — Studio schema (`sitwellcc-api`)

### A1. New shared type `schemas/imageWithAlt.js`

```js
export default {
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    {
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe what is in the photo, for screen-reader users and when the ' +
        'image fails to load. e.g. "Club members sat around a cafe table". ' +
        'Do not start with "Image of" or "Photo of".',
      validation: (Rule) =>
        Rule.custom((alt, context) =>
          context.parent?.asset && !alt ? 'Alt text is required once an image is set' : true,
        ),
    },
  ],
}
```

> **Why `Rule.custom` and not `Rule.required()`.** A plain `required()` on a field
> nested inside an image fires even when the whole image field is left empty, so every
> optional image slot would show a permanent validation error. The custom rule only
> demands alt text **once an asset has been chosen**, which is the behaviour we
> actually want.

Register in `schemas/schema.js` alongside `blockContent` / `membership` in the object
types block.

### A2. Extend `schemas/page.js`

Added fields (existing `title` / `subtitle` / `intro` / `slug` / `seo` untouched):

```js
{
  name: 'gallery',
  title: 'Photos',
  type: 'array',
  of: [{type: 'imageWithAlt'}],
  description:
    'Photos for this page, in the order they appear. Each page places them in ' +
    'its own layout — on Coaching and Membership the first four sit above the ' +
    'main content and the rest below it.',
  options: {layout: 'grid'},
}
```

Plus a `socialImage` inside the existing `seo` object (see Phase 5).

### A3. Card object types

- `schemas/feature.js` — homepage promo card: `key` (radio list: `rides` /
  `charity` / `races` / `coaching`), `image` (`imageWithAlt`), `eyebrow`,
  `heading`, `body`, `linkHref`, `linkLabel`.
- `schemas/rideGrade.js` — `key` (radio: `green` / `amber` / `red` / `offroad`) and
  `image` (`imageWithAlt`).
### A4. `schemas/event.js` — reusable event card (document type)

The Ranskill card is one instance of a repeatable thing, so it's a document type, not
a one-off object. Fields derived from the existing markup (`races.astro:17–28`):

```js
{
  name: 'event', title: 'Event', type: 'document',
  fields: [
    {name: 'title',    type: 'string',       validation: (R) => R.required()},
    {name: 'category', type: 'string',       validation: (R) => R.required(),
     options: {list: [{title: 'Race', value: 'race'}, {title: 'Social', value: 'social'}],
               layout: 'radio'}},
    {name: 'date',     type: 'date',         validation: (R) => R.required()},
    {name: 'image',    type: 'imageWithAlt'},
    {name: 'summary',  type: 'text', rows: 3},
    {name: 'signOn',   type: 'string'},   // "Ulley Village Hall, S26 3YD"
    {name: 'fee',      type: 'string'},   // "£10" — string, not number: "Free"/"£10 otd"
    {name: 'entryUrl', type: 'url'},
    {name: 'colour',   type: 'string',       // reuses the RIDE_CLASSES token set
     options: {list: ['green', 'amber', 'red', 'brown', 'blue', 'black'], layout: 'radio'}},
    {name: 'sanctioned', title: 'British Cycling sanctioned', type: 'boolean',
     description: 'Shows the British Cycling badge on the card.'},
  ],
}
```

Two deliberate improvements over the hard-coded card:

- **A real `date`, not the `month` string.** The current card hard-codes
  `<h3>October</h3>`. A date lets the site derive the month label *and* drop past
  events automatically. That matters: `races.astro:18` currently links to a **2025**
  Ranskill event, so the live page is already advertising a stale race. A date field
  makes that class of bug self-correcting.
- **`colour` reuses the existing token set** from `RIDE_CLASSES` in `src/lib/rides.ts`
  rather than inventing a second palette. Note the constraint documented at
  `src/lib/rides.ts:17-19`: Tailwind v4's scanner can't see interpolated class names,
  so the site must map the token through the existing literal `RIDE_CLASSES` lookup —
  never `bg-${colour}`.

> **Flagging a scope-boundary change.** `CLAUDE.md` says the site is "not the events
> source of truth — ride/race data comes from Ticket Tailor and the Apollo events
> API". Authoring events in Sanity changes that, so it needs saying out loud rather
> than slipping in.
>
> The case for doing it anyway: **neither feed can represent these races.**
> `getUpcomingRides()` filters hard to the current Mon–Sun window
> (`currentWeekBounds()`, `src/lib/rides.ts:106`), and both feeds model *weekly club
> rides* — Ticket Tailor bookings and Apollo/Discord signups. A club-hosted annual
> race promoted months ahead, with entry via British Cycling, has no home there.
> That's why it's hard-coded in the repo today.
>
> So this fills a genuine gap rather than duplicating a feed — but it does mean three
> event sources. **Recommend amending the boundary** to be precise: *"Weekly ride
> data comes from Ticket Tailor and the Apollo events API. Club-hosted events (races,
> socials) are authored in Sanity. The site is not the source of truth for the
> weekly ride feeds."* Approve that wording change alongside the plan.

## Part B — Website (`sitwellcc`)

### B1. `src/components/SanityImage.astro`

One renderer for every CMS image, so the `urlFor` + fallback + sizing logic exists
once:

```astro
---
interface Props {
  image?: ImageWithAlt | null;
  width: number; height?: number;
  fallbackSrc: string; fallbackAlt: string;
  class?: string; loading?: 'lazy' | 'eager';
}
---
```

- Builds `urlFor(image).width(w).height(h).auto('format').fit('crop').url()` —
  `fit('crop')` is what makes the `hotspot: true` already set on our image types
  actually take effect on square crops.
- Emits a `srcset` at 1x/2x via `.dpr(2)`, replacing the hand-rolled `@2x` files.
- Falls back to `fallbackSrc` / `fallbackAlt` when `image` is null, so a page renders
  identically before its content is authored.
- Keeps explicit `width`/`height` attributes — they prevent layout shift and the
  existing pages already set them.

### B2. `src/lib/sanity.ts`

- `export type ImageWithAlt = { asset: SanityImageSource; alt: string | null }`
- Extend `Page` with `gallery: ImageWithAlt[] | null` and the per-phase card arrays.
- Extend the `getPage` GROQ projection with `gallery`, `features`, `rideGrades`.
- New `getRaces()` for the `race` document type (Phase 4).

Unit-test the GROQ shape and null handling per phase in `src/lib/sanity.test.ts`,
following the existing `sanity.test.ts` / `routes.test.ts` patterns.

## Phases

Each phase is one PR. Ordering is by value-per-unit-of-risk: galleries first because
they're pure image swaps with no content modelling, cards after.

**Phase 1 — foundation + galleries.** `imageWithAlt`, `page.gallery`,
`SanityImage.astro`, `ImageWithAlt` type + GROQ. Wire the three pure galleries:
coaching (12), membership (12), charity (1). Both grids render
`gallery.slice(0, 4)` before the content block and `gallery.slice(4)` after —
matching the existing markup order exactly. *Done when:* all three pages are
pixel-identical with no `page` doc, and swap to Sanity photos once authored.

**Phase 2 — brand page photos.** Brand mood shots (7) and the three "in use" photos
(`club-kit`, `banner`, `badges`). Mood shots are CSS `background-image` with a
gradient overlay, so they consume the URL from `urlFor` directly rather than
`SanityImage.astro`. The downloadable logo ZIPs and PDFs stay static.

**Phase 3 — homepage promo cards.** `page` doc for slug `home` + `features` array.
Layout classes stay in the template, matched by `key`. *Note:* the current headings
contain deliberate non-breaking spaces (`We're here for the smiles, not&nbsp;the&nbsp;miles.`)
to control wrapping. Editors won't type those — either accept looser wrapping or add
a short description telling them to use the Studio's non-breaking-space entry.

**Phase 4 — ride grades.** `rideGrades` on the `rides` page doc (photo only;
distances, speeds and ride times stay hard-coded — flagged as the obvious next
extension, not built here). Colour tokens map through the existing `RIDE_CLASSES`
lookup.

**Phase 5 — events.** `event` document type + `getEvents()`, replacing the single
hard-coded Ranskill card with a reusable card component. Build-time filter drops
events whose `date` has passed. **Needs confirming:** the races page is static, so a
passed event lingers until the next deploy — same pre-existing condition as all the
`page` content. If there's no Sanity → Vercel deploy webhook configured, either add
one or opt this page into SSR like `/rides`. Tell me which and I'll fold it in.

**Phase 6 — kit.** `kitItem` document type (poster image + MP4 + label + order +
order URL), wired into `kit.astro` with the `poster` attribute the page currently
lacks.

**Phase 7 — Open Graph + cleanup.**
- **The site has no `og:image` and no Open Graph tags at all.** Add
  `seo.socialImage` (`imageWithAlt`) to `page`, and `og:` / `twitter:` tags to
  `Layout.astro` with a club-crest default. This is a real gap the client will hit
  the moment anyone shares a page.
- Delete the verified-orphan files (grepped for references across `src/`,
  `site.webmanifest` and `browserconfig.xml` — all returned zero): `firbeck`,
  `herringthorpe`, `kilo`, `white-rose`, `winter-series`, `hill-climb` (after Phase
  2), `david`, `jude`, `open`, `icon`, `chat.svg`, `retweet.svg`, `heart.svg`,
  `menu.svg`, `search.svg`, `go-race`, `ctt`, `bc-yorkshire`, `aardvark-swift`,
  `andy-bishop`, `expert-bike-repair`, `the-sitwell-arms`, and all 10 files in
  `public/img/kit/` — ~28 files counting format variants. Re-run the reference check
  at delete time rather than trusting this list.
- Delete the `.jpg`/`.webp` pairs superseded by CMS assets, and drop the three
  now-redundant `<picture>` blocks.

## The kit page is videos, not images — resolved

"Kit product shots" was scoped in on the assumption that `public/img/kit/*.png`
(jersey, bib-shorts, cap, gloves, gilet) were on the page. **They are not** —
`kit.astro:6–11` renders four `<video>` elements from `/video/*.mp4`, and all 10
files in `public/img/kit/` are orphaned.

**Decision: model a `kitItem` document type with a `file` field for the clip and an
`imageWithAlt` poster.**

An earlier draft of this plan cautioned that "Sanity's asset CDN is not a video CDN".
Measured, that caution doesn't hold at this scale — the four clips total **3.2 MB**
(404 KB–1.2 MB each). These are short, muted product spins, not long-form video.
Sanity's asset CDN serves files that size without strain.

Three things make this worth doing rather than deferring:

- **It fixes a real defect.** The `<video>` elements have no `poster` attribute
  (`kit.astro:35`), so the player shows an empty box until the clip loads. A
  CMS-managed poster image is both the fix and an image the client can manage —
  which is exactly what they asked for.
- **The range churns.** `gilet` and `gloves` exist as orphaned images from an earlier
  design; the live page has `socks` instead. That's direct evidence the kit line-up
  shifts, and today every shift needs a code change to the hard-coded `items` array.
- **It completes the page.** Kit already draws its header from Sanity; leaving the
  body hard-coded is the odd one out.

```js
{
  name: 'kitItem', title: 'Kit item', type: 'document',
  fields: [
    {name: 'label', type: 'string', validation: (R) => R.required()},   // "S/S Jersey"
    {name: 'order', type: 'number', description: 'Lower numbers appear first.'},
    {name: 'poster', title: 'Poster image', type: 'imageWithAlt',
     description: 'Shown before the clip plays. Use a still from the video.'},
    {name: 'video', type: 'file', options: {accept: 'video/mp4'},
     description:
       'A short, muted MP4 (H.264), ideally under 2 MB. Videos are served as ' +
       'uploaded — there is no transcoding, so compress before uploading.'},
    {name: 'orderUrl', type: 'url'},
  ],
}
```

**Constraint to accept knowingly:** no transcoding or adaptive bitrate. The field
description carries the upload guidance, but nothing enforces it — an editor *can*
upload a 50 MB clip and slow the page down. That's an acceptable trade at four items;
if the kit range grows past ~8 clips or anyone uploads something large, revisit with
Cloudflare Stream (poster image in Sanity, video ID pointing out).

## Sequencing / risk

- Every phase ships **schema + site code together**, behind the null-fallback, so
  content entry can lag safely and no page can go blank.
- No SSR added. No secrets. Static-by-default holds.
- Content entry is the long pole: ~55 photos to re-upload with alt text, plus four
  kit clips and their posters. It's page-by-page and can be staged after each phase
  merges.
- Scope drift to watch: Phases 3–6 model card *copy*, not just images. That's
  deliberate and argued above — challenge it at approval if you disagree.
- **One boundary change to approve:** the `CLAUDE.md` events wording (see A4).
- **One question to answer:** static vs SSR for the races page once events expire
  (see Phase 5).

## Out of scope (noted, not built)

- Full page **bodies** in the CMS — still bespoke layouts, still deferred.
- Dynamic `[slug]` routing from `page` docs — pages remain individual `.astro` files.
- Ride-grade *stats* (distance / speed / times) — photo only in Phase 4.
- `astro:assets` for the remaining static chrome — the Sanity CDN handles CMS images,
  and the chrome is mostly SVG, which `astro:assets` doesn't optimise either.
- Sponsor logos — every named sponsor logo is currently orphaned; that's a content
  question for the client first.
