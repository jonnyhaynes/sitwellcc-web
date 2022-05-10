import Head from 'next/head'

const Contact = () => {
    return (
        <>
            <Head>
                <title>Contact // Sitwell Cycling Club</title>
                <meta name="description" content="Founded 2016. Rotherham Advertiser Sports Awards Club of the Year 2018. 9 social rides a week. Go-Ride Coaching. Meet Brookside Pharmacy, Whiston." />
            </Head>
            <section className="title w-full px-5 lg:px-10 mb-20">
                <h1 className="text-6xl font-ropa-bold mb-5">Get in touch</h1>
                <h2 className="text-3xl font-ropa">We love cycling</h2>
                <p className="text-sm lg:w-3/4">We aim to respond to all enquiries as soon as possible, but there might be a slight delay if the weather is good.</p>
            </section>
            <section className="w-full px-5 lg:px-10 mb-5 grid lg:grid-cols-3 lg:gap-5">
                <section className="lg:col-span-2 mb-5">
                    {/* @if(session('success'))
                        <p className="text-green text-sm bg-green bg-opacity-25 px-3.5 py-2 mb-5">Thanks for getting in touch.</p>
                    @endif
                    @if($errors->has('name') || $errors->has('email') || $errors->has('query') || $errors->has('info'))
                        <p className="text-red text-sm bg-red bg-opacity-25 px-3.5 py-2 mb-5">Please correct the errors below.</p>
                    @endif */}
                    <form method="POST" action="/contact">
                        <fieldset className="mb-5">
                            <label htmlFor="name" className="block text-sm mb-2">Name</label>
                            <input name="name" type="text" id="name" aria-describedby="name" className="w-1/2" value="" />
                        </fieldset>
                        <fieldset className="mb-5">
                            <label htmlFor="email" className="block text-sm mb-2">Email address</label>
                            <input name="email" type="email" id="email" aria-describedby="email" className="w-1/2" value="" />
                        </fieldset>
                        <fieldset className="mb-5">
                            <label htmlFor="query" className="block text-sm mb-2">Query</label>
                            <select name="query" id="query" aria-describedby="query" className="w-1/2">
                                <option value=""></option>
                                <option value="Club Rides">Club Rides</option>
                                <option value="Go-Ride coaching">Go-Ride coaching</option>
                                <option value="Races">Races</option>
                                <option value="Charity work">Charity work</option>
                                <option value="Membership">Membership</option>
                                <option value="Kit">Kit</option>
                                <option value="Welfare & Safeguarding">Welfare & Safeguarding</option>
                                <option value="Sponsorship">Sponsorship</option>
                                <option value="Other">Other</option>
                            </select>
                        </fieldset>
                        <fieldset className="mb-5">
                            <label htmlFor="info" className="block text-sm mb-2">Message</label>
                            <textarea name="info" id="info" rows={5} className="w-full"></textarea>
                        </fieldset>
                        <button type="submit" className="btn" aria-label="Send message">Send message</button>
                    </form>
                </section>
                <section className="lg:col-span-2">
                    <h3 className="text-xl font-ropa mb-1">Follow us on the socials</h3>
                    <ul className="flex mb-10">
                        <li>
                            <a href="https://www.instgram.com/sitwellcc">
                                <img src="/img/instagram.svg" className="w-10 mr-2.5" alt="Instagram icon" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.twitter.com/sitwellcc">
                                <img src="/img/twitter.svg" className="w-10 mr-2.5" alt="Twitter icon" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.strava.com/sitwellcc">
                                <img src="/img/strava.svg" className="w-10 mr-2.5" alt="Strava icon" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/sitwellcc">
                                <img src="/img/facebook.svg" className="w-10" alt="Facebook icon" />
                            </a>
                        </li>
                    </ul>
                </section>
            </section>

            <section className="w-full px-5 lg:px-10 mb-20 grid lg:grid-cols-3 lg:gap-5">
                <section className="mb-10 md:mb-0">
                    <h3 className="text-xl font-ropa">Club ride meet point</h3>
                    <p className="text-sm mb-2.5">Brookside Pharmacy, Whiston, S60 4HY</p>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d594.6325328356164!2d-1.3278540707379092!3d53.405344598749494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48797771ac7cb729%3A0xefaebacde08a4c54!2sSitwell%20Cycing%20Club!5e0!3m2!1sen!2suk!4v1615471881959!5m2!1sen!2suk" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" className="w-full"></iframe>
                </section>
                <section>
                    <h3 className="text-xl font-ropa">Herringthorpe Go-Ride coaching meet point</h3>
                    <p className="text-sm mb-2.5">Herringthorpe Playing Fields, S65 2HR</p>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2377.577895390717!2d-1.3385427841369621!3d53.42237477999504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48797731c1c4e535%3A0xfa2acc1afb74ead5!2sSitwell%20Cycling%20Club%20%3A%20Go-Ride%20Coaching!5e0!3m2!1sen!2suk!4v1615472068476!5m2!1sen!2suk" height="250" style={{ border: 0 }}  allowFullScreen loading="lazy" className="w-full"></iframe>
                </section>
                <section>
                    <h3 className="text-xl font-ropa">Clifton Go-Ride coaching meet point</h3>
                    <p className="text-sm mb-2.5">Clifton Community School, S65 2SN</p>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2377.0161638490713!2d-1.3399420985953423!3d53.432419257644675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4879769025682677%3A0xf649173c40582200!2sClifton%20Community%20School!5e0!3m2!1sen!2suk!4v1652198558911!5m2!1sen!2suk" height="250" style={{ border: 0 }}  allowFullScreen loading="lazy" className="w-full"></iframe>
                </section>
            </section>
        </>
    )
}

export default Contact;
