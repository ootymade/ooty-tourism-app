import { VerifiedContent } from './types';

export interface TrainStation {
  name: string;
  code: string;
}

export interface TrainLeg {
  from: string;
  to: string;
  departsApprox: string;
  arrivesApprox: string;
  durationApprox: string;
}

export interface ToyTrainContent extends VerifiedContent {
  irctcUrl: string;
  summary: string;
  stations: TrainStation[];
  legs: TrainLeg[];
  fareNote: string;
  bookingTips: string[];
}

export const toyTrainContent: ToyTrainContent = {
  lastVerified: '2026-09-19',
  sourceNote:
    'Timings are the long-running scheduled service pattern reported by IRCTC and rail enquiry sources; they shift with season, maintenance blocks and special trains, so treat them as indicative and always re-check on IRCTC before booking or planning your day around them.',
  irctcUrl: 'https://www.irctc.co.in',
  summary:
    'The Nilgiri Mountain Railway (NMR) is the UNESCO World Heritage rack-and-pinion toy train connecting Mettupalayam, at the foot of the hills, to Coonoor and Ooty. It is one of the steepest railways in Asia and the ride itself — not just the destination — is the point.',
  stations: [
    { name: 'Mettupalayam', code: 'MTP' },
    { name: 'Coonoor', code: 'ONR' },
    { name: 'Ooty (Udagamandalam)', code: 'UAM' },
  ],
  legs: [
    {
      from: 'Mettupalayam',
      to: 'Ooty',
      departsApprox: '~7:10 AM',
      arrivesApprox: '~12:00 PM',
      durationApprox: 'About 4h 45m',
    },
    {
      from: 'Ooty',
      to: 'Mettupalayam',
      departsApprox: '~2:00 PM',
      arrivesApprox: '~5:30 PM',
      durationApprox: 'About 3h 30m',
    },
  ],
  fareNote:
    'Fares vary by class (First Class vs Second Class) and by season, and are not reproduced here to avoid quoting stale numbers — check current fares directly on IRCTC when you book.',
  bookingTips: [
    'Book on IRCTC under the station codes MTP (Mettupalayam), ONR (Coonoor) and UAM (Ooty).',
    'The Mettupalayam–Ooty and Coonoor–Ooty legs sell out fast in peak season (April–June, and around Christmas/New Year) — book as early as IRCTC allows, typically up to 120 days ahead.',
    'First Class has forward-facing, better window seats; Second Class is more affordable but seating is bench-style.',
    'If the direct train is sold out, the Coonoor–Ooty short leg is a shorter, often easier-to-book alternative that still covers the most scenic stretch.',
    'Tatkal-style short-notice booking exists but is limited — do not count on getting a same-week seat in peak season.',
  ],
};
