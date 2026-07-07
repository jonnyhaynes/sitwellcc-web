# Sitwell Cycling Club Development Workflow

The repeatable process and standing conventions for building Sitwell Cycling Club. This
captures *how* we build; *what* to build lives in the source-of-truth docs under
`/docs`. Read the relevant sections before starting a piece of work, and flag any
change to a load-bearing decision explicitly rather than slipping it in.

---

## The loop (per unit of work)

1. **Orient** -- read the relevant repo docs. Work on an isolated branch so your work
   doesn't collide with others'.
2. **Plan** -- have Claude produce an implementation plan and save it to
   `docs/plans/<slug>.md`. **A human reviews and approves the plan before any code
   is written.** This is the single biggest quality lever: the plan is diffable,
   referenceable, and decoupled from any one Claude session.
3. **Break it down** -- split the approved plan into small, independently reviewable
   tasks, each with a clear done condition.
4. **Build** -- work the plan task by task. Prefer a fresh Claude context per task --
   it keeps each unit focused and reviewable. Review between tasks: does it match the
   plan, and is the code good? (No automated test suite exists yet, so verify changes
   by running the site — `npm run dev` — and checking the affected pages.)
5. **Review** -- run a code review across the branch. **Vet the findings; don't
   blindly apply them.** Fix the real issues.
6. **Ship** -- type-check (`npm run astro check`) and build (`npm run build`) green
   locally, then open a PR.
7. **Land** -- a human reviews the diff against the plan and merges. Merging to `main`
   auto-deploys to Vercel production. Then sync `main`, delete the branch, and file any
   deferred follow-up work.

Automation never moves the human gates: **plan approval (step 2) and the merge
(step 7) are always a person's decision.**

---

## Standing conventions

### Stack & tooling

- **Package manager: npm.** Don't mix in pnpm / yarn / bun. Commit `package-lock.json`.
- **Astro + React.** Prefer `.astro` components; use `.tsx` islands only where
  client-side interactivity is genuinely needed. Keep pages static unless a route
  needs request-time data (see the SSR principle in `CLAUDE.md`).
- **TypeScript.** Strict mode; avoid `any`. Type-check with `npm run astro check`.
- **Styling.** Tailwind CSS v4 via `@tailwindcss/vite`; the theme is defined in
  `src/styles/global.css` (`@theme`). Component CSS lives under `src/styles/components/`.
- **Testing.** No automated test suite is configured. Verify changes by running the
  site (`npm run dev`) and checking the affected pages, plus `npm run build` to catch
  build-time breakage. If a suite is added later, wire it in here.

### Guardrails (`.claude/`)

- `.claude/settings.json` holds this repo's permissions. It's versioned and shared so
  the guardrails don't depend on everyone remembering. (No hooks are configured;
  there's no test suite to guard yet.)
- Sensitive paths are deny-listed and secrets never go in the repo or the model
  (`.env`, keys). Anything touching sensitive data needs an explicit OK.
- If a guardrail gets in the way for a legitimate reason, **change it in the open**
  -- don't route around it silently.

### Git & pull requests

This project uses **GitHub** — raise PRs with the `gh` CLI, targeting `main`:

- Branch off `main`, push (`git push -u origin <branch>`), then `gh pr create`.
- **Mark AI-assisted PRs:** prefix the title `[ai-assisted]`, reference the approved
  plan doc (`docs/plans/<slug>.md`) in the description, and end it with a
  `Manually reviewed by <name>` line confirming the diff was read and validated.
- Keep the `Co-Authored-By` trailer on commits. **A human merges** once the diff has
  been reviewed against the plan.

**No formal issue tracker.** Work is tracked loosely; treat one plan doc under
`docs/plans/` as one unit of work. Use the plan slug where the process above says
`<slug>`.

**Deployment.** Merging to `main` auto-deploys to Vercel production. There is no
staging gate, so the human merge is the release decision — Claude never merges.

---

*This doc is the standing process. Update it when a convention genuinely changes
(and say so), rather than re-deciding per ticket.*
