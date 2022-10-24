import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/future/image';
import groq from 'groq';
import client from '../client';
import imageUrlBuilder from '@sanity/image-url'

import type { NextPage } from 'next';

type Props = {
    posts: [];
};

function urlFor (source: any) {
    return imageUrlBuilder(client).image(source)
}

const News: NextPage<Props> = ({ posts }) => {
    return (
      <>
        <Head>
            <title>News // Sitwell Cycling Club</title>
            <meta name="description" content="Founded 2016. Rotherham Advertiser Sports Awards Club of the Year 2018. 9 social rides a week. Go-Ride Coaching. Meet Brookside Pharmacy, Whiston." />
        </Head>
        <section className="title w-full px-5 lg:px-10 mb-20">
            <h1 className="text-6xl font-ropa-bold">News</h1>
        </section>
        <section className="races w-full px-5 lg:px-10 mb-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {posts.length > 0 && posts.map(
                ({ _id, title = '', slug = '' as any, publishedAt = '', summary = '', announcement = false, mainImage }: any) => {
                    return slug && (
                        <article className={`border-t-8 ${announcement ? 'border-yellow' : 'border-black'} pt-5 flex flex-col`}  key={_id}>
                            <Link href="/news/[slug]" as={`/news/${slug.current}`}>
                                <a className="relative block w-full mb-5">
                                    {mainImage && <Image src={urlFor(mainImage.asset).width(285).height(285).url()} className="block w-full" alt="" width="285" height="285" />}
                                    {!mainImage && <Image src="/img/coaching/placeholder.webp" className="block w-full" alt="" width="285" height="285" />}
                                    <button className="btn absolute bottom-5 right-5" aria-label="View article">View article</button>
                                </a>
                            </Link>
                            <div className={`p-5 ${announcement ? 'bg-yellow bg-opacity-25' : 'bg-black bg-opacity-5'} flex-grow`}>
                                <h3 className="text-base font-ropa block uppercase opacity-50">{new Date(publishedAt).toDateString()}</h3>
                                <h2 className="text-2xl font-ropa text-black">{title}</h2>
                                <p className="text-sm mb-2">{summary}</p>
                            </div>
                        </article>
                    )
                }
            )}
        </section>
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
