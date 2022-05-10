import Head from 'next/head'

const Coaching = () => {
    return (
        <>
            <Head>
                <title>Go-Ride coaching // Sitwell Cycling Club</title>
                <meta name="description" content="We're coaching the next generation." />
            </Head>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold mb-5">Go-Ride coaching</h1>
                <h2 className="text-3xl font-ropa">We’re coaching the next generation.</h2>
                <p className="text-sm mb-2.5 lg:w-3/4">Our Saturday morning sessions are suitable for under 16s, although we can take 12-15 year olds on club rides. Sessions are primarily aimed at under 12s who can ride a bike, be that a balance bike or pedal bike (without stabilisers).</p>
                <a href="https://www.tickettailor.com/events/sitwellcyclingclub/674381" className="btn btn--large">Book now</a>
            </section>
            <section className="coaching w-full px-5 lg:px-10 mb-20 grid md:gap-5 md:grid-cols-2 lg:grid-cols-4">
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/one.webp" type="image/webp" />
                    <img src="/img/coaching/one.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/seven.webp" type="image/webp" />
                    <img src="/img/coaching/seven.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/eight.webp" type="image/webp" />
                    <img src="/img/coaching/eight.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/two.webp" type="image/webp" />
                    <img src="/img/coaching/two.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <section className="mb-5 md:mb-0 md:col-span-2">
                    <h2 className="text-3xl font-ropa mb-2">Our Coaching Team</h2>
                    <section className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                        <article>
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Erin Avill" />
                            </picture>
                            <h3 className="text-xl font-ropa">Erin Avill</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 1 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Erin</a>
                        </article>
                        <article>
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Pete Chester" />
                            </picture>
                            <h3 className="text-xl font-ropa">Pete Chester</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Level 2 Trainee</h3>
                        </article>
                        <article>
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/george.webp" type="image/webp" />
                                <img src="/img/coaching/george.png" alt="A portrait photograph of George Daly" />
                            </picture>
                            <h3 className="text-xl font-ropa">George Daly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Level 1 Coach</h3>
                        </article>
                        <article>
                            <picture className="block mb-2.5">
                                <source srcSet="/img/jude.webp" type="image/webp" />
                                <img src="/img/jude.jpg" alt="A portrait photograph of Jude Daly" />
                            </picture>
                            <h3 className="text-xl font-ropa">Jude Daly</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 2 Trainee</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Jude</a>
                        </article>
                        <article>
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Chris Gauntlett" />
                            </picture>
                            <h3 className="text-xl font-ropa">Chris Gauntlett</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 1 Coach</h3>
                        </article>
                        <article>
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/jonny.webp" type="image/webp" />
                                <img src="/img/coaching/jonny.png" alt="A portrait photograph of Jonny Haynes" />
                            </picture>
                            <h3 className="text-xl font-ropa">Jonny Haynes</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 2 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Jonny</a>
                        </article>
                        <article>
                            <picture className="block mb-2.5">
                                <source srcSet="/img/david.webp" type="image/webp" />
                                <img src="/img/david.jpg" alt="A portrait photograph of David Hush" />
                            </picture>
                            <h3 className="text-xl font-ropa">David Hush</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50">Welfare Officer</h3>
                        </article>
                        <article>
                            <picture className="block mb-2.5">
                                <source srcSet="/img/coaching/placeholder.webp" type="image/webp" />
                                <img src="/img/coaching/placeholder.png" alt="A portrait photograph of Julie Skubala" />
                            </picture>
                            <h3 className="text-xl font-ropa">Julie Skubala</h3>
                            <h3 className="text-base font-ropa block uppercase opacity-50 mb-2.5">Level 2 Coach</h3>
                            <a href="mailto:coaching@sitwell.cc" className="btn">Contact Julie</a>
                        </article>
                    </section>
                </section>
                <section className="mb-5 md:mb-0 md:col-span-2 border-t-8 border-blue pt-5 px-5 bg-blue bg-opacity-5">
                    <h2 className="text-3xl font-ropa">Talent Development</h2>
                    <p className="text-sm mb-2">Using the British Cycling talent development pathways we teach your children the fundamentals of cycling before coaching them on their favoured discipline. We do fun activities and games using cones, bean bags, tennis balls, limbo bars, ramps etc to enhance the cycling skills of your child and give them a good foundation for the future.</p>
                    <p className="text-sm mb-2">Our more advanced students are using BMX style pump tracks, taking on trail centers and we're looking this year how to get some road cycling done on quiet lanes.</p>
                    <p className="text-sm mb-2"><strong>Pedal sessions</strong> are for children who no longer use stabilisers or a balance bike and are looking to increase their confidence. Pedal sessions are run 10-11:15.</p>
                    <p className="text-sm mb-5">Our <strong>Balance sessions</strong> are for children new to cycling, who may have just had their stabilisers taken off or who are still using a balance bike. Balance sessions are run 11:15-12.</p>
                    <h2 className="text-3xl font-ropa">Cost</h2>
                    <p className="text-sm mb-2">Sessions cost £3 for non-members and £2 for club members. Book a place through Ticket Tailor using the button below. When booking, please let us know your child's name for the booking.</p>
                    <p className="text-sm mb-2"><a href="/membership">Under 12s membership</a> is now an option at a discounted £5 for the year.</p>
                    <a href="https://www.tickettailor.com/events/sitwellcyclingclub/674381" className="btn mb-2.5">Book now</a>
                    <p className="text-sm mb-2">We'll also need you to fill in a parental consent form for each child and email it to <a href="coaching@sitwell.cc">coaching@sitwell.cc</a>, please.</p>
                    <section className="mb-5 grid md:grid-cols-2 md:gap-2">
                        <a href="https://www.britishcycling.org.uk/zuvvi/media/bc_files/go_ride_racing_docs/2018/Go_Ride_PARENTAL_CONSENT_NOTICE_2018_V3.pdf" className="bg-black bg-opacity-5 p-2.5 inline-flex flex-row items-center">
                            <img src="/img/pdf.svg" width="30" className="mr-2.5" />
                            <h3 className="text-sm">British Cycling Go-Ride Coaching Parental Consent and Data Protection Form</h3>
                        </a>
                    </section>
                    <h2 className="text-3xl font-ropa">Herringthorpe</h2>
                    <p className="text-sm mb-2">We use various sections of Herringthorpe Playing Fields. Please lookout for the SCC tent or flag.</p>
                    <p className="text-sm mb-5">Free off-street parking is available just off Middle Lane South towards the junction with Dryden Road.</p>
                    <h2 className="text-3xl font-ropa">Clifton</h2>
                    <p className="text-sm mb-2">We use Clifton Community School's hard courts for when we wabt to teach skills that require fast rolling tarmac.</p>
                    <p className="text-sm mb-5">Free off-street parking is available in the school's car park off Middle Lane South.</p>
                    <h2 className="text-3xl font-ropa">Requirements</h2>
                    <p className="text-sm mb-2">There’s no minimum age requirement for these sessions other than can your child follow instructions. Our youngest member is three years old. These aren’t sessions for teaching your child to ride a bike, but to enhance their skills and grow their confidence. If you're not sure, bring them along. We can provide advice and guidance no matter what their cycling ability.</p>
                    <p className="text-sm mb-5">They will need a bike with working brakes (if a pedal bike) and the bar ends need to be plugged. As well as a correctly fitting helmet.</p>
                    <h2 className="text-3xl font-ropa">Safeguarding</h2>
                    <p className="text-sm mb-2">All coaches hold relevant qualifications and insurance through British Cycling. They are first aid trained, DBS checked and they've done safeguarding training.</p>
                    <p className="text-sm mb-5">We also have <a href="/welfare">Club Welfare Officers</a> and follow British Cycling's Safeguarding policies.</p>
                </section>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/nine.webp" type="image/webp" />
                    <img src="/img/coaching/nine.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/three.webp" type="image/webp" />
                    <img src="/img/coaching/three.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/five.webp" type="image/webp" />
                    <img src="/img/coaching/five.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/four.webp" type="image/webp" />
                    <img src="/img/coaching/four.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/six.webp" type="image/webp" />
                    <img src="/img/coaching/six.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/ten.webp" type="image/webp" />
                    <img src="/img/coaching/ten.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/eleven.webp" type="image/webp" />
                    <img src="/img/coaching/eleven.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
                <picture className="block mb-5 md:mb-0">
                    <source srcSet="/img/coaching/twelve.webp" type="image/webp" />
                    <img src="/img/coaching/twelve.jpg" alt="An action shot from a Go-Ride coaching session" />
                </picture>
            </section>
        </>
    )
}

export default Coaching;
