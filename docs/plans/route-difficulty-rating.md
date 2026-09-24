# Route difficulty rating (out of 5)

## Summary

Show a difficulty rating out of 5 on every club route. The rating is produced by
the client's calculator formula, computed in the **Sanity Studio** when a route's
GPX is uploaded (the same place `distance`/`elevation` are already auto-filled),
**stored on the route document**, and simply read and displayed by the website.

Touches two repos:
- **Studio:** `jonnyhaynes/sitwellcc-api` (schema, GPX maths, auto-fill, backfill)
- **Website:** this repo (`/routes` page)

## Decisions (confirmed with the client)

| Question | Decision |
|---|---|
| Where is the rating produced? | Studio computes it on GPX upload and **stores** it on the route; the site only displays it. |
| Which routes? | The ~57 routes already published in Sanity. |
| Sustained-climb count (an input to the formula) | **Detected from the GPX.** |
| Brown (off-road) base | Same as **Amber = 2**. |
| Upper cap | **None** — follow the formula exactly. Rare >5 values are acceptable exceptions, shown as `6/5`. |
| Display | A number out of 5, in the route list and the detail panel. |

## The formula (verbatim from the calculator)

Columns: `B`=Category, `C`=Distance (km), `D`=Total Elevation (m), `E`=Sustained
Climbs (>1.5 km), `F`=Steep Climbs, `G`=Raw Score, `H`=Final Rating.

```
G2: =IF(OR(ISBLANK(B2), C2=0), "",
        CHOOSE(MATCH(B2, {"Green","Amber","Red"}, 0), 1, 2, 3)
      + MAX(0, (D2/C2 - 9) / 3.8)
      + MAX(0, E2 - 9) * 0.1
      + MAX(0, C2 - 90) * 0.005)

H2: =IF(ISBLANK(B2), "", B2 & "-" & MAX(1, ROUND(G2, 0)))
```

Decoded — **raw score = colour base + climbing density + long-ride bonus + climb bonus**:

| Term | Meaning |
|---|---|
| `CHOOSE(...)` | Base by colour: **Green = 1, Amber = 2, Red = 3** (brown → 2, per decision) |
| `MAX(0, (D/C - 9) / 3.8)` | Climbing density: metres of ascent per km, above 9 m/km, ÷ 3.8 |
| `MAX(0, E - 9) * 0.1` | 0.1 for each sustained climb beyond 9 |
| `MAX(0, C - 90) * 0.005` | 0.005 for each km beyond 90 |

Final rating = `MAX(1, ROUND(raw))`. **Column F ("Steep Climbs") is not used by the
formula** — it is informational only.

## Studio repo changes

- `schemas/lib/gpx.ts` — added `rawDifficultyScore`, `routeRating`,
  `sustainedClimbCount`, `distanceMilesToKm`, `elevationFeetToM` and the
  `SUSTAINED_CLIMB_DEFAULTS` constants, next to the existing ported GPX maths.
  `sustainedClimbCount` smooths the elevation profile over a ~250 m trailing
  window, then walks it with hysteresis (a climb runs valley → peak and ends when
  elevation falls 20 m below the running peak), counting climbs longer than 1.5 km.
- `schemas/route.ts` — new optional `rating` number field (integer ≥ 1), plus the
  rating in the document preview.
- `schemas/components/GpxFileInput.tsx` — `rating` joins the derived fields (so it
  appears in the existing "Use GPX values / Keep mine" dialog), and an effect keeps
  it in sync: it fills an empty rating once the colour is known, and recalculates
  when the colour, distance or elevation changes. A rating typed by hand is left
  alone until one of those inputs moves.
- `scripts/check-route-formula.mts` — asserts the formula reproduces all 26 rows of
  the client's spreadsheet (the only ground truth we have). Run: `yarn check:route-formula`.
- `scripts/backfill-route-ratings.mts` — rates the routes that were published before
  this change. Idempotent (`setIfMissing`, so hand-set ratings survive) and supports
  `--dry-run`. Run: `SANITY_WRITE_TOKEN=… yarn backfill:route-ratings`.

The two scripts are `.mts` so they can import the real formula from
`schemas/lib/gpx.ts` rather than duplicating it; Node ≥ 22.18 runs them with no
extra flag (the `scripts/` directory is already outside tsconfig/ESLint).

## Website changes

- `src/lib/routes.ts` — `rating` added to the GROQ projection, `RawRoute` and the
  `Route` interface (`number | null`). No computation here: the site is a pure
  consumer, and `null` means "not rated yet".
- `src/components/RoutesMap.tsx` — the rating shows as `· 4/5` in the route list's
  meta line and as `Difficulty: 4/5` in the detail panel. Absent ratings render
  nothing, so the page degrades cleanly before the backfill is run.
- `src/styles/components/routes.css` — `.routes-rating` (tabular figures, semibold).
- `src/lib/routes.test.ts` — a test that `rating` maps through `getRoutes()`, and is
  `null` when the document has none.

## Rollout

1. Merge + deploy the Studio schema first (the `rating` field has to exist before
   editors can see it).
2. Run `yarn backfill:route-ratings` (start with `--dry-run`) to rate the existing
   routes.
3. The website rebuilds on the Sanity publish hook / daily rebuild; ratings appear.

## Risks / open items

- **Climb detection is a heuristic.** It won't reproduce Strava's own climb counts
  exactly, so ratings can differ by a step on routes with many climbs. The climb
  term only contributes above 9 sustained climbs. Tunable constants live in
  `SUSTAINED_CLIMB_DEFAULTS`.
- **Ratings may differ from the client's sheet.** The sheet's "Green to Hathersage"
  shows 900 m elevation where the site's GPX gives 832 m, so the same route can
  score differently.
- **Staleness.** If an editor later overrides `distance`/`elevation`, the stored
  `rating` recalculates (the sync effect watches those), but a GPX-independent
  manual rating is only durable until one of those inputs moves.
- **`>5` ratings.** No cap, per the client. `6/5` is possible; if it looks wrong in
  situ, switch the display to `5+` (the Rating Guide already has a "5+" tier).
- **Brown base = 2** is a decision, not from the sheet (which has no off-road routes).

## Out of scope

- Adding the calculator's own 26 routes to the site.
- Any site-side (build-time) computation of the rating.
- Elevation-profile charts or climb lists in the UI.
