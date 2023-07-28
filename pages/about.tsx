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
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Phil Daly" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Phil Daly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Club Vice Captain</h3>
                            <a href="mailto:vice.captain@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Phil</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Nev Fletcher" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Nev Fletcher</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Member</h3>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of James Fox" width="285" height="285" />
                            <h3 className="text-xl font-ropa">James Fox</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Vice Chair <br /> Community Liaison Officer</h3>
                            <a href="mailto:community@sitwell.cc" className="btn absolute left-0 bottom-0">Contact James</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Paul Haigh" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Paul Haigh</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Club Captain</h3>
                            <a href="mailto:captain@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Paul</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/jonny.webp" alt="A portrait photograph of Jonny Haynes" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Jonny Haynes</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Chair <br/> BC Racing Officer</h3>
                            <a href="mailto:bc.racing@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Jonny</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/david.webp" alt="A portrait photograph of David Hush" width="285" height="285" />
                            <h3 className="text-xl font-ropa">David Hush</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2">Welfare Officer</h3>
                            <a href="mailto:welfare@sitwell.cc" className="btn absolute left-0 bottom-0">Contact David</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Andy Laidler" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Andy Laidler</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Vice Chair <br /> CTT Racing Officer</h3>
                            <a href="mailto:ctt.racing@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Andy</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Rebecca Laidler" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Rebecca Laidler</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Socials Officer</h3>
                            <a href="mailto:socials@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Rebecca</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Janice McWillliam" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Janice McWilliam</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Travel Officer</h3>
                            <a href="mailto:travel@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Janice</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/committee/rob.webp" alt="A portrait photograph of Rob O'Reilly" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Rob O&apos;Reilly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Membership Officer</h3>
                            <a href="mailto:membership@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Rob</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Phil Smith" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Phil Smith</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Kit Officer</h3>
                            <a href="mailto:kit@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Phil</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/claire.webp" alt="A portrait photograph of Claire Wardle" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Claire Wardle</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2">Welfare Officer</h3>
                            <a href="mailto:welfare@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Claire</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Mark Weston" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Mark Weston</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Treasurer</h3>
                            <a href="mailto:treasurer@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Mark</a>
                        </article>
                        <article className="relative pb-8">
                            <Image className="block w-full mb-2.5" src="/img/coaching/placeholder.webp" alt="A portrait photograph of Craig Wright" width="285" height="285" />
                            <h3 className="text-xl font-ropa">Craig Wright</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Competitions Officer</h3>
                            <a href="mailto:competitions@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Craig</a>
                        </article>
                    </section>
                </section>
                <History />
            </section>
        </>
    )
}

export default About;
