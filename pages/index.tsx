import Head from 'next/head';

import Instragram from './components/instagram';
import Twitter from './components/twitter';
import Strava from './components/strava';
import Instagram from './components/instagram';

const Index = () => {
    return (
      <>
        <Head>
            <title>Sitwell Cycling Club</title>
            <meta name="description" content="Founded 2016. Rotherham Advertiser Sports Awards Club of the Year 2018. 9 social rides a week. Go-Ride Coaching. Meet Brookside Pharmacy, Whiston." />
        </Head>
         <section className="media flex flex-row flex-wrap px-5 lg:px-10 mb-10">
            <article className="club-rides block relative w-full lg:w-7/12 lg:pr-5 mb-10 h-96">
                <a href="/rides" className="w-full h-full overflow-hidden">
                    <picture className="block w-full h-full">
                        <source srcSet="/img/rides.webp" type="image/webp" />
                        <img src="/img/rides.jpg" className="object-cover object-right w-full h-full" alt="A landscape photograph of a sunset over Whiston with two Clib riders up front" />
                    </picture>
                    <div className="absolute left-0 bottom-0 text-white p-5">
                        <h3 className="font-ropa text-lg uppercase">Club rides</h3>
                        <h2 className="font-ropa text-3xl">We’re here for the smiles, not&nbsp;the&nbsp;miles.</h2>
                        <p>Nine social rides a week on Wednesday evenings, and Saturday and Sunday mornings.</p>
                    </div>
                    <button className="btn absolute top-5 left-5" aria-label="Find out more">Find out more</button>
                </a>
            </article>
            <article className="charity block relative w-full lg:w-5/12 lg:pl-5 mb-10 h-96">
                <a href="/charity" className="w-full h-full overflow-hidden">
                    <picture className="block w-full h-full">
                        <source srcSet="/img/charity.webp" type="image/webp" />
                        <img src="/img/charity.jpg" className="object-cover object-right w-full h-full" alt="A landscape photograph of Club members at Rotherham Hospice" />
                    </picture>
                    <div className="absolute bottom-0 left-0 text-white lg:left-5 p-5">
                        <h3 className="font-ropa text-lg uppercase">Charity work</h3>
                        <h2 className="font-ropa text-3xl">We raise vital funds for&nbsp;local&nbsp;charities</h2>
                        <p>In 2019 we raised over £12,250 for Rotherham Hospice through a range of activities.</p>
                    </div>
                    <button className="btn absolute top-5 right-5" aria-label="Find out more">Find out more</button>
                </a>
            </article>
            <article className="races block relative w-full lg:w-5/12 lg:pr-5 mb-10 h-96">
                <a href="/races" className="w-full h-full overflow-hidden">
                    <picture className="block w-full h-full">
                        <source srcSet="/img/racing.webp" type="image/webp" />
                        <img src="/img/racing.jpg" className="object-cover object-right w-full h-full" alt="A photograph of Club member Joe Srike racing up Ulley Lane" />
                    </picture>
                    <div className="absolute top-0 right-0 lg:right-5 text-white text-right p-5 flex flex-col">
                        <h3 className="font-ropa text-lg uppercase">Races</h3>
                        <h2 className="font-ropa text-3xl">
                            We host races.<br />
                            We support races.<br />
                            We race.
                        </h2>
                        <p className="w-3/5 lg:w-2/5 self-end">Up hills, down hills, round tracks, circuits, and off road.</p>
                        <picture className="self-end">
                            <source srcSet="/img/epic-kitemark--white.webp" type="image/webp" />
                            <img src="/img/epic-kitemark--white.png" className="mt-2.5 w-10" alt="Equality and Parity In Cycling" />
                        </picture>
                    </div>
                    <button className="btn absolute right-5 lg:right-10 bottom-5" aria-label="Find out more">Find out more</button>
                </a>
            </article>
            <article className="coaching block relative w-full lg:w-7/12 lg:pl-5 mb-10 h-96">
                <a href="/coaching" className="w-full h-full overflow-hidden">
                    <picture className="block w-full h-full">
                        <source srcSet="/img/coaching.webp" type="image/webp" />
                        <img src="/img/coaching.jpg" className="object-cover object-right w-full h-full" alt="A photograph of Club Coach Chris Habershon with a group of children sat on the floor in front of him" />
                    </picture>
                    <div className="absolute top-0 left-0 lg:left-5 text-white p-5">
                        <h3 className="font-ropa text-lg uppercase">Go-ride coaching</h3>
                        <h2 className="font-ropa text-3xl">We’re coaching the&nbsp;next&nbsp;generation.</h2>
                        <p>Our Saturday morning sessions are suitable for under 16s.</p>
                    </div>
                    <button className="btn absolute right-5 bottom-5" aria-label="Find out more">Find out more</button>
                </a>
            </article>
        </section>

        <section className="socials grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-0.5 md:gap-x-5 px-5 lg:px-10 mb-20">
            <Instagram />
            <Twitter />
            <Strava />
        </section>
      </>
    )
}

export default Index;
