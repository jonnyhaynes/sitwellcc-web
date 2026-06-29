# Sitwell Cycling Club

The official website for [Sitwell Cycling Club](https://www.sitwellcc.co.uk) — a [Next.js](https://nextjs.org) site with content managed in [Sanity](https://www.sanity.io), club ride/race events pulled from [Ticket Tailor](https://www.tickettailor.com) and a custom events API, and the contact form delivered via [SendGrid](https://sendgrid.com).

## Tech stack

- **[Next.js 12](https://nextjs.org)** (Pages Router) with React 18 and TypeScript
- **[Sanity](https://www.sanity.io)** as the headless CMS (project `5q0pq1hi`, `production` dataset)
- **[Tailwind CSS](https://tailwindcss.com)** for styling
- **[SendGrid](https://sendgrid.com)** for the contact form (`pages/api/sendgrid.ts`)
- **[Ticket Tailor](https://www.tickettailor.com)** + a custom events API for ride/race listings
- **[Vercel](https://vercel.com)** for hosting and deploys

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` file in the project root (it's gitignored). The following are required for the API routes and event listings to work:

```bash
SENDGRID_API_KEY=        # SendGrid API key for the contact form
TICKET_TAILOR_API_KEY=   # Ticket Tailor API key for event listings
TICKET_TAILOR_BASE_URL=  # Ticket Tailor API base URL
```

Without these, the contact form and Ticket Tailor events will be disabled, but the rest of the site renders normally.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Serve the production build |

## Project structure

```
pages/            Routes (Pages Router) — about, rides, races, news, contact, etc.
pages/api/        API routes (sendgrid.ts contact handler)
pages/components/ Shared React components
pages/news/       News article pages
public/           Static assets
styles/           Global and Tailwind styles
client.ts         Sanity client configuration
```

## Content management

Page and news content is authored in Sanity and fetched at build/request time via the client in `client.ts` using GROQ queries.

## Deployment

The site is deployed on Vercel. Pushes to `main` deploy to production automatically.
