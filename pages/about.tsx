import Head from 'next/head'

import History from './components/history';

const About = () => {
    return (
        <>
            <Head>
                <title>About // Sitwell Cycling Club</title>
                <meta name="description" content="Rotherham's award-winning Go-Ride club." />
            </Head>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold mb-5">Sitwell Cycling Club</h1>
                <h2 className="text-3xl font-ropa">Rotherham's award-winning Go-Ride club.</h2>
                <p className="text-sm lg:w-3/4">Offering nine social rides a week, Go-Ride coaching sessions for under 16s, monthly socials and overseas trips. Some of us race, but most of us are just here for the coffee and the cake. We ride on road and off-road. There's something for everyone, so <a href="/contact">contact us</a> now to see what you're missing.</p>
            </section>
            <section className="rides w-full px-5 lg:px-10 mb-20 grid md:gap-5 md:grid-cols-2">
                <section>
                    <section>
                        <h2 className="text-3xl font-ropa">Committee</h2>
                        <p className="text-sm mb-2">The Club is managed by a Committee. The Committee is responsible for the Club, its funds, property and affairs.</p>
                        <p className="text-sm mb-5">The Committee is made up of four elected positions and co-opted Officers. Votes - if necessary - take place at each AGM to elect the Committee.</p>
                        <h3 className="text-2xl font-ropa">Meetings</h3>
                        <p className="text-sm mb-5">Committee meetings are held at The Sitwell Arms, usually on the first Monday of the month, unless it's a Bank Holiday. Club members are more than welcome to attend to discuss any issues they have.</p>
                        <h3 className="text-2xl font-ropa mb-1">Members</h3>
                    </section>
                    <section className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/jude.webp" type="image/webp" />
                                <img src="/img/coaching/jude.jpg" alt="A portrait photograph of Jude Daly" />
                            </picture>
                            <h3 className="text-xl font-ropa">Jude Daly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2">Club Coach</h3>
                            <a href="mailto:coach@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Jude</a>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Phil Daly" />
                            </picture>
                            <h3 className="text-xl font-ropa">Phil Daly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Club Vice Captain</h3>
                            <a href="mailto:vice.captain@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Phil</a>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Nev Fletcher" />
                            </picture>
                            <h3 className="text-xl font-ropa">Nev Fletcher</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Member</h3>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of James Fox" />
                            </picture>
                            <h3 className="text-xl font-ropa">James Fox</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Vice Chair <br /> Community Liaison Officer</h3>
                            <a href="mailto:community@sitwell.cc" className="btn absolute left-0 bottom-0">Contact James</a>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Paul Haigh" />
                            </picture>
                            <h3 className="text-xl font-ropa">Paul Haigh</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Club Captain</h3>
                            <a href="mailto:captain@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Paul</a>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/jonny.webp" type="image/webp" />
                                <img src="/img/coaching/jonny.png" alt="A portrait photograph of Jonny Haynes" />
                            </picture>
                            <h3 className="text-xl font-ropa">Jonny Haynes</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Chair <br/> BC Racing Officer</h3>
                            <a href="mailto:bc.racing@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Jonny</a>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Andy Laidler" />
                            </picture>
                            <h3 className="text-xl font-ropa">Andy Laidler</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Vice Chair <br /> CTT Racing Officer</h3>
                            <a href="mailto:ctt.racing@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Andy</a>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Rebecca Laidler" />
                            </picture>
                            <h3 className="text-xl font-ropa">Rebecca Laidler</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Socials Officer</h3>
                            <a href="mailto:socials@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Rebecca</a>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Janice McWilliam" />
                            </picture>
                            <h3 className="text-xl font-ropa">Janice McWilliam</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Travel Officer</h3>
                            <a href="mailto:travel@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Janice</a>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Sarah Morton" />
                            </picture>
                            <h3 className="text-xl font-ropa">Sarah Morton</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Member</h3>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/committee/rob.webp" type="image/webp" />
                                <img src="/img/committee/rob.png" alt="A portrait photograph of Rob O'Reilly" />
                            </picture>
                            <h3 className="text-xl font-ropa">Rob O'Reilly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Membership Officer</h3>
                            <a href="mailto:membership@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Rob</a>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Phil Smith" />
                            </picture>
                            <h3 className="text-xl font-ropa">Phil Smith</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Kit Officer</h3>
                            <a href="mailto:kit@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Phil</a>
                        </article>
                        <article className="relative pb-8">
                            <img src="/img/coaching/placeholder.png" className="mb-2.5" alt="A portrait photograph of David Southwood" />
                            <h3 className="text-xl font-ropa">David Southwood</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Member</h3>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Mark Weston" />
                            </picture>
                            <h3 className="text-xl font-ropa">Mark Weston</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Treasurer</h3>
                            <a href="mailto:treasurer@sitwell.cc" className="btn absolute left-0 bottom-0">Contact Mark</a>
                        </article>
                        <article className="relative pb-8">
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Craig Wright" />
                            </picture>
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
