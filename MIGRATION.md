# Migration Plan: Next.js → Astro

## Decision summary

- **Move from Next.js (Pages Router) to Astro.** The site is ~16 pages, mostly static
  content with a handful of small interactive pieces — the textbook Astro use case
  (zero JS by default, islands for the interactive bits).
- **Keep Sanity for now.** Astro supports Sanity and Storyblok equally well, so the
  framework move does not lock the CMS. Reusing the existing Sanity project, schemas,
  GROQ queries, and content keeps this to a **framework-only migration**. A Storyblok
  vs Sanity evaluation is deferred to a separate future project.
- **Incremental content strategy.** Port the ~12 currently-hardcoded pages straight to
  `.astro` files (copy stays in the template). CMS-ifying those pages into Sanity is a
  follow-up, done page-by-page after the framework move lands.

This migration **replaces** the pending Next.js 16 / React 19 / Tailwind v4 /
eslint-config-next upgrade work — all of that becomes moot.

## Why Astro fits

- **~2,200 lines across ~16 pages**, overwhelmingly static marketing/club content.
- **Interactivity is small and local**: nav toggle (`header`), `accordion`, contact
  form (`contact`), and a races modal (`races`). Four React components — ported as
  islands via `@astrojs/react`, near-as-is.
- The Strava feed (`strava.tsx`) is **dead code** (commented out) — drop it.
- Only **one genuinely dynamic page**: `rides.tsx`, which merges Ticket Tailor + the
  Fly.dev Apollo events API per request. This becomes a server-rendered Astro page.
- "Eventually all pages CMS-managed" is **more** aligned with Astro, not less — CMS
  content here is static-at-heart (rebuild on publish), which is Astro's home turf via
  the Content Layer / loaders.

## Target stack

| Concern | Choice |
| --- | --- |
| Framework | Astro (latest), `output: 'hybrid'` (static by default, server where needed) |
| Interactive components | `@astrojs/react` islands (`client:load` / `client:visible`) |
| CMS | Existing Sanity (project `5q0pq1hi`, `production` dataset) — reused unchanged |
| Portable Text | `@portabletext/react` inside a React island, or an Astro PT renderer |
| Styling | Tailwind via `@astrojs/tailwind` — keeps current Tailwind v3 config, avoids the v4 upgrade |
| Hosting | Vercel adapter (`@astrojs/vercel`) for the SSR page + contact endpoint |
| Email | SendGrid (`@sendgrid/mail`) in an Astro API endpoint |

## What moves where

| Current (Next) | Astro target | Effort |
| --- | --- | --- |
| `_app.tsx` + `_document.tsx` (global head, GA gtag, JSON-LD, Vercel Analytics, body classes) | Single Astro layout (`src/layouts/Layout.astro`) | Low |
| ~12 hardcoded `pages/*.tsx` (about, charity, coaching, constitution, contact shell, kit, membership, races, rides shell, welfare) | `.astro` pages — JSX → Astro templates, near-mechanical | Low, repetitive |
| `index.tsx`, `news.tsx`, `news/[slug].tsx` (Sanity-driven) | `.astro` pages, GROQ in frontmatter + Portable Text rendering | Medium |
| `components/header.tsx` (nav toggle, `useState`) | React island, `client:load` | Low |
| `components/accordion.tsx` (`useState`) | React island, `client:visible` | Low |
| `contact.tsx` form (`useState`, `onSubmit` → fetch) | React island + posts to Astro endpoint | Low |
| `races.tsx` modal (`useState`/`useRef`) | React island | Low |
| `components/strava.tsx` | **Delete** (dead code) | — |
| `rides.tsx` (762 lines, SSR merge of Ticket Tailor + Apollo API) | Server-rendered `.astro` page (`export const prerender = false`) | **High — the one real port** |
| `pages/api/sendgrid.ts` | `src/pages/api/sendgrid.ts` Astro endpoint | Low |
| `client.ts` (Sanity client) | `src/lib/sanity.ts` | Low |
| `next.config.js`, `tailwind.config.js`, `postcss.config.js` | `astro.config.mjs` + `tailwind.config.js` (kept) | Low |
| `styles/` (app.css + component css + fonts + tw_*) | Reused; `@tailwind` directives stay (Tailwind v3) | Low |
| Sanity schemas, content, env vars | **Unchanged — reused** | None |
| `public/` (favicons, fonts, images, `.htaccess`) | Reused as-is | None |

### Global concerns to carry over (from `_app.tsx` / `_document.tsx`)
- Favicon / manifest / apple-touch / theme-color meta tags.
- Google Analytics gtag (`G-BTC2TSVGSD`).
- JSON-LD `SportsTeam` structured data.
- Vercel Analytics (`@vercel/analytics`).
- `<body>` classes: `font-arial antialiased h-screen bg-white flex flex-col text-black`.
- Per-page `<title>` / meta (currently via `next/head`) → Astro layout prop or `<slot>`.

## Environment variables (unchanged)

```
SENDGRID_API_KEY
TICKET_TAILOR_API_KEY
TICKET_TAILOR_BASE_URL
```

Sanity `projectId` / `dataset` are public identifiers and stay in code.

## Execution order

1. **Branch** `feat/astro-migration` (isolated git worktree so `main` stays intact).
2. Scaffold Astro + integrations: `react`, `tailwind`, `vercel` adapter, `@sanity/client`.
   Wire env vars.
3. Port the **global layout + styles** (`_app`/`_document` → `Layout.astro`; bring
   `styles/` across, keep Tailwind v3 config).
4. Port the **static pages** (the easy ~12) to establish the `.astro` pattern.
5. Port the **4 interactive components** as React islands.
6. Port the **Sanity pages** (homepage, news index, news `[slug]`) — GROQ + Portable Text.
7. Port **`rides.tsx`** as a server-rendered page (the careful one; verify merged output
   matches current prod: Ticket Tailor + Apollo, colours, sorting).
8. Port the **SendGrid contact endpoint**; wire the contact form island to it.
9. **Verify**: `npm run build` green; run locally; click through every page; test the
   contact form and rides data; visual side-by-side against current production.
10. Update **Vercel build config** (framework preset → Astro). **PR with screenshots;
    no merge without sign-off.**

## Hosting (Vercel free / Hobby tier)

Stays on the Vercel free tier — same cost and same function footprint as today.

- The ~15 **static pages** are prerendered to HTML at build time and served from the
  CDN. These are static assets, not function invocations — zero serverless cost.
- Only **two dynamic endpoints** become Vercel Functions: the server-rendered `rides`
  page and the SendGrid contact endpoint. This is **identical to the current Next
  setup** (`rides` already uses `getServerSideProps`; `sendgrid` is already an API
  route). Astro adds no server workload that isn't already there.
- Low-traffic club site → nowhere near Hobby's function-invocation, bandwidth, or
  build-minute limits.
- Hobby's non-commercial rule applies equally to the current Next site (a club
  marketing site is fine; directly selling memberships/merch through the site would be
  the line to watch — unchanged by this migration).
- **Exit option Astro gives that Next can't:** if the two dynamic endpoints are ever
  removed (e.g. `rides` moved to build-time + webhook rebuilds, contact form to a
  third-party service), Astro can output a 100% static site — deployable free on
  Vercel, Netlify, Cloudflare Pages, or GitHub Pages. Not part of this plan; noted as a
  future option.

## Risks & callouts

- **`rides.tsx` is the highest-risk port.** 762 lines, request-time merge of two APIs
  with colour/sorting logic. Port carefully and diff the rendered output against prod.
- **Visual parity.** Keeping the same Tailwind config + `styles/` should render pages
  identically; do a deliberate side-by-side pass anyway. Public-facing site.
- **SSR adapter.** `rides` and the contact endpoint require the Vercel adapter and
  `output: 'hybrid'` (or `server` with `prerender` on static pages).
- **Portable Text.** Reuse `@portabletext/react` inside a React island for news bodies.

## Cleanup once committed to this direction

- Close the now-moot Dependabot PRs: **#41** (Next 12→16) and any React/eslint
  follow-ups that exist only to serve the Next upgrade.
- Remove dead `strava.tsx`.

## Out of scope (future, separate projects)

- CMS-ifying the ~12 hardcoded pages into Sanity (incremental, page-by-page).
- Storyblok vs Sanity CMS evaluation.
- React 19 / Tailwind v4 adoption (Astro sidesteps the forced upgrade; revisit on their own merits later).
