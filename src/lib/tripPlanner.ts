import { Attraction, AttractionCategory, attractionsContent } from '../data';
import { formatDuration } from './attractionUtils';

export type PartyType = 'couple' | 'family' | 'group' | 'senior-friendly';
export type Pace = 'relaxed' | 'packed';
export type Interest = 'nature' | 'heritage' | 'shopping' | 'food' | 'adventure';
export type BaseLocation = 'Ooty' | 'Coonoor' | 'Kotagiri';

export interface PlannerInput {
  days: number; // 1–6
  party: PartyType;
  pace: Pace;
  interests: Interest[];
  base: BaseLocation;
}

export interface PlannedStop {
  attraction: Attraction;
  arriveTime: string; // "9:00 AM"
  departTime: string; // "10:15 AM"
}

export interface DayPlan {
  day: number;
  stops: PlannedStop[];
  lunchNote?: string;
  shoppingNote?: string;
}

export interface TripPlan {
  input: PlannerInput;
  days: DayPlan[];
  estimatedCostNote: string;
  unusedInterestNote?: string;
}

// Rough town-centre coordinates, used only to seed the nearest-neighbour
// sequencing — not survey-grade.
const BASE_COORDINATES: Record<BaseLocation, { latitude: number; longitude: number }> = {
  Ooty: { latitude: 11.4102, longitude: 76.695 },
  Coonoor: { latitude: 11.3512, longitude: 76.7963 },
  Kotagiri: { latitude: 11.4241, longitude: 76.8622 },
};

const INTEREST_CATEGORIES: Record<Interest, AttractionCategory[]> = {
  nature: ['lake', 'garden', 'waterfall'],
  heritage: ['heritage', 'museum'],
  adventure: ['wildlife', 'waterfall', 'viewpoint'],
  shopping: [], // handled separately — no attraction category maps to shopping
  food: [], // handled separately — no attraction category maps to food
};

const STRENUOUS_KEYWORDS = [
  'trek',
  'steep',
  'moderate fitness',
  'hike',
  'uneven terrain',
  'uphill',
  'limited mobility',
  'strenuous',
];

const STOPS_PER_DAY: Record<Pace, number> = {
  relaxed: 3,
  packed: 5,
};

function haversineKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function isStrenuous(attraction: Attraction) {
  const text = attraction.accessibilityNote.toLowerCase();
  return STRENUOUS_KEYWORDS.some((kw) => text.includes(kw));
}

function filterPool(interests: Interest[], party: PartyType): Attraction[] {
  const allowedCategories = new Set<AttractionCategory>();
  const relevantInterests = interests.filter((i) => INTEREST_CATEGORIES[i].length > 0);

  if (relevantInterests.length === 0) {
    // No category-mapped interest selected — use every category.
    attractionsContent.attractions.forEach((a) => allowedCategories.add(a.category));
  } else {
    relevantInterests.forEach((interest) => {
      INTEREST_CATEGORIES[interest].forEach((c) => allowedCategories.add(c));
    });
  }

  let pool = attractionsContent.attractions.filter((a) => allowedCategories.has(a.category));

  if (party === 'senior-friendly') {
    const gentlePool = pool.filter((a) => !isStrenuous(a));
    // Only apply the filter if it leaves something to visit — an empty
    // result would be worse than a couple of strenuous suggestions.
    if (gentlePool.length > 0) pool = gentlePool;
  }

  return pool;
}

function addMinutes(time: Date, minutes: number): Date {
  return new Date(time.getTime() + minutes * 60000);
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function travelBufferMinutes(distanceKm: number): number {
  // Ghat and town roads are slow — budget generously rather than
  // optimistically, matching the connectivity guide's own guidance.
  return Math.max(10, Math.round(distanceKm * 3));
}

export function generateTripPlan(input: PlannerInput): TripPlan {
  const { days, party, pace, interests, base } = input;
  const pool = [...filterPool(interests, party)];
  const stopsPerDay = STOPS_PER_DAY[pace];
  const dayPlans: DayPlan[] = [];

  let currentPoint = BASE_COORDINATES[base];
  const wantsFood = interests.includes('food');
  const wantsShopping = interests.includes('shopping');

  for (let day = 1; day <= days; day++) {
    const stops: PlannedStop[] = [];
    let clock = new Date(2000, 0, 1, 9, 0); // 9:00 AM, arbitrary date

    for (let i = 0; i < stopsPerDay && pool.length > 0; i++) {
      // Nearest unvisited attraction to the current point.
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      pool.forEach((candidate, index) => {
        const dist = haversineKm(currentPoint, { latitude: candidate.latitude, longitude: candidate.longitude });
        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestIndex = index;
        }
      });
      const [next] = pool.splice(nearestIndex, 1);

      const buffer = stops.length === 0 ? 0 : travelBufferMinutes(nearestDistance);
      const arrive = addMinutes(clock, buffer);
      const depart = addMinutes(arrive, next.visitDurationMinutes);

      stops.push({ attraction: next, arriveTime: formatClock(arrive), departTime: formatClock(depart) });

      clock = depart;
      currentPoint = { latitude: next.latitude, longitude: next.longitude };
    }

    dayPlans.push({
      day,
      stops,
      lunchNote: wantsFood
        ? 'Break for lunch around midday — see Food & Shopping for how we pick where to eat.'
        : undefined,
      shoppingNote:
        wantsShopping && day === days
          ? 'Before you head out: pick up Nilgiris tea, Ooty Varkey or handmade chocolate — see Food & Shopping.'
          : undefined,
    });
  }

  const unusedInterestNote =
    interests.includes('shopping') || interests.includes('food')
      ? 'Food and shopping interests add notes to your plan rather than timed stops — we don\'t invent specific restaurant names without a verified local list yet.'
      : undefined;

  return {
    input,
    days: dayPlans,
    estimatedCostNote:
      'Entry fees shown per stop are indicative (see each attraction\'s "Last verified" note) — carry small cash for gate tickets.',
    unusedInterestNote,
  };
}

export function planToChecklistText(plan: TripPlan): string {
  const lines: string[] = [`OotyMade trip plan — ${plan.days.length} day${plan.days.length > 1 ? 's' : ''}, based in ${plan.input.base}`, ''];

  plan.days.forEach((dayPlan) => {
    lines.push(`Day ${dayPlan.day}`);
    dayPlan.stops.forEach((stop) => {
      lines.push(
        `  [ ] ${stop.arriveTime}–${stop.departTime} — ${stop.attraction.name} (${formatDuration(stop.attraction.visitDurationMinutes)}, ${stop.attraction.priceAdult})`
      );
    });
    if (dayPlan.lunchNote) lines.push(`  [ ] ${dayPlan.lunchNote}`);
    if (dayPlan.shoppingNote) lines.push(`  [ ] ${dayPlan.shoppingNote}`);
    lines.push('');
  });

  lines.push(plan.estimatedCostNote);
  return lines.join('\n');
}
