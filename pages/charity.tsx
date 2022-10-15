import Head from 'next/head';
import Image from 'next/image';

import type { NextPage } from 'next';

const Charity: NextPage = () => {
    return (
        <>
            <Head>
                <title>Charity work // Sitwell Cycling Club</title>
                <meta name="description" content="Raising vital funds for local charities since 2016." />
            </Head>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold mb-5">Charity work</h1>
                <h2 className="text-3xl font-ropa">We raise vital funds for local charities.</h2>
                <p className="text-sm lg:w-3/4">In 2019 we raised over £12,250 for <a href="https://www.rotherhamhospice.org.uk/">Rotherham Hospice</a> through a range of activities and in the past we&apos;ve also raised funds for the <a href="https://www.cysticfibrosis.org.uk/">Cystic Fibrosis Trust</a>. This year our members have chosen <a href="https://www.bluebellwood.org/">Bluebell Wood</a> as the club&apos;s charity. Be on the lookout for ways to get involved.</p>
            </section>
            <section className="rides w-full px-5 lg:px-10 mb-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <picture className="block w-full md:col-span-2 lg:col-span-4">
                    <source srcSet="/img/rotherham-hospice.webp" type="image/webp" />
                    <Image src="/img/rotherham-hospice.jpg" className="w-full" alt="A landscape photograph of Club members outside Rotherham Hospice" width="1200" height="572" />
                </picture>
            </section>
        </>
    )
}

export default Charity;
