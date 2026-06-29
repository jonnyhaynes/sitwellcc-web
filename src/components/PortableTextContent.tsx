import { PortableText, type PortableTextComponents } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import { createClient } from '@sanity/client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const client = createClient({
  projectId: '5q0pq1hi',
  dataset: 'production',
  apiVersion: '2022-04-20',
  useCdn: true,
});

const builder = imageUrlBuilder(client);
const urlFor = (source: SanityImageSource) => builder.image(source);

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <img
          src={urlFor(value).url()}
          className="block mt-2.5 mb-2.5 p-5 bg-black/5 mr-5 max-w-full h-auto float-left"
          alt={value.alt || ' '}
          width="285"
          height="285"
        />
      );
    },
  },
};

type Props = {
  // Portable Text block array from Sanity
  value: Parameters<typeof PortableText>[0]['value'];
};

const PortableTextContent = ({ value }: Props) => (
  <PortableText value={value} components={components} />
);

export default PortableTextContent;
