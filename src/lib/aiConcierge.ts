import { supabase } from './supabase';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ConciergeResponse {
  reply: string;
  supportUrl: string;
}

export const SUPPORT_URL = 'https://tourism.ootymade.com';

// Calls the ai-concierge Supabase Edge Function (see
// supabase/functions/ai-concierge/index.ts). That function isn't deployed
// yet — until a real Supabase project has the secrets configured, this
// will reject, and callers should fall back to the WhatsApp/support CTA
// rather than showing a raw network error.
export async function askConcierge(
  message: string,
  history: ChatMessage[],
  language: 'en' | 'ta'
): Promise<ConciergeResponse> {
  const { data, error } = await supabase.functions.invoke<ConciergeResponse>('ai-concierge', {
    body: { message, history, language },
  });

  if (error || !data) {
    throw new Error(error?.message ?? 'The AI concierge is unavailable right now.');
  }

  return data;
}
