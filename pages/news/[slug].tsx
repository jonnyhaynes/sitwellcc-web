import Head from 'next/head';
import Link from 'next/link';
import groq from 'groq'
import {useRouter} from 'next/router'
import Image from 'next/future/image';
import imageUrlBuilder from '@sanity/image-url'
import {PortableText} from '@portabletext/react'
import client from '../../client'

function urlFor (source: any) {
    return imageUrlBuilder(client).image(source)
}

const ptComponents = {
    types: {
        image: ({ value }: any) => {
            console.log({
                value,
            });

            if (!value?.asset?._ref) {
                return null
            }
            return (
                <Image src={urlFor(value).url() as any} className="block mt-2.5 mb-2.5 p-5 bg-black bg-opacity-5 mr-5 max-w-full h-auto float-left" alt={value.alt || ' '} width="285" height="285" />
            )
        }
    }
}

const Post = ({posts, post}: any) => {
    if (!post) return null;

    const {
        title = null,
        author = null,
        body = [],
        publishedAt = '',
    } = post;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    return (
        <>
            <Head>
                <title>{`${title} // News // Sitwell Cycling Club`}</title>
                <meta name="description" content="Founded 2016. Rotherham Advertiser Sports Awards Club of the Year 2018. 10 social rides a week. Go-Ride Coaching. Meet Brookside Pharmacy, Whiston." />
            </Head>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold">{title}</h1>
                <h2 className="text-3xl font-ropa">By {author} on {new Date(publishedAt).toDateString()}.</h2>
            </section>
            <section className="w-full px-5 lg:px-10 mb-20 grid lg:grid-cols-3 lg:gap-5">
                <article className="wysiwyg lg:col-span-2 mb-10 lg:mb-0">
                    <PortableText
                        value={body}
                        components={ptComponents}
                    />
                </article>
                <section>
                    <h3 className="text-2xl font-ropa p-5 bg-black bg-opacity-5 border-b-2 border-white">News</h3>
                    <ul>
                    {posts.length > 0 && posts.map(
                        ({ _id = '', title = '', slug = '' as any, publishedAt = '', summary = '', announcement = false }) => {
                            return slug && (
                                <li key={_id}>
                                    <Link href="/news/[slug]" as={`/news/${slug.current}`}>
                                        <a className="p-5 block bg-black bg-opacity-5 border-b border-white text-black">
                                            <h3 className="text-base font-ropa block uppercase opacity-50">{new Date(publishedAt).toDateString()}</h3>
                                            <h2 className="text-xl font-ropa text-black">{title}</h2>
                                        </a>
                                    </Link>
                                </li>
                            );
                        })
                    }
                    </ul>
                </section>
            </section>
        </>
    )
}

const query = groq`*[_type == "post" && slug.current == $slug][0]{
    title,
    "author": author->name,
    "categories": categories[]->title,
    "authorImage": author->image,
    body,
    publishedAt,
}`
export async function getStaticPaths() {
    const paths = await client.fetch(
        groq`*[_type == "post" && defined(slug.current)][].slug.current`
    )

    return {
        paths: paths.map((slug: any) => ({params: {slug}})),
        fallback: true,
    }
}

export async function getStaticProps(context: any) {
    const posts = await client.fetch(groq`
      *[_type == "post" && publishedAt < now()] | order(publishedAt desc) [0...10]
    `)

    const { slug = null } = context.params
    const post = await client.fetch(query, { slug })
    return {
        props: {
            posts,
            post
        }
    }
}
export default Post
