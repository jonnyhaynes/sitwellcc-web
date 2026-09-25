import { MICROSITE_HOSTS, isMicrosite, isRoutesMicrosite } from './microsites';

describe('isMicrosite', () => {
  it('is true on the known microsite hosts', () => {
    expect(isMicrosite('brand.sitwell.cc')).toBe(true);
    expect(isMicrosite('routes.sitwell.cc')).toBe(true);
  });
  it('is false on the main site and in dev', () => {
    expect(isMicrosite('www.sitwell.cc')).toBe(false);
    expect(isMicrosite('sitwell.cc')).toBe(false);
    expect(isMicrosite('localhost')).toBe(false);
  });
  it('does not match a lookalike host that merely contains the name', () => {
    expect(isMicrosite('routes.sitwell.cc.evil.com')).toBe(false);
    expect(isMicrosite('notroutes.sitwell.cc')).toBe(false);
  });
  it('lists both microsites once', () => {
    expect(new Set(MICROSITE_HOSTS).size).toBe(MICROSITE_HOSTS.length);
  });
});

describe('isRoutesMicrosite', () => {
  it('is true only on the routes host', () => {
    expect(isRoutesMicrosite('routes.sitwell.cc')).toBe(true);
    expect(isRoutesMicrosite('brand.sitwell.cc')).toBe(false);
    expect(isRoutesMicrosite('www.sitwell.cc')).toBe(false);
    expect(isRoutesMicrosite('localhost')).toBe(false);
  });
});
