import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';

export const client = createClient({
  projectId: '5q0pq1hi',
  dataset: 'production',
  apiVersion: '2022-04-20',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);

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
      seo
    }`,
    { slug },
  );
}
