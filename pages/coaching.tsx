import Head from 'next/head';
import Image from 'next/future/image';
import Link from 'next/link';

import type { NextPage } from 'next';

const Coaching: NextPage = () => {
    return (
        <>
            <Head>
                <title>Go-Ride coaching // Sitwell Cycling Club</title>
                <meta name="description" content="We're coaching the next generation." />
            </Head>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold mb-5">Go-Ride coaching</h1>
                <h2 className="text-3xl font-ropa">We&apos;re coaching the next generation.</h2>
                <p className="mb-2.5 lg:w-3/4">Our Saturday morning sessions are suitable for under 16s, although we can take 12-15 year olds on club rides. Sessions are primarily aimed at under 12s who can ride a bike, be that a balance bike or pedal bike (without stabilisers).</p>
                <a href="https://www.tickettailor.com/events/sitwellcyclingclub/674381" className="btn btn--large">Book now</a>
            </section>
            <section className="coaching w-full px-5 lg:px-10 mb-20 grid md:gap-5 md:grid-cols-2 lg:grid-cols-4">
                <Image src="/img/coaching/one.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <Image src="/img/coaching/seven.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <Image src="/img/coaching/eight.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <Image src="/img/coaching/two.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <section className="mb-5 md:mb-0 md:col-span-2">
                    <h2 className="text-3xl font-ropa mb-2">Our Coaching Team</h2>
                    <section className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                        <article>
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Erin Avill" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Erin Avill</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 1 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Erin</a>
                        </article>
                        <article>
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Karen Avill" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Karen Avill</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Volunteer</h3>
                        </article>
                        <article>
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Pete Chester" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Pete Chester</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Level 2 Trainee</h3>
                        </article>
                        <article>
                            <Image src="/img/coaching/george.webp" alt="A portrait photograph of George Daly" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">George Daly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 1 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact George</a>
                        </article>
                        <article>
                            <Image src="/img/jude.webp" alt="A portrait photograph of Jude Daly" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Jude Daly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 2 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Jude</a>
                        </article>
                        <article>
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Chris Gauntlett" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Chris Gauntlett</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 1 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Chris</a>
                        </article>
                        <article>
                            <Image src="/img/coaching/jonny.webp" alt="A portrait photograph of Jonny Haynes" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Jonny Haynes</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 2 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Jonny</a>
                        </article>
                        <article>
                            <Image src="/img/david.webp" alt="A portrait photograph of David Hush" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">David Hush</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Welfare Officer</h3>
                        </article>
                        <article>
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Julie Skubala" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Julie Skubala</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 2 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Julie</a>
                        </article>
                    </section>
                </section>
                <section className="mb-5 md:mb-0 md:col-span-2 border-t-8 border-blue pt-5 px-5 bg-blue bg-opacity-5">
                    <h2 className="text-3xl font-ropa">Talent Development</h2>
                    <p className="mb-2">Using the British Cycling talent development pathways we teach your children the fundamentals of cycling before coaching them on their favoured discipline. We do fun activities and games using cones, bean bags, tennis balls, limbo bars, ramps etc to enhance the cycling skills of your child and give them a good foundation for the future.</p>
                    <p className="mb-2">Our more advanced students are using BMX style pump tracks, taking on trail centers and we&apos;re looking this year how to get some road cycling done on quiet lanes.</p>
                    <p className="mb-2"><strong>Pedal sessions</strong> are for children who no longer use stabilisers or a balance bike and are looking to increase their confidence. Pedal sessions are run 10-11:15.</p>
                    <p className="mb-5">Our <strong>Balance sessions</strong> are for children new to cycling, who may have just had their stabilisers taken off or who are still using a balance bike. Balance sessions are run 11:15-12.</p>
                    <h2 className="text-3xl font-ropa">Cost</h2>
                    <p className="mb-2">Sessions cost £3 for non-members and £2 for club members. Book a place through Ticket Tailor using the button below. When booking, please let us know your child&apos;s name for the booking.</p>
                    <p className="mb-2"><Link href="/membership"><a>Under 12s membership</a></Link> is now an option at a discounted £5 for the year.</p>
                    <a href="https://www.tickettailor.com/events/sitwellcyclingclub/674381" className="btn mb-2.5">Book now</a>
                    <p className="mb-2">We&apos;ll also need you to fill in a parental consent form for each child and email it to <a href="coaching@sitwell.cc">coaching@sitwell.cc</a>, please.</p>
                    <section className="mb-5 grid md:grid-cols-2 md:gap-2">
                        <a href="https://www.britishcycling.org.uk/zuvvi/media/bc_files/go_ride_racing_docs/2018/Go_Ride_PARENTAL_CONSENT_NOTICE_2018_V3.pdf" className="bg-black bg-opacity-5 p-2.5 inline-flex flex-row items-center">
                            <Image src="/img/pdf.svg" width="30" height="30" alt="" />
                            <h3 className="text-sm ml-2.5">British Cycling Go-Ride Coaching Parental Consent and Data Protection Form</h3>
                        </a>
                    </section>
                    <h2 className="text-3xl font-ropa">Herringthorpe</h2>
                    <p className="mb-2">We use various sections of Herringthorpe Playing Fields. Please lookout for the SCC tent or flag.</p>
                    <p className="mb-5">Free off-street parking is available just off Middle Lane South towards the junction with Dryden Road.</p>
                    <h2 className="text-3xl font-ropa">Requirements</h2>
                    <p className="mb-2">There&apos;s no minimum age requirement for these sessions other than can your child follow instructions. Our youngest member is three years old. These aren&apos;t sessions for teaching your child to ride a bike, but to enhance their skills and grow their confidence. If you&apos;re not sure, bring them along. We can provide advice and guidance no matter what their cycling ability.</p>
                    <p className="mb-5">They will need a bike with working brakes (if a pedal bike) and the bar ends need to be plugged. As well as a correctly fitting helmet.</p>
                    <h2 className="text-3xl font-ropa">Rotherham Children&apos;s University</h2>
                    <p className="mb-5">We are proud to be a validated Learning Destination. Collect CU credits at our activities with your Passport to Learning. There is more on <a href="https://www.childrensuniversity.co.uk/universities/rotherham-childrens-university/">Rotherham Children&apos;s University</a> here.</p>
                    <h2 className="text-3xl font-ropa">The Coalfields Regeneration Trust</h2>
                    <p className="mb-5">The Coalfields Regeneration Trust has provided funding to train 3 British Cycling Level 1 coaches and progress 3 coaches to Level 2. More can be found on <a href="https://www.coalfields-regen.org.uk/">The Coalfields Regeneration Trust</a> here.</p>
                    <h2 className="text-3xl font-ropa">Safeguarding</h2>
                    <p className="mb-2">All coaches hold relevant qualifications and insurance through British Cycling. They are first aid trained, DBS checked and they&apos;ve done safeguarding training.</p>
                    <p className="mb-5">We also have <Link href="/welfare"><a>Club Welfare Officers</a></Link> and follow British Cycling&apos;s Safeguarding policies.</p>
                </section>
                <Image src="/img/coaching/nine.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <Image src="/img/coaching/three.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <Image src="/img/coaching/five.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <Image src="/img/coaching/four.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <Image src="/img/coaching/six.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <Image src="/img/coaching/ten.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <Image src="/img/coaching/eleven.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
                <Image src="/img/coaching/twelve.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block mb-5 md:mb-0" />
            </section>
        </>
    )
}

export default Coaching;
