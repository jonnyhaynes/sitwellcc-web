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
                <p className="mb-2.5 lg:w-3/4">Our Saturday morning sessions are suitable for under 16s who can ride a bike, be that a balance bike or pedal bike (without stabilisers).</p>
                <a href="https://www.tickettailor.com/events/sitwellcyclingclub/674381" className="btn btn--large">Book now</a>
            </section>
            <section className="coaching w-full px-5 lg:px-10 mb-20 grid md:gap-5 md:grid-cols-2 lg:grid-cols-4">
                <Image src="/img/coaching/one.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <Image src="/img/coaching/seven.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <Image src="/img/coaching/eight.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <Image src="/img/coaching/two.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <section className="mb-5 md:mb-0 md:col-span-2">
                    <h2 className="text-3xl font-ropa mb-2">Our Coaching Team</h2>
                    <section className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                        <article>
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Erin Avill" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Erin Avill</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 2 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Erin</a>
                        </article>
                        <article>
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Karen Avill" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Karen Avill</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 1 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Karen</a>
                        </article>
                        <article>
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Danni Cunningham" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Danni Haynes</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Volunteer Helper</h3>
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
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Activity Coach - Coaching in Context MTB XC</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Jude</a>
                        </article>
                        <article>
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Ted Daly" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Ted Daly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Activity Coach - Coaching in Context MTB XC</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Ted</a>
                        </article>
                        <article>
                            <Image src="/img/coaching/jonny.webp" alt="A portrait photograph of Jonny Haynes" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Jonny Haynes</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 2 MTB Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Jonny</a>
                        </article>
                        <article>
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Aaron Thomas" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Aaron Thomas</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Volunteer Helper</h3>
                        </article>
                        <article className="relative pb-8">
                            <Image src="/img/coaching/placeholder.webp" alt="A portrait photograph of Craig Wright" width="183" height="183" className="block mb-2.5" />
                            <h3 className="text-xl font-ropa">Craig Wright</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Welfare Officer</h3>
                        </article>
                    </section>
                </section>
                <section className="mb-5 md:mb-0 md:col-span-2 border-t-8 border-blue pt-5 px-5 bg-blue bg-opacity-5">
                    <h2 className="text-3xl font-ropa">British Cycling Coaching Framework</h2>
                    <p className="mb-2">Using the British Cycling Coaching Framework we teach your children the fundamentals of cycling before coaching them on more advanced mountain biking techniques. We do fun activities and games using cones, bean bags, balance boards, limbo bars, ramps etc to enhance the cycling skills of your child and give them a good foundation for the future.</p>
                    <p className="mb-2">Riders are given an opportunity to experience riding on local pump tracks and mountain bike trails including Canklow Woods, Parkwood Springs in Sheffield and Sherwood Pines.</p>
                    <p className="mb-2"><strong>Pedal sessions</strong> are for children who no longer use stabilisers or a balance bike and are looking to increase their confidence. Pedal sessions are run 10-11:15.</p>
                    <p className="mb-2">The <strong>Skills sessions</strong> are for children looking to increase their skills in a more technical environment. Skills sessions are run 10-11:15.</p>
                    <p className="mb-5">Our <strong>Balance sessions</strong> are for children new to cycling, who may have just had their stabilisers taken off or who are still using a balance bike. Balance sessions are run 11:15-11:45 and 11:45-12:15. There is a high waiting list due to high demand, please enquire at <a href="mailto:coaching@sitwell.cc">coaching@sitwell.cc</a>.</p>
                    <h2 className="text-3xl font-ropa">Cost</h2>
                    <p className="mb-2">Sessions cost £3 for non-members and £2 for club members. Book a place through Ticket Tailor using the button below. When booking, please let us know your child&apos;s name for the booking.</p>
                    <p className="mb-2"><Link href="/membership"><a>Under 16s membership</a></Link> is now available.</p>
                    <a href="https://www.tickettailor.com/events/sitwellcyclingclub/674381" className="btn mb-2.5">Book now</a>
                    <p className="mb-2">We&apos;ll also need you to fill in a parental consent form for each child and email it to <a href="coaching@sitwell.cc">coaching@sitwell.cc</a>, please.</p>
                    <section className="mb-5 grid md:grid-cols-2 md:gap-2">
                        <a href="https://www.britishcycling.org.uk/zuvvi/media/bc_files/go_ride_racing_docs/2018/Go_Ride_PARENTAL_CONSENT_NOTICE_2018_V3.pdf" className="bg-black bg-opacity-5 p-2.5 inline-flex flex-row items-center">
                            <Image src="/img/pdf.svg" width="30" height="30" alt="" />
                            <h3 className="text-sm ml-2.5">British Cycling Go-Ride Coaching Parental Consent and Data Protection Form</h3>
                        </a>
                    </section>
                    <h2 className="text-3xl font-ropa">Herringthorpe</h2>
                    <p className="mb-2">Usually meeting on the car park unless there is an event at the stadium. Please look out for the SCC signs on barriers, tent or flag.</p>
                    <p className="mb-2">There is normally plenty of space on the car park, but if the car park is busy there is also free off street parking available on Middle Lane South towards the junction with Dryden Road.</p>
                    <p className="mb-5">We announce the week before on social media and our WhatsApp group where we&apos;ll be on Herringthorpe or if we will be at an alternate location.</p>
                    <h2 className="text-3xl font-ropa">Requirements</h2>
                    <p className="mb-2">There&apos;s no minimum age requirement for these sessions, however your child needs to be able to follow instructions and maintain focus during a 45 minute session. Our youngest member is three years old. If you&apos;re not sure, bring them along. We can provide advice and guidance no matter what their cycling ability. <em>Our aim is to enhance your child&apos;s riding skills and grow their confidence.</em></p>
                    <p className="mb-5">They will need a bike with working brakes (if a pedal bike) and the bar ends need to be plugged. As well as a correctly fitting helmet. We are building a small library of bikes, available for loan during coaching sessions to children who don&apos;t have a suitable bike of their own. Please contact us if you need to borrow a bike and hopefully we can help.</p>
                    <h2 className="text-3xl font-ropa">Limitless Champion Club</h2>
                    <p className="mb-5">Limitless is British Cycling&apos;s disability and para-cycling programme. Sitwell Cycling Club has been approved by British Cycling as a Limitless Champion Club. Where possible we aim to create a positive, inclusive and welcoming environment for disabled riders. We do not have adapted bikes and may have to signpost riders to Limitless Focus Clubs as appropriate. Children with autism, ADHD and coordination disorders have thrived attending our Go-Ride coaching sessions.</p>
                    <h2 className="text-3xl font-ropa">Rotherham Children&apos;s University</h2>
                    <p className="mb-5">We are proud to be a validated Learning Destination. Collect CU credits at our activities with your Passport to Learning. There is more on <a href="https://www.childrensuniversity.co.uk/universities/rotherham-childrens-university/">Rotherham Children&apos;s University</a> here.</p>
                    <h2 className="text-3xl font-ropa">The Coalfields Regeneration Trust</h2>
                    <p className="mb-5">The Coalfields Regeneration Trust has provided funding to train three British Cycling Level 1 coaches and progress three coaches to Level 2. More can be found on <a href="https://www.coalfields-regen.org.uk/">The Coalfields Regeneration Trust</a> here.</p>
                    <h2 className="text-3xl font-ropa">Community Leadership Fund</h2>
                    <p className="mb-5">Rotherham East ward have provided funding to train two new coaches in emergency first aid.</p>
                    <h2 className="text-3xl font-ropa">Safeguarding</h2>
                    <p className="mb-2">All coaches hold relevant qualifications and insurance through British Cycling. They are first aid trained, DBS checked and they&apos;ve done safeguarding training.</p>
                    <p className="mb-5">We also have <Link href="/welfare"><a>Club Welfare Officers</a></Link> and follow British Cycling&apos;s Safeguarding policies.</p>
                </section>
                <Image src="/img/coaching/nine.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <Image src="/img/coaching/three.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <Image src="/img/coaching/five.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <Image src="/img/coaching/four.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <Image src="/img/coaching/six.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <Image src="/img/coaching/ten.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <Image src="/img/coaching/eleven.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
                <Image src="/img/coaching/twelve.webp" alt="An action shot from a Go-Ride coaching session" width="285" height="285" className="block w-full mb-5 md:mb-0" />
            </section>
        </>
    )
}

export default Coaching;
