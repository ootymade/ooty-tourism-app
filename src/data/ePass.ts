import { VerifiedContent } from './types';

export interface EPassFaq {
  question: string;
  answer: string;
}

export interface EPassContent extends VerifiedContent {
  officialPortalUrl: string;
  summary: string;
  whoNeedsIt: string[];
  whoIsExempt: string[];
  steps: string[];
  faqs: EPassFaq[];
}

export const ePassContent: EPassContent = {
  lastVerified: '2026-09-19',
  sourceNote:
    'Compiled from the official Nilgiris district e-pass portal and OotyMade\'s own visitor guide. Rules, fees and enforcement can change without notice — always confirm on the official portal before you travel, especially around peak season.',
  officialPortalUrl: 'https://epass.tnega.org',
  summary:
    'The Nilgiris E-Pass is a free online entry pass for private vehicles entering the district. It is checked at road checkposts and is separate from the small cash vehicle-entry fee collected at the checkpost itself. Apply before you reach the checkpost, not after — there is no on-the-spot registration counter for tourists.',
  whoNeedsIt: [
    'Private (non-commercial) vehicles without a TN-43 (Nilgiris) registration number',
    'Self-drive tourists entering from Kerala or Karnataka as well as within Tamil Nadu',
    'Rental cars and self-driven vehicles booked from outside the district',
  ],
  whoIsExempt: [
    'Vehicles registered under TN-43 (Nilgiris district)',
    'Passengers travelling by TNSTC/KSRTC government bus',
    'Passengers travelling on the Nilgiri Mountain Railway (toy train)',
    'Emergency vehicles and government duty vehicles',
    'Residents of the Nilgiris district',
  ],
  steps: [
    'Open epass.tnega.org on your phone or laptop before you travel.',
    'Choose "Within India" (or "Outside India" if you hold a foreign passport).',
    'Enter your mobile number and verify with the OTP sent by SMS.',
    'Fill in your vehicle registration number, number of passengers, travel dates, and the address you are staying at.',
    'Submit the form and download the approved E-Pass PDF — it has a QR code that is scanned at the checkpost.',
    'Keep a screenshot of the QR code as a backup in case of patchy signal at the checkpost.',
  ],
  faqs: [
    {
      question: 'Is the E-Pass the same as the vehicle entry fee?',
      answer:
        'No. The E-Pass itself is free. A separate small cash entry fee is collected for your vehicle at the checkpost — this is not paid online.',
    },
    {
      question: 'What happens if I arrive without an E-Pass?',
      answer:
        'Expect delays at the checkpost while staff help you register on the spot if possible, or you may be asked to complete it before proceeding — this depends on checkpost traffic and current enforcement, so it is best not to rely on it.',
    },
    {
      question: 'Can one E-Pass cover a family or group travelling together in one car?',
      answer:
        'Yes — the form asks for total passenger count for the vehicle, so one application covers everyone travelling in that car.',
    },
    {
      question: 'How long is the E-Pass valid for?',
      answer:
        'It is tied to the travel dates you enter on the form, not open-ended — apply for the specific dates of your trip.',
    },
    {
      question: 'Is there a daily limit on how many vehicles are allowed in?',
      answer:
        'Yes, entries are capped per day and can fill up on weekends and holidays, so apply a few days ahead if you can rather than the morning you travel.',
    },
  ],
};
