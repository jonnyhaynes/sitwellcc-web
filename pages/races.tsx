import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Image from 'next/future/image';

import type { NextPage } from 'next';

const Races: NextPage = () => {
    const ref = useRef<any>();
    const [open, toggleOpen] = useState(false);
    const [content, setContent] = useState(null);

    useEffect(() => {
        const checkIfClickedOutside = (e: any) => {
            if (open && ref.current && !ref.current.contains(e.target)) {
                toggleOpen(false);
                setContent(null);
            }
        };

        document.addEventListener('click', checkIfClickedOutside);

        return () => {
            document.removeEventListener('click', checkIfClickedOutside);
        };
      }, [open]);

    return (
        <>
            <Head>
                <title>Races // Sitwell Cycling Club</title>
                <meta name="description" content="We host races. We support races. We race." />
            </Head>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold mb-5 flex flex-row content-center">
                    <span>Races</span>
                    <a href="https://epic-group.org/" className="ml-5">
                        <Image src="/img/epic-kitemark.webp" alt="Equality and Parity In Cycling" width="40" height="55" />
                    </a>
                </h1>
                <h2 className="text-3xl font-ropa">We host races. We support races. We race.</h2>
                <p className="lg:w-3/4">Up hills, down hills, round tracks, circuits, and off road. We&apos;ve even had our stripes represented at National Championships. Throughout the year we host a handful of races, across multiple disciplines and age groups. Our members also support grassroots and national level races through the <a href="https://www.britishcycling.org.uk/accreditedmarshal">British Cycling Accredited Marshal Scheme</a>, as well as just being an extra pair of hands when required. <em>All of our races are <a href="https://epic-group.org/">EPiC Kitemark</a> certified</em>.</p>
            </section>
            <section className="races w-full px-5 lg:px-10 mb-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <div className="border-t-8 border-blue pt-5">
                    <a href="#" className="relative block w-full mb-5">
                        <Image src="/img/herringthorpe.webp" className="block w-full" alt="A photograph of children at a British Cycling Go-Race" width="285" height="285" />
                        <Image src="/img/go-race.webp" className="absolute bottom-5 right-5" alt="The British Cycling Go-Race logo" width="61" height="49" />
                        <button className="btn absolute bottom-5 left-5" aria-label="Coming soon">Coming soon</button>
                    </a>
                    <h3 className="text-base font-ropa block uppercase opacity-50">All year</h3>
                    <h2 className="text-2xl font-ropa text-blue">Go-Race</h2>
                    <p className="text-sm mb-2">Exciting entry-level competition for novice cyclists under the age of 16.</p>
                    <p className="text-sm mb-1">Sign on: <strong>Herringthorpe Playing Fields, S65 2HR</strong></p>
                    <p className="text-sm mb-2">Fee: <strong>TBA</strong></p>
                </div>
                <div className="border-t-8 border-amber pt-5">
                    <a href="https://www.britishcycling.org.uk/events/details/277009/Ranskill-Gold" className="relative block w-full mb-5">
                        <Image src="/img/ranskill.webp" className="block w-full" alt="A photograph of members at Ranskill" width="285" height="285" />
                        <Image src="/img/bc.webp" className="absolute bottom-5 right-5" alt="The British Cycling logo" width="88" height="50" />
                        <button className="btn absolute top-5 left-5" aria-label="Enter now">Enter now</button>
                    </a>
                    <h3 className="text-base font-ropa block uppercase opacity-50">March</h3>
                    <h2 className="text-2xl font-ropa text-amber">Ranskill Gold</h2>
                    <p className="text-sm mb-2">Three routes to choose from (40/60/80 miles) using familiar roads out east. Money raised goes to Bluebell Wood Children&apos;s Hospice.</p>
                    <p className="text-sm mb-1">Sign on: <strong>The Gordon Bennett Memorial Hall, S66 9AA</strong></p>
                    <p className="text-sm mb-2">Fee: <strong>£10</strong></p>
                </div>
                <div className="border-t-8 border-red pt-5">
                    <a href="https://www.britishcycling.org.uk/events/details/274539/Team-Pursuit-Open-Event-2023" className="relative block w-full mb-5">
                        <Image src="/img/winter-series.webp" className="block w-full" alt="A photograph of club member Jonny Haynes racing at York" width="285" height="285" />
                        <Image src="/img/bc.webp" className="absolute bottom-5 right-5" alt="The British Cycling logo" width="88" height="50" />
                        <button className="btn absolute bottom-5 left-5" aria-label="Enter now">Enter now</button>
                    </a>
                    <h3 className="text-base font-ropa block uppercase opacity-50">April</h3>
                    <h2 className="text-2xl font-ropa text-red">Team Pursuit Open</h2>
                    <p className="text-sm mb-2">An afternoon of track racing at Derby Arena. Seniors, masters, all-male, all-female or mixed teams. Paracyclists and tandems welcomed.</p>
                    <p className="text-sm mb-1">Sign on: <strong>Derby Arena, DE24 8JB</strong></p>
                    <p className="text-sm">Fee: <strong>£100</strong> (Four person team)</p>
                </div>
                {/* <div className="border-t-8 border-red pt-5">
                    <a href="https://www.facebook.com/groups/418279868887120" className="relative block w-full">
                        <picture className="block w-full mb-5">
                            <source srcSet="/img/winter-series.webp" type="image/webp" />
                            <img src="/img/winter-series.jpg" alt="A photograph of club member Jonny Haynes racing at York" />
                        </picture>
                        <picture className="absolute top-5 left-5">
                            <source srcSet="/img/bc-yorkshire.webp" type="image/webp" />
                            <img src="/img/bc-yorkshire.png" alt="The British Cycling Yorkshire logo" />
                        </picture>
                        <button className="btn absolute bottom-5 left-5" aria-label="Find out more">Find out more</button>
                    </a>
                    <h3 className="text-base font-ropa block uppercase opacity-50">April</h3>
                    <h2 className="text-2xl font-ropa text-red">BC Yorkshire Winter Series</h2>
                    <p className="text-sm mb-2">A collective effort by clubs from around the Yorkshire region to provide early bird race opportunities each year.</p>
                    <p className="text-sm mb-1">Sign on: <strong>Doncaster Dome, DN4 7PD</strong></p>
                    <p className="text-sm">Fee: <strong>£12</strong></p>
                </div> */}
                <div className="border-t-8 border-red pt-5">
                    <div className="relative mb-5">
                        <Image src="/img/kilo.webp" className="block w-full" alt="A photograph of James Fox racing at Thurcroft" width="285" height="285" />
                        <Image src="/img/ctt.webp" className="absolute bottom-5 left-5" alt="The Cycling Time Trials logo" width="55" height="50" />
                    </div>
                    <h3 className="text-base font-ropa block uppercase opacity-50">July</h3>
                    <h2 className="text-2xl font-ropa text-red">Club Kilo</h2>
                    <p className="text-sm mb-2">A flat kilometer to test yourself on. Beware of the sting in the tail.</p>
                    <p className="text-sm mb-1">Course: <strong>OC1kmHH</strong></p>
                    <p className="text-sm mb-1">Sign on: <strong>End of course</strong></p>
                    <p className="text-sm mb-2">Fee: <strong>£3</strong></p>
                    <p className="text-sm mb-2"><em>Club members only</em>.</p>
                    {/* <p className="text-sm text-green cursor-pointer" @click="fetch('/kilo-results').then(response => response.text()).then(html => { $refs.modal.innerHTML = html; openmodal = true; })">View records and results</p> */}
                </div>
                {/* <div className="border-t-8 border-amber pt-5">
                    <div className="relative">
                        <picture className="block w-full mb-5">
                            <source srcSet="/img/kilo.webp" type="image/webp" />
                            <img src="/img/kilo.jpg" alt="A photograph of James Fox racing at Thurcroft" />
                        </picture>
                        <picture className="absolute bottom-5 right-5" >
                            <source srcSet="/img/bc.webp" type="image/webp" />
                            <img src="/img/bc.png" alt="The British Cycling logo" />
                        </picture>
                    </div>
                    <h3 className="text-base font-ropa block uppercase opacity-50">May</h3>
                    <h2 className="text-2xl font-ropa text-amber">Ride and Seek</h2>
                    <p className="text-sm mb-2">A self-supported, orienteering ride.</p>
                    <p className="text-sm mb-1">Sign on: <strong>TBA</strong></p>
                    <p className="text-sm mb-2">Fee: <strong>TBA</strong></p>
                    <p className="text-sm mb-2"><em>Club members only</em>.</p>
                </div> */}
                <div className="border-t-8 border-red pt-5">
                    <div className="relative mb-5">
                        <Image src="/img/hill-climb.webp" className="block w-full" alt="A photograph of the finish board at Ulley" width="285" height="285" />
                        <Image src="/img/ctt.webp" className="absolute bottom-5 left-5" alt="The Cycling Time Trials logo" width="55" height="50" />
                    </div>
                    <h3 className="text-base font-ropa block uppercase opacity-50">July</h3>
                    <h2 className="text-2xl font-ropa text-red">Club Hill Climb</h2>
                    <p className="text-sm mb-2">621m of pure unadulterated climbing in the natural ampitheatre surrounding Ulley Resevoir.</p>
                    <p className="text-sm mb-1">Course: <strong>OHC19</strong></p>
                    <p className="text-sm mb-1">Sign on: <strong>Top of the hill</strong></p>
                    <p className="text-sm mb-2">Fee: <strong>£3</strong></p>
                    <p className="text-sm mb-2"><em>Club members only</em>.</p>
                    {/* <p className="text-sm text-green cursor-pointer" @click="fetch('/hc-results').then(response => response.text()).then(html => { $refs.modal.innerHTML = html; openmodal = true; })">View records and results</p> */}
                </div>
                <div className="border-t-8 border-red pt-5">
                    <a href="https://www.britishcycling.org.uk/events/details/281410/SCC-Presents--The-Dinnington-Dynamo" className="relative block w-full mb-5">
                        <Image src="/img/firbeck.webp" className="block w-full" alt="A photograph of club member Tom George racing at Firbeck" width="285" height="285" />
                        <Image src="/img/bc.webp" className="absolute bottom-5 right-5" alt="The British Cycling logo" width="88" height="50" />
                        <button className="btn absolute top-5 left-5" aria-label="Enter now">Enter now</button>
                    </a>
                    <h3 className="text-base font-ropa block uppercase opacity-50">July</h3>
                    <h2 className="text-2xl font-ropa text-red">The Dinnington Dynamo</h2>
                    <p className="text-sm mb-2">A Mens and Womens 3/4 race on the undulating course around the sleepy market town of Dinnington on the South Yorkshire and Nottinghamshire border.</p>
                    <p className="text-sm mb-1">Sign on: <strong>Dinnington RUFC, S25 2PB</strong></p>
                    <p className="text-sm mb-2">Fee: <strong>25</strong></p>
                </div>
                <div className="border-t-8 border-red pt-5">
                    <a href="https://www.cyclingtimetrials.org.uk/race-details/24951" className="relative block w-full mb-5">
                        <Image src="/img/open.webp" className="block w-full" alt="A photograph of club member Joe Strike racing at Ulley" width="285" height="285" />
                        <Image src="/img/ctt.webp" className="absolute top-5 right-5" alt="The Cycling Time Trials logo" width="55" height="50" />
                        <button className="btn absolute bottom-5 right-5" aria-label="Enter now">Enter now</button>
                    </a>
                    <h3 className="text-base font-ropa block uppercase opacity-50">August</h3>
                    <h2 className="text-2xl font-ropa text-red">Open Hill Climb</h2>
                        <p className="text-sm mb-2">692m of pure unadulterated climbing in the natural ampitheatre surrounding Ulley Resevoir.</p>
                        <p className="text-sm mb-1">Course: <strong>OHC24</strong></p>
                        <p className="text-sm mb-1">Sign on: <strong>Ulley Village Hall, S66 2DD</strong></p>
                        <p className="text-sm mb-2">Fee: <strong>£12</strong></p>
                        {/* <p className="text-sm text-green cursor-pointer" @click="fetch('/open-results').then(response => response.text()).then(html => { $refs.modal.innerHTML = html; openmodal = true; })">View records and results</p> */}
                </div>
            </section>

            {open && (
                <section className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                    <div className="text-left bg-white w-full md:m-5 lg:m-10 md:max-w-5xl h-full md:h-auto overflow-y-scroll md:overflow-y-hidden"></div>
                </section>
            )}
        </>
    )
}

export default Races;
