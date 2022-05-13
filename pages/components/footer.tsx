const Footer = () => {
    const date = new Date().getFullYear();

    return (
        <footer className="page-footer flex-shrink-0 w-full max-w-screen-xl mx-auto">
            <div className="flex flex-row justify-center flex-wrap mb-20 px-5 lg:px-10">
                <section className="stats grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-y-0.5 md:gap-x-5 w-full mb-20">
                    <img src="/img/stat-1.svg" alt="9 social rides a week" className="order-1" />
                    <img src="/img/stat-2.svg" alt="200+ members" className="order-2" />
                    <img src="/img/stat-3.svg" alt="2 overseas trips" className="order-3 md:order-4 lg:order-3" />
                    <img src="/img/stat-4.svg" alt="6 British Cycling coaches" className="order-4 md:order-3 lg:order-4" />
                </section>
                <section className="sponsors grid grid-cols-2 md:grid-cols-4 gap-10 w-full text-sm text-center mb-20">
                    <a href="https://www.expertbikerepair.co.uk/" className="flex content-center relative pb-7">
                        <img src="/img/expert-bike-repair.svg" alt="Expert Bike Repair" className="w-full" width="270" height="70" style={{width: 270, height: 70}} />
                        <p className="opacity-50 absolute bottom-0 left-0 w-full text-black">Club Sponsor</p>
                    </a>
                    <a href="https://www.facebook.com/andybishopbikefit/" className="flex content-center relative pb-7">
                        <img src="/img/andy-bishop.svg" alt="Andy Bishop Cycling Performance Centre" className="w-full" width="270" height="70" style={{width: 270, height: 70}} />
                        <p className="opacity-50 absolute bottom-0 left-0 w-full text-black">Club Sponsor</p>
                    </a>
                    <a href="https://www.thesitwell.co.uk/" className="flex content-center relative pb-7">
                        <img src="/img/the-sitwell-arms.svg" alt="The Sitwell Arms" className="w-full" width="270" height="70" style={{width: 270, height: 70}} />
                        <p className="opacity-50 absolute bottom-0 left-0 w-full text-black">Club Sponsor</p>
                    </a>
                    <a href="https://aswift.com/" className="flex content-center relative pb-7">
                        <img src="/img/aardvark-swift.svg" alt="Aardvark Swift" className="w-full" width="270" height="70" style={{width: 270, height: 70}} />
                        <p className="opacity-50 absolute bottom-0 left-0 w-full text-black">Member of the Year Sponsor</p>
                    </a>
                </section>
                <section className="copyright">
                    <p className="w-full text-sm text-center">&copy; { date } Sitwell Cycling Club and its members. Sitwell Cycling Club is a British Cycling Affiliated Go-Ride Club, and is affiliated to Cycling Time Trials.</p>
                    <p className="w-full text-sm text-center mb-10">A <a href="https://www.colouringcode.com">Colouring Code</a> design and build. Powered by <a href="https://nextjs.org/">Next.js</a> and <a href="https://vercel.com/">Vercel</a>. Sitwell CC Crest expertly crafted by <a href="https://stvsmth.co.uk/">Steve Smith</a>.</p>
                </section>
                <section className="logos flex flex-row flex-wrap w-full">
                    <div className="flex flex-row justify-center w-full lg:w-2/5 mb-10 lg:mb-0 lg:justify-end">
                        <a href="https://www.britishcycling.org.uk/club/profile/7596/sitwell-cycling-club" className="mr-10 self-center p-0 hover:border-none focus:border-none">
                            <picture>
                                <source srcSet="/img/bc-affiliated.webp 1x, /img/bc-affiliated@2x.webp 2x" type="image/webp" />
                                <img src="/img/bc-affiliated.png" srcSet="/img/bc-affiliated.png 1x, /img/bc-affiliated@2x.png 2x" alt="British Cycling Affilated Club" width="98" height="55" />
                            </picture>
                        </a>
                        <a href="https://www.britishcycling.org.uk/go-ride/article/goridest-What-is-Go-Ride" className="self-center p-0 hover:border-none focus:border-none">
                            <picture>
                                <source srcSet="/img/bc-goride.webp 1x, /img/bc-goride@2x.webp 2x" type="image/webp" />
                                <img src="/img/bc-goride.svg" srcSet="/img/bc-goride.png 1x, /img/bc-goride@2x.png 2x" alt="British Cycling Go-Ride Registered Club" width="98" height="55" />
                            </picture>
                        </a>
                    </div>
                    <div className="flex flex-row justify-center w-full lg:w-1/5 mb-10 lg:mb-0"><img src="/img/scc-crest.svg" alt="Sitwell Cycling Club" width="105" /></div>
                    <div className="flex flex-row justify-center w-full lg:w-2/5 lg:justify-start">
                        <img src="/img/scc-stripes.svg" alt="#ShowUsYourStripes" width="216" />
                    </div>
                    {/* <p className="w-full text-xs text-center opacity-50 mt-10"><small>Version: <strong>{{ env('BUILD_NUMBER', env('APP_ENV')) }}</strong></small></p> */}
                </section>
            </div>
        </footer>
    )
}

export default Footer;


