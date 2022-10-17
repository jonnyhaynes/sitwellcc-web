import Head from 'next/head';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

import type { NextPage } from "next";

const Kit: NextPage= () => {
    return (
        <>
            <Head>
                <title>Kit // Sitwell Cycling Club</title>
                <meta name="description" content="SCC + Bioracer = &hearts;" />
            </Head>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold mb-5">Kit</h1>
                <h2 className="text-3xl font-ropa">SCC + Bioracer = &hearts;</h2>
                <p className="lg:w-3/4">With a great range of items including casual wear and at a very competitive price point, <a href="https://shop-bioracer.co.uk/">Bioracer</a> have been the club&apos;s kit supplier since 2021. After all, if it&apos;s good enough for the Belgian, Dutch, German, Team DSM and <a href="https://www.ineosgrenadiers.com/article/ineos-grenadiers-and-castelli-part-ways-after-five-successful-seasons">Ineos Grenadiers</a> cycling teams as well as local team <a href="https://www.cyclingsheffield.com/bioracer/">Cycling Sheffield</a>, then it&apos;s good enough for us.</p>
            </section>
            <section className="races w-full px-5 lg:px-10 mb-20 grid lg:grid-cols-3 lg:gap-5">
                <section className="lg:col-start-3 mb-10 lg:mb-0">
                    <section className="p-5 bg-black bg-opacity-5">
                        <h3 className="text-2xl font-ropa">Ordering kit</h3>
                        <p className="text-sm mb-2">Ordering is easy. <strong>We place an order once every quarter.</strong> Usually the first two weeks in Janaury, April, July and October with the kit arriving around 6-8 weeks later.</p>
                        <p className="text-sm mb-5"><strong>Orders are placed through the Bioracer online portal available only to members.</strong></p>
                        <a className="btn" href="https://www.bioracer.co.uk/en/mybioracer">Order kit</a>
                    </section>
                </section>
                <section className="lg:col-span-2 lg:col-start-1 lg:row-start-1">
                    <div className="mb-5 border border-black border-opacity-5 block relative">
                        <ReactPlayer url="/video/jersey.mp4" muted={true} controls={true} width="100%" height="100%" />
                        <h2 className="font-ropa text-3xl absolute top-5 left-5">S/S Jersey</h2>
                        <a className="btn absolute bottom-5 right-5" href="https://www.bioracer.co.uk/en/mybioracer">Order kit</a>
                    </div>
                    <div className="mb-5 border border-black border-opacity-5 block relative">
                        <ReactPlayer url="/video/bib-shorts.mp4" muted={true} controls={true} width="100%" height="100%" />
                        <h2 className="font-ropa text-3xl absolute top-5 left-5">Bib Shorts</h2>
                        <a className="btn absolute bottom-5 right-5" href="https://www.bioracer.co.uk/en/mybioracer">Order kit</a>
                    </div>
                    <div className="mb-5 border border-black border-opacity-5 block relative">
                        <ReactPlayer url="/video/cap.mp4" muted={true} controls={true} width="100%" height="100%" />
                        <h2 className="font-ropa text-3xl absolute top-5 left-5">Cap</h2>
                        <a className="btn absolute bottom-5 right-5" href="https://www.bioracer.co.uk/en/mybioracer">Order kit</a>
                    </div>
                    <div className="mb-5 border border-black border-opacity-5 block relative">
                        <ReactPlayer url="/video/socks.mp4" muted={true} controls={true} width="100%" height="100%" />
                        <h2 className="font-ropa text-3xl absolute top-5 left-5">Socks</h2>
                        <a className="btn absolute bottom-5 right-5" href="https://www.bioracer.co.uk/en/mybioracer">Order kit</a>
                    </div>
                </section>
            </section>
        </>
    )
}

export default Kit;
