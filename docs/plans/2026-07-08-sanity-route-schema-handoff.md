# Handoff prompt — add the `route` document type to Sanity Studio

Paste everything below the line into a fresh Claude Code session opened in the
**Sanity Studio repo** (the separate Studio project for Sitwell CC, project
`5q0pq1hi`, `production` dataset). It is self-contained.

---

I need you to add a new `route` document type to this Sanity Studio. It backs a
new "club routes map" feature on the website (a separate repo), which is already
built and merged as Phase 1. The website fetches these docs at build time and
plots each route on a Google Map, so **the field names and shapes below are a
hard contract** — the frontend GROQ query depends on them exactly.

## The contract the website expects

The website's `getRoutes()` runs this GROQ against the `production` dataset:

```groq
*[_type == "route" && defined(gpxFile.asset)]{
  _id,
  name,
  "color": colour,
  distance,
  cafeStop,
  "gpxUrl": gpxFile.asset->url
} | order(name asc)
```

So the `route` document **must** provide these fields, with these exact names:

| Field      | Type         | Required | Notes |
|------------|--------------|----------|-------|
| `name`     | string       | yes      | e.g. "Cadeby Loop". Used as the title and sort key. |
| `colour`   | string       | yes      | **enum, exactly these values:** `green`, `amber`, `red`, `brown`. (British spelling `colour` — the frontend aliases it to `color`.) These are the RAG categories + `brown` = off-road. |
| `distance` | number       | yes      | Distance in **miles**. |
| `cafeStop` | string       | no       | e.g. "Cusworth Hall". Café stop; may be blank. |
| `gpxFile`  | file asset   | yes      | The uploaded `.gpx` file. The website parses it for the map line **and** serves the untouched original as the "Download GPX" button. Routes with no `gpxFile` asset are filtered out by the query, so they won't appear on the map. |

Notes:
- `_id` and the asset URL come for free from Sanity — you don't define those.
- Don't rename `colour`, `cafeStop`, or `gpxFile` — a rename silently breaks the
  map (the query returns nulls, no error).

## What to do

1. **Look at how this Studio is already structured first.** Match the existing
   conventions — schema folder layout, whether schemas use `defineType`/
   `defineField` (Sanity's typed builders), how the schema index registers types,
   TypeScript vs plain JS, naming. Don't impose a new style; follow what's here.
2. Create the `route` schema type with the five fields above.
   - `colour`: a string with a `list` of the four options
     (`green`/`amber`/`red`/`brown`), ideally rendered as a radio/dropdown.
     Give each a human title (e.g. Green, Amber, Red, "Off-road (brown)").
   - `distance`: number, validate `>= 0` (miles). Consider a description noting
     the unit is miles so editors don't enter km.
   - `gpxFile`: a `file` field. If this Studio's Sanity version supports it,
     restrict accepted extensions to `.gpx` (`options: { accept: '.gpx' }` or the
     equivalent) — but verify against the installed Sanity version rather than
     assuming.
   - Add a `preview` so the document list shows `name` (title) and something
     useful as subtitle (e.g. distance + café stop).
   - Add sensible `validation` (name + colour + distance + gpxFile required).
3. **Register** the new type in the schema index/config the way existing types
   are registered.
4. Run whatever this repo uses to type-check / build / lint the Studio (check
   `package.json` scripts) and make sure it's clean.
5. Follow this repo's own contribution process — check for a `CLAUDE.md`,
   `README`, or `CONTRIBUTING` and honour it. If the process is unclear, ask me
   before committing/pushing rather than guessing. Don't deploy the Studio on
   your own initiative.

## Before you write code

Use `ctx7` to fetch **current** Sanity schema docs for the version installed in
this repo (check `package.json` for the `sanity` version first) — the schema API
and file-field options have changed across major versions, so confirm the exact
current syntax for `defineType`, `defineField`, the string `list` option, and
`file` field `accept` rather than relying on memory.

## How I'll verify it end-to-end (context, not a task for you)

Once this is deployed and I've published at least one `route` doc with a real
`.gpx` uploaded, the website side needs (outside this Studio repo): a Google Maps
JS API key in Vercel (`PUBLIC_GOOGLE_MAPS_API_KEY`, referrer-restricted to
`*.sitwell.cc/*`) and a `routes.sitwell.cc` subdomain rewrite → `/routes`. Then
the map should plot the published route in its colour with a working GPX
download. You don't need to do any of that — just get the `route` type live in
the Studio.
