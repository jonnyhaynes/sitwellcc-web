import base64 from 'base-64';

export type RideColor = 'green' | 'amber' | 'red' | 'brown' | 'blue' | 'black';

// Discord channel IDs (Apollo feed) map to ride categories/colours.
const CHANNEL_COLORS: Record<string, RideColor> = {
  '1511799690310582443': 'red',
  '1511799767561277634': 'amber',
  '1511799912764018851': 'green',
  '1511799982876000356': 'brown',
};

// Literal Tailwind class strings per ride colour. These MUST be written out in
// full (no interpolation) so Tailwind v4's source scanner detects them — dynamic
// `bg-${color}` strings are invisible to the compiler and would not be generated.
export const RIDE_CLASSES: Record<
  RideColor,
  { border: string; bg: string; text: string }
> = {
  green: { border: 'border-green', bg: 'bg-green/25', text: 'text-green' },
  amber: { border: 'border-amber', bg: 'bg-amber/25', text: 'text-amber' },
  red: { border: 'border-red', bg: 'bg-red/25', text: 'text-red' },
  brown: { border: 'border-brown', bg: 'bg-brown/25', text: 'text-brown' },
  blue: { border: 'border-blue', bg: 'bg-blue/25', text: 'text-blue' },
  black: { border: 'border-black', bg: 'bg-black/25', text: 'text-black' },
};

// A single normalised ride, regardless of which feed it came from.
export interface Ride {
  id: string;
  title: string;
  startTime: string; // ISO 8601
  url: string;
  color: RideColor;
  image: string | null;
  goingCount: number | null; // null when the source has no signup data (Ticket Tailor)
}

// Derive a colour for a Ticket Tailor event from its name (legacy keyword logic).
const tickettailorColor = (name: string): RideColor => {
  switch (true) {
    case name.includes('RED'):
    case name.includes('Bank Holiday Blowout'):
    case name.includes('Club Competitions'):
      return 'red';
    case name.includes('AMBER'):
    case name.includes('Wing it Wednesday™ - Road'):
      return 'amber';
    case name.includes('GREEN'):
    case name.includes('Fancy Dress'):
    case name.includes('Birthday Ride'):
      return 'green';
    case name.includes('Off-Road'):
    case name.includes('GRAVEL'):
      return 'brown';
    default:
      return 'black';
  }
};

// Strip the leading "Saturday RED Ride -" style prefix from Ticket Tailor names.
const cleanTickettailorName = (name: string): string => {
  const regex = /(Saturday|Sunday|) (RED|AMBER|GREEN|GRAVEL) Ride( |)(-|–|:)/m;
  return name.replace(regex, '').trim();
};

// A key for de-duplication: normalised title + start instant rounded to the
// minute. Parsing to epoch makes it robust to differing ISO offset formats
// (e.g. "+01:00" vs "Z") between the two feeds.
const dedupeKey = (title: string, startTime: string): string => {
  const minute = Math.round(new Date(startTime).getTime() / 60000);
  return `${title.trim().toLowerCase()}|${minute}`;
};

// Europe/London's UTC offset (ms) at a given instant. Positive = ahead of UTC.
// Works by reading the same instant back as London wall-clock and diffing.
function londonOffsetMs(at: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(at);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour') === 24 ? 0 : get('hour'),
    get('minute'),
    get('second'),
  );
  return asUtc - Math.floor(at.getTime() / 1000) * 1000;
}

// The current week's bounds (Mon 00:00 – Sun 23:59:59.999) in Europe/London,
// returned as UTC millisecond instants. Correct year-round across BST/GMT.
function currentWeekBounds(): { startMs: number; endMs: number } {
  const now = new Date();
  const offset = londonOffsetMs(now);

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';

  const weekdays: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  const dayIndex = weekdays[get('weekday')] ?? 0;
  const dayMs = 24 * 60 * 60 * 1000;

  const midnightTodayWall = Date.UTC(
    Number(get('year')),
    Number(get('month')) - 1,
    Number(get('day')),
  );
  const mondayWall = midnightTodayWall - dayIndex * dayMs;

  const startMs = mondayWall - offset;
  const endMs = mondayWall + 7 * dayMs - 1 - offset;

  return { startMs, endMs };
}

// Fetch upcoming events from the Ticket Tailor API, normalised to Ride[].
async function fetchTickettailorRides(start: number, end: number): Promise<Ride[]> {
  const baseURL = import.meta.env.TICKET_TAILOR_BASE_URL || '';
  const apiKey = import.meta.env.TICKET_TAILOR_API_KEY || '';

  if (!baseURL || !apiKey) return [];

  const limit = 50;

  try {
    const res = await fetch(
      `${baseURL}events?start_at.gte=${start}&end_at.lte=${end}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${base64.encode(`${apiKey}:`)}`,
        },
      },
    );

    if (!res.ok) return [];

    const body = await res.json();

    return (body?.data ?? [])
      // Only show published events; the API also returns drafts.
      .filter((event: any) => event.status === 'published')
      .map((event: any): Ride => {
        const startTime: string = event.start.iso;
        // Ticket Tailor events on a Saturday are always blue; otherwise keyword-derived.
        const isSaturday =
          new Date(startTime).toLocaleString('en-GB', {
            weekday: 'long',
            timeZone: 'Europe/London',
          }) === 'Saturday';
        const color: RideColor = isSaturday ? 'blue' : tickettailorColor(event.name);

        return {
          id: `tt-${event.id}`,
          title: cleanTickettailorName(event.name),
          startTime,
          url: event.checkout_url,
          color,
          image: event.images?.thumbnail ?? null,
          goingCount: null,
        };
      });
  } catch (error) {
    console.error('Failed to fetch Ticket Tailor events', error);
    return [];
  }
}

// Fetch upcoming events from the Apollo events API, normalised to Ride[].
async function fetchApolloRides(): Promise<Ride[]> {
  try {
    const res = await fetch('https://scc-apollo-events.fly.dev/api/events', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return [];

    const body = await res.json();

    return (body?.events ?? []).map((event: any): Ride => {
      const accepted = event.signups?.find((signup: any) =>
        signup.name?.toLowerCase().includes('accepted'),
      );

      return {
        id: `apollo-${event.id}`,
        title: event.title,
        startTime: event.startTime,
        url: event.url,
        color: CHANNEL_COLORS[event.channelId] ?? 'black',
        image: event.thumbnailUrl ?? event.imageUrl ?? null,
        goingCount: accepted?.count ?? 0,
      };
    });
  } catch (error) {
    console.error('Failed to fetch Apollo events', error);
    return [];
  }
}

// Fetch + merge + dedupe + sort the current week's rides from both feeds.
export async function getUpcomingRides(): Promise<Ride[]> {
  // Current week: Monday 00:00 to Sunday 23:59:59, Europe/London.
  const { startMs, endMs } = currentWeekBounds();
  const start = Math.floor(startMs / 1000);
  const end = Math.floor(endMs / 1000);

  const [tickettailor, apollo] = await Promise.all([
    fetchTickettailorRides(start, end),
    fetchApolloRides(),
  ]);

  // Apollo first so it wins de-duplication (it carries signup counts).
  const merged = [...apollo, ...tickettailor];

  const seen = new Set<string>();
  return merged
    .filter((ride) => {
      const ms = new Date(ride.startTime).getTime();
      return ms >= startMs && ms <= endMs;
    })
    .filter((ride) => {
      const key = dedupeKey(ride.title, ride.startTime);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}
