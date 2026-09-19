import { VerifiedContent } from './types';

export interface EmergencyContact {
  label: string;
  number: string;
  description: string;
}

export interface EmergencyContent extends VerifiedContent {
  contacts: EmergencyContact[];
}

export const emergencyContent: EmergencyContent = {
  lastVerified: '2026-09-19',
  sourceNote:
    'These are standardised nationwide (and Tamil Nadu state) emergency helpline numbers and work the same across India, not just in the Nilgiris.',
  contacts: [
    { label: 'Police', number: '100', description: 'All-India police emergency number.' },
    { label: 'Ambulance', number: '108', description: 'Free emergency medical response and ambulance.' },
    { label: 'Fire', number: '101', description: 'All-India fire and rescue services.' },
    { label: "Women's Helpline", number: '181', description: '24x7 helpline for women in distress.' },
    { label: 'Disaster Management', number: '1077', description: 'State disaster management helpline (landslides, flooding).' },
    { label: 'National Emergency Number', number: '112', description: 'Single number covering police, fire and ambulance if you are unsure which to call.' },
  ],
};
