import Head from 'next/head';

import Link from 'next/link';
import groq from 'groq';
import client from '../client';

import type { NextPage } from 'next';

type Props = {
    posts: [];
};

const News: NextPage = ({ posts } : Props) => {
    return (
      <>
        <Head>
            <title>News // Sitwell Cycling Club</title>
            <meta name="description" content="Founded 2016. Rotherham Advertiser Sports Awards Club of the Year 2018. 9 social rides a week. Go-Ride Coaching. Meet Brookside Pharmacy, Whiston." />
        </Head>
        <ul>
            {posts.length > 0 && posts.map(
                ({ _id, title = '', slug = '' as any, publishedAt = '', summary = '' }) => {
                    return slug && (
                        <li key={_id}>
                        <Link href="/news/[slug]" as={`/news/${slug.current}`}>
                            <a>{title}</a>
                        </Link>{' '}
                        ({new Date(publishedAt).toDateString()}){' '}
                        {summary}
                        </li>
                    )
                }
            )}
        </ul>
      </>
    )
}

export async function getStaticProps() {
    const posts = await client.fetch(groq`
      *[_type == "post" && publishedAt < now()] | order(publishedAt desc)
    `)

    return {
      props: {
        posts
      }
    }
}

export default News;
