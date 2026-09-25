# Clearer share URLs on the routes microsite

**Status:** Approved — implementing
**Author:** Claude (AI-assisted), for Jonny Haynes
**Date:** 2026-09-25

## Goal

Stop the share links reading `https://routes.sitwell.cc/routes/bank-holiday-blowout-holme-moss`
— the subdomain already says "routes", so the `/routes` folder is repetition. Make
the canonical share link:

```
https://routes.sitwell.cc/bank-holiday-blowout-holme-moss
```

## What's actually deployed (verified against production)

- `routes.sitwell.cc` is a **microsite**. A Vercel domain-level rewrite
  (`routes.sitwell.cc/*` → `/routes`) sends **every** path to the routes page, so
  `/routes/barlow`, `/barlow` and `/nonsense-xyz` all return 200 with
  `<title>Club routes</title>`. That rewrite lives **only in the Vercel dashboard** —
  nothing in this repo (see `docs/plans/2026-07-08-sanity-route-schema-handoff.md:86`).
- `www.sitwell.cc/routes` **301s to `https://routes.sitwell.cc/`** and **drops the
  path**, so a www-form link loses the route entirely.
- The shipping share link works: `/routes/<slug>` selects the route. A bare
  `/barlow` does *not* — `routeSlugFromPath` only matches `^/routes/<slug>` (or
  `?route=`), so the catch-all serves the page with nothing selected.
- Consequence worth stating plainly: the `vercel.json` rewrite added in #101 is doing
  **nothing observable** — the microsite catch-all covers the microsite, and on www
  the 301 fires first. It's harmless, but it isn't what makes the deep link work.

## Decisions

1. **Canonical form is the bare slug on the routes host:** `routes.sitwell.cc/<slug>`.
   The host's root already *is* the routes page and every path already resolves to it,
   so a bare segment is unambiguous there. No new domain needed.
   Rejected: `/ride/<slug>` (explicit and collision-proof, but adds a segment for no
   gain on a single-purpose host) and the status quo (`/routes/<slug>` on a `routes.`
   subdomain — the thing being complained about).
2. **Bare slugs are accepted only on the routes host.** On `www.sitwell.cc` a bare
   `/barlow` would sit alongside real pages (`/about`, `/rides`, `/news`…), so it must
   not resolve there. The island decides from `window.location.hostname`.
3. **Keep `/routes/<slug>` working everywhere, permanently.** It's the form already
   shared with members and the form local dev and the main domain use. No redirect
   from one to the other: a redirect hop on links already in the wild buys nothing
   here, and both forms resolve the same route. Canonical/SEO consolidation is a
   separate decision (see Risks).
4. **Mint the share URL per host.** On the routes host → `https://routes.sitwell.cc/<slug>`.
   Anywhere else (local dev, or www if it ever served the page) → `/routes/<slug>`.
   This is the actual bug being fixed: the current code just prepends `/routes` to
   `location.origin`.
5. **One source of truth for the microsite hosts.** `['brand.sitwell.cc',
   'routes.sitwell.cc']` currently lives inline in `Header.tsx:14`; this change needs
   the same knowledge in `RoutesMap`, so extract it rather than copy it.
6. **Leave the dashboard microsite rewrite alone, and don't add it to `vercel.json`
   in this change.** Version-controlling it is appealing, but it already exists in the
   dashboard, can't be read or verified from here, and a duplicate/conflicting rule
   risks breaking the microsite for everyone. Bring it into the repo deliberately, as
   its own change, once the dashboard config has been read.
7. **The www redirect fix is a dashboard change, not code.** `www.sitwell.cc/routes/:slug`
   must redirect to `https://routes.sitwell.cc/:slug` instead of the microsite root.
   Flagged as a manual step — it is the only part of this that cannot be done or
   verified from the repo.

## Changes

### `src/lib/microsites.ts` (new)

```ts
export const MICROSITE_HOSTS = ['brand.sitwell.cc', 'routes.sitwell.cc'] as const;

// Single-page microsites rewrite every path to one page, so the path can't be
// used to tell "another page" from "a thing on this page".
export function isRoutesMicrosite(hostname: string): boolean;
```

`Header.tsx` switches its inline array for this, so the two can't drift.

### `src/lib/routes.ts`

- Add `routeSlugFromBarePath(pathname: string): string | null` — a single non-empty
  segment at the root (`'/barlow'` → `'barlow'`, `'/barlow/'` → `'barlow'`); `null`
  for `'/'`, an empty segment, or anything deeper. Pure, so it unit-tests alongside
  the existing `routeSlugFrom*` helpers.
- Generalise the existing `routeShareUrl(basePath, slug)` to accept `''` as the site
  root (so `routeShareUrl('', 'barlow') === '/barlow'`), rather than adding a
  near-duplicate helper. Documented and covered by a test.

### `src/components/RoutesMap.tsx`

- Resolve the initial selection from the host: on the routes microsite,
  `routeSlugFromBarePath(pathname) ?? routeSlugFromPath(pathname) ?? routeSlugFromSearch(search)`;
  everywhere else, the existing two (no bare slugs). `/routes/<slug>` keeps working on
  the microsite, so nothing already shared breaks.
- Mint the share URL against the right base: `''` on the routes microsite,
  `ROUTES_PATH` otherwise.
- The URL-sync effect (`replaceState`) writes the same form it would share, so the
  address bar and the copied link stay identical.

### Tests — `src/lib/routes.test.ts`

- `routeSlugFromBarePath`: `'/barlow'`, `'/barlow/'` → slug; `'/'`, `'//'`, `'/a/b'` → `null`.
- `routeShareUrl('', 'barlow')` → `'/barlow'` (guards the root case).
- `isRoutesMicrosite`: true for `routes.sitwell.cc` / `brand.sitwell.cc`, false for
  `www.sitwell.cc`, `localhost`, and a lookalike like `routes.sitwell.cc.evil.com`.

## Verification

- `npm test`, `npm run astro check`, `npm run build` green.
- Local (`npm run dev`, which has no rewrites — so use the query form):
  `/routes?route=barlow` still selects Barlow and the address bar becomes
  `/routes/barlow` (localhost isn't a microsite).
- **On the PR preview** (browser, signed in — previews are SSO-protected so a curl
  proves nothing): host is not the microsite, so expect `/routes/barlow` behaviour to
  be unchanged from today.
- **After merge, on production** — the real check:
  - `https://routes.sitwell.cc/bank-holiday-blowout-holme-moss` → page loads with that
    route selected, and the Share button copies that exact URL.
  - `https://routes.sitwell.cc/routes/bank-holiday-blowout-holme-moss` → still selects
    the route (back-compat).
  - `https://routes.sitwell.cc/barlow` → selects Barlow (already-known route).
  - `https://www.sitwell.cc/routes/bank-holiday-blowout-holme-moss` → after the
    dashboard fix, lands on the microsite **with the route selected** (today it lands
    on the root with nothing selected).

## Risks / open items

- **Bare slugs assume the microsite stays single-purpose.** True today — every path
  already serves the routes page, and `Header.tsx` deliberately points microsite nav
  at `www.sitwell.cc`. If the microsite ever grows its own pages, a bare slug would
  collide; the `/ride/<slug>` prefix is the escape hatch.
- **The www 301 still drops slugs until the dashboard is changed** (decision 7). Until
  then, don't share the www form. Worth confirming in the Vercel dashboard that the
  redirect is a Domain-level rule and not something already in `vercel.json`.
- **`canonical` / `og:url` stay `https://www.sitwell.cc/routes`** (built from `site` in
  `astro.config.mjs`), which 301s to the microsite root — so every shared route page
  advertises a canonical that itself redirects, and none of them are per-route. That's
  a pre-existing SEO decision, unchanged and out of scope here, but it's the natural
  follow-up: a per-host canonical of `https://routes.sitwell.cc/` at minimum.
- **Slug length** (`bank-holiday-blowout-holme-moss`) is left alone: self-describing
  beats short in a message. A Studio-managed `slug` field is the lever if they ever
  want shorter, and it would also close the same-name collision caveat from #101.

## Out of scope

- Per-route pages, per-route OG images, or a canonical/SEO pass (above).
- Bringing the dashboard microsite rewrite into `vercel.json`.
- Any change to how routes are authored in Sanity, including a `slug` field.

## Rollout

1. Commit this plan (first commit on the branch).
2. Build + verify, open the PR (`[ai-assisted]`, referencing this plan).
3. A human merges (auto-deploys to Vercel).
4. **Manual, in the Vercel dashboard:** update the `www.sitwell.cc/routes` redirect to
   preserve the path (`/routes/:slug` → `https://routes.sitwell.cc/:slug`), then run
   the production checks above — including one already-shared `/routes/<slug>` link to
   confirm nothing regressed.
