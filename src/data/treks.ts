import { VerifiedContent } from './types';

export type TrekDifficulty = 'easy' | 'moderate' | 'strenuous';

export interface TrekRoute {
  id: string;
  name: string;
  region: string;
  difficulty: TrekDifficulty;
  distanceKm: number;
  durationHours: number;
  bestSeason: string;
  permitRequired: boolean;
  permitNote: string;
  safetyEssentials: string[];
  // Verification gate: a route with no verifiedBy/verifiedDate must never
  // render in the public Trekking screen — see getPublishedTreks(). This
  // is enforced in code, not left as a content convention, because
  // trekking safety information is the one category where a wrong or
  // stale fact can put someone in real danger.
  verifiedBy: string | null;
  verifiedDate: string | null; // ISO date
}

// These two entries are intentionally unverified placeholders — they exist
// to prove the gate works, not to be shown to a real tourist. Nobody on the
// OotyMade team has walked and signed off on them yet. Do not flip
// verifiedBy/verifiedDate to make them public without an actual in-person
// verification.
export const treksContent: VerifiedContent & { routes: TrekRoute[] } = {
  lastVerified: '2026-09-19',
  sourceNote:
    'Trekking routes require in-person verification by someone who has walked them recently before they can publish — general route knowledge is not enough for safety-critical content.',
  routes: [
    {
      id: 'kotagiri-kodanad-trail',
      name: 'Kotagiri to Kodanad forest trail',
      region: 'Kotagiri',
      difficulty: 'moderate',
      distanceKm: 12,
      durationHours: 5,
      bestSeason: 'Needs verification',
      permitRequired: true,
      permitNote: 'Likely needs Forest Department clearance — not yet confirmed.',
      safetyEssentials: [],
      verifiedBy: null,
      verifiedDate: null,
    },
    {
      id: 'avalanche-upper-bhavani-trek',
      name: 'Avalanche to Upper Bhavani',
      region: 'Ooty (Nilgiri Biosphere Reserve)',
      difficulty: 'strenuous',
      distanceKm: 18,
      durationHours: 8,
      bestSeason: 'Needs verification',
      permitRequired: true,
      permitNote: 'Inside the Biosphere Reserve — needs Forest Office permission, details not yet confirmed.',
      safetyEssentials: [],
      verifiedBy: null,
      verifiedDate: null,
    },
  ],
};

export function getPublishedTreks(routes: TrekRoute[] = treksContent.routes): TrekRoute[] {
  return routes.filter((route) => Boolean(route.verifiedBy && route.verifiedDate));
}
