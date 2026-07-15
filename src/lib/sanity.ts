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
    order: number | null;
  };
};

// Team members are one doc per person, each carrying an array of memberships
// (section + title + email). We pull the membership matching the requested
// section so a person can appear in several sections with different titles.
export async function getTeamMembers(section: TeamSection): Promise<TeamMember[]> {
  return client.fetch<TeamMember[]>(
    `*[_type == "teamMember" && count(memberships[section == $section]) > 0]{
      _id,
      name,
      photo,
      "membership": memberships[section == $section][0]{ title, email, order }
    } | order(membership.order asc, name asc)`,
    { section },
  );
}
