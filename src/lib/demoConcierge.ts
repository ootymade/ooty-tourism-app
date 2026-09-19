// Demo mode: a rule-based, offline stand-in for the AI Concierge, used only
// when Supabase/Anthropic aren't configured yet (see isSupabaseConfigured in
// ./supabase.ts). It answers strictly from the same verified content the
// real concierge is grounded in — no network call, no model, so it can
// never fabricate a fact. It exists so the Ask tab's UX can be evaluated
// before committing to a paid Anthropic plan, not as a permanent feature —
// AskScreen switches back to the real askConcierge() automatically the
// moment Supabase is configured.

import {
  ePassContent,
  toyTrainContent,
  connectivityContent,
  emergencyContent,
  shoppingContent,
  attractionsContent,
  Attraction,
} from '../data';
import { isOpenNow, formatOpeningHours, formatDuration } from './attractionUtils';

interface Topic {
  keywords: string[];
  respond: () => string;
}

function findAttractionMatch(message: string): Attraction | undefined {
  const exact = attractionsContent.attractions.find((a) => message.includes(a.name.toLowerCase()));
  if (exact) return exact;

  // Fall back to the attraction's most distinctive word (usually the place
  // name itself, e.g. "Pykara" out of "Pykara Lake & Falls") so a shorter,
  // more natural question still matches.
  const GENERIC_WORDS = new Set(['the', 'lake', 'falls', 'peak', 'garden', 'park', 'point', 'rock', 'museum', 'church', 'fort']);
  return attractionsContent.attractions.find((a) =>
    a.name
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.length >= 4 && !GENERIC_WORDS.has(word) && message.includes(word))
  );
}

const topics: Topic[] = [
  {
    keywords: ['epass', 'e-pass', 'e pass', 'permit', 'checkpost', 'entry pass'],
    respond: () =>
      `${ePassContent.summary}\n\nApply at ${ePassContent.officialPortalUrl}. Who needs it: ${ePassContent.whoNeedsIt[0].toLowerCase()}.`,
  },
  {
    keywords: ['toy train', 'toytrain', 'mountain railway', 'nmr', 'irctc', 'mettupalayam'],
    respond: () => {
      const [leg] = toyTrainContent.legs;
      return `${toyTrainContent.summary}\n\n${leg.from} → ${leg.to}: departs ${leg.departsApprox}, arrives ${leg.arrivesApprox}. Book at ${toyTrainContent.irctcUrl} using station codes ${toyTrainContent.stations.map((s) => s.code).join(', ')}.`;
    },
  },
  {
    keywords: ['emergency', 'police', 'ambulance', 'fire', 'helpline', 'hospital', 'help'],
    respond: () =>
      emergencyContent.contacts.map((c) => `${c.label}: ${c.number}`).join('  ·  '),
  },
  {
    keywords: ['shop', 'buy', 'tea', 'chocolate', 'varkey', 'souvenir'],
    respond: () =>
      `${shoppingContent.intro}\n\n${shoppingContent.items.map((i) => `• ${i.name} — ${i.description}`).join('\n')}`,
  },
  {
    keywords: ['airport', 'coimbatore', 'bus', 'taxi', 'cab', 'train station', 'ghat', 'get to ooty', 'get here'],
    respond: () =>
      `Nearest airport: ${connectivityContent.airport.name} (${connectivityContent.airport.code}), ${connectivityContent.airport.routes[0].distanceApprox}, ${connectivityContent.airport.routes[0].durationApprox}. ${connectivityContent.localTransport.summary}`,
  },
];

export function askDemoConcierge(message: string): string {
  const lower = message.toLowerCase();

  const attractionMatch = findAttractionMatch(lower);
  if (attractionMatch) {
    const open = isOpenNow(attractionMatch);
    return `${attractionMatch.name} (${attractionMatch.region}) is ${open ? 'open' : 'closed'} right now. Hours: ${formatOpeningHours(attractionMatch.openingHours)}. Entry: ${attractionMatch.priceAdult}. Worth about ${formatDuration(attractionMatch.visitDurationMinutes)}.`;
  }

  if (lower.includes('open now') || lower.includes("what's open") || lower.includes('whats open')) {
    const openNow = attractionsContent.attractions.filter((a) => isOpenNow(a)).slice(0, 5);
    return openNow.length > 0
      ? `Open right now: ${openNow.map((a) => a.name).join(', ')}. Check the Explore tab for the full list with distances and prices.`
      : "Nothing in this starter list is open right now — check the Explore tab's hours for each attraction.";
  }

  for (const topic of topics) {
    if (topic.keywords.some((kw) => lower.includes(kw))) {
      return topic.respond();
    }
  }

  return "I'm running in offline demo mode, so I can only match a few topics directly: E-Pass, the toy train, attraction hours (try naming one, like \"Ooty Lake\"), emergency numbers, shopping, or getting here. Ask about one of those, or check the Explore, Travel or Plan tabs for everything else.";
}
