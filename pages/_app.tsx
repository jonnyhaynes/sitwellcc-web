/* eslint-disable @next/next/inline-script-id */
/* eslint-disable @next/next/no-script-component-in-head */
import Head from 'next/head';
import Script from 'next/script';
import {Analytics} from '@vercel/analytics/react';

import Layout from './components/layout';

import '../styles/app.css';

import type { AppProps } from 'next/app';

const App = ({ Component, pageProps} : AppProps) => {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* <title>@yield('title')</title>
                <meta name="description" content="@yield('description')">*/}

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
                <meta name="apple-mobile-web-app-title" content="Sitwell CC" />
                <meta name="application-name" content="Sitwell CC" />
                <meta name="msapplication-TileColor" content="#109a49" />
                <meta name="theme-color" content="#ffffff" />

                {/* Styles  */}

                {/* Scripts */}
                {/* <script src="{{ mix('js/app.js') }}" defer></script>
                <script type="module" src="{{ asset('js/alpine@2.8.0.min.js') }}"></script>
                <script nomodule src="{{ asset('js/alpine@2.8.0-ie11.min.js') }}" defer></script> */}

                {/* Global site tag (gtag.js) - Google Analytics */}
                <Script async src="https://www.googletagmanager.com/gtag/js?id=G-BTC2TSVGSD"></Script>
                <Script>
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-BTC2TSVGSD');
                    `}
                </Script>

                <Script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org/",
                            "@type": "SportsTeam",
                            "name": "Sitwell Cycling Club",
                            "sport": "Cycling",
                            "email": "team@sitwell.cc",
                            "url": "https://www.sitwell.cc",
                            "founder": "Jonny Haynes",
                            "logo": "https://www.sitwell.cc/img/scc-crest.svg",
                            "areaServed": {
                                "@type": "AdministrativeArea",
                                "name": "South Yorkshire"
                            },
                            "memberOf": [{
                                "@type": "SportsOrganization",
                                "name": "British Cycling"
                            }],
                            "sameAs" : [
                                "https://www.twitter.com/sitwellcc",
                                "https://www.facebook.com/sitwellcc",
                                "https://www.instagram.com/sitwellcc",
                                "https://www.strava.com/clubs/sitwellcc"
                            ]
                        }
                    `}
                </Script>
            </Head>

            <Layout>
                <Component {...pageProps} />
            </Layout>
            <Analytics />
        </>
    );
}

export default App;
