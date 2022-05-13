import Head from 'next/head';

import type { NextPage } from 'next';

const Membership: NextPage = () => {
    return (
        <>
            <Head>
                <title>Membership // Sitwell Cycling Club</title>
                <meta name="description" content="For the good times!" />
            </Head>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold mb-5">Membership</h1>
                <h2 className="text-3xl font-ropa">For the good times!</h2>
                <p className="text-sm lg:w-3/4">You're more than welcome to come along for a couple of rides before deciding if we're the club for you, but we think our membership is great value for money. Membership runs January - December, and if you join from October onwards you'll be credited with the following year. Benefits include discounts on bike servicing and parts, bike fits, sports nutrition, bike insurance, and skincare, as well as access to club kit, socials and awards amongst a whole host of other things. First year members receive a club branded buff, stickers and <a href="https://onelifeid.com/">OneLifeiD</a> tags.</p>
            </section>
            <section className="membership w-full px-5 lg:px-10 mb-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <picture className="block w-full">
                    <source srcSet="/img/membership/zero.webp" type="image/webp" />
                    <img src="/img/membership/zero.jpg" alt="A photograph of members" />
                </picture>
                <picture className="block w-full">
                    <source srcSet="/img/membership/one.webp" type="image/webp" />
                    <img src="/img/membership/one.jpg" alt="A photograph of members" />
                </picture>
                <picture className="block w-full">
                    <source srcSet="/img/membership/two.webp" type="image/webp" />
                    <img src="/img/membership/two.jpg" alt="A photograph of members" />
                </picture>
                <picture className="block w-full">
                    <source srcSet="/img/membership/three.webp" type="image/webp" />
                    <img src="/img/membership/three.jpg" alt="A photograph of members" />
                </picture>
                <section className="md:col-span-2 lg:col-span-4 grid gap-5 md:grid-cols-5">
                    <div className="md:py-5 flex">
                        <div className="bg-yellow bg-opacity-25 p-5 w-full flex flex-col content-center justify-center">
                            <h3 className="text-base font-ropa block uppercase opacity-50">0-11</h3>
                            <h2 className="text-2xl font-ropa">Under 12</h2>
                            <h3 className="text-large font-ropa block uppercase opacity-75">£5</h3>
                            <p className="text-xs">Go-Ride Coaching</p>
                            <p className="text-xs mb-5"><del>Club rides</del></p>
                            <a className="btn self-start" href="https://www.britishcycling.org.uk/club/subscriptions/buy?club_id=7596&subscription_id=2962">Buy now</a>
                        </div>
                    </div>
                    <div className="md:py-5 flex">
                        <div className="bg-yellow bg-opacity-25 p-5 w-full flex flex-col content-center justify-center">
                            <h3 className="text-base font-ropa block uppercase opacity-50">12-15</h3>
                            <h2 className="text-2xl font-ropa">Youth</h2>
                            <h3 className="text-large font-ropa block uppercase opacity-75">£10</h3>
                            <p className="text-xs">Go-Ride Coaching</p>
                            <p className="text-xs mb-5">Club rides with parent/guardian</p>
                            <a className="btn self-start" href="https://www.britishcycling.org.uk/club/subscriptions/buy?club_id=7596&subscription_id=2961">Buy now</a>
                        </div>
                    </div>
                    <div className="md:py-5 flex">
                        <div className="bg-yellow bg-opacity-25 p-5 w-full flex flex-col content-center justify-center">
                            <h3 className="text-base font-ropa block uppercase opacity-50">16-17</h3>
                            <h2 className="text-2xl font-ropa">Junior</h2>
                            <h3 className="text-large font-ropa block uppercase opacity-75">£15</h3>
                            <p className="text-xs"><del>Go-Ride Coaching</del></p>
                            <p className="text-xs mb-5">Club rides</p>
                            <a className="btn self-start" href="https://www.britishcycling.org.uk/club/subscriptions/buy?club_id=7596&subscription_id=2930">Buy now</a>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="bg-green bg-opacity-25 p-5 w-full flex flex-col content-center justify-center">
                            <h3 className="text-base font-ropa block uppercase opacity-50">18+</h3>
                            <h2 className="text-2xl font-ropa">Adult</h2>
                            <h3 className="text-large font-ropa block uppercase opacity-75">£20</h3>
                            <p className="text-xs"><del>Go-Ride Coaching</del></p>
                            <p className="text-xs mb-5">Club rides</p>
                            <a className="btn self-start" href="https://www.britishcycling.org.uk/club/subscriptions/buy?club_id=7596&subscription_id=1558">Buy now</a>
                        </div>
                    </div>
                    <div className="md:py-5 flex">
                        <div className="bg-yellow bg-opacity-25 p-5 w-full flex flex-col content-center justify-center">
                            <h3 className="text-base font-ropa block uppercase opacity-50">0+</h3>
                            <h2 className="text-2xl font-ropa">Volunteer</h2>
                            <h3 className="text-large font-ropa block uppercase opacity-75">£5</h3>
                            <p className="text-xs"><del>Go-Ride Coaching</del></p>
                            <p className="text-xs mb-5"><del>Club rides</del></p>
                            <a className="btn self-start" href="https://www.britishcycling.org.uk/club/subscriptions/buy?club_id=7596&subscription_id=2964">Buy now</a>
                        </div>
                    </div>
                </section>
                <p className="md:col-span-2 lg:col-span-4 text-center text-xs opacity-50">*All membership is subject to a £1 processing fee by British Cycling</p>
                <picture className="block w-full">
                    <source srcSet="/img/membership/four.webp" type="image/webp" />
                    <img src="/img/membership/four.jpg" alt="A photograph of members" />
                </picture>
                <picture className="block w-full">
                    <source srcSet="/img/membership/five.webp" type="image/webp" />
                    <img src="/img/membership/five.jpg" alt="A photograph of members" />
                </picture>
                <picture className="block w-full">
                    <source srcSet="/img/membership/six.webp" type="image/webp" />
                    <img src="/img/membership/six.jpg" alt="A photograph of members" />
                </picture>
                <picture className="block w-full">
                    <source srcSet="/img/membership/seven.webp" type="image/webp" />
                    <img src="/img/membership/seven.jpg" alt="A photograph of members" />
                </picture>
                <picture className="block w-full">
                    <source srcSet="/img/membership/eight.webp" type="image/webp" />
                    <img src="/img/membership/eight.jpg" alt="A photograph of members" />
                </picture>
                <picture className="block w-full">
                    <source srcSet="/img/membership/nine.webp" type="image/webp" />
                    <img src="/img/membership/nine.jpg" alt="A photograph of members" />
                </picture>
                <picture className="block w-full">
                    <source srcSet="/img/membership/ten.webp" type="image/webp" />
                    <img src="/img/membership/ten.jpg" alt="A photograph of members" />
                </picture>
                <picture className="block w-full">
                    <source srcSet="/img/membership/eleven.webp" type="image/webp" />
                    <img src="/img/membership/eleven.jpg" alt="A photograph of members" />
                </picture>
            </section>
        </>
    )
}

export default Membership;
