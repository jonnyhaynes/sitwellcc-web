import Head from 'next/head';
import Image from 'next/future/image';

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
                <p className="lg:w-3/4">You&apos;re more than welcome to come along for a couple of rides before deciding if we&apos;re the club for you, but we think our membership is great value for money. Membership runs January - December, and if you join from October onwards you&apos;ll be credited with the following year. Benefits include discounts on bike servicing and parts, bike fits, sports nutrition, bike insurance, and skincare, as well as access to club kit, socials and awards amongst a whole host of other things. First year members receive a club branded buff, stickers and <a href="https://onelifeid.com/">OneLifeiD</a> tags.</p>
            </section>
            <section className="membership w-full px-5 lg:px-10 mb-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <Image src="/img/membership/zero.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
                <Image src="/img/membership/one.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
                <Image src="/img/membership/two.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
                <Image src="/img/membership/three.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
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
                            <p className="text-xs mb-5">Club rides with parent/guardian</p>
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
                <Image src="/img/membership/four.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
                <Image src="/img/membership/five.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
                <Image src="/img/membership/six.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
                <Image src="/img/membership/seven.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
                <Image src="/img/membership/eight.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
                <Image src="/img/membership/nine.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
                <Image src="/img/membership/ten.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
                <Image src="/img/membership/eleven.webp" className="block w-full" alt="A photograph of members" width="285" height="285" />
            </section>
        </>
    )
}

export default Membership;
