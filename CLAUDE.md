# Claude Code context for Sitwell Cycling Club

This file orients Claude Code on this repo. Keep it lean -- it points, it doesn't
explain. Substantive design and rationale live in `/docs`; read those before any
non-trivial change. A bloated CLAUDE.md is a smell: if a section wants more than a
few lines, move it to its own doc under `/docs` and link it.

## What this is

The Sitwell Cycling Club website — an Astro 7 + React 19 site with content in Sanity, ride/race events from Ticket Tailor and a custom Apollo events API, and a SendGrid contact form; deployed on Vercel.

See `README.md` for status and `docs/dev-workflow.md` for how we build here.

## Stack

**Astro 7 + React 19, TypeScript, npm.** Static-by-default with on-demand (SSR)
pages where needed. React islands for interactive components; Tailwind CSS v4 (via
`@tailwindcss/vite`); Sanity as the headless CMS; SendGrid for the contact form;
Ticket Tailor + a custom Apollo events API for ride listings; deployed on Vercel
(`@astrojs/vercel`). Strict TypeScript (avoid `any`); type-check with
`npm run astro check`. There is no test suite or linter configured yet.

See `README.md` for the full stack breakdown and project structure.

## Load-bearing principles

These shape the code. Don't change them without flagging it explicitly.

- **Static by default.** Pages prerender to static HTML at build time. Only opt a
  route into SSR (`export const prerender = false`) when it genuinely needs
  request-time data — currently `/rides` (merges live event feeds, edge-cached 60s)
  and `/api/sendgrid` (form handler). Don't make pages dynamic casually.
- **Content lives in Sanity, not in the repo.** Page and news copy is authored in
  Sanity (project `5q0pq1hi`, `production` dataset) and fetched via GROQ in
  `src/lib/sanity.ts`. Don't hard-code content that belongs in the CMS.
- **Secrets come from the environment.** SendGrid / Ticket Tailor keys are read from
  env vars (see README). The site degrades gracefully without them — never commit a
  key or paste one into the model.
- **React only for interactivity.** Prefer `.astro` components; reach for a `.tsx`
  island only when a piece needs client-side state (nav, accordion, contact form).

## Scope boundaries

What this project is **not**, and shouldn't drift towards. If a request would drift
here, push back before building.

- Not a web app or member portal — it's a marketing/informational site for the club.
- Not a CMS or admin surface — content editing happens in Sanity Studio (separate),
  not in this repo.
- Not the events source of truth — ride/race data comes from Ticket Tailor and the
  Apollo events API; this site consumes and displays it.

## How we work (the short version)

Full process: `docs/dev-workflow.md`. The non-negotiables:

- **Plan first.** For non-trivial work, produce an implementation plan saved to
  `docs/plans/<slug>.md` and have a human approve it before writing code. The
  plan is what gets reviewed, not the first code.
- **A human reviews and merges every PR.** Claude opens the PR; a named person reviews
  the diff against the plan and merges. Claude never merges — merging deploys to prod.
- **Never put secrets, credentials, or client data into the model.** If unsure,
  it's out of bounds until you've asked.
- **Mark AI-assisted work.** Prefix AI-assisted PR titles `[ai-assisted]`, reference
  the approved plan doc, and end the description with a `Manually reviewed by <name>`
  line. Keep the `Co-Authored-By` trailer on commits.

## Documents

Source of truth lives in `/docs`. Read the relevant doc before responding:

- `docs/dev-workflow.md` -- how we build (the loop + standing conventions)
- _Add requirements, tech design, and policy docs here as they appear._

## Working style

- Push back where appropriate rather than agreeing reflexively.
- When changing a load-bearing principle or scope boundary, flag it explicitly
  rather than slipping it in.
- Prefer pointing at a doc section over reproducing its content here.

## Raising pull requests

This project uses **GitHub** — raise PRs with the `gh` CLI, targeting `main`:

- Branch off `main`, push (`git push -u origin <branch>`), then `gh pr create`.
- **Mark AI-assisted PRs:** prefix the title `[ai-assisted]`, reference the approved
  plan doc (`docs/plans/<slug>.md`) in the description, and end it with a
  `Manually reviewed by <name>` line confirming the diff was read and validated.
- Keep the `Co-Authored-By` trailer on commits. **A human merges** once the diff has
  been reviewed against the plan. Merging to `main` auto-deploys to Vercel production,
  so never merge on Claude's own initiative.
