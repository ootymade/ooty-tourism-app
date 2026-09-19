import { VerifiedContent } from './types';

export interface RouteOption {
  label: string;
  distanceApprox: string;
  durationApprox: string;
  note: string;
}

export interface ConnectivityContent extends VerifiedContent {
  airport: {
    name: string;
    code: string;
    routes: RouteOption[];
  };
  railStations: {
    name: string;
    note: string;
  }[];
  busInfo: {
    operators: string[];
    majorOriginCities: string[];
    note: string;
  };
  localTransport: {
    summary: string;
    points: string[];
  };
  ghatRoadGuide: {
    summary: string;
    tips: string[];
    roadConditionUrl: string;
  };
}

export const connectivityContent: ConnectivityContent = {
  lastVerified: '2026-09-19',
  sourceNote:
    'Distances and drive times are approximate and depend on traffic, weather and the exact starting point — treat them as planning ranges, not promises, especially on the ghat sections.',
  airport: {
    name: 'Coimbatore International Airport',
    code: 'CJB',
    routes: [
      {
        label: 'Via Mettupalayam & Coonoor (most common)',
        distanceApprox: '~85–90 km',
        durationApprox: '~3.5–4 hours by road',
        note: 'Flat, four-lane road to Mettupalayam, then the Coonoor ghat with its well-known hairpin bends up to Ooty.',
      },
      {
        label: 'Via Mysore / Gudalur (from Karnataka side)',
        distanceApprox: 'Longer than the CJB route',
        durationApprox: 'Varies by origin',
        note: 'Relevant if you are coming from Bangalore/Mysore rather than flying into Coimbatore.',
      },
      {
        label: 'Via Masinagudi / Sigur Ghat',
        distanceApprox: 'Shorter cut-through from Mudumalai side',
        durationApprox: 'Saves roughly 30 km versus the Gudalur ghat',
        note: 'Useful if you are combining Ooty with Mudumalai National Park.',
      },
    ],
  },
  railStations: [
    {
      name: 'Mettupalayam',
      note: 'Where the Nilgiri Mountain Railway toy train begins — most travellers connect here from the Coimbatore/Chennai broad-gauge network.',
    },
    {
      name: 'Coimbatore Junction',
      note: 'The nearest major broad-gauge station with wide connectivity; from here it is road or a connecting train to Mettupalayam to pick up the toy train.',
    },
  ],
  busInfo: {
    operators: ['TNSTC (Tamil Nadu)', 'KSRTC (Karnataka)'],
    majorOriginCities: ['Coimbatore', 'Chennai', 'Bangalore', 'Mysore', 'Kochi'],
    note: 'Frequency is generally good from Coimbatore (multiple buses through the day) and thins out on longer routes like Chennai and Bangalore, which are mostly overnight services — check current timings with TNSTC/KSRTC directly, as schedules shift seasonally.',
  },
  localTransport: {
    summary:
      'Ooty runs on a local taxi-union fixed-rate structure rather than app-based ride-hailing.',
    points: [
      'Uber and Ola generally do not operate within Ooty town — this is normal, not a sign something is wrong with the app.',
      'Local taxi unions operate at fixed rates by destination/route, negotiated at your hotel, a taxi stand, or by phone.',
      'Auto-rickshaws cover short in-town hops; for day trips to attractions outside town, a taxi union car or a pre-booked driver is the norm.',
      'Ask your hotel for their tied-up driver\'s contact — it is usually the simplest way to get a fair local rate.',
    ],
  },
  ghatRoadGuide: {
    summary:
      'The main approach from Mettupalayam/Coimbatore is the Coonoor ghat road, a narrow, numbered-hairpin climb that gains most of the altitude in a short stretch.',
    tips: [
      'If you get motion sickness, take a tablet 30–45 minutes before the ghat starts climbing, not after you feel unwell.',
      'Sit toward the front of the vehicle and keep your eyes on the road ahead rather than a phone screen.',
      'Give yourself more time than a straight-line distance suggests — hairpin sections are slow by design, not due to traffic.',
      'Landslides and road closures do happen in heavy monsoon — check current road status before a monsoon-season trip rather than assuming the road you took last time is open.',
    ],
    roadConditionUrl: 'https://nilgiris.nic.in',
  },
};
