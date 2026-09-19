import { VerifiedContent } from './types';

export interface ShoppingItem {
  name: string;
  description: string;
  giTagged: boolean;
}

export interface ShoppingContent extends VerifiedContent {
  intro: string;
  items: ShoppingItem[];
  ootymadeUrl: string;
  disclosure: string;
}

export const shoppingContent: ShoppingContent = {
  lastVerified: '2026-09-19',
  sourceNote: 'OotyMade brand and product knowledge — not scraped from third-party listings.',
  intro:
    "A few things are genuinely worth carrying home from the Nilgiris. Buy from a shop you trust, whether that's us or someone else — here's what to look for.",
  items: [
    {
      name: 'Ooty Varkey',
      description:
        'A crisp, layered local biscuit and a GI (Geographical Indication) tagged Nilgiris product — the genuine version is made locally, not mass-produced.',
      giTagged: true,
    },
    {
      name: 'Nilgiris Tea',
      description:
        'High-altitude tea from Nilgiris estates, known for a brisk, aromatic character distinct from Assam or Darjeeling tea.',
      giTagged: true,
    },
    {
      name: 'Handmade Chocolate',
      description:
        'Small-batch chocolate made by local Nilgiris producers — worth seeking out over mass-market brands sold in tourist-strip shops.',
      giTagged: false,
    },
    {
      name: 'Eucalyptus Oil',
      description:
        'Distilled from Nilgiris-grown eucalyptus; genuine oil is pale, strongly scented and sold in small glass bottles — a common thing to be sold a diluted version of, so buy from a source you trust.',
      giTagged: false,
    },
  ],
  ootymadeUrl: 'https://ootymade.com',
  disclosure:
    'These are OotyMade\'s own products, made and sourced by us — shown here as our brand, not as a neutral third-party recommendation.',
};
