# Plan: image bank for live rides on /rides

**Status:** draft — awaiting human approval before any code.

## Goal

The "Upcoming rides" list on `/rides` is driven by the Ticket Tailor + Apollo
(Discord) feeds. Discord rides currently show whatever thumbnail the feed carries
(or a plain colour box when there is none), which is inconsistent and outside the
club's control.

Replace that with a **club-curated image bank**: a list of photos authored in
Sanity, each tagged with one or more ride colours. Each ride on the page is
assigned one bank image matching its colour, deterministically and with **no
duplicate image within a colour** on a single render.

## Decisions (agreed in brainstorming)

- **Always use the bank.** The feed's own image is ignored entirely — every ride's
  image comes from the bank (or the fallback box). The `thumbnailUrl ?? imageUrl`
  read in `fetchApolloRides` becomes dead code and is removed.
- **Tagged by colour, multi-tag.** One bank; each image carries an array of
  colours. A red ride only ever draws a red-tagged image.
- **Not enough images → colour box.** If a colour has more rides than tagged
  images that render, the surplus rides get `image = null` and fall back to the
  plain coloured box already in the template. No duplicates, ever.
- **Stable per ride.** Each ride maps to an image deterministically (hashed from
  its `id`), so a ride keeps the same photo across renders/visits — no flicker on
  the 60s edge cache. Stability holds until the client edits the bank.

## Load-bearing note

This reads a new field on the `page` doc. The Studio schema change and the website
read change should ship together, but the **failure mode is safe**: if the site
queries `rideImages` before the schema exists (or before any are authored), the
query returns `[]`, every ride gets `null`, and the page shows colour boxes — the
current no-image look. Nothing breaks; images simply do not appear until authored.

## Scope: two repos

- **Studio** (`~/Projects/node/sitwellcc-api`) — new `rideImage` object type +
  `rideImages` field on the `page` doc. Its own plan doc + PR.
- **Site** (`~/Projects/react/sitwellcc`) — this plan.

## Changes (site repo)

### 1. `src/lib/sanity.ts` — read the bank

- New type:
  ```ts
  export type RideImage = { image: ImageWithAlt; colours: RideColor[] };
  ```
- Add `rideImages: RideImage[] | null` to the `Page` type.
- Add to the `getPage` GROQ projection:
  ```
  rideImages[]{ image, colours }
  ```
- **Colour remap:** the Studio stores `offroad` (to match the existing `rideGrade`
  field the client already knows); `RideColor` in `rides.ts` uses `brown`. Remap
  `offroad → brown` on read. Everywhere else the six values line up 1:1 with
  `RideColor`. Keep `rides.ts` untouched by the remap — do it in `sanity.ts`.

### 2. `src/lib/rides.ts` — assignment logic (pure, unit-tested)

New exported function, kept separate from `getUpcomingRides()` so fetch/merge and
image assignment stay independently testable:

```ts
export function assignRideImages(rides: Ride[], bank: RideImage[]): Ride[]
```

Algorithm:

1. Group the bank by colour into `Map<RideColor, ImageWithAlt[]>`.
2. Walk rides in a **stable order** (already sorted by `startTime`; break ties by
   `id`) so assignment is deterministic across renders.
3. Per ride, from its colour's pool, pick a start index by **hashing `ride.id`**
   into the pool length (stable per ride).
4. Track images already used **for that colour this render**. If the hashed index
   lands on a taken image, probe forward to the next free one in that pool.
5. Pool empty or fully used → `image = null`.
6. Return new `Ride` objects with `image` overwritten (feed image discarded).

Also remove the `event.thumbnailUrl ?? event.imageUrl ?? null` read from
`fetchApolloRides` — set `image: null` there; the bank is now the only source.

### 3. `src/pages/rides.astro` — wire it in

- Already calls `getPage('rides')`; reuse it — no second fetch.
- After `const rides = await getUpcomingRides();`, do:
  ```ts
  const withImages = assignRideImages(rides, page?.rideImages ?? []);
  ```
  and render `withImages` instead of `rides`.
- The render block (the `rides.map(...)` article, currently lines ~328–355) is
  **unchanged** — it already branches on `ride.image` (photo vs colour box).

## Tests (`src/lib/rides.test.ts`)

Real Vitest cases (per the repo's testing rule):

- More red rides than red images → surplus rides get `null`.
- Two red rides + two red images → different images, no duplicate.
- Same ride `id` + same bank → same image across two calls (stability).
- A `brown`/off-road ride only draws from off-road-tagged images.
- Empty bank → every ride `null`.
- Multi-colour image (tagged red + blue) is eligible for a red ride and a blue ride.

## Verification

1. `npm run astro check` — types pass.
2. `npm test` — new `assignRideImages` cases green.
3. Manual smoke: `npm run dev` → `/rides` shows bank photos on the upcoming rides,
   no duplicate within a colour, colour box where a colour's pool runs out.

## Blast radius

- `/rides` is SSR + edge-cached 60s. Safe failure: missing/empty bank → colour
  boxes (today's look), never an error.
- Two repos, coordinated merge. Site follows plan-first + human-review +
  `[ai-assisted]` PR process; a human merges (merge = prod deploy).

## Out of scope

- Ticket Tailor rides: they already carry `image` from the feed too, but the
  "always use the bank" rule means `assignRideImages` overwrites them the same way.
  No special-casing per feed.
- A max on the bank size (`rideGrades` caps at 4; the bank is open-ended).
