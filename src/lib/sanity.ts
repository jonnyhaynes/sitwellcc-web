import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageObject, SanityImageSource } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';
// Type-only, so this doesn't pull the ride feeds into every page that imports
// this module. Events reuse the ride colour tokens rather than a second palette.
import type { RideColor } from './rides';

export const client = createClient({
  projectId: '5q0pq1hi',
  dataset: 'production',
  apiVersion: '2022-04-20',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);

// Every CMS-managed image carries its own alt text (Studio type `imageWithAlt`),
// so the description travels with the asset instead of being hard-coded next to
// the slot — otherwise swapping a photo would leave the old alt text behind.
export type ImageWithAlt = SanityImageObject & {
  alt: string | null;
};

// One of the four big promo cards on the homepage. The layout of each card is
// fixed in `index.astro` (asymmetric widths, text in a different corner on each),
// so a card is matched to its slot by `key` rather than by array position —
// reordering them in the Studio can't scramble the design.
export type FeatureKey = 'rides' | 'charity' | 'races' | 'coaching';

export type Feature = {
  key: FeatureKey;
  image: ImageWithAlt | null;
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  linkHref: string | null;
  linkLabel: string | null;
};

// The photo for one of the four ride-grade cards on /rides. Only the photo is
// CMS-driven: the distances, speeds and meeting times stay in the page, since
// they read alongside the grade's colour and heading and it would be easy to
// leave a CMS photo disagreeing with hard-coded stats.
export type RideGradeKey = 'green' | 'amber' | 'red' | 'offroad';

export type RideGrade = {
  key: RideGradeKey;
  image: ImageWithAlt | null;
};

// An item of club kit on /kit. This is video rather than photography — the page
// has always used short clips — so `videoUrl` points at an uploaded MP4 and
// `poster` is the still shown before it plays.
export type KitItem = {
  label: string;
  poster: ImageWithAlt | null;
  videoUrl: string | null;
  orderUrl: string | null;
};

// Kit items, read off the Kit page doc's `kitItems` array in the order the editor
// arranged them. Returns an empty array when none are authored, so the caller
// falls back to the clips built into the page.
export async function getKitItems(): Promise<KitItem[]> {
  const items = await client.fetch<KitItem[] | null>(
    `*[_type == "page" && slug.current == "kit"][0].kitItems[]{
      label,
      poster,
      "videoUrl": video.asset->url,
      orderUrl
    }`,
  );
  return items ?? [];
}

// A club-hosted event — shown as a card on /races.
//
// Named ClubEvent rather than Event so it doesn't shadow the DOM's `Event`.
//
// This is a deliberate exception to "the site is not the events source of
// truth": the Ticket Tailor and Apollo feeds both model *weekly* club rides, and
// getUpcomingRides() filters them to the current Mon-Sun window, so an annual
// club-hosted race promoted months ahead has no home in either. That's why it
// was hard-coded in the template until now. The feeds remain the source of truth
// for weekly rides.
export type ClubEvent = {
  _id: string;
  title: string;
  // Sanity `date` fields serialise as a plain YYYY-MM-DD string — no time, no
  // timezone. Kept as a string on purpose: comparing and formatting the string
  // avoids the off-by-one-day errors that come from parsing a date-only value
  // into a Date in a non-UTC timezone.
  date: string;
  image: ImageWithAlt | null;
  summary: string | null;
  signOn: string | null;
  fee: string | null;
  entryUrl: string | null;
  colour: RideColor;
  sanctioned: boolean | null;
};

// Every event, soonest first, past ones included. The page filters to upcoming
// itself rather than the query doing it, so it can tell "no events authored yet"
// (keep the card built into the page) apart from "authored, but none upcoming"
// (say so). Fetching the past ones too is cheap at a handful of events a year.
export async function getEvents(): Promise<ClubEvent[]> {
  return client.fetch<ClubEvent[]>(
    `*[_type == "event" && defined(date)] | order(date asc){
      _id,
      title,
      date,
      image,
      summary,
      signOn,
      fee,
      entryUrl,
      colour,
      sanctioned
    }`,
  );
}

// Today as YYYY-MM-DD in local time, so an event stops showing the day *after*
// it happens rather than at midnight UTC.
export function isoDate(now: Date): string {
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// Drop events whose date has passed, keeping the event visible on the day
// itself. Both sides are YYYY-MM-DD, which sorts correctly as a string.
//
// This runs at build time, so a passed event lingers until the next deploy. A
// scheduled workflow pings the Vercel deploy hook daily to bound that window —
// see .github/workflows/scheduled-rebuild.yml.
export function upcomingEvents(events: ClubEvent[], now: Date): ClubEvent[] {
  const today = isoDate(now);
  return events.filter((event) => event.date >= today);
}

const MONTH_FORMAT = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  timeZone: 'UTC',
});

// The eyebrow above an event's title: "October", or "October 2027" when the
// event isn't in the current year — "October" alone would be ambiguous for a
// race being promoted more than a year ahead.
//
// Formats from the string's own parts (at UTC midday) rather than parsing the
// date-only value directly, which would shift a day in western timezones.
export function eventMonthLabel(date: string, now: Date): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return '';

  const [, year, month] = match;
  const label = MONTH_FORMAT.format(
    new Date(Date.UTC(Number(year), Number(month) - 1, 1, 12)),
  );

  return Number(year) === now.getFullYear() ? label : `${label} ${year}`;
}

export type TeamSection = 'coaching' | 'committee' | 'welfare';

export type TeamMember = {
  _id: string;
  name: string;
  photo: SanityImageSource | null;
  membership: {
    title: string;
    email: string | null;
  };
};

// Surname = the last whitespace-separated word of the name, used as the sort key
// for team grids (e.g. "Jude Daly" -> "Daly"). Falls back to the whole trimmed
// name when there is no space.
export function surname(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? '';
}

// Team members are one doc per person, each carrying an array of memberships
// (section + title + email). We pull the membership matching the requested
// section so a person can appear in several sections with different titles,
// then sort alphabetically by surname.
export async function getTeamMembers(section: TeamSection): Promise<TeamMember[]> {
  const members = await client.fetch<TeamMember[]>(
    `*[_type == "teamMember" && count(memberships[section == $section]) > 0]{
      _id,
      name,
      photo,
      "membership": memberships[section == $section][0]{ title, email }
    }`,
    { section },
  );

  return members.sort((a, b) =>
    surname(a.name).localeCompare(surname(b.name)),
  );
}

// A page's editable header block, authored in Sanity as one `page` doc per route.
// This is the first slice of CMS-driven pages: header + meta only. The slug is a
// fixed lookup key (locked read-only in the Studio), so each page fetches its own
// doc by a hard-coded slug — getPage('coaching'), etc.
export type Page = {
  title: string;
  subtitle: string | null;
  intro: PortableTextBlock[] | null;
  // Photos for the page, in the order the editor arranged them. Each page places
  // them in its own layout: the Coaching and Membership grids render the first
  // four above the main content block and the rest below it. Null/empty means
  // "keep the photos built into the page".
  gallery: ImageWithAlt[] | null;
  // Homepage only. Null/empty means "keep the cards built into the page".
  features: Feature[] | null;
  // /rides only. Null/empty means "keep the photos built into the page".
  rideGrades: RideGrade[] | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
    // Shown when the page is shared. Cropped to 1200x630 by the layout.
    socialImage: ImageWithAlt | null;
  } | null;
};

// Fetch the `page` doc for a route by its slug. Returns null when no doc exists
// yet, so callers can fall back to their existing hard-coded header while content
// is being authored.
export async function getPage(slug: string): Promise<Page | null> {
  return client.fetch<Page | null>(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      subtitle,
      intro,
      gallery,
      features,
      rideGrades,
      seo
    }`,
    { slug },
  );
}

// Pick a ride grade's photo out of a page's `rideGrades` by its key. Returns null
// when no doc is authored yet, or when that grade has no photo, so the caller
// falls back to the image built into the page.
export function rideGradeImageFor(
  page: Page | null,
  key: RideGradeKey,
): ImageWithAlt | null {
  return page?.rideGrades?.find((grade) => grade.key === key)?.image ?? null;
}

// Pick a homepage card out of a page's `features` by its key. Returns null when
// no doc is authored yet, or when that particular card has not been filled in, so
// the caller falls back to the version built into the page.
export function featureFor(
  page: Page | null,
  key: FeatureKey,
): Feature | null {
  return page?.features?.find((feature) => feature.key === key) ?? null;
}
