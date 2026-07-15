import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

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
