import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/future/image';
import groq from 'groq';
import client from '../client';

import type { NextPage } from 'next';

type Props = {
    announcement: {
        _id: string;
        title: string;
        slug: any;
        summary: string;
    };
    news: [];
};


const Index: NextPage<Props> = ({announcement, news}) => {

    const Announcement = () => {
        const {
            _id,
            title = '',
            slug = '',
            summary = '',
        } = announcement;

        return slug && (
            <article key={_id}>
                <h2 className="text-3xl font-ropa-bold"><Link href="/news/[slug]" as={`/news/${slug.current}`}><a className="text-black">{title}</a></Link></h2>
                <p className="opacity-75">{ summary }</p>
            </article>
        )
    };

    return (
      <>
        <Head>
            <title>Sitwell Cycling Club</title>
            <meta name="description" content="Founded 2016. Rotherham Advertiser Sports Awards Club of the Year 2018. 10 social rides a week. Go-Ride Coaching. Meet Brookside Pharmacy, Whiston." />
        </Head>

        <section className="updates grid gap-5 lg:grid-cols-4 px-5 lg:px-10 mb-20">
            <section className="announcements">
                <h3  className="w-full border-b-8 border-green mb-5 lg:mr-10"><span className="inline-block bg-green text-yellow text-md font-ropa uppercase pt-2 px-3">Announcements</span></h3>
                <Announcement />
            </section>
            <section className="news lg:col-span-3">
                <h3  className="w-full border-b-8 border-yellow mb-5"><span className="inline-block bg-yellow text-green text-md font-ropa uppercase pt-2 px-3">Don&apos;t miss this</span></h3>
                <div className="grid gap-5 md:grid-cols-3">
                {news.length > 0 && news.map(
                    ({ _id, title = '', slug = '' as any, summary = '' }) => {
                        return slug && (
                            <article key={_id}>
                                <h2 className="text-3xl font-ropa-bold"><Link href="/news/[slug]" as={`/news/${slug.current}`}><a className="text-black">{title}</a></Link></h2>
                                <p className="opacity-75">{ summary }</p>
                            </article>
                        )
                    }
                )}
                </div>
            </section>
        </section>

         <section className="media flex flex-row w-full flex-wrap px-5 lg:px-10 mb-10">
            <article className="club-rides block relative w-full lg:w-7/12 lg:pr-5 mb-10 h-96">
                <Link href="/rides" >
                    <a className="block w-full h-full overflow-hidden relative">
                        <Image src="/img/rides.webp" className="object-cover object-right w-full h-full" fill priority={true} alt="A landscape photograph of a sunset over Whiston with two Club riders up front" />
                        <div className="absolute left-0 bottom-0 text-white p-5">
                            <h3 className="font-ropa text-lg uppercase">Club rides</h3>
                            <h2 className="font-ropa text-3xl">We&apos;re here for the smiles, not&nbsp;the&nbsp;miles.</h2>
                            <p>Ten social rides a week on Wednesday evenings, and Saturday and Sunday mornings.</p>
                        </div>
                        <button className="btn absolute top-5 left-5" aria-label="Find out more">Find out more</button>
                    </a>
                </Link>
            </article>
            <article className="charity block relative w-full lg:w-5/12 lg:pl-5 mb-10 h-96">
                <Link href="/charity">
                    <a className="block w-full h-full overflow-hidden relative">
                        <Image src="/img/charity.webp" className="object-cover object-right w-full h-full" fill priority={true} alt="A landscape photograph of Club members at Rotherham Hospice" />
                        <div className="absolute bottom-0 left-0 text-white p-5">
                            <h3 className="font-ropa text-lg uppercase">Charity work</h3>
                            <h2 className="font-ropa text-3xl">We raise vital funds for&nbsp;local&nbsp;charities</h2>
                            <p>In 2019 we raised over £12,250 for Rotherham Hospice through a range of activities.</p>
                        </div>
                        <button className="btn absolute top-5 right-5" aria-label="Find out more">Find out more</button>
                    </a>
                </Link>
            </article>
            <article className="races block relative w-full lg:w-5/12 lg:pr-5 mb-10 h-96">
                <Link href="/races">
                    <a className="block w-full h-full overflow-hidden relative">
                        <Image src="/img/racing.webp" className="object-cover object-right w-full h-full" fill priority={true} alt="A photograph of Club member Joe Srike racing up Ulley Lane" />
                        <div className="absolute top-0 right-0 text-white text-right p-5 flex flex-col items-end">
                            <h3 className="font-ropa text-lg uppercase">Races</h3>
                            <h2 className="font-ropa text-3xl">
                                We host races.<br />
                                We support races.<br />
                                We race.
                            </h2>
                            <p className="w-3/5 lg:w-2/5 mb-2.5 self-end">Up hills, down hills, round tracks, circuits, and off road.</p>
                            <Image src="/img/epic-kitemark--white.webp" alt="Equality and Parity In Cycling" width="40" height="55" />
                        </div>
                        <button className="btn absolute right-5 bottom-5" aria-label="Find out more">Find out more</button>
                    </a>
                </Link>
            </article>
            <article className="coaching block relative w-full lg:w-7/12 lg:pl-5 mb-10 h-96">
                <Link href="/coaching">
                    <a className="block w-full h-full overflow-hidden relative">
                        <Image src="/img/coaching.webp" className="object-cover w-full h-full" fill priority={true} alt="A photograph of our Go-Ride coaching group listneing to intructions from a mix of club coaches" />
                        <div className="absolute bottom-0 left-0 text-white p-5">
                            <h3 className="font-ropa text-lg uppercase">Go-ride coaching</h3>
                            <h2 className="font-ropa text-3xl">We&apos;re coaching the&nbsp;next&nbsp;generation.</h2>
                            <p>Our Saturday morning sessions are suitable for under 16s.</p>
                        </div>
                        <button className="btn absolute right-5 bottom-5" aria-label="Find out more">Find out more</button>
                    </a>
                </Link>
            </article>
        </section>
      </>
    )
}

export async function getStaticProps() {
    const announcement = await client.fetch(groq`*[_type == "post" && publishedAt <= now() && announcement == true] | order(publishedAt desc) [0]`);
    const news = await client.fetch(groq`*[_type == "post" && publishedAt <= now() && announcement != true] | order(publishedAt desc) [0...3]`);

    return {
        props: {
            announcement,
            news
        }
    }
}

export default Index;
