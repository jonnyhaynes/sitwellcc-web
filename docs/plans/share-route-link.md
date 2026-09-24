# Share a specific route from `/routes`

**Status:** Approved — implementing
**Author:** Claude (AI-assisted), for Jonny Haynes
**Date:** 2026-09-24

## Goal

Add a **Share** control next to the existing `Download GPX` button in the route
detail panel on `/routes`, so a member can send a link that opens the site with
that one route already selected.

Sharing means the **URL carries the route**, as a clean path:

```
https://www.sitwell.cc/routes/cadeby-loop
```

Opening that link selects the route, shows its detail panel, and dims the rest —
exactly as if the member had clicked it. Selecting a route in the UI also writes
that path into the address bar (via `history.replaceState`), so copying the
address bar by hand gives the same link.

## Interpretation

The client asked for a way to "share a specific ride … next to the download one".
The only download-adjacent control on the site is `Download GPX` on `/routes`, so
**"ride" here means a club route**. The `/rides` page's "This week's rides" are
Ticket Tailor events that already link to their own shareable event pages, so
they're untouched (see Out of scope).

## Why a path and not a query string

`/routes` is a **single pre-rendered page** whose whole UI is one
`client:only="react"` island. The adapter inlines all of the island's props into
the HTML, and those props include **every route's full GPX coordinate list**: the
built page is **8.8 MB** (measured: `.vercel/output/static/routes/index.html`).
That rules out the obvious way to get real paths:

- **Rejected — one pre-rendered page per route** (`src/pages/routes/[slug].astro`
  + `getStaticPaths`). It's the "most correct" option (real pages, per-route
  `<title>`/`og:title`), but it would emit ~57 copies of that 8.8 MB document —
  roughly **500 MB of build output** and a much longer build. Not worth it for a
  share button, and it would make each shared link *heavier* than the page is today.

- **Chosen — one page, plus a rewrite.** Keep the single `/routes` page and add a
  root `vercel.json` rewrite sending `/routes/:slug` to `/routes`. The URL stays
  `/routes/cadeby-loop` in the address bar, the platform serves the existing
  document, and the island reads the slug out of `location.pathname`. No
  duplicated output, no new pages, no SSR — and it's ~8 lines of config.

The trade-off is that the pretty path is a *presentation* of one page rather than
58 distinct documents: every shared link gets the generic `/routes` social card,
and the page's `canonical` stays `/routes`. For "send this route to a mate in
WhatsApp" that's fine — the recipient lands on the map with the right route
selected. If the client later wants per-route link previews, the blocker to fix
first is the 8.8 MB payload (move the route data to a fetched JSON/endpoint so
pages become small), and *then* real `[slug]` pages become attractive. That's a
separate piece of work; noted in Out of scope.

## Decisions

1. **Clean path, one page, via a rewrite.** `vercel.json` gets
   `{ "rewrites": [{ "source": "/routes/:slug", "destination": "/routes" }] }`.
   The rewrite runs before the filesystem, so the request is served the existing
   pre-rendered `/routes` document while the browser URL keeps the slug. Vercel
   merges `vercel.json` routing with the adapter's generated
   `.vercel/output/config.json`; this is the one platform-dependent assumption in
   the plan, so it gets an explicit verification step against a preview deploy
   before merge.
2. **The island is the whole implementation.** `RoutesMap.tsx` reads the slug from
   `location.pathname` on mount, and writes it back with `history.replaceState`
   when a route is selected or cleared. `/routes` stays static — no
   `prerender = false`, no new page, no new island.
3. **Accept the query string too, as a fallback.** The island resolves a slug from
   *either* the path segment *or* `?route=`. Two reasons: `npm run dev` doesn't
   apply `vercel.json` rewrites (so the path form would 404 locally and the deep
   link couldn't be smoke-tested), and if the rewrite ever stops being applied the
   feature degrades to the query form instead of breaking. The Share button always
   mints the pretty path; nothing user-facing advertises the query form.
4. **Identify the route by a name-derived slug, not the Sanity `_id`.**
   `cadeby-loop` reads well in a message; `8f2a1b0c-…` doesn't. The slugifier
   already exists inline in `gpxDownloadName()` (`src/lib/routes.ts`) — extract it
   as `routeSlug(name)` and reuse it, so the share slug and the download filename
   can never diverge.
   *Caveat:* two routes with the same name would collide (first match wins). If
   the client ever publishes same-named routes, we'd add a Studio `slug` field and
   derive from that — flagged below, not built now (matches the "no unnecessary
   schema fields" preference).
5. **`replaceState`, not `pushState`.** Selecting routes shouldn't spam the back
   button; `replaceState` keeps the URL current so a manual copy works, and Back
   still leaves the page in one press. Deselecting (clicking the map background)
   strips the slug.
6. **Native share sheet on touch devices; copy on desktop.** Phones
   (`pointer: coarse`) get `navigator.share({ title, url })` — that's where sharing
   a route into the group chat happens. Desktop always copies to the clipboard with
   a transient "Link copied" confirmation, deliberately *not* the OS sheet: support
   and behaviour vary too much across desktop (Firefox never implemented it; Edge
   and Chrome on Windows open the Windows share flyout, which has no plain "copy
   link"; Chrome only gained it on macOS/Linux in 128). One predictable action per
   device beats a different dialog each time. If the Clipboard API is
   unavailable/blocked (non-secure context), fall back to revealing the URL in a
   read-only input so it can be selected by hand — no silent failure.
7. **Arriving via a link surfaces the route.** On mount, a matching slug selects
   the route and scrolls the detail panel into view (`scrollIntoView`) — on mobile
   the detail sits below the map, so without this the visitor lands on the map
   with no sign of what was shared.
8. **Graceful when the slug is unknown** (typo, or a route since unpublished):
   the page renders normally with nothing selected. No error, no redirect.

## Changes

### `vercel.json` (new)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/routes/:slug", "destination": "/routes" }]
}
```

Deliberately minimal — only the share path's rewrite. (The repo has no
`vercel.json` today; everything else is adapter defaults.)

### `src/lib/routes.ts`

- Extract `routeSlug(name: string): string` — the existing lowercase/strip/replace
  slug logic, returning `''` when nothing usable remains.
- Refactor `gpxDownloadName(name)` to `sitwell-${routeSlug(name) || 'route'}.gpx`
  (identical output; existing tests must stay green).
- Add pure, framework-free helpers so the URL logic is unit-testable:
  - `routeSlugFromPath(pathname: string): string | null` — pulls the segment after
    `/routes/` (`'/routes/cadeby-loop'` → `'cadeby-loop'`); `null` for `/routes`,
    `/routes/`, or any non-`/routes/*` path.
  - `routeSlugFromSearch(search: string): string | null` — the `?route=` fallback
    (trimmed, `null` when absent/blank).
  - `routeShareUrl(pathname: string, slug: string): string` —
    `/routes` + `/` + `encodeURIComponent(slug)` (tolerates a trailing slash on the
    base path).

### `src/components/RoutesMap.tsx`

- Initialise `selectedId` from the URL: a `useState` initialiser that reads
  `routeSlugFromPath(window.location.pathname) ?? routeSlugFromSearch(window.location.search)`
  and resolves it against the `routes` prop by `routeSlug(route.name)`
  (client-only island, so `window` is safe).
- An effect on `selectedId` that syncs the URL: `history.replaceState` with the
  route's path (`/routes/<slug>`) when selected, plain `/routes` when not.
- An effect that, when the initial selection came *from* the URL, scrolls
  `.routes-detail` into view once.
- In the `.routes-detail` block, wrap the actions in a row: keep the existing
  `Download GPX` `.btn`, add a `Share` button (`btn btn--secondary`).
- `isTouchDevice()` (a `(pointer: coarse)` check) picks the branch: touch devices
  call `navigator.share`, desktop goes straight to `clipboard.writeText` + a
  transient "Link copied" flag (cleared on route change and after a short timeout).
  A dismissed sheet (`AbortError`) is treated as a decision, not a failure — it does
  not then copy. Any other share failure falls through to the clipboard. If that is
  blocked too, the URL is revealed in a read-only input.
  The shared URL is absolute — built against `location.origin`.
- A `role="status"` element announcing "Link copied" for screen readers.

### `src/styles/components/buttons.css`

- Add `.btn--secondary`: deliberately **smaller** than `.btn` (0.85rem text on the
  route unit toggle's metrics) and **monochrome** — white background, black text,
  black outline, and a 3px grey offset shadow matching the route chips/unit toggle.
  Sized down from the primary during implementation, on review feedback that it read
  as too prominent next to the green download.
- Written as its own `.btn.btn--secondary` rule, **not** a nested `&--secondary`:
  native CSS nesting doesn't concatenate suffixes, so the nested form compiles to
  nothing (see Risks — the existing `&--large` has the same problem).

### `src/styles/components/routes.css`

- `.routes-actions` — flex row with gap, `align-items: center`, to hold the two
  buttons and the status text.
- `.routes-share-status` / `.routes-share-fallback` — small status text and the
  read-only fallback input, sized to the panel.

### `src/pages/routes.astro`

- No functional change. Its `canonical`/`og:url` (from `Layout.astro`, built off
  `Astro.url.pathname`) stay `/routes` — see Risks for what that means for a shared
  path URL.

### Tests — `src/lib/routes.test.ts`

- `routeSlug`: happy path, punctuation collapsing, empty/degenerate → `''`.
- `gpxDownloadName`: unchanged expectations (guards the refactor).
- `routeSlugFromPath`: `'/routes/cadeby-loop'` → slug; `'/routes'`, `'/routes/'`,
  `'/'`, `'/races/foo'` → `null`.
- `routeSlugFromSearch`: present, absent, blank, extra params, encoded value.
- `routeShareUrl`: builds `/routes/<slug>` and encodes; tolerates `/routes/` base.

UI itself is verified by hand (repo convention: pure logic unit-tested, UI
smoke-tested in the browser).

## Verification

- `npm test` green (new + existing `routes.test.ts` cases).
- `npm run astro check` clean; `npm run build` succeeds.
- **Rewrite check (the load-bearing one, on a preview deploy):**
  `curl -sI https://<preview>.vercel.app/routes/cadeby-loop` returns **200** with
  no `Location` header — i.e. the rewrite is applied and doesn't 302 to `/routes`
  or fall through to the catch-all 404.
- `npm run dev`, open `/routes` and check:
  - Click a route → URL becomes `/routes/<slug>`; Back leaves the page in one press.
  - Share button on desktop → "Link copied"; the copied link opens the same route
    selected and scrolled into view. (Locally the path form 404s — `npm run dev`
    doesn't apply rewrites — so test the deep link locally with the query fallback
    `/routes?route=<slug>`, or via `vercel dev`, and confirm the path form on the
    preview deploy.)
  - Share button on a real phone (or emulation with `navigator.share`) → native
    share sheet, correct title and URL.
  - Map-background click clears the slug.
  - Unknown slug (`/routes/nope`) → page renders with nothing selected.
  - A route whose colour filter is toggled off still isn't selected (filtering and
    selection stay independent).

## Risks / call-outs

- **The rewrite is a platform behaviour we're relying on.** Vercel merges
  `vercel.json` routing with the adapter-generated `config.json`, but this repo has
  never used a `vercel.json`, so it's unproven *here*. The preview `curl -I` check
  above is the gate. If it doesn't hold, the fallback is the query form
  (`/routes?route=<slug>`) — the island already reads it, so nothing else changes.
- **Slug collisions** — derived-slug uniqueness isn't enforced by Sanity; first
  match wins. Cheap to fix later with a Studio `slug` field if it ever bites.
- **`canonical` still points at `/routes`** on a shared path URL, so search engines
  consolidate on the index rather than indexing 57 near-duplicate map pages. This is
  read as desirable here; flagged so it's a decision rather than an accident.
- **No per-route social preview.** A shared link's card is the generic `/routes`
  OG image. If the client expects the route name in the WhatsApp/Slack preview,
  that needs real per-route pages — blocked behind slimming the 8.8 MB payload.
- **`pointer: coarse` is only a proxy for "phone".** A tablet with a trackpad, or a
  phone in desktop mode, can land on the other side of the line. The failure mode is
  benign either way: a copied link instead of a sheet, or a sheet instead of a copy.
- **Both branches were verified in a real browser** (Chrome over CDP): with a fine
  pointer, no share call is made, the absolute route URL lands on the clipboard and
  "Link copied" shows; with an emulated coarse pointer, `navigator.share` receives
  `{ title: "Barlow", url: "…/routes/barlow" }` and the clipboard is left untouched.
- **Pre-existing bug found while here: `&--large` never applies.** `.btn--large`
  (Header's "Join us today", the brand and coaching CTAs) is written as a nested
  `&--large`, which native CSS nesting drops — so those buttons render at the
  normal size. It's the same pattern that made this plan's first attempt at
  `.btn--secondary` silently do nothing. Not fixed here because it would resize CTAs
  on three unrelated pages; it's a one-line follow-up (hoist it to a `.btn.btn--large`
  rule).
- **Clipboard needs a secure context** — falls back to the read-only input.

## Out of scope

- Real per-route pages (`/routes/<slug>` as distinct documents) and per-route
  OG/social images. Both want the 8.8 MB route payload moved out of the page props
  first — a worthwhile follow-up, not a share-button ticket.
- Any Studio (Sanity) schema change, including a route `slug` field.
- Sharing from `/rides` (already covered by Ticket Tailor event links).
- QR codes, "copy to WhatsApp" deep links, share counts/analytics.

## Rollout

1. Commit this plan (done as the first commit on the branch).
2. Build + verify locally, then open the PR titled
   `[ai-assisted] Share link for a route on /routes`, referencing this plan.
3. Check the rewrite on the PR's preview deploy (`curl -I` as above) before merge —
   the rewrite is the only part that can't be proven with `npm run build` locally.
4. A human merges (auto-deploys to Vercel — no staging gate).
