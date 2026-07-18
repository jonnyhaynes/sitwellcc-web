# Page headers & meta in Sanity — plan

**Status:** plan, awaiting approval
**Date:** 2026-07-18
**Slug:** page-header-cms
**Spans two repos:** website (`~/Projects/react/sitwellcc`) + Studio (`~/Projects/node/sitwellcc-api`)

Give editors CMS control over each page's **title (`<h1>`)**, **subtitle (`<h2>`)**,
**intro**, plus **SEO meta title / description** and **slug** — the header block that
every page currently hard-codes. Built as the first slice of a longer-term move to
CMS-driven pages, so the schema is deliberately extensible.

## Decisions (locked with the requester)

| Decision | Choice | Rationale |
|---|---|---|
| Model | **One reusable `page` document type**, keyed by slug | Not a type per page. Same form for every page; the seam for later "everything CMS-controlled" — new body fields land on this one type. |
| Scope, pass 1 | **Header + meta only** | `title`, `subtitle`, `intro`, `seo.metaTitle`, `seo.metaDescription`, `slug` for all pages. Page **bodies stay hard-coded** (static-by-default; bespoke layouts like the coaching image grid aren't worth modelling yet). |
| Intro field | **Portable Text (`blockContent`)** | Intros already contain inline links/bold (see `about.astro`, `coaching.astro`). Reuses the existing `blockContent` type and `PortableTextContent` renderer. |
| Studio version | **Sanity v2 syntax** | Studio is v2 (`part:` imports, plain object schemas). Match it — no `defineType`. |
| Rendering | **Static (build-time fetch)** | Page copy isn't request-time data. Same as team/routes. |
| Meta fallback | Blank `metaTitle`/`metaDescription` fall back to `title` / `subtitle` | Editors needn't fill SEO fields unless they want to override. |
| Slug-change safety | **Slug is read-only once set** (locks after first save) | The slug is the *lookup key* the site matches on, not editor-facing content. Making it read-only removes the footgun entirely rather than just warning about it. A description still explains why. See note below. |
| Rollout | All pages wired in one PR, but **behind graceful fallback** | If a `page` doc is missing, the page renders its existing hard-coded header (no blank pages during content entry). |

## Part A — Studio schema (`sitwellcc-api` repo)

New file `schemas/page.js` (v2 object literal, mirroring `post.js`):

```js
export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    { name: 'title',    title: 'Title (H1)',    type: 'string', validation: (R) => R.required() },
    { name: 'subtitle', title: 'Subtitle (H2)', type: 'string' },
    { name: 'intro',    title: 'Intro',         type: 'blockContent' },
    {
      name: 'slug', title: 'Slug', type: 'slug',
      description:
        'The page this content belongs to. Set once when the page is created; ' +
        'read-only afterwards. It is the key the site matches on — changing it ' +
        'would detach the content from its page (and, once pages are slug-driven, ' +
        'break inbound links and SEO). To repoint content, create a new page doc.',
      readOnly: ({ value }) => Boolean(value),
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    },
    {
      name: 'seo', title: 'SEO', type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'metaTitle',       title: 'Meta title',       type: 'string',
          description: 'Overrides <title>. Falls back to the page Title.' },
        { name: 'metaDescription', title: 'Meta description', type: 'text', rows: 2,
          description: 'Overrides the meta description. Falls back to the Subtitle.' },
      ],
    },
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
}
```

Register it in `schemas/schema.js` (`import page` + add `page` to the `types` array).

> **Slug is the lookup key, not the route.** Pages stay individual `.astro` files;
> each fetches its content by a **hard-coded** slug (`getPage('coaching')`). So the
> Sanity slug's job is to *match* that key. To prevent an edit from silently
> detaching content from its page, the slug **locks read-only once set**
> (`readOnly: ({ value }) => Boolean(value)`) — editable while creating a doc, fixed
> thereafter. If a page ever genuinely needs a new slug, the editor creates a fresh
> `page` doc. This also pre-empts the "old URL 404s / loses SEO" hazard that would
> appear once pages become slug-*driven* (out of scope). If we move to slug-driven
> routing later, revisit with proper redirect handling before relaxing this lock.

**Content entry:** create one `page` doc per route, slugs matching the file names:
`about`, `coaching`, `charity`, `welfare`, `membership`, `constitution`, `kit`,
`races`, `contact`, `brand`. Copy the current hard-coded title/subtitle/intro into
each so nothing visibly changes on launch. (This is authoring work, done in the
Studio after the schema deploys — can be staged page-by-page.)

## Part B — Website (`sitwellcc` repo)

1. **`src/lib/sanity.ts`** — add a `Page` type and `getPage(slug)` helper (mirrors
   `getTeamMembers`):

   ```ts
   export type Page = {
     title: string;
     subtitle?: string;
     intro?: PortableTextBlock[];
     seo?: { metaTitle?: string; metaDescription?: string };
   } | null;

   export async function getPage(slug: string): Promise<Page> { /* GROQ by slug.current */ }
   ```

2. **`src/components/PageHeader.astro`** — renders the header block that every page
   duplicates today: `<section class="title …">` → `<h1>` title, `<h2>` subtitle,
   intro via `PortableTextContent`. Props accept the `Page` fields.

3. **Per page** (all ten): fetch `getPage('<slug>')`, pass `metaTitle ?? "<title> // Sitwell Cycling Club"`
   and `metaDescription ?? subtitle` to `Layout`, and replace the hard-coded
   `<section class="title">` header with `<PageHeader … />`. **If `getPage` returns
   null, keep the existing hard-coded header** (fallback). Page bodies untouched.

4. **Tests** — unit-test `getPage` (GROQ shape + null handling) with the mocked
   client, following `sanity.test.ts` / `routes.test.ts`. `npm run astro check` +
   manual smoke of a couple of pages.

## Sequencing / risk

- Ship **Part A schema + Part B code** together; the null-fallback means pages look
  identical until each `page` doc is authored, so content entry can lag safely.
- No SSR added, no secrets, no scope drift into page bodies.
- Later expansion (body sections, per-page hero image, nav-driven pages) extends the
  same `page` type — no re-plumbing.

## Out of scope (noted, not built)

- Moving full page **bodies** into the CMS (bespoke layouts — coaching grid, team
  sections — would need block modelling).
- Dynamic `[slug]` routing from `page` docs (pages remain individual `.astro` files
  for now).
- News (`post`) already has its own header handling — untouched.
