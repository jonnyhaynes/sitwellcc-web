import sanityClient from '@sanity/client';

export default sanityClient({
  projectId: '5q0pq1hi',
  dataset: 'production',
  apiVersion: '2022-04-20',
  useCdn: true
})

