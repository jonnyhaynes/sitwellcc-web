import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageObject, SanityImageSource } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';

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
