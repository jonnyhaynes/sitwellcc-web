# Handoff prompt — add the `teamMember` document type to Sanity Studio

Paste everything below the line into a fresh Claude Code session opened in the
**Sanity Studio repo** (the separate Studio project for Sitwell CC, project
`5q0pq1hi`, `production` dataset). It is self-contained.

---

I need you to add a new `teamMember` document type to this Sanity Studio. It backs
the people/profile grids on three pages of the website (a separate repo, already
wired up and waiting on this schema): **Coaching**, **About / Committee**, and
**Welfare**. The website fetches these docs at build time and renders each person's
photo, name, title, and (optionally) a contact button. **The field names and shapes
below are a hard contract** — the frontend GROQ depends on them exactly.

## The core idea

One `teamMember` document = one person. A person can appear in several sections
(coaching / committee / welfare) with a **different title and different email in
each** — so the section-specific data lives in an array of **memberships** on the
person, not on separate documents. Example: Jude Daly is one document with two
memberships: "Activity Coach – Coaching in Context MTB XC" (`coaching@sitwell.cc`)
in coaching, and "Club Coach" (`coach@sitwell.cc`) in committee.

## The contract the website expects

The website runs this GROQ (once per section, with `$section` = `coaching`,
`committee`, or `welfare`):

```groq
*[_type == "teamMember" && count(memberships[section == $section]) > 0]{
  _id,
  name,
  photo,
  "membership": memberships[section == $section][0]{ title, email, order }
} | order(membership.order asc, name asc)
```

So the `teamMember` document **must** provide these fields, with these exact names:

| Field         | Type                          | Required | Notes |
|---------------|-------------------------------|----------|-------|
| `name`        | string                        | yes      | e.g. "Jude Daly". Title + sort tiebreaker. |
| `photo`       | image (`hotspot: true`)       | no       | Portrait. If absent, the website falls back to a placeholder image, so it's safe to leave blank. |
| `memberships` | array of `membership` objects | yes      | At least one. Each places the person in one section. |

The `membership` object type **must** provide:

| Field     | Type   | Required | Notes |
|-----------|--------|----------|-------|
| `section` | string | yes      | **enum, exactly these values:** `coaching`, `committee`, `welfare`. Render as radio/dropdown with human titles (Coaching / Committee / Welfare). |
| `title`   | string | yes      | Role text shown under the name, e.g. "Level 2 Coach", "Chair", "Welfare Officer". |
| `email`   | string | no       | If set, the website shows a "Contact <first name>" mailto button. If blank, no button appears. |
| `order`   | number | no       | Sort position within the section (ascending). Blank sorts last, then alphabetically by name. |

Notes:
- `_id` comes for free from Sanity — you don't define it.
- Don't rename `photo`, `memberships`, `section`, `title`, `email`, or `order` — a
  rename silently breaks the pages (the query returns nulls, no error).
- The same person having two memberships in the **same** section is not expected;
  the query takes the first match. One membership per section per person.

## What to do

1. **Look at how this Studio is already structured first.** Match the existing
   conventions — schema folder layout, `defineType`/`defineField` usage, how the
   schema index registers types, TS vs JS, naming. Follow what's here; don't impose
   a new style. (The `route` and `post` types are good references.)
2. Create the `membership` **object** type with the four fields above, and the
   `teamMember` **document** type with `name`, `photo`, `memberships`.
   - `section`: string with a `list` of the three options, radio/dropdown, human
     titles.
   - `photo`: image field with `options: { hotspot: true }`.
   - `memberships`: array of the `membership` object; validate min length 1.
   - Add `validation` so `name`, and each membership's `section` + `title`, are
     required.
   - Add a `preview` on `teamMember`: `name` as title, and the list of the person's
     section labels as subtitle (e.g. "Coaching, Committee"). A `preview` on the
     `membership` object showing `title` + `section` helps too.
3. **Register** the new types in the schema index/config the way existing types are
   registered (both the document and the object type if this Studio registers
   objects explicitly).
4. Run whatever this repo uses to type-check / build / lint (check `package.json`
   scripts) and make sure it's clean.
5. Follow this repo's own contribution process — check for a `CLAUDE.md`, `README`,
   or `CONTRIBUTING` and honour it. If unclear, ask before committing/pushing. Don't
   deploy the Studio on your own initiative.

## Before you write code

Use `ctx7` to fetch **current** Sanity schema docs for the version installed in this
repo (check `package.json` for the `sanity` version first) — the schema API has
changed across major versions, so confirm the exact current syntax for `defineType`,
`defineField`, array-of-object fields, the string `list` option, and image
`hotspot` rather than relying on memory.

## Seed content (so the website matches its current pages 1:1)

Once the schema is live, these people need to exist (photos re-uploaded from the
website's `public/img/` where noted; blank photo → placeholder). Jude, Ted, and
Craig are each **one document with multiple memberships**.

**Coaching** memberships (order as listed):
1. Erin Avill — Level 2 Coach — `coaching@sitwell.cc`
2. Karen Avill — Level 1 Coach — `coaching@sitwell.cc`
3. Danni Haynes — Volunteer Helper — *(no email)*
4. George Daly — Level 1 Coach — `coaching@sitwell.cc` — photo `george.webp`
5. Jude Daly — Activity Coach - Coaching in Context MTB XC — `coaching@sitwell.cc` — photo `jude.webp`
6. Ted Daly — Activity Coach - Coaching in Context MTB XC — `coaching@sitwell.cc`
7. Jonny Haynes — Level 2 MTB Coach — `coaching@sitwell.cc` — photo `jonny.webp`
8. Aaron Thomas — Volunteer Helper — *(no email)*
9. Craig Wright — Welfare Officer — *(no email)*

**Committee** memberships (order as listed):
1. Jude Daly — Club Coach — `coach@sitwell.cc`
2. Ted Daly — Treasurer and Membership Officer — `membership@sitwell.cc`
3. Janice McWilliam — Chair — `chair@sitwell.cc`
4. Andy Moulster — Club Captain — `captain@sitwell.cc`
5. Phil Smith — Kit Officer — `kit@sitwell.cc`
6. Craig Wright — Welfare Officer — `welfare@sitwell.cc`

**Welfare** memberships:
- Craig Wright — Welfare Officer — `craig.wright@sitwell.cc`

(Claire Wardle is intentionally omitted for now — she was hidden on the site.)

## How I'll verify it end-to-end (context, not a task for you)

Once the schema is deployed and I've published the people above, the website's
`getTeamMembers()` queries each section and re-renders the Coaching, Committee, and
Welfare grids from Sanity. Photos come through the image CDN; contact buttons appear
only where an email is set. The Welfare page's certification lines (CPSU / DBS) stay
hardcoded on the website — they are **not** part of this schema. You don't need to do
any of that — just get the `teamMember` type live in the Studio.
