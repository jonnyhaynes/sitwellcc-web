import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/future/image';
import History from './components/history';

import type { NextPage } from 'next';

const About: NextPage = () => {
    return (
        <>
            <Head>
                <title>About // Sitwell Cycling Club</title>
                <meta name="description" content="Rotherham's award-winning Go-Ride club." />
            </Head>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold mb-5">Sitwell Cycling Club</h1>
                <h2 className="text-3xl font-ropa">Rotherham&apos;s award-winning Go-Ride club.</h2>
                <p className="lg:w-3/4">Offering nine social rides a week, Go-Ride coaching sessions for under 16s, monthly socials and overseas trips. Some of us race, but most of us are just here for the coffee and the cake. We ride on road and off-road. There&apos;s something for everyone, so <Link href="/contact"><a>contact us</a></Link> now to see what you&apos;re missing.</p>
            </section>
            <section className="rides w-full px-5 lg:px-10 mb-20 grid md:gap-5 md:grid-cols-2">
                <section>
                    <section>
                        <h2 className="text-3xl font-ropa">Committee</h2>
                        <p className="mb-2">The Club is managed by a Committee. The Committee is responsible for the Club, its funds, property and affairs.</p>
                        <p className="mb-5">The Committee is made up of four elected positions and co-opted Officers. Votes - if necessary - take place at each AGM to elect the Committee.</p>
                        <h3 className="text-2xl font-ropa">Meetings</h3>
                        <p className="mb-5">Committee meetings are held at The Sitwell Arms, usually on the first Monday of the month, unless it&apos;s a Bank Holiday. Club members are more than welcome to attend to discuss any issues they have.</p>
                        <h3 className="text-2xl font-ropa mb-1">Members</h3>
                    </section>
                    <section className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/jude.webp" alt="A portrait photograph of Jude Daly" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Jude Daly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2">Club Coach</h3>
                            <a href="mailto:coach@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Jude</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Ted Daly" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Ted Daly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Treasurer and <br /> Membership Officer</h3>
                            <a href="mailto:membership@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Ted</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Janice McWillliam" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Janice McWilliam</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Chair</h3>
                            <a href="mailto:chair@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Janice</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Andy Moulster" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Andy Moulster</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Club Captain</h3>
                            <a href="mailto:captain@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Andy</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Phil Smith" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Phil Smith</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Kit Officer</h3>
                            <a href="mailto:kit@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Phil</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Craig Wright" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Craig Wright</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Welfare Officer</h3>
                            <a href="mailto:welfare@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Craig</a>
                        </article>
                    </section>
                </section>
                <History />
            </section>
        </>
    )
}

export default About;
