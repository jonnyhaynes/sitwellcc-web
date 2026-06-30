# Sitwell Cycling Club

The official website for [Sitwell Cycling Club](https://www.sitwellcc.co.uk) — an [Astro](https://astro.build) site with content managed in [Sanity](https://www.sanity.io), club ride/race events pulled from [Ticket Tailor](https://www.tickettailor.com) and a custom events API, and the contact form delivered via [SendGrid](https://sendgrid.com).

## Tech stack

- **[Astro 7](https://astro.build)** — static by default, with on-demand (SSR) pages where needed
- **[React 19](https://react.dev)** islands for interactive components (nav, accordion, contact form)
- **[Sanity](https://www.sanity.io)** as the headless CMS (project `5q0pq1hi`, `production` dataset)
- **[Tailwind CSS v4](https://tailwindcss.com)** for styling (via the `@tailwindcss/vite` plugin)
- **[SendGrid](https://sendgrid.com)** for the contact form (`src/pages/api/sendgrid.ts`)
- **[Ticket Tailor](https://www.tickettailor.com)** + a custom Apollo events API for ride listings
- **[Vercel](https://vercel.com)** for hosting and deploys (`@astrojs/vercel` adapter)

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

The site runs at [http://localhost:4321](http://localhost:4321).

## Environment variables

Create a `.env` file in the project root (it's gitignored). The following are required for the contact form and ride listings to work:

```bash
SENDGRID_API_KEY=        # SendGrid API key for the contact form
TICKET_TAILOR_API_KEY=   # Ticket Tailor API key for event listings
TICKET_TAILOR_BASE_URL=  # Ticket Tailor API base URL
```

Without these, the contact form and Ticket Tailor events are disabled, but the rest of the site renders normally.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production bundle |
| `npm run preview` | Preview the production build locally |

## Project structure

```
src/pages/         Routes — about, rides, races, news, contact, etc. (.astro)
src/pages/api/     Server endpoints (sendgrid.ts contact handler)
src/pages/news/    News index + [slug].astro article pages
src/layouts/       Layout.astro (head, analytics, header/footer shell)
src/components/    Shared components — .astro (static) and .tsx (React islands)
src/lib/           sanity.ts (CMS client) and rides.ts (event feed logic)
src/styles/        global.css (Tailwind v4 @theme) + component CSS
public/            Static assets (images, fonts, favicons, video)
```

## Rendering model

Most pages are prerendered to static HTML at build time. Two routes opt into
on-demand server rendering (`export const prerender = false`):

- **`/rides`** — merges the current week's events from Ticket Tailor and the Apollo
  events API at request time (edge-cached for 60s).
- **`/api/sendgrid`** — the contact form handler.

## Content management

Page and news content is authored in Sanity and fetched at build time via the client
in `src/lib/sanity.ts` using GROQ queries. News article bodies render Sanity Portable
Text. Rebuild/redeploy to publish content changes.

## Deployment

The site is deployed on Vercel. Pushes to `main` deploy to production automatically.

## License

This repository is publicly viewable for reference, but it is **not open source**.
All rights reserved by Sitwell Cycling Club — see [LICENSE](LICENSE).
