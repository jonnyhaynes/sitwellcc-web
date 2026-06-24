/* eslint-disable @next/next/inline-script-id */
import Head from 'next/head';
import Image from 'next/future/image';

import Accordion from './components/accordion';

import type {NextPage} from 'next';

type RideColor = 'green' | 'amber' | 'red' | 'brown';

interface Signup {
    name: string;
    count: number;
    entries: string[];
}

interface RideEvent {
    id: string;
    title: string;
    description: string;
    startTime: string;
    url: string;
    channelId: string;
    imageUrl: string | null;
    thumbnailUrl: string | null;
    signups: Signup[];
}

interface EventsResponse {
    count: number;
    events: RideEvent[];
}

// Discord channel IDs map to ride categories/colours.
const CHANNEL_COLORS: Record<string, RideColor> = {
    '1511799690310582443': 'red',
    '1511799767561277634': 'amber',
    '1511799912764018851': 'green',
    '1511799982876000356': 'brown',
};

const DATA = [
    {
        title: '1. Ride close together [within 2-3 feet of the rider in front and besides]. It makes the group easier to pass, is more social and helps tired riders keep up.',
        description:
            "If you're not comfortable riding on the outside, ask the rider on the inside to let you in (they slow, you go in front of them, the outside line moves up).  Getting comfortable riding tight together comes with practice. Riding in 2 tight lines is the Club's default group riding structure.",
    },
    {
        title: '2. Stay with your group, and make sure those behind can stay with you.',
        description:
            "Be aware of the riders behind you, they should be close (see above).  Ease-up if the rider behind you is struggling.  When riding up slight climbs, aim for consistent effort not consistent speed. <br><br>It's expected that the group will split on long climbs, so stop and regroup at the top (or shortly after).",
    },
    {
        title: '3. Ride at the pace of the rider beside you, if they slow, you slow.',
        description:
            "If you ride slightly in front of the rider beside you [known as half wheeling], they will speed up. Soon you'll be riding at 40mph and the group will be all over the road. If the rider besides is half wheeling you, tell them to ease-up.",
    },
    {
        title: "4. Ride directly behind the rider in front and you'll ensure everyone stays in a safe, tidy position.",
        description:
            'Riding in the middle [of the 2 riders in front] causes the rider on your outside to be pushed wider into the road, makes the group harder to pass and puts that rider in the wind.',
    },
    {
        title: "5. The gutter is full of stones, mud, and drain covers.  It's also pretty close to the edge of the road and is rubbish for riding in.",
        description:
            "If you ride in the gutter, you're forcing everyone behind you to do the same.  Drain covers are slippery and often wide enough to get your wheel stuck in. You should be riding to the right of drain covers, about 2 to 3 feet of the road edge.",
    },
    {
        title: "6. Braking smoothly, turning smoothly and making it obvious what you're doing will give other riders time to react and make the ride less stressful.",
        description:
            'Braking hard is particularly dangerous.  The concertina effect means riders further back have even less time to react.  No-one wants to do the whole ride on a high alert.  The smoother everyone is, the more relaxed everyone can be.',
    },
    {
        title: '7. If there are 2 riders on the front [side by side], passing them will cause you to ride 3 abreast and risk the group splitting.',
        description:
            "Controlling the pace of the ride is down to the riders on the front.  If you pass them, they can no longer control the pace.  If you want to ride on the front or come past, ask the rider in front.  It's also rare that the roads are quiet or wide enough to make it safe to ride 3 abreast.",
    },
    {
        title: '8. Ride at an inclusive pace when riding on the front and the group will stay together.',
        description:
            "When you're on the front, you are responsible for the pace of the group.  If you ride too fast, the group will split.  Be aware of who is in the group and their abilities.  Ride at a pace all can keep up with.",
    },
    {
        title: "9. Pedal on downhills when riding on the front so everyone doesn't run into the back of you.",
        description:
            "Wind resistance is exponential, you're going faster when going downhill so are hitting more wind than on the flats and far more than those behind.  When you're on the front of the group, pedal on the downhills.  It will stop riders behind you from having to brake.",
    },
    {
        title: '10. Overlapping your front wheel with the rear wheel of the rider in front could cause you to crash.',
        description:
            "If the rider in front moves out, and your wheel is there, you'll touch wheels.  When someone clips your front wheel you lose the ability to turn and balance.  It's very likely you will come off, as will everyone behind you.",
    },
    {
        title: '11. Ride Captains are there to keep the group together and safe. ',
        description:
            "Follow the Ride Captain's instructions on directions, group structure, stopping places, warnings about dangerous roads and junctions, regroups and general riding. If the Ride Captain tells you to slow down, ride tighter, watch your front wheel, keep in, move out, go forward, etc… please listen.",
    },
    {
        title: "12. A driver's ability, vision, reactions and even car performance effect when it's safe to pass. ",
        description:
            "Do not wave a vehicle past the group, leave the driver to decide when it's appropriate. ",
    },
    {
        title: '13. Lining out sometimes makes sense, but leave it to the Ride Captain to decide to avoid confusion.',
        description:
            "Lining out can often cause the group to split, it's scary for less experienced riders and often does not make it easier for a car to pass.  If everyone is shouting conflicting directions, it gets very confusing.  Check with the Ride Captain before shouting.",
    },
    {
        title: '14. "Car back" is probably the most unhelpful call in any group ride. No-one knows what they are supposed to do in response.',
        description:
            "There are often cars behind; They usually pass safely and without incident. Shouting “car back” can cause panic.  Riders may take it to mean they should line out, slow down or move over.  You're better to shout “keep it tight” or “Dave… move in”; It's far more clear.",
    },
    {
        title: '15. Pointing out potholes, gravel, branches, dead animals and other obstacles help keep the ride free from punctures, lost water bottles, broken wheels and crashes.',
        description:
            "Common calls are “Gravel”, “Hole”, “Move Out” or anything really. Try to make it clear what you mean and point to where it is.  When riding tight together, you're unlikely to see a dead animal in the road, especially at night. These gestures and shouts will make sure you avoid it.",
    },
    {
        title: '16. Regroup in a safe place. Groups of riders gathering by a junction makes it difficult for cars to see and navigate the junction.',
        description:
            "Since you're stopping anyway, it's tempting to regroup at the junction. No more than two abreast please. If several riders are stopped, a car [or worse, a lorry] must approach the junction on the wrong side of the road.  They may then have to turn left across the group [hazardous with a long vehicle].  Better to stop just after the junction, ideally at a layby or where the road is wider.",
    },
    {
        title: '17. Modern bike lights cast strong shadows and can dazzle the riders close behind. Dim them when riding in the group.',
        description:
            "For a rear light, a low, constant setting is far better for the vision and comfort of those behind. For your front light, use a low setting when not riding on the front and you'll avoid casting shadows of the riders in front affecting their vision.",
    },
    {
        title: '18. No-one likes a face full of cow poo. Run mudguards with a mudflap in the winter.',
        description:
            "Roads in our surrounding area are mucky in the winter. Tractors drag half the field onto the roads, the roads are gritted and often wet. Riding behind someone without mudguards in the wet is horrible. You're picking bits of grit out of your eyes for days and you'll never get that SCC jersey white again. A lot of mudguards don't come low enough, you need a mudflap too. <a href=\"https://rawmudflap.uk/product/6921/?RF:0,SH:undefined,FR:1,BK:1,NT:0,\">Club-branded ones are available from our supplier here.</a>",
    },
    {
        title: "19. Winter takes it's toll on bikes. Check your gears, rims, brakes and tyres before every ride.",
        description:
            'Salt rusts bolts and cables, seizing brakes and gears. Grit wears away brake pads and wears through rims. Wash, check and maintain your bike throughout the winter and you will spend less time standing around in the rain trying to fix your bike or waiting for others to fix theirs. <br><br>Club sponsor, Mark Burton at EBR can sort you out if you get stuck. Alternatively, ask on Slack, there are plenty of members who could give you a hand.',
    },
    {
        title: '20. Take the right equipment out with you.',
        description: `Helmets are required, and carrying a basic tool kit that includes the following is helpful:<br>
        Multi-tool<br>
        Tyre levers<br>
        Chain tool (chain breaker)<br>
        One inner tube (preferably two)<br>
        Spanner (with multiple size holes, helps with brake/pedal situations)<br>
        Spoke key<br>
        Mini pump (or gas canisters and valve)<br>
        An emergency tenner (useful at the cafe stop if nothing else)<br><br>
        There will usually be a tool for the job amongst us somewhere and hands on deck to help out. However, it's still wise to carry a toolkit of your own in case you have to head back home alone for any reason.`,
    },
];

const Rides: NextPage<{events: EventsResponse}> = ({events}) => {
    const rides = [...(events?.events ?? [])].sort(
        (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    const jsonLd = rides.map(event => ({
        '@context': 'https://schema.org/',
        '@type': 'SportsEvent',
        name: event.title,
        startDate: event.startTime,
        location: {
            '@type': 'Place',
            name: 'Brookside Pharmacy',
            address: 'Whiston, S60 4HY',
            geo: {
                '@type': 'GeoCoordinates',
                latitude: '53.405298',
                longitude: '-1.327339',
            },
        },
    }));

    return (
        <>
            <Head>
                <title>Club rides // Sitwell Cycling Club</title>
                <meta
                    name="description"
                    content="We're here for the smiles, not the miles."
                />
            </Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <svg className="hidden" aria-hidden="true">
                <symbol id="icon--distance" viewBox="0 0 200 200">
                    <path
                        d="M53,31.54A52.75,52.75,0,0,0,.2,84.29c0,11.38,7.1,30,17.6,48.39,9.77,17.08,22.47,33.85,35.16,44.25,12.68-10.4,25.38-27.17,35.15-44.25,10.51-18.36,17.6-37,17.6-48.39A52.75,52.75,0,0,0,53,31.54M170.64,21a29.16,29.16,0,0,0-29.16,29.16c0,6.31,4,16.69,9.82,26.93,5.38,9.41,12.36,18.66,19.34,24.47,7-5.81,14-15.06,19.35-24.47,5.86-10.24,9.81-20.62,9.81-26.93A29.16,29.16,0,0,0,170.64,21Zm0,46.7a14.36,14.36,0,1,1,10.15-4.21A14.27,14.27,0,0,1,170.64,67.7Zm-8.51,35.69a1,1,0,0,1-.94-1,1,1,0,0,1,1-.93h.88l.34,0h.34l.34,0h.06a1,1,0,0,1,.9,1,1,1,0,0,1-1,.9h0l-.33,0h-.32l-.33,0h-.85Zm-11.26,1a1,1,0,0,1-.36-1.89l.2,0,.33-.06.33-.06.32,0,.33-.06.33,0,.09,0a1,1,0,0,1,.29,1.9h-.08l-.32.06-.31,0-.32,0-.32.06-.31.06Zm-10.8,3.32a1,1,0,1,1-.75-1.77l.06,0,.3-.13.31-.13.3-.12.3-.12.31-.12.23-.1a1,1,0,0,1,.69,1.8l-.22.08-.29.12-.3.12-.29.12-.29.12-.29.12Zm-9.85,5.53a1,1,0,0,1-1.11-1.57l.27-.18.26-.19.27-.19.27-.18.28-.19.26-.17a1,1,0,0,1,1.06,1.6l-.26.17-.26.18-.26.18-.26.18-.26.18Zm-8.44,7.5a1,1,0,0,1-1.36.06,1,1,0,0,1-.06-1.35l.14-.16.23-.24.22-.25.23-.23.23-.25.22-.23.07-.07a1,1,0,0,1,1.37,1.35l-.06.06-.22.22-.22.24-.22.23-.21.23-.22.23Zm-6.62,9.15a1,1,0,0,1-1.67-1l.13-.23.17-.29.17-.29.17-.29.18-.29.18-.29a1,1,0,1,1,1.63,1l-.17.28-.17.28-.16.28-.17.28-.16.28Zm-4.49,10.36a1,1,0,1,1-1.83-.57l.09-.31L109,139l.11-.33.11-.33.11-.33.08-.23a1,1,0,0,1,1.81.64l-.07.21-.11.32-.11.32-.1.32-.11.32Zm-3.87,11a1,1,0,0,1-1.75-.8l.1-.22.14-.3.13-.3.13-.3.13-.3.13-.3h0a1,1,0,1,1,1.78.74h0l-.13.32-.13.31-.14.31-.14.31-.14.31Zm-6,10.07a1,1,0,0,1-1.55-1.14l0,0,.18-.26.19-.25.18-.26.18-.25.19-.26.15-.22a1,1,0,1,1,1.58,1.08l-.35.5-.19.27-.18.26-.2.27-.19.26Zm-8,8.58a1,1,0,0,1-1.26-1.44l.19-.17L92,168l.23-.2.22-.2.23-.21.22-.2.08-.08a1,1,0,0,1,1.32,1.4l-.09.08-.24.22-.23.21-.47.42-.24.21Zm-9.7,6.59a1,1,0,1,1-.89-1.71l0,0,.27-.14.26-.15.27-.14.26-.14.26-.15.27-.15h0a1,1,0,0,1,1.31.35,1,1,0,0,1-.35,1.31l0,0-.28.16-.27.15-.27.15-.28.15-.28.14-.27.15Zm-11,4.13a1,1,0,0,1-.47-1.86l.17,0,.3-.08.29-.07.29-.08.3-.08.29-.09.18-.05A1,1,0,1,1,74.1,180l-.2.06-.3.09-.3.08-.31.08-.31.08-.3.08ZM60.58,182a1,1,0,0,1,0-1.92h1.88a1,1,0,1,1,.09,1.92h-2ZM53,114.81a24.82,24.82,0,1,1,17.56-7.27A24.8,24.8,0,0,1,53,114.81Z"
                        fillRule="evenodd"
                    />
                </symbol>
                <symbol id="icon--speed" viewBox="0 0 199.92 151.91">
                    <path
                        d="M100,50.72a73.41,73.41,0,0,1,69.46,96.93c-.2.57-.4,1.15-.61,1.72H31.15c-.21-.57-.41-1.15-.61-1.72A73.41,73.41,0,0,1,100,50.72m0-26.63A99.95,99.95,0,0,0,14.58,176H185.42A100,100,0,0,0,100,24.09Z"
                        transform="translate(-0.04 -24.09)"
                    />
                    <path
                        d="M24.14,123.85a75.86,75.86,0,1,1,148.17,23h-7.19a69.06,69.06,0,1,0-130.24,0H27.69A75.5,75.5,0,0,1,24.14,123.85Z"
                        transform="translate(-0.04 -24.09)"
                    />
                    <path
                        d="M100,111.11c.38,0,.76,0,1.13,0l-8.95,13,0,0v0a10.44,10.44,0,1,0,17.45,11.46,10.09,10.09,0,0,0,1-1.88l0,0v0L116.1,119a20.38,20.38,0,1,1-16.1-7.89Z"
                        transform="translate(-0.04 -24.09)"
                    />
                    <path
                        d="M108.21,132.86a8.5,8.5,0,0,1-.75,1.43,7.89,7.89,0,1,1-13.18-8.66L104,111.5l26.68-38.83-16.49,44.19Z"
                        transform="translate(-0.04 -24.09)"
                    />
                </symbol>
                <symbol id="icon--time" viewBox="0 0 200 200">
                    <path
                        d="M100,0A100,100,0,1,0,200,100,100,100,0,0,0,100,0Zm0,180.82A80.82,80.82,0,1,1,180.82,100,80.83,80.83,0,0,1,100,180.82Z"
                        transform="translate(0 0)"
                    />
                    <circle cx="100.27" cy="100" r="12.57" />
                    <path
                        d="M100.71,106.4,61.37,80.49A5.11,5.11,0,0,1,67,72L99.84,93.6l43.82-38.22a5.1,5.1,0,0,1,6.71,7.69Z"
                        transform="translate(0 0)"
                    />
                    <rect x="151.55" y="98.47" width="36.54" height="3.06" />
                    <rect x="11.92" y="98.47" width="36.54" height="3.06" />
                    <rect x="98.47" y="11.92" width="3.06" height="36.54" />
                    <rect x="98.47" y="151.55" width="3.06" height="36.54" />
                </symbol>
            </svg>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold mb-5">Club rides</h1>
                <h2 className="text-3xl font-ropa">
                    We&apos;re here for the smiles, not the miles.
                </h2>
                <p className="lg:w-3/4">
                    Ten social rides a week on Wednesday evenings, and Saturday
                    and Sunday mornings. All rides meet outside Brookside
                    Pharmacy, Whiston (
                    <a href="https://goo.gl/maps/b4GQ4U8fdRn6J8A97">
                        S60 4HY - MAP
                    </a>
                    ). Plenty of on-street parking if you wish to drive over.
                    All of our rides are lead by an experienced member of the
                    club who we call Ride Captains. All weekend rides include a
                    cafe stop and aim to be back in the village for 1pm.
                    Wednesday evening rides last 90 minutes and we usually pop
                    in{' '}
                    <a href="https://www.thesitwell.co.uk/">The Sitwell Arms</a>{' '}
                    for a cheeky pop afterwards.
                </p>
            </section>
            <section className="rides w-full px-5 lg:px-10 mb-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <h3 className="w-full border-b-8 border-green mb-5 lg:mr-10">
                        <span className="inline-block bg-green text-white text-md font-ropa uppercase pt-2 px-3">
                            Road Green Rides
                        </span>
                    </h3>
                    <Image
                        className="block w-full"
                        src="/img/green-rides.webp"
                        alt="A photograph of club members sat around a table"
                        width="285"
                        height="285"
                    />
                    <div className="info text-green text-sm font-ropa-bold uppercase leading-none flex flex-row content-center pt-5 pb-5 border-b-8 border-green">
                        <div className="flex flex-row mr-3">
                            <svg className="w-7 h-7 fill-current mr-1">
                                <use xlinkHref="#icon--distance" />
                            </svg>
                            <p className="self-center">
                                30-40
                                <br />
                                Miles
                            </p>
                        </div>
                        <div className="flex flex-row mr-3">
                            <svg className="w-7 h-7 fill-current mr-1">
                                <use xlinkHref="#icon--speed" />
                            </svg>
                            <p className="self-center">
                                12-14
                                <br />
                                MPH
                            </p>
                        </div>
                        <div className="flex flex-row">
                            <svg className="w-6 h-6 fill-current mr-1">
                                <use xlinkHref="#icon--time" />
                            </svg>
                            <p className="self-center">Sat &amp; Sun 9am</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="w-full border-b-8 border-amber mb-5 lg:mr-10">
                        <span className="inline-block bg-amber text-white text-md font-ropa uppercase pt-2 px-3">
                            Road Amber Rides
                        </span>
                    </h3>
                    <Image
                        className="block w-full"
                        src="/img/amber-rides.webp"
                        alt="A photograph of members on a gavel track"
                        width="285"
                        height="285"
                    />
                    <div className="info text-amber text-sm font-ropa-bold uppercase leading-none flex flex-row content-center pt-5 pb-5 border-b-8 border-amber">
                        <div className="flex flex-row mr-3">
                            <svg className="w-7 h-7 fill-current mr-1">
                                <use xlinkHref="#icon--distance" />
                            </svg>
                            <p className="self-center">
                                40-50
                                <br />
                                Miles
                            </p>
                        </div>
                        <div className="flex flex-row mr-3">
                            <svg className="w-7 h-7 fill-current mr-1">
                                <use xlinkHref="#icon--speed" />
                            </svg>
                            <p className="self-center">
                                14-16
                                <br />
                                MPH
                            </p>
                        </div>
                        <div className="flex flex-row">
                            <svg className="w-6 h-6 fill-current mr-1">
                                <use xlinkHref="#icon--time" />
                            </svg>
                            <p className="self-center">
                                Wed 6:30pm
                                <br />
                                Sat &amp; Sun 8:30am
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="w-full border-b-8 border-red mb-5 lg:mr-10">
                        <span className="inline-block bg-red text-white text-md font-ropa uppercase pt-2 px-3">
                            Road Red Rides
                        </span>
                    </h3>
                    <Image
                        className="block w-full"
                        src="/img/red-rides.webp"
                        alt="A photograph of members in a peloton"
                        width="285"
                        height="285"
                    />
                    <div className="info text-red text-sm font-ropa-bold uppercase leading-none flex flex-row content-center pt-5 pb-5 border-b-8 border-red">
                        <div className="flex flex-row mr-3">
                            <svg className="w-7 h-7 fill-current mr-1">
                                <use xlinkHref="#icon--distance" />
                            </svg>
                            <p className="self-center">
                                50+
                                <br />
                                Miles
                            </p>
                        </div>
                        <div className="flex flex-row mr-3">
                            <svg className="w-7 h-7 fill-current mr-1">
                                <use xlinkHref="#icon--speed" />
                            </svg>
                            <p className="self-center">
                                16-18
                                <br />
                                MPH
                            </p>
                        </div>
                        <div className="flex flex-row">
                            <svg className="w-6 h-6 fill-current mr-1">
                                <use xlinkHref="#icon--time" />
                            </svg>
                            <p className="self-center">Sat &amp; Sun 8am</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="w-full border-b-8 border-brown mb-5 lg:mr-10">
                        <span className="inline-block bg-brown text-white text-md font-ropa uppercase pt-2 px-3">
                            Off-Road Rides
                        </span>
                    </h3>
                    <Image
                        className="block w-full"
                        src="/img/offroad-rides.webp"
                        alt="A photograph of members on an MTB trail"
                        width="285"
                        height="285"
                    />
                    <div className="info text-brown text-sm font-ropa-bold uppercase leading-none flex flex-row content-center pt-5 pb-5 border-b-8 border-brown">
                        <div className="flex flex-row mr-3">
                            <svg className="w-7 h-7 fill-current mr-1">
                                <use xlinkHref="#icon--distance" />
                            </svg>
                            <p className="self-center">
                                30-50+
                                <br />
                                Miles
                            </p>
                        </div>
                        <div className="flex flex-row mr-3">
                            <svg className="w-7 h-7 fill-current mr-1">
                                <use xlinkHref="#icon--speed" />
                            </svg>
                            <p className="self-center">
                                10-12
                                <br />
                                MPH
                            </p>
                        </div>
                        <div className="flex flex-row">
                            <svg className="w-6 h-6 fill-current mr-1">
                                <use xlinkHref="#icon--time" />
                            </svg>
                            <p className="self-center">
                                Wed 6:30pm
                                <br />
                                Sun 8am
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full px-5 lg:px-10 mb-20 grid lg:grid-cols-2 lg:gap-5">
                <section>
                    <h2 className="text-3xl font-ropa mb-1.5">
                        Upcoming rides
                    </h2>
                    {rides.map(event => {
                        const color =
                            CHANNEL_COLORS[event.channelId] ?? 'black';

                        const start = new Date(event.startTime);
                        const formatted = start
                            .toLocaleString('en-GB', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                hour: 'numeric',
                                minute: '2-digit',
                            })
                            .toUpperCase();

                        const accepted = event.signups?.find(signup =>
                            signup.name.toLowerCase().includes('accepted'),
                        );
                        const goingCount = accepted?.count ?? 0;

                        const image = event.thumbnailUrl ?? event.imageUrl;

                        return (
                            <article
                                className={`mb-5 border-t-8 border-${color} p-5 bg-${color} bg-opacity-25 flex flex-row`}
                                key={event.id}>
                                {image ? (
                                    <a
                                        href={event.url}
                                        className="block w-28 h-28 mr-5 overflow-hidden flex-shrink-0">
                                        <Image
                                            src={image}
                                            className="object-cover w-full h-full"
                                            alt={event.title}
                                            width="108"
                                            height="108"
                                        />
                                    </a>
                                ) : (
                                    <a
                                        href={event.url}
                                        aria-label={event.title}
                                        className={`block w-28 h-28 mr-5 flex-shrink-0 bg-${color} bg-opacity-25`}></a>
                                )}
                                <div className="flex flex-col flex-grow justify-between">
                                    <div className="w-full">
                                        <time
                                            dateTime={event.startTime}
                                            className="uppercase text-sm w-full self-start">
                                            {formatted}
                                        </time>
                                        <h4 className="text-2xl font-ropa leading-none w-full self-start">
                                            <a
                                                href={event.url}
                                                className={`text-${color}`}>
                                                {event.title}
                                            </a>
                                        </h4>
                                    </div>
                                    <div className="flex flex-row items-center w-full">
                                        <a
                                            href={event.url}
                                            className="btn self-start">
                                            View event
                                        </a>
                                        <p className="text-sm ml-5">
                                            {goingCount}{' '}
                                            {goingCount === 1
                                                ? 'rider'
                                                : 'riders'}{' '}
                                            going
                                        </p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </section>
                <section>
                    <h2 className="text-3xl font-ropa">
                        Thinking of joining us for a ride?
                    </h2>
                    <p className="mb-5">
                        Great! Here&apos;s some top tips to make sure we all
                        have a safe, enjoyable ride - click a point for futher
                        information.
                    </p>
                    {DATA.map((item, index) => {
                        return (
                            <Accordion
                                title={item.title}
                                description={item.description}
                                key={index}
                            />
                        );
                    })}
                </section>
            </section>
        </>
    );
};

export async function getServerSideProps({
    res: response,
}: {
    res: {setHeader: (key: string, value: string) => void};
}) {
    response.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=599',
    );

    let events: EventsResponse = {count: 0, events: []};

    try {
        const res = await fetch(
            'https://scc-apollo-events.fly.dev/api/events',
            {
                method: 'GET',
                headers: {Accept: 'application/json'},
            },
        );

        if (res.ok) {
            events = await res.json();
        }
    } catch (error) {
        console.error('Failed to fetch events', error);
    }

    return {props: {events}};
}

export default Rides;
