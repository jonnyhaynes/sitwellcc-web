import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/future/image';
import { useRouter } from 'next/router';

const Header = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [open, toggleOpen] = useState(false);
    const router = useRouter();

    const hide = useCallback(() => {
        toggleOpen(false);
      }, [toggleOpen]);

    useEffect(() => {
        const checkIfClickedOutside = (e: any) => {
            const currentRef: any = ref.current;

            if (open && currentRef && !currentRef.contains(e.target)) {
                toggleOpen(false);
            }
        };

        document.addEventListener('click', checkIfClickedOutside);

        return () => {
            document.removeEventListener('click', checkIfClickedOutside);
        };
      }, [open]);

      useEffect(() => {
        router.events.on('routeChangeStart', hide);

        return () => router.events.off('routeChangeStart', hide);
      }, [hide, router.events]);

    return (
        <header className="page-header flex-shrink-0 w-full max-w-screen-xl mx-auto mb-20">
            <div className="flex flex-row justify-between flex-wrap mt-10 px-5 lg:px-10 relative">
                <div className="navigation-wrapper flex flex-none w-1/3 lg:w-1/5 content-center order-2 lg:order-1">
                    <div className={ open ? 'navigation-wrapper--focus-within' : '' } ref={ref}>
                        <button className="menu focus:outline-none -ml-2 lg:-ml-4 p-2 lg:p-4 rounded-none" aria-label="Menu" onClick={() => toggleOpen(!open)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 45" width="50" height="45" className="fill-current">
                            <rect x="0" y="10" width="20" height="5"></rect>
                            <rect y="20" width="40" height="5"></rect>
                            <rect x="0" y="30" width="30" height="5"></rect>
                            <rect x="0" y="40" width="10" height="5"></rect>
                            <rect x="0" width="50" height="5"></rect>
                        </svg>
                        </button>
                        <nav className="navigation bg-black lg:w-1/4 absolute left-0 ml-3 lg:ml-6 p-2 lg:p-4 z-20">
                            <ul className="mb-2 lg:mb-4">
                                <li><Link href="/rides"><a className="text-white block text-3xl font-ropa mb-2">Club rides</a></Link></li>
                                <li><Link href="/coaching"><a className="text-white block text-3xl font-ropa mb-2">Go-Ride coaching</a></Link></li>
                                <li><Link href="/races"><a className="text-white block text-3xl font-ropa mb-2">Races</a></Link></li>
                                <li><Link href="/charity"><a className="text-white block text-3xl font-ropa">Charity work</a></Link></li>
                            </ul>
                            <ul>
                                <li><Link href="/about"><a className="text-white block mb-1">About</a></Link></li>
                                <li><Link href="/membership"><a className="text-white block mb-1">Membership</a></Link></li>
                                <li><Link href="/kit"><a className="text-white block mb-1">Kit</a></Link></li>
                                <li><Link href="/constitution"><a className="text-white block mb-1">Constitution</a></Link></li>
                                <li><Link href="/welfare"><a className="text-white block mb-1">Welfare &amp; Safeguarding</a></Link></li>
                                <li><Link href="/news"><a className="text-white block mb-1">News</a></Link></li>
                                <li><Link href="/contact"><a className="text-white block mb-4">Contact</a></Link></li>
                            </ul>
                            <Link href="/membership"><a className="btn mb-1.5">Join us today</a></Link>
                        </nav>
                    </div>
                </div>
                <div className="flex-grow flex flex-row w-full lg:w-3/5 justify-center order-1 lg:order-2 mb-10 lg:mb-0">
                    <Link href="/">
                        <a>
                            <Image src="/img/scc-logotype.svg" alt="Sitwell Cycling Club" width="250" height="75" />
                        </a>
                    </Link>
                </div>
                <div className="flex flex-row flex-none w-2/3 lg:w-1/5 content-center justify-end order-3">
                    <Link href="/membership">
                        <a className="btn btn--large self-center whitespace-nowrap">Join us today</a>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header;
