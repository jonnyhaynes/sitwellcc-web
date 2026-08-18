# Plan: move kit items onto the kit page doc

**Status:** draft — awaiting human approval before any code.

## Goal

Model the kit clips as an array on the `kit` **page** document, matched by
position like the Rides page's `rideGrades`, instead of as standalone `kitItem`
documents. Then seed the four existing clips (videos + labels) into it so the
Studio starts from the current kit, not an empty list.

## Why (and the trade-off, flagged not buried)

Requested to match how ride grades work: everything for a page in one place,
hidden from the other page forms. The **cost**, stated plainly:

- Kit is an *open, growable* list (add a gilet next season), unlike the fixed
  four ride grades. As a page array, adding/removing/reordering kit means editing
  the page doc's array rather than creating a document.
- Each item loses its own Studio entry, preview and edit history.

No `kitItem` documents exist in `production` yet (checked), so nothing is lost in
the switch — this is a clean cutover, not a migration.

## Load-bearing note

This changes a document type the site queries. The Studio schema change and the
website read change **must ship together**: if the schema flips to an array but
`getKitItems()` still queries `*[_type == "kitItem"]`, `/kit` silently falls back
to the built-in clips — it looks fine while the CMS content is dead. Coordinate
the two repos' merges.

## Changes

### Studio repo (`~/Projects/node/sitwellcc-api`)

1. **`schemas/kitItem.js`** — change `type: 'document'` → `type: 'object'`.
   Remove the `order` field (array position now orders, as on rides). Keep
   `label`, `poster`, `video`, `orderUrl`. Keep the preview.
2. **`schemas/page.js`** — add a `kitItems` array field, `of: [{type: 'kitItem'}]`,
   `hidden` unless `slug.current === 'kit'`, mirroring `rideGrades`.
3. **`schemas/schema.js`** — drop `kitItem` from the `types.concat([...])` document
   list (it is now an inline object, not a top-level document). Keep the `import`
   only if `page.js` resolves the type by import; on Sanity v2 the `of: [{type:
   'kitItem'}]` string reference resolves from the registered types, so `kitItem`
   must stay registered as a **type** but not appear in the desk as a document.
   Confirm during implementation which registration v2 needs — this is the one
   uncertain step.
4. Deploy: `npx sanity deploy`.

### Website repo (`~/Projects/react/sitwellcc`)

5. **`src/lib/sanity.ts`** — rewrite `getKitItems()` to read the array off the kit
   page doc instead of querying a document type:
   ```
   *[_type == "page" && slug.current == "kit"][0].kitItems[]{
     label, poster, "videoUrl": video.asset->url, orderUrl
   }
   ```
   Return `[]` when absent so the existing fallback still works. Drop `_id` from
   `KitItem` (array items have no stable doc id; use the label or index as React
   key if one is needed — the current markup keys by nothing, so no change).
6. **`src/pages/kit.astro`** — no logic change needed: it already calls
   `getKitItems()` and filters to items with a `videoUrl`. Verify it still type-checks
   after the `KitItem._id` removal.

### Seeding

7. **`scripts/seed-kit-items.js`** (Studio repo) — upload the four MP4s from the
   web repo's `public/video/` (`jersey`, `bib-shorts`, `cap`, `socks`), build a
   `kitItems` array (label + `video` file asset ref, no poster — none exist yet),
   and patch it onto the published kit page doc. Idempotent, needs
   `SANITY_WRITE_TOKEN`. Same shape as `seed-ride-grades.js`.

   Labels/order from `FALLBACK_ITEMS` in `kit.astro`:
   `S/S Jersey` (jersey.mp4), `Bib Shorts` (bib-shorts.mp4), `Cap` (cap.mp4),
   `Socks` (socks.mp4).

## Verification

1. `npm run astro check` in the website repo — types pass after the `KitItem` change.
2. Studio: open Kit page → **Kit items** array shows 4 clips; kit is no longer a
   top-level document type in the desk.
3. Site smoke test: `npm run dev` → `/kit` plays the four clips from Sanity (not
   the fallback). Confirm by checking the video `src` is a `cdn.sanity.io` URL.

## Blast radius

- `/kit` is static (build-time fetch), so a bad deploy shows stale/fallback clips,
  not an error. Low risk.
- Two repos, coordinated merge. Website repo follows its plan-first + human-review
  + `[ai-assisted]` PR process. Studio repo committed on its working branch.

## Out of scope

- Poster images (none exist; the player shows the first frame). Add later if wanted.
- The orphaned `public/img/kit/*.png` stills — already handled by the
  delete-orphaned-assets work; not touched here.
