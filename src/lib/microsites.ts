// The club runs a couple of landing-page microsites on their own subdomains.
// Each one rewrites *every* path to a single page, so on those hosts a path can't
// be used to tell "a different page" from "a thing on this page" — which is why
// both the header (nav links) and the routes map (deep links) need to know which
// host they're on.

const ROUTES_HOST = 'routes.sitwell.cc';

export const MICROSITE_HOSTS = ['brand.sitwell.cc', ROUTES_HOST] as const;

// True on any microsite host: relative links go nowhere there.
export function isMicrosite(hostname: string): boolean {
  return (MICROSITE_HOSTS as readonly string[]).includes(hostname);
}

// True only on the routes microsite, whose root *is* the routes page — so a bare
// /<slug> there is a route, not a path into the main site.
export function isRoutesMicrosite(hostname: string): boolean {
  return hostname === ROUTES_HOST;
}
