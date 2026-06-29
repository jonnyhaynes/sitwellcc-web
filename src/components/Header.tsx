import { useEffect, useRef, useState } from 'react';

const Header = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', checkIfClickedOutside);
    return () => document.removeEventListener('click', checkIfClickedOutside);
  }, [open]);

  return (
    <header className="page-header flex-shrink-0 w-full max-w-screen-xl mx-auto mb-20">
      <div className="flex flex-row justify-between flex-wrap mt-10 px-5 lg:px-10 relative">
        <div className="navigation-wrapper flex flex-none w-1/3 lg:w-1/5 content-center order-2 lg:order-1">
          <div className={open ? 'navigation-wrapper--focus-within' : ''} ref={ref}>
            <button
              className="menu focus:outline-none -ml-2 lg:-ml-4 p-2 lg:p-4 rounded-none"
              aria-label="Menu"
              onClick={() => setOpen(!open)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 45"
                width="50"
                height="45"
                className="fill-current"
              >
                <rect x="0" y="10" width="20" height="5"></rect>
                <rect y="20" width="40" height="5"></rect>
                <rect x="0" y="30" width="30" height="5"></rect>
                <rect x="0" y="40" width="10" height="5"></rect>
                <rect x="0" width="50" height="5"></rect>
              </svg>
            </button>
            <nav className="navigation bg-black lg:w-1/4 absolute left-0 ml-3 lg:ml-6 p-2 lg:p-4 z-20">
              <ul className="mb-2 lg:mb-4">
                <li><a href="/rides" className="text-white block text-3xl font-ropa mb-2">Club rides</a></li>
                <li><a href="/coaching" className="text-white block text-3xl font-ropa mb-2">Go-Ride coaching</a></li>
                <li><a href="/races" className="text-white block text-3xl font-ropa mb-2">Races</a></li>
                <li><a href="/charity" className="text-white block text-3xl font-ropa">Charity work</a></li>
              </ul>
              <ul>
                <li><a href="/about" className="text-white block mb-1">About</a></li>
                <li><a href="/membership" className="text-white block mb-1">Membership</a></li>
                <li><a href="/kit" className="text-white block mb-1">Kit</a></li>
                <li><a href="/constitution" className="text-white block mb-1">Constitution</a></li>
                <li><a href="/welfare" className="text-white block mb-1">Welfare &amp; Safeguarding</a></li>
                <li><a href="/news" className="text-white block mb-1">News</a></li>
                <li><a href="/contact" className="text-white block mb-4">Contact</a></li>
              </ul>
              <a href="/membership" className="btn mb-1.5">Join us today</a>
            </nav>
          </div>
        </div>
        <div className="flex-grow flex flex-row w-full lg:w-3/5 justify-center order-1 lg:order-2 mb-10 lg:mb-0">
          <a href="/">
            <img src="/img/scc-logotype.svg" alt="Sitwell Cycling Club" width="250" height="75" />
          </a>
        </div>
        <div className="flex flex-row flex-none w-2/3 lg:w-1/5 content-center justify-end order-3">
          <a href="/membership" className="btn btn--large self-center whitespace-nowrap">Join us today</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
